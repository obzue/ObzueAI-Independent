export function Sleeve({
  hue,
  pattern,
  label,
  className = "",
}: {
  hue: number;
  pattern: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`sleeve aspect-square w-full rounded-card ${className}`}
      style={{ ["--hue" as string]: hue }}
      data-pattern={String(pattern % 6)}
      role="img"
      aria-label={label}
    >
      <div className="sleeve-shade" />
      <div className="sleeve-mark" />
    </div>
  );
}
