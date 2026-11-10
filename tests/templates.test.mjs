import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadTemplates, template, templatesReady } from "../js/templates.js";

// Fetch diganti pembaca file lokal agar tes tidak membutuhkan jaringan atau Firebase.
test("template HTML dimuat dan diisi tanpa menjalankan kode", async (t) => {
  const originalFetch = globalThis.fetch;
  try {
    await t.test(
      "kegagalan HTTP tidak dianggap sebagai template siap",
      async () => {
        globalThis.fetch = async () => ({ ok: false });
        await assert.rejects(loadTemplates(), /Template gagal dimuat/);
        assert.equal(templatesReady(), false);
      },
    );

    await t.test("seluruh file yang didaftarkan tersedia", async () => {
      globalThis.fetch = async (url) => ({
        ok: true,
        text: () => readFile(url, "utf8"),
      });
      await loadTemplates();
      assert.equal(templatesReady(), true);
      assert.match(template("help"), /Bagaimana cara kerjanya/);
    });

    await t.test("nilai hanya diganti sekali termasuk karakter dolar", () => {
      const text = "{{label}} $& <b>contoh</b>";
      assert.ok(template("components/option", { label: text }).includes(text));
    });

    await t.test(
      "nama template dan data yang hilang menghasilkan error jelas",
      () => {
        assert.throws(() => template("tidak-ada"), /Template belum tersedia/);
        assert.throws(() => template("home"), /Data template belum diisi/);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
