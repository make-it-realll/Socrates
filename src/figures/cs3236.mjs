import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, area, axes, apath, anim, ashow, f1 } from '../lib/svg.mjs';

const log2 = Math.log2;
const H2 = (p) => (p <= 0 || p >= 1 ? 0 : -p * log2(p) - (1 - p) * log2(1 - p));
const Hs = (ps) => ps.reduce((s, p) => s + (p > 0 ? -p * log2(p) : 0), 0);
const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const comb = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
const lfact = (n) => { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; };
// 离散动图：frame 的起始时刻 → keyTimes
const frames = (durs) => { const T = durs.reduce((a, b) => a + b, 0); const kt = []; let t = 0; for (const x of durs) { kt.push(t / T); t += x; } return { kt, T }; };
// 一组元素按 frame 显示/隐藏；第一个 frame 决定静态时的样子
const g = (on, kt, T, body) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// ---------- 开头：BSC 与 rate–error 的取舍 ----------
function tradeoff() {
  const f = 0.1, C = 1 - H2(f);
  let o = text(85, 22, 'BSC，f = 0.1', 'tb', 'middle');
  const xl = 32, xr = 138, y0 = 72, y1 = 162;
  o += text(xl, 50, 'x', 'ts', 'middle') + text(xr, 50, 'y', 'ts', 'middle');
  for (const [x, y, s] of [[xl, y0, '0'], [xl, y1, '1'], [xr, y0, '0'], [xr, y1, '1']]) o += circle(x, y, 11, 'paper') + text(x, y + 4.5, s, 't', 'middle');
  o += arrow(xl + 13, y0, xr - 13, y0, 'ink') + arrow(xl + 13, y1, xr - 13, y1, 'ink');
  o += arrow(xl + 11, y0 + 7, xr - 11, y1 - 7, 'ln') + arrow(xl + 11, y1 - 7, xr - 11, y0 + 7, 'ln');
  o += text(85, y0 - 8, '0.9', 'ts', 'middle') + text(85, y1 + 18, '0.9', 'ts', 'middle');
  o += text(85, 204, '斜线是 flip，', 'ts', 'middle') + text(85, 220, 'probability 0.1', 'ts', 'middle');
  // 右：rate 与 bit error probability
  const sx = lin(0, 1, 262, 540), ly = lin(-15, 0, 240, 44), sy = (v) => ly(Math.log10(v));
  const lim = []; for (let i = 0; i <= 80; i++) { const e = -15 + (14 * i) / 80, pb = 10 ** e; lim.push([C / (1 - H2(pb)), pb]); }
  o += path(d([[sx(0), sy(1e-15)], ...lim.map(([r, pb]) => [sx(r), sy(pb)]), [sx(1), sy(1)], [sx(0), sy(1)]]) + 'Z', 'wash');
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 1e-15, y1: 1, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt: [[1e-15, '10⁻¹⁵'], [1e-10, '10⁻¹⁰'], [1e-5, '10⁻⁵'], [1, '1']], xl: 'rate R', yl: 'bit error probability（log scale）' });
  o += path(d(lim.map(([r, pb]) => [sx(r), sy(pb)])), 'ln');
  o += line(sx(C), sy(1e-15), sx(C), sy(1e-3), 'dash') + text(sx(C) + 5, sy(1e-14), 'C = ' + C.toFixed(3), 'ts', 'start');
  const rep = (N) => { let s = 0; for (let k = (N + 1) / 2; k <= N; k++) s += comb(N, k) * f ** k * (1 - f) ** (N - k); return s; };
  for (const N of [1, 3, 5, 7, 9, 11, 21, 31, 61]) o += circle(sx(1 / N), sy(rep(N)), 3.5, 'ink-f');
  o += text(sx(1) - 8, sy(rep(1)) + 16, 'R1', 'ts', 'end') + text(sx(1 / 3) + 7, sy(rep(3)) + 15, 'R3', 'ts', 'start') + text(sx(1 / 5) + 7, sy(rep(5)) + 4, 'R5', 'ts', 'start');
  o += text(sx(1 / 21) + 7, sy(rep(21)) + 4, 'R21', 'ts', 'start') + text(sx(1 / 61) + 7, sy(rep(61)) - 7, 'R61', 'ts', 'start');
  o += circle(sx(4 / 7), sy(0.06688), 5, 'ln-f') + text(sx(4 / 7) - 8, sy(0.06688) - 7, 'Hamming (7,4)', 'tl', 'end');
  o += text(sx(0.3), sy(1e-11), 'achievable', 'tb', 'middle') + text(sx(0.8), sy(1e-8), 'not achievable', 'tb', 'middle');
  o += text(sx(0.555) + 4, sy(1e-4), 'Shannon limit', 'tl', 'start');
  o += text(280, 290, '黑点是 repetition code R1, R3, …, R61：bit error 越小，rate 1/N 越低。浅色区域是 Shannon 证明能做到的地方。', 'ts', 'middle');
  return svg(560, 298, o, '左边是 binary symmetric channel 的 transition diagram；右边是在 f 等于 0.1 时 rate 与 bit error probability 的取舍，repetition code 的点沿左侧贴向 rate 0，Shannon 的界在 rate 0.531 附近竖直向下');
}

// ---------- 第 1 站：yes/no question 的 tree ----------
function questions() {
  const node = (x, y, s) => rect(x - 40, y - 14, 80, 28, 'paper', 6) + text(x, y + 5, s, 't', 'middle');
  const leaf = (x, y, s, p) => rect(x - 24, y - 16, 48, 32, 'wash', 6) + text(x, y - 1, s, 'tb', 'middle') + text(x, y + 12, p, 'ts', 'middle');
  const edge = (x1, y1, x2, y2, lab, side) => line(x1, y1, x2, y2, 'ink') + text((x1 + x2) / 2 + (side < 0 ? -8 : 8), (y1 + y2) / 2 + 2, lab, 'ts', side < 0 ? 'end' : 'start');
  const Q = [[110, 40], [190, 112], [270, 184]], Lf = [[44, 112, 'a', '½'], [124, 184, 'b', '¼'], [210, 252, 'c', '⅛'], [330, 252, 'd', '⅛']];
  let o = '';
  o += edge(Q[0][0] - 20, Q[0][1] + 14, Lf[0][0] + 6, Lf[0][1] - 16, 'yes', -1) + edge(Q[0][0] + 20, Q[0][1] + 14, Q[1][0] - 6, Q[1][1] - 14, 'no', 1);
  o += edge(Q[1][0] - 20, Q[1][1] + 14, Lf[1][0] + 6, Lf[1][1] - 16, 'yes', -1) + edge(Q[1][0] + 20, Q[1][1] + 14, Q[2][0] - 6, Q[2][1] - 14, 'no', 1);
  o += edge(Q[2][0] - 20, Q[2][1] + 14, Lf[2][0] + 6, Lf[2][1] - 16, 'yes', -1) + edge(Q[2][0] + 20, Q[2][1] + 14, Lf[3][0] - 6, Lf[3][1] - 16, 'no', 1);
  ['X = a ?', 'X = b ?', 'X = c ?'].forEach((s, i) => { o += node(Q[i][0], Q[i][1], s) + text(Q[i][0] + 48, Q[i][1] + 5, '剩下 ' + ['1', '½', '¼'][i], 'ts', 'start'); });
  for (const [x, y, s, p] of Lf) o += leaf(x, y, s, p);
  // 右：表
  const X0 = 392, cols = [X0, X0 + 26, X0 + 70, X0 + 110];
  o += text(cols[0], 40, 'x', 'tb') + text(cols[1], 40, 'p(x)', 'tb') + text(cols[2], 32, '问题', 'tb') + text(cols[2], 48, '个数', 'tb') + text(cols[3], 40, 'log₂ 1/p', 'tb');
  o += line(X0 - 4, 56, 552, 56, 'grid');
  [['a', '½', 1], ['b', '¼', 2], ['c', '⅛', 3], ['d', '⅛', 3]].forEach(([s, p, q], i) => {
    const y = 78 + i * 24;
    o += text(cols[0], y, s, 't') + text(cols[1], y, p, 't') + text(cols[2] + 8, y, String(q), 't') + text(cols[3] + 18, y, String(log2(1 / [0.5, 0.25, 0.125, 0.125][i])), 't');
  });
  const H = Hs([0.5, 0.25, 0.125, 0.125]);
  o += line(X0 - 4, 162, 552, 162, 'grid');
  o += text(X0 - 4, 184, '平均问题个数', 'ts') + text(X0 - 4, 202, '= ½·1 + ¼·2 + ⅛·3 + ⅛·3', 'ts') + text(X0 - 4, 222, '= ' + H + ' = H(X)', 'tl');
  return svg(560, 272, o, '为 probability 二分之一、四分之一、八分之一、八分之一的四个 symbol 设计的 yes/no question tree；每问一次剩下的 probability 减半，symbol 所在的深度等于 log2 of 1/p，平均 1.75 个问题');
}

// ---------- 第 1 站：binary entropy function ----------
function h2() {
  const sx = lin(0, 1, 70, 520), sy = lin(0, 1.08, 196, 34);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.08, xt: [0, 0.1, 0.2, 0.5, 0.8, 1], yt: [0, 0.5, 1], xl: 'p = P(X = 1)', yl: 'H₂(p)（bits）', grid: false });
  o += path(curve(H2, 0, 1, sx, sy, 400), 'ln');
  for (const [p, lab, dx, anc] of [[0.1, 'H₂(0.1) = ', 8, 'start'], [0.2, 'H₂(0.2) = ', 8, 'start'], [0.5, '最大：H₂(0.5) = ', 0, 'middle']]) {
    const v = H2(p);
    o += line(sx(p), sy(0), sx(p), sy(v), 'dash') + circle(sx(p), sy(v), 3.5, 'ink-f');
    o += text(sx(p) + dx, sy(v) + (p === 0.5 ? -10 : 4) + (p === 0.1 ? 8 : 0), lab + (p === 0.5 ? '1' : v.toFixed(3)), 'ts', anc);
  }
  o += text(sx(0.78), sy(0.25), '关于 p = 0.5 对称', 'ts', 'middle') + text(sx(0.78), sy(0.25) + 16, '两端为 0：结果已经确定', 'ts', 'middle');
  return svg(560, 232, o, 'Binary entropy function H2(p) 的曲线：两端为 0，p 等于 0.5 时最大为 1 bit；p 等于 0.1 时 0.469，p 等于 0.2 时 0.722');
}

// ---------- 第 2 站：用错 distribution 的 code ----------
function kl() {
  const P = [0.5, 0.25, 0.125, 0.125], cp = ['0', '10', '110', '111'], cu = ['00', '01', '10', '11'];
  const X = { s: 24, p: 56, a: 108, b: 240, dl: 404, w: 484 };
  let o = text(X.s, 30, 'x', 'tb') + text(X.p, 30, 'p(x)', 'tb') + text(X.a, 22, '按 p 设计的 code', 'tb') + text(X.a, 38, 'ℓ = log₂ 1/p(x)', 'ts');
  o += text(X.b, 22, '按 uniform 设计的 code', 'tb') + text(X.b, 38, 'ℓ = 2', 'ts') + text(X.dl, 30, '多用的 bit', 'tb') + text(X.w, 30, '× p(x)', 'tb');
  o += line(20, 48, 552, 48, 'grid');
  const cells = (x0, y, s, cls) => s.split('').map((c, i) => rect(x0 + i * 22, y - 15, 22, 22, cls) + text(x0 + i * 22 + 11, y + 1, c, 't', 'middle')).join('');
  let tot = 0;
  P.forEach((p, i) => {
    const y = 76 + i * 32, dl = cu[i].length - cp[i].length;
    tot += p * dl;
    o += text(X.s, y, 'abcd'[i], 't') + text(X.p, y, ['½', '¼', '⅛', '⅛'][i], 't') + cells(X.a, y, cp[i], 'wash') + cells(X.b, y, cu[i], 'paper');
    const sg = (v, dg) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(dg);
    o += text(X.dl + 30, y, sg(dl, 0), dl > 0 ? 'tl' : 't', 'middle') + text(X.w + 30, y, sg(p * dl, dl === 0 ? 0 : 3).replace('.500', '.5'), 't', 'middle');
  });
  o += line(20, 200, 552, 200, 'grid');
  const H = Hs(P);
  o += text(X.a, 222, '平均 ' + H + ' bits = H(p)', 'ts') + text(X.b, 222, '平均 2 bits', 'ts') + text(X.w + 30, 222, '+' + tot, 'tl', 'middle');
  o += text(280, 250, 'c、d 用 uniform 的 code 反而各省 1 bit，但它们不常出现；按 p 加权，平均多用 ' + tot + ' bit，这就是 D(p ‖ u)。', 'ts', 'middle');
  return svg(560, 258, o, '同一个 source 用两种 code：按真实 distribution 设计的 code 平均 1.75 bits，按 uniform 设计的 code 平均 2 bits；逐个 symbol 有长有短，加权平均多出 0.25 bit');
}

// ---------- 第 3 站：joint distribution 与各个 entropy ----------
function joint() {
  const p = 0.2, f = 0.1;
  const J = [[(1 - p) * (1 - f), (1 - p) * f], [p * f, p * (1 - f)]]; // J[x][y]
  const HX = H2(p), HY = H2(J[0][1] + J[1][1]), HXY = Hs([J[0][0], J[0][1], J[1][0], J[1][1]]);
  const HYgX = HXY - HX, HXgY = HXY - HY, I = HX + HY - HXY;
  const S = 190, x0 = 40, y0 = 44;
  let o = text(x0 + S / 2, 24, 'P(x, y) 画成面积', 'tb', 'middle');
  const w0 = (1 - p) * S, w1 = p * S;
  o += rect(x0, y0, w0, (1 - f) * S, 'wash') + rect(x0, y0 + (1 - f) * S, w0, f * S, 'band-p');
  o += rect(x0 + w0, y0, w1, f * S, 'band-p') + rect(x0 + w0, y0 + f * S, w1, (1 - f) * S, 'wash');
  o += rect(x0, y0, S, S, 'frame') + line(x0 + w0, y0, x0 + w0, y0 + S, 'ink');
  o += line(x0, y0 + (1 - f) * S, x0 + w0, y0 + (1 - f) * S, 'ink') + line(x0 + w0, y0 + f * S, x0 + S, y0 + f * S, 'ink');
  o += text(x0 + w0 / 2, y0 + (1 - f) * S / 2, '(0, 0)', 't', 'middle') + text(x0 + w0 / 2, y0 + (1 - f) * S / 2 + 18, J[0][0].toFixed(2), 'tb', 'middle');
  o += text(x0 + w0 / 2, y0 + S - 5, '(0, 1)  ' + J[0][1].toFixed(2), 'ts', 'middle');
  o += text(x0 + S + 8, y0 + f * S - 5, '(1, 0)  ' + J[1][0].toFixed(2), 'ts', 'start');
  o += text(x0 + S + 8, y0 + f * S + (1 - f) * S / 2, '(1, 1)', 'ts', 'start') + text(x0 + S + 8, y0 + f * S + (1 - f) * S / 2 + 16, J[1][1].toFixed(2), 'tb', 'start');
  o += text(x0 + w0 / 2, y0 + S + 18, 'X = 0：宽 0.8', 'ts', 'middle') + text(x0 + w0 + w1 / 2, y0 + S + 18, 'X = 1', 'ts', 'middle') + text(x0 + S + 8, y0 + S - 4, '宽 0.2', 'ts', 'start');
  // 右：bar
  const bx = 318, s = 184, bh = 16, X = (v) => bx + v * s;
  const bar = (a, b, y, cls) => rect(X(a), y, (b - a) * s, bh, cls);
  const R = [52, 104, 156, 214];
  o += bar(0, HXY, R[0], 'paper') + text(X(0), R[0] - 6, 'H(X, Y) = ' + HXY.toFixed(3), 'ts');
  o += bar(0, HX, R[1], 'wash') + bar(HX, HXY, R[1], 'paper') + text(X(0), R[1] - 6, 'H(X) = ' + HX.toFixed(3), 'ts') + text(X(HX) + 3, R[1] - 6, 'H(Y | X) = ' + HYgX.toFixed(3), 'ts');
  o += bar(0, HXgY, R[2], 'paper') + bar(HXgY, HXY, R[2], 'wash') + text(X(HXgY) + 3, R[2] - 6, 'H(Y) = ' + HY.toFixed(3), 'ts') + text(X(HXgY) - 5, R[2] + bh + 15, 'H(X | Y) = ' + HXgY.toFixed(3), 'ts', 'end');
  o += bar(HXgY, HX, R[3], 'solid') + text(X(HX) + 6, R[3] + 12, 'I(X; Y) = ' + I.toFixed(3), 'tl');
  o += line(X(HXgY), R[2] - 2, X(HXgY), R[3] + bh + 4, 'dash') + line(X(HX), R[1] + bh, X(HX), R[2] - 20, 'dash') + line(X(HX), R[2], X(HX), R[3] + bh + 4, 'dash');
  o += text(280, 284, '浅色格是 Y = X，深色格是被 flip 的情形。右边每条的 length 是 bits：I 是 H(X) 与 H(Y) 重叠的那一段。', 'ts', 'middle');
  return svg(560, 292, o, 'X 取 1 的 probability 为 0.2、经过 flip probability 0.1 的 channel 得到 Y：左边把 joint distribution 画成面积，右边用 bar 的 length 表示 H(X,Y)、H(X)、H(Y)、两个 conditional entropy 和 mutual information 0.358');
}

// ---------- 第 4 站：Kraft inequality 的 tree 与 interval ----------
function kraft() {
  const lx = (i) => 70 + i * 60, yD = (dd) => 52 + dd * 50;
  const nx = (dd, j) => { const span = 8 >> dd; return (lx(j * span) + lx(j * span + span - 1)) / 2; };
  const used = { '0': 'code', '100': 'code', '101': 'code' };
  const state = (s) => { if (used[s]) return 'code'; if (s.startsWith('0') && s.length > 1) return 'below'; if (s.startsWith('11')) return 'free'; return 'inner'; };
  let o = text(280, 18, 'Source p = (0.7, 0.15, 0.15) 的 Shannon–Fano code：ℓ = ⌈log₂ 1/p⌉ = 1, 3, 3', 'tb', 'middle');
  const nodes = [];
  for (let dd = 0; dd <= 3; dd++) for (let j = 0; j < 1 << dd; j++) nodes.push([dd, j, dd ? j.toString(2).padStart(dd, '0') : '']);
  for (const [dd, j, s] of nodes) if (dd < 3) for (const b of [0, 1]) {
    const c = s + b, st = state(c), x1 = nx(dd, j), x2 = nx(dd + 1, 2 * j + b);
    o += line(x1, yD(dd) + 9, x2, yD(dd + 1) - 9, st === 'below' || st === 'free' ? 'dash' : 'ink');
    if (st !== 'below' && st !== 'free') o += text((x1 + x2) / 2 + (b ? 8 : -8), (yD(dd) + yD(dd + 1)) / 2 - 2, String(b), 'ts', b ? 'start' : 'end');
  }
  for (const [dd, j, s] of nodes) {
    const st = s ? state(s) : 'inner', x = nx(dd, j), y = yD(dd);
    o += circle(x, y, 9, st === 'code' ? 'solid' : st === 'inner' ? 'paper' : 'mute-f');
  }
  o += text(nx(1, 0) - 16, yD(1) + 5, '0', 'tl', 'end');
  o += text(nx(3, 4), yD(3) + 26, '100', 'tl', 'middle') + text(nx(3, 5), yD(3) + 26, '101', 'tl', 'middle');
  o += text(nx(1, 0), yD(3) + 26, '0 下面的 node 都不能再用', 'ts', 'middle');
  o += text(nx(2, 3), yD(3) + 26, '11 下面：空着', 'ts', 'middle');
  // interval
  const iy = 252, ix = (v) => 40 + v * 480;
  const seg = (a, b, cls, lab) => rect(ix(a), iy, ix(b) - ix(a), 22, cls) + text((ix(a) + ix(b)) / 2, iy + 16, lab, cls === 'solid' ? 'tw' : 'ts', 'middle');
  o += seg(0, 0.5, 'solid', '0：½') + seg(0.5, 0.625, 'wash-strong', '100：⅛') + seg(0.625, 0.75, 'wash-strong', '101：⅛') + seg(0.75, 1, 'paper', '空着：¼');
  o += text(ix(0), iy + 40, '0', 'ts', 'middle') + text(ix(0.5), iy + 40, '½', 'ts', 'middle') + text(ix(0.75), iy + 40, '¾', 'ts', 'middle') + text(ix(1), iy + 40, '1', 'ts', 'middle');
  o += text(280, iy + 62, 'Length ℓ 的 codeword 占 [0, 1) 里 2' + sup('−ℓ') + ' 长的一段，互不重叠：½ + ⅛ + ⅛ = ¾ ≤ 1', 'ts', 'middle');
  return svg(560, 322, o, '深度为 3 的 binary tree：codeword 0、100、101 是实心 node，0 下面的 node 和 11 下面的 node 都不用；下方的 interval 显示每个 codeword 占二的负 length 次方长的一段，合计四分之三');
}

// ---------- 第 4 站：Huffman 逐步合并（动图） ----------
function huffmanA() {
  const leaves = { a: [60, 0.3], d: [156, 0.15], e: [246, 0.1], b: [370, 0.25], c: [470, 0.2] };
  const code = { a: '00', d: '010', e: '011', b: '10', c: '11' };
  const yH = (h) => 214 - h * 52;
  // merge k：[名字, 左孩子, 右孩子, 高度]
  const M = [['de', 'd', 'e', 1], ['bc', 'b', 'c', 1], ['ade', 'a', 'de', 2], ['root', 'ade', 'bc', 3]];
  const pos = {}, prob = {};
  for (const [s, [x, p]] of Object.entries(leaves)) { pos[s] = [x, yH(0)]; prob[s] = p; }
  for (const [n, l, r, h] of M) { pos[n] = [(pos[l][0] + pos[r][0]) / 2, yH(h)]; prob[n] = prob[l] + prob[r]; }
  const seq = [4, 0, 1, 2, 3, 4], { kt, T } = frames([3.4, 2.2, 2.2, 2.2, 2.2, 3.4]);
  const nextPair = [['e', 'd'], ['c', 'b'], ['de', 'a'], ['bc', 'ade'], []];
  let o = '';
  // edge
  M.forEach(([n, l, r], k) => {
    let e = '';
    for (const [c, bit] of [[l, '0'], [r, '1']]) {
      const [x1, y1] = pos[n], [x2, y2] = pos[c], top = c.length === 1 ? 18 : 17;
      e += line(x1, y1 + 17, x2, y2 - top, 'ink');
      e += g(seq.map((v) => v === 4), kt, T, text((x1 + x2) / 2 + (bit === '1' ? 7 : -7), (y1 + y2) / 2 + 2, bit, 'tl', bit === '1' ? 'start' : 'end'));
    }
    o += g(seq.map((v) => v > k), kt, T, e);
  });
  // leaf
  for (const s of Object.keys(leaves)) {
    const [x, y] = pos[s];
    o += g(seq.map((v) => v < 4 && nextPair[v].includes(s)), kt, T, rect(x - 31, y - 22, 62, 44, 'ln', 8));
    o += rect(x - 26, y - 18, 52, 36, 'paper', 6) + text(x, y - 2, s, 'tb', 'middle') + text(x, y + 13, prob[s].toFixed(2), 'ts', 'middle');
    o += g(seq.map((v) => v === 4), kt, T, text(x, y + 38, code[s], 'tl', 'middle'));
  }
  // internal node
  M.forEach(([n], k) => {
    const [x, y] = pos[n];
    let e = g(seq.map((v) => v < 4 && nextPair[v].includes(n)), kt, T, circle(x, y, 22, 'ln'));
    e += circle(x, y, 17, 'paper') + text(x, y + 4.5, prob[n].toFixed(2), 'ts', 'middle');
    e += g(seq.map((v) => v === k + 1 && v < 4), kt, T, circle(x, y, 17, 'solid') + text(x, y + 4.5, prob[n].toFixed(2), 'tw', 'middle'));
    o += g(seq.map((v) => v > k), kt, T, e);
  });
  const L = Object.keys(code).reduce((s, c) => s + leaves[c][1] * code[c].length, 0), H = Hs(Object.values(leaves).map((v) => v[1]));
  const msg = [
    ['开始：5 个 symbol 各是一棵只有一个 node 的 tree。', '外圈标出的是 probability 最小的两个：e 0.10、d 0.15。'],
    ['第 1 步：e + d 合并成 0.25（实心）。', '最小的两个：c 0.20 和 0.25；b 与新 node 并列 0.25，任取 b。'],
    ['第 2 步：c + b 合并成 0.45。', '最小的两个：新 node 0.25 和 a 0.30。'],
    ['第 3 步：合并成 0.55。只剩 0.45 和 0.55 两棵 tree。', '再合并一次就是 root。'],
    ['合并 4 次得到这棵 tree；从 root 往下读 0/1 就是 codeword。', `L = ${L.toFixed(2)} bits，H = ${H.toFixed(3)} bits。`],
  ];
  msg.forEach(([a, b], v) => { o += g(seq.map((x) => x === v), kt, T, text(280, 272, a, 't', 'middle') + text(280, 290, b, 'ts', 'middle')); });
  return svgA(560, 298, o, '动图：Huffman algorithm 对 probability 0.3、0.25、0.2、0.15、0.1 的五个 symbol 逐步合并最小的两棵 tree，最后得到 codeword a 00、b 10、c 11、d 010、e 011，平均 length 2.25 bits');
}

// ---------- 第 5 站：per-symbol information 随 n 集中（动图） ----------
function typicalA() {
  const p = 0.1, a = log2(1 / p), b = log2(1 / (1 - p)), H = H2(p), eps = 0.05;
  const sx = lin(0, 1, 62, 536), ymax = 32, sy = lin(0, ymax, 222, 50);
  const ns = [1000, 100, 200, 500, 1000, 2000, 5000], { kt, T } = frames([3.6, 2, 2, 2, 2, 2, 3.4]);
  const hk = (n, k) => b + ((a - b) * k) / n;
  const info = ns.map((n) => {
    const lf = [0]; for (let i = 1; i <= n; i++) lf.push(lf[i - 1] + Math.log(i));
    const lp = (k) => lf[n] - lf[k] - lf[n - k] + k * Math.log(p) + (n - k) * Math.log(1 - p);
    const w = (a - b) / n, top = [], inner = [];
    let PT = 0, lT = -Infinity;
    for (let k = 0; k <= n; k++) {
      const h = hk(n, k); if (h > 1.02) break;
      const pk = Math.exp(lp(k)), den = Math.min(pk / w, ymax);
      const xL = sx(h - w / 2), xR = sx(h + w / 2), y = sy(den);
      top.push([xL, y], [xR, y]);
      if (Math.abs(h - H) <= eps + 1e-12) {
        PT += pk; inner.push([xL, y], [xR, y]);
        const lc = (lf[n] - lf[k] - lf[n - k]) / Math.LN2; lT = lT === -Infinity ? lc : Math.max(lT, lc) + log2(1 + 2 ** (-Math.abs(lT - lc)));
      }
    }
    const shape = (pts) => d([[pts[0][0], sy(0)], ...pts, [pts[pts.length - 1][0], sy(0)]]) + 'Z';
    return { n, all: shape(top), inn: shape(inner), PT, lT };
  });
  let o = rect(sx(H - eps), 50, sx(H + eps) - sx(H - eps), 172, 'wash2');
  o += apath(info.map((q) => q.all), kt, T, 'wash', true) + apath(info.map((q) => q.inn), kt, T, 'band-p', true);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: ymax, xt: [0, 0.2, 0.6, 0.8, 1], yt: [], xl: 'per-symbol information −(1/n) log₂ P(xⁿ)（bits）' });
  o += line(sx(H), 46, sx(H), sy(0), 'dash') + text(sx(H), sy(0) + 17, 'H = ' + H.toFixed(3), 'tl', 'middle');
  o += text(sx(H), 40, 'H ± ε，ε = ' + eps, 'ts', 'middle');
  o += circle(sx(b), sy(0), 4, 'ink-f') + line(sx(b), sy(0) - 5, sx(b) - 14, 184, 'mute') + text(70, 160, '全 0 的 xⁿ：', 'ts', 'start') + text(70, 177, '单个 probability 最大', 'ts', 'start');
  const RX = 356;
  info.forEach((q, i) => {
    const on = ns.map((_, j) => j === i || (i === 0 && j === 4) || (i === 4 && j === 0));
    if (i === 4) return;
    o += g(on, kt, T, text(RX, 72, 'n = ' + q.n, 'tb') + text(RX, 92, 'P(typical) = ' + q.PT.toFixed(q.PT > 0.999 ? 4 : 3), 't') + text(RX, 112, 'log₂ |T| = ' + q.lT.toFixed(1), 't') + text(RX, 130, 'n(H ± ε) = ' + (q.n * (H - eps)).toFixed(0) + ' 到 ' + (q.n * (H + eps)).toFixed(0), 'ts'));
  });
  o += text(280, 268, '每一帧是 Bernoulli(0.1) 的 n 个 bit；曲线下面积恒为 1，深色部分是落进 typical set 的 probability。', 'ts', 'middle');
  return svgA(560, 276, o, '动图：Bernoulli 0.1 source 的 per-symbol information 的 distribution，n 从 100 增加到 5000，越来越集中在 H 等于 0.469 附近，落进 H 加减 0.05 的 probability 从 0.38 增加到 0.9998');
}

// ---------- 第 6 站：BSC 一轮轮传输（动图） ----------
function bscA() {
  let s = 20261122;
  const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const n = 30, f = 0.1, R = 8;
  const x = Array.from({ length: n }, () => (rnd() < 0.5 ? 1 : 0));
  const Z = Array.from({ length: R }, () => Array.from({ length: n }, () => (rnd() < f ? 1 : 0)));
  const K = Z.map((z) => z.reduce((a, b) => a + b, 0));
  const seq = Z.map((_, r) => r), { kt, T } = frames(Z.map((_, r) => (r === R - 1 ? 2.4 : 1.6)));
  const cw = 10, X0 = 46, rows = { x: 58, z: 118, y: 178 };
  let o = text(X0, 24, '同一串 x 发送 ' + R + ' 次，每次 noise 不同', 'tb');
  o += text(X0 - 8, rows.x + 4, 'x', 'tb', 'end') + text(X0 - 8, rows.z + 4, 'z', 'tb', 'end') + text(X0 - 8, rows.y + 4, 'y', 'tb', 'end');
  o += text(X0 + (n * cw) / 2, rows.x + 30, '⊕（mod 2 相加）', 'ts', 'middle') + text(X0 + (n * cw) / 2, rows.z + 30, '=', 'ts', 'middle');
  for (let i = 0; i < n; i++) {
    const cx = X0 + i * cw;
    o += rect(cx, rows.x - 10, cw, 18, 'paper') + text(cx + cw / 2, rows.x + 4, String(x[i]), 'ts', 'middle');
    o += rect(cx, rows.z - 10, cw, 18, 'paper') + rect(cx, rows.y - 10, cw, 18, 'paper');
    const zon = Z.map((z) => z[i] === 1);
    o += g(zon, kt, T, rect(cx, rows.z - 10, cw, 18, 'solid') + text(cx + cw / 2, rows.z + 4, '1', 'tw', 'middle') + rect(cx, rows.y - 10, cw, 18, 'band-p'));
    o += g(zon.map((v) => !v), kt, T, text(cx + cw / 2, rows.z + 4, '0', 'ts', 'middle'));
    o += g(zon.map((v) => !v), kt, T, text(cx + cw / 2, rows.y + 4, String(x[i]), 'ts', 'middle'));
    o += g(zon, kt, T, text(cx + cw / 2, rows.y + 4, String(1 - x[i]), 'tb', 'middle'));
  }
  Z.forEach((_, r) => { o += g(seq.map((v) => v === r), kt, T, text(X0, 218, '第 ' + (r + 1) + ' 次：flip 了 ' + K[r] + ' 个 bit', 't')); });
  // 右：Binomial(30, 0.1)
  const bx = 380, bw = 18, by = 196, sc = 480;
  o += text(bx - 6, 24, 'flip 个数 K 的 distribution', 'tb') + text(bx - 6, 42, 'K ~ Binomial(30, 0.1)', 'ts');
  for (let k = 0; k <= 8; k++) {
    const pk = comb(n, k) * f ** k * (1 - f) ** (n - k), x0 = bx + k * bw;
    o += rect(x0 + 2, by - pk * sc, bw - 4, pk * sc, 'wash') + text(x0 + bw / 2, by + 15, String(k), 'ts', 'middle');
    o += g(K.map((v) => v === k), kt, T, rect(x0 + 2, by - pk * sc, bw - 4, pk * sc, 'solid'));
  }
  o += line(bx, by, bx + 9 * bw, by, 'axis') + text(bx + 9 * bw + 4, by + 15, 'K', 'ts', 'start');
  o += text(bx - 6, 232, 'nf = 3；K 落在 1 到 5 之间的', 'ts') + text(bx - 6, 248, 'probability 是 ' + [1, 2, 3, 4, 5].reduce((sm, k) => sm + comb(n, k) * f ** k * (1 - f) ** (n - k), 0).toFixed(3), 'ts');
  return svgA(560, 256, o, '动图：30 个 bit 经过 flip probability 0.1 的 BSC 传输 8 次，每次 noise 不同；y 等于 x 加 z（mod 2），被 flip 的位置高亮；右边是 flip 个数的 binomial distribution，当前这次的个数高亮');
}

// ---------- 第 6 站：noise ball 的 packing ----------
function packing() {
  const n = 100, f = 0.1, C = [150, 150], Rb = 124, r = 21;
  let o = circle(C[0], C[1], Rb, 'wash2') + circle(C[0], C[1], Rb, 'ink');
  const pts = [];
  for (let row = -6; row <= 6; row++) for (let col = -6; col <= 6; col++) {
    const x = C[0] + (col + (row % 2 ? 0.5 : 0)) * 2 * r, y = C[1] + row * r * Math.sqrt(3);
    if (Math.hypot(x - C[0], y - C[1]) <= Rb - r - 1) pts.push([x, y]);
  }
  for (const [x, y] of pts) o += circle(x, y, r - 1.5, 'wash') + circle(x, y, 2.5, 'ink-f');
  const hi = pts.reduce((m, q) => (q[0] - q[1] > m[0] - m[1] ? q : m), pts[0]);
  o += circle(hi[0], hi[1], r - 1.5, 'ln');
  o += line(hi[0] + r - 2, hi[1] - 4, 300, 96, 'mute') + text(304, 92, '一个 codeword 发出后，yⁿ 几乎总落在', 'ts') + text(304, 108, '它周围约 2' + sup('nH(Y|X)') + ' 个 sequence 里', 'ts');
  o += line(C[0] + Rb * 0.7, C[1] + Rb * 0.71, 300, 236, 'mute') + text(304, 232, '所有 typical 的 yⁿ：约 2' + sup('nH(Y)') + ' 个', 'ts');
  o += text(304, 150, '小圆不能重叠，否则 decoder 分不清。', 't') + text(304, 170, '所以 codeword 最多约', 't') + text(304, 190, '2' + sup('nH(Y)') + ' / 2' + sup('nH(Y|X)') + ' = 2' + sup('nI(X;Y)') + ' 个', 'tb');
  const ball = n * H2(f), cw = n * (1 - H2(f));
  o += text(280, 296, `BSC(0.1)、uniform input、n = ${n}：2${sup(String(n))} / 2${sup(ball.toFixed(1))} = 2${sup(cw.toFixed(1))}，rate 最多 ${(cw / n).toFixed(3)}`, 'ts', 'middle');
  return svg(560, 304, o, '大圆代表所有 typical 的 output sequence，里面密排的小圆是每个 codeword 的 noise ball；小圆不能重叠，所以 codeword 的个数最多是两者大小之比，即 2 的 nI 次方');
}

// ---------- 第 7 站：Hamming (7,4) 的三个 circle（动图） ----------
function hammingA() {
  const Pm = [[1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const Hm = [...Pm, [1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const u = [1, 1, 0, 0];
  const xw = [...u, ...[0, 1, 2].map((j) => u.reduce((s, ui, i) => s + ui * Pm[i][j], 0) % 2)];
  const flip = 2; // 第 3 位
  const yw = xw.map((v, i) => (i === flip ? 1 - v : v));
  const syn = [0, 1, 2].map((j) => yw.reduce((s, yi, i) => s + yi * Hm[i][j], 0) % 2);
  const bad = Hm.findIndex((row) => row.every((v, j) => v === syn[j]));
  // frame：0 = 收到并检查（静态），1 = 发送，2 = flip，3 = 检查，4 = 改回
  const seq = [3, 1, 2, 3, 4], { kt, T } = frames([4, 2.4, 2.4, 3.6, 2.8]);
  const Cc = [[128, 118], [218, 118], [173, 196]], rC = 78;
  const at = [[173, 82], [122, 176], [224, 176], [173, 145], [85, 95], [261, 95], [173, 250]];
  // 每个 bit 必须恰好落在它所属的 circle 里，并离边界至少 18
  at.forEach(([x, y], i) => Cc.forEach(([cx, cy], j) => { const dd = Math.hypot(x - cx, y - cy), inC = Hm[i][j] === 1; if (inC ? dd > rC - 18 : dd < rC + 18) throw new Error('hamming layout ' + i + ',' + j); }));
  const nm = ['u₁', 'u₂', 'u₃', 'u₄', 'p₁', 'p₂', 'p₃'];
  const members = [0, 1, 2].map((j) => Hm.map((row, i) => (row[j] ? i : -1)).filter((i) => i >= 0));
  let o = '';
  Cc.forEach(([x, y], j) => { o += g(seq.map((v) => v === 3 && syn[j] === 1), kt, T, circle(x, y, rC, 'wash')); });
  Cc.forEach(([x, y], j) => { o += circle(x, y, rC, 'ink') + g(seq.map((v) => v === 3 && syn[j] === 1), kt, T, circle(x, y, rC, 'ln')); });
  o += text(40, 50, 'circle 1', 'ts', 'middle') + text(306, 50, 'circle 2', 'ts', 'middle') + text(262, 278, 'circle 3', 'ts', 'start');
  const val = (fr, i) => (fr === 1 || fr === 4 ? xw[i] : yw[i]);
  at.forEach(([x, y], i) => {
    const hot = seq.map((v) => i === flip && (v === 2 || v === 3));
    o += circle(x, y, 17, 'paper') + g(hot, kt, T, circle(x, y, 17, 'solid'));
    o += g(hot.map((h) => !h), kt, T, text(x, y - 4, nm[i], 'ts', 'middle'));
    o += g(hot, kt, T, text(x, y - 4, nm[i], 'tw', 'middle'));
    for (const bit of [0, 1]) {
      o += g(seq.map((v, k) => val(v, i) === bit && !hot[k]), kt, T, text(x, y + 11, String(bit), 'tb', 'middle'));
      o += g(seq.map((v, k) => val(v, i) === bit && hot[k]), kt, T, text(x, y + 11, String(bit), 'tw', 'middle'));
    }
  });
  const s = (arr) => arr.slice(0, 4).join('') + ' ' + arr.slice(4).join('');
  const RX = 336;
  const lines = {
    1: [['发送 x = uG = ' + s(xw), 'tb'], ['u = ' + u.join('') + '，parity p = ' + xw.slice(4).join(''), 't'], ['每个 circle 里 1 的个数都是 even', 't']],
    2: [['Channel flip 了第 ' + (flip + 1) + ' 位（u₃）', 'tb'], ['收到 y = ' + s(yw), 't'], ['Decoder 不知道是哪一位错了', 't']],
    3: [['收到 y = ' + s(yw) + '，逐个 circle 检查', 'tb'],
      ...[0, 1, 2].map((j) => ['circle ' + (j + 1) + '：' + members[j].map((i) => yw[i]).join('+') + (syn[j] ? ' → odd' : ' → even'), syn[j] ? 'tl' : 't']),
      ['syndrome yH = ' + syn.join('') + ' = H 的第 ' + (bad + 1) + ' 行', 'tb'], ['只在 circle 2、3 里的那一位是 ' + nm[bad], 't']],
    4: [['把 ' + nm[bad] + ' flip 回来', 'tb'], ['x̂ = ' + s(yw.map((v, i) => (i === bad ? 1 - v : v))) + ' = x', 't'], ['三个 circle 重新都是 even', 't']],
  };
  for (const [fr, ls] of Object.entries(lines)) o += g(seq.map((v) => v === Number(fr)), kt, T, ls.map(([t, c], k) => text(RX, 62 + k * 24, t, c)).join(''));
  o += text(RX, 236, 'circle j 对应 H 的 column j：', 'ts') + text(RX, 254, '7 个 bit 里在这个 circle 中的 4 个相加', 'ts');
  return svgA(560, 286, o, '动图：Hamming 7,4 code 的三个 circle。发送 1100011，channel flip 第 3 位，circle 2 和 3 的 parity 变成 odd，syndrome 011 指向 u3，把它 flip 回来');
}


// ---------- 第 7 站：continuous 的 X 按 Δ quantize ----------
const phi = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
// 用 Simpson 积分算一格的 probability
const cell = (a, b) => { const m = 40, h = (b - a) / m; let s = phi(a) + phi(b); for (let i = 1; i < m; i++) s += (i % 2 ? 4 : 2) * phi(a + i * h); return (s * h) / 3; };
const Hq = (D) => { let H = 0; for (let k = Math.floor(-9 / D); k * D < 9; k++) { const q = cell(k * D, (k + 1) * D); if (q > 0) H -= q * log2(q); } return H; };
function quant() {
  const D = 0.5, sx = lin(-3.5, 3.5, 30, 290), sy = lin(0, 0.45, 210, 40);
  let o = text(160, 22, 'X ~ N(0, 1)，按 Δ = 0.5 切格子', 'tb', 'middle');
  for (let k = -7; k < 7; k++) {
    const a = k * D, q = cell(a, a + D), hgt = q / D;
    o += rect(sx(a), sy(hgt), sx(a + D) - sx(a), sy(0) - sy(hgt), k === 1 ? 'wash-strong' : 'wash');
  }
  o += path(curve(phi, -3.5, 3.5, sx, sy, 200), 'ln');
  o += line(sx(-3.5), sy(0), sx(3.5), sy(0), 'axis');
  for (const v of [-3, -2, -1, 0, 1, 2, 3]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, String(v), 'ts', 'middle');
  const q1 = cell(0.5, 1);
  o += line(sx(0.75), sy(q1 / D) - 2, sx(1.3), 84, 'mute') + text(sx(1.3) + 3, 64, '这一格的 probability', 'ts', 'start') + text(sx(1.3) + 3, 80, '≈ f(x)·Δ = ' + q1.toFixed(3), 'ts', 'start');
  o += text(sx(-3.4), 64, 'f(x)', 'tl', 'start');
  // 右：H(X_Δ) 与 H(X_Δ) + log Δ
  const ks = [0, 1, 2, 3, 4, 5, 6, 7], hh = 0.5 * log2(2 * Math.PI * Math.E);
  const rx = lin(0, 7, 352, 540), ry = lin(0, 10, 210, 40);
  o += axes({ sx: rx, sy: ry, x0: 0, x1: 7, y0: 0, y1: 10, xt: [[0, '1'], [1, '½'], [3, '⅛'], [5, '1/32'], [7, '1/128']], yt: [0, 2, 4, 6, 8, 10], xl: 'Δ', yl: 'bits' });
  const pts = ks.map((k) => [k, Hq(2 ** -k)]);
  o += path(d(pts.map(([k, v]) => [rx(k), ry(v)])), 'ink') + pts.map(([k, v]) => circle(rx(k), ry(v), 3, 'ink-f')).join('');
  o += path(d(pts.map(([k, v]) => [rx(k), ry(v - k)])), 'ln') + pts.map(([k, v]) => circle(rx(k), ry(v - k), 3, 'ln-f')).join('');
  o += text(rx(4.2), ry(Hq(2 ** -5)) - 4, 'H(X' + sub('Δ') + ')', 't', 'end');
  o += text(rx(7), ry(hh) + 20, 'H(X' + sub('Δ') + ') + log₂ Δ → ' + hh.toFixed(3), 'tl', 'end');
  o += text(280, 250, '格子每细一半，H(X' + sub('Δ') + ') 多约 1 bit；减去 log₂(1/Δ) 之后收敛到 h(X) = ½ log₂(2πe) = ' + hh.toFixed(3) + '。', 'ts', 'middle');
  return svg(560, 258, o, '左边是标准 Gaussian density 按宽 0.5 的格子切开，每格的 probability 是那一条的面积；右边是格子变细时 quantized entropy 一直增加，而加上 log Delta 之后收敛到 2.047');
}

// ---------- 第 7 站：AWGN capacity 与硬判成 BSC ----------
const erf = (x) => { // Abramowitz–Stegun 7.1.26，误差 < 1.5e-7
  const sgn = x < 0 ? -1 : 1, t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return sgn * y;
};
const Qf = (x) => 0.5 * (1 - erf(x / Math.SQRT2));
function awgn() {
  const sx = lin(0, 16, 64, 532), sy = lin(0, 2.2, 236, 34);
  const Cg = (s) => 0.5 * log2(1 + s), Cb = (s) => 1 - H2(Qf(Math.sqrt(s)));
  let o = axes({ sx, sy, x0: 0, x1: 16, y0: 0, y1: 2.2, xt: [0, 1, 3, 7, 15], yt: [0, 0.5, 1, 1.5, 2], xl: 'P / σ²', yl: 'capacity（bits / channel use）', grid: true });
  o += line(sx(0), sy(1), sx(16), sy(1), 'dash');
  o += path(curve(Cg, 0, 16, sx, sy, 300), 'ln') + path(curve(Cb, 0.0001, 16, sx, sy, 300), 'ink-b');
  for (const s of [1, 3, 15]) {
    const a = Cg(s), b = Cb(s);
    o += line(sx(s), sy(a), sx(s), sy(b), 'mute') + circle(sx(s), sy(a), 3.5, 'ln-f') + circle(sx(s), sy(b), 3.5, 'ink-f');
    o += text(sx(s) - 7, sy(a) - 7, a.toFixed(2), 'tl', 'end') + text(sx(s) + 6, sy(b) + 15, b.toFixed(3), 'ts', 'start');
  }
  o += text(sx(9.5), sy(Cg(9.5)) - 12, 'AWGN：½ log₂(1 + P/σ²)', 'tl', 'end');
  o += text(sx(10.6), sy(0.7), '发 ±√P、只看 sign：BSC，f = P(Z > √P)', 't', 'middle');
  o += text(sx(11), sy(1) - 7, 'binary input 的上限 1 bit', 'ts', 'middle');
  return svg(560, 270, o, 'AWGN channel 的 capacity 随 signal-to-noise ratio 按 log 增长，SNR 为 1、3、15 时为 0.5、1、2 bits；把它硬判成 BSC 的 capacity 分别是 0.369、0.750、0.999，永远不超过 1');
}

// ---------- 第 7 站：sphere packing ----------
function sphere() {
  // 左：x 与 z 几乎垂直，y 是斜边；长度按 √P : √σ² = √3 : 1 画
  const O = [36, 236], P = 3, s2 = 1, sc = 58;
  const ang = -Math.PI / 6, ux = [Math.cos(ang), Math.sin(ang)], uz = [Math.sin(ang), -Math.cos(ang)];
  const X = [O[0] + sc * Math.sqrt(P) * ux[0], O[1] + sc * Math.sqrt(P) * ux[1]];
  const rz = sc * Math.sqrt(s2), Y = [X[0] + rz * uz[0], X[1] + rz * uz[1]];
  let o = text(130, 22, '一次传输：y = x + z', 'tb', 'middle');
  o += circle(X[0], X[1], rz, 'wash') + circle(X[0], X[1], rz, 'mute');
  o += arrow(O[0], O[1], X[0], X[1], 'ink-b') + arrow(X[0], X[1], Y[0], Y[1], 'ln') + arrow(O[0], O[1], Y[0], Y[1], 'dash');
  const c = 9, p1 = [X[0] - c * ux[0], X[1] - c * ux[1]], p2 = [p1[0] + c * uz[0], p1[1] + c * uz[1]], p3 = [X[0] + c * uz[0], X[1] + c * uz[1]];
  o += path(d([p1, p2, p3]), 'mute');
  o += circle(O[0], O[1], 3, 'ink-f') + text(O[0], O[1] + 17, '0', 'ts', 'middle');
  const mx = [(O[0] + X[0]) / 2, (O[1] + X[1]) / 2];
  o += text(mx[0] + 14, mx[1] + 22, 'x', 'tb', 'start');
  o += text(X[0] + rz * uz[0] / 2 + 10, X[1] + rz * uz[1] / 2 + 4, 'z', 'tl', 'start');
  o += text((O[0] + Y[0]) / 2 - 10, (O[1] + Y[1]) / 2 - 4, 'y', 'tb', 'end');
  o += text(150, 70, '‖x‖² ≤ nP', 't', 'start') + text(150, 88, '‖z‖² ≈ nσ²', 't', 'start') + text(150, 106, '‖y‖² ≈ n(P + σ²)', 't', 'start');
  o += text(20, 272, '浅色圆：x 发出后 y 几乎总落在它附近', 'ts', 'start');
  // 右：大 ball 里放 noise ball
  const C = [420, 146], R = 112, k = 6, r = R / k; // r / R = √(σ² / (P + σ²))，P/σ² = k² − 1
  o += text(C[0], 22, 'P/σ² = ' + (k * k - 1) + '：r / R = 1/' + k, 'tb', 'middle');
  o += circle(C[0], C[1], R, 'wash2') + circle(C[0], C[1], R, 'ink');
  const pts = [];
  for (let row = -8; row <= 8; row++) for (let col = -8; col <= 8; col++) {
    const x = C[0] + (col + (row % 2 ? 0.5 : 0)) * 2 * r, y = C[1] + row * r * Math.sqrt(3);
    if (Math.hypot(x - C[0], y - C[1]) <= R - r + 0.5) pts.push([x, y]);
  }
  for (const [x, y] of pts) o += circle(x, y, r - 1.2, 'wash') + circle(x, y, 1.8, 'ink-f');
  o += text(C[0], C[1] + R + 20, '大圆 radius √(n(P+σ²))，小圆 radius √(nσ²)', 'ts', 'middle');
  o += text(C[0], C[1] + R + 36, '平面上上限 (R/r)² = ' + k * k + '，实际放下 ' + pts.length + ' 个', 'ts', 'middle');
  return svg(560, 300, o, '左边是 codeword x、noise z 与收到的 y 组成的 right triangle；右边是在大圆里放互不重叠的小圆，半径之比为六分之一');
}

// ---------- 第 8 站：Reed–Solomon 的 key equation ----------
function rs() {
  const p = 7, Pc = [2, 3, 4], Ec = [1, 1, 1], ev = (c, t) => c.reduce((s, ci, i) => s + ci * t ** i, 0) % p;
  const n = 7, bad = [2, 4], fake = { 2: 6, 4: 3 };
  const Pv = [...Array(n)].map((_, i) => ev(Pc, i)), Rv = Pv.map((v, i) => (i in fake ? fake[i] : v));
  const Ev = [...Array(n)].map((_, i) => ev(Ec, i)), RE = Rv.map((v, i) => (v * Ev[i]) % p), PE = Pv.map((v, i) => (v * Ev[i]) % p);
  if (RE.some((v, i) => v !== PE[i])) throw new Error('rs: key equation fails');
  if (bad.some((i) => Ev[i] !== 0) || Ev.some((v, i) => v === 0 && !bad.includes(i))) throw new Error('rs: E roots');
  const X0 = 170, cw = 44, rows = [
    ['i', [...Array(n)].map((_, i) => i), null],
    ['发出 P(i) = 2 + 3i + 4i²', Pv, null],
    ['收到 Rᵢ', Rv, bad],
    ['E(i) = i² + i + 1', Ev, bad],
    ['Rᵢ · E(i)', RE, null],
    ['P(i) · E(i)', PE, null],
  ];
  let o = text(280, 18, '在 ℤ₇ 里（所有数 mod 7），第 2、4 位被改了', 'tb', 'middle');
  rows.forEach(([lab, vals, hi], r) => {
    const y = 48 + r * 36;
    o += text(X0 - 12, y + 5, lab, r === 0 ? 'ts' : 't', 'end');
    vals.forEach((v, i) => {
      const x = X0 + i * cw;
      if (r === 0) { o += text(x + cw / 2, y + 5, String(v), 'ts', 'middle'); return; }
      const on = hi && hi.includes(i);
      const cls = on ? (r === 2 ? 'solid' : 'wash-strong') : 'paper';
      o += rect(x + 2, y - 13, cw - 4, 26, cls, 4) + text(x + cw / 2, y + 5, String(v), on && r === 2 ? 'tw' : 'tb', 'middle');
    });
  });
  const yb = 48 + 4 * 36, xe = X0 + n * cw + 8;
  o += path(d([[xe, yb - 12], [xe + 8, yb - 12], [xe + 8, yb + 36 + 12], [xe, yb + 36 + 12]]), 'ink');
  o += text(xe + 14, yb + 14, '逐格', 'ts', 'start') + text(xe + 14, yb + 30, '相同', 'ts', 'start');
  o += text(280, 270, '被改的位置 E(i) = 0，那里的错被乘没了；其余位置 Rᵢ = P(i)。所以 Q = P·E 满足 Q(i) = Rᵢ E(i)。', 'ts', 'middle');
  return svg(560, 278, o, 'Reed-Solomon code 在 Z7 上的例子：发出 2 2 3 5 1 5 3，收到 2 2 6 5 3 5 3；error-locator polynomial E 在第 2、4 位为 0，所以 R 乘 E 与 P 乘 E 在七个点上逐格相同');
}

export default {
  'cs3236-tradeoff': tradeoff,
  'cs3236-questions': questions,
  'cs3236-h2': h2,
  'cs3236-kl': kl,
  'cs3236-joint': joint,
  'cs3236-kraft': kraft,
  'cs3236-huffman': huffmanA,
  'cs3236-typical': typicalA,
  'cs3236-bsc': bscA,
  'cs3236-packing': packing,
  'cs3236-hamming': hammingA,
  'cs3236-quant': quant,
  'cs3236-awgn': awgn,
  'cs3236-sphere': sphere,
  'cs3236-rs': rs,
};
