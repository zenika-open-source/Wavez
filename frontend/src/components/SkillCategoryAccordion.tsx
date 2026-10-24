import { CategoryCard } from "@/components/CategoryCard";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

interface SkillCategoryAccordionProps {
  categories: SkillCategory[];
  selections: Record<string, SkillMode>;
  onSetMode: (skillId: string, mode: SkillMode) => void;
  catalog?: StackCatalog | null;
  backendArchFile?: string;
  frontendArchFile?: string;
  onSelectBackend?: (archFile: string) => void;
  onSelectFrontend?: (archFile: string) => void;
}

export function SkillCategoryAccordion({
  categories,
  selections,
  onSetMode,
  catalog,
  backendArchFile,
  frontendArchFile,
  onSelectBackend,
  onSelectFrontend,
}: SkillCategoryAccordionProps) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-2">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          selections={selections}
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
