/** The Figma mark — used as a fallback tile for "preview" resources with no thumbnail. */
export function FigmaMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 36" aria-hidden="true">
      <path d="M6 6a6 6 0 0 1 6-6h0v12H6a6 6 0 0 1 0-12z" fill="#F24E1E" />
      <path d="M12 0h6a6 6 0 1 1 0 12h-6z" fill="#FF7262" />
      <path d="M12 12h6a6 6 0 1 1-6 6z" fill="#A259FF" />
      <path d="M6 12h6v12a6 6 0 1 1-6-6z" fill="#0ACF83" />
      <path d="M6 12a6 6 0 1 1 6 6H6z" fill="#1ABCFE" />
    </svg>
  );
}
