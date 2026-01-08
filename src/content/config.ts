import { defineCollection, z } from "astro:content";

const peptides = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    classes: z.array(z.string()).optional(),
    targets: z.array(z.string()).optional(),
    evidence_floor: z.string().optional().default(""),
    index: z.number().optional(),
  }),
});

const classes = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    description: z.string().optional().default(""),
  }),
});

const targets = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).optional(),
    type: z
      .enum(["receptor", "enzyme", "pathway", "ion_channel", "transporter", "other"])
      .optional(),
    modality_notes: z.string().optional(),     // “peptide agonists”, “small-molecule inhibitors”, etc.
    mechanism_summary: z.string().optional(),  // short 1–2 sentence summary for cards
    physiology: z.array(z.string()).optional(),// bullet list for quick scan
    evidence_floor: z.string().optional(),     // e.g. human_rct / human_observational
    references: z.array(z.string()).optional() // ["PMID:...", "DOI:..."]
  }),
});

export const collections = {
  peptides,
  classes,
  targets,
};
