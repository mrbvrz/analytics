import { n } from "../lib/format";

type TipRow = {
  value?: number | string;
  name?: string;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
};

type TipProps = {
  active?: boolean;
  payload?: TipRow[];
  label?: string | number;
  /** Formatter nilai utama. Default: angka ribuan. */
  format?: (v: number) => string;
  /** Nama seri yang dipakai sebagai nilai, jika payload punya banyak entri. */
  valueKey?: string;
  /** Suffix setelah nilai, mis. " lowongan". */
  unit?: string;
};

/**
 * Tooltip bersama untuk semua grafik.
 * Recharts menyuntikkan props lewat cloneElement, jadi komponen ini
 * dipakai sebagai `content={<ChartTooltip ... />}`.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  format = n,
  valueKey,
  unit,
}: TipProps) {
  if (!active || !payload?.length) return null;

  const rows = valueKey
    ? payload.filter((p) => String(p.dataKey) === valueKey)
    : payload;

  if (!rows.length) return null;

  return (
    <div className="tip">
      <div className="tip__label">{label}</div>
      {rows.map((r, i) => (
        <div className="tip__row" key={i}>
          <span>{r.name ?? ""}</span>
          <b>
            {typeof r.value === "number" ? format(r.value) : String(r.value ?? "")}
            {unit ?? ""}
          </b>
        </div>
      ))}
    </div>
  );
}
