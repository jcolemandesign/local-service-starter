"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { type UIEvent, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const servicePanelEase = [0.22, 1, 0.36, 1] as const;

type HoverServiceItem = {
  title: string;
  body: string;
  imageLabel: string;
  href?: string;
};

type ServicesHoverPanelSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: HoverServiceItem[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PlaceholderBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.34),rgb(23_33_29_/_0.08)),linear-gradient(45deg,rgb(255_255_255_/_0.18)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function getServiceHref(item: HoverServiceItem) {
  if (item.href) {
    return item.href;
  }

  const slug = item.title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `/services/${slug}`;
}

export function ServicesHoverPanelSectionV2({
  eyebrow,
  title,
  body,
  items,
}: ServicesHoverPanelSectionV2Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);
  const activeItem = items[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: servicePanelEase };
  const textTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.1, ease: servicePanelEase };

  const handleMobileScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const slides = Array.from(track.children) as HTMLElement[];

    if (slides.length === 0) {
      return;
    }

    const nextIndex = slides.reduce((closestIndex, slide, index) => {
      const closestDistance = Math.abs(
        slides[closestIndex].offsetLeft - track.scrollLeft,
      );
      const currentDistance = Math.abs(slide.offsetLeft - track.scrollLeft);

      return currentDistance < closestDistance ? index : closestIndex;
    }, 0);

    setActiveIndex(nextIndex);
  };

  const scrollToMobileSlide = (index: number) => {
    const track = mobileTrackRef.current;
    const slide = track?.children.item(index) as HTMLElement | null;

    if (!track || !slide) {
      return;
    }

    track.scrollTo({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      left: slide.offsetLeft,
    });
    setActiveIndex(index);
  };

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        <SevenColumnGridItem
          alignX="left"
          alignY="top"
          className="col-span-3 max-lg:col-span-7"
          measure="copy"
        >
          <div className="fluid-type-frame">
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-lg",
              "mt-eyebrow-display text-service-ink",
            )}
          >
            {title}
          </h2>
          <p className="type-text-md wrap-pretty mt-display-body text-service-muted">
            {body}
          </p>

          <ul className="mt-body-actions-md grid gap-2 max-lg:hidden">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={item.title}>
                  <button
                    type="button"
                    className={cx(
                      "radius-medium",
                      "group/service-link flex min-h-14 w-full cursor-pointer items-center justify-between overflow-hidden border text-left text-sm font-semibold transition-colors",
                      isActive
                        ? "border-service-accent bg-bg-page text-service-accent"
                        : "border-service-border bg-service-surface text-service-ink hover:border-service-accent hover:bg-bg-page hover:text-service-accent",
                    )}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <span className="px-5">{item.title}</span>
                    <span
                      className={`flex min-h-14 w-14 shrink-0 items-center justify-center text-lg leading-none transition-colors ${
                        isActive
                          ? "bg-service-accent text-white"
                          : "bg-service-surface text-service-accent group-hover/service-link:bg-service-accent group-hover/service-link:text-white"
                      }`}
                      aria-hidden="true"
                    >
                      -&gt;
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className={cx(
            "col-span-4 col-start-4 max-lg:hidden",
          )}
        >
          <div
            className={cx(
              "radius-medium",
              "media-min-tall relative grid h-full overflow-hidden border border-service-border shadow-service max-lg:media-min-medium",
            )}
          >
            <article className="content-padding relative col-start-1 row-start-1 flex h-full items-end overflow-hidden bg-service-ink text-white">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeItem.title}-background`}
                  className="absolute inset-0"
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : 10,
                  }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : -6,
                  }}
                  transition={panelTransition}
                >
                  <PlaceholderBackground />
                  <div className="absolute inset-0 bg-service-ink/45" aria-hidden="true" />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/45 to-transparent"
                    aria-hidden="true"
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${activeItem.title}-text`}
                  className={cx(
                    "relative z-10 w-full max-w-3xl",
                    "fluid-type-frame",
                  )}
                  initial={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : 4,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: shouldReduceMotion ? 0 : -2,
                  }}
                  transition={textTransition}
                >
                  <p className={cx("type-label", "text-white/70")}>
                    Service focus
                  </p>
                  <h3
                    className={cx(
                      "type-heading-lg",
                      "mt-5 text-white",
                    )}
                  >
                    {activeItem.title}
                  </h3>
                  <p
                    className={cx(
                      "type-text-lg",
                      "measure-copy",
                      "wrap-pretty",
                      "mt-6 text-white/80",
                    )}
                  >
                    {activeItem.body}
                  </p>
                  <p
                    className={cx(
                      "type-text-sm",
                      "measure-copy",
                      "wrap-pretty",
                      "mt-8 text-white/70",
                    )}
                  >
                    {body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </article>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="stretch"
          className="col-span-7 hidden max-lg:block"
        >
          <div
            aria-label="Services carousel"
            className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handleMobileScroll}
            ref={mobileTrackRef}
            role="region"
          >
            {items.map((item) => (
              <article
                className="radius-medium media-min-medium relative flex w-full shrink-0 snap-start snap-always items-end overflow-hidden border border-service-border bg-service-ink text-white shadow-service"
                key={item.title}
              >
                <PlaceholderBackground />
                <div className="absolute inset-0 bg-service-ink/45" aria-hidden="true" />
                <div
                  className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/55 to-service-ink/10"
                  aria-hidden="true"
                />

                <div className="content-padding fluid-type-frame relative z-10 flex w-full flex-col items-start">
                  <p className="type-label text-white/70">{item.imageLabel}</p>
                  <h3 className="type-heading-lg mt-5 text-white">
                    {item.title}
                  </h3>
                  <p className="type-text-lg measure-copy wrap-pretty mt-6 text-white/80">
                    {item.body}
                  </p>
                  <Link
                    aria-label={`Learn more about ${item.title}`}
                    className="type-text-md mt-body-actions-md inline-flex min-h-11 items-center gap-2 border-b border-white/60 font-semibold text-white transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    href={getServiceHref(item)}
                  >
                    Learn More <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div
            aria-label="Choose a service slide"
            className="mt-inline-sml flex items-center justify-center"
            role="group"
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Show ${item.title}`}
                  className="group/slide-dot flex size-7 cursor-pointer items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-service-accent"
                  key={item.title}
                  onClick={() => scrollToMobileSlide(index)}
                  type="button"
                >
                  <span
                    className={cx(
                      "size-2.5 rounded-full border border-service-accent transition-colors group-hover/slide-dot:bg-service-accent/35",
                      isActive ? "bg-service-accent" : "bg-transparent",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
