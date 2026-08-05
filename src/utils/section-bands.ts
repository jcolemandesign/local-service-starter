import {
  resolveJoinAbove,
  sectionSupportsJoinAbove,
} from "@/content/section-style-options";

/**
 * Grouping a flat section list into background bands.
 *
 * A band is a run of consecutive sections that share one paint surface, so an
 * image, gradient, or animation can span several sections instead of restarting
 * at every seam. A section's own frame can only ever paint its own box; anything
 * with geometry needs a container, and this is what decides where those
 * containers go.
 *
 * Membership is derived from adjacency rather than stored on a band record. A
 * section carries only `joinAbove`, and a run is however many sections in a row
 * carry it. That choice is what makes reordering safe: move a section out of the
 * middle of a band and the run simply splits in two, with nothing dangling and
 * nothing to clean up. The cost is that a band cannot be named or span
 * non-adjacent sections, neither of which means anything for a background.
 */

/** The minimum a section has to expose to be grouped. */
export type BandableSection = {
  component: string;
  joinAbove?: string;
};

/** Enough to also take the band's ground colour. */
type RecipeBearingSection = BandableSection & {
  colorRecipe?: string;
};

export type SectionBand<T> = {
  /**
   * True when this run is more than one section and therefore needs a wrapper.
   * A run of one is the overwhelmingly common case and renders with no band
   * element at all, so a page that uses no bands emits exactly the DOM it did
   * before bands existed.
   */
  isBand: boolean;
  sections: T[];
  /** Index of the run's first section in the original flat list. */
  startIndex: number;
};

/**
 * Whether a section may attach itself to the run above it.
 *
 * Navigation can never join - see `navigationComponents` for why - and the first
 * section on a page has nothing above it to join, so it always starts a run
 * regardless of what it carries. Handling that here rather than validating it on
 * write means a stack that was reordered into an impossible state still renders.
 */
function joinsPreviousSection(
  section: BandableSection,
  index: number,
  previous: BandableSection | undefined,
) {
  if (index === 0 || !previous) {
    return false;
  }

  if (!sectionSupportsJoinAbove(section.component)) {
    return false;
  }

  // A nav above cannot be the start of a band either, so a section trying to
  // join one falls back to starting its own run.
  if (!sectionSupportsJoinAbove(previous.component)) {
    return false;
  }

  return resolveJoinAbove(section.joinAbove);
}

/**
 * A band's sections, each carrying the band's ground colour.
 *
 * The band paints the ground, so a member's own `colorRecipe` cannot reach the
 * page - but a section component is also handed its recipe as a prop, and it
 * uses that to pick its text, card, and border colours. Left alone, those two
 * disagree: setting a recipe on a member restyled its contents for a ground the
 * band was never going to paint, which showed up as a section whose text and
 * cards shifted while the background stayed put.
 *
 * Substituting here rather than at each render site means the frame attribute,
 * the component props, and the export all read one value. The first section's
 * recipe is the band's by definition, so it is unchanged by this.
 */
export function withBandRecipe<T extends RecipeBearingSection>(
  band: SectionBand<T>,
): T[] {
  if (!band.isBand) {
    return band.sections;
  }

  const [first] = band.sections;

  return band.sections.map((section) =>
    section === first ? section : { ...section, colorRecipe: first.colorRecipe },
  );
}

export function groupSectionsIntoBands<T extends BandableSection>(
  sections: readonly T[],
): SectionBand<T>[] {
  const bands: SectionBand<T>[] = [];

  sections.forEach((section, index) => {
    const openBand = bands[bands.length - 1];

    if (openBand && joinsPreviousSection(section, index, sections[index - 1])) {
      openBand.sections.push(section);
      openBand.isBand = true;

      return;
    }

    bands.push({ isBand: false, sections: [section], startIndex: index });
  });

  return bands;
}
