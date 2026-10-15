// Homepage figure: Lagrange–Gauss reduction of a basis of a two-dimensional lattice.
// Each step replaces one basis vector v by v − μu for an integer μ (a shear), so the
// lattice and the area of the shaded cell never change; only the basis gets shorter.
// Clicking the figure reduces a new random basis of the same lattice.
(() => {
  const figure = document.querySelector('[data-lattice]');
  if (!figure) return;
  const svg = figure.querySelector('svg');
  const NS = 'http://www.w3.org/2000/svg';
  const SIZE = 360;
  const MID = SIZE / 2;
  const G = [[33, 4], [9, 29]]; // a reduced basis of the lattice (y points up), det = 921
  const START = [-2, 3, 3, -4]; // first basis shown: B = U·G with det U = −1
  const INSIDE = 0.7 * MID; // dots are fully drawn up to here, and every basis drawn stays inside
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const comb = (i, j) => add(mul(G[0], i), mul(G[1], j));
  const toSvg = (p) => [MID + p[0], MID - p[1]];
  const fmt = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
  const roundHalfAway = (x) => Math.sign(x) * Math.round(Math.abs(x));
  const el = (name, attrs) => {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    return node;
  };

  // Sizes are in viewBox units; `scale` converts on-screen pixels to them, so dots and
  // arrowheads stay legible when the figure is drawn small (tablet and phone layouts).
  let scale = 1;
  const measure = () => {
    const width = svg.getBoundingClientRect().width || SIZE;
    scale = SIZE / width;
    return width;
  };

  // Lattice points in a circular window: fully drawn up to INSIDE, then fading out at the rim.
  const points = el('g', {});
  for (let i = -12; i <= 12; i++) {
    for (let j = -12; j <= 12; j++) {
      const p = comb(i, j);
      const r = Math.hypot(p[0], p[1]);
      if (r > MID) continue;
      const opacity = Math.min(1, (MID - r) / (MID - INSIDE));
      const [x, y] = toSvg(p);
      points.append(el('circle', { class: 'lat-point', cx: x.toFixed(2), cy: y.toFixed(2), opacity: opacity.toFixed(3) }));
    }
  }
  const cell = el('polygon', { class: 'lat-cell' });
  const lines = [0, 1].map(() => el('line', { class: 'lat-vec' }));
  const heads = [0, 1].map(() => el('path', { class: 'lat-head' }));
  const origin = el('circle', { class: 'lat-origin', cx: MID, cy: MID, r: 3.4 });
  svg.append(points, cell, ...lines, ...heads, origin);

  // Draw the basis (u, v): the cell they span and the two vectors as arrows.
  let current = null;
  const draw = (u, v) => {
    current = [u, v];
    cell.setAttribute('points', [[0, 0], u, add(u, v), v].map((p) => fmt(toSvg(p))).join(' '));
    [u, v].forEach((w, k) => {
      const length = Math.hypot(w[0], w[1]);
      const d = [w[0] / length, -w[1] / length]; // direction in SVG coordinates
      const n = [-d[1], d[0]];
      const tip = toSvg(w);
      const head = Math.min(7.5 * scale, length * 0.3); // shorter heads on short vectors
      const base = add(tip, mul(d, -head));
      const end = add(tip, mul(d, -head * 0.75));
      lines[k].setAttribute('x1', MID);
      lines[k].setAttribute('y1', MID);
      lines[k].setAttribute('x2', end[0].toFixed(2));
      lines[k].setAttribute('y2', end[1].toFixed(2));
      heads[k].setAttribute('d', `M${fmt(tip)} L${fmt(add(base, mul(n, head * 0.45)))} L${fmt(add(base, mul(n, -head * 0.45)))} Z`);
    });
  };

  // Lagrange–Gauss reduction, recording every shear v -> v − μu.
  const reduce = (b) => {
    let [u, v] = b;
    if (dot(u, u) > dot(v, v)) [u, v] = [v, u];
    const shears = [];
    for (let guard = 0; guard < 64; guard++) {
      const mu = roundHalfAway(dot(u, v) / dot(u, u));
      if (mu !== 0) {
        const w = add(v, mul(u, -mu));
        shears.push({ u, from: v, to: w });
        v = w;
      }
      if (dot(v, v) < dot(u, u)) [u, v] = [v, u];
      else break;
    }
    return { shears, reduced: [u, v] };
  };

  const basis = (U) => [comb(U[0], U[1]), comb(U[2], U[3])];

  // A random unimodular start whose reduction takes at least two shears and whose every
  // drawn cell, from start to finish, stays among the fully drawn dots.
  const randomStart = () => {
    for (let tries = 0; tries < 4000; tries++) {
      const U = Array.from({ length: 4 }, () => Math.floor(Math.random() * 11) - 5);
      if (Math.abs(U[0] * U[3] - U[1] * U[2]) !== 1) continue;
      const b = basis(U);
      const { shears } = reduce(b);
      if (shears.length < 2) continue;
      const corners = [b[0], b[1], add(b[0], b[1])];
      for (const s of shears) corners.push(s.from, s.to, add(s.u, s.from), add(s.u, s.to));
      if (corners.every((p) => Math.hypot(p[0], p[1]) <= INSIDE)) return U;
    }
    return START;
  };

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  let run = 0;
  const sleep = (ms, id) => new Promise((resolve) => setTimeout(() => resolve(id === run), ms));
  const tween = (ms, frame, id) => new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      if (id !== run) return resolve(false);
      const t = Math.min(1, (now - t0) / ms);
      frame(ease(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve(true);
    };
    requestAnimationFrame(step);
  });

  const play = async (U) => {
    const id = ++run;
    const b = basis(U);
    const { shears, reduced } = reduce(b);
    if (reduceMotion.matches) {
      draw(...reduced);
      return;
    }
    draw(...b);
    if (!(await sleep(650, id))) return;
    for (const s of shears) {
      const delta = add(s.to, mul(s.from, -1));
      if (!(await tween(1050, (t) => draw(s.u, add(s.from, mul(delta, t))), id))) return;
      if (!(await sleep(200, id))) return;
    }
  };

  const resize = () => {
    const width = measure();
    const dot = (1.6 + 0.5 * Math.min(1, width / 352)) * scale;
    for (const c of points.children) c.setAttribute('r', dot.toFixed(2));
    origin.setAttribute('r', ((2.6 + 0.8 * Math.min(1, width / 352)) * scale).toFixed(2));
    if (current) draw(...current);
  };
  resize();
  new ResizeObserver(resize).observe(svg);

  // Start once the figure is on screen; show the long basis until then.
  if (reduceMotion.matches) {
    draw(...reduce(basis(START)).reduced);
  } else {
    draw(...basis(START));
    figure.classList.add('is-interactive');
    figure.addEventListener('click', () => play(randomStart()));
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      setTimeout(() => play(START), 300);
    }, { threshold: 0.5 });
    observer.observe(figure);
  }
})();
