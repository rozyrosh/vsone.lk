"use client";

import { useEffect, useRef } from "react";

/*
  The Line, continued. The hero's single line hands off to this rail on the
  right edge: it draws itself with scroll, a crimson tip rides the drawn end,
  and each section leaves a tick with a mono label. Desktop only, hidden on
  short windows and under reduced motion (see globals.css).
*/
type Stop = { id: string; label: string };

export function Rail({ stops }: { stops: Stop[] }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const fill = el.querySelector<HTMLElement>(".rail-fill");
    const tip = el.querySelector<HTMLElement>(".rail-tip");
    const stopEls = Array.from(el.querySelectorAll<HTMLElement>(".rail-stop"));
    if (!fill || !tip) return;

    let tops: number[] = [];
    let raf: number | null = null;
    let lastDraw = -1;
    let lastOn = -1;

    function measure() {
      const h = el!.getBoundingClientRect().height;
      el!.style.setProperty("--rail-h", `${h}px`);
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      tops = stops.map((s) => {
        const sec = document.getElementById(s.id);
        return sec ? sec.getBoundingClientRect().top + window.scrollY : 0;
      });
      stopEls.forEach((stop, i) => {
        const frac = Math.min(1, Math.max(0, (tops[i] - window.innerHeight * 0.5) / max));
        stop.style.top = `${(frac * 100).toFixed(3)}%`;
      });
    }

    function tick() {
      raf = null;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const draw = Math.min(1, Math.max(0, window.scrollY / max));
      if (Math.abs(draw - lastDraw) > 0.0015) {
        lastDraw = draw;
        el!.style.setProperty("--draw", draw.toFixed(4));
      }
      const y = window.scrollY + window.innerHeight * 0.5;
      let on = -1;
      for (let i = 0; i < tops.length; i++) if (tops[i] <= y) on = i;
      if (on !== lastOn) {
        lastOn = on;
        stopEls.forEach((stop, i) => stop.classList.toggle("on", i === on));
      }
    }

    function onScroll() {
      if (raf === null) raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(document.body);
    measure();
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [stops]);

  return (
    <div className="rail" ref={root} aria-hidden="true">
      <div className="rail-track" />
      <div className="rail-fill" />
      <div className="rail-tip" />
      {stops.map((s) => (
        <a key={s.id} href={`#${s.id}`} className="rail-stop" tabIndex={-1}>
          <span className="lbl">{s.label}</span>
          <span className="tick" />
        </a>
      ))}
    </div>
  );
}
