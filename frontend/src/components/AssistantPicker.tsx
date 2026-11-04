"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ASSISTANTS } from "@/data/assistants";
import type { AssistantId } from "@/types/wavez";

interface AssistantPickerProps {
  selected: AssistantId;
  onSelect: (id: AssistantId) => void;
}

const PRIMARY = ASSISTANTS.filter((assistant) => assistant.primary);
const OTHERS = ASSISTANTS.filter((assistant) => !assistant.primary);

const CARD_BASE =
  "relative flex w-full cursor-pointer items-center gap-2.5 rounded-control border-2 px-3 py-2.5 text-left transition-[transform,background-color,border-color] duration-200 ease-out motion-safe:hover:-translate-y-0.5";
const FOCUS_RING =
  "[&:has(input:focus-visible)]:outline [&:has(input:focus-visible)]:outline-3 [&:has(input:focus-visible)]:outline-accent-strong [&:has(input:focus-visible)]:outline-offset-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-accent-strong focus-visible:outline-offset-2";

function cardState(isSelected: boolean) {
  return isSelected ? "border-accent bg-surface-raised" : "border-border bg-surface hover:border-border-strong";
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-5 w-5 flex-none rounded-full border-2 ${
        checked
          ? "border-accent bg-accent shadow-[inset_0_0_0_4px_var(--color-surface-raised)]"
          : "border-border-control"
      }`}
    />
  );
}

function LogoBox({ children }: { children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-border bg-page"
    >
      {children}
    </span>
  );
}

export function AssistantPicker({ selected, onSelect }: AssistantPickerProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  const selectedOther = OTHERS.find((assistant) => assistant.id === selected);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Assistant</legend>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {PRIMARY.map((assistant) => (
          <label key={assistant.id} className={`${CARD_BASE} ${cardState(selected === assistant.id)} ${FOCUS_RING}`}>
            <input
              type="radio"
              name="assistant"
              value={assistant.id}
              checked={selected === assistant.id}
              onChange={() => onSelect(assistant.id)}
              className="sr-only"
            />
            <RadioDot checked={selected === assistant.id} />
            <span className="min-w-0 flex-1 text-sm leading-[1.3] font-semibold whitespace-nowrap text-text">
              {assistant.label}
            </span>
            <LogoBox>
              <Image src={assistant.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" unoptimized />
            </LogoBox>
          </label>
        ))}

        <div ref={containerRef} className="relative min-w-0">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            onClick={() => setMenuOpen((open) => !open)}
            className={`${CARD_BASE} ${cardState(Boolean(selectedOther))} ${FOCUS_RING}`}
          >
            <RadioDot checked={Boolean(selectedOther)} />
            <span className="min-w-0 flex-1 truncate text-sm leading-[1.3] font-semibold text-text">
              {selectedOther ? (selectedOther.shortLabel ?? selectedOther.label) : "Others"}
            </span>
            <LogoBox>
              {selectedOther ? (
                <Image
                  src={selectedOther.logo}
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                  unoptimized
                />
              ) : (
                <svg viewBox="0 0 20 20" className="h-5 w-5 text-text-muted" fill="currentColor">
                  <circle cx="4.5" cy="10" r="1.6" />
                  <circle cx="10" cy="10" r="1.6" />
                  <circle cx="15.5" cy="10" r="1.6" />
                </svg>
              )}
            </LogoBox>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className={`h-4 w-4 flex-none text-text-muted transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 8 5 5 5-5" />
            </svg>
          </button>

          {menuOpen && (
            <div
              id={menuId}
              role="menu"
              aria-label="Other assistants"
              className="absolute top-full right-0 left-0 z-20 mt-2 flex min-w-[14rem] flex-col gap-1 rounded-control border-2 border-border-strong bg-surface-raised p-1.5 shadow-lg sm:left-auto"
            >
              {OTHERS.map((assistant) => (
                <button
                  key={assistant.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected === assistant.id}
                  onClick={() => {
                    onSelect(assistant.id);
                    setMenuOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold text-text transition-colors hover:bg-surface focus-visible:outline focus-visible:outline-3 focus-visible:outline-accent-strong ${
                    selected === assistant.id ? "bg-surface" : ""
                  }`}
                >
                  <LogoBox>
                    <Image src={assistant.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" unoptimized />
                  </LogoBox>
                  <span className="min-w-0 flex-1 whitespace-nowrap">{assistant.label}</span>
                  {selected === assistant.id && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4 flex-none text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m4 10.5 4 4 8-9" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
}
