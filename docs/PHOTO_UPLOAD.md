# Foto laporan barang

Form tambah/edit laporan menerima satu foto JPG, PNG, atau WebP hingga 5 MB. Browser mengubah foto menjadi JPEG dengan sisi terpanjang maksimal 900 piksel dan ukuran akhir maksimal 180 KiB. Pengkodean ulang melalui canvas tidak menyertakan metadata file asli. PNG transparan diberi latar putih.

Foto disimpan sebagai field opsional `photo` dalam dokumen Firestore `reports`. Laporan lama tanpa field ini tetap dapat dibuka. Edit tanpa memilih foto mempertahankan foto lama; tombol Hapus foto baru berlaku setelah Simpan laporan. Foto ditampilkan di kartu dan pada detail. Mode demo menyimpan foto di Local Storage; kapasitas browser terbatas dan kegagalan penyimpanan ditampilkan sebagai pesan.

## Aktivasi pada Firebase

1. Buka Firestore Database → Rules di Firebase Console.
2. Ganti aturan dengan isi terbaru `firestore.rules`, lalu Publish.
3. Pastikan kode terbaru juga sudah dideploy ke Netlify.
4. Buat laporan dengan foto, muat ulang, lalu periksa kartu/detail. Uji edit tanpa mengganti foto, ganti foto, hapus foto, serta file yang terlalu besar atau bukan gambar.

Tidak perlu membuat Firebase Storage atau mengaktifkan billing untuk implementasi ini. Pemakaian tetap mengikuti kuota/paket Firestore project. Foto menambah ukuran pembacaan setiap dokumen laporan, sehingga pendekatan ini ditujukan untuk project kecil, bukan galeri resolusi tinggi. Firebase Storage adalah opsi pengembangan produksi dan memerlukan paket Blaze menurut dokumentasi Firebase saat implementasi dibuat.

Foto dan laporan dapat dibaca publik. Jangan mengunggah KTP, kartu mahasiswa yang menampilkan data pribadi, atau bukti kepemilikan rahasia. Validasi browser memeriksa format dan decoding; rules membatasi pola serta panjang field foto, bukan memeriksa isi visualnya.

Referensi: https://firebase.google.com/docs/storage/web/start
