import type { AssistantId } from "@/types/wavez";

export const ASSISTANTS: { id: AssistantId; label: string; logo: string; skillsRoot: string }[] = [
  { id: "claude", label: "Claude Code", logo: "/assistants/claude.svg", skillsRoot: ".claude/skills" },
  { id: "copilot", label: "GitHub Copilot", logo: "/assistants/copilot.svg", skillsRoot: ".github/skills" },
  { id: "opencode", label: "OpenCode", logo: "/assistants/opencode.svg", skillsRoot: ".opencode/skills" },
];
