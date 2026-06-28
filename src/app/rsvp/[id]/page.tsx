"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
      <Shell>
        <h1 className="text-2xl font-semibold">Hmm, something went wrong</h1>
        <p className="mt-3 text-stone-600">
          Please double-check the link from your invitation, or reach out to us
          directly.
        </p>
      </Shell>
    );
  }

  if (status === "loading" || !inv) {
    return (
      <Shell>
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
      <Shell>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          {choice === "yes" ? "See you there" : "We'll miss you"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-800">
          Thank you, {inv.name}!
        </h1>
        <p className="mt-3 text-stone-600">
          {choice === "yes"
            ? `Your RSVP is saved${
                inv.maxGuests > 1 ? ` for ${partySize} ` : " "
              }${
                inv.maxGuests > 1
                  ? partySize === 1
                    ? "guest"
                    : "guests"
                  : ""
              }.`
            : "Your response is saved. Thank you for letting us know."}
        </p>
        <p className="mt-6 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-600">
          This is locked in now. Need to change something? Just reach out to us
          directly and we&apos;ll reopen your invitation.
        </p>
      </Shell>
    );
  }

  if (status === "locked") {
    return (
      <Shell>
        <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
          {choice === "yes" ? "See you there" : "We'll miss you"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-stone-800">
          You&apos;re all set, {inv.name}!
        </h1>
        <p className="mt-3 text-stone-600">
          {choice === "yes"
            ? `You let us know you'll be joining${
                inv.maxGuests > 1 && partySize
                  ? ` with ${partySize} ${partySize === 1 ? "guest" : "guests"}`
                  : ""
              }.`
            : choice === "no"
              ? "You let us know you won't be able to make it."
              : "Your RSVP has already been recorded."}
        </p>
        <p className="mt-6 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Your answer is locked in. Need to change it? Please reach out to us
          directly and we&apos;ll reopen your invitation.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="text-sm font-medium uppercase tracking-widest text-rose-500">
        You&apos;re invited
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-stone-800">
        Hi {inv.name}!
      </h1>
      <p className="mt-2 text-stone-600">
        We would be so happy to celebrate with you. Will you join us?
      </p>
      <p className="mt-3 text-sm text-stone-500">
        Heads up: you can only answer once, so pick the option that&apos;s right
        for you.
      </p>

      <div className="mt-6 space-y-5">
        {inv.maxGuests > 1 && (
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              How many of you are coming?
            </span>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              {Array.from({ length: inv.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "guest" : "guests"}
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
          {status === "saving" && choice === "yes"
            ? "Saving…"
            : "Yes, I'll be there"}
        </button>
        <button
          disabled={status === "saving"}
          onClick={() => submit("no")}
          className="flex-1 rounded-lg border border-stone-300 bg-white px-4 py-3 font-medium text-stone-700 shadow-sm transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "saving" && choice === "no"
            ? "Saving…"
            : "Sorry, can't make it"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-stone-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-stone-900/5">
        {children}
      </div>
    </main>
  );
}
