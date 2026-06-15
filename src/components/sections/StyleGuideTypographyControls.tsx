"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Card } from "@/components/primitives";
import {
  useStyleGuideTokens,
} from "@/components/sections/StyleGuideLiveSurface";
import {
  type CapitalizationStyle,
  type TypeRole,
  type WrapMode,
  fontStacks,
  typePalettes,
} from "@/content/type-palettes";

type FontOption = {
  label: string;
  value: string;
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

const fontOptions: FontOption[] = [
  { label: "Geist Sans", value: fontStacks.geistSans },
  { label: "System UI", value: fontStacks.systemSans },
  { label: "Aptos", value: fontStacks.aptos },
  { label: "Trebuchet MS", value: fontStacks.trebuchet },
  { label: "Georgia", value: fontStacks.georgia },
  { label: "Times New Roman", value: fontStacks.times },
  { label: "Custom family", value: "custom" },
];

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

function formatNumber(value: number) {
  return numberFormat.format(value);
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function cloneRoles(roles: TypeRole[]) {
  return roles.map((role) => ({ ...role }));
}

function roleSpec(role: TypeRole) {
  return `${formatNumber(role.minRem)}rem - ${formatNumber(
    role.maxRem,
  )}rem / ${formatNumber(role.lineHeight)} / ${role.weight} / ${
    role.wrap === "wrap" ? "default" : role.wrap
  } / ${formatNumber(role.letterSpacingEm)}em / ${role.capitalization} / ${
    role.measureCh
  }ch`;
}

function roleForToken(roles: TypeRole[], tokenName: string) {
  const tokenNames = tokenName.split("/").map((token) => token.trim());

  return roles.find((role) => {
    const roleTokens = role.token.split("/").map((token) => token.trim());

    return tokenNames.some((token) => roleTokens.includes(token));
  });
}

function fontLabelForValue(value: string, localFontOptions: FontOption[] = []) {
  if (value === "global") {
    return "Use global family";
  }

  if (value.startsWith("local:")) {
    return (
      localFontOptions.find((font) => font.value === value)?.label ??
      value.replace("local:", "")
    );
  }

  return fontOptions.find((font) => font.value === value)?.label ?? value;
}

function isHeaderRole(role: TypeRole) {
  return (
    role.id === "display-xl" ||
    role.id.startsWith("display-") ||
    role.id.startsWith("heading-")
  );
}

function isBodyRole(role: TypeRole) {
  return (
    role.id.startsWith("text-") ||
    role.id === "caption" ||
    role.id === "label"
  );
}

type FontGroup = "body" | "header";

function storedFontForGroup(profileRoles: TypeRole[], overrides: Record<string, string>, group: FontGroup) {
  const matchingRole = profileRoles.find(group === "header" ? isHeaderRole : isBodyRole);

  if (!matchingRole) {
    return "global";
  }

  return overrides[matchingRole.id] ?? "global";
}

function SelectField({
  children,
  id,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="type-caption font-semibold text-service-muted">
        {label}
      </span>
      <select
        className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function NumberControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between gap-3">
        <span className="type-caption font-semibold text-service-muted">
          {label}
        </span>
        <span className="type-caption font-semibold text-service-ink">
          {formatNumber(value)}
        </span>
      </span>
      <input
        className="w-full accent-service-accent"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
    </label>
  );
}

function FontFamilyOptions({
  includeGlobal = false,
  localFontOptions,
}: {
  includeGlobal?: boolean;
  localFontOptions: FontOption[];
}) {
  return (
    <>
      {includeGlobal ? <option value="global">Use global family</option> : null}
      {fontOptions.map((font) => (
        <option key={`${font.label}-${font.value}`} value={font.value}>
          {font.label}
        </option>
      ))}
      {localFontOptions.length > 0 ? (
        <optgroup label="Detected local fonts">
          {localFontOptions.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </optgroup>
      ) : null}
    </>
  );
}

export function StyleGuideTypographyControls() {
  const { draft, updateDraft } = useStyleGuideTokens();
  const [fontScanStatus, setFontScanStatus] = useState(
    "Scan availability has not run.",
  );
  const [isScanningFonts, setIsScanningFonts] = useState(false);
  const [localFontOptions, setLocalFontOptions] = useState<FontOption[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState(typePalettes[0].id);

  const selectedRole = useMemo(
    () =>
      draft.typeRoles.find((role) => role.id === draft.typeSelectedRoleId) ??
      draft.typeRoles[0] ??
      null,
    [draft.typeRoles, draft.typeSelectedRoleId],
  );
  const selectedRoleFontOverride = selectedRole
    ? draft.typeRoleOverrides[selectedRole.id] ?? "global"
    : "global";
  const selectedRoleBrief = selectedRole
    ? `${selectedRole.token}: ${fontLabelForValue(
        selectedRoleFontOverride,
        localFontOptions,
      )} / ${roleSpec(selectedRole)}`
    : "No type role selected.";

  function updateSelectedRole(nextValues: Partial<TypeRole>) {
    if (!selectedRole) {
      return;
    }

    updateDraft(
      "typeRoles",
      draft.typeRoles.map((role) =>
        role.id === selectedRole.id ? { ...role, ...nextValues } : role,
      ),
    );
  }

  function updateSelectedRoleFont(value: string) {
    if (!selectedRole) {
      return;
    }

    updateDraft("typeRoleOverrides", {
      ...draft.typeRoleOverrides,
      [selectedRole.id]: value,
    });
  }

  function loadProfile(profileId: string) {
    const profile =
      typePalettes.find((candidate) => candidate.id === profileId) ??
      typePalettes[0];

    setSelectedProfileId(profile.id);
    updateDraft(
      "typeBodyFontAssignment",
      storedFontForGroup(profile.roles, profile.roleFontOverrides, "body"),
    );
    updateDraft("typeCustomFont", profile.customFont ?? "");
    updateDraft("typeGlobalFont", profile.globalFont);
    updateDraft(
      "typeHeaderFontAssignment",
      storedFontForGroup(profile.roles, profile.roleFontOverrides, "header"),
    );
    updateDraft("typeRoleOverrides", { ...profile.roleFontOverrides });
    updateDraft("typeRoles", cloneRoles(profile.roles));
    updateDraft("typeSelectedRoleId", profile.roles[0]?.id ?? "");
  }

  function resetSelectedRole() {
    if (!selectedRole) {
      return;
    }

    const profile =
      typePalettes.find((candidate) => candidate.id === selectedProfileId) ??
      typePalettes[0];
    const originalRole = profile.roles.find((role) => role.id === selectedRole.id);

    if (!originalRole) {
      return;
    }

    updateSelectedRole(originalRole);
    updateDraft("typeRoleOverrides", {
      ...draft.typeRoleOverrides,
      [selectedRole.id]: profile.roleFontOverrides[selectedRole.id] ?? "global",
    });
  }

  function applySelectedFontToGroup(group: FontGroup) {
    if (!selectedRole) {
      return;
    }

    const nextFontAssignment = selectedRoleFontOverride;
    const belongsToGroup = group === "header" ? isHeaderRole : isBodyRole;
    const nextRoleOverrides = { ...draft.typeRoleOverrides };

    for (const role of draft.typeRoles) {
      if (belongsToGroup(role)) {
        nextRoleOverrides[role.id] = nextFontAssignment;
      }
    }

    updateDraft(
      group === "header" ? "typeHeaderFontAssignment" : "typeBodyFontAssignment",
      nextFontAssignment,
    );
    updateDraft("typeRoleOverrides", nextRoleOverrides);
  }

  function resetAssignedFonts() {
    updateDraft("typeBodyFontAssignment", "global");
    updateDraft("typeHeaderFontAssignment", "global");
    updateDraft("typeRoleOverrides", {});
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

  return (
    <Card className="max-h-[calc(100svh-5rem)] overflow-y-auto p-5 shadow-service max-sm:max-h-none max-sm:overflow-visible">
      <div className="border-b border-service-border pb-5">
        <p className="type-label text-service-accent">Typography controls</p>
        <h3 className="type-heading-sm mt-eyebrow-heading-sm text-service-ink">
          Live typography controls
        </h3>
      </div>

      <div className="mt-5 grid gap-5">
        <SelectField
          id="styleguide-type-profile"
          label="Profile"
          onChange={loadProfile}
          value={selectedProfileId}
        >
          {typePalettes.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.label}
            </option>
          ))}
        </SelectField>

        <SelectField
          id="styleguide-global-font"
          label="Global family"
          onChange={(value) => updateDraft("typeGlobalFont", value)}
          value={draft.typeGlobalFont}
        >
          <FontFamilyOptions localFontOptions={localFontOptions} />
        </SelectField>

        <div className="grid gap-2">
          <button
            className="min-h-11 rounded-md border border-service-ink bg-service-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent disabled:cursor-wait disabled:opacity-70"
            disabled={isScanningFonts}
            onClick={scanLocalFonts}
            type="button"
          >
            {isScanningFonts ? "Scanning Fonts" : "Scan Local Fonts"}
          </button>
          <p className="type-caption text-service-muted">{fontScanStatus}</p>
        </div>

        {draft.typeGlobalFont === "custom" ||
        selectedRoleFontOverride === "custom" ? (
          <label className="grid gap-2">
            <span className="type-caption font-semibold text-service-muted">
              Custom family name
            </span>
            <input
              className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink outline-none transition-colors focus:border-service-accent"
              onChange={(event) =>
                updateDraft("typeCustomFont", event.target.value)
              }
              placeholder="Aptos"
              value={draft.typeCustomFont}
            />
          </label>
        ) : null}

        <SelectField
          id="styleguide-selected-role"
          label="Selected role"
          onChange={(value) => updateDraft("typeSelectedRoleId", value)}
          value={selectedRole?.id ?? ""}
        >
          {draft.typeRoles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.token}
            </option>
          ))}
        </SelectField>

        {selectedRole ? (
          <>
            <SelectField
              id="styleguide-role-font"
              label="Selected role family"
              onChange={updateSelectedRoleFont}
              value={selectedRoleFontOverride}
            >
              <FontFamilyOptions includeGlobal localFontOptions={localFontOptions} />
            </SelectField>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <button
                  className="min-h-11 rounded-md border border-service-ink bg-service-ink px-3 text-sm font-semibold text-white transition-colors hover:border-service-accent hover:bg-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  onClick={() => applySelectedFontToGroup("header")}
                  type="button"
                >
                  Assign Header Font
                </button>
              </div>

              <div className="grid gap-2">
                <button
                  className="min-h-11 rounded-md border border-service-accent bg-service-accent px-3 text-sm font-semibold text-white transition-colors hover:border-service-ink hover:bg-service-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                  onClick={() => applySelectedFontToGroup("body")}
                  type="button"
                >
                  Assign Body Font
                </button>
              </div>
            </div>

            <button
              className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-muted transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              onClick={resetAssignedFonts}
              type="button"
            >
              Reset Fonts
            </button>

            <div className="grid gap-4 rounded-md border border-service-border bg-service-surface p-4">
              <NumberControl
                label="Min rem"
                max={8}
                min={0.5}
                onChange={(value) => updateSelectedRole({ minRem: value })}
                step={0.0625}
                value={selectedRole.minRem}
              />
              <NumberControl
                label="Max rem"
                max={9}
                min={0.5}
                onChange={(value) => updateSelectedRole({ maxRem: value })}
                step={0.0625}
                value={selectedRole.maxRem}
              />
              <NumberControl
                label="Line height"
                max={2}
                min={0.8}
                onChange={(value) => updateSelectedRole({ lineHeight: value })}
                step={0.01}
                value={selectedRole.lineHeight}
              />
              <NumberControl
                label="Weight"
                max={900}
                min={300}
                onChange={(value) => updateSelectedRole({ weight: value })}
                step={10}
                value={selectedRole.weight}
              />
              <SelectField
                id="styleguide-wrap"
                label="Wrap"
                onChange={(value) =>
                  updateSelectedRole({ wrap: value as WrapMode })
                }
                value={selectedRole.wrap}
              >
                <option value="balance">Balanced</option>
                <option value="pretty">Pretty</option>
                <option value="wrap">Default</option>
              </SelectField>
              <NumberControl
                label="Tracking em"
                max={0.18}
                min={-0.12}
                onChange={(value) =>
                  updateSelectedRole({ letterSpacingEm: value })
                }
                step={0.01}
                value={selectedRole.letterSpacingEm}
              />
              <SelectField
                id="styleguide-capitalization"
                label="Capitalization"
                onChange={(value) =>
                  updateSelectedRole({
                    capitalization: value as CapitalizationStyle,
                  })
                }
                value={selectedRole.capitalization}
              >
                <option value="none">None</option>
                <option value="uppercase">Uppercase</option>
                <option value="lowercase">Lowercase</option>
                <option value="capitalize">Title Case</option>
              </SelectField>
              {isBodyRole(selectedRole) ? (
                <NumberControl
                  label="Max measure ch"
                  max={90}
                  min={24}
                  onChange={(value) => updateSelectedRole({ measureCh: value })}
                  step={1}
                  value={selectedRole.measureCh}
                />
              ) : null}
            </div>

            <button
              className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              onClick={resetSelectedRole}
              type="button"
            >
              Reset Selected Role
            </button>

            <button
              className="min-h-11 rounded-md border border-service-border bg-service-surface px-4 text-sm font-semibold text-service-muted transition-colors hover:border-service-accent hover:bg-white hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              onClick={() => loadProfile(selectedProfileId)}
              type="button"
            >
              Reset Selected Profile
            </button>

            <div
              className={cx(
                "rounded-md border border-service-border bg-service-surface p-3",
                selectedRole.id === "label" && "uppercase tracking-[0.12em]",
              )}
            >
              <p className="type-caption font-semibold text-service-muted">
                Selection brief
              </p>
              <p className="mt-2 font-mono text-xs leading-5 text-service-ink">
                {selectedRoleBrief}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </Card>
  );
}

export function StyleGuideTypeSpec({ tokenName }: { tokenName: string }) {
  const { draft } = useStyleGuideTokens();
  const role = roleForToken(draft.typeRoles, tokenName);

  if (!role) {
    return null;
  }

  return <>{roleSpec(role)}</>;
}

export function StyleGuideResetFontButton({
  tokenName,
}: {
  tokenName: string;
}) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const role = roleForToken(draft.typeRoles, tokenName);
  const group: FontGroup | null = role
    ? isHeaderRole(role)
      ? "header"
      : isBodyRole(role)
        ? "body"
        : null
    : null;

  if (!role || !group) {
    return null;
  }

  function resetRoleFont() {
    if (!role) {
      return;
    }

    const baselineFont =
      group === "header"
        ? draft.typeHeaderFontAssignment
        : draft.typeBodyFontAssignment;

    updateDraft("typeSelectedRoleId", role.id);
    updateDraft("typeRoleOverrides", {
      ...draft.typeRoleOverrides,
      [role.id]: baselineFont,
    });
  }

  return (
    <button
      className="type-caption mt-5 inline-flex font-semibold text-service-muted underline underline-offset-4 transition-colors hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
      onClick={resetRoleFont}
      type="button"
    >
      {group === "header" ? "Reset To Header Font" : "Reset To Body Font"}
    </button>
  );
}

export function StyleGuideTypeSample({
  children,
  className,
  tokenName,
}: {
  children: ReactNode;
  className?: string;
  tokenName: string;
}) {
  const { draft, updateDraft } = useStyleGuideTokens();
  const role = roleForToken(draft.typeRoles, tokenName);
  const isSelected = Boolean(role && role.id === draft.typeSelectedRoleId);

  return (
    <button
      className={cx(
        className,
        "-m-2 block rounded-md p-2 text-left transition-all duration-200 hover:bg-service-accent/10 hover:ring-1 hover:ring-service-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent",
        isSelected &&
          "ring-2 ring-service-accent/60 shadow-[0_0_0_4px_rgb(31_122_90_/_0.08)]",
      )}
      disabled={!role}
      onClick={() => {
        if (role) {
          updateDraft("typeSelectedRoleId", role.id);
        }
      }}
      type="button"
    >
      {children}
    </button>
  );
}
