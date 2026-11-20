import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// ---------- 共用的数值工具 ----------
// 可复现的 pseudo-random：mulberry32 + Box–Muller
function rng(seed) {
  let a = seed >>> 0;
  const uni = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return () => {
    const u1 = Math.max(uni(), 1e-12), u2 = uni();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  };
}
const npdf = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
// standard normal quantile（Acklam 的 rational approximation，精度约 1e-9）
function nppf(p) {
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const dd = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((dd[0] * q + dd[1]) * q + dd[2]) * q + dd[3]) * q + 1); }
  if (p > 1 - pl) { const q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((dd[0] * q + dd[1]) * q + dd[2]) * q + dd[3]) * q + 1); }
  const q = p - 0.5, r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
const quantiles = (n) => Array.from({ length: n }, (_, i) => nppf((i + 0.5) / n));

// 贯穿全页的 1D 例子：p_data = ½N(−2, 0.5²) + ½N(2, 0.5²)，CondOT path：x_t = t z + (1−t) ε
const MU = [-2, 2], S = 0.5;
const vt = (t) => t * t * S * S + (1 - t) ** 2;
function post(x, t) {
  const v = vt(t);
  const l = MU.map((m) => -((x - t * m) ** 2) / (2 * v));
  const mx = Math.max(...l), e = l.map((q) => Math.exp(q - mx)), z = e[0] + e[1];
  return [e[0] / z, e[1] / z];
}
// marginal vector field u_t(x) = E[z − ε | x_t = x]
function uG(x, t) {
  const v = vt(t), w = post(x, t);
  let o = 0;
  MU.forEach((m, k) => { o += w[k] * (m + ((t * S * S - (1 - t)) / v) * (x - t * m)); });
  return o;
}
// marginal score ∇log p_t(x)
function sG(x, t) {
  const v = vt(t), w = post(x, t);
  let o = 0;
  MU.forEach((m, k) => { o += w[k] * (-(x - t * m) / v); });
  return o;
}
const pG = (x, t) => 0.5 * npdf(x, -2 * t, vt(t)) + 0.5 * npdf(x, 2 * t, vt(t));
// 只朝 +2 那个 component 的 field（class y = + 的 guided field）
const uPlus = (x, t) => 2 + ((t * S * S - (1 - t)) / vt(t)) * (x - 2 * t);

// 两点 dataset {−2, +2} 的 exact marginal field
const uTwo = (x, t) => (2 * Math.tanh((2 * t * x) / (1 - t) ** 2) - x) / (1 - t);

function histo(xs, lo, hi, bins) {
  const h = new Array(bins).fill(0), w = (hi - lo) / bins;
  for (const x of xs) { const i = Math.floor((x - lo) / w); if (i >= 0 && i < bins) h[i]++; }
  return h.map((c) => c / (xs.length * w));
}

// ---------- 第 1 站：OU process ----------
function ou() {
  const th = 0.25, sg = 0.5, T = 10, n = 500, h = T / n, D = (sg * sg) / (2 * th);
  const sx = lin(0, T, 60, 400), sy = lin(-10.5, 10.5, 230, 20);
  let o = rect(sx(0), sy(2 * Math.sqrt(D)), sx(T) - sx(0), sy(-2 * Math.sqrt(D)) - sy(2 * Math.sqrt(D)), 'wash');
  o += axes({ sx, sy, x0: 0, x1: T, y0: -10.5, y1: 10.5, xt: [0, 2, 4, 6, 8, 10], yt: [-10, -5, 0, 5, 10], xl: 't', yl: 'X_t' });
  const g = rng(7);
  for (let j = 0; j < 11; j++) {
    const x0 = -10 + 2 * j;
    // σ = 0 的 deterministic curve
    if (j === 0 || j === 10) o += path(curve((t) => x0 * Math.exp(-th * t), 0, T, sx, sy, 120), 'dash');
    let x = x0;
    const pts = [[sx(0), sy(x)]];
    for (let i = 1; i <= n; i++) { x = x - th * x * h + sg * Math.sqrt(h) * g(); pts.push([sx(i * h), sy(x)]); }
    o += path(d(pts), j === 5 ? 'ln' : 'mute');
  }
  o += text(412, sy(2 * Math.sqrt(D)) - 4, '±2√D', 'tl') + text(412, sy(2 * Math.sqrt(D)) + 13, 'D = σ²/(2θ) = 0.5', 'ts');
  o += text(412, 60, 'θ = 0.25，σ = 0.5', 't') + text(412, 80, 'h = 0.02，500 步', 'ts');
  o += text(412, 170, '虚线：σ = 0 时的', 'ts') + text(412, 186, 'x₀e^(−θt)，收缩到 0', 'ts');
  o += text(230, 262, 'Euler–Maruyama，seed 7：drift 往 0 拉，noise 往外推，最后停在一个 distribution 上', 'ts', 'middle');
  return svg(560, 272, o, 'Ornstein–Uhlenbeck process 的 trajectory 从 −10 到 10 的不同起点出发，向 0 收缩后在宽约正负 1.4 的带子里来回抖动');
}

// ---------- 第 2 站：marginal probability path ----------
function paths() {
  const ts = [0, 0.3, 0.6, 0.8, 0.9, 1];
  const sx = lin(-4, 4, 90, 520);
  let o = '';
  ts.forEach((t, i) => {
    const base = 40 + i * 40;
    const sy = (v) => base - v * 38;
    o += line(sx(-4), base, sx(4), base, 'grid');
    o += path(area((x) => pG(x, t), -4, 4, sx, sy, 0, 300), 'wash') + path(curve((x) => pG(x, t), -4, 4, sx, sy, 300), 'ln');
    o += text(80, base - 2, 't = ' + t, 'ts', 'end');
  });
  for (const x of [-2, 0, 2]) o += text(sx(x), 262, String(x).replace('-', '−'), 'ts', 'middle');
  o += text(sx(-3.9), 34, 'p₀ = N(0, 1)', 'ts');
  o += text(sx(-3.9), 40 + 5 * 40 - 6, 'p₁ = p_data', 'ts');
  o += text(300, 286, '每一行是 x_t = t·z + (1−t)·ε 的 density；从 noise 逐渐分成两个 bump', 'ts', 'middle');
  return svg(560, 296, o, 'Marginal probability path 在六个时刻的 density：t 等于 0 时是一个 standard Gaussian，随 t 增大逐渐分裂成位于正负 2 的两个 bump');
}

// 两点 dataset：t = 0.5 时 marginal field 是两个 conditional field 的 posterior weighted average
function avg() {
  const t = 0.5;
  const sx = lin(-3, 3, 60, 360), sy = lin(-11, 11, 210, 20);
  let o = line(sx(-3), sy(0), sx(3), sy(0), 'grid');
  o += axes({ sx, sy, x0: -3, x1: 3, y0: -11, y1: 11, xt: [[-2, '−2'], [0, '0'], [0.6, '0.6'], [2, '2']], yt: [[-10, '−10'], [0, '0'], [10, '10']] });
  o += text(sx(3) + 8, sy(-11) + 4, 'x', 'ts');
  o += path(curve((x) => (2 - x) / (1 - t), -3, 3, sx, sy), 'dash') + path(curve((x) => (-2 - x) / (1 - t), -3, 3, sx, sy), 'dash');
  o += path(curve((x) => uTwo(x, t), -3, 3, sx, sy, 400), 'ln');
  const x = 0.6;
  o += line(sx(x), sy(-11), sx(x), sy(2.8), 'grid');
  o += circle(sx(x), sy(2.8), 3.5, 'ink-f') + circle(sx(x), sy(-5.2), 3.5, 'ink-f') + circle(sx(x), sy(uTwo(x, t)), 4.5, 'ln-f');
  o += text(sx(-2.9), sy(5.2), 'u(x | z = +2)', 'ts') + text(sx(2.95), sy(-4.2), 'u(x | z = −2)', 'ts', 'end');
  o += text(380, 40, 't = 0.5', 'tb') + text(380, 64, '虚线：两个 conditional', 't') + text(380, 82, 'vector field (z − x)/(1 − t)', 'ts');
  o += text(380, 110, '彩线：marginal field', 't') + text(380, 128, '按 posterior weighted average', 'ts');
  o += text(380, 160, '在 x = 0.6（三个点）：', 't') + text(380, 178, '0.992 × 2.8 + 0.008 × (−5.2)', 'ts') + text(380, 196, '= 2.73', 'tl');
  o += text(280, 246, 'x 离哪个 data point 近，marginal field 就几乎等于指向它的那条 conditional field', 'ts', 'middle');
  return svg(560, 256, o, '两点 dataset 在 t 等于 0.5 时的 vector field：两条虚线是分别指向正 2 和负 2 的 conditional vector field，彩色曲线是它们按 posterior 加权的平均');
}

// 两点 dataset：conditional path 会相交，marginal ODE 的 trajectory 不相交
function traj() {
  const sx = lin(0, 1, 60, 380), sy = lin(-3, 3, 240, 20);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -3, y1: 3, xt: [0, 0.5, 1], yt: [[-2, '−2'], [0, '0'], [2, '2']], yl: 'x' });
  o += text(sx(1) + 8, sy(-3) + 4, 't', 'ts');
  // conditional straight lines that cross
  o += line(sx(0), sy(0.8), sx(1), sy(-2), 'dash') + line(sx(0), sy(-0.8), sx(1), sy(2), 'dash');
  const xs = quantiles(14);
  for (const x0 of xs) {
    let x = x0;
    const n = 400, tmax = 0.995, h = tmax / n;
    const pts = [[sx(0), sy(x)]];
    for (let i = 0; i < n; i++) {
      const t = i * h;
      const k1 = uTwo(x, t), k2 = uTwo(x + (h / 2) * k1, t + h / 2), k3 = uTwo(x + (h / 2) * k2, t + h / 2), k4 = uTwo(x + h * k3, t + h);
      x += (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
      pts.push([sx((i + 1) * h), sy(x)]);
    }
    o += path(d(pts), 'ln');
  }
  o += circle(sx(1), sy(2), 4, 'ink-f') + circle(sx(1), sy(-2), 4, 'ink-f');
  o += text(400, 50, '彩线：marginal ODE', 't') + text(400, 68, '14 个起点是 N(0, 1) 的', 'ts') + text(400, 84, '14 个 quantile', 'ts');
  o += text(400, 120, '虚线：两条 conditional', 't') + text(400, 138, 'path（直线），中途相交', 'ts');
  o += text(400, 180, 'ODE 的 solution 唯一，', 'ts') + text(400, 196, 'marginal trajectory', 'ts') + text(400, 212, '不可能相交', 'ts');
  return svg(560, 272, o, '在 t-x 平面上，两点 dataset 的 marginal ODE trajectory 从 15 个起点出发分成两束，分别到达正 2 和负 2，彼此不相交；两条虚线表示的 conditional path 则在中途交叉');
}

// Euler 步数：exact field 下 n = 1, 2, 5, 100
function euler() {
  const xs0 = quantiles(4000);
  const ns = [1, 2, 5, 100];
  let o = '';
  ns.forEach((n, j) => {
    const x0 = 22 + j * 135, w = 120;
    const sx = lin(-4, 4, x0, x0 + w), sy = lin(0, 1.0, 190, 40);
    const xs = xs0.map((x) => { let y = x; const h = 1 / n; for (let i = 0; i < n; i++) y += h * uG(y, i * h); return y; });
    const bins = 48, hst = histo(xs, -4, 4, bins), bw = w / bins;
    hst.forEach((v, i) => { if (v > 0) o += rect(x0 + i * bw, sy(Math.min(v, 1.0)), bw, 190 - sy(Math.min(v, 1.0)), 'wash-strong'); });
    o += path(curve((x) => pG(x, 1), -4, 4, sx, sy, 200), 'dash');
    o += line(x0, 190, x0 + w, 190, 'axis');
    for (const x of [-2, 0, 2]) o += text(sx(x), 206, String(x).replace('-', '−'), 'ts', 'middle');
    o += text(x0 + w / 2, 28, 'n = ' + n, 'tb', 'middle');
    if (n === 1) o += arrow(x0 + w / 2 + 26, 70, sx(0) + 4, 52, 'mute') + text(x0 + w / 2 + 28, 82, '全部落在 0', 'ts');
  });
  o += text(280, 232, '同一组起点（N(0, 1) 的 4000 个 quantile），exact marginal field，Euler 走 n 步后的 histogram', 'ts', 'middle');
  o += text(280, 250, '虚线是 p_data。n = 1 时每个点都被送到 p_data 的 mean', 'ts', 'middle');
  return svg(560, 260, o, '用 exact marginal vector field 做 Euler，步数为 1、2、5、100 时终点的 histogram：1 步全部落在 0，2 步两个 bump 被往中间拉，100 步与 p_data 重合');
}

// ---------- 第 3 站：Lab 2 的 2D Gaussian mixture，t = 0.5 的 marginal field ----------
function gmm2d() {
  // Lab 2：5 个 mode 均匀分布在半径 10 的 circle 上，std 1；path α_t = t，β_t = √(1 − t)
  const K = 5, R = 10, s2 = 1, t = 0.5;
  const mus = Array.from({ length: K }, (_, k) => [R * Math.cos((2 * Math.PI * k) / K), R * Math.sin((2 * Math.PI * k) / K)]);
  const al = t, ald = 1, be = Math.sqrt(1 - t), bed = -0.5 / Math.sqrt(1 - t);
  const v = al * al * s2 + be * be;
  const field = (x, y) => {
    const l = mus.map(([a, b]) => -(((x - al * a) ** 2 + (y - al * b) ** 2) / (2 * v)));
    const mx = Math.max(...l), e = l.map((q) => Math.exp(q - mx)), Z = e.reduce((p, q) => p + q, 0);
    let ex = 0, ey = 0;
    mus.forEach(([a, b], k) => { const w = e[k] / Z; ex += w * (a + ((al * s2) / v) * (x - al * a)); ey += w * (b + ((al * s2) / v) * (y - al * b)); });
    const c1 = ald - (bed / be) * al, c2 = bed / be;
    return [c1 * ex + c2 * x, c1 * ey + c2 * y];
  };
  const sx = lin(-15, 15, 30, 290), sy = lin(-15, 15, 280, 20);
  let o = rect(30, 20, 260, 260, 'frame');
  for (let i = -14; i <= 14; i += 2) for (let j = -14; j <= 14; j += 2) {
    const [ux, uy] = field(i, j), m = Math.hypot(ux, uy);
    const L = Math.min(11, 2 + m * 0.55), dx = (ux / m) * L, dy = (uy / m) * L;
    o += arrow(sx(i), sy(j), sx(i) + dx, sy(j) - dy, 'mute', 4);
  }
  for (const [a, b] of mus) o += circle(sx(a), sy(b), 5, 'ln-f') + circle(sx(al * a), sy(al * b), 3, 'ink-f');
  o += text(310, 50, 'Lab 2 的 p_data：5 个 mode', 't') + text(310, 68, '在半径 10 的 circle 上，std 1', 'ts');
  o += text(310, 100, 'path：α_t = t，β_t = √(1 − t)', 'ts') + text(310, 118, '这里 t = 0.5', 'ts');
  o += circle(316, 146, 5, 'ln-f') + text(328, 150, 'mode（data 的位置）', 'ts');
  o += circle(316, 170, 3, 'ink-f') + text(328, 174, 'α_t μ_k：p_t 此刻的中心', 'ts');
  o += text(310, 206, '箭头是 exact marginal field 的方向。', 'ts') + text(310, 222, '每个领地里箭头都等于 μ_k：', 'ts') + text(310, 238, '整团点以 velocity μ_k 平移，', 'ts') + text(310, 254, '从 0.5μ_k 走向 μ_k', 'ts');
  return svg(560, 296, o, 'Lab 2 的五个 mode 的二维 Gaussian mixture 在 t 等于 0.5 时的 marginal vector field：箭头从各处指向五个方向，把点往对应的 mode 推');
}

// 不可约的 loss：C(t) = E Var(z − ε | x_t)
function plateau() {
  const C = (t) => {
    const N = 3000, lo = -12, hi = 12, dx = (hi - lo) / N;
    let I = 0;
    for (let i = 0; i <= N; i++) { const x = lo + i * dx, w = i === 0 || i === N ? 0.5 : 1; I += w * pG(x, t) * uG(x, t) ** 2 * dx; }
    return 1 + S * S + 4 - I;
  };
  const sx = lin(0, 1, 60, 380), sy = lin(0, 6, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 6, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt: [0, 1, 2, 3, 4, 5], grid: true });
  o += text(sx(1) + 8, sy(0) + 4, 't', 'ts');
  o += path(area(C, 0, 1, sx, sy, 0, 120), 'wash') + path(curve(C, 0, 1, sx, sy, 120), 'ln');
  o += text(sx(0.03), sy(3.5), '4.25 = Var(z)', 'ts');
  o += text(sx(1) - 4, sy(1) - 10, '1 = Var(ε)', 'ts', 'end');
  o += text(400, 70, '曲线：C(t)', 'ts') + text(400, 86, '= E[Var(z − ε | x_t)]', 'ts') + text(400, 104, 'exact field 在时刻 t 的', 'ts') + text(400, 120, 'conditional loss', 'ts');
  o += text(400, 156, '阴影面积 ≈ 2.77', 'tl') + text(400, 174, 'training loss 的下限', 'ts');
  o += text(240, 258, '½N(−2, 0.5²) + ½N(2, 0.5²)，CondOT path，numerical integration', 'ts', 'middle');
  return svg(560, 264, o, 'Exact marginal field 的 conditional flow matching loss 随 t 的变化：从 t 等于 0 时的 4.25 先升到约 5.2 再降到 t 等于 1 时的 1，曲线下面积约 2.77');
}

// ---------- 第 4 站：ODE 与 SDE 的 trajectory ----------
function sde() {
  let o = '';
  const panel = (x0, sig, title) => {
    const sx = lin(0, 1, x0, x0 + 220), sy = lin(-3.6, 3.6, 220, 30);
    o += rect(x0, 30, 220, 190, 'frame');
    o += line(x0, sy(2), x0 + 220, sy(2), 'grid') + line(x0, sy(-2), x0 + 220, sy(-2), 'grid');
    const g = rng(11), n = 400, h = 1 / n;
    const starts = quantiles(10);
    starts.forEach((s0, j) => {
      let x = s0;
      const pts = [[sx(0), sy(x)]];
      for (let i = 0; i < n; i++) {
        const t = i * h;
        x += h * (uG(x, t) + 0.5 * sig * sig * sG(x, t)) + sig * Math.sqrt(h) * g();
        pts.push([sx((i + 1) * h), sy(Math.max(-3.6, Math.min(3.6, x)))]);
      }
      o += path(d(pts), j === 4 || j === 5 ? 'ln' : 'mute');
    });
    o += text(x0 + 110, 20, title, 'tb', 'middle');
    o += text(x0, 236, '0', 'ts', 'middle') + text(x0 + 220, 236, '1', 'ts', 'middle') + text(x0 + 110, 236, 't', 'ts', 'middle');
    o += text(x0 - 5, sy(2) + 4, '2', 'ts', 'end') + text(x0 - 5, sy(-2) + 4, '−2', 'ts', 'end');
  };
  panel(50, 0, 'ODE：σ = 0');
  panel(320, 1, 'SDE：σ = 1，drift 加 ½σ²·score');
  o += text(280, 260, '同样 10 个起点；右图的 noise 来自 seed 11。单条路径变得曲折，但每个时刻的 distribution 和左图相同', 'ts', 'middle');
  return svg(560, 270, o, '左图是 ODE 的 trajectory，平滑地分成两束；右图是加了 noise 和 score 修正的 SDE 的 trajectory，弯弯曲曲，但同样到达正负 2 两个 mode');
}

// ---------- 第 6 站：CFG ----------
function cfg() {
  const xs0 = quantiles(4000), n = 400, h = 1 / n;
  const run = (w) => xs0.map((x0) => { let x = x0; for (let i = 0; i < n; i++) { const t = i * h; x += h * ((1 - w) * uG(x, t) + w * uPlus(x, t)); } return x; });
  const sx = lin(-4, 5, 50, 370), sy = lin(0, 1.5, 220, 30);
  let o = axes({ sx, sy, x0: -4, x1: 5, y0: 0, y1: 1.5, xt: [[-2, '−2'], [0, '0'], [2, '2'], [4, '4']], yt: [0.5, 1] });
  o += path(curve((x) => 0.5 * npdf(x, -2, 0.25), -4, 5, sx, sy, 300), 'dash');
  o += path(curve((x) => npdf(x, 2, 0.25), -4, 5, sx, sy, 300), 'ink-b');
  const ws = [[1, 'mute'], [2, 'ln-dash'], [4, 'ln']];
  const bins = 90;
  for (const [w, cls] of ws) {
    const hst = histo(run(w), -4, 5, bins), bw = 9 / bins;
    const pts = hst.map((v, i) => [sx(-4 + (i + 0.5) * bw), sy(v)]);
    o += path(d(pts), cls);
  }
  o += text(sx(-2), sy(0.5), '½ p(x | −)', 'ts', 'middle');
  o += text(392, 50, '黑粗线：p(x | +)', 't') + text(392, 70, '灰线：w = 1', 'ts') + text(392, 88, '彩虚线：w = 2', 'ts') + text(392, 106, '彩实线：w = 4', 'ts');
  o += text(392, 140, 'w = 1：mean 2.00，std 0.50', 'ts') + text(392, 158, 'w = 2：mean 2.33，std 0.36', 'ts') + text(392, 176, 'w = 4：mean 2.68，std 0.29', 'ts');
  o += text(280, 254, 'Exact field 上的 CFG：Euler 400 步，起点是 N(0, 1) 的 4000 个 quantile', 'ts', 'middle');
  return svg(560, 264, o, 'Classifier-free guidance 的效果：guidance scale 越大，生成的 distribution 越窄，而且整体推离另一类，越过 class 自己的 mean');
}

// ---------- 第 7 站：DiT 与 latent diffusion ----------
function dit() {
  let o = '';
  const box = (x, y, w, h, s, sub2, cls = 'paper') => { o += rect(x, y, w, h, cls, 6) + text(x + w / 2, y + (sub2 ? h / 2 - 2 : h / 2 + 5), s, 't', 'middle'); if (sub2) o += text(x + w / 2, y + h / 2 + 14, sub2, 'ts', 'middle'); };
  box(20, 40, 92, 46, 'x_t', '1×32×32');
  o += arrow(114, 63, 136, 63, 'ink');
  box(138, 40, 100, 46, 'Patchify', '64 × 16 → 256');
  o += arrow(240, 63, 262, 63, 'ink');
  o += rect(264, 24, 150, 132, 'wash', 8) + text(339, 42, 'DiT block × 8', 'tb', 'middle');
  box(276, 52, 126, 30, 'adaLN → MHA', '');
  box(276, 90, 126, 30, 'adaLN → MLP', '');
  o += text(339, 142, '每个 sub-layer 带 gate α', 'ts', 'middle');
  o += arrow(416, 63, 438, 63, 'ink');
  box(440, 40, 100, 46, 'Depatchify', '→ 1×32×32');
  o += arrow(490, 88, 490, 112, 'ink') + text(490, 128, 'u_θ(x_t | t, y)', 't', 'middle');
  box(150, 190, 110, 40, 'Fourier(t)', '');
  box(276, 190, 126, 40, 'Embedding(y)', '11 类，含 ∅');
  o += text(205, 250, 't', 'ts', 'middle') + text(339, 250, 'y ∈ {0,…,9, ∅}', 'ts', 'middle');
  o += line(205, 188, 205, 172, 'ink') + line(339, 188, 339, 172, 'ink') + line(205, 172, 339, 172, 'ink');
  o += arrow(272, 172, 272, 158, 'ink') + text(176, 168, '相加 → (γ, β, α)', 'ts', 'middle');
  return svg(560, 262, o, 'Lab 3 的 diffusion transformer：图像切成 64 个 patch token，经过 8 个 DiT block，time 和 label 的 embedding 通过 adaptive layer norm 进入每个 block，最后拼回图像形状输出 vector field');
}

function latent() {
  let o = '';
  const box = (x, y, w, h, s, sub2) => { o += rect(x, y, w, h, 'paper', 6) + text(x + w / 2, y + (sub2 ? h / 2 - 2 : h / 2 + 5), s, 't', 'middle'); if (sub2) o += text(x + w / 2, y + h / 2 + 14, sub2, 'ts', 'middle'); };
  o += text(20, 26, '先 train VAE，然后冻结', 'tb');
  box(20, 40, 90, 44, 'x', '1×32×32');
  o += arrow(112, 62, 140, 62, 'ink');
  box(142, 40, 96, 44, 'Encoder', 'μ_φ(x)');
  o += arrow(240, 62, 268, 62, 'ink');
  o += rect(270, 40, 96, 44, 'wash', 6) + text(318, 58, 'latent z', 't', 'middle') + text(318, 74, '128×4×4', 'ts', 'middle');
  o += arrow(368, 62, 396, 62, 'ink');
  box(398, 40, 96, 44, 'Decoder', '→ 1×32×32');
  o += text(20, 124, 'Training：在 latent 上做和 pixel space 一模一样的 CFG flow matching', 'tb');
  box(20, 138, 150, 44, 'z = μ_φ(x)', 'torch.no_grad()');
  o += arrow(172, 160, 200, 160, 'ink');
  box(202, 138, 150, 44, 'x_t = t z + (1−t) ε', '');
  o += arrow(354, 160, 382, 160, 'ink');
  box(384, 138, 156, 44, '‖u_θ − (z − ε)‖²', 'latent DiT，patch 1');
  o += text(20, 222, 'Sampling：noise → latent DiT 的 ODE → z → Decoder → 图像', 'tb');
  o += text(20, 244, '16 个 token 而不是 64 个；真正的大 model 里，同样的设计把 token 数压低几百倍', 'ts');
  return svg(560, 256, o, 'Latent diffusion 的流程：先 train VAE，把图像编码成 latent；在 latent 上做 flow matching；sampling 时先在 latent 里解 ODE，再用 decoder decode成图像');
}

export default {
  'mit6s184-ou': ou,
  'mit6s184-paths': paths,
  'mit6s184-avg': avg,
  'mit6s184-traj': traj,
  'mit6s184-euler': euler,
  'mit6s184-gmm2d': gmm2d,
  'mit6s184-plateau': plateau,
  'mit6s184-sde': sde,
  'mit6s184-cfg': cfg,
  'mit6s184-dit': dit,
  'mit6s184-latent': latent,
};
