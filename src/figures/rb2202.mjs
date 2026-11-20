import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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
    let t = [0, 0], w = [0, 0]; const out = [[0, 0]];
    for (let k = 1; k <= n; k++) {
      if (m === 0) { const a = acc(t, w); t = [t[0] + dt * w[0], t[1] + dt * w[1]]; w = [w[0] + dt * a[0], w[1] + dt * a[1]]; }
      else if (m === 1) { const a = acc(t, w); w = [w[0] + dt * a[0], w[1] + dt * a[1]]; t = [t[0] + dt * w[0], t[1] + dt * w[1]]; }
      else {
        const f = (x) => { const a = acc([x[0], x[1]], [x[2], x[3]]); return [x[2], x[3], a[0], a[1]]; };
        const x = [t[0], t[1], w[0], w[1]], ad = (u, v, s) => u.map((ui, i) => ui + s * v[i]);
        const k1 = f(x), k2 = f(ad(x, k1, dt / 2)), k3 = f(ad(x, k2, dt / 2)), k4 = f(ad(x, k3, dt));
        const y = x.map((xi, i) => xi + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t = [y[0], y[1]]; w = [y[2], y[3]];
      }
      out.push([k * dt, E(t, w)]);
    }
    return out;
  };
  const sx = lin(0, 3, 70, 450), sy = lin(-1, 5, 240, 30);
  let o = axes({ sx, sy, x0: 0, x1: 3, y0: -1, y1: 5, xt: [[0, '0'], [1, '1 s'], [2, '2 s'], [3, '3 s']], yt: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5 J']], grid: true });
  const cl = ['ln', 'ink', 'ink-b'];
  const ends = [];
  for (let m = 0; m < 3; m++) { const pts = run(m); o += path(d(pts.map(([x, y]) => [sx(x), sy(y)])), cl[m]); ends.push(pts[n][1]); }
  o += text(456, sy(ends[0]) + 4, 'explicit Euler', 'tl') + text(456, sy(ends[1]) + 4, 'semi-implicit', 'tb') + text(456, sy(ends[1]) + 18, 'Euler', 'tb') + text(456, sy(ends[2]) + 4, 'RK4', 'tb');
  o += text(70, 18, 'total energy（J），真实值恒为 0', 'tb');
  o += text(280, 276, '2R arm 从水平伸直处松手，τ = 0，Δt = 0.01 s', 'ts', 'middle');
  return svg(560, 286, o, '同一个无 friction 的 2R arm 自由下摆，explicit Euler 的 energy 一路上升到 4.6 J，semi-implicit Euler 时升时降，RK4 几乎保持为 0');
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
  const X = 436;
  o += line(X, 60, X + 26, 60, 'ln') + text(X + 32, 64, 'cubic', 't');
  o += line(X, 84, X + 26, 84, 'ink-b') + text(X + 32, 88, 'quintic', 't');
  o += line(X, 108, X + 26, 108, 'dash') + text(X + 32, 112, 'trapezoid', 't');
  o += text(X, 150, 'peak velocity', 'ts') + text(X, 166, '67.5 / 84.4 / 60', 'ts');
  o += text(X, 200, 'peak acceleration', 'ts') + text(X, 216, '135 / 129.9 / 120', 'ts');
  o += text(X, 250, 'Cubic 在 t = 0、2 s', 'ts') + text(X, 266, 'acceleration 跳变', 'ts');
  o += text(250, 360, '同样 90°、同样 2 s。t < 0 和 t > 2 时 joint 静止', 'ts', 'middle');
  return svg(560, 370, o, '三种 time scaling 的 velocity 和 acceleration：cubic 的 acceleration 在两端从零跳到 135，quintic 从零平滑升起，trapezoid 的 peak 最低但 acceleration 在四处跳变');
}

// 第 7 站：Cartesian 直线经过 base 附近
function cartline() {
  const h = 0.1;
  const ik = (x, y) => { const Dd = (x * x + y * y - 2) / 2; const t2 = Math.atan2(Math.sqrt(Math.max(0, 1 - Dd * Dd)), Dd); return [Math.atan2(y, x) - Math.atan2(Math.sin(t2), 1 + Math.cos(t2)), t2]; };
  const S = 58, O = [140, 150], P = ([x, y]) => [O[0] + S * x, O[1] - S * y];
  let o = '';
  const circ = []; for (let i = 0; i <= 120; i++) { const a = (2 * Math.PI * i) / 120; circ.push(P([2 * Math.cos(a), 2 * Math.sin(a)])); }
  o += path(d(circ) + 'Z', 'wash');
  // joint space 直线的末端轨迹
  const qa = ik(-1, h), qb = ik(1, h);
  if (qb[0] > qa[0]) qb[0] -= 2 * Math.PI;
  const js = []; for (let i = 0; i <= 100; i++) { const s = i / 100; js.push(P(fk2(qa[0] + s * (qb[0] - qa[0]), qa[1] + s * (qb[1] - qa[1])))); }
  o += path(d(js), 'dash');
  for (const x of [-1, -0.15, 0.15, 1]) {
    const q = ik(x, h), e = [Math.cos(q[0]), Math.sin(q[0])];
    o += arm([[0, 0], e, [x, h]], P, Math.abs(x) < 0.5 ? 'ink-b' : 'mute', 3);
    if (Math.abs(x) < 0.5) { const pe = P(e); o += x < 0 ? text(pe[0], pe[1] - 12, `x = ${x}`, 'ts', 'middle') : text(pe[0] + 8, pe[1] + 14, `x = ${x}`, 'ts'); }
  }
  o += line(P([-1, h])[0], P([-1, h])[1], P([1, h])[0], P([1, h])[1], 'ln');
  o += text(P([-1, h])[0] - 4, P([-1, h])[1] + 18, 'A', 'tb', 'middle') + text(P([1, h])[0] + 4, P([1, h])[1] + 18, 'B', 'tb', 'middle');
  o += text(O[0], 24, 'Tip 走 y = 0.1 的 straight line（彩线）', 'tb', 'middle');
  o += text(O[0], 280, '虚线：joint space straight line 时 tip 的 path', 'ts', 'middle');
  // 右图：θ̇1 随 x
  const sx = lin(-1, 1, 330, 530), sy = lin(0, 6, 240, 50);
  o += axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 6, xt: [[-1, '−1'], [0, '0'], [1, '1']], yt: [[0, '0'], [2, '2'], [4, '4'], [6, '6']], grid: true });
  const pts = []; const n = 800, v = 0.5;
  let prev = ik(-1, h)[0];
  for (let i = 1; i <= n; i++) { const x = -1 + (2 * i) / n; let q = ik(x, h)[0]; while (q - prev > Math.PI) q -= 2 * Math.PI; while (q - prev < -Math.PI) q += 2 * Math.PI; const rate = Math.abs(q - prev) / ((2 / n) / v); pts.push([sx(x - 1 / n), sy(rate)]); prev = q; }
  o += path(d(pts), 'ln');
  o += text(sx(0) - 8, sy(5.4), 'peak 5 rad/s', 'tl', 'end') + text(sx(0) - 8, sy(5.4) + 15, '= 287°/s', 'tl', 'end');
  o += text(310, 30, 'Joint 1 的 velocity（rad/s）', 'tb') + text(530, 274, 'Tip 的 x（m）', 'ts', 'end');
  return svg(560, 292, o, '左图：2R arm 的 tip 沿离 base 0.1 m 的 straight line 走，经过 base 旁时 arm 几乎折叠；joint space straight line 对应的 tip path 远离 base。右图：joint 1 的 velocity 在 x 等于 0 处尖起，达到 5 rad/s');
}

export default {
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
