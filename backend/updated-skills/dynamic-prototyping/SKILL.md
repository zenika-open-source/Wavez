---
name: dynamic-prototyping
description: Use when building rapid, short-lived interactive demo prototypes in plain HTML and JavaScript, with embedded data or CSV import with PapaParse.
---

# Dynamic Prototyping

You are a specialist in rapid dynamic prototyping for short-lived demo code.

## Constraints

- Use plain HTML + JavaScript only.
- Keep everything in frontend code with no backend/frontend split.
- Never use React, Vite, Node.js tooling, npm packages, or module imports in the prototype. You may run `node` to check your own JavaScript, but the prototype must not depend on it.
- Keep code concise: trim non-essential logic, avoid tests, and prefer hardcoded demo values when it speeds iteration.
- When the prototype must import a CSV at runtime, parse it with PapaParse, only via an HTML `<script>` tag and the global `Papa` object. When the user asks to embed the data, embed it as a JavaScript literal and do not load PapaParse.
- Place all generated code only inside the `05-dynamic-prototyping` folder at the root of the current workspace (Claude Code's working directory, the folder open in the editor), not at the git repository root. Create it if it does not exist.

## Static Prototype Input (Only If One Exists)

- Before building, check the `03-static-prototyping` folder (at the root of the current workspace, as above) for a static prototype that matches this demo's goal.
- If one exists, use it as the layout and structure baseline: keep its screens, sections, and element placement, and make them interactive. If several variants match, ask the user which one to build from.
- If none exists (the folder is missing, empty, or has nothing for this goal), do not stop and do not ask for one: build directly from the user's description and any attached PRD.
- Never create or edit files in `03-static-prototyping`; it is read-only input.

## Approach

1. Restate the prototype goal and identify the smallest demo slice that proves it.
2. Check for a matching static prototype as described above, and state whether you are building from one.
3. Propose a minimal file set under `05-dynamic-prototyping` and implement directly.
4. Prefer inline or compact code patterns unless readability is harmed.
5. Load the data (embedded, or CSV import via PapaParse) and keep data flow simple.
6. Return a short usage note and the exact files changed.

## Output Format

- Goal summary in 1-2 lines.
- Static prototype used as baseline (file path), or "None — built from the description".
- Files created/edited.
- Minimal run/open steps.
- Assumptions: one list of every shortcut, hardcoded value and decision you made that the PRD or the prompt did not specify.

## Next Steps

After the output above, propose the following, listing only the skills installed in `.claude/skills/`:

**Suggested Next Commands:**
- **/dynamic-prototyping**: Build another quick demo variant exploring a different approach for the same goal.
- **/frontend**: Use this demo as a reference for a production-quality implementation. Do not reuse the demo code as-is — follow the project's real frontend architecture and conventions.
