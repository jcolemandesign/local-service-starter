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
 * The card's marker. Sits on the label's first line rather than on a row of its
 * own: the label is the card's only content, so a separate icon row would need
 * space between the two, and any space there reads as the card failing to fill
 * itself. `mt-0.5` optically centres the glyph against that first line.
 */
function StripIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mt-0.5 size-5 shrink-0 text-service-accent"
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
 *
 * The card is deliberately not stretched to the row. Its only content is a short
 * label, so matching the copy column's height would leave it mostly empty, and
 * an empty panel reads as a section that failed to load rather than a small one.
 * It hugs its label; the copy sits centred against it.
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
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        <LayoutGridItem
          alignY="middle"
          className="col-span-4 col-start-1 max-lg:col-span-3 max-md:col-span-6 max-sm:col-span-2"
        >
          <div
            className={cx(
              "fluid-type-frame flex min-w-0 items-start gap-4 rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-service-ink shadow-service max-md:p-6",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
          >
            <p className="type-eyebrow wrap-pretty min-w-0 flex-1 text-service-accent">
              {cardLabel}
            </p>

            {icons === "on" ? <StripIcon /> : null}
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
