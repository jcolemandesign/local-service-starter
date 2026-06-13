import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

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
};

const globalsPath = path.join(process.cwd(), "src", "app", "globals.css");
const beginMarker = "/* BEGIN PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const endMarker = "/* END PAGEWORKS STYLEGUIDE TOKEN OVERRIDES */";
const colorPattern = /^#[0-9a-fA-F]{6}$/;

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
      0.75,
      1.35,
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

function normalizeBorderWidth(value: unknown) {
  if (
    typeof value !== "string" ||
    !/^(0|0\.5|1|2)px$/.test(value)
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

function hexToRgbChannels(value: string) {
  const normalizedValue = value.replace("#", "");
  const red = Number.parseInt(normalizedValue.slice(0, 2), 16);
  const green = Number.parseInt(normalizedValue.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedValue.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function buildOverrideBlock(tokens: StyleGuideTokenDraft) {
  return `${beginMarker}
:root {
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
  --shadow-service: ${tokens.shadowX}px ${tokens.shadowY}px ${tokens.shadowBlur}px rgb(${hexToRgbChannels(tokens.shadowColor)} / ${tokens.shadowAlpha});
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
