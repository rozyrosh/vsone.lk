"use client";

import type { Article } from "@/lib/content";
import Link from "next/link";
import { useMemo, useState } from "react";

const PAGE_SIZE = 3;

function minutes(article: Article) {
  const words = `${article.summary} ${article.body.join(" ")}`.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 180));
}

function shortDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function meta(article: Article) {
  return `${shortDate(article.date)}  ·  ${minutes(article)} min read`;
}

export function NewsIndex({ articles }: { articles: Article[] }) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [page, setPage] = useState(0);
  const count = articles.length;
  const featured = articles[featuredIndex] ?? articles[0];
  const latest = useMemo(() => {
    if (!featured) return [];
    return articles.filter((article) => article.slug !== featured.slug);
  }, [articles, featured]);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const grid = articles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function cycle(step: number) {
    if (count < 2) return;
    setFeaturedIndex((index) => (index + step + count) % count);
  }

  if (!featured) return null;

  return (
    <section className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)] gap-space-xl lg:gap-space-2xl items-start">
        <Link href={`/news/${featured.slug}`} className="group block">
          <article className="relative overflow-hidden rounded-md aspect-[16/10] bg-surface-container">
            <img src={featured.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-space-lg lg:p-space-xl text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-label-md text-[13px] text-graphite">
                <i className="w-1.5 h-1.5 rounded-full bg-crimson" />
                {featured.category}
              </span>
              <h2 className="mt-space-sm font-headline-md text-[28px] lg:text-[34px] leading-[1.15] font-semibold max-w-[22ch]" style={{ color: "#fff" }}>
                {featured.title}
              </h2>
              <p className="mt-space-sm font-body-md text-[14px] text-white/80">{meta(featured)}</p>
            </div>
          </article>
        </Link>

        <aside>
          <div className="flex items-center justify-between gap-space-md mb-space-lg">
            <h2 className="font-headline-md text-[22px] font-semibold">Latest post</h2>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous announcement" onClick={() => cycle(-1)} disabled={count < 2} className="w-9 h-9 rounded-full border border-hairline grid place-items-center text-graphite disabled:opacity-40">
                <Chevron dir="left" />
              </button>
              <button type="button" aria-label="Next announcement" onClick={() => cycle(1)} disabled={count < 2} className="w-9 h-9 rounded-full border border-hairline grid place-items-center text-graphite disabled:opacity-40">
                <Chevron dir="right" />
              </button>
            </div>
          </div>
          <ul className="flex flex-col gap-space-md">
            {latest.map((article) => (
              <li key={article.slug}>
                <Link href={`/news/${article.slug}`} className="flex gap-space-md items-center group">
                  <img src={article.image} alt="" className="w-[72px] h-[72px] rounded-sm object-cover shrink-0 bg-surface-container" />
                  <span>
                    <span className="block font-body-md text-[15px] font-semibold leading-snug group-hover:text-secondary">{article.title}</span>
                    <span className="block mt-1 font-body-md text-[13px] text-steel">{meta(article)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-xl mt-space-3xl">
        {grid.map((article) => (
          <article key={article.slug}>
            <Link href={`/news/${article.slug}`} className="group block">
              <img src={article.image} alt="" className="w-full aspect-[16/10] object-cover rounded-md bg-surface-container" />
              <p className="mt-space-md inline-flex items-center gap-2 font-label-md text-[13px] text-steel">
                <i className="w-1.5 h-1.5 rounded-full bg-crimson" />
                {article.category}
              </p>
              <h3 className="mt-space-xs font-headline-md text-[22px] leading-snug font-semibold group-hover:text-secondary">{article.title}</h3>
              <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant line-clamp-3">{article.summary}</p>
              <p className="mt-space-sm font-body-md text-[13px] text-steel">{meta(article)}</p>
            </Link>
          </article>
        ))}
      </div>

      <nav className="mt-space-3xl flex items-center justify-center gap-2" aria-label="Announcement pages">
        <button type="button" aria-label="Previous page" disabled={page === 0} onClick={() => setPage((value) => Math.max(0, value - 1))} className="w-10 h-10 rounded-full border border-hairline grid place-items-center text-graphite disabled:opacity-40">
          <Chevron dir="left" />
        </button>
        {Array.from({ length: pages }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Page ${index + 1}`}
            aria-current={index === page ? "page" : undefined}
            onClick={() => setPage(index)}
            className={`w-10 h-10 rounded-full font-label-md text-[14px] ${index === page ? "bg-graphite text-white" : "text-steel"}`}
            style={index === page ? { color: "#fff" } : undefined}
          >
            {index + 1}
          </button>
        ))}
        <button type="button" aria-label="Next page" disabled={page >= pages - 1} onClick={() => setPage((value) => Math.min(pages - 1, value + 1))} className="w-10 h-10 rounded-full border border-hairline grid place-items-center text-graphite disabled:opacity-40">
          <Chevron dir="right" />
        </button>
      </nav>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={dir === "left" ? "rotate-180" : undefined}>
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
