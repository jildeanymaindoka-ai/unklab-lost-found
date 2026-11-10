// Muat HTML statis sekali, lalu isi penandanya tanpa eval atau menjalankan kode HTML.
const names = [
  "components/option",
  "components/report-card",
  "components/report-photo",
  "components/report-icon",
  "components/report-grid",
  "components/empty-results",
  "components/heading",
  "components/login-link",
  "home",
  "components/stat-card",
  "browse",
  "components/status-option",
  "auth",
  "components/demo-accounts",
  "report",
  "detail",
  "components/report-actions",
  "dashboard",
  "components/admin-link",
  "components/report-row",
  "components/admin-actions",
  "components/empty-reports",
  "help",
  "components/home-link",
];
const templates = new Map();
let ready = false;

export function templatesReady() {
  return ready;
}

// URL relatif terhadap modul agar tetap bekerja pada subfolder GitHub Pages.
export async function loadTemplates() {
  const entries = await Promise.all(
    names.map(async (name) => {
      const url = new URL("../pages/" + name + ".html", import.meta.url);
      const response = await fetch(url);
      if (!response.ok) throw Error("Template gagal dimuat: " + name);
      return [name, await response.text()];
    }),
  );
  entries.forEach(([name, html]) => templates.set(name, html));
  ready = true;
}

// Nilai dinamis harus sudah di-escape oleh pemanggil jika berasal dari pengguna.
// Penggantian satu kali menjaga teks berisi penanda tidak diproses ulang.
export function template(name, values = {}) {
  if (!templates.has(name)) throw Error("Template belum tersedia: " + name);
  return templates.get(name).replace(/{{([a-zA-Z]\w*)}}/g, (_, key) => {
    if (!Object.hasOwn(values, key))
      throw Error("Data template belum diisi: " + name + "." + key);
    return String(values[key]);
  });
}
