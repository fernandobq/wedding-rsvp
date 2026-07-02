import { sql, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { guests } from "@/db/schema";
import { unlockGuest } from "@/app/actions";
import { AddGuest } from "./AddGuest";
import { RowActions } from "./RowActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rows = await db.select().from(guests).orderBy(desc(guests.createdAt));

  const [{ attending }] = await db
    .select({ attending: sql<number>`coalesce(sum(${guests.partySize}), 0)` })
    .from(guests)
    .where(eq(guests.response, "yes"));

  const total = rows.length;
  const invitedRows = rows.filter((g) => g.isInvited);
  const invitedHouseholds = invitedRows.length;
  const invited = invitedRows.reduce((sum, g) => sum + g.maxGuests, 0);
  const yes = rows.filter((g) => g.response === "yes").length;
  const no = rows.filter((g) => g.response === "no").length;
  const pending = rows.filter((g) => g.response === null).length;
  const attendingCount = Number(attending);

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-stone-800">
              RSVP dashboard
            </h1>
            <p className="mt-1 text-stone-600">
              {invitedHouseholds} of {total} on the list invited · {pending}{" "}
              awaiting a reply
            </p>
          </div>
          <AddGuest />
        </header>

        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <Stat label="Invited (people)" value={invited} />
          <Stat label="Attending (people)" value={attendingCount} accent />
          <Stat label="Said yes" value={yes} />
          <Stat label="Said no" value={no} />
          <Stat label="No reply yet" value={pending} />
        </section>

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
              {rows.map((g) => (
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
                  <Td>
                    {g.response === "yes"
                      ? `${g.partySize ?? 1} / ${g.maxGuests}`
                      : "—"}
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
                    <RowActions
                      id={g.id}
                      name={g.name}
                      isInvited={g.isInvited}
                    />
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
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 shadow ring-1 ring-stone-900/5 ${
        accent ? "bg-rose-600 text-white" : "bg-white text-stone-800"
      }`}
    >
      <div className="text-3xl font-semibold">{value}</div>
      <div
        className={`mt-1 text-xs font-medium uppercase tracking-wide ${
          accent ? "text-rose-100" : "text-stone-500"
        }`}
      >
        {label}
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
  const label = response === "yes" ? "Yes" : response === "no" ? "No" : "Pending";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {label}
    </span>
  );
}

function InvitedBadge({ invited }: { invited: boolean }) {
  const styles = invited
    ? "bg-rose-100 text-rose-700"
    : "bg-stone-200 text-stone-500";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
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
