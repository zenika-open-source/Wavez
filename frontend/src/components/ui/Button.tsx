interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "link";
  disabled?: boolean;
}

export function Button({ children, onClick, variant = "secondary", disabled = false }: ButtonProps) {
  const variantClasses = disabled
    ? "border-border bg-control-disabled text-text-muted"
    : {
        primary: "border-2 border-transparent bg-accent text-on-accent",
        secondary: "border-2 border-border bg-surface text-text",
        link: "border-2 border-transparent bg-transparent px-2 text-accent underline underline-offset-4 hover:text-accent-strong",
      }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 rounded-control px-6 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed ${disabled ? "" : "cursor-pointer"} ${variantClasses}`}
    >
      {children}
    </button>
  );
}
