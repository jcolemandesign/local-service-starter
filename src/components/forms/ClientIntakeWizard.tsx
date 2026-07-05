"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  type IntakeVariantKey,
  intakeVariants,
} from "@/content/intakeVariants";

type BusinessBasics = {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  businessAddress: string;
  businessHours: string;
  additionalNotes: string;
};

type ServicesAnswers = {
  mainServices: string[];
  otherMainServices: string;
  priorityServices: string;
  additionalNotes: string;
};

type ServiceTreatment =
  | "Feature heavily"
  | "Standard Service"
  | "Non-priority"
  | "Do not promote";

type ServiceStrategyAnswers = {
  service_treatment: Record<string, ServiceTreatment>;
  service_priority_notes: string;
  emergency_service_availability: string;
  emergency_service_limitations: string;
  additionalNotes: string;
};

type ServiceAreaAnswers = {
  townsCities: string;
  priorityAreas: string;
  serviceRadius: string;
  locationLimits: string;
  additionalNotes: string;
};

type LeadFlowAnswers = {
  currentProcess: string[];
  primaryAction: string;
  secondaryAction: string;
  afterFormSubmit: string[];
  responseTime: string;
  additionalNotes: string;
};

type PricingProcessAnswers = {
  pricing_process_signals: string[];
  pricing_language_notes: string;
  additionalNotes: string;
};

type TrustAnswers = {
  signals: string[];
  yearsInBusiness: string;
  compliments: string;
  competitorDifference: string;
  claimsToAvoid: string;
  additionalNotes: string;
};

type CustomerQuestionsAnswers = {
  beforeContact: string;
  pricingTimingProcess: string;
  competitorComparison: string;
  additionalNotes: string;
};

type AssetAnswers = {
  folderLink: string;
  folderIncludes: string[];
  promoOffer: string;
  competitorReferences: string;
  additionalNotes: string;
};

type FinalNotesAnswers = {
  future_offers: string;
  future_offer_visibility: string;
  homepage_must_include: string;
  services_page_must_include: string;
  contact_form_must_include: string;
  global_avoid_emphasis: string;
  bad_fit_customers: string;
  upcomingChanges: string;
  additionalNotes: string;
  mustInclude?: string;
  avoidSaying?: string;
  servicesToAvoid?: string;
  customerTypesToAvoid?: string;
};

export type ClientIntakePayload = {
  variant: IntakeVariantKey;
  businessBasics: BusinessBasics;
  services: ServicesAnswers;
  serviceStrategy: ServiceStrategyAnswers;
  serviceArea: ServiceAreaAnswers;
  leadFlow: LeadFlowAnswers;
  pricingProcess: PricingProcessAnswers;
  trust: TrustAnswers;
  customerQuestions: CustomerQuestionsAnswers;
  assets: AssetAnswers;
  finalNotes: FinalNotesAnswers;
};

type ClientIntakeWizardProps = {
  variant?: IntakeVariantKey;
};

type ClientIntakeAnswerSection = Exclude<keyof ClientIntakePayload, "variant">;

type WizardStep = {
  title: string;
  eyebrow: string;
  subhead?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const baseStorageKey = "client-intake-wizard-draft-v2";

const steps: WizardStep[] = [
  { eyebrow: "Step 1", title: "Business basics" },
  { eyebrow: "Step 2", title: "Services offered" },
  {
    eyebrow: "Step 3",
    title: "Service priorities and boundaries",
    subhead:
      "This helps the site know what to push, what to include quietly, and what to avoid promoting.",
  },
  { eyebrow: "Step 4", title: "Service area" },
  {
    eyebrow: "Step 5",
    title: "How new customers contact you",
    subhead:
      "This helps us make the website match how your business actually handles new inquiries.",
  },
  {
    eyebrow: "Step 6",
    title: "Pricing, estimates, and process",
    subhead:
      "Use this to keep pricing language accurate without overpromising before diagnosis or qualification.",
  },
  {
    eyebrow: "Step 7",
    title: "Why customers choose you",
    subhead:
      "Select anything that is true, important, and okay to say publicly on the website.",
  },
  {
    eyebrow: "Step 8",
    title: "Common customer questions",
    subhead:
      "These help us write better FAQs, contact sections, and service page copy.",
  },
  {
    eyebrow: "Step 9",
    title: "Photos, logo, references, and offers",
    subhead:
      "The easiest option is to send one Google Drive or Dropbox folder with anything useful.",
  },
  {
    eyebrow: "Step 10",
    title: "Final notes and future offers",
    subhead:
      "Capture must-have page notes, future offers, and anything the site should not emphasize.",
  },
  {
    eyebrow: "Step 11",
    title: "Review your intake",
    subhead: "Take a quick look before submitting. You can go back and edit anything.",
  },
];

const currentProcessOptions = [
  "They call and we answer live",
  "They call and leave a voicemail",
  "They text us",
  "They fill out a form",
  "They book online",
  "They message us through Google / social media",
  "It depends",
  "We do not have a clear process yet",
];

const primaryActionOptions = [
  "Call now",
  "Request a quote",
  "Schedule an appointment",
  "Book online",
  "Send a message",
  "Ask for a callback",
];

const afterFormSubmitOptions = [
  "We call them back",
  "We text them",
  "We email them",
  "We schedule an appointment",
  "We send an estimate",
  "We qualify the lead first",
  "Not sure yet",
];

const responseTimeOptions = [
  "Immediately",
  "Same day",
  "Within 24 hours",
  "Within 2-3 business days",
  "It depends on the request",
  "This is something we need to improve",
];

const serviceTreatmentOptions: ServiceTreatment[] = [
  "Feature heavily",
  "Standard Service",
  "Non-priority",
  "Do not promote",
];

const emergencyAvailabilityOptions = [
  "Yes",
  "No",
  "Limited / depends on availability",
];

const pricingProcessSignalOptions = [
  "Free estimates",
  "Diagnostic fee applies",
  "Diagnostic fee may be credited toward approved work",
  "Upfront pricing after diagnosis",
  "Financing available",
  "Do not mention pricing online",
  "Do not quote exact prices before diagnosis",
];

const futureOfferVisibilityOptions = [
  "Do not mention yet",
  "Mention lightly",
  "Create a placeholder section",
  "Make it a major website focus",
];

const trustSignalOptions = [
  "Licensed / insured",
  "Locally owned",
  "Family-owned",
  "Same-day availability",
  "Emergency service",
  "Free estimates",
  "Upfront pricing",
  "Financing available",
  "Warranty or guarantee",
  "Certified technicians / providers",
  "Specialized training or credentials",
  "Background-checked team",
  "Clean, respectful, professional service",
  "Real project photos available",
  "Strong Google reviews",
  "Maintenance plans or memberships",
  "Satisfaction guarantee",
  "Other",
];

const folderIncludeOptions = [
  "Logo files",
  "Team photos",
  "Project photos",
  "Before / after photos",
  "Brand or truck photos",
  "Existing flyers or brochures",
  "Testimonials or review screenshots",
  "Service list or pricing sheets",
  "Current offer or seasonal promotion",
];

function createDefaultPayload(variant: IntakeVariantKey): ClientIntakePayload {
  return {
    variant,
    businessBasics: {
      businessName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      businessAddress: "",
      businessHours: "",
      additionalNotes: "",
    },
    services: {
      mainServices: [],
      otherMainServices: "",
      priorityServices: "",
      additionalNotes: "",
    },
    serviceStrategy: {
      service_treatment: {},
      service_priority_notes: "",
      emergency_service_availability: "",
      emergency_service_limitations: "",
      additionalNotes: "",
    },
    serviceArea: {
      townsCities: "",
      priorityAreas: "",
      serviceRadius: "",
      locationLimits: "",
      additionalNotes: "",
    },
    leadFlow: {
      currentProcess: [],
      primaryAction: "",
      secondaryAction: "",
      afterFormSubmit: [],
      responseTime: "",
      additionalNotes: "",
    },
    pricingProcess: {
      pricing_process_signals: [],
      pricing_language_notes: "",
      additionalNotes: "",
    },
    trust: {
      signals: [],
      yearsInBusiness: "",
      compliments: "",
      competitorDifference: "",
      claimsToAvoid: "",
      additionalNotes: "",
    },
    customerQuestions: {
      beforeContact: "",
      pricingTimingProcess: "",
      competitorComparison: "",
      additionalNotes: "",
    },
    assets: {
      folderLink: "",
      folderIncludes: [],
      promoOffer: "",
      competitorReferences: "",
      additionalNotes: "",
    },
    finalNotes: {
      future_offers: "",
      future_offer_visibility: "",
      homepage_must_include: "",
      services_page_must_include: "",
      contact_form_must_include: "",
      global_avoid_emphasis: "",
      bad_fit_customers: "",
      upcomingChanges: "",
      additionalNotes: "",
    },
  };
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function mergePayload(
  value: unknown,
  variant: IntakeVariantKey,
): ClientIntakePayload {
  const defaultPayload = createDefaultPayload(variant);

  if (!value || typeof value !== "object") {
    return defaultPayload;
  }

  const draft = value as Partial<ClientIntakePayload>;

  return {
    ...defaultPayload,
    businessBasics: {
      ...defaultPayload.businessBasics,
      ...draft.businessBasics,
    },
    services: {
      ...defaultPayload.services,
      ...draft.services,
    },
    serviceStrategy: {
      ...defaultPayload.serviceStrategy,
      ...draft.serviceStrategy,
      service_treatment: {
        ...defaultPayload.serviceStrategy.service_treatment,
        ...normalizeServiceTreatmentRecord(
          draft.serviceStrategy?.service_treatment,
        ),
      },
    },
    serviceArea: {
      ...defaultPayload.serviceArea,
      ...draft.serviceArea,
    },
    leadFlow: {
      ...defaultPayload.leadFlow,
      ...draft.leadFlow,
    },
    pricingProcess: {
      ...defaultPayload.pricingProcess,
      ...draft.pricingProcess,
    },
    trust: {
      ...defaultPayload.trust,
      ...draft.trust,
    },
    customerQuestions: {
      ...defaultPayload.customerQuestions,
      ...draft.customerQuestions,
    },
    assets: {
      ...defaultPayload.assets,
      ...draft.assets,
    },
    finalNotes: {
      ...defaultPayload.finalNotes,
      ...draft.finalNotes,
      bad_fit_customers:
        draft.finalNotes?.bad_fit_customers ??
        draft.finalNotes?.customerTypesToAvoid ??
        "",
      global_avoid_emphasis:
        draft.finalNotes?.global_avoid_emphasis ??
        draft.finalNotes?.avoidSaying ??
        draft.finalNotes?.servicesToAvoid ??
        "",
      homepage_must_include:
        draft.finalNotes?.homepage_must_include ??
        draft.finalNotes?.mustInclude ??
        "",
    },
    variant,
  };
}

function updateArrayValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeServiceTreatment(
  treatment:
    | ServiceTreatment
    | "Promote heavily"
    | "Include normally"
    | "Mention only if relevant",
): ServiceTreatment {
  if (treatment === "Promote heavily") {
    return "Feature heavily";
  }

  if (treatment === "Include normally") {
    return "Standard Service";
  }

  if (treatment === "Mention only if relevant") {
    return "Non-priority";
  }

  return treatment;
}

function normalizeServiceTreatmentRecord(
  serviceTreatment: Record<string, ServiceTreatment> | undefined,
) {
  if (!serviceTreatment) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(serviceTreatment).map(([service, treatment]) => [
      service,
      normalizeServiceTreatment(treatment),
    ]),
  );
}

function TextField({
  help,
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  help?: ReactNode;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "email" | "tel" | "text" | "url";
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center gap-2">
        <span className="type-caption font-semibold text-service-ink">
          {label}
        </span>
        {help}
      </span>
      <input
        className="type-text-sm radius-button min-h-12 border border-service-border bg-white px-4 text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  rows = 3,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="type-caption font-semibold text-service-ink">
        {label}
      </span>
      <textarea
        className="type-text-sm radius-medium min-h-28 resize-y border border-service-border bg-white px-4 py-3 text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function CheckboxCard({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cx(
        "type-text-sm radius-button flex min-h-12 cursor-pointer items-center gap-3 border px-3 py-2 font-semibold transition-colors",
        checked
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
      )}
    >
      <input
        checked={checked}
        className="size-4 accent-service-accent"
        onChange={onChange}
        type="checkbox"
      />
      <span>{label}</span>
    </label>
  );
}

function RadioCard({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}) {
  return (
    <label
      className={cx(
        "type-text-sm radius-button flex min-h-12 cursor-pointer items-center gap-3 border px-3 py-2 font-semibold transition-colors",
        checked
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent",
      )}
    >
      <input
        checked={checked}
        className="size-4 accent-service-accent"
        name={name}
        onChange={onChange}
        type="radio"
      />
      <span>{label}</span>
    </label>
  );
}

function StepProgress({ currentStep }: { currentStep: number }) {
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-4">
        <span className="type-caption font-semibold text-service-muted">
          Step {currentStep} of {steps.length}
        </span>
        <span className="type-caption font-semibold text-service-muted">
          {progressPercent}%
        </span>
      </div>
      <div
        aria-label="Intake progress"
        aria-valuemax={steps.length}
        aria-valuemin={1}
        aria-valuenow={currentStep}
        className="h-2 w-full overflow-hidden rounded-full bg-service-border"
        role="progressbar"
      >
        <span
          className="block h-full rounded-full bg-service-accent transition-[width] duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function QuestionBlock({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <fieldset className="grid layout-gap-med">
      <div className="fluid-type-frame">
        <legend className="type-heading-md text-service-ink">{title}</legend>
        {description ? (
          <p className="type-text-md mt-heading-body-sm text-service-muted">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </fieldset>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value?: string | string[] | null;
}) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(", ") : value ?? "";

  return (
    <div className="grid gap-1 border-b border-service-border py-3 last:border-b-0">
      <dt className="type-caption font-semibold uppercase text-service-muted">
        {label}
      </dt>
      <dd className="type-text-sm text-service-ink">
        {text.trim() || "Not provided"}
      </dd>
    </div>
  );
}

export function ClientIntakeWizard({
  variant = "home-services",
}: ClientIntakeWizardProps) {
  const variantConfig = intakeVariants[variant];
  const storageKey = `${baseStorageKey}-${variant}`;
  const [currentStep, setCurrentStep] = useState(1);
  const [payload, setPayload] = useState<ClientIntakePayload>(() =>
    createDefaultPayload(variant),
  );
  const [isDraftReady, setIsDraftReady] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    const loadDraftId = window.setTimeout(() => {
      const storedDraft = window.sessionStorage.getItem(storageKey);

      if (!storedDraft) {
        setIsDraftReady(true);
        return;
      }

      try {
        const parsedDraft = JSON.parse(storedDraft) as {
          currentStep?: number;
          payload?: unknown;
        };

        setPayload(mergePayload(parsedDraft.payload, variant));
        setCurrentStep(
          typeof parsedDraft.currentStep === "number"
            ? Math.min(steps.length, Math.max(1, parsedDraft.currentStep))
            : 1,
        );
      } catch {
        window.sessionStorage.removeItem(storageKey);
      } finally {
        setIsDraftReady(true);
      }
    }, 0);

    return () => window.clearTimeout(loadDraftId);
  }, [storageKey, variant]);

  useEffect(() => {
    if (!isDraftReady || submitState === "success") {
      return;
    }

    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({ currentStep, payload }),
    );
  }, [currentStep, isDraftReady, payload, storageKey, submitState]);

  const currentStepMeta = steps[currentStep - 1];
  const isReviewStep = currentStep === steps.length;
  const mainServices = useMemo(
    () =>
      [
        ...payload.services.mainServices,
        ...parseCommaList(payload.services.otherMainServices),
      ]
        .map((item) => item.trim())
        .filter(Boolean),
    [payload.services.mainServices, payload.services.otherMainServices],
  );

  function updatePayload<K extends ClientIntakeAnswerSection>(
    section: K,
    value: Partial<ClientIntakePayload[K]>,
  ) {
    setPayload((currentPayload) => ({
      ...currentPayload,
      [section]: {
        ...currentPayload[section],
        ...value,
      },
    }));
  }

  function goToStep(nextStep: number) {
    setSubmitMessage("");
    setCurrentStep(Math.min(steps.length, Math.max(1, nextStep)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitIntake() {
    if (!isReviewStep || submitState === "submitting") {
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/intake", {
        body: JSON.stringify({ payload }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error ?? "Unable to submit intake.");
      }

      window.sessionStorage.removeItem(storageKey);
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (submitState === "success") {
    return (
      <main className="min-h-screen bg-bg-page text-service-ink">
        <div className="container-content grid min-h-screen place-items-center py-[var(--section-space-med)]">
          <section className="radius-medium grid max-w-3xl gap-6 border border-service-border bg-white p-[var(--container-gutter)] text-center shadow-service">
            <p className="type-label text-service-accent">Intake submitted</p>
            <h1 className="type-heading-lg text-service-ink">
              Thanks, we got the brief.
            </h1>
            <p className="type-text-md mx-auto text-service-muted">
              Your intake answers were sent successfully. We will use this to
              shape the first website pass and flag anything that needs follow-up.
            </p>
            <div>
              <button
                className="type-text-sm radius-button min-h-12 border border-service-accent bg-service-accent px-6 font-semibold text-white transition-colors hover:bg-service-ink"
                onClick={() => {
                  setPayload(createDefaultPayload(variant));
                  setCurrentStep(1);
                  setSubmitState("idle");
                }}
                type="button"
              >
                Start Another Intake
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <form
      className="min-h-screen bg-bg-page text-service-ink"
      onSubmit={(event) => event.preventDefault()}
    >
      <header className="fixed inset-x-0 top-0 z-30 border-b border-service-border bg-bg-page/95 backdrop-blur">
        <div className="container-site grid gap-3 py-4">
          <div className="flex items-start gap-4 max-md:flex-col">
            <div className="fluid-type-frame min-w-0 flex-1 max-md:w-full">
              <p className="type-label text-service-accent">Client intake</p>
              <h1 className="type-heading-sm mt-eyebrow-heading-sm max-w-none text-service-ink">
                {variantConfig.label}
              </h1>
            </div>
            <p className="type-caption w-96 max-w-full shrink-0 text-right text-service-muted max-md:w-full max-md:text-left">
              {variantConfig.examples}
            </p>
          </div>
          <StepProgress currentStep={currentStep} />
        </div>
      </header>

      <main className="container-content pb-40 pt-44 max-md:pt-52 max-sm:pt-56">
        <section className="mx-auto grid max-w-4xl layout-gap-lrg">
          <div className="fluid-type-frame">
            <p className="type-label text-service-accent">
              {currentStepMeta.eyebrow}
            </p>
            <h2 className="type-heading-xl mt-eyebrow-heading-md text-service-ink">
              {currentStepMeta.title}
            </h2>
            {currentStepMeta.subhead ? (
              <p className="type-text-lg mt-heading-body-md text-service-muted">
                {currentStepMeta.subhead}
              </p>
            ) : null}
          </div>

          <div className="radius-medium border border-service-border bg-white p-[var(--container-gutter)] shadow-service">
            {currentStep === 1 ? (
              <BusinessBasicsStep
                payload={payload.businessBasics}
                update={(value) => updatePayload("businessBasics", value)}
              />
            ) : null}
            {currentStep === 2 ? (
              <ServicesStep
                payload={payload.services}
                update={(value) => updatePayload("services", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 3 ? (
              <ServiceStrategyStep
                payload={payload.serviceStrategy}
                selectedServices={mainServices}
                update={(value) => updatePayload("serviceStrategy", value)}
              />
            ) : null}
            {currentStep === 4 ? (
              <ServiceAreaStep
                payload={payload.serviceArea}
                update={(value) => updatePayload("serviceArea", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 5 ? (
              <LeadFlowStep
                payload={payload.leadFlow}
                update={(value) => updatePayload("leadFlow", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 6 ? (
              <PricingProcessStep
                payload={payload.pricingProcess}
                update={(value) => updatePayload("pricingProcess", value)}
              />
            ) : null}
            {currentStep === 7 ? (
              <TrustStep
                payload={payload.trust}
                update={(value) => updatePayload("trust", value)}
              />
            ) : null}
            {currentStep === 8 ? (
              <CustomerQuestionsStep
                payload={payload.customerQuestions}
                update={(value) => updatePayload("customerQuestions", value)}
                placeholders={variantConfig.customerQuestionPlaceholders}
              />
            ) : null}
            {currentStep === 9 ? (
              <AssetsStep
                payload={payload.assets}
                update={(value) => updatePayload("assets", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 10 ? (
              <FinalNotesStep
                payload={payload.finalNotes}
                update={(value) => updatePayload("finalNotes", value)}
              />
            ) : null}
            {currentStep === 11 ? (
              <ReviewStep
                mainServices={mainServices}
                onEditStep={goToStep}
                payload={payload}
                variantLabel={variantConfig.label}
              />
            ) : null}
          </div>

          {submitState === "error" ? (
            <p className="type-text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
              {submitMessage}
            </p>
          ) : null}
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-service-border bg-bg-page/95 backdrop-blur">
        <div className="container-site flex items-center justify-between gap-3 py-4 max-sm:flex-col max-sm:items-stretch">
          <button
            className="type-text-sm radius-button min-h-12 border border-service-border bg-white px-5 font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-45"
            disabled={currentStep === 1 || submitState === "submitting"}
            onClick={() => goToStep(currentStep - 1)}
            type="button"
          >
            Back
          </button>

          <p className="type-caption text-service-muted max-sm:hidden">
            {currentStepMeta.title}
          </p>

          {isReviewStep ? (
            <button
              className="type-text-sm radius-button min-h-12 border border-service-accent bg-service-accent px-6 font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-wait disabled:opacity-70"
              disabled={submitState === "submitting"}
              onClick={() => void submitIntake()}
              type="button"
            >
              {submitState === "submitting" ? "Submitting..." : "Submit intake"}
            </button>
          ) : (
            <button
              className="type-text-sm radius-button min-h-12 border border-service-accent bg-service-accent px-6 font-semibold text-white transition-colors hover:bg-service-ink"
              onClick={() => goToStep(currentStep + 1)}
              type="button"
            >
              Continue
            </button>
          )}
        </div>
      </footer>
    </form>
  );
}

function BusinessBasicsStep({
  payload,
  update,
}: {
  payload: BusinessBasics;
  update: (value: Partial<BusinessBasics>) => void;
}) {
  return (
    <QuestionBlock title="Tell us the basics about the business.">
      <div className="grid layout-gap-med">
        <TextField
          label="Business name"
          onChange={(businessName) => update({ businessName })}
          placeholder="The public business name customers know you by"
          value={payload.businessName}
        />
        <div className="layout-gap-med grid grid-cols-3 max-lg:grid-cols-1">
          <TextField
            label="Main contact name"
            onChange={(contactName) => update({ contactName })}
            placeholder="Who should we contact with website questions?"
            value={payload.contactName}
          />
          <TextField
            label="Contact email"
            onChange={(contactEmail) => update({ contactEmail })}
            placeholder="name@example.com"
            type="email"
            value={payload.contactEmail}
          />
          <TextField
            label="Contact phone"
            onChange={(contactPhone) => update({ contactPhone })}
            placeholder="Best phone number for project follow-up"
            type="tel"
            value={payload.contactPhone}
          />
        </div>
        <div className="layout-gap-med grid grid-cols-2 max-md:grid-cols-1">
          <TextField
            label="Current website"
            onChange={(website) => update({ website })}
            placeholder="https://your-current-website.com"
            type="url"
            value={payload.website}
          />
        </div>
        <TextAreaField
          label="Business address"
          onChange={(businessAddress) => update({ businessAddress })}
          placeholder="Street address, city, state, ZIP, or a note like service-area business with no public storefront"
          rows={2}
          value={payload.businessAddress}
        />
        <TextAreaField
          label="Business hours"
          onChange={(businessHours) => update({ businessHours })}
          placeholder="Public hours, phone hours, appointment hours, or emergency/after-hours availability if true"
          rows={2}
          value={payload.businessHours}
        />
      </div>
    </QuestionBlock>
  );
}

function ServicesStep({
  payload,
  update,
  variant,
}: {
  payload: ServicesAnswers;
  update: (value: Partial<ServicesAnswers>) => void;
  variant: (typeof intakeVariants)[IntakeVariantKey];
}) {
  return (
    <QuestionBlock description={variant.helperText.services} title="What are your main services?">
      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {variant.serviceOptions.map((option) => (
          <CheckboxCard
            checked={payload.mainServices.includes(option)}
            key={option}
            label={option}
            onChange={() =>
              update({
                mainServices: updateArrayValue(payload.mainServices, option),
              })
            }
          />
        ))}
      </div>
      <TextAreaField
        label="Other services"
        onChange={(otherMainServices) => update({ otherMainServices })}
        placeholder="Add services that are not listed above. Separate each service with a comma."
        rows={4}
        value={payload.otherMainServices}
      />
      <TextAreaField
        label={variant.priorityServicesLabel}
        onChange={(priorityServices) => update({ priorityServices })}
        placeholder="List the services, jobs, packages, or requests you most want."
        rows={4}
        value={payload.priorityServices}
      />
      <AdditionalNotesField
        onChange={(additionalNotes) => update({ additionalNotes })}
        placeholder="Add any services, packages, or job types that were not covered by the checkboxes, especially ones you want the website to mention clearly."
        value={payload.additionalNotes}
      />
    </QuestionBlock>
  );
}

function ServiceStrategyStep({
  payload,
  selectedServices,
  update,
}: {
  payload: ServiceStrategyAnswers;
  selectedServices: string[];
  update: (value: Partial<ServiceStrategyAnswers>) => void;
}) {
  const needsEmergencyLimits =
    payload.emergency_service_availability === "Yes" ||
    payload.emergency_service_availability ===
      "Limited / depends on availability";

  function updateServiceTreatment(
    service: string,
    treatment: ServiceTreatment,
  ) {
    update({
      service_treatment: {
        ...payload.service_treatment,
        [service]: treatment,
      },
    });
  }

  return (
    <div className="grid layout-gap-lrg">
      <QuestionBlock
        description="For each selected service, choose how strongly the website should position it."
        title="How should the website treat each service?"
      >
        {selectedServices.length > 0 ? (
          <div className="grid gap-4">
            {selectedServices.map((service) => (
              <div
                className="radius-medium border border-service-border bg-service-surface p-4"
                key={service}
              >
                <p className="type-caption font-semibold text-service-ink">
                  {service}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                  {serviceTreatmentOptions.map((option) => (
                    <RadioCard
                      checked={payload.service_treatment[service] === option}
                      key={option}
                      label={option}
                      name={`service-treatment-${service}`}
                      onChange={() => updateServiceTreatment(service, option)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="type-text-sm text-service-muted">
            Select services in the previous step, then classify how the website
            should treat each one.
          </p>
        )}
      </QuestionBlock>

      <QuestionBlock title="Do you offer emergency or after-hours service?">
        <div className="grid grid-cols-3 gap-2 max-md:grid-cols-1">
          {emergencyAvailabilityOptions.map((option) => (
            <RadioCard
              checked={payload.emergency_service_availability === option}
              key={option}
              label={option}
              name="emergency-service-availability"
              onChange={() =>
                update({ emergency_service_availability: option })
              }
            />
          ))}
        </div>
        {needsEmergencyLimits ? (
          <TextAreaField
            label="What should the website avoid promising about emergency service?"
            onChange={(emergency_service_limitations) =>
              update({ emergency_service_limitations })
            }
            placeholder="Clarify what the website should not promise about emergency, same-day, after-hours, distance, schedule, or technician availability."
            rows={4}
            value={payload.emergency_service_limitations}
          />
        ) : null}
      </QuestionBlock>

      <AdditionalNotesField
        onChange={(additionalNotes) => update({ additionalNotes })}
        placeholder="Add any service priority notes that the options above did not capture, like seasonal work, jobs you only take sometimes, or services you want handled carefully."
        value={payload.additionalNotes}
      />
    </div>
  );
}

function OptionalSummaryRow({
  label,
  value,
}: {
  label: string;
  value?: string | string[] | null;
}) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(", ") : value ?? "";

  if (!text.trim()) {
    return null;
  }

  return <SummaryRow label={label} value={text} />;
}

function AdditionalNotesField({
  onChange,
  placeholder,
  value,
}: {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <TextAreaField
      label="Additional notes"
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      value={value}
    />
  );
}

function ServiceAreaStep({
  payload,
  update,
  variant,
}: {
  payload: ServiceAreaAnswers;
  update: (value: Partial<ServiceAreaAnswers>) => void;
  variant: (typeof intakeVariants)[IntakeVariantKey];
}) {
  return (
    <QuestionBlock description={variant.helperText.serviceArea} title="Where should the website focus?">
      <div className="grid layout-gap-med">
        <TextAreaField
          label="What towns, cities, or neighborhoods do you serve?"
          onChange={(townsCities) => update({ townsCities })}
          placeholder="List the areas customers should see on the website, including neighborhoods or nearby cities if they matter."
          rows={3}
          value={payload.townsCities}
        />
        <TextAreaField
          label="Which areas are most important to promote?"
          onChange={(priorityAreas) => update({ priorityAreas })}
          placeholder="Add the areas you most want calls from, or the places that should be emphasized first."
          rows={3}
          value={payload.priorityAreas}
        />
        <TextAreaField
          label="Do you have a service radius or travel limit?"
          onChange={(serviceRadius) => update({ serviceRadius })}
          placeholder="Mention drive-time limits, mileage, county boundaries, or how far you go for different job types."
          rows={2}
          value={payload.serviceRadius}
        />
        <TextAreaField
          label="Are there any minimum job sizes, trip fees, or location limits customers should know about?"
          onChange={(locationLimits) => update({ locationLimits })}
          placeholder="Add location-based limits, travel fees, minimum job rules, or areas where availability is different."
          rows={3}
          value={payload.locationLimits}
        />
        <AdditionalNotesField
          onChange={(additionalNotes) => update({ additionalNotes })}
          placeholder="Add any service-area details that were not covered above, like neighborhoods to emphasize, towns to avoid, travel limits, or area-specific exceptions."
          value={payload.additionalNotes}
        />
      </div>
    </QuestionBlock>
  );
}

function LeadFlowStep({
  payload,
  update,
  variant,
}: {
  payload: LeadFlowAnswers;
  update: (value: Partial<LeadFlowAnswers>) => void;
  variant: (typeof intakeVariants)[IntakeVariantKey];
}) {
  return (
    <div className="grid layout-gap-lrg">
      <QuestionBlock
        description={variant.helperText.leadFlow}
        title="When a new customer reaches out today, what usually happens?"
      >
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {currentProcessOptions.map((option) => (
            <CheckboxCard
              checked={payload.currentProcess.includes(option)}
              key={option}
              label={option}
              onChange={() =>
                update({
                  currentProcess: updateArrayValue(
                    payload.currentProcess,
                    option,
                  ),
                })
              }
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock title="What should the website encourage first?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {primaryActionOptions.map((option) => (
            <RadioCard
              checked={payload.primaryAction === option}
              key={option}
              label={option}
              name="primary-action"
              onChange={() => update({ primaryAction: option })}
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock title="What should the secondary call to action be?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {primaryActionOptions.map((option) => (
            <RadioCard
              checked={payload.secondaryAction === option}
              key={option}
              label={option}
              name="secondary-action"
              onChange={() => update({ secondaryAction: option })}
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock title="What should happen after someone submits a form?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {afterFormSubmitOptions.map((option) => (
            <CheckboxCard
              checked={payload.afterFormSubmit.includes(option)}
              key={option}
              label={option}
              onChange={() =>
                update({
                  afterFormSubmit: updateArrayValue(
                    payload.afterFormSubmit,
                    option,
                  ),
                })
              }
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock title="How fast do you usually try to respond to new inquiries?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {responseTimeOptions.map((option) => (
            <RadioCard
              checked={payload.responseTime === option}
              key={option}
              label={option}
              name="response-time"
              onChange={() => update({ responseTime: option })}
            />
          ))}
        </div>
      </QuestionBlock>

      <AdditionalNotesField
        onChange={(additionalNotes) => update({ additionalNotes })}
        placeholder="Add any lead-flow details the checkboxes missed, like who answers calls, booking tools, follow-up preferences, or situations where customers should call instead of filling out a form."
        value={payload.additionalNotes}
      />
    </div>
  );
}

function PricingProcessStep({
  payload,
  update,
}: {
  payload: PricingProcessAnswers;
  update: (value: Partial<PricingProcessAnswers>) => void;
}) {
  return (
    <div className="grid layout-gap-lrg">
      <QuestionBlock title="What can we safely say about pricing, estimates, or diagnostic fees?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {pricingProcessSignalOptions.map((option) => (
            <CheckboxCard
              checked={payload.pricing_process_signals.includes(option)}
              key={option}
              label={option}
              onChange={() =>
                update({
                  pricing_process_signals: updateArrayValue(
                    payload.pricing_process_signals,
                    option,
                  ),
                })
              }
            />
          ))}
        </div>
      </QuestionBlock>

      <TextAreaField
        label="Any pricing language we should use or avoid?"
        onChange={(pricing_language_notes) =>
          update({ pricing_language_notes })
        }
        placeholder="Add diagnostic fees, estimate language, price ranges, quote requirements, or pricing claims the website should avoid before diagnosis."
        rows={4}
        value={payload.pricing_language_notes}
      />
      <AdditionalNotesField
        onChange={(additionalNotes) => update({ additionalNotes })}
        placeholder="Add any pricing, estimate, diagnostic, or process details that should be explained carefully on the website but were not covered above."
        value={payload.additionalNotes}
      />
    </div>
  );
}

function TrustStep({
  payload,
  update,
}: {
  payload: TrustAnswers;
  update: (value: Partial<TrustAnswers>) => void;
}) {
  return (
    <QuestionBlock title="Select the trust points we can use publicly.">
      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {trustSignalOptions.map((option) => (
          <CheckboxCard
            checked={payload.signals.includes(option)}
            key={option}
            label={option}
            onChange={() =>
              update({
                signals: updateArrayValue(payload.signals, option),
              })
            }
          />
        ))}
      </div>
      <div className="grid layout-gap-med">
        <TextField
          label="Years in business"
          onChange={(yearsInBusiness) => update({ yearsInBusiness })}
          placeholder="Only enter this if it is accurate and okay to mention publicly."
          value={payload.yearsInBusiness}
        />
        <TextAreaField
          label="What do customers usually compliment you for?"
          onChange={(compliments) => update({ compliments })}
          placeholder="Mention common praise from customers, reviews, referrals, or repeat clients."
          rows={3}
          value={payload.compliments}
        />
        <TextAreaField
          label="What do you do differently from competitors?"
          onChange={(competitorDifference) => update({ competitorDifference })}
          placeholder="Describe real differences in service, communication, pricing approach, quality, speed, experience, or specialization."
          rows={3}
          value={payload.competitorDifference}
        />
        <TextAreaField
          label="Are there any claims we should avoid making?"
          onChange={(claimsToAvoid) => update({ claimsToAvoid })}
          placeholder="List credentials, guarantees, availability, pricing, awards, or claims that should not appear unless verified."
          rows={3}
          value={payload.claimsToAvoid}
        />
        <AdditionalNotesField
          onChange={(additionalNotes) => update({ additionalNotes })}
          placeholder="Add any trust signals, customer compliments, credentials, awards, proof points, or claims to avoid that were not represented by the options above."
          value={payload.additionalNotes}
        />
      </div>
    </QuestionBlock>
  );
}

function CustomerQuestionsStep({
  payload,
  placeholders,
  update,
}: {
  payload: CustomerQuestionsAnswers;
  placeholders: [string, string, string];
  update: (value: Partial<CustomerQuestionsAnswers>) => void;
}) {
  return (
    <QuestionBlock title="What do customers ask before they feel ready?">
      <div className="grid layout-gap-med">
        <TextField
          label="Question customers ask before contacting you"
          onChange={(beforeContact) => update({ beforeContact })}
          placeholder={placeholders[0]}
          value={payload.beforeContact}
        />
        <TextField
          label="Question customers ask about pricing, timing, or process"
          onChange={(pricingTimingProcess) => update({ pricingTimingProcess })}
          placeholder={placeholders[1]}
          value={payload.pricingTimingProcess}
        />
        <TextField
          label="Question customers ask when comparing you to competitors"
          onChange={(competitorComparison) => update({ competitorComparison })}
          placeholder={placeholders[2]}
          value={payload.competitorComparison}
        />
        <AdditionalNotesField
          onChange={(additionalNotes) => update({ additionalNotes })}
          placeholder="Add any customer questions, concerns, objections, or comparison points that the fields above did not capture."
          value={payload.additionalNotes}
        />
      </div>
    </QuestionBlock>
  );
}

function AssetsStep({
  payload,
  update,
  variant,
}: {
  payload: AssetAnswers;
  update: (value: Partial<AssetAnswers>) => void;
  variant: (typeof intakeVariants)[IntakeVariantKey];
}) {
  return (
    <div className="grid layout-gap-lrg">
      <QuestionBlock description={variant.helperText.assets} title="Where can we find your assets?">
        <TextField
          label="Google Drive / Dropbox folder link"
          onChange={(folderLink) => update({ folderLink })}
          placeholder="Paste a folder link with photos, logo files, brand assets, or project examples."
          type="url"
          value={payload.folderLink}
        />
      </QuestionBlock>

      <QuestionBlock title="What should the folder include?">
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {folderIncludeOptions.map((option) => (
            <CheckboxCard
              checked={payload.folderIncludes.includes(option)}
              key={option}
              label={option}
              onChange={() =>
                update({
                  folderIncludes: updateArrayValue(
                    payload.folderIncludes,
                    option,
                  ),
                })
              }
            />
          ))}
        </div>
      </QuestionBlock>

      <div className="grid layout-gap-med">
        <TextAreaField
          label="Do you have a current promo, special, or seasonal offer?"
          onChange={(promoOffer) => update({ promoOffer })}
          placeholder="Describe any offer that is active now, seasonal, or important to mention soon."
          rows={3}
          value={payload.promoOffer}
        />
        <TextAreaField
          label="Are there any competitors or websites you like?"
          onChange={(competitorReferences) => update({ competitorReferences })}
          placeholder="Add competitor names, website links, or notes about layouts, wording, offers, or visuals you like or dislike."
          rows={3}
          value={payload.competitorReferences}
        />
        <AdditionalNotesField
          onChange={(additionalNotes) => update({ additionalNotes })}
          placeholder="Add any asset notes the checkboxes missed, like where photos live, which images are outdated, logo concerns, or examples of sites/assets you want us to reference."
          value={payload.additionalNotes}
        />
      </div>
    </div>
  );
}

function FinalNotesStep({
  payload,
  update,
}: {
  payload: FinalNotesAnswers;
  update: (value: Partial<FinalNotesAnswers>) => void;
}) {
  return (
    <div className="grid layout-gap-lrg">
      <QuestionBlock title="Are there any services, plans, memberships, or offers you want the site to leave room for later?">
        <TextAreaField
          label="Future offer name or description"
          onChange={(future_offers) => update({ future_offers })}
          placeholder="Add future memberships, seasonal offers, plans, packages, financing, or services the site should leave room for."
          rows={3}
          value={payload.future_offers}
        />
        <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
          {futureOfferVisibilityOptions.map((option) => (
            <RadioCard
              checked={payload.future_offer_visibility === option}
              key={option}
              label={option}
              name="future-offer-visibility"
              onChange={() => update({ future_offer_visibility: option })}
            />
          ))}
        </div>
      </QuestionBlock>

      <QuestionBlock title="Final page notes">
        <TextAreaField
          label="Anything that must appear on the homepage?"
          onChange={(homepage_must_include) =>
            update({ homepage_must_include })
          }
          placeholder="Mention homepage must-haves like priority services, service areas, phone-first CTA, proof points, or urgent messaging."
          rows={3}
          value={payload.homepage_must_include}
        />
        <TextAreaField
          label="Anything that must appear on the services page?"
          onChange={(services_page_must_include) =>
            update({ services_page_must_include })
          }
          placeholder="Mention services page must-haves like specific services, packages, service categories, exclusions, or how services should be grouped."
          rows={3}
          value={payload.services_page_must_include}
        />
        <TextAreaField
          label="Anything that must appear near the contact/request quote form?"
          onChange={(contact_form_must_include) =>
            update({ contact_form_must_include })
          }
          placeholder="Mention form-area details like response expectations, required fields, phone alternatives, scheduling notes, or what happens next."
          rows={3}
          value={payload.contact_form_must_include}
        />
        <TextAreaField
          label="Anything we should avoid emphasizing anywhere?"
          onChange={(global_avoid_emphasis) =>
            update({ global_avoid_emphasis })
          }
          placeholder="Services, claims, audiences, offers, guarantees, or language that should stay quiet."
          rows={3}
          value={payload.global_avoid_emphasis}
        />
        <TextAreaField
          label="Who is not a good fit?"
          onChange={(bad_fit_customers) => update({ bad_fit_customers })}
          placeholder="Name customers, job types, locations, budgets, timelines, or requests the website should quietly discourage."
          rows={3}
          value={payload.bad_fit_customers}
        />
        <TextAreaField
          label="Any important business changes coming soon?"
          onChange={(upcomingChanges) => update({ upcomingChanges })}
          placeholder="Mention upcoming service changes, staff changes, new offers, moving locations, rebrands, seasonality, or timing-sensitive updates."
          rows={3}
          value={payload.upcomingChanges}
        />
        <AdditionalNotesField
          onChange={(additionalNotes) => update({ additionalNotes })}
          placeholder="Add any final website notes, upcoming changes, must-include details, or things the site should avoid emphasizing that were not covered above."
          value={payload.additionalNotes}
        />
      </QuestionBlock>
    </div>
  );
}

function ReviewStep({
  mainServices,
  onEditStep,
  payload,
  variantLabel,
}: {
  mainServices: string[];
  onEditStep: (step: number) => void;
  payload: ClientIntakePayload;
  variantLabel: string;
}) {
  return (
    <div className="grid layout-gap-med">
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <ReviewCard onEdit={() => onEditStep(1)} title="Business basics">
          <SummaryRow label="Business type" value={variantLabel} />
          <SummaryRow label="Business" value={payload.businessBasics.businessName} />
          <SummaryRow
            label="Main contact"
            value={[
              payload.businessBasics.contactName,
              payload.businessBasics.contactEmail,
              payload.businessBasics.contactPhone,
            ]}
          />
          <SummaryRow label="Website" value={payload.businessBasics.website} />
          <SummaryRow
            label="Address / hours"
            value={[
              payload.businessBasics.businessAddress,
              payload.businessBasics.businessHours,
            ]}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(2)} title="Main services">
          <SummaryRow label="Selected services" value={mainServices} />
          <SummaryRow
            label="Priority services"
            value={payload.services.priorityServices}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.services.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(3)} title="Service priorities">
          <SummaryRow
            label="Service treatment"
            value={formatServiceTreatmentSummary(
              payload.serviceStrategy.service_treatment,
            )}
          />
          <SummaryRow
            label="Emergency / after-hours"
            value={payload.serviceStrategy.emergency_service_availability}
          />
          <SummaryRow
            label="Emergency limitations"
            value={payload.serviceStrategy.emergency_service_limitations}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.serviceStrategy.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(4)} title="Service area">
          <SummaryRow label="Service area" value={payload.serviceArea.townsCities} />
          <SummaryRow
            label="Priority areas"
            value={payload.serviceArea.priorityAreas}
          />
          <SummaryRow
            label="Limits"
            value={[
              payload.serviceArea.serviceRadius,
              payload.serviceArea.locationLimits,
            ]}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.serviceArea.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(5)} title="Preferred contact flow">
          <SummaryRow
            label="Current process"
            value={payload.leadFlow.currentProcess}
          />
          <SummaryRow label="Primary action" value={payload.leadFlow.primaryAction} />
          <SummaryRow
            label="Secondary action"
            value={payload.leadFlow.secondaryAction}
          />
          <SummaryRow
            label="After submit"
            value={payload.leadFlow.afterFormSubmit}
          />
          <SummaryRow label="Response speed" value={payload.leadFlow.responseTime} />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.leadFlow.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(6)} title="Pricing and process">
          <SummaryRow
            label="Pricing signals"
            value={payload.pricingProcess.pricing_process_signals}
          />
          <SummaryRow
            label="Pricing language"
            value={payload.pricingProcess.pricing_language_notes}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.pricingProcess.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(7)} title="Trust points">
          <SummaryRow label="Trust signals" value={payload.trust.signals} />
          <SummaryRow label="Compliments" value={payload.trust.compliments} />
          <SummaryRow
            label="Competitor difference"
            value={payload.trust.competitorDifference}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.trust.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(8)} title="Common customer questions">
          <SummaryRow
            label="Before contacting"
            value={payload.customerQuestions.beforeContact}
          />
          <SummaryRow
            label="Pricing / process"
            value={payload.customerQuestions.pricingTimingProcess}
          />
          <SummaryRow
            label="Comparison"
            value={payload.customerQuestions.competitorComparison}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.customerQuestions.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(9)} title="Asset folder / references">
          <SummaryRow label="Folder link" value={payload.assets.folderLink} />
          <SummaryRow label="Folder includes" value={payload.assets.folderIncludes} />
          <SummaryRow label="Promo" value={payload.assets.promoOffer} />
          <SummaryRow
            label="References"
            value={payload.assets.competitorReferences}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.assets.additionalNotes}
          />
        </ReviewCard>

        <ReviewCard onEdit={() => onEditStep(10)} title="Final notes">
          <SummaryRow
            label="Future offers"
            value={payload.finalNotes.future_offers}
          />
          <SummaryRow
            label="Future offer visibility"
            value={payload.finalNotes.future_offer_visibility}
          />
          <SummaryRow
            label="Homepage must include"
            value={payload.finalNotes.homepage_must_include}
          />
          <SummaryRow
            label="Services page must include"
            value={payload.finalNotes.services_page_must_include}
          />
          <SummaryRow
            label="Contact form must include"
            value={payload.finalNotes.contact_form_must_include}
          />
          <SummaryRow
            label="Avoid emphasizing"
            value={payload.finalNotes.global_avoid_emphasis}
          />
          <SummaryRow
            label="Who is not a good fit"
            value={payload.finalNotes.bad_fit_customers}
          />
          <SummaryRow
            label="Upcoming changes"
            value={payload.finalNotes.upcomingChanges}
          />
          <OptionalSummaryRow
            label="Additional notes"
            value={payload.finalNotes.additionalNotes}
          />
        </ReviewCard>
      </div>
    </div>
  );
}

function formatServiceTreatmentSummary(
  serviceTreatment: Record<string, ServiceTreatment>,
) {
  return Object.entries(serviceTreatment).map(
    ([service, treatment]) => `${service}: ${treatment}`,
  );
}

function ReviewCard({
  children,
  onEdit,
  title,
}: {
  children: ReactNode;
  onEdit: () => void;
  title: string;
}) {
  return (
    <section className="radius-medium border border-service-border bg-service-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="type-heading-sm text-service-ink">{title}</h3>
        <button
          className="type-caption radius-button min-h-9 shrink-0 border border-service-border bg-white px-3 font-semibold text-service-muted transition-colors hover:border-service-accent hover:text-service-accent"
          onClick={onEdit}
          type="button"
        >
          Edit
        </button>
      </div>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}
