"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type HeroStackedHeaderImageVisualProps = {
  eyebrow: string;
  title: string;
  headingLevel: 1 | 2;
};

export function HeroStackedHeaderImageVisual({
  eyebrow,
  title,
  headingLevel,
}: HeroStackedHeaderImageVisualProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const headingY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <div
      ref={frameRef}
      className="fluid-type-frame relative flex min-h-svh items-start justify-center pt-[calc(33svh-(var(--headline-size)*0.41))] [--headline-size:clamp(4rem,calc(var(--stack-width)*0.112),9.5rem)] [--image-width:calc(var(--stack-width)*0.8333)] [--stack-width:clamp(34rem,72vw,78rem)] max-md:min-h-[40rem] max-md:[--headline-size:clamp(3.5rem,calc(var(--stack-width)*0.16),6rem)] max-md:[--stack-width:min(100%,38rem)]"
    >
      <div className="relative mx-auto w-[var(--stack-width)] text-center text-[length:var(--headline-size)]">
        <motion.div
          aria-hidden="true"
          className="radius-large absolute left-1/2 top-[0.6em] aspect-[2/3] w-[var(--image-width)] overflow-hidden border border-zinc-300 bg-zinc-300 shadow-service"
          style={{ x: "-50%", y: shouldReduceMotion ? 0 : imageY }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(255_255_255_/_0.34),rgb(255_255_255_/_0.04)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_20px)]" />
          <div className="absolute inset-0 bg-zinc-200/20" />
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto flex w-full flex-col items-center text-center"
          style={{ y: shouldReduceMotion ? 0 : headingY }}
        >
          <p className="type-label absolute bottom-full left-1/2 mb-6 -translate-x-1/2 whitespace-nowrap text-service-accent max-md:mb-5">
            {eyebrow}
          </p>
          <HeadingTag className="text-[length:var(--headline-size)] font-[420] leading-[0.82] text-service-ink [font-stretch:75%]">
            {title}
          </HeadingTag>
        </motion.div>
      </div>
    </div>
  );
}
