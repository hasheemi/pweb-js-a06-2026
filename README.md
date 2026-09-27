# Praktikum Pemrograman Web

**Departemen Teknologi Informasi - 2025**

## Anggota Kelompok A06

| Nama                     | NRP        |
| ------------------------ | ---------- |
| Muhammad Hugo Rayandra E | 5027251076 |
| Hasheemi Rafsanjani      | 5027251015 |
| Syarifah Nailatur Rohma  | 5027251109 |

## Deskripsi Singkat

**VELVERO** adalah website e-commerce sederhana yang menyediakan pengalaman belanja online mulai dari login, melihat katalog produk, mencari dan memfilter produk sesuai keinginan, melihat detail produk, hingga menambahkan produk ke keranjang belanja. Website ini dilengkapi fitur pencarian real-time, filter kategori, pengurutan berdasarkan harga dan rating, tombol Load More untuk memuat produk secara bertahap, serta keranjang belanja yang tersimpan otomatis sehingga tetap ada saat halaman dibuka kembali.

## Struktur Folder

```text
root/
│
├── index.html
├── style.css
├── index.js
│
├── login.html
├── login.css
├── login.js
│
├── keranjang.html
├── keranjang.css
└── keranjang.js
```

## Halaman Website

- **login.html** Halaman login yang memvalidasi kredensial pengguna melalui API dummyjson, dilengkapi loading state, error handling, penyimpanan sesi ke Local Storage, dan auto redirect ke halaman katalog setelah berhasil login.

- **index.html** Halaman katalog produk utama yang menampilkan daftar produk dari API, dilengkapi fitur pencarian real-time, filter kategori, sorting, modal detail produk, tombol Load More, dan navigasi menuju keranjang belanja.

- **keranjang.html** Halaman keranjang belanja yang menampilkan item yang telah ditambahkan pengguna, dengan fitur update jumlah, hapus item, dan perhitungan total harga.

## Teknologi

Website ini dibuat menggunakan:

- HTML5
- CSS3
- JavaScript (Vanilla)

## Deployment

Website telah di-deploy menggunakan Vercel dan dapat diakses melalui:

**https://velvero-pweba06.vercel.app/**
