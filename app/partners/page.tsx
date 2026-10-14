import { PageHero } from "@/components/page-hero";
import { Symbol } from "@/components/symbol";
import { brands, channels } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  return (
    <>
      <PageHero eyebrow="Partners" title="Vendors on the bench. Channels on the island." summary="VS One supplies retailers, resellers, integrators, sub-distributors, large-format stores and marketplaces from one ERP portal." />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl reveal">
        <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
          <i /> Technology vendors
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-hairline border border-hairline rounded-[16px] overflow-hidden mt-space-md">
          {brands.map((brand, i) => (
            <div key={brand.name} className="part bg-panel p-space-lg flex items-center justify-center min-h-[96px] hover:bg-mist transition-colors duration-500" style={{ "--i": 1 + i } as React.CSSProperties}>
              <img src={brand.logo} alt={brand.name} className="h-8 md:h-10 w-auto max-w-[140px] object-contain" />
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-4xl reveal">
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-space-2xl border-t border-hairline">
          {channels.map((channel, i) => (
            <li key={channel.title} className="part border-b border-hairline py-space-md flex items-start gap-space-md" style={{ "--i": i } as React.CSSProperties}>
              <span className="font-mono text-[11px] tracking-[0.14em] text-outline pt-1.5 w-7 shrink-0">0{i + 1}</span>
              <span className="w-10 h-10 rounded-[12px] bg-mist border border-hairline flex items-center justify-center text-graphite shrink-0">
                <Symbol name={channel.icon} className="text-[20px]" />
              </span>
              <div>
                <h2 className="font-display text-[20px] font-bold tracking-tight text-graphite">{channel.title}</h2>
                <p className="font-body-sm text-body-sm text-steel mt-1">{channel.summary}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="panel part mt-space-xl p-space-lg lg:p-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md" style={{ "--i": 6 } as React.CSSProperties}>
          <div>
            <h2 className="font-display text-[26px] font-bold tracking-tight text-graphite">Apply for a partner account</h2>
            <p className="font-body-md text-body-md text-steel mt-space-xs">Credit terms, stock and serial checks open after the application is reviewed.</p>
          </div>
          <Link href="/partner-portal/apply" className="btn btn-accent shrink-0">
            Become a partner
            <Symbol name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
      </section>
    </>
  );
}
