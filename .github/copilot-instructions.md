# Instruksi untuk Copilot

Aturan kerja lengkap ada di **[`AGENTS.md`](../../AGENTS.md)** di akar repo. Baca
dulu sebelum mengubah kode.

Spesifikasi visual: [`design-system/`](../../design-system/) —
[foundations](../../design-system/foundations.md),
[components](../../design-system/components.md),
[content](../../design-system/content.md).

## Yang paling sering salah

1. **Angka laporan jangan ditulis tangan.** Ambil dari `src/data/report.json`
   lewat `src/data/report.ts`. Kalau kalimat naratif butuh angka, hitung.
2. **Nilai visual jangan ditulis langsung.** Pakai token semantik dari
   `src/styles/tokens.css` (`--text-muted`), bukan primitif (`--stone-500`).
3. **Warna grafik hanya dari `src/charts/theme.ts`.** Jangan ada `#bc4a1a` di
   dalam komponen grafik.
4. **Bobot huruf pakai `font-weight: 550`**, bukan
   `font-variation-settings: "wght" 550`. Yang kedua membuat Uncut Sans miring
   tanpa diminta. `font-variation-settings` hanya untuk `ital`.
5. **Grafik tanpa animasi.** Selalu `isAnimationActive={false}` pada `Bar` dan
   `Pie`.
6. **Kolom angka di `DataTable` wajib `num: true`** agar rata kanan dan angka
   tabular.

## Sebelum menandai selesai

```bash
npm run typecheck   # harus bersih
npm run build       # harus berhasil
```

Perubahan visual diperiksa di peramban, bukan hanya dari kode.
