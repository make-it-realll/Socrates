import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const matmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, a, k) => s + a * B[k][j], 0)));
const matpow = (A, n) => {
  let R = A.map((r, i) => r.map((_, j) => (i === j ? 1 : 0)));
  for (let k = 0; k < n; k++) R = matmul(R, A);
  return R;
};
// 箭头头部（沿 (fx,fy)→(x,y) 的方向）
function head(x, y, fx, fy, cls, size = 7) {
  const a = Math.atan2(y - fy, x - fx);
  const p = (ang) => [x - size * Math.cos(a + ang), y - size * Math.sin(a + ang)];
  return poly([[x, y], p(0.42), p(-0.42)], cls + '-f');
}
// 二次 Bézier 的弯箭头：从圆 A 到圆 B，bend > 0 向左弯
function bent(ax, ay, bx, by, r, bend, cls) {
  const mx = (ax + bx) / 2, my = (ay + by) / 2, L = Math.hypot(bx - ax, by - ay);
  const nx = -(by - ay) / L, ny = (bx - ax) / L;
  const cx = mx + bend * nx, cy = my + bend * ny;
  const s = Math.atan2(cy - ay, cx - ax), e = Math.atan2(cy - by, cx - bx);
  const x1 = ax + r * Math.cos(s), y1 = ay + r * Math.sin(s), x2 = bx + r * Math.cos(e), y2 = by + r * Math.sin(e);
  return { o: path(`M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, cls) + head(x2, y2, cx, cy, cls), lx: 0.25 * x1 + 0.5 * cx + 0.25 * x2, ly: 0.25 * y1 + 0.5 * cy + 0.25 * y2 };
}
// self-loop：在圆的 up / down 一侧
function loop(cx, cy, r, side, cls) {
  const sg = side === 'up' ? -1 : 1;
  const a1 = [cx - r * 0.6, cy + sg * r * 0.8], a2 = [cx + r * 0.6, cy + sg * r * 0.8];
  const c1 = [cx - r * 1.4, cy + sg * r * 2.6], c2 = [cx + r * 1.4, cy + sg * r * 2.6];
  return { o: path(`M${a1[0]} ${a1[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${a2[0]} ${a2[1]}`, cls) + head(a2[0], a2[1], c2[0], c2[1], cls), lx: cx, ly: cy + sg * r * 2.35 };
}
const node = (x, y, r, s, cls = 'paper') => circle(x, y, r, cls) + text(x, y + 5, s, 'tb', 'middle');
function mulberry32(a) {
  return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const SOC = [[0.7, 0.2, 0.1], [0.3, 0.5, 0.2], [0.2, 0.4, 0.4]];

// 1. 两个 state 的 chain：graph 和 n-step probability
function twostate() {
  const P = [[0.5, 0.5], [0.2, 0.8]];
  const A = [65, 120], B = [195, 120], r = 22;
  let o = node(A[0], A[1], r, '1') + node(B[0], B[1], r, '2');
  const top = bent(A[0], A[1], B[0], B[1], r, -42, 'ink'), bot = bent(B[0], B[1], A[0], A[1], r, -42, 'ink');
  o += top.o + text(top.lx, top.ly - 8, '0.5', 'ts', 'middle') + bot.o + text(bot.lx, bot.ly + 18, '0.2', 'ts', 'middle');
  const l1 = loop(A[0], A[1], r, 'up', 'ink'), l2 = loop(B[0], B[1], r, 'up', 'ink');
  o += l1.o + text(l1.lx, l1.ly - 10, '0.5', 'ts', 'middle') + l2.o + text(l2.lx, l2.ly - 10, '0.8', 'ts', 'middle');
  const sx = lin(0, 10, 290, 515), sy = lin(0, 1, 215, 35);
  o += axes({ sx, sy, x0: 0, x1: 10, y0: 0, y1: 1, xt: [0, 2, 4, 6, 8, 10], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'n' });
  o += line(sx(0), sy(2 / 7), sx(10), sy(2 / 7), 'dash') + text(sx(10) + 4, sy(2 / 7) + 4, '2/7', 'ts');
  for (const [i, cls] of [[0, 'ln'], [1, 'ink']]) {
    const pts = [];
    for (let n = 0; n <= 10; n++) pts.push([sx(n), sy(matpow(P, n)[i][0])]);
    o += path(d(pts), cls);
    for (const p of pts) o += circle(p[0], p[1], 3, cls === 'ln' ? 'ln-f' : 'ink-f');
  }
  o += text(sx(1.3), sy(0.88), '从 1 出发', 'tl') + text(sx(1.3), sy(0.06), '从 2 出发', 't');
  o += text(sx(5), 22, 'n 步后在 state 1 的 probability', 'tb', 'middle');
  return svg(560, 255, o, '两个 state 的 Markov chain 的 transition graph，以及从 state 1 和 state 2 出发 n 步后在 state 1 的 probability，两者都趋向七分之二');
}

// 2. gambler's ruin，N = 4，p = 0.4
function ruin() {
  const p = 0.4, q = 0.6, N = 4, th = q / p;
  const h = (x) => (th ** x - 1) / (th ** N - 1), g = (x) => (x - N * h(x)) / (q - p);
  const X = (i) => 90 + i * 105, Y = 95, r = 21;
  let o = '';
  for (let i = 0; i <= 4; i++) o += node(X(i), Y, r, String(i), i === 0 || i === 4 ? 'wash ink-s' : 'paper');
  for (let i = 1; i <= 3; i++) {
    const up = bent(X(i), Y, X(i + 1), Y, r, -26, 'ln'), dn = bent(X(i), Y, X(i - 1), Y, r, -26, 'ink');
    o += up.o + text(up.lx, up.ly - 6, 'p = 0.4', 'ts', 'middle') + dn.o + text(dn.lx, dn.ly + 15, 'q = 0.6', 'ts', 'middle');
  }
  for (const i of [0, 4]) { const l = loop(X(i), Y, r, 'up', 'ink'); o += l.o + text(l.lx, l.ly - 9, '1', 'ts', 'middle'); }
  const fmt = (v) => (Math.abs(v) < 1e-12 ? '0' : Math.abs(v - 1) < 1e-12 ? '1' : v.toFixed(3));
  o += text(18, 172, 'h(x)', 'tl') + text(18, 198, 'g(x)', 'tb');
  for (let i = 0; i <= 4; i++) o += text(X(i), 172, fmt(h(i)), 'tl', 'middle') + text(X(i), 198, i === 0 || i === 4 ? '0' : g(i).toFixed(2), 't', 'middle');
  o += text(280, 228, 'h(x)：先到 4 再到 0 的 probability；g(x)：被 absorb 之前的 expected 步数', 'ts', 'middle');
  return svg(560, 240, o, 'Gambler’s ruin 的 transition graph，state 0 到 4，0 和 4 是 absorbing state；每个 state 下方标出到达 4 的 probability 和 expected 步数');
}

// 3. N = 100 时先到 100 的 probability
function ruincurve() {
  const N = 100;
  const h = (p) => (x) => { if (p === 0.5) return x / N; const th = (1 - p) / p; return (th ** x - 1) / (th ** N - 1); };
  const sx = lin(0, 100, 60, 520), sy = lin(0, 1, 225, 30);
  let o = axes({ sx, sy, x0: 0, x1: 100, y0: 0, y1: 1, xt: [0, 25, 50, 75, 100], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: '起点 x', grid: true });
  o += path(curve(h(0.5), 0, 100, sx, sy), 'ink') + path(curve(h(0.49), 0, 100, sx, sy), 'ln') + path(curve(h(18 / 38), 0, 100, sx, sy), 'ln-dash');
  o += text(sx(30), sy(0.4), 'p = 0.5', 't', 'end');
  o += text(sx(62), sy(0.3), 'p = 0.49', 'tl', 'end');
  o += text(sx(93), sy(0.1), 'p = 18/38', 'ts');
  o += line(sx(50), sy(0), sx(50), sy(0.5), 'grid');
  o += text(sx(50) + 6, 52, 'x = 50：0.5、0.119、0.005', 'ts');
  return svg(560, 262, o, 'N 等于 100 时从 x 出发先到 100 的 probability：p 等于二分之一时是直线，p 等于 0.49 和 18/38 时曲线压在底部');
}

// 4. 6 个 state 的分类
function classes() {
  const r = 19;
  const pos = { 1: [80, 95], 2: [80, 200], 3: [280, 95], 4: [280, 200], 5: [470, 95], 6: [470, 200] };
  let o = rect(30, 40, 100, 232, 'wash', 8) + rect(230, 40, 100, 232, 'wash2', 8) + rect(420, 40, 100, 232, 'wash', 8);
  const E = (a, b, bend, lab, dx = 0, dy = 0, cls = 'ink') => {
    const e = bent(pos[a][0], pos[a][1], pos[b][0], pos[b][1], r, bend, cls);
    o += e.o + text(e.lx + dx, e.ly + dy, lab, 'ts', 'middle');
  };
  E(1, 2, 26, '1', -14, 4); E(2, 1, 26, '1', 14, 4);
  E(3, 4, 26, '0.5', -18, 4); E(4, 3, 26, '0.4', 18, 4);
  E(5, 6, 26, '0.5', -18, 4); E(6, 5, 26, '0.2', 18, 4);
  E(3, 1, 0, '0.3', 0, -7, 'mute'); E(4, 5, 0, '0.6', 0, 16, 'mute');
  const L = (k, side, lab) => { const l = loop(pos[k][0], pos[k][1], r, side, 'ink'); o += l.o + text(l.lx, l.ly + (side === 'up' ? -8 : 16), lab, 'ts', 'middle'); };
  L(3, 'up', '0.2'); L(5, 'up', '0.5'); L(6, 'down', '0.8');
  for (const k of [1, 2, 3, 4, 5, 6]) o += node(pos[k][0], pos[k][1], r, String(k));
  o += text(80, 292, 'closed，period 2', 'tb', 'middle') + text(280, 292, 'transient', 'tb', 'middle') + text(470, 292, 'closed，aperiodic', 'tb', 'middle');
  o += text(280, 314, '灰线是离开 {3, 4} 的 arrow：从 3 或 4 出发，迟早永远离开', 'ts', 'middle');
  return svg(560, 324, o, '6 个 state 的 chain 分成三个 communicating class：1 和 2 是 period 2 的 closed class，3 和 4 是 transient class，5 和 6 是 aperiodic 的 closed class');
}

// 5. Z^d 上 simple random walk 的 P^{2n}_{00}（log-log）
function rw() {
  const NM = 1000;
  const lf = [0];
  for (let k = 1; k <= 2 * NM + 2; k++) lf.push(lf[k - 1] + Math.log(k));
  const c1 = (n) => Math.exp(lf[2 * n] - 2 * lf[n] - 2 * n * Math.log(2));
  const p3 = (n) => {
    let s = 0;
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n - i; j++) {
      const k = n - i - j;
      s += Math.exp(2 * (lf[n] - lf[i] - lf[j] - lf[k] - n * Math.log(3)));
    }
    return c1(n) * s;
  };
  const ns = [];
  for (let e = 0; e <= 3.0001; e += 0.1) { const n = Math.round(10 ** e); if (!ns.includes(n)) ns.push(n); }
  const sx = logx(1, 1000, 70, 520), sy = (v) => lin(-5, 0, 230, 30)(Math.log10(v));
  let o = '';
  for (const k of [1, 10, 100, 1000]) o += line(sx(k), sy(1e-5), sx(k), sy(1), 'grid') + text(sx(k), 248, String(k), 'ts', 'middle');
  const sup = ['⁰', '¹', '²', '³', '⁴', '⁵'];
  for (let k = -5; k <= 0; k++) o += line(sx(1), sy(10 ** k), sx(1000), sy(10 ** k), 'grid') + text(64, sy(10 ** k) + 4, k === 0 ? '1' : '10⁻' + sup[-k], 'ts', 'end');
  const series = (fn, cls) => path(d(ns.map((n) => [sx(n), sy(fn(n))])), cls);
  o += series(c1, 'ink') + series((n) => c1(n) ** 2, 'ln') + series(p3, 'ln-dash');
  o += text(sx(30), sy(c1(30)) - 10, 'd = 1：slope −½，recurrent', 't');
  o += text(sx(60), sy(c1(60) ** 2) - 10, 'd = 2：slope −1，recurrent', 'tl');
  o += text(sx(1.1), sy(10 ** -3.4), 'd = 3：slope −3/2，transient', 't');
  o += text(520, 264, 'n（log scale）', 'ts', 'end') + text(70, 18, '2n 步后回到原点的 probability（log scale）', 'tb');
  return svg(560, 272, o, '一维、二维、三维 simple random walk 在 2n 步后回到原点的 probability 的 log-log 图，slope 分别是负二分之一、负一、负二分之三');
}

// 6. social mobility 的 simulation：到第 t 步为止各 state 的比例
// 数据来自 python3 -I，random.seed(2026)，从 state 1 出发跑 10^6 步，在 10^(k/4) 处记录
function sim() {
  const rec = [[1, [1, 0, 0]], [2, [1, 0, 0]], [3, [1, 0, 0]], [6, [0.8333, 0.1667, 0]], [10, [0.7, 0.3, 0]], [18, [0.5556, 0.4444, 0]], [32, [0.4375, 0.3438, 0.2188]], [56, [0.3571, 0.4821, 0.1607]], [100, [0.36, 0.45, 0.19]], [178, [0.4382, 0.3596, 0.2022]], [316, [0.4557, 0.3513, 0.193]], [562, [0.4698, 0.3327, 0.1975]], [1000, [0.487, 0.314, 0.199]], [1778, [0.4826, 0.3228, 0.1946]], [3162, [0.4899, 0.3204, 0.1898]], [5623, [0.4798, 0.3306, 0.1896]], [10000, [0.4797, 0.3354, 0.1849]], [17783, [0.4774, 0.3363, 0.1862]], [31623, [0.4762, 0.3354, 0.1885]], [56234, [0.4694, 0.3416, 0.189]], [100000, [0.4678, 0.3413, 0.1909]], [177828, [0.4705, 0.3388, 0.1907]], [316228, [0.4692, 0.3403, 0.1905]], [562341, [0.4697, 0.3404, 0.1899]], [1000000, [0.4684, 0.3405, 0.1911]]];
  const pi = [22 / 47, 16 / 47, 9 / 47];
  const sx = logx(1, 1e6, 70, 470), sy = lin(0, 1, 225, 30);
  let o = '';
  for (let k = 0; k <= 6; k++) o += line(sx(10 ** k), sy(0), sx(10 ** k), sy(1), 'grid') + text(sx(10 ** k), 243, k === 0 ? '1' : '10' + ['', '', '²', '³', '⁴', '⁵', '⁶'][k], 'ts', 'middle');
  o += axes({ sx, sy, x0: 1, x1: 1e6, y0: 0, y1: 1, yt: [[0, '0'], [0.5, '0.5'], [1, '1']] });
  const cls = ['ln', 'ink', 'mute'], name = ['lower 22/47', 'middle 16/47', 'upper 9/47'];
  for (let s = 0; s < 3; s++) {
    o += line(sx(1), sy(pi[s]), sx(1e6), sy(pi[s]), 'dash');
    o += path(d(rec.map(([t, f]) => [sx(t), sy(f[s])])), cls[s]);
    o += text(478, sy(pi[s]) + 4 + (s === 0 ? -4 : s === 1 ? 4 : 0), name[s], s === 0 ? 'tl' : s === 1 ? 'tb' : 't');
  }
  o += text(470, 262, 'step t（log scale）', 'ts', 'end');
  return svg(560, 272, o, 'Social mobility chain 的一次 simulation：三个 state 出现的比例随步数变化，一万步以后贴近 stationary distribution');
}

// 7. Ehrenfest 的 cut
function cut() {
  const X = (i) => 80 + i * 133, Y = 80, r = 21;
  const up = ['1', '2/3', '1/3'], dn = ['1/3', '2/3', '1'];
  const piS = ['1/8', '3/8', '3/8', '1/8'];
  const flow = ['1/8', '1/4', '1/8'];
  let o = '';
  for (let i = 0; i < 3; i++) {
    const a = bent(X(i), Y, X(i + 1), Y, r, -28, 'ln'), b = bent(X(i + 1), Y, X(i), Y, r, -28, 'ink');
    o += a.o + text(a.lx - 8, a.ly - 7, up[i], 'ts', 'end') + b.o + text(b.lx + 8, b.ly + 16, dn[i], 'ts', 'start');
    const cx = (X(i) + X(i + 1)) / 2;
    o += line(cx, 30, cx, 140, 'ln-dash');
    o += text(cx, 165, `${piS[i]} × ${up[i]} = ${flow[i]}`, 'tl', 'middle') + text(cx, 185, `${piS[i + 1]} × ${dn[i]} = ${flow[i]}`, 't', 'middle');
  }
  for (let i = 0; i <= 3; i++) o += node(X(i), Y, r, String(i)) + text(X(i), Y - 32, 'π = ' + piS[i], 'ts', 'middle');
  o += text(280, 215, '每一刀：上一行是向右跨的 flow，下一行是向左跨的 flow', 'ts', 'middle');
  return svg(560, 226, o, 'Ehrenfest chain 的四个 state 之间切三刀，每一刀两侧向右和向左的 flow 相等');
}

// 8. P^n 第 1 个 column 的 max 与 min
function spread() {
  const sx = lin(0, 10, 70, 520), sy = lin(0, 1, 225, 30), pi = 22 / 47;
  let o = '';
  const band = [];
  for (let n = 0; n <= 10; n += 0.1) band.push([sx(n), sy(Math.min(1, pi + 0.8 ** n))]);
  for (let n = 10; n >= 0; n -= 0.1) band.push([sx(n), sy(Math.max(0, pi - 0.8 ** n))]);
  o += path(d(band) + 'Z', 'wash');
  o += axes({ sx, sy, x0: 0, x1: 10, y0: 0, y1: 1, xt: [0, 2, 4, 6, 8, 10], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'n' });
  o += line(sx(0), sy(pi), sx(10), sy(pi), 'dash') + text(sx(10) + 4, sy(pi) + 4, '22/47', 'ts');
  const M = [], m = [];
  for (let n = 0; n <= 10; n++) { const col = matpow(SOC, n).map((r) => r[0]); M.push([sx(n), sy(Math.max(...col))]); m.push([sx(n), sy(Math.min(...col))]); }
  o += path(d(M), 'ln') + path(d(m), 'ink');
  for (const p of M) o += circle(p[0], p[1], 3, 'ln-f');
  for (const p of m) o += circle(p[0], p[1], 3, 'ink-f');
  o += text(sx(1) + 10, sy(0.8), 'Mₙ：column 里最大的 entry', 'tl');
  o += text(sx(1) + 8, sy(0.2) + 16, 'mₙ：column 里最小的 entry', 't');
  o += text(sx(6.2), sy(0.86), '阴影：22/47 ± 0.8ⁿ', 'ts');
  return svg(560, 262, o, 'Social mobility chain 的 P 的 n 次方，第一个 column 的最大 entry 和最小 entry 从两侧夹向二十二分之四十七');
}

// 9. Ehrenfest：P^n_00 来回跳；lazy chain 平稳收敛
function period() {
  const E = [[0, 1, 0, 0], [1 / 3, 0, 2 / 3, 0], [0, 2 / 3, 0, 1 / 3], [0, 0, 1, 0]];
  const L = E.map((r, i) => r.map((v, j) => 0.5 * v + (i === j ? 0.5 : 0)));
  const sx = lin(0, 20, 70, 500), sy = lin(0, 1, 225, 30);
  let o = axes({ sx, sy, x0: 0, x1: 20, y0: 0, y1: 1, xt: [0, 4, 8, 12, 16, 20], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'n' });
  o += line(sx(0), sy(0.25), sx(20), sy(0.25), 'grid') + line(sx(0), sy(0.125), sx(20), sy(0.125), 'grid');
  o += text(sx(20) + 4, sy(0.25) + 4, '1/4', 'ts') + text(sx(20) + 4, sy(0.125) + 4, '1/8', 'ts');
  const a = [], b = [];
  for (let n = 0; n <= 20; n++) { a.push([sx(n), sy(matpow(E, n)[0][0])]); b.push([sx(n), sy(matpow(L, n)[0][0])]); }
  o += path(d(a), 'ln') + path(d(b), 'dash');
  for (const p of a) o += circle(p[0], p[1], 3, 'ln-f');
  for (const p of b) o += circle(p[0], p[1], 2.5, 'ink-f');
  o += text(sx(4.6), sy(0.62), 'Ehrenfest：奇数步是 0，偶数步趋向 1/4', 'tl');
  o += text(sx(9.4), sy(0.42), 'lazy chain ½(I + P)：趋向 π₀ = 1/8', 't');
  return svg(560, 262, o, 'Ehrenfest chain 从 0 出发回到 0 的 probability 在 0 和四分之一附近来回跳；lazy 版本平稳地趋向八分之一');
}

// 10. coupling：两条 social mobility chain 相遇
function coupling() {
  const rnd = mulberry32(3);
  const step = (x, u) => (u < SOC[x][0] ? 0 : u < SOC[x][0] + SOC[x][1] ? 1 : 2);
  let x = 0, y = 2, T = null;
  const X = [x], Y = [y];
  for (let n = 1; n <= 14; n++) {
    if (T === null) { x = step(x, rnd()); y = step(y, rnd()); if (x === y) T = n; } else { x = step(x, rnd()); y = x; }
    X.push(x); Y.push(y);
  }
  const sx = lin(0, 14, 110, 520), lv = (s) => 190 - s * 70;
  let o = '';
  const names = ['lower', 'middle', 'upper'];
  for (let s = 0; s < 3; s++) o += line(sx(0), lv(s), sx(14), lv(s), 'grid') + text(100, lv(s) + 4, names[s], 'ts', 'end');
  for (let n = 0; n <= 14; n += 2) o += text(sx(n), 236, String(n), 'ts', 'middle');
  const off = (n, k) => (n < T ? k : 0);
  o += path(d(X.map((s, n) => [sx(n), lv(s) + off(n, 5)]).slice(0, T + 1)), 'ln');
  o += path(d(Y.map((s, n) => [sx(n), lv(s) + off(n, -5)]).slice(0, T + 1)), 'ink');
  o += path(d(X.map((s, n) => [sx(n), lv(s)]).slice(T)), 'ink-b');
  for (let n = 0; n < T; n++) o += circle(sx(n), lv(X[n]) + 5, 3, 'ln-f') + circle(sx(n), lv(Y[n]) - 5, 3, 'ink-f');
  for (let n = T; n <= 14; n++) o += circle(sx(n), lv(X[n]), 3.5, 'ink-f');
  o += line(sx(T), 30, sx(T), 200, 'dash') + text(sx(T) + 6, 40, `T = ${T}：第一次在同一个 state`, 'tb');
  o += text(sx(0.2), lv(0) + 22, 'X 从 lower 出发', 'tl') + text(sx(0.2), lv(2) - 12, 'Y 从 upper 出发', 't');
  o += text(520, 254, 'step n', 'ts', 'end');
  return svg(560, 262, o, '两条 social mobility chain 分别从 lower 和 upper 出发独立地走，在第 T 步第一次落在同一个 state，此后一起走');
}

// 11. generating function 的 cobweb
function cobweb() {
  let o = '';
  const panel = (x0, phi, title, note) => {
    const sx = lin(0, 1, x0, x0 + 200), sy = lin(0, 1, 230, 30);
    o += rect(x0, 30, 200, 200, 'frame');
    o += line(sx(0), sy(0), sx(1), sy(1), 'mute') + path(curve(phi, 0, 1, sx, sy), 'ln');
    let s = 0;
    const pts = [[sx(0), sy(0)]];
    for (let k = 0; k < 40; k++) { const t = phi(s); pts.push([sx(s), sy(t)], [sx(t), sy(t)]); s = t; }
    o += path(d(pts), 'ink');
    o += text(x0 + 100, 20, title, 'tb', 'middle') + text(x0 + 100, 252, note, 'ts', 'middle');
    o += text(x0 - 5, sy(0) + 4, '0', 'ts', 'end') + text(x0 - 5, sy(1) + 4, '1', 'ts', 'end') + text(sx(1), 244, '1', 'ts', 'middle');
    return { sx, sy };
  };
  const a = panel(50, (s) => 0.25 + 0.25 * s + 0.5 * s * s, 'μ = 1.25', '停在最小的 root ρ = 1/2');
  o += circle(a.sx(0.5), a.sy(0.5), 4, 'ln-f') + text(a.sx(0.5) + 8, a.sy(0.5) + 16, '(½, ½)', 'ts');
  o += text(a.sx(0.08), a.sy(0.5), 'φ(s)', 'tl');
  const b = panel(320, (s) => 0.5 + 0.5 * s * s, 'μ = 1（p₀ = p₂ = ½）', '唯一的 root 是 1：必然灭绝');
  o += circle(b.sx(1), b.sy(1), 4, 'ln-f') + text(b.sx(0.08), b.sy(0.62), 'φ(s)', 'tl');
  o += text(280, 270, '折线从 0 出发：竖到 φ，横到 diagonal，依次是 q₁, q₂, q₃, …', 'ts', 'middle');
  return svg(560, 280, o, 'Generating function 的 cobweb 图：mu 大于 1 时迭代停在二分之一，mu 等于 1 时迭代一路爬向 1');
}

export default {
  'st3236-twostate': twostate,
  'st3236-ruin': ruin,
  'st3236-ruincurve': ruincurve,
  'st3236-classes': classes,
  'st3236-rw': rw,
  'st3236-sim': sim,
  'st3236-cut': cut,
  'st3236-spread': spread,
  'st3236-period': period,
  'st3236-coupling': coupling,
  'st3236-cobweb': cobweb,
};
