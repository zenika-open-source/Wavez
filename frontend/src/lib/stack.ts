import type { FrameworkOption, StackCatalog } from "@/types/wavez";

export interface LanguageOption {
  key: string;
  language: string;
  frameworkLabel: string;
  archFile: string;
}

const PLAIN_PREFIX = "None";

// Each language maps to one option backed by its most specific (last) framework,
// since the guideline selection stores exactly one backend and one frontend arch file.
export function toLanguageOptions(stacks: Record<string, FrameworkOption[]>): LanguageOption[] {
  return Object.entries(stacks).flatMap(([language, frameworks]) => {
    const framework = frameworks[frameworks.length - 1];
    if (!framework) return [];
    return [
      {
        key: language,
        language,
        frameworkLabel: framework.label.startsWith(PLAIN_PREFIX) ? "" : framework.label,
        archFile: framework.arch_file,
      },
    ];
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
