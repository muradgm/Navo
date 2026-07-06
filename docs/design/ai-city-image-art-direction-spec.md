# Navo AI City Image Art Direction Spec

## Purpose

Standardize future destination hero imagery so Navo visuals are premium, cinematic, crop-safe, and consistent across cities.

These assets should support the product without being treated as the product itself.

---

## Core visual direction

The image system should feel:

- cinematic
- premium
- warm and inviting
- destination-led
- realistic but elevated
- emotionally attractive

Avoid generic stock-photo or overly surreal outputs.

---

## Required outputs per city

Each city should provide:

- desktop: `1920x1080`
- laptop: `1366x768`
- tablet: `1024x1365`
- mobile: `828x1792`
- small mobile: `640x1136`

---

## Composition rules

### Safe-zone principle

The core visual story must survive all crops. That means:

- important landmarks cannot rest only at the edges
- the central narrative stays visible in portrait crops
- mobile crops remain intentional and recognizable

### Preferred patterns

Use one of these compositional approaches:

- skyline + iconic landmark
- waterfront + old town layering
- elevated city overlook
- landmark + urban depth

---

## Brand fit

The image should make the destination feel like:

> a smart, premium, emotionally attractive travel choice.

It should convey:

- trust
- polish
- destination identity
- product readiness

---

## City-specific guidance

### Barcelona
Look for:
- strong city + sea layering
- landmark identity like Sagrada Família, Park Güell, or Gothic Quarter
- warm Mediterranean light

Avoid:
- messy crowd-dense hero compositions
- city identity that is too generic

### Munich
Look for:
- historic rooftops or Marienplatz identity
- clean Bavarian city character
- park or river context if it supports the city story

Avoid:
- anonymous German street scenes without clear Munich identity

### Málaga
Look for:
- coastal old-town / harbor relationship
- warm sunset glow
- palm-lined city edge

Avoid:
- beach-only hero compositions with weak city cues

---

## Prompt storage

Store prompts in source control. Example layout:

```txt
assets/ai-prompts/
  barcelona-hero-v1.md
  munich-hero-v1.md
  malaga-hero-v1.md
```

Each prompt file should include:

- destination
- prompt version
- landmark focus
- mood
- responsive requirements
- generation date
- notes about composition
- reference image sources

---

## Prompt template

Use this structure for hero prompts:

- Create a premium cinematic destination hero image for [CITY].
- Show an iconic, instantly recognizable view of [LANDMARKS / AREA].
- Style: warm golden-hour or blue-hour travel photography, polished, realistic but slightly elevated.
- The composition must be crop-safe for desktop, laptop, tablet, mobile, and small-mobile.
- Avoid text overlays, UI overlays, or clutter.
- Preserve a central story band across crop breakpoints.

---

## Quality checklist

Before accepting a hero asset set, confirm:

- destination is recognizable
- landmark focus is strong
- desktop feels cinematic
- mobile crops remain intentional
- composition has a safe focal zone
- lighting is premium
- no distractingly weird artifacts
- the set is consistent across breakpoints
