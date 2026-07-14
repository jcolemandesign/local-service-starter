"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type SplitDecisionCard = {
  body: string;
  eyebrow: string;
  title: string;
};

type DecisionSplitDecisionSectionV3Props = {
  actionLabel: string;
  body: string;
  cards: readonly SplitDecisionCard[];
  eyebrow: string;
  title: string;
};

function getCardPulse(index: number) {
  return {
  scale: [1, 1.025, 1],
  transition: {
    delay: index * 1.05,
    duration: 0.95,
    ease: "easeInOut" as const,
  },
};
}

export function DecisionSplitDecisionSectionV3({
  actionLabel,
  body,
  cards,
  eyebrow,
  title,
}: DecisionSplitDecisionSectionV3Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none items-start" padding="sml">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-md text-service-muted">
              {body}
            </p>
            <div className="mt-body-actions-md">
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
          <div className="grid grid-cols-2 items-stretch gap-[var(--site-grid-gap)] max-md:grid-cols-1">
            {cards.slice(0, 2).map((card, index) => (
              <motion.article
                className="fluid-type-frame min-h-56 rounded-[var(--radius-md-token)] border border-service-border bg-bg-page p-5 text-service-ink shadow-none max-md:min-h-0"
                initial={false}
                key={card.title}
                viewport={{ amount: 0.85, once: true }}
                whileInView={shouldReduceMotion ? undefined : getCardPulse(index)}
              >
                <p className="type-label text-service-accent">{card.eyebrow}</p>
                <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-sm wrap-pretty mt-heading-body-sm text-service-muted">
                  {card.body}
                </p>
              </motion.article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
