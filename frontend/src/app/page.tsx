"use client";

import { useEffect, useState } from "react";
import { getStacks } from "@/api/stacks";
import { AssistantPicker } from "@/components/AssistantPicker";
import { GenerateModal } from "@/components/GenerateModal";
import { SkillCategoryAccordion } from "@/components/SkillCategoryAccordion";
import { Button } from "@/components/ui/Button";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import type { SkillMode } from "@/types/skills";
import type { AssistantId, GuidelineSelection, StackCatalog, ToolSelection } from "@/types/zenflow";

const ALL_CATEGORY_IDS = SKILL_CATEGORIES.map((c) => c.id);

export default function Home() {
  const [catalog, setCatalog] = useState<StackCatalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [assistant, setAssistant] = useState<AssistantId>("claude");
  const [backendArchFile, setBackendArchFile] = useState("");
  const [frontendArchFile, setFrontendArchFile] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(ALL_CATEGORY_IDS));
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
  const canGenerate = !backendStackMissing && !frontendStackMissing;

  useEffect(() => {
    getStacks()
      .then(setCatalog)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load stacks"));
  }, []);

  function handleReset() {
    setAssistant("claude");
    setBackendArchFile("");
    setFrontendArchFile("");
    setExpandedCategories(new Set(ALL_CATEGORY_IDS));
    setSkillSelections({});
  }

  function handleToggleExpand(categoryId: string) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }

  function handleSetSkillMode(skillId: string, mode: SkillMode) {
    setSkillSelections((prev) => ({ ...prev, [skillId]: mode }));
    if (mode === "none") {
      if (skillId === "backend") setBackendArchFile("");
      if (skillId === "frontend") setFrontendArchFile("");
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
    <div className="min-h-screen bg-[linear-gradient(135deg,#fdf1f4_0%,#f6eefb_55%,#eef1fb_100%)] text-[#161217]">
      <div className="mx-auto max-w-[1120px] px-6 pt-6 pb-4">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="mb-2 text-[56px] leading-none font-extrabold tracking-[-0.01em] text-[#c81c5c]">
              ZENFLOW
            </div>
            <h1 className="mb-4 max-w-[40ch] text-lg leading-snug font-bold text-[#5c5560]">
              Generate agent skills for your AI assistant.
            </h1>
            <p className="text-base leading-relaxed text-[#5c5560] lg:whitespace-nowrap">
              Pick an assistant, a stack, and the skills you want your agents to carry then export the
              files it reads on day one.
            </p>
          </div>

          <div className="min-w-[240px] rounded-[24px] bg-white px-6 py-5 shadow-[0_20px_40px_-20px_rgba(120,40,80,0.25)]">
            <AssistantPicker selected={assistant} onSelect={setAssistant} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pt-2 pb-10">
        {!catalog && loadError && (
          <div className="mb-3 text-sm text-[#8a8290]">{`Couldn't load stacks: ${loadError}`}</div>
        )}
        <SkillCategoryAccordion
          categories={SKILL_CATEGORIES}
          expandedCategories={expandedCategories}
          selections={skillSelections}
          onToggleExpand={handleToggleExpand}
          onSetMode={handleSetSkillMode}
          catalog={catalog}
          backendArchFile={backendArchFile}
          frontendArchFile={frontendArchFile}
          onSelectBackend={handleSelectBackend}
          onSelectFrontend={handleSelectFrontend}
        />
      </div>

      <div className="border-t-[1.5px] border-[#e9dde3]">
        <div className="mx-auto flex max-w-[1120px] items-center justify-end gap-4 px-6 py-5">
          {!canGenerate && (
            <span className="text-xs font-semibold text-[#c81c5c]">
              Select a language/stack for every selected agent category to continue.
            </span>
          )}
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
