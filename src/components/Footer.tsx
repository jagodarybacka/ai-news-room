import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme"

export function Footer() {
  const { theme, toggle } = useTheme()

  return (
    <footer className="mt-12 border-t border-border py-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">The AI News Room</p>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </footer>
  )
}
