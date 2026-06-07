import type { Metadata } from "next";
import { PageworksPlaceholderSection } from "@/components/sections";

export const metadata: Metadata = {
  title: "Website Pages",
  description: "Staged pages eligible for public promotion.",
};

export default function WebsitePagesPage() {
  return (
    <main>
      <PageworksPlaceholderSection
        eyebrow="Pageworks Pipeline"
        title="Website Pages"
        body="A review surface for baked staged pages before they become public site pages."
        items={[
          "Review staged pages.",
          "Confirm styleguide and content promotion.",
          "Promote approved pages to public routes.",
        ]}
      />
    </main>
  );
}
