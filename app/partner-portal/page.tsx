import { PageHero } from "@/components/page-hero";
import { LoginForm, LogoutButton } from "@/components/portal-auth";
import { readSessionEmail } from "@/lib/session";
import { findPartner, publicPartner } from "@/lib/store";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Partner Portal" };

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const email = await readSessionEmail();
  const partner = email ? await findPartner(email) : null;
  const profile = partner ? publicPartner(partner) : null;

  return (
    <>
      <PageHero
        eyebrow="Partner Portal"
        title={profile ? `Welcome, ${profile.company}.` : "Sign in to the ERP partner portal."}
        summary={
          profile
            ? "Your application is on file. Stock checks and credit requests open when the desk marks the account active."
            : "Use the email and password from your partnership application. New resellers can apply in a few minutes."
        }
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg max-w-4xl">
            <article className="panel p-space-lg">
              <p className="kicker">
                <i /> Application
              </p>
              <h2 className="font-headline-md text-headline-md font-bold mt-space-xs">{profile.id}</h2>
              <dl className="mt-space-md flex flex-col gap-space-xs font-body-sm text-body-sm">
                <div className="flex justify-between gap-space-md"><dt className="text-on-surface-variant">Status</dt><dd className="font-semibold">{profile.status}</dd></div>
                <div className="flex justify-between gap-space-md"><dt className="text-on-surface-variant">Contact</dt><dd>{profile.contact}</dd></div>
                <div className="flex justify-between gap-space-md"><dt className="text-on-surface-variant">Channel</dt><dd>{profile.channel}</dd></div>
                <div className="flex justify-between gap-space-md"><dt className="text-on-surface-variant">City</dt><dd>{profile.city}</dd></div>
                <div className="flex justify-between gap-space-md"><dt className="text-on-surface-variant">Email</dt><dd>{profile.email}</dd></div>
              </dl>
              <div className="mt-space-lg">
                <LogoutButton />
              </div>
            </article>
            <article className="panel p-space-lg bg-mist/60">
              <p className="kicker">
                <i /> Under review
              </p>
              <h2 className="font-display text-[22px] font-bold tracking-tight text-graphite mt-space-xs">While the desk reviews the account</h2>
              <ul className="mt-space-md flex flex-col gap-space-sm font-body-md text-body-md text-steel list-disc pl-5">
                <li>Browse the public catalog for brands and categories.</li>
                <li>Call +94 112 592 121 if a bid needs a same-day allocation.</li>
                <li>Warranty and serial tools appear here once the desk activates the account.</li>
              </ul>
              <Link href="/products" className="u-line inline-flex items-center gap-2 mt-space-lg font-label-md text-label-md font-semibold text-graphite">
                Open the catalog
                <span className="text-crimson" aria-hidden="true">
                  →
                </span>
              </Link>
            </article>
          </div>
        ) : (
          <div className="panel p-space-lg md:p-space-xl max-w-xl">
            <LoginForm />
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-lg">
              No account yet? <Link href="/partner-portal/apply" className="text-secondary font-semibold">Apply for partnership</Link>
            </p>
          </div>
        )}
      </section>
    </>
  );
}
