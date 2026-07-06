# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- [Architecture Rules](.claude/rules/architecture.md) — 관심사 분리, 상태관리(TanStack Query / Jotai), vanilla-extract 스타일, 파일 네이밍, FSD 단방향 의존 규칙. 코드 작성 전 반드시 준수한다.

## Commands

Package manager is **pnpm** (see `packageManager` in `package.json`).

- `pnpm dev` — start the Vite dev server with HMR
- `pnpm build` — type-check the project (`tsc -b`) then produce a production build (`vite build`)
- `pnpm lint` — run ESLint over the repo
- `pnpm preview` — serve the production build locally

There is no test runner configured yet.

## State of the project

Despite the name `candle-chart`, this repo is currently the **unmodified Vite + React + TypeScript starter**: `src/App.tsx` still renders the default Vite/React landing page (logos, a `count` button, docs/social links). The actual candlestick-chart application has not been written. Treat the existing `App.tsx`, `App.css`, and the assets/icons under `src/assets` and `public/` as scaffolding to be replaced, not as established architecture.

## Architecture

- **Entry:** `index.html` → `src/main.tsx` mounts `<App />` into `#root` inside `<StrictMode>`.
- **React 19** with the `@vitejs/plugin-react` (Oxc-based) plugin; the React Compiler is intentionally not enabled.
- **TypeScript** uses project references: root `tsconfig.json` composes `tsconfig.app.json` (browser/`src`) and `tsconfig.node.json` (Vite config). `pnpm build` runs `tsc -b` against these.
- **ESLint** is flat-config (`eslint.config.js`) with `js.recommended`, `typescript-eslint` recommended, `react-hooks`, and `react-refresh` (vite) rules. To enable type-aware lint rules later, switch to `recommendedTypeChecked` and wire `parserOptions.project` — see `README.md`.
