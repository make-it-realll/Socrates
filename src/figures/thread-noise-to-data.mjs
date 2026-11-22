// 概念线 noise-to-data 的图。随机数都来自下面的 mulberry32；所有 density、posterior mean、velocity 都按 Gaussian mixture 精确算。
import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, f1 } from '../lib/svg.mjs';

function rng(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  return { u, normal };
}
const k5 = (t) => (Math.round(t * 1e5) / 1e5).toString();
const fx = (v, k = 2) => v.toFixed(k).replace('-', '−');
// 在若干时间段里显示（spans 是 [起, 止] 的 0..1 时刻，止 = null 表示到最后）
function gshow(spans, T, body) {
  const times = new Set([0]);
  spans.forEach(([a, b]) => { times.add(a); if (b !== null) times.add(b); });
  const ks = [...times].filter((t) => t <= 1).sort((x, y) => x - y);
  const vis = (t) => (spans.some(([a, b]) => t >= a - 1e-12 && (b === null || t < b - 1e-12)) ? 1 : 0);
  const vals = ks.map(vis);
  return `<g opacity="${vals[0]}">${body}<animate attributeName="opacity" values="${vals.join(';')}" keyTimes="${ks.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite" calcMode="discrete"/></g>`;
}
const npdf = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);

// ---------- 一维的 running example：w₋ N(−2, 0.5²) + w₊ N(2, 0.5²) ----------
const MU = [-2, 2], S2 = 0.25;
// x_t = a·x + s·ε 时的 density、posterior mean D、score
function mix(y, a, s, w) {
  const v = a * a * S2 + s * s;
  const l = MU.map((m, k) => Math.log(w[k]) - ((y - a * m) ** 2) / (2 * v));
  const mx = Math.max(...l), r = l.map((z) => Math.exp(z - mx)), Z = r[0] + r[1];
  const rr = r.map((z) => z / Z);
  const D = rr.reduce((acc, q, k) => acc + q * (MU[k] + ((a * S2) / v) * (y - a * MU[k])), 0);
  const sc = rr.reduce((acc, q, k) => acc + q * (-(y - a * MU[k]) / v), 0);
  const p = w[0] * npdf(y, a * MU[0], v) + w[1] * npdf(y, a * MU[1], v);
  return { D, sc, p, wp: rr[1] };
}
const W82 = [0.8, 0.2], W55 = [0.5, 0.5];

// ---------- 开头：gripper 绕 obstacle，MSE 直直撞上去 ----------
function failA() {
  const R = rng(184);
  const sxU = lin(0, 1, 34, 360), sy = lin(-3.6, 3.6, 236, 36);
  const uc = 0.62, gw = 0.10; // obstacle 中心与 swerve 的宽度
  const gsw = (u) => Math.exp(-((u - uc) ** 2) / (2 * gw * gw));
  const Ys = []; for (let i = 0; i < 200; i++) Ys.push((R.u() < 0.5 ? -2 : 2) + 0.5 * R.normal());
  let o = '';
  o += rect(14, 30, 362, 214, 'frame', 4);
  // demonstration
  for (let i = 0; i < 26; i++) { const Y = Ys[i]; const pts = []; for (let k = 0; k <= 80; k++) { const u = k / 80; pts.push([sxU(u), sy(Y * gsw(u))]); } o += path(d(pts), 'mute'); }
  // obstacle
  const u0 = 0.55, u1 = 0.69;
  o += rect(sxU(u0), sy(1), sxU(u1) - sxU(u0), sy(-1) - sy(1), 'solid2', 3);
  o += `<text x="${f1((sxU(u0) + sxU(u1)) / 2)}" y="${f1(sy(0) + 4)}" class="tw" text-anchor="middle" style="font-size:11px">obstacle</text>`;
  // MSE 的 path
  o += line(sxU(0), sy(0), sxU(u0) - 2, sy(0), 'ln');
  o += text(sxU(0.0), sy(0) + 22, 'MSE：输出 0', 'tl') + text(sxU(0.0), sy(0) + 39, '每次都撞上 obstacle', 'tl');
  // gripper（俯视：palm + 两根 finger，朝 +u）
  const grip = (cls) => rect(-16, -9, 8, 18, cls, 2) + rect(-8, -9, 13, 4.5, cls, 1.5) + rect(-8, 4.5, 13, 4.5, cls, 1.5) + line(-22, 0, -16, 0, 'ink');
  const T = 7, hold = 1.6;
  const uStop = u0 - 5 / (sxU(1) - sxU(0)) - 0.002;
  // A：沿 MSE path 走到 obstacle 前停住
  const ktA = [0, hold / T, hold / T + 0.002, (hold + 3.6) / T, 1];
  const xA = [sxU(uStop), sxU(uStop), sxU(0), sxU(uStop), sxU(uStop)];
  o += `<g transform="translate(${f1(xA[0])} ${f1(sy(0))})"><animateTransform attributeName="transform" type="translate" values="${xA.map((x) => f1(x) + ' ' + f1(sy(0))).join(';')}" keyTimes="${ktA.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite"/>${grip('ln-f')}</g>`;
  // B：沿一条 demonstration（Y ≈ +2）绕过去
  const Yb = 2.05, nB = 40;
  const posB = (u) => { const dy = (Yb * gsw(u + 0.005) - Yb * gsw(u - 0.005)) / 0.01; return [sxU(u), sy(Yb * gsw(u)), (Math.atan2(dy * (sy(1) - sy(0)), sxU(1) - sxU(0)) * 180) / Math.PI]; };
  const fr = Array.from({ length: nB + 1 }, (_, k) => k / nB);
  const uBs = [uStop, uStop, ...fr.map((q) => q * 0.98), 0.98, uStop];
  const ktB = [0, hold / T, ...fr.map((q) => (hold + 0.002 + q * (T - hold - 0.6)) / T), 1 - 0.002, 1];
  const PB = uBs.map(posB);
  o += `<g transform="translate(${f1(PB[0][0])} ${f1(PB[0][1])})"><animateTransform attributeName="transform" type="translate" values="${PB.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(';')}" keyTimes="${ktB.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite"/><g transform="rotate(${f1(PB[0][2])})"><animateTransform attributeName="transform" type="rotate" values="${PB.map((p) => f1(p[2])).join(';')}" keyTimes="${ktB.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite"/>${grip('paper')}</g></g>`;
  o += text(20, 22, '俯视：gripper 从左往右经过 obstacle', 'tb');
  o += text(sxU(1) - 2, sy(-3.6) - 6, '前进方向 →', 'ts', 'end');
  // 右边：200 条 demonstration 在 obstacle 处的 lateral offset y
  const hx = lin(0, 0.55, 404, 520), bw = 0.3, nb = Math.round(7.2 / bw), hist = new Array(nb).fill(0);
  for (const y of Ys) { const b = Math.floor((y + 3.6) / bw); if (b >= 0 && b < nb) hist[b]++; }
  o += rect(404, sy(1), 140, sy(-1) - sy(1), 'wash2');
  hist.forEach((c, b) => { if (c) o += rect(404, sy(-3.6 + (b + 1) * bw) + 0.5, hx(c / 200 / bw) - 404, sy(-3.6 + b * bw) - sy(-3.6 + (b + 1) * bw) - 1, 'wash-strong'); });
  const dp = []; for (let i = 0; i <= 160; i++) { const y = -3.6 + (7.2 * i) / 160; dp.push([hx(0.5 * npdf(y, -2, S2) + 0.5 * npdf(y, 2, S2)), sy(y)]); }
  o += path(d(dp), 'dash');
  o += line(404, sy(-3.6), 404, sy(3.6), 'axis');
  for (const v of [-2, 0, 2]) o += line(400, sy(v), 404, sy(v), 'axis') + text(397, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  o += circle(404, sy(0), 4.5, 'ln-f') + text(412, sy(0) + 4, 'mean = ' + fx(Ys.reduce((a, b) => a + b, 0) / 200), 'tl');
  o += text(404, 22, it('y') + '：200 条 demonstration', 'tb');
  o += text(470, sy(1) + 14, '|' + it('y') + '| < 1', 'ts', 'middle');
  return svgA(560, 250, o, '动图：俯视的 workspace。灰色细线是 demonstration，一半从上面、一半从下面绕过中间的 obstacle；彩色的 gripper 沿 MSE 给出的 path 直走，停在 obstacle 前撞上；描边的 gripper 沿一条 demonstration 绕过去。右边是 200 条 demonstration 在 obstacle 处的 lateral offset 的 histogram，两个 bump 在 −2 和 2，mean 接近 0，正落在 obstacle 的范围里');
}

// ---------- Langevin 看不见 weight ----------
export function langevinRun(nC = 40, steps = 2000, eps = 0.1, seed = 5788, w = W82) {
  const R = rng(seed);
  const xs = [];
  for (let c = 0; c < nC; c++) xs.push(-4 + 8 * R.u());
  const start = xs.slice(), frames = [xs.slice()];
  for (let k = 1; k <= steps; k++) {
    for (let c = 0; c < nC; c++) { const { sc } = mix(xs[c], 1, 0, w); xs[c] += 0.5 * eps * eps * sc + eps * R.normal(); }
    if (k % 50 === 0) frames.push(xs.slice());
  }
  return { start, frames, right: xs.filter((x) => x > 0).length, startRight: start.filter((x) => x > 0.0924).length };
}
function langevinA() {
  const L = langevinRun();
  const sx = lin(-4.5, 4.5, 40, 340), syP = lin(0, 0.7, 120, 40);
  let o = '';
  o += path(area((x) => mix(x, 1, 0, W82).p, -4.5, 4.5, sx, syP), 'wash') + path(curve((x) => mix(x, 1, 0, W82).p, -4.5, 4.5, sx, syP), 'ink');
  o += line(sx(-4.5), syP(0), sx(4.5), syP(0), 'axis');
  o += line(sx(0.0924), syP(0) + 4, sx(0.0924), 44, 'dash');
  o += text(sx(0.0924) + 4, 52, 'density 最低点 0.09', 'ts');
  o += text(sx(-2), syP(0.64) - 6, '0.8', 'tl', 'middle') + text(sx(2), syP(0.16) - 6, '0.2', 'tl', 'middle');
  for (const v of [-4, -2, 0, 2, 4]) o += text(sx(v), syP(0) + 15, String(v).replace('-', '−'), 'ts', 'middle');
  // chain：每条一行
  const T = 9, H = 1.6, nF = L.frames.length;
  const row = (c) => 150 + (c % 20) * 4.6 + (c >= 20 ? 0 : 0);
  const kt = [0, H / T, ...L.frames.map((_, i) => (H + 0.002 + (i / (nF - 1)) * (T - H - 0.6)) / T), 1];
  kt[kt.length - 2] = Math.min(kt[kt.length - 2], 1 - 0.002);
  for (let c = 0; c < L.start.length; c++) {
    const seq = L.frames.map((f) => sx(Math.max(-4.5, Math.min(4.5, f[c]))));
    const xsA = [seq[nF - 1], seq[nF - 1], ...seq, seq[nF - 1]].map(f1);
    const cls = L.start[c] > 0.0924 ? 'ln-f' : 'mute-f';
    o += `<circle cx="${xsA[0]}" cy="${f1(row(c) + (c >= 20 ? 2.3 : 0))}" r="2.6" class="${cls}">${anim('cx', xsA, kt, T)}</circle>`;
  }
  o += text(40, 260, `彩色：起点在 0.09 右边（${L.startRight} 条）；灰色：起点在左边`, 'ts');
  o += text(40, 28, 'Exact score 的 Langevin，' + it('ε') + ' = 0.1，2000 步', 'tb');
  o += text(340, 278, `终点在右边：${L.right} / 40，应为 8 / 40`, 'tl', 'end');
  // 右边：两组 weight 的 score
  const sxs = lin(-4, 4, 380, 548), sys = lin(-8, 8, 250, 60);
  o += line(380, sys(0), 548, sys(0), 'axis') + line(sxs(0), 60, sxs(0), 250, 'grid');
  o += path(curve((x) => mix(x, 1, 0, W55).sc, -4, 4, sxs, sys, 400), 'dash');
  o += path(curve((x) => mix(x, 1, 0, W82).sc, -4, 4, sxs, sys, 400), 'ln');
  o += text(sxs(-2) + 4, sys(0) - 5, '−2', 'ts') + text(sxs(2) - 4, sys(0) + 15, '2', 'ts', 'end');
  o += text(380, 28, 'Score ∂ log ' + it('p') + ' / ∂' + it('x'), 'tb');
  o += text(380, 46, '彩色 0.8 / 0.2，虚线 0.5 / 0.5', 'ts');
  o += text(sxs(0), 268, '只在 |' + it('x') + '| < 1 里不同', 'ts', 'middle');
  return svgA(560, 284, o, `动图：上面是 0.8 N(−2, 0.25) + 0.2 N(2, 0.25) 的 density，下面 40 条 Langevin chain 从 −4 到 4 均匀出发，用 exact score 走 2000 步。每个点停在离起点最近的 bump 里，终点在右边的有 ${L.right} 条，起点在 density 最低点右边的有 ${L.startRight} 条，正确的应是 8 条。右边是两组 weight 的 score，只在两个 bump 之间不同`);
}

// ---------- 骨架：每个 noise level 上的 posterior mean ----------
function levelsA() {
  const sx = lin(-3.5, 3.5, 60, 520), syP = lin(0, 0.66, 104, 34), syD = lin(-2.6, 2.6, 270, 140);
  const tf = [0.5, 0.6, 0.7, 0.8, 0.9, 0.97, 0.999, 0.97, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.03, 0, 0.03, 0.1, 0.2, 0.3, 0.4, 0.5];
  const T = 14, kt = tf.map((_, i) => i / (tf.length - 1));
  const pPath = (t) => curve((y) => mix(y, t, 1 - t, W82).p, -3.5, 3.5, sx, (v) => syP(Math.min(v, 0.66)), 110);
  const DPath = (t) => curve((y) => mix(y, t, 1 - t, W82).D, -3.5, 3.5, sx, syD, 110);
  let o = '';
  o += line(60, syP(0), 520, syP(0), 'axis');
  o += `<path d="${pPath(tf[0])}" class="ln">${anim('d', tf.map(pPath), kt, T)}</path>`;
  o += text(60, 24, it('p') + sub_('t') + '(' + it('y') + ')：' + it('x') + sub_('t') + ' = ' + it('t') + it('x') + ' + (1 − ' + it('t') + ')' + it('ε') + ' 的 density', 'tb');
  // D 的坐标轴
  o += line(60, syD(0), 520, syD(0), 'axis') + line(sx(0), syD(-2.6), sx(0), syD(2.6), 'grid');
  o += path(d([[sx(-2.6), syD(-2.6)], [sx(2.6), syD(2.6)]]), 'grid');
  o += line(60, syD(-1.2), 520, syD(-1.2), 'dash');
  o += text(516, syD(-1.2) - 6, 'E[' + it('x') + '] = −1.2', 'ts', 'end');
  for (const v of [-2, 2]) o += text(sx(v), syD(0) + 15, String(v).replace('-', '−'), 'ts', 'middle') + text(sx(0) - 6, syD(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  o += `<path d="${DPath(tf[0])}" class="ink-b">${anim('d', tf.map(DPath), kt, T)}</path>`;
  o += text(60, 132, it('D') + sub_('t') + '(' + it('y') + ') = E[' + it('x') + ' | ' + it('x') + sub_('t') + ' = ' + it('y') + ']', 'tb');
  o += text(sx(3.5), syD(0) + 15, it('y'), 'ts', 'end');
  // y = 0.6 处的点
  const ys = tf.map((t) => f1(syD(mix(0.6, t, 1 - t, W82).D)));
  o += line(sx(0.6), syD(-2.6), sx(0.6), syD(2.6), 'grid');
  o += `<circle cx="${f1(sx(0.6))}" cy="${ys[0]}" r="4.2" class="ln-f">${anim('cy', ys, kt, T)}</circle>`;
  o += gshow([[0, 0.5 / T]], T, text(sx(0.6) + 9, syD(1.587) + 20, it('D') + '(0.6) = 1.587', 'tl'));
  // t 的游标
  const st = lin(0, 1, 330, 510);
  o += line(330, 24, 510, 24, 'axis') + text(326, 28, 'noise', 'ts', 'end') + text(514, 28, 'data', 'ts');
  o += `<circle cx="${f1(st(tf[0]))}" cy="24" r="4.5" class="ink-f">${anim('cx', tf.map((t) => f1(st(t))), kt, T)}</circle>`;
  o += text(st(0), 42, '0', 'ts', 'middle') + text(st(0.5), 42, it('t') + ' = 0.5', 'ts', 'middle') + text(st(1), 42, '1', 'ts', 'middle');
  return svgA(560, 282, o, '动图：0.8 N(−2, 0.25) + 0.2 N(2, 0.25) 在不同 noise level 下的 density（上）和 posterior mean D_t(y)（下）。t 接近 1 时 D 几乎就是 y 本身；t 变小，两个 bump 合成一个，D 在两个 component 交界处陡升、两侧变平；t 等于 0 时 D 是常数 −1.2。第一帧是 t 等于 0.5，D(0.6) 等于 1.587');
}
function sub_(s) { return `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`; }

// ---------- 桥 1：random walk 与 Fick velocity ----------
export function fickRun(n = 30, seed = 2234) {
  const R = rng(seed), D = 0.5;
  const x0 = []; for (let i = 0; i < n; i++) x0.push((R.u() < 0.2 ? 2 : -2) + 0.5 * R.normal());
  const v = (x, t) => -D * mix(x, 1, Math.sqrt(2 * D * t), W82).sc; // α = 1，σ² = 2Dt
  const rk = (x, t, h) => { const a = v(x, t), b = v(x + (h / 2) * a, t + h / 2), c = v(x + (h / 2) * b, t + h / 2), e = v(x + h * c, t + h); return x + (h / 6) * (a + 2 * b + 2 * c + e); };
  const L = 0.1; // Δt = 0.01 s，D = L²/(2Δt) = 0.5
  const rw = [x0.slice()], od = [x0.slice()];
  let xr = x0.slice(), xo = x0.slice();
  const F = 40; // 每 0.1 s 一帧
  for (let f = 1; f <= 2 * F; f++) {
    for (let k = 0; k < 10; k++) xr = xr.map((x) => x + (R.u() < 0.5 ? L : -L));
    const t0 = f <= F ? (f - 1) * 0.1 : (2 * F - f + 1) * 0.1, h = f <= F ? 0.1 : -0.1;
    for (let k = 0; k < 5; k++) xo = xo.map((x) => rk(x, t0 + (k * h) / 5, h / 5));
    rw.push(xr.slice()); od.push(xo.slice());
  }
  return { x0, rw, od, F };
}
function fickA() {
  const Rn = fickRun(), F = Rn.F, nF = 2 * F + 1;
  const sx = lin(-6.5, 6.5, 40, 520);
  const T = 12, kt = Array.from({ length: nF }, (_, i) => i / (nF - 1));
  const tOf = (i) => (i <= F ? i * 0.1 : 0.1 * (2 * F - i)); // lane B 的 physical time
  const tA = (i) => i * 0.1;
  let o = '';
  const lane = (y0, title, xsF, tfun) => {
    const syP = lin(0, 0.7, y0 + 50, y0 + 6);
    let g = text(40, y0 - 4, title, 'tb');
    g += line(40, y0 + 50, 520, y0 + 50, 'axis') + line(sx(0), y0 + 6, sx(0), y0 + 92, 'grid');
    const pp = (i) => curve((x) => mix(x, 1, Math.sqrt(tfun(i)), W82).p, -6.5, 6.5, sx, syP, 80);
    const sel = kt.map((_, i) => i).filter((i) => i % 4 === 0);
    g += `<path d="${pp(0)}" class="ink">${anim('d', sel.map((i) => pp(i)), sel.map((i) => kt[i]), T)}</path>`;
    xsF[0].forEach((_, c) => {
      const seq = xsF.map((f) => f1(sx(Math.max(-6.5, Math.min(6.5, f[c])))));
      g += `<circle cx="${seq[0]}" cy="${f1(y0 + 62 + (c % 10) * 3)}" r="2.5" class="${xsF[0][c] > 0 ? 'ln-f' : 'mute-f'}">${anim('cx', seq, kt, T)}</circle>`;
    });
    // 0 右边的个数（每 0.4 s 更新一次）
    sel.forEach((i, q) => { const k = xsF[i].filter((x) => x > 0).length; const sp = q === sel.length - 1 ? [[kt[i], null]] : [[kt[i], kt[sel[q + 1]]]]; g += gshow(sp, T, text(520, y0 - 4, `0 右边：${k} / ${xsF[i].length}`, 'tl', 'end')); });
    return g;
  };
  o += lane(28, 'Random walk（LSM2234）：每 0.01 s 走 ±0.1 µm', Rn.rw, (i) => tA(i));
  o += lane(158, 'Fick velocity ' + it('v') + ' = −' + it('D') + ' ∂ log ' + it('c') + '/∂' + it('x') + '：没有 noise', Rn.od, (i) => tOf(i));
  // 时间读数
  const sel = kt.map((_, i) => i).filter((i) => i % 4 === 0);
  sel.forEach((i, q) => {
    const sp = q === sel.length - 1 ? [[kt[i], null]] : [[kt[i], kt[sel[q + 1]]]];
    const s = i <= F ? `0 → 4 s：两排都在 diffuse，t = ${tA(i).toFixed(1)} s` : `4 s 之后：上排接着 random walk（t = ${tA(i).toFixed(1)} s）；下排把 velocity 倒着走，回到 t = ${tOf(i).toFixed(1)} s`;
    o += gshow(sp, T, text(40, 284, s, 'ts'));
  });
  for (const v of [-4, -2, 0, 2, 4]) o += text(sx(v), 270, String(v).replace('-', '−'), 'ts', 'middle');
  o += text(520, 270, it('x') + '（µm）', 'ts', 'end');
  return svgA(560, 290, o, '动图：同一组 30 个 molecule，起初 80% 聚在 −2 µm、20% 聚在 2 µm，D 等于 0.5。上面一排每 0.01 s 随机走一步；下面一排没有 noise，按 Fick velocity 平滑地移动。0 到 4 s 两排的 density 曲线完全一样；之后上面继续 random walk、越摊越开，下面把 velocity 倒着走，回到两个 bump。彩色的点起初在右边');
}

// ---------- 桥 2：一把换算 noise level 的尺子 ----------
function ddpmAbar() { const a = []; let c = 1; for (let i = 0; i < 1000; i++) { const b = 1e-4 + ((0.02 - 1e-4) * i) / 999; c *= 1 - b; a.push(c); } return a; }
function ruler() {
  const ab = ddpmAbar();
  const sr = logx(0.05, 200, 192, 545);
  let o = '';
  const rows = [
    [['本页、6.S184、π0、CS285', 'EE4706 的 ' + it('t')], [0.95, 0.8, 0.5, 0.3, 0.1, 0.02].map((t) => [(1 - t) / t, String(t)])],
    [['6.S978、CS231N', 'LeRobot 的 ' + it('t')], [0.05, 0.2, 0.5, 0.7, 0.9, 0.98].map((t) => [t / (1 - t), String(t)])],
    [['DDPM（linear，', it('T') + ' = 1000）的 ' + it('t')], [50, 250, 400, 600, 750, 1000].map((t) => [Math.sqrt((1 - ab[t - 1]) / ab[t - 1]), String(t)])],
    [['LSM2234，' + it('D') + ' = 0.5：', 'diffuse 的秒数'], [0.01, 0.1, 1, 4, 100, 1000, 10000].map((t) => [Math.sqrt(t), t >= 1000 ? (t === 1000 ? '10³' : '10⁴') : String(t)])],
  ];
  o += text(192, 20, 'Noise 与 signal 之比 ' + it('σ') + '/' + it('α') + '（log scale）', 'tb');
  const top = 34;
  o += line(192, top + 8, 545, top + 8, 'axis');
  for (const v of [0.1, 1, 10, 100]) o += line(sr(v), top + 4, sr(v), top + 8, 'axis') + text(sr(v), top, String(v), 'ts', 'middle');
  rows.forEach(([name, ticks], k) => {
    const y = 74 + k * 44;
    o += text(170, y - 3, name[0], 'ts', 'end') + text(170, y + 12, name[1], 'ts', 'end');
    o += line(192, y, 545, y, 'ink');
    for (const [r, s] of ticks) { if (r < 0.05 || r > 200) continue; o += line(sr(r), y - 4, sr(r), y + 4, 'ink') + text(sr(r), y + 18, s, 'ts', 'middle'); }
  });
  // DDPM t = 500 的竖线
  const r5 = Math.sqrt((1 - ab[499]) / ab[499]);
  o += line(sr(r5), top + 10, sr(r5), 74 + 3 * 44 + 26, 'ln-dash');
  const lab = [(1 / (1 + r5)).toFixed(3), (r5 / (1 + r5)).toFixed(3), '500', (r5 * r5).toFixed(1) + ' s'];
  lab.forEach((s, k) => { o += rect(sr(r5) + 4, 74 + k * 44 - 19, 46, 15, 'paper-f') + text(sr(r5) + 6, 74 + k * 44 - 7, s, 'tl'); });
  o += text(192, 74 + 3 * 44 + 40, '← noise 少（接近 data）', 'ts') + text(545, 74 + 3 * 44 + 40, 'noise 多 →', 'ts', 'end');
  o += text(sr(r5), 74 + 3 * 44 + 40, it('σ') + '/' + it('α') + ' = ' + r5.toFixed(2), 'tl', 'middle');
  return svg(560, 262, o, `四种时间记号对着同一个 noise 与 signal 之比排成四把尺子。竖线是 DDPM 的 t 等于 500，σ/α 等于 ${r5.toFixed(2)}，对应本页和 6.S184 的 t 等于 ${(1 / (1 + r5)).toFixed(3)}、6.S978 的 t 等于 ${(r5 / (1 + r5)).toFixed(3)}、LSM2234 里 D 为 0.5 的 molecule diffuse ${(r5 * r5).toFixed(1)} 秒`);
}

// ---------- 桥 2：同一个 Euler，两种 time grid ----------
function cosAbar() { const T = 100, f = (u) => Math.cos(((u + 0.008) / 1.008) * Math.PI / 2) ** 2; const a = []; let c = 1; for (let i = 0; i < T; i++) { c *= 1 - Math.min(1 - f((i + 1) / T) / f(i / T), 0.999); a.push(c); } return a; }
export function gridRuns(n = 28) {
  const acp = cosAbar();
  const tsDDIM = [90, 80, 70, 60, 50, 40, 30, 20, 10, 0];
  const gDP = tsDDIM.map((t) => { const a = Math.sqrt(acp[t]), s = Math.sqrt(1 - acp[t]); return a / (a + s); }).concat([1]);
  const gU = Array.from({ length: 11 }, (_, i) => i / 10);
  const c0 = Math.sqrt(acp[90]) + Math.sqrt(1 - acp[90]);
  // N(0,1) 的 n 个 quantile（Acklam 的近似不必要，这里用 bisection 求 Φ⁻¹）
  const Phi = (z) => 0.5 * (1 + erf(z / Math.SQRT2));
  const qs = Array.from({ length: n }, (_, i) => { const p = (i + 0.5) / n; let lo = -6, hi = 6; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; });
  const run = (grid, y0) => { const tr = [[grid[0], y0]]; let y = y0; for (let k = 0; k + 1 < grid.length; k++) { const t = grid[k], h = grid[k + 1] - t; let u; if (t === 0) u = -1.2 - y; else { const { D } = mix(y, t, 1 - t, W82); u = (D - y) / (1 - t); } y += h * u; tr.push([grid[k + 1], y]); } return tr; };
  return { gU, gDP, U: qs.map((z) => run(gU, z)), DP: qs.map((z) => run(gDP, z / c0)) };
}
function erf(x) { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; }
function gridFig() {
  const G = gridRuns();
  let o = '';
  const panel = (x0, title, sub, grid, trs, res) => {
    const sx = lin(0, 1, x0, x0 + 210), sy = lin(-3.6, 3.6, 252, 74);
    let g = text(x0, 18, title, 'tb') + text(x0, 36, sub, 'ts');
    g += line(x0, sy(-3.6), x0 + 210, sy(-3.6), 'axis') + line(x0, sy(-3.6), x0, sy(3.6), 'axis');
    for (const t of grid) g += line(sx(t), sy(-3.6), sx(t), sy(-3.6) + 5, 'ink');
    g += line(x0, sy(0), x0 + 210, sy(0), 'grid');
    for (const tr of trs) { const end = tr[tr.length - 1][1]; g += path(d(tr.map(([t, y]) => [sx(t), sy(Math.max(-3.6, Math.min(3.6, y)))])), end > 0 ? 'ln' : 'mute'); }
    g += text(x0, sy(-3.6) + 18, '0', 'ts', 'middle') + text(x0 + 210, sy(-3.6) + 18, '1', 'ts', 'middle') + text(x0 + 105, sy(-3.6) + 18, it('t') + '（本页的记号）', 'ts', 'middle');
    for (const v of [-2, 2]) g += text(x0 - 5, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
    g += text(x0, 56, res, 'tl');
    return g;
  };
  o += panel(36, 'π0：' + it('τ') + ' 上均匀的 10 步 Euler', '从 ' + it('t') + ' = 0 的纯 noise 出发', G.gU, G.U, '右边 17.9%，W₁ = 0.139');
  o += panel(316, 'Diffusion Policy：10 步 DDIM', 'Cosine schedule 换算成 ' + it('t') + '；从 ' + it('t') + ' = 0.124 出发', G.gDP, G.DP, '右边 22.8%，W₁ = 0.193');
  return svg(560, 276, o, '两个 panel 用同一个 exact velocity 和同样 28 个 N(0,1) 的 quantile 起点。左边是 π0 的均匀 10 步 Euler；右边是 Diffusion Policy 的 10 步 DDIM 换算到同一个 t 上，等价于在一组不均匀的 grid 上走 Euler，而且从 t 等于 0.124 出发。横轴下的短线是每一步的位置。彩色是终点在右边 mode 的 trajectory');
}

// ---------- 桥 3：RTC 的 inpainting ----------
const RH = 16, RS = 8, RD = 3, RJC = 12, RW = 3, RSA = 0.3, RPI = [0.8, 0.2];
const bump = (j) => Math.exp(-((j - RJC) ** 2) / (2 * RW * RW));
function rtcSetup() {
  const R = rng(4706);
  const old = Array.from({ length: RH }, (_, j) => 2 * bump(j) + RSA * R.normal());
  const Y = Array.from({ length: RH }, (_, i) => (i < RH - RS ? old[RS + i] : 0));
  const M = [Array.from({ length: RH }, (_, i) => -2 * bump(RS + i)), Array.from({ length: RH }, (_, i) => 2 * bump(RS + i))];
  const Wm = Array.from({ length: RH }, (_, i) => { if (i < RD) return 1; if (i < RH - RS) { const c = (RH - RS - i) / (RH - RS - RD + 1); return (c * (Math.exp(c) - 1)) / (Math.E - 1); } return 0; });
  return { old, Y, M, Wm };
}
function rtcPost(y, tau, M) {
  const v = tau * tau * RSA * RSA + (1 - tau) ** 2, c = (tau * RSA * RSA) / v;
  const ll = M.map((m, k) => Math.log(RPI[k]) - y.reduce((a, yi, i) => a + (yi - tau * m[i]) ** 2, 0) / (2 * v));
  const mx = Math.max(...ll), r0 = ll.map((l) => Math.exp(l - mx)), Z = r0[0] + r0[1], r = r0.map((q) => q / Z);
  const mu = M.map((m) => m.map((mi, i) => mi + c * (y[i] - tau * mi)));
  const Ah = y.map((_, i) => r[0] * mu[0][i] + r[1] * mu[1][i]);
  const g = M.map((m) => m.map((mi, i) => -(y[i] - tau * mi) / v));
  const gb = y.map((_, i) => r[0] * g[0][i] + r[1] * g[1][i]);
  return { Ah, r, mu, g, gb, c };
}
export function rtcRun(guided, seed, steps = 5, beta = 5) {
  const S = rtcSetup(), R = rng(seed);
  let y = Array.from({ length: RH }, () => R.normal());
  const fr = [y.slice()];
  for (let k = 0; k < steps; k++) {
    const tau = k / steps, h = 1 / steps;
    const P = rtcPost(y, tau, S.M);
    const v = y.map((yi, i) => (P.Ah[i] - yi) / (1 - tau));
    if (guided) {
      const r2 = (1 - tau) ** 2 / (tau * tau + (1 - tau) ** 2);
      const wt = tau === 0 ? beta : Math.min(beta, (1 - tau) / (tau * r2));
      const e = y.map((_, i) => (S.Y[i] - P.Ah[i]) * S.Wm[i]);
      const em = P.mu.map((m) => m.reduce((a, mi, i) => a + e[i] * mi, 0));
      for (let i = 0; i < RH; i++) v[i] += wt * (P.c * e[i] + em[0] * P.r[0] * (P.g[0][i] - P.gb[i]) + em[1] * P.r[1] * (P.g[1][i] - P.gb[i]));
    }
    y = y.map((yi, i) => yi + h * v[i]);
    fr.push(y.slice());
  }
  return fr;
}
function rtcA() {
  const S = rtcSetup();
  const sx = lin(0, RS + RH - 1, 64, 540);
  const nS = 8, T = 9, H = 2.2, steps = 5;
  const kt = [0, H / T, ...Array.from({ length: steps + 1 }, (_, i) => (H + 0.002 + (i / steps) * (T - H - 1.0)) / T), 1];
  let o = '';
  const panel = (y0, title, guided) => {
    const sy = lin(-3, 3, y0 + 118, y0);
    let g = text(64, y0 - 8, title, 'tb');
    g += rect(sx(10.6), sy(1), sx(13.4) - sx(10.6), sy(-1) - sy(1), 'solid2', 3);
    g += line(64, sy(-3), 540, sy(-3), 'axis');
    if (guided) S.Wm.forEach((wv, i) => { if (wv > 0.005) g += rect(sx(RS + i - 0.5), sy(3), sx(1) - sx(0), sy(-3) - sy(3), 'wash').replace('/>', ` opacity="${f1(Math.max(0.15, wv))}"/>`); });
    else g += rect(sx(RS - 0.5), sy(3), sx(RD) - sx(0), sy(-3) - sy(3), 'wash');
    // 旧 chunk：执行过的、冻结的、剩下的
    g += path(d(S.old.slice(0, RS + 1).map((v, j) => [sx(j), sy(v)])), 'ink-b');
    g += path(d(S.old.slice(RS, RS + RD).map((v, j) => [sx(RS + j), sy(v)])), 'ink-b');
    g += path(d(S.old.slice(RS + RD - 1).map((v, j) => [sx(RS + RD - 1 + j), sy(v)])), 'dash');
    let up = 0;
    for (let s = 0; s < nS; s++) {
      const fr = rtcRun(guided, 100 + s, steps);
      const fin = fr[steps];
      const isUp = fin.slice(6).reduce((a, b) => a + b, 0) > 0; if (isUp) up++;
      const pth = (yy) => d(yy.map((v, i) => [sx(RS + i), sy(Math.max(-3, Math.min(3, v)))]));
      const vals = [pth(fin), pth(fin), ...fr.map(pth), pth(fin)];
      g += `<path d="${vals[0]}" class="${isUp ? 'ln' : 'mute'}" style="stroke-width:1.6">${anim('d', vals, kt, T)}</path>`;
    }
    g += text(540, y0 - 8, `${nS} 个新 chunk 里 ${up} 个接着从上面走`, 'tl', 'end');
    return g;
  };
  o += panel(26, '没有 guidance：每个新 chunk 重新 sample', false);
  o += panel(190, 'RTC：soft mask 加 guidance，' + it('β') + ' = 5，5 步 Euler', true);
  for (const j of [0, RS, RS + RD, 16, 23]) o += text(sx(j), 326, String(j), 'ts', 'middle');
  o += text(64, 342, '黑线：旧 chunk（粗的前 ' + RS + ' 步已执行，再 ' + RD + ' 步在 inference 期间执行），浅色底：mask ' + it('W'), 'ts');
  return svgA(560, 348, o, '动图：横轴是 control step，纵轴是 lateral offset，中间灰块是 obstacle。黑线是旧 chunk，从 obstacle 上方绕；新 chunk 从 step 8 开始。动起来时 8 个新 chunk 从 noise 经 5 步 Euler 变成 action。上面没有 guidance，多数新 chunk 选了下方，在 step 11 处从上方跳到下方；下面 RTC 用 soft mask 拉住前几步，多数新 chunk 接着从上方走。第一帧是最后的结果');
}

export default {
  'thread-noise-to-data-fail': failA,
  'thread-noise-to-data-langevin': langevinA,
  'thread-noise-to-data-levels': levelsA,
  'thread-noise-to-data-fick': fickA,
  'thread-noise-to-data-ruler': ruler,
  'thread-noise-to-data-grid': gridFig,
  'thread-noise-to-data-rtc': rtcA,
};
