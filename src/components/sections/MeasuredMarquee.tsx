"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type MeasuredMarqueeProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
};

export function MeasuredMarquee({
  children,
  className = "",
  speed = 64,
}: MeasuredMarqueeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const [metrics, setMetrics] = useState({
    copies: 4,
    duration: 44,
    setWidth: 0,
  });

  useEffect(() => {
    const updateMetrics = () => {
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      const setWidth = firstSetRef.current?.scrollWidth ?? 0;

      if (!containerWidth || !setWidth) {
        return;
      }

      setMetrics({
        copies: Math.max(2, Math.ceil(containerWidth / setWidth) + 2),
        duration: Math.max(18, setWidth / speed),
        setWidth,
      });
    };

    updateMetrics();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateMetrics);

      return () => window.removeEventListener("resize", updateMetrics);
    }

    const observer = new ResizeObserver(updateMetrics);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (firstSetRef.current) {
      observer.observe(firstSetRef.current);
    }

    return () => observer.disconnect();
  }, [speed]);

  const style = {
    "--trust-marquee-distance": `${metrics.setWidth}px`,
    "--trust-marquee-duration": `${metrics.duration}s`,
  } as CSSProperties;

  return (
    <div className={className} ref={containerRef}>
      <div
        className="trust-marquee-track flex w-max motion-reduce:animate-none"
        data-ready={metrics.setWidth > 0 ? "true" : "false"}
        style={style}
      >
        {Array.from({ length: metrics.copies }).map((_, index) => (
          <div
            aria-hidden={index === 0 ? undefined : "true"}
            className="shrink-0"
            key={index}
            ref={index === 0 ? firstSetRef : undefined}
          >
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
