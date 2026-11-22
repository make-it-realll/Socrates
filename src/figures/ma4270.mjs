import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const neg = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// +1 画实心，−1 画空心
const dot = (x, y, lab, r = 5) => (lab > 0 ? circle(x, y, r, 'ln-f') : circle(x, y, r, 'paper'));
// 一组只在某些 keyframe 出现的元素
const fr = (body, on, kt, dur) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, dur)}</g>`;
// 直线 a·x + b·y = c 与矩形 [x0,x1]×[y0,y1] 的交线段
function clip(a, b, c, x0, x1, y0, y1) {
  const P = [];
  if (Math.abs(b) > 1e-12) for (const x of [x0, x1]) { const y = (c - a * x) / b; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) P.push([x, y]); }
  if (Math.abs(a) > 1e-12) for (const y of [y0, y1]) { const x = (c - b * y) / a; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) P.push([x, y]); }
  const u = [];
  for (const p of P) if (!u.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-9)) u.push(p);
  return u.length >= 2 ? [u[0], u[1]] : null;
}
// 带 partial pivoting 的 Gaussian elimination
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(M[i][k]) > Math.abs(M[p][k])) p = i;
    [M[k], M[p]] = [M[p], M[k]];
    for (let i = k + 1; i < n; i++) { const m = M[i][k] / M[k][k]; for (let j = k; j <= n; j++) M[i][j] -= m * M[k][j]; }
  }
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]; x[i] = s / M[i][i]; }
  return x;
}
// symmetric matrix 的 Jacobi eigenvalue algorithm：返回按 eigenvalue 从大到小排好的 [values, vectors(列)]
function jacobi(A0) {
  const n = A0.length, A = A0.map((r) => [...r]), V = A0.map((_, i) => A0.map((__, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-15) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  const idx = [...Array(n).keys()].sort((i, j) => A[j][j] - A[i][i]);
  return [idx.map((i) => A[i][i]), idx.map((i) => V.map((r) => r[i]))];
}
// 可复现的 pseudo-random number：LCG 加 Box–Muller
function rng(seed) {
  let s = seed >>> 0;
  const u = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
  return { u, g: () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()) };
}
const sig = (z) => 1 / (1 + Math.exp(-z));

// 两个 ring：12 个点在 radius 1 上标 −1，18 个点在 radius 3 上标 +1
const RINGS = [
  ...Array.from({ length: 12 }, (_, i) => { const a = (2 * Math.PI * i) / 12 + 0.1; return [Math.cos(a), Math.sin(a), -1]; }),
  ...Array.from({ length: 18 }, (_, i) => { const a = (2 * Math.PI * i) / 18; return [3 * Math.cos(a), 3 * Math.sin(a), 1]; }),
];

// ---------- 开头：同心的两圈点，没有 line 能分开 ----------
function rings() {
  const sx = lin(-3.8, 3.8, 160, 400), sy = lin(-3.8, 3.8, 250, 10);
  let o = rect(160, 10, 240, 240, 'frame');
  for (const [a, b, c] of [[1, 0.35, 0.6], [0.3, -1, 0.9], [1, 1, -1.8]]) {
    const s = clip(a, b, c, -3.8, 3.8, -3.8, 3.8);
    o += line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), 'dash');
  }
  for (const [x, y, l] of RINGS) o += dot(sx(x), sy(y), l, 4.5);
  o += circle(40, 40, 4.5, 'ln-f') + text(52, 44, '+1：radius 3', 'ts') + circle(40, 64, 4.5, 'paper') + text(52, 68, '−1：radius 1', 'ts');
  o += text(420, 120, '三条虚线是随手', 'ts') + text(420, 137, '挑的 line：每条', 'ts') + text(420, 154, '两边都混着两种点', 'ts');
  o += text(280, 272, '−1 的点被 +1 的点围在中间，任何 halfplane 都没法只含其中一种', 'ts', 'middle');
  return svg(560, 280, o, '内圈 12 个点标 −1，外圈 18 个点标 +1，三条直线都把两种点切在同一边');
}

// ---------- 开头：logistic regression 在 separable data 上，GD 让 c 一直变大 ----------
function sigmoidA() {
  const ks = [0, 1, 10, 100, 1000, 10000];
  const dL = (c) => -2 / (1 + Math.exp(c)) - 4 / (1 + Math.exp(2 * c));
  const L = (c) => 2 * Math.log1p(Math.exp(-c)) + 2 * Math.log1p(Math.exp(-2 * c));
  const cs = []; let c = 0;
  for (let k = 0; k <= 10000; k++) { if (ks.includes(k)) cs.push(c); c -= dL(c); }
  const sx = lin(-3, 3, 60, 380), sy = lin(-0.08, 1.08, 220, 30);
  let o = axes({ sx, sy, x0: -3, x1: 3, y0: 0, y1: 1, xt: [-2, -1, 0, 1, 2].map((v) => [v, neg(v, 0)]), yt: [0, 0.5, 1], yAt: -3, xl: 'x' });
  o += text(64, 22, 'P(y = +1 | x) = g(cx)', 'ts');
  const T = 9, n = ks.length, kt = [], on = (i) => ks.map((_, j) => j === i);
  for (let i = 0; i < n; i++) kt.push(i / n);
  cs.forEach((cv, i) => {
    let g = path(curve((x) => sig(cv * x), -3, 3, sx, sy), 'ln');
    g += text(400, 70, 'GD 第 ' + ks[i] + ' 步', 'tb') + text(400, 94, 'c = ' + cv.toFixed(2), 't') + text(400, 116, 'training loss = ' + (L(cv) < 1e-3 ? L(cv).toExponential(1).replace('e-', '×10^−') : L(cv).toFixed(3)), 't');
    g += text(400, 140, 'x = 1 处的 probability', 'ts') + text(400, 157, sig(cv).toFixed(cv > 6 ? 5 : 3), 'ts');
    o += fr(g, on(i), kt, T);
  });
  for (const [x, l] of [[-2, -1], [-1, -1], [1, 1], [2, 1]]) o += dot(sx(x), sy(l > 0 ? 1 : 0), l, 5.5);
  o += text(220, 252, 'Data 是 separable 的：c 越大，四个点的 loss 越小，没有一个有限的 c 是 minimum', 'ts', 'middle');
  return svgA(560, 262, o, '动图：四个点 x 等于负二、负一标负，一、二标正；gradient descent 的迭代让 sigmoid 越来越陡，c 从 0 涨到约 9.9，training loss 趋于 0');
}

// ---------- 第 1 站：perceptron 一步步更新 ----------
const PX = [[2, 1], [1, 3], [-1, 2.5], [-2, -1], [0.5, -2], [3, -0.5]], PY = [1, 1, 1, -1, -1, -1];
function perceptronA() {
  const ths = [[0, 0], [2, 1], [-1, 1.5], [1, 2.5], [-2, 3], [0, 4]], upd = [0, 5, 0, 5, 0];
  const sx = lin(-3.5, 4, 20, 290), sy = lin(-3, 4.2, 272, 12);
  const B = [-3.5, 4, -3, 4.2];
  let o = rect(20, 12, 270, 260, 'frame') + line(sx(-3.5), sy(0), sx(4), sy(0), 'grid') + line(sx(0), sy(-3), sx(0), sy(4.2), 'grid');
  const T = 10, n = 6, kt = Array.from({ length: n }, (_, i) => i / n), on = (i) => kt.map((_, j) => j === i);
  for (let k = 1; k <= 5; k++) {
    const [a, b] = ths[k];
    const s = clip(a, b, 0, ...B), nrm = Math.hypot(a, b);
    let g = line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), 'ln');
    g += arrow(sx(0), sy(0), sx((a / nrm) * 1.3), sy((b / nrm) * 1.3), 'ln');
    // 正的那半边浅浅地涂上
    const half = [];
    for (const [x, y] of [[B[0], B[2]], [B[1], B[2]], [B[1], B[3]], [B[0], B[3]]]) if (a * x + b * y >= 0) half.push([x, y]);
    const pts = [...half, ...s].map(([x, y]) => [sx(x), sy(y)]);
    const cx = pts.reduce((t, p) => t + p[0], 0) / pts.length, cy = pts.reduce((t, p) => t + p[1], 0) / pts.length;
    pts.sort((p, q) => Math.atan2(p[1] - cy, p[0] - cx) - Math.atan2(q[1] - cy, q[0] - cx));
    g = poly(pts, 'wash') + g;
    if (k < 5) { const t = upd[k]; g += circle(sx(PX[t][0]), sy(PX[t][1]), 10, 'ln-dash'); }
    const m = PX.map((x, t) => PY[t] * (a * x[0] + b * x[1]));
    const tx = 310;
    g += text(tx, 30, '第 ' + k + ' 次 update 之后', 'tb');
    g += text(tx, 54, 'θ' + sub('(' + k + ')') + ' = (' + neg(a, 1) + ', ' + neg(b, 1) + ')', 't');
    g += text(tx, 78, '(θ*)ᵀθ' + sub('(' + k + ')') + ' = ' + k + '　　≥ kγ = ' + k, 't');
    g += text(tx, 100, '‖θ' + sub('(' + k + ')') + '‖² = ' + (a * a + b * b).toFixed(2) + '　≤ kR² = ' + 10 * k, 't');
    g += text(tx, 126, '各点的 y' + sub('t') + 'θᵀx' + sub('t') + '：', 'ts');
    g += text(tx, 144, m.map((v) => neg(v, 1)).join('，'), 'ts');
    if (k < 5) g += text(tx, 172, '圈出的点分错了：θ ← θ + y' + sub('t') + 'x' + sub('t'), 'tl');
    else g += text(tx, 172, '六个点全部分对，停止', 'tl');
    o += fr(g, on(k - 1).map((v, j) => v || (k === 5 && j === 5)), kt, T);
  }
  // θ* 的 boundary 只在最后一帧出现
  const s = clip(-0.125, 1.25, 0, ...B);
  o += fr(line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), 'dash') + text(sx(s[1][0]) - 4, sy(s[1][1]) - 6, 'θ* 的 boundary', 'ts', 'end'), kt.map((_, j) => j === 5), kt, T);
  PX.forEach(([x, y], t) => { o += dot(sx(x), sy(y), PY[t]); });
  o += text(310, 210, 'R = √10（离原点最远的点是 (1, 3)）', 'ts') + text(310, 228, 'θ* = (−1/8, 5/4)，min y' + sub('t') + '(θ*)ᵀx' + sub('t') + ' = γ = 1', 'ts');
  o += text(310, 246, 'bound：k ≤ R²‖θ*‖²/γ² = 15.78', 'ts');
  return svgA(560, 282, o, '动图：perceptron 在六个点上从 θ 等于 0 出发，交替被 (2,1) 和 (3,−0.5) 修正，五次 update 后全部分对；右边显示每一步的 θ 以及两个 bound');
}

// ---------- 第 2 站：soft margin，C = 1 与 C = 10 ----------
function slack() {
  const X = [...PX, [2, -0.5]], Y = [...PY, 1];
  let o = '';
  const panel = (x0, th, b, title, note) => {
    const B = [-2.6, 3.6, -2.6, 3.6], sx = lin(B[0], B[1], x0, x0 + 245), sy = lin(B[2], B[3], 262, 30);
    o += rect(x0, 30, 245, 232, 'frame');
    for (const [c, cls] of [[0, 'ln'], [1, 'dash'], [-1, 'dash']]) {
      const s = clip(th[0], th[1], c - b, ...B);
      if (s) o += line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), cls);
    }
    X.forEach(([x, y], t) => {
      const m = Y[t] * (th[0] * x + th[1] * y + b), z = Math.max(0, 1 - m);
      o += dot(sx(x), sy(y), Y[t]);
      if (z > 1e-9) {
        // ζ 的标注：画出到 margin 线的距离
        if (t === 6 && x0 === 20) o += text(sx(x), sy(y) - 11, 'ζ = ' + z.toFixed(1), 'tl', 'middle');
        else o += text(sx(x) + (t === 6 ? 8 : 9), sy(y) + (t === 6 ? 16 : -7), 'ζ = ' + z.toFixed(z > 1.5 ? 3 : 1), 'tl', 'start');
      } else if (Math.abs(m - 1) < 1e-9) o += circle(sx(x), sy(y), 9, 'mute');
    });
    o += text(x0 + 122, 20, title, 'tb', 'middle');
    o += text(x0 + 122, 282, note, 'ts', 'middle');
  };
  panel(20, [0.2, 0.6], 0, 'C = 1：θ = (0.2, 0.6)，θ₀ = 0', 'margin 1/‖θ‖ = 1.58，Σζ = 2.2');
  panel(295, [-0.125, 1.25], 0, 'C = 10：θ = (−1/8, 5/4)，θ₀ = 0', 'margin 0.80，只牺牲 (2, −0.5)');
  o += text(280, 302, '实线是 θᵀx + θ₀ = 0，虚线是 ±1；灰圈是恰好在 margin 上的点；没有标 ζ 的点 ζ = 0', 'ts', 'middle');
  return svg(560, 310, o, '七个点的 soft-margin SVM：C 等于 1 时 margin 宽，(3,−0.5) 被分错、(2,−0.5) 落在 margin 内；C 等于 10 时 boundary 和只有六个点时一样，(2,−0.5) 被分错');
}

// ---------- 第 3 站：几种 loss 作为 margin z 的 function ----------
function losses() {
  const sx = lin(-2, 3, 50, 380), sy = lin(0, 4, 250, 20);
  let o = axes({ sx, sy, x0: -2, x1: 3, y0: 0, y1: 4, xt: [-2, -1, 0, 1, 2, 3].map((v) => [v, neg(v, 0)]), yt: [0, 1, 2, 3, 4], grid: true, xl: 'z = y(θᵀx + θ₀)' });
  o += path(d([[sx(-2), sy(1)], [sx(0), sy(1)], [sx(0), sy(0)], [sx(3), sy(0)]]), 'ink-b');
  o += path(curve((z) => Math.max(0, 1 - z), -2, 3, sx, sy), 'ln');
  o += path(curve((z) => Math.log2(1 + Math.exp(-z)), -2, 3, sx, sy), 'ln-dash');
  o += path(curve((z) => Math.exp(-z), -1.38, 3, sx, sy), 'dash');
  o += text(sx(-1.62), sy(1) - 8, '0-1 loss', 'tb', 'middle');
  o += text(sx(-1.2) + 6, sy(Math.exp(1.2)), 'exponential', 't', 'start');
  const tx = 400;
  o += text(tx, 40, '每一条都在 0-1 loss 上方', 'tb');
  o += line(tx, 60, tx + 22, 60, 'ln') + text(tx + 28, 64, 'hinge：[1 − z]₊（SVM）', 'ts');
  o += line(tx, 82, tx + 22, 82, 'ln-dash') + text(tx + 28, 86, 'logistic：log(1 + e⁻ᶻ)', 'ts');
  o += text(tx + 28, 104, '（除以 ln 2 让它过 (0, 1)）', 'ts');
  o += line(tx, 122, tx + 22, 122, 'dash') + text(tx + 28, 126, 'exponential：e⁻ᶻ', 'ts');
  o += text(tx, 150, 'z < 0：分错了', 'ts') + text(tx, 168, 'z 越大：分得越有把握', 'ts');
  o += text(tx, 196, 'z → ∞ 时，hinge 等于 0，', 'ts') + text(tx, 214, 'logistic 只是趋于 0', 'ts');
  return svg(560, 285, o, '0-1 loss、hinge loss、logistic loss 除以 ln 2、exponential loss 随 margin z 的变化，都在 0-1 loss 的上方');
}

// ---------- 第 4 站：ridge 的 θ̂ 在 noise 重抽 300 次后散成什么样 ----------
const RX = [[1, 1.1], [1, 0.9], [-1, -1], [0.5, 0.6], [-0.5, -0.4], [2, 2.1]];
function ridgeEst(lam, ys) {
  const A = [[0, 0], [0, 0]], c = [0, 0];
  RX.forEach(([a, b], i) => { A[0][0] += a * a; A[0][1] += a * b; A[1][1] += b * b; c[0] += a * ys[i]; c[1] += b * ys[i]; });
  A[1][0] = A[0][1]; A[0][0] += lam; A[1][1] += lam;
  const det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
  return [(A[1][1] * c[0] - A[0][1] * c[1]) / det, (-A[1][0] * c[0] + A[0][0] * c[1]) / det];
}
function ridgecloud() {
  const R = rng(20261122), draws = [];
  for (let k = 0; k < 300; k++) draws.push(RX.map(([a, b]) => a + b + R.g()));
  let o = '';
  const panel = (x0, lam, title) => {
    const sx = lin(-14, 16, x0, x0 + 240), sy = lin(-14, 16, 262, 22);
    o += rect(x0, 22, 240, 240, 'frame') + line(x0, sy(0), x0 + 240, sy(0), 'grid') + line(sx(0), 22, sx(0), 262, 'grid');
    let m = [0, 0];
    for (const ys of draws) { const [a, b] = ridgeEst(lam, ys); m[0] += a / 300; m[1] += b / 300; if (Math.abs(a) < 14 && Math.abs(b) < 14) o += circle(sx(a), sy(b), 1.8, 'ln-f'); }
    o += circle(sx(1), sy(1), 5, 'paper') + line(sx(1) - 3, sy(1), sx(1) + 3, sy(1), 'ink') + line(sx(1), sy(1) - 3, sx(1), sy(1) + 3, 'ink');
    o += text(x0 + 120, 14, title, 'tb', 'middle');
    o += text(x0 + 8, 255, 'θ' + sub('1') + ' 横轴，θ' + sub('2') + ' 纵轴，每格 10', 'ts');
    return m;
  };
  const m0 = panel(20, 0, 'λ = 0（least squares）');
  const m1 = panel(300, 1.5, 'λ = 1.5（ridge）');
  o += text(140, 282, '300 个 θ̂ 沿 (1, −1) 方向散开到 ±13', 'ts', 'middle') + text(140, 298, '平均 (' + m0.map((v) => v.toFixed(2)).join(', ') + ')，几乎正好是 θ*', 'ts', 'middle');
  o += text(420, 282, '300 个 θ̂ 挤成一个小点', 'ts', 'middle') + text(420, 298, '平均 (' + m1.map((v) => v.toFixed(2)).join(', ') + ')，比 θ* = (1, 1) 小一点', 'ts', 'middle');
  return svg(560, 305, o, '同一组 X、noise 重抽 300 次：least squares 的估计沿 (1,−1) 方向散得很开但平均正确，ridge 的估计聚成一团但平均略小于 θ*');
}
function ridgecurve() {
  const th = [1, 1], A = [[0, 0], [0, 0]];
  RX.forEach(([a, b]) => { A[0][0] += a * a; A[0][1] += a * b; A[1][1] += b * b; }); A[1][0] = A[0][1];
  const parts = (lam) => {
    const M0 = [[A[0][0] + lam, A[0][1]], [A[1][0], A[1][1] + lam]], det = M0[0][0] * M0[1][1] - M0[0][1] ** 2;
    const M = [[M0[1][1] / det, -M0[0][1] / det], [-M0[0][1] / det, M0[0][0] / det]];
    const Mt = [M[0][0] * th[0] + M[0][1] * th[1], M[1][0] * th[0] + M[1][1] * th[1]];
    const b2 = lam * lam * (Mt[0] ** 2 + Mt[1] ** 2);
    const MM = [[M[0][0] ** 2 + M[0][1] ** 2], [M[1][0] ** 2 + M[1][1] ** 2]];
    const v = M[0][0] + M[1][1] - lam * (MM[0][0] + MM[1][0]);
    return [b2, v, b2 + v];
  };
  const sx = logx(1e-3, 100, 60, 400), sy = logx(1e-3, 100, 250, 20);
  let o = axes({ sx, sy, x0: 1e-3, x1: 100, y0: 1e-3, y1: 100, xt: [[1e-3, '0.001'], [1e-2, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10'], [100, '100']], yt: [[1e-3, '0.001'], [1e-2, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10'], [100, '100']], grid: true, xl: 'λ' });
  const c = (k) => { const pts = []; for (let i = 0; i <= 300; i++) { const l = 10 ** (-3 + (5 * i) / 300), v = parts(l)[k]; if (v > 1e-3) pts.push([sx(l), sy(v)]); } return d(pts); };
  o += path(c(0), 'dash') + path(c(1), 'mute') + path(c(2), 'ln');
  o += text(sx(30), sy(parts(30)[0]) - 8, 'bias²', 'ts', 'end') + text(sx(0.004), sy(parts(0.004)[1]) - 8, 'variance', 'ts', 'start');
  o += circle(sx(1.489), sy(parts(1.489)[2]), 4.5, 'ln-f');
  o += text(sx(1.489), sy(parts(1.489)[2]) + 20, 'λ = 1.49，MSE = 0.079', 'tl', 'middle');
  o += text(sx(1e-3) + 6, sy(46.1) + 22, 'λ → 0：MSE → 46.1', 'tl', 'start');
  o += text(420, 60, 'MSE = bias² + variance', 'tb') + text(420, 82, '彩线：MSE', 'ts') + text(420, 100, '虚线：bias²', 'ts') + text(420, 118, '灰线：variance', 'ts');
  o += text(420, 150, '两个 axis 都是 log scale', 'ts');
  return svg(560, 285, o, '同一个例子里 bias 的平方、variance 和 MSE 随 λ 的变化：λ 很小时 MSE 约 46，λ 约 1.49 时最小，约 0.079');
}

// ---------- 第 5 站：把 ring 升到 (x₁, x₁² + x₂²) ----------
function lift() {
  let o = '';
  const sxa = lin(-3.6, 3.6, 30, 230), sya = lin(-3.6, 3.6, 240, 40);
  o += rect(30, 40, 200, 200, 'frame');
  for (const [x, y, l] of RINGS) o += dot(sxa(x), sya(y), l, 4);
  o += text(130, 28, '原来的 (x₁, x₂)', 'tb', 'middle');
  const sxb = lin(-3.6, 3.6, 320, 540), syb = lin(-0.5, 10, 240, 40);
  o += rect(320, 40, 220, 200, 'frame');
  o += line(320, syb(5), 540, syb(5), 'ln') + text(536, syb(5) - 6, 'x₁² + x₂² = 5', 'tl', 'end');
  for (const [x, y, l] of RINGS) o += dot(sxb(x), syb(x * x + y * y), l, 4);
  o += text(430, 28, '新的 feature (x₁, x₁² + x₂²)', 'tb', 'middle');
  o += text(316, syb(9) + 4, '9', 'ts', 'end') + text(316, syb(1) + 4, '1', 'ts', 'end') + text(316, syb(0) + 4, '0', 'ts', 'end');
  o += arrow(242, 140, 304, 140, 'ink') + text(273, 130, 'φ', 'tb', 'middle');
  o += text(280, 268, '第三个 coordinate 只看 radius：内圈全在 1，外圈全在 9，一条水平的 line 就分开了', 'ts', 'middle');
  return svg(560, 278, o, '左边是两圈点，右边把每个点画在 (x1, x1 平方加 x2 平方) 上，内圈落在高度 1，外圈落在高度 9，被水平线分开');
}

// ---------- 第 5 站：三个点上的 kernel ridge regression ----------
function krr() {
  const xs = [0, 1, 2], ys = [0, 1, 0], lam = 0.1;
  const sx = lin(-1.5, 5, 50, 400), sy = lin(-0.6, 1.3, 240, 20);
  let o = axes({ sx, sy, x0: -1.5, x1: 5, y0: -0.6, y1: 1.3, xt: [-1, 0, 1, 2, 3, 4, 5].map((v) => [v, neg(v, 0)]), yt: [[-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], xAt: 0, yAt: -1.5, grid: true, xl: 'x′' });
  const fit = (l) => { const k = (a, b) => Math.exp(-((a - b) ** 2) / (2 * l * l)); const K = xs.map((a) => xs.map((b) => k(a, b) + (a === b ? lam : 0))); const al = solve(K, ys); return (x) => xs.reduce((s, a, i) => s + al[i] * k(x, a), 0); };
  const f3 = fit(3), f1 = fit(1), f03 = fit(0.3);
  o += path(curve(f03, -1.5, 5, sx, sy), 'dash') + path(curve(f1, -1.5, 5, sx, sy), 'ln') + path(curve(f3, -1.5, 3.9, sx, sy), 'mute');
  for (let i = 0; i < 3; i++) o += circle(sx(xs[i]), sy(ys[i]), 5, 'ink-f');
  o += circle(sx(3), sy(f1(3)), 4, 'ln-f') + text(sx(3) + 8, sy(f1(3)) + 16, 'ŷ(3) = ' + neg(f1(3), 3), 'tl', 'start');
  o += text(sx(1.2), sy(0.95), 'ℓ = 0.3', 'ts', 'start');
  o += text(sx(-0.95), sy(f1(-0.95)) - 10, 'ℓ = 1', 'tl', 'middle');
  o += text(sx(-1.3), sy(f3(-1.3)) - 13, 'ℓ = 3', 'ts', 'start');
  o += text(420, 50, '三个 data point', 'tb') + text(420, 70, '(0, 0)，(1, 1)，(2, 0)', 'ts') + text(420, 88, 'RBF kernel，λ = 0.1', 'ts');
  o += text(420, 118, 'ℓ 小：每个点一个窄 bump', 'ts') + text(420, 136, 'ℓ 大：curve 很平滑，', 'ts') + text(420, 154, '离 data 远处一路下滑', 'ts');
  o += text(420, 184, 'ℓ = 1 在 x′ = 5 已回到', 'ts') + text(420, 202, f1(5).toFixed(3).replace('-', '−') + '：离开 data 后', 'ts') + text(420, 220, 'prediction 退回 0', 'ts');
  return svg(560, 260, o, '三个点上用三种 length-scale 的 RBF kernel 做 kernel ridge regression：ℓ 等于 0.3 是三个窄 bump，ℓ 等于 1 在 x 等于 3 处略低于 0，ℓ 等于 3 很平滑');
}

// ---------- 第 6 站：一个 LP 和它的 dual ----------
function lp() {
  let o = '';
  const sx = lin(-0.3, 6.3, 40, 270), sy = lin(-0.3, 4.3, 250, 40);
  o += axes({ sx, sy, x0: -0.3, x1: 6.3, y0: -0.3, y1: 4.3, xt: [1, 2, 3, 4, 5, 6], yt: [1, 2, 3, 4], xAt: 0, yAt: 0, xl: 'x₁' });
  o += poly([[0, 0], [4, 0], [3, 1], [0, 2]].map(([a, b]) => [sx(a), sy(b)]), 'wash');
  o += line(sx(0), sy(4), sx(4.3), sy(-0.3), 'mute') + line(sx(0), sy(2), sx(6.3), sy(-0.1), 'mute');
  for (const v of [3, 6, 9]) { const s = clip(2, 3, v, -0.3, 6.3, -0.3, 4.3); o += line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), v === 9 ? 'ln-dash' : 'dash'); }
  o += circle(sx(3), sy(1), 5, 'ln-f') + text(sx(3) + 8, sy(1) - 10, '(3, 1)：9', 'tl', 'start');
  o += text(sx(0.35), sy(3.85), 'x₁ + x₂ ≤ 4', 'ts') + text(sx(4.3), sy(0.78), 'x₁ + 3x₂ ≤ 6', 'ts');
  o += text(155, 24, 'Primal：max 2x₁ + 3x₂', 'tb', 'middle');
  o += text(155, 274, '虚线：2x₁ + 3x₂ = 3、6、9', 'ts', 'middle');
  const ux = lin(-0.3, 3.6, 330, 540), uy = lin(-0.3, 2.6, 250, 40);
  o += axes({ sx: ux, sy: uy, x0: -0.3, x1: 3.6, y0: -0.3, y1: 2.6, xt: [1, 2, 3], yt: [1, 2], xAt: 0, yAt: 0, xl: 'ν₁' });
  o += poly([[0, 2.6], [0, 2], [1.5, 0.5], [3, 0], [3.6, 0], [3.6, 2.6]].map(([a, b]) => [ux(a), uy(b)]), 'wash');
  for (const v of [9, 12]) { const s = clip(4, 6, v, -0.3, 3.6, -0.3, 2.6); o += line(ux(s[0][0]), uy(s[0][1]), ux(s[1][0]), uy(s[1][1]), v === 9 ? 'ln-dash' : 'dash'); }
  o += circle(ux(1.5), uy(0.5), 5, 'ln-f') + text(ux(1.5) - 8, uy(0.5) + 22, '(1.5, 0.5)：9', 'tl', 'end');
  o += text(ux(2.3), uy(2.1), 'feasible', 'ts', 'middle');
  o += text(435, 24, 'Dual：min 4ν₁ + 6ν₂', 'tb', 'middle');
  o += text(435, 274, '虚线：4ν₁ + 6ν₂ = 9、12', 'ts', 'middle');
  return svg(560, 284, o, '左边是 primal LP 的 feasible region，最优点 (3,1) 的值是 9；右边是 dual 的 feasible region，最优点 (1.5,0.5) 的值也是 9');
}

// ---------- 第 7 站：GD 与 SGD 在 logistic loss 上走的路 ----------
function sgdA() {
  const X = [...PX, [2, -0.5]], Y = [...PY, 1], n = 7;
  const f = (t) => X.reduce((s, x, i) => s + Math.log1p(Math.exp(-Y[i] * (t[0] * x[0] + t[1] * x[1]))), 0) / n;
  const gi = (t, i) => { const x = X[i], c = -Y[i] / (1 + Math.exp(Y[i] * (t[0] * x[0] + t[1] * x[1]))); return [c * x[0], c * x[1]]; };
  const g = (t) => { const s = [0, 0]; for (let i = 0; i < n; i++) { const q = gi(t, i); s[0] += q[0] / n; s[1] += q[1] / n; } return s; };
  let ts = [0, 0];
  for (let k = 0; k < 20000; k++) { const q = g(ts); ts = [ts[0] - 2 * q[0], ts[1] - 2 * q[1]]; }
  const fs = f(ts);
  const B = [-1.3, 1.5, -0.3, 3.7], sx = lin(B[0], B[1], 30, 330), sy = lin(B[2], B[3], 290, 20);
  let o = rect(30, 20, 300, 270, 'frame');
  // level set：沿每条从 θ* 出发的 ray 做 bisection
  for (const lv of [0.02, 0.06, 0.15, 0.3]) {
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const a = (2 * Math.PI * i) / 120, u = [Math.cos(a), Math.sin(a)];
      let lo = 0, hi = 8; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (f([ts[0] + m * u[0], ts[1] + m * u[1]]) - fs < lv) lo = m; else hi = m; }
      pts.push([ts[0] + lo * u[0], ts[1] + lo * u[1]]);
    }
    const inside = pts.map(([a, b]) => [Math.min(Math.max(a, B[0]), B[1]), Math.min(Math.max(b, B[2]), B[3])]);
    o += path(d(inside.map(([a, b]) => [sx(a), sy(b)])), 'grid');
    const lab = pts[30];
    if (lab[1] < B[3] - 0.15) o += text(sx(lab[0]) + 3, sy(lab[1]) - 3, '+' + lv, 'ts', 'start');
  }
  o += circle(sx(ts[0]), sy(ts[1]), 4, 'ink-f') + line(sx(ts[0]), sy(ts[1]) - 5, sx(ts[0]), sy(3.52), 'mute') + text(sx(ts[0]), sy(3.55), 'minimizer (' + ts[0].toFixed(2) + ', ' + ts[1].toFixed(2) + ')', 'ts', 'middle');
  // GD：η = 1，50 步；SGD：η = 0.5，用 LCG 抽 index，200 步
  const K = 200, gd = [[0, 0]], sg = [[0, 0]], R = rng(7);
  for (let k = 1; k <= K; k++) {
    const a = gd[k - 1], q = g(a); gd.push([a[0] - q[0], a[1] - q[1]]);
    const b = sg[k - 1], i = Math.floor(R.u() * n), p = gi(b, i); sg.push([b[0] - 0.5 * p[0], b[1] - 0.5 * p[1]]);
  }
  const cl = (p) => [sx(Math.min(Math.max(p[0], B[0]), B[1])), sy(Math.min(Math.max(p[1], B[2]), B[3]))];
  o += path(d(gd.map(cl)), 'ink') + path(d(sg.slice(0, 81).map(cl)), 'ln-dash');
  const T = 10, kt = [], idx = [];
  for (let k = 0; k <= 80; k++) { kt.push((k / 80) * 0.85); idx.push(k); }
  kt.push(1); idx.push(80);
  o += acircle(idx.map((k) => cl(gd[k])[0]), idx.map((k) => cl(gd[k])[1]), kt, T, 5, 'ink-f');
  o += acircle(idx.map((k) => cl(sg[k])[0]), idx.map((k) => cl(sg[k])[1]), kt, T, 5, 'ln-f');
  o += text(sx(0) + 8, sy(0) + 4, '起点 0', 'ts', 'start');
  const tx = 345;
  o += text(tx, 36, '7 个点的 logistic loss', 'tb') + text(tx, 54, '灰线：f(θ) − min f 的 level set', 'ts');
  o += line(tx, 78, tx + 26, 78, 'ink') + text(tx + 32, 82, 'GD，η = 1', 't');
  o += text(tx + 32, 98, '每步用全部 7 个 gradient', 'ts');
  o += line(tx, 122, tx + 26, 122, 'ln-dash') + text(tx + 32, 126, 'SGD，η = 0.5', 'tl');
  o += text(tx + 32, 142, '每步随机挑 1 个点', 'ts');
  o += text(tx, 176, '两个点同时走 80 步。', 'ts');
  o += text(tx, 194, 'GD 沿 valley 平稳前进；', 'ts') + text(tx, 212, 'SGD 平均方向一样，', 'ts') + text(tx, 230, '但每步被单个点拽偏，', 'ts') + text(tx, 248, '到了 minimizer 附近也停不下来', 'ts');
  return svgA(560, 300, o, '动图：七个点的 logistic loss 的 level set 上，gradient descent 平稳地走向 minimizer，stochastic gradient descent 跳来跳去，到了 minimizer 附近仍在晃');
}

// ---------- 第 7 站：projected gradient descent 在 box 上 ----------
function projA() {
  const sx = lin(-0.3, 2.4, 40, 340), sy = lin(-0.3, 1.5, 250, 50);
  let o = rect(sx(0), sy(1), sx(1) - sx(0), sy(0) - sy(1), 'wash') + rect(sx(0), sy(1), sx(1) - sx(0), sy(0) - sy(1), 'frame');
  for (const r of [0.5, 1, 1.5, 2]) {
    const pts = []; for (let i = 0; i <= 80; i++) { const a = (2 * Math.PI * i) / 80; pts.push([2 + r * Math.cos(a), 1 + r * Math.sin(a)]); }
    o += path(d(pts.filter(([a, b]) => a > -0.3 && a < 2.4 && b > -0.3 && b < 1.5).map(([a, b]) => [sx(a), sy(b)])), 'grid');
  }
  o += circle(sx(2), sy(1), 4, 'ink-f');
  o += text(sx(0.5), sy(0.5) + 4, 'C = [0, 1]²', 'ts', 'middle');
  // 迭代：η = 0.25
  const seq = [[0, 0]], half = [];
  for (let k = 0; k < 4; k++) { const [a, b] = seq[k], y = [a - 0.25 * 2 * (a - 2), b - 0.25 * 2 * (b - 1)]; half.push(y); seq.push([Math.min(Math.max(y[0], 0), 1), Math.min(Math.max(y[1], 0), 1)]); }
  for (let k = 0; k < 4; k++) {
    o += arrow(sx(seq[k][0]), sy(seq[k][1]), sx(half[k][0]), sy(half[k][1]), 'mute', 6);
    if (Math.abs(half[k][0] - seq[k + 1][0]) > 1e-9) o += line(sx(half[k][0]), sy(half[k][1]), sx(seq[k + 1][0]), sy(seq[k + 1][1]), 'dash');
    o += circle(sx(half[k][0]), sy(half[k][1]), 3, 'paper');
  }
  const xs = [], ys = [], kt = [], T = 8;
  const st = [seq[0], half[0], seq[1], half[1], seq[2], half[2], seq[3], half[3], seq[4], seq[4]];
  st.forEach((p, i) => { xs.push(sx(p[0])); ys.push(sy(p[1])); kt.push(i / (st.length - 1)); });
  o += acircle(xs, ys, kt, T, 5.5, 'ln-f');
  const tx = 360;
  o += text(tx, 60, 'min (x₁ − 2)² + (x₂ − 1)²', 'tb') + text(tx, 80, 'subject to x ∈ [0, 1]²', 't');
  o += text(tx, 104, '黑点：unconstrained minimum (2, 1)', 'ts');
  o += text(tx, 124, '灰色箭头：gradient step，η = 0.25', 'ts') + text(tx, 142, '虚线：clip 回 box', 'ts');
  const lab = (p) => '(' + p.map((v) => String(Number(v.toFixed(4)))).join(', ') + ')';
  for (let k = 0; k < 4; k++) o += text(tx, 170 + k * 18, lab(seq[k]) + ' → ' + lab(half[k]) + ' → ' + lab(seq[k + 1]), 'ts');
  o += text(tx, 250, '一直 converge 到 (1, 1)', 'ts');
  return svgA(560, 262, o, '动图：projected gradient descent 从原点出发，gradient step 走出 box 后被 clip 回边上，逐步 converge 到 (1,1)');
}

// ---------- 第 8 站：AdaBoost 的三轮 weight ----------
function boost() {
  const Y = [1, 1, -1, -1, -1, 1, 1];
  const W = [[1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7], [0.1, 0.1, 0.1, 0.1, 0.1, 0.25, 0.25], [0.25, 0.25, 1 / 16, 1 / 16, 1 / 16, 5 / 32, 5 / 32]];
  const ST = [[2.5, '左 +，右 −', [6, 7], '2/7', '0.458'], [5.5, '左 −，右 +', [1, 2], '0.2', '0.693'], [0.5, '全部 +', [3, 4, 5], '3/16', '0.733']];
  const sx = lin(0.5, 7.5, 40, 340);
  let o = '';
  for (let r = 0; r < 3; r++) {
    const y0 = 40 + r * 78, base = y0 + 52;
    o += line(40, base, 340, base, 'axis');
    for (let i = 0; i < 7; i++) {
      const h = W[r][i] * 160;
      const bad = ST[r][2].includes(i + 1);
      o += rect(sx(i + 1) - 9, base - h, 18, h, bad ? 'wash-strong' : 'wash2');
      o += dot(sx(i + 1), base + 10, Y[i], 4.5);
      if (r === 0) o += text(sx(i + 1), base + 30, String(i + 1), 'ts', 'middle');
    }
    const t = ST[r][0];
    if (t > 1) o += line(sx(t), y0, sx(t), base + 16, 'ln');
    o += text(355, y0 + 14, '第 ' + (r + 1) + ' 轮：' + ST[r][1] + (t > 1 ? '（x = ' + t + '）' : ''), 'tb');
    o += text(355, y0 + 34, '深色柱是分错的点：ε = ' + ST[r][3], 'ts');
    o += text(355, y0 + 52, 'α = ' + ST[r][4], 'ts');
  }
  o += text(40, 30, '柱高是这一轮的 weight w(t)', 'ts');
  o += text(190, 300, '三轮之后 f(x) 在三段上分别是 0.498、−0.418、0.968，sign 全对', 'ts', 'middle');
  return svg(560, 308, o, 'AdaBoost 在七个点上的前三轮：每一轮分错的点（深色柱）在下一轮变重，三个 stump 加权之后 training error 为 0');
}

// ---------- 第 9 站：100 次 coin flip 的 tail，以及各个 bound ----------
function tail() {
  const lf = [0]; for (let i = 1; i <= 1000; i++) lf.push(lf[i - 1] + Math.log(i));
  const pmf = (n, k) => Math.exp(lf[n] - lf[k] - lf[n - k] - n * Math.LN2);
  const sx = lin(30.5, 70.5, 30, 270), sy = lin(0, 0.085, 230, 40);
  let o = axes({ sx, sy, x0: 30.5, x1: 70.5, y0: 0, y1: 0.085, xt: [35, 40, 45, 50, 55, 60, 65, 70], yt: [[0, '0'], [0.04, '0.04'], [0.08, '0.08']], xl: 'heads 的个数' });
  for (let k = 31; k <= 70; k++) { const p = pmf(100, k); o += rect(sx(k) - 2.6, sy(p), 5.2, sy(0) - sy(p), k >= 60 ? 'solid' : 'wash2'); }
  let ex = 0; for (let k = 60; k <= 100; k++) ex += pmf(100, k);
  o += text(sx(62), sy(0.03), 'P(≥ 60) = ' + ex.toFixed(4), 'tl', 'start');
  o += text(150, 24, 'n = 100 次 fair coin flip', 'tb', 'middle');
  // 右：P(mean ≥ 0.6) 随 n
  const ux = logx(10, 1000, 330, 540), uy = logx(1e-10, 1, 230, 40);
  o += axes({ sx: ux, sy: uy, x0: 10, x1: 1000, y0: 1e-10, y1: 1, xt: [[10, '10'], [100, '100'], [1000, '1000']], yt: [[1, '1'], [1e-3, '10⁻³'], [1e-6, '10⁻⁶'], [1e-9, '10⁻⁹']], grid: true, xl: 'n' });
  const exact = (n) => { let s = 0; for (let k = Math.ceil(0.6 * n - 1e-9); k <= n; k++) s += pmf(n, k); return s; };
  const ns = []; for (let n = 10; n <= 1000; n += 10) ns.push(n);
  o += path(d(ns.map((n) => [ux(n), uy(exact(n))])), 'ln');
  o += path(d(ns.map((n) => [ux(n), uy(Math.exp(-2 * n * 0.01))])), 'dash');
  o += path(d(ns.map((n) => [ux(n), uy(Math.min(1, 25 / n))])), 'mute');
  o += text(ux(1000) - 2, uy(0.025) - 6, 'Chebyshev 0.25/(nε²)', 'ts', 'end');
  o += text(ux(150) + 4, uy(Math.exp(-3)) - 6, 'Hoeffding e⁻²ⁿᵋ²', 't', 'start');
  o += text(ux(300), uy(exact(300)) + 18, 'exact', 'tl', 'end');
  o += text(435, 24, 'P(sample mean ≥ 0.6)', 'tb', 'middle');
  o += text(280, 262, '左：深色是 tail。右：exact tail 与两个 bound，ε = 0.1；Hoeffding 和 exact 同样按 exponential 下降', 'ts', 'middle');
  return svg(560, 272, o, '左边是 100 次 fair coin flip 中 heads 个数的分布，60 及以上的 tail 概率约 0.0284；右边是 sample mean 至少 0.6 的概率随 n 的变化，与 Chebyshev 和 Hoeffding 两个 bound 对比');
}

// ---------- 第 10 站：4 个点上的 threshold classifier ----------
function rad() {
  const sx = lin(0.5, 4.5, 60, 300);
  let o = '';
  o += text(40, 22, 'threshold classifier f(x) = +1 当 x > a，否则 −1', 'tb');
  const pats = [0, 1, 2, 3, 4].map((k) => [1, 2, 3, 4].map((i) => (i > 4 - k ? 1 : -1)));
  pats.forEach((p, r) => {
    const y = 56 + r * 30;
    o += line(60, y, 300, y, 'grid');
    const a = 4.5 - r;
    o += line(sx(a), y - 12, sx(a), y + 12, 'ln');
    p.forEach((v, i) => { o += dot(sx(i + 1), y, v, 6); });
    o += text(320, y + 4, '(' + p.map((v) => (v > 0 ? '+' : '−')).join(' ') + ')', 't');
  });
  o += text(60, 214, 'x₁ < x₂ < x₃ < x₄：五种 labeling，2⁴ = 16 种里只有它们能实现', 'ts');
  const s = [1, -1, 1, 1], y = 250;
  o += text(40, y - 6, 'σ = (+ − + +)', 'tb');
  o += text(160, y - 6, '与每一行的 inner product：', 'ts');
  const ips = pats.map((p) => p.reduce((t, v, i) => t + v * s[i], 0));
  o += text(160, y + 14, ips.map((v) => neg(v, 0)).join('，') + '　→ max = ' + Math.max(...ips) + '，除以 n 得 ' + (Math.max(...ips) / 4), 'ts');
  o += text(40, y + 40, '对 16 个 σ 取平均：Rademacher complexity = 19/32 = 0.594', 'tl');
  return svg(560, 298, o, '四个点上的 threshold classifier 只能实现五种 labeling；对一个 random sign 向量 σ，取五行里与 σ 最一致的那一行');
}

// ---------- 第 11 站：polynomial degree 的选择 ----------
const SY = [0.0, 0.29, 0.35, 0.38, 0.65, 0.64, 0.98, 1.33, 0.86, 0.77, 0.95, 0.78, 0.54, 0.09, 0.1, 0.07, -0.66, -0.63, -1.16, -1.15, -1.39, -1.05, -1.32, -0.9, -0.84, -0.81, -1.23, -0.55, -0.23, 0.03];
const SX = SY.map((_, i) => i / 29);
// 用 (2x − 1)^j 做 basis、modified Gram–Schmidt 求 least squares，避开 Vandermonde 的 ill-conditioning
function polyfit(xs, ys, p) {
  const m = xs.length, cols = [];
  for (let j = 0; j <= p; j++) cols.push(xs.map((x) => (2 * x - 1) ** j));
  const Q = [], Rm = Array.from({ length: p + 1 }, () => Array(p + 1).fill(0));
  for (let j = 0; j <= p; j++) {
    let v = [...cols[j]];
    for (let i = 0; i < j; i++) { const r = Q[i].reduce((s, q, t) => s + q * v[t], 0); Rm[i][j] = r; v = v.map((x, t) => x - r * Q[i][t]); }
    const nv = Math.hypot(...v); Rm[j][j] = nv; Q.push(v.map((x) => x / nv));
  }
  const qy = Q.map((q) => q.reduce((s, v, t) => s + v * ys[t], 0)), c = Array(p + 1).fill(0);
  for (let i = p; i >= 0; i--) { let s = qy[i]; for (let j = i + 1; j <= p; j++) s -= Rm[i][j] * c[j]; c[i] = s / Rm[i][i]; }
  return (x) => c.reduce((s, cj, j) => s + cj * (2 * x - 1) ** j, 0);
}
function select() {
  const sx = lin(0, 1, 40, 270), sy = lin(-1.8, 1.8, 250, 30);
  let o = rect(40, 30, 230, 220, 'frame') + line(40, sy(0), 270, sy(0), 'grid');
  const f1 = polyfit(SX, SY, 1), f5 = polyfit(SX, SY, 5), f9 = polyfit(SX, SY, 9);
  o += path(curve(f1, 0, 1, sx, sy), 'mute') + path(curve(f9, 0, 1, sx, sy, 400), 'dash') + path(curve(f5, 0, 1, sx, sy), 'ln');
  for (let i = 0; i < 30; i++) o += circle(sx(SX[i]), sy(SY[i]), 2.8, 'ink-f');
  o += text(sx(0.06), sy(f1(0.06)) + 30, 'degree 1', 'ts', 'start') + text(sx(0.9), sy(f5(0.9)) + 26, 'degree 5', 'tl', 'middle') + text(sx(0.48), sy(1.45), 'degree 9（虚线）', 'ts', 'middle');
  o += text(155, 20, '30 个点，y = sin 2πx + noise', 'tb', 'middle');
  // 右：training MSE 与 LOOCV
  const ux = lin(0, 9, 330, 540), uy = logx(0.02, 1, 250, 30);
  o += axes({ sx: ux, sy: uy, x0: 0, x1: 9, y0: 0.02, y1: 1, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yt: [[0.02, '0.02'], [0.05, '0.05'], [0.1, '0.1'], [0.2, '0.2'], [0.5, '0.5'], [1, '1']], grid: true, xl: 'degree' });
  const tr = [], lo = [];
  for (let p = 0; p <= 9; p++) {
    const f = polyfit(SX, SY, p); tr.push(SY.reduce((s, y, i) => s + (f(SX[i]) - y) ** 2, 0) / 30);
    let e = 0; for (let i = 0; i < 30; i++) { const xs = SX.filter((_, t) => t !== i), ys = SY.filter((_, t) => t !== i); e += (polyfit(xs, ys, p)(SX[i]) - SY[i]) ** 2; } lo.push(e / 30);
  }
  o += path(d(tr.map((v, p) => [ux(p), uy(v)])), 'mute') + path(d(lo.map((v, p) => [ux(p), uy(Math.min(v, 1))])), 'ln');
  tr.forEach((v, p) => { o += circle(ux(p), uy(v), 2.6, 'mute-f'); });
  lo.forEach((v, p) => { o += circle(ux(p), uy(Math.min(v, 1)), 3, 'ln-f'); });
  o += text(ux(9), uy(tr[9]) + 16, 'training MSE', 'ts', 'end') + text(ux(2.2), uy(lo[2]) - 10, 'LOOCV', 'tl', 'start');
  o += text(435, 20, '两种 error 随 degree', 'tb', 'middle');
  o += text(280, 280, '左：degree 1 under-fit，degree 9 开始追 noise。右：training MSE 一路下降，LOOCV 在 degree 5 最低', 'ts', 'middle');
  return svg(560, 290, o, '30 个带 noise 的点上 degree 1、5、9 的 polynomial fit，以及 training MSE 与 leave-one-out cross-validation error 随 degree 的变化');
}

// ---------- 第 12 站：五个点的 PCA ----------
function pca() {
  const X = [[-3, -2], [-1, 0], [0, -1], [1, 1], [3, 2]];
  const [w, V] = jacobi([[4, 2.6], [2.6, 2]]);
  let u = V[0]; if (u[0] < 0) u = u.map((v) => -v);
  const sx = lin(-4.2, 4.2, 40, 340), sy = lin(-3, 3, 260, 30);
  let o = line(40, sy(0), 340, sy(0), 'grid') + line(sx(0), 30, sx(0), 260, 'grid');
  o += line(sx(-4.2), sy(-4.2 * u[1] / u[0]), sx(4.2), sy(4.2 * u[1] / u[0]), 'ln');
  const p2 = [-u[1], u[0]];
  o += line(sx(-2.4 * p2[0]), sy(-2.4 * p2[1]), sx(2.4 * p2[0]), sy(2.4 * p2[1]), 'dash');
  for (const [a, b] of X) {
    const z = a * u[0] + b * u[1];
    o += line(sx(a), sy(b), sx(z * u[0]), sy(z * u[1]), 'mute') + circle(sx(z * u[0]), sy(z * u[1]), 3, 'ln-f') + circle(sx(a), sy(b), 4.5, 'ink-f');
  }
  o += text(sx(3.9), sy(3.9 * u[1] / u[0]) + 18, 'v₁', 'tl', 'middle') + text(sx(2.3 * p2[0]) + 8, sy(2.3 * p2[1]), 'v₂', 't', 'start');
  const tx = 360;
  o += text(tx, 44, '五个点，mean 已是 0', 'tb');
  o += text(tx, 66, 'S = XᵀX/n 的 eigenvalue', 'ts');
  o += text(tx, 84, 'λ₁ = ' + w[0].toFixed(3) + '，λ₂ = ' + w[1].toFixed(3), 't');
  o += text(tx, 106, 'v₁ = (' + u.map((v) => v.toFixed(3)).join(', ') + ')', 't');
  o += text(tx, 134, '灰线：每个点到 v₁ 的 residual', 'ts');
  o += text(tx, 152, 'residual 的平方和 = nλ₂ = ' + (5 * w[1]).toFixed(3), 'ts');
  o += text(tx, 180, 'v₁ 留下的 variance 占', 'ts') + text(tx, 198, (w[0] / (w[0] + w[1]) * 100).toFixed(1) + '%', 'ts');
  return svg(560, 270, o, '五个点的 PCA：第一 principal direction v1 约为 (0.824, 0.566)，每个点向它做 orthogonal projection，residual 的平方和等于 n 乘第二个 eigenvalue');
}

// ---------- 第 12 站：kernel PCA 把两圈点分开 ----------
function kpca() {
  const n = RINGS.length;
  const embed = (l) => {
    const K = RINGS.map(([a, b]) => RINGS.map(([c, e]) => Math.exp(-((a - c) ** 2 + (b - e) ** 2) / (2 * l * l))));
    const rm = K.map((r) => r.reduce((s, v) => s + v, 0) / n), tm = rm.reduce((s, v) => s + v, 0) / n;
    const Kc = K.map((r, i) => r.map((v, j) => v - rm[i] - rm[j] + tm));
    const [w, V] = jacobi(Kc);
    return [w, RINGS.map((_, i) => [V[0][i] * Math.sqrt(w[0]), V[1][i] * Math.sqrt(w[1])])];
  };
  let o = '';
  const sxa = lin(-3.6, 3.6, 20, 170), sya = lin(-3.6, 3.6, 220, 70);
  o += rect(20, 70, 150, 150, 'frame');
  for (const [x, y, l] of RINGS) o += dot(sxa(x), sya(y), l, 3.5);
  o += text(95, 52, '原来的点', 'tb', 'middle');
  const panel = (x0, l) => {
    const [w, Y] = embed(l);
    const m = Math.max(...Y.flat().map(Math.abs)) * 1.15;
    const sx = lin(-m, m, x0, x0 + 150), sy = lin(-m, m, 220, 70);
    o += rect(x0, 70, 150, 150, 'frame') + line(x0, sy(0), x0 + 150, sy(0), 'grid') + line(sx(0), 70, sx(0), 220, 'grid');
    Y.forEach(([a, b], i) => { o += dot(sx(a), sy(b), RINGS[i][2], 3.5); });
    o += text(x0 + 75, 34, 'RBF，ℓ = ' + l, 'tb', 'middle');
    o += text(x0 + 75, 52, 'eigenvalue ' + w.slice(0, 3).map((v) => v.toFixed(2)).join('、'), 'ts', 'middle');
    o += text(x0 + 75, 238, '横轴 PC1，纵轴 PC2', 'ts', 'middle');
    return Y;
  };
  const Y1 = panel(205, 1);
  panel(390, 3);
  const inn = Y1.filter((_, i) => RINGS[i][2] < 0).map((p) => p[0]), out = Y1.filter((_, i) => RINGS[i][2] > 0).map((p) => p[0]);
  o += text(280, 264, 'ℓ = 1：PC1 在内圈全是 ' + neg(inn[0], 3) + '，外圈全是 ' + neg(out[0], 3) + '，一个 coordinate 就分开了', 'ts', 'middle');
  o += text(280, 282, 'ℓ = 3：kernel 太宽，接近 linear PCA，前两个 component 只是把两圈原样摆出来', 'ts', 'middle');
  return svg(560, 290, o, '两圈点做 kernel PCA：length-scale 为 1 时第一个 component 在内圈和外圈各取一个常数值，两圈完全分开；length-scale 为 3 时两圈仍套在一起');
}

// ---------- 第 13 站：majorization–minimization 求 Σ|x − aᵢ| 的 minimum ----------
function mmA() {
  const A = [0, 1, 3, 7, 8], f = (x) => A.reduce((s, a) => s + Math.abs(x - a), 0);
  const xs = [6]; for (let k = 0; k < 6; k++) { const x = xs[k], w = A.map((a) => 1 / Math.abs(x - a)); xs.push(A.reduce((s, a, i) => s + w[i] * a, 0) / w.reduce((s, v) => s + v, 0)); }
  const sx = lin(-0.5, 8.5, 40, 380), sy = lin(10, 30, 250, 30);
  let o = axes({ sx, sy, x0: -0.5, x1: 8.5, y0: 10, y1: 30, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8], yt: [10, 15, 20, 25, 30], grid: true, xl: 'x' });
  o += path(curve(f, -0.5, 8.5, sx, sy, 400), 'ink-b');
  for (const a of A) o += line(sx(a), sy(10) - 5, sx(a), sy(10) + 5, 'ink-b');
  const T = 9, n = 6, kt = Array.from({ length: n }, (_, i) => i / n), on = (i) => kt.map((_, j) => j === i);
  for (let k = 0; k < n; k++) {
    const x = xs[k], u = (z) => A.reduce((s, a) => s + (z - a) ** 2 / (2 * Math.abs(x - a)) + Math.abs(x - a) / 2, 0);
    const pts = []; for (let i = 0; i <= 200; i++) { const z = -0.5 + (9 * i) / 200, v = u(z); if (v <= 30) pts.push([sx(z), sy(v)]); }
    let g = path(d(pts), 'ln');
    g += circle(sx(x), sy(f(x)), 5, 'paper') + line(sx(xs[k + 1]), sy(u(xs[k + 1])), sx(xs[k + 1]), sy(f(xs[k + 1])), 'dash') + circle(sx(xs[k + 1]), sy(f(xs[k + 1])), 4.5, 'ln-f');
    g += text(400, 60, '第 ' + k + ' 步', 'tb') + text(400, 84, 'x' + sub(String(k)) + ' = ' + x.toFixed(3), 't') + text(400, 104, 'f(x' + sub(String(k)) + ') = ' + f(x).toFixed(3), 't');
    g += text(400, 130, 'u 的 minimizer', 'ts') + text(400, 148, 'x' + sub(String(k + 1)) + ' = ' + xs[k + 1].toFixed(3), 't') + text(400, 168, 'f(x' + sub(String(k + 1)) + ') = ' + f(xs[k + 1]).toFixed(3), 't');
    o += fr(g, on(k), kt, T);
  }
  o += text(400, 206, '黑线：f(x) = Σ|x − aᵢ|', 'ts') + text(400, 224, '彩线：在 xₖ 处贴住 f 的', 'ts') + text(400, 242, 'quadratic majorizer u', 'ts');
  o += text(210, 282, '五个 aᵢ = 0, 1, 3, 7, 8（底部短线）；minimum 在 median 3', 'ts', 'middle');
  return svgA(560, 290, o, '动图：用 quadratic majorizer 最小化五个点的 absolute deviation 之和，从 x 等于 6 出发，每一步最小化贴住 f 的 parabola，x 逐步走向 median 3');
}

// ---------- 第 13 站：六个点上的 EM（两个 component，variance 固定为 1，weight 固定为 1/2）----------
const EMX = [0, 0.8, 1.6, 3.2, 4.4, 5.0];
function emA() {
  const N = (x, m) => Math.exp(-((x - m) ** 2) / 2);
  const ll = (mu) => EMX.reduce((s, x) => s + Math.log((0.5 * (N(x, mu[0]) + N(x, mu[1]))) / Math.sqrt(2 * Math.PI)), 0);
  const mus = [[2, 2.6]];
  for (let k = 0; k < 4; k++) {
    const m = mus[k], r = EMX.map((x) => N(x, m[0]) / (N(x, m[0]) + N(x, m[1])));
    const s1 = r.reduce((s, v) => s + v, 0), s2 = r.reduce((s, v) => s + 1 - v, 0);
    mus.push([r.reduce((s, v, i) => s + v * EMX[i], 0) / s1, r.reduce((s, v, i) => s + (1 - v) * EMX[i], 0) / s2]);
  }
  const sx = lin(-1.5, 6.5, 30, 380), sy = lin(0, 0.45, 200, 40);
  let o = line(30, 200, 380, 200, 'axis');
  for (const v of [0, 1, 2, 3, 4, 5, 6]) o += line(sx(v), 200, sx(v), 205, 'axis') + text(sx(v), 220, String(v), 'ts', 'middle');
  const n = mus.length, T = 10, kt = Array.from({ length: n }, (_, i) => i / n), on = (i) => kt.map((_, j) => j === i);
  for (let k = 0; k < n; k++) {
    const m = mus[k], r = EMX.map((x) => N(x, m[0]) / (N(x, m[0]) + N(x, m[1])));
    let g = path(curve((x) => (0.5 * N(x, m[0])) / Math.sqrt(2 * Math.PI), -1.5, 6.5, sx, sy), 'ln');
    g += path(curve((x) => (0.5 * N(x, m[1])) / Math.sqrt(2 * Math.PI), -1.5, 6.5, sx, sy), 'dash');
    g += line(sx(m[0]), 200, sx(m[0]), sy(0.5 / Math.sqrt(2 * Math.PI)), 'ln-dash') + line(sx(m[1]), 200, sx(m[1]), sy(0.5 / Math.sqrt(2 * Math.PI)), 'grid');
    // 每个点下面一根柱：上段（彩色）是 r₁，下段（灰）是 r₂
    EMX.forEach((x, i) => {
      const h = 34, top = 232;
      g += rect(sx(x) - 6, top, 12, h * r[i], 'solid') + rect(sx(x) - 6, top + h * r[i], 12, h * (1 - r[i]), 'wash2');
      g += text(sx(x), top + h + 14, r[i].toFixed(2), 'ts', 'middle');
    });
    g += text(400, 50, k === 0 ? '起点' : '第 ' + k + ' 轮 EM 之后', 'tb');
    g += text(400, 74, 'μ' + sub('1') + ' = ' + m[0].toFixed(3), 'tl') + text(400, 94, 'μ' + sub('2') + ' = ' + m[1].toFixed(3), 't');
    g += text(400, 120, 'log-likelihood', 'ts') + text(400, 138, neg(ll(m), 3), 't');
    o += fr(g, on(k), kt, T);
  }
  EMX.forEach((x) => { o += circle(sx(x), 200, 4.5, 'ink-f'); });
  o += text(400, 170, '彩线：component 1', 'ts') + text(400, 188, '虚线：component 2', 'ts');
  o += text(400, 248, '柱子：彩色段是 r' + sub('t') + '(1)，', 'ts') + text(400, 266, '灰色段是 r' + sub('t') + '(2)；', 'ts') + text(400, 284, '下面的数是 r' + sub('t') + '(1)', 'ts');
  return svgA(560, 296, o, '动图：六个点上两个 component 的 EM，两个 mean 从 2 和 2.6 出发分开，四轮后停在约 0.87 和 4.19，每个点的 responsibility 跟着变，log-likelihood 每轮上升');
}

// ---------- 第 14 站：OMP 在 R² 的四个 atom 上 ----------
function ompA() {
  const r = Math.SQRT1_2, D = [[1, 0], [0, 1], [r, r], [r, -r]], x = [2.6, 1.4];
  const sx = lin(-1.2, 3.2, 40, 300), sy = lin(-1.4, 2.4, 270, 40);
  let o = line(40, sy(0), 300, sy(0), 'grid') + line(sx(0), 40, sx(0), 270, 'grid');
  D.forEach((a, i) => {
    o += arrow(sx(0), sy(0), sx(a[0]), sy(a[1]), 'ink');
    const off = [[8, 16], [8, -4], [-6, -8], [6, 14]][i];
    o += text(sx(a[0]) + off[0], sy(a[1]) + off[1], 'd' + sub(String(i + 1)), 't', i === 2 ? 'end' : 'start');
  });
  o += circle(sx(x[0]), sy(x[1]), 5, 'ink-f') + text(sx(x[0]) + 8, sy(x[1]) - 6, 'x = (2.6, 1.4)', 'tb', 'start');
  const T = 9, kt = [0, 0.34, 0.67], on = (i) => kt.map((_, j) => j === i);
  // 第 1 步：比较 correlation
  let g = '';
  const c1 = D.map((a) => a[0] * x[0] + a[1] * x[1]);
  g += text(320, 50, '第 1 步：|⟨dⱼ, x⟩|', 'tb');
  c1.forEach((v, i) => { g += text(320, 74 + i * 18, 'd' + sub(String(i + 1)) + '：' + v.toFixed(3), i === 2 ? 'tl' : 'ts'); });
  g += text(320, 160, '最大的是 d₃，选它', 'ts');
  o += fr(g, on(0), kt, T);
  // 第 2 步：投影，看 residual
  const p = [2, 2];
  g = line(sx(0), sy(0), sx(p[0]), sy(p[1]), 'ln') + circle(sx(p[0]), sy(p[1]), 4, 'ln-f') + arrow(sx(p[0]), sy(p[1]), sx(x[0]), sy(x[1]), 'ln');
  g += text(sx(p[0]) - 8, sy(p[1]) - 6, '2.828 d₃', 'tl', 'end') + text(sx(2.4), sy(1.8) + 4, 'r₁', 'tl', 'start');
  g += text(320, 50, '第 2 步：r₁ = x − 2.828 d₃', 'tb') + text(320, 72, '= (0.6, −0.6)', 't');
  const c2 = D.map((a) => a[0] * 0.6 - a[1] * 0.6);
  c2.forEach((v, i) => { g += text(320, 98 + i * 18, '|⟨d' + sub(String(i + 1)) + ', r₁⟩|：' + Math.abs(v).toFixed(3), i === 3 ? 'tl' : 'ts'); });
  g += text(320, 184, '最大的是 d₄，加进来', 'ts');
  o += fr(g, kt.map((_, j) => j >= 1), kt, T);
  g = arrow(sx(p[0]), sy(p[1]), sx(x[0]), sy(x[1]), 'ink-b');
  g += text(320, 212, '第 3 步：在 {d₃, d₄} 上做 least squares：', 'ts') + text(320, 230, 'x = 2.828 d₃ + 0.849 d₄，residual 为 0', 'tl');
  o += fr(g, on(2), kt, T);
  return svgA(560, 280, o, '动图：orthogonal matching pursuit 在 R2 的四个 atom 上表示 x 等于 (2.6, 1.4)：先选和 x 最相关的 d3，residual 是 (0.6, −0.6)，再选和 residual 最相关的 d4');
}

// ---------- 第 14 站：K-SVD 更新一个 atom ----------
function ksvd() {
  const E = [[2, 1.1], [-1.9, -0.9], [4.1, 1.9]];
  const M = [[0, 0], [0, 0]]; for (const [a, b] of E) { M[0][0] += a * a; M[0][1] += a * b; M[1][1] += b * b; } M[1][0] = M[0][1];
  const [w, V] = jacobi(M); let u = V[0]; if (u[0] < 0) u = u.map((v) => -v);
  const sx = lin(-2.6, 4.8, 40, 340), sy = lin(-1.5, 2.6, 250, 30);
  let o = line(40, sy(0), 340, sy(0), 'grid') + line(sx(0), 30, sx(0), 250, 'grid');
  o += line(sx(-2.6), sy(0), sx(4.8), sy(0), 'dash');
  o += line(sx(-2.6), sy(-2.6 * u[1] / u[0]), sx(4.8), sy(4.8 * u[1] / u[0]), 'ln');
  for (const [a, b] of E) {
    const z = a * u[0] + b * u[1];
    o += line(sx(a), sy(b), sx(a), sy(0), 'mute');
    o += line(sx(a), sy(b), sx(z * u[0]), sy(z * u[1]), 'ln') + circle(sx(a), sy(b), 4.5, 'ink-f');
  }
  o += text(sx(4.8) - 4, sy(0) + 16, '旧 atom (1, 0)', 'ts', 'end');
  o += text(sx(4.4), sy(4.4 * u[1] / u[0]) - 10, '新 atom u₁', 'tl', 'end');
  const tx = 360;
  o += text(tx, 44, 'E' + sub('k') + '^R 的三个 column', 'tb') + text(tx, 64, '(2, 1.1)，(−1.9, −0.9)，(4.1, 1.9)', 'ts');
  o += text(tx, 92, '旧 atom：灰色竖线是 error', 'ts') + text(tx, 110, 'squared error 之和 5.63', 't');
  o += text(tx, 138, 'rank-1 SVD：u₁ = (' + u.map((v) => v.toFixed(3)).join(', ') + ')', 'ts');
  o += text(tx, 156, 'σ₁ = ' + Math.sqrt(w[0]).toFixed(3) + '，σ₂ = ' + Math.sqrt(w[1]).toFixed(3), 'ts');
  o += text(tx, 174, 'squared error 降到 σ₂² = ' + w[1].toFixed(4), 't');
  o += text(tx, 202, '新 coefficient = σ₁v₁ᵀ', 'ts') + text(tx, 220, '= (2.279, −2.102, 4.518)', 'ts');
  return svg(560, 262, o, 'K-SVD 更新一个 atom：三个 residual column 几乎落在一条过原点的直线上，旧 atom (1,0) 的 error 是 5.63，取 top singular vector 作新 atom 后 error 降到 0.0198');
}

export default {
  'ma4270-rings': rings,
  'ma4270-sigmoid': sigmoidA,
  'ma4270-perceptron': perceptronA,
  'ma4270-slack': slack,
  'ma4270-losses': losses,
  'ma4270-ridgecloud': ridgecloud,
  'ma4270-ridgecurve': ridgecurve,
  'ma4270-lift': lift,
  'ma4270-krr': krr,
  'ma4270-lp': lp,
  'ma4270-sgd': sgdA,
  'ma4270-proj': projA,
  'ma4270-boost': boost,
  'ma4270-tail': tail,
  'ma4270-rad': rad,
  'ma4270-select': select,
  'ma4270-pca': pca,
  'ma4270-kpca': kpca,
  'ma4270-mm': mmA,
  'ma4270-em': emA,
  'ma4270-omp': ompA,
  'ma4270-ksvd': ksvd,
};
