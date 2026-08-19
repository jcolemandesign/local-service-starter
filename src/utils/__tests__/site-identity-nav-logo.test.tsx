import { isValidElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// The nav opens the request-service modal, which reads the app router. Neither
// is what these assertions are about; without the stub the nav cannot render
// outside Next at all.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push() {}, refresh() {}, replace() {} }),
  useSearchParams: () => new URLSearchParams(),
}));

const { default: PagebuilderPage } = await import("@/app/dev/pagebuilder/page");
const { renderPreviewSection } = await import(
  "@/components/sections/PagebuilderSection"
);
const { RequestServiceProvider } = await import("@/components/request-service");
const { createClientSlug, listProjectWorkspaces, sanitizeClientSlug } =
  await import("@/utils/strategy-workspace");
const { readSiteIdentity } = await import("@/utils/site-identity");

import type { PagebuilderRecipeSection } from "@/content/pagebuilder";
import { emptySiteIdentity } from "@/content/site-identity";

/**
 * The client's logo reaching the builder canvas.
 *
 * It stopped reaching it in a way nothing caught: `sanitizeClientSlug("")`
 * returned `createClientSlug`'s "client-intake" placeholder, so a Pagebuilder
 * URL with no `?client=` resolved to a project that does not exist, read an
 * empty identity, and rendered the section-library demo wordmark in every nav.
 * No error anywhere - the builder just quietly showed the wrong brand.
 *
 * Both halves are asserted here because either alone passes while the logo is
 * missing: the page has to resolve a real client, and the nav has to render
 * what it resolves.
 */

function navSection(component: string) {
  return {
    component,
    id: `${component}-test`,
    included: true,
    instruction: "",
    mode: "Navigation",
    name: component,
  } as unknown as PagebuilderRecipeSection;
}

function findSiteIdentity(node: unknown, depth = 0): unknown {
  if (!isValidElement(node) || depth > 8) {
    return undefined;
  }

  const props = (node as ReactElement<Record<string, unknown>>).props;

  return "siteIdentity" in props
    ? props.siteIdentity
    : findSiteIdentity(props.children, depth + 1);
}

describe("client slug sanitising", () => {
  it("reports nothing rather than a placeholder for empty input", () => {
    expect(sanitizeClientSlug("")).toBe("");
    expect(sanitizeClientSlug("   ")).toBe("");
    expect(sanitizeClientSlug(undefined)).toBe("");
    expect(sanitizeClientSlug("North Star HVAC")).toBe("north-star-hvac");
  });

  it("keeps the placeholder for naming a new workspace", () => {
    expect(createClientSlug("")).toBe("client-intake");
  });
});

describe("pagebuilder client resolution", () => {
  it("falls back to the most recent workspace when the URL names no client", async () => {
    const workspaces = await listProjectWorkspaces();

    // Nothing to fall back to on a fresh checkout; the assertion below would be
    // vacuous rather than wrong.
    if (workspaces.length === 0) {
      return;
    }

    const tree = await PagebuilderPage({ searchParams: Promise.resolve({}) });

    expect(findSiteIdentity(tree)).toEqual(
      await readSiteIdentity(workspaces[0].clientSlug),
    );
  });
});

describe("nav logo", () => {
  it.each([
    "NavPrimarySectionV2",
    "NavCenterLogoSectionV2",
    "NavFloatingBentoSectionV2",
  ])("%s renders the site identity logo", (component) => {
    const markup = renderToStaticMarkup(
      <RequestServiceProvider>
        {renderPreviewSection(navSection(component), 0, {
          ...emptySiteIdentity,
          businessName: "North Star HVAC",
          logoSrc: "/images/test-logo.svg",
        })}
      </RequestServiceProvider>,
    );

    expect(markup).toContain('src="/images/test-logo.svg"');
    expect(markup).toContain('alt="North Star HVAC"');
  });
});
