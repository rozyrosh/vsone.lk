import { PageHero } from "@/components/page-hero";
import { articles, getArticle } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  return { title: article?.title ?? "Announcement" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="relative bg-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-white" />
      <div className="relative z-[1]">
      <PageHero eyebrow={article.date} title={article.title} summary={article.summary} tone="blue" />
      <article className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-3xl pb-space-3xl grid grid-cols-1 lg:grid-cols-2 gap-space-xl lg:gap-space-2xl items-start">
        <img src={article.image} alt="" className="w-full aspect-[4/3] object-cover rounded-md" />
        <div className="flex flex-col gap-space-md">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="font-body-lg text-body-lg text-on-surface-variant">
              {paragraph}
            </p>
          ))}
          <Link href="/news" className="font-label-md text-label-md font-semibold text-secondary mt-space-md">
            ← All announcements
          </Link>
        </div>
      </article>
      </div>
    </div>
  );
}
