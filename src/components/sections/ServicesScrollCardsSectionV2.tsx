"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

type ScrollServiceItem = {
  title: string;
  imageLabel: string;
};

type ServicesScrollCardsSectionV2Props = {
  eyebrow: string;
  title: string;
  items: ScrollServiceItem[];
  viewAllLabel: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function ArrowMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "flex items-center justify-center rounded-full border border-service-border bg-bg-page text-service-accent transition-colors group-hover/service-card:border-service-accent group-hover/service-card:bg-service-accent group-hover/service-card:text-white",
        className,
      )}
    >
      -&gt;
    </span>
  );
}

function ServiceImage() {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-service-border"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.24),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

function ServiceScrollCard({ item }: { item: ScrollServiceItem }) {
  return (
    <article
      className={cx(
        "fluid-type-frame",
        "radius-medium",
        "group/service-card flex w-[min(39vw,495px)] shrink-0 cursor-pointer flex-col overflow-hidden border border-service-border bg-bg-page shadow-service transition-transform duration-300 ease-out hover:-translate-y-2 max-lg:w-full",
      )}
    >
      <div className="flex min-h-28 items-center justify-between gap-8 px-7 py-6">
        <h3
          className={cx(
            "type-heading-md",
            "text-service-ink",
          )}
        >
          {item.title}
        </h3>
        <ArrowMark className="size-12 shrink-0 text-xl" />
      </div>
      <ServiceImage />
    </article>
  );
}

function ViewAllCard({ label }: { label: string }) {
  return (
    <a
      className={cx(
        "fluid-type-frame",
        "radius-medium",
        "group/service-card flex h-[68svh] w-[min(39vw,495px)] shrink-0 cursor-pointer flex-col border border-service-border bg-service-ink p-8 text-white shadow-service transition-transform duration-300 ease-out hover:-translate-y-2 max-lg:h-auto max-lg:min-h-[360px] max-lg:w-full",
      )}
      href="#services"
    >
      <div>
        <p className={cx("type-label", "text-white/60")}>Services</p>
        <h3
          className={cx(
            "type-heading-lg",
            "mt-5 text-white",
          )}
        >
          {label}
        </h3>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span
          aria-hidden="true"
          className="flex size-40 items-center justify-center rounded-full bg-bg-page text-7xl leading-none text-service-ink transition-transform duration-300 ease-out group-hover/service-card:scale-105 max-md:size-32 max-md:text-6xl"
        >
          -&gt;
        </span>
      </div>
    </a>
  );
}

export function ServicesScrollCardsSectionV2({
  eyebrow,
  title,
  items,
  viewAllLabel,
}: ServicesScrollCardsSectionV2Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railViewportRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [railMotion, setRailMotion] = useState({ startX: 48, endX: 0 });
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 0.16, 0.92, 1],
    shouldReduceMotion
      ? [0, 0, 0, 0]
      : [
          railMotion.startX,
          railMotion.startX,
          railMotion.endX,
          railMotion.endX,
        ],
  );

  useLayoutEffect(() => {
    const railViewport = railViewportRef.current;
    const rail = railRef.current;

    if (!railViewport || !rail) {
      return;
    }

    let animationFrame = 0;

    const updateRailBounds = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const originalTransform = rail.style.transform;
        rail.style.transform = "none";

        const railRect = rail.getBoundingClientRect();
        const railViewportRect = railViewport.getBoundingClientRect();
        const viewportWidth = railViewportRect.width;
        const edgePadding = Math.min(88, Math.max(40, viewportWidth * 0.06));
        const startX = 48;
        const endX =
          railRect.width <= viewportWidth - edgePadding
            ? 0
            : railViewportRect.right - edgePadding - railRect.right;

        rail.style.transform = originalTransform;

        const nextMotion = {
          endX: Math.round(endX),
          startX,
        };

        setRailMotion((currentMotion) => {
          if (
            currentMotion.endX === nextMotion.endX &&
            currentMotion.startX === nextMotion.startX
          ) {
            return currentMotion;
          }

          return nextMotion;
        });
      });
    };

    updateRailBounds();

    const resizeObserver = new ResizeObserver(updateRailBounds);
    resizeObserver.observe(railViewport);
    resizeObserver.observe(rail);
    window.addEventListener("resize", updateRailBounds);
    window.addEventListener("orientationchange", updateRailBounds);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRailBounds);
      window.removeEventListener("orientationchange", updateRailBounds);
    };
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[240svh] bg-service-surface max-lg:min-h-0"
    >
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-16 max-lg:static max-lg:min-h-0 max-lg:overflow-visible">
        <div className="w-full">
          <SevenColumnGrid
            className="px-[var(--site-grid-inset-inline)]"
            frame="none"
            minHeight="none"
          >
            <SevenColumnGridItem
              className="col-span-4 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1"
              measure="copyWide"
            >
              <div className="fluid-type-frame">
                <p className={cx("type-label", "text-service-accent")}>
                  {eyebrow}
                </p>
                <h2
                  className={cx(
                    "type-heading-xl",
                    "mt-5 text-service-ink",
                  )}
                >
                  {title}
                </h2>
              </div>
            </SevenColumnGridItem>
          </SevenColumnGrid>

          <div
            className="mt-14 overflow-hidden max-lg:overflow-visible"
            ref={railViewportRef}
          >
            <div className="px-[var(--site-grid-inset-inline)] max-lg:grid max-lg:gap-4">
              <motion.div
                ref={railRef}
                className="flex w-max items-start gap-4 will-change-transform max-lg:w-full max-lg:flex-col max-lg:![transform:none]"
                style={{ x }}
              >
                <div
                  aria-hidden="true"
                  className="w-[clamp(16rem,32vw,28rem)] shrink-0 max-lg:hidden"
                />
                {items.map((item) => (
                  <ServiceScrollCard item={item} key={item.title} />
                ))}
                <ViewAllCard label={viewAllLabel} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
