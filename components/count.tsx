"use client";

import { useEffect, useRef } from "react";

/*
  A number that counts up when its section reveals. Text writes are throttled
  to about 10Hz and only land when the string actually changed. Reduced motion
  shows the final value immediately.
*/
export function Count({ value, suffix = "", duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const host = node.closest(".reveal") ?? node;
    let raf: number | null = null;
    let lastText = "";
    let lastAt = 0;

    function write(text: string, now: number, force = false) {
      if (!force && now - lastAt < 100) return;
      if (text === lastText) return;
      lastText = text;
      lastAt = now;
      node!.textContent = text;
    }

    function run() {
      if (reduce.matches) {
        write(String(value), performance.now(), true);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        write(String(Math.round(value * eased)), now, t === 1);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    let played = false;
    function sync() {
      const on = host.classList.contains("in");
      if (on && !played) {
        played = true;
        run();
      } else if (!on && played) {
        played = false;
        if (raf !== null) cancelAnimationFrame(raf);
        lastText = "";
        write("0", performance.now(), true);
      }
    }
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(host, { attributes: true, attributeFilter: ["class"] });
    const onReduce = () => {
      if (reduce.matches) {
        if (raf !== null) cancelAnimationFrame(raf);
        write(String(value), performance.now(), true);
      }
    };
    reduce.addEventListener("change", onReduce);
    return () => {
      mo.disconnect();
      reduce.removeEventListener("change", onReduce);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <>
      <span ref={el}>0</span>
      {suffix}
    </>
  );
}
