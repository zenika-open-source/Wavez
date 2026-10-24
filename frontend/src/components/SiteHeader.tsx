import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="relative z-[var(--z-header)] h-auto flex-none overflow-hidden bg-header lg:sticky lg:top-0 lg:h-24">
      <svg
        className="wz-drift wz-drift-slow absolute bottom-0 left-0 hidden lg:block"
        width="4320"
        height="28"
        viewBox="0 0 4320 28"
        aria-hidden="true"
      >
        <path
          d="M0 8 q120 -12 240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 t240 0 V28 H0 Z"
          fill="var(--color-header-wave-back)"
        />
      </svg>
      <svg
        className="wz-drift wz-drift-mid absolute bottom-0 left-0 hidden lg:block"
        width="4320"
        height="28"
        viewBox="0 0 4320 28"
        aria-hidden="true"
      >
        <path
          d="M0 15 q90 -12 180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 t180 0 V28 H0 Z"
          fill="var(--color-header-wave-mid)"
        />
      </svg>
      <svg
        className="wz-drift wz-drift-fast absolute bottom-0 left-0 hidden lg:block"
        width="4320"
        height="28"
        viewBox="0 0 4320 28"
        aria-hidden="true"
      >
        <path
          d="M0 22 q180 -10 360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 t360 0 V28 H0 Z"
          fill="var(--color-page)"
        />
      </svg>

      <div className="wz-layout-gutter relative z-10 mx-auto flex min-h-24 max-w-[1440px] flex-col items-start justify-center gap-4 py-4 lg:h-[68px] lg:flex-row lg:flex-nowrap lg:items-center lg:justify-between lg:gap-x-6 lg:gap-y-3 lg:py-0">
        <div className="flex w-full min-w-0 flex-col items-start gap-3 lg:w-auto lg:flex-1 lg:flex-row lg:items-center lg:gap-5">
          <span className="relative h-8 w-[99px] flex-none">
            <Image
              src="/brand/wavez-logo.svg"
              alt="WaveZ"
              fill
              sizes="99px"
              priority
              unoptimized
              className="object-contain"
            />
          </span>
          <span aria-hidden="true" className="hidden h-11 w-px flex-none bg-border-strong lg:block" />
          <div className="w-full min-w-0 lg:w-auto">
            <h1 className="font-display text-lg leading-tight font-bold tracking-tight text-text lg:text-[22px]">
              Generate agent skills for your AI assistant.
            </h1>
            <p className="mt-1 text-sm leading-snug text-text-soft lg:text-[15px]">
              Pick an assistant and your skills, then export the files it reads on day one.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-x-5 gap-y-2 text-sm lg:w-auto lg:flex-none lg:justify-start lg:gap-6">
          <span className="flex items-center gap-2.5 whitespace-nowrap text-text-muted">
            A tool developed by
            <Image
              src="/brand/zenika-logo.svg"
              alt="Zenika"
              width={72}
              height={22}
              unoptimized
              className="h-[22px]"
              style={{ width: "auto" }}
            />
          </span>
          <a
            href="https://github.com/zenika-open-source/Zenflow"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-accent hover:text-accent-strong"
          >
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
