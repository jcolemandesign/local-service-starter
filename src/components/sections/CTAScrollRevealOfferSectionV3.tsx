"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type CTAScrollRevealOfferSectionV3Props = {
  action: string;
  closeBody: string;
  closeEyebrow: string;
  closeTitle: string;
  introBody: string;
  introEyebrow: string;
  introTitle: string;
  offerBody: string;
  offerDetail: string;
  offerEyebrow: string;
  offerTitle: string;
};

function OfferBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-service-ink"
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(31_122_90_/_0.42),rgb(23_33_29_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.16)_0_1px,transparent_1px_24px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgb(255_255_255_/_0.2),transparent_30%),radial-gradient(circle_at_14%_92%,rgb(196_90_44_/_0.28),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(128deg,rgb(0_0_0_/_0.78),rgb(0_0_0_/_0.34)_38%,rgb(0_0_0_/_0.06)_68%)]" />
      <div className="absolute -left-24 -top-24 size-[38rem] rounded-full bg-black/42 blur-3xl" />
    </div>
  );
}

export function CTAScrollRevealOfferSectionV3({
  action,
  closeBody,
  closeEyebrow,
  closeTitle,
  introBody,
  introEyebrow,
  introTitle,
  offerBody,
  offerDetail,
  offerEyebrow,
  offerTitle,
}: CTAScrollRevealOfferSectionV3Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const offerY = useTransform(scrollYProgress, [0.32, 0.72], [0, -140]);

  return (
    <section
      className="relative min-h-[260svh] bg-service-surface"
      ref={sectionRef}
    >
      <div className="sticky top-0 min-h-svh overflow-hidden text-white">
        <OfferBackground />
        <SevenColumnGrid className="relative z-10 min-h-svh" padding="med">
          <SevenColumnGridItem
            alignY="middle"
            className="col-span-4 max-lg:col-span-7"
          >
            <motion.div
              className="fluid-type-frame w-full min-w-0"
              style={{ y: shouldReduceMotion ? 0 : offerY }}
            >
              <p className="type-label text-white/68">{offerEyebrow}</p>
              <h2 className="type-display-lg mt-eyebrow-display text-white">
                {offerTitle}
              </h2>
              <p className="type-text-xl wrap-pretty mt-display-body text-white/78">
                {offerBody}
              </p>
              <div className="mt-body-actions-lg flex flex-wrap items-center gap-4">
                <RequestServiceButton
                  className="border-white bg-white text-service-ink hover:bg-service-surface"
                  variant="secondary"
                >
                  {action}
                </RequestServiceButton>
                <p className="type-caption max-w-xs text-white/64">
                  {offerDetail}
                </p>
              </div>
            </motion.div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </div>

      <div className="pointer-events-none relative z-10 -mt-[100svh]">
        <div className="min-h-[82svh] bg-service-surface shadow-[0_36px_100px_rgb(23_33_29_/_0.2)]">
          <SevenColumnGrid className="min-h-[82svh]" padding="med">
            <SevenColumnGridItem
              alignY="middle"
              className="col-span-4 max-lg:col-span-7"
            >
              <div className="fluid-type-frame w-full min-w-0">
                <p className="type-label text-service-accent">
                  {introEyebrow}
                </p>
                <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                  {introTitle}
                </h3>
                <p className="type-text-xl wrap-pretty mt-display-body text-service-muted">
                  {introBody}
                </p>
              </div>
            </SevenColumnGridItem>
          </SevenColumnGrid>
        </div>

        <div aria-hidden="true" className="min-h-[78svh]" />

        <div className="min-h-svh bg-white shadow-[0_-36px_110px_rgb(23_33_29_/_0.22)]">
          <SevenColumnGrid className="min-h-svh" padding="med">
            <SevenColumnGridItem
              alignY="middle"
              className="col-span-3 max-lg:col-span-7"
            >
              <div className="fluid-type-frame w-full min-w-0">
                <p className="type-label text-service-accent">
                  {closeEyebrow}
                </p>
                <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                  {closeTitle}
                </h3>
              </div>
            </SevenColumnGridItem>

            <SevenColumnGridItem
              alignY="middle"
              className="col-span-4 col-start-4 max-lg:col-span-7 max-lg:col-start-1"
            >
              <div className="content-padding radius-large border border-service-border bg-service-surface shadow-service">
                <p className="type-text-xl wrap-pretty text-service-muted">
                  {closeBody}
                </p>
              </div>
            </SevenColumnGridItem>
          </SevenColumnGrid>
        </div>
      </div>
    </section>
  );
}
