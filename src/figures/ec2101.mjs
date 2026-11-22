import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, axes, apath, acircle, ashow, anim, f1, sub } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const fx = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// 在 [a, b] 上取 n+1 个点（点数固定，动图每一帧的 path 命令数相同）
const samp = (fn, a, b, n, sx, sy) => {
  const pts = [];
  for (let i = 0; i <= n; i++) { const x = a + ((b - a) * i) / n; pts.push([sx(x), sy(fn(x))]); }
  return d(pts);
};
// 二分：在 [lo, hi] 上找 g(x) = 0（g 在两端异号）
const bis = (g, lo, hi) => {
  let a = lo, b = hi, ga = g(a);
  for (let k = 0; k < 80; k++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
};
// 由 [时长, 状态] 的列表得到 keyTimes 与状态序列（第一项时长为 0）
const tl = (steps) => {
  let t = 0; const ts = [], st = [];
  for (const [dt, s] of steps) { t += dt; ts.push(t); st.push(s); }
  return { kt: ts.map((v) => v / t), st, T: t };
};
const atext = (xs, ys, s, cls, kt, T, anchor = 'start') =>
  `<text x="${f1(xs[0])}" y="${f1(ys[0])}" class="${cls}" text-anchor="${anchor}">${s}${anim('x', xs.map(f1), kt, T)}${anim('y', ys.map(f1), kt, T)}</text>`;
const showText = (x, y, s, cls, on, kt, T, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, kt, T)}</text>`;
const X = it('x'), Y = it('y'), P = it('p'), Q = it('q'), L = it('L'), K = it('K'), U = it('U');

// ---------- 第 1 站：U = xy 的 indifference map ----------
function ic() {
  const sx = lin(0, 70, 50, 330), sy = lin(0, 130, 280, 30);
  let o = axes({ sx, sy, x0: 0, x1: 70, y0: 0, y1: 130, xt: [0, 15, 30, 45, 60], yt: [0, 30, 60, 90, 120], xl: X + '（food）', yl: Y + '（其余 goods）' });
  for (const [u, cls] of [[900, 'mute'], [1800, 'ink-b'], [3600, 'mute']]) {
    o += path(samp((x) => u / x, u / 130, 70, 80, sx, sy), cls);
    o += text(sx(70) + 6, sy(u / 70) + 4, U + ' = ' + u, u === 1800 ? 'tb' : 'ts');
  }
  // 切线：A 处 slope −2，D 处 slope −0.5
  o += line(sx(21), sy(78), sx(39), sy(42), 'ln') + line(sx(46), sy(37), sx(70), sy(25), 'ln');
  o += line(sx(30), sy(60), sx(60), sy(30), 'dash');
  o += circle(sx(30), sy(60), 4.5, 'ink-f') + circle(sx(60), sy(30), 4.5, 'ink-f') + circle(sx(45), sy(45), 4.5, 'paper');
  o += text(sx(30) + 9, sy(60) - 6, 'A', 'tb') + text(sx(60) - 2, sy(30) - 12, 'D', 'tb', 'middle') + text(sx(45) + 9, sy(45) - 6, 'M', 'tb');
  const nx = 400;
  o += text(nx, 60, 'A = (30, 60)', 'tb') + text(nx, 78, 'MRS = ' + Y + '/' + X + ' = 2', 't') + text(nx, 96, '多 1 个 x 肯让出 2 个 y', 'ts');
  o += text(nx, 130, 'D = (60, 30)', 'tb') + text(nx, 148, 'MRS = 0.5', 't') + text(nx, 166, '多 1 个 x 只肯让出 0.5 个 y', 'ts');
  o += text(nx, 200, 'M = (45, 45)', 'tb') + text(nx, 218, 'A 和 D 的平均', 'ts') + text(nx, 236, U + ' = 2025 > 1800', 't');
  return svg(560, 316, o, 'U 等于 xy 的三条 indifference curve；同一条 curve 上 A 点 MRS 为 2，D 点 MRS 为 0.5，A 与 D 的中点 M 落在更高的 curve 上');
}

// ---------- 第 2 站：tangency 与 corner ----------
function choice() {
  let o = '';
  const sy = lin(0, 130, 250, 40);
  // 左：U = xy
  const sx = lin(0, 70, 40, 250);
  o += axes({ sx, sy, x0: 0, x1: 70, y0: 0, y1: 130, xt: [0, 10, 30, 50, 60], yt: [0, 20, 60, 100, 120], xl: X, yl: Y });
  const lens = [];
  for (let i = 0; i <= 40; i++) { const x = 10 + i; lens.push([sx(x), sy(120 - 2 * x)]); }
  for (let i = 40; i >= 0; i--) { const x = 10 + i; lens.push([sx(x), sy(1000 / x)]); }
  o += path(d(lens) + 'Z', 'wash');
  o += path(samp((x) => 1000 / x, 1000 / 130, 70, 80, sx, sy), 'mute') + path(samp((x) => 1800 / x, 1800 / 130, 70, 80, sx, sy), 'ink');
  o += line(sx(0), sy(120), sx(60), sy(0), 'ln');
  o += circle(sx(30), sy(60), 4.5, 'ink-f') + circle(sx(50), sy(20), 4.5, 'paper');
  o += text(sx(30) + 8, sy(60) - 8, 'A (30, 60)', 'tb') + text(sx(50) + 4, sy(20) - 10, 'N', 'tb');
  o += text(sx(70), sy(1800 / 70) - 8, U + ' = 1800', 'ts', 'end') + text(sx(70), sy(1000 / 70) + 16, U + ' = 1000', 'ts', 'end');
  o += text(145, 20, U + ' = ' + X + Y + '：tangency', 'tb', 'middle');
  o += text(40, 302, 'N = (50, 20) 处 MRS = 0.4 < 2：浅色一段都比 N 好', 'ts');
  // 右：U = x + y
  const sx2 = lin(0, 70, 330, 540);
  o += axes({ sx: sx2, sy, x0: 0, x1: 70, y0: 0, y1: 130, xt: [0, 30, 60], yt: [0, 40, 80, 120], xl: X, yl: Y });
  for (const c of [40, 80, 120]) o += line(sx2(0), sy(c), sx2(Math.min(c, 70)), sy(c - Math.min(c, 70)), c === 120 ? 'ink' : 'mute');
  o += line(sx2(0), sy(120), sx2(60), sy(0), 'ln');
  o += circle(sx2(0), sy(120), 5, 'ink-f') + text(sx2(0) + 10, sy(120) - 8, '(0, 120)', 'tb');
  o += text(sx2(70), sy(50) - 8, U + ' = 120', 'ts', 'end') + text(sx2(40) + 4, sy(0) - 8, U + ' = 40', 'ts', 'start');
  o += text(435, 20, U + ' = ' + X + ' + ' + Y + '：corner', 'tb', 'middle');
  o += text(330, 302, '处处 MRS = 1 < 2：全买 y', 'ts');
  o += text(280, 324, '两边的 budget line（彩色）都是 2' + X + ' + ' + Y + ' = 120', 'ts', 'middle');
  return svg(560, 332, o, '左：U 等于 xy 时，最优点 A 是 indifference curve 与 budget line 的切点，budget line 上的 N 点不是最优；右：perfect substitutes 时最优点在 corner (0, 120)');
}

// ---------- 第 2 站：voucher 与 cash ----------
function voucher() {
  const sx = lin(0, 90, 50, 360), sy = lin(0, 170, 280, 30);
  let o = axes({ sx, sy, x0: 0, x1: 90, y0: 0, y1: 170, xt: [0, 8, 20, 40, 60, 80], yt: [0, 40, 80, 120, 160], xl: X + '（food）', yl: Y });
  const a = 0.1, icv = (u) => (x) => (u / x ** a) ** (1 / (1 - a));
  const Uc = 8 ** a * 144 ** (1 - a), Uv = 20 ** a * 120 ** (1 - a);
  const xmin = (u) => (u / 170 ** (1 - a)) ** (1 / a);
  o += line(sx(0), sy(120), sx(60), sy(0), 'mute');
  o += line(sx(0), sy(160), sx(20), sy(120), 'dash');
  o += path(d([[sx(0), sy(120)], [sx(20), sy(120)], [sx(80), sy(0)]]), 'ln');
  o += path(samp(icv(Uc), xmin(Uc), 90, 90, sx, sy), 'ink') + path(samp(icv(Uv), xmin(Uv), 90, 90, sx, sy), 'mute');
  o += circle(sx(8), sy(144), 4.5, 'ink-f') + circle(sx(20), sy(120), 4.5, 'ln-f') + circle(sx(40), sy(80), 4.5, 'paper');
  o += text(sx(8) + 8, sy(144) - 6, '(8, 144)', 't') + text(sx(14), sy(120) + 17, 'kink', 't', 'middle') + text(sx(40) + 8, sy(80) - 4, '(40, 80)', 't');
  o += text(sx(46.4) + 6, sy(27), 'I = 120', 'ts');
  const nx = 382;
  o += text(nx, 46, '彩线：voucher 40', 'tl') + text(nx, 64, '只能买 food', 'ts');
  o += text(nx, 92, '虚线：cash 40', 'tb') + text(nx, 110, '在 x ≥ 20 与彩线重合', 'ts');
  o += text(nx, 146, U + ' = ' + X + '<tspan dy="-5" font-size="10">0.1</tspan><tspan dy="5">' + Y + '</tspan><tspan dy="-5" font-size="10">0.9</tspan><tspan dy="5"> 的人</tspan>', 'tb');
  o += text(nx, 164, 'cash：(8, 144)，U = 107.9', 'ts') + text(nx, 182, 'voucher：kink，U = 100.3', 'ts') + text(nx, 200, '这张 voucher 只值 28.8 cash', 'ts');
  o += text(nx, 236, U + ' = ' + X + Y + ' 的人', 'tb') + text(nx, 254, '两种都选 (40, 80)', 'ts');
  return svg(560, 316, o, 'Food voucher 让 budget 变成在 x 等于 20 处有 kink 的折线；偏好其他 goods 的人被卡在 kink，utility 低于拿同样多 cash 的情形');
}

// ---------- 第 3 站：price 变化，切点移动，demand curve 同步 ----------
function pccA() {
  const sx = lin(0, 90, 40, 290), sy = lin(0, 130, 262, 46);
  const sxr = lin(0, 50, 345, 545), syr = lin(0, 5, 262, 46);
  const steps = [[0, 2]], pushTo = (p1, dur, n) => { const p0 = steps[steps.length - 1][1]; for (let i = 1; i <= n; i++) steps.push([dur / n, p0 + ((p1 - p0) * i) / n]); };
  steps.push([0.8, 2]); pushTo(4, 2.4, 8); steps.push([0.8, 4]); pushTo(1.5, 3.6, 10); steps.push([0.8, 1.5]); pushTo(2, 0.9, 3);
  const { kt, st, T } = tl(steps);
  let o = axes({ sx, sy, x0: 0, x1: 90, y0: 0, y1: 130, xt: [0, 15, 30, 40, 60, 80], yt: [0, 60, 120], xl: X, yl: Y });
  o += line(sx(0), sy(60), sx(90), sy(60), 'dash') + text(sx(90), sy(60) - 8, 'price-consumption curve', 'ts', 'end');
  o += apath(st.map((p) => d([[sx(0), sy(120)], [sx(120 / p), sy(0)]])), kt, T, 'ln');
  o += apath(st.map((p) => { const u = 3600 / p; return samp((x) => u / x, u / 130, 90, 30, sx, sy); }), kt, T, 'ink');
  o += acircle(st.map((p) => sx(60 / p)), st.map(() => sy(60)), kt, T, 5, 'ink-f');
  o += text(165, 12, 'budget 绕 (0, 120) 转，切点跟着走', 'tb', 'middle');
  // 右：demand curve
  o += axes({ sx: sxr, sy: syr, x0: 0, x1: 50, y0: 0, y1: 5, xt: [0, 15, 30, 40], yt: [0, 1.5, 2, 3, 4], xl: X, yl: it('p') + sub('x') });
  o += path(d(Array.from({ length: 61 }, (_, i) => { const p = 1.25 + (3.55 * i) / 60; return [sxr(60 / p), syr(p)]; })), 'ink-b');
  for (const p of [1.5, 2, 4]) o += circle(sxr(60 / p), syr(p), 3, 'mute-f');
  o += apath(st.map((p) => d([[sxr(0), syr(p)], [sxr(60 / p), syr(p)]])), kt, T, 'dash');
  o += acircle(st.map((p) => sxr(60 / p)), st.map((p) => syr(p)), kt, T, 5, 'ln-f');
  o += text(sxr(15) + 8, syr(4) - 6, 'x = 60 / p', 'tb');
  o += text(445, 12, 'demand curve：同一个 x，同步移动', 'tb', 'middle');
  o += text(40, 314, 'p' + sub('x') + ' 在 4 和 1.5 之间来回：x 依次是 30、15、40；y 一直是 60（花在 food 上的钱始终是 60）', 'ts');
  return svgA(560, 320, o, '动图：p_x 在 1.5 到 4 之间变化，budget line 绕 y 轴上的点转动，切点沿 y 等于 60 的水平线移动；右边 demand curve x 等于 60 除以 p 上的点同步移动');
}

// ---------- 第 3 站：Slutsky / Hicks decomposition ----------
function slutskyA() {
  const sx = lin(0, 70, 45, 330), sy = lin(0, 180, 285, 25);
  const U0 = 1800, xB = Math.sqrt(U0 / 4), yB = Math.sqrt(U0 * 4), IB = 4 * xB + yB;
  let o = axes({ sx, sy, x0: 0, x1: 70, y0: 0, y1: 180, xt: [[0, '0'], [15, '15'], [xB, xB.toFixed(1)], [30, '30'], [60, '60']], yt: [0, 60, 120, [IB, IB.toFixed(1)]], xl: X, yl: Y });
  o += path(samp((x) => U0 / x, 10, 70, 60, sx, sy), 'ink') + path(samp((x) => 900 / x, 5, 70, 60, sx, sy), 'mute');
  o += text(sx(70), sy(U0 / 70) - 8, U + ' = 1800', 'ts', 'end') + text(sx(70), sy(900 / 70) - 8, U + ' = 900', 'ts', 'end');
  o += line(sx(0), sy(120), sx(60), sy(0), 'ink') + line(sx(0), sy(120), sx(30), sy(0), 'ink') + line(sx(0), sy(IB), sx(IB / 4), sy(0), 'dash');
  for (const [x, y, s, dx, dy] of [[30, 60, 'A', 8, -6], [xB, yB, 'B', 8, -6], [15, 60, 'C', -10, -6]]) o += circle(sx(x), sy(y), 4, 'ink-f') + text(sx(x) + dx, sy(y) + dy, s, 'tb', dx < 0 ? 'end' : 'start');
  // 拆分标在 x 轴下方
  const by = 285 + 36;
  const br = (a, b, s, y) => line(sx(a), y, sx(b), y, 'ln') + line(sx(a), y - 4, sx(a), y + 4, 'ln') + line(sx(b), y - 4, sx(b), y + 4, 'ln') + text((sx(a) + sx(b)) / 2, y + 17, s, 'ts', 'middle');
  o += br(30, xB, 'SE −8.79', by) + br(xB, 15, 'IE −6.21', by + 28);
  // 动：先沿 U0 滚动（p 从 2 到 4），再平移回 I = 120
  const steps = [[0, [2, null]], [1.0, [2, null]]];
  for (let i = 1; i <= 10; i++) steps.push([0.25, [2 + 0.2 * i, null]]);
  steps.push([0.7, [4, null]]);
  for (let i = 1; i <= 5; i++) steps.push([0.3, [4, IB + ((120 - IB) * i) / 5]]);
  steps.push([2.6, [4, 120]]); steps.push([0.5, [2, null]]);
  const { kt, st, T } = tl(steps);
  const lineOf = ([p, I]) => { const inc = I ?? 2 * Math.sqrt(U0 * p); return d([[sx(0), sy(inc)], [sx(inc / p), sy(0)]]); };
  const ptOf = ([p, I]) => (I == null ? [Math.sqrt(U0 / p), Math.sqrt(U0 * p)] : [I / (2 * p), I / 2]);
  o += apath(st.map(lineOf), kt, T, 'ln');
  o += acircle(st.map((s) => sx(ptOf(s)[0])), st.map((s) => sy(ptOf(s)[1])), kt, T, 5.5, 'ln-f');
  const nx = 350;
  o += text(nx, 40, 'p' + sub('x') + '：2 → 4，I = 120，p' + sub('y') + ' = 1', 'tb');
  o += text(nx, 72, '① 一边涨价一边补 income，', 't') + text(nx, 90, '让 budget 沿 U = 1800 滚动', 't') + text(nx, 108, 'A → B：substitution effect', 'tl') + text(nx, 126, 'x：30 → 21.21', 'ts');
  o += text(nx, 160, '② 收回 subsidy，budget 平移', 't') + text(nx, 178, '回到 I = 120（实线）', 't') + text(nx, 196, 'B → C：income effect', 'tl') + text(nx, 214, 'x：21.21 → 15', 'ts');
  o += text(nx, 248, '虚线是加了 subsidy 的 budget，', 'ts') + text(nx, 266, 'I = 169.71', 'ts');
  return svgA(560, 372, o, '动图：p_x 从 2 涨到 4。彩色 budget line 先沿 U 等于 1800 的 indifference curve 滚动，切点从 A 走到 B，这是 substitution effect；再平移回 income 120，切点从 B 走到 C，这是 income effect');
}

// ---------- 第 3 站：CV、ΔCS、EV 三块 area ----------
function cvev() {
  const sx = lin(0, 50, 50, 330), sy = lin(0, 5, 270, 30);
  let o = '';
  const h0 = (p) => Math.sqrt(1800 / p), h1 = (p) => Math.sqrt(900 / p), m = (p) => 60 / p;
  const reg = (fn) => { const pts = [[sx(0), sy(2)]]; for (let i = 0; i <= 40; i++) { const p = 2 + (2 * i) / 40; pts.push([sx(fn(p)), sy(p)]); } pts.push([sx(0), sy(4)]); return d(pts) + 'Z'; };
  o += path(reg(h0), 'wash') + path(reg(m), 'wash-strong') + path(reg(h1), 'solid');
  o += axes({ sx, sy, x0: 0, x1: 50, y0: 0, y1: 5, xt: [0, 15, 21.21, 30].map((v) => [v, Number.isInteger(v) ? String(v) : v.toFixed(1)]), yt: [0, 1, 2, 3, 4], xl: X, yl: it('p') + sub('x') });
  const cur = (fn, cls) => { const pts = []; for (let i = 0; i <= 60; i++) { const p = 1.3 + (3.5 * i) / 60; pts.push([sx(fn(p)), sy(p)]); } return path(d(pts), cls); };
  o += cur(h0, 'ln-dash') + cur(m, 'ink-b') + cur(h1, 'mute');
  o += line(sx(0), sy(2), sx(48), sy(2), 'grid') + line(sx(0), sy(4), sx(48), sy(4), 'grid');
  o += text(sx(9), sy(3) + 5, 'EV', 'tw', 'middle');
  const nx = 360;
  o += text(nx, 52, '到哪条 curve 为止的 area', 'tb');
  o += line(nx, 74, nx + 26, 74, 'mute') + text(nx + 34, 78, 'h(p, U = 900)：EV = 35.15', 't');
  o += line(nx, 100, nx + 26, 100, 'ink-b') + text(nx + 34, 104, 'x = 60/p：ΔCS = 41.59', 't');
  o += line(nx, 126, nx + 26, 126, 'ln-dash') + text(nx + 34, 130, 'h(p, U = 1800)：CV = 49.71', 't');
  o += text(nx, 168, '三块都是 p 从 2 到 4、', 'ts') + text(nx, 186, '从 p 轴往右量到 curve', 'ts');
  o += text(nx, 214, '在 p = 2 处 h(p, 1800) 与 x 交于 30，', 'ts') + text(nx, 232, '在 p = 4 处 h(p, 900) 与 x 交于 15', 'ts');
  return svg(560, 300, o, '同一次涨价的三种 welfare 度量：p 从 2 到 4 之间，Marshallian demand、以及 U 等于 1800 和 U 等于 900 的两条 Hicksian demand 左边的 area 分别是 41.59、49.71、35.15');
}

// ---------- 第 4 站：isoquant 与 isocost ----------
function iso() {
  const sx = lin(0, 12, 50, 320), sy = lin(0, 45, 270, 30);
  let o = axes({ sx, sy, x0: 0, x1: 12, y0: 0, y1: 45, xt: [0, 2, 4, 6, 8, 10], yt: [0, 8, 16, 24, 32, 40], xl: L + '（labor）', yl: K + '（capital）' });
  o += path(samp((l) => 64 / l, 64 / 45, 12, 80, sx, sy), 'ink-b') + text(sx(1.9), sy(43), Q + ' = 4 的 isoquant', 'tb');
  for (const c of [24, 32, 40]) o += line(sx(0), sy(c), sx(c / 4), sy(0), c === 32 ? 'ln' : 'mute');
  o += text(sx(6) + 4, sy(0) - 6, 'C = 24', 'ts') + text(sx(10) + 4, sy(0) - 6, 'C = 40', 'ts');
  o += line(sx(0), sy(0), sx(11.25), sy(45), 'dash') + text(sx(10.4) + 6, sy(41.6) + 4, K + ' = 4' + L, 'ts');
  o += circle(sx(4), sy(16), 5, 'ln-f') + circle(sx(2), sy(32), 4.5, 'paper') + circle(sx(8), sy(8), 4.5, 'paper');
  o += text(sx(4) + 9, sy(16) - 2, 'T (4, 16)', 'tb') + text(sx(2) + 9, sy(32) - 4, '(2, 32)', 't') + text(sx(8) + 8, sy(8) - 8, '(8, 8)', 't');
  const nx = 352;
  o += text(nx, 46, 'w = 4，r = 1', 'tb') + text(nx, 64, 'isocost 4L + K = C，slope −4', 'ts');
  o += text(nx, 100, 'T：MRTS = K/L = 4 = w/r', 'tl') + text(nx, 118, 'cost 32（彩色 isocost）', 'ts');
  o += text(nx, 152, '(2, 32)：MRTS = 16 > 4', 't') + text(nx, 170, '(8, 8)：MRTS = 1 < 4', 't') + text(nx, 188, '两点 cost 都是 40', 'ts');
  o += text(nx, 222, '虚线 K = 4L 是 expansion path：', 'ts') + text(nx, 240, '每个 q 的最便宜组合都在上面', 'ts');
  return svg(560, 300, o, 'q 等于 4 的 isoquant 与三条 isocost line；cost 最低的组合 T (4, 16) 在 isocost 与 isoquant 相切处，K 等于 4L');
}

// ---------- 第 4 站：short run，K 固定在 16，q 增加 ----------
function srcostA() {
  const sx = lin(0, 15, 40, 250), sy = lin(0, 40, 262, 46);
  const sx2 = lin(0, 7, 320, 545), sy2 = lin(0, 30, 262, 46);
  const qs = []; for (let q = 1.2; q <= 6.3 + 1e-9; q += 0.3) qs.push(q);
  const steps = [[0, 1.2], [0.8, 1.2]];
  for (let i = 1; i < qs.length; i++) steps.push([0.3, qs[i]]);
  steps.push([2.0, qs[qs.length - 1]]); steps.push([0.6, 1.2]);
  const { kt, st, T } = tl(steps);
  let o = axes({ sx, sy, x0: 0, x1: 15, y0: 0, y1: 40, xt: [[0, '0'], [4, '4'], [13.5, '13.5']], yt: [0, 16, 40], xl: L, yl: K });
  for (const q of [2, 4, 6]) o += path(samp((l) => q ** 3 / l, q ** 3 / 40, 15, 60, sx, sy), q === 4 ? 'ink' : 'mute');
  o += line(sx(0), sy(16), sx(15), sy(16), 'ink-b') + text(sx(15), sy(16) + 18, K + ' = 16 固定', 'ts', 'end');
  o += line(sx(0), sy(0), sx(10), sy(40), 'dash') + text(sx(10) + 5, sy(40) + 12, 'LR：' + K + ' = 4' + L, 'ts');
  o += text(sx(1.6) + 4, sy(40) + 12, Q + ' = 4', 'ts') + text(sx(5.4) + 4, sy(40) + 12, Q + ' = 6', 'ts') + text(sx(15), sy(8 / 15) - 6, Q + ' = 2', 'ts', 'end');
  o += acircle(st.map((q) => sx(q ** 3 / 16)), st.map(() => sy(16)), kt, T, 5, 'ln-f');
  o += text(145, 12, 'K 固定：q 每多 2，L 多 3.5、再多 9.5', 'tb', 'middle');
  // 右：三条 short-run cost curve
  o += axes({ sx: sx2, sy: sy2, x0: 0, x1: 7, y0: 0, y1: 30, xt: [0, 2, 4, 6], yt: [0, 12, 27], xl: Q, yl: '' });
  const mc = (q) => 0.75 * q * q, atc = (q) => 32 / q + (q * q) / 4, avc = (q) => (q * q) / 4;
  o += path(samp(mc, 0, Math.sqrt(40), 60, sx2, sy2), 'ln') + path(samp(atc, 32 / 29.5, 7, 80, sx2, sy2), 'ink-b') + path(samp(avc, 0, 7, 60, sx2, sy2), 'mute');
  o += text(sx2(Math.sqrt(40)) - 6, sy2(30) + 4, 'SRMC', 'tl', 'end') + text(545, sy2(atc(7)) - 8, 'SRATC', 'tb', 'end') + text(545, sy2(avc(7)) - 8, 'SRAVC', 'ts', 'end');
  o += circle(sx2(4), sy2(12), 4, 'paper') + text(sx2(4) + 8, sy2(12) + 18, '(4, 12)', 'ts');
  o += apath(st.map((q) => d([[sx2(q), sy2(0)], [sx2(q), sy2(Math.min(30, mc(q)))]])), kt, T, 'dash');
  o += acircle(st.map((q) => sx2(q)), st.map((q) => sy2(mc(q))), kt, T, 4.5, 'ln-f');
  o += acircle(st.map((q) => sx2(q)), st.map((q) => sy2(atc(q))), kt, T, 4.5, 'ink-f');
  o += acircle(st.map((q) => sx2(q)), st.map((q) => sy2(avc(q))), kt, T, 4, 'mute-f');
  o += text(432, 12, 'SRMC 在 (4, 12) 穿过 SRATC 的最低点', 'tb', 'middle');
  return svgA(560, 297, o, '动图：capital 固定在 16，output 从 1.2 增加到 6.3，左边投入点沿 K 等于 16 的水平线右移，越往后同样多的 output 要多得多的 labor；右边 SRMC、SRATC、SRAVC 上的点同步移动');
}

// ---------- 第 4 站：LRAC 是 SRATC 的 envelope ----------
function envelopeA() {
  const sx = lin(0, 12, 50, 390), sy = lin(0, 30, 260, 30);
  const F = 16, lrac = (q) => F / q + 4 * Math.sqrt(q), srac = (K) => (q) => (F + K) / q + (4 * q * q) / K;
  const rng = (fn) => { const qm = bis((q) => -(fn(q) - fn(q + 1e-6)), 0.05, 20); const lo = bis((q) => fn(q) - 30, 0.05, qm); const hi = fn(12) <= 30 ? 12 : bis((q) => fn(q) - 30, qm, 12); return [lo, hi, qm]; };
  let o = axes({ sx, sy, x0: 0, x1: 12, y0: 0, y1: 30, xt: [0, 1, 4, 9, 12], yt: [0, 12, 20, 30], xl: Q, yl: '平均 cost' });
  for (const K0 of [2, 16, 54]) { const [lo, hi] = rng(srac(K0)); o += path(samp(srac(K0), lo, hi, 60, sx, sy), 'mute'); }
  const [llo] = rng(lrac);
  o += path(samp(lrac, llo, 12, 80, sx, sy), 'ink-b') + text(sx(6.5), sy(lrac(6.5)) + 20, 'LRAC', 'tb', 'middle');
  o += text(sx(3.35) + 6, sy(27) + 4, K + ' = 2', 'ts') + text(sx(4), sy(12) + 22, K + ' = 16', 'ts', 'middle') + text(sx(10.5), sy(14.84) - 12, K + ' = 54', 'ts', 'middle');
  const Ks = []; for (let i = 0; i <= 12; i++) Ks.push(2 * 27 ** (i / 12));
  const steps = [[0, 54], [1.2, 54]];
  for (let i = 11; i >= 0; i--) steps.push([0.35, Ks[i]]);
  steps.push([1.0, 2]);
  for (let i = 1; i <= 12; i++) steps.push([0.35, Ks[i]]);
  const { kt, st, T } = tl(steps);
  o += apath(st.map((K0) => { const [lo, hi] = rng(srac(K0)); return samp(srac(K0), lo, hi, 50, sx, sy); }), kt, T, 'ln');
  const qt = (K0) => (K0 / 2) ** (2 / 3), qm = (K0) => (((F + K0) * K0) / 8) ** (1 / 3);
  o += acircle(st.map((K0) => sx(qt(K0))), st.map((K0) => sy(lrac(qt(K0)))), kt, T, 5, 'ink-f');
  o += acircle(st.map((K0) => sx(qm(K0))), st.map((K0) => sy(srac(K0)(qm(K0)))), kt, T, 5, 'paper');
  const nx = 405;
  o += text(nx, 44, '彩线：某个 K 的 SRATC', 'tl');
  o += text(nx, 66, '实心点：与 LRAC 相切处', 'ts') + text(nx, 84, '空心点：SRATC 的最低点', 'ts');
  o += text(nx, 118, 'K = 2', 'tb') + text(nx, 136, '相切 q = 1，最低 q = 1.65', 'ts');
  o += text(nx, 164, 'K = 16', 'tb') + text(nx, 182, '两点重合在 q = 4', 'ts');
  o += text(nx, 210, 'K = 54', 'tb') + text(nx, 228, '相切 q = 9，最低 q = 7.79', 'ts');
  return svgA(560, 290, o, '动图：capital 从 54 连续变到 2 再变回来，对应的 SRATC curve 沿 LRAC 滑动，始终与 LRAC 相切；只有 K 等于 16 时切点是 SRATC 的最低点');
}

// ---------- 第 5 站：demand 上升之后 entry ----------
function entryA() {
  const sx = lin(0, 1000, 50, 290), sy = lin(0, 60, 250, 30);
  const sx2 = lin(0, 8, 345, 545), sy2 = lin(0, 35, 250, 30);
  const qf = (p) => 2 * Math.sqrt(p / 3), atc = (q) => 32 / q + (q * q) / 4, mc = (q) => 0.75 * q * q;
  const peq = (N) => bis((p) => 1140 - 20 * p - N * qf(p), 0.01, 57);
  const Ns = []; for (let i = 0; i <= 10; i++) Ns.push(100 + 12.5 * i);
  const steps = [[0, 100], [1.6, 100]];
  for (let i = 1; i <= 10; i++) steps.push([0.4, Ns[i]]);
  steps.push([2.4, 225]); steps.push([0.6, 100]);
  const { kt, st, T } = tl(steps);
  let o = axes({ sx, sy, x0: 0, x1: 1000, y0: 0, y1: 60, xt: [0, 400, 600, 900], yt: [0, 12, 27, 57], xl: Q + '（market）', yl: P });
  o += line(sx(640), sy(0), sx(0), sy(32), 'dash') + line(sx(1000), sy(7), sx(0), sy(57), 'ink');
  o += text(sx(0) + 6, sy(32) - 8, 'D 原来', 'ts') + text(sx(0) + 6, sy(57) - 8, 'D 上升后', 'ts');
  o += line(sx(0), sy(12), sx(1000), sy(12), 'ln-dash') + text(165, sy(12) - 6, 'LR supply', 'ts');
  o += apath(st.map((N) => { const pmax = Math.min(60, 3 * (1000 / (2 * N)) ** 2); return samp((p) => p, 0, pmax, 30, (p) => sx(N * qf(p)), sy); }), kt, T, 'ln');
  o += acircle(st.map((N) => sx(1140 - 20 * peq(N))), st.map((N) => sy(peq(N))), kt, T, 5, 'ink-f');
  o += text(170, 18, 'market：entry 让 S 右移', 'tb', 'middle');
  // 右：一个 firm
  o += axes({ sx: sx2, sy: sy2, x0: 0, x1: 8, y0: 0, y1: 35, xt: [0, 4, 6, 8], yt: [0, 12, 27], xl: Q + '（一个 firm）', yl: '' });
  o += apath(st.map((N) => { const p = peq(N), q = qf(p); return d([[sx2(0), sy2(atc(q))], [sx2(q), sy2(atc(q))], [sx2(q), sy2(p)], [sx2(0), sy2(p)]]) + 'Z'; }), kt, T, 'wash');
  o += path(samp(mc, 0, Math.sqrt(35 / 0.75), 50, sx2, sy2), 'ln') + path(samp(atc, 32 / 34, 8, 80, sx2, sy2), 'ink-b');
  o += text(sx2(Math.sqrt(35 / 0.75)) - 6, sy2(35) + 4, 'SRMC', 'tl', 'end') + text(545, sy2(atc(8)) + 30, 'SRATC', 'tb', 'end');
  o += apath(st.map((N) => d([[sx2(0), sy2(peq(N))], [sx2(8), sy2(peq(N))]])), kt, T, 'dash');
  o += acircle(st.map((N) => sx2(qf(peq(N)))), st.map((N) => sy2(peq(N))), kt, T, 5, 'ink-f');
  o += text(445, 18, 'firm：沿 SRMC 往下走', 'tb', 'middle');
  const on0 = st.map((N) => N === 100), on1 = st.map((N) => N === 225);
  o += showText(50, 306, 'Short run：N = 100，p = 27，每个 firm q = 6，profit 76（浅色矩形）', 't', on0, kt, T);
  o += showText(50, 306, 'Long run：N = 225，p = 12，每个 firm q = 4，profit 0', 'tl', on1, kt, T);
  return svgA(560, 314, o, '动图：demand 上升后，firm 数从 100 增加到 225，market supply 右移，price 从 27 降到 12；右边单个 firm 的 output 沿 SRMC 从 6 降到 4，profit 矩形缩小到零');
}

// ---------- 第 6 站：third-degree price discrimination ----------
function pd3() {
  const sy = lin(0, 60, 250, 30);
  let o = '';
  const panel = (x0, a, b, q, p, qu, title, epsU) => {
    const sx = lin(0, 600, x0, x0 + 210);
    o += axes({ sx, sy, x0: 0, x1: 600, y0: 0, y1: 60, xt: [0, q, 600].map((v) => [v, String(v)]), yt: x0 < 300 ? [0, 12, 21, 26, 36, 60] : [], xl: Q, yl: x0 < 300 ? P : '' });
    o += line(sx(0), sy(a), sx(600), sy(a - b * 600), 'ink') + line(sx(0), sy(a), sx(a / (2 * b)), sy(0), 'dash');
    o += line(sx(0), sy(12), sx(600), sy(12), 'mute');
    o += line(sx(0), sy(26), sx(600), sy(26), 'ln-dash');
    o += line(sx(q), sy(0), sx(q), sy(p), 'grid') + line(sx(0), sy(p), sx(q), sy(p), 'grid');
    o += circle(sx(q), sy(p), 5, 'ln-f') + circle(sx(qu), sy(26), 4, 'paper');
    o += text(sx(q) + 8, sy(p) - 6, '(' + q + ', ' + p + ')', 'tb');
    o += text(x0 + 105, 18, title, 'tb', 'middle');
    return sx;
  };
  const s1 = panel(50, 60, 0.1, 240, 36, 340, 'market 1：q = 600 − 10p');
  o += text(s1(300) + 4, sy(0) - 6, 'MR', 'ts') + text(s1(600), sy(0) - 6, 'D', 'ts', 'end');
  o += text(s1(340) + 8, sy(26) - 6, 'uniform 26：q = 340', 'ts') + text(s1(600), sy(12) - 6, 'MC = 12', 'ts', 'end');
  const s2 = panel(330, 30, 0.05, 180, 21, 80, 'market 2：q = 600 − 20p');
  o += text(s2(300) + 4, sy(0) - 6, 'MR', 'ts') + text(s2(600), sy(0) - 6, 'D', 'ts', 'end');
  o += text(s2(80) + 8, sy(26) - 6, 'uniform 26：q = 80', 'ts') + text(s2(600), sy(12) - 6, 'MC = 12', 'ts', 'end');
  o += text(280, 306, '彩点：各自 MR = MC 得到的 price 36 和 21；空心点：只准定一个 price 时的 26', 'ts', 'middle');
  return svg(560, 312, o, '两个 market，MC 都是 12。分开定价时 market 1 的 price 是 36、quantity 240，market 2 的 price 是 21、quantity 180；统一定价 26 时两边分别买 340 和 80');
}

// ---------- 第 7 站：Edgeworth box 里的 price 调整 ----------
function edgeA() {
  const W = 12, H = 9, ox = 40, oy = 300, u = 30;
  const PA = (x, y) => [ox + x * u, oy - y * u];
  const E = [8, 2];
  const dA = (p) => [(8 * p + 2) / (2 * p), (8 * p + 2) / 2];
  const dB = (p) => { const xb = (4 * p + 7) / (3 * p), yb = (2 * (4 * p + 7)) / 3; return [W - xb, H - yb]; };
  const clipLine = (p) => {
    // y = 2 − p(x − 8)，与 box 的交点
    const pts = [];
    const yAt = (x) => 2 - p * (x - 8), xAt = (y) => 8 - (y - 2) / p;
    if (yAt(0) <= H) pts.push([0, yAt(0)]); else pts.push([xAt(H), H]);
    if (yAt(W) >= 0) pts.push([W, yAt(W)]); else pts.push([xAt(0), 0]);
    return d(pts.map(([x, y]) => PA(x, y)));
  };
  const icA = (ua) => { const a = Math.max(ua / H, 0.01); return d(Array.from({ length: 31 }, (_, i) => { const x = a + ((W - a) * i) / 30; return PA(x, Math.min(H, ua / x)); })); };
  const icB = (ub) => { const a = ub / (H * H); return d(Array.from({ length: 31 }, (_, i) => { const xb = a + ((W - a) * i) / 30; return PA(W - xb, H - Math.min(H, Math.sqrt(ub / xb))); })); };
  let o = rect(ox, oy - H * u, W * u, H * u, 'frame');
  o += text(ox - 6, oy + 16, 'O' + sub('A'), 'tb', 'end') + text(ox + W * u + 6, oy - H * u - 4, 'O' + sub('B'), 'tb');
  o += text(ox + W * u, oy + 18, 'x' + sub('A') + ' →', 'ts', 'end') + text(ox - 8, oy - H * u + 12, 'y' + sub('A') + ' ↑', 'ts', 'end');
  o += text(ox, oy - H * u - 6, '← x' + sub('B'), 'ts') + text(ox + W * u + 8, oy - 12, 'y' + sub('B') + ' ↓', 'ts');
  for (let i = 1; i < W; i++) o += line(ox + i * u, oy, ox + i * u, oy + 4, 'axis') + (i % 2 === 0 ? text(ox + i * u, oy + 16, String(i), 'ts', 'middle') : '');
  for (let j = 1; j < H; j++) o += line(ox - 4, oy - j * u, ox, oy - j * u, 'axis') + text(ox - 7, oy - j * u + 4, j === 8 ? '' : String(j), 'ts', 'end');
  // 静态：过 E 的两条 indifference curve（lens）、contract curve、equilibrium
  o += path(icA(16), 'mute') + path(icB(196), 'mute');
  o += path(d(Array.from({ length: 41 }, (_, i) => { const x = (W * i) / 40; return PA(x, (9 * x) / (24 - x)); })), 'ln-dash');
  o += text(...PA(8.6, 6.4), 'contract curve', 'tl', 'end');
  o += circle(...PA(...E), 5, 'ink-f') + text(PA(...E)[0] - 8, PA(...E)[1] + 18, 'E (8, 2)', 'tb', 'end');
  o += circle(...PA(6, 3), 6, 'paper') + text(PA(6, 3)[0] - 10, PA(6, 3)[1] + 20, '(6, 3)', 'tb', 'end');
  // 动：price 从 1 降到 0.5
  const ps = [1, 0.8, 0.65, 0.5];
  const steps = [[0, 1], [2.2, 1]];
  for (let k = 1; k < ps.length; k++) { const a = ps[k - 1], b = ps[k]; for (let i = 1; i <= 4; i++) steps.push([0.2, a + ((b - a) * i) / 4]); steps.push([k === ps.length - 1 ? 3.0 : 1.6, b]); }
  steps.push([0.6, 1]);
  const { kt, st, T } = tl(steps);
  o += apath(st.map(clipLine), kt, T, 'ln');
  o += apath(st.map((p) => { const [x, y] = dA(p); return icA(x * y); }), kt, T, 'ink');
  o += apath(st.map((p) => { const [x, y] = dB(p); return icB((W - x) * (H - y) ** 2); }), kt, T, 'dash');
  o += acircle(st.map((p) => PA(...dA(p))[0]), st.map((p) => PA(...dA(p))[1]), kt, T, 5, 'ink-f');
  o += acircle(st.map((p) => PA(...dB(p))[0]), st.map((p) => PA(...dB(p))[1]), kt, T, 5, 'ln-f');
  const nx = 430;
  o += text(nx, 40, '彩线：price line', 'tl') + text(nx, 58, '斜率 −p，p = p' + sub('x') + '/p' + sub('y'), 'ts');
  o += text(nx, 80, '黑点：A 想要的 bundle', 'ts') + text(nx, 98, '彩点：B 想要的 bundle', 'ts');
  ps.forEach((p, k) => {
    const xa = dA(p)[0], xb = W - dB(p)[0], z = xa + xb - W;
    const on = st.map((s) => Math.abs(s - p) < 1e-9);
    if (k === 0) on[0] = true;
    o += showText(nx, 136, 'p = ' + p.toFixed(2), 'tb', on, kt, T);
    o += showText(nx, 156, 'A 要 x = ' + xa.toFixed(2), 't', on, kt, T);
    o += showText(nx, 174, 'B 要 x = ' + xb.toFixed(2), 't', on, kt, T);
    o += showText(nx, 192, '合计 ' + (xa + xb).toFixed(2) + (Math.abs(z) < 1e-9 ? ' = 12' : ' < 12'), 't', on, kt, T);
    o += showText(nx, 214, Math.abs(z) < 1e-9 ? 'market clear' : 'x 卖不完，p 下降', Math.abs(z) < 1e-9 ? 'tl' : 'ts', on, kt, T);
  });
  o += text(nx, 250, '空心圈 (6, 3)：', 'ts') + text(nx, 268, 'p = 0.5 时两点重合', 'ts');
  return svgA(560, 320, o, '动图：Edgeworth box 中 price line 绕 endowment E (8, 2) 转动，price 从 1 降到 0.5，A 和 B 想要的 bundle 逐渐靠拢，在 p 等于 0.5 时重合于 contract curve 上的 (6, 3)');
}

export default {
  'ec2101-ic': ic,
  'ec2101-choice': choice,
  'ec2101-voucher': voucher,
  'ec2101-pcc': pccA,
  'ec2101-slutsky': slutskyA,
  'ec2101-cvev': cvev,
  'ec2101-iso': iso,
  'ec2101-srcost': srcostA,
  'ec2101-envelope': envelopeA,
  'ec2101-entry': entryA,
  'ec2101-pd3': pd3,
  'ec2101-edge': edgeA,
};
