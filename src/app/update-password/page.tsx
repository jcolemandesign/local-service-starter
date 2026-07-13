import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, Section } from "@/components/primitives";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Update Password | Local Service Starter",
  description: "Set a new password for the local service lead dashboard.",
};

export default function UpdatePasswordPage() {
  return (
    <StyleGuidePreviewSurface>
      <main className="min-h-screen bg-bg-page text-service-ink">
        <header className="border-b border-service-border bg-bg-page/95 backdrop-blur">
          <Container>
            <div className="flex min-h-16 items-center justify-between gap-5 py-3">
              <Link
                className="type-text-sm font-semibold text-service-ink transition-colors hover:text-service-accent"
                href="/"
              >
                Local Service Starter
              </Link>
            </div>
          </Container>
        </header>

        <Section>
          <Container>
            <div className="grid layout-gap-lrg max-lg:grid-cols-1 lg:grid-cols-[1fr_0.72fr] lg:items-center">
              <div className="fluid-type-frame">
                <p className="type-label text-service-accent">
                  Password recovery
                </p>
                <h1 className="type-heading-xl measure-copy-wide mt-eyebrow-heading-lg text-service-ink">
                  Set a new dashboard password.
                </h1>
                <p className="type-text-lg measure-copy wrap-pretty mt-heading-body-lg text-service-muted">
                  Use the reset link from your email to create a fresh password
                  for your private lead dashboard account.
                </p>
              </div>

              <Card className="bg-service-surface content-padding">
                <div className="fluid-type-frame">
                  <p className="type-label text-service-accent">
                    Account access
                  </p>
                  <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                    Update password
                  </h2>
                </div>

                <UpdatePasswordForm />
              </Card>
            </div>
          </Container>
        </Section>
      </main>
    </StyleGuidePreviewSurface>
  );
}
