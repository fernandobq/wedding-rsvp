"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { type Lang, translations, useLanguage } from "@/lib/i18n";

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
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [inv, setInv] = useState<Invitation | null>(null);
  const [partySize, setPartySize] = useState(1);
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch(`/api/invitation/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Invitation) => {
        setInv(data);
        setPartySize(data.partySize ?? 1);
        setChoice(data.response);
        setStatus(data.canRespond ? "idle" : "locked");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function submit(response: "yes" | "no") {
    setStatus("saving");
    setChoice(response);
    const res = await fetch(`/api/invitation/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        response,
        partySize: response === "yes" ? partySize : undefined,
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

  if (status === "error") {
    return (
      <Shell lang={lang} onChangeLang={setLang}>
        <h1 className="text-2xl font-semibold">{t.errorTitle}</h1>
        <p className="mt-3 text-stone-600">{t.errorBody}</p>
      </Shell>
    );
  }

  if (status === "loading" || !inv) {
    return (
      <Shell lang={lang} onChangeLang={setLang}>
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-2/3 rounded bg-stone-200" />
          <div className="h-4 w-1/2 rounded bg-stone-200" />
          <div className="h-24 rounded bg-stone-200" />
        </div>
      </Shell>
    );
  }

  if (status === "done") {
    return (
      <Shell lang={lang} onChangeLang={setLang}>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          {choice === "yes" ? t.seeYouThere : t.missYou}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-800">
          {t.thankYou(inv.name)}
        </h1>
        <p className="mt-3 text-stone-600">
          {choice === "yes" ? t.savedYes(inv.maxGuests, partySize) : t.savedNo}
        </p>
        <p className="mt-6 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-600">
          {t.doneNote}
        </p>
      </Shell>
    );
  }

  if (status === "locked") {
    return (
      <Shell lang={lang} onChangeLang={setLang}>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          {choice === "yes" ? t.seeYouThere : t.missYou}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-800">
          {t.allSet(inv.name)}
        </h1>
        <p className="mt-3 text-stone-600">
          {choice === "yes"
            ? t.lockedYes(inv.maxGuests, partySize)
            : choice === "no"
              ? t.lockedNo
              : t.lockedAlready}
        </p>
        <p className="mt-6 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-600">
          {t.lockedNote}
        </p>
      </Shell>
    );
  }

  return (
    <Shell lang={lang} onChangeLang={setLang}>
      <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
        {t.invited}
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-800">
        {t.greeting(inv.name)}
      </h1>
      <p className="mt-2 text-stone-600">{t.joinUs}</p>
      <p className="mt-3 text-sm text-stone-500">{t.onlyOnce}</p>

      <div className="mt-6 space-y-5">
        {inv.maxGuests > 1 && (
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              {t.howMany}
            </span>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {Array.from({ length: inv.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {t.guestOption(n)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button
          disabled={status === "saving"}
          onClick={() => submit("yes")}
          className="flex-1 rounded-lg bg-rose-600 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" && choice === "yes" ? t.saving : t.yesButton}
        </button>
        <button
          disabled={status === "saving"}
          onClick={() => submit("no")}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" && choice === "no" ? t.saving : t.noButton}
        </button>
      </div>
    </Shell>
  );
}

function Shell({
  children,
  lang,
  onChangeLang,
}: {
  children: React.ReactNode;
  lang: Lang;
  onChangeLang: (next: Lang) => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-rose-50 to-stone-100 px-4 py-12">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-stone-900/5">
        <LanguageToggle lang={lang} onChange={onChangeLang} />
        {children}
      </div>
    </main>
  );
}

function LanguageToggle({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
}) {
  const labels = translations[lang].langToggle;
  return (
    <div className="absolute right-4 top-4 flex items-center gap-1 text-xs font-medium">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          className={`rounded-md px-2 py-1 transition ${
            lang === l
              ? "bg-rose-100 text-rose-700"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
