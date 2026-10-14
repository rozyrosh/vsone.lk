/*
  One fixed background layer behind everything: a faint grid, two slow mists
  (cool at the top left, warm at the bottom right) cycling over 80 to 96
  seconds, and a whisper of grain. Scrolling reads as moving through one
  place instead of past stacked sections.
*/
export function Environment() {
  return (
    <div className="env" aria-hidden="true">
      <div className="env-blob cool" />
      <div className="env-blob warm" />
      <div className="env-grain" />
    </div>
  );
}
