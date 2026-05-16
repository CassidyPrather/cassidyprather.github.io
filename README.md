# cass-website

Cassidy Co.'s personal site, built with [Hugo](https://gohugo.io/) and deployed
to GitHub Pages.

## Local development

Requires Hugo extended, v0.140.0 or newer.

```bash
hugo server -D    # live-reload dev server on http://localhost:1313
hugo --minify     # one-shot production build into ./public
```

## Project layout

```
.
├── hugo.toml                       # site config
├── content/                        # page content (markdown front matter)
│   ├── _index.md                   # home page
│   └── licenses.md                 # /licenses/
├── layouts/
│   ├── _default/baseof.html        # shared page shell (head/body/chrome)
│   ├── partials/
│   │   ├── background.html         # wave-field, clouds, sigil
│   │   ├── site-header.html        # banner
│   │   └── site-footer.html        # footer link strip
│   ├── index.html                  # home page template
│   └── licenses/single.html        # licenses page template
└── static/                         # served verbatim from site root
    ├── fonts/                      # Unique.ttf + OFL license files
    ├── images/                     # banners, clouds, waves, etc.
    ├── LICENSE                     # symlink to repo-root LICENSE
    ├── script.js
    └── styles.css
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which:

1. Installs Hugo extended.
2. Builds with `hugo --minify`, baseURL pulled from `actions/configure-pages`.
3. Uploads `./public` and deploys with `actions/deploy-pages`.

To enable Pages on a fresh repo: **Settings → Pages → Build and deployment →
Source: GitHub Actions**.

## Licenses

See [`/licenses/`](https://cassidyprather.github.io/cass-website/licenses/)
on the live site, or the [`LICENSE`](./LICENSE) file in this repo.
