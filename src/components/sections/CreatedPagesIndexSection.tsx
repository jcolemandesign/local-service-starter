import Link from "next/link";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import {
  SevenColumnGrid,
  SevenColumnGridItem,
} from "@/components/primitives/SevenColumnGrid";

type CreatedPageIndexItem = {
  href: string;
  label: string;
  sections: string[];
  sourceRecipe: string;
  status: string;
  summary: string;
};

type CreatedPagesIndexSectionProps = {
  body: string;
  eyebrow: string;
  pages: CreatedPageIndexItem[];
  title: string;
};

export function CreatedPagesIndexSection({
  body,
  eyebrow,
  pages,
  title,
}: CreatedPagesIndexSectionProps) {
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

          <SevenColumnGridItem className="col-start-3 col-span-5 max-lg:col-start-2 max-lg:col-span-4 max-md:col-start-1 max-md:col-span-3 max-sm:col-span-1">
            <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
              {pages.map((page) => (
                <Card
                  key={page.href}
                  className="flex min-h-80 flex-col p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-service-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="type-label text-service-accent">
                        {page.status}
                      </p>
                      <h2 className="type-heading-md mt-3 text-service-ink">
                        {page.label}
                      </h2>
                    </div>
                    <span className="type-caption rounded-sm border border-service-border bg-service-surface px-3 py-1 font-semibold text-service-muted">
                      {page.sourceRecipe}
                    </span>
                  </div>

                  <p className="type-text-sm measure-copy mt-4 text-service-muted">
                    {page.summary}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {page.sections.map((section) => (
                      <li
                        className="type-caption rounded-sm border border-service-border bg-service-surface px-2.5 py-1 text-service-muted"
                        key={section}
                      >
                        {section}
                      </li>
                    ))}
                  </ul>

                  <Link
                    className="type-label mt-auto inline-flex min-h-11 w-fit items-center justify-center rounded-sm border border-service-ink bg-service-ink px-4 text-white transition-colors hover:border-service-accent hover:bg-service-accent"
                    href={page.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open page
                  </Link>
                </Card>
              ))}
            </div>
          </SevenColumnGridItem>
        </SevenColumnGrid>
      </Container>
    </Section>
  );
}
