import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const sup = (k) => String(k).split('').map((c) => (c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])).join('');
const fmtE = (v) => {
  if (v === 0) return '0';
  if (Math.abs(v) >= 0.01) return v >= 10 ? v.toFixed(1) : v.toFixed(v >= 1 ? 2 : 3);
  const e = Math.floor(Math.log10(Math.abs(v)));
  return (v / 10 ** e).toFixed(1) + '×10' + sup(e);
};
const sg = (v, n = 3) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
// 一串点 → path d；落在 box 外的点处断开
function brk(pts, box) {
  const [x0, y0, x1, y1] = box;
  const ins = ([x, y]) => x >= x0 - 0.5 && x <= x1 + 0.5 && y >= y0 - 0.5 && y <= y1 + 0.5;
  let s = '', run = [];
  const flush = () => { if (run.length > 1) s += d(run); run = []; };
  for (const p of pts) { if (ins(p)) run.push(p); else flush(); }
  flush();
  return s;
}
// 2×2 symmetric matrix 的 eigen decomposition
function eig2([[a, b], [, c]]) {
  const m = (a + c) / 2, r = Math.hypot((a - c) / 2, b);
  const l1 = m + r, l2 = m - r;
  let v1 = Math.abs(b) > 1e-12 ? [l1 - c, b] : a >= c ? [1, 0] : [0, 1];
  const n1 = Math.hypot(...v1); v1 = [v1[0] / n1, v1[1] / n1];
  return [[l1, v1], [l2, [-v1[1], v1[0]]]];
}
// ½ eᵀHe = c 的 contour（中心 ctr）
function ellipse(H, ctr, c, n = 240) {
  const [[l1, v1], [l2, v2]] = eig2(H);
  const a1 = Math.sqrt((2 * c) / l1), a2 = Math.sqrt((2 * c) / l2), pts = [];
  for (let i = 0; i <= n; i++) {
    const th = (2 * Math.PI * i) / n, p = a1 * Math.cos(th), q = a2 * Math.sin(th);
    pts.push([ctr[0] + p * v1[0] + q * v2[0], ctr[1] + p * v1[1] + q * v2[1]]);
  }
  return pts;
}
// 等长的帧：keyTimes 与每个时刻对应的帧号（最后停一会儿）
function frames(n, step, hold) {
  const T = step * n + hold, kt = [], idx = [];
  for (let k = 0; k <= n; k++) { kt.push((step * k) / T); idx.push(k); }
  kt.push(1); idx.push(n);
  return { T, kt, idx };
}
// 每帧一段文字，按帧切换
function ftexts(strs, F, x, y, cls = 'ts', anchor = 'start') {
  let o = '';
  const uniq = [...new Set(F.idx)];
  for (const k of uniq) o += `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" opacity="${k === 0 ? 1 : 0}">${strs[k]}${ashow(F.idx.map((j) => j === k), F.kt, F.T)}</text>`;
  return o;
}
function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const dash = (x1, y1, x2, y2) => line(x1, y1, x2, y2, 'dash');

// ---------- 开头：五个 algorithm 在同一张 contour 上 ----------
function five() {
  const A = [[6, 5], [5, 6]], bv = [17, 16];
  const g = (B) => [A[0][0] * B[0] + A[0][1] * B[1] - bv[0], A[1][0] * B[0] + A[1][1] * B[1] - bv[1]];
  const fe = (B) => { const e = [B[0] - 2, B[1] - 1]; return 0.5 * (6 * e[0] * e[0] + 10 * e[0] * e[1] + 6 * e[1] * e[1]); };
  const N = 12;
  // gradient descent t = 1/6（= Jacobi）
  const gdP = [[0, 0]];
  for (let k = 0; k < N; k++) { const B = gdP[k], G = g(B); gdP.push([B[0] - G[0] / 6, B[1] - G[1] / 6]); }
  // Gauss–Seidel（= coordinate descent）：画出中间的拐点
  const gsP = [[0, 0]], gsC = [[[0, 0]]];
  for (let k = 0; k < N; k++) {
    const B = gsP[k].slice();
    B[0] = (bv[0] - A[0][1] * B[1]) / A[0][0]; const mid = B.slice();
    B[1] = (bv[1] - A[1][0] * B[0]) / A[1][1];
    gsP.push(B); gsC.push([mid, B.slice()]);
  }
  // Gauss–Newton
  const gnP = [[0, 0]]; for (let k = 0; k < N; k++) gnP.push([2, 1]);
  // AdamW（λ = 0）
  const adP = [[0, 0]];
  { let B = [0, 0], m = [0, 0], v = [0, 0]; const b1 = 0.9, b2 = 0.95, al = 0.1;
    for (let t = 1; t <= N; t++) {
      const G = g(B);
      m = m.map((mi, i) => b1 * mi + (1 - b1) * G[i]); v = v.map((vi, i) => b2 * vi + (1 - b2) * G[i] * G[i]);
      const at = (al * Math.sqrt(1 - b2 ** t)) / (1 - b1 ** t);
      B = B.map((Bi, i) => Bi - (at * m[i]) / (Math.sqrt(v[i]) + 1e-8)); adP.push(B.slice());
    } }
  const F = frames(N, 0.55, 1.6);
  let o = '';
  const W = 210, H = 192.5;
  const panel = (X0, Y0, title, P, trail) => {
    const sx = lin(-0.3, 3.3, X0, X0 + W), sy = lin(-0.3, 3.0, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
    const q = (p) => [sx(p[0]), sy(p[1])];
    o += rect(X0, Y0, W, H, 'frame');
    for (const c of [0.25, 1.5, 5, 12, 25]) { const s = brk(ellipse(A, [2, 1], c).map(q), box); if (s) o += path(s, 'mute'); }
    o += text(X0 + W / 2, Y0 - 8, title, 'tb', 'middle');
    o += text(X0 + W - 3, Y0 + H - 5, 'β₁', 'ts', 'end') + text(X0 + 4, Y0 + 13, 'β₂', 'ts');
    o += path(d(trail(N).map(q)), 'dash');
    o += apath(F.idx.map((k) => d(trail(k).map(q))), F.kt, F.T, 'ln', true);
    o += circle(sx(0), sy(0), 3, 'ink-f') + circle(sx(2), sy(1), 4, 'ink paper-f');
    o += acircle(F.idx.map((k) => sx(P[k][0])), F.idx.map((k) => sy(P[k][1])), F.kt, F.T, 4.5, 'ln-f');
    o += ftexts(P.map((p, k) => `k = ${k}　f − f* = ${fmtE(fe(p))}`), F, X0, Y0 + H + 16);
  };
  const upto = (P) => (k) => P.slice(0, k + 1);
  panel(30, 26, 'Jacobi = GD，t = 1/6（同一条路）', gdP, upto(gdP));
  panel(310, 26, 'Gauss–Seidel = coordinate descent', gsP, (k) => gsC.slice(0, k + 1).flat());
  panel(30, 270, 'Gauss–Newton：一步到 β*', gnP, upto(gnP));
  panel(310, 270, 'AdamW：每个 coordinate 走约 0.1', adP, upto(adP));
  return svgA(560, 494, o, '动图：同一个 least squares 的 contour 上，四个 panel 同步走 12 步。Jacobi 与 t=1/6 的 gradient descent 是同一条 zigzag；Gauss–Seidel 每次沿一个 axis 走；Gauss–Newton 一步到 minimum；AdamW 沿 diagonal 每步挪 0.1');
}

// ---------- 骨架：quadratic model（ln cosh） ----------
function model() {
  const f = (x) => Math.log(Math.cosh(x)), fp = (x) => Math.tanh(x);
  const N = 8, F = frames(N, 0.9, 1.4);
  let o = '';
  const W = 250, H = 175, Y0 = 40;
  const panel = (X0, t, title, note) => {
    const sx = lin(-2.6, 2.6, X0, X0 + W), sy = lin(-0.25, 2.2, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
    o += rect(X0, Y0, W, H, 'frame');
    o += line(sx(-2.6), sy(0), sx(2.6), sy(0), 'grid') + line(sx(0), Y0, sx(0), Y0 + H, 'grid');
    const fpts = []; for (let i = 0; i <= 200; i++) { const x = -2.6 + (5.2 * i) / 200; fpts.push([sx(x), sy(f(x))]); }
    o += path(brk(fpts, box), 'ink');
    const xs = [2]; for (let k = 0; k < N; k++) xs.push(xs[k] - t * fp(xs[k]));
    const para = (xk) => { const pts = []; for (let i = 0; i <= 200; i++) { const z = -2.6 + (5.2 * i) / 200; pts.push([sx(z), sy(f(xk) + fp(xk) * (z - xk) + ((z - xk) ** 2) / (2 * t))]); } return brk(pts, box) || 'M0 0'; };
    o += apath(F.idx.map((k) => para(xs[k])), F.kt, F.T, 'ln', true);
    // model 的最低点（下一个 x）和它在 f 上的位置
    const mmin = (k) => [sx(xs[k + 1]), sy(f(xs[k]) - (t / 2) * fp(xs[k]) ** 2)];
    o += apath(F.idx.map((k) => { const [a, bq] = mmin(k); return `M${f1(a)} ${f1(Math.max(Y0, Math.min(Y0 + H, bq)))}L${f1(a)} ${f1(sy(f(xs[k + 1])))}`; }), F.kt, F.T, 'dash', true);
    o += acircle(F.idx.map((k) => sx(xs[k])), F.idx.map((k) => sy(f(xs[k]))), F.kt, F.T, 4.5, 'ln-f');
    o += acircle(F.idx.map((k) => mmin(k)[0]), F.idx.map((k) => Math.max(Y0, Math.min(Y0 + H, mmin(k)[1]))), F.kt, F.T, 3.5, 'ink paper-f');
    o += text(X0 + W / 2, 16, title, 'tb', 'middle') + text(X0 + W / 2, 32, note, 'ts', 'middle');
    o += text(sx(-2.45), sy(f(-2.45)) - 8, 'f', 'ts', 'start');
    o += ftexts(xs.map((x, k) => `k = ${k}　x = ${sg(x)}　f = ${f(x).toFixed(3)}`), F, X0, Y0 + H + 16);
  };
  panel(20, 1, 't = 1 = 1/L：model 在 f 上方', '空心点是 model 的最低点，虚线落到 f 上');
  panel(290, 2.5, 't = 2.5 > 2/L：model 太平', '最低点跳到另一侧，最后在 ±0.888 来回');
  return svgA(560, 238, o, '动图：f = ln cosh x 上的 gradient descent，每一帧画出当前点的 quadratic model。t = 1 时 model 在 f 上方，三步到 minimum；t = 2.5 时 model 太平，iterate 在 minimum 两侧来回跳');
}

// ---------- 骨架：factor 随 t 的变化 ----------
function factor() {
  const X0 = 60, X1 = 520, Y0 = 26, Y1 = 220;
  const sx = lin(0, 0.25, X0, X1), sy = lin(0, 1.8, Y1, Y0);
  let o = '';
  for (const v of [0, 0.5, 1, 1.5]) o += line(X0, sy(v), X1, sy(v), 'grid') + text(X0 - 7, sy(v) + 4, String(v), 'ts', 'end');
  for (const v of [0, 0.05, 0.1, 0.15, 0.2, 0.25]) o += line(sx(v), Y1, sx(v), Y1 + 4, 'axis') + text(sx(v), Y1 + 17, String(v), 'ts', 'middle');
  o += line(X0, Y1, X1, Y1, 'axis') + line(X0, Y0, X0, Y1, 'axis');
  o += text(X1, Y1 + 32, 't', 'ts', 'end') + text(X0 + 4, Y0 - 10, '每步乘的 factor 的 absolute value', 'ts', 'start');
  o += line(X0, sy(1), X1, sy(1), 'dash');
  const pts = (fn) => { const p = []; for (let i = 0; i <= 250; i++) { const t = (0.25 * i) / 250; p.push([sx(t), sy(fn(t))]); } return p; };
  const box = [X0, Y0, X1, Y1];
  o += path(brk(pts((t) => Math.max(Math.abs(1 - 11 * t), Math.abs(1 - t))), box), 'ln');
  o += path(brk(pts((t) => Math.abs(1 - 11 * t)), box), 'mute') + path(brk(pts((t) => Math.abs(1 - t)), box), 'mute');
  o += text(sx(0.13), sy(0.28), '|1 − 11t|（λ = 11，陡）', 'ts', 'start');
  o += text(sx(0.19), sy(0.81) - 6, '|1 − t|（λ = 1，平）', 'ts', 'start');
  o += text(sx(0.232), sy(1.55) - 6, '两者的 max', 'tl', 'end');
  // 三个特殊的 t
  o += circle(sx(1 / 11), sy(10 / 11), 3.5, 'ln-f') + text(sx(1 / 11), sy(10 / 11) + 20, 't = 1/11：0.909', 'ts', 'middle');
  o += circle(sx(1 / 6), sy(5 / 6), 4.5, 'ln-f') + text(sx(1 / 6) + 10, sy(5 / 6) + 26, 't = 1/6：5/6（最好）', 'tb', 'start');
  o += circle(sx(2 / 11), sy(1), 3.5, 'ink-f') + text(sx(2 / 11) - 8, sy(1) - 8, 't = 2/11：超过就 diverge', 'ts', 'end');
  return svg(560, 252, o, '两个 eigen-direction 的 factor |1 − 11t| 与 |1 − t| 随 t 变化，两者的最大值在 t = 1/6 处最小，等于 5/6；t 超过 2/11 时陡的方向的 factor 超过 1');
}

// ---------- 骨架：LQR policy search 上的 PL ----------
function plLqr() {
  const J = (k1, k2) => (k1 <= 0 || k2 <= 0 ? Infinity : ((1 + k1 * k1) * (k1 + 1 + k2 * k2)) / (2 * k1 * k2) + ((1 + k2 * k2) * (k1 + 1)) / (2 * k2) - k1 * k2);
  const Js = 2 * Math.sqrt(3), h = 1e-5;
  const grad = (k) => [(J(k[0] + h, k[1]) - J(k[0] - h, k[1])) / (2 * h), (J(k[0], k[1] + h) - J(k[0], k[1] - h)) / (2 * h)];
  const minEig = (a, b) => { const e = 1e-3, f0 = J(a, b);
    const xx = (J(a + e, b) - 2 * f0 + J(a - e, b)) / (e * e), yy = (J(a, b + e) - 2 * f0 + J(a, b - e)) / (e * e);
    const xy = (J(a + e, b + e) - J(a + e, b - e) - J(a - e, b + e) + J(a - e, b - e)) / (4 * e * e);
    return (xx + yy) / 2 - Math.hypot((xx - yy) / 2, xy); };
  const N = 300, P = [[0.4, 4]];
  for (let k = 0; k < N; k++) { const g = grad(P[k]); P.push([P[k][0] - 0.03 * g[0], P[k][1] - 0.03 * g[1]]); }
  const gap = P.map((p) => J(p[0], p[1]) - Js);
  const ev = 3, nF = N / ev, F = frames(nF, 0.09, 1.8);
  let o = '';
  // 左：landscape
  const X0 = 20, W = 250, Y0 = 40, H = 220, a0 = 0.05, a1 = 2.3, b0 = 0.8, b1 = 4.6;
  const sx = lin(a0, a1, X0, X0 + W), sy = lin(b0, b1, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
  const nx = 90, ny = 88, dxg = (a1 - a0) / nx, dyg = (b1 - b0) / ny;
  // nonconvex 的格子：按行合并成横条，全部放进一个 path（重叠处不会变深）
  let reg = '';
  for (let j = 0; j < ny; j++) {
    let run = -1;
    for (let i = 0; i <= nx; i++) {
      const neg = i < nx && minEig(a0 + (i + 0.5) * dxg, b0 + (j + 0.5) * dyg) < 0;
      if (neg && run < 0) run = i;
      if (!neg && run >= 0) { const x = sx(a0 + run * dxg), y = sy(b0 + (j + 1) * dyg); reg += `M${f1(x)} ${f1(y)}H${f1(sx(a0 + i * dxg))}V${f1(y + sy(b0) - sy(b0 + dyg) + 0.8)}H${f1(x)}Z`; run = -1; }
    }
  }
  o += path(reg, 'wash2');
  // contour：marching squares
  const G = []; for (let i = 0; i <= nx; i++) { G.push([]); for (let j = 0; j <= ny; j++) G[i].push(J(a0 + i * dxg, b0 + j * dyg) - Js); }
  for (const lev of [0.3, 1, 2.5, 5, 9]) {
    let s = '';
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const c = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], v = c.map(([p, q]) => G[p][q] - lev), pts = [];
      for (let e = 0; e < 4; e++) { const p = c[e], q = c[(e + 1) % 4], va = v[e], vb = v[(e + 1) % 4];
        if ((va < 0) !== (vb < 0)) { const t = va / (va - vb); pts.push([sx(a0 + (p[0] + t * (q[0] - p[0])) * dxg), sy(b0 + (p[1] + t * (q[1] - p[1])) * dyg)]); } }
      if (pts.length >= 2) s += `M${f1(pts[0][0])} ${f1(pts[0][1])}L${f1(pts[1][0])} ${f1(pts[1][1])}`;
      if (pts.length === 4) s += `M${f1(pts[2][0])} ${f1(pts[2][1])}L${f1(pts[3][0])} ${f1(pts[3][1])}`;
    }
    o += path(s, 'mute');
  }
  o += rect(X0, Y0, W, H, 'frame');
  const q = (p) => [sx(p[0]), sy(p[1])];
  o += path(d(P.map(q)), 'dash');
  o += apath(F.idx.map((k) => d(P.slice(0, ev * k + 1).map(q))), F.kt, F.T, 'ln', true);
  o += circle(sx(1), sy(Math.sqrt(3)), 4, 'ink paper-f') + text(sx(1) + 7, sy(Math.sqrt(3)) + 4, 'K*', 'ts', 'start');
  o += acircle(F.idx.map((k) => sx(P[ev * k][0])), F.idx.map((k) => sy(P[ev * k][1])), F.kt, F.T, 4.5, 'ln-f');
  o += text(X0 + W - 3, Y0 + H - 5, 'k₁', 'ts', 'end') + text(X0 + W - 3, Y0 + 13, 'k₂', 'ts', 'end');
  o += text(X0 + W / 2, 16, 'J(k₁, k₂) 的 level set', 'tb', 'middle') + text(X0 + W / 2, 32, '灰底：Hessian 有 negative eigenvalue', 'ts', 'middle');
  // 右：J − J* 的 log scale
  const R0 = 330, RW = 210, sxr = lin(0, N, R0, R0 + RW), syr = (v) => lin(-4, 1, Y0 + H, Y0)(Math.log10(v));
  o += line(R0, Y0 + H, R0 + RW, Y0 + H, 'axis') + line(R0, Y0, R0, Y0 + H, 'axis');
  for (const e of [-4, -3, -2, -1, 0, 1]) o += line(R0 - 4, syr(10 ** e), R0, syr(10 ** e), 'axis') + text(R0 - 7, syr(10 ** e) + 4, e === 0 ? '1' : e === 1 ? '10' : '10' + sup(e), 'ts', 'end');
  for (const k of [0, 100, 200, 300]) o += line(sxr(k), Y0 + H, sxr(k), Y0 + H + 4, 'axis') + text(sxr(k), Y0 + H + 17, String(k), 'ts', 'middle');
  o += text(R0 + RW, Y0 + H + 32, 'k', 'ts', 'end');
  // 参考线：每步 0.9586（过 k = 300 的实际值）
  const ref = (k) => gap[N] * 0.9586 ** (k - N);
  o += line(sxr(150), syr(ref(150)), sxr(300), syr(ref(300)), 'dash') + text(sxr(150) + 8, syr(ref(150)) - 6, '每步 × 0.9586', 'ts', 'start');
  o += path(d(gap.map((v, k) => [sxr(k), syr(v)])), 'mute');
  o += apath(F.idx.map((k) => d(gap.slice(0, ev * k + 1).map((v, i) => [sxr(i), syr(v)]))), F.kt, F.T, 'ln', true);
  o += acircle(F.idx.map((k) => sxr(ev * k)), F.idx.map((k) => syr(gap[ev * k])), F.kt, F.T, 4, 'ln-f');
  o += text(R0 + RW / 2, 16, 'J − J*，log scale', 'tb', 'middle') + text(R0 + RW / 2, 32, '直线 = 每步乘同一个 factor', 'ts', 'middle');
  o += ftexts(Array.from({ length: nF + 1 }, (_, k) => `k = ${ev * k}　K = (${P[ev * k][0].toFixed(3)}, ${P[ev * k][1].toFixed(3)})　J − J* = ${fmtE(gap[ev * k])}`), F, X0, Y0 + H + 16);
  return svgA(560, 300, o, '动图：LQR 的 cost J(k1, k2) 上从 (0.4, 4) 出发做 300 步 gradient descent。起点落在 Hessian 有 negative eigenvalue 的灰色区域里，路径离开它后走向 K* = (1, √3)；右边 J − J* 在 log scale 上后段接近一条直线');
}

// ---------- 桥一：Adam 在沿 axis 与转 45° 的 valley 上 ----------
function adamRot() {
  const N = 300, ev = 3, nF = N / ev, F = frames(nF, 0.1, 1.6);
  const Hd = [[100, 0], [0, 1]], c = Math.SQRT1_2;
  const Hr = [[50.5, 49.5], [49.5, 50.5]];
  const mv = (H, x) => [H[0][0] * x[0] + H[0][1] * x[1], H[1][0] * x[0] + H[1][1] * x[1]];
  const fq = (H, x) => 0.5 * (x[0] * mv(H, x)[0] + x[1] * mv(H, x)[1]);
  const runAdam = (H, x0) => { let x = x0.slice(), m = [0, 0], v = [0, 0]; const P = [x.slice()];
    for (let t = 1; t <= N; t++) { const gg = mv(H, x); m = m.map((mi, i) => 0.9 * mi + 0.1 * gg[i]); v = v.map((vi, i) => 0.999 * vi + 0.001 * gg[i] * gg[i]);
      x = x.map((xi, i) => xi - (0.03 * (m[i] / (1 - 0.9 ** t))) / (Math.sqrt(v[i] / (1 - 0.999 ** t)) + 1e-8)); P.push(x.slice()); }
    return P; };
  let o = '';
  const W = 250, H = 203, Y0 = 44;
  const panel = (X0, Hm, x0, title, note) => {
    const sx = lin(-1.6, 1.6, X0, X0 + W), sy = lin(-1.0, 1.6, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
    const q = (p) => [sx(p[0]), sy(p[1])];
    o += rect(X0, Y0, W, H, 'frame');
    for (const cc of [0.5, 3, 12, 30, 50.5]) { const s = brk(ellipse(Hm, [0, 0], cc).map(q), box); if (s) o += path(s, 'mute'); }
    const P = runAdam(Hm, x0);
    o += path(brk(P.map(q), box), 'dash');
    o += apath(F.idx.map((k) => d(P.slice(Math.max(0, ev * k - 30), ev * k + 1).map(q)) || 'M0 0'), F.kt, F.T, 'ln', true);
    o += circle(sx(x0[0]), sy(x0[1]), 3, 'ink-f') + circle(sx(0), sy(0), 4, 'ink paper-f');
    o += acircle(F.idx.map((k) => sx(P[ev * k][0])), F.idx.map((k) => sy(P[ev * k][1])), F.kt, F.T, 4.5, 'ln-f');
    o += text(X0 + W / 2, 16, title, 'tb', 'middle') + text(X0 + W / 2, 32, note, 'ts', 'middle');
    o += text(X0 + W - 3, Y0 + H - 5, 'x₁', 'ts', 'end') + text(X0 + 4, Y0 + 13, 'x₂', 'ts');
    o += ftexts(Array.from({ length: nF + 1 }, (_, k) => `k = ${ev * k}　f = ${fmtE(fq(Hm, P[ev * k]))}`), F, X0, Y0 + H + 16);
  };
  panel(20, Hd, [1, 1], 'H = diag(100, 1)：陡的方向是 x₁ axis', 'Adam 46 步到初值的 10⁻⁶');
  panel(290, Hr, [0, 2 * c], '同一个 H 转 45°', '30 步落到谷底，之后每步只挪约 0.001');
  return svgA(560, 272, o, '动图：Adam 在 condition number 100 的 quadratic 上走 300 步。Valley 沿 axis 时它几乎直奔 minimum；同一个 valley 转 45° 后它在谷里来回，慢得多');
}

// ---------- 桥二：river valley 上的 WSD ----------
function river() {
  const K = 4000, every = 50, nF = K / every, Td = 3600;
  const tOf = (s) => (s <= Td ? 0.5 : (0.5 * (K - s)) / (K - Td));
  const a = [1, 2, 4, 7, 11], rnd = mulberry(20261122);
  let r = -30, h = 0; const P = [[r, h]];
  for (let s = 1; s <= K; s++) {
    const t = tOf(s), i = Math.floor(rnd() * 5), j = Math.floor(rnd() * 5);
    h -= t * (h - (a[i] - 5)); r -= t * 0.01 * (r - (a[j] - 5)); P.push([r, h]);
  }
  const F = frames(nF, 0.13, 1.8);
  const X0 = 20, W = 520, Y0 = 30, H = 187.2;
  const sx = lin(-32, 4, X0, X0 + W), sy = lin(-6.5, 6.5, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
  const q = (p) => [sx(p[0]), sy(p[1])];
  let o = text(X0, 16, '横向：river 方向（λ = 0.01）　纵向：hillside 方向（λ = 1）　两者同比例', 'ts', 'start');
  o += rect(X0, Y0, W, H, 'frame');
  for (const c of [0.5, 2, 4.5, 8, 12.5, 18]) { const s = brk(ellipse([[0.01, 0], [0, 1]], [0, 0], c).map(q), box); if (s) o += path(s, 'mute'); }
  // 静态：stable 阶段的整条路径（灰）与 decay 的最后 100 步（黑）
  const stable = []; for (let s = 0; s <= Td; s += 3) stable.push(q(P[s]));
  o += path(brk(stable, box), 'grid');
  const last = []; for (let s = K - 100; s <= K; s++) last.push(q(P[s]));
  o += path(d(last), 'ink-b');
  o += circle(sx(0), sy(0), 4, 'ink paper-f') + circle(sx(-30), sy(0), 3, 'ink-f');
  // 动：最近 50 步的轨迹（每隔一步取一个点）
  o += apath(F.idx.map((k) => { const e = k * every, s0 = Math.max(0, e - every); const pts = []; for (let i = s0; i <= e; i += 2) pts.push(q(P[i])); pts.push(q(P[e])); return brk(pts, box) || 'M0 0'; }), F.kt, F.T, 'ln', true);
  o += acircle(F.idx.map((k) => q(P[k * every])[0]), F.idx.map((k) => Math.max(Y0, Math.min(Y0 + H, q(P[k * every])[1]))), F.kt, F.T, 4, 'ln-f');
  // 下方：schedule
  const L0 = 60, S0 = 252, S1 = 290, tx = lin(0, K, L0, X0 + W), ty = lin(0, 0.5, S1, S0);
  const sch = []; for (let s = 0; s <= K; s += 10) sch.push([tx(s), ty(s === 0 ? 0.5 : tOf(s))]);
  o += line(L0, S1, X0 + W, S1, 'axis') + path(d(sch), 'ink');
  o += text(L0 - 8, S0 + 4, '0.5', 'ts', 'end') + text(L0 - 8, S1 + 4, '0', 'ts', 'end');
  o += text(tx(Td) - 4, S1 + 15, '3600：开始 decay', 'ts', 'end') + text(X0 + W, S1 + 15, '4000', 'ts', 'end');
  o += acircle(F.idx.map((k) => tx(k * every)), F.idx.map((k) => ty(k === 0 ? 0.5 : tOf(k * every))), F.kt, F.T, 4, 'ln-f');
  o += ftexts(Array.from({ length: nF + 1 }, (_, k) => `k = ${k * every}　learning rate t = ${(k === 0 ? 0.5 : tOf(k * every)).toFixed(3)}`), F, L0, S0 - 10);
  return svgA(560, 306, o, '动图：river valley 上的 SGD，WSD schedule。灰色是 stable 阶段的整条路径：沿 river 走到 minimum 附近，同时在 hillside 方向上下乱跳；黑色是 decay 的最后 100 步，收成一点。彩色是当前最近 50 步');
}

// ---------- 桥三：momentum ----------
function momentum() {
  const N = 140, F = frames(N, 0.075, 1.6);
  const run = (alpha, beta) => { let x = [1, 1], z = [0, 0]; const P = [x.slice()];
    for (let k = 0; k < N; k++) { const g = [100 * x[0], x[1]]; z = [beta * z[0] + g[0], beta * z[1] + g[1]]; x = [x[0] - alpha * z[0], x[1] - alpha * z[1]]; P.push(x.slice()); }
    return P; };
  let o = '';
  const W = 165, H = 165, Y0 = 44;
  const panel = (X0, P, title, note) => {
    // 横轴 x₂（平），纵轴 x₁（陡）
    const sx = lin(-1.15, 1.15, X0, X0 + W), sy = lin(-1.15, 1.15, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
    const q = (p) => [sx(p[1]), sy(p[0])];
    o += rect(X0, Y0, W, H, 'frame');
    for (const c of [0.02, 0.12, 0.3, 0.5]) { const s = brk(ellipse([[100, 0], [0, 1]], [0, 0], c).map(q), box); if (s) o += path(s, 'mute'); }
    o += path(brk(P.map(q), box), 'grid');
    o += apath(F.idx.map((k) => brk(P.slice(Math.max(0, k - 12), k + 1).map(q), box) || 'M0 0'), F.kt, F.T, 'ln', true);
    o += circle(sx(1), sy(1), 3, 'ink-f') + circle(sx(0), sy(0), 3.5, 'ink paper-f');
    o += acircle(F.idx.map((k) => q(P[k])[0]), F.idx.map((k) => q(P[k])[1]), F.kt, F.T, 4.5, 'ln-f');
    o += text(X0 + W / 2, 16, title, 'tb', 'middle') + text(X0 + W / 2, 32, note, 'ts', 'middle');
    const fv = (p) => 0.5 * (100 * p[0] * p[0] + p[1] * p[1]);
    o += ftexts(P.map((p, k) => `k = ${k}　f = ${fmtE(fv(p))}`), F, X0, Y0 + H + 16);
  };
  panel(12, run(0.01, 0), 'gradient descent', 'x₂ 每步乘 0.99');
  panel(197, run(0.01, 0.9), 'β = 0.9', '每个方向都乘 √0.9 = 0.949');
  panel(382, run(0.01, 1), 'β = 1（忘了 zero_grad）', '没有 friction，一直转');
  return svgA(560, 236, o, '动图：同一个 condition number 100 的 valley 上，gradient descent、β = 0.9 的 momentum 和 β = 1 的 momentum 同步走 140 步。Gradient descent 沿谷底慢慢挪；β = 0.9 螺旋着进去；β = 1 绕着 minimum 一直转');
}

// ---------- 桥四：projected gradient 与 dual ascent ----------
function constraint() {
  const p = [3, 2], t = 0.25, Nst = 6;
  const proj = (v) => {
    if (v[0] + v[1] <= 2 && v[1] >= 0) return v.slice();
    const c = [];
    const w = [v[0] - (v[0] + v[1] - 2) / 2, v[1] - (v[0] + v[1] - 2) / 2]; if (w[1] >= 0) c.push(w);
    if (v[0] <= 2) c.push([v[0], 0]);
    c.push([2, 0]);
    return c.reduce((b, z) => (Math.hypot(z[0] - v[0], z[1] - v[1]) < Math.hypot(b[0] - v[0], b[1] - v[1]) ? z : b));
  };
  const X = [[0, 0]], V = [null];
  for (let k = 0; k < Nst; k++) { const x = X[k], v = [x[0] - t * 2 * (x[0] - p[0]), x[1] - t * 2 * (x[1] - p[1])]; V.push(v); X.push(proj(v)); }
  // 每一步两帧：先 gradient step，再 projection
  const nF = 2 * Nst, F = frames(nF, 0.7, 1.6);
  let o = '';
  { const X0 = 20, W = 260, Y0 = 40, H = 221;
    const sx = lin(-0.5, 3.5, X0, X0 + W), sy = lin(-0.8, 2.6, Y0 + H, Y0), box = [X0, Y0, X0 + W, Y0 + H];
    o += rect(X0, Y0, W, H, 'frame');
    o += poly([[sx(-0.5), sy(0)], [sx(2), sy(0)], [sx(-0.5), sy(2.5)]], 'wash');
    for (const r of [0.5, 1, Math.sqrt(4.5)]) { const pts = []; for (let i = 0; i <= 240; i++) { const a = (2 * Math.PI * i) / 240; pts.push([sx(p[0] + r * Math.cos(a)), sy(p[1] + r * Math.sin(a))]); } const s = brk(pts, box); if (s) o += path(s, 'mute'); }
    // 画到第 f 帧为止的线段
    const segs = (f) => { let s = '', u = ''; for (let k = 1; k <= Nst; k++) { if (2 * k - 1 <= f) s += `M${f1(sx(X[k - 1][0]))} ${f1(sy(X[k - 1][1]))}L${f1(sx(V[k][0]))} ${f1(sy(V[k][1]))}`; if (2 * k <= f) u += `M${f1(sx(V[k][0]))} ${f1(sy(V[k][1]))}L${f1(sx(X[k][0]))} ${f1(sy(X[k][1]))}`; } return [s || 'M0 0', u || 'M0 0']; };
    o += line(sx(-0.5), sy(2.5), sx(2.6), sy(-0.6), 'ink') + line(sx(-0.5), sy(0), sx(3.5), sy(0), 'ink');
    o += text(sx(2.62), sy(-0.6) + 4, 'x₁ + x₂ = 2', 'ts', 'start') + text(sx(-0.4), sy(0) + 15, 'x₂ = 0', 'ts', 'start');
    o += text(sx(-0.4), sy(1.0), 'feasible', 'ts', 'start');
    o += circle(sx(3), sy(2), 3.5, 'ink-f') + text(sx(3) + 6, sy(2) + 4, 'p', 'ts', 'start');
    o += circle(sx(1.5), sy(0.5), 4, 'ink paper-f') + text(sx(1.5) - 7, sy(0.5) + 4, 'x*', 'ts', 'end');
    { const all = segs(2 * Nst); o += path(all[0], 'grid') + path(all[1], 'mute'); }
    o += apath(F.idx.map((f) => segs(f)[0]), F.kt, F.T, 'dash', true);
    o += apath(F.idx.map((f) => segs(f)[1]), F.kt, F.T, 'ln', true);
    const cur = (f) => (f % 2 === 1 ? V[(f + 1) / 2] : X[f / 2]);
    o += circle(sx(0), sy(0), 3, 'ink-f');
    o += acircle(F.idx.map((f) => sx(cur(f)[0])), F.idx.map((f) => sy(cur(f)[1])), F.kt, F.T, 4.5, 'ln-f');
    o += text(X0 + W / 2, 16, 'primal：走一步，再 project', 'tb', 'middle') + text(X0 + W / 2, 32, 't = 0.25；x* = (1.5, 0.5)，距离每步减半', 'ts', 'middle');
    o += ftexts(Array.from({ length: nF + 1 }, (_, f) => { const k = Math.ceil(f / 2), c = cur(f); return f === 0 ? 'k = 0　x = (0, 0)' : `k = ${k}　${f % 2 ? 'gradient step' : 'project 之后'}　(${c[0].toFixed(3)}, ${c[1].toFixed(3)})`; }), F, X0, Y0 + H + 16);
  }
  { const X0 = 320, W = 220, Y0 = 40, H = 200;
    const sx = lin(0, 5, X0, X0 + W), sy = lin(0, 5, Y0 + H, Y0);
    const g = (u) => 3 * u - (u * u) / 2;
    o += line(X0, Y0 + H, X0 + W, Y0 + H, 'axis') + line(X0, Y0, X0, Y0 + H, 'axis');
    for (const v of [0, 1, 2, 3, 4, 5]) o += line(sx(v), Y0 + H, sx(v), Y0 + H + 4, 'axis') + text(sx(v), Y0 + H + 16, String(v), 'ts', 'middle');
    o += text(X0 + W, Y0 + H + 30, 'u', 'ts', 'end');
    const pts = []; for (let i = 0; i <= 200; i++) { const u = (5 * i) / 200; pts.push([sx(u), sy(g(u))]); }
    o += path(d(pts), 'ink');
    o += line(sx(0), sy(4.5), sx(5), sy(4.5), 'grid') + text(sx(5), sy(4.5) - 6, 'f* = 4.5', 'ts', 'end');
    o += line(sx(3), sy(4.5), sx(3), Y0 + H, 'grid') + text(sx(3) + 4, Y0 + H - 6, 'u* = 3', 'ts', 'start');
    o += text(sx(0.6), sy(g(0.6)) + 4, 'g(u)', 'ts', 'end');
    const us = (s) => { const U = [0]; for (let k = 0; k < Nst; k++) U.push(Math.max(0, U[k] + s * (3 - U[k]))); return U; };
    const A = us(0.5), B = us(1.5), at = (U, f) => U[Math.floor(f / 2)];
    for (const U of [A, B]) for (const u of U) o += circle(sx(u), sy(g(u)), 2.2, U === A ? 'ln-f' : 'mute-f');
    o += acircle(F.idx.map((f) => sx(at(B, f))), F.idx.map((f) => sy(g(at(B, f)))), F.kt, F.T, 4.5, 'mute-f');
    o += acircle(F.idx.map((f) => sx(at(A, f))), F.idx.map((f) => sy(g(at(A, f)))), F.kt, F.T, 4.5, 'ln-f');
    o += text(X0 + W / 2, 16, 'dual：对 u 做 gradient ascent', 'tb', 'middle') + text(X0 + W / 2, 32, '彩色 s = 0.5，灰色 s = 1.5', 'ts', 'middle');
    o += ftexts(Array.from({ length: nF + 1 }, (_, f) => `u = ${at(A, f).toFixed(3)}（s = 0.5）　${at(B, f).toFixed(3)}（s = 1.5）`), F, X0 + W, Y0 + H + 46, 'ts', 'end');
  }
  return svgA(560, 296, o, '动图：左边 projected gradient descent，每步先沿 negative gradient 走出 feasible set，再 project 回 line 上，逼近 (1.5, 0.5)；右边 dual function g(u) = 3u − u²/2 上的 dual ascent，s = 0.5 从左边爬上去，s = 1.5 在 u = 3 两侧来回跳');
}

// ---------- 桥五：两条 chain ----------
function chain() {
  const n = 6, X0 = 40, dx = 84;
  const xs = Array.from({ length: n }, (_, i) => X0 + i * dx);
  const rows = [
    { y: 106, lab: (i) => `x[${i}]`, inp: (i) => `u[${i}]`, back: 'λ', fac: 1.1, title: 'MIT 6.8210：shooting，横向是 time step n', jac: '× ∂f/∂x', note: '柱高：往回每步 × 1.1' },
    { y: 290, lab: (i) => `a[${i}]`, inp: (i) => `W[${i + 1}]`, back: 'δ', fac: 0.707, title: 'CS3244：MLP，横向是 layer l', jac: '× σ′ ⊙ Wᵀ', note: '柱高：往回每层 × 0.707' },
  ];
  // 帧：0 是静态图（全部画出）；1..n 是 forward；n+1..2n 是 backward；再停一会儿
  const nF = 2 * n, F = frames(nF, 0.55, 1.8);
  const vis = (cond) => ashow(F.idx.map(cond), F.kt, F.T);
  let o = '';
  for (const R of rows) {
    o += text(X0 - 20, R.y - 84, R.title, 'tb', 'start') + text(540, R.y - 84, R.note, 'ts', 'end');
    for (let i = 0; i < n; i++) {
      const cx = xs[i];
      o += rect(cx - 22, R.y - 13, 44, 26, 'paper', 4);
      o += `<rect x="${f1(cx - 22)}" y="${f1(R.y - 13)}" width="44" height="26" rx="4" class="wash-strong" opacity="0">${vis((f) => f >= i + 1 && f <= n)}</rect>`;
      o += text(cx, R.y + 5, R.lab(i), 't', 'middle');
      if (i < n - 1) {
        o += arrow(cx + 22, R.y, xs[i + 1] - 24, R.y, 'ink', 6);
        o += arrow(cx + dx / 2, R.y + 44, cx + dx / 2, R.y + 3, 'mute', 5) + text(cx + dx / 2, R.y + 58, R.inp(i), 'ts', 'middle');
      }
    }
    const xe = xs[n - 1] + 66;
    o += arrow(xs[n - 1] + 22, R.y, xe - 16, R.y, 'ink', 6) + circle(xe, R.y, 14, 'paper') + text(xe, R.y + 5, 'J', 't', 'middle');
    // backward：柱子的高度是传回来的 signal 的大小
    for (let i = n - 1; i >= 0; i--) {
      const hgt = 26 * R.fac ** (n - 1 - i), fOn = n + (n - i);
      const bx = xs[i] + 28, top = R.y - 16 - hgt;
      o += `<g>${rect(bx - 6, top, 12, hgt, 'solid')}${vis((f) => f === 0 || f >= fOn)}</g>`;
      if (i === n - 1 || i === 0) o += `<g>${text(bx, top - 5, R.back, 'tl', 'middle')}${vis((f) => f === 0 || f >= fOn)}</g>`;
    }
    o += `<g>${text(xs[2] + dx / 2, R.y + 78, `← backward：每一步 ${R.jac}`, 'tl', 'middle')}${vis((f) => f === 0 || f > n)}</g>`;
    o += `<g opacity="0">${text(xs[2] + dx / 2, R.y + 78, 'forward：存下每一个值 →', 'ts', 'middle')}${vis((f) => f >= 1 && f <= n)}</g>`;
  }
  return svgA(560, 378, o, '动图：上一行是 shooting 的 chain（x[n] 由 f 推到下一步，u[n] 从下方注入），下一行是 MLP 的 chain（a[l] 经过一层到下一层，W 从下方注入）。先从左往右 forward，再从右往左 backward；backward 的 signal 在上一行每步乘 1.1，在下一行每层乘 0.707');
}

export default {
  'thread-gradient-descent-five': five,
  'thread-gradient-descent-model': model,
  'thread-gradient-descent-factor': factor,
  'thread-gradient-descent-pl': plLqr,
  'thread-gradient-descent-adam': adamRot,
  'thread-gradient-descent-river': river,
  'thread-gradient-descent-momentum': momentum,
  'thread-gradient-descent-constraint': constraint,
  'thread-gradient-descent-chain': chain,
};
