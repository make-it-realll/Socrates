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

export const sims = { logistic, enzymeRun, lbFit, nlsFit, narRun, birthDeath, bursty, walkers, msdOf, togF, rk4 };

// ---------- 开头：三次“模型不够用” ----------
function intro() {
  let o = '';
  const W = 150, H = 110, top = 46;
  // ① 增长
  {
    const x0 = 28, sx = lin(0, 360, x0, x0 + W), sy = lin(0, 1.6e9, top + H, top);
    o += text(x0 + W / 2, 18, '① 增长会停下', 'tb', 'middle');
    o += line(x0, top + H, x0 + W, top + H, 'axis') + line(x0, top + H, x0, top, 'axis');
    const ex = (t) => N01 * Math.exp(R1 * t);
    o += path(curve(ex, 0, 213, sx, sy), 'dash') + path(curve(logistic, 0, 360, sx, sy), 'ln');
    o += text(sx(214) + 5, top + 10, 'rN 外推', 'ts', 'start');
    o += text(sx(360), sy(1e9) - 10, '实际停住', 'ts', 'end');
    o += text(x0 + W, top + H + 16, 't（min）', 'ts', 'end') + text(x0 - 4, top - 6, 'N', 'ts', 'start');
    o += text(x0 + W / 2, top + H + 36, '每 20 min 翻倍的 E. coli', 'ts', 'middle');
  }
  // ② 速率
  {
    const x0 = 214, sx = lin(0, 100, x0, x0 + W), sy = lin(0, 0.14, top + H, top);
    o += text(x0 + W / 2, 18, '② 速率会饱和', 'tb', 'middle');
    o += line(x0, top + H, x0 + W, top + H, 'axis') + line(x0, top + H, x0, top, 'axis');
    o += path(curve((s) => 0.01 * s, 0, 14, sx, sy), 'dash') + path(curve((s) => mmV(s, 0.1, 10), 0, 100, sx, sy), 'ln');
    o += text(sx(14) + 5, top + 10, '正比于 [S] 外推', 'ts', 'start');
    o += text(sx(100), sy(0.091) - 12, '实际趋于上限', 'ts', 'end');
    o += text(x0 + W, top + H + 16, '[S]', 'ts', 'end') + text(x0 - 4, top - 6, 'v', 'ts', 'start');
    o += text(x0 + W / 2, top + H + 36, '一种 enzyme，加多少 substrate', 'ts', 'middle');
  }
  // ③ 噪声：negative binomial，mean 100，variance 1100（第 5 站的 burst 模型）
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
  return svg(560, 200, o, '三个小图：bacteria 的数量按 exponential 外推会冲上天，实际停在上限；enzyme 的反应速率随 substrate 增加而饱和；genotype 和环境都相同的 cell，protein 个数分布很宽');
}

// ---------- 第 1 站：culture 里的 cell 和 N(t) 同步 ----------
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

// ---------- 第 1 站：phase line ----------
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

// ---------- 第 1 站 :::wrong：Euler 步长太大 ----------
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

// ---------- 第 2 站：enzyme 的两种 time scale ----------
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

// ---------- 第 2 站 :::wrong：Lineweaver–Burk ----------
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

// ---------- 第 3 站：Hill function ----------
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

// ---------- 第 3 站：simple regulation 与 negative autoregulation ----------
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

// ---------- 第 4 站：toggle switch 的 phase plane ----------
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

// ---------- 第 5 站：Gillespie 的一条 trajectory ----------
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

// ---------- 第 5 站：constitutive 与 bursty，mean 相同 ----------
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

// ---------- 第 6 站：一群 random walker 散开 ----------
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

// ---------- 第 6 站：一条 track 的 MSD ----------
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
