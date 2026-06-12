# RCWN Agent Context

## Product

RCWN is a community safety app. The UI is mobile-first after login and responsive on public pages.

Routes exist for features. Roles unlock capabilities.

Do not create duplicated role-prefixed feature routes such as `/guardian/safe-walk`, `/watcher/safe-walk`, or `/citizen/safe-walk`. Use shared routes such as `/safe-walk`, `/concerns`, `/feed`, and adapt UI by role.

Primary roles:

- `citizen`
- `watcher`
- `truth_keeper`
- `guardian`

Current frontend role handling is manual and static. The public `/` page stores the selected role in `localStorage` with the key `rcwn:selected-role`; later this should be replaced by backend-provided user role data.

Capability hierarchy:

- Citizens can use Safe Walk, file reports, read the feed, and manage their own profile.
- Watchers inherit citizen access and also get a Watcher Dashboard for nearby Safe Walk requests.
- Truth Keepers inherit citizen and watcher access and also get verification pages for missing reports, assault reports, and evidence review.
- Community Guardians inherit all previous access. Guardian-only dashboard options are intentionally empty until the workflow is decided.

## Current Route Intent

- `/` is the public first page for exploring user UIs by clicking named user buttons.
- `/home` is the logged-in mobile dashboard.
- `/nearby-walks` is the Watcher Dashboard.
- `/verification-center` is the Truth Keeper verification dashboard.
- `/oversight` is the placeholder Community Guardian dashboard.
- `(public)` pages are responsive for mobile and desktop.
- `(auth)` and logged-in app pages are designed for mobile app use.
- `(app)` holds shared feature routes.
- `(watcher)`, `(truthKeeper)`, and `(guardian)` hold capability workspaces, not duplicate feature routes.

## Structure Rules

- Keep `src/app/**/page.tsx` files thin. They should import view components.
- Put page-specific composition in `src/view`.
- Put reusable UI in `src/components`.
- Put domain services, stores, and actions in `src/features`.
- Put role navigation and capability mapping in `src/config/navigation.ts`.
- Put Supabase browser clients and bucket constants in `src/lib/supabase`.
- Keep storage usage modular: profile-photo upload helpers belong near profile features, report evidence upload helpers belong near reports or concerns features, and shared bucket names stay in `src/lib/supabase/client.ts`.
- Use camelCase for TypeScript files and exports. URL folders may use user-facing kebab-case where appropriate.

## Backend

- The backend is a sibling folder to `RCWN`, not inside the Next.js app.
- Use TypeScript, Express, MongoDB, and Mongoose.
- Keep backend code modular by feature under `src/modules`.
- Keep database connection setup in `src/config/database.ts` and environment parsing in `src/config/env.ts`.
- Store the MongoDB Atlas URI in backend `.env`; keep `.env.example` with `<db_password>` as a placeholder.

## Styling

- The app imports CSS, currently `src/app/globals.css`.
- Do not import SCSS directly into Next.js pages or layouts.
- If SCSS source files are introduced later, treat them as source files that the user will compile to CSS when needed.
- Use Tailwind utilities for app UI.

## Verification

- Do not run `pnpm build` unless the user explicitly asks for it.
- Prefer `pnpm lint` for routine checks.
- Do not start or restart servers unless the user asks or the task requires it.


