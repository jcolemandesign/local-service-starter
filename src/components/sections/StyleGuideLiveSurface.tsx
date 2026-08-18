"use client";

import type { CSSProperties, ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  type ButtonStyleSelection,
  buttonStyleCss,
  defaultButtonStyleSelection,
  normalizeButtonStyleSelection,
} from "@/content/button-styles";
import { deriveDarkSurface } from "@/content/color-palette-adapter";
import { derivedColorValues } from "@/content/color-derivations";
import { resolveBorderWidthOption } from "@/content/section-style-options";
import {
  defaultMotionTokens,
  motionTokenDeclarations,
  normalizeMotionTokens,
} from "@/content/motion-tokens";
import { type TypeRole, typePalettes } from "@/content/type-palettes";

export type StyleGuideColorTokens = {
  accent: string;
  accentInk: string;
  accentMutedText: string;
  bgDark: string;
  /**
   * The card that sits on a dark ground, and the CTA-appropriate derivative of
   * the brand colour. Both optional, both added by the colour system overhaul.
   *
   * Optional because every slot saved before the overhaul lacks them, and an
   * approved page records the tokens it was approved under - a required field
   * would invalidate historic approvals. `bgDarkSurface` derives from the dark
   * ground when unset. `ctaAccent` stays unset, which is the normal case: it
   * is only needed when the brand colour itself lacks contrast as a button,
   * and leaving it unset hides the Accent recipe rather than shipping a
   * duplicate of Brand.
   */
  bgDarkSurface?: string;
  ctaAccent?: string;
  bgPage: string;
  serviceAccent: string;
  serviceBorder: string;
  serviceInk: string;
  serviceMuted: string;
  serviceSurface: string;
  surfaceRaised: string;
};

export type StyleGuideTokenDraft = StyleGuideColorTokens & {
  activeButtonRadiusName: string;
  activeButtonRadiusValue: string;
  activeSurfaceRadiusName: string;
  activeSurfaceRadiusValue: string;
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
  activeSectionSpaceLrg: string;
  activeSectionSpaceLrgMobile: string;
  activeSectionSpaceLrgTablet: string;
  activeSectionSpaceMed: string;
  activeSectionSpaceMedMobile: string;
  activeSectionSpaceMedTablet: string;
  activeSectionSpaceName: string;
  activeSectionSpaceSml: string;
  activeSectionSpaceSmlMobile: string;
  activeSectionSpaceSmlTablet: string;
  activeSectionSpaceVsml: string;
  activeSectionSpaceVsmlMobile: string;
  activeSectionSpaceVsmlTablet: string;
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
  shadowAlpha: number;
  shadowBlur: number;
  shadowColor: string;
  shadowX: number;
  shadowY: number;
  typeCustomFont: string;
  typeBodyFontAssignment: string;
  typeGlobalFont: string;
  typeHeaderFontAssignment: string;
  typeRoleOverrides: Record<string, string>;
  typeRoles: TypeRole[];
  typeSelectedRoleId: string;
  /**
   * The animation tokens, keyed by CSS custom property name.
   *
   * A record rather than flat keys because the set is DERIVED from
   * `motionControlGroups` - adding a motion token must not mean editing this
   * type, the default draft, the preview builder, the promotion route and the
   * validator in five separate places. `typeRoleOverrides` is the existing
   * precedent for a record on the draft.
   *
   * A value of `""` is meaningful for tokens that declare `inheritsFrom`: it
   * means "keep time with the token I inherit from", and both emitters omit the
   * declaration rather than writing it blank.
   */
  motionTokens: Record<string, string>;
  /**
   * Which button style fills each of the three slots.
   *
   * A record of ids rather than of values, which is the one place this axis
   * differs from motion: a motion control authors a number directly, while a
   * button style is a complete set of two dozen tokens that only makes sense
   * together. Authoring them individually would let you build a button no entry
   * in the library describes, and then no picker could ever show you what you
   * had. So the draft stores the choice and `buttonStyleDeclarations` expands
   * it, in both emitters.
   *
   * Optional-by-absence is handled the same way `motionTokens` handles it: the
   * record is REBUILT from the registry on load rather than spread, so a slot
   * saved before this axis existed comes back on the shipped assignment instead
   * of with an undefined slot.
   */
  buttonStyleSelection: ButtonStyleSelection;
};

type StyleGuideLiveSurfaceProps = {
  children: ReactNode;
};

type StyleGuideTokenContextValue = {
  draft: StyleGuideTokenDraft;
  /**
   * Replaces the whole draft, for loading a saved slot. Distinct from
   * `updateDrafts`, which merges through the active-palette bookkeeping - a
   * saved slot already carries its own palette state and must not be merged
   * into whatever is currently selected.
   */
  replaceDraft: (next: StyleGuideTokenDraft) => void;
  resetDraft: () => void;
  updateDraft: <K extends keyof StyleGuideTokenDraft>(
    key: K,
    value: StyleGuideTokenDraft[K],
  ) => void;
  updateDrafts: (updates: Partial<StyleGuideTokenDraft>) => void;
};

type StyleVariableProperties = CSSProperties & Record<`--${string}`, string>;

export const styleGuideStorageKey = "pageworks-styleguide-token-draft-v1";

/** The class the live surface carries, and the scope its button rules are
 *  written against. A constant, so nothing user-supplied reaches a selector. */
export const styleGuideButtonScope = ".style-guide-button-surface";

/** Shipped starting colors. Saved token sets live in Style Guide Slots. */
const defaultColorTokens: StyleGuideColorTokens = {
  accent: "#c45a2c",
  accentInk: "#ffffff",
  accentMutedText: "#dcefe7",
  bgDark: "#10141b",
  bgPage: "#fbfaf6",
  serviceAccent: "#1f7a5a",
  serviceBorder: "#dfe7e1",
  serviceInk: "#17211d",
  serviceMuted: "#5f6f68",
  serviceSurface: "#f4f7f3",
  surfaceRaised: "#fafcf9",
};

const colorTokenKeys = Object.keys(defaultColorTokens) as Array<
  keyof StyleGuideColorTokens
>;

export const defaultStyleGuideTokenDraft: StyleGuideTokenDraft = {
  ...defaultColorTokens,
  activeButtonRadiusName: "radius-sm / radius-4",
  activeButtonRadiusValue: "4px",
  activeSurfaceRadiusName: "radius-md / radius-medium",
  activeSurfaceRadiusValue: "8px",
  activeBorderWidthName: "border-default",
  activeBorderWidthValue: "2px",
  activeCardGapName: "card-grid-gap-med",
  activeCardGapValue: "1rem",
  activeInlineGapName: "inline-gap-med",
  activeInlineGapValue: "1rem",
  activeLayoutGapName: "layout-gap-med",
  activeLayoutGapValue: "1rem",
  activeSectionMinName: "section-min-tiny",
  activeSectionMinValue: "18rem",
  activeSectionSpaceLrg: "8rem",
  activeSectionSpaceLrgMobile: "4rem",
  activeSectionSpaceLrgTablet: "6rem",
  activeSectionSpaceMed: "6rem",
  activeSectionSpaceMedMobile: "4rem",
  activeSectionSpaceMedTablet: "5rem",
  activeSectionSpaceName: "section-padding-default",
  activeSectionSpaceSml: "4rem",
  activeSectionSpaceSmlMobile: "4rem",
  activeSectionSpaceSmlTablet: "3.5rem",
  activeSectionSpaceVsml: "2rem",
  activeSectionSpaceVsmlMobile: "2rem",
  activeSectionSpaceVsmlTablet: "2rem",
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
  shadowAlpha: 0.08,
  shadowBlur: 50,
  shadowColor: "#17211d",
  shadowX: 0,
  shadowY: 18,
  typeBodyFontAssignment: "global",
  typeCustomFont: typePalettes[0].customFont ?? "",
  typeGlobalFont: typePalettes[0].globalFont,
  typeHeaderFontAssignment: "global",
  typeRoleOverrides: { ...typePalettes[0].roleFontOverrides },
  typeRoles: typePalettes[0].roles.map((role) => ({ ...role })),
  typeSelectedRoleId: typePalettes[0].roles[0]?.id ?? "",
  motionTokens: { ...defaultMotionTokens },
  buttonStyleSelection: { ...defaultButtonStyleSelection },
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

function hexToRgbChannels(value: string) {
  const normalizedValue = value.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(normalizedValue)) {
    return "23 33 29";
  }

  const red = Number.parseInt(normalizedValue.slice(0, 2), 16);
  const green = Number.parseInt(normalizedValue.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedValue.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function normalizeStyleGuideDraft(value: unknown): StyleGuideTokenDraft {
  const savedDraft =
    value && typeof value === "object"
      ? (value as Partial<StyleGuideTokenDraft>)
      : {};
  // Colors are flat keys on the draft. Anything that is not a string falls back
  // to the shipped default rather than riding through as a bad token value.
  const savedColorTokens = colorTokenKeys.reduce<Partial<StyleGuideColorTokens>>(
    (tokens, key) => {
      const tokenValue = savedDraft[key];

      if (typeof tokenValue === "string") {
        tokens[key] = tokenValue;
      }

      return tokens;
    },
    {},
  );

  // Drafts saved before the palette feature was removed carry two dead keys.
  // Drop them so they do not ride along and get written back to storage.
  const savedRest: Record<string, unknown> = { ...savedDraft };
  delete savedRest.activeColorPaletteId;
  delete savedRest.colorPaletteTokens;

  // Style guides saved while `border-none` was still an option carry a `0px`
  // width, which reads as a borderless site with no slider stop explaining it.
  // Snap those back to the thinnest real weight on load.
  const borderWidthOption = resolveBorderWidthOption(
    savedDraft.activeBorderWidthName,
    savedDraft.activeBorderWidthValue,
  );

  return {
    ...defaultStyleGuideTokenDraft,
    ...(savedRest as Partial<StyleGuideTokenDraft>),
    ...defaultColorTokens,
    ...savedColorTokens,
    activeBorderWidthName: borderWidthOption.name,
    activeBorderWidthValue: borderWidthOption.value,
    // Rebuilt from the registry rather than spread, because a spread would
    // replace the whole record: a draft saved before a motion token existed
    // would load that token as `undefined` and emit nothing for it. Same reason
    // the colour overhaul made its two new swatches optional - a saved state has
    // to keep loading, or an approved page's token set stops being reachable.
    motionTokens: normalizeMotionTokens(savedDraft.motionTokens),
    // Rebuilt for the same reason the motion record above is, and with one
    // addition: a saved id may name a style that has since been retired, or one
    // assigned to a slot it does not belong in. Both fall back to the shipped
    // assignment for that slot rather than emitting a set of tokens nobody
    // chose.
    buttonStyleSelection: normalizeButtonStyleSelection(
      savedDraft.buttonStyleSelection,
    ),
  };
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
  const serviceShadow =
    draft.shadowX === 0 && draft.shadowY === 0 && draft.shadowBlur === 0
      ? "none"
      : `${draft.shadowX}px ${draft.shadowY}px ${draft.shadowBlur}px rgb(${hexToRgbChannels(draft.shadowColor)} / ${draft.shadowAlpha})`;

  return {
    "--live-accent": draft.accent,
    "--live-accent-ink": draft.accentInk,
    "--live-accent-muted-text": draft.accentMutedText,
    "--live-bg-dark": draft.bgDark,
    "--live-bg-dark-surface":
      draft.bgDarkSurface || deriveDarkSurface(draft.bgDark),
    /**
     * Omitted, not emitted empty, when unset.
     *
     * An empty custom property is valid CSS but poisons every `var()` that
     * reads it - the referencing declaration goes invalid at computed-value
     * time and takes neither the value nor its own fallback. So an unset CTA
     * accent has to be an absent key, which lets `--palette-cta-accent` fall
     * back to brand as designed.
     */
    ...(draft.ctaAccent ? { "--live-cta-accent": draft.ctaAccent } : {}),
    // Derived from the surface, not from a shared border field. See
    // `derivedColorValues` for why these are CSS text rather than a resolved
    // value.
    "--live-bg-muted": derivedColorValues.bgMuted,
    "--live-bg-page": draft.bgPage,
    "--live-bg-surface": draft.serviceSurface,
    "--live-border-default": derivedColorValues.serviceBorder,
    "--live-service-accent": draft.serviceAccent,
    "--live-service-border": derivedColorValues.serviceBorder,
    "--live-service-border-light": derivedColorValues.serviceBorderLight,
    "--live-service-ink": draft.serviceInk,
    "--live-service-muted": draft.serviceMuted,
    "--live-service-surface": draft.serviceSurface,
    "--live-surface-raised": draft.surfaceRaised,
    "--live-text-accent": draft.serviceAccent,
    "--live-text-inverse": "#ffffff",
    "--live-text-main": draft.serviceInk,
    "--live-text-muted": draft.serviceMuted,
    "--card-grid-gap-active": draft.activeCardGapValue,
    "--inline-gap-active": draft.activeInlineGapValue,
    "--layout-gap-active": draft.activeLayoutGapValue,
    "--border-surface-width-token": draft.activeBorderWidthValue,
    "--section-min-active": draft.activeSectionMinValue,
    "--section-space-lrg": draft.activeSectionSpaceLrg,
    "--section-space-lrg-mobile": draft.activeSectionSpaceLrgMobile,
    "--section-space-lrg-tablet": draft.activeSectionSpaceLrgTablet,
    "--section-space-med": draft.activeSectionSpaceMed,
    "--section-space-med-mobile": draft.activeSectionSpaceMedMobile,
    "--section-space-med-tablet": draft.activeSectionSpaceMedTablet,
    "--section-space-sml": draft.activeSectionSpaceSml,
    "--section-space-sml-mobile": draft.activeSectionSpaceSmlMobile,
    "--section-space-sml-tablet": draft.activeSectionSpaceSmlTablet,
    "--section-space-vsml": draft.activeSectionSpaceVsml,
    "--section-space-vsml-mobile": draft.activeSectionSpaceVsmlMobile,
    "--section-space-vsml-tablet": draft.activeSectionSpaceVsmlTablet,
    "--semantic-spacing-scale": String(draft.activeSemanticSpacingScale),
    "--container-gutter": draft.activeContentFrameValue,
    "--site-grid-gap": draft.activeSiteGridGapValue,
    "--site-grid-inset-block": draft.activeSiteGridFrameBlock,
    "--site-grid-inset-inline": draft.activeSiteGridFrameInline,
    "--radius-lg-token": `${draft.radiusLg}px`,
    "--radius-md-token": `${draft.radiusMd}px`,
    "--radius-round-token": "9999px",
    "--radius-sm-token": `${draft.radiusSm}px`,
    "--radius-surface-token": draft.activeSurfaceRadiusValue,
    "--radius-button-token": draft.activeButtonRadiusValue,
    "--radius-xl-token": `${draft.radiusXl}px`,
    "--live-shadow-service": serviceShadow,
    "--shadow-service": serviceShadow,
    // The same declarations the promoted block emits, from the same function.
    // Everything the Style Guide renders sits inside this element, so the motion
    // gallery's specimens read the draft with no inline style of their own -
    // which is what replaced the gallery's private React state.
    ...Object.fromEntries(motionTokenDeclarations(draft.motionTokens)),
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
            ? normalizeStyleGuideDraft(JSON.parse(storedDraft))
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
    setDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  }

  function updateDrafts(updates: Partial<StyleGuideTokenDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...updates }));
  }

  function replaceDraft(next: StyleGuideTokenDraft) {
    // Merged over the defaults so a slot saved before a token was added still
    // loads, with the new token at its default rather than undefined. The
    // motion record is rebuilt rather than spread for the same reason, one level
    // down - a spread restores the whole record and takes any token the slot
    // predates with it.
    setDraft({
      ...defaultStyleGuideTokenDraft,
      ...next,
      motionTokens: normalizeMotionTokens(next.motionTokens),
      buttonStyleSelection: normalizeButtonStyleSelection(
        next.buttonStyleSelection,
      ),
    });
  }

  function resetDraft() {
    setDraft(defaultStyleGuideTokenDraft);
    window.localStorage.removeItem(styleGuideStorageKey);
  }

  return (
    <StyleGuideTokenContext.Provider
      value={{
        draft,
        replaceDraft,
        resetDraft,
        updateDraft,
        updateDrafts,
      }}
    >
      <div className={styleGuideButtonScope.slice(1)} style={previewStyle}>
        {/*
         * THE ONE AXIS THAT CANNOT RIDE THE INLINE STYLE ABOVE.
         *
         * Every other token is a single value that inherits, so one element's
         * `style` carries the whole draft. A button assignment is three
         * different answers resolving on three different elements at the same
         * time, which no inline style can express - and it cannot be flattened
         * to `:root`-style variables here either, for the reason the authored
         * block in `globals.css` documents at length: a custom property
         * substitutes its `var()`s where it is DECLARED, so a colour folded in
         * on this wrapper would freeze to this wrapper's ground and stop
         * answering to the recipe of whatever demo surface it lands on.
         *
         * So the preview emits the same rules the promotion emits, from the
         * same function, scoped to this element. Scoped means strictly more
         * specific than the promoted copy, so the draft wins here without
         * depending on source order - and wins nowhere else.
         */}
        <style>
          {buttonStyleCss(draft.buttonStyleSelection, {
            scope: styleGuideButtonScope,
          })}
        </style>
        {children}
      </div>
    </StyleGuideTokenContext.Provider>
  );
}

export function StyleGuidePreviewSurface({
  children,
}: StyleGuideLiveSurfaceProps) {
  return <>{children}</>;
}
