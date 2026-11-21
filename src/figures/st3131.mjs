import { svg, lin, d, path, line, rect, circle, poly, text, arrow, curve, area, axes } from '../lib/svg.mjs';

// ---------- 数据（来源见 ST3131.md 各站的 :::from） ----------
// Penn State STAT 501 Lesson 1：10 个学生的 height（inch）与 weight（lb）
const HT = [63, 64, 66, 69, 69, 71, 71, 72, 73, 75];
const WT = [127, 121, 142, 157, 162, 156, 169, 165, 181, 208];
// Hald 的 cement data：x1..x4 是四种成分的含量，y 是 heat
const HALD = [[7, 26, 6, 60, 78.5], [1, 29, 15, 52, 74.3], [11, 56, 8, 20, 104.3], [11, 31, 8, 47, 87.6], [7, 52, 6, 33, 95.9], [11, 55, 9, 22, 109.2], [3, 71, 17, 6, 102.7], [1, 31, 22, 44, 72.5], [2, 54, 18, 22, 93.1], [21, 47, 4, 26, 115.9], [1, 40, 23, 34, 83.8], [11, 66, 9, 12, 113.3], [10, 68, 8, 12, 109.4]];

// ---------- 小工具：least squares ----------
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
function slr(x, y) {
  const xb = mean(x), yb = mean(y);
  let sxx = 0, sxy = 0;
  x.forEach((v, i) => { sxx += (v - xb) ** 2; sxy += (v - xb) * (y[i] - yb); });
  const b1 = sxy / sxx, b0 = yb - b1 * xb;
  const e = y.map((v, i) => v - b0 - b1 * x[i]);
  return { b0, b1, xb, sxx, e, sse: e.reduce((s, v) => s + v * v, 0) };
}
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) { const f = M[i][k] / M[k][k]; for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
function inv(A) { const n = A.length; return A.map((_, j) => solve(A, A.map((__, i) => (i === j ? 1 : 0)))).map((c, j, cols) => cols.map((cc) => cc[j])); }
function ols(cols, y) {
  const X = y.map((_, i) => [1, ...cols.map((c) => c[i])]);
  const p = X[0].length, XtX = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => X.reduce((s, r) => s + r[a] * r[b], 0)));
  const Xty = Array.from({ length: p }, (_, a) => X.reduce((s, r, i) => s + r[a] * y[i], 0));
  const b = solve(XtX, Xty);
  const e = y.map((v, i) => v - X[i].reduce((s, xx, k) => s + xx * b[k], 0));
  return { b, e, sse: e.reduce((s, v) => s + v * v, 0), XtXi: inv(XtX), n: y.length, p };
}
const T8 = 2.306004; // t_{8, 0.025}
const T9 = 2.262157; // t_{9, 0.025}
const F29 = 4.256495; // F_{2, 9, 0.95}

// 第 1 站：least squares 的 line 与另一条 line
function fit() {
  const sx = lin(61.5, 76.5, 60, 350), sy = lin(110, 215, 262, 24);
  const f = slr(HT, WT);
  let o = axes({ sx, sy, x0: 61.5, x1: 76.5, y0: 110, y1: 215, xt: [63, 66, 69, 72, 75], yt: [120, 140, 160, 180, 200], xl: 'height（inch）', yl: 'weight（lb）', grid: true });
  const alt = (h) => -331.2 + 7.1 * h;
  o += line(sx(62), sy(alt(62)), sx(76.2), sy(alt(76.2)), 'dash');
  o += line(sx(62), sy(f.b0 + f.b1 * 62), sx(76.2), sy(f.b0 + f.b1 * 76.2), 'ln');
  HT.forEach((h, i) => { o += line(sx(h) + (i === 4 || i === 6 ? 3 : 0), sy(WT[i]), sx(h) + (i === 4 || i === 6 ? 3 : 0), sy(f.b0 + f.b1 * h), 'ink-b'); });
  HT.forEach((h, i) => { o += circle(sx(h), sy(WT[i]), 4.5, 'ink-f'); });
  o += text(370, 50, 'Least squares line', 'tl') + text(370, 70, `ŷ = ${f.b0.toFixed(2)} + ${f.b1.toFixed(4)}x`, 't') + text(370, 90, `SSE = ${f.sse.toFixed(1)}`, 't');
  const sseAlt = HT.reduce((s, h, i) => s + (WT[i] - alt(h)) ** 2, 0);
  o += line(370, 122, 400, 122, 'dash') + text(408, 126, '另一条 line', 'tb') + text(370, 146, 'ŷ = −331.2 + 7.1x', 't') + text(370, 166, `SSE = ${sseAlt.toFixed(1)}`, 't');
  o += text(370, 204, '竖线是 residual：', 'ts') + text(370, 222, '每个点到 least squares line', 'ts') + text(370, 240, '的 vertical distance', 'ts');
  return svg(560, 306, o, '10 个学生的 height 和 weight 的 scatter plot，least squares line 的 SSE 是 597.4，另一条 line 的 SSE 是 766.5');
}

// 第 2 站：mean response 的 confidence band 与 prediction band
function bands() {
  const f = slr(HT, WT), n = HT.length, mse = f.sse / (n - 2);
  const sx = lin(58, 80, 60, 400), sy = lin(70, 260, 268, 22);
  const m = (h) => f.b0 + f.b1 * h;
  const sm = (h) => Math.sqrt(mse * (1 / n + (h - f.xb) ** 2 / f.sxx)), sp = (h) => Math.sqrt(mse * (1 + 1 / n + (h - f.xb) ** 2 / f.sxx));
  const band = (se, cls) => {
    const up = [], lo = [];
    for (let i = 0; i <= 80; i++) { const h = 58 + (22 * i) / 80; up.push([sx(h), sy(m(h) + T8 * se(h))]); lo.push([sx(h), sy(m(h) - T8 * se(h))]); }
    return path(d(up.concat(lo.reverse())) + 'Z', cls);
  };
  let o = band(sp, 'wash') + band(sm, 'wash-strong');
  o += axes({ sx, sy, x0: 58, x1: 80, y0: 70, y1: 260, xt: [60, 65, 70, 75, 80], yt: [100, 150, 200, 250], xl: 'height（inch）', yl: 'weight（lb）' });
  o += line(sx(58), sy(m(58)), sx(80), sy(m(80)), 'ln');
  HT.forEach((h, i) => { o += circle(sx(h), sy(WT[i]), 3.5, 'ink-f'); });
  o += line(sx(f.xb), sy(70), sx(f.xb), sy(255), 'grid') + text(sx(f.xb), sy(70) - 6, 'x̄ = 69.3', 'ts', 'middle');
  o += rect(415, 56, 20, 14, 'wash-strong') + text(441, 67, '95% CI：mean', 't') + text(441, 85, 'response', 't');
  o += rect(415, 104, 20, 14, 'wash') + text(441, 115, '95% PI：一个', 't') + text(441, 133, '新学生的 weight', 't');
  o += text(415, 172, '在 x = 66：', 'tb') + text(415, 192, 'CI 宽 16.9', 't') + text(415, 210, 'PI 宽 43.3', 't');
  o += text(415, 240, '离 x̄ 越远，', 'ts') + text(415, 256, '两条 band 都越宽', 'ts');
  return svg(560, 312, o, 'Fitted line 周围两条 band：窄的是 mean response 的 95% confidence interval，宽的是新 observation 的 95% prediction interval，离 x bar 越远越宽');
}

// 第 3 站：SLR 的 slope 与 added-variable plot 的 slope
function avplot() {
  const x1 = HALD.map((r) => r[0]), x2 = HALD.map((r) => r[1]), y = HALD.map((r) => r[4]);
  const a = slr(x1, y);
  const ry = slr(x2, y).e, rx = slr(x2, x1).e, b = slr(rx, ry);
  let o = '';
  {
    const sx = lin(0, 22, 50, 250), sy = lin(65, 125, 236, 58);
    o += axes({ sx, sy, x0: 0, x1: 22, y0: 65, y1: 125, xt: [0, 5, 10, 15, 20], yt: [70, 90, 110], xl: 'x₁', yl: 'y（heat）' });
    o += line(sx(0), sy(a.b0), sx(22), sy(a.b0 + 22 * a.b1), 'ln');
    x1.forEach((v, i) => { o += circle(sx(v), sy(y[i]), 3.5, 'ink-f'); });
    o += text(150, 18, 'y 对 x₁：slope = ' + a.b1.toFixed(3), 'tb', 'middle');
  }
  {
    const sx = lin(-10, 15, 340, 530), sy = lin(-16, 24, 236, 58);
    o += axes({ sx, sy, x0: -10, x1: 15, y0: -16, y1: 24, xt: [[-10, '−10'], [0, '0'], [10, '10']], yt: [[-10, '−10'], [0, '0'], [10, '10'], [20, '20']], xl: 'x₁ 对 x₂ 的 residual', yl: 'y 对 x₂ 的 residual' });
    o += line(sx(-10), sy(0), sx(15), sy(0), 'grid');
    o += line(sx(-10), sy(b.b1 * -10), sx(15), sy(b.b1 * 15), 'ln');
    rx.forEach((v, i) => { o += circle(sx(v), sy(ry[i]), 3.5, 'ink-f'); });
    o += text(435, 18, '去掉 x₂ 之后：slope = ' + b.b1.toFixed(3), 'tb', 'middle');
  }
  return svg(560, 280, o, '左图是 heat 对 x1 的 simple regression，slope 1.869；右图把 heat 和 x1 各自对 x2 做 regression 后取 residual 再作图，slope 1.468，等于 multiple regression 的 coefficient');
}

// 第 4 站：SST = SSR + SSE 的直角三角形（height/weight 的数）
function triangle() {
  const f = slr(HT, WT), sst = WT.reduce((s, v) => s + (v - mean(WT)) ** 2, 0), sse = f.sse, ssr = sst - sse;
  const k = 4.2, O = [70, 220];
  const P = [O[0] + k * Math.sqrt(ssr), O[1]], Y = [P[0], O[1] - k * Math.sqrt(sse)];
  let o = poly([[30, 252], [450, 252], [500, 188], [80, 188]], 'wash ink-s');
  o += arrow(O[0], O[1], Y[0], Y[1], 'ln') + arrow(O[0], O[1], P[0], P[1], 'ink-b') + arrow(P[0], P[1], Y[0], Y[1], 'ink');
  o += path(d([[P[0] - 11, P[1]], [P[0] - 11, P[1] - 11], [P[0], P[1] - 11]]), 'ink');
  o += text(Y[0] - 150, Y[1] - 22, 'y − ȳ1：length² = SST = ' + sst.toFixed(1), 'tl', 'start');
  o += text((O[0] + P[0]) / 2 - 20, P[1] + 22, 'ŷ − ȳ1：length² = SSR = ' + ssr.toFixed(1), 't', 'middle');
  o += text(P[0] + 10, (P[1] + Y[1]) / 2 - 4, 'e', 'tb') + text(P[0] + 10, (P[1] + Y[1]) / 2 + 14, 'SSE = ' + sse.toFixed(1), 't');
  o += text(30, 276, '浅色 plane：col(X) 中与 1 perpendicular 的部分，p 维', 'ts');
  o += text(30, 296, 'e 与 plane perpendicular，所以 SST = SSR + SSE；R² = cos²θ = ' + (ssr / sst).toFixed(3), 'ts');
  o += text(O[0] + 52, O[1] - 6, 'θ', 'ts');
  return svg(560, 306, o, '一个直角三角形：hypotenuse 是 y 减去 y bar，一条直角边是 y hat 减去 y bar，另一条是 residual e；三边长度的 square 分别是 SST、SSR、SSE');
}

// 第 5 站：Anscombe's quartet
function anscombe() {
  const xs = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
  const S = [
    ['I', xs, [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68]],
    ['II', xs, [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74]],
    ['III', xs, [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]],
    ['IV', [8, 8, 8, 8, 8, 8, 8, 19, 8, 8, 8], [6.58, 5.76, 7.71, 8.84, 8.47, 7.04, 5.25, 12.5, 5.56, 7.91, 6.89]],
  ];
  let o = '';
  S.forEach(([nm, x, y], k) => {
    const X0 = 50 + (k % 2) * 270, Y0 = 18 + Math.floor(k / 2) * 160;
    const sx = lin(2, 20, X0, X0 + 210), sy = lin(2, 14, Y0 + 120, Y0 + 10);
    const f = slr(x, y);
    o += rect(X0, Y0 + 10, 210, 110, 'frame');
    o += line(sx(2), sy(f.b0 + 2 * f.b1), sx(20), sy(f.b0 + 20 * f.b1), 'ln');
    x.forEach((v, i) => { o += circle(sx(v), sy(y[i]), 3.2, 'ink-f'); });
    o += text(X0 + 8, Y0 + 28, nm, 'tb');
    for (const t of [5, 10, 15]) o += text(sx(t), Y0 + 136, String(t), 'ts', 'middle');
    for (const t of [4, 8, 12]) o += text(X0 - 6, sy(t) + 4, String(t), 'ts', 'end');
  });
  o += text(280, 334, '四组 data 的 fitted line 都是 ŷ = 3.00 + 0.500x，R² 都是 0.67，slope 的 standard error 都是 0.118', 'ts', 'middle');
  return svg(560, 344, o, 'Anscombe 的四组 data：一组大致 linear，一组是 curve，一组有一个 outlier，一组的 slope 完全由一个点决定，但四组的 fitted line 和 R 方都一样');
}

// 第 5 站：word recall 的 residual plot，变换前后
function recall() {
  const t = [1, 5, 15, 30, 60, 120, 240, 480, 720, 1440, 2880, 5760, 10080];
  const p = [0.84, 0.71, 0.61, 0.56, 0.54, 0.47, 0.45, 0.38, 0.36, 0.26, 0.2, 0.16, 0.08];
  let o = '';
  const lt = t.map(Math.log);
  const panel = (x0, xs, title, lim, ticks, note) => {
    const f = slr(xs, p);
    const sx = lin(-0.5, 9.7, x0, x0 + 200), sy = lin(-lim, lim, 225, 45);
    o += rect(x0, 45, 200, 180, 'frame') + line(x0, sy(0), x0 + 200, sy(0), 'dash');
    lt.forEach((v, i) => { o += circle(sx(v), sy(f.e[i]), 3.5, 'ink-f'); });
    for (const [v, s] of [[0, '1'], [Math.log(60), '1 h'], [Math.log(1440), '1 d']]) o += line(sx(v), 225, sx(v), 229, 'axis') + text(sx(v), 241, s, 'ts', 'middle');
    o += text(x0 + 100, 22, title, 'tb', 'middle');
    for (const v of ticks) o += line(x0 - 4, sy(v), x0, sy(v), 'axis') + text(x0 - 7, sy(v) + 4, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2), 'ts', 'end');
    o += text(x0 + 100, 260, 'time（log scale）', 'ts', 'middle') + text(x0 + 100, 278, note, 'ts', 'middle');
  };
  panel(70, t, 'prop 对 time', 0.34, [-0.3, 0, 0.3], 'residual 先正、后负、再正');
  panel(340, lt, 'prop 对 ln(time)', 0.045, [-0.04, 0, 0.04], 'residual 小了一个 order');
  o += text(280, 302, '两个 panel 的 vertical scale 不同：右边的 residual 最大只有 0.038', 'ts', 'middle');
  return svg(560, 312, o, 'Word recall data 的 residual 按 time 排开的图：左边对 time 做 regression，residual 呈 U 形；右边对 log time 做 regression，residual 小得多');
}

// 第 5 站：一个点的 influence
function influence() {
  const sx = lin(61.5, 76.5, 60, 360), sy = lin(110, 215, 262, 24);
  const all = slr(HT, WT), drop = slr(HT.slice(0, 9), WT.slice(0, 9));
  let o = axes({ sx, sy, x0: 61.5, x1: 76.5, y0: 110, y1: 215, xt: [63, 66, 69, 72, 75], yt: [120, 140, 160, 180, 200], xl: 'height（inch）', yl: 'weight（lb）', grid: true });
  o += line(sx(62), sy(all.b0 + all.b1 * 62), sx(76.2), sy(all.b0 + all.b1 * 76.2), 'ln');
  o += line(sx(62), sy(drop.b0 + drop.b1 * 62), sx(76.2), sy(drop.b0 + drop.b1 * 76.2), 'dash');
  HT.forEach((h, i) => { o += circle(sx(h), sy(WT[i]), i === 9 ? 6 : 4.5, i === 9 ? 'ln paper-f' : 'ink-f'); });
  const pr = drop.b0 + drop.b1 * 75;
  o += line(sx(75) + 10, sy(208), sx(75) + 10, sy(pr), 'ink-b') + text(sx(75) + 15, (sy(208) + sy(pr)) / 2 + 4, '21.4', 'ts');
  o += text(395, 46, '空心点：第 10 个学生', 'tb') + text(395, 66, '75 inch，208 lb', 't');
  o += text(395, 90, 'leverage h = 0.335', 't') + text(395, 110, 'residual e = 14.2', 't') + text(395, 130, "Cook's D = 1.03", 't');
  o += line(395, 160, 425, 160, 'ln') + text(432, 164, '10 个点：slope ' + all.b1.toFixed(2), 't');
  o += line(395, 184, 425, 184, 'dash') + text(432, 188, '去掉它：slope ' + drop.b1.toFixed(2), 't');
  o += text(395, 222, '短竖线：去掉它之后的 line', 'ts') + text(395, 240, '预测它的 weight 会差 21.4，', 'ts') + text(395, 258, '即 e / (1 − h)', 'ts');
  return svg(560, 306, o, '去掉第 10 个学生之后 slope 从 6.14 变成 5.25；这个点的 leverage 是 0.335，Cook 距离是 1.03');
}

// 第 6 站：(β2, β4) 的 joint confidence region 与两个单独的 interval
function ellipse() {
  const x1 = HALD.map((r) => r[0]), x2 = HALD.map((r) => r[1]), x4 = HALD.map((r) => r[3]), y = HALD.map((r) => r[4]);
  const m = ols([x1, x2, x4], y), mse = m.sse / (m.n - m.p);
  const b = [m.b[2], m.b[3]], C = [[mse * m.XtXi[2][2], mse * m.XtXi[2][3]], [mse * m.XtXi[3][2], mse * m.XtXi[3][3]]];
  // ellipse：(β − b)ᵀ C⁻¹ (β − b) ≤ 2 F
  const a = C[0][0], bb = C[0][1], c = C[1][1];
  const mid = (a + c) / 2, r = Math.hypot((a - c) / 2, bb), l1 = mid + r, l2 = mid - r;
  const th = Math.atan2(l1 - a, bb), k = Math.sqrt(2 * F29);
  const sx = lin(-0.6, 1.4, 70, 390), sy = lin(-0.9, 0.5, 262, 34);
  let o = axes({ sx, sy, x0: -0.6, x1: 1.4, y0: -0.9, y1: 0.5, xt: [[-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], yt: [[-0.8, '−0.8'], [-0.4, '−0.4'], [0, '0'], [0.4, '0.4']], xl: 'β₂', yl: 'β₄', grid: true });
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const t = (2 * Math.PI * i) / 200, u = k * Math.sqrt(l1) * Math.cos(t), v = k * Math.sqrt(l2) * Math.sin(t);
    pts.push([sx(b[0] + u * Math.cos(th) - v * Math.sin(th)), sy(b[1] + u * Math.sin(th) + v * Math.cos(th))]);
  }
  o += path(d(pts) + 'Z', 'wash ln');
  const h0 = T9 * Math.sqrt(a), h1 = T9 * Math.sqrt(c);
  o += rect(sx(b[0] - h0), sy(b[1] + h1), sx(b[0] + h0) - sx(b[0] - h0), sy(b[1] - h1) - sy(b[1] + h1), 'ln-dash');
  o += circle(sx(b[0]), sy(b[1]), 4, 'ink-f') + circle(sx(0), sy(0), 5, 'ink paper-f');
  o += text(sx(0) - 8, sy(0) - 9, '(0, 0)', 'tb', 'end');
  o += text(sx(b[0]) + 8, sy(b[1]) + 16, '(β̂₂, β̂₄)', 't');
  o += text(405, 60, '虚线 rectangle：', 'tb') + text(405, 80, '两个单独的 95% CI', 't') + text(405, 98, '都包含 0', 't');
  o += text(405, 134, '细长的 ellipse：', 'tl') + text(405, 154, '(β₂, β₄) 的 joint', 't') + text(405, 172, '95% confidence region', 't') + text(405, 190, '离 (0, 0) 很远', 't');
  o += text(405, 226, 'x₂ 与 x₄ 的 correlation', 'ts') + text(405, 244, '是 −0.973，两个 estimate', 'ts') + text(405, 262, '的 correlation 是 +0.97', 'ts');
  return svg(560, 296, o, 'Hald data 中 beta2 和 beta4 的 joint confidence ellipse 又窄又长，不包含原点；而两个单独的 confidence interval 组成的 rectangle 包含原点');
}

// 第 6 站：全部 15 个 subset 的 Cp
function cp() {
  const y = HALD.map((r) => r[4]), cols = [0, 1, 2, 3].map((j) => HALD.map((r) => r[j]));
  const full = ols(cols, y), msef = full.sse / (full.n - full.p);
  const res = [];
  for (let mask = 1; mask < 16; mask++) {
    const c = [0, 1, 2, 3].filter((j) => mask & (1 << j));
    const m = ols(c.map((j) => cols[j]), y);
    res.push({ c, k: c.length + 1, cp: m.sse / msef - 13 + 2 * (c.length + 1) });
  }
  const ly = (v) => Math.log10(v);
  const sx = lin(1.5, 5.5, 80, 420), sy = lin(ly(1.5), ly(400), 262, 26);
  let o = '';
  for (const v of [2, 5, 10, 20, 50, 100, 200]) o += line(sx(1.5), sy(ly(v)), sx(5.5), sy(ly(v)), 'grid') + text(sx(1.5) - 7, sy(ly(v)) + 4, String(v), 'ts', 'end');
  for (const k of [2, 3, 4, 5]) o += text(sx(k), 280, String(k), 'ts', 'middle');
  o += line(sx(1.5), 262, sx(5.5), 262, 'axis') + line(sx(1.5), 262, sx(1.5), 26, 'axis');
  o += text(sx(5.5), 298, 'p + 1（parameter 个数）', 'ts', 'end') + text(sx(1.5) - 4, 16, 'Cp（log scale）', 'ts');
  o += line(sx(1.5), sy(ly(1.5)), sx(5.5), sy(ly(5.5)), 'dash');
  const name = (c) => c.map((j) => 'x' + '₁₂₃₄'[j]).join('');
  const off = { 'x₁x₂': [0, 20, 'middle'], 'x₁x₄': [-10, 4, 'end'], 'x₁x₂x₄': [0, 22, 'middle'], 'x₁x₃x₄': [-10, -12, 'end'], 'x₁x₂x₃x₄': [0, 20, 'middle'], 'x₃x₄': [-10, 4, 'end'], 'x₂x₃x₄': [10, 4, 'start'] };
  for (const r of res) {
    const nm = name(r.c), hi = ['x₁x₂', 'x₁x₂x₄', 'x₁x₂x₃'].includes(nm);
    o += circle(sx(r.k), sy(ly(r.cp)), hi ? 5 : 3.8, hi ? 'ln-f' : 'ink-f');
    if (off[nm]) o += text(sx(r.k) + off[nm][0], sy(ly(r.cp)) + off[nm][1], nm === 'x₁x₂x₄' ? 'x₁x₂x₄ 与 x₁x₂x₃' : nm, hi ? 'tl' : 'ts', off[nm][2]);
  }
  o += text(sx(2) + 10, sy(ly(140)) + 4, 'x₂、x₄', 'ts');
  o += text(440, 120, '虚线：Cp = p + 1', 't') + text(440, 140, 'model 没有 bias 时', 'ts') + text(440, 156, 'Cp 应该落在它附近', 'ts');
  o += text(440, 196, 'Full model 的 Cp', 'ts') + text(440, 212, '按定义恰好等于 5', 'ts');
  return svg(560, 312, o, 'Hald data 全部 15 个 subset 的 Mallows Cp 对 parameter 个数作图；x1 x2、x1 x2 x4、x1 x2 x3 三个 model 落在 Cp 等于 p 加 1 的线附近');
}

// 第 7 站：PlantGrowth 三组
function plant() {
  const g = [[4.17, 5.58, 5.18, 6.11, 4.5, 4.61, 5.17, 4.53, 5.33, 5.14], [4.81, 4.17, 4.41, 3.59, 5.87, 3.83, 6.03, 4.89, 4.32, 4.69], [6.31, 5.12, 5.54, 5.5, 5.37, 5.29, 4.92, 6.15, 5.8, 5.26]];
  const names = ['ctrl', 'trt1', 'trt2'], all = g.flat(), gm = mean(all);
  const sy = lin(3.4, 6.5, 262, 26), X = [130, 250, 370];
  let o = '';
  for (const v of [3.5, 4, 4.5, 5, 5.5, 6, 6.5]) o += line(60, sy(v), 440, sy(v), 'grid') + text(54, sy(v) + 4, v.toFixed(1), 'ts', 'end');
  o += line(60, 262, 440, 262, 'axis') + line(60, 262, 60, 26, 'axis') + text(56, 16, 'weight', 'ts');
  o += line(70, sy(gm), 430, sy(gm), 'dash') + text(436, sy(gm) + 4, 'ȳ = ' + gm.toFixed(3), 'ts');
  g.forEach((grp, k) => {
    const m = mean(grp), sorted = [...grp].sort((a, b) => a - b);
    const seen = {};
    sorted.forEach((v) => { const key = v.toFixed(1); seen[key] = (seen[key] || 0) + 1; const dx = ((seen[key] % 2 ? 1 : -1) * Math.floor(seen[key] / 2)) * 9; o += circle(X[k] - 26 + dx, sy(v), 3.6, 'ink-f'); });
    o += line(X[k] - 50, sy(m), X[k] + 10, sy(m), 'ln') + text(X[k] + 16, sy(m) + 16, m.toFixed(3), 'tl');
    o += text(X[k] - 20, 282, names[k], 'tb', 'middle');
  });
  return svg(560, 292, o, 'PlantGrowth 三组 plant 的 weight，每组 10 个点和各自的 group mean，虚线是 overall mean');
}

// 第 7 站：additive model 的 parallel lines 与 interaction 的不 parallel 的 lines（PSU STAT 501 Lesson 8 的 fitted equation）
function lines() {
  let o = '';
  {
    const sx = lin(28, 42, 55, 245), sy = lin(1500, 3800, 240, 40);
    o += axes({ sx, sy, x0: 28, x1: 42, y0: 1500, y1: 3800, xt: [30, 34, 38, 42], yt: [2000, 3000], xl: 'Gest（week）', yl: 'Wgt（gram）' });
    const ns = (gw) => -2390 + 143.1 * gw, sm = (gw) => -2390 + 143.1 * gw - 244.5;
    o += line(sx(28), sy(ns(28)), sx(42), sy(ns(42)), 'ln') + line(sx(28), sy(sm(28)), sx(42), sy(sm(42)), 'ink-b');
    o += text(sx(32.5), sy(ns(32.5)) - 10, 'non-smoker', 'tl', 'end') + text(sx(36), sy(sm(36)) + 22, 'smoker', 'tb', 'start');
    o += line(sx(40), sy(ns(40)), sx(40), sy(sm(40)), 'mute') + text(sx(40) + 4, sy(sm(40)) + 18, '相差 244.5', 'ts', 'start');
    o += text(150, 18, 'Additive：两条 parallel line', 'tb', 'middle');
  }
  {
    const sx = lin(18, 66, 330, 530), sy = lin(20, 75, 240, 40);
    o += axes({ sx, sy, x0: 18, x1: 66, y0: 20, y1: 75, xt: [20, 35, 50, 65], yt: [30, 50, 70], xl: 'age', yl: 'y' });
    const L = { A: [47.51, 0.3304], B: [28.92, 0.5234], C: [6.21, 1.0334] };
    const cls = { A: 'ln', B: 'ink', C: 'ink-b' };
    for (const [k, [a, b]] of Object.entries(L)) o += line(sx(18), sy(a + b * 18), sx(66), sy(a + b * 66), cls[k]);
    o += text(sx(19), sy(L.A[0] + L.A[1] * 19) - 8, 'A', 'tl') + text(sx(19), sy(L.B[0] + L.B[1] * 19) - 8, 'B', 'tb') + text(sx(21), sy(L.C[0] + L.C[1] * 21) + 16, 'C', 'tb');
    o += text(430, 18, 'Interaction：slope 各不相同', 'tb', 'middle');
  }
  o += text(150, 284, 'Birth weight 与 smoking（n = 32）', 'ts', 'middle') + text(430, 284, 'Depression 的三种 treatment（n = 36）', 'ts', 'middle');
  return svg(560, 294, o, '左图：smoker 和 non-smoker 的两条 fitted line 平行，相差 244.5 克；右图：三种 treatment 的 fitted line slope 不同，彼此相交');
}

// 第 8 站：Challenger 的 0/1 data、linear probability model 与 logistic curve
function logit() {
  const T = [53, 57, 58, 63, 66, 67, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81];
  const Y = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
  // logistic regression：Newton / IRLS
  let b = [0, 0];
  for (let it = 0; it < 30; it++) {
    let g0 = 0, g1 = 0, h00 = 0, h01 = 0, h11 = 0;
    T.forEach((t, i) => { const p = 1 / (1 + Math.exp(-(b[0] + b[1] * t))), w = p * (1 - p); g0 += Y[i] - p; g1 += (Y[i] - p) * t; h00 += w; h01 += w * t; h11 += w * t * t; });
    const det = h00 * h11 - h01 * h01;
    b = [b[0] + (h11 * g0 - h01 * g1) / det, b[1] + (h00 * g1 - h01 * g0) / det];
  }
  const lpm = slr(T, Y);
  const sx = lin(28, 84, 60, 470), sy = lin(-0.5, 1.85, 262, 26);
  let o = axes({ sx, sy, x0: 28, x1: 84, y0: -0.35, y1: 1.85, xt: [30, 40, 50, 60, 70, 80], yt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], xl: 'temperature（°F）', yl: 'P(damage)', xAt: -0.5 });
  o += line(sx(28), sy(0), sx(84), sy(0), 'mute') + line(sx(28), sy(1), sx(84), sy(1), 'mute');
  o += rect(sx(53), sy(1.85), sx(81) - sx(53), sy(-0.5) - sy(1.85), 'wash2');
  o += line(sx(28), sy(lpm.b0 + lpm.b1 * 28), sx(84), sy(lpm.b0 + lpm.b1 * 84), 'dash');
  o += path(curve((t) => 1 / (1 + Math.exp(-(b[0] + b[1] * t))), 28, 84, sx, sy), 'ln');
  const seen = {};
  T.forEach((t, i) => { const key = t + '-' + Y[i]; seen[key] = (seen[key] || 0) + 1; o += circle(sx(t), sy(Y[i]) + (Y[i] ? -1 : 1) * (seen[key] - 1) * 8, 3.6, 'ink-f'); });
  o += line(sx(31), sy(-0.5), sx(31), sy(1.85), 'grid') + text(sx(31) + 4, sy(-0.4), '31°F', 'ts');
  o += text(sx(67), sy(1.62), '有 data 的范围', 'ts', 'middle');
  o += text(sx(37), sy(1.74), 'linear：在 31°F 给出 1.75', 'ts');
  o += text(sx(84) - 2, sy(-0.42), 'linear：在 81°F 给出 −0.12', 'ts', 'end');
  o += text(sx(55), sy(0.62), 'logistic curve', 'tl', 'end');
  return svg(560, 312, o, 'Challenger 之前 23 次发射：O-ring 有没有损伤对 temperature 作图，linear probability model 的直线跑出 0 到 1 之外，logistic curve 始终在 0 和 1 之间');
}

const CH_T = [53, 57, 58, 63, 66, 67, 67, 67, 68, 69, 70, 70, 70, 70, 72, 73, 75, 75, 76, 76, 78, 79, 81];
const CH_Y = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0];

// 开头第三件：对 0/1 的 damage 做 linear regression，line 跑出 [0, 1]
function lpm() {
  const f = slr(CH_T, CH_Y), at = (t) => f.b0 + f.b1 * t;
  const sx = lin(28, 84, 60, 500), sy = lin(-0.4, 1.9, 250, 28);
  let o = axes({ sx, sy, x0: 28, x1: 84, y0: -0.4, y1: 1.9, xt: [30, 40, 50, 60, 70, 80], yt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], xl: 'temperature（°F）', yl: 'damage（0 或 1）', xAt: -0.4 });
  o += line(sx(28), sy(0), sx(84), sy(0), 'mute') + line(sx(28), sy(1), sx(84), sy(1), 'mute');
  o += line(sx(28), sy(at(28)), sx(84), sy(at(84)), 'ln');
  const seen = {};
  CH_T.forEach((t, i) => { const k = t + '-' + CH_Y[i]; seen[k] = (seen[k] || 0) + 1; o += circle(sx(t), sy(CH_Y[i]) + (CH_Y[i] ? -1 : 1) * (seen[k] - 1) * 8, 3.6, 'ink-f'); });
  for (const t of [31, 81]) o += circle(sx(t), sy(at(t)), 4.5, 'ln-f');
  o += text(sx(31) + 10, sy(at(31)) + 4, `31°F：${at(31).toFixed(2)}`, 'tl');
  o += text(sx(81) - 4, sy(at(81)) + 22, `81°F：${at(81).toFixed(2).replace('-', '−')}`, 'tl', 'end');
  o += text(sx(54), sy(1.55), `ŷ = ${f.b0.toFixed(3)} − ${(-f.b1).toFixed(4)} T`, 't');
  return svg(560, 290, o, 'Challenger 之前 23 次发射的 O-ring 损伤（0 或 1）对 temperature 作图，least squares 的直线在 31°F 给出 1.75，在 81°F 给出负的 0.12');
}

// 第 1 站：y 对 x、x 对 y 的两条 regression line，以及 SD line
function reverse() {
  const f = slr(HT, WT), g = slr(WT, HT), yb = mean(WT), xb = mean(HT);
  const sdx = Math.sqrt(f.sxx / 9), sdy = Math.sqrt(g.sxx / 9);
  const k1 = f.b1, k2 = 1 / g.b1, k0 = sdy / sdx;
  const sx = lin(61.5, 76.5, 60, 360), sy = lin(105, 220, 268, 24);
  let o = axes({ sx, sy, x0: 61.5, x1: 76.5, y0: 105, y1: 220, xt: [63, 66, 69, 72, 75], yt: [120, 140, 160, 180, 200], xl: 'height（inch）', yl: 'weight（lb）', grid: true });
  const L = (k, cls) => { const x0 = Math.max(61.8, xb + (106 - yb) / k), x1 = Math.min(76.3, xb + (218 - yb) / k); return line(sx(x0), sy(yb + k * (x0 - xb)), sx(x1), sy(yb + k * (x1 - xb)), cls); };
  o += L(k0, 'dash') + L(k2, 'ink-b') + L(k1, 'ln');
  HT.forEach((h, i) => { o += circle(sx(h), sy(WT[i]), 4, 'mute-f'); });
  o += circle(sx(xb), sy(yb), 5, 'ink-f') + text(sx(xb) + 8, sy(yb) + 18, '(x̄, ȳ)', 'ts');
  o += line(380, 60, 410, 60, 'ln') + text(416, 64, 'y 对 x：slope ' + k1.toFixed(2), 'tl') + text(416, 82, 'vertical residual 最小', 'ts');
  o += line(380, 114, 410, 114, 'ink-b') + text(416, 118, 'x 对 y：slope ' + k2.toFixed(2), 'tb') + text(416, 136, 'horizontal residual 最小', 'ts');
  o += line(380, 168, 410, 168, 'dash') + text(416, 172, 'SD line：slope ' + k0.toFixed(2), 't') + text(416, 190, 'sd(y) / sd(x)，夹在中间', 'ts');
  o += text(380, 228, `6.48 × r = ${k1.toFixed(2)}`, 'ts') + text(380, 246, `6.48 ÷ r = ${k2.toFixed(2)}`, 'ts');
  return svg(560, 306, o, 'Height 与 weight 的 scatter plot 上三条都经过 mean 点的 line：y 对 x 的 regression line slope 6.14，x 对 y 解出来的 line slope 6.84，SD line slope 6.48 在两者之间');
}

// 第 6 站：Hald data 上 forward 与 backward 走的路
function stepwise() {
  const X = [0, 1, 2, 3].map((j) => HALD.map((r) => r[j])), Y = HALD.map((r) => r[4]);
  const S = (ids) => ols(ids.map((j) => X[j]), Y).sse;
  const sst = Y.reduce((a, v) => a + (v - mean(Y)) ** 2, 0);
  const pf = (r, f, p) => (S(r) - S(f)) / (S(f) / (13 - p - 1));
  const nodes = [
    { ids: [], x: 70, y: 60, lab: '∅（只有 intercept）', sse: sst },
    { ids: [3], x: 70, y: 150, lab: '{x₄}' },
    { ids: [0, 3], x: 70, y: 240, lab: '{x₁, x₄}' },
    { ids: [0, 1, 3], x: 300, y: 240, lab: '{x₁, x₂, x₄}' },
    { ids: [0, 1], x: 300, y: 150, lab: '{x₁, x₂}' },
  ];
  let o = '';
  const box = (nd, cls) => { const sse = nd.sse ?? S(nd.ids); return rect(nd.x - 62, nd.y - 22, 124, 44, cls, 6) + text(nd.x, nd.y - 4, nd.lab, 'tb', 'middle') + text(nd.x, nd.y + 13, 'SSE ' + sse.toFixed(2), 'ts', 'middle'); };
  const [n0, n1, n2, n3, n4] = nodes;
  o += arrow(n0.x, n0.y + 22, n1.x, n1.y - 24, 'ink') + text(n0.x + 8, (n0.y + n1.y) / 2 + 4, '第 1 步：单个 predictor 里 SSE 最小', 'ts');
  o += arrow(n1.x, n1.y + 22, n2.x, n2.y - 24, 'ink') + text(n1.x + 8, (n1.y + n2.y) / 2 + 4, `加 x₁：partial F = ${pf([3], [0, 3], 2).toFixed(1)}`, 'ts');
  o += arrow(n2.x + 62, n2.y, n3.x - 64, n3.y, 'dash') + text((n2.x + n3.x) / 2, n2.y - 8, `加 x₂：F = ${pf([0, 3], [0, 1, 3], 3).toFixed(2)}`, 'ts', 'middle') + text((n2.x + n3.x) / 2, n2.y + 42, 'p = 0.052：门槛 0.05 时停在 {x₁, x₄}', 'ts', 'middle');
  o += arrow(n3.x, n3.y - 22, n4.x, n4.y + 24, 'ln') + text(n3.x + 8, (n3.y + n4.y) / 2 + 4, 'backward：删 x₄（t = −1.37）', 'tl');
  o += box(n0, 'paper') + box(n1, 'paper') + box(n2, 'paper') + box(n3, 'paper') + box(n4, 'wash');
  o += text(n4.x + 70, n4.y - 4, '两个 predictor 里', 'ts') + text(n4.x + 70, n4.y + 12, 'SSE 最小的 model', 'ts');
  o += text(300, 60, 'forward 从上往下，backward 从右下往上', 'tb', 'middle');
  return svg(560, 296, o, 'Hald data 的 stepwise：forward 从空 model 依次加入 x4、x1，再加 x2 的 p-value 是 0.052；backward 从 x1、x2、x4 删去 x4 得到 x1、x2。两个方向停在不同的 model，最好的两 predictor model x1、x2 里没有 forward 第一步选的 x4');
}

// 第 7 站：2 × 2 的 two-factor 例子，cell mean 的 interaction plot
function twoway() {
  const cells = { A1: [[10, 12], [14, 16]], A2: [[15, 13], [25, 27]] };
  const sx = lin(0, 1, 140, 380), sy = lin(8, 30, 250, 30);
  let o = axes({ sx, sy, x0: -0.25, x1: 1.25, y0: 8, y1: 30, xt: [[0, 'B₁'], [1, 'B₂']], yt: [10, 15, 20, 25, 30], yl: 'y' });
  const mu = {};
  for (const [a, cls] of [['A1', 'ink-b'], ['A2', 'ln']]) {
    const m = cells[a].map((c) => (c[0] + c[1]) / 2);
    mu[a] = m;
    o += line(sx(0), sy(m[0]), sx(1), sy(m[1]), cls);
    cells[a].forEach((c, j) => c.forEach((v) => { o += circle(sx(j) + (a === 'A1' ? -10 : 10), sy(v), 3, 'mute-f'); }));
    m.forEach((v, j) => { o += circle(sx(j), sy(v), 5, cls === 'ln' ? 'ln-f' : 'ink-f'); });
    o += text(sx(1) + 16, sy(m[1]) + 4, `${a.replace('1', '₁').replace('2', '₂')}（cell mean ${m[0]}, ${m[1]}）`, cls === 'ln' ? 'tl' : 'tb');
  }
  const gap = (j) => mu.A2[j] - mu.A1[j];
  o += line(sx(0) - 30, sy(mu.A1[0]), sx(0) - 30, sy(mu.A2[0]), 'ink') + text(sx(0) - 36, sy((mu.A1[0] + mu.A2[0]) / 2) + 4, 'A 的作用 ' + gap(0), 'ts', 'end');
  o += line(sx(1) - 26, sy(mu.A1[1]), sx(1) - 26, sy(mu.A2[1]), 'ink') + text(sx(1) - 32, sy((mu.A1[1] + mu.A2[1]) / 2) + 4, 'A 的作用 ' + gap(1), 'ts', 'end');
  o += text(sx(0.5), 22, '两条 line 不 parallel：interaction', 'tb', 'middle');
  return svg(560, 285, o, '2 乘 2 的例子：A1 的 cell mean 从 11 到 15，A2 从 14 到 26。A 的作用在 B1 是 3，在 B2 是 11，两条 line 不平行');
}

export default {
  'st3131-fit': fit,
  'st3131-bands': bands,
  'st3131-avplot': avplot,
  'st3131-triangle': triangle,
  'st3131-anscombe': anscombe,
  'st3131-recall': recall,
  'st3131-influence': influence,
  'st3131-ellipse': ellipse,
  'st3131-cp': cp,
  'st3131-plant': plant,
  'st3131-lines': lines,
  'st3131-logit': logit,
  'st3131-lpm': lpm,
  'st3131-reverse': reverse,
  'st3131-stepwise': stepwise,
  'st3131-twoway': twoway,
};
