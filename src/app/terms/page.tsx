import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Website Terms | Local Service Starter",
  description: "Website terms for a local service business website.",
};

const sections = [
  {
    title: "Website Information",
    paragraphs: [
      "This website provides general information about [Business Name], its services, service areas, and ways to contact the business.",
      "Website content may change over time and may not always reflect the most current availability, pricing, or service details.",
    ],
  },
  {
    title: "Service Requests",
    paragraphs: [
      "Submitting a form or request through this website does not guarantee appointment availability, service acceptance, or a specific response time.",
      "For urgent or emergency service, users should call the business directly instead of relying only on a website form.",
    ],
  },
  {
    title: "Estimates and Recommendations",
    paragraphs: [
      "Any estimates, pricing, timelines, or recommendations shown on the website or discussed before a visit are subject to inspection and confirmation.",
      "Final recommendations may depend on site conditions, equipment condition, parts availability, safety requirements, and other factors.",
    ],
  },
  {
    title: "Third-Party Links",
    paragraphs: [
      "This website may include links to third-party websites or services.",
      "[Business Name] is not responsible for the content, policies, or practices of third-party websites.",
    ],
  },
  {
    title: "Contact",
    paragraphs: [
      "Questions about these website terms can be sent to [business email].",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      intro="These simple terms explain how visitors may use this local service business website."
      sections={sections}
      title="Website Terms"
    />
  );
}
