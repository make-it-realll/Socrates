import { svg, svgA, anim, apath, acircle, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

const R = Math.PI / 180;
const fk2 = (t1, t2) => [Math.cos(t1) + Math.cos(t1 + t2), Math.sin(t1) + Math.sin(t1 + t2)];
const J2 = (t1, t2) => [[-Math.sin(t1) - Math.sin(t1 + t2), -Math.sin(t1 + t2)], [Math.cos(t1) + Math.cos(t1 + t2), Math.cos(t1 + t2)]];
const mv = (J, v) => [J[0][0] * v[0] + J[0][1] * v[1], J[1][0] * v[0] + J[1][1] * v[1]];
const solve2 = (J, V) => { const det = J[0][0] * J[1][1] - J[0][1] * J[1][0]; return [(J[1][1] * V[0] - J[0][1] * V[1]) / det, (-J[1][0] * V[0] + J[0][0] * V[1]) / det]; };
const fmt = (v, n = 3) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
// 画一条 planar arm：pts 是 joint 和 tip（米），P 把米变成像素；link 画成有厚度的条
const link = (a, b, w, cls) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * w / 2, ny = dx / L * w / 2;
  return d([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]) + 'Z';
};
const armD = (pts, P, w) => pts.slice(0, -1).map((p, i) => link(P(p), P(pts[i + 1]), w)).join('');

// ---------- 2 个 joint 的 box-constrained least squares：枚举 active set ----------
export function boxLS(J, V, lim) {
  let best = null;
  for (const a0 of [null, -1, 1]) for (const a1 of [null, -1, 1]) {
    const act = [a0, a1], v = [0, 0];
    act.forEach((s, i) => { if (s !== null) v[i] = s * lim; });
    const free = [0, 1].filter((i) => act[i] === null);
    const r = [V[0] - (J[0][0] * v[0] + J[0][1] * v[1]), V[1] - (J[1][0] * v[0] + J[1][1] * v[1])];
    if (free.length === 2) { const s = solve2(J, r); v[0] = s[0]; v[1] = s[1]; }
    else if (free.length === 1) { const i = free[0], c = [J[0][i], J[1][i]]; v[i] = (c[0] * r[0] + c[1] * r[1]) / (c[0] * c[0] + c[1] * c[1]); }
    if (Math.abs(v[0]) <= lim + 1e-12 && Math.abs(v[1]) <= lim + 1e-12) {
      const e = mv(J, v), cost = (e[0] - V[0]) ** 2 + (e[1] - V[1]) ** 2;
      if (!best || cost < best.cost - 1e-15) best = { cost, v };
    }
  }
  return best.v;
}
export const DRIFT = (() => {
  const q = [0.2, 1.2], J = J2(...q), V = [0.1, 0], lim = 0.06;
  const v = solve2(J, V), clip = v.map((x) => Math.max(-lim, Math.min(lim, x))), qp = boxLS(J, V, lim);
  const al = Math.min(1, lim / Math.max(...v.map(Math.abs))), dp = v.map((x) => al * x);
  return { q, J, V, lim, v, clip, qp, al, dp, Vclip: mv(J, clip), Vqp: mv(J, qp), Vdp: mv(J, dp) };
})();

// 开头第一次：tip 要以 0.1 m/s 往右，joint velocity 上限 0.06 rad/s
function drift() {
  const { q, v, clip, qp, dp, Vclip, Vqp, Vdp } = DRIFT;
  const u = 95, B = [40, 236], P = ([x, y]) => [B[0] + x * u, B[1] - y * u];
  const el = [Math.cos(q[0]), Math.sin(q[0])], tip = fk2(...q);
  let o = line(14, B[1] + 8, 230, B[1] + 8, 'axis');
  o += path(armD([[0, 0], el, tip], P, 10), 'wash-strong') + path(armD([[0, 0], el, tip], P, 10), 'ink');
  o += circle(...P([0, 0]), 6, 'paper') + circle(...P(el), 5, 'paper');
  const T = P(tip), k = 1500;
  const end = (W) => [T[0] + W[0] * k, T[1] - W[1] * k];
  o += arrow(T[0], T[1], ...end([0.1, 0]), 'mute');
  o += arrow(T[0], T[1], ...end(Vclip), 'ink') + arrow(T[0], T[1], ...end(Vqp), 'ink') + arrow(T[0], T[1], ...end(Vdp), 'ln');
  const e0 = end([0.1, 0]), e1 = end(Vclip), e2 = end(Vqp), e3 = end(Vdp);
  o += text(e0[0] + 6, e0[1] + 4, '要的', 'ts', 'start');
  o += text(e1[0] + 4, e1[1] - 6, 'clip', 'ts', 'start');
  o += text(e3[0] + 2, e3[1] + 16, 'max α', 'tl', 'start');
  o += text(e2[0] + 6, e2[1] + 8, 'QP', 'ts', 'start');
  o += text(T[0] - 8, T[1] - 10, 'tip', 'ts', 'end');
  o += text(P(el)[0] + 10, P(el)[1] + 14, 'joint 2', 'ts', 'start') + text(P([0, 0])[0], P([0, 0])[1] + 24, 'joint 1', 'ts', 'middle');
  const ang = (W) => Math.atan2(W[1], W[0]) / R;
  const X = 352; let y = 30;
  o += text(X, y, '|q̇ᵢ| 上限 0.06 rad/s', 'tb', 'start');
  const row = (name, w, W, cls) => {
    y += 24; o += text(X, y, name + '：(' + fmt(w[0]) + ', ' + fmt(w[1]) + ')', cls, 'start');
    if (W) { y += 16; o += text(X + 12, y, 'tip ' + Math.hypot(...W).toFixed(3) + ' m/s，' + (ang(W) > 0.05 ? '+' : '') + fmt(Math.abs(ang(W)) < 0.05 ? 0 : ang(W), 1) + '°', 'ts', 'start'); }
  };
  row('pseudoinverse', v, null, 't'); row('clip', clip, Vclip, 't'); row('QP', qp, Vqp, 't'); row('max α', dp, Vdp, 'tl');
  return svg(560, 264, o, '2R arm 在 q 等于 0.2、1.2 rad 时，tip 要以 0.1 m/s 向右；pseudoinverse 要求 joint 2 转 0.123 rad/s，超过 0.06 的上限。逐个 clip 让 tip 往上偏 16 度，QP 往下偏 18.9 度，max alpha 的写法方向不变、speed 降到 0.049 m/s');
}

// 第 2 站：q 空间里的 QP
function qpbox() {
  const sx = lin(-0.45, 0.6, 40, 315), sy = lin(-0.45, 0.6, 270, 20);
  let o = rect(sx(-0.3), sy(0.3), sx(0.3) - sx(-0.3), sy(-0.3) - sy(0.3), 'wash');
  o += axes({ sx, sy, x0: -0.45, x1: 0.6, y0: -0.45, y1: 0.6, xt: [-0.3, 0.3], yt: [-0.3, 0.3], xAt: 0, yAt: 0 });
  o += text(sx(0.6), sy(0) + 30, 'joint 1', 'ts', 'end') + text(sx(0) + 6, sy(0.6) + 10, 'joint 2', 'ts', 'start');
  const seg = (c) => { const pts = []; for (let a = -0.45; a <= 0.6 + 1e-9; a += 0.01) { const b = (c - a) / 2; if (b >= -0.45 && b <= 0.6) pts.push([sx(a), sy(b)]); } return d(pts); };
  o += path(seg(1), 'ln') + path(seg(0.9), 'dash') + path(seg(0.8), 'dash');
  o += text(sx(0.6) + 5, sy(0.2) + 4, '= 1（要的）', 'tl', 'start') + text(sx(0.6) + 5, sy(0.15) + 6, '= 0.9', 'ts', 'start') + text(sx(0.6) + 5, sy(0.1) + 8, '= 0.8', 'ts', 'start');
  const dot = (p, cls) => circle(sx(p[0]), sy(p[1]), 4.5, cls);
  o += dot([0.2, 0.4], 'paper') + dot([0.2, 0.3], 'ink-f') + dot([0.3, 0.3], 'ln-f');
  o += line(sx(0.2) + 4, sy(0.4) - 4, sx(0.27), sy(0.52), 'mute') + text(sx(0.28), sy(0.53), 'pseudoinverse (0.2, 0.4)', 'ts', 'start');
  o += text(sx(0.2) - 8, sy(0.3) + 16, 'clip (0.2, 0.3)', 'ts', 'end');
  o += line(sx(0.3) - 2, sy(0.3) + 5, sx(0.27), sy(0.15), 'mute') + text(sx(0.27), sy(0.12), 'QP (0.3, 0.3)', 'tl', 'end');
  o += text(sx(-0.29), sy(-0.26), '允许的 box', 'ts', 'start');
  const X = 400;
  o += text(X, 92, it('J') + ' = (1, 2)，要 1 m/s', 't', 'start');
  o += text(X, 114, '每个 joint ≤ 0.3 rad/s', 't', 'start');
  o += text(X, 148, 'clip：0.8，error² 0.04', 't', 'start');
  o += text(X, 170, 'QP：0.9，error² 0.01', 'tl', 'start');
  o += text(X, 204, 'clip 压回一个 joint，', 'ts', 'start') + text(X, 220, '没让另一个补上；', 'ts', 'start') + text(X, 236, 'QP 同时调两个。', 'ts', 'start');
  o += text(X, 270, '直线：1·v₁ + 2·v₂ = 常数', 'ts', 'start');
  return svg(560, 285, o, 'joint velocity plane 上的 box 是允许的范围；目标直线 v1 加 2 v2 等于 1 在 box 外。Pseudoinverse 的点 (0.2, 0.4) 出界，clip 到 (0.2, 0.3) 只达到 0.8，QP 取 box 的角 (0.3, 0.3) 达到 0.9');
}

// ---------- 第 2 站：joint limit 前要提前刹车 ----------
export function limitSim(kind) {
  const qmax = 1.57, vmax = 2, h = 0.01, dv = 0.1;
  const D = (v) => { let s = 0; for (let k = 1; v - k * dv > 1e-12; k++) s += h * (v - k * dv); return s; };
  let q = 1.0, v = 2.0; const out = [{ t: 0, q, v, inf: false }];
  for (let k = 1; k <= 60; k++) {
    const lo = Math.max(v - dv, -vmax), hi = Math.min(vmax, v + dv);
    let g;
    if (kind === 'one') g = (qmax - q) / h;
    else { let a = -vmax, b = vmax; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (q + h * m + D(Math.max(m, 0)) <= qmax + 1e-12) a = m; else b = m; } g = a; }
    const top = Math.min(hi, g), inf = top < lo - 1e-12, vn = inf ? lo : top;
    q += h * vn; v = vn; out.push({ t: k * h, q, v, inf });
  }
  return out;
}
function limitA() {
  const A = limitSim('one'), Bk = limitSim('brake'), slow = 10, T = 0.6 * slow + 2;
  const n = A.length, kt = [...A.map((s) => (s.t * slow) / T), 1];
  const qs = (S) => [...S.map((s) => s.q), S[n - 1].q];
  let o = '';
  const panel = (cx, S, title, cls) => {
    const cy = 150, L = 92, Q = qs(S);
    o += text(cx, 24, title, 'tb', 'middle');
    // hard stop：90° 处的挡块
    o += rect(cx - 30, cy - L - 22, 26, 14, 'wash2') + line(cx - 4, cy - L - 24, cx - 4, cy - 2, 'mute');
    o += text(cx - 34, cy - L - 10, 'limit 1.57', 'ts', 'end');
    const ds = Q.map((qq) => link([cx, cy], [cx + L * Math.cos(qq), cy - L * Math.sin(qq)], 12));
    o += apath(ds, kt, T, cls);
    o += circle(cx, cy, 7, 'paper');
    const st = S[0].q; o += path(d([[cx, cy], [cx + 40 * Math.cos(st), cy - 40 * Math.sin(st)]]), 'dash');
    o += text(cx + 46 * Math.cos(st) + 12, cy - 46 * Math.sin(st) + 12, 'start 1.0', 'ts', 'start');
  };
  panel(80, A, 'one-step guard', 'solid2');
  panel(240, Bk, 'braking envelope', 'solid');
  // 右：q(t)
  const sx = lin(0, 0.6, 330, 552), sy = lin(1.0, 1.8, 250, 40);
  o += axes({ sx, sy, x0: 0, x1: 0.6, y0: 1.0, y1: 1.8, xt: [0, 0.2, 0.4, 0.6], yt: [1.0, 1.2, 1.4, 1.6, 1.8], xl: 't（s）' });
  o += text(332, 30, it('q') + '（rad）', 'ts', 'start');
  o += line(sx(0), sy(1.57), sx(0.6), sy(1.57), 'ln-dash') + text(sx(0.6), sy(1.57) + 14, 'q_max', 'ts', 'end');
  o += path(d(A.map((s) => [sx(s.t), sy(s.q)])), 'mute') + path(d(Bk.map((s) => [sx(s.t), sy(s.q)])), 'ln');
  o += acircle([...A.map((s) => sx(s.t)), sx(0.6)], [...A.map((s) => sy(s.q)), sy(A[n - 1].q)], kt, T, 4, 'ink-f');
  o += acircle([...Bk.map((s) => sx(s.t)), sx(0.6)], [...Bk.map((s) => sy(s.q)), sy(Bk[n - 1].q)], kt, T, 4, 'ln-f');
  const mA = A.reduce((m, s) => (s.q > m.q ? s : m));
  o += text(sx(mA.t), sy(mA.q) - 8, 'one-step 冲到 ' + mA.q.toFixed(2), 'ts', 'middle');
  const b0 = Bk.find((s) => s.v < 2 - 1e-9);
  o += text(sx(b0.t) + 6, sy(b0.q) + 20, 'envelope 在 ' + b0.q.toFixed(2) + ' 开始减速', 'ts', 'start');
  o += text(160, 268, '慢放 10 倍：每 tick 0.01 s，velocity 每 tick 最多变 0.1 rad/s', 'ts', 'middle');
  return svgA(560, 280, o, '动图：一个 joint 以 2 rad/s 冲向 1.57 rad 的 limit。只看下一步的 guard 直到离 limit 0.02 rad 才要求减速，acceleration 上限让它刹不住，冲到 1.75 rad；braking envelope 在 1.40 rad 开始减速，正好停在 1.57');
}

// ---------- 第 1 站：monogram notation 的三个 frame ----------
const mono = (pre, base, sup, sb) => `<tspan class="sup" dy="-5">${pre}</tspan><tspan dy="5">${base}</tspan><tspan class="sup" dy="-5">${sup}</tspan>` + (sb ? `<tspan class="sub" dy="8">${sb}</tspan><tspan dy="-3">​</tspan>` : `<tspan dy="5">​</tspan>`);
function frames() {
  const u = 48, O = [40, 262], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  let o = '';
  const fr = (p, th, name, L, lab) => {
    const a = P(p);
    const ex = [a[0] + L * Math.cos(th), a[1] - L * Math.sin(th)], ey = [a[0] - L * Math.sin(th), a[1] - L * Math.cos(th)];
    o += arrow(a[0], a[1], ex[0], ex[1], 'ink') + arrow(a[0], a[1], ey[0], ey[1], 'ink');
    if (lab) o += text(ex[0] + 6 * Math.cos(th) + 10 * Math.sin(th), ex[1] - 6 * Math.sin(th) + 10 * Math.cos(th) + 4, 'x' + name, 'ts', 'middle') + text(ey[0] - 10 * Math.sin(th), ey[1] - 10 * Math.cos(th) + 4, 'y' + name, 'ts', 'middle');
    o += circle(a[0], a[1], 3.5, 'ink-f');
  };
  fr([0, 0], 0, 'W', 36, true);
  fr([2, 3], -Math.PI / 4, 'B', 36, true);
  fr([6, 4], (-2 * Math.PI) / 3, 'C', 28, false);
  o += text(P([0, 0])[0] - 6, P([0, 0])[1] + 16, 'W', 'tb', 'end');
  o += text(P([2, 3])[0] - 8, P([2, 3])[1] - 6, 'B (2, 3), −45°', 'ts', 'end');
  o += text(P([6, 4])[0], P([6, 4])[1] - 12, 'C (6, 4), −120°', 'ts', 'middle');
  const b = P([2, 3]), c = P([6, 4]);
  o += path(d([b, [c[0], b[1]], c]), 'dash');
  o += text((b[0] + c[0]) / 2, b[1] + 16, '4（沿 x_W）', 'ts', 'middle') + text(c[0] + 6, b[1] - 8, '1', 'ts', 'start');
  const th = -Math.PI / 4, k = [b[0] + 2.1213 * u * Math.cos(th), b[1] - 2.1213 * u * Math.sin(th)];
  o += path(d([b, k, c]), 'mute');
  o += text(k[0] - 4, k[1] + 16, '2.121 沿 x_B', 'ts', 'middle') + text((k[0] + c[0]) / 2 + 10, (k[1] + c[1]) / 2 + 14, '3.536 沿 y_B', 'ts', 'start');
  o += arrow(b[0], b[1], c[0], c[1], 'ln');
  o += `<text x="${f1((b[0] + c[0]) / 2 - 10)}" y="${f1((b[1] + c[1]) / 2 - 12)}" class="tl" text-anchor="end">${mono('B', 'p', 'C')}</text>`;
  const X = 390, row = (y, pre, sup, sb, val) => { o += `<text x="${X}" y="${y}" class="t" text-anchor="start">${mono(pre, 'p', sup, sb)} = ${val}</text>`; };
  o += text(X, 156, '同一根箭头，三种写法', 'tb', 'start');
  row(182, 'B', 'C', 'W', '(4.000, 1.000)');
  row(206, 'B', 'C', 'B', '(2.121, 3.536)');
  row(230, 'C', 'B', 'C', '(2.866, −2.964)');
  o += text(X, 256, '后两个不是相反数：', 'ts', 'start') + text(X, 272, 'expressed in 不同的 frame', 'ts', 'start');
  return svg(560, 280, o, 'plane 上三个 frame：W 在原点，B 在 (2, 3) 转 −45 度，C 在 (6, 4) 转 −120 度。从 B 指向 C 的箭头在 W 里的分量是 (4, 1)，在 B 里是 (2.121, 3.536)，从 C 指向 B 在 C 里是 (2.866, −2.964)');
}

// ---------- 第 1 站：pick and place 的 keyframe（动图） ----------
export const PICK = (() => {
  const G0 = [0.0, 0.40], pre = [0.15, 0.225], pick = [0.15, 0.135], clr = [0.40, 0.40], prep = [0.65, 0.225], plc = [0.65, 0.135];
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const t = [0]; t.push(10 * dist(G0, pre)); t.push(t[1] + 2); t.push(t[2] + 2); t.push(t[3] + 2);
  const tc = 10 * dist(pre, prep); t.push(t[4] + tc); t.push(t[5] + tc); t.push(t[6] + 2); t.push(t[7] + 2); t.push(t[8] + 2);
  const pos = [G0, pre, pick, pick, pre, clr, prep, plc, plc, prep];
  const gap = [0.107, 0.107, 0.107, 0.05, 0.05, 0.05, 0.05, 0.05, 0.107, 0.107];
  const names = ['initial', 'prepick', 'pick', 'close', 'postpick', 'clearance', 'preplace', 'place', 'open', 'postplace'];
  return { t, pos, gap, names, tc };
})();
function pickA() {
  const { t, pos, gap, names } = PICK, speed = 2, Tend = t[t.length - 1], T = Tend / speed + 1.5;
  const kt = [...t.map((x) => x / speed / T), 1];
  const P = ([x, z]) => [40 + (x + 0.05) * 600, 232 - z * 480];
  const seq = (arr) => [...arr, arr[arr.length - 1]];
  const ps = seq(pos), gs = seq(gap);
  // 物体：被抓住（close 之后、open 之前）时跟着 gripper
  const held = [false, false, false, true, true, true, true, true, false, false, false];
  const brick = ps.map((p, i) => (held[i] || i === 7 || i === 8 ? [p[0], p[1] - 0.11] : i <= 2 ? [0.15, 0.025] : [0.65, 0.025]));
  let o = line(20, P([0, 0])[1], 545, P([0, 0])[1], 'axis');
  o += text(P([0.15, 0])[0], P([0, 0])[1] + 16, 'pick 位置', 'ts', 'middle') + text(P([0.65, 0])[0], P([0, 0])[1] + 16, 'place 位置', 'ts', 'middle');
  // 路径
  o += path(d(pos.map(P)), 'dash');
  pos.forEach((p, i) => { if ([0, 1, 5, 6].includes(i)) { const q = P(p); o += circle(q[0], q[1], 2.5, 'mute-f'); } });
  o += text(P(pos[0])[0] + 52, P(pos[0])[1] + 10, 'initial', 'ts', 'start') + text(P(pos[1])[0] - 8, P(pos[1])[1] + 16, 'prepick', 'ts', 'end');
  o += text(P(pos[5])[0], P(pos[5])[1] - 10, 'clearance', 'ts', 'middle') + text(P(pos[6])[0] + 10, P(pos[6])[1] - 4, 'preplace', 'ts', 'start');
  // 砖
  const bw = 0.05, bh = 0.05;
  const brickD = brick.map(([x, z]) => { const a = P([x - bw / 2, z + bh / 2]), b = P([x + bw / 2, z - bh / 2]); return d([a, [b[0], a[1]], b, [a[0], b[1]]]) + 'Z'; });
  o += apath(brickD, kt, T, 'wash-strong');
  // gripper：body 在 origin 下方 0~3.6 cm，finger 长 8.2 cm、宽 1.2 cm
  const body = ps.map(([x, z]) => { const a = P([x - 0.073, z]), b = P([x + 0.073, z - 0.036]); return d([a, [b[0], a[1]], b, [a[0], b[1]]]) + 'Z'; });
  const finger = (s) => ps.map(([x, z], i) => { const g = gs[i] / 2, x0 = x + s * g, x1 = x + s * (g + 0.012); const a = P([Math.min(x0, x1), z - 0.036]), b = P([Math.max(x0, x1), z - 0.118]); return d([a, [b[0], a[1]], b, [a[0], b[1]]]) + 'Z'; });
  o += apath(body, kt, T, 'solid') + apath(finger(-1), kt, T, 'solid') + apath(finger(1), kt, T, 'solid');
  o += acircle(ps.map((p) => P(p)[0]), ps.map((p) => P(p)[1]), kt, T, 3, 'ink-f');
  // 时间轴
  const tx = lin(0, Tend, 40, 540), ty = 262;
  o += line(tx(0), ty, tx(Tend), ty, 'axis');
  t.forEach((x, i) => { o += line(tx(x), ty - 4, tx(x), ty + 4, 'axis'); });
  [0, 1, 4, 5, 6, 9].forEach((i) => { o += text(tx(t[i]), ty + 17, t[i].toFixed(1), 'ts', 'middle'); });
  o += text(tx(Tend), ty - 10, 's', 'ts', 'end');
  o += `<circle cx="${f1(tx(0))}" cy="${ty}" r="4.5" class="ln-f">${anim('cx', [...t.map((x) => f1(tx(x))), f1(tx(Tend))], kt, T)}</circle>`;
  // 当前段名
  names.forEach((nm, i) => {
    const on = kt.map((_, j) => j === i || (i === names.length - 1 && j === kt.length - 1));
    o += `<text x="540" y="30" class="tl" text-anchor="end">→ ${nm}${ashow(on, kt, T)}</text>`;
  });
  o += text(540, 48, '2 倍速；keyframe 之间 linear interpolation', 'ts', 'end');
  return svgA(560, 290, o, '动图：侧视的 gripper 从 initial 走到 prepick、下降到 pick、合上 finger、回到 postpick、经过 clearance 到 preplace、下降放下、张开、回到 postplace。下方时间轴标出 0、2.3、8.3、13.3、18.3、24.3 秒');
}

// ---------- 第 3 站：known correspondence 的 2D 例子 ----------
export const KAB = (() => {
  const m = [[0, 0], [3, 0], [0, 3]];
  const c = 0.8, s = 0.6, p = [4, 1];
  const sc = m.map(([x, y]) => [c * x - s * y + p[0], s * x + c * y + p[1]]);
  sc[2] = [sc[2][0] + 0.1, sc[2][1] - 0.1];
  const mean = (A) => [A.reduce((a, b) => a + b[0], 0) / A.length, A.reduce((a, b) => a + b[1], 0) / A.length];
  const mb = mean(m), sb = mean(sc);
  let Adot = 0, Bcr = 0;
  m.forEach((mi, i) => { const a = [mi[0] - mb[0], mi[1] - mb[1]], b = [sc[i][0] - sb[0], sc[i][1] - sb[1]]; Adot += a[0] * b[0] + a[1] * b[1]; Bcr += a[0] * b[1] - a[1] * b[0]; });
  const th = Math.atan2(Bcr, Adot), ct = Math.cos(th), st = Math.sin(th);
  const pst = [sb[0] - (ct * mb[0] - st * mb[1]), sb[1] - (st * mb[0] + ct * mb[1])];
  const fit = m.map(([x, y]) => [ct * x - st * y + pst[0], st * x + ct * y + pst[1]]);
  const res = fit.map((f, i) => Math.hypot(f[0] - sc[i][0], f[1] - sc[i][1]));
  return { m, sc, mb, sb, Adot, Bcr, th, pst, fit, res };
})();
function kabsch() {
  const { m, sc, mb, sb, th, fit } = KAB;
  const u = 50, O = [40, 250], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  let o = axes({ sx: (x) => O[0] + x * u, sy: (y) => O[1] - y * u, x0: -0.3, x1: 6.8, y0: -0.3, y1: 4.4, xt: [2, 4, 6], yt: [2, 4], xAt: 0, yAt: 0 });
  o += path(d(m.map(P)) + 'Z', 'mute') + path(d(fit.map(P)) + 'Z', 'ln-dash');
  const mlab = [[10, -8, 'start'], [6, 16, 'start'], [-8, 4, 'end']];
  m.forEach((p, i) => { const q = P(p); o += circle(q[0], q[1], 4.5, 'paper') + text(q[0] + mlab[i][0], q[1] + mlab[i][1], 'm' + (i + 1), 'ts', mlab[i][2]); });
  const slab = [[8, 16, 'start'], [9, 4, 'start'], [8, -6, 'start']];
  sc.forEach((p, i) => { const q = P(p); o += circle(q[0], q[1], 4.5, 'ink-f') + text(q[0] + slab[i][0], q[1] + slab[i][1], 's' + (i + 1) + ' (' + p[0].toFixed(1) + ', ' + p[1].toFixed(1) + ')', 'ts', slab[i][2]); });
  const a = P(mb), b = P(sb);
  o += text(a[0], a[1] + 4, '+', 'tb', 'middle') + text(b[0], b[1] + 4, '+', 'tl', 'middle');
  o += text(a[0] + 4, a[1] + 18, 'centroid', 'ts', 'start') + text(b[0] + 8, b[1] - 6, 'centroid', 'ts', 'start');
  o += arrow(a[0], a[1], b[0] - 4, b[1] + 2, 'mute');
  const X = 420;
  o += text(X, 40, 'θ* = ' + (th / R).toFixed(2) + '°', 'tl', 'start');
  o += text(X, 62, '真值 36.87°', 'ts', 'start') + text(X, 78, 's3 被挪了 (0.1, −0.1)', 'ts', 'start');
  o += text(X, 200, '空心：model', 'ts', 'start') + text(X, 216, '实心：scene', 'ts', 'start') + text(X, 232, '虚线：解出的 pose', 'ts', 'start');
  return svg(560, 270, o, '三个 model 点 (0,0)、(3,0)、(0,3) 与对应的三个 scene 点；把 model 的 centroid 移到 scene 的 centroid、再旋转 θ，虚线三角形与实心点几乎重合');
}

// ---------- 第 3 站：ICP（动图）：好的初值收敛，坏的初值卡住 ----------
const SEG = [[[0, 0], [4, 0]], [[0, 0], [0, 2]]];
const SCENE_O = (() => { const pts = []; for (let i = 0; i < 8; i++) pts.push([0.25 + i * 0.5, 0]); for (let j = 0; j < 4; j++) pts.push([0, 0.25 + j * 0.5]); return pts; })();
const tf = (th, p, pts) => pts.map(([x, y]) => [Math.cos(th) * x - Math.sin(th) * y + p[0], Math.sin(th) * x + Math.cos(th) * y + p[1]]);
const tfInv = (th, p, [x, y]) => { const dx = x - p[0], dy = y - p[1]; return [Math.cos(th) * dx + Math.sin(th) * dy, -Math.sin(th) * dx + Math.cos(th) * dy]; };
// model 是 L 形的两条 segment；correspondence 取 model surface 上离 scene 点最近的点
const closestOnL = (q) => { let best = null; for (const [a, b] of SEG) { const ab = [b[0] - a[0], b[1] - a[1]]; let t = ((q[0] - a[0]) * ab[0] + (q[1] - a[1]) * ab[1]) / (ab[0] ** 2 + ab[1] ** 2); t = Math.max(0, Math.min(1, t)); const c = [a[0] + t * ab[0], a[1] + t * ab[1]], dd = (c[0] - q[0]) ** 2 + (c[1] - q[1]) ** 2; if (!best || dd < best[0]) best = [dd, c]; } return best; };
export const ICP_TRUE = { th: 35 * R, p: [1.2, 0.6] };
export function icpRun(th0, p0, iters = 15) {
  const scene = tf(ICP_TRUE.th, ICP_TRUE.p, SCENE_O);
  let th = th0, p = [...p0]; const hist = [];
  for (let k = 0; k <= iters; k++) {
    const C = scene.map((s) => closestOnL(tfInv(th, p, s)));
    const rms = Math.sqrt(C.reduce((a, c) => a + c[0], 0) / C.length);
    const M = C.map((c) => c[1]);
    hist.push({ th, p: [...p], rms, M, Mw: tf(th, p, M) });
    const n = M.length;
    const mb = [M.reduce((a, b) => a + b[0], 0) / n, M.reduce((a, b) => a + b[1], 0) / n], sb = [scene.reduce((a, b) => a + b[0], 0) / n, scene.reduce((a, b) => a + b[1], 0) / n];
    let A = 0, B = 0;
    M.forEach((mi, i) => { const a = [mi[0] - mb[0], mi[1] - mb[1]], b = [scene[i][0] - sb[0], scene[i][1] - sb[1]]; A += a[0] * b[0] + a[1] * b[1]; B += a[0] * b[1] - a[1] * b[0]; });
    th = Math.atan2(B, A); p = [sb[0] - (Math.cos(th) * mb[0] - Math.sin(th) * mb[1]), sb[1] - (Math.sin(th) * mb[0] + Math.cos(th) * mb[1])];
  }
  return { scene, hist };
}
export const ICP_GOOD = [0, [0.8, 0.3]], ICP_BAD = [200 * R, [2.6, 2.2]];
function icpA() {
  const runs = [icpRun(...ICP_GOOD), icpRun(...ICP_BAD)], N = runs[0].hist.length, step = 0.5, T = N * step + 2;
  const kt = [], idx = []; for (let k = 0; k < N; k++) { kt.push(k * step / T); idx.push(k); } kt.push((N * step) / T); idx.push(N - 1); kt.push(1); idx.push(N - 1);
  let o = '';
  const panel = (x0, run, title) => {
    const u = 46, P = ([x, y]) => [x0 + 22 + (x + 0.7) * u, 236 - (y + 0.4) * u];
    o += text(x0 + 135, 22, title, 'tb', 'middle');
    const Lpts = [[4, 0], [0, 0], [0, 2]];
    o += apath(idx.map((k) => d(tf(run.hist[k].th, run.hist[k].p, Lpts).map(P))), kt, T, 'ln', true);
    run.scene.forEach((s, i) => {
      o += apath(idx.map((k) => d([P(s), P(run.hist[k].Mw[i])])), kt, T, 'ink', true);
    });
    run.scene.forEach((s) => { const q = P(s); o += circle(q[0], q[1], 3.4, 'ink-f'); });
    run.hist.forEach((h, k) => {
      const on = idx.map((j) => j === k);
      const th = ((h.th / R) % 360 + 540) % 360 - 180;
      o += `<text x="${x0 + 135}" y="262" class="ts" text-anchor="middle">iteration ${k}：θ = ${fmt(th, 1)}°，RMS = ${h.rms.toFixed(3)}${ashow(on, kt, T)}</text>`;
    });
  };
  panel(0, runs[0], '初值差 35°：收敛到真值');
  panel(280, runs[1], '初值差 165°：卡在别处');
  o += text(280, 284, '点：scene（真值 θ = 35°）；L 形线：当前估计下的 model；短线：每个点配到的 model 上的最近点', 'ts', 'middle');
  return svgA(560, 294, o, '动图：两次 ICP。左边初值转角差 35 度，几轮之后空心的 model 点与实心的 scene 点重合；右边初值差 165 度，correspondence 一直配错，停在 RMS 约 0.45 的位置');
}

// ---------- 第 4 站：PCA normal 与 depth 边缘 ----------
function normals() {
  const u = 1300, O = [280, 236], P = ([x, z]) => [O[0] + x * u, O[1] - z * u];
  let o = '';
  // table 与 box
  o += rect(P([-0.2, 0.1])[0], P([-0.2, 0.1])[1], 0.2 * u, 0.1 * u, 'wash2');
  o += line(P([-0.21, 0])[0], O[1], P([0.17, 0])[0], O[1], 'ink');
  o += text(P([-0.1, 0.05])[0], P([0, 0.05])[1] + 4, 'box', 'ts', 'middle') + text(P([0.12, 0])[0], O[1] + 16, 'table', 'ts', 'middle');
  // camera
  const cam = [0.0, 0.17]; const C = P(cam);
  o += poly([[C[0] - 12, C[1] - 8], [C[0] + 12, C[1] - 8], [C[0] + 6, C[1] + 6], [C[0] - 6, C[1] + 6]], 'solid2');
  o += text(C[0] + 18, C[1], 'depth camera', 'ts', 'start');
  // 点
  const pts = []; for (let x = -0.18; x <= 0.001; x += 0.02) pts.push([x, 0.1]); for (let x = 0.02; x <= 0.161; x += 0.02) pts.push([x, 0]);
  pts.forEach((p) => { const q = P(p); o += circle(q[0], q[1], 2.6, 'ink-f'); });
  // 边缘的 window：7 个点
  const win = [[-0.06, 0.1], [-0.04, 0.1], [-0.02, 0.1], [0, 0.1], [0.02, 0], [0.04, 0], [0.06, 0]];
  const cx = 0, cz = 0.4 / 7;
  o += rect(P([-0.07, 0.115])[0], P([-0.07, 0.115])[1], 0.14 * u, 0.13 * u, 'ln-dash');
  const n = [0.78751502, 0.61629546], c = P([cx, cz]);
  o += circle(c[0], c[1], 3, 'ln-f') + arrow(c[0], c[1], c[0] + 60 * n[0], c[1] - 60 * n[1], 'ln');
  o += path(d([P([cx - 0.07 * n[1], cz + 0.07 * n[0]]), P([cx + 0.07 * n[1], cz - 0.07 * n[0]])]), 'ln-dash');
  o += text(c[0] + 50 * n[0], c[1] - 60 * n[1] - 16, '倾斜 52°', 'tl', 'middle');
  // 平面上的 window
  const c2 = P([-0.14, 0.1]);
  o += rect(P([-0.19, 0.112])[0], P([-0.19, 0.112])[1], 0.1 * u, 0.024 * u, 'dash');
  o += arrow(c2[0], c2[1], c2[0], c2[1] - 52, 'ink') + text(c2[0] - 6, c2[1] - 56, '平的地方：竖直', 'ts', 'end');
  win.forEach((p) => { const q = P(p); o += circle(q[0], q[1], 2.6, 'ln-f'); });
  o += text(388, 100, '跨过 depth 边缘的', 'ts', 'start') + text(388, 116, 'window：4 点在 box 顶上，', 'ts', 'start') + text(388, 132, '3 点在 table 上', 'ts', 'start');
  return svg(560, 260, o, '侧视：depth camera 在上方，box 顶面和 table 上各有一排点。完全在 box 顶面上的 window 给出竖直的 normal；跨过 box 边缘的 7 个点拟合出一条斜线，normal 倾斜 52 度');
}

// ---------- 第 4 站：antipodal 采样（动图） ----------
export const ELL = { a: 0.05, b: 0.03, mu: 0.5 };
export function antipodal(tdeg) {
  const { a, b, mu } = ELL, t = tdeg * R;
  const p1 = [a * Math.cos(t), b * Math.sin(t)];
  let n1 = [Math.cos(t) / a, Math.sin(t) / b]; const ln = Math.hypot(...n1); n1 = [n1[0] / ln, n1[1] / ln];
  // 沿 −n1 射线和 ellipse 求交：p1 − s n1
  const A = (n1[0] / a) ** 2 + (n1[1] / b) ** 2, Bq = -2 * (p1[0] * n1[0] / a ** 2 + p1[1] * n1[1] / b ** 2);
  const s = -Bq / A; // 另一个根是 0
  const p2 = [p1[0] - s * n1[0], p1[1] - s * n1[1]];
  let n2 = [p2[0] / a ** 2, p2[1] / b ** 2]; const l2 = Math.hypot(...n2); n2 = [n2[0] / l2, n2[1] / l2];
  const ch = [(p1[0] - p2[0]) / s, (p1[1] - p2[1]) / s]; // 从 p2 指向 p1 的单位向量 = n1
  const ang1 = 0, ang2 = Math.acos(Math.min(1, -(n2[0] * ch[0] + n2[1] * ch[1]))) / R;
  const alpha = Math.atan(mu) / R;
  return { p1, p2, n1, n2, w: s, ang1, ang2, alpha, ok: ang2 <= alpha && s <= 0.107 };
}
export const ANTI_T = [0, 20, 45, 70, 90];
function antipodalA() {
  const { a, b } = ELL, cands = ANTI_T.map(antipodal), step = 2.2, T = cands.length * step;
  const kt = [], idx = []; cands.forEach((_, k) => { kt.push(k * step / T); idx.push(k); }); kt.push(1); idx.push(cands.length - 1);
  const u = 1900, O = [170, 150], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  let o = '';
  const ell = []; for (let k = 0; k <= 120; k++) { const t = (k / 120) * 2 * Math.PI; ell.push(P([a * Math.cos(t), b * Math.sin(t)])); }
  o += path(d(ell) + 'Z', 'wash') + path(d(ell) + 'Z', 'ink');
  o += text(O[0], O[1] + b * u + 22, '物体截面：10 cm × 6 cm 的 ellipse', 'ts', 'middle');
  const al = cands[0].alpha * R, L = 38;
  const cone = (p, n) => { const q = P(p), dir = [-n[0], -n[1]], rot = (v, s) => [v[0] * Math.cos(s) - v[1] * Math.sin(s), v[0] * Math.sin(s) + v[1] * Math.cos(s)]; const e1 = rot(dir, al), e2 = rot(dir, -al); return d([[q[0] + L * e1[0], q[1] - L * e1[1]], q, [q[0] + L * e2[0], q[1] - L * e2[1]]]); };
  // 每一项：两个 cone、chord、两根 finger
  const fing = (p, n) => { const q = P(p), w = 9, h = 26, c = [q[0] + n[0] * (w / 2 + 1), q[1] - n[1] * (w / 2 + 1)]; const tx = [-n[1], n[0]]; const pts = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([s, r]) => [c[0] + s * n[0] + r * tx[0], c[1] - s * n[1] - r * tx[1]]); return d(pts) + 'Z'; };
  const chordN = cands.map((c) => [c.n1[0], c.n1[1]]);
  o += apath(idx.map((k) => cone(cands[k].p1, cands[k].n1)), kt, T, 'ln', true);
  o += apath(idx.map((k) => cone(cands[k].p2, cands[k].n2)), kt, T, 'ln', true);
  o += apath(idx.map((k) => d([P(cands[k].p1), P(cands[k].p2)])), kt, T, 'dash', true);
  o += apath(idx.map((k) => fing(cands[k].p1, chordN[k])), kt, T, 'solid', true);
  o += apath(idx.map((k) => fing(cands[k].p2, [-chordN[k][0], -chordN[k][1]])), kt, T, 'solid', true);
  // 读数
  const X = 330;
  o += text(X, 34, 'μ = 0.5，cone 半角 α = ' + cands[0].alpha.toFixed(1) + '°', 'tb', 'start');
  cands.forEach((c, k) => {
    const on = idx.map((j) => j === k);
    o += `<text x="${X}" y="66" class="t" text-anchor="start">取 p₁ 在 t = ${ANTI_T[k]}°，沿 −n₁ 射到 p₂${ashow(on, kt, T)}</text>`;
    o += `<text x="${X}" y="90" class="t" text-anchor="start">宽度 ${(c.w * 100).toFixed(2)} cm（finger 最多张 10.7）${ashow(on, kt, T)}</text>`;
    o += `<text x="${X}" y="114" class="t" text-anchor="start">chord 与 n₁ 的 angle 0°${ashow(on, kt, T)}</text>`;
    o += `<text x="${X}" y="138" class="t" text-anchor="start">chord 与 n₂ 的 angle ${c.ang2.toFixed(1)}°${ashow(on, kt, T)}</text>`;
    o += `<text x="${X}" y="170" class="${c.ok ? 'tl' : 'tb'}" text-anchor="start">${c.ok ? '两端都在 cone 里：保留' : '超出 cone：丢掉'}${ashow(on, kt, T)}</text>`;
  });
  o += text(X, 206, 'V 形是两个 contact 的', 'ts', 'start') + text(X, 222, 'friction cone（朝物体里面）', 'ts', 'start');
  return svgA(560, 250, o, '动图：在 ellipse 截面上依次取 t 等于 0、20、45、70、90 度的点，沿 normal 反方向射到对面一点，检查 chord 和两端 normal 的 angle 是否在 26.6 度的 friction cone 内。0、70、90 度保留，20 和 45 度丢掉');
}

// ---------- 开头第二次 / 第 5 站：固定步长的 collision check 漏掉 post ----------
export const POST = { r: 1.5, ang: 45, rad: 0.08 };
const etaStraight = (th) => { const dA = Math.abs(th - POST.ang) * R; return POST.r * Math.sin(dA) - POST.rad; };
function edgemissA() {
  const u = 105, B = [60, 250], P = ([x, y]) => [B[0] + x * u, B[1] - y * u];
  const ths = []; for (let a = 40; a <= 50 + 1e-9; a += 0.25) ths.push(a);
  const pre = 0.8, sp = 0.5, T = pre + (ths.length - 1) * sp * 0.25 + 1.6;
  const ts = ths.map((_, i) => (pre + i * sp * 0.25) / T);
  const kt = [0, ...ts, 1], seq = [ths[0], ...ths, ths[ths.length - 1]];
  const half = Math.asin(POST.rad / POST.r) / R;
  let o = '';
  const pc = P([POST.r * Math.cos(POST.ang * R), POST.r * Math.sin(POST.ang * R)]);
  o += circle(pc[0], pc[1], POST.rad * u, 'solid2') + line(pc[0] + 6, pc[1] + 6, 236, 176, 'mute') + text(240, 180, 'post（半径 8 cm）', 'ts', 'start');
  // 两个 sample
  [40, 50].forEach((a) => { o += path(link(P([0, 0]), P([2 * Math.cos(a * R), 2 * Math.sin(a * R)]), 10), 'ln-dash'); });
  const tipAt = (a) => P([2.12 * Math.cos(a * R), 2.12 * Math.sin(a * R)]);
  o += text(tipAt(40)[0] + 4, tipAt(40)[1] + 6, '40°', 'tl', 'start') + text(tipAt(50)[0] - 2, tipAt(50)[1] - 4, '50°', 'tl', 'end');
  // 扫过去的 arm
  const hit = seq.map((a) => Math.abs(a - POST.ang) < half);
  o += apath(seq.map((a) => link(P([0, 0]), P([2 * Math.cos(a * R), 2 * Math.sin(a * R)]), 10)), kt, T, 'wash-strong');
  o += `<path d="${link(P([0, 0]), P([2 * Math.cos(seq[0] * R), 2 * Math.sin(seq[0] * R)]), 10)}" class="solid">${anim('d', seq.map((a) => link(P([0, 0]), P([2 * Math.cos(a * R), 2 * Math.sin(a * R)]), 10)), kt, T)}${ashow(hit, kt, T)}</path>`;
  o += circle(B[0], B[1], 6, 'paper') + text(B[0], B[1] + 20, 'base', 'ts', 'middle');
  const X = 330;
  o += text(X, 40, 'arm 伸直，绕 base 从 40° 转到 50°', 'tb', 'start');
  o += text(X, 66, '虚线：checker 查过的两个 sample，', 't', 'start') + text(X, 86, '都 free，于是报告整段 free', 't', 'start');
  o += text(X, 118, '实际在 ' + (45 - half).toFixed(2) + '° 到 ' + (45 + half).toFixed(2) + '° 之间', 'tl', 'start') + text(X, 138, 'arm 穿过 post（深色）', 'tl', 'start');
  return svgA(560, 270, o, '动图：伸直的 2R arm 绕 base 从 40 度扫到 50 度，post 位于 45 度方向、离 base 1.5 处。两端 sample 都不碰，但中间约 41.9 度到 48.1 度 arm 穿过 post');
}

// ---------- 第 5 站：Bézier 的 convex hull ----------
function bezier() {
  let o = '';
  // 左：C-space 里的 cubic Bézier 与它的 hull
  const cp = [[0.2, 0.3], [1.0, 2.2], [2.6, 2.4], [3.0, 0.6]];
  const sx = lin(0, 3.2, 30, 260), sy = lin(0, 2.8, 250, 40);
  const bz = (s) => { const w = [(1 - s) ** 3, 3 * (1 - s) ** 2 * s, 3 * (1 - s) * s * s, s ** 3]; return [w.reduce((a, wi, i) => a + wi * cp[i][0], 0), w.reduce((a, wi, i) => a + wi * cp[i][1], 0)]; };
  o += poly(cp.map(([x, y]) => [sx(x), sy(y)]), 'wash');
  o += path(d(cp.map(([x, y]) => [sx(x), sy(y)])), 'dash');
  const pts = []; for (let k = 0; k <= 80; k++) pts.push(bz(k / 80));
  o += path(d(pts.map(([x, y]) => [sx(x), sy(y)])), 'ln');
  cp.forEach(([x, y], i) => { o += circle(sx(x), sy(y), 4.5, 'paper') + (i === 0 ? text(sx(x) + 8, sy(y) + 16, 'c0', 'ts', 'start') : text(sx(x) + (i < 2 ? -8 : 8), sy(y) - 8, 'c' + i, 'ts', i < 2 ? 'end' : 'start')); });
  o += text(145, 22, 'curve 留在 control point 的 hull 里', 'tb', 'middle');
  o += text(sx(1.6), sy(1.2), 'hull', 'ts', 'middle');
  o += arrow(26, 270, 66, 270, 'mute') + arrow(26, 270, 26, 230, 'mute') + text(70, 274, it('q') + '₁', 'ts', 'start') + text(26, 224, it('q') + '₂', 'ts', 'middle');
  // 右：一个 joint，control point (0,0,1,1) 的 velocity
  const tx = lin(0, 1, 330, 540), ty = lin(0, 3.3, 250, 40);
  o += axes({ sx: tx, sy: ty, x0: 0, x1: 1, y0: 0, y1: 3.3, xt: [0, 0.5, 1], yt: [0, 1, 1.5, 2, 3], xl: it('s') + ' = ' + it('t') + '/' + it('T') });
  o += path(curve((s) => 6 * s - 6 * s * s, 0, 1, tx, ty), 'ln');
  o += path(d([[tx(0), ty(0)], [tx(0.5), ty(3)], [tx(1), ty(0)]]), 'dash');
  [[0, 0], [0.5, 3], [1, 0]].forEach(([s, v]) => { o += circle(tx(s), ty(v), 4.5, 'paper'); });
  o += line(tx(0), ty(3), tx(1), ty(3), 'grid');
  o += text(tx(0.5), ty(3) - 8, 'control point：3', 'ts', 'middle');
  o += circle(tx(0.5), ty(1.5), 3.5, 'ln-f') + text(tx(0.5), ty(0.6), '真正的最大值 1.5', 'ts', 'middle');
  o += text(435, 22, 'd' + it('q') + '/d' + it('s') + '：hull 给出的 bound 是 3', 'tb', 'middle');
  return svg(560, 285, o, '左：cubic Bézier 曲线和它四个 control point 围成的 convex hull，曲线完全在 hull 内。右：一个 joint 从 0 到 1，dq/ds 是 6s 减 6s 平方，最大 1.5；它的 control point 是 0、3、0，hull 给出的上界是 3');
}

// ---------- 第 6 站：z 方向用 position 还是 force ----------
function hybrid() {
  let o = '';
  const panel = (x0, title, est, fz, note1, note2) => {
    const top = 50, table = 170;
    o += text(x0 + 85, 24, title, 'tb', 'middle');
    o += rect(x0 + 5, table, 160, 22, 'wash2') + line(x0 + 5, table, x0 + 165, table, 'ink');
    o += line(x0 + 5, table - est, x0 + 165, table - est, 'ln-dash');
    o += text(x0 + 76, table - est + 14, est > 0 ? '估计：高 1 cm' : '估计：低 1 cm', 'ts', 'end');
    const fy = fz === null ? table - est - 9 : table - 9;
    o += rect(x0 + 78, top, 14, fy - top - 9, 'solid2') + circle(x0 + 85, fy, 9, 'solid');
    if (fz !== null) o += arrow(x0 + 85, fy + 9, x0 + 85, fy + 9 + Math.min(40, fz * 3), 'ln');
    o += text(x0 + 85, 226, note1, 'ts', 'middle') + text(x0 + 85, 244, note2, fz === null ? 'ts' : 'tl', 'middle');
    o += arrow(x0 + 104, fy - 2, x0 + 144, fy - 2, 'mute') + text(x0 + 124, fy - 12, it('x') + ' 方向擦', 'ts', 'middle');
  };
  panel(0, 'position：估计高了', 20, null, '悬在桌面上 1 cm', '根本没碰到');
  panel(190, 'position：估计低了', -20, 10, '压进 1 cm 的“error”', 'k_p × 0.01 = 10 N');
  panel(380, 'z 用 force', -20, 2, '不管桌面在哪', '始终压 2 N');
  return svg(560, 252, o, '三格：point finger 擦桌面。z 方向做 position control 时，桌面估计高 1 cm 就悬空，低 1 cm 就压出 10 N；z 方向做 force control 时始终压 2 N');
}

// ---------- 第 7 站：position target 与 velocity command（动图） ----------
function posvelA() {
  const vel = [0, 0, 0, 4, 4, 4, 4], pos = [0, 0, 0, 4, 2, 1, 0.5];
  const step = 0.9, T = vel.length * step + 1.2;
  const kt = [0, ...vel.map((_, i) => (i * step + 0.3) / T), 1];
  const sv = [0, ...vel, vel[vel.length - 1]], sp = [0, ...pos, pos[pos.length - 1]];
  const sx = lin(-1, 5, 60, 470);
  let o = '';
  const lane = (y, name, xs, trail, lab) => {
    o += text(20, y - 34, name, 'tb', 'start');
    o += line(sx(-1), y + 26, sx(5), y + 26, 'axis');
    for (let k = -1; k <= 5; k++) o += line(sx(k), y + 22, sx(k), y + 30, 'axis') + text(sx(k), y + 44, k + ' mm', 'ts', 'middle');
    o += line(sx(0), y - 22, sx(0), y + 26, 'ln-dash');
    // 静态的轨迹：之后会到的位置
    trail.forEach(([x, s]) => { o += circle(sx(x), y + 26, 3, 'mute-f') + text(sx(x), y + 14, s, 'ts', 'middle'); });
    const body = xs.map((x) => { const c = sx(x); return d([[c - 9, y - 18], [c + 9, y - 18], [c + 9, y + 4], [c - 9, y + 4]]) + 'Z'; });
    o += apath(body, kt, T, 'solid');
    lab.forEach(([s, i]) => { const on = kt.map((_, j) => j - 1 === i || (i === vel.length - 1 && j === kt.length - 1)); o += `<text x="545" y="${y}" class="ts" text-anchor="end">${s}${ashow(on, kt, T)}</text>`; });
  };
  lane(82, 'policy 一直输出“velocity = 0”', sv, [[4, '撞后一直在 4']], [['被撞到 4 mm', 3], ['还在 4', 4], ['还在 4', 5], ['还在 4', 6]]);
  lane(206, 'policy 一直输出“position target = 0”', sp, [[4, '4'], [2, '2'], [1, '1'], [0.5, '0.5']], [['被撞到 4 mm', 3], ['2 mm', 4], ['1 mm', 5], ['0.5 mm', 6]]);
  const bump = kt.map((_, j) => j === 4);
  o += `<text x="${sx(2)}" y="22" class="tl" text-anchor="middle">bump${ashow(bump, kt, T)}</text>`;
  o += text(280, 274, '虚线是要停的位置 0；灰点是被撞之后依次到达的位置（每次 update 0.1 s）', 'ts', 'middle');
  return svgA(560, 282, o, '动图：两只手都要停在 0 mm，被撞到 4 mm。输出 velocity 的那只继续收到 velocity 0，停在 4 mm；输出 position target 的那只每次 update 把 error 减半，回到 2、1、0.5 mm');
}

// ---------- 第 7 站：80% 对 60% 要多少次 trial ----------
export function wilson(k, n, z = 1.96) { const ph = k / n, den = 1 + z * z / n, c = (ph + z * z / (2 * n)) / den, hw = (z * Math.sqrt(ph * (1 - ph) / n + z * z / (4 * n * n))) / den; return [c - hw, c + hw]; }
function evalci() {
  const sx = lin(0, 1, 150, 540);
  let o = axes({ sx, sy: (y) => y, x0: 0, x1: 1, y0: 250, y1: 250, xt: [[0, '0'], [0.2, '20%'], [0.4, '40%'], [0.6, '60%'], [0.8, '80%'], [1, '100%']], xAt: 250, grid: false });
  for (const v of [0.2, 0.4, 0.6, 0.8]) o += line(sx(v), 30, sx(v), 250, 'grid');
  const rows = [[5, 4, 3, '1.00'], [10, 8, 6, '0.628'], [100, 80, 60, '0.003']];
  rows.forEach(([n, a, b, p], i) => {
    const y = 60 + i * 70;
    o += text(20, y + 10, 'N = ' + n + ' 次', 'tb', 'start') + text(20, y + 28, 'Fisher p = ' + p, 'ts', 'start');
    const ca = wilson(a, n), cb = wilson(b, n);
    o += line(sx(ca[0]), y, sx(ca[1]), y, 'ln') + circle(sx(a / n), y, 4.5, 'ln-f') + text(sx(ca[1]) + 6, y + 4, 'A ' + a + '/' + n, 'ts', 'start');
    o += line(sx(cb[0]), y + 20, sx(cb[1]), y + 20, 'ink-b') + circle(sx(b / n), y + 20, 4.5, 'ink-f') + text(sx(cb[1]) + 6, y + 24, 'B ' + b + '/' + n, 'ts', 'start');
  });
  return svg(560, 272, o, '三组实验，A 都是 80%、B 都是 60%。N 等于 5 和 10 时两个 interval 大部分重叠，Fisher exact test 的 p 是 1.00 和 0.628；N 等于 100 时 interval 分开，p 等于 0.003');
}

export default {
  'm4210-drift': drift,
  'm4210-edgemiss': edgemissA,
  'm4210-frames': frames,
  'm4210-pick': pickA,
  'm4210-qp': qpbox,
  'm4210-limit': limitA,
  'm4210-kabsch': kabsch,
  'm4210-icp': icpA,
  'm4210-normals': normals,
  'm4210-antipodal': antipodalA,
  'm4210-bezier': bezier,
  'm4210-hybrid': hybrid,
  'm4210-posvel': posvelA,
  'm4210-evalci': evalci,
};
