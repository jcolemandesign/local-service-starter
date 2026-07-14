"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { RequestServiceButton } from "@/components/request-service";

type CTAScrollRevealOfferSectionV2Props = {
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  offerEyebrow: string;
  offerTitle: string;
  offerBody: string;
  offerDetail: string;
  action: string;
  closeEyebrow: string;
  closeTitle: string;
  closeBody: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function OfferBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-bg-dark" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgb(31_122_90_/_0.42),rgb(23_33_29_/_0.06)),linear-gradient(45deg,rgb(255_255_255_/_0.16)_0_1px,transparent_1px_24px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_10%,rgb(255_255_255_/_0.2),transparent_30%),radial-gradient(circle_at_14%_92%,rgb(196_90_44_/_0.28),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(128deg,rgb(0_0_0_/_0.78),rgb(0_0_0_/_0.34)_38%,rgb(0_0_0_/_0.06)_68%)]" />
      <div className="absolute -left-24 -top-24 size-[38rem] rounded-full bg-bg-dark/42 blur-3xl" />
    </div>
  );
}

export function CTAScrollRevealOfferSectionV2({
  introEyebrow,
  introTitle,
  introBody,
  offerEyebrow,
  offerTitle,
  offerBody,
  offerDetail,
  action,
  closeEyebrow,
  closeTitle,
  closeBody,
}: CTAScrollRevealOfferSectionV2Props) {
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
      <div className="sticky top-0 min-h-svh overflow-hidden text-text-inverse">
        <OfferBackground />
        <div className="container-site relative z-10 flex min-h-svh items-center py-24 max-md:py-16">
          <motion.div
            className="fluid-type-frame w-full min-w-0 max-w-3xl"
            style={{ y: shouldReduceMotion ? 0 : offerY }}
          >
            <p className="type-label text-text-inverse/68">{offerEyebrow}</p>
            <h2 className="type-display-lg mt-eyebrow-display text-text-inverse">
              {offerTitle}
            </h2>
            <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-text-inverse/78">
              {offerBody}
            </p>
            <div className="mt-body-actions-lg flex flex-wrap items-center gap-4">
              <RequestServiceButton
                className="border-bg-page bg-bg-page text-service-ink hover:bg-service-surface"
                variant="secondary"
              >
                {action}
              </RequestServiceButton>
              <p className="type-caption max-w-xs text-text-inverse/64">
                {offerDetail}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 -mt-[100svh]">
        <div className="min-h-[82svh] bg-service-surface shadow-[0_36px_100px_rgb(23_33_29_/_0.2)]">
          <div className="container-site flex min-h-[82svh] items-center py-24 max-md:py-16">
            <div className="fluid-type-frame w-full min-w-0 max-w-4xl">
              <p className="type-label text-service-accent">{introEyebrow}</p>
              <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {introTitle}
              </h3>
              <p className="type-text-xl measure-lead wrap-pretty mt-display-body text-service-muted">
                {introBody}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-[78svh]" aria-hidden="true" />

        <div className="min-h-svh bg-bg-page shadow-[0_-36px_110px_rgb(23_33_29_/_0.22)]">
          <div className="container-site grid min-h-svh grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center layout-gap-xlrg py-24 max-lg:grid-cols-1 max-md:py-16">
            <div className="fluid-type-frame w-full min-w-0">
              <p className="type-label text-service-accent">{closeEyebrow}</p>
              <h3 className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {closeTitle}
              </h3>
            </div>
            <div
              className={cx(
                "radius-large",
                "border border-service-border bg-service-surface p-8 shadow-service max-md:p-6",
              )}
            >
              <p className="type-text-xl measure-lead wrap-pretty text-service-muted">
                {closeBody}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
