import {
  Archivo_Black,
  Brawler,
  DM_Mono,
  DM_Sans,
  Geist,
  Geist_Mono,
  Host_Grotesk,
  Inter,
  Libre_Franklin,
  Noto_Sans,
  Raleway,
  Spline_Sans,
  Spline_Sans_Mono,
} from "next/font/google";

export const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const notoSans = Noto_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-noto-sans",
});

export const brawler = Brawler({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-brawler",
  weight: ["400", "700"],
});

export const splineSans = Spline_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-spline-sans",
});

export const splineSansMono = Spline_Sans_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-spline-sans-mono",
});

export const archivoBlack = Archivo_Black({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-archivo-black",
  weight: "400",
});

export const raleway = Raleway({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-raleway",
});

export const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-inter",
});

export const libreFranklin = Libre_Franklin({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-libre-franklin",
});

export const hostGrotesk = Host_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-host-grotesk",
});

export const dmSans = DM_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-dm-sans",
});

export const dmMono = DM_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dev-dm-mono",
  weight: ["400", "500"],
});

export const rootFontVariables = [
  geistSans.variable,
  geistMono.variable,
  notoSans.variable,
  brawler.variable,
  splineSans.variable,
  splineSansMono.variable,
  archivoBlack.variable,
  raleway.variable,
  inter.variable,
  libreFranklin.variable,
  hostGrotesk.variable,
  dmSans.variable,
  dmMono.variable,
].join(" ");

export const designLabFontSpecimens = [
  {
    name: "Noto Sans",
    suggestedUse: "Durable body and UI baseline with broad neutral coverage.",
    variable: "--font-dev-noto-sans",
  },
  {
    name: "Brawler",
    suggestedUse: "Editorial headings, trust stories, and warmer local service tone.",
    variable: "--font-dev-brawler",
  },
  {
    name: "Spline Sans",
    suggestedUse: "Technical service pages, clean headers, and readable body systems.",
    variable: "--font-dev-spline-sans",
  },
  {
    name: "Spline Sans Mono",
    suggestedUse: "Specs, labels, process metadata, and utility details.",
    variable: "--font-dev-spline-sans-mono",
  },
  {
    name: "Archivo Black",
    suggestedUse: "Loud hero headlines, offer moments, and punchy display accents.",
    variable: "--font-dev-archivo-black",
  },
  {
    name: "Raleway",
    suggestedUse: "Polished headings and lighter premium service positioning.",
    variable: "--font-dev-raleway",
  },
  {
    name: "Inter",
    suggestedUse: "Highly legible UI, forms, nav, and practical body copy.",
    variable: "--font-dev-inter",
  },
  {
    name: "Libre Franklin",
    suggestedUse: "Editorial service pages with sturdy headlines and readable body text.",
    variable: "--font-dev-libre-franklin",
  },
  {
    name: "Host Grotesk",
    suggestedUse: "Modern local brands, nav systems, and confident section titles.",
    variable: "--font-dev-host-grotesk",
  },
  {
    name: "DM Sans",
    suggestedUse: "Friendly SaaS-like service pages, cards, and conversion UI.",
    variable: "--font-dev-dm-sans",
  },
  {
    name: "DM Mono",
    suggestedUse: "Small technical labels, pricing details, and diagnostic notes.",
    variable: "--font-dev-dm-mono",
  },
];
