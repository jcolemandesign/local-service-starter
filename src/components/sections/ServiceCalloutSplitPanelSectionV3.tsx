"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  CalloutSplitPanelVariant,
  SectionIcons,
} from "@/content/section-style-options";
import {
  CalloutCardAffordance,
  CalloutCardTopicIcon,
} from "./CalloutCardAffordance";

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
  closeLabel?: string;
  introBody?: string;
  introHeading?: string;
  icons?: SectionIcons;
  items: readonly ServiceCalloutSplitPanelItem[];
  openHint?: string;
  variant?: CalloutSplitPanelVariant;
};

const panelEase = [0.22, 1, 0.36, 1] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServiceCalloutSplitPanelSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  closeLabel = "Close details",
  introBody = "",
  introHeading = "",
  icons = "on",
  items,
  openHint = "See what to do",
  variant = "default",
}: ServiceCalloutSplitPanelSectionV3Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const isStacked = variant === "stacked";
  // The two-up grid is a fixed 2x2, so a fifth card would leave a ragged row.
  // The stacked column has no such limit - running as long as the content needs
  // is the point of it.
  const cards = isStacked ? items : items.slice(0, 4);
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
          "group/callout card-min-short relative flex w-full min-w-0 cursor-pointer flex-col items-start overflow-hidden rounded-[var(--radius-surface-token)] border bg-service-surface text-left text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent hover:bg-bg-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
          // A stacked card is the full width of the column rather than half of
          // it, so it carries the roomier padding and type the extra width can
          // hold - the two-up card would look overscaled at these values.
          isStacked ? "p-8 max-md:p-6" : "p-6 max-md:p-5",
          isActive ? "border-service-accent" : "border-service-border",
          "recipe-card-context",
          cardFill === "none" && "!bg-transparent !shadow-none",
          cardBorder === "off" && "!border-transparent",
        )}
        key={item.title}
        // Re-clicking the active card returns the panel to its opening
        // statement, so there is a way back without a separate reset control.
        onClick={() => setActiveIndex(isActive ? null : index)}
        type="button"
      >
        {icons === "on" ? <CalloutCardTopicIcon index={index} /> : null}
        <span className="fluid-type-frame flex w-full flex-1 flex-col">
          <span
            className={cx(
              "wrap-pretty",
              isStacked ? "type-heading-lg" : "type-heading-md",
              icons === "on" && "pr-14",
            )}
          >
            {item.title}
          </span>
          {item.body ? (
            <span
              className={cx(
                "wrap-pretty mt-heading-body-sm text-service-muted",
                isStacked ? "type-text-md" : "type-text-sm",
              )}
            >
              {item.body}
            </span>
          ) : null}
          {/* The filled box doubles as the selected state - it is a stronger
              signal than the accent border alone that this card is the one
              driving the panel. */}
          <span className="mt-auto flex items-center justify-between gap-3 pt-3">
            <span
              className={cx(
                "type-label",
                isActive ? "text-service-ink" : "text-service-accent",
              )}
            >
              {openHint}
            </span>
            {/* These tiles toggle and hold their state, so the checkbox stays
                visibly checked while this card drives the side panel. */}
            <CalloutCardAffordance isActive={isActive} marker="check" />
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
          {/* auto-rows-fr is what keeps the cards a consistent height: with a
              content-driven container every row resolves to the tallest one, so
              a card with a longer body does not leave its neighbours short. */}
          <div
            className={cx(
              "grid auto-rows-fr gap-6",
              isStacked ? "grid-cols-1" : "grid-cols-2 max-sm:grid-cols-1",
            )}
          >
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
              "relative flex flex-col justify-center overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-10 shadow-service max-md:p-8 max-sm:p-6",
              // Sticky only has somewhere to travel while the panel is shorter
              // than the grid item holding it, and the item is stretched to a
              // row as tall as the card stack. So the panel drops h-full and
              // takes a min-height instead - that also stops it resizing as the
              // copy changes between cards, which would jump a pinned panel.
              isStacked
                ? "card-min-tall sticky top-[var(--site-grid-inset-block)] h-fit max-lg:static"
                : "h-full",
              "recipe-card-context",
              cardFill === "none" && "!bg-transparent !shadow-none",
              cardBorder === "off" && "!border-transparent",
            )}
            id={panelId}
          >
            {/* Re-clicking the active card still clears the panel, but once the
                stack is long enough to scroll that card can be far off screen -
                the pinned panel needs its own way back. */}
            {isStacked && activeItem ? (
              <button
                aria-label={closeLabel}
                className="absolute right-5 top-5 z-10 grid size-10 cursor-pointer place-items-center rounded-[var(--radius-sm-token)] border border-service-border bg-surface-raised text-service-muted shadow-service transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent"
                onClick={() => setActiveIndex(null)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            ) : null}

            <AnimatePresence initial={false} mode="wait">
              {/* Block centered in the panel, copy still left-aligned. The
                  measure sits on the wrapper so the heading and body share one
                  edge rather than the body running narrower. */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="fluid-type-frame measure-copy-wide mx-auto w-full"
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -4 }}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                key={activeItem ? activeItem.title : "intro"}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: panelEase }
                }
              >
                {/* Reiterates which card is selected. Reuses the card title, so
                    no new copy field. The opening state has no card behind it
                    and therefore no eyebrow. */}
                {activeItem ? (
                  <p
                    className={cx(
                      "type-label text-service-accent",
                      // Only the eyebrow sits high enough to reach the close
                      // button in the corner - the heading below it already
                      // clears the button's bottom edge.
                      isStacked && "pr-12",
                    )}
                  >
                    {activeItem.title}
                  </p>
                ) : null}
                <h3
                  className={cx(
                    "type-heading-xl wrap-pretty text-service-ink",
                    activeItem && "mt-eyebrow-heading-lg",
                  )}
                >
                  {activeItem ? activeItem.panelHeading : introHeading}
                </h3>
                <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
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
