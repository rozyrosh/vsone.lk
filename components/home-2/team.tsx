import { teamImage } from "@/lib/content";
import Link from "next/link";
import { Symbol } from "../symbol";
import { TiltedGridHero } from "../ui/tilted-grid-hero";

const frames = [
  { src: teamImage, alt: "The VS One team at the annual partner convention" },
  { src: "/team/vsone-1.webp", alt: "The VS One team at the 5th anniversary celebration" },
  { src: "/team/legacy-awards-stage.jpg", alt: "The VS One Legacy Awards stage" },
  { src: "/team/legacy-awards-partners.jpg", alt: "Partners on stage at the VS One Legacy Awards" },
  { src: "/team/tiandy-launch.jpg", alt: "The VS One team at the Tiandy camera launch" },
  { src: "/team/tiandy-partner-night.jpg", alt: "A speaker at Tiandy Partner Night 2026" },
  { src: "/team/kaspersky-night.jpg", alt: "A speaker at the Kaspersky and VS One partner event" },
];

/*
  The people. Images run around a cylinder: they curve in from one edge,
  sit flat at the centre, and fade off the other side.
*/
export function Team() {
  return (
    <section id="people" data-stop className="reveal bg-white -mb-8 pb-20">
      <TiltedGridHero images={frames} axis={54} tileHeight={27.44} speed={11} className="h-[720px] w-full bg-white">
        <div className="pointer-events-none relative z-10 h-full text-center">
          <p className="people-tilt-kicker pointer-events-auto">
            <i />
            Driven by human expertise
            <i />
          </p>
          <h2 className="people-tilt-title pointer-events-auto mx-auto w-fit">
            The Team Behind Sri Lanka&apos;s
            <br />
            <span className="people-tilt-accent">Fastest Growing</span>
            <br />
            Distributor.
          </h2>
          <div className="people-tilt-foot absolute inset-x-0" style={{ top: "calc(54% + 21.11cqh)" }}>
            <p className="people-tilt-caption pointer-events-auto">
              Equipped with qualified industry professionals with years of experience behind them, we deliver unmatched customer support, technical consultancy, industry knowledge and training that help our partners serve their customers better.
            </p>
            <Link href="/contact" className="btn btn-ink people-tilt-cta pointer-events-auto">
              Talk to Our Team
              <span className="dot">
                <Symbol name="arrow_forward" className="text-[16px]" />
              </span>
            </Link>
          </div>
        </div>
      </TiltedGridHero>
    </section>
  );
}
