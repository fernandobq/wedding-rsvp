import { db } from "../src/db";
import { guests } from "../src/db/schema";

// Edit this list with your real guests, then run `npm run db:seed`.
// Re-running only inserts these rows again; it does not touch existing ones,
// so add new guests here over time and re-run to mint their links.
const list = [
  { name: "Leticia Villaverde", maxGuests: 1 },
  { name: "Fernando Barraza", maxGuests: 1 },
  { name: "Leticia Sicairos", maxGuests: 4 },
  { name: "Karen", maxGuests: 2 },
  { name: "Nereida Sicairos", maxGuests: 2 },
  { name: "Guili Sicairos", maxGuests: 1 },
  { name: "Lupita Sicairos", maxGuests: 2 },
  { name: "Irma Sicairos", maxGuests: 2 },
  { name: "Vanessa Sicairos", maxGuests: 1 },
  { name: "Marcela Fernandez", maxGuests: 1 },
  { name: "Otoro", maxGuests: 2 },
  { name: "Julio", maxGuests: 1 },
  { name: "Ofelia Quintero", maxGuests: 3 },
  { name: "Crissel Andrea Castro Quintero", maxGuests: 2 },
  { name: "Monica", maxGuests: 1 },
  { name: "Mercedes Quintero", maxGuests: 1 },
  { name: "Jesus Alfredo Flores", maxGuests: 2 },
  { name: "Jesus Eduardo Lizarraga", maxGuests: 2 },
  { name: "Roberto Muro", maxGuests: 2 },
  { name: "Constanza Duarte", maxGuests: 2 },
  { name: "Samuel Campos Coronel", maxGuests: 2 },
  { name: "Roberto Ponce", maxGuests: 2 },
  { name: "Mercedes Calderon", maxGuests: 1 },
  { name: "Farideh Castro", maxGuests: 1 },
  { name: "Angel Morelos", maxGuests: 1 },
  { name: "Fernando Cuen", maxGuests: 1 },
  { name: "Alfredo Aldana Avendaño", maxGuests: 2 },
  { name: "Juan Carlos Verduzco", maxGuests: 1 },
  { name: "Arturo Lopez Lopez", maxGuests: 2 },
  { name: "Aurelio Quintero", maxGuests: 2 },
  { name: "Oscar Amigo de Lety", maxGuests: 1 },
  { name: "Cesar Amigo de Lety", maxGuests: 1 },
  { name: "Jose Carlos Aispuro Beltran", maxGuests: 2 },
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
