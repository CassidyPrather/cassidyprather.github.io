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
