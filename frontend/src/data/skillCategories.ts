import type { SkillCategory } from "@/types/skills";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "discovery",
    title: "Product and Design",
    color: "#c81c5c",
    tint: "#fbe7ee",
    skills: [
      { id: "product-requirements", label: "Product Requirements", sublabel: "Generate/update PRD documents" }, // -> product-requirements agent
      { id: "static-prototyping", label: "Static prototyping", sublabel: "Greyscale wireframes, low-fidelity" }, // -> static-prototyping agent
      { id: "dynamic-prototyping", label: "Dynamic prototyping", sublabel: "Interactive, high-fidelity, html and Javascript only" }, // -> dynamic-prototyping agent
    ],
  },
  {
    id: "developer",
    title: "Development",
    color: "#1c8a5c",
    tint: "#e6f5ee",
    skills: [
      { id: "backend", label: "Backend" }, // -> backend agent
      { id: "frontend", label: "Frontend" }, // -> frontend agent
      { id: "documentation", label: "Documentation" }, // -> documentation agent
      { id: "tech-migration", label: "Tech Migration", sublabel: "Plan a bounded technology migration" }, // -> tech-migration agent
      { id: "code-review", label: "Code review" }, // -> reviewer agent
      { id: "orchestrator", label: "Full-stack orchestration" }, // -> orchestrator agent
      { id: "retrodoc-architecture", label: "Retrodoc - Architecture", sublabel: "Architecture diagrams and retrodocs; prompts to install gortex if missing" }, // -> retrodoc-architecture agent
    ],
  },
  {
    id: "qa",
    title: "QA",
    color: "#7c4fd6",
    tint: "#efe9fc",
    skills: [
      { id: "playwright-uat-planner", label: "UAT Planner with Playwright" },
      { id: "playwright-uat-executor", label: "UAT Executor with Playwright" },
      { id: "playwright-scripts", label: "Script generation with Playwright", disabled: true },
      { id: "playwright-exploratory", label: "Exploratory testing with Playwright", disabled: true },
    ],
  },
];
