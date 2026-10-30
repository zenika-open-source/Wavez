import type { FrameworkOption, StackCatalog } from "@/types/wavez";

export interface LanguageOption {
  key: string;
  language: string;
  frameworkLabel: string;
  archFile: string;
}

const PLAIN_PREFIX = "None";

// Each framework of a language becomes its own option, since the guideline selection
// stores exactly one backend and one frontend arch file. The "None (plain ...)" entry is
// only used for a language that has no framework to pick.
export function toLanguageOptions(stacks: Record<string, FrameworkOption[]>): LanguageOption[] {
  return Object.entries(stacks).flatMap(([language, frameworks]) => {
    const withFramework = frameworks.filter((framework) => !framework.label.startsWith(PLAIN_PREFIX));
    const candidates = withFramework.length > 0 ? withFramework : frameworks.slice(0, 1);
    return candidates.map((framework) => ({
      key: framework.arch_file,
      language,
      frameworkLabel: framework.label.startsWith(PLAIN_PREFIX) ? "" : framework.label,
      archFile: framework.arch_file,
    }));
  });
}

export function describeStack(catalog: StackCatalog | null, archFile: string): string {
  if (!catalog || !archFile) return "";

  for (const stacks of [catalog.backend, catalog.frontend]) {
    const option = toLanguageOptions(stacks).find((item) => item.archFile === archFile);
    if (option) {
      return option.frameworkLabel ? `${option.language} / ${option.frameworkLabel}` : option.language;
    }
  }

  return "";
}
