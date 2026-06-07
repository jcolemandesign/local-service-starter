import Link from "next/link";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";

type HomeIndexLink = {
  label: string;
  href: string;
  description: string;
};

type HomeIndexGroup = {
  title: string;
  links: readonly HomeIndexLink[];
};

type HomeIndexSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  groups: readonly HomeIndexGroup[];
};

export function HomeIndexSection({
  eyebrow,
  title,
  body,
  groups,
}: HomeIndexSectionProps) {
  return (
    <Section className="min-h-svh bg-bg-surface text-text-main">
      <Container className="grid gap-14">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          body={body}
          level={1}
          className="fluid-type-frame"
        />
        <nav aria-label="Project index" className="grid gap-8">
          {groups.map((group) => (
            <section key={group.title} aria-labelledby={`home-${slugify(group.title)}`}>
              <div className="mb-4 flex items-end justify-between gap-6 border-b border-border-default pb-3 max-md:flex-col max-md:items-start">
                <h2
                  id={`home-${slugify(group.title)}`}
                  className="type-heading-sm text-service-ink"
                >
                  {group.title}
                </h2>
                <p className="type-caption text-service-muted">
                  {group.links.length} links
                </p>
              </div>
              <div className="grid grid-cols-4 gap-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1">
                {group.links.map((link) => (
                  <Card
                    key={link.href}
                    className="transition-transform duration-200 hover:-translate-y-1 hover:border-service-accent"
                  >
                    <Link
                      href={link.href}
                      className="block h-full p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2"
                    >
                      <span className="type-text-md block font-semibold text-service-ink">
                        {link.label}
                      </span>
                      <span className="type-text-sm mt-3 block text-service-muted">
                        {link.description}
                      </span>
                      <span className="type-caption mt-5 block font-semibold text-service-accent">
                        {link.href}
                      </span>
                    </Link>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </Container>
    </Section>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}
