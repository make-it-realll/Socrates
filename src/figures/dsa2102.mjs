import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 玩具浮点系统：β = 2，3 位有效数字，指数 −1..2
function fp() {
  const sx = lin(0, 7.4, 30, 530);
  let o = line(30, 90, 540, 90, 'axis');
  for (let e = -1; e <= 2; e++) for (const m of [1, 1.25, 1.5, 1.75]) {
    const v = m * 2 ** e;
    o += line(sx(v), 76, sx(v), 104, m === 1 ? 'ln' : 'ink');
  }
  o += line(sx(0), 72, sx(0), 108, 'ink-b') + text(sx(0), 124, '0', 'ts', 'middle');
  for (const v of [0.5, 1, 2, 4, 7]) o += text(sx(v), 124, String(v), 'ts', 'middle');
  const gap = (a, b, s) => { o += line(sx(a), 62, sx(b), 62, 'mute') + line(sx(a), 58, sx(a), 66, 'mute') + line(sx(b), 58, sx(b), 66, 'mute') + text((sx(a) + sx(b)) / 2, 52, s, 'ts', 'middle'); };
  gap(1, 1.25, '间隔 ¼');
  gap(2, 2.5, '间隔 ½');
  gap(4, 5, '间隔 1');
  o += text(sx(0.25), 28, '0 和 ½ 之间', 'ts', 'middle') + text(sx(0.25), 44, '一个数都没有', 'ts', 'middle');
  o += text(30, 152, '每跨过一个 2 的 power（粗线），间隔翻倍：绝对间隔不均匀，相对间隔大致恒定。', 't');
  return svg(560, 165, o, '一个玩具 floating-point 系统在 number line 上的分布：越靠近零越密，每过一个 2 的 power 间隔翻倍');
}

// 条件数：两条线的交点对扰动有多敏感
function cond() {
  let o = '';
  const panel = (x0, title, l2, l2p, P, Q, note) => {
    const sx = lin(0, 2, x0, x0 + 200), sy = lin(0, 2, 230, 30);
    o += rect(x0, 30, 200, 200, 'frame');
    const seg = (fn, cls) => {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const x = i / 20, y = fn(x); if (y >= 0 && y <= 2) pts.push([sx(x), sy(y)]); }
      return path(d(pts), cls);
    };
    o += seg((x) => 2 - x, 'ink') + seg(l2, 'ln') + seg(l2p, 'ln-dash');
    o += circle(sx(P[0]), sy(P[1]), 4.5, 'ink-f') + circle(sx(Q[0]), sy(Q[1]), 4.5, 'ln paper-f');
    o += text(x0 + 100, 20, title, 'tb', 'middle') + text(x0 + 100, 250, note, 'ts', 'middle');
  };
  panel(40, 'well-conditioned：接近 perpendicular', (x) => x, (x) => x + 0.15, [1, 1], [0.925, 1.075], '第二条 line 平移一点，intersection 只挪一点');
  panel(320, 'ill-conditioned：几乎 parallel', (x) => (2.05 - x) / 1.05, (x) => (2.08 - x) / 1.05, [1, 1], [0.4, 1.6], '同样小的平移，intersection 从 (1, 1) 跑到 (0.4, 1.6)');
  o += text(280, 272, '实线是原来的 equation，虚线是 right-hand side 改动后的第二个 equation；空心点是新的 solution', 'ts', 'middle');
  return svg(560, 282, o, '左图两条 line 接近 perpendicular，perturbation 之后 intersection 几乎不动；右图两条 line 几乎 parallel，同样的 perturbation 让 intersection 移动很远');
}

// LU 分解：一次分解，多次代入
function lu() {
  const sq = (x, y, s) => rect(x, y, s, s, 'frame');
  const S = 86, y = 28;
  let o = sq(40, y, S) + rect(40, y, S, S, 'wash') + text(40 + S / 2, y + S / 2 + 5, 'A', 'tb', 'middle');
  o += text(148, y + S / 2 + 6, '=', 'tbig', 'middle');
  o += poly([[170, y], [170, y + S], [170 + S, y + S]], 'wash') + sq(170, y, S) + text(170 + 26, y + S - 20, 'L', 'tb', 'middle') + text(170 + S - 22, y + 26, '0', 'ts', 'middle');
  for (let i = 0; i < 4; i++) o += text(170 + 11 + i * 21.5, y + 16 + i * 21.5, '1', 'ts', 'middle');
  o += poly([[280, y], [280 + S, y], [280 + S, y + S]], 'wash') + sq(280, y, S) + text(280 + S - 26, y + 30, 'U', 'tb', 'middle') + text(280 + 22, y + S - 16, '0', 'ts', 'middle');
  o += text(400, y + 22, 'Factorization 只做一次', 'tb') + text(400, y + 42, '约 ⅔ n³ 次 operation', 'ts');
  o += text(400, y + 68, '之后每换一个 b', 'tb') + text(400, y + 88, '只要约 2n² 次 operation', 'ts');
  const yy = 160;
  o += rect(40, yy, 130, 44, 'paper', 6) + text(105, yy + 27, 'Ax = b', 't', 'middle');
  o += arrow(172, yy + 22, 208, yy + 22, 'ink');
  o += rect(210, yy, 150, 44, 'paper', 6) + text(285, yy + 19, 'Ly = b', 't', 'middle') + text(285, yy + 36, 'forward substitution', 'ts', 'middle');
  o += arrow(362, yy + 22, 398, yy + 22, 'ink');
  o += rect(400, yy, 130, 44, 'paper', 6) + text(465, yy + 19, 'Ux = y', 't', 'middle') + text(465, yy + 36, 'back substitution', 'ts', 'middle');
  return svg(560, 220, o, 'A 分解成 lower triangular 的 L 和 upper triangular 的 U；解 system 变成先用 forward substitution 解 Ly 等于 b，再用 back substitution 解 Ux 等于 y');
}

// 最小二乘的几何：b 向 col(A) 投影，残差垂直于 col(A)
function proj() {
  let o = poly([[50, 250], [390, 250], [490, 150], [150, 150]], 'wash ink-s');
  const O = [130, 222], P = [340, 198], B = [340, 52];
  o += arrow(O[0], O[1], P[0], P[1], 'ink') + line(P[0], P[1], B[0], B[1], 'dash') + arrow(O[0], O[1], B[0], B[1], 'ln');
  o += path(d([[P[0] - 13, P[1] + 1.5], [P[0] - 13, P[1] - 11.5], [P[0], P[1] - 13]]), 'ink');
  o += circle(O[0], O[1], 3, 'ink-f');
  o += text(B[0] + 8, B[1] + 4, 'b', 'tl') + text(250, 234, 'p = Ax̂（projection）', 't', 'middle');
  o += text(P[0] + 10, 124, 'e = b − Ax̂', 't') + text(P[0] + 10, 142, '与 plane perpendicular', 'ts');
  o += text(400, 178, 'col(A)', 'tb');
  o += text(280, 280, 'Plane 上离 b 最近的点是 projection p：Aᵀe = 0 正是 normal equations', 'ts', 'middle');
  return svg(560, 290, o, 'Vector b 不在 A 的 column space 这个 plane 上；least squares 的 solution 对应 b 在 plane 上的 projection，error vector 与 plane perpendicular');
}

// Householder 反射：把 x 镜像到第一坐标轴上
function householder() {
  const O = [130, 210], s = 62;
  const X = [O[0] + 2.4 * s, O[1] - 1.8 * s], T = [O[0] + 3 * s, O[1]];
  const half = Math.atan2(1.8, 2.4) / 2;
  const M = [O[0] + 4.4 * s * Math.cos(half), O[1] - 4.4 * s * Math.sin(half)];
  let o = line(O[0] - 20, O[1], O[0] + 4.6 * s, O[1], 'axis') + line(O[0], O[1] + 20, O[0], O[1] - 2.6 * s, 'axis');
  o += line(O[0] - 0.5 * s * Math.cos(half), O[1] + 0.5 * s * Math.sin(half), M[0], M[1], 'dash');
  o += arrow(O[0], O[1], X[0], X[1], 'ln') + arrow(O[0], O[1], T[0], T[1], 'ink') + arrow(T[0], T[1], X[0], X[1], 'mute');
  o += text(X[0] - 8, X[1] - 8, 'x', 'tl', 'end') + text(T[0] - 6, T[1] + 20, '‖x‖ e₁', 't', 'end');
  o += text(M[0] + 6, M[1] + 4, 'mirror', 'ts') + text(T[0] + 10, (T[1] + X[1]) / 2 + 4, 'v = x − ‖x‖e₁', 't');
  o += text(T[0] + 10, (T[1] + X[1]) / 2 + 22, 'perpendicular to mirror', 'ts');
  o += text(O[0] + 4.6 * s, O[1] + 18, 'e₁ 方向', 'ts', 'end');
  o += text(280, 262, 'H = I − 2vvᵀ / vᵀv 把 x 沿 v 方向翻过去：length 不变，其余 component 全部变成 0', 'ts', 'middle');
  return svg(560, 272, o, 'Householder reflection 把 vector x 关于一个 mirror 翻转到第一个 coordinate axis 上，length 保持不变');
}

// Runge 现象：等距节点 vs Chebyshev 节点（10 次多项式）
function runge() {
  const f = (x) => 1 / (1 + 25 * x * x);
  const interp = (nodes) => (x) => {
    let s = 0;
    for (let i = 0; i < nodes.length; i++) {
      let l = 1;
      for (let j = 0; j < nodes.length; j++) if (j !== i) l *= (x - nodes[j]) / (nodes[i] - nodes[j]);
      s += l * f(nodes[i]);
    }
    return s;
  };
  const n = 11;
  const equi = Array.from({ length: n }, (_, i) => -1 + (2 * i) / (n - 1));
  const cheb = Array.from({ length: n }, (_, i) => Math.cos(((2 * i + 1) * Math.PI) / (2 * n)));
  let o = '';
  const panel = (x0, nodes, title) => {
    const sx = lin(-1, 1, x0, x0 + 220), sy = lin(-0.5, 2.05, 215, 30);
    o += rect(x0, 30, 220, 185, 'frame') + line(x0, sy(0), x0 + 220, sy(0), 'grid');
    o += path(curve(f, -1, 1, sx, sy), 'dash') + path(curve(interp(nodes), -1, 1, sx, sy, 400), 'ln');
    for (const x of nodes) o += circle(sx(x), sy(f(x)), 3, 'ink-f');
    o += text(x0 + 110, 20, title, 'tb', 'middle');
    o += text(x0, 232, '−1', 'ts', 'middle') + text(x0 + 220, 232, '1', 'ts', 'middle') + text(x0 - 6, sy(0) + 4, '0', 'ts', 'end') + text(x0 - 6, sy(1) + 4, '1', 'ts', 'end');
  };
  panel(40, equi, '11 个 equispaced node：两端剧烈振荡');
  panel(310, cheb, '11 个 Chebyshev node：贴合');
  o += text(280, 254, '虚线是 f(x) = 1 / (1 + 25x²)，彩线是过这些点的 degree-10 interpolating polynomial', 'ts', 'middle');
  return svg(560, 264, o, '同样是 degree-10 interpolating polynomial：equispaced node 在 interval 两端剧烈振荡，Chebyshev node 则贴合原来的 function');
}

// 数值积分：梯形 vs Simpson
function quad() {
  const f = (x) => 0.35 + 0.9 * Math.sin(1.9 * x + 0.25) * Math.exp(-0.15 * x) + 0.2 * x;
  let o = '';
  const panel = (x0, title, approx, note) => {
    const sx = lin(0, 2, x0, x0 + 210), sy = lin(0, 1.6, 200, 30);
    o += path(area(approx, 0, 2, sx, sy), 'wash') + path(curve(approx, 0, 2, sx, sy), 'ln') + path(curve(f, 0, 2, sx, sy), 'ink');
    o += line(x0 - 6, sy(0), x0 + 216, sy(0), 'axis');
    for (const x of [0, 1, 2]) o += line(sx(x), sy(0), sx(x), sy(approx(x)), 'mute') + circle(sx(x), sy(f(x)), 3.5, 'ink-f');
    o += text(sx(0), 217, 'a', 'ts', 'middle') + text(sx(1), 217, 'midpoint', 'ts', 'middle') + text(sx(2), 217, 'b', 'ts', 'middle');
    o += text(x0 + 105, 20, title, 'tb', 'middle') + text(x0 + 105, 238, note, 'ts', 'middle');
  };
  const trap = (x) => (x <= 1 ? f(0) + (f(1) - f(0)) * x : f(1) + (f(2) - f(1)) * (x - 1));
  const simp = (x) => (f(0) * (x - 1) * (x - 2)) / 2 - f(1) * x * (x - 2) + (f(2) * x * (x - 1)) / 2;
  panel(45, 'Trapezoidal：用 line 代替 curve', trap, 'error ∝ h²');
  panel(315, 'Simpson：用 parabola 代替 curve', simp, 'error ∝ h⁴');
  return svg(560, 250, o, 'Trapezoidal rule 用 line 下的 area 近似 integral，Simpson’s rule 用过三点的 parabola 下的 area 近似 integral');
}

// 幂迭代：反复乘 A = [[2,1],[1,2]]，方向转向主特征向量
function power() {
  const O = [90, 235], R = 190;
  const P = (ang, r = R) => [O[0] + r * Math.cos(ang), O[1] - r * Math.sin(ang)];
  let o = line(O[0] - 10, O[1], O[0] + R + 40, O[1], 'axis') + line(O[0], O[1] + 10, O[0], O[1] - R - 20, 'axis');
  const arc = [];
  for (let i = 0; i <= 40; i++) arc.push(P((Math.PI / 2) * (i / 40)));
  o += path(d(arc), 'grid');
  const e = P(Math.PI / 4, R + 34);
  o += line(O[0], O[1], e[0], e[1], 'dash') + text(e[0] + 6, e[1] + 2, 'eigenvector (1, 1)，λ = 3', 't');
  let v = [1, 0];
  const cls = ['mute', 'ink', 'ink', 'ln'];
  for (let k = 0; k <= 3; k++) {
    const ang = Math.atan2(v[1], v[0]), p = P(ang);
    o += arrow(O[0], O[1], p[0], p[1], cls[k]);
    const q = P(ang, R + 14);
    o += text(q[0] + (k === 0 ? 0 : 4), q[1] + (k === 0 ? 18 : 4 + (3 - k) * 5), 'k = ' + k, k === 3 ? 'tl' : 'ts', k === 0 ? 'middle' : 'start');
    v = [2 * v[0] + v[1], v[0] + 2 * v[1]];
  }
  o += text(330, 150, '与 45° 方向的 angle：', 't') + text(330, 170, '45° → 18.4° → 6.3° → 2.1°', 'tb') + text(330, 190, '偏离的 component 每次乘 λ₂ / λ₁ = ⅓', 'ts');
  return svg(560, 262, o, '从水平方向出发做 power iteration，vector 一步步转向 45 度方向的 eigenvector，偏离每次缩小到三分之一');
}


// 圆 → 椭圆：矩阵范数、条件数、SVD 共用的一张图
function ellipse() {
  const A = [[1.6, 1.1], [-0.3, 1.0]];
  const a = A[0][0] ** 2 + A[1][0] ** 2, b = A[0][0] * A[0][1] + A[1][0] * A[1][1], dd = A[0][1] ** 2 + A[1][1] ** 2;
  const m = (a + dd) / 2, r = Math.hypot((a - dd) / 2, b);
  const s1 = Math.sqrt(m + r), s2 = Math.sqrt(m - r);
  const th = Math.atan2(m + r - a, b);
  const v1 = [Math.cos(th), Math.sin(th)], v2 = [-Math.sin(th), Math.cos(th)];
  const mul = (v) => [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
  const S = 62, L = [130, 150], R = [400, 150];
  const pt = (O, v) => [O[0] + S * v[0], O[1] - S * v[1]];
  let o = '';
  for (const O of [L, R]) o += line(O[0] - 125, O[1], O[0] + 125, O[1], 'grid') + line(O[0], O[1] - 125, O[0], O[1] + 125, 'grid');
  const circ = [], ell = [];
  for (let i = 0; i <= 120; i++) { const t = (2 * Math.PI * i) / 120, v = [Math.cos(t), Math.sin(t)]; circ.push(pt(L, v)); ell.push(pt(R, mul(v))); }
  o += path(d(circ) + 'Z', 'wash ink-s') + path(d(ell) + 'Z', 'wash ink-s');
  const p1 = pt(L, v1), p2 = pt(L, v2), q1 = pt(R, mul(v1)), q2 = pt(R, mul(v2));
  o += arrow(L[0], L[1], p1[0], p1[1], 'ln') + arrow(L[0], L[1], p2[0], p2[1], 'ink');
  o += arrow(R[0], R[1], q1[0], q1[1], 'ln') + arrow(R[0], R[1], q2[0], q2[1], 'ink');
  o += text(p1[0] + 6, p1[1] - 4, 'v₁', 'tl') + text(p2[0] - 6, p2[1] - 6, 'v₂', 'tb', 'end');
  o += text(q1[0] + 8, q1[1] + 4, 'σ₁u₁', 'tl') + text(q2[0] - 4, q2[1] - 8, 'σ₂u₂', 'tb', 'end');
  o += arrow(238, 150, 282, 150, 'ink') + text(260, 140, '乘 A', 'ts', 'middle');
  o += text(L[0], 296, '所有 length 为 1 的 x', 't', 'middle') + text(R[0], 296, '它们的 image Ax', 't', 'middle');
  o += text(280, 318, `这个例子里 σ₁ ≈ ${s1.toFixed(2)}，σ₂ ≈ ${s2.toFixed(2)}：最多 stretch ${s1.toFixed(2)} 倍，最少也有 ${s2.toFixed(2)} 倍，κ = σ₁ / σ₂ ≈ ${(s1 / s2).toFixed(1)}`, 'ts', 'middle');
  return svg(560, 328, o, 'Matrix 把 unit circle 变成 ellipse；ellipse 的 semi-major axis 是最大的 singular value，semi-minor axis 是最小的 singular value，两者之比是 condition number');
}

// 三个点拟合一条直线（18.06 第 16 讲的例子）
function fit3() {
  const sx = lin(0, 4, 60, 300), sy = lin(0, 3, 230, 30);
  const f = (t) => 2 / 3 + t / 2;
  let o = axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 3, xt: [1, 2, 3], yt: [1, 2], xl: 't', yl: 'b', grid: true });
  o += line(sx(0), sy(f(0)), sx(4), sy(f(4)), 'ln');
  const pts = [[1, 1], [2, 2], [3, 2]], lab = ['e₁ = −1/6', 'e₂ = +1/3', 'e₃ = −1/6'];
  pts.forEach(([t, b], i) => {
    o += line(sx(t), sy(b), sx(t), sy(f(t)), 'ink-b') + circle(sx(t), sy(b), 5, 'ink-f') + circle(sx(t), sy(f(t)), 3.5, 'ln paper-f');
    o += i === 1 ? text(sx(t) - 9, (sy(b) + sy(f(t))) / 2 + 4, lab[i], 'ts', 'end') : text(sx(t) + 9, Math.max(sy(b), sy(f(t))) + 14, lab[i], 'ts');
  });
  o += text(sx(0.12), sy(1.42), 'b = 2/3 + t/2', 'tl');
  o += text(330, 70, '三个 equation，两个 unknown：', 'tb') + text(330, 94, 'C + D = 1', 't') + text(330, 114, 'C + 2D = 2', 't') + text(330, 134, 'C + 3D = 2', 't');
  o += text(330, 168, '没有一条 line 同时过三个点。', 't') + text(330, 188, '粗线段是每个点到 line 的', 't') + text(330, 208, 'vertical distance，要让它们的', 't') + text(330, 228, 'sum of squares 最小。', 't');
  return svg(560, 274, o, '三个 data point 和 least squares 的 line b 等于三分之二加二分之 t，以及每个点的 vertical error');
}

// 节点多项式 |ω(x)|：等距节点把误差堆在两端，Chebyshev 节点把它摊平
function nodepoly() {
  const n = 11;
  const equi = Array.from({ length: n }, (_, i) => -1 + (2 * i) / (n - 1));
  const cheb = Array.from({ length: n }, (_, i) => Math.cos(((2 * i + 1) * Math.PI) / (2 * n)));
  const w = (nodes) => (x) => Math.abs(nodes.reduce((p, xi) => p * (x - xi), 1));
  const sx = lin(-1, 1, 60, 530), sy = lin(0, 0.0092, 225, 30);
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 0.0092, xt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], yt: [[0.004, '0.004'], [0.008, '0.008']] });
  o += path(curve(w(equi), -1, 1, sx, sy, 900), 'ln') + path(curve(w(cheb), -1, 1, sx, sy, 900), 'ink');
  for (const x of equi) o += circle(sx(x), sy(0), 3, 'ln-f');
  for (const x of cheb) o += line(sx(x), sy(0) - 7, sx(x), sy(0), 'ink-b');
  o += text(sx(-0.72), sy(0.0079), 'equispaced node：两端高出中间近百倍', 'tl');
  o += text(sx(0), sy(0.0022), 'Chebyshev node：处处一样高，约 0.001', 't', 'middle');
  o += text(295, 268, 'Curve 是 |(x − x₀)(x − x₁)⋯(x − x₁₀)|。圆点是 equispaced node，短竖线是 Chebyshev node。', 'ts', 'middle');
  return svg(560, 278, o, 'Node polynomial 的 absolute value：equispaced node 时在 interval 两端很大而中间很小，Chebyshev node 时在整个 interval 上一样高');
}

// 数值微分的误差随步长 h 的变化：真实的双精度计算结果
function hcurve() {
  const sx = lin(-15, -1, 70, 530), sy = lin(-12.5, 0.5, 230, 28);
  const fwd = (h) => Math.abs((Math.exp(1 + h) - Math.exp(1)) / h - Math.E);
  const cen = (h) => Math.abs((Math.exp(1 + h) - Math.exp(1 - h)) / (2 * h) - Math.E);
  let o = '';
  for (const k of [-15, -13, -11, -9, -7, -5, -3, -1]) o += line(sx(k), sy(-12.5), sx(k), sy(0.5), 'grid') + text(sx(k), 247, '10' + '⁻' + String(-k).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join(''), 'ts', 'middle');
  for (const k of [-12, -8, -4, 0]) o += line(sx(-15), sy(k), sx(-1), sy(k), 'grid') + text(64, sy(k) + 4, k === 0 ? '1' : '10' + '⁻' + String(-k).split('').map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join(''), 'ts', 'end');
  const series = (fn, cls) => {
    const pts = [];
    for (let e = -15; e <= -1; e += 0.25) { const v = fn(10 ** e); if (v > 0) pts.push([sx(e), sy(Math.max(Math.log10(v), -12.5))]); }
    return path(d(pts), cls);
  };
  o += series(fwd, 'ln') + series(cen, 'ink');
  o += text(sx(-14.7), sy(-8.4), '左半边：rounding error ≈ ε / h', 't') + text(sx(-14.7), sy(-9.6), 'h 越小越大，两条 curve 重合', 'ts');
  o += text(sx(-4.6), sy(-1.0), 'forward difference：formula error ∝ h', 'tl', 'end') + text(526, sy(-10.5), 'central difference', 'tb', 'end') + text(526, sy(-11.6), 'formula error ∝ h²', 't', 'end');
  o += line(sx(-8), sy(-12.5), sx(-8), sy(-8.4), 'ln-dash') + text(sx(-8) + 6, sy(-11.7), 'h ≈ 10⁻⁸', 'tl');
  o += text(530, 264, 'step size h（log scale）', 'ts', 'end') + text(70, 18, 'error（log scale）：eˣ 在 x = 1 处的 derivative，double precision 实算', 'tb');
  return svg(560, 272, o, 'Numerical differentiation 的 error 随 step size 变化：step size 从大变小时 error 先下降，过了某个最佳 step size 后因 rounding error 反而上升');
}

// 第 1 站：√(x+1) − √x 在 x = 10¹² 的 cancellation，逐位对齐
function cancel() {
  // exact 值用 BigInt 求 isqrt，取 21 位 decimal
  const isqrt = (n) => { let x = BigInt(Math.floor(Math.sqrt(Number(n)))); for (;;) { const y = (x + n / x) / 2n; if (y >= x) { while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; } x = y; } };
  const exact = isqrt((10n ** 12n + 1n) * 10n ** 42n).toString(); // 1000000 后接 21 位 decimal
  const ND = 15;
  const exactS = exact.slice(0, 7) + exact.slice(7, 7 + ND);
  const storedS = Math.sqrt(1e12 + 1).toFixed(ND).replace('.', '');
  const sqS = (1e6).toFixed(ND).replace('.', '');
  const diffS = (Math.sqrt(1e12 + 1) - 1e6).toFixed(ND).replace('.', '').padStart(7 + ND, '0');
  const exDiffS = '0000000' + exact.slice(7, 7 + ND);
  const W = 16, X0 = 176, H = 26;
  const cx = (i) => X0 + i * W + (i >= 7 ? 10 : 0);
  let o = '';
  const row = (y, lab, s, cls, faintLead) => {
    o += text(X0 - 10, y + 5, lab, 'ts', 'end');
    let lead = true;
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== '0') lead = false;
      o += text(cx(i) + W / 2, y + 5, s[i], faintLead && lead ? 'ts' : cls, 'middle');
    }
    o += text(cx(7) - 5, y + 5, '.', cls, 'middle');
  };
  const y = [40, 40 + H, 40 + 2 * H, 40 + 3 * H + 22, 40 + 4 * H + 22];
  // 13 位相同
  o += rect(cx(0) - 2, y[1] - 12, cx(12) + W - cx(0) + 4, H * 2 - 2, 'wash', 4);
  // error 所在的几位
  o += rect(cx(18) - 1, y[1] - 12, cx(21) + W - cx(18) + 2, H - 4, 'wash-strong', 3);
  o += rect(cx(18) - 1, y[3] - 12, cx(21) + W - cx(18) + 2, H - 4, 'wash-strong', 3);
  row(y[0], '√(x+1) exact', exactS, 'ts', false);
  row(y[1], '√(x+1) stored', storedS, 't', false);
  row(y[2], '√x stored', sqS, 't', false);
  o += line(X0 - 4, y[2] + 14, cx(21) + W + 2, y[2] + 14, 'ink');
  row(y[3], 'stored − stored', diffS, 'tb', true);
  row(y[4], 'exact difference', exDiffS, 'ts', true);
  o += text(cx(0) - 2, 20, '前 13 位（阴影）相同，相减后全部变成 0', 'ts');
  o += text(cx(18) + 30, 20, '10⁻¹² 这一位起', 'ts', 'middle');
  o += line(cx(18) + 30, 26, cx(18) + 30, y[0] - 13, 'mute');
  const yy = y[4] + 34;
  o += text(30, yy, 'stored 的 √(x+1) 比 exact 大 3.8×10⁻¹²（深色那几位）：对 10⁶ 来说是第 18 位，无关紧要。', 'ts');
  o += text(30, yy + 18, '相减之后它原封不动留在结果里，而结果只有 5×10⁻⁷：同样的 3.8 成了第 6 位 significant digit。', 'ts');
  return svg(560, yy + 30, o, 'x 等于 10 的 12 次方时，根号 x+1 与根号 x 逐位对齐：前 13 位相同，相减后消失，原来第 18 位上的 rounding error 变成结果的第 6 位');
}

// 第 3 站：Jacobi 与 Gauss–Seidel 在 plane 里的路径
function jacobi() {
  const it = (gs) => { const P = [[0, 0]]; let [a, b] = [0, 0]; for (let k = 0; k < 4; k++) { const na = (1 - b) / 4; const nb = (2 - (gs ? na : a)) / 3; if (gs) P.push([na, b]); P.push([na, nb]); [a, b] = [na, nb]; } return P; };
  let o = '';
  const panel = (x0, title, gs) => {
    const sx = lin(-0.02, 0.3, x0, x0 + 230), sy = lin(-0.03, 0.75, 250, 40);
    o += rect(x0, 40, 230, 210, 'frame') + text(x0 + 115, 26, title, 'tb', 'middle');
    o += line(sx(0), sy(-0.03), sx(0), sy(0.75), 'grid') + line(sx(-0.02), sy(0), sx(0.3), sy(0), 'grid');
    // 4x1 + x2 = 1 与 x1 + 3x2 = 2
    o += line(sx(0.25 - 0.75 / 4), sy(0.75), sx(0.2575), sy(-0.03), 'ink');
    o += line(sx(-0.02), sy((2.02) / 3), sx(0.3), sy((2 - 0.3) / 3), 'ink');
    o += text(sx(0.2), sy(0.06), '①', 'ts', 'middle');
    o += text(sx(0.285), sy(0.57) + 18, '②', 'ts', 'middle');
    const P = it(gs).map(([a, b]) => [sx(a), sy(b)]);
    for (let i = 1; i < P.length; i++) o += arrow(P[i - 1][0], P[i - 1][1], P[i][0], P[i][1], 'ln', 6);
    o += circle(P[0][0], P[0][1], 3.5, 'ink-f') + text(P[0][0] + 6, P[0][1] - 6, '(0, 0)', 'ts');
    const step = gs ? 2 : 1;
    const q = P[step]; o += circle(q[0], q[1], 3, 'ln-f') + text(q[0] + 4, q[1] - 9, 'k = 1', 'ts');
    for (let k = 2; k <= 4; k++) o += circle(P[k * step][0], P[k * step][1], 2.5, 'ln-f');
    o += circle(sx(1 / 11), sy(7 / 11), 4, 'ink-f');
  };
  panel(30, 'Jacobi：两个 component 一起更新', false);
  panel(300, 'Gauss–Seidel：先 x₁，马上用来算 x₂', true);
  o += text(280, 276, '① 4x₁ + x₂ = 1，② x₁ + 3x₂ = 2；黑点是 exact solution (1/11, 7/11)。', 'ts', 'middle');
  o += text(280, 294, 'Gauss–Seidel 横着走到 ①、再竖着走到 ②；Jacobi 的一步是斜着跳，走到同样近要多一倍的步数。', 'ts', 'middle');
  return svg(560, 304, o, 'Jacobi 与 Gauss–Seidel 从原点出发解 4x1+x2=1、x1+3x2=2：Gauss–Seidel 在两条 line 之间走阶梯，Jacobi 斜着跳');
}

// 第 4 站：Gram–Schmidt，在 a₁、a₂ span 的 plane 里看
function gramschmidt() {
  const r3 = Math.sqrt(3), r2 = Math.sqrt(2);
  const S = 110, O = [70, 230];
  const P = (u, v) => [O[0] + S * u, O[1] - S * v];
  let o = line(O[0] - 20, O[1], O[0] + S * 4.1, O[1], 'grid');
  const a1 = P(r3, 0), a2 = P(2 * r3, r2), pr = P(2 * r3, 0);
  o += line(pr[0], pr[1], a2[0], a2[1], 'dash');
  o += rect(pr[0] - 10, pr[1] - 10, 10, 10, 'mute');
  o += arrow(O[0], O[1], pr[0], pr[1], 'mute') + arrow(O[0], O[1], a1[0], a1[1], 'ink-b') + arrow(O[0], O[1], a2[0], a2[1], 'ink-b');
  o += arrow(O[0], O[1], P(0, r2)[0], P(0, r2)[1], 'ln');
  o += arrow(O[0], O[1], P(1, 0)[0], P(1, 0)[1], 'ln') + arrow(O[0], O[1], P(0, 1)[0], P(0, 1)[1], 'ln');
  o += text(a1[0] - 4, a1[1] + 20, 'a₁ = (1, 1, 1)', 'tb', 'middle');
  o += text(a2[0] + 8, a2[1] - 2, 'a₂ = (1, 2, 3)', 'tb');
  o += text(pr[0] + 8, pr[1] + 20, '(q₁ᵀa₂) q₁ = (2, 2, 2)', 'ts', 'middle');
  o += text(P(0, r2)[0] + 8, P(0, r2)[1] + 4, 'a₂ − (2, 2, 2) = (−1, 0, 1)', 'tl');
  o += text(pr[0] + 8, (pr[1] + a2[1]) / 2 + 4, '同一个 vector', 'ts');
  o += text(P(1, 0)[0] - 8, P(1, 0)[1] - 8, 'q₁', 'tl', 'end') + text(P(0, 1)[0] - 8, P(0, 1)[1] + 4, 'q₂', 'tl', 'end');
  o += text(30, 284, 'a₂ 减去它在 q₁ 方向上的 component，剩下的 (−1, 0, 1) 与 a₁ perpendicular；', 'ts');
  o += text(30, 302, '再各自 scale 到 unit length：‖a₁‖ = √3，‖(−1, 0, 1)‖ = √2。', 'ts');
  return svg(560, 312, o, 'Gram–Schmidt：在 a1 和 a2 所在的 plane 里，a2 减去它在 q1 方向上的 component 2,2,2，剩下 -1,0,1，与 a1 垂直');
}

// 第 6 站：三个点上的 Lagrange basis 与 interpolating polynomial
function lagrange() {
  const X = [1, 2, 3], Y = [1, 2, 2];
  const ell = (i) => (x) => { let l = 1; for (let j = 0; j < 3; j++) if (j !== i) l *= (x - X[j]) / (X[i] - X[j]); return l; };
  const p = (x) => Y.reduce((s, y, i) => s + y * ell(i)(x), 0);
  let o = '';
  // 左：三个 basis function
  {
    const sx = lin(0.75, 3.25, 40, 260), sy = lin(-0.7, 1.5, 240, 40);
    o += axes({ sx, sy, x0: 0.75, x1: 3.25, y0: -0.7, y1: 1.5, xt: [1, 2, 3], yt: [0, 1], grid: false });
    o += line(sx(0.75), sy(1), sx(3.25), sy(1), 'grid') + line(sx(0.75), sy(0), sx(3.25), sy(0), 'grid');
    const cls = ['ink', 'ln', 'dash'];
    for (let i = 0; i < 3; i++) { o += path(curve(ell(i), 0.75, 3.25, sx, sy), cls[i]); o += circle(sx(X[i]), sy(1), 3.5, 'ink-f'); }
    o += text(sx(0.8), sy(0.55), 'ℓ₀', 'tb') + text(sx(2) + 8, sy(1.12), 'ℓ₁', 'tl') + text(sx(3.2), sy(0.55), 'ℓ₂', 'tb', 'end');
    o += text(150, 22, '每个 ℓᵢ 在自己的 node 上是 1，在别的 node 上是 0', 'ts', 'middle');
  }
  // 右：p = 1·ℓ₀ + 2·ℓ₁ + 2·ℓ₂ 与第 4 站的 line
  {
    const sx = lin(0.4, 3.6, 330, 540), sy = lin(0, 3, 240, 40);
    o += axes({ sx, sy, x0: 0.4, x1: 3.6, y0: 0, y1: 3, xt: [1, 2, 3], yt: [1, 2], grid: true });
    o += path(curve((t) => 2 / 3 + t / 2, 0.4, 3.6, sx, sy), 'dash') + path(curve(p, 0.4, 3.6, sx, sy), 'ln');
    X.forEach((x, i) => { o += circle(sx(x), sy(Y[i]), 4.5, 'ink-f'); });
    o += text(sx(2), sy(2.55), 'p(x) = −x²/2 + 5x/2 − 1', 'tl', 'middle');
    o += text(sx(1.3), sy(0.6), '虚线：第 4 站的 line', 'ts');
    o += text(435, 22, '(1, 1)、(2, 2)、(3, 2)：parabola 恰好穿过', 'ts', 'middle');
  }
  return svg(560, 268, o, '左边是三个 node 1、2、3 上的 Lagrange basis function；右边是它们以 1、2、2 为 coefficient 组成的 interpolating parabola，以及第 4 站的 least squares line');
}

export default {
  'dsa2102-cancel': cancel,
  'dsa2102-jacobi': jacobi,
  'dsa2102-gs': gramschmidt,
  'dsa2102-lagrange': lagrange,
  'dsa2102-ellipse': ellipse,
  'dsa2102-fit3': fit3,
  'dsa2102-nodepoly': nodepoly,
  'dsa2102-hcurve': hcurve,
  'dsa2102-power': power,
  'dsa2102-fp': fp,
  'dsa2102-cond': cond,
  'dsa2102-lu': lu,
  'dsa2102-proj': proj,
  'dsa2102-householder': householder,
  'dsa2102-runge': runge,
  'dsa2102-quad': quad,
};
