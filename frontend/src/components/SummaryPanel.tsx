import { SectionHeading } from "@/components/SectionHeading";
import { WaveVisual } from "@/components/WaveVisual";
import { Button } from "@/components/ui/Button";
import { ASSISTANTS } from "@/data/assistants";
import type { AssistantId } from "@/types/zenflow";

interface SummaryPanelProps {
  assistant: AssistantId;
  stackLabel: string;
  skillCount: number;
  skillFileCount: number;
  waveLevel: number;
  canGenerate: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

export function SummaryPanel({
  assistant,
  stackLabel,
  skillCount,
  skillFileCount,
  waveLevel,
  canGenerate,
  onGenerate,
  onReset,
}: SummaryPanelProps) {
  const assistantLabel = ASSISTANTS.find((item) => item.id === assistant)?.label ?? assistant;

  return (
    <aside className="rounded-panel border-2 border-border bg-surface p-6 lg:sticky lg:top-[120px]">
      <SectionHeading number="03" title="Your wave" />
      <p className="mt-1 text-sm text-text-muted">It grows with every choice you add.</p>
      <WaveVisual level={waveLevel} />

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-muted">Assistant</dt>
          <dd className="m-0 text-right font-semibold text-text">{assistantLabel}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-muted">Stack</dt>
          <dd className="m-0 text-right font-semibold text-text">{stackLabel || "No stack chosen"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-muted">Skills</dt>
          <dd className="m-0 text-right font-semibold text-text">{skillCount} selected</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-text-muted">Skill files</dt>
          <dd className="m-0 text-right font-semibold text-text">{skillFileCount}</dd>
        </div>
      </dl>

      {skillCount === 0 && (
        <p className="mt-4 text-xs leading-5 text-text-muted">Select at least one skill to generate an archive.</p>
      )}

      <div className="mt-5 hidden items-center justify-between gap-3 lg:flex">
        <Button variant="primary" onClick={onGenerate} disabled={!canGenerate}>
          Generate
        </Button>
        <Button variant="link" onClick={onReset}>
          Reset
        </Button>
      </div>
    </aside>
  );
}
