import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SERIES } from "./theme";
import { ChartFrame, type LegendItem } from "./ChartFrame";
import { n } from "../lib/format";

export type SliceDatum = { label: string; count: number };

/**
 * Donat untuk komposisi yang jumlahnya 100% dan jumlah kategori kecil (≤4).
 * Di atas itu pakai batang — potongan donat yang tipis tidak terbaca.
 */
export function Donut({
  data,
  title,
  note,
  height = 220,
  centerLabel,
}: {
  data: SliceDatum[];
  title: string;
  note?: string;
  height?: number;
  centerLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);

  const legend: LegendItem[] = data.map((d, i) => ({
    color: SERIES[i % SERIES.length],
    label: `${d.label} · ${n(d.count)} (${Math.round((100 * d.count) / total)}%)`,
    round: true,
  }));

  return (
    <ChartFrame title={title} note={note} legend={legend}>
      <div style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              stroke="var(--surface-page)"
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell key={d.label} fill={SERIES[i % SERIES.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                const v = Number(p.value ?? 0);
                return (
                  <div className="tip">
                    <div className="tip__label">{String(p.name ?? "")}</div>
                    <div className="tip__row">
                      <span>Lowongan</span>
                      <b>
                        {n(v)} · {Math.round((100 * v) / total)}%
                      </b>
                    </div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerLabel ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 550,
                  letterSpacing: "-0.03em",
                }}
              >
                {n(total)}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                {centerLabel}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ChartFrame>
  );
}
