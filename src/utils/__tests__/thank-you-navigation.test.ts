import { describe, expect, it } from "vitest";

import stagedPages from "@/content/projects/north-star-hvac/staged-pages.json";
import { getStagedPageRenderData } from "@/components/sections/StagedPageCanvas";
import type { StagedPage } from "@/utils/staged-pages";

/**
 * A thank-you page is only reached by completing a form, so it never belongs in
 * site navigation.
 *
 * The nav components do filter it, but on `href !== "/thank-you"` - the exported
 * path. A staged preview link is `/dev/staged-pages/thank-you?client=...`, which
 * that comparison never matches, so the page sat in every staged nav and
 * vanished only after export. The links are now filtered where they are built,
 * which covers the preview, the export, and the mobile menu at once.
 *
 * Driven through the real render data rather than the nav component, because the
 * component's own filter would mask a regression in the link builder.
 */

const pages = ((stagedPages as { pages?: StagedPage[] }).pages ??
  (stagedPages as unknown as StagedPage[])) as StagedPage[];

const clientPages = pages.filter((page) => page.pageId);

describe("thank-you page navigation", () => {
  it("has a thank-you page to exclude", () => {
    expect(
      clientPages.some((page) => page.pageId === "thank-you"),
      "fixture no longer contains a thank-you page - this test proves nothing",
    ).toBe(true);
  });

  it("never lists it in the navigation of any page", () => {
    const offenders: string[] = [];

    for (const page of clientPages) {
      const { navigationLinks } = getStagedPageRenderData(page, clientPages);

      const hit = navigationLinks.find(
        (link) =>
          /thank/i.test(link.label) ||
          /thank-you/.test(link.href ?? "") ||
          link.items?.some(
            (item) =>
              /thank/i.test(typeof item === "string" ? item : item.label) ||
              (typeof item !== "string" && /thank-you/.test(item.href ?? "")),
          ),
      );

      if (hit) {
        offenders.push(`${page.pageId} -> ${hit.label}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it("still builds the rest of the navigation", () => {
    const home = clientPages.find((page) => page.pageId === "home");

    expect(home).toBeDefined();

    const { navigationLinks } = getStagedPageRenderData(home!, clientPages);

    // Guards against "passes because navigation is empty".
    expect(navigationLinks.length).toBeGreaterThan(3);
    expect(navigationLinks.map((link) => link.label)).toContain("Contact");
  });
});
