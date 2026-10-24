"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { advanceWave, createWaveScene, drawWave, Z_SIZE, type WaveFrame, type WaveScene } from "@/lib/wave";

interface WaveVisualProps {
  level: number;
}

const FRAME_INTERVAL_MS = 33;

export function WaveVisual({ level }: WaveVisualProps) {
  const [frame, setFrame] = useState<WaveFrame | null>(null);
  const targetRef = useRef(level);
  const sceneRef = useRef<WaveScene | null>(null);
  const reducedMotionRef = useRef(false);

  // Keeps the animation loop pointed at the latest level; with reduced motion there is no loop, so redraw directly.
  useEffect(() => {
    targetRef.current = level;
    const scene = sceneRef.current;
    if (!scene || !reducedMotionRef.current) return;
    const id = requestAnimationFrame(() => {
      scene.progress = level;
      setFrame(drawWave(scene, false));
    });
    return () => cancelAnimationFrame(id);
  }, [level]);

  useEffect(() => {
    const scene = createWaveScene();
    sceneRef.current = scene;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedMotionRef.current = reduced;

    if (reduced) {
      scene.progress = targetRef.current;
      const id = requestAnimationFrame(() => setFrame(drawWave(scene, false)));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    let last = 0;
    const step = (timestamp: number) => {
      raf = requestAnimationFrame(step);
      if (timestamp - last < FRAME_INTERVAL_MS) return;
      const dt = Math.min((timestamp - last) / 1000, 0.1);
      last = timestamp;
      advanceWave(scene, targetRef.current, dt);
      setFrame(drawWave(scene, true));
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const percent = Math.round(Math.min(Math.max(level, 0), 1) * 100);

  return (
    <div
      role="img"
      aria-label={`Wave level ${percent} percent`}
      className="relative mt-4 mb-5 h-28 overflow-hidden rounded-[14px] bg-gradient-to-b from-wave-sky-top to-wave-sky-bottom"
    >
      {frame && (
        <>
          <svg
            viewBox="0 0 360 120"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute top-0 left-0 h-full w-full"
          >
            <path d={frame.back} fill="var(--color-wave-back)" />
            <path d={frame.mid} fill="var(--color-wave-mid)" />
          </svg>
          <Image
            src="/brand/z-mark.svg"
            alt=""
            width={Z_SIZE}
            height={Z_SIZE}
            unoptimized
            className="pointer-events-none absolute"
            style={{
              left: `${frame.z.left.toFixed(2)}%`,
              top: `${frame.z.top.toFixed(2)}%`,
              width: Z_SIZE,
              height: Z_SIZE,
              transform: `translate(-50%, -50%) translateY(${-Z_SIZE / 4}px) rotate(${frame.z.angle.toFixed(1)}deg)`,
            }}
          />
          <svg
            viewBox="0 0 360 120"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute top-0 left-0 h-full w-full"
          >
            <path d={frame.front} fill="var(--color-wave-front)" />
          </svg>
        </>
      )}
    </div>
  );
}
