import Image from "next/image";
import { ASSISTANTS } from "@/data/assistants";
import type { AssistantId } from "@/types/zenflow";

interface AssistantPickerProps {
  selected: AssistantId;
  onSelect: (id: AssistantId) => void;
}

export function AssistantPicker({ selected, onSelect }: AssistantPickerProps) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Assistant</legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {ASSISTANTS.map((assistant) => (
          <label
            key={assistant.id}
            className={`relative flex min-h-16 cursor-pointer items-center gap-3 rounded-card border-2 px-4 py-3 transition-[transform,background-color,border-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5 ${
              selected === assistant.id
                ? "border-accent bg-surface-raised"
                : "border-border bg-surface-muted hover:border-border-strong"
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
              className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full border-2 ${
                selected === assistant.id ? "border-accent" : "border-border-control"
              }`}
            >
              {selected === assistant.id && <span className="h-2 w-2 rounded-full bg-accent" />}
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold text-text">{assistant.label}</span>
            <Image
              src={assistant.logo}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 object-contain"
              unoptimized
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
