import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { TableCompareAlign } from "@/content/section-style-options";

export type DecisionMatrixCardQuadrant = {
  items: readonly string[];
  title: string;
};

export type DecisionMatrixCardSectionV3Props = {
  align?: TableCompareAlign;
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  quadrants: readonly DecisionMatrixCardQuadrant[];
  title: string;
};

const layoutByAlign: Record<
  TableCompareAlign,
  { header: string; matrix: string }
> = {
  left: {
    header: "col-span-5 col-start-1 row-start-1",
    matrix: "col-span-8 col-start-7 row-start-1",
  },
  center: {
    header: "col-span-8 col-start-4 row-start-1 text-center",
    matrix: "col-span-8 col-start-4 row-start-2",
  },
  right: {
    header: "col-span-5 col-start-10 row-start-1",
    matrix: "col-span-8 col-start-1 row-start-1",
  },
};

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
  quadrants,
  title,
}: DecisionMatrixCardSectionV3Props) {
  const layout = layoutByAlign[align] ?? layoutByAlign.left;
  const dividerBorderClass =
    cardBorder === "off" ? "border-bg-page" : "border-service-border";
  const visibleQuadrants = quadrants.slice(0, 4);

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="lrg">
        <LayoutGridItem
          className={cx(layout.header, responsiveGridPlacement)}
          measure="copy"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem className={cx(layout.matrix, responsiveGridPlacement)}>
          <ul
            className={cx(
              "radius-medium grid grid-cols-2 overflow-hidden border border-service-border bg-service-surface max-sm:grid-cols-1",
              cardFill === "none"
                ? "!bg-transparent !shadow-none"
                : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
          >
            {visibleQuadrants.map((quadrant, index) => (
              <li
                className={cx(
                  "min-h-64 p-8 max-md:min-h-56 max-md:p-6",
                  index % 2 === 1
                    ? `border-l ${dividerBorderClass} max-sm:border-l-0`
                    : undefined,
                  index > 1
                    ? `border-t ${dividerBorderClass}`
                    : undefined,
                  index === 1
                    ? `max-sm:border-t ${dividerBorderClass}`
                    : undefined,
                )}
                key={quadrant.title}
              >
                <h3 className="type-label text-service-ink">
                  {quadrant.title}
                </h3>
                <ul className="mt-body-actions-md grid gap-3">
                  {quadrant.items.map((item) => (
                    <li className="type-text-md text-service-muted" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
