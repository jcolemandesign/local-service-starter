import type { CSSProperties } from "react";

import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionHeadingSize,
  SectionIcons,
} from "@/content/section-style-options";

export type ServicesOverviewCard = {
  items: readonly string[];
  title: string;
};

export type ServicesOverviewSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  cards: readonly ServicesOverviewCard[];
  eyebrow: string;
  fitBody: string;
  fitTitle: string;
  heading: string;
  headingSize?: SectionHeadingSize;
  icons?: SectionIcons;
};

const headingSizeClassName: Record<SectionHeadingSize, string> = {
  "heading-lg": "type-heading-lg",
  "heading-xl": "type-heading-xl",
  "display-lg": "type-display-lg",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ServicesOverviewIcon({ index }: { index: number }) {
  const variant = index % 3;

  return (
    <svg
      aria-hidden="true"
      className="size-8 text-service-accent"
      data-services-overview-icon
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      {variant === 0 ? (
        <>
          <circle cx="12" cy="12" r="3.25" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </>
      ) : null}
      {variant === 1 ? (
        <path d="M13.8 3.5c.8 3-1.9 4.2-.7 6.6.7 1.4 2.4 1.6 3.2.1.5 4.2-1.6 7.8-5.2 7.8-3 0-5.3-2.2-5.3-5.2 0-3.1 2-5.3 4.8-8.1.1 2.2.8 3.5 1.8 4.2.5-1.6.2-3.3 1.4-5.3Z" />
      ) : null}
      {variant === 2 ? (
        <>
          <path d="M12 3.5 19 6v5.1c0 4.4-2.7 7.3-7 9.4-4.3-2.1-7-5-7-9.4V6l7-2.5Z" />
          <path d="m8.8 12 2.1 2.1 4.4-4.4" />
        </>
      ) : null}
    </svg>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="grid size-5 shrink-0 place-items-center rounded-full bg-service-accent text-bg-page"
      data-services-overview-check
    >
      <svg
        className="size-3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 12 12"
      >
        <path d="m2.5 6 2.1 2.1L9.5 3.5" />
      </svg>
    </span>
  );
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-6 text-service-accent"
      data-services-overview-fit-icon
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z" />
    </svg>
  );
}

export function ServicesOverviewSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  cards,
  eyebrow,
  fitBody,
  fitTitle,
  heading,
  headingSize = "heading-xl",
  icons = "on",
}: ServicesOverviewSectionV3Props) {
  const visibleCards = cards.slice(0, 3);
  const hasBareCards = cardFill === "none" && cardBorder === "off";

  const cardClassName = cx(
    "radius-medium border border-service-border bg-service-surface shadow-service",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none items-start" columns={14} padding="med">
        <LayoutGridItem
          className="col-span-5 col-start-1 max-lg:col-span-4 max-md:col-span-6 max-md:col-start-1 max-sm:col-span-2"
          measure="copy"
        >
          <div
            className="reveal-on-scroll reveal-role-content fluid-type-frame"
            style={{ "--reveal-index": 0 } as CSSProperties}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2
              className={cx(
                headingSizeClassName[headingSize],
                "wrap-pretty mt-eyebrow-heading-md text-service-ink",
              )}
            >
              {heading}
            </h2>
            <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>

            <aside
              className={cx(
                cardClassName,
                "mt-10 p-6 max-lg:p-5",
                icons === "on" && "flex items-start gap-4",
              )}
            >
              {icons === "on" ? (
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-bg-muted">
                  <HomeIcon />
                </span>
              ) : null}
              <div>
                <p className="type-heading-sm text-service-ink">{fitTitle}</p>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {fitBody}
                </p>
              </div>
            </aside>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className="col-span-9 col-start-6 max-lg:col-span-6 max-lg:col-start-5 max-md:col-span-6 max-md:col-start-1 max-md:mt-10 max-sm:col-span-2"
        >
          <ul className="grid h-full grid-cols-3 card-grid-gap-med max-md:grid-cols-1">
            {visibleCards.map((card, index) => (
              <li
                className={cx(
                  "min-w-0",
                  hasBareCards &&
                    index > 0 &&
                    "relative pl-3 before:absolute before:inset-y-0 before:left-0 before:border-l before:border-service-border before:[border-left-width:var(--border-surface-width-token)] max-md:pl-0 max-md:before:hidden",
                )}
                key={card.title}
              >
                <article
                  className={cx(
                    "reveal-on-scroll reveal-role-card",
                    cardClassName,
                    "flex h-full min-h-80 flex-col p-7 max-lg:min-h-0 max-lg:p-6",
                  )}
                  style={{ "--reveal-index": index + 1 } as CSSProperties}
                >
                  {icons === "on" ? (
                    <span className="grid size-16 place-items-center rounded-full bg-bg-muted">
                      <ServicesOverviewIcon index={index} />
                    </span>
                  ) : null}

                  <h3
                    className={cx(
                      "type-heading-sm wrap-pretty text-service-ink",
                      icons === "on" ? "mt-6" : undefined,
                    )}
                  >
                    {card.title}
                  </h3>

                  <ul className="mt-6">
                    {card.items.map((item) => (
                      <li
                        className="type-text-sm flex items-start gap-3 border-t border-service-border py-3 text-service-muted first:border-t-0 first:pt-0 last:pb-0"
                        key={item}
                      >
                        {icons === "on" ? <CheckIcon /> : null}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
