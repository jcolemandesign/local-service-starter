"use client";

import { motion, useReducedMotion } from "motion/react";

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
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentStickyCardStreamSectionV2({
  eyebrow,
  title,
  body,
  cards,
}: ContentStickyCardStreamSectionV2Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="section-space-lrg min-h-svh bg-service-surface">
      <div className="container-site">
        <div className="grid min-h-svh grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] items-start layout-gap-lrg max-lg:grid-cols-1">
          <div className="sticky top-24 max-lg:static">
            <div className="fluid-type-frame">
              <div>
                <p className="type-label text-service-accent">{eyebrow}</p>
                <h2 className="type-display-lg measure-heading-wide wrap-balance mt-eyebrow-display text-service-ink">
                  {title}
                </h2>
                <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
                  {body}
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[135svh] max-lg:min-h-0">
            <div className="grid card-grid-gap-xlrg">
              {cards.map((card, index) => (
                <motion.article
                  className={cx(
                    "fluid-type-frame",
                    "radius-medium",
                    "border border-service-border bg-white p-8 shadow-service max-md:p-6",
                  )}
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, y: 36 }
                  }
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  viewport={{ once: true, amount: 0.36 }}
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
                  <h3 className="type-heading-lg measure-heading wrap-balance mt-eyebrow-heading-md text-service-ink">
                    {card.title}
                  </h3>
                  <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
                    {card.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
