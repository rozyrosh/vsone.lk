#!/usr/bin/env node
/*
  Hero footage pipeline.

  Usage:
    npm run hero:process                 (reads review/hero-raw.mp4)
    npm run hero:process -- path/to.mp4  (any raw clip from Google Flow)

  What it does:
    1. Finds ffmpeg (PATH, then the winget Gyan.FFmpeg install).
    2. Re-encodes the clip for scrubbing: a keyframe every 8 frames, no audio,
       faststart, yuv420p, crf 18. Output: public/hero/hero-scrub.mp4
    3. Extracts the first frame to public/hero/hero-poster.jpg and the last
       frame to public/hero/hero-ending.jpg (the static hero uses the ending).
    4. Writes six review frames to review/ so the clip can be checked against
       the band map before it ships.
    5. Rewrites lib/hero-media.ts with the paths and the real byte size.

  The site works without any of this. Until the script runs the hero draws
  the Line in SVG and stays complete on its own.
*/
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const loopFlag = args.indexOf("--loop");
const loopArg = loopFlag >= 0 ? args.splice(loopFlag, 2)[1] : null;
const input = resolve(root, args[0] || "review/hero-raw.mp4");
// the ambient loop clip is optional: pass --loop <file>, or drop review/hero-loop-raw.mp4
const loopInput = resolve(root, loopArg || "review/hero-loop-raw.mp4");
const outDir = join(root, "public", "hero");
const reviewDir = join(root, "review");

function findFfmpeg() {
  const onPath = spawnSync(process.platform === "win32" ? "where" : "which", ["ffmpeg"], { encoding: "utf8" });
  if (onPath.status === 0) return onPath.stdout.split(/\r?\n/).find(Boolean).trim();

  const local = process.env.LOCALAPPDATA;
  if (local) {
    const pkgRoot = join(local, "Microsoft", "WinGet", "Packages");
    if (existsSync(pkgRoot)) {
      for (const pkg of readdirSync(pkgRoot)) {
        if (!pkg.startsWith("Gyan.FFmpeg")) continue;
        const found = walk(join(pkgRoot, pkg), "ffmpeg.exe", 3);
        if (found) return found;
      }
    }
  }
  return null;
}

function walk(dir, name, depth) {
  if (depth < 0) return null;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isFile() && entry.name === name) return p;
    if (entry.isDirectory()) {
      const hit = walk(p, name, depth - 1);
      if (hit) return hit;
    }
  }
  return null;
}

function run(bin, args) {
  const r = spawnSync(bin, args, { stdio: ["ignore", "inherit", "inherit"] });
  if (r.status !== 0) {
    console.error(`\nffmpeg exited with ${r.status}: ${args.join(" ")}`);
    process.exit(r.status || 1);
  }
}

function probeDuration(ffmpeg, file) {
  const ffprobe = ffmpeg.replace(/ffmpeg(\.exe)?$/i, (m) => m.replace("ffmpeg", "ffprobe"));
  if (existsSync(ffprobe)) {
    const r = spawnSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
    const d = parseFloat(r.stdout);
    if (!Number.isNaN(d)) return d;
  }
  const r = spawnSync(ffmpeg, ["-i", file], { encoding: "utf8" });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr || "");
  return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
}

if (!existsSync(input)) {
  console.error(`No clip at ${input}\nDrop the Google Flow export at review/hero-raw.mp4 or pass a path.`);
  process.exit(1);
}

const ffmpeg = findFfmpeg();
if (!ffmpeg) {
  console.error("ffmpeg not found. Install with: winget install Gyan.FFmpeg");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(reviewDir, { recursive: true });

const scrub = join(outDir, "hero-scrub.mp4");
const poster = join(outDir, "hero-poster.jpg");
const ending = join(outDir, "hero-ending.jpg");

console.log(`ffmpeg: ${ffmpeg}`);
console.log(`input:  ${input}`);

// 1. scrub encode
run(ffmpeg, [
  "-y", "-i", input,
  "-an",
  "-c:v", "libx264",
  "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
  "-crf", "18", "-preset", "slow",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1920,iw)':-2",
  "-movflags", "+faststart",
  scrub,
]);

const duration = probeDuration(ffmpeg, scrub);
console.log(`duration: ${duration.toFixed(2)}s`);

// 2. poster (first frame) and ending (last frame)
// full-range yuv keeps newer ffmpeg builds from refusing the mjpeg encoder
const JPEG = ["-pix_fmt", "yuvj420p", "-strict", "unofficial", "-q:v", "2", "-update", "1"];
run(ffmpeg, ["-y", "-i", scrub, "-frames:v", "1", ...JPEG, poster]);
// no frame cap here: with -update every decoded frame overwrites the file, so the last one wins
run(ffmpeg, ["-y", "-sseof", "-0.3", "-i", scrub, ...JPEG, ending]);

// 3. review frames at the band boundaries (0, .23, .26, .49, .52, .75, .78, 1)
const marks = [0, 0.23, 0.26, 0.49, 0.52, 0.75, 0.78, 1];
marks.forEach((m, i) => {
  const t = Math.max(0, Math.min(duration - 0.15, duration * m));
  run(ffmpeg, ["-y", "-ss", t.toFixed(3), "-i", scrub, "-frames:v", "1", ...JPEG, join(reviewDir, `frame-${String(i).padStart(2, "0")}-p${m.toFixed(2).replace("0.", "")}.jpg`)]);
});

// 4. the ambient loop: forward then reversed, encoded once, so the seam disappears
const loopOut = join(outDir, "hero-loop.mp4");
let hasLoop = false;
if (existsSync(loopInput)) {
  run(ffmpeg, [
    "-y", "-i", loopInput,
    "-an",
    "-filter_complex", "[0:v]scale='min(1920,iw)':-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]",
    "-map", "[v]",
    "-c:v", "libx264", "-g", "48", "-crf", "21", "-preset", "slow",
    "-movflags", "+faststart",
    loopOut,
  ]);
  hasLoop = true;
} else {
  console.log(`no loop clip at ${loopInput} (optional; pass --loop <file>)`);
}

// 5. write the media config
const bytes = statSync(scrub).size;
const config = `/*
  Hero footage, generated through the Freepik MCP and processed with \`npm run hero:process\`.
  Generated ${new Date().toISOString()}. Re-run the script to refresh.
*/
export const heroMedia = {
  video: "/hero/hero-scrub.mp4",
  bytes: ${bytes},
  loop: ${hasLoop ? '"/hero/hero-loop.mp4"' : '""'},
  poster: "/hero/hero-poster.jpg",
  ending: "/hero/hero-ending.jpg",
};
`;
writeFileSync(join(root, "lib", "hero-media.ts"), config);

console.log(`\nscrub:   public/hero/hero-scrub.mp4 (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
if (hasLoop) console.log(`loop:    public/hero/hero-loop.mp4 (${(statSync(loopOut).size / 1024 / 1024).toFixed(2)} MB)`);
console.log("poster:  public/hero/hero-poster.jpg");
console.log("ending:  public/hero/hero-ending.jpg");
console.log("review:  review/frame-*.jpg");
console.log("config:  lib/hero-media.ts updated");
if (bytes > 12 * 1024 * 1024) console.log("\nNote: the scrub file is above 12 MB. Consider a shorter clip or a 1600px width.");
