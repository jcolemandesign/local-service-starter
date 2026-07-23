import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ContentCardTwoUpItem = {
  body: string;
  bullets?: readonly string[];
  secondBody?: string;
  title: string;
};

export type ContentCardTwoUpAlign = "left" | "center" | "right";

export type ContentCardTwoUpSectionV3Props = {
  align?: ContentCardTwoUpAlign;
  cardFill?: "solid" | "none";
  items: readonly ContentCardTwoUpItem[];
};

const columnStarts: Record<
  ContentCardTwoUpAlign,
  { first: string; second: string }
> = {
  center: { first: "col-start-2", second: "col-start-8" },
  left: { first: "col-start-1", second: "col-start-7" },
  right: { first: "col-start-3", second: "col-start-9" },
};

// Row-start classes must exist as literal strings for Tailwind's scanner to
// generate the CSS - a template-interpolated `row-start-${n}` would never be
// detected. Two rows covers the contract's 2-or-4-item cap.
const rowStartClasses = ["row-start-1", "row-start-2"] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentCardTwoUpSectionV3({
  align = "left",
  cardFill = "solid",
  items,
}: ContentCardTwoUpSectionV3Props) {
  const positions = columnStarts[align];
  const displayItems = items.slice(0, 4);

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="lrg">
        {displayItems.map((item, index) => {
          const rowStart = rowStartClasses[Math.floor(index / 2)] ?? "row-start-1";
          const columnStart = index % 2 === 0 ? positions.first : positions.second;

          return (
            <LayoutGridItem
              alignY="stretch"
              className={cx(
                "col-span-6",
                columnStart,
                rowStart,
                "max-lg:col-span-5",
                index % 2 === 0 ? "max-lg:col-start-1" : "max-lg:col-start-6",
                "max-md:col-span-6 max-md:col-start-1 max-md:row-auto max-sm:col-span-2",
              )}
              key={item.title}
            >
              <article
                className={cx(
                  "fluid-type-frame h-full min-w-0 rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-10 text-service-ink shadow-service max-md:p-8",
                  cardFill === "none" && "!border-transparent !bg-transparent !shadow-none",
                )}
              >
                <h3 className="type-heading-lg wrap-pretty text-service-ink">
                  {item.title}
                </h3>
                <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-ink">
                  {item.body}
                </p>
                {item.bullets && item.bullets.length > 0 ? (
                  <ul className="mt-heading-body-sm grid gap-3">
                    {item.bullets.map((bullet) => (
                      <li
                        className="type-text-md flex items-start gap-3 text-service-muted"
                        key={bullet}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.65em] size-1.5 shrink-0 rounded-full bg-service-accent"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : item.secondBody ? (
                  <p className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
                    {item.secondBody}
                  </p>
                ) : null}
              </article>
            </LayoutGridItem>
          );
        })}
      </LayoutGrid>
    </section>
  );
}
