import type { AssistantId } from "@/types/zenflow";

export const ASSISTANTS: { id: AssistantId; label: string }[] = [
  { id: "claude", label: "Claude Code" },
  { id: "copilot", label: "GitHub Copilot" },
  { id: "opencode", label: "OpenCode" },
];
