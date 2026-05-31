"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/primitives";

type LeadValue = boolean | number | string | null | undefined;

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

type SortOption =
  | "created_at"
  | "oldest"
  | "service"
  | "status"
  | "urgency";

type DashboardView = "all" | "booked";

type BookedTiming = "needs-date" | "upcoming" | "past";

type LeadDashboardProps = {
  leads: Lead[];
  savedLeadId: string | null;
  saveState: string | null;
  statusOptions: string[];
  updateLead: (formData: FormData) => void;
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
  "h-11 rounded-md border border-service-border bg-white px-3 text-base text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

const filterFieldClass =
  "h-11 rounded-md border border-service-border bg-white px-3 text-sm text-service-ink outline-none transition placeholder:text-service-muted/55 focus:border-service-accent focus:ring-4 focus:ring-service-accent/15";

const labelClass =
  "grid gap-2 text-sm font-semibold uppercase tracking-widest text-service-ink";

const secondaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const primaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center whitespace-nowrap rounded-md bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const compactSecondaryButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center whitespace-nowrap rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const compactPrimaryButtonClass =
  "inline-flex min-h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink disabled:cursor-not-allowed disabled:opacity-50 max-sm:w-full sm:w-auto";

const statusPillClassByStatus: Record<string, string> = {
  booked: "bg-green-600 text-white",
  completed: "bg-green-50 text-green-700",
  contacted: "bg-blue-50 text-blue-700",
  lost: "bg-red-50 text-red-700",
  new: "bg-service-surface text-service-accent",
  "not responding": "bg-red-50 text-red-700",
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

export function LeadDashboard({
  leads,
  savedLeadId,
  saveState,
  statusOptions,
  updateLead,
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
          className="grid gap-2 rounded-lg bg-service-surface max-md:grid-cols-1 md:grid-cols-2"
          role="tablist"
        >
          <button
            aria-selected={activeView === "all"}
            className={`min-h-12 cursor-pointer rounded-md px-5 text-left text-sm font-semibold transition-colors ${
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
            className={`min-h-12 cursor-pointer rounded-md px-5 text-left text-sm font-semibold transition-colors ${
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
        </div>
      </Card>

      {activeView === "booked" ? (
        <BookedJobsView bookedCounts={bookedCounts} leads={bookedLeads} />
      ) : null}

      {activeView === "all" ? (
        <>
      <Card className="p-6">
        <div className="grid gap-4 max-lg:grid-cols-2 max-md:grid-cols-1 lg:grid-cols-[1fr_0.7fr_0.7fr_0.8fr_0.7fr] lg:items-end">
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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
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

        <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-service-muted">
          Showing {visibleLeads.length} of {leads.length} leads
        </p>
      </Card>

      {leads.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <h2 className="text-2xl font-semibold leading-tight text-service-ink">
            No leads yet
          </h2>
          <p className="mt-3 text-base leading-7 text-service-muted">
            New website contact requests will appear here after they are saved.
          </p>
        </Card>
      ) : null}

      {leads.length > 0 && visibleLeads.length === 0 ? (
        <Card className="mt-6 p-8 text-center">
          <h2 className="text-2xl font-semibold leading-tight text-service-ink">
            No matching leads
          </h2>
          <p className="mt-3 text-base leading-7 text-service-muted">
            Clear filters or adjust your search to see more submissions.
          </p>
        </Card>
      ) : null}

      {visibleLeads.length > 0 ? (
        <div className="mt-6 grid gap-5">
          {visibleLeads.map((lead) => {
            const leadId = String(lead.id);
            const isDetailsOpen = openLeadIds.has(leadId);
            const status = readLeadValue(lead, ["status"]);
            const isBooked = isBookedStatus(status);

            return (
              <Card className="p-6" key={lead.id}>
                <div className="grid gap-4 max-lg:grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold leading-tight text-service-ink">
                        {displayValue(readLeadValue(lead, leadFields.name))}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-widest ${getStatusPillClass(status)}`}
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
                    <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-service-muted">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
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
                  className="mt-5 flex w-full cursor-pointer items-center justify-between border-t border-service-border pt-4 text-left text-sm font-semibold uppercase tracking-widest text-service-accent md:hidden"
                  onClick={() => toggleLeadDetails(leadId)}
                  type="button"
                >
                  <span>{isDetailsOpen ? "Hide details" : "View details"}</span>
                  <span className="text-xl leading-none" aria-hidden="true">
                    {isDetailsOpen ? "-" : "+"}
                  </span>
                </button>

                <div
                  className={`${isDetailsOpen ? "grid" : "hidden"} mt-5 gap-x-5 gap-y-4 border-t border-service-border pt-5 md:grid md:grid-cols-2 xl:grid-cols-4`}
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
                  className={`${isDetailsOpen ? "block" : "hidden"} mt-5 rounded-lg border border-service-border bg-service-surface p-4 md:block`}
                >
                  <p className="text-sm font-semibold uppercase tracking-widest text-service-muted">
                    Description
                  </p>
                  <p className="mt-2 text-base leading-7 text-service-muted">
                    {displayValue(readLeadValue(lead, leadFields.description))}
                  </p>
                </div>

                <form
                  action={updateLead}
                  className="mt-5 grid gap-4 rounded-lg border border-service-border bg-service-surface p-4 max-lg:grid-cols-1 lg:grid-cols-[0.35fr_1fr_auto] lg:items-end"
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
                      <p className="mt-2 text-sm font-semibold text-service-accent">
                        Lead saved.
                      </p>
                    ) : null}
                    {savedLeadId === leadId && saveState === "error" ? (
                      <p className="mt-2 text-sm font-semibold text-red-700">
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
        className="fixed bottom-5 right-5 z-40 inline-flex min-h-10 cursor-pointer items-center justify-center rounded-md border border-service-border bg-white/95 px-4 text-sm font-semibold text-service-ink shadow-service transition-colors hover:border-service-accent hover:text-service-accent"
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

function BookedJobsView({
  bookedCounts,
  leads,
}: {
  bookedCounts: Record<BookedTiming, number>;
  leads: Lead[];
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 max-lg:grid-cols-1 lg:grid-cols-3">
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
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-semibold leading-tight text-service-ink">
            No booked jobs yet
          </h2>
          <p className="mt-3 text-base leading-7 text-service-muted">
            Change a lead status to Booked and it will appear in this view.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
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
      className={`border p-6 ${
        isClearPastDueState
          ? "flex min-h-48 flex-col items-center justify-center bg-green-50 text-center text-green-900"
          : getBookedTimingCardClass(tone)
      }`}
    >
      <p className="text-sm font-semibold uppercase tracking-widest opacity-75">
        {label}
      </p>
      {isClearPastDueState ? (
        <p className="mt-4 text-3xl font-semibold leading-tight">On schedule</p>
      ) : (
        <p className="mt-4 text-5xl font-semibold leading-none">{count}</p>
      )}
      <p className="mt-4 text-base leading-7 opacity-75">{body}</p>
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
          className={`flex flex-col justify-between border-r border-service-border p-5 max-lg:border-b max-lg:border-r-0 ${getBookedTimingCardClass(timing)}`}
        >
          <span
            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${getBookedTimingPillClass(timing)}`}
          >
            {getBookedTimingLabel(timing)}
          </span>
          <p className="mt-8 text-2xl font-semibold leading-tight">
            {timing === "needs-date" ? "Schedule next" : formatDate(scheduledValue)}
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold leading-tight text-service-ink">
              {displayValue(readLeadValue(lead, leadFields.name))}
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-service-muted">
              Booked from {formatDate(lead.created_at)}
            </p>
            <div className="mt-5 grid gap-x-5 gap-y-3 md:grid-cols-2 xl:grid-cols-4">
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

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
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
  label,
  value,
}: {
  label: string;
  value: LeadValue;
}) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold uppercase tracking-widest text-service-muted">
        {label}
      </p>
      <p className="mt-1 break-words text-base leading-7 text-service-ink">
        {displayValue(value)}
      </p>
    </div>
  );
}
