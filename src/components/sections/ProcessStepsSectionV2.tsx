
type ProcessStep = {
  title: string;
  body: string;
};

type ProcessStepsSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  steps: ProcessStep[];
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ProcessStepsSectionV2({
  eyebrow,
  title,
  body,
  steps,
}: ProcessStepsSectionV2Props) {
  return (
    <section className="section-space-med bg-service-surface">
      <div className="container-site">
        <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] items-start layout-gap-lrg max-lg:grid-cols-1">
          <div className="fluid-type-frame">
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
            <h2
              className={cx(
                "type-heading-xl",
                "mt-eyebrow-heading-lg text-service-ink",
              )}
            >
              {title}
            </h2>
            <p
              className={cx(
                "type-text-lg",
                "measure-copy",
                "wrap-pretty",
                "mt-heading-body-lg text-service-muted",
              )}
            >
              {body}
            </p>
          </div>

          <ol className="grid card-grid-gap-med">
            {steps.map((step, index) => (
              <li
                className={cx(
                  "fluid-type-frame",
                  "grid grid-cols-[auto_minmax(0,1fr)] items-center layout-gap-med bg-transparent py-7 text-service-ink max-md:grid-cols-1 max-md:items-start",
                  index === steps.length - 1
                    ? undefined
                    : "border-b border-service-border",
                )}
                key={step.title}
              >
                <div
                  className={cx(
                    "flex h-12 min-w-12 items-center justify-center text-sm font-semibold text-service-ink",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="pl-4 max-md:pl-0 max-md:pt-4">
                  <h3 className="type-heading-md text-service-ink">
                    {step.title}
                  </h3>
                  <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
