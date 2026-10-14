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
    <section id="people" data-stop className="reveal bg-white -mb-8">
      <TiltedGridHero images={frames} axis={46.44} tileHeight={27.44} speed={11} className="h-[720px] w-full bg-white">
        <div className="relative z-10 h-full text-center">
          <p className="people-tilt-kicker">
            <i />
            The team
            <i />
          </p>
          <h2 className="people-tilt-title">
            The people behind
            <br />
            every <span className="people-tilt-accent">partner</span>.
          </h2>
          <div className="people-tilt-foot absolute inset-x-0" style={{ top: "calc(46.44% + 21.11cqh)" }}>
            <p className="people-tilt-caption">
              Established in 2019, VS One supplies globally acclaimed IT products and solutions to more than 200 partners across Sri Lanka. The team stays with those partners for the long term, with support, technical consultancy and training that help them grow.
            </p>
            <Link href="/contact" className="btn btn-ink people-tilt-cta">
              Contact us
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
