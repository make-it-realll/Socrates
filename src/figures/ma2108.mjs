import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, acircle, ashow } from '../lib/svg.mjs';

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

// 开头第三件事：同一批 term 换个次序，partial sum 走向另一个数
function rearr() {
  const N = 3000, s1 = [], s2 = [];
  let a = 0;
  for (let n = 1; n <= N; n++) { a += (n % 2 ? 1 : -1) / n; s1.push(a); }
  let b = 0, p = 1, q = 2;
  while (s2.length < N) { for (let k = 0; k < 2 && s2.length < N; k++) { b += 1 / p; p += 2; s2.push(b); } if (s2.length < N) { b -= 1 / q; q += 2; s2.push(b); } }
  const sx = logx(1, N, 60, 470), sy = lin(0.4, 1.45, 230, 30);
  let o = axes({ sx, sy, x0: 1, x1: N, y0: 0.4, y1: 1.45, xt: [1, 10, 100, 1000, [3000, '3000']], yt: [0.5, 1], xl: '加到第 n 个 term（log scale）' });
  const L1 = Math.log(2), L2 = 1.5 * Math.log(2);
  o += line(sx(1), sy(L1), sx(N), sy(L1), 'dash') + line(sx(1), sy(L2), sx(N), sy(L2), 'dash');
  const pl = (arr) => d(arr.map((v, i) => [sx(i + 1), sy(v)]));
  o += path(pl(s1), 'ink') + path(pl(s2), 'ln');
  o += circle(sx(1000), sy(s1[999]), 3.5, 'ink-f') + circle(sx(N), sy(s2[N - 1]), 3.5, 'ln-f');
  o += text(sx(1000), sy(s1[999]) + 20, '0.6926', 'tb', 'middle') + text(sx(N) - 4, sy(s2[N - 1]) - 12, '1.0395', 'tl', 'middle');
  o += text(sx(N) + 8, sy(L1) + 4, 'ln 2', 'ts') + text(sx(N) + 8, sy(L2) + 4, '1.5 ln 2', 'ts');
  o += text(sx(3), sy(1.36), '1 + ⅓ − ½ + ⅕ + ⅐ − ¼ + ⋯', 'tl');
  o += text(sx(3), sy(0.47), '1 − ½ + ⅓ − ¼ + ⋯', 'tb');
  return svg(560, 270, o, 'alternating harmonic series 的 partial sum 走向 ln 2，约 0.693；把同一批 term 改成两正一负的次序，partial sum 走向 1.5 ln 2，约 1.040');
}

// 第 2 站：两个失败的 definition
function tries() {
  let o = '';
  const panel = (x0, title, xs, c, note1, note2) => {
    const sx = lin(0.5, 12.5, x0, x0 + 220), sy = lin(-1.7, 1.2, 230, 50);
    o += text(x0 + 110, 22, title, 'tb', 'middle');
    o += rect(sx(0.5), sy(c + 0.5), 220, sy(c - 0.5) - sy(c + 0.5), 'wash');
    o += line(sx(0.5), sy(c), sx(12.5), sy(c), 'dash') + line(sx(0.5), sy(0), sx(12.5), sy(0), 'axis');
    o += text(x0 - 6, sy(c) + 4, String(c).replace('-', '−'), 'ts', 'end');
    if (c !== 0) o += text(x0 - 6, sy(0) + 4, '0', 'ts', 'end');
    o += text(x0 - 6, sy(1) + 4, '1', 'ts', 'end') + line(x0 - 3, sy(1), x0, sy(1), 'axis');
    xs.forEach((v, i) => { o += circle(sx(i + 1), sy(v), 3.5, 'ink-f'); });
    for (const n of [1, 6, 12]) o += text(sx(n), sy(-1.7) + 16, 'n=' + n, 'ts', 'middle');
    o += text(x0 + 110, 40, note1, 'ts', 'middle');
    o += text(sx(12.5), sy(c - 0.5) + 16, note2, 'ts', 'end');
  };
  panel(40, '1/n 与 −1', Array.from({ length: 12 }, (_, i) => 1 / (i + 1)), -1, 'distance 1 + 1/n 一直在变小', 'band：ε = ½，没有 term 进来');
  panel(320, '1, ½, 1, ⅓, 1, ¼, … 与 0', Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? 1 : 1 / (i / 2 + 1.5))), 0, 'odd-index term 一直停在 1', 'even-index term 任意接近 0');
  return svg(560, 260, o, '左：1/n 到 -1 的距离一直减小，但所有 term 都在 -1 周围宽 1/2 的 band 外；右：even-index 的 term 趋近 0，odd-index 的 term 永远是 1，不能留在 0 周围的 band 里');
}

// 第 1 站：density 的数值例子
function density() {
  const x = Math.SQRT2, y = 1.415, n = 1272;
  const sx = lin(1.4131, 1.4155, 30, 530), Y = 110;
  let o = rect(sx(x), Y - 16, sx(y) - sx(x), 32, 'wash');
  o += line(30, Y, 530, Y, 'axis');
  o += line(sx(x), Y - 22, sx(x), Y + 22, 'ink-b') + line(sx(y), Y - 22, sx(y), Y + 22, 'ink-b');
  o += text(sx(x), Y + 40, 'x = √2 = 1.414214', 'tb', 'middle') + text(sx(y) + 4, Y + 40, 'y = 1.415', 'tb', 'start');
  for (const m of [1798, 1799, 1800]) {
    const v = m / n, cls = m === 1799 ? 'ln-f' : 'ink-f';
    o += circle(sx(v), Y, 5, cls) + text(sx(v), Y - 30, m + '/1272', m === 1799 ? 'tl' : 'ts', 'middle');
  }
  o += text(sx(1799 / n), Y - 48, '= 1.414308', 'tl', 'middle');
  const yb = Y + 72;
  o += line(sx(1798 / n), yb, sx(1799 / n), yb, 'mute') + line(sx(1798 / n), yb - 5, sx(1798 / n), yb + 5, 'mute') + line(sx(1799 / n), yb - 5, sx(1799 / n), yb + 5, 'mute');
  o += text((sx(1798 / n) + sx(1799 / n)) / 2, yb + 18, '间隔 1/n = 0.000786', 'ts', 'middle');
  o += line(sx(x), yb, sx(y), yb, 'mute') + line(sx(y), yb - 5, sx(y), yb + 5, 'mute');
  o += text((sx(x) + sx(y)) / 2 + 30, yb + 18, 'y − x = 0.000786…', 'ts', 'middle');
  o += text(280, 26, 'denominator 为 1272 的 fraction 每隔 1/1272 一个；间隔比 y − x 小，', 'ts', 'middle');
  o += text(280, 44, '所以 x 右边的第一个（m = 1799）一定落在 (x, y) 里。', 'ts', 'middle');
  return svg(560, 210, o, 'number line 放大到 1.413 到 1.4155：x 等于根号 2，y 等于 1.415，相邻的 1798/1272、1799/1272、1800/1272 间隔 1/1272，1799/1272 落在 x 和 y 之间');
}

// 第 5 站：sin(1/x) 与 x sin(1/x)
function sinx() {
  let o = '';
  const panel = (x0, title, f, env) => {
    const sx = lin(0, 0.36, x0, x0 + 230), sy = lin(-1.15, 1.15, 220, 50);
    o += text(x0 + 115, 24, title, 'tb', 'middle');
    o += line(sx(0), sy(0), sx(0.36), sy(0), 'axis') + line(sx(0), sy(-1.15), sx(0), sy(1.15), 'axis');
    if (env) o += line(sx(0), sy(0), sx(0.36), sy(0.36), 'dash') + line(sx(0), sy(0), sx(0.36), sy(-0.36), 'dash');
    const pts = [];
    for (let i = 0; i <= 6000; i++) { const x = 0.002 + (0.358 * i) / 6000; pts.push([sx(x), sy(f(x))]); }
    o += path(d(pts), 'ln');
    o += text(sx(0.36), sy(0) + 16, '0.36', 'ts', 'middle') + text(sx(0) - 6, sy(1) + 4, '1', 'ts', 'end') + text(sx(0) - 6, sy(-1) + 4, '−1', 'ts', 'end');
    return sx;
  };
  const sx = panel(40, 'sin(1/x)', (x) => Math.sin(1 / x), false);
  const sy = lin(-1.15, 1.15, 220, 50);
  for (let n = 1; n <= 3; n++) { const v = 1 / (2 * n * Math.PI + Math.PI / 2); o += circle(sx(v), sy(1), 4, 'ink-f'); }
  for (let n = 1; n <= 4; n++) { const v = 1 / (n * Math.PI); o += circle(sx(v), sy(0), 4, 'paper'); }
  o += text(sx(1 / (2 * Math.PI + Math.PI / 2)) + 8, sy(1) - 8, 'xₙ：f = 1', 'tb');
  o += text(sx(0.305), sy(0) - 10, 'yₙ：f = 0', 'tb', 'end');
  panel(310, 'x sin(1/x)', (x) => x * Math.sin(1 / x), true);
  const sx2 = lin(0, 0.36, 310, 540);
  o += text(sx2(0.36) - 4, sy(0.36) - 8, 'y = x', 'ts', 'end') + text(sx2(0.36) - 4, sy(-0.36) + 16, 'y = −x', 'ts', 'end');
  o += text(280, 250, '左：xₙ = 1/(2nπ + π/2) 和 yₙ = 1/(nπ) 都 converge 到 0，f 的值却一个是 1、一个是 0。', 'ts', 'middle');
  o += text(280, 268, '右：乘上 x 之后，graph 被夹在 ±x 之间，在 0 处 continuous。', 'ts', 'middle');
  return svg(560, 278, o, '左边 sin(1/x) 在 0 附近无限振荡，取值为 1 的点和取值为 0 的点都向 0 聚集；右边 x sin(1/x) 被夹在 y=x 与 y=-x 之间');
}

// 第 6 站：intermediate value theorem 的三个 hypothesis，各去掉一个
function ivtfail() {
  let o = '';
  const W = 150, top = 52, bot = 200;
  const frame = (x0, title, sub) => text(x0 + W / 2, 20, title, 'tb', 'middle') + text(x0 + W / 2, 38, sub, 'ts', 'middle');
  {
    const x0 = 24, sx = lin(-1, 1, x0, x0 + W), sy = lin(-1.4, 1.4, bot, top);
    o += frame(x0, '去掉 continuity', '跳过了 0');
    o += line(x0, sy(0), x0 + W, sy(0), 'axis') + line(sx(0), bot, sx(0), top, 'grid');
    o += line(sx(-1), sy(-1), sx(0), sy(-1), 'ln') + line(sx(0), sy(1), sx(1), sy(1), 'ln');
    o += circle(sx(0), sy(-1), 4, 'paper') + circle(sx(0), sy(1), 4, 'ln-f');
    o += text(sx(-1), sy(0) + 16, '−1', 'ts', 'middle') + text(sx(1), sy(0) + 16, '1', 'ts', 'middle');
  }
  {
    const x0 = 204, sx = lin(-1, 1, x0, x0 + W), sy = lin(-6, 6, bot, top);
    o += frame(x0, '去掉 interval', 'domain 在 0 处断开');
    o += line(x0, sy(0), x0 + W, sy(0), 'axis') + line(sx(0), bot, sx(0), top, 'grid');
    o += path(curve((x) => 1 / x, -1, -1 / 6, sx, sy), 'ln') + path(curve((x) => 1 / x, 1 / 6, 1, sx, sy), 'ln');
    o += circle(sx(-1), sy(-1), 3.5, 'ln-f') + circle(sx(1), sy(1), 3.5, 'ln-f');
    o += text(sx(-1) + 4, sy(0) - 8, '−1', 'ts', 'middle') + text(sx(1) - 4, sy(0) + 16, '1', 'ts', 'middle');
    o += text(sx(0.45), sy(4.5), '1/x', 'tl');
  }
  {
    const x0 = 384, sx = lin(1, 2, x0, x0 + W), sy = lin(-1.4, 2.4, bot, top);
    o += frame(x0, '去掉 completeness', '只取 rational 的 x');
    o += line(x0, sy(0), x0 + W, sy(0), 'axis');
    o += path(curve((x) => x * x - 2, 1, 2, sx, sy), 'ln-dash');
    o += circle(sx(Math.SQRT2), sy(0), 4.5, 'paper');
    o += line(sx(Math.SQRT2), sy(0), sx(Math.SQRT2), sy(0) + 26, 'mute') + text(sx(Math.SQRT2), sy(0) + 40, '√2 ∉ ℚ', 'ts', 'middle');
    o += text(sx(1), sy(0) - 8, '1', 'ts', 'middle') + text(sx(2), sy(0) + 16, '2', 'ts', 'middle');
    o += text(sx(1.55), sy(1.8), 'x² − 2', 'tl', 'end');
  }
  o += text(280, 238, '三个都满足 f(左端) &lt; 0 &lt; f(右端)，都没有 zero：每一次是 proof 里不同的一步失效。', 'ts', 'middle');
  return svg(560, 248, o, 'intermediate value theorem 的三个 counterexample：jump 的 step function、domain 在 0 处断开的 1/x、只在有理数上取值的 x 平方减 2');
}

// 第 8 站：limit 是 continuous 的，convergence 却不 uniform
function bump() {
  const sx = lin(0, 1, 60, 500), sy = lin(0, 0.62, 220, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 0.62, xt: [0, 0.25, 0.5, 0.75, 1], yt: [[0.5, '½']], xl: 'x' });
  o += line(sx(0), sy(0.5), sx(1), sy(0.5), 'dash');
  const ns = [1, 2, 4, 8, 16, 32];
  ns.forEach((n, i) => {
    o += path(curve((x) => (n * x) / (1 + n * n * x * x), 0, 1, sx, sy, 600), i === ns.length - 1 ? 'ln' : 'ink');
    o += circle(sx(1 / n), sy(0.5), 3, 'ink-f');
    if (n <= 8) o += text(sx(1 / n), sy(0.5) - 10, 'n = ' + n, 'ts', 'middle');
  });
  o += text(sx(1 / 32) + 6, sy(0.5) - 24, 'n = 32', 'tl');
  return svg(560, 262, o, 'f_n(x) = nx/(1+n²x²) 在 n = 1, 2, 4, 8, 16, 32 时的 graph：每条在 x=1/n 处达到 1/2，峰的位置向 0 移动');
}


// 第 3 站：peak（x_k 不小于后面所有 term 的 index）
function peaks() {
  const M = 16, sx = lin(0.3, M + 0.7, 60, 530), sy = lin(-2.25, 1.75, 236, 40);
  const x = (n) => (-1) ** n * (1 + 1 / n);
  const isPeak = (k) => { for (let m = k; m < k + 2000; m++) if (x(m) > x(k)) return false; return true; };
  let o = axes({ sx, sy, x0: 0.3, x1: M + 0.7, y0: -2.25, y1: 1.85, xt: [1, 2, 4, 6, 8, 10, 12, 14, 16], yt: [[-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [1.5, '1.5']], xAt: -2.25, xl: 'n' });
  o += line(sx(0.3), sy(0), sx(M + 0.7), sy(0), 'mute');
  const pk = [];
  for (let k = 1; k <= M; k++) if (isPeak(k)) pk.push(k);
  for (const k of pk.slice(0, 2)) o += line(sx(k) + 5, sy(x(k)), sx(M + 0.7), sy(x(k)), 'ln-dash');
  o += path(d(pk.map((k) => [sx(k), sy(x(k))])), 'ln');
  for (let n = 1; n <= M; n++) o += circle(sx(n), sy(x(n)), 4, pk.includes(n) ? 'ln-f' : 'ink-f');
  o += text(sx(2) + 8, sy(x(2)) - 8, 'x₂ = 1.5', 'tl');
  o += text(sx(10), sy(1) + 18, 'x₂, x₄, x₆, … decreasing，趋向 1', 'ts', 'middle');
  o += text(sx(9), sy(-1.62), '黑点：odd index，negative，后面有更大的 term，不是 peak', 'ts', 'middle');
  o += text(530, 18, '彩点：peak（even index）；虚线右边没有比它高的 term', 'ts', 'end');
  return svg(560, 270, o, 'Sequence 负一的 n 次方乘一加 n 分之一的前 16 个 term：even index 的 term 都是 peak，从每个 peak 往右的虚线以上没有 term；把 peak 连起来是一条 decreasing 的折线，趋向 1');
}

// 第 3 站：contractive sequence y_n = (y_{n-1} + 2y_{n-2})/3
function contract() {
  const M = 14, ys = [0, 1];
  for (let n = 3; n <= M; n++) ys.push((ys[n - 2] + 2 * ys[n - 3]) / 3);
  const sx = lin(0.3, M + 0.7, 60, 470), sy = lin(-0.08, 1.1, 226, 34);
  let o = axes({ sx, sy, x0: 0.3, x1: M + 0.7, y0: -0.08, y1: 1.1, xt: [1, 2, 4, 6, 8, 10, 12, 14], yt: [[0, '0'], [0.6, '3/5'], [1, '1']], xAt: -0.08, xl: 'n' });
  o += line(sx(0.3), sy(0.6), sx(M + 0.7), sy(0.6), 'ln-dash');
  o += path(d(ys.map((v, i) => [sx(i + 1), sy(v)])), 'mute');
  ys.forEach((v, i) => { o += circle(sx(i + 1), sy(v), 3.8, 'ink-f'); });
  const lab = [[2, '1'], [3, '1/3'], [4, '7/9'], [5, '13/27']];
  for (const [n, t] of lab) { const v = ys[n - 1], up = v > 0.6; o += text(sx(n) + (n === 2 ? 8 : 0), sy(v) + (up ? -10 : 18), t, 'ts', n === 2 ? 'start' : 'middle'); }
  const X = 480;
  o += text(X, 70, '相邻两项的差', 'tb');
  for (let n = 2; n <= 6; n++) { const dd = ys[n] - ys[n - 1]; o += text(X, 70 + (n - 1) * 20, `y${sub(n + 1)} − y${sub(n)} = ${dd > 0 ? '' : '−'}${Math.abs(dd).toFixed(3)}`, 'ts'); }
  o += text(X, 190, '每次乘 −2/3', 'tl');
  o += text(60, 18, 'y₁ = 0，y₂ = 1，yₙ = (yₙ₋₁ + 2yₙ₋₂)/3', 'tb');
  return svg(560, 262, o, 'Contractive sequence 的前 14 个 term：在 3/5 上下来回跳，每一跳的长度是上一跳的三分之二，方向相反');
}

// 第 4 站：Riemann rearrangement，目标 L = 1.5
function riemann() {
  const L = 1.5, M = 200, ts = [], sg = [];
  let t = 0, p = 1, q = 2;
  while (ts.length < M) { if (t <= L) { t += 1 / p; p += 2; sg.push(1); } else { t -= 1 / q; q += 2; sg.push(-1); } ts.push(t); }
  const sx = lin(0, M + 2, 60, 520), sy = lin(0.9, 1.62, 228, 34);
  let o = axes({ sx, sy, x0: 0, x1: M + 2, y0: 0.9, y1: 1.62, xt: [1, 50, 100, 150, 200], yt: [[1, '1'], [1.2, '1.2'], [1.4, '1.4'], [1.5, '1.5']], xAt: 0.9, xl: '用到的 term 个数 m' });
  o += line(sx(0), sy(L), sx(M + 2), sy(L), 'ln-dash');
  o += path(d(ts.map((v, i) => [sx(i + 1), sy(v)])), 'ink');
  ts.forEach((v, i) => { if (sg[i] < 0) o += circle(sx(i + 1), sy(v), 3, 'paper'); });
  o += line(sx(4) + 4, sy(ts[3]) + 2, sx(14), sy(0.98), 'mute') + text(sx(14) + 4, sy(0.98) + 4, '减去 ½ 之后：1.0333', 'ts');
  o += text(sx(3) + 6, sy(ts[2]) - 4, '前三个 term：1.5333', 'ts');
  o += text(520, sy(L) - 8, 'L = 1.5', 'tl', 'end');
  o += text(520, sy(1.03), '空心点：刚减去一个 negative term', 'ts', 'end');
  o += text(60, 18, '≤ L 就加下一个 1/(2k − 1)，> L 就减下一个 1/(2k)', 'tb');
  return svg(560, 262, o, 'Alternating harmonic series 的 term 按“不超过 1.5 就加 positive term，超过就减 negative term”排列后的前 200 个 partial sum：在 1.5 上下来回，摆动越来越小');
}

// 第 5 站：Thomae function，在 irrational 点 continuous
function thomae() {
  const sx = lin(0, 1, 50, 530), sy = lin(0, 0.56, 222, 30), c = 1 / Math.SQRT2, eps = 0.3;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const delta = c - 2 / 3;
  let o = rect(sx(c - delta), sy(0.56), sx(c + delta) - sx(c - delta), sy(0) - sy(0.56), 'wash');
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 0.56, xt: [[0, '0'], [1 / 3, '1/3'], [0.5, '1/2'], [2 / 3, '2/3'], [1, '1']], yt: [[0.25, '¼'], [0.5, '½']] });
  o += line(sx(0), sy(eps), sx(1), sy(eps), 'dash') + text(sx(0.02), sy(eps) - 6, 'ε = 0.3', 'ts');
  for (let qq = 2; qq <= 24; qq++) for (let pp = 1; pp < qq; pp++) if (gcd(pp, qq) === 1) {
    const v = pp / qq, h = 1 / qq, inBand = Math.abs(v - c) < delta;
    o += circle(sx(v), sy(h), qq <= 6 ? 3.2 : 1.8, h > eps ? 'ink-f' : inBand ? 'ln-f' : 'mute-f');
  }
  o += line(sx(c), sy(0), sx(c), sy(0.56), 'ln-dash');
  o += text(sx(c) + 6, sy(0.5), 'c = 1/√2 = 0.7071', 'tl');
  o += text(sx(c) + 6, sy(0.45), 'δ = 0.0404', 'ts');
  o += text(sx(0.5), sy(0.5) - 8, 'f(1/2) = 1/2', 'ts', 'middle');
  o += text(sx(0.04), sy(0.47), '彩色 band 里的点都低于 ε', 'ts');
  return svg(560, 250, o, 'Thomae function 在 denominator 不超过 24 的 rational 点上的值，高度是 denominator 分之一；高于 0.3 的只有二分之一、三分之一、三分之二；c 等于根号 2 分之一两边宽 0.0404 的 band 里所有点都低于 0.3');
}

// 第 7 站：[0,1) → S¹ 是 continuous bijection，inverse 不 continuous
function circleMap() {
  const sx = lin(0, 1, 40, 240), Y = 132;
  const C = [410, 132], R = 92;
  const P = (t) => [C[0] + R * Math.cos(2 * Math.PI * t), C[1] - R * Math.sin(2 * Math.PI * t)];
  let o = line(sx(0), Y, sx(1), Y, 'ink-b') + circle(sx(0), Y, 4.5, 'ink-f') + circle(sx(1), Y, 4.5, 'paper');
  o += text(sx(0), Y + 22, '0', 'ts', 'middle') + text(sx(1), Y + 22, '1', 'ts', 'middle') + text(sx(0.5), Y + 22, '0.5', 'ts', 'middle');
  o += line(sx(0.5), Y - 4, sx(0.5), Y + 4, 'axis');
  const near1 = [0.9, 0.95, 0.98], near0 = [0.02, 0.05, 0.1];
  for (const t of near1) o += circle(sx(t), Y, 3.4, 'ln-f');
  for (const t of near0) o += circle(sx(t), Y, 3.4, 'ink-f');
  o += text(sx(0.94), Y - 14, 'tₙ → 1', 'tl', 'middle') + text(sx(0.06), Y - 14, '靠近 0', 'tb', 'middle');
  o += text(sx(0.5), 40, '[0, 1)', 'tb', 'middle');
  const pts = []; for (let i = 0; i <= 120; i++) pts.push(P(i / 120));
  o += path(d(pts) + 'Z', 'ink-b');
  for (const t of near1) { const [a, b] = P(t); o += circle(a, b, 3.4, 'ln-f'); }
  for (const t of near0) { const [a, b] = P(t); o += circle(a, b, 3.4, 'ink-f'); }
  const [ax, ay] = P(0); o += circle(ax, ay, 5, 'paper') + text(ax - 12, ay + 4, '(1, 0) = f(0)', 'tb', 'end');
  o += text(C[0], 26, 'S¹，f(t) = (cos 2πt, sin 2πt)', 'tb', 'middle');
  o += arrow(255, Y - 30, 300, Y - 30, 'mute') + text(277, Y - 38, 'f', 'tb', 'middle');
  o += text(280, 254, 'f(0.98) 和 f(0.02) 在 circle 上只差 0.25，在 [0, 1) 上 0.98 和 0.02 却差 0.96', 'ts', 'middle');
  return svg(560, 266, o, '左边是区间零到一（左闭右开），右边是单位圆；f 把 t 送到角度 2πt 处，t 接近 1 的点和接近 0 的点都被送到点 (1, 0) 附近，在圆上相邻');
}


// ---------- 动图 ----------
const grp = (first, on, kt, T, body) => `<g opacity="${first ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// 开头第四件：n 越来越大，xⁿ 的 graph 越来越贴着两条边，limit 却断开
function xnA() {
  const sx = lin(0, 1, 60, 400), sy = lin(0, 1.06, 222, 30);
  const ns = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25, 32, 40, 50, 64, 80, 100, 128];
  const st = 0.45, hold = 2.4, T = st * (ns.length - 1) + hold + 0.5;
  const kt = ns.map((_, i) => (st * i) / T);
  kt.push((st * (ns.length - 1) + hold) / T, 1);
  const seq = [...ns, ns[ns.length - 1], 1];
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.06, xt: [[0, '0'], [0.5, '0.5'], [0.9, '0.9'], [1, '1']], yt: [[0.5, '0.5'], [1, '1']], xl: 'x' });
  // limit function
  o += line(sx(0), sy(0), sx(1), sy(0), 'ln') + circle(sx(1), sy(0), 4, 'paper') + circle(sx(1), sy(1), 4.5, 'ln-f');
  o += text(sx(1) + 10, sy(1) + 4, 'f(1) = 1', 'tl') + text(sx(1) + 10, sy(0) + 4, '[0, 1) 上 f = 0', 'tl');
  // xⁿ：用同一组 x 采样，n 变化时形状线性插值
  const pts = []; for (let i = 0; i <= 300; i++) pts.push(i / 300);
  const shape = (n) => d(pts.map((x) => [sx(x), sy(x ** n)]));
  o += apath(seq.map(shape), kt, T, 'ink-b');
  for (const x0 of [0.5, 0.9]) o += line(sx(x0), sy(0), sx(x0), sy(1.06), 'grid');
  o += acircle(seq.map(() => sx(0.9)), seq.map((n) => sy(0.9 ** n)), kt, T, 4, 'ink-f');
  o += acircle(seq.map(() => sx(0.5)), seq.map((n) => sy(0.5 ** n)), kt, T, 4, 'ink-f');
  const X = 420;
  o += text(X, 100, '粗线：fₙ(x) = xⁿ', 'tb');
  ns.forEach((n, i) => {
    const on = seq.map((m, j) => m === n && j < seq.length - 1);
    o += grp(i === 0, on, kt, T, text(X, 126, `n = ${n}`, 'tl') + text(X, 148, `fₙ(0.5) = ${(0.5 ** n).toPrecision(2)}`, 't') + text(X, 168, `fₙ(0.9) = ${(0.9 ** n).toPrecision(2)}`, 't'));
  });
  o += text(X, 188, 'fₙ(1) = 1', 't');
  o += text(60, 18, '每个 fₙ 都 continuous；n → ∞ 时每个点上的值趋向彩色的 f', 'ts');
  return svgA(560, 256, o, '动图：x 的 n 次方在 0 到 1 上的 graph，n 从 1 增加到 128，curve 越来越贴着横轴再在 1 附近陡升；limit function 在 0 到 1 的左闭右开区间上是 0，在 1 处是 1，graph 断开');
}

// 第 2 站：ε 变小，N 跟着变大
function epsbandA() {
  const M = 60;
  const sx = lin(0, M + 1, 55, 530), sy = lin(-0.4, 1.65, 225, 22);
  const x = (n) => (2 + (-1) ** n) / n;
  const epss = [0.2, 0.15, 0.1, 0.5, 0.3, 0.2];
  const lastOut = (e) => { let k = 0; for (let n = 1; n <= 400; n++) if (Math.abs(x(n)) >= e) k = n; return k; };
  const hold = 2.2, T = hold * (epss.length - 1);
  const kt = epss.map((_, i) => (hold * i) / T);
  kt[kt.length - 1] = 1;
  let o = '';
  const uniq = [...new Set(epss)];
  uniq.forEach((e) => {
    const on = epss.map((v, i) => v === e && i < epss.length - 1);
    o += grp(e === epss[0], on, kt, T, rect(sx(0), sy(e), sx(M + 1) - sx(0), sy(-e) - sy(e), 'wash'));
  });
  o += axes({ sx, sy, x0: 0, x1: M + 1, y0: -0.4, y1: 1.65, xt: [1, 10, 20, 30, 40, 50, 60], yt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], xAt: -0.4, xl: 'n' });
  o += line(sx(0), sy(0), sx(M + 1), sy(0), 'mute');
  for (let n = 1; n <= M; n++) o += circle(sx(n), sy(x(n)), 2.8, 'ink-f');
  uniq.forEach((e) => {
    const on = epss.map((v, i) => v === e && i < epss.length - 1);
    const N = lastOut(e) + 1, Np = Math.floor(3 / e + 1e-9) + 1;
    let g = line(sx(0), sy(e), sx(M + 1), sy(e), 'ln-dash') + line(sx(0), sy(-e), sx(M + 1), sy(-e), 'ln-dash');
    for (let n = N; n <= M; n++) g += circle(sx(n), sy(x(n)), 2.8, 'ln-f');
    g += line(sx(N), sy(-0.4), sx(N), sy(0.62), 'dash');
    g += text(sx(N) + 6, sy(0.54), `N = ${N}`, 'tb');
    g += text(sx(N) + 6, sy(0.54) + 16, '从这里起全在 band 里', 'ts');
    g += text(530, 40, `ε = ${e}：最小能用的 N 是 ${N}`, 'tl', 'end');
    g += text(530, 58, `proof 里的 n > 3/ε 给出 N = ${Np}`, 'ts', 'end');
    if (e === 0.2) {
      g += text(sx(7), sy(-0.33), 'x₇ = 0.143', 'ts', 'middle') + line(sx(7), sy(x(7)) + 4, sx(7), sy(-0.25), 'mute');
      g += line(sx(8) + 3, sy(x(8)) - 4, sx(9.6), sy(0.72), 'mute') + text(sx(9.8), sy(0.74), 'x₈ = 0.375：进去过又出来', 'ts');
    }
    o += grp(e === epss[0], on, kt, T, g);
  });
  o += text(55, 18, 'xₙ = (2 + (−1)ⁿ) / n，limit 是 0；浅色是 (−ε, ε)', 'tb');
  return svgA(560, 262, o, '动图：sequence 二加负一的 n 次方再除以 n 的前 60 个 term，0 周围的 band 半径 epsilon 依次取 0.2、0.15、0.1、0.5、0.3；epsilon 越小，所有 term 都留在 band 里的起点 N 越大，分别是 15、21、31、7、11');
}

// 第 6 站：ε 变小，δ 跟着变小
function epsdeltaA() {
  const sx = lin(1.4, 2.6, 70, 380), sy = lin(1.8, 6.9, 232, 22);
  const f = (x) => x * x;
  const epss = [1, 0.6, 0.3, 1];
  const hold = 2.4, T = hold * (epss.length - 1);
  const kt = epss.map((_, i) => (hold * i) / T); kt[kt.length - 1] = 1;
  let o = '';
  const uniq = [1, 0.6, 0.3];
  const on = (e) => epss.map((v, i) => v === e && i < epss.length - 1);
  uniq.forEach((e) => {
    const dl = Math.min(1, e / 5);
    o += grp(e === 1, on(e), kt, T, rect(sx(1.4), sy(4 + e), sx(2.6) - sx(1.4), sy(4 - e) - sy(4 + e), 'wash2') + rect(sx(2 - dl), sy(6.9), 2 * (sx(2 + dl) - sx(2)), sy(1.8) - sy(6.9), 'wash'));
  });
  o += axes({ sx, sy, x0: 1.4, x1: 2.6, y0: 1.8, y1: 6.9, xt: [[1.6, '1.6'], [2, 'c = 2'], [2.4, '2.4']], yt: [[3, '3'], [4, 'f(c) = 4'], [5, '5'], [6, '6']] });
  o += path(curve(f, 1.4, 2.6, sx, sy), 'ink');
  uniq.forEach((e) => {
    const dl = Math.min(1, e / 5), dmax = Math.sqrt(4 + e) - 2;
    let g = line(sx(1.4), sy(4 - e), sx(2.6), sy(4 - e), 'dash') + line(sx(1.4), sy(4 + e), sx(2.6), sy(4 + e), 'dash');
    g += line(sx(2 - dl), sy(1.8), sx(2 - dl), sy(6.9), 'ln-dash') + line(sx(2 + dl), sy(1.8), sx(2 + dl), sy(6.9), 'ln-dash');
    g += path(curve(f, 2 - dl, 2 + dl, sx, sy), 'ln');
    for (const v of [Math.sqrt(4 - e), Math.sqrt(4 + e)]) g += circle(sx(v), sy(f(v)), 4, 'paper');
    const X = 396;
    g += text(X, 44, `ε = ${e}`, 'tl') + text(X, 64, `δ = min{1, ε/5} = ${dl.toFixed(2)}`, 'tb');
    g += text(X, 96, `x 在 (${(2 - dl).toFixed(2)}, ${(2 + dl).toFixed(2)}) 里时，`, 'ts') + text(X, 113, `x² 在 (${f(2 - dl).toFixed(2)}, ${f(2 + dl).toFixed(2)}) 里，`, 'ts') + text(X, 130, `没有离开 (${4 - e}, ${4 + e})。`, 'ts');
    g += text(X, 162, '空心点：curve 离开水平 band', 'ts') + text(X, 179, '的位置。能用的最大的 δ 是', 'ts') + text(X, 196, `√(4 + ε) − 2 = ${dmax.toFixed(3)}。`, 'ts');
    o += grp(e === 1, on(e), kt, T, g);
  });
  o += circle(sx(2), sy(4), 4, 'ink-f');
  o += text(sx(2.43), sy(6.35), 'y = x²', 't', 'end');
  o += text(396, 236, '灰色横 band：f(c) ± ε', 'ts') + text(396, 252, '彩色竖 band：c ± δ', 'ts');
  return svgA(560, 262, o, '动图：x 平方在 c 等于 2 附近的 graph；epsilon 依次取 1、0.6、0.3，水平 band 变窄，delta 等于 min(1, epsilon/5) 跟着变成 0.2、0.12、0.06，竖直 band 里的那段 curve 始终落在水平 band 里');
}

export default {
  'ma2108-xn0': xnA,
  'ma2108-rearr': rearr,
  'ma2108-tries': tries,
  'ma2108-density': density,
  'ma2108-sin': sinx,
  'ma2108-ivtfail': ivtfail,
  'ma2108-bump': bump,
  'ma2108-sqrt2': sqrt2,
  'ma2108-epsband': epsbandA,
  'ma2108-mct': mct,
  'ma2108-bisect': bisect,
  'ma2108-limsup': limsup,
  'ma2108-harmonic': harmonic,
  'ma2108-epsdelta': epsdeltaA,
  'ma2108-evt': evt,
  'ma2108-unif': unif,
  'ma2108-ball': ball,
  'ma2108-cover': cover,
  'ma2108-xn': xn,
  'ma2108-peaks': peaks,
  'ma2108-contract': contract,
  'ma2108-riemann': riemann,
  'ma2108-thomae': thomae,
  'ma2108-circle': circleMap,
};
