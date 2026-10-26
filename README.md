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
- Members: full name, alias (e.g. Julian Gisbert aka Snichy#3), rank, photo, bio, character development
- Territory: name, status, photo, description, map position

Member and territory pages show their own photo and every street post tied to them.
Guides live in `data/content.js` and show up only for a logged-in admin.

## Deploy (Vercel or Netlify)

The host disk is read-only, so the admin saves by committing the JSON files and photos to this GitHub repo. The host then redeploys by itself (about a minute).

1. Create a fine-grained GitHub token for this repo only, with **Contents: Read and write**.
2. Import the repo on Vercel or Netlify and set these environment variables:

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | your admin password |
| `ADMIN_SECRET` | any long random string (optional) |
| `PF_GITHUB_TOKEN` | the token from step 1 |
| `PF_GITHUB_REPO` | `Ilzyyyy/primera-flats-13` |
| `PF_GITHUB_BRANCH` | `main` |

Without `PF_GITHUB_TOKEN` the live site is read-only and the admin shows a warning.
