// Copies the master template engine (engine/) into every demo folder
// (site/demos/<name>/engine/), so each demo is a complete, self-contained
// website that can be published or copied for a client on its own.
//
// Usage (from the repository root or tools/):  node tools/sync-engine.mjs [--check]
//   --check  only report demos whose engine copy differs (exit code 1 if any)
//
// Edit files in engine/ — never inside site/demos/*/engine/ — then run this.
import { readdir, readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const master = join(root, "engine");
const demosDir = join(root, "site", "demos");
const checkOnly = process.argv.includes("--check");

async function listFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listFiles(full)));
    else out.push(full);
  }
  return out;
}

const files = await listFiles(master);
const demos = (await readdir(demosDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
let stale = 0;

for (const demo of demos) {
  const target = join(demosDir, demo, "engine");
  const diffs = [];
  for (const file of files) {
    const rel = relative(master, file);
    const dest = join(target, rel);
    const want = await readFile(file);
    const have = await readFile(dest).catch(() => null);
    if (!have || !have.equals(want)) diffs.push(rel);
  }
  const extra = (await listFiles(target).catch(() => [])).map((f) => relative(target, f)).filter((rel) => !files.some((f) => relative(master, f) === rel));

  if (!diffs.length && !extra.length) {
    console.log(`✓ ${demo}: engine up to date`);
    continue;
  }
  stale++;
  if (checkOnly) {
    console.log(`✗ ${demo}: ${diffs.length} changed, ${extra.length} extra file(s)`);
    continue;
  }
  for (const rel of diffs) {
    const dest = join(target, rel);
    await mkdir(join(dest, ".."), { recursive: true });
    await writeFile(dest, await readFile(join(master, rel)));
  }
  for (const rel of extra) await rm(join(target, rel));
  console.log(`↻ ${demo}: updated ${diffs.length} file(s), removed ${extra.length}`);
}

if (checkOnly && stale) process.exitCode = 1;
