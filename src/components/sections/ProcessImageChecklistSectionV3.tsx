"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ProcessImageChecklistSectionV3Props = {
  action: string;
  body: string;
  eyebrow: string;
  imageLabel: string;
  items: readonly string[];
  title: string;
};

function ProcessImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className="radius-medium relative min-h-[34rem] overflow-hidden bg-service-border max-lg:min-h-[26rem] max-md:min-h-[18rem]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.28),rgb(23_33_29_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
      <div className="radius-medium absolute bottom-6 left-6 border border-white/45 bg-white/25 px-4 py-3 text-sm font-semibold uppercase text-service-ink backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

export function ProcessImageChecklistSectionV3({
  action,
  body,
  eyebrow,
  imageLabel,
  items,
  title,
}: ProcessImageChecklistSectionV3Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-white">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          alignY="stretch"
          className="col-span-3 max-lg:col-span-7"
        >
          <ProcessImage label={imageLabel} />
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignY="middle"
          className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-lg text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg measure-copy wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>

            <motion.ul
              className="mt-body-actions-md grid card-grid-gap-med"
              initial={shouldReduceMotion ? false : "hidden"}
              viewport={{ once: true, amount: 0.42 }}
              whileInView="visible"
            >
              {items.map((item, index) => (
                <motion.li
                  className="radius-medium flex items-start inline-gap-med border border-service-border bg-service-surface p-5"
                  key={item}
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
                  <span className="radius-4 mt-1 flex size-8 shrink-0 items-center justify-center bg-service-ink text-xs font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="type-text-md measure-copy wrap-pretty font-medium text-service-ink">
                    {item}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            <a
              className="type-label mt-body-actions-md inline-flex cursor-pointer items-center text-service-accent transition-colors hover:text-service-ink"
              href="#contact"
            >
              {action} -&gt;
            </a>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
