# Dark Theme Design

**Date:** 2026-06-11

## Goal

Add a user-togglable dark theme to the AI News Room app that respects `prefers-color-scheme` as the default and persists the user's choice to `localStorage`.

## Context

The app already has fully-defined dark mode CSS variables under the `.dark` class in `src/index.css`, including a warm newsprint light palette and a cool blue-grey dark palette. The `@custom-variant dark (&:is(.dark *))` Tailwind variant is wired up. Almost all colors flow through CSS variables — toggling `.dark` on `<html>` is sufficient to switch the entire UI.

## Approach

**Approach A — `useTheme` hook + icon button in Masthead (chosen)**

- A `useTheme` hook in `src/lib/theme.ts` owns theme state. On mount: reads `localStorage('theme')`; if absent, checks `prefers-color-scheme: dark`. Applies/removes `.dark` on `document.documentElement`. Returns `{ theme, toggle }`.
- A Moon/Sun Lucide icon button is added to the right of the nav bar in `Masthead.tsx`.
- An inline `<script>` in `index.html` runs synchronously before React mounts, applying `.dark` to `<html>` if needed — prevents flash of wrong theme.

## Files Touched

| File | Change |
|---|---|
| `src/lib/theme.ts` | New — `useTheme` hook |
| `src/components/Masthead.tsx` | Add toggle button using `useTheme` |
| `index.html` | Add anti-flash inline script |

## Design Decisions

- No React Context needed — the only consumer of `useTheme` is the Masthead toggle.
- No changes to component `dark:` class usage — CSS variables handle everything automatically.
- The existing `dark:` classes in `badge.tsx` and `SwipeCard.tsx` continue working correctly since `.dark` is on `<html>`.
