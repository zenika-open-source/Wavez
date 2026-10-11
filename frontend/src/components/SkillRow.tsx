import { RadioDot } from "@/components/ui/RadioDot";
import { ENABLE_CUSTOM_AGENT_FILE } from "@/data/featureFlags";
import type { Skill, SkillMode } from "@/types/skills";

export const SKILL_ROW_GRID_COLUMNS = ENABLE_CUSTOM_AGENT_FILE ? "1fr 56px 56px 76px" : "1fr 56px 110px";

interface SkillRowProps {
  skill: Skill;
  mode: SkillMode;
  color: string;
  onChange: (mode: SkillMode) => void;
}

export function SkillRow({ skill, mode, color, onChange }: SkillRowProps) {
  const disabled = skill.disabled ?? false;
  const effectiveMode = disabled ? "none" : mode;

  return (
    <div
      className="grid items-center gap-2 border-b border-[#f6f0f3] py-2.5"
      style={{ gridTemplateColumns: SKILL_ROW_GRID_COLUMNS }}
    >
      <div className={effectiveMode === "none" ? "opacity-40" : ""}>
        <div className="text-[13px] font-bold">{skill.label}</div>
        {skill.sublabel && <div className="mt-0.5 text-xs font-semibold text-[#8a8290]">{skill.sublabel}</div>}
      </div>
      <RadioDot
        name={skill.id}
        color="#8a8290"
        checked={effectiveMode === "none"}
        onSelect={() => onChange("none")}
        disabled={disabled}
      />
      <RadioDot
        name={skill.id}
        color={color}
        checked={effectiveMode === "skill"}
        onSelect={() => onChange("skill")}
        disabled={disabled}
      />
      {ENABLE_CUSTOM_AGENT_FILE && (
        <RadioDot
          name={skill.id}
          color={color}
          checked={effectiveMode === "custom"}
          onSelect={() => onChange("custom")}
          disabled={disabled}
        />
      )}
    </div>
  );
}
