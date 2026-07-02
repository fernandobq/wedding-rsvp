"use client";

import { useRef, useState, useTransition } from "react";
import { addGuest } from "@/app/actions";

export function AddGuest() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addGuest(formData);
      formRef.current?.reset();
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
      >
        Add guest
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow ring-1 ring-stone-900/5"
    >
      <label className="flex flex-col text-xs font-medium text-stone-500">
        Name
        <input
          type="text"
          name="name"
          required
          maxLength={200}
          autoFocus
          placeholder="e.g. The Smith Family"
          className="mt-1 w-64 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
      </label>
      <label className="flex flex-col text-xs font-medium text-stone-500">
        Max guests
        <input
          type="number"
          name="maxGuests"
          min={1}
          max={20}
          defaultValue={1}
          required
          className="mt-1 w-24 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-800 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
      </label>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:opacity-60"
        >
          {isPending ? "Adding…" : "Add"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isPending}
          className="rounded-md border border-stone-300 px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
