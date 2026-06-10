#!/usr/bin/env node
// Validates public/data/index.json and every brief in public/data/briefs/.
// Used by CI and by the /daily-brief routine before committing.

import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.resolve(import.meta.dirname, "../public/data")
const BRIEFS_DIR = path.join(DATA_DIR, "briefs")

const SECTION_IDS = ["labs", "research", "engineering", "safety-psych", "voices", "lab-blogs"]
const ITEM_TYPES = ["news", "paper", "blog", "tweet", "release"]
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_SUMMARY_LENGTH = 400

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

function validateHeadline(headline, ctx) {
  for (const field of ["title", "summary", "url", "source"]) {
    if (!isNonEmptyString(headline[field])) fail(`${ctx}: headline.${field} missing or empty`)
  }
  if (headline.url && !isHttpUrl(headline.url)) fail(`${ctx}: headline.url is not a valid http(s) URL`)
}

function validateItem(item, ctx, { summaryOptional = false } = {}) {
  const required = summaryOptional
    ? ["title", "url", "source"]
    : ["title", "summary", "url", "source"]
  for (const field of required) {
    if (!isNonEmptyString(item[field])) fail(`${ctx}: ${field} missing or empty`)
  }
  if (item.url && !isHttpUrl(item.url)) fail(`${ctx}: url is not a valid http(s) URL`)
  if (!ITEM_TYPES.includes(item.type)) fail(`${ctx}: type "${item.type}" not in ${ITEM_TYPES.join("|")}`)
  if (![1, 2, 3].includes(item.importance)) fail(`${ctx}: importance "${item.importance}" must be 1, 2 or 3`)
  if (typeof item.summary === "string" && item.summary.length > MAX_SUMMARY_LENGTH) {
    fail(`${ctx}: summary longer than ${MAX_SUMMARY_LENGTH} chars — keep it scannable`)
  }
}

function validateBrief(brief, date, ctx) {
  if (brief.date !== date) fail(`${ctx}: "date" is "${brief.date}" but filename says "${date}"`)
  if (!isNonEmptyString(brief.generatedAt) || Number.isNaN(Date.parse(brief.generatedAt))) {
    fail(`${ctx}: generatedAt is not a parseable timestamp`)
  }
  if (brief.headline != null) validateHeadline(brief.headline, ctx)
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
    if (!Array.isArray(section.items)) {
      fail(`${ctx}: section "${section.id}" items must be an array`)
      continue
    }
    // The lab-blogs wire is a bare listing; summaries are optional there.
    section.items.forEach((item, i) =>
      validateItem(item, `${ctx} > ${section.id}[${i}]`, {
        summaryOptional: section.id === "lab-blogs",
      })
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

if (errors.length > 0) {
  console.error(`✗ Validation failed with ${errors.length} error(s):\n`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`✓ index.json and ${briefFiles.length} brief(s) are valid`)
