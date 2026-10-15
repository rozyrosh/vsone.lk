import { PageHero } from "@/components/page-hero";
import { offerings } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Offerings" };

const badge = {
  dark: "bg-primary text-on-primary",
  crimson: "bg-secondary text-on-secondary",
  muted: "bg-surface-variant text-on-surface",
};

export default function OfferingsPage() {
  return (
    <>
      <PageHero
        eyebrow="Offerings"
        title="More than 50 hardware and software categories."
        summary="The bench covers compute, security, datacenter, rooms, mobile, software, and smart office."
        image="/hero/hero-poster.jpg"
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {offerings.map((item) => (
          <article key={item.slug} className="grid md:grid-cols-2 rounded-md bg-surface-container-lowest shadow-sm overflow-hidden">
            <img src={item.image} alt={item.alt} className="h-48 md:h-full w-full object-cover" />
            <div className="p-space-lg flex flex-col">
              <span className={`self-start px-space-xs py-space-2xs rounded-sm font-label-sm text-label-sm ${badge[item.badgeTone]}`}>{item.badge}</span>
              <h2 className="font-headline-md text-headline-md font-semibold mt-space-sm">{item.title}</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs flex-1">{item.summary}</p>
              <Link href={`/products?category=${item.slug}`} className="font-label-md text-label-md font-semibold text-secondary mt-space-md">
                Open catalog →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
