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
  body: string;
  eyebrow: string;
  items: readonly CarouselTestimonial[];
  title: string;
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
      className="radius-medium flex size-14 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-white text-2xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-12"
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
      <blockquote className="type-text-xl measure-lead wrap-pretty mx-auto font-medium text-service-ink">
        &quot;{item.quote}&quot;
      </blockquote>
      <figcaption className="mt-12 max-md:mt-9">
        <p className="type-heading-md text-service-ink">{item.author}</p>
        <p className="type-label mt-3 text-service-muted">
          {item.city} | {item.service}
        </p>
      </figcaption>
    </>
  );
}

export function TestimonialsCarouselSectionV3({
  body,
  eyebrow,
  items,
  title,
}: TestimonialsCarouselSectionV3Props) {
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
        <SevenColumnGridItem
          alignX="center"
          className="col-span-3 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="fluid-type-frame mx-auto w-full measure-lead text-center">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mx-auto mt-5 text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg measure-copy wrap-pretty mx-auto mt-6 text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-5 col-start-2 max-lg:col-span-7 max-lg:col-start-1">
          <div className="mt-16 flex items-center justify-center gap-8 max-lg:gap-5 max-md:mt-12 max-md:flex-wrap">
            <SliderButton
              direction="previous"
              label="Show previous testimonial"
              onClick={showPrevious}
            />

            <div className="flex-1 max-md:order-first max-md:basis-full">
              <div className="grid">
                {items.map((item) => (
                  <figure
                    aria-hidden="true"
                    className="radius-medium invisible col-start-1 row-start-1 border border-service-border bg-white px-16 py-14 text-center shadow-service max-lg:px-10 max-md:px-6 max-md:py-10"
                    key={`${item.author}-size`}
                  >
                    <TestimonialCardContent item={item} />
                  </figure>
                ))}

                <AnimatePresence initial={false} mode="wait">
                  <motion.figure
                    aria-live="polite"
                    className="radius-medium col-start-1 row-start-1 border border-service-border bg-white px-16 py-14 text-center shadow-service max-lg:px-10 max-md:px-6 max-md:py-10"
                    key={activeItem.author}
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
                className="mt-8 flex items-center justify-center gap-3"
              >
                {items.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      aria-current={isActive ? "true" : undefined}
                      aria-label={`Show testimonial ${index + 1}`}
                      className={`size-3 cursor-pointer rounded-full border border-service-accent transition-colors ${
                        isActive ? "bg-service-accent" : "bg-transparent"
                      }`}
                      key={item.author}
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
