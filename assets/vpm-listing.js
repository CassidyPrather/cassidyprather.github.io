/* Renders a VPM (VRChat Package Manager) repository listing into the page.

   The file this reads is the same one the Creator Companion reads, published
   from a different repository onto this domain, so nothing here is built at
   the same time as the page around it. Three states have to hold on their
   own: the listing is missing (it does not exist yet), the listing is there
   and has no packages in it (it starts empty), and the listing has packages.

   Everything is built with createElement and textContent. The JSON comes from
   a repository this site does not build, and a package description is prose
   somebody wrote — it is not markup, and it must never be parsed as any. */

const vpmListings = document.querySelectorAll("[data-vpm-listing]");

if (vpmListings.length) {
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  };

  // Nothing in the listing is guaranteed to be the type its schema says it is.
  // textContent already makes any of it inert as markup, but a non-string
  // still stringifies to something like "[object Object]" on the page, so a
  // field is only used when it actually arrived as text.
  const text = (value) => (typeof value === "string" && value.trim() ? value : null);

  // Only ever build a link out of a URL a browser will navigate to. Same
  // reasoning as the createElement note above: "javascript:" is a string a
  // listing can contain, and an <a href> is the one place it would run.
  const safeUrl = (value) => {
    if (typeof value !== "string") return null;
    try {
      const url = new URL(value, location.href);
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
    } catch {
      return null;
    }
  };

  // A VPM listing keys its versions by version string, so their order in the
  // file is whatever wrote it — the newest has to be worked out rather than
  // read off the end. Release beats prerelease at the same core version, per
  // semver §11; anything that doesn't parse sorts below everything that does.
  const parseVersion = (value) => {
    const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(String(value));
    return match ? { core: [+match[1], +match[2], +match[3]], pre: match[4] ?? null } : null;
  };

  const isPrerelease = (value) => parseVersion(value)?.pre != null;

  const compareVersions = (a, b) => {
    const left = parseVersion(a);
    const right = parseVersion(b);
    if (!left || !right) return (left ? 1 : 0) - (right ? 1 : 0);
    for (let i = 0; i < 3; i += 1) {
      if (left.core[i] !== right.core[i]) return left.core[i] - right.core[i];
    }
    if (left.pre === right.pre) return 0;
    if (left.pre === null) return 1;
    if (right.pre === null) return -1;
    return left.pre < right.pre ? -1 : 1;
  };

  const linkList = (entries) => {
    const list = el("ul", "vpm-links");
    for (const [label, href] of entries) {
      const url = safeUrl(href);
      if (!url) continue;
      const item = document.createElement("li");
      const anchor = el("a", null, label);
      anchor.href = url;
      anchor.rel = "noopener";
      item.append(anchor);
      list.append(item);
    }
    return list.childElementCount ? list : null;
  };

  const renderPackage = (id, entry) => {
    const versions = entry?.versions;
    if (!versions || typeof versions !== "object") return null;

    // The newest *release*, and only the newest prerelease when there has
    // never been a release. Strict semver ordering would put a 1.2.0-rc ahead
    // of the 1.1.0 people are actually running, and the Creator Companion
    // hides prereleases by default for the same reason.
    const all = Object.keys(versions).sort(compareVersions);
    const stable = all.filter((version) => !isPrerelease(version));
    const newest = (stable.length ? stable : all).at(-1);
    const pkg = versions[newest];
    if (!pkg || typeof pkg !== "object") return null;

    const item = el("li", "vpm-package");
    const head = el("div", "vpm-package-head");
    head.append(el("h4", "vpm-name", text(pkg.displayName) || text(pkg.name) || id));
    // The key rather than the field: they agree in every well-formed listing,
    // and the key is the one of the two that is a string by construction.
    head.append(el("span", "vpm-version", `v${newest}`));
    item.append(head);
    item.append(el("code", "vpm-id", id));
    const description = text(pkg.description);
    if (description) item.append(el("p", "vpm-desc", description));

    const links = linkList([
      ["Documentation", pkg.documentationUrl],
      ["Changelog", pkg.changelogUrl],
      ["Download", pkg.url],
    ]);
    if (links) item.append(links);
    return item;
  };

  // vcc:// is a protocol the Creator Companion registers when it installs, so
  // this button does nothing at all on a machine without VCC. The URL is
  // printed beside it for that case, and for anyone adding the repository by
  // hand — which is why it has to be absolute, and why the listing's own
  // `url` field is preferred over the path this page fetched.
  const renderHead = (listing, fetchedFrom) => {
    const canonical = safeUrl(listing.url) || new URL(fetchedFrom, location.href).href;
    const head = el("div", "vpm-listing-head");
    const name = text(listing.name) || text(listing.id);
    if (name) head.append(el("h3", "vpm-listing-name", name));
    const add = el("a", "vpm-add", "Add to VCC");
    add.href = `vcc://vpm/addRepo?url=${encodeURIComponent(canonical)}`;
    head.append(add);
    head.append(el("code", "vpm-url", canonical));
    return head;
  };

  const render = (container, listing, fetchedFrom) => {
    container.replaceChildren(renderHead(listing, fetchedFrom));

    const packages = listing.packages && typeof listing.packages === "object" ? listing.packages : {};
    const items = Object.entries(packages)
      .map(([id, entry]) => renderPackage(id, entry))
      .filter(Boolean);

    if (!items.length) {
      container.append(el("p", "vpm-status", "No packages published yet."));
      return;
    }
    const list = el("ul", "vpm-packages");
    list.append(...items);
    container.append(list);
  };

  for (const container of vpmListings) {
    const source = container.dataset.vpmUrl;
    if (!source) continue;
    fetch(source, { headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status}`);
        return response.json();
      })
      .then((listing) => {
        if (!listing || typeof listing !== "object") throw new Error("not a listing");
        render(container, listing, source);
      })
      .catch(() => {
        // Nothing the reader can act on, and nothing they need a stack trace
        // for: before the other repository has published for the first time,
        // this is a 404 and the quiet line is the honest answer.
        container.replaceChildren(el("p", "vpm-status", "The package listing could not be loaded."));
      });
  }
}
