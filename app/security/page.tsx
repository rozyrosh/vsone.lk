import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Security & Compliance" };

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Security & Compliance"
        summary="Portal passwords are hashed before they are stored. The session cookie is httpOnly and stays on this site."
      />
      <section className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl flex flex-col gap-space-md font-body-lg text-body-md text-on-surface-variant">
        <p>Sign-in uses the email from your application. Passwords are stored with a unique salt and are not kept in plain text. Sessions expire after seven days or when you sign out.</p>
        <p>Do not share portal credentials across staff who should not see credit or serial data. Report a suspected account issue to info@vsone.lk.</p>
      </section>
    </>
  );
}
