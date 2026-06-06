import { SevenColumnGrid, SevenColumnGridItem } from "@/components/primitives";
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
    <section className="overflow-hidden bg-white text-service-ink">
      <SevenColumnGrid className="section-min-screen">
        <SevenColumnGridItem className="col-span-7">
          <HeroStackedHeaderImageVisual
            eyebrow={eyebrow}
            headingLevel={headingLevel}
            title={title}
          />
        </SevenColumnGridItem>
      </SevenColumnGrid>
    </section>
  );
}
