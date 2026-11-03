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
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        <path d="M8 11h8" />
        <path d="M8 7h6" />
      </svg>
      <span>New to Wavez? Read the documentation</span>
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
