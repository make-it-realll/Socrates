import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, animRot, f1 } from '../lib/svg.mjs';

// MIT 12.800 Fluid Dynamics of the Atmosphere and Ocean：本页所有图里的数字都在这里算。
const OM = 7.292e-5, RE = 6.371e6, G = 9.81, RAD = Math.PI / 180;
const fcor = (p) => 2 * OM * Math.sin(p * RAD);
const kts = (a) => a.map((t) => Math.round(t * 1e5) / 1e5).join(';');
const atrans = (xs, ys, kt, dur) => `<animateTransform attributeName="transform" type="translate" values="${xs.map((x, i) => f1(x) + ' ' + f1(ys[i])).join(';')}" keyTimes="${kts(kt)}" dur="${dur}s" repeatCount="indefinite"/>`;
const atext = (xs, ys, s, cls, anchor, kt, T, extra = '') => `<text x="${f1(xs[0])}" y="${f1(ys[0])}" class="${cls}" text-anchor="${anchor}">${s}${anim('x', xs.map(f1), kt, T)}${anim('y', ys.map(f1), kt, T)}${extra}</text>`;
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

// ---------- 开头第一件事：转台上的水 4.7 min 就跟上了 ----------
function spinup0() {
  const nu = 1e-6, f = 1, H = 0.2, del = Math.sqrt(2 * nu / f), tau = (2 * H) / (f * del) / 60; // min
  const tauD = (4 * H * H) / (Math.PI ** 2 * nu) / 60; // 最慢的 diffusive mode，min
  let o = '';
  // 左：tank 剖面
  const X0 = 40, X1 = 210, top = 70, bot = 190;
  o += rect(X0, top, X1 - X0, bot - top, 'wash');
  o += line(X0, 50, X0, bot, 'ink-b') + line(X1, 50, X1, bot, 'ink-b') + line(X0, bot, X1, bot, 'ink-b');
  o += line(X0 - 14, bot + 14, X1 + 14, bot + 14, 'ink-b') + text((X0 + X1) / 2, bot + 32, 'turntable', 'ts', 'middle');
  o += line((X0 + X1) / 2, 30, (X0 + X1) / 2, bot + 14, 'dash');
  const cx = (X0 + X1) / 2;
  o += path(`M${cx - 26} 40 A26 7 0 1 0 ${cx + 26} 40`, 'ink') + poly([[cx + 26, 40], [cx + 20, 33], [cx + 32, 35]], 'ink-f');
  o += text(cx + 34, 30, 'Ω = 0.5 rad/s', 'ts');
  o += line(X1 + 10, top, X1 + 10, bot, 'mute') + text(X1 + 14, (top + bot) / 2 + 4, 'H = 20 cm', 'ts');
  o += text(cx - 46, top + 30, 'water', 'ts', 'middle') + text(cx - 46, top + 48, 'ν = 10⁻⁶ m²/s', 'ts', 'middle');
  // 右：相对 vorticity 衰减
  const sx = lin(0, 60, 320, 540), sy = lin(0, 1, 190, 40);
  o += axes({ sx, sy, x0: 0, x1: 60, y0: 0, y1: 1, xt: [0, 15, 30, 45, 60], yt: [0, 0.5, 1], xl: 't（min）', grid: true });
  o += text(300, 26, '水相对 tank 的转动还剩多少', 'tb', 'start');
  o += path(curve((t) => Math.exp(-t / tauD), 0, 60, sx, sy), 'dash');
  o += path(curve((t) => Math.exp(-t / tau), 0, 60, sx, sy), 'ln');
  o += text(sx(7), sy(0.12), '第 6 站的 Ekman 理论：' + tau.toFixed(1) + ' min', 'tl', 'start');
  o += text(sx(60), sy(0.64), '只靠 viscous diffusion：', 'ts', 'end') + text(sx(60), sy(0.64) + 16, '约 ' + (tauD / 60).toFixed(1) + ' h 才降到 1/e', 'ts', 'end');
  return svg(560, 232, o, '20 厘米深的水在每秒 0.5 弧度的转台上：实际约 4.7 分钟就跟上转台，单靠 viscous diffusion 要 4.5 小时');
}

// ---------- 开头第二件事：一块抬高的水，转与不转 ----------
function adjust0() {
  let o = '';
  const panel = (x0, title, fin, jet) => {
    const sx = lin(-5, 5, x0, x0 + 230), sy = lin(-1.3, 1.3, 190, 50);
    o += rect(x0, 50, 230, 140, 'frame') + line(x0, sy(0), x0 + 230, sy(0), 'grid');
    o += path(d([[sx(-5), sy(1)], [sx(0), sy(1)], [sx(0), sy(-1)], [sx(5), sy(-1)]]), 'dash');
    o += path(curve(fin, -5, 5, sx, sy, 300), 'ln');
    o += text(x0 + 115, 36, title, 'tb', 'middle');
    o += text(x0 - 4, sy(1) + 4, '+η₀', 'ts', 'end') + text(x0 - 4, sy(-1) + 4, '−η₀', 'ts', 'end');
    if (jet) {
      o += line(sx(-1), 206, sx(1), 206, 'mute') + line(sx(-1), 201, sx(-1), 211, 'mute') + line(sx(1), 201, sx(1), 211, 'mute');
      o += text(sx(0), 224, '约 2 L_d 宽的 jet', 'ts', 'middle');
    } else o += text(x0 + 115, 216, '所有 potential energy 都被 wave 带走', 'ts', 'middle');
  };
  panel(50, '不转：最后完全平了', () => 0, false);
  panel(310, '转：最后停在这里', (x) => -sgn(x) * (1 - Math.exp(-Math.abs(x))), true);
  o += text(280, 248, '虚线是开始时的 step，彩线是很久以后的 surface。横轴范围 ±5 L_d', 'ts', 'middle');
  return svg(560, 256, o, '同一个 step 形的 surface：不转时最后完全变平；转时只在 step 附近约一个 deformation radius 内变平，其余保持原样，中间留下一条 jet');
}

// ---------- 开头第三件事：15 m/s 的 westerly 里一动不动的波 ----------
function west0() {
  const be = (2 * OM * Math.cos(45 * RAD)) / RE, U = 15, K = Math.sqrt(be / U), lam = (2 * Math.PI) / K / 1e3; // km
  const sx = lin(0, 13000, 30, 540), sy = lin(-1, 1, 150, 70);
  let o = rect(30, 50, 510, 120, 'wash2');
  o += path(curve((x) => 0.75 * Math.sin((2 * Math.PI * x) / lam), 0, 13000, sx, sy, 300), 'ln');
  for (const x of [1500, 5200, 8900, 12300]) o += arrow(sx(x) - 22, 62, sx(x) + 22, 62, 'ink');
  o += text(sx(3400), 48, 'westerly wind U = 15 m/s（往东）', 'ts', 'middle');
  o += line(sx(lam / 4), 182, sx(lam * 1.25), 182, 'mute') + line(sx(lam / 4), 177, sx(lam / 4), 187, 'mute') + line(sx(lam * 1.25), 177, sx(lam * 1.25), 187, 'mute');
  o += text((sx(lam / 4) + sx(lam * 1.25)) / 2, 200, 'λ = ' + Math.round(lam).toLocaleString('en') + ' km', 'ts', 'middle');
  o += text(30, 222, '45°N 一圈长 28,306 km，放得下约 ' + ((2 * Math.PI * RE * Math.cos(45 * RAD)) / 1e3 / lam).toFixed(1) + ' 个这样的波。', 'ts') + text(30, 240, '风一直往东吹，波形却停在原地。', 'ts');
  o += text(540, 40, 'west → east', 'ts', 'end');
  return svg(560, 250, o, '45 度北纬一条往东吹 15 米每秒的 westerly 上，一个波长约 6050 公里的波形停在原地不动');
}

// ---------- 第 1 站：streamline、pathline、streakline ----------
function linesA() {
  const sx = lin(0, 1.4, 50, 290), sy = lin(0, 1.05, 250, 48);
  const N = 40, frames = [], T = 7;
  const tmax = 1.2;
  for (let i = 0; i <= N; i++) frames.push((tmax * i) / N);
  const seq = [tmax, tmax, 0, ...frames.slice(1), tmax];
  const kt = [0, 0.22, 0.2205]; for (let i = 1; i <= N; i++) kt.push(0.2205 + ((0.92 - 0.2205) * i) / N); kt.push(1);
  const P = (x, y) => [sx(x), sy(y)];
  const M = 30;
  const stream = (t) => { const pts = []; for (let k = 0; k <= M; k++) { const x = (1.4 * k) / M; pts.push(P(x, t * x)); } return d(pts); };
  const pathl = (t) => { const pts = []; for (let k = 0; k <= M; k++) { const s = (t * k) / M; pts.push(P(s, s * s / 2)); } return d(pts); };
  const streak = (t) => { const pts = []; for (let k = 0; k <= M; k++) { const x = (t * k) / M; pts.push(P(x, t * x - x * x / 2)); } return d(pts); };
  let o = axes({ sx, sy, x0: 0, x1: 1.4, y0: 0, y1: 1.05, xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'x', yl: 'y', grid: true });
  o += `<clipPath id="mit12800-lines-clip"><rect x="50" y="48" width="240" height="202"/></clipPath>`;
  o += `<g clip-path="url(#mit12800-lines-clip)">` + apath(seq.map(stream), kt, T, 'mute') + `</g>`;
  o += apath(seq.map(streak), kt, T, 'ln');
  o += apath(seq.map(pathl), kt, T, 'dash');
  o += acircle(seq.map((t) => sx(t)), seq.map((t) => sy(t * t / 2)), kt, T, 5, 'ink-f');
  o += circle(sx(0), sy(0), 4, 'paper');
  const X = 310;
  o += text(X, 52, 'u = 1，v = t（velocity 随时间转向）', 'tb');
  o += line(X, 82, X + 26, 82, 'mute') + text(X + 34, 86, 'streamline：此刻的 velocity 方向', 'ts');
  o += line(X, 108, X + 26, 108, 'dash') + text(X + 34, 112, 'pathline：t = 0 放出的那个 particle', 'ts');
  o += line(X, 134, X + 26, 134, 'ln') + text(X + 34, 138, 'streakline：从原点连续放的 dye', 'ts');
  o += `<text x="${X}" y="176" class="tl">t = ${tmax.toFixed(1)}：三条线各不相同${ashow(seq.map((t) => t >= tmax - 1e-9), kt, T)}</text>`;
  o += text(X, 204, '三条都从原点出发；pathline 与 streakline', 'ts') + text(X, 220, '只在 particle 所在处相遇。', 'ts');
  return svgA(560, 282, o, '动图：velocity 场 u 等于 1、v 等于 t，从原点连续放 dye。t 等于 1.2 时 streamline 是直线 y 等于 1.2x，pathline 是 y 等于 x 平方的一半，streakline 是 y 等于 1.2x 减 x 平方的一半');
}

// ---------- 第 1 站：pure strain 与 simple shear 下的 blob ----------
function blobA() {
  const T = 6, N = 40, tm = 0.75;
  const shown = [tm, tm, 0], kt = [0, 0.2, 0.201];
  for (let i = 1; i <= N; i++) { shown.push((tm * i) / N); kt.push(0.201 + ((0.9 - 0.201) * i) / N); }
  shown.push(tm); kt.push(1);
  let o = '';
  const panel = (x0, Mof, title, note, stream) => {
    const C = [x0 + 120, 150], s = 62;
    const P = (v) => [C[0] + s * v[0], C[1] - s * v[1]];
    o += rect(x0, 40, 240, 220, 'frame');
    o += stream(C, s);
    const blob = (t) => { const Mt = Mof(t), pts = []; for (let k = 0; k <= 72; k++) { const a = (2 * Math.PI * k) / 72, v = [Math.cos(a) * 0.7, Math.sin(a) * 0.7]; pts.push(P([Mt[0][0] * v[0] + Mt[0][1] * v[1], Mt[1][0] * v[0] + Mt[1][1] * v[1]])); } return d(pts) + 'Z'; };
    const arm = (t, v) => { const Mt = Mof(t); const w = [Mt[0][0] * v[0] + Mt[0][1] * v[1], Mt[1][0] * v[0] + Mt[1][1] * v[1]]; return d([P([-w[0], -w[1]]), P(w)]); };
    o += apath(shown.map(blob), kt, T, 'wash ink-s');
    o += apath(shown.map((t) => arm(t, [0.7, 0])), kt, T, 'ln');
    o += apath(shown.map((t) => arm(t, [0, 0.7])), kt, T, 'ink-b');
    o += text(x0 + 120, 30, title, 'tb', 'middle');
    o += text(x0 + 120, 278, note, 'ts', 'middle');
  };
  const hyp = (C, s) => {
    let q = '';
    for (const c of [0.25, 0.8]) for (const sg of [1, -1]) for (const sw of [0, 1]) {
      const pts = [];
      for (let k = -30; k <= 30; k++) { const a = (k / 30) * 1.5; let x = sg * Math.sqrt(c) * Math.cosh(a), y = Math.sqrt(c) * Math.sinh(a); if (sw) [x, y] = [y, x]; if (Math.abs(x) < 1.8 && Math.abs(y) < 1.6) pts.push([C[0] + s * x, C[1] - s * y]); }
      q += path(d(pts), 'grid');
    }
    q += line(C[0] - 1.7 * s, C[1] + 1.6 * s * 0.98, C[0] + 1.7 * s, C[1] - 1.6 * s * 0.98, 'grid') + line(C[0] - 1.7 * s, C[1] - 1.6 * s * 0.98, C[0] + 1.7 * s, C[1] + 1.6 * s * 0.98, 'grid');
    return q;
  };
  const shear = (C, s) => { let q = ''; for (const y of [-1.4, -0.7, 0.7, 1.4]) { const L = 0.75 * s * y; q += arrow(C[0] - L / 2, C[1] - s * y, C[0] + L / 2, C[1] - s * y, 'mute', 5); } q += line(C[0] - 1.8 * s, C[1], C[0] + 1.8 * s, C[1], 'grid'); return q; };
  const strainM = (t) => [[Math.cosh(t), Math.sinh(t)], [Math.sinh(t), Math.cosh(t)]];
  const shearM = (t) => [[1, 2 * t], [0, 1]];
  panel(20, strainM, 'u = y，v = x', '两根 arm 反向转、转得一样多：ω = 0', hyp);
  panel(300, shearM, 'u = 2y，v = 0', 'Horizontal arm 不动，vertical arm 倒下：ω = −2', shear);
  return svgA(560, 290, o, '动图：同一个圆形 blob 和两根垂直的 arm。左边 pure strain 里两根 arm 向相反方向各转一样多，blob 沿 45 度方向拉长；右边 simple shear 里水平 arm 不动、竖直 arm 倒下，blob 同时被拉长和转动');
}

// ---------- 第 1 站：linear propagator 的 SVD ----------
function svdfig() {
  const M = [[-0.4945, -0.5752], [-2.2910, 1.2716]];
  const a = M[0][0] ** 2 + M[1][0] ** 2, b = M[0][0] * M[0][1] + M[1][0] * M[1][1], c = M[0][1] ** 2 + M[1][1] ** 2;
  const m = (a + c) / 2, r = Math.hypot((a - c) / 2, b), s1 = Math.sqrt(m + r), s2 = Math.sqrt(m - r);
  const th = Math.atan2(m + r - a, b), v1 = [Math.cos(th), Math.sin(th)], v2 = [-Math.sin(th), Math.cos(th)];
  const mul = (v) => [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
  const S = 46, L = [120, 160], R = [400, 160];
  const pt = (O, v, k = S) => [O[0] + k * v[0], O[1] - k * v[1]];
  let o = '';
  for (const O of [L, R]) o += line(O[0] - 130, O[1], O[0] + 130, O[1], 'grid') + line(O[0], O[1] - 130, O[0], O[1] + 130, 'grid');
  const circ = [], ell = [];
  for (let i = 0; i <= 120; i++) { const t = (2 * Math.PI * i) / 120, v = [Math.cos(t), Math.sin(t)]; circ.push(pt(L, v)); ell.push(pt(R, mul(v))); }
  o += path(d(circ) + 'Z', 'wash ink-s') + path(d(ell) + 'Z', 'wash ink-s');
  const p1 = pt(L, v1), p2 = pt(L, v2), q1 = pt(R, mul(v1)), q2 = pt(R, mul(v2));
  o += arrow(L[0], L[1], p1[0], p1[1], 'ln') + arrow(L[0], L[1], p2[0], p2[1], 'ink');
  o += arrow(R[0], R[1], q1[0], q1[1], 'ln') + arrow(R[0], R[1], q2[0], q2[1], 'ink');
  o += text(p1[0] + 6, p1[1] - 2, 'v₁', 'tl') + text(p2[0] - 6, p2[1] - 4, 'v₂', 'tb', 'end');
  o += text(q1[0] + 8, q1[1] + 14, 'σ₁u₁', 'tl') + text(q2[0] + 8, q2[1] - 6, 'σ₂u₂', 'tb');
  o += arrow(244, 160, 280, 160, 'ink') + text(262, 150, '乘 M', 'ts', 'middle');
  o += text(L[0], 312, 'Initial time：一圈 δx(0)', 't', 'middle') + text(R[0], 312, 'Final time：M δx(0)', 't', 'middle');
  o += text(280, 334, `σ₁ = ${s1.toFixed(3)}，σ₂ = ${s2.toFixed(3)}；v₁ = (${v1[0].toFixed(3)}, ${v1[1].toFixed(3)}) 方向的扰动长得最快`, 'ts', 'middle');
  return svg(560, 342, o, 'Lecture 5 的 propagator M 把 initial time 的单位圆映成 final time 的 ellipse；singular vector v1 映到 ellipse 的长轴，长了 2.625 倍');
}

// ---------- 第 2 站：Reynolds transport theorem 的几何 ----------
function rtt() {
  let o = '';
  const cv = [[120, 70], [330, 70], [330, 220], [120, 220]];
  const sh = 46;
  const mv = cv.map(([x, y]) => [x + sh + (y - 70) * 0.12, y]);
  o += poly(mv, 'wash');
  o += poly(cv, 'frame') + path(d(cv) + 'Z', 'ink-b');
  o += path(d(mv) + 'Z', 'ln-dash');
  // 进出的两条带子
  o += poly([[330, 70], [mv[1][0], 70], [mv[2][0], 220], [330, 220]], 'wash-strong');
  o += poly([[120, 70], [mv[0][0], 70], [mv[3][0], 220], [120, 220]], 'wash2');
  for (const y of [100, 145, 190]) o += arrow(300, y, 350 + (y - 70) * 0.12, y, 'ink');
  o += text(225, 58, 'control volume V（固定）', 'tb', 'middle');
  o += text(mv[1][0] + 12, 90, '流出的带子', 'tl') + text(mv[1][0] + 12, 106, '厚 (u·n)Δt', 'ts');
  o += text(126, 240, '流入的带子（u·n < 0）', 'ts');
  o += text(mv[2][0] - 4, 258, 'Δt 之后的 material volume（虚线）', 'ts', 'end');
  o += text(400, 160, 'dC/dt = ∫ ∂c/∂t dV', 't') + text(412, 180, '+ ∮ c u·dA', 't');
  return svg(560, 266, o, '时刻 t 与固定的 control volume 重合的 material volume，Δt 之后整体右移；右边多出一条流出的带子，左边空出一条流入的带子');
}

// ---------- 第 2 站：plane Couette flow ----------
function couette() {
  const X0 = 60, X1 = 500, yb = 210, yt = 70;
  let o = rect(X0, yt - 14, X1 - X0, 14, 'solid2') + rect(X0, yb, X1 - X0, 14, 'solid2');
  o += rect(X0, yt, X1 - X0, yb - yt, 'wash');
  o += arrow(380, yt - 26, 460, yt - 26, 'ink-b') + text(470, yt - 22, 'U = 1 m/s', 't');
  o += text(X0, yt - 24, 'upper plate（moving）', 'ts') + text(X0, yb + 34, 'lower plate（fixed）', 'ts');
  const x0 = 140;
  o += line(x0, yt, x0, yb, 'ink');
  for (let k = 1; k <= 5; k++) { const y = yb - ((yb - yt) * k) / 5, L = (180 * k) / 5; o += arrow(x0, y, x0 + L, y, 'ln', 6); }
  o += line(x0, yb, x0 + 180, yt, 'dash');
  o += text(x0 + 186, yt + 16, 'u = U y / b', 'tl');
  o += line(X0 + 24, yt, X0 + 24, yb, 'mute') + text(X0 + 30, (yt + yb) / 2 + 4, 'b = 1 cm', 'ts');
  // 一个 fluid element 和上下面的 shear stress
  const ex = 400, ey = 140, w = 50;
  o += rect(ex - w / 2, ey - w / 2, w, w, 'paper');
  o += arrow(ex - 20, ey - w / 2 - 6, ex + 24, ey - w / 2 - 6, 'ink', 6) + arrow(ex + 20, ey + w / 2 + 6, ex - 24, ey + w / 2 + 6, 'ink', 6);
  o += text(ex + 30, ey - w / 2 - 2, 'τ = μU/b', 't') + text(ex + 32, ey + w / 2 + 12, '= 0.1 Pa', 'ts');
  return svg(560, 256, o, '两块平板之间的 Couette flow：下板固定、上板以 1 米每秒运动，间距 1 厘米，velocity 线性分布，水里的 shear stress 是 0.1 帕');
}

// ---------- 第 3 站：被推一下的 parcel 以 N 振荡 ----------
function buoyA() {
  const N = 6.187e-3, Tn = (2 * Math.PI) / N; // s
  const T = 5, M = 60, kt = [], zs = [];
  for (let i = 0; i <= M; i++) { kt.push(i / M); zs.push(Math.cos((2 * Math.PI * i) / M)); }
  const X0 = 60, X1 = 300, top = 40, bot = 260;
  let o = '';
  for (let k = 0; k < 8; k++) { const y = top + ((bot - top) * k) / 8; o += rect(X0, y, X1 - X0, (bot - top) / 8, k % 2 ? 'wash' : 'wash2'); }
  for (let k = 1; k < 8; k++) { const y = top + ((bot - top) * k) / 8; o += line(X0, y, X1, y, 'grid'); }
  o += text(X0, top - 10, '较轻（上）', 'ts') + text(X0, bot + 18, '较重（下）：500 m 里 density 增加 2 kg/m³', 'ts');
  const cz = (top + bot) / 2, A = 60;
  o += line(X0 + 120 - 30, cz, X0 + 120 + 30, cz, 'dash') + text(X0 + 160, cz + 4, 'equilibrium', 'ts');
  o += acircle(zs.map(() => X0 + 120), zs.map((z) => cz - A * z), kt, T, 12, 'solid');
  // 右侧 z(t)
  const sx = lin(0, 2 * Tn / 60, 350, 540), sy = lin(-1.2, 1.2, 230, 70);
  o += axes({ sx, sy, x0: 0, x1: 2 * Tn / 60, y0: -1.2, y1: 1.2, xt: [0, [Tn / 60, (Tn / 60).toFixed(0)], [2 * Tn / 60, (2 * Tn / 60).toFixed(0)]], yt: [], xl: 't（min）' });
  o += path(curve((t) => Math.cos((2 * Math.PI * t) / (Tn / 60)), 0, 2 * Tn / 60, sx, sy), 'ln');
  o += text(350, 50, 'parcel 的位移 z′(t)', 'tb');
  o += text(350, 290, 'N = ' + N.toExponential(2).replace('e-3', '×10⁻³') + ' s⁻¹，周期 2π/N = ' + (Tn / 60).toFixed(1) + ' min', 'ts');
  return svgA(560, 300, o, '动图：thermocline 里被往上推了一下的 parcel，在 buoyancy 作用下以 N 约 6.2 乘 10 的负 3 次方每秒上下振荡，周期约 17 分钟');
}

// ---------- 第 4 站：solid-body rotation 与 point vortex ----------
function vortexA() {
  const T = 6, M = 60, hold = 0.2, kt = [0, hold, hold + 0.001];
  for (let i = 1; i <= M; i++) kt.push(hold + 0.001 + ((0.999 - hold) * i) / M);
  const fr = [M, M, ...Array(M + 1).keys()];
  let o = '';
  const panel = (cx, title, omega, note) => {
    const cy = 150, S = 50, r0 = 1.8, turn = 1 / 8;
    o += circle(cx, cy, 3.5, 'ink-f') + circle(cx, cy, S * r0, 'grid');
    for (const a0 of [Math.PI / 2, Math.PI / 2 + (2 * Math.PI) / 3, Math.PI / 2 + (4 * Math.PI) / 3]) {
      const arm = 0.3;
      const ends = [[r0 - arm, a0], [r0 + arm, a0], [r0, a0 - arm / r0], [r0, a0 + arm / r0]];
      const at = (r, a, i) => { const ang = a + omega(r) * 2 * Math.PI * turn * (i / M); return [cx + S * r * Math.cos(ang), cy - S * r * Math.sin(ang)]; };
      const seg = (e1, e2, i) => d([at(...e1, i), at(...e2, i)]);
      o += apath(fr.map((i) => seg(ends[0], ends[1], i)), kt, T, 'ln');
      o += apath(fr.map((i) => seg(ends[2], ends[3], i)), kt, T, 'ink-b');
    }
    o += text(cx, 22, title, 'tb', 'middle') + text(cx, 284, note, 'ts', 'middle');
  };
  panel(140, 'solid-body：u_θ = Ω₀r', () => 1, '十字跟着转：ω = 2Ω₀');
  panel(420, 'point vortex：u_θ = Γ/(2πr)', (r) => (1.8 / r) ** 2, '切向 arm 逆时针、径向 arm 顺时针：ω = 0');
  return svgA(560, 294, o, '动图：三个小十字绕中心转八分之一圈。左边 solid-body rotation 中十字自身也转了 45 度；右边 point vortex 中内侧转得快、外侧转得慢，径向的 arm 往后倒，切向的 arm 往前转，一开始两者的角速度大小相等、方向相反');
}

// ---------- 第 4 站：vortex pair 撞墙（Problem Set 6 第 1c 题） ----------
function pairData() {
  const vort = [[-2.5, 9, -10], [2.5, 9, 10]];
  const vel = (st) => st.map(([x, y], i) => {
    let u = 0, v = 0;
    const all = [];
    st.forEach(([xj, yj], j) => { all.push([xj, yj, vort[j][2], j === i]); all.push([xj, -yj, -vort[j][2], false]); });
    for (const [xj, yj, gj, self] of all) { if (self) continue; const dx = x - xj, dy = y - yj, r2 = dx * dx + dy * dy; u += (-gj / (2 * Math.PI)) * dy / r2; v += (gj / (2 * Math.PI)) * dx / r2; }
    return [u, v];
  });
  let st = vort.map(([x, y]) => [x, y]);
  const out = [st.map((p) => [...p])], dt = 0.02, every = 25;
  for (let n = 1; n <= 25 * 160; n++) {
    const k1 = vel(st), s2 = st.map((p, i) => [p[0] + dt / 2 * k1[i][0], p[1] + dt / 2 * k1[i][1]]);
    const k2 = vel(s2), s3 = st.map((p, i) => [p[0] + dt / 2 * k2[i][0], p[1] + dt / 2 * k2[i][1]]);
    const k3 = vel(s3), s4 = st.map((p, i) => [p[0] + dt * k3[i][0], p[1] + dt * k3[i][1]]);
    const k4 = vel(s4);
    st = st.map((p, i) => [p[0] + dt / 6 * (k1[i][0] + 2 * k2[i][0] + 2 * k3[i][0] + k4[i][0]), p[1] + dt / 6 * (k1[i][1] + 2 * k2[i][1] + 2 * k3[i][1] + k4[i][1])]);
    if (n % every === 0) out.push(st.map((p) => [...p]));
    if (Math.abs(st[0][0]) > 10.5) break;
  }
  return out;
}
function pairA() {
  const fr = pairData(), n = fr.length, tEnd = (n - 1) * 0.5;
  const sx = lin(-10, 10, 70, 490), sy = lin(-3.2, 10, 268, 44);
  let o = rect(sx(-10), sy(0), sx(10) - sx(-10), sy(-3.2) - sy(0), 'wash2');
  o += line(sx(-10), sy(0), sx(10), sy(0), 'ink-b') + text(sx(10), sy(0) + 16, 'wall y = 0', 'ts', 'end');
  o += text(sx(-10), sy(-3.2) - 6, 'wall 下面是 image vortex（只用来满足 v = 0）', 'ts');
  for (const k of [0, 1]) o += path(d(fr.map((s) => [sx(s[k][0]), sy(s[k][1])])), 'dash');
  const kt = fr.map((_, i) => (0.85 * i) / (n - 1)); kt.push(1);
  const T = 7;
  const seq = [...fr, fr[n - 1]];
  for (const k of [0, 1]) {
    o += acircle(seq.map((s) => sx(s[k][0])), seq.map((s) => sy(s[k][1])), kt, T, 7, k ? 'solid' : 'paper');
    o += `<g clip-path="url(#mit12800-pair-clip)">` + acircle(seq.map((s) => sx(s[k][0])), seq.map((s) => sy(-s[k][1])), kt, T, 5, 'mute-f') + `</g>`;
  }
  const yEnd = fr[n - 1][1][1];
  o += text(sx(-2.5) - 12, sy(9) - 12, 'Γ = −10', 'ts', 'end') + text(sx(2.5) + 12, sy(9) - 12, 'Γ = +10', 'ts');
  o += text(sx(0), sy(9) + 4, '0.318', 'ts', 'middle') + arrow(sx(0), sy(9) + 12, sx(0), sy(7.6), 'mute', 5);
  o += text(sx(6.4), sy(yEnd) + 24, '贴着 wall 离开，高度趋于 ' + (1 / Math.sqrt(1 / 6.25 + 1 / 81)).toFixed(2), 'ts', 'middle');
  o += line(sx(-10), sy(10), sx(-10), sy(0), 'axis');
  for (const v of [0, 5, 10]) o += text(sx(-10) - 6, sy(v) + 4, String(v), 'ts', 'end');
  return svgA(560, 282, o, '动图：两个 circulation 相反的 point vortex 从高度 9 一起往下走，靠近 wall 后分开，贴着 wall 向两边离开，最终高度约 2.41，用 4 阶 Runge–Kutta 算出');
}

// ---------- 第 5 站：一圈空气收缩（Kelvin 定理在 rotating frame） ----------
function ring() {
  let o = '';
  const cx = 160, cy = 150, S = 1.1; // px per km
  o += circle(cx, cy, 100 * S, 'dash') + circle(cx, cy, 50 * S, 'ln');
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; o += arrow(cx + 100 * S * Math.cos(a) * 0.98, cy - 100 * S * Math.sin(a) * 0.98, cx + 58 * S * Math.cos(a), cy - 58 * S * Math.sin(a), 'mute', 5); }
  for (let k = 0; k < 6; k++) { const a = (k * Math.PI) / 3 + 0.3, a2 = a + 0.42; o += arrow(cx + 50 * S * Math.cos(a), cy - 50 * S * Math.sin(a), cx + 50 * S * Math.cos(a2), cy - 50 * S * Math.sin(a2), 'ln', 6); }
  o += text(cx, cy - 100 * S - 10, 'r₁ = 100 km：相对地球静止', 'ts', 'middle');
  o += text(cx, cy + 4, 'r₂ = 50 km', 'tb', 'middle');
  o += text(cx, 290, '俯视，30°N，北在上', 'ts', 'middle');
  const X = 320;
  o += text(X, 70, 'Γₐ = (ζ + f) πr² 守恒', 'tb');
  o += text(X, 100, 'f πr₁² = (ζ + f) πr₂²', 't');
  o += text(X, 126, 'ζ = f (r₁²/r₂² − 1) = 3f', 't');
  o += text(X, 152, '= 2.19 × 10⁻⁴ s⁻¹（cyclonic）', 't');
  o += text(X, 186, '边上的 velocity：', 't') + text(X, 210, 'u_θ = ζ r₂ / 2 = 5.5 m/s', 'tl');
  return svg(560, 300, o, '30 度北纬一个半径 100 公里、相对地球静止的空气圈收缩到 50 公里，absolute circulation 守恒给出 relative vorticity 等于 3f，边上转速约 5.5 米每秒，逆时针');
}

// ---------- 第 5 站：70°N 绕地球一圈的空气（Problem Set 7 第 4 题） ----------
function grad70() {
  const u = 20, phi = 70, fc = fcor(phi) * u, cu = (u * u * Math.tan(phi * RAD)) / RE, pg = fc + cu;
  const cx = 150, cy = 160, r = 95;
  let o = circle(cx, cy, 4, 'ink-f') + text(cx + 8, cy + 18, 'North Pole', 'ts');
  o += circle(cx, cy, r, 'ln');
  for (let k = 0; k < 10; k++) { const a = (k * 2 * Math.PI) / 10, a2 = a + 0.25; o += arrow(cx + r * Math.cos(a), cy - r * Math.sin(a), cx + r * Math.cos(a2), cy - r * Math.sin(a2), 'ln', 6); }
  o += text(cx, cy - r - 12, '70°N，由北极往下看：往东 = 逆时针', 'ts', 'middle');
  // 放大的 parcel 受力
  const px = 330, py = 150, s = 26000;
  o += circle(px, py, 10, 'solid');
  o += arrow(px, py + 12, px, py + 12 + fc * s, 'ink-b') + text(px + 10, py + 12 + fc * s - 4, 'Coriolis（向南）：' + (fc * 1e3).toFixed(2) + '×10⁻³ m/s²', 't');
  o += arrow(px, py - 12, px, py - 12 - pg * s, 'ln') + text(px + 10, py - 12 - pg * s + 12, 'pressure gradient（向北）：' + (pg * 1e3).toFixed(2) + '×10⁻³', 'tl');
  o += arrow(px + 14, py, px + 60, py, 'ink') + text(px + 64, py + 4, 'u = 20 m/s', 'ts');
  o += text(280, 282, '两者之差 ' + (cu * 1e4).toFixed(2) + '×10⁻⁴ m/s² 正是绕圈所需的 centripetal acceleration u² tan φ / R', 'ts', 'middle');
  return svg(560, 292, o, '70 度北纬以 20 米每秒往东绕地球一圈的空气：Coriolis 指向南，pressure gradient 指向北且更大，差值是绕北极转圈所需的向心加速度');
}

// ---------- 第 5 站：Taylor column ----------
function taylor() {
  const a = 1, U = 1;
  const psi = (x, y) => { const r2 = x * x + y * y; return r2 < a * a ? NaN : U * y * (1 - (a * a) / r2); };
  const sx = lin(-2.78, 2.78, 300, 540), sy = lin(-2.2, 2.2, 250, 60);
  let o = rect(300, 60, 240, 190, 'frame');
  for (const c of [-1.6, -1.1, -0.65, -0.3, -0.08, 0.08, 0.3, 0.65, 1.1, 1.6]) {
    const pts = [];
    for (let k = 0; k <= 200; k++) {
      const x = -2.78 + (5.56 * k) / 200;
      let lo = c > 0 ? 0 : -2.2, hi = c > 0 ? 2.2 : 0;
      for (let it = 0; it < 50; it++) { const mid = (lo + hi) / 2; const v = x * x + mid * mid < a * a ? 0 : psi(x, mid); if (v < c) lo = mid; else hi = mid; }
      pts.push([sx(x), sy((lo + hi) / 2)]);
    }
    o += path(d(pts), 'mute');
  }
  o += circle(sx(0), sy(0), (sx(1) - sx(0)), 'wash2') + circle(sx(0), sy(0), (sx(1) - sx(0)), 'dash');
  o += arrow(306, 76, 336, 76, 'ink', 5);
  o += text(420, 48, '从上往下看：每一层都绕开', 'tb', 'middle');
  o += text(420, 272, '虚线圆正对着底部的 bump', 'ts', 'middle');
  // 侧视
  const X0 = 30, X1 = 260, top = 70, bot = 240;
  o += rect(X0, top, X1 - X0, bot - top, 'wash');
  o += path(`M${X0} ${bot} L120 ${bot} Q145 ${bot - 36} 170 ${bot} L${X1} ${bot}`, 'ink-b');
  o += rect(120, top, 50, bot - top - 18, 'wash2') + line(120, top, 120, bot - 10, 'dash') + line(170, top, 170, bot - 10, 'dash');
  for (const y of [100, 150, 200]) o += arrow(X0 + 8, y, 100, y, 'ink', 5) + arrow(190, y, X1 - 6, y, 'ink', 5);
  o += text(145, top - 10, 'Taylor column', 'tl', 'middle');
  o += text(145, bot + 20, 'bump 只有水深的 1/5', 'ts', 'middle');
  return svg(560, 284, o, '左边侧视：rotating tank 底部有一个矮 bump，它正上方整根水柱都不让流过；右边俯视：每一层的 streamline 都像绕过一根 cylinder 一样绕开');
}

// ---------- 第 5 站：Problem Set 8 第 2 题，thermal wind ----------
function thermal() {
  const Rd = 287, T = (phi) => 298.15 - (25 * phi) / 90; // K，从 25°C 线性降到 0°C
  const zOf = (p, phi) => ((Rd * T(phi)) / G) * Math.log(1000 / p) / 1e3; // km
  const sx = lin(0, 90, 60, 330), sy = lin(0, 11, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 90, y0: 0, y1: 11, xt: [0, 30, 45, 60, 90], yt: [0, 2, 4, 6, 8, 10], xl: 'latitude（°N）', yl: 'height（km）', grid: true });
  for (const p of [900, 800, 700, 600, 500, 400, 300]) {
    o += path(curve((phi) => zOf(p, phi), 0, 90, sx, sy, 60), 'ln');
    o += text(sx(90) + 4, sy(zOf(p, 90)) + 4, p + ' hPa', 'ts');
  }
  o += text(sx(45), sy(0.3), 'T = 25 °C → 0 °C，每根 column 内 T 不随高度变', 'ts', 'middle');
  // 45°N 的 u(z)
  const fq = fcor(45), dTdy = -25 / ((Math.PI * RE) / 2);
  const u = (z) => (G * z * 1e3 * -dTdy) / (fq * T(45));
  const ux = lin(0, 10, 420, 540);
  o += axes({ sx: ux, sy, x0: 0, x1: 10, y0: 0, y1: 11, xt: [0, 5, 10], yt: [], xl: 'u（m/s）' });
  o += path(curve((z) => z, 0, 10, (z) => ux(u(z)), sy, 10), 'ink-b');
  o += text(420, 28, '45°N 的 geostrophic u', 'tb');
  o += circle(ux(u(10)), sy(10), 3.5, 'ink-f');
  o += text(ux(5.4), sy(5), '10 km 处', 'tl') + text(ux(5.4), sy(5) + 16, u(10).toFixed(1) + ' m/s', 'tl');
  return svg(560, 290, o, '左边：温度从赤道 25 度线性降到北极 0 度时的 pressure 面，越往上越陡；右边：45 度北纬的 geostrophic 西风从地面 0 线性增到 10 公里处约 8.3 米每秒');
}

// ---------- 第 6 站：boundary layer 长不长（数值解） ----------
function blData() {
  // 无量纲：f = 1，δ = √(2ν/f) = 1 → ν = 0.5。Interior u = 1，底部 no-slip。
  const nu = 0.5, Z = 12, nz = 200, dz = Z / nz, dt = 0.002;
  let ur = new Float64Array(nz + 1).fill(0), ui = new Float64Array(nz + 1).fill(0); // 偏差 V' = (u − 1) + i v
  ur[0] = -1;
  const outT = [0.05, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 15, 18];
  const res = [];
  let t = 0, k = 0;
  const steps = Math.round(18 / dt);
  for (let n = 1; n <= steps; n++) {
    const nr = new Float64Array(nz + 1), ni = new Float64Array(nz + 1);
    nr[0] = -1; ni[0] = 0;
    for (let j = 1; j < nz; j++) {
      const lr = (ur[j + 1] - 2 * ur[j] + ur[j - 1]) / (dz * dz), li = (ui[j + 1] - 2 * ui[j] + ui[j - 1]) / (dz * dz);
      // ∂V'/∂t = −i f V' + ν ∂²V'/∂z²
      nr[j] = ur[j] + dt * (ui[j] + nu * lr);
      ni[j] = ui[j] + dt * (-ur[j] + nu * li);
    }
    ur = nr; ui = ni; t = n * dt;
    if (k < outT.length && t >= outT[k] - 1e-9) { res.push({ t: outT[k], u: Array.from(ur, (x) => x + 1), v: Array.from(ui) }); k++; }
  }
  return { res, dz, nz, nu };
}
function blA() {
  const { res, dz, nz, nu } = blData();
  const erf = (x) => { const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return y; };
  const n = res.length, T = 8;
  const kt = [0, 0.2]; res.forEach((_, i) => kt.push(0.201 + (0.799 * i) / (n - 1)));
  const seq = [res[n - 1], res[n - 1], ...res];
  const idx = [n - 1, n - 1, ...res.map((_, i) => i)];
  let o = '';
  const sz = lin(0, 8, 250, 60);
  const panel = (x0, title) => { const sx = lin(-0.2, 1.3, x0, x0 + 220); o += axes({ sx, sy: sz, x0: -0.2, x1: 1.3, y0: 0, y1: 8, xt: [0, 0.5, 1], yt: x0 < 200 ? [0, 2, 4, 6, 8] : [], xl: 'u / U', yl: x0 < 200 ? 'z / δ' : '' }); o += line(sx(1), sz(0), sx(1), sz(8), 'grid'); o += text(x0 + 110, 30, title, 'tb', 'middle'); return sx; };
  const sa = panel(60, '不转：一直往上长'), sb = panel(320, '转：长到 δ 就停');
  const prof = (sx, fn) => { const pts = []; for (let j = 0; j <= nz; j++) { const z = j * dz; if (z > 8) break; pts.push([sx(fn(j, z)), sz(z)]); } return d(pts); };
  o += apath(seq.map((r) => prof(sa, (j, z) => erf(z / (2 * Math.sqrt(nu * r.t))))), kt, T, 'ln');
  o += apath(seq.map((r) => prof(sb, (j) => r.u[j])), kt, T, 'ln');
  o += apath(seq.map((r) => prof(sb, (j) => r.v[j])), kt, T, 'ln-dash');
  // 最终的 Ekman 解作参照
  o += path(prof(sb, (j, z) => 1 - Math.exp(-z) * Math.cos(z)), 'dash');
  o += text(sb(0.38), sz(1.0), 'v', 'tl') + text(sb(1.16), sz(3.1), 'u', 'tl');
  for (let i = 0; i < n; i++) {
    const on = idx.map((j) => j === i);
    o += `<text x="290" y="54" class="tl" text-anchor="middle">f t = ${res[i].t}${ashow(on, kt, T)}</text>`;
  }
  return svgA(560, 292, o, '动图：底部突然变成 no-slip。左边不转的流体里 boundary layer 按根号 t 一直变厚；右边转的流体里，约一个 inertial period 之后 u 和 v 的 profile 停在 steady Ekman 解上，厚度约几个 δ');
}

// ---------- 第 6 站：spin-down 的 secondary circulation ----------
function spindownA() {
  const tau = 4.71; // min
  const T = 6, M = 40, kt = [], amp = [];
  for (let i = 0; i <= M; i++) { kt.push(i / M); amp.push(Math.exp(-(15 * i) / M / tau)); }
  const X0 = 40, X1 = 280, top = 50, bot = 250;
  let o = rect(X0, top, X1 - X0, bot - top, 'wash');
  o += line(X0, top - 10, X0, bot, 'ink-b') + line(X1, top - 10, X1, bot, 'ink-b') + line(X0, bot, X1, bot, 'ink-b');
  o += line((X0 + X1) / 2, top - 16, (X0 + X1) / 2, bot, 'dash') + text((X0 + X1) / 2, top - 22, 'axis', 'ts', 'middle');
  o += rect(X0, bot - 12, X1 - X0, 12, 'wash-strong') + text((X0 + X1) / 2, bot + 20, '彩色底层：Ekman layer（δ = 1.4 mm，放大画）', 'ts', 'middle');
  const cx = (X0 + X1) / 2;
  const arrowsAt = (sgn) => {
    let q = '';
    for (const s of [1, -1]) {
      q += arrow(cx + s * 100, bot - 6, cx + s * 24, bot - 6, 'ink', 5); // 底层往里
      q += arrow(cx + s * 12, bot - 16, cx + s * 12, top + 60, 'ink', 5); // 中间往上（Ekman suction）
      q += arrow(cx + s * 28, top + 110, cx + s * 90, top + 110, 'mute', 5); // interior 往外
      q += arrow(cx + s * 112, top + 40, cx + s * 112, bot - 20, 'mute', 5); // 侧壁往下
    }
    return q;
  };
  o += `<g>${arrowsAt()}${anim('opacity', amp.map((a) => (0.15 + 0.85 * a).toFixed(3)), kt, T)}</g>`;
  o += text(cx, bot + 38, 'cross-section：relative ζ > 0（比 tank 转得快）', 'ts', 'middle');
  // 右：ζ(t)
  const sx = lin(0, 15, 330, 540), sy = lin(0, 1, 230, 60);
  o += axes({ sx, sy, x0: 0, x1: 15, y0: 0, y1: 1, xt: [0, 5, 10, 15], yt: [0, 0.5, 1], xl: 't（min）', grid: true });
  o += path(curve((t) => Math.exp(-t / tau), 0, 15, sx, sy), 'ln');
  o += acircle(amp.map((_, i) => sx((15 * i) / M)), amp.map((a) => sy(a)), kt, T, 5, 'ln-f');
  o += text(330, 40, 'ζ / ζ₀ = e^(−t/τ)，τ = 2H/(fδ) = 4.7 min', 'tb');
  return svgA(560, 298, o, '动图：转得比 tank 快的水，底部 Ekman layer 把水往轴心推，从中间被 suction 抽上来，在 interior 往外流，沿侧壁回到底部；这个 secondary circulation 和 relative vorticity 一起按 4.7 分钟的 e-folding time 衰减');
}

// ---------- 第 7 站：column 越过 seamount ----------
function columnA() {
  const H0 = 4000, Hs = 3000, f30 = fcor(30);
  const depth = (x) => H0 - (H0 - Hs) * Math.exp(-((x / 0.9) ** 2));
  const T = 8, M = 80, xs0 = [];
  for (let i = 0; i <= M; i++) xs0.push(-3 + (6 * i) / M);
  const order = [M / 2, M / 2, ...Array(M + 1).keys()];
  const kt = [0, 0.2]; for (let i = 0; i <= M; i++) kt.push(0.201 + (0.799 * i) / M);
  const xs = order.map((i) => xs0[i]);
  const sx = lin(-3.2, 3.2, 40, 520), sz = lin(0, 4400, 50, 230);
  let o = '';
  const bed = []; for (let k = 0; k <= 120; k++) { const x = -3.2 + (6.4 * k) / 120; bed.push([sx(x), sz(depth(x))]); }
  o += path(d([[sx(-3.2), sz(0)], ...bed, [sx(3.2), sz(0)]]) + 'Z', 'wash');
  o += path(d([[sx(-3.2), sz(4400)], ...bed, [sx(3.2), sz(4400)]]) + 'Z', 'wash2');
  o += line(sx(-3.2), sz(0), sx(3.2), sz(0), 'ink-b') + path(d(bed), 'ink-b');
  o += text(sx(-3.2), 250, 'seamount：水深 4000 → 3000 m', 'ts');
  // column：高 h，宽 ∝ 1/√h（体积守恒）
  const w0 = 44;
  const colD = (x) => { const h = depth(x), w = w0 * Math.sqrt(H0 / h); return d([[sx(x) - w / 2, sz(0)], [sx(x) + w / 2, sz(0)], [sx(x) + w / 2, sz(h)], [sx(x) - w / 2, sz(h)]]) + 'Z'; };
  o += apath(xs.map(colD), kt, T, 'paper');
  // 顶上的 spin 指示：角度按 ζ/2 积分（顺时针 = anticyclonic）
  let ang = 0; const angs0 = [0];
  for (let i = 1; i <= M; i++) { const z = f30 * (depth(xs0[i]) / H0 - 1); ang += (z / f30) * 1400 * (1 / M); angs0.push(ang); }
  const angs = order.map((i) => angs0[i]);
  const cy = 34;
  o += `<g><g>${line(-14, 0, 14, 0, 'ink-b')}${circle(0, 0, 3, 'ink-f')}${animRot(angs.map((a) => -a), 0, 0, kt, T)}</g>${atrans(xs.map((x) => sx(x)), xs.map(() => cy), kt, T)}</g>`;
  o += text(sx(-3.2), 18, '上面那根短棒：column 相对地球的转动（越过 seamount 时顺时针转）', 'ts');
  o += text(sx(3.2), 250, '30°N：ζ = f (h/H₀ − 1)，最浅处 ' + (f30 * (Hs / H0 - 1) * 1e5).toFixed(2) + '×10⁻⁵ s⁻¹', 'ts', 'end');
  return svgA(560, 262, o, '动图：30 度北纬一根 4000 米高、原本不转的水柱被流带着越过 3000 米深的 seamount，被压扁变粗，同时 relative vorticity 变成负的，水柱顺时针转；离开后恢复原样');
}

// ---------- 第 8 站：geostrophic adjustment（数值解） ----------
function adjData(fco) {
  const L = 20, nx = 800, dx = (2 * L) / nx, dt = 0.4 * dx, x = [];
  for (let i = 0; i <= nx; i++) x.push(-L + i * dx);
  let eta = x.map((xx) => -Math.tanh(xx / 0.3)), u = x.map(() => 0), v = x.map(() => 0);
  const out = [], times = [];
  const tOut = []; for (let k = 0; k <= 40; k++) tOut.push((k * 24) / 40);
  let next = 0;
  const steps = Math.round(24 / dt);
  const rhs = (e, uu, vv) => {
    const de = new Array(nx + 1).fill(0), du = new Array(nx + 1).fill(0), dv = new Array(nx + 1).fill(0);
    for (let i = 1; i < nx; i++) {
      du[i] = fco * vv[i] - (e[i + 1] - e[i - 1]) / (2 * dx);
      dv[i] = -fco * uu[i];
      de[i] = -(uu[i + 1] - uu[i - 1]) / (2 * dx);
    }
    return [de, du, dv];
  };
  for (let n = 0; n <= steps; n++) {
    const t = n * dt;
    if (next < tOut.length && t >= tOut[next] - 1e-9) { out.push({ eta: [...eta], v: [...v] }); times.push(tOut[next]); next++; }
    // RK4
    const k1 = rhs(eta, u, v);
    const a = (arr, k, s) => arr.map((y, i) => y + s * k[i]);
    const e2 = a(eta, k1[0], dt / 2), u2 = a(u, k1[1], dt / 2), v2 = a(v, k1[2], dt / 2), k2 = rhs(e2, u2, v2);
    const e3 = a(eta, k2[0], dt / 2), u3 = a(u, k2[1], dt / 2), v3 = a(v, k2[2], dt / 2), k3 = rhs(e3, u3, v3);
    const e4 = a(eta, k3[0], dt), u4 = a(u, k3[1], dt), v4 = a(v, k3[2], dt), k4 = rhs(e4, u4, v4);
    eta = eta.map((y, i) => y + (dt / 6) * (k1[0][i] + 2 * k2[0][i] + 2 * k3[0][i] + k4[0][i]));
    u = u.map((y, i) => y + (dt / 6) * (k1[1][i] + 2 * k2[1][i] + 2 * k3[1][i] + k4[1][i]));
    v = v.map((y, i) => y + (dt / 6) * (k1[2][i] + 2 * k2[2][i] + 2 * k3[2][i] + k4[2][i]));
    eta[0] = 1; eta[nx] = -1; u[0] = u[nx] = 0;
  }
  return { x, out, times };
}
function adjustA() {
  const A = adjData(0), B = adjData(1);
  const n = A.out.length, T = 9;
  const kt = [0, 0.2]; A.times.forEach((t) => kt.push(0.201 + (0.799 * t) / 24));
  const order = [n - 1, n - 1, ...A.out.map((_, i) => i)];
  let o = '';
  const sx = lin(-8, 8, 70, 530);
  const prof = (arr, x, sy) => { const pts = []; for (let i = 0; i < x.length; i += 4) if (x[i] >= -8 && x[i] <= 8) pts.push([sx(x[i]), sy(arr[i])]); return d(pts); };
  const panel = (y0, title, D, withV) => {
    const sy = lin(-1.3, 1.3, y0 + 100, y0);
    o += rect(70, y0, 460, 100, 'frame') + line(70, sy(0), 530, sy(0), 'grid');
    o += text(66, sy(1) + 4, '+η₀', 'ts', 'end') + text(66, sy(-1) + 4, '−η₀', 'ts', 'end');
    o += text(70, y0 - 8, title, 'tb');
    const seq = order.map((i) => D.out[i]);
    if (withV) {
      o += path(curve((x) => -sgn(x) * (1 - Math.exp(-Math.abs(x))), -8, 8, sx, sy, 400), 'dash');
      o += apath(seq.map((r) => prof(r.v, D.x, sy)), kt, T, 'ink');
    }
    o += apath(seq.map((r) => prof(r.eta, D.x, sy)), kt, T, 'ln');
  };
  panel(36, 'f = 0', A, false);
  panel(166, 'f ≠ 0：彩线 η，黑线 v（单位 gη₀/c），虚线是 PV 算出的终态', B, true);
  for (const x of [-8, -4, 0, 4, 8]) o += text(sx(x), 284, String(x), 'ts', 'middle');
  o += text(530, 300, 'x / L_d', 'ts', 'end');
  for (let i = 0; i < n; i++) {
    const on = order.map((j) => j === i);
    o += `<text x="530" y="28" class="tl" text-anchor="end">f t = ${A.times[i].toFixed(1)}${ashow(on, kt, T)}</text>`;
  }
  return svgA(560, 304, o, '动图：同一个 step 形的 surface 放开后，上图不转时两个 gravity wave front 以 c 往两边走，中间完全变平；下图转时 wave 走掉之后，step 附近留下一个宽约一个 deformation radius 的斜坡和一条 geostrophic jet，和由 potential vorticity 算出的终态重合');
}

// ---------- 第 8 站：Poincaré wave 的 dispersion relation ----------
function poincare() {
  const sx = lin(0, 4, 70, 380), sy = lin(0, 4.2, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 4.2, xt: [0, 1, 2, 3, 4], yt: [0, 1, 2, 3, 4], xl: 'K L_d', yl: 'ω / f', grid: true });
  o += path(curve((k) => k, 0, 4, sx, sy), 'dash');
  o += line(sx(0), sy(1), sx(4), sy(1), 'dash');
  o += path(curve((k) => Math.sqrt(1 + k * k), 0, 4, sx, sy), 'ln');
  o += line(sx(0), sy(0), sx(4), sy(0), 'ink-b');
  o += text(sx(0.3), sy(3.4), 'Poincaré：ω² = f² + c²K²', 'tl', 'start');
  o += text(sx(3.3) + 4, sy(3.0), 'ω = cK', 'ts', 'start');
  o += text(sx(2.6), sy(1) + 16, 'ω = f（inertial oscillation）', 'ts', 'start');
  o += text(sx(2.4), sy(0) - 8, 'ω = 0：geostrophic flow', 'tb', 'start');
  const X = 400;
  o += text(X, 70, 'K L_d ≪ 1：', 'tb') + text(X, 88, 'wavelength ≫ L_d，', 'ts') + text(X, 104, '几乎只是 inertial', 'ts') + text(X, 120, 'oscillation', 'ts');
  o += text(X, 160, 'K L_d ≫ 1：', 'tb') + text(X, 178, 'wavelength ≪ L_d，', 'ts') + text(X, 194, 'rotation 不起作用', 'ts');
  return svg(560, 280, o, 'Rotating shallow water 的 dispersion relation：Poincaré wave 的 frequency 永远大于 f，长波接近 inertial oscillation，短波接近不转的 gravity wave；另有一支 frequency 为零的 geostrophic flow');
}

// ---------- 第 8 站：沿岸的 Kelvin wave ----------
function kelvinA() {
  const T = 7, M = 60, kt = [];
  for (let i = 0; i <= M; i++) kt.push(i / M);
  const sx = lin(0, 10, 40, 520), sy = lin(0, 3.2, 230, 70); // x、y 以 L_d 为单位
  let o = rect(40, 230, 480, 24, 'solid2') + text(280, 247, 'coast（y = 0）', 'tw', 'middle');
  o += rect(40, 70, 480, 160, 'wash');
  o += `<clipPath id="mit12800-kel-clip"><rect x="40" y="60" width="480" height="170"/></clipPath>`;
  const w = 0.9;
  let g = '';
  for (const q of [0.15, 0.35, 0.6, 0.85]) {
    const pts = [];
    // e^{-y} e^{-(s/w)^2} = q → y = −ln q − (s/w)²
    const smax = w * Math.sqrt(-Math.log(q));
    for (let k = 0; k <= 60; k++) { const s = -smax + (2 * smax * k) / 60; const y = Math.max(0, -Math.log(q) - (s / w) ** 2); pts.push([sx(5 + s) - sx(0) + 40, sy(y)]); }
    g += path(d(pts), q > 0.5 ? 'ln' : 'mute');
  }
  for (const s of [-0.9, 0, 0.9]) { const a = Math.exp(-((s / w) ** 2)); for (const y of [0.25, 1.1]) { const len = 46 * a * Math.exp(-y); if (len > 6) g += arrow(sx(5 + s) - sx(0) + 40 - len / 2, sy(y), sx(5 + s) - sx(0) + 40 + len / 2, sy(y), 'ink', 5); } }
  const sh0 = []; for (let i = 0; i <= M; i++) sh0.push(sx(-5 + (10 * i) / M) - sx(0));
  const shift = [sh0[M / 2], sh0[M / 2], ...sh0], kk = [0, 0.2]; for (let i = 0; i <= M; i++) kk.push(0.201 + (0.799 * i) / M);
  o += `<g clip-path="url(#mit12800-kel-clip)"><g>${g}${atrans(shift, shift.map(() => 0), kk, T)}</g></g>`;
  o += line(530, sy(0), 530, sy(1), 'mute') + line(526, sy(1), 534, sy(1), 'mute') + text(536, sy(0.5) + 4, 'L_d', 'ts');
  o += arrow(60, 46, 140, 46, 'ink-b') + text(148, 50, '传播方向：coast 在右手边（北半球）', 'ts');
  o += text(280, 274, '等值线是 η，振幅离岸按 e^(−y/L_d) 衰减；u 与 η 同号，v = 0', 'ts', 'middle');
  return svgA(560, 282, o, '动图：北半球沿岸的 Kelvin wave，从上往下看。一个 surface 抬高的 bump 贴着 coast 往前走，coast 在传播方向的右手边，振幅离岸按 deformation radius 指数衰减，水只沿岸方向运动');
}

// ---------- 第 9 站：Rossby wave 的机制 ----------
function rossbyA() {
  const T = 8, M = 48, kt = [];
  for (let i = 0; i <= M; i++) kt.push(i / M);
  const lamPx = 220, X0 = 30, X1 = 530, yc = 150, A = 40;
  let g = '';
  const pts = [];
  for (let x = X0 - lamPx; x <= X1 + lamPx; x += 4) pts.push([x, yc - A * Math.sin((2 * Math.PI * (x - X0)) / lamPx)]);
  g += path(d(pts), 'ln');
  for (let k = -1; k <= 3; k++) {
    const xc = X0 + lamPx * (k + 0.25), xt = X0 + lamPx * (k + 0.75);
    g += circle(xc, yc - A - 26, 11, 'paper') + line(xc - 6, yc - A - 26, xc + 6, yc - A - 26, 'ink-b');
    g += circle(xt, yc + A + 26, 11, 'paper') + line(xt - 6, yc + A + 26, xt + 6, yc + A + 26, 'ink-b') + line(xt, yc + A + 20, xt, yc + A + 32, 'ink-b');
    // 节点上的 v：ζ<0 的东边、ζ>0 的西边 → 节点 x = X0 + λ(k+0.5) 处向南；x = X0 + λk 处向北
    const xn = X0 + lamPx * (k + 0.5), xs2 = X0 + lamPx * k;
    g += arrow(xn, yc - 18, xn, yc + 18, 'ink-b', 7);
    g += arrow(xs2, yc + 18, xs2, yc - 18, 'ink-b', 7);
  }
  const shift = []; for (let i = 0; i <= M; i++) shift.push((-lamPx * i) / M);
  let o = `<clipPath id="mit12800-ross-clip"><rect x="${X0}" y="60" width="${X1 - X0}" height="190"/></clipPath>`;
  o += line(X0, yc, X1, yc, 'grid');
  o += `<g clip-path="url(#mit12800-ross-clip)"><g>${g}${atrans(shift, shift.map(() => 0), kt, T)}</g></g>`;
  o += rect(X0, 60, X1 - X0, 190, 'frame');
  o += text(X0, 44, '北', 'ts') + text(X0, 272, '南', 'ts');
  o += text(X1, 44, '一条原本沿 latitude 的 material line，俯视', 'ts', 'end');
  o += text(280, 272, '往北的 crest 得到 ζ < 0，往南的 trough 得到 ζ > 0；它们之间的 v 把整条线往西推', 'ts', 'middle');
  return svgA(560, 282, o, '动图：一条原本沿纬线的 material line 被推成正弦形。往北的部分 relative vorticity 变负、往南的部分变正，它们诱导的南北向 velocity 位于波形的四分之一波长处，使整个波形往西移动');
}

// ---------- 第 9 站：Rossby wave 的 dispersion relation ----------
function rdisp() {
  const w = (k) => -k / (k * k + 1); // ω/(βL_d)，l = 0
  const sx = lin(0, 4, 70, 400), sy = lin(-0.7, 0.05, 260, 50);
  let o = axes({ sx, sy, x0: 0, x1: 4, y0: -0.7, y1: 0.05, xt: [0, 1, 2, 3, 4], yt: [0, -0.2, -0.4], xl: 'k L_d', yl: 'ω / (βL_d)', grid: true, xAt: 0 });
  o += path(curve(w, 0, 4, sx, sy), 'ln');
  for (const [k, lab, dy] of [[0.5, 'long wave k L_d = 0.5', -10], [2.5, 'short wave k L_d = 2.5', 26]]) {
    const y = w(k), s = (k * k - 1) / (k * k + 1) ** 2;
    o += line(sx(0), sy(0), sx(k), sy(y), 'dash');
    const hw = k < 1 ? 0.3 : 0.6; o += line(sx(k - hw), sy(y - hw * s), sx(k + hw), sy(y + hw * s), 'ink-b');
    o += circle(sx(k), sy(y), 4, 'ink-f');
    o += text(sx(k) + 8, sy(y) + dy, lab, 'ts');
  }
  o += circle(sx(1), sy(-0.5), 4, 'paper') + text(sx(1) + 10, sy(-0.5) + 22, '最低点：c_gx = 0', 'ts', 'start');
  const X = 418;
  o += text(X, 70, '虚线 slope = ω/k：', 'tb') + text(X, 88, 'phase speed，', 'ts') + text(X, 104, '处处 < 0（往西）', 'ts');
  o += text(X, 140, '实线 slope = ∂ω/∂k：', 'tb') + text(X, 158, 'group velocity，', 'ts') + text(X, 174, 'long wave 往西，', 'ts') + text(X, 190, 'short wave 往东', 'ts');
  return svg(560, 272, o, 'Rossby wave 的 dispersion relation，l 等于 0：frequency 处处为负，phase 往西；在 k 乘 L_d 等于 1 处最低，左边 long wave 的 group velocity 往西，右边 short wave 的往东');
}


// ---------- 第 2 站：半球形容器从底部小孔漏水（Problem Set 5 第 3 题） ----------
function hemi() {
  const Rv = 0.5, hh = 0.3, cx = 200, top = 50, S = 300; // px per m
  let o = '';
  const bowl = []; for (let k = 0; k <= 80; k++) { const a = Math.PI * (k / 80); bowl.push([cx - S * Rv * Math.cos(a), top + S * Rv * Math.sin(a)]); }
  const yb = top + S * Rv, yw = yb - S * hh, rw = Math.sqrt(2 * Rv * hh - hh * hh);
  const water = [[cx - S * rw, yw]]; for (let k = 0; k <= 80; k++) { const a = Math.PI * (k / 80); const x = cx - S * Rv * Math.cos(a), y = top + S * Rv * Math.sin(a); if (y >= yw) water.push([x, y]); } water.push([cx + S * rw, yw]);
  o += path(d(water) + 'Z', 'wash');
  o += path(d(bowl), 'ink-b');
  o += line(cx - S * rw, yw, cx + S * rw, yw, 'ln');
  o += line(cx, yw, cx + S * rw, yw, 'ln') + text(cx + (S * rw) / 2, yw - 8, 'r = √(2Rh − h²)', 'tl', 'middle');
  o += line(cx, top, cx - S * Rv * 0.7071, top + S * Rv * 0.7071, 'mute') + text(cx - 60, top + 48, 'R', 'ts');
  o += line(cx + S * Rv + 16, yw, cx + S * Rv + 16, yb, 'mute') + line(cx + S * Rv + 11, yw, cx + S * Rv + 21, yw, 'mute') + line(cx + S * Rv + 11, yb, cx + S * Rv + 21, yb, 'mute') + text(cx + S * Rv + 26, (yw + yb) / 2 + 4, 'h', 'tb');
  o += rect(cx - 5, yb - 2, 10, 8, 'paper');
  o += arrow(cx, yb + 8, cx, yb + 40, 'ln') + text(cx + 10, yb + 32, 'u = √(2gh)，孔面积 A', 'ts');
  o += text(cx, top - 14, '截面积随 h 变：A_s(h) = π(2Rh − h²)', 'ts', 'middle');
  o += text(400, 70, 'Continuity：', 'tb') + text(400, 90, 'A_s(h) dh/dt = −A√(2gh)', 't');
  o += text(400, 226, 'R = 0.5 m，A = 1 cm²', 'ts') + text(400, 246, '从满到空：19.5 min', 'tl');
  return svg(560, 260, o, '半径 R 的半球形容器，水深 h 时水面半径是根号 2Rh 减 h 平方，底部面积 A 的小孔以根号 2gh 的速度出水');
}

// ---------- 第 4 站：sea breeze 的 circulation ----------
function breeze() {
  const X0 = 40, X1 = 520, ys = 230, yt = 70;
  let o = rect(X0, ys, 240, 22, 'wash-strong') + rect(280, ys, 240, 22, 'solid2');
  o += text(160, ys + 16, 'sea：T₁（冷）', 'tw', 'middle') + text(400, ys + 16, 'land：T₂ = T₁ + 10 K', 'tw', 'middle');
  // isobars：上面那条在 land 上方更高
  o += path(`M${X0} ${ys - 6} L${X1} ${ys - 6}`, 'mute') + text(X1, ys - 12, 'p₀ = 1000 hPa', 'ts', 'end');
  o += path(`M${X0} ${yt + 26} Q 280 ${yt + 14} ${X1} ${yt - 2}`, 'mute') + text(X1, yt - 8, 'p₁ = 900 hPa', 'ts', 'end');
  // loop
  const L = 120, R = 440, B = ys - 20, Tp = yt + 34;
  o += path(`M${L} ${B} L${R} ${B} L${R} ${Tp - 8} L${L} ${Tp + 8} Z`, 'ln');
  o += arrow(260, B, 300, B, 'ln', 8) + arrow(R, (B + Tp) / 2 + 20, R, (B + Tp) / 2 - 20, 'ln', 8);
  o += arrow(300, (Tp - 8 + Tp + 8) / 2, 260, (Tp - 8 + Tp + 8) / 2 + 1, 'ln', 8) + arrow(L, (B + Tp) / 2 - 20, L, (B + Tp) / 2 + 20, 'ln', 8);
  o += text(280, B - 10, '近地面吹向 land（sea breeze）', 'ts', 'middle');
  o += text(R - 8, (B + Tp) / 2 + 4, '上升', 'ts', 'end') + text(L + 8, (B + Tp) / 2 + 4, '下沉', 'ts');
  o += text(280, 30, 'dΓ/dt = R ln(p₀/p₁)(T₂ − T₁) = 302 m²/s²', 'tb', 'middle');
  o += line(L, ys + 34, R, ys + 34, 'mute') + text(280, ys + 50, 'L = 20 km', 'ts', 'middle');
  return svg(560, 290, o, 'Sea breeze：land 比 sea 暖 10 K，沿两条 isobar 和两条竖线围成的 loop 上 circulation 不断增加，方向是近地面吹向 land、在 land 上升、高处吹回 sea、在 sea 上下沉');
}

export default {
  'mit-12.800-spinup0': spinup0,
  'mit-12.800-adjust0': adjust0,
  'mit-12.800-west0': west0,
  'mit-12.800-lines': linesA,
  'mit-12.800-blob': blobA,
  'mit-12.800-svd': svdfig,
  'mit-12.800-rtt': rtt,
  'mit-12.800-couette': couette,
  'mit-12.800-hemi': hemi,
  'mit-12.800-breeze': breeze,
  'mit-12.800-buoy': buoyA,
  'mit-12.800-vortex': vortexA,
  'mit-12.800-pair': pairA,
  'mit-12.800-ring': ring,
  'mit-12.800-grad70': grad70,
  'mit-12.800-taylor': taylor,
  'mit-12.800-thermal': thermal,
  'mit-12.800-bl': blA,
  'mit-12.800-spindown': spindownA,
  'mit-12.800-column': columnA,
  'mit-12.800-adjust': adjustA,
  'mit-12.800-poincare': poincare,
  'mit-12.800-kelvin': kelvinA,
  'mit-12.800-rossby': rossbyA,
  'mit-12.800-rdisp': rdisp,
};
