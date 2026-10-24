interface SectionHeadingProps {
  number: "01" | "02" | "03";
  title: string;
}

export function SectionHeading({ number, title }: SectionHeadingProps) {
  return (
    <div className="flex items-baseline gap-3">
      <span aria-hidden="true" className="font-mono text-sm text-accent">
        {number}
      </span>
      <h2 className="font-display text-[22px] leading-tight font-bold tracking-tight text-text">{title}</h2>
    </div>
  );
}
