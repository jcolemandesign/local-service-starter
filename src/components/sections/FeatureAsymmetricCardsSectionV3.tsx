"use client";

import { motion, type Variants, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureAsymmetricCard = {
  body: string;
  iconLabel: string;
  title: string;
};

type FeatureAsymmetricCardsSectionV3Props = {
  actionLabel: string;
  align?: FeatureAsymmetricCardsAlign;
  body: string;
  cards: readonly FeatureAsymmetricCard[];
  eyebrow: string;
  title: string;
};

export type FeatureAsymmetricCardsAlign = "left" | "right";

const cardEase = "easeOut" as const;
const cardSequenceDelay = 0.12;

const cardAnimation: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.13,
      duration: 0.34,
      ease: cardEase,
    },
    y: 0,
  }),
};

const iconAnimation: Variants = {
  hidden: { opacity: 0, scale: 0.88, y: 14 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.13,
      duration: 0.28,
      ease: cardEase,
    },
    y: 0,
  }),
};

const headingAnimation: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.13 + 0.11,
      duration: 0.22,
      ease: cardEase,
    },
    y: 0,
  }),
};

const bodyAnimation: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    transition: {
      delay: cardSequenceDelay + index * 0.13 + 0.18,
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
      className="relative flex size-24 items-center justify-center rounded-full border border-service-ink text-service-ink"
    >
      <span className="type-label text-service-ink">{label}</span>
      <span
        aria-hidden="true"
        className="absolute inset-x-5 top-1/2 border-t border-service-ink"
      />
      <span
        aria-hidden="true"
        className="absolute inset-y-5 left-1/2 border-l border-service-ink"
      />
    </div>
  );
}

export function FeatureAsymmetricCardsSectionV3({
  actionLabel,
  align = "left",
  body,
  cards,
  eyebrow,
  title,
}: FeatureAsymmetricCardsSectionV3Props) {
  const shouldReduceMotion = useReducedMotion();
  const cardsFirst = align === "right";

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none items-start" padding="med">
        <SevenColumnGridItem
          className={`col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1 ${
            cardsFirst ? "col-start-5 max-lg:col-start-1" : ""
          }`}
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

        <SevenColumnGridItem
          className={`col-span-4 col-start-4 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3 max-sm:col-span-1 ${
            cardsFirst ? "col-start-1" : ""
          }`}
        >
          <div className="grid gap-x-[var(--site-grid-gap)] gap-y-3">
            {[cards.slice(0, 2), cards.slice(2, 4)].map((row, rowIndex) => (
              <div
                className="grid grid-cols-2 items-start gap-[var(--site-grid-gap)] max-md:grid-cols-1"
                key={`feature-asymmetric-row-${rowIndex}`}
              >
                {row.map((card, columnIndex) => {
                  const cardIndex = rowIndex * 2 + columnIndex;
                  const initial = shouldReduceMotion ? false : "hidden";
                  const whileInView = shouldReduceMotion ? undefined : "visible";

                  return (
                    <motion.article
                      className="fluid-type-frame min-h-60 pb-0 pt-5 text-service-ink max-md:min-h-0"
                      custom={cardIndex}
                      initial={initial}
                      key={card.title}
                      variants={cardAnimation}
                      viewport={{ amount: 0.35, once: true }}
                      whileInView={whileInView}
                    >
                      <motion.div
                        custom={cardIndex}
                        variants={iconAnimation}
                      >
                        <FeatureIconPlaceholder label={card.iconLabel} />
                      </motion.div>
                      <motion.h3
                        className="type-heading-sm mt-body-actions-md text-service-ink"
                        custom={cardIndex}
                        variants={headingAnimation}
                      >
                        {card.title}
                      </motion.h3>
                      <motion.p
                        className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted"
                        custom={cardIndex}
                        variants={bodyAnimation}
                      >
                        {card.body}
                      </motion.p>
                    </motion.article>
                  );
                })}
              </div>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
