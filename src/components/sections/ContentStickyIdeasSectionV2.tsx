"use client";

import { useEffect, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";

type ContentStickyIdeasSectionV2Props = {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  ideas: readonly string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const desktopQuery = "(min-width: 1024px)";
const maxOffset = 460;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ImportantIdeasBoxV2({ ideas }: { ideas: readonly string[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const media = window.matchMedia(desktopQuery);

    const updateOffset = () => {
      const box = boxRef.current;

      if (!box || !media.matches) {
        setOffset(0);
        return;
      }

      const section = box.closest("section");

      if (!section) {
        setOffset(0);
        return;
      }

      const sectionRect = section.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollRange = sectionRect.height + viewportHeight;
      const progress = clamp((viewportHeight - sectionRect.top) / scrollRange, 0, 1);
      const availableOffset = Math.max(0, sectionRect.height - boxRect.height - 64);

      setOffset(Math.min(maxOffset, availableOffset) * progress);
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateOffset();
      });
    };

    updateOffset();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      media.removeEventListener("change", requestUpdate);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      className={cx(
        "radius-medium",
        "fluid-type-frame",
        "border border-service-border bg-white p-7 shadow-service will-change-transform max-lg:will-change-auto",
      )}
      ref={boxRef}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <p className={cx("type-label", "text-service-accent")}>
        Important ideas
      </p>
      <ul className="mt-6 grid gap-4">
        {ideas.map((idea) => (
          <li
            className={cx(
              "type-heading-sm",
              "border-l border-service-border pl-4 text-service-ink",
            )}
            key={idea}
          >
            {idea}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContentStickyIdeasSectionV2({
  eyebrow,
  title,
  paragraphs,
  ideas,
}: ContentStickyIdeasSectionV2Props) {
  return (
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-screen">
        <SevenColumnGridItem
          className="col-span-5 max-lg:col-span-7"
          alignY="middle"
        >
          <div className="fluid-type-frame">
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
            <h2
              className={cx(
                "type-heading-xl",
                "mt-6 text-service-ink",
              )}
            >
              {title}
            </h2>
            <div className="mt-14 space-y-12">
              {paragraphs.map((paragraph) => (
                <p
                  className={cx(
                    "type-heading-md",
                    "measure-copy-wide",
                    "wrap-pretty",
                    "text-service-ink",
                  )}
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          className="col-span-2 col-start-6 max-lg:col-span-7 max-lg:col-start-1 max-lg:order-first"
          alignY="top"
        >
          <ImportantIdeasBoxV2 ideas={ideas} />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
