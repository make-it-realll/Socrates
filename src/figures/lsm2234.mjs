import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, ashow, acircle, f1 } from '../lib/svg.mjs';

// ---------- 共用：可复现的随机数、数值积分、模拟 ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (R) => Math.sqrt(-2 * Math.log(1 - R())) * Math.cos(2 * Math.PI * R());
const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;
const sb = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const neg = (s) => String(s).replace('-', '−');

// RK4，返回每一步的状态
function rk4(f, y0, h, nSteps) {
  const out = [y0.slice()];
  let y = y0.slice();
  for (let k = 0; k < nSteps; k++) {
    const k1 = f(y), y2 = y.map((v, i) => v + (h / 2) * k1[i]);
    const k2 = f(y2), y3 = y.map((v, i) => v + (h / 2) * k2[i]);
    const k3 = f(y3), y4 = y.map((v, i) => v + h * k3[i]);
    const k4 = f(y4);
    y = y.map((v, i) => v + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    out.push(y.slice());
  }
  return out;
}

// logistic：N(t) = K / (1 + (K/N0 − 1) e^{−rt})
const R1 = Math.log(2) / 20, K1 = 1e9, N01 = 1e6;
const logistic = (t) => K1 / (1 + (K1 / N01 - 1) * Math.exp(-R1 * t));

// 酶：E + S ⇌ ES → E + P，单位 µM、s
const EZ = { k1: 1, km1: 9, k2: 1, E0: 0.1, S0: 50 };
function enzymeRun() {
  const { k1, km1, k2, E0 } = EZ;
  const f = ([S, C]) => [-k1 * (E0 - C) * S + km1 * C, k1 * (E0 - C) * S - (km1 + k2) * C];
  const h = 0.002, n = 1500000; // 到 3000 s
  let y = [EZ.S0, 0], t = 0;
  const pts = [[0, EZ.S0, 0]];
  const want = []; for (let k = 0; k <= 120; k++) want.push(Math.pow(10, -3 + (k * Math.log10(3e6)) / 120));
  let w = 0;
  for (let s = 0; s < n && w < want.length; s++) {
    const k1v = f(y), y2 = [y[0] + h / 2 * k1v[0], y[1] + h / 2 * k1v[1]];
    const k2v = f(y2), y3 = [y[0] + h / 2 * k2v[0], y[1] + h / 2 * k2v[1]];
    const k3v = f(y3), y4 = [y[0] + h * k3v[0], y[1] + h * k3v[1]];
    const k4v = f(y4);
    const yn = [y[0] + h / 6 * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]), y[1] + h / 6 * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1])];
    const tn = t + h;
    while (w < want.length && want[w] <= tn) {
      const a = (want[w] - t) / h;
      pts.push([want[w], y[0] + a * (yn[0] - y[0]), y[1] + a * (yn[1] - y[1])]);
      w++;
    }
    y = yn; t = tn;
  }
  return pts.slice(1); // [t, S, C]
}

// Michaelis–Menten 拟合用的 data（v 的单位 µM/s）
const MMS = [1, 2, 5, 10, 20, 50, 100];
const MMNOISE = [0.0012, -0.001, 0.0015, -0.002, 0.0018, -0.0015, 0.001];
const mmV = (s, V, K) => (V * s) / (s + K);
const MMV = MMS.map((s, i) => mmV(s, 0.1, 10) + MMNOISE[i]);
function lbFit() {
  const X = MMS.map((s) => 1 / s), Y = MMV.map((v) => 1 / v), n = X.length;
  const mx = X.reduce((a, b) => a + b) / n, my = Y.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) ** 2; }
  const slope = sxy / sxx, ic = my - slope * mx;
  return { slope, ic, V: 1 / ic, K: slope / ic };
}
function nlsFit() {
  let V = 0.09, K = 8;
  for (let it2 = 0; it2 < 50; it2++) {
    let a = 0, b = 0, c = 0, g1 = 0, g2 = 0;
    for (let i = 0; i < MMS.length; i++) {
      const s = MMS[i], r = MMV[i] - mmV(s, V, K);
      const jV = s / (s + K), jK = (-V * s) / (s + K) ** 2;
      a += jV * jV; b += jV * jK; c += jK * jK; g1 += jV * r; g2 += jK * r;
    }
    const det = a * c - b * b;
    V += (c * g1 - b * g2) / det; K += (-b * g1 + a * g2) / det;
  }
  return { V, K };
}

// 基因表达：时间单位 min，dilution α = ln2 / 30 min
const AL = Math.log(2) / 30;
function narRun() {
  // 无量纲：dx/dτ = 10/(1+x²) − x，τ = α t
  const hT = 0.002, steps = Math.round((AL * 120) / hT);
  return rk4(([x]) => [10 / (1 + x * x) - x], [0], hT, steps).map(([x], k) => [(k * hT) / AL, x / 2]);
}

// toggle switch：α = 3，n = 2
const TA = 3;
const togF = ([u, v]) => [TA / (1 + v * v) - u, TA / (1 + u * u) - v];

// birth–death 的 Gillespie
function birthDeath(k, g, n0, T, seed) {
  const R = rng(seed);
  let t = 0, n = n0;
  const ev = [[0, n0]], draws = [];
  for (;;) {
    const tot = k + g * n, u1 = 1 - R(), u2 = R();
    const tau = -Math.log(u1) / tot;
    if (t + tau > T) break;
    t += tau;
    const up = u2 * tot < k;
    draws.push({ n, tot, u1, u2, tau, t, up });
    n += up ? 1 : -1;
    ev.push([t, n]);
  }
  return { ev, draws };
}
// burst：burst 以 rate a 到来，每次加 geometric（mean b）个 protein；每个 protein 以 rate g 消失
function bursty(a, b, g, n0, T, seed) {
  const R = rng(seed), p = b / (1 + b);
  let t = 0, n = n0;
  const ev = [[0, n0]];
  for (;;) {
    const tot = a + g * n;
    t += -Math.log(1 - R()) / tot;
    if (t > T) break;
    if (R() * tot < a) n += Math.floor(Math.log(1 - R()) / Math.log(p));
    else n -= 1;
    ev.push([t, n]);
  }
  return ev;
}

// 2D random walk：D = 0.5 µm²/s，Δt = 0.1 s
const DW = 0.5, DT = 0.1;
function walkers(m, steps, seed) {
  const R = rng(seed), s = Math.sqrt(2 * DW * DT), all = [];
  for (let j = 0; j < m; j++) {
    let x = 0, y = 0;
    const tr = [[0, 0]];
    for (let k = 0; k < steps; k++) { x += s * gauss(R); y += s * gauss(R); tr.push([x, y]); }
    all.push(tr);
  }
  return all;
}
function msdOf(tr, maxLag) {
  const out = [];
  for (let L = 1; L <= maxLag; L++) {
    let acc = 0, c = 0;
    for (let i = 0; i + L < tr.length; i++) { acc += (tr[i + L][0] - tr[i][0]) ** 2 + (tr[i + L][1] - tr[i][1]) ** 2; c++; }
    out.push(acc / c);
  }
  return out;
}

export const sims = { logistic, enzymeRun, lbFit, nlsFit, narRun, birthDeath, bursty, walkers, msdOf, togF, rk4, trapRun: (s) => trapRun(s) };

// ---------- 开头：三次“直觉不够用” ----------
function intro() {
  let o = '';
  const W = 150, H = 110, top = 46;
  // ① 一个 E. coli 里的个数
  {
    const x0 = 28, cy = top + 52, cw = 150, ch = 70;
    o += text(x0 + W / 2, 18, '① 1 nM 不到一个', 'tb', 'middle');
    o += rect(x0, cy - ch / 2, cw, ch, 'paper', ch / 2);
    const R = rng(60), pts = [];
    while (pts.length < 60) {
      const x = x0 + 14 + R() * (cw - 28), y = cy - ch / 2 + 10 + R() * (ch - 20);
      const dx = Math.max(0, Math.abs(x - (x0 + cw / 2)) - (cw / 2 - ch / 2));
      if (dx * dx + (y - cy) ** 2 > (ch / 2 - 7) ** 2) continue;
      if (Math.hypot(x - (x0 + cw / 2), y - cy) < 12) continue;
      if (pts.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 40)) pts.push([x, y]);
    }
    pts.forEach(([x, y]) => { o += circle(x, y, 1.8, 'mute-f'); });
    o += circle(x0 + cw / 2, cy, 5.5, 'ln-f');
    o += text(x0 + W / 2, top + H + 16, '大点：1 个 molecule = 1.7 nM', 'ts', 'middle');
    o += text(x0 + W / 2, top + H + 36, '小点：pH 7 的 60 个 H⁺', 'ts', 'middle');
  }
  // ② flagellum 停转后的速度
  {
    const x0 = 214, tau = 2 * 1000 * 1e-12 / (9e-3) * 1e6; // µs
    const sx = lin(0, 1.2, x0, x0 + W), sy = lin(0, 1.1, top + H, top);
    o += text(x0 + W / 2, 18, '② 一停就停', 'tb', 'middle');
    o += line(x0, top + H, x0 + W, top + H, 'axis') + line(x0, top + H, x0, top, 'axis');
    o += path(curve((t) => Math.exp(-t / tau), 0, 1.2, sx, sy), 'ln');
    for (const v of [0, 0.4, 0.8]) o += line(sx(v), top + H, sx(v), top + H + 4, 'axis') + text(sx(v), top + H + 16, String(v), 'ts', 'middle');
    o += text(x0 - 4, top - 6, 'v / v' + sb('0'), 'ts', 'start');
    o += text(x0 + W, top + H + 16, 'µs', 'ts', 'end');
    o += line(sx(tau), sy(Math.exp(-1)), sx(tau), top + H, 'mute') + text(sx(tau) + 5, sy(Math.exp(-1)) - 4, 'τ = ' + tau.toFixed(2) + ' µs', 'ts', 'start');
    o += text(x0 + W / 2, top + H + 36, 'E. coli 滑行 0.067 Å', 'ts', 'middle');
  }
  // ③ 噪声：negative binomial，mean 100，variance 1100（第 6 站的 burst 模型）
  {
    const x0 = 400, sx = lin(0, 300, x0, x0 + W), r = 10, p = 100 / (100 + r);
    const pmf = []; let lp = r * Math.log(1 - p);
    for (let k = 0; k <= 300; k++) { if (k) lp += Math.log(p) + Math.log(k - 1 + r) - Math.log(k); pmf.push(Math.exp(lp)); }
    const bins = []; for (let b = 0; b < 30; b++) { let s = 0; for (let k = b * 10; k < b * 10 + 10; k++) s += pmf[k]; bins.push(s); }
    const sy = lin(0, Math.max(...bins) * 1.1, top + H, top);
    o += text(x0 + W / 2, 18, '③ 一样的 cell 不一样', 'tb', 'middle');
    bins.forEach((v, b) => { o += rect(sx(b * 10) + 0.5, sy(v), sx(10) - sx(0) - 1, top + H - sy(v), 'wash-strong'); });
    o += line(x0, top + H, x0 + W, top + H, 'axis');
    for (const v of [0, 100, 200, 300]) o += text(sx(v), top + H + 16, String(v), 'ts', 'middle');
    o += text(x0 + W / 2, top + H + 36, '每个 cell 里的 protein 个数', 'ts', 'middle');
  }
  return svg(560, 200, o, '三个小图：一个 E. coli 里，1 nM 只相当于不到一个 molecule，pH 7 的氢离子只有 60 个；flagellum 停转后速度在约 0.2 微秒的 time constant 下衰减，只滑行 0.067 埃；genotype 和环境都相同的 cell，protein 个数分布很宽');
}

// ---------- 第 1 站：尺度的尺子 ----------
function scales() {
  const sx = logx(1e-10, 1e-2, 40, 530);
  let o = '';
  const Y = 120;
  o += line(40, Y, 530, Y, 'ink-b');
  const dec = [[1e-10, '0.1 nm'], [1e-9, '1 nm'], [1e-8, '10 nm'], [1e-7, '100 nm'], [1e-6, '1 µm'], [1e-5, '10 µm'], [1e-4, '100 µm'], [1e-3, '1 mm'], [1e-2, '1 cm']];
  dec.forEach(([v, s]) => { o += line(sx(v), Y - 5, sx(v), Y + 5, 'ink') + text(sx(v), Y + 20, s, 'ts', 'middle'); });
  o += text(40, 18, '上：东西有多大', 'tb', 'start');
  // 上方：对象（范围用粗线段，点用小圆）
  const obj = [
    [0.3e-9, 0.3e-9, 'water', 92],
    [2e-9, 2e-9, 'DNA 直径', 62],
    [3e-9, 6e-9, 'protein', 92],
    [4e-9, 10e-9, 'membrane 厚度', 40],
    [2e-6, 4e-6, 'E. coli 长度', 62],
    [1.36e-3, 1.36e-3, 'E. coli genome 拉直', 62],
  ];
  obj.forEach(([a, b, s, y]) => {
    const xa = sx(a), xb = sx(b);
    if (b > a) o += line(xa, y + 8, xb, y + 8, 'ln') + line((xa + xb) / 2, y + 8, (xa + xb) / 2, Y - 6, 'mute');
    else o += circle(xa, y + 8, 3, 'ln-f') + line(xa, y + 11, xa, Y - 6, 'mute');
    o += text((xa + xb) / 2, y, s, 'ts', 'middle');
  });
  // 下方：molecule 间距
  o += text(40, 250, '下：这个浓度下 molecule 之间隔多远', 'tb', 'start');
  const NA = 6.02214076e23, sp = (c) => (c * NA * 1000) ** (-1 / 3);
  const fmt = (v) => (v >= 1e-6 ? (v * 1e6).toFixed(2) + ' µm' : (v * 1e9).toPrecision(3) + ' nm');
  const conc = [[55, ['water', '55 M'], 'middle'], [3e-3, ['protein', '3 mM'], 'end'], [1e-3, ['1 mM'], 'start'], [1e-6, ['1 µM'], 'start'], [1e-9, ['1 nM'], 'start']];
  const yd = 176;
  conc.forEach(([c, labs, anc]) => {
    const x = sx(sp(c)), dx = anc === 'end' ? -6 : anc === 'start' ? 6 : 0;
    o += line(x, Y + 26, x, yd - 3, 'mute') + circle(x, yd, 3, 'ink-f');
    labs.forEach((l, k) => { o += text(x + dx, yd + 18 + 15 * k, l, 'ts', anc); });
    o += text(x + dx, yd + 18 + 15 * labs.length, fmt(sp(c)), 'ts', anc);
  });
  o += text(530, 250, '浓度每降 1000 倍，距离拉开 10 倍', 'ts', 'end');
  return svg(560, 256, o, '一把对数刻度的尺子：上方标出 water、DNA、protein、membrane、E. coli、拉直的 genome 的大小；下方标出 55 摩尔的 water、3 毫摩尔的 protein、1 毫摩尔、1 微摩尔、1 纳摩尔时 molecule 之间的平均距离');
}

// ---------- 第 2 站：lattice model ----------
function lattice() {
  let o = '';
  const cols = 7, rows = 5, s = 20;
  const grid = (x0, y0, filled, bound, title, lab) => {
    o += text(x0 + (cols * s) / 2, y0 - 12, title, 'tb', 'middle');
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) o += rect(x0 + i * s, y0 + j * s, s, s, 'frame');
    filled.forEach(([i, j]) => { o += circle(x0 + i * s + s / 2, y0 + j * s + s / 2, 6, 'ln-f'); });
    // receptor：一个开口向上的槽
    const rx = x0 + (cols * s) / 2, ry = y0 + rows * s + 26;
    o += path(`M${rx - 20} ${ry - 12} L${rx - 20} ${ry + 6} L${rx + 20} ${ry + 6} L${rx + 20} ${ry - 12} L${rx + 9} ${ry - 12} L${rx + 9} ${ry - 3} L${rx - 9} ${ry - 3} L${rx - 9} ${ry - 12} Z`, 'paper');
    if (bound) o += circle(rx, ry - 9, 6, 'ln-f');
    o += text(rx + 28, ry + 2, 'receptor', 'ts', 'start');
    o += text(x0 + (cols * s) / 2, ry + 30, lab, 'ts', 'middle');
  };
  grid(14, 40, [[0, 1], [2, 3], [3, 0], [5, 2], [6, 4]], false, 'Empty：5 个 ligand 在格子里', 'weight ∝ 1');
  grid(176, 40, [[1, 0], [2, 3], [4, 1], [6, 3]], true, 'Bound：4 个在格子里', 'weight ∝ (c/c' + sb('0') + ') e' + sup('−Δε/kT'));
  // 右：p_bound(c)
  const c0 = 1.6605390671738467, Kd = c0 * Math.exp(-15), Kd2 = Kd / 10;
  const sx = logx(1e-10, 1e-3, 360, 545), sy = lin(0, 1, 210, 40);
  o += axes({ sx, sy, x0: 1e-10, x1: 1e-3, y0: 0, y1: 1, xt: [[1e-9, '1 nM'], [1e-6, '1 µM'], [1e-3, '1 mM']], yt: [0, [0.5, '0.5'], 1], grid: true });
  o += text(360, 28, 'p' + sb('bound'), 'tb', 'start');
  o += path(curve((lc) => { const x = 10 ** lc / Kd; return sy(x / (1 + x)); }, -10, -3, (v) => sx(10 ** v), (v) => v, 300), 'ln');
  o += path(curve((lc) => { const x = 10 ** lc / Kd2; return sy(x / (1 + x)); }, -10, -3, (v) => sx(10 ** v), (v) => v, 300), 'dash');
  o += circle(sx(Kd), sy(0.5), 3.5, 'ink-f') + text(sx(Kd) + 7, sy(0.5) + 15, 'K' + sb('d') + ' = 0.51 µM', 'ts', 'start');
  const p1 = (1e-9 / Kd) / (1 + 1e-9 / Kd);
  o += circle(sx(1e-9), sy(p1), 3.5, 'ink-f') + text(sx(1e-9) - 6, sy(p1) - 8, '0.002', 'ts', 'end');
  o += text(sx(3e-7), sy(0.93), 'Δε = −15 kT', 'tl', 'end');
  o += text(sx(2e-8), sy(0.7), '−17.3 kT', 'ts', 'end');
  o += text(452, 244, '浓度（log scale）', 'ts', 'middle');
  return svg(560, 252, o, '左边两个 lattice：receptor 空着时 5 个 ligand 散在格子里，bound 时只剩 4 个在格子里；右边是 p bound 随浓度变化的 curve，K d 为 0.51 微摩尔，1 纳摩尔时只有 0.002');
}

// ---------- 第 4 站：Poiseuille profile 与 laminar co-flow ----------
function erfc(x) {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
function poiseuille() {
  let o = '';
  const R = 25e-6, L = 0.01, dp = 1000, eta = 1e-3;
  const vbar = (R * R * dp) / (8 * eta * L), vmax = 2 * vbar;
  // 上：速度 profile
  const y0 = 40, h = 90, x0 = 40;
  o += text(280, 18, '速度 profile：v(r) = Δp (R² − r²) / 4ηL', 'tb', 'middle');
  o += line(x0, y0, 520, y0, 'ink-b') + line(x0, y0 + h, 520, y0 + h, 'ink-b');
  const sv = lin(0, vmax, 0, 170);
  const pr = [];
  for (let k = 0; k <= 8; k++) {
    const r = -R + (2 * R * k) / 8, v = (dp / (4 * eta * L)) * (R * R - r * r), y = y0 + h / 2 + (r / R) * (h / 2);
    if (v > 1e-9) o += arrow(x0 + 20, y, x0 + 20 + sv(v), y, 'ln', 6);
  }
  for (let k = 0; k <= 60; k++) { const r = -R + (2 * R * k) / 60; pr.push([x0 + 20 + sv((dp / (4 * eta * L)) * (R * R - r * r)), y0 + h / 2 + (r / R) * (h / 2)]); }
  o += path(d(pr), 'mute');
  o += text(x0 + 200, y0 + h / 2 - 6, 'v' + sb('max') + ' = ' + (vmax * 1e3).toFixed(1) + ' mm/s', 'ts', 'start');
  o += text(x0 + 200, y0 + h / 2 + 12, '平均 ' + (vbar * 1e3).toFixed(1) + ' mm/s，壁上为 0', 'ts', 'start');
  o += text(520, y0 + h / 2 - 6, 'R = 25 µm，Δp = 1 kPa', 'ts', 'end') + text(520, y0 + h / 2 + 12, 'L = 1 cm，Q = 15 nL/s', 'ts', 'end');
  // 下：两股液体并排流过 1 cm
  const D = 100e-12, Y0 = 176, HH = 70, X0 = 40, WW = 480, nx = 60, ny = 24;
  o += text(280, 162, '两股液体并排流过 1 cm（宽度方向放大画）', 'tb', 'middle');
  for (let i = 0; i < nx; i++) {
    const x = ((i + 0.5) / nx) * L, t = x / vbar, wdt = 2 * Math.sqrt(D * t);
    for (let j = 0; j < ny; j++) {
      const y = (-R + ((j + 0.5) / ny) * 2 * R);
      const c = 0.5 * erfc(y / wdt);
      o += `<rect x="${f1(X0 + (i * WW) / nx)}" y="${f1(Y0 + (j * HH) / ny)}" width="${f1(WW / nx + 0.4)}" height="${f1(HH / ny + 0.4)}" class="solid" opacity="${(0.08 + 0.8 * c).toFixed(3)}"/>`;
    }
  }
  o += rect(X0, Y0, WW, HH, 'frame');
  for (const [x, lab] of [[0.001, '1 mm'], [0.005, '5 mm'], [0.01, '1 cm']]) {
    const t = x / vbar, w = 2 * Math.sqrt(D * t) * 1e6, px = X0 + (x / L) * WW;
    o += line(px, Y0 + HH, px, Y0 + HH + 6, 'axis') + text(Math.min(px, X0 + WW - 4), Y0 + HH + 20, lab, 'ts', x === 0.01 ? 'end' : 'middle');
    o += text(Math.min(px, X0 + WW - 4), Y0 + HH + 36, '交界宽 ' + w.toFixed(0) + ' µm', 'ts', x === 0.01 ? 'end' : 'middle');
  }
  o += text(X0, Y0 + HH + 20, '0', 'ts', 'start');
  o += text(X0 + 6, Y0 + 14, 'protein solution', 'tw', 'start') + text(X0 + 6, Y0 + HH - 6, 'buffer', 'ts', 'start');
  return svg(560, 290, o, '上面是半径 25 微米的 channel 里的 parabola 速度 profile，中心 15.6 毫米每秒；下面两股液体并排流过 1 厘米，交界面只变宽到约 23 微米');
}

// ---------- 第 7 站：Debye screening ----------
function debye() {
  let o = '';
  const lB = 0.6962539454095306, lam = 0.7953808946369239;
  const U = (r) => (lB / r) * Math.exp(-r / lam);
  // 左：ion cloud，半径 3 nm 的圆，1 nm = 30 px
  const C = [130, 150], S = 30, Rm = 3.4;
  o += text(130, 18, '一个正 charge 周围（150 mM）', 'tb', 'middle');
  o += circle(C[0], C[1], Rm * S, 'frame');
  o += `<circle cx="${C[0]}" cy="${C[1]}" r="${f1(lam * S)}" class="ln-dash"/>`;
  const R = rng(9);
  const ions = [];
  let tries = 0;
  while (ions.length < 70 && tries < 20000) {
    tries++;
    const x = (R() * 2 - 1) * Rm, y = (R() * 2 - 1) * Rm, r = Math.hypot(x, y);
    if (r > Rm - 0.15 || r < 0.45) continue;
    const neg = R() < 0.5, w = Math.exp(neg ? U(r) : -U(r)) / Math.exp(U(0.45));
    if (R() > w) continue;
    if (ions.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 0.16)) ions.push([x, y, neg]);
  }
  ions.forEach(([x, y, neg]) => {
    const px = C[0] + x * S, py = C[1] + y * S;
    o += circle(px, py, 6, neg ? 'paper' : 'wash');
    o += text(px, py + 4, neg ? '−' : '+', 'ts', 'middle');
  });
  o += circle(C[0], C[1], 9, 'solid') + text(C[0], C[1] + 5, '+', 'tw', 'middle');
  o += line(C[0] - 112, 272, C[0] - 82, 272, 'ink-b') + text(C[0] - 97, 288, '1 nm', 'ts', 'middle');
  o += text(C[0] + 112, 276, '虚线圆半径 λ' + sb('D') + ' = 0.80 nm', 'ts', 'end');
  o += text(C[0] + 112, 292, '空心：负 ion；浅色：正 ion', 'ts', 'end');
  // 右：U(r)/kT
  const sx = lin(0, 4, 300, 545), sy = lin(0, 2, 240, 40);
  o += axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 2, xt: [0, 1, 2, 3, 4], yt: [0, 1, 2], grid: true, xl: 'r（nm）' });
  o += text(300, 28, '两个 unit charge 的 U / kT', 'tb', 'start');
  const lam1 = 9.741386715094263;
  o += path(curve((r) => Math.min(2.05, lB / r), 0.34, 4, sx, sy), 'dash');
  o += path(curve((r) => Math.min(2.05, (lB / r) * Math.exp(-r / lam1)), 0.34, 4, sx, sy), 'mute');
  o += path(curve((r) => Math.min(2.05, U(r)), 0.34, 4, sx, sy), 'ln');
  o += line(sx(3.0), sy(lB / 3.0) - 2, sx(3.2), sy(0.55) + 4, 'mute') + text(sx(3.2), sy(0.55), '没有 salt：ℓ' + sb('B') + '/r', 'ts', 'middle');
  o += line(sx(1.5), sy((lB / 1.5) * Math.exp(-1.5 / lam1)) - 2, sx(1.8), sy(0.9) + 4, 'mute') + text(sx(1.8), sy(0.9), '1 mM', 'ts', 'start');
  o += text(sx(1.15), sy(0.12) - 6, '150 mM', 'tl', 'start');
  o += text(sx(1.0), sy(1.6), '0.4 nm 处：1.74 → 1.05', 'ts', 'start');
  return svg(560, 298, o, '左边是一个正 charge 周围的 ion cloud，半径 0.8 纳米的虚线圆是 Debye length；右边三条 interaction energy 曲线，150 毫摩尔时超过 1 纳米就几乎为 0');
}

// ---------- 第 8 站：membrane 与 voltage gating ----------
function membraneFig() {
  let o = '';
  // 左：一段 membrane
  const mx = 120, mw = 26, top = 40, bot = 250;
  o += text(130, 18, 'K⁺ 的平衡：E' + sb('K') + ' = −89 mV', 'tb', 'middle');
  o += rect(mx, top, mw / 2 - 1, bot - top, 'wash2') + rect(mx + mw / 2 + 1, top, mw / 2 - 1, bot - top, 'wash2');
  // channel
  o += rect(mx - 2, 132, mw + 4, 26, 'paper', 4) + text(mx + mw / 2, 149, 'K⁺', 'ts', 'middle');
  o += text(55, top + 12, 'inside', 'tb', 'middle') + text(55, top + 30, '140 mM K⁺', 'ts', 'middle');
  o += text(205, top + 12, 'outside', 'tb', 'middle') + text(205, top + 30, '5 mM K⁺', 'ts', 'middle');
  const R = rng(4);
  const dots = (xa, xb, n) => { const p = []; let k = 0; while (p.length < n && k < 5000) { k++; const x = xa + R() * (xb - xa), y = top + 46 + R() * (bot - top - 56); if ((y > 120 && y < 170) && x > xa + (xb - xa) * 0.55 && xa < mx) continue; if (p.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 90)) p.push([x, y]); } return p; };
  dots(18, mx - 14, 28).forEach(([x, y]) => { o += circle(x, y, 3, 'ln-f'); });
  [[226, 222], [180, 236]].forEach(([x, y]) => { o += circle(x, y, 3, 'ln-f'); });
  for (let y = top + 6; y < bot; y += 16) {
    if (y > 126 && y < 164) continue;
    o += text(mx - 5, y + 4, '−', 'ts', 'end') + text(mx + mw + 5, y + 4, '+', 'ts', 'start');
  }
  o += arrow(mx + mw + 22, 118, mx + mw + 62, 118, 'ink', 7) + text(mx + mw + 42, 110, 'diffusion', 'ts', 'middle');
  o += arrow(mx + mw + 62, 172, mx + mw + 22, 172, 'ln', 7) + text(mx + mw + 42, 190, 'electric', 'ts', 'middle');
  o += text(130, 274, '表面那层 charge：cell 里 K⁺ 的 2×10' + sup('−5'), 'ts', 'middle');
  // 右：P_open(V)
  const kTe = 26.726659112543267, zg = 4, Vh = -40;
  const P = (V) => 1 / (1 + Math.exp((zg * (Vh - V)) / kTe));
  const sx = lin(-120, 40, 330, 545), sy = lin(0, 1, 230, 50);
  o += axes({ sx, sy, x0: -120, x1: 40, y0: 0, y1: 1, xt: [[-120, '−120'], [-80, '−80'], [-40, '−40'], [0, '0'], [40, '40']], yt: [0, [0.5, '0.5'], 1], grid: true, xl: 'V（mV）' });
  o += text(330, 38, 'Voltage-gated channel：P' + sb('open'), 'tb', 'start');
  o += path(curve(P, -120, 40, sx, sy), 'ln');
  const V10 = Vh - (Math.log(9) * kTe) / zg, V90 = Vh + (Math.log(9) * kTe) / zg;
  o += line(sx(V10), sy(0.1), sx(V10), sy(0), 'dash') + line(sx(V90), sy(0.9), sx(V90), sy(0), 'dash');
  o += circle(sx(V10), sy(0.1), 3, 'ink-f') + circle(sx(V90), sy(0.9), 3, 'ink-f');
  o += text(sx(Vh) - 8, sy(0.5) - 2, 'V' + sb('1/2') + ' = −40 mV', 'ts', 'end');
  o += text(sx(-116), sy(0.86), '10% → 90%：' + (V90 - V10).toFixed(0) + ' mV', 'ts', 'start');
  o += text(sx(-116), sy(0.86) + 16, 'z' + sb('g') + ' = 4：每 ' + (kTe / zg).toFixed(1) + ' mV', 'ts', 'start');
  o += text(sx(-116), sy(0.86) + 32, '变 e 倍', 'ts', 'start');
  return svg(560, 282, o, '左边一段 membrane：inside 有 140 毫摩尔 K 离子，outside 5 毫摩尔，diffusion 向外、electric force 向内，两个表面各贴着一层 charge；右边是 gating charge 为 4 的 channel 的 open probability 随 voltage 的 sigmoid 曲线');
}

// ---------- 第 9 站：photon energy 的尺子 ----------
function spectrum() {
  const sx = logx(200, 20000, 40, 530);
  let o = '';
  const kTeV = 0.025851999786435535;
  o += text(40, 18, '一个 photon 带多少能量（E = 1240 eV nm / λ，kT 取 300 K）', 'tb', 'start');
  const B0 = 176, BH = 24;
  o += rect(sx(200), B0, sx(400) - sx(200), BH, 'wash-strong') + text((sx(200) + sx(400)) / 2, B0 + 16, 'UV', 'ts', 'middle');
  o += rect(sx(400), B0, sx(700) - sx(400), BH, 'solid2') + text((sx(400) + sx(700)) / 2, B0 + 16, 'visible', 'tw', 'middle');
  o += rect(sx(700), B0, sx(20000) - sx(700), BH, 'wash2') + text((sx(700) + sx(20000)) / 2, B0 + 16, 'infrared', 'ts', 'middle');
  for (const [v, l] of [[200, '200 nm'], [400, '400 nm'], [700, '700 nm'], [2000, '2 µm'], [20000, '20 µm']]) o += line(sx(v), B0 + BH, sx(v), B0 + BH + 5, 'axis') + text(sx(v), B0 + BH + 19, l, 'ts', v === 200 ? 'start' : v === 20000 ? 'end' : 'middle');
  const cols = [[260, '260 nm（UVC）', 'DNA 吸收：', 'pyrimidine dimer'], [500, '500 nm（visible）', 'vision、', 'fluorescence'], [975, '975 nm（near-IR）', 'optical trap', '用的 laser'], [10000, '10 µm（IR）', 'molecular vibration', '即 heat']];
  cols.forEach(([lam, a1, b1, b2], i) => {
    const E = 1239.84 / lam, kt = E / kTeV, cx = 95 + i * 130, mx = sx(lam);
    const bf = kt > 20 ? '10' + sup(String(Math.round(-kt / Math.LN10))) : Math.exp(-kt).toFixed(3);
    o += text(cx, 44, a1, 'tb', 'middle');
    o += text(cx, 61, E.toPrecision(3) + ' eV = ' + (kt < 10 ? kt.toFixed(1) : kt.toFixed(0)) + ' kT', 'tl', 'middle');
    o += text(cx, 78, 'e' + sup('−E/kT') + ' = ' + bf, 'ts', 'middle');
    o += text(cx, 99, b1, 'ts', 'middle') + text(cx, 114, b2, 'ts', 'middle');
    o += line(cx, 124, mx, B0 - 6, 'mute') + circle(mx, B0 - 3, 3, 'ink-f');
  });
  o += text(280, 244, '一个 ATP 约 20 kT：一个 500 nm 的 photon 相当于 5 个 ATP', 'ts', 'middle');
  return svg(560, 252, o, '一把对数刻度的 wavelength 尺子，从 200 纳米的 UV 到 20 微米的 infrared；上方四栏标出 260 纳米 184 kT、500 纳米 96 kT、975 纳米 49 kT、10 微米 4.8 kT 四个 photon 的能量、Boltzmann factor 和它在 cell 里能做的事');
}

// ---------- 第 9 站：optical trap 里的 bead ----------
const TRAP = { kap: 0.05, eta: 1e-3, d: 1e-6, kT: 4.14, dt: 1e-4, N: 2000 }; // pN/nm, Pa s, m, pN nm, s
function trapRun(seed) {
  const { kap, eta, d: dd, kT, dt, N } = TRAP;
  const beta = 3 * Math.PI * eta * dd; // N s/m
  const tau = beta / (kap * 1e-3);
  const a = Math.exp(-dt / tau), sd = Math.sqrt(kT / kap);
  const R = rng(seed);
  let x = 0;
  const xs = [x];
  for (let k = 1; k < N; k++) { x = a * x + sd * Math.sqrt(1 - a * a) * gauss(R); xs.push(x); }
  const m = xs.reduce((s, v) => s + v, 0) / N, v = xs.reduce((s, u) => s + (u - m) ** 2, 0) / N;
  return { xs, tau, beta, var: v, kEst: kT / v };
}
function trapA() {
  const { kap, kT, dt, N } = TRAP;
  const run = trapRun(2234), xs = run.xs;
  let o = '';
  // 左：会聚的 laser 和 bead（位移放大 2.5 px/nm）
  const cx = 110, fy = 150, S = 1.5;
  o += text(110, 18, 'Bead 在 laser 焦点附近抖', 'tb', 'middle');
  o += poly([[50, 34], [170, 34], [cx + 8, fy], [cx - 8, fy]], 'wash') + poly([[cx - 8, fy], [cx + 8, fy], [170, 266], [50, 266]], 'wash');
  o += text(110, 52, '975 nm laser', 'ts', 'middle');
  const frames = 160, Tan = 8, Ttot = 8;
  const kt = [], px = [];
  for (let k = 0; k <= frames; k++) { kt.push(k / frames); px.push(cx + S * xs[Math.min(N - 1, Math.round((k * (N - 1)) / frames))]); }
  o += line(cx, 70, cx, 196, 'dash');
  o += acircle(px, px.map(() => fy), kt, Ttot, 18, 'paper');
  o += text(110, 214, 'd = 1 µm（不按比例）', 'ts', 'middle');
  o += line(cx - 5 * S, 248, cx + 5 * S, 248, 'ink-b') + text(cx, 264, '10 nm 的位移（放大画）', 'ts', 'middle');
  // 右上：x(t)
  const sx = lin(0, N * dt, 250, 545), sy = lin(-30, 30, 130, 40);
  o += text(250, 28, 'x(t)（nm），每 0.1 ms 一个点，共 0.2 s', 'tb', 'start');
  o += rect(250, 40, 295, 90, 'frame') + line(250, sy(0), 545, sy(0), 'grid');
  o += path(d(xs.filter((_, i) => i % 2 === 0).map((x, i) => [sx(2 * i * dt), sy(Math.max(-30, Math.min(30, x)))])), 'ln');
  o += text(546, 146, '0.2 s', 'ts', 'end') + text(250, 146, '0', 'ts', 'start');
  o += text(246, sy(20) + 4, '20', 'ts', 'end') + text(246, sy(-20) + 4, '−20', 'ts', 'end');
  // 右下：histogram
  const hx = lin(-30, 30, 250, 545), nb = 24, bw = 60 / nb, cnt = new Array(nb).fill(0);
  xs.forEach((x) => { const b = Math.floor((x + 30) / bw); if (b >= 0 && b < nb) cnt[b]++; });
  const dens = cnt.map((c) => c / (N * bw)), sdT = Math.sqrt(kT / kap);
  const pk = 1 / (Math.sqrt(2 * Math.PI) * sdT);
  const hy = lin(0, pk * 1.35, 262, 172);
  dens.forEach((v, b) => { o += rect(hx(-30 + b * bw) + 0.5, hy(v), hx(bw) - hx(0) - 1, 262 - hy(v), 'wash-strong'); });
  o += path(curve((x) => pk * Math.exp((-x * x) / (2 * sdT * sdT)), -30, 30, hx, hy), 'ink');
  o += line(250, 262, 545, 262, 'axis');
  for (const v of [-20, 0, 20]) o += text(hx(v), 278, String(v), 'ts', 'middle');
  o += text(545, 294, 'x（nm）', 'ts', 'end');
  o += text(252, 166, '⟨x²⟩ = ' + run.var.toFixed(0) + ' nm²  →  κ = kT/⟨x²⟩ = ' + run.kEst.toFixed(3) + ' pN/nm', 'tl', 'start');
  return svgA(560, 300, o, '动图：一个 1 微米的 bead 在 optical trap 里随热运动左右抖；右上是 0.2 秒的位置 trace，右下是位置的 histogram 和 variance 为 kT 除以 kappa 的 Gaussian，由 variance 反推出 trap stiffness');
}

// ---------- 第 10 站：culture 里的 cell 和 N(t) 同步 ----------
function growthA() {
  const T = 400, Tan = 8, hold = 2, Ttot = Tan + hold;
  const R = rng(7), M = 80, C = [110, 132], rad = 84;
  const spots = [];
  while (spots.length < M) {
    const x = (R() * 2 - 1) * (rad - 8), y = (R() * 2 - 1) * (rad - 8);
    if (x * x + y * y < (rad - 8) ** 2 && spots.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 110)) spots.push([x, y]);
  }
  let o = text(C[0], 22, 'Culture（每个点 = 1.25×10' + sup('7') + ' cells/mL）', 'tb', 'middle');
  o += circle(C[0], C[1], rad, 'paper') + circle(C[0], C[1], rad - 5, 'frame');
  spots.forEach(([x, y], i) => {
    const Ni = ((i + 0.5) * K1) / M;
    const ti = Math.log((K1 / N01 - 1) / (K1 / Ni - 1)) / R1;
    const kt = ti < T ? [0, (ti / T) * (Tan / Ttot), 1] : [0, 1];
    const on = ti < T ? [0, 1, 1] : [0, 0];
    o += `<circle cx="${f1(C[0] + x)}" cy="${f1(C[1] + y)}" r="3.6" class="ln-f" opacity="0">${ashow(on, kt, Ttot)}</circle>`;
  });
  // 右：N(t)
  const sx = lin(0, T, 270, 540), sy = lin(0, 1.2e9, 222, 40);
  o += axes({ sx, sy, x0: 0, x1: T, y0: 0, y1: 1.2e9, xt: [0, 100, 200, 300, 400], yt: [[0, '0'], [5e8, '0.5'], [1e9, '1.0']], grid: true, xl: 't（min）' });
  o += text(270, 28, 'N（10' + sup('9') + ' cells/mL）', 'tb', 'start');
  o += path(curve((t) => N01 * Math.exp(R1 * t), 0, Math.log(1.2e9 / N01) / R1, sx, sy), 'dash');
  o += path(curve(logistic, 0, T, sx, sy), 'ln');
  const tE = Math.log(K1 / N01) / R1;
  o += text(sx(tE) - 6, sy(1.17e9), 'exponential', 'ts', 'end');
  o += text(sx(T), sy(1e9) + 18, 'logistic，停在 K', 'ts', 'end');
  o += circle(sx(199.3), sy(5e8), 3, 'ink-f') + text(sx(199.3) + 8, sy(5e8) + 14, 'N = K/2：199 min', 'ts', 'start');
  const kt = [], xs = [], ys = [];
  for (let k = 0; k <= 80; k++) { const t = (k * T) / 80; kt.push((k / 80) * (Tan / Ttot)); xs.push(sx(t)); ys.push(sy(logistic(t))); }
  kt.push(1); xs.push(xs[xs.length - 1]); ys.push(ys[ys.length - 1]);
  o += acircle(xs, ys, kt, Ttot, 5, 'ln-f');
  o += text(280, 258, '100 min 时 N 还不到 K 的 4%；', 'ts', 'start') + text(280, 274, '一旦看得见，很快就被 K 拦住。', 'ts', 'start');
  return svgA(560, 282, o, '动图：左边 culture 里的点代表 cell 密度，随时间从无到满；右边 logistic curve 上的点同步移动，exponential 虚线在 199 min 就越过 K');
}

// ---------- 第 10 站：phase line ----------
function phaseline() {
  let o = '';
  const panel = (x0, f, fps, title, labs) => {
    const sx = lin(0, 1.15, x0, x0 + 220);
    const ys = []; for (let k = 0; k <= 200; k++) ys.push(f((1.15 * k) / 200));
    const m = Math.max(...ys.map(Math.abs)) * 1.15;
    const sy = lin(-m, m, 190, 40);
    o += text(x0 + 110, 20, title, 'tb', 'middle');
    o += line(x0, sy(0), x0 + 226, sy(0), 'axis') + line(x0, 40, x0, 190, 'axis');
    o += text(x0 + 4, 50, 'dN/dt', 'ts', 'start') + text(x0 + 226, sy(0) + 16, 'N/K', 'ts', 'end');
    o += path(curve(f, 0, 1.15, sx, sy), 'ln');
    // 下方的 phase line
    const Y = 222;
    o += line(x0, Y, x0 + 226, Y, 'ink');
    const pts = [0, ...fps.map((p) => p[0]), 1.15];
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = pts[i], b = pts[i + 1], mid = (a + b) / 2, up = f(mid) > 0;
      if (sx(b) - sx(a) < 20) continue;
      const c = sx(mid), w = Math.min(10, (sx(b) - sx(a)) / 2 - 7);
      o += up ? arrow(c - w, Y, c + w, Y, 'ink-b', 7) : arrow(c + w, Y, c - w, Y, 'ink-b', 7);
    }
    fps.forEach(([p, st], i) => {
      o += circle(sx(p), Y, 5.5, st ? 'ink-f' : 'paper') + circle(sx(p), sy(0), 3.5, st ? 'ink-f' : 'paper');
      o += text(sx(p), Y + 22, labs[i], 'ts', 'middle');
    });
  };
  panel(30, (x) => x * (1 - x), [[0, false], [1, true]], 'Logistic：rN(1 − N/K)', ['0：unstable', 'K：stable']);
  panel(310, (x) => 3 * x * (x / 0.3 - 1) * (1 - x) / 3, [[0, true], [0.3, false], [1, true]], 'Allee effect：A = 0.3K', ['0：stable', 'A', 'K：stable']);
  o += text(280, 268, '上：dN/dt 对 N 的 curve；下：由它的正负画出的 phase line。实心点 stable，空心点 unstable。', 'ts', 'middle');
  return svg(560, 276, o, '两条 dN/dt 对 N 的 curve 及其 phase line：logistic 有 0 和 K 两个 fixed point；Allee effect 多出一个 unstable 的 A，把 0 变成 stable');
}

// ---------- 第 10 站 :::wrong：Euler 步长太大 ----------
function euler() {
  let o = '';
  const exact = (s) => 1 / (1 + 19 * Math.exp(-s));
  [[0.5, 14], [1.5, 43], [2.5, 72]].forEach(([h, mins], j) => {
    const x0 = 24 + j * 182, W = 160, sx = lin(0, 15, x0, x0 + W), sy = lin(0, 1.3, 190, 40);
    o += text(x0 + W / 2, 18, 'Δt = ' + mins + ' min', 'tb', 'middle') + text(x0 + W / 2, 34, '（rΔt = ' + h + '）', 'ts', 'middle');
    o += rect(x0, 40, W, 150, 'frame') + line(x0, sy(1), x0 + W, sy(1), 'grid');
    o += path(curve(exact, 0, 15, sx, sy), 'dash');
    let x = 0.05; const pts = [[sx(0), sy(x)]];
    for (let k = 1; k * h <= 15 + 1e-9; k++) { x = x + h * x * (1 - x); pts.push([sx(k * h), sy(x)]); }
    o += path(d(pts), 'ln');
    for (const p of pts) o += circle(p[0], p[1], 3, 'ln-f');
    o += text(x0 - 4, sy(1) + 4, 'K', 'ts', 'end') + text(x0 + W, 206, 'rt = 15', 'ts', 'end') + text(x0, 206, '0', 'ts', 'start');
  });
  o += text(280, 232, '虚线是 exact solution，彩色点是 Euler 的结果，起点都是 N = 0.05K。', 'ts', 'middle');
  o += text(280, 250, '中间那张冲过 K 再回落；右边那张最后在 0.54K、1.16K、0.70K、1.23K 四个值之间循环。', 'ts', 'middle');
  return svg(560, 258, o, '三种 step size 下 Euler method 解 logistic equation：rΔt 等于 0.5 时贴着 exact solution；1.5 时冲过 K 再回落；2.5 时最后在四个值之间循环');
}

// ---------- 第 5 站：enzyme 的两种 time scale ----------
function enzymeA() {
  const pts = enzymeRun(); // [t, S, C]
  const n = pts.length, Tan = 9, hold = 2.5, Ttot = Tan + hold;
  const kt = pts.map((_, i) => (i / (n - 1)) * (Tan / Ttot));
  kt.push(1);
  const E0 = EZ.E0, S0 = EZ.S0;
  let o = '';
  // 上：12 个 enzyme
  const NE = 12, ey = 56;
  o += text(14, 22, '12 个 enzyme：深色 = 正结合着一个 substrate（ES）', 'tb', 'start');
  for (let j = 0; j < NE; j++) {
    const cx = 34 + j * 44;
    const a0 = 0.62, r = 15;
    const body = `M${f1(cx)} ${f1(ey)} L${f1(cx + r * Math.cos(a0))} ${f1(ey - r * Math.sin(a0))} A${r} ${r} 0 1 0 ${f1(cx + r * Math.cos(a0))} ${f1(ey + r * Math.sin(a0))} Z`;
    o += `<path d="${body}" class="paper"/>`;
    // 第 j 个在 C/E0 > (j+0.5)/12 时结合
    const thr = (j + 0.5) / NE, on = pts.map((p) => p[2] / E0 > thr);
    on.push(on[on.length - 1]);
    const tr = [0], vals = [on[0] ? 1 : 0];
    for (let i = 1; i < on.length; i++) if (on[i] !== on[i - 1]) { tr.push(kt[i]); vals.push(on[i] ? 1 : 0); }
    o += `<circle cx="${f1(cx + 9)}" cy="${f1(ey)}" r="5" class="solid" opacity="${vals[0]}">${anim('opacity', vals, tr, Ttot, true)}</circle>`;
  }
  // 下：C/E0 和 S/S0 对 log t
  const sx = logx(1e-3, 3e3, 60, 530), sy = lin(0, 1, 250, 110);
  o += axes({ sx, sy, x0: 1e-3, x1: 3e3, y0: 0, y1: 1, xt: [[1e-3, '1 ms'], [1e-2, '10 ms'], [1e-1, '0.1 s'], [1, '1 s'], [10, '10 s'], [100, '100 s'], [1000, '1000 s']], yt: [0, [0.5, '0.5'], 1], grid: true });
  o += text(530, 284, 't（log scale）', 'ts', 'end');
  const cP = d(pts.map((p) => [sx(p[0]), sy(p[2] / E0)])), sP = d(pts.map((p) => [sx(p[0]), sy(p[1] / S0)]));
  o += path(sP, 'ink') + path(cP, 'ln');
  o += text(sx(2e-3), sy(0.98) - 6, '[S] / [S]' + sb('0'), 't', 'start');
  o += text(sx(0.5), sy(0.833) + 18, '[ES] / [E]' + sb('0'), 'tl', 'start');
  o += line(sx(0.0167), sy(0), sx(0.0167), sy(0.62), 'mute') + text(sx(0.0167) + 4, sy(0.12), '17 ms', 'ts', 'start');
  o += text(sx(2), sy(0.5), '[ES] 跟着 [S] 慢慢降', 'ts', 'start');
  const xs = pts.map((p) => sx(p[0])), yC = pts.map((p) => sy(p[2] / E0)), yS = pts.map((p) => sy(p[1] / S0));
  xs.push(xs[n - 1]); yC.push(yC[n - 1]); yS.push(yS[n - 1]);
  o += acircle(xs, yS, kt, Ttot, 4.5, 'ink-f') + acircle(xs, yC, kt, Ttot, 5, 'ln-f');
  o += text(300, 98, 'k' + sb('1') + ' = 1 µM' + sup('−1') + 's' + sup('−1') + '，k' + sb('−1') + ' = 9 s' + sup('−1') + '，k' + sb('2') + ' = 1 s' + sup('−1') + '，[E]' + sb('0') + ' = 0.1 µM，[S]' + sb('0') + ' = 50 µM', 'ts', 'middle');
  return svgA(560, 292, o, '动图：时间轴取 log scale。前 0.1 秒内 12 个 enzyme 里有 10 个结合上 substrate，ES 占比到 0.83 后几乎不动；substrate 要几百秒才耗完，ES 跟着慢慢降');
}

// ---------- 第 5 站 :::wrong：Lineweaver–Burk ----------
function mm() {
  const lb = lbFit(), nl = nlsFit();
  let o = '';
  {
    const sx = lin(0, 110, 50, 260), sy = lin(0, 0.12, 210, 40);
    o += text(155, 20, 'v 对 [S]（µM，µM/s）', 'tb', 'middle');
    o += axes({ sx, sy, x0: 0, x1: 110, y0: 0, y1: 0.12, xt: [0, 50, 100], yt: [0, [0.05, '0.05'], [0.1, '0.10']], grid: true });
    o += path(curve((s) => mmV(s, lb.V, lb.K), 0, 110, sx, sy), 'dash');
    o += path(curve((s) => mmV(s, nl.V, nl.K), 0, 110, sx, sy), 'ln');
    MMS.forEach((s, i) => { o += circle(sx(s), sy(MMV[i]), 3.5, 'ink-f'); });
    o += text(sx(108), sy(mmV(108, nl.V, nl.K)) - 10, 'nonlinear fit', 'tl', 'end');
    o += text(sx(108), sy(mmV(108, lb.V, lb.K)) + 18, 'LB 的结果', 'ts', 'end');
  }
  {
    const sx = lin(0, 1.05, 330, 540), sy = lin(0, 120, 210, 40);
    o += text(435, 20, '1/v 对 1/[S]（Lineweaver–Burk）', 'tb', 'middle');
    o += axes({ sx, sy, x0: 0, x1: 1.05, y0: 0, y1: 120, xt: [0, [0.5, '0.5'], [1, '1']], yt: [0, 50, 100], grid: true });
    o += path(curve((x) => 10 * x / 0.1 + 10, 0, 1.05, sx, sy), 'dash');
    o += path(curve((x) => lb.slope * x + lb.ic, 0, 1.05, sx, sy), 'ln');
    MMS.forEach((s, i) => { o += circle(sx(1 / s), sy(1 / MMV[i]), 3.5, 'ink-f'); });
    o += text(sx(1) - 4, sy(1 / MMV[0]) + 20, '[S] = 1 µM', 'ts', 'end');
    o += text(sx(0.62), sy(lb.slope * 0.62 + lb.ic) + 20, 'LB 直线', 'tl', 'start');
    o += text(sx(0.5) - 6, sy(10 * 0.5 / 0.1 + 10) - 8, '真实的直线', 'ts', 'end');
  }
  o += text(280, 240, 'LB：K' + sb('M') + ' = ' + lb.K.toFixed(1) + ' µM，V' + sb('max') + ' = ' + lb.V.toFixed(3) + ' µM/s；nonlinear least squares：K' + sb('M') + ' = ' + nl.K.toFixed(1) + '，V' + sb('max') + ' = ' + nl.V.toFixed(3), 'ts', 'middle');
  o += text(280, 258, '真实值 K' + sb('M') + ' = 10 µM，V' + sb('max') + ' = 0.1 µM/s。七个点的 noise 都在 ±0.002 µM/s 以内。', 'ts', 'middle');
  return svg(560, 266, o, '同一组七个 data 点：左边在 v 对 S 的图上做 nonlinear fit，几乎还原真实参数；右边取倒数做 Lineweaver–Burk 直线，最左上那个点把直线拉歪');
}

// ---------- 第 11 站：Hill function ----------
function hill() {
  const sx = logx(0.03, 30, 50, 380), sy = lin(0, 1, 210, 40);
  let o = text(215, 20, '被 repress 的 promoter 有多活跃：1 / (1 + (x/K)' + sup('n') + ')', 'tb', 'middle');
  o += axes({ sx, sy, x0: 0.03, x1: 30, y0: 0, y1: 1, xt: [[0.1, '0.1'], [1, '1'], [10, '10']], yt: [0, [0.5, '0.5'], 1], grid: true });
  o += text(380, 244, 'x / K（log scale）', 'ts', 'end');
  const cls = { 1: 'mute', 2: 'ink', 4: 'ln' };
  for (const n of [1, 2, 4]) o += path(curve((x) => 1 / (1 + x ** n), 0.03, 30, sx, sy, 300), cls[n]);
  o += text(sx(0.08), sy(1 / (1 + 0.08)) + 18, 'n = 1', 'ts', 'start');
  o += line(sx(1.75), sy(1 / (1 + 1.75 ** 2)), sx(4.6), sy(0.5), 'mute') + text(sx(4.8), sy(0.5) + 4, 'n = 2', 't', 'start');
  o += text(sx(1.25), sy(1 / (1 + 1.25 ** 4)) + 4, 'n = 4', 'tl', 'end');
  // 右：从 90% 降到 10% 要多大的 x 变化
  o += text(470, 52, '从 90% 降到 10%，', 'tb', 'middle') + text(470, 70, 'x 要放大多少倍', 'tb', 'middle');
  [[1, 'mute', 81], [2, 'ink', 9], [4, 'ln', 3]].forEach(([n, c, f], k) => {
    const y = 108 + k * 40, a = (1 / 9) ** (1 / n), b = 9 ** (1 / n);
    const s2 = logx(1 / 9, 9, 410, 530);
    o += line(s2(a), y, s2(b), y, c === 'ln' ? 'ln' : c === 'ink' ? 'ink-b' : 'mute');
    o += line(s2(a), y - 5, s2(a), y + 5, 'axis') + line(s2(b), y - 5, s2(b), y + 5, 'axis');
    o += text(470, y + 18, 'n = ' + n + '：' + f + ' 倍', c === 'ln' ? 'tl' : 'ts', 'middle');
  });
  return svg(560, 252, o, '三条 repression Hill function，n 等于 1、2、4；n 越大越陡，从 90% 活跃降到 10% 所需的 x 变化从 81 倍缩到 3 倍');
}

// ---------- 第 11 站：simple regulation 与 negative autoregulation ----------
function geneA() {
  const T = 120, Tan = 8, hold = 2, Ttot = Tan + hold;
  const nar = narRun(); // [t, x/x*]
  const simple = (t) => 1 - Math.exp(-AL * t);
  const narAt = (t) => { const i = Math.min(nar.length - 1, Math.round((t / T) * (nar.length - 1))); return nar[i][1]; };
  let o = '';
  const R = rng(11), M = 40;
  const cell = (x0, title, fn, nar2) => {
    o += rect(x0, 30, 240, 104, 'paper', 40) + text(x0 + 120, 20, title, 'tb', 'middle');
    // gene：promoter + coding region
    const gy = 112;
    o += line(x0 + 40, gy, x0 + 52, gy, 'ink') + line(x0 + 170, gy, x0 + 200, gy, 'ink') + rect(x0 + 52, gy - 7, 26, 14, 'wash2') + rect(x0 + 80, gy - 6, 90, 12, 'wash');
    o += text(x0 + 65, gy + 4, 'P', 'ts', 'middle') + text(x0 + 125, gy + 4, 'gene X', 'ts', 'middle');
    if (nar2) {
      o += path(`M${x0 + 175} ${gy - 10} C${x0 + 175} ${gy - 34}, ${x0 + 66} ${gy - 34}, ${x0 + 66} ${gy - 12}`, 'ln');
      o += line(x0 + 59, gy - 12, x0 + 73, gy - 12, 'ln');
      o += text(x0 + 122, gy - 32, 'X repress 自己', 'ts', 'middle');
    }
    // protein：最多 40 个点
    const spots = [];
    while (spots.length < M) {
      const x = 22 + R() * 196, y = 40 + R() * 40;
      if (nar2 && x > 60 && x < 180 && y > 66) continue;
      if (spots.every(([a, b]) => (a - x) ** 2 + (b - y) ** 2 > 60)) spots.push([x, y]);
    }
    spots.forEach(([x, y], i) => {
      const thr = (i + 0.5) / M;
      let ti = null;
      for (let k = 0; k <= 600; k++) { const t = (k * T) / 600; if (fn(t) > thr) { ti = t; break; } }
      const kt = ti !== null ? [0, (ti / T) * (Tan / Ttot), 1] : [0, 1];
      const on = ti !== null ? [0, 1, 1] : [0, 0];
      o += `<circle cx="${f1(x0 + x)}" cy="${f1(y)}" r="3" class="ln-f" opacity="0">${ashow(on, kt, Ttot)}</circle>`;
    });
  };
  cell(20, 'Simple regulation：β = 2', simple, false);
  cell(300, 'Negative autoregulation：β = 10', narAt, true);
  // 下：x / x*
  const sx = lin(0, T, 60, 530), sy = lin(0, 1.05, 300, 170);
  o += axes({ sx, sy, x0: 0, x1: T, y0: 0, y1: 1.05, xt: [0, 30, 60, 90, 120], yt: [0, [0.5, '0.5'], [1, '1']], grid: true, xl: 't（min）' });
  o += text(60, 160, '[X] / steady state', 'ts', 'start');
  o += path(curve(simple, 0, T, sx, sy), 'ink') + path(d(nar.filter((_, i) => i % 10 === 0).map(([t, x]) => [sx(t), sy(x)])), 'ln');
  o += line(sx(30), sy(0.5), sx(30), sy(0), 'mute') + line(sx(6.35), sy(0.5), sx(6.35), sy(0), 'mute');
  o += text(sx(30) + 4, sy(0.42), 'simple：30 min', 't', 'start') + line(sx(6.35), sy(0.05), sx(38), sy(0.12), 'mute') + text(sx(39), sy(0.12) + 4, 'NAR：6.4 min', 'tl', 'start');
  const kt = [], xs = [], y1 = [], y2 = [];
  for (let k = 0; k <= 96; k++) { const t = (k * T) / 96; kt.push((k / 96) * (Tan / Ttot)); xs.push(sx(t)); y1.push(sy(simple(t))); y2.push(sy(narAt(t))); }
  kt.push(1); xs.push(xs[96]); y1.push(y1[96]); y2.push(y2[96]);
  o += acircle(xs, y1, kt, Ttot, 4.5, 'ink-f') + acircle(xs, y2, kt, Ttot, 5, 'ln-f');
  return svgA(560, 336, o, '动图：两个 cell 在 t 等于 0 时开始表达 X，steady state 相同。Negative autoregulation 的 cell 6.4 分钟就到一半，simple regulation 要 30 分钟');
}

// ---------- 第 12 站：toggle switch 的 phase plane ----------
function toggleA() {
  const sx = lin(0, 3.2, 250, 540), sy = lin(0, 3.2, 300, 10);
  let o = '';
  // 左：两个 gene 的线路
  o += text(110, 14, '两个 gene 互相 repress', 'tb', 'middle');
  o += rect(30, 62, 70, 30, 'wash', 4) + text(65, 82, 'gene U', 't', 'middle');
  o += rect(130, 62, 70, 30, 'wash', 4) + text(165, 82, 'gene V', 't', 'middle');
  o += path('M70 94 C70 122, 160 122, 160 100', 'ln') + line(153, 99, 167, 99, 'ln');
  o += path('M160 60 C160 36, 70 36, 70 56', 'ink') + line(63, 57, 77, 57, 'ink');
  o += text(115, 132, 'U 关掉 V', 'ts', 'middle') + text(115, 34, 'V 关掉 U', 'ts', 'middle');
  o += text(20, 162, 'du/dt = α/(1 + v' + sup('2') + ') − u', 't', 'start');
  o += text(20, 182, 'dv/dt = α/(1 + u' + sup('2') + ') − v', 't', 'start');
  o += text(20, 202, 'α = 3', 't', 'start');
  o += circle(26, 224, 5, 'ink-f') + text(38, 228, 'stable：(2.62, 0.38)、(0.38, 2.62)', 'ts', 'start');
  o += circle(26, 246, 5, 'paper') + text(38, 250, 'saddle：(1.21, 1.21)', 'ts', 'start');
  o += line(20, 270, 36, 270, 'dash') + text(42, 274, 'separatrix u = v', 'ts', 'start');
  o += text(20, 304, '起点在对角线哪一侧，', 'ts', 'start') + text(20, 320, '就落到哪一个 stable state。', 'ts', 'start');
  // 右：phase plane
  o += axes({ sx, sy, x0: 0, x1: 3.2, y0: 0, y1: 3.2, xt: [0, 1, 2, 3], yt: [1, 2, 3] });
  o += text(540, 334, 'u', 'ts', 'end') + text(254, 18, 'v', 'ts', 'start');
  o += line(sx(0), sy(0), sx(3.2), sy(3.2), 'dash');
  // nullcline：u = α/(1+v²)（du/dt = 0），v = α/(1+u²)
  const nu = [], nv = [];
  for (let k = 0; k <= 200; k++) { const s = (3.2 * k) / 200; nu.push([sx(TA / (1 + s * s)), sy(s)]); nv.push([sx(s), sy(TA / (1 + s * s))]); }
  o += path(d(nu), 'ink-b') + path(d(nv), 'ink-b');
  o += text(sx(TA / (1 + 3.1 * 3.1)) + 8, sy(3.1) + 4, 'du/dt = 0', 'ts', 'start');
  o += line(sx(2.4), sy(TA / (1 + 2.4 * 2.4)), sx(2.5), sy(1.0), 'mute') + text(sx(2.5), sy(1.0) - 5, 'dv/dt = 0', 'ts', 'middle');
  const lo = (3 - Math.sqrt(5)) / 2, hi = (3 + Math.sqrt(5)) / 2, mid = 1.2134;
  // 轨迹
  const starts = [[0.15, 0.6], [1.35, 1.05], [1.05, 1.35], [3.0, 2.7], [2.7, 3.0], [0.6, 0.15], [2.0, 0.05], [0.05, 2.0]];
  const h = 0.02, N = 300, Tan = 7, hold = 2, Ttot = Tan + hold;
  const frames = 60;
  const kt = []; for (let k = 0; k <= frames; k++) kt.push((k / frames) * (Tan / Ttot)); kt.push(1);
  starts.forEach((s) => {
    const tr = rk4(togF, s, h, N);
    o += path(d(tr.filter((_, i) => i % 3 === 0 || i === N).map(([u, v]) => [sx(u), sy(v)])), 'mute');
    const idx = []; for (let k = 0; k <= frames; k++) idx.push(Math.round(N * (1 - Math.exp(-4 * k / frames)) / (1 - Math.exp(-4))));
    idx.push(N);
    const xs = idx.map((i) => sx(tr[i][0])), ys = idx.map((i) => sy(tr[i][1]));
    o += circle(sx(s[0]), sy(s[1]), 2.5, 'mute-f');
    o += acircle(xs, ys, kt, Ttot, 4.5, s[0] > s[1] ? 'ln-f' : 'solid2');
  });
  o += circle(sx(hi), sy(lo), 6, 'ink-f') + circle(sx(lo), sy(hi), 6, 'ink-f') + circle(sx(mid), sy(mid), 6, 'paper');
  return svgA(560, 340, o, '动图：toggle switch 的 phase plane。两条 nullcline 交于三点，两个 stable state 在两端，saddle 在对角线上；八个起点出发的点沿轨迹走，对角线以下的落到 u 高，以上的落到 v 高');
}

// ---------- 第 6 站：Gillespie 的一条 trajectory ----------
function gillespieA() {
  const T = 30, { ev } = birthDeath(2, 0.5, 0, T, 2234);
  const Tan = 10, hold = 1.5, Ttot = Tan + hold;
  let o = '';
  // 左：cell 和 mRNA
  o += rect(18, 40, 170, 170, 'paper', 46) + text(103, 26, '一个 cell 里的 mRNA', 'tb', 'middle');
  const R = rng(5), slots = [];
  while (slots.length < 12) {
    const x = 44 + R() * 112, y = 66 + R() * 118;
    if (slots.every(([a, b]) => Math.abs(a - x) < 30 ? Math.abs(b - y) > 18 : true)) slots.push([x, y]);
  }
  slots.forEach(([x, y], i) => {
    const sq = []; for (let k = 0; k <= 12; k++) sq.push([x + k * 2, y + 3 * Math.sin(k * 1.05)]);
    const tr = [0], vals = [ev[0][1] > i ? 1 : 0];
    for (let e = 1; e < ev.length; e++) {
      const on = ev[e][1] > i ? 1 : 0;
      if (on !== vals[vals.length - 1]) { tr.push((ev[e][0] / T) * (Tan / Ttot)); vals.push(on); }
    }
    o += `<path d="${d(sq)}" class="ln" opacity="${vals[0]}">${anim('opacity', vals, tr, Ttot, true)}</path>`;
  });
  o += text(103, 232, '产生：rate k = 2 /min', 'ts', 'middle') + text(103, 248, '每个分解：rate γ = 0.5 /min', 'ts', 'middle');
  // 右：n(t)
  const sx = lin(0, T, 240, 540), sy = lin(0, 10, 220, 40);
  o += axes({ sx, sy, x0: 0, x1: T, y0: 0, y1: 10, xt: [0, 10, 20, 30], yt: [0, 2, 4, 6, 8, 10], grid: true, xl: 't（min）' });
  o += text(240, 28, 'mRNA 个数 n(t)', 'tb', 'start');
  const st = []; for (let e = 0; e < ev.length; e++) { if (e) st.push([sx(ev[e][0]), sy(ev[e - 1][1])]); st.push([sx(ev[e][0]), sy(ev[e][1])]); }
  st.push([sx(T), sy(ev[ev.length - 1][1])]);
  o += path(d(st), 'mute');
  o += `<clipPath id="lsm2234-gclip"><rect x="236" y="30" width="0" height="200">${anim('width', [0, 304, 304], [0, Tan / Ttot, 1], Ttot)}</rect></clipPath>`;
  o += `<g clip-path="url(#lsm2234-gclip)">${path(d(st), 'ln')}</g>`;
  o += line(sx(0), sy(4), sx(T), sy(4), 'dash') + text(sx(T), sy(4) - 6, 'k/γ = 4', 'ts', 'end');
  const cx = [sx(0), sx(T), sx(T)];
  o += `<line x1="${f1(sx(0))}" y1="40" x2="${f1(sx(0))}" y2="220" class="axis">${anim('x1', cx.map(f1), [0, Tan / Ttot, 1], Ttot)}${anim('x2', cx.map(f1), [0, Tan / Ttot, 1], Ttot)}</line>`;
  o += text(390, 274, '每一步只 +1 或 −1；什么时候跳、往哪跳都是随机的。', 'ts', 'middle');
  return svgA(560, 282, o, '动图：用 Gillespie algorithm 模拟一个 cell 里的 mRNA 个数。左边的 mRNA 随事件出现和消失，右边 trajectory 逐步画出，围绕平均值 4 上下跳');
}

// ---------- 第 6 站：constitutive 与 bursty，mean 相同 ----------
function burst() {
  const T = 300;
  const A = birthDeath(10, 0.1, 100, T, 31).ev, B = bursty(1, 10, 0.1, 100, T, 47);
  let o = '';
  const row = (y0, ev, title, pmf, lab) => {
    const sx = lin(0, T, 50, 380), sy = lin(0, 280, y0 + 110, y0);
    o += text(50, y0 - 10, title, 'tb', 'start');
    o += axes({ sx, sy, x0: 0, x1: T, y0: 0, y1: 260, xt: y0 > 100 ? [0, 100, 200, 300] : [], yt: [0, 100, 200], grid: true });
    // 每 0.5 min 取一次当时的个数
    const st = []; let e = 0;
    for (let k = 0; k <= 600; k++) { const t = k * 0.5; while (e + 1 < ev.length && ev[e + 1][0] <= t) e++; st.push([sx(t), sy(ev[e][1])]); }
    o += path(d(st), 'ln') + line(sx(0), sy(100), sx(T), sy(100), 'dash');
    // 右：steady-state distribution（横着画）
    const mx = Math.max(...pmf);
    const hx = lin(0, mx, 410, 520);
    for (let b = 0; b < 28; b++) { let s = 0; for (let k = b * 10; k < b * 10 + 10; k++) s += pmf[k] || 0; s /= 10; o += rect(410, sy(b * 10 + 10) + 0.5, hx(s) - 410, sy(b * 10) - sy(b * 10 + 10) - 1, 'wash-strong'); }
    o += line(410, sy(0), 410, sy(280), 'axis');
    o += text(470, y0 + 8, lab, 'ts', 'middle');
  };
  const pois = []; { let lp = -100; for (let k = 0; k <= 280; k++) { if (k) lp += Math.log(100) - Math.log(k); pois.push(Math.exp(lp)); } }
  const nb = []; { const r = 10, p = 100 / 110; let lp = r * Math.log(1 - p); for (let k = 0; k <= 280; k++) { if (k) lp += Math.log(p) + Math.log(k - 1 + r) - Math.log(k); nb.push(Math.exp(lp)); } }
  row(26, A, '一次产生一个：rate 10 /min', pois, 'Fano = 1，SD = 10');
  row(172, B, 'Burst：每分钟一次，平均一次 10 个', nb, 'Fano = 11，SD = 33');
  o += text(380, 312, 't（min）', 'ts', 'end');
  o += text(280, 332, '两种情况 mean 都是 100（虚线），每个 protein 都以 0.1 /min 消失；右边是 steady-state distribution。', 'ts', 'middle');
  return svg(560, 340, o, '两条 protein 个数的 trajectory，mean 都是 100：一次产生一个时在 100 附近小幅波动，分布窄；成批产生时忽高忽低，分布宽得多');
}

// ---------- 第 3 站：一群 random walker 散开 ----------
function walkA() {
  const M = 30, steps = 40, all = walkers(M, steps, 99);
  const Tan = 8, hold = 2, Ttot = Tan + hold;
  const kt = []; for (let k = 0; k <= steps; k++) kt.push((k / steps) * (Tan / Ttot)); kt.push(1);
  const C = [140, 160], s = 22; // 1 µm = 22 px
  let o = text(140, 22, '30 个 particle，从同一点出发', 'tb', 'middle');
  o += rect(C[0] - 128, C[1] - 128, 256, 256, 'frame');
  o += line(C[0] - 4, C[1], C[0] + 4, C[1], 'mute') + line(C[0], C[1] - 4, C[0], C[1] + 4, 'mute');
  const rs = []; for (let k = 0; k <= steps; k++) rs.push(f1(s * Math.sqrt(4 * DW * k * DT))); rs.push(rs[steps]);
  o += `<circle cx="${C[0]}" cy="${C[1]}" r="${rs[0]}" class="ln-dash">${anim('r', rs, kt, Ttot)}</circle>`;
  for (const tr of all) {
    const xs = tr.map((p) => C[0] + s * Math.max(-5.6, Math.min(5.6, p[0]))), ys = tr.map((p) => C[1] + s * Math.max(-5.6, Math.min(5.6, p[1])));
    xs.push(xs[steps]); ys.push(ys[steps]);
    o += acircle(xs, ys, kt, Ttot, 3.2, 'ink-f');
  }
  o += line(C[0] - 120, C[1] + 140, C[0] - 120 + 2 * s, C[1] + 140, 'ink-b') + text(C[0] - 120 + s, C[1] + 156, '2 µm', 'ts', 'middle');
  o += text(C[0] + 128, C[1] + 156, '虚线圆：半径 √(4Dt)', 'ts', 'end');
  // 右：MSD
  const sx = lin(0, 4, 330, 540), sy = lin(0, 10, 260, 50);
  o += axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 10, xt: [0, 1, 2, 3, 4], yt: [0, 2, 4, 6, 8, 10], grid: true, xl: 't（s）' });
  o += text(330, 38, '平均 r²（µm²）', 'tb', 'start');
  o += path(curve((t) => 4 * DW * t, 0, 4, sx, sy), 'dash') + text(sx(3.9), sy(4 * DW * 3.9) - 8, '4Dt', 'ts', 'end');
  const ms = []; for (let k = 0; k <= steps; k++) ms.push(all.reduce((a, tr) => a + tr[k][0] ** 2 + tr[k][1] ** 2, 0) / M);
  o += path(d(ms.map((m, k) => [sx(k * DT), sy(m)])), 'ln');
  const xs = ms.map((_, k) => sx(k * DT)), ys = ms.map((m) => sy(m)); xs.push(xs[steps]); ys.push(ys[steps]);
  o += acircle(xs, ys, kt, Ttot, 5, 'ln-f');
  o += text(435, 318, 'D = 0.5 µm²/s，每 0.1 s 一帧', 'ts', 'middle');
  return svgA(560, 326, o, '动图：30 个 particle 从中心开始做 2D random walk，云团越散越开，虚线圆半径按根号 4Dt 增长；右边 30 个 particle 的平均 r 平方随时间近似沿 4Dt 直线增长');
}

// ---------- 第 3 站：一条 track 的 MSD ----------
function track() {
  const tr = walkers(1, 200, 2234)[0];
  const ms = msdOf(tr, 20);
  let o = text(130, 20, '一条 track：200 帧，每帧 0.1 s', 'tb', 'middle');
  const xs = tr.map((p) => p[0]), ys = tr.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 1.1;
  const sc = 220 / span, P = ([x, y]) => [130 + (x - cx) * sc, 140 - (y - cy) * sc];
  o += rect(20, 30, 220, 220, 'frame');
  o += path(d(tr.map(P)), 'ln');
  const a = P(tr[0]), b = P(tr[200]);
  o += circle(a[0], a[1], 5, 'ink-f') + circle(b[0], b[1], 5, 'paper');
  o += circle(130, 262, 5, 'ink-f') + text(140, 266, 'start', 'ts', 'start') + circle(190, 262, 5, 'paper') + text(200, 266, 'end', 'ts', 'start');
  o += line(30, 266, 30 + sc, 266, 'ink-b') + text(30 + sc / 2, 282, '1 µm', 'ts', 'middle');
  // 右：MSD(lag)
  const sx = lin(0, 2, 320, 540), sy = lin(0, 6, 250, 40);
  o += axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 6, xt: [0, [0.5, '0.5'], 1, [1.5, '1.5'], 2], yt: [0, 2, 4, 6], grid: true, xl: 'lag τ（s）' });
  o += text(320, 28, 'MSD(τ)（µm²）', 'tb', 'start');
  o += path(curve((t) => 4 * DW * t, 0, 2, sx, sy), 'dash');
  ms.forEach((m, i) => { o += circle(sx((i + 1) * DT), sy(m), 3, i < 4 ? 'ln-f' : 'ink-f'); });
  let num = 0, den = 0; for (let i = 0; i < 4; i++) { const t = (i + 1) * DT; num += t * ms[i]; den += t * t; }
  const Dfit = num / den / 4;
  o += path(curve((t) => 4 * Dfit * t, 0, 2, sx, sy), 'ln');
  o += text(sx(0.05), sy(5.5), '彩线：用前 4 个 lag 拟合，D = ' + Dfit.toFixed(2), 'tl', 'start');
  o += text(sx(0.05), sy(5.5) + 20, '虚线：真实的 4Dτ，D = 0.5', 'ts', 'start');
  return svg(560, 292, o, '左边是一条模拟的 2D track；右边是由它算出的 MSD 对 lag 的点，前四个 lag 拟合出的 D 接近真实值 0.5');
}

export default {
  'lsm2234-intro': intro,
  'lsm2234-scales': scales,
  'lsm2234-lattice': lattice,
  'lsm2234-poiseuille': poiseuille,
  'lsm2234-debye': debye,
  'lsm2234-membrane': membraneFig,
  'lsm2234-spectrum': spectrum,
  'lsm2234-trap': trapA,
  'lsm2234-growth': growthA,
  'lsm2234-phaseline': phaseline,
  'lsm2234-euler': euler,
  'lsm2234-enzyme': enzymeA,
  'lsm2234-mm': mm,
  'lsm2234-hill': hill,
  'lsm2234-gene': geneA,
  'lsm2234-toggle': toggleA,
  'lsm2234-gillespie': gillespieA,
  'lsm2234-burst': burst,
  'lsm2234-walk': walkA,
  'lsm2234-track': track,
};
