"use client";

import { motion, type Variants, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureStackedCard = {
  body: string;
  iconLabel: string;
  title: string;
};

type FeatureStackedCardsSectionV3Props = {
  actionLabel: string;
  body: string;
  cards: readonly FeatureStackedCard[];
  eyebrow: string;
  title: string;
};

const cardEase = "easeOut" as const;
const cardSequenceDelay = 0.12;

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.1,
      duration: 0.34,
      ease: cardEase,
    },
    y: 0,
  }),
};

const iconAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.1,
      duration: 0.28,
      ease: cardEase,
    },
    y: 0,
  }),
};

const headingAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.1 + 0.1,
      duration: 0.22,
      ease: cardEase,
    },
    y: 0,
  }),
};

const bodyAnimation: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.1 + 0.16,
      duration: 0.22,
      ease: cardEase,
    },
    y: 0,
  }),
};

function FeatureIconPlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} icon placeholder`}
      className="relative flex size-32 shrink-0 items-center justify-center rounded-full border border-service-ink text-service-ink max-lg:size-28 max-md:size-24"
    >
      <span className="type-label text-service-ink">{label}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-7 top-1/2 border-t border-service-ink max-lg:inset-x-6 max-md:inset-x-5"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-7 left-1/2 border-l border-service-ink max-lg:inset-y-6 max-md:inset-y-5"
      />
    </div>
  );
}

export function FeatureStackedCardsSectionV3({
  actionLabel,
  body,
  cards,
  eyebrow,
  title,
}: FeatureStackedCardsSectionV3Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-display-lg mt-eyebrow-display text-service-ink">
              {title}
            </h2>
            <p className="type-text-xl wrap-pretty mt-heading-body-lg text-service-ink">
              {body}
            </p>
            <div className="mt-body-actions-lg">
              <a
                className="type-label inline-flex min-h-12 items-center border-b border-service-ink text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="#contact"
              >
                {actionLabel}
              </a>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1">
          <div className="grid gap-[var(--site-grid-gap)]">
            {cards.slice(0, 4).map((card, cardIndex) => {
              const initial = shouldReduceMotion ? false : "hidden";
              const whileInView = shouldReduceMotion ? undefined : "visible";

              return (
                <motion.article
                  className="fluid-type-frame flex min-h-44 items-start gap-7 border-t border-service-border py-7 text-service-ink first:border-t-0 first:pt-0 max-md:gap-5 max-sm:min-h-0 max-sm:flex-col"
                  custom={cardIndex}
                  initial={initial}
                  key={card.title}
                  variants={cardAnimation}
                  viewport={{ amount: 0.35, once: true }}
                  whileInView={whileInView}
                >
                  <motion.div custom={cardIndex} variants={iconAnimation}>
                    <FeatureIconPlaceholder label={card.iconLabel} />
                  </motion.div>
                  <div className="max-w-2xl">
                    <motion.h3
                      className="type-heading-md text-service-ink"
                      custom={cardIndex}
                      variants={headingAnimation}
                    >
                      {card.title}
                    </motion.h3>
                    <motion.p
                      className="type-text-md wrap-pretty mt-heading-body-sm text-service-muted"
                      custom={cardIndex}
                      variants={bodyAnimation}
                    >
                      {card.body}
                    </motion.p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
