interface SectionHeadingProps {
  number: "01" | "02" | "03";
  title: string;
  size?: "md" | "lg";
}

export function SectionHeading({ number, title, size = "md" }: SectionHeadingProps) {
  return (
    <div className={`flex items-baseline ${size === "lg" ? "gap-3.5" : "gap-3"}`}>
      <span aria-hidden="true" className="font-mono text-sm text-accent">
        {number}
      </span>
      <h2
        className={`font-display leading-[1.5] font-bold tracking-[-0.01em] text-text ${
          size === "lg" ? "text-[26px]" : "text-[22px]"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
