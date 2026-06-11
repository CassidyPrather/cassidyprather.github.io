# Images

Every image the site serves lives under this directory, one subdirectory per
*license situation*. The [style reference](https://wirenook.net/style/)
renders a gallery of everything here, and `data/image_licenses.toml` is the
single source of truth for what each directory means — the licenses page and
the gallery both read it.

| Directory   | Contents                                       | License                                  |
| ----------- | ---------------------------------------------- | ---------------------------------------- |
| `wirenook/` | Original wirenook.net art and its source files | CC0 1.0 (AGPLv3 transfer in progress)    |
| `captures/` | VRChat screenshots                             | None granted — depicted content belongs to its creators |
| `lancer/`   | Утопия assets derived from COMP/CON            | GPL-3.0                                  |
| `borrowed/` | Other people's badges, byte-identical to upstream | Upstream terms (see its README)       |
| 'OPL/'      | Open Pixel License Media, authored by Ron Kyle Almira |OPL v1.1 | 

## Conventions

- **Naming**: lowercase kebab-case (`volumetric-clouds.png`). Dots are only
  for domain-named files (`lobste.rs.svg`); a `-WxH` suffix is welcome where
  the dimensions are culturally load-bearing (`agplv3-155x51.png`).
- **Sources sit next to exports, same stem**: `waves.svg` is the source of
  `waves.png`; `extra-art.xcf` would be the source of `extra-art.png`. If no
  same-stem source file exists, the committed file *is* the source. Since
  `static/` is published verbatim, the live site serves its own sources.
  (Pending: the XCF and component SVGs for `extra-art.png` still need to be
  retrieved and dropped in under that stem.)

## Metadata

PNG/GIF files in managed directories are stripped of incidental metadata
(GIMP junk, screenshot world/instance details, …) and stamped with XMP
license/creator tags by [`tools/images.py`](../../tools/images.py), which
needs [exiftool](https://exiftool.org/) on the PATH (`apt install
libimage-exiftool-perl`, `brew install exiftool`, `winget install exiftool`).
CI fails when a file drifts; to fix locally:

```sh
python3 tools/images.py check   # report drift, bad names, stray files
python3 tools/images.py fix     # strip + restamp anything non-compliant
```

`borrowed/` is never stamped — those files stay exactly as upstream ships
them. exiftool cannot write SVG or XCF, so vector and source files are
exempt; their license is declared by the directory they sit in.
