/**
 * theme.ts — konfigurasi Recharts bersama.
 *
 * Aturan: setiap warna di sini menunjuk ke token di tokens.css, tidak pernah
 * nilai heksadesimal mentah. Mengubah tokens.css otomatis mengubah semua grafik.
 */
import type { CSSProperties } from "react";

/** Warna seri data, urut pemakaian. Lihat design-system/foundations.md */
export const SERIES = [
  "var(--data-1)",
  "var(--data-2)",
  "var(--data-3)",
  "var(--data-4)",
  "var(--data-5)",
] as const;

export const C = {
  bar: "var(--chart-bar)",
  barHover: "var(--chart-bar-hover)",
  track: "var(--chart-track)",
  grid: "var(--chart-grid)",
  axis: "var(--chart-axis)",
  tick: "var(--chart-tick)",
  accent: "var(--accent)",
  accentSoft: "var(--accent-soft)",
  muted: "var(--data-4)",
} as const;

/* Ukuran teks tick grafik hidup DI SINI, bukan di tokens.css: Recharts
   merender SVG dan ukurannya diteruskan sebagai prop, bukan lewat CSS. */
export const TICK_SIZE = 11.5;

/** Properti bersama untuk semua sumbu kategori. */
export const axisStyle = {
  stroke: C.axis,
  tick: { fill: C.tick, fontSize: TICK_SIZE, fontFamily: "var(--font-sans)" },
  tickLine: false,
} as const;

/** Sumbu angka — tanpa garis, hanya tick. */
export const valueAxisStyle = {
  stroke: "transparent",
  tick: { fill: C.tick, fontSize: TICK_SIZE, fontFamily: "var(--font-sans)" },
  tickLine: false,
} as const;

export const gridStyle = {
  stroke: C.grid,
  strokeDasharray: "0",
  vertical: false,
} as const;

/** Kursor hover untuk grafik batang. */
export const cursorFill: CSSProperties = {
  fill: "var(--surface-sunken)",
  fillOpacity: 0.6,
};

/** Tinggi batang per kategori, dipakai menghitung tinggi grafik. */
export const ROW_H = 30;
