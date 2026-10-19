# Components

Inventaris komponen dan grafik. Setiap entri menyebut berkasnya, prop yang
tersedia, dan aturan pemakaiannya.

Aturan umum: nilai visual selalu dari token; tidak ada angka laporan yang
ditulis tangan di komponen.

---

## Blok tata letak — `src/components/`

### `Section`

`src/components/Section.tsx`

```ts
{ id: string; eyebrow: string; title: ReactNode; note?: ReactNode; children: ReactNode }
```

Satu bagian laporan. `id` dipakai sebagai anchor navigasi dan harus cocok
dengan entri di `TOC` pada `App.tsx`.

Nomor bagian ditulis di `eyebrow` (`"03 — Harga"`), bukan di judul. `note`
adalah kalimat pengantar yang menjelaskan cara membaca bagian tersebut — pakai
untuk menyebut ukuran sampel atau keterbatasan, bukan untuk mengulang isi.

Jangan membuat `<section>` sendiri. Urutan dan penomoran adalah tanggung jawab
`App.tsx`.

### `StatGrid` dan `Stat`

`src/components/Stat.tsx`

```ts
StatGrid: { children: ReactNode }
Stat: { value: ReactNode; label: ReactNode; source?: string }
```

Kartu angka. `value` adalah **nilai pertama** yang dilihat mata pembaca; pastikan
satuannya ikut terbaca (`Rp285.000`, bukan `285`).

`label` menjelaskan angka tersebut dalam satu tarikan napas — biasanya dua baris
dengan `<br />`. `source` adalah kanal data (`"JobStreet"`) dan hanya dipakai
kalau angkanya berasal dari kanal tertentu, bukan dari gabungan.

`StatGrid` selalu berisi kelipatan 4 kartu agar kisi 1px tetap rata di lebar
penuh. Kurang dari 4 kartu akan menyisakan sel kosong yang terlihat seperti
cacat.

### `DataTable`

`src/components/DataTable.tsx`

```ts
Column<T> = { key: string; header: ReactNode; num?: boolean; strong?: boolean; render(row: T, index: number): ReactNode }
DataTable<T> = { columns: Column<T>[]; rows: T[]; zebra?: boolean; caption?: string }
```

**Kolom angka wajib `num: true`.** Tanpa itu angkanya rata kiri dan tidak
tabular, sehingga digitnya tidak sejajar antar-baris. Ini cacat, bukan selera.

`strong: true` untuk kolom yang jadi jawaban utama (biasanya median).

`zebra` dipakai kalau baris lebih dari delapan. Tabel pendek lebih tenang tanpa
zebra.

`caption` dipakai untuk menyatakan satuan (`"Harga tayang, bukan harga
kontrak."`). Caption muncul di atas tabel dengan gaya kecil redup.

Tabel sudah dibungkus `.table-scroll` sehingga aman di layar sempit. Jangan
menambahkan `overflow` sendiri.

### `Callout`

`src/components/Callout.tsx`

```ts
{ children: ReactNode; quiet?: boolean }
```

Sorotan untuk temuan atau catatan.

- Tanpa `quiet` — batang aksen, latar aksen muda. Untuk **temuan**.
- Dengan `quiet` — batang netral, latar abu. Untuk **catatan metodologis**.

Jangan memakai callout untuk prosa biasa. Kalau semua disorot, tidak ada yang
tersorot. Satu callout per sub-bagian adalah takaran yang sudah dipakai di
laporan ini.

### `ExampleGrid`

`src/components/ExampleGrid.tsx`

```ts
ExampleSet = { category: string; items: { name: string; price: number }[] }
{ sets: ExampleSet[] }
```

Menampilkan listing nyata sebagai bukti di balik angka. Nama listing dipotong
96 karakter oleh pipeline. Harga memakai `--text-accent` dan wajib diformat
dengan `rp()`.

Kisi ini menjelaskan **sebaran**, bukan rata-rata: empat contoh diambil pada
titik P5, P35, P65, dan P95 dari rentang harga kategori — jadi kisi selalu
memperlihatkan ujung murah dan ujung mahal. Jangan mengubahnya menjadi
empat termurah atau empat termahal; keduanya menyembunyikan bentuk pasar.

### `Toc`

`src/components/Toc.tsx`

```ts
TocItem = { id: string; label: string }
{ items: TocItem[] }
```

Daftar isi lengket. Setiap `id` harus cocok dengan sebuah `Section`. Anchor
sudah memperhitungkan tinggi batang lengket lewat `scroll-margin-top` pada
`.section`; jangan menambah offset di tempat lain.

---

## Grafik — `src/charts/`

Semua grafik memakai Recharts dan **semua** konfigurasi warnanya berasal dari
`src/charts/theme.ts`.

### `theme.ts`

```ts
SERIES          // [--data-1 … --data-5], urut pemakaian
C               // warna peran: bar, grid, axis, tick, accent, accentSoft, muted
TICK_SIZE       // 11.5 — ukuran tick SVG, hidup di sini bukan di tokens.css
axisStyle       // sumbu kategori: garis tipis, tanpa tickLine
valueAxisStyle  // sumbu angka: tanpa garis, hanya tick
gridStyle       // grid mendatar saja
cursorFill      // latar hover batang
ROW_H           // 30 — tinggi satu baris pada grafik batang horizontal
```

Jangan menulis warna literal di komponen grafik. `fill={C.bar}`, bukan
`fill="#bc4a1a"`.

### `ChartFrame` dan `Legend`

`src/charts/ChartFrame.tsx`

```ts
LegendItem = { color: string; label: string; round?: boolean }
Legend     = { items: LegendItem[] }
ChartFrame = { title: string; note?: string; children: ReactNode; legend?: LegendItem[] }
```

Setiap grafik **wajib** dibungkus `ChartFrame`. Bingkai ini menjaga judul, satuan
sampel, dan legenda selalu di posisi yang sama di seluruh laporan.

`note` menampilkan ukuran sampel (`"n=285 listing"`). Isi selalu — pembaca
berhak tahu berapa banyak data di balik sebuah grafik.

`legend` wajib begitu sebuah grafik memakai lebih dari satu warna. Grafik satu
warna tidak perlu legenda.

### `ChartTooltip`

`src/charts/ChartTooltip.tsx`

```ts
{ format?: (v: number) => string; valueKey?: string; unit?: string }
```

Tooltip bersama. `active` dan `payload` disuntikkan Recharts lewat
`cloneElement`, jadi komponen ini dipakai sebagai
`content={<ChartTooltip unit=" listing" />}`.

`unit` diberi spasi di depan (`" listing"`) karena nilainya dipisah spasi, bukan
digabung.

Kalau sebuah grafik punya beberapa seri bertumpuk dan tooltip bawaan akan
menampilkan potongan-potongan segmen (bukan angka aslinya), tulis tooltip khusus
di dalam berkas grafik itu — lihat `SalaryRange`.

### `CategoryBars`

`src/charts/CategoryBars.tsx`

```ts
CategoryDatum = { label: string; count: number; display?: string }
{ data: CategoryDatum[]; title: string; note?: string; unit?: string; yWidth?: number; legend?: LegendItem[] }
```

Batang horizontal untuk peringkat. Dipakai untuk jenis jasa, skill, perusahaan,
dan jenis kontrak.

`yWidth` harus cukup lebar agar label muat **satu baris**. Label dua baris
bertabrakan dengan baris berikutnya pada `ROW_H` 30px. Ukuran yang sudah
terpakai: jenis jasa 224, skill 184, perusahaan 238, jenis kontrak 130, lokasi
180.

Setiap batang selalu mencetak angkanya. `display` hanya mengubah **format**
label (mis. `"78 · 26%"` lewat pembantu `withPct`), bukan menghilangkannya.
Grafik yang hanya mengandalkan panjang batang gagal bagi pembaca yang tidak
dapat membedakan panjang secara tepat.

### `Histogram`

`src/charts/Histogram.tsx`

```ts
BucketDatum = { label: string; count: number; pct: number }
{ data: BucketDatum[]; title: string; note?: string; height?: number }
```

Batang tegak untuk sebaran. Dipakai untuk sebaran harga.

Label sumbu-X adalah **rentang**, bukan angka, sehingga tidak boleh diformat
ulang sebagai bilangan. Nilai dicetak di atas setiap batang.

### `SalaryRange`

`src/charts/SalaryRange.tsx`

```ts
SalaryRow = { label: string; n: number; loP25: number; loMedian: number; hiMedian: number; hiP75: number }
{ rows: SalaryRow[]; title: string; note?: string }
```

Rentang gaji sebagai batang mengambang. Empat segmen bertumpuk:

| Segmen | Rentang | Warna |
| --- | --- | --- |
| `pad` | 0 → `loP25` | transparan (trik batang mengambang Recharts) |
| `loSpread` | `loP25` → `loMedian` | `--accent-soft` |
| `core` | `loMedian` → `hiMedian` | `--accent` |
| `hiSpread` | `hiMedian` → `hiP75` | `--accent-soft` |

Batang transparan adalah cara membuat batang mengambang di Recharts; jangan
menghapusnya, karena tanpa itu batang akan selalu mulai dari nol dan bentuknya
berubah makna.

Tooltip-nya khusus: ia membaca `payload[0].payload` untuk menampilkan angka asli,
bukan potongan segmen.

### `Donut`

`src/charts/Donut.tsx`

```ts
SliceDatum = { label: string; count: number }
{ data: SliceDatum[]; title: string; note?: string; height?: number; centerLabel?: string }
```

Donat untuk komposisi yang berjumlah 100%. **Hanya untuk ≤4 kategori.** Di atas
itu potongannya terlalu tipis untuk dibaca — pakai `CategoryBars`.

`centerLabel` mengisi pusat donat (biasanya `"lowongan"`) dengan total di
atasnya. Legendanya sudah memuat jumlah dan persentase, jadi pembaca tidak perlu
memperkirakan besar potongan dari bentuknya.

---

## Format angka — `src/lib/format.ts`

Satu-satunya tempat angka menjadi teks.

| Fungsi | Masukan | Keluaran | Dipakai untuk |
| --- | --- | --- | --- |
| `rp(n)` | `399000` | `Rp399.000` | Harga dalam tabel, teks, contoh |
| `rpk(n)` | `12000000` | `Rp12 jt` | Sumbu grafik, judul ringkas |
| `n(v)` | `1234` | `1.234` | Jumlah, cacah |
| `pct(v)` | `43.2` | `43%` | Persentase bulat |
| `tanggal(iso)` | `"2026-10-19"` | `19 Oktober 2026` | Kepala laporan, metode |

`rp` untuk angka yang perlu dibaca persis. `rpk` **hanya** untuk sumbu dan judul
ringkas — jangan pakai di tabel, karena pembaca tabel butuh angka penuh.

Pemisah ribuan mengikuti kaidah Indonesia: titik (`Rp399.000`), dan koma untuk
desimal (`Rp12,2 jt`).

Jangan memakai `toLocaleString()` langsung di komponen. Kalau butuh format baru,
tambahkan fungsi di `format.ts`.
