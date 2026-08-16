"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const testimonialEase = [0.22, 1, 0.36, 1] as const;

type CarouselTestimonial = {
  author: string;
  city: string;
  quote: string;
  service: string;
};

type TestimonialsCarouselSectionV3Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  items: readonly CarouselTestimonial[];
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
      className="radius-button flex size-14 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-bg-page text-2xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-12"
      onClick={onClick}
      type="button"
    >
      {direction === "previous" ? "<" : ">"}
    </button>
  );
}

function TestimonialCardContent({ item }: { item: CarouselTestimonial }) {
  return (
    <>
      <blockquote className="type-text-xl wrap-pretty mx-auto font-medium text-service-ink">
        &quot;{item.quote}&quot;
      </blockquote>
      <figcaption className="mt-body-actions-lg max-md:mt-body-actions-md">
        <p className="type-heading-md text-service-ink">{item.author}</p>
        <p className="type-label mt-heading-body-sm text-service-muted">
          {item.city} | {item.service}
        </p>
      </figcaption>
    </>
  );
}

export function TestimonialsCarouselSectionV3({
  cardBorder = "on",
  cardFill = "solid",
  items,
}: TestimonialsCarouselSectionV3Props) {
  // The visible card and the invisible sizer behind it must carry identical
  // box classes - the sizer is what reserves the row's height, so a fill or
  // border applied to only one of them would resize the carousel.
  const cardClass = cx(
    "content-padding radius-medium border border-service-border bg-surface-raised text-center shadow-service",
    cardFill === "none" && "!bg-transparent !shadow-none",
    cardBorder === "off" && "!border-transparent",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const cardTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: testimonialEase };

  function showPrevious() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1,
    );
  }

  function showNext() {
    setActiveIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1,
    );
  }

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem className="col-span-7 col-start-1 max-lg:col-span-7 max-lg:col-start-1">
          <div className="mx-auto flex !w-5/6 items-center justify-center inline-gap-xlrg max-lg:!w-full max-md:flex-wrap">
            <SliderButton
              direction="previous"
              label="Show previous testimonial"
              onClick={showPrevious}
            />

            <div className="flex-1 max-md:order-first max-md:basis-full">
              <div className="grid">
                {items.map((item, index) => (
                  <figure
                    aria-hidden="true"
                    className={cx("invisible col-start-1 row-start-1", cardClass)}
                    key={`${index}-size`}
                  >
                    <TestimonialCardContent item={item} />
                  </figure>
                ))}

                <AnimatePresence initial={false} mode="wait">
                  <motion.figure
                    aria-live="polite"
                    className={cx("col-start-1 row-start-1", cardClass)}
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
                    <TestimonialCardContent item={activeItem} />
                  </motion.figure>
                </AnimatePresence>
              </div>

              <div
                aria-label="Testimonial slides"
                className="mt-body-actions-sm flex items-center justify-center inline-gap-sml"
              >
                {items.map((_item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Show testimonial ${index + 1}`}
                      className={`size-3 cursor-pointer rounded-full border border-service-accent transition-colors ${
                        isActive ? "bg-service-accent" : "bg-transparent"
                      }`}
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      type="button"
                    />
                  );
                })}
              </div>
            </div>

            <SliderButton
              direction="next"
              label="Show next testimonial"
              onClick={showNext}
            />
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
