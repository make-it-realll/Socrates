import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;
const fx = (v, k = 2) => { const s = (Math.round(v * 10 ** k) / 10 ** k).toString(); return s.replace('-', '−'); };
const pt = (p, k = 2) => '(' + p.map((v) => fx(v, k)).join(', ') + ')';
// 2D homogeneous matrix 工具
const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
const T2 = (x, y) => [[1, 0, x], [0, 1, y], [0, 0, 1]];
const R2 = (deg) => { const c = Math.cos(deg * R), s = Math.sin(deg * R); return [[c, -s, 0], [s, c, 0], [0, 0, 1]]; };
const S2 = (a, b) => [[a, 0, 0], [0, b, 0], [0, 0, 1]];
const I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const ap = (M, [x, y]) => [M[0][0] * x + M[0][1] * y + M[0][2], M[1][0] * x + M[1][1] * y + M[1][2]];
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

// ---------- 棋盘格地板：screen space 线性插值 vs perspective-correct ----------
// 地板 y = −1.5，x ∈ [−1, 1]，z 从 −1.5 到 −6；d = 1 投影
const floor3 = (s, t) => [-1 + 2 * s, -1.5, -1.5 - 4.5 * t];
const proj = ([x, y, z]) => [x / -z, y / -z];
function clipHalf(poly0, keep) { // keep(p) > 0 保留，Sutherland–Hodgman 一个 plane
  const out = [];
  for (let i = 0; i < poly0.length; i++) {
    const a = poly0[i], b = poly0[(i + 1) % poly0.length], fa = keep(a), fb = keep(b);
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push(lerp(a, b, t)); }
  }
  return out;
}
function checker(X0, Y0, sc, mode, n = 6) {
  // screen 坐标 → 画布：X ∈ [−2/3, 2/3]，Y ∈ [−1, −0.25]
  const P = ([X, Y]) => [X0 + (X + 2 / 3) * sc, Y0 + (-0.25 - Y) * sc];
  const corner = { nl: [0, 0], nr: [1, 0], fr: [1, 1], fl: [0, 1] };
  const scr = (st) => P(proj(floor3(...st)));
  let o = '';
  const cells = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2 === 0) cells.push([[i / n, j / n], [(i + 1) / n, j / n], [(i + 1) / n, (j + 1) / n], [i / n, (j + 1) / n]]);
  if (mode === 'persp') {
    for (const c of cells) o += poly(c.map(scr), 'solid2');
  } else {
    // 两个 triangle：(nl, nr, fr) 和 (nl, fr, fl)，各自在 screen 里对 (s, t) 做 affine 插值
    const tris = [[corner.nl, corner.nr, corner.fr, (p) => p[0] - p[1]], [corner.nl, corner.fr, corner.fl, (p) => p[1] - p[0]]];
    for (const [a, b, c, keep] of tris) {
      const Sa = scr(a), Sb = scr(b), Sc = scr(c);
      // st → barycentric（三个 st 顶点）→ screen
      const det = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);
      const map = ([s, t]) => {
        const be = ((s - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (t - a[1])) / det;
        const ga = ((b[0] - a[0]) * (t - a[1]) - (s - a[0]) * (b[1] - a[1])) / det;
        const al = 1 - be - ga;
        return [al * Sa[0] + be * Sb[0] + ga * Sc[0], al * Sa[1] + be * Sb[1] + ga * Sc[1]];
      };
      for (const cell of cells) { const q = clipHalf(cell, keep); if (q.length > 2) o += poly(q.map(map), 'solid2'); }
    }
    o += line(...scr([0, 0]), ...scr([1, 1]), 'ln-dash');
  }
  o += poly([[0, 0], [1, 0], [1, 1], [0, 1]].map(scr), 'ink');
  return o;
}

// ---------- 开头：三张出了错的图 ----------
function intro() {
  let o = '';
  // A：沿 y = −x − 5 reflect
  {
    const sx = lin(-8, 4, 12, 168), sy = lin(-9, 2.5, 196, 46);
    o += text(90, 20, '1. glScalef(1, −1, 1)', 'tb', 'middle');
    o += line(sx(-8), sy(0), sx(4), sy(0), 'axis') + line(sx(0), sy(-9), sx(0), sy(2.5), 'axis');
    o += text(sx(4) - 2, sy(0) - 5, 'x', 'ts', 'end');
    o += line(sx(-7.5), sy(2.5), sx(3.5), sy(-8.5), 'mute') + text(sx(-7.5) + 4, sy(2.5) - 4, 'y = −x − 5', 'ts', 'start');
    const sq = [[1, 1], [3, 1], [3, -1], [1, -1]];
    o += poly(sq.map(([x, y]) => [sx(x), sy(y)]), 'wash ink-s');
    o += circle(sx(1), sy(1), 3.5, 'ink-f') + circle(sx(1), sy(-1), 3.5, 'ln-f');
    const good = sq.map(([x, y]) => [-y - 5, -x - 5]);
    o += poly(good.map(([x, y]) => [sx(x), sy(y)]), 'ln-dash') + circle(sx(-6), sy(-6), 3.5, 'ln paper-f');
    o += text(sx(-5), sy(-8) + 15, '应在这里', 'ts', 'middle');
    o += text(90, 222, '沿 x 轴翻：(1, 1) 到了 (1, −1)，', 'ts', 'middle') + text(90, 238, '应该去的是 (−6, −6)', 'ts', 'middle');
  }
  // B：cube 的两个面，后画的盖住先画的
  {
    const X = 205, Y = 70, s = 82, dx = 34, dy = -26;
    o += text(280, 20, '2. 按程序顺序画面', 'tb', 'middle');
    o += poly([[X, Y], [X + s, Y], [X + s, Y + s], [X, Y + s]], 'paper');
    o += text(X + 10, Y + s - 10, 'front', 'ts', 'start');
    o += poly([[X + dx, Y + dy], [X + dx + s, Y + dy], [X + dx + s, Y + dy + s], [X + dx, Y + dy + s]], 'wash-strong ink-s');
    o += text(X + dx + s - 8, Y + dy + 18, 'back', 'tb', 'end');
    for (const [a, b] of [[[X, Y], [X + dx, Y + dy]], [[X + s, Y], [X + s + dx, Y + dy]], [[X + s, Y + s], [X + s + dx, Y + s + dy]], [[X, Y + s], [X + dx, Y + s + dy]]]) o += line(...a, ...b, 'mute');
    o += text(280, 222, 'back 离眼睛远，但后画，', 'ts', 'middle') + text(280, 238, '把 front 盖住了', 'ts', 'middle');
  }
  // C：地板棋盘格沿 diagonal 折断
  o += text(470, 20, '3. 斜放的地板贴棋盘格', 'tb', 'middle');
  o += checker(390, 92, 120, 'affine');
  o += text(470, 222, '四个 vertex 都对，格子却在', 'ts', 'middle') + text(470, 238, 'diagonal（虚线）处折断', 'ts', 'middle');
  return svg(560, 244, o, '三张出错的图：square 沿 x 轴而不是沿 y 等于 −x−5 翻转；cube 的背面后画，盖住了正面；倾斜地板上的棋盘格沿 diagonal 折断');
}

// ---------- 第 1 站 ----------
function pinhole() {
  const sx = lin(0, 8.6, 44, 536), u = (sx(1) - sx(0)), sy = (y) => 196 - y * u;
  let o = line(30, sy(0), 546, sy(0), 'axis') + text(546, sy(0) + 18, 'z', 'ts', 'end');
  // image plane
  o += line(sx(1), sy(-0.6), sx(1), sy(2.35), 'ink-b') + text(sx(1), sy(2.35) - 8, 'image plane z = d = 1', 'ts', 'middle');
  // 两个 similar triangle
  o += poly([[sx(0), sy(0)], [sx(4), sy(0)], [sx(4), sy(1)]], 'wash');
  o += poly([[sx(0), sy(0)], [sx(1), sy(0)], [sx(1), sy(0.25)]], 'wash-strong');
  o += line(sx(4), sy(0), sx(4), sy(1), 'dash') + line(sx(8), sy(0), sx(8), sy(2), 'dash');
  o += line(sx(0), sy(0), sx(8.4), sy(2.1), 'ln');
  o += circle(sx(0), sy(0), 5, 'ink-f') + text(sx(0), sy(0) + 20, 'eye', 'ts', 'middle');
  o += circle(sx(4), sy(1), 4.5, 'ink-f') + text(sx(4) - 4, sy(1) - 10, 'P = (2, 1, 4)', 't', 'end');
  o += circle(sx(8), sy(2), 4.5, 'ink-f') + text(sx(8) - 6, sy(2) - 10, 'P′ = (4, 2, 8)', 't', 'end');
  o += circle(sx(1), sy(0.25), 4, 'ln-f');
  o += text(sx(1) + 8, sy(0.25) - 26, it('y') + '<tspan class="sub" dy="3">p</tspan><tspan dy="-3"> = 0.25</tspan>', 'tl', 'start');
  o += text(sx(4) + 6, sy(0.5) + 4, 'y = 1', 'ts', 'start') + text(sx(8) + 6, sy(1) + 4, 'y = 2', 'ts', 'start');
  o += text(sx(2), sy(0) + 18, 'z = 4', 'ts', 'middle') + text(sx(6), sy(0) + 18, 'z = 8', 'ts', 'middle');
  o += text(290, 236, 'y_p / d = y / z：1 / 4 = 2 / 8 = 0.25，同一条视线上的点投到同一处', 'ts', 'middle');
  return svg(560, 244, o, '侧视 pinhole camera：eye 在 origin，image plane 在 z 等于 1；P 等于 (2,1,4) 和 P′ 等于 (4,2,8) 在同一条视线上，都投到 y_p 等于 0.25');
}

function pipeline() {
  // NDC 里的 triangle，一部分在 x > 1 外面
  const tri = [[-0.7, -0.8], [1.6, -0.15], [-0.1, 0.9]];
  const clipped = clipHalf(tri, (p) => 1 - p[0]);
  const W = 92, top = 44;
  const cols = [14, 152, 290, 428];
  let o = '';
  const titles = ['Vertex processing', 'Clipping', 'Rasterization', 'Fragment processing'];
  const coord = [['clip coordinates', '（画的是除以 w 后的 NDC）'], ['window coordinates', 'viewport 之后'], ['fragment：每个 pixel', '带插值的 color、depth'], ['frame buffer', 'color buffer + depth buffer']];
  const M = (x0) => ([x, y]) => [x0 + (x + 1) / 2 * W + 8, top + (1 - y) / 2 * W];
  cols.forEach((x0, k) => {
    o += text(x0 + 60, 22, titles[k], 'tb', 'middle');
    o += text(x0 + 60, top + W + 34, coord[k][0], 't', 'middle') + text(x0 + 60, top + W + 51, coord[k][1], 'ts', 'middle');
    if (k < 3) o += arrow(x0 + W + 24, top + 14, x0 + W + 42, top + 14, 'mute', 6);
  });
  // 1：NDC square + 完整 triangle
  {
    const m = M(cols[0]);
    o += poly([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(m), 'frame');
    o += poly(tri.map(m), 'wash ink-s');
    o += text(m([-1, -1])[0], m([-1, -1])[1] + 14, '−1', 'ts', 'middle') + text(m([1, -1])[0], m([1, -1])[1] + 14, '1', 'ts', 'middle');
  }
  // 2：裁掉 x > 1，换成 pixel
  {
    const m = M(cols[1]);
    o += poly([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(m), 'frame');
    o += poly(tri.map(m), 'dash');
    o += poly(clipped.map(m), 'wash ink-s');
    o += text(m([-1, -1])[0], m([-1, -1])[1] + 14, '0', 'ts', 'middle') + text(m([1, -1])[0], m([1, -1])[1] + 14, '10', 'ts', 'middle');
  }
  // 3、4：10×10 pixel
  const n = 10, cs = W / n;
  const inside = (P) => { const q = clipped; let pos = true; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; if ((b[0] - a[0]) * (P[1] - a[1]) - (b[1] - a[1]) * (P[0] - a[0]) < 0) pos = false; } return pos; };
  // barycentric 权重给 fragment 的颜色（vertex 0 最浅，vertex 2 最深）
  const [A, B, C] = tri, dt = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
  const shade = ([x, y]) => { const be = ((x - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (y - A[1])) / dt, ga = ((B[0] - A[0]) * (y - A[1]) - (x - A[0]) * (B[1] - A[1])) / dt; return 0.15 + 0.35 * be + 0.75 * ga; };
  for (const k of [2, 3]) {
    const x0 = cols[k] + 8;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const c = [-1 + (2 * i + 1) / n, 1 - (2 * j + 1) / n];
      const X = x0 + i * cs, Y = top + j * cs;
      if (inside(c)) o += k === 2 ? rect(X, Y, cs, cs, 'wash-strong') : `<rect x="${f1(X)}" y="${f1(Y)}" width="${f1(cs)}" height="${f1(cs)}" class="solid" opacity="${shade(c).toFixed(2)}"/>`;
      o += rect(X, Y, cs, cs, 'grid');
    }
    if (k === 2) o += poly(clipped.map(M(cols[2])), 'ink');
  }
  return svg(560, 210, o, 'Pipeline 的四个 stage：triangle 在 NDC 里一部分超出边界；clipping 裁掉超出的部分；rasterization 找出被盖住的 pixel；fragment processing 给每个 pixel 插值上色写进 frame buffer');
}

// ---------- 第 2 站 ----------
function order() {
  let o = '';
  const panel = (x0, title, mid, fin, corner, note) => {
    const sx = lin(-0.5, 9, x0, x0 + 237.5), sy = lin(-0.5, 5, 196, 58.5);
    for (let x = 0; x <= 9; x++) o += line(sx(x), sy(-0.5), sx(x), sy(5), 'grid');
    for (let y = 0; y <= 5; y++) o += line(sx(-0.5), sy(y), sx(9), sy(y), 'grid');
    o += line(sx(-0.5), sy(0), sx(9), sy(0), 'axis') + line(sx(0), sy(-0.5), sx(0), sy(5), 'axis');
    for (const x of [0, 3, 6, 9]) o += text(sx(x), sy(-0.5) + 14, String(x), 'ts', 'middle');
    const sq = ([a, b, w]) => poly([[a, b], [a + w, b], [a + w, b + w], [a, b + w]].map(([x, y]) => [sx(x), sy(y)]), 'ZZ');
    o += sq([0, 0, 1]).replace('ZZ', 'wash2 ink-s');
    o += sq(mid).replace('ZZ', 'dash');
    o += sq(fin).replace('ZZ', 'wash ink-s');
    o += circle(sx(1), sy(1), 3.5, 'ink-f') + circle(sx(corner[0]), sy(corner[1]), 4.5, 'ln-f');
    o += text(sx(corner[0]) + 7, sy(corner[1]) - 6, pt(corner), 'tl', 'start');
    o += text(x0 + 118, 22, title, 'tb', 'middle') + text(x0 + 118, 40, note, 'ts', 'middle');
  };
  panel(22, '先 scale 再 translate：TS', [0, 0, 2], [3, 1, 2], [5, 3], 'S 之后在 [0, 2]²（虚线），再平移 (3, 1)');
  panel(300, '先 translate 再 scale：ST', [3, 1, 1], [6, 2, 2], [8, 4], 'T 之后在 (3, 1) 起（虚线），再整体放大');
  o += text(280, 228, '灰色是原来的 unit square，黑点是 (1, 1)；右边的平移量也被放大成了 (6, 2)', 'ts', 'middle');
  return svg(560, 236, o, '同一个 unit square：先 scale 再 translate，角上的点 (1,1) 到了 (5,3)；先 translate 再 scale，到了 (8,4)');
}

function reflectA() {
  const steps = [
    [(f) => T2(0, 5 * f), 'T(0, 5)：line 上的 (0, −5) 到 origin'],
    [(f) => R2(45 * f), 'R(45°)：line 转到 x 轴上'],
    [(f) => S2(1, 1 - 2 * f), 'S(1, −1)：沿 x 轴翻'],
    [(f) => R2(-45 * f), 'R(−45°)：转回去'],
    [(f) => T2(0, -5 * f), 'T(0, −5)：搬回去'],
  ];
  const hold = 0.9, move = 1.3, sub = 12;
  const frames = [], kt = [], stepOf = [];
  let M = I3, t = 0;
  const T = hold + steps.length * (move + hold) + 0.8;
  const push = (Mx, k) => { frames.push(Mx); kt.push(t / T); stepOf.push(k); };
  push(M, -1); t += hold;
  steps.forEach(([g], k) => {
    for (let i = 1; i <= sub; i++) { t += move / sub; push(mul(g(i / sub), M), k); }
    M = mul(g(1), M); t += hold; push(M, k);
  });
  t = T; push(M, 4);
  const sx = lin(-8.5, 7.5, 20, 276), sy = lin(-9, 7.5, 284, 20);
  const P = (p) => [sx(p[0]), sy(p[1])];
  const sq = [[1, 1], [3, 1], [3, -1], [1, -1]];
  const sqD = (Mx) => d([...sq, sq[0]].map((p) => P(ap(Mx, p)))) + 'Z';
  const dir = [1 / Math.SQRT2, -1 / Math.SQRT2], base = [0, -5];
  const lnD = (Mx) => d([-13, 13].map((s) => P(ap(Mx, [base[0] + s * dir[0], base[1] + s * dir[1]]))));
  let o = '<defs><clipPath id="cs3241-rclip"><rect x="20" y="20" width="256" height="264"/></clipPath></defs>';
  o += rect(20, 20, 256, 264, 'frame');
  o += `<g clip-path="url(#cs3241-rclip)">`;
  o += line(sx(-8.5), sy(0), sx(7.5), sy(0), 'axis') + line(sx(0), sy(-9), sx(0), sy(7.5), 'axis');
  o += path(lnD(I3), 'grid');
  o += poly(sq.map((p) => P([-p[1] - 5, -p[0] - 5])), 'dash');
  o += apath(frames.map(lnD), kt, T, 'ln');
  o += apath(frames.map(sqD), kt, T, 'wash ink-s');
  const c = frames.map((Mx) => P(ap(Mx, [1, 1])));
  o += acircle(c.map((p) => p[0]), c.map((p) => p[1]), kt, T, 4, 'ink-f');
  o += '</g>';
  o += text(sx(7.3), sy(0) - 6, 'x', 'ts', 'end') + text(sx(0) + 6, sy(7.2) + 4, 'y', 'ts', 'start');
  o += text(sx(-4) + 6, sy(-8.2), '目标（虚线）', 'ts', 'start');
  o += text(sx(-7.8), sy(3.3), 'y = −x − 5', 'ts', 'start');
  // 右边：步骤表
  const X = 296;
  o += text(X, 34, '从右往左作用的五步', 'tb', 'start');
  o += text(X, 52, '彩线是 line 跟着一起变换的样子', 'ts', 'start');
  steps.forEach(([, s], k) => {
    const y = 84 + k * 30;
    o += `<rect x="${X - 6}" y="${y - 17}" width="268" height="25" rx="4" class="wash">${ashow(stepOf.map((j) => j === k), kt, T)}</rect>`;
    o += text(X, y, (k + 1) + '. ' + s, 't', 'start');
  });
  o += text(X, 252, '黑点是 vertex (1, 1)，最后到 (−6, −6)。', 'ts', 'start');
  o += text(X, 270, 'Line 走一圈回到原处，自己不动。', 'ts', 'start');
  return svgA(560, 290, o, '动图：square 依次经过 T(0,5)、R(45°)、S(1,−1)、R(−45°)、T(0,−5)，line 跟着先被搬到 x 轴再搬回原处；最后 square 落在关于 y=−x−5 对称的位置');
}

function orbit() {
  const u = 34, O = [80, 248], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  const E = [5 * Math.sin(45 * R), 5 * Math.cos(45 * R)], Mn = [6 * Math.sin(45 * R), 6 * Math.cos(45 * R)];
  let o = line(...P([-1.2, 0]), ...P([6.8, 0]), 'axis') + line(...P([0, -0.6]), ...P([0, 7]), 'axis');
  o += text(...P([6.8, -0.5]), 'x', 'ts', 'end') + text(P([0, 7])[0] + 8, P([0, 7])[1] + 4, 'y', 'ts', 'start');
  const arc = (c, r, a0, a1, cls) => { const pts = []; for (let k = 0; k <= 60; k++) { const a = (a0 + (a1 - a0) * k / 60) * R; pts.push(P([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])); } return path(d(pts), cls); };
  o += arc([0, 0], 5, -10, 100, 'grid');
  o += arc([0, 0], 1.4, 90, 45, 'ink') + text(...P([0.75, 1.65]), '45°', 'ts', 'middle');
  o += circle(...P([0, 5]), 6, 'mute') + text(P([0, 5])[0] - 10, P([0, 5])[1] + 4, '(0, 5)', 'ts', 'end');
  o += line(...P([0, 0]), ...P(E), 'dash');
  // earth 的 coordinate system：转了 −45°
  const xe = [Math.cos(-45 * R), Math.sin(-45 * R)], ye = [-xe[1], xe[0]];
  o += arrow(...P(E), ...P([E[0] + 1.6 * xe[0], E[1] + 1.6 * xe[1]]), 'ln', 6) + arrow(...P(E), ...P([E[0] + 1.6 * ye[0], E[1] + 1.6 * ye[1]]), 'ln', 6);
  o += text(...P([E[0] + 1.85 * xe[0] + 0.1, E[1] + 1.85 * xe[1] - 0.1]), it('x') + '<tspan class="sub" dy="3">earth</tspan>', 'tl', 'start');
  o += text(...P([E[0] + 1.85 * ye[0] + 0.25, E[1] + 1.85 * ye[1] + 0.05]), it('y') + '<tspan class="sub" dy="3">earth</tspan>', 'tl', 'start');
  o += arc(E, 1, 0, 360, 'grid');
  o += circle(...P([0, 0]), 14, 'solid') + text(P([0, 0])[0] + 18, P([0, 0])[1] + 22, 'sun', 'ts', 'start');
  o += circle(...P(E), 9, 'paper') + circle(...P(Mn), 5, 'ink-f');
  o += text(P(E)[0] - 40, P(E)[1] + 5, 'earth ' + pt(E), 't', 'end');
  o += text(P(E)[0] + 30, P(E)[1] - 44, 'moon ' + pt(Mn), 't', 'end');
  const X = 322;
  o += text(X, 40, '从上往下读：移动 coordinate system', 'tb', 'start');
  const rows = ['glRotatef(45, 0, 0, −1)：clockwise 转 45°', 'glTranslatef(0, 5, 0)：沿转过的 y 走 5', '→ 这里是 earth 的 origin，画 earth', 'glRotatef(0, 0, 0, −1)：moonAngle = 0', 'glTranslatef(0, 1, 0)：沿 y_earth 再走 1', '→ 画 moon'];
  rows.forEach((s, k) => { o += text(X, 66 + k * 22, s, k === 2 || k === 5 ? 'tl' : 'ts', 'start'); });
  o += text(X, 214, 'Moon 的 CTM 是 R_e T(0, 5) R_m T(0, 1)：', 'ts', 'start') + text(X, 232, '在 earth 的 CTM 后面接着乘', 'ts', 'start');
  return svg(560, 272, o, 'Sun 在 origin；earth 由 (0,5) 顺时针转 45 度到 (3.54,3.54)，它的 coordinate system 也转了 45 度；moon 在 earth 的 y 方向再走 1，到 (4.24,4.24)');
}

function stack() {
  const u = 74, O = [150, 150], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  let o = '';
  const sqs = [];
  const rec = (c, h, n, path0) => { sqs.push([c, h, path0]); if (n > 1) for (const i of [-1, 1]) for (const j of [-1, 1]) rec([c[0] + i * h, c[1] + j * h], h / 2, n - 1, path0 && i === 1 && j === 1); };
  rec([0, 0], 1, 3, true);
  for (const [c, h, hot] of sqs) {
    const q = [[c[0] - h, c[1] - h], [c[0] + h, c[1] - h], [c[0] + h, c[1] + h], [c[0] - h, c[1] + h]].map(P);
    o += poly(q, hot ? (h === 0.25 ? 'wash-strong ink-s' : 'wash ink-s') : 'ink');
  }
  o += circle(...P([0, 0]), 3, 'ink-f') + text(P([0, 0])[0] + 6, P([0, 0])[1] + 14, '(0, 0)', 'ts', 'start');
  o += circle(...P([1, 1]), 3, 'ink-f') + text(P([1, 1])[0] - 6, P([1, 1])[1] + 14, '(1, 1)', 'ts', 'end');
  o += circle(...P([1.5, 1.5]), 3, 'ink-f');
  o += text(150, 292, 'n = 3：1 + 4 + 16 个 square', 'ts', 'middle');
  // 右：stack
  const X = 340, bw = 200, bh = 40;
  o += text(X + bw / 2, 22, '画右上角最小的那个 square 时', 'tb', 'middle');
  o += rect(X, 46, bw, bh + 6, 'paper', 4) + text(X + bw / 2, 66, 'current C', 'tb', 'middle') + text(X + bw / 2, 84, 'C₁ T(1, 1) S(½)', 't', 'middle');
  o += text(X + bw / 2, 118, 'stack（从顶往下）', 'ts', 'middle');
  o += rect(X, 128, bw, bh, 'wash', 4) + text(X + 10, 144, 'C₁ = C₀ T(1, 1) S(½)', 't', 'start') + text(X + 10, 161, 'child (1, 1) 的 push', 'ts', 'start');
  o += rect(X, 128 + bh + 6, bw, bh, 'wash2', 4) + text(X + 10, 144 + bh + 6, 'C₀', 't', 'start') + text(X + 10, 161 + bh + 6, 'root 的 push', 'ts', 'start');
  o += line(X - 6, 128 + 2 * bh + 12, X + bw + 6, 128 + 2 * bh + 12, 'ink');
  o += text(X + bw / 2, 250, '画完 pop 一次回到 C₁，', 'ts', 'middle') + text(X + bw / 2, 268, '同一层的下一个 child 从 C₁ 出发', 'ts', 'middle');
  return svg(560, 300, o, 'drawRecursiveSquare(3) 画出的 21 个 square，标出右上角一支；右边是画最小那个 square 时 current matrix 和 stack 里的两个 matrix');
}

function normal() {
  let o = '';
  const panel = (x0, title, M, showBad) => {
    const u = 92, O = [x0 + 24, 160], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
    const a = [0, 0], b = ap(M, [1, 1]);
    // surface：有厚度的 slab
    const tdir = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...tdir), tn = [tdir[0] / L, tdir[1] / L], nn = [tn[1], -tn[0]];
    const th = 0.06;
    o += poly([a, b, [b[0] - th * nn[0], b[1] - th * nn[1]], [a[0] - th * nn[0], a[1] - th * nn[1]]].map(P), 'wash2 ink-s');
    o += line(...P(a), ...P(b), 'ink-b');
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const draw = (v, cls, lab, dx, dy) => { const l = Math.hypot(...v), e = [m[0] + 0.62 * v[0] / l, m[1] + 0.62 * v[1] / l]; o += arrow(...P(m), ...P(e), cls) + text(P(e)[0] + dx, P(e)[1] + dy, lab, cls === 'ln' ? 'tl' : 'tb', 'start'); return e; };
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    if (!showBad) {
      draw([1, -1], 'ln', 'n = (1, −1)/√2', 6, 6);
    } else {
      const eb = draw([2, -1], 'mute', 'Mn ∝ (2, −1)', 6, 4);
      const eg = draw([0.5, -1], 'ln', '', 0, 0);
      o += text(P(eg)[0] - 8, P(eg)[1] + 14, '(M⁻¹)ᵀn ∝ (½, −1)', 'tl', 'end');
      o += text(P(eb)[0] + 6, P(eb)[1] + 22, '和 surface 成 53.1°', 'ts', 'start');
    }
    // right-angle mark on the correct normal
    const nv = showBad ? [0.5, -1] : [1, -1], nl = Math.hypot(...nv), nu = [nv[0] / nl, nv[1] / nl], s = 0.09;
    o += path(d([[m[0] + s * tn[0], m[1] + s * tn[1]], [m[0] + s * tn[0] + s * nu[0], m[1] + s * tn[1] + s * nu[1]], [m[0] + s * nu[0], m[1] + s * nu[1]]].map(P)), 'ink');
    o += text(P(b)[0] + 6, P(b)[1] - 6, 'tangent ' + pt(b), 'ts', 'end');
  };
  panel(10, '原来：surface 沿 (1, 1)', I3, false);
  panel(270, '乘 M = S(2, 1) 之后', S2(2, 1), true);
  o += text(280, 244, '直接乘 M 的 normal 和 tangent 的 dot product 是 3 / √2 ≠ 0；乘 (M⁻¹)ᵀ 的是 0', 'ts', 'middle');
  return svg(560, 252, o, '左边是沿 (1,1) 的 surface 和它的 normal；右边 x 方向拉长一倍后，直接乘 M 的 normal 与 surface 成 53.1 度，乘 M 逆的转置的 normal 仍然 perpendicular');
}

// ---------- 第 3 站 ----------
function lookat() {
  // 俯视：画布向右是 world x，向下是 world z
  const u = 46, O = [110, 52], P = ([x, z]) => [O[0] + x * u, O[1] + z * u];
  const e = [3, 4], n = [0.6, 0.8], uu = [0.8, -0.6];
  let o = line(...P([-1.6, 0]), ...P([4.6, 0]), 'axis') + line(...P([0, -0.7]), ...P([0, 5.2]), 'axis');
  o += text(P([4.6, 0])[0], P([4.6, 0])[1] - 6, 'world x', 'ts', 'end') + text(P([0, 5.2])[0] - 6, P([0, 5.2])[1], 'world z', 'ts', 'end');
  // 视线
  o += line(...P(e), ...P([0, 0]), 'dash');
  // camera：画成一个有厚度的机身 + 镜头
  const body = [[-0.24, -0.15], [0.24, -0.15], [0.24, 0.25], [-0.24, 0.25]].map(([a, b]) => [e[0] + a * uu[0] + b * n[0], e[1] + a * uu[1] + b * n[1]]);
  const lens = [[-0.12, -0.15], [0.12, -0.15], [0.18, -0.34], [-0.18, -0.34]].map(([a, b]) => [e[0] + a * uu[0] + b * n[0], e[1] + a * uu[1] + b * n[1]]);
  o += poly(body.map(P), 'paper') + poly(lens.map(P), 'paper');
  o += arrow(...P(e), ...P([e[0] + 1.3 * n[0], e[1] + 1.3 * n[1]]), 'ln') + text(P([e[0] + 1.3 * n[0], e[1] + 1.3 * n[1]])[0] + 6, P([e[0] + 1.3 * n[0], e[1] + 1.3 * n[1]])[1] + 4, 'n = (0.6, 0, 0.8)', 'tl', 'start');
  o += arrow(...P(e), ...P([e[0] + 1.3 * uu[0], e[1] + 1.3 * uu[1]]), 'ln') + text(P([e[0] + 1.3 * uu[0], e[1] + 1.3 * uu[1]])[0] + 6, P([e[0] + 1.3 * uu[0], e[1] + 1.3 * uu[1]])[1] + 4, 'u = (0.8, 0, −0.6)', 'tl', 'start');
  o += text(P(e)[0] - 16, P(e)[1] + 24, 'eye (3, 0, 4)', 't', 'end');
  o += text(P(e)[0] - 16, P(e)[1] + 40, 'v = (0, 1, 0) 指出纸面', 'ts', 'end');
  // 点 (1, 0, 0) 的分解：沿 −n 走 4.4，沿 u 走 0.8
  const q = [1, 0], foot = [e[0] - 4.4 * n[0], e[1] - 4.4 * n[1]];
  o += line(...P(foot), ...P(q), 'ink') + circle(...P(foot), 2.5, 'ink-f');
  o += circle(...P([0, 0]), 4.5, 'paper') + text(P([0, 0])[0] - 8, P([0, 0])[1] - 8, 'at (0, 0, 0)', 't', 'end');
  o += circle(...P(q), 4.5, 'ink-f') + text(P(q)[0] + 8, P(q)[1] - 8, '(1, 0, 0)', 'tb', 'start');
  o += text((P(foot)[0] + P(q)[0]) / 2 + 2, (P(foot)[1] + P(q)[1]) / 2 + 16, '0.8 沿 u', 'ts', 'start');
  const mid = [e[0] - 2.4 * n[0], e[1] - 2.4 * n[1]];
  o += text(P(mid)[0] - 8, P(mid)[1] + 4, '4.4 沿 −n', 'ts', 'end');
  const X = 370;
  o += text(X, 40, 'Camera coordinates', 'tb', 'start');
  o += text(X, 62, 'at：(0, 0, −5)', 't', 'start') + text(X, 80, '正前方 5 个单位', 'ts', 'start');
  o += text(X, 106, '(1, 0, 0)：(0.8, 0, −4.4)', 't', 'start') + text(X, 124, '前方 4.4，偏右 0.8', 'ts', 'start');
  o += text(X, 152, 'Camera 看向自己的 −n，', 'ts', 'start') + text(X, 170, '所以前方的点 z 是负的', 'ts', 'start');
  return svg(560, 300, o, '俯视 gluLookAt(3,0,4, 0,0,0, 0,1,0)：camera 在 (3,0,4) 看向 origin，n 从 origin 指回 camera，u 指向 camera 右边；点 (1,0,0) 沿负 n 方向 4.4、沿 u 方向 0.8');
}

function frustumA() {
  const n0 = 1, f0 = 100, A = -(f0 + n0) / (f0 - n0), B = -2 * f0 * n0 / (f0 - n0);
  const zn = (ze) => (A * ze + B) / -ze;
  const k = 0.8 / 4.4; // x_e = k·(−z_e)，过 eye 的同一条视线
  // 左：俯视 camera space，向上是 −z
  const u = 22, O = [140, 262], P = ([x, z]) => [O[0] + x * u, O[1] + z * u];
  let o = '';
  const zmax = 10.6;
  o += '<defs><clipPath id="cs3241-fclip"><rect x="8" y="30" width="264" height="244"/></clipPath></defs>';
  o += '<g clip-path="url(#cs3241-fclip)">' + poly([[-1, -1], [1, -1], [zmax, -zmax], [-zmax, -zmax]].map(P), 'wash');
  o += line(...P([0, 0]), ...P([zmax, -zmax]), 'ink') + line(...P([0, 0]), ...P([-zmax, -zmax]), 'ink') + '</g>';
  o += line(...P([-1, -1]), ...P([1, -1]), 'ink-b') + text(P([1, -1])[0] + 6, P([1, -1])[1] + 4, 'near z = −1', 'ts', 'start');
  o += line(...P([0, 0.4]), ...P([0, -zmax]), 'axis') + text(P([0, -zmax])[0] + 5, P([0, -zmax])[1] + 10, '−z', 'ts', 'start');
  o += line(...P([0, 0]), ...P([k * zmax, -zmax]), 'ln-dash');
  o += text(P([-6, -10.2])[0], P([-6, -10.2])[1], 'far = 100 在画面外', 'ts', 'start');
  o += circle(...P([0, 0]), 4, 'ink-f') + text(P([0, 0])[0] - 8, P([0, 0])[1] + 4, 'eye', 'ts', 'end');
  for (const z of [-2, -4.4, -10]) o += line(...P([-0.25 + k * -z, z]), ...P([0.25 + k * -z, z]), 'mute') + text(P([k * -z, z])[0] + 10, P([k * -z, z])[1] + 4, 'z = ' + fx(z, 1), 'ts', 'start');
  o += text(140, 20, 'Camera space（俯视）', 'tb', 'middle');
  // 右：NDC，横 x_n，竖 z_n（+1 在上）
  const Q = ([x, z]) => [400 + x * 85, 150 - z * 85];
  o += text(400, 20, 'NDC（俯视）', 'tb', 'middle');
  o += rect(...Q([-1, 1]), 170, 170, 'wash2') + rect(...Q([-1, 1]), 170, 170, 'frame');
  o += line(...Q([k, -1]), ...Q([k, 1]), 'ln-dash');
  o += text(Q([-1, -1])[0], Q([-1, -1])[1] + 16, '−1', 'ts', 'middle') + text(Q([1, -1])[0], Q([1, -1])[1] + 16, '1', 'ts', 'middle') + text(Q([0, -1])[0], Q([0, -1])[1] + 16, it('x') + '<tspan class="sub" dy="3">n</tspan>', 't', 'middle');
  for (const [ze, lab] of [[-1, '−1'], [-2, '0.01'], [-4.4, '0.56'], [-10, '0.82'], [-100, '1']]) {
    const y = Q([0, zn(ze)])[1];
    o += line(Q([-1, 0])[0] - 5, y, Q([-1, 0])[0], y, 'axis') + text(Q([-1, 0])[0] - 8, y + 4 + (ze === -10 ? 6 : ze === -100 ? -4 : 0), lab, 'ts', 'end');
    o += line(Q([1, 0])[0], y, Q([1, 0])[0] + 5, y, 'axis');
    o += text(Q([1, 0])[0] + 8, y + 4 + (ze === -10 ? 6 : ze === -100 ? -4 : 0), fx(ze, 1), 'ts', 'start');
  }
  o += text(Q([1, 0])[0] + 8, Q([0, 1])[1] - 22, it('z') + '<tspan class="sub" dy="3">e</tspan>', 't', 'start');
  o += text(Q([-1, 0])[0] - 8, Q([0, 1])[1] - 22, it('z') + '<tspan class="sub" dy="3">n</tspan>', 't', 'end');
  // 动：z_e 从 −1 匀速走到 −10，再停住
  const N = 60, Tm = 5, hold = 1.2, T = Tm + hold * 2, kt = [0], zs = [-4.4];
  // 第一帧在示例点 (0.8, −4.4)，再回到 near，匀速走到 −10，停
  kt.push(hold / T); zs.push(-4.4);
  kt.push((hold + 0.4) / T); zs.push(-1);
  for (let i = 1; i <= N; i++) { kt.push((hold + 0.4 + (Tm - 0.4) * i / N) / T); zs.push(-1 - 9 * i / N); }
  kt.push((Tm + hold * 2 - 0.5) / T); zs.push(-10);
  kt.push(1); zs.push(-4.4);
  const L = zs.map((z) => P([k * -z, z])), Rr = zs.map((z) => Q([k, zn(z)]));
  o += acircle(L.map((p) => p[0]), L.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += acircle(Rr.map((p) => p[0]), Rr.map((p) => p[1]), kt, T, 5, 'ln-f');
  o += text(140, 296, '点每秒在 z 上走同样的距离', 'ts', 'middle');
  o += text(400, 296, '右边的点越走越慢，挤向 z_n = 1', 'ts', 'middle');
  return svgA(560, 302, o, '动图：gluPerspective(90,1,1,100)；左边俯视 camera space，一个点沿过 eye 的视线从 z=−1 匀速走到 z=−10；右边 NDC 里它的 x_n 恒为 0.18，z_n 从 −1 很快升到 0.56、0.82，再往远处挤到 1 附近');
}

// ---------- 第 4 站 ----------
function outcode() {
  const sx = lin(-5, 15, 24, 384), sy = lin(-2, 13, 290, 20);
  const P = ([x, y]) => [sx(x), sy(y)];
  let o = rect(sx(0), sy(8), sx(10) - sx(0), sy(0) - sy(8), 'wash');
  for (const x of [0, 10]) o += line(sx(x), sy(-2), sx(x), sy(13), 'grid');
  for (const y of [0, 8]) o += line(sx(-5), sy(y), sx(15), sy(y), 'grid');
  o += rect(sx(0), sy(8), sx(10) - sx(0), sy(0) - sy(8), 'ink');
  const code = (x, y) => (y > 8 ? '1' : '0') + (y < 0 ? '1' : '0') + (x > 10 ? '1' : '0') + (x < 0 ? '1' : '0');
  for (const [x, y] of [[-2.5, 10.5], [8, 10.5], [12.5, 11.5], [-1.6, 0.7], [5, 4], [14.2, 4], [-2.5, -1], [5, -1], [12.5, -1]]) o += text(sx(x), sy(y) + 4, code(x, y), x === 5 && y === 4 ? 'tb' : 'ts', 'middle');
  o += text(sx(0) + 4, sy(0) + 14, '0', 'ts', 'start') + text(sx(10) - 4, sy(0) + 14, '10', 'ts', 'end');
  o += text(sx(-5) + 2, sy(8) - 4, 'y = 8', 'ts', 'start') + text(sx(-5) + 2, sy(0) - 4, 'y = 0', 'ts', 'start');
  // 第一条：reject
  o += line(...P([12, 1]), ...P([14, 9]), 'mute') + circle(...P([12, 1]), 3, 'mute-f') + circle(...P([14, 9]), 3, 'mute-f');
  o += text(sx(14) + 4, sy(9) - 6, '① reject', 'ts', 'end');
  // 第二条：切两次
  o += line(...P([-4, 2]), ...P([6, 12]), 'dash') + line(...P([0, 6]), ...P([2, 8]), 'ln');
  for (const p of [[-4, 2], [6, 12]]) o += circle(...P(p), 3, 'ink-f');
  for (const p of [[0, 6], [2, 8]]) o += circle(...P(p), 4, 'ln-f');
  o += text(sx(-4) - 4, sy(2) + 16, '(−4, 2)', 'ts', 'middle') + text(sx(6) + 6, sy(12) + 4, '② (6, 12)', 'ts', 'start');
  o += text(sx(0) + 6, sy(6) + 14, '(0, 6)', 'tl', 'start') + text(sx(2) + 6, sy(8) + 15, '(2, 8)', 'tl', 'start');
  // 第三条：切一刀后 reject
  o += line(...P([-3, 5]), ...P([0, 8.5]), 'dash') + line(...P([0, 8.5]), ...P([3, 12]), 'mute');
  o += circle(...P([-3, 5]), 3, 'ink-f') + circle(...P([3, 12]), 3, 'ink-f') + circle(...P([0, 8.5]), 4, 'paper');
  o += text(sx(-3) - 6, sy(5) + 4, '(−3, 5)', 'ts', 'end') + text(sx(3) + 6, sy(12) + 4, '③ (3, 12)', 'ts', 'start');
  o += text(sx(0) - 6, sy(8.5) - 6, '(0, 8.5)', 'ts', 'end');
  const X = 404;
  o += text(X, 40, 'bit：top bottom right left', 'ts', 'start');
  o += text(X, 72, '① AND = 0010', 't', 'start') + text(X, 90, '直接 reject', 'ts', 'start');
  o += text(X, 124, '② AND = 0000', 't', 'start') + text(X, 142, '切到 x = 0，再切到 y = 8', 'ts', 'start') + text(X, 160, '剩下 (0, 6) 到 (2, 8)', 'ts', 'start');
  o += text(X, 194, '③ AND = 0000', 't', 'start') + text(X, 212, '切到 x = 0 得 (0, 8.5)', 'ts', 'start') + text(X, 230, '两端都是 1000：reject', 'ts', 'start');
  return svg(560, 300, o, 'Window 0 到 10 乘 0 到 8 把 plane 分成 9 个区域，各标 outcode；三条 segment：第一条直接 reject，第二条被裁成 (0,6) 到 (2,8)，第三条切到 (0,8.5) 后 reject');
}

function bresenhamA() {
  const c = 40, gx0 = 4, gy0 = 7, cols = 7, rows = 6, X0 = 18, Y0 = 20;
  const P = ([x, y]) => [X0 + (x - gx0 + 0.5) * c, Y0 + (gy0 + rows - 1 - y + 0.5) * c];
  const cell = ([x, y], cls) => rect(X0 + (x - gx0) * c, Y0 + (gy0 + rows - 1 - y) * c, c, c, cls);
  const dx = 4, dy = 3;
  const pix = [[5, 8]], ds = [], ch = [];
  let dd = 2 * dy - dx, y = 8;
  for (let x = 5; x < 9; x++) { ds.push(dd); if (dd >= 0) { ch.push('NE'); y++; dd += 2 * (dy - dx); } else { ch.push('E'); dd += 2 * dy; } pix.push([x + 1, y]); }
  // 第一帧是走完的结果，之后从 (5, 8) 一步步重走
  const seq = [4, 0, 1, 2, 3, 4], dur = 1.7, T = seq.length * dur, kt = seq.map((_, i) => i / seq.length);
  const on = (k) => ashow(seq.map((i) => i === k), kt, T);
  const from = (k) => ashow(seq.map((i) => i >= k), kt, T);
  let o = '';
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) o += cell([gx0 + i, gy0 + j], 'grid');
  for (let i = 0; i < cols; i++) o += text(X0 + (i + 0.5) * c, Y0 + rows * c + 16, String(gx0 + i), 'ts', 'middle');
  for (let j = 0; j < rows; j++) o += text(X0 - 6, Y0 + (rows - 1 - j + 0.5) * c + 4, String(gy0 + j), 'ts', 'end');
  pix.forEach((p, k) => { o += `<g>${cell(p, 'wash-strong')}${from(k)}</g>`; });
  o += line(...P([5, 8]), ...P([9, 11]), 'ink');
  for (let k = 0; k < 4; k++) {
    const [x, yy] = pix[k];
    const E = [x + 1, yy], NE = [x + 1, yy + 1], M = [x + 1, yy + 0.5];
    const pick = ch[k] === 'NE' ? NE : E;
    o += `<g>${cell(E, 'ln-dash')}${cell(NE, 'ln-dash')}${cell(pick, 'ln')}${circle(...P(M), 4.5, 'ink-f')}${text(P(M)[0] + 8, P(M)[1] + 4, 'M', 'tb', 'start')}${text(P(E)[0], P(E)[1] + 5, 'E', 'ts', 'middle')}${text(P(NE)[0], P(NE)[1] + 5, 'NE', 'ts', 'middle')}${on(k)}</g>`;
  }
  const X = 322;
  o += text(X, 34, 'd₀ = 2Δy − Δx = 2', 'tb', 'start');
  o += text(X, 54, '选 E：d += 2Δy = 6', 'ts', 'start') + text(X, 72, '选 NE：d += 2(Δy − Δx) = −2', 'ts', 'start');
  pix.forEach((p, k) => {
    const yy = 108 + k * 28;
    const s = k < 4 ? pt(p) + '：d = ' + fx(ds[k]) + (ds[k] >= 0 ? ' ≥ 0 → NE' : ' < 0 → E') : pt(p) + '：终点';
    o += `<g><rect x="${X - 6}" y="${yy - 17}" width="226" height="24" rx="4" class="wash">${on(k)}</rect>${text(X, yy, s, 't', 'start')}${from(k)}</g>`;
  });
  o += text(X, 260, 'M 在 line 下方（d ≥ 0）就选 NE', 'ts', 'start');
  return svgA(560, 280, o, '动图：Bresenham 从 (5,8) 走到 (9,11)，每一步显示候选 pixel E 和 NE、它们之间的 midpoint M 和当时的 d：2 选 NE，0 选 NE，−2 选 E，4 选 NE');
}

function edge() {
  const c = 34, X0 = 24, Y0 = 16, W = 8, H = 7;
  const P = ([x, y]) => [X0 + x * c, Y0 + (H - y) * c];
  const A = [1, 1], B = [7, 2], C = [3, 6];
  const E = (a, b) => (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const eAB = E(A, B), eBC = E(B, C), eCA = E(C, A);
  let o = '';
  for (let i = 0; i < W; i++) for (let j = 0; j < H; j++) {
    const p = [i + 0.5, j + 0.5];
    if (eAB(p) >= 0 && eBC(p) >= 0 && eCA(p) >= 0) o += rect(X0 + i * c, Y0 + (H - 1 - j) * c, c, c, i === 4 && j === 3 ? 'wash-strong' : 'wash');
  }
  for (let i = 0; i <= W; i++) o += line(X0 + i * c, Y0, X0 + i * c, Y0 + H * c, 'grid');
  for (let j = 0; j <= H; j++) o += line(X0, Y0 + j * c, X0 + W * c, Y0 + j * c, 'grid');
  for (let i = 0; i <= W; i += 2) o += text(X0 + i * c, Y0 + H * c + 15, String(i), 'ts', 'middle');
  for (let j = 0; j <= H; j += 2) o += text(X0 - 6, Y0 + (H - j) * c + 4, String(j), 'ts', 'end');
  o += rect(...P([1, 6]), 6 * c, 5 * c, 'dash');
  o += poly([A, B, C].map(P), 'ink-b');
  const p = [4.5, 3.5];
  for (const v of [A, B, C]) o += line(...P(p), ...P(v), 'mute');
  o += circle(...P(p), 4, 'ln-f');
  const cen = (a, b) => [(a[0] + b[0] + p[0]) / 3, (a[1] + b[1] + p[1]) / 3];
  o += text(...P([5.25, 3.17]), 'α', 'tl', 'middle') + text(...P(cen(C, A)).map((v, i) => v + (i ? 4 : 0)), 'β', 'tl', 'middle') + text(...P(cen(A, B)).map((v, i) => v + (i ? 4 : 0)), 'γ', 'tl', 'middle');
  o += text(P(A)[0] - 6, P(A)[1] + 14, 'A', 'tb', 'end') + text(P(B)[0] + 6, P(B)[1] + 4, 'B', 'tb', 'start') + text(P(C)[0], P(C)[1] - 8, 'C', 'tb', 'middle');
  o += text(P([7, 6])[0] - 4, P([7, 6])[1] - 5, 'bounding box', 'ts', 'end');
  const X = 318;
  o += text(X, 34, 'Pixel 中心 p = (4.5, 3.5)', 'tb', 'start');
  o += text(X, 58, 'E_AB(p) = 11.5', 't', 'start') + text(X, 78, 'E_BC(p) = 4', 't', 'start') + text(X, 98, 'E_CA(p) = 12.5', 't', 'start');
  o += text(X, 120, '都 ≥ 0：在 triangle 里', 'ts', 'start');
  o += text(X, 154, '整个面积的两倍：E_BC(A) = 28', 'ts', 'start');
  o += text(X, 178, 'α = 4/28（p、B、C 那块）', 't', 'start') + text(X, 198, 'β = 12.5/28（p、C、A）', 't', 'start') + text(X, 218, 'γ = 11.5/28（p、A、B）', 't', 'start');
  o += text(X, 244, '浅色格子：中心在 triangle 内', 'ts', 'start');
  return svg(560, 270, o, 'Triangle A(1,1) B(7,2) C(3,6) 在 pixel grid 上：bounding box 虚线，中心在 triangle 内的 pixel 涂浅色；pixel 中心 (4.5,3.5) 把 triangle 分成三块，面积比就是 barycentric coordinates');
}

function zbufA() {
  const c = 28, nx = 12, ny = 7, X0 = 14, Y0 = 34;
  const inside = (tri) => (p) => { let s = 0, ok = true; for (let i = 0; i < 3; i++) { const a = tri[i], b = tri[(i + 1) % 3], v = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (i === 0) s = Math.sign(v); else if (Math.sign(v) !== s) ok = false; } return ok; };
  const TA = [[0.3, 0.5], [11.7, 1.6], [4.2, 6.7]], TB = [[0.6, 6.5], [11.7, 5.4], [7.6, 0.3]];
  const inA = inside(TA), inB = inside(TB), dB = (x) => 0.2 + 0.6 * x / nx;
  const st = [[], [], []];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const p = [i + 0.5, j + 0.5];
    let z = 1, who = '';
    st[0].push([z, who]);
    if (inA(p)) { z = 0.5; who = 'A'; }
    st[1].push([z, who]);
    if (inB(p) && dB(p[0]) < z) { z = dB(p[0]); who = 'B'; }
    st[2].push([z, who]);
  }
  // 第一帧是画完 B 的结果，之后从初始化重放
  const seq = [2, 0, 1, 2], dur = 2.4, T = seq.length * dur, kt = [0, 0.25, 0.5, 0.75];
  const on = (k) => ashow(seq.map((i) => i === k), kt, T);
  const P = ([x, y]) => [X0 + x * c, Y0 + y * c];
  let o = text(X0 + nx * c / 2, 20, 'depth buffer（每格一个 pixel）', 'tb', 'middle');
  for (let k = 0; k < 3; k++) {
    let g = '';
    st[k].forEach(([z, who], idx) => {
      const i = idx % nx, j = Math.floor(idx / nx), X = X0 + i * c, Y = Y0 + j * c;
      if (who) g += rect(X, Y, c, c, who === 'A' ? 'wash2' : 'wash-strong');
      g += text(X + c / 2, Y + c / 2 + 4, z === 1 ? '1' : z.toFixed(2).replace(/^0/, ''), 'ts', 'middle');
    });
    o += `<g>${g}${on(k)}</g>`;
  }
  for (let i = 0; i <= nx; i++) o += line(X0 + i * c, Y0, X0 + i * c, Y0 + ny * c, 'grid');
  for (let j = 0; j <= ny; j++) o += line(X0, Y0 + j * c, X0 + nx * c, Y0 + j * c, 'grid');
  o += poly(TA.map(P), 'ink') + poly(TB.map(P), 'ln-dash');
  o += line(...P([6, 0]), ...P([6, ny]), 'ink-b');
  o += text(...P([6, ny]).map((v, i) => v + (i ? 16 : 0)), 'B 的 depth = 0.5', 'ts', 'middle');
  const X = 370;
  const rows = [['1. 初始化：全是 1（最远）', ''], ['2. 画 A（灰框）', 'depth 处处 0.5'], ['3. 画 B（彩色虚框）', 'depth 0.2 → 0.8，左小右大']];
  rows.forEach(([a, b], k) => {
    const y = 64 + k * 50;
    o += `<rect x="${X - 6}" y="${y - 18}" width="186" height="44" rx="4" class="wash">${on(k)}</rect>` + text(X, y, a, 't', 'start') + text(X, y + 18, b, 'ts', 'start');
  });
  o += text(X, 214, 'A、B 重叠的格子里：', 'ts', 'start') + text(X, 232, '粗竖线左边 B 的 depth < 0.5，B 赢；', 'ts', 'start') + text(X, 250, '右边 A 留着', 'ts', 'start');
  return svgA(560, 276, o, '动图：depth buffer 依次是全 1、画完 A 后 A 盖住的格子变成 0.5、画完 B 后只有粗竖线左边 B 的 depth 小于 0.5 的格子被 B 改写');
}

// ---------- 第 5 站 ----------
function lambert() {
  let o = '';
  const w = 56, Y = 190;
  const panel = (cx, th, title, cover) => {
    // surface：有厚度的 slab
    o += rect(cx - 120, Y, 240, 16, 'wash2') + line(cx - 120, Y, cx + 120, Y, 'ink-b');
    const dir = [Math.sin(th * R), Math.cos(th * R)]; // 光传播方向（向下、向右）
    const perp = [dir[1], -dir[0]];
    const half = cover / 2;
    const a = [cx - half, Y], b = [cx + half, Y];
    const L = 150;
    const a0 = [a[0] - dir[0] * L, a[1] - dir[1] * L], b0 = [b[0] - dir[0] * L, b[1] - dir[1] * L];
    o += poly([a0, b0, b, a], 'wash');
    for (const t of [0.15, 0.5, 0.85]) { const s = lerp(a0, b0, t), e = lerp(a, b, t); o += arrow(s[0], s[1], e[0] - dir[0] * 4, e[1] - dir[1] * 4, 'ln', 7); }
    // beam 截面宽度 w
    const m0 = lerp(a0, a, 0.55), m1 = [m0[0] + perp[0] * w, m0[1] + perp[1] * w];
    const off = [-dir[0] * 0, -dir[1] * 0];
    o += line(m0[0] + off[0], m0[1] + off[1], m1[0] + off[0], m1[1] + off[1], 'ink');
    o += line(m0[0], m0[1], m1[0], m1[1], 'ink-b');
    o += text(m0[0] - 8, m0[1] + 4, 'w', 'tb', 'end');
    o += line(a[0], Y + 26, b[0], Y + 26, 'ink') + line(a[0], Y + 21, a[0], Y + 31, 'ink') + line(b[0], Y + 21, b[0], Y + 31, 'ink');
    o += text(cx, Y + 46, cover === w ? '照亮 w' : '照亮 w / cos 60° = 2w', 't', 'middle');
    o += text(cx, 22, title, 'tb', 'middle');
    if (th) {
      o += line(cx, Y, cx, Y - 120, 'dash') + text(cx + 4, Y - 124, 'N', 'tb', 'start');
      const arcP = []; for (let k = 0; k <= 20; k++) { const t = (-th * k / 20) * R; arcP.push([cx + 46 * Math.sin(t), Y - 46 * Math.cos(t)]); }
      o += path(d(arcP), 'ink') + text(cx - 22, Y - 52, '60°', 'ts', 'end');
    } else o += text(cx + 38, Y - 120, 'N 方向直射', 'ts', 'start');
  };
  panel(140, 0, '直射：θ = 0', w);
  panel(420, 60, '斜射：θ = 60°', 2 * w);
  return svg(560, 246, o, '同一束截面宽 w 的平行光：沿 normal 直射时照亮宽 w 的一段；和 normal 成 60 度时照亮 2w，单位面积收到的光减半');
}

function phong() {
  const O = [230, 210], u = 160, P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  const N = [0, 1], L = [-0.6, 0.8], Rv = [0.6, 0.8], H = [-0.3162, 0.9487];
  let o = rect(O[0] - 200, O[1], 400, 14, 'wash2') + line(O[0] - 200, O[1], O[0] + 200, O[1], 'ink-b');
  const arcAt = (a0, a1, r, cls) => { const pts = []; for (let k = 0; k <= 24; k++) { const a = (a0 + (a1 - a0) * k / 24) * R; pts.push(P([r * Math.cos(a), r * Math.sin(a)])); } return path(d(pts), cls); };
  const ang = (v) => Math.atan2(v[1], v[0]) / R;
  o += arcAt(ang(N), ang(L), 0.42, 'mute') + arcAt(ang(Rv), ang(N), 0.42, 'mute') + arcAt(ang(H), ang(N), 0.62, 'ln');
  o += text(...P([-0.25, 0.3]), '36.9°', 'ts', 'end') + text(...P([0.25, 0.3]), '36.9°', 'ts', 'start');
  o += text(...P([0.04, 0.6]), '18.4°', 'tl', 'start');
  o += arrow(...P([0, 0]), ...P(L), 'ink') + text(P(L)[0] - 6, P(L)[1] - 4, 'L', 'tb', 'end');
  o += arrow(...P([0, 0]), ...P(Rv), 'ink') + text(P(Rv)[0] + 6, P(Rv)[1] - 4, 'R = (0.6, 0.8)', 'tb', 'start');
  o += arrow(...P([0, 0]), ...P(N), 'ink-b') + text(P(N)[0] + 8, P(N)[1] + 6, 'N = V = (0, 1)', 'tb', 'start');
  o += arrow(...P([0, 0]), ...P(H), 'ln') + text(P(H)[0] - 8, P(H)[1] + 2, 'H', 'tl', 'end');
  o += text(P(L)[0] - 6, P(L)[1] + 14, '(−0.6, 0.8)', 'ts', 'end');
  o += circle(...P([0, 0]), 3.5, 'ink-f');
  const X = 450;
  o += text(X, 60, 'N · L = 0.8', 't', 'start') + text(X, 80, 'R · V = 0.8', 't', 'start') + text(X, 100, 'N · H = 0.949', 't', 'start');
  o += text(X, 130, '0.8²⁰ = 0.0115', 'ts', 'start') + text(X, 148, '0.949²⁰ = 0.349', 'ts', 'start');
  return svg(560, 236, o, 'Phong 例子里的 vector：N 和 V 都是 (0,1)，L 是 (−0.6,0.8)，R 是 (0.6,0.8)，L 和 R 与 N 都差 36.9 度；H 在 L 和 V 中间，与 N 差 18.4 度');
}

function gouraud() {
  const kd = 0.6, ks = 0.4, ns = 50;
  const I = (x) => { const l = Math.hypot(x, 2), NL = 2 / l, RV = 2 * NL * NL - 1; return kd * NL + ks * Math.max(RV, 0) ** ns; };
  // 上：几何
  const gx = lin(-1.3, 1.3, 80, 480), gy = (y) => 112 - y * 44;
  let o = rect(gx(-1), gy(0), gx(1) - gx(-1), 12, 'wash2') + line(gx(-1), gy(0), gx(1), gy(0), 'ink-b');
  for (const x of [-1, 1]) { o += line(gx(x), gy(0), gx(0), gy(2), 'dash') + circle(gx(x), gy(0), 5, 'paper'); o += arrow(gx(x), gy(0), gx(x), gy(0.75), 'mute', 6); }
  o += text(gx(-1), gy(0) + 28, 'vertex x = −1', 'ts', 'middle') + text(gx(1), gy(0) + 28, 'vertex x = 1', 'ts', 'middle');
  o += text(gx(-1) + 8, gy(0.7), 'N', 'ts', 'start');
  o += circle(gx(0), gy(2), 7, 'solid') + text(gx(0) + 14, gy(2) + 4, 'light + eye 在 (0, 2)', 't', 'start');
  // 下：亮度
  const sx = lin(-1, 1, 80, 480), sy = lin(0, 1.05, 318, 168);
  o += axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 1.05, xt: [-1, -0.5, 0, 0.5, 1], yt: [0, 0.5, 1], grid: true, xl: 'x' });
  o += path(curve(I, -1, 1, sx, sy, 600), 'ln');
  o += line(sx(-1), sy(I(-1)), sx(1), sy(I(1)), 'dash');
  o += circle(sx(-1), sy(I(-1)), 4, 'ink-f') + circle(sx(1), sy(I(1)), 4, 'ink-f');
  o += text(sx(0.2), sy(0.95), 'Phong shading：峰值 1.0', 'tl', 'start');
  o += text(sx(0.5), sy(0.3), 'Gouraud（虚线）：两端都是 0.537，连成直线', 't', 'middle');
  o += text(500, 50, 'k_d = 0.6', 'ts', 'start') + text(500, 68, 'k_s = 0.4', 'ts', 'start') + text(500, 86, 'n = 50', 'ts', 'start');
  return svg(560, 350, o, '上面是一段平面，两端 vertex，light 和 eye 在正中上方；下面是亮度沿 x：Gouraud 把两端的 0.537 连成直线，Phong shading 在 x=0 处算出 specular 尖峰到 1.0');
}

// ---------- 第 6 站 ----------
function persp() {
  let o = '';
  o += text(140, 22, '在 screen 里对 (s, t) 线性插值', 'tb', 'middle') + text(420, 22, '插值 (s/w, t/w, 1/w) 再相除', 'tb', 'middle');
  o += checker(20, 42, 180, 'affine') + checker(300, 42, 180, 'persp');
  o += text(140, 200, '两个 triangle 各自插值，格子在', 'ts', 'middle') + text(140, 216, 'diagonal（虚线）处折断', 'ts', 'middle');
  o += text(420, 200, '远处的格子被正确地压扁，', 'ts', 'middle') + text(420, 216, '所有格线都是直线', 'ts', 'middle');
  return svg(560, 224, o, '同一块倾斜地板上的 6 乘 6 棋盘格：左边在 screen space 线性插值，格线在 diagonal 处折断；右边 perspective-correct，格线都是直线，远处的格子被压扁');
}

function bilinear() {
  const s = 130, X0 = 40, Y0 = 20;
  // texel 中心：(0,0) 左下
  const C = ([a, b]) => [X0 + s / 2 + a * s, Y0 + s / 2 + (1 - b) * s];
  const vals = [[[0, 0], 10, 'c₀₀ = 10'], [[1, 0], 50, 'c₁₀ = 50'], [[0, 1], 30, 'c₀₁ = 30'], [[1, 1], 90, 'c₁₁ = 90']];
  let o = '';
  for (const [[a, b], v, lab] of vals) {
    const [cx, cy] = C([a, b]);
    o += `<rect x="${f1(cx - s / 2)}" y="${f1(cy - s / 2)}" width="${s}" height="${s}" class="solid" opacity="${(v / 200).toFixed(2)}"/>` + rect(cx - s / 2, cy - s / 2, s, s, 'frame');
    o += circle(cx, cy, 4, 'ink-f') + text(cx + (a ? 8 : -8), cy + (b ? -10 : 20), lab, 't', a ? 'start' : 'end');
  }
  const a = 0.25, b = 0.6;
  const bot = C([a, 0]), topp = C([a, 1]), p = C([a, b]);
  o += line(...C([0, 0]), ...C([1, 0]), 'mute') + line(...C([0, 1]), ...C([1, 1]), 'mute');
  o += line(...bot, ...topp, 'ln');
  o += circle(...bot, 5, 'paper') + circle(...topp, 5, 'paper') + circle(...p, 6, 'ln-f');
  o += text(bot[0] + 8, bot[1] + 18, '20', 'tb', 'start') + text(topp[0] + 8, topp[1] - 9, '45', 'tb', 'start');
  o += text(p[0] + 10, p[1] + 4, 'c = 35', 'tl', 'start');
  // a、b 的标尺
  o += line(...C([0, 0]).map((v, i) => v + (i ? 34 : 0)), ...C([a, 0]).map((v, i) => v + (i ? 34 : 0)), 'ink');
  o += text((C([0, 0])[0] + C([a, 0])[0]) / 2, C([0, 0])[1] + 50, 'a = 0.25', 'ts', 'middle');
  o += line(C([0, 0])[0] - 40, C([0, 0])[1], C([0, 0])[0] - 40, C([0, b])[1], 'ink');
  o += text(C([0, 0])[0] - 46, (C([0, 0])[1] + C([0, b])[1]) / 2 + 4, 'b = 0.6', 'ts', 'end');
  const X = 330;
  o += text(X, 60, '1. 下行：10 × 0.75 + 50 × 0.25 = 20', 't', 'start');
  o += text(X, 88, '2. 上行：30 × 0.75 + 90 × 0.25 = 45', 't', 'start');
  o += text(X, 116, '3. 两者之间：20 × 0.4 + 45 × 0.6 = 35', 't', 'start');
  o += text(X, 150, '格子越深，texel 的值越大', 'ts', 'start');
  return svg(560, 290, o, '四个 texel 的中心，值分别为 10、50、30、90；落点在 a=0.25、b=0.6：下行插出 20，上行插出 45，二者之间插出 35');
}

function alias() {
  const n = 27, c = 18, X0 = 37;
  const dark = (x) => ((x / 0.9) % 1 + 1) % 1 < 0.5;
  let o = text(X0, 22, 'Texture：周期 0.9 个 pixel 的条纹（格线是 pixel 边界）', 'tb', 'start');
  const y1 = 34, h1 = 46;
  o += rect(X0, y1, n * c, h1, 'paper-f');
  for (let k = 0; k * 0.9 < n; k++) { const x0 = k * 0.9, x1 = Math.min(k * 0.9 + 0.45, n); o += rect(X0 + x0 * c, y1, (x1 - x0) * c, h1, 'solid2'); }
  for (let i = 0; i <= n; i++) o += line(X0 + i * c, y1 - 4, X0 + i * c, y1 + h1 + 4, 'mute');
  for (let i = 0; i < n; i++) { const x = i + 0.5; o += circle(X0 + x * c, y1 + h1 + 14, 3.5, dark(x) ? 'ink-f' : 'paper'); }
  o += text(X0, 130, '每个 pixel 中心采样一次，得到的 image：', 'tb', 'start');
  const y2 = 142, h2 = 40;
  for (let i = 0; i < n; i++) o += rect(X0 + i * c, y2, c, h2, dark(i + 0.5) ? 'solid2' : 'paper-f') + rect(X0 + i * c, y2, c, h2, 'frame');
  // 标出一个 alias 周期 = 9 pixel
  const a0 = 0, a1 = 9;
  o += line(X0 + a0 * c, y2 + h2 + 12, X0 + a1 * c, y2 + h2 + 12, 'ln') + line(X0 + a0 * c, y2 + h2 + 7, X0 + a0 * c, y2 + h2 + 17, 'ln') + line(X0 + a1 * c, y2 + h2 + 7, X0 + a1 * c, y2 + h2 + 17, 'ln');
  o += text(X0 + 4.5 * c, y2 + h2 + 30, '周期 9 个 pixel', 'tl', 'middle');
  o += text(X0 + 18 * c, y2 + h2 + 30, '相邻 pixel 的相位差 1/0.9 − 1 = 0.111 个周期', 'ts', 'middle');
  return svg(560, 222, o, '上面是周期 0.9 个 pixel 的黑白条纹和每个 pixel 中心的采样点；下面是采样得到的 image，变成周期 9 个 pixel 的宽条纹');
}

function mipmap() {
  const tex = (i, j) => ((i < 4) !== (j < 4) ? 0.72 : 0.28) + ((i + j) % 2 ? 0.2 : -0.2);
  let lv = [Array.from({ length: 8 }, (_, j) => Array.from({ length: 8 }, (_, i) => tex(i, j)))];
  while (lv[lv.length - 1].length > 1) { const p = lv[lv.length - 1], m = p.length / 2; lv.push(Array.from({ length: m }, (_, j) => Array.from({ length: m }, (_, i) => (p[2 * j][2 * i] + p[2 * j][2 * i + 1] + p[2 * j + 1][2 * i] + p[2 * j + 1][2 * i + 1]) / 4))); }
  let o = '', X = 18;
  const Yb = 166;
  lv.forEach((g, k) => {
    const S = 128 / 2 ** k, m = g.length, cs = S / m;
    const y0 = Yb - S;
    g.forEach((row, j) => row.forEach((v, i) => { o += `<rect x="${f1(X + i * cs)}" y="${f1(y0 + j * cs)}" width="${f1(cs)}" height="${f1(cs)}" class="solid2" opacity="${v.toFixed(2)}"/>`; }));
    o += rect(X, y0, S, S, 'ink');
    o += text(X + S / 2, Yb + 18, 'level ' + k, k === 2 || k === 3 ? 'tl' : 't', 'middle') + text(X + S / 2, Yb + 34, m + '×' + m, 'ts', 'middle');
    X += S + 16;
  });
  o += text(18, 22, 'Mipmap：每级是上一级 2×2 个 texel 的平均', 'tb', 'start');
  // 右：log2 k 的数轴
  const sx = lin(0, 3.3, 330, 548), Y = 120;
  o += line(sx(0), Y, sx(3.3), Y, 'axis');
  for (let k = 0; k <= 3; k++) o += line(sx(k), Y - 6, sx(k), Y + 6, 'axis') + text(sx(k), Y + 22, String(k), 'ts', 'middle');
  const v = Math.log2(5.7);
  o += line(sx(2), Y, sx(3), Y, 'ln') + circle(sx(v), Y, 5, 'ln-f');
  o += text(sx(v), Y - 14, 'log₂ 5.7 = ' + v.toFixed(2), 'tl', 'middle');
  o += text(548, Y + 46, '0.49 × level 2 + 0.51 × level 3', 'ts', 'end');
  o += text(439, 64, 'footprint k = 5.7 个 texel', 'tb', 'middle');
  return svg(560, 210, o, '8 乘 8 texture 的四级 mipmap，每级长宽减半、取 2 乘 2 平均；右边数轴上 log2 5.7 等于 2.51，trilinear 按 0.49 和 0.51 混合 level 2 和 level 3');
}

// ---------- 第 7 站 ----------
function sphere() {
  // 横轴是 −z（向右），竖轴是 y
  const u = 26, P = ([w, y]) => [26 + (w + 0.5) * u, 150 - y * u];
  const C = [5, 0], r = 4;
  let o = line(...P([-0.5, 0]), ...P([9.6, 0]), 'axis') + text(...P([9.6, -0.5]), '−z', 'ts', 'end');
  o += circle(...P(C), r * u, 'wash ink-s') + circle(...P(C), 3, 'ink-f') + text(P(C)[0] + 6, P(C)[1] + 16, 'C = (0, 0, −5)', 'ts', 'start');
  o += line(...P(C), ...P([C[0], -r]), 'mute') + text(P([C[0], -2])[0] + 5, P([C[0], -2])[1] + 4, 'r = 4', 'ts', 'start');
  const ray = (D, ts, lab, dy) => {
    const at = (t) => [-D[2] * t, D[1] * t];
    let q = '';
    if (ts.length === 2) {
      q += line(...P([0, 0]), ...P(at(ts[0])), 'ln') + line(...P(at(ts[0])), ...P(at(ts[1])), 'ln-dash');
      q += circle(...P(at(ts[0])), 4.5, 'ln-f') + circle(...P(at(ts[1])), 4, 'paper');
    } else if (ts.length === 1) {
      q += line(...P([0, 0]), ...P(at(ts[0])), 'ln') + line(...P(at(ts[0])), ...P(at(5.2)), 'mute') + circle(...P(at(ts[0])), 4.5, 'ln-f');
    } else q += line(...P([0, 0]), ...P(at(5)), 'mute');
    const e = at(ts.length === 2 ? ts[1] : ts.length ? 5.2 : 5);
    q += text(P(e)[0] + 6, P(e)[1] + dy, lab, 'tb', 'start');
    return q;
  };
  o += ray([0, 0.6, -0.8], [4 - Math.sqrt(7), 4 + Math.sqrt(7)], '①', 4);
  o += ray([0, 0.8, -0.6], [3], '②', 4);
  o += ray([0, 0.96, -0.28], [], '③', 4);
  const X = 330;
  o += text(X, 40, 'O = (0, 0, 0)，D 是 unit vector', 'tb', 'start');
  [['① D = (0, 0.6, −0.8)', 'b′² − c = 7 > 0：两个根', 't = 1.354 和 6.646，取近的'], ['② D = (0, 0.8, −0.6)', 'b′² − c = 0：tangent', 't = 3，在 (0, 2.4, −1.8)'], ['③ D = (0, 0.96, −0.28)', 'b′² − c = −7.04 < 0：miss', '']].forEach((r, k) => { r.forEach((q, j) => { if (q) o += text(X, 72 + k * 66 + j * 18, q, j ? 'ts' : 't', 'start'); }); });
  // 第一条 hit 的 normal
  const h = [(4 - Math.sqrt(7)) * 0.8, (4 - Math.sqrt(7)) * 0.6], nv = [-(h[0] - C[0]) / r, h[1] / r];
  o += arrow(...P(h), ...P([h[0] - 1.6 * (C[0] - h[0]) / r, h[1] + 1.6 * h[1] / r]), 'ink', 6);
  o += text(P([h[0] - 1.6 * 0.979, h[1] + 1.6 * 0.203])[0] - 2, P([h[0] - 1.6 * 0.979, h[1] + 1.6 * 0.203])[1] - 8, 'normal', 'ts', 'middle');
  o += circle(...P([0, 0]), 4.5, 'ink-f') + text(P([0, 0])[0], P([0, 0])[1] + 20, 'O', 'tb', 'middle');
  return svg(560, 292, o, '在 x 等于 0 的 plane 里：sphere 中心 (0,0,−5)、radius 4；第一条 ray 穿过 sphere，近的 intersection 在 t=1.354；第二条在 t=3 与 sphere 相切；第三条错过');
}

function refract() {
  let o = '';
  const panel = (cx, mu1, mu2, title) => {
    const Y = 140, L = 105;
    o += rect(cx - 125, Y, 250, 105, mu2 > mu1 ? 'wash' : 'paper-f');
    o += rect(cx - 125, 30, 250, 110, mu1 > mu2 ? 'wash' : 'paper-f');
    o += line(cx - 125, Y, cx + 125, Y, 'ink');
    o += line(cx, Y - 100, cx, Y + 100, 'dash') + text(cx + 4, Y - 88, 'N', 'tb', 'start');
    o += text(cx - 118, 48, mu1 > mu2 ? 'glass μ = 1.5' : 'air μ = 1', 'ts', 'start') + text(cx - 118, Y + 96, mu2 > mu1 ? 'glass μ = 1.5' : 'air μ = 1', 'ts', 'start');
    const th = 45 * R, s = mu1 / mu2 * Math.sin(th);
    const inc = [cx - L * Math.sin(th), Y - L * Math.cos(th)];
    o += arrow(inc[0], inc[1], cx, Y, 'ln');
    o += text(cx - 16, Y - 58, '45°', 'ts', 'end');
    const rf = [cx + L * Math.sin(th), Y - L * Math.cos(th)];
    if (s <= 1) {
      const ph = Math.asin(s);
      const out = [cx + L * Math.sin(ph), Y + L * Math.cos(ph)];
      o += arrow(cx, Y, out[0], out[1], 'ln') + arrow(cx, Y, rf[0], rf[1], 'mute');
      o += text(out[0] + 6, out[1] - 4, (ph / R).toFixed(1) + '°', 'tl', 'start');
      o += text(rf[0] + 6, rf[1] + 4, '部分反射', 'ts', 'start');
    } else {
      o += arrow(cx, Y, rf[0], rf[1], 'ln') + text(rf[0] + 6, rf[1] + 4, '全部反射', 'tl', 'start');
      const cr = Math.asin(mu2 / mu1);
      o += line(cx - L * Math.sin(cr), Y - L * Math.cos(cr), cx, Y, 'dash');
      o += text(cx - L * Math.sin(cr) - 4, Y - L * Math.cos(cr) + 26, '临界 ' + (cr / R).toFixed(1) + '°', 'ts', 'end');
      o += text(cx + 10, Y + 52, '根号里 1 − 2.25 × 0.5 < 0', 'ts', 'start');
    }
    o += text(cx, 20, title, 'tb', 'middle');
  };
  panel(140, 1, 1.5, '空气 → 玻璃');
  panel(420, 1.5, 1, '玻璃 → 空气');
  return svg(560, 250, o, '左：从空气以 45 度射入玻璃，折射成 28.1 度，另有部分反射；右：从玻璃以 45 度射向空气，超过临界角 41.8 度，全部反射');
}

function raytreeA() {
  // 侧视 2D 场景
  const eye = [0, 3.2], Cc = [4.6, 1.5], r = 1.25, light = [6.6, 6.2], mu = 1.5;
  const nrm = (v) => { const l = Math.hypot(...v); return [v[0] / l, v[1] / l]; };
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const hitS = (O, D, inside) => { const m = [O[0] - Cc[0], O[1] - Cc[1]], b = dot(D, m), c = dot(m, m) - r * r, q = b * b - c; if (q < 0) return null; const t = inside ? -b + Math.sqrt(q) : -b - Math.sqrt(q); return t > 1e-6 ? t : null; };
  const at = (O, D, t) => [O[0] + t * D[0], O[1] + t * D[1]];
  const refr = (D, N, m) => { const L = [-D[0], -D[1]], c = dot(N, L), k = 1 - m * m * (1 - c * c); if (k < 0) return null; const a = m * c - Math.sqrt(k); return nrm([-m * L[0] + a * N[0], -m * L[1] + a * N[1]]); };
  const D0 = nrm([4.0 - eye[0], 2.3 - eye[1]]);
  const t1 = hitS(eye, D0, false), P1 = at(eye, D0, t1), N1 = nrm([P1[0] - Cc[0], P1[1] - Cc[1]]);
  const Rf = nrm([D0[0] - 2 * dot(D0, N1) * N1[0], D0[1] - 2 * dot(D0, N1) * N1[1]]);
  const Ti = refr(D0, N1, 1 / mu);
  const t2 = hitS(P1, Ti, true), P2 = at(P1, Ti, t2), N2 = nrm([Cc[0] - P2[0], Cc[1] - P2[1]]);
  const To = refr(Ti, N2, mu);
  const t3 = -P2[1] / To[1], P3 = at(P2, To, t3);
  const Pz = ([x, y]) => [24 + x * 34, 236 - y * 34];
  // 第一帧显示完整的 tree，之后从 eye ray 开始一层层长出来
  const stage = [3, 0, 1, 2, 3], hold = 2.4, dur = 1.5, T = hold + 4 * dur + 1.4, kt = [0, hold / T, (hold + dur) / T, (hold + 2 * dur) / T, (hold + 3 * dur) / T];
  const from = (k) => ashow(stage.map((i) => i >= k), kt, T);
  let o = line(...Pz([-0.3, 0]), ...Pz([9.6, 0]), 'ink-b') + rect(...Pz([-0.3, 0]), 9.9 * 34, 8, 'wash2');
  o += text(...Pz([0.2, -0.45]), 'ground（diffuse）', 'ts', 'start');
  o += circle(...Pz(Cc), r * 34, 'wash ink-s') + text(Pz(Cc)[0], Pz(Cc)[1] + 4, 'glass', 'ts', 'middle');
  o += circle(...Pz(light), 7, 'solid') + text(Pz(light)[0] + 12, Pz(light)[1] + 4, 'light', 'ts', 'start');
  o += circle(...Pz(eye), 5, 'ink-f') + text(Pz(eye)[0] + 2, Pz(eye)[1] - 10, 'eye', 'ts', 'start');
  
  const seg = (a, b, cls, k) => `<g>${line(...Pz(a), ...Pz(b), cls)}${from(k)}</g>`;
  o += seg(eye, P1, 'ln', 0);
  o += seg(P1, light, 'dash', 1) + seg(P1, at(P1, Rf, 2.2), 'ink', 1) + seg(P1, P2, 'ln', 1);
  o += seg(P2, P3, 'ln', 2);
  o += seg(P3, light, 'dash', 3);
  const lab = (p, s, dx, dy, k, cls = 'tb') => `<g>${circle(...Pz(p), 3.5, 'ink-f')}${text(Pz(p)[0] + dx, Pz(p)[1] + dy, s, cls, dx < 0 ? 'end' : 'start')}${from(k)}</g>`;
  o += lab(P1, 'P₁', -6, -6, 0) + lab(P2, 'P₂', 8, 4, 1) + lab(P3, 'P₃', 6, -8, 2);
  const re = at(P1, Rf, 2.2);
  o += `<g>${text(Pz(re)[0] + 2, Pz(re)[1] - 8, 'reflect → background', 'ts', 'middle')}${from(1)}</g>`;
  // 右：ray tree
  const nodes = [
    [430, 34, 'eye ray', 0, null], [430, 82, 'P₁ glass', 0, 0],
    [354, 136, 'shadow', 1, 1], [430, 136, 'reflect', 1, 1], [506, 136, 'refract', 1, 1],
    [506, 186, 'P₂ 出球', 1, 4], [506, 236, 'P₃ ground', 2, 5], [430, 282, 'shadow', 3, 6],
  ];
  let tr = '';
  nodes.forEach(([x, y, s, k, par]) => {
    if (par !== null) { const [px, py] = nodes[par]; tr += `<g>${line(px, py + 10, x, y - 12, 'mute')}${from(k)}</g>`; }
  });
  nodes.forEach(([x, y, s, k], i) => { tr += `<g>${rect(x - 36, y - 12, 72, 22, i === 1 || i === 5 || i === 6 ? 'paper' : 'wash2', 5)}${text(x, y + 4, s, 'ts', 'middle')}${from(k)}</g>`; });
  o += tr;
  o += text(24, 300, 'Shadow ray 是虚线；P₂ 处的 internal reflection 没有画', 'ts', 'start');
  return svgA(560, 306, o, '动图：eye ray 打在玻璃球的 P1，分出 shadow ray、reflection 和 refraction；refraction 在 P2 穿出球，打在地面 P3，再射出 shadow ray；右边 ray tree 一层层长出来');
}

// ---------- 第 8 站 ----------
const CP = [[0, 0], [1, 2], [3, 2], [4, 0]];
const bern = [(u) => (1 - u) ** 3, (u) => 3 * u * (1 - u) ** 2, (u) => 3 * u * u * (1 - u), (u) => u ** 3];
const bez = (u) => [0, 1].map((k) => bern.reduce((s, b, i) => s + b(u) * CP[i][k], 0));
const casteljau = (u) => { const L = [CP]; while (L[L.length - 1].length > 1) { const p = L[L.length - 1]; L.push(p.slice(1).map((q, i) => lerp(p[i], q, u))); } return L; };

function bernstein() {
  const sx = lin(0, 1, 46, 246), sy = lin(0, 1, 226, 46);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 0.5, 1], grid: true, xl: 'u' });
  const names = ['(1−u)³', '3u(1−u)²', '3u²(1−u)', 'u³'];
  const cls = ['ink', 'ln', 'ln-dash', 'dash'];
  bern.forEach((b, i) => { o += path(curve(b, 0, 1, sx, sy), cls[i]); });
  o += text(sx(0.1), sy(0.9), names[0], 'tb', 'start') + text(sx(0.9), sy(0.9), names[3], 'tb', 'end');
  o += text(sx(0.36), sy(0.51), names[1], 'tl', 'middle') + text(sx(0.64), sy(0.51), names[2], 'tl', 'middle');
  o += line(sx(0.25), sy(0), sx(0.25), sy(0.4219), 'mute');
  bern.forEach((b) => { o += circle(sx(0.25), sy(b(0.25)), 3.5, 'ink-f'); });
  o += text(146, 274, 'u = 0.25：0.4219、0.4219、0.1406、0.0156', 'ts', 'middle');
  o += text(146, 22, 'Bernstein polynomial', 'tb', 'middle');
  // 右：curve
  const cx = lin(-0.3, 4.3, 302, 548), u = (cx(1) - cx(0)), cy = (y) => 206 - y * u;
  const Q = ([x, y]) => [cx(x), cy(y)];
  o += poly(CP.map(Q), 'wash2') + path(d(CP.map(Q)), 'dash');
  const pts = []; for (let k = 0; k <= 80; k++) pts.push(Q(bez(k / 80)));
  o += path(d(pts), 'ln');
  CP.forEach((p, i) => { o += circle(...Q(p), 4, 'paper') + text(Q(p)[0] + (i % 2 ? (i === 1 ? -6 : 6) : 0), Q(p)[1] + (i % 3 ? -8 : 20), 'P' + '₀₁₂₃'[i] + ' ' + pt(p), 'ts', i % 3 ? (i === 1 ? 'end' : 'start') : 'middle'); });
  o += circle(...Q(bez(0.25)), 5, 'ln-f') + text(Q(bez(0.25))[0] + 8, Q(bez(0.25))[1] + 16, 'p(0.25) = (0.906, 1.125)', 'tl', 'start');
  o += text(425, 22, 'Curve 与 convex hull（灰）', 'tb', 'middle');
  return svg(560, 282, o, '左边是四个 cubic Bernstein polynomial，u=0.25 处的权重为 0.4219、0.4219、0.1406、0.0156；右边是 control point (0,0)(1,2)(3,2)(4,0) 的 Bezier curve，p(0.25) 等于 (0.906,1.125)，在 convex hull 里');
}

function decastA() {
  const cx = lin(-0.4, 4.4, 20, 340), u = cx(1) - cx(0), cy = (y) => 230 - y * u;
  const Q = ([x, y]) => [cx(x), cy(y)];
  // u：0.25 停住 → 1 → 0 → 0.25
  const hold = 1.8, T = hold + 7, kt = [0], us = [0.25];
  kt.push(hold / T); us.push(0.25);
  const seg = (a, b, t0, t1, n) => { for (let i = 1; i <= n; i++) { kt.push((t0 + (t1 - t0) * i / n) / T); us.push(a + (b - a) * i / n); } };
  seg(0.25, 1, hold, hold + 2.6, 40); seg(1, 0, hold + 2.6, hold + 6, 60); seg(0, 0.25, hold + 6, T, 20);
  const Ls = us.map(casteljau);
  let o = path(d(CP.map(Q)), 'mute');
  const pts = []; for (let k = 0; k <= 80; k++) pts.push(Q(bez(k / 80)));
  o += path(d(pts), 'grid');
  CP.forEach((p, i) => { o += circle(...Q(p), 4, 'paper') + text(Q(p)[0] + (i < 2 ? -6 : 6), Q(p)[1] + (i % 3 ? -8 : 18), 'P' + '₀₁₂₃'[i], 'ts', i < 2 ? 'end' : 'start'); });
  // 第一层连线（两条）、第二层连线（一条）
  o += apath(Ls.map((L) => d(L[1].map(Q))), kt, T, 'ink');
  o += apath(Ls.map((L) => d(L[2].map(Q))), kt, T, 'ln-dash');
  // 已走过的 curve：只画到当前 u
  o += apath(us.map((uu) => { const p = []; for (let k = 0; k <= 40; k++) p.push(Q(bez(uu * k / 40))); return d(p); }), kt, T, 'ln');
  for (let lev = 1; lev <= 3; lev++) for (let j = 0; j < 4 - lev; j++) {
    const ps = Ls.map((L) => Q(L[lev][j]));
    o += acircle(ps.map((p) => p[0]), ps.map((p) => p[1]), kt, T, lev === 3 ? 5.5 : 3.5, lev === 3 ? 'ln-f' : lev === 2 ? 'ink-f' : 'paper');
  }
  // 第一帧的数字
  const on = ashow([1, 1, ...us.slice(2).map(() => 0)], kt, T);
  const L0 = casteljau(0.25);
  const lab = (p, s, dx, dy, cls = 'ts') => text(Q(p)[0] + dx, Q(p)[1] + dy, s, cls, dx < 0 ? 'end' : 'start');
  o += `<g>${lab(L0[3][0], 'p(0.25)', 10, 18, 'tl')}${on}</g>`;
  const X = 360;
  o += text(X, 34, 'u = 0.25 时（第一帧）', 'tb', 'start');
  o += text(X, 58, '第一层（空心）', 'ts', 'start') + text(X, 76, '(0.25, 0.5)、(1.5, 2)、(3.25, 1.5)', 't', 'start');
  o += text(X, 102, '第二层（实心）', 'ts', 'start') + text(X, 120, '(0.5625, 0.875)、(1.9375, 1.875)', 't', 'start');
  o += text(X, 146, '第三层（彩色）', 'ts', 'start') + text(X, 164, 'p(0.25) = (0.90625, 1.125)', 'tl', 'start');
  o += text(X, 196, '每层都在相邻两点间取 (1 − u) : u', 'ts', 'start') + text(X, 214, '的分点；虚线是 p(u) 处的 tangent', 'ts', 'start');
  o += text(X, 240, '之后 u 走到 1，再回到 0', 'ts', 'start');
  return svgA(560, 262, o, '动图：de Casteljau algorithm，u 从 0.25 走到 1 再回到 0，第一层 3 个分点、第二层 2 个分点和 p(u) 跟着移动并描出 curve；第一帧 u=0.25，p(0.25)=(0.906,1.125)');
}

function valley() {
  const sx = lin(-230, 230, 50, 510), u = (sx(1) - sx(0)), sy = (y) => 170 - y * u;
  const Q = ([x, y]) => [sx(x), sy(y)];
  const Qp = [[-200, 100], [0, -100], [200, 100]];
  const p = (t) => [400 * t - 200, 100 * (1 - 2 * t) ** 2], tan = (t) => [400, -400 * (1 - 2 * t)];
  let o = line(...Q([-230, 0]), ...Q([230, 0]), 'axis') + line(...Q([0, -110]), ...Q([0, 108]), 'axis');
  o += path(d(Qp.map(Q)), 'dash');
  // 山谷：有厚度的地面
  const pts = []; for (let k = 0; k <= 80; k++) pts.push(p(k / 80));
  o += poly([...pts, [200, 100 - 22], ...pts.slice().reverse().map(([x, y]) => [x, y - 22]), [-200, 100 - 22]].map(Q), 'wash2');
  o += path(d(pts.map(Q)), 'ink-b');
  Qp.forEach((q, i) => { o += circle(...Q(q), 4, 'paper') + text(Q(q)[0] + (i === 1 ? 10 : i ? -8 : 8), Q(q)[1] + (i === 1 ? 4 : -8), pt(q), 'ts', i === 1 ? 'start' : i ? 'end' : 'start'); });
  // 花：一个小 triangle，沿 normal 方向
  for (let k = 1; k <= 9; k++) {
    const t = k / 10, c = p(t), g = tan(t), ang = Math.atan2(g[1], g[0]) + Math.PI / 2;
    const dir = [Math.cos(ang), Math.sin(ang)], side = [-dir[1], dir[0]], L = 30, w = 8;
    const tip = [c[0] + L * dir[0], c[1] + L * dir[1]];
    o += poly([[c[0] + w * side[0], c[1] + w * side[1]], tip, [c[0] - w * side[0], c[1] - w * side[1]]].map(Q), 'solid');
    o += circle(...Q(c), 2.5, 'ink-f');
  }
  const c1 = p(0.1);
  o += line(Q(c1)[0] + 4, Q(c1)[1] - 6, Q([-100, 120])[0] - 4, Q([-100, 120])[1] + 2, 'mute') + text(...Q([-100, 120]), 'u = 0.1：点 (−160, 64)，花朝 51.3°', 'tl', 'start');
  o += text(280, 296, '每朵花在 tangent 方向上再转 90°：atan2(tangent.y, tangent.x) + 90°', 'ts', 'middle');
  return svg(560, 302, o, 'Quadratic Bezier 山谷 y 等于 x 平方除以 400，control point (−200,100)(0,−100)(200,100)；u 从 0.1 到 0.9 处九朵花，每朵都沿该点的 normal 方向');
}

function cont() {
  const second = (q1) => [[4, 0], q1, [7, -2], [8, 0]];
  const B3 = (P) => (u) => [0, 1].map((k) => bern.reduce((s, b, i) => s + b(u) * P[i][k], 0));
  let o = '';
  const panel = (x0, q1, title, note) => {
    const sx = lin(-0.3, 8.3, x0, x0 + 172), u = sx(1) - sx(0), sy = (y) => 110 - y * u;
    const Q = ([x, y]) => [sx(x), sy(y)];
    const S = second(q1);
    for (const [P, cls] of [[CP, 'ink-b'], [S, 'ln']]) {
      const f = B3(P), pts = []; for (let k = 0; k <= 60; k++) pts.push(Q(f(k / 60)));
      o += path(d(P.map(Q)), 'grid') + path(d(pts), cls);
      for (let k = 0; k <= 10; k++) o += circle(...Q(f(k / 10)), 2.2, cls === 'ln' ? 'ln-f' : 'ink-f');
    }
    o += line(...Q([3, 2]), ...Q([4, 0]), 'mute') + line(...Q([4, 0]), ...Q(q1), 'mute');
    o += circle(...Q([3, 2]), 3.5, 'paper') + circle(...Q(q1), 4, 'paper');
    o += text(Q([3, 2])[0] - 4, Q([3, 2])[1] - 6, 'P₂', 'ts', 'end') + (q1[1] === 0 ? text(Q(q1)[0] + 6, Q(q1)[1] - 10, 'Q₁ ' + pt(q1), 'tl', 'start') : text(Q(q1)[0] + 8, Q(q1)[1] + 4, 'Q₁ ' + pt(q1), 'tl', 'start'));
    o += text(x0 + 86, 22, title, 'tb', 'middle') + text(x0 + 86, 222, note[0], 'ts', 'middle') + text(x0 + 86, 238, note[1], 'ts', 'middle');
  };
  panel(8, [5, 0], 'C⁰', ['接点处有尖角', '']);
  panel(194, [6, -4], 'G¹，不是 C¹', ['方向对上、长度两倍：', '接点后点距突然变大']);
  panel(380, [5, -2], 'C¹', ['Q₁ − Q₀ = P₃ − P₂', '点距连续']);
  o += text(280, 266, '点是 u = 0, 0.1, …, 1 的位置；第二段取 Q₂ = (7, −2)、Q₃ = (8, 0)', 'ts', 'middle');
  return svg(560, 274, o, '第一段 Bezier 后接第二段，Q1 取三个位置：(5,0) 在接点处有尖角；(6,−4) 方向相同但长度两倍，光滑但点距在接点突变；(5,−2) 与 P2 关于接点对称，C1 连续');
}

export default {
  'cs3241-intro': intro,
  'cs3241-pinhole': pinhole,
  'cs3241-pipeline': pipeline,
  'cs3241-order': order,
  'cs3241-reflect': reflectA,
  'cs3241-orbit': orbit,
  'cs3241-stack': stack,
  'cs3241-normal': normal,
  'cs3241-lookat': lookat,
  'cs3241-frustum': frustumA,
  'cs3241-outcode': outcode,
  'cs3241-bresenham': bresenhamA,
  'cs3241-edge': edge,
  'cs3241-zbuf': zbufA,
  'cs3241-lambert': lambert,
  'cs3241-phong': phong,
  'cs3241-gouraud': gouraud,
  'cs3241-persp': persp,
  'cs3241-bilinear': bilinear,
  'cs3241-alias': alias,
  'cs3241-mipmap': mipmap,
  'cs3241-sphere': sphere,
  'cs3241-refract': refract,
  'cs3241-raytree': raytreeA,
  'cs3241-bernstein': bernstein,
  'cs3241-decast': decastA,
  'cs3241-valley': valley,
  'cs3241-cont': cont,
};
