# Pemetaan ketentuan final project

Sumber utama: **webdesign final.docx**, lampiran percakapan Analisis Tugas Web Design. Dokumen asli ditemukan melalui path lampiran lokal; path /mnt/data tidak tersedia pada mesin Windows ini. Dokumen dibaca penuh sebagai teks; salinan biner tidak dimasukkan ke repository.

| Ketentuan | Implementasi / status |
|---|---|
| HTML5, CSS3, Vanilla JS | index.html, styles.css, ES modules; tanpa framework frontend |
| Minimal 4 halaman/tampilan | 8 tampilan utama + panduan, menggunakan hash routing |
| CRUD | store.js dan form/list/detail pada app.js |
| Search/filter | kata kunci, jenis, kategori, status |
| Form validation | HTML constraints + model.js + Firestore Rules |
| Local Storage | data demo, simulasi sesi, filter, cache lokasi |
| Responsive / Grid / Flexbox | breakpoint 600 dan 900 px; perlu QA visual akhir |
| DOM/event/array/object | routing, rendering aman, event form/tombol, filter dan statistik |
| Dashboard | ringkasan user/admin dan Chart.js |
| Notifikasi/konfirmasi | toast aria-live dan dialog hapus |
| Bonus Chart.js | terpasang via CDN, fallback angka |
| Bonus Export CSV | tersedia di dashboard, data sesuai lingkup user/admin |
| Bonus API | adapter Fetch siap; provider publik belum diaktifkan |
| Bonus deployment | konfigurasi/panduan Netlify dan Pages tersedia; belum diterbitkan |
| Firebase Auth/Firestore | adapter tersedia, menunggu project config dan pengujian layanan |
| GitHub source | source lokal siap; repository belum diberikan |
| README dan screenshot | README tersedia, screenshot akhir belum dibuat |
| PowerPoint | wajib menurut dokumen; belum dibuat pada tahap source/UI awal |
| Persetujuan topik | sudah disetujui dosen, sesuai konfirmasi kelompok |

## Pembagian kerja yang disarankan

1. Layout, beranda, dashboard, dan integrasi halaman.
2. CRUD, model data, Firebase, dan pengujian rules.
3. Form, search/filter, aksesibilitas, dan tampilan responsif.
4. Validasi, CSV/API, dokumentasi, deployment, dan presentasi.

Setiap anggota wajib berkontribusi dan mampu menjelaskan kode. AI boleh digunakan sebagai alat bantu menurut dokumen; kelompok tetap bertanggung jawab memahami implementasi.

## Alur demo presentasi

Jelaskan masalah kehilangan barang → cari laporan → login user → tambah/edit laporan → admin verifikasi → tandai dikembalikan setelah pengecekan → lihat dashboard → export CSV → jelaskan Local Storage, DOM/event, arrays/objects, validasi dan keamanan database. Tutup dengan batasan versi dan rencana pengembangan.
