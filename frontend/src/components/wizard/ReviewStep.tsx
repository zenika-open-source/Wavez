import type { ReviewGroup } from "@/components/wizard/review";

interface ReviewStepProps {
  groups: ReviewGroup[];
  onReset: () => void;
}

export function ReviewStep({ groups, onReset }: ReviewStepProps) {
  return (
    <section>
      <h1 className="mb-1 text-[26px] leading-[1.15] font-bold tracking-[-0.01em] text-[#020203]">
        Skills exported
      </h1>
      <p className="mb-4 text-[#3C434E]">
        zenflow-setup.zip should now be in your downloads.{" "}
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer rounded-md border-0 bg-none p-0 text-[14.5px] font-semibold text-[#BB0D5A] underline underline-offset-[3px] hover:text-[#850A41]"
        >
          Start over
        </button>
      </p>
      {groups.map((group) => (
        <div key={group.name} className="mb-2.5 rounded-xl border-[1.5px] border-[#B8BEC8] bg-white px-3.5 py-2.5">
          <h2 className="mb-1 text-[17px] font-bold text-[#020203]">{group.name}</h2>
          <ul className="m-0 list-none p-0">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap justify-between gap-3 border-t border-[#E3E6EB] py-1.5 font-semibold"
              >
                <span>{item.name}</span>
                <span className="text-sm font-normal text-[#3C434E]">{item.stack}</span>
                <code className="flex-[0_0_100%] font-mono text-[12.5px] font-normal break-all text-[#3C434E]">
                  {item.file}
                </code>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
