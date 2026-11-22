import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 共用：车间例子 max 4x1+3x2，2x1+x2≤10，x1+x2≤7，x2≤5 ----------
const VERT = [[0, 0], [5, 0], [3, 4], [2, 5], [0, 5]];
const zOf = ([a, b]) => 4 * a + 3 * b;

// a·x1 + b·x2 = k 与方框 [0,X]×[0,Y] 的交线段
function clip(a, b, k, X, Y) {
  const pts = [];
  const add = (p) => { if (p[0] >= -1e-9 && p[0] <= X + 1e-9 && p[1] >= -1e-9 && p[1] <= Y + 1e-9 && !pts.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-7)) pts.push(p); };
  if (b) { add([0, k / b]); add([X, (k - a * X) / b]); }
  if (a) { add([k / a, 0]); add([(k - b * Y) / a, Y]); }
  pts.sort((p, q) => p[0] - q[0] || q[1] - p[1]);
  return pts.length >= 2 ? [pts[0], pts[pts.length - 1]] : null;
}
// 多边形被 half-plane a·x ≤ k 裁剪（Sutherland–Hodgman）
function cutPoly(P, a, b, k) {
  const out = [], f = (p) => a * p[0] + b * p[1] - k;
  for (let i = 0; i < P.length; i++) {
    const p = P[i], q = P[(i + 1) % P.length], fp = f(p), fq = f(q);
    if (fp <= 1e-9) out.push(p);
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) { const t = fp / (fp - fq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
  }
  return out;
}
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const X1 = 'x' + sub('1'), X2 = 'x' + sub('2');

// 坐标轴 + 刻度
function plane(sx, sy, X, Y, ticks = 1) {
  let o = line(sx(0), sy(0), sx(X), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(Y), 'axis');
  for (let v = ticks; v <= X + 1e-9; v += ticks) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, String(v), 'ts', 'middle');
  for (let v = ticks; v <= Y + 1e-9; v += ticks) o += line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  o += text(sx(0) - 7, sy(0) + 17, '0', 'ts', 'end');
  o += text(sx(X) + 4, sy(0) + 4, X1, 'ts', 'start') + text(sx(0), sy(Y) - 8, X2, 'ts', 'middle');
  return o;
}
const seg = (s, sx, sy, cls) => (s ? line(sx(s[0][0]), sy(s[0][1]), sx(s[1][0]), sy(s[1][1]), cls) : '');

// ---------- 第 1 站：feasible region 与 level line ----------
function feasible() {
  const X = 7.5, Y = 7.5, sx = lin(0, X, 50, 335), sy = lin(0, Y, 300, 15);
  let o = poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'wash');
  o += seg(clip(2, 1, 10, X, Y), sx, sy, 'mute') + seg(clip(1, 1, 7, X, Y), sx, sy, 'mute') + seg(clip(0, 1, 5, X, Y), sx, sy, 'mute');
  o += poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'frame');
  for (const k of [12, 20]) {
    const s = clip(4, 3, k, X, Y); o += seg(s, sx, sy, 'dash');
    o += text(sx(s[0][0]) + 6, sy(s[0][1]) + 4, 'z = ' + k, 'ts', 'start');
  }
  const s24 = clip(4, 3, 24, X, Y); o += seg(s24, sx, sy, 'ln');
  o += text(sx(s24[0][0]) + 6, sy(s24[0][1]) + 4, 'z = 24', 'tl', 'start');
  for (const p of VERT) o += circle(sx(p[0]), sy(p[1]), 3.5, 'ink-f');
  o += circle(sx(3), sy(4), 6, 'ln-f');
  o += text(sx(3) + 10, sy(4) - 8, '(3, 4)', 'tb', 'start');
  // 约束线的标注
  o += text(sx(1.55), sy(7.15), '2' + X1 + ' + ' + X2 + ' = 10', 'ts', 'start') + text(sx(1.55), sy(7.15) + 14, 'machine', 'ts', 'start');
  o += text(sx(6.05), sy(1.55), X1 + ' + ' + X2 + ' = 7', 'ts', 'start') + text(sx(6.05), sy(1.55) + 14, 'labour', 'ts', 'start');
  o += text(sx(4.6), sy(5) - 6, X2 + ' = 5（material）', 'ts', 'start');
  // c 的方向
  const c0 = [sx(0.6), sy(1.2)];
  o += arrow(c0[0], c0[1], c0[0] + 4 * 9, c0[1] - 3 * 9, 'ln') + text(c0[0] + 40, c0[1] - 26, 'c = (4, 3)', 'tl', 'start');
  // 右边：说明
  const R = 365;
  o += text(R, 40, 'Level line 4' + X1 + ' + 3' + X2 + ' = k', 'tb', 'start');
  o += text(R, 60, 'k 越大，line 越往 c 的方向平移', 'ts', 'start');
  o += text(R, 100, '推到即将离开 region 时，', 't', 'start');
  o += text(R, 118, '最后碰到的是 corner (3, 4)，', 't', 'start');
  o += text(R, 136, 'z = 24', 'tl', 'start');
  o += text(R, 176, '五个 corner 的 z：', 'ts', 'start');
  [['(0, 0)', 0], ['(5, 0)', 20], ['(3, 4)', 24], ['(2, 5)', 23], ['(0, 5)', 15]].forEach(([p, z], i) => {
    o += text(R + 10, 196 + i * 18, p, i === 2 ? 'tl' : 't', 'start') + text(R + 90, 196 + i * 18, String(z), i === 2 ? 'tl' : 't', 'end');
  });
  return svg(560, 320, o, '车间例子的 feasible region 是一个五边形，level line 4x1+3x2=k 沿 c=(4,3) 方向平移，z=24 那条只碰到 corner (3,4)');
}

// ---------- 第 1 站：四种结局 ----------
function outcomes() {
  let o = '';
  const W = 125, X = 8, Y = 8;
  const panel = (i, title, note1, note2, draw) => {
    const x0 = 8 + i * 140, sx = lin(0, X, x0 + 8, x0 + W), sy = lin(0, Y, 160, 40);
    o += line(sx(0), sy(0), sx(X), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(Y), 'axis');
    o += draw(sx, sy);
    o += text(x0 + W / 2 + 4, 22, title, 'tb', 'middle');
    o += text(x0 + W / 2 + 4, 182, note1, 'ts', 'middle') + text(x0 + W / 2 + 4, 198, note2, 'ts', 'middle');
  };
  const reg = (sx, sy) => poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'wash') + poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'frame');
  panel(0, '唯一 optimal', 'c = (4, 3)', '只碰到 (3, 4)', (sx, sy) => reg(sx, sy) + seg(clip(4, 3, 24, X, Y), sx, sy, 'ln') + circle(sx(3), sy(4), 4.5, 'ln-f'));
  panel(1, '无穷多个 optimal', 'c = (4, 2)', '整条 edge 都是 z = 20', (sx, sy) => reg(sx, sy) + seg(clip(4, 2, 20, X, Y), sx, sy, 'dash') + line(sx(3), sy(4), sx(5), sy(0), 'ln') + circle(sx(3), sy(4), 3.5, 'ln-f') + circle(sx(5), sy(0), 3.5, 'ln-f'));
  panel(2, 'Unbounded', '只剩 x₂ ≤ 5', 'z 沿 x₁ 方向无限增大', (sx, sy) => poly([[sx(0), sy(0)], [sx(X), sy(0)], [sx(X), sy(5)], [sx(0), sy(5)]], 'wash') + line(sx(0), sy(5), sx(X), sy(5), 'ink') + arrow(sx(2), sy(2.5), sx(7.2), sy(2.5), 'ln'));
  panel(3, 'Infeasible', 'x₁ + x₂ ≤ 7 与', 'x₁ + x₂ ≥ 8 没有交集', (sx, sy) => poly([[sx(0), sy(0)], [sx(7), sy(0)], [sx(0), sy(7)]], 'wash') + poly([[sx(8), sy(0)], [sx(8), sy(8)], [sx(0), sy(8)]], 'wash2') + line(sx(0), sy(7), sx(7), sy(0), 'ink') + line(sx(0), sy(8), sx(8), sy(0), 'ink') + text(sx(2), sy(2) + 4, '≤ 7', 'ts', 'middle') + text(sx(6.2), sy(6.2) + 4, '≥ 8', 'ts', 'middle'));
  return svg(560, 205, o, '四个小图：唯一 optimal vertex；level line 与一条 edge 平行，整条 edge optimal；只剩 x2≤5 时 region 沿 x1 无限延伸；x1+x2≤7 与 x1+x2≥8 两个 half-plane 没有交集');
}

// ---------- 第 1 站：三种拟合 ----------
function fit() {
  const P = [[1, 1], [2, 2], [3, 2]];
  const sx = lin(0.5, 3.5, 60, 380), sy = lin(0.6, 2.6, 250, 30);
  let o = '';
  o += line(sx(0.5), sy(0.6), sx(3.5), sy(0.6), 'axis') + line(sx(0.5), sy(0.6), sx(0.5), sy(2.6), 'axis');
  for (const t of [1, 2, 3]) o += line(sx(t), sy(0.6), sx(t), sy(0.6) + 4, 'axis') + text(sx(t), sy(0.6) + 17, String(t), 'ts', 'middle');
  for (const y of [1, 1.5, 2, 2.5]) o += line(sx(0.5) - 4, sy(y), sx(0.5), sy(y), 'axis') + text(sx(0.5) - 7, sy(y) + 4, String(y), 'ts', 'end');
  o += text(sx(3.5) + 6, sy(0.6) + 4, 't', 'ts', 'start') + text(sx(0.5), sy(2.6) - 10, 'y', 'ts', 'middle');
  const L = [
    { C: 0.5, cls: 'ink', name: 'sum of |error| 最小', note: '0.5 + 0.5t，error 0, −0.5, 0' },
    { C: 2 / 3, cls: 'dash', name: 'least squares', note: '⅔ + 0.5t，最大 |error| = ⅓' },
    { C: 0.75, cls: 'ln', name: 'max |error| 最小（LP）', note: '0.75 + 0.5t，error ±0.25' },
  ];
  // 三条线都画到 t = 3.5，右端用引线连到标注
  L.forEach((l, i) => {
    o += line(sx(0.5), sy(l.C + 0.25), sx(3.5), sy(l.C + 1.75), l.cls);
    const yEnd = sy(l.C + 1.75), yLab = 92 + (2 - i) * 46;
    o += line(sx(3.5) + 2, yEnd, 400, yLab - 4, 'grid');
    o += text(404, yLab, l.name, i === 2 ? 'tl' : 'tb', 'start') + text(404, yLab + 16, l.note, 'ts', 'start');
  });
  // minimax line 的 error
  for (const [t, y] of P) {
    const yy = 0.75 + 0.5 * t;
    o += line(sx(t) + 5, sy(y), sx(t) + 5, sy(yy), 'ln') + line(sx(t) + 1, sy(y), sx(t) + 9, sy(y), 'ln') + line(sx(t) + 1, sy(yy), sx(t) + 9, sy(yy), 'ln');
  }
  for (const [t, y] of P) o += circle(sx(t), sy(y), 4.5, 'ink-f');
  o += text(sx(1) + 8, sy(1) + 18, '(1, 1)', 'ts', 'start') + text(sx(2) - 10, sy(2) - 8, '(2, 2)', 'ts', 'middle') + text(sx(3) + 2, sy(2) + 18, '(3, 2)', 'ts', 'middle');
  o += text(280, 290, '三条 line 的 slope 都是 0.5，只差 intercept；彩色竖线是 minimax line 的三个 error，长度都是 0.25', 'ts', 'middle');
  return svg(560, 300, o, '三个 data point 和三条拟合直线：sum of absolute errors 最小、least squares、maximum absolute error 最小，三条线平行，intercept 分别是 0.5、2/3、0.75');
}

// ---------- 第 2 站：全部 basic solution ----------
function bases() {
  const X = 7.6, Y = 10.6, u = 29, sx = (v) => 175 + v * u, sy = (v) => 330 - v * u;
  let o = poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'wash');
  o += line(sx(0), sy(0), sx(X), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(Y), 'axis');
  for (const v of [5, 7]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, String(v), 'ts', 'middle');
  o += text(sx(0), sy(0) + 17, '0', 'ts', 'middle') + text(sx(X) + 4, sy(0) + 4, X1, 'ts', 'start') + text(sx(0), sy(Y) - 8, X2, 'ts', 'middle');
  o += seg(clip(2, 1, 10, X, Y), sx, sy, 'ink') + seg(clip(1, 1, 7, X, Y), sx, sy, 'ink') + seg(clip(0, 1, 5, X, Y), sx, sy, 'ink');
  o += text(sx(1.2), sy(8.3), 's' + sub('1') + ' = 0', 'ts', 'start');
  o += text(sx(7.15), sy(0.6), 's' + sub('2') + ' = 0', 'ts', 'start');
  o += text(sx(X) + 2, sy(5) + 4, 's' + sub('3') + ' = 0', 'ts', 'start');
  for (const [a, b] of VERT) o += circle(sx(a), sy(b), 5, 'ink-f');
  const lab = (a, b, s, dx, dy, anchor) => text(sx(a) + dx, sy(b) + dy, s, 'ts', anchor);
  o += lab(0, 0, '(0, 0)', -10, 4, 'end') + lab(5, 0, '(5, 0)', 8, -8, 'start') + lab(3, 4, '(3, 4)', 10, 4, 'start') + lab(2, 5, '(2, 5)', -6, 18, 'end') + lab(0, 5, '(0, 5)', -10, 4, 'end');
  const bad = [[2.5, 5, 's₂ = −0.5', 10, -8, 'start'], [7, 0, 's₁ = −4', 0, -28, 'middle'], [0, 7, '(0, 7)　s₃ = −2', -10, 4, 'end'], [0, 10, '(0, 10)　s₂ = −3，s₃ = −5', -10, 4, 'end']];
  for (const [a, b, s, dx, dy, an] of bad) o += circle(sx(a), sy(b), 5, 'paper') + text(sx(a) + dx, sy(b) + dy, s, 'tl', an);
  const R = 448;
  o += text(R, 40, '令两个 variable', 'tb', 'start') + text(R, 58, '等于 0，就是站到', 'ts', 'start') + text(R, 74, '两条 line 的交点上', 'ts', 'start');
  o += circle(R + 6, 106, 5, 'ink-f') + text(R + 18, 110, 'BFS：corner', 't', 'start');
  o += circle(R + 6, 132, 5, 'paper') + text(R + 18, 136, '有 variable', 't', 'start') + text(R + 18, 154, '是 negative', 't', 'start');
  o += text(R, 190, '9 个交点，加上', 'ts', 'start') + text(R, 206, '1 对 parallel line', 'ts', 'start') + text(R, 222, '（x₂ = 0 与 x₂ = 5）', 'ts', 'start') + text(R, 238, '共 10 种 basis', 'ts', 'start');
  return svg(560, 345, o, '五条边界 line 两两相交得到 9 个 basic solution：五个在 feasible region 上，是 BFS；(2.5,5)、(7,0)、(0,7)、(0,10) 四个在 region 外，各有 variable 为负');
}

// ---------- 第 3 站：simplex 沿 edge 走（动图） ----------
function simplexA() {
  const X = 7.5, Y = 7.5, sx = lin(0, X, 40, 300), sy = lin(0, Y, 290, 30);
  const main = [[0, 0], [5, 0], [3, 4]], alt = [[0, 0], [0, 5], [2, 5], [3, 4]];
  // keyframes：沿路径按长度匀速
  const speed = 2.2, hold = 1.0, kt = [], P = [];
  let t = 0;
  const run = (pts) => {
    for (let i = 0; i < pts.length; i++) {
      if (i) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); t += L / speed; }
      kt.push(t); P.push(pts[i]); t += hold; kt.push(t); P.push(pts[i]);
    }
  };
  run(main); const tMid = t; run(alt);
  const T = t, KT = kt.map((v) => v / T);
  let o = poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'wash') + poly(VERT.map(([a, b]) => [sx(a), sy(b)]), 'frame');
  o += line(sx(0), sy(0), sx(X), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(Y), 'axis');
  o += text(sx(X) + 4, sy(0) + 4, X1, 'ts', 'start') + text(sx(0), sy(Y) - 8, X2, 'ts', 'middle');
  // 两条路径（静态）
  o += path(d(main.map(([a, b]) => [sx(a), sy(b) + 0])), 'ln-dash');
  o += path(d(alt.map(([a, b]) => [sx(a) - 0, sy(b)])), 'dash');
  for (const p of VERT) o += circle(sx(p[0]), sy(p[1]), 3.5, 'ink-f');
  o += text(sx(0) - 6, sy(0) + 16, '(0, 0)', 'ts', 'end') + text(sx(5), sy(0) + 17, '(5, 0)', 'ts', 'middle') + text(sx(3) + 9, sy(4) + 4, '(3, 4)', 'tb', 'start');
  o += text(sx(2), sy(5) - 9, '(2, 5)', 'ts', 'middle') + text(sx(0) - 6, sy(5) + 4, '(0, 5)', 'ts', 'end');
  // level line 跟着点走
  const lev = P.map((p) => { const s = clip(4, 3, Math.max(zOf(p), 0.6), X, Y); return d(s.map(([a, b]) => [sx(a), sy(b)])); });
  o += apath(lev, KT, T, 'mute');
  o += acircle(P.map((p) => sx(p[0])), P.map((p) => sy(p[1])), KT, T, 7, 'ln-f');
  // 右边读数
  const R = 318;
  const phaseA = KT.map((v) => v * T < tMid - 1e-9), phaseB = phaseA.map((v) => !v);
  const rowsA = [
    ['先让 x₁ 进（reduced cost 4 最大）', 'tb'],
    ['(0, 0)　z = 0', 't'],
    ['x₁ 进，s₁ 出 → (5, 0)　z = 20', 't'],
    ['x₂ 进，s₂ 出 → (3, 4)　z = 24', 't'],
    ['两次 pivot，reduced cost 全 ≤ 0，停', 'ts'],
  ];
  const rowsB = [
    ['另一种选法：先让 x₂ 进', 'tb'],
    ['(0, 0)　z = 0', 't'],
    ['x₂ 进，s₃ 出 → (0, 5)　z = 15', 't'],
    ['x₁ 进，s₂ 出 → (2, 5)　z = 23', 't'],
    ['s₃ 进，s₁ 出 → (3, 4)　z = 24', 't'],
    ['三次 pivot，到同一个 optimal vertex', 'ts'],
  ];
  // 当前所在的步骤：高亮底色
  const stepA = [], stepB = [];
  P.forEach((p, i) => {
    const inA = phaseA[i];
    const idxA = inA ? main.findIndex((q) => q[0] === p[0] && q[1] === p[1]) : -1;
    const idxB = !inA ? alt.findIndex((q) => q[0] === p[0] && q[1] === p[1]) : -1;
    stepA.push(idxA); stepB.push(idxB);
  });
  for (let k = 0; k < 3; k++) o += `<rect x="${R - 6}" y="${f1(44 + (k + 1) * 20 - 15)}" width="244" height="20" rx="3" class="wash-strong">${ashow(stepA.map((v) => v === k), KT, T)}</rect>`;
  for (let k = 0; k < 4; k++) o += `<rect x="${R - 6}" y="${f1(168 + (k + 1) * 20 - 15)}" width="244" height="20" rx="3" class="wash-strong">${ashow(stepB.map((v) => v === k), KT, T)}</rect>`;
  rowsA.forEach(([s, c], i) => { o += text(R, 44 + i * 20, s, c, 'start'); });
  rowsB.forEach(([s, c], i) => { o += text(R, 168 + i * 20, s, c, 'start'); });
  o += text(sx(4.2), sy(0) - 8, 'pivot 1', 'tl', 'middle') + text(sx(4.55), sy(2.4), 'pivot 2', 'tl', 'start');
  o += text(280, 318, '彩色虚线：先让 x₁ 进；灰色虚线：先让 x₂ 进；细线是当前点的 level line', 'ts', 'middle');
  return svgA(560, 325, o, '动图：simplex 从 (0,0) 沿 edge 走到 (5,0) 再到 (3,4)，z 从 0 到 20 到 24；之后演示先让 x2 进的选法，经 (0,5)、(2,5) 三步到 (3,4)');
}

// ---------- 第 4 站：optimal vertex 处的 cone ----------
function cone() {
  const u = 40, V = [3, 4], O = [170, 205];
  const P = ([a, b]) => [O[0] + (a - V[0]) * u, O[1] - (b - V[1]) * u];
  const win = [[1.6, 2.0], [4.6, 2.0], [4.6, 5.5], [1.6, 5.5]];
  const reg = cutPoly(cutPoly(cutPoly(win, 2, 1, 10), 1, 1, 7), 0, 1, 5);
  let o = poly(reg.map(P), 'wash');
  const M = [P([2.3, 5.4]), P([4.0, 2.0])], L = [P([1.7, 5.3]), P([4.0, 3.0])];
  o += line(...M[0], ...M[1], 'ink') + line(...L[0], ...L[1], 'ink') + line(...P([1.5, 5]), ...P([2.6, 5]), 'mute');
  o += text(M[1][0] + 6, M[1][1] + 4, '2x₁ + x₂ = 10', 'ts', 'start') + text(L[0][0] - 6, L[0][1] - 4, 'x₁ + x₂ = 7', 'ts', 'end');
  o += text(P([1.5, 5])[0] - 6, P([1.5, 5])[1] + 8, 'x₂ = 5（不 active）', 'ts', 'end');
  const s = 40, n1 = [2 * s, -s], n2 = [s, -s], c = [4 * s, -3 * s];
  o += poly([O, [O[0] + 2.6 * n1[0], O[1] + 2.6 * n1[1]], [O[0] + 3.5 * n2[0], O[1] + 3.5 * n2[1]]], 'wash-strong');
  o += arrow(O[0], O[1], O[0] + n1[0], O[1] + n1[1], 'ink') + text(O[0] + n1[0] + 4, O[1] + n1[1] + 16, '(2, 1)', 'tb', 'start');
  o += arrow(O[0], O[1], O[0] + n2[0], O[1] + n2[1], 'ink') + text(O[0] + n2[0] - 6, O[1] + n2[1] + 2, '(1, 1)', 'tb', 'end');
  const A = [O[0] + n1[0], O[1] + n1[1]], B2 = [O[0] + 2 * n2[0], O[1] + 2 * n2[1]], Cc = [O[0] + c[0], O[1] + c[1]];
  o += line(O[0] + n2[0], O[1] + n2[1], B2[0], B2[1], 'dash') + text(B2[0] - 6, B2[1] + 2, '2 · (1, 1)', 'ts', 'end');
  o += line(A[0], A[1], Cc[0], Cc[1], 'dash') + line(B2[0], B2[1], Cc[0], Cc[1], 'dash');
  o += arrow(O[0], O[1], Cc[0], Cc[1], 'ln') + text(Cc[0] + 8, Cc[1] + 2, 'c = (4, 3)', 'tl', 'start');
  o += circle(O[0], O[1], 5, 'ink-f') + text(O[0] - 10, O[1] + 18, '(3, 4)', 'tb', 'end');
  const R = 360;
  o += text(R, 200, 'c = 1 · (2, 1) + 2 · (1, 1)', 'tl', 'start');
  o += text(R, 220, 'coefficient 就是 y₁ = 1，y₂ = 2', 'ts', 'start');
  o += text(R, 250, 'c 落在两条 active constraint 的', 'ts', 'start') + text(R, 266, 'normal 张成的 cone 里，', 'ts', 'start') + text(R, 282, '所以 (3, 4) optimal', 'ts', 'start');
  return svg(560, 300, o, '在 optimal vertex (3,4) 处，两条 active constraint 的 normal (2,1) 和 (1,1) 张成一个 cone，c=(4,3) 等于 1 倍 (2,1) 加 2 倍 (1,1)，落在 cone 内');
}

// ---------- 第 5 站：labour 上限变化（动图） ----------
function sensA() {
  const zStar = (b) => (b <= 5 ? 4 * b : b <= 7.5 ? 2 * b + 10 : 25);
  const vtx = (b) => (b <= 5 ? [b, 0] : b <= 7.5 ? [10 - b, 2 * b - 10] : [2.5, 5]);
  // b2：7 → 9 → 4 → 7，按真实速度（每秒 1）
  const bs = [];
  for (let b = 7; b <= 9 + 1e-9; b += 0.05) bs.push(b);
  for (let b = 9; b >= 4 - 1e-9; b -= 0.05) bs.push(b);
  for (let b = 4; b <= 7 + 1e-9; b += 0.05) bs.push(b);
  const T = 10, KT = bs.map((_, i) => i / (bs.length - 1));
  const X = 7.5, Y = 7.5, sx = lin(0, X, 40, 270), sy = lin(0, Y, 270, 40);
  const box = [[0, 0], [X, 0], [X, Y], [0, Y]];
  const regOf = (b) => cutPoly(cutPoly(cutPoly(box, 2, 1, 10), 1, 1, b), 0, 1, 5);
  let o = text(155, 22, 'feasible region（labour 上限 b₂ 在动）', 'tb', 'middle');
  o += apath(bs.map((b) => d(regOf(b).map(([a, c]) => [sx(a), sy(c)])) + 'Z'), KT, T, 'wash', true);
  o += line(sx(0), sy(0), sx(X), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(Y), 'axis');
  o += text(sx(X) + 4, sy(0) + 4, X1, 'ts', 'start') + text(sx(0), sy(Y) - 8, X2, 'ts', 'middle');
  o += seg(clip(2, 1, 10, X, Y), sx, sy, 'ink') + seg(clip(0, 1, 5, X, Y), sx, sy, 'mute');
  o += text(sx(5) + 4, sy(0) - 6, 'machine', 'ts', 'start') + text(sx(X), sy(5) - 6, 'material', 'ts', 'end');
  o += apath(bs.map((b) => { const s = clip(1, 1, b, X, Y); return d(s.map(([a, c]) => [sx(a), sy(c)])); }), KT, T, 'ln');
  const vs = bs.map(vtx);
  o += acircle(vs.map((p) => sx(p[0])), vs.map((p) => sy(p[1])), KT, T, 6, 'ln-f');
  o += text(sx(3.0), sy(7.1), 'labour line x₁ + x₂ = b₂', 'tl', 'start');
  // 右：z*(b2)
  const px = lin(4, 9, 340, 545), py = lin(15, 26, 250, 50);
  o += text(440, 22, 'optimal value z*(b₂)', 'tb', 'middle');
  o += line(px(4), py(15), px(9), py(15), 'axis') + line(px(4), py(15), px(4), py(26), 'axis');
  for (const v of [4, 5, 6, 7, 7.5, 8, 9]) o += line(px(v), py(15), px(v), py(15) + 4, 'axis') + (v === 7.5 ? '' : text(px(v), py(15) + 17, String(v), 'ts', 'middle'));
  o += text(px(7.5), py(15) + 30, '7.5', 'ts', 'middle');
  for (const v of [16, 20, 24, 25]) o += line(px(4) - 4, py(v), px(4), py(v), 'axis') + text(px(4) - 7, py(v) + 4, String(v), 'ts', 'end');
  o += text(px(9), py(15) + 32, 'b₂', 'ts', 'end');
  const cur = []; for (let b = 4; b <= 9 + 1e-9; b += 0.05) cur.push([px(b), py(zStar(b))]);
  o += path(d(cur), 'ink-b');
  o += line(px(5), py(15), px(5), py(20), 'grid') + line(px(7.5), py(15), px(7.5), py(25), 'grid');
  o += text(px(4.55) + 8, py(18) + 12, 'slope 4', 'ts', 'start');
  o += text(px(6.25) + 8, py(22.5) + 14, 'slope 2', 'tl', 'start') + text(px(6.25) + 8, py(22.5) + 30, '= y₂', 'tl', 'start');
  o += text(px(8.3), py(25) - 8, 'slope 0', 'ts', 'middle');
  o += acircle(bs.map((b) => px(b)), bs.map((b) => py(zStar(b))), KT, T, 5.5, 'ln-f');
  o += circle(px(7), py(24), 3, 'ink-f') + text(px(7) + 6, py(24) + 16, '(7, 24)', 'ts', 'start');
  o += text(280, 300, 'b₂ 在 5 到 7.5 之间，vertex 沿 machine line 滑动，basis 不变，每多 1 小时 z 增加 2', 'ts', 'middle');
  return svgA(560, 308, o, '动图：labour 上限 b2 从 7 增到 9、降到 4 再回到 7，labour line 平移，optimal vertex 跟着移动；右边 z*(b2) 是 piecewise linear 的，slope 依次是 4、2、0');
}

// ---------- 第 6 站：shortest path tree vs MST ----------
const NET = {
  pos: { s: [22, 120], a: [100, 50], b: [100, 190], c: [190, 50], d: [190, 190], t: [262, 120] },
  arcs: [['s', 'a', 4], ['s', 'b', 1], ['b', 'a', 2], ['a', 'c', 3], ['b', 'c', 7], ['b', 'd', 4], ['c', 'd', 1], ['c', 't', 5], ['d', 't', 2]],
};
function drawNet(x0, y0, { directed, hot, labels, nodeNote }) {
  let o = '';
  const P = (n) => [x0 + NET.pos[n][0], y0 + NET.pos[n][1]];
  const R = 13;
  for (const [u, v, w] of NET.arcs) {
    const [x1, y1] = P(u), [x2, y2] = P(v), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const a = [x1 + ux * R, y1 + uy * R], b = [x2 - ux * (R + 1), y2 - uy * (R + 1)];
    const on = hot.includes(u + v) || hot.includes(v + u);
    const cls = on ? 'ln' : 'mute';
    o += directed ? arrow(a[0], a[1], b[0], b[1], cls, 7) : line(a[0], a[1], b[0], b[1], cls);
    // cost 标在 arc 中点的一侧
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, off = labels[u + v] ?? [-uy * 11, ux * 11];
    o += text(mx + off[0], my + off[1] + 4, String(w), on ? 'tl' : 'ts', 'middle');
  }
  for (const n of Object.keys(NET.pos)) {
    const [x, y] = P(n);
    o += circle(x, y, R, 'paper') + text(x, y + 4.5, n, 'tb', 'middle');
    if (nodeNote[n]) o += text(x + nodeNote[n][1], y + nodeNote[n][2], nodeNote[n][0], 'tl', nodeNote[n][3] || 'middle');
  }
  return o;
}
function sptree() {
  const labels = { sa: [-10, -6], sb: [-10, 4], ba: [-9, 0], ac: [0, -9], bc: [15, -2], bd: [0, 15], cd: [9, 0], ct: [10, -6], dt: [10, 4] };
  let o = text(142, 18, 'Dijkstra：shortest path tree', 'tb', 'middle') + text(420, 18, 'Kruskal：minimum spanning tree', 'tb', 'middle');
  o += drawNet(0, 20, { directed: true, hot: ['sb', 'ba', 'ac', 'bd', 'dt'], labels, nodeNote: { s: ['0', 0, -18], a: ['3', 0, -18], b: ['1', 0, 30], c: ['6', 0, -18], d: ['5', 0, 30], t: ['7', 0, -18] } });
  o += drawNet(280, 20, { directed: false, hot: ['sb', 'cd', 'ba', 'dt', 'ac'], labels, nodeNote: {} });
  o += text(142, 262, '粗线 5 条，cost 合计 12；node 上方 / 下方是距离', 'ts', 'middle');
  o += text(420, 262, '粗线 5 条，cost 合计 9', 'ts', 'middle');
  o += text(280, 284, '左边 s 到 t 是 s → b → d → t，长 7；右边 tree 里 s 到 t 要绕 s–b–a–c–d–t，长 9', 'ts', 'middle');
  return svg(560, 292, o, '同一个 6-node network：左边是 Dijkstra 给出的 shortest path tree，到各 node 的距离是 s0 a3 b1 c6 d5 t7；右边是 minimum spanning tree，总 cost 9，用了 c-d 而不用 b-d');
}

// ---------- 第 7 站：Ford–Fulkerson（动图） ----------
function maxflowA() {
  const pos = { s: [40, 125], a: [170, 50], b: [170, 200], c: [330, 50], d: [330, 200], t: [470, 125] };
  const arcs = [['s', 'a', 3], ['s', 'b', 2], ['a', 'b', 2], ['a', 'c', 2], ['b', 'd', 3], ['c', 'd', 1], ['c', 't', 3], ['d', 't', 2]];
  const flows = [
    { sa: 0, sb: 0, ab: 0, ac: 0, bd: 0, cd: 0, ct: 0, dt: 0 },
    { sa: 2, sb: 0, ab: 2, ac: 0, bd: 2, cd: 0, ct: 0, dt: 2 },
    { sa: 3, sb: 0, ab: 2, ac: 1, bd: 2, cd: 0, ct: 1, dt: 2 },
    { sa: 3, sb: 1, ab: 1, ac: 2, bd: 2, cd: 0, ct: 2, dt: 2 },
  ];
  const paths = [[], ['sa', 'ab', 'bd', 'dt'], ['sa', 'ac', 'ct'], ['sb', 'ba', 'ac', 'ct']];
  // 帧：0 = 最终（含 cut），1..4 = 起点、三次 augmentation，然后回到最终
  const frames = [{ f: 3, p: -1, cut: true }, { f: 0, p: 0 }, { f: 1, p: 1 }, { f: 2, p: 2 }, { f: 3, p: 3 }];
  const dur = [3.2, 1.8, 2.4, 2.4, 2.8], T = dur.reduce((a, b) => a + b, 0);
  const kt = [0]; dur.slice(0, -1).reduce((acc, v) => { kt.push((acc + v) / T); return acc + v; }, 0);
  kt.push(1);
  const show = (pred) => ashow([...frames.map(pred), pred(frames[0])], kt, T);
  let o = '';
  const R = 14, P = (n) => pos[n];
  // cut 曲线
  o += `<g>${path('M292 8 C 292 60, 294 98, 330 104 C 372 110, 392 125, 404 170 L 418 250', 'ln-dash')}${show((fr) => !!fr.cut)}</g>`;
  o += `<g>${text(556, 236, 'cut：S = {s, a, b, d}', 'tl', 'end')}${text(556, 252, 'capacity 2 + 2 = 4', 'tl', 'end')}${show((fr) => !!fr.cut)}</g>`;
  for (const [u, v] of arcs) {
    const [x1, y1] = P(u), [x2, y2] = P(v), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const a = [x1 + ux * R, y1 + uy * R], b = [x2 - ux * (R + 1), y2 - uy * (R + 1)];
    o += arrow(a[0], a[1], b[0], b[1], 'mute', 7);
    o += `<g>${arrow(a[0], a[1], b[0], b[1], 'ln', 7)}${show((fr) => fr.p >= 0 && paths[fr.p].includes(u + v))}</g>`;
  }
  // backward arc b → a（第三次 augmentation）
  const bx = 170 - 22;
  o += `<g>${path(`M${bx} 185 C ${bx - 16} 150, ${bx - 16} 100, ${bx} 66`, 'ln')}${poly([[bx, 64], [bx - 6, 75], [bx + 4, 74]], 'ln-f')}${text(bx - 16, 128, 'b → a', 'tl', 'end')}${text(bx - 16, 144, '退回 1', 'tl', 'end')}${show((fr) => fr.p === 3)}</g>`;
  // flow / capacity 标注
  const lab = { sa: [-12, -8], sb: [-12, 16], ab: [12, 4], ac: [0, -10], bd: [0, 20], cd: [12, 4], ct: [14, -8], dt: [-16, -10] };
  for (const [u, v, cap] of arcs) {
    const [x1, y1] = P(u), [x2, y2] = P(v), mx = (x1 + x2) / 2 + lab[u + v][0], my = (y1 + y2) / 2 + lab[u + v][1];
    const anchor = lab[u + v][0] < 0 ? 'end' : lab[u + v][0] > 0 ? 'start' : 'middle';
    for (let fi = 0; fi < flows.length; fi++) {
      const val = flows[fi][u + v];
      const cls = val === cap ? 'tb' : 't';
      o += `<text x="${f1(mx)}" y="${f1(my)}" class="${cls}" text-anchor="${anchor}">${val} / ${cap}${show((fr) => fr.f === fi)}</text>`;
    }
  }
  for (const n of Object.keys(pos)) o += circle(pos[n][0], pos[n][1], R, 'paper') + text(pos[n][0], pos[n][1] + 4.5, n, 'tb', 'middle');
  // 下方读数
  const rows = [
    ['① s → a → b → d → t，推 2', 1],
    ['② s → a → c → t，推 1（greedy 到这里卡住）', 2],
    ['③ s → b → a → c → t，沿 backward arc 推 1', 3],
  ];
  rows.forEach(([s, k], i) => {
    o += `<rect x="34" y="${f1(268 + i * 20)}" width="330" height="19" rx="3" class="wash-strong">${show((fr) => fr.p === k)}</rect>`;
    o += text(40, 282 + i * 20, s, 't', 'start');
  });
  const tot = ['总量 0', '总量 2', '总量 3', '总量 4'];
  for (let fi = 0; fi < 4; fi++) o += `<text x="400" y="302" class="tl" text-anchor="start">${tot[fi]}${show((fr) => fr.f === fi && !fr.cut)}</text>`;
  o += `<g>${text(400, 302, 'flow 4 = cut 4', 'tl', 'start')}${show((fr) => !!fr.cut)}</g>`;
  o += text(280, 340, 'arc 上是 flow / capacity，粗体表示已满', 'ts', 'middle');
  return svgA(560, 348, o, '动图：Ford–Fulkerson 在 6-node network 上做三次 augmentation，第三次沿 backward arc b→a 把 a→b 上的 flow 退回 1，总量从 2、3 增到 4；最后一帧显示 S={s,a,b,d} 的 cut，capacity 4');
}

// ---------- 第 7 站：transportation ----------
function transport() {
  let o = '';
  const panel = (x0, title, flow, cost, enter) => {
    const W = [[x0 + 58, 80], [x0 + 58, 190]], S = [[x0 + 210, 50], [x0 + 210, 135], [x0 + 210, 220]];
    const C = [[4, 6, 9], [5, 3, 7]];
    o += text(x0 + 134, 18, title, 'tb', 'middle');
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
      const q = flow[i][j], [x1, y1] = W[i], [x2, y2] = S[j];
      const isE = enter && i === 0 && j === 2;
      const cls = q > 0 ? (isE ? 'ln' : 'ink-b') : isE ? 'ln-dash' : 'grid';
      o += line(x1 + 16, y1, x2 - 16, y2, cls);
    }
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) {
      const q = flow[i][j]; if (!q) continue;
      const [x1, y1] = W[i], [x2, y2] = S[j], t = i === 0 && j === 2 ? 0.4 : 0.68, lx = x1 + 16 + (x2 - 16 - x1 - 16) * t, ly = y1 + (y2 - y1) * t;
      o += rect(lx - 13, ly - 10, 26, 17, 'paper', 3) + text(lx, ly + 3, String(q), 'tb', 'middle');
    }
    ['W₁', 'W₂'].forEach((s, i) => { o += circle(W[i][0], W[i][1], 15, 'paper') + text(W[i][0], W[i][1] + 5, s, 'tb', 'middle') + text(W[i][0] - 22, W[i][1] + 5, String([30, 40][i]), 'ts', 'end'); });
    ['S₁', 'S₂', 'S₃'].forEach((s, j) => { o += circle(S[j][0], S[j][1], 15, 'paper') + text(S[j][0], S[j][1] + 5, s, 'tb', 'middle') + text(S[j][0] + 22, S[j][1] + 5, String([20, 25, 25][j]), 'ts', 'start'); });
    o += text(x0 + 134, 258, cost, 'ts', 'middle');
  };
  panel(0, 'Northwest corner', [[20, 10, 0], [0, 15, 25]], 'cost 360；W₁ → S₃ 的 reduced cost −1', true);
  panel(282, 'Optimal', [[20, 0, 10], [0, 25, 15]], 'cost 350；reduced cost 全部 ≥ 0', true);
  o += line(280, 40, 280, 245, 'grid');
  o += text(280, 282, '粗线是 basic arc（四条，组成 spanning tree），数字是运量；node 外侧是 supply / demand', 'ts', 'middle');
  return svg(560, 290, o, '两个仓库三家店的 transportation 问题：左边 northwest corner 方案 cost 360，W1 到 S3 的 reduced cost 为 -1；右边沿 cycle 调整 10 单位后的 optimal 方案 cost 350');
}

// ---------- 第 8 站：branch and bound tree ----------
function bb() {
  const W = 104, H = 40;
  const N = [
    { x: 280, y: 18, v: '22.2', xv: '(1, 0, 0.6, 1)', id: 0 },
    { x: 150, y: 96, v: '22', xv: '(1, 0, 1, 0.5)', id: 1, p: 0, e: 'x₃ = 1' },
    { x: 410, y: 96, v: '22', xv: '(1, 0.5, 0, 1)', id: 6, p: 0, e: 'x₃ = 0' },
    { x: 95, y: 176, v: '22', xv: '(0.75, 0, 1, 1)', id: 2, p: 1, e: 'x₄ = 1' },
    { x: 225, y: 176, v: '21.67', xv: '(1, ⅓, 1, 0)', id: 5, p: 1, e: 'x₄ = 0', dead: '剪掉：≤ 21' },
    { x: 345, y: 176, v: '21.5', xv: '(1, 1, 0, 0.25)', id: 7, p: 6, e: 'x₂ = 1', dead: '剪掉：≤ 21' },
    { x: 475, y: 176, v: '18', xv: '(1, 0, 0, 1)', id: 8, p: 6, e: 'x₂ = 0', dead: '剪掉：18 < 21' },
    { x: 57, y: 266, v: '—', xv: 'weight 17 > 15', id: 3, p: 2, e: 'x₁ = 1', dead: 'infeasible' },
    { x: 172, y: 266, v: '21', xv: '(0, 1, 1, 1)', id: 4, p: 2, e: 'x₁ = 0', inc: true },
  ];
  const byIdx = (i) => N.find((n) => n.id === i);
  let o = '';
  N.forEach((n) => {
    if (n.p === undefined) return;
    const q = byIdx(n.p), x1 = q.x, y1 = q.y + H, x2 = n.x, y2 = n.y;
    o += line(x1, y1, x2, y2, n.dead ? 'mute' : 'ink');
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    o += text(mx + (x2 < x1 ? -8 : 8), my + 4, n.e, 'ts', x2 < x1 ? 'end' : 'start');
  });
  N.forEach((n) => {
    const cls = n.inc ? 'wash-strong' : n.dead ? 'wash2' : 'paper';
    o += rect(n.x - W / 2, n.y, W, H, cls, 5) + (n.inc || n.dead ? rect(n.x - W / 2, n.y, W, H, 'frame', 5) : '');
    o += text(n.x, n.y + 16, 'node ' + n.id + '：' + n.v, n.inc ? 'tl' : 'tb', 'middle') + text(n.x, n.y + 32, n.xv, 'ts', 'middle');
    if (n.dead) o += text(n.x, n.y + H + 15, n.dead, 'ts', 'middle');
    if (n.inc) o += text(n.x, n.y + H + 15, 'integer：incumbent 21', 'tl', 'middle');
  });
  o += text(560, 300, '灰底是被剪掉的 node', 'ts', 'end');
  return svg(560, 330, o, 'Knapsack 的 branch and bound tree：root LP value 22.2，先在 x3 上分；node 4 得到 integer 解 (0,1,1,1)，value 21；node 5、7、8 因 bound 不超过 21 被剪掉，node 3 infeasible');
}

// ---------- 第 8 站：TSP 的 subtour ----------
function tsp() {
  const pos = { 1: [30, 175], 2: [55, 55], 3: [120, 115], 4: [160, 115], 5: [225, 55], 6: [250, 175] };
  const E = [[1, 2, 3], [2, 3, 3], [1, 3, 4], [4, 5, 3], [5, 6, 3], [4, 6, 4], [3, 4, 5], [1, 6, 5]];
  let o = '';
  const panel = (x0, title, tour, note) => {
    const P = (n) => [x0 + pos[n][0], pos[n][1]];
    o += text(x0 + 140, 20, title, 'tb', 'middle');
    const used = new Set(tour.map(([a, b]) => Math.min(a, b) + '-' + Math.max(a, b)));
    for (const [a, b, w] of E) {
      const [x1, y1] = P(a), [x2, y2] = P(b);
      const on = used.has(Math.min(a, b) + '-' + Math.max(a, b));
      if (!on) o += line(x1, y1, x2, y2, 'grid');
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, nx = -(y2 - y1), ny = x2 - x1, L = Math.hypot(nx, ny);
      let ox = (nx / L) * 11, oy = (ny / L) * 11;
      if (a === 3 && b === 4) { ox = 0; oy = -14; }
      if (a === 1 && b === 6) { ox = 0; oy = 16; }
      if (a === 1 && b === 3) { ox = -ox; oy = -oy; }
      if (a === 4 && b === 6) { ox = -ox; oy = -oy; }
      o += text(mx + ox, my + oy + 4, String(w), on ? 'tl' : 'ts', 'middle');
    }
    for (const [a, b] of tour) {
      const [x1, y1] = P(a), [x2, y2] = P(b), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      o += arrow(x1 + ux * 13, y1 + uy * 13, x2 - ux * 14, y2 - uy * 14, 'ln', 7);
    }
    for (const n of Object.keys(pos)) { const [x, y] = P(n); o += circle(x, y, 12, 'paper') + text(x, y + 4.5, n, 'tb', 'middle'); }
    o += text(x0 + 140, 222, note, 'ts', 'middle');
  };
  panel(0, '只有 assignment constraint', [[1, 2], [2, 3], [3, 1], [4, 6], [6, 5], [5, 4]], '两个 subtour，3+3+4 + 4+3+3 = 20');
  panel(280, '加上 S = {1, 2, 3} 的 constraint', [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1]], '一条 tour，3+3+5+3+3+5 = 22');
  o += line(280, 35, 280, 205, 'grid');
  o += text(280, 248, '画出的是距离 3、4、5 的 pair，其余 pair 的距离都是 9', 'ts', 'middle');
  return svg(560, 256, o, '6 个城市的 TSP：只有每个城市一进一出的 assignment constraint 时，解是 1-2-3 和 4-6-5 两个 subtour，总长 20；加上 S={1,2,3} 的 subtour elimination constraint 后得到 tour 1-2-3-4-5-6-1，总长 22');
}

export default {
  'ma3252-feasible': feasible,
  'ma3252-outcomes': outcomes,
  'ma3252-fit': fit,
  'ma3252-bases': bases,
  'ma3252-simplex': simplexA,
  'ma3252-cone': cone,
  'ma3252-sens': sensA,
  'ma3252-sptree': sptree,
  'ma3252-maxflow': maxflowA,
  'ma3252-transport': transport,
  'ma3252-bb': bb,
  'ma3252-tsp': tsp,
};
