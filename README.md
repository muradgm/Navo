# TripOS / Personal Trip Companion — Ops + Docs Foundation

This repository package contains the product truth, docs, operating model, and Codex-agent-ready prompts for building a reusable personalized trip planner.

The product started from a Basel family planner and is being generalized into a real app:

> A personal trip operating system that turns dates, base location, constraints, weather, transport, budget, food preferences, trip purpose, and traveler context into the best next travel decision.

## Folder layout

- `docs/` — product, engineering, operations, roadmap, and research documents.
- `ops/` — agent operating system, governance, truth files, templates, contracts, validation, and bootstrap prompts.

## How to use with Codex agents

1. Start with `ops/truth/PROJECT.md` and `ops/truth/PRODUCT_DEFINITION.md`.
2. Give each Codex agent its matching bootstrap file from `ops/runtime/bootstrap/`.
3. Create an assignment packet using `ops/templates/ASSIGNMENT_PACKET_TEMPLATE.md`.
4. Require the agent to return using `ops/templates/AGENT_RETURN_TEMPLATE.md`.
5. Run QA using `ops/governance/QA_REVIEW_CHECKLIST.md` and `ops/validation/VALIDATION_RULES.md`.

## Current intended build

MVP stack recommendation:

- Frontend: React + Vite + TypeScript
- Styling: CSS Modules or Tailwind + design tokens
- State: localStorage first, then server sync
- Backend: Node.js + Express
- Database: MongoDB
- Weather: Open-Meteo or similar no-key API for early MVP
- Maps/routes: Google Maps links first, API integration later
- Auth: optional after MVP validation

