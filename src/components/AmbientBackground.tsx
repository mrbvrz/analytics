/**
 * AmbientBackground.tsx — Efek latar belakang blurred ambient mesh blobs
 * Memberikan aksen warna tematik terracotta & warm stone yang halus dan modern.
 */
export function AmbientBackground() {
  return (
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-blob ambient-blob--1" />
      <div className="ambient-blob ambient-blob--2" />
      <div className="ambient-blob ambient-blob--3" />
      <div className="ambient-grid-overlay" />
    </div>
  );
}
