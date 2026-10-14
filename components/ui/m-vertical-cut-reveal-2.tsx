/*
  Vertical cut reveal: each character wipes in on a vertical clip,
  staggered outward from the center. Same motion as cnippet-dev/m-vertical-cut-reveal-2.
*/

export function VerticalCutRevealChars({
  text,
  className,
  baseDelay = 0,
  accent,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  accent?: string;
}) {
  const chars = Array.from(text);
  const mid = (chars.length - 1) / 2;
  let index = 0;

  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, w) => {
        const tone = accent && word.replace(/[.,]/g, "") === accent;
        const body = (
          <span key={w} className={tone ? "vcr-word vcr-tone" : "vcr-word"}>
            {Array.from(word).map((ch) => {
              const i = index++;
              return (
                <span key={i} className="vcr-mask" aria-hidden="true">
                  <span className="vcr-char" style={{ animationDelay: `${baseDelay + Math.abs(i - mid) * 26}ms` }}>
                    {ch}
                  </span>
                </span>
              );
            })}
          </span>
        );
        return w === 0 ? body : [<span key={`s-${w}`}> </span>, body];
      })}
    </span>
  );
}
