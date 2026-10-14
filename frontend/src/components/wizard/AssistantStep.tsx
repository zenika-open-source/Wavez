import { ASSISTANTS } from "@/data/assistants";
import type { AssistantId } from "@/types/zenflow";

interface AssistantStepProps {
  assistant: AssistantId | null;
  onSelect: (id: AssistantId) => void;
}

export function AssistantStep({ assistant, onSelect }: AssistantStepProps) {
  return (
    <section>
      <h1 className="mb-1 text-[26px] leading-[1.15] font-bold tracking-[-0.01em] text-[#020203]">
        Which assistant do you use?
      </h1>
      <p className="mb-4 text-[#3C434E]">Skills are exported to the folder your assistant reads.</p>
      <div className="rounded-2xl border-[1.5px] border-[#B8BEC8] bg-white p-3.5">
        <div className="mb-2 flex items-center justify-between border-b border-[#E3E6EB] pb-2.5">
          <h2 className="text-[17px] font-bold">Assistant</h2>
          <span className="text-sm text-[#3C434E]">
            {assistant ? ASSISTANTS.find((a) => a.id === assistant)?.label : "Choose one"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5" role="radiogroup" aria-label="Assistant">
          {ASSISTANTS.map((option, index) => {
            const on = assistant === option.id;
            const prevOn = index > 0 && assistant === ASSISTANTS[index - 1].id;
            return (
              <label
                key={option.id}
                className={`relative flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] p-3 transition-colors duration-100 ${
                  on
                    ? "border-[#BB0D5A] bg-[#FFF4F8] shadow-[inset_0_0_0_1px_#BB0D5A]"
                    : "border-transparent hover:border-[#4B5563] hover:bg-[#FBFBFD]"
                } ${
                  index > 0 && !on && !prevOn
                    ? "before:absolute before:inset-x-3 before:top-[-2px] before:h-px before:bg-[#E3E6EB] hover:before:bg-transparent"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="assistant"
                  checked={on}
                  onChange={() => onSelect(option.id)}
                  className="sr-only"
                />
                <span
                  className="h-[18px] w-[18px] flex-none rounded-full border-2 bg-white"
                  style={on ? { borderWidth: "5px", borderColor: "#BB0D5A" } : { borderColor: "#4B5563" }}
                />
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[15px] leading-[1.3] font-semibold">{option.label}</span>
                  <code className="font-mono text-[13px] text-[#3C434E]">{option.path}</code>
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
