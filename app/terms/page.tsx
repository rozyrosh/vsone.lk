import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Distribution" };

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Distribution"
        summary="Catalog listings describe lines VS One distributes. Availability, credit, and pricing are confirmed on an accepted partner account."
      />
      <section className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl flex flex-col gap-space-md font-body-lg text-body-md text-on-surface-variant">
        <p>Submitting a partnership application does not open credit or reserve stock. The desk reviews the channel, then activates portal tools.</p>
        <p>Warranty, DOA, and RMA follow the vendor terms for the serial supplied. The convenience center at Colombo 05 is the intake point for partner returns.</p>
        <p>Published turnaround figures describe the logistics target for authorized partners. Remote sites and vendor backorders can change a specific shipment.</p>
      </section>
    </>
  );
}
