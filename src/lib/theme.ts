import { useCallback, useEffect, useRef, useState } from "react"

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
  const userChose = useRef(false)

  useEffect(() => {
    applyTheme(theme)
    // Only persist once the user has explicitly toggled — don't lock in the
    // OS default so that prefers-color-scheme changes remain effective for
    // users who never manually chose a theme.
    if (userChose.current) {
      localStorage.setItem("theme", theme)
    } else {
      userChose.current = true
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggle }
}
