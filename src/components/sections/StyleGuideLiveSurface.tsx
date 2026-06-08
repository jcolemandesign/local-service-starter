"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type TypeRole, typePalettes } from "@/content/type-palettes";

export type StyleGuideTokenDraft = {
  accent: string;
  bgDark: string;
  bgPage: string;
  radiusLg: number;
  radiusMd: number;
  radiusSm: number;
  serviceAccent: string;
  serviceBorder: string;
  serviceInk: string;
  serviceMuted: string;
  serviceSurface: string;
  shadowAlpha: number;
  shadowBlur: number;
  shadowY: number;
  typeCustomFont: string;
  typeGlobalFont: string;
  typeRoleOverrides: Record<string, string>;
  typeRoles: TypeRole[];
};

type StyleGuideLiveSurfaceProps = {
  children: ReactNode;
};

type StyleGuideTokenContextValue = {
  draft: StyleGuideTokenDraft;
  updateDraft: <K extends keyof StyleGuideTokenDraft>(
    key: K,
    value: StyleGuideTokenDraft[K],
  ) => void;
};

type StyleVariableProperties = CSSProperties & Record<`--${string}`, string>;

const storageKey = "pageworks-styleguide-token-draft-v1";

const defaultDraft: StyleGuideTokenDraft = {
  accent: "#c45a2c",
  bgDark: "#10141b",
  bgPage: "#fbfaf6",
  radiusLg: 24,
  radiusMd: 8,
  radiusSm: 4,
  serviceAccent: "#1f7a5a",
  serviceBorder: "#dfe7e1",
  serviceInk: "#17211d",
  serviceMuted: "#5f6f68",
  serviceSurface: "#f4f7f3",
  shadowAlpha: 0.08,
  shadowBlur: 50,
  shadowY: 18,
  typeCustomFont: typePalettes[0].customFont ?? "",
  typeGlobalFont: typePalettes[0].globalFont,
  typeRoleOverrides: { ...typePalettes[0].roleFontOverrides },
  typeRoles: typePalettes[0].roles.map((role) => ({ ...role })),
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
});

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

function fontFamilyForValue(value: string, customFont: string) {
  if (value !== "custom") {
    return value;
  }

  const trimmedFont = customFont.trim();

  if (!trimmedFont) {
    return defaultDraft.typeGlobalFont;
  }

  return `"${trimmedFont.replaceAll('"', '\\"')}", ${defaultDraft.typeGlobalFont}`;
}

function textTransformForRole(role: TypeRole) {
  return role.capitalization === "none" ? "none" : role.capitalization;
}

function typeVariableEntries(draft: StyleGuideTokenDraft) {
  return draft.typeRoles.flatMap((role) => {
    const override = draft.typeRoleOverrides[role.id] ?? "global";
    const fontFamily =
      override === "global"
        ? fontFamilyForValue(draft.typeGlobalFont, draft.typeCustomFont)
        : fontFamilyForValue(override, draft.typeCustomFont);
    const prefix = `--type-${role.id}`;

    return [
      [`${prefix}-font`, fontFamily],
      [`${prefix}-size`, clampExpression(role.minRem, role.maxRem)],
      [`${prefix}-leading`, String(role.lineHeight)],
      [`${prefix}-weight`, String(role.weight)],
      [`${prefix}-tracking`, `${role.letterSpacingEm}em`],
      [`${prefix}-wrap`, role.wrap === "wrap" ? "wrap" : role.wrap],
      [`${prefix}-transform`, textTransformForRole(role)],
    ] as Array<[`--${string}`, string]>;
  });
}

const StyleGuideTokenContext = createContext<StyleGuideTokenContextValue | null>(
  null,
);

export function useStyleGuideTokens() {
  const context = useContext(StyleGuideTokenContext);

  if (!context) {
    throw new Error(
      "useStyleGuideTokens must be used inside StyleGuideLiveSurface.",
    );
  }

  return context;
}

function buildStyleVariables(draft: StyleGuideTokenDraft): StyleVariableProperties {
  return {
    "--live-accent": draft.accent,
    "--live-bg-dark": draft.bgDark,
    "--live-bg-muted": draft.serviceBorder,
    "--live-bg-page": draft.bgPage,
    "--live-bg-surface": draft.serviceSurface,
    "--live-border-default": draft.serviceBorder,
    "--live-service-accent": draft.serviceAccent,
    "--live-service-border": draft.serviceBorder,
    "--live-service-ink": draft.serviceInk,
    "--live-service-muted": draft.serviceMuted,
    "--live-service-surface": draft.serviceSurface,
    "--live-text-accent": draft.serviceAccent,
    "--live-text-main": draft.serviceInk,
    "--live-text-muted": draft.serviceMuted,
    "--radius-lg-token": `${draft.radiusLg}px`,
    "--radius-md-token": `${draft.radiusMd}px`,
    "--radius-sm-token": `${draft.radiusSm}px`,
    "--shadow-service": `0 ${draft.shadowY}px ${draft.shadowBlur}px rgb(23 33 29 / ${draft.shadowAlpha})`,
    ...Object.fromEntries(typeVariableEntries(draft)),
  };
}

export function StyleGuideLiveSurface({ children }: StyleGuideLiveSurfaceProps) {
  const [draft, setDraft] = useState<StyleGuideTokenDraft>(defaultDraft);
  const [hasHydrated, setHasHydrated] = useState(false);

  const previewStyle = useMemo(() => buildStyleVariables(draft), [draft]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const storedDraft = window.localStorage.getItem(storageKey);
        setDraft(
          storedDraft
            ? { ...defaultDraft, ...JSON.parse(storedDraft) }
            : defaultDraft,
        );
      } catch {
        setDraft(defaultDraft);
      } finally {
        setHasHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, hasHydrated]);

  function updateDraft<K extends keyof StyleGuideTokenDraft>(
    key: K,
    value: StyleGuideTokenDraft[K],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  return (
    <StyleGuideTokenContext.Provider value={{ draft, updateDraft }}>
      <div style={previewStyle}>{children}</div>
    </StyleGuideTokenContext.Provider>
  );
}
