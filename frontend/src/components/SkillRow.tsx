import { CheckboxDot } from "@/components/ui/CheckboxDot";
import { ENABLE_CUSTOM_AGENT_FILE } from "@/data/featureFlags";
import type { Skill, SkillMode } from "@/types/skills";

export const SKILL_ROW_GRID_COLUMNS = ENABLE_CUSTOM_AGENT_FILE ? "1fr 56px 76px" : "1fr 56px";

interface SkillRowProps {
  skill: Skill;
  mode: SkillMode;
  color: string;
  onChange: (mode: SkillMode) => void;
}

export function SkillRow({ skill, mode, color, onChange }: SkillRowProps) {
  const disabled = skill.disabled ?? false;
  const effectiveMode = disabled ? "none" : mode;
  const selected = effectiveMode !== "none";

  return (
    <div
      data-selected={selected}
      // Mirrors prototype-A's skill rows: rounded highlight on hover/selection,
      // and an inset divider that hides next to a highlighted row. The px-3
      // padding matches the header's so labels and checkboxes line up with it.
      className={`relative mb-0.5 grid items-center gap-2 rounded-[10px] px-3 py-2 transition-colors duration-150 after:absolute after:inset-x-3 after:-bottom-[1.5px] after:h-px after:bg-[#E3E6EB] after:content-[''] data-[selected=true]:after:hidden [&:has(+[data-selected=true])]:after:hidden ${
        disabled ? "opacity-40" : "hover:bg-[#F3F4F8] hover:after:hidden [&:has(+:hover)]:after:hidden"
      }`}
      style={{
        gridTemplateColumns: SKILL_ROW_GRID_COLUMNS,
        // 8-digit hex: the category color at ~6% opacity, a faint tint like the prototype's #FFF4F8.
        background: selected ? `${color}0f` : undefined,
      }}
    >
      <button
        type="button"
        onClick={() => onChange(effectiveMode === "skill" ? "none" : "skill")}
        disabled={disabled}
        className={`text-left ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="text-[13px] font-bold text-[#5c5560]">{skill.label}</div>
        {skill.sublabel && <div className="mt-0.5 text-xs font-semibold text-[#8a8290]">{skill.sublabel}</div>}
      </button>
      <div className="flex justify-end">
        <CheckboxDot
          name={skill.id}
          color={color}
          checked={effectiveMode === "skill"}
          onSelect={() => onChange(effectiveMode === "skill" ? "none" : "skill")}
          disabled={disabled}
        />
      </div>
      {ENABLE_CUSTOM_AGENT_FILE && (
        <CheckboxDot
          name={skill.id}
          color={color}
          checked={effectiveMode === "custom"}
          onSelect={() => onChange(effectiveMode === "custom" ? "none" : "custom")}
          disabled={disabled}
        />
      )}
    </div>
  );
}
