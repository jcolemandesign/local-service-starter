import { slugify } from "@/utils/strategy-site-map";

/**
 * A section's identity as used in persisted field paths (`03-footer.phone`),
 * generated copy-contract headings (`### 03-footer`), and staged-page rendering.
 *
 * This is derived, not stored: it is the section's position in the template plus
 * a slug of its display name. That means renaming a section's label or reordering
 * the template changes the identity of every affected section, and copy stored
 * under the old path no longer matches. Section-status checks surface that as
 * `stale` rather than silently mismatching, but there is no automatic recovery -
 * see docs/architecture-review-2026-07.md.
 *
 * This was previously reimplemented in seven places with two different precedence
 * rules: five used `name || component` and two used `name || mode || component`.
 * They agree only while `name` is non-empty. Every section in page-templates.json
 * and staged-pages.json currently has a name, so the rules had not yet diverged
 * in practice - but a section with an empty name would have produced contract
 * headings that did not match its own field paths, i.e. copy landing in the
 * wrong section.
 *
 * `name || component` is the canonical rule: it matches the majority of previous
 * call sites, and `component` is more specific than `mode`.
 */
export type IdentifiableSection = {
  component?: string;
  mode?: string;
  name?: string;
};

export function getSectionOrdinal(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function getSectionId(section: IdentifiableSection, index: number) {
  return `${getSectionOrdinal(index)}-${slugify(
    section.name || section.component || "section",
  )}`;
}
