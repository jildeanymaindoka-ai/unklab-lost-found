// Foto diperkecil dan dikodekan ulang sebagai JPEG agar metadata asli tidak ikut disimpan.
// Ukuran akhir dibatasi supaya dokumen laporan tetap jauh di bawah batas Firestore.
export const MAX_PHOTO_INPUT = 5 * 1024 * 1024;
export const MAX_PHOTO_OUTPUT = 180 * 1024;
export function validatePhoto(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw Error("Pilih foto JPG, PNG, atau WebP.");
  if (!file.size || file.size > MAX_PHOTO_INPUT)
    throw Error("Ukuran foto harus lebih dari 0 dan maksimal 5 MB.");
}
export function safePhoto(value) {
  return typeof value === "string" &&
    value.length <= 260000 &&
    /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
    ? value
    : "";
}
export async function preparePhoto(file) {
  validatePhoto(file);
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode().catch(() => {
      throw Error("Foto tidak dapat dibaca. Pilih file gambar lain.");
    });
    if (
      !image.naturalWidth ||
      image.naturalWidth * image.naturalHeight > 40000000
    )
      throw Error(
        "Resolusi foto terlalu besar. Gunakan foto maksimal 40 megapiksel.",
      );
    const scale = Math.min(
      1,
      900 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw Error("Browser tidak mendukung pemrosesan foto.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.8, 0.65, 0.5, 0.35, 0.2]) {
      const photo = canvas.toDataURL("image/jpeg", quality);
      if (
        photo.startsWith("data:image/jpeg;base64,") &&
        atob(photo.split(",")[1]).length <= MAX_PHOTO_OUTPUT
      )
        return photo;
    }
    throw Error(
      "Foto masih terlalu besar setelah dikompresi. Pilih foto yang lebih sederhana.",
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
