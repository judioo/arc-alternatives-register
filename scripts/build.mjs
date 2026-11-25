// Writes browsers.json, browsers.csv and the table in README.md from data/browsers.
// With --check it writes nothing and exits 1 if any of them is out of date.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, load } from "./lib.mjs";

const check = process.argv.includes("--check");
const list = load().map(({ file, ...b }) => b);
const PLAT = { macos: "macOS", windows: "Windows", linux: "Linux", ios: "iOS", android: "Android" };
const ENG = { chromium: "Chromium", webkit: "WebKit", gecko: "Gecko", mixed: "Mixed", unknown: "Unknown" };
const host = (u) => u.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");
const repo = (u) => u.replace(/^https:\/\/github\.com\//, "").replace(/\/$/, "");

const json = JSON.stringify(list, null, 2) + "\n";
const cols = ["name", "slug", "engine", "engine_detail", "platforms", "licence", "open_source", "status", "maturity", "price", "website", "repository", "checked"];
const cell = (v) => {
  const s = Array.isArray(v) ? v.join(" ") : v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [cols.join(","), ...list.map((b) => cols.map((c) => cell(b[c])).join(","))].join("\n") + "\n";

const rows = list.map((b) =>
  [
    b.name,
    b.engine_detail || ENG[b.engine],
    b.platforms.map((p) => PLAT[p]).join(", ") || "Not stated",
    b.licence || "Unknown",
    b.status,
    b.website ? `[${host(b.website)}](${b.website})` : "",
    b.repository ? `[${repo(b.repository)}](${b.repository})` : "",
  ].join(" | "),
);
const table = ["| Browser | Engine | Platforms | Licence | Status | Website | Source code |", "| --- | --- | --- | --- | --- | --- | --- |", ...rows.map((r) => `| ${r} |`)].join("\n");
const readmePath = join(ROOT, "README.md");
const readme = readFileSync(readmePath, "utf8").replace(/<!-- table:start -->[\s\S]*<!-- table:end -->/, `<!-- table:start -->\n${table}\n<!-- table:end -->`).replace(/<!-- count -->\d*<!-- \/count -->/, `<!-- count -->${list.length}<!-- /count -->`);

const out = { [join(ROOT, "browsers.json")]: json, [join(ROOT, "browsers.csv")]: csv, [readmePath]: readme };
let stale = [];
for (const [path, text] of Object.entries(out)) {
  let now = "";
  try { now = readFileSync(path, "utf8"); } catch {}
  if (now === text) continue;
  if (check) stale.push(path.slice(ROOT.length));
  else writeFileSync(path, text);
}
if (stale.length) {
  console.error(`Out of date: ${stale.join(", ")}. Run: node scripts/build.mjs`);
  process.exit(1);
}
console.log(check ? "Generated files are up to date." : `Wrote ${list.length} browsers.`);
