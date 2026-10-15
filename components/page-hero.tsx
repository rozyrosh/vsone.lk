import { HeroSlides } from "@/components/hero-slides";

/* Hairline plate on the blue news card. Lines stay quiet under the headline. */
function BlueLineArt() {
  const rules = Array.from({ length: 14 }, (_, i) => 18 + i * 30);
  return (
    <svg className="pointer-events-none absolute inset-0 z-[1] h-full w-full" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="blue-line-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.34" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.62" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="blue-line-mask">
          <rect width="1440" height="420" fill="url(#blue-line-fade)" />
        </mask>
      </defs>
      <g mask="url(#blue-line-mask)" fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="1">
        {rules.map((y) => (
          <line key={y} x1="360" x2="1480" y1={y} y2={y} />
        ))}
        {[980, 1080, 1180, 1280, 1380].map((x) => (
          <line key={x} x1={x} x2={x} y1="-20" y2="440" />
        ))}
        <path d="M1440 460 C 1180 360, 1040 180, 980 -20" />
        <path d="M1520 420 C 1240 300, 1120 140, 1060 -40" />
        <path d="M1600 380 C 1320 250, 1200 90, 1140 -30" />
        <path d="M720 420 C 860 300, 980 160, 1040 0" />
        <path d="M640 0 L 900 210 L 1180 210 L 1440 40" />
        <circle cx="1180" cy="210" r="46" />
        <circle cx="1180" cy="210" r="7" fill="rgba(255,255,255,0.55)" stroke="none" />
      </g>
    </svg>
  );
}

/*
  Inner-page opener. The Line appears in miniature: a short vertical stroke
  that draws down to a crimson node beside the headline.
*/
export function PageHero({
  eyebrow,
  title,
  summary,
  image,
  images,
  align,
  onDark,
  tone,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  image?: string;
  images?: string[];
  align?: "center";
  onDark?: boolean;
  tone?: "blue";
}) {
  const slides = images?.length ? images : image ? [image] : [];
  const light = Boolean(slides.length || onDark || tone === "blue");
  return (
    <section className={`relative overflow-hidden pt-space-3xl pb-space-2xl reveal ${slides.length ? "min-h-[340px]" : ""}`} style={tone === "blue" ? { background: "linear-gradient(105deg, #013D65 0%, #014a78 48%, #1a7eb8 100%)" } : undefined}>
      {slides.length > 1 ? (
        <HeroSlides images={slides} />
      ) : slides.length === 1 ? (
        <img src={slides[0]} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[58%_46%]" />
      ) : null}
      {slides.length ? (
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "linear-gradient(90deg, rgba(1,61,101,0.92) 0%, rgba(1,61,101,0.78) 32%, rgba(1,61,101,0.22) 58%, rgba(1,61,101,0) 100%)",
            }}
          />
      ) : null}
      {tone === "blue" ? <BlueLineArt /> : null}
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
      {align === "center" ? (
        <div className="max-w-3xl mx-auto text-center">
          <p className={`kicker part ${light ? "kicker-on-dark" : ""}`} style={{ "--i": 0 } as React.CSSProperties}>
            <i /> {eyebrow}
          </p>
          <h1 className="display part text-headline-lg-mobile lg:text-[52px] lg:leading-[1.02] mt-space-sm mx-auto max-w-[16ch]" style={{ "--i": 1, color: light ? "#fff" : undefined } as React.CSSProperties}>
            {title}
          </h1>
          <p className={`part font-body-md text-body-md lg:text-body-lg max-w-[46ch] mx-auto mt-space-md ${light ? "text-white/80" : "text-steel"}`} style={{ "--i": 2 } as React.CSSProperties}>
            {summary}
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-[28px_1fr] gap-x-space-md">
        <div className="relative flex flex-col items-center pt-1" aria-hidden="true">
          <svg className="page-hero-line overflow-visible">
            <line className="draw" pathLength={1} x1="1" y1="0" x2="1" y2="100%" stroke={light ? "rgba(255,255,255,0.55)" : "var(--hair-strong)"} strokeWidth="2" />
          </svg>
          <span className="part w-2.5 h-2.5 rounded-full bg-crimson shadow-[0_0_0_6px_var(--accent-muted)] shrink-0" style={{ "--i": 3 } as React.CSSProperties} />
        </div>
        <div>
          <p className={`kicker part ${light ? "kicker-on-dark" : ""}`} style={{ "--i": 0 } as React.CSSProperties}>
            <i /> {eyebrow}
          </p>
          <h1 className="display part text-headline-lg-mobile lg:text-[52px] lg:leading-[1.02] mt-space-sm max-w-[22ch]" style={{ "--i": 1, color: light ? "#fff" : undefined } as React.CSSProperties}>
            {title}
          </h1>
        </div>
        <p className={`part col-start-2 font-body-md text-body-md lg:text-body-lg max-w-[58ch] mt-space-md ${light ? "text-white/80" : "text-steel"}`} style={{ "--i": 2 } as React.CSSProperties}>
          {summary}
        </p>
      </div>
      )}
      </div>
    </section>
  );
}
