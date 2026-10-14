import { metrics } from "@/lib/content";
import { Count } from "../count";
import { Symbol } from "../symbol";

/*
  Receipts. Quiet supporting strip: short statement on the left, four compact
  figures on the right. No hero-scale type — just a ledger you can skim.
*/
export function Metrics() {
  return (
    <section id="receipts" data-stop className="relative py-space-md lg:py-space-lg reveal" style={{ backgroundColor: "#013D65" }}>
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
          <div className="lg:col-span-4">
            <p className="kicker kicker-on-dark part" style={{ "--i": 0 } as React.CSSProperties}>
              <i /> Receipts
            </p>
            <h2
              className="display part text-[22px] lg:text-[26px] leading-tight mt-space-xs max-w-[18ch]"
              style={{ "--i": 1, color: "#fff" } as React.CSSProperties}
            >
              Numbers a reseller can check.
            </h2>
            <p className="part font-body-sm text-body-sm text-white/75 mt-space-xs max-w-[40ch]" style={{ "--i": 2 } as React.CSSProperties}>
              Partners on the portal, brands on the bench, provinces that get a box inside two days.
            </p>
          </div>
          <dl className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-x-space-md gap-y-space-md">
            {metrics.map((item, i) => (
              <div key={item.label} className="part relative pl-space-sm border-l border-white/25" style={{ "--i": 2 + i } as React.CSSProperties}>
                <dt className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/70">
                  <Symbol name={item.icon} className="text-[14px] text-white" />
                  {item.label}
                </dt>
                <dd className="mt-1">
                  <span className="display text-[28px] leading-none lg:text-[32px] tabular-nums" style={{ color: "#fff" }}>
                    <Count value={item.value} />
                    <span className="text-[0.55em] align-baseline ml-0.5" style={{ color: "#fff" }}>{item.suffix}</span>
                  </span>
                  <p className="font-body-sm text-[12px] leading-snug text-white/75 mt-1 max-w-[22ch]">{item.detail}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
