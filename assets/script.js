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
// more. Call it 84. The birthday is a placeholder — Cassidy, put yours in.
//
// To peek past the end of the clock without editing code: ?dies=2020-01-01
const deathClock = document.querySelector("[data-death-clock]");
if (deathClock) {
  const BORN = Date.UTC(1999, 0, 1);
  const DIES = Date.UTC(1999 + 84, 0, 1);

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
  const note = deathClock.querySelector("[data-death-note]");
  const fill = deathClock.querySelector("[data-death-fill]");
  const percent = deathClock.querySelector("[data-death-percent]");

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

    // Eight decimals so the spend is visible every single second.
    const spent = ((now - BORN) / (dies - BORN)) * 100;
    fill.style.width = `${Math.min(Math.max(spent, 0), 100)}%`;
    percent.textContent = `life spent: ${spent.toFixed(8)}%${overtime ? " — new game+" : ""}`;

    if (overtime !== wasOvertime) {
      wasOvertime = overtime;
      deathClock.classList.toggle("is-overtime", overtime);
      status.textContent = overtime ? status.dataset.statusOvertime : status.dataset.statusAlive;
      note.textContent = overtime ? note.dataset.noteOvertime : note.dataset.noteAlive;
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
