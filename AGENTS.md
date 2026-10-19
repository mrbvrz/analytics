# AGENTS.md — kontrak kerja untuk agen AI

Laporan analisis pasar jasa pembuatan website DKI Jakarta. React + TypeScript +
Vite + Recharts, dengan pipeline Python yang mengambil data dari API Zapi.

Berkas ini adalah sumber aturan utama. `CLAUDE.md`, `.cursor/rules/*.mdc`, dan
`.github/copilot-instructions.md` hanya menunjuk ke sini agar tidak ada aturan
yang bercabang dua.

---

## Perintah

```bash
npm install          # sekali saja
npm run dev          # server pengembangan, http://localhost:5173
npm run build        # typecheck + build produksi ke dist/
npm run typecheck    # tsc --noEmit saja
npm run preview      # menyajikan hasil build
npm run fetch        # tarik ulang data mentah ke pipeline/data/   (butuh kunci API)
npm run data         # pipeline/data/ -> src/data/report.json
```

`npm run fetch` butuh kunci API. Set `ZAPI_KEY`, atau taruh di
`pipeline/.zapi_key` (sudah masuk `.gitignore`). Jangan pernah menulis kunci ke
dalam skrip yang di-commit.

---

## Peta berkas

```
src/
  App.tsx                 seluruh isi laporan, urut per bagian
  main.tsx                titik masuk; urutan impor CSS penting
  data/
    report.json           DIHASILKAN pipeline — jangan diedit tangan
    report.types.ts       kontrak tipe untuk report.json
    report.ts             satu-satunya pintu masuk data
  lib/format.ts           semua format angka dan tanggal
  styles/
    fonts.css             @font-face Uncut Sans
    tokens.css            SATU-SATUNYA sumber nilai visual
    global.css            reset + gaya permukaan
    charts.css            bingkai grafik, tooltip, legenda
  components/             blok tata letak (Section, Stat, DataTable, ...)
  charts/                 pembungkus Recharts + theme.ts
pipeline/
  fetch.sh                pengambil data mentah (curl)
  build_report.py         agregasi + self-check -> src/data/report.json
  data/                   data mentah hasil scraping (gitignored)
design-system/            spesifikasi: foundations, components, content
public/fonts/             UncutSans-Variable.woff2 (OFL-1.1)
```

---

## Aturan keras

Melanggar salah satu dari ini akan menghasilkan laporan yang salah atau tidak
konsisten. Tidak ada pengecualian tanpa alasan yang ditulis di kode.

### 1. Tidak ada angka laporan yang ditulis tangan

Semua angka berasal dari `src/data/report.json` lewat `src/data/report.ts`.
Kalau sebuah kalimat naratif perlu bergantung pada data, **hitung** nilainya —
jangan hafalkan. Contoh yang sudah salah dan diperbaiki: kalimat "sedikit di
bawah median nasional" menjadi keliru begitu data berubah. Sekarang arah
perbandingannya dihitung di tempat.

```tsx
// salah — akan berbohong begitu data diperbarui
<p>Median Jakarta sedikit di bawah median nasional.</p>

// benar — arahnya mengikuti data
<p>Median Jakarta {jkt.median < nasional.median ? "di bawah" : "di atas"} median nasional.</p>
```

### 2. Tidak ada nilai visual mentah di komponen

Warna, jarak, radius, ukuran huruf: selalu lewat token di
`src/styles/tokens.css`. Komponen memakai token **semantik**, bukan primitif
(`--text-muted`, bukan `--stone-500`).

Pengecualian: `src/charts/theme.ts` boleh menunjuk token sebagai string
`var(--...)` karena Recharts butuh nilai warna di dalam SVG.

### 3. Warna grafik hanya dari `src/charts/theme.ts`

Semua warna, gaya sumbu, dan ukuran tick grafik berasal dari `theme.ts`, yang
menunjuk token. Jangan menulis `#bc4a1a` atau `"red"` di dalam komponen grafik.

### 4. Grafik tanpa animasi

Selalu `isAnimationActive={false}` pada `Bar` dan `Pie`. Recharts menganimasikan
dari tinggi nol, sehingga grafik tampak kosong pada paint pertama — dan
verifikasi screenshot menangkap keadaan kosong itu. Laporan ini statis; animasi
tidak memberi nilai.

### 5. Bobot huruf memakai `font-weight`, bukan `font-variation-settings`

Uncut Sans adalah font variabel dengan sumbu `wght` (300–700) **dan** `ital`
(0–11). Memakai `font-variation-settings: "wght" N` meninggalkan sumbu `ital`
pada keadaan ambigu dan pada sebagian elemen menghasilkan huruf miring yang
tidak diminta (pernah terjadi pada `h4.examples__title`).

```css
/* salah */ font-variation-settings: "wght" 550;
/* benar */ font-weight: 550;
```

`font-variation-settings` hanya dipakai untuk `ital`, yang tidak punya properti
standar. Lihat `em, i, .italic` di `global.css`.

### 6. Kolom angka wajib ditandai `num`

Di `DataTable`, kolom angka harus `num: true` agar rata kanan dan memakai angka
tabular. Angka yang tidak sejajar kolomnya adalah cacat, bukan selera.

### 7. Nama berkas menentukan sumber data

`pipeline/build_report.py` memilih berkas lewat glob (`shopee_*.json`,
`jobstreet_*.json`, ...). Menambah berkas dengan awalan itu berarti menambahnya
ke laporan. Membuang berkas berarti membuangnya dari laporan.

### 8. Ubah bentuk data → ubah tipe

Kalau `build_report.py` berubah bentuk keluarannya, perbarui
`src/data/report.types.ts` juga. `npm run typecheck` akan menunjukkan setiap
tempat yang perlu disesuaikan.

---

## Alur data

```
API Zapi ──npm run fetch──> pipeline/data/*.json
                                   │
                          npm run data  (agregasi + self-check)
                                   ▼
                        src/data/report.json
                                   │
                     import lewat src/data/report.ts
                                   ▼
                             src/App.tsx
```

Pipeline berisi `assert` yang gagal keras kalau bentuk data berubah — misalnya
kalau bucket harga tidak lagi mencakup semua harga, atau kalau pola klasifikasi
layanan mulai cocok pada potongan kata. Lihat bagian `self-check` di
`build_report.py`. Kalau assert gagal, perbaiki penyebabnya; jangan dilonggarkan
tanpa alasan.

---

## Selesai berarti

1. `npm run typecheck` bersih.
2. `npm run build` berhasil.
3. Perubahan visual diperiksa di peramban sungguhan, bukan hanya dari kode.

Tidak ada test runner di proyek ini. Satu-satunya pemeriksaan otomatis adalah
`assert` di `build_report.py` dan `tsc`. Kalau menambah logika non-trivial,
tinggalkan satu `assert` yang gagal kalau logikanya rusak.

---

## Gaya kerja

Tulis kode sesingkat yang benar-benar bekerja. Pakai yang sudah ada di repo
sebelum menulis baru. Jangan menambah pustaka untuk hal yang bisa diselesaikan
beberapa baris. Hapus lebih baik daripada menambah.

Komentar menjelaskan **mengapa**, bukan **apa**. Komentar yang mengulang kode
adalah kebisingan. Kalau sebuah penyederhanaan menyisakan batas yang diketahui,
tandai dengan komentar `ponytail:` yang menyebut batas dan jalan naiknya.

Bahasa: kode, komentar, dan dokumentasi dalam bahasa Indonesia. Nama variabel,
tipe, dan fungsi dalam bahasa Inggris. Istilah teknis tidak diterjemahkan
dilebih-lebihkan.
