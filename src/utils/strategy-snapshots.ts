import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildStrategyNavigation,
  deriveStrategyPagesFromFields,
  type StrategyNavigationItem,
  type StrategyPageSummary,
} from "@/utils/strategy-site-map";
import type {
  StrategyWorkspace,
  StrategyWorkspaceFields,
} from "@/utils/strategy-workspace";

export type StrategySnapshot = {
  clientSlug: string;
  createdAt: string;
  fields: StrategyWorkspaceFields;
  id: string;
  navigation: StrategyNavigationItem[];
  pages: StrategyPageSummary[];
  version: number;
};

type StrategySnapshotsFile = {
  snapshots?: StrategySnapshot[];
};

export type StrategySnapshotSummary = {
  clientSlug: string;
  createdAt: string;
  id: string;
  navigationCount: number;
  pageCount: number;
  version: number;
};

const projectsPath = path.join(process.cwd(), "src", "content", "projects");

export async function writeStrategySnapshot(workspace: StrategyWorkspace) {
  const snapshots = await readProjectStrategySnapshots(workspace.clientSlug);
  const version =
    snapshots.reduce(
      (largestVersion, snapshot) => Math.max(largestVersion, snapshot.version),
      0,
    ) + 1;
  const pages = deriveStrategyPagesFromFields(workspace.fields);
  const snapshot: StrategySnapshot = {
    clientSlug: workspace.clientSlug,
    createdAt: workspace.updatedAt ?? new Date().toISOString(),
    fields: workspace.fields,
    id: `${workspace.clientSlug}-v${version}`,
    navigation: buildStrategyNavigation(pages),
    pages,
    version,
  };
  const nextSnapshots = [snapshot, ...snapshots];
  const snapshotsPath = getStrategySnapshotsPath(workspace.clientSlug);

  await mkdir(path.dirname(snapshotsPath), { recursive: true });
  await writeFile(
    snapshotsPath,
    `${JSON.stringify({ snapshots: nextSnapshots }, null, 2)}\n`,
  );
  await writeFile(
    getLatestStrategySnapshotPath(workspace.clientSlug),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );

  return snapshot;
}

export async function readProjectStrategySnapshots(clientSlug: string) {
  try {
    const contents = await readFile(getStrategySnapshotsPath(clientSlug), "utf8");
    const parsed = JSON.parse(contents) as StrategySnapshotsFile;

    return Array.isArray(parsed.snapshots) ? parsed.snapshots : [];
  } catch {
    return [];
  }
}

export async function readLatestStrategySnapshot(clientSlug?: string) {
  if (clientSlug) {
    return readLatestProjectStrategySnapshot(clientSlug);
  }

  const snapshots = await listLatestStrategySnapshotSummaries();
  const latest = snapshots[0];

  return latest ? readLatestProjectStrategySnapshot(latest.clientSlug) : null;
}

export async function readLatestProjectStrategySnapshot(clientSlug: string) {
  try {
    const contents = await readFile(getLatestStrategySnapshotPath(clientSlug), "utf8");

    return JSON.parse(contents) as StrategySnapshot;
  } catch {
    const snapshots = await readProjectStrategySnapshots(clientSlug);

    return snapshots[0] ?? null;
  }
}

export async function listLatestStrategySnapshotSummaries() {
  let entries;

  try {
    entries = await readdir(projectsPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const summaries = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const snapshot = await readLatestProjectStrategySnapshot(entry.name);

        if (!snapshot) {
          return null;
        }

        return {
          clientSlug: snapshot.clientSlug,
          createdAt: snapshot.createdAt,
          id: snapshot.id,
          navigationCount: snapshot.navigation.length,
          pageCount: snapshot.pages.filter((page) => page.detected).length,
          version: snapshot.version,
        };
      }),
  );

  return summaries
    .filter((summary): summary is StrategySnapshotSummary => Boolean(summary))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

function getStrategySnapshotsPath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "strategy-snapshots.json");
}

function getLatestStrategySnapshotPath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "strategy-snapshot.json");
}
