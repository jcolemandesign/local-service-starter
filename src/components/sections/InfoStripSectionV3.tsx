import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionIcons } from "@/content/section-style-options";

export type InfoStripSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  cardLabel: string;
  /** This section's take on the shared icons axis: a marker in the card's top
   *  corner. See `iconsOptions` in `section-style-options`. */
  icons?: SectionIcons;
};

/**
 * The card's marker. Sits in the top-right corner rather than beside the label
 * because the label wraps to several lines at four columns, and a leading glyph
 * would leave the wrapped lines hanging off it.
 */
function StripIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-5 shrink-0 text-service-accent"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M10 2.75 1.75 17h16.5L10 2.75ZM10 8v3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <circle cx="10" cy="14.1" fill="currentColor" r="0.9" />
    </svg>
  );
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * A short strip pairing a labelled card with a block of copy: four columns of
 * card, one column of gap, nine columns of content.
 *
 * The blank column is load-bearing rather than decorative. The card is a filled
 * surface and the content block is not, so without a column between them the two
 * would read as one panel with a colour change partway across.
 *
 * The strip carries a single paragraph by design. It is the section reached for
 * when one thing has to be said plainly and quickly - the first use is an
 * emergency notice - so there is no list, no action, and nothing to scan.
 */
export function InfoStripSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  cardLabel,
  icons = "on",
}: InfoStripSectionV3Props) {
  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="sml"
      >
        <LayoutGridItem
          alignY="stretch"
          className="col-span-4 col-start-1 max-lg:col-span-3 max-md:col-span-6 max-sm:col-span-2"
        >
          <div
            className={cx(
              "fluid-type-frame flex h-full min-w-0 flex-col justify-between gap-6 rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface content-padding text-service-ink shadow-service",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
          >
            {icons === "on" ? (
              <div className="flex justify-end">
                <StripIcon />
              </div>
            ) : null}

            <p className="type-eyebrow wrap-pretty text-service-accent">
              {cardLabel}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="middle"
          className="col-span-9 col-start-6 max-lg:col-span-6 max-lg:col-start-5 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
          measure="copyWide"
        >
          <p className="type-text-lg wrap-pretty text-service-ink">{body}</p>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
