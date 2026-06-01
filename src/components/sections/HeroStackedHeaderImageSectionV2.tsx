import { HeroStackedHeaderImageVisual } from "./HeroStackedHeaderImageVisual";

type HeroStackedHeaderImageSectionV2Props = {
  eyebrow: string;
  title: string;
  headingLevel?: 1 | 2;
};

export function HeroStackedHeaderImageSectionV2({
  eyebrow,
  title,
  headingLevel = 1,
}: HeroStackedHeaderImageSectionV2Props) {
  return (
    <section className="min-h-svh overflow-hidden bg-white text-service-ink">
      <div className="container-site">
        <HeroStackedHeaderImageVisual
          eyebrow={eyebrow}
          headingLevel={headingLevel}
          title={title}
        />
      </div>
    </section>
  );
}
