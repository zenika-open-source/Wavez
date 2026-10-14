import { SKILL_CATEGORIES } from "@/data/skillCategories";

interface RoleStepProps {
  roles: string[];
  onToggleRole: (categoryId: string) => void;
}

export function RoleStep({ roles, onToggleRole }: RoleStepProps) {
  return (
    <section>
      <h1 className="mb-1 text-[26px] leading-[1.15] font-bold tracking-[-0.01em] text-[#020203]">
        What&apos;s your role?
      </h1>
      <p className="mb-4 text-[#3C434E]">Pick one or more. Your roles decide which skills you can choose next.</p>
      <div className="rounded-2xl border-[1.5px] border-[#B8BEC8] bg-white p-3.5">
        <div className="mb-2 flex items-center justify-between border-b border-[#E3E6EB] pb-2.5">
          <h2 className="text-[17px] font-bold">Roles</h2>
          <span className="text-sm text-[#3C434E]">
            {roles.length} of {SKILL_CATEGORIES.length} selected
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {SKILL_CATEGORIES.map((category, index) => {
            const on = roles.includes(category.id);
            const prevOn = index > 0 && roles.includes(SKILL_CATEGORIES[index - 1].id);
            return (
              <label
                key={category.id}
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
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggleRole(category.id)}
                  className="sr-only"
                />
                <span
                  className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[6px] border-2"
                  style={{ borderColor: on ? "#BB0D5A" : "#4B5563", background: on ? "#BB0D5A" : "#fff" }}
                >
                  {on && (
                    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                      <path
                        d="M3 8.5l3.2 3L13 4.5"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[15px] leading-[1.3] font-semibold">{category.title}</span>
                  <span className="text-[13.5px] text-[#3C434E]">
                    {category.id === "discovery"
                      ? "PRDs and prototypes"
                      : category.id === "developer"
                        ? "Code, docs and reviews"
                        : "Test planning and automation"}
                  </span>
                </span>
                <span className="ml-auto flex-none self-center rounded-full bg-[#EAECF1] px-2.5 py-0.5 text-[13px] font-semibold whitespace-nowrap text-[#2B313B]">
                  {category.skills.length} skills
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </section>
  );
}
