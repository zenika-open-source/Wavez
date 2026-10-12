const STEPS = [
  { number: 1, label: "Choose your assistant" },
  { number: 2, label: "Choose your skills" },
  { number: 3, label: "Hit Generate" },
];

export function StepGuide() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-[20px] bg-white px-6 py-4 shadow-[0_12px_28px_-18px_rgba(60,20,50,0.25)]">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex flex-1 items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#fbe7ee] text-xs font-extrabold text-[#c81c5c]">
              {step.number}
            </span>
            <span className="text-sm font-bold whitespace-nowrap text-[#5c5560]">{step.label}</span>
          </div>
          {index < STEPS.length - 1 && <span className="h-px flex-1 bg-[#f0e6ec]" />}
        </div>
      ))}
    </div>
  );
}
