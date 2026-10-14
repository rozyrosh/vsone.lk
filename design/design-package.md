# VS One. Design package

Light mode redesign of vsone.lk following the 10K websites method. One premise, one hero journey, one living element per section, one interactive moment, and a site that is complete before any footage arrives.

## 1. Premise

**Allocated.**

VS One does not sell hardware, it allocates it. Fifty vendor lines land on one desk in Colombo and leave as single, tracked units to two hundred partners in nine provinces. Everything on the site repeats that gesture: a wall of identical units, blue status lights at rest, and one unit that turns red because it is now yours.

The hero is called **The Rack**. The signature element is **the Rail**, a fixed line on the right edge that draws as the page is read and ticks each section. The interactive moment is **Hold to allocate**, a press-and-hold that runs one allocation through the four portal steps.

The world is a white datacenter: white racks, white floor, soft daylight, flat electric-blue status lights. It is the business itself, shot the way Apple shoots aluminium. Every image on the site lives in this world (the four stock tiles are white studio shots of a laptop, a 1U switch, a rack face and a meeting room, each with one flat blue light or screen).

## 2. Palette

All colors are CSS variables in `app/globals.css` and mapped into Tailwind names in `tailwind.config.ts`.

| Token | Value | Use |
| --- | --- | --- |
| `--canvas` | `#f7f8fb` | page background |
| `--panel` | `#ffffff` | cards, header when scrolled |
| `--panel-low` | `#f0f3f8` | recessed surfaces |
| `--panel-mid` | `#e8ecf3` | hairline-heavy surfaces |
| `--ink` | `#0f1115` | headlines, primary text |
| `--ink-2` | `#4b5363` | body text |
| `--ink-3` | `#5f6878` | labels, captions |
| `--hair` | `#e0e4eb` | hairlines |
| `--hair-strong` | `#7f8899` | drawn lines, strong borders |
| `--accent` | `#bb001e` | VS One red. The allocated unit: hero node, rail tip, kicker dashes, arrows, the primary CTA, hold ring when done |
| `--accent-hover` | `#9a0019` | red hover |
| `--blue` | `#0b5fd9` | system blue. Status: live dots, pulse halos, hold ring progress, route lines, selected province, open FAQ, scroll cue, chip dots, hover underline |
| `--blue-hover` | `#0a4fb5` | blue hover |
| `--mist-cool` / `--mist-cool-2` | `#dbe6f8` / `#e6eefb` | environment blobs (both cool; no warm mist) |

Every token also exists as an RGB triplet (`--canvas-rgb` and so on) so Tailwind alpha modifiers (`bg-panel/92`) compile. Tailwind names: `crimson` = red, `azure` = blue.

Three rules. Red and blue are points, never fields. Red means *allocated*, blue means *system is live*. Red and blue never blend: no gradient, no overlay, no purple anywhere; where they meet (the hero rack) the red light sits inside a wall of blue lights with white between them.

## 3. Type

| Role | Face | Where |
| --- | --- | --- |
| Display | Plus Jakarta Sans 800, tracking -0.03em, leading 1.06 | hero bands, section headlines |
| Body | Plus Jakarta Sans 400 to 700 | paragraphs, UI |
| Labels | IBM Plex Mono 400 and 500, uppercase, 0.16em tracking | kickers, rail labels, indices, chips |

## 4. The hero: The Rack

Pinned stage, 480vh of scroll, progress `p` from 0 to 1. Two pieces of footage share the stage:

- **At rest (`p < 0.012`)** the ambient loop plays: a locked shot of the white rack row, status lights breathing, nothing else moving. It is a ping-pong of a 5s clip so it has no visible seam. It crossfades out (0.7s) the moment the reader scrolls and pauses; it resumes when they return to the top. It also pauses when the tab is hidden or the hero leaves the viewport.
- **On scroll** the scrub clip takes over, one frame per scroll position: a slow push-in down the aisle, the racks slide past, the shot settles on one rack face, a grid of blue lights with a single red one, the allocated unit.

The drawn SVG runs on `--p` and is the complete hero on its own when no footage is present. With footage present, the vector's grid is hidden and only the red node and its halos remain, landing on the red light in the final frame.

### Footage (shipped)

Generated through the Freepik MCP, 2026-10-05.

| Asset | Model | Creation | Credits |
| --- | --- | --- | --- |
| Start frame (wide aisle, white racks, flat blue lights, one red) | Seedream 5 Pro, 16:9, 2k | `UP0lE6Ywny` | 200 (batch of 4) |
| Scrub clip, 6s, 1080p, slow push-in, start frame only | Seedance 2.5 Pro | `UP0lF0dwny` | 4,740 |
| Loop clip, 5s, 1080p, locked camera, lights only | Seedance 2.5 Pro | `s7nxC0nl8e` | 3,950 |
| Four stock tiles (laptop, 1U switch, rack face, meeting room), 3:2 | Seedream 5 Pro | batch | 400 |

Raw clips live in `review/hero-raw.mp4` and `review/hero-loop-raw.mp4` (git-ignored). `npm run hero:process` writes `public/hero/hero-scrub.mp4` (GOP 8, CRF 18, 4.05 MB), `hero-loop.mp4` (ping-pong, GOP 48, CRF 21, 1.67 MB), `hero-poster.jpg`, `hero-ending.jpg`, eight review frames, and `lib/hero-media.ts`. Tiles are exported to `public/catalog/studio-*.jpg` at 1600px.

SVG geometry is locked to the 16:9 footage (viewBox 1600x900, `xMidYMid slice`). The red light in the ending frame is at `NODE_X = 800, NODE_Y = 756`. With footage present the vector's parallax is disabled so the node stays on the light. The static hero shows the clip's ending frame under the node and rail at rest, grid hidden.

### Vector plan (what draws without footage, when)

| `p` | Vector |
| --- | --- |
| 0.00 | six rack columns, each half drawn so the first frame is not empty |
| 0.00 to 0.45 | columns complete left to right, nine shelf lines follow |
| 0.30 to 0.63 | blue status lights come up on the shelves |
| 0.45 to 0.85 | a red rail descends from the top to the node |
| 0.84 to 1.00 | red node and two halos arrive on the allocated unit |

### Band map (verbatim copy)

Each band is paced in scroll distance with smoothstep ramps. Nothing is skippable at a 360px flick.

| Band | Range | Kicker | Headline | Sub |
| --- | --- | --- | --- | --- |
| 1, left, weave | 0.00 to 0.23 | 01 / The bench | Fifty global brands. One desk in Colombo. | Dell, Cisco, HPE, Lenovo, Fortinet and APC, stocked and allocated from Thimbirigasyaya Road. |
| 2, right, snap | 0.26 to 0.49 | 02 / The portal | Stock checked. Credit cleared. Serial verified. | One login shows what is on the shelf, what your credit line covers, and where the box is right now. |
| 3, left, drift | 0.52 to 0.75 | 03 / The island | Every province. 24 to 48 hours. | Regional hubs and channel managers move hardware from Colombo to your door, in every province. |
| 4, center, rise | 0.78 to 1.00 | VS One / ICT distribution | Enterprise hardware, allocated to you. (h1) | VS One supplies 200+ Sri Lankan partners with enterprise compute, networking and datacenter hardware through the island's first ERP partner portal. |

Band 4 carries the two CTAs: **Become a partner** (ink button with red arrow) and **Browse the catalog** (ghost).

### Static hero (phones, portrait tablets, coarse pointers, reduced motion)

Hero collapses to one viewport. The ending frame of the scrub clip is shown as a still, the vector sits at `--p: 1` (rail and node on the red light, grid hidden), and no video is requested. Band 4 is shown as the static settle: kicker, h1, sub, both CTAs. Five gates, identical in CSS and JS:

```
(max-width: 720px)
(orientation: portrait) and (max-width: 1024px)
(orientation: portrait) and (pointer: coarse)
(orientation: landscape) and (pointer: coarse) and (max-height: 560px)
(prefers-reduced-motion: reduce)
```

No video request is made on any gated device.

### Legibility system (light inversion)

Graphite text straight on the footage, no scrim behind the bands (removed by request; the white racks are light enough to carry the ink). A 1px canvas-colored text-shadow keeps letter edges crisp over the shelf lines. If a future clip is darker, bring back a `.band::before` radial of `--canvas` and tie its opacity to the band's `--k`.

## 5. Below the fold

| # | Section | id | Living element |
| --- | --- | --- | --- |
| 1 | The allocation desk (search + brand marquee) | `desk` | marquee |
| 2 | Receipts (four counted numbers) | `receipts` | drawn top line, count-up |
| 3 | What the desk does (six pillars) | `desk-work` | blue pulsing index dot, blue progress bar |
| 4 | What we stock (four tiles) | `stock` | white studio stills from the Rack world, white veil for the words, tile zoom on hover |
| 5 | How allocation works | `portal` | **Hold to allocate** (the interactive moment): ring fills blue, turns red when the unit is allocated |
| 6 | Where the boxes go (island map) | `island` | blue routes draw from the hub, red HQ pin, blue selected province |
| 7 | Who we supply (six channels) | `channels` | row arrows |
| 8 | The people | `people` | image band |
| 9 | Answers (FAQ) | `answers` | rotating plus, blue when open |
| 10 | Dispatch notes | `news` | editorial rows |
| 11 | Join | `join` | the line descends into one red node above the CTA |

Reveal choreography: `.reveal .part` with `--i` indices, 90ms steps, delays retired after the first play so re-entry is instant. Live sections (`.reveal.live`) toggle with the viewport.

## 6. Engineering list

- Blob fetch of the scrub file with a loading ring and 20s watchdog. Failure leaves the vector hero in place.
- dt-normalized rAF lerp (k = 0.16) that rests when settled. Gated seeks (`seeking` flag, 1/120s delta). Delta-gated DOM writes.
- Captions paced in scroll distance; smoothstep ramps; `f = min(0.02, (b - a) / 3)`.
- Five static gates, identical in CSS and JS. Mode re-applied on `matchMedia` change.
- Body pauses the hero when the tab is hidden. Reduced motion pins every reveal and completes the hold moment.
- Footage pipeline: `npm run hero:process` (see `design/google-flow-prompts.md`).

## 7. Copy gate

No em dashes. None of: leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions, testament, landscape, delve, elevate. Checked across `app/`, `components/`, `lib/` after the redesign; only hit is the CSS word `landscape` inside a media query.

## 8. Self-test record

- Desktop 1440x900: 0 console errors, no sideways scroll (`scrollWidth === 1440`).
- Flick test (120 / 240 / 360px steps): every band holds, none skippable.
- Phone 375x812 (touch): hero collapses to one viewport, no video request, 0 errors.
- Reduced motion: hero static at `--p: 1`, reveals pinned, hold ring at 100%; flipping the preference back live re-arms the scrub.
- Footage path verified with a synthetic clip through `npm run hero:process`: blob load, ring, seeks, scrims over a harsh test pattern.
- Rack footage (2026-10-05): loop plays at rest (`loop-on`), pauses and fades on the first scroll step, resumes at the top; scrub clip seeks with scroll; node lands on the red light at `p = 1`; 0 page errors on desktop, phone and reduced motion.
