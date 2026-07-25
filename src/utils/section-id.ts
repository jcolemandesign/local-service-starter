import { slugify } from "@/utils/strategy-site-map";

/**
 * A section's identity as used in persisted field paths (`03-footer.phone`),
 * generated copy-contract headings (`### 03-footer`), and staged-page rendering.
 *
 * This is derived, not stored: it is the section's position in the template plus
 * a slug of its display name. That means renaming a section's label or reordering
 * the template changes the identity of every affected section, and copy stored
 * under the old path no longer matches. Recovery is handled by the persisted
 * `slotId` anchor below - see `getSectionIdRenames` and
 * docs/architecture-review-2026-07.md.
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

/**
 * A template section's persistent identity, assigned once when the template is
 * created and never derived from anything that can be edited.
 *
 * `slotId` deliberately does NOT replace `getSectionId` in field paths. Paths
 * stay derived and human-readable (`07-cards-features-4-up-split.body`) so
 * records remain diffable and greppable, and so switching to slot anchors did
 * not rewrite every path in the repo at once - which would have orphaned all
 * existing copy, the exact failure this is meant to prevent.
 *
 * Instead it is an anchor: it lets a restage recognise that the section now
 * called "Cards features 4 up split" at position 07 is the same slot that used
 * to be called "Asymmetric feature cards", so its copy can be moved to the new
 * path rather than stranded at the old one.
 */
export type SlottedSection = IdentifiableSection & {
  slotId?: string;
};

export function createSlotId() {
  return `slot-${globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

/**
 * Maps old section id -> new section id for every slot that exists in both
 * versions of a template and whose derived id changed (rename, reorder, or
 * both). Sections without a `slotId` on either side are skipped: there is no
 * anchor to match them on, so they fall back to path matching exactly as
 * before.
 *
 * Renames are resolved against the previous ids in a single pass, so a straight
 * swap of two sections (`01-a`/`02-b` -> `01-b`/`02-a`) maps both without one
 * rename clobbering the other.
 */
export function getSectionIdRenames(
  previousSections: readonly SlottedSection[],
  nextSections: readonly SlottedSection[],
) {
  const previousIdsBySlotId = new Map<string, string>();

  previousSections.forEach((section, index) => {
    if (section.slotId) {
      previousIdsBySlotId.set(section.slotId, getSectionId(section, index));
    }
  });

  const renames = new Map<string, string>();

  nextSections.forEach((section, index) => {
    if (!section.slotId) {
      return;
    }

    const previousId = previousIdsBySlotId.get(section.slotId);

    if (!previousId) {
      return;
    }

    const nextId = getSectionId(section, index);

    if (previousId !== nextId) {
      renames.set(previousId, nextId);
    }
  });

  return renames;
}
