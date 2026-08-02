import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

export type InfoStripSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  cardLabel: string;
  colorRecipe?: SectionColorRecipe;
  /** This section's take on the shared icons axis: a marker in the card's top
   *  corner. See `iconsOptions` in `section-style-options`. */
  icons?: SectionIcons;
};

/**
 * Per-recipe colours.
 *
 * The card is a surface inside the section rather than the section background,
 * so it needs its own entry: on the dark and accent recipes the section colour
 * is the card's default fill, and a card left on `bg-service-surface` would sit
 * as a pale block on it.
 */
const colorRecipeClassName: Record<
  SectionColorRecipe,
  { body: string; card: string; cardBorder: string; label: string; section: string }
> = {
  default: {
    body: "text-service-ink",
    card: "bg-service-surface",
    cardBorder: "border-service-border",
    label: "text-service-accent",
    section: "bg-bg-page",
  },
  muted: {
    body: "text-service-ink",
    // The raised surface, not the page token. A filled card on the muted recipe
    // has to lift off a section that is already surface-coloured, and the page
    // token sits below it rather than above - the two read as one flat field.
    // `globals.css` does the same lift for cards it can reach by selector.
    card: "bg-surface-raised",
    cardBorder: "border-service-border",
    label: "text-service-accent",
    section: "bg-service-surface",
  },
  // Dark and accent stay on explicit translucent whites rather than
  // `bg-surface-raised`. That token is only re-pointed at a dark/accent-derived
  // colour inside `.pagebuilder-section-frame`, so on an exported page it would
  // still resolve to the light default and put a near-white card on a dark
  // section. A translucent white is correct in both places.
  dark: {
    body: "text-white",
    card: "bg-white/10",
    cardBorder: "border-white/25",
    label: "text-white",
    section: "bg-bg-dark",
  },
  accent: {
    body: "text-[var(--live-accent-ink)]",
    card: "bg-white/15",
    cardBorder: "border-[color-mix(in_oklab,var(--live-accent-ink)_30%,transparent)]",
    label: "text-[var(--live-accent-ink)]",
    section: "bg-service-accent",
  },
};

/**
 * The card's marker. Sits on the label's first line rather than on a row of its
 * own: the label is the card's only content, so a separate icon row would need
 * space between the two, and any space there reads as the card failing to fill
 * itself. `mt-0.5` optically centres the glyph against that first line.
 */
function StripIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`mt-0.5 size-5 shrink-0 ${className}`}
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
  colorRecipe = "default",
  icons = "on",
}: InfoStripSectionV3Props) {
  const colors = colorRecipeClassName[colorRecipe];

  return (
    <section className={colors.section}>
      <LayoutGrid className="section-min-none" columns={14} padding="sml">
        <LayoutGridItem
          alignY="middle"
          className="col-span-4 col-start-1 max-lg:col-span-3 max-md:col-span-6 max-sm:col-span-2"
        >
          <div
            className={cx(
              "fluid-type-frame flex min-w-0 items-start gap-4 rounded-[var(--radius-surface-token)] border p-8 shadow-service max-md:p-6",
              colors.card,
              colors.cardBorder,
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
          >
            <p className={cx("type-eyebrow wrap-pretty min-w-0 flex-1", colors.label)}>
              {cardLabel}
            </p>

            {icons === "on" ? <StripIcon className={colors.label} /> : null}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="middle"
          className="col-span-9 col-start-6 max-lg:col-span-6 max-lg:col-start-5 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2 max-sm:col-start-1"
          measure="copyWide"
        >
          <p className={cx("type-text-lg wrap-pretty", colors.body)}>{body}</p>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
