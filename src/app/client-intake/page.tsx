import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { intakeVariantList } from "@/content/intakeVariants";

export const metadata: Metadata = {
  title: "Client Intake | Local Service Starter",
  description: "Choose the right intake path for a local service website.",
};

export default function ClientIntakePage() {
  return (
    <main className="min-h-screen bg-bg-page text-service-ink">
      <Section className="min-h-screen content-center">
        <Container>
          <div className="mx-auto grid max-w-5xl layout-gap-lrg">
            <div className="fluid-type-frame max-w-3xl">
              <p className="type-label text-service-accent">Client intake</p>
              <h1 className="type-heading-xl mt-eyebrow-heading-md text-service-ink">
                Choose the closest business type.
              </h1>
              <p className="type-text-lg mt-heading-body-md text-service-muted">
                Each path uses the same intake structure, but the examples,
                services, and prompts are tuned to the kind of business you are
                building for.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
              {intakeVariantList.map((variant) => (
                <Link
                  className="radius-medium group grid min-h-56 content-between border border-service-border bg-white p-6 shadow-service transition-colors hover:border-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  href={`/client-intake/${variant.key}`}
                  key={variant.key}
                >
                  <span className="grid gap-3">
                    <span className="type-label text-service-accent">
                      {variant.label}
                    </span>
                    <span className="type-heading-sm text-service-ink">
                      {variant.description}
                    </span>
                    <span className="type-text-sm text-service-muted">
                      {variant.examples}
                    </span>
                  </span>
                  <span className="type-caption mt-8 font-semibold text-service-muted transition-colors group-hover:text-service-accent">
                    Start intake
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
