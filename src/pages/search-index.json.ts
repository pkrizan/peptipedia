import { getCollection } from "astro:content";

export const prerender = true;

export async function GET() {
  const peptides = await getCollection("peptides");
  const index = peptides.map((p) => ({
    type: "peptide",
    name: p.data.name,
    slug: p.data.slug,
    aliases: p.data.aliases ?? [],
    classes: p.data.classes ?? [],
    targets: p.data.targets ?? [],
    evidence_floor: p.data.evidence_floor ?? "",
    url: `/peptides/${p.data.slug}`,
  }));

  return new Response(JSON.stringify(index, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
