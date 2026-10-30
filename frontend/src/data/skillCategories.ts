import type { SkillCategory } from "@/types/skills";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "discovery",
    title: "Product and Design",
    key: "product",
    skills: [
      { id: "product-requirements", label: "Product Requirements", description: "Generate/update PRD documents" }, // -> product-requirements agent
      { id: "static-prototyping", label: "Static prototyping", description: "Greyscale wireframes, low-fidelity" }, // -> static-prototyping agent
      { id: "dynamic-prototyping", label: "Dynamic prototyping", description: "Interactive, high-fidelity, html and Javascript only" }, // -> dynamic-prototyping agent
    ],
  },
  {
    id: "developer",
    title: "Development",
    key: "development",
    skills: [
      { id: "backend", label: "Backend", description: "Plan and build API endpoints and business logic" }, // -> backend agent
      { id: "frontend", label: "Frontend", description: "Plan and build UI components, wire up API calls" }, // -> frontend agent
      { id: "tech-migration", label: "Tech Migration", description: "Plan a bounded technology migration" }, // -> tech-migration agent
      { id: "code-review", label: "Code review", description: "Security and quality review of changes", agentId: "reviewer" }, // -> reviewer agent
      { id: "architecture-diagram", label: "Architecture Diagram", description: "Document the system architecture with diagrams" }, // -> architecture-diagram agent
    ],
  },
  {
    id: "qa",
    title: "QA",
    key: "qa",
    skills: [
      {
        id: "playwright-uat",
        label: "UAT with Playwright",
        description: "Write and run browser-based acceptance tests",
      }, // -> playwright-uat agent
    ],
  },
];
