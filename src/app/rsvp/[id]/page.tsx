import type { Metadata } from "next";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { guests } from "@/db/schema";
import RsvpClient from "./RsvpClient";

export const dynamic = "force-dynamic";

const OG_IMAGE = "/og-image.jpg";
const uuidSchema = z.uuid();

// Look up the invited guest's name for the invitation link. Cached so the page
// and generateMetadata don't hit the database twice for the same request.
const getGuestName = cache(async (id: string): Promise<string | null> => {
  if (!uuidSchema.safeParse(id).success) return null;
  const row = (
    await db
      .select({ name: guests.name, isInvited: guests.isInvited })
      .from(guests)
      .where(eq(guests.id, id))
      .limit(1)
  )[0];
  // Only reveal the name for invited guests.
  return row?.isInvited ? row.name : null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const name = await getGuestName(id);

  const title = "Boda de L&F";
  const description = name
    ? `Te invitamos a nuestra boda, ${name}`
    : "Te invitamos a nuestra boda";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 696,
          height: 784,
          type: "image/jpeg",
          alt: "Leticia & Fernando",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RsvpClient id={id} />;
}
