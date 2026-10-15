"use client";

import { hero2Media as heroMedia } from "@/lib/hero-2-media";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Symbol } from "../symbol";

/*
  The hero: a 480vh pinned region with a sticky stage. Scroll progress 0..1
  drives the footage (when it exists) and the drawn Line (always). Four caption
  bands live in the negative space either side of the center lane, each with its
  own entrance echoing what the Line is doing at that moment.

  Engineering standard (scrub-pipeline.md): Blob fetch behind an honest ring,
  dt-normalized lerp in a rAF loop that rests, gated seeks, delta-gated DOM
  writes, bands paced in scroll distance, five static-hero gates that match the
  CSS character for character, complete without the video.
*/

const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

type Band = { a: number; b: number; ramp: number };
const BANDS: Band[] = [
  { a: 0.0, b: 0.23, ramp: 0.05 },
  { a: 0.26, b: 0.49, ramp: 0.05 },
  { a: 0.52, b: 0.75, ramp: 0.05 },
  { a: 0.78, b: 1.0, ramp: 0.06 },
];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type SplitMode = "chars" | "words";

function HeroCtas() {
  return (
    <div className="cta">
      <Link href="/partner-portal/apply" className="btn btn-ink">
        Become a partner
        <span className="dot">
          <Symbol name="arrow_forward" className="text-[16px]" />
        </span>
      </Link>
      <Link href="#desk-work" className="btn btn-ghost">
        Explore Solutions
      </Link>
    </div>
  );
}

/* Split once, at render, with a seeded generator so the offsets are identical on every load. */
function Split({ text, mode, seed, spread = 0.5, jitter }: { text: string; mode: SplitMode; seed: number; spread?: number; jitter: (i: number, r: () => number) => Record<string, string> }) {
  const r = rng(seed);
  const words = text.split(" ");
  const totalChars = text.replace(/ /g, "").length;
  let ci = 0;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => {
          const style: Record<string, string> = mode === "words" ? { "--th": ((wi / words.length) * spread + r() * 0.04).toFixed(3), ...jitter(wi, r) } : {};
          return (
            <span key={wi}>
              <span className="w" style={style as React.CSSProperties}>
                {mode === "chars"
                  ? Array.from(w).map((ch, k) => {
                      const i = ci++;
                      const s: Record<string, string> = { "--th": ((i / totalChars) * spread + r() * 0.06).toFixed(3), ...jitter(i, r) };
                      return (
                        <span key={k} className={/[.,]/.test(ch) ? "c p" : "c"} style={s as React.CSSProperties}>
                          {ch}
                        </span>
                      );
                    })
                  : w}
              </span>
              {wi < words.length - 1 ? " " : null}
            </span>
          );
        })}
      </span>
    </>
  );
}

/*
  The drawn layer: the Rack. A wireframe of the row of racks from the footage,
  drawn by scroll progress, closing on one unit. It is the complete hero when
  the footage is missing, and with footage present only the marker survives:
  the crimson node and its halos, placed on the red status light of the final
  frame (public/hero/hero-ending.jpg). Both the video and this SVG are 16:9
  and cover the stage the same way, so the positions line up at every size.
*/
const NODE_X = 800;
const NODE_Y = 756;

function Vector() {
  // nine unit shelves on the rack face, drawn in from the center as the camera arrives
  const shelves = Array.from({ length: 9 }, (_, i) => 180 + i * 70);
  // six rack columns in perspective, the row the camera travels along
  const columns = Array.from({ length: 6 }, (_, i) => 560 + i * 170);
  return (
    <svg className="hero-vector" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="scene">
        <g className="grid">
          {columns.map((x, i) => (
            <rect key={x} className="col" pathLength={1} x={x} y={150 - i * 6} width="150" height={660 + i * 12} rx="4" fill="none" stroke="#7f8899" strokeOpacity={0.55 - i * 0.05} strokeWidth="1.2" style={{ "--th": (i * 0.045).toFixed(3) } as React.CSSProperties} />
          ))}
          {shelves.map((y, i) => (
            <line key={y} className="shelf" pathLength={1} x1="200" x2="1400" y1={y} y2={y} stroke="#7f8899" strokeOpacity="0.32" strokeWidth="1" style={{ "--th": (0.3 + 0.5 * (i / 8)).toFixed(3) } as React.CSSProperties} />
          ))}
          {shelves.map((y) => (
            <rect key={`l${y}`} className="led" x="1120" y={y - 22} width="22" height="4" rx="2" fill="#0b5fd9" />
          ))}
        </g>
        <path className="rail-line" pathLength={1} d={`M${NODE_X} 150 V ${NODE_Y - 14}`} fill="none" stroke="#bb001e" strokeWidth="2" strokeLinecap="round" />
        <circle className="halo-2" cx={NODE_X} cy={NODE_Y} r="56" fill="none" stroke="#bb001e" strokeWidth="1" />
        <circle className="halo" cx={NODE_X} cy={NODE_Y} r="30" fill="none" stroke="#bb001e" strokeWidth="1.5" />
        <circle className="node" cx={NODE_X} cy={NODE_Y} r="8" fill="#bb001e" />
      </g>
    </svg>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".hero-stage")!;
    const loop = root.querySelector<HTMLElement>(".hero-loop");
    const poster = root.querySelector<HTMLElement>(".hero-poster")!;
    const vector = root.querySelector<HTMLElement>(".hero-vector")!;
    const cue = root.querySelector<HTMLElement>(".hero-cue")!;
    const bandEls = Array.from(root.querySelectorAll<HTMLElement>(".band"));
    const washEls = Array.from(root.querySelectorAll<HTMLElement>(".hero-wash"));
    const cache = bandEls.map(() => ({ op: -1, k: -1, active: false }));

    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let lastP = -1;
    let heroOnScreen = true;
    let scrubOn = false;
    let inited = false;
    let loadK = 0;
    let loadStart = 0;
    let loadRaf: number | null = null;

    function heroProgress() {
      const rect = root!.getBoundingClientRect();
      const range = root!.offsetHeight - window.innerHeight;
      if (range <= 0) return 1;
      return clamp(-rect.top / range, 0, 1);
    }

    /* ---- the aerial stays up for the whole hero; scroll only moves the captions ---- */
    let loopReady = false;
    let loopShown = false;
    let loopAllowed = true; // false while the tab is hidden or the hero is off screen
    function setLoop(on: boolean) {
      if (!loop || !loopReady) return;
      if (on === loopShown) return;
      loopShown = on;
      stage.classList.toggle("loop-on", on);
      if (loop instanceof HTMLVideoElement) {
        if (on) loop.play().catch(() => {});
        else loop.pause();
      }
    }
    function updateLoop() {
      setLoop(loopAllowed);
    }
    if (loop && heroMedia.loop) {
      const markReady = () => {
        loopReady = true;
        stage.classList.add("loop-ready");
        updateLoop();
      };
      if (loop instanceof HTMLImageElement) {
        if (loop.complete && loop.naturalWidth > 0) markReady();
        else loop.addEventListener("load", markReady, { once: true });
        loop.addEventListener("error", () => {
          loopReady = false;
          stage.classList.remove("loop-on", "loop-ready");
        });
      } else if (loop instanceof HTMLVideoElement) {
        loop.addEventListener("canplay", markReady, { once: true });
        loop.addEventListener("error", () => {
          loopReady = false;
          stage.classList.remove("loop-on", "loop-ready");
        });
      }
    }
    const onVisibility = () => {
      loopAllowed = !document.hidden && heroOnScreen;
      updateLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    /* ---- captions and the Rack, delta-gated ---- */
    function updateCaptions(p: number) {
      if (Math.abs(p - lastP) > 0.0015) {
        lastP = p;
        vector.style.setProperty("--p", p.toFixed(4));
        cue.style.setProperty("--p", p.toFixed(3));
      }
      updateLoop();
      BANDS.forEach((band, i) => {
        const el = bandEls[i];
        const wash = washEls[i];
        const c = cache[i];
        const f = Math.min(0.02, (band.b - band.a) / 3);
        const easeIn = i === 0 ? 1 : smoothstep(p, band.a, band.a + f);
        const easeOut = i === BANDS.length - 1 ? 1 : 1 - smoothstep(p, band.b - f, band.b);
        const op = Math.round(easeIn * easeOut * 1000) / 1000;
        let k = clamp((p - band.a) / band.ramp, 0, 1);
        if (i === 0) k = Math.max(k, loadK);
        if (op !== c.op) {
          c.op = op;
          el.style.opacity = String(op);
          if (wash) wash.style.setProperty("--op", String(op));
        }
        if (Math.abs(k - c.k) > 0.008 || (k === 1 && c.k !== 1) || (k === 0 && c.k !== 0)) {
          c.k = k;
          el.style.setProperty("--k", k.toFixed(3));
          if (wash) wash.style.setProperty("--k", k.toFixed(3));
        }
        const active = op > 0.5;
        if (active !== c.active) {
          c.active = active;
          el.classList.toggle("active", active);
        }
      });
    }

    /* ---- the rAF loop that rests ---- */
    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      const kk = 0.16;
      shown += (target - shown) * (1 - Math.pow(1 - kk, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) {
        shown = target;
        rafId = null;
        lastTick = 0;
      } else {
        rafId = requestAnimationFrame(tick);
      }
      updateCaptions(shown);
    }
    function onScroll() {
      target = heroProgress();
      if (rafId === null && heroOnScreen) rafId = requestAnimationFrame(tick);
    }

    /* ---- band one's one-time load ramp, handing over to scroll ---- */
    function loadTick(now: number) {
      if (!loadStart) loadStart = now;
      const t = clamp((now - loadStart) / 1100, 0, 1);
      loadK = t * t * (3 - 2 * t);
      updateCaptions(shown);
      if (t < 1) loadRaf = requestAnimationFrame(loadTick);
      else loadRaf = null;
    }

    function initHeroOnce() {
      if (inited) return;
      inited = true;
      cue.classList.add("no-video");
      if (heroMedia.poster) poster.style.backgroundImage = `url('${heroMedia.poster}')`;
      if (loop instanceof HTMLVideoElement && heroMedia.loop) {
        loop.src = heroMedia.loop;
        loop.load();
      }
    }

    /* ---- the five gates, decided live ---- */
    function enableScrub() {
      if (scrubOn) return;
      scrubOn = true;
      initHeroOnce();
      window.addEventListener("scroll", onScroll, { passive: true });
      cache.forEach((c) => {
        c.op = -1;
        c.k = -1;
      });
      lastP = -1;
      if (loadK < 1 && loadRaf === null) loadRaf = requestAnimationFrame(loadTick);
      shown = target = heroProgress();
      updateCaptions(shown);
      onScroll();
    }
    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (loadRaf !== null) {
        cancelAnimationFrame(loadRaf);
        loadRaf = null;
      }
      vector.style.removeProperty("--p");
      setLoop(false);
      bandEls.forEach((el) => {
        el.style.removeProperty("opacity");
        el.style.removeProperty("--k");
        el.classList.remove("active");
      });
      washEls.forEach((el) => {
        el.style.removeProperty("--op");
        el.style.removeProperty("--k");
      });
    }
    function applyHeroMode() {
      if (GATES.some((q) => window.matchMedia(q).matches)) disableScrub();
      else enableScrub();
    }
    const MQLS = GATES.map((q) => window.matchMedia(q));
    MQLS.forEach((m) => m.addEventListener("change", applyHeroMode));

    const io = new IntersectionObserver(
      (entries) => {
        heroOnScreen = entries[0]?.isIntersecting ?? true;
        loopAllowed = !document.hidden && heroOnScreen;
        if (scrubOn) updateLoop();
        if (heroOnScreen && scrubOn) onScroll();
      },
      { threshold: 0 },
    );
    io.observe(root);

    applyHeroMode();
    window.addEventListener("resize", onScroll);

    return () => {
      disableScrub();
      MQLS.forEach((m) => m.removeEventListener("change", applyHeroMode));
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return (
    <section className="hero hero-aerial" ref={section} aria-label="Introduction">
      <div className={heroMedia.ending ? "hero-stage has-static" : "hero-stage"}>
        <div className="hero-media" aria-hidden="true">
          <div className="hero-poster" />
          {heroMedia.ending ? <div className="hero-static" style={{ backgroundImage: `url('${heroMedia.ending}')` }} aria-hidden="true" /> : null}
          {heroMedia.loop ? <video className="hero-loop" preload="none" muted loop playsInline aria-hidden="true" tabIndex={-1} /> : null}
          <Vector />
        </div>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-washes" aria-hidden="true">
          <div className="hero-wash hero-wash-left" data-band="0" />
          <div className="hero-wash hero-wash-right" data-band="1" />
          <div className="hero-wash hero-wash-left" data-band="2" />
          <div className="hero-wash hero-wash-settle" data-band="3" />
        </div>
        {/* Band 1: the bench. The threads at the top interleave, so the words weave in. */}
        <div className="band band-left fx-weave" data-band="0">
          <span className="kicker">
            <i /> 01 / The bench
          </span>
          <p className="headline">
            <Split text="Fifty global brands. One desk in Colombo." mode="chars" seed={11} spread={0.5} jitter={(i) => ({ "--jy": `${i % 2 ? 18 : -18}px` })} />
          </p>
          <p className="sub">Dell, Cisco, HPE, Lenovo, Fortinet and APC, stocked and allocated from Thimbirigasyaya Road.</p>
          <HeroCtas />
        </div>

        {/* Band 2: the portal. The threads lock into one line, so the characters snap into their grid. */}
        <div className="band band-right fx-snap" data-band="1">
          <span className="kicker">
            02 / The portal <i />
          </span>
          <p className="headline">
            <Split text="Stock checked. Credit cleared. Serial verified." mode="chars" seed={23} spread={0.5} jitter={() => ({ "--jx": "26px" })} />
          </p>
          <p className="sub">One login shows what is on the shelf, what your credit line covers, and where the box is right now.</p>
          <HeroCtas />
        </div>

        {/* Band 3: the island. The line descends through the provinces, so the words drift down into place. */}
        <div className="band band-left fx-drift" data-band="2">
          <span className="kicker">
            <i /> 03 / The island
          </span>
          <p className="headline">
            <Split text="Every province." mode="words" seed={37} spread={0.45} jitter={() => ({})} />
            <br />
            <Split text="24 to 48 hours." mode="words" seed={38} spread={0.45} jitter={() => ({})} />
          </p>
          <p className="sub">Regional hubs and channel managers move hardware from Colombo to your door, in every province.</p>
          <HeroCtas />
        </div>

        {/* Band 4: the settle. The line arrives at rest, so the words rise and stay. */}
        <div className="band band-settle fx-rise" data-band="3">
          <span className="kicker">
            <i /> VS One / ICT distribution <i />
          </span>
          <h1>
            <Split text="Enterprise hardware," mode="words" seed={41} spread={0.4} jitter={() => ({})} />
            <br />
            <Split text="allocated to you." mode="words" seed={42} spread={0.4} jitter={() => ({})} />
          </h1>
          <p className="sub">VS One supplies 200+ Sri Lankan partners with enterprise compute, networking and datacenter hardware through the island&apos;s first ERP partner portal.</p>
          <HeroCtas />
        </div>

        <div className="hero-cue" aria-hidden="true">
          <svg className="ring" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="126" style={{ strokeDashoffset: 126 }} />
          </svg>
          <span className="chev" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}
