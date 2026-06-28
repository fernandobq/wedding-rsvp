# Wedding RSVP

A small, free RSVP app. Each invitation (a person or a household) gets a private
link containing its UUID. Guests open the link, answer yes/no, say how many are
coming, and leave dietary/notes. A password-protected `/admin` dashboard shows
who has replied and the total headcount.

Built with Next.js (App Router), Neon Postgres, Drizzle ORM, and Zod, deployable
free on Netlify.

## Stack

| Concern        | Choice                              |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 (App Router)             |
| Database       | Neon Postgres (free tier)           |
| DB driver      | `@neondatabase/serverless` (HTTP)   |
| ORM            | Drizzle + drizzle-kit migrations    |
| Validation     | Zod                                 |
| Styling        | Tailwind CSS                        |
| Admin auth     | HTTP Basic Auth via `src/proxy.ts`  |

## Setup

1. Create a [Neon](https://neon.tech) project and copy the **pooled** connection
   string.
2. Fill in `.env.local` (already created, git-ignored):

   ```
   DATABASE_URL="postgresql://...your-neon-pooled-url..."
   ADMIN_PASSWORD="a-long-random-string"
   # SITE_URL="https://your-site.netlify.app"   # used by the seed script
   ```

3. Create the table and seed your guest list:

   ```bash
   npm run db:migrate   # applies the migration in ./drizzle to Neon
   npm run db:seed      # inserts guests and prints their private links
   ```

   Edit the list in [`scripts/seed.ts`](scripts/seed.ts) first. Re-running only
   inserts the listed rows; existing rows are untouched, so add new guests over
   time and re-run to mint their links.

4. Run locally:

   ```bash
   npm run dev
   ```

   - Guest page: `http://localhost:3000/rsvp/<id>`
   - Admin dashboard: `http://localhost:3000/admin` (any username; password is
     `ADMIN_PASSWORD`)

## Scripts

| Command              | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Start the dev server                               |
| `npm run build`      | Production build                                   |
| `npm run db:generate`| Generate a new migration from the schema           |
| `npm run db:migrate` | Apply migrations to the database                   |
| `npm run db:push`    | Push the schema directly (no migration file)       |
| `npm run db:studio`  | Browse/edit the data in Drizzle Studio             |
| `npm run db:seed`    | Insert the seed guest list and print links         |

> `.env.local` is loaded automatically by `drizzle.config.ts` (via
> `process.loadEnvFile`) and by the seed script (via `tsx --env-file`), so the
> db scripts work without any extra dotenv setup.

## Deploy to Netlify

1. Push the repo to GitHub and import it in Netlify (the Next.js runtime is
   automatic).
2. In Netlify > Site settings > Environment variables, add `DATABASE_URL` and
   `ADMIN_PASSWORD` (same values as `.env.local`).
3. Deploy, then open a seeded `/rsvp/<id>` link and submit a test RSVP.
4. Set `SITE_URL` to your real domain and re-run `npm run db:seed` if you seeded
   before knowing the URL.

## Data model

One row per invitation in the `guests` table. `response` is `null` until the
guest answers (so "answered" is derivable and not stored). `party_size` is set
only on a "yes" and is clamped server-side to the invitation's `max_guests`.
