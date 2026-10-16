import { LoginForm, LogoutButton } from "@/components/portal-auth";
import { readSessionEmail } from "@/lib/session";
import { findPartner, publicPartner } from "@/lib/store";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Partner Portal" };

export const dynamic = "force-dynamic";

const deskFacts = [
  { label: "Stock", detail: "What is on the shelf" },
  { label: "Credit", detail: "What the line covers" },
  { label: "Serial", detail: "Where the box is now" },
];

export default async function PortalPage() {
  const email = await readSessionEmail();
  const partner = email ? await findPartner(email) : null;
  const profile = partner ? publicPartner(partner) : null;

  return (
    <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-8 lg:py-14">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[24px] border border-hairline bg-panel shadow-panel lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,0.95fr)]">
        <aside className="relative flex flex-col justify-between gap-10 bg-[#013D65] px-7 py-8 text-white sm:px-10 sm:py-11">
          <div>
            <p className="kicker kicker-on-dark">
              <i /> Partner Portal
            </p>
            <h1 className="display mt-4 max-w-[13ch] text-[34px] sm:text-[44px]" style={{ color: "#fff", fontWeight: 700 }}>
              {profile ? `Welcome, ${profile.company}.` : "Sign in to the ERP partner portal."}
            </h1>
            <p className="mt-4 max-w-[36ch] font-body-md text-[15px] leading-relaxed text-white/75">
              {profile
                ? "Your application is on file. Stock checks and credit requests open when the desk marks the account active."
                : "Use the email and password from your partnership application. New resellers can apply in a few minutes."}
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {deskFacts.map((fact) => (
              <li key={fact.label} className="border-t border-white/15 pt-3">
                <span className="block font-label-md text-[13px] font-semibold">{fact.label}</span>
                <span className="mt-0.5 block font-body-sm text-[13px] text-white/70">{fact.detail}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-11">
          {profile ? (
            <div>
              <p className="kicker">
                <i /> Application
              </p>
              <h2 className="mt-3 font-display text-[28px] font-bold tracking-tight text-graphite">{profile.id}</h2>
              <dl className="mt-6 divide-y divide-hairline font-body-md text-[14px]">
                {(
                  [
                    ["Status", profile.status],
                    ["Contact", profile.contact],
                    ["Channel", profile.channel],
                    ["City", profile.city],
                    ["Email", profile.email],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-steel">{label}</dt>
                    <dd className="text-right font-semibold text-graphite">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <LogoutButton />
                <Link href="/products" className="font-label-md text-[14px] font-semibold text-graphite underline decoration-crimson/50 underline-offset-4">
                  Open the catalog
                </Link>
              </div>
              <p className="mt-6 font-body-sm text-[13px] leading-relaxed text-steel">
                Browse the public catalog while the desk reviews the account. Call +94 112 592 121 if a bid needs a same-day allocation. Warranty and serial tools appear here once the account is active.
              </p>
            </div>
          ) : (
            <>
              <LoginForm />
              <p className="mt-6 font-body-md text-[14px] text-steel">
                No account yet?{" "}
                <Link href="/partner-portal/apply" className="font-semibold text-secondary">
                  Apply for partnership
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
