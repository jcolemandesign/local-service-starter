"use client";

import {
  createContext,
  type ButtonHTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useScrollLock } from "@/hooks/useScrollLock";
import { supabase } from "@/utils/supabase/client";

type SystemType = "cooling" | "heating";
type RequestType =
  | "repair"
  | "maintenance"
  | "replacement_install"
  | "not_sure";
type ContactMethod = "call" | "text" | "email";

type RequestServiceContextValue = {
  openRequestService: () => void;
};

type RequestServiceButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

type RequestServiceTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

type LeadData = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  zip_code?: string;
  property_type?: string;
  appointment_window?: string;
  street_address?: string;
  system_type: SystemType;
  request_type: RequestType;
  problem_type: string;
  service_needed: string;
  description?: string;
  source: "Request Service Modal";
  status: "New";
  contact_consent: boolean;
  preferred_contact_method?: ContactMethod;
};

type SupabaseErrorDetails = {
  code?: string;
  details?: string;
  hint?: string;
  message?: string;
  name?: string;
  status?: number;
};

type InsertLeadResult = {
  error: unknown;
  status?: number;
  statusText?: string;
};

const RequestServiceContext = createContext<RequestServiceContextValue | null>(
  null,
);

const systemOptions = [
  { label: "Cooling", value: "cooling" },
  { label: "Heating", value: "heating" },
] as const;

const requestOptions = [
  { label: "Repair", value: "repair" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Replacement / Install", value: "replacement_install" },
  { label: "Not Sure", value: "not_sure" },
] as const;

const contactOptions = [
  { label: "Call", value: "call" },
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
] as const satisfies readonly { label: string; value: ContactMethod }[];

const propertyTypeOptions = [
  "Single-family home",
  "Townhome",
  "Condo",
  "Commercial",
  "Other",
];

const appointmentWindowOptions = [
  "Today if available",
  "This week",
  "Flexible",
  "Just getting information",
];

const modalFieldClass =
  "radius-button min-h-12 border border-service-border bg-white px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent";

const modalLabelClass = "grid gap-2 type-caption font-semibold text-service-ink";

const modalButtonClass =
  "radius-button inline-flex min-h-10 cursor-pointer items-center justify-center px-5 type-caption font-semibold transition-colors disabled:cursor-not-allowed";

const problemOptionsBySelection: Record<
  SystemType,
  Record<RequestType, string[]>
> = {
  cooling: {
    repair: [
      "AC not cooling",
      "Weak airflow",
      "Unit won't turn on",
      "Strange noise",
      "Leaking / freezing up",
      "Not sure",
    ],
    maintenance: [
      "AC tune-up",
      "Filter / airflow check",
      "Seasonal maintenance",
      "Maintenance plan",
      "Not sure",
    ],
    replacement_install: [
      "Replace AC system",
      "Replace full HVAC system",
      "New install / addition",
      "Get an estimate",
      "Not sure",
    ],
    not_sure: [
      "Not cooling properly",
      "Airflow feels weak",
      "System is acting unusual",
      "I need help figuring it out",
    ],
  },
  heating: {
    repair: [
      "No heat",
      "Weak heat",
      "System won't turn on",
      "Strange noise",
      "Thermostat issue",
      "Not sure",
    ],
    maintenance: [
      "Heating tune-up",
      "Furnace check",
      "Heat pump check",
      "Seasonal maintenance",
      "Maintenance plan",
      "Not sure",
    ],
    replacement_install: [
      "Replace heating system",
      "Replace full HVAC system",
      "New install / addition",
      "Get an estimate",
      "Not sure",
    ],
    not_sure: [
      "Not heating properly",
      "Heat feels weak",
      "System is acting unusual",
      "I need help figuring it out",
    ],
  },
};

function getProblemOptions(systemType: SystemType, requestType: RequestType) {
  return problemOptionsBySelection[systemType][requestType];
}

function getRequestLabel(value: RequestType) {
  return (
    requestOptions.find((option) => option.value === value)?.label ?? value
  );
}

function getSystemLabel(value: SystemType) {
  return systemOptions.find((option) => option.value === value)?.label ?? value;
}

function createLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (value) =>
    (
      Number(value) ^
      (Math.random() * 16) >> (Number(value) / 4)
    ).toString(16),
  );
}

function getErrorDetails(error: unknown): SupabaseErrorDetails {
  if (!error || typeof error !== "object") {
    return {
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const errorRecord = error as Record<string, unknown>;

  return {
    code:
      typeof errorRecord.code === "string" ? errorRecord.code : undefined,
    details:
      typeof errorRecord.details === "string"
        ? errorRecord.details
        : undefined,
    hint:
      typeof errorRecord.hint === "string" ? errorRecord.hint : undefined,
    message:
      typeof errorRecord.message === "string"
        ? errorRecord.message
        : undefined,
    name:
      typeof errorRecord.name === "string" ? errorRecord.name : undefined,
    status:
      typeof errorRecord.status === "number" ? errorRecord.status : undefined,
  };
}

async function insertLead(leadData: LeadData) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    return (await supabase
      .from("leads")
      .insert([leadData])
      .abortSignal(controller.signal)) as InsertLeadResult;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function OptionButton({
  isSelected,
  label,
  onClick,
}: {
  isSelected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`radius-button min-h-12 cursor-pointer border px-4 py-3 text-left type-caption font-semibold transition-colors ${
        isSelected
          ? "border-service-accent bg-service-accent text-white"
          : "border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent"
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div
      aria-label={`Step ${currentStep} of 3`}
      className="flex items-center"
      role="list"
    >
      {[1, 2, 3].map((stepNumber) => {
        const isActive = currentStep === stepNumber;
        const isComplete = currentStep > stepNumber;

        return (
          <div
            className="flex items-center"
            key={stepNumber}
            role="listitem"
          >
            <span
              aria-current={isActive ? "step" : undefined}
              className={`radius-round flex size-7 items-center justify-center border type-caption font-semibold transition-colors ${
                isActive
                  ? "border-service-accent bg-service-accent text-white"
                  : isComplete
                    ? "border-service-accent bg-service-accent/10 text-service-accent"
                    : "border-service-border bg-service-surface text-service-muted"
              }`}
            >
              {stepNumber}
            </span>
            {stepNumber < 3 ? (
              <span
                aria-hidden="true"
                className={`h-px w-8 transition-colors max-sm:w-6 ${
                  currentStep > stepNumber
                    ? "bg-service-accent"
                    : "bg-service-border"
                }`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function useRequestService() {
  const context = useContext(RequestServiceContext);

  if (!context) {
    throw new Error(
      "useRequestService must be used inside RequestServiceProvider",
    );
  }

  return context;
}

export function RequestServiceButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  ...props
}: RequestServiceButtonProps) {
  const { openRequestService } = useRequestService();
  const styles =
    variant === "primary"
      ? "bg-service-accent text-white hover:bg-service-ink"
      : "border border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent";

  return (
    <button
      className={`radius-button inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap px-6 type-caption font-semibold transition-colors ${styles} ${className}`}
      type="button"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          openRequestService();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function RequestServiceTrigger({
  children,
  onClick,
  type = "button",
  ...props
}: RequestServiceTriggerProps) {
  const { openRequestService } = useRequestService();

  return (
    <button
      type={type}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          openRequestService();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function RequestServiceProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [lockActive, setLockActive] = useState(false);
  useScrollLock(lockActive);

  const contextValue = useMemo(
    () => ({
      openRequestService: () => {
        setLockActive(true);
        setIsOpen(true);
      },
    }),
    [],
  );

  return (
    <RequestServiceContext.Provider value={contextValue}>
      {children}
      <RequestServiceModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onExitComplete={() => setLockActive(false)}
      />
    </RequestServiceContext.Provider>
  );
}

function RequestServiceModal({
  isOpen,
  onClose,
  onExitComplete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onExitComplete: () => void;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(1);
  const [systemType, setSystemType] = useState<SystemType | "">("");
  const [requestType, setRequestType] = useState<RequestType | "">("");
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [appointmentWindow, setAppointmentWindow] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [preferredContactMethod, setPreferredContactMethod] = useState<
    ContactMethod | ""
  >("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasProgress =
    Boolean(systemType) ||
    Boolean(requestType) ||
    Boolean(problemType) ||
    Boolean(description.trim()) ||
    Boolean(name.trim()) ||
    Boolean(phone.trim()) ||
    Boolean(email.trim()) ||
    Boolean(zipCode.trim()) ||
    Boolean(propertyType) ||
    Boolean(appointmentWindow) ||
    Boolean(streetAddress.trim()) ||
    contactConsent ||
    Boolean(preferredContactMethod);

  const problemOptions =
    systemType && requestType
      ? getProblemOptions(systemType, requestType)
      : [];

  const canContinue =
    (step === 1 && Boolean(systemType && requestType)) ||
    (step === 2 && Boolean(problemType)) ||
    (step === 3 &&
      Boolean(name.trim()) &&
      Boolean(phone.trim()) &&
      contactConsent);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const resetForm = () => {
    setStep(1);
    setSystemType("");
    setRequestType("");
    setProblemType("");
    setDescription("");
    setName("");
    setPhone("");
    setEmail("");
    setZipCode("");
    setPropertyType("");
    setAppointmentWindow("");
    setStreetAddress("");
    setContactConsent(false);
    setPreferredContactMethod("");
    setSubmitError("");
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    if (
      !systemType ||
      !requestType ||
      !problemType ||
      !name.trim() ||
      !phone.trim() ||
      !contactConsent
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const serviceNeeded = `${getSystemLabel(systemType)} - ${getRequestLabel(
      requestType,
    )} - ${problemType}`;
    const leadId = createLeadId();

    const leadData: LeadData = {
      id: leadId,
      name: name.trim(),
      phone: phone.trim(),
      system_type: systemType,
      request_type: requestType,
      problem_type: problemType,
      service_needed: serviceNeeded,
      source: "Request Service Modal",
      status: "New",
      contact_consent: contactConsent,
    };

    if (email.trim()) {
      leadData.email = email.trim();
    }

    if (zipCode.trim()) {
      leadData.zip_code = zipCode.trim();
    }

    if (propertyType) {
      leadData.property_type = propertyType;
    }

    if (appointmentWindow) {
      leadData.appointment_window = appointmentWindow;
    }

    if (streetAddress.trim()) {
      leadData.street_address = streetAddress.trim();
    }

    if (description.trim()) {
      leadData.description = description.trim();
    }

    if (preferredContactMethod) {
      leadData.preferred_contact_method = preferredContactMethod;
    }

    let insertResult: InsertLeadResult;

    try {
      insertResult = await insertLead(leadData);
    } catch (error) {
      const errorDetails = getErrorDetails(error);

      console.error("Request service lead insert threw", {
        error,
        leadData,
        leadId,
        ...errorDetails,
      });
      setSubmitError(
        "Something went wrong while submitting your request. Please try again or call us directly.",
      );
      setIsSubmitting(false);
      return;
    }

    const { error, status, statusText } = insertResult;

    if (error) {
      const errorDetails = getErrorDetails(error);

      console.error("Request service lead insert failed", {
        error,
        leadData,
        leadId,
        status,
        statusText,
        ...errorDetails,
      });
      setSubmitError(
        "Something went wrong while submitting your request. Please try again or call us directly.",
      );
      setIsSubmitting(false);
      return;
    }

    console.info("Request service lead insert succeeded", {
      leadId,
      status,
      statusText,
    });

    resetForm();
    onClose();
    router.push("/thank-you");
  };

  return (
    <AnimatePresence
      initial={false}
      onExitComplete={onExitComplete}
    >
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] grid h-dvh bg-service-ink/55 p-6 backdrop-blur-sm max-md:p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <div
            className="grid h-full min-h-0"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !hasProgress) {
                onClose();
              }
            }}
          >
            <motion.div
              ref={dialogRef}
              aria-labelledby="request-service-title"
              aria-modal="true"
              className="radius-medium m-auto flex min-h-[42rem] max-h-[calc(100dvh-3rem)] w-full max-w-4xl flex-col overflow-hidden bg-bg-page text-service-ink shadow-service outline-none max-md:h-dvh max-md:min-h-0 max-md:max-h-dvh max-md:rounded-none"
              role="dialog"
              tabIndex={-1}
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="flex shrink-0 items-center justify-between gap-4 border-b border-service-border px-[var(--container-gutter)] py-4 max-md:px-5 max-md:py-3">
          <div className="fluid-type-frame min-w-0 flex-1">
            <StepIndicator currentStep={step} />
            <h2
              id="request-service-title"
              className="type-heading-sm mt-eyebrow-heading-sm max-w-none text-service-ink"
            >
              {step === 1
                ? "What do you need help with?"
                : step === 2
                  ? "What's going on?"
                  : "Where should we follow up?"}
            </h2>
          </div>
          <button
            aria-label="Close request service modal"
            className="radius-button flex size-10 shrink-0 cursor-pointer items-center justify-center border border-service-border bg-white type-caption text-service-ink transition-colors hover:border-service-accent hover:text-service-accent"
            type="button"
            onClick={onClose}
          >
            x
          </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-[var(--container-gutter)] max-md:p-5">
          {step === 1 ? (
            <div className="flex min-h-full items-center">
              <div className="grid w-full layout-gap-xlrg md:grid-cols-2">
              <div className="fluid-type-frame min-w-0">
                <h3 className="type-heading-sm text-service-ink">
                  What system needs help?
                </h3>
                <div className="mt-heading-body-md grid grid-cols-2 card-grid-gap-med max-sm:grid-cols-1">
                  {systemOptions.map((option) => (
                    <OptionButton
                      isSelected={systemType === option.value}
                      key={option.value}
                      label={option.label}
                      onClick={() => {
                        setSystemType(option.value);
                        setProblemType("");
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="fluid-type-frame min-w-0">
                <h3 className="type-heading-sm text-service-ink">
                  What do you need?
                </h3>
                <div className="mt-heading-body-md grid grid-cols-2 card-grid-gap-med max-sm:grid-cols-1">
                  {requestOptions.map((option) => (
                    <OptionButton
                      isSelected={requestType === option.value}
                      key={option.value}
                      label={option.label}
                      onClick={() => {
                        setRequestType(option.value);
                        setProblemType("");
                      }}
                    />
                  ))}
                </div>
              </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="fluid-type-frame">
              <h3 className="type-heading-sm text-service-ink">
                What is going on?
              </h3>
              <div className="mt-heading-body-md grid grid-cols-2 card-grid-gap-med max-sm:grid-cols-1">
                {problemOptions.map((option) => (
                  <OptionButton
                    isSelected={problemType === option}
                    key={option}
                    label={option}
                    onClick={() => setProblemType(option)}
                  />
                ))}
              </div>

              <label className={`${modalLabelClass} mt-body-actions-md`}>
                Anything else we should know?
                <textarea
                  className={`${modalFieldClass} min-h-40 resize-y py-3 font-normal`}
                  placeholder="Tell us what's happening, when it started, or anything unusual you've noticed."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </label>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid card-grid-gap-med md:grid-cols-2">
              <label className={modalLabelClass}>
                Name
                <input
                  autoComplete="name"
                  className={`${modalFieldClass} font-normal`}
                  required
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label className={modalLabelClass}>
                Phone
                <input
                  autoComplete="tel"
                  className={`${modalFieldClass} font-normal`}
                  required
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>

              <label className={modalLabelClass}>
                Email
                <span className="type-caption font-medium text-service-muted">
                  Optional, but recommended.
                </span>
                <input
                  autoComplete="email"
                  className={`${modalFieldClass} font-normal`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label className={modalLabelClass}>
                ZIP code
                <input
                  autoComplete="postal-code"
                  className={`${modalFieldClass} font-normal`}
                  inputMode="numeric"
                  type="text"
                  value={zipCode}
                  onChange={(event) => setZipCode(event.target.value)}
                />
              </label>

              <label className="grid gap-2 type-caption font-semibold text-service-ink md:col-span-2">
                Street address
                <input
                  autoComplete="street-address"
                  className={`${modalFieldClass} font-normal`}
                  type="text"
                  value={streetAddress}
                  onChange={(event) => setStreetAddress(event.target.value)}
                />
              </label>

              <div className="md:col-span-2">
                <p className="type-caption font-semibold text-service-ink">
                  What type of property is this?
                </p>
                <div className="mt-heading-body-sm grid grid-cols-2 card-grid-gap-med max-sm:grid-cols-1">
                  {propertyTypeOptions.map((option) => (
                    <OptionButton
                      isSelected={propertyType === option}
                      key={option}
                      label={option}
                      onClick={() => setPropertyType(option)}
                    />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="type-caption font-semibold text-service-ink">
                  When would you like help?
                </p>
                <div className="mt-heading-body-sm grid grid-cols-2 card-grid-gap-med max-sm:grid-cols-1">
                  {appointmentWindowOptions.map((option) => (
                    <OptionButton
                      isSelected={appointmentWindow === option}
                      key={option}
                      label={option}
                      onClick={() => setAppointmentWindow(option)}
                    />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="type-caption font-semibold text-service-ink">
                  How should we contact you?
                </p>
                <div className="mt-heading-body-sm grid grid-cols-3 card-grid-gap-med max-sm:grid-cols-1">
                  {contactOptions.map((option) => (
                    <OptionButton
                      isSelected={preferredContactMethod === option.value}
                      key={option.value}
                      label={option.label}
                      onClick={() => setPreferredContactMethod(option.value)}
                    />
                  ))}
                </div>
              </div>

              <label className="radius-medium flex gap-3 border border-service-border bg-service-surface p-4 type-text-sm font-medium text-service-ink md:col-span-2">
                <input
                  className="mt-1 size-4 shrink-0 accent-service-accent"
                  required
                  type="checkbox"
                  checked={contactConsent}
                  onChange={(event) => setContactConsent(event.target.checked)}
                />
                I agree to be contacted about my service request.
              </label>

              {submitError ? (
                <p
                  className="radius-medium border border-red-200 bg-red-50 px-4 py-3 type-text-sm text-red-700 md:col-span-2"
                  role="alert"
                >
                  {submitError}
                </p>
              ) : null}
            </div>
          ) : null}
              </div>

              <div className="flex shrink-0 items-center justify-between inline-gap-med border-t border-service-border px-[var(--container-gutter)] py-4 max-md:px-5 max-md:py-3">
          <button
            className={`${modalButtonClass} border border-service-border bg-white text-service-ink hover:border-service-accent hover:text-service-accent disabled:opacity-45`}
            disabled={step === 1 || isSubmitting}
            type="button"
            onClick={() => setStep((currentStep) => Math.max(1, currentStep - 1))}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              className={`${modalButtonClass} border border-service-accent bg-service-accent text-white hover:bg-service-ink disabled:bg-service-muted`}
              disabled={!canContinue}
              type="button"
              onClick={() => setStep((currentStep) => currentStep + 1)}
            >
              Continue
            </button>
          ) : (
            <button
              className={`${modalButtonClass} border border-service-accent bg-service-accent text-white hover:bg-service-ink disabled:cursor-wait disabled:bg-service-muted`}
              disabled={!canContinue || isSubmitting}
              type="button"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Sending request" : "Submit request"}
            </button>
          )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
