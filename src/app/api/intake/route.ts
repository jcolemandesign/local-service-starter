import { randomUUID } from "node:crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type IntakePayload = {
  variant?: unknown;
  businessBasics?: {
    businessName?: unknown;
    businessType?: unknown;
    website?: unknown;
    contactName?: unknown;
    contactEmail?: unknown;
    contactPhone?: unknown;
  };
  services?: {
    mainServices?: unknown;
    otherMainServices?: unknown;
    priorityServices?: unknown;
  };
  serviceStrategy?: {
    service_treatment?: unknown;
    service_priority_notes?: unknown;
    emergency_service_availability?: unknown;
    emergency_service_limitations?: unknown;
  };
  serviceArea?: {
    townsCities?: unknown;
    priorityAreas?: unknown;
  };
  leadFlow?: {
    preferredActions?: unknown;
    primaryAction?: unknown;
    secondaryAction?: unknown;
  };
  pricingProcess?: {
    pricing_process_signals?: unknown;
    pricing_language_notes?: unknown;
  };
  finalNotes?: {
    bad_fit_customers?: unknown;
    contact_form_must_include?: unknown;
    future_offer_visibility?: unknown;
    future_offers?: unknown;
    global_avoid_emphasis?: unknown;
    homepage_must_include?: unknown;
    services_page_must_include?: unknown;
  };
};

type IntakeRequestBody = {
  payload?: IntakePayload;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function readCommaSeparatedStrings(value: unknown) {
  return readString(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration.");
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}

async function triggerClientIntakeWebhook({
  id,
  payload,
}: {
  id: string;
  payload: IntakePayload;
}) {
  const webhookUrl = process.env.MAKE_CLIENT_INTAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    await fetch(webhookUrl, {
      body: JSON.stringify({
        intakeId: id,
        payload,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal: controller.signal,
    });
  } catch (error) {
    console.error("Client intake webhook failed", error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(request: Request) {
  let body: IntakeRequestBody;

  try {
    body = (await request.json()) as IntakeRequestBody;
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  const payload = body.payload;

  if (!payload || typeof payload !== "object") {
    return jsonError("Missing intake payload.", 400);
  }

  const businessBasics = payload.businessBasics ?? {};
  const services = payload.services ?? {};
  const serviceStrategy = payload.serviceStrategy ?? {};
  const serviceArea = payload.serviceArea ?? {};
  const leadFlow = payload.leadFlow ?? {};

  const businessName = readString(businessBasics.businessName);
  const contactEmail = readString(businessBasics.contactEmail);
  const contactPhone = readString(businessBasics.contactPhone);

  if (!businessName) {
    return jsonError("Business name is required.", 400);
  }

  if (!contactEmail && !contactPhone) {
    return jsonError("Contact email or phone is required.", 400);
  }

  const id = randomUUID();
  const mainServices = [
    ...readStringArray(services.mainServices),
    ...readCommaSeparatedStrings(services.otherMainServices),
  ].filter(Boolean);
  const primaryAction = readString(leadFlow.primaryAction);
  const secondaryAction = readString(leadFlow.secondaryAction);
  const preferredCta = primaryAction
    ? [primaryAction, secondaryAction].filter(Boolean)
    : readStringArray(leadFlow.preferredActions);
  const allServiceAreas = readString(serviceArea.townsCities);
  const priorityServiceAreas = readString(serviceArea.priorityAreas);
  const serviceAreaSummary = [
    allServiceAreas ? `All service areas: ${allServiceAreas}` : "",
    priorityServiceAreas ? `Priority service areas: ${priorityServiceAreas}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
  const priorityServicesSummary = [
    readString(services.priorityServices),
    readString(serviceStrategy.service_priority_notes),
  ]
    .filter(Boolean)
    .join("\n\n");

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("project_intakes").insert({
      id,
      business_name: businessName,
      business_type:
        readString(businessBasics.businessType) || readString(payload.variant),
      contact_email: contactEmail,
      contact_name: readString(businessBasics.contactName),
      contact_phone: contactPhone,
      main_services: mainServices,
      payload,
      preferred_cta: preferredCta,
      priority_services: priorityServicesSummary,
      service_area: serviceAreaSummary,
      source: "Client Intake Wizard",
      status: "New",
      website: readString(businessBasics.website),
    });

    if (error) {
      console.error("Project intake insert failed", error);
      return jsonError("Unable to save intake.", 500);
    }

    await triggerClientIntakeWebhook({ id, payload });

    return Response.json({ id, ok: true });
  } catch (error) {
    console.error("Project intake submission failed", error);
    return jsonError("Unable to submit intake.", 500);
  }
}
