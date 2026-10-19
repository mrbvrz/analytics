# Content

Bahasa, format angka, dan cara menulis temuan. Laporan ini berbahasa Indonesia.

---

## Nada

Analis yang menulis untuk pengambil keputusan. Netral, langsung, tanpa
dramatisasi.

| Lakukan | Hindari |
| --- | --- |
| "Median Rp285.000." | "Hanya Rp285.000 saja!" |
| "Hanya 13 listing menembus Rp3 juta." | "Sangat sedikit sekali yang mahal." |
| "Data ini potret satu waktu, bukan tren." | "Pasar sedang berkembang pesat." |
| "Kalau bermain di harga, standarkan paket." | "Anda harus segera bergerak sekarang!" |

Tanda seru tidak dipakai. Kata "sangat", "sekali", "luar biasa" tidak dipakai.
Kalau sebuah angka memang mengejutkan, angka itu yang bekerja — bukan kata
sifatnya.

Pakai "Anda" atau kalimat tanpa subjek. Jangan "kita" untuk hal yang belum tentu
disetujui pembaca.

---

## Angka

Tiga aturan, dalam urutan kepentingan.

### 1. Setiap angka punya sumber

Angka laporan datang dari `src/data/report.json`. Kalau sebuah kalimat butuh
angka, ambil dari data — jangan tulis tangan.

Pengecualian: rentang harga di tabel kompetitor dan anggaran segmen adalah
**penilaian analis**, bukan hasil scraping. Itu boleh ditulis tangan, tetapi
harus berupa rentang yang jelas, bukan angka presisi yang berpura-pura terukur.
`Rp10–75 jt` boleh; `Rp42,3 jt` tidak.

### 2. Kalimat harus tetap benar saat data berubah

Kesalahan yang sudah pernah terjadi di laporan ini:

```tsx
// salah — jadi bohong begitu median Jakarta turun di bawah nasional
<p>Median Jakarta sedikit di bawah median nasional {rp(nasional)}.</p>

// benar — arah mengikuti data
<p>
  Median Jakarta{" "}
  {jkt.median < nasional.median ? "di bawah" : "di atas"} median nasional{" "}
  {rp(nasional)}.
</p>
```

Kata seperti "sedikit", "jauh", "hampir", "nyaris", dan "justru" adalah klaim
kuantitatif yang menyamar jadi kata sambung. Kalau memakainya, pastikan
klaimnya tetap benar pada rentang data yang masuk akal — atau hitung.

### 3. Angka tidak boleh menggantung

Setiap angka yang muncul di prosa harus dapat ditemukan di tabel atau grafik di
dekatnya. Pembaca tidak boleh dipaksa mempercayai angka tanpa bisa memeriksanya.

---

## Format

| Keperluan | Aturan | Contoh |
| --- | --- | --- |
| Rupiah penuh | `rp()` | `Rp399.000` |
| Rupiah ringkas (sumbu, judul) | `rpk()` | `Rp12 jt` |
| Ribuan | titik | `1.234` |
| Desimal | koma | `12,2` |
| Persentase | dibulatkan, tanpa desimal | `43%` |
| Rentang | en dash tanpa spasi | `Rp100–500 rb` |
| Tanggal | `tanggal()`, tanpa tanggal nol di depan | `19 Oktober 2026` |
| Ukuran | singkatan setelah angka | `295 listing`, `218 lowongan` |

Simbol persen menempel pada angkanya. Satuan panjang (`listing`, `lowongan`)
dipisah spasi.

---

## Istilah

Pakai istilah yang dipakai pelaku pasar, bukan istilah internal.

| Pakai | Jangan |
| --- | --- |
| listing | produk, item |
| lowongan | posting, job |
| harga tayang | list price |
| custom development | pengembangan kustom |
| perusahaan menengah | mid-market |
| profil perusahaan | company profile (di prosa) |
| toko online | e-commerce (di prosa) |

Istilah Inggris tetap dipakai untuk hal teknis yang memang tidak punya padanan
lazim: `full-stack`, `landing page`, `SEO`, `WordPress`, `Laravel`.

Nama kanal ditulis apa adanya: `Shopee`, `Blibli`, `JobStreet`, `Glints`,
`Kalibrr`, `LinkedIn`, `Dealls`.

---

## Tanda baca

- **Em dash** (`—`) memisahkan penjelasan dari pernyataannya, dengan spasi di
  kedua sisi.
- **En dash** (`–`) hanya untuk rentang angka dan tanggal, tanpa spasi.
- **Tanda hubung** (`-`) hanya untuk kata majemuk.
- **Koma desimal**, sesuai kaidah Indonesia. Jangan pakai titik desimal.
- **Tanda kutip lengkung** (`“ ”`) untuk mengutip judul listing atau istilah,
  sesuai kaidah tipografi Indonesia. Jangan pakai `"` lurus di teks yang
  terlihat.
- **Judul bagian** memakai huruf kapital di awal kata saja, bukan Kapitalisasi
  Setiap Kata.

---

## Struktur kalimat temuan

Temuan ditulis dengan pola: pernyataan → angka → implikasi.

```tsx
<Callout>
  <strong>Temuan kunci:</strong> kategori yang paling sering muncul adalah{" "}
  <strong>paket domain + hosting</strong> (26%), disusul toko online dan company
  profile. Hanya 14% listing menyebut kemampuan teknis (Laravel, React, API).
  Sebagian besar penjual memasarkan paket siap-pakai, bukan rekayasa perangkat
  lunak.
</Callout>
```

Perhatikan: angka ada di dalam kalimat, bukan sebagai daftar terpisah. Kalimat
terakhir menyebut **apa artinya**, bukan mengulang angkanya.

---

## Keterbatasan

Setiap laporan yang memakai data hasil scraping wajib menyebut keterbatasannya
di bagian Metode. Yang sudah ada dan harus dipertahankan:

1. Harga marketplace adalah harga tayang, bukan harga transaksi.
2. Harga terendah pada listing multi-varian sering berupa umpan.
3. Total lowongan adalah hitungan hasil pencarian platform, bukan jumlah unik —
   ada duplikasi antar platform.
4. Kueri gaji mencerminkan gaji yang diiklankan saja.
5. Urutan hasil pencarian marketplace berubah antar penarikan, sehingga jumlah
   dan median dapat bergeser beberapa persen tanpa perubahan pasar yang nyata.
6. Data ini potret satu waktu, bukan tren.

Butir 5 penting dan mudah terlupa: angka laporan ini **akan** berubah kalau
datanya ditarik ulang. Jangan menulis kalimat yang mengandaikan angkanya tetap.
