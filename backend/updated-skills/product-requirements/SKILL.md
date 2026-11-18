---
name: product-requirements
description: Use when interviewing stakeholders, or turning interview notes, a requirements brief or user feedback into a concise product or feature PRD, or when revising an existing PRD.
---

You create or revise a single, evidence-grounded Product Requirements Document (PRD) for a product or feature.

## Source of truth
- Use only facts and decisions from the material the user identifies: interview notes, a requirements brief, user feedback, prototype findings, or decisions stated in the prompt.
- Do not invent requirements. When the sources are silent on something the PRD needs, ask (see Clarify first) or record it under OPEN QUESTIONS.

## Clarify first
- Before writing, ask up to 5 questions whose answers change a requirement (for example: which fields are required, allowed values, rules between fields, or a Yes or No question on a candidate exclusion when the sources do not settle the scope). Ask them in one message and wait for the answers.
- When the user tells you to decide, make the decision and mark it "(decision)" in the PRD.
- Skip this step when revising a PRD and every change is backed by the attached material.

## Output requirements
- Save exactly one PRD in `02-product-requirements/` at the root of the current workspace (Claude Code's working directory, the folder open in the editor), not at the git repository root. Create the folder if needed.
- Name it `{name-of-product-or-feature}-prd.md`: concise, lowercase, hyphen-separated, with no slash characters.
- When revising, update the existing PRD instead of creating a new file.
- Keep the text under 900 words, not counting tables, OPEN QUESTIONS and CHANGES. Prefer short bullets and tables to prose.
- Use the headings below, in this order. Leave out a section only when it is marked optional and has no content.

## Required structure

PROBLEM STATEMENT

Two sentences. Name the user, their specific pain point, and the consequence.

TARGET USER

One sentence stating the job title and key responsibility.

CONTEXT

Up to three sentences describing the confirmed data sources, fields and existing system.

USER STORIES

3 to 7 bullets, each in this format: `As a [role], I want [specific action] so that [outcome]`. Under each story, 1 to 3 acceptance criteria in `Given … when … then …` format, each testable through the product.

REQUIREMENTS

Numbered (R1, R2…), specific and testable: screens and elements, where they appear, user actions and rules. For a form, include a table with one validation rule and its error message per field. For a dashboard, give the chart type, data fields and user actions.

SUCCESS METRICS

Two or three measurable items, each with a target, and with a baseline when the sources give one.

OUT OF SCOPE

What this version will not do.

OPEN QUESTIONS (optional)

What the sources do not settle, and who should answer.

CHANGES (optional, revisions only)

What changed since the previous version and why, citing the source of each change.

## Final check
Before saving, verify: heading order; every user story has acceptance criteria; every requirement is covered by an acceptance criterion or can be checked directly; every statement traces to the sources or is marked "(decision)"; the word limit; the filename and location.

## Next Steps

After saving the PRD, propose the following, listing only the skills installed in `.claude/skills/`:

**Suggested Next Commands:**
- **/static-prototyping**: Build greyscale static HTML prototypes from the PRD.
- **/dynamic-prototyping**: Build a clickable prototype to test the PRD with users.
- **/product-requirements**: Revise the PRD based on feedback.
