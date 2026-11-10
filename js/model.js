// Pilihan kategori, lokasi, dan ikon dipakai bersama oleh form, filter, dan kartu.
export const categories = [
  "Elektronik",
  "Kartu & Identitas",
  "Tas & Dompet",
  "Buku & Alat tulis",
  "Aksesori",
  "Lainnya",
];
export const locations = [
  "Perpustakaan",
  "Gedung Administrasi",
  "Kafetaria",
  "Gedung Kuliah",
  "Asrama",
  "Lapangan",
];
export const icons = {
  Elektronik: "⌨",
  "Kartu & Identitas": "▣",
  "Tas & Dompet": "▱",
  "Buku & Alat tulis": "▤",
  Aksesori: "◉",
  Lainnya: "◇",
};
/** Validasi isi laporan sebelum penyimpanan; error ditampilkan oleh antarmuka. */
export function validateReport(r) {
  if (!r.title || r.title.trim().length < 4 || r.title.length > 100)
    throw Error("Nama barang harus 4–100 karakter.");
  if (!["lost", "found"].includes(r.type) || !categories.includes(r.category))
    throw Error("Pilih jenis dan kategori yang valid.");
  if (!r.location?.trim() || r.location.length > 160)
    throw Error("Isi lokasi maksimal 160 karakter.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(r.date) ||
    r.date > new Date().toLocaleDateString("en-CA")
  )
    throw Error("Tanggal tidak boleh di masa depan.");
  if (
    !r.description ||
    r.description.trim().length < 10 ||
    r.description.length > 2000
  )
    throw Error("Deskripsi harus 10–2000 karakter.");
}
// Semua filter aktif harus cocok (AND); filter kosong tidak membatasi hasil.
export function filterReports(
  rows,
  { q = "", type = "", category = "", status = "" } = {},
) {
  return rows.filter(
    (r) =>
      (!q ||
        `${r.title} ${r.location} ${r.description}`
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (!type || r.type === type) &&
      (!category || r.category === category) &&
      (!status || r.status === status),
  );
}
// CSV: lindungi awalan formula spreadsheet, gandakan kutip, lalu bungkus setiap sel.
// BOM UTF-8 membantu aplikasi spreadsheet membaca karakter Indonesia dengan benar.
export function csv(rows) {
  const cell = (v) =>
    '"' +
    String(v ?? "")
      .replace(/^[=+@\-\t\r]/, "'$&")
      .replaceAll('"', '""') +
    '"';
  return (
    "\uFEFF" +
    [
      ["Nama", "Jenis", "Kategori", "Lokasi", "Tanggal", "Status"],
      ...rows.map((r) => [
        r.title,
        r.type,
        r.category,
        r.location,
        r.date,
        r.status,
      ]),
    ]
      .map((r) => r.map(cell).join(","))
      .join("\r\n")
  );
}
// Data fiktif untuk mode demo; tidak diunggah otomatis ke Firestore.
export const seed = [
  [
    "Headphone wireless hitam",
    "lost",
    "Elektronik",
    "Perpustakaan",
    "Tertinggal di meja belajar lantai dua. Ada stiker kecil pada bagian kanan.",
  ],
  [
    "Kartu mahasiswa",
    "found",
    "Kartu & Identitas",
    "Kafetaria",
    "Ditemukan dekat tempat cuci tangan. Sebutkan nama dan NIM untuk verifikasi.",
  ],
  [
    "Totebag warna krem",
    "found",
    "Tas & Dompet",
    "Gedung Kuliah",
    "Tas berisi beberapa buku catatan. Sebutkan isi tas untuk mengambil.",
  ],
  [
    "Buku catatan biru",
    "lost",
    "Buku & Alat tulis",
    "Gedung Administrasi",
    "Sampul biru dengan catatan kuliah. Terakhir terlihat di bangku depan.",
  ],
  [
    "Jam tangan analog",
    "found",
    "Aksesori",
    "Lapangan",
    "Ditemukan setelah kegiatan olahraga. Sebutkan merek dan ciri jam.",
  ],
  [
    "Dompet cokelat",
    "lost",
    "Tas & Dompet",
    "Asrama",
    "Dompet kecil warna cokelat, kemungkinan jatuh di jalan menuju asrama.",
  ],
].map((a, i) => ({
  id: `demo-${i}`,
  title: a[0],
  type: a[1],
  category: a[2],
  location: a[3],
  description: a[4],
  date: "2026-11-01",
  ownerId: i % 2 ? "demo-other" : "demo-user",
  status: i === 4 ? "returned" : "verified",
  createdAt: 1793491200000 + i,
}));
