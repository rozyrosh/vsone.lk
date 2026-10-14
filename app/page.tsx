import { Channels, JoinBanner, NewsStrip } from "@/components/home/channels";
import { Desk } from "@/components/home/desk";
import { Faq } from "@/components/home/faq";
import { Footprint } from "@/components/home/footprint";
import { Hero } from "@/components/home/hero";
import { Metrics } from "@/components/home/metrics";
import { Pillars } from "@/components/home/pillars";
// Hidden. See hidden-sections.txt.
// import { Portal } from "@/components/home/portal";
import { Portfolio } from "@/components/home/portfolio";
import { ChannelSupply } from "@/components/home/channel-supply";
import { Team } from "@/components/home/team";

export default function HomePage() {
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
