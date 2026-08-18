import type { CSSProperties } from "react";

import { Button, LayoutGrid, LayoutGridItem } from "@/components/primitives";

export type ThankYouConfirmationStep = {
  body: string;
  title: string;
};

export type ThankYouConfirmationSectionV3Props = {
  body: string;
  cardBorder?: "on" | "off";
  cardFill?: "solid" | "none";
  eyebrow: string;
  headingLevel?: 1 | 2;
  nextSteps: readonly ThankYouConfirmationStep[];
  nextStepsTitle: string;
  note: string;
  primaryActionHref: string;
  primaryActionLabel: string;
  secondaryActionHref?: string;
  secondaryActionLabel?: string;
  title: string;
};

export function ThankYouConfirmationSectionV3({
  body,
  cardBorder = "on",
  cardFill = "solid",
  eyebrow,
  headingLevel = 1,
  nextSteps,
  nextStepsTitle,
  note,
  primaryActionHref,
  primaryActionLabel,
  secondaryActionHref,
  secondaryActionLabel,
  title,
}: ThankYouConfirmationSectionV3Props) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section className="bg-bg-page">
      <LayoutGrid
        className="content-center items-center"
        columns={14}
        minHeight="tall"
        padding="med"
      >
        <LayoutGridItem
          alignX="left"
          alignY="middle"
          className="col-span-6 col-start-1 max-lg:col-span-10 max-md:col-span-6 max-sm:col-span-2"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            {/* The tick is an `accent` unit rather than part of the heading below
                it: a small emphatic figure, which is the role's definition, and
                the one element on this page whose whole job is to say the thing
                worked. Wipe scales it up from 94% while everything else fades,
                which is the arrival this page wants. */}
            <span
              aria-hidden="true"
              className="reveal-on-scroll reveal-role-accent flex size-14 items-center justify-center rounded-full border border-service-accent/35 bg-service-accent/10 type-heading-sm text-service-accent"
              style={{ "--reveal-index": 0 } as CSSProperties}
            >
              &#10003;
            </span>
            <div
              className="reveal-on-scroll reveal-role-heading"
              style={{ "--reveal-index": 1 } as CSSProperties}
            >
              <p className="type-label mt-body-actions-sm text-service-accent">
                {eyebrow}
              </p>
              <Heading className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
                {title}
              </Heading>
            </div>
            <div
              className="reveal-on-scroll reveal-role-content"
              style={{ "--reveal-index": 2 } as CSSProperties}
            >
            <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
              {body}
            </p>

            <div className="mt-body-actions-lg flex flex-wrap items-center inline-gap-sml">
              <Button href={primaryActionHref}>{primaryActionLabel}</Button>
              {secondaryActionHref && secondaryActionLabel ? (
                <Button href={secondaryActionHref} variant="secondary">
                  {secondaryActionLabel}
                </Button>
              ) : null}
            </div>
            </div>
          </div>
        </LayoutGridItem>

        <LayoutGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-6 col-start-8 max-lg:col-span-10 max-lg:col-start-1 max-md:col-span-6 max-sm:col-span-2"
        >
          {/* `frame`, not a list of cards: the label, the numbered steps and the
              note sit inside one border joined by a divider, so staggering the
              steps would walk them out from under the panel that contains them
              - the composite-card rule the Decision family settled. */}
          <aside
          className={[
            "reveal-on-scroll reveal-role-frame",
            "content-padding radius-medium border border-service-border bg-service-surface shadow-service",
            cardFill === "none" && "!bg-transparent !shadow-none",
            cardBorder === "off" && "!border-transparent",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ "--reveal-index": 3 } as CSSProperties}
        >
            <p className="type-label text-service-accent">{nextStepsTitle}</p>
            <ol className="mt-body-actions-md grid card-grid-gap-sml">
              {nextSteps.map((step, index) => (
                <li className="flex items-start gap-4" key={step.title}>
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-service-border bg-bg-page type-label text-service-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-text-lg font-semibold text-service-ink">
                      {step.title}
                    </h3>
                    <p className="type-text-sm wrap-pretty mt-2 text-service-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="type-text-sm mt-body-actions-md border-t border-service-border pt-5 text-service-muted">
              {note}
            </p>
          </aside>
        </LayoutGridItem>
      </LayoutGrid>
    </section>
  );
}
