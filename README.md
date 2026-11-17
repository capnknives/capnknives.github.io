# capnknives.github.io

Richard Elliot's portfolio, served by GitHub Pages. Plain HTML, CSS and a little
JavaScript: no framework and no build step. Edit a file, push, and it is live.

## What is where

| Path | What |
| --- | --- |
| `index.html` | Front page: introduction, project list, about. |
| `projects/*.html` | One landing page per project. |
| `assets/site.css` | All styling. Each project has a colour, set by `data-room`. |
| `assets/prompt.js` | The command prompt (`look`, `exits`, `go <name>`, `back`). |
| `assets/fonts/` | Self-hosted typefaces (Bricolage Grotesque, Literata) and their licenses. |
| `404.html` | Not-found page. Uses absolute paths because it is served at any depth. |
| `mortals-and-monsters/` | The Mortals and Monsters player site, moved here unchanged from the repo root. |
| `about.html`, `connect.html`, `news.html`, `cheatsheet.html`, `privacy.html` | Redirects from the game site's old addresses to `mortals-and-monsters/`. |
| `MortalsAndMonsters.mpackage` | Copy kept at the old address so existing download links keep working. |
| `CNAME` | The custom domain. Currently `riftforge.me`. |

## Add a project

1. Copy one of the pages in `projects/` and change `data-room` on `<body>` to the new project's key.
2. In `assets/site.css`, add two colours for it under `:root` (a deep tone and a pale wash) and a
   `[data-room="key"]` line next to the existing four. Check the deep tone against the wash for
   contrast (4.5:1 or better).
3. Add a row to the list in `index.html`, and a link in the "Exits" list of the other project pages.
   Give each link `data-exit="key"`. The command prompt reads those links, so it needs no change.

## The game site and the domain

GitHub Pages allows one custom domain per site. While `CNAME` says `riftforge.me`, this portfolio
is what loads at `riftforge.me` and the game site is at `riftforge.me/mortals-and-monsters/`.

When the portfolio gets a domain of its own, move `mortals-and-monsters/` to a separate repository
with `riftforge.me` as that repository's custom domain, then change `CNAME` here to the new domain.
The game then keeps its address and the old-address redirects in this repo can be deleted.

Anything that publishes the game site into this repository (for example a deploy script in the game's
own repo) must be pointed at `mortals-and-monsters/` first, or it will overwrite the portfolio.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
