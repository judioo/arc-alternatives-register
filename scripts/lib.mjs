import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const ROOT = new URL("..", import.meta.url).pathname;
export const DIR = join(ROOT, "data", "browsers");

export const ENGINES = ["chromium", "webkit", "gecko", "mixed", "unknown"];
export const PLATFORMS = ["macos", "windows", "linux", "ios", "android"];
export const STATUSES = ["active", "announced", "paused", "discontinued", "unknown"];
export const MATURITIES = ["stable", "beta", "alpha", "pre-alpha"];

/** Every browser file, sorted by name. */
export function load() {
  return readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: f, ...JSON.parse(readFileSync(join(DIR, f), "utf8")) }))
    .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}
