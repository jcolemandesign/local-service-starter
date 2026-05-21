"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Container, Section } from "@/components/primitives";

const servicePanelEase = [0.22, 1, 0.36, 1] as const;

type HoverServiceItem = {
  title: string;
  body: string;
  imageLabel: string;
};

type ServicesHoverPanelSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: HoverServiceItem[];
};

function PlaceholderBackground({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-8 border border-white/45 max-md:inset-5" />
      <div className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function ServicesHoverPanelSection({
  eyebrow,
  title,
  body,
  items,
}: ServicesHoverPanelSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];
  const shouldReduceMotion = useReducedMotion();
  const panelTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.26, ease: servicePanelEase };

  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-1">
          <div className="col-span-1">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-service-accent">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold leading-heading text-service-ink max-md:text-2xl">
              {title}
            </h2>

            <ul className="mt-8 grid gap-2">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      className={`group/service-link flex min-h-14 w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border text-left text-base font-semibold transition-colors ${
                        isActive
                          ? "border-service-accent bg-white text-service-accent"
                          : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent"
                      }`}
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

          <div className="col-span-3 min-h-[560px] overflow-hidden rounded-lg border border-service-border bg-service-surface shadow-service max-lg:col-span-1 max-md:min-h-[520px]">
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
                  <PlaceholderBackground label={activeItem.imageLabel} />
                  <div className="absolute inset-0 bg-service-ink/45" aria-hidden="true" />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/45 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="relative z-10 max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
                      Service focus
                    </p>
                    <h3 className="mt-5 text-fluid-heading font-semibold leading-heading">
                      {activeItem.title}
                    </h3>
                    <p className="mt-6 max-w-2xl text-xl leading-9 text-white/80 max-md:text-lg max-md:leading-8">
                      {activeItem.body}
                    </p>
                    <p className="mt-8 max-w-2xl text-base leading-7 text-white/70">
                      {body}
                    </p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
