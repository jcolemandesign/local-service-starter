import { RequestServiceButton } from "@/components/request-service";
import styles from "./section-v2-type.module.css";

type CTAFullscreenSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function PlaceholderBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-service-border" aria-hidden="true">
      <div className="absolute inset-0 bg-service-muted/10" />
      <div className="absolute inset-x-0 top-1/2 rotate-12 border-t border-white/45" />
      <div className="absolute inset-x-0 top-1/2 -rotate-12 border-t border-white/45" />
      <div className="absolute inset-10 border border-white/45 max-md:inset-6" />
      <div
        className={cx(
          styles["radius-medium"],
          "absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/60 bg-white/25 text-sm font-semibold uppercase text-service-muted backdrop-blur-sm",
        )}
      >
        Image
      </div>
    </div>
  );
}

export function CTAFullscreenSectionV2({
  eyebrow,
  title,
  body,
  action,
}: CTAFullscreenSectionV2Props) {
  return (
    <section className="relative grid min-h-[80svh] overflow-hidden bg-service-ink px-12 py-16 text-white max-md:px-6 max-md:py-12">
      <PlaceholderBackground />
      <div className="absolute inset-0 bg-service-ink/55" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/35 to-service-ink/10"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid h-full w-full max-w-[1600px] grid-rows-[1fr_auto_1fr] items-center">
        <div />

        <div className={cx(styles["fluid-type-frame"], "mx-auto w-full max-w-6xl text-center")}>
          <p className={cx(styles["fluid-label"], "mb-5 text-white/75")}>
            {eyebrow}
          </p>
          <h2
            className={cx(
              styles["fluid-display-lg"],
              styles["wrap-balance"],
              "mx-auto max-w-5xl",
            )}
          >
            {title}
          </h2>
          <p
            className={cx(
              styles["fluid-text-xl"],
              styles["measure-copy"],
              styles["wrap-pretty"],
              "mx-auto mt-6 text-white/80",
            )}
          >
            {body}
          </p>
        </div>

        <div className="flex items-end justify-center pt-12">
          <RequestServiceButton
            className={cx(
              styles["radius-4"],
              "border-white bg-white text-service-ink hover:bg-service-surface",
            )}
            variant="secondary"
          >
            {action}
          </RequestServiceButton>
        </div>
      </div>
    </section>
  );
}
