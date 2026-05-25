"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/primitives";

const revealEase = [0.22, 1, 0.36, 1] as const;

type ContentRevealParagraphSectionProps = {
  lines: string[];
};

export function ContentRevealParagraphSection({
  lines,
}: ContentRevealParagraphSectionProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [revealKey, setRevealKey] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
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
    <Section className="bg-white">
      <Container>
        <div ref={sectionRef}>
          <p className="max-w-none text-5xl font-semibold leading-heading text-service-ink max-lg:text-4xl max-md:text-3xl">
            {lines.map((line, index) => (
              <span className="block overflow-hidden pb-1" key={line}>
                <motion.span
                  key={`${revealKey}-${line}`}
                  className="block"
                  initial={
                    shouldReduceMotion
                      ? false
                      : {
                          clipPath: "inset(100% 0 0 0)",
                          y: "0.65em",
                        }
                  }
                  transition={{
                    ...transition,
                    delay: shouldReduceMotion ? 0 : index * 0.12,
                  }}
                  animate={
                    isRevealed
                      ? {
                          clipPath: "inset(0% 0 0 0)",
                          y: 0,
                        }
                      : undefined
                  }
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </p>
        </div>
      </Container>
    </Section>
  );
}
