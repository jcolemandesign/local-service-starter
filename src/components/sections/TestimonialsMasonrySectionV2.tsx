"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/primitives";
import styles from "./section-v2-type.module.css";

const masonryEase = [0.22, 1, 0.36, 1] as const;

type MasonryTestimonial = {
  quote: string;
  author: string;
  detail: string;
};

type TestimonialsMasonrySectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  items: MasonryTestimonial[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function TestimonialsMasonrySectionV2({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsMasonrySectionV2Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const revealTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: masonryEase };

  return (
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div className={cx(styles["fluid-type-frame"], "mx-auto max-w-4xl text-center")}>
          <p className={cx(styles["fluid-label"], "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              styles["fluid-heading-xl"],
              styles["measure-heading-wide"],
              styles["wrap-balance"],
              "mx-auto mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              styles["fluid-text-lg"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "mx-auto mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="relative mt-16 max-md:mt-12">
          <motion.div
            className="overflow-hidden"
            animate={{ height: isExpanded ? "auto" : 620 }}
            initial={false}
            transition={revealTransition}
          >
            <div className="columns-3 gap-6 max-lg:columns-2 max-md:columns-1">
              {items.map((item) => (
                <article
                  className={cx(
                    styles["fluid-type-frame"],
                    styles["radius-medium"],
                    "mb-6 break-inside-avoid border border-service-border bg-white p-7 shadow-service",
                  )}
                  key={`${item.author}-${item.detail}`}
                >
                  <blockquote
                    className={cx(
                      styles["fluid-text-lg"],
                      styles["measure-copy"],
                      styles["wrap-pretty"],
                      "font-medium text-service-ink",
                    )}
                  >
                    &quot;{item.quote}&quot;
                  </blockquote>
                  <p
                    className={cx(
                      styles["fluid-heading-sm"],
                      styles["wrap-balance"],
                      "mt-8 text-service-ink",
                    )}
                  >
                    {item.author}
                  </p>
                  <p
                    className={cx(
                      styles["fluid-text-sm"],
                      styles["measure-caption"],
                      styles["wrap-pretty"],
                      "mt-2 text-service-muted",
                    )}
                  >
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>

          {!isExpanded ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-72 items-end justify-center bg-linear-to-t from-service-surface via-service-surface/95 to-service-surface/0 pb-2">
              <div className="pointer-events-auto">
                <Button
                  href="#testimonials-masonry-expanded"
                  onClick={(event) => {
                    event.preventDefault();
                    setIsExpanded(true);
                  }}
                >
                  Load more
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
