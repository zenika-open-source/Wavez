const ISSUES_URL = "https://github.com/zenika-open-source/Wavez/issues";

export function FeedbackLink() {
  return (
    <a
      href={ISSUES_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Give feedback (opens GitHub issues in a new tab)"
      className="flex h-9 flex-none items-center gap-2 whitespace-nowrap rounded-full border border-accent bg-accent/10 px-4 text-sm font-semibold text-accent transition-colors duration-150 hover:bg-accent hover:text-on-accent active:bg-accent-strong lg:text-[15px]"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z" />
        <path d="M12 14.6s-3-1.8-3-3.9a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2.1-3 3.9-3 3.9z" />
      </svg>
      <span>Feedback</span>
    </a>
  );
}
