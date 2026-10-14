const STEP_LABELS = ["Role", "Skills", "Assistant", "Generate"];

interface StepNavProps {
  step: number;
  reach: number;
  done: boolean;
  onJump: (step: number) => void;
}

export function StepNav({ step, reach, done, onJump }: StepNavProps) {
  return (
    <nav
      aria-label="Steps"
      className="sticky top-[72px] z-[9] bg-[#F5F5F8] pt-3.5"
    >
      <div className="mx-auto flex max-w-[992px] gap-2.5 px-6">
        {STEP_LABELS.map((label, index) => {
          const n = index + 1;
          const isDone = n < step || (n === 4 && done);
          const isCurrent = n === step && !isDone;
          const disabled = n > reach || done;

          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => onJump(n)}
              aria-current={n === step ? "step" : undefined}
              className="group relative flex flex-1 cursor-pointer items-center gap-2.5 border-0 bg-none py-1 pb-3.5 text-left disabled:cursor-default"
            >
              <span
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 text-sm font-bold"
                style={
                  isCurrent
                    ? { background: "#BB0D5A", borderColor: "#BB0D5A", color: "#fff" }
                    : isDone
                      ? { background: "#020203", borderColor: "#020203", color: "#fff" }
                      : { background: "#fff", borderColor: "#6B7280", color: "#020203" }
                }
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M3 8.5l3.2 3L13 4.5"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  n
                )}
              </span>
              <span
                className={`text-[15px] font-semibold group-enabled:group-hover:underline ${
                  isCurrent || isDone ? "text-[#020203]" : "text-[#3C434E]"
                }`}
              >
                {label}
              </span>
              <span
                className="absolute inset-x-0 bottom-0 h-1 rounded-sm"
                style={{
                  background: isDone || isCurrent ? "linear-gradient(90deg,#FB1626,#BB0D5A)" : "#D5D9E0",
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
