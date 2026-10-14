export function Symbol({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function CrimsonDot({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return <span className={`inline-block rounded-full bg-secondary ml-1 align-baseline ${className}`} />;
}
