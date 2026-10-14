import { brands } from "@/lib/content";
import { CatalogSearch } from "./catalog-search";

/*
  The allocation desk. The first thing after the settle: a search over the
  catalog and the bench of brands moving slowly past, the section's one living
  element. One row, no cards.
*/
export function Desk() {
  const bench = [...brands, ...brands];
  return (
    <section id="desk" data-stop className="relative z-20 border-y border-hairline bg-panel/70 backdrop-blur-sm reveal live">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg flex flex-col lg:flex-row lg:items-center gap-space-lg">
        <div className="part flex items-start lg:items-center gap-space-md lg:w-[300px] shrink-0" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="relative mt-1 lg:mt-0 w-2.5 h-2.5 rounded-full shrink-0 pulse" style={{ backgroundColor: "#013D65" }} />
          <div>
            <p className="font-body-sm text-body-sm text-steel">Search the lines we stock. Partners confirm live quantities in the portal.</p>
          </div>
        </div>
        <div className="part flex-1 min-w-0" style={{ "--i": 1 } as React.CSSProperties}>
          <CatalogSearch />
        </div>
      </div>
      <div className="border-t border-hairline overflow-hidden" aria-label="Brands on the bench">
        <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <div className="marquee" aria-hidden="true">
            {bench.map((brand, i) => (
              <span key={`${brand.name}-${i}`} className="flex items-center h-12 shrink-0">
                <img src={brand.logo} alt="" className="h-9 md:h-10 w-auto max-w-[140px] object-contain opacity-80" />
              </span>
            ))}
          </div>
          <p className="sr-only">{brands.map((b) => b.name).join(", ")}</p>
        </div>
      </div>
    </section>
  );
}
