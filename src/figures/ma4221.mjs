import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, area, axes, apath, acircle, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 共用的数值工具 ----------
function erf(x) {
  const s = Math.sign(x), a = Math.abs(x);
  if (a < 3) {
    // Taylor series：a < 3 时 50 项足够到 1e-12
    let term = a, sum = a;
    for (let n = 1; n < 60; n++) { term *= (-a * a) / n; sum += term / (2 * n + 1); }
    return (s * 2 * sum) / Math.sqrt(Math.PI);
  }
  // a ≥ 3：erfc 的 asymptotic expansion
  const z = 1 / (a * a);
  const erfc = (Math.exp(-a * a) / (a * Math.sqrt(Math.PI))) * (1 - z / 2 + (3 * z * z) / 4 - (15 * z * z * z) / 8);
  return s * (1 - erfc);
}
// box 初值（|x|<1 时为 1）在 heat equation（k = 1）下的解
const boxHeat = (x, t) => (t <= 0 ? (Math.abs(x) < 1 ? 1 : Math.abs(x) === 1 ? 0.5 : 0) : 0.5 * (erf((x + 1) / Math.sqrt(4 * t)) - erf((x - 1) / Math.sqrt(4 * t))));
const tri = (x) => Math.max(0, 1 - Math.abs(x));
// heat kernel 与 triangle 初值的 convolution（Simpson）
function triHeat(x, t) {
  const n = 400, h = 2 / n;
  let s = 0;
  for (let i = 0; i <= n; i++) {
    const y = -1 + i * h, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    s += w * tri(y) * Math.exp(-((x - y) ** 2) / (4 * t)) / Math.sqrt(4 * Math.PI * t);
  }
  return (s * h) / 3;
}
// 带底色的标注：先垫一块和卡片同色的底，线条从下面穿过时不会压住字
const tw = (s, cls) => { let w = 0; for (const ch of String(s).replace(/<[^>]*>/g, '')) w += /[\u3000-\u9fff\uff00-\uffef]/.test(ch) ? 13 : 6.6; return w * (cls === 'ts' ? 0.85 : cls === 'tb' || cls === 'tl' ? 1.05 : 1); };
function lab(x, y, s, cls = 't', anchor = 'start') {
  const w = tw(s, cls) + 6, h = cls === 'ts' ? 14 : 16;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w + 3 : x - 3;
  return rect(x0, y - h + 4, w, h, 'paper-f', 3) + text(x, y, s, cls, anchor);
}
const fmt = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// 时间滑块：一条短轴，点按真实时间移动
function slider(x0, x1, y, t0, t1, ticks, ts, kt, T, label) {
  const sx = lin(t0, t1, x0, x1);
  let o = line(x0, y, x1, y, 'axis');
  for (const v of ticks) o += line(sx(v), y - 4, sx(v), y + 4, 'axis') + text(sx(v), y + 17, String(v), 'ts', 'middle');
  o += acircle(ts.map(sx), ts.map(() => y), kt, T, 5.5, 'ln-f');
  if (label) o += text(x0 - 10, y + 4, label, 'ts', 'end');
  return o;
}

// ---------- 开头：同一个 triangle，wave 和 heat 各自怎么处理 ----------
function twoeq() {
  let o = '';
  const panel = (x0, title, fn, note1, note2) => {
    const sx = lin(-3, 3, x0, x0 + 230), sy = lin(0, 1.05, 190, 40);
    o += line(x0, sy(0), x0 + 230, sy(0), 'axis');
    for (const v of [-2, 0, 2]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, v < 0 ? '−2' : String(v), 'ts', 'middle');
    o += path(curve(tri, -3, 3, sx, sy, 600), 'dash') + path(curve(fn, -3, 3, sx, sy, 300), 'ln');
    o += text(x0 + 115, 22, title, 'tb', 'middle') + text(x0 + 115, 228, note1, 'ts', 'middle') + text(x0 + 115, 244, note2, 'ts', 'middle');
  };
  panel(25, 'wave equation，t = 0.5', (x) => 0.5 * (tri(x + 0.5) + tri(x - 0.5)), '分成两半各走各的，每个 corner 都还在', '（4 个 kink，在 x = ±0.5、±1.5）');
  panel(305, 'heat equation，t = 0.05', (x) => triHeat(x, 0.05), '所有 corner 立刻被抹平，', `顶点从 1 降到 ${triHeat(0, 0.05).toFixed(2)}`);
  o += text(280, 268, '虚线是共同的 initial data：x = 0 处一个高 1 的 triangle（c = 1，k = 1）', 'ts', 'middle');
  return svg(560, 276, o, '同一个 triangle 形 initial data：wave equation 在 t 等于 0.5 时分成两个带 corner 的半高 triangle，heat equation 在 t 等于 0.05 时已经变成光滑的 bump');
}

// ---------- 第 1 站：u_t + 2u_x = 0，profile 沿 characteristic 平移 ----------
function transportA() {
  const c = 2, f = (x) => Math.exp(-(x * x) / 0.16);
  const N = 50, Tm = 2.5, T = 5.2;
  const ts = [], kt = [];
  for (let i = 0; i <= N; i++) { ts.push((Tm * i) / N); kt.push((i / N) * (4.4 / T)); }
  ts.push(Tm); kt.push(1);
  const sx = lin(-1.5, 6.5, 50, 530);
  // 上：profile
  const sy = lin(0, 1.1, 112, 24);
  let o = line(50, sy(0), 530, sy(0), 'axis');
  o += path(curve(f, -1.5, 6.5, sx, sy, 300), 'dash');
  o += apath(ts.map((t) => curve((x) => f(x - c * t), -1.5, 6.5, sx, sy, 110)), kt, T, 'ln');
  o += text(56, 20, 'u(x, t) = f(x − 2t)：形状不变，以 speed 2 往右走', 'tb');
  // 下：x–t plane
  const st = lin(0, 2.5, 300, 150);
  o += axes({ sx, sy: st, x0: -1.5, x1: 6.5, y0: 0, y1: 2.5, xt: [[-1, '−1'], 0, 1, 2, 3, 4, 5, 6], yt: [0, 1, 2], xl: 'x', yl: 't' });
  for (let x0 = -6; x0 <= 6; x0 += 1) {
    const xa = Math.max(-1.5, x0), ta = (xa - x0) / c, xb = Math.min(6.5, x0 + c * 2.5), tb = (xb - x0) / c;
    if (xb > xa) o += line(sx(xa), st(ta), sx(xb), st(tb), x0 === 0 ? 'ink-b' : 'grid');
  }
  o += apath(ts.map((t) => d([[sx(-1.5), st(t)], [sx(6.5), st(t)]])), kt, T, 'mute');
  o += acircle(ts.map((t) => sx(c * t)), ts.map((t) => st(t)), kt, T, 5, 'ln-f');
  o += acircle(ts.map((t) => sx(c * t)), ts.map((t) => sy(1)), kt, T, 4, 'ln-f');
  o += text(sx(3.6), st(1.95), 'characteristic x − 2t = 0', 'ts', 'end');
  o += text(sx(6.4), st(0.12), '细线：x − 2t = constant', 'ts', 'end');
  return svgA(560, 330, o, '动图：上面 profile f(x − 2t) 以 speed 2 向右平移；下面 x–t plane 上一族斜率相同的 characteristic line，水平线表示当前时刻，peak 沿着 x − 2t = 0 那条线走');
}

// u_x + y u_y = 0：characteristic curve y = C e^x
function charcurve() {
  const sx = lin(0, 2.2, 70, 380), sy = lin(-3.2, 3.2, 290, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2.2, y0: -3.2, y1: 3.2, xt: [1, 2], yt: [[-3, '−3'], [-2, '−2'], [-1, '−1'], 0, 1, 2, 3], xl: 'x', yl: 'y', xAt: 0 });
  o += line(sx(1), sy(-3.2), sx(1), sy(3.2), 'dash');
  for (const y1 of [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5]) {
    const pts = [];
    for (let i = 0; i <= 120; i++) { const x = (2.2 * i) / 120, y = y1 * Math.exp(x - 1); if (Math.abs(y) <= 3.2) pts.push([sx(x), sy(y)]); }
    o += path(d(pts), y1 === 1.5 ? 'ln' : 'mute');
    o += circle(sx(1), sy(y1), 3, 'ink-f');
  }
  o += lab(sx(1.77) + 6, sy(3.05), 'y = 1.5e^(x−1)', 'tl');
  o += text(sx(1), 22, 'data 给在 x = 1 上', 'ts', 'middle');
  const X = 410;
  o += text(X, 60, '沿每条 curve，u 不变', 'tb') + text(X, 82, '等于它穿过 x = 1 时', 't') + text(X, 100, '的值 y₁²。', 't');
  o += text(X, 136, '彩色那条：y₁ = 1.5，', 't') + text(X, 154, '整条 curve 上 u = 2.25。', 't');
  o += text(X, 190, '它在 x = 0 处的高度是', 't') + text(X, 208, `1.5/e = ${(1.5 / Math.E).toFixed(3)}，`, 't') + text(X, 226, `所以 u(0, ${(1.5 / Math.E).toFixed(3)}) = 2.25。`, 't');
  o += text(X, 262, 'y = 0 本身也是一条', 'ts') + text(X, 278, 'characteristic，u ≡ 0。', 'ts');
  return svg(560, 300, o, 'u_x 加 y u_y 等于 0 的 characteristic curve 是 y 等于 C 乘 e 的 x 次方；data 给在 x 等于 1 的竖线上，沿每条 curve u 保持不变');
}

// Burgers：f(x) = −x，所有 characteristic 在 (0, 1) 相交
function burgers() {
  const sx = lin(-1.2, 1.2, 70, 330), st = lin(0, 1.25, 250, 40);
  let o = axes({ sx, sy: st, x0: -1.2, x1: 1.2, y0: 0, y1: 1.25, xt: [[-1, '−1'], [-0.5, '−0.5'], 0, 0.5, 1], yt: [0, 0.5, 1], xl: 'x', yl: 't', yAt: -1.2 });
  for (let p = -1; p <= 1.0001; p += 0.25) o += line(sx(p), st(0), sx(0), st(1), Math.abs(p - 0.75) < 1e-9 ? 'ln' : 'ink');
  o += line(sx(-1.2), st(1), sx(1.2), st(1), 'dash') + circle(sx(0), st(1), 5, 'ln-f');
  o += text(sx(0.75) + 6, st(0) - 8, 'p = 0.75', 'tl') + text(sx(0.42) + 6, st(0.45), '这条线上 u = −0.75', 'ts');
  const X = 360;
  o += text(X, 60, 'u_t + u u_x = 0，u(x, 0) = −x', 'tb');
  o += text(X, 88, '从 (p, 0) 出发的 characteristic', 't') + text(X, 106, '斜率 dx/dt = u = −p：', 't') + text(X, 124, 'x = p(1 − t)。', 't');
  o += text(X, 158, '全部经过 (0, 1)。', 't') + text(X, 180, '在那一点 u 要同时等于', 't') + text(X, 198, '每一个 −p：solution', 't') + text(X, 216, '在 t = 1 之前就没了。', 't');
  return svg(560, 280, o, 'Burgers equation 初值 u 等于负 x 时，所有 characteristic line 汇聚到点 (0, 1)，solution 在 t 等于 1 时失效');
}

// ---------- 第 2 站：string 的一小段 ----------
function string() {
  const u = (x) => 100 * Math.cos((Math.PI * (x - 200)) / 700);
  const sy = (x) => 220 - u(x);
  let o = line(40, 220, 520, 220, 'grid');
  o += path(curve((x) => sy(x), 40, 520, (x) => x, (y) => y, 200), 'ink-b');
  const a = 330, b = 440;
  const slope = (x) => (sy(x + 0.01) - sy(x - 0.01)) / 0.02;
  const seg = (x, dir) => { const s = slope(x), L = 70, n = Math.hypot(1, s); return [x + (dir * L) / n, sy(x) + (dir * L * s) / n]; };
  const A = seg(a, -1), B = seg(b, 1);
  o += path(curve((x) => sy(x), a, b, (x) => x, (y) => y, 60), 'ln');
  o += arrow(a, sy(a), A[0], A[1], 'ink') + arrow(b, sy(b), B[0], B[1], 'ink');
  o += line(A[0], A[1], A[0], sy(a), 'dash') + line(B[0], B[1], B[0], sy(b), 'dash');
  o += line(a, sy(a), A[0] - 6, sy(a), 'grid') + line(b, sy(b), B[0] + 6, sy(b), 'grid');
  o += circle(a, sy(a), 3.5, 'ink-f') + circle(b, sy(b), 3.5, 'ink-f');
  o += text(A[0] - 6, A[1] - 2, 'T', 'tb', 'end') + text(B[0] + 7, B[1] - 3, 'T', 'tb');
  o += text(A[0] - 4, sy(a) + 16, '竖直分量 −T sin θ(x)', 'ts', 'end');
  o += text(b + 8, sy(b) - 8, 'T sin θ(x+Δx)', 'ts');
  o += line(a, 220, a, 232, 'axis') + line(b, 220, b, 232, 'axis') + text(a, 248, 'x', 't', 'middle') + text(b, 248, 'x + Δx', 't', 'middle');
  o += text((a + b) / 2 - 6, sy((a + b) / 2) + 28, 'mass ρΔx', 'ts', 'middle');
  o += text(40, 24, '每一点只能上下动；tension T 沿 tangent 方向。', 'tb');
  o += text(40, 44, 'θ 很小时 sin θ ≈ tan θ = u_x，竖直合力 T[u_x(x+Δx) − u_x(x)]。', 'ts');
  return svg(560, 258, o, '一根拉紧的 string 上从 x 到 x 加 Delta x 的一小段，两端受 tension T 沿 tangent 方向，vertical component 是 T sin theta');
}

// rod：flux 从热处流向冷处
function rod() {
  const sx = lin(0, 10, 50, 510), u = (x) => 0.25 + 0.65 * Math.exp(-((x - 3.2) ** 2) / 6);
  const sy = lin(0, 1, 150, 30);
  let o = line(50, sy(0), 510, sy(0), 'axis') + path(curve(u, 0, 10, sx, sy, 200), 'ln');
  o += text(sx(0.2), sy(u(0.2)) - 10, 'temperature u(x)', 'tl');
  o += rect(50, 176, 460, 30, 'paper', 4);
  const a = 4.6, b = 7.2;
  o += rect(sx(a), 176, sx(b) - sx(a), 30, 'wash');
  o += line(sx(a), sy(0), sx(a), 210, 'dash') + line(sx(b), sy(0), sx(b), 210, 'dash');
  o += text(sx(a), 226, 'a', 't', 'middle') + text(sx(b), 226, 'b', 't', 'middle');
  const q = (x) => -(u(x + 0.01) - u(x - 0.01)) / 0.02;
  o += arrow(sx(a) - 36, 191, sx(a) - 36 + 300 * q(a) * 0.12 + 20, 191, 'ink-b') + arrow(sx(b) - 12, 191, sx(b) - 12 + 300 * q(b) * 0.12 + 14, 191, 'ink-b');
  o += text(sx(a) - 40, 168, `q(a) = −κ u_x(a)`, 'ts', 'end');
  o += text(sx(b) + 26, 168, 'q(b)', 'ts');
  o += text(sx((a + b) / 2), 196, '∫ u dx', 't', 'middle');
  o += text(280, 252, '[a, b] 里的 heat 每秒的变化 = 从 a 流进的 q(a) − 从 b 流出的 q(b)', 'ts', 'middle');
  return svg(560, 262, o, '一根 rod 上的 temperature 分布，以及 interval a 到 b 两端的 heat flux；flux 从热处流向冷处，等于负 k 乘 u_x');
}

// backward heat：同一个 mode，n 越大炸得越快
function hadamard() {
  const sx = lin(0, 0.1, 70, 400), sy = lin(-6, 17, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 0.1, y0: -6, y1: 17, xt: [0, 0.02, 0.04, 0.06, 0.08, 0.1], yt: [[-5, '10⁻⁵'], [0, '1'], [5, '10⁵'], [10, '10¹⁰'], [15, '10¹⁵']], xl: 't', grid: true });
  const amp = (n, s) => (t) => Math.log10(Math.exp(s * n * n * t) / n);
  for (const n of [5, 10, 20]) {
    o += path(curve(amp(n, 1), 0, 0.1, sx, sy), 'ln') + path(curve(amp(n, -1), 0, Math.min(0.1, (6 - Math.log10(n)) * Math.LN10 / (n * n)), sx, sy), 'dash');
    o += text(406, sy(amp(n, 1)(0.1)) + 4, `n = ${n}：${n === 20 ? '1.2 × 10¹⁶' : (Math.exp(n * n * 0.1) / n).toFixed(1)}`, n === 20 ? 'tl' : 't');
  }
  o += text(70, 300, '虚线：正常的 u_t = u_xx 下同一组 mode 的 amplitude（decay 到 10⁻⁶ 以下的部分没画）', 'ts');
  o += text(70, 20, 'u_t = −u_xx 的 solution (1/n) e^(n²t) sin nx 的 amplitude（log scale）', 'tb');
  return svg(560, 306, o, 'Backward heat equation 的 mode 的 amplitude 随时间指数增长，n 越大增长越快；正常 heat equation 的同一组 mode 则 decay');
}

// ---------- 第 3 站：y u_xx − 2u_xy + x u_yy = 0 的类型分区 ----------
function regions() {
  const sx = lin(-3, 3, 60, 340), sy = lin(-3, 3, 300, 20);
  let o = '';
  const hyp = (sgn) => { const pts = []; for (let i = 0; i <= 80; i++) { const x = sgn * (1 / 3 + ((3 - 1 / 3) * i) / 80); pts.push([x, 1 / x]); } return pts; };
  const P = hyp(1), Q = hyp(-1);
  o += path(d([...P.map(([x, y]) => [sx(x), sy(y)]), [sx(3), sy(3)]]) + 'Z', 'wash');
  o += path(d([...Q.map(([x, y]) => [sx(x), sy(y)]), [sx(-3), sy(-3)]]) + 'Z', 'wash');
  o += rect(60, 20, 280, 280, 'frame');
  o += line(sx(-3), sy(0), sx(3), sy(0), 'axis') + line(sx(0), sy(-3), sx(0), sy(3), 'axis');
  o += path(d(P.map(([x, y]) => [sx(x), sy(y)])), 'ln') + path(d(Q.map(([x, y]) => [sx(x), sy(y)])), 'ln');
  o += text(sx(2.1), sy(2.3), 'elliptic', 'tl', 'middle') + text(sx(-2.1), sy(-2.4), 'elliptic', 'tl', 'middle');
  o += text(sx(-1.6), sy(1.6), 'hyperbolic', 't', 'middle') + text(sx(1.6), sy(-1.6), 'hyperbolic', 't', 'middle');
  o += text(sx(0.25), sy(0.35), 'hyperbolic', 'ts');
  o += text(sx(3) + 6, sy(1 / 3) + 4, 'xy = 1', 'tl');
  o += text(sx(3) + 6, sy(0) + 4, 'x', 'ts') + text(sx(0) + 6, sy(3) + 12, 'y', 'ts');
  const X = 386;
  o += text(X, 60, 'D = a₁₂² − a₁₁a₂₂ = 1 − xy', 'tb');
  o += text(X, 90, '浅色：xy > 1，elliptic', 't') + text(X, 110, '白色：xy < 1，hyperbolic', 't') + text(X, 130, '彩线：xy = 1，parabolic', 't');
  o += text(X, 166, '(2, 1)：1 − 2 = −1', 'ts') + text(X, 184, '(1, 1)：1 − 1 = 0', 'ts') + text(X, 202, '(0, 0)：1 − 0 = 1', 'ts');
  return svg(560, 310, o, 'y u_xx 减 2 u_xy 加 x u_yy 等于 0 的类型：hyperbola xy 等于 1 把 plane 分开，xy 大于 1 的两块是 elliptic，其余是 hyperbolic，曲线上是 parabolic');
}

// u_tt − 4u_tx + 2u_xx = 0 的两族 characteristic
function charfam() {
  const r1 = 2 + Math.SQRT2, r2 = 2 - Math.SQRT2;
  const sx = lin(-4, 2, 60, 360), st = lin(0, 1.6, 250, 40);
  let o = axes({ sx, sy: st, x0: -4, x1: 2, y0: 0, y1: 1.6, xt: [[-4, '−4'], [-3, '−3'], [-2, '−2'], [-1, '−1'], 0, 1, 2], yt: [0, 0.5, 1, 1.5], xl: 'x', yl: 't' });
  const fam = (r, cls) => { for (let c = -4; c <= 6; c += 0.5) { const pts = []; for (let i = 0; i <= 40; i++) { const t = (1.6 * i) / 40, x = c - r * t; if (x >= -4 && x <= 2) pts.push([sx(x), st(t)]); } if (pts.length > 1) o += path(d(pts), cls); } };
  fam(r1, 'grid'); fam(r2, 'grid');
  const P = [-2, 1];
  o += line(sx(P[0] + r1), st(0), sx(P[0]), st(P[1]), 'ln') + line(sx(P[0] + r2), st(0), sx(P[0]), st(P[1]), 'ink-b');
  o += circle(sx(P[0]), st(P[1]), 4.5, 'ink-f') + lab(sx(P[0]) - 8, st(P[1]) - 8, '(−2, 1)', 't', 'end');
  o += lab(sx(P[0] + r1) + 6, st(0.08), `x + ${r1.toFixed(2)}t = ${fmt(P[0] + r1)}`, 'tl');
  o += lab(sx(P[0] + r2) - 8, st(0.08), `x + ${r2.toFixed(2)}t = ${fmt(P[0] + r2)}`, 'tb', 'end');
  const X = 384;
  o += text(X, 60, 'u_tt − 4u_tx + 2u_xx = 0', 'tb');
  o += text(X, 88, '两族 characteristic：', 't') + text(X, 106, 'x + (2 ± √2)t = constant', 't');
  o += text(X, 140, 'u = F(x + 3.41t)', 't') + text(X, 158, '   + G(x + 0.59t)', 't');
  o += text(X, 192, '(−2, 1) 处的值只由', 'ts') + text(X, 208, 't = 0 时这两条线', 'ts') + text(X, 224, '落脚点的 data 决定。', 'ts');
  return svg(560, 280, o, 'u_tt 减 4 u_tx 加 2 u_xx 等于 0 有两族 characteristic line，斜率不同；过点 (−2, 1) 的两条分别落在 x 约 1.41 和 x 约 −1.41');
}

// ---------- 第 4 站：plucked string 分成两半 ----------
// piecewise linear 的 function：在粗 grid 加上所有 kink 处取值，画出来不会把 corner 磨圆
function pw(fn, x0, x1, kinks, sx, sy, n = 30) {
  const xs = [];
  for (let i = 0; i <= n; i++) xs.push(x0 + ((x1 - x0) * i) / n);
  for (const k of kinks) if (k > x0 && k < x1) xs.push(k, k - 1e-6, k + 1e-6);
  xs.sort((p, q) => p - q);
  return d(xs.map((x) => [sx(x), sy(fn(x))]));
}
function pluckA() {
  const N = 48, Tm = 3, T = 6;
  const ts = [], kt = [];
  for (let i = 0; i <= N; i++) { ts.push((Tm * i) / N); kt.push((i / N) * (5 / T)); }
  ts.push(Tm); kt.push(1);
  const sx = lin(-4.5, 4.5, 40, 400), sy = lin(-0.05, 1.05, 200, 40);
  let o = line(40, sy(0), 400, sy(0), 'axis');
  for (const v of [-4, -2, 0, 2, 4]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, v < 0 ? '−' + -v : String(v), 'ts', 'middle');
  const kk = (t) => [-1 - t, -t, 1 - t, -1 + t, t, 1 + t];
  o += path(pw(tri, -4.5, 4.5, [-1, 0, 1], sx, sy), 'grid');
  o += apath(ts.map((t) => pw((x) => 0.5 * tri(x + t), -4.5, 4.5, kk(t), sx, sy)), kt, T, 'dash');
  o += apath(ts.map((t) => pw((x) => 0.5 * tri(x - t), -4.5, 4.5, kk(t), sx, sy)), kt, T, 'dash');
  o += apath(ts.map((t) => pw((x) => 0.5 * (tri(x + t) + tri(x - t)), -4.5, 4.5, kk(t), sx, sy)), kt, T, 'ln');
  o += text(40, 22, 'φ(x) = max(0, 1 − |x|)，ψ = 0，c = 1：u = ½φ(x + t) + ½φ(x − t)', 'tb');
  o += text(sx(3), sy(0.86), '虚线：两个半高的 copy', 'ts', 'middle') + text(sx(3), sy(0.74), '一个往左、一个往右', 'ts', 'middle');
  // energy：KE = ½∫u_t²，PE = ½∫u_x²（ρ = T = 1）
  const dphi = (x) => (x > -1 && x < 0 ? 1 : x > 0 && x < 1 ? -1 : 0);
  const en = (t) => { let ke = 0, pe = 0; const h = 0.001; for (let x = -5; x < 5; x += h) { const a = dphi(x + t), b = dphi(x - t); ke += 0.5 * (0.5 * (a - b)) ** 2 * h; pe += 0.5 * (0.5 * (a + b)) ** 2 * h; } return [ke, pe]; };
  const E = ts.map(en);
  const by = lin(0, 1, 200, 60), bw = 30;
  o += line(430, by(0), 540, by(0), 'axis') + line(430, by(1), 540, by(1), 'grid') + text(426, by(1) + 4, '1', 'ts', 'end') + text(426, by(0) + 4, '0', 'ts', 'end') + text(426, by(0.5) + 4, '½', 'ts', 'end') + line(430, by(0.5), 540, by(0.5), 'grid');
  const bar = (x, k, cls) => `<rect x="${x}" y="${f1(by(E[0][k]))}" width="${bw}" height="${f1(by(0) - by(E[0][k]))}" class="${cls}">${anim('y', E.map((e) => f1(by(e[k]))), kt, T)}${anim('height', E.map((e) => f1(by(0) - by(e[k]))), kt, T)}</rect>`;
  o += bar(445, 1, 'wash-strong') + bar(495, 0, 'solid');
  o += text(460, by(0) + 17, 'PE', 'ts', 'middle') + text(510, by(0) + 17, 'KE', 'ts', 'middle');
  o += text(485, 44, 'energy', 'tb', 'middle');
  o += text(485, 236, 'PE + KE 恒为 1', 'ts', 'middle');
  o += slider(120, 340, 246, 0, 3, [0, 1, 2, 3], ts, kt, T, 't');
  return svgA(560, 268, o, '动图：triangle 形 initial displacement 分成两个半高的 triangle，分别以 speed 1 往左和往右走；右边的 bar 显示 potential energy 从 1 降到 0.5、kinetic energy 从 0 涨到 0.5，总和不变');
}

// domain of dependence / influence：hammer blow
function cone() {
  const sx = lin(-4.5, 6.5, 40, 340), st = lin(0, 4.5, 270, 40);
  let o = '';
  o += poly([[sx(-1), st(0)], [sx(1), st(0)], [sx(5.5), st(4.5)], [sx(-5.5), st(4.5)]].map(([x, y]) => [Math.max(40, Math.min(340, x)), y]), 'wash');
  o += poly([[sx(0), st(1)], [sx(3.5), st(4.5)], [sx(-3.5), st(4.5)]], 'wash-strong');
  o += axes({ sx, sy: st, x0: -4.5, x1: 6.5, y0: 0, y1: 4.5, xt: [[-4, '−4'], [-2, '−2'], 0, 2, 4, 6], yt: [0, 1, 2, 3, 4], xl: 'x', yl: 't' });
  o += line(sx(-1), st(0), sx(1), st(0), 'ink-b');
  o += line(sx(3), st(0), sx(3), st(4.5), 'dash');
  o += line(sx(0), st(0), sx(3), st(3), 'ln') + line(sx(6), st(0), sx(3), st(3), 'ln') + circle(sx(3), st(3), 4.5, 'ln-f');
  o += lab(sx(3) + 8, st(3) - 4, '(3, 3)', 'tl');
  o += text(sx(0), st(3.6), 'u = 1', 'tw', 'middle');
  o += text(sx(-3.3), st(2.6), '0 < u < 1', 't', 'middle');
  o += text(sx(-3.4), st(0.5), 'u = 0', 'ts', 'middle');
  o += lab(sx(-1) - 4, st(0) - 8, 'ψ = 1 在 [−1, 1]', 'tb', 'end');
  // 右：u(3, t)
  const px = lin(0, 5, 385, 545), py = lin(0, 1.15, 230, 80);
  o += axes({ sx: px, sy: py, x0: 0, x1: 5, y0: 0, y1: 1.15, xt: [0, 1, 2, 3, 4, 5], yt: [0, 0.5, 1], xl: 't' });
  const u3 = (t) => 0.5 * Math.max(0, Math.min(1, 3 + t) - Math.max(-1, 3 - t));
  o += path(curve(u3, 0, 5, px, py, 200), 'ln') + circle(px(3), py(0.5), 4, 'ln-f');
  o += text(385, 56, 'x = 3 处的 u(3, t)', 'tb') + text(px(3) + 8, py(0.5) + 14, 't = 3：½', 'ts');
  o += text(385, 284, '2 之前没有动静，4 之后停在 1', 'ts');
  return svg(560, 306, o, 'Hammer blow：initial velocity 只在 −1 到 1 上为 1；x–t plane 上它的 domain of influence 是一个往上张开的区域，点 (3, 3) 的 domain of dependence 是底边 0 到 6；右边是 x 等于 3 处 u 随 t 的变化');
}

// half-line 上的 reflection：odd extension
function reflectA() {
  const w = 0.8, c0 = 3, phi = (x) => Math.max(0, 1 - Math.abs(x - c0) / w);
  const odd = (x) => (x >= 0 ? phi(x) : -phi(-x));
  const N = 60, Tm = 6, T = 8.5;
  const ts = [], kt = [];
  for (let i = 0; i <= N; i++) { ts.push((Tm * i) / N); kt.push((i / N) * (7.5 / T)); }
  ts.push(Tm); kt.push(1);
  const sx = lin(-5, 7, 30, 530), sy = lin(-1.1, 1.1, 210, 46);
  let o = rect(30, 46, sx(0) - 30, 164, 'wash2');
  o += line(30, sy(0), 530, sy(0), 'axis');
  for (const v of [-4, -2, 0, 2, 4, 6]) o += line(sx(v), 210, sx(v), 216, 'axis') + text(sx(v), 230, v < 0 ? '−' + -v : String(v), 'ts', 'middle');
  o += line(sx(0), 40, sx(0), 214, 'ink-b');
  const uu = (t) => (x) => 0.5 * (odd(x + t) + odd(x - t));
  const kinks = (t) => { const b = [c0 - w, c0, c0 + w, -c0 - w, -c0, -c0 + w]; return [...b.map((v) => v - t), ...b.map((v) => v + t), 0]; };
  o += apath(ts.map((t) => pw(uu(t), -5, 0, kinks(t), sx, sy, 20)), kt, T, 'mute');
  o += apath(ts.map((t) => pw(uu(t), 0, 7, kinks(t), sx, sy, 28)), kt, T, 'ln');
  o += text(sx(-2.5), 30, 'x < 0：odd extension（虚构的）', 'ts', 'middle') + text(sx(3.5), 30, 'x > 0：真实的 string，u(0, t) = 0', 'tb', 'middle');
  o += slider(130, 430, 262, 0, 6, [0, 2, 4, 6], ts, kt, T, 't');
  return svgA(560, 284, o, '动图：half-line 上 x 等于 3 处的 pulse 分成两半，往左的一半碰到固定端 x 等于 0 后倒过来反弹；左边灰色区域是 odd extension 的虚构部分，它的倒影正好从墙里走出来');
}

// ---------- 第 5 站：parabolic boundary ----------
function maxp() {
  const x0 = 110, x1 = 380, y0 = 230, y1 = 60;
  let o = rect(x0, y1, x1 - x0, y0 - y1, 'wash');
  o += line(x0, y0, x1, y0, 'ln') + line(x0, y0, x0, y1, 'ln') + line(x1, y0, x1, y1, 'ln') + line(x0, y1, x1, y1, 'dash');
  o += text(x0 - 10, y0 + 4, '0', 'ts', 'end') + text(x0 - 10, y1 + 4, 'T', 'ts', 'end') + text(x0, y0 + 18, '0', 'ts', 'middle') + text(x1, y0 + 18, 'l', 'ts', 'middle');
  o += text((x0 + x1) / 2, y0 + 18, 't = 0：initial data', 'tl', 'middle');
  o += text(x0 - 14, (y0 + y1) / 2, 'x = 0', 'tl', 'end') + text(x1 + 14, (y0 + y1) / 2, 'x = l', 'tl');
  o += text((x0 + x1) / 2, y1 - 8, 't = T（不在 parabolic boundary 里）', 'ts', 'middle');
  o += circle(190, 140, 4, 'ink-f') + text(198, 136, '假设 max 在内部', 't') + text(198, 154, 'v_xx ≤ 0，v_t = 0', 'ts');
  o += circle(290, y1, 4, 'ink-f') + text(290, y1 + 18, '或在顶边：v_xx ≤ 0，v_t ≥ 0', 'ts', 'middle');
  o += text(280, 280, '彩色的三条边是 parabolic boundary：max 和 min 一定能在这里取到', 'ts', 'middle');
  return svg(560, 290, o, 'x–t plane 上的长方形 0 到 l 乘 0 到 T；底边和两条侧边构成 parabolic boundary，顶边不算');
}

// box 初值的扩散：背景是几个固定时刻，前景动
function kernelA() {
  const sx = lin(-4, 4, 50, 380), sy = lin(0, 1.1, 210, 40);
  let o = axes({ sx, sy, x0: -4, x1: 4, y0: 0, y1: 1.1, xt: [[-4, '−4'], [-2, '−2'], [-1, '−1'], 0, 1, 2, 4], yt: [0, 0.5, 1], xl: 'x' });
  for (const t of [0.01, 0.25, 1, 4]) o += path(curve((x) => boxHeat(x, t), -4, 4, sx, sy, 200), 'grid');
  o += path(d([[sx(-4), sy(0)], [sx(-1), sy(0)], [sx(-1), sy(1)], [sx(1), sy(1)], [sx(1), sy(0)], [sx(4), sy(0)]]), 'dash');
  const N = 60, T = 7;
  const ts = [], kt = [];
  for (let i = 0; i <= N; i++) { const s = i / N; ts.push(Math.max(1e-4, 4 * s * s)); kt.push(s * (6 / T)); }
  ts.push(4); kt.push(1);
  o += apath(ts.map((t) => curve((x) => boxHeat(x, t), -4, 4, sx, sy, 100)), kt, T, 'ln');
  o += acircle(ts.map(() => sx(0)), ts.map((t) => sy(boxHeat(0, t))), kt, T, 4.5, 'ln-f');
  o += acircle(ts.map(() => sx(2)), ts.map((t) => sy(boxHeat(2, t))), kt, T, 4, 'ink-f');
  o += text(50, 22, 'u_t = u_xx，u(x, 0) = 1（|x| < 1），其余为 0', 'tb');
  const X = 404, row = (y, a, b, c, cls = 'ts') => text(X, y, a, cls) + text(X + 52, y, b, cls) + text(X + 104, y, c, cls);
  o += text(X, 56, '细线：t = 0.01、0.25、1、4', 'ts');
  o += row(86, 't', 'x = 0', 'x = 2', 'tb');
  o += row(106, '0.25', boxHeat(0, 0.25).toFixed(3), boxHeat(2, 0.25).toFixed(3));
  o += row(124, '1', boxHeat(0, 1).toFixed(3), boxHeat(2, 1).toFixed(3));
  o += row(142, '1.82', boxHeat(0, 1.82).toFixed(3), boxHeat(2, 1.82).toFixed(3));
  o += row(160, '4', boxHeat(0, 4).toFixed(3), boxHeat(2, 4).toFixed(3));
  o += text(X, 190, '彩点 x = 0 一路下降；', 'ts') + text(X, 206, '黑点 x = 2 先升后降。', 'ts');
  o += slider(120, 330, 252, 0, 4, [0, 1, 2, 3, 4], ts, kt, T, 't');
  return svgA(560, 272, o, '动图：高 1 宽 2 的 box 在 heat equation 下摊开，中心的值从 1 降到 0.276，x 等于 2 处的值先从 0 涨到 0.242 再下降；背景细线是 t 等于 0.01、0.25、1、4 时的形状');
}

// ---------- 第 6 站：S(x, t) → δ ----------
function delta() {
  const sx = lin(-3, 3, 50, 360), sy = lin(-1.05, 3, 250, 30);
  let o = axes({ sx, sy, x0: -3, x1: 3, y0: -1.05, y1: 3, xt: [[-3, '−3'], [-2, '−2'], [-1, '−1'], 0, 1, 2, 3], yt: [[-1, '−1'], 0, 1, 2, 3], xAt: 0 });
  o += path(curve(Math.cos, -3, 3, sx, sy), 'dash');
  const S = (t) => (x) => Math.exp(-(x * x) / (4 * t)) / Math.sqrt(4 * Math.PI * t);
  for (const [t, cls] of [[1, 'mute'], [0.1, 'ink'], [0.01, 'ln']]) o += path(curve((x) => Math.min(S(t)(x), 3), -3, 3, sx, sy, 800), cls);
  o += text(sx(0) + 8, sy(2.82) + 4, 't = 0.01，peak 2.82', 'tl');
  o += lab(sx(1.0) + 6, sy(0.9), 't = 0.1，peak 0.89', 't');
  o += text(sx(1.7), sy(0.38), 't = 1', 'ts');
  o += text(sx(-2.9), sy(2.7), '虚线：φ(x) = cos x', 'ts');
  const X = 390;
  o += text(X, 60, '∫ S(x, t) cos x dx', 'tb') + text(X, 82, '= e^(−t)：', 't');
  o += text(X, 112, 't = 1：0.368', 't') + text(X, 132, 't = 0.1：0.905', 't') + text(X, 152, 't = 0.01：0.990', 't') + text(X, 180, '→ cos 0 = 1', 'tl');
  o += text(X, 216, '每条 curve 下的 area', 'ts') + text(X, 232, '都是 1。', 'ts');
  return svg(560, 270, o, 'Heat kernel S(x, t) 在 t 等于 1、0.1、0.01 时越来越窄越来越高，与 cos x 的 integral 等于 e 的负 t 次方，趋于 cos 0 等于 1');
}


// ---------- 第 1 站：data 给在 characteristic 上 ----------
function baddata() {
  const sx = lin(-1, 4, 50, 340), sy = lin(-1, 2.6, 280, 30);
  let o = axes({ sx, sy, x0: -1, x1: 4, y0: -1, y1: 2.6, xt: [[-1, '−1'], 1, 2, 3, 4], yt: [[-1, '−1'], 1, 2], xl: 'x', yl: 'y', xAt: 0, yAt: 0 });
  // 3u_x + 2u_y = 0：characteristic 2x − 3y = c，direction (3, 2)
  for (let c = -8; c <= 8; c += 1) {
    const pts = [];
    for (let i = 0; i <= 60; i++) { const x = -1 + (5 * i) / 60, y = (2 * x - c) / 3; if (y >= -1 && y <= 2.6) pts.push([sx(x), sy(y)]); }
    if (pts.length > 1 && c !== 0) o += path(d(pts), 'grid');
  }
  o += line(sx(-1), sy(0), sx(4), sy(0), 'ink-b');
  o += line(sx(-1), sy(-2 / 3), sx(3.9), sy(2.6), 'ln');
  o += lab(sx(3.55) - 8, sy(2.25), 'y = 2x/3', 'tl', 'end');
  o += lab(sx(4) - 2, sy(0) - 8, 'y = 0', 'tb', 'end');
  const X = 366;
  o += text(X, 50, '3u_x + 2u_y = 0', 'tb') + text(X, 70, '细线：2x − 3y = constant', 'ts');
  o += text(X, 104, 'data 给在 y = 0（粗线）：', 't') + text(X, 122, '每条细线恰好穿过它一次，', 't') + text(X, 140, 'u 处处被定下来。', 't');
  o += text(X, 176, 'data 给在 y = 2x/3（彩线）：', 'tl') + text(X, 194, '它本身就是一条细线，', 't') + text(X, 212, '上面 u 只能是 constant；', 't') + text(X, 230, '其余细线一条也没碰到，', 't') + text(X, 248, '那里的 u 没人管。', 't');
  return svg(560, 300, o, '3u_x 加 2u_y 等于 0 的 characteristic 是斜率 2/3 的一族直线；data 给在 x 轴上时每条线穿过一次，给在 y 等于 2x/3 上时这条线本身就是 characteristic');
}

// ---------- 第 2 站：u_t + 5u_x = 0 在 0 < x < 1 上，条件给多了 ----------
function strip() {
  const sx = lin(-0.1, 1.1, 70, 330), st = lin(0, 0.5, 270, 40);
  let o = rect(sx(0), st(0.5), sx(1) - sx(0), st(0) - st(0.5), 'wash');
  o += axes({ sx, sy: st, x0: -0.1, x1: 1.1, y0: 0, y1: 0.5, xt: [0, 0.5, 1], yt: [0, 0.1, 0.2, 0.3, 0.4, 0.5], xl: 'x', yl: 't', yAt: -0.1 });
  for (let c = -2.4; c <= 0.95; c += 0.2) {
    const xa = Math.max(0, c), ta = (xa - c) / 5, xb = Math.min(1, c + 2.5), tb = (xb - c) / 5;
    if (tb > ta) o += arrow(sx(xa), st(ta), sx(xb), st(Math.min(tb, 0.5)), Math.abs(c) < 1e-9 ? 'ink-b' : 'mute', 5);
  }
  o += line(sx(0), st(0), sx(1), st(0), 'ink-b') + line(sx(0), st(0), sx(0), st(0.5), 'ink-b') + line(sx(1), st(0), sx(1), st(0.5), 'ln');
  o += text(sx(0.5), st(0) + 40, 'u(x, 0) = 0', 'tb', 'middle');
  o += text(sx(0) - 8, st(0.42), 'u(0, t) = 0', 'tb', 'end');
  o += text(sx(1) + 8, st(0.42), 'u(1, t) = 1 ?', 'tl');
  o += lab(sx(0.62), st(0.03), 'x − 5t = 0', 'ts');
  const X = 372;
  o += text(X, 120, '每条 characteristic 从', 't') + text(X, 138, '底边或左边进来，带着', 't') + text(X, 156, 'u = 0 走到右边。', 't');
  o += text(X, 192, '右边的值已经被定成 0，', 'tl') + text(X, 210, '再要求 u(1, t) = 1', 'tl') + text(X, 228, '就没有 solution。', 'tl');
  return svg(560, 318, o, 'Strip 0 小于 x 小于 1 上 u_t 加 5u_x 等于 0 的 characteristic 都向右上方走，从底边和左边进入、从右边离开；右边再给条件就和 characteristic 带来的值冲突');
}

// ---------- 第 6 站：Dirichlet heat，u(x, 0) = x ----------
function sepheatA() {
  const U = (x, t, M = 160) => { let s = 0; for (let m = 1; m <= M; m++) s += ((2 * (m % 2 ? 1 : -1)) / (m * Math.PI)) * Math.exp(-m * m * Math.PI * Math.PI * t) * Math.sin(m * Math.PI * x); return s; };
  const one = (x, t) => (2 / Math.PI) * Math.exp(-Math.PI * Math.PI * t) * Math.sin(Math.PI * x);
  const sx = lin(0, 1, 50, 330), sy = lin(-0.08, 1.08, 230, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -0.08, y1: 1.08, xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.5, 1], xl: 'x', xAt: 0 });
  o += line(sx(0), sy(0), sx(1), sy(1), 'grid');
  const N = 50, T = 7, ts = [], kt = [];
  for (let i = 0; i <= N; i++) { const s = i / N; ts.push(0.0004 + 0.3 * s * s); kt.push(s * (6 / T)); }
  ts.push(ts[N]); kt.push(1);
  o += apath(ts.map((t) => curve((x) => one(x, t), 0, 1, sx, sy, 40)), kt, T, 'dash');
  o += apath(ts.map((t, i) => curve((x) => U(x, t), 0, 1, sx, sy, i < 6 ? 220 : 60)), kt, T, 'ln');
  o += acircle(ts.map(() => sx(0.5)), ts.map((t) => sy(U(0.5, t))), kt, T, 4.5, 'ln-f');
  o += text(sx(0.03), sy(0.92), '细线：u(x, 0) = x', 'ts');
  const X = 356;
  o += text(X, 56, 'u_t = u_xx，两端 u = 0', 'tb', 'start');
  o += text(X, 84, '彩线：series 的和', 't') + text(X, 102, '虚线：只留 m = 1 一项', 't');
  o += text(X, 136, 'x = 0.5 处：', 'ts') + text(X, 154, `t = 0.05：${U(0.5, 0.05).toFixed(3)} vs ${one(0.5, 0.05).toFixed(3)}`, 'ts') + text(X, 172, `t = 0.1：${U(0.5, 0.1).toFixed(4)} vs ${one(0.5, 0.1).toFixed(4)}`, 'ts');
  o += text(X, 206, 'm = 2 那项相对第一项多一个', 'ts') + text(X, 222, `factor ½e^(−3π²t)：t = 0.1 时 ${(0.5 * Math.exp(-3 * Math.PI * Math.PI * 0.1)).toFixed(3)}`, 'ts');
  o += slider(110, 300, 262, 0, 0.3, [0, 0.1, 0.2, 0.3], ts, kt, T, 't');
  return svgA(560, 282, o, '动图：rod 两端温度固定为 0，初始温度 u 等于 x；series 的和很快变成一个 sine 形的拱并整体 decay，虚线只留第一项，t 到 0.1 以后两者几乎重合');
}
function sliderX(x0, x1, y, t0, t1, ticks, ts, kt, T, label) {
  const sx = lin(t0, t1, x0, x1);
  let o = line(x0, y, x1, y, 'axis');
  for (const [v, s] of ticks) o += line(sx(v), y - 4, sx(v), y + 4, 'axis') + text(sx(v), y + 17, s, 'ts', 'middle');
  o += acircle(ts.map(sx), ts.map(() => y), kt, T, 5.5, 'ln-f');
  if (label) o += text(x0 - 10, y + 4, label, 'ts', 'end');
  return o;
}

// ---------- 第 6 站：(0, π) 上的 string，ψ = 1 ----------
function strikeA() {
  // odd 2π-periodic extension 的 ψ 的 antiderivative：triangle wave，Ψ(0) = 0，Ψ(π) = π
  const Psi = (s) => { const r = ((((s + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI; return Math.abs(r); };
  const U = (x, t) => 0.5 * (Psi(x + t) - Psi(x - t));
  const sx = lin(0, Math.PI, 70, 400), sy = lin(-1.75, 1.75, 240, 40);
  let o = line(sx(0), sy(0), sx(Math.PI), sy(0), 'axis');
  for (const [v, s] of [[0, '0'], [Math.PI / 4, 'π/4'], [Math.PI / 2, 'π/2'], [(3 * Math.PI) / 4, '3π/4'], [Math.PI, 'π']]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, s, 'ts', 'middle');
  o += line(sx(0), sy(-1.6), sx(0), sy(1.6), 'axis') + line(sx(Math.PI), sy(-1.6), sx(Math.PI), sy(1.6), 'axis');
  for (const [v, s] of [[Math.PI / 2, 'π/2'], [-Math.PI / 2, '−π/2']]) o += line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, s, 'ts', 'end');
  o += circle(sx(0), sy(0), 4, 'ink-f') + circle(sx(Math.PI), sy(0), 4, 'ink-f');
  const N = 72, T = 8, ts = [], kt = [];
  for (let i = 0; i <= N; i++) { ts.push(Math.PI / 2 + (2 * Math.PI * i) / N); kt.push(i / N); }
  o += apath(ts.map((t) => pw((x) => U(x, t), 0, Math.PI, [-t, t, Math.PI - t, Math.PI + t, 2 * Math.PI - t, t - Math.PI], sx, sy, 8)), kt, T, 'ln');
  o += acircle(ts.map(() => sx(Math.PI / 2)), ts.map((t) => sy(U(Math.PI / 2, t))), kt, T, 4, 'ln-f');
  o += text(70, 22, 'u(0, t) = u(π, t) = 0，u(x, 0) = 0，u_t(x, 0) = 1，c = 1', 'tb');
  const X = 430;
  o += text(X, 70, 'x = π/2 处（彩点）：', 'ts') + text(X, 90, 't = 0.5：0.5', 'ts') + text(X, 108, 't = π/2：π/2 ≈ 1.571', 'ts') + text(X, 126, 't = π：0', 'ts') + text(X, 144, 't = 2π：回到 0', 'ts');
  o += text(X, 180, '中间先是一段平台', 'ts') + text(X, 196, '以 speed 1 往上走，', 'ts') + text(X, 212, '两端的固定点把', 'ts') + text(X, 228, '它拉成梯形。', 'ts');
  o += sliderX(120, 360, 272, Math.PI / 2, 2.5 * Math.PI, [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [1.5 * Math.PI, '3π/2'], [2 * Math.PI, '2π'], [2.5 * Math.PI, '5π/2']], ts, kt, T, 't');
  return svgA(560, 294, o, '动图：两端固定的 string 在 0 到 pi 上被均匀地往上打了一下；静止画面是 t 等于 pi/2 时的梯形，中点高 pi/2；之后变平、向下、再回来，周期 2 pi');
}

// ---------- 第 6 站：Robin condition 的 eigenvalue ----------
function robin() {
  const sx = lin(0, 9, 60, 380), sy = lin(-10, 6, 270, 30);
  let o = axes({ sx, sy, x0: 0, x1: 9, y0: -10, y1: 6, xt: [0, [Math.PI / 2, 'π/2'], [Math.PI, 'π'], [1.5 * Math.PI, '3π/2'], [2 * Math.PI, '2π'], [2.5 * Math.PI, '5π/2']], yt: [[-10, '−10'], [-5, '−5'], 0, 5], xl: 'β' });
  o += line(sx(0), sy(0), sx(9), sy(0), 'axis');
  for (let k = 0; k <= 2; k++) {
    const a = k === 0 ? 0 : (k - 0.5) * Math.PI + 0.02, b = (k + 0.5) * Math.PI - 0.02;
    const pts = [];
    for (let i = 0; i <= 200; i++) { const x = a + ((b - a) * i) / 200, y = Math.tan(x); if (y >= -10 && y <= 6 && x <= 9) pts.push([sx(x), sy(y)]); }
    o += path(d(pts), 'ink');
  }
  for (const v of [0.5, 1.5, 2.5]) o += line(sx(v * Math.PI), sy(-10), sx(v * Math.PI), sy(6), 'dash');
  o += line(sx(0), sy(0), sx(9), sy(-9), 'ln');
  const roots = [];
  for (let k = 1; k <= 3; k++) { let lo = (k - 0.5) * Math.PI + 1e-9, hi = k * Math.PI; for (let it = 0; it < 80; it++) { const m = (lo + hi) / 2; (Math.sin(m) + m * Math.cos(m)) * (Math.sin(lo) + lo * Math.cos(lo)) <= 0 ? (hi = m) : (lo = m); } roots.push((lo + hi) / 2); }
  roots.forEach((r, i) => { if (-r >= -10) { o += circle(sx(r), sy(-r), 4.5, 'ln-f'); o += lab(sx(r) + 8, sy(-r) - 9, `β${['₁', '₂', '₃'][i]} = ${r.toFixed(3)}`, 'tl'); } });
  o += text(sx(0.15), sy(4.6), 'tan β', 'ts');
  o += text(sx(6.05), sy(-6.05) + 22, 'y = −β', 'tl', 'end');
  const X = 400;
  o += text(X, 60, 'X(0) = 0，X′(1) + X(1) = 0', 'tb');
  o += text(X, 88, 'X = sin βx 代进去：', 't') + text(X, 106, 'β cos β + sin β = 0，', 't') + text(X, 124, '即 tan β = −β。', 't');
  o += text(X, 158, 'λ = β²：', 't') + text(X, 176, roots.map((r) => (r * r).toFixed(2)).join('，') + '…', 't');
  o += text(X, 210, '第 n 个 root 在 (n − ½)π', 'ts') + text(X, 226, '和 nπ 之间，越来越靠近', 'ts') + text(X, 242, '(n − ½)π。', 'ts');
  return svg(560, 312, o, 'tan beta 的各个 branch 与直线 y 等于负 beta 的交点给出 Robin condition 下的 eigenvalue，前三个 beta 约为 2.029、4.913、7.979');
}

// ---------- 第 7 站：三种 extension ----------
function ext() {
  let o = '';
  const row = (y0, title, fn, jumps, mid, note) => {
    const sx = lin(-3, 3, 60, 400), sy = lin(-1.3, 3, y0 + 70, y0);
    o += line(sx(-3), sy(0), sx(3), sy(0), 'axis');
    for (const v of [-3, -2, -1, 0, 1, 2, 3]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 15, v < 0 ? '−' + -v : String(v), 'ts', 'middle');
    o += rect(sx(0), y0 - 2, sx(1) - sx(0), 74, 'wash');
    // 分段画，跳处断开
    const cuts = [-3, ...jumps.filter((j) => j > -3 && j < 3), 3];
    for (let k = 0; k + 1 < cuts.length; k++) o += path(curve(fn, cuts[k] + 1e-6, cuts[k + 1] - 1e-6, sx, sy, 120), 'ln');
    for (const j of jumps) if (j > -3 && j < 3) o += circle(sx(j), sy(mid), 3.5, 'ink-f');
    o += text(420, y0 + 20, title, 'tb') + text(420, y0 + 40, note, 'ts');
  };
  const odd = (x) => { const r = ((((x + 1) % 2) + 2) % 2) - 1; return r; };
  const even = (x) => Math.abs(odd(x));
  const ex = (x) => Math.exp(odd(x));
  row(16, 'sine series', odd, [-3, -1, 1, 3], 0, '跳处 → 0');
  row(120, 'cosine series', even, [], 0, '没有跳，uniform');
  row(224, 'e^x 的 full series', ex, [-3, -1, 1, 3], Math.cosh(1), `跳处 → cosh 1 = ${Math.cosh(1).toFixed(3)}`);
  o += text(230, 318, '浅色：data 所在的 (0, 1)（第三行的 data 在 (−1, 1) 上）', 'ts', 'middle') + text(230, 334, '黑点：series 在跳处 converge 到的值', 'ts', 'middle');
  return svg(560, 340, o, '三种 extension：x 在 0 到 1 上的 odd periodic extension 是有跳的 sawtooth，even periodic extension 是连续的 triangle wave，e 的 x 次方在 −1 到 1 上的 periodic extension 在 ±1 处有跳，series 在跳处 converge 到两侧的 average');
}

// ---------- 第 7 站：Gibbs ----------
function gibbsA() {
  const S = (x, N) => { let s = 0; for (let n = 1; n <= N; n += 2) s += Math.sin(n * x) / n; return (4 / Math.PI) * s; };
  const sx = lin(0, Math.PI, 60, 420), sy = lin(-0.1, 1.35, 230, 40);
  let o = axes({ sx, sy, x0: 0, x1: Math.PI, y0: -0.1, y1: 1.35, xt: [[0, '0'], [Math.PI / 4, 'π/4'], [Math.PI / 2, 'π/2'], [(3 * Math.PI) / 4, '3π/4'], [Math.PI, 'π']], yt: [0, 0.5, 1], xl: 'x', xAt: 0 });
  o += line(sx(0), sy(1), sx(Math.PI), sy(1), 'grid');
  o += line(sx(0), sy(1.179), sx(Math.PI), sy(1.179), 'dash');
  o += text(sx(Math.PI) + 6, sy(1.179) + 4, '1.179', 'ts');
  o += text(sx(Math.PI) + 6, sy(1) + 4, '1', 'ts');
  const Ns = []; for (let N = 1; N <= 61; N += 4) Ns.push(N);
  const T = 7.5, step = 6 / Ns.length, kt = [], seq = [];
  Ns.forEach((N, i) => { kt.push((i * step) / T); seq.push(i); });
  kt.push(1); seq.push(Ns.length - 1);
  o += apath(seq.map((i) => curve((x) => S(x, Ns[i]), 0, Math.PI, sx, sy, 90 + 7 * Ns[i])), kt, T, 'ln', true);
  // 每个 N 的 peak 位置与高度
  const peak = (N) => { let bx = 0, bv = -1; for (let i = 1; i <= 4000; i++) { const x = (Math.PI / 2) * (i / 4000); const v = S(x, N); if (v > bv) { bv = v; bx = x; } } return [bx, bv]; };
  const P = Ns.map(peak);
  o += `<circle cx="${f1(sx(P[0][0]))}" cy="${f1(sy(P[0][1]))}" r="4" class="ink-f">${anim('cx', seq.map((i) => f1(sx(P[i][0]))), kt, T, true)}${anim('cy', seq.map((i) => f1(sy(P[i][1]))), kt, T, true)}</circle>`;
  Ns.forEach((N, i) => {
    const on = seq.map((j) => j === i);
    o += `<g opacity="${i === 0 ? 1 : 0}">${text(450, 150, `N = ${N}`, 'tb')}${text(450, 170, `peak ${P[i][1].toFixed(4)}`, 't')}${text(450, 188, `在 x = ${P[i][0].toFixed(3)}`, 'ts')}${ashow(on, kt, T)}</g>`;
  });
  o += text(450, 40, 'φ ≡ 1 在 (0, π) 上', 'ts') + text(450, 56, '的 sine series 的', 'ts') + text(450, 72, 'partial sum S_N。', 'ts');
  o += text(450, 220, 'peak 往 x = 0 挤，', 'ts') + text(450, 236, '高度不降到 1。', 'ts');
  return svgA(560, 252, o, '动图：constant 1 在 0 到 pi 上的 sine series 的 partial sum，项数从 1 增加到 61；中间越来越平，但靠近 x 等于 0 处的 peak 一直停在约 1.179，只是越来越窄');
}

// ---------- 第 8 站：marching squares 画 level curve ----------
function contour(F, x0, x1, y0, y1, n, levels, sx, sy) {
  const out = {};
  const hx = (x1 - x0) / n, hy = (y1 - y0) / n;
  const V = [];
  for (let i = 0; i <= n; i++) { V.push([]); for (let j = 0; j <= n; j++) V[i].push(F(x0 + i * hx, y0 + j * hy)); }
  for (const c of levels) {
    let dd = '';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const P = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
      const pts = [];
      for (let k = 0; k < 4; k++) {
        const [a, b] = [P[k], P[(k + 1) % 4]];
        const va = V[a[0]][a[1]], vb = V[b[0]][b[1]];
        if (!Number.isFinite(va) || !Number.isFinite(vb)) continue;
        if ((va - c) * (vb - c) < 0) {
          const s = (c - va) / (vb - va);
          pts.push([x0 + (a[0] + s * (b[0] - a[0])) * hx, y0 + (a[1] + s * (b[1] - a[1])) * hy]);
        }
      }
      if (pts.length >= 2) dd += `M${f1(sx(pts[0][0]))} ${f1(sy(pts[0][1]))}L${f1(sx(pts[1][0]))} ${f1(sy(pts[1][1]))}`;
      if (pts.length === 4) dd += `M${f1(sx(pts[2][0]))} ${f1(sy(pts[2][1]))}L${f1(sx(pts[3][0]))} ${f1(sy(pts[3][1]))}`;
    }
    out[c] = dd;
  }
  return out;
}

// 正方形 plate：上边 1，其余三边 0
function rectPlate() {
  const U = (x, y) => { if (y >= Math.PI - 1e-9) return 1; let s = 0; for (let n = 1; n <= 81; n += 2) s += (4 / (n * Math.PI)) * Math.exp(n * (y - Math.PI)) * ((1 - Math.exp(-2 * n * y)) / (1 - Math.exp(-2 * n * Math.PI))) * Math.sin(n * x); return s; };
  const L = 250, x0 = 70, y0 = 30;
  const sx = lin(0, Math.PI, x0, x0 + L), sy = lin(0, Math.PI, y0 + L, y0);
  let o = rect(x0, y0, L, L, 'paper');
  const lv = [0.05, 0.1, 0.25, 0.5, 0.75];
  const C = contour(U, 0, Math.PI, 0, Math.PI - 0.002, 90, lv, sx, sy);
  for (const c of lv) o += path(C[c], c === 0.25 ? 'ln' : 'mute');
  o += line(x0, y0, x0 + L, y0, 'ln');
  o += text(x0 + L / 2, y0 - 8, 'u = 1', 'tl', 'middle') + text(x0 + L / 2, y0 + L + 18, 'u = 0', 'tb', 'middle');
  o += text(x0 - 8, y0 + L / 2, 'u = 0', 'tb', 'end') + text(x0 + L + 8, y0 + L / 2, 'u = 0', 'tb');
  o += circle(sx(Math.PI / 2), sy(Math.PI / 2), 4, 'ink-f');
  // 等值线标签：放在 x = π/2 那条竖线上，略偏右
  const yAt = (c) => { let lo = 0, hi = Math.PI - 0.002; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; U(Math.PI / 2, m) < c ? (lo = m) : (hi = m); } return (lo + hi) / 2; };
  for (const c of [0.05, 0.1, 0.5, 0.75]) o += text(sx(Math.PI / 2) + 6, sy(yAt(c)) - 3, String(c), 'ts');
  o += text(sx(Math.PI / 2) + 8, sy(Math.PI / 2) + 14, 'u = 0.25', 'tl');
  const X = 360;
  o += text(X, 60, 'Δu = 0 在 (0, π)² 里', 'tb');
  o += text(X, 88, '细线是 u 的 level curve：', 't') + text(X, 106, '0.05、0.1、0.25、0.5、0.75', 't');
  o += text(X, 142, `中心 u(π/2, π/2) = ${U(Math.PI / 2, Math.PI / 2).toFixed(4)}`, 't');
  o += text(X, 178, '把 1 轮流放到四条边上，', 'ts') + text(X, 194, '四个 solution 加起来是 Δv = 0、', 'ts') + text(X, 210, '边上 v ≡ 1 的 solution，即 v ≡ 1；', 'ts') + text(X, 226, '由 symmetry 四个在中心相等，', 'ts') + text(X, 242, '所以每个是 1/4。', 'ts');
  return svg(560, 300, o, '正方形 plate 上边温度 1、其余三边 0 时的 steady state：level curve 从上边往下排开，中心的值是 0.25');
}

// disk：上半圆 1，下半圆 0
function diskPlate() {
  const R = 120, C = [170, 160];
  const P = (x, y) => [C[0] + R * x, C[1] - R * y];
  let o = circle(C[0], C[1], R, 'paper');
  // 上半圆 boundary 加粗
  const arc = (a0, a1, cls) => { const pts = []; for (let i = 0; i <= 80; i++) { const a = a0 + ((a1 - a0) * i) / 80; pts.push(P(Math.cos(a), Math.sin(a))); } o += path(d(pts), cls); };
  arc(0, Math.PI, 'ln');
  // level curve u = c：圆心 (0, −1/T)、过 (±1, 0) 的 circle arc，T = tan(π(c − ½))
  for (const c of [0.1, 0.25, 0.5, 0.75, 0.9]) {
    if (c === 0.5) { o += line(C[0] - R, C[1], C[0] + R, C[1], 'mute'); continue; }
    const T = Math.tan(Math.PI * (c - 0.5)), cy = -1 / T, rr = Math.sqrt(1 + 1 / (T * T));
    const pts = [];
    for (let i = 0; i <= 200; i++) { const x = -1 + (2 * i) / 200; const y = cy + (T > 0 ? 1 : -1) * Math.sqrt(Math.max(0, rr * rr - x * x)); if (x * x + y * y <= 1.0001) pts.push(P(x, y)); }
    o += path(d(pts), 'mute');
    const yt = cy + (T > 0 ? 1 : -1) * rr;
    o += text(C[0] + 6, P(0, yt)[1] - 3, String(c), 'ts');
  }
  o += circle(C[0], C[1], 4, 'ink-f') + text(C[0] - 8, C[1] + 16, '0.5', 'tb', 'end');
  o += circle(...P(0, 0.5), 4, 'ln-f') + text(P(0, 0.5)[0] - 8, P(0, 0.5)[1] - 2, '(0, 0.5)', 'tl', 'end');
  o += text(C[0], C[1] - R - 10, 'h = 1', 'tl', 'middle') + text(C[0], C[1] + R + 20, 'h = 0', 'tb', 'middle');
  const X = 318;
  o += text(X, 50, 'Δu = 0 在 unit disk 里', 'tb');
  o += text(X, 76, 'boundary：上半圆 1，下半圆 0', 't');
  o += text(X, 104, '细线：level curve，全是', 't') + text(X, 122, '过 (±1, 0) 的 circle arc', 't');
  o += text(X, 156, '中心：boundary 的 average = 0.5', 't');
  o += text(X, 182, `(0, 0.5)：½ + (1/π)·arctan(4/3)`, 't') + text(X, 200, `= ${(0.5 + Math.atan(4 / 3) / Math.PI).toFixed(4)}`, 'tl');
  o += text(X, 236, '靠近 (±1, 0) 时 level curve', 'ts') + text(X, 252, '挤在一起：h 在那里跳。', 'ts');
  return svg(560, 300, o, 'Unit disk 上半圆 boundary 温度 1、下半圆 0 时的 harmonic function：level curve 都是经过点 (正负 1, 0) 的圆弧，中心值 0.5，点 (0, 0.5) 处约 0.795');
}

// method of images：half-plane 与 disk
function images() {
  let o = '';
  // 左：half-plane y > 0
  const s = 52, O = [140, 170];
  const P = ([x, y]) => [O[0] + s * x, O[1] - s * y];
  o += rect(20, 40, 240, 130, 'wash');
  o += line(20, O[1], 260, O[1], 'ink-b');
  const x0 = [-0.6, 1.3], x0s = [-0.6, -1.3], q = [1.1, 0];
  o += line(...P(x0), ...P(q), 'mute') + line(...P(x0s), ...P(q), 'dash');
  o += circle(...P(x0), 4.5, 'ln-f') + circle(...P(x0s), 4.5, 'paper') + circle(...P(q), 3.5, 'ink-f');
  o += text(P(x0)[0] - 8, P(x0)[1] - 6, 'x₀', 'tl', 'end') + text(P(x0s)[0] - 8, P(x0s)[1] + 4, 'x₀* = (x₀₁, −x₀₂)', 'ts', 'end');
  o += text(P(q)[0] + 6, P(q)[1] + 16, 'y 在 boundary 上', 'ts');
  const dq = Math.hypot(x0[0] - q[0], x0[1] - q[1]);
  o += text(140, 30, 'half-plane：|y − x₀| = |y − x₀*|', 'tb', 'middle');
  o += text(140, 262, `两段长度都是 ${dq.toFixed(3)}`, 'ts', 'middle');
  // 右：unit disk
  const R = 78, C = [370, 160];
  const Q = ([x, y]) => [C[0] + R * x, C[1] - R * y];
  o += circle(C[0], C[1], R, 'wash');
  o += circle(C[0], C[1], R, 'frame');
  const z0 = [0.5, 0], z0s = [2, 0], sg = [0.5, Math.sqrt(3) / 2];
  o += line(C[0], C[1], ...Q(z0s), 'grid');
  o += line(...Q(z0), ...Q(sg), 'mute') + line(...Q(z0s), ...Q(sg), 'dash');
  o += circle(...Q(z0), 4.5, 'ln-f') + circle(...Q(z0s), 4.5, 'paper') + circle(...Q(sg), 3.5, 'ink-f') + circle(C[0], C[1], 2.5, 'ink-f');
  o += text(Q(z0)[0], Q(z0)[1] + 18, 'x₀ = (0.5, 0)', 'tl', 'middle');
  o += text(Q(z0s)[0], Q(z0s)[1] + 18, 'x₀* = (2, 0)', 'ts', 'middle');
  o += text(Q(sg)[0] + 6, Q(sg)[1] - 6, 'y = (½, √3/2)', 'ts');
  const a1 = Math.hypot(sg[0] - z0[0], sg[1] - z0[1]), a2 = Math.hypot(sg[0] - z0s[0], sg[1] - z0s[1]);
  o += text(420, 30, 'unit disk：x₀* = x₀/|x₀|²', 'tb', 'middle');
  o += text(420, 262, `|y − x₀| = ${a1.toFixed(3)}，|y − x₀*| = ${a2.toFixed(3)}`, 'ts', 'middle');
  o += text(420, 280, '比值恒为 1/|x₀| = 2', 'ts', 'middle');
  return svg(560, 290, o, '左：half-plane 上 x0 关于 boundary 的 mirror image，boundary 上任一点到两者距离相等；右：unit disk 中 x0 等于 (0.5, 0) 的 image 是 (2, 0)，circle 上任一点到 image 的距离恒为到 x0 的两倍');
}

export const part1 = {
  'ma4221-twoeq': twoeq,
  'ma4221-transport': transportA,
  'ma4221-charcurve': charcurve,
  'ma4221-baddata': baddata,
  'ma4221-string': string,
  'ma4221-rod': rod,
  'ma4221-strip': strip,
  'ma4221-hadamard': hadamard,
  'ma4221-regions': regions,
  'ma4221-charfam': charfam,
  'ma4221-pluck': pluckA,
  'ma4221-cone': cone,
  'ma4221-reflect': reflectA,
  'ma4221-maxp': maxp,
  'ma4221-kernel': kernelA,
  'ma4221-delta': delta,
  'ma4221-sepheat': sepheatA,
  'ma4221-strike': strikeA,
  'ma4221-robin': robin,
  'ma4221-ext': ext,
  'ma4221-gibbs': gibbsA,
  'ma4221-rect': rectPlate,
  'ma4221-disk': diskPlate,
  'ma4221-images': images,
};

export default { ...part1 };
