"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type { CalloutRevealGridVariant } from "@/content/section-style-options";
import { CalloutCardAffordance } from "./CalloutCardAffordance";

export type ServiceCalloutRevealGridItem = {
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

export type ServiceCalloutRevealGridSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  closeLabel?: string;
  items: readonly ServiceCalloutRevealGridItem[];
  openHint?: string;
  variant?: CalloutRevealGridVariant;
};

const revealEase = [0.22, 1, 0.36, 1] as const;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ServiceCalloutRevealGridSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  closeLabel = "Close details",
  items,
  openHint = "See what to do",
  variant = "default",
}: ServiceCalloutRevealGridSectionV3Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const isThreeAcross = variant === "three-across";
  // Both arrangements only look right at a whole number of rows: four in a 2x2,
  // or three and six across three columns. The cap is the row limit, not a
  // content limit - anything past it would leave a ragged final row.
  const cards = isThreeAcross ? items.slice(0, 6) : items.slice(0, 4);
  const activeItem = openIndex === null ? undefined : cards[openIndex];

  // The panel replaces the cards visually, so leaving focus on a card the user
  // can no longer see strands keyboard and screen-reader users behind it.
  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    closeRef.current?.focus();
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const activeIndex = openIndex;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      setOpenIndex(null);
      cardRefs.current[activeIndex]?.focus();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex]);

  function closePanel() {
    if (openIndex === null) {
      return;
    }

    const activeIndex = openIndex;

    setOpenIndex(null);
    cardRefs.current[activeIndex]?.focus();
  }

  function renderCard(item: ServiceCalloutRevealGridItem, index: number) {
    return (
      <button
        aria-controls={panelId}
        aria-expanded={openIndex === index}
        className={cx(
          "group/callout flex w-full min-w-0 cursor-pointer flex-col items-start overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface text-left text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent hover:bg-bg-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
          // Three across makes each card two columns narrower, so it steps the
          // padding and type down a notch to keep the same density. The taller
          // floor is what keeps a single row of three from leaving the reveal
          // panel - which covers exactly this grid - too short for its own copy.
          isThreeAcross
            ? "card-min-medium p-6 max-md:p-5"
            : "card-min-short p-8 max-md:p-6",
          cardFill === "none" && "!bg-transparent !shadow-none",
          cardBorder === "off" && "!border-transparent",
        )}
        key={item.title}
        onClick={() => setOpenIndex(index)}
        ref={(element) => {
          cardRefs.current[index] = element;
        }}
        type="button"
      >
        <span className="fluid-type-frame flex w-full flex-1 flex-col">
          <span
            className={cx(
              "wrap-pretty",
              isThreeAcross ? "type-heading-md" : "type-heading-lg",
            )}
          >
            {item.title}
          </span>
          {item.body ? (
            <span
              className={cx(
                "wrap-pretty mt-heading-body-sm text-service-muted",
                isThreeAcross ? "type-text-sm" : "type-text-md",
              )}
            >
              {item.body}
            </span>
          ) : null}
          <span className="mt-auto flex items-center justify-between gap-3 pt-3">
            <span className="type-label text-service-accent">{openHint}</span>
            <CalloutCardAffordance />
          </span>
        </span>
      </button>
    );
  }

  return (
    <section className="bg-bg-page">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem
          alignY="stretch"
          className="col-span-12 col-start-2 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          <div className="relative">
            {/* Three across reduces to two before it stacks: dropping straight
                from three to one would leave a very long column on tablet. */}
            <div
              className={cx(
                "grid auto-rows-fr gap-6",
                isThreeAcross
                  ? "grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1"
                  : "grid-cols-2 max-sm:grid-cols-1",
              )}
            >
              {cards.map((item, index) => renderCard(item, index))}
            </div>

            <AnimatePresence>
              {activeItem ? (
                // Sits slightly outside the card grid so the panel reads as a
                // layer over the whole set rather than an expanded card.
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  aria-labelledby={`${panelId}-heading`}
                  className="absolute -inset-4 z-20 max-sm:-inset-2"
                  exit={{
                    opacity: 0,
                    scale: shouldReduceMotion ? 1 : 0.99,
                  }}
                  id={panelId}
                  initial={{
                    opacity: 0,
                    scale: shouldReduceMotion ? 1 : 0.98,
                  }}
                  role="group"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.22, ease: revealEase }
                  }
                >
                  <div className="relative flex h-full w-full flex-col justify-center overflow-y-auto rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-10 shadow-service max-md:p-8 max-sm:p-6">
                    <button
                      aria-label={closeLabel}
                      className="absolute right-5 top-5 grid size-10 cursor-pointer place-items-center rounded-[var(--radius-sm-token)] border border-service-border bg-bg-surface text-service-muted transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent"
                      onClick={closePanel}
                      ref={closeRef}
                      type="button"
                    >
                      <svg
                        aria-hidden="true"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                        viewBox="0 0 16 16"
                      >
                        <path d="M4 4l8 8M12 4l-8 8" />
                      </svg>
                    </button>

                    {/* Block centered in the panel, copy still left-aligned.
                        The measure sits on the wrapper so the heading and body
                        share one edge rather than the body running narrower. */}
                    <div className="fluid-type-frame measure-copy-wide mx-auto w-full">
                      {/* Reiterates which card was opened. The panel covers the
                          cards, so without this the heading has lost its
                          subject. Reuses the card title - no new copy field. */}
                      <p className="type-label text-service-accent">
                        {activeItem.title}
                      </p>
                      <h3
                        className="type-heading-xl wrap-pretty mt-eyebrow-heading-lg text-service-ink max-sm:pr-12"
                        id={`${panelId}-heading`}
                      >
                        {activeItem.panelHeading}
                      </h3>
                      <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
                        {activeItem.panelBody}
                      </p>
                      {activeItem.actionLabel ? (
                        <div className="mt-body-actions-md flex flex-wrap gap-3">
                          <Button href={activeItem.actionHref ?? "/contact"}>
                            {activeItem.actionLabel}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
