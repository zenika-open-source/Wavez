import Link from "next/link";

export function DocumentationLink() {
  return (
    <Link
      href="/documentation"
      className="group flex h-12 items-center gap-3 rounded-[14px] border border-border px-4 text-[15px] font-medium text-text-soft transition-colors duration-150 hover:border-border-strong hover:bg-text/8 hover:text-text active:bg-text/16"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="flex-none"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
        <path d="M4 21.5V5.5" />
        <path d="M9 8h7" />
      </svg>
      <span>New to WaveZ? Read the documentation</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="ml-auto flex-none transition-transform duration-150 group-hover:translate-x-[3px]"
      >
        <path d="M5 12h14" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
