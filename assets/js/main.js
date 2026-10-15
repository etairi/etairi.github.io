// Small enhancements: Abstract/BibTeX toggles, copy-to-clipboard for BibTeX, and LaTeX
// in abstracts (KaTeX from static/katex, fetched only when such an abstract is opened).
(() => {
  document.documentElement.classList.add('js');

  let katex;
  const load = (tag, attrs) => new Promise((resolve, reject) => {
    const node = Object.assign(document.createElement(tag), attrs, { onload: resolve, onerror: reject });
    document.head.append(node);
  });
  const loadKatex = () => {
    if (!katex) katex = load('link', { rel: 'stylesheet', href: '/katex/katex.min.css' })
      .then(() => load('script', { src: '/katex/katex.min.js' }))
      .then(() => load('script', { src: '/katex/contrib/auto-render.min.js' }));
    return katex;
  };
  const typeset = (panel) => {
    if (panel.dataset.typeset) return;
    panel.dataset.typeset = 'yes';
    loadKatex().then(() => window.renderMathInElement(panel, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    }));
  };

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('.toggle[aria-controls]');
    if (toggle) {
      const panel = document.getElementById(toggle.getAttribute('aria-controls'));
      if (!panel) return;
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (open && panel.hasAttribute('data-math')) typeset(panel);
      return;
    }

    const copy = event.target.closest('.copy');
    if (copy && navigator.clipboard) {
      const code = copy.parentElement.querySelector('code');
      if (!code) return;
      if (!copy.dataset.label) copy.dataset.label = copy.textContent;
      navigator.clipboard.writeText(code.textContent).then(() => {
        copy.textContent = copy.dataset.copied || 'Copied';
        clearTimeout(copy.resetTimer);
        copy.resetTimer = setTimeout(() => { copy.textContent = copy.dataset.label; }, 1600);
      });
    }
  });
})();
