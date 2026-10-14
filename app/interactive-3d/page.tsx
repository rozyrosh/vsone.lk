import { SplineSceneBasic } from "@/components/ui/spline-scene-basic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive 3D",
};

export default function Interactive3DPage() {
  return (
    <main className="max-w-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-2xl">
      <p className="kicker mb-space-md">
        <i /> Spline robot
      </p>
      <h1 className="font-display text-[32px] md:text-[40px] font-bold tracking-tight text-graphite mb-space-sm">
        Robot hand tracking
      </h1>
      <p className="font-body-md text-body-md text-steel max-w-2xl mb-space-xl">
        Move your mouse over the robot. Head and hands follow the pointer — that motion is built into the Spline scene, not custom JS.
      </p>
      <SplineSceneBasic />
    </main>
  );
}
