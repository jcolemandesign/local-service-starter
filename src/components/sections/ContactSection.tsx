import { Card, Container, Section, SectionHeading } from "@/components/primitives";

type ContactSectionProps = {
  eyebrow: string;
  title: string;
  body: string;
  details: string[];
};

export function ContactSection({ eyebrow, title, body, details }: ContactSectionProps) {
  return (
    <Section id="contact" className="bg-white">
      <Container>
        <div className="grid grid-cols-2 gap-12 max-lg:grid-cols-1">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} body={body} />
            <ul className="mt-8 space-y-3">
              {details.map((detail) => (
                <li className="text-base font-medium text-service-ink" key={detail}>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-7">
            <form className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-service-ink">
                Name
                <input
                  className="min-h-12 rounded-md border border-service-border px-4 text-base font-normal outline-none focus:border-service-accent"
                  placeholder="Jane Smith"
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-service-ink">
                Service needed
                <input
                  className="min-h-12 rounded-md border border-service-border px-4 text-base font-normal outline-none focus:border-service-accent"
                  placeholder="Repair, installation, maintenance"
                  type="text"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-service-ink">
                Message
                <textarea
                  className="min-h-32 rounded-md border border-service-border px-4 py-3 text-base font-normal outline-none focus:border-service-accent"
                  placeholder="Briefly describe the issue"
                />
              </label>
              <button
                className="min-h-12 cursor-pointer rounded-md bg-service-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-service-ink"
                type="button"
              >
                Submit preview
              </button>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
