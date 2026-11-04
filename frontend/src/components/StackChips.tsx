"use client";

import { useState } from "react";
import type { LanguageOption } from "@/lib/stack";

interface StackChipsProps {
  label: string;
  options: LanguageOption[];
  selected: string;
  onSelect: (archFile: string) => void;
  required?: boolean;
  /** When set, only these languages get their own chip; the rest are grouped under "Others". */
  primaryLanguages?: string[];
}

const CHIP_BASE = "flex min-w-0 items-center gap-2 rounded-control border-2 py-2 pr-2 pl-2.5 text-left transition-colors";
const CHIP_SELECTED =
  "border-[color:var(--wz-category-color)] bg-[color-mix(in_srgb,var(--wz-category-color)_18%,var(--color-surface))] text-text";
const CHIP_IDLE = "border-border bg-page text-text hover:border-border-strong";

function describe(option: LanguageOption) {
  return option.frameworkLabel ? `${option.language}, ${option.frameworkLabel}` : option.language;
}

function Dot({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-3.5 w-3.5 flex-none items-center justify-center rounded-full border-2 ${
        selected
          ? "border-[color:var(--wz-category-color)] bg-[color:var(--wz-category-color)] shadow-[inset_0_0_0_2px_color-mix(in_srgb,var(--wz-category-color)_18%,var(--color-surface))]"
          : "border-border-control"
      }`}
    />
  );
}

function ChipText({ title, detail }: { title: string; detail?: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      <span className="text-sm font-semibold whitespace-nowrap">{title}</span>
      {detail && <span className="text-xs leading-[1.3] break-words text-text-muted">{detail}</span>}
    </span>
  );
}

function OptionChip({
  option,
  selected,
  onSelect,
}: {
  option: LanguageOption;
  selected: boolean;
  onSelect: (archFile: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={describe(option)}
      onClick={() => onSelect(option.archFile)}
      className={`${CHIP_BASE} ${selected ? CHIP_SELECTED : CHIP_IDLE}`}
    >
      <Dot selected={selected} />
      <ChipText title={option.language} detail={option.frameworkLabel} />
    </button>
  );
}

export function StackChips({
  label,
  options,
  selected,
  onSelect,
  required = false,
  primaryLanguages,
}: StackChipsProps) {
  const [othersOpen, setOthersOpen] = useState(false);
  const missing = required && !selected;

  const primary = primaryLanguages ? options.filter((o) => primaryLanguages.includes(o.language)) : options;
  const others = primaryLanguages ? options.filter((o) => !primaryLanguages.includes(o.language)) : [];
  const hasOthers = others.length > 0;
  const selectedOther = others.find((o) => o.archFile === selected);
  const othersExpanded = othersOpen;
  const panelId = `${label.replace(/\W+/g, "-").toLowerCase()}-others`;

  // Up to three chips fit on one row of a skill card; beyond that, wrap into a 2-column grid.
  const rowCount = primary.length + (hasOthers ? 1 : 0);
  const columns = rowCount > 3 ? 2 : rowCount;

  return (
    <div className="flex flex-col gap-1.5">
      {options.length > 0 && (
        <div role="group" aria-label={label} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-[0.08em] text-text-muted">{label}</span>
          <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {primary.map((option) => (
              <OptionChip
                key={option.key}
                option={option}
                selected={option.archFile === selected}
                onSelect={onSelect}
              />
            ))}
            {hasOthers && (
              <button
                type="button"
                aria-expanded={othersExpanded}
                aria-controls={panelId}
                aria-label={selectedOther ? `Others: ${describe(selectedOther)}` : "Others"}
                onClick={() => setOthersOpen(!othersExpanded)}
                className={`${CHIP_BASE} ${selectedOther ? CHIP_SELECTED : CHIP_IDLE}`}
              >
                <Dot selected={Boolean(selectedOther)} />
                <ChipText
                  title={selectedOther ? selectedOther.language : "Others"}
                  detail={selectedOther?.frameworkLabel}
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-3.5 w-3.5 flex-none text-text-muted transition-transform duration-200 ${othersExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 8 5 5 5-5" />
                </svg>
              </button>
            )}
          </div>
          {hasOthers && othersExpanded && (
            <div id={panelId} className="grid grid-cols-2 gap-1.5">
              {others.map((option) => (
                <OptionChip
                  key={option.key}
                  option={option}
                  selected={option.archFile === selected}
                  onSelect={(archFile) => {
                    onSelect(archFile);
                    setOthersOpen(false);
                  }}
                />
              ))}
            </div>
          )}
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
