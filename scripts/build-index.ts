import fs from "node:fs";
import path from "node:path";

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
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

  // Minimal frontmatter parser supporting:
  // key: value
  // key:
  //   - a
  //   - b
  // key: ["a","b"]
  const obj: any = {};
  let currentListKey: string | null = null;

  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // list item
    if (currentListKey && trimmed.startsWith("- ")) {
      obj[currentListKey].push(trimmed.slice(2).trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1"));
      continue;
    }

    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();

    // start of block list
    if (val === "") {
      currentListKey = key;
      obj[key] = [];
      continue;
    }

    currentListKey = null;

    // inline arrays: [a, b] or ["a","b"]
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        // normalize single quotes to double for JSON.parse
        obj[key] = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        obj[key] = [];
      }
      continue;
    }

    // strings / scalars
    obj[key] = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  }

  return obj;
}

function slugFromFile(file: string, baseDir: string): string {
  const rel = path.relative(baseDir, file).replace(/\\/g, "/");
  // remove extension
  return rel.replace(/\.(mdx|md)$/, "");
}

const peptidesDir = path.join(process.cwd(), "src", "content", "peptides");
const outFile = path.join(process.cwd(), "public", "search-index.json");

const files = walk(peptidesDir);

const index = files.map((f) => {
  const fm = readFrontmatter(f);
  const slug = slugFromFile(f, peptidesDir);

  return {
    type: "peptide",
    name: fm.name || fm.title || path.basename(f, path.extname(f)),
    slug,
    aliases: fm.aliases || [],
    classes: fm.classes || [],
    targets: fm.targets || [],
    evidence_floor: fm.evidence_floor || null,
    url: `/peptides/${slug}`,
  };
});

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(index, null, 2));
console.log(`✅ Built search index: ${index.length} peptides -> public/search-index.json`);
