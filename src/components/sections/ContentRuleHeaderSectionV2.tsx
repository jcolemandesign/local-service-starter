"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ContentRuleHeaderSectionV2Props = {
  eyebrow: string;
  title: string;
};

export function ContentRuleHeaderSectionV2({
  eyebrow,
  title,
}: ContentRuleHeaderSectionV2Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "center center"],
  });
  const ruleScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="bg-white">
      <SevenColumnGrid>
        <SevenColumnGridItem className="col-span-6 max-lg:col-span-7">
          <div
            className="fluid-type-frame w-full min-w-0"
            ref={sectionRef}
          >
            <p className="type-label text-service-accent">{eyebrow}</p>
            <div className="mt-eyebrow-heading-lg h-px overflow-hidden bg-service-border">
              <motion.div
                className="h-full origin-left bg-service-ink"
                style={{ scaleX: shouldReduceMotion ? 1 : ruleScale }}
              />
            </div>
            <h2 className="type-heading-xl measure-copy-wide mt-display-body text-service-ink">
              {title}
            </h2>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
