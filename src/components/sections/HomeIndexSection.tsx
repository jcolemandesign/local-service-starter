import Link from "next/link";
import { Card } from "@/components/primitives/Card";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/SectionHeading";
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
      <Container>
        <SevenColumnGrid frame="none" gap="lrg" className="fluid-type-frame">
          <SevenColumnGridItem className="col-start-2 col-span-4 max-lg:col-start-1 max-lg:col-span-7">
            <SectionHeading
              eyebrow={eyebrow}
              title={title}
              body={body}
              level={1}
            />
          </SevenColumnGridItem>
          <nav aria-label="Project index" className="contents">
            {groups.map((group) => (
              <section
                key={group.title}
                aria-labelledby={`home-${slugify(group.title)}`}
                className="contents"
              >
                <SevenColumnGridItem className="col-start-2 col-span-1 mt-8 max-lg:col-start-1 max-lg:col-span-7 max-lg:mt-4">
                  <div className="border-t border-border-default pt-3">
                    <h2
                      id={`home-${slugify(group.title)}`}
                      className="type-label text-service-ink"
                    >
                      {group.title}
                    </h2>
                    <p className="type-caption mt-2 text-service-muted">
                      {group.links.length} links
                    </p>
                  </div>
                </SevenColumnGridItem>
                <SevenColumnGridItem className="col-start-3 col-span-5 mt-8 max-lg:col-start-1 max-lg:col-span-7 max-lg:mt-0">
                  <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
                    {group.links.map((link) => (
                      <Card
                        key={link.href}
                        className="flex min-h-44 flex-col p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-service-accent"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={link.href}
                            className="min-w-0 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2"
                          >
                            <span className="type-text-md block font-semibold text-service-ink">
                              {link.label}
                            </span>
                          </Link>
                          <div
                            className="flex shrink-0 items-center gap-1"
                            aria-label={`${link.label} actions`}
                          >
                            <CardActionButton
                              label={`Clone ${link.label}`}
                              title="Clone page for a new version or branch"
                            >
                              <CopyIcon />
                            </CardActionButton>
                            <CardActionButton
                              label={`Delete ${link.label}`}
                              title="Delete page"
                              tone="danger"
                            >
                              <TrashIcon />
                            </CardActionButton>
                          </div>
                        </div>
                        <Link
                          href={link.href}
                          className="mt-3 flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2"
                        >
                          <span className="type-text-sm block text-service-muted">
                            {link.description}
                          </span>
                          <span className="type-caption mt-auto block pt-5 font-semibold text-service-accent">
                            {link.href}
                          </span>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </SevenColumnGridItem>
              </section>
            ))}
          </nav>
        </SevenColumnGrid>
      </Container>
    </Section>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function CardActionButton({
  children,
  label,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  label: string;
  title: string;
  tone?: "default" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "text-service-muted hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      : "text-service-muted hover:border-service-accent hover:bg-bg-surface hover:text-service-accent";

  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      className={`inline-flex size-7 items-center justify-center rounded-sm border border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-service-accent focus-visible:ring-offset-2 ${toneClass}`}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}
