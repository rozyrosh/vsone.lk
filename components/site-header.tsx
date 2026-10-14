"use client";

import { LOGO, nav } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Symbol } from "./symbol";

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        setScrolled((prev) => {
          const next = window.scrollY > 24;
          return prev === next ? prev : next;
        });
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-[border-color,box-shadow] duration-500 ease-out border-b bg-panel ${scrolled || open ? "border-hairline shadow-[0_1px_0_rgba(15,17,21,0.03)]" : "border-transparent"}`}>
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm shrink-0" onClick={() => setOpen(false)} aria-label="VS One home">
          <img src={LOGO} alt="VS One" className="h-7 w-auto object-contain block" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {nav.map((item) => {
            const current = active(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`relative px-space-sm py-space-xs rounded-full font-label-md text-label-md transition-colors duration-300 ${current ? "text-graphite font-semibold" : "text-steel hover:text-graphite"}`}
              >
                {item.label}
                <span className={`absolute left-space-sm right-space-sm -bottom-px h-px bg-crimson transition-transform duration-500 ease-out origin-left ${current ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm">
          <Link href="/contact" className="btn btn-ink !h-10 !pl-4 !pr-1.5 text-[13px]">
            <span className="hidden sm:inline">Contact us</span>
            <span className="sm:hidden">Contact</span>
            <span className="dot !w-7 !h-7 !mr-0">
              <Symbol name="arrow_forward" className="text-[15px]" />
            </span>
          </Link>
          <button type="button" className="lg:hidden w-11 h-11 rounded-full border border-hairline bg-panel flex items-center justify-center" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            <Symbol name={open ? "close" : "menu"} className="text-[20px]" />
          </button>
        </div>
      </div>

      {open ? (
        <nav className="lg:hidden border-t border-hairline bg-panel px-gutter-mobile py-space-md flex flex-col gap-1 max-h-[calc(100svh-4rem-env(safe-area-inset-top))] overflow-y-auto" aria-label="Mobile">
          {nav.map((item) => {
            const current = active(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`min-h-11 flex items-center px-space-md py-space-sm rounded-[10px] font-label-md text-label-md ${current ? "bg-mist text-graphite font-semibold" : "text-steel"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
