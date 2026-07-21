"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

const revealEase = [0.22, 1, 0.36, 1] as const;

type ContentRevealParagraphSectionV2Props = {
  lines: string[];
  sectionSpace?: "vsml" | "sml" | "med" | "lrg";
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ContentRevealParagraphSectionV2({
  lines,
  sectionSpace = "med",
}: ContentRevealParagraphSectionV2Props) {
  const sectionSpaceClass = {
    vsml: "section-space-vsml",
    sml: "section-space-sml",
    med: "section-space-med",
    lrg: "section-space-lrg",
  }[sectionSpace];
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [revealKey, setRevealKey] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const revealText = lines.map((line) => line.trim()).filter(Boolean).join(" ");
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.58, ease: revealEase };

  useEffect(() => {
    const sectionElement = sectionRef.current;
    let fallbackFrame: number | null = null;

    if (!sectionElement || shouldReduceMotion) {
      fallbackFrame = requestAnimationFrame(() => setIsRevealed(true));
      return () => {
        if (fallbackFrame !== null) {
          cancelAnimationFrame(fallbackFrame);
        }
      };
    }

    if (!("IntersectionObserver" in window)) {
      fallbackFrame = requestAnimationFrame(() => setIsRevealed(true));
      return () => {
        if (fallbackFrame !== null) {
          cancelAnimationFrame(fallbackFrame);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0.2 },
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  useEffect(() => {
    const details = sectionRef.current?.closest("details");

    if (!details) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (details.open) {
        setRevealKey((currentKey) => currentKey + 1);
        setIsRevealed(true);
      }
    });

    observer.observe(details, { attributes: true, attributeFilter: ["open"] });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-bg-page">
      <SevenColumnGrid className={cx("section-min-none", sectionSpaceClass)}>
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-6 max-lg:col-span-7"
        >
          <div className="fluid-type-frame" ref={sectionRef}>
            <div className="overflow-hidden pb-1">
              <motion.p
                key={`${revealKey}-${revealText}`}
                className={cx(
                  "type-heading-xl",
                  "measure-copy-wide",
                  "text-service-ink",
                )}
                initial={
                  shouldReduceMotion
                    ? false
                    : {
                        clipPath: "inset(100% 0 0 0)",
                        y: "0.65em",
                      }
                }
                transition={transition}
                animate={
                  isRevealed
                    ? {
                        clipPath: "inset(0% 0 0 0)",
                        y: 0,
                      }
                    : undefined
                }
              >
                {revealText}
              </motion.p>
            </div>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
