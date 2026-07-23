import {
  getPathFromSlugForPageType,
  getPageTypeRelationshipLabel,
  isRepeatablePageType,
} from "@/utils/strategy-site-map";

export type TemplateCopyContractSection = {
  component: string;
  instruction?: string;
  mode: string;
  name: string;
  ratio?: string;
  variant?: string;
};

export type TemplateCopyContractTemplate = {
  id: string;
  name: string;
  pageType: string;
  sectionCount?: number;
  sections: TemplateCopyContractSection[];
};

export type TemplateCopyContractStrategySnapshot = {
  clientSlug: string;
  id: string;
  pageCount: number;
  version: number;
};

type BuildTemplateCopyContractInput = {
  pageLabel: string;
  pageSlug: string;
  strategySnapshot?: TemplateCopyContractStrategySnapshot;
  template: TemplateCopyContractTemplate;
};

export type TemplateCopyFieldSpec = {
  example?: string | string[];
  format?: string;
  itemCount?: number;
  name: string;
  purpose: string;
  target: string;
};

export type TemplateCopyContractStatus =
  | "current"
  | "empty"
  | "stale"
  | "unverified";

export type TemplateCopySectionStatus = {
  ordinal: string;
  reasons: string[];
  sectionId: string;
  status: TemplateCopyContractStatus;
};

const fallbackFields: TemplateCopyFieldSpec[] = [
  {
    example: "Local service starter",
    name: "eyebrow",
    purpose: "Short context label if the section design uses one.",
    target: "12-36 characters.",
  },
  {
    example: "Clear service from request to resolved",
    name: "heading",
    purpose: "Primary section headline.",
    target: "35-70 characters.",
  },
  {
    example:
      "Use this field for one focused paragraph that explains the section without overfilling the layout.",
    name: "body",
    purpose: "Supporting explanation for this section.",
    target: "120-220 characters unless the section is explicitly long-form.",
  },
  {
    example: [
      "System Replacement - Compare repair and replacement options with clear recommendations.",
      "Maintenance - Keep heating and cooling systems checked before peak-season demand.",
    ],
    format: "One item per line. Use Title - Description when an item has both.",
    name: "items",
    purpose: "Cards, bullets, steps, or repeated entries required by the section.",
    target: "Match the visible dummy content count when possible.",
  },
];

export function buildTemplateCopyContract({
  pageLabel,
  pageSlug,
  strategySnapshot,
  template,
}: BuildTemplateCopyContractInput) {
  const publicPath = getPathFromSlugForPageType(pageSlug, template.pageType);
  const isRepeatable = isRepeatablePageType(template.pageType);
  const relationshipLabel = getPageTypeRelationshipLabel(template.pageType);
  const contractFingerprint = getTemplateCopyContractFingerprint(template);
  const lines = [
    "# Page Template Copy Spec",
    "",
    "Use this spec with the project-level page-copy agent instructions. Write copy for this exact staged page instance and preserve the section IDs, field names, section order, repeatable item counts, and copy-fit limits.",
    "",
    "Former name: Template Copy Contract.",
    "",
    "## Page Target",
    `Page label: ${pageLabel}`,
    `Route slug: ${pageSlug || "(not set)"}`,
    `Public path: ${publicPath}`,
    `Selected template: ${template.name}`,
    `Template ID: ${template.id}`,
    `Contract fingerprint: ${contractFingerprint}`,
    `Page type: ${template.pageType}`,
    `Page relationship: ${relationshipLabel}`,
  ];

  if (isRepeatable) {
    lines.push(
      "",
      "Repeatable page instruction:",
      "- This contract is for one specific staged child page instance.",
      "- Write copy only for the page label and public path above.",
      "- Do not write a generic overview page unless the public path is the overview route.",
    );

    if (normalizePageType(template.pageType) === "individualservice") {
      lines.push(
        "- Treat this as one specific service page. Do not write copy for all services.",
      );
    }

    if (normalizePageType(template.pageType) === "servicearea") {
      lines.push(
        "- Treat this as one specific location/service-area page. Do not write copy for every location unless this is the /service-area overview.",
      );
    }
  }

  if (strategySnapshot) {
    lines.push(
      `Strategy snapshot: ${strategySnapshot.id}`,
      `Client slug: ${strategySnapshot.clientSlug}`,
      `Snapshot version: ${strategySnapshot.version}`,
      `Detected pages: ${strategySnapshot.pageCount}`,
    );
  }

  lines.push(
    "",
    "## Prompt Inputs To Pair With This",
    "- Strategy Digest",
    "- Page-specific plan from the sitemap/page plan prompt",
    "- Global Claim Guardrails",
    "- Manual editor notes, if any",
    "- This Page Template Copy Spec",
    "",
    "## Output Rules",
    "- Default output is a human-review outline.",
    "- Do not output bulk/batch paste format unless the user explicitly asks for bulk paste, batch paste, import format, or paste-ready fields.",
    "- Do not add new sections.",
    "- Do not skip sections. If a section requires unverified proof, fill unsafe fields with NEEDS REVIEW rather than fabricating.",
    "- Write for the exact Page Target above, not for a broader page type.",
    "- Keep copy sized to the listed field targets and examples.",
    "- Use cautious wording for unsupported claims.",
    "- For gridded card sections with mixed card sizes, mark larger cards in repeatable card fields with [large] or [featured] before the title. Example: [large] System Replacement — Compare repair and replacement options.",
    "- If a field cannot be written from the provided source material, write NEEDS REVIEW with the missing detail.",
    "- Return structured text by section ID, not prose paragraphs about the page.",
    "- If the user asks for outline mode, use bullets and notes for review.",
    "- If the user asks for bulk paste mode, use exact field labels with no bullets before field names.",
    `- In bulk paste mode, begin immediately below \`# Bulk Paste Copy\` with these two comments on separate lines: \`<!-- Page target: ${pageLabel} (${publicPath}) -->\` and \`<!-- Template contract: ${contractFingerprint} -->\`. These notes are intentionally ignored by the importer and must not be treated as content fields.`,
    "- In bulk paste mode, immediately below each section's `### 0N-slug` heading, include `<!-- Section contract: <value> -->` on its own line before any fields, using the exact \"Section contract\" value shown for that section below. This note is intentionally ignored by the importer and must not be treated as a content field.",
    "",
    "## Sections",
  );

  template.sections.forEach((section, index) => {
    const sectionId = `${String(index + 1).padStart(2, "0")}-${slugify(section.name || section.mode || section.component)}`;
    const fields = getTemplateCopyFieldsForSection(section);
    const sectionFingerprint = getTemplateCopySectionFingerprint(section);

    lines.push(
      "",
      `### ${sectionId}`,
      `Section name: ${section.name}`,
      `Semantic role: ${section.mode}`,
      `Component: ${section.component}`,
      `Section contract: ${sectionFingerprint}`,
    );

    if (section.variant) {
      lines.push(`Variant: ${section.variant}`);
    }

    if (section.instruction) {
      lines.push(`Template intent: ${section.instruction}`);
    }

    const sectionRules = getTemplateCopySectionRules(section);

    if (sectionRules.length > 0) {
      lines.push("", "Section-specific rules:");
      sectionRules.forEach((rule) => lines.push(`- ${rule}`));
    }

    lines.push("", "Fields:");

    fields.forEach((field) => {
      lines.push(`- ${field.name}`);
      lines.push(`  Purpose: ${field.purpose}`);
      lines.push(`  Target: ${field.target}`);

      if (field.itemCount) {
        lines.push(`  Item count: ${field.itemCount}`);
      }

      if (field.format) {
        lines.push(`  Format: ${field.format}`);
      }

      if (field.example) {
        const examples = Array.isArray(field.example)
          ? field.example
          : [field.example];

        lines.push("  Example:");

        examples.forEach((example) => {
          lines.push(
            `    - ${example} (${countCharacters(example)} characters)`,
          );
        });
      }
    });
  });

  return lines.join("\n");
}

export function getTemplateCopyContractFingerprint(
  template: TemplateCopyContractTemplate,
) {
  const contractShape = {
    id: template.id,
    pageType: template.pageType,
    sections: template.sections.map((section) => ({
      component: section.component,
      fields: getTemplateCopyFieldsForSection(section).map((field) => ({
        format: field.format ?? "",
        itemCount: field.itemCount ?? 0,
        name: field.name,
        purpose: field.purpose,
        target: field.target,
      })),
      instruction: section.instruction ?? "",
      mode: section.mode,
      name: section.name,
      ratio: section.ratio ?? "",
      variant: section.variant ?? "",
    })),
    version: 2,
  };

  return `tc-v2-${hashContractShape(JSON.stringify(contractShape))}`;
}

/**
 * A schema fingerprint of a single section, mirroring
 * getTemplateCopyContractFingerprint but scoped to one section instead of the
 * whole template. Lets copy be validated per section rather than only at the
 * whole-page level.
 */
export function getTemplateCopySectionFingerprint(
  section: TemplateCopyContractSection,
) {
  const sectionShape = {
    component: section.component,
    fields: getTemplateCopyFieldsForSection(section).map((field) => ({
      format: field.format ?? "",
      itemCount: field.itemCount ?? 0,
      name: field.name,
      purpose: field.purpose,
      target: field.target,
    })),
    instruction: section.instruction ?? "",
    mode: section.mode,
    name: section.name,
    ratio: section.ratio ?? "",
    variant: section.variant ?? "",
    version: 1,
  };

  return `sc-v1-${hashContractShape(JSON.stringify(sectionShape))}`;
}

function getTemplateCopySectionRules(section: TemplateCopyContractSection) {
  if (!section.component.toLowerCase().includes("projectcasestudygallery")) {
    return [];
  }

  return [
    "This is a visual, slide-based mini case study of completed client work. It is not an FAQ, educational explainer, service list, testimonial carousel, or generic marketing section.",
    "Each slide must describe one real project. The project label, headline, summary, equipment/details, and optional testimonial must all refer to that same project.",
    "Write exactly two slides using verified first-party project facts from the supplied strategy, project notes, or approved assets. Do not convert nearby FAQ copy or general service guidance into a slide.",
    "Images are not part of batch page copy. The renderer supplies the section-library FPO images until they are replaced through the content editor or a later implementation request.",
    "A usable slide needs a factual project summary and three verified detail pairs such as Location, Equipment, and Work Completed.",
    "A testimonial is optional. Include it only when an approved quote and attribution are tied to that project; otherwise write NEEDS REVIEW for both testimonial fields.",
    "If the prompt inputs do not contain enough verified project evidence, keep every unavailable copy field as NEEDS REVIEW. Never invent a project, equipment detail, result, location, quote, or attribution. The renderer will hide incomplete slides.",
  ];
}

export function getBatchCopyContractFingerprint(copy: string) {
  return (
    copy.match(/<!--\s*Template contract:\s*([^\s>]+)\s*-->/i)?.[1] ?? ""
  );
}

export function getTemplateCopyContractStatus(
  copy: string,
  template: TemplateCopyContractTemplate | undefined,
): TemplateCopyContractStatus {
  if (!copy.trim()) {
    return "empty";
  }

  const copyFingerprint = getBatchCopyContractFingerprint(copy);

  if (!copyFingerprint || !template) {
    return "unverified";
  }

  return copyFingerprint === getTemplateCopyContractFingerprint(template) ||
    isBatchCopySchemaCompatible(copy, template)
    ? "current"
    : "stale";
}

/**
 * Per-section counterpart to getTemplateCopyContractStatus, with a reason for
 * each section's status. Does not replace or change the existing whole-page
 * status function or its callers - this is additive, for consumers that want
 * section-level truth (e.g. surfacing which specific sections need
 * regenerated copy) instead of one aggregate status for the whole page.
 */
export function getTemplateCopySectionStatuses(
  copy: string,
  template: TemplateCopyContractTemplate,
): TemplateCopySectionStatus[] {
  const sectionsByOrdinal = copy.trim()
    ? getBatchCopyFieldsBySectionOrdinal(copy)
    : new Map<string, { fields: Set<string>; fingerprint: string; slug: string }>();

  return template.sections.map((section, index) => {
    const ordinal = String(index + 1).padStart(2, "0");
    const sectionId = `${ordinal}-${slugify(section.name || section.mode || section.component)}`;

    if (!copy.trim()) {
      return {
        ordinal,
        reasons: ["No copy has been pasted for this page yet."],
        sectionId,
        status: "empty",
      };
    }

    const suppliedSection = sectionsByOrdinal.get(ordinal);

    if (!suppliedSection) {
      return {
        ordinal,
        reasons: [
          "No matching section block was found in the pasted copy for this position.",
        ],
        sectionId,
        status: "unverified",
      };
    }

    if (suppliedSection.fingerprint) {
      const expectedFingerprint = getTemplateCopySectionFingerprint(section);

      if (suppliedSection.fingerprint === expectedFingerprint) {
        return { ordinal, reasons: [], sectionId, status: "current" };
      }

      return {
        ordinal,
        reasons: [
          "Section contract fingerprint does not match the current section definition.",
        ],
        sectionId,
        status: "stale",
      };
    }

    const reasons: string[] = [];
    const expectedSlug = slugify(
      section.name || section.mode || section.component,
    );

    if (suppliedSection.slug && suppliedSection.slug !== expectedSlug) {
      reasons.push(
        `Section heading identity ("${suppliedSection.slug}") does not match the current section ("${expectedSlug}").`,
      );
    }

    const missingFieldNames = getTemplateCopyFieldsForSection(section)
      .filter(
        (field) => !suppliedSection.fields.has(normalizeContractFieldName(field.name)),
      )
      .map((field) => field.name);

    if (missingFieldNames.length > 0) {
      reasons.push(`Missing required field(s): ${missingFieldNames.join(", ")}.`);
    }

    if (reasons.length > 0) {
      return { ordinal, reasons, sectionId, status: "stale" };
    }

    return {
      ordinal,
      reasons: [
        "Verified via legacy field-name match - no section contract fingerprint was found in the pasted copy.",
      ],
      sectionId,
      status: "current",
    };
  });
}

function isBatchCopySchemaCompatible(
  copy: string,
  template: TemplateCopyContractTemplate,
) {
  const sectionsByOrdinal = getBatchCopyFieldsBySectionOrdinal(copy);

  if (sectionsByOrdinal.size !== template.sections.length) {
    return false;
  }

  return template.sections.every((section, index) => {
    const sectionOrdinal = String(index + 1).padStart(2, "0");
    const suppliedSection = sectionsByOrdinal.get(sectionOrdinal);

    if (!suppliedSection) {
      return false;
    }

    // A slug present in the pasted heading must identify the same section the
    // template currently has at this ordinal. Without this check, two different
    // components sharing overlapping field names (eyebrow/headline/body/...) at
    // the same position would both satisfy the field-name check below and the
    // status would incorrectly report "current" for copy written for a
    // component that is no longer there. Copy with no slug in its heading
    // (older pasted format) can't be checked this way and falls through to the
    // field-name-only comparison, unchanged from prior behavior.
    const expectedSlug = slugify(
      section.name || section.mode || section.component,
    );

    if (suppliedSection.slug && suppliedSection.slug !== expectedSlug) {
      return false;
    }

    return getTemplateCopyFieldsForSection(section).every((field) =>
      suppliedSection.fields.has(normalizeContractFieldName(field.name)),
    );
  });
}

function getBatchCopyFieldsBySectionOrdinal(copy: string) {
  const sectionsByOrdinal = new Map<
    string,
    { fields: Set<string>; fingerprint: string; slug: string }
  >();
  const lines = extractContractBulkPasteCopy(copy).split(/\r?\n/);
  let currentSectionOrdinal = "";

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    const sectionMatch = line.match(/^#{2,4}\s+(\d+)(?:[-\s](.*))?$/);

    if (sectionMatch) {
      currentSectionOrdinal = sectionMatch[1].padStart(2, "0");
      const existing = sectionsByOrdinal.get(currentSectionOrdinal);
      sectionsByOrdinal.set(currentSectionOrdinal, {
        fields: existing?.fields ?? new Set<string>(),
        fingerprint: existing?.fingerprint ?? "",
        slug: slugify(sectionMatch[2] ?? ""),
      });
      return;
    }

    if (!currentSectionOrdinal) {
      return;
    }

    const sectionFingerprintMatch = line.match(
      /^<!--\s*Section contract:\s*([^\s>]+)\s*-->$/i,
    );

    if (sectionFingerprintMatch) {
      const current = sectionsByOrdinal.get(currentSectionOrdinal);

      if (current) {
        current.fingerprint = sectionFingerprintMatch[1];
      }

      return;
    }

    const keyedMatch = line.match(
      /^(?:[-*]\s*)?`?([A-Za-z0-9_.-]+)`?\s*:\s*(.*)$/,
    );

    if (!keyedMatch) {
      return;
    }

    sectionsByOrdinal
      .get(currentSectionOrdinal)
      ?.fields.add(normalizeContractFieldName(keyedMatch[1]));
  });

  return sectionsByOrdinal;
}

function extractContractBulkPasteCopy(copy: string) {
  const lines = copy.split(/\r?\n/);
  const bulkStartIndex = lines.findIndex((line) =>
    /^#{1,3}\s+Bulk Paste Copy\s*$/i.test(line.trim()),
  );
  const bulkLines = bulkStartIndex >= 0 ? lines.slice(bulkStartIndex + 1) : lines;
  const reviewStartIndex = bulkLines.findIndex((line) =>
    /^(?:#{1,3}\s+|\d+\.\s+)?(?:Copy Notes|Copy QA)\s*$/i.test(
      line.trim(),
    ),
  );

  return (reviewStartIndex >= 0
    ? bulkLines.slice(0, reviewStartIndex)
    : bulkLines
  ).join("\n");
}

function normalizeContractFieldName(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9.]+/g, "");
}

function hashContractShape(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function getTemplateCopyFieldsForSection(
  section: TemplateCopyContractSection,
) {
  const component = section.component.toLowerCase();
  const mode = section.mode.toLowerCase();
  const sectionName = section.name.toLowerCase();
  const lookupValue = `${component} ${mode} ${sectionName}`;

  if (lookupValue.includes("nav")) {
    return [
      {
        example: "North Star HVAC",
        name: "logoLabel",
        purpose: "Business name or compact logo text.",
        target: "8-28 characters. Use the exact sourced business name.",
      },
      {
        example: [
          "Services -> /services",
          "Service Area -> /service-area",
          "About -> /about",
          "Contact -> /contact",
        ],
        format: "One item per line as Label -> path.",
        itemCount: 4,
        name: "navLinks",
        purpose: "Primary navigation labels and destination intent.",
        target: "4-7 concise labels, 6-18 characters each.",
      },
      {
        example: "704-555-0184",
        name: "phone",
        purpose: "Primary call path if available.",
        target: "Use exact sourced number or NEEDS REVIEW.",
      },
      {
        example: "Request a Quote",
        name: "primaryAction",
        purpose: "Main header CTA.",
        target: "10-22 characters.",
      },
    ];
  }

  if (lookupValue.includes("footer")) {
    return [
      {
        example: "North Star HVAC",
        name: "businessName",
        purpose: "Exact business name shown in the footer identity and contact block.",
        target: "Use the exact sourced business name. Required.",
      },
      {
        example:
          "North Star HVAC helps Lake Norman homeowners plan repairs, replacements, and maintenance with clear next steps.",
        name: "businessSummary",
        purpose: "Short footer positioning or service summary.",
        target: "100-190 characters.",
      },
      {
        example: [
          "Air Conditioning -> /services/ac-repair",
          "Heating Repair -> /services/heating-repair",
          "Emergency HVAC -> /services/emergency-hvac",
          "Huntersville -> /service-area/huntersville",
        ],
        format: "One item per line as Label -> path.",
        itemCount: 6,
        name: "footerLinks",
        purpose: "Useful footer navigation groups or labels.",
        target: "Match site pages and key service paths. Labels should be 8-28 characters.",
      },
      {
        example: "704-555-0184",
        name: "phone",
        purpose: "Phone number shown as the direct call link.",
        target: "Use the exact sourced number. Required, or NEEDS REVIEW.",
      },
      {
        example: "hello@example.com",
        name: "email",
        purpose: "Email address shown as the direct email link.",
        target: "Use the exact sourced email, or NEEDS REVIEW. Never invent one.",
      },
      {
        example: "Serving Huntersville, Cornelius, Davidson, and nearby Lake Norman communities.",
        name: "serviceArea",
        purpose: "Location or service-area line shown in the footer contact block.",
        target: "Use sourced service-area wording only. 55-150 characters.",
      },
      {
        example: "8am to 6pm, Monday to Friday",
        name: "hours",
        purpose: "Hours appended after the service-area line in the footer contact block.",
        target: "Use exact sourced hours. Put the time range before the days.",
      },
      {
        example: "© 2026 North Star HVAC. All rights reserved. Privacy policy.",
        name: "legalLine",
        purpose: "Copyright or small footer note.",
        target: "45-90 characters.",
      },
    ];
  }

  if (component.includes("contentmainideagrid")) {
    return mainIdeaGridFields();
  }

  if (component.includes("decisionsplitdecisionlarge")) {
    return splitDecisionLargeFields();
  }

  if (component.includes("projectcasestudygallery")) {
    return projectCaseStudyGalleryFields();
  }

  if (component.includes("contactsectionmodalbegin")) {
    return contactModalBeginFields();
  }

  if (component.includes("heroservices")) {
    return [
      {
        example: "Heating and cooling services",
        name: "eyebrow",
        purpose: "Immediate category context above the Services page H1.",
        target: "18-44 characters.",
      },
      {
        example: "HVAC Services for Lake Norman Homeowners",
        name: "h1",
        purpose: "Main Services page headline in the left three-column panel.",
        target: "38-70 characters. One H1 only.",
      },
      {
        example:
          "Explore repair, replacement, maintenance, and heat pump support with clear recommendations based on the system and the needs of the home.",
        name: "intro",
        purpose: "Short Services page introduction beside the image.",
        target: "120-220 characters.",
      },
      {
        example: [
          "System Replacement - Compare repair and replacement paths around equipment condition and long-term fit.",
          "HVAC Repair - Diagnose the current problem and review the practical repair path.",
          "Heat Pump Service - Plan heat pump repair, maintenance, or replacement around the system.",
        ],
        format: "One item per line as Title - Description.",
        name: "serviceItems",
        purpose:
          "Priority service links shown as compact cards over the hero image. The card displays the title; retain a useful description in the content data.",
        target:
          "Use 1-7 approved priority services. Do not repeat these services in the following hover panel.",
      },
    ];
  }

  if (component.includes("herocompactservice")) {
    return [
      {
        example: "Heat pump service",
        name: "eyebrow",
        purpose: "Immediate context for which service this page covers.",
        target: "12-40 characters.",
      },
      {
        example: "Heat pump repair, maintenance, and replacement.",
        name: "h1",
        purpose: "Main service page headline in the compact left column.",
        target: "30-70 characters. One H1 only.",
      },
      {
        example:
          "A compact intro for the service this page covers, next to a bounded photo frame and a boxed request path.",
        name: "intro",
        purpose: "Short intro paragraph beside the service photo.",
        target: "110-200 characters.",
      },
      {
        example: "Same-day heat pump repair",
        name: "ctaTitle",
        purpose: "Boxed CTA panel header, framed as a specific service or offer callout (not a generic prompt).",
        target: "16-40 characters.",
      },
      {
        example: "Get a technician out today with clear pricing before any work begins.",
        name: "ctaBody",
        purpose: "One short supporting line under the CTA callout header.",
        target: "60-120 characters.",
      },
      {
        example: "Request service",
        name: "primaryAction",
        purpose: "Main conversion CTA in the boxed CTA panel.",
        target: "10-22 characters.",
      },
      {
        example: "View all services",
        name: "secondaryAction",
        purpose: "Secondary CTA in the boxed CTA panel.",
        target: "10-22 characters.",
      },
    ];
  }

  if (lookupValue.includes("hero")) {
    return [
      {
        example: "Serving Lake Norman homes",
        name: "eyebrow",
        purpose: "Immediate local/service context above the H1.",
        target: "18-44 characters.",
      },
      {
        example: "Clear HVAC Help for Lake Norman Homeowners",
        name: "h1",
        purpose: "Main page headline.",
        target: "42-74 characters. One H1 only.",
      },
      {
        example:
          "Plan HVAC service with a local team that explains the issue, outlines practical options, and helps you choose the next step without pressure.",
        name: "intro",
        purpose: "Above-the-fold value proposition.",
        target: "130-240 characters.",
      },
      {
        example: "Request Service",
        name: "primaryAction",
        purpose: "Main conversion CTA.",
        target: "10-22 characters.",
      },
      {
        example: "View Services",
        name: "secondaryAction",
        purpose: "Secondary path for visitors who need context.",
        target: "10-22 characters.",
      },
      {
        example: [
          "Repair, replacement, and maintenance",
          "Serving Huntersville and nearby towns",
          "Clear options before work begins",
        ],
        format: "One short proof point per line. Use sourced facts only.",
        itemCount: 3,
        name: "proofPoints",
        purpose: "Stats, trust points, or short supporting claims if the layout uses them.",
        target: "2-4 items, 28-70 characters each. Use sourced facts only.",
      },
    ];
  }

  if (component.includes("servicesthreecardsright")) {
    return [
      {
        example: [
          "System Replacement - Compare repair and replacement paths with clear guidance on equipment condition and long-term fit.",
          "HVAC Repair - Diagnose the current problem and explain the practical repair path before work begins.",
          "Heat Pump Service - Plan heat pump repair, maintenance, or replacement around the system's condition and performance.",
          "Maintenance & Tune-Ups - Schedule seasonal care to review operation and identify developing concerns.",
          "Seasonal Service - Prepare heating or cooling equipment before peak demand.",
        ],
        format:
          "One item per line as Title - Description. List priority services in the order they should appear before the full all-services section.",
        name: "priorityServices",
        purpose:
          "The priority services the business wants listed first before the broader all-services section.",
        target:
          "Suggest 3-5 priority services. Do not include every service here, and do not repeat these in the following all-services section.",
      },
    ];
  }

  if (component.includes("serviceneedsprioritygrid")) {
    return [
      {
        example: [
          "Weak or Uneven Performance - Some rooms feel different or airflow feels limited.",
          "Unusual Operation - New sounds, frequent cycling, or other changes need a closer look.",
          "Planning Ahead - You are considering care, repair, or replacement.",
          "No Heating and Cooling - The system is no longer keeping the home comfortable. Explain what changed and direct the homeowner toward the most useful immediate next step.",
        ],
        format:
          "Exactly four lines as Title - Description. Items 1-3 are compact supporting cards. Item 4 is intentionally larger and functions as the section's most important feature/CTA slot, so give it the fullest and most actionable description.",
        itemCount: 4,
        name: "items",
        purpose:
          "Three compact supporting cards plus one larger priority feature that gives the section a clear conversion or decision-making focus.",
        target:
          "Exactly 4 items. Compact descriptions 60-120 characters. The priority feature description should be 160-280 characters and explain why the visitor should use its primary or secondary CTA.",
      },
      {
        example: "Emergency Service",
        name: "priorityEyebrow",
        purpose:
          "Short label that frames why the larger feature deserves priority, such as Emergency Service, Seasonal Offer, Financing, or Recommended Next Step.",
        target: "8-28 characters. Match the feature's actual context.",
      },
      {
        example: "Request service",
        name: "primaryAction",
        purpose:
          "Main conversion action inside the larger priority feature. It should directly advance the important need or offer described there.",
        target: "10-24 characters. Use a specific action, not Learn More.",
      },
      {
        example: "Call with questions",
        name: "secondaryAction",
        purpose:
          "Lower-commitment or alternate path inside the larger priority feature, such as calling, comparing options, or reviewing details.",
        target: "10-24 characters. Keep it distinct from the primary action.",
      },
      {
        example: "View options",
        name: "linkLabel",
        purpose: "Shared text-link label on the three compact cards.",
        target: "8-20 characters.",
      },
    ];
  }

  if (component.includes("serviceshoverpanel")) {
    return [
      {
        example: "More ways we can help",
        name: "eyebrow",
        purpose: "Short category label above the remaining-service browser.",
        target: "12-32 characters.",
      },
      {
        example: "Support for the rest of your system",
        name: "heading",
        purpose: "Headline for services not included in the priority-card section above.",
        target: "32-68 characters.",
      },
      {
        example:
          "Explore the other approved services that support your equipment, comfort, and ongoing maintenance needs.",
        name: "intro",
        purpose: "Brief setup for the hover service browser.",
        target: "90-170 characters.",
      },
      {
        example: [
          "AC Repair - Diagnose cooling problems and explain the repair options before work begins.",
          "Maintenance & Tune-Ups - Review system operation, identify developing concerns, and support dependable seasonal performance.",
        ],
        format: "One item per line as Title - Description.",
        name: "serviceItems",
        purpose:
          "Every remaining approved service after the preceding priority-service section. Do not repeat a priority service or omit an approved remaining service.",
        target:
          "Include the complete remaining service set. Titles 12-38 characters. Descriptions 90-180 characters.",
      },
    ];
  }

  if (component.includes("threecardlinkgrid")) {
    return [
      {
        example: [
          "System Replacement - Compare replacement options when an older system is no longer dependable. -> /services/system-replacement",
          "HVAC Repair - Review common repair needs and what to expect before service begins. -> /services/hvac-repair",
          "Maintenance Plans - Keep seasonal service organized with recurring visits. -> /maintenance-plan",
        ],
        format:
          "Exactly three lines as Title - Description -> /destination-path.",
        name: "serviceItems",
        purpose:
          "Three linked cards. Their order maps left to right across the centered 14-column layout.",
        target:
          "Exactly 3 items. Titles 12-38 characters. Descriptions 80-160 characters. Every item needs a valid internal destination path.",
      },
      {
        example: "Learn more",
        name: "linkLabel",
        purpose: "Shared action label shown at the bottom of every card.",
        target: "8-20 characters.",
      },
    ];
  }

  if (component.includes("fourcardlinkgrid")) {
    return [
      {
        example: [
          "System Replacement - Compare replacement options when an older system is no longer dependable. -> /services/system-replacement",
          "HVAC Repair - Review common repair needs and what to expect before service begins. -> /services/hvac-repair",
          "Maintenance Plans - Keep seasonal service organized with recurring visits. -> /maintenance-plan",
          "Indoor Air Quality - Explore filtration, humidity, ventilation, and airflow options. -> /services/indoor-air-quality",
        ],
        format:
          "Exactly four lines as Title - Description -> /destination-path.",
        name: "serviceItems",
        purpose:
          "Four linked cards. Their order maps left to right across the centered 14-column layout.",
        target:
          "Exactly 4 items. Titles 12-38 characters. Descriptions 80-160 characters. Every item needs a valid internal destination path.",
      },
      {
        example: "Learn more",
        name: "linkLabel",
        purpose: "Shared action label shown at the bottom of every card.",
        target: "8-20 characters.",
      },
    ];
  }

  if (component.includes("servicesbentocards")) {
    return [
      {
        example: "HVAC services",
        name: "eyebrow",
        purpose: "Short category label.",
        target: "12-32 characters.",
      },
      {
        example: "Service options for every season",
        name: "heading",
        purpose: "Services section headline.",
        target: "32-68 characters.",
      },
      {
        example:
          "Choose the path that matches the problem, from urgent repairs to planned system upgrades and seasonal maintenance.",
        name: "intro",
        purpose: "Brief explanation of the larger service set.",
        target: "100-190 characters.",
      },
      {
        example: [
          "System Replacement - Compare repair and replacement paths when an older system is no longer dependable.",
          "HVAC Repair - Diagnose heating and cooling problems and review the practical repair path.",
          "AC Repair - Address cooling failures, weak airflow, and performance concerns.",
          "Heating Repair - Resolve heating issues with clear options before work begins.",
          "Seasonal Tune-Ups - Prepare equipment before peak heating or cooling demand.",
          "Maintenance & Tune-Ups - Schedule seasonal care to review operation and identify developing concerns.",
          "Heat Pump Service - Plan heat pump repair, maintenance, or replacement around the system.",
          "Emergency HVAC Service - Route urgent heating or cooling problems to a direct call path.",
          "Indoor Air Quality - Review practical options for filtration, airflow, humidity, and indoor environment concerns.",
        ],
        format:
          "One item per line as Title - Description. Use 6-9 items. The layout is capped at 9 and follows this fixed rhythm by item order: big small small, small small big, big small small.",
        name: "serviceItems",
        purpose:
          "A fuller service scan where item order controls the larger visual slots.",
        target:
          "6-9 items. Put the most important services in positions 1, 6, and 7 because those render as the larger slots. Titles 12-38 characters. Descriptions 80-170 characters.",
      },
      {
        example: "View All Services",
        name: "sectionAction",
        purpose: "CTA for the service group if the layout uses one.",
        target: "12-24 characters.",
      },
    ];
  }

  if (component.includes("contentsplitfixedimage")) {
    return [
      {
        example: "Guidance before the work",
        name: "eyebrow",
        purpose: "Short context label above the split-content headline.",
        target: "12-36 characters.",
      },
      {
        example: "Recommendations based on the system itself",
        name: "heading",
        purpose: "Primary split-content headline.",
        target: "36-76 characters.",
      },
      {
        example:
          "A useful recommendation begins with the equipment, the current problem, and what makes sense for the home before any work is proposed.\n\nThat order keeps the conversation grounded in the system's actual condition instead of a generic sales script.",
        format:
          "Write 1-2 natural paragraphs. Put a hard return between paragraphs; each return becomes a separate visible paragraph.",
        name: "body",
        purpose: "Main explanation beside the image.",
        target: "Length follows the argument, not a fixed character count.",
      },
      {
        example: [
          "Diagnosis before pricing",
          "Repair explained when it's practical",
          "Replacement discussed when the evidence supports it",
        ],
        format: "One short bullet per line. Omit this field entirely if the page doesn't need a bullet list here.",
        itemCount: 3,
        name: "bullets",
        purpose:
          "Optional scannable bullet list under the body copy. Only include it if it adds something the paragraphs don't already say - leave it out rather than padding it.",
        target: "2-4 bullets, 3-8 words each, if used.",
      },
      {
        example: "Request service",
        name: "primaryAction",
        purpose:
          "Optional primary CTA. Only include this section's primaryAction/secondaryAction if the page needs a conversion path here - many uses of this layout are pure explanation with no CTA.",
        target: "10-22 characters, if used.",
      },
      {
        example: "View services",
        name: "secondaryAction",
        purpose: "Optional secondary CTA, paired with primaryAction.",
        target: "10-22 characters, if used.",
      },
    ];
  }

  if ((lookupValue.includes("service") && mode !== "utility") || mode === "scan") {
    return [
      {
        example: "HVAC services",
        name: "eyebrow",
        purpose: "Short category label.",
        target: "12-32 characters.",
      },
      {
        example: "Service options for every season",
        name: "heading",
        purpose: "Services section headline.",
        target: "32-68 characters.",
      },
      {
        example:
          "Choose the path that matches the problem, from urgent repairs to planned system upgrades and seasonal maintenance.",
        name: "intro",
        purpose: "Brief explanation of the service set.",
        target: "100-190 characters.",
      },
      {
        example: [
          "AC Repair - Diagnose cooling issues, explain the repair, and restore comfort when the system falls behind.",
          "Heating Repair - Resolve furnace and heat pump problems with clear options before work begins.",
          "[large] System Replacement - Compare repair and replacement paths when an older system is no longer dependable.",
        ],
        format:
          "One item per line as Title - Description. Prefix a larger card with [large] or [featured] when the visual layout has one.",
        itemCount: sectionName.includes("service card grid") ? 3 : undefined,
        name: "serviceItems",
        purpose: "Repeated service cards or bullets.",
        target:
          sectionName.includes("service card grid")
            ? "Exactly 3 items. Titles 12-34 characters. Descriptions 90-170 characters."
            : "Match dummy item count. Titles 12-38 characters. Descriptions 90-180 characters.",
      },
      {
        example: "View All Services",
        name: "sectionAction",
        purpose: "CTA for the service group if the layout uses one.",
        target: "12-24 characters.",
      },
    ];
  }

  if (lookupValue.includes("testimonials") || lookupValue.includes("review")) {
    return [
      {
        example: "What local HVAC customers notice",
        name: "heading",
        purpose: "Proof section headline.",
        target: "32-68 characters.",
      },
      {
        example:
          "Use this section only when approved review or testimonial text is available from the source material.",
        name: "intro",
        purpose: "Short setup for customer proof.",
        target: "90-170 characters.",
      },
      {
        example:
          "NEEDS REVIEW: Approved testimonial excerpt and attribution missing.",
        format:
          "One testimonial per line as Quote - Attribution. Use NEEDS REVIEW when source proof is missing.",
        name: "testimonials",
        purpose: "Visible testimonials or review-style entries.",
        target: "Use only testimonials visible in approved sources. Do not invent reviews.",
      },
    ];
  }

  if (mode === "proof" || lookupValue.includes("trust")) {
    return [
      {
        example: "Practical service, clear expectations",
        name: "heading",
        purpose: "Trust or credibility headline if the layout has one.",
        target: "32-70 characters.",
      },
      {
        example: [
          "Options explained before work begins",
          "Repair and replacement guidance",
          "Local service-area familiarity",
        ],
        format: "One sourced proof point per line.",
        itemCount: 3,
        name: "proofItems",
        purpose: "Short trust claims, stats, badges, or credibility points.",
        target: "3-6 short items, 28-72 characters each. Use sourced facts only.",
      },
    ];
  }

  if (component.includes("contentfixedcoverfade")) {
    return [
      {
        example: "Let the final message hold before the request path rises",
        name: "backgroundTitle",
        purpose:
          "The large, immersive closing statement shown before the request form enters.",
        target: "42-92 characters. Required; do not reuse the form-side headline.",
      },
      {
        example:
          "A steady closing promise gives way to a request form when the visitor is ready to act.",
        name: "backgroundBody",
        purpose:
          "Supporting copy for the full-screen closing statement behind the request path.",
        target: "80-170 characters. Required; do not leave blank.",
      },
      {
        example: "Contact",
        name: "foregroundEyebrow",
        purpose: "Optional short label above the form-side request headline.",
        target: "8-24 characters, or [omit] when the label is not needed.",
      },
      {
        example: "Plan the right next step for your system",
        name: "foregroundTitle",
        purpose: "Request-side headline beside the form.",
        target: "36-72 characters. Keep distinct from backgroundTitle.",
      },
      {
        example:
          "Tell us what is happening, and the team will follow up to discuss the request and the most appropriate service path.",
        name: "foregroundBody",
        purpose: "Supporting copy beside the form that explains the next step.",
        target: "90-180 characters.",
      },
      {
        example: [
          "704-555-0184",
          "hello@example.com",
          "Mon-Fri, 8am-6pm",
        ],
        format: "One sourced contact detail per line.",
        itemCount: 3,
        name: "contactDetails",
        purpose: "Short contact or availability details listed below the request copy.",
        target: "2-4 concise sourced entries. Use NEEDS REVIEW for missing facts.",
      },
    ];
  }

  if (component.includes("contentnarrativefeaturerail")) {
    return [
      {
        example: "More ways we can help",
        name: "eyebrow",
        purpose: "Short context label above the narrative headline.",
        target: "16-40 characters.",
      },
      {
        example: "Support that continues beyond the immediate service call.",
        name: "heading",
        purpose: "Narrative section headline.",
        target: "40-80 characters.",
      },
      {
        example:
          "Some of the most useful service options are not repairs or replacements at all. They make it easier to plan, budget, and stay ahead of the next season.\n\nA longer narrative gives these supporting offers enough context to feel useful instead of promotional. Homeowners can understand where each option fits and when it may be worth asking about.\n\nThe visual rail keeps that explanation connected to the people and work behind the service.",
        format:
          "Write the first paragraph as a short intro lead, then 1-2 additional longform paragraphs. Put a hard return between paragraphs; each return becomes a separate visible paragraph.",
        name: "body",
        purpose:
          "Intro lead plus the longform narrative that runs beside the feature rail.",
        target: "Length follows the argument, not a fixed character count.",
      },
      {
        example: [
          "Seasonal offer - Feature a current promotion without interrupting the page's primary service decision.",
          "Payment options - Ask about financing for qualified projects, with terms and approval details appropriately qualified.",
          "Ongoing care - Introduce a maintenance plan or recurring visits in a compact callout.",
        ],
        format: "One item per line as Title - Description.",
        itemCount: 3,
        name: "supportingItems",
        purpose:
          "The feature rail's callout cards. Each one should be a seasonal offer, payment or financing option, maintenance plan, or promotional discount - not a generic feature or benefit.",
        target: "1-3 items. Titles 12-36 characters. Descriptions 80-150 characters.",
      },
    ];
  }

  if (component.includes("contentcardtwoup")) {
    return [1, 2, 3, 4].flatMap((slot) => [
      {
        example:
          slot === 1
            ? "Repair or replace, decided with the full picture."
            : slot === 2
              ? "What a same-week visit actually includes."
              : slot === 3
                ? "Maintenance that earns its place on the calendar."
                : "Financing that fits the actual project.",
        name: `item${slot}Title`,
        purpose: `Header for card ${slot} of this editorial two-up grid. Leave item3Title and item4Title blank for a 2-card (one row) section; fill all four for a 4-card (two row) section. Exactly 2 or 4 cards total, never 1 or 3.`,
        target: "30-70 characters. One clear editorial statement, not a generic label.",
      },
      {
        example:
          "A single visible problem rarely tells the whole story. A practical recommendation weighs the system's age, repair history, and efficiency alongside the immediate issue.",
        name: `item${slot}Body`,
        purpose: `First paragraph for card ${slot}.`,
        target: "110-220 characters.",
      },
      {
        example:
          slot % 2 === 1
            ? "That context is what turns a repair estimate into a decision the homeowner can actually stand behind, instead of a guess made under pressure."
            : "Diagnosis explained in plain terms\nOptions ranked by urgency, not upsell\nWritten estimate before work starts",
        format:
          "EITHER one short paragraph (a second paragraph under the first), OR 3-4 short bullet lines, one per line - never mix both in the same card. Bullets are auto-detected from multiple lines, so do not add dashes or bullet characters.",
        name: `item${slot}Supporting`,
        purpose: `Card ${slot}'s second content block: a second short paragraph, or a short bullet list, whichever fits the card's point better. Vary the choice across the 2-4 cards in this section rather than using the same shape for every card.`,
        target: "Paragraph: 90-180 characters. Bullets: 3-4 lines, 4-9 words each.",
      },
    ]);
  }

  if (component.includes("contentstickyideas")) {
    return [
      {
        example: "What matters in the decision",
        name: "eyebrow",
        purpose: "Context label for the longform narrative.",
        target: "12-36 characters.",
      },
      {
        example: "A clearer way to approach an expensive home-service decision",
        name: "heading",
        purpose: "Longform section headline.",
        target: "36-88 characters.",
      },
      {
        example:
          "A good service decision begins with an accurate understanding of the system and the homeowner's priorities.\n\nThat context makes it easier to compare the practical options without pressure or generic promises.",
        format:
          "Write 2-4 natural paragraphs. Put a hard return between paragraphs; each return becomes a visible paragraph. Do not compress this field to a generic body-character limit.",
        name: "body",
        purpose: "Editorial narrative that earns the section's visual space.",
        target: "Length follows the argument and available source material, not a fixed character count.",
      },
      {
        example: "What to look for",
        name: "ideasLabel",
        purpose: "Relevant label for the sticky side list. Do not use a generic label such as Important ideas.",
        target: "12-36 characters.",
      },
      {
        example: [
          "Start with the diagnosis",
          "Compare practical options",
          "Know what happens next",
        ],
        format: "One short bullet per line. Do not use Title - Description format.",
        itemCount: 3,
        name: "ideas",
        purpose: "Short, scannable sticky-list bullets that summarize the narrative.",
        target: "3-4 bullets, 2-8 words each.",
      },
    ];
  }

  if (component.includes("contentrevealparagraph")) {
    return [
      {
        example:
          "The right recommendation starts with the facts.\n\nThen it gives the homeowner room to decide.",
        format:
          "Write 1-3 short editorial thoughts. Put a hard return between each visual paragraph; every return is rendered as a separated animated paragraph.",
        name: "body",
        purpose: "Large interstitial thought between sections, not a standard longform block or card section.",
        target: "Use only the length needed for a strong transition. Do not apply normal headline, card, or body-character limits.",
      },
    ];
  }

  if (component.includes("contentaboutstory")) {
    return [
      {
        example: "How we approach the work",
        name: "eyebrow",
        purpose: "Short context label for the story.",
        target: "12-36 characters.",
      },
      {
        example: "A local service philosophy built around clear recommendations",
        name: "heading",
        purpose: "About-story headline.",
        target: "40-90 characters.",
      },
      {
        example:
          "Use the intro to set the story's point of view before the fuller narrative begins.",
        name: "intro",
        purpose: "Opening lead for the story.",
        target: "Natural lead length; keep it focused rather than forcing it into a generic body limit.",
      },
      {
        example:
          "The story can explain what the business pays attention to before work begins and why that matters to customers.\n\nIt can then connect that approach to the service experience without inventing history, credentials, or outcomes.",
        format:
          "Write 2-5 natural paragraphs. Put a hard return between paragraphs. Preserve useful nuance instead of forcing a short card-style description.",
        name: "paragraphs",
        purpose: "Main longform about narrative.",
        target: "Length follows the available source material and the story's needs, not a fixed character count.",
      },
      {
        example: "Clear information should come before an expensive decision.",
        name: "pullquote",
        purpose: "Short pullquote that distills the story's philosophy.",
        target: "45-120 characters.",
      },
      {
        example: [
          "Start with the system - Recommendations begin with the current condition and the actual problem.",
          "Explain the options - Customers should understand the practical paths before deciding.",
        ],
        format: "One item per line as Label - Description.",
        itemCount: 2,
        name: "notes",
        purpose: "Short side notes that make the longform story easier to scan.",
        target: "2-4 notes. Labels 12-36 characters. Descriptions 70-150 characters.",
      },
    ];
  }

  if (component.includes("decisionsplitdecision")) {
    return [
      {
        example: "Repair or replace? Start with the facts",
        name: "heading",
        purpose: "Comparison section headline.",
        target: "36-74 characters.",
      },
      {
        example:
          "The right path depends on the system condition, the current issue, and what makes sense for the home.",
        name: "intro",
        purpose: "Short decision context in the left column.",
        target: "90-180 characters.",
      },
      {
        example: [
          "Repair - Use a practical repair when the diagnosis and system condition support it.",
          "Replacement - Consider the longer-term option when age, reliability, or repeat repairs change the equation.",
        ],
        format: "Exactly 2 items, one per line as Title - Description.",
        itemCount: 2,
        name: "decisionItems",
        purpose: "The two visible comparison cards. Required; do not use steps for this section.",
        target: "Exactly 2 items. Titles 12-32 characters. Descriptions 90-170 characters.",
      },
      {
        example: "Talk through your options",
        name: "sectionAction",
        purpose: "Text link below the left-column explanation.",
        target: "12-28 characters.",
      },
    ];
  }

  if (component.includes("decisionsplitlarge")) {
    return [
      {
        example: "Choose the service path that fits your system",
        name: "heading",
        purpose: "Decision-card section headline.",
        target: "36-74 characters.",
      },
      {
        example: [
          "Repair the current system - Review the diagnosis, proposed repair, and what the system needs now.",
          "Plan a replacement - Compare the longer-term option when condition and reliability make it relevant.",
        ],
        format: "Exactly 2 items, one per line as Title - Description.",
        itemCount: 2,
        name: "decisionItems",
        purpose: "The two visible decision cards. Required; do not use steps for this section.",
        target: "Exactly 2 items. Titles 12-32 characters. Descriptions 90-170 characters.",
      },
      {
        example: "Compare your options",
        name: "sectionAction",
        purpose: "Optional action label when the template shows one.",
        target: "12-28 characters.",
      },
    ];
  }

  if (component.includes("faqaccordionsidebar")) {
    return [
      {
        example: "Still have questions?",
        name: "heading",
        purpose: "Sidebar panel header, next to the FAQ accordion.",
        target: "16-40 characters.",
      },
      {
        example:
          "Most homeowners have a few practical questions before scheduling. Reach out directly if the answer isn't here.",
        name: "intro",
        purpose: "Short supporting line under the sidebar panel header.",
        target: "80-160 characters.",
      },
      {
        example: "Contact the team",
        name: "primaryAction",
        purpose: "The sidebar panel's single CTA.",
        target: "10-22 characters.",
      },
      {
        example: [
          "Do you service my area? - We serve the locations listed in the approved service-area source. Contact the team to confirm availability for a specific address.",
          "Should I repair or replace my system? - The right answer depends on the diagnosis, equipment condition, repair history, and current needs.",
        ],
        format: "One item per line as Question - Answer.",
        itemCount: 4,
        name: "faqs",
        purpose: "Expandable FAQ rows beside the sidebar panel.",
        target: "3-6 FAQs. Questions 35-90 characters. Answers 120-260 characters.",
      },
    ];
  }

  if (component.includes("faqaccordion")) {
    return [
      {
        example: [
          "Do you service my area? - We serve the locations listed in the approved service-area source. Contact the team to confirm availability for a specific address.",
          "Should I repair or replace my system? - The right answer depends on the diagnosis, equipment condition, repair history, and current needs.",
        ],
        format: "One item per line as Question - Answer.",
        itemCount: 5,
        name: "faqs",
        purpose: "Expandable FAQ rows. This section has no header - do not write a heading or intro for it.",
        target: "4-8 FAQs. Questions 35-90 characters. Answers 120-260 characters.",
      },
    ];
  }

  if (mode === "action" || lookupValue.includes("cta")) {
    return [
      {
        example: "Ready to plan your next HVAC service?",
        name: "heading",
        purpose: "Conversion-focused CTA headline.",
        target: "36-72 characters.",
      },
      {
        example:
          "Tell us what is happening with your system and we will help you choose the right next step.",
        name: "body",
        purpose: "Short support copy for the action.",
        target: "90-180 characters.",
      },
      {
        example: "Schedule Service",
        name: "primaryAction",
        purpose: "Primary CTA label.",
        target: "12-24 characters.",
      },
      {
        example: "Call Now",
        name: "secondaryAction",
        purpose: "Optional secondary CTA label.",
        target: "8-22 characters if needed.",
      },
    ];
  }

  if (lookupValue.includes("faq")) {
    return [
      {
        example: "Common HVAC questions answered",
        name: "heading",
        purpose: "FAQ section headline.",
        target: "24-60 characters.",
      },
      {
        example:
          "Get straightforward answers about timing, service fit, common decisions, and what happens next.",
        name: "intro",
        purpose: "Short supporting copy beside the FAQ questions.",
        target: "80-160 characters.",
      },
      {
        example: [
          "Do you service my area? - We serve the locations listed in the approved service-area source. If your town is not listed, contact the team to confirm availability.",
          "Should I repair or replace my system? - The right answer depends on the system age, repair history, comfort problems, and cost of the current issue.",
        ],
        format: "One item per line as Question - Answer.",
        itemCount: 5,
        name: "faqs",
        purpose: "Questions and direct answers.",
        target: "4-8 FAQs. Questions 35-90 characters. Answers 120-260 characters.",
      },
    ];
  }

  if (lookupValue.includes("process") || mode === "decision") {
    return [
      {
        example: "How the service decision gets clearer",
        name: "heading",
        purpose: "Decision/process headline.",
        target: "36-74 characters.",
      },
      {
        example:
          "Use this section to show how visitors move from a symptom or question to a practical next step.",
        name: "intro",
        purpose: "Short explanation of how to decide or what happens next.",
        target: "90-180 characters.",
      },
      {
        example: [
          "Describe the issue - Share what changed, when it started, and whether the system is still running.",
          "Review the options - Compare repair, maintenance, or replacement paths using the facts available.",
          "Choose the next step - Move forward with the option that fits urgency, comfort, and budget.",
        ],
        format: "One item per line as Title - Description.",
        itemCount: 3,
        name: "steps",
        purpose: "Ordered steps, criteria, or comparison points.",
        target: "3-5 items. Titles 16-38 characters. Descriptions 90-180 characters.",
      },
    ];
  }

  if (mode === "utility" || lookupValue.includes("contact")) {
    return [
      {
        example: "Check service availability",
        name: "heading",
        purpose: "Utility section headline.",
        target: "28-64 characters.",
      },
      {
        example:
          "Enter your ZIP code or contact the team to confirm service details for your home.",
        name: "intro",
        purpose: "Short instruction or context for the utility.",
        target: "80-160 characters.",
      },
      {
        example:
          "Huntersville, Cornelius, Davidson, Mooresville, and nearby Lake Norman communities.",
        format:
          "Use sourced facts only. For lookup sections, list the supported entries exactly as provided.",
        name: "details",
        purpose: "Contact, service-area, form, map, or lookup details.",
        target: "Use sourced facts only. 60-180 characters unless the UI expects a list.",
      },
      {
        example: "Not sure if you are covered? Send the address and ask.",
        name: "helperText",
        purpose: "Small clarifying text near the form or utility.",
        target: "45-100 characters if needed.",
      },
    ];
  }

  if (mode === "narrative") {
    return [
      {
        example: "Local service context",
        name: "eyebrow",
        purpose: "Short context label.",
        target: "16-40 characters.",
      },
      {
        example: "Built around real service decisions",
        name: "heading",
        purpose: "Narrative section headline.",
        target: "36-76 characters.",
      },
      {
        example:
          "This section should explain the situation the visitor is trying to solve, then connect the service offer to a practical next step.",
        name: "body",
        purpose: "Main explanatory copy.",
        target: "140-320 characters.",
      },
      {
        example: [
          "Clear scope - Explain what is included before the visitor commits.",
          "Local fit - Tie the copy to the approved towns, climate, or home-service context.",
        ],
        format: "One item per line as Title - Description.",
        itemCount: 3,
        name: "supportingItems",
        purpose: "Cards, bullets, or feature points.",
        target: "2-4 items if the dummy layout uses them. Descriptions 80-160 characters.",
      },
    ];
  }

  return fallbackFields;
}

function mainIdeaGridFields(): TemplateCopyFieldSpec[] {
  return [
    {
      example: "Replacement planning",
      name: "eyebrow",
      purpose: "Short context label above the dominant idea.",
      target: "16-38 characters.",
    },
    {
      example: "Replacement is a decision—not a default",
      name: "heading",
      purpose: "Primary statement in the seven-column lead card.",
      target: "38-78 characters.",
    },
    {
      example:
        "Start with the condition of the equipment, the pattern of recent issues, and the practical value of each available path.",
      name: "body",
      purpose: "Interpretive paragraph supporting the main idea.",
      target: "120-240 characters.",
    },
    ...Array.from({ length: 4 }, (_, index) => [
      {
        example: "Repeated repairs",
        name: `points.${index + 1}.title`,
        purpose: `Supporting point ${index + 1} title.`,
        target: "16-42 characters.",
      },
      {
        example:
          "Look at repair frequency and total recent spend, not one isolated service call.",
        name: `points.${index + 1}.body`,
        purpose: `Supporting point ${index + 1} evidence or explanation.`,
        target: "70-150 characters.",
      },
    ]).flat(),
  ];
}

function splitDecisionLargeFields(): TemplateCopyFieldSpec[] {
  return Array.from({ length: 2 }, (_, cardIndex) => {
    const cardNumber = cardIndex + 1;

    return [
      {
        example: cardIndex === 0 ? "Repair path" : "Replacement path",
        name: `cards.${cardNumber}.eyebrow`,
        purpose: `Decision card ${cardNumber} context label.`,
        target: "12-32 characters.",
      },
      {
        example:
          cardIndex === 0
            ? "Keep the current system working well"
            : "Plan the next system with more context",
        name: `cards.${cardNumber}.title`,
        purpose: `Decision card ${cardNumber} heading.`,
        target: "30-68 characters.",
      },
      ...Array.from({ length: 2 }, (_, paragraphIndex) => ({
        example:
          "Explain when this path fits, what the homeowner should understand, and which tradeoff matters most.",
        name: `cards.${cardNumber}.paragraphs.${paragraphIndex + 1}`,
        purpose: `Decision card ${cardNumber}, paragraph ${paragraphIndex + 1}.`,
        target: "90-180 characters.",
      })),
      ...Array.from({ length: 3 }, (_, pointIndex) => ({
        example: "The recommendation addresses the current issue directly.",
        name: `cards.${cardNumber}.points.${pointIndex + 1}`,
        purpose: `Decision card ${cardNumber}, evidence point ${pointIndex + 1}.`,
        target: "45-110 characters.",
      })),
      {
        example:
          cardIndex === 0
            ? "Talk through a repair"
            : "Explore replacement options",
        name: `cards.${cardNumber}.actionLabel`,
        purpose: `Bottom-aligned link label for decision card ${cardNumber}.`,
        target: "12-30 characters.",
      },
    ];
  }).flat();
}

function projectCaseStudyGalleryFields(): TemplateCopyFieldSpec[] {
  return Array.from({ length: 2 }, (_, slideIndex) => {
    const slideNumber = slideIndex + 1;

    return [
      {
        example: "Replacement project",
        name: `slides.${slideNumber}.project`,
        purpose: `Slide ${slideNumber} project label.`,
        target: "14-38 characters.",
      },
      {
        example: "A clearer path to dependable whole-home comfort",
        name: `slides.${slideNumber}.title`,
        purpose: `Slide ${slideNumber} case-study headline.`,
        target: "36-76 characters.",
      },
      {
        example:
          "Summarize the homeowner situation, approved work, and practical outcome without inventing performance claims.",
        name: `slides.${slideNumber}.summary`,
        purpose: `Slide ${slideNumber} concise case-study summary.`,
        target: "120-230 characters.",
      },
      ...Array.from({ length: 3 }, (_, detailIndex) => [
        {
          example: detailIndex === 0 ? "Equipment" : "Scope",
          name: `slides.${slideNumber}.equipment.${detailIndex + 1}.label`,
          purpose: `Slide ${slideNumber}, project detail ${detailIndex + 1} label.`,
          target: "8-24 characters.",
        },
        {
          example: detailIndex === 0 ? "Variable-speed heat pump" : "System replacement",
          name: `slides.${slideNumber}.equipment.${detailIndex + 1}.value`,
          purpose: `Slide ${slideNumber}, project detail ${detailIndex + 1} verified value.`,
          target: "18-60 characters or NEEDS REVIEW.",
        },
      ]).flat(),
      {
        example: "The options were clear and the crew kept the project organized.",
        name: `slides.${slideNumber}.testimonial.quote`,
        purpose: `Approved customer quote for slide ${slideNumber}.`,
        target: "80-190 characters or NEEDS REVIEW. Do not fabricate testimonials.",
      },
      {
        example: "Homeowner · Residential replacement",
        name: `slides.${slideNumber}.testimonial.attribution`,
        purpose: `Approved testimonial attribution for slide ${slideNumber}.`,
        target: "25-70 characters or NEEDS REVIEW.",
      },
    ];
  }).flat();
}

function contactModalBeginFields(): TemplateCopyFieldSpec[] {
  return [
    {
      example: "Request service",
      name: "eyebrow",
      purpose: "Short conversion context above the section heading.",
      target: "14-32 characters.",
    },
    {
      example: "Start with the kind of help you need",
      name: "heading",
      purpose: "Primary heading beside the request-selection card.",
      target: "34-70 characters.",
    },
    {
      example:
        "Choose the system and service path that best match the situation. These answers carry into the request flow.",
      name: "body",
      purpose: "Short explanation of what the two selections do.",
      target: "100-190 characters.",
    },
    {
      example: "What system needs help?",
      name: "systemPrompt",
      purpose: "Legend above the system-type choices.",
      target: "18-42 characters.",
    },
    {
      example: "What do you need?",
      name: "requestPrompt",
      purpose: "Legend above the request-type choices.",
      target: "16-38 characters.",
    },
    {
      example: "Continue",
      name: "continueLabel",
      purpose: "Button label that opens the request modal.",
      target: "8-20 characters.",
    },
    {
      example: "Your selections will carry into the next step.",
      name: "helperText",
      purpose: "Small reassurance below the continue button.",
      target: "45-100 characters.",
    },
  ];
}

function countCharacters(value: string) {
  return value.length;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePageType(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
