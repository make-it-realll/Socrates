import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n) => String(n).split('').map((c) => SUB[+c]).join('');

// Q 里的洞：A = {q ∈ Q : q > 0, q² < 2} 的元素从左边挤，有理上界从右边挤
function sqrt2() {
  const sx = lin(1.39, 1.51, 40, 520), Y = 112, R2 = Math.SQRT2;
  const below = [1.4];
  for (let i = 0; i < 3; i++) { const q = below[i]; below.push(q + Math.min(1, (2 - q * q) / (2 * (2 * q + 1)))); }
  const above = [1.5];
  for (let i = 0; i < 2; i++) { const u = above[i]; above.push(u - (u * u - 2) / (2 * u)); }
  let o = rect(40, Y - 9, sx(R2) - 40, 18, 'wash') + rect(sx(R2), Y - 9, 520 - sx(R2), 18, 'wash2');
  o += line(40, Y, 520, Y, 'axis');
  for (const t of [1.4, 1.42, 1.44, 1.46, 1.48, 1.5]) o += line(sx(t), Y + 9, sx(t), Y + 14, 'axis') + text(sx(t), Y + 28, t.toFixed(2), 'ts', 'middle');
  o += line(sx(R2), Y - 46, sx(R2), Y + 40, 'dash');
  for (const q of below) o += circle(sx(q), Y, 4, 'ln-f');
  for (const u of above) o += circle(sx(u), Y, 4, 'ink-f');
  // 左边三步
  o += text(40, 30, 'A 的 element：q² &lt; 2', 'tl');
  o += text(40, 50, below.map((q) => q.toFixed(5).replace(/0+$/, '')).join(' → ') + ' → ⋯', 'ts');
  o += arrow(sx(below[0]), Y - 18, sx(below[3]) - 1, Y - 18, 'ln');
  // 右边两步
  o += text(520, 30, 'A 的 rational upper bound：u² &gt; 2', 'tb', 'end');
  o += text(520, 50, '1.5 → ' + above[1].toFixed(5) + ' → ' + above[2].toFixed(6) + ' → ⋯', 'ts', 'end');
  o += arrow(sx(above[0]), Y - 18, sx(above[1]) + 6, Y - 18, 'ink');
  o += text(sx(R2), Y + 56, '√2：这个位置上没有 rational number', 't', 'middle');
  o += text(280, 188, `左边的点每一步加上 h = (2 − q²) / (2(2q + 1))，右边的点每一步减去 h = (u² − 2) / (2u)`, 'ts', 'middle');
  o += text(280, 205, `右边第三个点是 577/408，只比 √2 大 0.000002，画出来和虚线重合`, 'ts', 'middle');
  return svg(560, 215, o, 'Number line 上 A 的 element 从左边逼近根号 2，rational upper bound 从右边逼近根号 2，两边都没有最后一个，中间的位置上没有 rational number');
}

// ε band：x_n = (2 + (−1)^n)/n，ε = 0.2
function epsband() {
  const sx = lin(0, 31, 55, 530), sy = lin(-0.4, 1.65, 225, 22);
  const x = (n) => (2 + (-1) ** n) / n;
  const eps = 0.2, N = 15;
  let o = rect(sx(0), sy(eps), sx(31) - sx(0), sy(-eps) - sy(eps), 'wash');
  o += axes({ sx, sy, x0: 0, x1: 31, y0: -0.4, y1: 1.65, xt: [1, 5, 10, 15, 20, 25, 30], yt: [[-0.2, '−ε'], [0, '0'], [0.2, 'ε = 0.2'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], xAt: -0.4, xl: 'n' });
  o += line(sx(0), sy(0), sx(31), sy(0), 'mute');
  o += line(sx(0), sy(eps), sx(31), sy(eps), 'ln-dash') + line(sx(0), sy(-eps), sx(31), sy(-eps), 'ln-dash');
  o += line(sx(N), sy(-0.4), sx(N), sy(0.52), 'dash');
  for (let n = 1; n <= 30; n++) o += circle(sx(n), sy(x(n)), 3.6, Math.abs(x(n)) < eps ? 'ln-f' : 'ink-f');
  o += text(sx(N) + 7, sy(0.44), 'N = 15', 'tb');
  o += text(sx(N) + 7, sy(0.3), '从这里起所有的 term 都在 band 里', 'ts');
  o += line(sx(8) + 3, sy(x(8)) - 5, sx(8.9), sy(0.72), 'mute') + text(sx(9.1), sy(0.74), 'x₈ = 0.375：进去过又出来', 'ts');
  o += line(sx(14) - 2, sy(x(14)) - 5, sx(13.3), sy(0.5), 'mute') + text(sx(13.5), sy(0.55), 'x₁₄ = 0.214', 'ts', 'end');
  o += text(sx(7), sy(-0.33), 'x₇ = 0.143', 'ts', 'middle') + line(sx(7), sy(x(7)) + 5, sx(7), sy(-0.25), 'mute');
  o += text(530, 18, 'xₙ = (2 + (−1)ⁿ) / n，limit 是 0', 'tb', 'end');
  return svg(560, 262, o, 'Sequence 二加负一的 n 次方再除以 n 的前 30 个 term 和 0 周围半径 0.2 的 band：前面的 term 进出 band，从第 15 个 term 起全部留在 band 里');
}

// 单调有界：x_1 = 1，x_{n+1} = sqrt(2 + x_n) 被挤向 sup = 2
function mct() {
  const sx = lin(0.4, 8.6, 60, 420), sy = lin(0.85, 2.12, 215, 25);
  const xs = [1];
  for (let i = 1; i < 8; i++) xs.push(Math.sqrt(2 + xs[i - 1]));
  const eps = 0.15, N = xs.findIndex((v) => v > 2 - eps) + 1;
  let o = rect(sx(N), sy(2), sx(8.6) - sx(N), sy(2 - eps) - sy(2), 'wash');
  o += axes({ sx, sy, x0: 0.4, x1: 8.6, y0: 0.85, y1: 2.12, xt: [1, 2, 3, 4, 5, 6, 7, 8], yt: [[1, '1'], [1.5, '1.5']], xl: 'n' });
  o += line(sx(0.4), sy(2), sx(8.6), sy(2), 'ln') + line(sx(0.4), sy(2 - eps), sx(8.6), sy(2 - eps), 'dash');
  xs.forEach((v, i) => { o += circle(sx(i + 1), sy(v), 4, i + 1 >= N ? 'ln-f' : 'ink-f'); });
  o += text(430, sy(2) + 4, 's = sup{xₙ} = 2', 'tl') + text(430, sy(2 - eps) + 5, 's − ε = 1.85', 't');
  o += line(sx(N), sy(xs[N - 1]) + 6, sx(N) + 16, sy(1.62), 'mute');
  o += text(sx(N) + 20, sy(1.58), 'x' + sub(N) + ' = ' + xs[N - 1].toFixed(4) + '：第一个越过 s − ε 的 term', 'ts');
  o += text(sx(N) + 20, sy(1.46), '之后的 term 不会变小（increasing），', 'ts');
  o += text(sx(N) + 20, sy(1.36), '也不会超过 s（upper bound）', 'ts');
  o += text(60, 16, 'x₁ = 1，xₙ₊₁ = √(2 + xₙ)', 'tb');
  return svg(560, 250, o, 'Increasing 且 bounded above 的 sequence 的前 8 个 term：第 3 个 term 越过 supremum 减 epsilon 之后，后面的 term 全部夹在 supremum 减 epsilon 与 supremum 之间');
}

// Bolzano–Weierstrass 的二分：x_n = (−1)^n (1 + 1/n)
function bisect() {
  const sx = lin(-2.1, 2.1, 70, 530);
  const x = (n) => (-1) ** n * (1 + 1 / n);
  const rows = [[-2, 2, 1], [-2, 0, 3], [-2, -1, 5], [-1.5, -1, 7], [-1.25, -1, 9], [-1.125, -1, 11]];
  const fmt = (v) => String(v).replace('-', '−');
  let o = '';
  rows.forEach(([a, b, nk], i) => {
    const y = 40 + i * 36;
    o += line(sx(-2.1), y, sx(2.1), y, 'grid');
    o += rect(sx(a), y - 7, sx(b) - sx(a), 14, 'wash') + line(sx(a), y - 9, sx(a), y + 9, 'ln') + line(sx(b), y - 9, sx(b), y + 9, 'ln');
    for (let n = 1; n <= 60; n++) { const v = x(n); if (v >= a && v <= b) o += line(sx(v), y - 4, sx(v), y + 4, 'mute'); }
    o += circle(sx(x(nk)), y, 4, 'ink-f');
    o += text(60, y + 4, 'k = ' + (i + 1), 'ts', 'end');
    o += text(i === 0 ? sx(0) : sx(0) + 14, y - (i === 0 ? 13 : -4), `I${sub(i + 1)} = [${fmt(a)}, ${fmt(b)}]，选 x${sub(nk)} = ${fmt(x(nk).toFixed(3).replace(/\.?0+$/, ''))}`, 'ts', i === 0 ? 'middle' : 'start');
  });
  const Y = 40 + 6 * 36 - 8;
  o += line(sx(-2.1), Y, sx(2.1), Y, 'axis');
  for (const t of [-2, -1, 0, 1, 2]) o += line(sx(t), Y, sx(t), Y + 4, 'axis') + text(sx(t), Y + 18, fmt(t), 'ts', 'middle');
  o += line(sx(-1), 28, sx(-1), Y, 'ln-dash');
  o += text(280, Y + 40, '每一行只画出落在 Iₖ 里的 term。Interval 每次减半，选中的 term 被夹向 −1。', 'ts', 'middle');
  return svg(560, Y + 50, o, 'Bolzano–Weierstrass theorem 的 bisection：六行依次是减半的 interval，每行标出落在其中的 term 和选中的那个 term，interval 向负一收缩');
}

// limsup / liminf：尾部的 sup 和 inf
function limsup() {
  const sx = lin(0, 31, 55, 530), sy = lin(-2.3, 2.0, 232, 22);
  const x = (n) => (-1) ** n * (1 + 1 / n);
  const M = 4000;
  const a = (n) => { let m = -Infinity; for (let k = n; k < n + M; k++) m = Math.max(m, x(k)); return m; };
  const b = (n) => { let m = Infinity; for (let k = n; k < n + M; k++) m = Math.min(m, x(k)); return m; };
  let o = axes({ sx, sy, x0: 0, x1: 31, y0: -2.3, y1: 2.0, xt: [1, 5, 10, 15, 20, 25, 30], yt: [[-2, '−2'], [-1, '−1'], [0, '0'], [1, '1']], xAt: -2.3, xl: 'n' });
  o += line(sx(0), sy(1), sx(31), sy(1), 'dash') + line(sx(0), sy(-1), sx(31), sy(-1), 'dash');
  const pa = [], pb = [];
  for (let n = 1; n <= 30; n++) { pa.push([sx(n), sy(a(n))]); pb.push([sx(n), sy(b(n))]); }
  o += path(d(pa), 'ln') + path(d(pb), 'ln');
  for (let n = 1; n <= 30; n++) o += circle(sx(n), sy(x(n)), 3.2, 'ink-f');
  o += text(sx(7), sy(1.62), 'aₙ = sup{xₖ : k ≥ n}，decreasing', 'tl');
  o += text(sx(7), sy(-1.78), 'bₙ = inf{xₖ : k ≥ n}，increasing', 'tl');
  o += text(530, sy(1) + 16, 'limsup = 1', 't', 'end') + text(530, sy(-1) - 8, 'liminf = −1', 't', 'end');
  o += text(sx(15.5), sy(0) + 4, '圆点是 xₙ = (−1)ⁿ (1 + 1/n)', 'ts', 'middle');
  return svg(560, 268, o, 'Sequence 负一的 n 次方乘一加 n 分之一的 term，以及 tail 的 supremum 和 infimum 两条线：前者 decreasing 到 1，后者 increasing 到负 1');
}

// 调和级数与交错调和级数的部分和
function harmonic() {
  let o = '';
  // 左：harmonic
  {
    const sx = logx(1, 1024, 50, 255), sy = lin(0, 8.2, 215, 38);
    const pts = []; let s = 0; const at = {};
    for (let n = 1; n <= 1024; n++) { s += 1 / n; pts.push([sx(n), sy(s)]); if (Number.isInteger(Math.log2(n))) at[n] = s; }
    for (const t of [0, 2, 4, 6, 8]) o += line(50, sy(t), 255, sy(t), 'grid') + text(44, sy(t) + 4, String(t), 'ts', 'end');
    for (const k of [0, 2, 4, 6, 8, 10]) o += line(sx(2 ** k), sy(0), sx(2 ** k), sy(0) + 4, 'axis') + text(sx(2 ** k), sy(0) + 17, String(2 ** k), 'ts', 'middle');
    o += line(50, sy(0), 255, sy(0), 'axis') + line(50, sy(0), 50, sy(8.2), 'axis');
    o += line(sx(1), sy(1), sx(1024), sy(6), 'dash') + path(d(pts), 'ln');
    for (let k = 0; k <= 10; k++) o += circle(sx(2 ** k), sy(at[2 ** k]), 3, 'ink-f');
    o += text(152, 20, 'sₙ = 1 + 1/2 + ⋯ + 1/n', 'tb', 'middle');
    o += text(sx(40), sy(6.2), 'sₙ', 'tl', 'end') + text(sx(90), sy(2.6), '1 + k/2（n = 2ᵏ）', 'ts');
    o += text(255, sy(0) + 32, 'n（log scale）', 'ts', 'end');
  }
  // 右：alternating harmonic
  {
    const sx = lin(0, 31, 325, 530), sy = lin(0.42, 1.04, 215, 38), L = Math.log(2);
    const pts = []; let s = 0;
    for (let n = 1; n <= 30; n++) { s += (-1) ** (n + 1) / n; pts.push([sx(n), sy(s)]); }
    for (const t of [0.5, 0.75, 1]) o += line(325, sy(t), 530, sy(t), 'grid') + text(319, sy(t) + 4, String(t), 'ts', 'end');
    for (const t of [1, 10, 20, 30]) o += line(sx(t), sy(0.42), sx(t), sy(0.42) + 4, 'axis') + text(sx(t), sy(0.42) + 17, String(t), 'ts', 'middle');
    o += line(325, sy(0.42), 530, sy(0.42), 'axis') + line(325, sy(0.42), 325, sy(1.04), 'axis');
    o += line(325, sy(L), 530, sy(L), 'ln-dash') + path(d(pts), 'mute');
    for (const p of pts) o += circle(p[0], p[1], 2.8, 'ink-f');
    o += text(427, 20, 'sₙ = 1 − 1/2 + 1/3 − ⋯ ± 1/n', 'tb', 'middle');
    o += text(528, sy(0.9), 'ln 2 = 0.693（虚线）', 'tl', 'end');
    o += text(530, sy(0.42) + 32, 'n', 'ts', 'end');
  }
  return svg(560, 252, o, '左图是 harmonic series 的 partial sum，在 log scale 下沿直线一加二分之 k 之上无限增长；右图是 alternating harmonic series 的 partial sum，上下摆动并收拢到 ln 2');
}

// ε–δ：x² 在 c = 2，ε = 1，δ = 0.2
function epsdelta() {
  const sx = lin(1.4, 2.6, 70, 380), sy = lin(1.8, 6.9, 232, 22);
  const f = (x) => x * x;
  let o = rect(sx(1.4), sy(5), sx(2.6) - sx(1.4), sy(3) - sy(5), 'wash2');
  o += rect(sx(1.8), sy(6.9), sx(2.2) - sx(1.8), sy(1.8) - sy(6.9), 'wash');
  o += axes({ sx, sy, x0: 1.4, x1: 2.6, y0: 1.8, y1: 6.9, xt: [[1.8, 'c − δ'], [2, 'c = 2'], [2.2, 'c + δ']], yt: [[3, 'f(c) − ε = 3'], [4, 'f(c) = 4'], [5, 'f(c) + ε = 5']] });
  o += line(sx(1.4), sy(3), sx(2.6), sy(3), 'dash') + line(sx(1.4), sy(5), sx(2.6), sy(5), 'dash');
  o += line(sx(1.8), sy(1.8), sx(1.8), sy(6.9), 'ln-dash') + line(sx(2.2), sy(1.8), sx(2.2), sy(6.9), 'ln-dash');
  o += path(curve(f, 1.4, 2.6, sx, sy), 'ink') + path(curve(f, 1.8, 2.2, sx, sy), 'ln');
  o += circle(sx(2), sy(4), 4, 'ink-f');
  for (const v of [Math.sqrt(3), Math.sqrt(5)]) o += circle(sx(v), sy(f(v)), 4, 'paper');
  o += text(sx(2.43), sy(6.35), 'y = x²', 't', 'end');
  const X = 396;
  o += text(X, 44, 'ε = 1', 'tb') + text(X, 64, 'δ = min{1, ε/5} = 0.2', 'tb');
  o += text(X, 96, 'x 在 (1.8, 2.2) 里时，', 'ts') + text(X, 113, 'x² 在 (3.24, 4.84) 里，', 'ts') + text(X, 130, '没有离开水平的 band。', 'ts');
  o += text(X, 162, '空心点：curve 到 x = √3', 'ts') + text(X, 179, '和 x = √5 ≈ 2.236 才离开', 'ts') + text(X, 196, '水平的 band，所以能用的', 'ts') + text(X, 213, '最大的 δ 是 √5 − 2 ≈ 0.236。', 'ts');
  return svg(560, 262, o, 'x 平方在 c 等于 2 附近的 graph：水平的 band 是 f(c) 上下 epsilon，竖直的 band 是 c 左右 delta，竖直 band 里的那段 curve 完全落在水平 band 里');
}

// EVT 的三个反例
function evt() {
  let o = '';
  const W = 150, top = 46, bot = 196;
  // 1/x on (0,1]
  {
    const x0 = 34, sx = lin(0, 1, x0, x0 + W), sy = lin(0, 10, bot, top);
    o += line(x0, bot, x0 + W, bot, 'axis') + line(x0, bot, x0, top, 'axis');
    o += path(curve((x) => 1 / x, 0.1, 1, sx, sy), 'ln') + circle(sx(1), sy(1), 3.6, 'ink-f');
    o += arrow(sx(0.1), sy(10) + 2, sx(0.094), sy(10) - 12, 'ln');
    o += text(sx(0), bot + 16, '0', 'ts', 'middle') + text(sx(1), bot + 16, '1', 'ts', 'middle') + text(x0 - 6, sy(1) + 4, '1', 'ts', 'end');
    o += circle(sx(0), bot, 3.6, 'paper');
    o += text(x0 + W / 2, 20, '1/x 在 (0, 1] 上', 'tb', 'middle') + text(x0 + W / 2, 36, 'domain 不 closed', 'ts', 'middle');
    o += text(sx(0.3), sy(7), 'unbounded', 't');
  }
  // x/(1+x) on [0,∞)
  {
    const x0 = 214, sx = lin(0, 12, x0, x0 + W), sy = lin(0, 1.25, bot, top);
    o += line(x0, bot, x0 + W, bot, 'axis') + line(x0, bot, x0, top, 'axis');
    o += line(x0, sy(1), x0 + W, sy(1), 'dash') + path(curve((x) => x / (1 + x), 0, 12, sx, sy), 'ln') + circle(sx(0), sy(0), 3.6, 'ink-f');
    o += arrow(x0 + W - 12, bot, x0 + W + 4, bot, 'mute');
    o += text(sx(0), bot + 16, '0', 'ts', 'middle') + text(sx(10), bot + 16, '10', 'ts', 'middle') + text(x0 - 6, sy(1) + 4, '1', 'ts', 'end');
    o += text(x0 + W / 2, 20, 'x/(1 + x) 在 [0, ∞) 上', 'tb', 'middle') + text(x0 + W / 2, 36, 'domain 不 bounded', 'ts', 'middle');
    o += text(sx(6), sy(0.62), 'sup = 1，取不到', 't', 'middle');
  }
  // x for x<1, 0 at 1 on [0,1]
  {
    const x0 = 394, sx = lin(0, 1, x0, x0 + W - 20), sy = lin(0, 1.25, bot, top);
    o += line(x0, bot, x0 + W, bot, 'axis') + line(x0, bot, x0, top, 'axis');
    o += line(x0, sy(1), x0 + W, sy(1), 'dash') + line(sx(0), sy(0), sx(1), sy(1), 'ln');
    o += circle(sx(1), sy(1), 4, 'paper') + circle(sx(1), sy(0), 3.8, 'ink-f') + circle(sx(0), sy(0), 3.6, 'ink-f');
    o += text(sx(0), bot + 16, '0', 'ts', 'middle') + text(sx(1), bot + 16, '1', 'ts', 'middle') + text(x0 - 6, sy(1) + 4, '1', 'ts', 'end');
    o += text(x0 + W / 2, 20, 'f 在 [0, 1] 上', 'tb', 'middle') + text(x0 + W / 2, 36, '在 1 处不 continuous', 'ts', 'middle');
    o += text(sx(0.42), sy(1) - 8, 'sup = 1，取不到', 't', 'middle');
  }
  return svg(560, 222, o, '三个 counterexample：x 分之一在左开右闭的 interval 上 unbounded；x 除以一加 x 在零到正无穷上 supremum 是 1 但取不到；一个在 1 处不 continuous 的 function 在 closed interval 上取不到 supremum');
}

// 1/x：同一个 ε，δ 随 c → 0 缩小
function unif() {
  const sx = lin(0, 1.3, 60, 530), sy = lin(0, 7.4, 232, 22), eps = 1;
  const f = (x) => 1 / x, ds = (c) => (eps * c * c) / (1 + eps * c);
  let o = '';
  const cs = [0.8, 0.4, 0.2];
  for (const c of cs) {
    const dd = ds(c);
    o += rect(sx(c - dd), sy(f(c) + eps), sx(c + dd) - sx(c - dd), sy(f(c) - eps) - sy(f(c) + eps), 'wash');
  }
  o += axes({ sx, sy, x0: 0, x1: 1.3, y0: 0, y1: 7.4, xt: [[0.2, '0.2'], [0.4, '0.4'], [0.8, '0.8'], [1.2, '1.2']], yt: [1, 2, 3, 4, 5, 6, 7], xl: 'x' });
  o += path(curve(f, 1 / 7.4, 1.3, sx, sy, 400), 'ink');
  for (const c of cs) {
    const dd = ds(c);
    o += line(sx(c - dd), sy(0), sx(c - dd), sy(f(c) + eps), 'ln-dash') + line(sx(c + dd), sy(0), sx(c + dd), sy(f(c) + eps), 'ln-dash');
    o += line(sx(c - dd), sy(0), sx(c + dd), sy(0), 'ln') + circle(sx(c), sy(f(c)), 3.6, 'ink-f');
  }
  o += text(sx(0.2) + 26, sy(5.6), 'c = 0.2：δ = ' + ds(0.2).toFixed(3), 'tl');
  o += text(sx(0.4) + 50, sy(3.3), 'c = 0.4：δ = ' + ds(0.4).toFixed(3), 'tl');
  o += text(sx(0.8) + 8, sy(2.45), 'c = 0.8：δ = ' + ds(0.8).toFixed(3), 'tl');
  o += text(530, 30, 'y = 1/x，ε = 1', 'tb', 'end');
  o += text(530, 50, '每个方框高 2ε，宽 2δ，δ 取能用的最大值', 'ts', 'end');
  return svg(560, 266, o, 'x 分之一的 graph 和三个高度相同的方框：c 等于 0.8、0.4、0.2 处能用的最大 delta 依次是 0.356、0.114、0.033，越靠近 0 方框越窄');
}

// open ball 是 open set
function ball() {
  const X = [170, 135], r = 108, ang = (-28 * Math.PI) / 180, dxy = 58;
  const Yp = [X[0] + dxy * Math.cos(ang), X[1] + dxy * Math.sin(ang)], s = r - dxy;
  const a2 = (40 * Math.PI) / 180, Z = [Yp[0] + 28 * Math.cos(a2), Yp[1] + 28 * Math.sin(a2)];
  const circ = (c, R) => { const p = []; for (let i = 0; i <= 120; i++) { const t = (2 * Math.PI * i) / 120; p.push([c[0] + R * Math.cos(t), c[1] + R * Math.sin(t)]); } return d(p) + 'Z'; };
  let o = path(circ(X, r), 'wash') + path(circ(X, r), 'dash') + path(circ(Yp, s), 'wash') + path(circ(Yp, s), 'ln-dash');
  // 半径 r（向左下）
  const ra = (155 * Math.PI) / 180, Rp = [X[0] + r * Math.cos(ra), X[1] + r * Math.sin(ra)];
  o += line(X[0], X[1], Rp[0], Rp[1], 'mute') + text((X[0] + Rp[0]) / 2 - 2, (X[1] + Rp[1]) / 2 - 8, 'r', 't', 'middle');
  o += line(X[0], X[1], Yp[0], Yp[1], 'ink') + line(Yp[0], Yp[1], Z[0], Z[1], 'ln') + line(X[0], X[1], Z[0], Z[1], 'dash');
  o += circle(X[0], X[1], 3.6, 'ink-f') + circle(Yp[0], Yp[1], 3.6, 'ink-f') + circle(Z[0], Z[1], 3.6, 'ln-f');
  o += text(X[0] - 8, X[1] + 16, 'x', 'tb', 'end') + text(Yp[0] + 2, Yp[1] - 9, 'y', 'tb', 'middle') + text(Z[0] + 8, Z[1] + 5, 'z', 'tl');
  o += text(X[0] - 60, X[1] - r + 34, 'B(x, r)', 't') + text(Yp[0] - 4, Yp[1] - s + 16, 'B(y, s)', 'tl', 'middle');
  const T = 318;
  o += text(T, 70, 's = r − d(x, y) &gt; 0', 'tb');
  o += text(T, 100, '对 B(y, s) 里的任何 z：', 't');
  o += text(T, 124, 'd(x, z) ≤ d(x, y) + d(y, z)', 't');
  o += text(T + 46, 146, '&lt; d(x, y) + s = r', 't');
  o += text(T, 178, '所以 z 在 B(x, r) 里，', 't') + text(T, 198, '即 B(y, s) ⊆ B(x, r)。', 't');
  o += text(T, 228, '黑色实线是 d(x, y)，彩色线是 d(y, z)，', 'ts') + text(T, 245, '虚线是 d(x, z)。', 'ts');
  return svg(560, 262, o, '以 x 为 center、r 为 radius 的 open ball 里任取一点 y，以 y 为 center、r 减去 x 到 y 的 distance 为 radius 的小 ball 整个落在大 ball 里');
}

// (0,1) 的开覆盖 U_n = (1/n, 1) 没有有限子覆盖
function cover() {
  const sx = lin(0, 1, 70, 520);
  let o = '';
  const ns = [2, 3, 4, 5, 6, 7, 8];
  ns.forEach((n, i) => {
    const y = 34 + i * 22;
    o += line(sx(1 / n), y, sx(1), y, 'ln') + circle(sx(1 / n), y, 3.4, 'paper') + circle(sx(1), y, 3.4, 'paper');
    o += text(sx(1 / n) - 9, y + 4, 'U' + sub(n), 'ts', 'end');
  });
  const Y = 34 + ns.length * 22 + 10;
  o += rect(sx(0), Y - 8, sx(1 / 8) - sx(0), 16, 'wash2');
  o += line(sx(0), Y, sx(1), Y, 'axis');
  for (const [v, s] of [[0, '0'], [1 / 8, '1/8'], [1 / 4, '1/4'], [1 / 2, '1/2'], [1, '1']]) o += line(sx(v), Y - 4, sx(v), Y + 4, 'axis') + text(sx(v), Y + 19, s, 'ts', 'middle');
  o += line(sx(1 / 8), 34 + 6 * 22 + 5, sx(1 / 8), Y, 'dash');
  o += text(sx(0.5), 18, 'Uₙ = (1/n, 1)', 'tb', 'middle');
  o += text(280, Y + 42, '只取 U₂, …, U₈ 时，它们的 union 就是 U₈，灰色的 (0, 1/8] 没有被盖住。', 'ts', 'middle');
  o += text(280, Y + 59, '换成任何 finitely many 个 Uₙ 都一样，只是灰色的一段更短。', 'ts', 'middle');
  return svg(560, Y + 70, o, '区间 0 到 1 的 open cover：第 n 个 open set 是 n 分之一到 1。每个 set 向 0 多伸出一点，但 finitely many 个合起来总在 0 旁边留下一段盖不到');
}

// x^n 在 [0,1] 上：逐点收敛但不一致收敛
function xn() {
  const sx = lin(0, 1, 60, 470), sy = lin(0, 1.06, 222, 26);
  const ns = [1, 2, 4, 8, 16, 32];
  let o = rect(sx(0), sy(0.5), sx(1) - sx(0), sy(0) - sy(0.5), 'wash');
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.06, xt: [[0, '0'], [0.5, '0.5'], [0.8, '0.8'], [1, '1']], yt: [[0.5, 'ε = ½'], [1, '1']] });
  o += line(sx(0), sy(0.5), sx(1), sy(0.5), 'ln-dash') + line(sx(0.8), sy(0), sx(0.8), sy(1.06), 'dash');
  for (const n of ns) o += path(curve((x) => x ** n, 0, 1, sx, sy, 400), 'ink');
  for (const n of ns) o += circle(sx(2 ** (-1 / n)), sy(0.5), 3.4, 'paper');
  o += line(sx(0), sy(0), sx(1), sy(0), 'ln') + circle(sx(1), sy(0), 4, 'paper') + circle(sx(1), sy(1), 4, 'ln-f');
  o += text(sx(0.04), sy(0.9), '从左到右：n = 1, 2, 4, 8, 16, 32', 't');
  o += text(sx(0.04), sy(0.77), '空心点：xⁿ = ½ 的位置', 'ts');
  o += text(480, sy(1) + 4, 'f(1) = 1', 'tl') + text(480, sy(0) - 7, 'f = 0', 'tl');
  o += text(sx(0.04), sy(0.66), '竖直的虚线左边是 [0, 0.8]', 'ts');
  return svg(560, 250, o, 'x 的 n 次方在 0 到 1 上的 graph，n 取 1、2、4、8、16、32，以及 limit function 周围二分之一的 band：每条 curve 都在靠近 1 的地方穿出 band');
}

export default {
  'ma2108-sqrt2': sqrt2,
  'ma2108-epsband': epsband,
  'ma2108-mct': mct,
  'ma2108-bisect': bisect,
  'ma2108-limsup': limsup,
  'ma2108-harmonic': harmonic,
  'ma2108-epsdelta': epsdelta,
  'ma2108-evt': evt,
  'ma2108-unif': unif,
  'ma2108-ball': ball,
  'ma2108-cover': cover,
  'ma2108-xn': xn,
};
