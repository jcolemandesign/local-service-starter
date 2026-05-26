
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
                "measure-heading-wide",
                "wrap-balance",
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

          <ol className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] grid-rows-2 items-stretch card-grid-gap-lrg max-md:grid-cols-1 max-md:grid-rows-none">
            {steps.map((step, index) => (
              <li
                className={cx(
                  "fluid-type-frame",
                  "radius-medium",
                  index === 0
                    ? "row-span-2 min-h-[28rem] border border-service-ink bg-service-ink p-8 text-white shadow-service max-md:min-h-0"
                    : "border border-service-border bg-white p-7 text-service-ink shadow-service",
                )}
                key={step.title}
              >
                <div
                  className={cx(
                    "radius-4",
                    index === 0
                      ? "mb-10 flex h-14 w-14 items-center justify-center bg-white text-sm font-semibold text-service-ink"
                      : "mb-8 flex h-12 w-12 items-center justify-center bg-service-ink text-sm font-semibold text-white",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3
                  className={cx(
                    index === 0 ? "type-heading-md" : "type-heading-sm",
                    index === 0 ? "measure-heading" : "measure-heading-wide",
                    "wrap-balance",
                    index === 0 ? "text-white" : "text-service-ink",
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cx(
                    index === 0 ? "type-text-lg" : "type-text-md",
                    "measure-copy",
                    "wrap-pretty",
                    index === 0
                      ? "mt-heading-body-md text-white/72"
                      : "mt-heading-body-md text-service-muted",
                  )}
                >
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
