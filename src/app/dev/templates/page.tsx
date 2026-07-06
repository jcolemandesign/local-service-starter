import type { Metadata } from "next";
import { SemanticPrestageSection } from "@/components/sections";
import { semanticSectionOptions } from "@/content/semantic-section-options";
import {
  listLatestStrategySnapshotSummaries,
  readLatestProjectStrategySnapshot,
} from "@/utils/strategy-snapshots";

export const metadata: Metadata = {
  title: "Layout Preview",
  description: "Preview staged page layouts from saved strategy copy and semantic labels.",
};

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const strategySnapshotSummaries = await listLatestStrategySnapshotSummaries();
  const strategySnapshots = (
    await Promise.all(
      strategySnapshotSummaries.map((snapshot) =>
        readLatestProjectStrategySnapshot(snapshot.clientSlug),
      ),
    )
  ).filter((snapshot) => snapshot !== null);

  return (
    <main>
      <SemanticPrestageSection
        sectionOptions={semanticSectionOptions}
        snapshots={strategySnapshots}
      />
    </main>
  );
}
