import { db } from "../src/db";
import { guests } from "../src/db/schema";

// Edit this list with your real guests, then run `npm run db:seed`.
// Re-running only inserts these rows again; it does not touch existing ones,
// so add new guests here over time and re-run to mint their links.
const list = [
  { name: "Familia García", maxGuests: 4 },
  { name: "Juan Pérez", maxGuests: 2 },
  { name: "Ana López", maxGuests: 1 },
];

// Set this to your deployed site once you know it (e.g. https://my-wedding.netlify.app).
const base = process.env.SITE_URL ?? "http://localhost:3000";

async function main() {
  const inserted = await db
    .insert(guests)
    .values(list)
    .returning({ id: guests.id, name: guests.name });

  console.log("\nPrivate RSVP links (send these to your guests):\n");
  for (const g of inserted) {
    console.log(`${g.name}\t${base}/rsvp/${g.id}`);
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
