import { svg, svgA, anim, animRot, apath, acircle, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// ---------- 共用：pendulum（m = l = 1，g = 9.81）与数值工具 ----------
const G = 9.81, UMAX = 2;
const wrap = (a) => ((((a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
const fmt = (v, n = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
const fz = (v) => (Math.abs(v) < 5e-5 ? '0.0000' : fmt(v, 4));
const clip = (v, m) => Math.max(-m, Math.min(m, v));
function rk4(f, x, u, dt) {
  const k1 = f(x, u), k2 = f(x.map((v, i) => v + dt / 2 * k1[i]), u), k3 = f(x.map((v, i) => v + dt / 2 * k2[i]), u), k4 = f(x.map((v, i) => v + dt * k3[i]), u);
  return x.map((v, i) => v + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
}
const pend = (b = 0) => (x, u) => [x[1], u - G * Math.sin(x[0]) - b * x[1]];
// 2×2 continuous-time Riccati：Newton（Kleinman）迭代，A、B 是 2×2 和 2×1
function care2(A, B, Q, r, K0) {
  let K = K0.slice(), S = null;
  for (let it = 0; it < 60; it++) {
    const Ac = [[A[0][0] - B[0] * K[0], A[0][1] - B[0] * K[1]], [A[1][0] - B[1] * K[0], A[1][1] - B[1] * K[1]]];
    const M = [[Q[0][0] + r * K[0] * K[0], Q[0][1] + r * K[0] * K[1]], [Q[1][0] + r * K[1] * K[0], Q[1][1] + r * K[1] * K[1]]];
    S = lyap2(Ac, M);
    K = [(B[0] * S[0][0] + B[1] * S[1][0]) / r, (B[0] * S[0][1] + B[1] * S[1][1]) / r];
  }
  return { K, S };
}
// 解 AcᵀS + S Ac + M = 0（2×2 symmetric），三个 unknown 的 linear system
function lyap2(Ac, M) {
  const [[a, b], [c, e]] = Ac;
  // unknown s = (s1, s2, s3)，S = [[s1, s2], [s2, s3]]
  const L = [[2 * a, 2 * c, 0], [b, a + e, c], [0, 2 * b, 2 * e]], rhs = [-M[0][0], -M[0][1], -M[1][1]];
  const s = solveN(L, rhs);
  return [[s[0], s[1]], [s[1], s[2]]];
}
function solveN(A0, b0) {
  const n = b0.length, A = A0.map((r) => r.slice()), b = b0.slice();
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
    for (let i = k + 1; i < n; i++) { const m = A[i][k] / A[k][k]; for (let j = k; j < n; j++) A[i][j] -= m * A[k][j]; b[i] -= m * b[k]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return x;
}
// 倒立点的 LQR：A = [[0,1],[g,0]]，B = [0,1]，Q = diag(10,1)，R = 1
const TOP = care2([[0, 1], [G, 0]], [0, 1], [[10, 0], [0, 1]], 1, [30, 10]);
const Vtop = (tb, wd) => TOP.S[0][0] * tb * tb + 2 * TOP.S[0][1] * tb * wd + TOP.S[1][1] * wd * wd;
const uLqr = (x) => clip(-(TOP.K[0] * wrap(x[0] - Math.PI) + TOP.K[1] * x[1]), UMAX);
// sampling 估计 ρ：在网格上找 V̇ ≥ 0 的点里 V 最小的那个
function rhoEst() {
  let best = Infinity;
  for (let i = -150; i <= 150; i++) for (let j = -150; j <= 150; j++) {
    const tb = i * 0.01, wd = j * 0.04; if (!i && !j) continue;
    const u = clip(-(TOP.K[0] * tb + TOP.K[1] * wd), UMAX), acc = u + G * Math.sin(tb); // θ = π + θ̄：−g sin θ = g sin θ̄
    const vd = 2 * ((TOP.S[0][0] * tb + TOP.S[0][1] * wd) * wd + (TOP.S[0][1] * tb + TOP.S[1][1] * wd) * acc);
    if (vd >= 0) best = Math.min(best, Vtop(tb, wd));
  }
  return best;
}
const RHO = rhoEst();
// 画一个 pendulum：pivot (px, py)，rod 长 L，角度 θ 从正下方逆时针量
function pendBody(px, py, L, cls = 'ink-b', bob = 9) {
  return line(px, py, px, py + L, cls) + circle(px, py + L, bob, 'solid') + circle(px, py, 4, 'paper');
}
function ellipsePts(rho, sx, sy, n = 720) {
  // V(θ̄, ω) = ρ 的 boundary：沿 direction (cos t, sin t) 找 radius
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const t = 2 * Math.PI * k / n, c = Math.cos(t), s = Math.sin(t);
    const r = Math.sqrt(rho / Vtop(c, s));
    pts.push([sx(r * c), sy(r * s)]);
  }
  return pts;
}

// ---------- 开头第一次失败：2 N·m 的 torque 举不起 9.81 N·m 的 gravity torque ----------
function limit() {
  // constant torque u 从 θ=0 静止出发：最高到 θ_max，满足 u θ = g (1 − cos θ)
  let lo = 0.01, hi = 1.5;
  for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; (UMAX * m - G * (1 - Math.cos(m)) > 0 ? (lo = m) : (hi = m)); }
  const thMax = lo, thEq = Math.asin(UMAX / G);
  const px = 150, py = 110, L = 86;
  const P = (th, r = L) => [px + r * Math.sin(th), py + r * Math.cos(th)];
  let o = circle(px, py, L, 'grid');
  // 能到达的范围
  const arc = [[px, py]]; for (let k = 0; k <= 30; k++) arc.push(P(thMax * k / 30, L + 14));
  o += path(d(arc) + 'Z', 'wash');
  o += path(d([[px, py], P(Math.PI, L)]), 'dash') + circle(...P(Math.PI), 9, 'paper');
  o += text(px, py - L - 18, 'upright（目标）', 'ts', 'middle');
  o += path(d([[px, py], P(thEq)]), 'mute');
  o += pendBody(px, py, L).replace(`<line`, `<g transform="rotate(${f1(-thMax / Math.PI * 180)} ${px} ${py})"><line`).replace(/(<circle[^>]*class="solid"\/>)/, '$1</g>');
  o += text(P(thMax, L + 22)[0] + 6, P(thMax, L + 22)[1] + 6, `最高 ${(thMax / Math.PI * 180).toFixed(1)}°`, 'tl', 'start');
  o += text(px, py + L + 32, '正下方 θ = 0', 'ts', 'middle');
  const X = 330;
  o += text(X, 40, 'm = 1 kg，l = 1 m，g = 9.81 m/s²', 't') + text(X, 62, '把 pendulum 横着举住要 mgl = 9.81 N·m', 't');
  o += text(X, 84, 'motor 最多给 ' + it('u') + '<tspan class="sub" dy="3">max</tspan><tspan dy="-3"> = 2 N·m</tspan>', 't');
  o += text(X, 120, 'PD 往上拉：torque 一直顶在 2 N·m，', 'ts') + text(X, 138, `pendulum 在 0° 到 ${(thMax / Math.PI * 180).toFixed(1)}° 之间来回摆，`, 'ts') + text(X, 156, '永远到不了 180°。', 'ts');
  o += text(X, 174, `灰色细线：balance 点 ${(thEq / Math.PI * 180).toFixed(1)}°`, 'ts');
  o += text(X, 200, '能到 180° 的办法只有一个：', 'ts') + text(X, 218, '顺着摆动方向加 torque，攒 energy。', 'ts');
  return svg(560, 245, o, `torque 上限 2 N·m 的 pendulum：一直用最大 torque 往上拉，最高只到 ${(thMax / Math.PI * 180).toFixed(1)} 度，balance 点在 ${(thEq / Math.PI * 180).toFixed(1)} 度`);
}

// ---------- 开头第二次失败：cart-pole 的 LQR 只在 upright 附近管用 ----------
const CP = { mc: 0.5, mp: 0.2, l: 0.3 };
function cartpoleK() {
  // 4 维 LQR：用 Kleinman 迭代 + 4×4 Lyapunov（Kronecker 展开 16 个 unknown）
  const { mc, mp, l } = CP, M = [[mc + mp, -mp * l], [-mp * l, mp * l * l]], det = M[0][0] * M[1][1] - M[0][1] * M[1][0];
  const Mi = [[M[1][1] / det, -M[0][1] / det], [-M[1][0] / det, M[0][0] / det]];
  const A = [[0, 0, 1, 0], [0, 0, 0, 1], [0, Mi[0][1] * mp * G * l, 0, 0], [0, Mi[1][1] * mp * G * l, 0, 0]];
  const B = [0, 0, Mi[0][0], Mi[1][0]], Q = [10, 10, 1, 1];
  let K = [-1, 30, -2, 5];
  for (let itn = 0; itn < 40; itn++) {
    const Ac = A.map((r, i) => r.map((v, j) => v - B[i] * K[j]));
    // AcᵀS + S Ac = −(Q + KᵀK)
    const n = 4, L = [], rhs = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const row = new Array(16).fill(0);
      for (let k = 0; k < n; k++) { row[k * n + j] += Ac[k][i]; row[i * n + k] += Ac[k][j]; }
      L.push(row); rhs.push(-((i === j ? Q[i] : 0) + K[i] * K[j]));
    }
    const s = solveN(L, rhs), S = [0, 1, 2, 3].map((i) => [0, 1, 2, 3].map((j) => s[i * 4 + j]));
    K = [0, 1, 2, 3].map((j) => B.reduce((acc, b, i) => acc + b * S[i][j], 0));
  }
  return { A, B, K };
}
const CPK = cartpoleK();
function cpDyn(x, f) {
  const { mc, mp, l } = CP, s = Math.sin(x[1]), c = Math.cos(x[1]), den = mc + mp * s * s;
  return [x[2], x[3], (f + mp * s * (l * x[3] * x[3] + G * c)) / den, (-f * c - mp * l * x[3] * x[3] * c * s - (mc + mp) * G * s) / (l * den)];
}
function cpSim(deg, T = 4, dt = 0.002) {
  let x = [0, Math.PI + deg * Math.PI / 180, 0, 0];
  const ts = [], xs = [], ths = [];
  for (let i = 0; i <= T / dt; i++) {
    if (i % 10 === 0) { ts.push(i * dt); xs.push(x[0]); ths.push(x[1]); }
    const xb = [x[0], x[1] - Math.PI, x[2], x[3]], f = -CPK.K.reduce((a, k, j) => a + k * xb[j], 0);
    x = rk4(cpDyn, x, f, dt);
    if (Math.abs(x[1] - Math.PI) > 2.5) { ts.push((i + 1) * dt); xs.push(x[0]); ths.push(x[1]); return { ts, xs, ths, fell: true }; }
  }
  return { ts, xs, ths, fell: false };
}
function cart() {
  let o = '';
  // 左：cart-pole 本身
  const u = 150, gy = 168, cx = 140, Px = (x) => cx + x * u;
  o += line(Px(-0.62), gy, Px(0.62), gy, 'axis');
  for (const e of [-0.5, 0.5]) o += rect(Px(e) - (e < 0 ? 8 : 0), gy - 26, 8, 30, 'wash2') + text(Px(e), gy + 18, (e < 0 ? '−' : '') + '0.5 m', 'ts', 'middle');
  o += text(Px(0), gy + 18, '0', 'ts', 'middle');
  const cw = 56, ch = 26, top = gy - 6 - ch;
  o += rect(Px(0) - cw / 2, top, cw, ch, 'paper', 4) + circle(Px(0) - 16, gy - 4, 4, 'paper') + circle(Px(0) + 16, gy - 4, 4, 'paper');
  const piv = [Px(0), top + 6], Lp = 0.3 * u * 1.9;
  const tip = (deg) => [piv[0] + Lp * Math.sin(deg * Math.PI / 180), piv[1] - Lp * Math.cos(deg * Math.PI / 180)];
  o += path(d([piv, tip(0)]), 'dash');
  o += path(d([piv, tip(-30)]), 'ink-b') + circle(...tip(-30), 6, 'solid') + circle(...piv, 3.5, 'paper');
  const a0 = tip(0), arcp = []; for (let k = 0; k <= 12; k++) { const dd = -30 * k / 12; const p = [piv[0] + 46 * Math.sin(dd * Math.PI / 180), piv[1] - 46 * Math.cos(dd * Math.PI / 180)]; arcp.push(p); }
  o += path(d(arcp), 'mute') + text(piv[0] - 30, piv[1] - 54, 'θ̄ = 30°', 'ts', 'end');
  o += arrow(Px(0) - cw / 2 - 40, top + 13, Px(0) - cw / 2 - 4, top + 13, 'ink') + text(Px(0) - cw / 2 - 44, top + 17, it('f'), 't', 'end');
  o += arrow(Px(0), gy + 30, Px(0) + 38, gy + 30, 'mute') + text(Px(0) + 42, gy + 34, it('x'), 't', 'start');
  o += text(a0[0] + 6, a0[1] - 2, 'upright', 'ts', 'start');
  o += text(140, 236, 'cart 0.5 kg，pole 0.2 kg、0.3 m，rail ±0.5 m', 'ts', 'middle');
  // 右：cart position x(t)
  const sx = lin(0, 4, 330, 548), sy = lin(-2.4, 0.8, 222, 22);
  o += axes({ sx, sy, x0: 0, x1: 4, y0: -2.4, y1: 0.8, xt: [0, 1, 2, 3, 4], yt: [[-2, '−2'], [-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5']], xl: 't（s）', yl: 'cart 的 x（m）' });
  o += line(sx(0), sy(-0.5), sx(4), sy(-0.5), 'ln-dash') + line(sx(0), sy(0.5), sx(4), sy(0.5), 'ln-dash');
  const labs = [];
  for (const [deg, cls] of [[20, 'ink'], [30, 'ink-b'], [60, 'mute'], [70, 'dash']]) {
    const r = cpSim(deg), pts = [];
    for (let i = 0; i < r.ts.length; i++) { const y = Math.max(-2.4, Math.min(0.8, r.xs[i])); pts.push([sx(r.ts[i]), sy(y)]); if (y !== r.xs[i]) break; }
    o += path(d(pts), cls);
    const mn = Math.min(...r.xs);
    labs.push([deg, r, mn, pts]);
  }
  const [r20, r30, r60, r70] = labs;
  const lab = (L, tx, ty, str, cls) => {
    const r = L[1], im = r.xs.indexOf(L[2]), p = [sx(r.ts[im]), sy(r.xs[im])];
    o += line(p[0] + 3, p[1] + 2, tx - 4, ty - 4, 'grid') + text(tx, ty, str, cls, 'start');
  };
  lab(r20, sx(1.9), sy(-0.85), `20°：最远 ${fmt(Math.abs(r20[2]))} m`, 'ts');
  lab(r30, sx(1.9), sy(-1.2), `30°：${fmt(Math.abs(r30[2]))} m，撞 rail`, 'tl');
  lab(r60, sx(1.9), sy(-1.75), `60°：要 ${fmt(Math.abs(r60[2]), 1)} m`, 'ts');
  const e70 = r70[3][r70[3].length - 1];
  o += text(e70[0] + 16, sy(-2.3), r70[1].fell ? '70°：倒下' : '70°', 'ts', 'start');
  return svg(560, 262, o, `cart-pole 用 LQR 从不同初始倾角回到 upright：20 度时 cart 最远走 ${fmt(Math.abs(r20[2]))} 米，30 度时 ${fmt(Math.abs(r30[2]))} 米，超出 0.5 米的 rail，60 度要 ${fmt(Math.abs(r60[2]), 1)} 米，70 度直接倒下`);
}

// ---------- 第 1 站：overdamped pendulum 的一维 flow ----------
function flow() {
  let o = '';
  const panel = (y0, u0, title) => {
    const sx = lin(-Math.PI * 1.25, Math.PI * 1.25, 40, 540), sy = lin(-1.8, 1.8, y0 + 100, y0 + 10);
    o += text(40, y0, title, 'tb');
    o += line(sx(-Math.PI * 1.25), sy(0), sx(Math.PI * 1.25), sy(0), 'axis');
    for (const v of [-Math.PI, 0, Math.PI]) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), sy(0) + 34, v === 0 ? '0' : (v < 0 ? '−π' : 'π'), 'ts', 'middle');
    o += path(curve((x) => u0 - Math.sin(x), -Math.PI * 1.25, Math.PI * 1.25, sx, sy), 'ln');
    o += text(sx(Math.PI * 1.25), sy(u0 - Math.sin(Math.PI * 1.25)) - 8, 'dx/dt', 'ts', 'end');
    // fixed points
    const fps = [];
    if (u0 < 1) { const a = Math.asin(u0); for (const r of [a - 2 * Math.PI, a, Math.PI - a - 2 * Math.PI, Math.PI - a]) if (Math.abs(r) <= Math.PI * 1.25) fps.push(r); }
    fps.sort((a, b) => a - b);
    for (const r of fps) { const stable = Math.cos(r) > 0; o += circle(sx(r), sy(0), 5, stable ? 'ink-f' : 'paper'); }
    // flow 的方向
    const edges = [-Math.PI * 1.25, ...fps, Math.PI * 1.25];
    for (let i = 0; i < edges.length - 1; i++) {
      const m = (edges[i] + edges[i + 1]) / 2, v = u0 - Math.sin(m), w = Math.min(22, (sx(edges[i + 1]) - sx(edges[i])) / 3);
      o += v > 0 ? arrow(sx(m) - w / 2, sy(0) + 16, sx(m) + w / 2, sy(0) + 16, 'ink') : arrow(sx(m) + w / 2, sy(0) + 16, sx(m) - w / 2, sy(0) + 16, 'ink');
    }
    return { fps, sx, sy };
  };
  const p1 = panel(14, 0, '没有 torque：b dx/dt = −mgl sin x');
  o += text(p1.sx(0), p1.sy(0) - 12, 'stable', 'ts', 'middle') + text(p1.sx(Math.PI), p1.sy(0) - 12, 'unstable', 'ts', 'middle');
  const p2 = panel(168, 0.6, '加 constant torque u₀ = 0.6 mgl');
  const a = Math.asin(0.6);
  o += text(p2.sx(a), p2.sy(0) - 12, `${(a / Math.PI * 180).toFixed(1)}°`, 'ts', 'middle') + text(p2.sx(Math.PI - a), p2.sy(0) - 12, `${(180 - a / Math.PI * 180).toFixed(1)}°`, 'ts', 'middle');
  o += text(40, 310, '实心点 stable、空心点 unstable；u₀ 增大，每对点相互靠近，u₀ = mgl 时合并后消失。', 'ts');
  return svg(560, 318, o, '一维 overdamped pendulum 的 flow：没有 torque 时 0 是 stable、π 是 unstable；加 0.6 mgl 的 torque 后两个 fixed point 移到 36.9 度和 143.1 度');
}

// ---------- 第 1 站：damped pendulum 的 phase portrait（动图） ----------
function phaseA() {
  const b = 0.25, dt = 0.01, T = 10;
  let x = [0, 6.8];
  const tr = [x.slice()];
  for (let i = 0; i < T / dt; i++) { x = rk4(pend(b), x, 0, dt); tr.push(x.slice()); }
  const sx = lin(-Math.PI, 3 * Math.PI, 214, 552), sy = lin(-8, 8, 230, 22);
  let o = '';
  // undamped 的 energy contour（E = ½ω² − g cos θ）
  for (const E of [-7, -4, 0, 4, 9.81, 16, 24]) {
    for (const sg of [1, -1]) {
      const pts = [];
      for (let k = 0; k <= 400; k++) {
        const th = -Math.PI + 4 * Math.PI * k / 400, w2 = 2 * (E + G * Math.cos(th));
        if (w2 >= 0) pts.push([sx(th), sy(sg * Math.sqrt(w2))]); else if (pts.length) { o += path(d(pts), E === 9.81 ? 'ink' : 'grid'); pts.length = 0; }
      }
      if (pts.length) o += path(d(pts), E === 9.81 ? 'ink' : 'grid');
    }
  }
  o += axes({ sx, sy, x0: -Math.PI, x1: 3 * Math.PI, y0: -8, y1: 8, xt: [[-Math.PI, '−π'], [0, '0'], [Math.PI, 'π'], [2 * Math.PI, '2π'], [3 * Math.PI, '3π']], yt: [[-8, '−8'], [-4, '−4'], [0, '0'], [4, '4'], [8, '8']], xAt: -8, yAt: -Math.PI, xl: 'θ（rad）', yl: 'dθ/dt（rad/s）' });
  for (const v of [0, 2 * Math.PI]) o += circle(sx(v), sy(0), 4.5, 'ink-f');
  for (const v of [-Math.PI, Math.PI, 3 * Math.PI]) o += circle(sx(v), sy(0), 4.5, 'paper');
  o += text(sx(2 * Math.PI), sy(7.1), 'separatrix E = mgl', 'ts', 'middle');
  o += path(d(tr.map(([a, w]) => [sx(a), sy(w)])), 'mute');
  // 动画：每 0.05 s 一帧
  const idx = []; for (let i = 0; i < tr.length; i += 5) idx.push(i);
  const kt = idx.map((i) => i / (tr.length - 1));
  o += acircle(idx.map((i) => sx(tr[i][0])), idx.map((i) => sy(tr[i][1])), kt, T, 5, 'ln-f');
  // 左：pendulum
  const px = 100, py = 120, L = 70;
  o += circle(px, py, L, 'grid');
  o += `<g>${animRot(idx.map((i) => -tr[i][0] * 180 / Math.PI), px, py, kt, T)}${line(px, py, px, py + L, 'ink-b')}${circle(px, py + L, 9, 'solid')}</g>` + circle(px, py, 4, 'paper');
  o += text(px, 22, 'b = 0.25，dθ/dt(0) = 6.8 rad/s', 'ts', 'middle');
  o += text(px, 222, '翻过顶一次，', 'ts', 'middle') + text(px, 238, '然后绕 θ = 2π 收进去', 'ts', 'middle');
  return svgA(560, 266, o, '动图：damped pendulum 从最低点以 6.8 rad/s 出发，在 phase portrait 上越过 separatrix 一次，然后绕着 2π 处的 stable fixed point 收进去；灰线是 undamped 时的 energy contour');
}

// ---------- 第 2 站：energy shaping 加 LQR 的 swing-up（动图） ----------
function swingSim(k = 1, T = 9, dt = 0.002) {
  let x = [0.1, 0], mode = 0, tsw = null;
  const tr = [], modes = [], us = [];
  for (let i = 0; i <= T / dt; i++) {
    const tb = wrap(x[0] - Math.PI);
    if (!mode && Vtop(tb, x[1]) < RHO) { mode = 1; tsw = i * dt; }
    const Et = 0.5 * x[1] * x[1] - G * Math.cos(x[0]) - G;
    const u = mode ? uLqr(x) : clip(-k * x[1] * Et, UMAX);
    tr.push(x.slice()); modes.push(mode); us.push(u);
    x = rk4(pend(0), x, u, dt);
  }
  return { tr, modes, us, tsw, dt };
}
function swingA() {
  const r = swingSim(), { tr, modes, tsw, dt } = r, T = 9;
  const sx = lin(-1.5 * Math.PI, 1.5 * Math.PI, 214, 552), sy = lin(-8, 8, 230, 22);
  let o = '';
  for (const sg of [1, -1]) { const pts = []; for (let k = 0; k <= 300; k++) { const th = -1.5 * Math.PI + 3 * Math.PI * k / 300, w2 = 2 * (G + G * Math.cos(th)); pts.push([sx(th), sy(sg * Math.sqrt(Math.max(0, w2)))]); } o += path(d(pts), 'grid'); }
  o += axes({ sx, sy, x0: -1.5 * Math.PI, x1: 1.5 * Math.PI, y0: -8, y1: 8, xt: [[-Math.PI, '−π'], [0, '0'], [Math.PI, 'π']], yt: [[-8, '−8'], [-4, '−4'], [0, '0'], [4, '4'], [8, '8']], xAt: -8, yAt: -1.5 * Math.PI, xl: 'θ（rad）', yl: 'dθ/dt（rad/s）' });
  for (const c of [Math.PI, -Math.PI]) o += path(d(ellipsePts(RHO, (v) => sx(c + v), sy)) + 'Z', 'wash');
  o += text(sx(Math.PI) - 6, sy(-4.6), 'V < ρ', 'tl', 'end');
  o += text(sx(0), sy(6.9), 'homoclinic orbit E = mgl', 'ts', 'middle');
  // 轨迹：θ 不 wrap 到 ±1.5π 之外
  const th = (a) => { let v = a; while (v > 1.5 * Math.PI) v -= 2 * Math.PI; while (v < -1.5 * Math.PI) v += 2 * Math.PI; return v; };
  let seg = [], prev = null;
  for (let i = 0; i < tr.length; i += 4) {
    const a = th(tr[i][0]);
    if (prev !== null && Math.abs(a - prev) > Math.PI) { o += path(d(seg), 'mute'); seg = []; }
    seg.push([sx(a), sy(tr[i][1])]); prev = a;
  }
  o += path(d(seg), 'mute');
  const step = 25, idx = []; for (let i = 0; i < tr.length; i += step) idx.push(i);
  const kt = idx.map((i) => i / (tr.length - 1));
  o += `<circle cx="${f1(sx(th(tr[0][0])))}" cy="${f1(sy(tr[0][1]))}" r="5" class="ln-f">${anim('cx', idx.map((i) => f1(sx(th(tr[i][0])))), kt, T, true)}${anim('cy', idx.map((i) => f1(sy(tr[i][1]))), kt, T, true)}</circle>`;
  // 左：pendulum + mode
  const px = 100, py = 126, L = 70;
  o += circle(px, py, L, 'grid');
  o += `<g>${animRot(idx.map((i) => -tr[i][0] * 180 / Math.PI), px, py, kt, T)}${line(px, py, px, py + L, 'ink-b')}${circle(px, py + L, 9, 'solid')}</g>` + circle(px, py, 4, 'paper');
  const on = idx.map((i) => modes[i] === 1);
  o += `<text x="${px}" y="26" class="tb" text-anchor="middle">energy shaping，|u| ≤ 2${ashow(on.map((v) => !v), kt, T)}</text>`;
  o += `<text x="${px}" y="26" class="tl" text-anchor="middle">进入 V &lt; ρ，换成 LQR${ashow(on, kt, T)}</text>`;
  // 摆动次数：θ̇ 过零
  let swings = 0; for (let i = 1; i < tr.length && (tsw === null || i * dt < tsw); i++) if (tr[i - 1][1] * tr[i][1] < 0) swings++;
  o += text(px, 224, `${swings} 次换向后，t = ${tsw.toFixed(2)} s`, 'ts', 'middle') + text(px, 240, '进入 LQR 的 ellipse', 'ts', 'middle');
  return svgA(560, 266, o, `动图：torque 上限 2 牛米的 pendulum 用 energy shaping 来回摆了 ${swings} 次，在 ${tsw.toFixed(2)} 秒进入 LQR 的 region V 小于 rho，然后由 LQR 稳在 upright`);
}

// ---------- 第 4 站：shooting 与 transcription 的 condition number ----------
function denseLU(A0) {
  const n = A0.length, A = A0.map((r) => Float64Array.from(r)), piv = [...Array(n).keys()];
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    [A[k], A[p]] = [A[p], A[k]]; [piv[k], piv[p]] = [piv[p], piv[k]];
    const ak = A[k], d0 = ak[k];
    for (let i = k + 1; i < n; i++) { const ai = A[i], m = ai[k] / d0; if (m === 0) continue; ai[k] = m; for (let j = k + 1; j < n; j++) ai[j] -= m * ak[j]; }
  }
  return (b) => {
    const n2 = b.length, y = new Float64Array(n2);
    for (let i = 0; i < n2; i++) { let s = b[piv[i]]; const ai = A[i]; for (let j = 0; j < i; j++) s -= ai[j] * y[j]; y[i] = s; }
    for (let i = n2 - 1; i >= 0; i--) { let s = y[i]; const ai = A[i]; for (let j = i + 1; j < n2; j++) s -= ai[j] * y[j]; y[i] = s / ai[i]; }
    return y;
  };
}
function condSym(M, iters = 400) {
  // symmetric：cond = max|λ| / min|λ|，两头各做 power iteration（对 M 和 M⁻¹）
  const n = M.length, mul = (v) => M.map((r) => r.reduce((s, a, j) => s + a * v[j], 0));
  const pw = (op) => { let v = Array.from({ length: n }, (_, i) => Math.sin(i + 1.3)), lam = 0; for (let k = 0; k < iters; k++) { const w = op(v), nm = Math.hypot(...w); lam = nm / Math.hypot(...v); v = Array.from(w, (q) => q / nm); } return lam; };
  const solve = denseLU(M);
  return pw(mul) * pw(solve);
}
const SH = { h: 0.1 };
function shootH(N) {
  const h = SH.h, A = [[1, h], [h, 1]], B = [0, h];
  const AkB = [B]; for (let k = 1; k < N; k++) { const p = AkB[k - 1]; AkB.push([A[0][0] * p[0] + A[0][1] * p[1], A[1][0] * p[0] + A[1][1] * p[1]]); }
  // H = I + Bbᵀ Bb（Q = QN = I，R = 1）
  const H = Array.from({ length: N }, (_, i) => new Array(N).fill(i === i ? 0 : 0));
  for (let i = 0; i < N; i++) H[i][i] += 1;
  for (let n = 0; n < N; n++) for (let a = 0; a <= n; a++) for (let b = 0; b <= n; b++) { const p = AkB[n - a], q = AkB[n - b]; H[a][b] += p[0] * q[0] + p[1] * q[1]; }
  return H;
}
function transKKT(N) {
  const h = SH.h, A = [[1, h], [h, 1]], B = [0, h], nz = 3 * N, n = nz + 2 * N;
  const M = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < 2 * N; i++) M[i][i] = 1;
  for (let i = 2 * N; i < nz; i++) M[i][i] = 1;
  for (let k = 0; k < N; k++) for (let r = 0; r < 2; r++) {
    const row = nz + 2 * k + r, set = (c, v) => { M[row][c] = v; M[c][row] = v; };
    set(2 * k + r, 1);
    if (k > 0) for (let c = 0; c < 2; c++) set(2 * (k - 1) + c, -A[r][c]);
    set(2 * N + k, -B[r]);
  }
  return M;
}
function shoot() {
  const sx = lin(0, 200, 70, 540), sy = lin(0, 64, 222, 26);
  let o = axes({ sx, sy, x0: 0, x1: 200, y0: 0, y1: 64, xt: [0, 50, 100, 150, 200], yt: [0, 16, 32, 52, 64], grid: true, xl: 'horizon N（步，h = 0.1 s）', yl: 'log₂ cond，丢掉的 bit 数' });
  o += line(sx(0), sy(52), sx(200), sy(52), 'ln-dash') + text(sx(4), sy(52) - 6, 'double 只有 52 bit', 'tl', 'start');
  const ps = [], pt = [];
  for (let N = 2; N <= 150; N += 4) ps.push([N, Math.log2(condSym(shootH(N)))]);
  for (let N = 2; N <= 62; N += 6) pt.push([N, Math.log2(condSym(transKKT(N), 300))]);
  o += path(d(ps.map(([a, b]) => [sx(a), sy(b)])), 'ln');
  const sl = (ps[ps.length - 1][1] - ps[ps.length - 6][1]) / (ps[ps.length - 1][0] - ps[ps.length - 6][0]);
  const ext = []; for (let N = ps[ps.length - 1][0]; N <= 200; N += 2) ext.push([sx(N), sy(ps[ps.length - 1][1] + sl * (N - ps[ps.length - 1][0]))]);
  o += path(d(ext), 'ln-dash');
  o += path(d(pt.map(([a, b]) => [sx(a), sy(b)])), 'ink-b');
  const last = ps[ps.length - 1], lt = pt[pt.length - 1];
  o += text(sx(last[0]) - 6, sy(last[1]) - 10, `shooting：N = ${last[0]} 已丢 ${last[1].toFixed(1)} bit`, 'tl', 'end');
  o += text(sx(lt[0]) + 8, sy(lt[1]) - 8, `transcription：N = ${lt[0]} 时 ${lt[1].toFixed(1)} bit，不再增长`, 'ts', 'start');
  o += text(sx(118), sy(8), `每多一步 shooting 多丢 ${sl.toFixed(3)} bit ≈ 2 log₂ 1.1`, 'ts', 'start');
  return svg(560, 262, o, `线性化 inverted pendulum 的 finite-horizon LQR：direct shooting 的 Hessian condition number 每步多丢约 ${sl.toFixed(3)} bit，N 等于 150 时丢 ${last[1].toFixed(1)} bit；direct transcription 的 KKT matrix 停在约 ${lt[1].toFixed(1)} bit`);
}

// ---------- 第 4 站：一段 direct collocation ----------
function colloc() {
  const h = 0.2, f = pend(0);
  let xt = [0.5, 0]; for (let i = 0; i < 2000; i++) xt = rk4(f, xt, 0, h / 2000);
  const truth = []; { let x = [0.5, 0]; for (let i = 0; i <= 200; i++) { truth.push([i * h / 200, x[1]]); x = rk4(f, x, 0, h / 200); } }
  let o = '';
  const panel = (x0, xk1, title, sub) => {
    const xk = [0.5, 0], fk = f(xk, 0), fk1 = f(xk1, 0);
    const xc = [0, 1].map((i) => (xk[i] + xk1[i]) / 2 + h / 8 * (fk[i] - fk1[i]));
    const xdc = [0, 1].map((i) => -3 / (2 * h) * (xk[i] - xk1[i]) - (fk[i] + fk1[i]) / 4);
    const fc = f(xc, 0), def = [xdc[0] - fc[0], xdc[1] - fc[1]];
    const sx = lin(0, h, x0 + 36, x0 + 236), sy = lin(-1.2, 0.2, 214, 46);
    o += text(x0 + 136, 20, title, 'tb', 'middle') + text(x0 + 136, 36, sub, 'ts', 'middle');
    o += axes({ sx, sy, x0: 0, x1: h, y0: -1.2, y1: 0.2, xt: [[0, '0'], [0.1, '0.1'], [0.2, '0.2 s']], yt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0']] });
    o += text(x0 + 4, 42, 'dθ/dt', 'ts', 'start');
    o += path(d(truth.map(([t, w]) => [sx(t), sy(w)])), 'dash');
    // θ̇ 的 cubic Hermite：端点值 θ̇_k、θ̇_{k+1}，斜率 θ̈_k、θ̈_{k+1}
    const p0 = xk[1], p1 = xk1[1], m0 = fk[1], m1 = fk1[1];
    const H = (t) => { const s = t / h; return (2 * s ** 3 - 3 * s ** 2 + 1) * p0 + (s ** 3 - 2 * s ** 2 + s) * h * m0 + (-2 * s ** 3 + 3 * s ** 2) * p1 + (s ** 3 - s ** 2) * h * m1; };
    o += path(curve(H, 0, h, sx, sy, 80), 'ln');
    o += circle(sx(0), sy(p0), 4.5, 'ink-f') + circle(sx(h), sy(p1), 4.5, 'ink-f');
    const tc = h / 2, yc = xc[1], dl = 0.035;
    o += line(sx(tc - dl), sy(yc - dl * xdc[1]), sx(tc + dl), sy(yc + dl * xdc[1]), 'ln-dash');
    o += line(sx(tc - dl), sy(yc - dl * fc[1]), sx(tc + dl), sy(yc + dl * fc[1]), 'ink-b');
    o += circle(sx(tc), sy(yc), 4, 'paper');
    o += text(x0 + 136, 252, `spline 斜率 ${fmt(xdc[1])}，dynamics 要 ${fmt(fc[1])}`, 'ts', 'middle');
    o += text(x0 + 136, 270, `defect = (${fz(def[0])}, ${fz(def[1])})`, Math.abs(def[1]) > 0.1 ? 'tl' : 't', 'middle');
  };
  panel(0, xt, 'x[k+1] 取真实的 state', `θ = ${xt[0].toFixed(4)}，dθ/dt = ${fmt(xt[1], 4)}`);
  panel(280, [0.4, -1.0], 'x[k+1] 是猜的', 'θ = 0.4，dθ/dt = −1.0');
  return svg(560, 278, o, '同一段 0.2 秒的 direct collocation：左边 knot 取真实 state，midpoint 上 spline 的斜率和 dynamics 几乎相等，defect 约 0.001；右边 knot 是猜的，斜率差 0.88');
}

// ---------- 第 4 站：iLQR 的迭代（动图） ----------
function ilqrRun() {
  const dt = 0.05, N = 80, r = 1, Qf = [[200, 0], [0, 20]], goal = [Math.PI, 0];
  const fd = (x, u) => [x[0] + dt * x[1], x[1] + dt * (u - G * Math.sin(x[0]))];
  const roll = (U) => { const X = [[0, 0]]; for (const u of U) X.push(fd(X[X.length - 1], u)); return X; };
  const cost = (X, U) => { const e = [X[N][0] - goal[0], X[N][1] - goal[1]]; return r * dt * U.reduce((s, u) => s + u * u, 0) + Qf[0][0] * e[0] * e[0] + Qf[1][1] * e[1] * e[1]; };
  let U = new Array(N).fill(0), X = roll(U);
  const hist = [{ X, U: U.slice(), J: cost(X, U) }];
  let lastK = null;
  for (let itn = 0; itn < 60; itn++) {
    let Vx = [2 * Qf[0][0] * (X[N][0] - goal[0]), 2 * Qf[1][1] * (X[N][1] - goal[1])], Vxx = [[2 * Qf[0][0], 0], [0, 2 * Qf[1][1]]];
    const ks = new Array(N), Ks = new Array(N);
    for (let n = N - 1; n >= 0; n--) {
      const A = [[1, dt], [-dt * G * Math.cos(X[n][0]), 1]], B = [0, dt];
      const Qx = [A[0][0] * Vx[0] + A[1][0] * Vx[1], A[0][1] * Vx[0] + A[1][1] * Vx[1]];
      const Qu = 2 * r * dt * U[n] + B[1] * Vx[1];
      const VA = [[Vxx[0][0] * A[0][0] + Vxx[0][1] * A[1][0], Vxx[0][0] * A[0][1] + Vxx[0][1] * A[1][1]], [Vxx[1][0] * A[0][0] + Vxx[1][1] * A[1][0], Vxx[1][0] * A[0][1] + Vxx[1][1] * A[1][1]]];
      const Qxx = [[A[0][0] * VA[0][0] + A[1][0] * VA[1][0], A[0][0] * VA[0][1] + A[1][0] * VA[1][1]], [A[0][1] * VA[0][0] + A[1][1] * VA[1][0], A[0][1] * VA[0][1] + A[1][1] * VA[1][1]]];
      const Quu = 2 * r * dt + B[1] * B[1] * Vxx[1][1] + 1e-6, Qux = [B[1] * VA[1][0], B[1] * VA[1][1]];
      const k = -Qu / Quu, K = [-Qux[0] / Quu, -Qux[1] / Quu];
      ks[n] = k; Ks[n] = K;
      Vx = [Qx[0] + K[0] * Quu * k + K[0] * Qu + Qux[0] * k, Qx[1] + K[1] * Quu * k + K[1] * Qu + Qux[1] * k];
      Vxx = [[Qxx[0][0] + K[0] * K[0] * Quu + 2 * K[0] * Qux[0], Qxx[0][1] + K[0] * K[1] * Quu + K[0] * Qux[1] + Qux[0] * K[1]], [0, Qxx[1][1] + K[1] * K[1] * Quu + 2 * K[1] * Qux[1]]];
      Vxx[1][0] = Vxx[0][1];
    }
    lastK = Ks;
    const J0 = cost(X, U);
    for (const a of [1, 0.5, 0.25, 0.125]) {
      const Xn = [[0, 0]], Un = [];
      for (let n = 0; n < N; n++) { const xn = Xn[n], u = U[n] + a * ks[n] + Ks[n][0] * (xn[0] - X[n][0]) + Ks[n][1] * (xn[1] - X[n][1]); Un.push(u); Xn.push(fd(xn, u)); }
      const J = cost(Xn, Un);
      if (J < J0) { X = Xn; U = Un; break; }
    }
    hist.push({ X, U: U.slice(), J: cost(X, U) });
  }
  return { hist, dt, N, Ks: lastK };
}
const ILQR = ilqrRun();
function ilqrA() {
  const { hist, dt, N } = ILQR, show = [0, 1, 2, 3, 4, 6, 10, 60];
  const sx = lin(-1.2, 4.2, 40, 286), sy = lin(-4, 7.5, 222, 30);
  const tx = lin(0, N * dt, 340, 548), ty = lin(-40, 40, 222, 30);
  let o = axes({ sx, sy, x0: -1.2, x1: 4.2, y0: -4, y1: 7.5, xt: [[0, '0'], [Math.PI / 2, 'π/2'], [Math.PI, 'π']], yt: [[-4, '−4'], [0, '0'], [4, '4']], xAt: -4, yAt: -1.2, xl: 'θ', yl: 'dθ/dt' });
  o += axes({ sx: tx, sy: ty, x0: 0, x1: N * dt, y0: -40, y1: 40, xt: [0, 1, 2, 3, 4], yt: [[-40, '−40'], [-20, '−20'], [0, '0'], [20, '20'], [40, '40']], xAt: 0, yAt: 0, xl: 't（s）', yl: 'u（N·m）' });
  o += circle(sx(Math.PI), sy(0), 7, 'paper') + text(sx(Math.PI) + 10, sy(0) + 18, 'goal', 'ts', 'start');
  const fin = hist[hist.length - 1];
  o += path(d(fin.X.map(([a, w]) => [sx(a), sy(w)])), 'grid');
  const nF = show.length, hold = 1.3, T = nF * hold, kt = [], fr = [];
  show.forEach((s, i) => { kt.push(i * hold / T); fr.push(s); });
  kt.push(1); fr.push(show[nF - 1]);
  const dX = fr.map((s) => d(hist[s].X.map(([a, w]) => [sx(a), sy(w)])));
  const dU = fr.map((s) => d(hist[s].U.map((u, n) => [tx(n * dt), ty(Math.max(-40, Math.min(40, u)))])));
  o += apath(dX, kt, T, 'ln', true) + apath(dU, kt, T, 'ln', true);
  const ends = fr.map((s) => hist[s].X[N]);
  o += `<circle cx="${f1(sx(ends[0][0]))}" cy="${f1(sy(ends[0][1]))}" r="4" class="ln-f">${anim('cx', ends.map((p) => f1(sx(p[0]))), kt, T, true)}${anim('cy', ends.map((p) => f1(sy(p[1]))), kt, T, true)}</circle>`;
  show.forEach((s, i) => {
    const on = fr.map((v, j) => j < fr.length && fr[j] === s && (j === i || (i === nF - 1 && j === fr.length - 1)));
    const peak = Math.max(...hist[s].U.map(Math.abs));
    o += `<text x="160" y="20" class="tb" text-anchor="middle">iteration ${s}：cost ${hist[s].J.toFixed(2)}${ashow(on, kt, T)}</text>`;
    o += `<text x="444" y="20" class="ts" text-anchor="middle">peak |u| = ${peak.toFixed(2)} N·m${ashow(on, kt, T)}</text>`;
  });
  o += text(160, 270, '灰线是 converge 后的 trajectory', 'ts', 'middle');
  return svgA(560, 276, o, `动图：iLQR 从 u 等于 0 的初始猜测开始做 pendulum swing-up，每帧一个 iteration；cost 从 ${hist[0].J.toFixed(1)} 降到 ${fin.J.toFixed(2)}，最终 peak torque ${Math.max(...fin.U.map(Math.abs)).toFixed(2)} 牛米`);
}

// ---------- 第 5 站：saturated LQR 的真实 region of attraction 与 V < ρ 的估计 ----------
function roa() {
  const sx = lin(-1.2, 1.2, 70, 380), sy = lin(-5, 5, 232, 20);
  let o = '';
  const nI = 48, nJ = 40, cw = (sx(1.2) - sx(-1.2)) / nI, chh = (sy(-5) - sy(5)) / nJ;
  for (let i = 0; i < nI; i++) {
    let run = null;
    const flush = (jEnd) => { if (run !== null) { o += rect(sx(-1.2) + i * cw, sy(5) + (nJ - jEnd) * chh, cw + 0.3, (jEnd - run) * chh + 0.3, 'wash-strong'); run = null; } };
    for (let j = 0; j < nJ; j++) {
      const tb = -1.2 + (i + 0.5) * 2.4 / nI, wd = -5 + (j + 0.5) * 10 / nJ;
      let x = [Math.PI + tb, wd], ok = true;
      for (let s = 0; s < 1200; s++) { x = rk4(pend(0), x, uLqr(x), 0.01); if (Math.abs(x[1]) > 15) { ok = false; break; } }
      ok = ok && Vtop(wrap(x[0] - Math.PI), x[1]) < RHO;
      if (ok && run === null) run = j;
      if (!ok) flush(j);
    }
    flush(nJ);
  }
  o += axes({ sx, sy, x0: -1.2, x1: 1.2, y0: -5, y1: 5, xt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], yt: [[-4, '−4'], [-2, '−2'], [0, '0'], [2, '2'], [4, '4']], xAt: -5, yAt: -1.2, xl: 'θ̄ = θ − π（rad）', yl: 'dθ/dt（rad/s）' });
  o += path(d(ellipsePts(RHO, sx, sy)) + 'Z', 'ln');
  const te = Math.asin(UMAX / G);
  for (const s of [-1, 1]) o += circle(sx(s * te), sy(0), 3.5, 'ink-f');
  // 右：说明
  const X = 400;
  o += rect(X, 34, 16, 12, 'wash-strong') + text(X + 22, 45, '真的会回到 upright', 't');
  o += line(X, 72, X + 16, 72, 'ln') + text(X + 22, 76, `V = ${RHO.toFixed(3)} 的 ellipse`, 't');
  o += circle(X + 8, 102, 3.5, 'ink-f') + text(X + 22, 106, `θ̄ = ±${te.toFixed(3)}：`, 't') + text(X + 22, 124, 'g sin θ̄ = 2，torque 不够', 'ts');
  const thE = Math.sqrt(RHO / TOP.S[0][0]);
  o += text(X, 160, `ellipse 和 θ̄ 轴交在 ±${thE.toFixed(3)}`, 'ts') + text(X, 178, 'ρ 来自网格 sampling，', 'ts') + text(X, 196, '只检查了网格上的点', 'ts');
  return svg(560, 262, o, `torque 上限 2 牛米时 LQR 的 region of attraction：深色是 simulation 中真正回到 upright 的初始状态，彩色 ellipse 是 V 小于 ${RHO.toFixed(2)} 的 Lyapunov 估计，它和 theta bar 轴交在正负 ${thE.toFixed(3)}，物理极限是正负 ${te.toFixed(3)}`);
}

// ---------- 第 6 站：rimless wheel（动图） ----------
function wheelA() {
  const al = Math.PI / 8, gm = 0.08, g = 9.8, l = 1, c2 = Math.cos(2 * al);
  const cst = 4 * g / l * Math.sin(al) * Math.sin(gm), wroll = c2 / Math.sin(2 * al) * Math.sqrt(cst);
  // 每一步：stance 从 θ = γ − α 到 γ + α，θ 从垂直于“水平面”量，顺时针为正（往下坡走）
  let w = 3.0, t = 0, foot = 0, stepIdx = 0;
  const dt = 0.002, frames = [], wn = [w];
  while (stepIdx < 6) {
    let th = gm - al, thd = w;
    while (th < gm + al) {
      frames.push({ t, foot, th, thd, step: stepIdx });
      const f1_ = (x) => [x[1], g / l * Math.sin(x[0])];
      const nx = rk4((x) => f1_(x), [th, thd], 0, dt); th = nx[0]; thd = nx[1]; t += dt;
    }
    w = c2 * Math.sqrt(w * w + cst); wn.push(w); foot += 2 * l * Math.sin(al); stepIdx++;
  }
  const T = frames[frames.length - 1].t;
  // 左：沿坡面画 wheel。坡面方向：往右下，倾角 γ
  const u = 40, O = [64, 116];
  const S = (s, n) => [O[0] + u * (s * Math.cos(gm) + n * Math.sin(gm)), O[1] + u * (s * Math.sin(gm) - n * Math.cos(gm))]; // s 沿坡，n 垂直坡面向上
  let o = path(d([S(-0.2, 0), S(6.0, 0)]), 'ink');
  for (let k = 0; k < 24; k++) { const p = S(-0.2 + k * 0.26, 0); o += line(p[0], p[1], p[0] - 5, p[1] + 7, 'grid'); }
  const idx = []; for (let i = 0; i < frames.length; i += 12) idx.push(i);
  idx.push(frames.length - 1);
  const kt = idx.map((i) => frames[i].t / T);
  // hub：stance foot 在坡上 s = foot；θ 从“竖直”量，换到坡面坐标要减 γ
  const hub = (fr) => { const phi = fr.th - gm; return [fr.foot + l * Math.sin(phi), l * Math.cos(phi)]; };
  const spokes = (fr) => {
    const hb = hub(fr), phi = fr.th - gm, segs = [];
    for (let k = 0; k < 8; k++) { const a = phi + Math.PI + k * 2 * al; segs.push([S(...hb), S(hb[0] + l * Math.sin(a), hb[1] + l * Math.cos(a))]); }
    return segs.map((sg) => d(sg)).join('');
  };
  o += apath(idx.map((i) => spokes(frames[i])), kt, T, 'ink-b');
  const hp = idx.map((i) => S(...hub(frames[i])));
  o += acircle(hp.map((p) => p[0]), hp.map((p) => p[1]), kt, T, 6, 'solid');
  o += text(150, 20, 'α = π/8（8 根 leg），坡度 γ = 0.08', 'ts', 'middle');
  // 右：return map
  const P = (x) => c2 * Math.sqrt(x * x + cst);
  const mx = lin(0.8, 3.2, 330, 548), my = lin(0.8, 3.2, 226, 30);
  o += axes({ sx: mx, sy: my, x0: 0.8, x1: 3.2, y0: 0.8, y1: 3.2, xt: [1, 2, 3], yt: [1, 2, 3], xl: 'ωₙ', yl: 'ωₙ₊₁' });
  o += path(d([[mx(0.8), my(0.8)], [mx(3.2), my(3.2)]]), 'grid');
  o += path(curve(P, 0.8, 3.2, mx, my), 'ln');
  const w1 = Math.sqrt(2 * g / l * (1 - Math.cos(gm - al)));
  o += line(mx(w1), my(0.8), mx(w1), my(3.2), 'dash') + text(mx(w1) + 4, my(3.05), `ω₁ = ${w1.toFixed(3)}`, 'ts', 'start');
  const cob = [[mx(wn[0]), my(0.8)]];
  for (let k = 0; k < wn.length - 1; k++) { cob.push([mx(wn[k]), my(wn[k + 1])]); cob.push([mx(wn[k + 1]), my(wn[k + 1])]); }
  o += path(d(cob), 'mute');
  o += circle(mx(wroll), my(wroll), 4.5, 'ink-f') + text(mx(wroll) + 8, my(wroll) + 18, `fixed point ${wroll.toFixed(3)}`, 'ts', 'start');
  const stepOn = idx.map((i) => frames[i].step);
  const cp = stepOn.map((s) => [mx(wn[s]), my(wn[s + 1])]);
  o += `<circle cx="${f1(cp[0][0])}" cy="${f1(cp[0][1])}" r="5" class="ln-f">${anim('cx', cp.map((p) => f1(p[0])), kt, T, true)}${anim('cy', cp.map((p) => f1(p[1])), kt, T, true)}</circle>`;
  o += text(330, 270, `起点 3.0 → ${wn.slice(1, 5).map((v) => v.toFixed(3)).join(' → ')} …`, 'ts', 'start');
  o += text(160, 246, '每次 leg 着地，速度乘 cos 2α = 0.707', 'ts', 'middle');
  return svgA(560, 278, o, `动图：rimless wheel 以 3.0 rad/s 开始往坡下滚，每一步着地时速度被乘以 cos 2 alpha；右边 return map 上的点一步步收敛到 fixed point ${wroll.toFixed(3)} rad/s`);
}

// ---------- 第 7 站：直接在 K 上做 gradient descent 与 weight perturbation ----------
const Jk = (k1, k2) => (k1 <= 0 || k2 <= 0 ? Infinity : (1 + k1 * k1) * (k1 + 1 + k2 * k2) / (2 * k1 * k2) + (1 + k2 * k2) * (k1 + 1) / (2 * k2) - k1 * k2);
const gradJ = (k1, k2, e = 1e-6) => [(Jk(k1 + e, k2) - Jk(k1 - e, k2)) / (2 * e), (Jk(k1, k2 + e) - Jk(k1, k2 - e)) / (2 * e)];
function policyRuns() {
  const gd = [[0.4, 4.0]];
  for (let i = 0; i < 300; i++) { const [a, b] = gd[gd.length - 1], g = gradJ(a, b); gd.push([a - 0.03 * g[0], b - 0.03 * g[1]]); }
  // weight perturbation：β ~ N(0, σ²I)，Δk = −η/σ² [J(k+β) − J(k)] β；seeded RNG
  let s = 12345; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const wp = [[0.4, 4.0]], sg = 0.05;
  for (let i = 0; i < 300; i++) {
    const [a, b] = wp[wp.length - 1], be = [sg * gauss(), sg * gauss()];
    const dJ = Jk(a + be[0], b + be[1]) - Jk(a, b);
    wp.push([a - 0.03 / (sg * sg) * dJ * be[0], b - 0.03 / (sg * sg) * dJ * be[1]]);
  }
  return { gd, wp };
}
function landscape() {
  const sx = lin(0, 5, 60, 360), sy = lin(0, 5, 236, 26);
  let o = '';
  // marching squares 画 level set
  const levels = [3.6, 4, 5, 6.5, 9, 13, 20];
  const n = 120, gx = (i) => 5 * i / n;
  const vals = []; for (let i = 0; i <= n; i++) { vals.push([]); for (let j = 0; j <= n; j++) vals[i].push(Jk(Math.max(gx(i), 1e-3), Math.max(gx(j), 1e-3))); }
  for (const c of levels) {
    let segs = '';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = [vals[i][j], vals[i + 1][j], vals[i + 1][j + 1], vals[i][j + 1]], p = [[gx(i), gx(j)], [gx(i + 1), gx(j)], [gx(i + 1), gx(j + 1)], [gx(i), gx(j + 1)]];
      const pts = [];
      for (let e = 0; e < 4; e++) { const a = v[e], b = v[(e + 1) % 4]; if ((a - c) * (b - c) < 0 && Number.isFinite(a) && Number.isFinite(b)) { const t = (c - a) / (b - a), A = p[e], B = p[(e + 1) % 4]; pts.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); } }
      if (pts.length >= 2) segs += d([[sx(pts[0][0]), sy(pts[0][1])], [sx(pts[1][0]), sy(pts[1][1])]]);
      if (pts.length === 4) segs += d([[sx(pts[2][0]), sy(pts[2][1])], [sx(pts[3][0]), sy(pts[3][1])]]);
    }
    o += path(segs, 'grid');
  }
  o += axes({ sx, sy, x0: 0, x1: 5, y0: 0, y1: 5, xt: [0, 1, 2, 3, 4, 5], yt: [1, 2, 3, 4, 5], xl: 'k₁', yl: 'k₂' });
  o += text(sx(4.55), sy(4.75), 'J = 20', 'ts', 'end');
  const { gd, wp } = policyRuns();
  o += path(d(wp.map(([a, b]) => [sx(a), sy(b)])), 'mute');
  o += path(d(gd.map(([a, b]) => [sx(a), sy(b)])), 'ln');
  o += circle(sx(1), sy(Math.sqrt(3)), 5, 'ink-f') + text(sx(1) + 9, sy(Math.sqrt(3)) + 16, 'K* = (1, √3)', 'tb', 'start');
  o += circle(sx(0.4), sy(4), 4, 'paper') + text(sx(0.4) + 8, sy(4) - 6, 'start (0.4, 4)', 'ts', 'start');
  const X = 384, gN = gd[gd.length - 1], wN = wp[wp.length - 1];
  o += line(X, 46, X + 18, 46, 'ln') + text(X + 24, 50, 'true gradient', 't');
  o += text(X + 24, 68, `300 步后 J = ${Jk(...gN).toFixed(4)}`, 'ts');
  o += line(X, 96, X + 18, 96, 'mute') + text(X + 24, 100, 'weight perturbation', 't');
  o += text(X + 24, 118, `300 步后 J = ${Jk(...wN).toFixed(4)}`, 'ts');
  o += text(X, 150, `J* = 2√3 = ${(2 * Math.sqrt(3)).toFixed(4)}`, 'ts');
  o += text(X, 176, 'k₁ ≤ 0 或 k₂ ≤ 0：', 'ts') + text(X, 194, 'closed loop 不 stable，J = ∞', 'ts');
  return svg(560, 274, o, `double integrator 的 LQR cost 作为 K 的 function：true gradient descent 和只靠两次 cost 评估的 weight perturbation 都从 (0.4, 4) 走到 K 星 (1, 根号 3) 附近`);
}

// ---------- 第 6 站：collision 就是把速度沿新 leg 的分量投影掉 ----------
function impact() {
  const al = Math.PI / 8, L = 150, gy = 214, cx = 150;
  // math 坐标：x 向右、y 向上；hub 在两只 foot 正中上方
  const P = (x, y) => [cx + x, gy - y];
  const hub = [0, L * Math.cos(al)], f1p = [-L * Math.sin(al), 0], f2p = [L * Math.sin(al), 0];
  const V = 120, vm = [Math.cos(al), -Math.sin(al)];          // v⁻ ⟂ 旧 leg（单位向量）
  const n = [-Math.sin(al), Math.cos(al)];                    // 新 leg：新 foot → hub
  const dot = vm[0] * n[0] + vm[1] * n[1];                    // = −sin 2α
  const vp = [vm[0] - dot * n[0], vm[1] - dot * n[1]];         // v⁺ = (I − n nᵀ) v⁻
  const kept = Math.hypot(...vp), lost = Math.abs(dot);
  let o = line(...P(-L * 0.75, 0), ...P(L * 0.75, 0), 'axis');
  for (let k = 0; k < 14; k++) { const q = P(-L * 0.72 + k * 16, 0); o += line(q[0], q[1], q[0] - 5, q[1] + 7, 'grid'); }
  o += line(...P(...f1p), ...P(...hub), 'mute') + line(...P(...f2p), ...P(...hub), 'ink-b');
  o += circle(...P(...f1p), 3.5, 'paper') + circle(...P(...f2p), 3.5, 'ink-f');
  o += text(...P(f1p[0] - 6, -20), '旧 stance foot', 'ts', 'middle') + text(...P(f2p[0] + 6, -20), '新着地点', 'ts', 'middle');
  // 2α 的角
  const arc = []; for (let k = 0; k <= 16; k++) { const t = -al + 2 * al * k / 16; arc.push(P(hub[0] - 34 * Math.sin(t), hub[1] - 34 * Math.cos(t))); }
  o += path(d(arc), 'mute') + text(...P(0, hub[1] - 52), '2α', 'ts', 'middle');
  const H = P(...hub), tip = (v, s = V) => [H[0] + s * v[0], H[1] - s * v[1]];
  // v⁻、v⁺ 与被去掉的分量
  o += arrow(H[0], H[1], ...tip(vm), 'ink');
  o += arrow(H[0], H[1], ...tip(vp, V), 'ln');
  const a = tip(vp), b = tip(vm);
  o += line(a[0], a[1], b[0], b[1], 'dash');
  o += circle(...H, 7, 'solid');
  const vmT = tip(vm, V + 12), vpT = tip(vp, V + 14);
  o += text(vmT[0] + 2, vmT[1] + 12, 'v⁻', 'tb', 'start') + text(vpT[0] + 4, vpT[1] + 2, 'v⁺', 'tl', 'start');
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  o += text(mid[0] + 10, mid[1] + 4, '去掉', 'ts', 'start');
  o += text(H[0] - 12, H[1] - 6, 'hub', 'ts', 'end');
  // 右边：数
  const X = 330;
  o += text(X, 34, 'v⁻ 垂直于旧 leg', 't') + text(X, 54, '新 leg 着地后 hub 绕新着地点转，', 't') + text(X, 74, 'v⁺ 必须垂直于新 leg：', 't');
  o += text(X, 100, 'v⁺ = (I − n nᵀ) v⁻', 'tb');
  o += text(X, 126, `沿新 leg 的分量 sin 2α = ${lost.toFixed(3)}`, 'ts') + text(X, 144, '被 impulse 吃掉（虚线）', 'ts');
  o += text(X, 170, `留下 |v⁺| / |v⁻| = cos 2α = ${kept.toFixed(3)}`, 'tl');
  o += text(X, 196, `速度平方留下 ${(kept * kept * 100).toFixed(0)}%`, 'ts') + text(X, 214, 'α = π/8，8 根 leg', 'ts');
  return svg(560, 240, o, `rimless wheel 的 collision：着地前 hub 速度垂直于旧 leg，沿新 leg 的分量被 impulse 去掉，留下 cos 2 alpha 等于 ${kept.toFixed(3)} 倍`);
}

// ---------- 第 6 站：compass gait 的 model ----------
function compass() {
  const phi = 0.0525, thst = 0.32, L = 168, a = 0.5;
  // 坡往右下；math 坐标，stance foot 在原点
  const sx0 = 150, sy0 = 210, P = (x, y) => [sx0 + x, sy0 - y];
  const hip = [L * Math.sin(thst), L * Math.cos(thst)];
  // swing leg：从 hip 往下，与竖直夹 θsw（顺时针为正），解 swing foot 落在坡面 y = −x tan φ 上
  let lo = -1.2, hi = 0;
  const footSw = (t) => [hip[0] - L * Math.sin(t), hip[1] - L * Math.cos(t)];
  const gap = (t) => { const f = footSw(t); return f[1] + f[0] * Math.tan(phi); };
  for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; (gap(m) > 0 ? (lo = m) : (hi = m)); }
  const thsw = (lo + hi) / 2, fs = footSw(thsw);
  let o = path(d([P(-60, 60 * Math.tan(phi)), P(330, -330 * Math.tan(phi))]), 'axis');
  for (let k = 0; k < 24; k++) { const x = -54 + k * 16, q = P(x, -x * Math.tan(phi)); o += line(q[0], q[1], q[0] - 5, q[1] + 7, 'grid'); }
  // 竖直参考线
  o += line(...P(0, 0), ...P(0, L * 0.38), 'dash') + line(...P(...hip), ...P(hip[0], hip[1] - L * 0.62), 'dash');
  // legs
  o += line(...P(0, 0), ...P(...hip), 'ink-b') + line(...P(...hip), ...P(...fs), 'ink-b');
  // leg 上的 mass：离 foot a
  const mSt = [hip[0] * a, hip[1] * a], mSw = [fs[0] + (hip[0] - fs[0]) * a, fs[1] + (hip[1] - fs[1]) * a];
  o += circle(...P(...mSt), 7, 'solid') + circle(...P(...mSw), 7, 'solid') + circle(...P(...hip), 11, 'solid');
  o += circle(...P(0, 0), 3.5, 'ink-f') + circle(...P(...fs), 3.5, 'paper');
  o += text(...P(hip[0] + 16, hip[1] + 4), it('m') + '<tspan class="sub" dy="3">h</tspan>', 't', 'start');
  o += text(...P(mSt[0] - 14, mSt[1] - 2), it('m'), 't', 'end') + text(...P(mSw[0] + 14, mSw[1] - 2), it('m'), 't', 'start');
  // a、b 标在 stance leg 左侧
  const nrm = [-Math.cos(thst), Math.sin(thst)];
  const lab = (p, s) => { const q = P(p[0] + 16 * nrm[0], p[1] + 16 * nrm[1]); return text(q[0], q[1] + 4, s, 'ts', 'middle'); };
  const labR = (p, s) => { const q = P(p[0] - 16 * nrm[0], p[1] - 16 * nrm[1]); return text(q[0], q[1] + 4, s, 'ts', 'middle'); };
  o += labR([mSt[0] / 2, mSt[1] / 2], it('a')) + lab([(mSt[0] + hip[0]) / 2, (mSt[1] + hip[1]) / 2], it('b'));
  // 角度
  const arcA = (c, r, t0, t1, down) => { const pts = []; for (let k = 0; k <= 20; k++) { const t = t0 + (t1 - t0) * k / 20; pts.push(P(c[0] + r * Math.sin(t) * (down ? -1 : 1), c[1] + r * Math.cos(t) * (down ? -1 : 1))); } return path(d(pts), 'mute'); };
  o += arcA([0, 0], 46, 0, thst, false) + text(...P(-8, 40), 'θ<tspan class="sub" dy="3">st</tspan>', 'ts', 'end');
  o += arcA(hip, 64, 0, thsw, true) + text(...P(hip[0] - 64 * Math.sin(thsw) + 10, hip[1] - 60), 'θ<tspan class="sub" dy="3">sw</tspan>', 'ts', 'start');
  o += text(...P(0, -22), 'stance foot', 'ts', 'middle') + text(...P(fs[0], fs[1] - 22), 'swing foot 着地', 'ts', 'middle');
  // hip torque
  o += text(...P(hip[0] - 18, hip[1] + 20), 'hip torque ' + it('u'), 'ts', 'end');
  const X = 380;
  const sb = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">`;
  o += text(X, 40, `m = 5 kg，m${sb('h')} = 10 kg</tspan>`, 't');
  o += text(X, 64, 'a = b = 0.5 m，l = a + b', 't') + text(X, 88, `坡度 φ = ${phi} rad`, 't');
  o += text(X, 124, '两个角都从竖直方向量，', 'ts') + text(X, 142, '顺时针为正；这一刻', 'ts') + text(X, 160, `θ${sb('st')} = ${thst.toFixed(2)}，θ${sb('sw')} = ${fmt(thsw)}</tspan></tspan>`, 'ts');
  o += text(X, 196, 'B = (−1, 1)ᵀ：hip torque', 'ts') + text(X, 214, '对两根 leg 等大反向', 'ts');
  return svg(560, 246, o, `compass gait：stance leg 和 swing leg 在 hip 处铰接，hip mass m_h，每根 leg 上离 foot a 处有 mass m；这一刻 swing foot 正落在坡上`);
}

export default {
  'm6821-limit': limit,
  'm6821-cart': cart,
  'm6821-flow': flow,
  'm6821-phase': phaseA,
  'm6821-swing': swingA,
  'm6821-shoot': shoot,
  'm6821-colloc': colloc,
  'm6821-ilqr': ilqrA,
  'm6821-roa': roa,
  'm6821-wheel': wheelA,
  'm6821-impact': impact,
  'm6821-compass': compass,
  'm6821-policy': landscape,
};

export const _num = { TOP, RHO, CPK, ILQR, swingSim, cpSim, Jk, policyRuns };
