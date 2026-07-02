"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { toggleInvite, deleteGuest } from "@/app/actions";

export function RowActions({
  id,
  name,
  isInvited,
}: {
  id: string;
  name: string;
  isInvited: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleToggleInvite() {
    const formData = new FormData();
    formData.set("id", id);
    formData.set("invited", isInvited ? "false" : "true");
    startTransition(() => toggleInvite(formData));
    setOpen(false);
  }

  async function handleCopy() {
    const url = `${window.location.origin}/rsvp/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. non-secure context)
    }
  }

  function handleDelete() {
    if (!window.confirm(`Remove ${name} from the list? This can't be undone.`)) {
      return;
    }
    const formData = new FormData();
    formData.set("id", id);
    startTransition(() => deleteGuest(formData));
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md border border-stone-300 px-2.5 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
      >
        {isPending ? "Working…" : "Actions"}
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 text-stone-400"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-stone-900/10"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleToggleInvite}
            className="block w-full px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-50"
          >
            {isInvited ? "Uninvite" : "Invite"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="block w-full px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-50"
          >
            {copied ? "Link copied!" : "Copy invitation link"}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleDelete}
            className="block w-full px-3 py-2 text-left text-sm text-rose-700 transition hover:bg-rose-50"
          >
            Delete guest
          </button>
        </div>
      )}
    </div>
  );
}
