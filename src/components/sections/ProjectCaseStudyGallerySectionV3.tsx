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
  colorRecipe = "default",
  slides,
}: ProjectCaseStudyGallerySectionV3Props) {
  const isImageRight = align === "right";
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  /**
   * Natural aspect ratio per image source, measured once on load.
   *
   * The white stroke has to hug the picture, and slides carry no dimensions -
   * which forces `fill`, which makes the <img> box the frame and letterboxes
   * the picture inside it. Sizing the frame to the ratio the browser reports
   * removes the letterbox entirely, so the stroke is even on all four sides at
   * any ratio and the grey field supplies the surrounding space.
   */
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({});
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
  // The field behind the print is the border colour at 30%. No per-recipe map
  // is needed: globals.css already redefines --live-service-border for the dark
  // and accent recipes, so the field follows whatever the section's own edges
  // are drawn in.
  const imageBackdropClass = "bg-service-border/30";

  if (!activeSlide) {
    return null;
  }

  // Measured wins over authored: authored dimensions can go stale when a staged
  // page swaps the image behind them, and the browser is reporting the file
  // that actually rendered. Falls back to landscape, which sits close to the
  // field's own proportion, so an unmeasured unauthored image barely moves.
  const authoredRatio =
    activeSlide.imageWidth && activeSlide.imageHeight
      ? activeSlide.imageWidth / activeSlide.imageHeight
      : undefined;
  const frameRatio =
    imageRatios[activeSlide.imageSrc] ?? authoredRatio ?? 3 / 2;
  // The field is 5/4. An image wider than that is limited by the field's width,
  // a taller one by its height - picking the constrained axis is what keeps the
  // frame inside the padding instead of overflowing it.
  const isFrameWidthLimited = frameRatio >= 5 / 4;

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement>,
  ) => {
    const { naturalHeight, naturalWidth } = event.currentTarget;

    if (!naturalHeight || !naturalWidth) {
      return;
    }

    // Keyed by the slide's own src rather than the resolved optimizer URL, so
    // the lookup above finds it.
    setImageRatios((current) =>
      current[activeSlide.imageSrc]
        ? current
        : { ...current, [activeSlide.imageSrc]: naturalWidth / naturalHeight },
    );
  };

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
          {/* Spans the full fourteen. The image field keeps its eight columns
              and the copy side takes the remaining six, so the extra column
              goes to the card rather than sitting empty at one edge. */}
          <div
            className={`radius-medium grid overflow-hidden max-lg:grid-cols-1 ${
              isImageRight ? "grid-cols-[6fr_8fr]" : "grid-cols-[8fr_6fr]"
            } ${cardFill === "none" ? "" : "shadow-service"} ${
              cardBorder === "off" ? "" : `border ${cardBorderClass}`
            }`}
          >
            {/* Recessed field behind the print. bg-bg-muted is the system's
                existing step down from a surface, so the panel beside it reads
                as the nearer plane without inventing a colour. */}
            <div
              className={`relative grid aspect-[5/4] place-items-center p-[clamp(1.25rem,2.5vw,2.75rem)] max-lg:aspect-[16/10] ${
                isImageRight ? "order-2" : "order-1"
              } max-lg:order-1 ${
                cardFill === "none" ? "bg-transparent" : imageBackdropClass
              }`}
            >
              <AnimatePresence initial={false} mode="wait">
                {/* Sized to the picture's own ratio, so the padding below is a
                    stroke of even width rather than a mat. The grey field
                    around it supplies the breathing room. */}
                <motion.figure
                  aria-live="polite"
                  className={`group/project relative col-start-1 row-start-1 max-h-full max-w-full ${
                    isFrameWidthLimited ? "w-full" : "h-full"
                  } ${
                    cardFill === "none"
                      ? "bg-transparent p-0 shadow-none"
                      : `bg-white p-2.5 max-md:p-2 ${printShadow}`
                  }`}
                  exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -6 }}
                  initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={activeSlide.imageSrc}
                  style={{ aspectRatio: String(frameRatio) }}
                  transition={imageTransition}
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      alt={activeSlide.imageAlt}
                      // The frame already matches the picture, so cover fills
                      // it exactly - there is nothing left to letterbox.
                      className="object-cover transition-transform duration-500 group-hover/project:scale-[1.015]"
                      fill
                      onLoad={handleImageLoad}
                      sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) calc(100vw - 3rem), 58vw"
                      src={activeSlide.imageSrc}
                    />
                  </div>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div
              className={`grid ${isImageRight ? "order-1" : "order-2"} max-lg:order-2`}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.article
                  aria-live="polite"
                  className={`flex flex-col col-start-1 row-start-1 p-7 max-md:p-6 ${
                    cardFill === "none"
                      ? "bg-transparent"
                      : hasDarkCard
                        ? "bg-bg-dark"
                        : "bg-service-surface"
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
