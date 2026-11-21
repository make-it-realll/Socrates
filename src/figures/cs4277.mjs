import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 小型线性代数 ----------
const D = Math.PI / 180;
const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mv = (A, v) => A.map((r) => r.reduce((s, a, k) => s + a * v[k], 0));
const tr = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => Math.sqrt(dot(a, a));
const sub = (a, b) => a.map((v, i) => v - b[i]);
const add = (a, b, k = 1) => a.map((v, i) => v + k * b[i]);
const sk = (v) => [[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]];
function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const m = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= m * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}
const inv = (A) => { const n = A.length; const cols = A.map((_, j) => solve(A, A.map((_, i) => (i === j ? 1 : 0)))); return tr(cols); };
const lsq = (A, b) => { const At = tr(A); return solve(mm(At, A), mv(At, b)); };
// 对称矩阵的 Jacobi eigen：返回 [values, vectors(列)]
function eigSym(S) {
  const n = S.length, A = S.map((r) => r.slice()), V = A.map((_, i) => A.map((_, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-14) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = A[k][p], b = A[k][q]; A[k][p] = c * a - s * b; A[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = A[p][k], b = A[q][k]; A[p][k] = c * a - s * b; A[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  const idx = A.map((_, i) => i).sort((i, j) => A[j][j] - A[i][i]);
  return [idx.map((i) => A[i][i]), V.map((r) => idx.map((i) => r[i]))];
}
const rnd = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// ---------- 第 1 到 4 站共用的 camera：f = 500，c = (320, 240)，高 1.5 m，向下 30°，yaw 25°，roll 8° ----------
const K = [[500, 0, 320], [0, 500, 240], [0, 0, 1]];
const RyA = (a) => [[Math.cos(a), 0, -Math.sin(a)], [0, 1, 0], [Math.sin(a), 0, Math.cos(a)]];
const RxA = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
const RzA = (a) => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
const R1 = mm(RzA(8 * D), mm(RxA(30 * D), RyA(25 * D)));
const C1 = [0, -1.5, 0];
const camP = (R, C) => { const KR = mm(K, R), t = mv(KR, C).map((v) => -v); return KR.map((r, i) => [...r, t[i]]); };
const P1 = camP(R1, C1);
const R2 = mm(R1, RyA(-10 * D)), C2 = add(C1, [0.8, 0, 0]);
const P2 = camP(R2, C2);
const prj = (P, X) => { const p = mv(P, [...X, 1]); return [p[0] / p[2], p[1] / p[2]]; };
const hom = (p) => [p[0] / p[2], p[1] / p[2]];

// 地面 tile：X = 0..3，Z = 2..6
function tileGrid(map, o, cls = 'wash') {
  for (let X = 0; X < 3; X++) for (let Z = 2; Z < 6; Z++) {
    if ((X + Z) % 2) continue;
    o.s += poly([[X, Z], [X + 1, Z], [X + 1, Z + 1], [X, Z + 1]].map(([a, b]) => map(a, b)), cls);
  }
  for (let X = 0; X <= 3; X++) o.s += path(d([map(X, 2), map(X, 6)]), 'ink');
  for (let Z = 2; Z <= 6; Z++) o.s += path(d([map(0, Z), map(3, Z)]), 'ink');
}

// 图 1：一张斜拍的地面
function tiles() {
  const s = 0.5, ox = 24, oy = 64;
  const S = ([u, v]) => [ox + s * u, oy + s * v];
  const o = { s: '' };
  o.s += rect(ox, oy, 320, 240, 'paper');
  tileGrid((X, Z) => S(prj(P1, [X, 0, Z])), o);
  const vz = S(prj(P1, [0, 0, 1e9].map((v, i) => (i === 2 ? 1e9 : 0)))), vzR = prj(P1, [0, 0, 1e9]);
  // Z 方向的 line 延长到 vanishing point
  for (let X = 0; X <= 3; X++) o.s += path(d([S(prj(P1, [X, 0, 6])), vz]), 'dash');
  const vx = mv(P1, [1, 0, 0, 0]), vxp = hom(vx);
  for (let Z = 2; Z <= 6; Z += 2) { const a = S(prj(P1, [3, 0, Z])), dir = sub(S(vxp), a), L = 36 / nrm(dir); o.s += arrow(a[0], a[1], a[0] + dir[0] * L, a[1] + dir[1] * L, 'mute', 5); }
  o.s += circle(vz[0], vz[1], 4, 'ln-f');
  o.s += text(vz[0] + 8, vz[1] - 6, 'vanishing point (93.6, −83.3)', 'tl');
  // vanishing line：过两个 vanishing point
  const l = cross(mv(P1, [1, 0, 0, 0]), mv(P1, [0, 0, 1, 0]));
  const yAt = (u) => -(l[0] * u + l[2]) / l[1];
  o.s += path(d([S([-30, yAt(-30)]), S([1050, yAt(1050)])]), 'ln-dash');
  o.s += text(S([1050, yAt(1050)])[0] - 4, S([1050, yAt(1050)])[1] + 18, 'vanishing line', 'tl', 'end');
  o.s += text(ox + 4, oy + 254, 'image（640 × 480，缩小一半）', 'ts');
  const tx = 372;
  o.s += text(tx, 120, '每一行 tile 的四条边', 'ts') + text(tx, 136, '在 world 里互相 parallel，', 'ts') + text(tx, 152, '在 image 里交于一点。', 'ts');
  o.s += text(tx, 188, '另一组 parallel 的边（灰箭头）', 'ts') + text(tx, 204, '交在右边 image 外很远的', 'ts') + text(tx, 220, '(' + vxp.map((v) => v.toFixed(0)).join(', ') + ')。', 'ts');
  o.s += text(tx, 256, '沿 X = 1 那条边：Z 从 2 到 3', 'ts') + text(tx, 272, '是 97 pixel，从 4 到 5 只有 42。', 'ts');
  return svg(560, 330, o.s, '斜着拍的 tile 地面：world 里 parallel 的边在 image 里交于 vanishing point，两个 vanishing point 连成 vanishing line');
}

// 图 2：同一块地面，image → affine rectification → metric rectification
function rectify() {
  const lInf = cross(mv(P1, [1, 0, 0, 0]), mv(P1, [0, 0, 1, 0])), l3 = lInf.map((v) => v / lInf[2]);
  const HA = [[1, 0, 0], [0, 1, 0], l3];
  const img = (X, Z) => prj(P1, [X, 0, Z]);
  const aff = (X, Z) => hom(mv(HA, [...img(X, Z), 1]));
  // 由两对 perpendicular 的 line 解 S = AAᵀ
  const L = (p, q) => cross([...p, 1], [...q, 1]);
  const pairs = [[L(aff(0, 2), aff(0, 3)), L(aff(0, 2), aff(1, 2))], [L(aff(0, 2), aff(1, 3)), L(aff(0, 3), aff(1, 2))]];
  const A = pairs.map(([l, m]) => [l[0] * m[0], l[0] * m[1] + l[1] * m[0], l[1] * m[1]]);
  // null vector：s = (1, s12, s22)
  const [s12, s22] = solve([[A[0][1], A[0][2]], [A[1][1], A[1][2]]], [-A[0][0], -A[1][0]]);
  const l11 = 1, l21 = s12, l22 = Math.sqrt(s22 - s12 * s12);
  const Li = inv([[l11, 0], [l21, l22]]);
  const met = (X, Z) => { const p = aff(X, Z); return mv(Li, p); };
  let o = '';
  const panel = (x0, w, map, title, note1, note2) => {
    const pts = []; for (let X = 0; X <= 3; X++) for (let Z = 2; Z <= 6; Z++) pts.push(map(X, Z));
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const [a, b, c, e] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const sc = Math.min(w / (b - a), 170 / (e - c));
    const T = (X, Z) => { const p = map(X, Z); return [x0 + (w - sc * (b - a)) / 2 + sc * (p[0] - a), 40 + (170 - sc * (e - c)) / 2 + sc * (p[1] - c)]; };
    const q = { s: '' }; tileGrid(T, q); o += q.s;
    // 标出一格 tile
    o += poly([T(0, 2), T(1, 2), T(1, 3), T(0, 3)], 'wash-strong');
    o += text(x0 + w / 2, 24, title, 'tb', 'middle') + text(x0 + w / 2, 236, note1, 'ts', 'middle') + text(x0 + w / 2, 252, note2, 'ts', 'middle');
  };
  const angOf = (map) => { const u = sub(map(0, 3), map(0, 2)), w = sub(map(1, 2), map(0, 2)); return [Math.acos(dot(u, w) / nrm(u) / nrm(w)) / D, nrm(u) / nrm(w)]; };
  const [aA, rA] = angOf(aff);
  o += arrow(186, 125, 202, 125, 'ink') + arrow(372, 125, 388, 125, 'ink');
  o += text(194, 112, 'H', 'ts', 'middle') + text(194, 112, '', 'ts') + text(380, 112, 'H', 'ts', 'middle');
  o += text(194, 146, 'A', 'ts', 'middle') + text(380, 146, 'M', 'ts', 'middle');
  panel(10, 168, img, '原来的 image', '近大远小，', 'parallel 的边相交');
  panel(206, 162, aff, 'affine rectification 之后', 'parallel 恢复；深色那格', 'angle ' + aA.toFixed(1) + '°，两边之比 1 : ' + (1 / rA).toFixed(1));
  panel(396, 156, met, 'metric rectification 之后', 'angle 90°，两边之比 1 : 1', '（差一个 similarity）');
  return svg(560, 262, o, '同一块 tile 地面三次变换：原图中 parallel 的边相交；affine rectification 后 parallel 恢复但 tile 是斜的 parallelogram；metric rectification 后 tile 恢复成 square');
}

// 图 3：地上一个 1 m 的 box，三个 orthogonal 方向的 vanishing point 和 principal point
function vp3() {
  const v = [mv(P1, [1, 0, 0, 0]), mv(P1, [0, 0, 1, 0]), mv(P1, [0, 1, 0, 0])].map(hom);
  const xs = v.map((p) => p[0]), ys = v.map((p) => p[1]);
  const a = Math.min(...xs, 0), b = Math.max(...xs, 640), c = Math.min(...ys, 0), e = Math.max(...ys, 480);
  const sc = Math.min(500 / (b - a), 330 / (e - c));
  const S = ([u, w]) => [30 + sc * (u - a), 30 + sc * (w - c)];
  let o = rect(...S([0, 0]), 640 * sc, 480 * sc, 'paper');
  const cube = []; for (const x of [1, 2]) for (const y of [0, -1]) for (const z of [3, 4]) cube.push([x, y, z]);
  const E = [[0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7]];
  const dirOf = (i, j) => (cube[i][0] !== cube[j][0] ? 0 : cube[i][2] !== cube[j][2] ? 1 : 2);
  // 每条 edge 延长到它的 vanishing point
  for (const [i, j] of E) { const p = S(prj(P1, cube[i])); o += path(d([p, S(v[dirOf(i, j)])]), 'grid'); }
  // 三角形和 altitude
  o += path(d([S(v[0]), S(v[1]), S(v[2])]) + 'Z', 'mute');
  const pp = S([320, 240]);
  for (let k = 0; k < 3; k++) {
    const A = v[k], B = v[(k + 1) % 3], Cc = v[(k + 2) % 3];
    const bc = sub(Cc, B), t = dot(sub(A, B), bc) / dot(bc, bc), foot = add(B, bc, t);
    o += path(d([S(A), S(foot)]), 'ln-dash');
  }
  const top = [[0, 4], [2, 6], [4, 5], [0, 1], [2, 3], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [1, 5], [3, 7]];
  o += poly([0, 4, 6, 2].map((i) => S(prj(P1, cube[i]))), 'wash');
  for (const [i, j] of top) o += path(d([S(prj(P1, cube[i])), S(prj(P1, cube[j]))]), 'ink-b');
  o += circle(...pp, 4, 'ink-f');
  o += text(pp[0] + 10, pp[1] + 20, 'principal point (320, 240)', 'tb');
  const lab = ['X 方向', 'Z 方向', '竖直方向'];
  v.forEach((p, k) => { const q = S(p); o += circle(q[0], q[1], 4.5, 'ln-f'); });
  const q0 = S(v[0]), q1 = S(v[1]), q2 = S(v[2]);
  o += text(q0[0] - 4, q0[1] - 16, lab[0] + ' (' + v[0].map((x) => x.toFixed(0)).join(', ') + ')', 'tl', 'end');
  o += text(q1[0] + 10, q1[1] - 4, lab[1] + ' (' + v[1].map((x) => x.toFixed(1).replace('-', '−')).join(', ') + ')', 'tl');
  o += text(q2[0] + 10, q2[1] + 4, lab[2] + ' (' + v[2].map((x) => x.toFixed(0)).join(', ') + ')', 'tl');
  o += text(S([0, 480])[0] + 2, S([0, 480])[1] + 14, 'image', 'ts');
  o += text(320, 290, '三条 altitude（彩色虚线）', 'ts') + text(320, 306, '交于 principal point：它是这个', 'ts') + text(320, 322, 'triangle 的 orthocenter。', 'ts');
  return svg(560, 380, o, '一个 box 的三组 parallel edge 延长后交于三个 vanishing point，它们组成的 triangle 的三条 altitude 交于 principal point');
}

// ---------- 第 3 站：两张 image 的 projective reconstruction ----------
const pinv34 = (P) => { const Pt = tr(P); return mm(Pt, inv(mm(P, Pt))); };
function triLin(Pa, Pb, xa, xb) {
  const rows = [], rhs = [];
  for (const [P, x] of [[Pa, xa], [Pb, xb]]) for (const k of [0, 1]) {
    const r = P[2].map((v, j) => x[k] * v - P[k][j]); rows.push(r.slice(0, 3)); rhs.push(-r[3]);
  }
  return lsq(rows, rhs);
}
const cube8 = []; for (const x of [1, 2]) for (const y of [0, -1]) for (const z of [3, 4]) cube8.push([x, y, z]);
const cubeE = [[0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7]];
function recon3() {
  const e2 = mv(P2, [...C1, 1]);
  const F0 = mm(sk(e2), mm(P2, pinv34(P1))), fn = Math.sqrt(F0.flat().reduce((a, v) => a + v * v, 0));
  const F = F0.map((r) => r.map((v) => v / fn));
  const ep = hom(e2).concat(1);
  const Pa = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]];
  const M = mm(sk(ep), F); const Pb = M.map((r, i) => [...r, ep[i]]);
  const Xp = cube8.map((X) => triLin(Pa, Pb, prj(P1, X), prj(P2, X)));
  // plane at infinity：三组 parallel edge 在 Xp 里的交点
  const meet = (a, b, c, e) => { const u = sub(b, a), w = sub(e, c); const st = lsq(u.map((_, i) => [u[i], -w[i]]), sub(c, a)); return add(a, u, st[0]); };
  const V = [meet(Xp[0], Xp[4], Xp[2], Xp[6]), meet(Xp[0], Xp[2], Xp[1], Xp[3]), meet(Xp[0], Xp[1], Xp[4], Xp[5])];
  const p = solve(V, [-1, -1, -1]); // pᵀX + 1 = 0
  const Xa = Xp.map((X) => { const w = dot(p, X) + 1; return X.map((v) => v / w); });
  const Hm = [[...K[0], 0], [...K[1], 0], [...K[2], 0], [...mv(tr(K), p).map((v) => -v), 1]];
  const Hi = inv(Hm);
  const Xm = Xp.map((X) => { const y = mv(Hi, [...X, 1]); return [y[0] / y[3], y[1] / y[3], y[2] / y[3]]; });
  return { F, Xp, Xa, Xm, p };
}
function projrecon() {
  const { Xp, Xa, Xm } = recon3();
  let o = '';
  const view = (X) => { const a = -32 * D, b = 26 * D; const x1 = Math.cos(a) * X[0] - Math.sin(a) * X[2], z1 = Math.sin(a) * X[0] + Math.cos(a) * X[2]; return [x1, Math.cos(b) * X[1] + Math.sin(b) * z1]; };
  const panel = (x0, Xs, title, n1, n2, perAxis) => {
    // perAxis：先把每个 coordinate 各自缩放到 [0, 1]（affine 变换，不改变 parallel 与否）
    let Y = Xs;
    if (perAxis) { const lo = [0, 1, 2].map((k) => Math.min(...Xs.map((X) => X[k]))), hi = [0, 1, 2].map((k) => Math.max(...Xs.map((X) => X[k]))); Y = Xs.map((X) => X.map((v, k) => (v - lo[k]) / (hi[k] - lo[k]))); }
    const Q = Y.map(view), xs = Q.map((q) => q[0]), ys = Q.map((q) => q[1]);
    const [a, b, c, e] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const sc = Math.min(150 / (b - a), 150 / (e - c));
    const T = (q) => [x0 + 90 - sc * (a + b) / 2 + sc * q[0], 125 - sc * (c + e) / 2 + sc * q[1]];
    const S = Q.map(T);
    o += poly([0, 4, 6, 2].map((i) => S[i]), 'wash');
    cubeE.forEach(([i, j], k) => { o += line(...S[i], ...S[j], k < 4 ? 'ln' : 'ink-b'); });
    o += text(x0 + 90, 24, title, 'tb', 'middle') + text(x0 + 90, 232, n1, 'ts', 'middle') + text(x0 + 90, 248, n2, 'ts', 'middle');
  };
  const ang = (a, b) => Math.acos(Math.abs(dot(a, b)) / nrm(a) / nrm(b)) / D;
  const ex = (X) => [[0, 4], [1, 5], [2, 6], [3, 7]].map(([i, j]) => sub(X[j], X[i]));
  const ep = ex(Xp);
  panel(0, Xp, 'projective', '彩色的四条 edge 本来 parallel，', '现在两两成 ' + ang(ep[0], ep[1]).toFixed(1) + '° 到 ' + ang(ep[0], ep[3]).toFixed(1) + '°', true);
  panel(190, Xa, 'affine（找到 π∞ 之后）', 'parallel 恢复，', 'angle 还不对', true);
  const em = [sub(Xm[4], Xm[0]), sub(Xm[2], Xm[0]), sub(Xm[1], Xm[0])];
  panel(380, Xm, 'metric（再用上 K）', '三个 angle ' + em.map((a, i) => ang(a, em[(i + 1) % 3]).toFixed(1) + '°').join('、'), '三条 edge 等长', false);
  return svg(560, 258, o, '同一组两张 image 重建出的 cube：projective 时 parallel 的 edge 相交，affine 时恢复 parallel 但 angle 不对，metric 时恢复成正方体');
}

// 图：generalized camera（两个 camera 的 rig 动了一下）
function rig() {
  const s = 64, O = [60, 250];
  const W = ([x, z]) => [O[0] + s * x, O[1] - s * z];
  const pose = (th, t) => (p) => [Math.cos(th) * p[0] + Math.sin(th) * p[1] + t[0], -Math.sin(th) * p[0] + Math.cos(th) * p[1] + t[1]];
  const camA = [-0.35, 0], camB = [0.35, 0];
  const T1 = pose(0, [0.6, 0.2]), T2 = pose(-12 * D, [2.6, 0.5]);
  let o = '';
  const drawRig = (T, lab) => {
    const body = [[-0.5, -0.12], [0.5, -0.12], [0.5, 0.12], [-0.5, 0.12]].map((p) => W(T(p)));
    o += poly(body, 'paper');
    for (const c of [camA, camB]) {
      const wedge = [c, [c[0] - 0.16, c[1] + 0.3], [c[0] + 0.16, c[1] + 0.3]].map((p) => W(T(p)));
      o += poly(wedge, 'wash') + path(d([...wedge, wedge[0]]), 'ink');
    }
    const m = W(T([0, -0.12])); o += text(m[0], m[1] + 48, lab, 'ts', 'middle');
  };
  drawRig(T1, 'rig 在时刻 1'); drawRig(T2, 'rig 在时刻 2');
  const X = [2.0, 3.05];
  const ca = T1(camA), cb = T2(camB);
  o += line(...W(ca), ...W(X), 'ln') + line(...W(cb), ...W(X), 'ln');
  o += circle(...W(X), 5, 'ink-f') + text(W(X)[0] + 10, W(X)[1] - 4, '3D point', 't');
  o += circle(...W(ca), 3.5, 'ink-f') + circle(...W(cb), 3.5, 'ink-f');
  o += text(W(ca)[0] - 22, W(ca)[1] + 38, 'camera a', 'ts', 'end') + line(W(ca)[0] - 20, W(ca)[1] + 30, W(ca)[0] - 3, W(ca)[1] + 4, 'mute') + text(W(cb)[0] + 34, W(cb)[1] + 36, 'camera b', 'ts', 'start') + line(W(cb)[0] + 32, W(cb)[1] + 28, W(cb)[0] + 3, W(cb)[1] + 4, 'mute');
  const c1 = W(T1([0, 0])), c2 = W(T2([0, 0]));
  o += circle(...c1, 2.5, 'mute-f') + circle(...c2, 2.5, 'mute-f');
  o += text(350, 40, '同一个点在时刻 1 被 camera a 看到，', 'ts') + text(350, 56, '在时刻 2 被 camera b 看到。', 'ts');
  o += text(350, 88, '两条 ray 不从同一个 center 出发：', 'ts') + text(350, 104, '每条 ray 用 Plücker 坐标 (q, q′)', 'ts') + text(350, 120, '记，q 是方向，q′ = c × q。', 'ts');
  o += text(350, 152, '两条 ray 相交是 rig motion 的', 'ts') + text(350, 168, '一个 constraint；camera 之间的', 'ts') + text(350, 184, '距离已知，所以连 scale 也定得下来。', 'ts');
  return svg(560, 320, o, 'Top view：一个带两个 camera 的 rig 在两个时刻的位置，同一个 3D point 先被 camera a、后被 camera b 看到，两条 ray 从不同的 center 出发并相交');
}

// ---------- 第 4 站：triangulation 的 uncertainty ----------
function triCov(Pa, Pb, X) {
  const J = [];
  for (let k = 0; k < 3; k++) {
    const e = [0, 0, 0]; e[k] = 1e-6;
    const a = [...prj(Pa, add(X, e)), ...prj(Pb, add(X, e))], b = [...prj(Pa, sub(X, e)), ...prj(Pb, sub(X, e))];
    J.push(a.map((v, i) => (v - b[i]) / 2e-6));
  }
  const Jt = J, JJ = Jt.map((r) => Jt.map((q) => dot(r, q)));
  return inv(JJ);
}
function triunc() {
  const Xt = [2, -1, 4];
  let o = '';
  const panel = (x0, b, title) => {
    const Cb = add(C1, [b, 0, 0]), Pb = camP(R2, Cb);
    const S = triCov(P1, Pb, Xt);
    const s = 40, W = ([x, z]) => [x0 + 90 + s * x, 250 - s * z];
    // 3σ ellipse 在 X–Z plane 上的 marginal
    const M2 = [[S[0][0], S[0][2]], [S[2][0], S[2][2]]];
    const [vals, vecs] = eigSym(M2);
    const el = []; for (let k = 0; k <= 60; k++) { const t = (2 * Math.PI * k) / 60; const a = 3 * Math.sqrt(vals[0]) * Math.cos(t), c = 3 * Math.sqrt(vals[1]) * Math.sin(t); el.push(W([Xt[0] + vecs[0][0] * a + vecs[0][1] * c, Xt[2] + vecs[1][0] * a + vecs[1][1] * c])); }
    o += line(...W([C1[0], C1[2]]), ...W([Xt[0], Xt[2]]), 'mute') + line(...W([Cb[0], Cb[2]]), ...W([Xt[0], Xt[2]]), 'mute');
    o += path(d(el) + 'Z', 'wash') + path(d(el), 'ln');
    o += circle(...W([Xt[0], Xt[2]]), 2.5, 'ink-f');
    for (const c of [C1, Cb]) o += circle(...W([c[0], c[2]]), 4.5, 'paper');
    const a1 = sub(Xt, C1), a2 = sub(Xt, Cb), par = Math.acos(dot(a1, a2) / nrm(a1) / nrm(a2)) / D;
    const sd = Math.sqrt(eigSym(S)[0][0]);
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    o += text(W([0, 0])[0] - 9, W([0, 0])[1] + 4, 'camera 1', 'ts', 'end') + text(W([b, 0])[0] + 9, W([b, 0])[1] + 4, 'camera 2', 'ts', 'start');
    o += text(x0 + 130, 280, 'parallax ' + par.toFixed(1) + '°，最长轴 σ = ' + (sd * 100).toFixed(1) + ' cm', 'ts', 'middle');
  };
  panel(0, 0.8, 'baseline 0.8 m');
  panel(290, 0.1, 'baseline 0.1 m');
  o += text(280, 302, 'Top view。彩色是 3σ 的 uncertainty ellipse（每个 pixel 的 noise σ = 1）；横向都只有约 0.5 cm', 'ts', 'middle');
  return svg(560, 314, o, '同一个 4.5 m 外的点，baseline 0.8 m 时 uncertainty ellipse 短，baseline 0.1 m 时沿 ray 方向拉长近九倍');
}

// ---------- 第 5 站：三个 camera，epipolar transfer 在 trifocal plane 附近失效 ----------
const RyB = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
const T3 = (() => {
  const Cs = [[0, 0, 0], [0.6, 0, 0], [0.3, 0, 0.5]], Rs = [RyB(0), RyB(-6 * D), RyB(-2 * D)];
  const Ps = Rs.map((R, i) => camP(R, Cs[i]));
  const Fm = (a, b) => mm(sk(mv(Ps[b], [...Cs[a], 1])), mm(Ps[b], pinv34(Ps[a])));
  const Hs = [[...inv(K)[0], 0], [...inv(K)[1], 0], [...inv(K)[2], 0], [0, 0, 0, 1]];
  const Q = Ps.map((P) => mm(P, Hs));
  const A = Q[1].map((r) => r.slice(0, 3)), a4 = Q[1].map((r) => r[3]), B = Q[2].map((r) => r.slice(0, 3)), b4 = Q[2].map((r) => r[3]);
  const T = [0, 1, 2].map((i) => [0, 1, 2].map((j) => [0, 1, 2].map((k) => A[j][i] * b4[k] - a4[j] * B[k][i])));
  return { Cs, Ps, F13: Fm(0, 2), F23: Fm(1, 2), F12: Fm(0, 1), T };
})();
function transfer(X, nz) {
  const { Ps, F13, F23, F12, T } = T3;
  const x1 = add(prj(Ps[0], X), nz[0]), x2 = add(prj(Ps[1], X), nz[1]), x3t = prj(Ps[2], X);
  const h1 = [...x1, 1], h2 = [...x2, 1];
  const la = mv(F13, h1), lb = mv(F23, h2), xe = hom(cross(la, lb));
  const le = mv(F12, h1), lp = [-le[1], le[0], 0]; lp[2] = -(lp[0] * x2[0] + lp[1] * x2[1]);
  const x3h = [0, 1, 2].map((k) => [0, 1, 2].reduce((s, i) => s + h1[i] * [0, 1, 2].reduce((q, j) => q + lp[j] * T[i][j][k], 0), 0));
  return { x3t, xe, x3: hom(x3h), la, lb };
}
function trifocal() {
  const { Cs } = T3;
  const near = [0.4, 0.03, 4], far = [0.4, 0.8, 4], nz = [[0.3, -0.4], [-0.4, 0.3]];
  let o = '';
  // 左：side view（z 向右，y 向下）
  const s = 46, W = ([y, z]) => [30 + s * z, 120 + s * y * 1.0];
  o += text(120, 22, 'Side view：三个 camera center 都在 y = 0', 'tb', 'middle');
  o += line(...W([0, -0.3]), ...W([0, 4.4]), 'ln-dash') + text(W([0, 4.4])[0], W([0, 4.4])[1] - 8, 'trifocal plane', 'tl', 'end');
  Cs.forEach((c, i) => { o += circle(...W([c[1], c[2]]), 4.5, 'paper'); });
  o += text(W([0, 0])[0], W([0, 0])[1] + 22, 'C₁, C₂', 'ts', 'middle') + text(W([0, 0.5])[0] + 4, W([0, 0.5])[1] - 10, 'C₃', 'ts', 'start');
  o += circle(...W([near[1], near[2]]), 4, 'ln-f') + text(W([near[1], near[2]])[0] - 4, W([near[1], near[2]])[1] + 20, '点 A（y = 0.03）', 't', 'end');
  o += circle(...W([far[1], far[2]]), 4, 'ink-f') + text(W([far[1], far[2]])[0] - 4, W([far[1], far[2]])[1] + 18, '点 B（y = 0.8）', 't', 'end');
  // 右：image 3 的局部
  const u0 = 240, u1 = 400, v0 = 200, v1 = 380, sc = 1.5, X0 = 290, Y0 = 34;
  const I = ([u, v]) => [X0 + sc * (u - u0), Y0 + sc * (v - v0)];
  o += rect(X0, Y0, sc * (u1 - u0), sc * (v1 - v0), 'paper');
  o += text(X0 + 120, 22, 'image 3（局部）', 'tb', 'middle');
  const clipLine = (l) => { // 在 [u0,u1] 上画
    const pts = [u0, u1].map((u) => { let v = -(l[0] * u + l[2]) / l[1]; if (v > v1 || v < v0) { v = v > v1 ? v1 : v0; return [-(l[1] * v + l[2]) / l[0], v]; } return [u, v]; });
    return path(d(pts.map(I)), 'mute');
  };
  const rA = transfer(near, nz), rB = transfer(far, nz);
  o += clipLine(rA.la) + clipLine(rA.lb);
  o += circle(...I(rA.x3t), 4, 'ln-f');
  o += circle(...I(rA.xe), 4.5, 'paper');
  o += text(I(rA.xe)[0] - 4, I(rA.xe)[1] + 24, 'epipolar transfer', 'ts', 'middle');
  o += text(I(rA.x3t)[0] + 6, I(rA.x3t)[1] - 12, '真实位置', 'ts', 'start');
  o += text(X0 + 6, I([0, 236])[1] - 22, '点 A：两条 epipolar line 只差 1.6°', 'ts', 'start');
  // B 点
  o += clipLine(rB.la) + clipLine(rB.lb);
  o += circle(...I(rB.x3t), 4, 'ink-f') + circle(...I(rB.xe), 4.5, 'paper');
  o += text(X0 + 6, Y0 + sc * (v1 - v0) - 8, '点 B：两条 line 交成 42°', 'ts', 'start');
  const eA = nrm(sub(rA.xe, rA.x3t)), tA = nrm(sub(rA.x3, rA.x3t));
  o += text(30, 196, '点 A 在 image 3 里的位置：', 'ts') + text(30, 214, '用两个 F 交出来，偏 ' + eA.toFixed(1) + ' pixel；', 'ts') + text(30, 232, '用 trifocal tensor 算，偏 ' + tA.toFixed(2) + ' pixel。', 'ts');
  o += text(30, 262, 'image 1、2 里的 pixel 各加了约 0.5 pixel 的 noise。', 'ts');
  return svg(560, 312, o, '三个 camera center 在同一个 plane 上，点 A 几乎在这个 plane 上：image 3 里的两条 epipolar line 几乎重合，交点偏出 28 pixel；离 plane 远的点 B 两条 line 交角大，transfer 准');
}

// ---------- 第 6 站：affine factorization ----------
const house = []; for (const x of [-0.5, 0.5]) for (const y of [0, -1]) for (const z of [-0.5, 0.5]) house.push([x, y, z]);
house.push([0, -1.5, -0.5], [0, -1.5, 0.5]);
const houseE = [[0, 4], [1, 5], [2, 6], [3, 7], [0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [2, 8], [6, 8], [3, 9], [7, 9], [8, 9]];
const RyC = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
export function factorData() {
  const angs = [0, 15, 30, 45];
  const W = [];
  angs.forEach((a, i) => {
    const R = mm(RxA(-20 * D), RyC(a * D));
    for (const k of [0, 1]) W.push(house.map((X, j) => 100 * dot(R[k], X) + (k ? 240 : 320) + (rnd(1000 + 20 * i + 10 * k + j) - 0.5) * 1.7));
  });
  const Wc = W.map((r) => { const m = r.reduce((a, b) => a + b) / r.length; return r.map((v) => v - m); });
  const [ev, U] = eigSym(Wc.map((r) => Wc.map((q) => dot(r, q))));
  const sv = ev.map((v) => Math.sqrt(Math.max(v, 0)));
  const M = Wc.map((_, i) => [0, 1, 2].map((k) => U[i][k] * Math.sqrt(sv[k])));
  const Sh = [0, 1, 2].map((k) => house.map((_, j) => Wc.reduce((s, r, i) => s + U[i][k] * r[j], 0) / Math.sqrt(sv[k])));
  // metric upgrade：L = QQᵀ
  const g = (a, b) => [a[0] * b[0], a[0] * b[1] + a[1] * b[0], a[0] * b[2] + a[2] * b[0], a[1] * b[1], a[1] * b[2] + a[2] * b[1], a[2] * b[2]];
  const A = [], bb = [];
  for (let i = 0; i < angs.length; i++) { const r1 = M[2 * i], r2 = M[2 * i + 1]; A.push(sub(g(r1, r1), g(r2, r2))); bb.push(0); A.push(g(r1, r2)); bb.push(0); }
  A.push(g(M[0], M[0])); bb.push(1);
  const l = lsq(A, bb), Lm = [[l[0], l[1], l[2]], [l[1], l[3], l[4]], [l[2], l[4], l[5]]];
  const q11 = Math.sqrt(Lm[0][0]), q21 = Lm[1][0] / q11, q31 = Lm[2][0] / q11, q22 = Math.sqrt(Lm[1][1] - q21 * q21), q32 = (Lm[2][1] - q31 * q21) / q22, q33 = Math.sqrt(Lm[2][2] - q31 * q31 - q32 * q32);
  const Q = [[q11, 0, 0], [q21, q22, 0], [q31, q32, q33]], Qi = inv(Q);
  const Sm = mm(Qi, Sh);
  return { W, sv, Sh: tr(Sh), Sm: tr(Sm), angs };
}
const align = (Xs) => {
  const c = [0, 1, 2].map((k) => Xs.reduce((a, X) => a + X[k], 0) / Xs.length), Y = Xs.map((X) => sub(X, c));
  const M = [0, 1, 2].map((a) => [0, 1, 2].map((b) => house.reduce((s, H, j) => s + H[a] * Y[j][b], 0)));
  const [ev, V] = eigSym(mm(tr(M), M));
  const isq = mm(mm(V, ev.map((v, i) => ev.map((_, j) => (i === j ? 1 / Math.sqrt(v) : 0)))), tr(V));
  const R = mm(M, isq);
  return Y.map((X) => mv(R, X));
};
function factor() {
  const { W, sv, Sh, Sm } = factorData();
  let o = '';
  // 上排：四张 orthographic image
  for (let i = 0; i < 4; i++) {
    const x0 = 10 + i * 138, y0 = 30, s = 0.5;
    o += rect(x0, y0, 126, 100, 'paper');
    const P = (j) => [x0 + 63 + s * (W[2 * i][j] - 320), y0 + 70 + s * (W[2 * i + 1][j] - 240) * 0.9];
    for (const [a, b] of houseE) o += line(...P(a), ...P(b), 'ink');
    for (let j = 0; j < 10; j++) o += circle(...P(j), 2.2, 'ln-f');
    o += text(x0 + 63, y0 + 116, 'image ' + (i + 1) + '（转 ' + [0, 15, 30, 45][i] + '°）', 'ts', 'middle');
  }
  o += text(280, 18, '4 张 orthographic image 里同样 10 个点（pixel 带约 0.5 的 noise）', 'tb', 'middle');
  // 左下：singular value
  const sy = logx(0.01, 1000, 314, 190), x0 = 40;
  o += axes({ sx: (v) => v, sy, x0: 40, x1: 230, y0: 0.01, y1: 1000, yt: [[0.01, '0.01'], [1, '1'], [100, '100']], xAt: 0.01 });
  sv.forEach((v, k) => { const x = 52 + k * 22, y = sy(Math.max(v, 0.01)); o += rect(x, y, 14, 314 - y, k < 3 ? 'solid' : 'wash2'); o += text(x + 7, 330, String(k + 1), 'ts', 'middle'); });
  o += text(40, 178, 'W 的 8 个 singular value（log scale）', 'ts');
  o += text(130, 350, '前 3 个是 ' + sv.slice(0, 3).map((v) => v.toFixed(0)).join('、') + '，第 4 个只有 ' + sv[3].toFixed(2), 'ts', 'middle');
  // 右下：affine 重建 vs metric 重建
  const view = (X) => { const a = 30 * D, b = 18 * D; const x1 = Math.cos(a) * X[0] - Math.sin(a) * X[2], z1 = Math.sin(a) * X[0] + Math.cos(a) * X[2]; return [x1, Math.cos(b) * X[1] + Math.sin(b) * z1]; };
  const drawShape = (Xs, cx, cy, title) => {
    const Q = Xs.map(view), xs = Q.map((q) => q[0]), ys = Q.map((q) => q[1]);
    const sc = Math.min(110 / (Math.max(...xs) - Math.min(...xs)), 120 / (Math.max(...ys) - Math.min(...ys)));
    const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
    const T = (q) => [cx + sc * (q[0] - mx), cy + sc * (q[1] - my)];
    for (const [a, b] of houseE) o += line(...T(Q[a]), ...T(Q[b]), 'ink-b');
    o += text(cx, 180, title, 'tb', 'middle');
  };
  // 显示时先把 y 轴翻成“向下”的方向：metric 的结果差一个 rotation/reflection，用 Procrustes 不必要，这里只看形状
  drawShape(align(Sh), 340, 264, 'factorization 直接给的');
  drawShape(align(Sm), 480, 264, 'metric upgrade 之后');
  o += text(410, 350, '左边差一个 3×3 的 affine 变换，angle 被拉歪', 'ts', 'middle');
  return svg(560, 358, o, '上排四张 orthographic image；左下 measurement matrix 的 singular value 只有三个大的；右下 factorization 得到的形状先是被 affine 拉歪的，metric upgrade 后恢复成房子的形状');
}

// ---------- 第 7 站：bundle adjustment 的 toy problem（2D world，1D camera） ----------
export const BA = (() => {
  const f = 500;
  const project = (c, P) => { const dx = P[0] - c[0], dz = P[1] - c[1], s = Math.sin(c[2]), co = Math.cos(c[2]); return (f * (co * dx - s * dz)) / (s * dx + co * dz); };
  const camT = [[0, 0, 10 * D], [1.2, 0.3, -5 * D], [2.4, 0.2, -22 * D], [3.2, -0.4, -40 * D]], NC = 4;
  const ptT = [[-0.6, 3.0], [0.3, 4.6], [0.9, 2.4], [1.4, 5.6], [1.9, 3.8], [2.6, 4.8], [0.6, 5.8], [1.6, 2.8], [-0.2, 4.9], [1.1, 4.0], [2.4, 3.2], [0.1, 3.0]], NP = 12;
  const obs = camT.map((c, i) => ptT.map((P, j) => project(c, P) + (rnd(i * 16 + j) - 0.5) * 0.6));
  const unpack = (x) => {
    const cams = [camT[0], [camT[1][0], x[0], x[1]]];
    for (let i = 2; i < NC; i++) cams.push([x[3 * i - 4], x[3 * i - 3], x[3 * i - 2]]);
    const o = 3 * NC - 4, pts = []; for (let j = 0; j < NP; j++) pts.push([x[o + 2 * j], x[o + 2 * j + 1]]);
    return { cams, pts };
  };
  const resid = (x) => { const { cams, pts } = unpack(x), r = []; for (let i = 0; i < NC; i++) for (let j = 0; j < NP; j++) r.push(project(cams[i], pts[j]) - obs[i][j]); return r; };
  const jac = (x) => {
    const J = resid(x).map(() => new Array(x.length).fill(0));
    for (let k = 0; k < x.length; k++) { const xp = x.slice(), xm = x.slice(); xp[k] += 1e-6; xm[k] -= 1e-6; const a = resid(xp), b = resid(xm); for (let i = 0; i < a.length; i++) J[i][k] = (a[i] - b[i]) / 2e-6; }
    return J;
  };
  const cost = (x) => resid(x).reduce((s, v) => s + v * v, 0);
  const rms = (x) => Math.sqrt(cost(x) / (NC * NP));
  const step = (x, lam = 0) => {
    const J = jac(x), r = resid(x), n = x.length, Jt = tr(J);
    const H = Jt.map((a) => Jt.map((b) => dot(a, b))), g = Jt.map((a) => -dot(a, r));
    for (let a = 0; a < n; a++) H[a][a] *= 1 + lam;
    const dx = solve(H, g); return x.map((v, k) => v + dx[k]);
  };
  const xTrue = [camT[1][1], camT[1][2], ...camT.slice(2).flat(), ...ptT.flat()];
  const pert = xTrue.map((_, k) => (k < 3 * NC - 4 ? (k % 3 === 1 || k === 1 ? 3 * D : 0.15) : 0.3) * (rnd(100 + k) < 0.5 ? -1 : 1) * (0.6 + 0.8 * rnd(200 + k)));
  const start = (s) => xTrue.map((v, k) => v + s * pert[k]);
  const gn = (x, n) => { const xs = [x]; for (let k = 0; k < n; k++) xs.push(step(xs[xs.length - 1])); return xs; };
  const lm = (x, n) => { const out = [x]; let lam = 1e-3; for (let k = 0; k < n; k++) { const xn = step(x, lam); if (cost(xn) < cost(x)) { x = xn; lam /= 10; } else lam *= 10; out.push(x); } return out; };
  return { project, camT, ptT, NC, NP, unpack, resid, jac, rms, cost, step, xTrue, start, gn, lm };
})();

function baAnim() {
  const xs = BA.gn(BA.start(0.6), 4);
  const s = 44, W = ([x, z]) => [60 + s * (x + 0.8), 290 - s * z];
  const hold = 0.9, move = 0.8, n = xs.length - 1, T = n * (move + hold) + hold + 1.6;
  const kt = [0], fr = [0];
  for (let k = 0; k < n; k++) { const t0 = hold + k * (move + hold); kt.push(t0 / T, (t0 + move) / T); fr.push(k, k + 1); }
  kt.push(1); fr.push(n);
  const st = fr.map((k) => BA.unpack(xs[k]));
  let o = '';
  // 真值：空心小圈
  BA.ptT.forEach((p) => { o += circle(...W(p), 5, 'mute'); });
  const wedge = (c) => { const dir = [Math.sin(c[2]), Math.cos(c[2])], nn = [Math.cos(c[2]), -Math.sin(c[2])]; const a = add(add(c, dir, 0.32), nn, 0.2), b = add(add(c, dir, 0.32), nn, -0.2); return d([c, a, b].map(W)) + 'Z'; };
  for (let i = 0; i < BA.NC; i++) {
    o += path(wedge(BA.camT[i]), 'grid');
    o += apath(st.map((u) => wedge(u.cams[i])), kt, T, 'wash ink-s');
  }
  for (let j = 0; j < BA.NP; j++) o += acircle(st.map((u) => W(u.pts[j])[0]), st.map((u) => W(u.pts[j])[1]), kt, T, 3.6, 'ln-f');
  BA.camT.forEach((c, i) => { const p = W(c); o += text(p[0], p[1] + 24, 'cam ' + (i + 1), 'ts', 'middle'); });
  o += text(20, 22, 'Top view：彩点是当前 estimate，灰圈是真实位置', 'tb');
  // 右：读数
  const X = 400;
  o += text(X, 60, 'Gauss–Newton', 'tb') + text(X, 78, 'RMS reprojection error', 'ts');
  xs.forEach((x, k) => {
    const on = fr.map((q) => q >= k);
    o += `<text x="${X}" y="${108 + k * 24}" class="${k === n ? 'tl' : 't'}" text-anchor="start">iteration ${k}：${BA.rms(x).toFixed(3)} pixel${ashow(on, kt, T)}</text>`;
  });
  o += text(X, 240, 'cam 1 固定；cam 2 的 x', 'ts') + text(X, 256, '也固定（定 scale）', 'ts');
  return svgA(560, 345, o, '动图：bundle adjustment 的 Gauss–Newton 迭代，四个 camera 和十二个点从偏离的位置移到真实位置附近，RMS reprojection error 从 35.8 降到 0.101 pixel');
}

// Jacobian 与 JᵀJ 的 sparsity
function sparsity() {
  const x = BA.start(0.6), J = BA.jac(x), nC = 3 * BA.NC - 4, n = x.length;
  const c = 4.6;
  let o = '';
  const X0 = 30, Y0 = 40;
  // J：48 行 × 32 列
  o += rect(X0, Y0, n * c, J.length * c, 'frame');
  const runs = (row, x, y, clsOf) => { let k = 0; while (k < row.length) { if (Math.abs(row[k]) <= 1e-9) { k++; continue; } const cl = clsOf(k); let e = k; while (e + 1 < row.length && Math.abs(row[e + 1]) > 1e-9 && clsOf(e + 1) === cl) e++; o += rect(x + k * c, y, (e - k + 1) * c, c, cl); k = e + 1; } };
  J.forEach((r, i) => runs(r, X0, Y0 + i * c, (k) => (k < nC ? 'solid2' : 'solid')));
  o += line(X0 + nC * c, Y0 - 6, X0 + nC * c, Y0 + J.length * c, 'mute');
  o += text(X0 + nC * c - 3, Y0 - 10, 'camera', 'ts', 'end') + text(X0 + nC * c + 4, Y0 - 10, '12 个 point（各 2 个 coordinate）', 'ts', 'start');
  for (let i = 1; i < BA.NC; i++) o += line(X0 - 4, Y0 + i * BA.NP * c, X0 + n * c, Y0 + i * BA.NP * c, 'grid');
  o += text(X0 + n * c / 2, Y0 + J.length * c + 18, 'J：48 个 residual × 32 个 unknown', 'ts', 'middle');
  // H
  const Jt = tr(J), H = Jt.map((a) => Jt.map((b) => dot(a, b)));
  const X1 = 250, Y1 = 40;
  o += rect(X1, Y1, n * c, n * c, 'frame');
  H.forEach((r, i) => runs(r, X1, Y1 + i * c, (k) => (i < nC && k < nC ? 'solid2' : i >= nC && k >= nC ? 'solid' : 'wash-strong')));
  o += line(X1 + nC * c, Y1, X1 + nC * c, Y1 + n * c, 'mute') + line(X1, Y1 + nC * c, X1 + n * c, Y1 + nC * c, 'mute');
  o += text(X1 + nC * c / 2, Y1 + nC * c / 2 + 4, 'U', 'tw', 'middle');
  o += text(X1 + nC * c + 50, Y1 + nC * c / 2 + 4, 'W', 'tb', 'middle');
    o += text(X1 + n * c / 2, Y1 + n * c + 18, 'JᵀJ：32 × 32；右下 V 是 2×2 block 沿 diagonal', 'ts', 'middle');
  o += text(X1 + n * c + 12, Y1 + 30, '每个 residual', 'ts') + text(X1 + n * c + 12, Y1 + 46, '只连着 1 个 camera', 'ts') + text(X1 + n * c + 12, Y1 + 62, '和 1 个 point。', 'ts');
  o += text(X1 + n * c + 12, Y1 + 96, '不同 point 之间', 'ts') + text(X1 + n * c + 12, Y1 + 112, '没有 entry，所以 V', 'ts') + text(X1 + n * c + 12, Y1 + 128, '是 block diagonal。', 'ts');
  return svg(560, 280, o, '左边是 toy bundle adjustment 的 Jacobian，每一行只在一个 camera 和一个 point 的列上非零；右边是 JᵀJ，point 那一块是 block diagonal');
}

// ---------- 第 8 站：plane sweep ----------
export const SWEEP = (() => {
  const f = 500, Zs = 3, p = 0.15, bs = [0.3, 0.75];
  const tex = (X) => Math.sin((2 * Math.PI * X) / p);
  const ref = (u) => tex((u * Zs) / f);
  const nb = (b, u) => tex(b + (u * Zs) / f);
  const cost1 = (b, z) => { let s = 0; for (let u = -12; u <= 12; u++) { const e = ref(u) - nb(b, u - (f * b) / z); s += e * e; } return s / 25; };
  const cost = (z) => cost1(bs[0], z) + cost1(bs[1], z);
  return { f, Zs, p, bs, cost1, cost };
})();
function sweepA() {
  const { Zs, p, bs, cost1, cost } = SWEEP;
  const z0 = 1.6, z1 = 7, N = 60, T = 7.5;
  const zs = []; for (let k = 0; k <= N; k++) zs.push(z0 + ((z1 - z0) * k) / N);
  const kt = zs.map((_, k) => (0.15 + 0.7 * (k / N)));
  const KT = [0, ...kt, 1], ZS = [zs[0], ...zs, zs[N]];
  // 左：top view，z 向上
  const s = 38, W = ([x, z]) => [70 + s * x * 1.6, 300 - s * z];
  let o = '';
  // 墙：条纹
  for (let X = -1.2; X < 2.4; X += p) { const a = W([X, Zs]), b = W([X + p / 2, Zs]); o += rect(a[0], a[1] - 5, b[0] - a[0], 10, 'solid2'); }
  o += text(W([2.4, Zs])[0] + 10, W([2.4, Zs])[1] + 4, 'wall', 'ts');
  const cams = [[0, 0], [bs[0], 0], [bs[1], 0]];
  o += line(...W([0, 0]), ...W([0, z1]), 'ink');
  o += apath(ZS.map((z) => d([W(cams[1]), W([0, z])])), KT, T, 'mute');
  o += apath(ZS.map((z) => d([W(cams[2]), W([0, z])])), KT, T, 'mute');
  o += apath(ZS.map((z) => d([W([-0.9, z]), W([1.0, z])])), KT, T, 'ln-dash');
  o += acircle(ZS.map((z) => W([0, z])[0]), ZS.map((z) => W([0, z])[1]), KT, T, 4.5, 'ln-f');
  cams.forEach((c, i) => { o += circle(...W(c), 4.5, i ? 'paper' : 'ink-f'); });
  o += text(W([0, 0])[0] - 8, W([0, 0])[1] + 18, 'reference', 'ts', 'end') + text(W(cams[2])[0] + 6, W(cams[2])[1] + 18, 'b = 0.3、0.75 m', 'ts', 'middle');
  o += text(20, 14, 'Top view：沿 reference ray 扫 depth', 'tb') + text(20, 340, '（横向放大 1.6 倍）', 'ts');
  // 右：cost curve
  const sx = lin(z0, z1, 300, 545), sy = lin(0, 4.2, 290, 70);
  o += axes({ sx, sy, x0: z0, x1: z1, y0: 0, y1: 4.2, xt: [2, 3, 4, 5, 6, 7], yt: [0, 2, 4], xl: 'depth z（m）' });
  o += path(curve((z) => cost1(bs[0], z), z0, z1, sx, sy, 400), 'mute');
  o += path(curve((z) => cost1(bs[1], z), z0, z1, sx, sy, 400), 'dash');
  o += path(curve(cost, z0, z1, sx, sy, 400), 'ln');
  o += text(300, 22, 'photo-consistency cost', 'tb') + text(300, 40, '灰线 b = 0.3，虚线 b = 0.75，彩线是两者之和', 'ts');
  o += text(sx(3) + 4, sy(0) - 8, 'z = 3', 'tl');
        o += apath(ZS.map((z) => d([[sx(z), sy(0)], [sx(z), sy(4.2)]])), KT, T, 'grid');
  o += acircle(ZS.map((z) => sx(z)), ZS.map((z) => sy(cost(z))), KT, T, 4.5, 'ln-f');
  o += text(300, 340, '单一 baseline 有好几个 0；sum 只在 z = 3 是 0', 'ts');
  return svgA(560, 350, o, '动图：plane sweep 沿 reference ray 从 1.5 m 扫到 7 m，右边三条 cost curve 跟着走；repetitive 的条纹让单一 baseline 有多个 0，两个 baseline 相加后只在 z 等于 3 处为 0');
}

export default {
  'cs4277-tiles': tiles,
  'cs4277-rectify': rectify,
  'cs4277-vp3': vp3,
  'cs4277-projrecon': projrecon,
  'cs4277-rig': rig,
  'cs4277-triunc': triunc,
  'cs4277-trifocal': trifocal,
  'cs4277-factor': factor,
  'cs4277-ba': baAnim,
  'cs4277-sparsity': sparsity,
  'cs4277-sweep': sweepA,
};
export const _calc = { recon3, transfer, triCov, P1, P2, C1, C2, R2 };
