#!/usr/bin/env node
// Generates an Atom feed (dist/feed.xml) from the published briefs.
// Runs after `vite build` — the feed is a build artifact, never committed.

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const DATA_DIR = path.resolve(import.meta.dirname, "../public/data")
const OUT_FILE = path.resolve(import.meta.dirname, "../dist/feed.xml")

const SITE_URL = "https://jagodarybacka.github.io/ai-news-room/"
const FEED_URL = `${SITE_URL}feed.xml`
const MAX_ENTRIES = 20

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"))
}

function formatLongDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

function itemHtml(item) {
  const summary = item.summary ? ` — ${item.summary}` : ""
  return `<li><a href="${escapeXml(item.url)}">${escapeXml(item.title)}</a> (${escapeXml(item.source)})${escapeXml(summary)}</li>`
}

function briefContentHtml(brief) {
  const parts = []
  if (brief.headline) {
    const h = brief.headline
    parts.push(
      `<p><strong><a href="${escapeXml(h.url)}">${escapeXml(h.title)}</a></strong> (${escapeXml(h.source)}) — ${escapeXml(h.summary)}</p>`
    )
  }
  for (const section of brief.sections) {
    parts.push(`<h2>${escapeXml(section.title)}</h2>`)
    if (section.comment) parts.push(`<p><em>${escapeXml(section.comment)}</em></p>`)
    parts.push(`<ul>${section.items.map(itemHtml).join("")}</ul>`)
  }
  return parts.join("\n")
}

function entryXml(brief) {
  const url = `${SITE_URL}#/brief/${brief.date}`
  const title = brief.headline
    ? `${formatLongDate(brief.date)} — ${brief.headline.title}`
    : `${formatLongDate(brief.date)} — Daily brief`
  return `  <entry>
    <title>${escapeXml(title)}</title>
    <link href="${escapeXml(url)}"/>
    <id>${escapeXml(url)}</id>
    <updated>${new Date(brief.generatedAt).toISOString()}</updated>
    <content type="html">${escapeXml(briefContentHtml(brief))}</content>
  </entry>`
}

const index = await readJson(path.join(DATA_DIR, "index.json"))
const dates = [...index.dates].sort().reverse().slice(0, MAX_ENTRIES)
const briefs = await Promise.all(
  dates.map((date) => readJson(path.join(DATA_DIR, "briefs", `${date}.json`)))
)

const feedUpdated = briefs
  .map((brief) => new Date(brief.generatedAt).toISOString())
  .sort()
  .at(-1)

const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>The AI News Room</title>
  <subtitle>A daily Claude-curated brief on frontier AI — labs, research, engineering, minds.</subtitle>
  <link href="${escapeXml(SITE_URL)}"/>
  <link rel="self" type="application/atom+xml" href="${escapeXml(FEED_URL)}"/>
  <id>${escapeXml(SITE_URL)}</id>
  <updated>${feedUpdated}</updated>
  <author><name>The AI News Room</name></author>
${briefs.map(entryXml).join("\n")}
</feed>
`

await mkdir(path.dirname(OUT_FILE), { recursive: true })
await writeFile(OUT_FILE, feed)
console.log(`✓ feed.xml written with ${briefs.length} entr${briefs.length === 1 ? "y" : "ies"}`)
