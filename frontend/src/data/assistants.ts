import type { AssistantId } from "@/types/zenflow";

export const ASSISTANTS: { id: AssistantId; label: string; path: string }[] = [
  { id: "claude", label: "Claude Code", path: ".claude/skills/" },
  { id: "copilot", label: "GitHub Copilot", path: ".github/skills/" },
  { id: "opencode", label: "OpenCode", path: ".opencode/skills/" },
];
