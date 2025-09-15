# Merge Notes — roboflex-dev-phase1 ➜ roboflex-live

This document tracks **differences between the Phase 1 codebase** (`roboflex-dev-phase1`)
and the **live interim site** (`roboflex-live`) that must be reviewed when merging.

---

## Status Legend
- **Shared** → identical in both repos, safe to overwrite.
- **Divergent** → intentionally different, requires manual review.
- **New in Phase 1** → file/folder doesn’t exist in interim, safe to add.

---

## File / Folder Tracking

| File / Folder | Status | Notes & Merge Strategy |
|---------------|--------|------------------------|
| `package.json` | Divergent | Change `"name"` to `"roboflex-dev-phase1"` for clarity in Phase 1. Before merging into live: decide whether `"name"` should be `"roboflex-live"` or just `"roboflex"`. |
| `package-lock.json` | Divergent | Will regenerate after updating `package.json`. Safe to overwrite if dependencies match, but check versions during merge. |
| `.env.local` | Divergent | **Do not** overwrite live env vars on merge. Manually copy over only the correct live production values. |
| `pages/_app.js` | Possibly Divergent | If Phase 1 adds layouts, providers, or styles, merge carefully keeping necessary live functionality. |
| `components/SEO.js` | Divergent | Logic is similar, but `config/seo.js`’s page keys/descriptions differ. Merge the helper logic, then unify only the needed SEO entries. |
| `config/seo.js` | Divergent | Likely differences in SEO copy. Manually pick the best from interim and Phase 1 before merging. |
| `styles/globals.css` | Possibly Divergent | If Phase 1 adds new styling, merge manually so as not to break live site styles. |
| `public/og-image*.jpg` | Divergent/New | Phase 1 has new OG images; add without removing interim ones still in use. |
| `pages/index.js` | Divergent | Completely redesigned in Phase 1 — overwrite live **only at launch**. |
| `pages/apply.js` | Divergent | New form in Phase 1; merge it only with updated backend endpoints ready. |
| `pages/technology.js` / `pages/heritage.js` / `pages/owner.js` | New in Phase 1 | Safe to merge — these are new pages that don't exist in interim. |
| `pages/admin.js` | Possibly Divergent | Merge carefully if Phase 1 adds search/filter features; preserve any admin fixes from live. |
| `components/layout/*` | Divergent/New | Navbar/Footer layouts differ. Visually review before merge. |
| `pages/api/*` | Possibly Divergent | Merge new endpoints; ensure existing API logic isn't broken. |
| `components/landing`, `components/forms`, `components/tech`, `components/heritage`, `components/owner`, `components/admin`, `components/ui` | New in Phase 1 | Safe to merge — all new components. |
| `utils/*` | Possibly Divergent | Merge carefully if Phase 1 Supabase clients/helpers differ from interim fixes. |

---

## Merge Strategy

1. **Commit freeze** on `roboflex-live/main` before merge window.
2. In local `roboflex-live` clone:
    ```bash
    git checkout main
    git pull origin main
    git merge roboflex-dev-phase1/roboflex-dev-phase1
    ```
3. Resolve divergences from the table above **manually**.
4. Smoke‑test locally with **live `.env.local`** production settings.
5. Push merged `main` → triggers Vercel live redeploy.

---

## Notes
- Always confirm `.env.local` variables match environment in Vercel **before** final build.
- Treat `index.js` overwrite as a **launch-day action**.
- Keep this file updated when Phase 1 diverges from live.