// Photo or a placeholder with initials when no photo is set.
export default function Photo({ src, name, className = "" }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={`ph ${className}`} src={src} alt={name} />;
  }
  const initials = (name || "?")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className={`ph ph-empty ${className}`} role="img" aria-label={name}>
      {initials}
    </div>
  );
}
