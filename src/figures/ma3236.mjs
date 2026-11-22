import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
// marching squares：返回 level set 的线段（path d）
function contour(fn, x0, x1, y0, y1, level, sx, sy, nx = 120, ny = 120) {
  const dx = (x1 - x0) / nx, dy = (y1 - y0) / ny;
  const V = [];
  for (let i = 0; i <= nx; i++) { V.push([]); for (let j = 0; j <= ny; j++) V[i].push(fn(x0 + i * dx, y0 + j * dy) - level); }
  let out = '';
  const P = (x, y) => f1(sx(x)) + ' ' + f1(sy(y));
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const xa = x0 + i * dx, ya = y0 + j * dy;
    const a = V[i][j], b = V[i + 1][j], c = V[i + 1][j + 1], e = V[i][j + 1];
    const pts = [];
    const ed = (va, vb, pa, pb) => { if ((va < 0) !== (vb < 0)) { const t = va / (va - vb); pts.push([pa[0] + t * (pb[0] - pa[0]), pa[1] + t * (pb[1] - pa[1])]); } };
    ed(a, b, [xa, ya], [xa + dx, ya]);
    ed(b, c, [xa + dx, ya], [xa + dx, ya + dy]);
    ed(c, e, [xa + dx, ya + dy], [xa, ya + dy]);
    ed(e, a, [xa, ya + dy], [xa, ya]);
    if (pts.length === 2) out += 'M' + P(...pts[0]) + 'L' + P(...pts[1]);
    else if (pts.length === 4) out += 'M' + P(...pts[0]) + 'L' + P(...pts[1]) + 'M' + P(...pts[2]) + 'L' + P(...pts[3]);
  }
  return out;
}
const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const sci = (v) => { if (v >= 0.001) return String(+v.toPrecision(3)); const e = Math.floor(Math.log10(v)), m = v / 10 ** e; return (+m.toPrecision(3)) + ' × 10⁻' + String(-e).split('').map((ch) => SUP[ch]).join(''); };
const num = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// 一组 frame：第 i 个 <g> 只在第 i 帧显示（discrete），第一帧是静态图
function frames(list, dur) {
  const N = list.length, kt = list.map((_, i) => i / N);
  return list.map((body, i) => `<g opacity="${i === 0 ? 1 : 0}">${ashow(list.map((_, j) => j === i), kt, dur)}${body}</g>`).join('');
}
// 渐进动图：第 0 帧显示全部（静态截图看到的样子），第 j≥1 帧显示到第 j−1 步为止
function prog(k, N, dur, body) {
  const kt = Array.from({ length: N }, (_, j) => j / N);
  return `<g opacity="1">${ashow(kt.map((_, j) => j === 0 || j >= k + 1), kt, dur)}${body}</g>`;
}
function only(k, N, dur, body) {
  const kt = Array.from({ length: N }, (_, j) => j / N);
  return `<g opacity="0">${ashow(kt.map((_, j) => j === k + 1), kt, dur)}${body}</g>`;
}
// 带底色的标注：压在 level curve 上也能读
function lab(x, y, str, cls = 'ts', anchor = 'start') {
  const w = [...str.replace(/<[^>]+>/g, '')].reduce((a, ch) => a + (ch.charCodeAt(0) > 0x2e80 ? 13 : 6.6), 0) + 6;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w + 3 : x - 3;
  return rect(x0, y - 12, w, 16, 'paper-f', 3) + text(x, y, str, cls, anchor);
}
// 从第 i 帧起一直显示
function from(i, N, dur, body) {
  const kt = Array.from({ length: N }, (_, j) => j / N);
  return `<g opacity="${i === 0 ? 1 : 0}">${ashow(kt.map((_, j) => j >= i), kt, dur)}${body}</g>`;
}

const cubic = (x, y) => x ** 3 - 3 * x + y * y;

// ---------- 开头 1：x³ − 3x + y² ----------
function cubicMap(extra = '') {
  const X0 = -2.6, X1 = 2.2, Y0 = -1.5, Y1 = 1.5;
  const sx = lin(X0, X1, 30, 420), sy = lin(Y0, Y1, 258, 14);
  let o = rect(30, 14, 390, 244, 'frame');
  for (const L of [-8, -4, -1.6, -1, 0, 1, 3, 4.5]) o += path(contour(cubic, X0, X1, Y0, Y1, L, sx, sy), 'mute');
  o += path(contour(cubic, X0, X1, Y0, Y1, 2, sx, sy), 'ink');
  o += line(sx(X0), sy(0), sx(X1), sy(0), 'grid');
  o += lab(sx(-2.38), sy(0.25), '−8', 'ts', 'middle') + lab(sx(1), sy(0.5) + 4, '−1.6', 'ts', 'middle');
  o += lab(sx(-1) - 4, sy(-0.95), '2', 'ts', 'end');
  o += circle(sx(1), sy(0), 4.5, 'ink-f') + circle(sx(-1), sy(0), 4.5, 'paper');
  o += extra;
  const T = 436;
  o += text(T, 40, '(1, 0)', 'tb') + text(T, 58, 'local minimum', 'ts') + text(T, 74, 'f = −2', 'ts');
  o += text(T, 112, '(−1, 0)', 'tb') + text(T, 130, 'saddle point', 'ts') + text(T, 146, 'f = 2（粗线）', 'ts');
  o += text(T, 186, '往左 f → −∞', 'tb') + text(T, 204, 'f(−3, 0) = −18', 'ts');
  o += arrow(sx(-1.6), sy(-1.25), sx(-2.45), sy(-1.25), 'ink');
  o += lab(sx(-2.0), sy(-1.25) - 10, 'f 下降', 'ts', 'middle');
  return { o, sx, sy };
}
function cubicFig() {
  const { o } = cubicMap();
  return svg(560, 268, o, 'f 等于 x 的三次方减 3x 加 y 平方的 level curve：(1,0) 是 local minimum，(-1,0) 是 saddle point，往左 f 趋于负无穷');
}

// ---------- 开头 2：x² + 10y² 的 zigzag ----------
function zigintro() {
  const sx = lin(-0.6, 11, 30, 530), sy = lin(-1.25, 1.25, 150, 42);
  let o = '';
  let p = [10, 1];
  const pts = [p];
  for (let k = 0; k < 8; k++) { const g = [2 * p[0], 20 * p[1]]; const a = (g[0] ** 2 + g[1] ** 2) / (2 * g[0] ** 2 + 20 * g[1] ** 2); p = [p[0] - a * g[0], p[1] - a * g[1]]; pts.push(p); }
  for (const q of pts.slice(0, 5)) o += path(contour((x, y) => x * x + 10 * y * y, -0.6, 11, -1.25, 1.25, q[0] ** 2 + 10 * q[1] ** 2, sx, sy, 200, 60), 'grid');
  o += line(sx(-0.6), sy(0), sx(11), sy(0), 'axis');
  o += path(d(pts.map(([x, y]) => [sx(x), sy(y)])), 'ln');
  for (const q of pts) o += circle(sx(q[0]), sy(q[1]), 3, 'ln-f');
  o += circle(sx(0), sy(0), 4, 'ink-f') + text(sx(0), sy(0) + 20, 'minimum', 'ts', 'middle');
  o += text(sx(10), sy(1) - 9, '起点 (10, 1)', 'ts', 'middle');
  o += text(30, 18, 'f = x² + 10y²，每步沿 −∇f 走到这条 line 上的最低点', 'tb');
  o += text(530, 18, '第 1 到第 8 步', 'ts', 'end');
  o += text(280, 178, '每一步只把 f 乘 0.669：35 步后才降到起点的 10⁻⁶', 'ts', 'middle');
  return svg(560, 186, o, 'f 等于 x 平方加 10 倍 y 平方，从 (10,1) 出发的 steepest descent 前 8 步在狭长的 ellipse 里来回折返');
}

// ---------- 开头 3：Kuhn–Tucker 的尖角（简图） ----------
function cuspRegion(sx, sy) {
  const top = [];
  for (let i = 0; i <= 80; i++) { const x = i / 80; top.push([sx(x), sy((1 - x) ** 3)]); }
  return path(d([[sx(0), sy(0)], ...top, [sx(1), sy(0)]]) + 'Z', 'wash') + path(d(top), 'ink');
}
function cuspintro() {
  const sx = lin(-0.15, 1.5, 40, 370), sy = lin(-0.25, 1.1, 250, 20);
  let o = line(sx(-0.15), sy(0), sx(1.5), sy(0), 'axis') + line(sx(0), sy(-0.25), sx(0), sy(1.1), 'axis');
  o += cuspRegion(sx, sy);
  o += text(sx(0.25), sy(0.2), 'feasible', 'ts', 'middle');
  o += text(sx(0.38), sy(0.42), 'y = (1 − x)³', 'ts', 'start');
  o += circle(sx(1), sy(0), 4.5, 'ink-f');
  o += arrow(sx(1), sy(0), sx(1.38), sy(0), 'ln') + text(sx(1.38), sy(0) + 20, '−∇f = (1, 0)', 'tl', 'end');
  o += text(sx(1) + 6, sy(0) - 10, '(1, 0)', 'ts', 'start');
  o += text(sx(1.5), sy(-0.12) + 4, 'x', 'ts', 'end') + text(sx(0) + 6, sy(1.08), 'y', 'ts', 'start');
  const T = 392;
  o += text(T, 70, 'max x 的答案是尖角 (1, 0)', 'tb');
  o += text(T, 96, '可是 −∇f 是 horizontal 的，', 'ts') + text(T, 114, '两个 active constraint 的', 'ts') + text(T, 132, 'gradient 是 (0, 1)、(0, −1)，', 'ts');
  o += text(T, 150, '凑不出 (1, 0)', 'ts');
  return svg(560, 262, o, 'Feasible region 0 小于等于 y 小于等于 (1-x) 的三次方，在 (1,0) 收成尖角；optimal point 处 -∇f 水平向右');
}

// ---------- 第 1 站：Hessian 给出的局部形状 ----------
function quadFig() {
  let o = '';
  const panel = (x0, fn, levels, title, sub, cls = 'ink') => {
    const W = 160, sx = lin(-1, 1, x0, x0 + W), sy = lin(-1, 1, 196, 36);
    o += rect(x0, 36, W, 160, 'frame');
    for (const L of levels) o += path(contour(fn, -1, 1, -1, 1, L, sx, sy, 90, 90), cls);
    o += line(x0, sy(0), x0 + W, sy(0), 'grid') + line(sx(0), 36, sx(0), 196, 'grid');
    o += circle(sx(0), sy(0), 3.5, 'ink-f');
    o += text(x0 + W / 2, 18, title, 'tb', 'middle') + text(x0 + W / 2, 216, sub, 'ts', 'middle');
    return { sx, sy };
  };
  panel(20, (u, v) => 3 * u * u + v * v, [0.15, 0.5, 1.1, 2], '(1, 0)：diag(6, 2)', 'PD：ellipse，strict local min');
  panel(200, (u, v) => -3 * u * u + v * v, [-1.5, -0.6, -0.15, 0.15, 0.6], '(−1, 0)：diag(−6, 2)', 'indefinite：hyperbola，saddle');
  const p3 = panel(380, (u, v) => u * u, [0.04, 0.25, 0.64], '只是 PSD：diag(2, 0)', 'v 方向的 quadratic 是 0');
  o += arrow(p3.sx(0), p3.sy(-0.2), p3.sx(0), p3.sy(-0.85), 'ln') + arrow(p3.sx(0), p3.sy(0.2), p3.sx(0), p3.sy(0.85), 'ln');
  o += lab(p3.sx(0.1), p3.sy(0.62), '看不见', 'tl', 'start');
  o += text(280, 242, '每个 panel 画的是 ½ dᵀ∇²f d 的 level curve，d = 离 stationary point 的位移', 'ts', 'middle');
  return svg(560, 250, o, '三个 quadratic form 的 level curve：PD 时是 ellipse，indefinite 时是 hyperbola，PSD 时沿一个方向是常数');
}

// ---------- 第 2 站：golden section 动图 ----------
function goldenA() {
  const h = (x) => Math.exp(x) - 2 * x, tau = (Math.sqrt(5) - 1) / 2;
  const sx = lin(0, 2, 40, 520), sy = lin(0.55, 1.45, 210, 40);
  let o = '';
  // 曲线（只画 h ≤ 1.45 的部分）
  const pts = [];
  for (let i = 0; i <= 300; i++) { const x = (2 * i) / 300, y = h(x); if (y <= 1.45) pts.push([sx(x), sy(y)]); }
  o += line(40, 210, 520, 210, 'axis');
  for (const v of [0, 0.5, 1, 1.5, 2]) o += line(sx(v), 210, sx(v), 214, 'axis') + text(sx(v), 228, String(v), 'ts', 'middle');
  o += line(36, sy(0.6), 40, sy(0.6), 'axis') + text(33, sy(0.6) + 4, '0.6', 'ts', 'end') + line(36, sy(1), 40, sy(1), 'axis') + text(33, sy(1) + 4, '1.0', 'ts', 'end');
  // 迭代
  let a = 0, b = 2, x1 = b - tau * (b - a), x2 = a + tau * (b - a), f1 = h(x1), f2 = h(x2), newIs = 'both';
  const F = [];
  for (let k = 1; k <= 8; k++) {
    let g = '';
    if (a > 0) g += rect(sx(0), 40, sx(a) - sx(0), 170, 'wash2');
    if (b < 2) g += rect(sx(b), 40, sx(2) - sx(b), 170, 'wash2');
    g += rect(sx(a), 236, sx(b) - sx(a), 8, 'solid');
    for (const [x, fx, isNew] of [[x1, f1, newIs === 'both' || newIs === 1], [x2, f2, newIs === 'both' || newIs === 2]]) {
      g += line(sx(x), 210, sx(x), sy(Math.min(fx, 1.45)), 'dash');
      g += circle(sx(x), sy(Math.min(fx, 1.45)), 4.5, isNew ? 'paper' : 'ink-f');
    }
    g += text(40, 20, `第 ${k} 轮：[${a.toFixed(4)}, ${b.toFixed(4)}]，长度 ${(b - a).toFixed(4)}`, 'tb');
    g += text(520, 20, k === 1 ? '两个点都是新算的' : '空心点是这一轮新算的', 'ts', 'end');
    F.push(g);
    if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - tau * (b - a); f1 = h(x1); newIs = 1; }
    else { a = x1; x1 = x2; f1 = f2; x2 = a + tau * (b - a); f2 = h(x2); newIs = 2; }
  }
  o += path(d(pts), 'ln');
  o += text(sx(1.62), sy(1.3), 'h(x) = eˣ − 2x', 'tl', 'start');
  o += frames(F, 12);
  o += line(sx(Math.log(2)), 250, sx(Math.log(2)), 258, 'ink') + text(sx(Math.log(2)), 272, 'x* = ln 2', 'ts', 'middle');
  return svgA(560, 280, o, '动图：golden section search 在 [0,2] 上对 e 的 x 次方减 2x 走 8 轮，每轮扔掉一段，interval 乘 0.618，只新算一个点');
}

// ---------- 第 3 站：steepest descent 动图（Freund Example 4.5） ----------
function sdA() {
  const Q = [[4, -2], [-2, 2]], b = [-2, 2];
  const f = (x, y) => 2 * x * x - 2 * x * y + y * y + 2 * x - 2 * y;
  const pts = [[0, 0]];
  let p = [0, 0];
  for (let k = 0; k < 8; k++) {
    const g = [Q[0][0] * p[0] + Q[0][1] * p[1] - b[0], Q[1][0] * p[0] + Q[1][1] * p[1] - b[1]];
    const dd = [-g[0], -g[1]], Qd = [Q[0][0] * dd[0] + Q[0][1] * dd[1], Q[1][0] * dd[0] + Q[1][1] * dd[1]];
    const a = (dd[0] ** 2 + dd[1] ** 2) / (dd[0] * Qd[0] + dd[1] * Qd[1]);
    p = [p[0] + a * dd[0], p[1] + a * dd[1]]; pts.push(p);
  }
  const s = 220, sx = (x) => 150 + s * x, sy = (y) => 262 - s * y; // 等比例
  const X0 = -0.6, X1 = 0.5, Y0 = -0.08, Y1 = 1.12;
  let o = '';
  for (const k of [0, 1, 2, 3]) o += path(contour(f, X0, X1, Y0, Y1, f(...pts[k]), sx, sy, 140, 140), 'grid');
  o += line(sx(X0), sy(0), sx(X1), sy(0), 'axis') + line(sx(0), sy(Y0), sx(0), sy(Y1), 'axis');
  o += text(sx(X1), sy(0) + 16, 'x₁', 'ts', 'end') + text(sx(0) - 6, sy(Y1) + 10, 'x₂', 'ts', 'end');
  o += circle(sx(0), sy(1), 4.5, 'ink-f') + lab(sx(0) + 10, sy(1) + 4, 'x* = (0, 1)', 'ts', 'start');
  const N = 10, dur = 12;
  for (let k = 1; k <= 8; k++) o += prog(k, N, dur, line(sx(pts[k - 1][0]), sy(pts[k - 1][1]), sx(pts[k][0]), sy(pts[k][1]), 'ln') + circle(sx(pts[k][0]), sy(pts[k][1]), 3, 'ln-f'));
  o += circle(sx(0), sy(0), 3.5, 'ln-f') + text(sx(0) + 8, sy(0) + 16, 'x₀ = (0, 0)', 'ts', 'start');
  const P1 = pts[1], u0 = [-1 / Math.SQRT2, 1 / Math.SQRT2], u1 = [1 / Math.SQRT2, 1 / Math.SQRT2], m = 0.045;
  o += prog(2, N, dur, path(d([[sx(P1[0] - u0[0] * m), sy(P1[1] - u0[1] * m)], [sx(P1[0] - u0[0] * m + u1[0] * m), sy(P1[1] - u0[1] * m + u1[1] * m)], [sx(P1[0] + u1[0] * m), sy(P1[1] + u1[1] * m)]]), 'ink'));
  const T = 330;
  o += text(T, 30, 'k', 'tb') + text(T + 24, 30, 'x_k', 'tb') + text(T + 220, 30, 'f − f*', 'tb', 'end');
  for (let k = 0; k <= 8; k++) {
    const y = 54 + k * 22, q = pts[k];
    const row = text(T, y, String(k), 't') + text(T + 24, y, `(${num(Math.abs(q[0]) < 1e-12 ? 0 : q[0], 4)}, ${q[1].toFixed(4)})`, 't') + text(T + 220, y, sci(f(...q) + 1), 't', 'end');
    o += prog(k, N, dur, row);
  }
  o += text(T, 268, '每一步 gap 乘 0.2；α 在 0.2 和 1 之间交替', 'ts');
  return svgA(560, 280, o, '动图：steepest descent 在 2x1²−2x1x2+x2²+2x1−2x2 上从 (0,0) 出发走 8 步，每一段与上一段 perpendicular，逐步逼近 (0,1)');
}

// ---------- 第 4 站：一元 Newton（f' 的 tangent） ----------
function newton1dA() {
  const fp = (x) => 7 - 1 / x, fpp = (x) => 1 / (x * x);
  let o = '';
  const N = 5, dur = 9;
  const panel = (x0px, X0, X1, Y0, Y1, start, steps, title, above, below) => {
    const W = 240, sx = lin(X0, X1, x0px, x0px + W), sy = lin(Y0, Y1, 230, 40);
    o += rect(x0px, 40, W, 190, 'frame');
    o += line(x0px, sy(0), x0px + W, sy(0), 'axis');
    if (X0 < 0) o += line(sx(0), 40, sx(0), 230, 'dash') + text(sx(0) + 4, 56, 'x = 0', 'ts', 'start');
    const pts = [];
    for (let i = 0; i <= 300; i++) { const x = Math.max(X0, 0.001) + ((X1 - Math.max(X0, 0.001)) * i) / 300, y = fp(x); if (y >= Y0 && y <= Y1) pts.push([sx(x), sy(y)]); }
    o += path(d(pts), 'ink');
    o += line(sx(1 / 7), sy(0) - 4, sx(1 / 7), sy(0) + 4, 'ink');
    for (const [v, t] of above) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), sy(0) - 8, t, 'ts', 'middle');
    for (const [v, t] of below) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), sy(0) + 18, t, 'ts', 'middle');
    o += text(x0px + W / 2, 24, title, 'tb', 'middle');
    let x = start;
    o += circle(sx(x), sy(0), 3.5, 'ln-f');
    for (let k = 1; k <= steps; k++) {
      const y = fp(x), xn = x - y / fpp(x);
      let g = line(sx(x), sy(0), sx(x), sy(y), 'dash') + circle(sx(x), sy(y), 3, 'ink-f');
      const ext = (X1 - X0) * 0.03, tA = Math.max(X0, Math.min(xn, x) - ext), tB = Math.min(X1, Math.max(xn, x) + ext);
      g += line(sx(tA), sy(y + fpp(x) * (tA - x)), sx(tB), sy(y + fpp(x) * (tB - x)), 'ln');
      g += circle(sx(xn), sy(0), 3.5, 'ln-f');
      o += prog(k, N, dur, g);
      x = xn;
    }
    return { sx, sy };
  };
  const L = panel(30, 0.08, 0.2, -6.5, 2.5, 0.1, 3, '从 x₀ = 0.1 出发', [[0.1, '0.1'], [0.13, '0.13']], [[0.2, '0.2']]);
  o += text(L.sx(1 / 7) + 5, L.sy(0) + 18, '1/7', 'ts', 'start');
  o += text(L.sx(0.155), L.sy(1.75), 'f′(x) = 7 − 1/x', 'ts', 'end');
  const R = panel(300, -0.08, 0.4, -6.5, 5, 0.3, 1, '从 x₀ = 0.3 出发', [], [[0.3, '0.3']]);
  o += text(R.sx(-0.03) - 8, R.sy(0) + 18, '−0.03', 'ts', 'end');
  o += prog(1, N, dur, lab(R.sx(-0.03) + 6, R.sy(-3.4), '落到 domain 外', 'tl', 'start'));
  o += text(280, 256, '每个新点是 tangent 与横轴的交点：x_{k+1} = 2x_k − 7x_k²', 'ts', 'middle');
  return svgA(560, 266, o, '动图：对 f 的 derivative 7 减 1/x 做 Newton–Raphson。从 0.1 出发三步逼近 1/7；从 0.3 出发，tangent 很平，第一步就落到 0 的左边');
}

// ---------- 第 4 站：二元 Newton 走向 saddle ----------
function newton2d() {
  const steps = (p) => { const out = [p]; for (let k = 0; k < 3; k++) { p = [(p[0] ** 2 + 1) / (2 * p[0]), 0]; out.push(p); } return out; };
  const A = steps([-0.5, 0.5]), B = steps([0.5, 0.5]);
  let extra = '';
  const sx = lin(-2.6, 2.2, 30, 420), sy = lin(-1.5, 1.5, 258, 14);
  for (const P of [A, B]) {
    for (let k = 1; k < P.length; k++) extra += arrow(sx(P[k - 1][0]), sy(P[k - 1][1]), sx(P[k][0]), sy(P[k][1]), 'ln', 6);
    extra += circle(sx(P[0][0]), sy(P[0][1]), 4, 'ln-f');
  }
  extra += lab(sx(-0.5), sy(0.5) - 11, '(−0.5, 0.5)', 'ts', 'middle') + lab(sx(0.5), sy(0.5) - 11, '(0.5, 0.5)', 'ts', 'middle');
  extra += lab(sx(-1.3), sy(-0.5), 'f：1.625 → 1.797', 'tl', 'middle');
  extra += lab(sx(1.25), sy(-0.62), 'f：−1.125 → −1.797', 'ts', 'middle');
  const { o } = cubicMap(extra);
  return svg(560, 268, o, 'Newton method 在 x³−3x+y² 上：从 (0.5,0.5) 走到 minimum (1,0)；从 (-0.5,0.5) 第一步 f 上升，最后停在 saddle point (-1,0)');
}

// ---------- 第 5 站：xy 在 circle 上 ----------
function lagrangeFig() {
  const s = 62, cx = 180, cy = 150, sx = (x) => cx + s * x, sy = (y) => cy - s * y;
  const R = 2.25;
  let o = '';
  for (const c of [-1, -0.4, 0.4, 1]) {
    for (const sg of [1, -1]) {
      const pts = [];
      for (let i = 0; i <= 200; i++) { const x = sg * (0.05 + ((R - 0.05) * i) / 200), y = c / x; if (Math.abs(y) <= R) pts.push([sx(x), sy(y)]); }
      o += path(d(pts), Math.abs(c) === 1 ? 'ink' : 'mute');
    }
  }
  o += line(sx(-R), sy(0), sx(R), sy(0), 'grid') + line(sx(0), sy(-R), sx(0), sy(R), 'grid');
  const circ = []; for (let i = 0; i <= 160; i++) { const t = (2 * Math.PI * i) / 160; circ.push([sx(Math.SQRT2 * Math.cos(t)), sy(Math.SQRT2 * Math.sin(t))]); }
  o += path(d(circ) + 'Z', 'ln');
  for (const [x, y] of [[1, 1], [-1, -1], [1, -1], [-1, 1]]) {
    const gh = [2 * x * 0.32, 2 * y * 0.32], gf = [y * 0.5, x * 0.5];
    o += arrow(sx(x), sy(y), sx(x + gh[0]), sy(y + gh[1]), 'ln', 6);
    o += arrow(sx(x), sy(y), sx(x + gf[0]), sy(y + gf[1]), 'ink-b', 6);
    o += circle(sx(x), sy(y), 3.5, 'ink-f');
  }
  o += lab(sx(1.7), sy(-1.7) + 4, '∇h', 'tl', 'start') + lab(sx(0.5) - 4, sy(-0.5) + 14, '∇f', 'tb', 'end');
  o += lab(sx(1) + 10, sy(1) + 16, '(1, 1)', 'ts', 'start') + lab(sx(1) + 10, sy(-1) - 8, '(1, −1)', 'ts', 'start');
  o += text(sx(-2.2), sy(2.05), 'xy = −1', 'ts', 'start') + text(sx(0.6), sy(2.05), 'xy = 1', 'ts', 'start');
  const T = 350;
  o += text(T, 50, 'Circle：x² + y² = 2（彩色）', 'tb');
  o += text(T, 76, '黑色箭头 ∇f = (y, x)', 'ts') + text(T, 94, '彩色箭头 ∇h = (2x, 2y)', 'ts');
  o += text(T, 130, '(1, 1)、(−1, −1)：同向，λ = −½', 't') + text(T, 150, 'f = 1，maximum', 'ts');
  o += text(T, 186, '(1, −1)、(−1, 1)：反向，λ = ½', 't') + text(T, 206, 'f = −1，minimum', 'ts');
  return svg(560, 300, o, 'Circle x²+y²=2 与 xy 的 level curve 在四个点相切；在这些点 ∇f 与 ∇h 共线');
}

// ---------- 第 5 站：y² = x³ 的尖角 ----------
function cuspeq() {
  const s = 120, sx = (x) => 120 + s * x, sy = (y) => 100 - s * y;
  let o = line(sx(-0.6), sy(0), sx(1.4), sy(0), 'axis') + line(sx(0), sy(-0.7), sx(0), sy(0.7), 'axis');
  const pts = []; for (let i = -100; i <= 100; i++) { const y = (0.68 * i) / 100; pts.push([sx(Math.abs(y) ** (2 / 3)), sy(y)]); }
  o += path(d(pts), 'ln');
  o += circle(sx(0), sy(0), 4, 'ink-f') + arrow(sx(0), sy(0), sx(0.45), sy(0), 'ink-b');
  o += text(sx(0) - 8, sy(0) - 8, '∇f = (1, 0)', 't', 'end');
  o += text(sx(0.78), sy(0.6), 'y² = x³', 'tl', 'start');
  const T = 330;
  o += text(T, 50, 'Minimum 在 origin', 'tb') + text(T, 74, '那里 ∇h = (−3x², 2y) = (0, 0)', 'ts');
  o += text(T, 98, '∇f + λ∇h = (1, 0) ≠ 0，对任何 λ', 'ts') + text(T, 122, 'curve 在尖角处只能往右走', 'ts');
  return svg(560, 196, o, 'Curve y²=x³ 在 origin 有尖角，∇h 为零，Lagrange condition 无解');
}

// ---------- 第 6 站：分情况解 KKT ----------
function kktcase() {
  const s = 76, sx = (x) => 186 + s * x, sy = (y) => 336 - s * y;
  let o = '';
  const reg = [];
  for (let i = 0; i <= 60; i++) { const x = -2 + (3 * i) / 60; reg.push([sx(x), sy(x * x)]); }
  o += path(d(reg) + 'Z', 'wash');
  for (const r of [1, 2, 3]) o += path(contour((x, y) => (x - 2) ** 2 + (y - 1) ** 2, -2.4, 2.4, -0.3, 4.3, r * r, sx, sy, 160, 160), r === 1 ? 'ink' : 'mute');
  const par = []; for (let i = 0; i <= 80; i++) { const x = -2.07 + (3.87 * i) / 80; par.push([sx(x), sy(x * x)]); }
  o += path(d(par), 'ink');
  o += line(sx(-2.3), sy(4.3), sx(2.3), sy(-0.3), 'ink');
  o += line(sx(-2.4), sy(0), sx(2.4), sy(0), 'axis');
  o += lab(sx(1.62), sy(2.75), 'y = x²', 'ts', 'start') + text(sx(-1.0), sy(3.5), 'x + y = 2', 'ts', 'start');
  const P = [[2, 1, 'a', 9, 5], [1.1654, 1.3581, 'b', -7, -7], [1.5, 0.5, 'c', 9, 5], [-2, 4, 'd', 10, 4]];
  for (const [x, y, t, dx, dy] of P) o += circle(sx(x), sy(y), 4, 'paper') + lab(sx(x) + dx, sy(y) + dy, t, 'tb', dx < 0 ? 'end' : 'start');
  o += circle(sx(1), sy(1), 4.5, 'ink-f');
  const k = 0.25;
  o += arrow(sx(1), sy(1), sx(1 + 2 * k), sy(1), 'ln') + text(sx(1 + 2 * k) + 4, sy(1) + 5, '−∇f', 'tl', 'start');
  o += arrow(sx(1), sy(1), sx(1 + 2 * k), sy(1 - k), 'ink', 6) + text(sx(1.2), sy(0.78) + 8, '∇g₁', 'ts', 'end');
  o += arrow(sx(1), sy(1), sx(1 + 0.22), sy(1 + 0.22), 'ink', 6) + text(sx(1.22) + 5, sy(1.22) + 8, '∇g₂', 'ts', 'start');
  o += lab(sx(1) - 8, sy(1) + 4, '(1, 1)', 'tb', 'end');
  const T = 400;
  o += text(T, 40, '浅色：feasible region', 'tb');
  o += text(T, 62, '圆：f 的 level curve', 'ts') + text(T, 80, 'center (2, 1)', 'ts');
  o += text(T, 116, 'a (2, 1)', 't') + text(T, 136, 'b (1.17, 1.36)', 't') + text(T, 156, 'c (1.5, 0.5)', 't');
  o += text(T, 176, '都不 feasible', 'ts');
  o += text(T, 206, 'd (−2, 4)：μ < 0', 't');
  o += text(T, 240, '实心点 (1, 1)：', 'tb') + text(T, 258, '唯一的 KKT point', 'ts');
  o += text(T, 290, '−∇f = (2, 0)', 't') + text(T, 310, '= ⅔ ∇g₁ + ⅔ ∇g₂', 't');
  return svg(560, 360, o, 'KKT 分情况：feasible region 夹在 parabola 与 line 之间，五个 candidate 中只有 (1,1) 是 KKT point，-∇f 在两个 active gradient 的 cone 里');
}

// ---------- 第 6 站：一元的三个 KKT point ----------
function kkt1d() {
  const sx = lin(-1.6, 2.6, 40, 520), sy = lin(-5, 0.6, 210, 40);
  let o = rect(sx(-1), 40, sx(2) - sx(-1), 170, 'wash');
  o += line(sx(-1.6), sy(0), sx(2.6), sy(0), 'axis');
  for (const v of [-1, 1, 2]) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), sy(0) - 8, v < 0 ? '−1' : String(v), 'ts', 'middle');
  o += path(curve((x) => -x * x, -1.6, 2.3, sx, sy), 'mute');
  o += path(curve((x) => -x * x, -1, 2, sx, sy), 'ink-b');
  o += circle(sx(-1), sy(-1), 4.5, 'ink-f') + circle(sx(0), sy(0), 4.5, 'paper') + circle(sx(2), sy(-4), 4.5, 'ink-f');
  o += arrow(sx(-1), sy(-1), sx(-1.45), sy(-1), 'ln') + text(sx(-1) + 10, sy(-1) + 24, 'x = −1，μ₁ = 2：local min', 'ts', 'start');
  o += text(sx(0), sy(0) - 14, 'x = 0：f′ = 0，但是 maximum', 'ts', 'middle');
  o += arrow(sx(2), sy(-4), sx(2.45), sy(-4), 'ln') + text(sx(2) - 10, sy(-4) + 20, 'x = 2，μ₂ = 4：global min', 'ts', 'end');
  o += text(sx(2.05), sy(-2.6), 'f = −x²', 'ts', 'start');
  o += text(280, 232, '浅色是 feasible interval [−1, 2]；彩色箭头是 −f′，两端都指向 interval 外面', 'ts', 'middle');
  return svg(560, 240, o, 'f 等于负 x 平方在 [-1,2] 上的三个 KKT point：两个端点是 local minimum，x=0 是 maximum');
}

// ---------- 第 6 站：cusp 与它的 linearization ----------
function cuspFig() {
  let o = '';
  const panel = (x0, title, sub, lin_) => {
    const sx = lin(-0.15, 1.5, x0, x0 + 230), sy = lin(-0.45, 1.05, 210, 40);
    o += line(sx(-0.15), sy(0), sx(1.5), sy(0), 'axis') + line(sx(0), sy(-0.45), sx(0), sy(1.05), 'axis');
    if (!lin_) o += cuspRegion(sx, sy);
    else {
      o += line(sx(0), sy(0), sx(1.48), sy(0), 'ln');
      o += line(sx(0), sy(0.02) - 1, sx(0), sy(0.02) - 1, 'ln');
      o += text(sx(0.45), sy(0) - 10, '往右也 feasible', 'tl', 'middle');
    }
    o += circle(sx(1), sy(0), 4, 'ink-f');
    o += arrow(sx(1), sy(0), sx(1), sy(0.4), 'ink', 6) + text(sx(1) + 6, sy(0.4) + 4, '∇g₁ = (0, 1)', 'ts', 'start');
    o += arrow(sx(1), sy(0), sx(1), sy(-0.4), 'ink', 6) + text(sx(1) + 6, sy(-0.4) + 4, '∇g₃ = (0, −1)', 'ts', 'start');
    o += arrow(sx(1), sy(0), sx(1.4), sy(0), 'ln', 7) + text(sx(1.42), sy(0) - 8, '−∇f', 'tl', 'end');
    o += text(x0 + 115, 22, title, 'tb', 'middle') + text(x0 + 115, 232, sub, 'ts', 'middle');
  };
  panel(30, '真实的 feasible region', '(1, 0) 右边没有 feasible point', false);
  panel(300, 'Active constraint 换成 tangent', 'y ≤ 0 且 y ≥ 0：整条 x-axis（x ≥ 0）', true);
  return svg(560, 242, o, '左：真实 feasible region 在 (1,0) 收成尖角；右：把 active constraint linearize 后 feasible set 变成 x 轴，可以往右走');
}

// ---------- 第 7 站：Lagrangian 的 saddle point ----------
function saddleFig() {
  const Lf = (t, m) => 2 * t * t + m * (2 - 2 * t);
  const sx = lin(0, 2, 60, 330), sy = lin(0, 4, 262, 30);
  let o = rect(60, 30, 270, 232, 'frame');
  for (const c of [0.5, 1, 1.5, 2.5, 3, 4, 5.5]) o += path(contour(Lf, 0, 2, 0, 4, c, sx, sy, 140, 140), 'mute');
  o += path(contour(Lf, 0, 2, 0, 4, 2, sx, sy, 140, 140), 'ink');
  o += line(sx(0), sy(0), sx(2), sy(4), 'ln');
  o += circle(sx(1), sy(2), 5, 'ink-f');
  for (const v of [0, 1, 2]) o += line(sx(v), 262, sx(v), 266, 'axis') + text(sx(v), 280, String(v), 'ts', 'middle');
  for (const v of [0, 2, 4]) o += line(56, sy(v), 60, sy(v), 'axis') + text(53, sy(v) + 4, String(v), 'ts', 'end');
  o += text(330, 296, 't（x = y = t）', 'ts', 'end') + text(46, 18, 'μ', 'ts', 'start');
  o += lab(sx(1.72) + 8, sy(3.1), 't = μ/2', 'tl', 'start');
  o += text(sx(1) + 9, sy(2) + 18, '(1, 2)', 'tb', 'start');
  const T = 352;
  o += text(T, 50, 'L = 2t² + μ(2 − 2t)', 'tb');
  o += text(T, 80, '粗线是 L = 2：t = 1 和 μ = t + 1', 'ts') + text(T, 98, '两条 line，交于 saddle point', 'ts');
  o += text(T, 134, '横着走（固定 μ = 2）：', 't') + text(T, 152, 'L = 2(t − 1)² + 2，最小在 t = 1', 'ts');
  o += text(T, 188, '竖着走（固定 t = 1）：', 't') + text(T, 206, 'L ≡ 2，与 μ 无关', 'ts');
  o += text(T, 242, '彩线上读出的 L 就是 q(μ)', 'ts');
  return svg(560, 300, o, 'Lagrangian 在 x=y=t 上的 level curve，saddle point 在 (t,μ)=(1,2)，L=2 的 level set 是两条相交的 line');
}

// ---------- 第 7 站：(g, f) 平面上的 duality ----------
function dualgeo() {
  let o = '';
  {
    const sx = lin(-2, 2, 30, 260), sy = lin(-0.5, 8, 240, 40);
    const par = (u) => (2 - u) ** 2 / 2;
    const top = 8;
    const pts = []; for (let i = 0; i <= 100; i++) { const u = -2 + (4 * i) / 100; pts.push([sx(u), sy(Math.min(par(u), top))]); }
    o += path(d([[sx(-2), sy(top)], ...pts, [sx(2), sy(top)]]) + 'Z', 'wash');
    o += path(d(pts), 'ink');
    o += line(sx(-2), sy(0), sx(2), sy(0), 'axis') + line(sx(0), sy(-0.5), sx(0), sy(top), 'dash');
    o += path(curve((u) => 2 - 2 * u, -0.9, 1.9, sx, sy), 'ln');
    o += circle(sx(0), sy(2), 4.5, 'ink-f') + lab(sx(0) + 10, sy(2) - 12, 'f* = q* = 2', 'tb', 'start');
    o += lab(sx(1.2), sy(1.5), 'f + 2u = 2', 'tl', 'start');
    o += lab(sx(0.25), sy(7.2), '点集 {(g(x), f(x))}', 'ts', 'start');
    o += text(sx(-1), sy(0) + 18, 'u ≤ 0：feasible', 'ts', 'middle') + text(sx(2), sy(0) + 18, 'u = g', 'ts', 'end');
    o += text(145, 22, 'min x² + y²，g = 2 − x − y', 'tb', 'middle');
  }
  {
    const sx = lin(-1.2, 1.2, 310, 540), sy = lin(-1.6, 0.8, 240, 40);
    o += line(sx(-1.2), sy(0), sx(1.2), sy(0), 'axis') + line(sx(0), sy(-1.6), sx(0), sy(0.8), 'dash');
    o += path(curve((u) => -u - 0.5, -1.1, 1.1, sx, sy), 'ln');
    o += circle(sx(-0.5), sy(0), 4.5, 'ink-f') + text(sx(-0.5), sy(0) - 10, 'x = 0', 'ts', 'middle');
    o += circle(sx(0.5), sy(-1), 4.5, 'paper') + text(sx(0.5) + 8, sy(-1) - 22, 'x = 1', 'ts', 'start') + text(sx(0.5) + 8, sy(-1) - 6, '不 feasible', 'ts', 'start');
    o += circle(sx(0), sy(-0.5), 3.5, 'ln-f');
    o += line(sx(0) - 12, sy(0), sx(0) - 12, sy(-0.5), 'ink') + line(sx(0) - 16, sy(0), sx(0) - 8, sy(0), 'ink') + line(sx(0) - 16, sy(-0.5), sx(0) - 8, sy(-0.5), 'ink');
    o += text(sx(0) - 20, sy(-0.25) + 4, 'gap ½', 'tb', 'end');
    o += text(sx(0) + 8, sy(-0.5) - 2, 'q* = −½', 'tl', 'start') + text(sx(0) + 6, sy(0) - 8, 'f* = 0', 'ts', 'start');
    o += text(425, 22, 'min −x，x − ½ ≤ 0，x ∈ {0, 1}', 'tb', 'middle');
  }
  o += text(280, 282, '彩线是 slope 为 −μ*、从下面托住所有点的最高 line，它在 u = 0 处的高度是 q*', 'ts', 'middle');
  return svg(560, 290, o, '左：点集 convex，托住它的 line 在 u=0 处碰到 f*；右：只有两个点，托住它们的 line 在 u=0 处比 f* 低 1/2');
}

// ---------- 第 8 站：Frank–Wolfe 动图 ----------
function fwA() {
  const Q = [[4, -2], [-2, 4]], c = [-4, -6];
  const f = (x, y) => 2 * x * x + 2 * y * y - 2 * x * y - 4 * x - 6 * y;
  const V = [[0, 0], [2, 0], [1.25, 0.75], [0, 1]];
  const grad = (p) => [Q[0][0] * p[0] + Q[0][1] * p[1] + c[0], Q[1][0] * p[0] + Q[1][1] * p[1] + c[1]];
  const fs = f(35 / 31, 24 / 31);
  const run = (n) => { let p = [0, 0]; const P = [p], S = []; for (let k = 0; k < n; k++) { const g = grad(p); let best = 0; V.forEach((v, i) => { if (g[0] * v[0] + g[1] * v[1] < g[0] * V[best][0] + g[1] * V[best][1]) best = i; }); const s = V[best], a = 2 / (k + 2); S.push(s); p = [p[0] + a * (s[0] - p[0]), p[1] + a * (s[1] - p[1])]; P.push(p); } return { P, S }; };
  const { P, S } = run(12);
  const s = 186, sx = (x) => 46 + s * x, sy = (y) => 226 - s * y;
  let o = poly(V.map(([x, y]) => [sx(x), sy(y)]), 'wash');
  for (const L of [-7.15, -7.0, -6.6, -5.8, -4.5]) o += path(contour(f, -0.1, 2.05, -0.1, 1.12, L, sx, sy, 150, 120), 'grid');
  o += path(d([...V, V[0]].map(([x, y]) => [sx(x), sy(y)])), 'ink');
  o += text(sx(0) - 6, sy(0) + 16, '(0, 0)', 'ts', 'end') + text(sx(2), sy(0) + 16, '(2, 0)', 'ts', 'middle');
  o += lab(sx(1.25) + 8, sy(0.75) + 4, '(5/4, 3/4)', 'ts', 'start') + text(sx(0) - 6, sy(1) + 4, '(0, 1)', 'ts', 'end');
  o += arrow(sx(1.25), sy(0.75), sx(35 / 31), sy(24 / 31), 'ink-b', 6);
  o += circle(sx(35 / 31), sy(24 / 31), 5, 'ink-f') + lab(sx(35 / 31) - 2, sy(24 / 31) - 12, 'x*', 'tb', 'end');
  const N = 14, dur = 14;
  for (let k = 1; k <= 12; k++) {
    const a = P[k - 1], b = P[k], sv = S[k - 1];
    o += prog(k, N, dur, line(sx(a[0]), sy(a[1]), sx(b[0]), sy(b[1]), 'ln') + circle(sx(b[0]), sy(b[1]), 3, 'ln-f'));
    o += only(k, N, dur, line(sx(a[0]), sy(a[1]), sx(sv[0]), sy(sv[1]), 'ln-dash') + circle(sx(sv[0]), sy(sv[1]), 8, 'ln'));
  }
  o += circle(sx(0), sy(0), 3.5, 'ln-f');
  const T = 488;
  o += text(T, 30, 'k', 'tb', 'end') + text(T + 64, 30, 'f − f*', 'tb', 'end');
  [1, 2, 3, 4, 5, 6, 8, 10, 12].forEach((k, i) => {
    const y = 52 + i * 20;
    o += prog(k, N, dur, text(T, y, String(k), 't', 'end') + text(T + 64, y, (f(...P[k]) - fs).toFixed(3), 't', 'end'));
  });
  o += text(280, 262, 'Exact line search：先到 (5/4, 3/4)，再沿 edge 到 x*（黑色箭头）。彩色：γ = 2/(k+2)', 'ts', 'middle');
  return svgA(560, 270, o, '动图：Frank–Wolfe 在四边形上最小化一个 convex quadratic，exact line search 两步到达 x*，step size 2/(k+2) 时 iterate 在 x* 附近来回');
}

export default {
  'ma3236-cubic': cubicFig,
  'ma3236-zigintro': zigintro,
  'ma3236-cuspintro': cuspintro,
  'ma3236-quad': quadFig,
  'ma3236-golden': goldenA,
  'ma3236-sd': sdA,
  'ma3236-newton1d': newton1dA,
  'ma3236-newton2d': newton2d,
  'ma3236-lagrange': lagrangeFig,
  'ma3236-cuspeq': cuspeq,
  'ma3236-kktcase': kktcase,
  'ma3236-kkt1d': kkt1d,
  'ma3236-cusp': cuspFig,
  'ma3236-saddle': saddleFig,
  'ma3236-dualgeo': dualgeo,
  'ma3236-fw': fwA,
};
