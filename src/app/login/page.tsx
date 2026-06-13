import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Container, Section } from "@/components/primitives";
import { StyleGuidePreviewSurface } from "@/components/sections/StyleGuideLiveSurface";
import { createClient } from "@/utils/supabase/server";
import { PasswordResetRequest } from "./PasswordResetRequest";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login | Local Service Starter",
  description: "Sign in to the local service lead dashboard.",
};

const fieldClass =
  "radius-button h-12 border border-service-border bg-bg-page px-4 type-text-sm text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

async function signIn(formData: FormData) {
  "use server";

  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");

  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase dashboard login failed", {
      message: error.message,
      status: "status" in error ? error.status : undefined,
    });

    redirect("/login?error=invalid");
  }

  redirect("/dashboard");
}

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string | string[];
    loggedOut?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const error = typeof params?.error === "string" ? params.error : null;
  const loggedOut = params?.loggedOut === "1";
  const errorMessage =
    error === "missing"
      ? "Enter your email and password."
      : error
        ? "We could not sign you in. Check your email and password."
        : null;

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
                  Dashboard login
                </p>
                <h1 className="type-heading-xl measure-copy-wide mt-eyebrow-heading-lg text-service-ink">
                  Sign in to manage website leads.
                </h1>
                <p className="type-text-lg measure-copy wrap-pretty mt-heading-body-lg text-service-muted">
                  Use your Supabase email and password account to access the
                  private lead dashboard.
                </p>
              </div>

              <Card className="bg-service-surface content-padding">
                <form action={signIn}>
                  <div className="fluid-type-frame">
                    <p className="type-label text-service-accent">
                      Admin access
                    </p>
                    <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
                      Welcome back
                    </h2>
                    {loggedOut ? (
                      <p className="radius-button type-text-sm mt-heading-body-sm border border-service-accent/25 bg-service-accent/10 px-4 py-3 text-service-ink">
                        You have been logged out.
                      </p>
                    ) : null}
                    {errorMessage ? (
                      <p className="radius-button type-text-sm mt-heading-body-sm border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {errorMessage}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-body-actions-md grid inline-gap-med">
                    <label className="type-label grid inline-gap-sml text-service-ink">
                      Email address
                      <input
                        autoComplete="email"
                        className={fieldClass}
                        name="email"
                        placeholder="admin@example.com"
                        required
                        type="email"
                      />
                    </label>

                    <label className="type-label grid inline-gap-sml text-service-ink">
                      Password
                      <input
                        autoComplete="current-password"
                        className={fieldClass}
                        name="password"
                        placeholder="Enter password"
                        required
                        type="password"
                      />
                    </label>
                  </div>

                  <button
                    className="radius-button mt-body-actions-md inline-flex min-h-12 w-full cursor-pointer items-center justify-center bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                    type="submit"
                  >
                    Sign in
                  </button>
                </form>
                <PasswordResetRequest />
              </Card>
            </div>
          </Container>
        </Section>
      </main>
    </StyleGuidePreviewSurface>
  );
}
