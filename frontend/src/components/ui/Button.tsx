interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "link";
  /** "xl" is the summary's Generate button; "lg" the dialog's Download archive. */
  size?: "md" | "lg" | "xl";
  disabled?: boolean;
}

export function Button({ children, onClick, variant = "secondary", size = "md", disabled = false }: ButtonProps) {
  const variantClasses = disabled
    ? "border-2 border-transparent bg-control-disabled text-text-muted"
    : {
        primary: "border-2 border-transparent bg-accent text-on-accent",
        secondary: "border-2 border-border bg-surface text-text",
        link: "border-0 bg-transparent text-text-soft underline underline-offset-[3px] hover:text-text",
      }[variant];
  const sizeClasses =
    variant === "link"
      ? "px-2 py-3 text-base leading-[normal] font-semibold"
      : {
          md: "px-6 py-3 text-base font-semibold",
          lg: "px-6 py-[13px] text-[17px] leading-[normal] font-bold",
          xl: "px-7 py-3.5 text-[17px] leading-[normal] font-bold",
        }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 rounded-control transition-colors disabled:cursor-not-allowed ${disabled ? "" : "cursor-pointer"} ${sizeClasses} ${variantClasses}`}
    >
      {children}
    </button>
  );
}
