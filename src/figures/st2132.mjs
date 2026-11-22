import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, ashow } from '../lib/svg.mjs';

// ---- 数值工具：图里的 curve 和点全部由这些 function 算出来 ----
const G7 = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
function lgamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = G7[0];
  for (let i = 1; i < 9; i++) x += G7[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
const chi2pdf = (x, k) => (x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lgamma(k / 2)));
const tpdf = (x, r) => Math.exp(lgamma((r + 1) / 2) - lgamma(r / 2) - 0.5 * Math.log(r * Math.PI) - ((r + 1) / 2) * Math.log(1 + (x * x) / r));
const npdf = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
const binom = (k, n, p) => Math.exp(lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
function erf(x) {
  const s = x < 0 ? -1 : 1, a = Math.abs(x), t = 1 / (1 + 0.3275911 * a);
  return s * (1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a));
}
// seed 固定的 pseudo-random number（mulberry32）和 Box–Muller
function rng(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  return { u, normal };
}

// χ² 的 density：k 个 N(0,1) 的 square 之和
function chi2() {
  const sx = lin(0, 16, 50, 530), sy = lin(0, 0.5, 220, 24);
  let o = axes({ sx, sy, x0: 0, x1: 16, y0: 0, y1: 0.5, xt: [0, 2, 4, 6, 8, 10, 12, 14, 16], yt: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4']] });
  const ks = [[1, 'mute'], [2, 'mute'], [3, 'ink'], [5, 'ink'], [9, 'ln']];
  for (const [k, cls] of ks) {
    const pts = [];
    for (let i = 1; i <= 640; i++) { const x = i / 40, y = chi2pdf(x, k); if (y <= 0.5) pts.push([sx(x), sy(y)]); }
    o += path(d(pts), cls);
  }
  o += text(sx(0.78), sy(0.455), it('k') + ' = 1', 'ts') + text(sx(1.0), sy(0.335), it('k') + ' = 2', 'ts');
  o += text(sx(1.9), sy(0.255), it('k') + ' = 3', 't') + text(sx(3.5), sy(0.166), it('k') + ' = 5', 't') + text(sx(7.6), sy(0.118), it('k') + ' = 9', 'tl');
  o += text(sx(9.6), sy(0.4), 'χ²' + ' with ' + it('k') + ' degrees of freedom：', 'tb') + text(sx(9.6), sy(0.355), 'mean = ' + it('k') + '，variance = 2' + it('k'), 't') + text(sx(9.6), sy(0.31), it('k') + ' 越大越靠右、越 symmetric', 'ts');
  return svg(560, 250, o, 'Chi-square distribution 在 degrees of freedom 等于 1、2、3、5、9 时的 density：degrees of freedom 越大，density 越靠右、越接近 symmetric');
}

// t 与 N(0,1)：tail 更厚
function tdist() {
  const sx = lin(-5, 5, 40, 530), sy = lin(0, 0.42, 215, 22);
  let o = '';
  o += path(area((x) => tpdf(x, 3), -5, -1.96, sx, sy), 'wash') + path(area((x) => tpdf(x, 3), 1.96, 5, sx, sy), 'wash');
  o += axes({ sx, sy, x0: -5, x1: 5, y0: 0, y1: 0.42, xt: [[-4, '−4'], [-1.96, '−1.96'], [0, '0'], [1.96, '1.96'], [4, '4']], yt: [] });
  o += line(sx(-1.96), sy(0), sx(-1.96), sy(0.2), 'dash') + line(sx(1.96), sy(0), sx(1.96), sy(0.2), 'dash');
  o += path(curve(npdf, -5, 5, sx, sy), 'ink') + path(curve((x) => tpdf(x, 9), -5, 5, sx, sy), 'mute') + path(curve((x) => tpdf(x, 3), -5, 5, sx, sy), 'ln');
  o += text(sx(0), sy(0.405), 'N(0, 1)', 't', 'middle');
  o += text(sx(-4.9), sy(0.4), 'P(|' + it('T') + '| &gt; 1.96)：', 'tb');
  o += text(sx(-4.9), sy(0.355), 'N(0, 1)：0.050', 't') + text(sx(-4.9), sy(0.31), it('t') + ' with 9 df：0.082', 't') + text(sx(-4.9), sy(0.265), it('t') + ' with 3 df：0.145', 'tl');
  o += text(sx(2.2), sy(0.355), '红线：' + it('t') + ' with 3 df', 'ts') + text(sx(2.2), sy(0.31), '涂色：它在 ±1.96 之外的 area', 'ts');
  o += text(sx(2.2), sy(0.265), '灰线：' + it('t') + ' with 9 df', 'ts');
  return svg(560, 245, o, 'Standard normal 与 degrees of freedom 为 3 和 9 的 t distribution 的 density：t 的 tail 更厚，正负 1.96 之外的 probability 分别是 0.145 和 0.082，而 normal 是 0.05');
}

// kiss data 的 likelihood：80 个 right，44 个 left
function lik() {
  const n = 124, x = 80, ph = x / n;
  const ll = (p) => x * Math.log(p) + (n - x) * Math.log(1 - p);
  const rel = (p) => Math.exp(ll(p) - ll(ph));
  const sx = lin(0.4, 0.9, 60, 530), sy = lin(0, 1.08, 225, 24);
  let o = axes({ sx, sy, x0: 0.4, x1: 0.9, y0: 0, y1: 1.08, xt: [[0.4, '0.4'], [0.5, '0.5'], [0.6, '0.6'], [0.7, '0.7'], [0.8, '0.8'], [0.9, '0.9']], yt: [[0.5, '0.5'], [1, '1']], xl: it('p'), grid: true });
  o += path(area(rel, 0.4, 0.9, sx, sy), 'wash') + path(curve(rel, 0.4, 0.9, sx, sy, 400), 'ln');
  o += line(sx(ph), sy(0), sx(ph), sy(1), 'dash') + circle(sx(ph), sy(1), 4, 'ln-f');
  o += text(sx(ph) + 10, sy(1) + 2, 'maximum：' + it('p̂') + ' = 80/124 ≈ 0.645', 'tl');
  o += circle(sx(0.5), sy(rel(0.5)), 4, 'ink-f') + line(sx(0.5), sy(rel(0.5)) - 6, sx(0.48), sy(0.3), 'mute');
  o += text(sx(0.41), sy(0.42), it('p') + ' = 0.5 时只有', 't') + text(sx(0.41), sy(0.34), 'maximum 的 0.5%', 't');
  o += text(sx(0.735), sy(0.62), it('L') + '(' + it('p') + ') = ' + it('p') + '⁸⁰ (1 − ' + it('p') + ')⁴⁴', 't') + text(sx(0.735), sy(0.54), '纵轴是 ' + it('L') + '(' + it('p') + ') / ' + it('L') + '(' + it('p̂') + ')', 'ts');
  return svg(560, 262, o, 'Kiss data 的 likelihood function：在 p 等于 0.645 处取到 maximum，p 等于 0.5 时只有 maximum 的千分之五');
}

// Uniform(0, θ) 的 likelihood：maximum 在 boundary 上，derivative 永远不为 0
function uniflik() {
  const data = [0.9, 1.4, 2.0, 3.1, 9.6], m = 9.6;
  const sx = lin(0, 20, 50, 530), sy = lin(0, 1.12, 205, 28);
  const L = (t) => (t >= m ? (m / t) ** 5 : 0);
  let o = axes({ sx, sy, x0: 0, x1: 20, y0: 0, y1: 1.12, xt: [0, 5, 10, 15, 20], yt: [[0.5, '0.5'], [1, '1']], xl: 'θ' });
  o += path(area(L, m, 20, sx, sy), 'wash') + line(sx(0), sy(0), sx(m), sy(0), 'ln') + line(sx(m), sy(0), sx(m), sy(1), 'ln-dash') + path(curve(L, m, 20, sx, sy), 'ln');
  o += circle(sx(m), sy(1), 4.5, 'ln-f');
  for (const x of data) o += circle(sx(x), sy(0), 4, 'ink-f');
  o += text(sx(m) + 10, sy(1) + 4, 'MLE：max ' + it('x') + ' = 9.6', 'tl');
  o += text(sx(14.2), sy(0.42), it('L') + '(θ) = θ⁻⁵，θ ≥ 9.6', 't');
  o += line(sx(6.8), sy(0), sx(6.8), sy(0.5), 'dash') + text(sx(6.8) - 8, sy(0.42), 'method of moments：', 't', 'end') + text(sx(6.8) - 8, sy(0.31), '2' + it('x̄') + ' = 6.8，这里 ' + it('L') + ' = 0', 't', 'end');
  o += text(sx(2.0), sy(0.14), '5 个 data point', 'ts', 'middle');
  o += text(sx(0.3), sy(0.86), 'θ &lt; 9.6：data 里的 9.6 不可能出现，', 'ts') + text(sx(0.3), sy(0.76), '所以 ' + it('L') + '(θ) = 0', 'ts');
  return svg(560, 242, o, 'Uniform 0 到 θ 的 likelihood：θ 小于最大的 data point 时为 0，在 θ 等于最大值处跳到 maximum，之后单调下降；method of moments 的 estimate 6.8 落在 likelihood 为 0 的区域');
}

// 两个 estimator 的 sampling distribution（n = 5，θ = 10），exact density
function twoest() {
  const n = 5, th = 10;
  const fmax = (y) => (y < 0 || y > th ? 0 : (n * y ** (n - 1)) / th ** n);
  const C = [1, 5, 10, 10, 5, 1];
  const fS = (s) => { if (s <= 0 || s >= 5) return 0; let v = 0; for (let k = 0; k <= Math.floor(s); k++) v += (k % 2 ? -1 : 1) * C[k] * (s - k) ** 4; return v / 24; };
  const f2x = (y) => fS(y / 4) / 4;
  const fadj = (y) => fmax(y / 1.2) / 1.2;
  const sx = lin(0, 20, 50, 530), sy = lin(0, 0.54, 232, 24);
  let o = axes({ sx, sy, x0: 0, x1: 20, y0: 0, y1: 0.54, xt: [0, 5, 10, 15, 20], yt: [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4'], [0.5, '0.5']] });
  o += line(sx(10), sy(0), sx(10), sy(0.54), 'grid') + text(sx(10), sy(0.54) - 6, 'true θ = 10', 'tb', 'middle');
  o += path(area(f2x, 0, 20, sx, sy), 'wash2') + path(curve(f2x, 0, 20, sx, sy, 400), 'ink');
  o += path(curve(fmax, 0, 10, sx, sy, 300), 'ln') + line(sx(10), sy(0.5), sx(10), sy(0), 'ln');
  o += path(curve(fadj, 0, 12, sx, sy, 300), 'ln-dash') + line(sx(12), sy(fadj(12)), sx(12), sy(0), 'ln-dash');
  o += text(sx(4.1), sy(0.33), 'max ' + it('X') + '：永远 ≤ θ', 'tl', 'middle') + text(sx(4.1), sy(0.285), 'bias −1.67，MSE 4.76', 'ts', 'middle');
  o += text(sx(12.5), sy(0.38), '(6/5) max ' + it('X') + '（虚线）', 'tl') + text(sx(12.5), sy(0.335), 'unbiased，MSE 2.86', 'ts');
  o += text(sx(14.6), sy(0.15), '2' + it('X̄') + '（灰底）', 'tb') + text(sx(14.6), sy(0.105), 'unbiased，MSE 6.67', 'ts');
  return svg(560, 262, o, 'Sample size 为 5、θ 等于 10 时三个 estimator 的 exact sampling density：两倍 sample mean 以 10 为中心但很分散，maximum 集中但整体偏在 10 的左边，乘上五分之六之后的 maximum 既 unbiased 又集中');
}

// log-likelihood 的 curvature：n 越大越尖
function curv() {
  const ph = 80 / 124;
  const rel = (n) => (p) => n * (ph * Math.log(p / ph) + (1 - ph) * Math.log((1 - p) / (1 - ph)));
  const sx = lin(0.4, 0.9, 60, 530), sy = lin(-6, 0.5, 225, 24);
  let o = axes({ sx, sy, x0: 0.4, x1: 0.9, y0: -6, y1: 0.5, xt: [[0.4, '0.4'], [0.5, '0.5'], [0.6, '0.6'], [0.7, '0.7'], [0.8, '0.8'], [0.9, '0.9']], yt: [[-6, '−6'], [-4, '−4'], [-2, '−2'], [0, '0']], xl: it('p'), grid: true });
  const clip = (f) => { const pts = []; for (let i = 0; i <= 500; i++) { const p = 0.4 + (0.5 * i) / 500, y = f(p); if (y >= -6) pts.push([sx(p), sy(y)]); } return d(pts); };
  o += path(clip(rel(31)), 'ink') + path(clip(rel(124)), 'ln');
  o += circle(sx(ph), sy(0), 4, 'ink-f') + text(sx(ph), sy(0) - 9, it('p̂') + ' = 0.645', 't', 'middle');
  o += text(sx(ph), sy(-3.3), '20 right / 31：−' + it('ℓ') + '″(' + it('p̂') + ') = 135', 'tb', 'middle') + text(sx(ph), sy(-4.1), '80 right / 124：−' + it('ℓ') + '″(' + it('p̂') + ') = 542', 'tl', 'middle');
  o += text(sx(0.408), sy(-4.9), it('n') + ' = 31', 'tb') + text(sx(0.795), sy(-5.3), it('n') + ' = 124', 'tl');
  o += text(62, 16, it('ℓ') + '(' + it('p') + ') − ' + it('ℓ') + '(' + it('p̂') + ')', 'ts');
  return svg(560, 262, o, '同一个 sample proportion 0.645、sample size 分别为 31 和 124 时的 log-likelihood：sample size 大四倍，curve 在 maximum 处的 curvature 也大四倍');
}

// 100 个 95% t interval（seed 固定），数一数有几个没盖住 μ
export function coverData() {
  const R = rng(2132), mu = 1.5, sigma = 1.2, n = 10, tc = 2.262157;
  const out = [];
  for (let r = 0; r < 100; r++) {
    const x = Array.from({ length: n }, () => mu + sigma * R.normal());
    const m = x.reduce((a, b) => a + b, 0) / n;
    const s = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
    const h = (tc * s) / Math.sqrt(n);
    out.push({ m, s, lo: m - h, hi: m + h, miss: mu < m - h || mu > m + h, missZ: Math.abs(m - mu) > (1.96 * s) / Math.sqrt(n) });
  }
  return out;
}
function cover() {
  const D = coverData(), mu = 1.5;
  const lo = Math.min(...D.map((v) => v.lo)), hi = Math.max(...D.map((v) => v.hi));
  const sx = lin(0, 101, 46, 540), sy = lin(Math.floor(lo * 2) / 2, Math.ceil(hi * 2) / 2, 232, 40);
  let o = '';
  for (let v = Math.ceil(lo); v <= Math.floor(hi); v++) o += line(sx(0), sy(v), sx(101), sy(v), 'grid') + text(40, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  o += line(sx(0), sy(mu), sx(101), sy(mu), 'ink');
  D.forEach((v, i) => {
    o += line(sx(i + 1), sy(v.lo), sx(i + 1), sy(v.hi), v.miss ? 'ln' : 'mute') + circle(sx(i + 1), sy(v.m), 1.6, v.miss ? 'ln-f' : 'mute-f');
  });
  const k = D.filter((v) => v.miss).length;
  o += text(46, 18, `100 次 experiment，每次 10 个 observation，各算一个 95% confidence interval`, 'tb');
  o += text(46, 254, `水平线是 true μ = 1.5。粗线是没有盖住 μ 的 interval，这 100 个里有 ${k} 个。`, 'ts');
  return svg(560, 264, o, `一百个 simulate 出来的 95% confidence interval 竖着排开，水平线是 true mean；其中 ${k} 个没有盖住 true mean`);
}

// 两种 error：H0 与 H1 下 X 的 pmf，cutoff 把它们分成 α 和 β
function errors() {
  const n = 124, c = 72;
  const sx = lin(44.5, 94.5, 40, 540), sy = lin(0, 0.085, 215, 40);
  const w = sx(1) - sx(0);
  let o = '';
  for (let k = 45; k <= 94; k++) {
    if (k < c) o += rect(sx(k - 0.5), sy(binom(k, n, 0.6)), w, sy(0) - sy(binom(k, n, 0.6)), 'wash');
    else o += rect(sx(k - 0.5), sy(binom(k, n, 0.5)), w, sy(0) - sy(binom(k, n, 0.5)), 'solid2');
  }
  const step = (p, cls) => { const pts = []; for (let k = 45; k <= 94; k++) { const y = sy(binom(k, n, p)); pts.push([sx(k - 0.5), y], [sx(k + 0.5), y]); } return path(d(pts), cls); };
  o += step(0.5, 'ink') + step(0.6, 'ln');
  o += line(sx(44.5), sy(0), sx(94.5), sy(0), 'axis');
  for (const k of [50, 62, 72, 80, 90]) o += line(sx(k), sy(0), sx(k), sy(0) + 4, 'axis') + text(sx(k), sy(0) + 17, String(k), 'ts', 'middle');
  o += line(sx(c - 0.5), sy(0), sx(c - 0.5), sy(0.085), 'dash');
  o += text(sx(c - 0.5) + 6, sy(0.085) + 10, 'reject H₀：' + it('X') + ' ≥ 72', 'tb') + text(sx(c - 0.5) - 6, sy(0.085) + 10, '不 reject', 't', 'end');
  o += text(sx(45), sy(0.06), 'H₀：' + it('p') + ' = 0.5', 'tb') + text(sx(94), sy(0.06), 'H₁：' + it('p') + ' = 0.6', 'tl', 'end');
  o += text(40, 16, it('X') + ' = 124 对 couple 里向右的对数；黑色阶梯是 H₀ 下的 pmf，红色是 H₁ 下的', 'ts');
  o += text(40, 254, '深色（type I error）：α = P(' + it('X') + ' ≥ 72 | H₀) = 0.044', 't') + text(40, 274, '浅色（type II error）：β = P(' + it('X') + ' ≤ 71 | H₁) = 0.296', 'tl');
  return svg(560, 284, o, 'Null hypothesis p 等于 0.5 与 alternative p 等于 0.6 下 X 的两个 binomial pmf；cutoff 72 右侧 null 下的 probability 是 type I error 0.044，左侧 alternative 下的 probability 是 type II error 0.296');
}

// power function：同样的 level，n 越大 curve 越陡
function power() {
  const sf = (c, n, p) => { let s = 0; for (let k = c; k <= n; k++) s += binom(k, n, p); return s; };
  const sx = lin(0.5, 0.8, 60, 530), sy = lin(0, 1.02, 225, 24);
  let o = axes({ sx, sy, x0: 0.5, x1: 0.8, y0: 0, y1: 1.02, xt: [[0.5, '0.5'], [0.55, '0.55'], [0.6, '0.6'], [0.65, '0.65'], [0.7, '0.7'], [0.75, '0.75'], [0.8, '0.8']], yt: [[0.05, '0.05'], [0.5, '0.5'], [1, '1']], xl: 'true ' + it('p'), grid: true });
  for (const [n, c, cls] of [[31, 21, 'mute'], [124, 72, 'ln'], [496, 267, 'ink']]) o += path(curve((p) => sf(c, n, p), 0.5, 0.8, sx, sy, 120), cls);
  o += circle(sx(0.6), sy(sf(72, 124, 0.6)), 4, 'ln-f') + text(sx(0.6) + 8, sy(sf(72, 124, 0.6)) + 12, '(0.6, 0.704)', 'tl');
  o += text(sx(0.555), sy(0.92), it('n') + ' = 496', 'tb', 'end') + text(sx(0.672), sy(0.84), it('n') + ' = 124', 'tl') + text(sx(0.705), sy(0.5), it('n') + ' = 31', 'ts');
  o += text(62, 16, 'power = P(reject H₀)，三个 test 的 level 都不超过 0.05', 'ts');
  return svg(560, 262, o, 'One-sided test 的 power function：sample size 为 31、124、496 时 power 随 true p 的变化，三条 curve 在 p 等于 0.5 处都不超过 0.05，sample size 越大上升越快');
}

// Wilks：−2 log Λ 的 exact CDF（Binomial(124, 0.5)）对比 χ²₁ 的 CDF
function wilks() {
  const n = 124;
  const G = (k) => 2 * ((k > 0 ? k * Math.log(k / 62) : 0) + (k < n ? (n - k) * Math.log((n - k) / 62) : 0));
  const pts = [];
  for (let k = 62; k <= n; k++) pts.push([G(k), k === 62 ? binom(62, n, 0.5) : 2 * binom(k, n, 0.5)]);
  const sx = lin(0, 8, 60, 530), sy = lin(0, 1.02, 225, 24);
  let o = axes({ sx, sy, x0: 0, x1: 8, y0: 0, y1: 1.02, xt: [0, 1, 2, 3, [3.84, '3.84'], 5, 6, 7, 8], yt: [[0.5, '0.5'], [0.95, '0.95'], [1, '']], grid: true });
  const st = [[sx(0), sy(0)]];
  let cum = 0;
  for (const [g, p] of pts) { if (g > 8) break; st.push([sx(g), sy(cum)]); cum += p; st.push([sx(g), sy(cum)]); }
  st.push([sx(8), sy(cum)]);
  o += path(d(st), 'ink') + path(curve((x) => erf(Math.sqrt(x / 2)), 0, 8, sx, sy, 400), 'ln');
  o += line(sx(3.84), sy(0), sx(3.84), sy(1.02), 'dash');
  o += text(sx(4.05), sy(0.42), 'x = 3.84 处：', 'tb') + text(sx(4.05), sy(0.34), 'χ² with 1 df 的 CDF = 0.950', 'tl') + text(sx(4.05), sy(0.26), 'exact CDF = 0.941', 't');
  o += text(sx(4.05), sy(0.14), '阶梯：' + it('X') + ' ~ Binomial(124, 0.5) 时', 'ts') + text(sx(4.05), sy(0.07), '−2 log Λ 的 exact CDF', 'ts');
  o += text(530, 258, '−2 log Λ', 'ts', 'end');
  return svg(560, 264, o, 'Null hypothesis 下负二倍 log likelihood ratio 的 exact CDF 是一条阶梯，贴着 degrees of freedom 为 1 的 chi-square 的 CDF；在 3.84 处两者分别是 0.941 和 0.950');
}

// Student 的 sleep data：同一个病人的两次测量连起来
function paired() {
  const g1 = [0.7, -1.6, -0.2, -1.2, -0.1, 3.4, 3.7, 0.8, 0.0, 2.0], g2 = [1.9, 0.8, 1.1, 0.1, -0.1, 4.4, 5.5, 1.6, 4.6, 3.4];
  const sy = lin(-2, 6, 232, 40);
  let o = '';
  for (const v of [-2, 0, 2, 4, 6]) o += line(60, sy(v), 300, sy(v), 'grid') + text(54, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  const xa = 110, xb = 250;
  g1.forEach((a, i) => { o += line(xa, sy(a), xb, sy(g2[i]), 'mute') + circle(xa, sy(a), 4, 'ink-f') + circle(xb, sy(g2[i]), 4, 'ln-f'); });
  const m1 = 0.75, m2 = 2.33;
  o += line(xa - 28, sy(m1), xa - 10, sy(m1), 'ink-b') + line(xb + 10, sy(m2), xb + 28, sy(m2), 'ln') + text(xa - 32, sy(m1) - 6, 'mean 0.75', 'ts', 'end') + text(xb + 8, sy(m2) - 8, 'mean 2.33', 'ts');
  o += text(xa, 252, 'drug 1', 'tb', 'middle') + text(xb, 252, 'drug 2', 'tl', 'middle');
  o += text(60, 18, 'extra sleep（hours），10 个病人', 'tb');
  // 右边：differences
  const d0 = g2.map((b, i) => b - g1[i]).sort((a, b) => a - b);
  for (const v of [-2, 0, 2, 4, 6]) o += line(360, sy(v), 530, sy(v), v === 0 ? 'axis' : 'grid');
  d0.forEach((v, i) => { o += circle(374 + i * 8, sy(v), 4, 'ink-f'); });
  o += line(466, sy(0.70), 466, sy(2.46), 'ln') + line(459, sy(0.70), 473, sy(0.70), 'ln') + line(459, sy(2.46), 473, sy(2.46), 'ln') + circle(466, sy(1.58), 4.5, 'ln-f');
  o += text(478, sy(1.58) + 4, 'mean 1.58', 'tl') + text(478, sy(2.46) + 2, '2.46', 'ts') + text(478, sy(0.70) + 8, '0.70', 'ts');
  o += text(360, 18, 'difference = drug 2 − drug 1', 'tb');
  o += text(445, 252, '95% confidence interval 不含 0', 'ts', 'middle');
  o += text(354, sy(0) + 4, '0', 'ts', 'end');
  return svg(560, 262, o, 'Sleep data：左边把每个病人在两种 drug 下的 extra sleep 连成线，十条线里九条向上、一条持平；右边是十个 difference 的点图，mean 是 1.58，95% confidence interval 从 0.70 到 2.46，不含 0');
}

// sufficiency：3 次 Bernoulli 的 8 个 outcome 按 T = sum 分成 4 格
function partition() {
  const cells = [['T = 0', ['000'], '(1 − p)³', '1'], ['T = 1', ['100', '010', '001'], 'p(1 − p)²', '1/3'], ['T = 2', ['110', '101', '011'], 'p²(1 − p)', '1/3'], ['T = 3', ['111'], 'p³', '1']];
  let o = '';
  cells.forEach(([t, outs, pr, cond], j) => {
    const x = 30 + j * 130;
    o += rect(x, 34, 110, 128, 'wash', 6) + text(x + 55, 24, t.replace('T', '<tspan class="i">T</tspan>'), 'tb', 'middle');
    outs.forEach((s, i) => { const y = 46 + i * 38 + (outs.length === 1 ? 38 : 0); o += rect(x + 22, y, 66, 28, 'paper', 5) + text(x + 55, y + 19, s, 't', 'middle'); });
    o += text(x + 55, 184, pr.replace(/p/g, '<tspan class="i">p</tspan>'), 't', 'middle') + text(x + 55, 208, cond, 'tl', 'middle');
  });
  o += text(30, 234, '第一行：格子里每个 outcome 的 probability，随 ' + it('p') + ' 变。', 'ts') + text(30, 252, '第二行：已知落在这一格时，每个 outcome 的 conditional probability，和 ' + it('p') + ' 无关。', 'ts');
  return svg(560, 262, o, '三次 Bernoulli trial 的八个 outcome 按 1 的个数分成四格；同一格里的 outcome probability 相同，所以给定落在哪一格之后，格内每个 outcome 的 conditional probability 是 1 或三分之一，不依赖 p');
}

// 开头第二件：五个数与 method of moments 的 estimate
function fivepts() {
  const X = [0.9, 1.4, 2.0, 3.1, 9.6], n = X.length;
  const m = X.reduce((a, b) => a + b, 0) / n, th = 2 * m, mx = Math.max(...X);
  const sx = lin(0, 12, 40, 520), y = 96;
  let o = rect(sx(th), y - 40, sx(12) - sx(th), 56, 'wash');
  o += text(sx(th) + 8, y - 26, '按 estimate 6.8，data 不可能落在这里', 'ts');
  o += line(sx(0), y, sx(12), y, 'axis');
  for (let t = 0; t <= 12; t += 2) o += line(sx(t), y, sx(t), y + 4, 'axis') + text(sx(t), y + 18, String(t), 'ts', 'middle');
  for (const x of X) o += circle(sx(x), y, 5.5, x === mx ? 'ln-f' : 'ink-f');
  o += line(sx(m), y - 30, sx(m), y + 6, 'dash') + text(sx(m), y - 34, 'x̄ = ' + m.toFixed(1), 'ts', 'middle');
  o += line(sx(th), y - 40, sx(th), y + 16, 'ink-b') + text(sx(th), y + 34, '2x̄ = ' + th.toFixed(1), 'tb', 'middle');
  o += text(sx(mx), y + 34, 'max = ' + mx, 'tl', 'middle');
  o += text(sx(m) / 2 + sx(0) / 2, y + 52, 'mean 是 θ/2，所以把 x̄ 乘 2 当成 θ', 'ts', 'start');
  return svg(560, 160, o, '五个数 0.9、1.4、2.0、3.1、9.6 画在数轴上，mean 3.4，乘 2 得 6.8，而最大的数 9.6 落在 6.8 的右边');
}

// 第 1 站：sleep data 的 10 个 difference。Individual 的 spread 是 s，x̄ 的 spread 是 s/√n
function sleepdots() {
  const D = [1.2, 2.4, 1.3, 1.3, 0.0, 1.0, 1.8, 0.8, 4.6, 1.4], n = D.length;
  const m = D.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(D.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)), se = sd / Math.sqrt(n);
  const sx = lin(-1, 5, 50, 520), y = 70;
  let o = line(sx(-1), y, sx(5), y, 'axis');
  for (let t = -1; t <= 5; t++) o += line(sx(t), y, sx(t), y + 4, 'axis') + text(sx(t), y + 18, String(t).replace('-', '−'), 'ts', 'middle');
  const seen = {};
  for (const v of D) { seen[v] = (seen[v] || 0) + 1; o += circle(sx(v), y - 8 - 12 * (seen[v] - 1), 5, 'ink-f'); }
  o += text(sx(-1), 24, '10 个病人的 difference（hours）', 'tb');
  o += line(sx(0), y + 26, sx(0), 190, 'grid') + text(sx(0) - 6, 186, 'μ = 0', 'ts', 'end');
  const bar = (yy, h, cls, lab) => line(sx(m - h), yy, sx(m + h), yy, cls) + line(sx(m - h), yy - 6, sx(m - h), yy + 6, cls) + line(sx(m + h), yy - 6, sx(m + h), yy + 6, cls) + circle(sx(m), yy, 4, cls === 'ln' ? 'ln-f' : 'ink-f') + text(sx(m + h) + 10, yy - 2, lab[0], cls === 'ln' ? 'tl' : 't') + text(sx(m + h) + 10, yy + 14, lab[1], 'ts');
  o += bar(124, sd, 'ink', [`x̄ ± s = ${m.toFixed(2)} ± ${sd.toFixed(2)}`, '单个病人散开的范围']);
  o += bar(168, se, 'ln', [`x̄ ± s/√10 = ${m.toFixed(2)} ± ${se.toFixed(3)}`, 'x̄ 的 standard error']);
  return svg(560, 200, o, 'Sleep data 的十个 difference 画成点图，mean 1.58。上面一条是 mean 加减 s=1.23，下面一条是 mean 加减 s 除以根号 10，约 0.389，离 0 有 4 个这么长');
}

// 第 6 站：n = 10、p = 0.1 时 plug-in interval 与解 quadratic 的 interval，逐个 x 看是否盖住 p
function wald() {
  const n = 10, p = 0.1, z = 1.96, z2 = z * z;
  const plug = (x) => { const h = x / n, w = z * Math.sqrt(h * (1 - h) / n); return [Math.max(0, h - w), Math.min(1, h + w)]; };
  const quad = (x) => { const h = x / n, a = 1 + z2 / n, b = -(2 * h + z2 / n), c = h * h, r = Math.sqrt(b * b - 4 * a * c); return [(-b - r) / (2 * a), (-b + r) / (2 * a)]; };
  let cP = 0, cQ = 0;
  for (let x = 0; x <= n; x++) { const pr = binom(x, n, p), A = plug(x), B = quad(x); if (A[0] <= p && p <= A[1]) cP += pr; if (B[0] <= p && p <= B[1]) cQ += pr; }
  const sx = lin(0, 0.8, 150, 530);
  let o = text(150, 20, '固定 p = 0.1：每个 x 算出的两个 interval', 'tb') + text(20, 20, 'x', 'tb') + text(60, 20, 'P(X = x)', 'tb');
  const y0 = 52, dy = 38;
  for (let x = 0; x <= 4; x++) {
    const yy = y0 + x * dy, A = plug(x), B = quad(x), pr = binom(x, n, p);
    o += text(20, yy + 6, String(x), 't') + text(60, yy + 6, pr.toFixed(3), 't');
    const seg = (I, dy2, cls) => { const ok = I[0] <= p && p <= I[1]; const w = Math.max(sx(I[1]) - sx(I[0]), 0); return (w < 1 ? circle(sx(I[0]), yy + dy2, 3.5, cls + '-f') : line(sx(I[0]), yy + dy2, sx(I[1]), yy + dy2, cls) + line(sx(I[0]), yy + dy2 - 4, sx(I[0]), yy + dy2 + 4, cls) + line(sx(I[1]), yy + dy2 - 4, sx(I[1]), yy + dy2 + 4, cls)) + (ok ? '' : text(sx(I[1]) + 8, yy + dy2 + 4, '没盖住', 'ts')); };
    o += seg(A, -6, 'ink') + seg(B, 8, 'ln');
  }
  const yb = y0 + 4 * dy + 26;
  o += line(sx(p), 30, sx(p), yb - 8, 'dash');
  o += line(sx(0), yb, sx(0.8), yb, 'axis');
  for (const t of [0, 0.1, 0.2, 0.4, 0.6, 0.8]) o += line(sx(t), yb, sx(t), yb + 4, 'axis') + text(sx(t), yb + 17, String(t), 'ts', 'middle');
  o += line(150, yb + 38, 172, yb + 38, 'ink') + text(178, yb + 42, `plug-in：实际 coverage ${(100 * cP).toFixed(1)}%`, 't');
  o += line(150, yb + 58, 172, yb + 58, 'ln') + text(178, yb + 62, `解 quadratic：实际 coverage ${(100 * cQ).toFixed(1)}%`, 'tl');
  return svg(560, yb + 74, o, 'n 等于 10、p 等于 0.1 时，x 从 0 到 4 各自算出的 plug-in interval 和解 quadratic 的 interval。x 等于 0 时 plug-in 缩成一个点 0，盖不住 0.1，这一种情形的 probability 是 0.349');
}


// ---------- 动图 ----------
const kt5 = (t) => Math.round(t * 1e5) / 1e5;
// 在 [t0, t1) 之间显示（t 都已除以 T）；t1 = null 表示一直到最后
const during = (spans) => {
  // spans: [[a,b],...]，按时间排；返回 values/keyTimes 的 discrete 动画
  const vals = [], kts = [];
  let cur = 0;
  if (!spans.length || spans[0][0] > 0) { vals.push(0); kts.push(0); }
  for (const [a, b] of spans) {
    if (a === 0) { vals.push(1); kts.push(0); } else { vals.push(1); kts.push(a); }
    if (b !== null && b < 1) { vals.push(0); kts.push(b); }
  }
  return { vals, kts };
};
const gshow = (spans, T, body) => {
  const { vals, kts } = during(spans);
  return `<g opacity="${vals[0]}">${body}<animate attributeName="opacity" values="${vals.join(';')}" keyTimes="${kts.map(kt5).join(';')}" dur="${T}s" repeatCount="indefinite" calcMode="discrete"/></g>`;
};

// 开头第一件事：9 种 sample，除以 2 的平均只有 σ² 的一半
function nine() {
  const vals = [1, 2, 6], S = [];
  for (const a of vals) for (const b of vals) { const m = (a + b) / 2; S.push({ a, b, m, v: ((a - m) ** 2 + (b - m) ** 2) / 2 }); }
  const H = 3, st = 1.3, T = H + 9 * st;
  const tk = (k) => (H + (k - 1) * st) / T; // 第 k 步开始
  let o = text(20, 18, 'population 是 1、2、6（各 1/3），μ = 3，σ² = 14/3；有放回抽 2 个，共 9 种 sample', 'ts');
  S.forEach((s, i) => {
    const x = 20 + (i % 3) * 126, y = 30 + Math.floor(i / 3) * 70;
    const px = (v) => x + 10 + v * 14.5, Y = y + 34;
    o += gshow([[tk(i + 1), i < 8 ? tk(i + 2) : null]], T, rect(x, y, 118, 62, 'wash', 4));
    o += rect(x, y, 118, 62, 'frame', 4);
    o += text(x + 6, y + 15, `(${s.a}, ${s.b})`, 'tb');
    o += line(px(0), Y, px(7), Y, 'axis');
    o += line(px(3), Y - 9, px(3), Y + 9, 'dash');
    o += line(px(s.a), Y, px(s.m), Y, 'ln') + line(px(s.b), Y, px(s.m), Y, 'ln');
    o += line(px(s.m), Y - 11, px(s.m), Y + 11, 'ink-b');
    o += circle(px(s.a), Y, 3.5, 'ink-f') + (s.a === s.b ? circle(px(s.a), Y, 6.5, 'ink') : circle(px(s.b), Y, 3.5, 'ink-f'));
    o += text(x + 112, y + 15, `x̄ = ${s.m}`, 'ts', 'end');
    o += text(x + 6, y + 57, `Σ(xᵢ − x̄)² ÷ 2 = ${s.v}`, 'ts');
  });
  o += text(20, 260, '粗竖线是 x̄，虚线是 μ = 3；彩色线段是各点到 x̄ 的距离，', 'ts') + text(20, 276, '它总比到 μ 的距离短。', 'ts');
  // 右边：累计平均
  const sy = lin(0, 5, 236, 80), bx = 420;
  o += line(bx - 6, sy(0), bx + 50, sy(0), 'axis');
  for (const v of [0, 1, 2, 3, 4, 5]) o += line(bx - 10, sy(v), bx - 6, sy(v), 'axis') + text(bx - 13, sy(v) + 4, String(v), 'ts', 'end');
  o += line(bx - 6, sy(14 / 3), bx + 56, sy(14 / 3), 'dash') + text(bx + 58, sy(14 / 3) + 4, 'σ² = 4.67', 'ts');
  o += text(bx - 6, 48, '÷2 的值，', 'ts') + text(bx - 6, 62, '前 k 种的平均', 'ts');
  const run = []; let acc = 0; S.forEach((s, i) => { acc += s.v; run.push(acc / (i + 1)); });
  const bar = (v) => d([[bx, sy(0)], [bx + 40, sy(0)], [bx + 40, sy(v)], [bx, sy(v)]]) + 'Z';
  const seq = [7 / 3, ...run], kts = [0, ...S.map((_, i) => tk(i + 1))];
  o += apath(seq.map(bar), kts, T, 'solid', true);
  const fm = (v) => (Math.round(v * 100) / 100).toString();
  seq.forEach((v, j) => {
    const span = j === 0 ? [[0, tk(1)]] : [[tk(j), j < 9 ? tk(j + 1) : null]];
    const lab = j === 0 || j === 9 ? '7/3 ≈ 2.33' : fm(v);
    o += gshow(span, T, text(bx + 46, sy(v) + 4, lab, 'tl') + (j === 0 || j === 9 ? text(bx - 10, 262, '9 种的平均 = 7/3，', 'tl') + text(bx - 10, 278, '只有 σ² 的一半', 'tl') : text(bx - 10, 262, `已加上 ${j} 种`, 'ts')));
  });
  return svgA(560, 284, o, '动图：population 1、2、6，有放回抽 2 个的 9 种 sample 一个个亮起来，每格画出两个数、sample mean 和 true mean；右边的柱子是除以 2 的 estimate 的累计平均，最后停在 7/3，只有 true variance 14/3 的一半');
}

// 第 6 站：一次一次做 experiment，interval 一条条排出来
function coverA() {
  const R = rng(2132), mu = 1.5, sigma = 1.2, n = 10, tc = 2.262157;
  const D = [];
  for (let r = 0; r < 100; r++) {
    const x = Array.from({ length: n }, () => mu + sigma * R.normal());
    const m = x.reduce((a, b) => a + b, 0) / n;
    const s = Math.sqrt(x.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
    const h = (tc * s) / Math.sqrt(n);
    D.push({ x, m, lo: m - h, hi: m + h, miss: mu < m - h || mu > m + h });
  }
  const lo = Math.min(...D.map((v) => Math.min(v.lo, ...v.x))), hi = Math.max(...D.map((v) => Math.max(v.hi, ...v.x)));
  const sx = lin(0, 101, 150, 548), sy = lin(Math.floor(lo), Math.ceil(hi), 250, 50);
  const H = 3, st = 0.14, T = H + 100 * st;
  const tk = (i) => (H + i * st) / T; // 第 i 次（0 起）出现的时刻
  let o = '';
  for (let v = Math.floor(lo); v <= Math.ceil(hi); v++) o += line(40, sy(v), sx(101), sy(v), 'grid') + text(36, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  o += line(40, sy(mu), sx(101), sy(mu), 'ink');
  o += rect(44, 40, 82, 220, 'frame', 4);
  o += text(85, 28, '这一次的 10 个', 'ts', 'middle') + text(sx(50), 28, '每次的 interval 依次排开；横线是 true μ = 1.5', 'ts', 'middle');
  let miss = 0;
  D.forEach((v, i) => {
    if (v.miss) miss++;
    const cls = v.miss ? 'ln' : 'mute';
    const iv = line(sx(i + 1), sy(v.lo), sx(i + 1), sy(v.hi), cls) + circle(sx(i + 1), sy(v.m), 1.6, v.miss ? 'ln-f' : 'mute-f');
    o += i === 0 ? iv : gshow([[0, tk(0)], [tk(i), null]], T, iv);
    // 左边：这一次的 sample
    let g = '';
    v.x.forEach((x, j) => { g += circle(58 + (j % 5) * 6 + (j >= 5 ? 3 : 0), sy(x), 2.6, 'ink-f'); });
    g += line(96, sy(v.m), 116, sy(v.m), 'ink-b') + line(106, sy(v.lo), 106, sy(v.hi), v.miss ? 'ln' : 'ink') + line(102, sy(v.lo), 110, sy(v.lo), 'ink') + line(102, sy(v.hi), 110, sy(v.hi), 'ink');
    g += text(85, 276, `第 ${i + 1} 次：${v.miss ? '没盖住' : '盖住了'}`, v.miss ? 'tl' : 'ts', 'middle');
    g += text(sx(101), 276, `至今 ${i + 1} 个 interval，${miss} 个没盖住 μ`, 'ts', 'end');
    o += gshow(i === 99 ? [[0, tk(0)], [tk(99), null]] : [[tk(i), tk(i + 1)]], T, g);
  });
  return svgA(560, 284, o, `动图：每次从 N(1.5, 1.44) 抽 10 个 observation，左边显示这一次的 10 个点、sample mean 和 95% t interval，右边把 100 次的 interval 一条条排开；最终 ${miss} 个没有盖住 true mean`);
}

// 第 7 站：cutoff 左右移动，α 和 β 此消彼长
function errorsA() {
  const n = 124;
  const sx = lin(44.5, 94.5, 40, 540), sy = lin(0, 0.085, 205, 40);
  const w = sx(1) - sx(0);
  const cs = [72, 73, 74, 75, 76, 75, 74, 73, 72, 71, 70, 69, 68, 69, 70, 71];
  const H = 2.4, st = 0.8, T = H + (cs.length - 1) * st + st;
  const kt = cs.map((_, i) => (i ? H + (i - 1) * st : 0) / T);
  const A = (c) => { let s = 0; for (let k = c; k <= n; k++) s += binom(k, n, 0.5); return s; };
  const B = (c) => { let s = 0; for (let k = 0; k < c; k++) s += binom(k, n, 0.6); return s; };
  const bs = lin(0, 0.6, 0, 210);
  let o = '';
  const uniq = [...new Set(cs)];
  for (const c of uniq) {
    let g = '';
    for (let k = 45; k <= 94; k++) {
      if (k < c) g += rect(sx(k - 0.5), sy(binom(k, n, 0.6)), w, sy(0) - sy(binom(k, n, 0.6)), 'wash');
      else g += rect(sx(k - 0.5), sy(binom(k, n, 0.5)), w, sy(0) - sy(binom(k, n, 0.5)), 'solid2');
    }
    g += line(sx(c - 0.5), sy(0), sx(c - 0.5), sy(0.085), 'dash');
    g += text(sx(c - 0.5) + 6, sy(0.085) + 10, 'reject H₀：' + it('X') + ' ≥ ' + c, 'tb') + text(sx(c - 0.5) - 6, sy(0.085) + 10, '不 reject', 't', 'end');
    const a = A(c), b = B(c);
    g += rect(150, 232, bs(a), 12, 'solid2') + text(144, 242, 'α（type I error）', 't', 'end') + text(150 + bs(a) + 6, 242, a.toFixed(3), 't');
    g += rect(150, 256, bs(b), 12, 'wash-strong') + text(144, 266, 'β（type II error）', 'tl', 'end') + text(150 + bs(b) + 6, 266, b.toFixed(3), 'tl');
    o += `<g opacity="${c === cs[0] ? 1 : 0}">${g}${ashow(cs.map((x) => x === c), kt, T)}</g>`;
  }
  const step = (p, cls) => { const pts = []; for (let k = 45; k <= 94; k++) { const y = sy(binom(k, n, p)); pts.push([sx(k - 0.5), y], [sx(k + 0.5), y]); } return path(d(pts), cls); };
  o += step(0.5, 'ink') + step(0.6, 'ln');
  o += line(sx(44.5), sy(0), sx(94.5), sy(0), 'axis');
  for (const k of [50, 62, 80, 90]) o += line(sx(k), sy(0), sx(k), sy(0) + 4, 'axis') + text(sx(k), sy(0) + 17, String(k), 'ts', 'middle');
  o += text(sx(45), sy(0.06), 'H₀：' + it('p') + ' = 0.5', 'tb') + text(sx(94), sy(0.06), 'H₁：' + it('p') + ' = 0.6', 'tl', 'end');
  o += text(40, 16, it('X') + ' = 124 对 couple 里向右的对数；黑色阶梯是 H₀ 下的 pmf，红色是 H₁ 下的', 'ts');
  o += text(400, 266, '深色 = α，浅色 = β', 'ts');
  return svgA(560, 276, o, '动图：null p 等于 0.5 与 alternative p 等于 0.6 下 X 的两个 binomial pmf，cutoff 从 72 右移到 76 再左移到 68；cutoff 右侧 null 下的深色面积 alpha 和左侧 alternative 下的浅色面积 beta 一个变小另一个就变大，下方两根柱子显示数值');
}

// parametric bootstrap：把 Gamma 的 MOM estimate 当成真值，simulate 10,000 次
function gammaDraw(r, a) {
  if (a < 1) return gammaDraw(r, a + 1) * Math.pow(r.u(), 1 / a);
  const dd = a - 1 / 3, c = 1 / Math.sqrt(9 * dd);
  for (;;) {
    const x = r.normal(), v0 = 1 + c * x;
    if (v0 <= 0) continue;
    const v = v0 * v0 * v0, u = r.u();
    if (Math.log(u) < 0.5 * x * x + dd - dd * v + dd * Math.log(v)) return dd * v;
  }
}
export function bootData() {
  const xb = 0.224, s2 = 0.1338, lam = xb / s2, al = (xb * xb) / s2, n = 227, B = 10000;
  const r = rng(2132), L = [], A = [];
  for (let b = 0; b < B; b++) {
    let s = 0, ss = 0;
    for (let i = 0; i < n; i++) { const x = gammaDraw(r, al) / lam; s += x; ss += x * x; }
    const m = s / n, v = ss / n - m * m;
    L.push(m / v); A.push((m * m) / v);
  }
  const avg = (X) => X.reduce((a, b) => a + b, 0) / B;
  const sdv = (X) => { const mu = avg(X); return Math.sqrt(X.reduce((a, b) => a + (b - mu) ** 2, 0) / (B - 1)); };
  const mean = avg(L), sd = sdv(L);
  return { lam, al, L, mean, sd, amean: avg(A), asd: sdv(A) };
}
function boot() {
  const { lam, L, mean, sd } = bootData();
  let o = '';
  // 左边：两个 world
  o += rect(14, 30, 196, 74, 'paper', 6);
  o += text(24, 50, '真实 world', 'tb') + text(24, 70, '(' + it('α') + ', ' + it('λ') + ') 未知', 't') + text(24, 92, '227 个降雨量 → estimate 1.67', 't');
  o += arrow(112, 108, 112, 142, 'ink');
  o += text(122, 130, '把 estimate 当真值', 'ts');
  o += rect(14, 146, 196, 96, 'wash', 6);
  o += text(24, 166, '假想 world', 'tl') + text(24, 186, '(' + it('α') + ', ' + it('λ') + ') = (0.375, 1.67)', 't');
  o += text(24, 208, '抽 227 个数，算一个 estimate', 't') + text(24, 230, '重复 10,000 次', 't');
  o += arrow(214, 194, 246, 194, 'ink');
  // 右边：histogram
  const x0 = 0.6, x1 = 3.8, w = 0.1, nb = Math.round((x1 - x0) / w);
  const cnt = new Array(nb).fill(0);
  for (const v of L) { const k = Math.floor((v - x0) / w); if (k >= 0 && k < nb) cnt[k]++; }
  const ymax = 1300;
  const sx = lin(x0, x1, 262, 546), sy = lin(0, ymax, 240, 40);
  o += axes({ sx, sy, x0, x1, y0: 0, y1: ymax, xt: [[1, '1'], [1.5, '1.5'], [2, '2'], [2.5, '2.5'], [3, '3']], yt: [] });
  cnt.forEach((c, k) => { if (c) o += rect(sx(x0 + k * w) + 0.5, sy(c), sx(x0 + w) - sx(x0) - 1, sy(0) - sy(c), 'wash-strong'); });
  o += line(sx(lam), sy(0), sx(lam), sy(ymax * 0.98), 'ink-b') + text(sx(lam) - 4, sy(ymax * 0.98) + 2, '1.67', 'tb', 'end');
  o += line(sx(mean), sy(0), sx(mean), sy(ymax * 0.98), 'ln-dash') + text(sx(mean) + 4, sy(ymax * 0.98) + 2, 'mean ' + mean.toFixed(3), 'tl');
  o += text(sx(2.2), sy(ymax * 0.62), 'bias ≈ ' + (mean - lam).toFixed(3), 't') + text(sx(2.2), sy(ymax * 0.52), 'standard error ≈ ' + sd.toFixed(3), 't');
  o += text(546, 262, 'estimate', 'ts', 'end');
  o += text(262, 22, '假想 world 里 10,000 个 estimate 的 histogram', 'tb');
  return svg(560, 270, o, 'Parametric bootstrap 示意：左边从真实 world 得到 estimate 1.67，把它当成真值造出假想 world；右边是在假想 world 里 simulate 一万次得到的 lambda hat 的 histogram，偏右，mean 约 ' + mean.toFixed(2) + '，standard deviation 约 ' + sd.toFixed(2));
}

export default {
  'st2132-nine': nine,
  'st2132-chi2': chi2,
  'st2132-tdist': tdist,
  'st2132-lik': lik,
  'st2132-uniflik': uniflik,
  'st2132-twoest': twoest,
  'st2132-curv': curv,
  'st2132-partition': partition,
  'st2132-cover': coverA,
  'st2132-errors': errorsA,
  'st2132-power': power,
  'st2132-wilks': wilks,
  'st2132-paired': paired,
  'st2132-fivepts': fivepts,
  'st2132-sleepdots': sleepdots,
  'st2132-wald': wald,
  'st2132-boot': boot,
};
