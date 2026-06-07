import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import { HomeIndexMenu } from "@/components/sections/HomeIndexMenu";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";

type HomeIndexLink = {
  label: string;
  href: string;
  description: string;
};

type HomeIndexGroup = {
  title: string;
  links: HomeIndexLink[];
};

type HomeIndexSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  groups: HomeIndexGroup[];
};

export function HomeIndexSection({
  eyebrow,
  title,
  body,
  groups,
}: HomeIndexSectionProps) {
  return (
    <Section className="min-h-svh bg-bg-surface text-text-main">
      <Container>
        <SevenColumnGrid frame="none" gap="lrg" className="fluid-type-frame">
          <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-5 max-md:col-span-3 max-sm:col-span-1">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              body={body}
              level={1}
            />
          </SevenColumnGridItem>
          <nav aria-label="Project index" className="contents">
            <HomeIndexMenu initialGroups={groups} />
          </nav>
        </SevenColumnGrid>
      </Container>
    </Section>
  );
}
