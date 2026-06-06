"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type HorizontalCardSize = "small" | "medium" | "large";

type HorizontalCard = {
  eyebrow: string;
  title: string;
  body: string;
  meta?: string;
  size?: HorizontalCardSize;
};

type ContentHorizontalCardCarouselSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  cards: HorizontalCard[];
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

const cardSizeClasses: Record<HorizontalCardSize, string> = {
  small: "w-[min(72vw,22rem)] min-h-[24rem]",
  medium: "w-[min(78vw,28rem)] min-h-[28rem]",
  large: "w-[min(86vw,36rem)] min-h-[32rem]",
};

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
      aria-label={direction === "previous" ? "Previous cards" : "Next cards"}
      className="flex size-10 items-center justify-center border border-service-border bg-white text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-service-border disabled:hover:bg-white disabled:hover:text-service-ink"
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

function HorizontalCarouselCard({
  card,
  index,
}: {
  card: HorizontalCard;
  index: number;
}) {
  const size = card.size ?? "medium";
  const isFeatured = size === "large";

  return (
    <li className="shrink-0" data-carousel-card>
      <article
        className={cx(
          "fluid-type-frame radius-medium flex h-full flex-col justify-between border p-7 shadow-service max-md:w-[calc(100vw-3rem)] max-md:min-h-[24rem] max-md:p-6",
          cardSizeClasses[size],
          isFeatured
            ? "border-service-ink bg-service-ink text-white"
            : "border-service-border bg-white text-service-ink",
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-6">
            <p
              className={cx(
                "type-label",
                isFeatured ? "text-white/60" : "text-service-accent",
              )}
            >
              {card.eyebrow}
            </p>
            <span
              className={cx(
                "type-caption shrink-0",
                isFeatured ? "text-white/50" : "text-service-muted",
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <h3
            className={cx(
              size === "large" ? "type-heading-lg" : "type-heading-md",
              "mt-eyebrow-heading-md",
              isFeatured ? "text-white" : "text-service-ink",
            )}
          >
            {card.title}
          </h3>
        </div>

        <div className="mt-body-actions-lg">
          <p
            className={cx(
              "type-text-md measure-copy wrap-pretty",
              isFeatured ? "text-white/72" : "text-service-muted",
            )}
          >
            {card.body}
          </p>
          {card.meta ? (
            <p
              className={cx(
                "type-caption mt-heading-body-md",
                isFeatured ? "text-white/48" : "text-service-muted",
              )}
            >
              {card.meta}
            </p>
          ) : null}
        </div>
      </article>
    </li>
  );
}

export function ContentHorizontalCardCarouselSectionV2({
  eyebrow,
  title,
  body,
  cards,
}: ContentHorizontalCardCarouselSectionV2Props) {
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

  const scrollCards = useCallback((direction: "previous" | "next") => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const cardElements = Array.from(
      scroller.querySelectorAll<HTMLElement>("[data-carousel-card]"),
    );
    const currentScrollLeft = scroller.scrollLeft;
    const railStartOffset = cardElements[0]?.offsetLeft ?? 0;
    const currentAlignedLeft = currentScrollLeft + railStartOffset;
    const targetCard =
      direction === "next"
        ? cardElements.find(
            (cardElement) => cardElement.offsetLeft > currentAlignedLeft + 8,
          )
        : [...cardElements]
            .reverse()
            .find(
              (cardElement) => cardElement.offsetLeft < currentAlignedLeft - 8,
            );

    scroller.scrollTo({
      behavior: "smooth",
      left:
        targetCard !== undefined
          ? targetCard.offsetLeft - railStartOffset
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
  }, [cards.length, updateScrollState]);

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

            <div className="flex shrink-0 items-center gap-2">
              <ArrowButton
                direction="previous"
                disabled={!canScrollPrevious}
                onClick={() => scrollCards("previous")}
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
                onClick={() => scrollCards("next")}
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
              aria-label={`${title} cards`}
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
              tabIndex={0}
            >
              <ul className="flex w-max card-grid-gap-med pb-12 pt-2">
                {cards.map((card, index) => (
                  <HorizontalCarouselCard
                    card={card}
                    index={index}
                    key={card.title}
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
