# RSVP "Clásico romántico" Invitation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the compact RSVP card at `/rsvp/[id]` with the full Option 1 ("Clásico romántico") one-page wedding invitation, wiring the RSVP section to the existing backend.

**Architecture:** A client component page (`page.tsx`) owns all data/state (GET fetch + PATCH submit + loading/idle/saving/done/locked/error states) and composes three presentational components — `Hero`, `Details`, and SVG `Decorations`. Fonts are registered once in the root layout via `next/font/google` as CSS variables; the Option-1 palette is registered as Tailwind v4 `@theme` color tokens. Spanish only on this page.

**Tech Stack:** Next.js 16 (App Router, client component), React 19, Tailwind CSS v4, `next/font/google`.

**Conventions / gotchas:**
- This project uses Tailwind v4 renamed gradient utilities: `bg-linear-to-r` / `bg-linear-to-l` (NOT `bg-gradient-*`). The current page already uses `bg-linear-to-b`.
- Arbitrary font-family utilities: `font-[family-name:var(--font-cormorant)]`.
- No test runner is configured in this repo and this is a visual page port, so verification is `npm run build` + `npm run lint` + manual state checks (not unit tests).
- Commits: per the repo's "commit only when asked" rule, do NOT commit per-task. A final task runs build/lint and commits only after the user approves.
- Per AGENTS.md, the bundled `next/font` doc (`node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`) was consulted; non-variable fonts (Pinyon Script, Tenor Sans) require an explicit `weight`.

**File structure:**
- Modify `src/app/layout.tsx` — register the 4 Google fonts as CSS variables.
- Modify `src/app/globals.css` — add Option-1 palette `@theme` color tokens.
- Create `src/app/rsvp/[id]/Decorations.tsx` — `FloralSprig`, `LeafFlower`, `LeafDivider`, `VenueMap` SVGs.
- Create `src/app/rsvp/[id]/Hero.tsx` — hero section.
- Create `src/app/rsvp/[id]/Details.tsx` — details/venue section.
- Rewrite `src/app/rsvp/[id]/page.tsx` — data/state logic + RSVP section + footer, composing the above.

---

### Task 1: Register fonts and palette tokens

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the four Google fonts to the root layout**

Replace the contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  EB_Garamond,
  Pinyon_Script,
  Tenor_Sans,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const ebGaramond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-ebgaramond",
});

const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tenor",
});

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Let us know if you'll be joining us.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${pinyon.variable} ${cormorant.variable} ${ebGaramond.variable} ${tenor.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Add palette tokens to globals.css**

In `src/app/globals.css`, after the existing `@theme inline { ... }` block (before the `@media (prefers-color-scheme: dark)` block), add:

```css
@theme {
  --color-cream: #fbf8f2;
  --color-sand: #efe7d8;
  --color-cocoa: #4a3c2e;
  --color-mocha: #6b5c4a;
  --color-taupe: #a8967c;
  --color-rosegold: #b98c6d;
  --color-hairline: #d8cbb4;
}
```

- [ ] **Step 3: Type-check the layout**

Run: `npx tsc --noEmit`
Expected: no errors.

---

### Task 2: Create the SVG decorations

**Files:**
- Create: `src/app/rsvp/[id]/Decorations.tsx`

- [ ] **Step 1: Write the decorations file**

Create `src/app/rsvp/[id]/Decorations.tsx` with the full contents:

```tsx
export function FloralSprig() {
  return (
    <svg width="40" height="54" viewBox="0 0 40 54" fill="none" aria-hidden="true">
      <path d="M20 0 V54" stroke="#C2B196" strokeWidth="1.2" />
      <g fill="#CDBDA0">
        <ellipse cx="11" cy="14" rx="8" ry="4.5" transform="rotate(28 11 14)" />
        <ellipse cx="29" cy="14" rx="8" ry="4.5" transform="rotate(-28 29 14)" />
        <ellipse cx="12" cy="28" rx="7" ry="4" transform="rotate(28 12 28)" />
        <ellipse cx="28" cy="28" rx="7" ry="4" transform="rotate(-28 28 28)" />
        <ellipse cx="20" cy="48" rx="4.5" ry="6" />
      </g>
    </svg>
  );
}

export function LeafFlower() {
  return (
    <svg width="30" height="22" viewBox="0 0 30 22" fill="none" aria-hidden="true">
      <path d="M2 16 C 8 14 11 16 13 19 C 8 20 4 19 2 16Z" fill="#C8B99E" />
      <path d="M28 16 C 22 14 19 16 17 19 C 22 20 26 19 28 16Z" fill="#C8B99E" />
      <g fill="#D8B7A4">
        <ellipse cx="15" cy="6" rx="3" ry="4.5" />
        <ellipse cx="15" cy="14" rx="3" ry="4.5" />
        <ellipse cx="10.5" cy="10" rx="4.5" ry="3" />
        <ellipse cx="19.5" cy="10" rx="4.5" ry="3" />
      </g>
      <circle cx="15" cy="10" r="2.4" fill="#B07A5E" />
    </svg>
  );
}

export function LeafDivider() {
  return (
    <div className="my-6 flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-linear-to-r from-transparent to-[#C2B196]" />
      <LeafFlower />
      <span className="h-px w-16 bg-linear-to-l from-transparent to-[#C2B196]" />
    </div>
  );
}

export function VenueMap() {
  return (
    <svg viewBox="0 0 620 240" width="100%" className="block" aria-hidden="true">
      <rect width="620" height="240" fill="#E7DDC9" />
      <rect x="34" y="26" width="150" height="78" rx="5" fill="#E0D5BF" />
      <rect x="210" y="20" width="120" height="60" rx="5" fill="#DED2BB" />
      <rect x="450" y="34" width="140" height="74" rx="5" fill="#E0D5BF" />
      <rect x="40" y="150" width="120" height="70" rx="5" fill="#DED2BB" />
      <rect x="470" y="150" width="120" height="70" rx="5" fill="#E0D5BF" />
      <path d="M250 150 q 60 -16 120 6 q 20 50 -30 70 q -70 12 -90 -30 Z" fill="#CFD8BE" />
      <path d="M0 124 H620" stroke="#FBF8F2" strokeWidth="16" />
      <path d="M196 0 V240" stroke="#FBF8F2" strokeWidth="14" />
      <path d="M430 0 V240" stroke="#FBF8F2" strokeWidth="12" />
      <path d="M0 124 H620" stroke="#D8CBB4" strokeWidth="1.5" strokeDasharray="2 9" />
      <g transform="translate(310,128)">
        <ellipse cx="0" cy="6" rx="11" ry="3.5" fill="rgba(80,60,40,.18)" />
        <path d="M0 2 C -13 -16 -11 -36 0 -36 C 11 -36 13 -16 0 2 Z" fill="#B07A5E" />
        <circle cx="0" cy="-23" r="6" fill="#FBF8F2" />
      </g>
    </svg>
  );
}
```

---

### Task 3: Create the Hero section

**Files:**
- Create: `src/app/rsvp/[id]/Hero.tsx`

- [ ] **Step 1: Write the Hero component**

Create `src/app/rsvp/[id]/Hero.tsx`:

```tsx
import { FloralSprig, LeafDivider } from "./Decorations";

export default function Hero() {
  return (
    <section className="px-8 pt-16 pb-12 text-center sm:px-16 sm:pt-[74px]">
      <p className="font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.4em] text-taupe">
        Nuestra boda
      </p>
      <div className="mt-6 mb-1 flex justify-center">
        <FloralSprig />
      </div>
      <h1 className="leading-[0.9]">
        <span className="block font-[family-name:var(--font-pinyon)] text-[76px] text-cocoa sm:text-[104px]">
          Leticia
        </span>
        <span className="block font-[family-name:var(--font-pinyon)] text-[44px] text-rosegold sm:text-[58px]">
          &amp;
        </span>
        <span className="block font-[family-name:var(--font-pinyon)] text-[76px] text-cocoa sm:text-[104px]">
          Fernando
        </span>
      </h1>
      <LeafDivider />
      <p className="font-[family-name:var(--font-cormorant)] text-lg uppercase tracking-[0.18em] text-[#7A6B57] sm:text-[21px]">
        Sábado 5 de Diciembre · 2026
      </p>
      <p className="mx-auto mt-6 max-w-[470px] font-[family-name:var(--font-ebgaramond)] text-[19px] italic leading-[1.75] text-mocha text-pretty">
        Con la bendición de Dios y de nuestras familias, queremos compartir
        contigo el día en que uniremos nuestras vidas. Tu presencia hará este
        momento aún más especial.
      </p>
    </section>
  );
}
```

---

### Task 4: Create the Details section

**Files:**
- Create: `src/app/rsvp/[id]/Details.tsx`

- [ ] **Step 1: Write the Details component**

Create `src/app/rsvp/[id]/Details.tsx`:

```tsx
import { VenueMap } from "./Decorations";

const MAP_URL =
  "https://www.google.com/maps/search/?api=1&query=Terraza+Balcones+Culiacan+Sinaloa";

export default function Details() {
  return (
    <section className="bg-sand px-8 py-14 sm:px-16">
      <p className="text-center font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.3em] text-taupe">
        Cuándo &amp; Dónde
      </p>
      <h2 className="mt-2 text-center font-[family-name:var(--font-cormorant)] text-[40px] font-medium text-cocoa">
        Los detalles
      </h2>
      <div className="mx-auto mt-9 flex max-w-[600px] items-stretch">
        <DetailCol label="Fecha" lines={["5 de Diciembre", "2026"]} />
        <span className="w-px bg-hairline" />
        <DetailCol label="Hora" lines={["2:00 PM", "de la tarde"]} />
        <span className="w-px bg-hairline" />
        <DetailCol label="Recepción" lines={["Terraza", "Balcones"]} />
      </div>
      <div className="mx-auto mt-9 max-w-[620px] overflow-hidden rounded border border-[#E0D4BF] bg-cream">
        <VenueMap />
        <div className="px-7 py-6 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold text-cocoa">
            Terraza Balcones
          </p>
          <p className="mt-1 mb-4 font-[family-name:var(--font-ebgaramond)] text-[15px] leading-relaxed text-mocha">
            Boulevard Manuel J. Clouthier Ext. 5991
            <br />
            80199 Culiacán Rosales, Sinaloa
          </p>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener"
            className="inline-block rounded-sm border border-rosegold px-6 py-3 font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.13em] text-cocoa transition hover:opacity-80"
          >
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}

function DetailCol({ label, lines }: { label: string; lines: string[] }) {
  return (
    <div className="flex-1 px-3 py-1.5 text-center sm:px-4">
      <p className="mb-2.5 font-[family-name:var(--font-tenor)] text-[11px] uppercase tracking-[0.25em] text-taupe">
        {label}
      </p>
      <p className="font-[family-name:var(--font-cormorant)] text-[22px] font-medium leading-tight text-cocoa sm:text-[25px]">
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
```

---

### Task 5: Rewrite the RSVP page

**Files:**
- Modify (full rewrite): `src/app/rsvp/[id]/page.tsx`

Behavior notes:
- Selecting a Yes/No pill sets local `selected`; it does NOT submit. The "Enviar confirmación" button submits (disabled until a pill is chosen). This matches the design's flow.
- Counter only renders when `selected === "yes"` AND `maxGuests > 1`, clamped to `1..maxGuests`.
- `done` and `locked` both render the confirmation block; no "edit response" (backend locks after one response).

- [ ] **Step 1: Replace the page contents**

Replace the entire contents of `src/app/rsvp/[id]/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Hero from "./Hero";
import Details from "./Details";
import { LeafFlower } from "./Decorations";

type Invitation = {
  id: string;
  name: string;
  maxGuests: number;
  response: "yes" | "no" | null;
  partySize: number | null;
  canRespond: boolean;
};

type Status = "loading" | "idle" | "saving" | "done" | "locked" | "error";

export default function RsvpPage() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<Invitation | null>(null);
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [partySize, setPartySize] = useState(1);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch(`/api/invitation/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Invitation) => {
        setInv(data);
        setSelected(data.response);
        setPartySize(data.partySize ?? 1);
        setStatus(data.canRespond ? "idle" : "locked");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function submit() {
    if (!selected) return;
    setStatus("saving");
    const res = await fetch(`/api/invitation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response: selected,
        partySize: selected === "yes" ? partySize : undefined,
      }),
    });
    if (res.ok) {
      setStatus("done");
    } else if (res.status === 409) {
      // Already answered in another tab/session — this invitation is locked.
      setStatus("locked");
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen justify-center bg-stone-200 sm:px-6 sm:py-10">
      <div className="w-full max-w-[680px] overflow-hidden bg-cream text-cocoa shadow-lg sm:rounded-sm">
        <Hero />
        <Details />
        <section className="px-8 py-14 text-center sm:px-16">
          <p className="font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.3em] text-taupe">
            Confirmación
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-cormorant)] text-[40px] font-medium text-cocoa">
            Confirma tu asistencia
          </h2>
          <p className="mt-2 font-[family-name:var(--font-ebgaramond)] text-[17px] italic text-mocha">
            Te esperamos. Por favor confirma antes del 1 de noviembre de 2026.
          </p>
          <div className="mx-auto mt-7 max-w-[440px]">
            {status === "error" ? (
              <p className="font-[family-name:var(--font-ebgaramond)] text-[18px] italic leading-relaxed text-mocha">
                No pudimos cargar tu invitación. Revisa el enlace o contáctanos
                directamente.
              </p>
            ) : status === "loading" || !inv ? (
              <div className="h-32 w-full animate-pulse rounded bg-[#EFE7D8]" />
            ) : status === "done" || status === "locked" ? (
              <Confirmation
                selected={selected}
                maxGuests={inv.maxGuests}
                partySize={partySize}
              />
            ) : (
              <RsvpForm
                name={inv.name}
                maxGuests={inv.maxGuests}
                selected={selected}
                setSelected={setSelected}
                partySize={partySize}
                setPartySize={setPartySize}
                saving={status === "saving"}
                onSubmit={submit}
              />
            )}
          </div>
        </section>
        <footer className="bg-cocoa px-8 py-8 text-center text-[#EDE3D2]">
          <p className="font-[family-name:var(--font-pinyon)] text-4xl">
            Leticia &amp; Fernando
          </p>
          <p className="mt-2 font-[family-name:var(--font-tenor)] text-[11px] uppercase tracking-[0.2em] text-[#B9A88F]">
            05 · 12 · 2026 — Culiacán, Sinaloa
          </p>
        </footer>
      </div>
    </main>
  );
}

function RsvpForm({
  name,
  maxGuests,
  selected,
  setSelected,
  partySize,
  setPartySize,
  saving,
  onSubmit,
}: {
  name: string;
  maxGuests: number;
  selected: "yes" | "no" | null;
  setSelected: (v: "yes" | "no") => void;
  partySize: number;
  setPartySize: (v: number) => void;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="text-left">
      <p className="mb-4 font-[family-name:var(--font-cormorant)] text-[23px] text-cocoa">
        {name}, ¿nos acompañarás?
      </p>
      <div className="flex gap-3">
        <Pill
          label="Sí, ahí estaré"
          active={selected === "yes"}
          disabled={saving}
          onClick={() => setSelected("yes")}
        />
        <Pill
          label="No podré ir"
          active={selected === "no"}
          disabled={saving}
          onClick={() => setSelected("no")}
        />
      </div>

      {selected === "yes" && maxGuests > 1 && (
        <div className="mt-7">
          <p className="mb-4 font-[family-name:var(--font-cormorant)] text-[23px] text-cocoa">
            ¿Cuántos asistirán?
          </p>
          <div className="flex items-center gap-6">
            <Stepper
              sign="–"
              disabled={saving || partySize <= 1}
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
            />
            <span className="min-w-[46px] text-center font-[family-name:var(--font-cormorant)] text-[42px] text-cocoa">
              {partySize}
            </span>
            <Stepper
              sign="+"
              disabled={saving || partySize >= maxGuests}
              onClick={() => setPartySize(Math.min(maxGuests, partySize + 1))}
            />
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!selected || saving}
        className="mt-8 w-full cursor-pointer bg-cocoa px-4 py-4 font-[family-name:var(--font-tenor)] text-[13px] uppercase tracking-[0.18em] text-[#F3EAD9] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Enviando…" : "Enviar confirmación"}
      </button>
    </div>
  );
}

function Confirmation({
  selected,
  maxGuests,
  partySize,
}: {
  selected: "yes" | "no" | null;
  maxGuests: number;
  partySize: number;
}) {
  const title =
    selected === "yes"
      ? "¡Qué alegría!"
      : selected === "no"
        ? "Te vamos a extrañar"
        : "Todo listo";

  const message =
    selected === "yes"
      ? maxGuests > 1
        ? `Nos vemos en la celebración. Apartamos lugar para ${partySize} ${
            partySize === 1 ? "invitado" : "invitados"
          }. ¡Gracias por confirmar!`
        : "Nos vemos en la celebración. ¡Gracias por confirmar!"
      : selected === "no"
        ? "Lamentamos que no puedas acompañarnos. ¡Gracias por avisarnos!"
        : "Tu respuesta ya fue registrada.";

  return (
    <div className="py-3 text-center">
      <div className="mb-1 flex justify-center">
        <LeafFlower />
      </div>
      <p className="mt-2 mb-1 font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-rosegold">
        {title}
      </p>
      <p className="mx-auto max-w-[360px] font-[family-name:var(--font-ebgaramond)] text-[18px] italic leading-relaxed text-mocha">
        {message}
      </p>
      <p className="mx-auto mt-6 max-w-[380px] rounded-sm bg-sand px-4 py-3 font-[family-name:var(--font-ebgaramond)] text-[15px] not-italic text-mocha">
        Tu respuesta quedó registrada. ¿Necesitas cambiar algo? Contáctanos
        directamente y reabriremos tu invitación.
      </p>
    </div>
  );
}

function Pill({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`flex-1 cursor-pointer rounded-sm border px-3 py-4 font-[family-name:var(--font-tenor)] text-xs uppercase tracking-[0.13em] transition disabled:cursor-not-allowed ${
        active
          ? "border-rosegold bg-rosegold text-cream shadow-[0_6px_16px_rgba(120,90,60,0.18)]"
          : "border-hairline bg-transparent text-mocha hover:border-rosegold"
      }`}
    >
      {label}
    </button>
  );
}

function Stepper({
  sign,
  disabled,
  onClick,
}: {
  sign: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-hairline font-[family-name:var(--font-cormorant)] text-[28px] text-mocha transition select-none hover:border-rosegold disabled:cursor-not-allowed disabled:opacity-40"
    >
      {sign}
    </button>
  );
}
```

---

### Task 6: Verify build, lint, and behavior

**Files:** none (verification only)

- [ ] **Step 1: Lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds; `/rsvp/[id]` route compiles; fonts download without error.

- [ ] **Step 3: Manual state check**

Run `npm run dev`, open a seeded invitation link (see `scripts/seed.ts` / admin page for an id), and confirm:
- Hero, Details (with map link), and footer render in the Option-1 palette/fonts.
- `idle`: Yes/No pills select; choosing "Sí" with `maxGuests > 1` reveals the clamped counter; "No" hides it; submit disabled until a pill is chosen.
- `saving`: button shows "Enviando…".
- `done`: confirmation block (correct title/message + party size summary); no edit control.
- Reload after responding → `locked` shows the same confirmation.
- Bad id / network error → `error` message.

- [ ] **Step 4: Commit (only after the user approves)**

Per the repo rule, ask the user before committing. When approved:

```bash
git add src/app/layout.tsx src/app/globals.css "src/app/rsvp/[id]/Decorations.tsx" "src/app/rsvp/[id]/Hero.tsx" "src/app/rsvp/[id]/Details.tsx" "src/app/rsvp/[id]/page.tsx" docs/superpowers/specs docs/superpowers/plans
git commit -m "feat(rsvp): full Clásico romántico invitation page"
```

---

## Self-review notes

- **Spec coverage:** fonts/palette (Task 1), decorations SVGs (Task 2), hero (Task 3), details/venue + map link (Task 4), RSVP state mapping + personalization + counter clamping + footer (Task 5), verification (Task 6). All spec sections covered.
- **Language:** Spanish only; no i18n import on this page. `i18n.ts` untouched for other pages.
- **Out of scope honored:** no API/schema/validation/admin/seed changes; no edit-response flow; no English copy.
- **Type consistency:** `Invitation`, `Status`, and the `selected: "yes" | "no" | null` shape are consistent across `page.tsx` and child component props.
