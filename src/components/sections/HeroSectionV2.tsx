import {
  Button,
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives";
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
    <section className="bg-service-surface">
      <SevenColumnGrid className="section-min-screen">
        <SevenColumnGridItem
          alignX="left"
          alignY="middle"
          className="col-span-4 max-lg:col-span-7"
        >
          <div className="fluid-type-frame measure-copy-wide">
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
        </SevenColumnGridItem>

        <SevenColumnGridItem
          alignX="stretch"
          alignY="middle"
          className="col-span-3 col-start-5 max-lg:col-span-7 max-lg:col-start-1"
        >
          <SampleImage />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
