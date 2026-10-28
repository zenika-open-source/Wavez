"use client";

import { useEffect, useState } from "react";
import { getStacks } from "@/api/stacks";
import { AssistantPicker } from "@/components/AssistantPicker";
import { DocumentationLink } from "@/components/DocumentationLink";
import { GenerateModal } from "@/components/GenerateModal";
import { SectionHeading } from "@/components/SectionHeading";
import { SkillCategoryAccordion } from "@/components/SkillCategoryAccordion";
import { SiteHeader } from "@/components/SiteHeader";
import { SummaryPanel } from "@/components/SummaryPanel";
import { Button } from "@/components/ui/Button";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import { describeStack, toLanguageOptions } from "@/lib/stack";
import type { SkillMode } from "@/types/skills";
import type { AssistantId, GuidelineSelection, StackCatalog, ToolSelection } from "@/types/wavez";

export default function Home() {
  const [catalog, setCatalog] = useState<StackCatalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [assistant, setAssistant] = useState<AssistantId>("claude");
  const [backendArchFile, setBackendArchFile] = useState("");
  const [frontendArchFile, setFrontendArchFile] = useState("");
  const [skillSelections, setSkillSelections] = useState<Record<string, SkillMode>>({});
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  const tools: ToolSelection = {
    claude: assistant === "claude",
    copilot: assistant === "copilot",
    opencode: assistant === "opencode",
  };
  const guidelines: GuidelineSelection = {
    backend_arch_file: backendArchFile,
    backend_doc_file: "",
    frontend_arch_file: frontendArchFile,
    frontend_doc_file: "",
    include_conventions: true,
  };

  const backendStackMissing = (skillSelections["backend"] ?? "none") !== "none" && !backendArchFile;
  const frontendStackMissing = (skillSelections["frontend"] ?? "none") !== "none" && !frontendArchFile;
  const selectedSkillCount = SKILL_CATEGORIES.reduce(
    (count, category) => count + category.skills.filter((skill) => skillSelections[skill.id] !== undefined && skillSelections[skill.id] !== "none").length,
    0,
  );
  const canGenerate = selectedSkillCount > 0 && !backendStackMissing && !frontendStackMissing;
  const selectedStackParts = [
    skillSelections["backend"] !== undefined && skillSelections["backend"] !== "none"
      ? describeStack(catalog, backendArchFile)
      : "",
    skillSelections["frontend"] !== undefined && skillSelections["frontend"] !== "none"
      ? describeStack(catalog, frontendArchFile)
      : "",
  ].filter(Boolean);
  const skillFileCount = selectedSkillCount;
  const waveLevel = Math.min((selectedSkillCount + selectedStackParts.length) / 12, 1);

  useEffect(() => {
    getStacks()
      .then(setCatalog)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load stacks"));
  }, []);

  function handleReset() {
    setAssistant("claude");
    setBackendArchFile("");
    setFrontendArchFile("");
    setSkillSelections({});
  }

  function handleSetSkillMode(skillId: string, mode: SkillMode) {
    setSkillSelections((prev) => ({ ...prev, [skillId]: mode }));
    if (mode === "none") {
      if (skillId === "backend") setBackendArchFile("");
      if (skillId === "frontend") setFrontendArchFile("");
    } else if (skillId === "backend" && catalog && !backendArchFile) {
      const backendOptions = toLanguageOptions(catalog.backend);
      if (backendOptions.length > 0) setBackendArchFile(backendOptions[0].archFile);
    } else if (skillId === "frontend" && catalog) {
      const frontendOptions = toLanguageOptions(catalog.frontend);
      if (frontendOptions.length === 1) setFrontendArchFile(frontendOptions[0].archFile);
    }
  }

  function handleSelectBackend(archFile: string) {
    setBackendArchFile(archFile);
    if (archFile) {
      setSkillSelections((prev) => (prev["backend"] && prev["backend"] !== "none" ? prev : { ...prev, backend: "skill" }));
    }
  }

  function handleSelectFrontend(archFile: string) {
    setFrontendArchFile(archFile);
    if (archFile) {
      setSkillSelections((prev) => (prev["frontend"] && prev["frontend"] !== "none" ? prev : { ...prev, frontend: "skill" }));
    }
  }

  return (
    <div className="min-h-screen bg-page font-sans text-text">
      <SiteHeader />
      <h1 className="sr-only">Generate agent skills for your AI assistant</h1>

      <main className="wz-layout-gutter mx-auto grid w-full max-w-[1440px] grid-cols-1 items-start gap-6 py-5 pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:grid-cols-[minmax(0,1fr)_clamp(320px,26.4vw,380px)] lg:gap-10 lg:pb-6">
        <div className="flex min-w-0 flex-col gap-6 lg:gap-4">
          <section className="grid min-w-0 grid-cols-1 items-center gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-5">
            <SectionHeading number="01" title="Assistant" />
            <AssistantPicker selected={assistant} onSelect={setAssistant} />
          </section>

          <section className="flex min-w-0 flex-col gap-2.5">
            <SectionHeading number="02" title="Skills" />
            {!catalog && loadError && (
              <div role="alert" className="text-sm text-text-muted">{`Couldn't load stacks: ${loadError}`}</div>
            )}
            <SkillCategoryAccordion
              categories={SKILL_CATEGORIES}
              selections={skillSelections}
              onSetMode={handleSetSkillMode}
              catalog={catalog}
              backendArchFile={backendArchFile}
              frontendArchFile={frontendArchFile}
              onSelectBackend={handleSelectBackend}
              onSelectFrontend={handleSelectFrontend}
            />
          </section>
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-[100px]">
          <DocumentationLink />
          <SummaryPanel
            assistant={assistant}
            stackLabel={selectedStackParts.join(" + ")}
            skillCount={selectedSkillCount}
            skillFileCount={skillFileCount}
            waveLevel={waveLevel}
            canGenerate={canGenerate}
            onGenerate={() => setGenerateModalOpen(true)}
            onReset={handleReset}
          />
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-page/95 shadow-[0_-12px_24px_-16px_rgba(0,0,0,0.6)] backdrop-blur lg:hidden">
        <div className="wz-layout-gutter mx-auto flex max-w-[1440px] items-center justify-end gap-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="primary" onClick={() => setGenerateModalOpen(true)} disabled={!canGenerate}>
            Generate
          </Button>
        </div>
      </div>

      <GenerateModal
        open={generateModalOpen}
        assistant={assistant}
        tools={tools}
        guidelines={guidelines}
        skillSelections={skillSelections}
        onClose={() => setGenerateModalOpen(false)}
      />
    </div>
  );
}
