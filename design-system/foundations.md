# Foundations

Warna, tipografi, jarak, dan tata letak. Semua nilai di sini sudah diterapkan
di `src/styles/tokens.css`.

---

## 1. Warna

### Lapisan token

| Lapisan | Contoh | Boleh dipakai di |
| --- | --- | --- |
| Primitif | `--stone-500`, `--clay-600` | Hanya di dalam `tokens.css` |
| Semantik | `--text-muted`, `--border-default` | Komponen |
| Komponen | `--chart-bar`, `--section-gap` | Komponen terkait saja |

Komponen **tidak pernah** merujuk primitif. Kalau butuh warna yang belum ada
token semantiknya, tambahkan token semantik baru — jangan pakai primitifnya.

### Palet semantik

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `--surface-page` | `#fcfcfb` | Latar halaman |
| `--surface-raised` | `#ffffff` | Tooltip grafik |
| `--surface-sunken` | `#f5f5f4` | Baris zebra, kode, hover kursor |
| `--surface-accent` | `#fdf6f1` | Latar callout |
| `--text-primary` | `#141310` | Teks utama, angka |
| `--text-secondary` | `#4a453f` | Teks pendukung, judul grafik |
| `--text-muted` | `#78716c` | Label, catatan, tick grafik |
| `--text-accent` | `#bc4a1a` | Sumber data, harga contoh |
| `--border-strong` | `#d6d3d1` | Batas tooltip |
| `--border-default` | `#e7e5e4` | Batas bagian, garis tabel |
| `--border-soft` | `#f2f0ef` | Garis rambut, grid grafik |
| `--accent` | `#bc4a1a` | Aksen tunggal |
| `--accent-soft` | `#f2d4c2` | Segmen pucat pada grafik rentang gaji |

### Seri data

Dipakai berurutan mulai dari `--data-1`. Jangan melompat.

| Token | Nilai | Peran |
| --- | --- | --- |
| `--data-1` | `#bc4a1a` | Seri utama (= aksen) |
| `--data-2` | `#d98b5f` | Seri kedua |
| `--data-3` | `#f2d4c2` | Seri ketiga |
| `--data-4` | `#a8a29e` | Seri netral |
| `--data-5` | `#57534e` | Seri netral gelap |

Tidak ada token untuk "warna keempat", dst. Kalau sebuah grafik butuh lebih dari
lima seri, grafiknya kemungkinan terlalu ramai — pecah atau urutkan ulang.

### Kontras (WCAG 2.2 AA)

Diukur dengan rumus luminansi relatif. Ambang untuk teks kecil adalah 4,5:1.

| Pasangan | Rasio | Status |
| --- | --- | --- |
| teks utama di latar halaman | 18,10 | Lulus AAA |
| teks sekunder di latar halaman | 9,24 | Lulus AAA |
| teks redup di latar halaman | 4,67 | Lulus AA |
| aksen sebagai teks di latar halaman | 4,95 | Lulus AA |
| teks utama di dalam callout | 17,37 | Lulus AAA |
| tick grafik | 4,80 | Lulus AA |

`--stone-400` (`#a8a29e`) **tidak boleh** dipakai sebagai warna teks: rasionya
2,46:1 dan gagal AA. Token `--text-faint` pernah ada dan sudah dihapus karena
alasan ini. Pakai `--text-muted` sebagai lantai teks paling redup.

Teks aksen selalu `--text-accent` (`--clay-600`), bukan `--clay-500` —
`--clay-500` tidak cukup kontras di atas latar halaman.

---

## 2. Tipografi

### Keluarga huruf

**Uncut Sans** (Kasper Nordkvist, lisensi OFL-1.1) — berkas variabel tunggal di
`public/fonts/UncutSans-Variable.woff2`.

| Sumbu | Rentang | Default |
| --- | --- | --- |
| `wght` | 300–700 | 400 |
| `ital` | 0–11 | 0 |

Instans bernama: Light 300, Book 350, Regular 400, Medium 500, Semibold 600,
Bold 700.

Fitur OpenType yang tersedia: `tnum`, `zero`, `ss01`–`ss09`, `pnum`, `case`,
`frac`, `numr`/`dnom`, `ordn`, `sinf`/`sups`, `subs`.

**`tnum` (angka tabular) menyala di seluruh dokumen** lewat `--num-feat` pada
`body`. Ini wajib: tanpa angka tabular, kolom angka tidak sejajar dan tabel
gagal dibaca. Jangan matikan `tnum` pada konteks angka.

Fitur lain sengaja **tidak** dinyalakan. `ss01`–`ss09` adalah alternatip
karakter yang bisa memberi watak pada judul, tetapi laporan ini memilih netral.
Kalau suatu saat dipakai, pakai hanya pada judul tampilan, bukan pada teks
berjalan.

### Bobot

Hanya empat bobot yang dipakai. Jangan menambah bobot baru tanpa alasan.

| Bobot | Nama | Dipakai untuk |
| --- | --- | --- |
| 400 | Regular | Teks berjalan |
| 500 | Medium | Label teknis, `--meta b`, `--points b` |
| 550 | Antara Medium dan Semibold | Judul tampilan, nilai statistik, judul grafik |
| 600 | Semibold | Judul bagian, kepala tabel |

**Selalu pakai `font-weight`.** Jangan pakai `font-variation-settings: "wght" N`.
Sumbu `ital` yang tidak disebut akan tertinggal pada keadaan ambigu dan dapat
menghasilkan huruf miring yang tidak diminta. Lihat `AGENTS.md` aturan 5.

### Skala huruf

| Peran | Kelas | Ukuran | Bobot | Warna |
| --- | --- | --- | --- | --- |
| Judul laporan | `.masthead h1` | `clamp(34px, 6vw, 54px)` | 550 | primary |
| Judul bagian | `.section h2` | `clamp(23px, 3.2vw, 31px)` | 600 | primary |
| Pengantar | `.lede` | 17px | 400 | secondary |
| Teks berjalan | `body` | 16px / 1.65 | 400 | primary |
| Subjudul | `.subhead` | 15px | 550 | secondary |
| Catatan bagian | `.section__note` | 14px | 400 | muted |
| Tabel | `.table` | 13,5px | 400 | primary |
| Judul grafik | `.figure__title` | 12,5px | 550 | secondary |
| Label kartu | `.stat__label` | 12,5px | 400 | muted |
| Nama contoh | `.examples__name` | 12,5px | 400 | secondary |
| Catatan grafik | `.figure__note` | 12px | 400 | muted |
| Kepala tabel | `.table th` | 11,5px | 600 | muted |
| Eyebrow | `.eyebrow` | 11,5px | 600 | accent |
| Nilai statistik | `.stat__value` | 26px | 550 | primary |

Judul memakai `letter-spacing` negatif (`-0,02em` sampai `-0,035em`) karena
Uncut Sans merenggang di ukuran besar. Teks berjalan tidak diberi
`letter-spacing`. Eyebrow memakai `letter-spacing` positif `0,16em` dan huruf
kapital.

Satu-satunya elemen huruf besar semua adalah eyebrow dan kepala tabel. Jangan
membuat teks berjalan jadi huruf besar semua.

---

## 3. Jarak

Skala 4px. Tidak ada nilai di luar skala ini.

| Token | Nilai | Pemakaian lazim |
| --- | --- | --- |
| `--s1` | 4px | Celah ikon-teks |
| `--s2` | 8px | Jarak dalam satu baris |
| `--s3` | 12px | Jarak antar-label |
| `--s4` | 16px | Padding sel tabel |
| `--s5` | 20px | Padding callout, padding sel contoh |
| `--s6` | 24px | Padding tepi halaman |
| `--s8` | 32px | Jarak antar-blok |
| `--s10` | 40px | Jarak antar-kolom |
| `--s14` | 56px | Jarak antar-bagian (`--section-gap`) |
| `--s18` | 72px | Padding atas kepala laporan |

Jangan menulis `margin: 15px`. Kalau butuh 15px, keputusan sesungguhnya adalah
apakah akan 12 atau 16.

---

## 4. Tata letak

| Token | Nilai | Keterangan |
| --- | --- | --- |
| `--layout-max` | 960px | Lebar maksimum kolom isi |
| `--layout-pad` | `--s6` (24px) → `--s5` (20px) di bawah 720px | Padding tepi |
| `--section-gap` | `--s14` (56px) → `--s10` (40px) di bawah 720px | Jarak antar-bagian |

Struktur halaman: `.masthead` → `.toc` (lengket) → `<main class="wrap">`
berisi `.section` berturut-turut → `.footer`.

**Lebar baca.** `.section__note` dan `.lede` dibatasi 62–68ch. Jangan biarkan
paragraf melebar penuh 960px — baris yang terlalu panjang sulit dibaca.

**Dua kolom** dipakai lewat `.columns` dan `.columns--wide-left`, dan runtuh
menjadi satu kolom di bawah 720px. Jangan membuat tata letak dua kolom lain.

**Kisi garis rambut.** `.stats` dan `.examples` memakai pola `gap: 1px` dengan
latar `--border-default`, sehingga garis pemisah tidak pernah berganda. Pakai
pola ini untuk kisi baru, jangan memberi `border` pada setiap sel.

---

## 5. Radius dan kedalaman

| Token | Nilai | Dipakai untuk |
| --- | --- | --- |
| `--radius-xs` | 2px | Swatch legenda, kode |
| `--radius-sm` | 3px | Callout, tooltip |
| `--radius-md` | 6px | (tersedia) |
| `--radius-full` | 99px | Titik legenda |

Batang grafik memakai radius 2px pada ujungnya saja. Tepi persegi panjang
dipertahankan agar batang tetap terbaca sebagai nilai.

**Kedalaman.** Laporan ini memakai garis, bukan bayangan. Satu-satunya bayangan
di seluruh laporan adalah pada tooltip grafik, karena tooltip memang mengambang
di atas konten. Jangan menambah bayangan di tempat lain. Jangan menambah
gradien.

---

## 6. Gerakan

Tidak ada. Laporan ini statis dan grafik dirender tanpa animasi.

Alasan teknis: Recharts menganimasikan batang dari tinggi nol, sehingga grafik
tampak kosong pada paint pertama dan pada tangkapan layar. Alasan desain:
laporan yang dibaca sekali tidak butuh gerakan pengantar.

Satu-satunya transisi yang diizinkan adalah perubahan warna pada tautan
navigasi, dan itu pun bawaan peramban.

---

## 7. Aksesibilitas

Yang sudah dipenuhi:

- Semua pasangan teks/latar lolos WCAG 2.2 AA (tabel di bagian 1).
- Navigasi bagian punya `aria-label="Daftar isi"` pada `<nav>`.
- Tabel memakai `<th scope="col">` dan `<caption>` opsional.
- Grafik: angka selalu tersedia sebagai teks — lewat label di ujung batang
  (`LabelList`) atau legenda, bukan hanya lewat bentuk atau warna.
- Informasi tidak pernah disampaikan **hanya** lewat warna. Legendanya selalu
  ada, dan nilainya juga tercetak.

Yang harus dijaga saat mengubah:

- Jangan memakai `--stone-400` atau warna lebih terang untuk teks.
- Jangan menghapus label nilai dari batang; warna saja tidak cukup.
- Jangan menambahkan `outline: none` tanpa pengganti fokus yang terlihat.
- Teks yang lebih kecil dari 12px sebaiknya dihindari; lantai saat ini 11,5px
  untuk eyebrow dan kepala tabel yang bersifat label, bukan prosa.
