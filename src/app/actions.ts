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
