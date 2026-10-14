"use client";

import { mapImage, provinceBadges, provinces } from "@/lib/content";
import Link from "next/link";
import { useState } from "react";
import { Symbol } from "../symbol";

/*
  Where the boxes go. The map sits on the left this time, drawn light: the
  island in graphite on porcelain, nine province pins, one crimson for the
  Colombo hub. Pick a province and its count reads out on the right.
*/
export function Footprint() {
  const [active, setActive] = useState("03");

  return (
    <section id="island" data-stop className="relative py-0 reveal live">
      <div className="island-sheet panel part relative py-24 overflow-hidden" style={{ "--i": 0 } as React.CSSProperties}>
        <div className="absolute inset-0 pointer-events-none opacity-60 [background-image:linear-gradient(to_right,rgba(15,17,21,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,17,21,0.04)_1px,transparent_1px)] [background-size:40px_40px]" aria-hidden="true" />
        <div className="island-sheet-inner relative z-10">
          <div className="order-2 lg:order-1 w-full flex items-center justify-center">
            <div className="relative w-full max-w-[320px]" style={{ aspectRatio: "341 / 512" }}>
                <img src={mapImage} alt="Map of Sri Lanka with VS One partner counts by province" className="absolute inset-0 h-full w-full opacity-80 pointer-events-none [filter:grayscale(1)_contrast(1.1)]" />
                {provinces.map((province) => {
                  const on = province.code === active;
                  const hq = province.hq;
                  return (
                    <button
                      key={province.code}
                      type="button"
                      onClick={() => setActive(province.code)}
                      className="absolute z-10 group"
                      style={{ left: `${province.x}%`, top: `${province.y}%`, transform: `translate(-50%, -50%)${on ? " scale(1.1)" : ""}` }}
                      aria-pressed={on}
                      aria-label={`${province.name}, ${province.count} partners`}
                    >
                      {province.side === "left" ? (
                        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-1.5 hidden sm:flex items-center">
                          <span className="text-right mr-2">
                            <span className="block font-label-md text-[12px] font-semibold text-graphite leading-tight whitespace-nowrap">{province.name}</span>
                            <span className={`block font-mono text-[11px] ${hq ? "text-crimson" : "text-steel"}`}>{province.count}</span>
                          </span>
                          <span className={`w-8 h-px ${hq ? "bg-crimson" : "bg-outline-variant/60"}`} />
                        </span>
                      ) : null}
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-medium transition-colors duration-500 ${hq ? "bg-crimson text-white shadow-[0_0_0_6px_var(--accent-muted)]" : on ? "bg-azure text-white shadow-[0_0_0_6px_var(--blue-muted)]" : "bg-panel text-graphite border border-outline-variant/70 group-hover:border-azure"}`}>
                        {province.code}
                      </span>
                      {province.side === "right" ? (
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-1.5 hidden sm:flex items-center">
                          <span className={`w-8 h-px ${hq ? "bg-crimson" : "bg-outline-variant/60"}`} />
                          <span className="text-left ml-2">
                            <span className="block font-label-md text-[12px] font-semibold text-graphite leading-tight whitespace-nowrap">{province.name}</span>
                            <span className="block font-mono text-[11px] text-steel">{province.count}</span>
                          </span>
                        </span>
                      ) : null}
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-space-md">
          <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
            <i /> Where the boxes go
          </p>
          <h2 className="display part text-headline-lg-mobile lg:text-headline-lg max-w-[16ch]" style={{ "--i": 1 } as React.CSSProperties}>
            Nine provinces, <span style={{ color: "#013D65" }}>two days.</span>
          </h2>
          <p className="part font-body-md text-body-md text-steel max-w-[46ch]" style={{ "--i": 2 } as React.CSSProperties}>
            Regional hubs and channel managers take the bottleneck out of distribution outside Colombo. Pick a province to see how many partners already buy there.
          </p>
          <div className="part grid grid-cols-3 gap-px bg-hairline border border-hairline rounded-[4px] overflow-hidden mt-space-xs" style={{ "--i": 3 } as React.CSSProperties}>
            {provinceBadges.map((item) => {
              const match = provinces.find((province) => province.name === item.name);
              const on = match?.code === active;
              return (
                <button key={item.name} type="button" onClick={() => match && setActive(match.code)} className={`p-space-sm text-left transition-colors duration-400 ${on ? "bg-azure text-white" : "bg-panel hover:bg-mist"}`} aria-pressed={on}>
                  <span className={`block font-display text-[22px] font-bold leading-none ${on ? "text-white" : item.accent ? "text-crimson" : "text-graphite"}`}>{item.count}</span>
                  <span className={`block font-mono text-[10px] tracking-[0.1em] uppercase mt-1 ${on ? "text-white/70" : "text-steel"}`}>{item.name}</span>
                </button>
              );
            })}
          </div>
          <Link href="/contact" className="part u-line self-start inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-graphite mt-space-xs" style={{ "--i": 4 } as React.CSSProperties}>
            Contact Us
            <Symbol name="east" className="text-[18px] text-crimson" />
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
