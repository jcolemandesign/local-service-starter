"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const testimonialEase = [0.22, 1, 0.36, 1] as const;

type CarouselTestimonial = {
  quote: string;
  author: string;
  city: string;
  service: string;
};

type TestimonialsCarouselSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: CarouselTestimonial[];
};

function cx(...classes: Array<string | undefined>) {
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
      type="button"
      aria-label={label}
      className={cx(
        "radius-medium",
        "flex size-14 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-white text-2xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-12",
      )}
      onClick={onClick}
    >
      {direction === "previous" ? "<" : ">"}
    </button>
  );
}

function TestimonialCardContent({ item }: { item: CarouselTestimonial }) {
  return (
    <>
      <blockquote
        className={cx(
          "type-heading-lg",
          "measure-copy-wide",
          "mx-auto text-service-ink",
        )}
      >
        &quot;{item.quote}&quot;
      </blockquote>
      <figcaption className="mt-12 max-md:mt-9">
        <p
          className={cx(
            "type-heading-md",
            "text-service-ink",
          )}
        >
          {item.author}
        </p>
        <p
          className={cx(
            "type-label",
            "mt-3 text-service-muted",
          )}
        >
          {item.city} | {item.service}
        </p>
      </figcaption>
    </>
  );
}

export function TestimonialsCarouselSectionV2({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsCarouselSectionV2Props) {
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
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site">
        <div className={cx("fluid-type-frame", "mx-auto max-w-6xl text-center")}>
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-xl",
              "mx-auto mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
              "mx-auto mt-6 text-service-muted",
            )}
          >
            {body}
          </p>

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
                    key={`${item.author}-size`}
                    aria-hidden="true"
                    className={cx(
                      "radius-medium",
                      "invisible col-start-1 row-start-1 border border-service-border bg-white px-16 py-14 shadow-service max-lg:px-10 max-md:px-6 max-md:py-10",
                    )}
                  >
                    <TestimonialCardContent item={item} />
                  </figure>
                ))}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={activeItem.author}
                    aria-live="polite"
                    className={cx(
                      "radius-medium",
                      "col-start-1 row-start-1 border border-service-border bg-white px-16 py-14 shadow-service max-lg:px-10 max-md:px-6 max-md:py-10",
                    )}
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
                className="mt-8 flex items-center justify-center gap-3"
                aria-label="Testimonial slides"
              >
                {items.map((item, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.author}
                      type="button"
                      aria-label={`Show testimonial ${index + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`size-3 cursor-pointer rounded-full border border-service-accent transition-colors ${
                        isActive ? "bg-service-accent" : "bg-transparent"
                      }`}
                      onClick={() => setActiveIndex(index)}
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
        </div>
      </div>
    </section>
  );
}
