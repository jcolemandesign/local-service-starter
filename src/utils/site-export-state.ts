import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sanitizeClientSlug } from "@/utils/strategy-workspace";

export type SiteExportState = {
  approvedPageIds: string[];
  clientSlug: string;
  styleTokenCss: string;
  updatedAt: string | null;
};

const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";

export async function readSiteExportState(
  clientSlug: string,
): Promise<SiteExportState> {
  const normalizedClientSlug = requireClientSlug(clientSlug);

  try {
    const contents = await readFile(getStatePath(normalizedClientSlug), "utf8");
    const parsed = JSON.parse(contents) as Partial<SiteExportState>;

    return {
      approvedPageIds: Array.isArray(parsed.approvedPageIds)
        ? parsed.approvedPageIds.filter(
            (pageId): pageId is string => typeof pageId === "string",
          )
        : [],
      clientSlug: normalizedClientSlug,
      styleTokenCss:
        typeof parsed.styleTokenCss === "string" ? parsed.styleTokenCss : "",
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return {
      approvedPageIds: [],
      clientSlug: normalizedClientSlug,
      styleTokenCss: "",
      updatedAt: null,
    };
  }
}

export async function setPageExportApproval({
  approved,
  clientSlug,
  pageId,
}: {
  approved: boolean;
  clientSlug: string;
  pageId: string;
}) {
  const normalizedClientSlug = requireClientSlug(clientSlug);
  const normalizedPageId = sanitizePageId(pageId);

  if (!normalizedPageId) {
    throw new Error("Missing page id.");
  }

  const state = await readSiteExportState(normalizedClientSlug);
  const approvedPageIds = new Set(state.approvedPageIds);

  if (approved) {
    approvedPageIds.add(normalizedPageId);
  } else {
    approvedPageIds.delete(normalizedPageId);
  }

  const nextState: SiteExportState = {
    approvedPageIds: Array.from(approvedPageIds).sort(),
    clientSlug: normalizedClientSlug,
    styleTokenCss: approved
      ? await readPromotedStyleTokenCss()
      : state.styleTokenCss,
    updatedAt: new Date().toISOString(),
  };

  await writeState(nextState);

  return nextState;
}

export function sanitizePageId(value: unknown) {
  return typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : "";
}

async function readPromotedStyleTokenCss() {
  const globalsPath = path.join(process.cwd(), "src", "app", "globals.css");
  const css = await readFile(globalsPath, "utf8");
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  if (beginIndex < 0 || endIndex < beginIndex) {
    throw new Error("Promote the Style Guide before approving pages for export.");
  }

  return css.slice(beginIndex, endIndex + endMarker.length).trim();
}

async function writeState(state: SiteExportState) {
  const statePath = getStatePath(state.clientSlug);

  await mkdir(path.dirname(statePath), { recursive: true });
  await writeFile(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function getStatePath(clientSlug: string) {
  return path.join(
    process.cwd(),
    "src",
    "content",
    "projects",
    clientSlug,
    "site-export.json",
  );
}

function requireClientSlug(value: string) {
  const clientSlug = sanitizeClientSlug(value);

  if (!clientSlug) {
    throw new Error("Missing client slug.");
  }

  return clientSlug;
}
