import { PageHero } from "@/components/page-hero";
import { Symbol } from "@/components/symbol";
import { services } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Distribution, engineering, and after-sales in one desk."
        summary="VS One runs allocation, pre-sales, island logistics, and warranty from Colombo so partners do not chase five vendors for one project."
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl reveal">
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-hairline">
          {services.map((service, i) => (
            <li key={service.title} className="part p-space-lg border-b border-r border-hairline hover:bg-panel transition-colors duration-500" style={{ "--i": i } as React.CSSProperties}>
              <div className="flex items-center justify-between">
                <span className="w-11 h-11 rounded-[12px] bg-mist border border-hairline flex items-center justify-center text-graphite">
                  <Symbol name={service.icon} className="text-[22px]" />
                </span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-outline">0{i + 1}</span>
              </div>
              <h2 className="font-display text-[20px] font-bold tracking-tight text-graphite mt-space-md">{service.title}</h2>
              <p className="font-body-sm text-body-sm text-steel mt-space-xs">{service.summary}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-4xl reveal">
        <div className="panel part p-space-lg lg:p-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
          <div>
            <p className="kicker">
              <i /> Experience Center
            </p>
            <h2 className="font-display text-[26px] font-bold tracking-tight text-graphite mt-space-xs">See it running before you order it.</h2>
            <p className="font-body-md text-body-md text-steel mt-space-xs max-w-xl">Live smart boards, conference audio and dense compute, staged to your bill of materials in Colombo.</p>
          </div>
          <Link href="/contact" className="btn btn-ink shrink-0">
            Request a visit
            <span className="dot">
              <Symbol name="arrow_forward" className="text-[16px]" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
