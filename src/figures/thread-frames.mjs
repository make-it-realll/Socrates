// 概念线 frames：coordinate frame 与 rigid transform 的图。
// 全部例子都在竖直 plane 里：x 向右，y 向上；planar camera 的 optical axis 是 x̂_c，image 坐标 u = f·y_c/x_c + c。
import { svg, svgA, anim, apath, acircle, ashow, f1, d, path, line, rect, circle, poly, text, arrow, sub } from '../lib/svg.mjs';

const DEG = Math.PI / 180;
const F = 500, CU = 320;
const rot = (a, [x, y]) => [Math.cos(a) * x - Math.sin(a) * y, Math.sin(a) * x + Math.cos(a) * y];
const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
// planar pose = [x, y, angle]
const apply = ([px, py, a], p) => add([px, py], rot(a, p));
const compose = (A, B) => { const p = apply(A, [B[0], B[1]]); return [p[0], p[1], A[2] + B[2]]; };
const invPose = ([px, py, a]) => { const p = rot(-a, [-px, -py]); return [p[0], p[1], -a]; };
const proj = (T, X) => { const pc = apply(invPose(T), X); return F * pc[1] / pc[0] + CU; };
// 一个 shape 由若干 polygon（body coordinates）组成，按 pose 变到 world，再按 P 变到像素
const shapeD = (polys, pose, P) => polys.map((pg) => d(pg.map((q) => P(apply(pose, q)))) + 'Z').join('');
const S = (t) => sub(t);
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// gripper：wrist + palm + 两根 finger，origin 在两根 finger 中间，x̂ 朝前
const GRIP = (k = 1) => [
  [[-0.26, -0.03], [-0.16, -0.03], [-0.16, 0.03], [-0.26, 0.03]],
  [[-0.16, -0.12], [-0.07, -0.12], [-0.07, 0.12], [-0.16, 0.12]],
  [[-0.07, 0.075], [0.12, 0.075], [0.12, 0.115], [-0.07, 0.115]],
  [[-0.07, -0.115], [0.12, -0.115], [0.12, -0.075], [-0.07, -0.075]],
].map((pg) => pg.map(([x, y]) => [k * x, k * y]));
// planar camera：机身 + 镜头，origin 在 optical center，x̂ 是 optical axis
const CAM = (k = 1) => [
  [[-0.2, -0.07], [-0.04, -0.07], [-0.04, 0.07], [-0.2, 0.07]],
  [[-0.04, -0.035], [0, -0.06], [0, 0.06], [-0.04, 0.035]],
].map((pg) => pg.map(([x, y]) => [k * x, k * y]));
const axesAt = (pose, L, P, cls, lx, ly) => {
  const O = P(apply(pose, [0, 0])), X = P(apply(pose, [L, 0])), Y = P(apply(pose, [0, L]));
  let o = arrow(O[0], O[1], X[0], X[1], cls, 6) + arrow(O[0], O[1], Y[0], Y[1], cls, 6);
  if (lx) { const u = [X[0] - O[0], X[1] - O[1]], n = Math.hypot(...u); o += text(X[0] + 11 * u[0] / n, X[1] + 11 * u[1] / n + 4, lx, 'ts', 'middle'); }
  if (ly) { const u = [Y[0] - O[0], Y[1] - O[1]], n = Math.hypot(...u); o += text(Y[0] + 11 * u[0] / n, Y[1] + 11 * u[1] / n + 4, ly, 'ts', 'middle'); }
  return o;
};
// 带动画的箭头：每个 keyframe 给 [x1,y1,x2,y2]（像素）
const aarrow = (segs, kt, T, cls, size = 7) => {
  const shaft = segs.map(([x1, y1, x2, y2]) => { const a = Math.atan2(y2 - y1, x2 - x1); return d([[x1, y1], [x2 - 2 * Math.cos(a), y2 - 2 * Math.sin(a)]]); });
  const head = segs.map(([x1, y1, x2, y2]) => { const a = Math.atan2(y2 - y1, x2 - x1); const p = (g) => [x2 - size * Math.cos(a + g), y2 - size * Math.sin(a + g)]; return d([[x2, y2], p(0.42), p(-0.42)]) + 'Z'; });
  return apath(shaft, kt, T, cls) + apath(head, kt, T, cls.split(' ').map((c) => c + '-f').join(' '));
};

// ---------- 第一次事故：把 (R, t) 当成 camera 的 pose ----------
function extr() {
  const K = 116, P = ([x, y]) => [40 + K * (x + 0.3), 208 - K * y];
  const Tsc = [2, 1.5, -120 * DEG], Tcs = invPose(Tsc);
  const cube = [1.2, 0.05];
  const pc = apply(Tcs, cube);
  const wrong = apply(Tcs, pc); // 把 T_cs 当成 pose，去乘 p_c
  const Tbad = [Tcs[0], Tcs[1], Tcs[2]];
  let o = '';
  // table
  const t0 = P([0.2, 0]), t1 = P([2.7, -0.05]);
  o += rect(t0[0], t0[1], t1[0] - t0[0], t1[1] - t0[1], 'wash2') + line(t0[0], t0[1], t1[0], t0[1], 'ink');
  for (const x of [0.35, 2.55]) { const a = P([x, -0.05]), b = P([x, -1.15]); o += line(a[0], a[1], b[0], b[1], 'mute'); }
  o += text(P([0.42, -0.25])[0], P([0.42, -0.25])[1], 'table', 'ts', 'start');
  // 真实 camera 的视野和 ray
  const fov = Math.atan(320 / 500);
  for (const s of [-1, 1]) { const e = apply(Tsc, [2.0 * Math.cos(fov), s * 2.0 * Math.sin(fov)]); o += line(...P([Tsc[0], Tsc[1]]), ...P(e), 'grid'); }
  o += line(...P([Tsc[0], Tsc[1]]), ...P(cube), 'ln');
  // 程序以为的 camera 和 ray
  o += line(...P([Tbad[0], Tbad[1]]), ...P(wrong), 'ln-dash');
  // arm：2R，伸到算错的位置
  const r2 = wrong[0] ** 2 + wrong[1] ** 2, t2 = -Math.acos((r2 - 2) / 2);
  const t1a = Math.atan2(wrong[1], wrong[0]) - Math.atan2(Math.sin(t2), 1 + Math.cos(t2));
  const el = [Math.cos(t1a), Math.sin(t1a)];
  const base = P([0, 0]);
  o += rect(base[0] - 15, base[1] - 10, 30, 10, 'paper', 2);
  o += path(d([[0, 0], el, wrong].map(P)), 'ink-b');
  o += circle(base[0], base[1] - 4, 4.5, 'paper') + circle(...P(el), 4, 'paper');
  o += `<path d="${shapeD(GRIP(1.05), [wrong[0], wrong[1], t1a + t2], P)}" class="paper"/>`;
  o += axesAt([0, 0, 0], 0.4, P, 'ink', 'x̂' + S('s'), 'ŷ' + S('s'));
  // cube
  const c0 = P([cube[0] - 0.05, cube[1] + 0.05]);
  o += rect(c0[0], c0[1], 0.1 * K, 0.1 * K, 'solid2', 1.5);
  o += text(c0[0] + 6, c0[1] + 34, 'cube (1.2, 0.05)', 'tb', 'middle');
  // 两个 camera
  o += `<path d="${shapeD(CAM(1.5), Tsc, P)}" class="solid"/>`;
  o += axesAt(Tsc, 0.36, P, 'ln', '', 'ŷ' + S('c'));
  { const xa = P(apply(Tsc, [0.36, 0])); o += text(xa[0] - 12, xa[1] - 2, 'x̂' + S('c'), 'tl', 'end'); }
  o += `<path d="${shapeD(CAM(1.5), Tbad, P)}" class="dash"/>`;
  const X = 412;
  const pc0 = P([Tsc[0], Tsc[1]]);
  o += line(pc0[0] + 16, pc0[1] - 2, X - 6, 40, 'grid');
  o += text(X, 36, 'camera 的真实 pose T' + S('sc'), 'tl', 'start') + text(X, 52, '(2, 1.5)，x̂' + S('c') + ' 朝 −120°', 'ts', 'start');
  const w0 = P(wrong);
  o += line(w0[0] + 16, w0[1] - 4, X - 6, 148, 'grid');
  o += text(X, 144, '算出的 cube', 'tb', 'start') + text(X, 160, '(1.443, 0.436)', 'ts', 'start') + text(X, 175, '离桌面 44 cm', 'ts', 'start');
  const pb = P([Tbad[0], Tbad[1]]);
  o += line(pb[0] + 14, pb[1] + 2, X - 6, 300, 'grid');
  o += text(X, 296, '把 (R, t) 当成 pose', 'tb', 'start') + text(X, 312, '(2.299, −0.982)，朝 120°', 'ts', 'start') + text(X, 327, '在桌面以下', 'ts', 'start');
  o += text(280, 372, '两个 camera 用的是同一个 p' + S('c') + ' = (1.656, 0.032)：沿各自的 x̂' + S('c') + ' 走 1.656，再沿 ŷ' + S('c') + ' 走 0.032', 'ts', 'middle');
  return svg(560, 378, o, '侧视图：arm、桌子、桌上的 cube 和立在桌边的 camera。按 camera 的真实 pose 算，cube 在 1.2、0.05；把 calibration 给出的 R、t 当成 pose，程序以为 camera 在桌面以下 2.299、负 0.982，朝 120 度，算出的 cube 在 1.443、0.436，arm 伸到空中');
}

// ---------- 第二次事故：Drake 的 (1, 0, 0) 被当成 V_s ----------
// 动图的 keyframe：第一帧是 motion 结束时的样子（静态截图看到的），停一会儿，跳回起点，再演一遍
const replay = (n, Tm, hold) => {
  const Tt = hold + Tm + 0.5, kt = [0, hold / Tt], fr = [1, 1];
  kt.push((hold + 0.02) / Tt); fr.push(0);
  for (let i = 1; i <= n; i++) { kt.push((hold + 0.02 + (Tm - 0.02) * i / n) / Tt); fr.push(i / n); }
  kt.push(1); fr.push(1);
  return { kt, fr, Tt };
};
function spin() {
  const K = 150, P = ([x, y]) => [214 + K * x, 300 - K * y];
  const p0 = [1.2, 0.8], h0 = 30 * DEG, Tm = 1.6;
  const { kt, fr, Tt } = replay(32, Tm, 1.6);
  const ang = fr.map((f) => f * Tm);
  let o = '';
  o += text(280, 18, 'Drake 发出 (ω, v' + S('x') + ', v' + S('y') + ') = (1, 0, 0)：转 1 rad/s，gripper 的 origin 不动', 'tb', 'middle');
  const b = P([0, 0]);
  o += rect(b[0] - 16, b[1] - 2, 32, 12, 'paper', 2) + axesAt([0, 0, 0], 0.3, P, 'ink', 'x̂' + S('s'), 'ŷ' + S('s'));
  o += text(b[0], b[1] + 28, 'arm 的 base，{s} 的 origin', 'ts', 'middle');
  const a0 = Math.atan2(p0[1], p0[0]);
  const arc = []; for (let k = 0; k <= 60; k++) arc.push(P(rot(Tm * k / 60, p0)));
  o += path(d(arc), 'ln-dash');
  o += line(b[0], b[1], ...P(p0), 'grid');
  const rl = P(rot(-0.02, [0.62 * p0[0], 0.62 * p0[1]]));
  o += text(rl[0] + 8, rl[1] + 14, 'radius 1.44 m', 'ts', 'start');
  void a0;
  // 起点（虚线），想要的（白），执行的（彩色）
  o += `<path d="${shapeD(GRIP(1.3), [p0[0], p0[1], h0], P)}" class="dash"/>`;
  o += apath(ang.map((a) => shapeD(GRIP(1.3), [p0[0], p0[1], h0 + a], P)), kt, Tt, 'paper');
  o += circle(...P(p0), 3, 'ink-f');
  o += apath(ang.map((a) => { const q = rot(a, p0); return shapeD(GRIP(1.3), [q[0], q[1], h0 + a], P); }), kt, Tt, 'solid');
  const pp = P(p0);
  o += text(pp[0] + 62, pp[1] - 6, '想要的：原地转', 'tb', 'start');
  o += text(pp[0] + 62, pp[1] + 10, 'V' + S('b') + ' = (1, 0, 0)', 'ts', 'start') + text(pp[0] + 62, pp[1] + 25, 'V' + S('s') + ' = (1, 0.8, −1.2)', 'ts', 'start');
  o += text(pp[0] + 62, pp[1] + 44, '虚线：1.6 s 前的起点', 'ts', 'start');
  const pe = P(rot(Tm, p0));
  o += text(pe[0] - 50, pe[1] + 52, '执行的：(1, 0, 0) 当成 V' + S('s'), 'tl', 'start');
  o += text(pe[0] - 50, pe[1] + 68, '绕 {s} 的 origin 转', 'ts', 'start') + text(pe[0] - 50, pe[1] + 83, '0.5 s 后已离原处 0.71 m', 'ts', 'start');
  return svgA(560, 336, o, '动图：gripper 应该在 1.2、0.8 处原地转；同样的三个数被当成 spatial twist 执行，gripper 绕 arm 的 base 沿 radius 1.44 米的 arc 甩出去，orientation 与想要的相同');
}

// ---------- 骨架二：同一个 motion 的三组数 ----------
function twists() {
  const K = 120, P = ([x, y]) => [40 + K * (x + 0.15), 244 - K * y];
  const q = [0.6, 1.4], p0 = [1.2, 0.8], h0 = 30 * DEG, w = 1, A = 1.0;
  const { kt, fr, Tt } = replay(30, 2.0, 1.2);
  const ang = fr.map((f) => f * A);
  const pAt = (a) => add(q, rot(a, add(p0, q, -1)));
  const vs = 0.42; // 箭头：每 1 m/s 画 0.42 m
  let o = '';
  o += axesAt([0, 0, 0], 0.3, P, 'ink', 'x̂' + S('s'), 'ŷ' + S('s'));
  o += circle(...P(q), 4, 'ink-f') + text(P(q)[0] - 8, P(q)[1] - 8, 'q', 'tb', 'end');
  o += line(...P(q), ...P([0, 0]), 'grid');
  o += apath(ang.map((a) => d([P(q), P(pAt(a))])), kt, Tt, 'grid');
  const body = [[[-0.3, -0.17], [0.22, -0.17], [0.22, 0.17], [-0.3, 0.17]]];
  o += `<path d="${shapeD(body, [p0[0], p0[1], h0], P)}" class="dash"/>`;
  o += apath(ang.map((a) => { const p = pAt(a); return shapeD(body, [p[0], p[1], h0 + a], P); }), kt, Tt, 'wash2');
  for (const ax of [[0.46, 0], [0, 0.46]]) o += apath(ang.map((a) => { const p = pAt(a); return d([P(p), P(apply([p[0], p[1], h0 + a], ax))]); }), kt, Tt, 'dash');
  o += acircle(ang.map((a) => P(pAt(a))[0]), ang.map((a) => P(pAt(a))[1]), kt, Tt, 3.5, 'ink-f');
  // body origin 的 velocity：随时间转
  o += aarrow(ang.map((a) => { const p = pAt(a), v = rot(Math.PI / 2, add(p, q, -1)); const A0 = P(p), B = P(add(p, v, vs * w)); return [A0[0], A0[1], B[0], B[1]]; }), kt, Tt, 'ink', 8);
  // v_s：画在 origin，不变
  const O = P([0, 0]), E = P([vs * q[1] * w, -vs * q[0] * w]);
  o += arrow(O[0], O[1], E[0], E[1], 'ln', 9);
  o += text(E[0] + 8, E[1] + 4, 'v' + S('s'), 'tl', 'start');
  const pz = P(p0);
  o += text(pz[0] - 30, pz[1] + 44, '虚线框：起点', 'ts', 'start');
  // 右边的读数
  const X0 = 316;
  o += text(X0, 26, '同一个 motion 的三种写法 (ω, v' + S('x') + ', v' + S('y') + ')', 'tb', 'start');
  o += text(X0, 58, 'Drake：(1, dp/dt)', 't', 'start') + text(X0, 75, '起点时 (1, 0.6, 0.6)；黑色箭头，跟着转', 'ts', 'start');
  o += text(X0, 106, 'V' + S('s') + ' = (1, 1.4, −0.6)', 'tl', 'start') + text(X0, 123, '此刻经过 {s} origin 的 body point 的', 'ts', 'start') + text(X0, 138, 'velocity；彩色箭头，一直不变', 'ts', 'start');
  o += text(X0, 169, 'V' + S('b') + ' = (1, 0.820, 0.220)', 't', 'start') + text(X0, 186, 'dp/dt 在虚线 body axis 上的 component，', 'ts', 'start') + text(X0, 201, '一直不变', 'ts', 'start');
  o += text(X0, 232, '灰色细线：q 到 {s} origin，q 到 body origin。', 'ts', 'start');
  o += text(X0, 248, '两个 velocity 各自 perpendicular 于那条线。', 'ts', 'start');
  return svgA(560, 300, o, '动图：一个 body 绕点 q 以 1 rad/s 转。画在 space frame origin 上的 v_s 箭头一直不变，body origin 的 velocity 箭头跟着转，在 body axis 上读出的 v_b 也不变');
}

// ---------- 桥一：wrist camera ----------
const L3 = [1, 1, 0.5];
const fk3 = (th) => { let T = [0, 0, 0]; const pts = [[0, 0]]; for (let i = 0; i < 3; i++) { T = compose(T, [0, 0, th[i]]); T = compose(T, [L3[i], 0, 0]); pts.push([T[0], T[1]]); } return { T, pts }; };
function wristcam() {
  const Tec = [-0.1, 0.05, -20 * DEG];
  const th0 = [30 * DEG, 90 * DEG, -60 * DEG];
  const Tsc0 = compose(fk3(th0).T, Tec), ps = apply(Tsc0, [0.3, 0]);
  // θ1：第一帧停在 36°，然后 36° → 30° → 36°
  const tA = 0.9, tB = 1.6, Tt = 2 * tA + 2 * tB, N = 18;
  const seq = [], kt = [];
  const push = (t, a) => { kt.push(t / Tt); seq.push(a); };
  push(0, 36); push(tA, 36);
  for (let i = 1; i <= N; i++) push(tA + tB * i / N, 36 - 6 * i / N);
  push(2 * tA + tB, 30);
  for (let i = 1; i <= N; i++) push(2 * tA + tB + tB * i / N, 30 + 6 * i / N);
  kt[kt.length - 1] = 1;
  const conf = (a) => fk3([a * DEG, th0[1], th0[2]]);
  const camPose = (a) => compose(conf(a).T, Tec);
  const fov = Math.atan(320 / 500);
  let o = '';
  // 左：整条 arm
  const K1 = 88, P1 = ([x, y]) => [36 + K1 * x, 276 - K1 * y];
  o += rect(P1([0, 0])[0] - 14, P1([0, 0])[1], 28, 9, 'paper', 2);
  o += apath(seq.map((a) => d(conf(a).pts.map(P1))), kt, Tt, 'ink-b');
  for (let j = 0; j < 3; j++) o += acircle(seq.map((a) => P1(conf(a).pts[j])[0]), seq.map((a) => P1(conf(a).pts[j])[1]), kt, Tt, j ? 3.5 : 4.5, 'paper');
  o += apath(seq.map((a) => shapeD(CAM(0.9), camPose(a), P1)), kt, Tt, 'solid');
  const Z = [0.2, 1.5, 0.95, 2.05]; // zoom 的范围
  const za = P1([Z[0], Z[3]]), zb = P1([Z[2], Z[1]]);
  o += rect(za[0], za[1], zb[0] - za[0], zb[1] - za[1], 'frame');
  o += text(P1([0, 0])[0] + 20, P1([0, 0])[1] + 2, 'joint 1：36° ⇄ 30°', 'ts', 'start');
  // 中：放大
  const K2 = 272, X2 = 162, Y2 = 26, P2 = ([x, y]) => [X2 + K2 * (x - Z[0]), Y2 + K2 * (Z[3] - y)];
  const W2 = K2 * (Z[2] - Z[0]), H2 = K2 * (Z[3] - Z[1]);
  o += `<clipPath id="tf-wc-clip"><rect x="${f1(X2)}" y="${f1(Y2)}" width="${f1(W2)}" height="${f1(H2)}"/></clipPath>`;
  o += line(zb[0], za[1], X2, Y2, 'grid') + line(zb[0], zb[1], X2, Y2 + H2, 'grid');
  o += rect(X2, Y2, W2, H2, 'frame');
  let g = '';
  g += apath(seq.map((a) => { const T = camPose(a); return d([P2(apply(T, [0.6 * Math.cos(fov), 0.6 * Math.sin(fov)])), P2([T[0], T[1]]), P2(apply(T, [0.6 * Math.cos(fov), -0.6 * Math.sin(fov)]))]); }), kt, Tt, 'grid');
  g += apath(seq.map((a) => { const T = camPose(a); return d([P2([T[0], T[1]]), P2(apply(T, [0.6, 0]))]); }), kt, Tt, 'mute');
  g += apath(seq.map((a) => { const c = conf(a).pts; return d([P2(c[2]), P2(c[3])]); }), kt, Tt, 'ink-b');
  g += apath(seq.map((a) => shapeD(GRIP(0.6), conf(a).T, P2)), kt, Tt, 'paper');
  g += apath(seq.map((a) => { const T = camPose(a); return d([P2([T[0], T[1]]), P2(ps)]); }), kt, Tt, 'ln-dash');
  g += apath(seq.map((a) => shapeD(CAM(0.6), camPose(a), P2)), kt, Tt, 'solid');
  const pso = P2(ps);
  g += rect(pso[0] - 7, pso[1] - 7, 14, 14, 'solid2', 1.5);
  o += `<g clip-path="url(#tf-wc-clip)">${g}</g>`;
  o += text(pso[0] - 16, pso[1] + 28, '物体，不动', 'tb', 'start');
  o += text(X2 + W2 / 2, Y2 + H2 + 18, '放大：彩色的是装在 gripper 上的 camera', 'ts', 'middle');
  o += text(X2 + W2 / 2, Y2 + H2 + 34, '虚线：到物体的 ray', 'ts', 'middle');
  o += text(X2 + W2 / 2, Y2 + H2 + 50, '灰线：optical axis 与 field of view', 'ts', 'middle');
  // 右：image strip
  const X0 = 396, X1 = 548, Y = 112, su = (u) => X0 + (X1 - X0) * u / 640;
  o += text((X0 + X1) / 2, 40, 'image', 'tb', 'middle') + text((X0 + X1) / 2, 57, '（只有一个 coordinate u）', 'ts', 'middle');
  o += rect(X0, Y - 10, X1 - X0, 20, 'wash2', 3);
  for (const u of [0, 320, 640]) o += line(su(u), Y + 10, su(u), Y + 15, 'axis') + text(su(u), Y + 29, String(u), 'ts', 'middle');
  const us = seq.map((a) => proj(camPose(a), ps));
  o += acircle(us.map(su), us.map(() => Y), kt, Tt, 6.5, 'ln-f');
  o += line(su(320), Y - 16, su(320), Y - 10, 'ink') + text(su(320), Y - 21, '30°', 'ts', 'middle');
  const u36 = proj(camPose(36), ps);
  o += line(su(u36), Y - 16, su(u36), Y - 10, 'ink') + text(su(u36), Y - 21, '36°', 'ts', 'middle');
  o += text(X0, 172, '30°：u = 320', 'ts', 'start') + text(X0, 188, '36°：u = 72', 'ts', 'start');
  o += text(X0, 214, 'Joint 1 每转 1°，', 'ts', 'start') + text(X0, 230, '物体在 image 里挪约 50 px', 'ts', 'start');
  return svgA(560, 290, o, '动图：3R arm 的 joint 1 在 36 度和 30 度之间来回转，中间放大的是 gripper 上的 camera 和它到物体的 ray；右边的一维 image 里，不动的物体在 u 等于 72 和 320 之间滑动');
}

// ---------- 桥二：line、screw axis 与 ray ----------
function lines() {
  let o = '';
  // 左：Modern Robotics 第 4 站的 3R，θ = (30°, 45°, 60°)
  const s = 150, C = [60, 80];
  const Pj = ([x, y, z]) => [C[0] + s * (0.95 * x - 0.3 * y), C[1] + s * (0.25 * x + 0.45 * y - 0.9 * z)];
  const seg = (a, b, cls) => path(d([Pj(a), Pj(b)]), cls);
  const on = (q, u, t) => [q[0] + t * u[0], q[1] + t * u[1], q[2] + t * u[2]];
  const q2 = [0.866, 0.5, 0], w2 = [0.5, -0.866, 0], p = [1.1722, 0.6768, -0.3536], w3 = [0.6124, 0.3536, 0.7071];
  o += text(150, 14, 'Statics：joint axis 与 force 的 line of action', 'tb', 'middle');
  // axis lines（虚线）
  o += seg([0, 0, -0.6], [0, 0, 0.4], 'dash');
  o += seg(on(q2, w2, -0.62), on(q2, w2, 0.62), 'dash');
  o += seg(on(p, w3, -0.55), on(p, w3, 0.55), 'dash');
  // force 作用线
  o += seg([p[0], p[1], -0.8], [p[0], p[1], 0.62], 'ln');
  const fA = Pj([p[0], p[1], p[2] - 0.36]), fB = Pj([p[0], p[1], p[2] - 0.05]);
  o += arrow(fA[0], fA[1], fB[0], fB[1], 'ln', 10);
  // links
  o += seg([0, 0, 0], q2, 'ink-b') + seg(q2, p, 'ink-b');
  o += circle(...Pj([0, 0, 0]), 4, 'paper') + circle(...Pj(q2), 4, 'paper') + circle(...Pj(p), 4.5, 'ink-f');
  // axis 2 与 force 作用线的 common perpendicular：从 q2 到 (p_x, p_y, 0)
  const Af = [p[0], p[1], 0];
  { const A = Pj(q2), B = Pj(Af), M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; o += arrow(M[0], M[1], A[0] + 0.12 * (B[0] - A[0]), A[1] + 0.12 * (B[1] - A[1]), 'mute', 5) + arrow(M[0], M[1], B[0], B[1], 'mute', 5) + circle(...B, 2.5, 'ln-f'); }
  const lab = (pt, rows, anchor, dx, dy) => { const q = Pj(pt); return rows.map((r, i) => text(q[0] + dx, q[1] + dy + 14 * i, r, i ? 'ts' : 't', anchor)).join(''); };
  o += lab([0, 0, 0.4], ['axis 1（joint 1）', '∥ line of action：⟨L' + S('1') + ', L' + S('f') + '⟩ = 0'], 'start', 8, 4);
  o += text(8, 194, 'axis 2（joint 2）', 't', 'start') + text(8, 208, '与 line of action 相距 0.354 m', 'ts', 'start') + text(8, 222, '⟨L' + S('2') + ', L' + S('f') + '⟩ = 0.354', 'ts', 'start');
  o += lab(on(p, w3, -0.55), ['axis 3（joint 3）', '穿过 p：⟨L' + S('3') + ', L' + S('f') + '⟩ = 0'], 'end', -8, 8);
  o += lab([p[0], p[1], -0.8], ['line of action L' + S('f'), '过 p，f = 10 N 向上'], 'start', 8, -6);
  const af = Pj(Af);
  o += text(af[0] + 6, af[1] - 8, '0.354 m', 'ts', 'start');
  o += text(150, 312, 'τ = 10 × (0, 0.354, 0) = (0, 3.54, 0) N·m', 'tl', 'middle');
  // 右：CS4243 第 6 站的两个 camera，俯视（y 很小，略去）
  const s2 = 108, C2 = [404, 266];
  const Pt = ([x, , z]) => [C2[0] + s2 * x, C2[1] - s2 * z];
  const X1 = [0.2, -0.1, 2.0], c1 = [0, 0, 0], c2 = [0.5, -0.2, 0];
  o += text(430, 14, 'Epipolar：两条 ray（俯视）', 'tb', 'middle');
  o += poly([c1, c2, X1].map(Pt), 'wash');
  o += path(d([Pt(c1), Pt(c2)]), 'mute');
  const ext = (c, X, k) => [c[0] + k * (X[0] - c[0]), 0, c[2] + k * (X[2] - c[2])];
  o += path(d([Pt(c1), Pt(ext(c1, X1, 1.12))]), 'ln') + path(d([Pt(c2), Pt(ext(c2, X1, 1.12))]), 'ln');
  o += circle(...Pt(X1), 4.5, 'ink-f') + text(Pt(X1)[0] + 12, Pt(X1)[1] + 5, 'X', 'tb', 'start');
  const camT = (c, g) => { const Rz = ([x, z]) => [x * Math.cos(g) + z * Math.sin(g), -x * Math.sin(g) + z * Math.cos(g)]; const a = Rz([-0.1, 0.2]), b = Rz([0.1, 0.2]); return poly([Pt(c), Pt([c[0] + a[0], 0, a[1]]), Pt([c[0] + b[0], 0, b[1]])], 'solid2'); };
  o += camT(c1, 0) + camT(c2, -10 * DEG);
  o += text(Pt(c1)[0] - 8, Pt(c1)[1] + 18, 'camera 1', 'ts', 'end') + text(Pt(c2)[0] + 8, Pt(c2)[1] + 18, 'camera 2', 'ts', 'start');
  const m1 = Pt([0.08, 0, 0.9]), m2 = Pt([0.37, 0, 0.9]);
  o += text(m1[0] - 8, m1[1], 'L' + S('1') + ' = (y' + S('1') + ', 0)', 'ts', 'end') + text(m1[0] - 8, m1[1] + 14, '写在 camera 1 里', 'ts', 'end');
  o += text(m2[0] + 10, m2[1], 'L' + S('2') + ' = (y' + S('2') + ', 0)', 'ts', 'start') + text(m2[0] + 10, m2[1] + 14, '写在 camera 2 里', 'ts', 'start');
  o += text(430, 304, '⟨Ad' + S('T21') + ' L' + S('1') + ', L' + S('2') + '⟩ = y' + S('2') + '<tspan class="sup" dy="-6">⊤</tspan><tspan dy="6">​</tspan>[t]' + S('×') + 'R y' + S('1') + ' = 0', 'tl', 'middle');
  o += text(430, 321, '彩色三角形：epipolar plane', 'ts', 'middle');
  return svg(560, 328, o, '左：Modern Robotics 的 3R arm，三条 joint axis 画成虚线，竖直的 force line of action 穿过 end-effector；axis 1 与它平行，axis 3 与它相交，axis 2 与它相距 0.354 米。右：俯视两个 camera，ray 1 和 ray 2 交于点 X，三点所在的 epipolar plane 画成彩色');
}

// ---------- 桥三：SE(2) 上的 Gauss–Newton ----------
function gnRun(leftUpdate, th0 = 0, iters = 8) {
  const m = [[0, 0], [3, 0], [0, 3]], s = [[4, 1], [6.4, 2.8], [2.3, 3.3]];
  let th = th0, p = [0, 0];
  const hist = [];
  const res = () => m.flatMap((mi, i) => { const q = add(rot(th, mi), p); return [q[0] - s[i][0], q[1] - s[i][1]]; });
  for (let k = 0; k <= iters; k++) {
    const r = res(); hist.push({ th, p: [...p], rms: Math.sqrt(r.reduce((a, b) => a + b * b, 0) / 3) });
    // J：right perturbation，row 块是 R [ẑ×m | I]
    const c = Math.cos(th), sn = Math.sin(th), J = [];
    m.forEach((mi) => { const a = [-mi[1], mi[0]]; const Ra = rot(th, a); J.push([Ra[0], c, -sn]); J.push([Ra[1], sn, c]); });
    const H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], g = [0, 0, 0];
    J.forEach((row, i) => { for (let a = 0; a < 3; a++) { g[a] += row[a] * r[i]; for (let b = 0; b < 3; b++) H[a][b] += row[a] * row[b]; } });
    // 解 H δ = −g（3×3，Cramer）
    const det3 = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    const D = det3(H), dl = [0, 1, 2].map((j) => det3(H.map((row, i) => row.map((v, k2) => (k2 === j ? -g[i] : v)))) / D);
    const [dw, vx, vy] = dl;
    const V = Math.abs(dw) < 1e-12 ? [vx, vy] : [(Math.sin(dw) * vx - (1 - Math.cos(dw)) * vy) / dw, ((1 - Math.cos(dw)) * vx + Math.sin(dw) * vy) / dw];
    if (leftUpdate) { p = add(rot(dw, p), V); th += dw; } else { p = add(p, rot(th, V)); th += dw; }
  }
  return { hist, m, s };
}
function gn() {
  const K = 35;
  const runs = [gnRun(false), gnRun(true)];
  const n = runs[0].hist.length, step = 0.75, hold = 2.2, Tt = hold + step * (n - 1) + hold;
  // 第一帧是最后一步（静态截图看到的），停一会儿再从第 0 步演一遍
  const kt = [0], idx = [n - 1];
  for (let k = 0; k < n; k++) { kt.push((hold + step * k) / Tt); idx.push(k); }
  let o = '';
  runs.forEach((run, j) => {
    const x0 = 16 + j * 284, P = ([x, y]) => [x0 + K * (x + 0.3), 222 - K * (y + 0.6)];
    o += text(x0 + 120, 18, j ? 'J 按右乘求，update 却左乘（错）' : 'Increment 右乘：X ← X e' + '<tspan class="sup" dy="-6">[δ]</tspan><tspan dy="6">​</tspan>', j ? 'tb' : 'tl', 'middle');
    const ax = P([0, 0]);
    o += line(ax[0], ax[1], P([6.6, 0])[0], ax[1], 'grid') + line(ax[0], ax[1], ax[0], P([0, 4.2])[1], 'grid');
    run.s.forEach((q) => { o += circle(...P(q), 4.5, 'ink-f'); });
    run.hist.forEach((h, k) => { if (k) o += `<g>${line(...P(run.hist[k - 1].p), ...P(h.p), j ? 'ink' : 'ln')}${circle(...P(h.p), 2.2, j ? 'ink-f' : 'ln-f')}${ashow(idx.map((i) => i >= k), kt, Tt)}</g>`; });
    o += apath(idx.map((k) => { const h = run.hist[k]; return d(run.m.map((mi) => P(add(rot(h.th, mi), h.p)))) + 'Z'; }), kt, Tt, j ? 'dash' : 'ln-dash', true);
    o += `<circle cx="${f1(P(run.hist[n - 1].p)[0])}" cy="${f1(P(run.hist[n - 1].p)[1])}" r="3.5" class="${j ? 'ink-f' : 'ln-f'}">${anim('cx', idx.map((k) => f1(P(run.hist[k].p)[0])), kt, Tt, true)}${anim('cy', idx.map((k) => f1(P(run.hist[k].p)[1])), kt, Tt, true)}</circle>`;
    run.hist.forEach((h, k) => {
      const lab = `第 ${k} 步：θ = ${(h.th / DEG).toFixed(2)}°，RMS = ${h.rms.toFixed(3)}`;
      o += `<text x="${f1(x0 + 120)}" y="240" class="${j ? 't' : 'tl'}" text-anchor="middle">${lab}${ashow(idx.map((i) => i === k), kt, Tt)}</text>`;
    });
  });
  o += text(280, 264, '黑点是 scene 的三个点；虚线三角形是当前 pose 下的 model，实线是 model origin 走过的路', 'ts', 'middle');
  return svgA(560, 272, o, '动图：同一个三点 registration 问题，左边用 right perturbation 做 Gauss–Newton，三步到 37.36 度、RMS 0.064；右边 Jacobian 按右乘算、update 却左乘，rotation 很快对了，translation 绕着解打转，第八步 RMS 仍是 0.079');
}

// ---------- 桥四：gauge ----------
function gauge() {
  const cams = [[0.4, 0.3, 55 * DEG], [1.3, 0.0, 85 * DEG], [2.6, 0.6, 130 * DEG]];
  const pts = [[1.6, 1.5], [1.1, 1.9], [2.0, 1.75], [1.4, 2.4], [2.0, 2.3], [1.2, 1.4]];
  const G = invPose(cams[0]);
  // G 的 log（planar）：转 φ，translation 用 V(φ)^{-1}
  const ph = G[2], half = ph / 2, cot = Math.cos(half) / Math.sin(half);
  const Vinv = [[half * cot, half], [-half, half * cot]];
  const rho = [Vinv[0][0] * G[0] + Vinv[0][1] * G[1], Vinv[1][0] * G[0] + Vinv[1][1] * G[1]];
  const expP = (t) => { const w = t * ph, vx = t * rho[0], vy = t * rho[1]; if (Math.abs(w) < 1e-12) return [vx, vy, 0]; return [(Math.sin(w) * vx - (1 - Math.cos(w)) * vy) / w, ((1 - Math.cos(w)) * vx + Math.sin(w) * vy) / w, w]; };
  const canon = pts.map((X) => apply(G, X));
  const cen = canon.reduce((a, b) => add(a, b), [0, 0]).map((v) => v / pts.length), sc = 1 / Math.hypot(...cen);
  const Tm = 2.4, Ts = 1.2, h1 = 0.8, h2 = 0.5, h3 = 1.4, Tt = h1 + Tm + h2 + Ts + h3;
  const kt = [], st = [];
  const N = 24, M2 = 10;
  kt.push(0); st.push([0, 1]);
  for (let i = 0; i <= N; i++) { kt.push((h1 + Tm * i / N) / Tt); st.push([i / N, 1]); }
  for (let i = 0; i <= M2; i++) { kt.push((h1 + Tm + h2 + Ts * i / M2) / Tt); st.push([1, 1 + (sc - 1) * i / M2]); }
  kt.push(1); st.push([1, sc]);
  const K = 64, P = ([x, y]) => [44 + K * (x + 0.25), 172 - K * y];
  const at = ([t, s], pose) => { const g = expP(t); const q = compose(g, pose); return [s * q[0], s * q[1], q[2]]; };
  const atp = ([t, s], X) => { const g = expP(t); const q = apply(g, X); return [s * q[0], s * q[1]]; };
  let o = '';
  o += axesAt([0, 0, 0], 0.45, P, 'ink', 'x̂', 'ŷ');
  o += text(P([0, 0])[0] - 10, P([0, 0])[1] + 4, 'origin', 'ts', 'end');
  pts.forEach((X) => { o += acircle(st.map((g) => P(atp(g, X))[0]), st.map((g) => P(atp(g, X))[1]), kt, Tt, 3.2, 'ink-f'); });
  const fov = Math.atan(320 / 500);
  cams.forEach((T, i) => {
    o += apath(st.map((g) => { const q = at(g, T), L = 2.3 * g[1]; return d([P(apply(q, [L * Math.cos(fov), L * Math.sin(fov)])), P([q[0], q[1]]), P(apply(q, [L * Math.cos(fov), -L * Math.sin(fov)]))]); }), kt, Tt, 'grid');
    o += apath(st.map((g) => shapeD(CAM(0.8), at(g, T), P)), kt, Tt, i ? 'solid2' : 'solid');
    const off = [[26, -10], [-4, 20], [20, 18]][i];
    const lx = st.map((g) => f1(P(at(g, T))[0] + off[0])), ly = st.map((g) => f1(P(at(g, T))[1] + off[1]));
    o += `<text class="ts" text-anchor="middle" x="${lx[0]}" y="${ly[0]}">cam ${i}${anim('x', lx, kt, Tt)}${anim('y', ly, kt, Tt)}</text>`;
  });
  // 右：三张 image
  const X0 = 318, X1 = 546, su = (u) => X0 + (X1 - X0) * u / 640;
  o += text(432, 22, '三张 image（一直不变）', 'tb', 'middle');
  cams.forEach((T, i) => {
    const Y = 62 + i * 54;
    o += rect(X0, Y - 8, X1 - X0, 16, 'wash2', 3) + text(X0 - 6, Y + 4, 'cam ' + i, 'ts', 'end');
    pts.forEach((X) => { const u = proj(T, X); o += line(su(u), Y - 8, su(u), Y + 8, i ? 'ink' : 'ln'); });
  });
  for (const u of [0, 320, 640]) o += text(su(u), 196, String(u), 'ts', 'middle');
  // 阶段说明
  const stage = (txt, y, on) => `<text x="432" y="${y}" class="t" text-anchor="middle">${txt}${ashow(on, kt, Tt)}</text>`;
  const ph1 = st.map((g, i) => i <= N + 1), ph2 = st.map((g, i) => i > N + 1);
  o += stage('① 所有 pose 左乘 G = T' + S('0') + '<tspan class="sup" dy="-6">−1</tspan><tspan dy="6">​</tspan>', 236, ph1) + stage('cam 0 搬到 origin、朝 0°', 253, ph1);
  o += stage('② 所有 position 乘 0.513', 236, ph2) + stage('点的 centroid 离 origin 为 1', 253, ph2);
  o += text(432, 278, 'world 里的 coordinate 全变了，', 'ts', 'middle') + text(432, 294, 'pixel 一个都没变', 'ts', 'middle');
  return svgA(560, 300, o, '动图：左边三个 camera 和六个点先被同一个 rigid transform 搬到 camera 0 的 frame 里，再整体缩小到 0.513 倍；右边三张一维 image 里六个点的 pixel 始终不变');
}

export default {
  'thread-frames-extr': extr,
  'thread-frames-spin': spin,
  'thread-frames-twists': twists,
  'thread-frames-wristcam': wristcam,
  'thread-frames-lines': lines,
  'thread-frames-gn': gn,
  'thread-frames-gauge': gauge,
};
