"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
  Motion infrastructure for the whole site.

  - Every content section is a .reveal. It gets .in each time it enters the
    viewport and loses it once it has fully left, so the entrance plays again
    on the way back.
  - .done retires the stagger delay after the entrance finishes.
  - .live containers get .in while on screen so their whisper-level loops only
    run when a visitor can see them.
  - Hidden tabs pause every animation through one body class.
  - Reduced motion is honored live: a flip to "reduce" pins every reveal to its
    final state right away.
*/
const PINNED = ["hero", "pi-scrub", "ch-scrub"];

function collectReveals() {
  const nodes = new Set<HTMLElement>();
  document.querySelectorAll<HTMLElement>("#content .reveal, #content section, #content article, footer").forEach((el) => {
    if (el.parentElement?.closest("section, article, .reveal")) return;
    el.classList.add("reveal");
    if (!PINNED.some((name) => el.classList.contains(name)) && !el.querySelector(".part")) {
      let index = 0;
      for (const child of el.children) {
        if (!(child instanceof HTMLElement)) continue;
        if (child.getAttribute("aria-hidden") === "true") continue;
        child.style.setProperty("--i", String(Math.min(index, 6)));
        index += 1;
      }
    }
    nodes.add(el);
  });
  return [...nodes];
}

export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new WeakMap<HTMLElement, number>();

    function play(el: HTMLElement) {
      if (reduce.matches) {
        el.classList.add("in", "done");
        return;
      }
      if (el.classList.contains("in")) return;
      el.classList.remove("done");
      el.classList.add("in");
      const previous = timers.get(el);
      if (previous) window.clearTimeout(previous);
      const parts = el.querySelectorAll(".part, .draw").length || el.children.length;
      timers.set(
        el,
        window.setTimeout(() => {
          if (el.classList.contains("in")) el.classList.add("done");
        }, 900 + Math.min(parts, 12) * 90),
      );
    }

    function reset(el: HTMLElement) {
      if (reduce.matches) return;
      const previous = timers.get(el);
      if (previous) window.clearTimeout(previous);
      el.classList.remove("in", "done");
    }

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) play(el);
          else reset(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -18% 0px" },
    );

    const live = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).classList.toggle("in", entry.isIntersecting);
        }
      },
      { threshold: 0.05 },
    );

    function arm() {
      for (const el of collectReveals()) {
        if (reduce.matches) el.classList.add("in", "done");
        else reveal.observe(el);
      }
      document.querySelectorAll<HTMLElement>(".live").forEach((el) => {
        if (!el.classList.contains("reveal")) live.observe(el);
      });
    }

    function pinAll() {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => el.classList.add("in", "done"));
    }

    function onReduceChange(event: MediaQueryListEvent) {
      if (event.matches) pinAll();
    }

    function onVisibility() {
      document.body.classList.toggle("paused", document.hidden);
    }

    arm();
    reduce.addEventListener("change", onReduceChange);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      reveal.disconnect();
      live.disconnect();
      reduce.removeEventListener("change", onReduceChange);
      document.removeEventListener("visibilitychange", onVisibility);
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        const previous = timers.get(el);
        if (previous) window.clearTimeout(previous);
      });
    };
  }, [pathname]);

  return null;
}
