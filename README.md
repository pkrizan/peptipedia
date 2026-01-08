# Peptipedia

**Peptipedia** is an evidence-oriented knowledge base for bioactive peptides, designed to bring structure, clarity, and transparency to a field often dominated by fragmented or anecdotal information.

The project focuses on **mechanisms, evidence quality, and research context**, clearly separating what is supported by human clinical data from what remains preclinical or anecdotal.

---

## Why Peptipedia exists

While researching peptides ourselves, we were repeatedly frustrated by:
- scattered sources
- inconsistent terminology
- unclear distinctions between animal, observational, and randomized human evidence
- claims presented without context or hierarchy of proof

Peptipedia was created to provide a **systematic, source-aware approach** to peptide information — without marketing hype or medical advice.

---

## Core principles

- **Evidence-first**  
  Claims are tagged by the strongest available evidence.

- **Clear separation of fact vs speculation**  
  Human RCTs, observational data, animal studies, in vitro work, and anecdotal reports are explicitly distinguished.

- **Mechanism-aware, not mechanism-only**  
  Mechanistic hypotheses are included, but never presented as proof of clinical efficacy.

- **No medical advice**  
  Peptipedia is an educational and research-oriented resource only.

---

## Evidence levels used

Claims are tagged according to the strongest supporting evidence:

- **Human (RCT)** — randomized controlled trials  
- **Human (Observational)** — cohort, case-control, registries  
- **Case report** — individual clinical descriptions  
- **Animal** — in vivo non-human studies  
- **In vitro** — cell or biochemical studies  
- **Anecdotal** — self-reported community notes (clearly separated)

---

## Content structure

- `/peptides` — individual peptide profiles  
- `/classes` — functional and pharmacological classes  
- `/targets` — receptors, pathways, and mechanisms  
- `/policy` — editorial standards and disclaimers  
- `/about` — project background and intent  

Each peptide page includes:
- overview and mechanism
- evidence summary
- safety context
- research-oriented dosing and study findings (where available)
- known unknowns and gaps

---

## Tech stack

- **Astro**
- **MDX**
- Content collections for structured data
- Static generation with SSR support
- GitHub Actions for CI


