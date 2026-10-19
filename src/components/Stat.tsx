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
    <div className="stat">
      {(IconComponent || source) && (
        <div className="stat__top">
          {IconComponent ? (
            <div className="stat__icon-box">
              <IconComponent style={{ width: 16, height: 16 }} />
            </div>
          ) : (
            <div />
          )}
          {source ? <span className="stat__source">{source}</span> : null}
        </div>
      )}
      <span className="stat__value">{value}</span>
      <span className="stat__label">{label}</span>
    </div>
  );
}
