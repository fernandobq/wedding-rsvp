import { z } from "zod";

// Validates the RSVP request body at runtime.
// partySize is clamped to the invitation's maxGuests in the handler,
// since that limit depends on the specific row.
export const respondSchema = z.strictObject({
  response: z.enum(["yes", "no"]),
  partySize: z.number().int().positive().optional(),
  dietary: z.string().max(500).optional(),
  notes: z.string().max(500).optional(),
});

export type RespondInput = z.infer<typeof respondSchema>;
