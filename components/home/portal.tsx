"use client";

import { portalSteps } from "@/lib/content";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Symbol } from "../symbol";

/*
  The one interactive moment. The brand's single idea is allocation: stock
  assigned to a partner. The visitor performs it. Press and hold; a ring fills;
  release early and it eases back; complete it and the four portal steps light
  in sequence and the dispatch chip arrives. Reduced motion gets the finished
  state without holding.
*/
export function Portal() {
  const hold = useRef<HTMLButtonElement>(null);
  const [done, setDone] = useState(false);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const btn = hold.current;
    if (!btn) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setDone(true);
      setLit(portalSteps.length);
      btn.style.setProperty("--h", "1");
      return;
    }

    let h = 0;
    let holding = false;
    let raf: number | null = null;
    let last = 0;
    let finished = false;
    const timers: number[] = [];
    const DURATION = 1500;

    function frame(now: number) {
      const dt = Math.min(64, now - (last || now));
      last = now;
      if (holding) h = Math.min(1, h + dt / DURATION);
      else h = Math.max(0, h - dt / (DURATION * 0.55));
      btn!.style.setProperty("--h", h.toFixed(3));
      if (holding && h >= 1 && !finished) {
        finished = true;
        holding = false;
        complete();
      }
      if ((holding && h < 1) || (!holding && h > 0 && !finished)) raf = requestAnimationFrame(frame);
      else {
        raf = null;
        last = 0;
      }
    }
    function kick() {
      if (raf === null) raf = requestAnimationFrame(frame);
    }
    function complete() {
      setDone(true);
      portalSteps.forEach((_, i) => {
        timers.push(window.setTimeout(() => setLit(i + 1), 160 + i * 260));
      });
    }
    function down(e: PointerEvent | KeyboardEvent) {
      if (finished) return;
      if (e instanceof KeyboardEvent && e.key !== " " && e.key !== "Enter") return;
      if (e instanceof KeyboardEvent && e.repeat) return;
      e.preventDefault();
      holding = true;
      kick();
    }
    function up() {
      holding = false;
      kick();
    }
    function reset() {
      if (!finished) return;
      finished = false;
      h = 0;
      btn!.style.setProperty("--h", "0");
      setDone(false);
      setLit(0);
    }

    btn.addEventListener("pointerdown", down);
    btn.addEventListener("keydown", down);
    btn.addEventListener("keyup", up);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    btn.addEventListener("dblclick", reset);

    return () => {
      btn.removeEventListener("pointerdown", down);
      btn.removeEventListener("keydown", down);
      btn.removeEventListener("keyup", up);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      btn.removeEventListener("dblclick", reset);
      if (raf !== null) cancelAnimationFrame(raf);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <section id="portal" data-stop className="relative py-space-4xl reveal">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="panel overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-space-lg lg:p-space-2xl flex flex-col justify-between gap-space-xl bg-mist/60 border-b lg:border-b-0 lg:border-r border-hairline">
            <div>
              <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
                <i /> How allocation works
              </p>
              <h2 className="display part text-headline-lg-mobile lg:text-[40px] lg:leading-[1.04] mt-space-sm max-w-[16ch]" style={{ "--i": 1 } as React.CSSProperties}>
                Hold to allocate a unit.
              </h2>
              <p className="part font-body-md text-body-md text-steel mt-space-md max-w-[42ch]" style={{ "--i": 2 } as React.CSSProperties}>
                This is what happens inside the portal every time a partner places an order. Press and hold the button to run it.
              </p>
            </div>
            <div className="part flex items-center gap-space-lg" style={{ "--i": 3 } as React.CSSProperties}>
              <button ref={hold} type="button" className={`hold ${done ? "done" : ""}`} aria-label={done ? "Allocated. Double click to run again." : "Press and hold to allocate"} aria-pressed={done}>
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle className="trk" cx="50" cy="50" r="48" fill="none" strokeWidth="1.5" />
                  <circle className="prg" cx="50" cy="50" r="48" fill="none" strokeWidth="2" pathLength={1} />
                </svg>
                <span className="lbl">{done ? "Allocated" : "Press and\nhold"}</span>
              </button>
              <p className="font-body-sm text-body-sm text-steel max-w-[22ch]">{done ? "Dispatched. Double click the ring to run it again." : "Let go early and the allocation unwinds. Hold it through and it dispatches."}</p>
            </div>
          </div>

          <div className="lg:col-span-7 p-space-lg lg:p-space-2xl flex flex-col justify-between">
            <ol className="flex flex-col divide-y divide-hairline">
              {portalSteps.map((step, i) => (
                <li key={step.title} className={`step part flex items-start gap-space-md py-space-md ${i < lit ? "lit" : ""}`} style={{ "--i": 2 + i } as React.CSSProperties}>
                  <span className="mark mt-0.5 shrink-0">
                    <Symbol name="check" className="text-[16px]" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-space-md">
                      <h3 className="font-display text-[20px] font-bold tracking-tight text-graphite">{step.title}</h3>
                      <span className="font-mono text-[11px] tracking-[0.14em] text-outline">0{i + 1}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-steel mt-1">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <span className={`chip transition-all duration-700 ${lit >= portalSteps.length ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} aria-hidden={lit < portalSteps.length}>
                <span className="w-1.5 h-1.5 rounded-full bg-azure" /> Arrives in 24 to 48 hours
              </span>
              <Link href="/partner-portal" className="u-line inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-graphite">
                Open the partner portal
                <Symbol name="arrow_forward" className="text-[16px] text-crimson" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
