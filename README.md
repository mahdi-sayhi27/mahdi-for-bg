# Maths Pour BG

A Next.js marketing site + student/admin portal for a math tutoring business (BG1 / BG2 levels, Tunisia). Public landing page, a student dashboard, and an admin panel, all backed by Supabase (Postgres + Auth + Storage).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript
- **Tailwind CSS v4** for styling, **Framer Motion** for animations
- **Supabase**: Postgres database, Auth (email/password), Storage (images/PDFs)
- No server framework beyond Next's route handlers/proxy — all data access goes straight from client components to Supabase via `@supabase/ssr`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint      # eslint
```

Environment variables live in `.env.local` (not committed — see `.env.local` on your machine, or ask whoever set up the Supabase project for the values):
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for anything Supabase-backed to work. **If these are ever blanked out, nothing that touches Supabase will work** — the app falls back to a browser-local "demo mode" instead (see below), which is a common source of "why isn't my data saving" confusion.
- `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_ADMIN_PASSWORD` — the hardcoded admin login (see "Auth model" below). Falls back to an obvious placeholder (`admin@example.com` / `change-me`) if unset, so a fresh clone doesn't accidentally ship a real credential.

## Directory layout

```
src/
  app/                    # Next.js App Router routes
    (auth)/               # /login, /register, /forgot-password — route group, no shared layout chrome
    (dashboard)/
      admin/              # /admin/* — admin panel, protected by proxy.ts + role check
      student/            # /student/* — student portal, protected by proxy.ts
    bg1/, bg2/, emploi/, news/, testimonials/   # public marketing pages
    page.tsx              # homepage — composes the landing sections in order
  components/
    landing/              # homepage sections (Hero, Stats, Resultats, Contact, ...)
    shared/                # navbar, footer, site shell, theme provider
    animations/            # decorative motion components
    admin/                 # rich-text editor used by the announcements admin page
  lib/
    supabase/              # client.ts (browser), server.ts (RSC), middleware.ts (proxy logic), env.ts
    local-*.ts             # localStorage-backed fallback CRUD for each entity (see "Demo mode")
    announcements.ts, emploi.ts, testimonials.ts   # data-fetching helpers shared by multiple pages
    local-auth.ts           # cookie-based local admin session (see "Auth model")
    utils.ts                # cn() classname helper + mergeById() (see "Demo mode")
  hooks/                   # use-unread-announcements.ts
  constants/index.ts       # ADMIN_CREDENTIALS, nav links, placeholder/demo data, FAQ, etc.
  types/index.ts           # all shared TypeScript interfaces (mirrors the DB schema)
  proxy.ts                 # the Next.js "proxy" (formerly "middleware") — auth guard for /admin, /student
supabase/schema.sql         # full DB schema: tables, RLS policies, storage buckets — run once against a fresh project
```

## Data model (Supabase)

Defined in `supabase/schema.sql`. Run it once against a fresh Supabase project (SQL Editor) to create everything.

| Table | Purpose | Notes |
|---|---|---|
| `profiles` | One row per `auth.users` row, auto-created by a trigger on signup | `role` is `student` or `admin`; **new signups always default to `student`** — promote manually via SQL/dashboard |
| `testimonials` | The public **photo gallery** ("Galerie" in admin, `/testimonials` page, homepage gallery preview) | `photo_url` points at the `results` storage bucket |
| `results` | Quote-style **"Témoignages"** cards on the homepage (name + score + free-text description) | shown by `results-gallery.tsx` |
| `resultats` | **"Résultats"** stat cards on the homepage (name, note, rang, section, année) | shown by `resultats.tsx` (simplified: name+note) and `resultats-detail.tsx` (full breakdown incl. a derived "prénom") |
| `announcements` | News Center items (`/news`) | rich-text `content` (HTML) edited via `components/admin/rich-text-editor.tsx` |
| `emploi` | Timetable PDFs per class | |
| `resources` | Course PDFs/exercises, gated to logged-in students | |
| `registrations` | Student course registration requests | |

Every table has **Row Level Security enabled**. The general pattern:
- Public `select` where relevant (e.g. only `approved = true` testimonials, only `published` announcements).
- Writes (`insert`/`update`/`delete`) require `exists (select 1 from profiles where id = auth.uid() and role = 'admin')`.

Storage buckets (`avatars`, `results`, `resources`, `news`, `emploi`) follow the same idea: public read, admin-only write, checked the same way.

**Consequence:** any admin write (adding a photo, a témoignage, a résultat, an announcement, uploading a file) requires a **real, signed-in Supabase Auth user whose `profiles.role = 'admin'`**. Without that, every insert/upload fails with a row-level-security error — this is the single most common failure mode in this app.

## Auth model — read this before touching login/admin code

This is the part most likely to confuse someone new to the repo, because there are actually **two parallel auth systems layered on top of each other**:

1. **Real Supabase Auth.** `src/lib/supabase/client.ts` creates a browser client; `src/proxy.ts` (see below) checks the session server-side.
2. **A hardcoded local admin fallback.** `src/constants/index.ts` exports `ADMIN_CREDENTIALS` (one admin email/password, read from `NEXT_PUBLIC_ADMIN_EMAIL`/`NEXT_PUBLIC_ADMIN_PASSWORD` — never hardcode a real value here, this file is committed). `src/app/(auth)/login/page.tsx` checks the typed credentials against this constant *first*; only if they match does it *also* attempt a real Supabase sign-in. Whether or not that Supabase call succeeds, it sets a **cookie** (`mpb_local_admin=1`, via `src/lib/local-auth.ts`) and sends you to `/admin`.

Why a cookie and not just `localStorage`: `src/proxy.ts` runs on the server and can only see cookies, not `localStorage`. It explicitly checks for `mpb_local_admin=1` and lets that request into `/admin` even with no real Supabase session — that's what makes "log in with the hardcoded credentials, no real Supabase account yet" actually work end-to-end instead of just rendering a client-side shell that the server immediately redirects away from. It intentionally only ever grants `/admin`, never `/student`, and it's checked *before* the Supabase-role check, so it bypasses that too (there's no real profile row backing it).

The tradeoff: it's possible to be "logged into the admin panel" while having **no real Supabase session**, in which case every page loads and looks fine, but any write (adding a photo, a résultat, uploading an image, etc.) silently fails RLS, because Postgres only sees `auth.uid() = null`. The admin layout (`(dashboard)/admin/layout.tsx`) shows a yellow banner in this situation ("Le compte admin n'existe pas encore dans Supabase Auth...") so it's not a silent failure anymore — but the panel itself will look fully functional either way, because of the demo-mode fallback described next.

**To make the admin account fully real:**
1. Sign up the email/password from `ADMIN_CREDENTIALS` via Supabase Auth (the `/register` page, or directly in the Supabase dashboard).
2. Confirm the email (Supabase requires email confirmation by default — check the inbox, or confirm manually in the dashboard).
3. Promote it: `update public.profiles set role = 'admin' where email = '<that email>';`

### `src/proxy.ts` — the server-side route guard

Next.js recently renamed the "Middleware" convention to **"Proxy"**; this project uses the new name (`src/proxy.ts`, default export, matches all non-static routes). It:
- Refreshes/reads the Supabase session from cookies.
- Redirects unauthenticated users away from `/student/*` to `/login`.
- Redirects unauthenticated users away from `/admin/*` to `/login`, **unless** the `mpb_local_admin=1` cookie is present (the local-admin fallback, see above).
- Redirects authenticated users away from `/login`/`/forgot-password` to `/student`.
- For `/admin/*`, additionally checks `profiles.role === 'admin'`, redirecting non-admins to `/student`.

Two easy ways to accidentally break this (both have bitten this project before, so worth knowing):
- **File location matters.** Because the project uses a `src/` directory, the proxy file must live at `src/proxy.ts` (or the legacy `src/middleware.ts`) — a `middleware.ts`/`proxy.ts` at the repo root is silently ignored when a `src/` proxy/middleware convention is in play for this Next.js version.
- **It only protects the initial server-rendered shell.** Admin/student pages are all `"use client"` components that *also* run their own client-side auth check on mount (see `(dashboard)/admin/layout.tsx`). Actual data access is protected by Supabase RLS regardless of what the proxy does.

## "Demo mode" — the local-storage fallback

Every admin CRUD page and every public data-fetching component follows the same pattern:
1. If `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY` aren't set (`hasValidSupabaseEnv()` in `lib/supabase/env.ts`) → read/write `localStorage` via the matching `lib/local-*.ts` module.
2. If Supabase *is* configured but a query errors (e.g. RLS rejection) → fall back to `localStorage` too, and flip a `supabaseUnavailable` flag that renders a yellow "Mode local activé" banner.
3. Only if Supabase succeeds does data actually persist server-side.

This is convenient for offline development but means: **a working-looking admin panel is not proof that Supabase is actually configured correctly** — always check for the yellow banners.

Reads merge Supabase rows with local-only rows (`mergeById` in `lib/utils.ts`), so an item saved only to the local fallback still shows up everywhere (public pages included), not just in the admin list. Writes to a **local-only** row (one whose `id` isn't in Supabase) skip the Supabase call entirely — updating/deleting a nonexistent remote row via Postgrest just matches zero rows and reports success without telling you, so each admin page checks `readManualX().some(item => item.id === ...)` first and routes straight to the local store when true. Image uploads follow the same idea: if the Supabase Storage upload throws (RLS), the code catches it and falls back to embedding the image as a data URL locally instead of aborting the whole save.

## Homepage section order

`src/app/page.tsx` composes, top to bottom: `Hero` → `Stats` → `ResultsGallery` (quote cards, table `results`) → `Resultats` (stat cards, name+note only) → `ResultatsDetail` (nom/prénom/note/rang breakdown of the same `resultats` rows) → `PhotoGallery` (4 most recent approved photos from `testimonials`, links to `/testimonials` for the full gallery) → `Contact`.

## Known limitations / things to watch

- `ADMIN_CREDENTIALS` is a single hardcoded account, not a real multi-admin system.
- The "Users can update own profile" RLS policy has no `with check` restricting which columns can change — a signed-in user could set their own `role` to `admin` via a direct API call. Fine for a single-admin hobby project; would need tightening for anything with real multi-user risk.
- `resultats-detail.tsx` derives "prénom"/"nom" by splitting the single `name` column on the first space — there's no real `prenom` column in the DB.
- Email/password reset flows, SMTP, and Resend integration are scaffolded (`.env.local` has placeholders) but not verified end-to-end.
