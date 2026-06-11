import { useSyncExternalStore } from "react"
import type { MouseEvent } from "react"
import type { SectionId } from "./types"

// Per-article reader state, keyed by URL, persisted in localStorage only.
// `saved` entries carry enough metadata to render the reading list without
// loading old briefs.

export type ItemStatus = "read" | "dismissed"

export interface ItemState {
  status?: ItemStatus
  savedAt?: string
  title?: string
  source?: string
  briefDate?: string
  summary?: string
  sectionId?: SectionId
  sectionTitle?: string
}

export interface ItemMeta {
  url: string
  title: string
  source: string
  briefDate?: string
  summary?: string
  sectionId?: SectionId
  sectionTitle?: string
}

const STORAGE_KEY = "ai-news-room:item-state:v1"

function load(): Record<string, ItemState> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<
      string,
      ItemState
    >
  } catch {
    return {}
  }
}

let states: Record<string, ItemState> = load()
const listeners = new Set<() => void>()

function commit(next: Record<string, ItemState>) {
  states = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states))
  listeners.forEach((notify) => notify())
}

function patch(url: string, changes: Partial<ItemState>) {
  const merged: ItemState = { ...states[url], ...changes }
  const isEmpty = merged.status === undefined && merged.savedAt === undefined
  const next = { ...states }
  if (isEmpty) {
    delete next[url]
  } else {
    next[url] = merged
  }
  commit(next)
}

export function toggleStatus(meta: ItemMeta, status: ItemStatus) {
  const current = states[meta.url]?.status
  patch(meta.url, {
    status: current === status ? undefined : status,
    title: meta.title,
    source: meta.source,
    briefDate: meta.briefDate,
  })
}

/** Idempotent: opening an article marks it read, never un-reads it. */
export function markRead(meta: ItemMeta) {
  if (states[meta.url]?.status === "read") return
  patch(meta.url, {
    status: "read",
    title: meta.title,
    source: meta.source,
    briefDate: meta.briefDate,
  })
}

/** Handlers for article links: left- and middle-click both mark as read. */
export function markReadOnClick(meta: ItemMeta) {
  return {
    onClick: () => markRead(meta),
    onAuxClick: (event: MouseEvent) => {
      if (event.button === 1) markRead(meta)
    },
  }
}

export function toggleSaved(meta: ItemMeta) {
  const saved = states[meta.url]?.savedAt !== undefined
  patch(meta.url, {
    savedAt: saved ? undefined : new Date().toISOString(),
    title: meta.title,
    source: meta.source,
    briefDate: meta.briefDate,
    summary: saved ? undefined : meta.summary,
    sectionId: saved ? undefined : meta.sectionId,
    sectionTitle: saved ? undefined : meta.sectionTitle,
  })
}

/** Phase-2 right-swipe: mark read and remove from reading list in one commit. */
export function finishSaved(meta: ItemMeta) {
  patch(meta.url, {
    status: "read",
    savedAt: undefined,
    title: meta.title,
    source: meta.source,
    briefDate: meta.briefDate,
  })
}

export function getItemStates(): Record<string, ItemState> {
  return states
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export function useItemStates(): Record<string, ItemState> {
  return useSyncExternalStore(subscribe, () => states)
}

export function savedItems(
  all: Record<string, ItemState>
): Array<ItemState & { url: string }> {
  return Object.entries(all)
    .filter(([, state]) => state.savedAt !== undefined)
    .map(([url, state]) => ({ url, ...state }))
    .sort((a, b) => (b.savedAt ?? "").localeCompare(a.savedAt ?? ""))
}
