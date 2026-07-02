"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { guests } from "@/db/schema";

const uuidSchema = z.uuid();

// Re-open a guest's invitation so they can answer again. Triggered from the
// admin dashboard when a guest reaches out asking to change their RSVP.
export async function unlockGuest(formData: FormData) {
  const id = String(formData.get("id"));
  if (!uuidSchema.safeParse(id).success) return;

  await db.update(guests).set({ canRespond: true }).where(eq(guests.id, id));
  revalidatePath("/admin");
}

// Mark a guest as invited / not invited from the admin dashboard. Only invited
// guests can view or respond to their invitation. The desired next state is
// passed as a hidden field so we don't need an extra read.
export async function toggleInvite(formData: FormData) {
  const id = String(formData.get("id"));
  if (!uuidSchema.safeParse(id).success) return;

  const isInvited = formData.get("invited") === "true";

  await db.update(guests).set({ isInvited }).where(eq(guests.id, id));
  revalidatePath("/admin");
}

const addGuestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  maxGuests: z.coerce.number().int().min(1).max(20),
});

// Add a new guest to the list from the admin dashboard.
export async function addGuest(formData: FormData) {
  const parsed = addGuestSchema.safeParse({
    name: formData.get("name"),
    maxGuests: formData.get("maxGuests"),
  });
  if (!parsed.success) return;

  await db.insert(guests).values({
    name: parsed.data.name,
    maxGuests: parsed.data.maxGuests,
  });
  revalidatePath("/admin");
}

// Permanently remove a guest from the list.
export async function deleteGuest(formData: FormData) {
  const id = String(formData.get("id"));
  if (!uuidSchema.safeParse(id).success) return;

  await db.delete(guests).where(eq(guests.id, id));
  revalidatePath("/admin");
}
