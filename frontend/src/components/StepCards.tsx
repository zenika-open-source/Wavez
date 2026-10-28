import type { CSSProperties, ReactNode } from "react";

export interface Step {
  title: string;
  detail: string;
  description: string;
  footer?: ReactNode;
  /** Overrides the group colour for this step. */
  color?: string;
}

const COLUMNS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

// On large screens the cards share subgrid rows, so titles, details and
// descriptions line up across the row whatever their length.
export function StepCards({ steps, color }: { steps: Step[]; color: string }) {
  const hasFooter = steps.some((step) => step.footer);

  return (
    <ol
      className={`m-0 flex list-none flex-col gap-4 p-0 lg:grid lg:gap-x-4 lg:gap-y-0 ${COLUMNS[steps.length] ?? "lg:grid-cols-3"}`}
      style={{ "--wz-step-color": color } as CSSProperties}
    >
      {steps.map((step, index) => (
        <li
          key={step.title}
          style={step.color ? ({ "--wz-step-color": step.color } as CSSProperties) : undefined}
          className={`flex min-w-0 flex-col content-start gap-1.5 rounded-[14px] border border-border bg-surface p-[18px] shadow-[inset_0_3px_0_var(--wz-step-color)] transition-colors duration-150 hover:border-border-strong lg:grid lg:grid-rows-subgrid ${hasFooter ? "lg:row-span-4" : "lg:row-span-3"}`}
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 border-(--wz-step-color) bg-page font-mono text-[13px] font-medium text-(--wz-step-color)">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="m-0 text-[17px] leading-[1.3] font-bold text-text">{step.title}</h3>
          </div>
          <span className="font-mono text-xs text-text-muted">{step.detail}</span>
          <p className="m-0 mt-1 text-[15px] text-text-soft">{step.description}</p>
          {hasFooter && <div className="self-end pt-1.5">{step.footer}</div>}
        </li>
      ))}
    </ol>
  );
}
