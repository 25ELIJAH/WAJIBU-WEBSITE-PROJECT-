# WAJIBU Charity Portal

A private directory that connects companies with vetted charities. WAJIBU controls every account, every
profile and every introduction. The portal uses the same palette, fonts and buttons as the main site.

## Decisions it implements

| Area | Decision |
| --- | --- |
| Registration | Organisations **request access** (`/request-access`). WAJIBU reviews, approves and chooses the single administrator who receives the login. |
| Visibility | Charity profiles are visible **only to signed-in companies** (and WAJIBU). A charity can open **only its own page**. Companies cannot see each other – the company side is fully private. |
| Accounts | **One administrator per organisation**, set by WAJIBU. WAJIBU's own administrator is `Admin1@wajibu.uk` (Samuel Orie). |
| Deletion | Charities and companies cannot delete anything. They ask WAJIBU, who deletes the organisation (Admin → Organisations → Manage → Delete). |
| Uploads | **No upload capability for charities or companies.** Only WAJIBU administrators add photos (JPG/PNG/WebP, 5 MB). No videos. |
| Sectors | Environment, Social Welfare, Education, Orphanage (edit the list in `src/lib/portal/constants.ts`). |
| Profile | Directory cards show **name and country only**. The profile page shows the registered charity number in the summary. |
| Search | Companies filter by **sector**. The company profile already stores a `values` field to feed the future AI matching feature. |
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

1. **Database** – Vercel/Netlify are serverless, so use a managed Postgres (Neon, Supabase, Railway…).
   In `prisma/schema.prisma` change `provider = "sqlite"` to `"postgresql"`, delete `prisma/migrations`, run
   `npx prisma migrate dev --name init` once against the new database, commit, then deploy with
   `npx prisma migrate deploy`. Set `DATABASE_URL` in the host's environment variables.
2. **Environment variables** – `SESSION_SECRET`, `DATABASE_URL`, `ADMIN_PASSWORD` (seed only), optionally
   `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFY_EMAIL`.
3. **Photos** – local disk does not persist on serverless hosts. Replace the three functions in
   `src/lib/portal/storage.ts` (`saveImage`, `readImage`, `deleteImage`) with S3 / Cloudflare R2 / Vercel Blob.
   Images are always streamed through `/api/portal/photo/<file>`, which checks the viewer's permission.
4. **Seed the admin** – run `npm run db:seed` once against production, then change the password at first sign-in.
5. **Email** – create a Resend account, verify `wajibu.uk`, set `RESEND_API_KEY`. Until then notifications work in-app only.
6. **Soft launch** – approve a handful of charities, fill their profiles, tick **Published**. Unpublished charities are
   invisible to companies. The planned SharePoint import can create the organisations and profiles the same way.

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
- SharePoint import of charity data.
