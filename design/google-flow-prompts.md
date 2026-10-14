# Hero footage in Google Flow

Status: the hero currently ships with two clips generated through the Freepik MCP (see `design-package.md`, "Footage"). This document is the recipe for re-rolling either clip in Google Flow if you want a different take. Same concept, same laws. Drop the results at `review/hero-raw.mp4` (the scroll clip) and `review/hero-loop-raw.mp4` (the rest loop) and run `npm run hero:process` to swap them in.

The Rack also draws itself in SVG as you scroll, so the hero stays complete if the footage is ever removed. The recipe is written for Google Flow (labs.google/fx/tools/flow) using Nano Banana for the start frame and Veo 3.1 for the clips.

Flow has no API that this project can call, so the loop is: you generate in Flow, drop the files in `review/`, run `npm run hero:process`, reload. The script does the rest.

## The concept the footage must match

**The Rack.** A white datacenter aisle. Rows of white server racks, white floor, soft daylight, and on every unit a small flat electric-blue status light. One unit, and only one, carries a red light: the unit that was just allocated. No people, no cables in view, no dark panels, no lettering.

Two clips share the hero:

- **The loop** plays before anyone scrolls. Locked camera, nothing moves except the lights, which breathe and occasionally blink. It is played forward then backward (ping-pong) so there is no seam. It must have no camera motion at all, or the reversal will show.
- **The scroll clip** is scrubbed by the scrollbar. One slow push-in down the aisle; the racks slide past; the shot settles on a single rack face, a grid of blue lights with one red one near the lower center. It ends at rest.

Why this shape: scrolling down must read as moving forward into the room (law 1), one subject on one continuous motion (law 2), the left and right thirds stay calm at the start and the frame is a steady grid at the end so the words have a place to sit (law 7). The ending is a composed arrival (law 4): the red light, surrounded by calm blue ones, with room above it for the headline.

Palette law: white, blue, red. Red and blue never blend into each other. If a frame shows purple, violet, magenta, or a red glow washing into a blue one, re-roll.

## Step 1. Start frame (Nano Banana, 16:9)

In Flow: new project, set the image model to Nano Banana (or Imagen if that is what the project offers), aspect ratio 16:9. Paste:

```
A wide photograph down the center aisle of a pristine white datacenter. Two
rows of tall white server racks recede toward a soft white wall of daylight at
the far end. Every rack unit has one small flat electric blue status light, a
clean rectangle of light with no glow bloom. On one unit in the right-hand row,
at about the lower third of the frame, a single small flat red light, the only
red in the picture. Matte white floor, white ceiling, soft even studio light,
no shadows deeper than pale grey. No people, no visible cables, no screens, no
dark panels, no text, no logos, no lettering anywhere. The left third of the
frame is a calm white rack face. Photoreal, product photography, 16:9.
```

Pick the result where the aisle runs straight to the center, the blue lights are flat (not glowing halos), and the red light is small and alone. Download it as PNG. Reject anything with purple or magenta light, dark racks, lettering on the units, or more than one red light.

## Step 2a. The scroll clip (Veo 3.1, Frames to Video, first frame only, 6 seconds, 16:9)

In Flow: switch to video, choose **Frames to Video**, upload the PNG from step 1 as the first frame, model Veo 3.1 (Quality for the final take, Fast for test rolls), 1080p, 6 seconds, 16:9, no audio needed. Paste:

```
One continuous shot, no cuts. The camera moves slowly and smoothly forward down
the center aisle of the white datacenter at a constant walking pace, as if on a
dolly. White server racks slide past on both sides, their small flat electric
blue status lights steady. The camera gently turns toward the right-hand row and
settles, coming to a complete stop facing one rack face straight on: a clean
grid of white units with flat blue lights, and one small flat red light just
below the center of the frame. The last second is completely still. Nothing
else moves: no people, no cables, no flicker. Soft even daylight, white floor,
white ceiling. No text, no logos, no lettering anywhere.
```

### What to check before downloading

- The camera moves **forward** and then **stops**. If it pulls back, drifts up, or is still moving on the last frame, re-roll.
- The left third is calm for the first second. That is where the first caption sits.
- The final frame is a steady grid with one red light somewhere in the lower middle. Note its position; you will set it in the code (below).
- No lettering, no logo-like marks. Veo likes to invent them on rack doors.
- No purple. Red and blue stay apart.

Download at 1080p. Save it as `review/hero-raw.mp4`.

## Step 2b. The rest loop (Veo 3.1, Frames to Video, first frame only, 5 seconds, 16:9)

Same first frame. Paste:

```
Locked camera, no camera movement whatsoever, no zoom, no drift. A still
photograph of the white datacenter aisle in which only the small flat electric
blue status lights move: a slow, calm breathing of brightness across the racks,
one or two lights blinking softly now and then. The single small red light
stays steady. Soft even daylight, no flicker, no people, no cables, no text,
no logos, no lettering anywhere. Photoreal.
```

### What to check

- Play it twice. If the camera moved even slightly, re-roll; the ping-pong will show it.
- Lights only. No people, no reflections sweeping across the floor.

Save it as `review/hero-loop-raw.mp4`.

## Step 3. Process

```
npm run hero:process
```

The script finds ffmpeg (PATH or the winget Gyan.FFmpeg install), then:

1. re-encodes the scroll clip to `public/hero/hero-scrub.mp4` with a keyframe every 8 frames, no audio, faststart, so scrubbing is smooth in Chrome;
2. builds `public/hero/hero-loop.mp4` from the loop clip as forward + reverse so it cycles with no seam;
3. writes `public/hero/hero-poster.jpg` (first frame) and `public/hero/hero-ending.jpg` (last frame, used by the static hero on phones);
4. writes eight review frames to `review/` at the band boundaries (p = 0, .23, .26, .49, .52, .75, .78, 1) so you can see what sits behind each caption;
5. rewrites `lib/hero-media.ts` with the paths and the byte size.

Reload the home page. The loop plays at the top; the first scroll step fades it out and the scrub takes over. If a clip is wrong, delete `public/hero/` and set the fields in `lib/hero-media.ts` back to empty strings and `0`; the vector hero is complete on its own.

## Step 4. Put the node on the red light

Open `review/frame-07-p1.00.jpg` (the ending frame). Find the red light and read its position as a fraction of the frame width and height. In `components/home/hero.tsx` set:

```ts
const NODE_X = Math.round(1600 * fractionAcross);
const NODE_Y = Math.round(900 * fractionDown);
```

The SVG uses a 1600x900 viewBox with `xMidYMid slice`, the same crop the video uses, so the node lands on the light at every viewport size.

## Step 5. Legibility check on the worst frame

Open the review frames. For each band, look at the frame where the footage is busiest under the words:

| Band | Frames | Words sit |
| --- | --- | --- |
| 1 | p00, p23 | left third |
| 2 | p26, p49 | right third |
| 3 | p52, p75 | left third |
| 4 | p78, p1.00 | center, lower half |

The bands currently carry no scrim; the words sit directly on the white racks. If a new clip puts a dense grid of lights or anything darker under a caption lane, prefer re-rolling the clip over adding a scrim back. If you must, add a `.band::before` radial of `--canvas` in `app/globals.css` with its opacity tied to the band's `--k`.

## If you want a longer journey (12 to 18 seconds)

Generate the first 6 seconds as above, but end the prompt still moving down the aisle instead of at rest. Extract the last frame as a full-quality PNG (`ffmpeg -sseof -0.1 -i review/hero-raw-1.mp4 -update 1 -frames:v 1 review/last.png`), use it as the **first frame** of the next Frames to Video run with a prompt that continues the same push at the same speed, and give only the final segment the composed stop on the rack face. Join the raw segments with a single encode:

```
ffmpeg -i review/seg1.mp4 -i review/seg2.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1:a=0[v]" -map "[v]" -an -c:v libx264 -g 8 -keyint_min 8 -sc_threshold 0 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart review/hero-raw.mp4
```

Then run `npm run hero:process` on the joined file.
