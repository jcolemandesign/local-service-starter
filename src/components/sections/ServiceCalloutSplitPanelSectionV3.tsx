"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ServiceCalloutSplitPanelItem = {
  /**
   * Per-card conversion target. Kept as a plain href so each site can point it
   * at whatever the finished page needs - a prefilled request modal, a service
   * page, or a tel: link - without the section knowing about any of them.
   */
  actionHref?: string;
  actionLabel?: string;
  body: string;
  panelBody: string;
  panelHeading: string;
  title: string;
};

export type ServiceCalloutSplitPanelSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  introBody?: string;
  introHeading?: string;
  items: readonly ServiceCalloutSplitPanelItem[];
  openHint?: string;
};

const panelEase = [0.22, 1, 0.36, 1] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServiceCalloutSplitPanelSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  introBody = "",
  introHeading = "",
  items,
  openHint = "See what to do",
}: ServiceCalloutSplitPanelSectionV3Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const cards = items.slice(0, 4);
  const activeItem = activeIndex === null ? undefined : cards[activeIndex];

  function renderCard(item: ServiceCalloutSplitPanelItem, index: number) {
    const isActive = activeIndex === index;

    return (
      <button
        aria-controls={panelId}
        // The panel sits beside the cards rather than over them, so the pressed
        // state is the only thing tying a card to what the panel is showing.
        aria-pressed={isActive}
        className={cx(
          "group/callout card-min-short flex w-full min-w-0 cursor-pointer flex-col items-start overflow-hidden rounded-[var(--radius-surface-token)] border bg-service-surface p-6 text-left text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent max-md:p-5",
          isActive ? "border-service-accent" : "border-service-border",
          cardFill === "none" && "!bg-transparent !shadow-none",
          cardBorder === "off" && "!border-transparent",
        )}
        key={item.title}
        // Re-clicking the active card returns the panel to its opening
        // statement, so there is a way back without a separate reset control.
        onClick={() => setActiveIndex(isActive ? null : index)}
        type="button"
      >
        <span className="fluid-type-frame flex w-full flex-1 flex-col">
          <span className="type-heading-md wrap-pretty">{item.title}</span>
          {item.body ? (
            <span className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
              {item.body}
            </span>
          ) : null}
          <span
            className={cx(
              "type-label mt-auto inline-flex items-center gap-2 pt-3",
              isActive ? "text-service-ink" : "text-service-accent",
            )}
          >
            {openHint}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover/callout:translate-x-1"
            >
              &rarr;
            </span>
          </span>
        </span>
      </button>
    );
  }

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="section-min-none items-stretch"
        columns={14}
        padding="med"
      >
        <LayoutGridItem
          alignY="stretch"
          className="col-span-6 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2"
        >
          <div className="grid auto-rows-fr grid-cols-2 gap-6 max-sm:grid-cols-1">
            {cards.map((item, index) => renderCard(item, index))}
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignY="stretch"
          className="col-span-7 col-start-8 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          <div
            aria-live="polite"
            className={cx(
              "relative flex h-full flex-col justify-center overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-10 shadow-service max-md:p-8 max-sm:p-6",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
            id={panelId}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="fluid-type-frame"
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                key={activeItem ? activeItem.title : "intro"}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: panelEase }
                }
              >
                <h3 className="type-heading-lg wrap-pretty text-service-ink">
                  {activeItem ? activeItem.panelHeading : introHeading}
                </h3>
                <p className="type-text-md measure-copy-wide wrap-pretty mt-heading-body-sm text-service-muted">
                  {activeItem ? activeItem.panelBody : introBody}
                </p>
                {activeItem?.actionLabel ? (
                  <div className="mt-body-actions-md flex flex-wrap gap-3">
                    <Button href={activeItem.actionHref ?? "/contact"}>
                      {activeItem.actionLabel}
                    </Button>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
