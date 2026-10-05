import { Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export type LegalSection = { id: string; title: string; paragraphs: string[] };

export function LegalDoc({
  kicker,
  title,
  lede,
  updated,
  sections,
}: {
  kicker: string;
  title: string;
  lede: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs tracking-[0.18em] text-primary uppercase">{kicker}</p>
          <p className="mt-2 text-sm text-muted">Updated {updated}</p>
          <nav className="mt-4 hidden flex-col gap-2 text-sm lg:flex">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="text-muted hover:text-ink">
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="max-w-3xl">
          <h1 className="text-5xl">{title}</h1>
          <p className="mt-4 text-muted">{lede}</p>
          <p className="mt-4 text-sm">
            Related: <Link to="/guidelines" className="text-primary">Guidelines</Link>
            {" · "}
            <Link to="/privacy" className="text-primary">Privacy</Link>
            {" · "}
            <Link to="/terms" className="text-primary">Terms</Link>
          </p>
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
              <h2 className="text-2xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="mt-3 text-sm leading-relaxed">{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </Shell>
  );
}
