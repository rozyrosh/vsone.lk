"use client";

import { ADDRESS, EMAIL, LOGO, PHONE_DISPLAY, PHONE_TEL, nav } from "@/lib/content";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Symbol } from "./symbol";

const productMenu = [
  { href: "/products?category=compute", icon: "computer", title: "PC & Component", detail: "Notebooks, desktops, printers, monitors, workstations" },
  { href: "/products?category=network", icon: "shield", title: "Network & Security", detail: "Switches, access points, routers, CCTV, endpoint security" },
  { href: "/products?category=datacenter", icon: "dns", title: "Datacenter Equipment", detail: "Servers, storage, UPS systems, racks and enclosures" },
  { href: "/products?category=display", icon: "tv", title: "Display Solutions", detail: "Smart boards, digital signage, displays and controllers" },
  { href: "/products?category=display", icon: "headphones", title: "Audio Solutions", detail: "Call center, conference and industrial audio" },
  { href: "/products?category=mobile", icon: "smartphone", title: "Mobile & Accessories", detail: "Phones, personal gadgets and accessories" },
  { href: "/products?category=automation", icon: "home", title: "Smart Home & Office", detail: "Switches, controllers, sensors, gateways, smart locks" },
  { href: "/products?category=software", icon: "code", title: "Software & Services", detail: "Device management, managed printing, ERP, CRM, design" },
  { href: "/products", icon: "inventory_2", title: "Full catalogue", detail: "Browse every product on the Partner Portal →" },
];

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function itemHref(pathname: string, href: string) {
  const onHome = pathname === "/" || pathname === "/home-2";
  if (href === "/services") return onHome ? "#desk-work" : "/#desk-work";
  if (href === "/offerings") return onHome ? "#stock" : "/#stock";
  if (href === "/partners") return onHome ? "#desk" : "/#desk";
  if (href === "/news") return onHome ? "#news" : "/#news";
  return href;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [barHidden, setBarHidden] = useState(false);
  const closeProductsTimer = useRef<number | null>(null);

  function openProducts() {
    if (closeProductsTimer.current !== null) window.clearTimeout(closeProductsTimer.current);
    setProductsOpen(true);
  }

  function closeProducts() {
    if (closeProductsTimer.current !== null) window.clearTimeout(closeProductsTimer.current);
    closeProductsTimer.current = window.setTimeout(() => setProductsOpen(false), 140);
  }

  useEffect(() => {
    let raf: number | null = null;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;
        setScrolled((prev) => {
          const next = y > 24;
          return prev === next ? prev : next;
        });
        setBarHidden((prev) => {
          let next = prev;
          if (y < 40) next = false;
          else if (delta > 2) next = true;
          else if (delta < -2) next = false;
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

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeProductsTimer.current !== null) window.clearTimeout(closeProductsTimer.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] transition-[border-color,box-shadow,transform] duration-300 ease-out motion-reduce:transition-none border-b bg-panel ${scrolled || open ? "border-hairline shadow-[0_1px_0_rgba(15,17,21,0.03)]" : "border-transparent"} ${barHidden && !open ? "-translate-y-9" : "translate-y-0"}`}>
      <div className="bg-[#013D65] text-white">
        <div className="h-9 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex h-full w-max items-center gap-x-5 px-gutter-mobile lg:px-gutter-desktop whitespace-nowrap font-label-md text-[13px]">
            <a href={`tel:${PHONE_TEL}`} className="hover:text-white/80">{PHONE_DISPLAY}</a>
            <a href={`mailto:${EMAIL}`} className="hover:text-white/80">{EMAIL}</a>
            <span>{ADDRESS.replace(", Sri Lanka", "")}</span>
          </div>
        </div>
      </div>
      <div className="relative max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop h-16 flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm shrink-0" onClick={() => setOpen(false)} aria-label="VS One home">
          <img src={LOGO} alt="VS One" className="h-7 w-auto object-contain block" />
        </Link>

        <nav className="hidden lg:flex lg:absolute lg:left-1/2 lg:-translate-x-1/2 items-center gap-1" aria-label="Primary">
          {nav.map((item) => {
            const current = active(pathname, item.href);
            const href = itemHref(pathname, item.href);
            const products = item.href === "/products";
            return (
              <Link
                key={item.href}
                href={href}
                aria-current={current ? "page" : undefined}
                aria-expanded={products ? productsOpen : undefined}
                aria-haspopup={products ? "true" : undefined}
                onMouseEnter={products ? openProducts : undefined}
                onMouseLeave={products ? closeProducts : undefined}
                onFocus={products ? openProducts : undefined}
                onBlur={products ? closeProducts : undefined}
                className={`relative px-space-sm py-space-xs rounded-full font-label-md text-label-md transition-colors duration-300 ${current || (products && productsOpen) ? "text-graphite font-semibold" : "text-steel hover:text-graphite"}`}
              >
                {item.label}
                <span className={`absolute left-space-sm right-space-sm -bottom-px h-px bg-crimson transition-transform duration-500 ease-out origin-left ${current || (products && productsOpen) ? "scale-x-100" : "scale-x-0"}`} aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/partner-portal/apply" className="btn btn-ink !h-8 !gap-1.5 !pl-2.5 sm:!pl-3 !pr-1 !text-[11px]">
            <span className="hidden sm:inline">Become a partner</span>
            <span className="sm:hidden">Partner</span>
            <span className="dot !w-[22px] !h-[22px] !mr-0">
              <Symbol name="arrow_forward" className="!text-[13px]" />
            </span>
          </Link>
          <Link href="/partner-portal" className="btn btn-ink !h-8 !gap-1.5 !pl-2.5 sm:!pl-3 !pr-1 !text-[11px]">
            <span className="hidden sm:inline">Partner logins</span>
            <span className="sm:hidden">Logins</span>
            <span className="dot !w-[22px] !h-[22px] !mr-0">
              <Symbol name="account_circle" className="!text-[15px]" />
            </span>
          </Link>
          <button type="button" className="lg:hidden w-11 h-11 rounded-full border border-hairline bg-panel flex items-center justify-center" aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}>
            <Symbol name={open ? "close" : "menu"} className="text-[20px]" />
          </button>
        </div>
      </div>

      <div
        className={`hidden lg:block absolute left-0 right-0 top-full border-t border-hairline bg-panel shadow-[0_22px_40px_-28px_rgba(15,17,21,0.45)] transition duration-200 ${productsOpen ? "visible opacity-100" : "invisible pointer-events-none opacity-0"}`}
        onMouseEnter={openProducts}
        onMouseLeave={closeProducts}
      >
        <div className="max-w-canvas mx-auto px-gutter-desktop py-space-xl grid grid-cols-4 gap-x-space-xl gap-y-space-lg">
          {productMenu.map((item) => (
            <Link key={item.title} href={item.href} className="group flex items-start gap-space-sm rounded-[10px] p-space-xs -m-space-xs hover:bg-mist/70">
              <span className="w-11 h-11 rounded-xl bg-crimson/10 text-crimson grid place-items-center shrink-0">
                <Symbol name={item.icon} className="text-[22px]" />
              </span>
              <span>
                <span className="block font-label-md text-[15px] font-semibold text-graphite leading-snug">{item.title}</span>
                <span className="block mt-0.5 font-body-sm text-[13px] leading-snug text-steel">{item.detail}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {open ? (
        <nav className="lg:hidden border-t border-hairline bg-panel px-gutter-mobile py-space-md flex flex-col gap-1 max-h-[calc(100svh-6.25rem-env(safe-area-inset-top))] overflow-y-auto" aria-label="Mobile">
          {nav.map((item) => {
            const current = active(pathname, item.href);
            const href = itemHref(pathname, item.href);
            return (
              <Link key={item.href} href={href} onClick={() => setOpen(false)} className={`min-h-11 flex items-center px-space-md py-space-sm rounded-[10px] font-label-md text-label-md ${current ? "bg-mist text-graphite font-semibold" : "text-steel"}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
