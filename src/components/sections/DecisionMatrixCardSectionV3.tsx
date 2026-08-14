import Image from "next/image";
import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionHeadingSize,
  TableCompareAlign,
} from "@/content/section-style-options";

export type DecisionMatrixCardQuadrant = {
  /**
   * One icon per quadrant, matching that quadrant's heading.
   *
   * Declared per quadrant rather than as one section-level set so the editor is
   * asked for four named assets tied to the headings they belong to, and a
   * reordered matrix keeps each icon with its own cell. Empty renders the
   * drawn placeholder below.
   */
  iconAlt?: string;
  iconSrc?: string;
  items: readonly string[];
  title: string;
};

export type DecisionMatrixCardSectionV3Props = {
  align?: TableCompareAlign;
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  headingSize?: SectionHeadingSize;
  quadrants: readonly DecisionMatrixCardQuadrant[];
  title: string;
};

/**
 * Three arrangements: header beside the matrix on either side, or above it.
 *
 * `alignX` rather than a `text-center` class in the header string. The grid item
 * already emits `text-left` from its default `alignX`, and Tailwind orders
 * `.text-center` before `.text-left`, so the two collided at equal specificity
 * and left won - the centred variant has never actually centred its copy.
 * Driving the item's own alignment prop settles it in one place, and carries
 * `justify-items` with it.
 *
 * `mx-auto` on the centred header for the same reason the modal-begin helper
 * needed it: the item is capped at a reading measure, so without auto margins
 * the capped block sits at the left of the eight columns it was given and only
 * its text centres inside that.
 */
const layoutByAlign: Record<
  TableCompareAlign,
  { alignX: "left" | "center"; header: string; matrix: string }
> = {
  left: {
    alignX: "left",
    header: "col-span-5 col-start-1 row-start-1",
    matrix: "col-span-8 col-start-7 row-start-1",
  },
  center: {
    alignX: "center",
    header: "col-span-8 col-start-4 row-start-1 mx-auto",
    matrix: "col-span-8 col-start-4 row-start-2",
  },
  right: {
    alignX: "left",
    header: "col-span-5 col-start-10 row-start-1",
    matrix: "col-span-8 col-start-1 row-start-1",
  },
};

const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

/**
 * The quadrant's icon, tucked into the bottom-right corner of its cell.
 *
 * Out of the text's way entirely: it is absolutely positioned and the cell
 * carries no reserved gutter for it, so the copy wraps to the full width of the
 * cell and the icon occupies the corner the list has already cleared. Reserving
 * a column for it instead cost every bullet a third of its measure to protect
 * space that is usually empty.
 *
 * Still larger than the library's inline marks - those are 16-24px inside a
 * line of text - but sized to sit under the copy rather than beside it.
 *
 * The placeholder is drawn rather than a file: an FPO that says what it is
 * beats a stock glyph that looks deliberate and ships to a client unnoticed.
 */
function QuadrantIcon({ alt, src }: { alt?: string; src?: string }) {
  if (src) {
    return (
      <span className="pointer-events-none absolute bottom-4 right-4 block size-14 max-md:bottom-3 max-md:right-3 max-md:size-12">
        <Image
          alt={alt ?? ""}
          className="object-contain object-right-bottom"
          fill
          // Eager, for the reason the nav logo and the content-top hero are:
          // the default lazy observer never fires inside the builder canvas or
          // the staged preview, and the element renders empty. `loading` rather
          // than `priority` - these are decorative corner marks of a few hundred
          // bytes and do not deserve a preload ahead of the page's real images.
          loading="eager"
          sizes="56px"
          src={src}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-4 right-4 grid size-14 place-items-center rounded-[var(--radius-sm-token)] border border-dashed border-service-border text-service-muted max-md:bottom-3 max-md:right-3 max-md:size-12"
    >
      <span className="type-caption">Icon</span>
    </span>
  );
}

const responsiveGridPlacement =
  "max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function DecisionMatrixCardSectionV3({
  align = "left",
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  headingSize = "heading-xl",
  quadrants,
  title,
}: DecisionMatrixCardSectionV3Props) {
  const layout = layoutByAlign[align] ?? layoutByAlign.left;
  const dividerBorderClass =
    cardBorder === "off" ? "border-bg-page" : "border-service-border";
  const visibleQuadrants = quadrants.slice(0, 4);
  /**
   * Two units, staggered in reading order.
   *
   * `right` puts the header in the last five columns and the matrix in the
   * first eight of the SAME row, so the matrix is read first there while the
   * JSX still writes the header first. `center` stacks them, header above.
   */
  const matrixLeadsReadingOrder = align === "right";
  const headerRevealIndex = matrixLeadsReadingOrder ? 1 : 0;
  const matrixRevealIndex = matrixLeadsReadingOrder ? 0 : 1;

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="lrg">
        <LayoutGridItem
          alignX={layout.alignX}
          className={cx(layout.header, responsiveGridPlacement)}
          measure="copy"
        >
          <div
            className="reveal-on-scroll fluid-type-frame"
            style={{ "--reveal-index": headerRevealIndex } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2
              className={cx(
                headingSizeClassName[headingSize] ??
                  headingSizeClassName["heading-xl"],
                "wrap-pretty mt-eyebrow-heading-lg text-service-ink",
              )}
            >
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem className={cx(layout.matrix, responsiveGridPlacement)}>
          {/* One unit: the four quadrants are cells of a single bordered
              matrix, divided by shared rules. Moving them independently would
              take the grid apart while it arrives. */}
          <ul
            className={cx(
              "reveal-on-scroll",
              // `shadow-service` like every other card surface in the library.
              // Without it this panel was the one card on the page sitting flat
              // on the ground, which is most of what made it read as unstyled.
              "radius-medium grid grid-cols-2 overflow-hidden border border-service-border bg-service-surface shadow-service max-sm:grid-cols-1",
              cardFill === "none"
                ? "!bg-transparent !shadow-none"
                : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
            style={{ "--reveal-index": matrixRevealIndex } as CSSProperties}
          >
            {visibleQuadrants.map((quadrant, index) => (
              <li
                className={cx(
                  // `relative` for the corner icon, and the copy is inset from
                  // the right so a long bullet does not run under it.
                  "relative flex min-h-64 flex-col p-8 max-md:min-h-56 max-md:p-6",
                  // Dividers at the panel's own border weight. At the default
                  // 1px they read as a table rule rather than as the same line
                  // the card is drawn with.
                  index % 2 === 1
                    ? `border-l ${dividerBorderClass} [border-left-width:var(--border-surface-width-token)] max-sm:border-l-0`
                    : undefined,
                  index > 1
                    ? `border-t ${dividerBorderClass} [border-top-width:var(--border-surface-width-token)]`
                    : undefined,
                  index === 1
                    ? `max-sm:border-t ${dividerBorderClass} max-sm:[border-top-width:var(--border-surface-width-token)]`
                    : undefined,
                )}
                key={quadrant.title}
              >
                {/* A heading, set as one. It was `type-label` - eyebrow
                    styling doing a heading's job, which is why the cell had no
                    top line and read as a table header. No number above it:
                    the four quadrants are a matrix, not a sequence, and an
                    index would promise an order to read them in. */}
                <h3 className="type-heading-sm wrap-pretty text-service-ink">
                  {quadrant.title}
                </h3>
                <ul className="mt-heading-body-sm grid gap-2">
                  {quadrant.items.map((item) => (
                    <li
                      className="type-text-md flex items-start gap-3 text-service-muted"
                      key={item}
                    >
                      {/* The library's bullet - see `ContentCardTwoUpSectionV3`
                          and the two splits. Bare lines of muted text were the
                          other half of the plain-HTML look. */}
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <QuadrantIcon alt={quadrant.iconAlt} src={quadrant.iconSrc} />
              </li>
            ))}
          </ul>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
