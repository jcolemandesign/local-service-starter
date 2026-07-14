"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const servicePanelEase = [0.22, 1, 0.36, 1] as const;

type HoverServiceItem = {
  title: string;
  body: string;
  imageLabel: string;
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

export function ServicesHoverPanelSectionV2({
  eyebrow,
  title,
  body,
  items,
}: ServicesHoverPanelSectionV2Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: servicePanelEase };
  const textTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.1, ease: servicePanelEase };

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

          <ul className="mt-body-actions-md grid gap-2">
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
            "col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1",
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
      </SevenColumnGrid>
    </section>
  );
}
