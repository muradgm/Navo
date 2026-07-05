# Coding Standards

## General

- Use TypeScript for production code.
- Keep domain logic out of UI components.
- Prefer small pure functions for scoring, filtering, and budget calculation.
- Avoid hardcoded city-specific logic inside generic components.
- Use accessible buttons and labels.
- Design mobile-first.

## React

- Components should be composable and small.
- Do not put large static datasets inside component files.
- Use hooks for browser state and services.
- Store localStorage keys in one constants file.

## Naming

- Use domain names: `Trip`, `Activity`, `DayPlan`, `Destination`.
- Do not use generic names like `Item`, `Data`, `Thing`.

## UX Rules

- Every action must have visible feedback.
- Add buttons must show destination day and added state.
- Filters must show result count.
- Empty states must suggest a recovery action.
- External links must open safely in a new tab.

## AI/Image Rules

- AI-generated images must be labeled internally as planning visuals.
- Do not imply generated images are real documentary photos.
- Prefer local assets for stability.
- Official external images require rights review before embedding.
