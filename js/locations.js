import { config } from "./config.js";
import { locations } from "./model.js";
const CACHE_TTL = 24 * 60 * 60 * 1000;
let busy = false,
  last = 0;

// Normalisasi respons agar form tidak bergantung pada format mentah provider.
export function normalizePlaces(data) {
  if (!Array.isArray(data?.results)) throw Error("Respons lokasi tidak valid.");
  return data.results
    .filter(
      (p) =>
        typeof p.formatted === "string" &&
        p.formatted.trim() &&
        Number.isFinite(p.lat) &&
        Number.isFinite(p.lon),
    )
    .slice(0, 5)
    .map((p) => ({
      display_name: p.formatted.slice(0, 160),
      lat: p.lat,
      lon: p.lon,
      source: "Geoapify",
    }));
}
function cachedPlaces(key) {
  try {
    const entry = JSON.parse(localStorage.getItem(key));
    if (
      entry &&
      Date.now() - entry.time < CACHE_TTL &&
      entry.time <= Date.now() &&
      Array.isArray(entry.places) &&
      entry.places.every(
        (p) =>
          typeof p.display_name === "string" &&
          Number.isFinite(p.lat) &&
          Number.isFinite(p.lon),
      )
    )
      return entry.places;
  } catch {
    /* Cache rusak atau diblokir tidak menghalangi pencarian. */
  }
  return null;
}
function combine(local, remote) {
  const seen = new Set();
  return [...local, ...remote]
    .filter((p) => {
      const name = p.display_name.toLowerCase();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    })
    .slice(0, 5);
}
export async function searchLocations(query) {
  const text = query.trim().replace(/\s+/g, " ");
  if (text.length < 3 || text.length > 160)
    throw Error("Masukkan lokasi sepanjang 3–160 karakter.");
  const local = locations
    .filter((x) => x.toLowerCase().includes(text.toLowerCase()))
    .map((display_name) => ({ display_name, source: "Daftar kampus" }));
  if (!config.geoapifyKey) return local;
  const key = "unklab-geoapify-v1:" + text.toLowerCase(),
    cached = cachedPlaces(key);
  if (cached) return combine(local, cached);
  if (busy || Date.now() - last < 1500)
    throw Error("Tunggu sebentar sebelum mencari lagi.");
  busy = true;
  last = Date.now();
  try {
    const url = new URL("https://api.geoapify.com/v1/geocode/search");
    // Fokus teks pada lingkungan UNKLAB; gedung/ruangan kecil tetap memakai daftar lokal.
    url.searchParams.set(
      "text",
      /klabat|unklab|airmadidi/i.test(text)
        ? text
        : text + ", Airmadidi, Sulawesi Utara",
    );
    url.searchParams.set("filter", "countrycode:id");
    // Titik kampus berasal dari hasil geocoding Universitas Klabat yang diverifikasi.
    url.searchParams.set("bias", "proximity:124.9839422,1.4175189");
    url.searchParams.set("format", "json");
    url.searchParams.set("lang", "id");
    url.searchParams.set("limit", "5");
    url.searchParams.set("apiKey", config.geoapifyKey);
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if ([401, 403].includes(response.status))
      throw Error(
        "Akses Geoapify ditolak. Periksa API key dan filter Referer website.",
      );
    if (response.status === 429)
      throw Error("Batas permintaan lokasi tercapai. Coba lagi nanti.");
    if (!response.ok) throw Error("Layanan lokasi sedang tidak tersedia.");
    const places = normalizePlaces(await response.json());
    try {
      localStorage.setItem(key, JSON.stringify({ time: Date.now(), places }));
    } catch {
      /* Cache penuh tidak menggagalkan hasil. */
    }
    return combine(local, places);
  } catch (error) {
    if (local.length) {
      local.notice =
        "Layanan peta belum dapat diakses. Menampilkan daftar kampus lokal.";
      return local;
    }
    if (["TimeoutError", "AbortError"].includes(error.name))
      throw Error("Pencarian lokasi terlalu lama. Coba lagi.");
    throw Error(
      error.message === "Failed to fetch"
        ? "Tidak dapat menghubungi layanan lokasi. Periksa koneksi internet."
        : error.message,
    );
  } finally {
    busy = false;
  }
}
