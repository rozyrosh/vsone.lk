"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Symbol } from "../symbol";

/* ── the curved row ──────────────────────────────────────────────
 * Scroll Tilted Grid turned on its side, with the tilt drawn as a curve.
 * One row of images streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end image curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * strips sit still inside their tile, each turned its own few degrees
 * round the cylinder's axis, and the tile (preserve-3d) is what moves: one
 * rotateY about that same axis carries the whole tile along the arc. A
 * tile is one animation, so its strips can never drift apart or show
 * different images. Only a tile's delay differs, and that sets where on
 * the arc it sits. The band is transform-only on the compositor; the fade
 * is a static mask over it.
 *
 * The only JS is a ResizeObserver that sizes the loop, and a handler that
 * hands a tile its next image each time it wraps, out of sight.
 * ─────────────────────────────────────────────────────────────── */

// Strips per tile. Each is a few degrees of arc, too little to read as a
// facet; fewer starts to show corners along the top and bottom edges. A
// tight curve wraps a tile round a wide arc, so it needs this many.
const SLICES = 16;

// Camera distance from the screen, as a multiple of the cylinder's radius.
// Just past the axis, so the ends come right up to the lens and swell; much
// further back and the row flattens out however tight the cylinder.
const CAMERA = 1.6;

/**
 * Cylinder radius, as a share of the hero's width, that puts the frame's
 * edge `bend` radians round the arc as seen through the camera:
 * r·sinθ · CAMERA / (CAMERA − 1 + cosθ) = width / 2, solved for r.
 */
function arc(bend: number) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

// A tile is never wider than this share of the hero, so a phone still
// shows its neighbours instead of one tile edge to edge.
const MAX_WIDTH = 55;

/**
 * Lays the loop on the cylinder. The radius puts the frame's edge `bend`
 * radians round the arc (see `arc`). Angles come back in degrees: `unit`
 * is the arc one tile-height spans, `limit` how far round a tile's centre
 * can go before the whole tile is off-screen, and `sweep` how far round
 * the loop's ends sit. The loop reaches past `limit`, so a tile only ever
 * wraps out of sight, and is rounded up to a whole number of tiles so the
 * gap never stretches.
 */
function measure(
  width: number,
  height: number,
  tile: number,
  aspect: number,
  gap: number,
  bend: number,
) {
  const h = Math.min(
    (tile / 100) * height,
    ((MAX_WIDTH / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad: number) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  // Capped so a hero squeezed to a sliver can't mount thousands of tiles.
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n: number) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

export type TiltedGridImage = {
  src: string;
  /** Only used if you drop the decorative treatment; the band is aria-hidden. */
  alt?: string;
};

export type TiltedGridHeroProps = {
  /**
   * Images run along the row in order. A tile takes its next image each
   * time it wraps, which is out of sight, so the whole list plays through however
   * few tiles the frame needs. Short lists simply repeat.
   */
  images: TiltedGridImage[];
  /**
   * Seconds for the row to advance by one tile. Speed is per tile, not per
   * crossing, so a phone and an ultrawide move at the same pace.
   * @default 4
   */
  speed?: number;
  /** Tile height, as a percentage of the hero's height. @default 26 */
  tileHeight?: number;
  /** Tile width divided by tile height. @default 16 / 9 */
  aspectRatio?: number;
  /** Space between tiles, as a percentage of a tile's height. @default 6 */
  gap?: number;
  /** Vertical centre of the row, as a percentage of the hero's height. @default 56 */
  axis?: number;
  /**
   * How far the row has bent round by the frame's edge, in degrees. Higher
   * curls the ends harder toward the viewer. Clamped to 5–85.
   * @default 80
   */
  curve?: number;
  /** Width of the fade at each end, as a percentage of the hero's width. @default 12 */
  fade?: number;
  /** Content rendered above the band. */
  children?: React.ReactNode;
  className?: string;
};

export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & TiltedGridHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `tgh-o-${id}`;
  const tile = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  // Null until the observer has measured the hero. The band stays hidden
  // until then, so a first paint laid out for the wrong size never shows.
  const [layout, setLayout] = React.useState<ReturnType<typeof measure> | null>(
    null,
  );

  // The image each tile shows, as a position in the run of images. It
  // only changes when the tile wraps, which is out of sight, so a resize
  // never swaps an image on screen either.
  const [shown, setShown] = React.useState<Record<number, number>>({});
  const [hover, setHover] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [open, setOpen] = React.useState<TiltedGridImage | null>(null);
  const paused = hover || drag || open != null;
  const dragRef = React.useRef<{
    x: number;
    moved: boolean;
    width: number;
    anims: Animation[];
    times: number[];
  } | null>(null);
  const suppressClick = React.useRef(false);

  // One tile of travel takes `speed` seconds. Dragging follows the pointer,
  // so a move to the right scrubs the loop backward.
  const scrub = (event: React.PointerEvent<HTMLButtonElement>) => {
    const dragState = dragRef.current;
    if (!dragState) return;
    const dx = event.clientX - dragState.x;
    if (Math.abs(dx) > 8) dragState.moved = true;
    const shift = -(dx / dragState.width) * speed * 1000;
    dragState.anims.forEach((anim, index) => {
      anim.currentTime = dragState.times[index] + shift;
    });
  };

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    const root = ref.current;
    if (!root) return;
    const anims = [...root.querySelectorAll("button.tgh-hit")]
      .map((node) => node.getAnimations()[0])
      .filter((anim): anim is Animation => Boolean(anim));
    dragRef.current = {
      x: event.clientX,
      moved: false,
      width: Math.max(1, event.currentTarget.offsetWidth),
      anims,
      times: anims.map((anim) => Number(anim.currentTime) || 0),
    };
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* A synthetic pointer has nothing to capture. */
    }
    setDrag(true);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current) return;
    if (dragRef.current.moved) suppressClick.current = true;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDrag(false);
  };

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  // Fetch every image up front. A tile picks up its next one just before
  // it comes back into view, too late to start loading it then.
  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  // Every length is a multiple of the tile's height, which follows the
  // hero's height until MAX_WIDTH caps it on narrow screens.
  const u = (n: number) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  // Out to the axis, round it, back in: a box sits on the cylinder at the
  // angle rotateY gives it.
  const turn = (deg: number) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  // Beyond `limit` a tile is wholly off-screen, so it is hidden there. The
  // loop's ends, where it wraps, fall inside that stretch, and so do tiles
  // swinging round behind the camera.
  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    // Pausing rather than removing the motion keeps the band whole: every
    // tile is already placed by its negative delay, so it freezes as a
    // finished still.
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused}}` +
    `.tgh-paused .${tile}{animation-play-state:paused}` +
    `.tgh-hit{pointer-events:auto;appearance:none;-webkit-appearance:none;touch-action:pan-y;user-select:none}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", paused && "tgh-paused", className)}
      {...props}
      style={{ containerType: "size", ...props.style }}
    >
      <style>{css}</style>

      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: layout ? 1 : 0,
          // A shared vanishing point on the row's centre line, so the ends
          // grow evenly above and below it as they come toward the viewer.
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          // Tile `columns - 1` starts nearest the exit and tile 0 furthest
          // back, so this numbers tiles in the order they come on.
          const first = columns - 1 - t;
          const img = images[(shown[t] ?? first) % Math.max(images.length, 1)];
          return (
            <button
              key={t}
              type="button"
              className={cn(
                tile,
                "tgh-hit absolute border-0 bg-transparent p-0",
                drag ? "cursor-grabbing" : "cursor-grab",
              )}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                // Tile t starts t tiles along the loop. Play state is its
                // own longhand so a hover pause does not restart the loop.
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
                animationPlayState: paused ? "paused" : "running",
              }}
              aria-label={img?.alt ? `View photo: ${img.alt}` : "View photo"}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onFocus={() => setHover(true)}
              onBlur={() => setHover(false)}
              onPointerDown={onPointerDown}
              onPointerMove={scrub}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onClick={() => {
                if (suppressClick.current) {
                  suppressClick.current = false;
                  return;
                }
                if (img) setOpen(img);
              }}
              onAnimationIteration={(e) => {
                // elapsedTime counts whole loops, missed events included.
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={cn(
                    "absolute top-0 overflow-hidden bg-[#eceff3]",
                    k === 0 && "rounded-l-[8px]",
                    k === SLICES - 1 && "rounded-r-[8px]",
                  )}
                  style={{
                    // Every strip starts at the tile's centre and is turned
                    // round the axis to its own place on the arc. Overlap
                    // is only to the left, so the right edge stays on the
                    // photo and the card never shows an empty strip.
                    left: `calc(${u((aspectRatio - share) / 2)} - 3px)`,
                    width: `calc(${u(share)} + 3px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? "") : ""}
                      draggable={false}
                      className="absolute top-0 h-full max-w-none"
                      style={{
                        left: `calc(${u(-k * share)} - 3px)`,
                        width: `calc(${u(aspectRatio)} + 6px)`,
                        height: u(1),
                        objectFit: "fill",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </button>
          );
        })}
      </div>

      {children}
      {open ? <PhotoLightbox image={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}

function PhotoLightbox({ image, onClose }: { image: TiltedGridImage; onClose: () => void }) {
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={image.alt || "Photo"}>
      <button type="button" className="absolute inset-0 bg-[#0f1115]/80" aria-label="Close photo" onClick={onClose} />
      <figure className="relative z-10 m-0 flex max-w-[min(1100px,100%)] flex-col items-center">
        <img src={image.src} alt={image.alt || ""} className="max-h-[82vh] w-auto max-w-full rounded-[14px] bg-white object-contain shadow-[0_24px_80px_-24px_rgba(0,0,0,0.65)]" />
        {image.alt ? <figcaption className="mt-3 max-w-[62ch] text-center font-body-sm text-body-sm text-white/80">{image.alt}</figcaption> : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo"
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-graphite shadow-md"
        >
          <Symbol name="close" className="text-[20px]" />
        </button>
      </figure>
    </div>,
    document.body,
  );
}

export default TiltedGridHero;
