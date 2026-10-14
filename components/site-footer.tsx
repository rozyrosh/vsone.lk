import { ADDRESS, EMAIL, LOGO, PHONE_DISPLAY, PHONE_TEL } from "@/lib/content";
import Link from "next/link";
import { SubscribeForm } from "./subscribe-form";
import { Symbol } from "./symbol";

export function SiteFooter() {
  return (
    <footer className="relative w-full border-t border-hairline bg-panel/60 backdrop-blur-sm">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-2xl mb-space-3xl">
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <img src={LOGO} alt="VS One" className="h-9 w-auto object-contain self-start" />
            <p className="font-body-md text-body-md text-steel max-w-sm">Enterprise ICT distribution for Sri Lanka: fifty global brands, one desk in Colombo, every province in two days.</p>
            <address className="not-italic flex flex-col gap-space-xs pt-space-xs font-body-sm text-body-sm text-steel">
              <span className="flex items-start gap-space-xs">
                <Symbol name="location_on" className="text-[18px] text-crimson mt-0.5" />
                <span>{ADDRESS}</span>
              </span>
              <a className="flex items-center gap-space-xs hover:text-graphite transition-colors" href={`tel:${PHONE_TEL}`}>
                <Symbol name="call" className="text-[18px] text-crimson" />
                {PHONE_DISPLAY}
              </a>
              <a className="flex items-center gap-space-xs hover:text-graphite transition-colors" href={`mailto:${EMAIL}`}>
                <Symbol name="mail" className="text-[18px] text-crimson" />
                {EMAIL}
              </a>
            </address>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h2 className="kicker">What we stock</h2>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-steel">
              <li><Link className="hover:text-graphite transition-colors" href="/products?category=compute">Compute</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/products?category=network">Network and security</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/products?category=datacenter">Datacenter</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/products?category=display">Display and audio</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/offerings">All offerings</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <h2 className="kicker">Partners</h2>
            <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-steel">
              <li><Link className="hover:text-graphite transition-colors" href="/partners">Vendors</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/partners">Channels</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/partner-portal/apply">Become a partner</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/partner-portal">Portal login</Link></li>
              <li><Link className="hover:text-graphite transition-colors" href="/news">News</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="panel p-space-lg">
              <h2 className="font-display text-[20px] font-bold tracking-tight text-graphite">Dispatch notes</h2>
              <p className="font-body-sm text-body-sm text-steel mt-1 mb-space-md">Vendor allocations, price list changes and security bulletins. A few times a quarter, never more.</p>
              <SubscribeForm />
            </div>
          </div>
        </div>

        <div className="pt-space-lg border-t border-hairline flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md font-mono text-[11px] tracking-[0.08em] uppercase text-outline">
          <p>© {new Date().getFullYear()} VS One (Pvt) Ltd. Colombo, Sri Lanka.</p>
          <div className="flex flex-wrap items-center gap-space-lg">
            <Link className="hover:text-graphite transition-colors" href="/privacy">Privacy</Link>
            <Link className="hover:text-graphite transition-colors" href="/terms">Terms of distribution</Link>
            <Link className="hover:text-graphite transition-colors" href="/security">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
