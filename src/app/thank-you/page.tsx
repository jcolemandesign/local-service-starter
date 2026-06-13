import type { Metadata } from "next";
import { Button, Container, Section } from "@/components/primitives";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";

export const metadata: Metadata = {
  title: "Thank You | Local Service Starter",
  description: "Confirmation for a submitted service request.",
};

export default function ThankYouPage() {
  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-screen bg-bg-page text-service-ink">
        <Section>
          <Container>
            <div className="measure-copy-wide fluid-type-frame">
              <p className="type-label text-service-accent">
                Request received
              </p>
              <h1 className="type-heading-xl mt-eyebrow-heading-lg">
                Thank you. Your service request has been sent.
              </h1>
              <p className="type-text-lg wrap-pretty mt-heading-body-lg text-service-muted">
                A team member can review the details and follow up using the
                contact information provided.
              </p>
              <Button className="mt-body-actions-lg" href="/">
                Back to home
              </Button>
            </div>
          </Container>
        </Section>
      </main>
    </StyleGuidePreviewSurface>
  );
}
