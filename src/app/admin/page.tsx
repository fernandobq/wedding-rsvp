import { sql, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { guests } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rows = await db.select().from(guests).orderBy(desc(guests.createdAt));

  const [{ attending }] = await db
    .select({ attending: sql<number>`coalesce(sum(${guests.partySize}), 0)` })
    .from(guests)
    .where(eq(guests.response, "yes"));

  const total = rows.length;
  const yes = rows.filter((g) => g.response === "yes").length;
  const no = rows.filter((g) => g.response === "no").length;
  const pending = rows.filter((g) => g.response === null).length;
  const attendingCount = Number(attending);

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-stone-800">RSVP dashboard</h1>
          <p className="mt-1 text-stone-600">
            {total} invitation{total === 1 ? "" : "s"} · {pending} awaiting a reply
          </p>
        </header>

        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Attending (people)" value={attendingCount} accent />
          <Stat label="Said yes" value={yes} />
          <Stat label="Said no" value={no} />
          <Stat label="No reply yet" value={pending} />
        </section>

        <div className="overflow-hidden rounded-xl bg-white shadow ring-1 ring-stone-900/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <Th>Name</Th>
                <Th>Response</Th>
                <Th>Party</Th>
                <Th>Responded</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((g) => (
                <tr key={g.id} className="align-top">
                  <Td className="font-medium text-stone-800">{g.name}</Td>
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
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <Td className="text-stone-500">
                    No guests yet. Run the seed script to add your list.
                  </Td>
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
