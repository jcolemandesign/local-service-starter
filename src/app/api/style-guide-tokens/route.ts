import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type CapitalizationStyle,
  type TypeRole,
  type WrapMode,
  fontStacks,
  typePalettes,
} from "@/content/type-palettes";

export const runtime = "nodejs";

type StyleGuideTokenDraft = {
  serviceInk: string;
  serviceMuted: string;
  serviceAccent: string;
  serviceSurface: string;
  serviceBorder: string;
  bgPage: string;
  bgDark: string;
  accent: string;
  activeCardGapValue: string;
  activeInlineGapValue: string;
  activeLayoutGapValue: string;
  activeBorderWidthValue: string;
  activeButtonRadiusValue: string;
  activeSurfaceRadiusValue: string;
  activeSectionMinValue: string;
  activeSectionSpaceLrg: string;
  activeSectionSpaceLrgMobile: string;
  activeSectionSpaceLrgTablet: string;
  activeSectionSpaceMed: string;
  activeSectionSpaceMedMobile: string;
  activeSectionSpaceMedTablet: string;
  activeSectionSpaceSml: string;
  activeSectionSpaceSmlMobile: string;
  activeSectionSpaceSmlTablet: string;
  activeSectionSpaceVsml: string;
  activeSectionSpaceVsmlMobile: string;
  activeSectionSpaceVsmlTablet: string;
  activeSemanticSpacingScale: number;
  activeContentFrameValue: string;
  activeSiteGridFrameBlock: string;
  activeSiteGridFrameInline: string;
  activeSiteGridGapValue: string;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  radiusXl: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  shadowAlpha: number;
  typeCustomFont: string;
  typeGlobalFont: string;
  typeRoleOverrides: Record<string, string>;
  typeRoles: TypeRole[];
};

const globalsPath = path.join(process.cwd(), "src", "app", "globals.css");
const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const colorPattern = /^#[0-9a-fA-F]{6}$/;
const defaultTypeRoles = typePalettes[0].roles;
const allowedFontStacks = new Set<string>(Object.values(fontStacks));

export async function POST(request: Request) {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ROUTES !== "true"
  ) {
    return jsonError("Styleguide token promotion is disabled in production.", 403);
  }

  let body: { tokens?: Partial<StyleGuideTokenDraft> };

  try {
    body = (await request.json()) as { tokens?: Partial<StyleGuideTokenDraft> };
  } catch {
    return jsonError("Invalid request body.", 400);
  }

  try {
    const tokens = normalizeTokens(body.tokens);
    const block = buildOverrideBlock(tokens);
    const currentCss = await readFile(globalsPath, "utf8");
    const nextCss = replaceOverrideBlock(currentCss, block);

    await writeFile(globalsPath, nextCss);

    return Response.json({ ok: true, block });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Token promotion failed.",
      400,
    );
  }
}

function normalizeTokens(tokens: Partial<StyleGuideTokenDraft> | undefined) {
  if (!tokens) {
    throw new Error("Missing token payload.");
  }

  return {
    serviceInk: normalizeColor(tokens.serviceInk, "service ink"),
    serviceMuted: normalizeColor(tokens.serviceMuted, "service muted"),
    serviceAccent: normalizeColor(tokens.serviceAccent, "service accent"),
    serviceSurface: normalizeColor(tokens.serviceSurface, "service surface"),
    serviceBorder: normalizeColor(tokens.serviceBorder, "service border"),
    bgPage: normalizeColor(tokens.bgPage, "page background"),
    bgDark: normalizeColor(tokens.bgDark, "dark background"),
    accent: normalizeColor(tokens.accent, "warm accent"),
    activeCardGapValue: normalizeSpacingValue(tokens.activeCardGapValue, "card gap"),
    activeInlineGapValue: normalizeSpacingValue(
      tokens.activeInlineGapValue,
      "inline gap",
    ),
    activeLayoutGapValue: normalizeSpacingValue(
      tokens.activeLayoutGapValue,
      "layout gap",
    ),
    activeBorderWidthValue: normalizeBorderWidth(
      tokens.activeBorderWidthValue,
    ),
    activeButtonRadiusValue: normalizeRadiusValue(
      tokens.activeButtonRadiusValue,
      "button radius",
    ),
    activeSurfaceRadiusValue: normalizeRadiusValue(
      tokens.activeSurfaceRadiusValue,
      "surface radius",
    ),
    activeSectionMinValue: normalizeSectionMinValue(
      tokens.activeSectionMinValue,
    ),
    activeSectionSpaceLrg: normalizeSpacingValue(
      tokens.activeSectionSpaceLrg,
      "large section padding",
    ),
    activeSectionSpaceLrgMobile: normalizeSpacingValue(
      tokens.activeSectionSpaceLrgMobile,
      "large mobile section padding",
    ),
    activeSectionSpaceLrgTablet: normalizeSpacingValue(
      tokens.activeSectionSpaceLrgTablet,
      "large tablet section padding",
    ),
    activeSectionSpaceMed: normalizeSpacingValue(
      tokens.activeSectionSpaceMed,
      "medium section padding",
    ),
    activeSectionSpaceMedMobile: normalizeSpacingValue(
      tokens.activeSectionSpaceMedMobile,
      "medium mobile section padding",
    ),
    activeSectionSpaceMedTablet: normalizeSpacingValue(
      tokens.activeSectionSpaceMedTablet,
      "medium tablet section padding",
    ),
    activeSectionSpaceSml: normalizeSpacingValue(
      tokens.activeSectionSpaceSml,
      "small section padding",
    ),
    activeSectionSpaceSmlMobile: normalizeSpacingValue(
      tokens.activeSectionSpaceSmlMobile,
      "small mobile section padding",
    ),
    activeSectionSpaceSmlTablet: normalizeSpacingValue(
      tokens.activeSectionSpaceSmlTablet,
      "small tablet section padding",
    ),
    activeSectionSpaceVsml: normalizeSpacingValue(
      tokens.activeSectionSpaceVsml,
      "very small section padding",
    ),
    activeSectionSpaceVsmlMobile: normalizeSpacingValue(
      tokens.activeSectionSpaceVsmlMobile,
      "very small mobile section padding",
    ),
    activeSectionSpaceVsmlTablet: normalizeSpacingValue(
      tokens.activeSectionSpaceVsmlTablet,
      "very small tablet section padding",
    ),
    activeSemanticSpacingScale: normalizeNumber(
      tokens.activeSemanticSpacingScale,
      "semantic spacing scale",
      0.5,
      1.5,
    ),
    activeContentFrameValue: normalizeSpacingValue(
      tokens.activeContentFrameValue,
      "content padding",
    ),
    activeSiteGridFrameBlock: normalizeSpacingValue(
      tokens.activeSiteGridFrameBlock,
      "site grid block padding",
    ),
    activeSiteGridFrameInline: normalizeSpacingValue(
      tokens.activeSiteGridFrameInline,
      "site grid inline padding",
    ),
    activeSiteGridGapValue: normalizeSpacingValue(
      tokens.activeSiteGridGapValue,
      "site grid gap",
    ),
    radiusSm: normalizeNumber(tokens.radiusSm, "small radius", 0, 16),
    radiusMd: normalizeNumber(tokens.radiusMd, "medium radius", 0, 24),
    radiusLg: normalizeNumber(tokens.radiusLg, "large radius", 8, 40),
    radiusXl: normalizeNumber(tokens.radiusXl, "extra large radius", 16, 80),
    shadowX: normalizeNumber(tokens.shadowX, "shadow x", -40, 40),
    shadowY: normalizeNumber(tokens.shadowY, "shadow y", -40, 40),
    shadowBlur: normalizeNumber(tokens.shadowBlur, "shadow blur", 0, 80),
    shadowColor: normalizeColor(tokens.shadowColor, "shadow"),
    shadowAlpha: normalizeNumber(tokens.shadowAlpha, "shadow alpha", 0, 0.25),
    typeCustomFont: normalizeFontFamilyName(tokens.typeCustomFont),
    typeGlobalFont: normalizeFontChoice(tokens.typeGlobalFont, false),
    typeRoleOverrides: normalizeTypeRoleOverrides(tokens.typeRoleOverrides),
    typeRoles: normalizeTypeRoles(tokens.typeRoles),
  };
}

function normalizeColor(value: unknown, label: string) {
  if (typeof value !== "string" || !colorPattern.test(value)) {
    throw new Error(`Invalid ${label} color.`);
  }

  return value.toLowerCase();
}

function normalizeNumber(
  value: unknown,
  label: string,
  min: number,
  max: number,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid ${label}.`);
  }

  return Math.min(max, Math.max(min, value));
}

function normalizeOptionalNumber(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

function normalizeBorderWidth(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^(0|0\.5|1|2|3)px$/.test(value)
  ) {
    throw new Error("Invalid border width.");
  }

  return value;
}

function normalizeRadiusValue(value: unknown, label: string) {
  if (
    typeof value !== "string" ||
    !/^(?:0|(?:2|4|8|24|40|9999)px)$/.test(value)
  ) {
    throw new Error(`Invalid ${label} value.`);
  }

  return value;
}

function normalizeSpacingValue(value: unknown, label: string) {
  if (
    typeof value !== "string" ||
    !/^(?:\d+(?:\.\d+)?rem|clamp\([^)]+\))$/.test(value)
  ) {
    throw new Error(`Invalid ${label}.`);
  }

  return value;
}

function normalizeSectionMinValue(value: unknown) {
  if (typeof value !== "string" || !/^(?:0|\d+rem|\d+svh)$/.test(value)) {
    throw new Error("Invalid section minimum height.");
  }

  return value;
}

function normalizeWrap(value: unknown, fallback: WrapMode) {
  return value === "balance" || value === "pretty" || value === "wrap"
    ? value
    : fallback;
}

function normalizeCapitalization(
  value: unknown,
  fallback: CapitalizationStyle,
) {
  return value === "none" ||
    value === "uppercase" ||
    value === "lowercase" ||
    value === "capitalize"
    ? value
    : fallback;
}

function normalizeFontFamilyName(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[";{}]/g, "").trim().slice(0, 80);
}

function normalizeFontChoice(value: unknown, allowGlobal: boolean) {
  if (allowGlobal && value === "global") {
    return "global";
  }

  if (typeof value !== "string") {
    return typePalettes[0].globalFont;
  }

  if (value === "custom") {
    return "custom";
  }

  if (allowedFontStacks.has(value)) {
    return value;
  }

  if (value.startsWith("local:")) {
    const family = normalizeFontFamilyName(value.replace("local:", ""));

    return family ? `local:${family}` : typePalettes[0].globalFont;
  }

  return typePalettes[0].globalFont;
}

function normalizeTypeRoleOverrides(value: unknown) {
  const overrides: Record<string, string> = {};

  if (!value || typeof value !== "object") {
    return overrides;
  }

  const overrideRecord = value as Record<string, unknown>;

  for (const role of defaultTypeRoles) {
    const override = overrideRecord[role.id];

    if (override !== undefined) {
      overrides[role.id] = normalizeFontChoice(override, true);
    }
  }

  return overrides;
}

function normalizeTypeRoles(value: unknown) {
  const roleInputs = Array.isArray(value) ? value : [];
  const roleInputMap = new Map<string, Record<string, unknown>>();

  for (const roleInput of roleInputs) {
    if (!roleInput || typeof roleInput !== "object") {
      continue;
    }

    const roleRecord = roleInput as Record<string, unknown>;

    if (typeof roleRecord.id === "string") {
      roleInputMap.set(roleRecord.id, roleRecord);
    }
  }

  return defaultTypeRoles.map((role) => {
    const roleInput = roleInputMap.get(role.id);

    if (!roleInput) {
      return { ...role };
    }

    return {
      ...role,
      capitalization: normalizeCapitalization(
        roleInput.capitalization,
        role.capitalization,
      ),
      letterSpacingEm: normalizeOptionalNumber(
        roleInput.letterSpacingEm,
        role.letterSpacingEm,
        -0.12,
        0.18,
      ),
      lineHeight: normalizeOptionalNumber(
        roleInput.lineHeight,
        role.lineHeight,
        0.8,
        2,
      ),
      maxRem: normalizeOptionalNumber(roleInput.maxRem, role.maxRem, 0.5, 9),
      measureCh: normalizeOptionalNumber(
        roleInput.measureCh,
        role.measureCh,
        14,
        90,
      ),
      minRem: normalizeOptionalNumber(roleInput.minRem, role.minRem, 0.5, 8),
      weight: normalizeOptionalNumber(roleInput.weight, role.weight, 300, 900),
      wrap: normalizeWrap(roleInput.wrap, role.wrap),
    };
  });
}

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
    const family = normalizeFontFamilyName(value.replace("local:", ""));

    return family
      ? `"${family.replaceAll('"', '\\"')}", ${typePalettes[0].globalFont}`
      : typePalettes[0].globalFont;
  }

  if (value !== "custom") {
    return value;
  }

  return customFont
    ? `"${customFont.replaceAll('"', '\\"')}", ${typePalettes[0].globalFont}`
    : typePalettes[0].globalFont;
}

function textTransformForRole(role: TypeRole) {
  return role.capitalization === "none" ? "none" : role.capitalization;
}

function typeVariableLines(tokens: StyleGuideTokenDraft) {
  return tokens.typeRoles.flatMap((role) => {
    const override = tokens.typeRoleOverrides[role.id] ?? "global";
    const fontFamily =
      override === "global"
        ? fontFamilyForValue(tokens.typeGlobalFont, tokens.typeCustomFont)
        : fontFamilyForValue(override, tokens.typeCustomFont);
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
    ].map(([name, tokenValue]) => `  ${name}: ${tokenValue};`);
  });
}

function hexToRgbChannels(value: string) {
  const normalizedValue = value.replace("#", "");
  const red = Number.parseInt(normalizedValue.slice(0, 2), 16);
  const green = Number.parseInt(normalizedValue.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedValue.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function buildOverrideBlock(tokens: StyleGuideTokenDraft) {
  const serviceShadow = `${tokens.shadowX}px ${tokens.shadowY}px ${tokens.shadowBlur}px rgb(${hexToRgbChannels(tokens.shadowColor)} / ${tokens.shadowAlpha})`;
  const typeVariables = typeVariableLines(tokens).join("\n");

  return `${beginMarker}
:root {
  --live-service-ink: ${tokens.serviceInk};
  --live-service-muted: ${tokens.serviceMuted};
  --live-service-accent: ${tokens.serviceAccent};
  --live-service-surface: ${tokens.serviceSurface};
  --live-service-border: ${tokens.serviceBorder};
  --live-bg-page: ${tokens.bgPage};
  --live-bg-surface: ${tokens.serviceSurface};
  --live-bg-muted: ${tokens.serviceBorder};
  --live-bg-dark: ${tokens.bgDark};
  --live-text-main: ${tokens.serviceInk};
  --live-text-muted: ${tokens.serviceMuted};
  --live-text-accent: ${tokens.serviceAccent};
  --live-border-default: ${tokens.serviceBorder};
  --live-accent: ${tokens.accent};
  --live-shadow-service: ${serviceShadow};
  --color-service-ink: ${tokens.serviceInk};
  --color-service-muted: ${tokens.serviceMuted};
  --color-service-accent: ${tokens.serviceAccent};
  --color-service-surface: ${tokens.serviceSurface};
  --color-service-border: ${tokens.serviceBorder};
  --color-bg-page: ${tokens.bgPage};
  --color-bg-surface: ${tokens.serviceSurface};
  --color-bg-muted: ${tokens.serviceBorder};
  --color-bg-dark: ${tokens.bgDark};
  --color-text-main: ${tokens.serviceInk};
  --color-text-muted: ${tokens.serviceMuted};
  --color-text-inverse: #ffffff;
  --color-text-accent: ${tokens.serviceAccent};
  --color-border-default: ${tokens.serviceBorder};
  --color-accent: ${tokens.accent};
  --card-grid-gap-active: ${tokens.activeCardGapValue};
  --inline-gap-active: ${tokens.activeInlineGapValue};
  --layout-gap-active: ${tokens.activeLayoutGapValue};
  --border-surface-width-token: ${tokens.activeBorderWidthValue};
  --radius-sm-token: ${tokens.radiusSm}px;
  --radius-md-token: ${tokens.radiusMd}px;
  --radius-lg-token: ${tokens.radiusLg}px;
  --radius-xl-token: ${tokens.radiusXl}px;
  --radius-round-token: 9999px;
  --radius-surface-token: ${tokens.activeSurfaceRadiusValue};
  --radius-button-token: ${tokens.activeButtonRadiusValue};
  --section-min-active: ${tokens.activeSectionMinValue};
  --section-space-vsml: ${tokens.activeSectionSpaceVsml};
  --section-space-sml: ${tokens.activeSectionSpaceSml};
  --section-space-med: ${tokens.activeSectionSpaceMed};
  --section-space-lrg: ${tokens.activeSectionSpaceLrg};
  --section-space-vsml-tablet: ${tokens.activeSectionSpaceVsmlTablet};
  --section-space-sml-tablet: ${tokens.activeSectionSpaceSmlTablet};
  --section-space-med-tablet: ${tokens.activeSectionSpaceMedTablet};
  --section-space-lrg-tablet: ${tokens.activeSectionSpaceLrgTablet};
  --section-space-vsml-mobile: ${tokens.activeSectionSpaceVsmlMobile};
  --section-space-sml-mobile: ${tokens.activeSectionSpaceSmlMobile};
  --section-space-med-mobile: ${tokens.activeSectionSpaceMedMobile};
  --section-space-lrg-mobile: ${tokens.activeSectionSpaceLrgMobile};
  --semantic-spacing-scale: ${tokens.activeSemanticSpacingScale};
  --container-gutter: ${tokens.activeContentFrameValue};
  --site-grid-inset-block: ${tokens.activeSiteGridFrameBlock};
  --site-grid-inset-inline: ${tokens.activeSiteGridFrameInline};
  --site-grid-gap: ${tokens.activeSiteGridGapValue};
  --shadow-service: ${serviceShadow};
${typeVariables}
}
${endMarker}`;
}

function replaceOverrideBlock(css: string, block: string) {
  const beginIndex = css.indexOf(beginMarker);
  const endIndex = css.indexOf(endMarker);

  if (beginIndex >= 0 && endIndex >= beginIndex) {
    return `${css.slice(0, beginIndex).trimEnd()}\n\n${block}\n${css
      .slice(endIndex + endMarker.length)
      .trimStart()}`;
  }

  return `${css.trimEnd()}\n\n${block}\n`;
}

function jsonError(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}
