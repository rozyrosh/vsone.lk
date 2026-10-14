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
    <>
      <PageHero eyebrow={article.date} title={article.title} summary={article.summary} />
      <article className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl flex flex-col gap-space-md">
        {article.body.map((paragraph) => (
          <p key={paragraph} className="font-body-lg text-body-lg text-on-surface-variant">
            {paragraph}
          </p>
        ))}
        <Link href="/news" className="font-label-md text-label-md font-semibold text-secondary mt-space-md">
          ← All announcements
        </Link>
      </article>
    </>
  );
}
