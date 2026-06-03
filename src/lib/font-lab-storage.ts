import type { TypePalette } from "@/content/type-palettes";

const fontLabProfilesStorageKey = "local-service-starter:font-lab-profiles";

export function loadStoredFontLabProfiles() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(fontLabProfilesStorageKey);

    return value ? (JSON.parse(value) as TypePalette[]) : null;
  } catch {
    return null;
  }
}

export function saveStoredFontLabProfiles(profiles: TypePalette[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    fontLabProfilesStorageKey,
    JSON.stringify(profiles),
  );
  window.dispatchEvent(new Event("font-lab-profiles-updated"));
}
