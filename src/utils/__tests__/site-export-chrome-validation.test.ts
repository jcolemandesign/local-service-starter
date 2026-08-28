import { describe, expect, it } from "vitest";

import staged from "@/content/projects/north-star-hvac/staged-pages.json";
import { getSectionId } from "@/utils/section-id";
import {
  getTemplateCopyFieldsForSection,
  isSiteChromeSection,
} from "@/utils/template-copy-contract";

/**
 * Nav and footer take their business name, phone, primary action, contact
 * block and link lists from site identity, resolved at render time. That is
 * why the copy prompt skips them - see `isSiteChromeSection` - and it means
 * their page-level copy fields sit empty on every page by design.
 *
 * `validateStagedFields` flagged every empty copy field regardless, so the
 * export refused to run over fields that were correct. On North Star that was
 * 180 of 192 empty required fields: the gate blocking on the system's own
 * convention rather than on unfinished work.
 *
 * The chrome assertion measures the real staged data. The content assertion
 * uses a local unfinished field so completing the live project cannot make the
 * regression test fail.
 */

type Section = { component: string; mode?: string; name?: string };

function classifyEmptyRequiredCopy(page: {
  fields?: Array<{ kind: string; path: string; value: string }>;
  template?: { sections?: Section[] };
}) {
  const meta = new Map<string, { chrome: boolean; optional: boolean }>();

  (page.template?.sections ?? []).forEach((section, index) => {
    const sectionId = getSectionId(section as never, index);
    const chrome = isSiteChromeSection(section as never);

    for (const spec of getTemplateCopyFieldsForSection(section as never)) {
      meta.set(`${sectionId}.${spec.name}`, {
        chrome,
        optional: Boolean((spec as { optional?: boolean }).optional),
      });
    }
  });

  const chrome: string[] = [];
  const content: string[] = [];

  for (const field of page.fields ?? []) {
    if (field.kind !== "copy" || field.value.trim()) continue;

    const entry = meta.get(field.path);
    if (!entry || entry.optional) continue;

    (entry.chrome ? chrome : content).push(field.path);
  }

  return { chrome, content };
}

describe("site chrome export validation", () => {
  const pages = ((staged as { pages?: unknown[] }).pages ?? []) as Array<
    Parameters<typeof classifyEmptyRequiredCopy>[0]
  >;

  it("finds staged pages to check", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  /**
   * The bug this fix exists for. If chrome fields ever stop being empty the
   * count drops, but it must never be the reason an export is refused.
   */
  it("has empty chrome copy fields that must not block an export", () => {
    const chromeEmpty = pages.flatMap(
      (page) => classifyEmptyRequiredCopy(page).chrome,
    );

    expect(chromeEmpty.length).toBeGreaterThan(0);
  });

  it("keeps flagging empty copy on real content sections", () => {
    const contentSection = {
      component: "HeroFullscreenSectionV2",
      mode: "Hero",
      name: "Fullscreen image hero",
    };
    const contentPath = `${getSectionId(contentSection as never, 0)}.h1`;
    const { content: contentEmpty } = classifyEmptyRequiredCopy({
      fields: [{ kind: "copy", path: contentPath, value: "" }],
      template: { sections: [contentSection] },
    });

    expect(contentEmpty).toEqual([contentPath]);
    expect(contentEmpty.every((path) => !/nav|footer/i.test(path))).toBe(true);
  });

  it("classifies nav and footer as chrome, and content sections as not", () => {
    expect(
      isSiteChromeSection({
        component: "NavPrimarySectionV2",
        mode: "Navigation",
        name: "Primary navigation",
      } as never),
    ).toBe(true);
    expect(
      isSiteChromeSection({
        component: "FooterSectionV3",
        mode: "Utility",
        name: "Footer",
      } as never),
    ).toBe(true);
    expect(
      isSiteChromeSection({
        component: "HeroFullscreenSectionV2",
        mode: "Hero",
        name: "Fullscreen image hero",
      } as never),
    ).toBe(false);
  });
});
