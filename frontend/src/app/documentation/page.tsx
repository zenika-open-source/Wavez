import type { Metadata } from "next";
import Link from "next/link";
import { FlowDiagram, type FlowStep } from "@/components/FlowDiagram";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Documentation · Wavez",
  description: "Source code, license and project information for Wavez.",
};

const REPO_URL = "https://github.com/zenika-open-source/Zenflow";
const LICENSE_URL =
  "https://github.com/zenika-open-source/Zenflow/blob/main/LICENSE";

const SECTIONS = [
  { id: "getting-started", label: "Getting started" },
  { id: "discovery-flow", label: "Product discovery flow" },
  { id: "development-flow", label: "Development flow" },
  { id: "about", label: "About Wavez" },
  { id: "source-code", label: "Source code", nested: true },
  { id: "license", label: "License", nested: true },
];

const DISCOVERY_STEPS: FlowStep[] = [
  {
    title: "Build PRD and User Stories",
    detail: "Draft mode",
    description:
      "Capture the problem, goals and first user stories as a working draft.",
    swatch: "bg-cat-product",
  },
  {
    title: "Build low-fidelity prototype",
    detail: "Greyscale, black and white",
    description:
      "Sketch the screens and flows without colour to validate structure fast.",
    swatch: "bg-text-muted",
  },
  {
    title: "Build hi-fidelity prototype",
    detail: "Full visual design",
    description:
      "Apply the real look and feel to test the experience end to end.",
    swatch: "bg-accent",
  },
  {
    title: "Finalise PRD and User Stories",
    detail: "Final version",
    description:
      "Update the documents with everything learned from the prototypes.",
    swatch: "bg-cat-dev",
  },
];

const DEVELOPMENT_STEPS: FlowStep[] = [
  {
    title: "Development",
    detail: "Implement the user stories",
    description:
      "Build the features described in the finalised PRD and User Stories.",
    swatch: "bg-cat-dev",
  },
  {
    title: "Code review",
    detail: "Quality and conventions",
    description:
      "Review the changes for correctness, readability and adherence to the project conventions.",
    swatch: "bg-cat-qa",
  },
  {
    title: "Automated testing with Playwright",
    detail: "Checked against the user stories",
    description:
      "Run end-to-end tests and verify that each user story's acceptance criteria is met.",
    swatch: "bg-accent",
  },
];

const GETTING_STARTED_STEPS: FlowStep[] = [
  {
    title: "Select your harness and skills",
    detail: "Claude Code, GitHub Copilot, OpenCode...",
    description:
      "Choose the harness you work with and the skills you wish to use in your project.",
    swatch: "bg-cat-product",
  },
  {
    title: "Generate and download",
    detail: "Click on Generate",
    description: "Confirm your selection and download the generated files.",
    swatch: "bg-accent",
  },
  {
    title: "Unzip and start working",
    detail: "At the root of your project",
    description:
      "Unzip the archive at the root of your project and start working!",
    swatch: "bg-cat-dev",
  },
];

const externalLink =
  "font-semibold text-accent underline hover:text-accent-strong";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-page font-sans text-text">
      <SiteHeader />

      <main className="wz-layout-gutter mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 py-8 pb-16 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Link
            href="/"
            className="text-sm font-semibold text-accent hover:text-accent-strong"
          >
            ← Back to generator
          </Link>
          <nav aria-label="On this page" className="mt-6 hidden lg:block">
            <p className="font-mono text-xs tracking-wider text-text-muted uppercase">
              On this page
            </p>
            <ul className="mt-3 flex flex-col gap-1 border-l border-border">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`-ml-px block border-l border-transparent py-1.5 ${section.nested ? "pl-7" : "pl-4"} text-sm text-text-soft hover:border-accent hover:text-accent`}
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
            Wavez documentation
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-soft">
            Wavez generates agent skills for your AI assistant. This page
            describes the product discovery and development flows, and gives you
            the source code and license information.
          </p>

          <section id="getting-started" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              Getting started
            </h2>
            <p className="mt-3 leading-relaxed text-text-soft">
              Using Wavez takes three steps.
            </p>
            <FlowDiagram steps={GETTING_STARTED_STEPS} />
          </section>

          <section id="discovery-flow" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              Product discovery flow
            </h2>
            <p className="mt-3 leading-relaxed text-text-soft">
              Product discovery moves from a draft PRD through two prototype
              stages, then back to the PRD to finalise it.
            </p>
            <FlowDiagram steps={DISCOVERY_STEPS} />
          </section>

          <section id="development-flow" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              Development flow
            </h2>
            <p className="mt-3 leading-relaxed text-text-soft">
              Once the product is defined, development goes through
              implementation, code review and automated testing. Tests are
              validated against the user stories to confirm that what was built
              is what was asked for.
            </p>
            <FlowDiagram steps={DEVELOPMENT_STEPS} />
          </section>

          <section id="about" className="mt-12 scroll-mt-28">
            <h2 className="font-display text-2xl font-bold tracking-tight text-text">
              About Wavez
            </h2>
            <p className="mt-3 leading-relaxed text-text-soft">
              Wavez is an open source tool developed by Zenika. It lets you pick
              an AI assistant and the skills you need, then exports the files
              that assistant reads on day one.
            </p>

            <section id="source-code" className="mt-8 scroll-mt-28">
              <h3 className="font-display text-xl font-bold tracking-tight text-text">
                Source code
              </h3>
              <p className="mt-3 leading-relaxed text-text-soft">
                Wavez is developed in the open. Browse the code, report an issue
                or contribute on GitHub.
              </p>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-between gap-4 rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent"
              >
                <span className="min-w-0">
                  <span className="block text-sm text-text-muted">
                    GitHub repository
                  </span>
                  <span className="mt-1 block font-mono text-sm break-all text-text">
                    github.com/zenika-open-source/Zenflow
                  </span>
                </span>
                <span aria-hidden="true" className="text-xl text-accent">
                  ↗
                </span>
              </a>
            </section>

            <section id="license" className="mt-8 scroll-mt-28">
              <h3 className="font-display text-xl font-bold tracking-tight text-text">
                License
              </h3>
              <div className="mt-4 rounded-card border border-border bg-surface p-6">
                <span className="inline-block rounded-full border border-accent px-3 py-1 font-mono text-xs text-accent">
                  Apache 2.0
                </span>
                <p className="mt-4 leading-relaxed text-text-soft">
                  Wavez is open source and released under the Apache 2.0
                  license. You are free to use, modify and distribute it,
                  provided you comply with the terms of the license.
                </p>
                <p className="mt-4 leading-relaxed text-text-soft">
                  For more details, read the{" "}
                  <a
                    href={LICENSE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={externalLink}
                  >
                    full license text
                  </a>
                  .
                </p>
              </div>
            </section>
          </section>
        </article>
      </main>
    </div>
  );
}
