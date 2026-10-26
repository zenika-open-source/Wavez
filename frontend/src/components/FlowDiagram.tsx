export interface FlowStep {
  title: string;
  detail: string;
  description: string;
  swatch: string;
}

export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="mt-6 flex flex-col items-stretch gap-2 lg:flex-row lg:gap-0">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="flex min-w-0 flex-col items-center gap-2 lg:flex-1 lg:flex-row lg:gap-0"
        >
          <div className="relative h-full w-full rounded-card border border-border bg-surface p-4">
            <span
              className={`absolute inset-x-0 top-0 h-1 rounded-t-card ${step.swatch}`}
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 font-display text-base leading-snug font-bold text-text">
              {step.title}
            </h3>
            <p className="mt-1 font-mono text-xs text-text-muted">
              {step.detail}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">
              {step.description}
            </p>
          </div>
          {index < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="flex-none px-2 text-xl text-accent"
            >
              <span className="lg:hidden">↓</span>
              <span className="hidden lg:inline">→</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
