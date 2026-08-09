import { describe, expect, it } from "vitest";
import { sanitizeSiteIdentity } from "@/content/site-identity";
import {
  hasValidLogoBytes,
  isAllowedLogoType,
  MAX_LOGO_BYTES,
} from "@/utils/logo-upload";

function bytes(...values: number[]) {
  return new Uint8Array(values).buffer;
}

describe("logo upload validation", () => {
  it("accepts only the supported image MIME types", () => {
    expect(isAllowedLogoType("image/svg+xml")).toBe(true);
    expect(isAllowedLogoType("image/png")).toBe(true);
    expect(isAllowedLogoType("text/plain")).toBe(false);
  });

  it("checks that binary uploads match their declared type", () => {
    expect(
      hasValidLogoBytes("image/png", bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
    ).toBe(true);
    expect(hasValidLogoBytes("image/jpeg", bytes(0xff, 0xd8, 0xff))).toBe(true);
    expect(
      hasValidLogoBytes("image/webp", bytes(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50)),
    ).toBe(true);
    expect(hasValidLogoBytes("image/png", bytes(0x3c, 0x73, 0x76, 0x67))).toBe(false);
  });

  it("accepts SVG markup and keeps the upload limit explicit", () => {
    expect(
      hasValidLogoBytes("image/svg+xml", new TextEncoder().encode("<svg viewBox='0 0 1 1'/>").buffer),
    ).toBe(true);
    expect(MAX_LOGO_BYTES).toBe(2 * 1024 * 1024);
  });

  it("does not allow a logo path to escape public", () => {
    expect(sanitizeSiteIdentity({ logoSrc: "/clients/acme/logo.svg" }).logoSrc).toBe(
      "/clients/acme/logo.svg",
    );
    expect(sanitizeSiteIdentity({ logoSrc: "/clients/../secret.svg" }).logoSrc).toBe("");
  });
});
