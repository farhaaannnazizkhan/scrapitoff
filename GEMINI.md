\# GEMINI.md — ScrapItOff Project Rules



\## PROJECT IDENTITY

\- \*\*Name:\*\* ScrapItOff

\- \*\*Purpose:\*\* A three-sided waste recycling marketplace connecting Citizens, Informal Scrap Collectors, and Authorized Recyclers.

\- \*\*Context:\*\* Smart India Hackathon 2026, PS ID 26229, Ministry of Mines / JNARDDC.

\- \*\*Priority:\*\* Functionality over polish. Demo-ready over production-ready.



\---



\## TECH STACK (NON-NEGOTIABLE)

\- \*\*Frontend:\*\* Next.js 14+ (App Router) + React 18+

\- \*\*Styling:\*\* Tailwind CSS ONLY. No custom CSS files. No styled-components. No inline styles except for dynamic values.

\- \*\*Backend:\*\* Next.js API routes (or Node.js + Express if separate server is needed)

\- \*\*Database:\*\* PostgreSQL via Supabase (free tier). SQLite is NEVER used in this project.
\- \*\*Prisma Provider:\*\* postgresql (NEVER change this to sqlite)
\- \*\*Enums:\*\* Always use Prisma enums for status/role fields. PostgreSQL fully supports enums. Never replace enums with String field s.

\- \*\*ORM:\*\* Prisma (preferred) or Drizzle

\- \*\*Maps:\*\* Leaflet.js + OpenStreetMap (no Google Maps — paid)

\- \*\*Blockchain:\*\* Simulated with SHA-256 hashes. No real chain deployment.

\- \*\*Auth:\*\* Mock OTP (no real SMS). Store sessions in localStorage or cookies.

\- \*\*Language:\*\* TypeScript preferred. JavaScript acceptable if TypeScript slows you down.

\- \*\*Package Manager:\*\* npm (not yarn, not pnpm)



\---



\## FOLDER STRUCTURE (STRICT)



/scrapitoff

├── /app # Next.js App Router pages

│ ├── /citizen # Citizen-facing routes

│ ├── /collector # Collector-facing routes

│ ├── /recycler # Recycler-facing routes

│ ├── /admin # Admin dashboard routes

│ ├── /api # API routes

│ └── layout.tsx # Root layout

├── /components # Reusable React components

│ ├── /ui # Base UI (buttons, cards, modals)

│ ├── /citizen # Citizen-specific components

│ ├── /collector # Collector-specific components

│ ├── /recycler # Recycler-specific components

│ └── /shared # Shared across roles

├── /lib # Utility functions

│ ├── /db # Database client and queries

│ ├── /blockchain # Hash functions and mock chain logic

│ ├── /ai # Rule-based pricing and anomaly logic

│ ├── /auth # Mock OTP and session helpers

│ └── /utils # General helpers (formatting, dates)

├── /prisma # Prisma schema and migrations

│ └── schema.prisma

├── /public # Static assets (icons, images)

│ ├── /icons # Material category icons

│ └── /audio # Audio files for low-literacy support

├── /types # TypeScript type definitions

├── /data # Seed data (JSON files)

├── GEMINI.md # This file

├── README.md # Project overview

└── package.json





\*\*Rules:\*\*

\- All React components go in `/components/`. Never create components inside `/app/`.

\- All API routes go in `/app/api/`. Never create a separate `/server/` folder.

\- All database queries go in `/lib/db/`. Never write raw SQL in components.

\- All blockchain logic goes in `/lib/blockchain/`. Never inline hash functions.

\- All AI/rule-based logic goes in `/lib/ai/`. Never inline pricing logic.



\---



\## CODING STANDARDS



\### React Components

\- Use \*\*functional components only\*\*. No class components.

\- Use \*\*named exports\*\* for components. No default exports except for Next.js pages.

\- Keep components under \*\*150 lines\*\*. Split if longer.

\- Use \*\*TypeScript interfaces\*\* for all props. No `any` types.

\- Use \*\*server components\*\* by default. Add `"use client"` only when needed (state, effects, browser APIs).



\### Naming Conventions

\- \*\*Files:\*\* kebab-case (e.g., `rate-card.tsx`, `pickup-form.tsx`)

\- \*\*Components:\*\* PascalCase (e.g., `RateCard`, `PickupForm`)

\- \*\*Functions:\*\* camelCase (e.g., `calculateFairPrice`, `hashLot`)

\- \*\*Constants:\*\* UPPER\_SNAKE\_CASE (e.g., `BASE\_RATES`, `ANOMALY\_THRESHOLD`)

\- \*\*Database tables:\*\* snake\_case (e.g., `pickup\_requests`, `blockchain\_records`)



\### Styling Rules

\- Use \*\*Tailwind utility classes only\*\*.

\- Use \*\*mobile-first\*\* breakpoints (`sm:`, `md:`, `lg:`).

\- Color palette:

&#x20; - Primary: `green-600` (sustainability)

&#x20; - Background: `white` / `gray-50`

&#x20; - Text: `gray-900` / `gray-600`

&#x20; - Alert: `orange-500` / `red-600`

&#x20; - Success: `green-500`

&#x20; - Blockchain badge: `purple-600`

\- Use \*\*rounded-lg\*\* for cards, \*\*rounded-md\*\* for buttons.

\- Use \*\*shadow-sm\*\* for cards, \*\*shadow-md\*\* for modals.

\- No dark mode for MVP. Keep it light and clean.



\### Accessibility

\- All images must have `alt` text.

\- All buttons must have `aria-label` if icon-only.

\- All forms must have `<label>` elements.

\- Use \*\*large touch targets\*\* (min 44px height) for mobile.

\- Use \*\*pictorial icons\*\* alongside text for low-literacy users.



\---



\## DATABASE RULES



\### Prisma Schema Rules

\- Every table must have `id` (autoincrement or UUID), `created\_at`, `updated\_at`.

\- Use `@@map` to map model names to snake\_case table names.

\- Use enums for status fields (e.g., `PickupStatus`, `LotStatus`, `PaymentStatus`).

\- Never delete records. Use soft deletes with `deleted\_at` if needed.



\### Core Models (Already Defined)

\- `User` — id, role, name, phone, area, language, rating, total\_deals

\- `Material` — id, category, sub\_category, description, image\_url, unit, base\_rate\_per\_kg

\- `PriceRecord` — id, material\_id, location, date, buying\_price, selling\_price, unit, recycler\_id

\- `PickupRequest` — id, citizen\_id, material\_category, rough\_size, address, time\_slot, status, assigned\_collector\_id

\- `Lot` — id, pickup\_request\_id, collector\_id, material\_category, weight\_kg, quoted\_price, final\_price, recycler\_id, status, created\_at

\- `BlockchainRecord` — id, lot\_id, hash, timestamp, transaction\_type

\- `Rating` — id, lot\_id, reviewer\_id, reviewee\_id, reviewer\_role, stars, review\_text, created\_at

\- `EarningsLedger` — id, collector\_id, lot\_id, amount, payment\_status, payment\_mode, date



\### Seed Data Rules

\- Always seed with \*\*10 material categories\*\* and their base rates.

\- Always seed with \*\*3 collectors, 3 recyclers, 2 citizens\*\*.

\- Always seed with \*\*5 completed lots\*\* and their blockchain records.

\- Seed data lives in `/data/seed.json`. Never hardcode seed data in components.



\---



\## BLOCKCHAIN SIMULATION RULES

\- Use \*\*SHA-256\*\* via Node.js `crypto` module.

\- Hash function takes: `lot\_id + collector\_id + weight\_kg + timestamp`.

\- Store hash in `blockchain\_records` table.

\- Display "Blockchain Verified" badge on receipts.

\- Verification page: user enters Lot ID → system shows hash, timestamp, and "Verified" status.

\- \*\*Never\*\* attempt real blockchain deployment. Label everything as "Simulated for Demo."



\---



\## AI/RULE-BASED LOGIC RULES

\- \*\*Fair Price:\*\* `base\_rate\_per\_kg × weight × material\_factor`

&#x20; - `material\_factor` = 1.0 for standard, 0.9 for mixed, 1.1 for clean/sorted.

\- \*\*Anomaly Flag:\*\* If `offered\_price < 0.7 × fair\_price`, show alert.

\- \*\*Recycler Ranking Score:\*\*

&#x20; - `(distance\_score × 0.3) + (rate\_score × 0.3) + (rating\_score × 0.2) + (authorization\_score × 0.2)`

&#x20; - Each score normalized to 0–1.

\- \*\*Never\*\* use real ML models for MVP. Rule-based only.

\- All logic lives in `/lib/ai/`. Never inline in components.



\---



\## AUTH RULES

\- \*\*Mock OTP:\*\* Generate a 6-digit code, display it on screen (for demo), accept any input.

\- \*\*Session:\*\* Store in `localStorage` as `scrapitoff\_session`.

\- \*\*Role-based routing:\*\*

&#x20; - `/citizen/\*` — only citizens

&#x20; - `/collector/\*` — only collectors

&#x20; - `/recycler/\*` — only recyclers

&#x20; - `/admin/\*` — only admin

\- \*\*Never\*\* implement real SMS or email auth for MVP.



\---



\## OFFLINE-FIRST RULES

\- Collector app must work offline for: viewing requests, entering weight, creating lot.

\- Use `localStorage` as the offline queue.

\- Show "Offline Mode" indicator when `navigator.onLine === false`.

\- On reconnect, sync queued actions to the database.

\- \*\*Never\*\* block core actions when offline.



\---



\## LANGUAGE \& LOCALIZATION RULES

\- Support \*\*Hindi and Marathi\*\* at minimum.

\- Use a simple `translations.ts` file in `/lib/` with key-value pairs.

\- Language toggle in the header.

\- Use \*\*browser speech synthesis\*\* for audio labels (demo only).

\- All material categories must have \*\*pictorial icons\*\* in `/public/icons/`.



\---



\## TESTING RULES

\- Run `npm run build` before every commit. Fix all build errors.

\- Run `npm run lint` before every commit. Fix all lint errors.

\- Test the full flow manually: Citizen books → Collector accepts → Lot created → Recycler confirms → Rating appears.

\- Never commit broken code. Use `/rewind` in Antigravity if needed.



\---



\## WHAT TO NEVER DO
\- Never change the Prisma provider from postgresql to sqlite.
\- Never replace Prisma enums with String fields.
\- Never modify the datasource block without explicit instruction.
\- Never use class components.
\- Never use custom CSS files.

\- Never use any type in TypeScript.

\- Never inline database queries in components.

\- Never inline blockchain logic in components.

\- Never implement real SMS, email, or payment gateways.

\- Never deploy to mainnet blockchain.

\- Never use Google Maps (paid). Use Leaflet + OpenStreetMap.

\- Never create a public profile for citizens.

\- Never allow ratings without a verified deal.

\- Never truncate code silently — if output is cut, stop and report.



\---



\## WHAT TO ALWAYS DO

\- Always use TypeScript.

\- Always use Tailwind classes.

\- Always keep components under 150 lines.

\- Always seed the database with demo data.

\- Always show "Blockchain Verified" badge on receipts.

\- Always allow offline mode for collectors.

\- Always support Hindi and Marathi labels.

\- Always use pictorial icons for low-literacy users.

\- Always test the full flow before declaring a feature complete.

\- Always label simulated features as "Demo" or "Simulated."



\---



\## DEMO FLOW (FOR JUDGES)

1\. Open `/citizen` → view rate card → book pickup.

2\. Switch to `/collector` → view request → accept → enter weight → see fair price → create lot → register on blockchain.

3\. Switch to `/recycler` → view incoming lot → confirm handover → payment released.

4\. Switch back to `/citizen` → view digital receipt with blockchain badge → rate collector.

5\. Open `/admin` → view blockchain log → view anomaly dashboard → view map.

6\. Open `/verify` → enter Lot ID → see blockchain verification.



\---



\## EMERGENCY PROTOCOLS

\- If Antigravity truncates code mid-sentence: \*\*stop\*\*, roll back with `/rewind`, and re-prompt with a smaller atomic task.

\- If the build breaks: run `npm run build`, read the error, fix one issue at a time.

\- If the database schema is wrong: delete `prisma/dev.db`, update `schema.prisma`, run `npx prisma migrate dev`.

\- If you are stuck for more than 15 minutes: simplify the feature or skip it for the demo.



\---



\## CONTACT \& CONTEXT

\- \*\*Project:\*\* ScrapItOff

\- \*\*Hackathon:\*\* Smart India Hackathon 2026

\- \*\*PS ID:\*\* 26229

\- \*\*Organization:\*\* Ministry of Mines / JNARDDC

\- \*\*Theme:\*\* Clean \& Green Technology

\- \*\*Team:\*\* \[Your team name here]



\---



\*This file is the single source of truth for all code generation in this project. Follow it strictly.\*

