import { toLanguageOptions } from "@/lib/stackOptions";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

interface SkillsStepProps {
  categories: SkillCategory[];
  selections: Record<string, SkillMode>;
  onSetMode: (skillId: string, mode: SkillMode) => void;
  catalog: StackCatalog | null;
  backendArchFile: string;
  frontendArchFile: string;
  onSelectBackend: (archFile: string) => void;
  onSelectFrontend: (archFile: string) => void;
}

export function SkillsStep({
  categories,
  selections,
  onSetMode,
  catalog,
  backendArchFile,
  frontendArchFile,
  onSelectBackend,
  onSelectFrontend,
}: SkillsStepProps) {
  return (
    <section>
      <h1 className="mb-1 text-[26px] leading-[1.15] font-bold tracking-[-0.01em] text-[#020203]">
        Choose your skills
      </h1>
      <p className="mb-4 text-[#3C434E]">Only the groups for your roles are shown.</p>
      {categories.map((category) => {
        const selectableSkills = category.skills.filter((skill) => !skill.disabled);
        const selectedCount = selectableSkills.filter((skill) => (selections[skill.id] ?? "none") !== "none").length;
        const allSelected = selectableSkills.length > 0 && selectedCount === selectableSkills.length;

        function handleSelectAll() {
          const nextMode: SkillMode = allSelected ? "none" : "skill";
          selectableSkills.forEach((skill) => onSetMode(skill.id, nextMode));
        }

        return (
          <div
            key={category.id}
            className="mb-3.5 rounded-2xl border-[1.5px] border-[#B8BEC8] bg-white p-3.5 pb-3"
          >
            <div className="mb-2 flex items-center justify-between border-b border-[#E3E6EB] pb-2.5">
              <div className="flex items-center gap-3">
                <h2 className="text-[17px] font-bold">{category.title}</h2>
                <span className="text-sm text-[#3C434E]">
                  {selectedCount} of {category.skills.length} selected
                </span>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="cursor-pointer rounded-md border-0 bg-none px-2 py-1.5 text-[14.5px] font-semibold text-[#BB0D5A] underline decoration-auto underline-offset-[3px] hover:text-[#850A41]"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {category.skills.map((skill, index) => {
                const disabled = skill.disabled ?? false;
                const mode = disabled ? "none" : (selections[skill.id] ?? "none");
                const on = mode !== "none";
                const prevSkill = index > 0 ? category.skills[index - 1] : null;
                const prevOn = !!prevSkill && (selections[prevSkill.id] ?? "none") !== "none";
                const showStack = (skill.id === "backend" || skill.id === "frontend") && !!catalog;
                const stackOptions = showStack
                  ? toLanguageOptions(skill.id === "backend" ? catalog!.backend : catalog!.frontend)
                  : [];
                const currentArchFile = skill.id === "backend" ? backendArchFile : frontendArchFile;
                const onSelectStack = skill.id === "backend" ? onSelectBackend : onSelectFrontend;
                const stackMissing = showStack && on && !currentArchFile;

                return (
                  <div
                    key={skill.id}
                    className={`relative rounded-[10px] ${on ? "bg-[#FFF4F8]" : "hover:bg-[#F3F4F8]"} ${
                      disabled ? "opacity-50" : ""
                    } ${
                      index > 0 && !on && !prevOn
                        ? "before:absolute before:inset-x-3 before:top-[-2px] before:h-px before:bg-[#E3E6EB] hover:before:bg-transparent"
                        : ""
                    }`}
                  >
                    <label
                      className={`relative flex items-center gap-3 rounded-xl p-2 ${
                        disabled ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        disabled={disabled}
                        onChange={() => onSetMode(skill.id, on ? "none" : "skill")}
                        className="sr-only"
                      />
                      <span
                        className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[6px] border-2"
                        style={{ borderColor: on ? "#BB0D5A" : "#4B5563", background: on ? "#BB0D5A" : "#fff" }}
                      >
                        {on && (
                          <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                            <path
                              d="M3 8.5l3.2 3L13 4.5"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-[15px] leading-[1.3] font-semibold">{skill.label}</span>
                        {skill.sublabel && <span className="text-[13.5px] text-[#3C434E]">{skill.sublabel}</span>}
                      </span>
                    </label>
                    {showStack && (
                      <div className="flex flex-wrap items-center gap-1.5 py-2 pr-3 pl-[42px]" role="radiogroup" aria-label={`Stack for ${skill.label}`}>
                        <span className="mr-0.5 text-[13px] font-semibold text-[#3C434E]">Stack</span>
                        {stackOptions.map((option) => {
                          const checked = option.archFile === currentArchFile;
                          return (
                            <label key={option.key} className="relative inline-flex cursor-pointer">
                              <input
                                type="radio"
                                name={`stack-${skill.id}`}
                                checked={checked}
                                onChange={() => onSelectStack(checked ? "" : option.archFile)}
                                className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
                              />
                              <span
                                className={`inline-block rounded-full border-[1.5px] px-2.5 py-0.5 text-[13.5px] font-medium ${
                                  checked
                                    ? "border-[#BB0D5A] bg-[#BB0D5A] font-semibold text-white"
                                    : "border-[#4B5563] bg-white text-[#020203] hover:border-[#020203] hover:bg-[#EEF0F4]"
                                }`}
                              >
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                        {stackMissing && (
                          <span className="ml-1 text-[13px] font-semibold text-[#c81c5c]">Required</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
