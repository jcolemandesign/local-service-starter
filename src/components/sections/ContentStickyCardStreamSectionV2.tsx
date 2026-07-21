"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type StreamCard = {
  eyebrow: string;
  title: string;
  body: string;
};

type ContentStickyCardStreamSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  cards: StreamCard[];
  colorRecipe?: SectionColorRecipe;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentStickyCardStreamSectionV2({
  eyebrow,
  title,
  body,
  cards,
  colorRecipe = "default",
}: ContentStickyCardStreamSectionV2Props) {
  const shouldReduceMotion = useReducedMotion();
  const colors =
    colorRecipe === "muted"
      ? { card: "bg-bg-page", section: "bg-service-surface" }
      : { card: "bg-service-surface", section: "bg-bg-page" };

  return (
    <section className={colors.section}>
      <SevenColumnGrid className="section-min-active items-start">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          alignY="top"
        >
          <div className="sticky top-[var(--site-grid-inset-block)] max-lg:static">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">{eyebrow}</p>
              <h2 className="type-display-lg mt-eyebrow-display text-service-ink">
                {title}
              </h2>
              <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
                {body}
              </p>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="top"
        >
          <div className="grid card-grid-gap-xlrg">
            {cards.map((card, index) => (
              <motion.article
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  "border border-service-border p-8 shadow-service max-md:p-6",
                  colors.card,
                )}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: 36 }
                }
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.12 + index * 0.08,
                  duration: shouldReduceMotion ? 0 : 0.62,
                  ease: [0.22, 1, 0.36, 1],
                }}
                viewport={{ once: true, amount: 0.48 }}
                whileInView={{ opacity: 1, y: 0 }}
                key={card.title}
              >
                <div className="flex items-start justify-between gap-6">
                  <p className="type-label text-service-accent">
                    {card.eyebrow}
                  </p>
                  <span className="type-caption shrink-0 text-service-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
                  {card.title}
                </h3>
                <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
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
