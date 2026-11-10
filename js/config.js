// Konfigurasi web Firebase bersifat publik. Jangan masukkan service-account/private key.
export const config = {
  mode: 'firebase', // Gunakan 'demo' untuk mencoba data lokal tanpa layanan Firebase.
  firebase: {
    apiKey: 'AIzaSyC9NjEGNultwqCz9P9TMLRqrUxxaSAMo4A',
    authDomain: 'unklab-lost-found.firebaseapp.com',
    projectId: 'unklab-lost-found',
    storageBucket: 'unklab-lost-found.firebasestorage.app',
    messagingSenderId: '627215797099',
    appId: '1:627215797099:web:b70b4a95a5dd143bdbda2e'
  },
  // Endpoint milik sendiri/provider pilihan yang mengembalikan array {display_name,lat,lon}.
  // Nominatim publik tidak diaktifkan otomatis; lihat README tentang kebijakan penggunaan.
  locationEndpoint: ''
};
