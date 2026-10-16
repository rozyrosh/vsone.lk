import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Symbol } from "@/components/symbol";
import { ADDRESS, EMAIL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the Colombo desk."
        summary="Partnerships, stock, warranty, and Experience Center visits are handled from Thimbirigasyaya Road."
        images={["/contact/1377.jpg"]}
        titleWeight={700}
        overlay="wide"
      />
      <section aria-label="Map of the Colombo desk">
        <iframe
          title="VS One on Google Maps, Thimbirigasyaya Road, Colombo 05"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=16&output=embed`}
          className="block h-[320px] w-full border-0 sm:h-[420px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>

      <section className="border-y border-hairline bg-panel" aria-label="Desk contacts">
        <ul className="max-w-canvas mx-auto grid grid-cols-1 md:grid-cols-3">
          {(
            [
              { icon: "location_on", label: "Address", value: ADDRESS, href: "" },
              { icon: "call", label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}` },
              { icon: "mail", label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
            ] as const
          ).map((item) => {
            const body = (
              <>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#013D65] text-white">
                  <Symbol name={item.icon} className="!text-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-steel">{item.label}</span>
                  <span className="mt-1 block font-label-md text-[15px] font-semibold leading-snug text-graphite">{item.value}</span>
                </span>
              </>
            );
            return (
              <li key={item.label} className="border-b border-hairline last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                {item.href ? (
                  <a href={item.href} className="flex items-start gap-3 px-gutter-mobile py-5 hover:bg-mist/60 lg:px-gutter-desktop">
                    {body}
                  </a>
                ) : (
                  <div className="flex items-start gap-3 px-gutter-mobile py-5 lg:px-gutter-desktop">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="max-w-canvas mx-auto grid grid-cols-1 items-start gap-8 px-gutter-mobile py-12 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] lg:gap-16 lg:px-gutter-desktop lg:py-16">
        <div className="lg:sticky lg:top-28">
          <p className="kicker">
            <i /> Message
          </p>
          <h2 className="mt-3 font-display text-[32px] font-bold leading-tight tracking-tight text-graphite">
            Send a note to <span className="text-[#013D65]">the</span> <span className="text-[#013D65]">desk.</span>
          </h2>
          <p className="mt-3 font-body-md text-[15px] leading-relaxed text-steel">
            Include the bid, the serial, or the visit you need. The reply comes back to the email you enter.
          </p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
