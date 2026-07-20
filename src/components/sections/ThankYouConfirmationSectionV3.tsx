import { Button, SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";

export type ThankYouConfirmationStep = {
  body: string;
  title: string;
};

export type ThankYouConfirmationSectionV3Props = {
  body: string;
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
      <SevenColumnGrid
        className="items-center"
        minHeight="tall"
        padding="med"
      >
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className="col-span-4 max-lg:col-span-5 max-md:col-span-3"
          measure="copyWide"
        >
          <div className="fluid-type-frame">
            <span
              aria-hidden="true"
              className="flex size-14 items-center justify-center rounded-full border border-service-accent/35 bg-service-accent/10 type-heading-sm text-service-accent"
            >
              &#10003;
            </span>
            <p className="type-label mt-body-actions-sm text-service-accent">
              {eyebrow}
            </p>
            <Heading className="type-heading-xl mt-eyebrow-heading-lg text-service-ink">
              {title}
            </Heading>
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
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-3 col-start-5 max-lg:col-span-5 max-lg:col-start-1 max-md:col-span-3"
        >
          <aside className="content-padding radius-medium border border-service-border bg-service-surface shadow-service">
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
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
