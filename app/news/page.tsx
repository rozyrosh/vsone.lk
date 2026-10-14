import { PageHero } from "@/components/page-hero";
import { articles } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Announcements"
        title="Inside VS One."
        summary="Service center, experience floor, and portal releases from the Colombo desk."
      />
      <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl grid gap-space-lg">
        {articles.map((article) => (
          <article key={article.slug} className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div>
              <span className="font-label-sm text-label-sm text-outline">{article.date}</span>
              <h2 className="font-headline-md text-headline-md font-bold mt-space-2xs">{article.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-3xl">{article.summary}</p>
            </div>
            <Link href={`/news/${article.slug}`} className="font-label-md text-label-md font-semibold text-secondary shrink-0">
              Read announcement →
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
