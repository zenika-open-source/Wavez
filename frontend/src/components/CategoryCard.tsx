import { SkillRow } from "@/components/SkillRow";
import { StackChips } from "@/components/StackChips";
import { toLanguageOptions } from "@/lib/stack";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

const GRID_PLACEMENT: Record<string, string> = {
  discovery: "order-0",
  developer: "order-1 sm:row-span-2",
  qa: "order-2",
};

interface CategoryCardProps {
  category: SkillCategory;
  selections: Record<string, SkillMode>;
  onSetMode: (skillId: string, mode: SkillMode) => void;
  catalog?: StackCatalog | null;
  backendArchFile?: string;
  frontendArchFile?: string;
  onSelectBackend?: (archFile: string) => void;
  onSelectFrontend?: (archFile: string) => void;
}

export function CategoryCard({
  category,
  selections,
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

  function handleToggleAll() {
    const nextMode: SkillMode = allSelected ? "none" : "skill";
    selectableSkills.forEach((skill) => onSetMode(skill.id, nextMode));
  }

  return (
    <section
      data-category={category.key}
      className={`wz-category-${category.key} flex min-w-0 flex-col overflow-hidden rounded-panel border-2 border-border bg-surface ${
        GRID_PLACEMENT[category.id] ?? ""
      } ${disabled ? "opacity-50" : ""}`}
    >
      <header className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3 sm:flex sm:gap-3 sm:px-5 sm:py-4">
        <h3 className="col-start-1 row-start-1 inline-flex w-fit max-w-full rounded-full bg-[color-mix(in_srgb,var(--wz-category-color)_12%,var(--color-surface))] px-3 py-1.5 text-sm font-bold text-[color:var(--wz-category-color)]">
          {category.title}
        </h3>
        <span className="col-start-1 row-start-2 min-w-0 text-xs font-medium text-text-muted sm:flex-1">
          {disabled ? "Coming soon" : `${selectedCount} of ${selectableSkills.length} selected`}
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={handleToggleAll}
            disabled={selectableSkills.length === 0}
            className="col-start-2 row-start-2 min-h-10 shrink-0 cursor-pointer text-sm font-semibold text-accent underline underline-offset-4 hover:text-accent-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline sm:row-auto"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        )}
      </header>
      {!disabled && (
        <div className="min-w-0 flex-1 px-4 py-3">
          {category.skills.map((skill) => {
            const mode = selections[skill.id] ?? "none";
            const isBackend = skill.id === "backend";
            const isFrontend = skill.id === "frontend";
            const stackOptions = catalog
              ? toLanguageOptions(isBackend ? catalog.backend : catalog.frontend)
              : [];
            const onSelectStack = isBackend ? onSelectBackend : isFrontend ? onSelectFrontend : undefined;
            const selectedStack = isBackend ? backendArchFile : frontendArchFile;
            const stackLabel = isBackend ? "Language / stack" : "Framework";
            const showStackPicker =
              (isBackend || isFrontend) &&
              onSelectStack &&
              (stackOptions.length > 0 || mode !== "none");

            return (
              <SkillRow
                key={skill.id}
                skill={skill}
                mode={mode}
                categoryKey={category.key}
                onChange={(nextMode) => onSetMode(skill.id, nextMode)}
                stackChips={
                  showStackPicker ? (
                    <StackChips
                      label={stackLabel}
                      options={stackOptions}
                      selected={selectedStack ?? ""}
                      onSelect={onSelectStack}
                      required={mode !== "none"}
                    />
                  ) : undefined
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
