"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { useLoopedRail } from "@/hooks/useLoopedRail";

/**
 * The captioned photo carousel, at two scales.
 *
 * The rail loops, and `useLoopedRail` owns the scroll position - the wrap, the
 * drag, the momentum and the arrow stepping. Read the hook before changing how
 * anything here moves; the rule that every movement is a delta rather than an
 * absolute target is not obvious from this side.
 *
 * What the loop cost: the edge state went with it. `canScrollPrevious` /
 * `canScrollNext` described a rail with ends, so the arrows are never disabled
 * now - there is always somewhere to go in both directions.
 */

type GalleryImageSize = "small" | "medium" | "large" | "tall" | "wide";

type GalleryImage = {
  alt: string;
  caption: string;
  objectPosition?: string;
  size?: GalleryImageSize;
  src: string;
};

type ContentPhotoGalleryCarouselSectionV3Props = {
  eyebrow: string;
  title: string;
  body: string;
  images: GalleryImage[];
};

type GalleryScale = "compact" | "large";

const gallerySizeClasses: Record<
  GalleryScale,
  Record<GalleryImageSize, string>
> = {
  compact: {
    small: "w-[min(72vw,18rem)] h-[18rem]",
    medium: "w-[min(76vw,22rem)] h-[20rem]",
    large: "w-[min(82vw,28rem)] h-[22rem]",
    tall: "w-[min(70vw,20rem)] h-[23rem]",
    wide: "w-[min(84vw,30rem)] h-[19rem]",
  },
  large: {
    small: "w-[min(72vw,22rem)] h-[22rem]",
    medium: "w-[min(78vw,27rem)] h-[26rem]",
    large: "w-[min(84vw,35rem)] h-[31rem]",
    tall: "w-[min(72vw,25rem)] h-[34rem]",
    wide: "w-[min(88vw,38rem)] h-[25rem]",
  },
};

const grabCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 27V15.5a3.2 3.2 0 0 1 6.4 0V26 10.5a3.2 3.2 0 0 1 6.4 0V26 13a3.2 3.2 0 0 1 6.4 0v13-8.4a3.2 3.2 0 0 1 6.4 0v15.2c0 5.8-4.7 10.5-10.5 10.5H22c-3.6 0-6.9-1.9-8.7-5L6.9 27.1a3.4 3.4 0 0 1 5.9-3.4L15 27Z'/%3E%3C/svg%3E\") 20 20, grab";
const grabbingCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 29v-8a3.1 3.1 0 0 1 6.2 0v7.3-9.8a3.1 3.1 0 0 1 6.2 0v9.8-8.4a3.1 3.1 0 0 1 6.2 0v8.4-5.7a3.1 3.1 0 0 1 6.2 0v10c0 5.8-4.7 10.5-10.5 10.5h-7.4c-3.7 0-7.1-2-8.9-5.3L7.7 28a3.4 3.4 0 0 1 5.9-3.4L15 29Z'/%3E%3C/svg%3E\") 20 20, grabbing";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Two sizes, and the compact one is deliberately quiet.
 *
 * At the compact scale these sit above a shallow rail where a 4rem button with
 * a cast shadow was competing with the photographs for the eye. It is now
 * close to the photo band's control: small, muted, no drop shadow, and the
 * hover reads as an accent outline rather than a filled accent disc. The large
 * scale keeps the fuller treatment, because there the composition can carry it.
 */
const arrowClasses: Record<GalleryScale, string> = {
  compact:
    "size-9 border-service-border bg-surface-raised text-service-muted hover:border-service-accent hover:text-service-accent max-md:size-8",
  large:
    "size-16 border-service-border bg-surface-raised text-2xl font-semibold leading-none text-service-ink shadow-[0_10px_24px_rgb(20_27_24_/_0.09),0_0_0_1px_rgb(20_27_24_/_0.045)] hover:border-service-accent hover:bg-service-accent hover:text-white max-md:size-12 max-md:text-xl",
};

function ArrowButton({
  direction,
  onClick,
  onPointerEnter,
  onPointerLeave,
  scale,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave: () => void;
  scale: GalleryScale;
}) {
  return (
    <button
      aria-label={direction === "previous" ? "Previous images" : "Next images"}
      className={cx(
        "flex items-center justify-center rounded-full border transition-colors",
        arrowClasses[scale],
      )}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerLeave}
      type="button"
    >
      {/* The compact control is small enough that the text glyph read as a
          stray character, so it takes the chevron the photo band uses. The
          large one keeps its original mark - nothing about it was asked to
          change, and at 4rem the glyph carries fine. */}
      {scale === "compact" ? (
        <svg
          aria-hidden="true"
          className={cx("size-3.5", direction === "previous" && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      ) : (
        <span aria-hidden="true">
          {direction === "previous" ? "<-" : "->"}
        </span>
      )}
    </button>
  );
}

function GalleryImageCard({
  image,
  index,
  scale,
}: {
  image: GalleryImage;
  index: number;
  scale: GalleryScale;
}) {
  const size = image.size ?? "medium";

  return (
    <figure
      onDragStart={(event) => event.preventDefault()}
      className={cx(
        // The well behind the photograph is `bg-bg-dark`, an absolute dark.
        // As `bg-service-ink` it resolved to the recipe's headline colour and
        // flashed white behind a loading image on every dark recipe.
        "group/photo fluid-type-frame relative overflow-hidden border border-service-border bg-bg-dark shadow-service select-none max-md:h-[18rem] max-md:w-[calc(100vw-3rem)]",
        scale === "compact" ? "max-h-[23rem]" : "max-h-[34rem]",
        gallerySizeClasses[scale][size],
      )}
    >
      <Image
        alt={image.alt}
        className="object-cover transition-transform duration-700 group-hover/photo:scale-[1.035]"
        draggable={false}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 55vw, 38vw"
        src={image.src}
        style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 bg-gradient-to-t from-service-ink/82 via-service-ink/42 to-transparent p-6 text-white">
        <p className="type-text-sm wrap-pretty font-semibold">
          {image.caption}
        </p>
        <span className="type-caption shrink-0 text-white/68">
          {String(index + 1).padStart(2, "0")}
        </span>
      </figcaption>
    </figure>
  );
}

export function ContentPhotoGalleryCarouselSectionV3({
  title,
  body,
  images,
  scale = "compact",
}: ContentPhotoGalleryCarouselSectionV3Props & {
  scale?: GalleryScale;
}) {
  const {
    copies,
    isFreeScrolling,
    itemProps,
    railRef,
    scrollerHandlers,
    scrollerRef,
    startHoverScroll,
    step,
    stopHoverScroll,
  } = useLoopedRail({ itemCount: images.length });

  const hasHeaderCopy = Boolean(title || body);
  // The looped copies are decoration for a reader that a screen reader has
  // already heard once, so only the first copy is exposed. `aria-hidden` goes
  // on the item rather than the image because the caption repeats too.
  const loopedImages = Array.from({ length: copies }, (_, copyIndex) =>
    images.map((image, index) => ({
      copyIndex,
      image,
      index,
      key: `${copyIndex}-${index}-${image.src}`,
    })),
  ).flat();

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid
        className="section-min-none content-center"
        padding={scale === "large" ? "lrg" : "med"}
      >
        <SevenColumnGridItem className="col-span-7">
          <div className="fluid-type-frame flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
            {hasHeaderCopy ? (
              <div className="max-w-[var(--measure-copy-wide)]">
                {title ? (
                  <h2
                    className={cx(
                      "text-service-ink",
                      scale === "large" ? "type-heading-xl" : "type-heading-md",
                    )}
                  >
                    {title}
                  </h2>
                ) : null}
                {body ? (
                  <p
                    className={cx(
                      "measure-copy wrap-pretty mt-heading-body-sm text-service-muted",
                      scale === "large" ? "type-text-md" : "type-text-sm",
                    )}
                  >
                    {body}
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* `ml-auto` rather than leaning on `justify-between`: with no
                headline supplied the arrows are the row's only child, and
                `justify-between` puts a lone child at the start - the controls
                ended up on the left of the section. Pushed right explicitly,
                they sit correctly whether or not there is a headline beside
                them. */}
            <div className="ml-auto flex shrink-0 items-center self-end justify-self-end inline-gap-sml">
              <ArrowButton
                direction="previous"
                onClick={() => step("previous")}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    startHoverScroll("previous");
                  }
                }}
                onPointerLeave={stopHoverScroll}
                scale={scale}
              />
              <ArrowButton
                direction="next"
                onClick={() => step("next")}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    startHoverScroll("next");
                  }
                }}
                onPointerLeave={stopHoverScroll}
                scale={scale}
              />
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7">
          <div
            className={scale === "large" ? "mt-heading-body-xl" : "mt-heading-body-lg"}
          >
            <div
              aria-label={title ? `${title} gallery` : "Image gallery"}
              className={cx(
                "-mx-[var(--site-grid-inset-inline)] touch-pan-y overflow-x-auto overscroll-x-contain pl-[var(--site-grid-inset-inline)] pr-[var(--site-grid-inset-inline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                isFreeScrolling
                  ? "cursor-grabbing select-none scroll-auto"
                  : "cursor-grab scroll-auto",
              )}
              ref={scrollerRef}
              role="region"
              {...scrollerHandlers}
              style={{ cursor: isFreeScrolling ? grabbingCursor : grabCursor }}
              tabIndex={0}
            >
              <ul
                className={cx(
                  "flex w-max items-center pb-6 pt-1",
                  scale === "large" ? "gap-6" : "gap-4",
                )}
                ref={railRef}
              >
                {loopedImages.map(({ copyIndex, image, index, key }) => (
                  <li
                    aria-hidden={copyIndex === 0 ? undefined : "true"}
                    className="shrink-0"
                    key={key}
                    {...itemProps}
                  >
                    <GalleryImageCard
                      image={image}
                      index={index}
                      scale={scale}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function ContentPhotoGalleryLargeCarouselSectionV3(
  props: ContentPhotoGalleryCarouselSectionV3Props,
) {
  return <ContentPhotoGalleryCarouselSectionV3 {...props} scale="large" />;
}
