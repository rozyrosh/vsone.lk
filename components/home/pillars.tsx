"use client";

import { pillars } from "@/lib/content";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Symbol } from "../symbol";
import { GLSLHills } from "../ui/glsl-hills";
import { VerticalCutRevealChars } from "../ui/m-vertical-cut-reveal-2";

/*
  What the desk does: a perspective tunnel. Scroll flies the camera forward
  and each pillar's details appear in the mouth, one at a time.
*/

const pillarAccent: Record<string, string> = {
  "Many brands, one catalog": "catalog",
  "Doorstep delivery, every province": "every",
  "Engineers beside the bid": "Engineers",
  "Online stores for partners": "stores",
  "Repair under a written SLA": "SLA",
  "Credit shaped to the account": "Credit",
};

const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

type Band = { a: number; b: number; ramp: number };
const BANDS: Band[] = [
  { a: 0.12, b: 0.25, ramp: 0.06 },
  { a: 0.27, b: 0.4, ramp: 0.06 },
  { a: 0.42, b: 0.55, ramp: 0.06 },
  { a: 0.57, b: 0.7, ramp: 0.06 },
  { a: 0.72, b: 0.85, ramp: 0.06 },
  { a: 0.87, b: 1, ramp: 0.06 },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function Pillars() {
  const section = useRef<HTMLElement>(null);

  function scrollDown() {
    const root = section.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = reduced ? "auto" : "smooth";
    const stage = root.querySelector(".pi-stage");
    const range = root.offsetHeight - window.innerHeight;
    if (stage?.classList.contains("is-static") || range <= 8) {
      const list = root.nextElementSibling;
      if (list instanceof HTMLElement) list.scrollIntoView({ behavior, block: "start" });
      return;
    }
    const top = window.scrollY + root.getBoundingClientRect().top + range * 0.18;
    window.scrollTo({ top, behavior });
  }

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".pi-stage")!;
    const intro = root.querySelector<HTMLElement>(".pi-intro")!;
    const bandEls = Array.from(root.querySelectorAll<HTMLElement>(".pi-band"));
    const cache = bandEls.map(() => ({ op: -1, k: -1, active: false }));

    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let lastP = -1;
    let onScreen = true;
    let scrubOn = false;
    let introOn = false;

    function progress() {
      const rect = root!.getBoundingClientRect();
      const range = root!.offsetHeight - window.innerHeight;
      if (range <= 0) return 1;
      return clamp(-rect.top / range, 0, 1);
    }

    function updateCaptions(p: number) {
      if (Math.abs(p - lastP) > 0.0015) {
        lastP = p;
        stage.style.setProperty("--p", p.toFixed(4));
      }
      const stageRect = stage.getBoundingClientRect();
      const reached = stageRect.top <= 72 && stageRect.bottom >= window.innerHeight * 0.6;
      const showIntro = reached && p < 0.1;
      if (showIntro !== introOn) {
        introOn = showIntro;
        intro.classList.remove("is-on");
        if (showIntro) {
          void intro.offsetWidth;
          intro.classList.add("is-on");
        }
      }
      BANDS.forEach((band, i) => {
        const el = bandEls[i];
        const c = cache[i];
        const f = Math.min(0.018, (band.b - band.a) / 3);
        const easeIn = smoothstep(p, band.a, band.a + f);
        const easeOut = i === BANDS.length - 1 ? 1 : 1 - smoothstep(p, band.b - f, band.b);
        const op = Math.round(easeIn * easeOut * 1000) / 1000;
        const k = clamp((p - band.a) / band.ramp, 0, 1);
        if (op !== c.op) {
          c.op = op;
          el.style.opacity = String(op);
        }
        if (Math.abs(k - c.k) > 0.008) {
          c.k = k;
          el.style.setProperty("--k", k.toFixed(3));
        }
        const active = op > 0.08;
        if (active !== c.active) {
          c.active = active;
          el.classList.toggle("active", active);
        }
      });
    }

    function onScroll() {
      target = progress();
    }

    function tick(now: number) {
      rafId = requestAnimationFrame(tick);
      if (!scrubOn) return;
      const dt = lastTick ? Math.min(40, now - lastTick) / 16.67 : 1;
      lastTick = now;
      if (!onScreen && Math.abs(target - shown) < 0.0004) return;
      shown += (target - shown) * Math.min(1, 0.16 * dt);
      if (Math.abs(target - shown) < 0.00035) shown = target;
      updateCaptions(shown);
    }

    function enableScrub() {
      if (scrubOn) return;
      scrubOn = true;
      stage.classList.remove("is-static");
      cache.forEach((c) => {
        c.op = -1;
        c.k = -1;
        c.active = false;
      });
      onScroll();
      shown = target;
      updateCaptions(shown);
      if (rafId == null) {
        lastTick = 0;
        rafId = requestAnimationFrame(tick);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    function disableScrub() {
      if (!scrubOn) return;
      scrubOn = false;
      window.removeEventListener("scroll", onScroll);
      if (rafId != null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      stage.classList.add("is-static");
      stage.style.setProperty("--p", "0");
      bandEls.forEach((el, i) => {
        el.style.opacity = i === 0 ? "1" : "0";
        el.style.setProperty("--k", i === 0 ? "1" : "0");
        el.classList.toggle("active", i === 0);
      });
    }

    const MQLS = GATES.map((q) => window.matchMedia(q));
    function applyMode() {
      if (MQLS.some((m) => m.matches)) disableScrub();
      else enableScrub();
    }
    MQLS.forEach((m) => m.addEventListener("change", applyMode));

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? true;
        if (onScreen && scrubOn) onScroll();
      },
      { threshold: 0 },
    );
    io.observe(root);

    applyMode();
    window.addEventListener("resize", onScroll);

    return () => {
      disableScrub();
      MQLS.forEach((m) => m.removeEventListener("change", applyMode));
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <section ref={section} id="desk-work" data-stop className="pi-scrub" aria-label="Services">
        <div className="pi-stage">
          <div className="pi-hills" aria-hidden="true">
            <GLSLHills />
          </div>
          <header className="pi-intro">
            <p className="kicker">
              <i /> Services
            </p>
            <h2 className="pi-headline">
              <VerticalCutRevealChars text="Six services from one desk." accent="desk" />
            </h2>
            <p className="pi-lead">
              <VerticalCutRevealChars text="Catalog, delivery, engineering, stores, warranty, and credit. Each one runs from Colombo." baseDelay={420} />
            </p>
            <button type="button" className="pi-down" aria-label="Scroll down" onClick={scrollDown}>
              <Symbol name="arrow_downward" className="text-[22px]" />
            </button>
          </header>

          {pillars.map((item, i) => (
            <div key={item.title} className="band pi-band" data-band={i}>
              <p className="kicker">
                <i />
                {String(i + 1).padStart(2, "0")} / {item.tag}
              </p>
              <p className="headline">
                <VerticalCutRevealChars text={item.title} accent={pillarAccent[item.title]} />
              </p>
              <p className="sub">
                <VerticalCutRevealChars text={item.description} baseDelay={380} />
              </p>
              <div className="cta">
                <Link href={item.href} className="btn btn-ink">
                  {item.link}
                  <span className="dot">
                    <Symbol name="arrow_forward" className="text-[16px]" />
                  </span>
                </Link>
              </div>
            </div>
          ))}

        </div>
      </section>

      <section className="pi-static-list reveal" aria-label="Services list">
        <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-space-2xl border-t border-hairline">
            {pillars.map((item, i) => (
              <li key={item.title} className="part border-b border-hairline" style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} className="row-link group flex items-start gap-space-md py-space-md pl-0 pr-space-sm rounded-[10px]">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-outline pt-1.5 w-7 shrink-0">0{i + 1}</span>
                  <span className="w-10 h-10 rounded-[12px] bg-mist border border-hairline flex items-center justify-center text-graphite shrink-0">
                    <Symbol name={item.icon} className="text-[20px]" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-label-md text-label-md font-semibold text-crimson">{item.tag}</span>
                    <span className="block font-display text-[20px] font-bold tracking-tight text-graphite mt-1">{item.title}</span>
                    <span className="block font-body-sm text-body-sm text-steel mt-1">{item.description}</span>
                  </span>
                  <Symbol name="arrow_forward" className="text-[18px] text-crimson pt-1.5 opacity-0 -translate-x-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
