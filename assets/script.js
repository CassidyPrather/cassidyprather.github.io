const spinner = document.querySelector("[data-spinner]");
const spinButton = document.querySelector("[data-spin-button]");

let currentSpin = 0;

spinButton?.addEventListener("click", () => {
  currentSpin += 90 + Math.floor(Math.random() * 4) * 90;
  spinner?.style.setProperty("--spin", `${currentSpin}deg`);
});

const searchForm = document.querySelector("[data-blog-search]");
if (searchForm) {
  const input = searchForm.querySelector("input[type='search']");
  const status = document.querySelector("[data-search-status]");
  const entries = Array.from(document.querySelectorAll("[data-entry]"));
  // Built lazily from /blog/index.json so search covers the full text of
  // major posts, not just the summary shown on the feed.
  let indexPromise = null;

  // Typographic quotes in rendered prose shouldn't stop a straight-quote
  // query from matching.
  const normalize = (text) => text.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

  const loadIndex = () => {
    indexPromise ??= fetch(searchForm.dataset.index)
      .then((res) => res.json())
      .then((posts) => new Map(posts.map((p) => [p.url, normalize(`${p.title}\n${p.text}`)])))
      .catch(() => new Map());
    return indexPromise;
  };

  const apply = async (query) => {
    const q = normalize(query.trim());
    if (!q) {
      entries.forEach((el) => (el.hidden = false));
      if (status) status.hidden = true;
      return;
    }
    const index = await loadIndex();
    if (normalize(input.value.trim()) !== q) return;
    let shown = 0;
    entries.forEach((el) => {
      const haystack = index.get(el.dataset.url) ?? normalize(el.textContent);
      const match = haystack.includes(q);
      el.hidden = !match;
      if (match) shown += 1;
    });
    if (status) {
      status.hidden = false;
      status.textContent = shown === 0 ? "No posts match." : `${shown} ${shown === 1 ? "post matches" : "posts match"}.`;
    }
  };

  let searchDebounce;
  input?.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
      apply(input.value);
      const url = new URL(location);
      if (input.value.trim()) url.searchParams.set("q", input.value.trim());
      else url.searchParams.delete("q");
      history.replaceState(null, "", url);
    }, 150);
  });
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    apply(input?.value ?? "");
  });

  searchForm.hidden = false;
  const initialQuery = new URL(location).searchParams.get("q");
  if (initialQuery && input) {
    input.value = initialQuery;
    apply(initialQuery);
  }
}

// Death clock. The actuarial hand-waving, shown honestly: the SSA period
// life table gives a 27-year-old woman ~55 more years, landing around 82.
// Good sleep and a stable relationship/job/family (the strongest predictors
// anyone has found) roughly cancel out a desk-shaped exercise routine, and
// secular mortality improvement for a late-90s birth cohort adds a couple
// more. Call it 84.
//
// To peek past the end of the clock without editing code: ?dies=2020-01-01
const deathClock = document.querySelector("[data-death-clock]");
if (deathClock) {
  const BORN = Date.UTC(1999, 4, 12);
  const DIES = Date.UTC(1999 + 84, 4, 12);

  const override = Date.parse(new URLSearchParams(location.search).get("dies"));
  const dies = Number.isNaN(override) ? DIES : override;

  const num = {
    years: deathClock.querySelector("[data-death-years]"),
    days: deathClock.querySelector("[data-death-days]"),
    hours: deathClock.querySelector("[data-death-hours]"),
    minutes: deathClock.querySelector("[data-death-minutes]"),
    seconds: deathClock.querySelector("[data-death-seconds]"),
  };
  const status = deathClock.querySelector("[data-death-status]");
  const fill = deathClock.querySelector("[data-death-fill]");

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const YEAR = 365.2425 * DAY;
  const pad = (n) => String(n).padStart(2, "0");

  let wasOvertime = null;

  const tick = () => {
    const now = Date.now();
    const overtime = now >= dies;

    let rem = Math.abs(dies - now);
    const years = Math.floor(rem / YEAR);
    rem -= years * YEAR;
    const days = Math.floor(rem / DAY);
    rem -= days * DAY;
    const hours = Math.floor(rem / HOUR);
    rem -= hours * HOUR;
    const minutes = Math.floor(rem / MINUTE);
    const seconds = Math.floor((rem - minutes * MINUTE) / 1000);

    num.years.textContent = overtime ? `+${years}` : String(years);
    num.days.textContent = String(days);
    num.hours.textContent = pad(hours);
    num.minutes.textContent = pad(minutes);
    num.seconds.textContent = pad(seconds);

    const spent = ((now - BORN) / (dies - BORN)) * 100;
    fill.style.width = `${Math.min(Math.max(spent, 0), 100)}%`;

    if (overtime !== wasOvertime) {
      wasOvertime = overtime;
      deathClock.classList.toggle("is-overtime", overtime);
      status.textContent = overtime ? status.dataset.statusOvertime : status.dataset.statusAlive;
    }
  };

  // Chain timeouts aligned to the wall clock so the seconds never stutter —
  // a death clock that skips seconds sends the wrong message entirely.
  const schedule = () => setTimeout(() => {
    tick();
    schedule();
  }, 1000 - (Date.now() % 1000));
  tick();
  schedule();
}

// Technical-drawing tick rulers along the top and right viewport edges.
// A gaussian bump in tick length follows the pointer — an X cursor on the
// top ruler, a Y cursor on the right one — with coordinate labels that only
// surface inside the bump, like an instrument waking up where you point.
// When keyboard focus lands somewhere (:focus-visible, so mouse clicks don't
// trigger it), both cursors glide to that element instead and dimension-style
// brackets mark its extent on each ruler. Everything is spring-smoothed by
// easing the drawn state toward its target each frame; the loop parks itself
// once the two converge so an idle page draws nothing.
const rulerCanvas = document.querySelector("[data-tick-rulers]");
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

if (rulerCanvas) {
  const ctx = rulerCanvas.getContext("2d");
  const rootStyle = getComputedStyle(document.documentElement);
  const paint = {
    tick: rootStyle.getPropertyValue("--ice").trim() || "#d7fbff",
    cursor: rootStyle.getPropertyValue("--magenta").trim() || "#ff00e6",
    bracket: rootStyle.getPropertyValue("--banana").trim() || "#fff9b1",
  };

  const SPACING = 8; // px between minor ticks
  const LEN = [6, 10, 16]; // tick length: minor / every 5th / every 10th
  const TICK_ALPHA = [0.34, 0.46, 0.6];
  const BUMP = 22; // extra tick length at the bump's peak
  const MOUSE_SIGMA = 60; // bump half-width while following the pointer
  const LABEL_FONT = "9px Atkinson-Regular, 'Trebuchet MS', sans-serif";

  let W = 0;
  let H = 0;

  // Drawn state eases toward the target; the gap between them is what keeps
  // the animation loop alive. sx/sy are the bump widths — they widen to hug
  // a focused element and relax back for the pointer.
  const cur = { x: 0, y: 0, amp: 0, sx: MOUSE_SIGMA, sy: MOUSE_SIGMA, focus: 0 };
  const tgt = { x: 0, y: 0, amp: 0, sx: MOUSE_SIGMA, sy: MOUSE_SIGMA, focus: 0 };
  const mouse = { x: 0, y: 0, active: false };
  let focusEl = null;
  let focusRect = null;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const gauss = (offset, sigma) => Math.exp(-0.5 * (offset / sigma) ** 2);

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    ctx.font = LABEL_FONT;

    // Ruler spines: hairlines along both edges.
    ctx.strokeStyle = paint.tick;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.moveTo(0, 0.5);
    ctx.lineTo(W, 0.5);
    ctx.moveTo(W - 0.5, 0);
    ctx.lineTo(W - 0.5, H);
    ctx.stroke();

    ctx.fillStyle = paint.tick;

    // Top ruler (X).
    for (let i = 0; i * SPACING <= W; i += 1) {
      const x = i * SPACING;
      const rank = i % 10 === 0 ? 2 : i % 5 === 0 ? 1 : 0;
      const w = cur.amp * gauss(x - cur.x, cur.sx);
      const len = LEN[rank] + BUMP * w;
      ctx.globalAlpha = Math.min(1, TICK_ALPHA[rank] + 0.4 * w);
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, len);
      ctx.stroke();
      // Coordinate labels surface only inside the bump, and step aside for
      // the cursor's own readout.
      if (rank === 2 && i > 0 && w > 0.05 && Math.abs(x - cur.x) > 18) {
        ctx.globalAlpha = 0.8 * w;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(String(x), x, len + 3);
      }
    }

    // Right ruler (Y), labels rotated to read along the edge.
    for (let i = 0; i * SPACING <= H; i += 1) {
      const y = i * SPACING;
      const rank = i % 10 === 0 ? 2 : i % 5 === 0 ? 1 : 0;
      const w = cur.amp * gauss(y - cur.y, cur.sy);
      const len = LEN[rank] + BUMP * w;
      ctx.globalAlpha = Math.min(1, TICK_ALPHA[rank] + 0.4 * w);
      ctx.beginPath();
      ctx.moveTo(W, y + 0.5);
      ctx.lineTo(W - len, y + 0.5);
      ctx.stroke();
      if (rank === 2 && i > 0 && w > 0.05 && Math.abs(y - cur.y) > 18) {
        ctx.globalAlpha = 0.8 * w;
        ctx.save();
        ctx.translate(W - len - 3, y);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(String(y), 0, 0);
        ctx.restore();
      }
    }

    // Dimension brackets hugging the focused element's extent.
    if (cur.focus > 0.03 && focusRect) {
      const depth = LEN[2] + BUMP * 0.55;
      ctx.strokeStyle = paint.bracket;
      const x0 = clamp(focusRect.left, 0, W);
      const x1 = clamp(focusRect.right, 0, W);
      const y0 = clamp(focusRect.top, 0, H);
      const y1 = clamp(focusRect.bottom, 0, H);
      ctx.globalAlpha = 0.85 * cur.focus;
      ctx.beginPath();
      ctx.moveTo(x0 + 0.5, 0);
      ctx.lineTo(x0 + 0.5, depth);
      ctx.moveTo(x1 + 0.5, 0);
      ctx.lineTo(x1 + 0.5, depth);
      ctx.moveTo(W, y0 + 0.5);
      ctx.lineTo(W - depth, y0 + 0.5);
      ctx.moveTo(W, y1 + 0.5);
      ctx.lineTo(W - depth, y1 + 0.5);
      ctx.stroke();
      // Faint dimension lines joining each bracket pair.
      ctx.globalAlpha = 0.32 * cur.focus;
      ctx.beginPath();
      ctx.moveTo(x0, depth - 0.5);
      ctx.lineTo(x1, depth - 0.5);
      ctx.moveTo(W - depth + 0.5, y0);
      ctx.lineTo(W - depth + 0.5, y1);
      ctx.stroke();
    }

    // The cursors themselves: an accented tick plus a live coordinate
    // readout on each ruler.
    if (cur.amp > 0.03) {
      const mx = clamp(cur.x, 0, W);
      const my = clamp(cur.y, 0, H);
      const reach = LEN[2] + BUMP * cur.amp + 5;
      ctx.strokeStyle = paint.cursor;
      ctx.fillStyle = paint.cursor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = Math.min(1, cur.amp);
      ctx.beginPath();
      ctx.moveTo(mx, 0);
      ctx.lineTo(mx, reach);
      ctx.moveTo(W, my);
      ctx.lineTo(W - reach, my);
      ctx.stroke();
      ctx.globalAlpha = Math.min(1, cur.amp) * 0.9;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(String(Math.round(mx)), clamp(mx, 14, W - 14), reach + 3);
      ctx.save();
      ctx.translate(W - reach - 3, clamp(my, 14, H - 14));
      ctx.rotate(-Math.PI / 2);
      ctx.textBaseline = "bottom";
      ctx.fillText(String(Math.round(my)), 0, 0);
      ctx.restore();
    }

    ctx.globalAlpha = 1;
  };

  let rafId = 0;
  let lastT = 0;

  const step = (t) => {
    rafId = 0;
    // Clamped so the first frame after a long idle park doesn't teleport.
    const dt = Math.min((t - lastT) / 1000, 0.05);
    lastT = t;

    if (focusEl && !focusEl.isConnected) focusEl = null;
    if (focusEl) {
      // Re-read every frame so the cursors stay twined to the element
      // through scrolling and layout shifts.
      focusRect = focusEl.getBoundingClientRect();
      tgt.x = focusRect.left + focusRect.width / 2;
      tgt.y = focusRect.top + focusRect.height / 2;
      tgt.sx = Math.max(48, focusRect.width * 0.45);
      tgt.sy = Math.max(48, focusRect.height * 0.45);
      tgt.amp = 1;
    }
    tgt.focus = focusEl ? 1 : 0;

    const k = 1 - Math.exp(-dt * 7);
    let moving = false;
    for (const key of Object.keys(cur)) {
      cur[key] += (tgt[key] - cur[key]) * k;
      if (Math.abs(tgt[key] - cur[key]) > (key === "x" || key === "y" ? 0.25 : 0.004)) moving = true;
    }

    draw();
    if (moving || focusEl) schedule();
  };

  const schedule = () => {
    if (!rafId) {
      lastT = performance.now();
      rafId = requestAnimationFrame(step);
    }
  };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    // clientWidth, not innerWidth: the fixed canvas stops at the scrollbar,
    // and the right ruler needs to sit on the visible edge.
    W = document.documentElement.clientWidth;
    H = document.documentElement.clientHeight;
    rulerCanvas.width = Math.round(W * dpr);
    rulerCanvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  cur.x = tgt.x = mouse.x = document.documentElement.clientWidth / 2;
  cur.y = tgt.y = mouse.y = document.documentElement.clientHeight / 2;
  resize();
  addEventListener("resize", resize);

  if (!prefersReducedMotion.matches) {
    addEventListener(
      "pointermove",
      (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
        // Moving the mouse reclaims the cursors from a focused element.
        focusEl = null;
        tgt.x = mouse.x;
        tgt.y = mouse.y;
        tgt.sx = MOUSE_SIGMA;
        tgt.sy = MOUSE_SIGMA;
        tgt.amp = 1;
        schedule();
      },
      { passive: true },
    );

    document.documentElement.addEventListener("mouseleave", () => {
      mouse.active = false;
      if (!focusEl) {
        tgt.amp = 0;
        schedule();
      }
    });

    addEventListener("focusin", (event) => {
      if (event.target instanceof Element && event.target.matches(":focus-visible")) {
        focusEl = event.target;
        schedule();
      }
    });

    addEventListener("focusout", () => {
      focusEl = null;
      // Hand the cursors back to the mouse if it's still on the page,
      // otherwise let the bump subside.
      if (mouse.active) {
        tgt.x = mouse.x;
        tgt.y = mouse.y;
        tgt.sx = MOUSE_SIGMA;
        tgt.sy = MOUSE_SIGMA;
      } else {
        tgt.amp = 0;
      }
      schedule();
    });
  }
}

// Cloud parallax: keep a unitless --scrolly counter on <html> that the
// .cloud-field layers translate against at per-depth rates (see styles.css).
// One write per frame, coalesced across scroll events.
if (!prefersReducedMotion.matches && document.querySelector(".cloud-field")) {
  const root = document.documentElement;
  let pending = 0;
  const apply = () => {
    pending = 0;
    root.style.setProperty("--scrolly", String(scrollY));
  };
  addEventListener(
    "scroll",
    () => {
      if (!pending) pending = requestAnimationFrame(apply);
    },
    { passive: true },
  );
  apply();
}

document.querySelectorAll("[data-copy]").forEach((button) => {
  const value = button.getAttribute("data-copy");
  const label = button.querySelector("[data-copy-text]");
  const original = label?.textContent ?? "";
  if (!value) return;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      if (label) label.textContent = `Copied: ${value}`;
      setTimeout(() => {
        button.classList.remove("is-copied");
        if (label) label.textContent = original;
      }, 1800);
    } catch {
      if (label) label.textContent = value;
    }
  });
});
