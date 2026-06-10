#!/usr/bin/env node
// Validates public/data/index.json and every brief in public/data/briefs/.
// Used by CI and by the /daily-brief routine before committing.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.resolve(import.meta.dirname, "../public/data")
const BRIEFS_DIR = path.join(DATA_DIR, "briefs")
const WEEKLY_DIR = path.join(DATA_DIR, "weekly")

const SECTION_IDS = ["labs", "research", "engineering", "safety-psych", "voices", "lab-blogs"]
const ITEM_TYPES = ["news", "paper", "blog", "tweet", "release"]
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_SUMMARY_LENGTH = 400
// Briefs from this date on must carry a verified publishedAt on every item.
const PUBLISHED_AT_REQUIRED_FROM = "2026-06-11"
// Freshness rule: news must be at most a month old; papers are exempt.
const MAX_NEWS_AGE_DAYS = 31
// Weekly digest bounds: synthesis, not a second firehose.
const MAX_OVERVIEW_LENGTH = 800
const MAX_THEME_BODY_LENGTH = 1200
const THEME_COUNT = { min: 2, max: 5 }
const TOP_READS_COUNT = { min: 5, max: 12 }

const errors = []
const fail = (msg) => errors.push(msg)

const isNonEmptyString = (value) => typeof value === "string" && value.trim() !== ""

const isHttpUrl = (value) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function validatePublishedAt(value, ctx, { briefDate, exemptFromFreshness = false }) {
  const required = briefDate >= PUBLISHED_AT_REQUIRED_FROM
  if (value == null) {
    if (required) fail(`${ctx}: publishedAt missing (required for briefs from ${PUBLISHED_AT_REQUIRED_FROM} on)`)
    return
  }
  if (!isNonEmptyString(value) || !DATE_RE.test(value) || Number.isNaN(Date.parse(value))) {
    fail(`${ctx}: publishedAt "${value}" is not a valid YYYY-MM-DD date`)
    return
  }
  if (value > briefDate) fail(`${ctx}: publishedAt "${value}" is after the brief date ${briefDate}`)
  if (!exemptFromFreshness) {
    const ageDays = (Date.parse(briefDate) - Date.parse(value)) / 86_400_000
    if (ageDays > MAX_NEWS_AGE_DAYS) {
      fail(`${ctx}: publishedAt "${value}" is over ${MAX_NEWS_AGE_DAYS} days before the brief — stale news gets dropped (papers are exempt)`)
    }
  }
}

function validateHeadline(headline, ctx, briefDate) {
  for (const field of ["title", "summary", "url", "source"]) {
    if (!isNonEmptyString(headline[field])) fail(`${ctx}: headline.${field} missing or empty`)
  }
  if (headline.url && !isHttpUrl(headline.url)) fail(`${ctx}: headline.url is not a valid http(s) URL`)
  if (headline.imageUrl != null && !isHttpUrl(headline.imageUrl)) {
    fail(`${ctx}: headline.imageUrl is not a valid http(s) URL`)
  }
  validatePublishedAt(headline.publishedAt, `${ctx}: headline`, { briefDate })
}

function validateItem(item, ctx, { summaryOptional = false, briefDate }) {
  const required = summaryOptional
    ? ["title", "url", "source"]
    : ["title", "summary", "url", "source"]
  for (const field of required) {
    if (!isNonEmptyString(item[field])) fail(`${ctx}: ${field} missing or empty`)
  }
  if (item.url && !isHttpUrl(item.url)) fail(`${ctx}: url is not a valid http(s) URL`)
  if (item.imageUrl != null && !isHttpUrl(item.imageUrl)) {
    fail(`${ctx}: imageUrl is not a valid http(s) URL`)
  }
  if (!ITEM_TYPES.includes(item.type)) fail(`${ctx}: type "${item.type}" not in ${ITEM_TYPES.join("|")}`)
  if (![1, 2, 3].includes(item.importance)) fail(`${ctx}: importance "${item.importance}" must be 1, 2 or 3`)
  if (typeof item.summary === "string" && item.summary.length > MAX_SUMMARY_LENGTH) {
    fail(`${ctx}: summary longer than ${MAX_SUMMARY_LENGTH} chars — keep it scannable`)
  }
  validatePublishedAt(item.publishedAt, ctx, {
    briefDate,
    exemptFromFreshness: item.type === "paper",
  })
}

function validateBrief(brief, date, ctx) {
  if (brief.date !== date) fail(`${ctx}: "date" is "${brief.date}" but filename says "${date}"`)
  if (!isNonEmptyString(brief.generatedAt) || Number.isNaN(Date.parse(brief.generatedAt))) {
    fail(`${ctx}: generatedAt is not a parseable timestamp`)
  }
  if (brief.headline != null) validateHeadline(brief.headline, ctx, date)
  if (!Array.isArray(brief.sections) || brief.sections.length === 0) {
    fail(`${ctx}: sections must be a non-empty array`)
    return
  }
  const seenIds = new Set()
  for (const section of brief.sections) {
    if (!SECTION_IDS.includes(section.id)) {
      fail(`${ctx}: section id "${section.id}" not in ${SECTION_IDS.join("|")}`)
      continue
    }
    if (seenIds.has(section.id)) fail(`${ctx}: duplicate section "${section.id}"`)
    seenIds.add(section.id)
    if (!isNonEmptyString(section.title)) fail(`${ctx}: section "${section.id}" has no title`)
    if (section.comment != null) {
      if (!isNonEmptyString(section.comment)) {
        fail(`${ctx}: section "${section.id}" comment must be a non-empty string (or omitted)`)
      } else if (section.comment.length > 250) {
        fail(`${ctx}: section "${section.id}" comment longer than 250 chars — one sentence only`)
      }
    }
    if (!Array.isArray(section.items)) {
      fail(`${ctx}: section "${section.id}" items must be an array`)
      continue
    }
    // The lab-blogs wire is a bare listing; summaries are optional there.
    section.items.forEach((item, i) =>
      validateItem(item, `${ctx} > ${section.id}[${i}]`, {
        summaryOptional: section.id === "lab-blogs",
        briefDate: date,
      })
    )
  }
}

function validateWeekly(weekly, date, ctx) {
  if (weekly.date !== date) fail(`${ctx}: "date" is "${weekly.date}" but filename says "${date}"`)
  for (const field of ["weekStart", "weekEnd"]) {
    if (!isNonEmptyString(weekly[field]) || !DATE_RE.test(weekly[field])) {
      fail(`${ctx}: ${field} must be a YYYY-MM-DD date`)
    }
  }
  if (weekly.weekStart > weekly.weekEnd) fail(`${ctx}: weekStart is after weekEnd`)
  if (weekly.weekEnd > date) fail(`${ctx}: weekEnd is after the publication date`)
  if (!isNonEmptyString(weekly.generatedAt) || Number.isNaN(Date.parse(weekly.generatedAt))) {
    fail(`${ctx}: generatedAt is not a parseable timestamp`)
  }
  if (!isNonEmptyString(weekly.overview)) {
    fail(`${ctx}: overview missing or empty`)
  } else if (weekly.overview.length > MAX_OVERVIEW_LENGTH) {
    fail(`${ctx}: overview longer than ${MAX_OVERVIEW_LENGTH} chars — a few sentences only`)
  }

  if (!Array.isArray(weekly.themes) || weekly.themes.length < THEME_COUNT.min || weekly.themes.length > THEME_COUNT.max) {
    fail(`${ctx}: themes must be an array of ${THEME_COUNT.min}–${THEME_COUNT.max}`)
  } else {
    weekly.themes.forEach((theme, i) => {
      const tctx = `${ctx} > themes[${i}]`
      if (!isNonEmptyString(theme.title)) fail(`${tctx}: title missing or empty`)
      if (!isNonEmptyString(theme.body)) {
        fail(`${tctx}: body missing or empty`)
      } else if (theme.body.length > MAX_THEME_BODY_LENGTH) {
        fail(`${tctx}: body longer than ${MAX_THEME_BODY_LENGTH} chars`)
      }
      if (!Array.isArray(theme.links) || theme.links.length === 0) {
        fail(`${tctx}: links must be a non-empty array — every theme cites its sources`)
        return
      }
      theme.links.forEach((link, j) => {
        const lctx = `${tctx} > links[${j}]`
        for (const field of ["title", "url", "source"]) {
          if (!isNonEmptyString(link[field])) fail(`${lctx}: ${field} missing or empty`)
        }
        if (link.url && !isHttpUrl(link.url)) fail(`${lctx}: url is not a valid http(s) URL`)
      })
    })
  }

  if (!Array.isArray(weekly.topReads) || weekly.topReads.length < TOP_READS_COUNT.min || weekly.topReads.length > TOP_READS_COUNT.max) {
    fail(`${ctx}: topReads must be an array of ${TOP_READS_COUNT.min}–${TOP_READS_COUNT.max}`)
  } else {
    weekly.topReads.forEach((item, i) =>
      validateItem(item, `${ctx} > topReads[${i}]`, { briefDate: date })
    )
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"))
}

const index = await readJson(path.join(DATA_DIR, "index.json"))

if (!Array.isArray(index.dates) || index.dates.length === 0) {
  fail("index.json: dates must be a non-empty array")
}
for (const date of index.dates ?? []) {
  if (!DATE_RE.test(date)) fail(`index.json: invalid date "${date}"`)
}
if (!index.dates?.includes(index.latest)) {
  fail(`index.json: latest "${index.latest}" is not in dates`)
}

const briefFiles = (await readdir(BRIEFS_DIR)).filter((f) => f.endsWith(".json"))
const fileDates = briefFiles.map((f) => f.replace(/\.json$/, ""))

for (const date of index.dates ?? []) {
  if (!fileDates.includes(date)) fail(`index.json lists "${date}" but briefs/${date}.json is missing`)
}
for (const date of fileDates) {
  if (!index.dates?.includes(date)) fail(`briefs/${date}.json exists but is not listed in index.json`)
}

for (const file of briefFiles) {
  const date = file.replace(/\.json$/, "")
  try {
    validateBrief(await readJson(path.join(BRIEFS_DIR, file)), date, `briefs/${file}`)
  } catch (err) {
    fail(`briefs/${file}: invalid JSON — ${err.message}`)
  }
}

// --- Weekly digests (optional until the first Friday edition exists) ---

let weeklyFiles = []
try {
  weeklyFiles = (await readdir(WEEKLY_DIR)).filter((f) => f.endsWith(".json"))
} catch (err) {
  if (err.code !== "ENOENT") throw err
}
const weeklyFileDates = weeklyFiles.map((f) => f.replace(/\.json$/, ""))

if (index.weekly != null) {
  if (!Array.isArray(index.weekly.dates) || index.weekly.dates.length === 0) {
    fail("index.json: weekly.dates must be a non-empty array")
  }
  for (const date of index.weekly.dates ?? []) {
    if (!DATE_RE.test(date)) fail(`index.json: invalid weekly date "${date}"`)
    if (!weeklyFileDates.includes(date)) {
      fail(`index.json lists weekly "${date}" but weekly/${date}.json is missing`)
    }
  }
  if (!index.weekly.dates?.includes(index.weekly.latest)) {
    fail(`index.json: weekly.latest "${index.weekly.latest}" is not in weekly.dates`)
  }
}
for (const date of weeklyFileDates) {
  if (!index.weekly?.dates?.includes(date)) {
    fail(`weekly/${date}.json exists but is not listed in index.json weekly.dates`)
  }
}

for (const file of weeklyFiles) {
  const date = file.replace(/\.json$/, "")
  try {
    validateWeekly(await readJson(path.join(WEEKLY_DIR, file)), date, `weekly/${file}`)
  } catch (err) {
    fail(`weekly/${file}: invalid JSON — ${err.message}`)
  }
}

if (errors.length > 0) {
  console.error(`✗ Validation failed with ${errors.length} error(s):\n`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

const weeklyNote = weeklyFiles.length > 0 ? ` and ${weeklyFiles.length} weekly digest(s)` : ""
console.log(`✓ index.json and ${briefFiles.length} brief(s)${weeklyNote} are valid`)
