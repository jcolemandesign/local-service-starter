import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Saved style guide states.
 *
 * Before this there was exactly one token set - the block promoted into
 * globals.css - and no history, so experimenting meant destroying the state you
 * already liked. Slots let you keep known-good sets and switch between them,
 * which also matters for approvals: an approved page records the tokens it was
 * approved under, and returning to that exact set keeps the approval valid
 * instead of invalidating it (see `setPageExportApproval`).
 *
 * A slot stores the token *draft*, not the compiled CSS, so loading one
 * restores the editable state rather than just the output.
 */

export type StyleGuideSlot = {
  id: string;
  name: string;
  tokens: Record<string, unknown>;
  updatedAt: string;
};

type StyleGuideSlotsFile = {
  slots?: unknown;
};

const slotsPath = path.join(
  process.cwd(),
  "src",
  "content",
  "style-guide-slots.json",
);

export function sanitizeSlotId(value: unknown) {
  return typeof value === "string"
    ? value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40)
    : "";
}

function isValidSlot(value: unknown): value is StyleGuideSlot {
  if (!value || typeof value !== "object") return false;

  const slot = value as Partial<StyleGuideSlot>;

  return (
    typeof slot.id === "string" &&
    slot.id.length > 0 &&
    typeof slot.name === "string" &&
    typeof slot.updatedAt === "string" &&
    Boolean(slot.tokens) &&
    typeof slot.tokens === "object" &&
    !Array.isArray(slot.tokens)
  );
}

export async function readStyleGuideSlots(): Promise<StyleGuideSlot[]> {
  let contents: string;

  try {
    contents = await readFile(slotsPath, "utf8");
  } catch {
    return [];
  }

  let parsed: StyleGuideSlotsFile;

  try {
    parsed = JSON.parse(contents) as StyleGuideSlotsFile;
  } catch {
    console.warn(
      "[style-guide-slots] style-guide-slots.json is not valid JSON; treating every slot as empty.",
    );
    return [];
  }

  if (!Array.isArray(parsed.slots)) return [];

  const valid: StyleGuideSlot[] = [];

  parsed.slots.forEach((slot, index) => {
    if (isValidSlot(slot)) {
      valid.push(slot);
      return;
    }

    console.warn(
      `[style-guide-slots] skipped malformed slot at index ${index} (needs id, name, updatedAt, and a tokens object).`,
    );
  });

  return valid;
}

async function writeStyleGuideSlots(slots: StyleGuideSlot[]) {
  await mkdir(path.dirname(slotsPath), { recursive: true });
  await writeFile(slotsPath, `${JSON.stringify({ slots }, null, 2)}\n`);
}

export async function saveStyleGuideSlot({
  name,
  slotId,
  tokens,
}: {
  name: string;
  slotId: string;
  tokens: unknown;
}) {
  const id = sanitizeSlotId(slotId);

  if (!id) {
    throw new Error("Missing slot id.");
  }

  if (!tokens || typeof tokens !== "object" || Array.isArray(tokens)) {
    throw new Error("Missing style guide tokens.");
  }

  const slots = await readStyleGuideSlots();
  const nextSlot: StyleGuideSlot = {
    id,
    name: name.trim().slice(0, 60) || id,
    tokens: tokens as Record<string, unknown>,
    updatedAt: new Date().toISOString(),
  };

  return persist([
    ...slots.filter((slot) => slot.id !== id),
    nextSlot,
  ]);
}

export async function clearStyleGuideSlot(slotId: string) {
  const id = sanitizeSlotId(slotId);
  const slots = await readStyleGuideSlots();

  return persist(slots.filter((slot) => slot.id !== id));
}

async function persist(slots: StyleGuideSlot[]) {
  const sorted = [...slots].sort((left, right) =>
    left.id.localeCompare(right.id),
  );

  await writeStyleGuideSlots(sorted);

  return sorted;
}
