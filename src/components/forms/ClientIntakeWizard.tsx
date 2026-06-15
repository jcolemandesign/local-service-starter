"use client";

import type { FormEvent, ReactNode } from "react";
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
  googleBusinessProfile: string;
  businessAddress: string;
  businessHours: string;
};

type ServicesAnswers = {
  mainServices: string[];
  otherMainServices: string;
  priorityServices: string;
};

type ServiceAreaAnswers = {
  townsCities: string;
  priorityAreas: string;
  serviceRadius: string;
  locationLimits: string;
};

type LeadFlowAnswers = {
  currentProcess: string[];
  primaryAction: string;
  afterFormSubmit: string[];
  responseTime: string;
};

type TrustAnswers = {
  signals: string[];
  yearsInBusiness: string;
  compliments: string;
  competitorDifference: string;
  claimsToAvoid: string;
};

type CustomerQuestionsAnswers = {
  beforeContact: string;
  pricingTimingProcess: string;
  competitorComparison: string;
};

type AssetAnswers = {
  folderLink: string;
  folderIncludes: string[];
  promoOffer: string;
  competitorReferences: string;
};

type FinalNotesAnswers = {
  mustInclude: string;
  avoidSaying: string;
  servicesToAvoid: string;
  customerTypesToAvoid: string;
  upcomingChanges: string;
};

export type ClientIntakePayload = {
  variant: IntakeVariantKey;
  businessBasics: BusinessBasics;
  services: ServicesAnswers;
  serviceArea: ServiceAreaAnswers;
  leadFlow: LeadFlowAnswers;
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
  { eyebrow: "Step 2", title: "Main services" },
  { eyebrow: "Step 3", title: "Service area" },
  {
    eyebrow: "Step 4",
    title: "How new customers contact you",
    subhead:
      "This helps us make the website match how your business actually handles new inquiries.",
  },
  {
    eyebrow: "Step 5",
    title: "Why customers choose you",
    subhead:
      "Select anything that is true, important, and okay to say publicly on the website.",
  },
  {
    eyebrow: "Step 6",
    title: "Common customer questions",
    subhead:
      "These help us write better FAQs, contact sections, and service page copy.",
  },
  {
    eyebrow: "Step 7",
    title: "Photos, logo, references, and offers",
    subhead:
      "The easiest option is to send one Google Drive or Dropbox folder with anything useful.",
  },
  {
    eyebrow: "Step 8",
    title: "Final details",
    subhead: "Anything we should know before writing and building the site?",
  },
  {
    eyebrow: "Step 9",
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
      googleBusinessProfile: "",
      businessAddress: "",
      businessHours: "",
    },
    services: {
      mainServices: [],
      otherMainServices: "",
      priorityServices: "",
    },
    serviceArea: {
      townsCities: "",
      priorityAreas: "",
      serviceRadius: "",
      locationLimits: "",
    },
    leadFlow: {
      currentProcess: [],
      primaryAction: "",
      afterFormSubmit: [],
      responseTime: "",
    },
    trust: {
      signals: [],
      yearsInBusiness: "",
      compliments: "",
      competitorDifference: "",
      claimsToAvoid: "",
    },
    customerQuestions: {
      beforeContact: "",
      pricingTimingProcess: "",
      competitorComparison: "",
    },
    assets: {
      folderLink: "",
      folderIncludes: [],
      promoOffer: "",
      competitorReferences: "",
    },
    finalNotes: {
      mustInclude: "",
      avoidSaying: "",
      servicesToAvoid: "",
      customerTypesToAvoid: "",
      upcomingChanges: "",
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
    serviceArea: {
      ...defaultPayload.serviceArea,
      ...draft.serviceArea,
    },
    leadFlow: {
      ...defaultPayload.leadFlow,
      ...draft.leadFlow,
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
    },
    variant,
  };
}

function updateArrayValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
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
        className="radius-button min-h-12 border border-service-border bg-white px-4 text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
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
        className="radius-medium min-h-28 resize-y border border-service-border bg-white px-4 py-3 text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        value={value}
      />
    </label>
  );
}

function HelpPopup() {
  return (
    <details className="relative">
      <summary className="grid size-5 cursor-pointer list-none place-items-center rounded-full border border-service-border bg-service-surface text-xs font-bold text-service-muted transition-colors hover:border-service-accent hover:text-service-accent">
        ?
      </summary>
      <div className="radius-medium absolute left-0 top-7 z-20 w-72 border border-service-border bg-white p-3 text-xs leading-5 text-service-muted shadow-service">
        Open your Google Business Profile, use the share button, then paste the
        profile link here.
      </div>
    </details>
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
        "radius-button flex min-h-12 cursor-pointer items-center gap-3 border px-3 py-2 text-sm font-semibold transition-colors",
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
        "radius-button flex min-h-12 cursor-pointer items-center gap-3 border px-3 py-2 text-sm font-semibold transition-colors",
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
  value: string | string[];
}) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(", ") : value;

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
      [...payload.services.mainServices, payload.services.otherMainServices]
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isReviewStep) {
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
                className="radius-button min-h-12 border border-service-accent bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
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
      onSubmit={handleSubmit}
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
              <ServiceAreaStep
                payload={payload.serviceArea}
                update={(value) => updatePayload("serviceArea", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 4 ? (
              <LeadFlowStep
                payload={payload.leadFlow}
                update={(value) => updatePayload("leadFlow", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 5 ? (
              <TrustStep
                payload={payload.trust}
                update={(value) => updatePayload("trust", value)}
              />
            ) : null}
            {currentStep === 6 ? (
              <CustomerQuestionsStep
                payload={payload.customerQuestions}
                update={(value) => updatePayload("customerQuestions", value)}
                placeholders={variantConfig.customerQuestionPlaceholders}
              />
            ) : null}
            {currentStep === 7 ? (
              <AssetsStep
                payload={payload.assets}
                update={(value) => updatePayload("assets", value)}
                variant={variantConfig}
              />
            ) : null}
            {currentStep === 8 ? (
              <FinalNotesStep
                payload={payload.finalNotes}
                update={(value) => updatePayload("finalNotes", value)}
              />
            ) : null}
            {currentStep === 9 ? (
              <ReviewStep
                mainServices={mainServices}
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
            className="radius-button min-h-12 border border-service-border bg-white px-5 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-45"
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
              className="radius-button min-h-12 border border-service-accent bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-wait disabled:opacity-70"
              disabled={submitState === "submitting"}
              type="submit"
            >
              {submitState === "submitting" ? "Submitting..." : "Submit intake"}
            </button>
          ) : (
            <button
              className="radius-button min-h-12 border border-service-accent bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
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
          value={payload.businessName}
        />
        <div className="layout-gap-med grid grid-cols-3 max-lg:grid-cols-1">
          <TextField
            label="Main contact name"
            onChange={(contactName) => update({ contactName })}
            value={payload.contactName}
          />
          <TextField
            label="Contact email"
            onChange={(contactEmail) => update({ contactEmail })}
            type="email"
            value={payload.contactEmail}
          />
          <TextField
            label="Contact phone"
            onChange={(contactPhone) => update({ contactPhone })}
            type="tel"
            value={payload.contactPhone}
          />
        </div>
        <div className="layout-gap-med grid grid-cols-2 max-md:grid-cols-1">
          <TextField
            label="Current website"
            onChange={(website) => update({ website })}
            placeholder="https://"
            type="url"
            value={payload.website}
          />
          <TextField
            help={<HelpPopup />}
            label="Google Business Profile link"
            onChange={(googleBusinessProfile) =>
              update({ googleBusinessProfile })
            }
            placeholder="https://"
            type="url"
            value={payload.googleBusinessProfile}
          />
        </div>
        <TextAreaField
          label="Business address"
          onChange={(businessAddress) => update({ businessAddress })}
          placeholder="Street address, city, state, ZIP, or service-area note"
          rows={2}
          value={payload.businessAddress}
        />
        <TextAreaField
          label="Business hours"
          onChange={(businessHours) => update({ businessHours })}
          placeholder="Example: Mon-Fri 8-5, emergency calls 24/7"
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
      <TextField
        label="Other"
        onChange={(otherMainServices) => update({ otherMainServices })}
        placeholder="Add services that are not listed above"
        value={payload.otherMainServices}
      />
      <TextAreaField
        label={variant.priorityServicesLabel}
        onChange={(priorityServices) => update({ priorityServices })}
        placeholder="List the services, jobs, packages, or requests you most want."
        rows={4}
        value={payload.priorityServices}
      />
    </QuestionBlock>
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
          rows={3}
          value={payload.townsCities}
        />
        <TextAreaField
          label="Which areas are most important to promote?"
          onChange={(priorityAreas) => update({ priorityAreas })}
          rows={3}
          value={payload.priorityAreas}
        />
        <TextAreaField
          label="Do you have a service radius or travel limit?"
          onChange={(serviceRadius) => update({ serviceRadius })}
          rows={2}
          value={payload.serviceRadius}
        />
        <TextAreaField
          label="Are there any minimum job sizes, trip fees, or location limits customers should know about?"
          onChange={(locationLimits) => update({ locationLimits })}
          rows={3}
          value={payload.locationLimits}
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
          label="Years in business, if needed"
          onChange={(yearsInBusiness) => update({ yearsInBusiness })}
          placeholder="Example: 18 years"
          value={payload.yearsInBusiness}
        />
        <TextAreaField
          label="What do customers usually compliment you for?"
          onChange={(compliments) => update({ compliments })}
          rows={3}
          value={payload.compliments}
        />
        <TextAreaField
          label="What do you do differently from competitors?"
          onChange={(competitorDifference) => update({ competitorDifference })}
          rows={3}
          value={payload.competitorDifference}
        />
        <TextAreaField
          label="Are there any claims we should avoid making?"
          onChange={(claimsToAvoid) => update({ claimsToAvoid })}
          rows={3}
          value={payload.claimsToAvoid}
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
          placeholder="https://"
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
          rows={3}
          value={payload.promoOffer}
        />
        <TextAreaField
          label="Are there any competitors or websites you like?"
          onChange={(competitorReferences) => update({ competitorReferences })}
          placeholder="Names or notes are fine; links are optional."
          rows={3}
          value={payload.competitorReferences}
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
    <QuestionBlock title="Final checks before review.">
      <div className="grid layout-gap-med">
        <TextAreaField
          label="Anything that absolutely needs to be included?"
          onChange={(mustInclude) => update({ mustInclude })}
          rows={3}
          value={payload.mustInclude}
        />
        <TextAreaField
          label="Anything we should avoid saying?"
          onChange={(avoidSaying) => update({ avoidSaying })}
          rows={3}
          value={payload.avoidSaying}
        />
        <TextAreaField
          label="Any services you do not want to advertise?"
          onChange={(servicesToAvoid) => update({ servicesToAvoid })}
          rows={3}
          value={payload.servicesToAvoid}
        />
        <TextAreaField
          label="Any customer types you do not want to attract?"
          onChange={(customerTypesToAvoid) => update({ customerTypesToAvoid })}
          rows={3}
          value={payload.customerTypesToAvoid}
        />
        <TextAreaField
          label="Any important business changes coming soon?"
          onChange={(upcomingChanges) => update({ upcomingChanges })}
          rows={3}
          value={payload.upcomingChanges}
        />
      </div>
    </QuestionBlock>
  );
}

function ReviewStep({
  mainServices,
  payload,
  variantLabel,
}: {
  mainServices: string[];
  payload: ClientIntakePayload;
  variantLabel: string;
}) {
  return (
    <div className="grid layout-gap-med">
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <ReviewCard title="Business basics">
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

        <ReviewCard title="Main services">
          <SummaryRow label="Selected services" value={mainServices} />
          <SummaryRow
            label="Priority services"
            value={payload.services.priorityServices}
          />
        </ReviewCard>

        <ReviewCard title="Service area">
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
        </ReviewCard>

        <ReviewCard title="Preferred contact flow">
          <SummaryRow
            label="Current process"
            value={payload.leadFlow.currentProcess}
          />
          <SummaryRow label="Primary action" value={payload.leadFlow.primaryAction} />
          <SummaryRow
            label="After submit"
            value={payload.leadFlow.afterFormSubmit}
          />
          <SummaryRow label="Response speed" value={payload.leadFlow.responseTime} />
        </ReviewCard>

        <ReviewCard title="Trust points">
          <SummaryRow label="Trust signals" value={payload.trust.signals} />
          <SummaryRow label="Compliments" value={payload.trust.compliments} />
          <SummaryRow
            label="Competitor difference"
            value={payload.trust.competitorDifference}
          />
        </ReviewCard>

        <ReviewCard title="Common customer questions">
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
        </ReviewCard>

        <ReviewCard title="Asset folder / references">
          <SummaryRow label="Folder link" value={payload.assets.folderLink} />
          <SummaryRow label="Folder includes" value={payload.assets.folderIncludes} />
          <SummaryRow label="Promo" value={payload.assets.promoOffer} />
          <SummaryRow
            label="References"
            value={payload.assets.competitorReferences}
          />
        </ReviewCard>

        <ReviewCard title="Final notes">
          <SummaryRow label="Must include" value={payload.finalNotes.mustInclude} />
          <SummaryRow label="Avoid saying" value={payload.finalNotes.avoidSaying} />
          <SummaryRow
            label="Do not advertise"
            value={payload.finalNotes.servicesToAvoid}
          />
          <SummaryRow
            label="Avoid attracting"
            value={payload.finalNotes.customerTypesToAvoid}
          />
          <SummaryRow
            label="Upcoming changes"
            value={payload.finalNotes.upcomingChanges}
          />
        </ReviewCard>
      </div>
    </div>
  );
}

function ReviewCard({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <section className="radius-medium border border-service-border bg-service-surface p-5">
      <h3 className="type-heading-sm text-service-ink">{title}</h3>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}
