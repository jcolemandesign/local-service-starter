export type WrapMode = "balance" | "pretty" | "wrap";
export type CapitalizationStyle = "none" | "uppercase" | "lowercase" | "capitalize";

export type TypeRole = {
  id: string;
  token: string;
  role: string;
  sample: string;
  minRem: number;
  maxRem: number;
  lineHeight: number;
  weight: number;
  measureCh: number;
  wrap: WrapMode;
  letterSpacingEm: number;
  capitalization: CapitalizationStyle;
};

export type TypePalette = {
  id: string;
  label: string;
  description: string;
  customFont?: string;
  globalFont: string;
  roleFontOverrides: Record<string, string>;
  roles: TypeRole[];
};

export const fontStacks = {
  geistSans: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  systemSans: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
  aptos: "Aptos, Segoe UI, Arial, sans-serif",
  trebuchet: "Trebuchet MS, Arial, sans-serif",
  georgia: "Georgia, Times New Roman, serif",
  times: "Times New Roman, Times, serif",
} as const;

export const defaultTypeRoles: TypeRole[] = [
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

function updateRoles(
  updates: Record<string, Partial<Omit<TypeRole, "id" | "token" | "role" | "sample">>>,
) {
  return defaultTypeRoles.map((role) => ({
    ...role,
    ...(updates[role.id] ?? {}),
  }));
}

export const typePalettes: TypePalette[] = [
  {
    id: "geist-service",
    label: "Geist Service",
    description: "Current clean, flexible baseline for broad local service sites.",
    globalFont: fontStacks.geistSans,
    roleFontOverrides: {},
    roles: defaultTypeRoles,
  },
  {
    id: "editorial-trust",
    label: "Editorial Trust",
    description: "Serif display with calmer sans body for premium home services.",
    globalFont: fontStacks.systemSans,
    roleFontOverrides: {
      "display-xl": fontStacks.georgia,
      "display-lg": fontStacks.georgia,
      "heading-xl": fontStacks.georgia,
    },
    roles: updateRoles({
      "display-xl": {
        minRem: 3.75,
        maxRem: 7.25,
        lineHeight: 0.95,
        weight: 600,
        measureCh: 15,
      },
      "display-lg": {
        minRem: 2.875,
        maxRem: 5.75,
        lineHeight: 0.98,
        weight: 600,
      },
      "heading-xl": {
        lineHeight: 1.04,
        weight: 600,
      },
      label: {
        weight: 700,
        letterSpacingEm: 0.14,
      },
    }),
  },
  {
    id: "utility-dense",
    label: "Utility Dense",
    description: "Tighter, operational rhythm for dashboards and lead-heavy pages.",
    globalFont: fontStacks.aptos,
    roleFontOverrides: {},
    roles: updateRoles({
      "display-xl": {
        minRem: 3.25,
        maxRem: 6.25,
        lineHeight: 0.96,
        weight: 720,
        measureCh: 16,
      },
      "display-lg": {
        minRem: 2.5,
        maxRem: 4.875,
        lineHeight: 1,
        weight: 700,
      },
      "heading-xl": {
        maxRem: 3.5,
        lineHeight: 1.05,
        weight: 700,
      },
      "text-xl": {
        maxRem: 1.375,
        lineHeight: 1.45,
      },
      "text-md": {
        maxRem: 1.0625,
        lineHeight: 1.55,
      },
      label: {
        letterSpacingEm: 0.1,
      },
    }),
  },
  {
    id: "friendly-local",
    label: "Friendly Local",
    description: "Warmer system-stack feel for approachable neighborhood brands.",
    globalFont: fontStacks.trebuchet,
    roleFontOverrides: {},
    roles: updateRoles({
      "display-xl": {
        minRem: 3.25,
        maxRem: 6.5,
        lineHeight: 0.98,
        weight: 700,
        measureCh: 15,
      },
      "display-lg": {
        lineHeight: 1,
        weight: 700,
      },
      "heading-xl": {
        lineHeight: 1.04,
        weight: 700,
      },
      "heading-sm": {
        weight: 700,
      },
      "text-lg": {
        lineHeight: 1.55,
      },
      label: {
        letterSpacingEm: 0.08,
      },
    }),
  },
];
