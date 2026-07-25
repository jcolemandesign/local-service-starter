import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  baseStrategyPageSlots,
  withClientPageSlots,
  type StrategyPageDefinition,
} from "@/utils/strategy-site-map";

/**
 * Per-client sitemap configuration.
 *
 * `strategyPageSlots` used to be one hardcoded list built around North Star
 * HVAC, so every client of every trade was offered the same service pages. The
 * shared skeleton now lives in `baseStrategyPageSlots`, and a client's own
 * service pages live beside its other per-client state, in
 * `src/content/projects/<clientSlug>/page-slots.json`.
 *
 * Server-only - this reads from disk. Client components take the resolved slot
 * list as a prop.
 */

type ClientPageSlotsFile = {
  pageSlots?: unknown;
};

const projectsPath = path.join(process.cwd(), "src", "content", "projects");

function getClientPageSlotsPath(clientSlug: string) {
  return path.join(projectsPath, clientSlug, "page-slots.json");
}

/**
 * A malformed slot is skipped with a warning rather than crashing whichever
 * surface asked for the sitemap, matching how staged pages are validated at
 * their read boundary. A slot missing `id`, `label`, `pageType`, or `path`
 * cannot be rendered or matched against, and a slot whose `copyField` is not a
 * real workspace field would silently resolve to empty copy.
 */
function isValidPageSlot(value: unknown): value is StrategyPageDefinition {
  if (!value || typeof value !== "object") return false;

  const slot = value as Partial<StrategyPageDefinition>;

  return (
    typeof slot.id === "string" &&
    slot.id.length > 0 &&
    typeof slot.label === "string" &&
    slot.label.length > 0 &&
    typeof slot.pageType === "string" &&
    slot.pageType.length > 0 &&
    typeof slot.path === "string" &&
    slot.path.length > 0 &&
    typeof slot.copyField === "string" &&
    slot.copyField.length > 0 &&
    Array.isArray(slot.aliases) &&
    slot.aliases.every((alias: unknown) => typeof alias === "string")
  );
}

/**
 * The client's own slots, with no skeleton merged in. Returns `[]` when the
 * client has no config, which is the correct default: a new client gets the
 * trade-neutral skeleton and no invented service pages.
 */
export async function readClientPageSlots(clientSlug: string) {
  if (!clientSlug) {
    return [];
  }

  let contents: string;

  try {
    contents = await readFile(getClientPageSlotsPath(clientSlug), "utf8");
  } catch {
    return [];
  }

  let parsed: ClientPageSlotsFile;

  try {
    parsed = JSON.parse(contents) as ClientPageSlotsFile;
  } catch {
    console.warn(
      `[page-slots] ${clientSlug}/page-slots.json: invalid JSON, falling back to the shared page skeleton.`,
    );
    return [];
  }

  if (!Array.isArray(parsed.pageSlots)) {
    return [];
  }

  const valid: StrategyPageDefinition[] = [];

  parsed.pageSlots.forEach((slot, index) => {
    if (isValidPageSlot(slot)) {
      valid.push(slot);
      return;
    }

    console.warn(
      `[page-slots] ${clientSlug}/page-slots.json: skipped malformed slot at index ${index} (needs id, label, pageType, path, copyField, and aliases[]).`,
    );
  });

  return valid;
}

/**
 * The full sitemap for a client: shared skeleton plus that client's pages.
 * This is what server code should pass to the slot-aware readers in
 * `strategy-site-map`, and what pages hand to client components as a prop.
 */
export async function readStrategyPageSlots(clientSlug: string) {
  if (!clientSlug) {
    return [...baseStrategyPageSlots];
  }

  return withClientPageSlots(await readClientPageSlots(clientSlug));
}
