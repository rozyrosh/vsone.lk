import { ApplyForm } from "@/components/apply-form";
import { PageHero } from "@/components/page-hero";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Apply for partnership" };

export default function ApplyPage() {
  return (
    <div className="apply-stage">
      <div className="apply-mist ink" aria-hidden="true" />
      <div className="apply-mist blue" aria-hidden="true" />
      <div className="apply-mist shade" aria-hidden="true" />
      <div className="apply-grid" aria-hidden="true" />
      <div className="relative">
      <PageHero
        align="center"
        onDark
        eyebrow="Partner Portal"
        title="Apply for a distribution account."
        summary="Tell us the channel you operate. After review, the same email and password open stock, warranty, and shipment tools."
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-3xl">
        <div className="max-w-3xl mx-auto p-space-lg md:p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm">
          <ApplyForm />
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-lg">
            Already applied? <Link href="/partner-portal" className="text-secondary font-semibold">Sign in</Link>
          </p>
        </div>
      </section>
      </div>
    </div>
  );
}
