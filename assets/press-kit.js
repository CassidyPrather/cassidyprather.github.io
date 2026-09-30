// /style/ only: copy-to-clipboard, the logo stage, and the mixer.
//
// The mixer draws every layer relative to the short edge of the output, so the
// preview and a full-size export are the same picture at two resolutions. Each
// layer draws from its own seeded RNG, so changing one layer never reshuffles
// the others, and the whole recipe fits in the URL hash.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") n.className = v;
      else if (k === "style") n.style.cssText = v;
      else n.setAttribute(k, v === true ? "" : v);
    }
    n.append(...kids);
    return n;
  };

  // ---- copy ---------------------------------------------------------------

  const toast = $("[data-toast]");
  let toastTimer;
  const say = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-on"), 1600);
  };

  const copy = async (text, shown = text) => {
    try {
      await navigator.clipboard.writeText(text);
      say(`⧉ ${shown}`);
    } catch {
      window.prompt("", text);
    }
  };

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-copy]");
    if (!b) return;
    const text = b.dataset.copy;
    copy(text, text.length > 24 ? "</>" : text);
  });

  const rootButton = $("[data-copy-root]");
  if (rootButton) {
    rootButton.hidden = false;
    rootButton.addEventListener("click", () => {
      const lines = $$(".kit-swatch", rootButton.parentElement)
        .filter((s) => $("small", s))
        .map((s) => `  ${$("small", s).textContent}: ${s.dataset.copy};`);
      copy(`:root {\n${lines.join("\n")}\n}`, ":root");
    });
  }

  // ---- logo stage ---------------------------------------------------------

  const stage = $(".kit-stage");
  const hero = $("[data-hero]");
  const heroPng = $("[data-hero-png]");
  const lockups = $$("[data-lockup]");
  lockups.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      hero.src = a.dataset.src;
      hero.alt = a.dataset.alt;
      heroPng.href = a.href;
      lockups.forEach((x) => x.setAttribute("aria-current", String(x === a)));
    }),
  );

  const stagePicker = $("[data-stages]");
  if (stagePicker && stage) {
    stagePicker.hidden = false;
    const dots = $$("[data-stage-pick]", stagePicker);
    dots.forEach((b) =>
      b.addEventListener("click", () => {
        stage.dataset.stage = b.dataset.stagePick;
        dots.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      }),
    );
  }

  // ---- mixer --------------------------------------------------------------

  const mixer = $("[data-mixer]");
  if (!mixer || !HTMLCanvasElement.prototype.toBlob) return;

  const ASSETS = JSON.parse(mixer.dataset.assets || "{}");

  // Five roles per palette: ground, second ground, line, accent, spare. Every
  // colour is from the art (see the swatches above the mixer).
  const PALETTES = [
    ["sky", "#5aa8dc", "#b9a8ff", "#d7fbff", "#ff00e6", "#271452"],
    ["lilac", "#898db8", "#b0aed5", "#ffffff", "#d7dae6", "#a88bbc"],
    ["night", "#0b0c25", "#13153f", "#b9a8ff", "#ffffff", "#645e77"],
    ["somber", "#03010e", "#15086a", "#645e77", "#ffffff", "#6d2c95"],
    ["business", "#f3ecd5", "#3288be", "#5f37be", "#50afc8", "#ffffff"],
    ["d20", "#242949", "#6a3996", "#ff9cf5", "#95fae6", "#7198cf"],
    ["wnn", "#f7f7f7", "#ffffff", "#1a1a1a", "#ff6600", "#0693fa"],
    ["wnn dark", "#000000", "#f7f7f7", "#c0c0c0", "#ff6600", "#0693fa"],
    ["banana", "#fff9b1", "#ffd6f5", "#6d2c95", "#365fc6", "#73f4ff"],
    ["checker", "#000000", "#6d2c95", "#ff00e6", "#ffffff", "#73f4ff"],
  ];

  const SIZES = {
    desk: [3840, 2160, "▭"],
    phone: [1080, 2424, "▯"],
    square: [2048, 2048, "▢"],
    banner: [1500, 500, "▬"],
    tile: [512, 512, "⊞"],
  };

  const GROUNDS = ["flat", "fade", "tilt", "glow", "dusk"];
  const MARKS = ["none", "tri", "tri-l", "tri-r", "tri-d", "charm", "bunny", "d20", "wnn", "word"];
  const PLACES = { center: "◎", high: "↑", low: "↓", corner: "↘" };
  const FRAMES = ["none", "bars", "wnn", "card", "border", "ticks"];

  const TAU = Math.PI * 2;

  const rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Value noise on a lattice that wraps, for anything a tile has to repeat.
  const periodicNoise = (r, gx, gy) => {
    const g = Array.from({ length: gx * gy }, r);
    const at = (i, j) => g[(((j % gy) + gy) % gy) * gx + (((i % gx) + gx) % gx)];
    const ease = (t) => t * t * (3 - 2 * t);
    return (u, v) => {
      const x = u * gx;
      const y = v * gy;
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const sx = ease(x - x0);
      const sy = ease(y - y0);
      const a = at(x0, y0);
      const b = at(x0 + 1, y0);
      const c = at(x0, y0 + 1);
      const d = at(x0 + 1, y0 + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
  };

  const rgba = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };

  const line = (x, x1, y1, x2, y2) => {
    x.moveTo(x1, y1);
    x.lineTo(x2, y2);
  };

  // Copies of a point shifted by one tile in each direction, so anything
  // straddling an edge comes back in on the other side.
  const wrapped = (tile, W, H) => {
    const dx = tile ? [-W, 0, W] : [0];
    const dy = tile ? [-H, 0, H] : [0];
    return (px, py, fn) => dx.forEach((a) => dy.forEach((b) => fn(px + a, py + b)));
  };

  // Each pattern paints at full strength in one colour; the layer's opacity is
  // applied when it is composited. o = { col, u (short edge), r, tile }.
  const PATTERNS = {
    waves(x, W, H, { col, u, r, tile }) {
      const n = 5 + Math.floor(r() * 4);
      x.lineCap = "round";
      for (let i = 0; i < n; i++) {
        const y0 = (H * (i + 0.5)) / n + (tile ? 0 : ((r() - 0.5) * H) / n);
        const k1 = tile ? 1 + Math.floor(r() * 2) : 0.4 + r() * 0.9;
        const k2 = tile ? 2 + Math.floor(r() * 2) : 1 + r() * 1.5;
        const a1 = u * (0.03 + r() * 0.06);
        const a2 = u * (0.005 + r() * 0.02);
        const p1 = r() * TAU;
        const p2 = r() * TAU;
        const lw = u * (0.006 + r() * r() * 0.05);
        const alpha = 0.3 + r() * 0.6;
        for (const dy of tile ? [-H, 0, H] : [0]) {
          x.beginPath();
          for (let s = 0; s <= 160; s++) {
            const t = s / 160;
            const py = y0 + dy + a1 * Math.sin(TAU * k1 * t + p1) + a2 * Math.sin(TAU * k2 * t + p2);
            s ? x.lineTo(t * W, py) : x.moveTo(t * W, py);
          }
          x.strokeStyle = rgba(col, alpha * 0.3);
          x.lineWidth = lw * 2.8;
          x.stroke();
          x.strokeStyle = rgba(col, alpha);
          x.lineWidth = lw;
          x.stroke();
        }
      }
    },

    ripples(x, W, H, { col, u, r, tile }) {
      const n = tile ? 16 : Math.max(8, Math.round(H / (u * 0.028)));
      const gap = H / n;
      const cycles = tile ? 4 : W / (u * 0.09);
      const drift = tile ? (TAU * Math.round(r() * 3)) / n : r() * 0.8;
      x.strokeStyle = col;
      x.lineWidth = gap * 0.28;
      for (let i = -1; i <= n; i++) {
        x.beginPath();
        for (let s = 0; s <= 240; s++) {
          const t = s / 240;
          const py = (i + 0.5) * gap + gap * 0.35 * Math.sin(TAU * cycles * t + i * drift);
          s ? x.lineTo(t * W, py) : x.moveTo(t * W, py);
        }
        x.stroke();
      }
    },

    ascii(x, W, H, { col, u, r, tile }) {
      const ramp = " .-=+*#%@";
      const cols = Math.max(4, Math.round(W / (u / (tile ? 16 : 34))));
      const cw = W / cols;
      const rows = Math.max(4, Math.round(H / (cw * 1.2)));
      const ch = H / rows;
      x.fillStyle = col;
      x.font = `bold ${ch * 0.85}px ui-monospace, Menlo, Consolas, monospace`;
      x.textAlign = "center";
      x.textBaseline = "middle";
      let density;
      if (tile) {
        const nz = periodicNoise(r, 4, 4);
        density = (c, j) => nz(c / cols, j / rows);
      } else {
        // Columns in runs of one to three, each filling in towards a peak and
        // some dripping on past it.
        const runs = [];
        for (let c = 0; c < cols; ) {
          const w = 1 + Math.floor(r() * 3);
          const peak = 0.3 + r() * 0.25;
          const drip = r() < 0.55 ? peak + 0.15 + r() * 0.45 : peak + 0.04;
          for (let k = 0; k < w && c < cols; k++, c++) runs[c] = { peak, drip };
        }
        density = (c, j) => {
          const { peak, drip } = runs[c];
          const y = (j + 0.5) / rows;
          if (y < peak) return 0.85 * Math.pow(y / peak, 1.6);
          if (y < drip) return 0.85 + 0.15 * r();
          return Math.max(0, 0.85 - (y - drip) * 6);
        };
      }
      for (let c = 0; c < cols; c++) {
        for (let j = 0; j < rows; j++) {
          const d = density(c, j);
          const i = Math.min(ramp.length - 1, Math.floor(d * (ramp.length - 1) + r() * 0.9));
          if (!i) continue;
          x.globalAlpha = 0.35 + 0.65 * d;
          x.fillText(ramp[i], (c + 0.5) * cw, (j + 0.5) * ch);
        }
      }
      x.globalAlpha = 1;
    },

    dots(x, W, H, { col, u, r, tile }) {
      const s = u / (tile ? 16 : 55);
      const cols = Math.round(W / s);
      const rows = Math.round(H / s);
      const cs = W / cols;
      const rs = H / rows;
      const rad = Math.min(cs, rs) * 0.16;
      x.fillStyle = col;
      const dot = (c, j) => {
        x.beginPath();
        x.arc((c + 0.5) * cs, (j + 0.5) * rs, rad, 0, TAU);
        x.fill();
      };
      for (let c = 0; c < cols; c++) {
        if (tile) {
          for (let j = 0; j < rows; j++) dot(c, j);
          continue;
        }
        // Dotted streaks, a few per column.
        const segs = 1 + Math.floor(r() * 3);
        for (let k = 0; k < segs; k++) {
          const a = Math.floor(r() * rows);
          const len = Math.floor(r() * r() * rows * 0.8) + 2;
          for (let j = a; j < Math.min(rows, a + len); j++) dot(c, j);
        }
      }
    },

    stripes(x, W, H, { col, u, r, tile }) {
      const n = Math.max(3, Math.round(W / (u * 0.04)));
      x.fillStyle = col;
      for (let i = 0; i < n; i++) {
        const cx = ((i + 0.5 + (r() - 0.5) * 0.5) * W) / n;
        const w = u * (0.003 + r() * r() * 0.02);
        for (const dx of tile ? [-W, 0, W] : [0]) x.fillRect(cx - w / 2 + dx, 0, w, H);
      }
    },

    hatch(x, W, H, { col, u, r, tile }) {
      x.strokeStyle = col;
      x.lineWidth = Math.max(0.6, u / 700);
      x.beginPath();
      if (tile) {
        const n = 32;
        const s = W / n;
        for (let k = 0; k <= 2 * n; k++) line(x, k * s, 0, k * s - H, H);
      } else {
        const run = H / Math.tan((Math.PI / 180) * (55 + r() * 20));
        const s = u / 110;
        for (let x0 = 0; x0 <= W + run; x0 += s) line(x, x0, 0, x0 - run, H);
      }
      x.stroke();
    },

    diamonds(x, W, H, { col, u, r, tile }) {
      const n = tile ? 8 : 16;
      const cw = tile ? W / n : (u / n) * 1.2;
      const ch = tile ? H / n : cw * 0.6;
      const bandH = tile ? H : H * 0.32;
      const top = tile ? 0 : H * (0.45 + r() * 0.25) - bandH / 2;
      const rows = Math.round(bandH / ch);
      const cols = tile ? n : Math.ceil(W / cw);
      const sk = cw * 0.35;
      const g = cw * 0.12;
      x.fillStyle = col;
      for (let j = 0; j < rows; j++) {
        for (let i = -1; i <= cols; i++) {
          if ((((i + j) % 2) + 2) % 2) continue;
          const px = i * cw;
          const py = top + j * ch;
          const a = tile ? 1 : Math.max(0, 1 - (px / W) * 1.6) * Math.sin((Math.PI * (j + 0.5)) / rows);
          if (a <= 0.02) continue;
          x.globalAlpha = a;
          x.beginPath();
          x.moveTo(px + sk + g, py + g);
          x.lineTo(px + cw + sk - g, py + g);
          x.lineTo(px + cw - g, py + ch - g);
          x.lineTo(px + g, py + ch - g);
          x.closePath();
          x.fill();
        }
      }
      x.globalAlpha = 1;
    },

    grid(x, W, H, { col, u, r, tile }) {
      x.strokeStyle = col;
      x.lineWidth = Math.max(0.6, u / 450);
      x.beginPath();
      if (tile) {
        const s = W / 8;
        for (let k = 0; k <= 8; k++) {
          line(x, k * s, 0, k * s, H);
          line(x, 0, k * s, W, k * s);
        }
      } else {
        // A floor, and half the time a ceiling too: the grid-square tunnel.
        const hz = H * (0.4 + r() * 0.25);
        const vx = W * (0.35 + r() * 0.3);
        const edges = r() < 0.5 ? [H, 0] : [H];
        for (const edge of edges) {
          for (let k = 1; k <= 14; k++) {
            const y = hz + (edge - hz) * (k / 14) ** 2;
            line(x, 0, y, W, y);
          }
          for (let k = 0; k <= 28; k++) line(x, vx, hz, vx + (k / 28 - 0.5) * W * 3, edge);
        }
      }
      x.stroke();
    },

    checker(x, W, H, { col, u, tile }) {
      const s = tile ? W / 8 : u / 12;
      x.fillStyle = col;
      for (let j = 0; j * s < H; j++) {
        for (let i = 0; i * s < W; i++) if (!((i + j) % 2)) x.fillRect(i * s, j * s, s, s);
      }
    },

    bands(x, W, H, { col, u, r, tile }) {
      x.save();
      x.fillStyle = col;
      if (tile) {
        // Rotated -45°, so a band of constant Y is a line of constant x + y:
        // repeats every W along both axes.
        x.rotate(-Math.PI / 4);
        const period = W / Math.SQRT2 / (1 + Math.floor(r() * 2));
        const bands = Array.from({ length: 1 + Math.floor(r() * 3) }, () => [r(), 0.08 + r() * 0.3]);
        for (let y = -period; y < 2 * W; y += period) {
          for (const [at, h] of bands) x.fillRect(-W, y + at * period, 2 * W, h * period);
        }
      } else {
        const diag = Math.hypot(W, H);
        x.translate(W / 2, H / 2);
        x.rotate(-Math.PI / 6);
        const n = 5 + Math.floor(r() * 4);
        for (let i = 0; i < n; i++) {
          x.globalAlpha = 0.35 + r() * 0.65;
          x.fillRect(-diag, (r() - 0.5) * diag, 2 * diag, u * (0.04 + r() * 0.22));
        }
      }
      x.restore();
    },

    zigzag(x, W, H, { col, u, r, tile }) {
      const n = tile ? 2 : 5 + Math.floor(r() * 4);
      const top = tile ? H * 0.25 : -u * 0.05;
      const bot = tile ? H * 0.75 : H * (0.2 + r() * 0.15);
      const lw = tile ? W * 0.06 : u * 0.04;
      const step = tile ? W / (2 * n) : (W * 1.1) / (2 * n);
      const x0 = tile ? 0 : -W * 0.05;
      x.lineJoin = tile ? "bevel" : "miter";
      x.miterLimit = 12;
      x.beginPath();
      for (let i = -1; i <= 2 * n + 1; i++) {
        const py = (((i % 2) + 2) % 2) ? bot : top;
        i === -1 ? x.moveTo(x0 + i * step, py) : x.lineTo(x0 + i * step, py);
      }
      x.strokeStyle = col;
      x.lineWidth = lw;
      x.stroke();
      // Hollow it out, like the outlined WNN letters.
      x.globalCompositeOperation = "destination-out";
      x.lineWidth = lw * 0.55;
      x.stroke();
      x.globalCompositeOperation = "source-over";
    },

    rings(x, W, H, { col, u, r, tile }) {
      x.strokeStyle = col;
      const target = (cx, cy, R, steps) => {
        for (let k = 1; k <= steps; k++) {
          x.lineWidth = (R / steps) * (k % 3 ? 0.12 : 0.35);
          x.beginPath();
          x.arc(cx, cy, (R * k) / steps, 0, TAU);
          x.stroke();
        }
      };
      if (tile) {
        const n = 4;
        const s = W / n;
        for (let j = -1; j <= n; j++) {
          for (let i = -1; i <= n; i++) target((i + 0.5 + (j % 2 ? 0.5 : 0)) * s, (j + 0.5) * s, s * 0.45, 3);
        }
      } else {
        const R = Math.hypot(W, H);
        target(W * r(), H * r(), R, Math.round(R / (u * 0.05)));
      }
    },

    stars(x, W, H, { col, u, r, tile }) {
      const each = wrapped(tile, W, H);
      x.fillStyle = col;
      const n = Math.round(((W * H) / (u * u)) * (tile ? 60 : 220));
      for (let i = 0; i < n; i++) {
        const px = r() * W;
        const py = r() * H;
        const rad = u * (0.0008 + r() * r() * 0.004);
        x.globalAlpha = 0.3 + r() * 0.7;
        each(px, py, (a, b) => {
          x.beginPath();
          x.arc(a, b, rad, 0, TAU);
          x.fill();
        });
      }
      x.globalAlpha = 1;
      const m = tile ? 2 : 4 + Math.floor(r() * 5);
      for (let i = 0; i < m; i++) {
        const px = r() * W;
        const py = r() * H;
        const s = u * (0.012 + r() * 0.03);
        each(px, py, (a, b) => {
          x.beginPath();
          x.moveTo(a, b - s);
          x.quadraticCurveTo(a, b, a + s, b);
          x.quadraticCurveTo(a, b, a, b + s);
          x.quadraticCurveTo(a, b, a - s, b);
          x.quadraticCurveTo(a, b, a, b - s);
          x.fill();
        });
      }
    },

    scan(x, W, H, { col, u, tile }) {
      const n = tile ? 64 : Math.round(H / (u / 160));
      const s = H / n;
      x.fillStyle = col;
      for (let i = 0; i < n; i++) x.fillRect(0, i * s, W, s * 0.45);
    },

    dither(x, W, H, { col, u, r, tile }) {
      const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
      const cols = tile ? 128 : Math.round(W / (u / 220));
      const rows = tile ? 128 : Math.round(H / (u / 220));
      const pw = W / cols;
      const ph = H / rows;
      let level;
      if (tile) {
        const nz = periodicNoise(r, 3, 3);
        level = (c, j) => nz(c / cols, j / rows);
      } else {
        const down = r() < 0.5;
        const phase = r() * TAU;
        level = (c, j) => {
          const t = j / rows + 0.08 * Math.sin((c / cols) * TAU * 2 + phase);
          return down ? t : 1 - t;
        };
      }
      x.fillStyle = col;
      for (let j = 0; j < rows; j++) {
        for (let c = 0; c < cols; c++) {
          if (level(c, j) > (bayer[(j % 4) * 4 + (c % 4)] + 0.5) / 16) {
            x.fillRect(Math.floor(c * pw), Math.floor(j * ph), Math.ceil(pw), Math.ceil(ph));
          }
        }
      }
    },
  };

  const PATTERN_NAMES = ["none", ...Object.keys(PATTERNS)];

  const ground = (x, W, H, s, P, r, tile) => {
    const c = P[s.gc];
    const c2 = P[s.gc2];
    const u = Math.min(W, H);
    x.fillStyle = c;
    x.fillRect(0, 0, W, H);
    if (tile) return;
    let gr;
    switch (s.gk) {
      case "fade":
        gr = x.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, c2);
        gr.addColorStop(1, c);
        break;
      case "tilt":
        gr = x.createLinearGradient(W * 0.25, 0, W * 0.75, H);
        gr.addColorStop(0.28, c2);
        gr.addColorStop(0.62, c);
        break;
      case "dusk":
        gr = x.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.35, Math.max(W, H) * 0.8);
        gr.addColorStop(0, c2);
        gr.addColorStop(1, c);
        break;
      case "glow":
        for (let i = 0; i < 5; i++) {
          const cx = r() * W;
          const cy = r() * H;
          const R = u * (0.35 + r() * 0.5);
          const blob = [c2, P[4], P[1]][i % 3];
          const g = x.createRadialGradient(cx, cy, 0, cx, cy, R);
          g.addColorStop(0, rgba(blob, 0.75));
          g.addColorStop(1, rgba(blob, 0));
          x.fillStyle = g;
          x.fillRect(0, 0, W, H);
        }
        return;
      default:
        return;
    }
    x.fillStyle = gr;
    x.fillRect(0, 0, W, H);
  };

  // ---- marks --------------------------------------------------------------

  const images = new Map();
  const loadImage = (src) => {
    if (!images.has(src)) {
      images.set(
        src,
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        }),
      );
    }
    return images.get(src);
  };
  const loaded = new Map();
  const ready = (src) => loaded.get(src);
  const want = async (src) => {
    const img = await loadImage(src);
    loaded.set(src, img);
    return img;
  };

  const TRI = { tri: 0, "tri-l": 1, "tri-r": 2, "tri-d": 3 };

  // The masters are 4096² and only worth decoding for an export; the preview
  // uses the 512² gallery copies. Either way the art ends up as alpha: the
  // masters are white on transparent, the previews white on black.
  const markSources = (s, hi) => {
    if (s.mk in TRI) {
      const t = (ASSETS.tri || [])[TRI[s.mk]] || {};
      return hi ? [t.m, t.p] : [t.p];
    }
    if (s.mk === "charm") return [ASSETS.charm];
    if (s.mk === "bunny") return [ASSETS.bunny];
    return [];
  };

  const markImage = (s, hi) => {
    for (const src of markSources(s, hi)) {
      const img = ready(src);
      if (img) return img;
    }
    return null;
  };

  const ensureMark = async (s, hi) => {
    for (const src of markSources(s, hi)) if (await want(src)) return;
  };

  const tinted = (img, size, col) => {
    const c = document.createElement("canvas");
    c.width = c.height = Math.max(1, Math.round(size));
    const x = c.getContext("2d", { willReadFrequently: true });
    x.drawImage(img, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height);
    const n = parseInt(col.slice(1), 16);
    const px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const lum = Math.max(px[i], px[i + 1], px[i + 2]);
      px[i + 3] = (px[i + 3] * lum) / 255;
      px[i] = (n >> 16) & 255;
      px[i + 1] = (n >> 8) & 255;
      px[i + 2] = n & 255;
    }
    x.putImageData(d, 0, 0);
    return c;
  };

  // The drawn lettering on the WNN pieces is chunky; of the site's two faces
  // Atkinson Bold is the nearer stand-in.
  const LETTERING = "Atkinson-Bold";

  const fitText = (x, text, width, face = LETTERING) => {
    x.font = `100px ${face}, "Trebuchet MS", sans-serif`;
    const size = (100 * width) / x.measureText(text).width;
    x.font = `${size}px ${face}, "Trebuchet MS", sans-serif`;
    return size;
  };

  // The WIRENOOK wordmark as the WNN wallpapers set it: fill over an offset
  // shadow.
  const word = (x, cx, cy, width, fill, shade) => {
    const size = fitText(x, "WIRENOOK", width);
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillStyle = shade;
    x.fillText("WIRENOOK", cx - size * 0.05, cy - size * 0.08);
    x.fillStyle = fill;
    x.fillText("WIRENOOK", cx, cy);
  };

  const d20 = (x, cx, cy, s, col) => {
    const R = s * 0.36;
    const at = (deg, rad) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
    const hex = [-150, -90, -30, 30, 90, 150].map((d) => at(d, R));
    const tri = [-90, 30, 150].map((d) => at(d, R * 0.52));
    x.beginPath();
    hex.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.closePath();
    tri.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.closePath();
    // Each face-on vertex meets three rim vertices.
    [[0, 1, 2], [2, 3, 4], [4, 5, 0]].forEach((rim, i) =>
      rim.forEach((h) => line(x, tri[i][0], tri[i][1], hex[h][0], hex[h][1])),
    );
    x.moveTo(cx + s * 0.47, cy);
    x.arc(cx, cy, s * 0.47, 0, TAU);
    x.lineJoin = "round";
    x.shadowColor = col;
    x.shadowBlur = s * 0.05;
    x.strokeStyle = col;
    x.lineWidth = s * 0.018;
    x.stroke();
    x.shadowBlur = 0;
    x.strokeStyle = "rgba(255, 255, 255, 0.85)";
    x.lineWidth = s * 0.006;
    x.stroke();
  };

  // Three rings, W N N, the middle one in the accent.
  const wnn = (x, cx, cy, s, col, accent) => {
    const R = s / 6;
    x.lineWidth = R * 0.07;
    x.strokeStyle = col;
    x.textAlign = "center";
    x.textBaseline = "middle";
    fitText(x, "W", R * 1.05);
    ["W", "N", "N"].forEach((ch, i) => {
      const px = cx + (i - 1) * R * 1.9;
      x.beginPath();
      x.arc(px, cy, R, 0, TAU);
      x.stroke();
      x.fillStyle = i === 1 ? accent : col;
      x.fillText(ch, px, cy + R * 0.04);
    });
    x.fillStyle = col;
    x.beginPath();
    x.arc(cx + R * 0.95, cy + R * 0.92, R * 0.09, 0, TAU);
    x.fill();
  };

  const drawMark = (x, W, H, s, P, hi) => {
    if (s.mk === "none") return;
    const u = Math.min(W, H);
    const size = u * s.ms;
    const pad = u * 0.06;
    const [cx, cy] = {
      center: [W / 2, H / 2],
      high: [W / 2, H * 0.36],
      low: [W / 2, H * 0.64],
      corner: [W - pad - size / 2, H - pad - size / 2],
    }[s.mp] || [W / 2, H / 2];
    const col = P[s.mc];
    x.save();
    if (s.mg) {
      x.shadowColor = P[4];
      x.shadowBlur = size * 0.06;
    }
    if (s.mk === "d20") d20(x, cx, cy, size, col);
    else if (s.mk === "wnn") wnn(x, cx, cy, size, col, P[s.mc === 3 ? 4 : 3]);
    else if (s.mk === "word") word(x, cx, cy, size, col, P[s.mc === 2 ? 0 : 2]);
    else {
      const img = markImage(s, hi);
      if (img) {
        const k = Math.min(size / img.naturalWidth, size / img.naturalHeight);
        const w = img.naturalWidth * k;
        const h = img.naturalHeight * k;
        const art = s.mk in TRI ? tinted(img, w, col) : img;
        x.drawImage(art, cx - w / 2, cy - h / 2, w, h);
      }
    }
    x.restore();
  };

  const drawFrame = (x, W, H, s, P) => {
    const col = P[s.fc];
    const u = Math.min(W, H);
    x.save();
    x.fillStyle = col;
    x.strokeStyle = col;
    switch (s.fk) {
      case "bars":
      case "wnn":
        x.fillRect(0, 0, W, H * 0.04);
        x.fillRect(0, H * 0.845, W, H * 0.155);
        if (s.fk === "wnn") {
          const width = W * 0.8;
          word(x, W - width / 2 - W * 0.025, H * 0.845, width, P[s.fc === 4 ? 3 : 4], P[2]);
        }
        break;
      case "card":
        x.fillRect(0, H * 0.84, W, H * 0.16);
        break;
      case "border":
        x.lineWidth = u * 0.005;
        for (const inset of [0.03, 0.045]) x.strokeRect(u * inset, u * inset, W - 2 * u * inset, H - 2 * u * inset);
        break;
      case "ticks": {
        const step = u / 48;
        x.lineWidth = Math.max(1, u / 800);
        x.beginPath();
        for (let k = 0; k * step < W; k++) line(x, k * step, 0, k * step, k % 5 ? u * 0.015 : u * 0.035);
        for (let k = 0; k * step < H; k++) line(x, 0, k * step, k % 5 ? u * 0.015 : u * 0.035, k * step);
        x.stroke();
        break;
      }
      default:
    }
    x.restore();
  };

  const grain = (x, W, H, amount, seed) => {
    if (!amount) return;
    const img = x.getImageData(0, 0, W, H);
    const d = img.data;
    let s = seed >>> 0;
    const amp = amount * 110;
    for (let i = 0; i < d.length; i += 4) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      const v = (s / 4294967296 - 0.5) * amp;
      d[i] += v;
      d[i + 1] += v;
      d[i + 2] += v;
    }
    x.putImageData(img, 0, 0);
  };

  const render = (canvas, W, H, s, hi = false) => {
    canvas.width = W;
    canvas.height = H;
    const x = canvas.getContext("2d", { willReadFrequently: s.n > 0 });
    const P = PALETTES[s.pal].slice(1);
    const tile = s.size === "tile";
    const u = Math.min(W, H);
    ground(x, W, H, s, P, rng(s.seed), tile);
    const layer = document.createElement("canvas");
    layer.width = W;
    layer.height = H;
    const lx = layer.getContext("2d");
    [["a", 11], ["b", 23]].forEach(([id, salt]) => {
      const kind = s[`${id}k`];
      if (!PATTERNS[kind]) return;
      lx.clearRect(0, 0, W, H);
      lx.save();
      PATTERNS[kind](lx, W, H, { col: P[s[`${id}c`]], u, r: rng(s.seed + salt), tile });
      lx.restore();
      x.globalAlpha = s[`${id}o`];
      x.drawImage(layer, 0, 0);
      x.globalAlpha = 1;
    });
    if (!tile) {
      drawFrame(x, W, H, s, P);
      drawMark(x, W, H, s, P, hi);
    }
    grain(x, W, H, s.n, s.seed + 37);
  };

  // ---- state --------------------------------------------------------------

  const PRESETS = [
    { size: "desk", pal: 1, gk: "glow", gc: 0, gc2: 1, ak: "waves", ac: 2, ao: 0.6, bk: "diamonds", bc: 2, bo: 0.55, mk: "tri", mc: 2, ms: 0.3, mp: "corner", mg: 0, fk: "none", fc: 3, n: 0.04, seed: 3 },
    { size: "desk", pal: 1, gk: "glow", gc: 0, gc2: 1, ak: "waves", ac: 2, ao: 0.6, bk: "dots", bc: 4, bo: 0.7, mk: "tri", mc: 2, ms: 0.3, mp: "corner", mg: 0, fk: "none", fc: 3, n: 0.04, seed: 3 },
    { size: "desk", pal: 2, gk: "dusk", gc: 0, gc2: 1, ak: "stars", ac: 3, ao: 0.9, bk: "none", bc: 2, bo: 0.5, mk: "bunny", mc: 3, ms: 0.45, mp: "center", mg: 1, fk: "none", fc: 3, n: 0.06, seed: 8 },
    { size: "square", pal: 5, gk: "dusk", gc: 0, gc2: 1, ak: "grid", ac: 4, ao: 0.55, bk: "ascii", bc: 4, bo: 0.2, mk: "d20", mc: 2, ms: 0.8, mp: "center", mg: 0, fk: "none", fc: 3, n: 0.08, seed: 20 },
    { size: "phone", pal: 3, gk: "fade", gc: 0, gc2: 1, ak: "bands", ac: 1, ao: 0.75, bk: "hatch", bc: 2, bo: 0.12, mk: "tri-d", mc: 3, ms: 0.35, mp: "high", mg: 0, fk: "none", fc: 3, n: 0.1, seed: 5 },
    { size: "phone", pal: 4, gk: "fade", gc: 1, gc2: 0, ak: "ripples", ac: 2, ao: 0.55, bk: "none", bc: 3, bo: 0.5, mk: "word", mc: 4, ms: 0.75, mp: "center", mg: 1, fk: "none", fc: 3, n: 0.22, seed: 9 },
    { size: "phone", pal: 6, gk: "flat", gc: 0, gc2: 1, ak: "zigzag", ac: 2, ao: 0.25, bk: "ascii", bc: 2, bo: 0.75, mk: "wnn", mc: 2, ms: 0.8, mp: "center", mg: 0, fk: "wnn", fc: 3, n: 0, seed: 14 },
    { size: "phone", pal: 7, gk: "tilt", gc: 0, gc2: 1, ak: "hatch", ac: 2, ao: 0.35, bk: "stripes", bc: 0, bo: 1, mk: "wnn", mc: 0, ms: 0.8, mp: "center", mg: 1, fk: "wnn", fc: 3, n: 0.04, seed: 14 },
    { size: "tile", pal: 9, gk: "flat", gc: 0, gc2: 1, ak: "checker", ac: 2, ao: 1, bk: "none", bc: 3, bo: 0.5, mk: "none", mc: 3, ms: 0.4, mp: "center", mg: 0, fk: "none", fc: 3, n: 0, seed: 1 },
    { size: "tile", pal: 0, gk: "flat", gc: 0, gc2: 1, ak: "ripples", ac: 1, ao: 0.5, bk: "dots", bc: 2, bo: 0.6, mk: "none", mc: 3, ms: 0.4, mp: "center", mg: 0, fk: "none", fc: 3, n: 0, seed: 4 },
  ];

  const NUMERIC = ["pal", "gc", "gc2", "ac", "ao", "bc", "bo", "mc", "ms", "mg", "fc", "n", "seed"];
  const clean = (raw) => {
    const s = { ...PRESETS[0], ...raw };
    for (const k of NUMERIC) s[k] = Number(s[k]) || 0;
    if (!(s.size in SIZES)) s.size = "desk";
    s.pal = Math.min(PALETTES.length - 1, Math.max(0, Math.round(s.pal)));
    for (const k of ["gc", "gc2", "ac", "bc", "mc", "fc"]) s[k] = Math.min(4, Math.max(0, Math.round(s[k])));
    if (!GROUNDS.includes(s.gk)) s.gk = "flat";
    if (!PATTERN_NAMES.includes(s.ak)) s.ak = "none";
    if (!PATTERN_NAMES.includes(s.bk)) s.bk = "none";
    if (!MARKS.includes(s.mk)) s.mk = "none";
    if (!(s.mp in PLACES)) s.mp = "center";
    if (!FRAMES.includes(s.fk)) s.fk = "none";
    s.seed = Math.abs(Math.round(s.seed)) % 1e9;
    return s;
  };

  const fromHash = () => {
    const m = location.hash.match(/^#mix\?(.*)$/);
    return m ? clean(Object.fromEntries(new URLSearchParams(m[1]))) : null;
  };

  const shuffle = () => {
    const r = rng((Math.random() * 2 ** 32) >>> 0);
    const any = (list) => list[Math.floor(r() * list.length)];
    const role = () => Math.floor(r() * 5);
    const size = r() < 0.25 ? "tile" : any(["desk", "phone", "square"]);
    return clean({
      size,
      pal: Math.floor(r() * PALETTES.length),
      gk: any(GROUNDS),
      gc: 0,
      gc2: 1,
      ak: any(PATTERN_NAMES.slice(1)),
      ac: 2 + Math.floor(r() * 3),
      ao: (0.3 + r() * 0.6).toFixed(2),
      bk: r() < 0.5 ? "none" : any(PATTERN_NAMES.slice(1)),
      bc: role(),
      bo: (0.15 + r() * 0.6).toFixed(2),
      mk: r() < 0.3 ? "none" : any(MARKS.slice(1)),
      mc: 2 + Math.floor(r() * 3),
      ms: (0.3 + r() * 0.5).toFixed(2),
      mp: any(Object.keys(PLACES)),
      mg: r() < 0.4 ? 1 : 0,
      fk: r() < 0.55 ? "none" : any(FRAMES.slice(1)),
      fc: 3,
      n: (r() < 0.5 ? 0 : r() * 0.25).toFixed(2),
      seed: Math.floor(r() * 1e6),
    });
  };

  // ---- UI -----------------------------------------------------------------

  const form = $("[data-mix-form]", mixer);
  const canvas = $("[data-mix-canvas]", mixer);
  const view = $(".kit-mix-view", mixer);
  const cssButton = $("[data-mix-css]", mixer);

  const pick = (name, value, label, title, cls = "") =>
    el("label", { class: `kit-pick ${cls}`, title }, el("input", { type: "radio", name, value, "aria-label": title }), el("span", {}, label));

  const select = (name, options, title) =>
    el("select", { name, "aria-label": title, title }, ...options.map(([v, t]) => el("option", { value: v }, t)));

  const range = (name, min, max, step, title) => el("input", { type: "range", name, min, max, step, "aria-label": title, title });

  const colorPicks = (name) => [0, 1, 2, 3, 4].map((i) => pick(name, i, "", `${name} ${i + 1}`, "kit-pick-color"));

  const row = (legend, ...kids) =>
    el("fieldset", { class: "kit-mix-layer", "data-row": legend }, el("legend", {}, legend), ...kids);

  // The hash only starts tracking the mixer once someone uses it, so a plain
  // visit to /style/ or /style/#logo is left alone.
  let touched = false;

  const presetRow = el("fieldset", { class: "kit-mix-row" }, el("legend", {}, "preset"));
  const presetCanvases = PRESETS.map((p, i) => {
    const c = el("canvas", { width: 1, height: 1 });
    const b = el("button", { type: "button", class: "kit-preset", "aria-label": `preset ${i + 1}` }, c);
    b.addEventListener("click", () => {
      touched = true;
      apply(PRESETS[i]);
      update();
    });
    presetRow.append(b);
    return c;
  });

  const sizeRow = $("[data-mix-sizes]", form);
  for (const [k, [w, h, glyph]] of Object.entries(SIZES)) sizeRow.append(pick("size", k, glyph, `${w}×${h}`));

  const palRow = $("[data-mix-palettes]", form);
  PALETTES.forEach(([name, ...cols], i) =>
    palRow.append(pick("pal", i, el("span", { style: "display:contents" }, ...cols.map((c) => el("i", { style: `background:${c}` }))), name, "kit-pick-palette")),
  );
  sizeRow.before(presetRow);

  const layers = $("[data-mix-layers]", form);
  layers.append(
    row("ground", select("gk", GROUNDS.map((g) => [g, g]), "ground"), ...colorPicks("gc"), el("span", { "aria-hidden": "true" }, "→"), ...colorPicks("gc2")),
    row("a", select("ak", PATTERN_NAMES.map((p) => [p, p]), "layer a"), ...colorPicks("ac"), range("ao", 0.05, 1, 0.05, "opacity")),
    row("b", select("bk", PATTERN_NAMES.map((p) => [p, p]), "layer b"), ...colorPicks("bc"), range("bo", 0.05, 1, 0.05, "opacity")),
    row(
      "mark",
      select("mk", MARKS.map((m) => [m, m]), "mark"),
      select("mp", Object.entries(PLACES).map(([k, g]) => [k, g]), "place"),
      el("label", { class: "kit-pick", title: "glow" }, el("input", { type: "checkbox", name: "mg", "aria-label": "glow" }), el("span", {}, "✧")),
      ...colorPicks("mc"),
      range("ms", 0.1, 1, 0.01, "size"),
    ),
    row("frame", select("fk", FRAMES.map((f) => [f, f]), "frame"), ...colorPicks("fc")),
    row("grain", range("n", 0, 0.5, 0.01, "grain")),
  );

  let state = PRESETS[0];

  const paintRoles = () => {
    const P = PALETTES[state.pal].slice(1);
    $$(".kit-pick-color", form).forEach((lab) => {
      const input = $("input", lab);
      $("span", lab).style.background = P[Number(input.value)];
    });
    const tile = state.size === "tile";
    $$('[data-row="mark"], [data-row="frame"]', form).forEach((f) => (f.disabled = tile));
    $('[name="gk"]', form).disabled = tile;
    $$('[name="gc2"]', form).forEach((i) => (i.disabled = tile || state.gk === "flat"));
    cssButton.hidden = !tile;
  };

  const apply = (s) => {
    state = clean(s);
    const els = form.elements;
    for (const [k, v] of Object.entries(state)) {
      const f = els.namedItem(k);
      if (!f) continue;
      if (f.type === "checkbox") f.checked = !!v;
      else f.value = String(v);
    }
  };

  const read = () => {
    const els = form.elements;
    const raw = { seed: state.seed };
    for (const k of Object.keys(PRESETS[0])) {
      const f = els.namedItem(k);
      if (!f) continue;
      raw[k] = f.type === "checkbox" ? (f.checked ? 1 : 0) : f.value;
    }
    return clean(raw);
  };

  const hashOf = (s) => `#mix?${new URLSearchParams(Object.entries(s).map(([k, v]) => [k, String(v)]))}`;

  let frame = 0;
  const draw = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const [W, H] = SIZES[state.size];
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const box = view.clientWidth - 24;
      const maxH = window.innerHeight * 0.7;
      if (state.size === "tile") {
        // Show the tile repeated, so a seam would show.
        const shown = Math.min(box, maxH);
        const t = document.createElement("canvas");
        render(t, Math.round((shown / 2) * dpr), Math.round((shown / 2) * dpr), state);
        canvas.width = canvas.height = t.width * 2;
        const x = canvas.getContext("2d");
        x.fillStyle = x.createPattern(t, "repeat");
        x.fillRect(0, 0, canvas.width, canvas.height);
        canvas.style.width = `${shown}px`;
        canvas.style.height = `${shown}px`;
      } else {
        const k = Math.min(box / W, maxH / H);
        render(canvas, Math.round(W * k * dpr), Math.round(H * k * dpr), state);
        canvas.style.width = `${W * k}px`;
        canvas.style.height = `${H * k}px`;
      }
    });
  };

  const drawPresets = () =>
    PRESETS.forEach((p, i) => {
      const [W, H] = SIZES[p.size];
      const k = 44 / Math.max(W, H);
      render(presetCanvases[i], Math.round(W * k * 2), Math.round(H * k * 2), clean(p));
      presetCanvases[i].style.width = `${W * k}px`;
      presetCanvases[i].style.height = `${H * k}px`;
    });

  const update = () => {
    paintRoles();
    draw();
    if (touched) history.replaceState(null, "", hashOf(state));
    ensureMark(state, false).then(draw);
  };

  form.addEventListener("input", () => {
    touched = true;
    state = read();
    update();
  });

  $("[data-mix-roll]", mixer).addEventListener("click", () => {
    touched = true;
    apply(shuffle());
    update();
  });

  $("[data-mix-link]", mixer).addEventListener("click", () => {
    touched = true;
    history.replaceState(null, "", hashOf(state));
    copy(location.href, "#");
  });

  const fileName = (s) => `wirenook-${s.size}-${s.seed}.png`;

  $("[data-mix-png]", mixer).addEventListener("click", async () => {
    say("…");
    const s = { ...state };
    await ensureMark(s, true);
    const [W, H] = SIZES[s.size];
    const out = document.createElement("canvas");
    render(out, W, H, s, true);
    out.toBlob((blob) => {
      if (!blob) return say("✕");
      const a = el("a", { href: URL.createObjectURL(blob), download: fileName(s) });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      say(`↓ ${fileName(s)}`);
    }, "image/png");
  });

  cssButton.addEventListener("click", () => {
    const [W] = SIZES.tile;
    const bg = PALETTES[state.pal][1 + state.gc];
    copy(`background: ${bg} url("${fileName(state)}") 0 0 / ${W / 2}px ${W / 2}px repeat;`, "CSS");
  });

  window.addEventListener("resize", () => draw());
  window.addEventListener("hashchange", () => {
    const s = fromHash();
    if (s) {
      apply(s);
      update();
    }
  });

  const initial = fromHash();
  apply(initial || PRESETS[0]);
  mixer.hidden = false;
  if (initial) mixer.scrollIntoView();
  update();

  // The lettering face is a webfont: the wordmarks have to wait for it or they
  // set in the fallback face.
  (document.fonts ? document.fonts.load(`100px ${LETTERING}`) : Promise.resolve())
    .catch(() => {})
    .then(() => {
      Promise.all(PRESETS.map((p) => ensureMark(clean(p), false))).then(drawPresets);
      draw();
    });
})();
