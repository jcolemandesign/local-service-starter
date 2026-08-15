"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LayoutGrid, LayoutGridItem } from "@/components/primitives";
import type {
  SectionCardBorder,
  SectionCardFill,
  SectionColorRecipe,
} from "@/content/section-color-recipes";

const sliderEase = [0.22, 1, 0.36, 1] as const;

/**
 * One-off, scoped to this section by intent - not a candidate for the token
 * set.
 *
 * `shadow-service` is the site's card elevation: a wide, soft 50px drop meant
 * to lift a whole panel, and the live style guide currently sets it fully
 * transparent. Neither suits a photographic print, which needs a small, close
 * shadow to sit just off its backdrop and should not disappear when the style
 * guide turns card elevation off. Two layers: a tight contact shadow under the
 * bottom edge, and a slightly wider one for falloff. Ink matches the token's
 * (23 33 29) so it stays in the same family.
 */
const printShadow =
  "shadow-[0_1px_2px_rgb(23_33_29_/_0.08),0_4px_10px_rgb(23_33_29_/_0.10)]";

type ProjectCaseStudySlide = {
  equipment: readonly {
    label: string;
    value: string;
  }[];
  imageAlt: string;
  /**
   * Intrinsic pixels, optional. When supplied the print is framed to the right
   * ratio on the server, so there is no settle on load. When absent - or stale,
   * because a staged page swapped the image without updating them - the browser
   * reports the real ratio and that wins.
   */
  imageHeight?: number;
  imageSrc: string;
  imageWidth?: number;
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
  cardBorder?: SectionCardBorder;
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

/**
 * Position readout for the gallery, doubling as a jump control.
 *
 * Sits outside both AnimatePresence blocks on purpose: keyed on the active
 * slide, it would remount on every change, so the row would flicker and the
 * targets would move out from under a cursor mid-click.
 */
function SlideDots({
  activeIndex,
  count,
  onSelect,
}: {
  activeIndex: number;
  count: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            aria-label={`Show project ${index + 1} of ${count}`}
            // The dot is 6px but the button is 16px: the visible mark stays
            // small and tight while the target stays reachable. Gap comes from
            // the button padding rather than a gap utility, which is what keeps
            // the dots close together.
            className="group/dot grid size-4 cursor-pointer place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent"
            key={index}
            onClick={() => onSelect(index)}
            type="button"
          >
            <span
              className={`size-1.5 rounded-full transition-colors duration-200 ${
                isActive
                  ? "bg-service-accent"
                  : "bg-service-border group-hover/dot:bg-service-muted"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function ProjectCaseStudyGallerySectionV3({
  align = "left",
  cardBorder = "on",
  cardFill = "solid",
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
  const cardBorderClass = "border-service-border";
  const cardTextClass = "text-service-ink";
  const cardMutedTextClass = "text-service-muted";
  const eyebrowClass = "text-service-accent";
  /**
   * The field behind the print is the card's own surface, so the two carry the
   * same contrast against the ground in every recipe.
   *
   * It was `bg-service-border/30` - a *line* colour at 30% over whatever ground
   * was behind it. Border is derived as the surface stepped 0.30 down in
   * lightness, so a fraction of it lands nowhere near the card's step: measured
   * against this palette the field sat about 0.09 off the ground in perceptual
   * lightness while the card sat at 0, so the tint read as the heavier object
   * of the pair when it is meant to be the quieter one.
   *
   * `bg-bg-muted` is not the answer either, for the same reason at smaller
   * scale - it is a step *past* the surface, so it out-contrasts the card by
   * whatever that step is. Only the card's own token keeps pace by
   * construction rather than by two numbers happening to agree.
   */
  const imageBackdropClass = "bg-service-surface";

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
        {/* Both panels live in one grid item. Two items in adjacent columns
            would always be parted by the grid's column gap; the copy and the
            image field are meant to read as one object, so the split happens
            inside a single gapless container that carries the radius and the
            elevation for both. */}
        <LayoutGridItem
          className={`col-span-14 col-start-1 row-start-1 max-lg:col-span-10 max-lg:col-start-1 max-lg:row-auto max-md:col-span-6 max-sm:col-span-2`}
        >
          {/* Its own fourteen columns with the same gap as the page grid, and
              it spans all fourteen of them - so these columns sit exactly on
              the page's. Wide screens use an even seven/seven split so the
              image field cannot make the copy panel excessively tall. At the
              regular desktop width the image returns to the original eight
              columns and the copy takes six. The image closes the one gutter
              between them so the two still read as one object. */}
          <div
            className={`radius-medium site-grid-gap grid grid-cols-14 overflow-hidden max-lg:grid-cols-1 ${
              cardFill === "none" ? "" : "shadow-service"
            } ${cardBorder === "off" ? "" : `border ${cardBorderClass}`}`}
          >
            {/* Recessed field behind the print. bg-bg-muted is the system's
                existing step down from a surface, so the panel beside it reads
                as the nearer plane without inventing a colour. */}
            <div
              className={`relative col-span-7 grid place-items-center p-[clamp(1.25rem,2.5vw,2.75rem)] max-2xl:col-span-8 max-lg:col-span-1 max-lg:col-start-1 max-lg:mx-0 ${
                isImageRight
                  ? "order-2 col-start-8 -ml-[var(--site-grid-gap)] max-2xl:col-start-7"
                  : "order-1 col-start-1 -mr-[var(--site-grid-gap)]"
              } max-lg:order-1 ${
                cardFill === "none" ? "bg-transparent" : imageBackdropClass
              }`}
            >
              {/* The aspect ratio lives on this inner box, not the grid item above it.
                  The wrapper stretches its items, and stretching sets a
                  definite height, which makes aspect-ratio a no-op - so the
                  field was taking its height from whatever the current photo
                  happened to be. A 2:1 image left it short enough that the card
                  became the taller side and drove the whole assembly, and the
                  height moved every time the slide changed. Held here, the
                  field measures the same on every slide whatever the ratio.
                  The wider 16/10 field on large canvases also prevents the
                  image from creating unused vertical space in the copy panel. */}
              <div className="grid aspect-[16/10] w-full place-items-center max-2xl:aspect-[5/4] max-lg:aspect-[16/10]">
              <AnimatePresence initial={false} mode="wait">
                {/* Every slide uses one stable 3/2 print frame. Wide and
                    stacked 16/10 fields constrain it by height; the taller 5/4
                    desktop field constrains it by width. Source images crop
                    inside that frame rather than resizing the carousel. */}
                <motion.figure
                  aria-live="polite"
                  className={`group/project relative col-start-1 row-start-1 aspect-[3/2] h-full w-auto max-h-full max-w-full max-2xl:h-auto max-2xl:w-full max-lg:h-full max-lg:w-auto ${
                    cardFill === "none"
                      ? "bg-transparent p-0 shadow-none"
                      : `bg-white p-2.5 max-md:p-2 ${printShadow}`
                  }`}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={activeSlide.imageSrc}
                  transition={imageTransition}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      alt={activeSlide.imageAlt}
                      // The frame already matches the picture, so cover fills
                      // it exactly - there is nothing left to letterbox.
                      className="object-cover transition-transform duration-500 group-hover/project:scale-[1.015]"
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), (max-width: 1536px) 58vw, 50vw"
                      src={activeSlide.imageSrc}
                    />
                  </div>
                </motion.figure>
              </AnimatePresence>
              </div>
            </div>

            <div
              aria-atomic="true"
              aria-live="polite"
              className={`col-span-7 grid max-2xl:col-span-6 max-lg:col-span-1 max-lg:col-start-1 ${
                isImageRight
                  ? "order-1 col-start-1"
                  : "order-2 col-start-8 max-2xl:col-start-9"
              } max-lg:order-2`}
            >
              {/* Every copy slide occupies the same grid cell. Invisible
                  slides still contribute their intrinsic height, so the
                  assembly reserves enough room for the tallest slide instead
                  of resizing when the active copy changes. */}
              {slides.map((slide, index) => {
                const isActive = index === activeSlideIndex;

                return (
                  <motion.article
                    animate={{ opacity: isActive ? 1 : 0 }}
                    aria-hidden={!isActive}
                    className={`col-start-1 row-start-1 flex flex-col p-7 max-md:p-6 ${
                      isActive ? "" : "pointer-events-none"
                    } ${
                      cardFill === "none"
                        ? "bg-transparent"
                        : "bg-service-surface"
                    }`}
                    initial={false}
                    key={`${slide.title}-${index}`}
                    transition={imageTransition}
                  >
                    <p
                      className={`type-caption font-semibold tracking-[0.14em] uppercase ${eyebrowClass}`}
                    >
                      {slide.project}
                    </p>
                    <h2 className={`type-heading-md mt-3 ${cardTextClass}`}>
                      {slide.title}
                    </h2>
                    <p
                      className={`type-text-sm measure-copy mt-heading-body-sm ${cardMutedTextClass}`}
                    >
                      {slide.summary}
                    </p>

                    <dl className={`mt-7 border-y ${cardBorderClass}`}>
                      {slide.equipment.map((detail) => (
                        <div
                          className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 border-b py-3 last:border-b-0 ${cardBorderClass}`}
                          key={detail.label}
                        >
                          <dt
                            className={`type-caption font-semibold ${cardMutedTextClass}`}
                          >
                            {detail.label}
                          </dt>
                          <dd
                            className={`type-caption text-right font-semibold ${cardTextClass}`}
                          >
                            {detail.value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {slide.testimonial.quote &&
                    slide.testimonial.attribution ? (
                      // The gap above the quote belongs to this wrapper, not to
                      // the blockquote. As padding inside the bordered element
                      // it was part of what the accent rule spanned, so the
                      // stroke starts with the quote instead of the empty gap.
                      <div className="mt-auto pt-7">
                        <blockquote className="border-l-2 border-service-accent pl-4">
                          <p className={`type-text-sm ${cardTextClass}`}>
                            “{slide.testimonial.quote}”
                          </p>
                          <footer
                            className={`type-caption mt-3 ${cardMutedTextClass}`}
                          >
                            {slide.testimonial.attribution}
                          </footer>
                        </blockquote>
                      </div>
                    ) : null}
                  </motion.article>
                );
              })}
            </div>
          </div>

          {/* Inside the assembly's own grid item rather than a second grid row.
              A row of its own is subject to the grid distributing spare height
              between rows, which pushed the dots well clear of the card; as a
              sibling here the offset is exactly the margin below. */}
          {hasMultipleSlides ? (
            <div className="mt-3 flex justify-center">
              <SlideDots
                activeIndex={activeSlideIndex}
                count={slides.length}
                onSelect={setActiveSlideIndex}
              />
            </div>
          ) : null}
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
