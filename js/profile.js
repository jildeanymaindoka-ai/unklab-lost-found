// Nama tampilan bersifat publik. Email dan UID tidak dijadikan nama cadangan.
export function validateDisplayName(value) {
  if (typeof value !== "string" || /[\u0000-\u001f\u007f]/.test(value))
    throw Error("Nama tidak valid.");
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 60)
    throw Error("Nama tampilan harus 2–60 karakter.");
  return name;
}
export function reporterName(report) {
  return report.ownerName || "Pengguna UNKLAB";
}
