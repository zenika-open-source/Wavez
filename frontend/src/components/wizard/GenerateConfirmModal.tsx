import { useState } from "react";
import { downloadArchive } from "@/api/archive";
import type { ReviewGroup } from "@/components/wizard/review";
import type { GuidelineSelection, ToolSelection } from "@/types/zenflow";
import type { SkillMode } from "@/types/skills";

type Phase = "confirm" | "loading" | "error";

interface GenerateConfirmModalProps {
  open: boolean;
  assistantLabel: string;
  tools: ToolSelection;
  guidelines: GuidelineSelection;
  skillSelections: Record<string, SkillMode>;
  groups: ReviewGroup[];
  onClose: () => void;
  onGenerated: () => void;
}

export function GenerateConfirmModal({
  open,
  assistantLabel,
  tools,
  guidelines,
  skillSelections,
  groups,
  onClose,
  onGenerated,
}: GenerateConfirmModalProps) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [errorMessage, setErrorMessage] = useState("");

  if (!open) return null;

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
      setPhase("confirm");
      onGenerated();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setPhase("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(2,2,3,0.45)] p-6"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="box-border max-h-[calc(100vh-48px)] w-full max-w-[500px] overflow-auto rounded-[24px] bg-white p-8 shadow-[0_20px_60px_rgba(2,2,3,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="m-0 mb-2.5 text-2xl leading-[1.2] font-bold">Generate agent files?</h2>
        <p className="m-0 mb-4.5 text-base leading-[1.5] text-[#3C434E]">
          This will create the following for <strong>{assistantLabel}</strong> and download them as a zip.
        </p>
        <div className="mb-6 rounded-2xl bg-[#F6F1F6] px-5 py-4.5">
          {groups.length === 0 ? (
            <div className="py-0.5 text-[13px] text-[#3C434E]">No skills selected yet.</div>
          ) : (
            groups.map((group, index) => (
              <div key={group.name} className={index > 0 ? "mt-3.5" : ""}>
                <h3 className="m-0 text-xs font-bold tracking-[0.08em] text-[#020203] uppercase">{group.name}</h3>
                <ul className="m-0 list-none p-0">
                  {group.items.map((item) => (
                    <li key={item.id} className="py-0.5 font-mono text-[13.5px] text-[#3C434E]">
                      <span aria-hidden="true">{"•  "}</span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
        {phase === "error" && <p className="mb-4 text-sm font-semibold text-[#c81c5c]">{errorMessage}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="min-h-[48px] cursor-pointer rounded-[10px] border-[1.5px] border-[#4B5563] bg-white px-6 font-semibold uppercase tracking-wide hover:bg-[#EAECF1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={phase === "loading"}
            aria-busy={phase === "loading"}
            className={`min-h-[48px] cursor-pointer rounded-[10px] border-0 px-7 font-bold text-white uppercase tracking-wide ${
              phase === "loading" ? "cursor-progress bg-[#EB7FA5]" : "hover:brightness-90"
            }`}
            style={phase === "loading" ? undefined : { background: "linear-gradient(90deg,#D6112A,#BB0D5A)" }}
          >
            {phase === "loading" ? "Generating…" : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
}
