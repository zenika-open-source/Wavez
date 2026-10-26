import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Documentation · Wavez",
  description: "Source code, license and project information for Wavez.",
};

const REPO_URL = "https://github.com/zenika-open-source/Zenflow";
const LICENSE_URL = "https://github.com/zenika-open-source/Zenflow/blob/main/LICENSE";

const SECTIONS = [
  { id: "source-code", label: "Source code" },
  { id: "license", label: "License" },
];

const externalLink = "font-semibold text-accent underline hover:text-accent-strong";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-page font-sans text-text">
      <SiteHeader />

      <main className="wz-layout-gutter mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 py-8 pb-16 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Link href="/" className="text-sm font-semibold text-accent hover:text-accent-strong">
            ← Back to generator
          </Link>
          <nav aria-label="On this page" className="mt-6 hidden lg:block">
            <p className="font-mono text-xs tracking-wider text-text-muted uppercase">On this page</p>
            <ul className="mt-3 flex flex-col gap-1 border-l border-border">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-text-soft hover:border-accent hover:text-accent"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="max-w-3xl min-w-0">
          <p className="font-mono text-sm text-accent">Documentation</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-bold tracking-tight text-text">
            About Wavez
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-soft">
            Wavez generates agent skills for your AI assistant. This page gathers everything you need to find the
            source code and understand how the project is licensed.
          </p>

          <section id="source-code" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">Source code</h2>
            <p className="mt-3 leading-relaxed text-text-soft">
              Wavez is developed in the open. Browse the code, report an issue or contribute on GitHub.
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-between gap-4 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
            >
              <span className="min-w-0">
                <span className="block text-sm text-text-muted">GitHub repository</span>
                <span className="mt-1 block font-mono text-sm break-all text-text">
                  github.com/zenika-open-source/Zenflow
                </span>
              </span>
              <span aria-hidden="true" className="text-xl text-accent">
                ↗
              </span>
            </a>
          </section>

          <section id="license" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">License</h2>
            <div className="mt-4 rounded-card border border-border bg-surface p-6">
              <span className="inline-block rounded-full border border-accent px-3 py-1 font-mono text-xs text-accent">
                Apache 2.0
              </span>
              <p className="mt-4 leading-relaxed text-text-soft">
                Wavez is open source and released under the Apache 2.0 license. You are free to use, modify and
                distribute it, provided you comply with the terms of the license.
              </p>
              <p className="mt-4 leading-relaxed text-text-soft">
                For more details, read the{" "}
                <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer" className={externalLink}>
                  full license text
                </a>
                .
              </p>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
