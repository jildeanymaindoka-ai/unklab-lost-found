# Pencarian lokasi dengan Geoapify

Tombol Cari lokasi pada form laporan memanggil Geoapify Forward Geocoding API menggunakan Fetch. Pencarian dibatasi ke Indonesia dan diberi prioritas titik Universitas Klabat, Airmadidi. Nama gedung kecil/ruangan yang belum tercatat tetap dapat dipilih dari daftar kampus atau diketik manual.

## Konfigurasi dan penggunaan

Key browser dipasang pada `geoapifyKey` di `js/config.js`. Key ini terlihat di browser dan harus dibatasi pada Geoapify MyProjects melalui Allowed HTTP Referers. Pola untuk project ini:

```text
^https://unklablostfound\.netlify\.app(/.*)?$
^http://localhost:4173(/.*)?$
```

Gunakan `http://localhost:4173` saat pengujian lokal, bukan `127.0.0.1` atau port lain kecuali filter yang bersangkutan ditambahkan. CORS saja bukan pembatasan akses key. Jika key diganti, terapkan filter pada key baru sebelum memasangnya. Kosongkan `geoapifyKey` untuk menonaktifkan API dan hanya memakai daftar lokal.

Pengguna mengetik lokasi lalu menekan Cari lokasi. Tombol dinonaktifkan selama request berjalan; hasil diberi label asal data. Memilih hasil mengisi kolom lokasi, tidak menyimpan koordinat atau membuat laporan otomatis. Kata pencarian dikirim ke Geoapify; jangan masukkan data pribadi.

## Cache dan kegagalan

- Maksimal lima hasil, jeda 1,5 detik per browser, timeout 10 detik.
- Cache hasil API disimpan selama satu hari untuk mengurangi request berulang.
- Tidak ada autocomplete atau request per ketikan.
- API 401/403: periksa key dan HTTP Referer. API 429: tunggu hingga batas layanan mengizinkan request kembali.
- Ketika API gagal dan terdapat hasil lokal, aplikasi menampilkan hasil lokal dengan pemberitahuan. Pencarian manual tetap tersedia.
- Pembatasan browser bukan batas agregat seluruh pengguna. Pantau pemakaian pada dashboard Geoapify sesuai paket yang dipilih.

Atribusi Geoapify dan OpenStreetMap ditampilkan dekat hasil pencarian. Uji langsung pada 10 November 2026 menghasilkan HTTP 200 dan lokasi Universitas Klabat. Pengujian otomatis memakai respons tiruan untuk memeriksa normalisasi, parameter, cache, rate limit, respons ditolak, dan fallback.

Referensi resmi: [Geocoding API](https://apidocs.geoapify.com/docs/geocoding/), [API keys](https://myprojects.geoapify.com/help/api-keys/), [Pricing dan atribusi](https://www.geoapify.com/pricing/).
