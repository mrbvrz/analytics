import type { ReactNode } from "react";

/** Kisi kartu angka. Selalu pakai grid 1px agar garisnya rapi tanpa ganda. */
export function StatGrid({ children }: { children: ReactNode }) {
  return <div className="stats">{children}</div>;
}

export function Stat({
  value,
  label,
  source,
  icon: IconComponent,
}: {
  value: ReactNode;
  label: ReactNode;
  /** Kanal/sumber data, mis. "JobStreet". Opsional. */
  source?: string;
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
}) {
  return (
    <div className="stat" style={{ position: "relative" }}>
      {IconComponent && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            color: "var(--accent)",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        >
          <IconComponent style={{ width: 17, height: 17 }} />
        </div>
      )}
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
      {source ? <span className="stat__source">{source}</span> : null}
    </div>
  );
}
