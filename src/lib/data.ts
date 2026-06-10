import type { Brief, BriefIndex, Weekly } from "./types"

const dataUrl = (path: string) => `${import.meta.env.BASE_URL}data/${path}`

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load ${url}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function fetchIndex(): Promise<BriefIndex> {
  return fetchJson<BriefIndex>(dataUrl("index.json"))
}

export function fetchBrief(date: string): Promise<Brief> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Promise.reject(new Error(`Invalid date: ${date}`))
  }
  return fetchJson<Brief>(dataUrl(`briefs/${date}.json`))
}

export function fetchWeekly(date: string): Promise<Weekly> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Promise.reject(new Error(`Invalid date: ${date}`))
  }
  return fetchJson<Weekly>(dataUrl(`weekly/${date}.json`))
}

export function formatLongDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatShortDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatTime(isoDateTime: string): string {
  return new Date(isoDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
