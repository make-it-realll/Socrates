import { svg, d, path, line, rect, circle, poly, text, arrow, sub } from '../lib/svg.mjs';

// ---------- 公用的小工具 ----------
// 坐标面板：ox, oy 是 origin 的像素位置，s 是每个单位多少像素，box = [x0, x1, y0, y1]（数据坐标）
function plane(ox, oy, s, box) {
  const [x0, x1, y0, y1] = box;
  const P = (x, y) => [ox + s * x, oy - s * y];
  // Liang–Barsky：把线段裁到 box 里
  const clip = (p, q) => {
    let t0 = 0, t1 = 1;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [a, b] of [[-dx, p[0] - x0], [dx, x1 - p[0]], [-dy, p[1] - y0], [dy, y1 - p[1]]]) {
      if (a === 0) { if (b < 0) return null; } else {
        const r = b / a;
        if (a < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; }
      }
    }
    return [[p[0] + t0 * dx, p[1] + t0 * dy], [p[0] + t1 * dx, p[1] + t1 * dy]];
  };
  // 过 a、方向 v 的整条 line（裁到 box 里）
  const through = (a, v, cls) => {
    const c = clip([a[0] - 50 * v[0], a[1] - 50 * v[1]], [a[0] + 50 * v[0], a[1] + 50 * v[1]]);
    return c ? line(...P(...c[0]), ...P(...c[1]), cls) : '';
  };
  const seg = (a, b, cls) => line(...P(...a), ...P(...b), cls);
  const vec = (a, b, cls) => arrow(...P(...a), ...P(...b), cls);
  const dot = (a, r = 4, cls = 'ink-f') => circle(...P(...a), r, cls);
  const label = (a, s2, cls = 't', anchor = 'start') => text(...P(...a), s2, cls, anchor);
  const grid = () => {
    let o = '';
    for (let i = Math.ceil(x0); i <= Math.floor(x1); i++) if (i !== 0) o += seg([i, y0], [i, y1], 'grid');
    for (let j = Math.ceil(y0); j <= Math.floor(y1); j++) if (j !== 0) o += seg([x0, j], [x1, j], 'grid');
    return o;
  };
  const axes2 = () => seg([x0, 0], [x1, 0], 'axis') + seg([0, y0], [0, y1], 'axis');
  // matrix [[a, b], [c, d]] 把整数 grid 送到哪里
  const imgGrid = (m, n = 7) => {
    let o = '';
    const c1 = [m[0][0], m[1][0]], c2 = [m[0][1], m[1][1]];
    for (let i = -n; i <= n; i++) o += through([i * c1[0], i * c1[1]], c2, 'grid') + through([i * c2[0], i * c2[1]], c1, 'grid');
    return o;
  };
  const frame = () => rect(ox + s * x0, oy - s * y1, s * (x1 - x0), s * (y1 - y0), 'frame');
  return { P, through, seg, vec, dot, label, grid, axes2, imgGrid, frame };
}
// 直角记号：顶点 p，两条边的方向 u、w（数据坐标里的 unit vector），边长 k
const corner = (pl, p, u, w, k = 0.2) => path(d([pl.P(p[0] + k * u[0], p[1] + k * u[1]), pl.P(p[0] + k * (u[0] + w[0]), p[1] + k * (u[1] + w[1])), pl.P(p[0] + k * w[0], p[1] + k * w[1])]), 'ink');

// ---------- 第 1 站 ----------
// 同一个 system 的 row picture 和 column picture：2x − y = 0，−x + 2y = 3
function rowcol() {
  let o = '';
  const L = plane(106, 210, 44, [-1.5, 3, -1, 4]);
  o += L.grid() + L.axes2();
  o += L.through([0, 0], [1, 2], 'ink') + L.through([-3, 0], [2, 1], 'ln');
  o += L.dot([1, 2], 4.5);
  o += L.label([2.1, 3.6], '2x − y = 0', 't') + L.label([3, 1.42], '−x + 2y = 3', 'tl', 'end') + L.label([0.85, 2.15], '(1, 2)', 'tb', 'end');
  o += text(139, 22, 'Row picture：两条 line 的 intersection', 'tb', 'middle');
  const R = plane(422.5, 200.5, 37, [-2.5, 2.5, -1.5, 4.5]);
  o += R.grid() + R.axes2();
  o += R.seg([2, -1], [0, 3], 'dash') + R.vec([0, 0], [-1, 2], 'mute') + R.vec([0, 0], [2, -1], 'ink') + R.vec([0, 0], [0, 3], 'ln');
  o += R.dot([0, 3], 3.5, 'ln-f');
  o += R.label([1.55, -1.48], '1 × (2, −1)', 't', 'middle') + R.label([-1.15, 2.05], '(−1, 2)', 'ts', 'end') + R.label([1.2, 1.0], '+ 2 × (−1, 2)', 't') + R.label([0.18, 3.25], 'b = (0, 3)', 'tl');
  o += text(422, 22, 'Column picture：column 的 combination', 'tb', 'middle');
  o += text(139, 280, 'x = 1、y = 2 这个点同时在两条 line 上', 'ts', 'middle') + text(422, 280, '1 × (2, −1) + 2 × (−1, 2) = (0, 3)', 'ts', 'middle');
  return svg(560, 292, o, '左边是 row picture：line 2x − y = 0 和 −x + 2y = 3 相交于 (1, 2)；右边是 column picture：1 倍的 column (2, −1) 加上 2 倍的 column (−1, 2) 等于 b = (0, 3)');
}

// 两个 unknown 的三种结局
function cases() {
  let o = '';
  const panel = (px, title, l2, extra, cap1, cap2, thick = false) => {
    const pl = plane(px + 54, 173.2, 36, [-1.5, 2.5, -0.8, 3.7]);
    o += pl.frame() + pl.axes2() + pl.through([0, 0], [1, 2], thick ? 'ink-b' : 'ink') + l2(pl) + extra(pl);
    o += text(px + 72, 28, title, 'tb', 'middle') + text(px + 72, 222, cap1, 'ts', 'middle') + text(px + 72, 240, cap2, 'ts', 'middle');
  };
  panel(30, '恰好一个 solution', (pl) => pl.through([-3, 0], [2, 1], 'ln'), (pl) => pl.dot([1, 2], 4.5), '2x − y = 0，−x + 2y = 3', '两条 line 相交于一点');
  panel(208, '没有 solution', (pl) => pl.through([0, 1.5], [1, 2], 'ln'), () => '', '2x − y = 0，−4x + 2y = 3', 'parallel：得到 0 = 3');
  panel(386, 'Infinitely many solutions', (pl) => pl.through([0, 0], [1, 2], 'ln-dash'), () => '', '2x − y = 0，−4x + 2y = 0', '两条 line 重合：得到 0 = 0', true);
  return svg(560, 252, o, '三个小图：两条 line 相交于一点时恰好一个 solution；两条 line parallel 时没有 solution；两条 line 重合时有 infinitely many solutions');
}

// 从 reduced row-echelon form 读出 general solution
function stair() {
  let o = '';
  const cx = [83, 129, 175, 221, 282], ry = [74, 104, 134];
  const R = [['1', '2', '0', '−2', '−2'], ['0', '0', '1', '2', '3/2'], ['0', '0', '0', '0', '0']];
  for (const j of [0, 2]) o += rect(cx[j] - 20, 52, 40, 94, 'wash', 4);
  R.forEach((row, i) => row.forEach((v, j) => { o += text(cx[j], ry[i], v, (i === 0 && j === 0) || (i === 1 && j === 2) ? 'tl' : 't', 'middle'); }));
  o += path(d([[58, 54], [52, 54], [52, 144], [58, 144]]), 'ink') + path(d([[306, 54], [312, 54], [312, 144], [306, 144]]), 'ink') + line(252, 54, 252, 144, 'mute');
  o += path(d([[60, 82], [152, 82], [152, 112], [246, 112]]), 'ln');
  const head = [['x₁', 'pivot'], ['x₂', 'free'], ['x₃', 'pivot'], ['x₄', 'free']];
  head.forEach(([v, k], j) => { o += text(cx[j], 40, v, 'tb', 'middle') + text(cx[j], 22, k, j % 2 ? 'ts' : 'tl', 'middle'); });
  o += text(cx[4], 40, 'b', 'tb', 'middle');
  o += text(182, 168, 'Leading entry（彩色的 1）的左边和下面全是 0', 'ts', 'middle');
  o += text(340, 60, 'Row 1：x₁ + 2x₂ − 2x₄ = −2', 't') + text(340, 82, 'Row 2：x₃ + 2x₄ = 3/2', 't') + text(340, 104, 'Row 3：0 = 0', 't');
  o += text(340, 136, 'x₂ = s，x₄ = t 任取，然后', 'ts') + text(340, 156, 'x₁ = −2 − 2s + 2t', 'tb') + text(340, 176, 'x₃ = 3/2 − 2t', 'tb');
  return svg(560, 190, o, 'Augmented matrix 的 reduced row-echelon form：pivot column 是 column 1 和 column 3，对应的 x1 和 x3 由 free variable x2 和 x4 表示');
}

// solution set = particular solution + nullspace（两个 unknown 时是两条 parallel 的 line）
function shift() {
  const pl = plane(150, 184, 40, [-2.5, 2.5, -2.5, 4]);
  let o = pl.grid() + pl.axes2();
  o += pl.through([0, 0], [1, 2], 'ink') + pl.through([0, 1], [1, 2], 'ln');
  o += pl.vec([0, 0], [1, 3], 'ink') + pl.vec([0, 0], [-1, -2], 'ink') + pl.vec([1, 3], [0, 1], 'ln');
  o += pl.dot([1, 3], 4) + pl.dot([0, 1], 4, 'ln-f');
  o += pl.label([0.8, 3.15], 'p = (1, 3)', 'tb', 'end') + pl.label([-0.5, -2.12], 'h = (−1, −2)', 't') + pl.label([-0.22, 1.1], 'p + h = (0, 1)', 'tl', 'end');
  o += text(290, 62, '黑色 line：Kx = 0 的全部 solution', 't') + text(290, 82, '（nullspace，过 origin）', 'ts');
  o += text(290, 118, '彩色 line：Kx = b 的全部 solution', 'tl') + text(290, 138, '（同一条 line 平移了 p）', 'ts');
  o += text(290, 176, 'p 是任意一个 particular solution。', 't') + text(290, 198, 'h 取遍 nullspace 时，', 't') + text(290, 220, 'p + h 取遍 Kx = b 的 solution。', 't');
  return svg(560, 296, o, '过 origin 的 line 是 nullspace；与它 parallel 的另一条 line 是 Kx = b 的 solution set，等于 particular solution p 加上 nullspace 里的 vector');
}

// ---------- 第 3 站 ----------
// determinant = area 的放大倍数：A 把 unit square 送到 area 为 3 的 parallelogram
function areaFig() {
  const A = [[2, -1], [-1, 2]], box = [-1.6, 2.6, -1.6, 2.6];
  let o = '';
  const L = plane(120, 164, 50, box);
  o += L.grid() + L.axes2() + poly([L.P(0, 0), L.P(1, 0), L.P(1, 1), L.P(0, 1)], 'wash ink-s');
  o += L.vec([0, 0], [1, 0], 'ink') + L.vec([0, 0], [0, 1], 'ink');
  o += L.label([0.5, 0.42], 'area 1', 'ts', 'middle') + L.label([1.05, -0.3], 'e₁', 'tb') + L.label([-0.12, 1.05], 'e₂', 'tb', 'end');
  const R = plane(390, 164, 50, box);
  o += R.imgGrid(A) + R.axes2();
  o += poly([R.P(0, 0), R.P(2, -1), R.P(1, 1), R.P(-1, 2)], 'wash ink-s');
  o += path(d([R.P(0, 0), R.P(2, -1), R.P(2, 0.5), R.P(0, 1.5)]) + 'Z', 'dash');
  o += R.vec([0, 0], [2, -1], 'ink') + R.vec([0, 0], [-1, 2], 'ink');
  o += R.label([0.45, 0.42], 'area 3', 'tb', 'middle') + R.label([2, -1.35], 'Ae₁ = (2, −1)', 't', 'middle') + R.label([-1, 2.22], 'Ae₂ = (−1, 2)', 't', 'middle') + R.label([2.08, 0.55], '(2, ½)', 'ts');
  o += arrow(262, 164, 300, 164, 'ink') + text(281, 154, '乘 A', 'ts', 'middle');
  o += text(120, 22, 'Unit square', 'tb', 'middle') + text(390, 22, '它的 image', 'tb', 'middle');
  o += text(280, 268, '每个 grid cell 都变成同样的 parallelogram，所以任何图形的 area 都乘同一个数', 'ts', 'middle');
  o += text(280, 286, '虚线：把 side (−1, 2) 沿 (2, −1) 的方向滑到 (0, 3/2)，area 不变，等于 2 × 3/2 = 3', 'ts', 'middle');
  return svg(560, 298, o, 'Matrix A 把 unit square 变成以 (2, −1) 和 (−1, 2) 为边的 parallelogram，area 是 3；把一条边沿另一条边滑动得到 base 为 2、height 为 3/2 的 parallelogram，area 相同');
}

// ---------- 第 5 站 ----------
// four fundamental subspaces（M 是 3 × 4、rank 2）
function foursub() {
  const t = (15 * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
  const quad = (O, e, g, L, W) => [O, [O[0] + L * e[0], O[1] + L * e[1]], [O[0] + L * e[0] + W * g[0], O[1] + L * e[1] + W * g[1]], [O[0] + W * g[0], O[1] + W * g[1]]];
  const OL = [150, 170], OR = [410, 170];
  let o = '';
  o += poly(quad(OL, [-c, -s], [s, -c], 105, 85), 'wash ink-s') + poly(quad(OL, [c, s], [-s, c], 105, 85), 'wash2 ink-s');
  o += poly(quad(OR, [c, -s], [-s, -c], 105, 85), 'wash ink-s') + poly(quad(OR, [-c, s], [s, c], 60, 48), 'wash2 ink-s');
  o += circle(OL[0], OL[1], 3.5, 'ink-f') + circle(OR[0], OR[1], 3.5, 'ink-f');
  o += text(110, 110, 'row space', 'tb', 'middle') + text(110, 128, 'dim = r = 2', 'ts', 'middle');
  o += text(190, 222, 'nullspace', 'tb', 'middle') + text(190, 240, 'dim = n − r = 2', 'ts', 'middle');
  o += text(450, 110, 'column space', 'tb', 'middle') + text(450, 128, 'dim = r = 2', 'ts', 'middle');
  o += text(392, 252, 'left nullspace', 'tb', 'middle') + text(392, 270, 'dim = m − r = 1', 'ts', 'middle');
  o += arrow(186, 96, 376, 96, 'ln') + text(281, 86, 'x ↦ Mx', 'tl', 'middle');
  o += arrow(226, 182, 401, 171.5, 'mute') + text(312, 166, 'Mx = 0', 'ts', 'middle');
  o += text(150, 28, 'R⁴：x 所在的空间，n = 4', 'tb', 'middle') + text(410, 28, 'R³：b 所在的空间，m = 3', 'tb', 'middle');
  o += text(150, 302, '互相 perpendicular，2 + 2 = n', 'ts', 'middle') + text(410, 302, '互相 perpendicular，2 + 1 = m', 'ts', 'middle');
  return svg(560, 314, o, '左边是 R4 里互相 perpendicular 的 row space 和 nullspace，dimension 都是 2；右边是 R3 里互相 perpendicular 的 column space 和 left nullspace，dimension 是 2 和 1；乘 M 把 row space 送到 column space，把 nullspace 送到 0');
}

// ---------- 第 6 站 ----------
// b = (0, 3) 往 a = (1, 1) 所在的 line 上做 projection
function proj() {
  const pl = plane(157.6, 228.8, 58, [-2.2, 3.2, -0.6, 3.6]);
  const r = Math.SQRT1_2;
  let o = pl.grid() + pl.axes2();
  o += pl.through([0, 0], [1, 1], 'dash') + pl.through([0, 0], [1, -1], 'grid');
  o += pl.seg([1.5, 1.5], [0, 3], 'dash') + pl.seg([-1.5, 1.5], [0, 3], 'dash');
  o += corner(pl, [1.5, 1.5], [-r, -r], [-r, r]);
  o += pl.vec([0, 0], [-1.5, 1.5], 'mute') + pl.vec([0, 0], [1.5, 1.5], 'ink') + pl.vec([0, 0], [0, 3], 'ln');
  o += pl.dot([1, 1], 4);
  o += pl.label([0.12, 3.18], 'b = (0, 3)', 'tl') + pl.label([1.75, 1.28], 'p = (3/2, 3/2)', 'tb') + pl.label([1.15, 0.7], 'a = (1, 1)', 't') + pl.label([0.92, 2.4], 'e = b − p', 't') + pl.label([-1.6, 1.25], '(−3/2, 3/2)', 'ts', 'end');
  o += text(366, 62, 'c = a·b / a·a = 3/2', 't') + text(366, 84, 'p = c a = (3/2, 3/2)', 't') + text(366, 106, 'e = b − p = (−3/2, 3/2)', 't') + text(366, 128, 'e·a = −3/2 + 3/2 = 0', 't');
  o += text(366, 164, 'e 也是 b 在 (1, −1) 方向上的', 'ts') + text(366, 182, 'projection，所以 b = p + e 是', 'ts') + text(366, 200, '两个互相 perpendicular 的', 'ts') + text(366, 218, 'component 之和。', 'ts');
  return svg(560, 276, o, 'Vector b = (0, 3) 在过 a = (1, 1) 的 line 上的 projection 是 p = (3/2, 3/2)，error e = b − p 与 a perpendicular');
}

// Gram–Schmidt：从 u2 里减掉它在 v1 方向上的 projection
function gs() {
  const pl = plane(174, 170, 60, [-2.4, 2.6, -1.5, 2.5]);
  const k = 1 / Math.sqrt(5);
  let o = pl.grid() + pl.axes2();
  o += pl.through([0, 0], [2, -1], 'dash') + pl.seg([-1.6, 0.8], [-1, 2], 'dash') + pl.seg([0.6, 1.2], [-1, 2], 'dash');
  o += corner(pl, [0, 0], [2 * k, -k], [k, 2 * k], 0.18);
  o += pl.vec([0, 0], [-1.6, 0.8], 'mute') + pl.vec([0, 0], [2, -1], 'ink') + pl.vec([0, 0], [-1, 2], 'ink') + pl.vec([0, 0], [0.6, 1.2], 'ln');
  o += pl.label([1.3, -0.38], 'u₁ = v₁ = (2, −1)', 't') + pl.label([-1.1, 2.12], 'u₂ = (−1, 2)', 't', 'end') + pl.label([0.75, 1.2], 'v₂ = (3/5, 6/5)', 'tl');
  o += pl.label([-0.2, -0.32], 'u₂ 的 projection', 'ts', 'end') + pl.label([-0.2, -0.6], '(−8/5, 4/5)', 'ts', 'end');
  o += text(356, 110, 'v₁ = u₁', 't') + text(356, 134, 'v₂ = u₂ − (u₂·v₁ / v₁·v₁) v₁', 't') + text(380, 156, '= (−1, 2) + (4/5)(2, −1)', 't') + text(380, 178, '= (3/5, 6/5)', 't') + text(356, 210, 'v₂·v₁ = 6/5 − 6/5 = 0', 'tb');
  return svg(560, 276, o, 'Gram–Schmidt 的一步：u2 = (−1, 2) 减去它在 v1 = (2, −1) 方向上的 projection (−8/5, 4/5)，剩下的 v2 = (3/5, 6/5) 与 v1 perpendicular');
}

// ---------- 第 7 站 ----------
// 哪些方向乘完之后还在自己的 line 上：A 有两个，shear N 只有一个
function eigFig() {
  const box = [-3.3, 3.3, -3.3, 3.3];
  let o = '';
  const A = [[2, -1], [-1, 2]], N = [[1, 1], [0, 1]];
  const L = plane(140, 152, 34, box);
  o += L.imgGrid(A) + L.frame() + L.through([0, 0], [1, 1], 'ln-dash') + L.through([0, 0], [1, -1], 'ln-dash');
  o += L.vec([0, 0], [1, 0], 'mute') + L.vec([0, 0], [2, -1], 'ink') + L.vec([0, 0], [1, 1], 'ln') + L.vec([0, 0], [3, -3], 'ln');
  o += L.dot([1, -1], 3.5, 'ln-f');
  o += L.label([1.25, 0.72], '(1, 1)：λ = 1', 'tl') + L.label([2.55, -3.1], '(1, −1)：λ = 3', 'tl', 'end') + L.label([0.75, 0.12], 'x', 'ts') + L.label([2.12, -0.9], 'Ax', 't');
  const R = plane(420, 152, 34, box);
  o += R.imgGrid(N) + R.frame() + R.through([0, 0], [1, 0], 'ln-dash');
  o += R.vec([0, 0], [0, 2], 'mute') + R.vec([0, 0], [2, 2], 'ink') + R.vec([0, 0], [1, -2], 'mute') + R.vec([0, 0], [-1, -2], 'ink') + R.vec([0, 0], [2, 0], 'ln');
  o += R.label([2.1, -0.58], '(1, 0)：λ = 1', 'tl', 'middle') + R.label([-0.15, 2.05], 'x', 'ts', 'end') + R.label([2.1, 2.05], 'Nx', 't') + R.label([1.12, -2.1], 'x', 'ts') + R.label([-1.15, -2.1], 'Nx', 't', 'end');
  o += text(140, 24, 'A：两个方向留在自己的 line 上', 'tb', 'middle') + text(420, 24, 'Shear N：只有一个方向', 'tb', 'middle');
  o += text(280, 288, '细线是 integer grid 的 image，虚线是 eigenvector 所在的 line；灰色箭头是 x，黑色箭头是它的 image', 'ts', 'middle');
  return svg(560, 300, o, '左图：matrix A 把 (1, 1) 方向的 vector 留在原地，把 (1, −1) 方向的 vector 放大 3 倍，其余 vector 都被转了方向。右图：shear 只把 x-axis 方向的 vector 留在原来的 line 上');
}

// diagonalization：同一个 transformation 在两组 coordinates 下
function similar() {
  let o = '';
  const bx = (x, y, a, b) => rect(x, y, 180, 54, 'paper', 8) + text(x + 90, y + 23, a, 'tb', 'middle') + text(x + 90, y + 42, b, 'ts', 'middle');
  o += bx(50, 36, 'x', 'standard coordinates') + bx(330, 36, 'Ax', 'standard coordinates');
  o += bx(50, 166, '[x]' + sub('W'), '相对 eigenvector basis') + bx(330, 166, '[Ax]' + sub('W'), '相对 eigenvector basis');
  o += arrow(234, 63, 326, 63, 'ink') + text(280, 53, '乘 A', 't', 'middle');
  o += arrow(234, 193, 326, 193, 'ln') + text(280, 183, '乘 D', 'tl', 'middle');
  o += arrow(140, 162, 140, 94, 'ink') + text(130, 132, '乘 P', 't', 'end');
  o += arrow(420, 94, 420, 162, 'ink') + text(430, 132, '乘 P⁻¹', 't');
  o += text(280, 250, '下面一行里，乘 D 只是把每个 coordinate 各自乘上它的 λ', 'ts', 'middle');
  o += text(280, 270, '从左下到右下有两条路：直接乘 D，或者先乘 P、再乘 A、最后乘 P⁻¹', 'ts', 'middle') + text(280, 292, '两条路的结果相同，所以 D = P⁻¹AP', 'tb', 'middle');
  return svg(560, 306, o, '四个方框组成的图：下面一行是 eigenvector basis 下的 coordinates，乘 D 从左到右；上面一行是 standard coordinates，乘 A 从左到右；左边向上乘 P，右边向下乘 P 的 inverse');
}

// ---------- 第 8 站 ----------
// linear transformation 由 T(e1)、T(e2) 决定
function lt() {
  let o = '';
  const L = plane(118, 154, 40, [-2.2, 2.2, -0.6, 2.6]);
  o += L.grid() + L.axes2() + L.seg([0, 0], [-1, 0], 'dash') + L.seg([-1, 0], [-1, 2], 'dash');
  o += L.vec([0, 0], [1, 0], 'ink') + L.vec([0, 0], [0, 1], 'ink') + L.vec([0, 0], [-1, 2], 'ln');
  o += L.label([1.05, -0.38], 'e₁', 'tb') + L.label([0.12, 1.08], 'e₂', 'tb') + L.label([-0.85, 2.2], 'x = −1·e₁ + 2·e₂', 'tl');
  const T = [[1, 3], [-2, 0]];
  const R = plane(327.6, 133.6, 36, [-1.6, 5.6, -2.6, 2.6]);
  o += R.imgGrid(T) + R.axes2() + R.seg([0, 0], [-1, 2], 'dash') + R.seg([-1, 2], [5, 2], 'dash');
  o += R.vec([0, 0], [1, -2], 'ink') + R.vec([0, 0], [3, 0], 'ink') + R.vec([0, 0], [5, 2], 'ln');
  o += R.label([1.2, -2.15], 'T(e₁) = (1, −2)', 't') + R.label([3.3, -0.6], 'T(e₂) = (3, 0)', 't', 'middle') + R.label([5.5, 2.28], 'T(x) = −1·T(e₁) + 2·T(e₂) = (5, 2)', 'tl', 'end');
  o += arrow(214, 133.6, 258, 133.6, 'ink') + text(236, 123, 'T', 'ts', 'middle');
  o += text(118, 22, 'x 用 e₁、e₂ 拼出来', 'tb', 'middle') + text(400, 22, 'T(x)：同样的 weight，换成 T(e₁)、T(e₂)', 'tb', 'middle');
  o += text(280, 262, 'Standard matrix 的两个 column 就是 T(e₁) = (1, −2) 和 T(e₂) = (3, 0)', 'ts', 'middle');
  return svg(560, 274, o, '左边：x = (−1, 2) 写成 −1 倍的 e1 加 2 倍的 e2。右边：linear transformation 之后，T(x) 等于 −1 倍的 T(e1) 加 2 倍的 T(e2)，即 (5, 2)');
}

export default {
  'ma2001-rowcol': rowcol,
  'ma2001-cases': cases,
  'ma2001-stair': stair,
  'ma2001-shift': shift,
  'ma2001-area': areaFig,
  'ma2001-foursub': foursub,
  'ma2001-proj': proj,
  'ma2001-gs': gs,
  'ma2001-eig': eigFig,
  'ma2001-similar': similar,
  'ma2001-lt': lt,
};
