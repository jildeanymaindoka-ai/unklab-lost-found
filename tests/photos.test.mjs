import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validatePhoto,
  safePhoto,
  preparePhoto,
  MAX_PHOTO_INPUT,
} from "../js/photos.js";

test("foto menolak file kosong, format aktif, dan ukuran berlebih", () => {
  for (const file of [
    { type: "image/svg+xml", size: 50 },
    { type: "image/jpeg", size: 0 },
    { type: "image/png", size: MAX_PHOTO_INPUT + 1 },
  ])
    assert.throws(() => validatePhoto(file));
  for (const type of ["image/jpeg", "image/png", "image/webp"])
    assert.doesNotThrow(() => validatePhoto({ type, size: 100 }));
});
test("tampilan hanya menerima JPEG data URL dengan ukuran terbatas", () => {
  assert.equal(safePhoto("javascript:alert(1)"), "");
  assert.equal(safePhoto("https://example.com/a.jpg"), "");
  assert.equal(safePhoto("data:image/svg+xml;base64,AAAA"), "");
  assert.equal(safePhoto("data:image/jpeg;base64," + "A".repeat(260000)), "");
  assert.equal(
    safePhoto("data:image/jpeg;base64,aGVsbG8="),
    "data:image/jpeg;base64,aGVsbG8=",
  );
});
test("kompresi membersihkan URL sementara ketika decoding gagal", async () => {
  const originalImage = globalThis.Image,
    create = URL.createObjectURL,
    revoke = URL.revokeObjectURL;
  let revoked;
  try {
    URL.createObjectURL = () => "blob:test";
    URL.revokeObjectURL = (url) => {
      revoked = url;
    };
    globalThis.Image = class {
      decode() {
        return Promise.reject(Error("invalid"));
      }
    };
    await assert.rejects(
      preparePhoto({ type: "image/jpeg", size: 10 }),
      /tidak dapat dibaca/,
    );
    assert.equal(revoked, "blob:test");
  } finally {
    globalThis.Image = originalImage;
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
  }
});

test("kompresi menghasilkan JPEG kecil dan membatasi dimensi", async () => {
  const originalImage = globalThis.Image,
    originalDocument = globalThis.document;
  const create = URL.createObjectURL,
    revoke = URL.revokeObjectURL;
  let canvas;
  try {
    URL.createObjectURL = () => "blob:test";
    URL.revokeObjectURL = () => {};
    globalThis.Image = class {
      naturalWidth = 1800;
      naturalHeight = 1200;
      async decode() {}
    };
    globalThis.document = {
      createElement: () =>
        (canvas = {
          getContext: () => ({ fillRect() {}, drawImage() {} }),
          toDataURL: () => "data:image/jpeg;base64,aGVsbG8=",
        }),
    };
    const photo = await preparePhoto({ type: "image/png", size: 100 });
    assert.equal(safePhoto(photo), photo);
    assert.equal(canvas.width, 900);
    assert.equal(canvas.height, 600);
  } finally {
    globalThis.Image = originalImage;
    globalThis.document = originalDocument;
    URL.createObjectURL = create;
    URL.revokeObjectURL = revoke;
  }
});

test("laporan menyimpan, mempertahankan, dan menghapus foto; kegagalan kuota tidak mengubah data", async () => {
  const { config } = await import("../js/config.js");
  const { seed } = await import("../js/model.js");
  const oldMode = config.mode,
    oldStorage = globalThis.localStorage;
  const memory = new Map();
  let full = false;
  try {
    config.mode = "demo";
    globalThis.localStorage = {
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => {
        if (full) throw Error("quota");
        memory.set(k, v);
      },
      removeItem: (k) => memory.delete(k),
    };
    const { store } = await import("../js/store.js?photo-tests");
    await store.init(() => {});
    store.demoLogin();
    const { title, type, category, location, date, description } = seed[0];
    const data = { title, type, category, location, date, description };
    const photo = "data:image/jpeg;base64,aGVsbG8=";
    await store.save(data, undefined, photo);
    const report = (await store.list())[0];
    assert.equal(report.photo, photo);
    await store.save({ ...data, title: "Judul diperbarui" }, report.id);
    assert.equal((await store.list())[0].photo, photo);
    full = true;
    await assert.rejects(store.save(data, report.id, ""), /penuh/);
    assert.equal((await store.list())[0].photo, photo);
    full = false;
    await store.save(data, report.id, "");
    assert.equal((await store.list())[0].photo, "");
  } finally {
    config.mode = oldMode;
    globalThis.localStorage = oldStorage;
  }
});
