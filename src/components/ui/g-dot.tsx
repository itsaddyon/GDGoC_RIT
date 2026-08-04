export function GDot({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--accent-blue)" strokeWidth="3" strokeDasharray="49.5 16.5" strokeDashoffset="0" />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--accent-red)" strokeWidth="3" strokeDasharray="16.5 49.5" strokeDashoffset="-49.5" />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--accent-yellow)" strokeWidth="3" strokeDasharray="8 58" strokeDashoffset="-16.5" />
      <circle cx="12" cy="12" r="10.5" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeDasharray="8 58" strokeDashoffset="-24.5" />
    </svg>
  );
}
