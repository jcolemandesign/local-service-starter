import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

export type ContentMainIdeaGridPoint = {
  body: string;
  title: string;
};

export type ContentMainIdeaGridAlign = "left" | "right";

export type ContentMainIdeaGridSectionV3Props = {
  align?: ContentMainIdeaGridAlign;
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  points: readonly ContentMainIdeaGridPoint[];
  title: string;
};

const gridLayouts: Record<
  ContentMainIdeaGridAlign,
  {
    header: string;
    points: readonly string[];
  }
> = {
  left: {
    header: "col-span-7 col-start-1",
    points: [
      "col-start-9 row-start-1",
      "col-start-12 row-start-1",
      "col-start-9 row-start-2",
      "col-start-12 row-start-2",
    ],
  },
  right: {
    header: "col-span-7 col-start-8",
    points: [
      "col-start-1 row-start-1",
      "col-start-4 row-start-1",
      "col-start-1 row-start-2",
      "col-start-4 row-start-2",
    ],
  },
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentMainIdeaGridSectionV3({
  align = "left",
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  points,
  title,
}: ContentMainIdeaGridSectionV3Props) {
  const layout = gridLayouts[align];
  // Applied after the recipe's card classes so the override wins, matching how
  // every other card section layers these two.
  const cardOverride = cx(
    cardFill === "none" ? "!bg-transparent !shadow-none" : undefined,
    cardBorder === "off" ? "!border-transparent" : undefined,
  );
  /**
   * NO FILL AND NO BORDER MEANS THERE IS NO CARD, and the padding was still
   * behaving as though there were one.
   *
   * A point card's `p-5`, its `min-h-44` floor and its `justify-between` all exist
   * to give a surface a comfortable shape: room inside the box, a floor so a
   * short point does not collapse, and the index pinned to the top while the
   * copy sits at the bottom. Take the surface away and every one of them turns
   * into bare ground - the reader sees two rows of text held apart by the
   * padding of boxes that are not drawn, which is why the rows read as too far
   * apart with the toggles off and correct with them on.
   *
   * BOTH TOGGLES, NOT EITHER. A filled card with no border is still a card and
   * still wants its padding; so is an outlined one with no fill. Only the pair
   * removes the surface, and only then is the padding decorating nothing.
   *
   * The horizontal padding stays. It is not what separates the rows, and
   * dropping it would move the copy out to the column edges - a realignment
   * nobody asked for while adjusting a vertical rhythm.
   */
  const isBareSurface = cardFill === "none" && cardBorder === "off";
  const pointCardOverride = cx(
    cardOverride,
    isBareSurface ? "!min-h-0 !justify-start !py-0" : undefined,
  );
  const colors = {
    body: "text-service-muted",
    card: "border-service-border bg-service-surface shadow-service",
    eyebrow: "text-service-accent",
    heading: "text-service-ink",
    index: "text-service-accent",
    section: "bg-bg-page",
  };

  return (
    <section className={colors.section}>
      <LayoutGrid
        className="section-min-none auto-rows-fr items-stretch"
        columns={14}
        padding="lrg"
      >
        <LayoutGridItem
          alignY="stretch"
          className={`${layout.header} row-span-2 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-span-1 max-md:col-span-6 max-sm:col-span-2`}
        >
          {/* No justify-between and no min-height floor: both were padding the
              card out well past its copy, and the gap they opened between the
              title and the body was most of the card's height. The body now
              follows the title on the shared display-to-body step.

              Centered rather than top-aligned because this card spans both
              point-card rows: whichever side has more copy sets the height, so
              when the points win, the leftover has to go somewhere. Centering
              splits it above and below as even padding instead of pooling it
              all under the body. */}
          {/* The lead card reveals first and the four points follow it. It is
              the same card family as they are, so leaving it static while its
              neighbours arrived would read as one card failing to animate
              rather than as a deliberate anchor. */}
          <article
            className={cx(
              "reveal-on-scroll reveal-role-card",
              "fluid-type-frame flex h-full flex-col justify-center rounded-[var(--radius-surface-token)] border p-8 max-md:p-6",
              colors.card,
              cardOverride,
            )}
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <div>
              <p className={cx("type-label", colors.eyebrow)}>{eyebrow}</p>
              <h2
                className={cx(
                  "type-display-lg wrap-pretty mt-eyebrow-display",
                  colors.heading,
                )}
              >
                {title}
              </h2>
            </div>
            <p
              className={cx(
                "type-text-lg measure-copy-wide wrap-pretty mt-display-body",
                colors.body,
              )}
            >
              {body}
            </p>
          </article>
        </LayoutGridItem>

        {points.slice(0, 4).map((point, index) => (
          // Stretch, not the default top alignment: the row-spanning header
          // sets both row heights, so a top-aligned card stops at its own
          // min-height and leaves the remainder as dead space under it. That
          // read as an oversized gap between the two card rows and kept the
          // bottom row from meeting the header's bottom edge.
          <LayoutGridItem
            alignY="stretch"
            className={`col-span-3 ${layout.points[index]} max-lg:col-span-5 max-lg:col-start-auto max-lg:row-auto max-md:col-span-3 max-sm:col-span-2`}
            key={`${index}-${point.title}`}
          >
            <article
              className={cx(
                "reveal-on-scroll reveal-role-card",
                "fluid-type-frame flex h-full min-h-44 flex-col justify-between rounded-[var(--radius-surface-token)] border p-5 max-md:min-h-0",
                colors.card,
                pointCardOverride,
              )}
              // Offset by one: the lead card above holds index 0.
              style={{ "--reveal-index": index + 1 } as CSSProperties}
            >
              <p className={cx("type-label", colors.index)}>
                {String(index + 1).padStart(2, "0")}
              </p>
              {/* The step from the index to the copy is the card's internal
                  rhythm, so it comes down with the rest of the padding when
                  there is no card to have one. */}
              <div className={isBareSurface ? "mt-4" : "mt-8"}>
                <h3 className={cx("type-heading-sm wrap-pretty", colors.heading)}>
                  {point.title}
                </h3>
                <p
                  className={cx(
                    "type-text-sm wrap-pretty mt-heading-body-sm",
                    colors.body,
                  )}
                >
                  {point.body}
                </p>
              </div>
            </article>
          </LayoutGridItem>
        ))}
      </LayoutGrid>
    </section>
  );
}
