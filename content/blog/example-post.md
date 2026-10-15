---
title: What a post looks like
date: 2026-10-01
# Drafts are only visible with `hugo server -D`; they are never published.
draft: true
description: A draft that shows the formatting available in posts. Delete it when you write your first post.
math: true # load KaTeX on this page
toc: true  # list the headings beside the text on wide screens
---

This draft is a reference for writing posts. Posts are Markdown files in `content/blog/`; the file name becomes the address, so this one would live at `/blog/example-post/`. Use `lede` in the front matter for an optional standfirst under the title.

## Mathematics

With `math: true` in the front matter, LaTeX is typeset by KaTeX. Inline math goes between single dollar signs, like $\mathbf{B} = [\mathbf{b}_1, \mathbf{b}_2]$, and displayed math between double ones. Write `\$` for a literal dollar sign.

The figure on the homepage runs Lagrange–Gauss reduction. Each step replaces the longer vector by

$$
\mathbf{b}_2 \leftarrow \mathbf{b}_2 - \left\lfloor \frac{\langle \mathbf{b}_1, \mathbf{b}_2 \rangle}{\lVert \mathbf{b}_1 \rVert^2} \right\rceil \mathbf{b}_1 ,
$$

then swaps the two vectors if the new one is shorter. The update is multiplication by an integer matrix of determinant one, so the lattice $\mathcal{L}(\mathbf{B})$ and the area $\lvert \det \mathbf{B} \rvert$ of the shaded cell never change.

## Code

Fenced code blocks are highlighted in both colour schemes:

```python
def gauss_reduce(b1, b2):
    """Lagrange–Gauss reduction of a basis of a 2-dimensional lattice."""
    dot = lambda u, v: u[0] * v[0] + u[1] * v[1]
    if dot(b1, b1) > dot(b2, b2):
        b1, b2 = b2, b1
    while True:
        mu = round(dot(b1, b2) / dot(b1, b1))
        b2 = (b2[0] - mu * b1[0], b2[1] - mu * b1[1])
        if dot(b2, b2) >= dot(b1, b1):
            return b1, b2
        b1, b2 = b2, b1
```

## Lists, quotes and tables

- Lists work as usual.
- So do *emphasis*, **strong text** and [links](https://eprint.iacr.org/).

> A quotation is set in italics with a rule on the left.

| Basis | Lengths | Cell area |
| --- | --- | --- |
| Start | 213, 133 | 921 |
| Reduced | 30, 33 | 921 |

## Footnotes

Footnotes are collected at the end of the post.[^1]

[^1]: Like this one.
