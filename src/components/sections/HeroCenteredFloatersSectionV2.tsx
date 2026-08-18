import type { CSSProperties } from "react";

import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";
import { HeroCenteredFloatersParallax } from "./HeroCenteredFloatersParallax";

type HeroCenteredFloatersSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  headingLevel?: 1 | 2;
};

export function HeroCenteredFloatersSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  headingLevel = 1,
}: HeroCenteredFloatersSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="relative overflow-hidden bg-service-surface text-service-ink">
      <SevenColumnGrid className="section-min-sliver">
        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-2 max-lg:hidden"
        >
          <HeroCenteredFloatersParallax side="left" />
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="center"
          alignY="middle"
          className="col-span-3 col-start-3 max-lg:col-span-7 max-lg:col-start-1"
        >
          {/* THE COPY COLUMN IS MARKED AND THE FLOATERS ARE NOT, which is the
              whole shape of this section's place on the axis.

              `HeroCenteredFloatersParallax` drives the two flanking columns from
              a scroll listener through motion/react, and a section that
              animates itself on scroll is normally excluded outright. The rule
              is about elements that would FIGHT, though, and these would not:
              the parallax is on the floaters, this entrance is on the centre
              column, and a load entrance has finished before the reader has
              scrolled at all. Nothing here animates an element the parallax
              also animates - which is exactly why the floaters carry no marker
              and must not gain one.

              The mobile-only blocks below are the floaters' stand-in and are
              unmarked for the same reason, plus a second: they are drawn
              placeholders with no picture in them. */}
          <div className="fluid-type-frame measure-copy flex w-full flex-col items-center text-center">
            <div
              className="reveal-on-scroll reveal-role-heading"
              style={{ "--reveal-index": 0 } as CSSProperties}
            >
              <p className="type-label text-service-accent">{eyebrow}</p>
              <HeadingTag className="type-display-lg mt-eyebrow-display text-service-ink">
                {title}
              </HeadingTag>
            </div>
            <div
              className="reveal-on-scroll reveal-role-content"
              style={{ "--reveal-index": 1 } as CSSProperties}
            >
              <p className="type-text-lg wrap-pretty mt-display-body text-service-muted">
                {body}
              </p>
              <div className="mt-body-actions-md flex flex-wrap justify-center gap-3">
                <RequestServiceButton>{primaryAction}</RequestServiceButton>
                <Button href="#services" variant="secondary">
                  {secondaryAction}
                </Button>
              </div>
            </div>
          </div>
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-2 col-start-6 max-lg:hidden"
        >
          <HeroCenteredFloatersParallax side="right" />
        </SevenColumnGridItem>

        <div className="col-span-7 hidden grid-cols-2 gap-3 max-lg:grid">
          <div className="radius-medium aspect-[4/3] bg-zinc-200" />
          <div className="radius-medium aspect-[4/3] bg-zinc-300" />
        </div>
      </SevenColumnGrid>
    </section>
  );
}
