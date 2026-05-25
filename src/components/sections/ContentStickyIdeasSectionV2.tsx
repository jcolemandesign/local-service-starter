"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./section-v2-type.module.css";

type ContentStickyIdeasSectionV2Props = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  ideas: string[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const desktopQuery = "(min-width: 1024px)";
const maxOffset = 460;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function ImportantIdeasBoxV2({ ideas }: { ideas: string[] }) {
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
        styles["radius-medium"],
        styles["fluid-type-frame"],
        "border border-service-border bg-white p-7 shadow-service will-change-transform max-lg:will-change-auto",
      )}
      ref={boxRef}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <p className={cx(styles["fluid-label"], "text-service-accent")}>
        Important ideas
      </p>
      <ul className="mt-6 grid gap-4">
        {ideas.map((idea) => (
          <li
            className={cx(
              styles["fluid-heading-sm"],
              styles["wrap-balance"],
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
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[minmax(0,1fr)_360px] gap-16 px-12 max-lg:grid-cols-1 max-lg:gap-12 max-lg:px-8 max-md:px-6">
        <div className={styles["fluid-type-frame"]}>
          <p className={cx(styles["fluid-label"], "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              styles["fluid-heading-xl"],
              styles["measure-heading-wide"],
              styles["wrap-balance"],
              "mt-6 text-service-ink",
            )}
          >
            {title}
          </h2>
          <div className="mt-14 space-y-12">
            {paragraphs.map((paragraph) => (
              <p
                className={cx(
                  styles["fluid-heading-md"],
                  styles["measure-copy-wide"],
                  styles["wrap-pretty"],
                  "text-service-ink",
                )}
                key={paragraph}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <aside className="max-lg:order-first">
          <ImportantIdeasBoxV2 ideas={ideas} />
        </aside>
      </div>
    </section>
  );
}
