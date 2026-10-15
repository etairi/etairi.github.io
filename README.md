# erkantairi.com

Personal academic website of Erkan Tairi. It is built with [Hugo](https://gohugo.io)
and a hand-written layout (no theme), and is published on GitHub Pages.

## Preview locally

```sh
hugo server            # http://localhost:1313, reloads on every save
hugo server -D         # also shows drafts (e.g. the blog while it is switched off)
```

Built and tested with Hugo 0.128 (extended) and 0.168; the GitHub workflow pins 0.128.0.

## Editing content

| What | Where |
| --- | --- |
| Bio next to the photo | `content/_index.md` |
| Name, role, affiliation, email | `hugo.yaml` → `params.author` |
| Research interests, education | `hugo.yaml` → `params.interests`, `params.education` |
| Social icons | `hugo.yaml` → `params.social` (available icons are listed there) |
| Menu | `hugo.yaml` → `menus.main` |
| Publications | `data/publications.yaml` |
| Talks | `data/talks.yaml`, slides in `static/slides/` |
| Teaching, supervision | `data/teaching.yaml`, `data/supervision.yaml` |
| CV | replace `static/uploads/CV.pdf` (the address stays `/uploads/CV.pdf`) |
| Photo | replace `assets/images/photo.webp` (any JPEG, PNG or WebP; update the file name in `hugo.yaml` if it changes) |
| Wording of labels ("Preprints", "Selected talks", …) | `i18n/en.yaml` |

### Add a paper

Add an entry at the top of `data/publications.yaml`:

```yaml
- id: my-new-paper              # erkantairi.com/#my-new-paper links straight to it
  title: "Title of the Paper"
  authors: [Alice Example, Erkan Tairi]
  year: 2027
  venue: EUROCRYPT 2027         # leave this line out while it is a preprint
  eprint: 2027/123
  doi: 10.1007/...
  abstract: |
    Markdown text.
  bibtex: |
    @inproceedings{...}
```

Papers without a `venue` are listed under **Preprints**; adding the venue moves the paper
to **Published**. Your name is highlighted in author lists automatically. Other link fields:
`arxiv`, `pdf`, `code`, `slides`, `video`, `poster`, `note` (e.g. "to appear" or "Best paper
award") and `links` for anything else. Abstracts can contain LaTeX between `$…$`, as on
ePrint; it is typeset with KaTeX when a visitor opens the abstract.

### Add a talk

Add an entry to `data/talks.yaml` with `title`, `date`, `venue`, and optionally `venue_url`,
`location`, `slides` (e.g. `/slides/my-talk.pdf` with the PDF in `static/slides/`), `video` and
`paper` (a publication `id`, which adds a link to the paper).

When you give the same talk again, list its venues under `given` instead of the top-level
date and venue (see the LeOPaRd entry and the example at the top of the file). The talk is
shown once, under the year of its most recent venue, with one line per venue; a recording
or slides that belong to one venue go on that venue's line.

## Teaching, supervision and other sections

Both sections are ready but hidden: a section appears on the homepage as soon as its data
file has an entry. Open `data/teaching.yaml` or `data/supervision.yaml`, uncomment the
example and edit it. Then, if you like, add a menu entry in `hugo.yaml`
(`url: /#teaching` or `/#supervision`). The order of homepage sections is
`params.sections` in `hugo.yaml`.

To give a list its own page instead, create a Markdown page and put the list in it with a
shortcode, e.g. `content/teaching.md`:

```markdown
---
title: Teaching
---
Courses I have taught.

{{< teaching >}}
```

The shortcodes are `{{< publications >}}`, `{{< talks >}}`, `{{< teaching >}}` and
`{{< supervision >}}`. Any other Markdown file in `content/` becomes a plain page as well.

## Blog

The blog is switched off: `content/blog/_index.md` is a draft. To switch it on:

1. Delete the `draft: true` line in `content/blog/_index.md`.
2. Uncomment the "Blog" entry under `menus.main` in `hugo.yaml`.
3. Write posts as Markdown files in `content/blog/`. `content/blog/example-post.md` is a
   draft that shows the available formatting; delete it once you have real posts.

Posts support LaTeX math (add `math: true` to the front matter; KaTeX is self-hosted),
highlighted code, footnotes, tables and an optional table of contents (`toc: true`).
The blog gets an RSS feed at `/blog/index.xml`.

Dates without a time are read as midnight UTC, and Hugo does not publish posts dated in
the future, so a post dated today may only appear once it is past midnight UTC.

## Publishing on GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and publishes it on every
push to `main`.

1. Make this folder the content of the repository that serves the site (for example
   `etairi.github.io`, replacing the generated files that are there now).
2. In the repository on GitHub: **Settings → Pages → Build and deployment → Source:
   GitHub Actions**.
3. On the same page, keep the custom domain `erkantairi.com` and **Enforce HTTPS**.
4. Push. The *Actions* tab shows the build; the site updates a minute later.

Pages need no build step of your own: only edit, commit and push.

### Old addresses

GitHub Pages cannot redirect on the server, so `data/redirects.yaml` lists the addresses of
the previous site (`/publication/…`, `/talk/…`). Each one is built as a small page that
forwards visitors to the matching entry on the new homepage. Add a line there whenever you
move a page.

## Layout of the code

```
hugo.yaml                 site settings, profile, menu, homepage sections
content/                  Markdown: homepage bio, blog, extra pages
data/                     publications, talks, teaching, supervision, redirects
layouts/                  HTML templates
  index.html              homepage
  _default/               page skeleton, posts and pages, lists
  partials/sections/      the homepage sections
  partials/entries/       one publication / talk / course / student
  shortcodes/             {{< publications >}} etc.
assets/css/main.css       all styles (colour tokens at the top, dark mode included)
assets/js/lattice.js      the lattice figure on the homepage
assets/js/main.js         Abstract/BibTeX toggles and the copy button
static/                   files served as they are: CV, slides, fonts, KaTeX, icons, CNAME
```

The figure on the homepage runs Lagrange–Gauss reduction on a basis of a fixed
two-dimensional lattice: every step is an integer shear, so the lattice and the shaded
cell's area stay the same while the basis gets shorter. Every basis it draws stays inside
the fully drawn dots. Clicking the figure reduces a new random basis. Visitors who prefer
reduced motion see the final state without animation.

## Credits

- Fonts: [Literata](https://github.com/googlefonts/literata) and
  [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next),
  SIL Open Font License (`static/fonts/`).
- Icons: [Simple Icons](https://simpleicons.org) (CC0) and
  [Bootstrap Icons](https://icons.getbootstrap.com) (MIT) for email, CV and LinkedIn.
- Math: [KaTeX](https://katex.org) (MIT), loaded only on pages with `math: true`.
