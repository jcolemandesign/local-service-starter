import { beforeEach, describe, expect, it, vi } from "vitest";

// Virtual filesystem, so the suite never writes a real slots file.
const files = new Map<string, string>();

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn(async () => undefined),
  readFile: vi.fn(async (target: string) => {
    const contents = files.get(key(String(target)));
    if (contents === undefined) throw new Error("ENOENT");
    return contents;
  }),
  writeFile: vi.fn(async (target: string, contents: string) => {
    files.set(key(String(target)), contents);
  }),
}));

function key(target: string) {
  return target.split(/[\\/]/).pop() ?? target;
}

const {
  clearStyleGuideSlot,
  readStyleGuideSlots,
  sanitizeSlotId,
  saveStyleGuideSlot,
} = await import("@/utils/style-guide-slots");

const tokens = { serviceAccent: "#ff0000", serviceInk: "#111111" };

beforeEach(() => {
  files.clear();
});

describe("style guide slots", () => {
  it("returns nothing before anything has been saved", async () => {
    expect(await readStyleGuideSlots()).toEqual([]);
  });

  it("saves a named state and reads it back", async () => {
    await saveStyleGuideSlot({ name: "North Star", slotId: "slot-1", tokens });

    const slots = await readStyleGuideSlots();

    expect(slots).toHaveLength(1);
    expect(slots[0].name).toBe("North Star");
    expect(slots[0].tokens).toEqual(tokens);
    expect(slots[0].updatedAt).toBeTruthy();
  });

  it("overwrites in place rather than adding a duplicate", async () => {
    await saveStyleGuideSlot({ name: "First", slotId: "slot-1", tokens });
    await saveStyleGuideSlot({
      name: "Second",
      slotId: "slot-1",
      tokens: { serviceAccent: "#00ff00" },
    });

    const slots = await readStyleGuideSlots();

    expect(slots).toHaveLength(1);
    expect(slots[0].name).toBe("Second");
  });

  it("keeps other slots when one is cleared", async () => {
    await saveStyleGuideSlot({ name: "One", slotId: "slot-1", tokens });
    await saveStyleGuideSlot({ name: "Two", slotId: "slot-2", tokens });

    await clearStyleGuideSlot("slot-1");

    expect((await readStyleGuideSlots()).map((slot) => slot.id)).toEqual([
      "slot-2",
    ]);
  });

  it("falls back to the id when no name is given", async () => {
    await saveStyleGuideSlot({ name: "   ", slotId: "slot-3", tokens });

    expect((await readStyleGuideSlots())[0].name).toBe("slot-3");
  });

  it("rejects a save with no tokens", async () => {
    await expect(
      saveStyleGuideSlot({ name: "x", slotId: "slot-1", tokens: null }),
    ).rejects.toThrow(/tokens/i);
  });

  it("rejects a save with no slot id", async () => {
    await expect(
      saveStyleGuideSlot({ name: "x", slotId: "!!!", tokens }),
    ).rejects.toThrow(/slot id/i);
  });

  it("skips malformed slots instead of failing the whole read", async () => {
    files.set(
      "style-guide-slots.json",
      JSON.stringify({
        slots: [
          { id: "slot-1", name: "Good", tokens, updatedAt: "2026-07-25" },
          { id: "slot-2", name: "No tokens", updatedAt: "2026-07-25" },
          "not an object",
        ],
      }),
    );

    expect((await readStyleGuideSlots()).map((slot) => slot.id)).toEqual([
      "slot-1",
    ]);
  });

  it("treats an unreadable file as no saved states", async () => {
    files.set("style-guide-slots.json", "{ not json");

    expect(await readStyleGuideSlots()).toEqual([]);
  });

  it("normalizes slot ids", () => {
    expect(sanitizeSlotId(" Slot 1 ")).toBe("slot-1");
    expect(sanitizeSlotId(42)).toBe("");
  });
});
