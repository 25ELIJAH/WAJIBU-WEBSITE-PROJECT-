# WAJIBU Charity Portal

A private directory that connects companies with vetted charities. WAJIBU controls every account, every
profile and every introduction. The portal uses the same palette, fonts and buttons as the main site.

## Decisions it implements

| Area | Decision |
| --- | --- |
| Registration | Organisations **request access** (`/request-access`). WAJIBU reviews, approves and chooses the single administrator who receives the login. |
| Visibility | Charity profiles are visible **only to signed-in companies** (and WAJIBU). A charity can open **only its own page**. Companies cannot see each other – the company side is fully private. |
| Accounts | **One administrator per organisation**, set by WAJIBU. WAJIBU's own administrator is `Admin1@wajibu.uk` (Samuel Orie). |
| Deletion | Charities and companies cannot delete anything. They press **Request account deletion** on their Account page; WAJIBU sees it under Admin → Requests and either deletes the organisation (Organisations → Manage → Delete) or declines it. |
| Uploads | **No upload capability for charities or companies.** Only WAJIBU administrators add photos (JPG/PNG/WebP, 5 MB, verified from the file bytes, stored in the database and served only to permitted users). No videos. |
| Sectors | Environment, Social Welfare, Education and Orphanage to start. WAJIBU manages the list in **Admin → Sectors** – add, rename, hide, or remove a sector (only when no charity uses it); existing tags keep working. |
| Profile | Directory cards show **name and country only**. The profile page shows the registered charity number in the summary. |
| Search | Companies filter by **sector** and can search by name or country; results are paged (24 per page). The company profile already stores a `values` field to feed the future AI matching feature. |
| Shortlist | Companies tick several charities, add them to their **dashboard** shortlist, then request a connection for the selection. |
| Matching | The company selects the charity, **WAJIBU takes over**. Both parties are notified (in-app, plus email when configured). The charity is told "a company has expressed interest" – the company's identity stays with WAJIBU. |
| Featuring | WAJIBU can **feature** a charity and set a **compliance level (0–5)**. Order: featured → compliance level → A–Z. |
| Reporting | Admin → Reports: views, distinct companies, shortlist adds and connection requests per charity (7/30/90 days or all time). |
| Branding | Portal pages reuse the WAJIBU site design and sit under the WAJIBU brand. |

## Running it

```bash
npm install
cp .env.example .env           # then fill in SESSION_SECRET and ADMIN_PASSWORD
npx prisma migrate dev         # creates the database
npm run db:seed                # creates Admin1@wajibu.uk (must change password at first sign-in)
npm run dev                    # http://localhost:3000/login
```

Generate a session secret with:
`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

## Going live (end of November)

The code already runs on SQLite locally and PostgreSQL in production – the right database is chosen from
`DATABASE_URL`, so there is nothing to edit. A ready-made Postgres schema and migration are committed in
`prisma/postgres/` (regenerate with `npm run db:postgres` after any change to `prisma/schema.prisma`).
Photos are stored in the database, so no separate file storage is needed.

1. **Create a Postgres database** – Neon or Supabase (both have a free tier). Copy the connection string
   (it starts with `postgresql://`).
2. **Create the project on Vercel or Netlify** from this GitHub repo and set these environment variables:
   - `DATABASE_URL` – the Postgres connection string
   - `SESSION_SECRET` – a long random value: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`
   - `NEXT_PUBLIC_SITE_URL` – `https://www.wajibu.uk`
   - optional: `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL` (email notifications)
3. **Deploy.** `npm run build` generates the Postgres client and applies the migration automatically before building.
4. **Create the first administrator once**, from your computer, pointing at the production database:
   `DATABASE_URL="postgresql://…" ADMIN_PASSWORD="a-strong-temporary-password" npm run db:seed`
   Then sign in as `Admin1@wajibu.uk` – you will be asked to choose your own password straight away.
5. **Point wajibu.uk at the new deployment** (domain settings on the host).
6. **Email** (optional) – create a Resend account, verify `wajibu.uk`, set `RESEND_API_KEY`. Until then notifications
   appear in the portal only.
7. **Soft launch** – use Admin → **Import** to load the first charities from a CSV (e.g. a SharePoint export), then open each
   one to review the profile, add photos, assign its administrator and tick **Published**. Unpublished charities are
   invisible to companies. Admin → **Staff** manages WAJIBU administrator accounts.

## Tests

`npm test` runs the unit tests for the CSV importer, password rules, sector keys and photo validation.

## Security notes

- Passwords are hashed with bcrypt (cost 12); minimum 10 characters; temporary passwords force a change at first sign-in.
- Sessions are signed (HS256) httpOnly cookies, 8 hours, re-checked against the database on every request, so suspending
  an account takes effect immediately. `/portal`, `/admin` and `/api/portal` redirect to sign-in without a cookie.
- Every admin action re-checks the ADMIN role on the server; companies can act only on their own shortlist and requests.
- Login attempts are rate-limited per email (in memory – put Redis/Upstash behind it when running several instances).
- Temporary passwords are shown to the WAJIBU admin once, via a 30-second httpOnly cookie – never in a URL or email.
- Pages are `noindex` and `no-store`.

## Not built yet (by design)

- AI matching on company values (field and extension point exist: `CompanyProfile.values`, `src/app/api/chat/route.ts`).
- Self-service password reset by email (today the WAJIBU admin resets passwords).
- Direct SharePoint connection (today: export to CSV and use Admin → Import).
