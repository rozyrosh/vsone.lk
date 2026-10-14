#!/usr/bin/env node
/*
  Pillars desk-story scrub pipeline.

  Usage:
    npm run pillars:process
    npm run pillars:process -- path/to.mp4
*/
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, process.argv[2] || "review/pillars-desk-raw.mp4");
const outDir = join(root, "public", "pillars");
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
  console.error(`No clip at ${input}`);
  process.exit(1);
}

const ffmpeg = findFfmpeg();
if (!ffmpeg) {
  console.error("ffmpeg not found");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(reviewDir, { recursive: true });

const scrub = join(outDir, "desk-scrub.mp4");
const poster = join(outDir, "desk-poster.jpg");
const ending = join(outDir, "desk-ending.jpg");

console.log(`ffmpeg: ${ffmpeg}`);
console.log(`input:  ${input}`);

// Pad onto pure white, scale, scrub encode
run(ffmpeg, [
  "-y", "-i", input,
  "-an",
  "-vf", "scale=1600:-2:force_original_aspect_ratio=decrease,pad=1600:900:(ow-iw)/2:(oh-ih)/2:white,setsar=1",
  "-c:v", "libx264",
  "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
  "-crf", "20", "-preset", "medium",
  "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  scrub,
]);

const duration = probeDuration(ffmpeg, scrub);
console.log(`duration: ${duration.toFixed(2)}s`);

const JPEG = ["-pix_fmt", "yuvj420p", "-strict", "unofficial", "-q:v", "2", "-update", "1"];
run(ffmpeg, ["-y", "-i", scrub, "-frames:v", "1", ...JPEG, poster]);
run(ffmpeg, ["-y", "-sseof", "-0.3", "-i", scrub, ...JPEG, ending]);

const marks = [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1];
marks.forEach((m, i) => {
  const t = Math.max(0, Math.min(duration - 0.12, duration * m));
  run(ffmpeg, [
    "-y", "-ss", t.toFixed(3), "-i", scrub, "-frames:v", "1", ...JPEG,
    join(reviewDir, `pillars-frame-${String(i).padStart(2, "0")}.jpg`),
  ]);
});

const bytes = statSync(scrub).size;
writeFileSync(
  join(root, "lib", "pillars-media.ts"),
  `/*
  Desk pillars story scrub, Freepik Magnific + \`npm run pillars:process\`.
  Generated ${new Date().toISOString()}.
*/
export const pillarsMedia = {
  video: "/pillars/desk-scrub.mp4",
  bytes: ${bytes},
  poster: "/pillars/desk-poster.jpg",
  ending: "/pillars/desk-ending.jpg",
};
`,
);

console.log(`\nscrub:  public/pillars/desk-scrub.mp4 (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
console.log("config: lib/pillars-media.ts");
