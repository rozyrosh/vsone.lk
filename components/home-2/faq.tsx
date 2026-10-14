import { faqs } from "@/lib/content";
import { Symbol } from "../symbol";

/*
  Straight answers. The real objections resellers raise, answered in one or
  two sentences. A sticky headline on the left, native disclosure rows on the
  right so it works without any JavaScript.
*/
export function Faq() {
  return (
    <section id="answers" data-stop className="answers relative py-space-4xl reveal">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop grid grid-cols-1 lg:grid-cols-12 gap-space-2xl">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <p className="kicker part" style={{ "--i": 0 } as React.CSSProperties}>
            <i /> Straight answers
          </p>
          <h2 className="display part text-headline-lg-mobile lg:text-headline-lg mt-space-sm max-w-[14ch]" style={{ "--i": 1 } as React.CSSProperties}>
            What resellers ask before they apply.
          </h2>
          <p className="part font-body-md text-body-md text-steel mt-space-md max-w-[40ch]" style={{ "--i": 2 } as React.CSSProperties}>
            If yours is not here, the desk picks up at +94 112 592 121 on working days.
          </p>
        </div>
        <div className="lg:col-span-8 border-t border-hairline">
          {faqs.map((item, i) => (
            <details key={item.q} className="faq part group border-b border-hairline" style={{ "--i": 2 + i } as React.CSSProperties}>
              <summary className="flex items-center justify-between gap-space-md py-space-md cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span className="font-display text-[19px] lg:text-[21px] font-bold tracking-tight text-graphite">{item.q}</span>
                <span className="w-9 h-9 rounded-full border border-outline-variant/60 flex items-center justify-center shrink-0 transition-all duration-500 group-open:bg-azure group-open:text-white group-open:border-azure group-open:rotate-45">
                  <Symbol name="add" className="text-[18px]" />
                </span>
              </summary>
              <div className="faq-body">
                <p className="font-body-md text-body-md text-steel pb-space-md max-w-[62ch]">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
