import type { ReactNode } from "react";
import { PresentationChartLineIcon } from "@heroicons/react/24/outline";

/* ── legenda ─────────────────────────────────────────────────────────
   Pemetaan warna → makna. Wajib ada begitu grafik memakai >1 warna. */

export type LegendItem = {
  color: string;
  label: string;
  round?: boolean;
};

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <div className="legend">
      {items.map((it) => (
        <span className="legend__item" key={it.label}>
          <span
            className={`legend__swatch${it.round ? " legend__swatch--round" : ""}`}
            style={{ background: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ── bingkai grafik ──────────────────────────────────────────────────
   Setiap grafik wajib memakai bingkai ini agar judul, catatan satuan,
   dan legenda selalu berada di posisi yang sama. */

export function ChartFrame({
  title,
  note,
  children,
  legend,
  icon: IconComponent = PresentationChartLineIcon,
}: {
  title: string;
  /** Catatan satuan/ukuran sampel. Muncul rata kanan di kepala grafik. */
  note?: string;
  children: ReactNode;
  legend?: LegendItem[];
  icon?: React.ComponentType<{ style?: React.CSSProperties }> | null;
}) {
  return (
    <figure className="figure">
      <div className="figure__head">
        <figcaption className="figure__title" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          {IconComponent && (
            <IconComponent style={{ width: 16, height: 16, color: "var(--accent)", flexShrink: 0 }} />
          )}
          <span>{title}</span>
        </figcaption>
        {note ? <span className="figure__note">{note}</span> : null}
      </div>
      <div className="figure__body">{children}</div>
      {legend?.length ? <Legend items={legend} /> : null}
    </figure>
  );
}
