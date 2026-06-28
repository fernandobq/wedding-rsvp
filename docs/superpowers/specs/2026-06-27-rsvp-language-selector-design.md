# RSVP page language selector (English / Spanish)

## Goal

Let guests read and respond to their invitation in Spanish or English on the
RSVP page. Spanish is the default. A guest can switch to English with a compact
toggle, and that choice is remembered in their browser.

## Scope

- Applies only to the guest RSVP page: `src/app/rsvp/[id]/page.tsx`.
- Out of scope: home page (`src/app/page.tsx`), admin dashboard, root
  `<html lang="en">`, invitation link/email text.
- No new dependencies. No routing or URL changes.

## Approach

Lightweight inline dictionary plus a small `useLanguage` hook. No i18n library.
The page is already a single client component, so all state stays client-side.

## Components

### New: `src/lib/i18n.ts`

- `export type Lang = "es" | "en"`.
- `export const DEFAULT_LANG: Lang = "es"`.
- `export const LANG_STORAGE_KEY = "rsvp-lang"`.
- `translations`: a record keyed by `es` / `en`. Static strings are plain
  strings; strings that interpolate values are functions.
- `useLanguage()` hook:
  - Initializes state to `DEFAULT_LANG` so the server render and first client
    render both produce Spanish (no hydration mismatch).
  - On mount, a `useEffect` reads `localStorage[LANG_STORAGE_KEY]`; if it holds a
    valid `Lang`, switch to it.
  - `setLang(next)` updates state and writes to `localStorage`.
  - Returns `{ lang, setLang }`.

### Updated: `src/app/rsvp/[id]/page.tsx`

- Call `useLanguage()`; resolve `const t = translations[lang]`.
- Replace every hardcoded English string with `t.*`, passing `inv.name`,
  `partySize`, and `inv.maxGuests` into the function entries.
- `Shell` receives `lang` and `onChange` props and renders the ES / EN toggle in
  the top-right corner of the card so it appears in every state. The active
  language label is highlighted (rose); the other is muted. Implemented as two
  buttons.

## String inventory (English -> Spanish)

Eyebrows / status lines:
- "You're invited" -> "Estas invitado"
- "See you there" -> "Nos vemos alla"
- "We'll miss you" -> "Te vamos a extranar"

Idle (invite) screen:
- "Hi {name}!" -> "Hola, {name}!"
- "We would be so happy to celebrate with you. Will you join us?" ->
  "Nos encantaria celebrar contigo. Nos acompanas?"
- "Heads up: you can only answer once, so pick the option that's right for you."
  -> "Nota: solo puedes responder una vez, asi que elige la opcion correcta."
- "How many of you are coming?" -> "Cuantos vienen?"
- "{n} guest" / "{n} guests" -> "{n} invitado" / "{n} invitados"
- "Yes, I'll be there" -> "Si, ahi estare"
- "Sorry, can't make it" -> "Lo siento, no podre asistir"
- "Saving..." -> "Guardando..."

Done screen:
- "Thank you, {name}!" -> "Gracias, {name}!"
- "Your RSVP is saved for {n} guest(s)." / "Your RSVP is saved." ->
  "Tu confirmacion se guardo para {n} invitado(s)." / "Tu confirmacion se guardo."
- "Your response is saved. Thank you for letting us know." ->
  "Tu respuesta se guardo. Gracias por avisarnos."
- "This is locked in now. Need to change something? Just reach out to us
  directly and we'll reopen your invitation." -> "Tu respuesta quedo registrada.
  Necesitas cambiar algo? Contactanos directamente y reabriremos tu invitacion."

Locked screen:
- "You're all set, {name}!" -> "Todo listo, {name}!"
- "You let us know you'll be joining with {n} guest(s)." / "You let us know
  you'll be joining." -> "Nos confirmaste que asistiras con {n} invitado(s)." /
  "Nos confirmaste que asistiras."
- "You let us know you won't be able to make it." ->
  "Nos avisaste que no podras asistir."
- "Your RSVP has already been recorded." -> "Tu respuesta ya fue registrada."
- "Your answer is locked in. Need to change it? Please reach out to us directly
  and we'll reopen your invitation." -> "Tu respuesta quedo registrada.
  Necesitas cambiarla? Contactanos directamente y reabriremos tu invitacion."

Error screen:
- "Hmm, something went wrong" -> "Algo salio mal"
- "Please double-check the link from your invitation, or reach out to us
  directly." -> "Revisa el enlace de tu invitacion o contactanos directamente."

(Final Spanish copy can be lightly adjusted during implementation; accents will
be included in the actual strings.)

## Data flow

1. `useLanguage` initializes to `es`.
2. On mount it reads `localStorage["rsvp-lang"]` and switches if a saved value
   exists.
3. The page renders strings from `translations[lang]`.
4. The toggle calls `setLang`, which updates state and persists to
   `localStorage`.

## Behavior notes

- First paint is always Spanish; a saved English preference applies on mount.
  Because the page opens in a loading state while it fetches the invitation,
  this transition is effectively invisible.
- Invalid or missing `localStorage` values fall back to Spanish.

## Testing

- Manual: load RSVP page -> defaults to Spanish; toggle to English -> strings
  update; refresh -> stays English; clear storage -> back to Spanish.
- Verify all states (loading, idle, saving, done, locked, error) render in both
  languages, including singular/plural guest counts.
