import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { TableCompareAlign } from "@/content/section-style-options";
import type { DecisionQuestionTableColumn } from "./DecisionQuestionTableSectionV3";

export type DecisionQuestionTableFourSectionV3Props = {
  align?: TableCompareAlign;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  columns: readonly DecisionQuestionTableColumn[];
};

/**
 * Column start for the twelve-column table, indexed by alignment. The table is
 * one block, so this is the whole of what the axis moves - the two spare
 * columns of the fourteen fall trailing, split, or leading.
 */
const alignColumnStarts: Record<TableCompareAlign, string> = {
  left: "col-start-1",
  center: "col-start-2",
  right: "col-start-3",
};

// Alignment is a fourteen-column idea. Below that the table already fills the
// row edge to edge, so there are no spare columns to place and the explicit
// start is released.
const responsiveColumns =
  "max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * The header-less sibling of the three-column compare table: four questions
 * carrying the section on their own, with no left-hand copy column to introduce
 * them. Same table construction - one bordered block, dividers on the column
 * lines, padding inside the cells - and the same `grid-rows-subgrid` trick that
 * keeps the rule under the headings continuous across all four columns.
 *
 * Grouped lists rather than a `<table>`, for the same reason as the three-column
 * version: the values down a column are alternatives, and nothing relates them
 * across a row.
 */
export function DecisionQuestionTableFourSectionV3({
  align = "center",
  cardBorder = "on",
  cardFill = "solid",
  columns,
}: DecisionQuestionTableFourSectionV3Props) {
  const columnStart = alignColumnStarts[align] ?? alignColumnStarts.center;
  const dividerBorderClass =
    cardBorder === "off" ? "border-bg-page" : "border-service-border";

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="lrg">
        <LayoutGridItem
          className={cx("col-span-12", columnStart, responsiveColumns)}
        >
          <ul
            className={cx(
              "radius-medium grid grid-cols-4 grid-rows-[auto_1fr] overflow-hidden border border-service-border bg-service-surface max-sm:grid-cols-1",
              cardFill === "none"
                ? "!bg-transparent !shadow-none"
                : undefined,
              cardBorder === "off" ? "!border-transparent" : undefined,
            )}
          >
            {columns.slice(0, 4).map((column, index) => (
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
