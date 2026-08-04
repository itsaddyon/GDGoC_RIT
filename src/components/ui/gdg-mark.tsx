export function GDGMark({ size = 34 }: { size?: number }) {
  // Original geometric interpretation of the GDG chevron mark using the
  // official brand colors. Swap in the real Google-provided asset at
  // /public/brand/gdg-logo.png and this component becomes unnecessary.
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60" aria-hidden>
      <g>
        <rect x="2" y="6" width="42" height="20" rx="10" fill="var(--accent-blue)" transform="rotate(-32 23 16)" />
        <rect x="2" y="34" width="42" height="20" rx="10" fill="var(--accent-red)" transform="rotate(32 23 44)" />
      </g>
      <g>
        <rect x="56" y="6" width="42" height="20" rx="10" fill="var(--accent-green)" transform="rotate(32 77 16)" />
        <rect x="56" y="34" width="42" height="20" rx="10" fill="var(--accent-yellow)" transform="rotate(-32 77 44)" />
      </g>
    </svg>
  );
}
