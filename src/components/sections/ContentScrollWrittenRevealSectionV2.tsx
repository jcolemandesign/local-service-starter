"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { CSSProperties } from "react";
import { Fragment, useMemo, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ContentScrollWrittenRevealSectionV2Props = {
  lines: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ContentScrollWrittenRevealSectionV2({
  lines,
}: ContentScrollWrittenRevealSectionV2Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(shouldReduceMotion ? 1 : 0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 92%", "start 18%"],
  });

  const words = useMemo(() => {
    let characterIndex = 0;
    const mappedLines = lines.map((line) =>
      line
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => ({
          word,
          characters: Array.from(word).map((character) => ({
            character,
            index: characterIndex++,
          })),
        })),
    );

    return {
      lines: mappedLines,
      total: Math.max(characterIndex, 1),
    };
  }, [lines]);

  useMotionValueEvent(scrollYProgress, "change", (latestProgress) => {
    if (!shouldReduceMotion) {
      setProgress(latestProgress);
    }
  });

  const revealStart = 0.04;
  const revealEnd = 0.82;
  const revealWindow = 0.035;
  const revealProgress = shouldReduceMotion
    ? 1
    : clamp((progress - revealStart) / (revealEnd - revealStart), 0, 1);
  const driftY = 0;

  return (
    <section
      className="bg-white"
      ref={sectionRef}
    >
      <SevenColumnGrid
        className="section-min-screen content-center max-lg:section-min-medium max-md:section-min-short"
        minHeight="none"
        style={{ transform: `translate3d(0, ${driftY}px, 0)` }}
      >
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-6 max-lg:col-span-7"
        >
          <div className="fluid-type-frame">
            <p
              aria-label={lines.join(" ")}
              className={cx(
                "type-heading-xl",
                "measure-copy-wide",
                "text-service-ink",
              )}
              style={{ "--type-heading-xl-tracking": "0em" } as CSSProperties}
            >
              <span aria-hidden="true">
                {words.lines.map((line, lineIndex) => (
                  <span
                    className="block pb-1"
                    key={`${lineIndex}-${lines[lineIndex]}`}
                  >
                    {line.map(({ word, characters }, wordIndex) => {
                      return (
                        <Fragment
                          key={`${lineIndex}-${wordIndex}-${word}`}
                        >
                          <span className="inline-block whitespace-nowrap">
                            {characters.map(({ character, index }) => {
                              const characterStart =
                                words.total === 1
                                  ? 0
                                  : (index / (words.total - 1)) *
                                    (1 - revealWindow);
                              const revealOpacity = shouldReduceMotion
                                ? 1
                                : clamp(
                                    (revealProgress - characterStart) /
                                      revealWindow,
                                    0,
                                    1,
                                  );
                              const opacity = shouldReduceMotion
                                ? 1
                                : 0.2 + revealOpacity * 0.8;

                              return (
                                <span
                                  className="inline-block"
                                  key={`${index}-${character}`}
                                  style={{ opacity }}
                                >
                                  {character}
                                </span>
                              );
                            })}
                          </span>
                          {wordIndex < line.length - 1 ? " " : null}
                        </Fragment>
                      );
                    })}
                  </span>
                ))}
              </span>
            </p>
          </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
