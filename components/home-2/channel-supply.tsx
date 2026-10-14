"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Symbol } from "../symbol";

const sectors = [
  {
    image: "/ecosystem/showrooms.png",
    alt: "A mall electronics showroom with laptops and displays under navy light.",
    title: "Direct Retail Showrooms",
    summary:
      "Supplying turnkey consumer hardware, displays, and consumer electronics to prime street-front and mall tech retailers.",
  },
  {
    image: "/ecosystem/resellers.png",
    alt: "Business laptops and enterprise hardware laid out for an IT reseller.",
    title: "IT Resellers",
    summary:
      "End-to-end commercial solutions for corporate and SME IT procurement, providing tiered volume margins.",
  },
  {
    image: "/ecosystem/integrators.png",
    alt: "A system integrator lab with network racks and an engineer at a monitor.",
    title: "System Integrators",
    summary:
      "Dedicated pre-sales engineers and sandbox labs to support high-stake RFP bids for telecommunications, banking, and government.",
  },
  {
    image: "/ecosystem/distributors.png",
    alt: "An orderly warehouse aisle of sealed hardware cartons.",
    title: "Sub Distributors",
    summary:
      "District-level supply arrangements to ensure consistent buffer inventory and reliable second-tier distribution channels.",
  },
  {
    image: "/ecosystem/retailers.png",
    alt: "A wide large-format electronics retail floor with display aisles.",
    title: "Large-Format Retailers",
    summary:
      "Coordinated promotional campaigns, merchandising setups, and bulk SKU deliveries across nationwide consumer store networks.",
  },
  {
    image: "/ecosystem/marketplaces.png",
    alt: "An e-commerce packing bench with parcels and a laptop.",
    title: "E-Commerce Marketplaces",
    summary:
      "API-driven automated stock synchronization and drop-ship logistics to facilitate rapid online marketplace sales.",
  },
];

export function ChannelSupply() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
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

  return (
    <section
      id="ecosystem"
      className="channel-supply reveal"
      aria-roledescription="carousel"
      aria-labelledby="ecosystem-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="channel-supply-viewport">
        <div
          className="channel-supply-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
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
                    Browse the catalog
                  </Link>
                </div>
              </div>
              <figure className="channel-supply-figure">
                <img src={item.image} alt={i === index ? item.alt : ""} />
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
