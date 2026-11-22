import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, acircle, ashow } from '../lib/svg.mjs';

const sup = (k) => String(k).split('').map((c) => (c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])).join('');

// 把一串点画成折线，落在 box 外的点处断开（用来裁掉出界的 curve）
function clipped(pts, box, cls) {
  const [x0, y0, x1, y1] = box;
  const inside = ([x, y]) => x >= x0 - 0.5 && x <= x1 + 0.5 && y >= y0 - 0.5 && y <= y1 + 0.5;
  let o = '', run = [];
  for (const p of pts) {
    if (inside(p)) run.push(p);
    else { if (run.length > 1) o += path(d(run), cls); run = []; }
  }
  if (run.length > 1) o += path(d(run), cls);
  return o;
}

// 第 1 站：tail probability 的三种估计（p = 0.5，ε = 0.05；真实值由 scipy 的 binomial 实算）
const TAIL_M = [100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000];
const TAIL_X = [0.3682, 0.2205, 0.179, 0.0939, 0.05104, 0.02833, 0.01594, 0.009061, 0.005189, 0.002989, 0.001731, 0.0005864, 0.000201, 6.948e-5, 2.418e-5, 8.457e-6];
function tail() {
  const sx = lin(100, 2000, 70, 520), sy = lin(-5.3, 0.25, 235, 30);
  let o = '';
  for (let k = 0; k >= -5; k--) o += line(sx(100), sy(k), sx(2000), sy(k), 'grid') + text(64, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
  for (const m of [100, 500, 1000, 1500, 2000]) o += line(sx(m), sy(-5.3), sx(m), sy(-5.3) + 4, 'axis') + text(sx(m), 252, String(m), 'ts', 'middle');
  o += line(sx(100), sy(-5.3), sx(2000), sy(-5.3), 'axis') + line(sx(100), sy(-5.3), sx(100), sy(0.25), 'axis');
  const lg = (v) => Math.log10(Math.min(v, 1));
  o += path(curve((m) => lg(100 / m), 100, 2000, sx, sy), 'mute');
  o += path(curve((m) => lg(2 * Math.exp(-m / 200)), 100, 2000, sx, sy), 'ln');
  o += path(d(TAIL_M.map((m, i) => [sx(m), sy(Math.log10(TAIL_X[i]))])), 'ink-b');
  TAIL_M.forEach((m, i) => { o += circle(sx(m), sy(Math.log10(TAIL_X[i])), 2.5, 'ink-f'); });
  o += text(sx(1980), sy(Math.log10(100 / 1980)) - 8, 'Chebyshev：100 / m', 't', 'end');
  o += text(sx(1990) - 46, sy(-2.7), 'Hoeffding：2e', 'tl', 'end') + text(sx(1990) - 46, sy(-2.7) - 7, '−m/200', 'ts');
  o += text(sx(560), sy(-3.55), '真实值：', 'tb') + text(sx(560), sy(-3.55) + 17, 'P(|mean − 0.5| ≥ 0.05)', 'ts');
  o += text(520, 270, 'm（example 个数）', 'ts', 'end') + text(70, 18, 'probability（log scale）', 'ts');
  return svg(560, 280, o, 'Tail probability 随 sample 个数的变化：Chebyshev 的 bound 只按 1/m 下降，Hoeffding 的 bound 和真实值一样按 exponential 下降');
}

// 第 2 站：三个点的 8 种 labeling 都能被 line 分开；四个点的 XOR 分不开
function shatter() {
  let o = '';
  const P = [[0.2, 0.72], [0.82, 0.62], [0.42, 0.18]];
  const cw = 76, ch = 74, gx = 10, gy = 12, X0 = 14, Y0 = 26;
  const clipSeg = (a, b) => {
    // 直线 a + s(b − a) 与 [0.03, 0.97]² 的交
    let lo = -1e9, hi = 1e9;
    for (let k = 0; k < 2; k++) {
      const dk = b[k] - a[k];
      if (Math.abs(dk) < 1e-12) continue;
      const s1 = (0.03 - a[k]) / dk, s2 = (0.97 - a[k]) / dk;
      lo = Math.max(lo, Math.min(s1, s2)); hi = Math.min(hi, Math.max(s1, s2));
    }
    return [[a[0] + lo * (b[0] - a[0]), a[1] + lo * (b[1] - a[1])], [a[0] + hi * (b[0] - a[0]), a[1] + hi * (b[1] - a[1])]];
  };
  for (let L = 0; L < 8; L++) {
    const col = L % 4, row = Math.floor(L / 4);
    const cx = X0 + col * (cw + gx), cy = Y0 + row * (ch + gy);
    const M = ([u, v]) => [cx + u * cw, cy + v * ch];
    const lab = [L & 1, (L >> 1) & 1, (L >> 2) & 1];
    o += rect(cx, cy, cw, ch, 'frame', 4);
    const ones = lab.reduce((s, v) => s + v, 0);
    let seg;
    if (ones === 0 || ones === 3) seg = [[0.08, 0.93], [0.6, 0.97]];
    else {
      const odd = lab.findIndex((v) => v === (ones === 1 ? 1 : 0));
      const others = [0, 1, 2].filter((i) => i !== odd);
      const m1 = [(P[odd][0] + P[others[0]][0]) / 2, (P[odd][1] + P[others[0]][1]) / 2];
      const m2 = [(P[odd][0] + P[others[1]][0]) / 2, (P[odd][1] + P[others[1]][1]) / 2];
      seg = clipSeg(m1, m2);
    }
    const [a, b] = seg.map(M);
    o += line(a[0], a[1], b[0], b[1], 'ln');
    P.forEach((p, i) => { const q = M(p); o += circle(q[0], q[1], 5, lab[i] ? 'ink-f' : 'ink paper-f'); });
  }
  o += text(X0 + (4 * cw + 3 * gx) / 2, 16, '3 个点：8 种 labeling 都有一条 line 分开', 'tb', 'middle');
  const qx = 400, qy = 60, s = 110;
  const Q = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => [qx + u * s, qy + v * s]);
  o += line(Q[0][0], Q[0][1], Q[2][0], Q[2][1], 'dash') + line(Q[1][0], Q[1][1], Q[3][0], Q[3][1], 'dash');
  o += circle(qx + s / 2, qy + s / 2, 3, 'ln-f') + text(qx + s / 2 + 8, qy + s / 2 + 4, 'z', 'tl');
  Q.forEach((q, i) => { o += circle(q[0], q[1], 6, i % 2 === 0 ? 'ink-f' : 'ink paper-f'); });
  o += text(qx + s / 2, 16, '4 个点：这种 labeling 分不开', 'tb', 'middle');
  o += text(qx + s / 2, qy + s + 32, '两条 diagonal 交于 z：', 't', 'middle') + text(qx + s / 2, qy + s + 50, 'z 必须同时在 line 的两侧', 't', 'middle');
  o += text(280, 222, '实心点 label 为 1，空心点 label 为 0', 'ts', 'middle');
  return svg(560, 232, o, '左边八个小图是三个点的八种 labeling，每种都有一条 line 把 label 1 和 label 0 分开；右边四个点在 convex position，对角线上的两点同色时，任何 line 都分不开');
}

// 第 3 站：连续 threshold 的 Rademacher complexity（Monte Carlo，python 实算）与 Massart bound
const RAD_M = [10, 30, 100, 300, 1000, 3000];
const RAD_V = [0.208, 0.1303, 0.0755, 0.0444, 0.0246, 0.0144];
function radfig() {
  const sx = logx(10, 3000, 80, 520), sy = (v) => lin(-2, 0, 235, 30)(Math.log10(v));
  let o = '';
  for (const v of [0.01, 0.03, 0.1, 0.3, 1]) o += line(80, sy(v), 520, sy(v), 'grid') + text(74, sy(v) + 4, String(v), 'ts', 'end');
  for (const m of [10, 30, 100, 300, 1000, 3000]) o += line(sx(m), 235, sx(m), 239, 'axis') + text(sx(m), 253, String(m), 'ts', 'middle');
  o += line(80, 235, 520, 235, 'axis') + line(80, 235, 80, 30, 'axis');
  const pts = [];
  for (let i = 0; i <= 120; i++) { const m = 10 * Math.pow(300, i / 120); pts.push([sx(m), sy(Math.sqrt((2 * Math.log(m + 1)) / m))]); }
  o += path(d(pts), 'ln');
  o += path(d(RAD_M.map((m, i) => [sx(m), sy(RAD_V[i])])), 'ink');
  RAD_M.forEach((m, i) => { o += circle(sx(m), sy(RAD_V[i]), 3.5, 'ink-f'); });
  o += text(sx(140), sy(0.33), 'Massart：√(2 ln(m+1) / m)', 'tl');
  o += text(sx(25), sy(0.047), 'Monte Carlo 实算值', 't');
  o += text(sx(1000), sy(0.0246) - 12, '0.0246', 'ts', 'middle') + text(sx(1000), sy(0.1175) - 10, '0.118', 'ts', 'middle');
  o += text(520, 272, 'm（log scale）', 'ts', 'end') + text(80, 18, 'Rademacher complexity（log scale）', 'ts');
  return svg(560, 280, o, '连续 threshold 的 Rademacher complexity 随 m 下降，Monte Carlo 实算值始终低于 Massart 的 upper bound，在 m 等于 1000 时约低五倍');
}

// 第 3 站：0-1 loss、ramp loss、hinge loss
function ramp() {
  const sx = lin(-1.5, 2.2, 70, 520), sy = lin(-0.1, 2.6, 225, 30);
  let o = axes({ sx, sy, x0: -1.5, x1: 2.2, y0: 0, y1: 2.6, xt: [[-1, '−1'], [0, '0'], [1, 'γ'], [2, '2γ']], yt: [1, 2], grid: true });
  o += line(sx(0), sy(-0.1), sx(0), sy(2.6), 'axis');
  o += path(curve((t) => Math.max(0, 1 - t), -1.5, 2.2, sx, sy), 'dash');
  o += path(d([[sx(-1.5), sy(1)], [sx(0), sy(1)], [sx(1), sy(0)], [sx(2.2), sy(0)]]), 'ln');
  o += path(d([[sx(-1.5), sy(1)], [sx(0), sy(1)]]), 'ink') + path(d([[sx(0), sy(0)], [sx(2.2), sy(0)]]), 'ink');
  o += circle(sx(0), sy(1), 3.5, 'ink-f') + circle(sx(0), sy(0), 3.5, 'ink paper-f');
  o += text(sx(0.12), sy(2.3), 'hinge（虚线）：max(0, 1 − t/γ)', 't');
  o += text(sx(-1.45), sy(0.55), 't ≤ 0 时 0-1 loss 与', 'ts') + text(sx(-1.45), sy(0.55) + 16, 'ramp loss 都是 1', 'ts');
  o += text(sx(0.55), sy(0.62), 'ramp loss：slope −1/γ', 'tl');
  o += text(sx(1.25), sy(0) - 10, '三者在 t ≥ γ 时都是 0', 'ts');
  o += text(520, 258, 't = y⟨w, x⟩', 'ts', 'end');
  return svg(560, 266, o, 'Ramp loss 在 t 小于等于 0 时等于 1，在 0 到 gamma 之间线性下降到 0；它处处不小于 0-1 loss，并且不超过 hinge loss');
}

// 第 4 站：gradient descent 在 f = (10x₁² + x₂²)/2 上的路径
function gd() {
  let o = '';
  const panel = (X0, t, steps, title, note) => {
    const W = 240, H = 190, Y0 = 40;
    const sx = lin(-1.9, 1.9, X0, X0 + W), sy = lin(-0.35, 1.2, Y0 + H, Y0);
    const box = [X0, Y0, X0 + W, Y0 + H];
    o += rect(X0, Y0, W, H, 'frame');
    o += line(sx(-1.9), sy(0), sx(1.9), sy(0), 'grid') + line(sx(0), sy(-0.35), sx(0), sy(1.2), 'grid');
    for (const c of [0.1, 0.5, 1.5, 5.5, 12]) {
      const pts = [];
      for (let i = 0; i <= 360; i++) { const a = (2 * Math.PI * i) / 360; pts.push([sx(Math.sqrt(c / 5) * Math.cos(a)), sy(Math.sqrt(2 * c) * Math.sin(a))]); }
      o += clipped(pts, box, 'mute');
    }
    let x = [1, 1];
    const ps = [x];
    for (let k = 0; k < steps; k++) { x = [x[0] - t * 10 * x[0], x[1] - t * x[1]]; ps.push(x); }
    for (let k = 0; k < ps.length - 1; k++) o += arrow(sx(ps[k][0]), sy(ps[k][1]), sx(ps[k + 1][0]), sy(ps[k + 1][1]), 'ln', 5);
    o += circle(sx(1), sy(1), 4, 'ink-f') + text(sx(1) + 7, sy(1) - 6, 'x₀', 'ts');
    o += circle(sx(0), sy(0), 3.5, 'ink paper-f');
    o += text(X0 + W / 2, 18, title, 'tb', 'middle') + text(X0 + W / 2, 34, note, 'ts', 'middle');
    o += text(X0 + W, Y0 + H + 16, 'x₁', 'ts', 'end') + text(sx(0) + 5, Y0 + 12, 'x₂', 'ts');
  };
  panel(30, 2 / 11, 24, 't = 2/11：zigzag 地 converge', 'x₁ 每步乘 −9/11，x₂ 每步乘 9/11');
  panel(290, 0.21, 6, 't = 0.21：diverge', 'x₁ 每步乘 −1.1，越弹越远');
  o += text(280, 268, '灰色 ellipse 是 f 的 contour；实心点是 x₀ = (1, 1)，空心点是 minimum (0, 0)', 'ts', 'middle');
  return svg(560, 278, o, '在一个 ill-conditioned 的 quadratic function 上做 gradient descent：step size 为 2/11 时路径来回穿过谷底并 converge，step size 为 0.21 时来回的幅度越来越大');
}

// 第 5 站：Perceptron 在四个点上的四次更新
function perc() {
  const S = 31, O = [125, 200];
  const P = ([x, y]) => [O[0] + x * S, O[1] - y * S];
  let o = '';
  for (let g = -2; g <= 3; g++) o += line(P([g, -2.4])[0], P([g, -2.4])[1], P([g, 5.6])[0], P([g, 5.6])[1], 'grid');
  for (let g = -2; g <= 5; g++) o += line(P([-2.6, g])[0], P([-2.6, g])[1], P([3.6, g])[0], P([3.6, g])[1], 'grid');
  o += line(P([-2.6, 0])[0], O[1], P([3.6, 0])[0], O[1], 'ln-dash');
  o += line(O[0], P([0, -2.4])[1], O[0], P([0, 5.6])[1], 'axis');
  const W = [[1, 2], [-1, 3], [2, 4], [0, 5]];
  W.forEach((w, i) => { const q = P(w); o += arrow(O[0], O[1], q[0], q[1], i === 3 ? 'ln' : 'ink', 6); });
  o += text(P([1, 2])[0] + 6, P([1, 2])[1] + 2, 'w₁', 'tb');
  o += text(P([-1, 3])[0] - 6, P([-1, 3])[1] - 2, 'w₂', 'tb', 'end');
  o += text(P([2, 4])[0] + 6, P([2, 4])[1] + 4, 'w₃', 'tb');
  o += text(P([0, 5])[0] + 7, P([0, 5])[1] + 4, 'w₄ = (0, 5)', 'tl');
  const X = [[[1, 2], 1, 'x₁'], [[3, 1], 1, 'x₂'], [[-1, -2], -1, 'x₃'], [[2, -1], -1, 'x₄']];
  for (const [p, y, n] of X) { const q = P(p); o += circle(q[0], q[1], 5.5, y > 0 ? 'ink-f' : 'ink paper-f'); o += text(q[0] + 9, q[1] + (p[1] < -1.5 ? 4 : 15), n, 't'); }
  o += text(P([-2.5, 0])[0], O[1] - 6, 'boundary', 'ts');
  const tx = 300;
  o += text(tx, 40, '实心 label +1，空心 label −1', 'ts');
  o += text(tx, 66, 'w* = (0, 1)，γ = 1，R = √10', 't');
  o += text(tx, 92, 'bound：(R/γ)² = 10', 't');
  o += text(tx, 126, 'k', 'tb') + text(tx + 50, 126, '⟨w*, wₖ⟩', 'tb') + text(tx + 140, 126, '‖wₖ‖²', 'tb');
  [[1, 2, 5], [2, 3, 10], [3, 4, 20], [4, 5, 25]].forEach(([k, a, b], i) => {
    const y = 150 + i * 22;
    o += text(tx, y, String(k), 't') + text(tx + 50, y, `${a} ≥ ${k}`, 't') + text(tx + 140, y, `${b} ≤ ${10 * k}`, 't');
  });
  o += text(tx, 252, '4 次更新后全部分对', 'tl');
  return svg(560, 278, o, 'Perceptron 在四个点上的四次更新：weight vector 从 (1, 2) 经 (−1, 3)、(2, 4) 转到 (0, 5)，与 w* 的方向一致，decision boundary 是横轴');
}

// 第 5 站：交替 loss 上 follow-the-leader 与 Hedge 的累计 regret（T = 1000）
function regret() {
  const T = 1000, eta = Math.sqrt((8 * Math.log(2)) / T);
  const sx = lin(0, 1000, 70, 520), sy = lin(0, 25, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1000, y0: 0, y1: 25, xt: [0, 250, 500, 750, 1000], yt: [5, 10, 15, 20, 25], grid: true });
  const cum = [0, 0];
  let tot = 0;
  const hp = [[sx(0), sy(0)]];
  for (let t = 0; t < T; t++) {
    const l = t % 2 === 0 ? [1, 0] : [0, 1];
    const mn = Math.min(cum[0], cum[1]);
    const w0 = Math.exp(-eta * (cum[0] - mn)), w1 = Math.exp(-eta * (cum[1] - mn));
    tot += (w0 * l[0] + w1 * l[1]) / (w0 + w1);
    cum[0] += l[0]; cum[1] += l[1];
    if ((t + 1) % 2 === 0) hp.push([sx(t + 1), sy(tot - Math.min(cum[0], cum[1]))]);
  }
  o += path(curve((t) => Math.log(2) / eta + (eta * t) / 8, 0, 1000, sx, sy), 'dash');
  o += path(d(hp), 'ln');
  o += line(sx(0), sy(0), sx(50), sy(25), 'ink-b');
  o += text(sx(62), sy(23.5), 'follow-the-leader：每两天多亏 1，t = 50 时已出图，t = 1000 时是 500', 't');
  o += text(sx(990), sy(19.6) - 8, 'bound：ln 2 / η + ηt / 8', 't', 'end');
  o += text(sx(990), sy(3.4), 'Hedge：t = 1000 时 9.30', 'tl', 'end');
  o += text(520, 264, 't（天数）', 'ts', 'end') + text(70, 18, 'regret', 'ts');
  return svg(560, 272, o, '交替 loss 的 sequence 上，follow-the-leader 的 regret 按 t/2 线性增长，Hedge 的 regret 到 t 等于 1000 时只有 9.3，始终低于理论 bound');
}

// 第 6 站：kernel ridge regression，三个 λ（data 由 python 生成后取三位小数）
const KX = [0.005, 0.225, 0.278, 0.3, 0.303, 0.468, 0.625, 0.776, 0.797, 0.821, 0.874, 0.897];
const KY = [0.065, 0.709, 0.975, 1.159, 0.542, 0.063, -1.278, -1.374, -1.509, -0.972, -1.094, -0.52];
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}
function krr() {
  const s = 0.1, m = KX.length;
  const K = (a, b) => Math.exp(-((a - b) ** 2) / (2 * s * s));
  const fit = (lam) => {
    const A = KX.map((a, i) => KX.map((b, j) => K(a, b) + (i === j ? lam * m : 0)));
    const al = solve(A, KY);
    return (x) => KX.reduce((acc, xi, i) => acc + al[i] * K(xi, x), 0);
  };
  const sx = lin(0, 1, 60, 400), sy = lin(-2.4, 2.4, 240, 30);
  const box = [60, 30, 400, 240];
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -2.4, y1: 2.4, xt: [0, 0.25, 0.5, 0.75, 1], yt: [[-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2']], grid: true });
  const pts = (f) => { const p = []; for (let i = 0; i <= 800; i++) { const x = i / 800; p.push([sx(x), sy(f(x))]); } return p; };
  o += path(curve((x) => Math.sin(2 * Math.PI * x), 0, 1, sx, sy), 'dash');
  o += clipped(pts(fit(1e-6)), box, 'mute');
  o += clipped(pts(fit(1e-3)), box, 'ink');
  o += clipped(pts(fit(0.1)), box, 'ln');
  KX.forEach((x, i) => { o += circle(sx(x), sy(KY[i]), 3.5, 'ink-f'); });
  const lx = 418;
  o += line(lx, 60, lx + 22, 60, 'mute') + text(lx + 28, 64, 'λ = 10⁻⁶', 't') + text(lx + 28, 80, 'norm 60.5', 'ts');
  o += line(lx, 106, lx + 22, 106, 'ink') + text(lx + 28, 110, 'λ = 10⁻³', 't') + text(lx + 28, 126, 'norm 2.10', 'ts');
  o += line(lx, 152, lx + 22, 152, 'ln') + text(lx + 28, 156, 'λ = 0.1', 'tl') + text(lx + 28, 172, 'norm 1.30', 'ts');
  o += line(lx, 198, lx + 22, 198, 'dash') + text(lx + 28, 202, 'sin 2πx', 't');
  o += text(sx(0.3), 22, 'λ = 10⁻⁶ 在这里冲到 18', 'ts', 'middle');
  o += text(400, 272, 'x', 'ts', 'end');
  return svg(560, 280, o, 'Gaussian kernel 的 kernel ridge regression：lambda 很小时 curve 几乎穿过每个点并在两个相邻点之间剧烈振荡，lambda 增大时 curve 变平滑、RKHS norm 变小');
}

// 第 1、2 站：threshold，training error 为 0 的 threshold 被夹在两个 ε-interval 之间
function sandwich() {
  let seed = 7;
  const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const X = Array.from({ length: 199 }, rnd);
  const lo = Math.max(...X.filter((x) => x < 0.5)), hi = Math.min(...X.filter((x) => x >= 0.5));
  let o = '';
  // 上：整条 [0, 1)
  const sx = lin(0, 1, 40, 520), y0 = 52;
  o += text(40, 22, 'm = 199 个 sample，label = 1[x ≥ 0.5]', 'tb');
  o += line(40, y0, 520, y0, 'axis');
  for (const x of X) o += line(sx(x), y0 - 9, sx(x), y0 + 9, x >= 0.5 ? 'ln' : 'mute');
  for (const t of [0, 0.5, 1]) o += text(sx(t), y0 + 26, String(t), 'ts', 'middle');
  o += rect(sx(0.4), y0 - 14, sx(0.6) - sx(0.4), 28, 'frame');
  // 下：放大 [0.4, 0.6]
  const zx = lin(0.4, 0.6, 40, 520), y1 = 170;
  o += line(sx(0.4), y0 + 14, zx(0.4), y1 - 44, 'grid') + line(sx(0.6), y0 + 14, zx(0.6), y1 - 44, 'grid');
  o += rect(zx(0.45), y1 - 30, zx(0.5) - zx(0.45), 60, 'wash') + rect(zx(0.5), y1 - 30, zx(0.55) - zx(0.5), 60, 'wash');
  o += text(zx(0.475), y1 - 36, '[0.45, 0.5)', 'ts', 'middle') + text(zx(0.525), y1 - 36, '[0.5, 0.55)', 'ts', 'middle');
  o += line(40, y1, 520, y1, 'axis');
  for (const x of X) if (x >= 0.4 && x <= 0.6) o += line(zx(x), y1 - 12, zx(x), y1 + 12, x >= 0.5 ? 'ln' : 'mute');
  o += rect(zx(lo), y1 + 18, zx(hi) - zx(lo), 8, 'solid');
  for (const [t, s] of [[0.45, 'a₋ = 0.45'], [0.5, 'a* = 0.5'], [0.55, 'a₊ = 0.55']]) o += line(zx(t), y1 + 30, zx(t), y1 + 36, 'axis') + text(zx(t), y1 + 50, s, 'ts', 'middle');
  o += text(zx(lo) - 6, y1 + 27, `${lo.toFixed(3)}`, 'ts', 'end') + text(zx(hi) + 6, y1 + 27, `${hi.toFixed(3)}`, 'ts', 'start');
  o += text(280, y1 + 78, '实心条：training error 为 0 的 threshold 只能落在最大的 0 和最小的 1 之间。', 'ts', 'middle');
  o += text(280, y1 + 96, '两个浅色 interval 里各有 sample，这一条就被关在 (0.45, 0.55) 里，true error < 0.05。', 'ts', 'middle');
  return svg(560, y1 + 106, o, '199 个 uniform sample 和 threshold 0.5：training error 为 0 的 threshold 只能在最大的负 sample 和最小的正 sample 之间');
}

// 第 6 站：三个点的 kernel ridge regression
function krr3() {
  const XS = [0, 1, 2], YS = [0, 1, 0];
  const K = (a, b) => Math.exp(-((a - b) ** 2) / 2);
  const fit = (lm) => { const A = XS.map((a, i) => XS.map((b, j) => K(a, b) + (i === j ? lm : 0))); const al = solve(A, YS); return (x) => XS.reduce((acc, xi, i) => acc + al[i] * K(xi, x), 0); };
  const f0 = fit(1e-12), f1 = fit(0.3);
  const sx = lin(-0.6, 2.6, 60, 400), sy = lin(-0.45, 1.2, 250, 24);
  let o = axes({ sx, sy, x0: -0.6, x1: 2.6, y0: -0.45, y1: 1.2, xt: [0, 0.5, 1, 1.5, 2], yt: [[-0.4, '−0.4'], [0, '0'], [0.5, '0.5'], [1, '1']], grid: true });
  o += path(curve(f0, -0.6, 2.6, sx, sy), 'mute');
  o += path(curve(f1, -0.6, 2.6, sx, sy), 'ln');
  XS.forEach((x, i) => { o += circle(sx(x), sy(YS[i]), 4.5, 'ink-f'); });
  XS.forEach((x) => { o += circle(sx(x), sy(f1(x)), 3.5, 'ln-f'); });
  o += text(sx(0) - 8, sy(f1(0)) - 8, f1(0).toFixed(3), 'tl', 'end') + text(sx(2) + 8, sy(f1(2)) - 8, f1(2).toFixed(3), 'tl', 'start') + text(sx(1), sy(f1(1)) + 22, f1(1).toFixed(3), 'tl', 'middle');
  o += circle(sx(1.5), sy(f1(1.5)), 3.5, 'ln-f') + line(sx(1.5) + 3, sy(f1(1.5)) - 3, sx(1.6), sy(0.6), 'mute') + text(sx(1.6) + 3, sy(0.62), 'f(1.5) = ' + f1(1.5).toFixed(3), 'tl', 'start');
  const lx = 418;
  o += line(lx, 60, lx + 22, 60, 'mute') + text(lx + 28, 64, 'λ → 0', 't') + text(lx + 28, 80, '穿过 0, 1, 0', 'ts') + text(lx + 28, 96, '‖w‖² = 2.841', 'ts');
  o += line(lx, 126, lx + 22, 126, 'ln') + text(lx + 28, 130, 'λ = 0.1', 'tl') + text(lx + 28, 146, '(λm = 0.3)', 'ts') + text(lx + 28, 162, '‖w‖² = 0.613', 'ts');
  o += circle(lx + 11, 192, 4.5, 'ink-f') + text(lx + 28, 196, 'data (x, y)', 't');
  o += text(400, 282, 'x', 'ts', 'end');
  return svg(560, 290, o, '三个点 0,1,0 的 Gaussian kernel ridge regression：lambda 趋于 0 时穿过三个点，lambda=0.1 时在三个点上是 0.161、0.619、0.161');
}

// 第 8 站：AdaBoost 在 10 个点上的三轮
function adaboost() {
  const Y = [1, 1, 1, -1, -1, -1, -1, 1, 1, 1], m = 10;
  const stumps = [[(x) => (x <= 3 ? 1 : -1), 3.5, 'x ≤ 3 为 +'], [(x) => (x >= 8 ? 1 : -1), 7.5, 'x ≥ 8 为 +'], [() => 1, null, '全部为 +']];
  let D = Array(m).fill(1 / m);
  const rounds = [], F = Array(m).fill(0);
  for (const [h, th, name] of stumps) {
    const wrong = Y.map((y, i) => h(i + 1) !== y);
    const eps = D.reduce((a, w, i) => a + (wrong[i] ? w : 0), 0), al = 0.5 * Math.log((1 - eps) / eps);
    rounds.push({ D: D.slice(), wrong, eps, al, th, name });
    for (let i = 0; i < m; i++) F[i] += al * h(i + 1);
    const nd = D.map((w, i) => w * Math.exp(-al * Y[i] * h(i + 1))), Z = nd.reduce((a, b) => a + b, 0);
    D = nd.map((w) => w / Z);
  }
  const px = (i) => 196 + i * 36, bw = 22;
  let o = '';
  // 数据
  o += text(16, 34, 'data', 'tb');
  for (let i = 0; i < m; i++) { o += text(px(i), 14, String(i + 1), 'ts', 'middle') + circle(px(i), 34 - 4, 9, Y[i] > 0 ? 'wash-strong' : 'paper') + text(px(i), 34, Y[i] > 0 ? '+' : '−', 'tb', 'middle'); }
  const H = 40, sc = H / (1 / 6);
  rounds.forEach((r, t) => {
    const base = 104 + t * 68;
    o += text(16, base - 24, `round ${t + 1}：${r.name}`, 'tb') + text(16, base - 6, `ε = ${r.eps.toFixed(3)}，α = ${r.al.toFixed(3)}`, 'ts');
    o += line(px(0) - 18, base, px(9) + 18, base, 'axis');
    for (let i = 0; i < m; i++) o += rect(px(i) - bw / 2, base - r.D[i] * sc, bw, r.D[i] * sc, r.wrong[i] ? 'solid' : 'wash');
    if (r.th !== null) { const x = px(r.th - 1); o += line(x, base - H - 6, x, base + 4, 'ln-dash'); }
  });
  o += text(px(9) + 22, 104 - 34, 'D_t(i)', 'ts', 'end');
  // F_3
  const fb = 104 + 3 * 68 + 10, fs = 30;
  o += text(16, fb - 4, 'F₃ = Σ α_t h_t', 'tb') + text(16, fb + 14, 'sign 全对', 'ts');
  o += line(px(0) - 18, fb, px(9) + 18, fb, 'axis');
  for (let i = 0; i < m; i++) { const v = F[i]; o += rect(px(i) - bw / 2, v > 0 ? fb - v * fs : fb, bw, Math.abs(v) * fs, v > 0 ? 'wash-strong' : 'wash2'); }
  for (const [i, dy] of [[1, -1], [5, 1], [8, -1]]) o += text(px(i), fb + (dy < 0 ? -F[i] * fs - 6 : -F[i] * fs + 16), F[i].toFixed(3), 'ts', 'middle');
  o += text(280, fb + 52, '每一轮的柱高是这一轮开始时的 weight，深色是这一轮分错的点；虚线是 stump 的切点。', 'ts', 'middle');
  return svg(560, fb + 62, o, 'AdaBoost 在 10 个点上跑三轮：每轮的 weight、分错的点、stump 的切点，以及三轮之后 F3 在每段上的值');
}

// 第 7 站：一直看到 0 时 θ 的 posterior：Beta(1, n + 1)
function beta() {
  const sx = lin(0, 0.2, 70, 520), sy = lin(0, 55, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 0.2, y0: 0, y1: 55, xt: [0, 0.05, 0.1, 0.15, 0.2], yt: [10, 20, 30, 40, 50], grid: true });
  const dens = (n) => (t) => (n + 1) * Math.pow(1 - t, n);
  o += path(area(dens(50), 0, 0.2, sx, sy), 'wash');
  o += path(curve(dens(0), 0, 0.2, sx, sy), 'mute') + path(curve(dens(10), 0, 0.2, sx, sy), 'ink') + path(curve(dens(50), 0, 0.2, sx, sy), 'ln');
  const lx = sx(0.118);
  o += line(lx, sy(50), lx + 22, sy(50), 'mute') + text(lx + 28, sy(50) + 4, '看到 0 个：uniform', 't');
  o += line(lx, sy(44), lx + 22, sy(44), 'ink') + text(lx + 28, sy(44) + 4, '10 个 0：Beta(1, 11)', 't');
  o += line(lx, sy(38), lx + 22, sy(38), 'ln') + text(lx + 28, sy(38) + 4, '50 个 0：Beta(1, 51)', 'tl');
  o += line(sx(1 / 52), sy(0), sx(1 / 52), sy(dens(50)(1 / 52)), 'ln-dash');
  o += line(sx(1 / 12), sy(0), sx(1 / 12), sy(dens(10)(1 / 12)), 'dash');
  o += text(sx(1 / 52) + 6, sy(23), 'mean 1/52', 'tl') + text(sx(1 / 12) + 6, sy(7.5), 'mean 1/12', 't');
  o += text(sx(0.006), sy(47), 'mode 与 MLE 都在 0', 'ts');
  o += text(520, 264, 'θ', 'ts', 'end') + text(70, 18, 'posterior density', 'ts');
  return svg(560, 272, o, '一直观察到 0 时 theta 的 posterior：随着观察增多，density 集中到 0 附近，mode 一直在 0，而 mean 分别是 1/12 和 1/52，始终为正');
}

// 第 7 站：LDA，共用 covariance 的两个 Gaussian，boundary 是 x₁ = 1
function lda() {
  const S = 40, O = [130, 175];
  const P = (x, y) => [O[0] + x * S, O[1] - y * S];
  let o = '';
  for (let g = -2; g <= 4; g++) o += line(P(g, -2.6)[0], P(g, -2.6)[1], P(g, 3.05)[0], P(g, 3.05)[1], 'grid');
  for (let g = -2; g <= 3; g++) o += line(P(-2.6, g)[0], P(-2.6, g)[1], P(4.6, g)[0], P(4.6, g)[1], 'grid');
  o += line(P(-2.6, 0)[0], O[1], P(4.6, 0)[0], O[1], 'axis') + line(O[0], P(0, -2.6)[1], O[0], P(0, 3.6)[1], 'axis');
  const u1 = [Math.SQRT1_2, Math.SQRT1_2], u2 = [Math.SQRT1_2, -Math.SQRT1_2];
  const ell = (mu, r, cls) => {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const a = (2 * Math.PI * i) / 120, c = r * Math.sqrt(1.5) * Math.cos(a), s2 = r * Math.sqrt(0.5) * Math.sin(a);
      pts.push(P(mu[0] + c * u1[0] + s2 * u2[0], mu[1] + c * u1[1] + s2 * u2[1]));
    }
    return path(d(pts), cls);
  };
  o += ell([0, 0], 1, 'ink') + ell([0, 0], 2, 'mute') + ell([2, 1], 1, 'ink') + ell([2, 1], 2, 'mute');
  o += line(P(1, -2.6)[0], P(1, -2.6)[1], P(1, 3.6)[0], P(1, 3.6)[1], 'ln');
  o += circle(...P(0, 0), 4.5, 'ink paper-f') + circle(...P(2, 1), 4.5, 'ink-f');
  o += text(P(-0.2, -0.32)[0], P(-0.2, -0.32)[1], 'μ₀', 't', 'end');
  o += text(P(2.2, 0.72)[0], P(2.2, 0.72)[1], 'μ₁', 't');
  o += text(P(1, 3.3)[0] + 6, P(1, 3.3)[1] + 4, 'boundary x₁ = 1', 'tl');
  o += text(P(4.6, 0)[0], O[1] + 16, 'x₁', 'ts', 'end') + text(O[0] + 6, P(0, 3.6)[1] + 12, 'x₂', 'ts');
  const tx = 440;
  o += text(tx, 60, 'Σ 的 eigenvector', 'tb') + text(tx, 78, '沿 (1, 1) 和 (1, −1)', 'ts');
  o += text(tx, 104, 'μ₀ = (0, 0)，μ₁ = (2, 1)', 'ts') + text(tx, 128, 'w = Σ⁻¹(μ₁ − μ₀)', 't') + text(tx, 146, '= (2, 0)', 't');
  o += text(tx, 178, '给定 x₁ 后 x₂ 的', 'ts') + text(tx, 194, 'conditional mean', 'ts') + text(tx, 210, '两个 class 都是 0.5x₁', 'ts');
  o += text(280, 290, 'Contour 是 Mahalanobis distance 为 1 和 2 的 ellipse', 'ts', 'middle') + text(280, 306, '空心点是 class 0 的 mean，实心点是 class 1 的 mean', 'ts', 'middle');
  return svg(560, 316, o, '两个共用 covariance 的 Gaussian 的 contour 都沿 45 度方向倾斜，mean 在两个 coordinate 上都不同，LDA 的 decision boundary 却是竖直的 line x1 等于 1');
}

// 第 8 站：AdaBoost 在二维 circle data 上（python 实算：300 个 training、20000 个 test）
const BR = [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 22, 26, 32, 38, 46, 56, 68, 83, 100, 121, 147, 178, 215, 261, 316, 383, 464, 562, 681, 825, 1000];
const BTR = [0.38, 0.4167, 0.2067, 0.2067, 0.1267, 0.2, 0.08, 0.11, 0.1067, 0.1033, 0.0367, 0.0367, 0.0367, 0.0367, 0.0167, 0.0133, 0.0167, 0.01, 0.0067, 0.0067, 0.0033, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const BTE = [0.4268, 0.3962, 0.2571, 0.2571, 0.1694, 0.2398, 0.0992, 0.1557, 0.1536, 0.1512, 0.0649, 0.0662, 0.0649, 0.0658, 0.0602, 0.056, 0.0588, 0.0588, 0.0578, 0.0582, 0.0574, 0.0545, 0.0542, 0.0506, 0.0483, 0.0477, 0.0454, 0.0428, 0.0428, 0.0418, 0.0458, 0.046, 0.0462];
const BBD = [0.9708, 0.9268, 0.868, 0.8396, 0.794, 0.7647, 0.7144, 0.6798, 0.6359, 0.5934, 0.5284, 0.4787, 0.4228, 0.3729, 0.3152, 0.2699, 0.2287, 0.1877, 0.15, 0.1202, 0.0951, 0.0747, 0.0577, 0.0441, 0.033, 0.0245, 0.0172, 0.0113, 0.0071, 0.004, 0.0021, 0.0009, 0.0004];
function boost() {
  const sx = logx(1, 1000, 70, 520), sy = lin(0, 1, 230, 30);
  let o = '';
  for (const v of [0.2, 0.4, 0.6, 0.8, 1]) o += line(70, sy(v), 520, sy(v), 'grid') + text(64, sy(v) + 4, String(v), 'ts', 'end');
  for (const r of [1, 10, 100, 1000]) o += line(sx(r), 230, sx(r), 234, 'axis') + text(sx(r), 248, String(r), 'ts', 'middle');
  o += line(70, 230, 520, 230, 'axis') + line(70, 230, 70, 30, 'axis') + text(64, 234, '0', 'ts', 'end');
  const ser = (arr) => d(BR.map((r, i) => [sx(r), sy(arr[i])]));
  o += path(ser(BBD), 'dash') + path(ser(BTR), 'ink') + path(ser(BTE), 'ln');
  o += line(sx(85), sy(0), sx(85), sy(0.55), 'mute') + text(sx(85) + 5, sy(0.52), '第 85 轮', 'ts') + text(sx(85) + 5, sy(0.52) + 15, 'training error = 0', 'ts');
  o += text(sx(4.6), sy(0.93), 'bound ∏ Zₜ', 't');
  o += text(sx(5.5), sy(0.33), 'test error', 'tl');
  o += text(sx(13), sy(0.15) + 4, 'training error', 't');
  o += text(sx(562), sy(0.0418) - 12, '4.2%', 'tl', 'middle');
  o += text(520, 266, '轮数（log scale）', 'ts', 'end') + text(70, 18, 'error', 'ts');
  return svg(560, 274, o, 'AdaBoost 的 training error、test error 和 training error 的 bound 随轮数变化：training error 在第 85 轮变为 0，test error 之后继续下降，到第 562 轮约 4.2%');
}


// ---------- 动图 ----------
// 帧分组：第 k 帧显示的内容
const frameG = (on, kt, T, body) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// 开头第一个现象：1000 个抛硬币的 classifier，挑 training error 最小的
function pick() {
  let s = 20260521;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const errs = [];
  for (let j = 0; j < 1000; j++) { let w = 0; for (let i = 0; i < 100; i++) if (rnd() < 0.5) w++; errs.push(w / 100); }
  const ks = [1, 3, 10, 30, 100, 300, 1000];
  const hold = 2.2, step = 1.1, T = step * (ks.length - 1) + hold;
  const kt = ks.map((_, i) => (step * i) / T);
  const sx = lin(0.25, 0.75, 40, 540), Y = 210;
  let o = '';
  o += text(280, 20, '每个 classifier 抛硬币定 label：true error 全是 0.5', 'tb', 'middle');
  // 轴
  o += line(sx(0.25), Y, sx(0.75), Y, 'axis');
  for (const v of [0.3, 0.4, 0.5, 0.6, 0.7]) o += line(sx(v), Y, sx(v), Y + 4, 'axis') + text(sx(v), Y + 18, v.toFixed(1), 'ts', 'middle');
  o += text(sx(0.75), Y + 34, '在 100 个 training example 上的 training error', 'ts', 'end');
  o += line(sx(0.5), 52, sx(0.5), Y, 'dash') + text(sx(0.5) + 6, 62, 'true error = 0.5', 'ts', 'start');
  // 点：同一 training error 的点往上叠
  const cnt = {};
  const yOf = (e) => { cnt[e] = (cnt[e] || 0) + 1; return Y - 4 - (cnt[e] - 1) * 1.7; };
  const pos = errs.map((e) => [sx(e) + (rnd() - 0.5) * 3, 0]);
  errs.forEach((e, j) => { pos[j][1] = yOf(e); });
  ks.forEach((k, f) => {
    const lo = f ? ks[f - 1] : 0;
    let g = '';
    for (let j = lo; j < k; j++) g += circle(pos[j][0], pos[j][1], 1.6, 'mute-f');
    o += frameG(ks.map((_, i) => i >= f), kt, T, g);
  });
  // min 的标记
  ks.forEach((k, f) => {
    let jm = 0; for (let j = 1; j < k; j++) if (errs[j] < errs[jm]) jm = j;
    const m = errs[jm], x = sx(m);
    let g = arrow(x, 100, x, pos[jm][1] - 5, 'ln', 6) + circle(pos[jm][0], pos[jm][1], 3, 'ln-f');
    g += text(x, 92, 'ERM 选它：' + m.toFixed(2), 'tl', m < 0.4 ? 'start' : 'middle');
    g += text(40, 44, `试了 ${k} 个 classifier，最小的 training error 是 ${m.toFixed(2)}`, 't', 'start');
    o += frameG(ks.map((_, i) => i === f), kt, T, g);
  });
  o += text(280, 270, '挑的个数越多，最小值离 0.5 越远；被挑中的那个 true error 仍是 0.5。', 'ts', 'middle');
  return svgA(560, 278, o, '动图：随机 classifier 的个数从 1 增加到 1000，它们的 training error 堆在 0.5 附近，最小的那个一路降到 0.34 左右，而 true error 一直是 0.5');
}

// 第 4 站：gradient descent 一步一步走
function gdA() {
  const step = 0.32, N = 24, hold = 1.8, T = step * N + hold;
  const kt = [], idx = [];
  for (let k = 0; k <= N; k++) { kt.push((step * k) / T); idx.push(k); }
  kt.push(1); idx.push(N);
  let o = '';
  const panel = (X0, t, nmax, title, note, outNote) => {
    const W = 240, H = 190, Y0 = 40;
    const sx = lin(-1.9, 1.9, X0, X0 + W), sy = lin(-0.35, 1.2, Y0 + H, Y0);
    const box = [X0, Y0, X0 + W, Y0 + H];
    o += rect(X0, Y0, W, H, 'frame');
    o += line(sx(-1.9), sy(0), sx(1.9), sy(0), 'grid') + line(sx(0), sy(-0.35), sx(0), sy(1.2), 'grid');
    for (const c of [0.1, 0.5, 1.5, 5.5, 12]) {
      const pts = [];
      for (let i = 0; i <= 360; i++) { const a = (2 * Math.PI * i) / 360; pts.push([sx(Math.sqrt(c / 5) * Math.cos(a)), sy(Math.sqrt(2 * c) * Math.sin(a))]); }
      o += clipped(pts, box, 'mute');
    }
    let x = [1, 1];
    const ps = [x];
    for (let k = 0; k < nmax; k++) { x = [x[0] - t * 10 * x[0], x[1] - t * x[1]]; ps.push(x); }
    const at = (k) => ps[Math.min(k, nmax)];
    const q = (p) => [sx(p[0]), sy(p[1])];
    // 走过的路（离散地变长）+ 当前点（沿每一步的直线滑过去）
    o += clipped(ps.map(q), box, 'ln-dash');
    o += apath(idx.map((k) => d(ps.slice(0, Math.min(k, nmax) + 1).map(q)) || 'M0 0'), kt, T, 'ln', true);
    o += circle(sx(1), sy(1), 3, 'ink-f') + text(sx(1) + 7, sy(1) - 6, 'x₀', 'ts');
    o += circle(sx(0), sy(0), 3.5, 'ink paper-f');
    o += acircle(idx.map((k) => q(at(k))[0]), idx.map((k) => q(at(k))[1]), kt, T, 5, 'ln-f');
    o += text(X0 + W / 2, 18, title, 'tb', 'middle') + text(X0 + W / 2, 34, note, 'ts', 'middle');
    o += text(X0 + W, Y0 + H + 16, 'x₁', 'ts', 'end') + text(sx(0) + 5, Y0 + 12, 'x₂', 'ts');
    // 读数：随帧切换
    const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(3);
    const shown = [...new Set(idx)];
    for (const k of shown) {
      const p = at(k);
      const s = k > nmax ? outNote : `k = ${k}　x = (${fmt(p[0])}, ${fmt(p[1])})`;
      o += `<text x="${X0}" y="${Y0 + H + 16}" class="ts" text-anchor="start" opacity="${k === 0 ? 1 : 0}">${s}${ashow(idx.map((j) => j === k), kt, T)}</text>`;
    }
  };
  panel(30, 2 / 11, 24, 't = 2/11：zigzag 地 converge', 'x₁ 每步乘 −9/11，x₂ 每步乘 9/11', '');
  panel(290, 0.21, 6, 't = 0.21：diverge', 'x₁ 每步乘 −1.1，越弹越远', 'k = 7 起 |x₁| > 1.9，跑出框外');
  o += text(280, 268, '灰色 ellipse 是 f 的 contour；实心小点是 x₀ = (1, 1)，空心点是 minimum (0, 0)', 'ts', 'middle');
  return svgA(560, 278, o, '动图：在 ill-conditioned 的 quadratic function 上一步一步做 gradient descent；step size 为 2/11 时点来回穿过谷底并 converge，step size 为 0.21 时来回的幅度越来越大，第 7 步跑出画面');
}

// 第 5 站：Perceptron 一次一次更新
function percA() {
  const S = 31, O = [125, 200];
  const P = ([x, y]) => [O[0] + x * S, O[1] - y * S];
  const BX = [-2.6, -2.4, 3.6, 5.6];
  let o = '';
  // 正半平面 {w·x > 0}，裁到框里
  const half = (w) => {
    let poly0 = [[BX[0], BX[1]], [BX[2], BX[1]], [BX[2], BX[3]], [BX[0], BX[3]]];
    const f = (p) => w[0] * p[0] + w[1] * p[1];
    const out = [];
    for (let i = 0; i < 4; i++) {
      const a = poly0[i], b = poly0[(i + 1) % 4], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const s = fa / (fa - fb); out.push([a[0] + s * (b[0] - a[0]), a[1] + s * (b[1] - a[1])]); }
    }
    return out;
  };
  const bline = (w) => {
    const pts = half(w).filter((p) => Math.abs(w[0] * p[0] + w[1] * p[1]) < 1e-9);
    return pts.length === 2 ? line(...P(pts[0]), ...P(pts[1]), 'ln-dash') : '';
  };
  const W = [[0, 0], [1, 2], [-1, 3], [2, 4], [0, 5]];
  const X = [[[1, 2], 1, 'x₁'], [[3, 1], 1, 'x₂'], [[-1, -2], -1, 'x₃'], [[2, -1], -1, 'x₄']];
  const upd = [[1, 0, '第 1 遍'], [2, 3, '第 1 遍'], [3, 1, '第 2 遍'], [4, 3, '第 2 遍']]; // k, 犯错的点, 第几遍
  const frames = [1, 2, 3, 4, 5]; // 5 = 第 3 遍全对
  const step = 2.0, T = step * frames.length + 0.8;
  const kt = frames.map((_, i) => (step * i) / T);
  const show = (f) => frames.map((g) => g === f);
  const upto = (f) => frames.map((g) => g >= f);
  // 每帧的 half-plane 与 boundary
  frames.forEach((f) => {
    const w = W[Math.min(f, 4)];
    o += frameG(show(f), kt, T, path(d(half(w).map(P)) + 'Z', 'wash'));
  });
  for (let g = -2; g <= 3; g++) o += line(...P([g, -2.4]), ...P([g, 5.6]), 'grid');
  for (let g = -2; g <= 5; g++) o += line(...P([-2.6, g]), ...P([3.6, g]), 'grid');
  o += line(O[0], P([0, -2.4])[1], O[0], P([0, 5.6])[1], 'axis') + line(P([-2.6, 0])[0], O[1], P([3.6, 0])[0], O[1], 'axis');
  frames.forEach((f) => {
    const k = Math.min(f, 4), w = W[k], wp = W[k - 1];
    let g = bline(w);
    if (f <= 4) {
      const [, xi] = upd[k - 1], [p, y] = X[xi];
      if (k > 1) g += arrow(O[0], O[1], ...P(wp), 'mute', 6) + text(P(wp)[0] + (k - 1 <= 2 ? -12 : 8), P(wp)[1] - 4, `w${'₀₁₂₃'[k - 1]}`, 'ts', k - 1 <= 2 ? 'end' : 'start');
      g += arrow(...P(wp), ...P(w), 'ink dash', 6); // + y·x
      g += circle(...P(p), 10, 'ln');
      const yx = [y * p[0], y * p[1]], mid = P([(wp[0] + w[0]) / 2, (wp[1] + w[1]) / 2]);
      g += text(mid[0] + 6, mid[1] + 4, (y > 0 ? '+' : '−') + X[xi][2], 'ts', 'start');
    }
    const L = k <= 2;
    g += arrow(O[0], O[1], ...P(w), 'ln', 6) + text(P(w)[0] + (L ? -13 : 8), P(w)[1] + (L ? -6 : 4), `w${'₀₁₂₃₄'[k]} = (${w[0] < 0 ? '−' : ''}${Math.abs(w[0])}, ${w[1]})`, 'tl', L ? 'end' : 'start');
    o += frameG(show(f), kt, T, g);
  });
  for (const [p, y, n] of X) { const q = P(p); o += circle(q[0], q[1], 5.5, y > 0 ? 'ink-f' : 'ink paper-f'); o += text(q[0] + 9, q[1] + (p[1] < -1.5 ? 4 : 15), n, 't'); }
  // 右边：状态与表
  const tx = 300;
  o += text(tx, 22, '实心 label +1，空心 label −1', 'ts');
  o += text(tx, 40, '浅色是 ⟨w, x⟩ > 0 的一侧，虚线是 boundary', 'ts');
  o += text(tx, 58, 'w* = (0, 1)，γ = 1，R = √10，bound (R/γ)² = 10', 'ts');
  const st = [
    '第 1 遍：x₁ 上 ⟨w₀, x₁⟩ = 0，犯错 → w₁ = w₀ + x₁',
    '第 1 遍：x₄ 上 −⟨w₁, x₄⟩ = 0，犯错 → w₂ = w₁ − x₄',
    '第 2 遍：x₂ 上 ⟨w₂, x₂⟩ = 0，犯错 → w₃ = w₂ + x₂',
    '第 2 遍：x₄ 上 −⟨w₃, x₄⟩ = 0，犯错 → w₄ = w₃ − x₄',
    '第 3 遍：四个点都在正确的一侧，停止',
  ];
  st.forEach((s, i) => { o += `<text x="${tx}" y="88" class="tl" text-anchor="start" opacity="${i ? 0 : 1}">${s}${ashow(show(i + 1), kt, T)}</text>`; });
  o += text(tx, 118, 'k', 'tb') + text(tx + 50, 118, '⟨w*, wₖ⟩ ≥ k', 'tb') + text(tx + 150, 118, '‖wₖ‖² ≤ 10k', 'tb');
  [[1, 2, 5], [2, 3, 10], [3, 4, 20], [4, 5, 25]].forEach(([k, a, b], i) => {
    const y = 142 + i * 22;
    o += frameG(upto(k), kt, T, text(tx, y, String(k), 't') + text(tx + 50, y, `${a} ≥ ${k}`, 't') + text(tx + 150, y, `${b} ≤ ${10 * k}`, 't'));
  });
  o += text(tx, 246, '虚线箭头是这一次加上的 y·x；', 'ts') + text(tx, 264, '灰箭头是更新前的 w。', 'ts');
  return svgA(560, 278, o, '动图：Perceptron 在四个点上一次一次更新：每一帧圈出犯错的点，weight vector 加上 y 乘 x，从 (1, 2) 经 (−1, 3)、(2, 4) 转到 (0, 5)，浅色半平面和 boundary 跟着转，最后四个点全部分对');
}

export default {
  'cs3264-pick': pick,
  'cs3264-tail': tail,
  'cs3264-sandwich': sandwich,
  'cs3264-krr3': krr3,
  'cs3264-adaboost': adaboost,
  'cs3264-shatter': shatter,
  'cs3264-rad': radfig,
  'cs3264-ramp': ramp,
  'cs3264-gd': gdA,
  'cs3264-perc': percA,
  'cs3264-regret': regret,
  'cs3264-krr': krr,
  'cs3264-beta': beta,
  'cs3264-lda': lda,
  'cs3264-boost': boost,
};
