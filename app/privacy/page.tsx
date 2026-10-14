import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        summary="VS One (Pvt) Ltd collects only what a partnership, inquiry, or dispatch subscription needs."
      />
      <section className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl flex flex-col gap-space-md font-body-lg text-body-md text-on-surface-variant">
        <p>Contact forms store your name, company, email, phone, topic, and message so the Colombo desk can reply. Partnership applications also store the channel, city, and a hashed password for the portal.</p>
        <p>Corporate Dispatch stores the email you submit. We do not sell these records. Access is limited to VS One staff handling distribution, support, and partner onboarding.</p>
        <p>To correct or remove a record, email info@vsone.lk with the reference number from your confirmation.</p>
      </section>
    </>
  );
}
