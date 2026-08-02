"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  LayoutGrid,
  LayoutGridItem,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import type { SectionIcons } from "@/content/section-style-options";

const offersPerPage = 2;
const swipeThreshold = 52;
const sliderEase = [0.22, 1, 0.36, 1] as const;

export type AdditionalOffer = {
  action: string;
  badge: string;
  body: string;
  dateLabel: string;
  dateValue: string;
  title: string;
};

export type AdditionalOffersSectionV3Props = {
  cardBorder?: SectionCardBorder;
  cardFill?: SectionCardFill;
  heading: string;
  icons?: SectionIcons;
  offers: readonly AdditionalOffer[];
};

function ClipboardIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <path d="M9 5.5H6.5A1.5 1.5 0 0 0 5 7v13h14V7a1.5 1.5 0 0 0-1.5-1.5H15" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M9 3.5h6v4H9zM8.5 12h1.7M13 12h2.5M8.5 16h1.7M13 16h2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
      <rect x="2.75" y="4.75" width="14.5" height="12.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 2.75v4M13.5 2.75v4M2.75 8.5h14.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";

  return (
    <button
      aria-label={isPrevious ? "Show previous offers" : "Show next offers"}
      className="radius-button flex size-12 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-service-surface text-xl text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white"
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true">{isPrevious ? "←" : "→"}</span>
    </button>
  );
}

function SlideDots({
  activePage,
  pageCount,
  onSelect,
}: {
  activePage: number;
  pageCount: number;
  onSelect: (page: number) => void;
}) {
  return (
    <div aria-label="Offer slides" className="col-start-2 flex items-center justify-center">
      {Array.from({ length: pageCount }, (_, index) => {
        const isActive = index === activePage;

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            aria-label={`Show offer slide ${index + 1} of ${pageCount}`}
            className="group/dot grid size-4 cursor-pointer place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent"
            key={index}
            onClick={() => onSelect(index)}
            type="button"
          >
            <span
              className={cx(
                "size-1.5 rounded-full transition-colors duration-200",
                isActive
                  ? "bg-service-accent"
                  : "bg-service-border group-hover/dot:bg-service-muted",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

function OfferCard({
  borderClassName,
  fillClassName,
  icons,
  index,
  offer,
}: {
  borderClassName: string;
  fillClassName: string;
  icons: SectionIcons;
  index: number;
  offer: AdditionalOffer;
}) {
  return (
    <article
      className={cx(
        "h-full rounded-[var(--radius-surface-token)] border p-8 max-md:p-6",
        fillClassName,
        borderClassName,
      )}
    >
      <SevenColumnGrid className="h-full items-center" frame="none" gap="sml">
        {icons === "on" ? (
          <SevenColumnGridItem
            alignY="top"
            className="col-span-1 col-start-1 max-lg:col-span-1 max-md:col-span-1 max-sm:col-span-1"
          >
            <span className="flex size-14 !w-14 items-center justify-center rounded-full bg-service-accent text-white">
              {index % 2 === 0 ? <ClipboardIcon /> : <SunIcon />}
            </span>
          </SevenColumnGridItem>
        ) : null}

        <SevenColumnGridItem
          className={cx(
            "col-span-4 max-lg:col-span-4 max-md:col-span-2 max-sm:col-span-1 max-sm:col-start-1",
            icons === "on"
              ? "col-start-2 max-lg:col-start-2 max-md:col-start-2"
              : "col-start-1 max-lg:col-start-1 max-md:col-start-1",
          )}
        >
          <div className="fluid-type-frame">
            <p className="type-caption inline-flex rounded-full bg-bg-muted px-3 py-1 font-semibold text-service-accent">
              {offer.badge}
            </p>
            <h3 className="type-heading-sm wrap-pretty mt-3 text-service-ink">
              {offer.title}
            </h3>
            <p className="type-text-sm wrap-pretty mt-2 text-service-muted">
              {offer.body}
            </p>
            <div className="mt-5 flex items-start gap-2">
              {icons === "on" ? (
                <span className="mt-0.5 shrink-0 text-service-accent">
                  <CalendarIcon />
                </span>
              ) : null}
              <dl>
                <dt className="type-caption text-service-muted">{offer.dateLabel}</dt>
                <dd className="type-label mt-0.5 text-service-ink">{offer.dateValue}</dd>
              </dl>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="bottom"
          className="col-span-2 col-start-6 max-lg:col-span-5 max-lg:col-start-1 max-lg:row-auto max-md:col-span-3 max-md:col-start-1 max-sm:col-span-1"
        >
          <RequestServiceButton className="w-full !whitespace-nowrap !px-3">
            {offer.action}
            {icons === "on" ? <span aria-hidden="true" className="ml-2">→</span> : null}
          </RequestServiceButton>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </article>
  );
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AdditionalOffersSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  heading,
  icons = "on",
  offers,
}: AdditionalOffersSectionV3Props) {
  const [activePage, setActivePage] = useState(0);
  const [direction, setDirection] = useState<"previous" | "next">("next");
  const shouldReduceMotion = useReducedMotion();
  const pageCount = Math.max(Math.ceil(offers.length / offersPerPage), 1);
  const resolvedPage = Math.min(activePage, pageCount - 1);
  const offerPages = Array.from({ length: pageCount }, (_, pageIndex) =>
    offers.slice(
      pageIndex * offersPerPage,
      pageIndex * offersPerPage + offersPerPage,
    ),
  );
  const visibleOffers = offerPages[resolvedPage] ?? [];
  const hasMultiplePages = offers.length > offersPerPage;
  const fillClassName =
    cardFill === "none"
      ? "bg-transparent shadow-none"
      : "bg-service-surface shadow-service";
  const borderClassName =
    cardBorder === "off" ? "border-transparent" : "border-service-border";
  const slideTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: sliderEase };

  function showPage(page: number) {
    setDirection(page < resolvedPage ? "previous" : "next");
    setActivePage(page);
  }

  function movePage(nextDirection: "previous" | "next") {
    setDirection(nextDirection);
    setActivePage((currentPage) => {
      const safePage = Math.min(currentPage, pageCount - 1);

      return nextDirection === "previous"
        ? (safePage - 1 + pageCount) % pageCount
        : (safePage + 1) % pageCount;
    });
  }

  return (
    <section className="bg-bg-page">
      <LayoutGrid columns={14} minHeight="none" padding="sml">
        <LayoutGridItem className="col-span-14 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <h2 className="type-eyebrow text-service-accent">{heading}</h2>
        </LayoutGridItem>

        <LayoutGridItem className="relative col-span-14 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2">
          <div className="grid overflow-hidden">
            {hasMultiplePages ? (
              <div
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 grid pointer-events-none"
              >
                {offerPages.map((pageOffers, pageIndex) => (
                  <div
                    className="col-start-1 row-start-1 grid grid-cols-14 gap-6 max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2"
                    key={`size-page-${pageIndex}`}
                  >
                    {pageOffers.map((offer, index) => (
                      <div
                        className="col-span-7 max-lg:col-span-5 max-md:col-span-6 max-sm:col-span-2"
                        key={`size-${offer.title}-${pageIndex * offersPerPage + index}`}
                      >
                        <OfferCard
                          borderClassName={borderClassName}
                          fillClassName={fillClassName}
                          icons={icons}
                          index={pageIndex * offersPerPage + index}
                          offer={offer}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                aria-live="polite"
                className="col-start-1 row-start-1 grid grid-cols-14 gap-6 max-lg:grid-cols-10 max-md:grid-cols-6 max-sm:grid-cols-2"
                drag={hasMultiplePages && !shouldReduceMotion ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                exit={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : direction === "next" ? -18 : 18,
                }}
                initial={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : direction === "next" ? 24 : -24,
                }}
                key={resolvedPage}
                onDragEnd={(_, info) => {
                  if (info.offset.x <= -swipeThreshold) {
                    movePage("next");
                  } else if (info.offset.x >= swipeThreshold) {
                    movePage("previous");
                  }
                }}
                transition={slideTransition}
              >
                {visibleOffers.map((offer, index) => (
                  <div
                    className="col-span-7 max-lg:col-span-5 max-md:col-span-6 max-sm:col-span-2"
                    key={`${offer.title}-${resolvedPage * offersPerPage + index}`}
                  >
                    <OfferCard
                      borderClassName={borderClassName}
                      fillClassName={fillClassName}
                      icons={icons}
                      index={resolvedPage * offersPerPage + index}
                      offer={offer}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {hasMultiplePages ? (
            <>
              <div
                className="absolute top-1/2 !w-auto -translate-x-1/2 -translate-y-1/2 max-lg:hidden"
                style={{ left: "calc(var(--site-grid-inset-inline) / -2)" }}
              >
                <SliderArrow direction="previous" onClick={() => movePage("previous")} />
              </div>
              <div
                className="absolute top-1/2 !w-auto translate-x-1/2 -translate-y-1/2 max-lg:hidden"
                style={{ right: "calc(var(--site-grid-inset-inline) / -2)" }}
              >
                <SliderArrow direction="next" onClick={() => movePage("next")} />
              </div>

              <div className="mt-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <div className="hidden max-lg:block">
                  <SliderArrow direction="previous" onClick={() => movePage("previous")} />
                </div>
                <SlideDots
                  activePage={resolvedPage}
                  onSelect={showPage}
                  pageCount={pageCount}
                />
                <div className="hidden max-lg:block">
                  <SliderArrow direction="next" onClick={() => movePage("next")} />
                </div>
              </div>
            </>
          ) : null}
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
