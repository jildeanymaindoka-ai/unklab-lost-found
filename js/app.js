// Antarmuka dibuat melalui DOM, sedangkan navigasi memakai hash pada URL.
// Semua operasi data melalui store agar demo dan Firebase memakai alur yang sama.
import { template, loadTemplates, templatesReady } from "./templates.js";
import { store } from "./store.js";
import { categories, locations, icons, filterReports, csv } from "./model.js";
import { searchLocations } from "./locations.js";
import { preparePhoto, safePhoto } from "./photos.js";
// Ubah karakter khusus pada data pengguna sebelum dimasukkan ke HTML untuk mencegah injeksi markup.
const main = document.querySelector("main"),
  esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
// Data laporan dan instance grafik yang sedang ditampilkan.
let rows = [],
  chart;
const labels = {
  lost: "Hilang",
  found: "Ditemukan",
  pending: "Menunggu verifikasi",
  verified: "Terverifikasi",
  returned: "Dikembalikan",
};
const opts = (a) =>
  a.map((x) => template("components/option", { label: esc(x) })).join("");

// Notifikasi singkat; role status pada HTML membantu pembaca layar membacanya.
function toast(s) {
  document.querySelector("#toast").textContent = s;
  setTimeout(() => (document.querySelector("#toast").textContent = ""), 5000);
}

// Satu komponen kartu dipakai kembali pada beranda, pencarian, dan detail.
function card(r) {
  return template("components/report-card", {
    photoContent: safePhoto(r.photo)
      ? template("components/report-photo", {
          photo: r.photo,
          title: esc(r.title),
        })
      : template("components/report-icon", {
          icon: icons[r.category] || "◇",
          category: esc(r.category),
        }),
    type: r.type,
    icon: icons[r.category] || "◇",
    category: esc(r.category),
    badgeType: r.type,
    typeLabel: labels[r.type],
    statusLabel: labels[r.status],
    reportId: encodeURIComponent(r.id),
    title: esc(r.title),
    location: esc(r.location),
    date: esc(r.date),
  });
}

// Array laporan diubah menjadi kumpulan kartu, atau pesan jika hasil kosong.
function grid(rs) {
  return rs.length
    ? template("components/report-grid", { cards: rs.map(card).join("") })
    : template("components/empty-results");
}

// Judul halaman menggunakan struktur yang konsisten di semua tampilan.
function heading(k, t, p = "") {
  return template("components/heading", {
    eyebrow: k,
    title: t,
    description: p,
  });
}

// Pengunjung yang belum masuk diarahkan ke halaman login.
function authRequired() {
  main.innerHTML =
    heading(
      "AKUN",
      "Masuk untuk melanjutkan",
      "Kelola laporan dan bantu barang kembali ke pemiliknya.",
    ) + template("components/login-link");
}

// Pusat navigasi: baca route, ambil data terbaru, lalu pasang event pada DOM baru.
async function render() {
  // Hapus grafik lama sebelum mengganti halaman. URL tanpa hash membuka beranda.
  chart?.destroy();
  const [page, id] = (location.hash.slice(1) || "home").split("/");
  try {
    rows = await store.list();
  } catch (e) {
    main.innerHTML = heading(
      "KONEKSI",
      "Data belum dapat dimuat",
      esc(e.message),
    );
    return;
  }
  document.querySelector("#account").textContent = store.user
    ? "Keluar"
    : "Masuk";
  document.querySelector("#account").href = store.user ? "#logout" : "#login";
  document.querySelector("#mode").textContent = store.demo
    ? "Mode demo · Data tersimpan di browser ini · Akun demo bukan akun Firebase"
    : "Terhubung ke Firebase";
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.toggle("active", a.hash === `#${page}`));
  if (page === "logout") {
    await store.logout();
    location.hash = "login";
    return;
  }
  // Beranda menampilkan ringkasan seluruh laporan dan enam laporan terbaru.
  if (page === "home") {
    main.innerHTML = template("home", {
      statistics: [
        ["Semua laporan", rows.length],
        ["Barang hilang", rows.filter((r) => r.type === "lost").length],
        ["Barang ditemukan", rows.filter((r) => r.type === "found").length],
        [
          "Kembali ke pemilik",
          rows.filter((r) => r.status === "returned").length,
        ],
      ]
        .map(([t, n]) =>
          template("components/stat-card", { count: n, label: t }),
        )
        .join(""),
      recentReports: grid(rows.slice(0, 6)),
    });
  } else if (page === "browse") {
    // Pencarian menggabungkan kata kunci, jenis, kategori, serta status.
    main.innerHTML =
      heading(
        "TEMUKAN KEMBALI",
        "Cari barang",
        "Telusuri laporan kehilangan dan barang temuan di kampus.",
      ) +
      template("browse", {
        categoryOptions: opts(categories),
        statusOptions: ["pending", "verified", "returned"]
          .map((v) =>
            template("components/status-option", {
              value: v,
              label: labels[v],
            }),
          )
          .join(""),
      });
    // Pulihkan filter dari Local Storage agar pilihan tetap ada setelah reload.
    const f = document.querySelector("#filters");
    try {
      const saved = JSON.parse(localStorage.getItem("unklab-filters") || "{}");
      Object.entries(saved).forEach(([k, v]) => {
        if (f.elements[k]) f.elements[k].value = v;
      });
    } catch {}
    // Event input memperbarui hasil secara lokal tanpa memuat ulang halaman.
    function filter() {
      const v = Object.fromEntries(new FormData(f));
      localStorage.setItem("unklab-filters", JSON.stringify(v));
      const found = filterReports(rows, v);
      document.querySelector("#count").textContent =
        `${found.length} laporan ditemukan`;
      document.querySelector("#results").innerHTML = grid(found);
    }
    f.oninput = filter;
    f.onsubmit = (e) => e.preventDefault();
    filter();
  } else if (page === "login" || page === "register") {
    // Form dipakai bersama untuk login/registrasi; akun demo hanya muncul di mode demo.
    const reg = page === "register";
    main.innerHTML = template("auth", {
      pageHeading: heading(
        "SELAMAT DATANG",
        reg ? "Buat akun" : "Masuk ke komunitas",
        "Bantu barang menemukan jalan pulang.",
      ),
      passwordAutocomplete: reg ? "new-password" : "current-password",
      submitLabel: reg ? "Daftar" : "Masuk",
      alternateRoute: reg ? "login" : "register",
      alternateLabel: reg
        ? "Sudah punya akun? Masuk"
        : "Belum punya akun? Daftar",
      demoAccounts: store.demo ? template("components/demo-accounts") : "",
    });
    document.querySelector("#auth").onsubmit = async (e) => {
      e.preventDefault();
      await act(async () => {
        const d = new FormData(e.target);
        await store.login(d.get("email"), d.get("password"), reg);
        location.hash = "dashboard";
      });
    };
    document.querySelectorAll("[data-demo]").forEach(
      (b) =>
        (b.onclick = () => {
          store.demoLogin(b.dataset.demo === "admin");
          location.hash = "dashboard";
        }),
    );
  } else if (page === "report") {
    // Form yang sama menangani tambah dan edit berdasarkan ID pada URL.
    // Pemeriksaan ini mengatur UI; izin database tetap ditegakkan oleh Firestore Rules.
    if (!store.user) return authRequired();
    const r = rows.find((r) => r.id === id);
    if (id && (!r || (!store.user.admin && r.ownerId !== store.user.uid))) {
      main.innerHTML = heading("AKSES", "Laporan tidak tersedia");
      return;
    }
    main.innerHTML =
      heading(
        "SALING MEMBANTU",
        r ? "Edit laporan" : "Buat laporan",
        "Jangan cantumkan NIM, alamat pribadi, nomor telepon, atau detail rahasia barang.",
      ) +
      template("report", {
        categoryOptions: opts(categories),
        locationOptions: opts(locations),
      });
    const f = document.querySelector("#report-form");
    const photoFile = document.querySelector("#photo-file");
    const preview = document.querySelector("#photo-preview");
    const photoImage = document.querySelector("#photo-image");
    const photoStatus = document.querySelector("#photo-status");
    const submit = f.querySelector('[type="submit"]');
    let photoChange,
      processing = false,
      photoVersion = 0;
    const showPhoto = (photo) => {
      preview.hidden = !photo;
      if (photo) photoImage.src = photo;
      else photoImage.removeAttribute("src");
    };
    showPhoto(safePhoto(r?.photo));
    // Versi mencegah proses foto lama menimpa pilihan terbaru setelah penghapusan.
    photoFile.onchange = async () => {
      const file = photoFile.files[0];
      if (!file) return;
      const version = ++photoVersion;
      processing = true;
      submit.disabled = true;
      photoStatus.textContent = "Memproses foto…";
      try {
        const photo = await preparePhoto(file);
        if (version !== photoVersion) return;
        photoChange = photo;
        showPhoto(photo);
        photoStatus.textContent = "Foto siap disimpan.";
      } catch (error) {
        if (version !== photoVersion) return;
        photoFile.value = "";
        photoStatus.textContent =
          error.message + " Foto sebelumnya tetap dipertahankan.";
      } finally {
        if (version === photoVersion) {
          processing = false;
          submit.disabled = false;
        }
      }
    };
    document.querySelector("#remove-photo").onclick = () => {
      photoVersion++;
      photoChange = "";
      processing = false;
      photoFile.value = "";
      submit.disabled = false;
      showPhoto("");
      photoStatus.textContent = "Foto akan dihapus saat laporan disimpan.";
    };
    f.elements.date.max = new Date().toLocaleDateString("en-CA");
    if (r)
      for (const k of [
        "type",
        "category",
        "title",
        "date",
        "location",
        "description",
      ])
        f.elements[k].value = r[k];
    // FormData menjadi objek laporan, lalu store memvalidasi dan menyimpannya.
    f.onsubmit = (e) => {
      e.preventDefault();
      if (processing || submit.disabled) return;
      submit.disabled = true;
      photoFile.disabled = true;
      document.querySelector("#remove-photo").disabled = true;
      submit.textContent = "Menyimpan…";
      act(async () => {
        try {
          await store.save(
            Object.fromEntries(new FormData(f)),
            id,
            photoChange,
          );
          toast("Laporan berhasil disimpan.");
          location.hash = "dashboard";
        } finally {
          submit.disabled = false;
          submit.textContent = "Simpan laporan";
          photoFile.disabled = false;
          document.querySelector("#remove-photo").disabled = false;
        }
      });
    };
    // Pencarian lokasi hanya berjalan saat tombol ditekan, bukan saat pengguna mengetik.
    document.querySelector("#find-location").onclick = () =>
      act(async () => {
        const searchButton = document.querySelector("#find-location");
        searchButton.disabled = true;
        document.querySelector("#location-info").textContent =
          "Mencari lokasi…";
        try {
          const places = await searchLocations(f.elements.location.value);
          const target = document.querySelector("#places");
          target.replaceChildren();
          document.querySelector("#location-info").textContent =
            places.notice ||
            (places.length
              ? `${places.length} lokasi ditemukan`
              : "Lokasi tidak ditemukan. Anda bisa mengisi manual.");
          places.slice(0, 5).forEach((p) => {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "secondary";
            b.textContent = `${p.display_name} · ${p.source || "Lokasi"}`;
            b.onclick = () => {
              f.elements.location.value = p.display_name.slice(0, 160);
              target.replaceChildren();
            };
            target.append(b);
          });
        } catch (error) {
          document.querySelector("#places").replaceChildren();
          document.querySelector("#location-info").textContent = error.message;
          throw error;
        } finally {
          searchButton.disabled = false;
        }
      });
  } else if (page === "detail") {
    // Detail menampilkan informasi publik dan aksi pemilik/admin.
    const r = rows.find((r) => r.id === id);
    if (!r) {
      main.innerHTML = heading("404", "Laporan tidak ditemukan");
      return;
    }
    main.innerHTML = template("detail", {
      content: card(r),
      content2: heading(labels[r.type], esc(r.title)),
      description: esc(r.description),
      location: esc(r.location),
      date: esc(r.date),
      content3: labels[r.status],
      content4:
        store.user && (store.user.admin || r.ownerId === store.user.uid)
          ? template("components/report-actions", { id: r.id, id2: r.id })
          : "",
    });
  } else if (page === "dashboard" || page === "admin") {
    // Dashboard user membatasi data ke pemilik; halaman admin mengelola semua laporan.
    if (!store.user) return authRequired();
    if (page === "admin" && !store.user.admin) {
      main.innerHTML = heading("AKSES", "Halaman khusus admin");
      return;
    }
    const visible =
      page === "admin"
        ? rows
        : rows.filter((r) => r.ownerId === store.user.uid);
    main.innerHTML =
      heading(
        page === "admin" ? "ADMIN" : "AKUN SAYA",
        page === "admin" ? "Kelola laporan" : "Dashboard",
        "Pantau laporan dan bantu proses pengembalian barang.",
      ) +
      template("dashboard", {
        adminLink: store.user.admin ? template("components/admin-link") : "",
        totalReports: visible.length,
        pendingReports: visible.filter((r) => r.status === "pending").length,
        returnedReports: visible.filter((r) => r.status === "returned").length,
        listTitle: page === "admin" ? "Seluruh laporan" : "Laporan saya",
        reportRows: visible.length
          ? visible
              .map((r) =>
                template("components/report-row", {
                  id: r.id,
                  title: esc(r.title),
                  content: labels[r.status],
                  location: esc(r.location),
                  id2: r.id,
                  id3: r.id,
                  content2:
                    page === "admin"
                      ? template("components/admin-actions", {
                          id: r.id,
                          id2: r.id,
                        })
                      : "",
                }),
              )
              .join("")
          : template("components/empty-reports"),
      });
    // Blob dan URL sementara memungkinkan unduh CSV tanpa mengunggah file ke server.
    document.querySelector("#export").onclick = () => {
      const url = URL.createObjectURL(
        new Blob([csv(visible)], { type: "text/csv;charset=utf-8" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "unklab-laporan.csv";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    // Chart.js bersifat tambahan; ringkasan angka tetap tersedia jika CDN gagal dimuat.
    if (window.Chart)
      chart = new Chart(document.querySelector("#chart"), {
        type: "doughnut",
        data: {
          labels: ["Menunggu", "Terverifikasi", "Dikembalikan"],
          datasets: [
            {
              data: ["pending", "verified", "returned"].map(
                (s) => visible.filter((r) => r.status === s).length,
              ),
              backgroundColor: ["#f1bf65", "#324d42", "#b6d0be"],
              borderWidth: 0,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });
    else
      document.querySelector(".chart").textContent =
        "Grafik tidak tersedia. Ringkasan angka tetap tersedia di bawah.";
  } else if (page === "help")
    main.innerHTML =
      heading("PANDUAN", "Sedikit peduli, berarti banyak.") + template("help");
  else
    main.innerHTML =
      heading("404", "Halaman tidak ditemukan") +
      template("components/home-link");
  // Pasang ulang handler setelah render karena elemen halaman sebelumnya telah diganti.
  // Penghapusan baru dilakukan jika dialog mengembalikan nilai yes.
  document.querySelectorAll("[data-delete]").forEach(
    (b) =>
      (b.onclick = () => {
        const dialog = document.querySelector("#confirm");
        dialog.showModal();
        dialog.onclose = () => {
          if (dialog.returnValue === "yes")
            act(async () => {
              await store.remove(b.dataset.delete);
              toast("Laporan dihapus.");
              await render();
            });
        };
      }),
  );
  document.querySelectorAll("[data-status]").forEach(
    (b) =>
      (b.onclick = () =>
        act(async () => {
          await store.status(b.dataset.id, b.dataset.status);
          toast("Status diperbarui.");
          await render();
        })),
  );
}

// Bungkus operasi async agar kegagalan ditampilkan sebagai notifikasi.
async function act(fn) {
  try {
    await fn();
  } catch (e) {
    toast(e.message || "Terjadi kesalahan. Coba lagi.");
  }
}

// Hash routing mendukung hosting statis dan tombol Back/Forward browser.
window.addEventListener("hashchange", () => {
  if (!templatesReady()) return;
  render();
  window.scrollTo(0, 0);
});

// Perubahan sesi login memicu render ulang menggunakan pengguna terbaru.
loadTemplates()
  .then(() => store.init(render))
  .catch((e) => {
    // Gunakan teks biasa jika template belum berhasil dimuat.
    main.textContent = "Aplikasi belum siap: " + e.message;
  });
