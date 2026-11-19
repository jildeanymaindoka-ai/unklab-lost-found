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
  "Parkiran motor",
  "Lab Komputer",
];
// Ikon kategori berupa SVG statis buatan sendiri (bukan input pengguna), aman disisipkan.
const svg = (body) =>
  `<svg viewBox="-60 -60 120 120" width="88" height="88" aria-hidden="true" fill="currentColor" stroke="var(--paper)" stroke-width="3" paint-order="stroke">${body}</svg>`;
export const icons = {
  // HP
  Elektronik: svg(
    '<rect x="-27" y="-52" width="54" height="104" rx="11"/><rect x="-21" y="-42" width="42" height="82" rx="4" fill="var(--paper)" stroke="none"/><text x="0" y="-12" text-anchor="middle" font-size="15" font-weight="700" font-family="Inter, sans-serif" stroke="none">12:30</text><rect x="-16" y="8" width="32" height="12" rx="3" opacity=".25" stroke="none"/><rect x="-8" y="33" width="16" height="2.5" rx="1.25" stroke="none"/>',
  ),
  // ID card dengan lanyard
  "Kartu & Identitas": svg(
    '<path d="M-16,-60 L-5,-30 M16,-60 L5,-30" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none"/><rect x="-9" y="-34" width="18" height="11" rx="3"/><rect x="-31" y="-24" width="62" height="80" rx="7"/><rect x="-15" y="-12" width="30" height="32" rx="3" fill="var(--paper)" stroke="none"/><circle cx="0" cy="0" r="6.5" stroke="none"/><path d="M-11,20 Q0,5 11,20 Z" stroke="none"/><rect x="-20" y="28" width="40" height="5" rx="2.5" fill="var(--paper)" stroke="none"/><rect x="-14" y="38" width="28" height="4" rx="2" fill="var(--paper)" opacity=".7" stroke="none"/>',
  ),
  // Dompet
  "Tas & Dompet": svg(
    '<rect x="-46" y="-30" width="92" height="62" rx="8"/><path d="M-46,-17 H46" stroke="var(--paper)" stroke-width="2" stroke-dasharray="3 4"/><path d="M14,-10 H50 V14 H14 Q6,14 6,2 Q6,-10 14,-10 Z"/><circle cx="18" cy="2" r="4" fill="var(--paper)" stroke="none"/>',
  ),
  // Buku catatan
  "Buku & Alat tulis": svg(
    '<rect x="-34" y="-46" width="68" height="92" rx="6"/><rect x="-24" y="-46" width="5" height="92" fill="var(--paper)" opacity=".6" stroke="none"/><rect x="-10" y="-28" width="34" height="14" rx="2" fill="var(--paper)" stroke="none"/><path d="M-4,4 H24 M-4,14 H18" stroke="var(--paper)" stroke-width="3" stroke-linecap="round"/>',
  ),
  // Earphone kabel
  Aksesori: svg(
    '<path d="M-24,-20 C-24,0 -6,6 0,22 M24,-24 C24,0 6,6 0,22 M0,22 C0,40 -20,44 -20,54" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none"/><rect x="-30" y="-36" width="12" height="20" rx="5"/><circle cx="-24" cy="-40" r="12"/><circle cx="-24" cy="-40" r="4.5" fill="var(--paper)" stroke="none"/><rect x="18" y="-40" width="12" height="20" rx="5"/><circle cx="24" cy="-44" r="12"/><circle cx="24" cy="-44" r="4.5" fill="var(--paper)" stroke="none"/>',
  ),
  // Kunci motor
  Lainnya: svg(
    '<g transform="rotate(-20) scale(.58) translate(-30 0)"><circle cx="-58" cy="0" r="16" fill="none" stroke="currentColor" stroke-width="6"/><path d="M-46,-20 C-46,-28 -38,-32 -30,-32 H2 C12,-32 16,-24 18,-16 L22,-6 V6 L18,16 C16,24 12,32 2,32 H-30 C-38,32 -46,28 -46,20 Z"/><rect x="22" y="-9" width="9" height="18" rx="2"/><path d="M31,-7 H112 L124,0 L112,7 H31 Z"/><circle cx="-34" cy="0" r="5.5" fill="var(--paper)" stroke="none"/><path d="M-18,-16 V16 M-10,-18 V18 M-2,-16 V16" stroke="var(--paper)" stroke-width="2.4" stroke-linecap="round"/><path d="M36,0 C44,-5 52,5 60,0 S76,-5 84,0 S100,5 110,0" stroke="var(--paper)" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>',
  ),
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
