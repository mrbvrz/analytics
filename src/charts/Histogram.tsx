import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C, axisStyle, valueAxisStyle } from "./theme";
import { ChartFrame } from "./ChartFrame";
import { ChartTooltip } from "./ChartTooltip";
import { n } from "../lib/format";

export type BucketDatum = { label: string; count: number; pct: number };

/**
 * Histogram batang tegak untuk sebaran harga.
 * Label sumbu-X adalah rentang, jadi nilainya tidak boleh diubah jadi angka.
 */
export function Histogram({
  data,
  title,
  note,
  height = 250,
}: {
  data: BucketDatum[];
  title: string;
  note?: string;
  height?: number;
}) {
  return (
    <ChartFrame title={title} note={note}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 22, right: 8, bottom: 4, left: 8 }}
          barCategoryGap="28%"
        >
          <CartesianGrid stroke={C.grid} vertical={false} />
          <XAxis dataKey="label" {...axisStyle} interval={0} dy={4} />
          <YAxis {...valueAxisStyle} width={38} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "var(--surface-sunken)" }}
            content={<ChartTooltip unit=" listing" />}
          />
          <Bar
            dataKey="count"
            name="Listing"
            fill={C.bar}
            radius={[2, 2, 0, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="count"
              position="top"
              fill="var(--text-secondary)"
              fontSize={11.5}
              offset={6}
              formatter={(v: unknown) => n(Number(v))}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
