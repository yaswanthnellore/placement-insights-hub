# SVCE Placement Intelligence Hub

**SRI VENKATESWARA COLLEGE OF ENGINEERING — Companies Research & Placement Analytics Portal**

A mobile-first portal that gives students deep, structured research on recruiting
companies: 22 intelligence sections per company plus skill-requirement roadmaps
mapped to Bloom's taxonomy.

## Phase 1 — UI only (current)

- **No backend.** All data comes from a single hardcoded seed file:
  `src/data/seedCompanies.ts` (one fully-populated company, Accenture).
- **Fully public.** There is no login, no auth context, no protected routes.
  Every route is reachable by any visitor directly.
- The selected company persists in `localStorage` under `selected-company`, so
  `/company/intelligence` and `/company/skills` survive a browser refresh.

### Routes

| Route                   | Page                                             |
| ----------------------- | ------------------------------------------------ |
| `/`                     | Company grid with search + category filters      |
| `/company`              | Redirects to `/company/intelligence`             |
| `/company/intelligence` | 22-section company intelligence profile          |
| `/company/skills`       | Skill cards with Bloom levels + 10-level roadmaps |

### Data layer (built for Phase 2)

`src/lib/companyData.ts` exposes pure normalizers that accept the raw JSON
shapes of the future database columns:

- `normalizeCompanySummary(short_json)`
- `normalizeCompanyProfile(full_json, short_json)`
- `normalizeDashboardSkills(skill_levels[])`

Phase 2 swaps the seed import for database rows — the normalizers and every
page stay untouched.

## Phase 2 — planned

- Replace the seed file with live data (database tables shaped exactly like
  `short_json` / `full_json` / `skill_levels`).
- Optional: company logo enrichment via Logo.dev (`VITE_LOGO_DEV_PUBLISHABLE_KEY`).

## Conventions

- No CTC, stipend, or selection-ratio fields anywhere in the product.
- No college logo asset; the brand is text-only (SVCE wordmark).
- Category colors: Super Dream `#7c3aed`, Dream `#2563eb`, Standard `#16a34a`,
  Regular `#d97706`. Bloom colors: CU `#3b82f6`, AP `#22c55e`, AS `#eab308`,
  EV `#ef4444`, CR `#a855f7`.

## Develop

```sh
bun install
bun run dev      # start dev server
bun run test     # vitest smoke tests
```
