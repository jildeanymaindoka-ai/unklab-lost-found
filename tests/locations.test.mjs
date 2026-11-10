import { test } from "node:test";
import assert from "node:assert/strict";
import { config } from "../js/config.js";
import { normalizePlaces } from "../js/locations.js";

test("normalisasi Geoapify mengabaikan hasil tanpa nama atau koordinat", () => {
  assert.throws(() => normalizePlaces([]), /tidak valid/);
  assert.deepEqual(
    normalizePlaces({
      results: [
        { formatted: "Gedung Kuliah 1", lat: 1.4, lon: 124.9 },
        { formatted: "rusak" },
        { formatted: "", lat: 1, lon: 2 },
      ],
    }),
    [
      {
        display_name: "Gedung Kuliah 1",
        lat: 1.4,
        lon: 124.9,
        source: "Geoapify",
      },
    ],
  );
});
test("pencarian memakai API, cache dan fallback tanpa membuka key", async (t) => {
  const originalFetch = globalThis.fetch,
    originalStorage = globalThis.localStorage,
    originalKey = config.geoapifyKey;
  const memory = new Map();
  let calls = 0;
  try {
    config.geoapifyKey = "test-key";
    globalThis.localStorage = {
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => memory.set(k, v),
    };
    await t.test(
      "parameter benar dan pencarian identik memakai cache",
      async () => {
        const { searchLocations } = await import("../js/locations.js?cache");
        globalThis.fetch = async (url) => {
          calls++;
          assert.equal(url.searchParams.get("filter"), "countrycode:id");
          assert.equal(url.searchParams.get("format"), "json");
          assert.match(url.searchParams.get("text"), /Airmadidi/);
          assert.equal(url.searchParams.get("apiKey"), "test-key");
          return {
            ok: true,
            json: async () => ({
              results: [
                { formatted: "Universitas Klabat", lat: 1.4175, lon: 124.984 },
              ],
            }),
          };
        };
        assert.equal(
          (await searchLocations("Universitas Klabat, Airmadidi"))[0].source,
          "Geoapify",
        );
        assert.equal(
          (await searchLocations("Universitas Klabat, Airmadidi")).length,
          1,
        );
        assert.equal(calls, 1);
        await assert.rejects(searchLocations("ab"), /3–160/);
      },
    );
    await t.test("request beruntun ditahan", async () => {
      const { searchLocations } = await import("../js/locations.js?rate");
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ results: [] }),
      });
      await searchLocations("Tempat pertama");
      await assert.rejects(searchLocations("Tempat kedua"), /Tunggu/);
    });
    await t.test(
      "403 menghasilkan petunjuk pembatasan key dan fallback kampus",
      async () => {
        globalThis.fetch = async () => ({ ok: false, status: 403 });
        const a = await import("../js/locations.js?denied");
        await assert.rejects(
          a.searchLocations("Universitas Klabat"),
          /Referer/,
        );
        const b = await import("../js/locations.js?fallback");
        const result = await b.searchLocations("Perpustakaan");
        assert.equal(result[0].source, "Daftar kampus");
        assert.match(result.notice, /lokal/);
      },
    );
    await t.test(
      "cache rusak dan kuota storage penuh tidak menggagalkan API",
      async () => {
        globalThis.localStorage = {
          getItem: () => "{broken",
          setItem: () => {
            throw Error("quota");
          },
        };
        globalThis.fetch = async () => ({
          ok: true,
          json: async () => ({ results: [] }),
        });
        const { searchLocations } = await import("../js/locations.js?storage");
        assert.deepEqual(await searchLocations("Universitas Klabat"), []);
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.localStorage = originalStorage;
    config.geoapifyKey = originalKey;
  }
});
