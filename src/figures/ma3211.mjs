import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1, sub } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const PI = Math.PI;
const C = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  div: (a, b) => { const q = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / q, (a[1] * b[0] - a[0] * b[1]) / q]; },
  exp: (a) => [Math.exp(a[0]) * Math.cos(a[1]), Math.exp(a[0]) * Math.sin(a[1])],
  abs: (a) => Math.hypot(a[0], a[1]),
  cos: (a) => [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])],
  sin: (a) => [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])],
  pol: (r, t) => [r * Math.cos(t), r * Math.sin(t)],
  conj: (a) => [a[0], -a[1]],
  sc: (k, a) => [k * a[0], k * a[1]],
};
const sup = (t) => `<tspan class="sup" dy="-6">${t}</tspan><tspan dy="6">​</tspan>`;
const zb = '<tspan text-decoration="overline">z</tspan>';
const plane = (cx, cy, s) => ([x, y]) => [cx + s * x, cy - s * y];
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const num = (v, k = 3) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// circle 或 arc 的点列（plane 坐标）
const arcPts = (c, r, t0, t1, n = 120) => { const p = []; for (let k = 0; k <= n; k++) { const t = t0 + (t1 - t0) * k / n; p.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); } return p; };
// 在点列第 i 处画一个指示方向的箭头
const headAt = (P, pts, i, cls = 'ink', size = 7) => { const a = P(pts[i - 1]), b = P(pts[i]); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); return arrow(b[0] - 10 * Math.cos(ang), b[1] - 10 * Math.sin(ang), b[0], b[1], cls, size); };
// 只画 y 落在 [lo, hi] 里的部分，越界处断开
function clipCurve(fn, x0, x1, sx, sy, lo, hi, n = 400) {
  let o = '', pen = false;
  for (let k = 0; k <= n; k++) {
    const x = x0 + (x1 - x0) * k / n, y = fn(x);
    if (Number.isFinite(y) && y >= lo && y <= hi) { o += (pen ? 'L' : 'M') + f1(sx(x)) + ' ' + f1(sy(y)); pen = true; } else pen = false;
  }
  return o;
}
// complex contour integral（Simpson）：f 作用在 [x,y] 上，z(t)、dz(t) 同样
function cint(f, z, dz, a, b, n = 2000) {
  const h = (b - a) / n; let s = [0, 0];
  for (let k = 0; k <= n; k++) {
    const t = a + k * h, w = k === 0 || k === n ? 1 : k % 2 ? 4 : 2;
    s = C.add(s, C.sc(w, C.mul(f(z(t)), dz(t))));
  }
  return C.sc(h / 3, s);
}

// ---------- 开头 ----------
function cubic() {
  const g = (x) => x ** 3 - 15 * x - 4;
  const sx = lin(-4.7, 4.7, 40, 520), sy = lin(-40, 32, 196, 16);
  let o = axes({ sx, sy, x0: -4.7, x1: 4.7, y0: -40, y1: 32, xt: [-3, -2, -1, 1, 2, 3], yt: [], xAt: 0, yAt: 0 });
  o += path(clipCurve(g, -4.7, 4.7, sx, sy, -40, 32), 'ln');
  const roots = [[4, '4', 10], [-2 - Math.sqrt(3), '−2 − √3', 10], [-2 + Math.sqrt(3), '−2 + √3', 10]];
  for (const [r, s] of roots) o += circle(sx(r), sy(0), 4.5, 'ink-f');
  o += text(sx(4) + 8, sy(0) - 8, '4', 'tb', 'start');
  o += text(sx(-2 - Math.sqrt(3)) - 8, sy(0) - 8, '−2 − √3', 'tb', 'end');
  o += text(sx(-2 + Math.sqrt(3)) - 8, sy(0) - 8, '−2 + √3', 'tb', 'end');
  o += text(sx(2.2), sy(-30), 'y = x³ − 15x − 4', 't', 'start');
  o += text(280, 226, 'Cubic formula 给出的却是 x = ∛(2 + √−121) + ∛(2 − √−121)', 'ts', 'middle');
  return svg(560, 232, o, 'y 等于 x 的三次方减 15x 减 4 的图像与 x 轴交于 4、负 2 减根号 3、负 2 加根号 3 三点');
}

function taylor1d() {
  const f = (x) => 1 / (1 + x * x);
  const S = (m) => (x) => { let s = 0; for (let k = 0; k <= m; k++) s += (-x * x) ** k; return s; };
  const sx = lin(-1.7, 1.7, 50, 510), sy = lin(-0.8, 1.8, 196, 16);
  let o = axes({ sx, sy, x0: -1.7, x1: 1.7, y0: -0.8, y1: 1.8, xt: [-1.5, -0.5, 0.5, 1.5].map((v) => [v, v < 0 ? '−' + Math.abs(v) : String(v)]), yt: [], xAt: 0, yAt: 0 });
  o += text(sx(-1) + 5, sy(0) + 17, '−1', 'ts', 'start') + text(sx(1) - 5, sy(0) + 17, '1', 'ts', 'end');
  for (const v of [-1, 1]) o += line(sx(v), sy(1.8), sx(v), sy(-0.8), 'dash');
  o += path(clipCurve(S(8), -1.7, 1.7, sx, sy, -0.8, 1.8), 'mute');
  o += path(clipCurve(S(9), -1.7, 1.7, sx, sy, -0.8, 1.8), 'ink');
  o += path(curve(f, -1.7, 1.7, sx, sy), 'ln');
  o += text(sx(-1.45), sy(f(-1.45)) - 10, '1 / (1 + x²)', 'tl', 'middle');
  o += text(sx(1.06) + 6, sy(1.62), '加到 x¹⁶', 'ts', 'start');
  o += text(sx(1.06) + 6, sy(-0.62), '加到 x¹⁸', 'ts', 'start');
  o += text(sx(0), 226, '|x| < 1 里 partial sum 贴着 f；一过 ±1（虚线）就飞出去，而 f 在 ±1 处毫无异常', 'ts', 'middle');
  return svg(560, 232, o, '1 除以 1 加 x 平方的图像，以及它的 Taylor series 的两个 partial sum：在负 1 到 1 之间贴合，之外发散');
}

// ---------- 第 1 站 ----------
function multA() {
  const th = Math.atan(0.5), N = 48, hold = 1.6, mv = 3.2, T = 0.8 + mv + hold;
  const kt = [0], ts = [0];
  for (let k = 0; k <= N; k++) { kt.push((0.8 + mv * k / N) / T); ts.push(k / N); }
  kt.push(1); ts.push(1);
  const s = 36, O = [50, 238], P = plane(O[0], O[1], s);
  const shape = [[1.2, 0.3], [1.5, 0.3], [1.5, 0.9], [1.9, 0.9], [1.9, 1.15], [1.5, 1.15], [1.5, 1.45], [2.0, 1.45], [2.0, 1.7], [1.2, 1.7]];
  const tf = (t) => (z) => C.mul(C.pol(5 ** (t / 2), th * t), z);
  let o = line(O[0] - 10, O[1], 330, O[1], 'axis') + line(O[0], O[1] + 10, O[0], 20, 'axis');
  o += path(d(shape.map(P)) + 'Z', 'wash2 ink-s');
  o += path(d(shape.map(tf(1)).map(P)) + 'Z', 'dash');
  o += apath(ts.map((t) => d(shape.map(tf(t)).map(P)) + 'Z'), kt, T, 'wash ink-s');
  // 跟踪一个顶点：从 origin 出发的线
  const v = shape[8];
  o += apath(ts.map((t) => d([O, P(tf(t)(v))])), kt, T, 'ln');
  const tips = ts.map((t) => P(tf(t)(v)));
  o += acircle(tips.map((p) => p[0]), tips.map((p) => p[1]), kt, T, 4, 'ln-f');
  // 角度弧
  const a0 = Math.atan2(v[1], v[0]);
  const ar = arcPts([0, 0], 3.1, a0, a0 + th, 30);
  o += path(d(ar.map(P)), 'ink') + text(P(ar[15])[0] + 8, P(ar[15])[1] + 2, '26.57°', 'ts', 'start');
  o += text(P(v)[0] + 8, P(v)[1] + 4, 'z', 'tb', 'start');
  const vf = P(tf(1)(v));
  o += text(vf[0] + 8, vf[1] + 2, '(2 + i) z', 'tb', 'start');
  const X = 350;
  o += text(X, 44, '乘 2 + i', 'tb', 'start');
  o += text(X, 72, '到 origin 的距离 × √5 ≈ 2.236', 't', 'start');
  o += text(X, 94, '每个点的 argument + 26.57°', 't', 'start');
  o += text(X, 128, '灰色：原来的 shape', 'ts', 'start') + text(X, 148, '虚线：乘完之后的位置', 'ts', 'start');
  o += text(X, 182, 'Matrix 是', 'ts', 'start') + text(X + 20, 206, '2', 't', 'middle') + text(X + 50, 206, '−1', 't', 'middle') + text(X + 20, 226, '1', 't', 'middle') + text(X + 50, 226, '2', 't', 'middle') + path(`M${X + 8} 192 L${X + 4} 192 L${X + 4} 232 L${X + 8} 232`, 'ink') + path(`M${X + 62} 192 L${X + 66} 192 L${X + 66} 232 L${X + 62} 232`, 'ink');
  return svgA(560, 246, o, '动图：一个小 shape 乘上 2 加 i，绕 origin 转 26.57 度并放大根号 5 倍，形状不变');
}

function cuberoots() {
  const s = 40, O = [270, 132], P = plane(O[0], O[1], s);
  const r = Math.sqrt(5);
  let o = line(P([-4.6, 0])[0], O[1], P([5, 0])[0], O[1], 'axis') + line(O[0], P([0, 2.9])[1], O[0], P([0, -2.9])[1], 'axis');
  o += path(d(arcPts([0, 0], r, 0, 2 * PI).map(P)), 'grid');
  const w = [2, 1], om = C.pol(1, 2 * PI / 3);
  const roots = [w, C.mul(w, om), C.mul(w, C.mul(om, om))];
  const lab = ['2 + i', '(2 + i)ω', '(2 + i)ω²'];
  const lpos = [[10, -6, 'start'], [-10, -8, 'end'], [-10, 16, 'end']];
  roots.forEach((a, k) => {
    const p = P(a), q = P(C.conj(a));
    o += line(p[0], p[1], q[0], q[1], 'dash');
    o += circle(p[0], p[1], 4.5, 'ink-f') + circle(q[0], q[1], 4.5, 'paper');
    o += text(p[0] + lpos[k][0], p[1] + lpos[k][1], lab[k], 'tb', lpos[k][2]);
    const R2 = P([2 * a[0], 0]);
    o += circle(R2[0], R2[1], 5, 'ln-f');
  });
  o += text(P([4, 0])[0] + 2, O[1] + 20, '4', 'tl', 'middle');
  o += text(P([-2 - Math.sqrt(3), 0])[0], O[1] + 20, '−2 − √3', 'tl', 'middle');
  o += text(P([-2 + Math.sqrt(3), 0])[0] - 4, O[1] + 20, '−2 + √3', 'tl', 'end');
  o += text(P([0, -r])[0] + 6, P([0, -r])[1] + 20, 'radius √5', 'ts', 'start');
  o += text(20, 262, '实心点：2 + 11i 的 cube root；空心点：它们的 conjugate；彩色点：每一对的和 2 Re a', 'ts', 'start');
  return svg(560, 268, o, '2 加 11i 的三个 cube root 在 radius 根号 5 的 circle 上相隔 120 度，各自与 conjugate 相加得到 real axis 上的 4、负 2 减根号 3、负 2 加根号 3');
}

// ---------- 第 2 站 ----------
function expmap() {
  let o = '';
  // 左：z-plane strip
  const s1 = 32, P1 = plane(110, 136, s1);
  o += line(P1([-2, 0])[0], 136, P1([1.6, 0])[0], 136, 'axis') + line(110, P1([0, 3.6])[1], 110, P1([0, -3.6])[1], 'axis');
  o += rect(P1([-1.7, PI])[0], P1([-1.7, PI])[1], 3.2 * s1, 2 * PI * s1, 'wash');
  o += line(P1([-1.7, PI])[0], P1([0, PI])[1], P1([1.5, PI])[0], P1([0, PI])[1], 'dash') + line(P1([-1.7, -PI])[0], P1([0, -PI])[1], P1([1.5, -PI])[0], P1([0, -PI])[1], 'dash');
  o += text(P1([1.5, PI])[0] + 4, P1([0, PI])[1] + 4, 'y = π', 'ts', 'start') + text(P1([1.5, -PI])[0] + 4, P1([0, -PI])[1] + 4, 'y = −π', 'ts', 'start');
  for (const c of [-1, 0.7]) o += line(P1([c, -PI])[0], P1([c, -PI])[1], P1([c, PI])[0], P1([c, PI])[1], 'ln');
  o += line(P1([-1.7, PI / 4])[0], P1([0, PI / 4])[1], P1([1.5, PI / 4])[0], P1([0, PI / 4])[1], 'ink-b');
  o += text(P1([-1, 0])[0] - 4, P1([0, -PI])[1] + 18, 'x = −1', 'ts', 'middle') + text(P1([0.7, 0])[0] + 4, P1([0, -PI])[1] + 18, 'x = 0.7', 'ts', 'middle');
  o += text(P1([-1.7, 0])[0] - 4, P1([0, PI / 4])[1] + 4, 'y = π/4', 'ts', 'end');
  o += text(110, 20, 'z-plane', 'tb', 'middle');
  o += arrow(205, 136, 255, 136, 'ink') + text(230, 126, 'e' + sup('z'), 't', 'middle');
  // 右：w-plane
  const s2 = 52, O2 = [390, 136], P2 = plane(O2[0], O2[1], s2);
  o += line(O2[0] - 130, O2[1], O2[0] + 140, O2[1], 'axis') + line(O2[0], O2[1] - 125, O2[0], O2[1] + 125, 'axis');
  for (const c of [-1, 0.7]) o += path(d(arcPts([0, 0], Math.exp(c), 0, 2 * PI).map(P2)), 'ln');
  const ray = P2(C.pol(2.4, PI / 4));
  o += line(O2[0], O2[1], ray[0], ray[1], 'ink-b');
  o += text(ray[0] + 4, ray[1] - 2, 'angle π/4', 'ts', 'start');
  o += text(O2[0] + 40, 258, 'radius e' + sup('0.7') + ' ≈ 2.01', 'ts', 'start');
  const q = P2(C.pol(Math.exp(-1), -PI / 2));
  o += text(q[0] + 6, q[1] + 16, 'radius e' + sup('−1') + ' ≈ 0.37', 'ts', 'start');
  o += circle(O2[0], O2[1], 3, 'paper');
  o += text(O2[0] - 22, O2[1] + 40, '0 不在 image 里', 'ts', 'end');
  o += text(390, 20, 'w-plane', 'tb', 'middle');
  o += text(280, 284, '浅色 strip −π < y ≤ π 恰好铺满 w-plane 去掉 0；vertical line 变 circle，horizontal line 变 ray', 'ts', 'middle');
  return svg(560, 290, o, 'e 的 z 次方把 z-plane 上的 vertical line 映成 circle，horizontal line 映成从 origin 出发的 ray，高 2π 的 strip 铺满去掉 0 的 plane');
}

function argA() {
  const N = 96, T = 7;
  const kt = [], ts = [];
  for (let k = 0; k <= N; k++) { kt.push(k / N); ts.push(2 * PI * k / N); }
  const s = 80, O = [120, 132], P = plane(O[0], O[1], s);
  let o = line(O[0] - 105, O[1], O[0] + 105, O[1], 'axis') + line(O[0], O[1] - 105, O[0], O[1] + 105, 'axis');
  o += line(O[0] - 105, O[1], O[0], O[1], 'ln-dash') + text(O[0] - 104, O[1] - 8, 'branch cut', 'ts', 'start');
  o += path(d(arcPts([0, 0], 1, 0, 2 * PI).map(P)), 'grid');
  const pts = ts.map((t) => P(C.pol(1, t)));
  o += apath(pts.map((p) => d([O, p])), kt, T, 'ink');
  o += acircle(pts.map((p) => p[0]), pts.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += text(P([1, 0])[0] + 6, O[1] + 16, '1', 'ts', 'start') + text(P([-1, 0])[0] - 6, O[1] + 16, '−1', 'ts', 'end');
  o += text(O[0], 22, 'z = e' + sup('it') + '，t 从 0 到 2π', 'tb', 'middle');
  // 右：angle 随 t
  const sx = lin(0, 2 * PI, 300, 540), sy = lin(-PI, 2 * PI, 236, 30);
  o += axes({ sx, sy, x0: 0, x1: 2 * PI, y0: -PI, y1: 2 * PI, xt: [[PI, 'π'], [2 * PI, '2π']], yt: [[-PI, '−π'], [PI, 'π'], [2 * PI, '2π']], xAt: 0, grid: true });
  o += text(sx(0) - 7, sy(0) + 4, '0', 'ts', 'end');
  o += text(540, sy(0) + 32, 't', 'ts', 'end');
  o += line(sx(0), sy(0), sx(2 * PI), sy(2 * PI), 'dash');
  o += line(sx(0), sy(0), sx(PI), sy(PI), 'ln') + line(sx(PI), sy(-PI), sx(2 * PI), sy(0), 'ln');
  o += circle(sx(PI), sy(PI), 3.5, 'ln-f') + circle(sx(PI), sy(-PI), 3.5, 'paper');
  o += text(sx(1.5 * PI) - 30, sy(1.5 * PI) - 12, '连续的 angle', 't', 'end');
  o += text(sx(1.5 * PI) + 6, sy(-PI / 2) + 18, 'Arg z', 'tl', 'start');
  o += text(sx(PI) + 6, sy(0) - 2, '跳 2π', 'ts', 'start');
  const ca = ts.map((t) => [sx(t), sy(t)]), cb = ts.map((t) => [sx(t), sy(t <= PI + 1e-9 ? t : t - 2 * PI)]);
  o += acircle(ca.map((p) => p[0]), ca.map((p) => p[1]), kt, T, 4.5, 'ink-f');
  o += acircle(cb.map((p) => p[0]), cb.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += text(420, 22, 'angle 随 t 的变化', 'tb', 'middle');
  return svgA(560, 252, o, '动图：点沿 unit circle 逆时针走一圈，连续的 angle 从 0 涨到 2π，Arg 在穿过 negative real axis 时从 π 跳到负 π');
}

// ---------- 第 3 站 ----------
function dirA() {
  const N = 72, T = 6, z0 = [1, 1], hr = 0.32;
  const kt = [], th = [];
  for (let k = 0; k <= N; k++) { kt.push(k / N); th.push(2 * PI * k / N); }
  // 左：h 绕 z0
  const s1 = 120, P1 = plane(40, 230, s1);
  let o = line(40 - 10, 230, 40 + 1.7 * s1, 230, 'axis') + line(40, 240, 40, 230 - 1.7 * s1, 'axis');
  const Z0 = P1(z0);
  o += path(d(arcPts(z0, hr, 0, 2 * PI).map(P1)), 'grid');
  const hp = th.map((t) => P1(C.add(z0, C.pol(hr, t))));
  o += apath(hp.map((p) => d([Z0, p])), kt, T, 'ink-b');
  o += acircle(hp.map((p) => p[0]), hp.map((p) => p[1]), kt, T, 4, 'ink-f');
  o += circle(Z0[0], Z0[1], 3.5, 'ln-f') + text(Z0[0] - 8, Z0[1] + 18, 'z₀ = 1 + i', 't', 'end');
  o += text(Z0[0] + hr * s1 + 6, Z0[1] - 6, 'z₀ + h', 'ts', 'start');
  o += text(130, 22, 'h = 0.32 e' + sup('iθ') + ' 转一圈', 'tb', 'middle');
  // 右：quotient 的值
  const s2 = 50, O2 = [350, 160], P2 = plane(O2[0], O2[1], s2);
  o += line(O2[0] - 75, O2[1], O2[0] + 150, O2[1], 'axis') + line(O2[0], O2[1] + 75, O2[0], O2[1] - 140, 'axis');
  o += path(d(arcPts([0, 0], 1, 0, 2 * PI).map(P2)), 'grid');
  const c2 = P2([2, 2]);
  o += path(d(arcPts([2, 2], hr, 0, 2 * PI).map(P2)), 'grid') + circle(c2[0], c2[1], 3, 'ink-f');
  const qa = th.map((t) => P2(C.add([2, 2], C.pol(hr, t))));
  const qb = th.map((t) => P2(C.pol(1, -2 * t)));
  o += acircle(qa.map((p) => p[0]), qa.map((p) => p[1]), kt, T, 5, 'ink-f');
  o += acircle(qb.map((p) => p[0]), qb.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += text(c2[0] - 70, c2[1] + 38, 'z² 的 quotient 2z₀ + h', 't', 'start');
  o += text(c2[0] - 70, c2[1] + 56, 'h → 0 时收进 2z₀', 'ts', 'start');
  o += text(O2[0] + 56, O2[1] + 40, zb + ' 的 quotient e' + sup('−2iθ'), 'tl', 'start');
  o += text(O2[0] + 56, O2[1] + 58, '和 h 的大小无关', 'ts', 'start');
  o += text(O2[0] + 4, O2[1] + 16, '0', 'ts', 'start');
  o += text(420, 22, 'difference quotient 的值', 'tb', 'middle');
  return svgA(560, 250, o, '动图：h 绕 z0 转一圈时，z 平方的 difference quotient 只在 2z0 附近小幅晃动，z bar 的 difference quotient 沿 unit circle 反向转两圈');
}

function jacobian() {
  const z0 = [1, 0.5], sd = 0.3;
  const sq = [z0, C.add(z0, [sd, 0]), C.add(z0, [sd, sd]), C.add(z0, [0, sd])];
  const edge = (f) => { const pts = []; for (let k = 0; k < 4; k++) for (let j = 0; j < 20; j++) { const a = sq[k], b = sq[(k + 1) % 4]; pts.push(f(C.add(a, C.sc(j / 20, C.sub(b, a))))); } pts.push(f(sq[0])); return pts; };
  const maps = [
    ['原来的小 square', (z) => z, ''],
    ['z²', (z) => C.mul(z, z), '转 26.57°，放大 √5'],
    [zb, (z) => C.conj(z), '翻了过来'],
    ['x + 2iy', (z) => [z[0], 2 * z[1]], '拉成 rectangle'],
  ];
  let o = '';
  const k = 105;
  maps.forEach(([name, f, note], i) => {
    const cx = 70 + i * 140, cy = 140;
    const ctr = f(C.add(z0, [sd / 2, sd / 2]));
    const P = ([x, y]) => [cx + k * (x - ctr[0]), cy - k * (y - ctr[1])];
    const pts = edge(f).map(P);
    o += path(d(pts) + 'Z', i === 0 ? 'wash2 ink-s' : 'wash ink-s');
    const lab = ['A', 'B', 'C'];
    for (let j = 0; j < 3; j++) {
      const p = P(f(sq[j])), c = [cx, cy];
      const dx = p[0] - c[0], dy = p[1] - c[1], L = Math.hypot(dx, dy);
      o += circle(p[0], p[1], 3, 'ink-f') + text(p[0] + dx / L * 12, p[1] + dy / L * 12 + 4, lab[j], 'tb', 'middle');
    }
    o += text(cx, 34, name, 'tb', 'middle');
    if (note) o += text(cx, 252, note, 'ts', 'middle');
    o += text(cx, 270, ['', 'A→B→C 逆时针', 'A→B→C 顺时针', 'A→B→C 逆时针'][i], 'ts', 'middle');
  });
  o += text(70, 252, 'z₀ = 1 + 0.5i，边长 0.3', 'ts', 'middle');
  return svg(560, 278, o, '同一个小正方形在 z 平方、z bar、x 加 2iy 三个 map 下的 image：第一个只转动并放大，第二个被翻转，第三个被拉成长方形');
}

// ---------- 第 4 站 ----------
function level() {
  const B = 2.2, s = 58, O = [150, 148], P = plane(O[0], O[1], s);
  const inBox = ([x, y]) => Math.abs(x) <= B && Math.abs(y) <= B;
  const seg = (gen, cls) => { let o = '', cur = []; for (const p of gen) { if (inBox(p)) cur.push(P(p)); else { if (cur.length > 1) o += path(d(cur), cls); cur = []; } } if (cur.length > 1) o += path(d(cur), cls); return o; };
  const ss = []; for (let k = -200; k <= 200; k++) ss.push(k / 60);
  let o = rect(O[0] - B * s, O[1] - B * s, 2 * B * s, 2 * B * s, 'frame');
  for (const c of [0.6, 1.6, 3]) {
    const r = Math.sqrt(c);
    for (const sg of [1, -1]) {
      o += seg(ss.map((t) => [sg * r * Math.cosh(t), r * Math.sinh(t)]), 'ln'); // u = c
      o += seg(ss.map((t) => [r * Math.sinh(t), sg * r * Math.cosh(t)]), 'ln'); // u = −c
    }
    for (const sg of [1, -1]) {
      const xs = []; for (let k = 1; k <= 300; k++) xs.push(k / 300 * B);
      o += seg(xs.map((x) => [sg * x, c / (2 * x)]), 'mute'); // v = c
      o += seg(xs.map((x) => [sg * x, -c / (2 * x)]), 'mute'); // v = −c
    }
  }
  o += line(...P([-B, -B]), ...P([B, B]), 'ln') + line(...P([-B, B]), ...P([B, -B]), 'ln');
  o += line(...P([-B, 0]), ...P([B, 0]), 'mute') + line(...P([0, -B]), ...P([0, B]), 'mute');
  const X = 310;
  o += line(X, 60, X + 30, 60, 'ln') + text(X + 38, 64, 'u = x² − y² = c', 't', 'start');
  o += line(X, 86, X + 30, 86, 'mute') + text(X + 38, 90, 'v = 2xy = c', 't', 'start');
  o += text(X, 130, '在 origin 以外处处直角相交：', 'ts', 'start') + text(X, 148, '∇u · ∇v = u' + sub('x') + 'v' + sub('x') + ' + u' + sub('y') + 'v' + sub('y') + ' = 0', 'ts', 'start');
  o += text(X, 182, '在 origin：f′(0) = 0，', 'ts', 'start') + text(X, 200, 'u = 0 是 y = ±x，v = 0 是两条 axis，', 'ts', 'start') + text(X, 218, '交成 45°', 'ts', 'start');
  return svg(560, 284, o, 'z 平方的 real part 和 imaginary part 的 level curve 是两族 hyperbola，处处直角相交，只在 origin 例外');
}

// ---------- 第 5 站 ----------
function paths() {
  const s = 150, P = plane(70, 210, s);
  let o = line(50, 210, 270, 210, 'axis') + line(70, 225, 70, 30, 'axis');
  const A = P([0, 0]), B = P([1, 0]), Cc = P([1, 1]);
  o += line(A[0], A[1], Cc[0], Cc[1], 'ln') + line(A[0], A[1] - 1, B[0], B[1] - 1, 'ink-b') + line(B[0], B[1], Cc[0], Cc[1], 'ink-b');
  o += arrow(...P([0.45, 0.45]), ...P([0.55, 0.55]), 'ln') + arrow(...P([0.45, 0]), ...P([0.55, 0]), 'ink') + arrow(...P([1, 0.45]), ...P([1, 0.55]), 'ink');
  o += circle(A[0], A[1], 4, 'ink-f') + circle(Cc[0], Cc[1], 4, 'ink-f');
  o += text(A[0] - 6, A[1] + 18, '0', 't', 'end') + text(B[0], B[1] + 18, '1', 't', 'middle') + text(Cc[0] + 8, Cc[1] - 6, '1 + i', 't', 'start');
  o += text(P([0.42, 0.6])[0], P([0.42, 0.6])[1], 'γ₁', 'tl', 'end') + text(P([1.06, 0.3])[0], P([1, 0.3])[1], 'γ₂', 'tb', 'start');
  const X = 300;
  o += text(X + 125, 56, 'γ₁（diagonal）', 'tl', 'middle') + text(X + 215, 56, 'γ₂（折线）', 'tb', 'middle');
  o += line(X, 66, 552, 66, 'axis');
  o += text(X, 96, '∫ z² dz', 't', 'start') + text(X + 125, 96, '(−2 + 2i)/3', 't', 'middle') + text(X + 215, 96, '(−2 + 2i)/3', 't', 'middle');
  o += text(X, 128, '∫ ' + zb + ' dz', 't', 'start') + text(X + 125, 128, '1', 't', 'middle') + text(X + 215, 128, '1 + i', 'tl', 'middle');
  o += text(X, 176, '同样的起点和终点：z² 的 integral 一样，', 'ts', 'start') + text(X, 194, zb + ' 的差了 i。', 'ts', 'start');
  return svg(560, 236, o, '从 0 到 1 加 i 的两条 path：diagonal 和先横后竖的折线；z 平方沿两条的 integral 相同，z bar 的不同');
}

function ml() {
  const s = 38, O = [150, 200], P = plane(O[0], O[1], s);
  let o = line(P([-3.8, 0])[0], O[1], P([7, 0])[0], O[1], 'axis') + line(O[0], O[1] + 10, O[0], P([0, 3.8])[1], 'axis');
  const arc = arcPts([0, 0], 3, 0, PI, 100);
  o += path(d(arc.map(P)), 'ln') + headAt(P, arc, 50, 'ln');
  for (const v of [5, 6]) o += circle(...P([v, 0]), 4.5, 'ink-f') + text(P([v, 0])[0], O[1] + 18, String(v), 't', 'middle');
  o += text(P([3, 0])[0], O[1] + 18, '3', 'ts', 'middle') + text(P([-3, 0])[0], O[1] + 18, '−3', 'ts', 'middle');
  const q = C.pol(3, 1.0), Q = P(q);
  o += line(Q[0], Q[1], ...P([5, 0]), 'dash') + line(Q[0], Q[1], ...P([6, 0]), 'dash') + circle(Q[0], Q[1], 3.5, 'ink-f');
  o += text(Q[0] + 4, Q[1] - 8, 'z', 'tb', 'start');
  o += text(P([4.2, 1.5])[0] + 10, P([4.2, 1.5])[1], '|z − 5|、|z − 6|', 'ts', 'start');
  // 最近点的距离标注
  o += line(...P([3, -0.75]), ...P([5, -0.75]), 'mute') + line(...P([3, -0.6]), ...P([3, -1.45]), 'mute') + line(...P([5, -0.6]), ...P([5, -0.9]), 'mute') + text(P([5, 0])[0] + 6, P([0, -0.75])[1] + 4, '至少 2', 'ts', 'start');
  o += line(...P([3, -1.3]), ...P([6, -1.3]), 'mute') + line(...P([6, -1.15]), ...P([6, -1.45]), 'mute') + text(P([6, 0])[0] + 6, P([0, -1.3])[1] + 4, '至少 3', 'ts', 'start');
  o += text(20, 40, '|z| = 3，长度 L = 3π', 'tl', 'start');
  o += text(20, O[1] + 46, 'upper half plane，y ≥ 0：|e' + sup('iz') + '| = e' + sup('−y') + ' ≤ 1', 'ts', 'start');
  return svg(560, 270, o, 'radius 3 的 upper half circle，以及 real axis 上的 5 和 6；circle 上每一点到 5 至少 2、到 6 至少 3');
}

// ---------- 第 6 站 ----------
function goursatA() {
  const s = 125, P = plane(30, 238, s);
  const A0 = [[0, 0], [2, 0], [0.75, 1.7]];
  const mid = (a, b) => C.sc(0.5, C.add(a, b));
  const kids = (T) => { const [a, b, c] = T, ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); return [[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]]; };
  const pat = [3, 1, 3, 2, 0, 3, 1, 2];
  const seq = [A0];
  for (let k = 0; k < 40; k++) seq.push(kids(seq[k])[pat[k % pat.length]]);
  const z0 = seq[40][0];
  const peri = (T) => C.abs(C.sub(T[0], T[1])) + C.abs(C.sub(T[1], T[2])) + C.abs(C.sub(T[2], T[0]));
  const ez0 = C.exp(z0);
  const rem = (z) => C.abs(C.sub(C.exp(z), C.add(ez0, C.mul(ez0, C.sub(z, z0)))));
  const bound = (T) => { let m = 0; for (let k = 0; k < 3; k++) for (let j = 0; j <= 40; j++) { const z = C.add(T[k], C.sc(j / 40, C.sub(T[(k + 1) % 3], T[k]))); m = Math.max(m, rem(z)); } return peri(T) * m; };
  const n = 6, hold = 1.7, T = n * hold;
  const kt = []; for (let i = 0; i < n; i++) kt.push(i / n);
  let o = '';
  o += path(d(A0.map(P)) + 'Z', 'ink');
  for (let i = 0; i < n; i++) {
    let g = '';
    for (let j = 0; j <= i; j++) if (j < i) g += path(d(seq[j + 1].map(P)) + 'Z', 'wash');
    g += path(d(seq[i].map(P)) + 'Z', 'wash-strong');
    const ks = kids(seq[i]);
    g += path(d([P(ks[3][0]), P(ks[3][1]), P(ks[3][2])]) + 'Z', 'ink');
    g += path(d(seq[i + 1].map(P)) + 'Z', 'ln');
    o += grp(g, kt.map((_, k) => k === i), [...kt], T);
  }
  o += circle(...P(z0), 3, 'ink-f') + text(P(z0)[0] + 6, P(z0)[1] + 16, 'z₀', 'tb', 'start');
  const X = 320;
  o += text(X, 30, 'f = e' + sup('z') + '，切 n 次之后', 'tb', 'start');
  o += text(X, 56, 'n', 'ts', 'start') + text(X + 40, 56, 'perimeter pₙ', 'ts', 'start') + text(X + 140, 56, '4ⁿ · bound', 'ts', 'start');
  o += line(X, 64, 550, 64, 'axis');
  for (let i = 0; i < n; i++) {
    const on = kt.map((_, k) => k >= i);
    const row = text(X, 86 + i * 22, String(i), i === n - 1 ? 'tl' : 't', 'start') + text(X + 40, 86 + i * 22, peri(seq[i]).toFixed(3), i === n - 1 ? 'tl' : 't', 'start') + text(X + 140, 86 + i * 22, (4 ** i * bound(seq[i])).toFixed(4), i === n - 1 ? 'tl' : 't', 'start');
    o += grp(row, on, kt, T);
  }
  o += text(X, 236, 'bound = pₙ · max |f − f(z₀) − f′(z₀)(z − z₀)|', 'ts', 'start');
  o += text(X, 254, '每切一次约减半，趋于 0，所以 ∮ f dz = 0', 'ts', 'start');
  return svgA(560, 262, o, '动图：Goursat proof 的 subdivision，triangle 每次切成四块留下一块，nested triangle 缩向一点 z0；右边乘上 4 的 n 次方之后的 upper bound 每步约减半');
}

function deform() {
  let o = '';
  // 左
  const P = plane(140, 140, 1);
  const outer = []; for (let k = 0; k <= 160; k++) { const t = 2 * PI * k / 160; const r = 108 + 14 * Math.cos(3 * t) + 8 * Math.sin(2 * t); outer.push([r * Math.cos(t), 0.85 * r * Math.sin(t)]); }
  o += path(d(outer.map(P)) + 'Z', 'wash ink-s');
  const a = [-6, 4], r2 = 28;
  o += circle(...P(a), r2, 'paper-f') + path(d(arcPts(a, r2, 0, 2 * PI).map(P)), 'ln');
  o += circle(...P(a), 3.5, 'ink-f') + text(P(a)[0] + 6, P(a)[1] + 16, 'a', 'tb', 'start');
  // cut：从小 circle 右侧到外 curve
  const c0 = [a[0] + r2, a[1]], c1 = [outer[0][0], 4];
  o += line(...P([c0[0], c0[1] + 3]), ...P([c1[0], c1[1] + 3]), 'ink') + line(...P([c0[0], c0[1] - 3]), ...P([c1[0], c1[1] - 3]), 'ink');
  o += arrow(...P([60, 7]), ...P([48, 7]), 'ink', 6) + arrow(...P([48, 1]), ...P([60, 1]), 'ink', 6);
  o += text(P([50, 16])[0], P([50, 16])[1], 'C₃', 'tb', 'middle');
  o += headAt(P, outer, 40, 'ink') + headAt(P, outer, 100, 'ink');
  const inner = arcPts(a, r2, 2 * PI, 0, 60);
  o += headAt(P, inner, 15, 'ln') + headAt(P, inner, 45, 'ln');
  o += text(P([0, -70])[0], P([0, -70])[1] + 4, 'C₁ 逆时针', 't', 'middle');
  o += text(P(a)[0], P(a)[1] - r2 - 8, 'C₂ 顺时针', 'tl', 'middle');
  o += text(140, 22, '∮C₁ f dz = ∮C₂ f dz', 'tb', 'middle');
  // 右：|z| = 2，两个洞
  const s = 52, O = [420, 140], Q = plane(O[0], O[1], s);
  o += line(O[0] - 125, O[1], O[0] + 125, O[1], 'axis') + line(O[0], O[1] - 120, O[0], O[1] + 120, 'axis');
  const big = arcPts([0, 0], 2, 0, 2 * PI);
  o += path(d(big.map(Q)), 'ink') + headAt(Q, big, 30, 'ink') + headAt(Q, big, 90, 'ink');
  for (const c of [1, -1]) {
    const sm = arcPts([c, 0], 0.32, 0, 2 * PI, 60);
    o += path(d(sm.map(Q)), 'ln') + headAt(Q, sm, 15, 'ln', 6) + circle(...Q([c, 0]), 3.5, 'ink-f');
    o += text(Q([c, 0])[0], O[1] + 34, c > 0 ? '1' : '−1', 't', 'middle');
  }
  o += text(Q(C.pol(2, 0.8))[0] + 6, Q(C.pol(2, 0.8))[1] - 4, '|z| = 2', 't', 'start');
  o += text(420, 22, '1 / (z² − 1)：两个小 circle', 'tb', 'middle');
  o += text(280, 284, 'Contour 在 analytic 的地方可以随意变形，只要不跨过坏点', 'ts', 'middle');
  return svg(560, 290, o, '左：外 curve C1 与内 circle C2 之间用 cut C3 连接，C3 来回各走一次抵消；右：radius 2 的 circle 里有正负 1 两个坏点，换成两个小 circle');
}

// ---------- 第 7 站 ----------
function shrinkA() {
  const N = 40, T = 6;
  const rs = [], kt = [];
  for (let k = 0; k <= N; k++) { rs.push(1 * Math.pow(0.05, k / N)); kt.push(0.85 * k / N); }
  rs.push(rs[N]); kt.push(1);
  const g = (z) => (C.abs(z) < 1e-12 ? [1, 0] : C.div(C.sub(C.exp(z), [1, 0]), z));
  const B = (r) => { let m = 0; for (let j = 0; j < 200; j++) m = Math.max(m, C.abs(g(C.pol(r, 2 * PI * j / 200)))); return 2 * PI * r * m; };
  const s = 100, O = [140, 136], P = plane(O[0], O[1], s);
  let o = line(O[0] - 120, O[1], O[0] + 120, O[1], 'axis') + line(O[0], O[1] - 120, O[0], O[1] + 120, 'axis');
  o += path(d(arcPts([0, 0], 1, 0, 2 * PI).map(P)), 'dash');
  o += `<circle cx="${O[0]}" cy="${O[1]}" r="${f1(rs[0] * s)}" class="ln">${anim('r', rs.map((r) => f1(r * s)), kt, T)}</circle>`;
  o += circle(O[0], O[1], 3, 'ink-f') + text(O[0] + 6, O[1] + 16, 'z₀ = 0', 'ts', 'start');
  o += text(P([0.75, 0.75])[0] + 6, P([0.75, 0.75])[1] - 4, '|z| = 1', 'ts', 'start');
  o += text(O[0], 270, 'g(z) = (e' + sup('z') + ' − 1) / z，g(0) = 1', 'ts', 'middle');
  const sx = lin(0, 1, 330, 540), sy = lin(0, 11, 236, 40);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 11, xt: [0.25, 0.5, 0.75, 1], yt: [0, 2, 4, 6, 8, 10], grid: true, xl: 'radius r' });
  const cur = []; for (let k = 0; k <= 100; k++) { const r = 0.01 + 0.99 * k / 100; cur.push([sx(r), sy(B(r))]); }
  o += path(d(cur), 'ln');
  const pts = rs.map((r) => [sx(r), sy(B(r))]);
  o += acircle(pts.map((p) => p[0]), pts.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += text(330, 26, 'upper bound 2πr · max |g|', 'tb', 'start');
  o += text(sx(1) - 10, sy(B(1)) - 6, 'r = 1：' + B(1).toFixed(2), 'ts', 'end');
  o += text(sx(0.04), 70, 'r = 0.05：' + B(0.05).toFixed(3), 'ts', 'start');
  return svgA(560, 278, o, '动图：绕 0 的 circle 从 radius 1 缩到 0.05，ML upper bound 2πr 乘 max g 从 10.8 降到约 0.32，趋于 0');
}

function maxmod() {
  const s = 36, P = plane(50, 250, s), L = 2 * PI;
  let o = rect(...P([0, L]), L * s, L * s, 'frame');
  for (const c of [2, 10, 50, 200]) {
    const pts = []; for (let k = 0; k <= 200; k++) { const x = L * k / 200, sn = Math.sin(x); pts.push(P([x, Math.asinh(Math.sqrt(c * c - sn * sn))])); }
    o += path(d(pts), c === 200 ? 'ln' : 'mute');
    o += text(P([L, 0])[0] + 6, P([0, Math.asinh(Math.sqrt(c * c - 1))])[1] + 4, '|sin z| = ' + c, 'ts', 'start');
  }
  o += line(...P([0, L]), ...P([L, L]), 'ln');
  for (const x of [PI / 2, 3 * PI / 2]) o += circle(...P([x, L]), 5, 'ln-f');
  o += text(P([PI / 2, L])[0], P([0, L])[1] - 10, 'π/2 + 2πi', 'tl', 'middle') + text(P([3 * PI / 2, L])[0], P([0, L])[1] - 10, '3π/2 + 2πi', 'tl', 'middle');
  for (const x of [0, PI, 2 * PI]) o += circle(...P([x, 0]), 3.5, 'paper');
  o += text(P([0, 0])[0], 268, '0', 'ts', 'middle') + text(P([PI, 0])[0], 268, 'π', 'ts', 'middle') + text(P([L, 0])[0], 268, '2π', 'ts', 'middle');
  o += text(P([0, 0])[0] - 6, P([0, L])[1] + 4, '2π', 'ts', 'end');
  const X = 400;
  o += text(X, 140, 'maximum：cosh 2π ≈ 267.75', 'tb', 'start') + text(X, 160, '只在上边取到', 'ts', 'start');
  o += text(X, 196, '空心点：sin z = 0', 'ts', 'start');
  return svg(560, 276, o, '正方形 0 到 2π 乘 0 到 2π 里 sin z 的 modulus 的 level curve，越往上越大，最大值 cosh 2π 在上边的两个点取到');
}

// ---------- 第 8 站 ----------
function disks() {
  const s = 78, O = [190, 140], P = plane(O[0], O[1], s);
  let o = line(P([-1.8, 0])[0], O[1], P([2.9, 0])[0], O[1], 'axis') + line(O[0], P([0, 1.65])[1], O[0], P([0, -1.65])[1], 'axis');
  o += path(d(arcPts([0, 0], 1, 0, 2 * PI).map(P)) + 'Z', 'wash ink-s');
  o += path(d(arcPts([1, 0], Math.SQRT2, 0, 2 * PI).map(P)), 'ln-dash');
  for (const y of [1, -1]) o += circle(...P([0, y]), 5, 'ink-f');
  o += text(P([0, 1])[0] - 8, P([0, 1])[1] - 6, 'i', 'tb', 'end') + text(P([0, -1])[0] - 8, P([0, -1])[1] + 16, '−i', 'tb', 'end');
  o += circle(...P([1, 0]), 3, 'ink-f');
  // real axis 上的区间
  o += line(...P([-1, -0.07]), ...P([1, -0.07]), 'ink-b');
  const a = 1 - Math.SQRT2, b = 1 + Math.SQRT2;
  o += line(...P([a, 0.07]), ...P([b, 0.07]), 'ln');
  o += text(P([-1, 0])[0] - 4, O[1] + 18, '−1', 'ts', 'end') + text(P([1, 0])[0] - 4, O[1] + 18, '1', 'ts', 'end');
  o += text(P([b, 0])[0] + 6, O[1] + 18, '1 + √2', 'tl', 'start') + text(P([a, 0])[0] - 6, O[1] + 18, '1 − √2', 'tl', 'end');
  const X = 400;
  o += text(X, 50, 'center 0：radius 1', 'tb', 'start') + text(X, 68, '= 到 ±i 的距离', 'ts', 'start');
  o += text(X, 104, 'center 1：radius √2', 'tl', 'start') + text(X, 122, '= |1 − i|', 'ts', 'start');
  o += text(X, 170, '和 real axis 的交集：', 'ts', 'start') + text(X, 188, '(−1, 1) 与 (1 − √2, 1 + √2)', 'ts', 'start');
  return svg(560, 278, o, '1 除以 1 加 z 平方的两个 singularity 正负 i；以 0 为 center 的 disc radius 1，以 1 为 center 的 disc radius 根号 2，都恰好碰到正负 i');
}

function annuli() {
  const s = 38, O = [150, 138], P = plane(O[0], O[1], s);
  let o = path(d(arcPts([0, 0], 3.35, 0, 2 * PI).map(P)), 'grid');
  o += path(d(arcPts([0, 0], 3, 0, 2 * PI).map(P)) + 'Z', 'wash ink-s');
  o += path(d(arcPts([0, 0], 1, 0, 2 * PI).map(P)) + 'Z', 'paper');
  o += line(O[0] - 135, O[1], O[0] + 135, O[1], 'axis') + line(O[0], O[1] - 132, O[0], O[1] + 132, 'axis');
  o += path(d(arcPts([0, 0], 2, 0, 2 * PI).map(P)), 'ln-dash');
  for (const v of [-1, 3]) o += circle(...P([v, 0]), 5, 'ink-f');
  o += text(P([-1, 0])[0] - 4, O[1] + 18, '−1', 'tb', 'end') + text(P([3, 0])[0] + 6, O[1] + 18, '3', 'tb', 'start');
  o += text(P(C.pol(2, 2.3))[0] - 4, P(C.pol(2, 2.3))[1], '|z| = 2', 'tl', 'end');
  // 引线
  const lead = (from, y, lines) => { const p = P(from); let g = line(p[0], p[1], 330, y - 4, 'mute') + circle(p[0], p[1], 2.5, 'mute-f'); lines.forEach((t, i) => { g += text(336, y + i * 18, t[0], t[1], 'start'); }); return g; };
  o += lead([0.4, 0.5], 50, [['|z| < 1', 'tb'], ['两个零件都用 z 的 power', 'ts']]);
  o += lead(C.pol(2.5, 0.25), 120, [['1 < |z| < 3', 'tl'], ['2/(z + 1) 用 1/z 的 power', 'ts'], ['3/(z − 3) 用 z 的 power', 'ts']]);
  o += lead(C.pol(3.2, -0.6), 212, [['|z| > 3', 'tb'], ['两个零件都用 1/z 的 power', 'ts']]);
  return svg(560, 278, o, '两个 pole 负 1 和 3 把 plane 分成 z 的 modulus 小于 1、在 1 和 3 之间、大于 3 三块，radius 2 的 circle 落在中间那块');
}

// ---------- 第 9 站 ----------
function contours4() {
  const s = 64, O = [190, 146], P = plane(O[0], O[1], s);
  let o = line(O[0] - 150, O[1], O[0] + 230, O[1], 'axis') + line(O[0], O[1] - 126, O[0], O[1] + 126, 'axis');
  const cs = [
    { c: [2.5, 0.6], rx: 0.4, ry: 0.4, name: 'C₁', v: '0', at: [2.5, 1.25], anc: 'middle' },
    { c: [0, 1], rx: 0.22, ry: 0.22, name: 'C₂', v: '−πi', at: [1.12, 1.9], anc: 'start' },
    { c: [0, 0.5], rx: 0.62, ry: 1.06, name: 'C₃', v: 'πi', at: [-0.72, 1.2], anc: 'end' },
    { c: [0, 0], rx: 1.78, ry: 1.78, name: 'C₄', v: '0', at: [-1.65, -1.55], anc: 'middle' },
  ];
  for (const k of cs) {
    const pts = []; for (let j = 0; j <= 120; j++) { const t = 2 * PI * j / 120; pts.push([k.c[0] + k.rx * Math.cos(t), k.c[1] + k.ry * Math.sin(t)]); }
    o += path(d(pts.map(P)), k.name === 'C₃' ? 'ln' : k.name === 'C₂' ? 'ink-b' : 'ink');
    o += headAt(P, pts, 32, k.name === 'C₃' ? 'ln' : 'ink', 6);
    const a = P(k.at);
    o += text(a[0], a[1], k.name + '：' + k.v, k.name === 'C₃' ? 'tl' : 'tb', k.anc);
  }
  o += line(...P([0.2, 1.08]), ...P([1.08, 1.86]), 'mute');
  const poles = [[[0, 0], '0'], [[0, 1], 'i'], [[0, -1], '−i']];
  for (const [z, n] of poles) { const p = P(z); o += circle(p[0], p[1], 4.5, 'ink-f') + text(p[0] + (n === 'i' ? 19 : 9), p[1] + 5, n, 'tb', 'start'); }
  const X = 400;
  o += text(X, 196, 'f = 1 / (z(z² + 1))', 't', 'start');
  o += text(X, 220, 'Res(f, 0) = 1', 'ts', 'start') + text(X, 238, 'Res(f, i) = −½', 'ts', 'start') + text(X, 256, 'Res(f, −i) = −½', 'ts', 'start');
  return svg(560, 278, o, '1 除以 z 乘 z 平方加 1 的三个 pole 0、i、负 i，以及四条围住不同 pole 的 contour 和对应的 integral');
}

// ---------- 第 10 站 ----------
function semiA() {
  const N = 60, T = 7, Rs = [], kt = [];
  for (let k = 0; k <= N; k++) { Rs.push(1.2 * Math.pow(10 / 1.2, k / N)); kt.push(0.85 * k / N); }
  Rs.push(Rs[N]); kt.push(1);
  const seg = (R) => Math.atan(R) + R / (1 + R * R);
  const rp = 105, O = [140, 200];
  let o = line(O[0] - rp - 20, O[1], O[0] + rp + 20, O[1], 'axis') + line(O[0], O[1] + 10, O[0], O[1] - rp - 22, 'axis');
  const arc = arcPts([0, 0], rp, 0, PI, 80).map(([x, y]) => [O[0] + x, O[1] - y]);
  o += path(d(arc), 'ln') + line(O[0] - rp, O[1], O[0] + rp, O[1], 'ink-b');
  o += arrow(arc[38][0], arc[38][1], arc[42][0], arc[42][1], 'ln') + arrow(O[0] + 40, O[1], O[0] + 52, O[1], 'ink');
  const py = Rs.map((R) => O[1] - rp / R);
  o += acircle(Rs.map(() => O[0]), py, kt, T, 5, 'ink-f');
  o += `<text x="${O[0] + 8}" y="${f1(py[0] + 4)}" class="tb" text-anchor="start">i${anim('y', py.map((y) => f1(y + 4)), kt, T)}</text>`;
  o += text(O[0] - rp, O[1] + 18, '−R', 'ts', 'middle') + text(O[0] + rp, O[1] + 18, 'R', 'ts', 'middle');
  o += text(O[0] + 80, O[1] - 92, 'C' + sub('R'), 'tl', 'start');
  o += text(O[0], 240, '画成固定大小：R 变大时 pole i 相对地缩向 0', 'ts', 'middle');
  const sx = lin(1, 10, 330, 540), sy = lin(0, 1.8, 216, 40);
  o += axes({ sx, sy, x0: 1, x1: 10, y0: 0, y1: 1.8, xt: [2, 4, 6, 8, 10], yt: [[0, '0'], [0.5, '0.5'], [1, '1'], [PI / 2, 'π/2']], grid: true, xl: 'R' });
  const c1 = [], c2 = []; for (let k = 0; k <= 120; k++) { const R = 1.2 + (10 - 1.2) * k / 120; c1.push([sx(R), sy(seg(R))]); c2.push([sx(R), sy(PI / 2 - seg(R))]); }
  o += path(d(c1), 'ink-b') + path(d(c2), 'ln') + line(sx(1), sy(PI / 2), sx(10), sy(PI / 2), 'dash');
  const p1 = Rs.map((R) => [sx(R), sy(seg(R))]), p2 = Rs.map((R) => [sx(R), sy(PI / 2 - seg(R))]);
  o += acircle(p1.map((p) => p[0]), p1.map((p) => p[1]), kt, T, 4.5, 'ink-f') + acircle(p2.map((p) => p[0]), p2.map((p) => p[1]), kt, T, 4.5, 'ln-f');
  o += text(sx(6), sy(seg(6)) + 18, '∫ over [−R, R]', 't', 'middle');
  o += text(sx(5), sy(PI / 2 - seg(5)) - 10, '∫ over C' + sub('R'), 'tl', 'middle');
  o += text(330, 26, 'f = 1/(1 + z²)²，两段之和恒为 π/2', 'tb', 'start');
  return svgA(560, 250, o, '动图：R 从 1.2 长到 10，real segment 上的 integral 涨向二分之 π，semicircle 上的 integral 缩向 0，两者之和始终是二分之 π');
}

function arcs() {
  const arcInt = (f, R) => C.abs(cint(f, (t) => C.pol(R, t), (t) => C.mul([0, 1], C.pol(R, t)), 0, PI, 4000));
  const fe = (z) => C.div(C.exp(C.mul([0, 1], z)), C.add([1, 0], C.mul(z, z)));
  const fc = (z) => C.div(C.cos(z), C.add([1, 0], C.mul(z, z)));
  const ly = (v) => Math.log10(v);
  const sx = lin(2, 20, 70, 400), sy = lin(-3, 8, 236, 26);
  let o = axes({ sx, sy, x0: 2, x1: 20, y0: -3, y1: 8, xt: [2, 5, 10, 15, 20], yt: [[-3, '10⁻³'], [-1, '10⁻¹'], [1, '10'], [3, '10³'], [5, '10⁵'], [7, '10⁷']], grid: true, xl: 'R' });
  const ce = [], cc = [], cb = [];
  for (let k = 0; k <= 72; k++) {
    const R = 2 + 18 * k / 72;
    ce.push([sx(R), sy(ly(arcInt(fe, R)))]);
    cc.push([sx(R), sy(ly(arcInt(fc, R)))]);
    const b = PI * R * Math.cosh(R) / (R * R - 1);
    if (ly(b) <= 8) cb.push([sx(R), sy(ly(b))]);
  }
  o += path(d(ce), 'ln') + path(d(cc), 'ink-b') + path(d(cb), 'dash');
  o += line(sx(2), sy(ly(PI * Math.sinh(1))), sx(20), sy(ly(PI * Math.sinh(1))), 'grid');
  const X = 420;
  o += line(X, 60, X + 24, 60, 'dash') + text(X + 30, 64, 'cos z 的 ML bound', 'ts', 'start');
  o += line(X, 110, X + 24, 110, 'ink-b') + text(X + 30, 114, '|∫ cos z/(1+z²)|', 'ts', 'start') + text(X + 30, 132, '→ π sinh 1 ≈ 3.69', 'ts', 'start');
  o += line(X, 190, X + 24, 190, 'ln') + text(X + 30, 194, '|∫ e' + sup('iz') + '/(1+z²)|', 'ts', 'start') + text(X + 30, 212, '→ 0', 'ts', 'start');
  o += text(70, 16, 'semicircle C' + sub('R') + ' 上的 integral 的 modulus', 'tb', 'start');
  return svg(560, 270, o, 'semicircle 上的 integral 的 modulus 随 R 变化：用 e 的 iz 次方时趋于 0，用 cos z 时停在 π sinh 1 约 3.69，cos z 的 ML bound 指数增长');
}

function unit() {
  const s = 56, O = [170, 96], P = plane(O[0], O[1], s);
  let o = line(O[0] - 110, O[1], O[0] + 110, O[1], 'axis') + line(O[0], O[1] - 80, O[0], P([0, -3.4])[1], 'axis');
  const c = arcPts([0, 0], 1, 0, 2 * PI);
  o += path(d(c.map(P)) + 'Z', 'wash ink-s') + headAt(P, c, 20, 'ink') + headAt(P, c, 80, 'ink');
  o += circle(...P([0, -1 / 3]), 5, 'ln-f') + text(P([0, -1 / 3])[0] + 8, P([0, -1 / 3])[1] + 5, '−i/3', 'tl', 'start');
  o += circle(...P([0, -3]), 5, 'ink-f') + text(P([0, -3])[0] + 8, P([0, -3])[1] + 5, '−3i：在外面', 'tb', 'start');
  o += text(P([1, 0])[0] + 4, O[1] - 6, '1', 'ts', 'start');
  o += text(P(C.pol(1, 0.6))[0] + 6, P(C.pol(1, 0.6))[1] - 4, 'z = e' + sup('iθ'), 't', 'start');
  const X = 340;
  o += text(X, 60, '∫ dθ / (5 + 3 sin θ)，θ 从 0 到 2π', 'tb', 'start');
  o += text(X, 90, '= ∮ 2 dz / (3z² + 10iz − 3)', 't', 'start');
  o += text(X, 124, '两个 pole 的 product = −3/3 = −1', 'ts', 'start');
  o += text(X, 142, '一个在 unit circle 里，一个在外', 'ts', 'start');
  return svg(560, 290, o, 'unit circle 和两个 pole：负 i 的三分之一在里面，负 3i 在外面');
}

function indent() {
  const s = 30, O = [280, 200], P = plane(O[0], O[1], s), R = 6, e = 0.9;
  let o = line(O[0] - R * s - 30, O[1], O[0] + R * s + 30, O[1], 'axis');
  const big = arcPts([0, 0], R, 0, PI, 120), small = arcPts([0, 0], e, PI, 0, 40);
  o += path(d(big.map(P)), 'ln') + headAt(P, big, 60, 'ln');
  o += line(...P([-R, 0]), ...P([-e, 0]), 'ink-b') + line(...P([e, 0]), ...P([R, 0]), 'ink-b');
  o += path(d(small.map(P)), 'ink-b') + headAt(P, small, 22, 'ink');
  o += arrow(...P([-3.6, 0]), ...P([-3.2, 0]), 'ink') + arrow(...P([3.2, 0]), ...P([3.6, 0]), 'ink');
  o += circle(O[0], O[1], 3.5, 'paper') + text(O[0], O[1] + 18, '0', 't', 'middle');
  o += text(P([-R, 0])[0], O[1] + 18, '−R', 'ts', 'middle') + text(P([R, 0])[0], O[1] + 18, 'R', 'ts', 'middle');
  o += text(P([-e, 0])[0] - 2, O[1] + 18, '−ε', 'ts', 'end') + text(P([e, 0])[0] + 2, O[1] + 18, 'ε', 'ts', 'start');
  o += text(O[0], P([0, e])[1] - 10, 'C' + sub('ε') + ' 顺时针', 'ts', 'middle');
  o += text(P(C.pol(R, 0.5))[0] + 6, P(C.pol(R, 0.5))[1], 'C' + sub('R'), 'tl', 'start');
  o += text(O[0], 236, 'e' + sup('iz') + '/z 的唯一 pole 在 0，被小 semicircle 绕在外面', 'ts', 'middle');
  return svg(560, 242, o, 'indented contour：real axis 上从负 R 到负 epsilon，绕过 0 的小 semicircle，再从 epsilon 到 R，最后是大 semicircle');
}

function keyhole() {
  const s = 32, O = [200, 140], P = plane(O[0], O[1], s), R = 4, e = 0.45, g = 0.12;
  let o = line(O[0] - R * s - 24, O[1], O[0] + R * s + 30, O[1], 'axis') + line(O[0], O[1] - R * s - 16, O[0], O[1] + R * s + 16, 'axis');
  const tb = Math.asin(g / R), ts = Math.asin(g / e);
  const big = arcPts([0, 0], R, tb, 2 * PI - tb, 160);
  const sm = arcPts([0, 0], e, 2 * PI - ts, ts, 60);
  o += path(d(big.map(P)), 'ink') + headAt(P, big, 40, 'ink') + headAt(P, big, 120, 'ink');
  o += path(d(sm.map(P)), 'ink') + headAt(P, sm, 30, 'ink', 6);
  const xe = e * Math.cos(ts), xR = R * Math.cos(tb);
  o += line(...P([xe, g]), ...P([xR, g]), 'ln') + line(...P([xe, -g]), ...P([xR, -g]), 'ln');
  o += arrow(...P([2.0, g]), ...P([2.4, g]), 'ln', 6) + arrow(...P([2.4, -g]), ...P([2.0, -g]), 'ln', 6);
  for (const v of [-2, -3]) o += circle(...P([v, 0]), 4.5, 'ink-f') + text(P([v, 0])[0], O[1] + 18, '−' + Math.abs(v), 't', 'middle');
  const X = 380;
  o += text(X, 96, '上边：arg z → 0', 'tl', 'start') + text(X, 114, '√z = √x', 'ts', 'start');
  o += text(X, 166, '下边：arg z → 2π', 'tl', 'start') + text(X, 184, '√z = −√x，方向也反', 'ts', 'start');
  o += line(P([3, 0.12])[0], P([3, 0.12])[1], X - 6, 100, 'mute') + line(P([3, -0.12])[0], P([3, -0.12])[1], X - 6, 170, 'mute');
  o += text(P(C.pol(R, 2.2))[0] - 6, P(C.pol(R, 2.2))[1] - 4, 'C' + sub('R'), 't', 'end');
  o += text(P([0, -e])[0] - 4, P([0, -e])[1] + 16, 'C' + sub('ε'), 'ts', 'end');
  return svg(560, 282, o, 'keyhole contour：大 circle 逆时针，沿 positive real axis 下边回来，小 circle 顺时针，沿上边出去；pole 负 2 和负 3 在里面');
}

export default {
  'ma3211-cubic': cubic,
  'ma3211-taylor1d': taylor1d,
  'ma3211-mult': multA,
  'ma3211-cuberoots': cuberoots,
  'ma3211-expmap': expmap,
  'ma3211-arg': argA,
  'ma3211-dir': dirA,
  'ma3211-jacobian': jacobian,
  'ma3211-level': level,
  'ma3211-paths': paths,
  'ma3211-ml': ml,
  'ma3211-goursat': goursatA,
  'ma3211-deform': deform,
  'ma3211-shrink': shrinkA,
  'ma3211-maxmod': maxmod,
  'ma3211-disks': disks,
  'ma3211-annuli': annuli,
  'ma3211-contours4': contours4,
  'ma3211-semi': semiA,
  'ma3211-arcs': arcs,
  'ma3211-unit': unit,
  'ma3211-indent': indent,
  'ma3211-keyhole': keyhole,
};
