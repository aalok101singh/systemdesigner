# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Prisma data layer setup mostly complete

## Current Goal

- Select the next feature spec to implement now that Prisma branching is finalized.

## Completed

- Implemented feature unit 01: design system and UI primitive setup.
- Installed and configured shadcn/ui with Button, Card, Dialog, Input, Tabs, Textarea, and ScrollArea primitives.
- Installed Lucide React and added `lib/utils.ts` with the reusable `cn()` helper.
- Configured dark-only Ghost theme tokens in `app/globals.css`.
- Implemented feature unit 02: editor chrome foundation.
- Added the reusable editor navbar with left, center, and right sections plus sidebar state icons.
- Added the floating project sidebar shell with tabs, empty states, close control, and a full-width New Project action.
- Wired the editor workspace into the root page with local sidebar open/close state.
- Confirmed the existing shadcn dialog primitives already provide title, description, and footer action slots; no dialog instances were added.
- Implemented feature unit 03: Clerk authentication wiring.
- Installed `@clerk/ui` and wrapped the root layout in `ClerkProvider` with Clerk's dark theme and app CSS variable overrides.
- Added public sign-in and sign-up pages with a minimal two-panel desktop auth layout and form-only mobile presentation.
- Added root `proxy.ts` route protection that leaves only the configured Clerk sign-in/sign-up paths public.
- Updated `/` to redirect authenticated users to `/editor` and unauthenticated users to the sign-in route.
- Moved the editor workspace to `/editor` and added Clerk's default `UserButton` to the editor navbar.
- Suppressed root layout hydration warnings caused by browser extensions mutating `<html>` or `<body>` before React hydration.
- Refined the auth screen visual direction with a stronger split layout, Ghost AI capability rows, and a tighter themed Clerk form surface inspired by the provided reference without copying it.
- Fixed protected-route redirects so unauthenticated users stay on the local `/sign-in` and `/sign-up` routes instead of Clerk's hosted development domain.
- Implemented feature unit 04: project dialogs and editor home.
- Added the centered `/editor` home prompt with a `New Project` action.
- Added mock owned/shared project data, owner-only sidebar rename/delete actions, and mobile sidebar outside-click scrim behavior.
- Added create, rename, and delete project dialogs backed by a dedicated client hook for dialog, form, loading, and mock project state.
- Wired live slug preview for project creation and local mock create/rename/delete updates without API calls or persistence.
- Fixed current editor home/dialog issues by starting `/editor` on the home canvas, adding an `Open Existing Project` sidebar action, and making dialog text contrast explicit with Ghost theme tokens.
- Resolved the current issue batch across Clerk skill evals/docs, helper script line endings, Next.js route-handler examples, shadcn dependency placement, and textarea/input primitive classes.
- Implemented feature unit 05: Prisma data layer.
- Created Prisma schema with `Project` and `ProjectCollaborator` models with appropriate relations, enums, and indexes.
- Created `lib/prisma.ts` as a cached singleton with support for direct PostgreSQL connection using the `@prisma/adapter-pg` driver adapter and `prisma+postgres://` Accelerate URL branching.
- Ran migration to create database tables and generated Prisma client to `app/generated/prisma`.
- Verified build passes with `npm run build`.
- Fixed the project sidebar UI issue by correcting the invalid Tailwind positioning utility and restoring the My Projects / Shared tabs layout.
 - Fixed a TypeScript build error in `lib/prisma.ts` by casting runtime-only Prisma client options (`datasources` / `adapter`) to `any`, preserving runtime behavior for Accelerate and adapter usage.

## In Progress

- None.

## Next Up

- Select the next feature spec to implement.

## Open Questions

- None.

## Architecture Decisions

- shadcn/ui is configured through `components.json` with generated primitives under `components/ui/`.
- Ghost theme tokens are mapped in `app/globals.css` and applied as the default dark-only theme.
- Editor chrome state is isolated in a small client workspace while the route page remains a Server Component.
- Clerk route paths are resolved through the standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` environment variables with local `/sign-in` and `/sign-up` fallbacks.
- Next.js 16 route protection uses root-level `proxy.ts`; no `middleware.ts` is used.
- Clerk proxy protection explicitly uses local unauthenticated redirects to keep auth navigation on the app domain.

## Session Notes

- Verified with lint, TypeScript, `cn()` merge behavior, and production build.
- Feature unit 02 verified with `npm run lint` and `npm run build`.
- Feature unit 03 verified with `npm run lint` and `npm run build`.
- Root hydration warning mitigation verified with `npm run lint` and `npm run build`.
- Local auth redirect verified by probing `/editor`; unauthenticated requests now return `307` with `Location: /sign-in`.
- Feature unit 04 verified with `npm run lint` and `npm run build`.
- Current editor home/dialog issue fixes verified with `npm run lint` and `npm run build`.
- Current issue batch verified with `npm run lint`, `npm run build`, JSON parsing checks, eval schema checks, targeted reviewer-pattern scans, script LF checks, and `git diff --check` on the touched files.
- Feature unit 05 migration ran successfully with `npx prisma migrate dev --name init`. Generated client verified with `npx prisma generate`. Build verified with `npm run build`.
 - Resolved TypeScript errors introduced by runtime-only Prisma options and re-verified `npm run build` completed successfully after the fix.
