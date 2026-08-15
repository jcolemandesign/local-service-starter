"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";

const testimonialEase = [0.22, 1, 0.36, 1] as const;
const visibleTestimonialCount = 3;

type CarouselTestimonial = {
  author: string;
  city: string;
  quote: string;
  service: string;
};

const fallbackTestimonials: CarouselTestimonial[] = [
  {
    author: "Jordan Ellis",
    city: "Oak Ridge",
    quote:
      "The visit felt organized from the first call. They explained the issue, gave us clear options, and kept the work area spotless.",
    service: "Repair visit",
  },
  {
    author: "Nadia Brooks",
    city: "Westfield",
    quote:
      "We finally understood what needed attention now and what could wait. That made the decision feel practical instead of pressured.",
    service: "System consultation",
  },
  {
    author: "Caleb Morris",
    city: "Riverton",
    quote:
      "The crew arrived when expected, finished the work carefully, and followed up with notes we could actually use.",
    service: "Maintenance service",
  },
  {
    author: "Monica Vale",
    city: "Fairview",
    quote:
      "They took time to answer every question before starting. The estimate matched the work, and there were no surprises at the end.",
    service: "Installation estimate",
  },
  {
    author: "Reed Taylor",
    city: "Cedar Park",
    quote:
      "Scheduling was simple, communication was steady, and the technician treated our home with real care.",
    service: "Service appointment",
  },
  {
    author: "Avery Stone",
    city: "Lakeview",
    quote:
      "The recommendation was straightforward and easy to trust. We knew exactly why the repair made sense for our situation.",
    service: "Home repair",
  },
];

type TestimonialsCarouselCondensedSectionV3Props = {
  body?: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow?: string;
  items: readonly CarouselTestimonial[];
  title?: string;
};

function SliderButton({
  direction,
  label,
  onClick,
}: {
  direction: "previous" | "next";
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className="radius-button flex size-12 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-bg-page text-xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-11"
      onClick={onClick}
      type="button"
    >
      {direction === "previous" ? "<" : ">"}
    </button>
  );
}

function getVisibleTestimonials(
  items: readonly CarouselTestimonial[],
  startIndex: number,
) {
  return Array.from(
    { length: Math.min(visibleTestimonialCount, items.length) },
    (_, offset) => items[(startIndex + offset) % items.length],
  );
}

function getCarouselTestimonials(items: readonly CarouselTestimonial[]) {
  if (items.length > visibleTestimonialCount) {
    return items;
  }

  return [...items, ...fallbackTestimonials].slice(
    0,
    visibleTestimonialCount * 2,
  );
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TestimonialCard({
  cardBorder,
  cardFill,
  className,
  item,
}: {
  cardBorder: "on" | "off";
  cardFill: "solid" | "none";
  className?: string;
  item: CarouselTestimonial;
}) {
  return (
    <figure
      className={cx(
        "radius-medium flex min-h-full flex-col justify-between border p-8 max-md:p-6",
        cardFill === "none"
          ? "bg-transparent shadow-none"
          : "bg-surface-raised shadow-service",
        cardBorder === "off" ? "border-transparent" : "border-service-border",
        className,
      )}
    >
      <blockquote className="type-text-sm leading-relaxed text-service-ink">
        &quot;{item.quote}&quot;
      </blockquote>
      <figcaption className="mt-body-actions-sm">
        <p className="type-text-xs font-semibold text-service-ink">
          {item.author}
        </p>
        <p className="type-caption mt-heading-body-sm text-service-muted">
          {item.city} | {item.service}
        </p>
      </figcaption>
    </figure>
  );
}

export function TestimonialsCarouselCondensedSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  items,
}: TestimonialsCarouselCondensedSectionV3Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const carouselItems = getCarouselTestimonials(items);
  const visibleItems = getVisibleTestimonials(carouselItems, activeIndex);
  const groupCount = Math.ceil(carouselItems.length / visibleTestimonialCount);
  const activeGroupIndex = Math.floor(activeIndex / visibleTestimonialCount);
  const isUnframed = cardBorder === "off" && cardFill === "none";
  const slideGridClassName = isUnframed
    ? "grid grid-cols-14 site-grid-gap max-lg:grid-cols-2 max-md:grid-cols-1"
    : "grid grid-cols-3 inline-gap-xlrg max-lg:grid-cols-2 max-md:grid-cols-1";
  const cardTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: testimonialEase };

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0
        ? Math.max(carouselItems.length - visibleTestimonialCount, 0)
        : Math.max(currentIndex - visibleTestimonialCount, 0),
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) => {
      const nextIndex = currentIndex + visibleTestimonialCount;

      return nextIndex >= carouselItems.length ? 0 : nextIndex;
    });
  }

  return (
    <section className="bg-service-surface">
      <LayoutGrid className="section-min-none" columns={14} padding="med">
        <LayoutGridItem className="relative col-span-14">
          {/* The slide still clips on the inline axis, but the clip margin
              extends beyond the card grid so the first and last shadows can
              paint. Unlike margin and padding, this does not affect sizing or
              move the centred carousel. */}
          <div className="grid overflow-x-clip [overflow-clip-margin:var(--section-space-sml)]">
            <div
              aria-hidden="true"
              className="invisible col-start-1 row-start-1 grid"
            >
              {Array.from({ length: groupCount }, (_, index) => (
                <div
                  className={cx(
                    "col-start-1 row-start-1",
                    slideGridClassName,
                  )}
                  key={`size-group-${index}`}
                >
                  {getVisibleTestimonials(
                    carouselItems,
                    index * visibleTestimonialCount,
                  ).map((item, itemIndex) => (
                    <TestimonialCard
                      cardBorder={cardBorder}
                      cardFill={cardFill}
                      className={
                        isUnframed
                          ? cx(
                              "col-span-4 max-lg:col-span-1",
                              itemIndex === 0 && "col-start-2 max-lg:col-start-auto",
                            )
                          : undefined
                      }
                      item={item}
                      key={`${itemIndex}-size`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                aria-live="polite"
                className={cx(
                  "col-start-1 row-start-1",
                  slideGridClassName,
                )}
                key={activeIndex}
                initial={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : 10,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: shouldReduceMotion ? 0 : -6,
                }}
                transition={cardTransition}
              >
                {visibleItems.map((item, itemIndex) => (
                  <TestimonialCard
                    cardBorder={cardBorder}
                    cardFill={cardFill}
                    className={
                      isUnframed
                        ? cx(
                            "col-span-4 max-lg:col-span-1",
                            itemIndex === 0 && "col-start-2 max-lg:col-start-auto",
                          )
                        : undefined
                    }
                    item={item}
                    key={itemIndex}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            aria-label="Testimonial groups"
            className="mt-body-actions-sm flex items-center justify-center inline-gap-sml max-lg:hidden"
          >
            {Array.from({ length: groupCount }, (_, index) => {
              const isActive = index === activeGroupIndex;

              return (
                <button
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Show testimonial group ${index + 1}`}
                  className={`size-3 cursor-pointer rounded-full border border-service-accent transition-colors ${
                    isActive ? "bg-service-accent" : "bg-transparent"
                  }`}
                  key={index}
                  onClick={() =>
                    setActiveIndex(index * visibleTestimonialCount)
                  }
                  type="button"
                />
              );
            })}
          </div>

          <div
            className="absolute top-1/2 !w-auto -translate-x-1/2 -translate-y-1/2 max-lg:hidden"
            style={{ left: "calc(var(--site-grid-inset-inline) / -2)" }}
          >
            <SliderButton
              direction="previous"
              label="Show previous testimonials"
              onClick={showPrevious}
            />
          </div>
          <div
            className="absolute top-1/2 !w-auto translate-x-1/2 -translate-y-1/2 max-lg:hidden"
            style={{ right: "calc(var(--site-grid-inset-inline) / -2)" }}
          >
            <SliderButton
              direction="next"
              label="Show next testimonials"
              onClick={showNext}
            />
          </div>

          <div className="mt-4 hidden grid-cols-[auto_1fr_auto] items-center gap-3 max-lg:grid">
            <SliderButton
              direction="previous"
              label="Show previous testimonials"
              onClick={showPrevious}
            />
            <div
              aria-label="Testimonial groups"
              className="col-start-2 flex items-center justify-center inline-gap-sml"
            >
              {Array.from({ length: groupCount }, (_, index) => {
                const isActive = index === activeGroupIndex;

                return (
                  <button
                    aria-current={isActive ? "true" : undefined}
                    aria-label={`Show testimonial group ${index + 1}`}
                    className={`size-3 cursor-pointer rounded-full border border-service-accent transition-colors ${
                      isActive ? "bg-service-accent" : "bg-transparent"
                    }`}
                    key={index}
                    onClick={() =>
                      setActiveIndex(index * visibleTestimonialCount)
                    }
                    type="button"
                  />
                );
              })}
            </div>
            <SliderButton
              direction="next"
              label="Show next testimonials"
              onClick={showNext}
            />
          </div>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
