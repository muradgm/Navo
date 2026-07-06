# Navo Destination Page Layout V2

## Purpose

Navo should feel like a destination decision product, not a stack of disconnected travel panels.

The page must answer four questions quickly:

1. Where am I planning?
2. What should I do today?
3. What are my best options?
4. How do I move through the day?

The product wedge remains:

> The best next trip decision, personalized to your context.

## Target users

Primary users:

- family travelers planning from a hotel or apartment base
- travelers overwhelmed by too many attraction choices
- users who need practical day decisions, not only inspiration
- users balancing weather, budget, children, energy, food, and transit

Core user needs:

- Tell me what makes sense today.
- Keep my base location, weather, budget, and energy in mind.
- Give me a primary plan and a backup.
- Show me the route clearly.
- Do not make me compare 40 places manually.

## Product principles

- Decision first, browsing second.
- One design system, many destination moods.
- Practical, not generic.
- Cinematic, but readable.
- Context-aware, but never fake certainty.
- Mobile-first, not desktop-shrunk.
- Map must be useful without requiring perfect visual map reading.

## Recommended page flow

```txt
Destination Hero
↓
Today Decision
↓
DayFlow Map
↓
Activity Explorer
↓
Food + Groceries
↓
Checklist + Safety
↓
Itinerary
```

Tabs can remain, but the product should still feel like a guided decision flow. The top-level experience should prioritize the Today Decision and DayFlow route before deep browsing.

## Section 1: Destination Hero

### Role

Orient the user and establish destination identity.

### Content

- destination name
- destination-specific subtitle
- base location
- trip dates
- budget range
- weather summary when available
- primary actions:
  - Plan today
  - View activities
  - Open map

### Visual rules

- use destination-specific cinematic hero image
- maintain strong overlay for text contrast
- use destination theme tokens for accent and atmosphere
- avoid text baked into images
- avoid fake UI inside images

### Responsive behavior

Desktop:

- wide cinematic image
- hero text left
- metric cards visible
- primary actions near copy

Tablet:

- stacked hero copy and metrics
- preserve image mood without reducing readability

Mobile:

- shorter hero
- title, subtitle, and action buttons first
- metric cards become compact scroll or stacked cards

## Section 2: Today Decision

### Role

Make the Navo wedge obvious: best next move.

### Required content

- Best next move headline
- Confidence score
- Why this was chosen
- Primary plan
- Backup plan
- Avoid-for-now options
- Weather, energy, and budget controls
- Apply primary plan action

### Content strategy

Recommendations must explain tradeoffs plainly:

```txt
Chosen because: weather + route + budget + traveler energy.
```

Avoid vague AI copy such as:

```txt
This is the perfect option.
```

Use practical wording:

```txt
This is the best current fit because it keeps walking low, works in rain, and stays under budget.
```

### Interaction rules

- changing weather, energy, or budget updates the recommendation
- applying the primary plan gives feedback
- avoid-now items must include reasons
- do not hide backup options on mobile

## Section 3: DayFlow Map

### Role

Turn the decision into a route.

### Phase 1 map enhancements

No new map dependency required yet.

Required improvements:

- clearer numbered pins
- stronger route line contrast
- route start and return-to-base labels
- visible route confidence/friction badge
- pin hover and keyboard focus states
- pin popover or detail panel with:
  - activity name
  - area
  - cost
  - time estimate
  - route link
  - add/remove action
- mobile route list mirrors the map sequence

### Phase 2 map enhancements

Introduce a map library only when the architecture is ready.

Potential capabilities:

- zoom
- pan
- bounds fitting
- clickable custom pins
- accessible popups
- location-based recommendations
- route planning and directions
- marker clustering for dense plans

### Accessibility requirements for map

- every pin needs a keyboard-focusable equivalent
- every pin needs an accessible label
- the route list must communicate the same information as the map
- users should be able to understand the day without seeing the map
- hover-only interactions are not acceptable

## Section 4: Activity Explorer

### Role

Let users browse alternatives after the system gives direction.

### Card content

Each card should show:

- image
- activity name
- area
- type
- cost
- duration
- distance/from-base estimate when available
- weather fit
- energy fit
- family/kids fit
- add to today
- favorite
- route
- details

### Visual rules

- cards should be structurally consistent across destinations
- destination accent can appear in borders, chips, and action states
- avoid city-specific redesigns per card
- image treatment should be cinematic but not obscure metadata

## Section 5: Food, Groceries, Safety, Checklist

### Role

Support real travel constraints without overwhelming the main decision flow.

### Recommended treatment

- compact cards
- collapsible groups on mobile
- clear labels
- practical copy
- direct map links

Priority order:

1. Food strategy
2. Groceries near base
3. Day bag checklist
4. Safety basics

## Information Architecture

Navigation should support both guided and direct modes.

Guided flow:

- Hero
- Today Decision
- DayFlow
- Activity Explorer

Direct access:

- Today
- Activities
- Food
- Checklist
- Safety
- Itinerary

The Today tab should be the default because it best communicates the wedge.

## Visual design system

Navo should feel:

```txt
calm, intelligent, cinematic, practical, travel-aware
```

Navo should not feel:

```txt
generic travel blog, booking marketplace, AI gimmick dashboard, overloaded tourist brochure
```

## Destination theme contract

Each destination should provide or inherit:

```js
theme: {
  accent,
  accentSoft,
  accentStrong,
  dark,
  surfaceTint,
  heroOverlayFrom,
  heroOverlayTo,
  routeLine,
  pinPrimary,
  pinSecondary,
}
```

Use tokens. Do not create random component-level colors.

## Destination mood guidance

Basel:

- calm, cultural, Rhine, blue/teal, precise
- visual tone: river light, museums, old town, clean transit

Barcelona:

- warm, vibrant, architectural, orange/cyan, sunset
- visual tone: Gaudí curves, sea warmth, public plazas, food energy

Munich:

- structured, green, alpine edge, amber/blue
- visual tone: parks, old town, beer garden warmth without alcohol-centric branding

Málaga:

- Mediterranean, sea, gold/blue, bright but soft
- visual tone: coastline, old town, warm evenings

## Typography

Hierarchy:

- Hero title: large, confident, readable over image
- Section title: short and action-oriented
- Body copy: plain, useful, no filler
- Metadata: compact chips and labels
- Decision explanations: concise and specific

Avoid:

- long paragraphs inside cards
- all-caps overuse
- small low-contrast labels
- image text overlays without strong contrast

## Color and contrast

Rules:

- all text over images must pass contrast requirements
- destination accents must not reduce readability
- buttons must have clear hover, active, disabled, and focus states
- color must not be the only signal for state

## Motion design

Use motion for feedback, not decoration.

Good motion:

- card expand/collapse
- route line emphasis
- pin hover/focus feedback
- apply-plan confirmation
- destination switch fade

Avoid:

- constant animation
- heavy parallax
- motion that distracts from reading
- motion that slows the interface

Must respect:

```css
@media (prefers-reduced-motion: reduce)
```

## Responsive design rules

Mobile priority:

1. Best next move
2. Weather/energy/budget controls
3. Apply plan
4. Route sequence
5. Activity cards

Tablet priority:

- decision and controls can sit side by side
- map and route list can become a two-column layout

Desktop priority:

- hero with metrics
- decision panel with controls
- wide map with route list
- activity grid

Minimum interaction requirements:

- no horizontal overflow
- touch targets at least 44px
- sticky controls only when they do not block content
- map must not dominate the first mobile viewport

## Accessibility requirements

- semantic landmarks for major sections
- visible focus states
- accessible labels for map pins and controls
- meaningful image alt text
- image backgrounds must not be the only content source
- keyboard usable tabs, filters, pins, and buttons
- route list mirrors map sequence
- reduced motion support
- screen-reader-friendly status for plan application

## Image strategy

Use generated cinematic images only when they add product value.

Image requirements:

- WebP
- optimized for web
- responsive variants when possible
- no text baked into image
- no fake UI
- no copied third-party photo assets
- family-friendly travel context
- consistent art direction per destination

Recommended image manifest shape:

```js
hero: {
  desktop,
  tablet,
  mobile,
  alt,
}

activities: [
  {
    id,
    images: [],
  }
]
```

## Senior designer review checklist

UX:

- Can the user understand what to do first?
- Is the recommendation visible within 10 seconds?
- Is the backup plan clear?
- Can the user recover when weather or energy changes?

UI:

- Are sections visually distinct?
- Are actions consistent?
- Are cards scannable?
- Is the map readable?

Visual design:

- Does each destination feel distinct?
- Does the hero dominate enough without hurting usability?
- Are color, type, and spacing consistent?

Accessibility:

- Keyboard usable?
- Contrast acceptable?
- Map usable without vision?
- Motion safe?

Responsive:

- Mobile flow works?
- Controls are touch-friendly?
- No horizontal overflow?
- Map does not overwhelm mobile?

## Implementation sequence

### PR 1: Destination page layout sections

```txt
refactor: introduce destination page layout sections
```

Split the app shell into named sections without redesigning everything at once:

- HeroSection
- TodaySection
- DayFlowSection
- ActivityExplorerSection
- SupportSections

### PR 2: Today Decision in main React tree

```txt
refactor: move Today Decision panel into React tree
```

Remove the bridge script and make the Today Decision panel a normal component.

### PR 3: DayFlow map interaction pass

```txt
feat: improve DayFlow map pins and route interactions
```

Add stronger pins, keyboard states, route list alignment, and accessible detail behavior.

### PR 4: Responsive image manifest

```txt
feat: add responsive destination image manifest
```

Define hero and image variants cleanly before adding more cities.

### PR 5: Visual hierarchy polish

```txt
style: polish destination page visual hierarchy
```

Tighten spacing, typography, card rhythm, section hierarchy, and mobile flow.

## Non-goals for this phase

- no booking marketplace
- no login/auth requirement
- no full map-library migration yet
- no new city expansion until layout foundation is cleaner
- no aggressive animation system
- no city-specific custom redesigns per destination
