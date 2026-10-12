import { CategoryCard } from "@/components/CategoryCard";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

interface SkillCategoryAccordionProps {
  categories: SkillCategory[];
  expandedCategories: Set<string>;
  selections: Record<string, SkillMode>;
  onToggleExpand: (categoryId: string) => void;
  onSetMode: (skillId: string, mode: SkillMode) => void;
  catalog?: StackCatalog | null;
  backendArchFile?: string;
  frontendArchFile?: string;
  onSelectBackend?: (archFile: string) => void;
  onSelectFrontend?: (archFile: string) => void;
}

export function SkillCategoryAccordion({
  categories,
  expandedCategories,
  selections,
  onToggleExpand,
  onSetMode,
  catalog,
  backendArchFile,
  frontendArchFile,
  onSelectBackend,
  onSelectFrontend,
}: SkillCategoryAccordionProps) {
  return (
    <div className="grid grid-cols-2 items-stretch gap-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          expanded={expandedCategories.has(category.id)}
          selections={selections}
          onToggleExpand={() => onToggleExpand(category.id)}
          onSetMode={onSetMode}
          catalog={category.id === "developer" ? catalog : undefined}
          backendArchFile={backendArchFile}
          frontendArchFile={frontendArchFile}
          onSelectBackend={onSelectBackend}
          onSelectFrontend={onSelectFrontend}
        />
      ))}
    </div>
  );
}
