"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Symbol } from "../symbol";

const sectors = [
  {
    image: "/ecosystem/showrooms.png",
    alt: "A mall electronics showroom with laptops and displays under navy light.",
    title: "Direct Retail Showrooms",
    summary:
      "We supply IT products and services to retail showrooms that bring our brands closer to individual customers.",
  },
  {
    image: "/ecosystem/resellers.png",
    alt: "Business laptops and enterprise hardware laid out for an IT reseller.",
    title: "IT Resellers",
    summary:
      "Products and services for IT resellers serving the commercial and industrial sectors.",
  },
  {
    image: "/ecosystem/integrators.png",
    alt: "A system integrator lab with network racks and an engineer at a monitor.",
    title: "System Integrators",
    summary:
      "Products and services for system integrators, with solutions customized to industry specifications.",
  },
  {
    image: "/ecosystem/distributors.png",
    alt: "An orderly warehouse aisle of sealed hardware cartons.",
    title: "Sub Distributors",
    summary:
      "World-class products and services that help sub distributors strengthen their operations and serve their stakeholders.",
  },
  {
    image: "/ecosystem/retailers.png",
    alt: "A wide large-format electronics retail floor with display aisles.",
    title: "Large-Format Retailers",
    summary:
      "Effective, seamless distribution of our products and solutions to large-format retailers across the country.",
  },
  {
    image: "/ecosystem/marketplaces.png",
    alt: "An e-commerce packing bench with parcels and a laptop.",
    title: "E-Commerce Marketplaces",
    summary:
      "Global brands and reliable solutions for e-commerce partners, supported by the online stores VS One operates.",
  },
];

export function ChannelSupply() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; dx: number } | null>(null);
  const suppressClick = useRef(false);
  const count = sectors.length;

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [paused, count]);

  function go(next: number) {
    setIndex((next + count) % count);
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest(".channel-supply-nav, a, button")) return;
    dragRef.current = { x: event.clientX, dx: 0 };
    setDragging(true);
    setPaused(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* A synthetic pointer has nothing to capture. */
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    drag.dx = event.clientX - drag.x;
    setDragX(drag.dx);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const width = viewportRef.current?.clientWidth || 1;
    const moved = Math.abs(drag.dx) > 8;
    if (moved) suppressClick.current = true;
    setDragging(false);
    setDragX(0);
    if (drag.dx <= -Math.min(80, width * 0.12)) go(index + 1);
    else if (drag.dx >= Math.min(80, width * 0.12)) go(index - 1);
    if (event.pointerType !== "mouse") setPaused(false);
  }

  return (
    <section
      id="ecosystem"
      className={`channel-supply reveal${dragging ? " is-dragging" : ""}`}
      aria-roledescription="carousel"
      aria-labelledby="ecosystem-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        if (!dragRef.current) setPaused(false);
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={viewportRef}
        className="channel-supply-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(event) => {
          if (!suppressClick.current) return;
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }}
      >
        <div
          className="channel-supply-track"
          style={{
            transform: `translateX(calc(-${index * 100}% + ${dragX}px))`,
            transition: dragging ? "none" : undefined,
          }}
        >
          {sectors.map((item, i) => (
            <article
              key={item.title}
              className={`channel-supply-slide${i % 2 === 1 ? " is-flip" : ""}`}
              aria-hidden={i !== index}
            >
              <div className="channel-supply-copy">
                <p className="channel-supply-kicker">Ecosystem sectors</p>
                <h2
                  id={i === index ? "ecosystem-title" : undefined}
                  className="channel-supply-title"
                >
                  {item.title}
                </h2>
                <p className="channel-supply-dek">{item.summary}</p>
                <div className="channel-supply-cta">
                  <Link href="/partner-portal/apply" className="btn btn-ink" tabIndex={i === index ? 0 : -1}>
                    Become a partner
                    <span className="dot">
                      <Symbol name="arrow_forward" className="text-[16px]" />
                    </span>
                  </Link>
                  <Link href="/products" className="btn btn-ghost" tabIndex={i === index ? 0 : -1}>
                    Browse the Products
                  </Link>
                </div>
              </div>
              <figure className="channel-supply-figure">
                <img src={item.image} alt={i === index ? item.alt : ""} draggable={false} />
              </figure>
            </article>
          ))}
        </div>
        <div className="channel-supply-nav">
        <div className="channel-supply-dots" role="tablist" aria-label="Ecosystem sectors">
          {sectors.map((item, i) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={item.title}
              className={i === index ? "is-on" : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
