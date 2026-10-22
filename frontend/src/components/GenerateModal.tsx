import { useEffect, useEffectEvent, useState } from "react";
import { downloadArchive } from "@/api/archive";
import { Button } from "@/components/ui/Button";
import { ASSISTANTS } from "@/data/assistants";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import type { SkillMode } from "@/types/skills";
import type { AssistantId, GuidelineSelection, ToolSelection } from "@/types/zenflow";

type Phase = "confirm" | "loading" | "success" | "error";

const SUCCESS_AUTO_CLOSE_MS = 4000;

interface GenerateModalProps {
  open: boolean;
  assistant: AssistantId;
  tools: ToolSelection;
  guidelines: GuidelineSelection;
  skillSelections: Record<string, SkillMode>;
  onClose: () => void;
}

export function GenerateModal({ open, assistant, tools, guidelines, skillSelections, onClose }: GenerateModalProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [errorMessage, setErrorMessage] = useState("");

  // The "Downloaded!" dialog dismisses itself after a few seconds.
  const closeAfterSuccess = useEffectEvent(() => handleClose());
  useEffect(() => {
    if (phase !== "success") return;
    const timer = setTimeout(closeAfterSuccess, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  if (!open) return null;

  const assistantLabel = ASSISTANTS.find((a) => a.id === assistant)?.label ?? assistant;
  const selectedGroups = SKILL_CATEGORIES.map((category) => ({
    title: category.title,
    skills: category.skills.filter(
      (skill) => skillSelections[skill.id] === "skill" || skillSelections[skill.id] === "custom",
    ),
  })).filter((group) => group.skills.length > 0);

  function handleClose() {
    setPhase("confirm");
    setErrorMessage("");
    onClose();
  }

  async function handleConfirm() {
    setPhase("loading");
    try {
      const entries = Object.entries(skillSelections);
      const skills = entries.filter(([, mode]) => mode === "skill").map(([skillId]) => skillId);
      const customSkills = entries.filter(([, mode]) => mode === "custom").map(([skillId]) => skillId);
      await downloadArchive(tools, guidelines, skills, customSkills);
      setPhase("success");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setPhase("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-20 grid place-items-center overflow-y-auto bg-[rgba(40,15,30,0.35)] p-4 sm:p-6"
      onClick={handleClose}
    >
      <div
        className="max-h-[calc(100dvh-2rem)] w-full max-w-[480px] overflow-y-auto overscroll-contain rounded-[24px] bg-white p-5 shadow-[0_30px_60px_-20px_rgba(60,20,50,0.4)] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "success" ? (
          <>
            <div className="mb-2 text-xl font-extrabold text-[#161217]">Downloaded!</div>
            <p className="mb-5 text-sm text-[#5c5560]">zenflow-setup.zip should now be in your downloads.</p>
            <div className="flex justify-end">
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 text-xl font-extrabold text-[#161217]">Generate agent files?</div>
            <p className="mb-4 text-sm text-[#5c5560]">
              This will create the following for <span className="font-bold">{assistantLabel}</span> and
              download them as a zip.
            </p>
            <div className="mb-5 max-h-[240px] overflow-y-auto rounded-[14px] bg-[#f6f3f7] px-4 py-3.5">
              {selectedGroups.length === 0 ? (
                <div className="py-0.5 text-[13px] text-[#8a8290]">No skills selected yet.</div>
              ) : (
                selectedGroups.map((group, index) => (
                  <div key={group.title} className={index > 0 ? "mt-3" : ""}>
                    <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#161217]">
                      {group.title}
                    </div>
                    {group.skills.map((skill) => (
                      <div key={skill.id} className="flex items-baseline gap-1.5 py-0.5 font-mono text-[13px] text-[#5c5560]">
                        <span aria-hidden="true">•</span>
                        {skill.label}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            {phase === "error" && (
              <p className="mb-4 text-sm font-semibold text-[#c81c5c]">{errorMessage}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirm} disabled={phase === "loading"}>
                {phase === "loading" ? "Generating…" : "Yes"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
