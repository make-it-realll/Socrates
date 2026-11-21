import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// ---- 小工具 ----

// marching squares：返回 fn(x, y) = level 的 contour，作为一个 path 的 d 字符串
function contour(fn, x0, x1, y0, y1, sx, sy, level, n = 140) {
  const X = (i) => x0 + ((x1 - x0) * i) / n, Y = (j) => y0 + ((y1 - y0) * j) / n;
  const v = [];
  for (let i = 0; i <= n; i++) { v.push([]); for (let j = 0; j <= n; j++) v[i].push(fn(X(i), Y(j)) - level); }
  let o = '';
  const cross = (xa, ya, va, xb, yb, vb) => { const s = va / (va - vb); return [xa + s * (xb - xa), ya + s * (yb - ya)]; };
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const c = [[X(i), Y(j), v[i][j]], [X(i + 1), Y(j), v[i + 1][j]], [X(i + 1), Y(j + 1), v[i + 1][j + 1]], [X(i), Y(j + 1), v[i][j + 1]]];
    const pts = [];
    for (let e = 0; e < 4; e++) {
      const a = c[e], b = c[(e + 1) % 4];
      if ((a[2] < 0) !== (b[2] < 0)) pts.push(cross(a[0], a[1], a[2], b[0], b[1], b[2]));
    }
    for (let k = 0; k + 1 < pts.length; k += 2) o += `M${(sx(pts[k][0])).toFixed(1)} ${(sy(pts[k][1])).toFixed(1)}L${(sx(pts[k + 1][0])).toFixed(1)} ${(sy(pts[k + 1][1])).toFixed(1)}`;
  }
  return o;
}

// 只画落在 [ylo, yhi] 里的那部分 curve（可能分成几段）
function clipped(fn, x0, x1, sx, sy, ylo, yhi, n = 300) {
  let o = '', pen = false;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n, y = fn(x);
    if (y >= ylo && y <= yhi) { o += (pen ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + sy(y).toFixed(1); pen = true; } else pen = false;
  }
  return o;
}

// 带底色的标注：压在 contour 上时先垫一块和卡片同色的底
function tw(s, cls) {
  const fs = cls.includes('ts') ? 11.5 : 13, k = cls.includes('tb') || cls.includes('tl') ? 0.62 : 0.57;
  let w = 0;
  for (const ch of s) w += ch.codePointAt(0) > 0x2e80 ? fs : fs * k;
  return w;
}
function hl(x, y, s, cls = 't', anchor = 'start') {
  const w = tw(s, cls), x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const h = cls.includes('ts') ? 14 : 16;
  return rect(x0 - 3, y - h + 3, w + 6, h + 1, 'paper-f', 3) + text(x, y, s, cls, anchor);
}

const sup = (n) => String(n).replace('-', '⁻').split('').map((c) => ('0123456789'.includes(c) ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c] : c)).join('');

// ---- 第 1 站 ----

// x⁴ − 50x² + 100x：gradient descent 停在 local minimum
function quartic() {
  const f = (x) => x ** 4 - 50 * x * x + 100 * x, df = (x) => 4 * x ** 3 - 100 * x + 100;
  const sx = lin(-7, 6.2, 70, 540), sy = lin(-1300, 300, 236, 22);
  let o = axes({ sx, sy, x0: -7, x1: 6.2, y0: -1300, y1: 300, xt: [[-6, '−6'], [-4, '−4'], [-2, '−2'], [0, '0'], [2, '2'], [4, '4'], [6, '6']], yt: [[-1000, '−1000'], [-500, '−500'], [0, '0']], grid: true });
  o += path(clipped(f, -7, 6.2, sx, sy, -1300, 300), 'ink');
  const run = (x0, cls) => {
    let x = x0, s = '';
    for (let k = 0; k < 40; k++) { s += circle(sx(x), sy(f(x)), 2.6, cls); x -= 0.001 * df(x); }
    return { s, x };
  };
  const A = run(3, 'ln-f'), B = run(-3, 'ln-f');
  o += A.s + B.s;
  o += circle(sx(3), sy(f(3)), 5, 'ln paper-f') + circle(sx(-3), sy(f(-3)), 5, 'ln paper-f');
  o += text(sx(3) - 8, sy(f(3)) + 22, '从 x = 3 出发', 'ts', 'end') + text(sx(-3) + 10, sy(f(-3)) + 4, '从 x = −3 出发', 'ts');
  o += circle(sx(4.394), sy(-153.2), 5, 'ink-f') + circle(sx(-5.440), sy(-1147.9), 5, 'ink-f');
  o += text(sx(4.394) + 4, sy(-153.2) + 30, 'local minimum', 'tb', 'middle') + text(sx(4.394) + 4, sy(-153.2) + 46, 'f′ = 0，f = −153.2', 'ts', 'middle');
  o += text(sx(-5.44) + 12, sy(-1147.9) + 4, 'global minimum：f = −1147.9', 'tb');
  o += text(sx(1.046), sy(51) - 12, 'local maximum', 'ts', 'middle');
  return svg(560, 262, o, 'Function x⁴ − 50x² + 100x 的 graph，gradient descent 从 x = 3 出发停在 local minimum 4.394，从 x = −3 出发到达 global minimum −5.440');
}

// first-order condition：tangent 是不是 global underestimator
function tangent() {
  let o = '';
  // 左：logistic loss
  {
    const l = (z) => Math.log(1 + Math.exp(-z));
    const sx = lin(-4, 4, 40, 255), sy = lin(-2.2, 4.4, 220, 40);
    o += line(sx(-4), sy(0), sx(4), sy(0), 'axis') + line(sx(0), sy(-2.2), sx(0), sy(4.4), 'axis');
    o += path(curve(l, -4, 4, sx, sy), 'ink-b') + path(clipped((z) => Math.log(2) - z / 2, -4, 4, sx, sy, -2.2, 4.4), 'ln-dash');
    o += circle(sx(0), sy(Math.log(2)), 4, 'ln-f');
    o += line(sx(-4), sy(l(-4)), sx(-4), sy(Math.log(2) + 2), 'mute') + line(sx(4), sy(l(4)), sx(4), sy(Math.log(2) - 2), 'mute');
    o += text(sx(0.35), sy(3.6), 'ℓ(z) = log(1 + e⁻ᶻ)', 'ts') + text(sx(-0.3), sy(-2.0), 'tangent at z = 0', 'tl');
    o += text(sx(-4) + 4, 240, '−4', 'ts', 'middle') + text(sx(4) - 4, 240, '4', 'ts', 'middle') + text(sx(0), 240, '0', 'ts', 'middle');
    o += text(147, 22, 'convex：tangent 处处在 graph 下方', 'tb', 'middle');
  }
  // 右：quartic
  {
    const f = (x) => x ** 4 - 50 * x * x + 100 * x;
    const sx = lin(-7, 6.2, 315, 535), sy = lin(-1300, 420, 220, 40);
    o += line(sx(-7), sy(0), sx(6.2), sy(0), 'axis') + line(sx(0), sy(-1300), sx(0), sy(420), 'axis');
    o += path(clipped(f, -7, 6.2, sx, sy, -1300, 420), 'ink-b') + path(clipped((x) => 51 + 4 * (x - 1), -7, 6.2, sx, sy, -1300, 420), 'ln-dash');
    o += circle(sx(1), sy(51), 4, 'ln-f');
    o += line(sx(-5.44), sy(-1147.9), sx(-5.44), sy(25.2), 'ln');
    o += text(sx(-5.44) + 7, sy(-560), 'tangent 比', 'ts') + text(sx(-5.44) + 7, sy(-560) + 16, 'f 高 1173', 'ts');
    o += text(sx(-6.9), sy(170), 'tangent at x = 1', 'tl');
    o += text(sx(-5.44), 240, '−5.44', 'ts', 'middle') + text(sx(1), 240, '1', 'ts', 'middle');
    o += text(425, 22, 'nonconvex：tangent 穿过 graph', 'tb', 'middle');
  }
  return svg(560, 252, o, '左图 logistic loss 在 z 等于 0 处的 tangent 处处在 graph 下方；右图 quartic 在 x 等于 1 处的 tangent 在 x 等于 −5.44 处比 graph 高出 1173');
}

// ---- 第 2 站 ----

function subgrad() {
  let o = '';
  {
    const sx = lin(-1.5, 1.5, 40, 250), sy = lin(-0.8, 1.6, 215, 40);
    o += line(sx(-1.5), sy(0), sx(1.5), sy(0), 'axis') + line(sx(0), sy(-0.8), sx(0), sy(1.6), 'axis');
    for (const g of [-1, -0.5, 0, 0.5, 1]) o += path(clipped((x) => g * x, -1.5, 1.5, sx, sy, -0.8, 1.6), 'ln-dash');
    o += path(clipped((x) => 1.6 * x, -1.5, 1.5, sx, sy, -0.8, 1.6), 'mute');
    o += path(curve((x) => Math.abs(x), -1.5, 1.5, sx, sy), 'ink-b');
    o += text(145, 238, '虚线：slope ∈ [−1, 1]，都在 |x| 下方', 'ts', 'middle');
    o += text(145, 256, '灰线：slope 1.6，穿过 graph，不是 subgradient', 'ts', 'middle');
    o += text(145, 22, '∂|x| (0) = [−1, 1]', 'tb', 'middle');
  }
  {
    const sx = lin(-3, 3, 320, 535), sy = lin(-2.4, 2.4, 225, 40);
    o += rect(sx(-1), sy(2.4), sx(1) - sx(-1), sy(-2.4) - sy(2.4), 'wash');
    o += line(sx(-3), sy(0), sx(3), sy(0), 'axis') + line(sx(0), sy(-2.4), sx(0), sy(2.4), 'axis');
    o += path(clipped((v) => v, -3, 3, sx, sy, -2.4, 2.4), 'dash');
    const S = (v) => Math.sign(v) * Math.max(Math.abs(v) - 1, 0);
    o += path(curve(S, -3, 3, sx, sy, 600), 'ln');
    o += circle(sx(0.8), sy(0), 4, 'ink-f') + circle(sx(2.5), sy(1.5), 4, 'ink-f');
    o += text(sx(-1), 240, '−λ', 'ts', 'middle') + text(sx(1), 240, 'λ', 'ts', 'middle');
    o += text(sx(-2.9), sy(2.0), 'S', 'tl') + text(sx(-2.9) + 10, sy(2.0), '(v)，λ = 1', 'ts');
    o += text(428, 258, '黑点：v = 0.8 → 0，v = 2.5 → 1.5', 'ts', 'middle');
    o += text(428, 22, 'Soft-thresholding', 'tb', 'middle');
  }
  return svg(560, 266, o, '左图：过 absolute value function 的 kink、slope 在 −1 到 1 之间的 line 都在 graph 下方；右图：soft-thresholding function，绝对值不超过 λ 的输入被压成 0');
}

// ---- 第 3 站 ----

// least squares 的 contour 与两种 step size 的 gradient descent path
function gdpath() {
  const H = [[6, 5], [5, 6]], c = [17, 16], bs = [2, 1];
  let o = '';
  const panel = (x0, t, title, note) => {
    const sx = lin(0.2, 3.8, x0, x0 + 240), sy = lin(-0.7, 2.7, 262, 35);
    o += rect(x0, 35, 240, 227, 'frame');
    const e1 = [Math.SQRT1_2, Math.SQRT1_2], e2 = [Math.SQRT1_2, -Math.SQRT1_2];
    for (const lv of [0.05, 0.25, 0.75, 2.25]) {
      const a = Math.sqrt((2 * lv) / 11), b = Math.sqrt(2 * lv), pts = [];
      for (let i = 0; i <= 160; i++) { const th = (2 * Math.PI * i) / 160; pts.push([sx(bs[0] + a * Math.cos(th) * e1[0] + b * Math.sin(th) * e2[0]), sy(bs[1] + a * Math.cos(th) * e1[1] + b * Math.sin(th) * e2[1])]); }
      o += path(d(pts) + 'Z', 'grid');
    }
    let b = [0.5, 2];
    const P = [b];
    for (let k = 0; k < 12; k++) { const g = [H[0][0] * b[0] + H[0][1] * b[1] - c[0], H[1][0] * b[0] + H[1][1] * b[1] - c[1]]; b = [b[0] - t * g[0], b[1] - t * g[1]]; P.push(b); }
    o += path(d(P.map(([u, v]) => [sx(u), sy(v)])), 'ln');
    for (const [u, v] of P) o += circle(sx(u), sy(v), 2.6, 'ln-f');
    o += circle(sx(0.5), sy(2), 4.5, 'ln paper-f') + circle(sx(2), sy(1), 4, 'ink-f');
    o += text(sx(2) + 8, sy(1) + 16, 'β*', 'tb');
    o += text(x0 + 120, 24, title, 'tb', 'middle') + text(x0 + 120, 282, note, 'ts', 'middle');
  };
  panel(30, 1 / 11, 't = 1/11', '先落到 valley 底，再每步乘 10/11');
  panel(300, 0.17, 't = 0.17', '沿 (1, 1) 每步乘 −0.87，来回跳');
  return svg(560, 292, o, 'Least squares 的 contour 上两条 gradient descent 的 path：step size 1/11 时先落到 valley 底再沿 valley 前进，step size 0.17 时在 valley 两壁之间来回跳');
}

// ---- 第 4 站 ----

// lasso 的 contour 上 ISTA 与 subgradient method 的 path
function ista() {
  const X = [[2, 1], [1, 2], [1, 1]], y = [6, 5, 0], lam = 14;
  const F = (b1, b2) => { let s = 0; for (let i = 0; i < 3; i++) { const r = X[i][0] * b1 + X[i][1] * b2 - y[i]; s += r * r; } return 0.5 * s + lam * (Math.abs(b1) + Math.abs(b2)); };
  const sx = lin(-0.1, 1.0, 50, 303), sy = lin(-0.3, 0.9, 296, 20);
  let o = rect(50, 20, 253, 276, 'frame');
  for (const lv of [0.02, 0.08, 0.2, 0.4, 0.75, 1.2]) o += path(contour(F, -0.1, 1.0, -0.3, 0.9, sx, sy, 29.75 + lv), 'grid');
  o += line(sx(-0.1), sy(0), sx(1.0), sy(0), 'axis') + line(sx(0), sy(-0.3), sx(0), sy(0.9), 'axis');
  // subgradient method，t_k = 0.05/√k
  const grad = (b) => [6 * b[0] + 5 * b[1] - 17, 5 * b[0] + 6 * b[1] - 16];
  let b = [0, 0];
  const SG = [b];
  for (let k = 1; k <= 300; k++) { const g = grad(b); const s = [g[0] + lam * Math.sign(b[0]), g[1] + lam * Math.sign(b[1])]; b = [b[0] - (0.05 / Math.sqrt(k)) * s[0], b[1] - (0.05 / Math.sqrt(k)) * s[1]]; SG.push(b); }
  const inside = (p) => p[0] >= -0.1 && p[0] <= 1.0 && p[1] >= -0.3 && p[1] <= 0.9;
  o += path(d(SG.filter(inside).map(([u, v]) => [sx(u), sy(v)])), 'mute');
  for (const p of SG.slice(0, 8)) if (inside(p)) o += circle(sx(p[0]), sy(p[1]), 2, 'mute-f');
  // ISTA
  const S = (v, k) => Math.sign(v) * Math.max(Math.abs(v) - k, 0);
  b = [0, 0];
  const IS = [b];
  for (let k = 0; k < 12; k++) { const g = grad(b); b = [S(b[0] - g[0] / 11, lam / 11), S(b[1] - g[1] / 11, lam / 11)]; IS.push(b); }
  o += path(d(IS.map(([u, v]) => [sx(u), sy(v)])), 'ln');
  for (const p of IS) o += circle(sx(p[0]), sy(p[1]), 3, 'ln-f');
  o += circle(sx(0.5), sy(0), 4.5, 'ink-f');
  o += hl(sx(0.5) + 4, sy(0) + 22, 'β* = (½, 0)', 'tb');
  o += hl(sx(0) + 6, sy(0.86), 'β₂', 'ts') + hl(sx(0.97), sy(0) - 7, 'β₁', 'ts', 'end');
  const tx = 325;
  o += line(tx, 60, tx + 26, 60, 'ln') + text(tx + 34, 64, 'ISTA，t = 1/11', 't');
  o += line(tx, 84, tx + 26, 84, 'mute') + text(tx + 34, 88, 'subgradient method', 't') + text(tx + 34, 104, 't = 0.05 / √k，300 步', 'ts');
  o += text(tx, 144, 'ISTA 第 7 步落到 β₂ = 0', 't') + text(tx, 164, '这条 axis 上，之后沿 axis', 't') + text(tx, 184, '走向 β*。', 't');
  o += text(tx, 216, 'Subgradient method 慢慢降到', 't') + text(tx, 236, 'axis，一越过就被推回上方，', 't') + text(tx, 256, '如此反复，β₂ 不会恰好是 0。', 't');
  return svg(560, 306, o, 'Lasso objective 的 contour 上，ISTA 的 iterate 落到 beta2 等于 0 的 axis 上后沿 axis 走到 minimizer，subgradient method 的 iterate 慢慢降到 axis、越过后又被推回上方');
}

// 狭长 quadratic 上 gradient descent 与 Nesterov acceleration 的比较
function accel() {
  const L1 = 100, t = 0.01, K = 700;
  const f = (x) => 0.5 * (L1 * x[0] * x[0] + x[1] * x[1]);
  const gdv = [], nv = [];
  let x = [1, 1];
  for (let k = 0; k <= K; k++) { gdv.push(f(x)); x = [x[0] - t * L1 * x[0], x[1] - t * x[1]]; }
  x = [1, 1]; let xp = [1, 1]; nv.push(f(x));
  for (let k = 1; k <= K; k++) {
    const m = k > 1 ? (k - 2) / (k + 1) : 0;
    const v = [x[0] + m * (x[0] - xp[0]), x[1] + m * (x[1] - xp[1])];
    xp = x; x = [v[0] - t * L1 * v[0], v[1] - t * v[1]]; nv.push(f(x));
  }
  const sx = lin(0, K, 70, 540), sy = lin(-12, 1, 228, 20);
  let o = axes({ sx, sy, x0: 0, x1: K, y0: -12, y1: 1, xt: [0, 100, 200, 300, 400, 500, 600, 700], yt: [[0, '1'], [-3, '10' + sup(-3)], [-6, '10' + sup(-6)], [-9, '10' + sup(-9)], [-12, '10' + sup(-12)]], xl: 'k', grid: true });
  const ser = (arr) => d(arr.map((v, k) => [sx(k), sy(Math.max(Math.log10(Math.max(v, 1e-13)), -12))]));
  o += path(ser(gdv), 'ink-b') + path(ser(nv), 'ln');
  o += line(sx(0), sy(-6), sx(K), sy(-6), 'mute');
  o += line(sx(101), sy(-6), sx(101), sy(0.3), 'ln-dash') + line(sx(653), sy(-6), sx(653), sy(0.3), 'dash');
  o += text(sx(101) + 5, sy(0.25), 'k = 101', 'tl') + text(sx(653) - 5, sy(0.25), 'k = 653', 'tb', 'end');
  o += text(sx(430), sy(-2.75), 'gradient descent', 'tb') + text(sx(430), sy(-2.75) + 16, '每步乘 0.9801', 'ts');
  o += text(sx(130), sy(-1.0), 'Nesterov：快，但有周期性的上升', 'tl');
  o += text(70, 12, 'f − f*（log scale）', 'ts');
  return svg(560, 262, o, '在 condition number 为 100 的 quadratic 上，gradient descent 用 653 步把 objective error 降到 10 的 −6 次方，Nesterov 只用 101 步，但 curve 有周期性的上升');
}

// ---- 第 5 站 ----

// 用 SGD 求 (1, 2, 4, 7, 11) 的 mean：两种 step size
const IDX = '34210020131411343333141131434024302404212443422340130314123424222423023402024242102121021244013134313331341123300320120012113411441021211331432140433032444232432442022022321111212011042022040300403002';
function sgd() {
  const a = [1, 2, 4, 7, 11];
  const run = (rule) => { let x = 0; const xs = [0]; for (let k = 1; k <= 200; k++) { x = x - rule(k) * (x - a[+IDX[k - 1]]); xs.push(x); } return xs; };
  const A = run((k) => 1 / k), B = run(() => 0.5);
  const sx = lin(0, 200, 60, 540), sy = lin(0, 12, 236, 52);
  let o = axes({ sx, sy, x0: 0, x1: 200, y0: 0, y1: 12, xt: [0, 50, 100, 150, 200], yt: [0, 5, 10], xl: 'k', grid: true });
  o += line(sx(0), sy(5), sx(200), sy(5), 'dash');
  o += path(d(B.slice(1).map((v, i) => [sx(i + 1), sy(v)])), 'mute') + path(d(A.slice(1).map((v, i) => [sx(i + 1), sy(v)])), 'ln');
  o += line(60, 18, 84, 18, 'ln') + text(90, 22, 't = 1/k：就是 sample mean', 't');
  o += line(290, 18, 314, 18, 'mute') + text(320, 22, 't = 0.5：std 停在约 2.1', 't');
  o += line(60, 38, 84, 38, 'dash') + text(90, 42, 'mean = 5', 't');
  o += text(320, 42, '纵轴：第 k 步的 x', 'ts');
  return svg(560, 278, o, '同一串随机 sample 上的 SGD：step size 1/k 时 x 越来越稳地靠近 mean 5，step size 0.5 时一直在 5 附近大幅摆动');
}

// 3|x1 − x2| + ½(x1 + x2 − 2)²：coordinate descent 卡在 (0, 0)
function stuck() {
  const f = (a, b) => 3 * Math.abs(a - b) + 0.5 * (a + b - 2) ** 2;
  const sx = lin(-0.8, 1.8, 50, 300), sy = lin(-0.8, 1.8, 290, 40);
  let o = rect(50, 40, 250, 250, 'frame');
  for (const lv of [0.1, 0.5, 1, 2, 3, 4.5]) o += path(contour(f, -0.8, 1.8, -0.8, 1.8, sx, sy, lv, 160), lv === 2 ? 'ink' : 'grid');
  o += line(sx(-0.8), sy(-0.8), sx(1.8), sy(1.8), 'dash');
  o += line(sx(-0.8), sy(0), sx(1.8), sy(0), 'axis') + line(sx(0), sy(-0.8), sx(0), sy(1.8), 'axis');
  const O = [sx(0), sy(0)];
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) o += arrow(O[0], O[1], O[0] + 34 * dx, O[1] - 34 * dy, 'mute');
  o += arrow(O[0], O[1], sx(1) - 4, sy(1) + 4, 'ln');
  o += circle(O[0], O[1], 4.5, 'ink-f') + circle(sx(1), sy(1), 4.5, 'ln-f');
  o += hl(O[0] - 8, O[1] + 22, '(0, 0)，f = 2', 'tb', 'end');
  o += hl(sx(1) + 10, sy(1) + 20, '(1, 1)，f = 0', 'tl');
  o += hl(sx(0.08), sy(-0.68), '虚线：kink x₁ = x₂', 'ts');
  const tx = 322;
  o += text(tx, 80, '粗线是 f = 2 的 contour。', 't');
  o += text(tx, 112, '灰色箭头：只动一个 coordinate，', 't') + text(tx, 132, '四个方向 f 都变大。', 't');
  o += text(tx, 164, '彩色箭头：两个 coordinate', 't') + text(tx, 184, '一起动，沿 diagonal 下降。', 't');
  o += text(tx, 216, 'Coordinate descent 停在 (0, 0)。', 't');
  return svg(560, 300, o, 'Function 3 倍 x1 减 x2 的 absolute value 加二分之一倍 x1 加 x2 减 2 的平方的 contour：在原点沿两个 coordinate 方向都上升，沿 diagonal 方向可以下降到 (1, 1)');
}

// ---- 第 6 站 ----

// x² s.t. x ≥ 1：Lagrangian 的 minimum 都在 f* 下方
function dual() {
  let o = '';
  {
    const sx = lin(-0.5, 2.5, 50, 260), sy = lin(-0.6, 4.2, 228, 30);
    o += rect(sx(1), 30, sx(2.5) - sx(1), 198, 'wash');
    o += line(sx(-0.5), sy(0), sx(2.5), sy(0), 'axis') + line(sx(0), sy(-0.6), sx(0), sy(4.2), 'axis');
    o += line(sx(-0.5), sy(1), sx(2.5), sy(1), 'dash') + text(sx(-0.45), sy(1) + 15, 'f* = 1', 'ts');
    for (const u of [1, 2, 3]) {
      o += path(clipped((x) => x * x + u * (1 - x), -0.5, 2.5, sx, sy, -0.6, 4.2), u === 2 ? 'ln' : 'mute');
      o += circle(sx(u / 2), sy(u - (u * u) / 4), 3.5, u === 2 ? 'ln-f' : 'mute-f');
    }
    o += path(clipped((x) => x * x, -0.5, 2.5, sx, sy, -0.6, 4.2), 'ink-b');
    o += text(sx(1.75), 48, 'f(x) = x²', 'tb', 'end');
    o += text(sx(1.04), sy(3.1), 'feasible', 'ts') + text(sx(1.04), sy(3.1) + 14, 'x ≥ 1', 'ts');
    o += text(sx(2.37) + 4, 48, 'u = 1', 'ts') + text(sx(2.5) + 4, sy(3.25) + 4, 'u = 2', 'tl') + text(sx(2.5) + 4, sy(1.75) + 4, 'u = 3', 'ts');
    o += text(155, 14, 'L(x, u) = x² + u(1 − x)', 'tb', 'middle');
    o += text(sx(2.5), 246, 'x', 'ts', 'end');
  }
  {
    const sx = lin(0, 4.5, 320, 535), sy = lin(-0.4, 1.4, 228, 30);
    o += line(sx(0), sy(0), sx(4.5), sy(0), 'axis') + line(sx(0), sy(-0.4), sx(0), sy(1.4), 'axis');
    o += line(sx(0), sy(1), sx(4.5), sy(1), 'dash') + text(sx(4.5), sy(1) - 6, 'f* = 1', 'ts', 'end');
    o += path(clipped((u) => u - (u * u) / 4, 0, 4.5, sx, sy, -0.4, 1.4), 'ln');
    for (const u of [1, 2, 3]) o += circle(sx(u), sy(u - (u * u) / 4), 3.5, u === 2 ? 'ln-f' : 'mute-f');
    o += text(sx(2), sy(1) - 8, 'u* = 2', 'tl', 'middle');
    o += text(427, 266, 'g(1) = g(3) = 0.75，g(2) = 1', 'ts', 'middle');
    for (const u of [1, 2, 3, 4]) o += text(sx(u), 246, String(u), 'ts', 'middle');
    o += text(427, 14, 'g(u) = u − u² / 4', 'tb', 'middle');
  }
  return svg(560, 274, o, '左图：f 等于 x 平方和三个 multiplier 下的 Lagrangian，每条 Lagrangian 的 minimum 都不超过 f* 等于 1；右图：dual function g(u) 在 u 等于 2 处达到 1');
}

// KKT：投影到 x1 + x2 ≤ 2、x2 ≥ 0
function kkt() {
  const sx = lin(-0.3, 3.8, 40, 330), sy = lin(-0.6, 2.6, 262, 36);
  let o = poly([[sx(-0.3), sy(0)], [sx(2), sy(0)], [sx(-0.3), sy(2.3)]], 'wash');
  o += line(sx(-0.3), sy(0), sx(3.8), sy(0), 'axis') + line(sx(0), sy(-0.6), sx(0), sy(2.6), 'axis');
  o += line(sx(-0.3), sy(2.3), sx(2.6), sy(-0.6), 'ink-b');
  const p = [3, 2];
  for (const r of [0.8, 1.5, Math.sqrt(4.5), 2.7]) {
    let s = '', pen = false;
    for (let i = 0; i <= 240; i++) {
      const th = (2 * Math.PI * i) / 240, x = p[0] + r * Math.cos(th), y = p[1] + r * Math.sin(th);
      if (x >= -0.3 && x <= 3.8 && y >= -0.6 && y <= 2.6) { s += (pen ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + sy(y).toFixed(1); pen = true; } else pen = false;
    }
    o += path(s, Math.abs(r - Math.sqrt(4.5)) < 1e-9 ? 'ink' : 'grid');
  }
  const xs = [1.5, 0.5];
  o += arrow(sx(xs[0]), sy(xs[1]), sx(xs[0] + 1.0), sy(xs[1] + 1.0), 'ln');
  o += arrow(sx(xs[0]), sy(xs[1]), sx(xs[0] + 0.33), sy(xs[1] + 0.33), 'ink-b');
  o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink-f') + circle(sx(xs[0]), sy(xs[1]), 4.5, 'ln-f');
  o += hl(sx(p[0]) + 8, sy(p[1]) - 6, 'p = (3, 2)', 'tb');
  o += text(sx(xs[0]) - 8, sy(xs[1]) + 22, 'x* = (1.5, 0.5)', 'tb', 'end');
  o += hl(sx(2.55), sy(1.47), '−∇f(x*) = (3, 3)', 'tl');
  o += hl(sx(1.9), sy(0.62), '∇h₁ = (1, 1)', 'ts');
  o += text(sx(-0.2), sy(1.2), 'feasible set', 'ts');
  const tx = 350;
  o += text(tx, 70, 'Active：x₁ + x₂ ≤ 2', 't') + text(tx, 90, 'u₁ = 3', 'tl');
  o += text(tx, 122, 'Inactive：x₂ ≥ 0', 't') + text(tx, 142, 'u₂ = 0', 'tl');
  o += text(tx, 182, 'Stationarity：', 't') + text(tx, 202, '−∇f(x*) = u₁ ∇h₁', 'tb');
  o += text(tx, 236, '同心 circle 是 f 的 contour', 'ts');
  return svg(560, 278, o, 'KKT 的几何：在最优点 x* 处，objective 的 negative gradient 恰好是 active constraint 的 normal 的 3 倍');
}

// ---- 第 7 站 ----

function tv() {
  const y = [1.0, 1.4, 0.7, 1.1, 3.2, 2.6, 3.1, 2.9];
  const sx = lin(0.5, 8.5, 60, 540), sy = lin(0, 3.6, 222, 24);
  let o = axes({ sx, sy, x0: 0.5, x1: 8.5, y0: 0, y1: 3.6, xt: [1, 2, 3, 4, 5, 6, 7, 8], yt: [0, 1, 2, 3], grid: true });
  o += line(sx(0.6), sy(1.05), sx(4.4), sy(1.05), 'dash') + line(sx(4.6), sy(2.95), sx(8.4), sy(2.95), 'dash');
  o += path(d([[sx(0.6), sy(1.175)], [sx(4.5), sy(1.175)], [sx(4.5), sy(2.825)], [sx(8.4), sy(2.825)]]), 'ln');
  for (let i = 0; i < 8; i++) o += line(sx(i + 1), sy(y[i]), sx(i + 1), sy(i < 4 ? 1.175 : 2.825), 'mute') + circle(sx(i + 1), sy(y[i]), 4.5, 'ink-f');
  o += text(sx(2.5), sy(1.175) - 30, 'θ = 1.175', 'tl', 'middle');
  o += text(sx(6.5), sy(2.825) + 40, 'θ = 2.825', 'tl', 'middle');
  o += text(300, 262, '虚线是两段读数各自的 mean（1.05 与 2.95），penalty 把两段各向对方拉近 λ / 4 = 0.125', 'ts', 'middle');
  return svg(560, 272, o, '8 个带 noise 的读数和 total variation denoising 的结果：结果是 piecewise constant 的，只在第 4 和第 5 个点之间跳一次');
}

// ---- 开头第二、三次计算用的 data ----
const DX = [[2, 1], [1, 2], [1, 1]], DY = [6, 5, 0];
const lsGrad = (b) => { const r = DX.map((x, i) => x[0] * b[0] + x[1] * b[1] - DY[i]); return [0, 1].map((j) => r.reduce((a, ri, i) => a + DX[i][j] * ri, 0)); };
const lsF = (b) => DX.reduce((a, x, i) => a + (x[0] * b[0] + x[1] * b[1] - DY[i]) ** 2, 0) / 2;
const logAxis = (sx, sy, x0, x1, ys, xt, xl) => {
  let o = line(sx(x0), sy(ys[0]), sx(x1), sy(ys[0]), 'axis') + line(sx(x0), sy(ys[0]), sx(x0), sy(ys[ys.length - 1]), 'axis');
  for (const e of ys) o += line(sx(x0), sy(e), sx(x1), sy(e), 'grid') + text(sx(x0) - 7, sy(e) + 4, e === 0 ? '1' : '10' + String(e).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]), 'ts', 'end');
  for (const [v, lab] of xt) o += line(sx(v), sy(ys[0]), sx(v), sy(ys[0]) + 4, 'axis') + text(sx(v), sy(ys[0]) + 17, lab, 'ts', 'middle');
  return o + text(sx(x1), sy(ys[0]) + 34, xl, 'ts', 'end');
};

// 开头第二次：step size 0.17 与 0.19
function twosteps() {
  const sx = lin(0, 100, 70, 460), sy = lin(-12, 10, 240, 40);
  let o = logAxis(sx, sy, 0, 100, [-10, -5, 0, 5, 10], [0, 20, 40, 60, 80, 100].map((v) => [v, String(v)]), 'k（步数）');
  const run = (t) => { let b = [0, 0]; const pts = [[sx(0), sy(Math.log10(lsF(b) - 5.5))]]; for (let k = 1; k <= 100; k++) { const g = lsGrad(b); b = [b[0] - t * g[0], b[1] - t * g[1]]; pts.push([sx(k), sy(Math.log10(lsF(b) - 5.5))]); } return [pts, lsF(b) - 5.5]; };
  const [p1, e1] = run(0.17), [p2, e2] = run(0.19);
  o += path(d(p1), 'ln') + path(d(p2), 'ink');
  o += circle(...p1[100], 3.5, 'ln-f') + circle(...p2[100], 3.5, 'ink-f');
  o += text(p1[100][0] + 8, p1[100][1] + 4, e1.toExponential(1).replace('e-', '×10⁻').replace('11', '¹¹'), 'tl');
  o += text(p2[100][0] + 8, p2[100][1] + 4, '7.6×10⁸', 'tb');
  o += text(sx(30), sy(6.5), 't = 0.19：diverge', 'tb') + text(sx(30), sy(-7.2), 't = 0.17：converge', 'tl');
  o += text(70, 24, 'f(βₖ) − f*（log scale），从 β₀ = (0, 0) 出发', 'ts');
  return svg(560, 282, o, '同一个 least squares，step size 0.17 时 objective error 一路降到 2×10^-11，0.19 时一路涨到 7.6×10^8');
}

// 开头第三次：subgradient method 与 proximal gradient method 在同一个 lasso 上
function twomethods() {
  const lam = 14, Fs = 29.75, F = (b) => lsF(b) + lam * (Math.abs(b[0]) + Math.abs(b[1]));
  const sx = lin(0, 3, 70, 500), sy = lin(-12.5, 0.5, 240, 40);
  let o = logAxis(sx, sy, 0, 3, [-12, -9, -6, -3, 0], [[0, '1'], [1, '10'], [2, '100'], [3, '1000']], 'k（步数，log scale）');
  let b = [0, 0], best = F(b); const ps = [];
  for (let k = 1; k <= 1000; k++) { const g = lsGrad(b).map((v, j) => v + lam * Math.sign(b[j])), t = 0.05 / Math.sqrt(k); b = [b[0] - t * g[0], b[1] - t * g[1]]; best = Math.min(best, F(b)); ps.push([sx(Math.log10(k)), sy(Math.log10(best - Fs))]); }
  const S = (v, a) => Math.sign(v) * Math.max(Math.abs(v) - a, 0);
  let c = [0, 0]; const pi = [];
  for (let k = 1; k <= 20; k++) { const g = lsGrad(c); c = c.map((v, j) => S(v - g[j] / 11, lam / 11)); pi.push([sx(Math.log10(k)), sy(Math.log10(F(c) - Fs))]); }
  o += path(d(ps), 'ink') + path(d(pi), 'ln');
  o += circle(...ps[999], 3.5, 'ink-f') + circle(...pi[19], 3.5, 'ln-f');
  o += text(ps[999][0] - 6, ps[999][1] + 20, '1000 步：1.0×10⁻³', 'tb', 'end');
  o += text(pi[19][0] + 8, pi[19][1] + 4, '20 步：3.2×10⁻¹²', 'tl');
  o += text(sx(1.5), sy(-0.15), 'subgradient method', 'tb') + text(sx(0.55), sy(-8.5), 'proximal gradient method', 'tl');
  o += text(70, 24, 'F(βₖ) − F*（log scale），lasso，λ = 14', 'ts');
  return svg(560, 282, o, '同一个 lasso：subgradient method 1000 步后 error 还有 10^-3，proximal gradient method 20 步就到了 3×10^-12');
}

// 第 2 站：derivative 处处不为 0，minimum 在 kink 上
function kink() {
  const phi = (b) => 0.5 * (b - 0.8) ** 2 + Math.abs(b), sm = (b) => 0.5 * (b - 0.8) ** 2;
  const sx = lin(-1.2, 1.8, 60, 520), sy = lin(-0.1, 2.6, 250, 40);
  let o = axes({ sx, sy, x0: -1.2, x1: 1.8, y0: -0.1, y1: 2.6, xt: [[-1, '−1'], [0, '0'], [0.8, '0.8'], [1.5, '1.5']], yt: [[0.32, '0.32'], [1, '1'], [2, '2']], xl: 'β', xAt: 0, yAt: -1.2 });
  o += path(curve(sm, -1.2, 1.8, sx, sy), 'dash') + path(curve(phi, -0.99, 1.8, sx, sy, 400), 'ln');
  o += circle(sx(0), sy(phi(0)), 4, 'ln-f') + circle(sx(0.8), sy(0), 3.5, 'paper');
  const stub = (m, dir) => line(sx(0), sy(0.32), sx(dir * 0.45), sy(0.32 + m * dir * 0.45), 'ink-b');
  o += stub(-1.8, -1) + stub(0.2, 1);
  o += text(sx(-0.45) - 4, sy(1.13) + 4, '−1.8', 'tb', 'end') + text(sx(0.45) + 4, sy(0.41) + 4, '+0.2', 'tb');
  o += text(sx(-0.08), sy(0.32) + 16, 'minimum 在 kink 上', 'tl', 'end');
  o += text(280, 290, '虚线：½(β − 0.8)²，minimum 在 0.8（空心点）；彩线：再加上 |β|，就是 φ(β)。', 'ts', 'middle');
  o += text(280, 308, 'β &lt; 0 时 slope 是 β − 1.8 &lt; 0，β &gt; 0 时是 β + 0.2 &gt; 0：derivative 处处不为 0。', 'ts', 'middle');
  return svg(560, 318, o, 'phi(β)=½(β−0.8)²+|β|：左边一直下降、右边一直上升，两侧 slope 都不为 0，minimum 落在 β=0 的 kink 上');
}

// 第 2 站的错想法：沿 negative subgradient 走，objective 反而变大
function badsubgrad() {
  const s = 80, sx = (x) => 230 + s * x, sy = (y) => 150 - s * y;
  let o = line(sx(-2.5), sy(0), sx(2.6), sy(0), 'axis') + line(sx(0), sy(-1.2), sx(0), sy(1.35), 'axis');
  o += text(sx(2.6), sy(0) + 16, 'x₁', 'ts', 'end') + text(sx(0) + 8, sy(1.35) + 6, 'x₂', 'ts');
  for (const c of [1, 2.2]) {
    const pts = [[c, 0], [0, c / 2], [-c, 0], [0, -c / 2]].map(([a, b]) => [sx(a), sy(b)]);
    o += poly(pts, c === 1 ? 'ink' : 'ln-dash');
  }
  const Q = [0.6, -0.8];
  o += arrow(sx(1), sy(0), sx(1.25), sy(0.5), 'mute') + arrow(sx(1), sy(0), sx(Q[0]), sy(Q[1]), 'ln');
  o += circle(sx(1), sy(0), 4, 'ink-f');
  o += text(sx(1) + 8, sy(0) + 18, 'x', 'tb') + text(sx(1.25) + 6, sy(0.5) + 4, 'g', 'tb') + text(sx(Q[0]) + 8, sy(Q[1]) + 16, 'x − 0.4g', 'tl');
  o += text(sx(-0.6), sy(0.35), 'c = 1', 'ts', 'end') + text(sx(-1.4), sy(0.6), 'c = 2.2', 'tl', 'end');
  o += text(280, 268, 'contour 是 |x₁| + 2|x₂| = c。x = (1, 0) 在 c = 1 上；g = (1, 2) 是它的一个 subgradient。', 'ts', 'middle');
  o += text(280, 286, '沿 −g 走 t，f = 1 + 3t：走 0.4 就到了 c = 2.2，step 多小都上升。', 'ts', 'middle');
  return svg(560, 296, o, 'f 等于 |x1|+2|x2| 的 contour 是菱形；在 (1,0) 处取 subgradient (1,2)，沿 -g 走 0.4 到达 f=2.2 的 contour');
}

// 第 6 站：hard-margin SVM 的 8 个点与 support vector
function svm() {
  const s = 46, sx = (x) => 70 + s * (x + 0.5), sy = (y) => 260 - s * (y + 0.5);
  let o = line(sx(-0.5), sy(0), sx(4.6), sy(0), 'axis') + line(sx(0), sy(-0.5), sx(0), sy(4.6), 'axis');
  for (let v = 1; v <= 4; v++) o += text(sx(v), sy(0) + 16, String(v), 'ts', 'middle') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  const L = (c, cls) => { const xa = Math.max(-0.5, c - 4.6), xb = Math.min(4.6, c + 0.5); return line(sx(xa), sy(c - xa), sx(xb), sy(c - xb), cls); };
  o += L(2, 'dash') + L(3, 'ln') + L(4, 'dash');
  const pos = [[2, 2], [3, 2], [2, 3], [3, 4]], neg = [[1, 1], [0, 0], [1, 0], [0, 1]];
  for (const [a, b] of pos) o += circle(sx(a), sy(b), 5, 'ink-f');
  for (const [a, b] of neg) o += circle(sx(a), sy(b), 5, 'paper');
  o += circle(sx(2), sy(2), 10, 'ln') + circle(sx(1), sy(1), 10, 'ln');
  o += text(sx(2.5), sy(-0.5) + 15, '−1', 'ts', 'middle') + text(sx(3.5), sy(-0.5) + 15, '0', 'tl', 'middle') + text(sx(4.5), sy(-0.5) + 15, '1', 'ts', 'middle');
  const tx = 340;
  o += text(tx, 56, 'w = (1, 1)，b = −3', 'tb');
  o += text(tx, 82, '实心：+1 类；空心：−1 类', 'ts');
  o += text(tx, 104, '线下端的数是 w·x + b 的值；', 'ts') + text(tx, 122, '虚线上 yᵢ(w·xᵢ + b) = 1', 'ts');
  o += text(tx, 150, '只有 (2, 2) 和 (1, 1) 落在虚线上，', 'ts');
  o += text(tx, 170, 'complementary slackness 只允许', 'ts');
  o += text(tx, 190, '它们的 αᵢ > 0：support vector', 'tl');
  o += text(tx, 220, '其余 6 个点删掉，solution 不变。', 'ts');
  return svg(560, 290, o, '8 个点的 hard-margin SVM：分界线 x1+x2=3，两条 margin x1+x2=2 和 4；只有 (2,2) 与 (1,1) 落在 margin 上，是 support vector');
}

export default {
  'dsa3102-twosteps': twosteps,
  'dsa3102-twomethods': twomethods,
  'dsa3102-kink': kink,
  'dsa3102-badsubgrad': badsubgrad,
  'dsa3102-svm': svm,
  'dsa3102-quartic': quartic,
  'dsa3102-tangent': tangent,
  'dsa3102-subgrad': subgrad,
  'dsa3102-gdpath': gdpath,
  'dsa3102-ista': ista,
  'dsa3102-accel': accel,
  'dsa3102-sgd': sgd,
  'dsa3102-stuck': stuck,
  'dsa3102-dual': dual,
  'dsa3102-kkt': kkt,
  'dsa3102-tv': tv,
};
