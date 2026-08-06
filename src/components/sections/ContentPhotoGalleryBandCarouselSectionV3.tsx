"use client";

import Image from "next/image";
import type { KeyboardEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type {
  SectionCardBorder,
  SectionCardFill,
} from "@/content/section-color-recipes";

/**
 * A shallow, edge-to-edge photo band that is dragged rather than clicked.
 *
 * Three things separate it from the taller gallery carousel next to it:
 *
 * - every photo shares one height, so the band reads as a single horizontal
 *   line of imagery instead of a ragged mosaic. Width still varies with the
 *   image's `size` hint, which is what keeps the rhythm from going metronomic.
 * - the rail loops. The image list is repeated end to end and the scroll
 *   position is wrapped back into the middle copy whenever it leaves it, so a
 *   drag never hits a wall. Because the wrap teleports `scrollLeft`, every
 *   scroll movement in here is expressed as a *delta* rather than an absolute
 *   target - an absolute `scrollTo` would be aimed at a position that the next
 *   wrap invalidates, and the rail would visibly snap back.
 * - no captions. The band is texture between two sections, not a place to read.
 *
 * The arrows are deliberately small and tucked into the corner: they exist so
 * the control is reachable without a pointer drag, not as the primary way in.
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

type DragState = {
  active: boolean;
  lastTime: number;
  lastX: number;
  pointerId: number;
  velocity: number;
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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLUListElement | null>(null);
  /** Distance from one copy of the list to the next - the wrap period. */
  const loopWidth = useRef(0);
  const startPlaced = useRef(false);
  const momentumFrame = useRef<number | null>(null);
  const tweenFrame = useRef<number | null>(null);
  const dragState = useRef<DragState>({
    active: false,
    lastTime: 0,
    lastX: 0,
    pointerId: -1,
    velocity: 0,
  });
  const [copies, setCopies] = useState(3);
  const [isDragging, setIsDragging] = useState(false);

  const imageCount = images.length;

  const cancelAnimations = useCallback(() => {
    if (momentumFrame.current !== null) {
      window.cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }

    if (tweenFrame.current !== null) {
      window.cancelAnimationFrame(tweenFrame.current);
      tweenFrame.current = null;
    }
  }, []);

  /**
   * Pulls the scroll position back into the middle copy. Written as a modulo
   * rather than a single subtraction so a fast flick that overshoots several
   * copies in one frame still lands correctly.
   */
  const wrap = useCallback(() => {
    const scroller = scrollerRef.current;
    const loop = loopWidth.current;

    if (!scroller || loop <= 0) {
      return;
    }

    const offset = scroller.scrollLeft - loop;

    if (offset < 0 || offset >= loop) {
      scroller.scrollLeft = loop + (((offset % loop) + loop) % loop);
    }
  }, []);

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const rail = railRef.current;

    if (!scroller || !rail || imageCount === 0) {
      return;
    }

    const cards = rail.querySelectorAll<HTMLElement>("[data-band-card]");
    const first = cards[0];
    const secondCopy = cards[imageCount];

    if (!first || !secondCopy) {
      return;
    }

    const loop = secondCopy.offsetLeft - first.offsetLeft;

    if (loop <= 0) {
      return;
    }

    loopWidth.current = loop;

    // Enough copies that the viewport is still filled at the far edge of the
    // wrap window. Too few and the rail runs out of images before the wrap
    // fires, leaving a gap at the end of a fast drag.
    const needed = Math.max(3, Math.ceil((scroller.clientWidth * 2) / loop) + 2);
    setCopies((current) => (current === needed ? current : needed));

    if (!startPlaced.current) {
      scroller.scrollLeft = loop;
      startPlaced.current = true;
    }
  }, [imageCount]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(scroller);

    return () => {
      resizeObserver.disconnect();
    };
  }, [copies, measure]);

  useEffect(() => cancelAnimations, [cancelAnimations]);

  /**
   * Moves by a relative distance over a few frames. Relative is the whole
   * point: `wrap` may teleport the scroll position mid-flight, and a tween
   * chasing a remembered absolute target would fight it.
   */
  const nudge = useCallback(
    (delta: number) => {
      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      cancelAnimations();

      if (prefersReducedMotion()) {
        scroller.scrollLeft += delta;
        wrap();
        return;
      }

      let remaining = delta;

      const step = () => {
        const current = scrollerRef.current;

        if (!current) {
          tweenFrame.current = null;
          return;
        }

        if (Math.abs(remaining) < 0.5) {
          tweenFrame.current = null;
          return;
        }

        const move = remaining * 0.22;

        current.scrollLeft += move;
        remaining -= move;
        wrap();
        tweenFrame.current = window.requestAnimationFrame(step);
      };

      tweenFrame.current = window.requestAnimationFrame(step);
    },
    [cancelAnimations, wrap],
  );

  const stepImages = useCallback(
    (direction: "previous" | "next") => {
      const loop = loopWidth.current;
      const scroller = scrollerRef.current;
      // Average card pitch. Cards differ in width, so an average keeps the
      // arrow travelling a consistent distance instead of lurching on a wide
      // one and barely moving on a portrait.
      const stride =
        imageCount > 0 && loop > 0
          ? loop / imageCount
          : (scroller?.clientWidth ?? 0) / 3;

      nudge(direction === "next" ? stride : -stride);
    },
    [imageCount, nudge],
  );

  const coastScroll = useCallback(
    (initialVelocity: number) => {
      let velocity = Math.max(-0.72, Math.min(0.72, initialVelocity));

      if (Math.abs(velocity) < 0.08) {
        return;
      }

      const step = () => {
        const scroller = scrollerRef.current;

        if (!scroller) {
          momentumFrame.current = null;
          return;
        }

        velocity *= 0.9;
        scroller.scrollLeft -= velocity * 16;
        wrap();

        if (Math.abs(velocity) < 0.035) {
          momentumFrame.current = null;
          return;
        }

        momentumFrame.current = window.requestAnimationFrame(step);
      };

      momentumFrame.current = window.requestAnimationFrame(step);
    },
    [wrap],
  );

  // Touch is handled here rather than left to native overflow scrolling so a
  // swipe gets the same momentum and the same wrap as a mouse drag. The rail
  // keeps `touch-action: pan-y`, so a vertical gesture still scrolls the page.
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    cancelAnimations();

    if (event.pointerType === "mouse") {
      event.preventDefault();
    }

    dragState.current = {
      active: true,
      lastTime: window.performance.now(),
      lastX: event.clientX,
      pointerId: event.pointerId,
      velocity: 0,
    };

    scroller.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const currentDrag = dragState.current;

    if (!scroller || !currentDrag.active) {
      return;
    }

    const eventTime = window.performance.now();
    const elapsedTime = Math.max(16, eventTime - currentDrag.lastTime);
    const deltaX = event.clientX - currentDrag.lastX;

    currentDrag.lastTime = eventTime;
    currentDrag.lastX = event.clientX;
    currentDrag.velocity = (deltaX / elapsedTime) * 0.95;
    // Incremental, not `start - offset`: the wrap moves the baseline out from
    // under an absolute calculation every time the rail loops.
    scroller.scrollLeft -= deltaX * 1.08;
    wrap();
  };

  const finishDrag = () => {
    const scroller = scrollerRef.current;

    if (!scroller || !dragState.current.active) {
      return;
    }

    if (scroller.hasPointerCapture(dragState.current.pointerId)) {
      scroller.releasePointerCapture(dragState.current.pointerId);
    }

    dragState.current.active = false;
    setIsDragging(false);
    coastScroll(dragState.current.velocity);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepImages("next");
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepImages("previous");
    }
  };

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
              onKeyDown={handleKeyDown}
              onLostPointerCapture={finishDrag}
              onPointerCancel={finishDrag}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onScroll={wrap}
              ref={scrollerRef}
              role="region"
              style={{ cursor: isDragging ? grabbingCursor : grabCursor }}
              tabIndex={0}
            >
              <ul className="media-band-height flex w-max items-stretch gap-2" ref={railRef}>
                {loopedImages.map(({ copyIndex, image, key }) => (
                  <li className="h-full shrink-0" data-band-card key={key}>
                    <figure
                      className={cx(
                        "relative h-full select-none overflow-hidden",
                        bandAspectClasses[image.size ?? "medium"],
                        cardBorder === "off"
                          ? undefined
                          : "border border-service-border",
                        cardFill === "none"
                          ? undefined
                          : "bg-service-ink shadow-service",
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
