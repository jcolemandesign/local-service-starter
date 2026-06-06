"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const masonryEase = [0.22, 1, 0.36, 1] as const;

type MasonryTestimonial = {
  author: string;
  detail: string;
  quote: string;
};

type TestimonialsMasonrySectionV3Props = {
  body: string;
  eyebrow: string;
  items: readonly MasonryTestimonial[];
  title: string;
};

export function TestimonialsMasonrySectionV3({
  body,
  eyebrow,
  items,
  title,
}: TestimonialsMasonrySectionV3Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const revealTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: masonryEase };

  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-none" padding="med">
        <SevenColumnGridItem
          alignX="center"
          className="col-span-3 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          <div className="fluid-type-frame mx-auto w-full measure-lead text-center">
            <p className="type-label text-service-accent">{eyebrow}</p>
            <h2 className="type-heading-xl mx-auto mt-5 text-service-ink">
              {title}
            </h2>
            <p className="type-text-lg measure-copy wrap-pretty mx-auto mt-6 text-service-muted">
              {body}
            </p>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem className="col-span-7">
          <div className="relative mt-16 max-md:mt-12">
            <motion.div
              animate={{ height: isExpanded ? "auto" : 620 }}
              className="overflow-hidden"
              initial={false}
              transition={revealTransition}
            >
              <div className="columns-3 gap-6 max-lg:columns-2 max-md:columns-1">
                {items.map((item) => (
                  <article
                    className="fluid-type-frame radius-medium mb-6 break-inside-avoid border border-service-border bg-white p-7 shadow-service"
                    key={`${item.author}-${item.detail}`}
                  >
                    <blockquote className="type-text-lg measure-copy wrap-pretty font-medium text-service-ink">
                      &quot;{item.quote}&quot;
                    </blockquote>
                    <p className="type-heading-sm mt-8 text-service-ink">
                      {item.author}
                    </p>
                    <p className="type-text-sm measure-caption wrap-pretty mt-2 text-service-muted">
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
