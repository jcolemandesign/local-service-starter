import type { Metadata } from "next";
import { createClient as createSupabaseServiceClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Container, Section } from "@/components/primitives";
import { createClient } from "@/utils/supabase/server";
import {
  ProjectIntakeDashboard,
  type ProjectIntake,
} from "../../dashboard/lead-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Owner Dashboard | Local Service Starter",
  description: "Internal dashboard for leads and client-intake submissions.",
};

const statusOptions = [
  "New",
  "Contacted",
  "Quoted",
  "Booked",
  "Completed",
  "Not responding",
  "Lost",
  "Spam",
];

function formatDate(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

async function getAuthenticatedSupabase() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return supabase;
}

function getServiceRoleSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  console.info("Supabase project intake delete config loaded", {
    keySource: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "SUPABASE_SERVICE_ROLE_KEY"
      : "SUPABASE_SECRET_KEY",
    supabaseUrlHost: new URL(supabaseUrl).host,
  });

  return createSupabaseServiceClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function getProjectIntakes() {
  const supabase = await getAuthenticatedSupabase();

  return supabase.from("project_intakes").select("*").order("created_at", {
    ascending: false,
  });
}

async function updateProjectIntake(formData: FormData) {
  "use server";

  const supabase = await getAuthenticatedSupabase();
  const intakeId = getFormString(formData, "intakeId");
  const status = getFormString(formData, "status");

  if (!intakeId || !statusOptions.includes(status)) {
    redirect("/dev/dashboard?intakeSave=error");
  }

  const { error } = await supabase
    .from("project_intakes")
    .update({ status })
    .eq("id", intakeId);

  if (error) {
    console.error("Supabase project intake update failed", {
      code: "code" in error ? error.code : undefined,
      details: "details" in error ? error.details : undefined,
      hint: "hint" in error ? error.hint : undefined,
      intakeId,
      message: error.message,
    });

    redirect(
      `/dev/dashboard?intakeSave=error&intake=${encodeURIComponent(intakeId)}`,
    );
  }

  revalidatePath("/dev/dashboard");
  redirect(
    `/dev/dashboard?intakeSave=success&intake=${encodeURIComponent(intakeId)}`,
  );
}

async function deleteProjectIntake(formData: FormData) {
  "use server";

  await getAuthenticatedSupabase();
  const intakeId = getFormString(formData, "intakeId");

  if (!intakeId) {
    redirect("/dev/dashboard?intakeSave=delete-error");
  }

  const serviceRoleSupabase = getServiceRoleSupabase();

  if (!serviceRoleSupabase) {
    console.error("Supabase project intake delete failed", {
      intakeId,
      hasSupabaseSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
      hasSupabaseServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      message:
        "Missing NEXT_PUBLIC_SUPABASE_URL and/or a server Supabase key.",
    });

    redirect(
      `/dev/dashboard?intakeSave=delete-config-error&intake=${encodeURIComponent(intakeId)}`,
    );
  }

  const { data: deletedIntakes, error } = await serviceRoleSupabase
    .from("project_intakes")
    .delete()
    .eq("id", intakeId)
    .select("id");

  if (error || !deletedIntakes || deletedIntakes.length === 0) {
    console.error("Supabase project intake delete failed", {
      code: error && "code" in error ? error.code : undefined,
      deletedCount: deletedIntakes?.length ?? 0,
      details: error && "details" in error ? error.details : undefined,
      hint: error && "hint" in error ? error.hint : undefined,
      intakeId,
      message: error?.message ?? "No matching intake was deleted.",
    });

    redirect(
      `/dev/dashboard?intakeSave=delete-error&intake=${encodeURIComponent(intakeId)}`,
    );
  }

  revalidatePath("/dev/dashboard");
  redirect("/dev/dashboard?intakeSave=deleted");
}

async function logout() {
  "use server";

  const supabase = createClient(await cookies());

  await supabase.auth.signOut();
  redirect("/login?loggedOut=1");
}

type OwnerDashboardPageProps = {
  searchParams?: Promise<{
    intake?: string | string[];
    intakeSave?: string | string[];
  }>;
};

export default async function OwnerDashboardPage({
  searchParams,
}: OwnerDashboardPageProps) {
  const params = await searchParams;
  const intakeSaveState =
    typeof params?.intakeSave === "string" ? params.intakeSave : null;
  const savedIntakeId =
    typeof params?.intake === "string" ? params.intake : null;
  const { data, error } = await getProjectIntakes();
  const projectIntakes = Array.isArray(data) ? (data as ProjectIntake[]) : [];
  const totalIntakes = projectIntakes.length;
  const newIntakes = projectIntakes.filter(
    (intake) => intake.status === "New",
  ).length;
  const latestIntakeDate = projectIntakes[0]?.created_at ?? null;

  return (
    <main className="min-h-screen bg-service-surface text-service-ink">
      <header className="sticky top-0 z-50 border-b border-service-border bg-bg-page/92 backdrop-blur">
        <Container>
          <div className="flex min-h-16 items-center justify-between layout-gap-med py-4 max-md:flex-col max-md:items-start">
            <Link
              className="type-heading-sm text-service-ink"
              href="/"
            >
              Local Service Starter
            </Link>
            <nav className="flex items-center inline-gap-med max-sm:w-full max-sm:flex-col max-sm:items-stretch">
              <Link
                className="radius-button inline-flex min-h-12 items-center justify-center border border-service-border bg-white px-5 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="/dashboard"
              >
                Client dashboard
              </Link>
              <form action={logout}>
                <button
                  className="radius-button inline-flex min-h-12 cursor-pointer items-center justify-center border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink max-sm:w-full"
                  type="submit"
                >
                  Log out
                </button>
              </form>
            </nav>
          </div>
        </Container>
      </header>

      <Section className="pb-12">
        <Container>
          <div className="radius-surface overflow-hidden border border-service-border bg-white shadow-service">
            <div className="grid layout-gap-xlrg bg-service-ink p-[var(--container-gutter)] text-white max-lg:grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="fluid-type-frame">
                <p className="type-label text-white/70">
                  Owner dashboard
                </p>
                <h1 className="type-heading-xl mt-eyebrow-heading-lg">
                  Client intake submissions
                </h1>
                <p className="type-text-lg mt-heading-body-md max-w-3xl text-white/72">
                  Review, prioritize, and promote project briefs from the
                  reusable client intake flow.
                </p>
              </div>
              <Link
                className="radius-button inline-flex min-h-12 w-fit items-center justify-center border border-white bg-white px-6 type-caption font-semibold text-service-ink transition-colors hover:bg-service-surface"
                href="/client-intake"
                rel="noreferrer"
                target="_blank"
              >
                View intake flow
              </Link>
            </div>

            <div className="grid border-t border-service-border bg-white max-md:grid-cols-1 md:grid-cols-3">
              <DashboardStat label="Total intakes" value={String(totalIntakes)} />
              <DashboardStat label="Needs review" value={String(newIntakes)} />
              <DashboardStat
                label="Latest intake date"
                value={formatDate(latestIntakeDate)}
              />
            </div>
          </div>
        </Container>
      </Section>

      <section className="pb-24 max-lg:pb-20 max-md:pb-16">
        <Container>
          <div className="grid layout-gap-lrg max-lg:grid-cols-1 lg:grid-cols-[0.28fr_1fr] lg:items-start">
            <div className="fluid-type-frame">
              <p className="type-label text-service-accent">Pipeline</p>
              <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                Promoted briefs need a cleaner read.
              </h2>
              <p className="type-text-md mt-heading-body-sm text-service-muted">
                Filters, contact details, answers, and status updates now follow
                the same card, spacing, and type hierarchy as the style guide.
              </p>
            </div>
            <div>
              {error ? (
                <Card className="border-red-200 bg-red-50 p-[var(--container-gutter)] text-red-700">
                  <h2 className="type-heading-md">
                    Could not load project intakes.
                  </h2>
                  <p className="type-text-md mt-heading-body-sm">
                    {error.message}
                  </p>
                </Card>
              ) : null}

              {!error ? (
                <ProjectIntakeDashboard
                  deleteProjectIntake={deleteProjectIntake}
                  intakeSaveState={intakeSaveState}
                  projectIntakes={projectIntakes}
                  savedIntakeId={savedIntakeId}
                  statusOptions={statusOptions}
                  updateProjectIntake={updateProjectIntake}
                />
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function DashboardStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="p-[var(--container-gutter)] [&+&]:border-l [&+&]:border-service-border max-md:[&+&]:border-l-0 max-md:[&+&]:border-t">
      <p className="type-label text-service-muted">
        {label}
      </p>
      <p className="type-heading-lg mt-heading-body-sm text-service-ink">
        {value}
      </p>
    </div>
  );
}
