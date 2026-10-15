import { ContactForm } from "@/components/contact-form";
import { PageHero } from "@/components/page-hero";
import { Symbol } from "@/components/symbol";
import { ADDRESS, EMAIL, LOGO, PHONE_DISPLAY, PHONE_TEL, hubs } from "@/lib/content";
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
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl grid grid-cols-1 lg:grid-cols-12 gap-space-2xl">
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <img src={LOGO} alt="VS One" className="h-10 w-auto object-contain self-start" />
          <p className="flex items-start gap-space-xs font-body-md text-body-md text-on-surface-variant">
            <Symbol name="location_on" className="text-[18px] text-crimson mt-0.5 shrink-0" />
            <span>{ADDRESS}</span>
          </p>
          <a className="flex items-center gap-space-xs font-label-md text-label-md font-semibold hover:text-secondary" href={`tel:${PHONE_TEL}`}>
            <Symbol name="call" className="text-[18px] text-crimson shrink-0" />
            {PHONE_DISPLAY}
          </a>
          <a className="flex items-center gap-space-xs font-label-md text-label-md font-semibold hover:text-secondary" href={`mailto:${EMAIL}`}>
            <Symbol name="mail" className="text-[18px] text-crimson shrink-0" />
            {EMAIL}
          </a>
        </div>
        <div className="lg:col-span-8 p-space-lg rounded-[8px] bg-surface-container-lowest shadow-sm">
          <ContactForm />
        </div>
      </section>
      <section id="hubs" className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-4xl">
        <h2 className="font-headline-lg text-headline-lg-mobile font-bold mb-space-lg">Regional dispatch hubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {hubs.map((hub) => (
            <article key={hub.city} className="p-space-lg rounded-2xl bg-surface-container-low">
              <h3 className="font-label-md text-label-md font-bold">{hub.city}</h3>
              <p className="font-label-sm text-label-sm text-secondary mt-space-2xs">{hub.role}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">{hub.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
