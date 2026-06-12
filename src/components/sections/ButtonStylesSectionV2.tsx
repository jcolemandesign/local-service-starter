import {
  ExpandingArrowButton,
  TextLiftButton,
  WrappingArrowButton,
} from "@/components/primitives";

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function ButtonStylesSectionV2() {
  return (
    <section className="section-space-med bg-white">
      <div className="container-site">
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-5 max-lg:grid-cols-1">
          <div
            className={cx(
              "fluid-type-frame",
              "radius-medium border border-service-border bg-service-surface p-8 shadow-service max-md:p-6",
            )}
          >
            <p className="type-label text-service-accent">Button styles</p>
            <h2 className="type-heading-lg mt-eyebrow-heading-md text-service-ink">
              Custom CTA treatments
            </h2>
            <p className="type-text-md measure-copy wrap-pretty mt-heading-body-md text-service-muted">
              Reusable button interaction ideas for primary calls to action,
              now backed by the same shared button primitive as the live preview.
            </p>
          </div>

          <div className="grid gap-5">
            <div
              className={cx(
                "radius-medium",
                "flex min-h-56 items-center justify-center border border-service-border bg-white p-8 shadow-service max-md:min-h-48 max-md:p-6",
              )}
            >
              <ExpandingArrowButton href="#">
                Schedule service
              </ExpandingArrowButton>
            </div>

            <div
              className={cx(
                "radius-medium",
                "flex min-h-56 items-center justify-center border border-service-border bg-white p-8 shadow-service max-md:min-h-48 max-md:p-6",
              )}
            >
              <WrappingArrowButton href="#">Schedule service</WrappingArrowButton>
            </div>

            <div
              className={cx(
                "radius-medium",
                "flex min-h-56 items-center justify-center border border-service-border bg-white p-8 shadow-service max-md:min-h-48 max-md:p-6",
              )}
            >
              <TextLiftButton href="#">Book a visit</TextLiftButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
