import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C, ROW_H, axisStyle } from "./theme";
import { ChartFrame, type LegendItem } from "./ChartFrame";
import { ChartTooltip } from "./ChartTooltip";
import { n } from "../lib/format";

export type CategoryDatum = {
  label: string;
  count: number;
  /** Label pengganti di ujung batang, mis. "76 · 28%" */
  display?: string;
};

/**
 * Batang horizontal untuk peringkat kategori.
 * Dipakai untuk: jenis jasa, skill, perusahaan, jenis kontrak.
 */
export function CategoryBars({
  data,
  title,
  note,
  unit,
  yWidth = 208,
  legend,
}: {
  data: CategoryDatum[];
  title: string;
  note?: string;
  unit?: string;
  yWidth?: number;
  legend?: LegendItem[];
}) {
  const height = data.length * ROW_H + 16;

  /* Setiap batang selalu menampilkan angkanya; `display` hanya mengubah
     formatnya (mis. menambah persentase), bukan menghilangkan labelnya. */
  const rows = data.map((d) => ({ ...d, display: d.display ?? n(d.count) }));

  return (
    <ChartFrame title={title} note={note} legend={legend}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 0, right: 56, bottom: 0, left: 0 }}
          barCategoryGap="26%"
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={yWidth}
            {...axisStyle}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "var(--surface-sunken)" }}
            content={<ChartTooltip unit={unit} />}
          />
          <Bar
            dataKey="count"
            name="Jumlah"
            fill={C.bar}
            radius={[0, 2, 2, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="display"
              position="right"
              offset={8}
              fill="var(--text-muted)"
              fontSize={11.5}
              formatter={(v: unknown) => String(v ?? "")}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/** Adaptor: ubah {label,count,pct} menjadi data + label tampilan. */
export function withPct(
  rows: { label: string; count: number; pct: number }[],
): CategoryDatum[] {
  return rows.map((r) => ({
    label: r.label,
    count: r.count,
    display: `${n(r.count)} · ${r.pct}%`,
  }));
}
