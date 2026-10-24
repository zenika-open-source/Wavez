import { SkillRow } from "@/components/SkillRow";
import { StackChips } from "@/components/StackChips";
import { toLanguageOptions } from "@/lib/stack";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

interface CategoryCardProps {
  category: SkillCategory;
  /** Position in the single-column mobile list. */
  order: number;
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
  order,
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
      style={{ order }}
      className={`wz-category-${category.key} flex min-w-0 flex-col rounded-card border-2 border-border bg-surface px-4 py-3 ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <header className="mb-2 flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 className="inline-block rounded-full bg-[color-mix(in_srgb,var(--wz-category-color)_12%,var(--color-surface))] px-3 py-[3px] text-base leading-[1.4] font-semibold whitespace-nowrap text-[color:var(--wz-category-color)]">
          {category.title}
        </h3>
        <span
          aria-label={disabled ? undefined : `${selectedCount} of ${selectableSkills.length} selected`}
          className="flex-1 text-[13px] whitespace-nowrap text-text-muted"
        >
          {disabled ? "Coming soon" : `${selectedCount} of ${selectableSkills.length}`}
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={handleToggleAll}
            disabled={selectableSkills.length === 0}
            className="shrink-0 cursor-pointer px-0.5 py-1.5 text-sm leading-[normal] font-semibold whitespace-nowrap text-[color:var(--wz-category-color)] underline underline-offset-[3px] hover:text-text disabled:cursor-not-allowed disabled:opacity-40 disabled:no-underline"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
        )}
      </header>
      {!disabled && (
        <div className="flex min-w-0 flex-col gap-1">
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
