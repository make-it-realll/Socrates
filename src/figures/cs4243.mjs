import { svg, svgA, anim, apath, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// 动图的时间轴：durs[i] 是第 i 帧停留的秒数 → keyTimes；末尾补一个 1
const timeline = (durs) => { const T = durs.reduce((a, b) => a + b, 0); const kt = []; let t = 0; for (const u of durs) { kt.push(t / T); t += u; } kt.push(1); return { T, kt }; };
const onlyAt = (n, ...idx) => { const a = Array.from({ length: n }, (_, i) => idx.includes(i)); a.push(a[n - 1]); return a; };
const atext = (x, y, s, cls, on, kt, T, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, kt, T)}</text>`;
// 多边形裁到矩形 [x0,x1]×[y0,y1] 里（Sutherland–Hodgman）
function clipPoly(pts, x0, x1, y0, y1) {
  const edges = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]], [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]], [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let out = pts;
  for (const [inside, cut] of edges) {
    const inp = out; out = [];
    inp.forEach((cur, i) => { const prev = inp[(i + inp.length - 1) % inp.length]; if (inside(cur)) { if (!inside(prev)) out.push(cut(prev, cur)); out.push(cur); } else if (inside(prev)) out.push(cut(prev, cur)); });
  }
  return out;
}

// ---------- 小工具 ----------
const K = { f: 500, cx: 320, cy: 240 };
const proj = (X) => [K.f * X[0] / X[2] + K.cx, K.f * X[1] / X[2] + K.cy];
const mv = (M, v) => M.map((r) => r.reduce((s, a, j) => s + a * v[j], 0));
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
const T = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const sk = (t) => [[0, -t[2], t[1]], [t[2], 0, -t[0]], [-t[1], t[0], 0]];
const Ry = (deg) => { const a = (deg * Math.PI) / 180; return [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]]; };
// Gaussian elimination with partial pivoting
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
// 4 对点求 homography（h33 = 1）
function homog(P, Q) {
  const A = [], b = [];
  P.forEach(([x, y], i) => {
    const [u, v] = Q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  });
  const h = solve(A, b);
  return [[h[0], h[1], h[2]], [h[3], h[4], h[5]], [h[6], h[7], 1]];
}
const hap = (H, [x, y]) => { const w = mv(H, [x, y, 1]); return [w[0] / w[2], w[1] / w[2]]; };
// 把 a·x + b·y + c = 0 裁到矩形 [x0,x1]×[y0,y1] 里
function clipLine(a, b, c, x0, x1, y0, y1) {
  const pts = [];
  if (Math.abs(b) > 1e-12) for (const x of [x0, x1]) { const y = -(a * x + c) / b; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) pts.push([x, y]); }
  if (Math.abs(a) > 1e-12) for (const y of [y0, y1]) { const x = -(b * y + c) / a; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) pts.push([x, y]); }
  return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null;
}

// ---------- 开头：三个失败 ----------
function intro() {
  let o = '';
  // (1) distortion：角落的点
  const s = 0.24, ox = 22, oy = 46;
  o += text(95, 22, '1. Lens distortion', 'tb', 'middle');
  o += rect(ox, oy, 640 * s, 480 * s, 'frame');
  const dist = (xn, yn) => { const r2 = xn * xn + yn * yn, k = 1 - 0.25 * r2 + 0.05 * r2 * r2; return [ox + s * (500 * xn * k + 320), oy + s * (500 * yn * k + 240)]; };
  const border = [];
  for (let i = 0; i <= 40; i++) border.push(dist(-0.64 + (1.28 * i) / 40, -0.48));
  for (let i = 0; i <= 30; i++) border.push(dist(0.64, -0.48 + (0.96 * i) / 30));
  for (let i = 0; i <= 40; i++) border.push(dist(0.64 - (1.28 * i) / 40, 0.48));
  for (let i = 0; i <= 30; i++) border.push(dist(-0.64, 0.48 - (0.96 * i) / 30));
  o += path(d(border) + 'Z', 'ln');
  const c0 = [ox + 640 * s, oy + 480 * s], c1 = dist(0.64, 0.48);
  o += circle(c0[0], c0[1], 3.5, 'ink-f') + circle(c1[0], c1[1], 3.5, 'ln-f');
  o += text(95, 182, '灰框：pinhole 预测', 'ts', 'middle') + text(95, 198, '彩线：实际成像的边框', 'ts', 'middle');
  o += text(95, 218, '角落差 55.8 pixel', 't', 'middle');
  // (2) LS vs RANSAC：log scale
  o += text(280, 22, '2. 20/50 个 match 是错的', 'tb', 'middle');
  const sy = (v) => 160 - 26 * Math.log10(v / 0.1);
  o += line(215, 160, 345, 160, 'axis');
  for (const [v, lab] of [[0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1000, '1000']]) o += line(211, sy(v), 215, sy(v), 'axis') + text(208, sy(v) + 4, lab, 'ts', 'end');
  o += line(215, sy(1000), 215, 160, 'axis');
  o += rect(235, sy(371), 40, 160 - sy(371), 'solid2') + rect(290, sy(0.17), 40, 160 - sy(0.17), 'solid');
  o += text(255, sy(371) - 6, '371', 'ts', 'middle') + text(310, sy(0.17) - 6, '0.17', 'ts', 'middle');
  o += text(255, 178, 'least', 'ts', 'middle') + text(255, 192, 'squares', 'ts', 'middle') + text(310, 178, 'RANSAC', 'ts', 'middle');
  o += text(280, 218, '正确点的平均偏差（pixel）', 't', 'middle');
  // (3) stereo depth error
  o += text(465, 22, '3. Stereo：disparity 差 1 pixel', 'tb', 'middle');
  const sx3 = lin(0, 6, 400, 540), sy3 = lin(0, 1.6, 160, 44);
  o += axes({ sx: sx3, sy: sy3, x0: 0, x1: 6, y0: 0, y1: 1.6, xt: [0, 2, 5], yt: [0, 0.5, 1.5] });
  o += path(curve((Z) => (Z * Z) / 50, 0.3, 5.6, sx3, sy3), 'ln');
  for (const Z of [2, 5]) o += circle(sx3(Z), sy3((Z * Z) / 50), 3.5, 'ink-f');
  o += text(sx3(2) - 4, sy3(0.08) - 10, '8 cm', 'ts', 'end') + text(sx3(5) - 8, sy3(0.5) - 2, '0.5 m', 'ts', 'end');
  o += text(470, 192, 'depth Z（m）', 'ts', 'middle');
  o += text(465, 218, 'depth error（m）随 Z² 增长', 't', 'middle');
  return svg(560, 232, o, '三个失败：wide-angle lens 让 image 角落偏 56 pixel；有 outlier 时 least squares 的 homography 偏几百 pixel 而 RANSAC 只偏 0.17；stereo 的 depth error 随距离平方增长');
}

// ---------- 第 1 站 ----------
const P5 = [[10, 10, 10, 50, 50], [10, 10, 10, 50, 50], [10, 10, 10, 50, 50], [10, 10, 50, 50, 50], [10, 10, 50, 50, 50]];
const SX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
function conv() {
  const c = 32;
  let o = '';
  const sgn = (v) => String(v).replace('-', '−');
  const out = [1, 2, 3].map((r) => [1, 2, 3].map((cc) => { let s = 0; for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) s += SX[i + 1][j + 1] * P5[r + i][cc + j]; return s; }));
  // 帧：0 = 中心位置、output 全部填好；1–9 = kernel 按 raster 顺序走过 9 个位置，output 一格一格填
  const pos = [[1, 1], ...[0, 1, 2].flatMap((r) => [0, 1, 2].map((cc) => [r, cc]))];
  const NF = pos.length;
  const { T, kt } = timeline(pos.map((_, f) => (f === 0 ? 3.2 : 1.6)));
  const fr = [...pos, pos[NF - 1]];
  const grid = (x0, y0, M) => { let g = ''; M.forEach((r, i) => r.forEach((v, j) => { g += rect(x0 + j * c, y0 + i * c, c, c, 'frame') + text(x0 + j * c + c / 2, y0 + i * c + c / 2 + 5, sgn(v), 'ts', 'middle'); })); return g; };
  const mov = (x0, y0, w, cls) => `<rect x="${f1(x0 + fr[0][1] * c)}" y="${f1(y0 + fr[0][0] * c)}" width="${w}" height="${w}" class="${cls}">${anim('x', fr.map(([, cc]) => f1(x0 + cc * c)), kt, T, true)}${anim('y', fr.map(([r]) => f1(y0 + r * c)), kt, T, true)}</rect>`;
  o += text(20 + 2.5 * c, 26, 'patch P（5×5）', 'tb', 'middle');
  o += mov(20, 40, 3 * c, 'wash');
  o += grid(20, 40, P5);
  o += mov(20, 40, 3 * c, 'ln');
  o += text(205, 40 + 2.5 * c + 6, '⊗', 'tbig', 'middle');
  o += text(230 + 1.5 * c, 26, 'Sobel kernel Sₓ', 'tb', 'middle');
  o += grid(230, 40 + c, SX);
  o += text(352, 40 + 2.5 * c + 6, '=', 'tbig', 'middle');
  o += text(380 + 1.5 * c, 26, 'output（3×3）', 'tb', 'middle');
  o += mov(380, 40 + c, c, 'wash');
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const k = i * 3 + j + 1; // 第几帧算出这一格
    o += rect(380 + j * c, 40 + c + i * c, c, c, 'frame');
    o += atext(380 + j * c + c / 2, 40 + c + i * c + c / 2 + 5, sgn(out[i][j]), 'ts', fr.map((_, f) => f === 0 || f >= k), kt, T, 'middle');
  }
  o += mov(380, 40 + c, c, 'ln');
  // 每个位置的算式：kernel 三行各自的贡献
  const expr = ([r, cc]) => [0, 1, 2].map((i) => {
    const row = [0, 1, 2].map((j) => SX[i][j] * P5[r + i][cc + j]);
    return '(' + row.map((v, j) => (j === 0 ? sgn(v) : (v < 0 ? ' − ' : ' + ') + Math.abs(v))).join('') + ')';
  }).join(' + ') + ' = ' + sgn(out[r][cc]);
  pos.forEach((p, f) => {
    o += atext(280, 222, (f === 0 ? '中心位置：' : `位置 ${f} / 9：`) + expr(p), 't', onlyAt(NF, f), kt, T, 'middle');
  });
  o += text(280, 242, '彩框里的 9 个数和 kernel 逐项相乘再相加；kernel 每挪一格，output 多一个数', 'ts', 'middle');
  return svgA(560, 256, o, '动图：5 乘 5 的 patch 与 Sobel kernel 做 correlation。彩框按行依次走过 9 个位置，每个位置的 3 乘 3 邻域逐项相乘再相加，output 一格一格填满；中心位置得到 160');
}
const NOISE = [0.25, -0.26, 1.28, 0.21, -1.07, 0.72, 2.61, 1.89, -1.41, -2.53, -1.25, 0.08, -4.65, -0.44, -2.49, -1.46, -1.09, -0.63, 0.82, 2.09, -0.26, 2.73, -1.33, 0.70, 1.81, 0.19, -1.49, -1.84, -0.92, 0.44, -2.02, -0.42, -0.32, 1.08, 0.43, 0.71, -1.31, -0.26, 1.57, 2.99, -2.52, 3.03, 2.69, 1.56, 0.53, -0.63, 2.92, 3.92, 3.60, 2.63, 0.71, -2.42, -0.01, 1.31, -2.58, 0.79, 0.86, 1.39, -2.37, -1.32, -0.87, -2.34, 3.48, -0.99, 0.66, -0.52, 3.17, 2.64, 1.27, -4.41, 0.10, 1.37, 2.01, -1.24, 3.64, -2.64, -1.32, 1.87, 0.10, 4.00];
function edge1d() {
  const N = 80, I = NOISE.map((n, x) => Math.min(30, Math.max(10, 10 + 2 * (x - 35))) + n);
  const cd = I.map((_, x) => (x > 0 && x < N - 1 ? (I[x + 1] - I[x - 1]) / 2 : NaN));
  const ks = [], w = [];
  for (let k = -8; k <= 8; k++) { ks.push(k); w.push(k * Math.exp(-(k * k) / 8)); }
  const norm = w.reduce((s, v, i) => s + v * ks[i], 0);
  const dog = I.map((_, x) => (x >= 8 && x < N - 8 ? w.reduce((s, v, i) => s + (v / norm) * I[x + ks[i]], 0) : NaN));
  const sx = lin(0, 79, 80, 540);
  let o = '';
  const panel = (y0, h, data, lo, hi, ticks, title, ref) => {
    const sy = lin(lo, hi, y0 + h, y0);
    o += line(80, y0 + h, 540, y0 + h, 'axis') + line(80, y0, 80, y0 + h, 'axis');
    for (const t of ticks) o += line(76, sy(t), 80, sy(t), 'axis') + text(72, sy(t) + 4, String(t).replace('-', '−'), 'ts', 'end');
    if (ref !== undefined) o += line(80, sy(ref), 540, sy(ref), 'dash');
    const pts = [];
    data.forEach((v, x) => { if (Number.isFinite(v)) pts.push([sx(x), sy(v)]); });
    o += path(d(pts), 'ln');
    o += text(88, y0 - 6, title, 'tb');
  };
  panel(24, 70, I, 0, 40, [10, 30], 'Intensity：ramp 加 σ = 2 的 noise');
  panel(136, 70, cd, -6, 6, [-4, 0, 4], 'Central difference：noise 的峰比 edge 的 2 还高', 2);
  panel(248, 70, dog, -1, 3, [0, 2], 'Derivative of Gaussian（σ = 2）：只剩 x = 39 附近一个峰', 2);
  for (const t of [0, 20, 40, 60, 79]) o += text(sx(t), 336, String(t), 'ts', 'middle');
  o += text(540, 356, 'x（pixel）', 'ts', 'end');
  o += text(80, 356, '中下两图的虚线：derivative = 2', 'ts');
  return svg(560, 362, o, '一条带 noise 的 scanline，直接求 derivative 时 noise 的峰比 edge 还高，先用 Gaussian smooth 再求 derivative 后只剩 edge 处一个峰');
}

// ---------- 第 2 站 ----------
function harris() {
  let o = '';
  const S = 150, R = 2;
  const panel = (x0, title, sub, draw) => {
    const sx = lin(-R, R, x0, x0 + S), sy = lin(-R, R, 40, 40 + S); // v 向下
    o += rect(x0, 40, S, S, 'frame');
    o += draw(sx, sy);
    o += line(sx(-R), sy(0), sx(R), sy(0), 'axis') + line(sx(0), sy(-R), sx(0), sy(R), 'axis');
    o += text(sx(R) - 4, sy(0) - 5, it('u'), 't', 'end') + text(sx(0) + 5, sy(R) - 5, it('v'), 't');
    o += text(x0 + S / 2, 26, title, 'tb', 'middle') + text(x0 + S / 2, 40 + S + 20, sub, 'ts', 'middle');
  };
  panel(25, 'flat', 'λ = 0, 0：处处 E < 100', () => rect(25, 40, S, S, 'wash'));
  panel(205, 'edge', 'λ = 150, 0：两条平行线', (sx, sy) => {
    const a = Math.sqrt(100 / 150);
    return rect(sx(-a), 40, sx(a) - sx(-a), S, 'wash') + line(sx(-a), 40, sx(-a), 40 + S, 'ln') + line(sx(a), 40, sx(a), 40 + S, 'ln');
  });
  panel(385, 'corner', 'λ = 125, 75：封闭的 ellipse', (sx, sy) => {
    const pts = [];
    // M = [[100,25],[25,100]]；eigenvector (1,1)/√2 → 125，(1,−1)/√2 → 75
    const a1 = Math.sqrt(100 / 125), a2 = Math.sqrt(100 / 75), r = Math.SQRT1_2;
    for (let i = 0; i <= 120; i++) {
      const t = (2 * Math.PI * i) / 120, p = a1 * Math.cos(t), q = a2 * Math.sin(t);
      pts.push([sx(r * p + r * q), sy(r * p - r * q)]);
    }
    return path(d(pts) + 'Z', 'wash') + path(d(pts) + 'Z', 'ln');
  });
  o += text(280, 236, '浅色区域是 E(u, v) < 100 的 shift；v 轴向下，与 image 的 y 一致', 'ts', 'middle');
  return svg(560, 248, o, '三种 window 的 E 等于 100 的 level set：flat 时整个 plane，edge 时两条平行线之间的带，corner 时一个封闭 ellipse');
}

// ---------- 第 3 站 ----------
function pinhole() {
  let o = '';
  const O = [70, 170], f = 130, Zp = 420, Yp = -110;
  const P = [O[0] + Zp, O[1] + Yp], y = (f * Yp) / Zp;
  o += line(30, O[1], 540, O[1], 'axis') + text(540, O[1] + 18, 'optical axis（z）', 'ts', 'end');
  o += line(O[0] + f, 40, O[0] + f, 230, 'ink') + text(O[0] + f + 6, 228, 'image plane', 'ts');
  o += line(O[0], O[1], P[0], P[1], 'ln');
  o += circle(O[0], O[1], 4, 'ink-f') + text(O[0] - 4, O[1] + 22, 'center of projection', 'ts');
  o += circle(P[0], P[1], 4.5, 'ln-f') + text(P[0] + 8, P[1] - 4, '(' + it('Y') + ', ' + it('Z') + ')', 't');
  o += circle(O[0] + f, O[1] + y, 4, 'ink-f') + text(O[0] + f - 8, O[1] + y - 2, it('y'), 't', 'end');
  o += line(P[0], P[1], P[0], O[1], 'dash') + text(P[0] + 8, (P[1] + O[1]) / 2 + 4, it('Y'), 't');
  // f 与 Z 的标尺
  o += line(O[0], 252, O[0] + f, 252, 'mute') + line(O[0], 246, O[0], 258, 'mute') + line(O[0] + f, 246, O[0] + f, 258, 'mute');
  o += text(O[0] + f / 2, 272, it('f'), 't', 'middle');
  o += line(O[0], 290, P[0], 290, 'mute') + line(P[0], 284, P[0], 296, 'mute') + line(O[0], 284, O[0], 296, 'mute');
  o += text((O[0] + P[0]) / 2, 310, it('Z'), 't', 'middle');
  o += text(330, 70, '两个 similar triangle：y / f = Y / Z', 't', 'middle');
  return svg(560, 320, o, 'Pinhole camera 的侧视图：3D 点、center of projection 和 image plane 上的投影在同一条 ray 上，构成两个 similar triangle');
}

function distort() {
  const s = 0.6, ox = 88, oy = 20;
  const px = (xn, yn, k) => [ox + s * (500 * xn * k + 320), oy + s * (500 * yn * k + 240)];
  const fac = (xn, yn) => { const r2 = xn * xn + yn * yn; return 1 - 0.25 * r2 + 0.05 * r2 * r2; };
  let o = rect(ox, oy, 640 * s, 480 * s, 'frame');
  const xs = [], ys = [];
  for (let i = 0; i <= 8; i++) { xs.push(-0.64 + 0.16 * i); ys.push(-0.48 + 0.12 * i); }
  for (const x of xs) {
    o += line(...px(x, -0.48, 1), ...px(x, 0.48, 1), 'grid');
    const pts = []; for (let j = 0; j <= 40; j++) { const y = -0.48 + (0.96 * j) / 40; pts.push(px(x, y, fac(x, y))); }
    o += path(d(pts), 'ln');
  }
  for (const y of ys) {
    o += line(...px(-0.64, y, 1), ...px(0.64, y, 1), 'grid');
    const pts = []; for (let j = 0; j <= 50; j++) { const x = -0.64 + (1.28 * j) / 50; pts.push(px(x, y, fac(x, y))); }
    o += path(d(pts), 'ln');
  }
  const a = px(0.64, 0.48, 1), b = px(0.64, 0.48, fac(0.64, 0.48));
  o += circle(a[0], a[1], 4, 'ink-f') + circle(b[0], b[1], 4, 'ln-f');
  o += text(a[0] + 6, a[1] + 16, '(640, 480)', 'ts', 'start');
  o += text(ox + 640 * s + 8, b[1] - 22, '偏 55.8', 'ts') + text(ox + 640 * s + 8, b[1] - 6, 'pixel', 'ts');
  o += text(280, 330, '灰线：pinhole 下的格子；彩线：k₁ = −0.25、k₂ = 0.05 时的实际位置', 'ts', 'middle');
  return svg(560, 340, o, '640 乘 480 的 image 上，pinhole 下的直格子和 barrel distortion 后的格子对比；中心几乎重合，角落偏差最大');
}

function weakpersp() {
  let o = '';
  const Zimg = 0.5; // 画图用的 image plane 位置（只是示意，pixel 值用 f = 500 算）
  const uP = (X, Z) => K.f * X / Z + K.cx;
  const panel = (x0, Zs, title, Zmax) => {
    const X = 0.2, Z0 = (Zs[0] + Zs[1]) / 2;
    const sx = lin(0, Zmax, x0 + 14, x0 + 258), sy = lin(-0.03, 0.24, 196, 52);
    o += text(x0 + 136, 22, title, 'tb', 'middle');
    o += line(sx(0), sy(0), sx(Zmax), sy(0), 'axis') + text(sx(Zmax), sy(0) + 16, it('Z'), 't', 'end');
    o += line(sx(Zimg), sy(-0.03), sx(Zimg), sy(0.24), 'ink');
    o += line(sx(Z0), sy(-0.03), sx(Z0), sy(0.24), 'dash') + text(sx(Z0), sy(0.24) - 6, 'Z₀ = ' + Z0.toFixed(2), 'ts', 'middle');
    o += circle(sx(0), sy(0), 4, 'ink-f');
    // weak perspective：沿 Z 压到 Z0，再从 O 投影
    for (const Z of Zs) o += line(sx(Z), sy(X), sx(Z0), sy(X), 'dash');
    o += line(sx(0), sy(0), sx(Z0), sy(X), 'dash');
    for (const Z of Zs) o += line(sx(0), sy(0), sx(Z), sy(X), 'ln');
    for (const Z of Zs) o += circle(sx(Z), sy(X), 4, 'ln-f');
    o += circle(sx(Z0), sy(X), 3.5, 'ink paper-f');
    for (const Z of Zs) o += circle(sx(Zimg), sy(Zimg * X / Z), 3.2, 'ln-f');
    o += circle(sx(Zimg), sy(Zimg * X / Z0), 3.2, 'ink paper-f');
    if (Zs[1] - Zs[0] < 0.5) o += text(sx(Zs[0]) - 10, sy(X) - 8, `Z = ${Zs[0].toFixed(1)}、${Zs[1].toFixed(1)}`, 'ts', 'end');
    else for (const Z of Zs) o += text(sx(Z) + (Z === Zs[0] ? 8 : 0), sy(X) + 18, `Z = ${Z}`, 'ts', Z === Zs[0] ? 'start' : 'middle');
    o += text(x0 + 14, 222, `perspective：u = ${uP(X, Zs[0]).toFixed(1)}、${uP(X, Zs[1]).toFixed(1)}`, 'tl');
    o += text(x0 + 14, 240, `weak perspective：u = ${uP(X, Z0).toFixed(1)}`, 'ts');
  };
  panel(4, [2.0, 2.1], '杯子：深 0.1 m，在 2 m 外', 2.4);
  panel(288, [1, 4], '走廊：从 1 m 到 4 m', 4.3);
  o += text(18, 44, 'image plane', 'ts');
  o += text(280, 262, '俯视，X 方向放大；彩线：perspective 的 ray；虚线：先压到 Z₀ 再投影', 'ts', 'middle');
  return svg(560, 270, o, '俯视对比 perspective 和 weak perspective：一个只有 0.1 m 深的杯子，两种 model 落在 image 上几乎同一处；一条从 1 m 到 4 m 的走廊，两种 model 差 60 和 15 pixel');
}

// ---------- 第 4 站 ----------
function blend() {
  let o = '';
  const sx = lin(200, 440, 70, 530);
  // 上：两张 image 在 output frame 里的位置
  o += rect(sx(200), 30, sx(340) - sx(200), 34, 'wash2');
  o += rect(sx(300), 74, sx(440) - sx(300), 34, 'wash2');
  o += rect(sx(300), 30, sx(340) - sx(300), 78, 'wash');
  o += rect(sx(200), 30, sx(340) - sx(200), 34, 'frame') + rect(sx(300), 74, sx(440) - sx(300), 34, 'frame');
  o += text(sx(250), 52, 'I₁：120', 't', 'middle') + text(sx(390), 96, 'I₂：100', 't', 'middle');
  o += text(sx(320), 22, 'overlap', 'ts', 'middle');
  // 下：沿一个 row 的 intensity
  const sy = lin(95, 125, 270, 140);
  o += axes({ sx, sy, x0: 200, x1: 440, y0: 95, y1: 125, xt: [200, 300, 340, 440], yt: [100, 110, 120], xl: 'u（pixel）' });
  const alpha = (u) => (u <= 300 ? 1 : u >= 340 ? 0 : (340 - u) / 40);
  const C = (u) => alpha(u) * 120 + (1 - alpha(u)) * 100;
  o += path(d([[sx(200), sy(120)], [sx(320), sy(120)], [sx(320), sy(100)], [sx(440), sy(100)]]), 'ln-dash');
  o += path(curve(C, 200, 440, sx, sy), 'ln');
  for (const u of [310, 330]) o += circle(sx(u), sy(C(u)), 3.5, 'ink-f') + text(sx(u) + 6, sy(C(u)) - 6, `${u}：${C(u)}`, 'ts');
  o += line(sx(300), 108, sx(300), 270, 'grid') + line(sx(340), 108, sx(340), 270, 'grid');
  o += line(380, 150, 404, 150, 'ln-dash') + text(410, 154, '在 u = 320 硬切换', 'ts');
  o += line(380, 170, 404, 170, 'ln') + text(410, 174, 'alpha blending', 'ts');
  return svg(560, 300, o, '两张 image 在 output 里重叠 40 个 pixel，一张亮 120、一张亮 100；硬切换在中间跳 20，alpha blending 在 overlap 里线性过渡');
}

function transforms() {
  let o = '';
  const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const W = 104;
  const c = Math.cos(Math.PI / 6), s = Math.sin(Math.PI / 6);
  const cases = [
    ['translation', '2 DOF', 'length、angle', (p) => [p[0] + 0.5, p[1] + 0.3]],
    ['Euclidean', '3 DOF', 'length、angle', (p) => [c * p[0] - s * p[1] + 0.7, s * p[0] + c * p[1] + 0.1]],
    ['similarity', '4 DOF', 'angle、ratio', (p) => [0.7 * (c * p[0] - s * p[1]) + 0.8, 0.7 * (s * p[0] + c * p[1]) + 0.3]],
    ['affine', '6 DOF', 'parallel', (p) => [p[0] + 0.5 * p[1] + 0.2, 0.2 * p[0] + 0.8 * p[1] + 0.3]],
    ['projective', '8 DOF', 'straight line', (p) => { const w = 1 + 0.45 * p[1]; return [(1.25 * p[0] + 0.15 * p[1]) / w + 0.25, (1.0 * p[1]) / w + 0.4 + 0.1 * p[0]]; }],
  ];
  cases.forEach(([name, dof, keep, fn], i) => {
    const x0 = 12 + i * (W + 6);
    const sx = lin(-0.1, 1.9, x0 + 6, x0 + W - 6), sy = lin(-0.1, 1.9, 150, 46);
    o += rect(x0, 40, W, 116, 'frame');
    o += poly(sq.map(([x, y]) => [sx(x), sy(y)]), 'wash2') ;
    o += path(d(sq.map(([x, y]) => [sx(x), sy(y)])) + 'Z', 'dash');
    const q = sq.map(fn);
    o += path(d(q.map(([x, y]) => [sx(x), sy(y)])) + 'Z', 'ln');
    o += text(x0 + W / 2, 22, name, 'tb', 'middle') + text(x0 + W / 2, 174, dof, 't', 'middle');
    o += text(x0 + W / 2, 194, '保持 ' + keep, 'ts', 'middle');
  });
  o += text(280, 220, '灰色虚线：unit square；彩线：变换后。从左到右限制越来越少，保持的性质也越来越少', 'ts', 'middle');
  return svg(560, 230, o, '同一个 unit square 在 translation、Euclidean、similarity、affine、projective 五种变换下的样子和 degree of freedom');
}

const PAGE = [[0, 0], [210, 0], [210, 297], [0, 297]];
const QUAD = [[200, 80], [440, 90], [500, 420], [140, 400]];
function rectify() {
  const H = homog(PAGE, QUAD);
  const s = 0.56, ox = 14, oy = 30;
  const P = ([u, v]) => [ox + s * u, oy + s * v];
  let o = rect(ox, oy, 640 * s, 480 * s, 'frame');
  o += text(ox + 4, oy - 8, 'Image（640×480）', 'tb');
  o += poly(QUAD.map(P), 'wash');
  for (let i = 0; i <= 5; i++) { const x = 42 * i; o += line(...P(hap(H, [x, 0])), ...P(hap(H, [x, 297])), i % 5 ? 'mute' : 'ln'); }
  for (let j = 0; j <= 5; j++) { const y = 59.4 * j; o += line(...P(hap(H, [0, y])), ...P(hap(H, [210, y])), j % 5 ? 'mute' : 'ln'); }
  o += line(...P(QUAD[0]), ...P(QUAD[2]), 'dash') + line(...P(QUAD[1]), ...P(QUAD[3]), 'dash');
  const c = hap(H, [105, 148.5]), avg = [320, 247.5];
  o += circle(...P(c), 4.5, 'ink-f') + circle(...P(avg), 4.5, 'ln paper-f');
  const lx = ox + s * 500;
  o += line(P(c)[0] + 6, P(c)[1], lx - 4, P(c)[1], 'mute') + text(lx, P(c)[1] + 4, '(319.1, 215.0)', 'ts');
  o += line(P(avg)[0] + 6, P(avg)[1], lx - 4, P(avg)[1], 'mute') + text(lx, P(avg)[1] + 4, '(320, 247.5)', 'ts');
  QUAD.forEach((q, i) => { const [x, y] = P(q); o += text(x + [-6, 6, 6, -6][i], y + [-6, -6, 16, 16][i], `(${q[0]}, ${q[1]})`, 'ts', i % 3 ? 'start' : 'end'); });
  // 右边：page
  const ps = 0.5, px0 = 430, py0 = 60;
  const Q = ([x, y]) => [px0 + ps * x, py0 + ps * y];
  o += text(px0 + 105 * ps, py0 - 14, 'A4 page（mm）', 'tb', 'middle');
  o += poly(PAGE.map(Q), 'wash');
  for (let i = 0; i <= 5; i++) o += line(...Q([42 * i, 0]), ...Q([42 * i, 297]), i % 5 ? 'mute' : 'ln');
  for (let j = 0; j <= 5; j++) o += line(...Q([0, 59.4 * j]), ...Q([210, 59.4 * j]), j % 5 ? 'mute' : 'ln');
  o += circle(...Q([105, 148.5]), 4.5, 'ink-f');
  o += text(px0 + 105 * ps, py0 + 297 * ps + 18, '(105, 148.5)', 'ts', 'middle');
  o += arrow(398, 134, 422, 134, 'ink') + text(410, 124, 'H⁻¹', 't', 'middle');
  o += text(280, 328, '实心点：page 中心的 image，也是两条 diagonal 的交点；空心点：四个角的平均', 'ts', 'middle');
  return svg(560, 340, o, '一张 A4 纸在照片里是一个 quadrilateral，page 上等距的格线经过 homography 后不再等距；page 中心落在 diagonal 的交点上，不在四个角的平均处');
}

// ---------- 第 5 站 ----------
const RX = [[1, 1.6], [2, 1.9], [3, 2.5], [4, 3.2], [5, 3.4], [6, 4.1], [7, 4.3], [8, 5.0], [9, 5.6], [10, 5.9]];
const ROUT = [[2.5, 7.5], [6.5, 1.0], [8.5, 8.8]];
function fitLS(pts) {
  const n = pts.length, sx = pts.reduce((s, p) => s + p[0], 0), sy = pts.reduce((s, p) => s + p[1], 0);
  const sxx = pts.reduce((s, p) => s + p[0] * p[0], 0), sxy = pts.reduce((s, p) => s + p[0] * p[1], 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  return [m, (sy - m * sx) / n];
}
function ransacline() {
  const all = [...RX, ...ROUT];
  const [mL, cL] = fitLS(all);
  const t = 1.96 * 0.15;
  const dist = (m, c, p) => Math.abs(m * p[0] - p[1] + c) / Math.hypot(m, 1);
  const thru = (A, B) => { const m = (B[1] - A[1]) / (B[0] - A[0]); return [m, A[1] - m * A[0]]; };
  // 正文表里的三轮
  const rounds = [[ROUT[0], RX[4]], [RX[1], ROUT[1]], [RX[2], RX[8]]].map(([A, B]) => { const [m, c] = thru(A, B); return { A, B, m, c, inl: all.filter((p) => dist(m, c, p) < t) }; });
  const inl = rounds[2].inl;
  const [mR, cR] = fitLS(inl);
  const sx = lin(0, 11, 60, 400), sy = lin(0, 10, 250, 20);
  let o = axes({ sx, sy, x0: 0, x1: 11, y0: 0, y1: 10, xt: [0, 2, 4, 6, 8, 10], yt: [0, 2, 4, 6, 8, 10] });
  // 帧：0 = 最终结果；1–3 = 三轮；4 = refit（与 0 相同）
  const NF = 5;
  const { T, kt } = timeline([3.2, 2.2, 2.2, 2.2, 2.2]);
  const model = (f) => (f === 0 || f === 4 ? { m: mR, c: cR, A: RX[2], B: RX[8], inl } : rounds[f - 1]);
  const fr = [0, 1, 2, 3, 4, 4].map(model);
  const bandOf = ({ m, c }) => { const b = t * Math.hypot(m, 1); return d(clipPoly([[0, c + b], [11, m * 11 + c + b], [11, m * 11 + c - b], [0, c - b]], 0, 11, 0, 10).map(([x, y]) => [sx(x), sy(y)])) + 'Z'; };
  const lineOf = ({ m, c }) => d(clipPoly([[0, c + 1e-6], [11, m * 11 + c + 1e-6], [11, m * 11 + c - 1e-6], [0, c - 1e-6]], 0, 11, 0, 10).filter((_, i, a) => i === 0 || i === Math.floor(a.length / 2)).map(([x, y]) => [sx(x), sy(y)]));
  o += apath(fr.map(bandOf), kt, T, 'wash', true);
  o += line(sx(0), sy(cL), sx(11), sy(mL * 11 + cL), 'ln-dash');
  o += apath(fr.map(lineOf), kt, T, 'ln', true);
  // inlier：外加一个小圈
  for (const p of all) o += `<circle cx="${f1(sx(p[0]))}" cy="${f1(sy(p[1]))}" r="6.5" class="ln">${ashow(fr.map((M) => M.inl.includes(p)), kt, T)}</circle>`;
  for (const p of RX) o += circle(sx(p[0]), sy(p[1]), 4, 'ink-f');
  for (const p of ROUT) o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink paper-f');
  for (const k of ['A', 'B']) {
    const xs = fr.map((M) => f1(sx(M[k][0]))), ys = fr.map((M) => f1(sy(M[k][1])));
    o += `<circle cx="${xs[0]}" cy="${ys[0]}" r="9" class="ink">${anim('cx', xs, kt, T, true)}${anim('cy', ys, kt, T, true)}</circle>`;
  }
  const lx = 412;
  o += line(lx, 46, lx + 26, 46, 'ln-dash') + text(lx + 32, 50, 'least squares', 'ts');
  o += text(lx + 32, 66, `y = ${mL.toFixed(3)}x + ${cL.toFixed(3)}`, 'ts');
  o += line(lx, 92, lx + 26, 92, 'ln') + text(lx + 32, 96, '这一轮的 line', 'ts');
  o += atext(lx + 32, 112, `refit：y = ${mR.toFixed(3)}x + ${cR.toFixed(3)}`, 'ts', fr.map((_, f) => f === 0 || f >= 4), kt, T);
  o += rect(lx, 130, 26, 12, 'wash') + text(lx + 32, 140, '距离 < t = 0.29', 'ts');
  o += circle(lx + 13, 166, 9, 'ink') + text(lx + 32, 170, '这一轮的 sample', 'ts');
  o += circle(lx + 13, 192, 6.5, 'ln') + text(lx + 32, 196, 'inlier', 'ts');
  o += circle(lx + 13, 218, 4.5, 'ink paper-f') + text(lx + 32, 222, 'outlier', 'ts');
  const pt = (p) => `(${p[0]}, ${p[1].toFixed(1)})`;
  const st = [`第 3 轮的 sample ${pt(RX[2])}、${pt(RX[8])} 给出 ${inl.length} 个 inlier，3 个 outlier 全在带外`,
    ...rounds.map((r, k) => `第 ${k + 1} 轮：抽到 ${pt(r.A)}、${pt(r.B)}，slope ${r.m.toFixed(2).replace('-', '−')}，${r.inl.length} 个 inlier`),
    `inlier 最多的是第 3 轮；用这 ${inl.length} 个点 refit，得到实线`];
  st.forEach((s_, f) => { o += atext(230, 284, s_, f === 0 ? 'ts' : 'tl', onlyAt(NF, f), kt, T, 'middle'); });
  return svgA(560, 294, o, '动图：10 个近似共线的点加 3 个 outlier。RANSAC 走三轮：第 1 轮抽到一个 outlier，只有 3 个 inlier；第 2 轮也抽到 outlier，2 个 inlier；第 3 轮两个正确点给出 10 个 inlier。用这 10 个点 refit 得到实线，而虚线的 least squares 被 outlier 拉偏');
}

const R6 = Ry(10), C6 = [0.5, -0.2, 0];
const t6 = mv(R6, C6).map((v) => -v);
function epipolar() {
  const X = [0.2, -0.1, 2.0];
  const ray = (Z) => [X[0] / X[2] * Z, X[1] / X[2] * Z, Z];
  const to2 = (P) => { const q = mv(R6, P).map((v, i) => v + t6[i]); return proj(q); };
  // F = K^-T [t]x R K^-1
  const Ki = [[1 / 500, 0, -320 / 500], [0, 1 / 500, -240 / 500], [0, 0, 1]];
  const F = mm(mm(T(Ki), mm(sk(t6), R6)), Ki);
  const l = mv(F, [370, 215, 1]);
  const s = 0.4, W = 640 * s, Hh = 480 * s;
  const o1 = [14, 40], o2 = [290, 40];
  const P1 = ([u, v]) => [o1[0] + s * u, o1[1] + s * v], P2 = ([u, v]) => [o2[0] + s * u, o2[1] + s * v];
  let o = rect(o1[0], o1[1], W, Hh, 'frame') + rect(o2[0], o2[1], W, Hh, 'frame');
  o += text(o1[0] + W / 2, 26, 'Image 1', 'tb', 'middle') + text(o2[0] + W / 2, 26, 'Image 2', 'tb', 'middle');
  const x1 = proj(X);
  o += circle(...P1(x1), 4.5, 'ln-f') + text(P1(x1)[0] + 8, P1(x1)[1] - 6, 'x₁ = (370, 215)', 'ts');
  const seg = clipLine(l[0], l[1], l[2], 0, 640, 0, 480);
  o += line(...P2(seg[0]), ...P2(seg[1]), 'ln');
  const labs = [[0.5, '0.5'], [1, '1'], [2, '2'], [4, '4'], [8, '8'], [1e9, '∞']];
  const offs = [[8, 16, 'start'], [-6, -8, 'end'], [6, 18, 'start'], [-6, -8, 'end'], [4, 18, 'start'], [-6, -14, 'end']];
  labs.forEach(([Z, lab], i) => {
    const q = to2(ray(Z)), p = P2(q), [dx, dy, an] = offs[i];
    o += circle(p[0], p[1], Z === 2 ? 4.5 : 3.2, Z === 2 ? 'ink-f' : 'ink paper-f');
    o += text(p[0] + dx, p[1] + dy, 'Z=' + lab, 'ts', an);
  });
  o += arrow(o2[0] + 30, o2[1] + Hh - 12, o2[0] + 6, o2[1] + Hh + 2, 'mute');
  o += text(o2[0] + 36, o2[1] + Hh + 22, '往左下延长，经过 epipole e₂ = (−2516, 1392)', 'ts');
  o += text(280, 282, 'Ray 上不同 depth 的点全落在同一条 epipolar line 上；Z = 2 是真实的点 x₂ = (332.8, 264.7)', 'ts', 'middle');
  // 下：俯视（camera 1 的 x–Z plane），横向放大 2 倍
  const tz = (Z) => 60 + 53.5 * Z, tx = (x) => 444 - 120 * x, TP = ([x, , Z]) => [tz(Z), tx(x)];
  o += text(14, 308, '俯视（横向放大 2.2 倍）：camera 2 看 ray 上的点，视线一直在变，落点沿 ℓ₂ 走', 'tb');
  const Zmax = 8.6;
  o += line(tz(0), tx(0), tz(Zmax), tx(0.1 * Zmax), 'ln') + text(tz(Zmax) - 2, tx(0.1 * Zmax) + 24, 'x₁ 的 ray', 'tl', 'end');
  for (const [Z, lab] of labs.slice(0, 5)) { const [px, py] = TP(ray(Z)); o += line(px, py - 3, px, py + 3, 'ink') + text(px, py - 7, lab, 'ts', 'middle'); }
  // 两个 camera 的 optical axis
  const ax2 = [-Math.sin(10 * Math.PI / 180), Math.cos(10 * Math.PI / 180)];
  o += arrow(tz(0), tx(0), tz(0.9), tx(0), 'mute') + arrow(tz(0), tx(0.5), tz(0.9 * ax2[1]), tx(0.5 + 0.9 * ax2[0]), 'mute');
  o += text(tz(0.95), tx(0) + 14, 'optical axis', 'ts');
  o += circle(tz(0), tx(0), 4.5, 'ink-f') + circle(tz(0), tx(0.5), 4.5, 'ink-f');
  o += text(tz(0) - 8, tx(0) + 4, 'C₁', 'tb', 'end') + text(tz(0) - 8, tx(0.5) + 4, 'C₂', 'tb', 'end');
  // 动图：第 0 帧停在 Z = 2（真实的点）；之后 Z 从 0.5 走到 8（按 log 均匀），最后跳到无穷远
  const Zs = [2, 2]; for (let k = 0; k <= 40; k++) Zs.push(0.5 * 16 ** (k / 40)); Zs.push(Infinity);
  const tt = [0, 3, 3.3]; for (let k = 1; k <= 40; k++) tt.push(3.3 + 0.1 * k); tt.push(tt[tt.length - 1] + 0.4);
  const TT = tt[tt.length - 1] + 1.6; tt.push(TT); Zs.push(Infinity);
  const kt = tt.map((v) => v / TT);
  const img2 = Zs.map((Z) => P2(to2(Z === Infinity ? ray(1e9) : ray(Z))));
  const top = Zs.map((Z) => TP(ray(Z === Infinity ? Zmax : Z)));
  // camera 2 的视线：到点为止；Z = ∞ 时与 ray 平行
  const sight = Zs.map((Z, i) => (Z === Infinity ? `M${f1(tz(0))} ${f1(tx(0.5))}L${f1(tz(4.4))} ${f1(tx(0.94))}` : `M${f1(tz(0))} ${f1(tx(0.5))}L${f1(top[i][0])} ${f1(top[i][1])}`));
  o += apath(sight, kt, TT, 'dash');
  const dot = (P, r) => `<circle cx="${f1(P[0][0])}" cy="${f1(P[0][1])}" r="${r}" class="ln-f">${anim('cx', P.map((q) => f1(q[0])), kt, TT)}${anim('cy', P.map((q) => f1(q[1])), kt, TT)}</circle>`;
  o += dot(top.map((q, i) => (Zs[i] === Infinity ? [-50, -50] : q)), 5.5) + dot(img2, 5.5);
  o += `<text x="${f1(tz(4.4) + 8)}" y="${f1(tx(0.94) + 4)}" class="tl" text-anchor="start">Z = ∞：视线与 ray 平行${ashow(Zs.map((Z) => Z === Infinity), kt, TT)}</text>`;
  return svgA(560, 456, o, '动图：Image 1 的一个 pixel 对应一条 ray。点沿这条 ray 从 Z = 0.5 m 走到无穷远，image 1 里它一直在同一个 pixel；image 2 里它的投影沿 epipolar line 从左下走到右上。下方俯视图画出两个 camera center、这条 ray 和 camera 2 的视线');
}

function depth() {
  const f = 500, b = 0.1;
  const sx = lin(0, 60, 60, 360), sy = lin(0, 6, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 60, y0: 0, y1: 6, xt: [0, 10, 20, 30, 40, 50, 60], yt: [0, 1, 2, 3, 4, 5, 6], xl: 'disparity d（pixel）', yl: 'Z（m）' });
  o += path(curve((dd) => (f * b) / dd, 8.4, 60, sx, sy), 'ln');
  const mark = (d0, lab, ly) => {
    const z0 = (f * b) / d0, z1 = (f * b) / (d0 - 1);
    o += rect(sx(d0 - 1), sy(z1), sx(d0) - sx(d0 - 1), sy(z0) - sy(z1), 'wash-strong');
    o += line(sx(d0 - 1), sy(z1), 360, sy(z1), 'dash') + line(sx(d0), sy(z0), 360, sy(z0), 'dash');
    o += circle(sx(d0), sy(z0), 3.5, 'ink-f') + circle(sx(d0 - 1), sy(z1), 3.5, 'ink paper-f');
    o += text(372, ly, lab, 'ts');
  };
  mark(25, 'd = 25 → 24：Z 从 2.000 到 2.083 m', sy(2.04) + 4);
  mark(10, 'd = 10 → 9：Z 从 5.000 到 5.556 m', sy(5.28) + 4);
  o += text(372, sy(5.28) + 22, '同样差 1 pixel', 'ts') + text(372, sy(5.28) + 38, 'error 大 6.7 倍', 'ts');
  o += text(372, sy(0.9), 'Z = fb / d', 'ts') + text(372, sy(0.9) + 16, 'f = 500 pixel，b = 0.1 m', 'ts');
  return svg(560, 300, o, 'Depth 与 disparity 成反比；disparity 小时，同样 1 pixel 的 error 对应大得多的 depth error');
}

// ---------- 第 7 站 ----------
function flowlines() {
  const blob = (x, y) => 100 * Math.exp(-(x * x + y * y) / 18);
  const ed = (x) => 50 + 40 * Math.tanh(x / 2);
  const u = 0.4, v = -0.3;
  const eqs = (I1, I2, ox, oy) => {
    const r = [];
    for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) {
      const x = i + ox, y = j + oy;
      r.push([(I1(x + 1, y) - I1(x - 1, y)) / 2, (I1(x, y + 1) - I1(x, y - 1)) / 2, I2(x, y) - I1(x, y)]);
    }
    return r;
  };
  const lk = (E) => {
    let a = 0, b = 0, c = 0, p = 0, q = 0;
    for (const [ix, iy, itt] of E) { a += ix * ix; b += ix * iy; c += iy * iy; p -= ix * itt; q -= iy * itt; }
    return [a, b, c, p, q];
  };
  let o = '';
  const U0 = -0.4, U1 = 1.2, V0 = -1.1, V1 = 0.5;
  const panel = (x0, E, title, sub, sol) => {
    const sx = lin(U0, U1, x0, x0 + 230), sy = lin(V0, V1, 220, 40);
    o += rect(x0, 40, 230, 180, 'frame');
    o += line(sx(U0), sy(0), sx(U1), sy(0), 'axis') + line(sx(0), sy(V0), sx(0), sy(V1), 'axis');
    o += text(sx(U1) - 4, sy(0) - 5, it('u'), 't', 'end') + text(sx(0) + 5, sy(V1) + 14, it('v'), 't');
    for (const [ix, iy, itt] of E) {
      if (Math.hypot(ix, iy) < 1e-9) continue;
      const sgm = clipLine(ix, iy, itt, U0, U1, V0, V1);
      if (sgm) o += line(sx(sgm[0][0]), sy(sgm[0][1]), sx(sgm[1][0]), sy(sgm[1][1]), 'mute');
    }
    o += circle(sx(u), sy(v), 5, 'ink paper-f');
    if (sol) o += circle(sx(sol[0]), sy(sol[1]), 3.5, 'ln-f');
    o += text(x0 + 115, 26, title, 'tb', 'middle') + text(x0 + 115, 240, sub, 'ts', 'middle');
  };
  const Eb = eqs(blob, (x, y) => blob(x - u, y - v), 2, 1);
  const [a, b, c, p, q] = lk(Eb), det = a * c - b * b;
  const sol = [(c * p - b * q) / det, (a * q - b * p) / det];
  panel(30, Eb, 'Blob 的 flank：25 条 line 方向各异', `LK 的解：(${sol[0].toFixed(3)}, ${sol[1].toFixed(3).replace('-', '−')})`, sol);
  const Ee = eqs((x) => ed(x), (x) => ed(x - u), 1, 0);
  panel(300, Ee, 'Vertical edge：25 条 line 全部竖直', 'v 取什么都满足，只能定出 u', null);
  o += text(280, 264, '每条灰线是一个 pixel 的 Iₓu + Iᵧv + Iₜ = 0；空心圆是真实 motion (0.4, −0.3)', 'ts', 'middle');
  return svg(560, 276, o, '在 u v plane 里画出一个 5 乘 5 window 的 25 个 constraint：blob 上方向各异，交在真实 motion 附近；edge 上全部 parallel，只能确定 u');
}

// ---------- 第 8 站 ----------
function pcalda() {
  const L = [-30, -18, -6, 6, 18, 30];
  const A = L.map((l) => [60 + l, 45 + l]), B = L.map((l) => [45 + l, 60 + l]);
  const all = [...A, ...B];
  const mu = [0, 1].map((k) => all.reduce((s, p) => s + p[k], 0) / all.length);
  let cxx = 0, cxy = 0, cyy = 0;
  for (const [x, y] of all) { cxx += (x - mu[0]) ** 2; cxy += (x - mu[0]) * (y - mu[1]); cyy += (y - mu[1]) ** 2; }
  [cxx, cxy, cyy] = [cxx, cxy, cyy].map((v) => v / all.length);
  const lam = (cxx + cyy) / 2 + Math.sqrt(((cxx - cyy) / 2) ** 2 + cxy * cxy);
  let e = [cxy, lam - cxx]; const ne = Math.hypot(...e); e = e.map((v) => v / ne);
  const g = [e[1], -e[0]];
  const sx = lin(0, 100, 50, 270), sy = lin(0, 100, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 100, y0: 0, y1: 100, xt: [0, 50, 100], yt: [0, 50, 100], xl: 'pixel 1', yl: 'pixel 2' });
  o += arrow(sx(mu[0]), sy(mu[1]), sx(mu[0] + 45 * e[0]), sy(mu[1] + 45 * e[1]), 'ln');
  o += arrow(sx(mu[0]), sy(mu[1]), sx(mu[0] + 30 * g[0]), sy(mu[1] + 30 * g[1]), 'ink');
  for (const p of A) o += circle(sx(p[0]), sy(p[1]), 4, 'ink-f');
  for (const p of B) o += circle(sx(p[0]), sy(p[1]), 4, 'ink paper-f');
  o += text(sx(mu[0] + 45 * e[0]) + 6, sy(mu[1] + 45 * e[1]) + 4, 'PC1', 'tl');
  o += text(sx(mu[0] + 30 * g[0]) + 6, sy(mu[1] + 30 * g[1]) + 12, 'Fisher', 'tb');
  // 右侧：两条 1D projection
  const nx = lin(-50, 50, 320, 540);
  const row = (y, dir, title) => {
    o += line(320, y, 540, y, 'axis') + text(320, y - 30, title, 'tb');
    for (const t of [-40, 0, 40]) o += line(nx(t), y, nx(t), y + 4, 'axis') + text(nx(t), y + 17, String(t).replace('-', '−'), 'ts', 'middle');
    const pr = (p) => (p[0] - mu[0]) * dir[0] + (p[1] - mu[1]) * dir[1];
    for (const p of A) o += circle(nx(pr(p)), y - 9, 4, 'ink-f');
    for (const p of B) o += circle(nx(pr(p)), y - 18, 4, 'ink paper-f');
  };
  row(110, e, '投到 PC1：A、B 完全重合');
  row(210, g, '投到 Fisher 方向：分成两堆');
  o += text(320, 250, '每个人的 6 个点叠在同一处', 'ts');
  o += text(280, 306, '实心：person A；空心：person B；同一个人的 6 张 image 只差 lighting', 'ts', 'middle');
  return svg(560, 316, o, '两个人各 6 张只有 2 个 pixel 的 image：variance 最大的方向是 lighting，投上去两人重合；Fisher 方向把两人分开');
}

export default {
  'cs4243-intro': intro,
  'cs4243-conv': conv,
  'cs4243-edge1d': edge1d,
  'cs4243-harris': harris,
  'cs4243-pinhole': pinhole,
  'cs4243-weakpersp': weakpersp,
  'cs4243-distort': distort,
  'cs4243-blend': blend,
  'cs4243-transforms': transforms,
  'cs4243-rectify': rectify,
  'cs4243-ransac': ransacline,
  'cs4243-epipolar': epipolar,
  'cs4243-depth': depth,
  'cs4243-flow': flowlines,
  'cs4243-pca': pcalda,
};
