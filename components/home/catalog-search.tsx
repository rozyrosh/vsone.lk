"use client";

import { searchCatalog } from "@/lib/content";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Symbol } from "../symbol";

export function CatalogSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => (query.trim().length < 2 ? [] : searchCatalog(query).slice(0, 6)), [query]);

  function go(event?: FormEvent) {
    event?.preventDefault();
    const value = query.trim();
    if (!value) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(value)}`);
  }

  return (
    <div className="w-full relative">
      <form
        onSubmit={go}
        className="catalog-search relative w-full rounded-[14px] bg-panel border border-outline-variant/60 focus-within:border-graphite shadow-panel p-1.5 flex items-center gap-space-xs transition-colors duration-300"
      >
        <span className="w-9 h-9 rounded-[10px] bg-mist flex items-center justify-center text-steel shrink-0">
          <Symbol name="search" className="text-[18px]" />
        </span>
        <label htmlFor="distributionSearch" className="sr-only">
          Search the catalog
        </label>
        <input
          id="distributionSearch"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          className="min-w-0 w-full bg-transparent border-none outline-none font-body-md text-body-md text-graphite placeholder:text-outline px-space-xs"
          placeholder="Search a product, brand or SKU. Try Cisco, PowerEdge or FortiGate"
          type="search"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-ink !h-9 !px-4 text-[13px] shrink-0">
          Search
        </button>
      </form>
      {open && results.length > 0 ? (
        <ul className="absolute left-0 right-0 top-[56px] z-30 rounded-[14px] bg-panel shadow-lift border border-hairline overflow-hidden text-left">
          {results.map((item) => (
            <li key={item.id}>
              <Link href={`/products/${item.id}`} className="flex items-center gap-space-sm px-space-sm py-space-xs hover:bg-mist transition-colors" onClick={() => setOpen(false)}>
                <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-mist shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-label-md text-label-md font-semibold text-graphite truncate">{item.name}</span>
                  <span className="block font-body-sm text-body-sm text-steel">{item.brand}</span>
                </span>
                <span className="font-mono text-[11px] tracking-wider text-outline">{item.sku}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
