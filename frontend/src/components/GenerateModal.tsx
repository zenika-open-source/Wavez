import { useCallback, useEffect, useRef, useState } from "react";
import { downloadArchive } from "@/api/archive";
import { Button } from "@/components/ui/Button";
import { ASSISTANTS } from "@/data/assistants";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import type { Skill, SkillMode } from "@/types/skills";
import type { AssistantId, GuidelineSelection, ToolSelection } from "@/types/zenflow";

type Phase = "confirm" | "loading" | "success" | "error";

const SUCCESS_AUTO_CLOSE_MS = 3000;

// Where the archive puts a skill: <root>/<agent>/SKILL.md, or a Copilot custom agent file.
function skillPath(skillsRoot: string, skill: Skill, mode: SkillMode): string {
  const agentId = skill.agentId ?? skill.id;
  return mode === "custom" ? `.github/agents/${agentId}.agent.md` : `${skillsRoot}/${agentId}/SKILL.md`;
}

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => {
    setPhase("confirm");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (phase !== "success") return;
    const timer = setTimeout(closeDialog, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [phase, closeDialog]);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, closeDialog]);

  if (!open) return null;

  const assistantInfo = ASSISTANTS.find((item) => item.id === assistant);
  const assistantLabel = assistantInfo?.label ?? assistant;
  const selectedGroups = SKILL_CATEGORIES.map((category) => ({
    title: category.title,
    key: category.key,
    skills: category.skills.filter(
      (skill) => skillSelections[skill.id] === "skill" || skillSelections[skill.id] === "custom",
    ),
  })).filter((group) => group.skills.length > 0);

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

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) closeDialog();
  }

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] grid place-items-center overflow-y-auto bg-overlay p-4 sm:p-6 lg:place-items-start lg:justify-items-center lg:pt-[200px]"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="generate-dialog-title"
        aria-busy={phase === "loading"}
        tabIndex={-1}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-[640px] overflow-y-auto overscroll-contain rounded-[22px] border-2 border-accent bg-surface p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.4)] sm:p-[34px] lg:max-h-[calc(100dvh-224px)]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={() => closeDialog()}
          className="absolute top-[18px] right-[18px] flex h-11 w-11 items-center justify-center rounded-control border-0 bg-surface-raised text-text hover:bg-border"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        <div className="pr-12 font-mono text-[13px] tracking-[0.14em] text-accent uppercase">Your wave is ready</div>
        <h2 id="generate-dialog-title" className="mt-2 mb-5 font-display text-2xl font-bold tracking-[-0.02em] text-text sm:text-[32px] sm:leading-[1.5]">
          Ready for {assistantLabel}
        </h2>

        {phase === "success" ? (
          <div role="status" aria-live="polite">
            <p className="text-sm text-text-soft">Archive downloaded. The zip file should now be in your downloads.</p>
            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={() => closeDialog()}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-5 flex max-h-[280px] flex-col gap-4 overflow-y-auto overscroll-contain rounded-control border border-border bg-page px-[18px] py-4">
              {selectedGroups.length === 0 ? (
                <p className="m-0 text-sm text-text-muted">No skills selected yet.</p>
              ) : (
                selectedGroups.map((group) => (
                  <section key={group.title} className={`wz-category-${group.key} flex flex-col gap-2`}>
                    <span className="w-fit rounded-full bg-[color-mix(in_srgb,var(--wz-category-color)_14%,var(--color-page))] px-2.5 py-0.5 text-xs leading-[1.5] font-semibold tracking-[0.01em] whitespace-nowrap text-[color:var(--wz-category-color)]">
                      {group.title}
                    </span>
                    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                      {group.skills.map((skill) => (
                        <li key={skill.id} className="flex flex-col gap-px">
                          <span className="text-sm leading-[1.5] font-semibold text-text">{skill.label}</span>
                          <span className="font-mono text-xs leading-[1.5] [overflow-wrap:anywhere] text-text-muted">
                            {skillPath(assistantInfo?.skillsRoot ?? "", skill, skillSelections[skill.id])}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>

            {phase === "error" && (
              <p role="alert" className="mt-4 text-sm font-semibold text-accent-strong">
                {errorMessage}
              </p>
            )}
            {phase === "loading" && (
              <p role="status" aria-live="polite" className="mt-4 text-sm text-text-muted">
                Generating archive…
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg" onClick={handleConfirm} disabled={phase === "loading"}>
                {phase === "loading" ? "Generating…" : phase === "error" ? "Try again" : "Download archive (.zip)"}
              </Button>
              <Button variant="link" onClick={() => closeDialog()}>
                Keep editing
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
