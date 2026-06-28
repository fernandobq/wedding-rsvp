import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { guests } from "@/db/schema";
import { respondSchema } from "@/lib/validation";

const uuidSchema = z.uuid();

// GET: load an invitation so the guest's page can show their name + options
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid invitation" }, { status: 400 });
  }

  const row = (
    await db
      .select({
        id: guests.id,
        name: guests.name,
        maxGuests: guests.maxGuests,
        response: guests.response,
        partySize: guests.partySize,
      })
      .from(guests)
      .where(eq(guests.id, id))
      .limit(1)
  )[0];

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

// PATCH: record the RSVP
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) {
    return NextResponse.json({ error: "Invalid invitation" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const existing = (
    await db.select().from(guests).where(eq(guests.id, id)).limit(1)
  )[0];
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { response } = parsed.data;

  // Only a "yes" has a party size; clamp it to 1..maxGuests
  let partySize: number | null = null;
  if (response === "yes") {
    const requested = parsed.data.partySize ?? 1;
    partySize = Math.min(Math.max(requested, 1), existing.maxGuests);
  }

  const updated = (
    await db
      .update(guests)
      .set({
        response,
        partySize,
        respondedAt: new Date(),
      })
      .where(eq(guests.id, id))
      .returning()
  )[0];

  return NextResponse.json({ ok: true, invitation: updated });
}
