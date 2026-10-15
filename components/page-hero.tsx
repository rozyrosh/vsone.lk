/*
  Inner-page opener. The Line appears in miniature: a short vertical stroke
  that draws down to a crimson node beside the headline.
*/
export function PageHero({
  eyebrow,
  title,
  summary,
  image,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  image?: string;
}) {
  return (
    <section className={`relative overflow-hidden pt-space-3xl pb-space-2xl reveal ${image ? "min-h-[340px]" : ""}`}>
      {image ? (
        <>
          <img src={image} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[58%_46%]" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 32%, rgba(255,255,255,0.22) 58%, rgba(255,255,255,0) 100%)",
            }}
          />
        </>
      ) : null}
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10 grid grid-cols-[28px_1fr] gap-x-space-md">
        <div className="relative flex flex-col items-center pt-1" aria-hidden="true">
          <svg className="page-hero-line overflow-visible">
            <line className="draw" pathLength={1} x1="1" y1="0" x2="1" y2="100%" stroke="var(--hair-strong)" strokeWidth="2" />
          </svg>
          <span className="part w-2.5 h-2.5 rounded-full bg-crimson shadow-[0_0_0_6px_var(--accent-muted)] shrink-0" style={{ "--i": 3 } as React.CSSProperties} />
        </div>
        <div>
          <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
            <i /> {eyebrow}
          </p>
          <h1 className="display part text-headline-lg-mobile lg:text-[52px] lg:leading-[1.02] mt-space-sm max-w-[22ch]" style={{ "--i": 1 } as React.CSSProperties}>
            {title}
          </h1>
        </div>
        <p className="part col-start-2 font-body-md text-body-md lg:text-body-lg text-steel max-w-[58ch] mt-space-md" style={{ "--i": 2 } as React.CSSProperties}>
          {summary}
        </p>
      </div>
    </section>
  );
}
