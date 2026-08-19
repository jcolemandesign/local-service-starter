"use client";

import { useEffect, useRef, useState } from "react";

import { resolveScrollRoot, scrollRootBox } from "@/utils/scroll-root";
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

  /**
   * THE SCROLLER THIS PANEL MOVES AGAINST, which is not always the window.
   *
   * Resolved once, because a section does not change scroller while it is
   * mounted. `null` means the viewport, which is every real page - see
   * `@/utils/scroll-root` for why the builder is the exception and why it has to
   * be marked rather than sniffed.
   */
  useEffect(() => {
    const media = window.matchMedia(desktopQuery);
    const scroller = resolveScrollRoot(boxRef.current);

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
      /**
       * The travel is measured against the SCROLLER'S box, not the browser's.
       *
       * `getBoundingClientRect` is in client coordinates either way, so the
       * scroller's own top has to come off the section's - inside the canvas
       * the section's `top` is measured from the browser, and the distance that
       * matters is from the canvas's top edge. On a real page the scroller's
       * top is 0 and this is the expression it always was.
       */
      const view = scrollRootBox(scroller);
      const scrollRange = sectionRect.height + view.height;
      const progress = clamp(
        (view.bottom - sectionRect.top) / scrollRange,
        0,
        1,
      );
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
    /**
     * LISTENED FOR ON THE SCROLLER, and this is the half that was actually
     * broken. A scroll event from an ELEMENT does not reach the window - only
     * the document scroller's does - so in the builder this handler fired once
     * at mount and never again, and the panel froze at whatever offset the
     * section happened to have when it appeared. It read as a calculation bug
     * and it was a missing event.
     */
    const scrollTarget: EventTarget = scroller ?? window;

    scrollTarget.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    media.addEventListener("change", requestUpdate);

    return () => {
      scrollTarget.removeEventListener("scroll", requestUpdate);
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
          : "bg-service-surface shadow-service",
      )}
      ref={boxRef}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <p
        className={cx(
          "type-label",
          "text-service-accent",
        )}
      >
        {label}
      </p>
      <ul
        className={cx(
          "mt-6 grid list-disc gap-4 pl-6",
          "marker:text-service-accent",
        )}
      >
        {ideas.map((idea) => (
          <li
            className={cx(
              "type-heading-sm",
              "pl-1",
              "text-service-ink",
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
  colorRecipe = "page",
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
                "text-service-accent",
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
