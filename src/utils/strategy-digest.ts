import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SourcePacket } from "@/utils/source-packet";

type SourcePacketItem = SourcePacket["source_items"][number];

const outputPathPrefix = "src/content/projects";
const digestFileName = "strategy-digest.md";
const digestGeneratorVersion = 2;
const digestGeneratorVersionLine = `- Digest generator version: ${digestGeneratorVersion}`;

const omittedDigestFields = new Set([
  "id",
  "contact_email",
  "contact_name",
  "created_at",
  "payload.businessBasics.contactEmail",
  "payload.businessBasics.contactName",
  "source",
  "status",
]);

const digestSections: {
  categories: string[];
  title: string;
}[] = [
  {
    categories: ["business_identity"],
    title: "Business Basics",
  },
  {
    categories: ["services_offered", "service_area"],
    title: "Services And Service Area",
  },
  {
    categories: ["lead_flow_cta", "pricing_process", "emergency_availability"],
    title: "Conversion, Pricing, And Availability",
  },
  {
    categories: ["trust_signals"],
    title: "Proof And Trust Signals",
  },
  {
    categories: ["claims_copy_guardrails"],
    title: "Copy Guardrails",
  },
  {
    categories: ["customer_questions"],
    title: "Customer Questions",
  },
  {
    categories: ["assets", "future_offers"],
    title: "Assets And Future Offers",
  },
];

export function getStrategyDigestOutputPath(clientSlug: string) {
  return `${outputPathPrefix}/${clientSlug}/${digestFileName}`;
}

export async function readStrategyDigestText(clientSlug: string) {
  const digestPath = getStrategyDigestPath(clientSlug);
  const sourcePacketPath = getSourcePacketPath(clientSlug);

  try {
    const [digestStats, sourcePacketStats] = await Promise.all([
      stat(digestPath),
      stat(sourcePacketPath),
    ]);

    const digestText = await readFile(digestPath, "utf8");

    if (
      sourcePacketStats.mtimeMs > digestStats.mtimeMs ||
      !digestText.includes(digestGeneratorVersionLine)
    ) {
      return readOrCreateStrategyDigestText(clientSlug);
    }

    return digestText;
  } catch {
    return readOrCreateStrategyDigestText(clientSlug);
  }
}

export async function writeStrategyDigestFromPacket(packet: SourcePacket) {
  const digest = buildStrategyDigest(packet);
  const absoluteDir = path.join(process.cwd(), outputPathPrefix, packet.client_slug);
  const absolutePath = path.join(absoluteDir, digestFileName);

  await mkdir(absoluteDir, { recursive: true });
  await writeFile(absolutePath, `${digest}\n`, "utf8");

  return {
    absolutePath,
    digest,
    outputPath: getStrategyDigestOutputPath(packet.client_slug),
  };
}

export function buildStrategyDigest(packet: SourcePacket) {
  const lines: string[] = [
    `# Strategy Digest: ${packet.client_slug}`,
    "",
    "Compiled from source-packet.json. Use this digest as the normal prompt context; use the full source packet only for audit/debug.",
    "",
    "## Prompt Use Rules",
    "- Treat explicit source facts as usable context, but avoid unsupported claims.",
    "- Items marked Must Confirm or Conflict need verification before final copy.",
    "- Preserve source item IDs in strategy notes when a claim may need an evidence trail.",
    "",
    "## Digest Metadata",
    digestGeneratorVersionLine,
    `- Client slug: ${packet.client_slug}`,
    `- Source intake ID: ${packet.source_intake_id}`,
    `- Source packet: ${packet.output_path}`,
    `- Source items: ${packet.counts.total_source_items}`,
    `- Verified quotes: ${packet.counts.verified_quote_items}`,
    `- Missing info: ${packet.counts.missing_info_items}`,
    `- Conflicts: ${packet.counts.conflict_items}`,
  ];

  for (const section of digestSections) {
    const items = collectSectionItems(packet.source_items, section.categories);

    if (items.length === 0) {
      continue;
    }

    lines.push("", `## ${section.title}`);
    lines.push(...items.map(formatDigestItem));
  }

  const missingInfo = packet.source_items.filter(
    (item) => item.item_type === "missing_info",
  );
  const conflicts = packet.source_items.filter(
    (item) => item.item_type === "conflict",
  );
  const normalizedCandidates = packet.source_items.filter(
    (item) => item.item_type === "normalized_candidate",
  );

  if (missingInfo.length > 0) {
    lines.push("", "## Must Confirm");
    lines.push(...missingInfo.map(formatDigestItem));
  }

  if (conflicts.length > 0) {
    lines.push("", "## Conflicts");
    lines.push(...conflicts.map(formatDigestItem));
  }

  if (normalizedCandidates.length > 0) {
    lines.push("", "## Lower-Confidence Normalized Notes");
    lines.push(
      ...normalizedCandidates.slice(0, 12).map(formatDigestItem),
    );

    if (normalizedCandidates.length > 12) {
      lines.push(
        `- ${normalizedCandidates.length - 12} additional normalized notes omitted from digest; check source packet if needed.`,
      );
    }
  }

  if (packet.quote_candidates_failed_verification.length > 0) {
    lines.push("", "## Failed Quote Candidates");
    lines.push(
      ...packet.quote_candidates_failed_verification
        .slice(0, 8)
        .map(
          (item) =>
            `- ${compactText(item.value, 180)} [field: ${item.source_field}] - ${compactText(item.notes, 180)}`,
        ),
    );
  }

  return lines.join("\n").trim();
}

async function readOrCreateStrategyDigestText(clientSlug: string) {
  try {
    const packetText = await readFile(getSourcePacketPath(clientSlug), "utf8");
    const packet = JSON.parse(packetText) as SourcePacket;

    if (packet?.schema_version !== "source-packet.v1") {
      return "";
    }

    const result = await writeStrategyDigestFromPacket(packet);

    return result.digest;
  } catch {
    return "";
  }
}

function collectSectionItems(
  sourceItems: SourcePacketItem[],
  categories: string[],
) {
  const includedTypes = new Set([
    "structured_field",
    "structured_selection",
    "verified_quote",
  ]);

  const seenValues = new Set<string>();
  const items: SourcePacketItem[] = [];

  for (const item of sourceItems) {
    if (
      !categories.includes(item.category) ||
      !includedTypes.has(item.item_type) ||
      omittedDigestFields.has(item.source_field)
    ) {
      continue;
    }

    const valueKey = normalizeDigestValue(valueToText(item.value));

    if (!valueKey || seenValues.has(valueKey)) {
      continue;
    }

    seenValues.add(valueKey);
    items.push(item);
  }

  return items;
}

function formatDigestItem(item: SourcePacketItem) {
  const parts = [
    `- ${compactText(valueToText(item.value), 320)}`,
    `[${item.id}; ${item.source_field}]`,
  ];

  if (item.notes) {
    parts.push(`Note: ${compactText(item.notes, 220)}`);
  }

  if (item.related_items.length > 0) {
    parts.push(`Related: ${item.related_items.join(", ")}`);
  }

  return parts.join(" ");
}

function valueToText(value: SourcePacketItem["value"]): string {
  if (Array.isArray(value)) {
    return value.map(valueToText).filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    if ("service" in value && "treatment" in value) {
      return `${valueToText(value.service)}: ${valueToText(value.treatment)}`;
    }

    return JSON.stringify(value);
  }

  return value === null || value === undefined ? "" : String(value);
}

function compactText(value: string, maxLength: number) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}...`;
}

function normalizeDigestValue(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function getStrategyDigestPath(clientSlug: string) {
  return path.join(process.cwd(), outputPathPrefix, clientSlug, digestFileName);
}

function getSourcePacketPath(clientSlug: string) {
  return path.join(process.cwd(), outputPathPrefix, clientSlug, "source-packet.json");
}
