// Luna nueva de referencia (6 ene 2000, 18:14 UTC) y duración media del mes sinódico.
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);
const SYNODIC_MONTH_MS = 29.530588853 * 86_400_000;

export type MoonState = {
  /** 0 = luna nueva, 0.5 = llena. */
  phase: number;
  /** Fracción del disco iluminada (0–1). */
  illumination: number;
  /** Posición en el viewport (0–1). */
  x: number;
  y: number;
};

export function getMoonState(date = new Date()): MoonState {
  const phase = ((((date.getTime() - NEW_MOON_EPOCH) % SYNODIC_MONTH_MS) + SYNODIC_MONTH_MS) % SYNODIC_MONTH_MS) / SYNODIC_MONTH_MS;
  const illumination = (1 - Math.cos(2 * Math.PI * phase)) / 2;

  // La luna cruza el meridiano ~50 min más tarde cada día: en luna nueva a mediodía, en llena a medianoche.
  // El ángulo horario avanza 15°/h por la rotación de la Tierra; se proyecta en un arco del cielo de la página.
  const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const transit = (12 + phase * 24) % 24;
  const hourAngle = ((((hours - transit) * 15 + 540) % 360) - 180) * (Math.PI / 180);

  return {
    phase,
    illumination,
    x: 0.5 + (hourAngle / Math.PI) * 0.42,
    y: 0.09 + 0.24 * (1 - Math.cos(hourAngle / 2)),
  };
}

/** Dibuja la luna con su fase real (sombreado del terminador y luz cenicienta). */
export function drawMoon(canvas: HTMLCanvasElement, phase: number) {
  const size = canvas.width;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const r = size / 2 - 2;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);

  // Luz cenicienta: la cara oscura sigue siendo reconocible incluso en luna nueva.
  const ashen = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  ashen.addColorStop(0, "rgba(92, 88, 140, 0.85)");
  ashen.addColorStop(1, "rgba(48, 45, 82, 0.85)");
  ctx.fillStyle = ashen;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 181, 253, 0.3)";
  ctx.lineWidth = Math.max(1, size / 96);
  ctx.stroke();

  const lit = document.createElement("canvas");
  lit.width = lit.height = size;
  const lctx = lit.getContext("2d")!;
  lctx.translate(size / 2, size / 2);
  const base = lctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.1, 0, 0, r);
  base.addColorStop(0, "#f7f6ff");
  base.addColorStop(1, "#c8c4ec");
  lctx.fillStyle = base;
  lctx.beginPath();
  lctx.arc(0, 0, r, 0, Math.PI * 2);
  lctx.fill();

  // Mares y cráteres con semilla fija: la luna es siempre la misma.
  let seed = 11;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 46; i++) {
    const angle = random() * Math.PI * 2;
    const distance = Math.sqrt(random()) * r * 0.85;
    const radius = r * (0.04 + random() ** 2 * 0.3);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const crater = lctx.createRadialGradient(x, y, radius * 0.15, x, y, radius);
    crater.addColorStop(0, `rgba(118, 112, 168, ${0.18 + random() * 0.22})`);
    crater.addColorStop(1, "rgba(118, 112, 168, 0)");
    lctx.fillStyle = crater;
    lctx.beginPath();
    lctx.arc(x, y, radius, 0, Math.PI * 2);
    lctx.fill();
  }

  // Zona iluminada: limbo + terminador elíptico. Creciente se ilumina por la derecha; menguante, reflejada.
  const c = Math.cos(2 * Math.PI * phase);
  lctx.globalCompositeOperation = "destination-in";
  lctx.save();
  if (phase > 0.5) lctx.scale(-1, 1);
  lctx.beginPath();
  lctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
  lctx.ellipse(0, 0, r * Math.abs(c), r, 0, Math.PI / 2, -Math.PI / 2, c > 0);
  lctx.closePath();
  lctx.fill();
  lctx.restore();

  ctx.drawImage(lit, -size / 2, -size / 2);
  ctx.restore();
}
