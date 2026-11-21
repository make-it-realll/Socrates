import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, anim, ashow, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// 一组 frame 依次出现：第 i 个 group 只在 [kt[i], kt[i+1]) 里可见；静态时只显示第 0 个
const frameG = (i, kts, T, body) => {
  const n = kts.length, on = [], kt = [];
  for (let k = 0; k < n; k++) { kt.push(kts[k]); on.push(k === i); }
  if (kt[kt.length - 1] < 1) { kt.push(1); on.push(on[on.length - 1]); }
  return `<g opacity="${i === 0 ? 1 : 0}">${ashow(on, kt, T)}${body}</g>`;
};

// ---------- 开头：只靠 odometry 绕 4 m 见方的 square ----------
// 每走 1 m 一条 odometry edge；四个 corner 各转 90°，odometry 报 94°。最后加一条 x16 = x0 的 loop closure。
function pgRun(turn = 94) {
  const E = [];
  for (let i = 0; i < 16; i++) E.push({ i, j: i + 1, z: [1, 0, (i % 4 === 3 ? turn : 0) * R], O: [400, 400, 1 / (2 * R) ** 2] });
  E.push({ i: 0, j: 16, z: [0, 0, 0], O: [2500, 2500, 1 / (0.5 * R) ** 2] });
  const X = [[0, 0, 0]];
  for (let k = 0; k < 16; k++) { const [x, y, t] = X[k], z = E[k].z; X.push([x + Math.cos(t) * z[0] - Math.sin(t) * z[1], y + Math.sin(t) * z[0] + Math.cos(t) * z[1], t + z[2]]); }
  const DR = X.map((p) => p.slice());
  const n = 51, hist = [];
  for (let it = 0; it < 12; it++) {
    const H = Array.from({ length: n }, () => Array(n).fill(0)), b = Array(n).fill(0);
    let F = 0;
    for (const e of E) {
      const [xi, yi, ti] = X[e.i], [xj, yj, tj] = X[e.j], [zx, zy, zt] = e.z;
      const c = Math.cos(ti), s = Math.sin(ti), dx = xj - xi, dy = yj - yi, cz = Math.cos(zt), sz = Math.sin(zt);
      const l = [c * dx + s * dy, -s * dx + c * dy];
      const Rz = (v) => [cz * v[0] + sz * v[1], -sz * v[0] + cz * v[1]];
      const er = [...Rz([l[0] - zx, l[1] - zy]), wrap(tj - ti - zt)];
      const a0 = Rz([-c, s]), a1 = Rz([-s, -c]), a2 = Rz([-s * dx + c * dy, -c * dx - s * dy]), b0 = Rz([c, -s]), b1 = Rz([s, c]);
      const Ja = [[a0[0], a1[0], a2[0]], [a0[1], a1[1], a2[1]], [0, 0, -1]], Jb = [[b0[0], b1[0], 0], [b0[1], b1[1], 0], [0, 0, 1]];
      for (let r = 0; r < 3; r++) F += er[r] * e.O[r] * er[r];
      const bl = [[e.i, Ja], [e.j, Jb]];
      for (const [p, Jp] of bl) {
        for (let a = 0; a < 3; a++) { let v = 0; for (let r = 0; r < 3; r++) v += Jp[r][a] * e.O[r] * er[r]; b[3 * p + a] += v; }
        for (const [q, Jq] of bl) for (let a = 0; a < 3; a++) for (let cc = 0; cc < 3; cc++) { let v = 0; for (let r = 0; r < 3; r++) v += Jp[r][a] * e.O[r] * Jq[r][cc]; H[3 * p + a][3 * q + cc] += v; }
      }
    }
    hist.push(F);
    for (let a = 0; a < 3; a++) H[a][a] += 1;
    const M = H.map((row, i) => [...row, -b[i]]);
    for (let i = 0; i < n; i++) { let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r; [M[i], M[p]] = [M[p], M[i]]; for (let r = i + 1; r < n; r++) { const f = M[r][i] / M[i][i]; for (let cc = i; cc <= n; cc++) M[r][cc] -= f * M[i][cc]; } }
    const dx = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let v = M[i][n]; for (let cc = i + 1; cc < n; cc++) v -= M[i][cc] * dx[cc]; dx[i] = v / M[i][i]; }
    let mx = 0;
    for (let k = 0; k < 17; k++) { for (let a = 0; a < 3; a++) X[k][a] += dx[3 * k + a]; mx = Math.max(mx, Math.abs(dx[3 * k]), Math.abs(dx[3 * k + 1])); }
    if (mx < 1e-9) break;
  }
  const TRUE = [];
  for (let k = 0; k <= 16; k++) TRUE.push(k <= 4 ? [k, 0] : k <= 8 ? [4, k - 4] : k <= 12 ? [12 - k, 4] : [0, 16 - k]);
  const err = (P) => Math.max(...P.map((p, k) => Math.hypot(p[0] - TRUE[k][0], p[1] - TRUE[k][1])));
  return { DR, X, TRUE, hist, errDR: err(DR), errX: err(X) };
}
const PG = pgRun();

function drift() {
  const sx = lin(-0.7, 4.7, 30, 300), sy = lin(-0.9, 4.5, 280, 10);
  let o = path(d(PG.TRUE.map(([x, y]) => [sx(x), sy(y)])), 'dash');
  o += path(d(PG.DR.map(([x, y]) => [sx(x), sy(y)])), 'ln');
  PG.DR.forEach(([x, y], i) => { o += circle(sx(x), sy(y), i === 16 ? 4.5 : 3, i === 16 ? 'ink-f' : 'ln-f'); });
  // 每个 corner 画出 robot 的 heading
  for (const k of [4, 8, 12]) { const [x, y, t] = PG.DR[k]; o += arrow(sx(x), sy(y), sx(x) + 26 * Math.cos(t), sy(y) - 26 * Math.sin(t), 'ink', 6); }
  o += circle(sx(0), sy(0), 6, 'paper') + text(sx(0) - 10, sy(0) + 5, 'x₀', 'ts', 'end');
  const e = PG.DR[16];
  o += text(sx(e[0]) + 8, sy(e[1]) + 16, 'x₁₆', 'ts');
  o += line(sx(0), sy(0), sx(e[0]), sy(e[1]), 'ink');
  const X0 = 330;
  o += text(X0, 40, '虚线：真实走过的 square，边长 4 m', 't') + text(X0, 60, '彩色：把 odometry 一段段接起来', 'tl');
  o += text(X0, 100, '每走 1 m 记一次 odometry；', 'ts') + text(X0, 118, '四个 corner 各转了 90°，', 'ts') + text(X0, 136, 'wheel encoder 报的是 94°。', 'ts');
  o += text(X0, 176, `回到起点时，积分出的 position`, 'ts') + text(X0, 194, `离 x₀ 有 ${Math.hypot(e[0], e[1]).toFixed(2)} m，heading 多了 ${((e[2] / R) - 360).toFixed(0)}°。`, 'ts');
  o += text(X0, 234, '小箭头是每个 corner 处', 'ts') + text(X0, 252, '积分出来的 heading。', 'ts');
  return svg(560, 290, o, `只靠 odometry 绕 4 米见方的 square 走一圈：每个 corner 多算 4 度，回到起点时积分出的位置偏离起点 ${Math.hypot(e[0], e[1]).toFixed(2)} 米`);
}

// ---------- 第 1 站：10 格 cyclic corridor 上的 histogram filter（动图） ----------
// door 在 0、1、8 格（rlabbe 第 2 章的 hallway）；sensor 读对的 probability 0.75；
// 命令每步 +1 格，实际走 0、1、2 格的 probability 是 0.1、0.8、0.1；robot 从第 0 格出发。
const DOORS = [1, 1, 0, 0, 0, 0, 0, 0, 1, 0];
function histFrames() {
  const N = 10, pc = 0.75;
  const upd = (b, z) => { const p = b.map((v, i) => v * (DOORS[i] === z ? pc : 1 - pc)); const s = p.reduce((a, c) => a + c, 0); return p.map((v) => v / s); };
  const pred = (b) => { const o = Array(N).fill(0); b.forEach((v, i) => { o[i] += 0.1 * v; o[(i + 1) % N] += 0.8 * v; o[(i + 2) % N] += 0.1 * v; }); return o; };
  let b = upd(Array(N).fill(0.1), 1);
  const F = [{ t: 0, kind: 'update', b, z: 1 }];
  for (let t = 1; t <= 8; t++) { b = pred(b); F.push({ t, kind: 'predict', b }); b = upd(b, DOORS[t]); F.push({ t, kind: 'update', b, z: DOORS[t] }); }
  return F;
}
function corridorA() {
  const F = histFrames();
  const durs = F.map((f, i) => (i === 0 ? 2.6 : f.kind === 'predict' ? 1.1 : 1.5));
  durs[durs.length - 1] = 3.2;
  const T = durs.reduce((a, c) => a + c, 0), kts = [];
  let acc = 0; for (const dd of durs) { kts.push(acc / T); acc += dd; }
  const sx = (i) => 40 + i * 50, W = 44;
  const yC = 40, yB = 250, sy = lin(0, 0.6, yB, 110);
  let o = '';
  // corridor：back wall、door、floor
  o += rect(sx(0) - 3, yC, 10 * 50 + 0, 34, 'wash2');
  for (let i = 0; i < 10; i++) { if (DOORS[i]) o += rect(sx(i) + 8, yC + 4, W - 16, 30, 'solid2', 2); }
  o += line(sx(0) - 3, yC + 34, sx(10) - 3, yC + 34, 'ink');
  for (let i = 0; i < 10; i++) o += text(sx(i) + W / 2, yB + 18, String(i), 'ts', 'middle');
  o += text(sx(0) - 3, yC - 8, '深色是 door。Corridor 首尾相接：第 9 格往前一步是第 0 格。', 'ts');
  o += line(sx(0) - 3, yB, sx(10) - 3, yB, 'axis');
  for (const v of [0.2, 0.4]) o += line(sx(0) - 7, sy(v), sx(10) - 3, sy(v), 'grid') + text(sx(0) - 10, sy(v) + 4, v.toFixed(1), 'ts', 'end');
  F.forEach((f, i) => {
    let g = '';
    const pos = f.t % 10;
    // robot：俯视的 disk 加 heading
    const rx = sx(pos) + W / 2, ry = yC + 54;
    g += circle(rx, ry, 11, 'paper') + line(rx, ry, rx + 11, ry, 'ink-b');
    for (let k = 0; k < 10; k++) {
      const v = f.b[k];
      g += rect(sx(k) + 6, sy(v), W - 12, yB - sy(v), k === pos ? 'solid' : f.kind === 'predict' ? 'wash' : 'wash-strong');
      if (v >= 0.12) g += text(sx(k) + W / 2, sy(v) - 5, v.toFixed(2), 'ts', 'middle');
    }
    const lab = f.kind === 'predict' ? `t = ${f.t}：predict（命令 +1 格）` : `t = ${f.t}：update，读到 ${f.z ? 'door' : 'wall'}`;
    g += text(sx(10) - 3, yC - 8, lab, f.kind === 'predict' ? 'tb' : 'tl', 'end');
    o += frameG(i, kts, T, g);
  });
  o += text(sx(0) - 3, yB + 40, '柱高是 belief；实心那一根是 robot 真实所在的格。', 'ts') + text(sx(0) - 3, yB + 58, 'Predict 把 belief 往右推一格并摊开，update 按读数重新加权。', 'ts');
  return svgA(560, 316, o, '动图：10 格 corridor 上的 histogram filter，从 t 等于 0 到 8 交替 predict 和 update；第一次看到 door 后三个 door 格各 0.19，到 t 等于 8 真实位置第 8 格升到 0.56');
}

// ---------- 第 2 站：1D Kalman update = 两个 Gaussian 相乘 ----------
function gauss() {
  const g = (m, v) => (x) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
  const K = 0.04 / (0.04 + 0.01), mu = 10 + K * (11 - 10), vv = (1 - K) * 0.04;
  const sx = lin(9.3, 11.7, 60, 530), sy = lin(0, 4.8, 220, 30);
  let o = axes({ sx, sy, x0: 9.3, x1: 11.7, y0: 0, y1: 4.8, xt: [9.5, 10, 10.5, 11, 11.5], yt: [] });
  o += path(curve(g(10, 0.04), 9.3, 11.7, sx, sy), 'mute') + path(curve(g(11, 0.01), 9.3, 11.7, sx, sy), 'ink') + path(curve(g(mu, vv), 9.3, 11.7, sx, sy), 'ln');
  o += text(sx(9.62), sy(1.9), 'prior', 'tb') + text(sx(9.62), sy(1.9) + 16, 'N(10, 0.2²)', 'ts');
  o += text(sx(11.12), sy(3.6), 'measurement', 'tb') + text(sx(11.12), sy(3.6) + 16, 'N(11, 0.1²)', 'ts');
  o += text(sx(10.62), sy(4.55), `posterior N(${mu.toFixed(1)}, ${vv.toFixed(3)})`, 'tl', 'end');
  o += line(sx(mu), sy(0), sx(mu), sy(g(mu, vv)(mu)), 'ln-dash');
  o += text(sx(11.7), 252, 'position（m）', 'ts', 'end');
  o += text(60, 270, 'Posterior 落在两者之间，更靠近 variance 小的 measurement；它的 variance 比两者都小。', 'ts');
  return svg(560, 280, o, 'Prior、measurement 和 posterior 三条 Gaussian curve：posterior 的 mean 在 10.8，比两条输入 curve 都窄');
}

// ---------- 第 2 站：position–velocity 的 covariance ellipse ----------
function ellipsePts(m, P, sx, sy, k = 1) {
  const a = P[0][0], b = P[0][1], c = P[1][1], tr = (a + c) / 2, dt = Math.sqrt(((a - c) / 2) ** 2 + b * b);
  const l1 = tr + dt, l2 = tr - dt, th = Math.atan2(l1 - a, b || 1e-12);
  const u = b === 0 ? (a >= c ? [1, 0] : [0, 1]) : [Math.cos(th), Math.sin(th)], v = [-u[1], u[0]];
  const s1 = Math.sqrt(b === 0 ? Math.max(a, c) : l1), s2 = Math.sqrt(b === 0 ? Math.min(a, c) : l2);
  const pts = [];
  for (let i = 0; i <= 72; i++) { const t = (i / 72) * 2 * Math.PI; pts.push([sx(m[0] + k * (s1 * Math.cos(t) * u[0] + s2 * Math.sin(t) * v[0])), sy(m[1] + k * (s1 * Math.cos(t) * u[1] + s2 * Math.sin(t) * v[1]))]); }
  return d(pts) + 'Z';
}
function cv() {
  const P0 = [[0.04, 0], [0, 0.25]], Pb = [[0.29, 0.25], [0.25, 0.25]], Rm = 0.01;
  const S = Pb[0][0] + Rm, K = [Pb[0][0] / S, Pb[1][0] / S], z = 1.3, xb = [1, 1], y = z - xb[0];
  const xp = [xb[0] + K[0] * y, xb[1] + K[1] * y];
  const Pp = [[(1 - K[0]) * Pb[0][0], (1 - K[0]) * Pb[0][1]], [Pb[1][0] - K[1] * Pb[0][0], Pb[1][1] - K[1] * Pb[0][1]]];
  const sx = lin(-0.7, 2.1, 70, 540), sy = lin(0.2, 1.9, 250, 30);
  let o = axes({ sx, sy, x0: -0.7, x1: 2.1, y0: 0.2, y1: 1.9, xt: [[-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5'], [2, '2']], yt: [[0.5, '0.5'], [1, '1'], [1.5, '1.5']], xl: 'position p（m）', yl: 'velocity v（m/s）' });
  o += rect(sx(z - 0.1), sy(1.9), sx(z + 0.1) - sx(z - 0.1), sy(0.2) - sy(1.9), 'wash');
  o += text(sx(z - 0.1) - 6, sy(1.82), 'measurement p = 1.3 ± 0.1', 'ts', 'end');
  o += path(ellipsePts([0, 1], P0, sx, sy), 'mute') + circle(sx(0), sy(1), 3, 'mute-f');
  o += text(sx(0.25), sy(1.62), 't = 0', 'tb', 'start') + text(sx(0.25), sy(1.62) + 15, 'σ_p = 0.2，σ_v = 0.5', 'ts', 'start');
  o += path(ellipsePts(xb, Pb, sx, sy), 'ink') + circle(sx(1), sy(1), 3, 'ink-f');
  o += text(sx(0.34), sy(0.42), 'predict 之后', 'tb', 'start') + text(sx(0.34), sy(0.42) + 15, '被 shear 成斜的', 'ts', 'start');
  o += path(ellipsePts(xp, Pp, sx, sy), 'ln') + circle(sx(xp[0]), sy(xp[1]), 3, 'ln-f');
  o += text(sx(1.52), sy(1.34), 'update 之后', 'tl', 'start') + text(sx(1.52), sy(1.34) + 15, `v 也被拉到 ${xp[1].toFixed(2)}`, 'ts', 'start');
  return svg(560, 290, o, `位置和速度平面上的 1 sigma ellipse：初始 ellipse 竖直；predict 后变成斜的；只测位置的 measurement 把它切窄，速度的估计也从 1 改到 ${xp[1].toFixed(2)}`);
}

// ---------- 第 2 站：EKF 的 linearization：range 测量 ----------
function ekf() {
  const h = (x) => Math.sqrt(x * x + 4), hp = (x) => x / Math.sqrt(x * x + 4);
  let o = '';
  // 左：几何。Landmark 在 (0, 2)，robot 在 x 轴的 track 上
  const gx = lin(-2.2, 4.2, 14, 236), gy = lin(-0.6, 2.6, 230, 40);
  o += line(gx(-2.2), gy(0), gx(4.2), gy(0), 'axis') + text(gx(4.2), gy(0) + 18, 'track', 'ts', 'end');
  o += poly([[gx(0), gy(2) - 9], [gx(0) - 8, gy(2) + 6], [gx(0) + 8, gy(2) + 6]], 'solid2') + text(gx(0) + 12, gy(2) - 2, 'landmark (0, 2)', 'ts');
  o += line(gx(0), gy(2), gx(0), gy(0), 'dash') + text(gx(0) - 4, gy(1), '2 m', 'ts', 'end');
  const rob = (x, cls) => rect(gx(x) - 12, gy(0) - 8, 24, 16, cls, 3);
  o += line(gx(0), gy(2), gx(3), gy(0), 'ln') + rob(3, 'paper') + text(gx(3), gy(0) + 24, 'x = 3', 'ts', 'middle');
  o += text(gx(1.85), gy(1.25), 'z = √(x² + 4)', 'tl', 'start');
  o += rob(1.5, 'wash2') + rob(-1.5, 'wash2') + line(gx(0), gy(2), gx(1.5), gy(0), 'mute') + line(gx(0), gy(2), gx(-1.5), gy(0), 'mute');
  o += text(gx(0), gy(0) + 40, '±1.5 处读到的 range 都是 2.5', 'ts', 'middle');
  // 右：h(x) 与两条 tangent
  const sx = lin(-3.2, 4.6, 290, 550), sy = lin(1.5, 5, 230, 40);
  o += axes({ sx, sy, x0: -3.2, x1: 4.6, y0: 1.5, y1: 5, xt: [[-3, '−3'], [-1.5, '−1.5'], [0, '0'], [1.5, '1.5'], [3, '3']], yt: [2, 3, 4, 5], xl: 'robot position x', yl: 'range z' });
  o += path(curve(h, -3.2, 4.6, sx, sy), 'ink-b');
  const tan = (x0, a, b) => path(d([[sx(a), sy(h(x0) + hp(x0) * (a - x0))], [sx(b), sy(h(x0) + hp(x0) * (b - x0))]]), 'ln-dash');
  o += tan(3, 1.6, 4.5) + circle(sx(3), sy(h(3)), 4, 'ln-f') + text(sx(3) + 6, sy(h(3)) + 18, `slope ${hp(3).toFixed(3)}`, 'ts', 'start');
  o += tan(0, -2.2, 2.2) + circle(sx(0), sy(2), 4, 'ln-f') + text(sx(0), sy(2) + 18, 'slope 0', 'ts', 'middle');
  o += line(sx(-3.2), sy(2.5), sx(4.6), sy(2.5), 'grid') + text(sx(-3.1), sy(2.5) - 6, 'z = 2.5', 'ts', 'start');
  o += circle(sx(-1.5), sy(2.5), 3.5, 'paper') + circle(sx(1.5), sy(2.5), 3.5, 'paper');
  o += text(420, 22, '虚线是 EKF 在 prior mean 处取的 tangent', 'tb', 'middle');
  return svg(560, 280, o, 'EKF 的 linearization：robot 在 track 上，测到一个高 2 米处 landmark 的 range；在 x 等于 3 处 tangent 的 slope 是 0.832，在 x 等于 0 处 slope 为 0');
}

// ---------- 第 3 站：particle filter（动图），100 个 particle，10 m cyclic corridor ----------
// door 区是 [0, 2) 和 [8, 9) m；robot 从 0.5 m 出发，每步命令 +1 m，particle 加 N(0, 0.1²) 的 motion noise；
// sensor 读对的 probability 0.75；systematic resampling。mulberry32 seed 7。
const pDoor = (x) => { x = ((x % 10) + 10) % 10; return x < 2 || (x >= 8 && x < 9) ? 1 : 0; };
function pfRun(seed = 7, N = 100, T = 8, sig = 0.1) {
  const rnd = mulberry32(seed);
  const gauss = () => { const u = Math.max(rnd(), 1e-12), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  let P = Array.from({ length: N }, () => rnd() * 10), truth = 0.5;
  const fr = [];
  for (let t = 0; t <= T; t++) {
    if (t > 0) { truth += 1; P = P.map((x) => (((x + 1 + sig * gauss()) % 10) + 10) % 10); }
    const z = pDoor(truth), w0 = P.map((x) => (pDoor(x) === z ? 0.75 : 0.25)), s = w0.reduce((a, c) => a + c, 0), w = w0.map((v) => v / s);
    fr.push({ t, truth: ((truth % 10) + 10) % 10, z, P: P.slice(), w0 });
    const out = [], r = rnd() / N; let c = w[0], i = 0;
    for (let m = 0; m < N; m++) { const U = r + m / N; while (U > c && i < N - 1) { i++; c += w[i]; } out.push(P[i]); }
    P = out;
    fr[t].near = P.filter((x) => Math.abs(x - fr[t].truth) < 0.5).length;
  }
  return fr;
}
function pfA() {
  const fr = pfRun();
  const durs = fr.map((_, i) => (i === 0 ? 2.6 : 1.5)); durs[durs.length - 1] = 3.2;
  const T = durs.reduce((a, c) => a + c, 0), kts = []; let acc = 0; for (const dd of durs) { kts.push(acc / T); acc += dd; }
  const sx = lin(0, 10, 40, 540), yC = 40, base = 228;
  let o = rect(sx(0), yC, sx(10) - sx(0), 30, 'wash2');
  o += rect(sx(0) + 4, yC + 4, sx(2) - sx(0) - 8, 26, 'solid2', 2) + rect(sx(8) + 4, yC + 4, sx(9) - sx(8) - 8, 26, 'solid2', 2);
  o += line(sx(0), yC + 30, sx(10), yC + 30, 'ink') + line(sx(0), base + 4, sx(10), base + 4, 'axis');
  for (const v of [0, 2, 4, 6, 8, 10]) o += line(sx(v), base + 4, sx(v), base + 8, 'axis') + text(sx(v), base + 22, String(v), 'ts', 'middle');
  o += text(sx(10), base + 38, 'position（m）', 'ts', 'end');
  fr.forEach((f, i) => {
    let g = '';
    const rx = sx(f.truth);
    g += circle(rx, yC + 48, 10, 'paper') + line(rx, yC + 48, rx + 10, yC + 48, 'ink-b');
    // 把 particle 按 0.2 m 一格竖着堆起来
    const cnt = {};
    f.P.map((x, k) => [x, f.w0[k]]).sort((a, b) => a[0] - b[0]).forEach(([x, w]) => {
      const bin = Math.min(49, Math.floor(x / 0.2)), h = (cnt[bin] = (cnt[bin] || 0) + 1);
      g += circle(sx(bin * 0.2 + 0.1), base - (h - 1) * 6.2, w > 0.5 ? 2.8 : 1.6, w > 0.5 ? 'ln-f' : 'mute-f');
    });
    g += text(sx(10), yC - 8, `t = ${f.t}：读到 ${f.z ? 'door' : 'wall'}；resample 后 ${f.near} 个在真实位置 ±0.5 m 内`, 'tb', 'end');
    o += frameG(i, kts, T, g);
  });
  o += text(sx(0), 284, '每个点是一个 particle，同一个 0.2 m 区间里的竖着堆起来。', 'ts') + text(sx(0), 302, '大的彩色点和读数一致，weight 0.75；小的灰点 weight 0.25。', 'ts');
  return svgA(560, 312, o, `动图：100 个 particle 在 10 米的 corridor 上，t 等于 0 时散布各处，随后逐步聚到 robot 的真实位置附近；t 等于 8 时 resample 后有 ${fr[8].near} 个在真实位置正负 0.5 米内`);
}

// ---------- 第 4 站：pose graph，左 dead reckoning，右加 loop closure 后的 Gauss–Newton ----------
function posegraph() {
  let o = '';
  const panel = (x0, P, title, note) => {
    const sx = lin(-0.6, 4.6, x0, x0 + 230), sy = lin(-0.8, 4.4, 262, 32);
    o += path(d(PG.TRUE.map(([x, y]) => [sx(x), sy(y)])), 'dash');
    o += path(d(P.map(([x, y]) => [sx(x), sy(y)])), 'ln');
    P.forEach(([x, y], i) => { o += circle(sx(x), sy(y), i === 0 || i === 16 ? 4.5 : 3, i === 16 ? 'ink-f' : 'ln-f'); });
    o += text(x0 + 115, 18, title, 'tb', 'middle') + text(x0 + 115, 284, note, 'ts', 'middle');
    return { sx, sy };
  };
  const e = PG.DR[16];
  const a = panel(20, PG.DR, 'Dead reckoning：只用 odometry', `终点离起点 ${Math.hypot(e[0], e[1]).toFixed(2)} m`);
  o += text(a.sx(e[0]) + 8, a.sy(e[1]) + 14, 'x₁₆', 'ts') + text(a.sx(-0.5), a.sy(-0.56), 'x₀', 'ts');
  const b = panel(300, PG.X, '加一条 loop closure 后优化', `所有 pose 的最大 error ${PG.errX.toFixed(2)} m`);
  o += line(b.sx(0), b.sy(0), b.sx(0), b.sy(0), 'ink') + text(b.sx(0.15), b.sy(-0.45), 'x₀ 与 x₁₆ 重合', 'ts');
  o += text(280, 304, '虚线是真实 trajectory；每个点是一个 pose node，相邻两个之间是一条 odometry edge', 'ts', 'middle');
  return svg(560, 314, o, `左图只靠 odometry 积分，终点偏离起点 ${Math.hypot(e[0], e[1]).toFixed(2)} 米；右图加入 x16 等于 x0 的 loop closure 并做 Gauss-Newton 后，所有 pose 的最大 error 降到 ${PG.errX.toFixed(2)} 米`);
}

// ---------- 第 5 站：RRT（mulberry32 seed 2）、C-obstacle 与 shortcut（动图） ----------
const WALLS = (gap, c = 3) => [[4.5, 0, 5.5, c - gap / 2], [4.5, c + gap / 2, 5.5, 10]];
const dRect = (p, [x0, y0, x1, y1]) => Math.hypot(Math.max(x0 - p[0], 0, p[0] - x1), Math.max(y0 - p[1], 0, p[1] - y1));
const freeP = (W, p, r = 0.25) => p[0] >= r && p[0] <= 10 - r && p[1] >= r && p[1] <= 10 - r && W.every((Q) => dRect(p, Q) >= r);
const segFree = (W, a, b, eps = 0.02) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / eps); for (let i = 0; i <= n; i++) { const t = i / n; if (!freeP(W, [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])])) return false; } return true; };
function rrtRun(W, seed, start, goal, step = 0.5, pg = 0.05) {
  const rnd = mulberry32(seed), nodes = [{ p: start, par: -1, it: 0 }];
  for (let it = 1; it <= 20000; it++) {
    const q = rnd() < pg ? goal : [rnd() * 10, rnd() * 10];
    let bi = 0, bd = 1e9;
    nodes.forEach((n, i) => { const dd = Math.hypot(n.p[0] - q[0], n.p[1] - q[1]); if (dd < bd) { bd = dd; bi = i; } });
    const n = nodes[bi].p, s = Math.min(step, bd) / (bd || 1), p = [n[0] + (q[0] - n[0]) * s, n[1] + (q[1] - n[1]) * s];
    if (!freeP(W, p) || !segFree(W, n, p)) continue;
    nodes.push({ p, par: bi, it });
    if (Math.hypot(p[0] - goal[0], p[1] - goal[1]) <= step && segFree(W, p, goal)) {
      nodes.push({ p: goal, par: nodes.length - 1, it });
      const P = []; let k = nodes.length - 1; while (k >= 0) { P.unshift(nodes[k].p); k = nodes[k].par; }
      return { it, nodes, path: P };
    }
  }
  return null;
}
const plen = (P) => P.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - P[i][0], p[1] - P[i][1]), 0);
function shortcut(W, P) { const out = [P[0]]; let i = 0; while (i < P.length - 1) { let j = P.length - 1; while (j > i + 1 && !segFree(W, P[i], P[j])) j--; out.push(P[j]); i = j; } return out; }
function rrtA() {
  const W = WALLS(1.4), start = [1, 1], goal = [9, 9];
  const Rr = rrtRun(W, 2, start, goal), sc = shortcut(W, Rr.path);
  const hold0 = 2.4, grow = 7, hold1 = 1.6, hold2 = 3.4, T = hold0 + grow + hold1 + hold2, k0 = hold0 / T, kEnd = (hold0 + grow) / T, kPath = (hold0 + grow + hold1) / T;
  const kAt = (it) => k0 + (it / Rr.it) * (kEnd - k0);
  const sx = lin(0, 10, 20, 290), sy = lin(0, 10, 290, 20);
  let o = rect(sx(0), sy(10), sx(10) - sx(0), sy(0) - sy(10), 'frame');
  for (const [x0, y0, x1, y1] of W) {
    o += rect(sx(x0), sy(y1), sx(x1) - sx(x0), sy(y0) - sy(y1), 'solid2');
    const r = 0.25, pts = [];
    const corners = [[x1, y1, 0], [x0, y1, Math.PI / 2], [x0, y0, Math.PI], [x1, y0, 1.5 * Math.PI]];
    for (const [cx, cy, a0] of corners) for (let k = 0; k <= 8; k++) { const a = a0 + (k / 8) * (Math.PI / 2); pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    pts.push(pts[0]);
    o += path(d(pts.map(([x, y]) => [sx(Math.min(Math.max(x, 0), 10)), sy(Math.min(Math.max(y, 0), 10))])), 'dash');
  }
  // tree 按 sample 的先后长出来
  Rr.nodes.forEach((n) => {
    if (n.par < 0) return;
    const q = Rr.nodes[n.par].p, k = kAt(n.it);
    o += `<line x1="${f1(sx(q[0]))}" y1="${f1(sy(q[1]))}" x2="${f1(sx(n.p[0]))}" y2="${f1(sy(n.p[1]))}" class="mute">${anim('opacity', [1, 0, 1, 1], [0, k0, Math.max(k, k0 + 1e-4), 1], T, true)}</line>`;
  });
  o += `<path d="${d(Rr.path.map(([x, y]) => [sx(x), sy(y)]))}" class="ink-b">${anim('opacity', [1, 0, 1, 1], [0, k0, kEnd, 1], T, true)}</path>`;
  o += `<path d="${d(sc.map(([x, y]) => [sx(x), sy(y)]))}" class="ln">${anim('opacity', [1, 0, 1, 1], [0, k0, kPath, 1], T, true)}</path>`;
  o += circle(sx(start[0]), sy(start[1]), 5, 'ink-f') + circle(sx(goal[0]), sy(goal[1]), 5, 'ln-f');
  o += text(sx(start[0]) + 8, sy(start[1]) + 16, 'start', 'ts') + text(sx(goal[0]) - 8, sy(goal[1]) - 9, 'goal', 'ts', 'end');
  const tx = 312;
  o += text(tx, 36, 'RRT（seed 2）', 'tb');
  o += text(tx, 58, `${Rr.it} 次 sample，tree 有 ${Rr.nodes.length} 个 node`, 't');
  o += line(tx, 82, tx + 26, 82, 'ink-b') + text(tx + 34, 86, `RRT 的 path：${plen(Rr.path).toFixed(2)} m`, 't');
  o += line(tx, 106, tx + 26, 106, 'ln') + text(tx + 34, 110, `shortcut 之后：${plen(sc).toFixed(2)} m`, 't');
  o += text(tx, 134, '最短 path 是 11.72 m', 't');
  o += rect(tx, 156, 26, 12, 'solid2') + text(tx + 34, 167, 'wall（physical）', 't');
  o += line(tx, 190, tx + 26, 190, 'dash') + text(tx + 34, 194, 'C-obstacle 的边界', 't');
  o += text(tx, 222, 'Robot 是 radius 0.25 m 的 disk。', 'ts') + text(tx, 238, 'Wall 向外扩 0.25 m 之后，robot', 'ts') + text(tx, 254, '就可以当成一个点来规划。', 'ts');
  o += text(tx, 278, 'Gap 的 physical 宽度 1.4 m，', 'ts') + text(tx, 294, '在 C-space 里只剩 0.9 m。', 'ts');
  return svgA(560, 304, o, `动图：10 乘 10 米的地图中间一道 wall，只在 y 等于 3 附近留一个 gap；RRT 从左下角长出一棵 tree，${Rr.it} 次 sample 后穿过 gap 到右上角；shortcut 把 path 从 ${plen(Rr.path).toFixed(2)} 米拉直到 ${plen(sc).toFixed(2)} 米`);
}

// ---------- 第 6 站：belief-space planning，两条 route 上的 2σ circle ----------
function coastal() {
  const q = 0.01, Rm = 0.05 ** 2;
  const sx = lin(-0.6, 11.0, 30, 530), sy = lin(-1.2, 3.0, 230, 30), k = sx(1) - sx(0);
  let o = '';
  const B1 = [2.25, Math.sqrt(3.9375)], B2 = [10.25, Math.sqrt(3.9375)];
  o += rect(sx(2.25), sy(B1[1] + 0.35), sx(10.25) - sx(2.25), sy(B1[1]) - sy(B1[1] + 0.35), 'solid2');
  o += text(sx(6.25), sy(B1[1] + 0.35) - 6, 'wall：沿着它走时每 1 m 测一次 position（σ = 5 cm）', 'ts', 'middle');
  o += rect(sx(10) - 4, sy(-0.4), 8, 30, 'solid2') + rect(sx(10) - 4, sy(0.4) - 30, 8, 30, 'solid2');
  o += text(sx(10) + 12, sy(-0.4) + 46, 'door：center 偏离超过 0.4 m 就撞上 frame', 'ts', 'end');
  o += path(d([[sx(0), sy(0)], [sx(10), sy(0)]]), 'mute');
  let P = 0.01;
  for (let s = 1; s <= 10; s++) { P += q; if (s % 2 === 0 || s === 10) o += circle(sx(s), sy(0), 2 * Math.sqrt(P) * k, 'ink'); }
  o += text(sx(4.6), sy(0) + 6 + 2 * Math.sqrt(0.06) * k + 12, `Route A：10 m，全程没有 measurement，到 door 时 σ = ${Math.sqrt(P).toFixed(2)} m`, 't', 'middle');
  const segs = [];
  const pt = (s) => { if (s <= 3) return [B1[0] * s / 3, B1[1] * s / 3]; if (s <= 11) return [B1[0] + (s - 3), B1[1]]; const u = (s - 11) / 2; return [B2[0] + (10 - B2[0]) * u, B2[1] * (1 - u)]; };
  for (let s = 0; s <= 13; s += 0.25) segs.push(pt(s));
  o += path(d(segs.map(([x, y]) => [sx(x), sy(y)])), 'ln');
  P = 0.01; let Pmin = 1;
  for (let s = 1; s <= 13; s++) {
    P += q; if (s > 3 && s <= 11) P = (P * Rm) / (P + Rm);
    Pmin = Math.min(Pmin, P);
    const [x, y] = pt(s);
    o += circle(sx(x), sy(y), Math.max(2 * Math.sqrt(P) * k, 1.5), 'ln');
  }
  o += text(sx(1.05), sy(1.35), 'Route B：13 m', 'tl', 'end');
  o += text(sx(9.0), sy(0.95), `到 door 时 σ = ${Math.sqrt(P).toFixed(2)} m`, 'tl', 'end');
  o += circle(sx(0), sy(0), 4, 'ink-f') + text(sx(0), sy(0) + 20, 'start', 'ts', 'middle');
  o += text(30, 262, '每个 circle 的 radius 是那一刻 position error 的 2σ。', 'ts') + text(30, 280, `Route B 的 circle 先变大，沿 wall 被压到 σ = ${(100 * Math.sqrt(Pmin)).toFixed(1)} cm，最后 2 m 又长回来。`, 'ts');
  return svg(560, 290, o, '两条去 door 的 route：直线 route 上 uncertainty circle 一路变大；绕到 wall 的 route 上 circle 先变大，沿 wall 缩小，离开 wall 后略微变大');
}

// ---------- 第 6 站：K = 4 个 scenario 的 DESPOT（Tiger，depth 2） ----------
function despot() {
  let o = '';
  const box = (x, y, w, lab, sc, cls = 'paper') => { o += rect(x - w / 2, y - 15, w, 30, cls, 6) + text(x, y - 1, lab, 'tb', 'middle') + text(x, y + 11, sc, 'ts', 'middle'); };
  const leaf = (x, y, lab, v) => { o += rect(x - 74, y - 15, 148, 30, 'wash2', 4) + text(x, y - 2, lab, 't', 'middle') + text(x, y + 11, v, 'ts', 'middle'); };
  const edge = (x1, y1, x2, y2, lab, dx = 0, cls = 'ink') => { o += line(x1, y1, x2, y2, cls); o += text((x1 + x2) / 2 + dx, (y1 + y2) / 2 - 3, lab, 'ts', dx < 0 ? 'end' : 'start'); };
  box(280, 40, 150, 'b₀', 'scenario {1, 2, 3, 4}');
  edge(222, 55, 100, 100, 'open-left', -8); leaf(100, 116, '3 个 −100，1 个 +10', '平均 −72.5');
  edge(338, 55, 460, 100, 'open-right', 8); leaf(460, 116, '3 个 +10，1 个 −100', '平均 −17.5');
  edge(280, 55, 280, 100, 'listen', 6);
  o += circle(280, 104, 4, 'ink-f');
  edge(280, 104, 190, 158, 'hear-left', -6); edge(280, 104, 370, 158, 'hear-right', 6);
  box(190, 174, 130, 'b(hl)', '{2, 3, 4}'); box(370, 174, 130, 'b(hr)', '{1}');
  edge(190, 189, 190, 222, 'listen → hl', -6); edge(370, 189, 370, 222, 'listen → hr', 6);
  box(190, 238, 130, 'b(hl, hl)', '{2, 3, 4}'); box(370, 238, 130, 'b(hr, hr)', '{1}');
  o += text(30, 284, 'Scenario 1 的老虎在右边，2、3、4 在左边；四个 scenario 前两次 listen 都听对了，', 'ts');
  o += text(30, 302, '所以 (hl, hr) 和 (hr, hl) 没有出现。Full belief tree 在这一层有 4 个 observation node，这里只有 2 个。', 'ts');
  return svg(560, 312, o, 'K 等于 4 的 DESPOT：root 含 4 个 scenario；listen 之后按 observation 分成含 3 个和 1 个 scenario 的两个 node；再 listen 一次仍然只有两个 node');
}

// ---------- 第 7 站：系统结构（照 Bai et al. 2015 的 golf cart） ----------
function arch() {
  let o = '';
  const node = (x, y, w, a, b, cls = 'paper') => { o += rect(x, y, w, 40, cls, 6) + text(x + w / 2, y + 17, a, 'tb', 'middle') + text(x + w / 2, y + 32, b, 'ts', 'middle'); };
  node(10, 20, 110, 'LiDAR', 'SICK LMS 291');
  node(10, 120, 110, 'Camera, IMU,', 'wheel encoder');
  node(160, 20, 120, 'Pedestrian', 'detector');
  node(160, 120, 120, 'Localization', 'AMCL（第 3 站）');
  node(320, 20, 110, 'Belief tracker', 'intention');
  node(320, 120, 110, 'Path planner', 'hybrid A*，2 Hz');
  node(460, 20, 92, 'Speed planner', 'DESPOT，3 Hz');
  node(460, 120, 92, 'Pure pursuit', 'steering');
  node(400, 210, 152, 'Speed control（PID）', 'throttle, brake', 'wash');
  node(160, 210, 160, 'Emergency brake', '< 0.5 m 就刹', 'wash');
  const A = (x1, y1, x2, y2) => { o += arrow(x1, y1, x2, y2, 'ink'); };
  A(120, 40, 158, 40); A(120, 140, 158, 140); A(65, 60, 196, 118); A(280, 40, 318, 40); A(280, 140, 318, 140);
  A(430, 40, 458, 40); A(430, 140, 458, 140); A(375, 60, 375, 118); A(506, 60, 506, 208); A(240, 160, 470, 208); A(40, 60, 190, 208);
  o += text(380, 92, 'belief', 'ts', 'start') + text(502, 92, 'acceleration', 'ts', 'end');
  o += text(10, 276, '每个方框是一个 ROS node，箭头是 topic（publish → subscribe）。', 'ts');
  o += text(10, 294, '上面一排是 POMDP 的 belief 与 speed 规划，中间一排是 localization 与 steering，', 'ts');
  o += text(10, 312, '底下两个是直接碰 actuator 的 node；emergency brake 不经过 planner。', 'ts');
  return svg(560, 322, o, '一辆在行人中行驶的 golf cart 的软件结构：sensor、detector、belief tracker、DESPOT speed planner、path planner、pure pursuit、PID 和独立的 emergency brake，各自是一个 node');
}

// ---------- 第 7 站：perception → planning → control 的 latency 预算 ----------
function budget() {
  const sx = lin(0, 900, 110, 540);
  let o = '';
  const stages = [['scan', 100, 100], ['perception', 40, 40], ['tracker', 10, 10], ['等 planner tick', 0, 333], ['DESPOT', 333, 333], ['等 control tick', 0, 20], ['control', 1, 1]];
  const row = (y, which, lab) => {
    let t = 0;
    o += text(100, y + 17, lab, 'tb', 'end');
    stages.forEach(([name, best, worst], i) => {
      const dur = which === 0 ? best : worst;
      if (dur > 0) {
        const wait = name.startsWith('等');
        o += rect(sx(t), y, sx(t + dur) - sx(t), 26, wait ? 'wash2' : i % 2 ? 'wash-strong' : 'wash');
        if (sx(t + dur) - sx(t) > 44) o += text((sx(t) + sx(t + dur)) / 2, y + 17, name, 'ts', 'middle');
      }
      t += dur;
    });
    o += text(sx(t) + 4, y + 17, `${t} ms`, 'tl', which === 1 ? 'end' : 'start');
    return t;
  };
  row(30, 0, 'best case');
  row(80, 1, 'worst case');
  o += text(sx(100) + 2, 74, 'scan 100、perception 40、tracker 10', 'ts');
  for (const v of [0, 200, 400, 600, 800]) o += line(sx(v), 120, sx(v), 126, 'axis') + text(sx(v), 140, String(v), 'ts', 'middle');
  o += line(sx(0), 120, sx(900), 120, 'axis') + text(sx(900), 156, '从 scan 开始到 command 发出（ms）', 'ts', 'end');
  o += text(20, 184, '灰色是“数据已经到了，但下一级的 timer 还没到”；两行只差这两段 waiting。', 'ts');
  return svg(560, 194, o, '一次 perception 到 control 的 latency：最好情况 484 毫秒，最坏情况 837 毫秒，差别来自等待 planner 和 controller 的 timer');
}

// ---------- 第 7 站：pure pursuit 的几何与 delay ----------
function ppSim(Ld, tau, v = 1.5, T = 12, dt = 0.001, y0 = 0.5) {
  let x = 0, y = y0, th = 0; const nd = Math.round(tau / dt), buf = Array(nd + 1).fill(0), out = [];
  for (let k = 0; k * dt < T; k++) {
    const dx = Math.sqrt(Math.max(Ld * Ld - y * y, 1e-9));
    const alpha = Math.atan2(-y, dx) - th, kap = (2 * Math.sin(alpha)) / Ld;
    buf.push(kap); const kk = buf.shift();
    if (k % 20 === 0) out.push([k * dt, y, x, th]);
    x += v * Math.cos(th) * dt; y += v * Math.sin(th) * dt; th += v * kk * dt;
  }
  return out;
}
function pp() {
  let o = '';
  const Rb = [40, 200], G = [178, 112];
  const dx = G[0] - Rb[0], dy = Rb[1] - G[1], Ld = Math.hypot(dx, dy), alpha = Math.atan2(dy, dx);
  const rad = Ld / (2 * Math.sin(alpha)), C = [Rb[0], Rb[1] - rad];
  o += line(20, 112, 220, 112, 'dash') + text(60, 104, 'path', 'ts', 'start');
  o += line(Rb[0], Rb[1], Rb[0], 70, 'mute') + text(Rb[0] - 4, 66, 'heading', 'ts', 'start');
  const arcPts = []; const a0 = Math.atan2(Rb[1] - C[1], Rb[0] - C[0]), a1 = Math.atan2(G[1] - C[1], G[0] - C[0]);
  for (let i = 0; i <= 40; i++) { const a = a0 + (a1 - a0) * (i / 40); arcPts.push([C[0] + rad * Math.cos(a), C[1] + rad * Math.sin(a)]); }
  o += path(d(arcPts), 'ln');
  o += line(Rb[0], Rb[1], G[0], G[1], 'ink') + text((Rb[0] + G[0]) / 2 + 10, (Rb[1] + G[1]) / 2 + 14, 'L_d', 'ts');
  o += circle(Rb[0], Rb[1], 5, 'ink-f') + circle(G[0], G[1], 5, 'ln-f') + text(G[0] + 4, G[1] - 10, 'lookahead point', 'ts', 'middle');
  const aa = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (Math.PI / 2 - alpha) * (i / 12); aa.push([Rb[0] + 30 * Math.cos(a), Rb[1] + 30 * Math.sin(a)]); }
  o += path(d(aa), 'ink') + text(Rb[0] + 22, Rb[1] - 34, 'α', 'tb');
  o += text(120, 236, '沿 arc 走：κ = 2 sin α / L_d', 'tl', 'middle');
  const sx = lin(0, 12, 270, 540), sy = lin(-0.9, 0.9, 210, 30);
  o += axes({ sx, sy, x0: 0, x1: 12, y0: -0.9, y1: 0.9, xt: [0, 4, 8, 12], yt: [[-0.5, '−0.5'], [0, '0'], [0.5, '0.5']], xAt: 0 });
  const cls = { 0: 'mute', 0.2: 'ink', 0.4: 'ln' };
  for (const tau of [0, 0.2, 0.4]) o += path(d(ppSim(1, tau).map(([t, y]) => [sx(t), sy(Math.max(-0.9, Math.min(0.9, y)))])), cls[tau]);
  o += text(sx(1.2), sy(0.62), 'τ = 0', 'ts') + text(sx(2.2), sy(-0.72), 'τ = 0.2 s', 't');
  o += text(sx(12), 234, 'τ = 0.4 s（彩色）：不再收敛', 'tl', 'end');
  o += text(405, 18, 'lateral error（m），L_d = 1 m，v = 1.5 m/s', 'tb', 'middle');
  o += text(540, 256, 'time（s）', 'ts', 'end');
  return svg(560, 264, o, '左图：pure pursuit 取一段同时与当前 heading 相切、并经过 lookahead point 的 arc；右图：lateral error 随时间变化，delay 为 0 和 0.2 秒时收敛，0.4 秒时振荡不衰减');
}

// ---------- 第 7 站：同一段 path，两辆车（delay 0.2 s 与 0.4 s）同时跟踪（动图） ----------
function ppCarA() {
  const T = 8, S = [ppSim(1, 0.2, 1.5, T), ppSim(1, 0.4, 1.5, T)].map((tr) => tr.filter((_, i) => i % 4 === 0));
  const sx = lin(0, 12, 30, 530), rows = [[0.2, 80, 'τ = 0.2 s'], [0.4, 200, 'τ = 0.4 s']];
  const sy = (y, y0) => y0 - y * 50;
  const n = S[0].length, kt = S[0].map((_, i) => i / (n - 1));
  let o = '';
  rows.forEach(([tau, y0, lab], r) => {
    const tr = S[r];
    o += line(sx(0), y0, sx(12), y0, 'dash') + text(30, y0 - 46, lab, r ? 'tl' : 'tb');
    o += path(d(tr.map(([, y, x]) => [sx(x), sy(Math.max(-0.9, Math.min(0.9, y)), y0)])), r ? 'ln' : 'ink');
    // 车身：1.2 m × 0.6 m 的 rectangle，按 heading 转
    const body = (x, y, th) => { const c = Math.cos(th), s = Math.sin(th), L = 0.6, Wd = 0.3; const P = [[-L, -Wd], [L, -Wd], [L, Wd], [-L, Wd]].map(([u, v]) => [sx(x + c * u - s * v), sy(y + s * u + c * v, y0)]); return d([...P, P[0]]) + 'Z'; };
    const ds = tr.map(([, y, x, th]) => body(x, Math.max(-0.9, Math.min(0.9, y)), th));
    o += `<path d="${ds[0]}" class="paper">${anim('d', ds, kt, T)}</path>`;
  });
  o += text(30, 268, '两辆车都从偏离 path 0.5 m 处出发，v = 1.5 m/s，L_d = 1 m；只差 command 晚到多久。', 'ts');
  o += text(30, 286, '下面那辆的 lateral error 一直在 ±0.5 m 附近来回，停不下来。', 'ts');
  return svgA(560, 296, o, '动图：两辆车用 pure pursuit 跟踪同一条直线 path，delay 0.2 秒的那辆几秒内贴上 path，delay 0.4 秒的那辆一直左右摆动');
}

export default {
  'cs4278-drift': drift,
  'cs4278-corridor': corridorA,
  'cs4278-gauss': gauss,
  'cs4278-cv': cv,
  'cs4278-ekf': ekf,
  'cs4278-pf': pfA,
  'cs4278-posegraph': posegraph,
  'cs4278-rrt': rrtA,
  'cs4278-coastal': coastal,
  'cs4278-despot': despot,
  'cs4278-arch': arch,
  'cs4278-budget': budget,
  'cs4278-pp': pp,
  'cs4278-ppcar': ppCarA,
};
