import { cp, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type HomeIndexLink = {
  label: string;
  href: string;
  description: string;
  mutable?: boolean;
};

type HomeIndexGroup = {
  title: string;
  links: HomeIndexLink[];
};

type HomeIndexContent = {
  eyebrow: string;
  title: string;
  body: string;
  groups: HomeIndexGroup[];
};

type CloneRequest = {
  action: "clone";
  href: string;
  label: string;
  slug: string;
};

type DeleteRequest = {
  action: "delete";
  href: string;
};

type PageIndexRequest = CloneRequest | DeleteRequest;

const appDir = path.join(process.cwd(), "src", "app");
const homeContentPath = path.join(process.cwd(), "src", "content", "home.json");
const mutableGroupTitles = new Set<string>();
const segmentPattern = /^[a-z0-9-]+$/;

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Page index actions are disabled in production.", 403);
  }

  let body: PageIndexRequest;

  try {
    body = (await request.json()) as PageIndexRequest;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    if (body.action === "clone") {
      return Response.json(await clonePage(body));
    }

    if (body.action === "delete") {
      return Response.json(await deletePage(body));
    }

    return jsonError("Unsupported action.", 400);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Action failed.", 400);
  }
}

async function clonePage(body: CloneRequest) {
  const source = routeFromHref(body.href);
  const slug = sanitizeSlug(body.slug);

  if (!slug) {
    throw new Error("Enter a route slug.");
  }

  const label = body.label.trim();

  if (!label) {
    throw new Error("Enter a page name.");
  }

  const parentSegments = source.segments.slice(0, -1);
  const targetHref = `/${[...parentSegments, slug].join("/")}`;
  const target = routeFromHref(targetHref);
  const content = await readHomeContent();
  const location = getMutableLinkLocation(content, body.href);
  const sourceLink = content.groups[location.groupIndex].links[location.linkIndex];

  if (findLinkLocation(content, targetHref)) {
    throw new Error("That route already exists in the project index.");
  }

  await ensureRoutePageExists(source.dir);
  await ensureRouteDoesNotExist(target.dir);
  await cp(source.dir, target.dir, { recursive: true });

  const clonedLink: HomeIndexLink = {
    label,
    href: targetHref,
    description: `${sourceLink.description} Cloned from ${sourceLink.label}.`,
    mutable: true,
  };

  content.groups[location.groupIndex].links.splice(
    location.linkIndex + 1,
    0,
    clonedLink,
  );
  await writeHomeContent(content);

  return { ok: true, groups: content.groups, href: targetHref };
}

async function deletePage(body: DeleteRequest) {
  const source = routeFromHref(body.href);
  const content = await readHomeContent();
  const location = getMutableLinkLocation(content, body.href);

  await ensureRoutePageExists(source.dir);
  await rm(source.dir, { recursive: true, force: false });

  content.groups[location.groupIndex].links.splice(location.linkIndex, 1);
  await writeHomeContent(content);

  return { ok: true, groups: content.groups };
}

function routeFromHref(href: string) {
  if (!href.startsWith("/") || href === "/") {
    throw new Error("Only local page routes can be changed.");
  }

  const segments = href.split("/").filter(Boolean);

  if (
    segments.length === 0 ||
    segments.some((segment) => !segmentPattern.test(segment)) ||
    segments[0] === "api"
  ) {
    throw new Error("Only simple local page routes can be changed.");
  }

  const dir = path.resolve(appDir, ...segments);
  assertInside(appDir, dir);

  return { dir, segments };
}

async function ensureRoutePageExists(routeDir: string) {
  const pagePath = path.join(routeDir, "page.tsx");

  try {
    const result = await stat(pagePath);

    if (!result.isFile()) {
      throw new Error();
    }
  } catch {
    throw new Error("The selected route does not have a page.tsx file.");
  }
}

async function ensureRouteDoesNotExist(routeDir: string) {
  try {
    await stat(routeDir);
  } catch {
    return;
  }

  throw new Error("That route already exists.");
}

async function readHomeContent() {
  return JSON.parse(await readFile(homeContentPath, "utf8")) as HomeIndexContent;
}

async function writeHomeContent(content: HomeIndexContent) {
  await writeFile(homeContentPath, `${JSON.stringify(content, null, 2)}\n`);
}

function findLinkLocation(content: HomeIndexContent, href: string) {
  for (let groupIndex = 0; groupIndex < content.groups.length; groupIndex += 1) {
    const linkIndex = content.groups[groupIndex].links.findIndex(
      (link) => link.href === href,
    );

    if (linkIndex !== -1) {
      return { groupIndex, linkIndex };
    }
  }

  return null;
}

function getMutableLinkLocation(content: HomeIndexContent, href: string) {
  const location = findLinkLocation(content, href);

  if (!location) {
    throw new Error("Source link is no longer in the project index.");
  }

  const link = content.groups[location.groupIndex].links[location.linkIndex];

  if (
    !mutableGroupTitles.has(content.groups[location.groupIndex].title) ||
    link.mutable !== true
  ) {
    throw new Error("Only mutable project index pages can be cloned or deleted.");
  }

  return location;
}

function sanitizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function assertInside(parent: string, child: string) {
  const relative = path.relative(parent, child);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Route path is outside the app directory.");
  }
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
