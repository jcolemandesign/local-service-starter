
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
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site">
        <div className={cx("mx-auto text-center", "fluid-type-frame")}>
          <p className={cx("type-label", "text-service-accent")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              "type-heading-xl",
              "measure-heading-wide",
              "wrap-balance",
              "mx-auto mt-5 text-service-ink",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              "type-text-lg",
              "measure-copy",
              "wrap-pretty",
              "mx-auto mt-6 text-service-muted",
            )}
          >
            {body}
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-3 items-stretch gap-6 max-md:grid-cols-1">
          {steps.map((step, index) => (
            <li
              className={cx(
                "fluid-type-frame",
                "radius-medium",
                "h-full border border-service-border bg-white p-7 shadow-service",
              )}
              key={step.title}
            >
              <div
                className={cx(
                  "radius-4",
                  "mb-8 flex h-12 w-12 items-center justify-center bg-service-ink text-sm font-semibold text-white",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3
                className={cx(
                  "type-heading-sm",
                  "measure-heading-wide",
                  "wrap-balance",
                  "text-service-ink",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cx(
                  "type-text-md",
                  "measure-copy",
                  "wrap-pretty",
                  "mt-4 text-service-muted",
                )}
              >
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
