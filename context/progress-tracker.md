# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

- Share dialog complete; editor workspace shell ready for canvas/Liveblocks integration.

## Current Goal

- Select the next feature spec to implement (canvas, Liveblocks, or AI chat).

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
- Fixed the project sidebar UI issue by correcting the invalid Tailwind positioning utility and restoring the My Projects / Shared tabs layout.- Rebuilt the editor chrome per `context/feature-specs/02-editor.md`, ensuring the floating project sidebar now slides in from the left and sits directly below the top navbar without pushing page content.- Connected `/editor` home and dialogs to real project persistence with new API routes and server-side project fetching.
- Added `app/api/projects` and `app/api/projects/[projectId]` routes for authenticated list/create/rename/delete operations.
- Added `hooks/use-project-actions.ts` for dialog state, form handling, and workspace navigation.
- Added `app/editor/[projectId]/page.tsx` for persisted workspace navigation.
- Verified the final production build passes after wiring the new backend and UI updates.
- Fixed server-side event handler prop serialization by moving `EditorNavbar` state into a client shell used by `app/editor/[projectId]/page.tsx`.
- Fixed PostgreSQL SSL mode warning by updating DATABASE_URL to use explicit `sslmode=verify-full` instead of `sslmode=require`.
- This ensures compatibility with future versions (pg-connection-string v3.0.0 and pg v9.0.0) while maintaining current security guarantees.
 - Fixed sidebar empty-state styling to match the design reference (remove inset rounded card when no projects).
 - Added guards in project utilities to avoid calling `prisma.findUnique` with an undefined `id`, preventing runtime `PrismaClientValidationError` when routes receive missing params.
 - Fixed server `params` handling on `app/editor/[projectId]/page.tsx` by awaiting `params` before using `projectId`, resolving Next.js runtime Promise access error.
 - Removed inner rounded panel in `TabsContent` so the sidebar empty state matches the reference layout more closely.

- Fixed reported issues: added explicit authenticated-user vs provided `userId` verification in `lib/projects.ts` to avoid `currentUser()` mismatches, and imported `useEffect` in `hooks/use-project-actions.ts` to resolve the hook error.
- Implemented feature unit 08: editor workspace shell.
- Added `lib/project-access.ts` with Clerk identity helpers and owner/collaborator project access checks.
- Added `components/editor/access-denied.tsx` for missing or unauthorized projects with a link back to `/editor`.
- Replaced `app/editor/[projectId]/page.tsx` with server-side `app/editor/[roomId]/page.tsx` using access helpers, sign-in redirect, and `AccessDenied` instead of `notFound()`.
- Added `components/editor/workspace-shell.tsx` with full-viewport layout: project navbar, floating project sidebar, canvas placeholder, and AI sidebar placeholder.
- Extended `EditorNavbar` with project name, share button, and AI sidebar toggle for workspace routes.
- Extended `ProjectSidebar` with `activeRoomId` highlighting for the current room.
- Removed the interim `project-page-shell.tsx` in favor of the new workspace shell.
- Verified feature unit 08 with `npm run build`.
- Fixed Prisma P1017 `ConnectionClosed` runtime error on `/editor` by hardening `lib/prisma.ts` with an explicit shared `pg.Pool`, connection lifecycle settings, and automatic client reset/retry on stale connections.
- Cleared `context/current-issues.md` issue-1 after verifying `/editor` loads successfully in dev.
- Implemented feature unit 09: share dialog.
- Added `lib/collaborators.ts` with list/invite/remove helpers and Clerk Backend API profile enrichment by email.
- Added `GET/POST /api/projects/[projectId]/collaborators` and `DELETE /api/projects/[projectId]/collaborators/[collaboratorId]` with owner-only invite/remove enforcement.
- Added `hooks/use-share-dialog.ts` and `components/editor/share-dialog.tsx` for invite, collaborator list, remove, and copy-link feedback.
- Wired the workspace Share navbar button to open the dialog; owners get full controls, collaborators get read-only list and copy link.
- Verified feature unit 09 with `npm run build`.
- Fixed current issue batch from `context/current-issues.md`:
  - Normalized project sidebar tab panel widths so My Projects and Shared use the same full-width static container and no longer shrink on empty state.
  - Added outside-click dismiss for the project sidebar (all breakpoints) and AI sidebar via transparent backdrop layers below the navbar.
  - Replaced the AI sidebar navbar toggle icon with a Sparkles button styled with AI accent tokens; kept the project sidebar on PanelLeftOpen/Close.
- Cleared `context/current-issues.md` after verifying `npm run build`.

## In Progress

- None.

## Next Up

- Canvas integration, Liveblocks room wiring, or AI chat sidebar — per upcoming feature specs.

## Open Questions

- None.

## Architecture Decisions

- shadcn/ui is configured through `components.json` with generated primitives under `components/ui/`.
- Ghost theme tokens are mapped in `app/globals.css` and applied as the default dark-only theme.
- Editor chrome state is isolated in a small client workspace while the route page remains a Server Component.
- Clerk route paths are resolved through the standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` environment variables with local `/sign-in` and `/sign-up` fallbacks.
- Next.js 16 route protection uses root-level `proxy.ts`; no `middleware.ts` is used.
- Clerk proxy protection explicitly uses local unauthenticated redirects to keep auth navigation on the app domain.
- Project ID and Liveblocks room ID stay aligned; workspace routes use `/editor/[roomId]` with access enforced in `lib/project-access.ts`.
- Workspace routes render `AccessDenied` for missing or unauthorized projects instead of a generic 404.
- Direct PostgreSQL access uses a shared `pg.Pool` behind `@prisma/adapter-pg`, with dev-time retry on closed connections (P1017).
- Collaborators are stored by email in `ProjectCollaborator`; Clerk Backend API enriches list responses with display name and avatar when a user exists.
- Share invite/remove mutations require project ownership; collaborator list and copy link are available to all project members.

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
- SSL mode warning fix: Updated DATABASE_URL connection string from `sslmode=require` to `sslmode=verify-full` to eliminate pg-connection-string deprecation warnings and maintain forward compatibility.
- Fixed the project delete regression by handling `204 No Content` responses in `hooks/use-project-actions.ts`.
- Refined the project sidebar tab UI so `My Projects` and `Shared` controls fit inside the panel, reduced button size, improved active state clarity, centered the project list frame, and added top padding for a cleaner UX.
- Added extra sidebar top padding so the Projects panel sits comfortably below the editor navbar without appearing cramped.
- Added user-facing error handling for project create/rename/delete actions in `hooks/use-project-actions.ts`.
- Added explicit project authorization checks in `lib/projects.ts` and consistent sign-in redirect handling in `app/editor/[projectId]/page.tsx`.
- Resolved the event handler prop serialization error in `app/editor/[projectId]/page.tsx` by moving `EditorNavbar` client sidebar state into `components/editor/project-page-shell.tsx`; verified with `npm run build`.
 - Patched code-level issues from `context/current-issues.md` (authorization guard and `useEffect` import); verified edits compile locally.
- Feature unit 08 verified with `npm run build`; `/editor/[roomId]` route compiles and access-denied flow is wired.
- Prisma P1017 fix verified with `npm run build` and dev requests to `/editor` returning `200`.
- Feature unit 09 verified with `npm run build`; share dialog routes compile and workspace Share action is wired.
- Current issue batch verified with `npm run build`; sidebar tab panels stay equal width, outside-click closes floating panels, AI toggle uses Sparkles icon.
