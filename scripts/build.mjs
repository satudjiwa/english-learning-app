import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "_site");

async function exists(target) {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function countFiles(directory) {
  let count = 0;
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      count += await countFiles(target);
    } else {
      count += 1;
    }
  }
  return count;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const rootFiles = [
  "index.html",
  "styles.css",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  ".nojekyll"
];

for (const file of rootFiles) {
  await cp(path.join(ROOT, file), path.join(OUT, file));
}

await cp(path.join(ROOT, "js"), path.join(OUT, "js"), { recursive: true });
await cp(path.join(ROOT, "data"), path.join(OUT, "data"), { recursive: true });

if (await exists(path.join(ROOT, "public"))) {
  await cp(path.join(ROOT, "public"), path.join(OUT, "public"), { recursive: true });
}

const required = [
  "index.html",
  "styles.css",
  "sw.js",
  "manifest.webmanifest",
  "icon.svg",
  "js/app.js",
  "js/views/home.js",
  "js/views/modules.js",
  "js/views/lesson.js",
  "js/views/teleprompter.js",
  "js/views/shadowing.js",
  "js/components/teleprompter.js",
  "js/components/shadowing.js",
  "data/modules.json",
  "data/lessons/index.json"
];

for (const file of required) {
  if (!(await exists(path.join(OUT, file)))) {
    throw new Error(`Build is incomplete: _site/${file} is missing`);
  }
}

const manifest = JSON.parse(await readFile(path.join(OUT, "data/lessons/index.json"), "utf8"));
const fileCount = await countFiles(OUT);
const hasPublic = await exists(path.join(ROOT, "public"));

console.log("Small Steps English — static build");
console.log(`  Output: _site/`);
console.log(`  Files:  ${fileCount}`);
console.log(`  Lessons available: ${manifest.map(entry => entry.id).join(", ")}`);
console.log(`  Public assets: ${hasPublic ? "copied" : "none (audio will use browser voice)"}`);
console.log("Build complete.");
