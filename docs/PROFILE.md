# Profil pengguna dan nama pelapor

Masuk ke aplikasi lalu pilih **Profil saya** di header atau **Edit profil** pada dashboard. Pengguna dapat menyimpan nama tampilan sepanjang 2–60 karakter. Halaman profil menampilkan email dan peran akun sendiri. Email tidak dimasukkan ke laporan publik dan tidak ada direktori email pengguna.

Nama disimpan pada `displayName` di Firebase Authentication. Mengubah nama tidak mengubah UID, email, password, atau custom claim admin. Ini merupakan nama pilihan pengguna, bukan bukti identitas yang sudah diverifikasi kampus. Mode demo menyimpan profil terpisah per akun demo di Local Storage.

Laporan baru memiliki field opsional `ownerName`, yang diambil otomatis dari Authentication. Jika nama belum diisi, aplikasi memakai “Pengguna UNKLAB”. Halaman detail menampilkan “Dilaporkan oleh”. Laporan lama tanpa nama menggunakan teks cadangan yang sama. Nama pada laporan merupakan snapshot saat laporan dibuat, sehingga perubahan profil tidak mengganti nama pada laporan lama; edit oleh admin juga tidak mengganti identitas pelapor.

## Aktivasi

Publikasikan isi terbaru `firestore.rules` pada Firebase Console sebelum mencoba membuat laporan dengan field `ownerName`. Rules membatasi panjang nama, mencocokkan nama laporan baru dengan token Authentication, serta melarang perubahan nama pelapor pada laporan yang sudah tersimpan. Saat profil disimpan, aplikasi memperbarui token agar nama terbaru dapat diperiksa oleh rules. Tidak ada collection profil baru atau perubahan billing.

## Pengujian manual Firebase

1. Masuk → Profil saya → simpan nama → reload dan pastikan nama tetap tersimpan.
2. Buat laporan → buka detail → periksa nama pelapor dan pastikan email tidak tampil.
3. Ganti nama profil → buat laporan baru → pastikan nama baru tampil, laporan lama tetap memakai nama awal.
4. Masuk sebagai admin dan edit laporan pengguna lain → nama pelapor tidak berubah.
5. Tanpa login, halaman profil meminta masuk. User biasa tidak dapat mengaktifkan hak admin dengan mengganti profil.

Pengujian otomatis mencakup validasi nama, nama cadangan, penyimpanan profil demo, dan perlindungan snapshot nama saat edit. Pengujian Firebase nyata/rules emulator masih perlu dilakukan setelah rules dipublikasikan.
