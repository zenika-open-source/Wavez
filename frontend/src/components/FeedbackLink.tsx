const ISSUES_URL = "https://github.com/zenika-open-source/Wavez/issues";

export function FeedbackLink() {
  return (
    <a
      href={ISSUES_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Give feedback (opens GitHub issues in a new tab)"
      className="flex h-9 flex-none items-center gap-2 whitespace-nowrap rounded-[10px] border border-border-strong bg-text/8 px-3 text-sm font-medium text-text transition-colors duration-150 hover:bg-text/16 active:bg-text/24"
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
        <path d="M14 14a2 2 0 0 0 2-2V8h-2" />
        <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
        <path d="M8 14a2 2 0 0 0 2-2V8H8" />
      </svg>
      <span>Feedback</span>
    </a>
  );
}
