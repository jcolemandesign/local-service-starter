
type ContentPositioningSplitSectionV2Props = {
  title: string;
  body: string;
  action: string;
  imageLabel: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PositioningImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className={cx(
        "radius-medium",
        "relative h-full min-h-0 overflow-hidden bg-service-border",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.28),rgb(23_33_29_/_0.05)),linear-gradient(45deg,rgb(255_255_255_/_0.2)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function ContentPositioningSplitSectionV2({
  title,
  body,
  action,
  imageLabel,
}: ContentPositioningSplitSectionV2Props) {
  return (
    <section className="bg-white py-24 max-lg:py-20 max-md:py-16">
      <div className="container-site">
        <div
          className={cx(
            "radius-medium",
            "grid min-h-[70svh] grid-cols-2 overflow-hidden bg-service-surface max-lg:grid-cols-1",
          )}
        >
          <div
            className={cx(
              "fluid-type-frame",
              "flex min-h-0 flex-col justify-between p-12 pb-20 pr-0 max-lg:min-h-[48svh] max-lg:p-8 max-lg:pb-14 max-md:p-6 max-md:pb-12",
            )}
          >
            <h2
              className={cx(
                "type-display-lg",
                "measure-heading-wide",
                "wrap-balance",
                "text-service-ink",
              )}
            >
              {title}
            </h2>

            <div>
              <p
                className={cx(
                  "type-text-xl",
                  "measure-copy",
                  "wrap-pretty",
                  "text-service-muted",
                )}
              >
                {body}
              </p>

              <a
                className={cx(
                  "radius-medium",
                  "mt-10 inline-flex min-h-12 w-fit cursor-pointer items-center justify-center whitespace-nowrap border border-service-ink bg-transparent px-6 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent",
                )}
                href="#about"
              >
                {action}
              </a>
            </div>
          </div>

          <div className="min-h-0 p-12 max-lg:min-h-[44svh] max-lg:pt-0 max-md:p-6 max-md:pt-0">
            <PositioningImage label={imageLabel} />
          </div>
        </div>
      </div>
    </section>
  );
}
