import styles from "./section-v2-type.module.css";

type ContentSplitHeadlineImageSectionV2Props = {
  headlineTop: string;
  headlineBottom: string;
  imageLabel: string;
  body: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TexturedImage({ label }: { label: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className={cx(
        styles["radius-medium"],
        "relative mx-auto aspect-square w-[clamp(13rem,24vw,22rem)] overflow-hidden border border-service-border bg-service-surface shadow-service max-md:w-full max-md:max-w-80",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.52),transparent_28%),radial-gradient(circle_at_76%_32%,rgba(31,122,90,0.12),transparent_24%),radial-gradient(circle_at_48%_82%,rgba(23,33,29,0.12),transparent_30%),linear-gradient(135deg,#edf3eb,#dfe7e1_45%,#f4f7f3)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,33,29,0.06)_1px,transparent_1px),linear-gradient(180deg,rgba(23,33,29,0.05)_1px,transparent_1px)] bg-[size:22px_22px] opacity-45" />
    </div>
  );
}

export function ContentSplitHeadlineImageSectionV2({
  headlineTop,
  headlineBottom,
  imageLabel,
  body,
}: ContentSplitHeadlineImageSectionV2Props) {
  return (
    <section className="bg-service-surface py-24 max-lg:py-20 max-md:py-16">
      <div className="mx-auto w-full max-w-[1600px] px-12 max-lg:px-8 max-md:px-6">
        <div
          className={cx(
            styles["fluid-type-frame"],
            styles["radius-medium"],
            "grid gap-10 bg-white p-12 max-lg:p-8 max-md:p-6",
          )}
        >
          <h2
            className={cx(
              styles["fluid-display-lg"],
              styles["wrap-balance"],
              "grid justify-items-center gap-7 text-center text-service-ink max-md:gap-5",
            )}
          >
            <span>{headlineTop}</span>
            <TexturedImage label={imageLabel} />
            <span>{headlineBottom}</span>
          </h2>

          <p
            className={cx(
              styles["fluid-text-xl"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "mx-auto text-center text-service-muted",
            )}
          >
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
