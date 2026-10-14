import { catalogBrands, catalogFilters, products, searchCatalog } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Products" };

function catalogHref(next: { q?: string; category?: string; brand?: string; sort?: string }) {
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.category) params.set("category", next.category);
  if (next.brand) params.set("brand", next.brand);
  if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
  const query = params.toString();
  return query ? `/products?${query}` : "/products";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category ?? "";
  const brand = params.brand ?? "";
  const sort = params.sort === "name" || params.sort === "brand" ? params.sort : "featured";
  const items = searchCatalog(q, category || undefined, brand || undefined).slice().sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "brand") return a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="bg-surface-container-low min-h-screen">
      {/* Hidden. See hidden-sections.txt. Restore categoryLabel in the import above when this block is shown again.
      <section className="bg-surface border-b border-surface-variant/70">
        <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-secondary">Catalog</span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-[36px] lg:leading-[42px] font-bold tracking-tight text-on-surface mt-space-2xs">
            {category ? categoryLabel(category) : "Partner product catalog"}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-space-xs">
            Sample photography for the lines VS One distributes. Availability is confirmed in the partner portal. Prices are not listed here.
          </p>
        </div>
      </section>
      */}

      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-space-xl">
        <aside className="flex flex-col gap-space-lg lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <form action="/products" className="flex flex-col gap-space-sm">
            {category ? <input type="hidden" name="category" value={category} /> : null}
            {brand ? <input type="hidden" name="brand" value={brand} /> : null}
            <label className="sr-only" htmlFor="catalog-q">Search the catalog</label>
            <input
              id="catalog-q"
              name="q"
              defaultValue={q}
              placeholder="Search laptops, brands, SKUs"
              className="w-full h-9 px-space-sm rounded-[8px] bg-white border border-outline-variant font-body-md text-[14px]"
            />
            <button className="self-start px-space-lg py-space-xs rounded-[8px] bg-[#013D65] text-on-primary font-label-md text-label-md font-semibold" type="submit">
              Search
            </button>
          </form>

          <div>
            <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-xs">Category</h2>
            <ul className="flex lg:flex-col gap-space-2xs overflow-x-auto">
              <li>
                <Link href={catalogHref({ q, brand, sort })} className={`block whitespace-nowrap px-space-sm py-space-xs rounded-[8px] font-label-md text-label-md ${category ? "text-on-surface-variant hover:bg-white" : "bg-[#013D65] text-on-primary"}`}>
                  All products
                </Link>
              </li>
              {catalogFilters.map((item) => {
                const count = products.filter((product) => product.category === item.slug).length;
                const active = category === item.slug;
                return (
                  <li key={item.slug}>
                    <Link href={catalogHref({ q, brand, sort, category: item.slug })} className={`flex items-center justify-between gap-space-sm whitespace-nowrap px-space-sm py-space-xs rounded-[8px] font-label-md text-label-md ${active ? "bg-[#013D65] text-on-primary" : "text-on-surface hover:bg-white"}`}>
                      <span>{item.label}</span>
                      <span className={active ? "text-white/70" : "text-outline"}>{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-xs">Brand</h2>
            <ul className="flex flex-wrap gap-space-2xs">
              {catalogBrands.map((item) => (
                <li key={item}>
                  <Link href={catalogHref({ q, category, sort, brand: brand === item ? "" : item })} className={`inline-block px-space-sm py-space-2xs rounded-full border font-label-sm text-label-sm ${brand === item ? "bg-[#013D65] text-on-primary border-[#013D65]" : "bg-white border-outline-variant text-on-surface"}`}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <p className="font-label-md text-label-md text-on-surface-variant">
              {items.length} {items.length === 1 ? "product" : "products"}
              {q ? ` for “${q}”` : ""}
              {brand ? ` · ${brand}` : ""}
            </p>
            <div className="flex items-center gap-space-2xs">
              {[
                { id: "featured", label: "Featured" },
                { id: "name", label: "Name" },
                { id: "brand", label: "Brand" },
              ].map((option) => (
                <Link
                  key={option.id}
                  href={catalogHref({ q, category, brand, sort: option.id })}
                  className={`px-space-sm py-space-2xs rounded-full font-label-sm text-label-sm ${sort === option.id ? "bg-[#013D65] text-on-primary" : "bg-white text-on-surface-variant"}`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl bg-white p-space-xl">
              <p className="font-body-md text-body-md text-on-surface">Nothing in the catalog matches that filter.</p>
              <Link href="/products" className="inline-block mt-space-sm font-label-md text-label-md font-semibold text-secondary">Clear filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-space-md">
              {items.map((item) => (
                <article key={item.id} className="group flex flex-col rounded-[8px] bg-white border border-surface-variant/80 overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/products/${item.id}`} className="block bg-surface-container aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="flex flex-col flex-1 p-space-md gap-space-2xs">
                    <p className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">{item.brand}</p>
                    <h2 className="font-label-md text-[16px] leading-5 font-semibold text-on-surface">
                      <Link href={`/products/${item.id}`} className="hover:text-secondary">{item.name}</Link>
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 flex-1">{item.summary}</p>
                    <p className="font-label-sm text-label-sm text-outline pt-space-xs">SKU {item.sku}</p>
                    <Link href={`/products/${item.id}`} className="font-label-sm text-label-sm font-semibold text-secondary mt-space-xs">
                      View product
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
