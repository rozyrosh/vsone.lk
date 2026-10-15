"use client";

import { useEffect, useState } from "react";

const HOLD_MS = 7000;

export function HeroSlides({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, HOLD_MS);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {images.map((src, i) => (
        <img key={src} src={src} alt="" className={`hero-slide${i === index ? " is-on" : ""}`} />
      ))}
    </div>
  );
}
