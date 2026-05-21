import { Container } from "@/components/primitives";

type FooterSectionProps = {
  businessName: string;
  tagline: string;
  links: string[];
};

export function FooterSection({ businessName, tagline, links }: FooterSectionProps) {
  return (
    <footer className="bg-service-ink py-12 text-white">
      <Container>
        <div className="flex items-center justify-between gap-8 max-md:flex-col max-md:items-start">
          <div>
            <p className="text-xl font-semibold">{businessName}</p>
            <p className="mt-2 text-sm leading-6 text-white/70">{tagline}</p>
          </div>
          <nav aria-label="Footer preview navigation">
            <ul className="flex flex-wrap gap-5 text-sm font-medium text-white/75">
              {links.map((link) => (
                <li key={link}>
                  <a className="cursor-pointer transition-colors hover:text-white" href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
