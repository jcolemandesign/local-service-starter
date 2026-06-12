"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type TypeRole, typePalettes } from "@/content/type-palettes";

export type StyleGuideTokenDraft = {
  accent: string;
  bgDark: string;
  bgPage: string;
  activeRadiusName: string;
  activeRadiusValue: string;
  activeBorderWidthName: string;
  activeBorderWidthValue: string;
  activeCardGapName: string;
  activeCardGapValue: string;
  activeInlineGapName: string;
  activeInlineGapValue: string;
  activeLayoutGapName: string;
  activeLayoutGapValue: string;
  activeSectionMinName: string;
  activeSectionMinValue: string;
  activeSemanticSpacingScale: number;
  activeContentFrameName: string;
  activeContentFrameValue: string;
  activeSiteGridFrameBlock: string;
  activeSiteGridFrameInline: string;
  activeSiteGridFrameName: string;
  activeSiteGridGapName: string;
  activeSiteGridGapValue: string;
  radiusLg: number;
  radiusMd: number;
  radiusSm: number;
  radiusXl: number;
  serviceAccent: string;
  serviceBorder: string;
  serviceInk: string;
  serviceMuted: string;
  serviceSurface: string;
  shadowAlpha: number;
  shadowBlur: number;
  shadowX: number;
  shadowY: number;
  typeCustomFont: string;
  typeBodyFontAssignment: string;
  typeGlobalFont: string;
  typeHeaderFontAssignment: string;
  typeRoleOverrides: Record<string, string>;
  typeRoles: TypeRole[];
  typeSelectedRoleId: string;
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

export const styleGuideStorageKey = "pageworks-styleguide-token-draft-v1";

export const defaultStyleGuideTokenDraft: StyleGuideTokenDraft = {
  accent: "#c45a2c",
  bgDark: "#10141b",
  bgPage: "#fbfaf6",
  activeRadiusName: "radius-md / radius-medium",
  activeRadiusValue: "8px",
  activeBorderWidthName: "border-default",
  activeBorderWidthValue: "1px",
  activeCardGapName: "card-grid-gap-med",
  activeCardGapValue: "1rem",
  activeInlineGapName: "inline-gap-med",
  activeInlineGapValue: "1rem",
  activeLayoutGapName: "layout-gap-med",
  activeLayoutGapValue: "1rem",
  activeSectionMinName: "section-min-tiny",
  activeSectionMinValue: "18rem",
  activeSemanticSpacingScale: 1,
  activeContentFrameName: "content-spacing-default",
  activeContentFrameValue: "clamp(1.5rem, 3vw, 2.5rem)",
  activeSiteGridFrameBlock: "clamp(2rem, 4vw, 7rem)",
  activeSiteGridFrameInline: "clamp(0.5rem, 3vw, 6rem)",
  activeSiteGridFrameName: "body-spacing-default",
  activeSiteGridGapName: "site-grid-gap-default",
  activeSiteGridGapValue: "clamp(0.75rem, 1vw, 1.5rem)",
  radiusLg: 24,
  radiusMd: 8,
  radiusSm: 4,
  radiusXl: 40,
  serviceAccent: "#1f7a5a",
  serviceBorder: "#dfe7e1",
  serviceInk: "#17211d",
  serviceMuted: "#5f6f68",
  serviceSurface: "#f4f7f3",
  shadowAlpha: 0.08,
  shadowBlur: 50,
  shadowX: 0,
  shadowY: 18,
  typeBodyFontAssignment: "global",
  typeCustomFont: typePalettes[0].customFont ?? "",
  typeGlobalFont: typePalettes[0].globalFont,
  typeHeaderFontAssignment: "global",
  typeRoleOverrides: { ...typePalettes[0].roleFontOverrides },
  typeRoles: typePalettes[0].roles.map((role) => ({ ...role })),
  typeSelectedRoleId: typePalettes[0].roles[0]?.id ?? "",
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
  if (value.startsWith("local:")) {
    const family = value.replace("local:", "").trim();

    return family
      ? `"${family.replaceAll('"', '\\"')}", ${defaultStyleGuideTokenDraft.typeGlobalFont}`
      : defaultStyleGuideTokenDraft.typeGlobalFont;
  }

  if (value !== "custom") {
    return value;
  }

  const trimmedFont = customFont.trim();

  if (!trimmedFont) {
    return defaultStyleGuideTokenDraft.typeGlobalFont;
  }

  return `"${trimmedFont.replaceAll('"', '\\"')}", ${defaultStyleGuideTokenDraft.typeGlobalFont}`;
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
      [`${prefix}-measure`, `${role.measureCh}ch`],
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

export function buildStyleVariables(
  draft: StyleGuideTokenDraft,
): StyleVariableProperties {
  const activeRadiusPx = Number.parseFloat(draft.activeRadiusValue);
  const buttonRadius = Number.isFinite(activeRadiusPx)
    ? Math.min(Math.max(activeRadiusPx <= 2 ? activeRadiusPx : activeRadiusPx / 2, 0), 14)
    : draft.radiusSm;
  const serviceShadow = `${draft.shadowX}px ${draft.shadowY}px ${draft.shadowBlur}px rgb(23 33 29 / ${draft.shadowAlpha})`;

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
    "--card-grid-gap-active": draft.activeCardGapValue,
    "--inline-gap-active": draft.activeInlineGapValue,
    "--layout-gap-active": draft.activeLayoutGapValue,
    "--border-surface-width-token": draft.activeBorderWidthValue,
    "--section-min-active": draft.activeSectionMinValue,
    "--semantic-spacing-scale": String(draft.activeSemanticSpacingScale),
    "--container-gutter": draft.activeContentFrameValue,
    "--site-grid-gap": draft.activeSiteGridGapValue,
    "--site-grid-inset-block": draft.activeSiteGridFrameBlock,
    "--site-grid-inset-inline": draft.activeSiteGridFrameInline,
    "--radius-lg-token": `${draft.radiusLg}px`,
    "--radius-md-token": `${draft.radiusMd}px`,
    "--radius-sm-token": `${draft.radiusSm}px`,
    "--radius-surface-token": draft.activeRadiusValue,
    "--radius-button-token": `${buttonRadius}px`,
    "--radius-xl-token": `${draft.radiusXl}px`,
    "--live-shadow-service": serviceShadow,
    "--shadow-service": serviceShadow,
    ...Object.fromEntries(typeVariableEntries(draft)),
  };
}

export function StyleGuideLiveSurface({ children }: StyleGuideLiveSurfaceProps) {
  const [draft, setDraft] = useState<StyleGuideTokenDraft>(
    defaultStyleGuideTokenDraft,
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  const previewStyle = useMemo(() => buildStyleVariables(draft), [draft]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const storedDraft = window.localStorage.getItem(styleGuideStorageKey);
        setDraft(
          storedDraft
            ? { ...defaultStyleGuideTokenDraft, ...JSON.parse(storedDraft) }
            : defaultStyleGuideTokenDraft,
        );
      } catch {
        setDraft(defaultStyleGuideTokenDraft);
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

    window.localStorage.setItem(styleGuideStorageKey, JSON.stringify(draft));
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

function readStoredStyleGuideDraft() {
  try {
    const storedDraft = window.localStorage.getItem(styleGuideStorageKey);

    return storedDraft
      ? { ...defaultStyleGuideTokenDraft, ...JSON.parse(storedDraft) }
      : defaultStyleGuideTokenDraft;
  } catch {
    return defaultStyleGuideTokenDraft;
  }
}

export function StyleGuidePreviewSurface({
  children,
}: StyleGuideLiveSurfaceProps) {
  const [draft, setDraft] = useState<StyleGuideTokenDraft>(
    defaultStyleGuideTokenDraft,
  );
  const previewStyle = useMemo(() => buildStyleVariables(draft), [draft]);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      setDraft(readStoredStyleGuideDraft());
    }, 0);

    function handleStorage(event: StorageEvent) {
      if (event.key === styleGuideStorageKey) {
        setDraft(readStoredStyleGuideDraft());
      }
    }

    function handleFocus() {
      setDraft(readStoredStyleGuideDraft());
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearTimeout(restoreTimer);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return <div style={previewStyle}>{children}</div>;
}
