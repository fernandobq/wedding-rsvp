# RSVP Page — "Clásico romántico" Full Invitation

**Date:** 2026-06-28
**Status:** Approved
**Source design:** Claude Design project `d6628ae6-5fb1-443e-abad-0b50b8bdfe4a`, file `Invitacion RSVP.dc.html`, **Opción 1 — Clásico romántico**

## Goal

Replace the compact RSVP card at `/rsvp/[id]` with the full Option 1 one-page wedding
invitation (hero, details/venue, RSVP, footer), wiring the RSVP section to the existing
backend. Spanish only on this page; backend data rules win over the static mockup.

## Decisions (locked)

- **Scope:** Full invitation page, not just a restyled card.
- **Language:** Spanish only. No language toggle on this page. `i18n.ts` and the toggle
  remain for other pages (e.g. admin).
- **Guest counter:** Use the design's `+ / –` stepper visual, but clamp to the
  invitation's `maxGuests` and hide it entirely when `maxGuests === 1`.
- **Styling approach:** Tailwind arbitrary values + `next/font` CSS variables, with the
  Option-1 palette and fonts registered as `@theme` tokens. No inline-style soup.

## File changes

- `src/app/layout.tsx` — add `Cormorant_Garamond`, `EB_Garamond`, `Pinyon_Script`,
  `Tenor_Sans` via `next/font/google` as CSS variables on `<html>`.
- `src/app/globals.css` — register the Option-1 palette + font tokens in `@theme` so the
  markup can use named utilities where helpful.
- `src/app/rsvp/[id]/page.tsx` — rewrite as the full Option-1 invitation; keep all data /
  state logic (fetch GET, PATCH submit, and the loading / idle / saving / done / locked /
  error states). The RSVP form stays here because it owns the state.
- New presentational components in `src/app/rsvp/[id]/`:
  - `Hero.tsx` — eyebrow, floral, names, date, blessing.
  - `Details.tsx` — "Cuándo & Dónde", Fecha/Hora/Recepción columns, venue card + map link.
  - `Decorations.tsx` — the floral sprig, the small leaf/flower divider, and the venue map
    illustration, ported as JSX SVG components.

## Page structure (top → bottom)

1. **Hero** — eyebrow "Nuestra boda"; floral sprig SVG; names "Leticia" / "&" / "Fernando"
   in Pinyon Script; leaf divider; date "Sábado 5 de Diciembre · 2026"; blessing paragraph.
2. **Details** (`#EFE7D8` band) — "Cuándo & Dónde" / "Los detalles"; three columns
   Fecha (5 de Diciembre 2026) / Hora (2:00 PM) / Recepción (Terraza Balcones); venue card
   with the map illustration SVG, address, and a "Cómo llegar" Google Maps link.
3. **RSVP** — state-driven (see mapping below).
4. **Footer** (`#4A3C2E`) — names in Pinyon Script + "05 · 12 · 2026 — Culiacán, Sinaloa".

## RSVP state mapping

The mockup has only "form" and "submitted + edit". The backend is single-response and
locks after answering, so there is no edit/reset.

| Backend state            | What renders                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `loading`                | Hero + Details render normally; RSVP section shows a quiet skeleton/spinner.                                   |
| `idle` (`canRespond`)    | Personalized question, Yes/No pills → if Yes & `maxGuests > 1`, the clamped `+ / –` counter → "Enviar confirmación". |
| `saving`                 | Submit button shows "Enviando…" and is disabled.                                                              |
| `done` (just submitted)  | Confirmation block (`¡Qué alegría!` / `Te vamos a extrañar`) + saved summary + locked note. **No "Editar respuesta".** |
| `locked` (already answered) | Same confirmation block reflecting the recorded answer + locked note.                                       |
| `error`                  | Error message styled in the palette.                                                                          |

## Behavior details

- **Personalization:** Keep the guest's name by personalizing the RSVP question, e.g.
  `{name}, ¿nos acompañarás?`. Hero keeps the couple's names. This preserves the personal
  touch the current page has via `greeting(name)`.
- **Counter:** Clamp to `1..maxGuests`; hide when `maxGuests === 1`. On submit, send
  `partySize` only for "yes" (matching current PATCH behavior; backend re-clamps server-side).
- **Confirmation copy:** Reuse the design's confirmation titles/messages. Summary line
  reflects whether attending and party size, in the spirit of the current `savedYes/savedNo`
  and `lockedYes/lockedNo` copy (Spanish only).
- **Event details hardcoded** from the design: Sábado 5 de Diciembre 2026, 2:00 PM, Terraza
  Balcones, Boulevard Manuel J. Clouthier Ext. 5991, 80199 Culiacán Rosales, Sinaloa, and the
  Google Maps search link.

## Palette & fonts (from Opción 1)

- Background `#FBF8F2`; details band `#EFE7D8`; footer `#4A3C2E`.
- Text `#4A3C2E`; muted `#6B5C4A`; labels `#A8967C`; accent `#B98C6D`; lines `#D8CBB4`.
- Fonts: Pinyon Script (names), Cormorant Garamond (headings/details), EB Garamond
  (body, italic), Tenor Sans (uppercase labels/buttons).

## Out of scope

- No changes to the API route, DB schema, validation, admin page, or seed.
- No language toggle / English copy for the invitation content.
- No "edit response" flow (backend locks after one response).

## Testing / verification

- `npm run build` and `npm run lint` pass.
- Manually verify each RSVP state renders correctly (loading, idle with/without counter,
  saving, done yes/no, locked yes/no, error) and that the map link and layout match Option 1.
