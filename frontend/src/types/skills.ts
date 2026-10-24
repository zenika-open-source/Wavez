// Skill ids here map to backend agent ids (see resolve_agent_ids in
// zenflow.core.deployment) and are sent to POST /init/archive to select which
// agents get deployed.

export type SkillMode = "none" | "skill" | "custom";

export type SkillCategoryKey = "product" | "development" | "qa";

export interface Skill {
  id: string;
  label: string;
  description: string;
  /** Backend agent id when it differs from the skill id; it names the deployed skill folder. */
  agentId?: string;
  /** True when this skill has no corresponding backend agent yet — locked to "None". */
  disabled?: boolean;
}

export interface SkillCategory {
  id: string;
  title: string;
  key: SkillCategoryKey;
  skills: Skill[];
  /** True when this category isn't backed by anything deployable yet — grayed out and non-interactive. */
  disabled?: boolean;
}
