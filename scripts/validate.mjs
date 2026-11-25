// Checks every file in data/browsers. Exits 1 with a list of problems, so a pull request shows them.
import { ENGINES, MATURITIES, PLATFORMS, STATUSES, load } from "./lib.mjs";

const KEYS = ["name", "slug", "website", "repository", "engine", "engine_detail", "platforms", "licence", "open_source", "status", "maturity", "price", "listed_in", "sources", "checked", "notes"];
const REQUIRED = ["name", "slug", "engine", "platforms", "status", "sources"];
const url = (v) => typeof v === "string" && /^https:\/\/[^\s]+$/.test(v);
const problems = [];
const seen = new Map();

for (const b of load()) {
  const say = (m) => problems.push(`${b.file}: ${m}`);
  for (const k of Object.keys(b)) if (k !== "file" && !KEYS.includes(k)) say(`unknown field "${k}"`);
  for (const k of REQUIRED) if (b[k] === undefined || b[k] === null || b[k] === "") say(`"${k}" is required`);
  if (b.slug && b.file !== `${b.slug}.json`) say(`file name should be ${b.slug}.json`);
  if (b.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(b.slug)) say(`slug must be lower case letters, digits and hyphens`);
  if (b.website != null && !url(b.website)) say(`website must be an https URL or null`);
  if (b.repository != null && !url(b.repository)) say(`repository must be an https URL or null`);
  if (!ENGINES.includes(b.engine)) say(`engine must be one of ${ENGINES.join(", ")}`);
  if (!Array.isArray(b.platforms) || b.platforms.some((p) => !PLATFORMS.includes(p))) say(`platforms must be a list from ${PLATFORMS.join(", ")}`);
  if (!STATUSES.includes(b.status)) say(`status must be one of ${STATUSES.join(", ")}`);
  if (b.maturity != null && !MATURITIES.includes(b.maturity)) say(`maturity must be one of ${MATURITIES.join(", ")} or left out`);
  if (b.open_source != null && typeof b.open_source !== "boolean") say(`open_source must be true, false or null`);
  if (!Array.isArray(b.sources) || b.sources.length === 0 || b.sources.some((s) => !url(s))) say(`sources must list at least one https URL`);
  if (b.checked != null && !/^\d{4}-\d{2}-\d{2}$/.test(b.checked)) say(`checked must be a date, YYYY-MM-DD`);
  const key = b.name?.toLowerCase();
  if (seen.has(key)) say(`same name as ${seen.get(key)}`);
  seen.set(key, b.file);
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`${seen.size} browsers, all valid.`);
