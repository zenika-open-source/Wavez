import type { LanguageOption } from "@/lib/stack";

interface StackChipsProps {
  label: string;
  options: LanguageOption[];
  selected: string;
  onSelect: (archFile: string) => void;
  required?: boolean;
}

export function StackChips({ label, options, selected, onSelect, required = false }: StackChipsProps) {
  const missing = required && !selected;

  return (
    <div className="flex flex-col gap-1.5">
      {options.length > 0 && (
        <div role="group" aria-label={label} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">{label}</span>
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
          >
            {options.map((option) => {
              const isSelected = option.archFile === selected;
              return (
                <button
                  key={option.key}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${option.language}${option.frameworkLabel ? `, ${option.frameworkLabel}` : ""}`}
                  onClick={() => {
                    if (!isSelected) onSelect(option.archFile);
                  }}
                  className={`flex min-h-12 min-w-0 items-center gap-2 rounded-control border-2 px-2 py-2 text-left transition-colors ${
                    isSelected
                      ? "border-[color:var(--wz-category-color)] bg-[color-mix(in_srgb,var(--wz-category-color)_14%,var(--color-surface))] text-text"
                      : "border-border bg-page text-text hover:border-border-strong"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2 ${
                      isSelected
                        ? "border-[color:var(--wz-category-color)] bg-[color:var(--wz-category-color)]"
                        : "border-border-control"
                    }`}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-xs font-semibold leading-tight">{option.language}</span>
                    {option.frameworkLabel && (
                      <span className="break-words text-[11px] leading-tight text-text-muted">
                        {option.frameworkLabel}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      {missing && (
        <div role="alert" className="text-xs font-semibold text-accent-strong">
          Required — select one to continue.
        </div>
      )}
    </div>
  );
}
