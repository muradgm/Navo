# Ops Directory Guide

This `ops/` tree is the operating system for building TripOS with Codex agents.

## Layout

- `truth/` — product reality and strategic source of truth
- `core/` — operating model and task lifecycle
- `governance/` — decision authority, QA gates, conflicts, and review rules
- `agents/` — role-specific Codex agent contracts
- `runtime/bootstrap/` — files used to initialize dedicated agent chats
- `templates/` — reusable task, return, QA, and decision templates
- `contracts/` — structured output contracts
- `validation/` — global validation rules
- `benchmarks/` — lane-specific acceptance checks

## Truth hierarchy

1. `ops/truth/PROJECT.md`
2. `ops/truth/PRODUCT_DEFINITION.md`
3. `docs/product/*`
4. assignment packet
5. agent assumptions

If documents conflict, escalate instead of guessing.

## Agent workflow

1. PM creates assignment packet.
2. Agent executes only allowed scope.
3. Agent returns using required template.
4. QA reviews against acceptance criteria.
5. PM accepts, returns, or escalates.
