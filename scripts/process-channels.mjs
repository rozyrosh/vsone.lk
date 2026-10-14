#!/usr/bin/env node
/*
  Channels laptop scrub pipeline.

  Usage:
    npm run channels:process
    npm run channels:process -- path/to.mp4

  Encodes Freepik laptop footage for scroll scrubbing (GOP 8), writes poster /
  ending stills, and refreshes lib/channels-media.ts.
*/
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, process.argv[2] || "review/channels-laptop-raw.mp4");
const outDir = join(root, "public", "channels");
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
  console.error("ffmpeg not found. Install with: winget install Gyan.FFmpeg");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
mkdirSync(reviewDir, { recursive: true });

const scrub = join(outDir, "laptop-scrub.mp4");
const poster = join(outDir, "laptop-poster.jpg");
const ending = join(outDir, "laptop-ending.jpg");

console.log(`ffmpeg: ${ffmpeg}`);
console.log(`input:  ${input}`);

run(ffmpeg, [
  "-y", "-i", input,
  "-an",
  "-c:v", "libx264",
  "-g", "8", "-keyint_min", "8", "-sc_threshold", "0",
  "-crf", "20", "-preset", "medium",
  "-pix_fmt", "yuv420p",
  "-vf", "scale='min(1600,iw)':-2",
  "-movflags", "+faststart",
  scrub,
]);

const duration = probeDuration(ffmpeg, scrub);
console.log(`duration: ${duration.toFixed(2)}s`);

const JPEG = ["-pix_fmt", "yuvj420p", "-strict", "unofficial", "-q:v", "2", "-update", "1"];
run(ffmpeg, ["-y", "-i", scrub, "-frames:v", "1", ...JPEG, poster]);
run(ffmpeg, ["-y", "-sseof", "-0.3", "-i", scrub, ...JPEG, ending]);

const marks = [0, 0.08, 0.24, 0.4, 0.56, 0.72, 0.88, 1];
marks.forEach((m, i) => {
  const t = Math.max(0, Math.min(duration - 0.12, duration * m));
  run(ffmpeg, [
    "-y", "-ss", t.toFixed(3), "-i", scrub, "-frames:v", "1", ...JPEG,
    join(reviewDir, `channels-frame-${String(i).padStart(2, "0")}.jpg`),
  ]);
});

const bytes = statSync(scrub).size;
const config = `/*
  Channels laptop scrub, sourced from Freepik and processed with \`npm run channels:process\`.
  Generated ${new Date().toISOString()}.
*/
export const channelsMedia = {
  video: "/channels/laptop-scrub.mp4",
  bytes: ${bytes},
  poster: "/channels/laptop-poster.jpg",
  ending: "/channels/laptop-ending.jpg",
};
`;
writeFileSync(join(root, "lib", "channels-media.ts"), config);

console.log(`\nscrub:  public/channels/laptop-scrub.mp4 (${(bytes / 1024 / 1024).toFixed(2)} MB)`);
console.log("poster: public/channels/laptop-poster.jpg");
console.log("ending: public/channels/laptop-ending.jpg");
console.log("config: lib/channels-media.ts");
