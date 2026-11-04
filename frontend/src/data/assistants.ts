import type { AssistantId } from "@/types/wavez";

export interface Assistant {
  id: AssistantId;
  label: string;
  /** Compact name for the picker card when the full label does not fit. */
  shortLabel?: string;
  logo: string;
  skillsRoot: string;
  /** Shown as its own card in the picker; otherwise listed under "Others". */
  primary: boolean;
}

export const ASSISTANTS: Assistant[] = [
  { id: "claude", label: "Claude Code", logo: "/assistants/claude.svg", skillsRoot: ".claude/skills", primary: true },
  { id: "copilot", label: "GitHub Copilot", logo: "/assistants/copilot.svg", skillsRoot: ".github/skills", primary: true },
  { id: "opencode", label: "OpenCode", logo: "/assistants/opencode.svg", skillsRoot: ".opencode/skills", primary: false },
  { id: "antigravity", label: "Google Antigravity", shortLabel: "Antigravity", logo: "/assistants/antigravity.svg", skillsRoot: ".agents/skills", primary: false },
];
