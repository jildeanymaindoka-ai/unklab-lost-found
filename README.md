# UNKLAB Lost & Found

Aplikasi final Web Design dengan HTML5, CSS3, dan Vanilla JavaScript. Konfigurasi Web Firebase project `unklab-lost-found` sudah terpasang dan mode **Firebase** aktif. Aktivasi Authentication, database, dan penerapan rules tetap perlu diselesaikan di Firebase Console. Ini bukan layanan kampus resmi. Tidak ada React/Vue/Angular atau kredensial rahasia.

## Jalankan

Butuh Node.js 20+ untuk server pengembangan (aplikasi di browser tidak membutuhkan Node).

```sh
npm start
```

Buka http://localhost:4173. Jangan membuka index.html langsung melalui file:// karena menggunakan ES modules. Alternatif: VS Code Live Server. Untuk mencoba tanpa Firebase, ubah `mode` menjadi `'demo'` di js/config.js, lalu pilih Masuk → Demo user atau Demo admin. Data contoh menggunakan tanggal November 2026; gunakan tanggal perangkat yang benar untuk laporan baru.

## Fitur dan tampilan

Beranda, pencarian dengan filter tersimpan, detail laporan, login, registrasi, form tambah/edit, dashboard user, kelola admin, serta halaman panduan. Route menggunakan hash agar bisa langsung digunakan di GitHub Pages tanpa rewrite.

- CRUD laporan hilang/ditemukan, kategori, lokasi, tanggal, deskripsi.
- Validasi native HTML dan JavaScript; notifikasi hasil serta dialog konfirmasi hapus.
- Local Storage untuk data demo, sesi demo, preferensi filter, cache lokasi.
- Hak akses pemilik dan admin; laporan baru/perubahan berstatus pending, admin memverifikasi dan menandai returned setelah pemeriksaan langsung.
- Dashboard dengan Chart.js dan ringkasan angka sebagai fallback; CSV dengan BOM UTF-8, escaping, serta proteksi formula spreadsheet.
- Layout Grid/Flexbox responsif, label form, skip link, focus ring, dan notifikasi aria-live.
- Adapter Firebase siap dikonfigurasi. Foto/upload, klaim daring, dan kontak petugas belum tersedia. Jangan menaruh kontak pribadi di laporan publik.

## Struktur

```text
index.html              shell HTML semantik
assets/styles.css       token desain dan layout responsif
js/app.js               routing hash, DOM, form, event, dashboard
js/model.js             model, data contoh, filter, validasi, CSV
js/store.js             adapter demo/Firebase dan pemeriksaan akses UI
js/firebase.js          Authentication dan Firestore
js/config.js            pilihan mode dan konfigurasi web publik
js/locations.js         pencarian lokasi, cache, timeout, pembatasan request
firestore.rules         izin database (sumber keamanan sebenarnya)
firebase.json           konfigurasi rules dan emulator
netlify.toml            konfigurasi hosting statis
tests/model.test.mjs    pengujian logika data
docs/REQUIREMENTS.md    pemetaan ketentuan dan pekerjaan akhir
```

Ubah warna di :root pada CSS dan data kategori/lokasi di model.js. Tidak ada foto kampus atau logo resmi yang diasumsikan tersedia. Google Fonts dan Chart.js memakai CDN; tanpa internet font fallback dan ringkasan angka tetap tersedia. Firebase mode memerlukan internet.

## Aktivasi Firebase

1. Buat project Firebase milik kelompok. Tambahkan Web App dan salin firebaseConfig publik. Aktifkan Authentication → Email/Password dan buat Firestore database di production mode.
2. Isi apiKey, authDomain, projectId, appId pada js/config.js; ubah mode menjadi firebase. Konfigurasi Web Firebase bukan private key; tetap batasi akses dengan rules dan pengaturan project.
3. Deploy firestore.rules melalui tab Rules di Firestore Console atau Firebase CLI: `firebase deploy --only firestore:rules --project PROJECT_ID`. Jangan gunakan rules test mode. Rules menolak collection lain, pergantian owner/createdAt, serta eskalasi status oleh user. Seluruh laporan termasuk pending dapat dibaca publik; jangan menyimpan data sensitif di collection reports.
4. Tambahkan localhost dan hostname hosting pada Authentication → Settings → Authorized domains. Tetapkan password policy yang sesuai di Authentication.
5. Daftarkan akun admin biasa melalui aplikasi, lalu pengelola project memberi custom claim `admin: true` memakai Admin SDK dari lingkungan tepercaya. Tidak ada pilihan daftar sebagai admin di mode Firebase. Contoh di lingkungan admin yang sudah diautentikasi dengan Application Default Credentials:

```js
import {initializeApp, applicationDefault} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
initializeApp({credential:applicationDefault()});
const auth = getAuth();
const user = await auth.getUser('UID_ADMIN');
await auth.setCustomUserClaims(user.uid, {...user.customClaims, admin:true});
```

Jalankan contoh tersebut di folder alat admin terpisah dengan firebase-admin, **bukan di browser atau hosting**. Keluar/masuk kembali agar token baru diterima. Jangan kirim password, service account JSON, private key, atau token admin ke chat/repo. Claim dipercaya oleh Firestore Rules, bukan Local Storage. Akun demo admin hanya simulasi yang sengaja bisa dipilih bebas.

Referensi resmi: [Firebase custom claims](https://firebase.google.com/docs/auth/admin/custom-claims), [Web setup](https://firebase.google.com/docs/web/setup), [Security Rules](https://firebase.google.com/docs/firestore/security/get-started).

## Pencarian lokasi dan kebijakan API

Versi awal memakai daftar lokasi kampus lokal; nama lokasi dapat diketik manual. Tombol Cari lokasi memanggil adapter Fetch apabila locationEndpoint diisi. Endpoint harus menerima q/format/limit, mendukung CORS, dan mengembalikan array `{display_name, lat?, lon?}`. Jangan memasukkan API secret pada URL di browser; provider yang membutuhkan secret harus dipanggil melalui backend sendiri. Endpoint bisa diganti tanpa mengubah UI.

**Bonus public API belum aktif secara langsung sampai provider ditentukan.** Nominatim publik tidak dipasang otomatis. [Kebijakan Nominatim](https://operations.osmfoundation.org/policies/nominatim/) mewajibkan penggunaan ringan maksimal 1 request/detik, identifikasi Referer/User-Agent, atribusi OpenStreetMap, cache, tanpa autocomplete, dan ketentuan khusus penggunaan melalui platform pembuat aplikasi. Pengelola aplikasi harus mengambil keputusan penggunaan secara sadar dan bertanggung jawab atas kepatuhan. Jangan menganggap throttle per browser cukup untuk batas agregat seluruh pengguna.

Untuk produksi pilih provider yang mengizinkan penggunaan ini atau self-host/proxy dengan pembatasan global. Tambahkan atribusi provider yang terlihat di UI sebelum aktivasi. Adapter sudah memakai pencarian tombol eksplisit, cache query, jeda 1,5 detik per browser, dan timeout; kontrol agregat dan kebijakan provider tetap perlu di server. Jangan kirim data pribadi ke layanan lokasi.

## Deploy

**Netlify:** hubungkan GitHub repository, pilih build command kosong dan publish directory `.` (sesuai netlify.toml), lalu deploy. Alternatif unggah folder project tanpa .git, file rahasia, atau node_modules ke Netlify Drop.

**GitHub Pages:** push source ke repo, buka Settings → Pages → Deploy from branch → main / root. Semua path aset relatif; hash routing mendukung subpath repository. Setelah deploy, tambahkan domain Pages/Netlify pada Firebase Authorized domains dan uji ulang. Jangan menaruh file admin/rahasia dalam folder yang diterbitkan. Belum ada deployment publik yang dilakukan dari workspace ini; akun hosting/repository belum disediakan.

## Pengujian

`npm test` memeriksa pencarian gabungan, validasi, escaping CSV dan pencegahan formula. Syntax JavaScript dapat diperiksa dengan `node --check js/app.js`. Pengujian database sungguhan memerlukan project Firebase atau Emulator Suite dan belum dilakukan di lingkungan ini.

Sebelum presentasi lakukan uji manual:

1. Demo user → tambah laporan → cari → detail → edit → batal hapus → hapus.
2. Pastikan user tidak dapat mengubah laporan demo milik orang lain; demo admin bisa memverifikasi dan mengembalikan.
3. Muat ulang browser: data dan filter tetap tersimpan. Login Firebase tidak boleh bergantung pada akun demo.
4. Uji judul/deskripsi terlalu pendek, tanggal masa depan, email salah, password terlalu pendek, hasil kosong, dan laporan tidak ditemukan.
5. Export CSV lalu buka di spreadsheet. Coba karakter kutip, koma, baris baru dan awalan `=`.
6. Periksa lebar 360, 768, 1280 px; keyboard dan pembaca layar. Putuskan koneksi CDN untuk memeriksa fallback statistik.
7. Di Firebase uji anonim hanya membaca, user A tidak bisa update/delete user B, user tidak bisa mengganti owner atau memverifikasi laporan, admin boleh mengelola, dan collection lain ditolak. Lakukan melalui emulator/rules simulator sebelum produksi.

## Yang perlu disiapkan kelompok

- Persetujuan dosen untuk topik Lost & Found: sudah disetujui (konfirmasi kelompok).
- Firebase Web App config publik dan UID calon admin; kelompok mengelola akses project sendiri.
- Repository GitHub dan pilihan Netlify/GitHub Pages agar deployment dapat diselesaikan.
- Provider lokasi yang diizinkan, endpoint dan atribusinya bila bonus public API akan diaktifkan.
- Nama anggota, logo/warna resmi jika ingin dipakai, lokasi kampus yang sudah diverifikasi, serta kontak resmi petugas bila alur klaim akan dikembangkan.
- Screenshot dari versi akhir dan PowerPoint untuk pengumpulan. Keduanya belum menjadi deliverable dalam versi source awal ini.

Tidak perlu menyediakan referensi desain untuk mulai mencoba UI ini. Semua pengujian demo sebaiknya memakai data fiktif; Local Storage bukan penyimpanan rahasia dan dapat diedit pengguna.
