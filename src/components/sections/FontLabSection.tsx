"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Card } from "@/components/primitives";
import { sectionLibraryContent } from "@/content/section-library";
import {
  typePalettes,
  type CapitalizationStyle,
  type TypePalette,
  type TypeRole,
  type WrapMode,
} from "@/content/type-palettes";

type FontOption = {
  label: string;
  value: string;
};

type TypeSettings = {
  customFont: string;
  globalFont: string;
  roleFontOverrides: Record<string, string>;
  roles: TypeRole[];
};

type LocalFontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
};

declare global {
  interface Window {
    queryLocalFonts?: () => Promise<LocalFontData[]>;
  }
}

const projectFontOptions: FontOption[] = [
  {
    label: "Geist Sans",
    value: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
];

const systemFontOptions: FontOption[] = [
  {
    label: "System UI",
    value:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  },
  {
    label: "Aptos",
    value: "Aptos, Segoe UI, Arial, sans-serif",
  },
  {
    label: "Arial",
    value: "Arial, Helvetica, sans-serif",
  },
  {
    label: "Verdana",
    value: "Verdana, Geneva, sans-serif",
  },
  {
    label: "Trebuchet MS",
    value: "Trebuchet MS, Arial, sans-serif",
  },
  {
    label: "Georgia",
    value: "Georgia, Times New Roman, serif",
  },
  {
    label: "Times New Roman",
    value: "Times New Roman, Times, serif",
  },
];

const fontOptions = [...projectFontOptions, ...systemFontOptions];
const systemFallbackFont = systemFontOptions[0].value;

const initialRoles: TypeRole[] = [
  {
    id: "display-xl",
    token: "type-display-xl",
    role: "Largest display",
    sample: "Emergency repairs without the runaround",
    minRem: 3.5,
    maxRem: 7,
    lineHeight: 0.92,
    weight: 680,
    measureCh: 14,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "display-lg",
    token: "type-display-lg",
    role: "Display heading",
    sample: "Fast HVAC service when the house will not wait",
    minRem: 2.75,
    maxRem: 5.5,
    lineHeight: 0.95,
    weight: 670,
    measureCh: 18,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "heading-xl",
    token: "type-heading-xl",
    role: "Large section title",
    sample: "Clear service from request to resolved",
    minRem: 2.25,
    maxRem: 4,
    lineHeight: 1,
    weight: 660,
    measureCh: 22,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "heading-lg",
    token: "type-heading-lg",
    role: "Editorial heading",
    sample: "Repairs explained before work begins",
    minRem: 1.75,
    maxRem: 2.75,
    lineHeight: 1.05,
    weight: 650,
    measureCh: 22,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "heading-md",
    token: "type-heading-md",
    role: "Subsection heading",
    sample: "What happens after you request service",
    minRem: 1.375,
    maxRem: 2,
    lineHeight: 1.15,
    weight: 650,
    measureCh: 28,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "heading-sm",
    token: "type-heading-sm",
    role: "Card heading",
    sample: "Same-day repair support",
    minRem: 1.125,
    maxRem: 1.375,
    lineHeight: 1.25,
    weight: 650,
    measureCh: 28,
    wrap: "balance",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "text-xl",
    token: "type-text-xl",
    role: "Lead copy",
    sample:
      "Lead copy gives important pages a little more voice while keeping the line length readable across screens.",
    minRem: 1.1875,
    maxRem: 1.5,
    lineHeight: 1.5,
    weight: 400,
    measureCh: 52,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "text-lg",
    token: "type-text-lg",
    role: "Intro copy",
    sample:
      "Use this for short section introductions, service summaries, and supporting copy that needs more presence than body text.",
    minRem: 1.0625,
    maxRem: 1.25,
    lineHeight: 1.6,
    weight: 400,
    measureCh: 60,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "text-md",
    token: "type-text-md",
    role: "Body copy",
    sample:
      "Request service online, describe the issue, and get a fast response from a local technician. Every submission is organized so fewer leads slip through the cracks.",
    minRem: 1,
    maxRem: 1.125,
    lineHeight: 1.65,
    weight: 400,
    measureCh: 60,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "text-sm",
    token: "type-text-sm",
    role: "Small body",
    sample:
      "Useful for supporting details, captions inside cards, and compact text that still needs enough room to breathe.",
    minRem: 0.875,
    maxRem: 0.95,
    lineHeight: 1.6,
    weight: 400,
    measureCh: 70,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "text-xs",
    token: "type-text-xs",
    role: "Microcopy",
    sample:
      "Most appointment windows are confirmed by phone or email before the technician arrives.",
    minRem: 0.8125,
    maxRem: 0.875,
    lineHeight: 1.55,
    weight: 400,
    measureCh: 48,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "caption",
    token: "type-caption",
    role: "Caption",
    sample: "Preview image, service area, or review attribution text.",
    minRem: 0.75,
    maxRem: 0.8125,
    lineHeight: 1.5,
    weight: 400,
    measureCh: 48,
    wrap: "pretty",
    letterSpacingEm: 0,
    capitalization: "none",
  },
  {
    id: "label",
    token: "type-label / type-eyebrow",
    role: "Label",
    sample: "Emergency HVAC Repair",
    minRem: 0.8125,
    maxRem: 0.875,
    lineHeight: 1.2,
    weight: 750,
    measureCh: 30,
    wrap: "wrap",
    letterSpacingEm: 0.12,
    capitalization: "uppercase",
  },
];

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatNumber(value: number) {
  return numberFormat.format(value);
}

function clampExpression(minRem: number, maxRem: number) {
  const minContainerRem = 24;
  const maxContainerRem = 96;
  const slope = (maxRem - minRem) / (maxContainerRem - minContainerRem);
  const cqw = slope * 100;
  const intercept = minRem - slope * minContainerRem;

  return `clamp(${formatNumber(minRem)}rem, calc(${formatNumber(
    cqw,
  )}cqw + ${formatNumber(intercept)}rem), ${formatNumber(maxRem)}rem)`;
}

function roleSpec(role: TypeRole) {
  return `${formatNumber(role.minRem)}rem - ${formatNumber(
    role.maxRem,
  )}rem / ${formatNumber(role.lineHeight)} / ${role.weight} / ${
    role.wrap === "wrap" ? "default" : role.wrap
  } / ${formatNumber(role.letterSpacingEm)}em / ${role.capitalization}`;
}

function fontFamilyForValue(value: string, customFont: string) {
  if (value.startsWith("local:")) {
    const family = value.replace("local:", "").trim();
    return family ? `"${family.replaceAll('"', '\\"')}", ${systemFallbackFont}` : fontOptions[0].value;
  }

  if (value !== "custom") {
    return value;
  }

  const trimmedFont = customFont.trim();

  if (!trimmedFont) {
    return fontOptions[0].value;
  }

  return `"${trimmedFont.replaceAll('"', '\\"')}", ${systemFallbackFont}`;
}

function fontLabelForValue(
  value: string,
  customFont: string,
  localFontOptions: FontOption[] = [],
) {
  if (value === "global") {
    return "Use global family";
  }

  if (value.startsWith("local:")) {
    return localFontOptions.find((font) => font.value === value)?.label ?? value.replace("local:", "");
  }

  if (value === "custom") {
    return customFont.trim() ? `Custom: ${customFont.trim()}` : "Custom local family";
  }

  return fontOptions.find((font) => font.value === value)?.label ?? value;
}

function previewStyle(role: TypeRole, fontFamily: string): CSSProperties {
  return {
    fontFamily,
    fontSize: clampExpression(role.minRem, role.maxRem),
    fontWeight: role.weight,
    letterSpacing: `${role.letterSpacingEm}em`,
    lineHeight: role.lineHeight,
    maxWidth: `${role.measureCh}ch`,
    textTransform:
      role.capitalization === "none" ? undefined : role.capitalization,
    textWrap: role.wrap,
  };
}

function textTransformForRole(role: TypeRole) {
  return role.capitalization === "none" ? "none" : role.capitalization;
}

function cloneRoles(roles: TypeRole[]) {
  return roles.map((role) => ({ ...role }));
}

function cloneProfile(profile: TypePalette): TypePalette {
  return {
    ...profile,
    customFont: profile.customFont ?? "",
    roleFontOverrides: { ...profile.roleFontOverrides },
    roles: cloneRoles(profile.roles),
  };
}

function settingsFromProfile(profile: TypePalette): TypeSettings {
  return {
    customFont: profile.customFont ?? "",
    globalFont: profile.globalFont,
    roleFontOverrides: { ...profile.roleFontOverrides },
    roles: cloneRoles(profile.roles),
  };
}

function profileFromSettings(
  profile: TypePalette,
  settings: TypeSettings,
): TypePalette {
  return {
    ...profile,
    customFont: settings.customFont,
    globalFont: settings.globalFont,
    roleFontOverrides: { ...settings.roleFontOverrides },
    roles: cloneRoles(settings.roles),
  };
}

function sameProfileSettings(profile: TypePalette, settings: TypeSettings) {
  return (
    JSON.stringify(settingsFromProfile(profile)) === JSON.stringify(settings)
  );
}

function hasTemporaryStoredProfileEdits(profile: TypePalette) {
  const originalProfile =
    typePalettes.find((candidate) => candidate.id === profile.id) ??
    typePalettes[0];

  return !sameProfileSettings(originalProfile, settingsFromProfile(profile));
}

function typeVariableEntries({
  customFont,
  globalFont,
  roleFontOverrides,
  roles,
}: {
  customFont: string;
  globalFont: string;
  roleFontOverrides: Record<string, string>;
  roles: TypeRole[];
}) {
  return roles.flatMap((role) => {
    const override = roleFontOverrides[role.id] ?? "global";
    const fontFamily =
      override === "global"
        ? fontFamilyForValue(globalFont, customFont)
        : fontFamilyForValue(override, customFont);
    const prefix = `--type-${role.id}`;

    return [
      [`${prefix}-font`, fontFamily],
      [`${prefix}-size`, clampExpression(role.minRem, role.maxRem)],
      [`${prefix}-leading`, String(role.lineHeight)],
      [`${prefix}-weight`, String(role.weight)],
      [`${prefix}-tracking`, `${role.letterSpacingEm}em`],
      [`${prefix}-wrap`, role.wrap === "wrap" ? "wrap" : role.wrap],
      [`${prefix}-transform`, textTransformForRole(role)],
    ] as Array<[string, string]>;
  });
}

function typeVariableStyle(options: TypeSettings): CSSProperties {
  return Object.fromEntries(typeVariableEntries(options)) as CSSProperties;
}

function promotionCss(options: TypeSettings) {
  return [
    ":root {",
    ...typeVariableEntries(options).map(([name, value]) => `  ${name}: ${value};`),
    "}",
  ].join("\n");
}

function SelectField({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="type-caption font-semibold text-service-muted">
        {label}
      </span>
      <select
        id={id}
        className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </label>
  );
}

function FontFamilyOptions({
  localFontOptions,
  includeGlobal = false,
}: {
  localFontOptions: FontOption[];
  includeGlobal?: boolean;
}) {
  return (
    <>
      {includeGlobal ? <option value="global">Use global family</option> : null}
      <optgroup label="Loaded project fonts">
        {projectFontOptions.map((font) => (
          <option key={font.label} value={font.value}>
            {font.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="System font stacks">
        {systemFontOptions.map((font) => (
          <option key={font.label} value={font.value}>
            {font.label}
          </option>
        ))}
      </optgroup>
      {localFontOptions.length > 0 ? (
        <optgroup label="Detected local fonts">
          {localFontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </optgroup>
      ) : null}
      <option value="custom">Custom local family</option>
    </>
  );
}

function NumberControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="type-caption font-semibold text-service-muted">
        {label}
      </span>
      <div className="grid grid-cols-[1fr_5rem] items-center gap-3">
        <input
          className="h-2 accent-service-accent"
          min={min}
          max={max}
          step={step}
          type="range"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          className="min-h-10 rounded-md border border-service-border bg-white px-2 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
          min={min}
          max={max}
          step={step}
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </div>
    </label>
  );
}

function isHeaderRole(role: TypeRole) {
  return role.id.startsWith("display-") || role.id.startsWith("heading-");
}

function isBodyRole(role: TypeRole) {
  return (
    role.id.startsWith("text-") || role.id === "caption" || role.id === "label"
  );
}

export function FontLabSection() {
  const [profiles, setProfiles] = useState<TypePalette[]>(() =>
    typePalettes.map(cloneProfile),
  );
  const [selectedProfileId, setSelectedProfileId] = useState(
    typePalettes[0].id,
  );
  const [roles, setRoles] = useState<TypeRole[]>(() =>
    cloneRoles(typePalettes[0].roles),
  );
  const [globalFont, setGlobalFont] = useState(typePalettes[0].globalFont);
  const [customFont, setCustomFont] = useState(typePalettes[0].customFont ?? "");
  const [roleFontOverrides, setRoleFontOverrides] = useState<
    Record<string, string>
  >(() => ({ ...typePalettes[0].roleFontOverrides }));
  const [appliedSettings, setAppliedSettings] = useState<TypeSettings>(() =>
    settingsFromProfile(typePalettes[0]),
  );
  const [localFontOptions, setLocalFontOptions] = useState<FontOption[]>([]);
  const [fontScanStatus, setFontScanStatus] = useState(
    "Scan availability has not run.",
  );
  const [isScanningFonts, setIsScanningFonts] = useState(false);
  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0].id);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? roles[0],
    [roles, selectedRoleId],
  );

  const selectedProfile = useMemo(
    () =>
      profiles.find((profile) => profile.id === selectedProfileId) ??
      profiles[0],
    [profiles, selectedProfileId],
  );

  const originalSelectedProfile = useMemo(
    () =>
      typePalettes.find((profile) => profile.id === selectedProfileId) ??
      typePalettes[0],
    [selectedProfileId],
  );

  const selectedRoleFontOverride =
    roleFontOverrides[selectedRole.id] ?? "global";
  const globalFontFamily = fontFamilyForValue(globalFont, customFont);
  const editorSettings = useMemo<TypeSettings>(
    () => ({
      customFont,
      globalFont,
      roleFontOverrides,
      roles,
    }),
    [customFont, globalFont, roleFontOverrides, roles],
  );
  const appliedTypeVariables = useMemo(
    () => typeVariableStyle(appliedSettings),
    [appliedSettings],
  );
  const livePromotionCss = useMemo(
    () => promotionCss(editorSettings),
    [editorSettings],
  );
  const hasUnsavedProfileEdits = useMemo(
    () => !sameProfileSettings(selectedProfile, editorSettings),
    [editorSettings, selectedProfile],
  );
  const selectedProfileHasTempStorage = useMemo(
    () => hasTemporaryStoredProfileEdits(selectedProfile),
    [selectedProfile],
  );

  function fontValueForRole(role: TypeRole) {
    const override = roleFontOverrides[role.id] ?? "global";

    if (override !== "global") {
      return override;
    }

    return globalFont === "custom" ? "custom" : globalFont;
  }

  function briefForRole(role: TypeRole) {
    return `${role.token}: ${fontLabelForValue(
      fontValueForRole(role),
      customFont,
      localFontOptions,
    )} / ${roleSpec(role)} / ${role.measureCh}ch`;
  }

  const selectedRoleBrief = briefForRole(selectedRole);
  const allTypeStylesBrief = [
    "Update the project type system using these font lab decisions:",
    "",
    `Global font: ${fontLabelForValue(
      globalFont === "custom" ? "custom" : globalFont,
      customFont,
      localFontOptions,
    )}`,
    "",
    "Roles:",
    ...roles.map((role) => `- ${briefForRole(role)}`),
    "",
    "Promotion CSS:",
    livePromotionCss,
    "",
    "Promote these into the shared type utilities only. Do not redesign sections or rewrite copy. After updating, check the style guide and sample page for obvious wrapping/spacing regressions.",
  ].join("\n");

  function updateSelectedRole(nextValues: Partial<TypeRole>) {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === selectedRole.id ? { ...role, ...nextValues } : role,
      ),
    );
  }

  function resetSelectedRole() {
    const original = selectedProfile.roles.find(
      (role) => role.id === selectedRole.id,
    );

    if (!original) {
      return;
    }

    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === selectedRole.id ? original : role,
      ),
    );
    setRoleFontOverrides((currentOverrides) => {
      const nextOverrides = { ...currentOverrides };
      const savedOverride = selectedProfile.roleFontOverrides[selectedRole.id];

      if (savedOverride) {
        nextOverrides[selectedRole.id] = savedOverride;
      } else {
        delete nextOverrides[selectedRole.id];
      }

      return nextOverrides;
    });
  }

  function loadProfile(profile: TypePalette) {
    const settings = settingsFromProfile(profile);

    setSelectedProfileId(profile.id);
    setRoles(settings.roles);
    setGlobalFont(settings.globalFont);
    setCustomFont(settings.customFont);
    setRoleFontOverrides(settings.roleFontOverrides);
    setSelectedRoleId(settings.roles[0]?.id ?? selectedRoleId);
  }

  function saveCurrentProfile() {
    setProfiles((currentProfiles) =>
      currentProfiles.map((profile) =>
        profile.id === selectedProfile.id
          ? profileFromSettings(profile, editorSettings)
          : profile,
      ),
    );
  }

  function resetCurrentProfile() {
    const resetProfile = cloneProfile(originalSelectedProfile);

    setProfiles((currentProfiles) =>
      currentProfiles.map((profile) =>
        profile.id === resetProfile.id ? resetProfile : profile,
      ),
    );
    loadProfile(resetProfile);
  }

  function applyCurrentProfile() {
    setAppliedSettings({
      customFont,
      globalFont,
      roleFontOverrides: { ...roleFontOverrides },
      roles: cloneRoles(roles),
    });
  }

  function applySelectedFontToRoles(
    matchesRole: (role: TypeRole) => boolean,
  ) {
    const nextOverridesForRoles = (currentOverrides: Record<string, string>) => {
      const nextOverrides = { ...currentOverrides };

      roles.forEach((role) => {
        if (matchesRole(role)) {
          nextOverrides[role.id] = selectedRoleFontOverride;
        }
      });

      return nextOverrides;
    };

    setRoleFontOverrides((currentOverrides) => {
      return nextOverridesForRoles(currentOverrides);
    });

    setAppliedSettings((currentSettings) => {
      const nextOverrides = { ...currentSettings.roleFontOverrides };

      currentSettings.roles.forEach((role) => {
        if (matchesRole(role)) {
          nextOverrides[role.id] = selectedRoleFontOverride;
        }
      });

      return {
        ...currentSettings,
        customFont,
        roleFontOverrides: nextOverrides,
      };
    });
  }

  async function scanLocalFonts() {
    if (!window.queryLocalFonts) {
      setFontScanStatus("Local font scanning is not available in this browser.");
      return;
    }

    setIsScanningFonts(true);
    setFontScanStatus("Waiting for browser permission.");

    try {
      const fonts = await window.queryLocalFonts();
      const families = Array.from(
        new Set(
          fonts
            .map((font) => font.family)
            .filter((family) => family.trim().length > 0),
        ),
      ).sort((a, b) => a.localeCompare(b));

      setLocalFontOptions(
        families.map((family) => ({
          label: family,
          value: `local:${family}`,
        })),
      );
      setFontScanStatus(`${families.length} local font families detected.`);
    } catch {
      setFontScanStatus("Local font scanning was blocked or canceled.");
    } finally {
      setIsScanningFonts(false);
    }
  }

  async function copyBrief(text: string, target: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTarget(target);
      window.setTimeout(() => {
        setCopiedTarget((currentTarget) =>
          currentTarget === target ? null : currentTarget,
        );
      }, 1600);
    } catch {
      setCopiedTarget(null);
    }
  }

  return (
    <section className="section-space-med">
      <div className="w-full px-6 max-md:px-4">
        <div className="grid grid-cols-[minmax(24rem,34rem)_minmax(0,1fr)] gap-6 max-lg:grid-cols-1">
          <aside className="sticky top-4 max-h-[calc(100svh-2rem)] self-start overflow-y-auto rounded-lg border border-service-border bg-white p-6 shadow-service max-lg:static max-lg:max-h-none max-lg:overflow-visible max-md:p-5">
            <div className="fluid-type-frame border-b border-service-border pb-6">
              <p className="type-label text-service-accent">Internal font lab</p>
              <h1 className="type-heading-xl mt-4 text-service-ink">
                Typography role waterfall
              </h1>
            </div>

            <div className="mt-6 grid gap-5">
              <SelectField
                id="global-font"
                label="Global family"
                value={globalFont}
                onChange={setGlobalFont}
              >
                <FontFamilyOptions localFontOptions={localFontOptions} />
              </SelectField>

              <div className="grid gap-2 rounded-md border border-service-border bg-service-surface p-4">
                <SelectField
                  id="type-profile"
                  label="Profile"
                  value={selectedProfileId}
                  onChange={(value) => {
                    const nextProfile =
                      profiles.find((profile) => profile.id === value) ??
                      profiles[0];

                    loadProfile(nextProfile);
                  }}
                >
                  {profiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.label}
                      {hasTemporaryStoredProfileEdits(profile)
                        ? " (temp stored)"
                        : ""}
                    </option>
                  ))}
                </SelectField>
                <p className="type-caption text-service-muted">
                  {selectedProfile.description}
                </p>
                <p className="type-caption font-semibold text-service-muted">
                  {hasUnsavedProfileEdits
                    ? "Unsaved profile edits"
                    : "Profile ready"}
                </p>
                {selectedProfileHasTempStorage ? (
                  <p className="type-caption font-semibold text-service-accent">
                    Temp stored from user input
                  </p>
                ) : null}
                <button
                  className="min-h-11 rounded-md border border-service-accent bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  type="button"
                  onClick={applyCurrentProfile}
                >
                  Apply Current Profile
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                    type="button"
                    onClick={saveCurrentProfile}
                  >
                    Save Edits
                  </button>
                  <button
                    className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                    type="button"
                    onClick={resetCurrentProfile}
                  >
                    Reset Profile
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <button
                  className="min-h-11 rounded-md border border-service-border bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent disabled:cursor-wait disabled:opacity-70"
                  type="button"
                  disabled={isScanningFonts}
                  onClick={scanLocalFonts}
                >
                  {isScanningFonts ? "Scanning Fonts" : "Scan Local Fonts"}
                </button>
                <p className="type-caption text-service-muted">
                  {fontScanStatus}
                </p>
              </div>

              {globalFont === "custom" || selectedRoleFontOverride === "custom" ? (
                <label className="grid gap-2">
                  <span className="type-caption font-semibold text-service-muted">
                    Local family name
                  </span>
                  <input
                    className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
                    placeholder="Aptos"
                    value={customFont}
                    onChange={(event) => setCustomFont(event.target.value)}
                  />
                </label>
              ) : null}

              <SelectField
                id="selected-role"
                label="Selected role"
                value={selectedRole.id}
                onChange={setSelectedRoleId}
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.token}
                  </option>
                ))}
              </SelectField>

              <SelectField
                id="selected-role-font"
                label="Selected role family"
                value={selectedRoleFontOverride}
                onChange={(value) =>
                  setRoleFontOverrides((currentOverrides) => ({
                    ...currentOverrides,
                    [selectedRole.id]: value,
                  }))
                }
              >
                <FontFamilyOptions
                  includeGlobal
                  localFontOptions={localFontOptions}
                />
              </SelectField>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  type="button"
                  onClick={() => applySelectedFontToRoles(isBodyRole)}
                >
                  Set Body Font
                </button>
                <button
                  className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  type="button"
                  onClick={() => applySelectedFontToRoles(isHeaderRole)}
                >
                  Set Header Fonts
                </button>
              </div>

              <div className="grid gap-4 rounded-md border border-service-border bg-service-surface p-4">
                <NumberControl
                  label="Min rem"
                  min={0.5}
                  max={8}
                  step={0.0625}
                  value={selectedRole.minRem}
                  onChange={(value) => updateSelectedRole({ minRem: value })}
                />
                <NumberControl
                  label="Max rem"
                  min={0.5}
                  max={9}
                  step={0.0625}
                  value={selectedRole.maxRem}
                  onChange={(value) => updateSelectedRole({ maxRem: value })}
                />
                <NumberControl
                  label="Line height"
                  min={0.8}
                  max={2}
                  step={0.01}
                  value={selectedRole.lineHeight}
                  onChange={(value) => updateSelectedRole({ lineHeight: value })}
                />
                <NumberControl
                  label="Weight"
                  min={300}
                  max={900}
                  step={10}
                  value={selectedRole.weight}
                  onChange={(value) => updateSelectedRole({ weight: value })}
                />
                <NumberControl
                  label="Measure ch"
                  min={10}
                  max={90}
                  step={1}
                  value={selectedRole.measureCh}
                  onChange={(value) => updateSelectedRole({ measureCh: value })}
                />

                <SelectField
                  id="selected-wrap"
                  label="Wrap"
                  value={selectedRole.wrap}
                  onChange={(value) =>
                    updateSelectedRole({ wrap: value as WrapMode })
                  }
                >
                  <option value="balance">Balanced</option>
                  <option value="pretty">Pretty</option>
                  <option value="wrap">Default</option>
                </SelectField>

                <NumberControl
                  label="Tracking em"
                  min={0}
                  max={0.18}
                  step={0.01}
                  value={selectedRole.letterSpacingEm}
                  onChange={(value) =>
                    updateSelectedRole({ letterSpacingEm: value })
                  }
                />

                <SelectField
                  id="selected-capitalization"
                  label="Capitalization"
                  value={selectedRole.capitalization}
                  onChange={(value) =>
                    updateSelectedRole({
                      capitalization: value as CapitalizationStyle,
                    })
                  }
                >
                  <option value="none">None</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                  <option value="capitalize">Title Case</option>
                </SelectField>
              </div>

              <button
                className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                type="button"
                onClick={resetSelectedRole}
              >
                Reset Selected Role
              </button>

              <button
                className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                type="button"
                onClick={() =>
                  copyBrief(
                    [
                      "Update this typography role from the font lab:",
                      selectedRoleBrief,
                      "Promote this into the shared type utilities only. Do not redesign sections or rewrite copy.",
                    ].join("\n"),
                    selectedRole.id,
                  )
                }
              >
                {copiedTarget === selectedRole.id
                  ? "Copied Selected Style"
                  : "Copy Selected Style"}
              </button>

              <button
                className="min-h-11 rounded-md border border-service-accent bg-service-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                type="button"
                onClick={() => copyBrief(allTypeStylesBrief, "all")}
              >
                {copiedTarget === "all" ? "Copied All Styles" : "Copy All Type Styles"}
              </button>

              <label className="grid gap-2">
                <span className="type-caption font-semibold text-service-muted">
                  Selection brief
                </span>
                <textarea
                  className="min-h-24 resize-y rounded-md border border-service-border bg-service-surface p-3 font-mono text-xs leading-5 text-service-ink outline-none focus:border-service-accent"
                  readOnly
                  value={selectedRoleBrief}
                />
              </label>
            </div>
          </aside>

          <div className="grid min-w-0 gap-4">
            <section className="fluid-type-frame rounded-lg border border-service-border bg-white p-6 shadow-service max-md:p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="type-label text-service-accent">Applied profile preview</p>
                  <h2 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                    Hierarchy waterfall and editorial stress test
                  </h2>
                </div>
                <p className="type-caption max-w-sm text-service-muted">
                  This surface uses the last applied profile. Edit a profile on
                  the left, then apply it to test the hierarchy here.
                </p>
              </div>

              <div className="mt-6 flex max-h-[78svh] justify-center overflow-y-auto rounded-md border border-service-border bg-service-surface p-4 max-md:p-2">
                <div
                  className="w-full max-w-[var(--container-site)]"
                  style={appliedTypeVariables}
                >
                  <div className="grid gap-10 p-10 max-md:p-6">
                    <section className="grid gap-7">
                      <div className="border-b border-service-border pb-5">
                        <p className="type-label text-service-accent">
                          Hierarchy waterfall
                        </p>
                        <h3 className="type-heading-md mt-eyebrow-heading-sm text-service-ink">
                          Role-by-role applied type system
                        </h3>
                      </div>

                      {appliedSettings.roles.map((role) => {
                        const tokenClass = role.token.split(" / ")[0];
                        const isLargestDisplay = role.id === "display-xl";

                        return (
                          <article
                            className={cx(
                              "grid grid-cols-[minmax(9rem,0.28fr)_minmax(0,1fr)] gap-6 border-b border-service-border max-md:grid-cols-1",
                              isLargestDisplay ? "pb-10" : "pb-6",
                            )}
                            key={role.id}
                          >
                            <div>
                              <code className="rounded bg-service-surface px-2 py-1 text-xs font-semibold text-service-ink">
                                {role.token}
                              </code>
                              <p className="type-caption mt-3 text-service-muted">
                                {role.role}
                              </p>
                            </div>
                            <p
                              className={cx(
                                tokenClass,
                                "measure-copy-wide text-service-ink",
                              )}
                            >
                              {role.sample}
                            </p>
                          </article>
                        );
                      })}
                    </section>

                    <section className="grid gap-8 border-t border-service-border pt-10">
                      <div className="relative aspect-[16/10] min-h-[28rem] overflow-hidden rounded-md bg-service-ink text-white max-lg:min-h-0">
                        <div
                          className="absolute inset-0 bg-[linear-gradient(145deg,rgb(31_122_90_/_0.44),rgb(23_33_29_/_0.12)),linear-gradient(45deg,rgb(255_255_255_/_0.16)_0_1px,transparent_1px_20px)]"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 bg-service-ink/25"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 bg-linear-to-t from-service-ink via-service-ink/52 to-transparent"
                          aria-hidden="true"
                        />

                        <div className="relative z-10 grid h-full grid-rows-[auto_1fr]">
                          <nav
                            aria-label="Floating bento type specimen navigation"
                            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-4 max-lg:grid-cols-[auto_1fr] max-md:px-4"
                          >
                            <a
                              className="type-label flex h-11 w-32 items-center justify-center rounded-md border border-white/20 bg-white/90 p-1 text-service-muted shadow-service backdrop-blur-md"
                              href="#"
                            >
                              {sectionLibraryContent.navPrimary.logoLabel}
                            </a>
                            <ul className="type-text-sm flex min-h-11 items-center gap-1 rounded-md border border-white/20 bg-white/90 p-1 font-semibold text-service-ink shadow-service backdrop-blur-md max-lg:hidden">
                              {sectionLibraryContent.navPrimary.links.map((link) => (
                                <li key={link.label}>
                                  <a
                                    className="flex h-9 items-center px-3"
                                    href="#"
                                  >
                                    {link.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-self-end max-lg:hidden">
                              <a
                                className="type-text-sm inline-flex min-h-11 items-center justify-center rounded-md bg-service-accent px-4 font-semibold text-white"
                                href="#"
                              >
                                {sectionLibraryContent.navPrimary.action}
                              </a>
                            </div>
                          </nav>

                          <div className="grid min-h-0 grid-cols-[minmax(0,0.68fr)_minmax(15rem,0.32fr)] items-end gap-8 px-8 pb-8 max-lg:grid-cols-1 max-lg:gap-6 max-md:px-5 max-md:pb-5">
                            <div className="min-w-0">
                              <p className="type-label text-white/70">
                                {sectionLibraryContent.heroFullscreen.eyebrow}
                              </p>
                              <h2 className="type-heading-lg measure-copy-wide mt-5 text-white">
                                {sectionLibraryContent.heroFullscreen.title}
                              </h2>
                              <p className="type-text-lg measure-copy mt-5 text-white/78">
                                {sectionLibraryContent.heroFullscreen.body}
                              </p>
                            </div>

                            <aside className="grid grid-cols-2 gap-3 text-white max-md:hidden">
                              {sectionLibraryContent.heroFullscreen.trustSignals.map(
                                (signal) => (
                                  <div
                                    className="rounded-md border border-white/18 bg-white/12 p-4 backdrop-blur-md"
                                    key={signal.label}
                                  >
                                    <p className="type-heading-sm leading-none">
                                      {signal.value}
                                    </p>
                                    <p className="type-caption mt-2 text-white/72">
                                      {signal.label}
                                    </p>
                                  </div>
                                ),
                              )}
                              <div className="col-span-2 rounded-md border border-white/18 bg-white/12 p-5 backdrop-blur-md">
                                <p className="type-heading-md leading-none">
                                  {sectionLibraryContent.heroFullscreen.review.rating}
                                </p>
                                <p className="type-text-sm mt-3 font-semibold">
                                  {sectionLibraryContent.heroFullscreen.review.label}
                                </p>
                              </div>
                            </aside>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(18rem,0.28fr)] gap-8 max-lg:grid-cols-1">
                        <div>
                          <p className="type-label text-service-accent">
                            Editorial texture
                          </p>
                          <h2 className="type-display-lg mt-eyebrow-display text-service-ink">
                            A service brand should feel clear before it feels clever.
                          </h2>
                          <p className="type-text-xl measure-lead mt-display-body text-service-muted">
                            This section tests long-form rhythm, short emphatic
                            lines, supporting paragraphs, captions, labels, and
                            mixed-density layouts without relying on imagery.
                          </p>
                        </div>

                        <aside className="grid content-start gap-4 border-l border-service-border pl-6 max-lg:border-l-0 max-lg:border-t max-lg:pl-0 max-lg:pt-6">
                          <p className="type-caption text-service-muted">
                            Profile sample
                          </p>
                          <p className="type-heading-sm text-service-ink">
                            Same words, different hierarchy.
                          </p>
                          <p className="type-text-sm text-service-muted">
                            A compact sidebar exposes caption, small body, and
                            card heading behavior in a narrow measure.
                          </p>
                        </aside>
                      </div>

                      <div className="grid grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)] gap-8 max-lg:grid-cols-1">
                        <div className="grid gap-5">
                          <p className="type-text-lg measure-copy-wide text-service-ink">
                            Homeowners often arrive with a practical concern:
                            a leak under the sink, a noisy unit, a room that
                            will not cool, or a repair bill they do not fully
                            understand. The typography has to carry calm,
                            sequence, and trust before the visitor has decided
                            whether to call.
                          </p>
                          <p className="type-text-md measure-copy text-service-muted">
                            Body copy should hold up across plain explanations,
                            proof points, qualifications, and next-step
                            instructions. It should be easy to scan, but still
                            substantial enough to support a premium local
                            service brand.
                          </p>
                          <p className="type-text-sm measure-caption text-service-muted">
                            Smaller paragraphs test whether supporting content
                            remains useful without becoming whisper-thin,
                            cramped, or visually detached from the rest of the
                            page.
                          </p>
                        </div>

                        <blockquote className="grid content-between gap-8 bg-service-ink p-7 text-white">
                          <p className="type-heading-lg">
                            The best local service pages make the next step feel
                            obvious, not forced.
                          </p>
                          <footer>
                            <p className="type-label text-white/60">
                              Pullquote rhythm
                            </p>
                            <p className="type-caption mt-heading-body-sm text-white/70">
                              Useful for testimonials, process notes, and
                              editorial emphasis.
                            </p>
                          </footer>
                        </blockquote>
                      </div>

                      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                        {[
                          {
                            eyebrow: "Service card",
                            title: "Diagnose before deciding",
                            body: "A card title needs enough authority to scan quickly without overpowering the body copy below it.",
                          },
                          {
                            eyebrow: "Process card",
                            title: "Explain the options",
                            body: "Supporting text should handle practical detail, plain-language guidance, and service expectations.",
                          },
                          {
                            eyebrow: "Proof card",
                            title: "Close the loop",
                            body: "Captions, labels, and small paragraphs should still feel deliberate in dense layouts.",
                          },
                        ].map((card) => (
                          <article
                            className="grid gap-4 border border-service-border bg-service-surface p-6"
                            key={card.title}
                          >
                            <p className="type-label text-service-accent">
                              {card.eyebrow}
                            </p>
                            <h3 className="type-heading-sm text-service-ink">
                              {card.title}
                            </h3>
                            <p className="type-text-sm text-service-muted">
                              {card.body}
                            </p>
                          </article>
                        ))}
                      </div>

                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 max-lg:grid-cols-1">
                        <div className="border border-service-border p-6">
                          <p className="type-label text-service-accent">
                            Dense list
                          </p>
                          <ul className="mt-5 grid gap-3">
                            {[
                              "Short labels should remain crisp.",
                              "Body rows need enough line height for scanning.",
                              "Microcopy should still feel connected.",
                            ].map((item) => (
                              <li className="type-text-md text-service-ink" key={item}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-3 border border-service-border max-md:grid-cols-1">
                          {[
                            ["4.9", "Average rating"],
                            ["24h", "Fast response"],
                            ["12k", "Local visits"],
                          ].map(([value, label]) => (
                            <div
                              className="border-r border-service-border p-6 last:border-r-0 max-md:border-b max-md:border-r-0 max-md:last:border-b-0"
                              key={label}
                            >
                              <p className="type-heading-lg text-service-ink">
                                {value}
                              </p>
                              <p className="type-caption mt-heading-body-sm text-service-muted">
                                {label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </section>

            {roles.map((role) => {
              const override = roleFontOverrides[role.id] ?? "global";
              const roleFontFamily =
                override === "global"
                  ? globalFontFamily
                  : fontFamilyForValue(override, customFont);
              const isSelected = role.id === selectedRole.id;

              return (
                <Card
                  className={cx(
                    "fluid-type-frame p-6 shadow-none transition-colors max-md:p-5",
                    isSelected && "border-service-accent",
                  )}
                  key={role.id}
                >
                  <div className="mb-6 grid grid-cols-[minmax(0,1fr)_minmax(13rem,0.35fr)] gap-4 max-md:grid-cols-1">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <code className="rounded bg-service-surface px-2 py-1 text-xs font-semibold text-service-ink">
                          {role.token}
                        </code>
                        <span className="type-caption text-service-muted">
                          {roleSpec(role)}
                        </span>
                      </div>
                      <p className="type-caption mt-2 text-service-muted">
                        {role.role} / {role.measureCh}ch
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <select
                        className="min-h-10 rounded-md border border-service-border bg-service-surface px-3 text-xs font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
                        value={override}
                        onChange={(event) =>
                          setRoleFontOverrides((currentOverrides) => ({
                            ...currentOverrides,
                            [role.id]: event.target.value,
                          }))
                        }
                        aria-label={`${role.token} font family`}
                      >
                        <FontFamilyOptions
                          includeGlobal
                          localFontOptions={localFontOptions}
                        />
                      </select>
                      <button
                        className="min-h-10 rounded-md border border-service-border bg-white px-3 text-xs font-semibold text-service-accent transition-colors hover:border-service-accent hover:bg-service-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                        type="button"
                        onClick={() => setSelectedRoleId(role.id)}
                      >
                        Tune Role
                      </button>
                      <button
                        className="min-h-10 rounded-md border border-service-border bg-white px-3 text-xs font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                        type="button"
                        onClick={() =>
                          copyBrief(
                            [
                              "Update this typography role from the font lab:",
                              briefForRole(role),
                              "Promote this into the shared type utilities only. Do not redesign sections or rewrite copy.",
                            ].join("\n"),
                            role.id,
                          )
                        }
                      >
                        {copiedTarget === role.id ? "Copied Style" : "Copy Style"}
                      </button>
                    </div>
                  </div>

                  <p
                    className="text-service-ink"
                    style={previewStyle(role, roleFontFamily)}
                  >
                    {role.sample}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
