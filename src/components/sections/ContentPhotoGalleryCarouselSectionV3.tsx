"use client";

import Image from "next/image";
import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

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

type DragState = {
  active: boolean;
  lastTime: number;
  lastX: number;
  pointerId: number;
  scrollLeft: number;
  startX: number;
  velocity: number;
};

const gallerySizeClasses: Record<GalleryImageSize, string> = {
  small: "w-[min(72vw,22rem)] h-[24rem]",
  medium: "w-[min(78vw,28rem)] h-[28rem]",
  large: "w-[min(86vw,36rem)] h-[32rem]",
  tall: "w-[min(72vw,24rem)] h-[34rem]",
  wide: "w-[min(88vw,40rem)] h-[26rem]",
};

const grabCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 27V15.5a3.2 3.2 0 0 1 6.4 0V26 10.5a3.2 3.2 0 0 1 6.4 0V26 13a3.2 3.2 0 0 1 6.4 0v13-8.4a3.2 3.2 0 0 1 6.4 0v15.2c0 5.8-4.7 10.5-10.5 10.5H22c-3.6 0-6.9-1.9-8.7-5L6.9 27.1a3.4 3.4 0 0 1 5.9-3.4L15 27Z'/%3E%3C/svg%3E\") 20 20, grab";
const grabbingCursor =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath fill='%23fff' stroke='%23141b18' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M15 29v-8a3.1 3.1 0 0 1 6.2 0v7.3-9.8a3.1 3.1 0 0 1 6.2 0v9.8-8.4a3.1 3.1 0 0 1 6.2 0v8.4-5.7a3.1 3.1 0 0 1 6.2 0v10c0 5.8-4.7 10.5-10.5 10.5h-7.4c-3.7 0-7.1-2-8.9-5.3L7.7 28a3.4 3.4 0 0 1 5.9-3.4L15 29Z'/%3E%3C/svg%3E\") 20 20, grabbing";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ArrowButton({
  direction,
  disabled,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
  onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave: () => void;
}) {
  return (
    <button
      aria-label={direction === "previous" ? "Previous images" : "Next images"}
      className="flex size-24 items-center justify-center rounded-full border border-white/80 bg-white text-3xl font-semibold leading-none text-service-ink shadow-[0_14px_34px_rgb(20_27_24_/_0.1),0_0_0_1px_rgb(20_27_24_/_0.045)] transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-white/80 disabled:hover:bg-white disabled:hover:text-service-ink max-md:size-16 max-md:text-2xl"
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerUp={onPointerLeave}
      type="button"
    >
      <span aria-hidden="true">{direction === "previous" ? "<-" : "->"}</span>
    </button>
  );
}

function GalleryImageCard({
  image,
  index,
}: {
  image: GalleryImage;
  index: number;
}) {
  const size = image.size ?? "medium";

  return (
    <li className="shrink-0" data-gallery-card>
      <figure
        className={cx(
          "group/photo fluid-type-frame radius-medium relative overflow-hidden border border-service-border bg-service-ink shadow-service max-md:h-[24rem] max-md:w-[calc(100vw-3rem)]",
          gallerySizeClasses[size],
        )}
      >
        <Image
          alt={image.alt}
          className="object-cover transition-transform duration-700 group-hover/photo:scale-[1.035]"
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
    </li>
  );
}

export function ContentPhotoGalleryCarouselSectionV3({
  eyebrow,
  title,
  body,
  images,
}: ContentPhotoGalleryCarouselSectionV3Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const hoverFrame = useRef<number | null>(null);
  const hoverTimeout = useRef<number | null>(null);
  const momentumFrame = useRef<number | null>(null);
  const dragState = useRef<DragState>({
    active: false,
    lastTime: 0,
    lastX: 0,
    pointerId: -1,
    scrollLeft: 0,
    startX: 0,
    velocity: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isCoasting, setIsCoasting] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

    setCanScrollPrevious(scroller.scrollLeft > 2);
    setCanScrollNext(scroller.scrollLeft < maxScrollLeft - 2);
  }, []);

  const cancelMomentum = useCallback(() => {
    if (momentumFrame.current !== null) {
      window.cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }

    setIsCoasting(false);
  }, []);

  const stopHoverScroll = useCallback(() => {
    if (hoverTimeout.current !== null) {
      window.clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }

    if (hoverFrame.current !== null) {
      window.cancelAnimationFrame(hoverFrame.current);
      hoverFrame.current = null;
    }
  }, []);

  const startHoverScroll = useCallback(
    (direction: "previous" | "next") => {
      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      stopHoverScroll();
      cancelMomentum();

      hoverTimeout.current = window.setTimeout(() => {
        let velocity = 0;
        const directionMultiplier = direction === "next" ? 1 : -1;

        const step = () => {
          const previousScrollLeft = scroller.scrollLeft;

          velocity = Math.min(9, velocity + 0.38);
          scroller.scrollLeft += directionMultiplier * velocity;
          updateScrollState();

          if (scroller.scrollLeft === previousScrollLeft) {
            stopHoverScroll();
            return;
          }

          hoverFrame.current = window.requestAnimationFrame(step);
        };

        hoverTimeout.current = null;
        hoverFrame.current = window.requestAnimationFrame(step);
      }, 110);
    },
    [cancelMomentum, stopHoverScroll, updateScrollState],
  );

  const scrollImages = useCallback((direction: "previous" | "next") => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const imageElements = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-gallery-card]"),
    );
    const currentScrollLeft = scroller.scrollLeft;
    const railStartOffset = imageElements[0]?.offsetLeft ?? 0;
    const currentAlignedLeft = currentScrollLeft + railStartOffset;
    const targetImage =
      direction === "next"
        ? imageElements.find(
            (imageElement) =>
              imageElement.offsetLeft > currentAlignedLeft + 8,
          )
        : [...imageElements]
            .reverse()
            .find(
              (imageElement) =>
                imageElement.offsetLeft < currentAlignedLeft - 8,
            );

    scroller.scrollTo({
      behavior: "smooth",
      left:
        targetImage !== undefined
          ? targetImage.offsetLeft - railStartOffset
          : direction === "next"
            ? scroller.scrollWidth
            : 0,
    });
  }, []);

  const coastScroll = useCallback(
    (initialVelocity: number) => {
      const scroller = scrollerRef.current;

      if (!scroller) {
        return;
      }

      let velocity = Math.max(-0.72, Math.min(0.72, initialVelocity));

      if (Math.abs(velocity) < 0.08) {
        setIsCoasting(false);
        updateScrollState();
        return;
      }

      setIsCoasting(true);

      const step = () => {
        const previousScrollLeft = scroller.scrollLeft;

        velocity *= 0.9;
        scroller.scrollLeft -= velocity * 16;
        updateScrollState();

        if (
          Math.abs(velocity) < 0.035 ||
          scroller.scrollLeft === previousScrollLeft
        ) {
          momentumFrame.current = null;
          setIsCoasting(false);
          return;
        }

        momentumFrame.current = window.requestAnimationFrame(step);
      };

      momentumFrame.current = window.requestAnimationFrame(step);
    },
    [updateScrollState],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);

    return () => {
      resizeObserver.disconnect();
    };
  }, [images.length, updateScrollState]);

  useEffect(() => {
    return () => {
      stopHoverScroll();
      cancelMomentum();
    };
  }, [cancelMomentum, stopHoverScroll]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") {
      return;
    }

    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    cancelMomentum();
    stopHoverScroll();

    const eventTime = window.performance.now();

    dragState.current = {
      active: true,
      lastTime: eventTime,
      lastX: event.clientX,
      pointerId: event.pointerId,
      scrollLeft: scroller.scrollLeft,
      startX: event.clientX,
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

    const dragOffset = event.clientX - currentDrag.startX;
    const eventTime = window.performance.now();
    const elapsedTime = Math.max(16, eventTime - currentDrag.lastTime);
    const deltaX = event.clientX - currentDrag.lastX;
    event.preventDefault();

    currentDrag.lastTime = eventTime;
    currentDrag.lastX = event.clientX;
    currentDrag.velocity = (deltaX / elapsedTime) * 0.95;
    scroller.scrollLeft = currentDrag.scrollLeft - dragOffset * 1.08;
    updateScrollState();
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
    updateScrollState();
  };

  const isFreeScrolling = isDragging || isCoasting;

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-screen content-center">
        <SevenColumnGridItem className="col-span-7">
          <div className="fluid-type-frame flex items-end justify-between gap-8 max-md:flex-col max-md:items-start">
            <div>
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {title}
              </h2>
              <p className="type-text-lg measure-lead wrap-pretty mt-heading-body-lg text-service-muted">
                {body}
              </p>
            </div>

            <div className="flex shrink-0 items-center self-end justify-self-end inline-gap-sml">
              <ArrowButton
                direction="previous"
                disabled={!canScrollPrevious}
                onClick={() => scrollImages("previous")}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    startHoverScroll("previous");
                  }
                }}
                onPointerLeave={stopHoverScroll}
              />
              <ArrowButton
                direction="next"
                disabled={!canScrollNext}
                onClick={() => scrollImages("next")}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") {
                    startHoverScroll("next");
                  }
                }}
                onPointerLeave={stopHoverScroll}
              />
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7">
          <div className="mt-body-actions-lg">
            <div
              aria-label={`${title} gallery`}
              className={cx(
                "-mx-[var(--site-grid-inset-inline)] overflow-x-auto overscroll-x-contain pl-[var(--site-grid-inset-inline)] pr-[var(--site-grid-inset-inline)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                isFreeScrolling
                  ? "cursor-grabbing select-none scroll-auto"
                  : "cursor-grab scroll-auto",
              )}
              onPointerCancel={finishDrag}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onScroll={updateScrollState}
              ref={scrollerRef}
              role="region"
              style={{ cursor: isFreeScrolling ? grabbingCursor : grabCursor }}
              tabIndex={0}
            >
              <ul className="flex w-max items-center card-grid-gap-med pb-12 pt-2">
                {images.map((image, index) => (
                  <GalleryImageCard
                    image={image}
                    index={index}
                    key={`${image.src}-${image.caption}`}
                  />
                ))}
                <li aria-hidden="true" className="w-[min(14vw,10rem)] shrink-0" />
              </ul>
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
