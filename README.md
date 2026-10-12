# Kutja Worx Website

Next.js 14 (App Router) + TypeScript + Tailwind CSS, with content managed in Sanity Studio (embedded at `/studio`). Deploys to Vercel.

The site renders sensible default content (from the flyer) until Sanity is connected, so you can preview it immediately.

## 1. Local setup

```bash
npm install
cp .env.example .env.local     # then fill in the values (see below)
npm run dev                    # http://localhost:3000  (Studio at /studio)
```

## 2. Create the Sanity project (one time)

1. Go to <https://www.sanity.io/manage> and sign in (or create an account).
2. **Create project** → name it "Kutja Worx", dataset `production`. Copy the **Project ID**.
3. Put it in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
4. In the project's **API → CORS origins**, add `http://localhost:3000` and your live site URL (e.g. `https://kutjaworx.co.za`) with **Allow credentials** ticked. This is required for `/studio` to log in.
5. Open `/studio`, log in, and fill in: Site Settings, Hero, Services (the 7 specialities as *General Service*, the 4 brands as *Engine Management*), and Gallery Photos.

## 3. Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
| `NEXT_PUBLIC_SITE_URL` | Live URL, used for SEO / Open Graph |
| `RESEND_API_KEY` | API key from <https://resend.com> (contact form emails) |
| `CONTACT_TO_EMAIL` | Where quote requests are sent |
| `CONTACT_FROM_EMAIL` | Sender, e.g. `Kutja Worx <quotes@yourdomain.com>` (domain must be verified in Resend; the default `onboarding@resend.dev` only delivers to your own Resend account email) |

## 4. Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project**, import the repo (framework: Next.js is auto-detected).
3. Add all the environment variables above, then **Deploy**.
4. Add the Vercel URL / custom domain to Sanity's CORS origins (step 2.4).

Content changes in Studio appear on the site within about a minute, with no redeploy.

## 5. Giving the client access (content-only)

1. Sanity Manage → your project → **Members → Invite members**.
2. Enter the client's email and choose the **Editor** role. Editors can create/edit/publish content and upload photos but cannot change project settings, API tokens or members. (Use *Administrator* only for yourself.)
3. The schema/design lives in code (this repo), so editors cannot alter it from the Studio.
4. The client signs in at `https://<your-site>/studio` with Google, GitHub or email/password. Only invited members can access content.

## 6. Client guide: editing content

Open `/studio` and log in.

- **Site Settings**: phone numbers (the first is used for Call Now), address, email, opening hours, social links, logo.
- **Hero (top banner)**: headline, sub-headline, background photo.
- **Services**: add/edit/delete. Category *General Service* appears in "What we do"; *Engine Management* appears in the white Engine Management block. *Display order* controls the sequence (lowest first).
- **Gallery Photos**: add a photo + caption. Use *Display order* to arrange.
- **Specials / Promos**: shown in a red banner; automatically hidden after the expiry date.

After editing, click **Publish**. Changes go live within about a minute.

## Pages and placeholder artwork

The site has separate pages: Home (/), Services (/services), Gallery (/gallery), About (/about), Contact (/contact).

Until real photos are uploaded, the site shows original **illustrations** in public/art (not photographs). Replace them from the Studio: Hero > background image, Services > card photo, Gallery Photos > photo + category (Engine Builds / Suspension / Diagnostics / Workshop). The Gallery page switches to your real photos as soon as one exists.

## Project structure

```
app/            pages, /studio route, /api/contact
components/     Header, Hero, ServicesGrid, EngineManagementList, Gallery, ContactSection, Footer
lib/content.ts  GROQ query + default fallback content
sanity/         schemas (siteSettings, heroContent, service, galleryImage, specialOrPromo)
sanity.config.ts  Studio configuration
```
