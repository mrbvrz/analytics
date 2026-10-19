import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { C, axisStyle, valueAxisStyle } from "./theme";
import { ChartFrame, type LegendItem } from "./ChartFrame";
import { rp } from "../lib/format";

export interface AreaDataPoint {
  tier: string;
  shortLabel: string;
  minJuta: number;
  medJuta: number;
  maxJuta: number;
  recommendedJuta?: number;
}

const DEFAULT_AREA_DATA: AreaDataPoint[] = [
  { tier: "Marketplace Ritel", shortLabel: "Ritel", minJuta: 0.35, medJuta: 0.5, maxJuta: 1.5 },
  { tier: "Freelancer Pro", shortLabel: "Freelance", minJuta: 2.0, medJuta: 4.5, maxJuta: 8.0 },
  { tier: "Software House Baru", shortLabel: "SH Baru (Rekomendasi)", minJuta: 6.5, medJuta: 12.5, maxJuta: 22.0, recommendedJuta: 12.5 },
  { tier: "Agensi Mapan", shortLabel: "Agensi Menengah", minJuta: 15.0, medJuta: 35.0, maxJuta: 65.0 },
  { tier: "Enterprise Agency", shortLabel: "Enterprise", minJuta: 50.0, medJuta: 120.0, maxJuta: 250.0 },
];

export function PriceAreaChart({
  data = DEFAULT_AREA_DATA,
  title = "Kurva Spektrum Harga Pembuatan Website di Jakarta",
  note = "Satuan Juta Rupiah (Rp)",
}: {
  data?: AreaDataPoint[];
  title?: string;
  note?: string;
}) {
  // Warna kontras tegas: Batas Atas (Biru Sapphire #2563eb) vs Median (Terracotta var(--accent)) vs Batas Bawah (Abu-abu netral)
  const legend: LegendItem[] = [
    { color: "#2563eb", label: "Batas Atas / Plafon Proyek (Maks)" },
    { color: "var(--accent)", label: "Median / Titik Tengah Pasar" },
    { color: "var(--stone-400)", label: "Lantai Batas Bawah (Min)" },
  ];

  return (
    <ChartFrame title={title} note={note} legend={legend}>
      {/* Ketinggian chart ditingkatkan menjadi 400px agar kurva dan sumbu vertikal sangat lega & mudah dibaca */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 28, right: 32, bottom: 16, left: 14 }}
        >
          <defs>
            {/* Gradien Batas Atas (Biru Kontras) */}
            <linearGradient id="areaGradientMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
            </linearGradient>
            {/* Gradien Median (Terracotta Accent) */}
            <linearGradient id="areaGradientMed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.38} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={C.grid} vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="shortLabel"
            {...axisStyle}
            interval={0}
            dy={10}
          />
          <YAxis
            {...valueAxisStyle}
            width={58}
            tickFormatter={(v) => `Rp${v} jt`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as AreaDataPoint;
                return (
                  <div
                    style={{
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                      padding: "10px 14px",
                      fontSize: "12px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                      {item.tier}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", color: "#2563eb" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
                      <span>Batas Atas (Plafon): <strong>{rp(item.maxJuta * 1e6)}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px", color: "var(--accent)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
                      <span>Median Titik Tengah: <strong>{rp(item.medJuta * 1e6)}</strong></span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--stone-400)", display: "inline-block" }} />
                      <span>Lantai Batas Bawah: <strong>{rp(item.minJuta * 1e6)}</strong></span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {/* Batas Atas: Biru Sapphire #2563eb dengan garis tegas dan dot titik data */}
          <Area
            type="monotone"
            dataKey="maxJuta"
            name="Batas Atas (Plafon)"
            stroke="#2563eb"
            strokeWidth={2.4}
            dot={{ r: 4.5, fill: "#2563eb", stroke: "var(--surface-raised)", strokeWidth: 1.5 }}
            activeDot={{ r: 6.5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }}
            fillOpacity={1}
            fill="url(#areaGradientMax)"
            isAnimationActive={false}
          />
          {/* Median: Terracotta Accent (var(--accent)) dengan garis lebih tebal dan dot titik data */}
          <Area
            type="monotone"
            dataKey="medJuta"
            name="Median Titik Tengah"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={{ r: 5, fill: "var(--accent)", stroke: "var(--surface-raised)", strokeWidth: 1.5 }}
            activeDot={{ r: 7, fill: "var(--accent)", stroke: "#fff", strokeWidth: 2 }}
            fillOpacity={1}
            fill="url(#areaGradientMed)"
            isAnimationActive={false}
          />
          {/* Lantai Bawah: Garis Putus-putus Abu Netral */}
          <Area
            type="monotone"
            dataKey="minJuta"
            name="Lantai Batas Bawah"
            stroke="var(--stone-400)"
            strokeWidth={1.8}
            strokeDasharray="4 4"
            dot={{ r: 3.5, fill: "var(--stone-400)", stroke: "var(--surface-raised)", strokeWidth: 1 }}
            fill="transparent"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
