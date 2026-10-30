"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

interface VideoEmbedProps {
  /** YouTube video id, e.g. the part after `youtu.be/`. */
  videoId: string;
  title: string;
  label: string;
  color: string;
}

// Click-to-load facade: the page only shows the thumbnail, and the YouTube
// iframe (privacy-enhanced domain) is mounted once the reader presses play.
export function VideoEmbed({ videoId, title, label, color }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure
      className="m-0 flex max-w-[760px] flex-col gap-3 rounded-[14px] border border-border bg-surface p-[18px] shadow-[inset_0_3px_0_var(--wz-video-color)]"
      style={{ "--wz-video-color": color } as CSSProperties}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[10px] border border-border bg-page">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer border-0 bg-transparent p-0"
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              unoptimized
            />
            <span className="absolute inset-0 bg-black/25 transition-colors duration-150 group-hover:bg-black/10" />
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-(--wz-video-color) text-white shadow-lg transition-transform duration-150 group-hover:scale-110"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex flex-col gap-0.5">
          <span className="font-mono text-xs tracking-[.14em] text-(--wz-video-color) uppercase">{label}</span>
          <span className="text-[17px] leading-[1.3] font-bold text-text">{title}</span>
        </div>
        <a
          href={`https://youtu.be/${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[15px] font-semibold text-accent hover:text-accent-strong"
        >
          Watch on YouTube ↗
        </a>
      </figcaption>
    </figure>
  );
}
