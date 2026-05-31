"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

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

  return (
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site grid grid-cols-[minmax(18rem,0.9fr)_minmax(0,3.1fr)] gap-6 max-lg:grid-cols-1">
        <div className="fluid-type-frame">
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-md",
              "mt-4 text-service-ink",
            )}
          >
            {title}
          </h2>

          <ul className="mt-8 grid gap-2">
            {items.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={item.title}>
                  <button
                    type="button"
                    className={cx(
                      "radius-medium",
                      "group/service-link flex min-h-14 w-full cursor-pointer items-center justify-between overflow-hidden border text-left text-base font-semibold transition-colors",
                      isActive
                        ? "border-service-accent bg-white text-service-accent"
                        : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
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

        <div
          className={cx(
            "radius-medium",
            "min-h-[560px] overflow-hidden border border-service-border bg-service-surface shadow-service max-md:min-h-[520px]",
          )}
        >
          <div className="relative grid h-full min-h-[560px] max-md:min-h-[520px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={activeItem.title}
                className="relative col-start-1 row-start-1 flex h-full min-h-[560px] items-end overflow-hidden bg-service-ink p-10 text-white max-md:min-h-[520px] max-md:p-6"
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
                <div
                  className={cx(
                    "relative z-10 w-full max-w-3xl",
                    "fluid-type-frame",
                  )}
                >
                  <p className={cx("type-label", "text-white/70")}>
                    Service focus
                  </p>
                  <h3
                    className={cx(
                      "type-heading-xl",
                      "mt-5 text-white",
                    )}
                  >
                    {activeItem.title}
                  </h3>
                  <p
                    className={cx(
                      "type-text-xl",
                      "measure-copy",
                      "wrap-pretty",
                      "mt-6 text-white/80",
                    )}
                  >
                    {activeItem.body}
                  </p>
                  <p
                    className={cx(
                      "type-text-md",
                      "measure-copy",
                      "wrap-pretty",
                      "mt-8 text-white/70",
                    )}
                  >
                    {body}
                  </p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
