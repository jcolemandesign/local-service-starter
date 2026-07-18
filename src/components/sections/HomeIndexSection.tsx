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
  mutable?: boolean;
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
    <Section
      className="token-chrome min-h-svh"
      style={{ paddingBlockStart: "var(--section-space-med)" }}
    >
      <Container>
        <SevenColumnGrid frame="none" gap="lrg" className="fluid-type-frame">
          <SevenColumnGridItem className="col-start-2 col-span-6 max-lg:col-start-2 max-lg:col-span-4 max-md:col-start-1 max-md:col-span-3 max-sm:col-span-1">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              body={body}
              level={1}
              className="[&_.text-service-accent]:text-[var(--chrome-accent)] [&_.text-service-ink]:text-[var(--chrome-text)] [&_.text-service-muted]:text-[var(--chrome-muted)]"
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
