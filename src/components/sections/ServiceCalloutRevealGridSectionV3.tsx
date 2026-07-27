"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

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
}: ServiceCalloutRevealGridSectionV3Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();
  const shouldReduceMotion = useReducedMotion();
  const cards = items.slice(0, 4);
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
          "group/callout card-min-short flex w-full min-w-0 cursor-pointer flex-col items-start overflow-hidden rounded-[var(--radius-surface-token)] border border-service-border bg-service-surface p-8 text-left text-service-ink shadow-service transition duration-200 ease-out hover:-translate-y-1 hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent max-md:p-6",
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
          <span className="type-heading-lg wrap-pretty">{item.title}</span>
          {item.body ? (
            <span className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted">
              {item.body}
            </span>
          ) : null}
          <span className="type-label mt-auto inline-flex items-center gap-2 pt-3 text-service-accent">
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
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem
          alignY="stretch"
          className="col-span-12 col-start-2 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          <div className="relative">
            <div className="grid auto-rows-fr grid-cols-2 gap-6 max-sm:grid-cols-1">
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

                    <div className="fluid-type-frame pr-14 max-sm:pr-0">
                      <h3
                        className="type-heading-lg wrap-pretty text-service-ink"
                        id={`${panelId}-heading`}
                      >
                        {activeItem.panelHeading}
                      </h3>
                      {/* The panel runs the full width of the card block, so
                          only the body is held to a readable measure - the
                          heading is free to use the width. */}
                      <p className="type-text-md measure-copy-wide wrap-pretty mt-heading-body-sm text-service-muted">
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
