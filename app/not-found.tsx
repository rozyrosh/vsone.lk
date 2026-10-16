import { PageHero } from "@/components/page-hero";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="That page is not on the grid." summary="The address does not match a VS One page. Head back to the catalog or the home desk." />
      <div className="reveal max-w-canvas mx-auto px-gutter-mobile py-space-3xl">
        <Link href="/" className="font-label-md text-label-md font-semibold text-secondary">Return home →</Link>
      </div>
    </>
  );
}
