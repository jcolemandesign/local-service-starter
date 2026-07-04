import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type JsonRecord = Record<string, unknown>;

export type StrategyWorkspaceFields = {
  supplementalResearch: string;
  strategyBrief: string;
  contentPlan: string;
  homepageCopy: string;
  servicesCopy: string;
  aboutCopy: string;
  contactCopy: string;
  thankYouCopy: string;
  generalNotes: string;
};

export type StrategyWorkspace = {
  clientSlug: string;
  fields: StrategyWorkspaceFields;
  updatedAt: string | null;
};

export type StrategyWorkspacePacketSummary = {
  conflicts: StrategyWorkspacePacketIssue[];
  exists: boolean;
  missingInfo: StrategyWorkspacePacketIssue[];
  outputPath: string;
  sourceIntakeId: string | null;
  totalSourceItems: number | null;
  verifiedQuoteItems: number | null;
  conflictItems: number | null;
  missingInfoItems: number | null;
};

export type StrategyWorkspacePacketIssue = {
  id: string;
  category: string;
  confidence: number | null;
  itemType: "conflict" | "missing_info";
  notes: string;
  relatedItems: string[];
  sourceField: string;
  value: string;
};

export type ProjectWorkspaceSummary = {
  clientSlug: string;
  hasSourcePacket: boolean;
  hasWorkspace: boolean;
  sourcePacketPath: string;
  strategyWorkspacePath: string;
  updatedAt: string | null;
};

export const strategyWorkspaceFieldDefaults: StrategyWorkspaceFields = {
  aboutCopy: "",
  contactCopy: "",
  contentPlan: "",
  generalNotes: "",
  homepageCopy: "",
  servicesCopy: "",
  strategyBrief: "",
  supplementalResearch: "",
  thankYouCopy: "",
};

const projectsPath = path.join(process.cwd(), "src", "content", "projects");

export function createClientSlug(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || "client-intake";
}

export function sanitizeClientSlug(value: unknown) {
  return typeof value === "string" ? createClientSlug(value) : "";
}

export function getStrategyWorkspaceOutputPath(clientSlug: string) {
  return `src/content/projects/${clientSlug}/strategy-workspace.json`;
}

export function getSourcePacketOutputPath(clientSlug: string) {
  return `src/content/projects/${clientSlug}/source-packet.json`;
}

export async function readStrategyWorkspace(
  clientSlug: string,
): Promise<StrategyWorkspace> {
  try {
    const contents = await readFile(getStrategyWorkspacePath(clientSlug), "utf8");
    const parsed = JSON.parse(contents) as Partial<StrategyWorkspace>;

    return {
      clientSlug,
      fields: normalizeWorkspaceFields(parsed.fields),
      updatedAt: readString(parsed.updatedAt) || null,
    };
  } catch {
    return {
      clientSlug,
      fields: { ...strategyWorkspaceFieldDefaults },
      updatedAt: null,
    };
  }
}

export async function listProjectWorkspaces(): Promise<ProjectWorkspaceSummary[]> {
  let entries;

  try {
    entries = await readdir(projectsPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const projectFolders = entries.filter((entry) => entry.isDirectory());
  const projects = await Promise.all(
    projectFolders.map(async (entry) => {
      const clientSlug = sanitizeClientSlug(entry.name);
      const workspace = await readStrategyWorkspace(clientSlug);
      const packetSummary = await readStrategyWorkspacePacketSummary(clientSlug);

      return {
        clientSlug,
        hasSourcePacket: packetSummary.exists,
        hasWorkspace: Boolean(workspace.updatedAt),
        sourcePacketPath: getSourcePacketOutputPath(clientSlug),
        strategyWorkspacePath: getStrategyWorkspaceOutputPath(clientSlug),
        updatedAt: workspace.updatedAt,
      };
    }),
  );

  return projects.sort((a, b) => {
    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

    return bTime - aTime || a.clientSlug.localeCompare(b.clientSlug);
  });
}

export async function writeStrategyWorkspace(
  clientSlug: string,
  fields: Partial<StrategyWorkspaceFields>,
) {
  const workspace: StrategyWorkspace = {
    clientSlug,
    fields: normalizeWorkspaceFields(fields),
    updatedAt: new Date().toISOString(),
  };

  const workspacePath = getStrategyWorkspacePath(clientSlug);

  await mkdir(path.dirname(workspacePath), { recursive: true });
  await writeFile(workspacePath, `${JSON.stringify(workspace, null, 2)}\n`);

  return workspace;
}

export async function readStrategyWorkspacePacketSummary(
  clientSlug: string,
): Promise<StrategyWorkspacePacketSummary> {
  const outputPath = getSourcePacketOutputPath(clientSlug);

  try {
    const contents = await readFile(getSourcePacketPath(clientSlug), "utf8");
    const parsed = JSON.parse(contents) as JsonRecord;
    const counts = isRecord(parsed.counts) ? parsed.counts : {};
    const sourceItems = Array.isArray(parsed.source_items)
      ? parsed.source_items
      : [];

    return {
      conflictItems: readNumber(counts.conflict_items),
      conflicts: sourceItems
        .map(readPacketIssue)
        .filter(
          (issue): issue is StrategyWorkspacePacketIssue =>
            issue?.itemType === "conflict",
        ),
      exists: true,
      missingInfo: sourceItems
        .map(readPacketIssue)
        .filter(
          (issue): issue is StrategyWorkspacePacketIssue =>
            issue?.itemType === "missing_info",
        ),
      missingInfoItems: readNumber(counts.missing_info_items),
      outputPath,
      sourceIntakeId: readString(parsed.source_intake_id) || null,
      totalSourceItems: readNumber(counts.total_source_items),
      verifiedQuoteItems: readNumber(counts.verified_quote_items),
    };
  } catch {
    return {
      conflictItems: null,
      conflicts: [],
      exists: false,
      missingInfo: [],
      missingInfoItems: null,
      outputPath,
      sourceIntakeId: null,
      totalSourceItems: null,
      verifiedQuoteItems: null,
    };
  }
}

function getStrategyWorkspacePath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "strategy-workspace.json");
}

function getSourcePacketPath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "source-packet.json");
}

function normalizeWorkspaceFields(
  fields: Partial<StrategyWorkspaceFields> | undefined,
) {
  return Object.fromEntries(
    Object.keys(strategyWorkspaceFieldDefaults).map((key) => [
      key,
      readWorkspaceString(fields?.[key as keyof StrategyWorkspaceFields]),
    ]),
  ) as StrategyWorkspaceFields;
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readWorkspaceString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function readPacketIssue(
  value: unknown,
): StrategyWorkspacePacketIssue | null {
  if (!isRecord(value)) {
    return null;
  }

  const itemType = readString(value.item_type);

  if (itemType !== "conflict" && itemType !== "missing_info") {
    return null;
  }

  return {
    category: readString(value.category),
    confidence: readNumber(value.confidence),
    id: readString(value.id),
    itemType,
    notes: readString(value.notes),
    relatedItems: Array.isArray(value.related_items)
      ? value.related_items.map(readString).filter(Boolean)
      : [],
    sourceField: readString(value.source_field),
    value: formatPacketIssueValue(value.value),
  };
}

function formatPacketIssueValue(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}
