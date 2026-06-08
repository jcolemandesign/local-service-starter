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
  } / ${formatNumber(role.letterSpacingEm)}em / ${role.capitalization}`;
}

function roleForToken(roles: TypeRole[], tokenName: string) {
  return roles.find((role) =>
    role.token
      .split("/")
      .map((token) => token.trim())
      .includes(tokenName),
  );
}

function fontLabelForValue(value: string) {
  if (value === "global") {
    return "Use global family";
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

function FontFamilyOptions({ includeGlobal = false }: { includeGlobal?: boolean }) {
  return (
    <>
      {includeGlobal ? <option value="global">Use global family</option> : null}
      {fontOptions.map((font) => (
        <option key={`${font.label}-${font.value}`} value={font.value}>
          {font.label}
        </option>
      ))}
    </>
  );
}

export function StyleGuideTypographyControls() {
  const { draft, updateDraft } = useStyleGuideTokens();
  const [selectedProfileId, setSelectedProfileId] = useState(typePalettes[0].id);
  const [selectedRoleId, setSelectedRoleId] = useState(
    draft.typeRoles[0]?.id ?? "",
  );

  const selectedRole = useMemo(
    () =>
      draft.typeRoles.find((role) => role.id === selectedRoleId) ??
      draft.typeRoles[0] ??
      null,
    [draft.typeRoles, selectedRoleId],
  );
  const selectedRoleFontOverride = selectedRole
    ? draft.typeRoleOverrides[selectedRole.id] ?? "global"
    : "global";
  const selectedRoleBrief = selectedRole
    ? `${selectedRole.token}: ${fontLabelForValue(
        selectedRoleFontOverride,
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
    setSelectedRoleId(profile.roles[0]?.id ?? "");
    updateDraft("typeCustomFont", profile.customFont ?? "");
    updateDraft("typeGlobalFont", profile.globalFont);
    updateDraft("typeRoleOverrides", { ...profile.roleFontOverrides });
    updateDraft("typeRoles", cloneRoles(profile.roles));
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

  function applySelectedFontToRoles(matchesRole: (role: TypeRole) => boolean) {
    const nextOverrides = { ...draft.typeRoleOverrides };

    draft.typeRoles.forEach((role) => {
      if (matchesRole(role)) {
        nextOverrides[role.id] = selectedRoleFontOverride;
      }
    });

    updateDraft("typeRoleOverrides", nextOverrides);
  }

  return (
    <Card className="sticky top-4 max-h-[calc(100svh-2rem)] overflow-y-auto p-5 shadow-service max-lg:static max-lg:max-h-none max-lg:overflow-visible">
      <div className="border-b border-service-border pb-5">
        <p className="type-label text-service-accent">Style Guide Font Lab</p>
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
          <FontFamilyOptions />
        </SelectField>

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
          onChange={setSelectedRoleId}
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
              <FontFamilyOptions includeGlobal />
            </SelectField>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                onClick={() => applySelectedFontToRoles(isBodyRole)}
                type="button"
              >
                Set Body Fonts
              </button>
              <button
                className="min-h-11 rounded-md border border-service-border bg-white px-3 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
                onClick={() => applySelectedFontToRoles(isHeaderRole)}
                type="button"
              >
                Set Header Fonts
              </button>
            </div>

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
            </div>

            <button
              className="min-h-11 rounded-md border border-service-border bg-white px-4 text-sm font-semibold text-service-ink transition-colors hover:border-service-accent hover:bg-service-surface hover:text-service-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-service-accent"
              onClick={resetSelectedRole}
              type="button"
            >
              Reset Selected Role
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
