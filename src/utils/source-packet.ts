import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type ScalarValue = boolean | number | string | null | undefined;
type JsonValue =
  | boolean
  | number
  | string
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ProjectIntakeSourceRecord = {
  id: string;
  business_name?: ScalarValue;
  business_type?: ScalarValue;
  contact_email?: ScalarValue;
  contact_name?: ScalarValue;
  contact_phone?: ScalarValue;
  created_at?: ScalarValue;
  main_services?: string[] | null;
  payload?: JsonValue;
  preferred_cta?: string[] | null;
  priority_services?: ScalarValue;
  service_area?: ScalarValue;
  source?: ScalarValue;
  status?: ScalarValue;
  website?: ScalarValue;
};

type SourcePacketItemType =
  | "structured_field"
  | "structured_selection"
  | "verified_quote"
  | "normalized_candidate"
  | "external_public_fact"
  | "missing_info"
  | "conflict";

type SourcePacketItem = {
  id: string;
  category: string;
  source_type: "intake" | "derived_rule" | "external";
  source_field: string;
  item_type: SourcePacketItemType;
  value: JsonValue;
  verified_verbatim: boolean;
  confidence: number;
  source_support: string[];
  related_items: string[];
  notes: string;
};

export type SourcePacket = {
  schema_version: "source-packet.v1";
  generator: "deterministic-intake-source-packet";
  generator_version: 1;
  client_slug: string;
  source_intake_id: string;
  source_type: "project_intake";
  output_path: string;
  sections: Record<string, string[]>;
  source_items: SourcePacketItem[];
  high_risk_claim_watchlist: string[];
  quote_candidates_failed_verification: {
    source_field: string;
    value: string;
    notes: string;
  }[];
  counts: SourcePacketCounts;
};

export type SourcePacketCounts = {
  total_source_items: number;
  verified_quote_items: number;
  structured_field_items: number;
  structured_selection_items: number;
  normalized_candidate_items: number;
  conflict_items: number;
  missing_info_items: number;
  failed_quote_candidates: number;
};

export type SourcePacketWriteResult = {
  absolutePath: string;
  clientSlug: string;
  failedQuoteCandidates: SourcePacket["quote_candidates_failed_verification"];
  outputPath: string;
  packet: SourcePacket;
};

type FieldMap = {
  category: string;
  field: string;
};

const outputPathPrefix = "src/content/projects";

const highRiskClaimWatchlist = [
  "exact prices",
  "dollar amounts",
  "diagnostic fee amounts",
  "review counts",
  "star ratings",
  "best",
  "#1",
  "cheapest",
  "guaranteed",
  "same-day",
  "24/7",
  "free estimate",
  "licensed",
  "insured",
  "certified",
  "warranty",
  "satisfaction guarantee",
  "financing",
  "unsupported service areas",
  "services marked do-not-promote",
];

const categorySectionLabels: Record<string, string> = {
  assets: "Assets",
  business_identity: "Business Identity",
  claims_copy_guardrails: "Claims / Copy Guardrails",
  conflicts: "Conflicts",
  customer_questions: "Customer Questions",
  emergency_availability: "Emergency / Availability",
  future_offers: "Future Offers",
  lead_flow_cta: "Lead Flow / CTA",
  missing_info: "Missing Info / Must Confirm",
  normalized_candidates: "Normalized Candidates",
  pricing_process: "Pricing / Process",
  service_area: "Service Area",
  services_offered: "Services Offered",
  trust_signals: "Trust Signals",
};

const structuredFields: FieldMap[] = [
  { category: "business_identity", field: "id" },
  { category: "business_identity", field: "business_name" },
  { category: "business_identity", field: "business_type" },
  { category: "business_identity", field: "website" },
  { category: "business_identity", field: "contact_name" },
  { category: "business_identity", field: "contact_email" },
  { category: "business_identity", field: "contact_phone" },
  { category: "business_identity", field: "created_at" },
  { category: "business_identity", field: "status" },
  { category: "business_identity", field: "source" },
  { category: "business_identity", field: "payload.variant" },
  { category: "business_identity", field: "payload.businessBasics.businessName" },
  { category: "business_identity", field: "payload.businessBasics.contactName" },
  { category: "business_identity", field: "payload.businessBasics.contactEmail" },
  { category: "business_identity", field: "payload.businessBasics.contactPhone" },
  { category: "business_identity", field: "payload.businessBasics.website" },
  {
    category: "business_identity",
    field: "payload.businessBasics.googleBusinessProfile",
  },
  {
    category: "business_identity",
    field: "payload.businessBasics.businessAddress",
  },
  { category: "business_identity", field: "payload.businessBasics.businessHours" },
  { category: "services_offered", field: "priority_services" },
  { category: "service_area", field: "service_area" },
  { category: "lead_flow_cta", field: "payload.leadFlow.primaryAction" },
  { category: "lead_flow_cta", field: "payload.leadFlow.responseTime" },
  {
    category: "emergency_availability",
    field: "payload.serviceStrategy.emergency_service_availability",
  },
  { category: "trust_signals", field: "payload.trust.yearsInBusiness" },
  { category: "assets", field: "payload.assets.folderLink" },
  {
    category: "future_offers",
    field: "payload.finalNotes.future_offer_visibility",
  },
];

const selectionFields: FieldMap[] = [
  { category: "services_offered", field: "main_services" },
  { category: "services_offered", field: "payload.services.mainServices" },
  { category: "lead_flow_cta", field: "preferred_cta" },
  { category: "lead_flow_cta", field: "payload.leadFlow.currentProcess" },
  { category: "lead_flow_cta", field: "payload.leadFlow.afterFormSubmit" },
  {
    category: "pricing_process",
    field: "payload.pricingProcess.pricing_process_signals",
  },
  { category: "trust_signals", field: "payload.trust.signals" },
  { category: "assets", field: "payload.assets.folderIncludes" },
];

const freeTextFields: FieldMap[] = [
  { category: "services_offered", field: "payload.services.otherMainServices" },
  { category: "services_offered", field: "payload.services.priorityServices" },
  {
    category: "services_offered",
    field: "payload.serviceStrategy.service_priority_notes",
  },
  {
    category: "emergency_availability",
    field: "payload.serviceStrategy.emergency_service_limitations",
  },
  { category: "service_area", field: "payload.serviceArea.townsCities" },
  { category: "service_area", field: "payload.serviceArea.priorityAreas" },
  { category: "service_area", field: "payload.serviceArea.serviceRadius" },
  { category: "service_area", field: "payload.serviceArea.locationLimits" },
  {
    category: "pricing_process",
    field: "payload.pricingProcess.pricing_language_notes",
  },
  { category: "trust_signals", field: "payload.trust.compliments" },
  { category: "trust_signals", field: "payload.trust.competitorDifference" },
  { category: "claims_copy_guardrails", field: "payload.trust.claimsToAvoid" },
  {
    category: "customer_questions",
    field: "payload.customerQuestions.beforeContact",
  },
  {
    category: "customer_questions",
    field: "payload.customerQuestions.pricingTimingProcess",
  },
  {
    category: "customer_questions",
    field: "payload.customerQuestions.competitorComparison",
  },
  { category: "assets", field: "payload.assets.promoOffer" },
  { category: "assets", field: "payload.assets.competitorReferences" },
  { category: "future_offers", field: "payload.finalNotes.future_offers" },
  {
    category: "claims_copy_guardrails",
    field: "payload.finalNotes.homepage_must_include",
  },
  {
    category: "claims_copy_guardrails",
    field: "payload.finalNotes.services_page_must_include",
  },
  {
    category: "claims_copy_guardrails",
    field: "payload.finalNotes.contact_form_must_include",
  },
  {
    category: "claims_copy_guardrails",
    field: "payload.finalNotes.global_avoid_emphasis",
  },
  { category: "claims_copy_guardrails", field: "payload.finalNotes.bad_fit_customers" },
  { category: "future_offers", field: "payload.finalNotes.upcomingChanges" },
  { category: "claims_copy_guardrails", field: "payload.finalNotes.mustInclude" },
  { category: "claims_copy_guardrails", field: "payload.finalNotes.avoidSaying" },
  { category: "claims_copy_guardrails", field: "payload.finalNotes.servicesToAvoid" },
  {
    category: "claims_copy_guardrails",
    field: "payload.finalNotes.customerTypesToAvoid",
  },
];

export async function writeProjectIntakeSourcePacket(
  intake: ProjectIntakeSourceRecord,
): Promise<SourcePacketWriteResult> {
  const packet = buildProjectIntakeSourcePacket(intake);
  const absoluteDir = path.join(process.cwd(), outputPathPrefix, packet.client_slug);
  const absolutePath = path.join(absoluteDir, "source-packet.json");

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, `${JSON.stringify(packet, null, 2)}\n`, "utf8");

  return {
    absolutePath,
    clientSlug: packet.client_slug,
    failedQuoteCandidates: packet.quote_candidates_failed_verification,
    outputPath: packet.output_path,
    packet,
  };
}

export function buildProjectIntakeSourcePacket(
  intake: ProjectIntakeSourceRecord,
): SourcePacket {
  const clientSlug = slugify(readScalar(intake.business_name) || intake.id);
  const outputPath = `${outputPathPrefix}/${clientSlug}/source-packet.json`;
  const sourceItems: SourcePacketItem[] = [];
  const failedQuoteCandidates: SourcePacket["quote_candidates_failed_verification"] =
    [];
  const itemIdsByField = new Map<string, string[]>();
  const itemIdsByFieldAndValue = new Map<string, string[]>();
  const counters = new Map<string, number>();

  function addItem(
    item: Omit<SourcePacketItem, "id">,
    idOverride?: string,
  ): SourcePacketItem {
    const id = idOverride ?? nextItemId(item.category, counters);
    const sourceItem = { id, ...item };
    sourceItems.push(sourceItem);

    const fieldIds = itemIdsByField.get(item.source_field) ?? [];
    fieldIds.push(id);
    itemIdsByField.set(item.source_field, fieldIds);

    const fieldValueKey = fieldValueIndexKey(item.source_field, item.value);
    const fieldValueIds = itemIdsByFieldAndValue.get(fieldValueKey) ?? [];
    fieldValueIds.push(id);
    itemIdsByFieldAndValue.set(fieldValueKey, fieldValueIds);

    return sourceItem;
  }

  for (const fieldMap of structuredFields) {
    const value = readPath(intake, fieldMap.field);

    if (!hasSourceValue(value) || Array.isArray(value)) {
      continue;
    }

    addItem({
      category: fieldMap.category,
      confidence: 1,
      item_type: "structured_field",
      notes: "",
      related_items: [],
      source_field: fieldMap.field,
      source_support: [],
      source_type: "intake",
      value: value as JsonValue,
      verified_verbatim: true,
    });
  }

  for (const fieldMap of selectionFields) {
    const value = readPath(intake, fieldMap.field);

    if (!Array.isArray(value)) {
      continue;
    }

    for (const selection of value) {
      if (!hasSourceValue(selection)) {
        continue;
      }

      addItem({
        category: fieldMap.category,
        confidence: 1,
        item_type: "structured_selection",
        notes: "",
        related_items: [],
        source_field: fieldMap.field,
        source_support: [],
        source_type: "intake",
        value: selection as JsonValue,
        verified_verbatim: true,
      });
    }
  }

  const serviceTreatment = readPath(
    intake,
    "payload.serviceStrategy.service_treatment",
  );

  if (isRecord(serviceTreatment)) {
    for (const [serviceName, treatment] of Object.entries(serviceTreatment).sort(
      ([left], [right]) => left.localeCompare(right),
    )) {
      if (!hasSourceValue(serviceName) || !hasSourceValue(treatment)) {
        continue;
      }

      addItem({
        category: "services_offered",
        confidence: 1,
        item_type: "structured_selection",
        notes: "",
        related_items: [],
        source_field: "payload.serviceStrategy.service_treatment",
        source_support: [],
        source_type: "intake",
        value: {
          service: serviceName,
          treatment: treatment as JsonValue,
        },
        verified_verbatim: true,
      });
    }
  }

  for (const fieldMap of freeTextFields) {
    const rawValue = readString(readPath(intake, fieldMap.field));

    if (!rawValue) {
      continue;
    }

    const candidates = splitQuoteCandidates(rawValue);

    for (const candidate of candidates) {
      const verified = normalizedIncludes(rawValue, candidate);
      const itemType: SourcePacketItemType = verified
        ? "verified_quote"
        : "normalized_candidate";

      if (!verified) {
        failedQuoteCandidates.push({
          notes: "Candidate was not found in the raw source field after normalization.",
          source_field: fieldMap.field,
          value: candidate,
        });
      }

      addItem({
        category: verified ? fieldMap.category : "normalized_candidates",
        confidence: verified ? 1 : 0.7,
        item_type: itemType,
        notes: verified
          ? ""
          : "Normalized from source field; not a direct quote.",
        related_items: itemIdsByField.get(fieldMap.field) ?? [],
        source_field: fieldMap.field,
        source_support: [fieldMap.field],
        source_type: "intake",
        value: candidate,
        verified_verbatim: verified,
      });
    }
  }

  addConflictAndMissingInfoItems({
    addItem,
    intake,
    itemIdsByField,
    itemIdsByFieldAndValue,
  });

  const counts = countSourcePacketItems(sourceItems, failedQuoteCandidates.length);

  return {
    client_slug: clientSlug,
    counts,
    generator: "deterministic-intake-source-packet",
    generator_version: 1,
    high_risk_claim_watchlist: highRiskClaimWatchlist,
    output_path: outputPath,
    quote_candidates_failed_verification: failedQuoteCandidates,
    schema_version: "source-packet.v1",
    sections: buildSections(sourceItems),
    source_intake_id: intake.id,
    source_items: sourceItems,
    source_type: "project_intake",
  };
}

function addConflictAndMissingInfoItems({
  addItem,
  intake,
  itemIdsByField,
  itemIdsByFieldAndValue,
}: {
  addItem: (
    item: Omit<SourcePacketItem, "id">,
    idOverride?: string,
  ) => SourcePacketItem;
  intake: ProjectIntakeSourceRecord;
  itemIdsByField: Map<string, string[]>;
  itemIdsByFieldAndValue: Map<string, string[]>;
}) {
  const trustSignals = readStringArray(readPath(intake, "payload.trust.signals"));
  const pricingSignals = readStringArray(
    readPath(intake, "payload.pricingProcess.pricing_process_signals"),
  );
  const folderIncludes = readStringArray(readPath(intake, "payload.assets.folderIncludes"));
  const responseTime = readString(readPath(intake, "payload.leadFlow.responseTime"));
  const pricingNotes = readString(
    readPath(intake, "payload.pricingProcess.pricing_language_notes"),
  );
  const emergencyAvailability = readString(
    readPath(intake, "payload.serviceStrategy.emergency_service_availability"),
  );
  const emergencyLimitations = readString(
    readPath(intake, "payload.serviceStrategy.emergency_service_limitations"),
  );
  const futureOffers = readString(readPath(intake, "payload.finalNotes.future_offers"));
  const guardrailText = [
    readPath(intake, "payload.trust.claimsToAvoid"),
    readPath(intake, "payload.finalNotes.avoidSaying"),
    readPath(intake, "payload.finalNotes.global_avoid_emphasis"),
    readPath(intake, "payload.finalNotes.servicesToAvoid"),
    readPath(intake, "payload.finalNotes.customerTypesToAvoid"),
  ]
    .map(readString)
    .filter(Boolean)
    .join(" ");

  const sameDaySelected =
    includesSelection(trustSignals, "Same-day availability") ||
    normalizeForComparison(responseTime).includes("same day");
  const normalizedGuardrailText = normalizeForComparison(guardrailText);
  const sameDayGuardrail =
    normalizedGuardrailText.includes("same day") &&
    containsGuardrailIntent(normalizedGuardrailText);

  if (sameDaySelected && sameDayGuardrail) {
    const relatedItems = [
      ...idsForSelection(
        itemIdsByFieldAndValue,
        "payload.trust.signals",
        "Same-day availability",
      ),
      ...idsForField(itemIdsByField, "payload.leadFlow.responseTime"),
      ...idsForField(itemIdsByField, "payload.trust.claimsToAvoid"),
      ...idsForField(itemIdsByField, "payload.finalNotes.avoidSaying"),
      ...idsForField(itemIdsByField, "payload.finalNotes.global_avoid_emphasis"),
    ];

    addItem(
      {
        category: "conflicts",
        confidence: 1,
        item_type: "conflict",
        notes:
          "Do not promise same-day service visits, same-day repairs, or guaranteed same-day availability. Use cautious language until confirmed.",
        related_items: uniqueStrings(relatedItems),
        source_field:
          "payload.trust.signals + payload.leadFlow.responseTime + guardrail fields",
        source_support: uniqueStrings(relatedItems),
        source_type: "derived_rule",
        value:
          "Same-day availability is referenced, but the intake also warns against guaranteeing same-day service.",
        verified_verbatim: false,
      },
      "same_day_availability_conflict",
    );
  }

  const emergencySelected =
    includesSelection(trustSignals, "Emergency service") || Boolean(emergencyAvailability);

  if (emergencySelected && emergencyLimitations) {
    addItem({
      category: "conflicts",
      confidence: 1,
      item_type: "conflict",
      notes:
        "Emergency language needs approval because emergency availability is qualified by distance, schedule, or other limitations.",
      related_items: uniqueStrings([
        ...idsForSelection(itemIdsByFieldAndValue, "payload.trust.signals", "Emergency service"),
        ...idsForField(
          itemIdsByField,
          "payload.serviceStrategy.emergency_service_availability",
        ),
        ...idsForField(
          itemIdsByField,
          "payload.serviceStrategy.emergency_service_limitations",
        ),
      ]),
      source_field:
        "payload.trust.signals + payload.serviceStrategy.emergency_service_limitations",
      source_support: [
        "payload.trust.signals",
        "payload.serviceStrategy.emergency_service_limitations",
      ],
      source_type: "derived_rule",
      value:
        "Emergency service is selected, but emergency limitations were provided.",
      verified_verbatim: false,
    });

    addMissingInfo(
      addItem,
      "approved emergency/same-day wording",
      "Confirm exact emergency and same-day language before final copy.",
      [
        ...idsForField(
          itemIdsByField,
          "payload.serviceStrategy.emergency_service_availability",
        ),
        ...idsForField(
          itemIdsByField,
          "payload.serviceStrategy.emergency_service_limitations",
        ),
      ],
    );
  }

  const exactPricingProhibited =
    includesSelection(pricingSignals, "Do not quote exact prices before diagnosis") ||
    includesSelection(pricingSignals, "Do not mention pricing online") ||
    (normalizedGuardrailText.includes("exact price") &&
      containsGuardrailIntent(normalizedGuardrailText)) ||
    normalizedGuardrailText.includes("do not mention pricing") ||
    normalizedGuardrailText.includes("do not quote") ||
    normalizedGuardrailText.includes("dont quote") ||
    normalizedGuardrailText.includes("avoid pricing");
  const pricingReferenced =
    pricingSignals.length > 0 ||
    normalizeForComparison(pricingNotes).includes("price") ||
    normalizeForComparison(pricingNotes).includes("fee");

  if (pricingReferenced && exactPricingProhibited) {
    addItem({
      category: "conflicts",
      confidence: 1,
      item_type: "conflict",
      notes:
        "Pricing may be referenced only with approved language. Do not invent exact prices or dollar amounts.",
      related_items: uniqueStrings([
        ...idsForField(
          itemIdsByField,
          "payload.pricingProcess.pricing_process_signals",
        ),
        ...idsForField(itemIdsByField, "payload.pricingProcess.pricing_language_notes"),
        ...idsForField(itemIdsByField, "payload.trust.claimsToAvoid"),
        ...idsForField(itemIdsByField, "payload.finalNotes.global_avoid_emphasis"),
      ]),
      source_field: "payload.pricingProcess + guardrail fields",
      source_support: [
        "payload.pricingProcess.pricing_process_signals",
        "payload.pricingProcess.pricing_language_notes",
        "guardrail fields",
      ],
      source_type: "derived_rule",
      value:
        "Pricing is referenced, but exact pricing is restricted or prohibited.",
      verified_verbatim: false,
    });
  }

  if (pricingReferenced) {
    addMissingInfo(
      addItem,
      "approved pricing language",
      "Confirm approved pricing, estimate, and diagnostic-fee language before final copy.",
      [
        ...idsForField(
          itemIdsByField,
          "payload.pricingProcess.pricing_process_signals",
        ),
        ...idsForField(itemIdsByField, "payload.pricingProcess.pricing_language_notes"),
      ],
    );
  }

  if (
    includesSelection(pricingSignals, "Diagnostic fee applies") &&
    !containsDollarAmount(pricingNotes)
  ) {
    addMissingInfo(
      addItem,
      "exact diagnostic fee amount",
      "Diagnostic fee is referenced, but the exact amount is not verified.",
      idsForSelection(
        itemIdsByFieldAndValue,
        "payload.pricingProcess.pricing_process_signals",
        "Diagnostic fee applies",
      ),
    );
  }

  if (includesAny(trustSignals, ["Warranty or guarantee", "Satisfaction guarantee"])) {
    addMissingInfo(
      addItem,
      "exact warranty/guarantee language",
      "A warranty or guarantee is referenced, but exact terms were not provided.",
      uniqueStrings([
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Warranty or guarantee",
        ),
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Satisfaction guarantee",
        ),
      ]),
    );
  }

  const financingReferenced =
    includesSelection(pricingSignals, "Financing available") ||
    includesSelection(trustSignals, "Financing available") ||
    normalizeForComparison(futureOffers).includes("financing");

  if (financingReferenced) {
    addMissingInfo(
      addItem,
      "financing provider/terms",
      "Financing is referenced, but provider, eligibility, and term language are not verified.",
      uniqueStrings([
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.pricingProcess.pricing_process_signals",
          "Financing available",
        ),
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Financing available",
        ),
        ...idsForField(itemIdsByField, "payload.finalNotes.future_offers"),
      ]),
    );
  }

  if (
    includesAny(trustSignals, [
      "Certified technicians / providers",
      "Specialized training or credentials",
    ])
  ) {
    addMissingInfo(
      addItem,
      "exact certification wording",
      "Certification or credential language is selected, but exact approved wording is not verified.",
      uniqueStrings([
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Certified technicians / providers",
        ),
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Specialized training or credentials",
        ),
      ]),
    );
  }

  if (includesSelection(trustSignals, "Licensed / insured")) {
    addMissingInfo(
      addItem,
      "exact license/insurance wording",
      "Licensed/insured is selected, but exact license, insurance, or required disclaimer wording is not verified.",
      idsForSelection(
        itemIdsByFieldAndValue,
        "payload.trust.signals",
        "Licensed / insured",
      ),
    );
  }

  if (
    includesSelection(trustSignals, "Strong Google reviews") ||
    includesSelection(folderIncludes, "Testimonials or review screenshots")
  ) {
    addMissingInfo(
      addItem,
      "review count/rating/excerpts",
      "Reviews are referenced, but exact count, star rating, and approved excerpts are not verified.",
      uniqueStrings([
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Strong Google reviews",
        ),
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.assets.folderIncludes",
          "Testimonials or review screenshots",
        ),
      ]),
    );
  }

  if (
    includesSelection(trustSignals, "Maintenance plans or memberships") ||
    normalizeForComparison(futureOffers).includes("maintenance") ||
    normalizeForComparison(futureOffers).includes("membership") ||
    normalizeForComparison(futureOffers).includes("plan")
  ) {
    addMissingInfo(
      addItem,
      "maintenance plan details",
      "Maintenance plan or membership is referenced; confirm name, inclusions, exclusions, and visibility.",
      uniqueStrings([
        ...idsForSelection(
          itemIdsByFieldAndValue,
          "payload.trust.signals",
          "Maintenance plans or memberships",
        ),
        ...idsForField(itemIdsByField, "payload.finalNotes.future_offers"),
      ]),
    );
  }
}

function addMissingInfo(
  addItem: (
    item: Omit<SourcePacketItem, "id">,
    idOverride?: string,
  ) => SourcePacketItem,
  value: string,
  notes: string,
  relatedItems: string[],
) {
  addItem({
    category: "missing_info",
    confidence: 1,
    item_type: "missing_info",
    notes,
    related_items: uniqueStrings(relatedItems),
    source_field: "derived_missing_info_rule",
    source_support: uniqueStrings(relatedItems),
    source_type: "derived_rule",
    value,
    verified_verbatim: false,
  });
}

function countSourcePacketItems(
  sourceItems: SourcePacketItem[],
  failedQuoteCandidates: number,
): SourcePacketCounts {
  return {
    conflict_items: sourceItems.filter((item) => item.item_type === "conflict").length,
    failed_quote_candidates: failedQuoteCandidates,
    missing_info_items: sourceItems.filter(
      (item) => item.item_type === "missing_info",
    ).length,
    normalized_candidate_items: sourceItems.filter(
      (item) => item.item_type === "normalized_candidate",
    ).length,
    structured_field_items: sourceItems.filter(
      (item) => item.item_type === "structured_field",
    ).length,
    structured_selection_items: sourceItems.filter(
      (item) => item.item_type === "structured_selection",
    ).length,
    total_source_items: sourceItems.length,
    verified_quote_items: sourceItems.filter(
      (item) => item.item_type === "verified_quote",
    ).length,
  };
}

function buildSections(sourceItems: SourcePacketItem[]) {
  const sections = Object.fromEntries(
    Object.values(categorySectionLabels).map((label) => [label, [] as string[]]),
  );

  for (const item of sourceItems) {
    const sectionLabel = categorySectionLabels[item.category];

    if (!sectionLabel) {
      continue;
    }

    sections[sectionLabel].push(item.id);
  }

  return sections;
}

function nextItemId(category: string, counters: Map<string, number>) {
  const prefix = category
    .split("_")
    .map((part) => part.slice(0, 3))
    .join("_")
    .slice(0, 24);
  const nextValue = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, nextValue);

  return `${prefix}_${String(nextValue).padStart(3, "0")}`;
}

function idsForField(itemIdsByField: Map<string, string[]>, field: string) {
  return itemIdsByField.get(field) ?? [];
}

function idsForSelection(
  itemIdsByFieldAndValue: Map<string, string[]>,
  field: string,
  value: string,
) {
  return itemIdsByFieldAndValue.get(fieldValueIndexKey(field, value)) ?? [];
}

function fieldValueIndexKey(field: string, value: unknown) {
  return `${field}::${stableValueKey(value)}`;
}

function stableValueKey(value: unknown): string {
  if (isRecord(value)) {
    return JSON.stringify(
      Object.fromEntries(
        Object.entries(value).sort(([left], [right]) => left.localeCompare(right)),
      ),
    );
  }

  return normalizeForComparison(String(value ?? ""));
}

function splitQuoteCandidates(rawValue: string) {
  return rawValue
    .split(/\r?\n|(?<=[.!?])\s+/)
    .map((candidate) => candidate.trim())
    .filter(Boolean);
}

function normalizedIncludes(rawValue: string, candidate: string) {
  return normalizeForComparison(rawValue).includes(normalizeForComparison(candidate));
}

function normalizeForComparison(value: string) {
  return value
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function readPath(source: ProjectIntakeSourceRecord, pathName: string): unknown {
  const parts = pathName.split(".");
  let current: unknown = source;

  for (const part of parts) {
    if (!isRecord(current)) {
      return undefined;
    }

    current = current[part];
  }

  return current;
}

function readScalar(value: unknown) {
  return typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
    ? String(value).trim()
    : "";
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function hasSourceValue(value: unknown) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  return true;
}

function isRecord(value: unknown): value is Record<string, JsonValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function includesSelection(values: string[], selection: string) {
  return values.some(
    (value) => normalizeForComparison(value) === normalizeForComparison(selection),
  );
}

function includesAny(values: string[], selections: string[]) {
  return selections.some((selection) => includesSelection(values, selection));
}

function containsDollarAmount(value: string) {
  return /\$\s?\d|\b\d+\s?dollars?\b/i.test(value);
}

function containsGuardrailIntent(value: string) {
  return (
    value.includes("do not") ||
    value.includes("dont") ||
    value.includes("avoid") ||
    value.includes("not guarantee") ||
    value.includes("cannot guarantee") ||
    value.includes("no guarantee")
  );
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "client-intake";
}
