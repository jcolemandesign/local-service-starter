import type { Metadata } from "next";
import { FontLabSection } from "@/components/sections/FontLabSection";

export const metadata: Metadata = {
  title: "Deprecated Font Lab",
  description:
    "Deprecated internal font lab, marked for deletion after the next commit.",
};

export default function FontLabPage() {
  return (
    <main className="bg-service-surface text-service-ink">
      <section className="border-b border-service-border bg-white">
        <div className="container-site py-4">
          <p className="type-caption font-semibold text-service-muted">
            Deprecated: Font Lab has been recreated in the Style Guide and is
            marked for deletion after the next commit.
          </p>
          <a
            className="type-caption mt-2 inline-flex font-semibold text-service-accent underline underline-offset-4"
            href="/dev/style-guide#typographic-hierarchy"
          >
            Open Style Guide typography controls
          </a>
        </div>
      </section>
      <FontLabSection />
    </main>
  );
}
