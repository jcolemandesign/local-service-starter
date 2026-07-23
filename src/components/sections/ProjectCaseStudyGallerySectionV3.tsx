"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";

const sliderEase = [0.22, 1, 0.36, 1] as const;

type ProjectCaseStudySlide = {
  equipment: readonly {
    label: string;
    value: string;
  }[];
  imageAlt: string;
  imageSrc: string;
  project: string;
  summary: string;
  testimonial: {
    attribution: string;
    quote: string;
  };
  title: string;
};

type ProjectCaseStudyGallerySectionV3Props = {
  align?: ProjectCaseStudyGalleryAlign;
  cardFill?: SectionCardFill;
  colorRecipe?: SectionColorRecipe;
  slides: readonly ProjectCaseStudySlide[];
};

export type ProjectCaseStudyGalleryAlign = "left" | "right";

function SliderControl({
  direction,
  disabled,
  onClick,
  cardFill,
}: {
  cardFill: SectionCardFill;
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const isPrevious = direction === "previous";

  return (
    <button
      aria-label={isPrevious ? "Previous project" : "Next project"}
      className={`radius-button flex aspect-square size-12 items-center justify-center border border-service-border text-xl text-service-ink transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white disabled:pointer-events-none disabled:opacity-35 ${
        cardFill === "none"
          ? "bg-transparent shadow-none"
          : "bg-service-surface shadow-service"
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true">{isPrevious ? "←" : "→"}</span>
    </button>
  );
}

export function ProjectCaseStudyGallerySectionV3({
  align = "left",
  cardFill = "solid",
  colorRecipe = "default",
  slides,
}: ProjectCaseStudyGallerySectionV3Props) {
  const isImageRight = align === "right";
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;
  const activeSlide = slides[activeSlideIndex] ?? slides[0];
  const shouldReduceMotion = useReducedMotion();
  const imageTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: sliderEase };
  const hasDarkCard = colorRecipe === "dark" && cardFill === "solid";
  const cardBorderClass = hasDarkCard ? "border-white/20" : "border-service-border";
  const cardTextClass = hasDarkCard ? "text-white" : "text-service-ink";
  const cardMutedTextClass = hasDarkCard ? "text-white/70" : "text-service-muted";
  // text-service-accent stays a constant brand color regardless of recipe
  // (unlike text-service-ink/muted above, which the pagebuilder-section-frame
  // wrapper already re-tints for dark/accent), so the eyebrow needs an
  // explicit swap here or it becomes invisible against an accent background.
  const eyebrowClass =
    colorRecipe === "accent" ? "text-[var(--live-accent-ink)]" : "text-service-accent";

  if (!activeSlide) {
    return null;
  }

  const moveSlide = (direction: "previous" | "next") => {
    setActiveSlideIndex((currentIndex) => {
      const offset = direction === "previous" ? -1 : 1;

      return (currentIndex + offset + slides.length) % slides.length;
    });
  };

  return (
    <section className="relative bg-bg-page">
      <LayoutGrid columns={14} minHeight="none" padding="med">
        <LayoutGridItem
          className={`col-span-8 ${isImageRight ? "col-start-7" : "col-start-1"} row-start-1 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2`}
        >
          <div className="grid aspect-[5/4]">
            <AnimatePresence initial={false} mode="wait">
              <motion.figure
                aria-live="polite"
                className="group/project radius-medium relative col-start-1 row-start-1 overflow-hidden shadow-service"
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={activeSlide.imageSrc}
                transition={imageTransition}
              >
                <Image
                  alt={activeSlide.imageAlt}
                  className="object-contain p-4 transition-transform duration-500 group-hover/project:scale-[1.015] max-md:p-3"
                  fill
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 58vw"
                  src={activeSlide.imageSrc}
                />
              </motion.figure>
            </AnimatePresence>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          className={`col-span-5 ${isImageRight ? "col-start-1" : "col-start-10"} row-start-1 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2`}
        >
          <div className="grid">
            <AnimatePresence initial={false} mode="wait">
              <motion.article
                aria-live="polite"
                className={`radius-medium flex flex-col col-start-1 row-start-1 border p-7 max-md:p-6 ${cardBorderClass} ${
                  cardFill === "none"
                    ? "bg-transparent shadow-none"
                    : hasDarkCard
                      ? "bg-bg-dark shadow-service"
                      : "bg-service-surface shadow-service"
                }`}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={activeSlide.title}
                transition={imageTransition}
              >
                <p className={`type-caption font-semibold tracking-[0.14em] uppercase ${eyebrowClass}`}>
                  {activeSlide.project}
                </p>
                <h2 className={`type-heading-md mt-3 ${cardTextClass}`}>
                  {activeSlide.title}
                </h2>
                <p className={`type-text-sm measure-copy mt-heading-body-sm ${cardMutedTextClass}`}>
                  {activeSlide.summary}
                </p>

                <dl className={`mt-7 border-y ${cardBorderClass}`}>
                  {activeSlide.equipment.map((detail) => (
                    <div
                      className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b py-3 last:border-b-0 ${cardBorderClass}`}
                      key={detail.label}
                    >
                      <dt className={`type-caption font-semibold ${cardMutedTextClass}`}>
                        {detail.label}
                      </dt>
                      <dd className={`type-caption text-right font-semibold ${cardTextClass}`}>
                        {detail.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {activeSlide.testimonial.quote &&
                activeSlide.testimonial.attribution ? (
                  <blockquote className="mt-auto border-l-2 border-service-accent pl-4 pt-7">
                    <p className={`type-text-sm ${cardTextClass}`}>
                      “{activeSlide.testimonial.quote}”
                    </p>
                    <footer className={`type-caption mt-3 ${cardMutedTextClass}`}>
                      {activeSlide.testimonial.attribution}
                    </footer>
                  </blockquote>
                ) : null}
              </motion.article>
            </AnimatePresence>
          </div>
        </LayoutGridItem>

      </LayoutGrid>

      <div
        className="pointer-events-none absolute inset-0 z-10 max-lg:static max-lg:mt-6 max-lg:flex max-lg:justify-center max-lg:gap-3"
      >
        <div
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 max-lg:static max-lg:translate-y-0"
          style={{
            left: "calc((var(--site-grid-inset-inline) - 3rem) / 2)",
          }}
        >
          <SliderControl
            cardFill={cardFill}
            direction="previous"
            disabled={!hasMultipleSlides}
            onClick={() => moveSlide("previous")}
          />
        </div>
        <div
          className="pointer-events-auto absolute top-1/2 -translate-y-1/2 max-lg:static max-lg:translate-y-0"
          style={{
            right: "calc((var(--site-grid-inset-inline) - 3rem) / 2)",
          }}
        >
          <SliderControl
            cardFill={cardFill}
            direction="next"
            disabled={!hasMultipleSlides}
            onClick={() => moveSlide("next")}
          />
        </div>
      </div>
    </section>
  );
}
