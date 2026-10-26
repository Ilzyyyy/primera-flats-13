# Primera Flats 13

Next.js 14 (App Router) site: Story, Members, Territory, Word on the Street. Guides are private and open only after the admin login.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The admin page is at `/admin`. Locally the default password is `pf13admin` and changes are written straight to `data/*.json` and `public/uploads/`.

## What the admin can edit

- Word on the Street: posts, optionally tied to a member and a territory
- Members: full name, plate name shown under it (e.g. Julian Gisbert, then Snichy#3), rank, photo, bio, character development
- Territory: name, status, photo, description, map position

Member and territory pages show their own photo and every street post tied to them.
Guides live in `data/content.js` and show up only for a logged-in admin.

## Deploy (Vercel or Netlify)

The host disk is read-only, so the admin saves into Supabase instead of committing to GitHub. Saving never triggers a redeploy, so it does not use up the host's build limit. Redeploys only happen when you push code.

1. In Supabase, run `supabase/setup.sql` (creates the `pf_data` table and the public `pf-uploads` bucket, and seeds the current data).
2. Import the repo on Vercel or Netlify and set these environment variables:

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | your admin password |
| `ADMIN_SECRET` | any long random string (optional) |
| `SUPABASE_URL` | Project URL, e.g. `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | the `service_role` key (server only) |

Without the Supabase variables the live site is read-only (it shows the data bundled in `data/*.json`) and the admin shows a warning. Locally, without them, saves go straight to `data/*.json` and `public/uploads/`.
