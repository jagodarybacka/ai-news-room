#!/usr/bin/env node
// Editorial maintenance report: which sources actually produce brief items?
// Run `pnpm yield` periodically and prune SOURCES.md entries that never show up.
// Read-only — scans public/data/briefs/ and prints a tally.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const BRIEFS_DIR = path.resolve(import.meta.dirname, "../public/data/briefs")
const STALE_AFTER_DAYS = 30

const briefFiles = (await readdir(BRIEFS_DIR)).filter((f) => f.endsWith(".json"))
const briefs = await Promise.all(
  briefFiles.map(async (f) => JSON.parse(await readFile(path.join(BRIEFS_DIR, f), "utf8")))
)
briefs.sort((a, b) => a.date.localeCompare(b.date))

// source -> { total, perSection: Map, firstSeen, lastSeen }
const tally = new Map()

function record(source, sectionId, date) {
  const entry = tally.get(source) ?? {
    total: 0,
    perSection: new Map(),
    firstSeen: date,
    lastSeen: date,
  }
  entry.total += 1
  entry.perSection.set(sectionId, (entry.perSection.get(sectionId) ?? 0) + 1)
  if (date < entry.firstSeen) entry.firstSeen = date
  if (date > entry.lastSeen) entry.lastSeen = date
  tally.set(source, entry)
}

for (const brief of briefs) {
  if (brief.headline) record(brief.headline.source, "headline", brief.date)
  for (const section of brief.sections) {
    for (const item of section.items) record(item.source, section.id, brief.date)
  }
}

const latestDate = briefs.at(-1)?.date
const rows = [...tally.entries()].sort((a, b) => b[1].total - a[1].total)

console.log(`Source yield across ${briefs.length} brief(s) (${briefs[0]?.date} → ${latestDate})\n`)
const width = Math.max(...rows.map(([source]) => source.length), 6)
console.log(`${"SOURCE".padEnd(width)}  ITEMS  LAST SEEN   SECTIONS`)
for (const [source, entry] of rows) {
  const sections = [...entry.perSection.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => `${id}:${count}`)
    .join(" ")
  console.log(
    `${source.padEnd(width)}  ${String(entry.total).padStart(5)}  ${entry.lastSeen}  ${sections}`
  )
}

const staleCutoff = new Date(Date.parse(`${latestDate}T00:00:00Z`) - STALE_AFTER_DAYS * 86_400_000)
  .toISOString()
  .slice(0, 10)
const stale = rows.filter(([, entry]) => entry.lastSeen < staleCutoff)
if (stale.length > 0) {
  console.log(`\nNot seen in ${STALE_AFTER_DAYS}+ days (candidates to prune from SOURCES.md):`)
  for (const [source, entry] of stale) console.log(`  - ${source} (last ${entry.lastSeen})`)
}
