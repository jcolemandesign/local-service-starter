"use client";

import Image from "next/image";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";
import { useLoopedRail } from "@/hooks/useLoopedRail";

/**
 * A shallow, edge-to-edge photo band that is dragged rather than clicked.
 *
 * Three things separate it from the taller gallery carousel next to it:
 *
 * - every photo shares one height, so the band reads as a single horizontal
 *   line of imagery instead of a ragged mosaic. Width still varies with the
 *   image's `size` hint, which is what keeps the rhythm from going metronomic.
 * - the rail loops, via `useLoopedRail` - the shared hook that owns the wrap,
 *   the drag and the arrow stepping for both this and the gallery carousel.
 * - no captions. The band is texture between two sections, not a place to read.
 *
 * The arrows are deliberately small and tucked into the corner: they exist so
 * the control is reachable without a pointer drag, not as the primary way in.
 *
 * This band does not wire up the hook's press-and-hold acceleration. Holding an
 * arrow here would race the drag the band is built around, and the corner
 * control is a fallback rather than the main way through.
 */

type GalleryImageSize = "small" | "medium" | "large" | "tall" | "wide";

type BandImage = {
  alt: string;
  objectPosition?: string;
  size?: GalleryImageSize;
  src: string;
};

type ContentPhotoGalleryBandCarouselSectionV3Props = {
  eyebrow: string;
  title: string;
  body: string;
  images: BandImage[];
  /**
   * The stroke around each photo. Off leaves the images butting straight up
   * against the page - the right call on a dark surface, where the stroke
   * reads as a seam rather than an edge.
   */
  cardBorder?: SectionCardBorder;
  /**
   * The frame's backdrop and drop shadow. It only shows through while an image
   * is still loading or where one does not cover its frame, so "none" is the
   * flatter, more editorial reading of the same band.
   */
  cardFill?: SectionCardFill;
};

/**
 * Width comes from the shared band height and these ratios, so "same height"
 * holds no matter which sizes the content happens to use.
 */
const bandAspectClasses: Record<GalleryImageSize, string> = {
  small: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  medium: "aspect-square",
  large: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

const grabCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 27V15.5a3.2 3.2 0 0 1 6.4 0V26 10.5a3.2 3.2 0 0 1 6.4 0V26 13a3.2 3.2 0 0 1 6.4 0v13-8.4a3.2 3.2 0 0 1 6.4 0v15.2c0 5.8-4.7 10.5-10.5 10.5H22c-3.6 0-6.9-1.9-8.7-5L6.9 27.1a3.4 3.4 0 0 1 5.9-3.4L15 27Z'/%3E%3C/svg%3E\") 20 20, grab";
const grabbingCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 29v-8a3.1 3.1 0 0 1 6.2 0v7.3-9.8a3.1 3.1 0 0 1 6.2 0v9.8-8.4a3.1 3.1 0 0 1 6.2 0v8.4-5.7a3.1 3.1 0 0 1 6.2 0v10c0 5.8-4.7 10.5-10.5 10.5h-7.4c-3.7 0-7.1-2-8.9-5.3L7.7 28a3.4 3.4 0 0 1 5.9-3.4L15 29Z'/%3E%3C/svg%3E\") 20 20, grabbing";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function BandArrow({
  direction,
  onClick,
}: {
  direction: "previous" | "next";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={direction === "previous" ? "Previous images" : "Next images"}
      className="flex size-7 items-center justify-center rounded-full border border-service-border bg-bg-page/85 text-service-muted backdrop-blur-sm transition-colors hover:border-service-accent hover:text-service-ink"
      onClick={onClick}
      type="button"
    >
      <svg
        aria-hidden="true"
        className={cx("size-3", direction === "previous" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="m9 5 7 7-7 7" />
      </svg>
    </button>
  );
}

export function ContentPhotoGalleryBandCarouselSectionV3({
  title,
  body,
  images,
  cardBorder = "on",
  cardFill = "solid",
}: ContentPhotoGalleryBandCarouselSectionV3Props) {
  const {
    copies,
    isDragging,
    itemProps,
    railRef,
    scrollerHandlers,
    scrollerRef,
    step: stepImages,
  } = useLoopedRail({ itemCount: images.length });

  const hasHeaderCopy = Boolean(title || body);
  // The looped copies are decoration for the reader that a screen reader has
  // already heard once, so only the first copy is exposed.
  const loopedImages = Array.from({ length: copies }, (_, copyIndex) =>
    images.map((image, index) => ({
      copyIndex,
      image,
      key: `${copyIndex}-${index}-${image.src}`,
    })),
  ).flat();

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none content-center" padding="med">
        {hasHeaderCopy ? (
          <SevenColumnGridItem className="col-span-7">
            <div className="fluid-type-frame max-w-[var(--measure-copy-wide)]">
              {title ? (
                <h2 className="type-heading-sm text-service-ink">{title}</h2>
              ) : null}
              {body ? (
                <p className="measure-copy wrap-pretty mt-heading-body-sm type-text-sm text-service-muted">
                  {body}
                </p>
              ) : null}
            </div>
          </SevenColumnGridItem>
        ) : null}

        <SevenColumnGridItem className="col-span-7">
          <div className={cx("relative", hasHeaderCopy && "mt-heading-body-lg")}>
            <div
              aria-label={title ? `${title} photo band` : "Photo band"}
              className={cx(
                "-mx-[var(--site-grid-inset-inline)] touch-pan-y overflow-x-auto overscroll-x-contain px-[var(--site-grid-inset-inline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                isDragging ? "cursor-grabbing select-none" : "cursor-grab",
              )}
              ref={scrollerRef}
              role="region"
              {...scrollerHandlers}
              style={{ cursor: isDragging ? grabbingCursor : grabCursor }}
              tabIndex={0}
            >
              <ul className="media-band-height flex w-max items-stretch gap-2" ref={railRef}>
                {loopedImages.map(({ copyIndex, image, key }) => (
                  <li className="h-full shrink-0" key={key} {...itemProps}>
                    <figure
                      className={cx(
                        "relative h-full select-none overflow-hidden",
                        bandAspectClasses[image.size ?? "medium"],
                        cardBorder === "off"
                          ? undefined
                          : "border border-service-border",
                        cardFill === "none"
                          ? undefined
                          // Absolute dark, not ink - see the standard gallery.
                          : "bg-bg-dark shadow-service",
                      )}
                      onDragStart={(event) => event.preventDefault()}
                    >
                      <Image
                        alt={copyIndex === 0 ? image.alt : ""}
                        aria-hidden={copyIndex === 0 ? undefined : "true"}
                        className="object-cover"
                        draggable={false}
                        fill
                        sizes="(max-width: 768px) 60vw, 25vw"
                        src={image.src}
                        style={{ objectPosition: image.objectPosition ?? "50% 50%" }}
                      />
                    </figure>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pointer-events-none absolute bottom-2 right-0 flex items-center gap-1">
              <div className="pointer-events-auto flex items-center gap-1">
                <BandArrow direction="previous" onClick={() => stepImages("previous")} />
                <BandArrow direction="next" onClick={() => stepImages("next")} />
              </div>
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
