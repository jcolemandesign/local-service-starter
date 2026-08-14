"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type FloaterDepth = "near" | "mid" | "far";
type FloaterSide = "left" | "right";

type Floater = {
  className: string;
  depth: FloaterDepth;
  tone: string;
};

/**
 * Widths and offsets are scaled up from the original composition so the two
 * columns read as photographs rather than as swatches: each floater is roughly
 * a fifth wider and sits nearer its outer edge, leaving the same stagger
 * between the three depths while using most of the column.
 */
const floaters: Record<FloaterSide, Floater[]> = {
  left: [
    {
      className: "left-0 top-[3%] aspect-[3/2] w-[88%]",
      depth: "far",
      tone: "bg-zinc-200",
    },
    {
      className: "right-0 top-[30%] aspect-square w-[66%]",
      depth: "near",
      tone: "bg-zinc-300",
    },
    {
      className: "left-[8%] bottom-0 aspect-[2/3] w-[46%]",
      depth: "mid",
      tone: "bg-zinc-100",
    },
  ],
  right: [
    {
      className: "right-0 top-0 aspect-[2/3] w-[44%]",
      depth: "mid",
      tone: "bg-zinc-100",
    },
    {
      className: "left-0 top-[27%] aspect-[3/2] w-[86%]",
      depth: "near",
      tone: "bg-zinc-300",
    },
    {
      className: "right-[6%] bottom-[2%] aspect-square w-[56%]",
      depth: "far",
      tone: "bg-zinc-200",
    },
  ],
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function depthRange(depth: FloaterDepth) {
  if (depth === "near") {
    return [-96, 96];
  }

  if (depth === "mid") {
    return [-52, 52];
  }

  return [-20, 20];
}

export function HeroCenteredFloatersParallax({
  side,
}: {
  side: FloaterSide;
}) {
  const columnRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: columnRef,
    offset: ["start end", "end start"],
  });

  const nearY = useTransform(scrollYProgress, [0, 1], depthRange("near"));
  const midY = useTransform(scrollYProgress, [0, 1], depthRange("mid"));
  const farY = useTransform(scrollYProgress, [0, 1], depthRange("far"));
  const yByDepth = {
    near: nearY,
    mid: midY,
    far: farY,
  };

  return (
    <div ref={columnRef} className="relative min-h-[42rem] max-lg:hidden">
      {floaters[side].map((floater) => (
        <motion.div
          aria-hidden="true"
          className={cx(
            // No outline. These are photographs, and a light rule around each
            // one read as a frame rather than as an edge - it also survived
            // every recipe unchanged, which is the pairing the colour system
            // exists to avoid.
            "radius-medium absolute overflow-hidden shadow-service",
            floater.tone,
            floater.className,
          )}
          key={`${side}-${floater.className}`}
          style={{ y: shouldReduceMotion ? 0 : yByDepth[floater.depth] }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(255_255_255_/_0.2),transparent_45%),linear-gradient(45deg,rgb(255_255_255_/_0.18)_0_1px,transparent_1px_18px)]" />
        </motion.div>
      ))}
    </div>
  );
}
