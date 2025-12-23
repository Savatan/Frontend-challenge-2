# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Tooling and Commands

This is a TypeScript Next.js App Router project bootstrapped with `create-next-app` and managed via `package.json` scripts.

### Core scripts (npm examples)

- **Start dev server** (Next.js dev mode with HMR):
  - `npm run dev`
- **Create production build**:
  - `npm run build`
- **Run production server** (after building):
  - `npm run start`
- **Run ESLint over the project** (uses flat config in `eslint.config.mjs`):
  - `npm run lint`

> The README shows equivalent commands for `yarn`, `pnpm`, and `bun`; use whichever package manager you prefer, but keep it consistent for installs and scripts.

### Tests

There is currently **no test script or test framework configured** in `package.json`. If you add one (e.g. Jest, Vitest, or Playwright), also add a corresponding npm script so future commands like `npm test` or "run a single test" are well defined.

## High-Level Architecture

### Framework, routing, and entrypoints

- The app uses **Next.js App Router** with the main entrypoints under `src/app`:
  - `src/app/layout.tsx` defines the root HTML shell, global fonts, and wraps the app with the Redux provider.
  - `src/app/page.tsx` is the root page component. It reads `searchParams` (`page` and `search` query parameters) and passes them to a `PostsPage` feature component.
- The root page expects a feature module at `@/features/posts/PostsPage` (path alias to `src/features/posts/PostsPage`), though this file is not present in the current repository snapshot.

### State management and providers

- Global state is managed with **Redux Toolkit**:
  - `src/app/store.ts` creates a `configureStore` instance.
  - The store registers a single slice from RTK Query: `jsonPlaceholderApi` (see below).
  - RTK Query middleware is added via `getDefaultMiddleware().concat(jsonPlaceholderApi.middleware)`.
- React components are connected to the store through a dedicated provider:
  - `src/app/ReduxProvider.tsx` is a small client component that wraps `children` with React Redux's `<Provider store={store}>`.
  - `ReduxProvider` is imported and used in `src/app/layout.tsx` so that **all App Router routes** have access to the Redux store.

### Data fetching layer (RTK Query)

- Remote data is accessed via **Redux Toolkit Query** in `src/shared/api/jsonPlaceholderApi.ts`:
  - `jsonPlaceholderApi` is created with `createApi` and `fetchBaseQuery`, targeting `https://jsonplaceholder.typicode.com`.
  - Exposed entity types:
    - `Post` (id, userId, title, body)
    - `Comment` (id, postId, name, email, body)
  - Defined endpoints (query-only):
    - `getPosts`: paginated list of posts with optional title search.
      - Accepts `{ page: number; limit: number; search: string }`.
      - Uses `_page` and `_limit` query params and `title_like` when `search` is non-empty.
    - `getPostById`: fetches a single post by numeric `id`.
    - `getPostComments`: fetches comments for a given `postId`.
  - RTK Query auto-generates and exports React hooks:
    - `useGetPostsQuery`
    - `useGetPostByIdQuery`
    - `useGetPostCommentsQuery`
- The only Redux slice in `store.ts` is `jsonPlaceholderApi`, so **all server communication currently flows through this RTK Query API layer**.

### Styling and layout

- Global styles live in `src/app/globals.css`:
  - Defines light/dark color variables, resets margins/padding, and sets base typography and background/foreground colors.
  - Applies basic theming with `prefers-color-scheme` and ensures no horizontal overflow.
- Page-level layout styles for the root route are in `src/app/page.module.css`:
  - Provides a centered, full-height layout with `.page` and `.main` containers.
  - Defines typography and spacing for `.intro` content and CTA sections.
  - Includes responsive rules for smaller screens and adjusted theming for dark mode.

### TypeScript configuration and path aliases

- `tsconfig.json` enables strict TypeScript checking with `noEmit` and is configured for modern ES modules.
- A key convention is the **path alias**:
  - `@/*` → `./src/*`
- This allows imports like `@/shared/api/jsonPlaceholderApi` or `@/features/posts/PostsPage` instead of long relative paths. When adding new modules, place them under `src/...` and use the `@/` alias to stay consistent.

### Linting configuration

- ESLint is configured via the flat config in `eslint.config.mjs`:
  - Extends `eslint-config-next`'s `core-web-vitals` and TypeScript presets.
  - Uses `globalIgnores` to ignore build artifacts and generated files: `.next/**`, `out/**`, `build/**`, and `next-env.d.ts`.
- `npm run lint` runs ESLint with this configuration over the project. Prefer fixing lint errors rather than disabling rules unless there's a clear project-specific reason.
