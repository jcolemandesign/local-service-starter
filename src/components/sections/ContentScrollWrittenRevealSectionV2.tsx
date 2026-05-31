"use client";

import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useMemo, useRef, useState } from "react";

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
    offset: ["start 44%", "end 62%"],
  });

  const letters = useMemo(() => {
    let characterIndex = 0;
    const mappedLines = lines.map((line) =>
      Array.from(line).map((character) => ({
        character,
        index: characterIndex++,
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

  const revealStart = 0.16;
  const revealEnd = 0.58;
  const revealWindow = 0.035;
  const revealProgress = shouldReduceMotion
    ? 1
    : clamp((progress - revealStart) / (revealEnd - revealStart), 0, 1);
  const driftY = shouldReduceMotion ? 0 : 128 * progress;

  return (
    <section
      className="min-h-[130svh] bg-white section-space-lrg max-md:min-h-[115svh]"
      ref={sectionRef}
    >
      <div
        className="flex min-h-svh items-center"
        style={{ transform: `translate3d(0, ${driftY}px, 0)` }}
      >
        <div className={cx("container-site", "fluid-type-frame")}>
          <p
            aria-label={lines.join(" ")}
            className={cx(
              "type-heading-xl",
              "measure-copy-wide",
              "text-service-ink",
            )}
          >
            <span aria-hidden="true">
              {letters.lines.map((line, lineIndex) => (
                <span
                  className="block pb-1"
                  key={`${lineIndex}-${lines[lineIndex]}`}
                >
                  {line.map(({ character, index }) => {
                    const characterStart =
                      letters.total === 1
                        ? 0
                        : (index / (letters.total - 1)) * (1 - revealWindow);
                    const opacity = shouldReduceMotion
                      ? 1
                      : clamp(
                          (revealProgress - characterStart) / revealWindow,
                          0,
                          1,
                        );

                    return (
                      <span
                        className="inline-block whitespace-pre"
                        key={`${index}-${character}`}
                        style={{ opacity }}
                      >
                        {character}
                      </span>
                    );
                  })}
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
