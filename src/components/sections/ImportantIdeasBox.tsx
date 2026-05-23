"use client";

import { useEffect, useRef, useState } from "react";

type ImportantIdeasBoxProps = {
  ideas: string[];
};

const desktopQuery = "(min-width: 1024px)";
const maxOffset = 460;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function ImportantIdeasBox({ ideas }: ImportantIdeasBoxProps) {
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
      className="rounded-lg border border-service-border bg-white p-7 shadow-service will-change-transform max-lg:will-change-auto"
      ref={boxRef}
      style={{ transform: `translate3d(0, ${offset}px, 0)` }}
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
        Important ideas
      </p>
      <ul className="mt-6 grid gap-4">
        {ideas.map((idea) => (
          <li
            className="border-l border-service-border pl-4 text-lg font-semibold leading-7 text-service-ink"
            key={idea}
          >
            {idea}
          </li>
        ))}
      </ul>
    </div>
  );
}
