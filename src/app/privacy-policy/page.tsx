import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Local Service Starter",
  description: "Privacy policy for a local service business website.",
};

const sections = [
  {
    title: "Effective Date",
    paragraphs: ["[Effective Date]"],
  },
  {
    title: "Information We Collect",
    paragraphs: [
      "This website may collect contact and request information when visitors fill out forms, request service, or contact the business.",
    ],
    items: [
      "name",
      "phone number",
      "email address",
      "address or ZIP code",
      "service request details",
      "preferred contact method",
    ],
  },
  {
    title: "How Information Is Used",
    paragraphs: [
      "Information is used to respond to service requests, schedule follow-ups, communicate with customers, improve the website, and operate the business.",
      "We may also use request details to understand what services visitors are looking for and to improve the customer experience.",
    ],
  },
  {
    title: "Analytics and Site Improvement",
    paragraphs: [
      "This website may use basic analytics or similar tools to understand site traffic, page usage, and general website performance.",
      "Analytics information helps improve the website and make it easier for visitors to find service information.",
    ],
  },
  {
    title: "Cookies and Similar Technologies",
    paragraphs: [
      "This site may use cookies, local storage, or similar technologies for basic functionality, analytics, and improving the website experience.",
      "These tools may help remember site preferences, understand traffic patterns, or support reliable form and website behavior.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "Third-party services may be used to operate this website, such as hosting, database or form tools, analytics, email or automation services, and similar service providers.",
      "These providers may process information only as needed to provide their services to the business.",
    ],
  },
  {
    title: "Information Sharing",
    paragraphs: [
      "Visitor information is not sold.",
      "Information may be shared with service providers that help operate the website or business, or when required by law.",
    ],
  },
  {
    title: "Questions About Your Information",
    paragraphs: [
      "Visitors can contact the business to ask about their information or request updates where appropriate.",
      "Contact: [business email]",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      intro="This plain-English policy explains how a local service business website may collect and use visitor information."
      sections={sections}
      title="Privacy Policy"
    />
  );
}
