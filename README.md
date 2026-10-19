# Analisis Pasar Jasa Pembuatan Website — DKI Jakarta

Laporan interaktif tentang pasar jasa pembuatan website di Jakarta: struktur
harga, jenis layanan yang benar-benar dijual, permintaan tenaga kerja, lanskap
pesaing, dan rekomendasi positioning.

Dibangun sebagai aplikasi React dengan grafik Recharts, dari data yang ditarik
langsung melalui API Zapi.

---

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
```

Build produksi:

```bash
npm run build      # typecheck + build ke dist/
npm run preview    # menyajikan hasil build
```

---

## Memperbarui data

Ada dua tahap, dan keduanya terpisah dengan sengaja.

```bash
npm run fetch      # 1. tarik data mentah  -> pipeline/data/*.json
npm run data       # 2. agregasi + validasi -> src/data/report.json
npm run dev
```

`npm run fetch` membutuhkan kunci API Zapi. Set sebagai variabel lingkungan,
atau taruh di `pipeline/.zapi_key`:

```bash
export ZAPI_KEY=...            # opsi 1
echo "..." > pipeline/.zapi_key # opsi 2 (sudah masuk .gitignore)
```

Kunci tidak pernah ditulis di dalam skrip yang di-commit.

> **Perhatian.** Hasil pencarian marketplace berubah antar penarikan. Setelah
> `npm run fetch`, angka laporan akan bergeser beberapa persen tanpa ada
> perubahan pasar yang nyata. Periksa kembali kalimat naratif yang menyatakan
> perbandingan atau arah.

---

## Struktur

```
src/
  App.tsx              isi laporan, urut per bagian
  data/                report.json (hasil pipeline) + kontrak tipenya
  lib/format.ts        format angka dan tanggal
  styles/              tokens (nilai visual), global, charts, fonts
  components/          blok tata letak
  charts/              pembungkus Recharts + theme.ts
pipeline/
  fetch.sh             pengambil data mentah
  build_report.py      agregasi + self-check
  data/                data mentah (gitignored)
design-system/         spesifikasi warna, tipografi, komponen, dan bahasa
public/fonts/          Uncut Sans (variable woff2)
```

---

## Sumber data

| Kanal | Dipakai untuk |
| --- | --- |
| Shopee | Struktur harga dan jenis layanan |
| Blibli | Jangkar harga segmen atas |
| JobStreet | Volume lowongan dan rentang gaji di Jakarta |
| Glints | Skill dan jenis kontrak |
| Kalibrr | Pembanding volume (tanpa filter lokasi) |
| LinkedIn | Sampel tambahan |
| Dealls | Sampel tambahan |

Keterbatasan lengkap ada di bagian **Metode** di dalam laporan.

---

## Dokumentasi

| Berkas | Isi |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | Aturan kerja untuk agen AI: perintah, peta berkas, aturan keras |
| [`design-system/`](./design-system/) | Spesifikasi warna, tipografi, komponen, dan bahasa |
| [`CLAUDE.md`](./CLAUDE.md) | Penunjuk ke `AGENTS.md` |
| [`.cursor/rules/`](./.cursor/rules/) | Aturan per-area untuk Cursor |

Mulai dari `AGENTS.md` kalau mengubah kode.

---

## Teknologi

React 18 · TypeScript · Vite 6 · Recharts 3 · Python 3 (pipeline, stdlib saja)

Tidak ada test runner. Pemeriksaan otomatis ada dua: `tsc` lewat
`npm run typecheck`, dan `assert` di akhir `pipeline/build_report.py`.

---

## Lisensi

Kode proyek ini bebas dipakai. **Uncut Sans** oleh Kasper Nordkvist dilisensikan
secara terpisah di bawah SIL Open Font License 1.1 — lihat
`public/fonts/` dan berkas lisensi aslinya. Data pasar berasal dari sumber publik
dan bersifat indikatif, bukan laporan riset bersertifikat.
