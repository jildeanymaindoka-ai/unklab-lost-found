// SDK modular dimuat dari CDN sehingga aplikasi tetap tanpa framework atau bundler.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getIdTokenResult,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { config } from "./config.js";
let auth, db;
// Custom claim admin berasal dari token Firebase, bukan nilai Local Storage.
export async function init(callback) {
  if (Object.values(config.firebase).some((v) => !v))
    throw Error("Lengkapi konfigurasi Firebase di js/config.js.");
  const app = initializeApp(config.firebase);
  auth = getAuth(app);
  db = getFirestore(app);
  onAuthStateChanged(auth, async (u) => {
    if (!u) return callback(null);
    const token = await getIdTokenResult(u);
    callback({
      uid: u.uid,
      email: u.email,
      admin: token.claims.admin === true,
    });
  });
}
// Pilih operasi Authentication sesuai form login atau registrasi.
export async function login(email, password, register) {
  return (
    register ? createUserWithEmailAndPassword : signInWithEmailAndPassword
  )(auth, email, password);
}
export const logout = () => signOut(auth);
// Baca collection reports dan urutkan dari laporan terbaru di sisi browser.
export async function list() {
  const s = await getDocs(collection(db, "reports"));
  return s.docs
    .map((d) => ({ ...d.data(), id: d.id }))
    .sort((a, b) => b.createdAt - a.createdAt);
}
// Firestore membuat ID untuk laporan baru; update mempertahankan owner dan createdAt.
// Laporan baru/perubahan harus diverifikasi lagi. Semua penulisan diperiksa Security Rules.
export async function save(data, id) {
  const ref = id ? doc(db, "reports", id) : doc(collection(db, "reports"));
  if (id) return updateDoc(ref, { ...data, status: "pending" });
  return setDoc(ref, {
    ...data,
    ownerId: auth.currentUser.uid,
    createdAt: Date.now(),
    status: "pending",
  });
}
// Hapus laporan atau ubah status sesuai izin yang berlaku di database.
export const remove = (id) => deleteDoc(doc(db, "reports", id));
export const status = (id, status) =>
  updateDoc(doc(db, "reports", id), { status });
