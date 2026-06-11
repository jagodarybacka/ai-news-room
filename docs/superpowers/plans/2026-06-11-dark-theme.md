# Dark Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a user-togglable dark/light theme with system preference detection and localStorage persistence.

**Architecture:** A `useTheme` hook applies/removes `.dark` on `<html>`, which activates the already-defined CSS variable palette in `index.css`. An anti-flash inline script in `index.html` prevents the wrong-theme flash on load. A Moon/Sun toggle button in `Masthead.tsx` is the sole UI surface.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Lucide React, Vite

---

### Task 1: Create `useTheme` hook

**Files:**
- Create: `src/lib/theme.ts`

- [ ] **Step 1: Create the hook file**

```typescript
// src/lib/theme.ts
import { useCallback, useEffect, useState } from "react"

type Theme = "light" | "dark"

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme")
  if (stored === "dark" || stored === "light") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggle }
}
```

- [ ] **Step 2: Verify types**

```bash
pnpm typecheck
```

Expected: no errors related to `theme.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/theme.ts
git commit -m "feat: add useTheme hook with localStorage + prefers-color-scheme"
```

---

### Task 2: Add anti-flash script to `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the inline script inside `<head>`, before the closing `</head>` tag**

Replace the `<head>` closing area so it reads:

```html
    <link
      rel="alternate"
      type="application/atom+xml"
      title="The AI News Room"
      href="/ai-news-room/feed.xml"
    />
    <script>
      (function () {
        var stored = localStorage.getItem('theme')
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark')
        }
      })()
    </script>
  </head>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: prevent dark theme flash on page load"
```

---

### Task 3: Add theme toggle button to Masthead

**Files:**
- Modify: `src/components/Masthead.tsx`

- [ ] **Step 1: Update `Masthead.tsx`**

Add the `useTheme` import and `Moon`/`Sun` Lucide imports at the top, and insert the toggle button at the end of the nav bar:

```tsx
import { Link, NavLink } from "react-router-dom"
import { Moon, Sun } from "lucide-react"
import { formatLongDate } from "@/lib/data"
import { useTheme } from "@/lib/theme"

interface MastheadProps {
  date?: string
  showHero?: boolean
}

const navLinks = [
  { to: "/", label: "Today", end: true },
  { to: "/weekly", label: "Weekly", end: false },
  { to: "/reading-list", label: "Reading List", end: false },
  { to: "/archive", label: "Archive", end: false },
]

export function Masthead({ date, showHero = false }: MastheadProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className={showHero ? "mb-10" : "mb-2"}>
      {/* Slim sticky utility bar */}
      <div className={`sticky top-0 z-40 -mx-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:-mx-8 sm:px-8 ${showHero ? "mb-8" : "mb-0"}`}>
        <div className="flex h-14 items-center justify-between gap-2">
          <Link
            to="/"
            className="shrink-0 font-serif text-base font-semibold tracking-tight sm:text-lg"
          >
            The AI News Room
          </Link>
          <nav className="flex items-center gap-0.5 text-xs sm:text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-2 py-1 transition-colors sm:px-3 sm:py-1.5 ${
                    isActive
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`
                }
              >
                {link.label === "Reading List" ? (
                  <>
                    <span className="sm:hidden">Saved</span>
                    <span className="hidden sm:inline">Reading List</span>
                  </>
                ) : (
                  link.label
                )}
              </NavLink>
            ))}
            <button
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="ml-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </nav>
        </div>
      </div>

      {showHero && (
        <>
          <div className="text-center">
            {date && (
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                {formatLongDate(date)}
              </p>
            )}
            <Link to="/" className="mt-3 block">
              <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-6xl">
                The AI News Room
              </h1>
            </Link>
            <p className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground sm:tracking-[0.3em]">
              Frontier labs · Research · Engineering · Minds
            </p>
          </div>

          {/* Newspaper rule: three hairlines under the wordmark */}
          <div className="mt-5 space-y-[3px]" aria-hidden>
            <div className="h-px bg-foreground/25" />
            <div className="h-px bg-foreground/15" />
            <div className="h-px bg-foreground/25" />
          </div>
        </>
      )}
    </header>
  )
}
```

- [ ] **Step 2: Run typecheck and lint**

```bash
pnpm typecheck && pnpm lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Masthead.tsx
git commit -m "feat: add dark/light toggle button to Masthead"
```

---

### Task 4: Final verification

- [ ] **Step 1: Start dev server and verify manually**

```bash
pnpm dev
```

Check:
1. Page loads without flash of wrong theme (open DevTools > Application > Local Storage > clear `theme`, reload)
2. Moon/Sun icon appears in nav bar
3. Clicking the button toggles the theme
4. Reload preserves the chosen theme
5. In dark mode: background is dark, text is light, section pills remain distinct
6. In light mode: warm newsprint background returns

- [ ] **Step 2: Final typecheck**

```bash
pnpm typecheck && pnpm lint
```

Expected: clean.
