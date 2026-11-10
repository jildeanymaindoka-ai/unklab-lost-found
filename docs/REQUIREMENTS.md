# UNKLAB Lost & Found

Aplikasi web untuk membantu mahasiswa dan warga Universitas Klabat melaporkan barang hilang, mengumumkan barang yang ditemukan, serta mencari informasi barang di lingkungan kampus.

Project ini dikembangkan untuk tugas **Final Project Web Design**, menggunakan **HTML5, CSS3, dan Vanilla JavaScript**, dengan Firebase untuk autentikasi dan penyimpanan data.

- **Website:** [UNKLAB Lost & Found](https://unklablostfound.netlify.app)
- **Repository:** [Source code di GitHub](https://github.com/jildeanymaindoka-ai/unklab-lost-found)
- **Hosting:** Netlify
- **Status dokumentasi:** 10 November 2026

## Tampilan Aplikasi

![Beranda UNKLAB Lost & Found](docs/images/beranda.png)

Screenshot menunjukkan beranda dengan navigasi utama, tombol pembuatan laporan, dan ringkasan jumlah laporan. Angka statistik mengikuti data yang tersimpan dalam aplikasi.

## Latar Belakang dan Tujuan

Informasi barang hilang dan ditemukan sering tersebar di berbagai tempat sehingga sulit ditelusuri. Aplikasi ini menyediakan tempat terpusat untuk mencatat laporan dan membantu pencarian barang.

Tujuan aplikasi:

- Memudahkan pembuatan laporan kehilangan dan penemuan barang.
- Memungkinkan pencarian berdasarkan kata kunci, kategori, jenis, dan status.
- Memberikan akses kepada pengguna untuk mengelola laporan sendiri.
- Membantu admin memverifikasi laporan dan mencatat pengembalian barang.

Project ini merupakan aplikasi pembelajaran dan belum dinyatakan sebagai layanan resmi Universitas Klabat.

## Teknologi

| Teknologi | Penggunaan |
|---|---|
| HTML5 | Struktur halaman dan form |
| CSS3 | Tampilan, Flexbox, Grid, dan responsive design |
| Vanilla JavaScript | Navigasi, DOM, event, validasi, filter, dan CRUD |
| Firebase Authentication | Registrasi dan login email/password |
| Cloud Firestore | Penyimpanan laporan |
| Firestore Security Rules | Pengaturan akses database |
| Local Storage | Data demo, sesi demo, dan preferensi filter |
| Chart.js | Grafik statistik pada dashboard |
| Fetch API | Memuat template HTML dan adapter pencarian lokasi |
| GitHub | Penyimpanan source code |
| Netlify | Deployment website |

Aplikasi tidak menggunakan React, Vue, Angular, atau framework frontend lainnya.

## Fitur

### Pengunjung

- Melihat beranda dan statistik laporan.
- Mencari laporan berdasarkan kata kunci.
- Memfilter laporan berdasarkan jenis, kategori, dan status.
- Membaca detail laporan dan panduan.
- Mendaftar atau masuk ke akun.

### User

- Membuat laporan barang hilang atau ditemukan.
- Melihat laporan sendiri melalui dashboard.
- Mengedit dan menghapus laporan sendiri.
- Mengekspor laporan sendiri ke CSV.

### Admin

- Mengakses halaman pengelolaan seluruh laporan.
- Mengedit dan menghapus laporan.
- Memverifikasi laporan.
- Menandai barang yang sudah dikembalikan.
- Melihat statistik dan mengekspor seluruh laporan ke CSV.

### Fitur Pendukung

- Validasi form.
- Notifikasi keberhasilan atau kegagalan operasi.
- Konfirmasi sebelum menghapus laporan.
- Filter tersimpan setelah halaman dimuat ulang.
- Tampilan responsif.
- Mode demo dengan data fiktif.

## Halaman dan Navigasi

Aplikasi menggunakan navigasi berbasis hash. `index.html` menyediakan kerangka utama, sedangkan isi halaman dimuat dari folder `pages/`.

| Tampilan | Alamat | Template |
|---|---|---|
| Beranda | `/#home` | `pages/home.html` |
| Pencarian | `/#browse` | `pages/browse.html` |
| Login | `/#login` | `pages/auth.html` |
| Registrasi | `/#register` | `pages/auth.html` |
| Tambah laporan | `/#report` | `pages/report.html` |
| Edit laporan | `/#report/ID_LAPORAN` | `pages/report.html` |
| Detail laporan | `/#detail/ID_LAPORAN` | `pages/detail.html` |
| Dashboard user | `/#dashboard` | `pages/dashboard.html` |
| Pengelolaan admin | `/#admin` | `pages/dashboard.html` |
| Panduan | `/#help` | `pages/help.html` |

Login dan registrasi menggunakan template bersama. Dashboard user dan admin juga menggunakan template bersama dengan data serta tombol sesuai hak akses.

## Struktur Project

```text
unklab-lost-found/
├── index.html
├── assets/
│   └── styles.css
├── pages/
│   ├── home.html
│   ├── browse.html
│   ├── auth.html
│   ├── report.html
│   ├── detail.html
│   ├── dashboard.html
│   ├── help.html
│   └── components/
├── js/
│   ├── app.js
│   ├── templates.js
│   ├── config.js
│   ├── firebase.js
│   ├── store.js
│   ├── model.js
│   └── locations.js
├── scripts/
│   └── serve.mjs
├── tests/
│   ├── model.test.mjs
│   └── templates.test.mjs
├── docs/
│   ├── REQUIREMENTS.md
│   └── images/
│       └── beranda.png
├── firestore.rules
├── firebase.json
├── netlify.toml
├── package.json
├── .prettierrc.json
├── .gitignore
└── README.md
```

### Peran Modul JavaScript

| File | Tanggung jawab |
|---|---|
| `app.js` | Mengatur navigasi, menampilkan halaman, dan menangani interaksi pengguna |
| `templates.js` | Memuat template HTML dan mengisi penanda data |
| `config.js` | Menyimpan pilihan mode dan konfigurasi web Firebase |
| `firebase.js` | Menjalankan autentikasi dan operasi Firestore |
| `store.js` | Menyediakan operasi data yang sama untuk mode demo dan Firebase |
| `model.js` | Menyediakan kategori, data demo, validasi, filter, dan ekspor CSV |
| `locations.js` | Menangani pencarian lokasi lokal dan adapter API |

## Cara Menjalankan Secara Lokal

### Persiapan

- Node.js versi 20 atau lebih baru.
- Git jika ingin mengunduh repository melalui terminal.
- Browser modern.
- Internet untuk mode Firebase, Chart.js, dan Google Fonts.

### Langkah Menjalankan

```bash
git clone https://github.com/jildeanymaindoka-ai/unklab-lost-found.git
cd unklab-lost-found
npm start
```

Buka:

```text
http://localhost:4173
```

Tidak ada proses build atau instalasi dependency aplikasi yang diperlukan untuk menjalankan server lokal ini.

Jangan membuka `index.html` langsung melalui `file://`. Aplikasi menggunakan JavaScript modules dan Fetch untuk memuat template, sehingga perlu dijalankan melalui server lokal. VS Code Live Server dapat digunakan sebagai alternatif.

### Mode Demo

Untuk mencoba aplikasi tanpa menggunakan database Firebase, ubah pengaturan pada `js/config.js`:

```js
mode: "demo"
```

Buka halaman login, lalu pilih **Demo user** atau **Demo admin**.

Data demo tersimpan pada browser yang digunakan. Akun demo bukan akun Firebase dan tidak memberikan hak admin pada database sebenarnya.

Untuk kembali menggunakan Firebase:

```js
mode: "firebase"
```

## Konfigurasi Firebase

Project menggunakan Firebase Authentication dengan metode **Email/Password** dan database Cloud Firestore.

Jika menggunakan project Firebase sendiri:

1. Buat project dan daftarkan Web App melalui Firebase Console.
2. Aktifkan metode login Email/Password.
3. Buat database Cloud Firestore.
4. Isi konfigurasi Web App pada `js/config.js`.
5. Terapkan isi `firestore.rules` melalui Firebase Console.
6. Sesuaikan Authorized domains dengan domain pengembangan dan hosting yang digunakan.
7. Ubah mode aplikasi menjadi `firebase`.

Konfigurasi web Firebase merupakan konfigurasi client. Password, token admin, private key, dan service-account JSON tidak boleh dimasukkan ke source code atau repository.

### Akun Admin

Hak admin diberikan melalui custom claim:

```json
{
  "admin": true
}
```

Claim hanya diberikan oleh pengelola melalui Firebase Admin SDK di lingkungan tepercaya. Pengguna tidak dapat memilih peran admin saat registrasi.

Setelah pemberian claim, pengguna perlu keluar dan masuk kembali agar aplikasi membaca hak akses terbaru.

## Struktur Data Firestore

Laporan disimpan pada collection:

```text
reports/{reportId}
```

| Field | Tipe | Keterangan |
|---|---|---|
| `title` | String | Nama barang |
| `type` | String | `lost` atau `found` |
| `category` | String | Kategori barang |
| `location` | String | Lokasi kejadian |
| `date` | String | Tanggal dalam format `YYYY-MM-DD` |
| `description` | String | Deskripsi laporan |
| `ownerId` | String | UID pengguna pembuat laporan |
| `createdAt` | Number | Waktu pembuatan dalam milidetik |
| `status` | String | `pending`, `verified`, atau `returned` |

`reportId` merupakan ID dokumen. Saat dibaca oleh aplikasi, ID tersebut ditambahkan sebagai properti `id`.

### Status Laporan

| Status | Arti |
|---|---|
| `pending` | Menunggu verifikasi admin |
| `verified` | Sudah diverifikasi admin |
| `returned` | Barang sudah dikembalikan |

Laporan baru berstatus `pending`. Perubahan isi laporan mengembalikan status menjadi `pending`.

Pada implementasi saat ini, laporan berstatus `pending` tetap dapat dilihat publik. Verifikasi merupakan penanda status pemeriksaan, bukan syarat agar laporan ditampilkan.

## Panduan Penggunaan

### Membuat dan Mengelola Laporan

1. Daftar atau masuk menggunakan email dan password.
2. Klik **Buat laporan**.
3. Pilih jenis laporan dan kategori.
4. Isi nama barang, tanggal, lokasi, dan deskripsi.
5. Klik **Simpan laporan**.
6. Buka **Dashboard** untuk melihat laporan sendiri.
7. Gunakan **Edit** untuk memperbarui laporan atau **Hapus** untuk menghapusnya setelah konfirmasi.

Form login dan registrasi saat ini mensyaratkan password minimal delapan karakter.

### Mencari Barang

1. Buka **Cari barang**.
2. Masukkan nama barang, lokasi, atau kata pada deskripsi.
3. Gunakan filter jenis, kategori, dan status bila diperlukan.
4. Buka judul laporan untuk membaca detailnya.

### Mengelola Sebagai Admin

1. Masuk dengan akun yang memiliki hak admin.
2. Buka **Dashboard → Kelola semua laporan**.
3. Periksa informasi laporan.
4. Klik **Verifikasi** setelah pemeriksaan.
5. Klik **Dikembalikan** setelah proses pengembalian barang selesai.

Verifikasi kepemilikan dan penyerahan barang dilakukan di luar aplikasi. Fitur pengajuan klaim daring belum tersedia.

### Mengekspor CSV

Klik **Export CSV** pada dashboard. Dashboard user mengekspor laporan miliknya, sedangkan halaman admin mengekspor seluruh laporan.

File CSV menggunakan UTF-8 dan penanganan karakter khusus untuk menjaga format data saat dibuka pada aplikasi spreadsheet.

## Implementasi Materi Web Design

- **DOM manipulation:** menampilkan template, memperbarui hasil pencarian, dan menampilkan notifikasi.
- **Event handling:** menangani submit form, perubahan filter, tombol, dan perubahan hash URL.
- **Arrays dan objects:** menyimpan model laporan, memfilter data, serta menghitung statistik.
- **Local Storage:** menyimpan data demo, sesi demo, preferensi filter, dan cache lokasi jika API diaktifkan.
- **Form validation:** memeriksa input wajib, panjang teks, kategori, dan tanggal.
- **Responsive design:** menggunakan Flexbox, Grid, serta media query.
- **Dashboard:** menampilkan ringkasan angka dan grafik Chart.js.
- **Konfirmasi:** meminta persetujuan sebelum penghapusan laporan.

File HTML pada folder `pages/` merupakan potongan halaman. Penanda seperti `{{statistics}}` diisi melalui JavaScript. Pertahankan nama penanda, ID form, dan atribut `data-*` ketika mengedit tampilan agar interaksi tetap bekerja.

## Deployment

Website telah dideploy melalui Netlify dan terhubung dengan repository GitHub.

Pengaturan deployment:

| Pengaturan | Nilai |
|---|---|
| Branch | `main` |
| Base directory | Kosong |
| Build command | Kosong |
| Publish directory | `.` |

Perubahan yang diunggah ke branch `main` dapat memicu deployment baru melalui integrasi GitHub–Netlify. Status deployment dapat dilihat pada menu **Deploys**.

## Pengujian

Jalankan pengujian otomatis:

```bash
npm test
```

Pengujian mencakup:

- Pencarian dengan beberapa filter sekaligus.
- Penolakan input laporan yang tidak valid.
- Penanganan karakter khusus pada CSV.
- Penanganan awalan formula spreadsheet pada ekspor.
- Pemuatan template HTML.
- Penanganan kegagalan pemuatan template.
- Penggantian penanda template.
- Penanganan nama template atau data yang tidak tersedia.

Pada pemeriksaan terakhir, delapan pengujian otomatis lulus. Pemeriksaan DOM sebelumnya juga mencakup 14 kombinasi halaman dan peran.

Pengujian Firebase, koneksi, dan tampilan responsif telah dinyatakan selesai oleh tim pada 10 November 2026. Pernyataan ini merupakan konfirmasi tim, bukan laporan pengujian otomatis Firebase Emulator.

## Status Pengumpulan

| Bagian | Status |
|---|---|
| Persetujuan topik oleh dosen | Selesai, dikonfirmasi tim |
| Source code di GitHub | Tersedia |
| Deployment Netlify | Tersedia |
| README | Tersedia |
| Screenshot beranda | Tersedia |
| Pengujian Firebase | Selesai, dikonfirmasi tim |
| Pengujian koneksi | Selesai, dikonfirmasi tim |
| Pengujian responsif | Selesai, dikonfirmasi tim |
| PowerPoint | Selesai, dikonfirmasi tim; file dikelola terpisah |
| Chart.js | Diimplementasikan |
| Export CSV | Diimplementasikan |
| Public API lokasi | Belum aktif |

## Batasan dan Pengembangan Berikutnya

- Pencarian lokasi saat ini menggunakan daftar kampus lokal. Adapter API eksternal sudah tersedia, tetapi provider belum dihubungkan.
- Fetch untuk memuat template HTML tidak dinyatakan sebagai integrasi public API lokasi.
- Foto barang belum dapat diunggah.
- Pengajuan klaim dan verifikasi kepemilikan daring belum tersedia.
- Bot WhatsApp belum diimplementasikan.
- Fitur lupa password belum tersedia pada website; reset dapat dilakukan melalui Firebase Console.

Laporan bersifat publik. Pengguna sebaiknya hanya menuliskan ciri umum barang dan menghindari informasi pribadi, dokumen identitas, atau detail rahasia yang digunakan untuk membuktikan kepemilikan.

## Kontribusi Kelompok

Setiap anggota bertanggung jawab atas kontribusinya dan wajib memahami kode yang digunakan. Pembagian pekerjaan dapat mencakup antarmuka, CRUD dan database, pengujian, dokumentasi, serta presentasi.

Identitas anggota dan pembagian kontribusi aktual dicantumkan oleh kelompok pada berkas pengumpulan atau presentasi.