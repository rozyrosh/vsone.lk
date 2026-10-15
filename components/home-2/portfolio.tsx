import { offerings } from "@/lib/content";
import Link from "next/link";
import { Symbol } from "../symbol";

/*
  What we stock. A mosaic of photographic tiles, the first one wide, each
  with its label set into the lower-left corner.
*/
export function Portfolio() {
  return (
    <section
      id="stock"
      data-stop
      className="relative pt-space-4xl pb-space-2xl reveal overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 18% 0%, #0a6a9e, transparent 55%), radial-gradient(ellipse 70% 50% at 88% 100%, #01243e, transparent 52%), #013D65",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(130,180,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(130,180,255,0.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 70% 65% at 50% 40%, #000 20%, transparent 75%)",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <p className="kicker kicker-on-dark part justify-center" style={{ "--i": 0 } as React.CSSProperties}>
            <i /> Our products portfolio <i />
          </p>
          <h2
            className="display part text-headline-lg-mobile lg:text-headline-lg mt-space-sm"
            style={{ "--i": 1, color: "#fff" } as React.CSSProperties}
          >
            More than 50 products from world-renowned brands.
          </h2>
          <p className="part font-body-md text-body-md mt-space-sm text-white/70" style={{ "--i": 2 } as React.CSSProperties}>
            A full range of IT products for every industry, making VS One the one-stop destination for partners&apos; critical technology demands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-space-md">
          {offerings.slice(0, 4).map((item, i) => (
            <Link
              key={item.slug}
              href={`/products?category=${item.slug}`}
              className={`group part relative overflow-hidden rounded-[10px] bg-white/95 border border-white/20 min-h-[260px] shadow-[0_24px_48px_-28px_rgba(0,0,0,0.45)] ${i === 0 ? "md:col-span-4 md:min-h-[380px]" : i === 1 ? "md:col-span-2 md:min-h-[380px]" : "md:col-span-3 md:min-h-[320px]"}`}
              style={{ "--i": 3 + i } as React.CSSProperties}
            >
              <img src={item.image} alt={item.alt} className="tile-img absolute inset-0 w-full h-full object-cover" loading="lazy" />
              {/* the stills are white studio shots, so the words sit on a white veil, not a dark one */}
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(255,255,255,.96) 0%, rgba(255,255,255,.78) 30%, rgba(255,255,255,.1) 62%, rgba(255,255,255,0) 100%)" }}
                aria-hidden="true"
              />
              <span className="absolute top-4 left-4 chip">
                <span className="w-1.5 h-1.5 rounded-full bg-azure" aria-hidden="true" />
                {item.badge}
              </span>
              <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-space-md text-graphite">
                <div>
                  <h3 className="display text-[24px] lg:text-[28px] leading-none" style={{ color: "#013D65" }}>{item.title}</h3>
                  <p className="font-body-sm text-body-sm text-steel mt-2 max-w-[40ch] hidden sm:block">{item.summary}</p>
                </div>
                <span className="w-11 h-11 rounded-full bg-[#013D65] text-white flex items-center justify-center shrink-0 transition-[transform,background-color] duration-500 group-hover:translate-x-1 group-hover:bg-azure">
                  <Symbol name="arrow_forward" className="text-[18px]" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="part mt-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-sm px-space-md py-space-sm border-t border-white/15" style={{ "--i": 7 } as React.CSSProperties}>
          <p className="font-body-sm text-body-sm text-white/65">
            Also on the bench: {offerings.slice(4).map((item) => item.title).join(", ")}.
          </p>
          <Link href="/offerings" className="u-line inline-flex items-center gap-2 font-label-md text-label-md font-semibold text-white shrink-0">
            All offerings
            <Symbol name="arrow_forward" className="text-[16px] text-crimson" />
          </Link>
        </div>
      </div>
    </section>
  );
}
