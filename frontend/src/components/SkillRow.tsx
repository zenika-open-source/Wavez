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
        className="flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 transition-colors [&:has(input:focus-visible)]:outline [&:has(input:focus-visible)]:outline-2 [&:has(input:focus-visible)]:outline-accent-strong"
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2.5 7.5l3 3 6-7"
                stroke="var(--color-on-accent)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="text-[15px] leading-[1.3] font-semibold text-text">{skill.label}</span>
          <span className="text-[13px] leading-[1.35] text-text-muted">{skill.description}</span>
        </span>
      </label>
      {stackChips && <div className="px-3 pb-3">{stackChips}</div>}
    </div>
  );
}
