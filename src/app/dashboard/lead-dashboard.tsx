"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/primitives";

type LeadValue = boolean | number | string | null | undefined;
type JsonValue =
  | boolean
  | number
  | string
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Lead = {
  id: number | string;
  appointment_date?: LeadValue;
  appointment_window?: LeadValue;
  booked_at?: LeadValue;
  contact_consent?: LeadValue;
  created_at?: LeadValue;
  description?: LeadValue;
  email?: LeadValue;
  full_name?: LeadValue;
  message?: LeadValue;
  name?: LeadValue;
  notes?: LeadValue;
  phone?: LeadValue;
  postal_code?: LeadValue;
  preferred_contact_method?: LeadValue;
  problem_type?: LeadValue;
  property_type?: LeadValue;
  request_type?: LeadValue;
  service?: LeadValue;
  service_needed?: LeadValue;
  source?: LeadValue;
  status?: LeadValue;
  street_address?: LeadValue;
  scheduled_at?: LeadValue;
  scheduled_date?: LeadValue;
  system_type?: LeadValue;
  urgency?: LeadValue;
  zip_code?: LeadValue;
  [key: string]: LeadValue;
};

export type ProjectIntake = {
  id: string;
  business_name?: LeadValue;
  business_type?: LeadValue;
  contact_email?: LeadValue;
  contact_name?: LeadValue;
  contact_phone?: LeadValue;
  created_at?: LeadValue;
  main_services?: string[] | null;
  payload?: JsonValue;
  preferred_cta?: string[] | null;
  priority_services?: LeadValue;
  service_area?: LeadValue;
  source?: LeadValue;
  status?: LeadValue;
  website?: LeadValue;
};

type SortOption =
  | "created_at"
  | "oldest"
  | "service"
  | "status"
  | "urgency";

type DashboardView = "all" | "booked" | "intakes";

type BookedTiming = "needs-date" | "upcoming" | "past";

type LeadDashboardProps = {
  deleteProjectIntake?: (formData: FormData) => void;
  generateProjectIntakeSourcePacket?: (formData: FormData) => void;
  intakeSaveState?: string | null;
  leads: Lead[];
  projectIntakes?: ProjectIntake[];
  savedIntakeId?: string | null;
  savedLeadId: string | null;
  saveState: string | null;
  showProjectIntakes?: boolean;
  sourcePacketPath?: string | null;
  sourcePacketStats?: SourcePacketStat[];
  statusOptions: string[];
  strategyDigestPath?: string | null;
  updateLead: (formData: FormData) => void;
  updateProjectIntake?: (formData: FormData) => void;
};

type SourcePacketStat = {
  label: string;
  value: string;
};

const urgencyOrder = [
  "Emergency - no heat or AC",
  "Emergency",
  "Today if available",
  "Today",
  "This week",
  "Flexible scheduling",
  "Flexible",
];

const leadFields = {
  address: ["street_address", "address"],
  consent: ["contact_consent"],
  createdAt: ["created_at"],
  description: ["description", "message"],
  email: ["email"],
  name: ["name", "full_name"],
  phone: ["phone"],
  preferredContactMethod: ["preferred_contact_method"],
  problemType: ["problem_type"],
  propertyType: ["property_type"],
  requestType: ["request_type"],
  service: ["service_needed", "service"],
  source: ["source"],
  systemType: ["system_type"],
  urgency: ["urgency"],
  zip: ["zip_code", "postal_code"],
  scheduledDate: [
    "scheduled_at",
    "scheduled_date",
    "appointment_date",
    "appointment_at",
    "job_date",
    "service_date",
    "booked_for",
    "appointment_window",
  ],
};

const fieldClass =
  "radius-button min-h-12 border border-service-border bg-white px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent focus:bg-white";

const filterFieldClass =
  "radius-button min-h-12 border border-service-border bg-white px-4 type-text-sm text-service-ink outline-none transition-colors placeholder:text-service-muted/70 focus:border-service-accent focus:bg-white";

const labelClass =
  "grid gap-2 type-caption font-semibold text-service-ink";

const secondaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-border bg-white px-5 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const destructiveButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-red-200 bg-red-50 px-5 type-caption font-semibold text-red-700 transition-colors hover:border-red-700 hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const primaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const compactSecondaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-border bg-white px-5 type-caption font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const compactPrimaryButtonClass =
  "radius-button inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap border border-service-accent bg-service-accent px-5 type-caption font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const dashboardCardPaddingClass =
  "border-service-border bg-white p-[var(--container-gutter)] shadow-service";
const dashboardPanelClass =
  "radius-medium border border-service-border bg-service-surface p-[var(--container-gutter)]";
const dashboardToggleClass =
  "flex w-full cursor-pointer items-center justify-between border-t border-service-border pt-4 text-left type-label text-service-accent transition-colors hover:text-service-ink";
const dashboardMutedLabelClass = "type-label text-service-muted";

const statusPillClassByStatus: Record<string, string> = {
  booked: "bg-green-600 text-white",
  completed: "bg-green-50 text-green-700",
  contacted: "bg-blue-50 text-blue-700",
  lost: "bg-red-50 text-red-700",
  new: "bg-service-surface text-service-accent",
  "not responding": "bg-red-50 text-red-700",
  "packet created": "bg-green-50 text-green-700",
  quoted: "bg-blue-600 text-white",
  spam: "bg-red-600 text-white",
};

const statusOptionClassByStatus: Record<string, string> = {
  booked: "bg-green-600 text-white",
  completed: "bg-green-50 text-green-700",
  contacted: "bg-blue-50 text-blue-700",
  lost: "bg-red-50 text-red-700",
  new: "bg-service-surface text-service-accent",
  "not responding": "bg-red-50 text-red-700",
  "packet created": "bg-green-50 text-green-700",
  quoted: "bg-blue-600 text-white",
  spam: "bg-red-600 text-white",
};

function readLeadValue(lead: Lead, keys: string[]) {
  for (const key of keys) {
    const value = lead[key];

    if (value !== null && value !== undefined && String(value).length > 0) {
      return value;
    }
  }

  return null;
}

function readLeadText(lead: Lead, keys: string[]) {
  const value = readLeadValue(lead, keys);

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value === null ? null : String(value);
}

function formatDate(value: LeadValue) {
  if (typeof value !== "string" || value.length === 0) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function displayValue(value: LeadValue) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined || String(value).length === 0) {
    return "Not provided";
  }

  return String(value);
}

function displayStringList(value: string[] | null | undefined) {
  if (!Array.isArray(value) || value.length === 0) {
    return "Not provided";
  }

  return value.filter(Boolean).join(", ") || "Not provided";
}

function createProjectSlug(value: unknown, fallback: string) {
  const source = typeof value === "string" && value.trim() ? value : fallback;
  const slug = source
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "client-intake";
}

function displayStringItems(value: string[] | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(Boolean);
}

function readJsonObject(value: JsonValue | undefined) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, JsonValue>)
    : null;
}

function readPayloadString(
  payload: JsonValue | undefined,
  sectionKey: string,
  answerKey: string,
) {
  const root = readJsonObject(payload);
  const section = readJsonObject(root?.[sectionKey]);
  const value = section?.[answerKey];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getProjectIntakeServiceAreaDetails(intake: ProjectIntake) {
  const allServiceAreas = readPayloadString(
    intake.payload,
    "serviceArea",
    "townsCities",
  );
  const priorityServiceAreas = readPayloadString(
    intake.payload,
    "serviceArea",
    "priorityAreas",
  );

  return {
    allServiceAreas: allServiceAreas ?? intake.service_area ?? null,
    priorityServiceAreas,
  };
}

function isBookedStatus(value: LeadValue) {
  return typeof value === "string" && value.toLowerCase() === "booked";
}

function getStatusPillClass(value: LeadValue) {
  if (typeof value !== "string") {
    return "bg-service-surface text-service-accent";
  }

  return (
    statusPillClassByStatus[value.toLowerCase()] ??
    "bg-service-surface text-service-accent"
  );
}

function getStatusOptionClass(value: string) {
  return statusOptionClassByStatus[value.toLowerCase()] ?? "";
}

function getUniqueValues(leads: Lead[], keys: string[]) {
  return Array.from(
    new Set(
      leads
        .map((lead) => readLeadText(lead, keys))
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

function getStatusFilterOptions(leads: Lead[], statusOptions: string[]) {
  const leadStatusValues = getUniqueValues(leads, ["status"]);

  return leadStatusValues.filter((status) => statusOptions.includes(status));
}

function getDateTime(value: LeadValue) {
  return typeof value === "string" ? new Date(value).getTime() : 0;
}

function getValidDateTime(value: LeadValue) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? null : time;
}

function getBookedTiming(lead: Lead): BookedTiming {
  const scheduledTime = getValidDateTime(
    readLeadValue(lead, leadFields.scheduledDate),
  );

  if (scheduledTime === null) {
    return "needs-date";
  }

  return scheduledTime < Date.now() ? "past" : "upcoming";
}

function getBookedTimingLabel(timing: BookedTiming) {
  if (timing === "needs-date") {
    return "Needs date";
  }

  if (timing === "upcoming") {
    return "Date set";
  }

  return "Date passed";
}

function getBookedTimingCardClass(timing: BookedTiming) {
  if (timing === "needs-date") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  if (timing === "upcoming") {
    return "border-blue-200 bg-blue-50 text-blue-900";
  }

  return "border-red-400 bg-red-50 text-red-900";
}

function getBookedTimingPillClass(timing: BookedTiming) {
  if (timing === "needs-date") {
    return "bg-amber-200 text-amber-950";
  }

  if (timing === "upcoming") {
    return "bg-blue-200 text-blue-950";
  }

  return "bg-red-200 text-red-950";
}

function formatFileDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function escapeCsvValue(value: LeadValue) {
  const stringValue = value === null || value === undefined ? "" : String(value);
  const escapedValue = stringValue.replaceAll("\"", "\"\"");

  return /[",\r\n]/.test(escapedValue) ? `"${escapedValue}"` : escapedValue;
}

function getCsvColumns(leads: Lead[]) {
  const preferredColumns = [
    "id",
    "name",
    "full_name",
    "phone",
    "email",
    "zip_code",
    "postal_code",
    "service_needed",
    "service",
    "system_type",
    "request_type",
    "problem_type",
    "urgency",
    "property_type",
    "appointment_window",
    "street_address",
    "address",
    "preferred_contact_method",
    "description",
    "message",
    "contact_consent",
    "status",
    "notes",
    "source",
    "created_at",
  ];
  const dynamicColumns = Array.from(
    new Set(leads.flatMap((lead) => Object.keys(lead))),
  );

  return [
    ...preferredColumns.filter((column) =>
      dynamicColumns.includes(column),
    ),
    ...dynamicColumns.filter((column) => !preferredColumns.includes(column)),
  ];
}

function exportLeadsToCsv(leads: Lead[]) {
  const columns = getCsvColumns(leads);
  const header = columns.map((column) => escapeCsvValue(column)).join(",");
  const rows = leads.map((lead) =>
    columns.map((column) => escapeCsvValue(lead[column])).join(","),
  );
  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `leads-export-${formatFileDate(new Date())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeProjectIntakeCsvValue(value: JsonValue | LeadValue | string[]) {
  if (Array.isArray(value)) {
    return escapeCsvValue(value.join(", "));
  }

  if (value && typeof value === "object") {
    return escapeCsvValue(JSON.stringify(value));
  }

  return escapeCsvValue(value as LeadValue);
}

function exportProjectIntakesToCsv(projectIntakes: ProjectIntake[]) {
  const columns: Array<keyof ProjectIntake> = [
    "id",
    "business_name",
    "business_type",
    "contact_name",
    "contact_email",
    "contact_phone",
    "website",
    "main_services",
    "priority_services",
    "service_area",
    "preferred_cta",
    "status",
    "source",
    "created_at",
    "payload",
  ];
  const header = columns.map((column) => escapeCsvValue(column)).join(",");
  const rows = projectIntakes.map((intake) =>
    columns
      .map((column) => escapeProjectIntakeCsvValue(intake[column]))
      .join(","),
  );
  const csv = [header, ...rows].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `project-intakes-export-${formatFileDate(new Date())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function compareText(a: string | null, b: string | null) {
  return (a ?? "").localeCompare(b ?? "");
}

function getUrgencyRank(value: string | null) {
  const rank = urgencyOrder.indexOf(value ?? "");

  return rank === -1 ? urgencyOrder.length : rank;
}

function getDefaultStatusRank(value: string | null) {
  return value?.toLowerCase() === "not responding" ? 1 : 0;
}

function matchesSearch(lead: Lead, searchTerm: string) {
  if (!searchTerm) {
    return true;
  }

  const searchableFields = [
    readLeadText(lead, leadFields.name),
    readLeadText(lead, leadFields.phone),
    readLeadText(lead, leadFields.email),
    readLeadText(lead, leadFields.address),
    readLeadText(lead, leadFields.zip),
    readLeadText(lead, leadFields.description),
    readLeadText(lead, ["notes"]),
  ];

  return searchableFields.some((value) =>
    (value ?? "").toLowerCase().includes(searchTerm),
  );
}

function matchesProjectIntake(intake: ProjectIntake, searchTerm: string) {
  if (!searchTerm) {
    return true;
  }

  const searchableFields = [
    intake.business_name,
    intake.business_type,
    intake.contact_name,
    intake.contact_email,
    intake.contact_phone,
    intake.website,
    intake.priority_services,
    intake.service_area,
    intake.status,
    intake.source,
    displayStringList(intake.main_services),
    displayStringList(intake.preferred_cta),
  ];

  return searchableFields.some((value) =>
    String(value ?? "").toLowerCase().includes(searchTerm),
  );
}

export function LeadDashboard({
  deleteProjectIntake,
  generateProjectIntakeSourcePacket,
  intakeSaveState = null,
  leads,
  projectIntakes = [],
  savedIntakeId = null,
  savedLeadId,
  saveState,
  showProjectIntakes = false,
  sourcePacketPath = null,
  sourcePacketStats = [],
  statusOptions,
  strategyDigestPath = null,
  updateLead,
  updateProjectIntake,
}: LeadDashboardProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [activeView, setActiveView] = useState<DashboardView>("all");
  const [openLeadIds, setOpenLeadIds] = useState<Set<string>>(new Set());

  const urgencyValues = useMemo(
    () => getUniqueValues(leads, leadFields.urgency),
    [leads],
  );
  const serviceValues = useMemo(
    () => getUniqueValues(leads, leadFields.service),
    [leads],
  );
  const statusFilterOptions = useMemo(
    () => getStatusFilterOptions(leads, statusOptions),
    [leads, statusOptions],
  );

  const visibleLeads = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredLeads = leads
      .filter((lead) =>
        statusFilter ? readLeadText(lead, ["status"]) === statusFilter : true,
      )
      .filter((lead) =>
        urgencyFilter
          ? readLeadText(lead, leadFields.urgency) === urgencyFilter
          : true,
      )
      .filter((lead) =>
        serviceFilter
          ? readLeadText(lead, leadFields.service) === serviceFilter
          : true,
      )
      .filter((lead) => matchesSearch(lead, normalizedSearch));

    return [...filteredLeads].sort((a, b) => {
      if (sortBy === "oldest") {
        return getDateTime(a.created_at) - getDateTime(b.created_at);
      }

      if (sortBy === "urgency") {
        return (
          getUrgencyRank(readLeadText(a, leadFields.urgency)) -
          getUrgencyRank(readLeadText(b, leadFields.urgency))
        );
      }

      if (sortBy === "status") {
        return compareText(
          readLeadText(a, ["status"]),
          readLeadText(b, ["status"]),
        );
      }

      if (sortBy === "service") {
        return compareText(
          readLeadText(a, leadFields.service),
          readLeadText(b, leadFields.service),
        );
      }

      if (
        !statusFilter &&
        !urgencyFilter &&
        !serviceFilter &&
        !searchQuery &&
        sortBy === "created_at"
      ) {
        const statusRank =
          getDefaultStatusRank(readLeadText(a, ["status"])) -
          getDefaultStatusRank(readLeadText(b, ["status"]));

        if (statusRank !== 0) {
          return statusRank;
        }
      }

      return getDateTime(b.created_at) - getDateTime(a.created_at);
    });
  }, [leads, searchQuery, serviceFilter, sortBy, statusFilter, urgencyFilter]);

  const bookedLeads = useMemo(
    () =>
      leads
        .filter((lead) => isBookedStatus(readLeadValue(lead, ["status"])))
        .sort((a, b) => {
          const aTiming = getBookedTiming(a);
          const bTiming = getBookedTiming(b);
          const timingRank: Record<BookedTiming, number> = {
            "needs-date": 0,
            upcoming: 1,
            past: 2,
          };
          const rankDifference = timingRank[aTiming] - timingRank[bTiming];

          if (rankDifference !== 0) {
            return rankDifference;
          }

          return (
            (getValidDateTime(readLeadValue(a, leadFields.scheduledDate)) ??
              getDateTime(a.created_at)) -
            (getValidDateTime(readLeadValue(b, leadFields.scheduledDate)) ??
              getDateTime(b.created_at))
          );
        }),
    [leads],
  );

  const bookedCounts = useMemo(
    () =>
      bookedLeads.reduce(
        (counts, lead) => {
          counts[getBookedTiming(lead)] += 1;

          return counts;
        },
        {
          "needs-date": 0,
          upcoming: 0,
          past: 0,
        } as Record<BookedTiming, number>,
      ),
    [bookedLeads],
  );

  const hasActiveFilters =
    statusFilter ||
    urgencyFilter ||
    serviceFilter ||
    searchQuery ||
    sortBy !== "created_at";

  const toggleLeadDetails = (leadId: string) => {
    setOpenLeadIds((current) => {
      const next = new Set(current);

      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }

      return next;
    });
  };

  return (
    <>
      <Card className="mb-6 border-0 bg-service-surface p-2 shadow-none">
        <div
          aria-label="Dashboard views"
          className={`grid gap-2 radius-medium bg-service-surface max-md:grid-cols-1 ${
            showProjectIntakes ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
          role="tablist"
        >
          <button
            aria-selected={activeView === "all"}
            className={`radius-button min-h-12 cursor-pointer px-5 text-left type-caption font-semibold transition-colors ${
              activeView === "all"
                ? "bg-service-ink text-white"
                : "bg-white text-service-ink hover:bg-service-surface"
            }`}
            onClick={() => setActiveView("all")}
            role="tab"
            type="button"
          >
            All leads
          </button>
          <button
            aria-selected={activeView === "booked"}
            className={`radius-button min-h-12 cursor-pointer px-5 text-left type-caption font-semibold transition-colors ${
              activeView === "booked"
                ? "bg-service-ink text-white"
                : "bg-white text-service-ink hover:bg-service-surface"
            }`}
            onClick={() => setActiveView("booked")}
            role="tab"
            type="button"
          >
            Booked jobs
            <span className="ml-2 text-current/65">({bookedLeads.length})</span>
          </button>
          {showProjectIntakes ? (
            <button
              aria-selected={activeView === "intakes"}
              className={`radius-button min-h-12 cursor-pointer px-5 text-left type-caption font-semibold transition-colors ${
                activeView === "intakes"
                  ? "bg-service-ink text-white"
                  : "bg-white text-service-ink hover:bg-service-surface"
              }`}
              onClick={() => setActiveView("intakes")}
              role="tab"
              type="button"
            >
              Client intakes
              <span className="ml-2 text-current/65">
                ({projectIntakes.length})
              </span>
            </button>
          ) : null}
        </div>
      </Card>

      {activeView === "booked" ? (
        <BookedJobsView bookedCounts={bookedCounts} leads={bookedLeads} />
      ) : null}

      {showProjectIntakes && updateProjectIntake && activeView === "intakes" ? (
          <ProjectIntakeDashboard
            deleteProjectIntake={deleteProjectIntake}
            generateProjectIntakeSourcePacket={generateProjectIntakeSourcePacket}
            intakeSaveState={intakeSaveState}
            projectIntakes={projectIntakes}
            savedIntakeId={savedIntakeId}
            sourcePacketPath={sourcePacketPath}
            sourcePacketStats={sourcePacketStats}
            statusOptions={statusOptions}
            strategyDigestPath={strategyDigestPath}
            updateProjectIntake={updateProjectIntake}
          />
      ) : null}

      {activeView === "all" ? (
        <>
      <Card className={dashboardCardPaddingClass}>
        <div className="grid card-grid-gap-med max-lg:grid-cols-2 max-md:grid-cols-1 lg:grid-cols-[1fr_0.7fr_0.7fr_0.8fr_0.7fr] lg:items-end">
          <label className={labelClass}>
            Search
            <input
              className={filterFieldClass}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Name, phone, email, ZIP, address, notes"
              type="search"
              value={searchQuery}
            />
          </label>

          <FilterSelect
            label="Status"
            onChange={setStatusFilter}
            options={statusFilterOptions}
            value={statusFilter}
          />
          <FilterSelect
            label="Urgency"
            onChange={setUrgencyFilter}
            options={urgencyValues}
            value={urgencyFilter}
          />
          <FilterSelect
            label="Service"
            onChange={setServiceFilter}
            options={serviceValues}
            value={serviceFilter}
          />

          <label className={labelClass}>
            Sort
            <select
              className={filterFieldClass}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              value={sortBy}
            >
              <option value="created_at">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="urgency">Urgency</option>
              <option value="status">Status</option>
              <option value="service">Service</option>
            </select>
          </label>
        </div>

        <div className="mt-body-actions-sm flex flex-col inline-gap-med sm:flex-row sm:justify-end">
          <button
            className={compactSecondaryButtonClass}
            disabled={!hasActiveFilters}
            onClick={() => {
              setStatusFilter("");
              setUrgencyFilter("");
              setServiceFilter("");
              setSearchQuery("");
              setSortBy("created_at");
            }}
            type="button"
          >
            Clear filters
          </button>

          <button
            className={compactPrimaryButtonClass}
            disabled={visibleLeads.length === 0}
            onClick={() => exportLeadsToCsv(visibleLeads)}
            type="button"
          >
            Export CSV
          </button>
        </div>

        <p className="mt-heading-body-md type-label text-service-muted">
          Showing {visibleLeads.length} of {leads.length} leads
        </p>
      </Card>

      {leads.length === 0 ? (
        <Card className="mt-body-actions-md p-[var(--container-gutter)] text-center">
          <h2 className="type-heading-md text-service-ink">
            No leads yet
          </h2>
          <p className="type-text-md mx-auto mt-heading-body-sm text-service-muted">
            New website contact requests will appear here after they are saved.
          </p>
        </Card>
      ) : null}

      {leads.length > 0 && visibleLeads.length === 0 ? (
        <Card className="mt-body-actions-md p-[var(--container-gutter)] text-center">
          <h2 className="type-heading-md text-service-ink">
            No matching leads
          </h2>
          <p className="type-text-md mx-auto mt-heading-body-sm text-service-muted">
            Clear filters or adjust your search to see more submissions.
          </p>
        </Card>
      ) : null}

      {visibleLeads.length > 0 ? (
        <div className="mt-body-actions-md grid card-grid-gap-med">
          {visibleLeads.map((lead) => {
            const leadId = String(lead.id);
            const isDetailsOpen = openLeadIds.has(leadId);
            const status = readLeadValue(lead, ["status"]);
            const isBooked = isBookedStatus(status);

            return (
              <Card className={dashboardCardPaddingClass} key={lead.id}>
                <div className="grid layout-gap-med max-lg:grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center inline-gap-med">
                      <h2 className="type-heading-md text-service-ink">
                        {displayValue(readLeadValue(lead, leadFields.name))}
                      </h2>
                      <span
                        className={`radius-round inline-flex items-center gap-2 px-3 py-1 type-caption font-semibold ${getStatusPillClass(status)}`}
                      >
                        {isBooked ? (
                          <svg
                            aria-hidden="true"
                            className="size-3.5 shrink-0"
                            fill="none"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M13.25 4.25 6.5 11 2.75 7.25"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </svg>
                        ) : null}
                        {displayValue(status)}
                      </span>
                    </div>
                    <p className="mt-heading-body-sm type-caption font-semibold text-service-muted">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col inline-gap-med sm:flex-row lg:justify-end">
                    {readLeadText(lead, leadFields.phone) ? (
                      <a
                        className={primaryButtonClass}
                        href={`tel:${readLeadText(lead, leadFields.phone)}`}
                      >
                        Call
                      </a>
                    ) : null}
                    {readLeadText(lead, leadFields.email) ? (
                      <a
                        className={secondaryButtonClass}
                        href={`mailto:${readLeadText(lead, leadFields.email)}`}
                      >
                        Email
                      </a>
                    ) : null}
                  </div>
                </div>

                <button
                  aria-expanded={isDetailsOpen}
                  className={`${dashboardToggleClass} mt-heading-body-md md:hidden`}
                  onClick={() => toggleLeadDetails(leadId)}
                  type="button"
                >
                  <span>{isDetailsOpen ? "Hide details" : "View details"}</span>
                  <span className="text-xl leading-none" aria-hidden="true">
                    {isDetailsOpen ? "-" : "+"}
                  </span>
                </button>

                <div
                  className={`${isDetailsOpen ? "grid" : "hidden"} mt-heading-body-md card-grid-gap-med border-t border-service-border pt-5 md:grid md:grid-cols-2 xl:grid-cols-4`}
                >
                  <LeadDetail label="Phone" value={readLeadValue(lead, leadFields.phone)} />
                  <LeadDetail label="Email" value={readLeadValue(lead, leadFields.email)} />
                  <LeadDetail label="ZIP code" value={readLeadValue(lead, leadFields.zip)} />
                  <LeadDetail label="Service" value={readLeadValue(lead, leadFields.service)} />
                  <LeadDetail
                    label="System"
                    value={readLeadValue(lead, leadFields.systemType)}
                  />
                  <LeadDetail
                    label="Request type"
                    value={readLeadValue(lead, leadFields.requestType)}
                  />
                  <LeadDetail
                    label="Problem"
                    value={readLeadValue(lead, leadFields.problemType)}
                  />
                  <LeadDetail label="Urgency" value={readLeadValue(lead, leadFields.urgency)} />
                  <LeadDetail
                    label="Property type"
                    value={readLeadValue(lead, leadFields.propertyType)}
                  />
                  <LeadDetail
                    label="Appointment window"
                    value={readLeadValue(lead, ["appointment_window"])}
                  />
                  <LeadDetail label="Address" value={readLeadValue(lead, leadFields.address)} />
                  <LeadDetail
                    label="Contact consent"
                    value={readLeadValue(lead, leadFields.consent)}
                  />
                  <LeadDetail
                    label="Preferred contact"
                    value={readLeadValue(lead, leadFields.preferredContactMethod)}
                  />
                  <LeadDetail label="Source" value={readLeadValue(lead, leadFields.source)} />
                </div>

                <div
                  className={`${isDetailsOpen ? "block" : "hidden"} mt-heading-body-md ${dashboardPanelClass} md:block`}
                >
                  <p className={dashboardMutedLabelClass}>
                    Description
                  </p>
                  <p className="type-text-md mt-heading-body-sm text-service-muted">
                    {displayValue(readLeadValue(lead, leadFields.description))}
                  </p>
                </div>

                <form
                  action={updateLead}
                  className={`mt-heading-body-md grid card-grid-gap-med ${dashboardPanelClass} max-lg:grid-cols-1 lg:grid-cols-[0.35fr_1fr_auto] lg:items-end`}
                >
                  <input name="leadId" type="hidden" value={leadId} />
                  <label className={labelClass}>
                    Status
                    <select
                      className={fieldClass}
                      defaultValue={String(readLeadValue(lead, ["status"]) ?? "New")}
                      name="status"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={labelClass}>
                    Notes
                    <textarea
                      className={`${fieldClass} min-h-24 py-2 lg:w-full`}
                      defaultValue={String(readLeadValue(lead, ["notes"]) ?? "")}
                      name="notes"
                      placeholder="Add follow-up notes"
                    />
                  </label>

                  <div>
                    <button
                      className={`${primaryButtonClass} lg:w-auto`}
                      type="submit"
                    >
                      Save
                    </button>
                    {savedLeadId === leadId && saveState === "success" ? (
                      <p className="type-caption mt-heading-body-sm font-semibold text-service-accent">
                        Lead saved.
                      </p>
                    ) : null}
                    {savedLeadId === leadId && saveState === "error" ? (
                      <p className="type-caption mt-heading-body-sm font-semibold text-red-700">
                        Could not save.
                      </p>
                    ) : null}
                  </div>
                </form>
              </Card>
            );
          })}
        </div>
      ) : null}

      <button
        className="radius-button fixed bottom-5 right-5 z-40 inline-flex min-h-12 cursor-pointer items-center justify-center border border-service-border bg-white/95 px-5 type-caption font-semibold text-service-ink shadow-service transition-colors hover:border-service-accent hover:text-service-accent"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        type="button"
      >
        Back to top
      </button>
        </>
      ) : null}
    </>
  );
}

export function ProjectIntakeDashboard({
  deleteProjectIntake,
  generateProjectIntakeSourcePacket,
  intakeSaveState,
  projectIntakes,
  savedIntakeId,
  sourcePacketPath,
  sourcePacketStats,
  statusOptions,
  strategyDigestPath,
  updateProjectIntake,
}: {
  deleteProjectIntake?: (formData: FormData) => void;
  generateProjectIntakeSourcePacket?: (formData: FormData) => void;
  intakeSaveState: string | null;
  projectIntakes: ProjectIntake[];
  savedIntakeId: string | null;
  sourcePacketPath?: string | null;
  sourcePacketStats?: SourcePacketStat[];
  statusOptions: string[];
  strategyDigestPath?: string | null;
  updateProjectIntake: (formData: FormData) => void;
}) {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "oldest" | "business">(
    "created_at",
  );
  const [copiedIntakeId, setCopiedIntakeId] = useState<string | null>(null);
  const [openIntakeIds, setOpenIntakeIds] = useState<Set<string>>(new Set());
  const [pendingDeleteIntake, setPendingDeleteIntake] =
    useState<ProjectIntake | null>(null);

  const statusFilterOptions = useMemo(
    () =>
      Array.from(
        new Set(
          projectIntakes
            .map((intake) =>
              typeof intake.status === "string" ? intake.status : null,
            )
            .filter((value): value is string => Boolean(value)),
        ),
      ).filter((status) => statusOptions.includes(status)),
    [projectIntakes, statusOptions],
  );

  const visibleIntakes = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    const filteredIntakes = projectIntakes
      .filter((intake) =>
        statusFilter ? intake.status === statusFilter : true,
      )
      .filter((intake) => matchesProjectIntake(intake, normalizedSearch));

    return [...filteredIntakes].sort((a, b) => {
      if (sortBy === "oldest") {
        return getDateTime(a.created_at) - getDateTime(b.created_at);
      }

      if (sortBy === "business") {
        return compareText(
          String(a.business_name ?? ""),
          String(b.business_name ?? ""),
        );
      }

      return getDateTime(b.created_at) - getDateTime(a.created_at);
    });
  }, [projectIntakes, searchQuery, sortBy, statusFilter]);

  const hasActiveFilters = statusFilter || searchQuery || sortBy !== "created_at";

  function toggleIntakeDetails(intakeId: string) {
    setOpenIntakeIds((current) => {
      const next = new Set(current);

      if (next.has(intakeId)) {
        next.delete(intakeId);
      } else {
        next.add(intakeId);
      }

      return next;
    });
  }

  async function copyIntakeBrief(intake: ProjectIntake) {
    const intakeId = String(intake.id);
    const brief = formatProjectIntakeBrief(intake);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(brief);
    } catch {
      copyTextWithTextareaFallback(brief);
    }

    setCopiedIntakeId(intakeId);
    window.setTimeout(() => {
      setCopiedIntakeId((current) => (current === intakeId ? null : current));
    }, 1800);
  }

  return (
    <>
      <Card className={dashboardCardPaddingClass}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b border-service-border pb-5">
          <div>
            <p className="type-label text-service-accent">Controls</p>
            <h2 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
              Find the right project brief.
            </h2>
          </div>
          <p className="type-caption font-semibold text-service-muted">
            Showing {visibleIntakes.length} of {projectIntakes.length}
          </p>
        </div>

        <div className="grid card-grid-gap-med max-lg:grid-cols-2 max-md:grid-cols-1 lg:grid-cols-[1fr_0.65fr_0.65fr] lg:items-end">
          <label className={labelClass}>
            Search
            <input
              className={filterFieldClass}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Business, contact, email, phone, services, area"
              type="search"
              value={searchQuery}
            />
          </label>

          <FilterSelect
            label="Status"
            onChange={setStatusFilter}
            options={statusFilterOptions}
            value={statusFilter}
          />

          <label className={labelClass}>
            Sort
            <select
              className={filterFieldClass}
              onChange={(event) =>
                setSortBy(event.target.value as "created_at" | "oldest" | "business")
              }
              value={sortBy}
            >
              <option value="created_at">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="business">Business name</option>
            </select>
          </label>
        </div>

        <div className="mt-body-actions-sm flex flex-col inline-gap-med sm:flex-row sm:justify-end">
          <button
            className={compactSecondaryButtonClass}
            disabled={!hasActiveFilters}
            onClick={() => {
              setStatusFilter("");
              setSearchQuery("");
              setSortBy("created_at");
            }}
            type="button"
          >
            Clear filters
          </button>

          <button
            className={compactPrimaryButtonClass}
            disabled={visibleIntakes.length === 0}
            onClick={() => exportProjectIntakesToCsv(visibleIntakes)}
            type="button"
          >
            Export CSV
          </button>
        </div>

        <p className="mt-heading-body-md type-caption font-semibold text-service-muted">
          Filters apply to the intake cards below.
        </p>
        {intakeSaveState === "deleted" ? (
          <p className="mt-heading-body-sm type-caption font-semibold text-service-accent">
            Intake deleted.
          </p>
        ) : null}
        {intakeSaveState === "delete-error" ? (
          <p className="mt-heading-body-sm type-caption font-semibold text-red-700">
            Could not delete intake. Check the dev server console for the
            Supabase error details.
          </p>
        ) : null}
        {intakeSaveState === "delete-config-error" ? (
          <p className="mt-heading-body-sm type-caption font-semibold text-red-700">
            Could not delete intake. Add SUPABASE_SERVICE_ROLE_KEY or
            SUPABASE_SECRET_KEY to the local environment and restart the dev
            server.
          </p>
        ) : null}
        {intakeSaveState === "source-packet-success" ? (
          <div className="mt-heading-body-sm grid card-grid-gap-med rounded-[var(--radius-md-token)] border border-service-border bg-white p-5">
            <div className="grid card-grid-gap-sm">
              <p className="type-text-sm font-semibold text-service-accent">
                Packet and strategy digest created.
              </p>
              {sourcePacketPath ? (
                <div className="grid gap-1">
                  <p className={dashboardMutedLabelClass}>Source packet</p>
                  <p className="type-text-sm break-all rounded-[var(--radius-sm-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    {sourcePacketPath}
                  </p>
                </div>
              ) : null}
              {strategyDigestPath ? (
                <div className="grid gap-1">
                  <p className={dashboardMutedLabelClass}>Strategy digest</p>
                  <p className="type-text-sm break-all rounded-[var(--radius-sm-token)] bg-service-surface px-3 py-2 font-mono text-service-ink">
                    {strategyDigestPath}
                  </p>
                </div>
              ) : null}
            </div>
            {sourcePacketPath ? (
              <div className="sr-only">File path: {sourcePacketPath}</div>
            ) : null}
            {sourcePacketStats && sourcePacketStats.length > 0 ? (
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {sourcePacketStats.map((stat) => (
                  <div
                    className="rounded-[var(--radius-sm-token)] bg-service-surface p-3"
                    key={stat.label}
                  >
                    <dt className="type-caption font-semibold text-service-muted">
                      {stat.label}
                    </dt>
                    <dd className="type-text-sm mt-1 font-semibold text-service-ink">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}
        {intakeSaveState === "source-packet-error" ? (
          <p className="mt-heading-body-sm type-caption font-semibold text-red-700">
            Could not generate source packet and strategy digest. Check the dev
            server console for details.
          </p>
        ) : null}
      </Card>

      {projectIntakes.length === 0 ? (
        <Card className="mt-body-actions-md p-[var(--container-gutter)] text-center">
          <h2 className="type-heading-md text-service-ink">
            No client intakes yet
          </h2>
          <p className="type-text-md mx-auto mt-heading-body-sm text-service-muted">
            Completed client-intake wizard submissions will appear here.
          </p>
        </Card>
      ) : null}

      {projectIntakes.length > 0 && visibleIntakes.length === 0 ? (
        <Card className="mt-body-actions-md p-[var(--container-gutter)] text-center">
          <h2 className="type-heading-md text-service-ink">
            No matching intakes
          </h2>
          <p className="type-text-md mx-auto mt-heading-body-sm text-service-muted">
            Clear filters or adjust your search to see more project briefs.
          </p>
        </Card>
      ) : null}

      {visibleIntakes.length > 0 ? (
        <div className="mt-body-actions-md grid card-grid-gap-lrg">
          {visibleIntakes.map((intake) => {
            const intakeId = String(intake.id);
            const isDetailsOpen = openIntakeIds.has(intakeId);
            const isCopied = copiedIntakeId === intakeId;
            const serviceAreaDetails =
              getProjectIntakeServiceAreaDetails(intake);
            const status = intake.status ?? "New";
            const hasCreatedPacket =
              typeof status === "string" &&
              status.toLowerCase() === "packet created";
            const strategyHref = `/dev/projects/${createProjectSlug(
              intake.business_name,
              intakeId,
            )}/strategy`;

            return (
              <Card
                className={`${dashboardCardPaddingClass} overflow-hidden`}
                key={intake.id}
              >
                <div className="grid layout-gap-med max-lg:grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center inline-gap-med">
                      <h2 className="type-heading-md text-service-ink">
                        {displayValue(intake.business_name)}
                      </h2>
                      <span
                        className={`radius-round inline-flex items-center px-3 py-1 type-caption font-semibold ${getStatusPillClass(status)}`}
                      >
                        {displayValue(status)}
                      </span>
                    </div>
                    <p className="mt-heading-body-sm type-caption font-semibold text-service-muted">
                      {formatDate(intake.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-col inline-gap-med sm:flex-row lg:justify-end">
                    <button
                      className={secondaryButtonClass}
                      onClick={() => void copyIntakeBrief(intake)}
                      type="button"
                    >
                      {isCopied ? "Copied" : "Copy intake"}
                    </button>
                    {generateProjectIntakeSourcePacket ? (
                      <form action={generateProjectIntakeSourcePacket}>
                        <input name="intakeId" type="hidden" value={intakeId} />
                        <button className={secondaryButtonClass} type="submit">
                          {hasCreatedPacket
                            ? "Regenerate packet"
                            : "Generate packet"}
                        </button>
                      </form>
                    ) : null}
                    {hasCreatedPacket ? (
                      <Link className={secondaryButtonClass} href={strategyHref}>
                        Open strategy
                      </Link>
                    ) : null}
                    {intake.contact_phone ? (
                      <a
                        className={primaryButtonClass}
                        href={`tel:${String(intake.contact_phone)}`}
                      >
                        Call
                      </a>
                    ) : null}
                    {intake.contact_email ? (
                      <a
                        className={secondaryButtonClass}
                        href={`mailto:${String(intake.contact_email)}`}
                      >
                        Email
                      </a>
                    ) : null}
                    {intake.website ? (
                      <a
                        className={secondaryButtonClass}
                        href={String(intake.website)}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Website
                      </a>
                    ) : null}
                    {deleteProjectIntake ? (
                      <button
                        className={destructiveButtonClass}
                        onClick={() => setPendingDeleteIntake(intake)}
                        type="button"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>

                <button
                  aria-expanded={isDetailsOpen}
                  className={`${dashboardToggleClass} mt-heading-body-md`}
                  onClick={() => toggleIntakeDetails(intakeId)}
                  type="button"
                >
                  <span>{isDetailsOpen ? "Hide answers" : "View answers"}</span>
                  <span className="text-xl leading-none" aria-hidden="true">
                    {isDetailsOpen ? "-" : "+"}
                  </span>
                </button>

                {isDetailsOpen ? (
                  <ProjectIntakePayloadView payload={intake.payload} />
                ) : null}

                <div className="mt-heading-body-md grid card-grid-gap-med rounded-[var(--radius-md-token)] bg-service-surface p-5">
                  <div className="grid card-grid-gap-med md:grid-cols-2 xl:grid-cols-4">
                    <LeadDetail label="Contact" value={intake.contact_name} />
                    <LeadDetail label="Email" value={intake.contact_email} />
                    <LeadDetail label="Phone" value={intake.contact_phone} />
                    <LeadDetail label="Business type" value={intake.business_type} />
                    <LeadListDetail
                      items={displayStringItems(intake.preferred_cta)}
                      label="Preferred CTA"
                    />
                    <LeadDetail label="Source" value={intake.source} />
                  </div>

                  <div className="grid card-grid-gap-med border-t border-service-border pt-5 md:grid-cols-2">
                    <div className="grid card-grid-gap-med content-start">
                      <LeadListDetail
                        items={displayStringItems(intake.main_services)}
                        label="Main services"
                      />
                      <LeadDetail
                        label="Priority services"
                        value={intake.priority_services}
                      />
                    </div>

                    <div className="grid card-grid-gap-med content-start">
                      <LeadDetail
                        label="All service areas"
                        value={serviceAreaDetails.allServiceAreas}
                        valueClassName="type-text-sm mt-1 whitespace-pre-line break-words text-service-ink"
                      />
                      <LeadDetail
                        label="Priority service areas"
                        value={serviceAreaDetails.priorityServiceAreas}
                        valueClassName="type-text-sm mt-1 whitespace-pre-line break-words text-service-ink"
                      />
                    </div>
                  </div>
                </div>

                <form
                  action={updateProjectIntake}
                  className="mt-heading-body-md grid card-grid-gap-med rounded-[var(--radius-md-token)] border border-service-border bg-white p-5 max-lg:grid-cols-1 lg:grid-cols-[0.35fr_auto] lg:items-end"
                >
                  <input name="intakeId" type="hidden" value={intakeId} />
                  <label className={labelClass}>
                    Status
                    <select
                      className={fieldClass}
                      defaultValue={String(status)}
                      name="status"
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div>
                    <button
                      className={`${primaryButtonClass} lg:w-auto`}
                      type="submit"
                    >
                      Save
                    </button>
                    {savedIntakeId === intakeId &&
                    intakeSaveState === "success" ? (
                      <p className="type-caption mt-heading-body-sm font-semibold text-service-accent">
                        Intake saved.
                      </p>
                    ) : null}
                    {savedIntakeId === intakeId && intakeSaveState === "error" ? (
                      <p className="type-caption mt-heading-body-sm font-semibold text-red-700">
                        Could not save.
                      </p>
                    ) : null}
                  </div>
                </form>
              </Card>
            );
          })}
        </div>
      ) : null}

      {pendingDeleteIntake && deleteProjectIntake ? (
        <div
          aria-labelledby="delete-intake-title"
          aria-modal="true"
          className="fixed inset-0 z-50 grid place-items-center bg-service-ink/55 p-[var(--container-gutter)] backdrop-blur-sm"
          role="dialog"
        >
          <Card className="w-full max-w-lg border-service-border bg-white p-[var(--container-gutter)] shadow-service">
            <p className="type-label text-red-700">Delete intake</p>
            <h2
              className="type-heading-md mt-eyebrow-heading-sm text-service-ink"
              id="delete-intake-title"
            >
              Are you sure?
            </h2>
            <p className="type-text-md mt-heading-body-sm text-service-muted">
              This will permanently delete the intake for{" "}
              <span className="font-semibold text-service-ink">
                {displayValue(pendingDeleteIntake.business_name)}
              </span>
              .
            </p>
            <form
              action={deleteProjectIntake}
              className="mt-body-actions-md flex flex-col inline-gap-med sm:flex-row sm:justify-end"
            >
              <input
                name="intakeId"
                type="hidden"
                value={String(pendingDeleteIntake.id)}
              />
              <button
                className={secondaryButtonClass}
                onClick={() => setPendingDeleteIntake(null)}
                type="button"
              >
                Cancel
              </button>
              <button className={destructiveButtonClass} type="submit">
                Delete intake
              </button>
            </form>
          </Card>
        </div>
      ) : null}
    </>
  );
}

function ProjectIntakePayloadView({ payload }: { payload?: JsonValue }) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const sections = Object.entries(payload).filter(
    ([key, value]) => key !== "variant" && value && typeof value === "object",
  );

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className={`mt-2 ${dashboardPanelClass}`}>
      {sections.map(([sectionName, sectionValue]) => (
        <section
          className="border-b border-service-border pb-6 last:border-b-0 last:pb-0 [&+section]:mt-6"
          key={sectionName}
        >
          <h3 className="type-text-sm font-semibold text-service-ink">
            {formatAnswerLabel(sectionName)}
          </h3>
          <div className="mt-1 grid gap-x-6 gap-y-4 md:grid-cols-2">
            {Object.entries(sectionValue as Record<string, JsonValue>).map(
              ([answerKey, answerValue]) => (
                <ProjectIntakeAnswerDetail
                  key={answerKey}
                  label={formatAnswerLabel(answerKey)}
                  value={answerValue}
                />
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function formatProjectIntakeBrief(intake: ProjectIntake) {
  const lines: string[] = [];
  const serviceAreaDetails = getProjectIntakeServiceAreaDetails(intake);

  lines.push("CLIENT INTAKE BRIEF");
  addBriefLine(lines, "Business", intake.business_name);
  addBriefLine(lines, "Status", intake.status);
  addBriefLine(lines, "Submitted", formatDate(intake.created_at));
  addBriefLine(lines, "Contact", intake.contact_name);
  addBriefLine(lines, "Email", intake.contact_email);
  addBriefLine(lines, "Phone", intake.contact_phone);
  addBriefLine(lines, "Website", intake.website);
  addBriefLine(lines, "Business type", intake.business_type);
  addBriefLine(lines, "Main services", displayStringList(intake.main_services));
  addBriefLine(lines, "Preferred CTA", displayStringList(intake.preferred_cta));
  addBriefLine(lines, "Priority services", intake.priority_services);
  addBriefLine(lines, "All service areas", serviceAreaDetails.allServiceAreas);
  addBriefLine(
    lines,
    "Priority service areas",
    serviceAreaDetails.priorityServiceAreas,
  );
  addBriefLine(lines, "Source", intake.source);

  const payloadLines = formatProjectIntakePayloadForCopy(intake.payload);

  if (payloadLines.length > 0) {
    lines.push("", "INTAKE ANSWERS", ...payloadLines);
  }

  return lines.join("\n");
}

function addBriefLine(
  lines: string[],
  label: string,
  value: LeadValue | string,
) {
  const formatted = displayValue(value);

  if (formatted === "Not provided") {
    return;
  }

  lines.push(`${label}: ${formatted}`);
}

function formatProjectIntakePayloadForCopy(payload?: JsonValue) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }

  const lines: string[] = [];

  Object.entries(payload).forEach(([sectionName, sectionValue]) => {
    if (
      sectionName === "variant" ||
      !sectionValue ||
      typeof sectionValue !== "object" ||
      Array.isArray(sectionValue)
    ) {
      return;
    }

    const answers = Object.entries(sectionValue)
      .map(([answerKey, answerValue]) => {
        const formatted = formatAnswerValue(answerValue);

        if (formatted === "Not provided") {
          return null;
        }

        return `- ${formatAnswerLabel(answerKey)}: ${formatted}`;
      })
      .filter((line): line is string => Boolean(line));

    if (answers.length === 0) {
      return;
    }

    if (lines.length > 0) {
      lines.push("");
    }

    lines.push(`${formatAnswerLabel(sectionName)}:`, ...answers);
  });

  return lines;
}

function copyTextWithTextareaFallback(value: string) {
  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";

  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function ProjectIntakeAnswerDetail({
  label,
  value,
}: {
  label: string;
  value: JsonValue;
}) {
  const listItems = Array.isArray(value)
    ? value.map(formatAnswerValue).filter(Boolean)
    : [];
  const renderedValue = formatAnswerValue(value);
  const isBodyAnswer = renderedValue.length > 80;

  return (
    <div className={`min-w-0 ${isBodyAnswer || listItems.length > 0 ? "md:col-span-2" : ""}`}>
      <p className="type-caption font-semibold text-service-muted">{label}</p>
      {listItems.length > 0 ? (
        <TokenList items={listItems} />
      ) : (
        <p
          className={
            isBodyAnswer
              ? "type-text-sm mt-1 max-w-3xl break-words leading-relaxed text-service-ink"
              : "type-text-sm mt-0.5 break-words text-service-ink"
          }
        >
          {renderedValue}
        </p>
      )}
    </div>
  );
}

function LeadListDetail({
  items,
  label,
}: {
  items: string[];
  label: string;
}) {
  const renderedValue = items.length > 0 ? items.join(", ") : "Not provided";

  return (
    <div className="min-w-0">
      <p className={dashboardMutedLabelClass}>{label}</p>
      <p className="type-text-sm mt-1 break-words text-service-ink">
        {renderedValue}
      </p>
    </div>
  );
}

function TokenList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="type-text-sm mt-1 break-words text-service-ink">
        Not provided
      </p>
    );
  }

  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          className="radius-round bg-white px-3 py-1 type-text-sm text-service-ink"
          key={`${item}-${index}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function formatAnswerLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAnswerValue(value: JsonValue): string {
  if (Array.isArray(value)) {
    return value.map(formatAnswerValue).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, nestedValue]) => {
        const formatted = formatAnswerValue(nestedValue);

        if (formatted === "Not provided") {
          return null;
        }

        return `${formatAnswerLabel(key)}: ${formatted}`;
      })
      .filter((line): line is string => Boolean(line))
      .join("; ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === "") {
    return "Not provided";
  }

  return String(value);
}

function BookedJobsView({
  bookedCounts,
  leads,
}: {
  bookedCounts: Record<BookedTiming, number>;
  leads: Lead[];
}) {
  return (
    <div className="grid layout-gap-med">
      <div className="grid card-grid-gap-med max-lg:grid-cols-1 lg:grid-cols-3">
        <BookedCountCard
          body="Booked jobs that still need a scheduled visit date."
          count={bookedCounts["needs-date"]}
          label="No date set"
          tone="needs-date"
        />
        <BookedCountCard
          body="Booked jobs with a future scheduled date."
          count={bookedCounts.upcoming}
          label="Upcoming"
          tone="upcoming"
        />
        <BookedCountCard
          body={
            bookedCounts.past === 0
              ? "No booked jobs are past their scheduled date."
              : "Booked jobs with a scheduled date that has already passed."
          }
          count={bookedCounts.past}
          label={bookedCounts.past === 0 ? "On schedule" : "Date passed"}
          tone="past"
        />
      </div>

      {leads.length === 0 ? (
        <Card className="p-[var(--container-gutter)] text-center">
          <h2 className="type-heading-md text-service-ink">
            No booked jobs yet
          </h2>
          <p className="type-text-md mx-auto mt-heading-body-sm text-service-muted">
            Change a lead status to Booked and it will appear in this view.
          </p>
        </Card>
      ) : (
        <div className="grid card-grid-gap-med">
          {leads.map((lead) => (
            <BookedJobCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}

function BookedCountCard({
  body,
  count,
  label,
  tone,
}: {
  body: string;
  count: number;
  label: string;
  tone: BookedTiming;
}) {
  const isClearPastDueState = tone === "past" && count === 0;

  return (
    <Card
      className={`border p-[var(--container-gutter)] ${
        isClearPastDueState
          ? "flex min-h-48 flex-col items-center justify-center bg-green-50 text-center text-green-900"
          : getBookedTimingCardClass(tone)
      }`}
    >
      <p className="type-label opacity-75">
        {label}
      </p>
      {isClearPastDueState ? (
        <p className="type-heading-md mt-heading-body-sm">On schedule</p>
      ) : (
        <p className="type-display-lg mt-heading-body-sm">{count}</p>
      )}
      <p className="type-text-md mt-heading-body-sm opacity-75">{body}</p>
    </Card>
  );
}

function BookedJobCard({ lead }: { lead: Lead }) {
  const timing = getBookedTiming(lead);
  const scheduledValue = readLeadValue(lead, leadFields.scheduledDate);

  return (
    <Card
      className={`overflow-hidden p-0 ${
        timing === "past" ? "border-red-400" : ""
      }`}
    >
      <div className="grid min-h-40 grid-cols-[minmax(0,0.36fr)_minmax(0,1fr)] max-lg:grid-cols-1">
        <div
          className={`flex flex-col justify-between border-r border-service-border p-[var(--container-gutter)] max-lg:border-b max-lg:border-r-0 ${getBookedTimingCardClass(timing)}`}
        >
          <span
            className={`radius-round w-fit px-3 py-1 type-caption font-semibold ${getBookedTimingPillClass(timing)}`}
          >
            {getBookedTimingLabel(timing)}
          </span>
          <p className="type-heading-md mt-body-actions-md">
            {timing === "needs-date" ? "Schedule next" : formatDate(scheduledValue)}
          </p>
        </div>

        <div className="grid layout-gap-med p-[var(--container-gutter)] md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0">
            <h2 className="type-heading-md text-service-ink">
              {displayValue(readLeadValue(lead, leadFields.name))}
            </h2>
            <p className="mt-heading-body-sm type-caption font-semibold text-service-muted">
              Booked from {formatDate(lead.created_at)}
            </p>
            <div className="mt-heading-body-md grid card-grid-gap-med md:grid-cols-2 xl:grid-cols-4">
              <LeadDetail
                label="Service"
                value={readLeadValue(lead, leadFields.service)}
              />
              <LeadDetail
                label="Urgency"
                value={readLeadValue(lead, leadFields.urgency)}
              />
              <LeadDetail
                label="Phone"
                value={readLeadValue(lead, leadFields.phone)}
              />
              <LeadDetail
                label="ZIP"
                value={readLeadValue(lead, leadFields.zip)}
              />
            </div>
          </div>

          <div className="flex flex-col inline-gap-med sm:flex-row md:flex-col">
            {readLeadText(lead, leadFields.phone) ? (
              <a
                className={primaryButtonClass}
                href={`tel:${readLeadText(lead, leadFields.phone)}`}
              >
                Call
              </a>
            ) : null}
            {readLeadText(lead, leadFields.email) ? (
              <a
                className={secondaryButtonClass}
                href={`mailto:${readLeadText(lead, leadFields.email)}`}
              >
                Email
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

function FilterSelect({
  colorOptions = false,
  label,
  onChange,
  options,
  value,
}: {
  colorOptions?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className={labelClass}>
      {label}
      <select
        className={filterFieldClass}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        <option value="">All</option>
        {options.map((option) => (
          <option
            className={colorOptions ? getStatusOptionClass(option) : undefined}
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function LeadDetail({
  className = "",
  label,
  value,
  valueClassName,
}: {
  className?: string;
  label: string;
  value: LeadValue;
  valueClassName?: string;
}) {
  const renderedValue = displayValue(value);

  return (
    <div className={`min-w-0 ${className}`}>
      <p className={dashboardMutedLabelClass}>
        {label}
      </p>
      <p className={valueClassName ?? "type-text-sm mt-1 break-words text-service-ink"}>
        {renderedValue}
      </p>
    </div>
  );
}
