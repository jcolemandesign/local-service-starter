import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type StyleGuideTokenDraft = {
  serviceInk: string;
  serviceMuted: string;
  serviceAccent: string;
  serviceSurface: string;
  serviceBorder: string;
  bgDark: string;
  accent: string;
  activeBorderWidthValue: string;
  radiusSm: number;
  radiusMd: number;
  radiusLg: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
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
    bgDark: normalizeColor(tokens.bgDark, "dark background"),
    accent: normalizeColor(tokens.accent, "warm accent"),
    activeBorderWidthValue: normalizeBorderWidth(
      tokens.activeBorderWidthValue,
    ),
    radiusSm: normalizeNumber(tokens.radiusSm, "small radius", 0, 16),
    radiusMd: normalizeNumber(tokens.radiusMd, "medium radius", 0, 24),
    radiusLg: normalizeNumber(tokens.radiusLg, "large radius", 8, 40),
    shadowX: normalizeNumber(tokens.shadowX, "shadow x", -40, 40),
    shadowY: normalizeNumber(tokens.shadowY, "shadow y", -40, 40),
    shadowBlur: normalizeNumber(tokens.shadowBlur, "shadow blur", 0, 80),
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

function buildOverrideBlock(tokens: StyleGuideTokenDraft) {
  return `${beginMarker}
:root {
  --color-service-ink: ${tokens.serviceInk};
  --color-service-muted: ${tokens.serviceMuted};
  --color-service-accent: ${tokens.serviceAccent};
  --color-service-surface: ${tokens.serviceSurface};
  --color-service-border: ${tokens.serviceBorder};
  --color-bg-page: #ffffff;
  --color-bg-surface: ${tokens.serviceSurface};
  --color-bg-muted: ${tokens.serviceBorder};
  --color-bg-dark: ${tokens.bgDark};
  --color-text-main: ${tokens.serviceInk};
  --color-text-muted: ${tokens.serviceMuted};
  --color-text-inverse: #ffffff;
  --color-text-accent: ${tokens.serviceAccent};
  --color-border-default: ${tokens.serviceBorder};
  --color-accent: ${tokens.accent};
  --border-surface-width-token: ${tokens.activeBorderWidthValue};
  --radius-sm-token: ${tokens.radiusSm}px;
  --radius-md-token: ${tokens.radiusMd}px;
  --radius-lg-token: ${tokens.radiusLg}px;
  --shadow-service: ${tokens.shadowX}px ${tokens.shadowY}px ${tokens.shadowBlur}px rgb(23 33 29 / ${tokens.shadowAlpha});
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
