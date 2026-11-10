import { test } from "node:test";
import assert from "node:assert/strict";
import { seed, filterReports, validateReport, csv } from "../js/model.js";
// Pengujian perilaku model berjalan tanpa browser atau koneksi Firebase.
test("search combines query, category and type", () => {
  assert.equal(
    filterReports(seed, {
      q: "perpustakaan",
      type: "lost",
      category: "Elektronik",
    }).length,
    1,
  );
  assert.equal(
    filterReports(seed, { q: "perpustakaan", type: "found" }).length,
    0,
  );
});
// Input yang tidak memenuhi aturan ditolak sebelum penyimpanan.
test("validation rejects short descriptions and future dates", () => {
  assert.throws(() => validateReport({ ...seed[0], description: "abc" }));
  assert.throws(() => validateReport({ ...seed[0], date: "2999-01-01" }));
  assert.doesNotThrow(() => validateReport(seed[0]));
});
// Ekspor harus menjaga bentuk sel dan mencegah input diperlakukan sebagai formula.
test("CSV escapes quotes, line breaks and formula injection", () => {
  const text = csv([
    {
      ...seed[0],
      title: "=SUM(1)",
      description: "unused",
      location: 'A,"B"\nC',
    },
  ]);
  assert.ok(text.includes('"\'=SUM(1)"'));
  assert.ok(text.includes('"A,""B""\nC"'));
});
