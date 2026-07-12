"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

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
      className="radius-button flex size-12 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-white text-xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-11"
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
  className,
  item,
}: {
  className?: string;
  item: CarouselTestimonial;
}) {
  return (
    <figure
      className={cx(
        "content-padding radius-medium flex min-h-full flex-col justify-between border border-service-border bg-white shadow-service",
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
  items,
}: TestimonialsCarouselCondensedSectionV3Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const carouselItems = getCarouselTestimonials(items);
  const visibleItems = getVisibleTestimonials(carouselItems, activeIndex);
  const groupCount = Math.ceil(carouselItems.length / visibleTestimonialCount);
  const activeGroupIndex = Math.floor(activeIndex / visibleTestimonialCount);
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
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem className="col-span-7">
          <div className="flex items-center inline-gap-xlrg max-md:flex-wrap">
            <SliderButton
              direction="previous"
              label="Show previous testimonials"
              onClick={showPrevious}
            />

            <div className="grid min-w-0 flex-1 max-md:order-first max-md:basis-full">
              <div
                aria-hidden="true"
                className="invisible col-start-1 row-start-1 grid"
              >
                {Array.from({ length: groupCount }, (_, index) => (
                  <div
                    className="col-start-1 row-start-1 grid grid-cols-3 inline-gap-xlrg max-lg:grid-cols-2 max-md:grid-cols-1"
                    key={`size-group-${index}`}
                  >
                    {getVisibleTestimonials(
                      carouselItems,
                      index * visibleTestimonialCount,
                    ).map((item) => (
                      <TestimonialCard
                        item={item}
                        key={`${item.author}-${item.service}-size`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  aria-live="polite"
                  className="col-start-1 row-start-1 grid grid-cols-3 inline-gap-xlrg max-lg:grid-cols-2 max-md:grid-cols-1"
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
                  {visibleItems.map((item) => (
                    <TestimonialCard
                      item={item}
                      key={`${item.author}-${item.service}`}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>

              <div className="col-start-1 row-start-2">
                <div
                  aria-label="Testimonial groups"
                  className="mt-body-actions-sm flex items-center justify-center inline-gap-sml"
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
              </div>
            </div>

            <SliderButton
              direction="next"
              label="Show next testimonials"
              onClick={showNext}
            />
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
