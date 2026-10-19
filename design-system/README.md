# Sistem Desain — Laporan Pasar Jasa Website Jakarta

Spesifikasi visual dan kebahasaan untuk laporan ini. Dibaca oleh manusia dan
agen AI.

---

## Daftar isi

| Berkas | Isi |
| --- | --- |
| [`foundations.md`](./foundations.md) | Warna, tipografi, jarak, tata letak, aksesibilitas |
| [`components.md`](./components.md) | Setiap komponen dan setiap grafik, beserta aturan pemakaiannya |
| [`content.md`](./content.md) | Bahasa, format angka, dan cara menulis temuan |

---

## Satu sumber kebenaran

`src/styles/tokens.css` adalah satu-satunya tempat nilai visual didefinisikan.
Berkas di folder ini adalah **spesifikasi dan alasan**; token adalah
**implementasi**. Kalau keduanya berbeda, token yang benar dan dokumen ini yang
harus diperbarui.

```
design-system/*.md   spesifikasi + alasan   (mengapa)
src/styles/tokens.css         nilai          (apa)
src/components, src/charts    pemakaian      (bagaimana)
```

Aturan yang mengikat: komponen memakai token **semantik**
(`--text-muted`), bukan primitif (`--stone-500`). Primitif hanya boleh dirujuk
dari dalam `tokens.css` sendiri, supaya mengubah satu warna tidak perlu
menyentuh belasan berkas.

---

## Karakter yang dijaga

Laporan ini bergaya **minimalis analitis**:

- Satu warna aksen saja (tanah liat). Warna dipakai untuk menandai, bukan
  menghias.
- Off-white sebagai latar, bukan putih murni.
- Garis rambut, bukan bayangan, sebagai pemisah utama.
- Angka tabular di mana pun angka muncul.
- Tanpa animasi. Tanpa gradien. Tanpa ikon dekoratif.
- Hierarki dibangun dari ukuran, bobot, dan jarak — bukan dari warna.

Kalau sebuah perubahan menambah warna, bayangan, atau gerakan, perubahan itu
kemungkinan besar keluar dari karakter ini. Tanyakan dulu.
