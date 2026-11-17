import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDisplayName, reporterName } from "../js/profile.js";

test("nama tampilan divalidasi dan spasi dinormalisasi", () => {
  assert.equal(
    validateDisplayName("  Jildeany   Maindoka "),
    "Jildeany Maindoka",
  );
  for (const value of ["", "x", "a".repeat(61), "Nama\nBaru", null])
    assert.throws(() => validateDisplayName(value));
});
test("laporan lama tidak membocorkan email/UID sebagai nama cadangan", () => {
  assert.equal(
    reporterName({ ownerId: "uid123", email: "private@example.com" }),
    "Pengguna UNKLAB",
  );
  assert.equal(reporterName({ ownerName: "Pelapor" }), "Pelapor");
});
test("profil demo bertahan setelah login ulang dan nama laporan tetap milik pembuat", async () => {
  const { config } = await import("../js/config.js");
  const { seed } = await import("../js/model.js");
  const oldMode = config.mode,
    oldStorage = globalThis.localStorage;
  const values = new Map();
  try {
    config.mode = "demo";
    globalThis.localStorage = {
      getItem: (k) => values.get(k) ?? null,
      setItem: (k, v) => values.set(k, v),
      removeItem: (k) => values.delete(k),
    };
    const { store } = await import("../js/store.js?profile-tests");
    await store.init(() => {});
    await assert.rejects(store.saveProfile("Pengguna"), /masuk/);
    store.demoLogin();
    await store.saveProfile("Pelapor Pertama");
    assert.equal(store.user.admin, false);
    const { title, type, category, location, date, description } = seed[0];
    const data = { title, type, category, location, date, description };
    await store.save({ ...data, ownerName: "Nama palsu" });
    const report = (await store.list())[0];
    assert.equal(report.ownerName, "Pelapor Pertama");
    await store.saveProfile("Nama Baru");
    await store.logout();
    store.demoLogin();
    assert.equal(store.user.displayName, "Nama Baru");
    await store.save(data, report.id);
    assert.equal((await store.list())[0].ownerName, "Pelapor Pertama");
    await store.logout();
    store.demoLogin(true);
    await store.saveProfile("Pengelola");
    await store.save(data, report.id);
    assert.equal((await store.list())[0].ownerName, "Pelapor Pertama");
    assert.equal(store.user.admin, true);
  } finally {
    config.mode = oldMode;
    globalThis.localStorage = oldStorage;
  }
});
