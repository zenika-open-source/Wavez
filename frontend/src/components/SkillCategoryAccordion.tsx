import { CategoryCard } from "@/components/CategoryCard";
import type { SkillCategory, SkillMode } from "@/types/skills";
import type { StackCatalog } from "@/types/zenflow";

// Categories stack in two independent columns, so a short card isn't stretched to
// match a tall neighbour. On mobile the columns dissolve into one list in data order.
const RIGHT_COLUMN = new Set(["developer"]);

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
  const renderCard = (category: SkillCategory) => (
    <CategoryCard
      key={category.id}
      category={category}
      order={categories.indexOf(category)}
      selections={selections}
      onSetMode={onSetMode}
      catalog={category.id === "developer" ? catalog : undefined}
      backendArchFile={backendArchFile}
      frontendArchFile={frontendArchFile}
      onSelectBackend={onSelectBackend}
      onSelectFrontend={onSelectFrontend}
    />
  );

  return (
    <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
      <div className="contents sm:flex sm:min-w-0 sm:flex-col sm:gap-4">
        {categories.filter((category) => !RIGHT_COLUMN.has(category.id)).map(renderCard)}
      </div>
      <div className="contents sm:flex sm:min-w-0 sm:flex-col sm:gap-4">
        {categories.filter((category) => RIGHT_COLUMN.has(category.id)).map(renderCard)}
      </div>
    </div>
  );
}
