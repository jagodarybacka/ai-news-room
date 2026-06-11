import { Link, NavLink } from "react-router-dom"
import { formatLongDate } from "@/lib/data"

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
  return (
    <header className={showHero ? "mb-10" : "mb-2"}>
      {/* Slim sticky utility bar: the wordmark and section nav stay reachable
          as the hero scrolls away. */}
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

          {/* Newspaper rule: three hairlines under the wordmark, kept faint. */}
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
