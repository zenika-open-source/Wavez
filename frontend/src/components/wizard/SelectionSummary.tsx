interface SelectionSummaryProps {
  rolesText: string;
  assistantText: string;
  stackText: string;
  skillsCount: number;
  filesCount: number;
  done: boolean;
  canGenerate: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

export function SelectionSummary({
  rolesText,
  assistantText,
  stackText,
  skillsCount,
  filesCount,
  done,
  canGenerate,
  onGenerate,
  onReset,
}: SelectionSummaryProps) {
  const rows: [string, string][] = [
    ["Roles", rolesText],
    ["Assistant", assistantText],
    ["Stack", stackText],
    ["Skills", `${skillsCount} selected`],
    ["Files to export", String(filesCount)],
  ];

  return (
    <aside className="sticky top-[160px] w-[340px] flex-none" aria-label="Your selection">
      <div className="rounded-[14px] border-[1.5px] border-[#B8BEC8] bg-white px-[22px] pt-[22px] pb-[18px]">
        <h2 className="m-0 text-xl font-bold">Your selection</h2>
        <p className="mt-0.5 mb-3.5 text-sm text-[#3C434E]">{done ? "Exported." : "Updates as you choose."}</p>
        <dl className="m-0 p-0">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-0.5 border-t border-[#E3E6EB] py-2.5">
              <dt className="text-[13px] text-[#3C434E]">{label}</dt>
              <dd className="m-0 text-left text-[15px] font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3.5 flex flex-col items-center gap-1.5">
          {done ? (
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer rounded-md border-0 bg-none p-0 text-[14.5px] font-semibold text-[#BB0D5A] underline underline-offset-[3px] hover:text-[#850A41]"
            >
              Start over
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled={!canGenerate}
                onClick={onGenerate}
                className={`min-h-[48px] w-full rounded-[10px] border-0 font-bold text-white disabled:cursor-not-allowed ${
                  canGenerate ? "cursor-pointer hover:brightness-90" : ""
                }`}
                style={
                  canGenerate
                    ? { background: "linear-gradient(90deg,#D6112A,#BB0D5A)" }
                    : { background: "#E1E4EA", color: "#566070" }
                }
              >
                Generate
              </button>
              <button
                type="button"
                onClick={onReset}
                className="cursor-pointer rounded-md border-0 bg-none p-1.5 text-[14.5px] font-semibold text-[#BB0D5A] underline underline-offset-[3px] hover:text-[#850A41]"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
