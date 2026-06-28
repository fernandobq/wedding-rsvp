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
