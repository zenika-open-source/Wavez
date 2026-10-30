import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { StepCards, type Step } from "@/components/StepCards";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ASSISTANTS } from "@/data/assistants";

export const metadata: Metadata = {
  title: "Documentation · Wavez",
  description: "How Wavez works: getting started, the product discovery and development flows, and how to get involved.",
};

const REPO_URL = "https://github.com/zenika-open-source/Wavez";
const ISSUES_URL = "https://github.com/zenika-open-source/Wavez/issues";
const LICENSE_URL = "https://github.com/zenika-open-source/Wavez/blob/main/LICENSE";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "getting-started", label: "Getting started" },
  { id: "product-discovery", label: "Product discovery flow" },
  { id: "development", label: "Development flow" },
  { id: "get-involved", label: "Get involved" },
  { id: "source-code", label: "Source code", nested: true },
  { id: "license", label: "License", nested: true },
  { id: "feedback", label: "Feedback", nested: true },
];

const ASSISTANT_LOGOS = (
  <span className="inline-flex gap-1.5">
    {ASSISTANTS.map((assistant) => (
      <span
        key={assistant.id}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-page"
      >
        <Image src={assistant.logo} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" unoptimized />
      </span>
    ))}
  </span>
);

const GETTING_STARTED_STEPS: Step[] = [
  {
    title: "Select your harness and skills",
    detail: "Claude Code, GitHub Copilot, OpenCode",
    description: "Choose the harness you work with and the skills you wish to use in your project.",
    footer: ASSISTANT_LOGOS,
  },
  {
    title: "Generate and download",
    detail: "Click on Generate",
    description: "Confirm your selection and download the generated files.",
  },
  {
    title: "Unzip and start working",
    detail: "At the root of your project",
    description: "Unzip the archive at the root of your project and start working!",
  },
];

const DISCOVERY_STEPS: Step[] = [
  {
    title: "Build PRD and User Stories",
    detail: "Draft mode",
    description: "Capture the problem, goals and first user stories as a working draft.",
  },
  {
    title: "Build low-fidelity prototype",
    detail: "Greyscale, black and white",
    description: "Sketch the screens and flows without colour to validate structure fast.",
  },
  {
    title: "Build hi-fidelity prototype",
    detail: "Full visual design",
    description: "Apply the real look and feel to test the experience end to end.",
  },
  {
    title: "Finalise PRD and User Stories",
    detail: "Final version",
    description: "Update the documents with everything learned from the prototypes.",
  },
];

const DEVELOPMENT_STEPS: Step[] = [
  {
    title: "Development",
    detail: "Implement the user stories",
    description: "Build the features described in the finalised PRD and User Stories.",
  },
  {
    title: "Code review",
    detail: "Quality and conventions",
    description: "Review the changes for correctness, readability and adherence to the project conventions.",
  },
  {
    title: "Automated testing with Playwright",
    detail: "Checked against the user stories",
    description: "Run end-to-end tests and verify that each user story's acceptance criteria is met.",
    color: "var(--color-flow-testing)",
  },
];

function SectionIntro({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="m-0 font-display text-[26px] font-bold tracking-[-0.01em] text-text">{title}</h2>
      <p className="m-0 mt-2 max-w-[760px] text-text-soft">{children}</p>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="-ml-2.5 inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-[15px] font-semibold text-accent transition-colors duration-150 hover:bg-accent/14"
    >
      {children}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="flex-none"
      >
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </a>
  );
}

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-page font-sans text-text">
      <SiteHeader />

      <main className="wz-layout-gutter mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-10 pt-10 pb-[72px] lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-[100px] lg:self-start">
          <Link href="/" className="text-sm leading-5 font-semibold text-accent hover:text-accent-strong">
            ← Back to generator
          </Link>
          <nav aria-label="On this page" className="mt-6 hidden lg:block">
            <p className="m-0 font-mono text-[13px] leading-[18px] tracking-[.14em] text-text-muted uppercase">
              On this page
            </p>
            <ul className="mt-3 flex list-none flex-col gap-1 border-l border-border p-0">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`-ml-px block border-l border-transparent py-1.5 ${section.nested ? "pl-7" : "pl-4"} text-[15px] leading-[22px] text-text-soft hover:border-accent hover:text-accent`}
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="flex min-w-0 flex-col gap-14">
          <div id="introduction" className="flex scroll-mt-28 flex-col gap-2.5">
            <span className="font-mono text-[13px] tracking-[.14em] text-accent uppercase">Documentation</span>
            <h1 className="m-0 font-display text-[40px] leading-[1.15] font-bold tracking-[-0.01em] text-text">
              Introduction
            </h1>
            <p className="m-0 max-w-[760px] text-lg text-text-soft">
              Wavez is an open source tool from Zenika that sets your AI assistant up to work the way a good team
              does. Pick your assistant and the skills you need, and Wavez gives you the files that teach it how to
              write requirements, build prototypes, review code and run tests. Learn how the product discovery and
              development flows work, and learn how it applies to your workflow.
            </p>
          </div>

          <section className="flex flex-col gap-6">
            <SectionIntro id="getting-started" title="Getting started">
              Using Wavez takes three steps.
            </SectionIntro>
            <StepCards steps={GETTING_STARTED_STEPS} color="var(--color-accent)" />
          </section>

          <section className="flex flex-col gap-6">
            <SectionIntro id="product-discovery" title="Product discovery flow">
              Product discovery moves from a draft PRD through two prototype stages, then back to the PRD to finalise
              it.
            </SectionIntro>
            <VideoEmbed
              videoId="2USUlosIVqo"
              label="Video · Product management"
              title="Using Wavez for Product and Discovery"
              color="var(--color-flow-discovery)"
            />
            <StepCards steps={DISCOVERY_STEPS} color="var(--color-flow-discovery)" />
          </section>

          <section className="flex flex-col gap-6">
            <SectionIntro id="development" title="Development flow">
              Once the product is defined, development goes through implementation, code review and automated
              testing. Tests are validated against the user stories to confirm that what was built is what was asked
              for.
            </SectionIntro>
            <VideoEmbed
              videoId="3Si5vDBTjkc"
              label="Video · Application development"
              title="Using Wavez for Application Development"
              color="var(--color-flow-development)"
            />
            <StepCards steps={DEVELOPMENT_STEPS} color="var(--color-flow-development)" />
          </section>

          <section className="flex flex-col gap-6">
            <SectionIntro id="get-involved" title="Get involved">
              Wavez is an open source tool developed by Zenika.
            </SectionIntro>
            <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:gap-x-4 lg:gap-y-0">
              <div
                id="source-code"
                className="flex min-w-0 scroll-mt-28 flex-col content-start gap-1.5 rounded-[14px] border border-border bg-surface p-[18px] transition-colors duration-150 hover:border-border-strong lg:row-span-3 lg:grid lg:grid-rows-subgrid"
              >
                <div className="flex min-h-[22px] items-center gap-3">
                  <h3 className="m-0 text-[17px] leading-[1.3] font-bold text-text">Source code</h3>
                </div>
                <p className="m-0 text-[15px] text-text-soft">
                  Browse the code, report an issue or contribute on GitHub.
                </p>
                <div className="self-end pt-1.5">
                  <ExternalLink href={REPO_URL}>View on GitHub</ExternalLink>
                </div>
              </div>
              <div
                id="license"
                className="flex min-w-0 scroll-mt-28 flex-col content-start gap-1.5 rounded-[14px] border border-border bg-surface p-[18px] transition-colors duration-150 hover:border-border-strong lg:row-span-3 lg:grid lg:grid-rows-subgrid"
              >
                <div className="flex min-h-[22px] items-center gap-3">
                  <h3 className="m-0 text-[17px] leading-[1.3] font-bold text-text">License</h3>
                  <span className="rounded-full border border-accent px-2.5 font-mono text-xs leading-[18px] text-accent">
                    Apache 2.0
                  </span>
                </div>
                <p className="m-0 text-[15px] text-text-soft">
                  Wavez is free to use, modify and distribute under the terms of the license.
                </p>
                <div className="self-end pt-1.5">
                  <ExternalLink href={LICENSE_URL}>Read the full license</ExternalLink>
                </div>
              </div>
              <div
                id="feedback"
                className="flex min-w-0 scroll-mt-28 flex-col content-start gap-1.5 rounded-[14px] border border-border bg-surface p-[18px] transition-colors duration-150 hover:border-border-strong lg:row-span-3 lg:grid lg:grid-rows-subgrid"
              >
                <div className="flex min-h-[22px] items-center gap-3">
                  <h3 className="m-0 text-[17px] leading-[1.3] font-bold text-text">Feedback</h3>
                </div>
                <p className="m-0 text-[15px] text-text-soft">
                  Feedback is welcome! Report a bug, suggest an idea or share how you use Wavez.
                </p>
                <div className="self-end pt-1.5">
                  <ExternalLink href={ISSUES_URL}>Open an issue</ExternalLink>
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
