"use client";

import { motion, useReducedMotion } from "motion/react";

type ProcessImageChecklistSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  imageLabel: string;
  items: string[];
  action: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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

export function ProcessImageChecklistSectionV2({
  eyebrow,
  title,
  body,
  imageLabel,
  items,
  action,
}: ProcessImageChecklistSectionV2Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="section-space-med bg-white">
      <div className="container-site">
        <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-center layout-gap-lrg max-lg:grid-cols-1">
          <ProcessImage label={imageLabel} />

          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-lg measure-heading wrap-balance mt-eyebrow-heading-lg text-service-ink">
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
              className={cx(
                "type-label",
                "mt-body-actions-md inline-flex cursor-pointer items-center text-service-accent transition-colors hover:text-service-ink",
              )}
              href="#contact"
            >
              {action} -&gt;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
