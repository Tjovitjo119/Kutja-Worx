# Kutja Worx

Website and custom admin dashboard for **Kutja Worx**, an auto repair, performance and parts workshop at 213A Dykor Street, Silverton, Pretoria.

- **Site:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Content backend:** Sanity (headless CMS, hosted by Sanity, nothing to run yourself)
- **Admin:** custom dashboard at `/admin` (NextAuth login, roles: owner / admin / reception). The raw Sanity Studio is still available at `/studio` as a power-user fallback.
- **Email:** Resend (contact form, car-type quote requests, parts quote requests)
- **Hosting:** Vercel

Screenshots of every page (mobile 375px and desktop 1440px) are in [`docs/screenshots`](docs/screenshots). Regenerate them with `npm run screenshots`.

---

## 1. Demo mode (works right now, no accounts needed)

Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, the whole site and admin run in **demo mode** on built-in sample data (flyer contact details plus placeholder vehicles, parts and prices).

- The admin login is pre-filled in development (`owner@kutjaworx.local` / `kutja-demo`).
- Changes made in demo mode live in memory and reset when the server restarts. Photo upload is disabled.
- **The demo login is disabled automatically in production and as soon as Sanity is connected.**

---

## 2. Local setup

```bash
npm install
cp .env.example .env.local     # then fill in the values (section 3)
npm run dev                    # http://localhost:3000
```

| Script                                  | What it does                                                              |
| --------------------------------------- | ------------------------------------------------------------------------- |
| `npm run dev` / `build` / `start`       | Next.js dev server, production build, production server                   |
| `npm run lint` / `typecheck` / `format` | ESLint, TypeScript, Prettier                                              |
| `npm run seed`                          | Writes the default content into Sanity (safe to re-run)                   |
| `npm run create-owner`                  | Creates the first owner login (or resets its password)                    |
| `npm run screenshots`                   | Saves page screenshots to `docs/screenshots` (dev server must be running) |

## 3. Environment variables

Documented in [`.env.example`](.env.example). Never commit `.env.local`.

| Variable                         | Purpose                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`  | Sanity project ID. Empty = demo mode                                            |
| `NEXT_PUBLIC_SANITY_DATASET`     | Usually `production`                                                            |
| `NEXT_PUBLIC_SANITY_API_VERSION` | e.g. `2024-01-01`                                                               |
| `SANITY_API_WRITE_TOKEN`         | Server-only **Editor** token. Lets the dashboard save changes and upload photos |
| `SANITY_WEBHOOK_SECRET`          | Shared secret for the revalidation webhook (section 5)                          |
| `NEXTAUTH_URL`                   | The site URL (`http://localhost:3000` locally, your domain in production)       |
| `NEXTAUTH_SECRET`                | Random string for signing logins: `openssl rand -base64 32`                     |
| `NEXT_PUBLIC_SITE_URL`           | Public URL, used for SEO, sitemap and Open Graph                                |
| `RESEND_API_KEY`                 | Resend API key                                                                  |
| `CONTACT_FROM_EMAIL`             | Sender, e.g. `noreply@kutjaworx.co.za` (the domain must be verified in Resend)  |
| `CONTACT_TO_EMAIL`               | Where notifications go (default `kutjaworx@gmail.com`)                          |
| `GOOGLE_MAPS_EMBED_URL`          | Optional. You can also paste the embed URL in Site Settings                     |

## 4. Create the Sanity project

1. Sign in at <https://www.sanity.io/manage> and **Create project** (name "Kutja Worx", dataset `production`). The **client should own this account** so they are not tied to yours.
2. Copy the **Project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. **API → CORS origins:** add `http://localhost:3000` and the live site URL, with _Allow credentials_ ticked (needed for `/studio`).
4. **API → Tokens → Add token:** role **Editor**. Copy it into `SANITY_API_WRITE_TOKEN` (shown once).
5. Seed the default content and create the first login:

```bash
npm run seed
npm run create-owner      # prompts for name, email, password
```

6. Run `npm run dev`, open `/admin/login` and sign in.

## 5. Revalidation webhook (instant updates)

Pages are cached for 60 seconds, so edits appear within about a minute on their own. For instant updates:
**sanity.io/manage → API → Webhooks → Create:** URL `https://YOUR-SITE/api/revalidate?secret=YOUR_SECRET` (the same value as `SANITY_WEBHOOK_SECRET`), trigger on create/update/delete, HTTP method POST.

## 6. Deploy to Vercel

1. Push the repo to GitHub, then **Add New → Project** in Vercel and import it (Next.js is detected automatically).
2. Add every variable from section 3 in **Settings → Environment Variables** (Production). Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the live URL.
3. Deploy. Add the live URL to the Sanity CORS origins (section 4.3) and set up the webhook (section 5).
4. Add the custom domain in Vercel, then update `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` and redeploy.
5. Verify the sending domain in Resend so enquiry emails reach `CONTACT_TO_EMAIL`.

## 7. Roles

| Role          | Can do                                          |
| ------------- | ----------------------------------------------- |
| **owner**     | Everything, including managing users            |
| **admin**     | Everything except users                         |
| **reception** | Reception dashboard, inquiries, gallery uploads |

Passwords are stored as bcrypt hashes. Owners add staff under **Admin → Users**.

---

## 8. Client guide: using the admin dashboard

Log in at **`your-site/admin/login`** (or the **Login** button in the site header). Use **Settings → System status** to check that Sanity, the write token and email are connected.

**Add a car type** (a make/model you work on, not a car for sale): Car Types → **Add New**. Fill in the title, make, model, year/spec and a short description of the work you do on it. Optionally add detail rows (label + value) and photos; the first photo is the primary image. Tick _Featured on the home page_ to show it in "Cars We Work On". The workshop does **not** sell cars, so there are no prices or sold/reserved statuses.

**Update prices:** Price List → click the pencil on the row → change _Price from_ → Save. Service prices ("From R…") are edited under Services. Part prices under Parts.

**Add or edit a service:** Services → Add New. Pick the category, an icon (icon picker), short description and price. Untick _Published_ to hide it without deleting.

**Add parts:** Parts → Add New (category, brand, SKU, price, stock, photos). Customers "Add to Cart" to build a quote; they are **not charged online**. The list arrives as an inquiry and an email.

**Add gallery photos:** Gallery → Add New, upload a photo, choose a category (BMW / VW / Mercedes / Ford / Other) and a caption.

**Create a special:** Specials → Add New with a discount text, description, dates and image. It disappears from the site automatically after _Valid until_.

**Change the phone numbers, address, social links, about text:** Site Settings. Social icons only appear once you add a link. The "years in business / cars serviced" counters on the About page only appear once you enter real numbers.

**Change the home page headline or brands strip:** Hero Content.

**Reply to an inquiry:** Inquiries → click a row. Tap the phone number to call, or the email to reply. Set the status (New → In Progress → Contacted → Closed) and add internal notes. The sidebar badge shows the number of new inquiries.

**Add staff:** Users (owner only) → Add New, choose the role, set a password (min 8 characters).

**Testimonials:** Content → Testimonials. Add only genuine reviews (with the customer's permission). The section stays hidden until at least one exists.

Changes appear on the live site within about a minute.

---

## 9. Before launch checklist

Everything below is **placeholder** and must be confirmed or replaced by the client:

- [ ] **Car types, parts and all prices** (taken from the design mockups). Replace in the dashboard.
- [ ] **Photos.** Every picture slot currently shows an original illustration (`/api/art/...`) until a real photo is uploaded. Illustrations are not photos; real photography of the workshop, cars and the Dykor Street building matters more than any code change.
- [ ] **Marketing claims** in the trust bars ("Quality Workmanship Guaranteed", "Competitive Pricing, no hidden costs", etc.) come from the design mockups. Confirm the client is happy to stand behind them.
- [ ] Social links, opening hours (also feeds the Google "LocalBusiness" data), years in business / cars serviced.
- [ ] Brands strip (Volkswagen, BMW, Audi, Ford, Mercedes): check against the brands the workshop services.
- [ ] Resend domain verification, a real `NEXTAUTH_SECRET`, and the first owner account created with `npm run create-owner`.
- [ ] Brand logo: the header uses a text/gear mark until the client uploads their logo in Site Settings.

## 10. Design decisions

The brief said to choose what best matches the mockups and record it here.

- **Demo mode** (above) so the site and admin are fully reviewable before the Sanity project exists. The in-memory demo login is development-only.
- **Categories are stored as text**, not Sanity references. A service/part stores its category's _title_, chosen from a dropdown fed by the category documents (`serviceCategory`, `partCategory`). This keeps the dashboard forms and queries simple. Renaming a category means re-selecting it on its items. Vehicle categories on `/cars` are derived from each vehicle's _make_ (a `vehicleCategory` schema exists for future use).
- **`priceListItem` has its own `name`** rather than a reference to a service, because the mockup's price rows (e.g. "1.4 / 1.6 (Polo / Golf)") are not services.
- **Slugs are plain strings** (auto-generated from the title in the dashboard).
- **Parts cart is a quote builder**: no payments. Items are stored in the browser (`localStorage`) and submitted as an inquiry plus email.
- **Seed content excludes** testimonials, social links, opening hours and business statistics: these must come from the client, not be invented. Sections that depend on them stay hidden until filled in.
- **Emails use Resend's REST API** directly (`fetch`) instead of the SDK: one less dependency.
- **Fonts** (Oswald, Inter) are self-hosted via `@fontsource`, so there is no runtime request to Google Fonts and it works offline in development.
- **Open Graph / apple-touch images are static PNGs**, because `next/og` fails on Windows paths containing spaces. Replace `app/opengraph-image.png` with a proper branded banner when you have one.
- **Diagonal cuts** are a single `DiagonalPanel` component (CSS `clip-path`), straight-edged below 768px.
- **Raw Studio** stays at `/studio` for power users; day-to-day editing happens in `/admin`. Both edit the same dataset.
- **Light admin content area** with the dark sidebar, matching the mockups' dashboard screens.

## 11. Project structure

```
app/(site)/        public pages (home, services, cars, parts, price-list, gallery, about, contact)
app/admin/         login + dashboard (route group (panel) holds the authenticated screens)
app/api/           contact, vehicle-enquire, parts-quote, revalidate, auth, art, admin/*
components/site/   Header, Footer, sections, browsers (filtering UIs), cart
components/admin/  AdminShell, EntityList, EntityForm, ImageUploader, IconPicker, ...
lib/               data (public reads), store (Sanity + demo), auth, admin-config, seed-data, art
sanity/            schemas, GROQ queries, clients
scripts/           seed, create-owner, screenshots
middleware.ts      protects /admin and /api/admin by role
```

To add a new editable content type, add a schema in `sanity/schemas`, an entry in `lib/admin-config.ts` (fields and columns), and the public read in `lib/data.ts`. The dashboard list and form are generated from that config.
