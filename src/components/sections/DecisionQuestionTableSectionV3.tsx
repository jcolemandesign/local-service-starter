import type { CSSProperties } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type DecisionQuestionTableColumn = {
  options: readonly string[];
  title: string;
};

export type DecisionQuestionTableSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  columns: readonly DecisionQuestionTableColumn[];
  eyebrow: string;
  title: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Three questions with their recognizable answers, framed by header copy on the
 * left. Rendered as one bordered table rather than three cards: the dividers sit
 * on the column lines and the padding lives inside each cell, so the three
 * questions read as one instrument instead of three separate offers.
 *
 * Grouped lists, not a `<table>`. The values down a column are alternatives to
 * pick from, and nothing relates "No cooling" to "Suddenly" across a row, so
 * there is no row record for table semantics to describe.
 *
 * The two body rows are held level across the columns with `grid-rows-subgrid`,
 * which is what keeps the rule under the headings continuous instead of
 * breaking at each cell's padding.
 */
export function DecisionQuestionTableSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  columns,
  eyebrow,
  title,
}: DecisionQuestionTableSectionV3Props) {
  const dividerBorderClass =
    cardBorder === "off" ? "border-bg-page" : "border-service-border";

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="lrg">
        <LayoutGridItem
          className="col-span-4 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2"
          measure="copy"
        >
          <div
            className="reveal-on-scroll reveal-role-heading fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>
          </div>
        </LayoutGridItem>

        <LayoutGridItem className="col-span-9 col-start-6 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2">
          {/* The table is ONE revealable unit, not one per column.
              Its columns share a border box, a continuous rule under the
              headings and a subgrid that lines their rows up; moving them
              independently would pull all three apart from the frame around
              them for the length of the entrance. */}
          <ul
            className={cx(
              "reveal-on-scroll reveal-role-frame",
              "radius-medium grid grid-cols-3 grid-rows-[auto_1fr] overflow-hidden border border-service-border bg-service-surface max-sm:grid-cols-1",
              cardFill === "none"
                ? "!bg-transparent !shadow-none"
                : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
            style={{ "--reveal-index": 1 } as CSSProperties}
          >
            {columns.slice(0, 3).map((column, index) => (
              <li
                className={cx(
                  "row-span-2 grid grid-rows-subgrid max-sm:block",
                  index > 0
                    ? `border-l ${dividerBorderClass} max-sm:border-l-0 max-sm:border-t`
                    : undefined,
                )}
                key={column.title}
              >
                <h3
                  className={cx(
                    "type-label border-b px-6 py-5 text-service-ink max-md:px-4 max-md:py-4",
                    dividerBorderClass,
                  )}
                >
                  {column.title}
                </h3>
                {/* A step more vertical padding than the heading row's py-5, so
                    the options sit clear of the rule above them without opening
                    a gap that reads as an empty cell. */}
                <ul className="grid content-start gap-3 px-6 py-7 max-md:px-4 max-md:py-6">
                  {column.options.map((option) => (
                    <li
                      className="type-text-md flex items-start gap-3 text-service-muted"
                      key={option}
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent"
                      />
                      <span>{option}</span>
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
