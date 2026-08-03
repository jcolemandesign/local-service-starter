"use client";

import { useEffect, useRef, useState } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type ContentStickyIdeasSectionV2Props = {
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  colorRecipe?: SectionColorRecipe;
  eyebrow: string;
  ideasLabel?: string;
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

function ImportantIdeasBoxV2({
  cardBorder,
  cardFill,
  colorRecipe,
  ideas,
  label,
}: {
  cardBorder: "on" | "off";
  cardFill: "solid" | "none";
  colorRecipe: SectionColorRecipe;
  ideas: readonly string[];
  label: string;
}) {
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
        "border p-7 will-change-transform max-lg:will-change-auto",
        cardBorder === "off"
          ? "border-transparent"
          : "border-service-border",
        cardFill === "none"
          ? "bg-transparent shadow-none"
          : colorRecipe === "default"
            ? "bg-service-surface shadow-service"
            : colorRecipe === "accent"
              ? "bg-bg-dark shadow-service"
              : "bg-surface-raised shadow-service",
      )}
      ref={boxRef}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <p
        className={cx(
          "type-label",
          colorRecipe === "accent" && cardFill === "solid"
            ? "text-white"
            : colorRecipe === "accent"
              ? "text-[var(--live-accent-ink)]"
            : "text-service-accent",
        )}
      >
        {label}
      </p>
      <ul
        className={cx(
          "mt-6 grid list-disc gap-4 pl-6",
          colorRecipe === "accent" && cardFill === "solid"
            ? "marker:text-white"
            : colorRecipe === "accent"
              ? "marker:text-[var(--live-accent-ink)]"
            : "marker:text-service-accent",
        )}
      >
        {ideas.map((idea) => (
          <li
            className={cx(
              "type-heading-sm",
              "pl-1",
              colorRecipe === "accent" && cardFill === "solid"
                ? "text-white"
                : "text-service-ink",
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
  cardBorder = "on",
  cardFill = "solid",
  colorRecipe = "default",
  eyebrow,
  ideasLabel = "What matters",
  title,
  paragraphs,
  ideas,
}: ContentStickyIdeasSectionV2Props) {
  return (
    <section className="bg-transparent">
      <SevenColumnGrid minHeight="none">
        <SevenColumnGridItem
          className="col-span-5 max-lg:col-span-7"
          alignY="middle"
        >
          <div className="fluid-type-frame">
            <p
              className={cx(
                "type-label",
                colorRecipe === "accent"
                  ? "text-[var(--live-accent-ink)]"
                  : "text-service-accent",
              )}
            >
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
          <ImportantIdeasBoxV2
            cardBorder={cardBorder}
            cardFill={cardFill}
            colorRecipe={colorRecipe}
            ideas={ideas}
            label={ideasLabel}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
