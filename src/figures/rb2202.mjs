import { svg, svgA, anim, animRot, apath, acircle, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const R = Math.PI / 180;
const fk2 = (t1, t2) => [Math.cos(t1) + Math.cos(t1 + t2), Math.sin(t1) + Math.sin(t1 + t2)];
const J2 = (t1, t2) => [[-Math.sin(t1) - Math.sin(t1 + t2), -Math.sin(t1 + t2)], [Math.cos(t1) + Math.cos(t1 + t2), Math.cos(t1 + t2)]];
// 画一条 planar arm：pts 是 joint 和 tip 的坐标（米），P 把米变成像素
const arm = (pts, P, cls = 'ink-b', jr = 4) => {
  let o = path(d(pts.map(P)), cls);
  pts.slice(0, -1).forEach((p, i) => { const q = P(p); o += circle(q[0], q[1], i === 0 ? jr + 1 : jr, 'paper') ; });
  const e = P(pts[pts.length - 1]);
  return o + circle(e[0], e[1], 3, 'ink-f');
};
const frameAx = (O, ang, L, cls, lx, ly) => {
  const x = [O[0] + L * Math.cos(ang), O[1] - L * Math.sin(ang)], y = [O[0] - L * Math.sin(ang), O[1] - L * Math.cos(ang)];
  let o = arrow(O[0], O[1], x[0], x[1], cls) + arrow(O[0], O[1], y[0], y[1], cls);
  if (lx) o += text(x[0] + 6 * Math.cos(ang), x[1] - 6 * Math.sin(ang) + 4, lx, 'ts', 'middle');
  if (ly) o += text(y[0] - 7 * Math.sin(ang), y[1] - 7 * Math.cos(ang) + 4, ly, 'ts', 'middle');
  return o;
};

// 第 1 站：同一个点在两个 frame 里的 coordinate
function frame() {
  let o = '';
  const panel = (x0, rot, title, lab, coords) => {
    const S = 64, O = [x0 + (rot ? 150 : 40), 205];
    const P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
    o += frameAx(O, rot, 1.75 * S, 'ink', rot ? 'x̂_b' : 'x̂_a', rot ? 'ŷ_b' : 'ŷ_a');
    const p = P([1, 1]);
    // 沿两根 axis 的分量
    const ux = [Math.cos(rot), Math.sin(rot)], uy = [-Math.sin(rot), Math.cos(rot)];
    const cx = coords[0], cy = coords[1];
    const a = P([cx * ux[0], cx * ux[1]]);
    o += line(O[0], O[1], a[0], a[1], 'ln') + line(a[0], a[1], p[0], p[1], 'ln-dash');
    o += circle(p[0], p[1], 5, 'ink-f') + text(p[0] + 9, p[1] - 6, 'p', 'tb');
    o += text(x0 + 95, 26, title, 'tb', 'middle') + text(x0 + 95, 262, lab, 'tl', 'middle');
  };
  panel(10, 0, '在 {a} 里读', 'p_a = (1, 1)', [1, 1]);
  panel(290, Math.PI / 2, '在 {b} 里读（{a} 绕 ẑ 转 90°）', 'p_b = (1, −1)', [1, -1]);
  o += text(280, 284, '彩色实线是沿第一根 axis 走的那一段，虚线是沿第二根 axis 走的那一段', 'ts', 'middle');
  return svg(560, 294, o, '同一个点 p 在 frame a 里的 coordinate 是 1、1，在绕 z 转了 90 度的 frame b 里是 1、负 1');
}

// 第 1 站：gimbal lock 附近，真实转动 12°，Euler angle 的读数
function gimbal() {
  const mul = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
  const Rx = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
  const Ry = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
  const ex = (M) => [Math.atan2(M[1][0], M[0][0]) / R, Math.atan2(-M[2][0], Math.hypot(M[0][0], M[1][0])) / R, Math.atan2(M[2][1], M[2][2]) / R];
  const sx = lin(-6, 6, 70, 530), sy = lin(-90, 90, 250, 30);
  let o = axes({ sx, sy, x0: -6, x1: 6, y0: -90, y1: 90, xt: [[-6, '−6°'], [-4, '−4°'], [-2, '−2°'], [0, '0'], [2, '2°'], [4, '4°'], [6, '6°']], yt: [[-90, '−90°'], [-45, '−45°'], [0, '0'], [45, '45°'], [90, '90°']], xAt: -90, grid: true });
  const series = (k, cls) => { const pts = []; for (let i = 0; i <= 600; i++) { const e = -6 + (12 * i) / 600; pts.push([sx(e), sy(ex(mul(Rx(e * R), Ry(88 * R)))[k])]); } return path(d(pts), cls); };
  o += series(1, 'ink-b') + series(0, 'ln') + series(2, 'ln-dash');
  o += text(sx(-5.8), sy(70), 'β（pitch）：只在 84° 到 88° 之间', 't');
  o += text(526, sy(34), 'α（yaw，彩色实线）', 'tl', 'end') + text(526, sy(20), 'γ（roll，彩色虚线）几乎与 α 重合', 'ts', 'end');
  o += line(sx(-1), sy(-90), sx(-1), sy(90), 'mute') + line(sx(1), sy(-90), sx(1), sy(90), 'mute');
  o += text(sx(0), sy(-62), '真实转动 2°', 'ts', 'middle') + text(sx(0), sy(-74), 'α 变化 53°', 'ts', 'middle');
  o += text(530, 286, '横轴：Rot(x̂_s, ε) Rot(ŷ, 88°) 里的 ε，即真实转过的 angle', 'ts', 'end');
  return svg(560, 296, o, 'Orientation 以恒定速度转动 12 度，经过 pitch 88 度附近；读出的 yaw 和 roll 从负 71 度变到正 71 度，中间 2 度里就变了 53 度');
}

// 第 2 站：base → gripper → camera → object
function chain() {
  const t = [30 * R, 90 * R, -60 * R], L = [1, 1, 0.5];
  const pts = [[0, 0]]; let a = 0;
  for (let i = 0; i < 3; i++) { a += t[i]; const q = pts[i]; pts.push([q[0] + L[i] * Math.cos(a), q[1] + L[i] * Math.sin(a)]); }
  const tip = pts[3];
  const cam = [tip[0] + 0.5 * -0.1 - 0.866 * 0.05, tip[1] + 0.866 * -0.1 + 0.5 * 0.05];
  const obj = [cam[0] + 0.3 * Math.cos(40 * R), cam[1] + 0.3 * Math.sin(40 * R)];
  // 左：整条 arm
  const S1 = 95, P1 = ([x, y]) => [60 + S1 * x, 228 - S1 * y];
  let o = arm(pts, P1, 'mute', 3.5);
  o += frameAx(P1([0, 0]), 0, 40, 'ink', 'x̂_s', 'ŷ_s');
  o += text(P1([0, 0])[0], P1([0, 0])[1] + 22, 'base {s}', 't', 'middle');
  const z0 = P1([0.42, 2.02]), z1 = P1([0.86, 1.6]);
  o += rect(z0[0], z0[1], z1[0] - z0[0], z1[1] - z0[1], 'frame');
  o += text(z1[0] + 6, z0[1] + 12, '放大 →', 'ts');
  o += text(20, 286, 'T_se：由 joint angle 算', 't') + text(20, 304, 'T_ec：camera 的安装位置', 't') + text(20, 322, 'p_c = (0.3, 0)：camera 的测量', 't') + text(20, 344, 'p_s = T_se T_ec p_c', 'tl');
  // 右：末端放大
  const S = 640, P = ([x, y]) => [230 + S * (x - 0.42), 20 + S * (2.02 - y)];
  const cut = [pts[2][0] + 0.62 * (tip[0] - pts[2][0]), pts[2][1] + 0.62 * (tip[1] - pts[2][1])];
  o += rect(230, 20, S * 0.44, S * 0.42, 'frame');
  o += path(d([cut, tip].map(P)), 'ink-b');
  o += frameAx(P(tip), 60 * R, 46, 'ink', 'x̂_e', 'ŷ_e');
  o += frameAx(P(cam), 40 * R, 46, 'ln', '', '');
  const pt = P(tip), pc = P(cam), po = P(obj);
  o += circle(pt[0], pt[1], 3.5, 'ink-f') + circle(pc[0], pc[1], 3.5, 'ln-f');
  o += line(pc[0], pc[1], po[0], po[1], 'ln-dash') + rect(po[0] - 8, po[1] - 8, 16, 16, 'solid2', 2);
  o += text(po[0] - 12, po[1] - 12, '物体 p_s = (0.753, 1.930)', 'tb', 'end');
  o += text(pt[0] + 12, pt[1] + 18, 'gripper {e}', 't') + text(pt[0] + 12, pt[1] + 34, '(0.616, 1.799)，60°', 'ts');
  o += text(pc[0] - 10, pc[1] + 20, 'camera {c}', 'tl', 'end') + text(pc[0] - 10, pc[1] + 36, '(0.523, 1.737)，40°', 'ts', 'end');
  o += text(P([0.64, 1.6])[0], 308, '彩色箭头是 camera 的两根 axis；p_c 沿 x̂_c 方向 0.3 m（彩色虚线）', 'ts', 'middle');
  return svg(560, 360, o, '左边是整条 3R arm，右边放大 tip 附近：gripper frame、装在 gripper 上的 camera frame 和 camera 看到的物体；物体在 base frame 里的 position 由三段 transform 相乘得到');
}

// 第 3 站：PoE 的三步
function poe() {
  const S = 58;
  let o = '';
  const rotAbout = (p, q, th) => { const c = Math.cos(th), s = Math.sin(th); return [q[0] + c * (p[0] - q[0]) - s * (p[1] - q[1]), q[1] + s * (p[0] - q[0]) + c * (p[1] - q[1])]; };
  const home = [[0, 0], [1, 0], [2, 0], [2.5, 0]];
  const s1 = home.map((p, i) => (i >= 3 ? rotAbout(p, [2, 0], -60 * R) : p));
  const s2 = s1.map((p, i) => (i >= 2 ? rotAbout(p, [1, 0], 90 * R) : p));
  const s3 = s2.map((p, i) => (i >= 1 ? rotAbout(p, [0, 0], 30 * R) : p));
  const stages = [[s1, 2, '① joint 3 转 −60°', '绕 q₃ = (2, 0)'], [s2, 1, '② joint 2 转 90°', '绕 q₂ = (1, 0)'], [s3, 0, '③ joint 1 转 30°', '绕 q₁ = (0, 0)']];
  stages.forEach(([pts, k, t1, t2], i) => {
    const x0 = 14 + i * 184, O = [x0 + 20, 190];
    const P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
    o += path(d(home.map(P)), 'dash');
    o += arm(pts, P, 'ink-b', 3.5);
    const q = P(home[k]); o += circle(q[0], q[1], 6.5, 'ln');
    const tp = P(pts[3]);
    o += text(tp[0] + (i === 0 ? -6 : 7), tp[1] + (i === 0 ? 16 : -3), `(${pts[3][0].toFixed(3)}, ${pts[3][1].toFixed(3)})`, 'ts', i === 0 ? 'middle' : 'start');
    o += text(x0 + 82, 24, t1, 'tb', 'middle') + text(x0 + 82, 41, t2, 'ts', 'middle');
  });
  o += text(280, 250, '虚线：home configuration，tool 在 (2.5, 0)。彩色圆圈：这一步绕的 axis，它仍在 home 时的位置', 'ts', 'middle');
  return svg(560, 262, o, 'Product of exponentials 的三步：先绕 joint 3 的 home 位置转，再把 joint 2 以外整体绕 joint 2 的 home 位置转，最后整体绕 base 转，tip 依次到达三个位置');
}

// 第 4 站：Jacobian 的两个 column
function jcols() {
  const S = 140, O = [300, 250], P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
  const t1 = 30 * R, t2 = 90 * R;
  const j2 = [Math.cos(t1), Math.sin(t1)], tip = fk2(t1, t2), J = J2(t1, t2);
  let o = line(P([-1.6, 0])[0], O[1], P([1.3, 0])[0], O[1], 'grid');
  o += line(P([0, 0])[0], P([0, 0])[1], P(tip)[0], P(tip)[1], 'dash') + line(P(j2)[0], P(j2)[1], P(tip)[0], P(tip)[1], 'dash');
  o += arm([[0, 0], j2, tip], P, 'mute', 4);
  const k = 0.5, T = P(tip);
  const c1 = [tip[0] + k * J[0][0], tip[1] + k * J[1][0]], c2 = [tip[0] + k * J[0][1], tip[1] + k * J[1][1]];
  o += arrow(T[0], T[1], P(c1)[0], P(c1)[1], 'ln') + arrow(T[0], T[1], P(c2)[0], P(c2)[1], 'ink-b');
  o += text(P(c1)[0] - 6, P(c1)[1] - 8, 'column 1 = (−1.366, 0.366)', 'tl', 'middle');
  o += text(P(c2)[0] - 8, P(c2)[1] + 6, 'column 2 = (−0.866, −0.5)', 'tb', 'end');
  o += text(T[0] + 8, T[1] - 6, 'tip (0.366, 1.366)', 'ts');
  o += text(P([0, 0])[0], P([0, 0])[1] + 20, 'joint 1', 'ts', 'middle') + text(P(j2)[0] + 10, P(j2)[1] + 14, 'joint 2', 'ts');
  o += text(P([0.62, 0.95])[0], P([0.62, 0.95])[1], '虚线：joint 到 tip', 'ts');
  o += text(280, 284, '箭头按 0.5 倍画出。column 1 ⊥ 从 joint 1 到 tip 的虚线，length 1.414；', 'ts', 'middle') + text(280, 300, 'column 2 ⊥ 从 joint 2 到 tip 的虚线，length 1', 'ts', 'middle');
  return svg(560, 310, o, '2R arm 在 30 度、90 度时，Jacobian 的两个 column 画在 tip 上，各自 perpendicular 于从对应 joint 到 tip 的连线');
}

// 第 4 站：伸直附近 joint velocity 的 blow up
function blowup() {
  const sx = lin(0, 90, 80, 520), ly = (v) => Math.log10(v), sy = lin(0, 3, 240, 30);
  let o = '';
  for (const v of [1, 10, 100, 1000]) o += line(sx(0), sy(ly(v)), sx(90), sy(ly(v)), 'grid') + text(74, sy(ly(v)) + 4, String(v), 'ts', 'end');
  for (const x of [0, 15, 30, 45, 60, 75, 90]) o += line(sx(x), 240, sx(x), 244, 'axis') + text(sx(x), 258, x + '°', 'ts', 'middle');
  o += line(sx(0), 240, sx(90), 240, 'axis') + line(sx(0), 240, sx(0), 30, 'axis');
  const f = (t2) => (0.1 / Math.sin((t2 * R) / 2)) / R;
  const pts = []; for (let i = 0; i <= 400; i++) { const t2 = 0.75 + (89.25 * i) / 400; pts.push([sx(t2), sy(ly(f(t2)))]); }
  o += path(d(pts), 'ln');
  for (const t2 of [1, 2, 5, 10, 30, 90]) { const v = f(t2); o += circle(sx(t2), sy(ly(v)), 3.5, 'ink-f'); }
  o += text(sx(1) + 9, sy(ly(f(1))) + 4, '1°：657°/s', 'ts') + text(sx(2) + 9, sy(ly(f(2))) + 4, '2°：328°/s', 'ts') + text(sx(5) + 9, sy(ly(f(5))) + 4, '5°：131°/s', 'ts');
  o += text(sx(10) + 9, sy(ly(f(10))) + 4, '10°：66°/s', 'ts') + text(sx(30), sy(ly(f(30))) - 10, '30°：22°/s', 'ts', 'middle') + text(sx(90), sy(ly(f(90))) - 10, '90°：8°/s', 'ts', 'end');
  o += text(80, 18, 'Joint 2 要转多快（°/s，log scale）', 'tb') + text(520, 278, 'θ₂：离伸直还差多少', 'ts', 'end');
  o += text(sx(45), sy(2.3), 'Tip 沿 arm 方向以 0.1 m/s 外伸', 't', 'middle');
  return svg(560, 288, o, 'Tip 以 0.1 m/s 沿 arm 方向外伸时，joint 2 需要的 velocity 随 elbow angle 变小而急剧上升，elbow angle 为 1° 时要每秒 657°');
}

// 第 4 站：manipulability ellipse
function manip() {
  const S = 62;
  let o = '';
  [[90, '0.618'], [45, '0.341'], [15, '0.117']].forEach(([deg, s2], i) => {
    const x0 = 18 + i * 182, O = [x0 + 18, 196];
    const P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
    const t2 = deg * R, tip = fk2(0, t2), J = J2(0, t2);
    o += arm([[0, 0], [1, 0], tip], P, 'mute', 3.5);
    const k = 0.32, pts = [];
    for (let j = 0; j <= 120; j++) { const a = (2 * Math.PI * j) / 120, c = Math.cos(a), s = Math.sin(a); pts.push(P([tip[0] + k * (J[0][0] * c + J[0][1] * s), tip[1] + k * (J[1][0] * c + J[1][1] * s)])); }
    o += path(d(pts) + 'Z', 'wash ln');
    const B = P([0, 0]), T = P(tip); o += line(B[0], B[1], T[0], T[1], 'dash');
    o += text(x0 + 74, 26, `θ₂ = ${deg}°`, 'tb', 'middle') + text(x0 + 74, 238, `σ₂ = ${s2}`, 'ts', 'middle');
  });
  o += text(280, 260, '虚线是 base 到 tip 的方向：ellipse 最窄的方向始终沿着它，arm 越直越窄', 'ts', 'middle');
  return svg(560, 270, o, '三个 configuration 的 manipulability ellipse：elbow angle 90° 时接近 circle，45° 时变扁，15° 时几乎压成一条 segment，窄的方向沿着 arm');
}

// 第 5 站：两组 IK 解
function ik2() {
  const S = 120, O = [250, 228], P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
  const tip = fk2(30 * R, 90 * R);
  let o = line(P([-1.3, 0])[0], O[1], P([1.6, 0])[0], O[1], 'grid');
  o += line(O[0], O[1], P(tip)[0], P(tip)[1], 'dash');
  o += arm([[0, 0], [Math.cos(30 * R), Math.sin(30 * R)], tip], P, 'ln', 4);
  o += arm([[0, 0], [Math.cos(120 * R), Math.sin(120 * R)], tip], P, 'ink-b', 4);
  const e1 = P([Math.cos(30 * R), Math.sin(30 * R)]), e2 = P([Math.cos(120 * R), Math.sin(120 * R)]);
  o += text(e1[0] + 10, e1[1] + 4, 'elbow-up：(30°, 90°)', 'tl') + text(e2[0] - 10, e2[1] + 4, 'elbow-down：(120°, −90°)', 'tb', 'end');
  o += text(P(tip)[0] + 10, P(tip)[1] - 4, '目标 (0.366, 1.366)', 't');
  o += text(O[0], O[1] + 20, 'base', 'ts', 'middle');
  return svg(560, 262, o, '同一个目标点的两组 IK solution：elbow-up 是 30 度、90 度，elbow-down 是 120 度、负 90 度，两条 arm 关于 base 到目标的连线对称');
}

// 第 5 站：Newton IK 的 basin of attraction
function basin() {
  const xd = fk2(30 * R, 90 * R);
  const N = 120, x0 = 70, y0 = 30, W = 300;
  const cell = W / N;
  const wrap = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
  const solve = (t1, t2) => {
    for (let k = 0; k < 40; k++) {
      const f = fk2(t1, t2), e = [xd[0] - f[0], xd[1] - f[1]];
      if (Math.hypot(e[0], e[1]) < 1e-10) break;
      const J = J2(t1, t2), det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      if (Math.abs(det) < 1e-12) return 0;
      t1 += (J[1][1] * e[0] - J[0][1] * e[1]) / det; t2 += (-J[1][0] * e[0] + J[0][0] * e[1]) / det;
    }
    const f = fk2(t1, t2); if (Math.hypot(xd[0] - f[0], xd[1] - f[1]) > 1e-6) return 0;
    return wrap(t2 / R) > 0 ? 1 : 2;
  };
  let o = '';
  const cls = ['', 'wash-strong', 'band-n'], dd = ['', '', ''];
  const f2 = (v) => (Math.round(v * 100) / 100).toString();
  for (let j = 0; j < N; j++) {
    const t2 = 180 - (j + 0.5) * (360 / N);
    let run = -1, start = 0;
    for (let i = 0; i <= N; i++) {
      const c = i < N ? solve((-180 + (i + 0.5) * (360 / N)) * R, t2 * R) : -2;
      if (c !== run) { if (run > 0) dd[run] += `M${f2(x0 + start * cell)} ${f2(y0 + j * cell)}h${f2((i - start) * cell + 0.3)}v${f2(cell + 0.3)}h${f2(-((i - start) * cell + 0.3))}Z`; run = c; start = i; }
    }
  }
  o += path(dd[1], cls[1]) + path(dd[2], cls[2]);
  const sx = lin(-180, 180, x0, x0 + W), sy = lin(-180, 180, y0 + W, y0);
  o += rect(x0, y0, W, W, 'frame');
  for (const v of [-180, -90, 0, 90, 180]) o += text(sx(v), y0 + W + 16, v + '°', 'ts', 'middle') + text(x0 - 6, sy(v) + 4, v + '°', 'ts', 'end');
  o += text(x0 + W / 2, y0 + W + 34, 'initial guess θ₁⁰', 'ts', 'middle') + text(x0 - 6, y0 - 10, 'θ₂⁰', 'ts', 'end');
  const mark = (a, b, lab, cl, dx, dy, anc) => { o += circle(sx(a), sy(b), 4.5, cl) + text(sx(a) + dx, sy(b) + dy, lab, 'tb', anc); };
  mark(30, 90, 'A', 'paper', 9, -6, 'start'); mark(120, -90, 'B', 'paper', 9, -6, 'start');
  mark(20, 60, '1', 'ink-f', 8, 14, 'start'); mark(0, 30, '2', 'ink-f', -8, 14, 'end'); mark(0, 45, '3', 'ink-f', -8, -4, 'end');
  const X = 392;
  o += rect(X, 40, 16, 16, 'wash-strong') + text(X + 24, 53, '→ A：elbow-up', 't');
  o += rect(X, 66, 16, 16, 'band-n') + text(X + 24, 79, '→ B：elbow-down', 't');
  o += rect(X, 92, 16, 16, 'paper') + text(X + 24, 105, '40 步内没有 converge', 't');
  o += text(X, 140, '1 = (20°, 60°)：5 步到 A', 'ts') + text(X, 158, '2 = (0°, 30°)：落到 B', 'ts') + text(X, 176, '3 = (0°, 45°)：不 converge', 'ts');
  o += text(X, 210, '目标 (0.366, 1.366)，', 'ts') + text(X, 226, '只给 position', 'ts');
  return svg(560, 372, o, 'Newton IK 从不同 initial guess 出发会 converge 到哪一组解：两种颜色的区域交错，边界附近破碎，有些区域不 converge');
}

// 第 6 站：三种 integrator 的 energy
function energy() {
  const g = 9.81;
  const acc = (t, w) => {
    const c2 = Math.cos(t[1]), s2 = Math.sin(t[1]);
    const M = [[3 + 2 * c2, 1 + c2], [1 + c2, 1]];
    const h = [-s2 * (2 * w[0] * w[1] + w[1] * w[1]) + 2 * g * Math.cos(t[0]) + g * Math.cos(t[0] + t[1]), w[0] * w[0] * s2 + g * Math.cos(t[0] + t[1])];
    const det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
    return [(-M[1][1] * h[0] + M[0][1] * h[1]) / det, (M[1][0] * h[0] - M[0][0] * h[1]) / det];
  };
  const E = (t, w) => { const c2 = Math.cos(t[1]); const K = 0.5 * ((3 + 2 * c2) * w[0] * w[0] + 2 * (1 + c2) * w[0] * w[1] + w[1] * w[1]); return K + g * (2 * Math.sin(t[0]) + Math.sin(t[0] + t[1])); };
  const dt = 0.01, n = 300;
  const run = (m) => {
    let t = [0, 0], w = [0, 0]; const out = [[0, 0, t]];
    for (let k = 1; k <= n; k++) {
      if (m === 0) { const a = acc(t, w); t = [t[0] + dt * w[0], t[1] + dt * w[1]]; w = [w[0] + dt * a[0], w[1] + dt * a[1]]; }
      else if (m === 1) { const a = acc(t, w); w = [w[0] + dt * a[0], w[1] + dt * a[1]]; t = [t[0] + dt * w[0], t[1] + dt * w[1]]; }
      else {
        const f = (x) => { const a = acc([x[0], x[1]], [x[2], x[3]]); return [x[2], x[3], a[0], a[1]]; };
        const x = [t[0], t[1], w[0], w[1]], ad = (u, v, s) => u.map((ui, i) => ui + s * v[i]);
        const k1 = f(x), k2 = f(ad(x, k1, dt / 2)), k3 = f(ad(x, k2, dt / 2)), k4 = f(ad(x, k3, dt));
        const y = x.map((xi, i) => xi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t = [y[0], y[1]]; w = [y[2], y[3]];
      }
      out.push([k * dt, E(t, w), t]);
    }
    return out;
  };
  const runs = [0, 1, 2].map(run);
  // 右：energy 曲线
  const sx = lin(0, 3, 250, 470), sy = lin(-1, 5, 240, 30);
  let o = axes({ sx, sy, x0: 0, x1: 3, y0: -1, y1: 5, xt: [[0, '0'], [1, '1 s'], [2, '2 s'], [3, '3 s']], yt: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5 J']], grid: true });
  const cl = ['ln', 'ink', 'ink-b'];
  for (let m = 0; m < 3; m++) o += path(d(runs[m].map(([x, y]) => [sx(x), sy(y)])), cl[m]);
  const ends = runs.map((r) => r[n][1]);
  o += text(476, sy(ends[0]) + 4, 'explicit Euler', 'tl') + text(476, sy(ends[1]) + 4, 'semi-implicit', 'tb') + text(476, sy(ends[1]) + 18, 'Euler', 'tb') + text(476, sy(ends[2]) + 4, 'RK4', 'tb');
  o += text(250, 18, 'total energy（J），真实值恒为 0', 'tb');
  // 左：三个 integrator 各自算出的 arm，同一个时刻叠在一起
  const u = 48, B = [112, 104], P = ([x, y]) => [B[0] + x * u, B[1] - y * u];
  o += text(B[0], 18, '同一时刻三种算法的 arm', 'tb', 'middle');
  o += line(B[0] - 104, B[1], B[0] + 104, B[1], 'grid');
  // 动图：第 0 帧停在 t = 3 s；之后按真实时间从 t = 0 放到 3 s
  const ks = [n, n]; for (let k = 0; k <= n; k += 2) ks.push(k);
  const tt = [0, 2.8]; for (let i = 2; i < ks.length; i++) tt.push(3.1 + ks[i] * dt);
  const T = tt[tt.length - 1] + 1.4; tt.push(T); ks.push(n);
  const kt = tt.map((v) => v / T);
  for (const m of [1, 0, 2]) {
    const conf = (k) => { const [a1, a2] = runs[m][k][2]; return [[0, 0], [Math.cos(a1), Math.sin(a1)], fk2(a1, a2)]; };
    o += apath(ks.map((k) => d(conf(k).map(P))), kt, T, m === 2 ? 'ink-b' : cl[m]);
    const el = ks.map((k) => P(conf(k)[1])), tp = ks.map((k) => P(conf(k)[2]));
    o += acircle(el.map((q) => q[0]), el.map((q) => q[1]), kt, T, 3.5, 'paper');
    o += acircle(tp.map((q) => q[0]), tp.map((q) => q[1]), kt, T, 3, m === 0 ? 'ln-f' : 'ink-f');
  }
  o += circle(B[0], B[1], 5, 'paper');
  o += text(B[0], 230, '从水平伸直处松手，τ = 0，Δt = 0.01 s', 'ts', 'middle');
  o += text(B[0], 254, '彩色 explicit Euler，细线 semi-implicit，', 'ts', 'middle') + text(B[0], 270, '粗线 RK4（与真实解几乎重合）', 'ts', 'middle');
  o += apath(ks.map((k) => `M${f1(sx(k * dt))} 30V240`), kt, T, 'dash');
  for (let m = 0; m < 3; m++) o += acircle(ks.map((k) => sx(k * dt)), ks.map((k) => sy(runs[m][k][1])), kt, T, 4, m === 0 ? 'ln-f' : 'ink-f');
  return svgA(560, 286, o, '动图：同一个无 friction 的 2R arm 从水平伸直处松手自由下摆。左边是三种 integrator 在同一时刻算出的 arm，右边是 total energy：explicit Euler 的 energy 一路上升到 4.6 J，arm 越摆越高；semi-implicit Euler 时升时降；RK4 几乎保持为 0');
}

// 第 7 站：cubic、quintic、trapezoid 的 velocity 与 acceleration
function profiles() {
  const D = 90, T = 2;
  const cub = { v: (t) => (6 * t / T ** 2 - 6 * t * t / T ** 3) * D, a: (t) => (6 / T ** 2 - 12 * t / T ** 3) * D };
  const qui = { v: (t) => { const s = t / T; return (30 * s * s - 60 * s ** 3 + 30 * s ** 4) * D / T; }, a: (t) => { const s = t / T; return (60 * s - 180 * s * s + 120 * s ** 3) * D / T ** 2; } };
  const tr = { v: (t) => (t < 0.5 ? 120 * t : t > 1.5 ? 120 * (2 - t) : 60), a: (t) => (t < 0.5 ? 120 : t > 1.5 ? -120 : 0) };
  const sx = lin(-0.2, 2.2, 80, 420);
  let o = '';
  const panel = (sy, y0, y1, yt, key, title) => {
    o += axes({ sx, sy, x0: -0.2, x1: 2.2, y0, y1, xt: [[0, '0'], [1, '1'], [2, '2 s']], yt, grid: true });
    if (y0 < 0) o += line(sx(-0.2), sy(0), sx(2.2), sy(0), 'axis');
    const draw = (P, cls) => {
      const pts = [[sx(-0.2), sy(0)], [sx(0), sy(0)]];
      for (let i = 0; i <= 400; i++) { const t = (2 * i) / 400; pts.push([sx(t), sy(P[key](Math.min(Math.max(t, 1e-9), 2 - 1e-9)))]); }
      pts.push([sx(2), sy(0)], [sx(2.2), sy(0)]);
      return path(d(pts), cls);
    };
    o += draw(cub, 'ln') + draw(qui, 'ink-b') + draw(tr, 'dash');
    o += text(80, sy(y1) - 10, title, 'tb');
  };
  const sv = lin(0, 90, 145, 35), sa = lin(-150, 150, 330, 190);
  panel(sv, 0, 90, [[0, '0'], [30, '30'], [60, '60'], [90, '90']], 'v', 'velocity（°/s）');
  panel(sa, -150, 150, [[-135, '−135'], [0, '0'], [135, '135']], 'a', 'acceleration（°/s²）');
  o += text(250, 360, '同样 90°、同样 2 s。t < 0 和 t > 2 时 joint 静止', 'ts', 'middle');
  // 右栏：三个 joint 按各自的 profile 转 90°，tip 上的箭头是 angular acceleration（长度 ∝ θ̈）
  const pos = (P, t) => { // 数值积分 velocity 得到 angle（°）
    if (t <= 0) return 0; if (t >= 2) return 90;
    let a = 0; const m = 200; for (let i = 0; i < m; i++) a += P.v((t * (i + 0.5)) / m) * (t / m); return a;
  };
  const acc_ = (P, t) => (t <= 0 || t >= 2 ? 0 : P.a(Math.min(Math.max(t, 1e-9), 2 - 1e-9)));
  // 动图：第 0 帧停在 t = 0.04 s（刚起步：cubic 的箭头已经满长，quintic 几乎为 0）；之后 t 从 −0.3 走到 2.3 s，慢放 2 倍
  const ts = [0.04, 0.04]; for (let t = -0.3; t <= 2.3 + 1e-9; t += 0.02) ts.push(Math.round(t * 100) / 100);
  const tt = [0, 3]; for (let i = 2; i < ts.length; i++) tt.push(3.3 + 2 * (ts[i] + 0.3));
  const TA = tt[tt.length - 1] + 0.8; tt.push(TA); ts.push(2.3);
  const kt = tt.map((v) => v / TA);
  o += apath(ts.map((t) => `M${f1(sx(t))} 35V145M${f1(sx(t))} 190V330`), kt, TA, 'mute');
  const rows = [[cub, 'ln', 'cubic', 'peak v 67.5，a 135'], [qui, 'ink-b', 'quintic', 'peak v 84.4，a 129.9'], [tr, 'dash', 'trapezoid', 'peak v 60，a 120']];
  const L = 52, X = 452;
  rows.forEach(([Pf, cls, name, pk], r) => {
    const py = 112 + r * 116;
    o += line(X, py - 86, X + 22, py - 86, cls) + text(X + 28, py - 82, name, 'tb') + text(X, py - 66, pk, 'ts');
    const arc = []; for (let k = 0; k <= 30; k++) { const a = (k / 30) * Math.PI / 2; arc.push([X + L * Math.cos(a), py - L * Math.sin(a)]); }
    o += path(d(arc), 'grid');
    const tip = (t) => { const a = pos(Pf, t) * R; return [X + L * Math.cos(a), py - L * Math.sin(a), a]; };
    o += apath(ts.map((t) => { const [x, y] = tip(t); return d([[X, py], [x, y]]); }), kt, TA, cls === 'dash' ? 'ink-b' : cls);
    // acceleration 箭头：沿 tip 的切线方向（逆时针为正），长度 40 px 对应 135 °/s²
    o += apath(ts.map((t) => {
      const [x, y, a] = tip(t), A = acc_(Pf, t), len = (40 * A) / 135;
      if (Math.abs(len) < 2) return `M${f1(x)} ${f1(y)}`;
      const ux = -Math.sin(a) * Math.sign(len), uy = -Math.cos(a) * Math.sign(len), Lm = Math.abs(len);
      const ex = x + ux * Lm, ey = y + uy * Lm, hx = ex - ux * 6, hy = ey - uy * 6;
      return `M${f1(x)} ${f1(y)}L${f1(ex)} ${f1(ey)}M${f1(hx - uy * 4)} ${f1(hy + ux * 4)}L${f1(ex)} ${f1(ey)}L${f1(hx + uy * 4)} ${f1(hy - ux * 4)}`;
    }), kt, TA, cls === 'ln' ? 'ln' : 'ink');
    o += circle(X, py, 4, 'paper');
  });
  return svgA(600, 370, o, '动图：三种 time scaling 让一个 joint 在 2 秒内转 90 度。左边是 velocity 和 acceleration 曲线，竖线是当前时刻；右边三个 joint 同步转动，tip 上的箭头是 angular acceleration。Cubic 一起步箭头就是满长（acceleration 从零跳到 135），quintic 的箭头从零慢慢长出来，trapezoid 的箭头在 0、0.5、1.5、2 s 四处突然出现或消失');
}

// 第 7 站：Cartesian 直线经过 base 附近
function cartline() {
  const h = 0.1, v = 0.5;
  const ik = (x, y) => { const Dd = (x * x + y * y - 2) / 2; const t2 = Math.atan2(Math.sqrt(Math.max(0, 1 - Dd * Dd)), Dd); return [Math.atan2(y, x) - Math.atan2(Math.sin(t2), 1 + Math.cos(t2)), t2]; };
  const wrapd = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const rateAt = (x) => { const e = 1e-4; return Math.abs(wrapd(ik(x + e, h)[0] - ik(x - e, h)[0])) / (2 * e) * v; };
  const S = 58, O = [140, 150], P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
  let o = '';
  const circ = []; for (let i = 0; i <= 120; i++) { const a = (2 * Math.PI * i) / 120; circ.push(P([2 * Math.cos(a), 2 * Math.sin(a)])); }
  o += path(d(circ) + 'Z', 'wash');
  // joint space 直线的末端轨迹
  const qa = ik(-1, h), qb = ik(1, h);
  if (qb[0] > qa[0]) qb[0] -= 2 * Math.PI;
  const js = []; for (let i = 0; i <= 100; i++) { const s = i / 100; js.push(P(fk2(qa[0] + s * (qb[0] - qa[0]), qa[1] + s * (qb[1] - qa[1])))); }
  o += path(d(js), 'dash');
  for (const x of [-1, 1]) { const q = ik(x, h); o += arm([[0, 0], [Math.cos(q[0]), Math.sin(q[0])], [x, h]], P, 'mute', 3); }
  o += line(P([-1, h])[0], P([-1, h])[1], P([1, h])[0], P([1, h])[1], 'ln');
  o += text(P([-1, h])[0] - 4, P([-1, h])[1] + 18, 'A', 'tb', 'middle') + text(P([1, h])[0] + 4, P([1, h])[1] + 18, 'B', 'tb', 'middle');
  o += text(O[0], 24, 'Tip 走 y = 0.1 的 straight line（彩线）', 'tb', 'middle');
  o += text(O[0], 280, '虚线：joint space straight line 时 tip 的 path', 'ts', 'middle');
  // 右图：θ̇1 随 x
  const sx = lin(-1, 1, 330, 530), sy = lin(0, 6, 240, 50);
  o += axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 6, xt: [[-1, '−1'], [0, '0'], [1, '1']], yt: [[0, '0'], [2, '2'], [4, '4'], [6, '6']], grid: true });
  const pts = []; const n = 800;
  let prev = ik(-1, h)[0];
  for (let i = 1; i <= n; i++) { const x = -1 + (2 * i) / n; let q = ik(x, h)[0]; while (q - prev > Math.PI) q -= 2 * Math.PI; while (q - prev < -Math.PI) q += 2 * Math.PI; const rate = Math.abs(q - prev) / ((2 / n) / v); pts.push([sx(x - 1 / n), sy(rate)]); prev = q; }
  o += path(d(pts), 'ln');
  o += text(sx(0) - 8, sy(5.4), 'peak 5 rad/s', 'tl', 'end') + text(sx(0) - 8, sy(5.4) + 15, '= 287°/s', 'tl', 'end');
  o += text(310, 30, 'Joint 1 的 velocity（rad/s）', 'tb') + text(530, 274, 'Tip 的 x（m）', 'ts', 'end');
  // 动图：tip 以 0.5 m/s 从 A 走到 B（真实时间 4 s）。取样点在 joint 1 转得快的地方加密（每步 joint 1 不超过 2°）
  const xs = [-1];
  while (xs[xs.length - 1] < 1 - 1e-12) {
    const x0 = xs[xs.length - 1]; let dx = Math.min(0.02, 1 - x0);
    while (dx > 1e-4 && Math.abs(wrapd(ik(x0 + dx, h)[0] - ik(x0, h)[0])) > 2 * R) dx /= 2;
    xs.push(x0 + dx);
  }
  const seq = [0, 0, -1, ...xs, 1];
  const tt = [0, 2.8, 3.1, ...xs.map((x) => 3.5 + (x + 1) / v)];
  const T = tt[tt.length - 1] + 1.2; tt.push(T);
  const kt = tt.map((t) => t / T);
  const conf = (x) => { const q = ik(x, h); return [[0, 0], [Math.cos(q[0]), Math.sin(q[0])], [x, h]]; };
  o += apath(seq.map((x) => d(conf(x).map(P))), kt, T, 'ink-b');
  o += circle(...P([0, 0]), 5, 'paper');
  const el = seq.map((x) => P(conf(x)[1])), tp = seq.map((x) => P([x, h]));
  o += acircle(el.map((q) => q[0]), el.map((q) => q[1]), kt, T, 4, 'paper');
  o += acircle(tp.map((q) => q[0]), tp.map((q) => q[1]), kt, T, 3.5, 'ln-f');
  o += acircle(seq.map((x) => sx(x)), seq.map((x) => sy(rateAt(x))), kt, T, 5, 'ln-f');
  o += apath(seq.map((x) => `M${f1(sx(x))} ${f1(sy(rateAt(x)) + 6)}V240`), kt, T, 'dash');
  return svgA(560, 292, o, '动图：2R arm 的 tip 以 0.5 m/s 沿离 base 0.1 m 的 straight line 从 A 走到 B，经过 base 旁时 arm 几乎折叠、joint 1 在零点几秒内甩过大半圈；右图的点同步显示 joint 1 的 velocity，在 x 等于 0 处尖起到 5 rad/s。虚线是 joint space straight line 对应的 tip path，远离 base');
}

// ---------- 开头三次事故 ----------
const eulerZYX = (M) => [Math.atan2(M[1][0], M[0][0]) / R, Math.atan2(-M[2][0], Math.hypot(M[0][0], M[1][0])) / R, Math.atan2(M[2][1], M[2][2]) / R];
const mul3 = (A, B) => A.map((r, i) => B[0].map((_, j) => r.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
const Rx3 = (a) => [[1, 0, 0], [0, Math.cos(a), -Math.sin(a)], [0, Math.sin(a), Math.cos(a)]];
const Ry3 = (a) => [[Math.cos(a), 0, Math.sin(a)], [0, 1, 0], [-Math.sin(a), 0, Math.cos(a)]];
function pitch88() {
  const sx = lin(-1, 1, 80, 380), sy = lin(-35, 95, 250, 30);
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: -35, y1: 95, xt: [[-1, '−1°'], [-0.5, '−0.5°'], [0, '0'], [0.5, '0.5°'], [1, '1°']], yt: [[-30, '−30°'], [0, '0'], [30, '30°'], [60, '60°'], [90, '90°']], xAt: -35, grid: true, xl: 'wrist 真实转过的 angle' });
  const ser = (k, cls) => { const pts = []; for (let i = 0; i <= 200; i++) { const e = -1 + 2 * i / 200; pts.push([sx(e), sy(eulerZYX(mul3(Rx3(e * R), Ry3(88 * R)))[k])]); } return [path(d(pts), cls), pts]; };
  const [pb] = ser(1, 'ink-b'), [pa, A] = ser(0, 'ln'), [pg] = ser(2, 'ln-dash');
  o += pb + pg + pa;
  const a0 = eulerZYX(mul3(Rx3(-1 * R), Ry3(88 * R)))[0], a1 = eulerZYX(mul3(Rx3(1 * R), Ry3(88 * R)))[0];
  o += text(392, sy(88) + 4, 'pitch ≈ 88°', 'tb', 'start');
  o += text(392, A[200][1] - 4, 'yaw ' + a1.toFixed(1) + '°', 'tl', 'start') + text(392, A[200][1] + 12, 'roll（虚线）几乎相同', 'ts', 'start');
  o += text(392, A[0][1] + 4, '起点 ' + a0.toFixed(1).replace('-', '−') + '°', 'ts', 'start');
  o += line(380, A[0][1], 388, A[0][1], 'mute');
  return svg(560, 296, o, 'Pitch 在 88 度附近时，wrist 真实转动 2 度，读出的 yaw 和 roll 各从负 26.6 度变到正 26.6 度');
}
function stretch() {
  const u = 105;
  let o = '';
  const panel = (x0, t2d, title) => {
    const t2 = t2d * R, t1 = -t2 / 2, P = ([x, y]) => [x0 + x * u, 112 - y * u];
    const e = [Math.cos(t1), Math.sin(t1)], tip = fk2(t1, t2);
    let q = text(x0 + 110, 24, title, 'tb', 'middle');
    q += line(x0 - 6, 112, x0 + 2.05 * u, 112, 'grid');
    q += arm([[0, 0], e, tip], P);
    const T = P(tip);
    q += arrow(T[0], T[1], T[0] + 40, T[1], 'ln') + text(T[0] + 20, T[1] - 9, '0.1 m/s', 'tl', 'middle');
    const rate = 0.1 / Math.sin(t2 / 2) / R;
    q += text(x0 + 110, 228, 'joint 2 要 ' + rate.toFixed(rate < 20 ? 1 : 0) + '°/s', 'tb', 'middle');
    return [q, P(e)];
  };
  const [a, E1] = panel(30, 90, 'elbow 弯 90°'), [b, E2] = panel(300, 2, 'elbow 只差 2° 伸直');
  o += a + b;
  o += text(E1[0], E1[1] + 22, 'θ₂ = 90°', 'ts', 'middle') + text(E2[0], E2[1] + 22, 'θ₂ = 2°', 'ts', 'middle');
  o += text(280, 258, 'tip 沿 base 到 tip 的方向往外伸；要的 tip velocity 一样，joint velocity 差了四十倍。', 'ts', 'middle');
  return svg(560, 270, o, '2R arm 两个姿态：elbow 弯 90 度时 joint 2 只需 8.1 度每秒，elbow 差 2 度伸直时需要 328 度每秒');
}
function ikjump() {
  const u = 135, P = ([x, y]) => [70 + x * u, 200 - y * u];
  let o = '';
  const r = Math.SQRT2, arc = [];
  for (let k = 0; k <= 40; k++) { const a = (25 + 25 * k / 40) * R; arc.push(P([r * Math.cos(a), r * Math.sin(a)])); }
  o += path(d(arc), 'mute') + text(arc[0][0] + 6, arc[0][1] + 4, 'radius √2 的 arc', 'ts', 'start');
  // seed
  const s1 = 0, s2 = 30 * R;
  o += path(d([[0, 0], [1, 0], fk2(s1, s2)].map(P)), 'dash') + text(P(fk2(s1, s2))[0] + 6, P(fk2(s1, s2))[1] + 16, 'seed (0°, 30°)', 'ts', 'start');
  const A = [-5.5 * R, 90 * R], B = [85 * R, -90 * R];
  o += arm([[0, 0], [Math.cos(A[0]), Math.sin(A[0])], fk2(...A)], P, 'ink-b');
  o += arm([[0, 0], [Math.cos(B[0]), Math.sin(B[0])], fk2(...B)], P, 'ln');
  const tA = fk2(...A), tB = fk2(...B), gap = Math.hypot(tA[0] - tB[0], tA[1] - tB[1]);
  o += line(P(tA)[0] + 4, P(tA)[1] - 3, P(tA)[0] + 26, P(tA)[1] - 20, 'mute') + text(P(tA)[0] + 30, P(tA)[1] - 22, '两个目标相距 ' + (gap * 100).toFixed(1) + ' cm', 'tb', 'start');
  const e1 = P([Math.cos(A[0]), Math.sin(A[0])]), e2 = P([Math.cos(B[0]), Math.sin(B[0])]);
  o += text(e1[0] + 8, e1[1] + 18, 'polar 39.5° → (−5.5°, 90°)', 't', 'start');
  o += text(e2[0] - 4, e2[1] - 12, 'polar 40° → (85°, −90°)', 'tl', 'start');
  o += circle(...P([0, 0]), 5, 'paper') + text(P([0, 0])[0], P([0, 0])[1] + 22, 'base', 'ts', 'middle');
  o += text(280, 258, '同一个 seed 出发做 Newton IK：目标挪了一点，解从 elbow-up 跳到 elbow-down。', 'ts', 'middle');
  return svg(560, 270, o, 'radius 根号 2 的 arc 上两个相距 1.2 cm 的目标，从同一个 seed 做 Newton IK 得到两组完全不同的 joint angle');
}


// ---------- 开头三次事故：动图 ----------
const Rz3 = (a) => [[Math.cos(a), -Math.sin(a), 0], [Math.sin(a), Math.cos(a), 0], [0, 0, 1]];
// 第一次：gripper 几乎没动，读出来的 yaw、roll 来回甩
function pitch88A() {
  const T = 4, N = 72, kt = [], eps = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); eps.push(Math.sin(2 * Math.PI * i / N)); }
  const Rs = eps.map((e) => mul3(Rx3(e * R), Ry3(88 * R)));
  const E = Rs.map(eulerZYX);
  // 斜二测投影：world z 朝上
  const C = [138, 104], s = 66;
  const Pj = ([x, y, z]) => [C[0] + s * (-0.72 * x + 0.72 * y), C[1] + s * (0.36 * x + 0.36 * y - 0.86 * z)];
  const col = (M, k) => [M[0][k], M[1][k], M[2][k]];
  const add = (a, b, k = 1) => a.map((v, i) => v + k * b[i]);
  const O = [0, 0, 0];
  let o = text(128, 22, 'gripper 的真实 orientation', 'tb', 'middle');
  // world frame：放在左下角，只表示方向
  const W0 = [40, 176], Wv = (v) => [W0[0] + 26 * (-0.72 * v[0] + 0.72 * v[1]), W0[1] + 26 * (0.36 * v[0] + 0.36 * v[1] - 0.86 * v[2])];
  for (const [v, lab, dx, dy] of [[[1, 0, 0], 'x', -6, 12], [[0, 1, 0], 'y', 8, 10], [[0, 0, 1], 'z', 0, -5]]) {
    const b = Wv(v); o += arrow(W0[0], W0[1], b[0], b[1], 'mute', 5) + text(b[0] + dx, b[1] + dy, lab + '<tspan class="sub" dy="3">s</tspan>', 'ts', 'middle');
  }
  // gripper：flange + palm + 两根 finger，都画成有厚度的面；finger 沿 x_b
  const quad = (c, u, v, a, b) => d([add(add(c, u, -a), v, -b), add(add(c, u, a), v, -b), add(add(c, u, a), v, b), add(add(c, u, -a), v, b), add(add(c, u, -a), v, -b)].map(Pj)) + 'Z';
  const shape = (M) => {
    const xb = col(M, 0), yb = col(M, 1), zb = col(M, 2);
    return quad(add(O, xb, -0.62), xb, yb, 0.32, 0.12) + quad(add(O, xb, -0.22), yb, xb, 0.5, 0.08) + quad(add(add(O, yb, -0.42), xb, 0.22), xb, yb, 0.32, 0.06) + quad(add(add(O, yb, 0.42), xb, 0.22), xb, yb, 0.32, 0.06);
  };
  const axisD = (M, k, L, o0 = 0.6) => d([col(M, k).map((v) => v * o0), col(M, k).map((v) => v * L)].map(Pj));
  o += apath(Rs.map(shape), kt, T, 'paper');
  o += apath(Rs.map((M) => axisD(M, 0, 1.3)), kt, T, 'ln');
  const tipX = Pj(col(Rs[0], 0).map((v) => v * 1.3));
  o += text(tipX[0] + 10, tipX[1] + 4, 'x<tspan class="sub" dy="3">b</tspan>', 'tl', 'start');

  // 真实转动的 slider：ε ∈ [−1°, 1°]
  const sx = lin(-1, 1, 48, 208), Y = 262;
  o += line(sx(-1), Y, sx(1), Y, 'axis');
  for (const v of [-1, 0, 1]) o += line(sx(v), Y - 4, sx(v), Y + 4, 'axis') + text(sx(v), Y + 18, (v < 0 ? '−' : '') + Math.abs(v) + '°', 'ts', 'middle');
  o += acircle(eps.map(sx), eps.map(() => Y), kt, T, 6, 'ink-f');
  o += text(128, Y - 14, '绕 x<tspan class="sub" dy="3">s</tspan><tspan dy="-3"> </tspan>真实转过的 angle：只在 ±1° 之间', 'ts', 'middle');
  // 三个 dial
  const dial = (cx, cy, vals, name, cls, hot) => {
    const r = 46;
    let q = circle(cx, cy, r, 'paper');
    for (let a = -180; a < 180; a += 30) {
      const t = (a - 90) * R, r0 = a % 90 === 0 ? r - 9 : r - 5;
      q += line(cx + r0 * Math.cos(t), cy + r0 * Math.sin(t), cx + r * Math.cos(t), cy + r * Math.sin(t), 'axis');
    }
    q += text(cx, cy - r - 8, '0°', 'ts', 'middle') + text(cx + r + 6, cy + 4, '90°', 'ts', 'start');
    // 摆动范围
    const lo = Math.min(...vals), hi = Math.max(...vals);
    if (hot) {
      const arcPts = [];
      for (let k = 0; k <= 30; k++) { const t = ((lo + (hi - lo) * k / 30) - 90) * R; arcPts.push([cx + (r - 14) * Math.cos(t), cy + (r - 14) * Math.sin(t)]); }
      q += path(d(arcPts), 'ln-dash');
    }
    q += `<g>${line(cx, cy, cx, cy - (r - 6), cls)}${animRot(vals, cx, cy, kt, T)}</g>` + circle(cx, cy, 3.5, 'ink-f');
    q += text(cx, cy + r + 18, name, hot ? 'tl' : 'tb', 'middle');
    q += text(cx, cy + r + 34, hot ? '在 ' + lo.toFixed(1).replace('-', '−') + '° 到 +' + hi.toFixed(1) + '° 之间甩' : '一直约 88°', 'ts', 'middle');
    return q;
  };
  o += text(410, 22, '读出的 ZYX Euler angles（= 发给 wrist 三个 joint 的指令）', 'tb', 'middle');
  o += dial(310, 110, E.map((e) => e[0]), 'yaw α', 'ln', true);
  o += dial(420, 110, E.map((e) => e[1]), 'pitch β', 'ink-b', false);
  o += dial(530, 110, E.map((e) => e[2]), 'roll γ', 'ln', true);
  o += text(420, 232, '左边只转了 2°，右边两根指针各甩了约 53°，', 'ts', 'middle') + text(420, 249, 'robot 照着指针转 joint，wrist 就猛甩。', 'ts', 'middle');
  return svgA(600, 292, o, '动图：gripper pitch 约 88 度时绕 x 轴来回转正负 1 度，几乎看不出动；读出的 yaw 和 roll 指针却在正负 26.6 度之间来回甩');
}

// 第二次：tip 匀速往外伸，joint 2 越来越快
function stretchA() {
  const v = 0.1, r = (t2) => 2 * Math.cos(t2 / 2);
  const ths = []; for (let t2 = 90; t2 >= 2 - 1e-9; t2 -= 1) ths.push(t2);
  const ts = ths.map((t2) => (r(t2 * R) - Math.SQRT2) / v), Tm = ts[ts.length - 1];
  const pre = 0.8, post = 1.6, T = pre + Tm + post;
  const kt = [0, ...ts.map((t) => (pre + t) / T), 1];
  const seq = [ths[0], ...ths, ths[ths.length - 1]];
  const rate = (t2) => v / Math.sin(t2 * R / 2) / R; // °/s
  // 左：arm
  const u = 118, B = [36, 108], P = ([x, y]) => [B[0] + x * u, B[1] - y * u];
  const conf = (t2d) => { const t2 = t2d * R, t1 = -t2 / 2; return [[0, 0], [Math.cos(t1), Math.sin(t1)], fk2(t1, t2)]; };
  let o = text(150, 22, 'tip 以 0.1 m/s 沿直线往外走', 'tb', 'middle');
  o += line(B[0] - 10, B[1], B[0] + 2.08 * u, B[1], 'grid');
  o += line(P([Math.SQRT2, 0])[0], B[1] - 5, P([Math.SQRT2, 0])[0], B[1] + 5, 'axis') + line(P([2, 0])[0], B[1] - 5, P([2, 0])[0], B[1] + 5, 'axis');
  o += text(P([Math.SQRT2, 0])[0], B[1] - 10, '√2 m', 'ts', 'middle') + text(P([2, 0])[0], B[1] - 10, '2 m', 'ts', 'middle');
  o += apath(seq.map((t) => d(conf(t).map(P))), kt, T, 'ink-b');
  o += circle(B[0], B[1], 5, 'paper');
  const el = seq.map((t) => P(conf(t)[1])), tp = seq.map((t) => P(conf(t)[2]));
  o += acircle(el.map((p) => p[0]), el.map((p) => p[1]), kt, T, 4, 'paper');
  o += acircle(tp.map((p) => p[0]), tp.map((p) => p[1]), kt, T, 3.5, 'ln-f');
  o += `<text class="ts" text-anchor="middle" x="${f1(el[0][0])}" y="${f1(el[0][1] + 20)}">elbow${anim('x', el.map((p) => f1(p[0])), kt, T)}${anim('y', el.map((p) => f1(p[1] + 20)), kt, T)}</text>`;
  // 右：joint 2 的速度
  const sx = lin(Math.SQRT2, 2, 330, 560), sy = lin(0, 340, 236, 40);
  o += axes({ sx, sy, x0: Math.SQRT2, x1: 2, y0: 0, y1: 340, xt: [[Math.SQRT2, '1.41'], [1.6, '1.6'], [1.8, '1.8'], [2, '2.0']], yt: [0, 100, 200, 300], grid: true, xl: 'tip 到 base 的距离（m）' });
  o += text(330, 28, 'joint 2 要转多快（°/s）', 'tb', 'start');
  const cur = []; for (let t2 = 90; t2 >= 2; t2 -= 0.25) cur.push([sx(r(t2 * R)), sy(rate(t2))]);
  o += path(d(cur), 'ln');
  const px = seq.map((t) => sx(r(t * R))), py = seq.map((t) => sy(rate(t)));
  o += apath(seq.map((t) => d([[330, sy(rate(t))], [sx(r(t * R)), sy(rate(t))]])), kt, T, 'dash');
  o += acircle(px, py, kt, T, 5, 'ln-f');
  o += text(sx(r(90 * R)) + 4, sy(rate(90)) - 26, rate(90).toFixed(1) + '°/s（elbow 90°）', 'ts', 'start');
  o += text(sx(r(2 * R)) - 8, sy(rate(2)) + 4, rate(2).toFixed(0) + '°/s（elbow 差 2°）', 'ts', 'end');
  o += text(150, 252, 'tip 每秒只走 10 cm；elbow 越接近伸直，', 'ts', 'middle') + text(150, 268, 'joint 2 为了同样的 10 cm 要转得越快。', 'ts', 'middle');
  return svgA(600, 284, o, '动图：2R arm 的 tip 以 0.1 m/s 沿直线往外伸，elbow 从 90 度伸到只差 2 度，右边曲线上的点显示 joint 2 的速度从 8.1 度每秒涨到 328 度每秒');
}

// 第三次：目标沿 arc 慢慢走，每一步都从同一个 seed 做 Newton IK
function ikjumpA() {
  const wrap = (a) => ((((a + 180) % 360) + 360) % 360) - 180;
  const solve = (xd) => {
    let t1 = 0, t2 = 30 * R;
    for (let k = 0; k < 60; k++) {
      const f = fk2(t1, t2), e = [xd[0] - f[0], xd[1] - f[1]];
      if (Math.hypot(e[0], e[1]) < 1e-12) break;
      const J = J2(t1, t2), det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
      t1 += (J[1][1] * e[0] - J[0][1] * e[1]) / det; t2 += (-J[1][0] * e[0] + J[0][0] * e[1]) / det;
    }
    return [wrap(t1 / R), wrap(t2 / R)];
  };
  const polars = []; for (let p = 30; p <= 39.5 + 1e-9; p += 0.5) polars.push(p);
  polars.push(40);
  const sols = polars.map((p) => solve([Math.SQRT2 * Math.cos(p * R), Math.SQRT2 * Math.sin(p * R)]));
  const n = polars.length, step = 0.22, hold = 2.4, T = step * (n - 1) + hold + 0.6;
  const kt = [], seq = [];
  polars.forEach((p, i) => { kt.push(step * i / T); seq.push(i); });
  kt.push((step * (n - 1) + hold) / T); seq.push(n - 1);
  kt.push(1); seq.push(n - 1);
  const u = 128, P = ([x, y]) => [60 + x * u, 236 - y * u];
  const conf = ([a, b]) => [[0, 0], [Math.cos(a * R), Math.sin(a * R)], fk2(a * R, b * R)];
  let o = '';
  const arc = []; for (let k = 0; k <= 40; k++) { const a = (24 + 24 * k / 40) * R; arc.push(P([Math.SQRT2 * Math.cos(a), Math.SQRT2 * Math.sin(a)])); }
  o += path(d(arc), 'mute') + text(arc[40][0] - 8, arc[40][1] - 2, 'radius √2 的 arc', 'ts', 'end');
  o += path(d(conf([0, 30]).map(P)), 'dash');
  const sp = P(fk2(0, 30 * R));
  o += text(sp[0] + 8, sp[1] + 5, 'seed (0°, 30°)', 'ts', 'start');
  o += apath(seq.map((i) => d(conf(sols[i]).map(P))), kt, T, 'ink-b', true);
  const els = seq.map((i) => P(conf(sols[i])[1]));
  o += acircle(els.map((p) => p[0]), els.map((p) => p[1]), kt, T, 4, 'paper');
  const tg = seq.map((i) => P([Math.SQRT2 * Math.cos(polars[i] * R), Math.SQRT2 * Math.sin(polars[i] * R)]));
  o += `<circle cx="${f1(tg[0][0])}" cy="${f1(tg[0][1])}" r="6" class="ln-f">${anim('cx', tg.map((p) => f1(p[0])), kt, T, true)}${anim('cy', tg.map((p) => f1(p[1])), kt, T, true)}</circle>`;
  o += circle(...P([0, 0]), 5, 'paper') + text(P([0, 0])[0], P([0, 0])[1] + 22, 'base', 'ts', 'middle');
  // 读数：翻之前 / 翻之后
  const flip = seq.map((i) => i === n - 1);
  const X = 360;
  o += text(X, 40, '目标 polar angle 和 IK 给出的 (θ₁, θ₂)', 'tb', 'start');
  const lineOf = (i) => polars[i].toFixed(1) + '°  →  (' + sols[i].map((v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(1) + '°').join(', ') + ')';
  [0, Math.round((n - 2) / 2), n - 2, n - 1].forEach((i, k) => {
    o += `<text x="${X}" y="${68 + k * 22}" class="${i === n - 1 ? 'tl' : 't'}" text-anchor="start">${lineOf(i)}${ashow(seq.map((j) => j >= i), kt, T)}</text>`;
  });
  o += `<text x="${X}" y="${172}" class="tl" text-anchor="start">目标只挪了 1.2 cm，arm 整个翻过去${ashow(flip, kt, T)}</text>`;
  o += text(X, 206, '每个目标都从同一个 seed 做 Newton IK。', 'ts', 'start') + text(X, 224, '39.5° 和 40° 之间，结果在两组解和', 'ts', 'start') + text(X, 242, '不 converge 之间来回跳（第 5 站）。', 'ts', 'start');
  return svgA(600, 262, o, '动图：目标沿 radius 根号 2 的 arc 从 30 度走到 39.5 度，Newton IK 一直给出 elbow-up 的解；目标再挪到 40 度（只差 1.2 cm），arm 突然翻成 elbow-down');
}

// ---------- 第 1 站 :::wrong：quaternion 中点走哪条路 ----------
function slerpsign() {
  const c = [200, 150], r = 100, P = (a) => [c[0] + r * Math.cos(a * R), c[1] - r * Math.sin(a * R)];
  let o = circle(c[0], c[1], r, 'grid') + circle(c[0], c[1], 3, 'ink-f');
  const arcp = (a0, a1, rr) => { const pts = []; for (let k = 0; k <= 80; k++) { const a = (a0 + (a1 - a0) * k / 80) * R; pts.push([c[0] + rr * Math.cos(a), c[1] - rr * Math.sin(a)]); } return pts; };
  // 长路：170° 经 0° 到 −170°（顺时针 340°）
  const long = arcp(170, -170, r - 16);
  o += path(d(long), 'dash'); const le = long[80], l0 = long[77]; o += arrow(l0[0], l0[1], le[0], le[1], 'ink');
  // 短路：170° 经 180° 到 190°
  const short = arcp(170, 190, r + 14);
  o += path(d(short), 'ln'); const se = short[80], s0 = short[76]; o += arrow(s0[0], s0[1], se[0], se[1], 'ln');
  for (const [a, lab] of [[170, '170°'], [-170, '−170°']]) { const p = P(a); o += line(c[0], c[1], p[0], p[1], 'ink') + circle(p[0], p[1], 4, 'ink-f') + text(c[0] + (r + 30) * Math.cos(a * R), c[1] - (r + 30) * Math.sin(a * R) + 4, lab, 'tb', 'end'); }
  const m0 = P(0), m1 = P(180);
  o += circle(m0[0], m0[1], 4, 'paper') + text(m0[0] + 22, m0[1] + 4, '0°', 'ts', 'start');
  o += circle(m1[0], m1[1], 4, 'ln-f');
  o += text(340, 70, '直接取中点：', 't', 'start') + text(340, 88, '落在 0°，走 340°（虚线）', 'ts', 'start');
  o += text(340, 128, '先把 q₂ 换成 −q₂：', 'tl', 'start') + text(340, 146, '落在 180°，走 20°（彩色）', 'ts', 'start');
  o += text(340, 186, 'q₁ · q₂ = −0.985 < 0', 'ts', 'start') + text(340, 202, '就要先翻 sign', 'ts', 'start');
  o += text(c[0], 284, '俯视 gripper 绕 ẑ 的 yaw', 'ts', 'middle');
  return svg(560, 296, o, 'Gripper 从 170 度转到负 170 度：直接对 quaternion 取中点会经过 0 度绕 340 度；先翻转 q2 的 sign，经过 180 度只走 20 度');
}

// ---------- 第 2 站：左乘与右乘 ----------
function tfmove() {
  const p = [0.616, 1.799], ph = 60;
  let o = '';
  // (a) Trans(0.1, 0)
  const u = 900, A = ([x, y]) => [120 + (x - p[0]) * u, 190 - (y - p[1]) * u];
  o += text(140, 24, '(a) 沿 x̂ 移动 0.1 m', 'tb', 'middle');
  o += arrow(...A(p), A(p)[0] + 30 * Math.cos((ph + 90) * R), A(p)[1] - 30 * Math.sin((ph + 90) * R), 'mute') + text(A(p)[0] + 34 * Math.cos((ph + 90) * R) - 4, A(p)[1] - 34 * Math.sin((ph + 90) * R), 'ŷₑ', 'ts', 'end') + circle(...A(p), 4, 'ink-f');
  o += text(A(p)[0] - 10, A(p)[1] + 18, '(0.616, 1.799)', 'ts', 'end');
  const rB = [p[0] + 0.1 * Math.cos(ph * R), p[1] + 0.1 * Math.sin(ph * R)], rS = [p[0] + 0.1, p[1]];
  o += arrow(...A(p), ...A(rB), 'ln') + circle(...A(rB), 4, 'ln-f') + text(A(rB)[0] - 8, A(rB)[1] - 20, 'T·Trans（沿 x̂ₑ）', 'tl', 'end') + text(A(rB)[0] - 8, A(rB)[1] - 5, '(0.666, 1.886)', 'tl', 'end');
  o += arrow(...A(p), ...A(rS), 'ink') + circle(...A(rS), 4, 'ink-f') + text(A(rS)[0] - 6, A(rS)[1] + 20, 'Trans·T：(0.716, 1.799)', 't', 'middle');
  o += arrow(190, 236, 222, 236, 'mute') + text(226, 240, 'x̂ₛ', 'ts', 'start');
  // (b) Rot(90°)
  const v = 55, B = ([x, y]) => [450 + x * v, 196 - y * v], rot = ([x, y]) => [-y, x];
  o += text(420, 24, '(b) 转 90°', 'tb', 'middle');
  const J = [[0, 0], [0.866, 0.5], [0.366, 1.366], p];
  o += path(d(J.map(B)), 'mute') + path(d(J.map(rot).map(B)), 'mute');
  const arc = []; const r0 = Math.hypot(...p), a0 = Math.atan2(p[1], p[0]);
  for (let k = 0; k <= 40; k++) { const a = a0 + Math.PI / 2 * k / 40; arc.push(B([r0 * Math.cos(a), r0 * Math.sin(a)])); }
  o += path(d(arc), 'dash') + arrow(arc[37][0], arc[37][1], arc[40][0], arc[40][1], 'ink');
  o += frameAx(B(p), 150 * R, 30, 'ln', '', '') + circle(...B(p), 4, 'ln-f');
  o += text(B(p)[0] + 10, B(p)[1] - 2, 'T·Rot', 'tl', 'start') + text(B(p)[0] + 10, B(p)[1] + 14, '原地转', 'tl', 'start');
  const q = rot(p);
  o += frameAx(B(q), 150 * R, 30, 'ink', '', '') + circle(...B(q), 4, 'ink-f');
  o += line(B(q)[0], B(q)[1] + 6, B(q)[0] - 16, B(q)[1] + 52, 'mute') + text(B(q)[0] - 20, B(q)[1] + 66, 'Rot·T：(−1.799, 0.616)', 't', 'middle');
  o += circle(...B([0, 0]), 4, 'paper') + text(B([0, 0])[0] + 8, B([0, 0])[1] + 16, 'base', 'ts', 'start');
  o += text(280, 272, '灰线是 arm。右乘的 transform 在 gripper frame 里描述，左乘的在 base frame 里描述。', 'ts', 'middle');
  return svg(560, 284, o, '左：右乘 Trans 沿 gripper 的 x 轴走，左乘沿 base 的 x 轴走。右：右乘 Rot 让 gripper 原地转，左乘让整条 arm 绕 base 转到 (-1.799, 0.616)');
}

// ---------- 第 4 站：statics 的 moment arm ----------
function statics() {
  const u = 150, P = ([x, y]) => [130 + x * u, 290 - y * u];
  const t1 = 30 * R, t2 = 90 * R, e = [Math.cos(t1), Math.sin(t1)], tip = fk2(t1, t2), F = 10;
  let o = line(...P([-0.4, 0]), ...P([1.2, 0]), 'grid');
  o += arm([[0, 0], e, tip], P);
  const T = P(tip);
  o += arrow(T[0], T[1], T[0], T[1] - 60, 'ln') + text(T[0] + 8, T[1] - 50, 'F = (0, 10) N', 'tl', 'start');
  o += line(T[0], T[1], T[0], P([0, -0.24])[1], 'dash');
  const y1 = -0.18, y2 = -0.18;
  const dim = (xa, xb, y, lab) => line(...P([xa, y]), ...P([xb, y]), 'ink') + line(P([xa, y])[0], P([xa, y])[1] - 5, P([xa, y])[0], P([xa, y])[1] + 5, 'ink') + line(P([xb, y])[0], P([xb, y])[1] - 5, P([xb, y])[0], P([xb, y])[1] + 5, 'ink') + text((P([xa, y])[0] + P([xb, y])[0]) / 2, P([xa, y])[1] + 16, lab, 'ts', 'middle');
  o += line(...P([0, 0]), ...P([0, y1 - 0.06]), 'mute') + line(...P(e), ...P([e[0], y2 - 0.06]), 'mute');
  o += dim(0, tip[0], y1, tip[0].toFixed(3) + ' m');
  o += dim(tip[0], e[0], y2, (e[0] - tip[0]).toFixed(1) + ' m');
  o += text(P([0, 0])[0] - 10, P([0, 0])[1] + 4, 'joint 1', 'ts', 'end') + text(P(e)[0] + 10, P(e)[1] + 4, 'joint 2', 'ts', 'start');
  o += text(370, 170, 'τ₁ = +' + (tip[0] * F).toFixed(2) + ' N·m', 'tb', 'start') + text(370, 188, 'tip 在 joint 1 右边', 'ts', 'start');
  o += text(370, 226, 'τ₂ = ' + ((tip[0] - e[0]) * F).toFixed(1).replace('-', '−') + ' N·m', 'tb', 'start') + text(370, 244, 'tip 在 joint 2 左边', 'ts', 'start');
  return svg(560, 344, o, '2R arm 在 (30°, 90°) 托住 10 N：force 的作用线离 joint 1 有 0.366 m，离 joint 2 有 0.5 m，得 τ = (3.66, −5.0)');
}

// ---------- 第 7 站：via point 的两种 velocity ----------
function via() {
  const seg = (b0, v0, b1, v1, T) => [b0, v0, (3 * (b1 - b0) - (2 * v0 + v1) * T) / T ** 2, (-2 * (b1 - b0) + (v0 + v1) * T) / T ** 3];
  const make = (v) => { const c1 = seg(0, 0, 60, v, 1), c2 = seg(60, v, 90, 0, 1); return { pos: (t) => { const [c, s] = t <= 1 ? [c1, t] : [c2, t - 1]; return c[0] + c[1] * s + c[2] * s * s + c[3] * s ** 3; }, acc: (t) => { const [c, s] = t <= 1 ? [c1, t] : [c2, t - 1]; return 2 * c[2] + 6 * c[3] * s; }, c1, c2 }; };
  const H = make(45), S = make(67.5);
  let o = '';
  const sx = lin(0, 2, 60, 250), sy = lin(0, 100, 220, 50);
  o += text(155, 24, 'θ(t)', 'tb', 'middle') + axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 100, xt: [0, 1, 2], yt: [[0, '0'], [60, '60°'], [90, '90°']], grid: true, xl: 't (s)' });
  o += path(curve(H.pos, 0, 2, sx, sy), 'ink') + path(curve(S.pos, 0, 2, sx, sy), 'ln-dash') + circle(sx(1), sy(60), 4, 'ink-f');
  o += text(sx(1) + 8, sy(60) + 16, 'via (1 s, 60°)', 'ts', 'start');
  const ax = lin(0, 2, 330, 530), ay = lin(-200, 300, 220, 50);
  o += text(430, 24, 'acceleration（°/s²）', 'tb', 'middle') + axes({ sx: ax, sy: ay, x0: 0, x1: 2, y0: -200, y1: 300, xt: [0, 1, 2], yt: [-180, -90, 0, 135, 270].map((v) => [v, String(v).replace('-', '−')]), xl: 't (s)' }) + line(ax(0), ay(0), ax(2), ay(0), 'grid');
  const accPath = (F) => d([[0, F.acc(0)], [1, F.acc(1)]].map(([t, a]) => [ax(t), ay(a)])) + d([[1.0000001, F.acc(1.0000001)], [2, F.acc(2)]].map(([t, a]) => [ax(t), ay(a)]));
  o += path(accPath(H), 'ink') + path(accPath(S), 'ln-dash');
  o += line(ax(1), ay(H.acc(1)), ax(1), ay(H.acc(1.0000001)), 'mute');
  o += text(ax(1) + 6, ay(-165), '跳 ' + Math.round(H.acc(1.0000001) - H.acc(1)) + '°/s²', 'ts', 'start');
  o += text(280, 284, '实线：v = 45°/s（两段平均 slope）；彩色虚线：v = 67.5°/s（cubic spline）', 'ts', 'middle');
  return svg(560, 296, o, '同一组 via point，两种 via velocity：45 度每秒时 acceleration 在 1 秒处跳 180；67.5 度每秒时连续');
}

export default {
  'rb2202-pitch88': pitch88A,
  'rb2202-stretch': stretchA,
  'rb2202-ikjump': ikjumpA,
  'rb2202-slerpsign': slerpsign,
  'rb2202-tfmove': tfmove,
  'rb2202-statics': statics,
  'rb2202-via': via,
  'rb2202-frame': frame,
  'rb2202-gimbal': gimbal,
  'rb2202-chain': chain,
  'rb2202-poe': poe,
  'rb2202-jcols': jcols,
  'rb2202-blowup': blowup,
  'rb2202-manip': manip,
  'rb2202-ik2': ik2,
  'rb2202-basin': basin,
  'rb2202-energy': energy,
  'rb2202-profiles': profiles,
  'rb2202-cartline': cartline,
};
