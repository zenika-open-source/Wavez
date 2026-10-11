import { ASSISTANTS } from "@/data/assistants";
import { RadioRow } from "@/components/ui/RadioRow";
import type { AssistantId } from "@/types/zenflow";

interface AssistantPickerProps {
  selected: AssistantId;
  onSelect: (id: AssistantId) => void;
}

export function AssistantPicker({ selected, onSelect }: AssistantPickerProps) {
  return (
    <div>
      <div className="mb-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#8a8290]">
        Assistant
      </div>
      <div className="flex flex-col gap-2.5">
        {ASSISTANTS.map((assistant) => (
          <RadioRow
            key={assistant.id}
            label={assistant.label}
            checked={selected === assistant.id}
            onSelect={() => onSelect(assistant.id)}
          />
        ))}
      </div>
    </div>
  );
}
