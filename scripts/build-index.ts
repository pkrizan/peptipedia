import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(p));
    else if (e.isFile() && (p.endsWith(".mdx") || p.endsWith(".md"))) files.push(p);
  }
  return files;
}

function readFrontmatter(file: string): any {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return {};
  const yaml = match[1];

  // Tiny YAML-ish parser (enough for our frontmatter)
  const obj: any = {};
  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();

    // arrays: ["a","b"]
    if (val.startsWith("[") && val.endsWith("]")) {
      try { obj[key] = JSON.parse(val.replace(/'/g, '"')); }
      catch { obj[key] = []; }
      continue;
    }
    // strings
    obj[key] = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }
  return obj;
}

const peptidesDir = path.join(process.cwd(), "content", "peptides");
const outFile = path.join(process.cwd(), "public", "search-index.json");

const files = fs.existsSync(peptidesDir) ? walk(peptidesDir) : [];
const index = files.map(f => {
  const fm = readFrontmatter(f);
  return {
    type: "peptide",
    name: fm.name || fm.title || path.basename(f, path.extname(f)),
    slug: fm.slug,
    aliases: fm.aliases || [],
    classes: fm.classes || [],
    targets: fm.targets || [],
    evidence_floor: fm.evidence_floor || null,
    url: `/peptides/${fm.slug}`
  };
}).filter(x => x.slug);

fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
console.log(`✅ Built search index: ${index.length} peptides -> public/search-index.json`);
