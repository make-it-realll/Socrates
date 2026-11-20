import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// ---------- 共用的 model 与 simulation ----------
// Joint J：M θ'' + b θ' + mgr cos θ = τ
const JM = 0.05, JB = 0.1, MGR = 1.0 * 9.81 * 0.2;

// continuous-time 的 PID（semi-implicit Euler），可选 torque limit 与 anti-windup
function jointSim({ Kp, Kd, Ki = 0, T = 2, dt = 1e-4, th0 = -Math.PI / 2, thd = 0, tmax = null, aw = null, every = 10 }) {
  let th = th0, w = 0, I = 0;
  const out = [];
  const n = Math.round(T / dt);
  for (let k = 0; k <= n; k++) {
    const e = thd - th;
    const u = Kp * e - Kd * w + Ki * I;
    const tau = tmax === null ? u : Math.max(-tmax, Math.min(tmax, u));
    if (k % every === 0) out.push({ t: k * dt, th, tau, iterm: Ki * I });
    if (aw === 'clamp') { if (tau === u || Math.sign(e) !== Math.sign(u)) I += e * dt; } else I += e * dt;
    const acc = (tau - JB * w - MGR * Math.cos(th)) / JM;
    w += acc * dt; th += w * dt;
  }
  return out;
}

// 1 kHz 之类的 sampled PD：finite difference velocity（可选 first-order filter）、一个 sample 的 delay、gravity compensation
function sampledSim({ f, Kp = 20, Kd = 1.9, Tf = 0, quant = false, T = 1, ref = 'step', step = 0.2, dt = 1e-5 }) {
  const h = 1 / f, sub = Math.round(h / dt), q = (2 * Math.PI) / 4096, a = Tf / (Tf + h);
  let th = 0, w = 0, thp = 0, vf = 0, uNext = 0, uApply = 0;
  const out = [];
  for (let k = 0; k * h < T; k++) {
    const t = k * h;
    const thd = ref === 'sin' ? 0.5 * Math.sin(Math.PI * t) : step;
    const wd = ref === 'sin' ? 0.5 * Math.PI * Math.cos(Math.PI * t) : 0;
    const meas = quant ? Math.round(th / q) * q : th;
    const vraw = k > 0 ? (meas - thp) / h : 0;
    vf = a * vf + (1 - a) * vraw; thp = meas;
    const u = Kp * (thd - meas) + Kd * (wd - vf) + MGR * Math.cos(meas);
    uApply = uNext; uNext = u;
    out.push({ t, th, u: uApply });
    for (let j = 0; j < sub; j++) { const acc = (uApply - JB * w - MGR * Math.cos(th)) / JM; w += acc * dt; th += w * dt; }
  }
  return out;
}

// Arm A：两节 1 kg、0.4 m 的均匀 link，竖直平面
function arm(mp = 0) {
  const m1 = 1, l1 = 0.4, l2 = 0.4, lc1 = 0.2, I1 = (1 * 0.16) / 12;
  const m2 = 1 + mp, lc2 = (1 * 0.2 + mp * 0.4) / m2, I2 = (1 * 0.16) / 12 + 1 * (0.2 - lc2) ** 2 + mp * (0.4 - lc2) ** 2, g = 9.81;
  return {
    l1, l2,
    M: (q) => { const c2 = Math.cos(q[1]); const a = I1 + I2 + m1 * lc1 ** 2 + m2 * (l1 ** 2 + lc2 ** 2 + 2 * l1 * lc2 * c2); const b = I2 + m2 * (lc2 ** 2 + l1 * lc2 * c2); return [[a, b], [b, I2 + m2 * lc2 ** 2]]; },
    Cq: (q, dq) => { const h = m2 * l1 * lc2 * Math.sin(q[1]); return [-h * (2 * dq[0] * dq[1] + dq[1] ** 2), h * dq[0] ** 2]; },
    G: (q) => [(m1 * lc1 + m2 * l1) * g * Math.cos(q[0]) + m2 * lc2 * g * Math.cos(q[0] + q[1]), m2 * lc2 * g * Math.cos(q[0] + q[1])],
    fk: (q) => [l1 * Math.cos(q[0]) + l2 * Math.cos(q[0] + q[1]), l1 * Math.sin(q[0]) + l2 * Math.sin(q[0] + q[1])],
    J: (q) => { const s1 = Math.sin(q[0]), c1 = Math.cos(q[0]), s12 = Math.sin(q[0] + q[1]), c12 = Math.cos(q[0] + q[1]); return [[-l1 * s1 - l2 * s12, -l2 * s12], [l1 * c1 + l2 * c12, l2 * c12]]; },
    Jdq: (q, dq) => { const c1 = Math.cos(q[0]), s1 = Math.sin(q[0]), c12 = Math.cos(q[0] + q[1]), s12 = Math.sin(q[0] + q[1]), w1 = dq[0], w12 = dq[0] + dq[1]; return [-l1 * c1 * w1 ** 2 - l2 * c12 * w12 ** 2, -l1 * s1 * w1 ** 2 - l2 * s12 * w12 ** 2]; },
  };
}
const mv = (A, v) => [A[0][0] * v[0] + A[0][1] * v[1], A[1][0] * v[0] + A[1][1] * v[1]];
const tr = (A) => [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
const inv2 = (A) => { const det = A[0][0] * A[1][1] - A[0][1] * A[1][0]; return [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]]; };
const mm = (A, B) => [[A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]], [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]];
const add = (a, b, s = 1) => a.map((x, i) => x + s * b[i]);

function armSim(plant, ctrl, q0, T, dt = 5e-4, every = 10, ref = null) {
  let x = [q0[0], q0[1], 0, 0];
  const f = (t, s) => {
    const q = [s[0], s[1]], dq = [s[2], s[3]];
    const tau = ctrl(t, q, dq);
    const rhs = [tau[0] - plant.Cq(q, dq)[0] - plant.G(q)[0], tau[1] - plant.Cq(q, dq)[1] - plant.G(q)[1]];
    const a = mv(inv2(plant.M(q)), rhs);
    return [dq[0], dq[1], a[0], a[1]];
  };
  const out = [];
  const n = Math.round(T / dt);
  for (let k = 0; k <= n; k++) {
    const t = k * dt;
    if (k % every === 0) out.push({ t, q: [x[0], x[1]], ref: ref ? ref(t)[0] : null });
    const k1 = f(t, x), k2 = f(t + dt / 2, add(x, k1, dt / 2)), k3 = f(t + dt / 2, add(x, k2, dt / 2)), k4 = f(t + dt, add(x, k3, dt));
    x = x.map((v, i) => v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  return out;
}

const quintic = (t, T) => { const s = Math.min(Math.max(t / T, 0), 1), on = t <= T ? 1 : 0; return [10 * s ** 3 - 15 * s ** 4 + 6 * s ** 5, (on * 30 * s * s * (1 - s) ** 2) / T, (on * 60 * s * (1 - s) * (1 - 2 * s)) / T ** 2]; };
const cubicS = (t, T) => { const s = Math.min(Math.max(t / T, 0), 1), on = t <= T ? 1 : 0; return [3 * s * s - 2 * s ** 3, (on * 6 * s * (1 - s)) / T, (on * (6 - 12 * s)) / T ** 2]; };
const trapS = (t, T, ta) => {
  const v = 1 / (T - ta), a = v / ta;
  if (t < 0) return [0, 0, 0];
  if (t < ta) return [0.5 * a * t * t, a * t, a];
  if (t < T - ta) return [0.5 * a * ta * ta + v * (t - ta), v, 0];
  if (t <= T) { const r = T - t; return [1 - 0.5 * a * r * r, a * r, -a]; }
  return [1, 0, 0];
};

const legend = (x, y, items) => {
  let o = '';
  items.forEach(([cls, s], i) => { o += line(x, y + i * 20 - 4, x + 26, y + i * 20 - 4, cls) + text(x + 32, y + i * 20, s, 't'); });
  return o;
};
const deg = (r) => (r * 180) / Math.PI;

// ---------- 图 1：motor 的 Bode plot ----------
function bode() {
  const L = 0.5e-3, R = 1, NK = 2.5;
  const G = (w) => { // NK / ((M s + b)(L s + R) + NK^2), s = jw
    const ar = JB, ai = JM * w, br = R, bi = L * w;
    const re = ar * br - ai * bi + NK * NK, im = ar * bi + ai * br;
    const mag = NK / Math.hypot(re, im), ph = -Math.atan2(im, re);
    return [20 * Math.log10(mag), (ph * 180) / Math.PI];
  };
  const sx = logx(1, 1e5, 70, 520), sy = lin(-100, 0, 175, 25), sp = lin(-180, 0, 285, 205);
  let o = '';
  for (const k of [0, 1, 2, 3, 4, 5]) { const x = sx(10 ** k); o += line(x, 25, x, 175, 'grid') + line(x, 205, x, 285, 'grid'); }
  for (const v of [0, -20, -40, -60, -80, -100]) o += line(70, sy(v), 520, sy(v), 'grid') + text(64, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
  for (const v of [0, -90, -180]) o += line(70, sp(v), 520, sp(v), 'grid') + text(64, sp(v) + 4, String(v).replace('-', '−') + '°', 'ts', 'end');
  o += rect(70, 25, 450, 150, 'frame') + rect(70, 205, 450, 80, 'frame');
  const labs = ['1', '10', '100', '10³', '10⁴', '10⁵'];
  [0, 1, 2, 3, 4, 5].forEach((k) => { o += text(sx(10 ** k), 301, labs[k], 'ts', 'middle'); });
  o += text(520, 316, 'ω（rad/s，log scale）', 'ts', 'end') + text(70, 16, '|G(jω)|（dB）', 'ts') + text(70, 198, 'phase', 'ts');
  // asymptote
  const w1 = 136.13, w2 = 1865.87, dc = G(0.001)[0];
  const asym = (w) => dc - (w > w1 ? 20 * Math.log10(w / w1) : 0) - (w > w2 ? 20 * Math.log10(w / w2) : 0);
  const pts = [], ap = [], pp = [];
  for (let i = 0; i <= 300; i++) { const w = 10 ** ((5 * i) / 300); pts.push([sx(w), sy(G(w)[0])]); ap.push([sx(w), sy(Math.max(asym(w), -100))]); pp.push([sx(w), sp(G(w)[1])]); }
  o += path(d(ap), 'dash') + path(d(pts), 'ln') + path(d(pp), 'ln');
  o += line(sx(w1), 25, sx(w1), 285, 'mute') + line(sx(w2), 25, sx(w2), 285, 'mute');
  o += text(sx(w1) - 5, sy(-93), '136 rad/s', 'ts', 'end') + text(sx(w2) + 5, sy(-93), '1866 rad/s', 'ts');
  o += text(sx(1.5), sy(-24), 'DC gain −8.1 dB', 't');
  o += text(sx(160), sy(-42), '−20 dB/decade', 'ts');
  o += text(515, sy(-36), '−40 dB/decade', 'ts', 'end');
  o += circle(sx(504), sp(-90), 3.5, 'ink-f') + text(sx(504) - 6, sp(-90) + 16, '504 rad/s 处 −90°', 'ts', 'end');
  o += text(sx(1.5), sy(-70), '彩线：完整 model', 'ts') + text(sx(1.5), sy(-82), '虚线：asymptote', 'ts');
  return svg(560, 322, o, 'DC motor 从 voltage 到 speed 的 Bode plot：低 frequency 平在 −8.1 dB，136 rad/s 之后以 −20 dB/decade 下降，1866 rad/s 之后以 −40 dB/decade 下降；phase 在 504 rad/s 处为 −90 度');
}

// ---------- 图 2：P、PD、PID ----------
function pid() {
  const sx = lin(0, 2, 60, 390), sy = lin(-95, 75, 225, 20);
  let o = axes({ sx, sy, x0: 0, x1: 2, y0: -95, y1: 75, xt: [0, 0.5, 1, 1.5, 2], yt: [[-90, '−90°'], [-45, '−45°'], [0, '0°'], [45, '45°']], xl: 't（s）', grid: true });
  const runs = [
    [{ Kp: 20, Kd: 0 }, 'mute'],
    [{ Kp: 20, Kd: 1.9 }, 'ink'],
    [{ Kp: 20, Kd: 1.9, Ki: 20 }, 'ln-dash'],
    [{ Kp: 20, Kd: 1.9, Ki: 100 }, 'ln'],
  ];
  for (const [p, cls] of runs) {
    const r = jointSim({ ...p, T: 2 });
    o += path(d(r.map((z) => [sx(z.t), sy(deg(z.th))])), cls);
  }
  o += line(sx(0), sy(0), sx(2), sy(0), 'axis');
  o += legend(410, 60, [['mute', 'P'], ['ink', 'PD'], ['ln-dash', 'PID，Ki = 20'], ['ln', 'PID，Ki = 100']]);
  o += text(410, 160, 'PD 停在 −5.6°', 'ts') + text(410, 177, 'PID 最后都回到 0°', 'ts');
  return svg(560, 262, o, 'Joint J 从负 90 度转到 0 度：P 几乎没有 damping 来回摆动，PD 停在差 5.6 度的地方，PID 回到 0 度但 Ki 越大 overshoot 越大');
}

// ---------- 图 3：windup ----------
function windup() {
  const cases = [
    [{ Kp: 20, Kd: 1.9, Ki: 100 }, 'mute', '没有 torque limit'],
    [{ Kp: 20, Kd: 1.9, Ki: 100, tmax: 3 }, 'ln', '3 N·m limit，不处理'],
    [{ Kp: 20, Kd: 1.9, Ki: 100, tmax: 3, aw: 'clamp' }, 'ink', '3 N·m limit，clamping'],
  ];
  const sx1 = lin(0, 1.5, 55, 260), sy1 = lin(-95, 60, 210, 30);
  const sx2 = lin(0, 1.5, 325, 530), sy2 = lin(0, 30, 210, 30);
  let o = axes({ sx: sx1, sy: sy1, x0: 0, x1: 1.5, y0: -95, y1: 60, xt: [0, 0.5, 1, 1.5], yt: [[-90, '−90°'], [-45, '−45°'], [0, '0°'], [45, '45°']], xl: 't（s）', grid: true });
  o += axes({ sx: sx2, sy: sy2, x0: 0, x1: 1.5, y0: 0, y1: 30, xt: [0, 0.5, 1, 1.5], yt: [0, 10, 20, 30], xl: 't（s）', grid: true });
  for (const [p, cls] of cases) {
    const r = jointSim({ ...p, T: 1.5 });
    o += path(d(r.map((z) => [sx1(z.t), sy1(deg(z.th))])), cls) + path(d(r.map((z) => [sx2(z.t), sy2(z.iterm)])), cls);
  }
  o += text(157, 18, 'link angle θ', 'tb', 'middle') + text(427, 18, 'integral term Kᵢ∫e（N·m）', 'tb', 'middle');
  o += line(sx2(0), sy2(1.962), sx2(1.5), sy2(1.962), 'dash') + text(sx2(1.5), sy2(9), 'final 1.96 = gravity', 'ts', 'end');
  o += legend(70, 268, [['mute', cases[0][2]]]) + legend(300, 268, [['ln', cases[1][2]]]) + legend(70, 288, [['ink', cases[2][2]]]);
  return svg(560, 298, o, '左图是三种情形下 link angle 随 time 的变化，右图是 integral term 的大小。Torque saturate 而不处理时 integral term 涨到 27 N·m，link 冲过头 54 度；用 clamping 后只冲过 8 度');
}

// ---------- 图 4：derivative noise ----------
function dnoise() {
  const raw = sampledSim({ f: 1000, quant: true, ref: 'sin', T: 1.3 });
  const filt = sampledSim({ f: 1000, quant: true, Tf: 0.005, ref: 'sin', T: 1.3 });
  const ideal = sampledSim({ f: 1000, quant: false, ref: 'sin', T: 1.3 });
  const t0 = 1.0, t1 = 1.2;
  const win = (r) => r.filter((z) => z.t >= t0 && z.t <= t1);
  const sx = lin(t0, t1, 60, 400), sy = lin(-1.5, 5, 215, 25);
  let o = axes({ sx, sy, x0: t0, x1: t1, y0: -1.5, y1: 5, xt: [[1.0, '1.00'], [1.05, '1.05'], [1.1, '1.10'], [1.15, '1.15'], [1.2, '1.20']], yt: [0, 1, 2, 3, 4], xl: 't（s）', yl: 'torque（N·m）', grid: true });
  const pl = (r, cls) => path(d(win(r).map((z) => [sx(z.t), sy(Math.max(-1.5, Math.min(5, z.u)))])), cls);
  o += pl(raw, 'mute') + pl(filt, 'ln') + pl(ideal, 'dash');
  o += line(sx(t0), sy(3), sx(t1), sy(3), 'ink') + text(sx(t1) - 4, sy(3) - 6, 'motor limit 3 N·m', 'ts', 'end');
  o += legend(415, 70, [['mute', '直接差分'], ['ln', 'filter，Tf = 5 ms'], ['dash', '没有 quantization']]);
  o += text(415, 150, '12-bit encoder，1 kHz', 'ts') + text(415, 167, '跳一格 ≈ 2.9 N·m', 'ts');
  return svg(560, 250, o, '跟踪正弦 trajectory 时的 torque command：直接对 encoder 读数做差分，每跳一格 torque 跳近 3 N·m；加 5 ms 的 low-pass filter 后贴近没有 quantization 的理想曲线');
}

// ---------- 图 5：sampling rate ----------
function rate() {
  const sx = lin(0, 1.2, 60, 400), sy = lin(-0.1, 0.45, 220, 25);
  let o = axes({ sx, sy, x0: 0, x1: 1.2, y0: -0.1, y1: 0.45, xt: [0, 0.3, 0.6, 0.9, 1.2], yt: [[0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4']], xl: 't（s）', yl: 'θ（rad）', grid: true });
  const runs = [[1000, 'ink'], [100, 'dash'], [65, 'ln-dash'], [55, 'ln']];
  for (const [f, cls] of runs) {
    const r = sampledSim({ f, T: 1.2 });
    const pts = [];
    for (const z of r) { if (z.th > 0.45 || z.th < -0.1) break; pts.push([sx(z.t), sy(z.th)]); }
    o += path(d(pts), cls);
  }
  o += legend(415, 60, [['ink', '1000 Hz'], ['dash', '100 Hz'], ['ln-dash', '65 Hz'], ['ln', '55 Hz']]);
  o += text(415, 150, '同一组 gain：', 'ts') + text(415, 167, 'ωn = 20 rad/s，ζ = 1', 'ts') + text(415, 184, '一个 sample 的 delay', 'ts');
  return svg(560, 255, o, '同一组 PD gain 在 1000、100、65、55 Hz 下对 0.2 rad step 的 response：前两条几乎重合，65 Hz 有 overshoot，55 Hz 越摆越大');
}

// ---------- 图 6：flexible joint 示意 ----------
function flex() {
  let o = '';
  const y = 95;
  o += arrow(30, y, 78, y, 'ln') + text(54, y - 10, 'u', 'tl', 'middle');
  o += rect(80, y - 35, 90, 70, 'paper', 6) + text(125, y - 5, 'motor', 't', 'middle') + text(125, y + 14, 'Jₘ = 0.01', 'ts', 'middle');
  // spring
  const zz = [[170, y]];
  for (let i = 0; i < 10; i++) zz.push([190 + i * 10, y + (i % 2 ? 12 : -12)]);
  zz.push([300, y], [320, y]);
  o += path(d(zz), 'ink');
  o += text(245, y - 24, 'k = 300 N·m/rad', 'ts', 'middle');
  o += rect(320, y - 35, 90, 70, 'paper', 6) + text(365, y - 5, 'link', 't', 'middle') + text(365, y + 14, 'Jₗ = 0.04', 'ts', 'middle');
  o += line(125, y + 35, 125, y + 62, 'mute') + circle(125, y + 66, 4, 'ln-f') + text(125, y + 86, 'motor encoder θₘ', 'ts', 'middle') + text(125, y + 102, '与 u 同一处：collocated', 'ts', 'middle');
  o += line(365, y + 35, 365, y + 62, 'mute') + circle(365, y + 66, 4, 'ink-f') + text(365, y + 86, 'link encoder θₗ', 'ts', 'middle') + text(365, y + 102, '隔着 spring：non-collocated', 'ts', 'middle');
  o += text(430, 70, 'PD 只用 θₗ：', 'tb') + text(430, 88, '永远不 stable', 't');
  o += text(430, 116, 'PD 只用 θₘ：', 'tb') + text(430, 134, 'stable，但 link 会晃', 't');
  o += text(430, 162, '四个 state 都用：', 'tb') + text(430, 180, 'pole 任意放', 't');
  return svg(560, 215, o, 'Flexible joint 示意图：torque u 加在 motor 上，motor 与 link 之间是一根 spring；motor encoder 与 torque 在同一处，link encoder 隔着 spring');
}

// ---------- 图 7：三种 time scaling ----------
function profiles() {
  const fns = [[(t) => cubicS(t, 1), 'ink', 'cubic'], [(t) => trapS(t, 1, 1 / 3), 'dash', 'trapezoidal'], [(t) => quintic(t, 1), 'ln', 'quintic']];
  const panels = [[0, 'position s', 0, 1.05, [0, 0.5, 1]], [1, 'velocity', 0, 2, [0, 1, 2]], [2, 'acceleration', -7, 7, [-6, 0, 6]]];
  let o = '';
  panels.forEach(([k, name, y0, y1, yt], pi) => {
    const x0 = 45 + pi * 180, sx = lin(0, 1, x0, x0 + 140), sy = lin(y0, y1, 200, 40);
    o += axes({ sx, sy, x0: 0, x1: 1, y0, y1, xt: [[0, '0'], [0.5, '0.5'], [1, '1']], yt: yt.map((v) => [v, String(v).replace('-', '−')]) });
    if (k === 2) o += line(sx(0), sy(0), sx(1), sy(0), 'grid');
    o += text(x0 + 70, 26, name, 'tb', 'middle');
    for (const [fn, cls] of fns) {
      const pts = [];
      const N = 600;
      for (let i = 0; i <= N; i++) {
        const t = i / N; const v = fn(Math.min(t, 0.999999))[k];
        if (k === 2 && i > 0) { const prev = fn(Math.min((i - 1) / N, 0.999999))[k]; if (Math.abs(v - prev) > 1) pts.push([sx(t), sy(prev)]); }
        pts.push([sx(t), sy(v)]);
      }
      if (k === 2) { pts.unshift([sx(0), sy(0)]); pts.push([sx(1), sy(0)]); }
      o += path(d(pts), cls);
    }
  });
  o += legend(60, 240, [['ink', 'cubic']]) + legend(220, 240, [['dash', 'trapezoidal（tₐ = T/3）']]) + legend(420, 240, [['ln', 'quintic']]);
  o += text(280, 262, '横轴是 t / T；cubic 与 trapezoidal 的 acceleration 有竖直的跳变，quintic 的从 0 开始、回到 0', 'ts', 'middle');
  return svg(560, 272, o, '三种 time scaling 的 position、velocity、acceleration：cubic 的 acceleration 在两端跳变，trapezoidal 在四处跳变，quintic 的 acceleration 连续且两端为 0');
}

// ---------- 图 8：Arm A 与 tracking error ----------
function armtrack() {
  let o = '';
  // 左：示意
  const O = [70, 200], S = 230; // 1 m = 230 px
  const q = [0.45, 0.95];
  const P1 = [O[0] + S * 0.4 * Math.cos(q[0]), O[1] - S * 0.4 * Math.sin(q[0])];
  const P2 = [P1[0] + S * 0.4 * Math.cos(q[0] + q[1]), P1[1] - S * 0.4 * Math.sin(q[0] + q[1])];
  o += line(O[0] - 30, O[1], O[0] + 120, O[1], 'grid');
  o += line(O[0], O[1], P1[0], P1[1], 'ink-b') + line(P1[0], P1[1], P2[0], P2[1], 'ink-b');
  o += line(P1[0], P1[1], P1[0] + 50 * Math.cos(q[0]), P1[1] - 50 * Math.sin(q[0]), 'dash');
  o += circle(O[0], O[1], 5, 'paper') + circle(P1[0], P1[1], 5, 'paper') + circle(P2[0], P2[1], 3.5, 'ink-f');
  const arc = (c, r, a0, a1) => { const p = []; for (let i = 0; i <= 20; i++) { const a = a0 + ((a1 - a0) * i) / 20; p.push([c[0] + r * Math.cos(a), c[1] - r * Math.sin(a)]); } return path(d(p), 'mute'); };
  o += arc(O, 34, 0, q[0]) + text(O[0] + 42, O[1] - 4, it('q') + '₁', 't');
  o += arc(P1, 26, q[0], q[0] + q[1]) + text(P1[0] + 40 * Math.cos(q[0] + q[1] / 2), P1[1] - 40 * Math.sin(q[0] + q[1] / 2) + 4, it('q') + '₂', 't');
  o += text((O[0] + P1[0]) / 2 - 18 * Math.sin(q[0]), (O[1] + P1[1]) / 2 - 18 * Math.cos(q[0]), '0.4 m', 'ts', 'end');
  o += text((P1[0] + P2[0]) / 2 - 8, (P1[1] + P2[1]) / 2 - 2, '0.4 m', 'ts', 'end');
  o += arrow(30, 70, 30, 110, 'mute') + text(36, 96, it('g'), 't');
  o += text(100, 236, 'Arm A：每节 1 kg', 'ts', 'middle');
  // 右：error
  const A = arm(), Ap = arm(0.5);
  const q0 = [-Math.PI / 2, 0], qf = [0, Math.PI / 2];
  const ref = (t) => { const [p, v, a] = quintic(t, 1); return [[q0[0] + (qf[0] - q0[0]) * p, q0[1] + (qf[1] - q0[1]) * p], [(qf[0] - q0[0]) * v, (qf[1] - q0[1]) * v], [(qf[0] - q0[0]) * a, (qf[1] - q0[1]) * a]]; };
  const Mn = [Math.sqrt(A.M([0, Math.PI])[0][0] * A.M([0, 0])[0][0]), A.M(q0)[1][1]];
  const Kp = Mn.map((m) => m * 400), Kd = Mn.map((m) => m * 40);
  const pd = (t, q, dq) => { const [qd, vd] = ref(t); return [0, 1].map((i) => Kp[i] * (qd[i] - q[i]) + Kd[i] * (vd[i] - dq[i])); };
  const pdg = (t, q, dq) => add(pd(t, q, dq), A.G(q));
  const ct = (t, q, dq) => { const [qd, vd, ad] = ref(t); const aa = [0, 1].map((i) => ad[i] + 400 * (qd[i] - q[i]) + 40 * (vd[i] - dq[i])); return add(add(mv(A.M(q), aa), A.Cq(q, dq)), A.G(q)); };
  const sx = lin(0, 2, 270, 530), sy = lin(0, 16, 205, 30);
  o += axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 16, xt: [0, 0.5, 1, 1.5, 2], yt: [[0, '0°'], [5, '5°'], [10, '10°'], [15, '15°']], xl: 't（s）', grid: true });
  o += text(270, 18, 'tracking error 的大小', 'tb');
  const runs = [[A, pd, 'mute'], [A, pdg, 'ink'], [Ap, ct, 'ln-dash'], [A, ct, 'ln']];
  for (const [P, c, cls] of runs) {
    const r = armSim(P, c, q0, 2, 5e-4, 10);
    o += path(d(r.map((z) => { const [qd] = ref(z.t); return [sx(z.t), sy(deg(Math.hypot(qd[0] - z.q[0], qd[1] - z.q[1])))]; })), cls);
  }
  o += legend(270, 262, [['mute', 'independent PD']]) + legend(425, 262, [['ink', 'PD + gravity']]);
  o += legend(270, 282, [['ln', 'computed torque']]) + legend(425, 282, [['ln-dash', 'CT + payload']]);
  return svg(560, 294, o, '左边是 Arm A 的示意图，右边是四种 controller 跟踪同一条 quintic 时 tracking error 的大小：independent PD 最大且停在 gravity 造成的 offset，computed torque 在 model 准确时几乎为 0，未建模的 payload 让它的 error 比 PD 加 gravity 还大');
}

// ---------- 图 9：Jacobian transpose vs operational space ----------
function task() {
  const A = arm();
  const q0 = [0, Math.PI / 2], x0 = A.fk(q0), xg = [x0[0] + 0.15, x0[1] - 0.15];
  const jt = (t, q, dq) => { const J = A.J(q), x = A.fk(q), v = mv(J, dq); const F = [100 * (xg[0] - x[0]) - 12 * v[0], 100 * (xg[1] - x[1]) - 12 * v[1]]; return add(mv(tr(J), F), A.G(q)); };
  const osc = (t, q, dq) => {
    const J = A.J(q), M = A.M(q), Mi = inv2(M), x = A.fk(q), v = mv(J, dq);
    const Lm = inv2(mm(mm(J, Mi), tr(J)));
    const Jbar = mm(mm(Mi, tr(J)), Lm);
    const mu = add(mv(tr(Jbar), A.Cq(q, dq)), mv(Lm, A.Jdq(q, dq)), -1), p = mv(tr(Jbar), A.G(q));
    const F = add(add(mv(Lm, [100 * (xg[0] - x[0]) - 20 * v[0], 100 * (xg[1] - x[1]) - 20 * v[1]]), mu), p);
    return mv(tr(J), F);
  };
  const S = 520, sx = (x) => 40 + S * (x + 0.02), sy = (y) => 280 - S * (y + 0.02);
  let o = line(sx(-0.02), sy(0), sx(0.62), sy(0), 'grid');
  // arm at start
  const P1 = [0.4 * Math.cos(q0[0]), 0.4 * Math.sin(q0[0])];
  o += line(sx(0), sy(0), sx(P1[0]), sy(P1[1]), 'mute') + line(sx(P1[0]), sy(P1[1]), sx(x0[0]), sy(x0[1]), 'mute');
  o += circle(sx(0), sy(0), 5, 'paper') + circle(sx(P1[0]), sy(P1[1]), 5, 'paper');
  o += text(sx(0.2), sy(0) + 16, 'link 1', 'ts', 'middle') + text(sx(0.4) + 8, sy(0.2), 'link 2', 'ts');
  // Lambda ellipse at start: eigen 0.333 along x, 1.333 along y
  const ell = [];
  for (let i = 0; i <= 60; i++) { const a = (2 * Math.PI * i) / 60; ell.push([sx(x0[0] + 0.333 * 0.06 * Math.cos(a)), sy(x0[1] + 1.333 * 0.06 * Math.sin(a))]); }
  o += path(d(ell) + 'Z', 'wash ink-s');
  o += text(sx(x0[0]) - 18, sy(x0[1] + 0.09), 'Λ：y 方向 1.33 kg', 'ts', 'end') + text(sx(x0[0]) - 18, sy(x0[1] + 0.065), 'x 方向 0.33 kg', 'ts', 'end');
  o += line(sx(x0[0]), sy(x0[1]), sx(xg[0]), sy(xg[1]), 'dash');
  for (const [c, cls] of [[jt, 'ink'], [osc, 'ln']]) {
    const r = armSim(A, c, q0, 1.5, 5e-4, 4);
    o += path(d(r.map((z) => { const p = A.fk(z.q); return [sx(p[0]), sy(p[1])]; })), cls);
  }
  o += circle(sx(x0[0]), sy(x0[1]), 4, 'ink-f') + circle(sx(xg[0]), sy(xg[1]), 5, 'paper');
  o += text(sx(x0[0]) + 16, sy(x0[1]) - 14, '起点 (0.4, 0.4)', 'ts') + text(sx(xg[0]) + 9, sy(xg[1]) + 4, '目标 (0.55, 0.25)', 'ts');
  o += legend(400, 60, [['ink', 'Jacobian transpose'], ['ln', 'operational space'], ['dash', 'straight line']]);
  o += text(400, 225, 'Jacobian transpose：', 'ts') + text(400, 242, 'K = 100 N/m，x 方向轻，', 'ts') + text(400, 259, '先横着走，偏出 24 mm', 'ts');
  return svg(560, 300, o, 'Arm A 的 end-effector 从 (0.4, 0.4) 走到 (0.55, 0.25)：Jacobian transpose control 的路线先向 x 方向偏出约 24 毫米，operational space control 走 straight line；起点处的 task-space inertia ellipse 在 y 方向长、x 方向短');
}

// ---------- 图 10：mobile robot ----------
function mobile() {
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  const R = 1, vd = 0.3, wd = vd / R;
  const ref = (t) => { const a = wd * t; return [[R * Math.sin(a), R * (1 - Math.cos(a))], a]; };
  const simPoint = (d0, x0, T, refFn, dt = 1e-3) => {
    let [x, y, th] = x0; const out = [];
    for (let i = 0; i * dt < T; i++) {
      const t = i * dt; const [Pd, Pdd] = refFn(t, d0);
      const P = [x + d0 * Math.cos(th), y + d0 * Math.sin(th)];
      const c = Math.cos(th), s = Math.sin(th);
      const ux = Pdd[0] + (Pd[0] - P[0]), uy = Pdd[1] + (Pd[1] - P[1]);
      const v = c * ux + s * uy, w = (-s * ux + c * uy) / d0;
      if (i % 50 === 0) out.push([t, x, y, th]);
      x += v * c * dt; y += v * s * dt; th += w * dt;
    }
    return out;
  };
  const circRef = (t, d0) => { const [p, a] = ref(t); return [[p[0] + d0 * Math.cos(a), p[1] + d0 * Math.sin(a)], [vd * Math.cos(a) - d0 * wd * Math.sin(a), vd * Math.sin(a) + d0 * wd * Math.cos(a)]]; };
  const simKan = (x0, T, dt = 1e-3) => {
    let [x, y, th] = x0; const out = []; const a = 1, z = 0.7, k3 = 2 * z * a, k2 = (a * a) / (vd * vd);
    for (let i = 0; i * dt < T; i++) {
      const t = i * dt; const [p, thd] = ref(t);
      const dx = p[0] - x, dy = p[1] - y;
      const ex = Math.cos(th) * dx + Math.sin(th) * dy, ey = -Math.sin(th) * dx + Math.cos(th) * dy, et = wrap(thd - th);
      const v = vd * Math.cos(et) + ex, w = wd + k2 * vd * ey + k3 * Math.sin(et);
      if (i % 50 === 0) out.push([t, x, y, th]);
      x += v * Math.cos(th) * dt; y += v * Math.sin(th) * dt; th += w * dt;
    }
    return out;
  };
  let o = '';
  // 左 panel
  const S1 = 85, sx = (x) => 140 + S1 * x, sy = (y) => 218 - S1 * y;
  const rp = []; for (let i = 0; i <= 120; i++) { const a = (2 * Math.PI * i) / 120; rp.push([sx(R * Math.sin(a)), sy(R * (1 - Math.cos(a)))]); }
  o += path(d(rp), 'dash');
  const start = [0, -0.4, Math.PI / 2];
  const rk = simKan(start, 25), rpnt = simPoint(0.1, start, 25, circRef);
  o += path(d(rpnt.map((z) => [sx(z[1]), sy(z[2])])), 'ink') + path(d(rk.map((z) => [sx(z[1]), sy(z[2])])), 'ln');
  const tri = (X, Y, th, s, cls) => poly([[X + s * Math.cos(th), Y - s * Math.sin(th)], [X + 0.6 * s * Math.cos(th + 2.4), Y - 0.6 * s * Math.sin(th + 2.4)], [X + 0.6 * s * Math.cos(th - 2.4), Y - 0.6 * s * Math.sin(th - 2.4)]], cls);
  o += tri(sx(0), sy(-0.4), Math.PI / 2, 10, 'ink-f') + text(sx(0) - 12, sy(-0.4) + 6, 'robot 起点，朝上', 'ts', 'end');
  o += circle(sx(0), sy(0), 3, 'ink-f') + text(sx(0) - 8, sy(0) - 6, 'reference 起点', 'ts', 'end');
  o += text(140, 20, '跟踪 radius 1 m 的 circle', 'tb', 'middle');
  o += legend(20, 290, [['dash', 'reference']]) + legend(140, 290, [['ink', 'offset point']]) + legend(20, 310, [['ln', 'robot frame tracking']]);
  // 右 panel：直线，d>0 与 d<0 各画一行
  const lineRef = (t, d0) => [[vd * t + d0, 0], [vd, 0]];
  const S2 = 62, sx2 = (x) => 320 + S2 * x;
  o += text(430, 20, '沿 straight line 跟踪：P 在车前 / 车后', 'tb', 'middle');
  for (const [d0, cls, fcls, lab, base] of [[0.1, 'ln', 'ln-f', 'd = +0.1：车头朝前', 110], [-0.1, 'ink', 'ink-f', 'd = −0.1：P 也跟上了，但一路倒车', 230]]) {
    const sy2 = (y) => base - S2 * y;
    o += line(sx2(-0.2), sy2(0), sx2(3.6), sy2(0), 'dash');
    const r = simPoint(d0, [0, 0.3, Math.PI / 3], 12, lineRef);
    o += path(d(r.map((z) => [sx2(z[1]), sy2(z[2])])), cls);
    for (const tt of [0, 3, 6, 9, 11.5]) { const z = r[Math.round(tt * 20)]; o += tri(sx2(z[1]), sy2(z[2]), z[3], 9, fcls); }
    o += text(sx2(-0.2), base + 26, lab, 't');
  }
  o += text(430, 290, '三角形指向车头，每 3 s 画一个', 'ts', 'middle');
  return svg(560, 320, o, '左图：两种 controller 从同一个错位的起点出发，都收敛到 radius 1 米的 circle 形 reference 上。右图：offset point 取在车前时车头朝前，取在车后时 P 同样跟上 straight line 但车一路倒着开');
}

export default {
  'rb2203-bode': bode,
  'rb2203-pid': pid,
  'rb2203-windup': windup,
  'rb2203-dnoise': dnoise,
  'rb2203-rate': rate,
  'rb2203-flex': flex,
  'rb2203-profiles': profiles,
  'rb2203-armtrack': armtrack,
  'rb2203-task': task,
  'rb2203-mobile': mobile,
};
