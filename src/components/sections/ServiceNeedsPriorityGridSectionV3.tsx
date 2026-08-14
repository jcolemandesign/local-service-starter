import type { CSSProperties } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ServiceNeedsPriorityGridItem = {
  body: string;
  href: string;
  title: string;
};

export type ServiceNeedsPriorityGridSectionV3Props = {
  align?: ServiceNeedsPriorityGridAlign;
  cardBorder?: "on" | "off";
  /** Turns the three compact cards' text links off. The priority card's
   *  primary/secondary CTAs are unaffected - those are real conversion
   *  actions, not card navigation. */
  cardLinks?: "on" | "off";
  cardFill?: "solid" | "none";
  compactPriorityCard?: boolean;
  items: readonly ServiceNeedsPriorityGridItem[];
  linkLabel?: string;
  primaryAction?: string;
  primaryActionHref?: string;
  priorityEyebrow?: string;
  secondaryAction?: string;
  secondaryActionHref?: string;
};

export type ServiceNeedsPriorityGridAlign = "left" | "right";

export function ServiceNeedsPriorityGridSectionV3({
  align = "right",
  cardBorder = "on",
  cardLinks = "on",
  cardFill = "solid",
  compactPriorityCard = false,
  items,
  linkLabel = "View options",
  primaryAction = "Request service",
  primaryActionHref = "/contact",
  priorityEyebrow = "Priority need",
  secondaryAction = "Explore service options",
  secondaryActionHref = "/services",
}: ServiceNeedsPriorityGridSectionV3Props) {
  const priorityItem = items[3];
  const smallItems = items.slice(0, 3);
  const priorityPosition =
    "col-span-5 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-2";
  const smallCardsPosition =
    align === "left"
      ? "col-span-9 col-start-6 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
      : "col-span-9 col-start-1 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2";

  /**
   * `revealIndex` is passed in rather than derived, because the four cards are
   * emitted in two places and their reading order flips with `align` - the
   * priority card leads on the left and trails on the right. Staggering by
   * reading order is what makes the sequence look intentional either way.
   */
  function renderCard(
    item: ServiceNeedsPriorityGridItem,
    isPriority: boolean,
    revealIndex: number,
  ) {
    const usePriorityTypography = isPriority && !compactPriorityCard;

    return (
      <article
        className={`reveal-on-scroll group/card fluid-type-frame flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent ${
          cardFill === "none" ? "!bg-transparent !shadow-none" : ""
        } ${cardBorder === "off" ? "!border-transparent" : ""}`}
        style={{ "--reveal-index": revealIndex } as CSSProperties}
      >
        <div
          className={`flex flex-1 flex-col ${
            isPriority ? "p-8 max-md:p-6" : "p-6 max-md:p-5"
          }`}
        >
          {isPriority ? (
            <p className="type-label text-service-accent">{priorityEyebrow}</p>
          ) : null}
          <h3
            className={
              usePriorityTypography
                ? "type-heading-lg wrap-pretty mt-eyebrow-heading-md text-service-ink"
                : isPriority
                  ? "type-heading-sm mt-eyebrow-heading-sm text-service-ink"
                  : "type-heading-sm text-service-ink"
            }
          >
            {item.title}
          </h3>
          <p
            className={`${
              usePriorityTypography ? "type-text-md" : "type-text-sm"
            } wrap-pretty mt-heading-body-sm text-service-muted`}
          >
            {item.body}
          </p>
          {isPriority ? (
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              <Button href={primaryActionHref}>{primaryAction}</Button>
              <Button href={secondaryActionHref} variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          ) : cardLinks === "on" ? (
            <a
              className="type-label mt-auto inline-flex items-center gap-2 pt-5 text-service-accent transition-colors hover:text-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              href={item.href}
            >
              {linkLabel} <span aria-hidden="true">&rarr;</span>
            </a>
          ) : null}
        </div>
      </article>
    );
  }

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        {align === "left" ? (
          <LayoutGridItem
            alignY="stretch"
            className={`${priorityPosition} col-start-1`}
          >
            {renderCard(priorityItem, true, 0)}
          </LayoutGridItem>
        ) : null}

        <LayoutGridItem alignY="middle" className={smallCardsPosition}>
          <div className="grid auto-rows-fr grid-cols-3 gap-6 max-lg:grid-cols-2 max-md:grid-cols-1">
            {smallItems.map((item, index) => (
              <div
                className={
                  cardFill === "none" && cardBorder === "off" && index > 0
                    ? `relative flex before:absolute before:inset-y-0 before:-left-3 before:border-l before:border-service-border before:[border-left-width:var(--border-surface-width-token)] ${
                        index === 2
                          ? "max-lg:before:hidden"
                          : "max-md:before:hidden"
                      }`
                    : "flex"
                }
                key={item.title}
              >
                {renderCard(
                  item,
                  false,
                  align === "left" ? index + 1 : index,
                )}
              </div>
            ))}
          </div>
        </LayoutGridItem>

        {align === "right" ? (
          <LayoutGridItem
            alignY="stretch"
            className={`${priorityPosition} col-start-10 max-lg:col-start-1`}
          >
            {renderCard(priorityItem, true, 3)}
          </LayoutGridItem>
        ) : null}
      </LayoutGrid>
    </section>
  );
}
