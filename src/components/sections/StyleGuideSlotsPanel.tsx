"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useStyleGuideTokens,
  type StyleGuideTokenDraft,
} from "@/components/sections/StyleGuideLiveSurface";

/**
 * How many slots the UI offers. Deliberately declared here rather than imported
 * from `@/utils/style-guide-slots`: that module reads from disk, and pulling it
 * into a client component would drag `node:fs` into the browser bundle.
 * Storage is an uncapped list, so raising this is a one-line change.
 */
const styleGuideSlotCount = 10;

type Slot = {
  id: string;
  name: string;
  tokens: Record<string, unknown>;
  updatedAt: string;
};

type SlotsResponse =
  | { ok: true; slots: Slot[] }
  | { error: string; ok: false };

const slotIds = Array.from(
  { length: styleGuideSlotCount },
  (_, index) => `slot-${index + 1}`,
);

/**
 * Save and load style guide states.
 *
 * Promoting overwrites the single token block in globals.css, so without this
 * every experiment destroys the set you already liked. A slot stores the token
 * draft, meaning loading one restores the editable state - not just the
 * compiled output - and returning to the exact set a page was approved under
 * keeps that approval valid.
 */
export function StyleGuideSlotsPanel() {
  const { draft, replaceDraft } = useStyleGuideTokens();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [busySlotId, setBusySlotId] = useState("");
  const [status, setStatus] = useState("");
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/style-guide-slots");
        const result = (await response.json()) as SlotsResponse;
        if (result.ok) setSlots(result.slots);
      } catch {
        setStatus("Could not load saved states.");
      }
    })();
  }, []);

  const slotsById = useMemo(
    () => new Map(slots.map((slot) => [slot.id, slot])),
    [slots],
  );

  // Cheap "is this what I am looking at" signal. Token drafts are plain data,
  // so a stable stringify is a fair comparison.
  const draftSignature = useMemo(() => stableStringify(draft), [draft]);

  async function send(body: Record<string, unknown>, slotId: string) {
    setBusySlotId(slotId);
    setStatus("");

    try {
      const response = await fetch("/api/style-guide-slots", {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = (await response.json()) as SlotsResponse;

      if (!response.ok || !result.ok) {
        setStatus(result.ok ? "Request failed." : result.error);
        return;
      }

      setSlots(result.slots);
      setStatus(
        body.action === "clear" ? "Slot cleared." : "Style guide state saved.",
      );
    } catch {
      setStatus("Request failed.");
    } finally {
      setBusySlotId("");
    }
  }

  return (
    // Heading, blurb and panel chrome belong to the GuideSection accordion this
    // sits inside - see `/dev/style-guide`. Rendering its own would put a second
    // title under the one in the summary.
    //
    // The accordion body pads its bottom but not its top, so the first row of
    // slots would otherwise start flush against the summary. Padding it here
    // rather than in GuideSection keeps every other section's spacing as it is.
    <div className="grid gap-4 pt-6">
      {status ? (
        <p
          className="type-caption justify-self-end text-service-muted"
          role="status"
        >
          {status}
        </p>
      ) : null}

      <ul className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
        {slotIds.map((slotId, index) => {
          const slot = slotsById.get(slotId);
          const isBusy = busySlotId === slotId;
          const isCurrent =
            Boolean(slot) && stableStringify(slot?.tokens) === draftSignature;

          return (
            <li
              className={`grid gap-3 rounded-sm border p-4 ${
                slot
                  ? "border-service-border bg-service-surface"
                  : "border-dashed border-service-border bg-white"
              }`}
              key={slotId}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="type-caption font-semibold text-service-ink">
                    {slot ? slot.name : `Slot ${index + 1}`}
                  </p>
                  <p className="type-caption mt-1 text-service-muted">
                    {slot
                      ? `Saved ${new Date(slot.updatedAt).toLocaleString()}`
                      : "Empty"}
                  </p>
                </div>
                {isCurrent ? (
                  <span className="type-caption shrink-0 rounded-sm border border-service-accent px-2 py-1 font-semibold text-service-accent">
                    Current
                  </span>
                ) : null}
              </div>

              <label className="grid gap-1">
                <span className="sr-only">Name for slot {index + 1}</span>
                <input
                  className="min-h-9 w-full rounded-sm border border-service-border bg-white px-2 text-sm text-service-ink outline-none focus:border-service-accent"
                  onChange={(event) =>
                    setNames((current) => ({
                      ...current,
                      [slotId]: event.target.value,
                    }))
                  }
                  placeholder={slot?.name ?? `Slot ${index + 1}`}
                  value={names[slotId] ?? slot?.name ?? ""}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  className="radius-button min-h-9 border border-service-border bg-white px-3 type-caption font-semibold text-service-ink disabled:opacity-60"
                  disabled={isBusy}
                  onClick={() =>
                    void send(
                      {
                        action: "save",
                        name: names[slotId] ?? slot?.name ?? `Slot ${index + 1}`,
                        slotId,
                        tokens: draft,
                      },
                      slotId,
                    )
                  }
                  type="button"
                >
                  {slot ? "Overwrite" : "Save here"}
                </button>
                <button
                  className="radius-button min-h-9 border border-service-accent bg-service-accent px-3 type-caption font-semibold text-white disabled:opacity-60"
                  disabled={isBusy || !slot}
                  onClick={() =>
                    slot &&
                    replaceDraft(slot.tokens as unknown as StyleGuideTokenDraft)
                  }
                  type="button"
                >
                  Load
                </button>
                <button
                  className="radius-button min-h-9 border border-service-border bg-white px-3 type-caption font-semibold text-service-muted disabled:opacity-60"
                  disabled={isBusy || !slot}
                  onClick={() => void send({ action: "clear", slotId }, slotId)}
                  type="button"
                >
                  Clear
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;

  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => `${JSON.stringify(key)}:${stableStringify(entry)}`)
    .join(",")}}`;
}
