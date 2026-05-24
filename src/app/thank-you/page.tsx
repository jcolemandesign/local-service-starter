import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Thank You | Local Service Starter",
  description: "Confirmation for a submitted service request.",
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-service-surface text-service-ink">
      <Section>
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
              Request received
            </p>
            <h1 className="mt-4 text-fluid-heading font-semibold leading-heading">
              Thank you. Your service request has been sent.
            </h1>
            <p className="mt-6 text-lg leading-8 text-service-muted">
              A team member can review the details and follow up using the
              contact information provided.
            </p>
            <Link
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-md bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
              href="/"
            >
              Back to home
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
