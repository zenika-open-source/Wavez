import Image from "next/image";
import { ASSISTANTS } from "@/data/assistants";
import type { AssistantId } from "@/types/wavez";

interface AssistantPickerProps {
  selected: AssistantId;
  onSelect: (id: AssistantId) => void;
}

export function AssistantPicker({ selected, onSelect }: AssistantPickerProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Assistant</legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {ASSISTANTS.map((assistant) => (
          <label
            key={assistant.id}
            className={`relative flex cursor-pointer items-center gap-2.5 rounded-control border-2 px-3 py-2.5 transition-[transform,background-color,border-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 ${
              selected === assistant.id
                ? "border-accent bg-surface-raised"
                : "border-border bg-surface hover:border-border-strong"
            } [&:has(input:focus-visible)]:outline [&:has(input:focus-visible)]:outline-3 [&:has(input:focus-visible)]:outline-accent-strong [&:has(input:focus-visible)]:outline-offset-2`}
          >
            <input
              type="radio"
              name="assistant"
              value={assistant.id}
              checked={selected === assistant.id}
              onChange={() => onSelect(assistant.id)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`h-5 w-5 flex-none rounded-full border-2 ${
                selected === assistant.id
                  ? "border-accent bg-accent shadow-[inset_0_0_0_4px_var(--color-surface-raised)]"
                  : "border-border-control"
              }`}
            />
            <span className="min-w-0 flex-1 text-sm leading-[1.3] font-semibold whitespace-nowrap text-text">
              {assistant.label}
            </span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-border bg-page"
            >
              <Image src={assistant.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" unoptimized />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
