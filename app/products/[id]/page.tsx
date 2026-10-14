import { catalogFilters, categoryLabel, getProduct, products } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
  return { title: product ? `${product.brand} ${product.name}` : "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const category = catalogFilters.find((item) => item.slug === product.category);

  return (
    <div className="bg-surface">
      <div className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-space-lg">
          <Link href="/products" className="hover:text-on-surface">Catalog</Link>
          <span className="px-space-2xs">/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-on-surface">{category?.label ?? categoryLabel(product.category)}</Link>
          <span className="px-space-2xs">/</span>
          <span className="text-on-surface">{product.name}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-2xl items-start">
          <div className="rounded-[8px] overflow-hidden bg-surface-container-low border border-surface-variant/70">
            <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" />
          </div>
          <div className="flex flex-col gap-space-md">
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-semibold">{product.brand}</p>
            <h1 className="font-headline-lg text-headline-lg-mobile lg:text-[36px] lg:leading-[42px] font-bold tracking-tight">{product.name}</h1>
            <p className="font-body-lg text-body-md text-on-surface-variant max-w-xl">{product.summary}</p>
            <dl className="grid grid-cols-2 gap-space-sm max-w-md">
              <div className="rounded-2xl bg-surface-container-low p-space-md">
                <dt className="font-label-sm text-label-sm text-outline">SKU</dt>
                <dd className="font-label-md text-label-md font-semibold mt-space-2xs">{product.sku}</dd>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-space-md">
                <dt className="font-label-sm text-label-sm text-outline">Channel</dt>
                <dd className="font-label-md text-label-md font-semibold mt-space-2xs">Partner allocation</dd>
              </div>
            </dl>
            <p className="font-body-sm text-body-sm text-on-surface-variant">This is a catalog listing. Pricing is quoted to authorized partners and is not shown on this page.</p>
            <div className="flex flex-col sm:flex-row gap-space-sm pt-space-xs">
              <Link href="/contact" className="inline-flex justify-center px-space-xl py-space-sm rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold">
                Request allocation
              </Link>
              <Link href="/partner-portal" className="inline-flex justify-center px-space-xl py-space-sm rounded-full border border-outline-variant font-label-md text-label-md font-semibold">
                Check stock in the portal
              </Link>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-space-3xl">
            <h2 className="font-headline-md text-headline-md font-semibold mb-space-md">More in {category?.label ?? "this category"}</h2>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {related.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="rounded-[8px] bg-surface-container-low overflow-hidden border border-surface-variant/70 hover:shadow-md transition-shadow">
                  <img src={item.image} alt="" className="w-full aspect-[4/3] object-cover" />
                  <span className="block p-space-sm">
                    <span className="block font-label-sm text-label-sm uppercase text-secondary">{item.brand}</span>
                    <span className="block font-label-md text-label-md font-semibold text-on-surface">{item.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
