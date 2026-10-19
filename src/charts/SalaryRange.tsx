import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C, axisStyle, valueAxisStyle } from "./theme";
import { ChartFrame, type LegendItem } from "./ChartFrame";
import { n, rp, rpk } from "../lib/format";

export type SalaryRow = {
  label: string;
  n: number;
  loP25: number;
  loMedian: number;
  hiMedian: number;
  hiP75: number;
};

type Seg = SalaryRow & {
  pad: number;
  loSpread: number;
  core: number;
  hiSpread: number;
};

/**
 * Rentang gaji sebagai batang mengambang bertumpuk.
 * Segmen: [transparan 0→P25 bawah] [pucat P25→median bawah]
 *         [aksen median bawah→median atas] [pucat median atas→P75 atas]
 * Trik batang transparan adalah cara Recharts membuat batang mengambang.
 */
export function SalaryRange({
  rows,
  title,
  note,
}: {
  rows: SalaryRow[];
  title: string;
  note?: string;
}) {
  const data: Seg[] = rows.map((r) => ({
    ...r,
    pad: r.loP25,
    loSpread: r.loMedian - r.loP25,
    core: r.hiMedian - r.loMedian,
    hiSpread: r.hiP75 - r.hiMedian,
  }));

  const max = Math.max(...data.map((d) => d.hiP75));

  const legend: LegendItem[] = [
    { color: C.accentSoft, label: "Sebaran P25–P75" },
    { color: C.accent, label: "Rentang tengah (median batas bawah → median atas)" },
  ];

  const height = data.length * 56 + 34;

  return (
    <ChartFrame title={title} note={note} legend={legend}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 0, left: 0 }}
        >
          <XAxis
            type="number"
            domain={[0, max * 1.02]}
            tickFormatter={rpk}
            {...valueAxisStyle}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={140}
            interval={0}
            {...axisStyle}
          />
          <Tooltip cursor={false} content={<SalaryTooltip />} />
          <Bar dataKey="pad" stackId="s" fill="transparent" isAnimationActive={false} />
          <Bar dataKey="loSpread" stackId="s" fill={C.accentSoft} isAnimationActive={false} />
          <Bar dataKey="core" stackId="s" fill={C.accent} isAnimationActive={false} />
          <Bar dataKey="hiSpread" stackId="s" fill={C.accentSoft} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

/** Tooltip khusus: menampilkan kembali angka asli, bukan potongan segmen. */
function SalaryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: Seg }[];
}) {
  const row = payload?.[0]?.payload;
  if (!active || !row) return null;

  return (
    <div className="tip">
      <div className="tip__label">{row.label}</div>
      <div className="tip__row">
        <span>Batas bawah (median)</span>
        <b>{rp(row.loMedian)}</b>
      </div>
      <div className="tip__row">
        <span>Batas atas (median)</span>
        <b>{rp(row.hiMedian)}</b>
      </div>
      <div className="tip__row">
        <span>Sebaran P25–P75</span>
        <b>
          {rp(row.loP25)} – {rp(row.hiP75)}
        </b>
      </div>
      <div className="tip__row">
        <span>Lowongan bergaji</span>
        <b>{n(row.n)}</b>
      </div>
    </div>
  );
}
