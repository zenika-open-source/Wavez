import { LanguageStackPicker } from "@/components/LanguageStackPicker";
import { SkillRow, SKILL_ROW_GRID_COLUMNS } from "@/components/SkillRow";
import { ENABLE_CUSTOM_AGENT_FILE } from "@/data/featureFlags";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

const GRID_PLACEMENT: Record<string, string> = {
  discovery: "order-0",
  qa: "order-1",
  developer: "order-2 col-span-2",
};

interface CategoryCardProps {
  category: SkillCategory;
  expanded: boolean;
  selections: Record<string, SkillMode>;
  onToggleExpand: () => void;
  onSetMode: (skillId: string, mode: SkillMode) => void;
  catalog?: StackCatalog | null;
  backendArchFile?: string;
  frontendArchFile?: string;
  onSelectBackend?: (archFile: string) => void;
  onSelectFrontend?: (archFile: string) => void;
}

export function CategoryCard({
  category,
  expanded,
  selections,
  onToggleExpand,
  onSetMode,
  catalog,
  backendArchFile,
  frontendArchFile,
  onSelectBackend,
  onSelectFrontend,
}: CategoryCardProps) {
  const selectableSkills = category.skills.filter((skill) => !skill.disabled);
  const selectedCount = selectableSkills.filter((skill) => (selections[skill.id] ?? "none") !== "none").length;
  const allSelected = selectableSkills.length > 0 && selectedCount === selectableSkills.length;
  const disabled = category.disabled ?? false;
  const showStack = category.id === "developer";
  // Collapsing leaves an unevenly-sized card next to its neighbor, so collapsing is
  // disabled for all categories for now.
  const collapsible = false;

  function handleToggleAll() {
    const nextMode: SkillMode = allSelected ? "none" : "skill";
    selectableSkills.forEach((skill) => onSetMode(skill.id, nextMode));
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_28px_-18px_rgba(60,20,50,0.25)] ${
        GRID_PLACEMENT[category.id] ?? ""
      } ${disabled ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        onClick={collapsible ? onToggleExpand : undefined}
        disabled={disabled}
        className={`flex w-full items-center gap-3 px-5 py-4 text-left ${
          disabled || !collapsible ? "cursor-default" : "cursor-pointer"
        }`}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-bold"
          style={{ background: category.tint, color: category.color }}
        >
          {category.title}
        </div>
        <span className="text-xs font-extrabold text-[#8a8290]">
          {disabled ? "Coming soon" : `${selectedCount} selected`}
        </span>
        <span className="flex-1" />
        {collapsible && (
          <span
            className="inline-block text-[#8a8290] transition-transform duration-150"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            ▾
          </span>
        )}
      </button>
      {!disabled && expanded && (
        <div className="flex flex-1 items-stretch border-t-[1.5px] border-[#f0e6ec]">
          <div className="min-w-0 flex-1 px-5 pt-4 pb-5">
            <div
              className="mb-2 grid gap-2 border-b-[1.5px] border-[#f0e6ec] pb-2 text-[11px] font-extrabold tracking-[0.08em] text-[#8a8290] uppercase"
              style={{ gridTemplateColumns: SKILL_ROW_GRID_COLUMNS }}
            >
              <div>Agent Skills</div>
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleToggleAll}
                  disabled={selectableSkills.length === 0}
                  className="cursor-pointer text-xs font-bold tracking-normal whitespace-nowrap normal-case hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
                  style={{ color: category.color }}
                >
                  {allSelected ? "Clear all" : "Select all"}
                </button>
              </div>
              {ENABLE_CUSTOM_AGENT_FILE && <div className="text-center leading-tight">Custom agent file</div>}
            </div>
            {category.skills.map((skill) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                mode={selections[skill.id] ?? "none"}
                color={category.color}
                onChange={(mode) => onSetMode(skill.id, mode)}
              />
            ))}
          </div>
          {showStack && catalog && onSelectBackend && onSelectFrontend && (
            <LanguageStackPicker
              catalog={catalog}
              backendArchFile={backendArchFile ?? ""}
              frontendArchFile={frontendArchFile ?? ""}
              onSelectBackend={onSelectBackend}
              onSelectFrontend={onSelectFrontend}
              backendRequired={(selections["backend"] ?? "none") !== "none"}
              frontendRequired={(selections["frontend"] ?? "none") !== "none"}
            />
          )}
        </div>
      )}
    </div>
  );
}
