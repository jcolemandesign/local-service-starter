"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type FeatureOverlapItem = {
  body: string;
  eyebrow: string;
  imageLabel: string;
  position: "top" | "middle" | "bottom";
  title: string;
};

type ProcessStep = {
  body: string;
  title: string;
};

type Testimonial = {
  author: string;
  detail: string;
  quote: string;
};

type FeatureOverlapRowsSectionV3Props = {
  items: readonly FeatureOverlapItem[];
};

type ProcessStepsSectionV3Props = {
  body: string;
  eyebrow: string;
  steps: readonly ProcessStep[];
  title: string;
};

type TestimonialsSectionV3Props = {
  body: string;
  eyebrow: string;
  items: readonly Testimonial[];
  title: string;
};

const positionClass = {
  top: "self-start",
  middle: "self-center",
  bottom: "self-end",
} as const;

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function FeatureImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className="relative aspect-[3/2] min-h-80 w-full overflow-hidden bg-service-border max-lg:min-h-72 max-md:min-h-56"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.26),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function FeatureOverlapCard({
  item,
  mirrored,
}: {
  item: FeatureOverlapItem;
  mirrored: boolean;
}) {
  return (
    <article
      className={cx(
        "fluid-type-frame radius-medium relative z-10 border border-service-border bg-white p-10 shadow-service max-md:p-6",
        positionClass[item.position],
        mirrored ? "max-lg:translate-x-0 lg:-translate-x-10" : "max-lg:translate-x-0 lg:translate-x-10",
      )}
    >
      <p className="type-label text-service-accent">{item.eyebrow}</p>
      <h2 className="type-heading-lg mt-4 text-service-ink">{item.title}</h2>
      <p className="type-text-md wrap-pretty mt-6 text-service-muted">
        {item.body}
      </p>
    </article>
  );
}

function FeatureOverlapRow({
  item,
  mirrored = false,
}: {
  item: FeatureOverlapItem;
  mirrored?: boolean;
}) {
  return (
    <SevenColumnGrid
      className="section-min-none py-0 max-lg:py-10"
      padding="none"
    >
      {mirrored ? (
        <>
          <SevenColumnGridItem
            alignY="stretch"
            className="col-span-5 col-start-1 row-start-1 max-lg:col-span-7"
          >
            <FeatureImage label={item.imageLabel} />
          </SevenColumnGridItem>
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 col-start-5 row-start-1 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
          >
            <FeatureOverlapCard item={item} mirrored />
          </SevenColumnGridItem>
        </>
      ) : (
        <>
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-3 col-start-1 row-start-1 max-lg:col-span-7"
          >
            <FeatureOverlapCard item={item} mirrored={false} />
          </SevenColumnGridItem>
          <SevenColumnGridItem
            alignY="stretch"
            className="col-span-5 col-start-3 row-start-1 max-lg:col-span-7 max-lg:col-start-1 max-lg:row-auto"
          >
            <FeatureImage label={item.imageLabel} />
          </SevenColumnGridItem>
        </>
      )}
    </SevenColumnGrid>
  );
}

export function FeatureOverlapRowsSectionV3({
  items,
}: FeatureOverlapRowsSectionV3Props) {
  return (
    <section className="bg-white">
      {items.map((item, index) => (
        <FeatureOverlapRow
          item={item}
          key={item.title}
          mirrored={index % 2 === 1}
        />
      ))}
    </section>
  );
}

export function ProcessStepsSectionV3({
  body,
  eyebrow,
  steps,
  title,
}: ProcessStepsSectionV3Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          measure="copy"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="top"
        >
          <motion.ol
            className="grid card-grid-gap-med"
            initial={shouldReduceMotion ? false : "hidden"}
            viewport={{ once: true, amount: 0.42 }}
            whileInView="visible"
          >
            {steps.map((step, index) => (
              <motion.li
                className={cx(
                  "fluid-type-frame grid grid-cols-[auto_minmax(0,1fr)] items-center layout-gap-med bg-transparent py-7 text-service-ink max-md:grid-cols-1 max-md:items-start",
                  index === steps.length - 1
                    ? undefined
                    : "border-b border-service-border",
                )}
                key={step.title}
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.15 + index * 0.462,
                  duration: shouldReduceMotion ? 0 : 0.44,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex h-12 min-w-12 items-center justify-center text-sm font-semibold text-service-ink">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="pl-4 max-md:pl-0 max-md:pt-4">
                  <h3 className="type-heading-md text-service-ink">
                    {step.title}
                  </h3>
                  <p className="type-text-md wrap-pretty mt-heading-body-md text-service-muted">
                    {step.body}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}

export function TestimonialsSectionV3({
  body,
  eyebrow,
  items,
  title,
}: TestimonialsSectionV3Props) {
  return (
    <section className="bg-white">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          className="col-span-3 max-lg:col-span-7"
          measure="copy"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mt-5 text-service-ink">{title}</h2>
            <p className="type-text-lg wrap-pretty mt-6 text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          alignY="stretch"
        >
          <div className="grid h-full grid-cols-2 gap-6 max-md:grid-cols-1">
            {items.map((item) => (
              <article
                className="fluid-type-frame radius-medium border border-service-border bg-service-surface p-8 shadow-service"
                key={item.author}
              >
                <blockquote className="type-text-xl wrap-pretty font-medium text-service-ink">
                  &quot;{item.quote}&quot;
                </blockquote>
                <p className="type-heading-sm mt-8 text-service-ink">
                  {item.author}
                </p>
                <p className="type-text-sm wrap-pretty mt-2 text-service-muted">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
