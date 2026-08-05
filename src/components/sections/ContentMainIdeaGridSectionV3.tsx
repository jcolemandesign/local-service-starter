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
          <article
            className={cx(
              "fluid-type-frame flex h-full flex-col justify-center rounded-[var(--radius-surface-token)] border p-8 max-md:p-6",
              colors.card,
              cardOverride,
            )}
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
                "fluid-type-frame flex h-full min-h-44 flex-col justify-between rounded-[var(--radius-surface-token)] border p-5 max-md:min-h-0",
                colors.card,
                cardOverride,
              )}
            >
              <p className={cx("type-label", colors.index)}>
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="mt-8">
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
