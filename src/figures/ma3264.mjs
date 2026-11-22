import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, acircle, ashow, anim, animRot, f1 } from '../lib/svg.mjs';

// ---------- 数值工具 ----------
// RK4：f(t, y) 返回导数数组；返回 [t, y] 的序列
function rk4(f, y0, t0, t1, n) {
  const h = (t1 - t0) / n, out = [[t0, y0.slice()]];
  let y = y0.slice(), t = t0;
  const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
  for (let i = 0; i < n; i++) {
    const k1 = f(t, y), k2 = f(t + h / 2, add(y, k1, h / 2)), k3 = f(t + h / 2, add(y, k2, h / 2)), k4 = f(t + h, add(y, k3, h));
    y = y.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    t += h;
    out.push([t, y.slice()]);
  }
  return out;
}
// complete elliptic integral K(k)，用 AGM
const ellipK = (k) => { let a = 1, b = Math.sqrt(1 - k * k); for (let i = 0; i < 30; i++) { const a2 = (a + b) / 2; b = Math.sqrt(a * b); a = a2; } return Math.PI / (2 * a); };
const fmt = (v, n = 0) => v.toLocaleString('en-US', { minimumFractionDigits: n, maximumFractionDigits: n });
const neg = (s) => String(s).replace('-', '−');
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;

// ---------- 开头：sandhill crane ----------
function crane() {
  const B = 0.09866, K = 194600;
  const sx = lin(0, 40, 70, 400), sy = lin(0, 210, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 40, y0: 0, y1: 210, xt: [0, 10, 20, 30, 40], yt: [[0, '0'], [50, '50k'], [100, '100k'], [150, '150k'], [200, '200k']], grid: true, xl: 'year' });
  o += text(76, 22, 'crane population N', 'ts');
  const run = (H) => rk4((t, y) => [B * y[0] * (1 - y[0] / K) - H], [K], 0, 40, 4000).filter(([, y]) => y[0] >= 0);
  const plot = (H, cls) => { const pts = run(H).filter((_, i) => i % 25 === 0).map(([t, y]) => [sx(t), sy(y[0] / 1000)]); o += path(d(pts), cls); return run(H); };
  o += line(sx(0), sy(K / 1000), sx(40), sy(K / 1000), 'mute');
  const r4 = plot(4000, 'ink'), r10 = plot(10000, 'ln');
  const tEnd = r10[r10.length - 1][0];
  o += circle(sx(tEnd), sy(0), 4, 'ln-f');
  o += text(410, sy(K / 1000) + 4, 'H = 0', 'ts');
  const e4 = r4[r4.length - 1][1][0];
  o += text(410, sy(e4 / 1000) + 4, 'H = 4,000 / yr', 't') + text(410, sy(e4 / 1000) + 20, `第 40 年 ${fmt(e4 / 1000, 0)}k，趋向 137k`, 'ts');
  o += text(sx(tEnd) + 8, sy(0) - 30, 'H = 10,000 / yr', 'tl') + text(sx(tEnd) + 8, sy(0) - 14, `第 ${tEnd.toFixed(1)} 年灭绝`, 'ts');
  return svg(560, 252, o, '从 194,600 只出发：不打猎时保持不变；每年打 4000 只时缓慢下降，趋向约 137,000；每年打 10,000 只时在第 29.8 年降到 0');
}

// ---------- 开头：paradox of pesticides（Lotka–Volterra 的 center 被挪动） ----------
function lvOrbit(a, b, c, dd, L0, Z0) {
  // dL/dt = c L Z - dd L ;  dZ/dt = a Z - b L Z
  const f = (t, y) => [c * y[0] * y[1] - dd * y[0], a * y[1] - b * y[0] * y[1]];
  const s = rk4(f, [L0, Z0], 0, 30, 6000);
  // 截取一个 period：回到起点附近（角度绕满一圈）
  const cx = a / b, cy = dd / c; // L* = a/b，Z* = dd/c
  let ang0 = Math.atan2(Z0 - cy, L0 - cx), acc = 0, prev = ang0, out = [];
  for (const [t, y] of s) {
    const ang = Math.atan2(y[1] - cy, y[0] - cx);
    let da = ang - prev; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
    acc += da; prev = ang; out.push([t, y]);
    if (Math.abs(acc) >= 2 * Math.PI) break;
  }
  return out;
}
function pest0() {
  const sx = lin(0, 2.6, 70, 330), sy = lin(0, 2.6, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2.6, y0: 0, y1: 2.6, xt: [0.5, 1, 1.5, 2, 2.5], yt: [0.5, 1, 1.5, 2, 2.5], grid: true, xl: 'predator L' });
  o += text(76, 22, 'prey Z（pest）', 'ts');
  const k = 0.2, P0 = [1, 0.45];
  const before = lvOrbit(1, 1, 1, 1, ...P0), after = lvOrbit(1 - k, 1, 1, 1 + k, ...P0);
  o += path(d(before.filter((_, i) => i % 8 === 0).map(([, y]) => [sx(y[0]), sy(y[1])])) + 'Z', 'ink') + path(d(after.filter((_, i) => i % 8 === 0).map(([, y]) => [sx(y[0]), sy(y[1])])) + 'Z', 'ln');
  o += circle(sx(1), sy(1), 4.5, 'ink-f');
  // 喷药后：dL/dt = LZ − (1+k)L → Z* = 1+k；dZ/dt = (1−k)Z − LZ → L* = 1−k
  o += circle(sx(1 - k), sy(1 + k), 4.5, 'ln-f');
  o += circle(sx(P0[0]), sy(P0[1]), 3, 'paper') + text(sx(P0[0]) + 8, sy(P0[1]) + 14, '喷药那一刻的状态', 'ts');
  o += text(sx(1) + 8, sy(1) + 16, '(1, 1)', 'ts');
  o += text(sx(1 - k) + 8, sy(1 + k) - 6, '(0.8, 1.2)', 'tl');
  o += text(350, 70, '黑：不喷药', 't') + text(350, 88, '一个 cycle 里 Z 的平均值 = 1', 'ts');
  o += text(350, 124, '彩：两种都按 rate 0.2 杀', 'tl') + text(350, 142, '一个 cycle 里 Z 的平均值 = 1.2', 'ts');
  o += text(350, 178, '杀虫药同时杀 predator 和 pest，', 'ts') + text(350, 194, 'pest 的平均数量反而多了 20%。', 'ts');
  return svg(560, 282, o, 'Lotka–Volterra 的 closed orbit：喷药前围绕 (1,1)，喷药后围绕 (0.8,1.2)；pest 的平均数量从 1 升到 1.2');
}

// ---------- 开头 / 第 4 站：ÿ + ½ cos y = 0 ----------
function cosy() {
  const G0 = Math.log(Math.SQRT2 + 1);
  const yTrue = (t) => 2 * Math.atan(Math.sinh(t / Math.SQRT2 + G0)) - Math.PI / 2;
  const num = rk4((t, u) => [u[1], -0.5 * Math.cos(u[0])], [0, 1], 0, 40, 400);
  const sx = lin(0, 40, 70, 520), sy = lin(-0.5, 8.5, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 40, y0: -0.5, y1: 8.5, xt: [0, 10, 20, 30, 40], yt: [[0, '0'], [Math.PI / 2, 'π/2'], [Math.PI, 'π'], [2 * Math.PI, '2π']], grid: false, xl: 't' });
  o += line(sx(0), sy(Math.PI / 2), sx(40), sy(Math.PI / 2), 'dash');
  o += path(curve(yTrue, 0, 40, sx, sy), 'ink-b');
  o += path(d(num.map(([t, u]) => [sx(t), sy(u[0])])), 'ln');
  o += text(76, 22, 'y', 'ts');
  const yAt30 = num[300][1][0];
  o += text(sx(31), sy(yAt30) - 8, 'RK4，step 0.1：越过 π/2 后一去不回', 'tl', 'end');
  o += text(sx(39), sy(Math.PI / 2) + 22, 'exact solution：永远到不了 π/2', 't', 'end');
  return svg(560, 262, o, '同一个 initial value problem：exact solution 从下方趋近 π/2 永远到不了；步长 0.1 的 RK4 数值解在 t 约 12 时越过 π/2，一路往上走');
}

// ---------- 第 1 站：pendulum 与 Π theorem ----------
function pendDim() {
  let o = '';
  const P = [120, 40], l = 150, th = 38 * Math.PI / 180;
  const Bp = [P[0] + l * Math.sin(th), P[1] + l * Math.cos(th)];
  o += rect(60, 28, 120, 12, 'wash2') + line(60, 40, 180, 40, 'ink');
  o += line(P[0], P[1], P[0], P[1] + l + 10, 'dash');
  o += line(P[0], P[1], Bp[0], Bp[1], 'ink-b') + circle(Bp[0], Bp[1], 13, 'solid');
  const arc = []; for (let k = 0; k <= 20; k++) { const a = th * k / 20; arc.push([P[0] + 50 * Math.sin(a), P[1] + 50 * Math.cos(a)]); }
  o += path(d(arc), 'ink') + text(P[0] + 20, P[1] + 70, 'θ' + sub('0'), 't', 'middle');
  o += text((P[0] + Bp[0]) / 2 + 10, (P[1] + Bp[1]) / 2 - 4, it('l'), 't');
  o += text(Bp[0] + 18, Bp[1] + 5, it('m'), 't');
  o += arrow(Bp[0], Bp[1] + 18, Bp[0], Bp[1] + 56, 'ink') + text(Bp[0] + 8, Bp[1] + 48, it('g'), 't');
  o += text(120, 268, '[τ] = T，[l] = L，[g] = L T⁻²，[m] = M', 'ts', 'middle');
  // 右：F(θ0)
  const sx = lin(0, 180, 280, 540), sy = lin(0.9, 3, 230, 40);
  o += axes({ sx, sy, x0: 0, x1: 180, y0: 0.9, y1: 3, xt: [[0, '0°'], [45, '45°'], [90, '90°'], [135, '135°'], [180, '180°']], yt: [[1, '1'], [1.5, '1.5'], [2, '2'], [2.5, '2.5'], [3, '3']], grid: true, xl: 'amplitude θ₀' });
  const F = (deg) => (2 / Math.PI) * ellipK(Math.sin((deg * Math.PI / 180) / 2));
  o += path(curve(F, 0.5, 172, sx, sy, 300), 'ln');
  for (const a of [10, 90, 150]) o += circle(sx(a), sy(F(a)), 3.5, 'ink-f');
  o += text(sx(10) + 6, sy(F(10)) - 8, `10°：${F(10).toFixed(3)}`, 'ts');
  o += text(sx(90) - 4, sy(F(90)) - 10, `90°：${F(90).toFixed(3)}`, 'ts', 'end');
  o += text(sx(150) - 6, sy(F(150)) - 4, `150°：${F(150).toFixed(2)}`, 'ts', 'end');
  o += text(284, 30, 'τ ÷ 2π√(l / g)', 'ts');
  o += text(410, 276, '曲线用 elliptic integral 算出', 'ts', 'middle');
  return svg(560, 280, o, '左边是 pendulum 的四个量；右边是 period 与 2π√(l/g) 之比随 amplitude 的变化：10 度时 1.002，90 度时 1.180，150 度时 1.76');
}

// ---------- 第 1 站：Taylor 的 blast wave ----------
function blast() {
  const E = 1e14, rho = 1.2, R = (t) => Math.pow(E / rho, 0.2) * Math.pow(t, 0.4);
  const G = [180, 230], s = 1.05;
  let o = line(20, G[1], 360, G[1], 'ink-b');
  const ts = [0.001, 0.004, 0.01, 0.025];
  for (const t of ts) {
    const r = R(t) * s, pts = [];
    for (let k = 0; k <= 60; k++) { const a = Math.PI * k / 60; pts.push([G[0] + r * Math.cos(a), G[1] - r * Math.sin(a)]); }
    o += path(d(pts), t === 0.025 ? 'ln' : 'ink');
    o += text(G[0], G[1] - r - 6, `${t * 1000} ms：${R(t).toFixed(0)} m`, t === 0.025 ? 'tl' : 'ts', 'middle');
  }
  o += circle(G[0], G[1], 3, 'ink-f');
  o += text(380, 70, 'R = (E / ρ)^{1/5} t^{2/5}', 'tb').replace('^{1/5}', '<tspan dy="-6" class="ts">1/5</tspan><tspan dy="6"> </tspan>').replace('^{2/5}', '<tspan dy="-6" class="ts">2/5</tspan><tspan dy="6"></tspan>');
  o += text(380, 96, 'E = 10¹⁴ J，ρ = 1.2 kg/m³，c = 1', 'ts');
  o += text(380, 130, '时间乘 2.5，radius 只乘', 'ts') + text(380, 146, `2.5<tspan dy="-6" class="ts">0.4</tspan><tspan dy="6"> = ${Math.pow(2.5, 0.4).toFixed(2)}：</tspan>`, 'ts') + text(380, 162, '火球越长越慢。', 'ts');
  o += text(380, 196, '反过来量出 R 和 t，', 'ts') + text(380, 212, '就能读出 E。', 'ts');
  return svg(560, 245, o, '按 R 等于 E 除以 rho 的五分之一次方乘 t 的五分之二次方画出 1、4、10、25 毫秒时的 shock 半径：约 38、67、96、139 米');
}

// ---------- 第 2 站：U–Th 衰变链 ----------
function decay() {
  const kU = Math.LN2 / 245000, kT = Math.LN2 / 75000;
  const ratio = (t) => (kU / (kT - kU)) * (1 - Math.exp((kU - kT) * t));
  let o = '';
  const box = (x, y, w, lab, note) => rect(x, y, w, 40, 'paper', 6) + text(x + w / 2, y + 18, lab, 'tb', 'middle') + text(x + w / 2, y + 33, note, 'ts', 'middle');
  o += box(20, 40, 120, '²³⁴U', 'half-life 245,000 yr');
  o += box(20, 120, 120, '²³⁰Th', 'half-life 75,000 yr');
  o += box(20, 200, 120, '更下游的产物', '衰变快，忽略');
  o += arrow(80, 82, 80, 118, 'ink') + text(90, 104, 'k' + sub('U') + ' U', 't');
  o += arrow(80, 162, 80, 198, 'ink') + text(90, 184, 'k' + sub('T') + ' T', 't');
  const sx = lin(0, 500000, 220, 540), sy = lin(0, 0.5, 230, 40);
  o += axes({ sx, sy, x0: 0, x1: 500000, y0: 0, y1: 0.5, xt: [[0, '0'], [100000, '100k'], [200000, '200k'], [300000, '300k'], [400000, '400k'], [500000, '500k yr']], yt: [0, 0.1, 0.2, 0.3, 0.4, 0.5], grid: true });
  o += line(sx(0), sy(kU / (kT - kU)), sx(500000), sy(kU / (kT - kU)), 'dash');
  o += text(sx(500000), sy(kU / (kT - kU)) - 6, `上限 k_U / (k_T − k_U) = ${(kU / (kT - kU)).toFixed(3)}`.replace('k_U', 'k' + sub('U')).replace('k_T', 'k' + sub('T')).replace('k_U', 'k' + sub('U')), 'ts', 'end');
  o += path(curve((t) => kU * t, 0, 0.18 / kU, sx, sy), 'mute');
  o += text(sx(0.18 / kU) + 6, sy(0.18) + 4, '只看 U 衰变：k' + sub('U') + ' t', 'ts');
  o += path(curve(ratio, 0, 500000, sx, sy), 'ln');
  const t1 = 40083;
  o += line(sx(0), sy(0.1), sx(t1), sy(0.1), 'mute') + line(sx(t1), sy(0.1), sx(t1), sy(0), 'mute') + circle(sx(t1), sy(0.1), 4, 'ln-f');
  o += text(sx(t1) + 8, sy(0.1) + 18, 'T / U = 0.1 → 40,083 yr', 'tl');
  o += text(224, 30, 'T / U', 'ts');
  return svg(560, 255, o, '左边是 uranium-234 衰变成 thorium-230 的链；右边是 T/U 随年龄的 curve：比值 0.1 对应 40,083 年，比值永远不超过 0.441');
}

// ---------- 第 2 站：CO2 tank 的 momentum effect（动图） ----------
function co2A() {
  const sol = rk4((t, y) => [100 / t - y[0] / 10], [0], 1, 61, 6000);
  const Qat = (t) => sol[Math.min(6000, Math.round((t - 1) * 100))][1][0];
  const N = 90, T = 9, tt = [], kt = [];
  for (let i = 0; i <= N; i++) { tt.push(1 + 60 * (i / N) ** 1.6); kt.push(i / N); }
  let o = '';
  // tank
  const TX = 34, TY = 70, TW = 110, TH = 150, qmax = 140;
  o += rect(TX, TY, TW, TH, 'paper');
  const lvl = (q) => { const h = TH * q / qmax; return d([[TX, TY + TH], [TX + TW, TY + TH], [TX + TW, TY + TH - h], [TX, TY + TH - h]]) + 'Z'; };
  o += apath(tt.map((t) => lvl(Qat(t))), kt, T, 'wash-strong');
  o += rect(TX, TY, TW, TH, 'frame');
  o += text(TX + TW / 2, TY + TH + 18, 'tank 里的 CO₂ 量 Q', 'ts', 'middle');
  o += text(TX + TW / 2, TY + 22, '100 m³，搅匀', 'ts', 'middle');
  // inflow concentration gauge
  o += arrow(TX - 32, TY + 20, TX - 2, TY + 20, 'ink') + arrow(TX + TW + 2, TY + TH - 20, TX + TW + 30, TY + TH - 20, 'ink');
  o += text(TX - 32, TY - 8, '10 m³/s 流入', 'ts', 'start');
  o += text(TX + TW + 4, TY + TH - 28, '10 m³/s 流出', 'ts');
  // gauge bar for inflow concentration 10/t
  const GX = 236, GY = 70, GH = 150;
  o += rect(GX, GY, 16, GH, 'frame');
  o += apath(tt.map((t) => { const h = GH * (10 / t) / 10; return d([[GX, GY + GH], [GX + 16, GY + GH], [GX + 16, GY + GH - h], [GX, GY + GH - h]]) + 'Z'; }), kt, T, 'solid');
  o += text(GX + 8, GY - 26, '流入浓度', 'ts', 'middle') + text(GX + 8, GY - 10, '10 / t', 'ts', 'middle');
  // plot
  const sx = lin(1, 61, 305, 545), sy = lin(0, 150, 220, 40);
  o += axes({ sx, sy, x0: 1, x1: 61, y0: 0, y1: 150, xt: [[1, '1'], [20, '20'], [40, '40'], [60, '60 s']], yt: [0, 50, 100, 150], grid: true });
  o += path(curve((t) => Math.min(150, 1000 / t), 6.7, 61, sx, sy), 'dash');
  o += text(sx(50), sy(1000 / 50) + 16, '1000 / t', 'ts', 'middle');
  o += path(d(sol.filter((_, i) => i % 20 === 0).map(([t, y]) => [sx(t), sy(y[0])])), 'ln');
  o += circle(sx(7.48), sy(133.7), 3, 'ink-f') + text(sx(7.48) + 6, sy(133.7) - 8, 'peak：t = 7.5，Q = 133.7', 'ts');
  o += acircle(tt.map(sx), tt.map((t) => sy(Qat(t))), kt, T, 5, 'ln-f');
  o += text(309, 30, 'Q(t)', 'ts');
  return svgA(560, 250, o, '动图：流入的浓度从 t 等于 1 起按 10/t 下降，tank 里的 CO2 量却先涨到 t 约 7.5 秒时的 133.7，再慢慢下降，并且一直待在 1000/t 之上');
}

// ---------- 第 3 站：logistic 与 harvesting 的 phase line ----------
function phaseline() {
  const s = 0.004, f = (N) => 1.5 * N - s * N * N, g = (N) => f(N) - 80;
  const sx = lin(0, 400, 70, 530), sy = lin(-90, 150, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 400, y0: -90, y1: 150, xt: [0, 100, 200, 300, 400], yt: [-80, -40, 0, 40, 80, 120], grid: true, xAt: 0 });
  o += text(546, sy(0) + 4, 'N', 'ts', 'middle');
  o += path(curve(f, 0, 400, sx, sy), 'ink') + path(curve(g, 0, 381, sx, sy), 'ln');
  o += text(sx(187), sy(f(187)) - 8, 'dN/dt = 1.5N − 0.004N²', 't', 'middle');
  o += text(sx(187), sy(g(187)) + 20, '减去 H = 80 之后', 'tl', 'middle');
  const e1 = 64.39, e2 = 310.61;
  o += circle(sx(0), sy(0), 4.5, 'paper') + circle(sx(375), sy(0), 4.5, 'ink-f');
  o += circle(sx(e1), sy(0), 4.5, 'paper') + circle(sx(e2), sy(0), 4.5, 'ln-f');
  o += text(sx(375) + 4, sy(0) - 10, '375', 'ts') + text(sx(e1), sy(0) + 18, '64.4', 'ts', 'middle') + text(sx(e2) - 6, sy(0) + 30, '310.6', 'ts', 'end');
  // phase line under axis (harvested)
  const y = 246;
  o += line(sx(0), y, sx(400), y, 'axis');
  o += arrow(sx(50), y, sx(10), y, 'ln') + arrow(sx(110), y, sx(270), y, 'ln') + arrow(sx(390), y, sx(330), y, 'ln');
  o += circle(sx(e1), y, 4.5, 'paper') + circle(sx(e2), y, 4.5, 'ln-f');
  o += text(sx(0), y + 18, 'harvest 后的 phase line：64.4 以下掉到 0，以上全部走向 310.6', 'ts');
  return svg(560, 270, o, 'dN/dt 对 N 的图：logistic 的 parabola 在 0 和 375 处为零；减去 80 之后 parabola 下移，零点变成 64.4（unstable）和 310.6（stable）');
}

// ---------- 第 3 站：harvesting 的 saddle-node bifurcation（动图） ----------
function harvestA() {
  const N = 72, T = 8, hs = [], kt = [];
  for (let i = 0; i <= N; i++) { const u = i / N; hs.push(0.3 * (u < 0.5 ? 2 * u : 2 - 2 * u)); kt.push(u); }
  let o = '';
  const sx = lin(0, 1, 50, 260), sy = lin(-0.32, 0.27, 220, 40);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: -0.32, y1: 0.27, xt: [0, 0.5, 1], yt: [[-0.3, '−0.3'], [0, '0'], [0.25, '0.25']], xAt: 0, xl: 'x' });
  o += text(54, 30, 'dx/dτ = x(1 − x) − h', 'ts');
  o += apath(hs.map((h) => curve((x) => x * (1 - x) - h, 0, 1, sx, sy, 80)), kt, T, 'ln');
  const lo = (h) => (h <= 0.25 ? (1 - Math.sqrt(1 - 4 * h)) / 2 : 0.5), hi = (h) => (h <= 0.25 ? (1 + Math.sqrt(1 - 4 * h)) / 2 : 0.5);
  const on = hs.map((h) => h <= 0.25);
  o += `<g>${acircle(hs.map((h) => sx(lo(h))), hs.map(() => sy(0)), kt, T, 5, 'paper')}${ashow(on, kt, T)}</g>`;
  o += `<g>${acircle(hs.map((h) => sx(hi(h))), hs.map(() => sy(0)), kt, T, 5, 'ln-f')}${ashow(on, kt, T)}</g>`;
  o += `<text x="155" y="250" class="tl" text-anchor="middle">h &gt; ¼：没有 equilibrium，x 一路掉到 0${ashow(on.map((v) => !v), kt, T)}</text>`;
  o += `<text x="155" y="250" class="ts" text-anchor="middle">实心 stable，空心 unstable${ashow(on, kt, T)}</text>`;
  // bifurcation diagram
  const bx = lin(0, 0.3, 320, 540), by = lin(0, 1, 220, 40);
  o += axes({ sx: bx, sy: by, x0: 0, x1: 0.3, y0: 0, y1: 1, xt: [0, 0.1, 0.2, [0.25, '¼'], 0.3], yt: [0, 0.5, 1], xl: 'h' });
  o += text(324, 30, 'equilibrium x*', 'ts');
  o += path(curve(hi, 0, 0.25, bx, by), 'ln') + path(curve(lo, 0, 0.25, bx, by), 'ln-dash');
  o += circle(bx(0.25), by(0.5), 4, 'ink-f') + text(bx(0.25) - 10, by(0.5) + 4, 'saddle-node', 'ts', 'end');
  o += text(bx(0.1), by(hi(0.1)) - 10, 'stable', 'ts') + text(bx(0.2), by(lo(0.2)) + 24, 'unstable', 'ts', 'middle');
  o += apath(hs.map((h) => d([[bx(h), by(0)], [bx(h), by(1)]])), kt, T, 'dash');
  return svgA(560, 262, o, '动图：harvest 强度 h 从 0 增大到 0.3 再回来；左边 parabola 下移，两个 equilibrium 相互靠近，在 h 等于四分之一处合并后消失；右边是 equilibrium 随 h 变化的 bifurcation diagram');
}

// ---------- 第 4 站：damped oscillator（动图） ----------
function dampA() {
  const xo = (t) => 2 * Math.exp(-t) - Math.exp(-2 * t);
  const xu = (t) => Math.exp(-2 * t) * (Math.cos(3 * t) + (2 / 3) * Math.sin(3 * t));
  const N = 100, Tm = 4, T = 7, ts = [], kt = [];
  for (let i = 0; i <= N; i++) { ts.push(Tm * i / N); kt.push((i / N) * (6 / 7)); }
  ts.push(Tm); kt.push(1);
  let o = '';
  const row = (y0, fx, title, note) => {
    const W = 30, X0 = 150, s = 70;
    o += rect(W - 10, y0 - 28, 10, 56, 'wash2') + line(W, y0 - 28, W, y0 + 28, 'ink');
    o += line(X0, y0 + 30, X0, y0 - 30, 'dash') + text(X0, y0 + 44, 'x = 0', 'ts', 'middle');
    const spring = (x) => { const end = X0 + s * x - 18, pts = [[W, y0]]; const n = 12, L = end - W; for (let k = 1; k < n; k++) pts.push([W + L * k / n, y0 + (k % 2 ? -9 : 9)]); pts.push([end, y0]); return d(pts); };
    o += apath(ts.map((t) => spring(fx(t))), kt, T, 'ink');
    o += apath(ts.map((t) => { const c = X0 + s * fx(t); return d([[c - 18, y0 - 18], [c + 18, y0 - 18], [c + 18, y0 + 18], [c - 18, y0 + 18]]) + 'Z'; }), kt, T, 'solid');
    o += text(20, y0 - 40, title, 'tb');
    // trace
    const sx = lin(0, Tm, 330, 545), sy = lin(-0.4, 1.05, y0 + 30, y0 - 34);
    o += line(sx(0), sy(0), sx(Tm), sy(0), 'axis') + line(sx(0), sy(-0.4), sx(0), sy(1.05), 'axis');
    o += text(sx(Tm), sy(0) + 14, 't = 4', 'ts', 'end') + text(sx(0) - 4, sy(1) + 4, '1', 'ts', 'end');
    o += path(curve(fx, 0, Tm, sx, sy), 'ln');
    o += acircle(ts.map(sx), ts.map((t) => sy(fx(t))), kt, T, 4, 'ln-f');
    o += text(330, y0 - 40, note, 'ts');
  };
  row(70, xo, 'x″ + 3x′ + 2x = 0：overdamped', 'λ = −1, −2：不越过 0，慢慢回去');
  row(200, xu, 'x″ + 4x′ + 13x = 0：underdamped', 'λ = −2 ± 3i：period 2π/3，envelope e⁻²ᵗ');
  o += text(280, 262, '两者都从 x(0) = 1、x′(0) = 0 放手', 'ts', 'middle');
  return svgA(560, 270, o, '动图：同样从 x 等于 1 静止放手，overdamped 的 block 不越过平衡位置慢慢回去，underdamped 的 block 越过平衡位置来回摆，振幅按 e 的负 2t 次方衰减');
}

// ---------- 第 4 站：amplitude response ----------
function resonance() {
  const A = (a, b) => 1 / Math.sqrt((1 - a * a) ** 2 + b * b * a * a);
  const sx = lin(0, 2, 70, 500), sy = lin(0, 5.6, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 5.6, xt: [[0, '0'], [0.5, '0.5ω'], [1, 'ω'], [1.5, '1.5ω'], [2, '2ω']], yt: [0, 1, 2, 3, 4, 5], grid: true, xl: 'forcing frequency α' });
  o += text(76, 22, 'amplitude A(α) ÷ (F₀ / k)', 'ts');
  for (const [b, cls] of [[0.2, 'ln'], [0.5, 'ink'], [1, 'ink'], [1.6, 'mute']]) {
    o += path(curve((a) => Math.min(5.6, A(a, b)), 0, 2, sx, sy, 400), cls);
    if (b < Math.SQRT2) {
      const ap = Math.sqrt(1 - b * b / 2), lab = `b = ${b}：peak ${A(ap, b).toFixed(2)}`;
      o += circle(sx(ap), sy(A(ap, b)), 3.5, 'ink-f');
      if (b === 1) o += line(sx(0.42), sy(2.05), sx(ap) - 3, sy(A(ap, b)) - 3, 'mute') + text(sx(0.42), sy(2.05) - 6, lab, 'ts', 'end');
      else o += text(sx(ap) + 8, sy(A(ap, b)) + 2, lab, b === 0.2 ? 'tl' : 'ts');
    }
    else o += text(sx(0.2), sy(0.4), `b = ${b} ≥ √2：没有 peak`, 'ts');
  }
  return svg(560, 272, o, 'Forced damped oscillator 的 amplitude response curve：b 等于 0.2 时 peak 约 5.03，0.5 时 2.07，1 时 1.15，b 不小于根号 2 时没有 peak');
}

// ---------- 第 4 站：oil tanker ----------
function tanker() {
  let o = '';
  const sea = 120;
  o += rect(20, sea, 520, 120, 'wash');
  o += line(20, sea, 540, sea, 'ln');
  o += text(536, sea - 6, 'sea level', 'ts', 'end');
  const X = 150, W = 220, top = 80, bot = 210;
  o += rect(X, top, W, bot - top, 'paper');
  o += rect(X, top, W, 8, 'solid');
  o += text(X + W / 2, top + 30, it('M') + '，cross-section ' + it('A'), 't', 'middle');
  // d
  o += line(X - 20, sea, X - 20, bot, 'ink') + line(X - 26, sea, X - 14, sea, 'ink') + line(X - 26, bot, X - 14, bot, 'ink') + text(X - 28, (sea + bot) / 2 + 4, 'd + x', 't', 'end');
  // H
  o += line(X + W + 20, top, X + W + 20, sea, 'ink') + line(X + W + 14, top, X + W + 26, top, 'ink') + line(X + W + 14, sea, X + W + 26, sea, 'ink') + text(X + W + 28, (top + sea) / 2 + 4, 'H − x', 't');
  o += arrow(X + W / 2 - 40, 140, X + W / 2 - 40, 200, 'ink') + text(X + W / 2 - 46, 196, 'Mg', 't', 'end');
  o += arrow(X + W / 2 + 40, 200, X + W / 2 + 40, 140, 'ln') + text(X + W / 2 + 46, 150, 'ρgA(d + x)', 'tl');
  o += text(280, 262, 'x 向下为正；静止时 x = 0，d = M / (ρA)；deck 在 x = H 时没入水中', 'ts', 'middle');
  return svg(560, 272, o, 'Oil tanker 的竖直剖面：船底在 sea level 下 d 加 x，deck 在 sea level 上 H 减 x；重力 Mg 向下，浮力 rho g A 乘 d 加 x 向上');
}

// ---------- 第 4 站：nonlinear pendulum 与 phase plane（动图） ----------
function pendA() {
  const sol = rk4((t, y) => [y[1], -Math.sin(y[0])], [1, 1], 0, 7.3495, 1470);
  const N = 98, step = 15, T = 7.35;
  const fr = []; for (let i = 0; i <= N; i++) fr.push(sol[Math.min(1470, i * step)]);
  const kt = fr.map((_, i) => i / N);
  let o = '';
  // left pendulum
  const P = [110, 60], l = 120;
  o += rect(60, 48, 100, 12, 'wash2') + line(60, 60, 160, 60, 'ink');
  o += line(P[0], P[1], P[0], P[1] + l + 20, 'dash');
  const thm = Math.acos(Math.cos(1) - 0.5);
  const arc = []; for (let k = -40; k <= 40; k++) { const a = thm * k / 40; arc.push([P[0] + l * Math.sin(a), P[1] + l * Math.cos(a)]); }
  o += path(d(arc), 'grid');
  const deg = fr.map(([, y]) => -y[0] * 180 / Math.PI);
  o += `<g>${line(P[0], P[1], P[0], P[1] + l, 'ink-b')}${circle(P[0], P[1] + l, 11, 'solid')}${animRot(deg, P[0], P[1], kt, T)}</g>`;
  o += text(110, 240, `摆到 θ = ±${thm.toFixed(2)} rad 折返`, 'ts', 'middle');
  o += text(110, 30, 'θ(0) = 1，θ′(0) = 1', 'tb', 'middle');
  // phase plane
  const sx = lin(-3.6, 3.6, 260, 548), sy = lin(-2.3, 2.3, 240, 30);
  o += line(sx(-3.6), sy(0), sx(3.6), sy(0), 'axis') + line(sx(0), sy(-2.3), sx(0), sy(2.3), 'axis');
  o += text(sx(3.6), sy(0) + 16, 'θ', 'ts', 'end') + text(sx(0) + 6, sy(2.2), 'θ′', 'ts');
  for (const v of [-Math.PI, Math.PI]) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), sy(0) + 16, v < 0 ? '−π' : 'π', 'ts', 'middle');
  o += path(curve((x) => 2 * Math.cos(x / 2), -Math.PI, Math.PI, sx, sy), 'dash') + path(curve((x) => -2 * Math.cos(x / 2), -Math.PI, Math.PI, sx, sy), 'dash');
  o += text(sx(1.9), sy(2 * Math.cos(0.95)) - 10, 'separatrix：E = 1', 'ts');
  o += path(d(sol.filter((_, i) => i % 5 === 0).map(([, y]) => [sx(y[0]), sy(y[1])])) + 'Z', 'ln');
  o += acircle(fr.map(([, y]) => sx(y[0])), fr.map(([, y]) => sy(y[1])), kt, T, 5, 'ln-f');
  o += circle(sx(Math.PI), sy(0), 4, 'paper') + circle(sx(-Math.PI), sy(0), 4, 'paper') + circle(sx(0), sy(0), 3, 'ink-f');
  o += text(sx(0), 258, '½θ′² − cos θ = ½ − cos 1 ≈ −0.040', 'ts', 'middle');
  return svgA(560, 266, o, '动图：pendulum 从 theta 等于 1、角速度 1 出发来回摆，最大 angle 1.53；右边 phase plane 上的点沿一条 closed curve 转圈，外面虚线是 energy 等于 1 的 separatrix');
}

// ---------- 第 5 站：两个 linear system 的 phase portrait ----------
function sysPP() {
  let o = '';
  const panel = (x0, f, starts, T, title, note, extra) => {
    const sx = lin(-3, 3, x0, x0 + 230), sy = lin(-3, 3, 250, 30);
    o += rect(x0, 30, 230, 220, 'frame');
    o += line(x0, sy(0), x0 + 230, sy(0), 'grid') + line(sx(0), 30, sx(0), 250, 'grid');
    if (extra) o += extra(sx, sy);
    for (const s of starts) {
      const all = rk4((t, y) => f(y), s, 0, T, 400).map(([, y]) => y);
      if (all.some((y) => Math.abs(y[0]) > 2.95 || Math.abs(y[1]) > 2.95)) continue;
      const tr = all;
      o += path(d(tr.map((y) => [sx(y[0]), sy(y[1])])), 'ln');
      const m = Math.min(tr.length - 2, 30), a = tr[m], b = tr[m + 1];
      o += arrow(sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1]), 'ln', 7);
    }
    o += text(x0 + 115, 20, title, 'tb', 'middle') + text(x0 + 115, 270, note, 'ts', 'middle');
  };
  panel(30, (y) => [y[1], -4 * y[0]], [[0.4, 0], [0.8, 0], [1.2, 0]], 3.2, 'Romeo–Juliet：R′ = J，J′ = −4R', 'tr = 0，det = 4：center，顺时针', (sx, sy) => text(sx(2.9), sy(0) - 6, 'R', 'ts', 'end') + text(sx(0) + 6, sy(2.8), 'J', 'ts'));
  const eig = (sx, sy) => line(sx(-3), sy(-3), sx(3), sy(3), 'dash') + line(sx(-3), sy(-2), sx(3), sy(2), 'dash') + text(sx(2.9), sy(0) + 14, 'x', 'ts', 'end') + text(sx(0) + 6, sy(2.8), 'y', 'ts');
  panel(300, (y) => [-4 * y[0] + 3 * y[1], -2 * y[0] + y[1]], Array.from({ length: 12 }, (_, k) => [2.8 * Math.cos((3 * k + 1) * Math.PI / 18), 2.8 * Math.sin((3 * k + 1) * Math.PI / 18)]), 6, 'x′ = −4x + 3y，y′ = −2x + y', '虚线：(1, 1) 是 λ = −1，(3, 2) 是 λ = −2', eig);
  return svg(560, 282, o, '左边 Romeo–Juliet 系统的 trajectory 是围绕 origin 的 ellipse，顺时针；右边 matrix 有 eigenvalue 负 1 和负 2，trajectory 都流向 origin，最后沿 (1,1) 方向进入');
}

// ---------- 第 6 站：Lotka–Volterra（动图） ----------
function lvA() {
  const orbit = lvOrbit(1, 1, 1, 1, 1, 0.4);
  const Tp = orbit[orbit.length - 1][0];
  const s = rk4((t, y) => [y[0] * y[1] - y[0], y[1] - y[0] * y[1]], [1, 0.4], 0, 2 * Tp, 4000);
  const N = 100, T = 9, fr = [], kt = [];
  for (let i = 0; i <= N; i++) { fr.push(s[Math.round(i * 4000 / N)]); kt.push(i / N); }
  let o = '';
  const sx = lin(0, 3, 50, 250), sy = lin(0, 3, 240, 40);
  o += axes({ sx, sy, x0: 0, x1: 3, y0: 0, y1: 3, xt: [0, 1, 2, 3], yt: [1, 2, 3], grid: true, xl: 'lions L' });
  o += text(56, 30, 'zebras Z', 'ts');
  o += path(d(orbit.filter((_, i) => i % 6 === 0).map(([, y]) => [sx(y[0]), sy(y[1])])) + 'Z', 'ln');
  o += circle(sx(1), sy(1), 4, 'ink-f') + text(sx(1) + 6, sy(1) + 16, '(1, 1)', 'ts');
  o += acircle(fr.map(([, y]) => sx(y[0])), fr.map(([, y]) => sy(y[1])), kt, T, 5, 'ln-f');
  const tx = lin(0, 2 * Tp, 300, 545), ty = lin(0, 3, 240, 40);
  o += axes({ sx: tx, sy: ty, x0: 0, x1: 2 * Tp, y0: 0, y1: 3, xt: [[0, '0'], [Tp, Tp.toFixed(2)], [2 * Tp, (2 * Tp).toFixed(2)]], yt: [1, 2, 3], xl: 't' });
  o += path(d(s.filter((_, i) => i % 10 === 0).map(([t, y]) => [tx(t), ty(y[0])])), 'ink-b') + path(d(s.filter((_, i) => i % 10 === 0).map(([t, y]) => [tx(t), ty(y[1])])), 'ln');
  const zmax = s.reduce((m, [t, y]) => (y[1] > m[1] ? [t, y[1]] : m), [0, 0]);
  o += text(tx(zmax[0]), ty(zmax[1]) - 8, 'Z', 'tl', 'middle');
  const lmax = s.reduce((m, [t, y]) => (t < Tp && y[0] > m[1] ? [t, y[0]] : m), [0, 0]);
  o += text(tx(lmax[0]), ty(lmax[1]) - 8, 'L', 'tb', 'middle');
  o += apath(fr.map(([t]) => d([[tx(t), ty(0)], [tx(t), ty(3)]])), kt, T, 'dash');
  return svgA(560, 272, o, `动图：L 等于 Z 等于 1 的 Lotka–Volterra，从 (1, 0.4) 出发，phase plane 上的点沿 closed orbit 转，右边 Z 的峰先到、L 的峰随后，period 约 ${Tp.toFixed(2)}`);
}

// ---------- 第 6 站：competing species ----------
function compete() {
  let o = '';
  const panel = (x0, f, eq, null1, null2, starts, title, note, sep) => {
    const X1 = 4.2, sx = lin(0, X1, x0, x0 + 230), sy = lin(0, 4.6, 250, 30);
    o += rect(x0, 30, 230, 220, 'frame');
    o += path(d(null1.map(([a, b]) => [sx(a), sy(b)])), 'mute') + path(d(null2.map(([a, b]) => [sx(a), sy(b)])), 'mute');
    if (sep) o += path(d(sep.map(([a, b]) => [sx(a), sy(b)])), 'dash');
    for (const s of starts) {
      const tr = rk4((t, y) => f(y), s, 0, 12, 1200).map(([, y]) => y).filter((y, i) => i % 3 === 0 && y[0] <= X1 && y[1] <= 4.6);
      o += path(d(tr.map((y) => [sx(y[0]), sy(y[1])])), 'ln');
      const m = Math.min(tr.length - 2, 25), a = tr[m], b = tr[m + 1];
      o += arrow(sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1]), 'ln', 7);
    }
    for (const [p, cls, lab, dx, dy, anc] of eq) o += circle(sx(p[0]), sy(p[1]), 4.5, cls) + text(sx(p[0]) + dx, sy(p[1]) + dy, lab, 'ts', anc);
    o += text(x0 + 115, 20, title, 'tb', 'middle') + text(x0 + 115, 286, note, 'ts', 'middle');
    o += text(x0 + 226, 244, 'x', 'ts', 'end') + text(x0 + 6, 44, 'y', 'ts');
  };
  // strong: x' = x(3-x-y), y' = y(4-y-2x)
  const fS = (y) => [y[0] * (3 - y[0] - y[1]), y[1] * (4 - y[1] - 2 * y[0])];
  // stable manifold of saddle (1,2)：J = [[-1,-1],[-4,-2]]
  const J = [[-1, -1], [-4, -2]], tr = J[0][0] + J[1][1], det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
  const lm = (tr - Math.sqrt(tr * tr - 4 * det)) / 2; // negative eigenvalue
  const v = [1, (lm - J[0][0]) / J[0][1]]; const nv = Math.hypot(...v);
  const back = (sgn) => rk4((t, y) => fS(y).map((q) => -q), [1 + sgn * 1e-4 * v[0] / nv, 2 + sgn * 1e-4 * v[1] / nv], 0, 8, 1600).map(([, y]) => y).filter((y) => y[0] >= 0 && y[1] >= 0 && y[0] <= 4.2 && y[1] <= 4.6);
  const sep = [...back(-1).reverse(), ...back(1)].filter((_, i) => i % 4 === 0);
  panel(30, fS, [[[0, 0], 'paper', '', 0, 0, 'start'], [[3, 0], 'ln-f', '(3, 0)', 0, 16, 'middle'], [[0, 4], 'ln-f', '(0, 4)', 8, 4, 'start'], [[1, 2], 'paper', '(1, 2) saddle', 8, -6, 'start']],
    [[0, 3], [3, 0]], [[0, 4], [2, 0]], [[0.3, 0.2], [0.2, 0.3], [3.9, 4.4], [3.4, 4.5], [0.9, 4.5], [4.1, 1.2], [1.4, 0.1]], 'strong：x′ = x(3 − x − y)，y′ = y(4 − y − 2x)', '谁赢看起点在虚线哪一边', sep);
  const fW = (y) => [y[0] * (4 - 2 * y[0] - y[1]), y[1] * (3 - y[0] - y[1])];
  panel(300, fW, [[[0, 0], 'paper', '', 0, 0, 'start'], [[2, 0], 'paper', '(2, 0)', 0, 16, 'middle'], [[0, 3], 'paper', '(0, 3)', -6, 4, 'end'], [[1, 2], 'ln-f', '(1, 2) stable node', -8, 20, 'end']],
    [[0, 4], [2, 0]], [[0, 3], [3, 0]], [[0.2, 0.1], [0.1, 0.4], [4.1, 4.5], [2.5, 4.5], [4.1, 0.5], [0.3, 4.5], [3, 0.05]], 'weak：x′ = x(4 − 2x − y)，y′ = y(3 − x − y)', '从哪里出发都走向 coexistence');
  return svg(560, 292, o, '左边 strong competition：内部 equilibrium (1,2) 是 saddle，虚线 separatrix 把 first quadrant 分成两半，一边走向 (3,0)，一边走向 (0,4)；右边 weak competition：(1,2) 是 stable node，所有 trajectory 都走向它');
}

// ---------- 第 7 站：拨弦（d'Alembert，动图） ----------
function stringA() {
  const h = 1, f0 = (x) => (x <= Math.PI / 2 ? h * x / (Math.PI / 2) : h * (Math.PI - x) / (Math.PI / 2));
  const F = (x) => { let y = ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI); if (y > Math.PI) y -= 2 * Math.PI; return y >= 0 ? f0(y) : -f0(-y); };
  const u = (t, x) => (F(x + t) + F(x - t)) / 2;
  const N = 64, T = 8, kt = [], tt = [];
  for (let i = 0; i <= N; i++) { tt.push(2 * Math.PI * i / N); kt.push(i / N); }
  const sx = lin(0, Math.PI, 70, 490), sy = lin(-1.15, 1.15, 220, 40);
  let o = line(sx(0), sy(0), sx(Math.PI), sy(0), 'grid');
  o += rect(sx(0) - 8, sy(0) - 22, 8, 44, 'wash2') + rect(sx(Math.PI), sy(0) - 22, 8, 44, 'wash2');
  const crv = (fn) => curve(fn, 0, Math.PI, sx, sy, 64);
  o += apath(tt.map((t) => crv((x) => F(x - t) / 2)), kt, T, 'dash');
  o += apath(tt.map((t) => crv((x) => F(x + t) / 2)), kt, T, 'ln-dash');
  o += apath(tt.map((t) => crv((x) => u(t, x))), kt, T, 'ink-b');
  o += text(sx(0), sy(0) + 34, 'x = 0', 'ts', 'middle') + text(sx(Math.PI), sy(0) + 34, 'x = π', 'ts', 'middle');
  o += text(280, 254, '粗线是 string；两条虚线是 f(x − ct) / 2（向右）和 f(x + ct) / 2（向左），相加就是粗线', 'ts', 'middle');
  o += text(280, 22, '中点拉起 1、静止放手；c = 1，一个 period 是 2π', 'ts', 'middle');
  return svgA(560, 265, o, "动图：中点拉起的 string 放手后，按 d'Alembert 分成向左、向右两个三角波，相加的形状先变成梯形，半个 period 后翻到下面，再回到原样");
}

// ---------- 第 7 站：heat equation（动图） ----------
function heatA() {
  const u = (x, t) => { let s = 0; for (let n = 1; n < 400; n += 2) s += (4 / (n * Math.PI)) * Math.sin(n * Math.PI * x) * Math.exp(-n * n * Math.PI * Math.PI * t); return s; };
  const N = 80, T = 8, tt = [], kt = [];
  for (let i = 0; i <= N; i++) { tt.push(0.0004 + 0.3 * (i / N) ** 2); kt.push((i / N) * 0.85); }
  tt.push(tt[N]); kt.push(1);
  const sx = lin(0, 1, 60, 300), sy = lin(0, 1.15, 220, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.15, xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'x' });
  o += text(64, 30, 'u(x, t) ÷ u₀', 'ts');
  o += line(sx(0), sy(1), sx(1), sy(1), 'dash') + text(sx(0.5), sy(1) - 8, 't = 0：处处是 u₀，两端立刻保持 0', 'ts', 'middle');
  const t1 = 1 / (Math.PI * Math.PI);
  o += path(curve((x) => (4 / Math.PI) * Math.sin(Math.PI * x) * Math.exp(-1), 0, 1, sx, sy, 100), 'mute');
  o += text(sx(0.5), sy(4 / Math.PI / Math.E) + 18, 't = 1/π²：只剩第一项', 'ts', 'middle');
  o += apath(tt.map((t) => curve((x) => u(x, t), 0, 1, sx, sy, 100)), kt, T, 'ln');
  // 右：中点温度
  const tx = lin(0, 0.3, 350, 545), ty = lin(0, 1.15, 220, 40);
  o += axes({ sx: tx, sy: ty, x0: 0, x1: 0.3, y0: 0, y1: 1.15, xt: [0, [t1, '1/π²'], 0.2, 0.3], yt: [0, 0.5, 1], xl: 't' });
  o += text(354, 30, 'u(½, t) ÷ u₀', 'ts');
  o += path(curve((t) => u(0.5, Math.max(t, 0.0004)), 0, 0.3, tx, ty, 200), 'ln');
  o += circle(tx(t1), ty(u(0.5, t1)), 3.5, 'ink-f') + text(tx(t1) + 6, ty(u(0.5, t1)) - 6, `${u(0.5, t1).toFixed(3)}`, 'ts');
  o += acircle(tt.map(tx), tt.map((t) => ty(u(0.5, t))), kt, T, 5, 'ln-f');
  return svgA(560, 250, o, '动图：初温处处为 u0、两端保持 0 的 rod，温度剖面从方形迅速变圆，再按 sine 的形状整体衰减；中点温度在 t 等于 1 除以 pi 平方时为 0.468');
}

// ---------- 第 7 站：Fisher 的 travelling front（动图） ----------
function fisherA() {
  const L = 80, dx = 0.25, dt = 0.02, M = Math.round(L / dx) + 1;
  let u = new Array(M).fill(0).map((_, i) => (i * dx < 5 ? 1 : 0));
  const frames = [u.slice()], times = [0];
  const pos = (v) => { for (let i = 0; i < M - 1; i++) if (v[i] >= 0.5 && v[i + 1] < 0.5) return (i + (v[i] - 0.5) / (v[i] - v[i + 1])) * dx; return 0; };
  const fronts = [[0, pos(u)]];
  for (let k = 1; k <= 1500; k++) {
    const w = u.slice();
    for (let i = 1; i < M - 1; i++) w[i] = u[i] + dt * ((u[i + 1] - 2 * u[i] + u[i - 1]) / (dx * dx) + u[i] * (1 - u[i]));
    w[0] = w[1]; w[M - 1] = 0; u = w;
    if (k % 25 === 0) { frames.push(u.slice()); times.push(k * dt); fronts.push([k * dt, pos(u)]); }
  }
  const N = frames.length - 1, T = 8, kt = frames.map((_, i) => i / N);
  const sx = lin(0, 75, 50, 320), sy = lin(0, 1.1, 210, 40);
  let o = axes({ sx, sy, x0: 0, x1: 75, y0: 0, y1: 1.1, xt: [0, 25, 50, 75], yt: [0, 0.5, 1], xl: 'x' });
  o += text(54, 30, 'u(x, t)：已 mutate 的比例', 'ts');
  o += apath(frames.map((v) => d(v.filter((_, i) => i % 2 === 0 && i * dx <= 75).map((q, j) => [sx(j * 2 * dx), sy(q)]))), kt, T, 'ln');
  // 右：front 位置
  const tx = lin(0, 30, 370, 545), ty = lin(0, 70, 210, 40);
  o += axes({ sx: tx, sy: ty, x0: 0, x1: 30, y0: 0, y1: 70, xt: [0, 10, 20, 30], yt: [0, 20, 40, 60], grid: true, xl: 't' });
  o += text(374, 30, 'u = ½ 的位置', 'ts');
  o += path(d(fronts.map(([t, p]) => [tx(t), ty(p)])), 'ln');
  o += path(d([[tx(0), ty(5)], [tx(30), ty(65)]]), 'dash') + text(tx(14), ty(5 + 2 * 14) - 18, 'slope 2', 'ts', 'end');
  const f20 = fronts.find(([t]) => Math.abs(t - 20) < 1e-6)[1], f30 = fronts[fronts.length - 1][1];
  o += acircle(fronts.map(([t]) => tx(t)), fronts.map(([, p]) => ty(p)), kt, T, 4.5, 'ln-f');
  o += text(458, 240, `t 从 20 到 30，front 走了 ${(f30 - f20).toFixed(1)}，速度 ${((f30 - f20) / 10).toFixed(2)}`, 'ts', 'middle');
  return svgA(560, 252, o, '动图：Fisher equation u_t = u_xx + u(1 − u) 从 x 小于 5 处 u 等于 1 的台阶出发，形成一个形状不变、向右移动的 front，速度逐渐接近 2');
}

// ---------- 第 8 站：mortgage 与 annuity ----------
function mortgage() {
  let o = '';
  const bal = [80000]; for (let n = 0; n < 240; n++) bal.push(1.01 * bal[n] - 880.87);
  const sx = lin(0, 240, 60, 270), sy = lin(0, 100000, 220, 40);
  o += axes({ sx, sy, x0: 0, x1: 240, y0: 0, y1: 100000, xt: [0, 60, 120, 180, 240], yt: [[0, '0'], [40000, '40k'], [80000, '80k']], grid: true, xl: 'month n' });
  o += line(sx(0), sy(88087), sx(240), sy(88087), 'dash') + text(sx(240), sy(88087) - 6, 'EV 88,087', 'ts', 'end');
  o += path(d(bal.map((b, n) => [sx(n), sy(Math.max(0, b))])), 'ln');
  o += text(sx(60), sy(bal[60]) + 18, 'b₀ = 80,000，每月还 880.87', 'ts');
  o += circle(sx(240), sy(0), 4, 'ln-f') + text(sx(236), sy(0) - 10, 'n = 240 还清', 'tl', 'end');
  o += text(165, 20, 'Mortgage：bₙ₊₁ = 1.01bₙ − 880.87', 'tb', 'middle');
  const ax = lin(0, 240, 330, 545), ay = lin(0, 160000, 220, 40);
  o += axes({ sx: ax, sy: ay, x0: 0, x1: 240, y0: 0, y1: 160000, xt: [0, 120, 240], yt: [[0, '0'], [50000, '50k'], [100000, '100k'], [150000, '150k']], grid: true, xl: 'month n' });
  for (const [a0, cls] of [[90000, 'ln'], [100000, 'ink-b'], [110000, 'ln']]) {
    const s = [a0]; for (let n = 0; n < 240; n++) s.push(1.01 * s[n] - 1000);
    o += path(d(s.map((b, n) => [ax(n), ay(Math.max(0, Math.min(160000, b)))]).filter((_, n) => s[n] > -1000 && s[n] < 160500)), cls);
  }
  o += text(ax(232), ay(150000) + 22, '110,000', 'ts', 'end') + text(ax(240), ay(100000) - 6, '100,000', 'ts', 'end') + text(ax(231), ay(0) - 8, '90,000：第 232 月取空', 'ts', 'end');
  o += text(437, 20, 'Annuity：aₙ₊₁ = 1.01aₙ − 1000', 'tb', 'middle');
  return svg(560, 252, o, '左边 mortgage 余额从 80,000 降到第 240 个月还清，它在 EV 88,087 下方被推开；右边 annuity 从 90,000、100,000、110,000 出发，只有恰好 100,000 不动，其余都远离');
}

// ---------- 第 8 站：logistic map 的 cobweb（动图） ----------
function cobwebA() {
  let o = '';
  const steps = 18, T = 9;
  const panel = (x0, R, title) => {
    const sx = lin(0, 1, x0, x0 + 220), sy = lin(0, 1, 240, 20);
    o += rect(x0, 20, 220, 220, 'frame');
    o += line(sx(0), sy(0), sx(1), sy(1), 'mute');
    o += path(curve((x) => R * x * (1 - x), 0, 1, sx, sy), 'ink');
    const fp = 1 - 1 / R; o += circle(sx(fp), sy(fp), 3.5, 'paper');
    let x = 0.1; const segs = [];
    let p = [x, 0];
    for (let k = 0; k < steps; k++) { const y = R * x * (1 - x); segs.push([p, [x, y]]); segs.push([[x, y], [y, y]]); p = [y, y]; x = y; }
    // 第一帧全部画出（静态截图用）；0.1 时清空，之后一段一段画
    const n = segs.length, kt = [0, 0.1];
    for (let k = 1; k <= n; k++) kt.push(0.1 + 0.78 * k / n);
    kt.push(1);
    segs.forEach(([a, b], k) => {
      const on = kt.map((t, j) => j === 0 || j > k + 1);
      o += `<g>${line(sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1]), 'ln')}${ashow(on, kt, T)}</g>`;
    });
    o += text(x0 + 110, 262, title, 'tb', 'middle');
    o += text(sx(0) + 4, sy(0) - 6, 'x₀ = 0.1', 'ts');
  };
  panel(40, 2.5, 'R = 2.5：落到 fixed point 0.6');
  panel(300, 3.2, 'R = 3.2：在 0.513 和 0.799 之间跳');
  return svgA(560, 272, o, '动图：logistic map 的 cobweb。R 等于 2.5 时从 0.1 出发绕进 fixed point 0.6；R 等于 3.2 时 fixed point 0.6875 变成 unstable，iteration 落到 0.513 和 0.799 交替的 2-cycle');
}

// ---------- 第 8 站：rental car ----------
function rental() {
  let o = '';
  const A = [110, 120], Bc = [330, 120], r = 46;
  o += circle(...A, r, 'paper') + circle(...Bc, r, 'paper');
  o += text(A[0], A[1] - 2, 'Orlando', 'tb', 'middle') + text(A[0], A[1] + 16, 'Oₙ', 'ts', 'middle');
  o += text(Bc[0], Bc[1] - 2, 'Tampa', 'tb', 'middle') + text(Bc[0], Bc[1] + 16, 'Tₙ', 'ts', 'middle');
  o += arrow(A[0] + 40, A[1] - 24, Bc[0] - 40, Bc[1] - 24, 'ln') + text(220, 84, '0.4', 'tl', 'middle');
  o += arrow(Bc[0] - 40, Bc[1] + 24, A[0] + 40, A[1] + 24, 'ln') + text(220, 166, '0.3', 'tl', 'middle');
  const loop = (c, dir, lab) => { const pts = []; for (let k = 0; k <= 30; k++) { const a = Math.PI * (0.35 + 1.3 * k / 30); pts.push([c[0] + dir * 0 + 22 * Math.cos(a), c[1] - r - 16 + 18 * Math.sin(a) * -1]); } return path(d(pts), 'ink') + text(c[0], c[1] - r - 42, lab, 't', 'middle'); };
  o += loop(A, 1, '留下 0.6') + loop(Bc, 1, '留下 0.7');
  // bar iterates
  let x = [7000, 0]; const it = [x];
  for (let n = 0; n < 6; n++) { x = [0.6 * x[0] + 0.3 * x[1], 0.4 * x[0] + 0.7 * x[1]]; it.push(x); }
  const bx = 410, bw = 18;
  const sy = lin(0, 7000, 220, 60);
  o += line(bx - 6, 220, 548, 220, 'axis');
  it.forEach((v, n) => {
    const X = bx + n * 20;
    o += rect(X, sy(v[0]), bw / 2, 220 - sy(v[0]), 'ink-f') + rect(X + bw / 2, sy(v[1]), bw / 2, 220 - sy(v[1]), 'solid');
    o += text(X + bw / 2, 236, String(n), 'ts', 'middle');
  });
  o += line(bx - 6, sy(3000), 548, sy(3000), 'dash') + line(bx - 6, sy(4000), 548, sy(4000), 'dash');
  o += text(548, sy(4000) - 4, '4000', 'ts', 'end') + text(548, sy(3000) + 12, '3000', 'ts', 'end');
  o += text(476, 44, '7000 辆全在 Orlando 出发', 'ts', 'middle');
  o += text(476, 254, '黑：O，彩：T；n = 0 … 6', 'ts', 'middle');
  return svg(560, 262, o, '两个城市之间每周的流动：Orlando 的车留下 0.6、去 Tampa 0.4；Tampa 的车留下 0.7、去 Orlando 0.3。右边从 7000 辆全在 Orlando 出发，几周内就接近 3000 和 4000');
}

// ---------- 第 9 站：pig problem ----------
function pig() {
  const P = (t, r = 0.01) => (0.65 - r * t) * (200 + 5 * t) - 0.45 * t;
  let o = '';
  const sx = lin(0, 20, 60, 270), sy = lin(125, 135, 220, 40);
  o += axes({ sx, sy, x0: 0, x1: 20, y0: 125, y1: 135, xt: [0, 5, 8, 10, 15, 20], yt: [125, 130, 133.2, 135].map((v) => [v, '$' + v]), grid: true, xl: 'day t' });
  o += path(curve((t) => P(t), 0, 20, sx, sy), 'ln');
  o += circle(sx(8), sy(133.2), 4, 'ln-f') + text(sx(8), sy(133.2) - 10, '(8, 133.20)', 'tl', 'middle');
  o += circle(sx(6), sy(P(6)), 3, 'ink-f') + circle(sx(10), sy(P(10)), 3, 'ink-f') + text(sx(10) + 6, sy(P(10)) + 16, '第 6、10 天：133.00', 'ts');
  o += text(165, 20, 'P(t) = 130 + 0.8t − 0.05t²', 'tb', 'middle');
  const ax = lin(0.006, 0.014, 330, 545), ay = lin(0, 30, 220, 40);
  o += axes({ sx: ax, sy: ay, x0: 0.006, x1: 0.014, y0: 0, y1: 30, xt: [0.006, 0.008, 0.01, 0.012, 0.014], yt: [0, 8, 10, 20, 30], grid: true, xl: '每天跌价 r（dollar/lb）' });
  o += path(curve((r) => 0.28 / r - 20, 0.0062, 0.014, ax, ay), 'ln');
  o += circle(ax(0.01), ay(8), 4, 'ln-f') + text(ax(0.01) + 8, ay(8) - 8, 'r = 0.01 → t* = 8', 'ts');
  o += text(437, 20, 'best selling day t* = 0.28 / r − 20', 'tb', 'middle');
  return svg(560, 252, o, '左边 profit 对卖出时间的 parabola，第 8 天最高 133.20，第 6 天和第 10 天都是 133.00；右边最佳卖出时间随价格下降速度 r 的变化，r 等于 0.014 时降到 0');
}

// ---------- 第 9 站：TV 生产计划 ----------
function tv() {
  const P = (s, t) => (339 - 0.01 * s - 0.003 * t) * s + (399 - 0.004 * s - 0.01 * t) * t - (400000 + 195 * s + 225 * t);
  const sx = lin(0, 9000, 70, 390), sy = lin(0, 10500, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 9000, y0: 0, y1: 10500, xt: [[0, '0'], [2000, '2k'], [4000, '4k'], [6000, '6k'], [8000, '8k']], yt: [[0, '0'], [2000, '2k'], [4000, '4k'], [6000, '6k'], [8000, '8k'], [10000, '10k']], xl: '19″ 的数量 s' });
  o += text(76, 22, '21″ 的数量 t', 'ts');
  o += poly([[0, 0], [5000, 0], [5000, 5000], [2000, 8000], [0, 8000]].map(([a, b]) => [sx(a), sy(b)]), 'wash');
  o += line(sx(5000), sy(0), sx(5000), sy(10500), 'mute') + line(sx(0), sy(8000), sx(9000), sy(8000), 'mute') + line(sx(0), sy(10000), sx(9000), sy(1000), 'mute');
  o += text(sx(5000) + 4, sy(10200), 's ≤ 5000', 'ts') + text(sx(8900), sy(8000) - 6, 't ≤ 8000', 'ts', 'end') + text(sx(8300), sy(1700) - 4, 's + t ≤ 10000', 'ts', 'end');
  // nonlinear contours: levels
  for (const lev of [400000, 500000, 530000]) {
    // trace contour via marching on a grid (simple: for each s solve quadratic in t)
    const pts = [[], []];
    for (let s = 0; s <= 9000; s += 30) {
      // P quadratic in t: a t^2 + b t + c = lev
      const a = -0.01, b = 399 - 0.004 * s - 225 - 0.003 * s, c = (339 - 0.01 * s) * s - 400000 - 195 * s - lev;
      const disc = b * b - 4 * a * c; if (disc < 0) continue;
      const r1 = (-b + Math.sqrt(disc)) / (2 * a), r2 = (-b - Math.sqrt(disc)) / (2 * a);
      pts[0].push([s, r1]); pts[1].push([s, r2]);
    }
    const ring = [...pts[0], ...pts[1].reverse()].filter(([, t]) => t >= 0 && t <= 10500);
    if (ring.length > 2) o += path(d(ring.map(([a, b]) => [sx(a), sy(b)])) + 'Z', 'dash');
  }
  o += circle(sx(4735), sy(7043), 4.5, 'paper') + text(sx(4735) + 8, sy(7043) - 6, '(4735, 7043)', 'ts');
  o += circle(sx(3846), sy(6154), 4.5, 'ln-f') + text(sx(3846) - 8, sy(6154) + 16, '(3846, 6154)', 'tl', 'end');
  o += circle(sx(2000), sy(8000), 4.5, 'ink-f') + text(sx(2000) - 6, sy(8000) - 8, '(2000, 8000)', 'tb', 'end');
  o += text(404, 60, '虚线：profit 的 level curve', 'ts');
  o += text(404, 76, '（400k、500k、530k）', 'ts');
  o += text(404, 110, '空心：不管 constraint', 'ts') + text(404, 126, '$553,641，超出 capacity', 'ts');
  o += text(404, 160, '彩：constraint 下的最优', 'tl') + text(404, 176, '$532,308，在 edge 上', 'ts');
  o += text(404, 210, '黑：price 当常数的 LP', 'tb') + text(404, 226, '选 corner，真实 $488,000', 'ts');
  return svg(560, 282, o, 'Feasible region 是一个五边形；真实 profit 的 level curve 是椭圆，最高点 (4735,7043) 在 region 外，constraint 下最优 (3846,6154) 在 s+t=10000 那条 edge 上；把 price 当常数的 LP 给出 corner (2000,8000)');
}

// ---------- 第 10 站：poll ----------
function poll() {
  const lg = (n) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log(k); return s; };
  const pmf = (n, k) => Math.exp(lg(n) - lg(k) - lg(n - k) - n * Math.LN2);
  let o = '';
  const panel = (x0, n, w) => {
    const sx = lin(0.3, 0.7, x0, x0 + 230), maxp = pmf(n, n / 2), sy = lin(0, maxp * 1.15, 210, 50);
    o += line(x0, 210, x0 + 230, 210, 'axis');
    for (let k = Math.ceil(0.3 * n); k <= 0.7 * n; k++) {
      const x = k / n, inside = Math.abs(x - 0.5) <= 1 / Math.sqrt(n) + 1e-9;
      o += rect(sx(x) - w / 2, sy(pmf(n, k)), w, 210 - sy(pmf(n, k)), inside ? 'solid' : 'wash2');
    }
    for (const v of [0.3, 0.4, 0.5, 0.6, 0.7]) o += line(sx(v), 210, sx(v), 214, 'axis') + text(sx(v), 228, String(v), 'ts', 'middle');
    let cov = 0; for (let k = 0; k <= n; k++) if (Math.abs(k / n - 0.5) <= 1 / Math.sqrt(n) + 1e-9) cov += pmf(n, k);
    o += text(x0 + 115, 30, `n = ${n}：深色是 0.5 ± ${(1 / Math.sqrt(n)).toFixed(2)}`, 'tb', 'middle');
    o += text(x0 + 115, 246, `落在里面的 probability ${cov.toFixed(3)}`, 'ts', 'middle');
  };
  panel(30, 100, 4);
  panel(300, 400, 1.6);
  o += text(280, 266, '真实支持率 0.5 时，样本比例 x̄ 的 distribution（binomial 精确值）', 'ts', 'middle');
  return svg(560, 275, o, 'n 等于 100 和 400 时样本比例的 distribution：区间 0.5 加减 1 除以根号 n 分别是正负 0.1 和正负 0.05，落在里面的 probability 都约 0.96');
}

// ---------- 第 10 站：gambler's ruin（动图） ----------
function walkA() {
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const sim = (p) => { let x = 10; const s = [x]; while (x > 0 && x < 20 && s.length < 400) { x += rnd() < p ? 1 : -1; s.push(x); } return s; };
  const paths = { fair: [], rou: [] };
  for (let i = 0; i < 6; i++) paths.fair.push(sim(0.5));
  for (let i = 0; i < 6; i++) paths.rou.push(sim(18 / 38));
  const maxLen = Math.max(...[...paths.fair, ...paths.rou].map((s) => s.length));
  const Tm = Math.min(300, maxLen), N = 60, T = 10, kt = [0, 0.1], wv = [234, 234];
  // 第一帧是画完的样子（静态截图用）；0.1 之后清空，再按时间往右画出来
  for (let i = 0; i <= N; i++) { kt.push(0.1001 + (i / N) * 0.8); wv.push(2 + 232 * i / N); }
  kt.push(1); wv.push(234);
  let o = '';
  const panel = (x0, list, title) => {
    const sx = lin(0, Tm, x0, x0 + 230), sy = lin(0, 20, 220, 40);
    o += line(sx(0), sy(0), sx(Tm), sy(0), 'ink-b') + line(sx(0), sy(20), sx(Tm), sy(20), 'ink-b');
    o += line(sx(0), sy(10), sx(Tm), sy(10), 'grid');
    o += text(x0 - 4, sy(20) + 4, '$20', 'ts', 'end') + text(x0 - 4, sy(10) + 4, '$10', 'ts', 'end') + text(x0 - 4, sy(0) + 4, '$0', 'ts', 'end');
    const cid = 'ma3264-walk-clip-' + x0;
    o += `<clipPath id="${cid}"><rect x="${x0 - 2}" y="30" width="2" height="200">${anim('width', wv.map(f1), kt, T)}</rect></clipPath>`;
    o += `<g clip-path="url(#${cid})">`;
    list.forEach((s) => { o += path(d(s.slice(0, Tm + 1).map((v, j) => [sx(j), sy(v)])), s[s.length - 1] >= 20 ? 'ln' : 'mute'); });
    o += '</g>';
    const up = list.filter((s) => s[s.length - 1] >= 20).length;
    o += text(x0 + 115, 22, title, 'tb', 'middle');
    o += text(x0 + 115, 244, `这 6 次里 ${up} 次先到 $20（彩线）`, 'ts', 'middle');
    o += text(sx(Tm), sy(0) + 16, `${Tm} bets`, 'ts', 'end');
  };
  panel(50, paths.fair, 'fair：p = ½，理论 0.500');
  panel(320, paths.rou, 'roulette：p = 18/38，理论 0.259');
  return svgA(560, 262, o, '动图：从 10 美元出发每次赌 1 美元，到 0 或 20 为止；左边公平赌局 6 条路径，右边 roulette 的 6 条路径，右边先到 20 的更少');
}


// ---------- 第 3 站：bugs 的 logistic fit ----------
function bugs() {
  const K = 360 * (1 - Math.exp(-3)) / (1 - 1.8 * Math.exp(-3)), N = (t) => K / (1 + (K / 200 - 1) * Math.exp(-1.5 * t));
  const sx = lin(0, 6, 70, 400), sy = lin(150, 400, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 150, y1: 400, xt: [0, 1, 2, 3, 4, 5, 6], yt: [150, 200, 250, 300, 350, 400], grid: true, xl: 'day t' });
  o += text(76, 22, 'bugs N', 'ts');
  o += line(sx(0), sy(K), sx(6), sy(K), 'dash') + text(sx(6), sy(K) - 6, `K = ${K.toFixed(2)}`, 'ts', 'end');
  o += path(curve((t) => Math.min(N(t), 400), 0, 6, sx, sy), 'ln');
  o += path(curve((t) => 200 * Math.exp(1.5 * t), 0, Math.log(2) / 1.5, sx, sy), 'mute');
  o += circle(sx(0), sy(200), 4.5, 'ink-f') + text(sx(0) + 8, sy(200) + 16, 'N(0) = 200（数的）', 'ts');
  o += circle(sx(2), sy(360), 4.5, 'ink-f') + text(sx(2) + 8, sy(360) + 18, 'N(2) = 360（数的）', 'ts');
  o += circle(sx(3), sy(N(3)), 4, 'paper') + text(sx(3) + 6, sy(310), `N(3) = ${N(3).toFixed(1)}（预测）`, 'tl');
  o += text(420, 80, 'B = 1.5 / day 已知，', 'ts') + text(420, 96, '两次计数定出 K', 'ts');
  o += text(420, 130, '灰线：Malthus 200e¹·⁵ᵗ，', 'ts') + text(420, 146, '第 0.46 天就超过 400', 'ts');
  return svg(560, 252, o, `200 只 bugs 的 logistic curve：第 0 天 200、第 2 天 360 两个计数定出 carrying capacity ${K.toFixed(2)}，第 3 天预测 ${N(3).toFixed(1)}`);
}

// ---------- 第 4 站：x″ = cos x 的 phase curve ----------
function cosx() {
  const sx = lin(-1.2, 4.4, 60, 520), sy = lin(-1.9, 1.9, 220, 30);
  let o = line(sx(-1.2), sy(0), sx(4.4), sy(0), 'axis') + line(sx(0), sy(-1.9), sx(0), sy(1.9), 'axis');
  o += text(sx(4.4), sy(0) + 16, 'x', 'ts', 'end') + text(sx(0) + 6, sy(1.8), 'x′', 'ts');
  const a = -Math.PI / 6, b = 7 * Math.PI / 6, v = (x) => Math.sqrt(Math.max(0, 1 + 2 * Math.sin(x)));
  const top = [], bot = [];
  for (let k = 0; k <= 200; k++) { const x = a + (b - a) * k / 200; top.push([sx(x), sy(v(x))]); bot.push([sx(x), sy(-v(x))]); }
  o += path(d([...top, ...bot.reverse()]) + 'Z', 'ln');
  o += circle(sx(0), sy(1), 4.5, 'ink-f') + text(sx(0) - 8, sy(1) - 8, '(0, 1)：出发点', 'ts', 'end');
  o += circle(sx(a), sy(0), 4, 'ln-f') + text(sx(a) - 6, sy(0) + 18, '−π/6', 'tl', 'end');
  o += circle(sx(b), sy(0), 4, 'ln-f') + text(sx(b) + 6, sy(0) + 18, '7π/6', 'tl');
  o += circle(sx(Math.PI / 2), sy(Math.sqrt(3)), 3, 'ink-f') + text(sx(Math.PI / 2), sy(Math.sqrt(3)) - 8, 'x = π/2：x′ = √3 最快', 'ts', 'middle');
  o += arrow(sx(1.0), sy(v(1.0)), sx(1.1), sy(v(1.1)), 'ln', 8) + arrow(sx(2.2), sy(-v(2.2)), sx(2.1), sy(-v(2.1)), 'ln', 8);
  o += text(290, 252, 'x′² = 1 + 2 sin x：在 sin x = −½ 的两个点 x′ = 0，折返', 'ts', 'middle');
  return svg(560, 262, o, 'x″ 等于 cos x，从 x 等于 0、速度 1 出发的 phase curve 是一条 closed curve，x 在负六分之 pi 和六分之七 pi 之间来回');
}

// ---------- 第 6 站：logistic prey 让 center 变成 spiral ----------
function lvlog() {
  let o = '';
  const sx = lin(0, 2.2, 60, 300), sy = lin(0, 2.6, 240, 30);
  o += axes({ sx, sy, x0: 0, x1: 2.2, y0: 0, y1: 2.6, xt: [0, 0.5, 1, 1.5, 2], yt: [0.5, 1, 1.5, 2, 2.5], grid: true, xl: 'lions L' });
  o += text(66, 22, 'zebras Z', 'ts');
  const f = (y) => [y[0] * y[1] - y[0], y[1] - 0.5 * y[1] * y[1] - y[0] * y[1]];
  const tr = rk4((t, y) => f(y), [1, 0.4], 0, 40, 8000).map(([, y]) => y);
  o += path(d(tr.filter((_, i) => i % 8 === 0).map((y) => [sx(y[0]), sy(y[1])])), 'ln');
  const m = 60, a = tr[m], b2 = tr[m + 8];
  o += arrow(sx(a[0]), sy(a[1]), sx(b2[0]), sy(b2[1]), 'ln', 8);
  o += circle(sx(1), sy(0.4), 4, 'paper') + text(sx(1) + 8, sy(0.4) + 14, '(1, 0.4) 出发', 'ts');
  o += circle(sx(0.5), sy(1), 4.5, 'ink-f') + text(sx(0.66), sy(1) + 5, '(0.5, 1)', 'tb');
  o += text(330, 70, 'L′ = LZ − L', 't') + text(330, 90, 'Z′ = Z − 0.5Z² − LZ', 't');
  o += text(330, 130, 'Jacobian 在 (0.5, 1)：', 'ts') + text(330, 146, 'tr = −0.5，det = 0.5', 'ts');
  o += text(330, 162, 'λ = −0.25 ± 0.66i：spiral sink', 'tl');
  o += text(330, 198, '同样从 (1, 0.4) 出发，', 'ts') + text(330, 214, '纯 Lotka–Volterra 是 closed orbit', 'ts');
  return svg(560, 272, o, '给 zebra 加上 logistic 项 0.5Z 平方之后，从 (1, 0.4) 出发的 trajectory 绕着 (0.5, 1) 越转越小，最后停在那里');
}

export default {
  'ma3264-bugs': bugs,
  'ma3264-cosx': cosx,
  'ma3264-lvlog': lvlog,
  'ma3264-crane': crane,
  'ma3264-pest0': pest0,
  'ma3264-cosy': cosy,
  'ma3264-penddim': pendDim,
  'ma3264-blast': blast,
  'ma3264-decay': decay,
  'ma3264-co2': co2A,
  'ma3264-phaseline': phaseline,
  'ma3264-harvest': harvestA,
  'ma3264-damp': dampA,
  'ma3264-resonance': resonance,
  'ma3264-tanker': tanker,
  'ma3264-pend': pendA,
  'ma3264-sys': sysPP,
  'ma3264-lv': lvA,
  'ma3264-compete': compete,
  'ma3264-string': stringA,
  'ma3264-heat': heatA,
  'ma3264-fisher': fisherA,
  'ma3264-mortgage': mortgage,
  'ma3264-cobweb': cobwebA,
  'ma3264-rental': rental,
  'ma3264-pig': pig,
  'ma3264-tv': tv,
  'ma3264-poll': poll,
  'ma3264-walk': walkA,
};
