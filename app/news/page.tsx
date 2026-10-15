import { NewsIndex } from "@/components/news-index";
import { articles } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "News" };

export default function NewsPage() {
  return (
    <div className="relative bg-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-white" />
      <div className="relative z-[1]">
        <NewsIndex articles={articles} />
      </div>
    </div>
  );
}
