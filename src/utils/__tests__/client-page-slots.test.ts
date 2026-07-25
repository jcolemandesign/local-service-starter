import { describe, expect, it } from "vitest";

import {
  readClientPageSlots,
  readStrategyPageSlots,
} from "@/utils/client-page-slots";
import {
  baseStrategyPageSlots,
  withClientPageSlots,
  type StrategyPageDefinition,
} from "@/utils/strategy-site-map";

/**
 * `strategyPageSlots` used to be one hardcoded list built around North Star
 * HVAC, so every client of every trade was offered "Heat Pump Service" as a
 * page slot. The skeleton is now trade-neutral and a client's own service pages
 * live in `src/content/projects/<clientSlug>/page-slots.json`.
 */

function serviceSlot(id: string, label: string): StrategyPageDefinition {
  return {
    aliases: [label.toLowerCase()],
    copyField: "servicesCopy",
    id,
    label,
    parentId: "services",
    pageType: "Individual Service",
    path: `/services/${id}`,
  };
}

describe("baseStrategyPageSlots", () => {
  it("carries no trade-specific service pages", () => {
    const ids = baseStrategyPageSlots.map((slot) => slot.id);

    expect(ids).not.toContain("heat-pump-service");
    expect(ids).not.toContain("ac-repair");
    expect(ids).not.toContain("emergency-hvac");
  });

  it("keeps the generic repeatable service slot, so a new client can still stage one", () => {
    const genericSlot = baseStrategyPageSlots.find(
      (slot) => slot.id === "individual-service",
    );

    expect(genericSlot?.repeatable).toBe(true);
    expect(genericSlot?.parentId).toBe("services");
  });
});

describe("withClientPageSlots", () => {
  it("returns the skeleton unchanged for a client with no configured pages", () => {
    expect(withClientPageSlots([]).map((slot) => slot.id)).toEqual(
      baseStrategyPageSlots.map((slot) => slot.id),
    );
  });

  it("inserts service pages directly after the generic slot", () => {
    const ids = withClientPageSlots([
      serviceSlot("drain-cleaning", "Drain Cleaning"),
      serviceSlot("water-heaters", "Water Heaters"),
    ]).map((slot) => slot.id);

    expect(ids.slice(ids.indexOf("individual-service"), ids.indexOf("individual-service") + 3)).toEqual([
      "individual-service",
      "drain-cleaning",
      "water-heaters",
    ]);
  });

  it("lets a client override a base slot in place rather than duplicating it", () => {
    const slots = withClientPageSlots([
      { ...baseStrategyPageSlots[0], label: "Front Page" },
    ]);

    expect(slots.filter((slot) => slot.id === "home")).toHaveLength(1);
    expect(slots.find((slot) => slot.id === "home")?.label).toBe("Front Page");
    expect(slots).toHaveLength(baseStrategyPageSlots.length);
  });

  it("appends non-service pages after the skeleton instead of inside Services", () => {
    const ids = withClientPageSlots([
      {
        aliases: ["careers"],
        copyField: "generalNotes",
        id: "careers",
        label: "Careers",
        pageType: "About",
        path: "/careers",
      },
    ]).map((slot) => slot.id);

    expect(ids.at(-1)).toBe("careers");
  });
});

describe("readStrategyPageSlots", () => {
  /**
   * The regression guard for the extraction: North Star's sitemap must come out
   * of base + config in exactly the order the hardcoded list had, or existing
   * staged pages stop matching their slots and copy resolution silently falls
   * back to contentPlan/strategyBrief.
   */
  it("reproduces North Star's original slot order from base + config", async () => {
    const slots = await readStrategyPageSlots("north-star-hvac");

    expect(slots.map((slot) => slot.id)).toEqual([
      "home",
      "services",
      "individual-service",
      "system-replacement",
      "heat-pump-service",
      "maintenance",
      "ac-repair",
      "heating-repair",
      "emergency-hvac",
      "service-area",
      "service-plan",
      "specials",
      "financing",
      "about",
      "contact",
      "blog",
      "blog-post",
      "products",
      "thank-you",
    ]);
  });

  it("gives an unconfigured client the skeleton only", async () => {
    const slots = await readStrategyPageSlots("client-that-does-not-exist");

    expect(slots.map((slot) => slot.id)).toEqual(
      baseStrategyPageSlots.map((slot) => slot.id),
    );
  });
});

describe("readClientPageSlots", () => {
  it("returns nothing for a client with no config file", async () => {
    expect(await readClientPageSlots("client-that-does-not-exist")).toEqual([]);
  });

  it("reads North Star's service pages", async () => {
    const slots = await readClientPageSlots("north-star-hvac");

    expect(slots).toHaveLength(6);
    expect(slots.every((slot) => slot.parentId === "services")).toBe(true);
  });
});
