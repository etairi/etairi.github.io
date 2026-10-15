// Typeset LaTeX on pages with `math: true` in their front matter (KaTeX, self-hosted in static/katex).
/* global renderMathInElement */
renderMathInElement(document.querySelector('.article-body') || document.body, {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
  ],
  throwOnError: false,
});
