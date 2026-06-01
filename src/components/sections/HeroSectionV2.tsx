import { Button } from "@/components/primitives";
import { RequestServiceButton } from "@/components/request-service";

type HeroSectionV2Props = {
  eyebrow: string;
  title: string;
  body: string;
  primaryAction: string;
  secondaryAction: string;
  headingLevel?: 1 | 2;
};

function cx(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SampleImage() {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden bg-service-border max-lg:aspect-[2/3]"
      aria-label="Sample service image placeholder"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.34),rgb(23_33_29_/_0.08)),linear-gradient(45deg,rgb(255_255_255_/_0.22)_0_1px,transparent_1px_18px)]" />
      <div className="absolute inset-0 bg-service-accent/10" />
    </div>
  );
}

export function HeroSectionV2({
  eyebrow,
  title,
  body,
  primaryAction,
  secondaryAction,
  headingLevel = 1,
}: HeroSectionV2Props) {
  const HeadingTag = `h${headingLevel}` as const;

  return (
    <section className="min-h-svh bg-service-surface">
      <div className="container-site flex min-h-svh items-stretch gap-10 py-16 max-lg:flex-col max-lg:gap-12 max-md:py-12">
        <div
          className={cx(
            "flex min-w-0 basis-[56%] items-center max-lg:basis-auto",
            "fluid-type-frame",
          )}
        >
          <div>
            <p className={cx("type-label", "text-service-accent")}>
              {eyebrow}
            </p>
            <HeadingTag
              className={cx(
                "type-display-lg",
                "mt-6 text-service-ink",
              )}
            >
              {title}
            </HeadingTag>
            <p
              className={cx(
                "type-text-lg",
                "measure-copy",
                "wrap-pretty",
                "mt-7 text-service-muted",
              )}
            >
              {body}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <RequestServiceButton>{primaryAction}</RequestServiceButton>
              <Button href="#services" variant="secondary">
                {secondaryAction}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex min-w-[18rem] basis-[48%] items-center justify-end -ml-10 max-lg:ml-0 max-lg:min-w-0 max-lg:basis-auto max-lg:justify-start">
          <SampleImage />
        </div>
      </div>
    </section>
  );
}
