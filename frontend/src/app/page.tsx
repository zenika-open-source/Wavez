"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getStacks } from "@/api/stacks";
import { AssistantStep } from "@/components/wizard/AssistantStep";
import { GenerateConfirmModal } from "@/components/wizard/GenerateConfirmModal";
import { ReviewStep } from "@/components/wizard/ReviewStep";
import { RoleStep } from "@/components/wizard/RoleStep";
import { SelectionSummary } from "@/components/wizard/SelectionSummary";
import { SkillsStep } from "@/components/wizard/SkillsStep";
import { StepNav } from "@/components/wizard/StepNav";
import { buildReviewGroups, stacksSummary, totalSkills } from "@/components/wizard/review";
import { ASSISTANTS } from "@/data/assistants";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import { toLanguageOptions } from "@/lib/stackOptions";
import type { SkillMode } from "@/types/skills";
import type { AssistantId, GuidelineSelection, StackCatalog, ToolSelection } from "@/types/zenflow";

export default function Home() {
  const [catalog, setCatalog] = useState<StackCatalog | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [roles, setRoles] = useState<string[]>([]);
  const [skillSelections, setSkillSelections] = useState<Record<string, SkillMode>>({});
  const [assistant, setAssistant] = useState<AssistantId | null>(null);
  const [backendArchFile, setBackendArchFile] = useState("");
  const [frontendArchFile, setFrontendArchFile] = useState("");
  const [done, setDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    getStacks()
      .then(setCatalog)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load stacks"));
  }, []);

  const visibleCategories = SKILL_CATEGORIES.filter((category) => roles.includes(category.id));
  const selectedSkillCount = Object.values(skillSelections).filter((mode) => mode !== "none").length;

  const hasRoles = roles.length > 0;
  const hasSkills = selectedSkillCount > 0;
  const hasAssistant = assistant !== null;

  const backendStackMissing = (skillSelections["backend"] ?? "none") !== "none" && !backendArchFile;
  const frontendStackMissing = (skillSelections["frontend"] ?? "none") !== "none" && !frontendArchFile;
  const canGenerate = hasSkills && hasAssistant && !backendStackMissing && !frontendStackMissing;

  const reach = !hasRoles ? 1 : !hasSkills ? 2 : !hasAssistant ? 3 : done ? 4 : 3;
  const displayStep = step === 4 && !done ? 3 : step;

  const validByStep: Record<number, boolean> = {
    1: hasRoles,
    2: hasSkills && !backendStackMissing && !frontendStackMissing,
    3: hasAssistant,
    4: true,
  };
  const valid = validByStep[displayStep];

  const reviewGroups = buildReviewGroups(roles, skillSelections, assistant ?? "claude", backendArchFile, frontendArchFile, catalog);

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

  function handleReset() {
    setStep(1);
    setRoles([]);
    setSkillSelections({});
    setAssistant(null);
    setBackendArchFile("");
    setFrontendArchFile("");
    setDone(false);
    setConfirmOpen(false);
  }

  function handleToggleRole(categoryId: string) {
    const nextRoles = roles.includes(categoryId) ? roles.filter((id) => id !== categoryId) : [...roles, categoryId];
    const orderedRoles = SKILL_CATEGORIES.map((c) => c.id).filter((id) => nextRoles.includes(id));

    const nextSelections = { ...skillSelections };
    SKILL_CATEGORIES.forEach((category) => {
      if (!orderedRoles.includes(category.id)) {
        category.skills.forEach((skill) => {
          delete nextSelections[skill.id];
        });
      }
    });
    if (!orderedRoles.includes("developer")) {
      setBackendArchFile("");
      setFrontendArchFile("");
    }

    setRoles(orderedRoles);
    setSkillSelections(nextSelections);
    setDone(false);
  }

  function handleSetSkillMode(skillId: string, mode: SkillMode) {
    setSkillSelections((prev) => ({ ...prev, [skillId]: mode }));
    setDone(false);
    if (mode === "none") {
      if (skillId === "backend") setBackendArchFile("");
      if (skillId === "frontend") setFrontendArchFile("");
    } else if (catalog) {
      if (skillId === "backend" && !backendArchFile) {
        const options = toLanguageOptions(catalog.backend);
        if (options.length > 0) setBackendArchFile(options[0].archFile);
      } else if (skillId === "frontend" && !frontendArchFile) {
        const options = toLanguageOptions(catalog.frontend);
        if (options.length > 0) setFrontendArchFile(options[0].archFile);
      }
    }
  }

  function handleSelectBackend(archFile: string) {
    setBackendArchFile(archFile);
    setDone(false);
  }

  function handleSelectFrontend(archFile: string) {
    setFrontendArchFile(archFile);
    setDone(false);
  }

  function handleSelectAssistant(id: AssistantId) {
    setAssistant(id);
    setDone(false);
  }

  function handleJumpStep(target: number) {
    if (target > reach || done) return;
    setStep(target);
  }

  function handleBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  function handleNext() {
    setStep((s) => Math.min(4, s + 1));
  }

  function handleGenerated() {
    setDone(true);
    setStep(4);
    setConfirmOpen(false);
  }

  const assistantLabel = assistant ? (ASSISTANTS.find((a) => a.id === assistant)?.label ?? assistant) : "Not chosen";

  return (
    <div className="min-h-screen bg-[#F5F5F8] text-[#020203]">
      <header className="sticky top-0 z-10 flex h-[72px] items-center bg-white shadow-[0_1px_0_#D5D9E0]">
        <div className="mx-auto flex w-full max-w-[992px] items-center gap-3.5 px-6">
          <Image src="/zenika-logo.svg" alt="Zenika" width={36} height={36} />
          <span className="block h-6 text-xl leading-6 font-bold tracking-[0.02em]">Zenflow</span>
          <span className="h-6 w-px bg-[#B8BEC8]" />
          <span className="block h-6 text-[15px] leading-6 text-[#3C434E]">
            Generate agent skills for your AI assistant.
          </span>
        </div>
      </header>

      {!done && <StepNav step={displayStep} reach={reach} done={done} onJump={handleJumpStep} />}

      <div className="mx-auto flex max-w-[992px] items-start gap-10 px-6 pt-6 pb-12">
        <main className="min-w-0 flex-1">
          {!catalog && loadError && (
            <div className="mb-3 text-sm text-[#3C434E]">{`Couldn't load stacks: ${loadError}`}</div>
          )}

          {displayStep === 1 && <RoleStep roles={roles} onToggleRole={handleToggleRole} />}
          {displayStep === 2 && (
            <SkillsStep
              categories={visibleCategories}
              selections={skillSelections}
              onSetMode={handleSetSkillMode}
              catalog={catalog}
              backendArchFile={backendArchFile}
              frontendArchFile={frontendArchFile}
              onSelectBackend={handleSelectBackend}
              onSelectFrontend={handleSelectFrontend}
            />
          )}
          {displayStep === 3 && <AssistantStep assistant={assistant} onSelect={handleSelectAssistant} />}
          {displayStep === 4 && <ReviewStep groups={reviewGroups} onReset={handleReset} />}

          {!done && (
            <div className="sticky bottom-0 z-[5] mt-6 flex items-center border-t border-[#D5D9E0] bg-[#F5F5F8] py-5">
              {displayStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="min-h-[48px] cursor-pointer rounded-[10px] border-[1.5px] border-[#4B5563] bg-white px-6 font-semibold hover:bg-[#EAECF1]"
                >
                  Back
                </button>
              )}
              <span className="flex-1" />
              {displayStep < 3 && (
                <button
                  type="button"
                  disabled={!valid}
                  onClick={handleNext}
                  className={`min-h-[48px] rounded-[10px] border-0 px-7 font-bold text-white disabled:cursor-not-allowed ${
                    valid ? "cursor-pointer hover:brightness-90" : ""
                  }`}
                  style={valid ? { background: "linear-gradient(90deg,#D6112A,#BB0D5A)" } : { background: "#E1E4EA", color: "#566070" }}
                >
                  Next
                </button>
              )}
            </div>
          )}
        </main>

        {hasRoles && displayStep >= 2 && (
          <SelectionSummary
            rolesText={
              SKILL_CATEGORIES.filter((c) => roles.includes(c.id))
                .map((c) => c.title)
                .join(", ") || "—"
            }
            assistantText={assistantLabel}
            stackText={stacksSummary(reviewGroups)}
            skillsCount={totalSkills(reviewGroups)}
            filesCount={totalSkills(reviewGroups)}
            done={done}
            canGenerate={canGenerate}
            onGenerate={() => setConfirmOpen(true)}
            onReset={handleReset}
          />
        )}
      </div>

      <GenerateConfirmModal
        open={confirmOpen}
        assistantLabel={assistantLabel}
        tools={tools}
        guidelines={guidelines}
        skillSelections={skillSelections}
        groups={reviewGroups}
        onClose={() => setConfirmOpen(false)}
        onGenerated={handleGenerated}
      />
    </div>
  );
}
