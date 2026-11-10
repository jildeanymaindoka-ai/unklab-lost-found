// Konfigurasi web Firebase bersifat publik. Jangan masukkan service-account/private key.
export const config = {
  mode: "firebase", // Gunakan 'demo' untuk mencoba data lokal tanpa layanan Firebase.
  firebase: {
    apiKey: "AIzaSyC9NjEGNultwqCz9P9TMLRqrUxxaSAMo4A",
    authDomain: "unklab-lost-found.firebaseapp.com",
    projectId: "unklab-lost-found",
    storageBucket: "unklab-lost-found.firebasestorage.app",
    messagingSenderId: "627215797099",
    appId: "1:627215797099:web:b70b4a95a5dd143bdbda2e",
  },
  // Key browser publik: akses dibatasi melalui HTTP Referer di Geoapify.
  geoapifyKey: "f8f753579e31402086702a08396b45a7",
  // Endpoint lama tidak dipakai oleh integrasi Geoapify.
  // Nominatim publik tidak diaktifkan otomatis; lihat README tentang kebijakan penggunaan.
  locationEndpoint: "",
};
