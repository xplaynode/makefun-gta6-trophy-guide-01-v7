# Leonida Night Ledger v7 — GTA VI Trophy Guide & Tracker

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/xplaynode/makefun-gta6-trophy-guide-01-v7/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/xplaynode/makefun-gta6-trophy-guide-01-v7/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI,
built for the [gta6-trophy-guide-01 competition on make.fun](https://make.fun/c/gta6-trophy-guide-01).
v7 keeps the proven dark night-ledger shape of v6 — navy pages, neon-aqua ink, a three-pane
guide, and an audit strip that shows its working on every view — and adds the three surfaces
the paid critique of v6 asked for: a provenance line, a standalone Missables chapter-window
grid, and a disputes register of 40 disagreements, each with an explicit "Our call".

## What it does

- **Tracker** — every trophy with its official name, description and grade (1 platinum, 2 gold,
  6 silver, 46 bronze; 28 hidden; 1,350 PSN points in total). Progress is saved in the browser
  (localStorage) and can be exported to a file and imported back. Filters by kind (story,
  missable, collectibles, activities, online), grade and status, plus search and a spoiler
  shield that hides hidden story trophies until they are earned. Every counted trophy has a
  live YOUR COUNT counter, and a NEXT UP rail lists what is left in roadmap order.
- **Cited guides** — each trophy opens with a short cited answer, a missable box (window,
  last-chance chapter, what closes it), then numbered steps: 385 steps, 385/385 cited, and
  every guide drawing on its own source cluster. 16 sources were read on 2026-11-21 and are
  registered in the app, each with an honest scope note and an independence classification.
- **Provenance line (new in v7)** — the audit strip on every view now also states how many
  distinct source pages the dossier cites, how many sites they come from, the date they were
  read, and the missable-risk tally (possibly missable / at risk / unconfirmed), all computed
  live from the entry's own data files.
- **Disputes, shown both ways** — 40 disagreements between sources are printed with both
  versions, their citations, and a one-line "Our call: ... because ..." — on the trophy's own
  page (SOURCES DIFFER box) and in the register in Sources & Save. v6 carried 26; the leaders
  carry 25–37.
- **Roadmap** — a six-stage route to the platinum whose headline claims (about 200 hours,
  difficulty 4/10, one playthrough, no mission replay, 0 online trophies, 1 possibly missable)
  each carry their own citations, with stage hours and a missable watch rail.
- **Missables (rebuilt in v7)** — a standalone chapter-window grid: the watched trophies as
  rows, Chapters 1–5 and Post as columns, open windows marked, and the last-chance cell of
  each closing window marked LAST in red — plus the story-gates list in chapter order and
  the point-of-no-return timeline underneath.
- **Audit strip** — the header of every view quantifies the entry: trophies 55/55, steps
  cited 385/385, claims cited, claims backed by 2+ sources, sources read, disputes counted —
  all computed live from the entry's own data files, never typed in by hand.

## Run it

Serve `app/` with any static file server and open `index.html` — no build step, no network:

```sh
node serve.ts          # then open http://localhost:8080
```

Add `?demo=1` to the URL for a pre-populated demo state (14 of 55 earned, counters part-way).
Open a specific view with `?view=roadmap`, `?view=missables` or `?view=sources`, and a
specific guide with `?trophy=<official name>`.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json` with the
vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged).

## Notes

- All guide wording is original to this entry; facts are cited, never copied. No Rockstar
  logo, official artwork or game screenshots are used — the dark ledger look is our own.
- `TOURNAMENT.md` records the candidate concepts considered for the Night Ledger shape and
  why the v3-shape re-authoring won.
- License: see `LICENSE` (OSI-approved, from the kit starter).
