"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Container, Section, SectionHeading } from "@/components/primitives";

const testimonialEase = [0.22, 1, 0.36, 1] as const;

type CarouselTestimonial = {
  quote: string;
  author: string;
  city: string;
  service: string;
};

type TestimonialsCarouselSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: CarouselTestimonial[];
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
      type="button"
      aria-label={label}
      className="flex size-14 shrink-0 items-center justify-center rounded-md border border-service-border bg-white text-2xl font-semibold leading-none text-service-accent shadow-service transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-12"
      onClick={onClick}
    >
      {direction === "previous" ? "<" : ">"}
    </button>
  );
}

function TestimonialCardContent({ item }: { item: CarouselTestimonial }) {
  return (
    <>
      <blockquote className="mx-auto max-w-5xl text-5xl font-semibold leading-tight text-service-ink max-lg:text-4xl max-md:text-3xl">
        &quot;{item.quote}&quot;
      </blockquote>
      <figcaption className="mt-12">
        <p className="text-3xl font-semibold leading-tight text-service-ink max-md:text-2xl">
          {item.author}
        </p>
        <p className="mt-3 text-base font-medium uppercase text-service-muted max-md:text-sm">
          {item.city} | {item.service}
        </p>
      </figcaption>
    </>
  );
}

export function TestimonialsCarouselSection({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsCarouselSectionProps) {
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
    <Section className="bg-service-surface">
      <Container>
        <div className="mx-auto max-w-6xl text-center">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            body={body}
            align="center"
          />

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
                    className="invisible col-start-1 row-start-1 rounded-lg border border-service-border bg-white px-16 py-14 shadow-service max-lg:px-10 max-md:px-6 max-md:py-10"
                  >
                    <TestimonialCardContent item={item} />
                  </figure>
                ))}

                <AnimatePresence mode="wait" initial={false}>
                  <motion.figure
                    key={activeItem.author}
                    aria-live="polite"
                    className="col-start-1 row-start-1 rounded-lg border border-service-border bg-white px-16 py-14 shadow-service max-lg:px-10 max-md:px-6 max-md:py-10"
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
                      className={`size-3 rounded-full border border-service-accent transition-colors ${
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
      </Container>
    </Section>
  );
}
