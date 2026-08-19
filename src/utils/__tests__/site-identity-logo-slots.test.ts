import { readdir, rm } from "node:fs/promises";
import path from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import {
  emptySiteIdentity,
  resolveFooterLogoSrc,
  resolveIconLogoSrc,
  sanitizeSiteIdentity,
} from "@/content/site-identity";
import { storeClientLogo } from "@/utils/logo-upload";

/**
 * THREE MARKS IN ONE DIRECTORY.
 *
 * `storeClientLogo` deletes the files its upload supersedes, and before the
 * slots existed that sweep matched every `logo-*` file in the client's folder.
 * With a primary, an icon and a footer mark all living there, uploading any one
 * of them would have deleted the other two - silently, because the identity
 * record still points at the paths whose files had just been removed, and
 * because nothing reads those files until a page renders.
 *
 * The failure would look like "the logo stopped appearing", days later, on a
 * page nobody had touched. That is why this is a test and not a comment.
 */

const clientSlug = "vitest-logo-slots";
const clientDir = path.join(process.cwd(), "public", "clients", clientSlug);

/** Distinct bytes per slot, so a surviving file can be told apart from a
 *  replacement by its content hash rather than by its name alone. */
function svg(label: string) {
  return new TextEncoder().encode(`<svg viewBox="0 0 1 1"><!--${label}--></svg>`)
    .buffer as ArrayBuffer;
}

async function upload(slot: "primary" | "icon" | "footer", label: string) {
  const result = await storeClientLogo({
    bytes: svg(label),
    clientSlug,
    slot,
    type: "image/svg+xml",
  });

  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.logoSrc;
}

afterAll(async () => {
  await rm(clientDir, { force: true, recursive: true });
});

describe("the three logo slots", () => {
  it("keeps all three marks in one client directory", async () => {
    const primary = await upload("primary", "wordmark");
    const icon = await upload("icon", "mark");
    const footer = await upload("footer", "footer");

    expect(new Set([primary, icon, footer]).size).toBe(3);

    const entries = await readdir(clientDir);

    expect(entries).toHaveLength(3);
    expect(entries.some((entry) => entry.startsWith("logo-icon-"))).toBe(true);
    expect(entries.some((entry) => entry.startsWith("logo-footer-"))).toBe(true);
  });

  it("replaces only the slot being uploaded", async () => {
    const icon = await upload("icon", "mark");
    const footer = await upload("footer", "footer");
    const firstPrimary = await upload("primary", "wordmark");
    const secondPrimary = await upload("primary", "wordmark-v2");

    expect(secondPrimary).not.toBe(firstPrimary);

    const entries = await readdir(clientDir);

    // The superseded wordmark is gone...
    expect(entries).not.toContain(path.basename(firstPrimary));
    // ...and nothing else went with it. This is the assertion the bug broke:
    // a `startsWith("logo-")` sweep matches `logo-icon-*` and `logo-footer-*`
    // too, because the primary's prefix is a prefix of both.
    expect(entries).toContain(path.basename(secondPrimary));
    expect(entries).toContain(path.basename(icon));
    expect(entries).toContain(path.basename(footer));
  });
});

describe("the identity record", () => {
  it("carries and sanitises every slot", () => {
    const identity = sanitizeSiteIdentity({
      businessName: "  North Star HVAC  ",
      footerLogoSrc: "/clients/acme/logo-footer.svg",
      logoIconSrc: "/clients/acme/logo-icon.svg",
      logoSrc: "/clients/acme/logo.svg",
    });

    expect(identity.businessName).toBe("North Star HVAC");
    expect(identity.logoSrc).toBe("/clients/acme/logo.svg");
    expect(identity.logoIconSrc).toBe("/clients/acme/logo-icon.svg");
    expect(identity.footerLogoSrc).toBe("/clients/acme/logo-footer.svg");
  });

  it("lets no slot escape public", () => {
    const identity = sanitizeSiteIdentity({
      footerLogoSrc: "//evil.example.com/logo.svg",
      logoIconSrc: "/clients/../secret.svg",
      logoSrc: "not-a-path.svg",
    });

    expect(identity.logoSrc).toBe("");
    expect(identity.logoIconSrc).toBe("");
    expect(identity.footerLogoSrc).toBe("");
  });

  it("falls the compact and footer slots back to the primary", () => {
    const onlyPrimary = {
      ...emptySiteIdentity,
      logoSrc: "/clients/acme/logo.svg",
    };

    expect(resolveIconLogoSrc(onlyPrimary)).toBe("/clients/acme/logo.svg");
    expect(resolveFooterLogoSrc(onlyPrimary)).toBe("/clients/acme/logo.svg");

    const allThree = {
      ...onlyPrimary,
      footerLogoSrc: "/clients/acme/footer.svg",
      logoIconSrc: "/clients/acme/icon.svg",
    };

    expect(resolveIconLogoSrc(allThree)).toBe("/clients/acme/icon.svg");
    expect(resolveFooterLogoSrc(allThree)).toBe("/clients/acme/footer.svg");
  });

  it("is empty on every slot by default", () => {
    // A slot missing from the empty value reads as "no mark set" everywhere, so
    // this pins that it grew with the type.
    expect(emptySiteIdentity).toEqual({
      businessName: "",
      footerLogoSrc: "",
      logoIconSrc: "",
      logoSrc: "",
    });
  });
});
