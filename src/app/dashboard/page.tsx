import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, Container, Section } from "@/components/primitives";
import { createClient } from "@/utils/supabase/server";
import { LeadDashboard, type Lead } from "./lead-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Local Service Starter",
  description: "Lead dashboard for local service website submissions.",
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

async function getLeads() {
  const supabase = await getAuthenticatedSupabase();

  return supabase.from("leads").select("*").order("created_at", {
    ascending: false,
  });
}

async function updateLead(formData: FormData) {
  "use server";

  const supabase = await getAuthenticatedSupabase();
  const leadId = getFormString(formData, "leadId");
  const status = getFormString(formData, "status");
  const notes = getFormString(formData, "notes");

  if (!leadId || !statusOptions.includes(status)) {
    redirect("/dashboard?save=error");
  }

  const { error } = await supabase
    .from("leads")
    .update({
      notes,
      status,
    })
    .eq("id", leadId);

  if (error) {
    console.error("Supabase lead update failed", {
      code: "code" in error ? error.code : undefined,
      details: "details" in error ? error.details : undefined,
      hint: "hint" in error ? error.hint : undefined,
      leadId,
      message: error.message,
    });

    redirect(`/dashboard?save=error&lead=${encodeURIComponent(leadId)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard?save=success&lead=${encodeURIComponent(leadId)}`);
}

async function logout() {
  "use server";

  const supabase = createClient(await cookies());

  await supabase.auth.signOut();
  redirect("/login?loggedOut=1");
}

type DashboardPageProps = {
  searchParams?: Promise<{
    lead?: string | string[];
    save?: string | string[];
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const saveState = typeof params?.save === "string" ? params.save : null;
  const savedLeadId = typeof params?.lead === "string" ? params.lead : null;
  const { data, error } = await getLeads();
  const leads = Array.isArray(data) ? (data as Lead[]) : [];
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const latestLeadDate = leads[0]?.created_at ?? null;

  return (
    <main className="min-h-screen bg-service-surface text-service-ink">
      <header className="sticky top-0 z-50 border-b border-service-border bg-white/95 backdrop-blur">
        <Container>
          <div className="flex min-h-16 items-center justify-between gap-5 py-3">
            <Link
              className="text-base font-semibold leading-tight text-service-ink"
              href="/"
            >
              Local Service Starter
            </Link>
            <nav className="flex items-center gap-3">
              <Link
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
                href="/#contact"
              >
                View site
              </Link>
              <form action={logout}>
                <button
                  className="inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
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
          <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
            Admin dashboard
          </p>
          <div className="mt-5 grid gap-8 max-lg:grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-fluid-heading font-semibold leading-heading text-service-ink">
                Website leads
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-service-muted max-md:text-base max-md:leading-7">
                Review incoming contact form submissions from Supabase and keep
                follow-up notes current.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 w-fit items-center justify-center rounded-md border border-service-border bg-white px-6 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
              href="/#contact"
            >
              View contact form
            </Link>
          </div>

          <div className="mt-10 grid gap-4 max-md:grid-cols-1 md:grid-cols-3">
            <DashboardStat label="Total leads" value={String(totalLeads)} />
            <DashboardStat label="New leads" value={String(newLeads)} />
            <DashboardStat
              label="Latest lead date"
              value={formatDate(latestLeadDate)}
            />
          </div>
        </Container>
      </Section>

      <section className="pb-24 max-lg:pb-20 max-md:pb-16">
        <Container>
          {error ? (
            <Card className="border-red-200 bg-red-50 p-6 text-red-700">
              <h2 className="text-2xl font-semibold leading-tight">
                Could not load leads.
              </h2>
              <p className="mt-2 text-base leading-7">{error.message}</p>
            </Card>
          ) : null}

          {!error ? (
            <LeadDashboard
              leads={leads}
              savedLeadId={savedLeadId}
              saveState={saveState}
              statusOptions={statusOptions}
              updateLead={updateLead}
            />
          ) : null}
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
    <Card className="p-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-service-accent">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold leading-none text-service-ink">
        {value}
      </p>
    </Card>
  );
}
