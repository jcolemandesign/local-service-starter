"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Button, Card, Container, Section, SectionHeading } from "@/components/primitives";

const masonryEase = [0.22, 1, 0.36, 1] as const;

type MasonryTestimonial = {
  quote: string;
  author: string;
  detail: string;
};

type TestimonialsMasonrySectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  items: MasonryTestimonial[];
};

export function TestimonialsMasonrySection({
  eyebrow,
  title,
  body,
  items,
}: TestimonialsMasonrySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const revealTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.32, ease: masonryEase };

  return (
    <Section className="bg-service-surface">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            body={body}
            align="center"
          />
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
                <Card
                  className="mb-6 break-inside-avoid p-7"
                  key={`${item.author}-${item.detail}`}
                >
                  <blockquote className="text-xl font-medium leading-8 text-service-ink">
                    &quot;{item.quote}&quot;
                  </blockquote>
                  <p className="mt-8 text-lg font-semibold leading-tight text-service-ink">
                    {item.author}
                  </p>
                  <p className="mt-2 text-sm font-medium text-service-muted">
                    {item.detail}
                  </p>
                </Card>
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
      </Container>
    </Section>
  );
}
