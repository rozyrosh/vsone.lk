import { Channels, JoinBanner, NewsStrip } from "@/components/home-2/channels";
import { Desk } from "@/components/home-2/desk";
import { Faq } from "@/components/home-2/faq";
import { Footprint } from "@/components/home-2/footprint";
import { Hero } from "@/components/home-2/hero";
import { Metrics } from "@/components/home-2/metrics";
import { Pillars } from "@/components/home-2/pillars";
// Hidden. See hidden-sections.txt.
// import { Portal } from "@/components/home-2/portal";
import { Portfolio } from "@/components/home-2/portfolio";
import { ChannelSupply } from "@/components/home-2/channel-supply";
import { Team } from "@/components/home-2/team";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Home 2" };

export default function HomeTwoPage() {
  return (
    <>
      <Hero />
      <Desk />
      <Metrics />
      <Pillars />
      <Portfolio />
      <ChannelSupply />
      {/* Hidden. See hidden-sections.txt.
      <Portal />
      */}
      <Footprint />
      <Channels />
      <Team />
      <Faq />
      <NewsStrip />
      <JoinBanner />
    </>
  );
}
