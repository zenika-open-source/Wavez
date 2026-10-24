import type { ReactNode } from "react";
import type { Skill, SkillCategoryKey, SkillMode } from "@/types/skills";

interface SkillRowProps {
  skill: Skill;
  mode: SkillMode;
  categoryKey: SkillCategoryKey;
  onChange: (mode: SkillMode) => void;
  stackChips?: ReactNode;
}

export function SkillRow({ skill, mode, categoryKey, onChange, stackChips }: SkillRowProps) {
  const disabled = skill.disabled ?? false;
  const selected = !disabled && mode !== "none";

  return (
    <div
      data-selected={selected}
      className={`wz-skill-card wz-category-${categoryKey} rounded-control transition-[transform,background-color,border-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 ${disabled ? "opacity-50" : ""}`}
    >
      <label
        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2 transition-colors [&:has(input:focus-visible)]:outline [&:has(input:focus-visible)]:outline-2 [&:has(input:focus-visible)]:outline-accent-strong"
      >
        <input
          type="checkbox"
          name={skill.id}
          checked={selected}
          onChange={(event) => onChange(event.currentTarget.checked ? "skill" : "none")}
          disabled={disabled}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`flex h-[22px] w-[22px] flex-none items-center justify-center rounded-[6px] border-2 ${
            selected ? "border-[color:var(--wz-category-color)] bg-[color:var(--wz-category-color)]" : "border-border-control"
          }`}
        >
          {selected && (
            <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
              <path
                d="M2.5 6.2L4.8 8.5L9.5 3.5"
                stroke="var(--color-page)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-text">{skill.label}</span>
          <span className="mt-0.5 block text-xs leading-5 text-text-muted">{skill.description}</span>
        </span>
      </label>
      {stackChips && <div className="px-3 pb-3">{stackChips}</div>}
    </div>
  );
}
