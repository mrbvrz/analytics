/**
 * format.ts — satu-satunya tempat angka diubah menjadi teks.
 * Semua konteks angka memakai format Indonesia dan angka tabular (lihat tokens).
 */

/** Rupiah penuh: 399000 → "Rp399.000" */
export const rp = (n: number): string => "Rp" + Math.round(n).toLocaleString("id-ID");

/** Rupiah ringkas untuk sumbu grafik: 12000000 → "Rp12 jt" */
export const rpk = (n: number): string => {
  if (n >= 1e9) return `Rp${(n / 1e9).toFixed(1).replace(".", ",")} M`;
  if (n >= 1e6) return `Rp${(n / 1e6).toFixed(1).replace(".", ",")} jt`;
  if (n >= 1e3) return `Rp${Math.round(n / 1e3)} rb`;
  return `Rp${n}`;
};

/** Angka ribuan: 1234 → "1.234" */
export const n = (v: number): string => v.toLocaleString("id-ID");

/** Persentase bulat: 43.2 → "43%" */
export const pct = (v: number): string => `${Math.round(v)}%`;

/** Tanggal ISO → "19 Oktober 2026" */
export function tanggal(iso: string): string {
  if (!iso) return "—";
  const bulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  const clean = iso.slice(0, 10);
  const [y, m, d] = clean.split("-").map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return iso;
  return `${d} ${bulan[m - 1]} ${y}`;
}
