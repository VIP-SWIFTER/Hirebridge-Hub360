# Hirebridge Hub360° – Business Website (MERN + TypeScript)

Animated, responsive website for **Hirebridge Hub360°** (Creative & Branding Solutions).
Everything is written in **TypeScript** (`.ts` / `.tsx`).

- **Frontend:** React 18 + Vite, **Material UI (MUI v6)** with a custom dark/yellow theme, Framer Motion animations, three.js 3D scene, Lenis smooth scroll
- **Backend:** Node.js + Express, MongoDB (Mongoose), Helmet, CORS, rate limiting, optional email alerts (Nodemailer)

## What the website has

| Section | What it does |
|---|---|
| Hero, Marquee, Services | Brand intro. Each service has an "Enquire about this" button that opens the enquiry form with the topic selected |
| **End-to-End service** | Animated timeline of the full journey (strategy → logo → cards → promotions → merchandise → hiring) |
| Brand Studio | Type a business name, pick a color: live preview on card, mug and door sticker. "Make this real" pre-fills the Marketing form |
| Process, Stats, FAQ | Trust-building sections |
| **4 form pages** | Talk to Manager, Marketing & Branding, Placement Registration, Free Registration (separate pages, Excel download in admin) |
| **Robot / sci-fi motion** | Intro loader with logo + sound (`client/public/sfx/intro.mp3`, replace the file to change it), 3D android head with eyes that follow the cursor, HUD frame, text-decode effect, H360-Bot assistant, sound and pause-motion buttons |
| **3D + motion** | Scroll-driven three.js scene (red/yellow/black), Lenis smooth scroll, intro loader, custom cursor, masked text reveals, magnetic buttons, 3D-tilt cards, velocity-skewed marquee |
| **Admin dashboard** | `your-site/#/admin`: view, search, filter, update status, add notes, WhatsApp / call / email each person, export CSV |

### The four forms (each on its own page, all saved to MongoDB)

| Page | Address |
|---|---|
| Talk to Manager | `/#/talk-to-manager` |
| Marketing & Branding | `/#/marketing-branding` |
| Placement Registration | `/#/placement-registration` |
| Free Registration | `/#/free-registration` |

The landing page has a "Get in touch" section with a card linking to each page. The old Job Placement form was removed (Placement Registration replaces it).

**Excel:** in the admin dashboard every form tab has a **Download Excel (.xlsx)** button (rebuilt from MongoDB each time). Placement registrations are also appended live to `server/data/placement-registrations.xlsx` (change with `PLACEMENT_XLSX_PATH`).

After every submission the visitor gets a **reference number** (e.g. `HB-ENQ-7K3QX2`) and buttons to continue on **WhatsApp** or **email** with the details pre-written.

## Run locally

Requires Node 18+ and MongoDB (local or Atlas).

```bash
npm run install:all
cp server/.env.example server/.env     # then edit it (MONGO_URI, ADMIN_KEY ...)
npm run dev
```

- Website: http://localhost:5173
- Admin: http://localhost:5173/#/admin  (log in with `ADMIN_KEY` from `server/.env`)
- API health: http://localhost:5000/api/health

### Useful scripts (run from the project root)

| Command | What it does |
|---|---|
| `npm run dev` | Starts API + website together |
| `npm run typecheck` | TypeScript check for server and client |
| `npm test` | 16 automated tests (API, validation, security, client/server sync) |
| `npm run build` | Production build of server (`server/dist`) and client (`client/dist`) |

## Project structure

```
server/src/
  index.ts            connects MongoDB and starts the server
  app.ts              Express app (security headers, CORS, routes, error handler)
  forms.ts            the 4 forms: fields, rules and MongoDB models (defined once)
  routes/forms.ts     POST /api/forms/:type   (public)
  routes/admin.ts     /api/admin/...          (needs x-admin-key)
  utils/options.ts    every dropdown / choice list
  utils/validate.ts   server-side validation
  utils/mailer.ts     optional email alerts
server/test/          api.test.ts, sync.test.ts

client/src/
  formConfig.ts       form fields, options and validation for the UI
  api.ts              typed API calls
  contact.ts          phone / email / WhatsApp helpers
  data.ts             text, services, end-to-end steps, FAQ
  theme.ts, brand.ts, animations.ts
  components/         Navbar, Hero, Services, EndToEnd, BrandStudio, FormsHub,
                      DynamicForm, Process, Stats, Faq, Footer, ...
  admin/AdminPage.tsx admin dashboard
```

## Changing the forms

The dropdown lists live in **two** places that must match:
`server/src/utils/options.ts` and `client/src/formConfig.ts`.
`npm test` fails with a clear message if they ever differ.

## Email alerts (optional)

Fill the `SMTP_*` values in `server/.env` (for Gmail use an *App Password*). Then every submission
sends an alert to `NOTIFY_EMAIL` and a confirmation email (with the reference number) to the client.
If left blank, nothing changes: data is still saved.

## Security built in

- Server validates every field and only accepts the expected types (no Mongo operator injection)
- Hidden honeypot field + rate limit (12 submissions / 15 min per IP) against spam bots
- Admin API needs `x-admin-key` (constant-time check, failed attempts are rate-limited)
- CSV export neutralises spreadsheet formulas (`=`, `+`, `-`, `@`)
- Helmet security headers, 20 KB body limit, CORS locked to `CLIENT_ORIGIN`

## Deploy

- **Backend** (Render / Railway): build `npm run build --prefix server`, start `npm start --prefix server`.
  Set `MONGO_URI`, `CLIENT_ORIGIN` (your website URL), `ADMIN_KEY`, `TRUST_PROXY=1`, and optional `SMTP_*`.
- **Frontend** (Netlify / Vercel): `npm run build --prefix client`, publish `client/dist`.
  Set `VITE_API_URL` to your backend URL before building.
- Use a long random `ADMIN_KEY` in production. Anyone with it can read the saved data.
