"use client";

import { articles, offers } from "@/lib/content";
import { channelsMedia } from "@/lib/channels-media";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Symbol } from "../symbol";

/*
  Who we supply: Freepik laptop opens on scroll (10k scrub standard).
  Blob fetch, gated seeks, dt-lerp, six caption bands in the empty space
  around the machine. Same five static gates as the hero.
*/

const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

type Band = { a: number; b: number; ramp: number };
const BANDS: Band[] = [
  { a: 0.09, b: 0.17, ramp: 0.04 },
  { a: 0.17, b: 0.3, ramp: 0.045 },
  { a: 0.315, b: 0.45, ramp: 0.045 },
  { a: 0.465, b: 0.6, ramp: 0.045 },
  { a: 0.615, b: 0.75, ramp: 0.045 },
  { a: 0.765, b: 1.0, ramp: 0.05 },
];

const FX = ["fx-weave", "fx-snap", "fx-drift", "fx-rise", "fx-snap", "fx-rise"] as const;
const SIDE = ["band-left", "band-right", "band-left", "band-right", "band-left", "band-right"] as const;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const smoothstep = (p: number, e0: number, e1: number) => {
  const t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function ChannelCta() {
  return (
    <div className="cta">
      <Link href="/products" className="btn btn-ink">
        Explore Portfolio
        <span className="dot">
          <Symbol name="arrow_forward" className="text-[16px]" />
        </span>
      </Link>
    </div>
  );
}

export function Channels() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = section.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".ch-stage")!;
    const video = root.querySelector<HTMLVideoElement>(".ch-video")!;
    const poster = root.querySelector<HTMLElement>(".ch-poster")!;
    const cue = root.querySelector<HTMLElement>(".ch-cue")!;
    const ring = root.querySelector<SVGCircleElement>(".ch-cue .ring circle:last-child");
    const bandEls = Array.from(root.querySelectorAll<HTMLElement>(".ch-band"));
    const washEls = Array.from(root.querySelectorAll<HTMLElement>(".ch-wash"));
    const cache = bandEls.map(() => ({ op: -1, k: -1, active: false }));

    let target = 0;
    let shown = 0;
    let rafId: number | null = null;
    let lastTick = 0;
    let lastP = -1;
    let onScreen = true;
    let scrubOn = false;
    let inited = false;

    let seekBusy = false;
    let pendingTime: number | null = null;
    let seekTimer = 0;
    function releaseSeek() {
      window.clearTimeout(seekTimer);
      seekBusy = false;
      if (pendingTime !== null) {
        const t = pendingTime;
        pendingTime = null;
        requestSeek(t);
      }
    }
    function requestSeek(t: number) {
      if (!video.duration || !Number.isFinite(t)) return;
      if (seekBusy) {
        pendingTime = t;
        return;
      }
      if (!video.seeking && Math.abs(video.currentTime - t) < 0.05) return;
      seekBusy = true;
      seekTimer = window.setTimeout(releaseSeek, 800);
      try {
        video.currentTime = t;
      } catch {
        releaseSeek();
      }
    }
    video.addEventListener("seeked", releaseSeek);
    video.addEventListener("error", () => {
      window.clearTimeout(seekTimer);
      seekBusy = false;
      pendingTime = null;
      failVideo();
    });

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
        cue.style.setProperty("--p", p.toFixed(3));
      }
      BANDS.forEach((band, i) => {
        const el = bandEls[i];
        const wash = washEls[i];
        const c = cache[i];
        const f = Math.min(0.018, (band.b - band.a) / 3);
        const easeIn = smoothstep(p, band.a, band.a + f);
        const easeOut = i === BANDS.length - 1 ? 1 : 1 - smoothstep(p, band.b - f, band.b);
        const op = Math.round(easeIn * easeOut * 1000) / 1000;
        const k = clamp((p - band.a) / band.ramp, 0, 1);
        if (op !== c.op) {
          c.op = op;
          el.style.opacity = String(op);
          if (wash) wash.style.opacity = String(op);
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
      if (video.duration) requestSeek(shown * video.duration);
    }

    function failVideo() {
      stage.classList.add("video-failed");
      cue.classList.add("no-video");
    }

    async function loadBlob() {
      const ctrl = new AbortController();
      let watchdog = window.setTimeout(() => ctrl.abort(), 25000);
      const res = await fetch(channelsMedia.video, { signal: ctrl.signal, priority: "low" } as RequestInit);
      if (!res.ok || !res.body) throw new Error("channels video unavailable");
      const total = Number(res.headers.get("Content-Length")) || channelsMedia.bytes;
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let got = 0;
      let lastRing = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        window.clearTimeout(watchdog);
        watchdog = window.setTimeout(() => ctrl.abort(), 25000);
        chunks.push(value);
        got += value.length;
        const frac = Math.min(1, got / total);
        const now = performance.now();
        if (ring && (now - lastRing > 100 || frac === 1)) {
          lastRing = now;
          ring.style.strokeDashoffset = String(Math.round(126 * (1 - frac)));
        }
      }
      window.clearTimeout(watchdog);
      video.src = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
      video.muted = true;
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          const seek = () => requestSeek(progress() * video.duration);
          const prime = video.play();
          if (prime && typeof prime.then === "function") {
            prime.then(() => {
              video.pause();
              seek();
            }).catch(seek);
          } else seek();
          stage.classList.add("video-ready");
          cue.classList.add("no-video");
        },
        { once: true },
      );
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
      if (!inited) {
        inited = true;
        if (!channelsMedia.video) {
          cue.classList.add("no-video");
        } else {
          stage.classList.add("has-video");
          poster.style.backgroundImage = `url('${channelsMedia.poster}')`;
          let started = false;
          const start = () => {
            if (started) return;
            started = true;
            loadBlob().catch(() => loadBlob().catch(failVideo));
          };
          const img = new Image();
          img.onload = start;
          img.onerror = start;
          img.src = channelsMedia.poster;
          setTimeout(start, 3500);
        }
      }
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
      <section ref={section} id="channels" data-stop className="ch-scrub" aria-label="What we offer">
        <div className={channelsMedia.ending ? "ch-stage has-static" : "ch-stage"}>
          <div className="ch-media" aria-hidden="true">
            <div className="ch-poster" />
            {channelsMedia.ending ? (
              <div className="ch-static" style={{ backgroundImage: `url('${channelsMedia.ending}')` }} />
            ) : null}
            <video className="ch-video" preload="none" muted playsInline aria-hidden="true" tabIndex={-1} />
          </div>
          <div className="ch-scrim" aria-hidden="true" />
          <div className="ch-grid" aria-hidden="true" />
          <div className="ch-washes" aria-hidden="true">
            {offers.map((_, i) => (
              <div key={i} className={`ch-wash ${SIDE[i] === "band-left" ? "ch-wash-left" : "ch-wash-right"}`} data-band={i} />
            ))}
          </div>

          <header className="ch-intro">
            <p className="kicker kicker-on-dark">
              <i /> What we offer
            </p>
            <h2 className="ch-headline">
              What we offer
              <br />
              our partners.
            </h2>
            <p className="ch-dek">Distribution, partner management, channel support, rewards, warranty, and financial services.</p>
          </header>

          {offers.map((item, i) => (
            <div key={item.title} className={`band ch-band ${SIDE[i]} ${FX[i]}`} data-band={i}>
              <span className="kicker">
                {i % 2 === 0 ? <i /> : null}
                {String(i + 1).padStart(2, "0")} / Offer
                {i % 2 === 1 ? <i /> : null}
              </span>
              <p className="headline">
                {item.title === "Performance Evaluation & Rewards" ? (
                  <>
                    Performance
                    <br />
                    Evaluation & Rewards
                  </>
                ) : (
                  item.title
                )}
              </p>
              <p className="sub">{item.summary}</p>
              <ChannelCta />
            </div>
          ))}

          <div className="ch-cue" aria-hidden="true">
            <svg className="ring" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="126" style={{ strokeDashoffset: 126 }} />
            </svg>
            <span className="chev" />
            <span>Scroll</span>
          </div>
        </div>
      </section>

      <section className="ch-static-list reveal" aria-label="What we offer">
        <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-space-2xl border-t border-hairline">
            {offers.map((channel, i) => (
              <li key={channel.title} className="part border-b border-hairline" style={{ "--i": i } as React.CSSProperties}>
                <Link href="/partners" className="row-link group flex items-start gap-space-md py-space-md pl-0 pr-space-sm rounded-[10px]">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-outline pt-1.5 w-7 shrink-0">0{i + 1}</span>
                  <span className="w-10 h-10 rounded-[12px] bg-mist border border-hairline flex items-center justify-center text-graphite shrink-0 transition-colors duration-500 group-hover:bg-graphite group-hover:text-white">
                    <Symbol name={channel.icon} className="text-[20px]" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[20px] font-bold tracking-tight text-graphite">{channel.title}</span>
                    <span className="block font-body-sm text-body-sm text-steel mt-1">{channel.summary}</span>
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

export function NewsStrip() {
  return (
    <section id="news" data-stop className="relative bg-white py-space-4xl reveal">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex items-end justify-between gap-space-md mb-space-xl">
          <div>
            <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
              <i /> News & events
            </p>
            <h2 className="display part text-headline-lg-mobile lg:text-headline-lg mt-space-sm" style={{ "--i": 1 } as React.CSSProperties}>
              Inside VS One.
            </h2>
          </div>
          <Link href="/news" className="part u-line hidden sm:inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-graphite" style={{ "--i": 2 } as React.CSSProperties}>
            All news
            <Symbol name="arrow_forward" className="text-[16px] text-crimson" />
          </Link>
        </div>
        <div className="flex flex-col">
          {articles.map((article, i) => (
            <Link key={article.slug} href={`/news/${article.slug}`} className="part group relative grid grid-cols-1 md:grid-cols-12 gap-space-sm md:gap-space-lg items-baseline py-space-lg border-t border-hairline last:border-b hover:bg-panel/70 transition-colors duration-500 rounded-[6px] md:px-space-sm" style={{ "--i": 2 + i } as React.CSSProperties}>
              <span className="md:col-span-2 font-mono text-[11px] tracking-[0.12em] uppercase text-outline">{article.date}</span>
              <span className="md:col-span-6 font-display text-[22px] lg:text-[26px] font-bold tracking-tight text-graphite leading-tight">{article.title}</span>
              <span className="md:col-span-3 font-body-sm text-body-sm text-steel line-clamp-2">{article.summary}</span>
              <span className="md:col-span-1 justify-self-end">
                <Symbol name="east" className="text-[20px] text-crimson transition-transform duration-500 group-hover:translate-x-1" />
              </span>
              <span className="news-pop pointer-events-none absolute z-20 hidden md:block right-[12%] bottom-[calc(100%-18px)] w-[240px] opacity-0 translate-y-3 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
                <img src={article.image} alt="" className="w-full aspect-[4/3] object-cover rounded-md bg-surface-container shadow-[0_22px_40px_-18px_rgba(15,17,21,0.5)]" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JoinBanner() {
  return (
    <section id="join" data-stop className="join-band relative py-space-2xl reveal">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="panel part relative overflow-hidden text-center px-space-lg py-space-xl lg:py-space-2xl" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="relative max-w-3xl mx-auto">
            <div className="join-rule" aria-hidden="true">
              <svg className="overflow-visible" aria-hidden="true">
                <line className="draw" pathLength={1} x1="1" y1="0" x2="1" y2="100%" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
              </svg>
              <span className="join-rule-dot" />
            </div>
            <p className="kicker part justify-center" style={{ "--i": 1 } as React.CSSProperties}>
              <i /> Join the network <i />
            </p>
            <h2 className="display part text-headline-lg-mobile lg:text-[56px] lg:leading-[1] mt-space-md" style={{ "--i": 2 } as React.CSSProperties}>
              Ready to elevate your ICT distribution reach?
            </h2>
            <p className="part font-body-md text-body-md lg:text-body-lg text-steel mt-space-md max-w-[52ch] mx-auto" style={{ "--i": 3 } as React.CSSProperties}>
              Join our islandwide partner network for continuous business growth. Get access to 25+ global brands, pre-sales and technical support, tailored credit terms and attractive rebate schemes.
            </p>
            <div className="part mt-space-xl flex flex-col sm:flex-row items-center justify-center gap-space-sm" style={{ "--i": 4 } as React.CSSProperties}>
              <Link href="/partner-portal/apply" className="btn btn-accent w-full sm:w-auto">
                Become A Partner
                <Symbol name="arrow_forward" className="text-[16px]" />
              </Link>
              <a href="tel:+94112592121" className="btn btn-ghost w-full sm:w-auto">
                <Symbol name="call" className="text-[16px] text-crimson" />
                +94 112 592 121
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
