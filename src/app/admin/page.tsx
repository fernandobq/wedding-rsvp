import { sql, eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { guests } from "@/db/schema";
import { AddGuest } from "./AddGuest";
import { GuestTable } from "./GuestTable";

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
  const totalPeople = rows.reduce((sum, g) => sum + g.maxGuests, 0);
  const yes = rows.filter((g) => g.response === "yes").length;
  const no = rows.filter((g) => g.response === "no").length;
  const pending = rows.filter((g) => g.response === null).length;
  const replied = yes + no;
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

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Attending (people)" value={attendingCount} accent />
          <Stat label="Answered" value={yes} />
          <Stat label="Replied" value={replied} />
          <Stat label="Invited (people)" value={invited} />
          <Stat label="Total on list (people)" value={totalPeople} />
          <Stat label="Said no" value={no} />
        </section>

        <GuestTable rows={rows} />
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
