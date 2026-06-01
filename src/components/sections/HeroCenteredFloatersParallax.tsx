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

const floaters: Record<FloaterSide, Floater[]> = {
  left: [
    {
      className: "left-[2%] top-[7%] aspect-[3/2] w-[72%]",
      depth: "far",
      tone: "bg-zinc-200",
    },
    {
      className: "right-[4%] top-[31%] aspect-square w-[56%]",
      depth: "near",
      tone: "bg-zinc-300",
    },
    {
      className: "left-[16%] bottom-[3%] aspect-[2/3] w-[38%]",
      depth: "mid",
      tone: "bg-zinc-100",
    },
  ],
  right: [
    {
      className: "right-[4%] top-[4%] aspect-[2/3] w-[36%]",
      depth: "mid",
      tone: "bg-zinc-100",
    },
    {
      className: "left-[4%] top-[29%] aspect-[3/2] w-[70%]",
      depth: "near",
      tone: "bg-zinc-300",
    },
    {
      className: "right-[10%] bottom-[6%] aspect-square w-[46%]",
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
            "radius-medium absolute overflow-hidden border border-white/55 shadow-service",
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
