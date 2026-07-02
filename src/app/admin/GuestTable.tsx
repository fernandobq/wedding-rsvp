"use client";

import { useMemo, useState } from "react";
import type { Guest } from "@/db/schema";
import { unlockGuest } from "@/app/actions";
import { RowActions } from "./RowActions";

export function GuestTable({ rows }: { rows: Guest[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((g) => g.name.toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-md border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-stone-800 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
        {query.trim() && (
          <span className="shrink-0 text-xs text-stone-500">
            {filtered.length} of {rows.length}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow ring-1 ring-stone-900/5">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <Th>Name</Th>
              <Th>Invited</Th>
              <Th>Response</Th>
              <Th>Party</Th>
              <Th>Responded</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((g) => (
              <tr
                key={g.id}
                className={`align-top ${g.isInvited ? "" : "bg-stone-50/60"}`}
              >
                <Td className="font-medium text-stone-800">{g.name}</Td>
                <Td>
                  <InvitedBadge invited={g.isInvited} />
                </Td>
                <Td>
                  <ResponseBadge response={g.response} />
                </Td>
                <Td className="font-medium text-stone-400">
                  {g.response === "yes" ? (g.partySize ?? 1) : "—"} /{" "}
                  {g.maxGuests}
                </Td>
                <Td className="whitespace-nowrap text-stone-500">
                  {g.respondedAt
                    ? new Date(g.respondedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </Td>
                <Td>
                  {g.canRespond ? (
                    <span className="text-xs text-stone-400">Open</span>
                  ) : (
                    <form action={unlockGuest}>
                      <input type="hidden" name="id" value={g.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Unlock
                      </button>
                    </form>
                  )}
                </Td>
                <Td>
                  <RowActions id={g.id} name={g.name} isInvited={g.isInvited} />
                </Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-stone-500" colSpan={7}>
                  No guests yet. Run the seed script to add your list.
                </td>
              </tr>
            )}
            {rows.length > 0 && filtered.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-stone-500" colSpan={7}>
                  No guests match “{query.trim()}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResponseBadge({ response }: { response: "yes" | "no" | null }) {
  const styles =
    response === "yes"
      ? "bg-green-100 text-green-700"
      : response === "no"
        ? "bg-stone-200 text-stone-600"
        : "bg-amber-100 text-amber-700";
  const label =
    response === "yes" ? "Yes" : response === "no" ? "No" : "Pending";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}

function InvitedBadge({ invited }: { invited: boolean }) {
  const styles = invited
    ? "bg-rose-100 text-rose-700"
    : "bg-stone-200 text-stone-500";
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}
    >
      {invited ? "Invited" : "Not invited"}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
