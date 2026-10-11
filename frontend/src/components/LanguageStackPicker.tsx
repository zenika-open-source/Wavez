import { RadioDot } from "@/components/ui/RadioDot";
import type { FrameworkOption, StackCatalog } from "@/types/zenflow";

interface LanguageOption {
  key: string;
  label: string;
  archFile: string;
}

// Each language maps to a single row backed by its most specific (non-"None") framework,
// since the real GuidelineSelection stores exactly one backend and one frontend arch file.
function toLanguageOptions(stacks: Record<string, FrameworkOption[]>): LanguageOption[] {
  return Object.entries(stacks).map(([language, frameworks]) => {
    const framework = frameworks[frameworks.length - 1];
    const label = framework.label.startsWith("None") ? language : `${language} — ${framework.label}`;
    return { key: language, label, archFile: framework.arch_file };
  });
}

interface LanguageGroupProps {
  title: string;
  options: LanguageOption[];
  selected: string;
  onSelect: (archFile: string) => void;
}

function LanguageGroup({ title, options, selected, onSelect }: LanguageGroupProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[13px] font-extrabold text-[#161217]">{title}</div>
      {options.map((option) => (
        <label key={option.key} className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
          <RadioDot
            name={title}
            color="#c81c5c"
            checked={option.archFile === selected}
            onSelect={() => onSelect(option.archFile === selected ? "" : option.archFile)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

interface LanguageStackPickerProps {
  catalog: StackCatalog;
  backendArchFile: string;
  frontendArchFile: string;
  onSelectBackend: (archFile: string) => void;
  onSelectFrontend: (archFile: string) => void;
}

export function LanguageStackPicker({
  catalog,
  backendArchFile,
  frontendArchFile,
  onSelectBackend,
  onSelectFrontend,
}: LanguageStackPickerProps) {
  const backendOptions = toLanguageOptions(catalog.backend);
  const frontendOptions = toLanguageOptions(catalog.frontend);

  return (
    <div className="flex w-[300px] flex-none flex-col gap-3 border-l-[1.5px] border-[#cfe9dc] bg-[#f3faf6] px-5 py-4">
      <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#1c8a5c]">
        Language / stack{" "}
        <span className="font-semibold tracking-normal text-[#5c5560] normal-case">
          · applies to the agents
        </span>
      </div>
      <LanguageGroup title="Backend" options={backendOptions} selected={backendArchFile} onSelect={onSelectBackend} />
      <LanguageGroup title="Frontend" options={frontendOptions} selected={frontendArchFile} onSelect={onSelectFrontend} />
    </div>
  );
}
