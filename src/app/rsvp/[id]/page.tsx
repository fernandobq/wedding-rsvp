"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Hero from "./Hero";
import Details from "./Details";
import GiftRegistry from "./GiftRegistry";
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
    try {
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
    } catch {
      // Network failure — don't leave the guest stuck on the spinner.
      setStatus("error");
    }
  }

  return (
    <main className="flex min-h-screen justify-center bg-stone-200 sm:px-6 sm:py-10">
      <div className="w-full max-w-[680px] overflow-hidden bg-cream text-cocoa shadow-lg sm:rounded-sm">
        <Hero />
        <Details />
        <section
          aria-label="Confirmación de asistencia"
          className="px-8 py-14 text-center sm:px-16"
        >
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
        <GiftRegistry />
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
              label="Quitar un invitado"
              disabled={saving || partySize <= 1}
              onClick={() => setPartySize(Math.max(1, partySize - 1))}
            />
            <span className="min-w-[46px] text-center font-[family-name:var(--font-cormorant)] text-[42px] text-cocoa">
              {partySize}
            </span>
            <Stepper
              sign="+"
              label="Agregar un invitado"
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
  label,
  disabled,
  onClick,
}: {
  sign: string;
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-[46px] w-[46px] cursor-pointer items-center justify-center rounded-full border border-hairline font-[family-name:var(--font-cormorant)] text-[28px] text-mocha transition select-none hover:border-rosegold disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span aria-hidden="true">{sign}</span>
    </button>
  );
}
