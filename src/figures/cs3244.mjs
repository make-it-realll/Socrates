import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 可复现的伪随机数（图里的散点、样本 hypothesis 都由它生成）
function rng(seed) {
  let s = seed >>> 0;
  const u = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
  const n = () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u());
  return { u, n };
}
const sup = (k) => String(k).split('').map((c) => (c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])).join('');

// 第 1 站：E_in 与 E_out 随 polynomial degree 的变化（python 实算：20 个 equispaced 点，σ = 0.3，重复 5000 次取平均）
const EIN = [0.5605, 0.3132, 0.3098, 0.0782, 0.0731, 0.0632, 0.0586, 0.0532, 0.0494, 0.0451, 0.0409, 0.0355, 0.0316, 0.0268, 0.0224, 0.0181];
const EOUT = [0.5943, 0.3016, 0.305, 0.111, 0.1148, 0.1132, 0.1174, 0.1222, 0.1265, 0.1323, 0.1382, 0.1483, 0.1652, 0.2067, 0.3424, 0.96];
function complexity() {
  const sx = lin(0, 15, 70, 520), sy = lin(0, 1, 240, 30);
  let o = axes({ sx, sy, x0: 0, x1: 15, y0: 0, y1: 1, xt: [0, 3, 5, 10, 15], yt: [0.2, 0.4, 0.6, 0.8, 1], xl: 'polynomial degree', grid: true });
  o += line(sx(0), sy(0.09), sx(15), sy(0.09), 'dash') + text(sx(15), sy(0.09) - 6, 'σ² = 0.09', 'ts', 'end');
  const pts = (arr) => arr.map((v, i) => [sx(i), sy(v)]);
  o += path(d(pts(EIN)), 'ink') + path(d(pts(EOUT)), 'ln');
  EIN.forEach((v, i) => { o += circle(sx(i), sy(v), 2.6, 'ink-f'); });
  EOUT.forEach((v, i) => { o += circle(sx(i), sy(v), 3, 'ln-f'); });
  o += text(sx(13.4), sy(0.93), 'E_out（新的点）', 'tl', 'end');
  o += line(sx(10), sy(0.33) + 4, sx(10), sy(0.041) - 3, 'mute') + text(sx(10), sy(0.33), 'E_in（training set）', 'tb', 'middle');
  o += line(sx(3), sy(0.111) - 6, sx(3), sy(0.5), 'mute') + text(sx(3) + 6, sy(0.5) + 2, 'degree 3：E_out 最小，0.111', 'ts');
  o += text(64, 20, 'mean squared error', 'ts');
  return svg(560, 278, o, 'Training error 随 polynomial degree 增大一路下降，test error 先下降，在 degree 3 达到最小，之后上升，degree 15 时接近 1');
}

// 第 1 站：只有两个点时，H0（常数）与 H1（直线）各自的 average hypothesis 与它周围的 spread
function sinfit() {
  let o = '';
  const R = rng(11);
  const pairs = Array.from({ length: 7 }, () => [2 * R.u() - 1, 2 * R.u() - 1]);
  const clipLine = (a, b, sx, sy, cls) => {
    // y = a x + b，x ∈ [−1, 1]，裁到 y ∈ [−2.6, 2.6]
    let x0 = -1, x1 = 1;
    const lo = -2.6, hi = 2.6;
    if (Math.abs(a) > 1e-9) {
      const xa = (lo - b) / a, xb = (hi - b) / a;
      x0 = Math.max(x0, Math.min(xa, xb)); x1 = Math.min(x1, Math.max(xa, xb));
    }
    if (x1 > x0) o += line(sx(x0), sy(a * x0 + b), sx(x1), sy(a * x1 + b), cls);
  };
  const panel = (x0, title, sub, gbar, sd, fit) => {
    const sx = lin(-1, 1, x0, x0 + 220), sy = lin(-2.6, 2.6, 240, 40);
    o += rect(x0, 40, 220, 200, 'frame') + line(x0, sy(0), x0 + 220, sy(0), 'grid');
    const up = (x) => gbar(x) + sd(x), dn = (x) => gbar(x) - sd(x);
    const band = [];
    for (let i = 0; i <= 80; i++) { const x = -1 + i / 40; band.push([sx(x), sy(Math.min(2.6, up(x)))]); }
    for (let i = 80; i >= 0; i--) { const x = -1 + i / 40; band.push([sx(x), sy(Math.max(-2.6, dn(x)))]); }
    o += path(d(band) + 'Z', 'wash');
    for (const [p, q] of pairs) { const [a, b] = fit(p, q); clipLine(a, b, sx, sy, 'mute'); }
    o += path(curve((x) => Math.sin(Math.PI * x), -1, 1, sx, sy), 'dash') + path(curve(gbar, -1, 1, sx, sy), 'ln');
    o += text(x0 + 110, 16, title, 'tb', 'middle') + text(x0 + 110, 32, sub, 'ts', 'middle');
    o += text(x0, 256, '−1', 'ts', 'middle') + text(x0 + 220, 256, '1', 'ts', 'middle') + text(x0 - 5, sy(0) + 4, '0', 'ts', 'end') + text(x0 - 5, sy(2) + 4, '2', 'ts', 'end') + text(x0 - 5, sy(-2) + 4, '−2', 'ts', 'end');
  };
  const f = (x) => Math.sin(Math.PI * x);
  panel(45, 'H₀：h(x) = b', 'bias 0.50，var 0.25，合计 0.75', () => 0, () => 0.5, (p, q) => [0, (f(p) + f(q)) / 2]);
  panel(315, 'H₁：h(x) = ax + b', 'bias 0.21，var 1.68，合计 1.88', (x) => 0.776 * x, (x) => Math.sqrt(2.296 * x * x + 0.911), (p, q) => { const a = (f(q) - f(p)) / (q - p); return [a, f(p) - a * p]; });
  o += text(280, 280, '虚线是 target sin(πx)，彩线是 average hypothesis ḡ(x)，浅色带是 ḡ(x) ± 一个 standard deviation，', 'ts', 'middle');
  o += text(280, 296, '灰线是 7 组随机抽的两个点各自 fit 出的 hypothesis', 'ts', 'middle');
  return svg(560, 306, o, '用两个点学 sin(πx)：constant model 的平均偏得多但很稳定，line model 平均更准但每次 fit 出来差别极大');
}

// 第 1 站：linear regression 的 learning curve（degree-5 polynomial，σ² = 0.09）
const LC = [[8, 0.0226, 0.1574], [10, 0.0363, 0.1446], [12, 0.045, 0.1346], [15, 0.054, 0.1256], [20, 0.063, 0.1173], [30, 0.0721, 0.1078], [50, 0.0792, 0.1008], [100, 0.0847, 0.0951]];
function learncurve() {
  const sx = logx(8, 100, 70, 520), sy = lin(0, 0.17, 240, 30), s2 = 0.09, p = 6;
  let o = axes({ sx, sy, x0: 8, x1: 100, y0: 0, y1: 0.17, xt: [8, 10, 15, 20, 30, 50, 100], yt: [[0.03, '0.03'], [0.06, '0.06'], [0.09, '0.09'], [0.12, '0.12'], [0.15, '0.15']], xl: 'N（log scale）', grid: true });
  o += line(sx(8), sy(s2), sx(100), sy(s2), 'dash');
  const fc = (fn) => { const pts = []; for (let i = 0; i <= 200; i++) { const N = 8 * Math.pow(100 / 8, i / 200); pts.push([sx(N), sy(fn(N))]); } return d(pts); };
  o += path(fc((N) => s2 * (1 + p / N)), 'ln') + path(fc((N) => s2 * (1 - p / N)), 'ink');
  for (const [N, ein, et] of LC) o += circle(sx(N), sy(et), 3.6, 'paper') + circle(sx(N), sy(ein), 3.6, 'paper');
  o += text(sx(11), sy(0.155), 'E_test = σ²(1 + 6/N)', 'tl');
  o += text(sx(11.5), sy(0.03), 'E_in = σ²(1 − 6/N)', 't');
  o += text(sx(8) + 6, sy(s2) - 6, 'σ² = 0.09', 'ts');
  o += text(64, 20, 'mean squared error', 'ts');
  o += text(295, 294, 'Curve 是 formula，空心点是重复 20000 次的平均；两条 curve 之差是 2σ²·6/N', 'ts', 'middle');
  return svg(560, 304, o, 'Degree-5 polynomial 的 learning curve：training error 从下方、test error 从上方，都以 1/N 的速度趋向 noise 的 variance');
}

// 第 2 站：growth function
function growth() {
  const sx = lin(1, 10, 70, 410), sy = lin(0, 10.3, 240, 26);
  const L2 = (v) => sy(Math.log2(v));
  let o = '';
  for (let k = 0; k <= 10; k += 2) o += line(sx(1), L2(2 ** k), sx(10), L2(2 ** k), 'grid') + text(64, L2(2 ** k) + 4, String(2 ** k), 'ts', 'end');
  for (let n = 1; n <= 10; n++) o += line(sx(n), sy(0), sx(n), sy(0) + 4, 'axis') + text(sx(n), sy(0) + 17, String(n), 'ts', 'middle');
  o += line(sx(1), sy(0), sx(10), sy(0), 'axis') + line(sx(1), sy(0), sx(1), sy(10.3), 'axis');
  const ser = (fn, cls, dot) => {
    let s = path(d(Array.from({ length: 10 }, (_, i) => [sx(i + 1), L2(fn(i + 1))])), cls);
    if (dot) for (let n = 1; n <= 10; n++) s += circle(sx(n), L2(fn(n)), 2.8, dot);
    return s;
  };
  const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1); return r; };
  o += ser((n) => 2 ** n, 'dash', null);
  o += ser((n) => C(n, 0) + C(n, 1) + C(n, 2) + C(n, 3), 'mute', null);
  o += ser((n) => n * n - n + 2, 'ln', 'ln-f');
  o += ser((n) => (n * n) / 2 + n / 2 + 1, 'ink', 'ink-f');
  o += ser((n) => n + 1, 'ink', 'paper');
  const lab = (n, v, s, cls) => text(sx(10) + 8, L2(v) + 4, s, cls);
  o += lab(10, 1024, '2ᴺ = 1024', 'ts');
  o += text(sx(10) + 8, L2(176) - 4, 'bound Σᵢ₌₀³ C(N,i)', 'ts') + text(sx(10) + 8, L2(176) + 10, '= 176', 'ts');
  o += text(sx(10) + 8, L2(92) + 10, '2D perceptron：92', 'tl');
  o += text(sx(10) + 8, L2(56) + 12, 'interval：56', 't');
  o += text(sx(10) + 8, L2(11) + 4, 'ray：11', 't');
  o += line(sx(3.2), L2(150), sx(3.93), L2(15.5), 'mute') + text(sx(3.2), L2(150) - 6, 'N = 4：14 < 16', 'tl', 'middle');
  o += text(64, 16, 'm_H(N)（log scale）', 'ts') + text(sx(10), sy(0) + 34, 'N', 'ts', 'end');
  return svg(560, 284, o, '三种 hypothesis set 的 growth function 与 2 的 N 次方的对比：有 break point 的都只按 polynomial 增长');
}

// 第 3 站：L2 与 L1 constraint 下的 solution
function l1l2() {
  const Q = [[1, 0.5], [0.5, 1]], wh = [2, 0.6];
  const e1 = [Math.SQRT1_2, Math.SQRT1_2], e2 = [Math.SQRT1_2, -Math.SQRT1_2], l1 = 1.5, l2 = 0.5;
  let o = '';
  const panel = (x0, title, region, sol, note) => {
    const sx = lin(-1.3, 2.9, x0, x0 + 230), sy = lin(-1.3, 1.9, 235, 60);
    o += line(sx(-1.3), sy(0), sx(2.9), sy(0), 'axis') + line(sx(0), sy(-1.3), sx(0), sy(1.9), 'axis');
    o += path(d(region.map(([a, b]) => [sx(a), sy(b)])) + 'Z', 'wash ink-s');
    for (const c of [0.3, 0.8, sol[2]]) {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const t = (2 * Math.PI * i) / 160, a = Math.sqrt(c / l1) * Math.cos(t), b = Math.sqrt(c / l2) * Math.sin(t);
        pts.push([sx(wh[0] + a * e1[0] + b * e2[0]), sy(wh[1] + a * e1[1] + b * e2[1])]);
      }
      o += path(d(pts), c === sol[2] ? 'ln' : 'mute');
    }
    o += circle(sx(wh[0]), sy(wh[1]), 3.5, 'ink-f') + text(sx(wh[0]) + 6, sy(wh[1]) - 6, 'ŵ', 'tb');
    o += circle(sx(sol[0]), sy(sol[1]), 5, 'ln-f');
    o += text(sx(-1.3), sy(0) + 16, 'w₁', 'ts') + text(sx(0) - 6, sy(1.9) + 4, 'w₂', 'ts', 'end');
    o += text(x0 + 115, 18, title, 'tb', 'middle') + text(x0 + 115, 36, note, 'ts', 'middle');
  };
  const circ = Array.from({ length: 121 }, (_, i) => [Math.cos((2 * Math.PI * i) / 120), Math.sin((2 * Math.PI * i) / 120)]);
  panel(30, 'L2：‖w‖₂ ≤ 1', circ, [0.8697, 0.4935, 1.4092], 'solution (0.870, 0.494)，两个都不是 0');
  panel(305, 'L1：|w₁| + |w₂| ≤ 1', [[1, 0], [0, 1], [-1, 0], [0, -1]], [1, 0, 1.96], 'solution (1, 0)：落在 corner，w₂ = 0');
  o += text(280, 262, '灰色和彩色的 ellipse 是 loss 的 contour，中心 ŵ 是没有 regularization 时的 solution；', 'ts', 'middle');
  o += text(280, 278, '彩色那一圈是第一次碰到 constraint region 的 contour，碰到的点就是 solution', 'ts', 'middle');
  return svg(560, 288, o, '同一个 loss，在 L2 ball 上的 solution 两个 weight 都不为零，在 L1 的 diamond 上 solution 落在 corner，第二个 weight 恰好为零');
}

// 第 4 站：12 个点上的 maximum-margin separator（QP 实解：w = (−7/8, 5/8)，b = 1）
const SVP = [[1, 4], [2, 5], [1.5, 6], [3, 5.5], [2.5, 3.5], [4, 6]], SVN = [[3, 1], [4, 2], [5, 1.5], [4.5, 3], [6, 3], [5.5, 4.5]];
function svmfig() {
  const w = [-0.875, 0.625], b = 1;
  const sx = lin(0, 7, 40, 320), sy = lin(0, 7, 290, 10);
  let o = rect(sx(0), sy(7), sx(7) - sx(0), sy(0) - sy(7), 'frame');
  const hl = (c, cls) => {
    // −0.875 x + 0.625 y + 1 = c  →  y = (c − 1 + 0.875 x) / 0.625
    const y = (x) => (c - b - w[0] * x) / w[1];
    let xa = 0, xb = 7;
    xa = Math.max(xa, (0 * w[1] - c + b) / -w[0]); xb = Math.min(xb, (7 * w[1] - c + b) / -w[0]);
    o += line(sx(xa), sy(y(xa)), sx(xb), sy(y(xb)), cls);
  };
  // margin 带
  const yb = (c, x) => (c - b - w[0] * x) / w[1];
  const xr = (c, yy) => (yy * w[1] - c + b) / -w[0];
  o += poly([[sx(0), sy(yb(-1, 0))], [sx(0), sy(yb(1, 0))], [sx(xr(1, 7)), sy(7)], [sx(xr(-1, 7)), sy(7)]], 'wash');
  hl(0, 'ink-b'); hl(1, 'dash'); hl(-1, 'dash');
  for (const p of SVN) o += circle(sx(p[0]), sy(p[1]), 4.5, 'paper');
  for (const p of SVP) o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink-f');
  const sv = [[[2.5, 3.5], 'α = 37/64', -10, 4, 'end'], [[3, 1], 'α = 22/64', 12, 4, 'start'], [[5.5, 4.5], 'α = 15/64', 12, 4, 'start']];
  for (const [p, s, dx, dy, an] of sv) o += circle(sx(p[0]), sy(p[1]), 9.5, 'ln') + text(sx(p[0]) + dx, sy(p[1]) + dy, s, 'tl', an);
  o += text(340, 60, 'w = (−7/8, 5/8)，b = 1', 't') + text(340, 80, 'margin = 1/‖w‖ = 0.930', 't');
  o += text(340, 116, '圈出的 3 个点是 support vector，', 'ts') + text(340, 132, '其余 9 个点的 α 都是 0。', 'ts');
  o += text(340, 160, 'Σαᵢyᵢ = 37 − 22 − 15 = 0（单位 1/64）', 'ts');
  o += text(340, 196, '实心点 y = +1，空心点 y = −1', 'ts') + text(340, 212, '实线 wᵀx + b = 0', 'ts') + text(340, 228, '虚线 wᵀx + b = ±1', 'ts');
  return svg(560, 300, o, '十二个点上的 maximum-margin separator，三个 support vector 落在 margin 的边上，其余点在 margin 之外');
}

// 第 4 站：kernel (xᵀz)²：输入空间里的 circle 是 (x₁², x₂²) 空间里的一条 line
const KIN = [[0.5, 0.2], [-0.5, 0.2], [0.3, -0.5], [-0.3, -0.5], [0, 0.6]];
const KOUT = [[1.8, 0.4], [-1.8, 0.4], [1.0, 1.6], [-1.0, 1.6], [1.2, -1.4], [-1.2, -1.4], [0, -2.0]];
function kernel() {
  let o = '';
  { // 左：输入空间
    const sx = lin(-2.4, 2.4, 30, 250), sy = lin(-2.4, 2.4, 260, 40);
    o += line(sx(-2.4), sy(0), sx(2.4), sy(0), 'axis') + line(sx(0), sy(-2.4), sx(0), sy(2.4), 'axis');
    const circ = (r, cls) => path(d(Array.from({ length: 121 }, (_, i) => [sx(r * Math.cos((2 * Math.PI * i) / 120)), sy(r * Math.sin((2 * Math.PI * i) / 120))])) + 'Z', cls);
    o += circ(Math.sqrt(1.88), 'ink-b') + circ(Math.sqrt(0.36), 'dash') + circ(Math.sqrt(3.4), 'dash');
    for (const p of KIN) o += circle(sx(p[0]), sy(p[1]), 4.2, 'paper');
    for (const p of KOUT) o += circle(sx(p[0]), sy(p[1]), 4.2, 'ink-f');
    o += text(140, 18, '输入空间 (x₁, x₂)', 'tb', 'middle') + text(140, 34, '没有一条 line 能分开', 'ts', 'middle');
    o += text(140, 282, 'Boundary：x₁² + x₂² = 1.88', 't', 'middle');
  }
  { // 右：(x₁², x₂²)
    const sx = lin(0, 4, 320, 530), sy = lin(0, 4.2, 260, 40);
    o += axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 4.2, xt: [1, 2, 3, 4], yt: [1, 2, 3, 4] });
    const seg = (c, cls) => { const a = Math.max(0, c - 4.2), bb = Math.min(4, c); o += line(sx(a), sy(c - a), sx(bb), sy(c - bb), cls); };
    o += poly([[sx(0), sy(0.36)], [sx(0.36), sy(0)], [sx(3.4), sy(0)], [sx(0), sy(3.4)]], 'wash');
    seg(1.88, 'ink-b'); seg(0.36, 'dash'); seg(3.4, 'dash');
    for (const p of KIN) o += circle(sx(p[0] ** 2), sy(p[1] ** 2), 4.2, 'paper');
    for (const p of KOUT) o += circle(sx(p[0] ** 2), sy(p[1] ** 2), 4.2, 'ink-f');
    o += text(425, 18, '特征空间里的 (x₁², x₂²)', 'tb', 'middle') + text(425, 34, '一条 line 就分开了', 'ts', 'middle');
    o += text(sx(4), sy(0) + 30, 'x₁²', 'ts', 'end') + text(sx(0) + 6, sy(4.2) + 4, 'x₂²', 'ts');
    o += text(sx(1.18), sy(1.08), 'x₁² + x₂² = 1.88', 't');
  }
  o += text(280, 306, '实心点 y = +1，空心点 y = −1；左右对称的两个点在右图里重合。', 'ts', 'middle') + text(280, 322, '虚线是 margin 的两边：r² = 0.36 和 r² = 3.4', 'ts', 'middle');
  return svg(560, 332, o, '左图的点在平面上内外两圈，一条 line 分不开；映射到 x1 平方、x2 平方之后，内圈和外圈被一条 line 分开，回到原平面就是一个 circle');
}

// 第 5 站：B 个 tree 平均之后的 variance（python 实算：300 个 dataset × 100 棵 tree）
const BAGB = [1, 2, 5, 10, 20, 50, 100];
const BAG = { s2: 11.148, rho: 0.1147, sim: [11.169, 6.392, 3.262, 2.309, 1.784, 1.499, 1.378] };
const RF6 = { s2: 12.265, rho: 0.0775, sim: [12.241, 6.648, 3.177, 2.123, 1.523, 1.187, 1.064] };
function bagvar() {
  const sx = logx(1, 100, 70, 400), sy = (v) => lin(Math.log10(0.6), Math.log10(16), 245, 30)(Math.log10(v));
  let o = '';
  for (const v of [1, 2, 5, 10]) o += line(sx(1), sy(v), sx(100), sy(v), 'grid') + text(64, sy(v) + 4, String(v), 'ts', 'end');
  for (const B of [1, 2, 5, 10, 20, 50, 100]) o += line(sx(B), sy(0.6), sx(B), sy(0.6) + 4, 'axis') + text(sx(B), sy(0.6) + 17, String(B), 'ts', 'middle');
  o += line(sx(1), sy(0.6), sx(100), sy(0.6), 'axis') + line(sx(1), sy(0.6), sx(1), sy(16), 'axis');
  const fc = (m, cls) => { const pts = []; for (let i = 0; i <= 120; i++) { const B = Math.pow(100, i / 120); pts.push([sx(B), sy(m.rho * m.s2 + ((1 - m.rho) * m.s2) / B)]); } return path(d(pts), cls); };
  o += line(sx(1), sy(BAG.rho * BAG.s2), sx(100), sy(BAG.rho * BAG.s2), 'dash') + line(sx(1), sy(RF6.rho * RF6.s2), sx(100), sy(RF6.rho * RF6.s2), 'ln-dash');
  o += fc(BAG, 'ink') + fc(RF6, 'ln');
  BAGB.forEach((B, i) => { o += circle(sx(B), sy(BAG.sim[i]), 3.6, 'paper') + circle(sx(B), sy(RF6.sim[i]), 3.2, 'ln-f'); });
  o += text(sx(100) + 8, sy(BAG.rho * BAG.s2) - 2, 'bagging 的下限', 't') + text(sx(100) + 8, sy(BAG.rho * BAG.s2) + 13, 'ρσ² = 1.28', 'ts');
  o += text(sx(100) + 8, sy(RF6.rho * RF6.s2) + 10, 'random forest：0.95', 'tl');
  o += text(sx(7), sy(13), 'bagging：σ² = 11.15，ρ = 0.115', 't') + text(sx(7), sy(13) + 20, 'random forest（m = 6）：σ² = 12.27，ρ = 0.078', 'tl');
  o += text(64, 18, 'prediction 的 variance（log scale）', 'ts') + text(sx(100), sy(0.6) + 34, 'tree 的个数 B（log scale）', 'ts', 'end');
  return svg(560, 290, o, 'Bagging 与 random forest 的 prediction variance 随 tree 的个数下降，但分别停在 rho 乘 sigma 平方这个下限；random forest 的下限更低');
}

// 第 6 站：20 层 ReLU network（宽 256）里 activation 的 RMS（python 实算）
const INIT = {
  small: [0.114, 0.0126, 0.00147, 0.00017, 1.78e-5, 1.89e-6, 2.29e-7, 2.51e-8, 2.97e-9, 3.4e-10, 3.77e-11, 4.01e-12, 4.37e-13, 5.24e-14, 6.12e-15, 6.64e-16, 7.12e-17, 7.73e-18, 8.26e-19, 9.58e-20],
  xav: [0.709, 0.521, 0.371, 0.248, 0.175, 0.129, 0.0865, 0.0567, 0.0395, 0.0269, 0.0183, 0.013, 0.00952, 0.00597, 0.00433, 0.00304, 0.00239, 0.0018, 0.0011, 0.000771],
  he: [1, 0.98, 0.945, 0.879, 0.949, 0.959, 0.988, 0.986, 1.06, 1.03, 1, 1.01, 0.97, 0.991, 0.912, 0.931, 1.02, 1.12, 1.12, 1.15],
};
function initfig() {
  const sx = lin(1, 20, 80, 430), sy = lin(-20, 1, 245, 25);
  let o = '';
  for (const k of [0, -5, -10, -15, -20]) o += line(sx(1), sy(k), sx(20), sy(k), 'grid') + text(74, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
  for (const l of [1, 5, 10, 15, 20]) o += line(sx(l), sy(-20), sx(l), sy(-20) + 4, 'axis') + text(sx(l), sy(-20) + 17, String(l), 'ts', 'middle');
  o += line(sx(1), sy(-20), sx(20), sy(-20), 'axis') + line(sx(1), sy(-20), sx(1), sy(1), 'axis');
  const ser = (arr, cls, dot) => { let s = path(d(arr.map((v, i) => [sx(i + 1), sy(Math.log10(v))])), cls); arr.forEach((v, i) => { s += circle(sx(i + 1), sy(Math.log10(v)), 2.4, dot); }); return s; };
  o += ser(INIT.small, 'ink', 'ink-f') + ser(INIT.xav, 'mute', 'mute-f') + ser(INIT.he, 'ln', 'ln-f');
  o += text(sx(20) + 8, sy(Math.log10(1.15)) + 4, 'Var(w) = 2/n', 'tl') + text(sx(20) + 8, sy(Math.log10(1.15)) + 20, '每层 ×1', 'ts');
  o += text(sx(20) + 8, sy(Math.log10(0.000771)) + 4, 'Var(w) = 1/n', 't') + text(sx(20) + 8, sy(Math.log10(0.000771)) + 20, '每层 ×0.71', 'ts');
  o += text(sx(20) + 8, sy(-19.0) + 4, 'std(w) = 0.01', 't') + text(sx(20) + 8, sy(-19.0) + 20, '每层 ×0.11', 'ts');
  o += text(74, 16, 'activation 的 RMS（log scale）', 'ts') + text(sx(20), sy(-20) + 34, 'layer', 'ts', 'end');
  return svg(560, 290, o, '二十层 ReLU network 中 activation 的大小：weight 的 standard deviation 取 0.01 时每层缩小约九倍，取 1/n 的 variance 时每层缩小约 0.71 倍，取 2/n 时保持不变');
}

// 第 7 站：k-means 在二维 data 上的迭代（data 和迭代都在这里算）
function kmeansData() {
  const R = rng(20240607), X = [];
  const centers = [[1.5, 1.5], [4.6, 1.8], [3.0, 4.4]];
  for (const c of centers) for (let i = 0; i < 12; i++) X.push([c[0] + 0.55 * R.n(), c[1] + 0.55 * R.n()]);
  return X;
}
function kmeansfig() {
  const X = kmeansData();
  let mu = [[0.6, 4.6], [1.2, 4.0], [5.4, 0.6]];
  const assign = (mu) => X.map((p) => { let best = 0, bd = Infinity; mu.forEach((m, k) => { const dd = (p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2; if (dd < bd) { bd = dd; best = k; } }); return best; });
  const J = (c, mu) => X.reduce((s, p, i) => s + (p[0] - mu[c[i]][0]) ** 2 + (p[1] - mu[c[i]][1]) ** 2, 0);
  const snaps = [];
  let c = assign(mu);
  for (let t = 0; t < 20; t++) {
    snaps.push({ mu: mu.map((m) => m.slice()), c: c.slice(), J: J(c, mu) });
    const nm = mu.map((m, k) => { const pts = X.filter((_, i) => c[i] === k); return pts.length ? [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length] : m; });
    const nc = assign(nm);
    mu = nm;
    if (nc.every((v, i) => v === c[i])) { snaps.push({ mu: mu.map((m) => m.slice()), c: nc.slice(), J: J(nc, mu) }); break; }
    c = nc;
  }
  const show = [snaps[0], snaps[1], snaps[snaps.length - 1]];
  const titles = ['初始 μ 与第一次 assignment', '第 1 轮之后', `第 ${snaps.length - 1} 轮之后：不再变化`];
  const cls = ['ink-f', 'ln-f', 'paper'];
  let o = '';
  show.forEach((s, j) => {
    const x0 = 22 + j * 180, sx = lin(-0.2, 6.4, x0, x0 + 160), sy = lin(-0.4, 6.2, 210, 50);
    o += rect(x0, 50, 160, 160, 'frame');
    X.forEach((p, i) => { o += circle(sx(p[0]), sy(p[1]), 3.2, cls[s.c[i]]); });
    s.mu.forEach((m) => { o += rect(sx(m[0]) - 5.5, sy(m[1]) - 5.5, 11, 11, 'solid2') + line(sx(m[0]) - 3, sy(m[1]), sx(m[0]) + 3, sy(m[1]), 'ink'); });
    o += text(x0 + 80, 38, titles[j], 'tb', 'middle') + text(x0 + 80, 230, `J = ${s.J.toFixed(1)}`, 't', 'middle');
  });
  o += text(280, 18, '三种标记是三个 cluster 的 assignment，方块是 center μ', 'ts', 'middle');
  o += text(280, 256, '每一步 assignment 和每一步求 mean 都不会让 J 变大', 'ts', 'middle');
  return svg(560, 266, o, 'k-means 在三团二维 data 上的 iteration：从很差的初始 center 出发，几轮之后 center 落到三团 data 的中间，distortion J 一路下降');
}

// 第 7 站：EM 在 x = {1, 2, 3, 5, 8, 9} 上的几轮
function emfig() {
  const X = [1, 2, 3, 5, 8, 9];
  const N = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
  let th = { p: [0.5, 0.5], m: [2, 8], v: [1, 1] };
  const ll = (t) => X.reduce((s, x) => s + Math.log(t.p[0] * N(x, t.m[0], t.v[0]) + t.p[1] * N(x, t.m[1], t.v[1])), 0);
  const hist = [th];
  for (let it = 0; it < 60; it++) {
    const r = X.map((x) => { const a = th.p[0] * N(x, th.m[0], th.v[0]), b = th.p[1] * N(x, th.m[1], th.v[1]); return [a / (a + b), b / (a + b)]; });
    const nt = { p: [], m: [], v: [] };
    for (let k = 0; k < 2; k++) {
      const Nk = r.reduce((s, q) => s + q[k], 0);
      const m = r.reduce((s, q, i) => s + q[k] * X[i], 0) / Nk;
      nt.p.push(Nk / X.length); nt.m.push(m); nt.v.push(r.reduce((s, q, i) => s + q[k] * (X[i] - m) ** 2, 0) / Nk);
    }
    th = nt; hist.push(th);
  }
  const sx = lin(-1, 11, 60, 520), sy = lin(0, 0.36, 240, 30);
  let o = axes({ sx, sy, x0: -1, x1: 11, y0: 0, y1: 0.36, xt: [0, 2, 4, 6, 8, 10], yt: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3']] });
  const dens = (t) => (x) => t.p[0] * N(x, t.m[0], t.v[0]) + t.p[1] * N(x, t.m[1], t.v[1]);
  o += path(curve(dens(hist[0]), -1, 11, sx, sy, 400), 'dash') + path(curve(dens(hist[1]), -1, 11, sx, sy, 400), 'mute') + path(curve(dens(hist[hist.length - 1]), -1, 11, sx, sy, 400), 'ln');
  for (const x of X) o += circle(sx(x), sy(0), 4.5, 'ink-f');
  const T = hist[hist.length - 1];
  o += text(sx(8.6), sy(0.33), 'converged', 'tl') + text(sx(8.6), sy(0.33) + 15, `ℓ = ${ll(T).toFixed(2)}`, 'ts');
  o += text(sx(-0.7), sy(0.335), `第 0 轮（虚线）：ℓ = ${ll(hist[0]).toFixed(2)}`, 'ts') + text(sx(-0.7), sy(0.335) + 16, `第 1 轮（灰线）：ℓ = ${ll(hist[1]).toFixed(2)}`, 'ts');
  o += text(56, 18, 'mixture density p(x)', 'ts');
  o += text(290, 276, `converge 时 μ = (${T.m[0].toFixed(2)}, ${T.m[1].toFixed(2)})，σ² = (${T.v[0].toFixed(2)}, ${T.v[1].toFixed(2)})，π = (${T.p[0].toFixed(2)}, ${T.p[1].toFixed(2)})；黑点是 6 个 data point`, 'ts', 'middle');
  return svg(560, 286, o, 'EM 在六个一维 data point 上的 iteration：mixture density 从两个等宽的 Gaussian 开始，converge 时左边的 component 宽而右边的窄，log-likelihood 一路上升');
}

// 第 8 站：PCA 的第一个方向与 least squares line 的对比
function pcafig() {
  const X = [[1, 2], [2, 1], [3, 4], [4, 3], [5, 6], [6, 5]], m = [3.5, 3.5];
  const sx = lin(0, 7, 70, 330), sy = lin(0, 7, 258, 28);
  let o = axes({ sx, sy, x0: 0, x1: 7, y0: 0, y1: 7, xt: [1, 2, 3, 4, 5, 6], yt: [1, 2, 3, 4, 5, 6], xl: 'x₁', yl: 'x₂', grid: true });
  o += line(sx(0), sy(0), sx(7), sy(7), 'ln');
  const b = 29 / 35;
  o += line(sx(0), sy(m[1] - b * m[0]), sx(7), sy(m[1] + b * (7 - m[0])), 'dash');
  for (const p of X) {
    const t = (p[0] + p[1]) / 2;
    o += line(sx(p[0]), sy(p[1]), sx(t), sy(t), 'ink-b');
    o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink-f');
  }
  o += circle(sx(m[0]), sy(m[1]), 4, 'paper');
  o += text(350, 50, 'PC1：方向 (1, 1)/√2', 'tl') + text(350, 68, 'projection 的 variance λ₁ = 16/3', 'ts');
  o += text(350, 100, '粗线段：到 PC1 的 perpendicular', 'ts') + text(350, 116, 'distance，每段的 square 都是 0.5', 'ts');
  o += text(350, 148, '虚线：x₂ 对 x₁ 的 least squares', 't') + text(350, 166, 'line，slope 29/35 = 0.83', 'ts');
  o += text(350, 198, 'Least squares 量的是 vertical', 'ts') + text(350, 214, 'distance，PCA 量的是 perpendicular', 'ts') + text(350, 230, 'distance，两条 line 不一样', 'ts');
  return svg(560, 300, o, '六个点的第一个 principal component 是过 mean、方向为一比一的直线，各点到它的垂直距离相同；least squares 直线更平');
}

export default {
  'cs3244-complexity': complexity,
  'cs3244-sinfit': sinfit,
  'cs3244-learncurve': learncurve,
  'cs3244-growth': growth,
  'cs3244-l1l2': l1l2,
  'cs3244-svm': svmfig,
  'cs3244-kernel': kernel,
  'cs3244-bagvar': bagvar,
  'cs3244-init': initfig,
  'cs3244-kmeans': kmeansfig,
  'cs3244-em': emfig,
  'cs3244-pca': pcafig,
};
