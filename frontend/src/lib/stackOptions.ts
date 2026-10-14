import type { FrameworkOption } from "@/types/zenflow";

export interface LanguageOption {
  key: string;
  label: string;
  archFile: string;
}

// Each language maps to a single row backed by its most specific (non-"None") framework,
// since the real GuidelineSelection stores exactly one backend and one frontend arch file.
export function toLanguageOptions(stacks: Record<string, FrameworkOption[]>): LanguageOption[] {
  return Object.entries(stacks).map(([language, frameworks]) => {
    const framework = frameworks[frameworks.length - 1];
    const label = framework.label.startsWith("None") ? language : `${language} — ${framework.label}`;
    return { key: language, label, archFile: framework.arch_file };
  });
}
