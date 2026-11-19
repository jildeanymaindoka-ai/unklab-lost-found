// Orbit barang di hero beranda: animasi otomatis + bisa diputar dengan drag (mouse/sentuh).
// Setiap <g data-orbit="rx ry kemiringan kecepatan"> berisi <use> yang diposisikan di sepanjang elips.
const CX = 930,
  CY = 320;

export function startOrbit(svg) {
  if (!svg) return () => {};
  const rings = [...svg.querySelectorAll("[data-orbit]")].map((g) => {
    const [rx, ry, tilt, speed] = g.dataset.orbit.split(" ").map(Number);
    return {
      rx,
      ry,
      phi: (tilt * Math.PI) / 180,
      speed,
      items: [...g.children],
    };
  });
  // Hormati pengaturan "kurangi animasi" di perangkat pengguna.
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let t = 0,
    frame = 0,
    drag = null,
    last = performance.now();

  // Hitung posisi tiap barang; barang di "depan" (sin > 0) dibuat lebih besar dan jelas.
  function place() {
    rings.forEach((r) =>
      r.items.forEach((el, i) => {
        const th = t * r.speed + (i * Math.PI * 2) / r.items.length,
          ex = r.rx * Math.cos(th),
          ey = r.ry * Math.sin(th),
          x = CX + ex * Math.cos(r.phi) - ey * Math.sin(r.phi),
          y = CY + ex * Math.sin(r.phi) + ey * Math.cos(r.phi),
          depth = (1 + Math.sin(th)) / 2;
        el.setAttribute(
          "transform",
          `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.42 + 0.28 * depth).toFixed(3)})`,
        );
        el.style.opacity = (0.45 + 0.55 * depth).toFixed(2);
      }),
    );
  }

  function tick(now) {
    if (!drag && !still) t += (now - last) * 0.00015;
    last = now;
    place();
    frame = requestAnimationFrame(tick);
  }

  // Sudut pointer terhadap pusat orbit, dalam koordinat layar.
  function angle(e) {
    const b = svg.getBoundingClientRect();
    return Math.atan2(
      e.clientY - (b.top + b.height * 0.5),
      e.clientX - (b.left + b.width * (CX / 1280)),
    );
  }
  const down = (e) => {
    svg.setPointerCapture?.(e.pointerId);
    drag = { start: angle(e), base: t };
    svg.classList.add("dragging");
  };
  const move = (e) => {
    if (drag) {
      t = drag.base + (angle(e) - drag.start);
      if (still) place();
    }
  };
  const up = () => {
    drag = null;
    svg.classList.remove("dragging");
  };
  svg.addEventListener("pointerdown", down);
  svg.addEventListener("pointermove", move);
  svg.addEventListener("pointerup", up);
  svg.addEventListener("pointercancel", up);

  place();
  if (!still) frame = requestAnimationFrame(tick);
  // Fungsi penghenti dipanggil saat pindah halaman agar animasi tidak berjalan di latar.
  return () => {
    cancelAnimationFrame(frame);
    svg.removeEventListener("pointerdown", down);
    svg.removeEventListener("pointermove", move);
    svg.removeEventListener("pointerup", up);
    svg.removeEventListener("pointercancel", up);
  };
}
