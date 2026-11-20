import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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

export default {
  'cs3264-tail': tail,
  'cs3264-shatter': shatter,
  'cs3264-rad': radfig,
  'cs3264-ramp': ramp,
  'cs3264-gd': gd,
  'cs3264-perc': perc,
  'cs3264-regret': regret,
  'cs3264-krr': krr,
  'cs3264-beta': beta,
  'cs3264-lda': lda,
  'cs3264-boost': boost,
};
