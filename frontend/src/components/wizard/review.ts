import { ASSISTANTS } from "@/data/assistants";
import { SKILL_CATEGORIES } from "@/data/skillCategories";
import { toLanguageOptions } from "@/lib/stackOptions";
import type { SkillMode } from "@/types/skills";
import type { AssistantId, StackCatalog } from "@/types/zenflow";

export interface ReviewItem {
  id: string;
  name: string;
  stack: string;
  file: string;
}

export interface ReviewGroup {
  name: string;
  items: ReviewItem[];
}

function stackLabelFor(skillId: string, archFile: string, catalog: StackCatalog | null): string {
  if (!archFile) return "";
  const stacks = skillId === "backend" ? catalog?.backend : skillId === "frontend" ? catalog?.frontend : undefined;
  if (!stacks) return "";
  const option = toLanguageOptions(stacks).find((opt) => opt.archFile === archFile);
  return option?.label ?? "";
}

export function buildReviewGroups(
  roles: string[],
  skillSelections: Record<string, SkillMode>,
  assistant: AssistantId,
  backendArchFile: string,
  frontendArchFile: string,
  catalog: StackCatalog | null,
): ReviewGroup[] {
  const path = ASSISTANTS.find((a) => a.id === assistant)?.path ?? "";
  const visible = SKILL_CATEGORIES.filter((category) => roles.includes(category.id));

  return visible
    .map((category) => ({
      name: category.title,
      items: category.skills
        .filter((skill) => (skillSelections[skill.id] ?? "none") !== "none")
        .map((skill) => {
          const stack =
            skill.id === "backend"
              ? stackLabelFor("backend", backendArchFile, catalog)
              : skill.id === "frontend"
                ? stackLabelFor("frontend", frontendArchFile, catalog)
                : "";
          return { id: skill.id, name: skill.label, stack, file: `${path}${skill.id}/SKILL.md` };
        }),
    }))
    .filter((group) => group.items.length > 0);
}

export function stacksSummary(groups: ReviewGroup[]): string {
  const stacks = new Set<string>();
  groups.forEach((group) => group.items.forEach((item) => item.stack && stacks.add(item.stack)));
  return stacks.size ? Array.from(stacks).join(" + ") : "—";
}

export function totalSkills(groups: ReviewGroup[]): number {
  return groups.reduce((sum, group) => sum + group.items.length, 0);
}
