import { Link, NavLink } from "react-router-dom"
import { formatLongDate } from "@/lib/data"

interface MastheadProps {
  date?: string
}

export function Masthead({ date }: MastheadProps) {
  return (
    <header className="mb-8">
      <div className="flex items-baseline justify-between border-b border-foreground/20 pb-1 text-xs uppercase tracking-widest text-muted-foreground">
        <span>{date ? formatLongDate(date) : " "}</span>
        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-foreground" : "hover:text-foreground"
            }
          >
            Today
          </NavLink>
          <NavLink
            to="/archive"
            className={({ isActive }) =>
              isActive ? "text-foreground" : "hover:text-foreground"
            }
          >
            Archive
          </NavLink>
        </nav>
      </div>
      <Link to="/" className="block py-6 text-center">
        <h1 className="font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
          The AI News Room
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Frontier labs · Research · Engineering · Minds
        </p>
      </Link>
      <div className="border-b-4 border-double border-foreground/60" />
    </header>
  )
}
