
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
import type { SectionColorRecipe } from "@/content/section-color-recipes";

type ContentSplitHeadlineImageSectionV2Props = {
  headlineTop: string;
  headlineBottom: string;
  imageLabel: string;
  body: string;
  colorRecipe?: SectionColorRecipe;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function TexturedImage({ label, surfaceClass }: { label: string; surfaceClass: string }) {
  return (
    <div
      aria-label={`${label} image placeholder`}
      className={cx(
        "radius-medium",
        "relative mx-auto aspect-square w-[clamp(13rem,24vw,22rem)] overflow-hidden border border-service-border shadow-service max-md:w-full max-md:max-w-80",
        surfaceClass,
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
  colorRecipe = "default",
}: ContentSplitHeadlineImageSectionV2Props) {
  const colors = {
    default: { body: "text-service-muted", heading: "text-service-ink", media: "bg-surface-raised", panel: "bg-service-surface", section: "bg-bg-page" },
    muted: { body: "text-service-muted", heading: "text-service-ink", media: "bg-service-surface", panel: "bg-bg-page", section: "bg-service-surface" },
    dark: { body: "text-white/70", heading: "text-white", media: "bg-white/8", panel: "bg-white/5", section: "bg-bg-dark" },
    accent: { body: "text-[var(--live-accent-muted-text)]", heading: "text-[var(--live-accent-ink)]", media: "bg-white/8", panel: "bg-white/10", section: "bg-service-accent" },
  }[colorRecipe];

  return (
    <section className={colors.section}>
      <SevenColumnGrid className="section-min-screen">
        <SevenColumnGridItem
          alignY="middle"
          className="col-span-7"
        >
        <div
          className={cx(
            "fluid-type-frame",
            "radius-medium",
            "grid gap-10 p-12 max-lg:p-8 max-md:p-6",
            colors.panel,
          )}
        >
          <h2
            className={cx(
              "type-display-lg",
              "grid justify-items-center gap-7 text-center max-md:gap-5",
              colors.heading,
            )}
          >
            <span>{headlineTop}</span>
            <TexturedImage label={imageLabel} surfaceClass={colors.media} />
            <span>{headlineBottom}</span>
          </h2>

          <p
            className={cx(
              "type-text-xl",
              "measure-copy",
              "wrap-pretty",
              "mx-auto text-center",
              colors.body,
            )}
          >
            {body}
          </p>
        </div>
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
