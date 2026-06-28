"use client";

import { useState } from "react";

export function CopyLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/rsvp/${id}`;

  async function copy() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. non-secure context)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <code className="truncate rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
        {path}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md border border-stone-300 px-2 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-50"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
