"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { Container } from "@/components/primitives";

type ScrollServiceItem = {
  title: string;
  imageLabel: string;
};

type ServicesScrollCardsSectionProps = {
  eyebrow: string;
  title: string;
  items: ScrollServiceItem[];
  viewAllLabel: string;
};

function ArrowMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex items-center justify-center rounded-full border border-service-border bg-white text-service-accent transition-colors group-hover/service-card:border-service-accent group-hover/service-card:bg-service-accent group-hover/service-card:text-white ${className}`}
    >
      -&gt;
    </span>
  );
}

function ServiceImage({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-0 flex-1 overflow-hidden rounded-b-lg bg-service-border"
    >
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-6 border border-white/45" />
      <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-white/60 bg-white/25 text-xs font-semibold uppercase text-service-muted backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

function ServiceScrollCard({ item }: { item: ScrollServiceItem }) {
  return (
    <article className="group/service-card flex h-[68svh] w-[min(34vw,430px)] shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-service-border bg-white shadow-service transition-transform duration-300 ease-out hover:-translate-y-2 max-lg:h-auto max-lg:min-h-[520px] max-lg:w-full">
      <div className="flex min-h-28 items-center justify-between gap-8 px-7 py-6">
        <h3 className="text-3xl font-semibold leading-tight text-service-ink max-md:text-2xl">
          {item.title}
        </h3>
        <ArrowMark className="size-12 shrink-0 text-xl" />
      </div>
      <ServiceImage label={item.imageLabel} />
    </article>
  );
}

function ViewAllCard({ label }: { label: string }) {
  return (
    <a
      className="group/service-card flex h-[68svh] w-[min(34vw,430px)] shrink-0 cursor-pointer flex-col rounded-lg border border-service-border bg-service-ink p-8 text-white shadow-service transition-transform duration-300 ease-out hover:-translate-y-2 max-lg:h-auto max-lg:min-h-[360px] max-lg:w-full"
      href="#services"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
          Services
        </p>
        <h3 className="mt-5 text-4xl font-semibold leading-tight max-md:text-3xl">
          {label}
        </h3>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span
          aria-hidden="true"
          className="flex size-40 items-center justify-center rounded-full bg-white text-7xl leading-none text-black transition-transform duration-300 ease-out group-hover/service-card:scale-105 max-md:size-32 max-md:text-6xl"
        >
          -&gt;
        </span>
      </div>
    </a>
  );
}

export function ServicesScrollCardsSection({
  eyebrow,
  title,
  items,
  viewAllLabel,
}: ServicesScrollCardsSectionProps) {
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
    <section ref={sectionRef} className="relative min-h-[240svh] bg-service-surface max-lg:min-h-0">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden py-16 max-lg:static max-lg:min-h-0 max-lg:overflow-visible">
        <div className="w-full">
          <Container>
            <div className="max-w-4xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-service-accent">
                {eyebrow}
              </p>
              <h2 className="text-fluid-heading font-semibold leading-heading text-service-ink">
                {title}
              </h2>
            </div>
          </Container>

          <div
            className="mt-14 overflow-hidden max-lg:overflow-visible"
            ref={railViewportRef}
          >
            <Container className="max-lg:grid max-lg:gap-4">
              <motion.div
                ref={railRef}
                className="flex w-max gap-4 will-change-transform max-lg:w-full max-lg:flex-col max-lg:![transform:none]"
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
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}
