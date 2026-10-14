"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
  Motion infrastructure for the whole site.

  - .reveal containers get .in when they enter the viewport, then .done once the
    staggered entrance has finished so hover never lags behind retired delays.
  - .live containers get .in while on screen so their whisper-level loops only
    run when a visitor can see them.
  - Hidden tabs pause every animation through one body class.
  - Reduced motion is honored live: a flip to "reduce" pins every reveal to its
    final state right away.
*/
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add("in");
          const parts = el.querySelectorAll(".part, .draw").length;
          window.setTimeout(() => el.classList.add("done"), 900 + Math.min(parts, 12) * 120);
          reveal.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (el.classList.contains("in")) return;
        if (reduce.matches) {
          el.classList.add("in", "done");
        } else {
          reveal.observe(el);
        }
      });
      document.querySelectorAll<HTMLElement>(".live").forEach((el) => live.observe(el));
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
    };
  }, [pathname]);

  return null;
}
