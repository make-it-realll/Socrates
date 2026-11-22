import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes, anim, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;
// 一个圆按 (t, x, y) 的折线运动，vis 是 [t, on] 的开关表；时间单位秒，T 是总时长
function mover(pts, vis, T, r, cls) {
  const kt = pts.map((p) => p[0] / T);
  let s = `<circle cx="${f1(pts[0][1])}" cy="${f1(pts[0][2])}" r="${r}" class="${cls}">`;
  s += anim('cx', pts.map((p) => f1(p[1])), kt, T) + anim('cy', pts.map((p) => f1(p[2])), kt, T);
  if (vis) s += anim('opacity', vis.map((v) => (v[1] ? 1 : 0)), vis.map((v) => v[0] / T), T, true);
  return s + '</circle>';
}
// 一组 [开始, 结束] 时间窗里显示
const windows = (ws, T) => {
  const v = [[0, ws.length && ws[0][0] === 0 ? 1 : 0]];
  for (const [a, b] of ws) { if (a > 0) v.push([a, 1]); v.push([b, 0]); }
  return anim('opacity', v.map((x) => x[1]), v.map((x) => x[0] / T), T, true);
};
const showText = (x, y, s, cls, anchor, ws, T) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${windows(ws, T)}</text>`;

// ---------- 第 1 站：两条 slit 的 interference ----------
function slits() {
  const lam = 20, X0 = 110, XS = 370, Y1 = 80, Y2 = 140, T = 1.2;
  let o = `<defs><clipPath id="pc1101-slit-clip"><rect x="${X0}" y="4" width="${XS - X0}" height="212"/></clipPath><clipPath id="pc1101-in-clip"><rect x="14" y="4" width="${X0 - 14}" height="212"/></clipPath></defs>`;
  // 入射的 plane wave：竖线向右走
  let g = '';
  for (let k = 0; k < 6; k++) {
    const x0 = X0 - k * lam - lam;
    g += `<line x1="${x0}" y1="10" x2="${x0}" y2="210" class="mute">${anim('x1', [x0, x0 + lam], [0, 1], T)}${anim('x2', [x0, x0 + lam], [0, 1], T)}</line>`;
  }
  o += `<g clip-path="url(#pc1101-in-clip)">${g}</g>`;
  // 两个 slit 发出的 circular wave：crest 每过一个 period 向外推一个 λ
  g = '';
  for (const ys of [Y1, Y2]) for (let k = 0; k < 16; k++) {
    g += `<circle cx="${X0}" cy="${ys}" r="${k * lam}" class="ink" opacity="0.55">${anim('r', [k * lam, (k + 1) * lam], [0, 1], T)}</circle>`;
  }
  o += `<g clip-path="url(#pc1101-slit-clip)">${g}</g>`;
  // barrier
  o += rect(X0 - 4, 4, 8, Y1 - 6 - 4, 'solid2') + rect(X0 - 4, Y1 + 6, 8, Y2 - Y1 - 12, 'solid2') + rect(X0 - 4, Y2 + 6, 8, 216 - Y2 - 6, 'solid2');
  // screen 和 intensity
  o += line(XS, 6, XS, 214, 'ink-b');
  const L = XS - X0, Ic = (y) => { const dr = Math.hypot(L, y - Y2) - Math.hypot(L, y - Y1); return Math.cos(Math.PI * dr / lam) ** 2; };
  const pts = []; for (let y = 6; y <= 214; y += 1) pts.push([XS + 8 + 80 * Ic(y), y]);
  o += path(d(pts), 'ln') + line(XS + 8, 6, XS + 8, 214, 'axis');
  // m = 0、m = 1 的 bright fringe：path difference = mλ
  const yOf = (m) => { let lo = -200, hi = 110; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; const dr = Math.hypot(L, mid - Y2) - Math.hypot(L, mid - Y1); if (dr < m * lam) hi = mid; else lo = mid; } return (lo + hi) / 2; };
  const y0 = yOf(0), y1 = yOf(1);
  o += line(X0, Y1, XS, y1, 'ln-dash') + line(X0, Y2, XS, y1, 'ln-dash');
  o += text(XS + 96, y0 + 4, 'm = 0', 'ts', 'start') + text(XS + 96, y1 + 4, 'm = 1', 'tl', 'start');
  o += text(XS + 96, y1 + 20, 'r₂ − r₁ = λ', 'ts', 'start');
  o += text(X0 - 10, (Y1 + Y2) / 2 + 4, 'd', 'tb', 'end') + text(X0 + 14, 230, '← L →（到 screen）', 'ts', 'start');
  o += text(XS + 8, 230, 'intensity', 'ts', 'start') + text(60, 230, 'plane wave', 'ts', 'middle');
  o += text(20, 252, '细线是 crest。两组 crest 相交处振动叠加（bright），crest 碰上 trough 处抵消（dark）。', 'ts', 'start');
  return svgA(560, 258, o, '动图：plane wave 从左边射到有两条 slit 的 barrier 上，每条 slit 发出 circular wave，在 screen 上叠加出明暗相间的 fringe；m 等于 1 的 bright fringe 处两条 path 相差一个 wavelength');
}

// ---------- 第 2 站：star 的 wobble、spectrum shift 和 radial velocity curve ----------
function rvA() {
  const T = 6, N = 48, C = [110, 118], Rp = 82, Rs = 15, K = 1;
  const kt = [], ph = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); ph.push(2 * Math.PI * i / N); }
  // 屏幕上 y 向下；observer 在下方很远处。planet 逆时针转，star 在正对面
  const pl = ph.map((p) => [C[0] + Rp * Math.cos(p), C[1] - Rp * Math.sin(p)]);
  const st = ph.map((p) => [C[0] - Rs * Math.cos(p), C[1] + Rs * Math.sin(p)]);
  // star 的 velocity（math 坐标，y 向上）= Rs ω (sin p, cos p)；远离 observer = 向上 = +y
  const vr = ph.map((p) => K * Math.cos(p));
  let o = text(C[0], 18, '俯视：star 和 planet 绕 center of mass', 'tb', 'middle');
  o += circle(C[0], C[1], Rp, 'grid') + circle(C[0], C[1], Rs, 'mute') + circle(C[0], C[1], 2.5, 'ink-f');
  o += text(C[0], C[1] + 44, 'COM（中间的小黑点）', 'ts', 'middle');
  o += acircle(st.map((p) => p[0]), st.map((p) => p[1]), kt, T, 10, 'wash-strong');
  o += acircle(pl.map((p) => p[0]), pl.map((p) => p[1]), kt, T, 5, 'ink-f');
  o += text(C[0] + Rp + 8, C[1] + 4, 'planet', 'ts', 'start');
  o += arrow(C[0], 216, C[0], 246, 'ink') + text(C[0], 262, '往下很远处是 observer（Earth）', 'ts', 'middle');
  // spectrum
  const X0 = 256, X1 = 548, sy0 = 36, sy1 = 70, sh = 9;
  o += text(X0, 22, 'star 的 spectrum（shift 极度放大）', 'tb', 'start');
  o += rect(X0, sy0, X1 - X0, sy1 - sy0, 'wash');
  for (const lx of [300, 352, 430, 500]) {
    o += line(lx, sy0, lx, sy1, 'grid');
    o += `<line x1="${lx}" y1="${sy0}" x2="${lx}" y2="${sy1}" class="ink-b">${anim('x1', vr.map((v) => f1(lx + sh * v)), kt, T)}${anim('x2', vr.map((v) => f1(lx + sh * v)), kt, T)}</line>`;
  }
  o += text(X0, 86, '← shorter λ（blueshift）', 'ts', 'start') + text(X1, 86, 'longer λ（redshift）→', 'ts', 'end');
  // radial velocity curve
  const sx = lin(0, 1, X0 + 20, X1), sy = lin(-1.25, 1.25, 236, 120);
  o += line(sx(0), sy(0), sx(1), sy(0), 'axis') + line(sx(0), sy(-1.25), sx(0), sy(1.25), 'axis');
  o += text(sx(0) - 4, sy(1) + 4, '+K', 'ts', 'end') + text(sx(0) - 4, sy(-1) + 4, '−K', 'ts', 'end') + text(sx(0) - 4, sy(0) + 4, '0', 'ts', 'end');
  o += line(sx(0) - 2, sy(1), sx(1), sy(1), 'grid') + line(sx(0) - 2, sy(-1), sx(1), sy(-1), 'grid');
  o += path(curve((t) => K * Math.cos(2 * Math.PI * t), 0, 1, sx, sy), 'ln');
  o += acircle(kt.map(sx), vr.map(sy), kt, T, 5, 'ln-f');
  o += text(sx(1), 112, 'v' + sub('r') + '（> 0 表示远离 observer）', 'ts', 'end');
  o += text(sx(1), 254, '一个 period P →', 'ts', 'end');
  return svgA(560, 268, o, '动图：俯视 star 和 planet 绕共同的 center of mass 转动；star 远离下方 observer 时 spectrum 里的 absorption line 向 red 一侧移动，靠近时向 blue 一侧移动；右下方是 radial velocity 随时间的 sine curve');
}

// 两个 disk 的重叠面积
function overlap(dd, R1, r) {
  if (dd >= R1 + r) return 0;
  if (dd <= R1 - r) return Math.PI * r * r;
  const a = Math.acos((dd * dd + r * r - R1 * R1) / (2 * dd * r)), b = Math.acos((dd * dd + R1 * R1 - r * r) / (2 * dd * R1));
  return r * r * a + R1 * R1 * b - 0.5 * Math.sqrt((-dd + r + R1) * (dd + r - R1) * (dd - r + R1) * (dd + r + R1));
}

function transitA() {
  const T = 6, N = 90, C = [280, 82], Rst = 62, k = 0.12, r = k * Rst, b = 0.3 * Rst;
  const xa = C[0] - Rst - r - 40, xb = C[0] + Rst + r + 40;
  const kt = [], xs = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); xs.push(xa + (xb - xa) * i / N); }
  const flux = (x) => 1 - overlap(Math.hypot(x - C[0], b), Rst, r) / (Math.PI * Rst * Rst);
  let o = circle(C[0], C[1], Rst, 'wash') + circle(C[0], C[1], Rst, 'ink');
  o += line(xa, C[1] + b, xb, C[1] + b, 'grid');
  o += acircle(xs, xs.map(() => C[1] + b), kt, T, f1(r), 'ink-f');
  o += text(C[0] - Rst - 12, C[1] - 40, 'star（R' + sub('*') + '）', 'ts', 'end');
  o += text(xb + 6, C[1] + b + 4, 'planet 的路径', 'ts', 'start');
  // light curve：横轴与 planet 的位置对齐
  const depth = k * k, sy = lin(1 - depth, 1, 268, 186);
  o += line(xa, sy(1), xb, sy(1), 'grid') + line(xa, sy(1 - depth), xb, sy(1 - depth), 'grid');
  const cp = []; for (let x = xa; x <= xb; x += 1) cp.push([x, sy(flux(x))]);
  o += path(d(cp), 'ln');
  o += acircle(xs, xs.map((x) => sy(flux(x))), kt, T, 4.5, 'ln-f');
  o += `<line x1="${f1(xa)}" y1="${C[1] + b}" x2="${f1(xa)}" y2="${f1(sy(flux(xa)))}" class="dash" opacity="0.5">${anim('x1', xs.map(f1), kt, T)}${anim('x2', xs.map(f1), kt, T)}${anim('y2', xs.map((x) => f1(sy(flux(x)))), kt, T)}</line>`;
  o += text(xa - 6, sy(1) + 4, '100%', 'ts', 'end') + text(xa - 6, sy(1 - depth) + 4, '98.56%', 'ts', 'end');
  o += text(C[0], 292, '亮度下降 (R' + sub('p') + '/R' + sub('*') + ')² = 0.12² = 1.44%（纵轴放大）', 'ts', 'middle');
  o += text(xb + 4, sy(1) + 4, 'flux', 'ts', 'start');
  return svgA(560, 300, o, '动图：planet 从 star 的 disk 前面横穿过去，下方的 light curve 与 planet 的位置对齐，亮度在 planet 完全进入 disk 后下降 1.44 percent');
}

// ---------- 第 3 站：Michelson interferometer ----------
function mm() {
  const BS = [180, 170], M1 = [330, 170], M2 = [180, 40];
  let o = '';
  o += arrow(30, 170, BS[0] - 8, 170, 'ln') + text(30, 160, 'light source', 'ts', 'start');
  o += line(BS[0] - 14, BS[1] + 14, BS[0] + 14, BS[1] - 14, 'ink-b') + text(BS[0] - 18, BS[1] + 30, 'beam splitter', 'ts', 'end');
  o += line(BS[0] + 8, 166, M1[0] - 4, 166, 'ln') + line(M1[0] - 4, 174, BS[0] + 8, 174, 'ln-dash');
  o += rect(M1[0], 150, 7, 40, 'solid2') + text(M1[0] + 12, 174, 'M₁', 'tb', 'start');
  o += line(176, BS[1] - 8, 176, M2[1] + 6, 'ln') + line(184, M2[1] + 6, 184, BS[1] - 8, 'ln-dash');
  o += rect(160, M2[1] - 2, 40, 7, 'solid2') + text(206, M2[1] + 6, 'M₂', 'tb', 'start');
  o += arrow(180, BS[1] + 8, 180, 232, 'ln') + rect(166, 234, 28, 14, 'paper', 3) + text(200, 246, 'detector：看 fringe', 'ts', 'start');
  o += text(255, 160, 'arm ∥，长 L', 'ts', 'middle') + text(170, 110, 'arm ⊥，长 L', 'ts', 'end');
  o += text(290, 88, '假设的 aether wind', 'ts', 'middle') + text(290, 104, 'Earth 相对 aether 的速度 v', 'ts', 'middle') + arrow(250, 118, 330, 118, 'ink');
  // inset：aether frame 里看 ⊥ arm
  const X = 410, Y = 196, h = 120, s = 28;
  o += text(X + 2 * s, 28, 'aether frame 里看 arm ⊥', 'tb', 'middle');
  o += line(X, Y, X + 2 * s * 2, Y, 'grid');
  o += path(d([[X, Y], [X + 2 * s, Y - h], [X + 4 * s, Y]]), 'ln');
  o += line(X + 2 * s - 18, Y - h, X + 2 * s + 18, Y - h, 'ink-b');
  o += circle(X, Y, 3, 'ink-f') + circle(X + 4 * s, Y, 3, 'ink-f');
  o += text(X - 6, Y + 18, 'BS 出发', 'ts', 'start') + text(X + 4 * s + 18, Y + 18, 'BS 回到这里', 'ts', 'end');
  o += text(X + 2 * s, Y + 38, '中途 BS 和 mirror 右移了 vt', 'ts', 'middle');
  o += text(X + s - 8, Y - h / 2, 'c t⊥/2', 'ts', 'end') + text(X + 2 * s + 4, Y - h - 8, 'M₂', 'ts', 'middle');
  return svg(560, 255, o, 'Michelson interferometer：light 被 beam splitter 分成两束，一束沿 Earth 运动方向的 arm 往返，一束沿 perpendicular 的 arm 往返，回来后在 detector 处 interference；右边是在 aether frame 里看 perpendicular arm，light 走的是斜线');
}

// ---------- 第 3 站：light clock ----------
function clockA() {
  const L = 60, Yb = 150, Yt = Yb - L, dt0 = 1.2, nT = 5, hold = 1.2, Ttot = nT * dt0 + hold;
  const c = 2 * L / dt0, v = 0.6 * c, X0 = 140, Xr = 60;
  const N = 200, kt = [], ts = [];
  for (let i = 0; i <= N; i++) { const t = nT * dt0 * i / N; ts.push(t); kt.push(t / Ttot); }
  kt.push(1); ts.push(nT * dt0);
  const tri = (t, per) => { const u = (t / per) % 1; return u < 0.5 ? 2 * u : 2 - 2 * u; }; // 0 → 1 → 0
  let o = '';
  // 静止的钟
  o += text(Xr, 30, 'rest frame 里的钟', 'tb', 'middle');
  o += rect(Xr - 22, Yt - 6, 44, 6, 'solid2') + rect(Xr - 22, Yb, 44, 6, 'solid2');
  o += line(Xr - 18, Yt, Xr - 18, Yb, 'grid') + line(Xr + 18, Yt, Xr + 18, Yb, 'grid');
  const ry = ts.map((t) => Yb - L * tri(t, dt0));
  o += acircle(ts.map(() => Xr), ry, kt, Ttot, 4.5, 'ln-f');
  o += text(Xr - 30, (Yt + Yb) / 2 + 4, 'L', 'tb', 'end');
  // 运动的钟：先画整条 zigzag
  const per = dt0 / 0.8, zz = [];
  for (let k = 0; k <= 8; k++) zz.push([X0 + v * k * per / 2, k % 2 ? Yt : Yb]);
  o += path(d(zz), 'dash');
  o += text(X0 + v * nT * dt0 / 2, 30, '以 0.6c 向右运动的同一种钟', 'tb', 'middle');
  const mx = ts.map((t) => X0 + v * t);
  o += apath(mx.map((x) => d([[x - 22, Yt - 6], [x + 22, Yt - 6], [x + 22, Yt], [x - 22, Yt]]) + 'Z'), kt, Ttot, 'solid2');
  o += apath(mx.map((x) => d([[x - 22, Yb], [x + 22, Yb], [x + 22, Yb + 6], [x - 22, Yb + 6]]) + 'Z'), kt, Ttot, 'solid2');
  o += acircle(mx, ts.map((t) => Yb - L * tri(t, per)), kt, Ttot, 4.5, 'ln-f');
  o += arrow(X0 + 40, Yb + 22, X0 + 90, Yb + 22, 'ink') + text(X0 + 96, Yb + 26, 'v = 0.6c', 'ts', 'start');
  // 第一个三角形的边
  const A = zz[0], B = zz[1];
  o += line(B[0], Yt, B[0], Yb, 'mute') + text(B[0] + 5, Yb - 22, 'L', 'ts', 'start');
  o += text((A[0] + B[0]) / 2 - 20, (Yt + Yb) / 2 - 8, 'cΔt/2', 'ts', 'end');
  o += text((A[0] + B[0]) / 2, Yb + 40, 'vΔt/2', 'ts', 'middle') + line(A[0], Yb + 30, B[0], Yb + 30, 'mute');
  // tick 计数
  for (let n = 0; n <= nT; n++) {
    const a = n * dt0, b = n < nT ? (n + 1) * dt0 : Ttot;
    o += showText(Xr, 196, 'tick：' + n, 'tl', 'middle', [[a, b]], Ttot);
  }
  for (let n = 0; n <= 4; n++) {
    const a = n * per, b = n < 4 ? (n + 1) * per : Ttot;
    o += showText(X0 + v * nT * dt0 / 2 + 60, 214, '运动的钟 tick：' + n, 'tl', 'middle', [[a, b]], Ttot);
  }
  o += text(280, 246, '同一段时间里，静止的钟走 5 tick，运动的钟走 4 tick：每 tick 长 γ = 1.25 倍。', 'ts', 'middle');
  return svgA(560, 256, o, '动图：左边静止的 light clock 里 photon 上下往返；右边同样的钟以 0.6c 向右运动，photon 沿 zigzag 斜线走，静止的钟走 5 个 tick 时运动的钟只走 4 个');
}

// ---------- 第 4 站：simultaneity ----------
function simul() {
  const sx = lin(-1.3, 2.3, 40, 400), sy = lin(0, 2, 230, 30), be = 0.5, g = 1 / Math.sqrt(1 - be * be), Lh = 1 / g;
  let o = axes({ sx, sy, x0: -1.3, x1: 2.3, y0: 0, y1: 2, xt: [-1, 0, 1, 2], yt: [1, 2], xl: 'x（ground frame）', grid: false, yAt: 0 });
  o += text(sx(0) + 8, sy(2) - 4, 'ct', 'ts', 'start');
  const wl = (x0, cls) => line(sx(x0), sy(0), sx(x0 + be * 2), sy(2), cls);
  o += wl(-Lh, 'ink-b') + wl(Lh, 'ink-b') + wl(0, 'mute');
  const tA = Lh / (1 + be), tB = Lh / (1 - be);
  const A = [-tA, tA], B = [tB, tB];
  o += line(sx(0), sy(0), sx(A[0]), sy(A[1]), 'ln') + line(sx(0), sy(0), sx(B[0]), sy(B[1]), 'ln');
  // 过 A、B 的 line：斜率 β，平行于 x′ axis
  o += line(sx(A[0] - 0.25), sy(A[1] - 0.125), sx(B[0] + 0.3), sy(B[1] + 0.15), 'ln-dash');
  o += circle(sx(A[0]), sy(A[1]), 5, 'ln-f') + circle(sx(B[0]), sy(B[1]), 5, 'ln-f');
  o += text(sx(A[0]) - 10, sy(A[1]) + 4, 'A', 'tb', 'end') + text(sx(B[0]) + 10, sy(B[1]) + 14, 'B', 'tb', 'start');
  o += text(sx(-Lh + 0.7) - 8, sy(1.4), 'rear', 'ts', 'end') + text(sx(Lh + 0.3) + 8, sy(0.6), 'front', 'ts', 'start');
  // train car，画在 t = 0 的位置
  const yT = 268;
  o += rect(sx(-Lh), yT, sx(Lh) - sx(-Lh), 26, 'paper', 4) + circle(sx(-Lh) + 18, yT + 30, 5, 'paper') + circle(sx(Lh) - 18, yT + 30, 5, 'paper');
  o += circle(sx(0), yT + 13, 5, 'ln-f') + text(sx(0), yT - 6, 'lamp', 'ts', 'middle');
  o += arrow(sx(0) - 8, yT + 13, sx(-Lh) + 6, yT + 13, 'ln', 6) + arrow(sx(0) + 8, yT + 13, sx(Lh) - 6, yT + 13, 'ln', 6);
  o += arrow(sx(Lh) + 16, yT + 13, sx(Lh) + 60, yT + 13, 'ink') + text(sx(Lh) + 66, yT + 17, 'v = 0.5c', 'ts', 'start');
  const X = 420;
  o += text(X, 40, 'train frame：两束 light', 'ts', 'start') + text(X, 56, '同时到两端', 'ts', 'start');
  o += text(X, 86, 'ground frame：', 'ts', 'start') + text(X, 102, 'A：light 到 rear，ct = ' + tA.toFixed(3), 'ts', 'start') + text(X, 118, 'B：light 到 front，ct = ' + tB.toFixed(3), 'ts', 'start');
  o += text(X, 138, 'Δ(ct) = ' + (tB - tA).toFixed(3) + ' = γβL′', 'tl', 'start');
  o += text(X, 168, '虚线过 A、B，slope = β，', 'ts', 'start') + text(X, 184, '平行于 x′ axis，', 'ts', 'start') + text(X, 200, '即 train frame 里的同一时刻', 'ts', 'start');
  return svg(560, 306, o, 'Ground frame 的 spacetime diagram：车厢以 0.5c 运动，中间的 lamp 发出 light，到达车尾的 event A 比到达车头的 event B 早；连接 A 和 B 的虚线平行于车厢的 x prime axis');
}

// ---------- 第 4 站：spacetime diagram 里的 moving axes ----------
function axesA() {
  const sx = lin(-0.6, 6.4, 40, 292), sy = lin(-0.3, 6.4, 260, 18);
  const up = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  const dn = up.slice().reverse();
  const bs = [0.6, 0.6, ...dn.slice(1), ...up.slice(1), 0.6];
  const step = 0.55, T = step * (bs.length - 1);
  const kt = bs.map((_, i) => i * step / T);
  const E = [3, 5];
  let o = '';
  o += line(sx(0), sy(0), sx(6.2), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(6.2), 'axis');
  o += text(sx(6.2), sy(0) + 16, 'x', 'ts', 'end') + text(sx(0) - 6, sy(6.2) + 4, 'ct', 'ts', 'end');
  for (let k = 1; k <= 6; k++) o += line(sx(k), sy(0), sx(k), sy(0) + 4, 'axis') + line(sx(0) - 4, sy(k), sx(0), sy(k), 'axis');
  o += text(sx(1), sy(0) + 16, '1', 'ts', 'middle') + text(sx(0) - 7, sy(1) + 4, '1', 'ts', 'end');
  o += line(sx(0), sy(0), sx(6.2), sy(6.2), 'dash') + text(sx(6.2) - 4, sy(6.2) - 8, 'light：x = ct', 'ts', 'end');
  // calibration hyperbola
  o += path(curve((x) => Math.sqrt(1 + x * x), 0, 1.6, sx, sy), 'grid') + path(curve((x) => Math.sqrt(x * x - 1), 1, 1.8, sx, sy), 'grid');
  const ctA = bs.map((b) => d([[sx(0), sy(0)], [sx(6.2 * b), sy(6.2)]]));
  const xA = bs.map((b) => d([[sx(0), sy(0)], [sx(6.2), sy(6.2 * b)]]));
  o += apath(ctA, kt, T, 'ln') + apath(xA, kt, T, 'ln');
  const g = (b) => 1 / Math.sqrt(1 - b * b);
  o += acircle(bs.map((b) => sx(g(b) * b)), bs.map((b) => sy(g(b))), kt, T, 3.5, 'ln-f');
  o += acircle(bs.map((b) => sx(g(b))), bs.map((b) => sy(g(b) * b)), kt, T, 3.5, 'ln-f');
  // 从 E 平行于两条 primed axis 画回去
  const xp = (b) => g(b) * (E[0] - b * E[1]), tp = (b) => g(b) * (E[1] - b * E[0]);
  o += apath(bs.map((b) => d([[sx(E[0]), sy(E[1])], [sx(g(b) * b * tp(b)), sy(g(b) * tp(b))]])), kt, T, 'dash');
  o += apath(bs.map((b) => d([[sx(E[0]), sy(E[1])], [sx(g(b) * xp(b)), sy(g(b) * b * xp(b))]])), kt, T, 'dash');
  o += circle(sx(E[0]), sy(E[1]), 5, 'ink-f') + text(sx(E[0]) - 9, sy(E[1]) - 10, 'E：x = 3，ct = 5', 'tb', 'end');
  o += `<text x="${f1(sx(6.2 * bs[0]) + 6)}" y="${f1(sy(6.2) + 12)}" class="tl" text-anchor="start">ct′${anim('x', bs.map((b) => f1(sx(6.2 * b) + 6)), kt, T)}</text>`;
  o += `<text x="${f1(sx(6.2) - 2)}" y="${f1(sy(6.2 * bs[0]) - 6)}" class="tl" text-anchor="end">x′${anim('y', bs.map((b) => f1(sy(6.2 * b) - 6)), kt, T)}</text>`;
  // 读数：每一帧一行
  const X = 330;
  o += text(X, 34, '车厢 frame 的 axes 随 β 变化', 'tb', 'start');
  bs.forEach((b, i) => {
    const a = i * step, e = i < bs.length - 1 ? (i + 1) * step : T;
    const fmt = (v) => (v < -1e-9 ? '−' : '') + Math.abs(v).toFixed(3);
    o += showText(X, 62, 'β = ' + b.toFixed(1) + '，γ = ' + g(b).toFixed(3), 'tl', 'start', [[a, e]], T);
    o += showText(X, 84, 'x′ = ' + fmt(xp(b)) + '，ct′ = ' + fmt(tp(b)), 't', 'start', [[a, e]], T);
    o += showText(X, 106, 'ct′² − x′² = ' + (tp(b) ** 2 - xp(b) ** 2).toFixed(3), 't', 'start', [[a, e]], T);
  });
  o += text(X, 140, 'ct′ axis 是 x = βct；x′ axis 是 ct = βx。', 'ts', 'start');
  o += text(X, 158, '两条 axis 对称地向 light line 合拢。', 'ts', 'start');
  o += text(X, 182, '实心小点：ct′ = 1 与 x′ = 1，', 'ts', 'start') + text(X, 200, '落在灰色 hyperbola 上。', 'ts', 'start');
  o += text(X, 224, 'β = 0.6 时 E 正好在 ct′ axis 上：', 'ts', 'start') + text(X, 242, '车厢里看，E 就发生在原点处。', 'ts', 'start');
  return svgA(560, 270, o, '动图：spacetime diagram 中车厢 frame 的 ct prime axis 和 x prime axis 随 beta 从 0 增大到 0.6 向 light line 合拢，再回到 0；event E 在每个 frame 的坐标不同，但 ct prime 平方减 x prime 平方始终等于 16');
}

// ---------- 第 5 站：equivalence principle 推 gravitational redshift ----------
function elevator() {
  let o = '';
  const ship = (x, y, tlab, vlab) => {
    let q = rect(x, y, 90, 150, 'paper', 6) + poly([[x, y], [x + 45, y - 34], [x + 90, y]], 'paper');
    q += poly([[x + 20, y + 150], [x + 45, y + 180], [x + 70, y + 150]], 'wash-strong');
    q += text(x + 45, y + 214, tlab, 'tb', 'middle') + text(x + 45, y + 232, vlab, 'ts', 'middle');
    return q;
  };
  o += ship(60, 66, 't = 0：发出', 'rocket 速度 0');
  o += ship(300, 36, 't = h/c：收到', 'rocket 速度 v = gh/c');
  o += rect(85, 202, 40, 10, 'solid') + text(158, 211, 'emitter', 'ts', 'start') + rect(85, 76, 40, 8, 'solid2') + text(158, 84, 'receiver', 'ts', 'start');
  o += arrow(105, 196, 105, 146, 'ln') + text(105, 136, 'light 出发', 'ts', 'middle');
  o += rect(325, 172, 40, 10, 'solid') + rect(325, 46, 40, 8, 'solid2');
  o += arrow(345, 136, 345, 58, 'ln') + text(372, 106, '刚好到达', 'ts', 'start');
  o += line(46, 80, 46, 206, 'mute') + text(40, 146, 'h', 'tb', 'end');
  o += arrow(210, 176, 210, 116, 'ink') + text(220, 150, 'acceleration g', 'ts', 'start');
  o += text(470, 176, '收到时 receiver', 'ts', 'middle') + text(470, 192, '正以 gh/c 远离', 'ts', 'middle') + text(470, 208, '发出时的 emitter', 'ts', 'middle');
  o += text(470, 232, 'Δf/f = −gh/c²', 'tl', 'middle');
  return svg(560, 306, o, '两张快照：t 等于 0 时 rocket 静止、底部 emitter 向上发出 light；t 等于 h 除以 c 时 light 到达顶部 receiver，rocket 已加速到 gh 除以 c，receiver 收到的 frequency 降低');
}

// ---------- 第 5 站：S2 绕 Sgr A* ----------
// GRAVITY 2018 Table A.1：a = 125.40 mas，e = 0.88466，P = 16.0518 yr，R0 = 8122 pc
function s2A() {
  const R0 = 8122, aAs = 0.1254, e = 0.8847, P = 16.05;
  const a = aAs * R0, b = a * Math.sqrt(1 - e * e), s = 0.215;
  const F = [470, 130], X = (x) => F[0] + x * s, Y = (y) => F[1] - y * s;
  const pos = (E) => [a * (Math.cos(E) - e), b * Math.sin(E)];
  const N = 240, kt = [], xs = [], ys = [], vs = [];
  const GM = 4 * Math.PI ** 2 * (a ** 3 / P ** 2); // AU³/yr²
  const kms = 1.496e11 / 3.156e7 / 1e3; // 1 AU/yr = 4.74 km/s
  for (let i = 0; i <= N; i++) {
    const E = 2 * Math.PI * i / N, M = E - e * Math.sin(E);
    kt.push(M / (2 * Math.PI));
    const [x, y] = pos(E); xs.push(X(x)); ys.push(Y(y));
    const r = Math.hypot(x, y), v = Math.sqrt(GM * (2 / r - 1 / a));
    const tx = -a * Math.sin(E), ty = b * Math.cos(E), tn = Math.hypot(tx, ty);
    vs.push([tx / tn * v, ty / tn * v]);
  }
  const T = 9;
  const ell = []; for (let k = 0; k <= 200; k++) { const [x, y] = pos(2 * Math.PI * k / 200); ell.push([X(x), Y(y)]); }
  let o = path(d(ell) + 'Z', 'mute');
  // 每隔 1 年一个点：解 Kepler equation
  const solveE = (M) => { let E = M; for (let k = 0; k < 50; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; };
  for (let yr = 0; yr < 16; yr++) { const [x, y] = pos(solveE(2 * Math.PI * yr / P)); o += circle(X(x), Y(y), 2.2, 'mute-f'); }
  o += circle(F[0], F[1], 4, 'ink-f') + text(F[0] - 8, F[1] + 18, 'Sgr A*', 'tb', 'end');
  // 速度 arrow（长度 ∝ speed）
  const k = 0.0068;
  o += apath(xs.map((x, i) => d([[x, ys[i]], [x + vs[i][0] * k, ys[i] - vs[i][1] * k]])), kt, T, 'ink');
  o += acircle(xs, ys, kt, T, 5.5, 'ln-f');
  const rp = a * (1 - e), ra = a * (1 + e);
  const vp = Math.sqrt(GM / a * (1 + e) / (1 - e)) * kms, va = vp * rp / ra;
  const Rs = 2.95 * GM / (4 * Math.PI ** 2) / 1.496e8; // AU
  const r10 = (v) => (Math.round(v / 10) * 10).toLocaleString('en-US');
  const [px] = pos(0), [ax] = pos(Math.PI);
  o += text(X(px) + 8, F[1] - 26, 'pericenter', 'ts', 'start') + text(X(px) + 8, F[1] - 10, Math.round(rp) + ' AU', 'ts', 'start');
  o += text(X(px) - 8, F[1] + 40, r10(vp) + ' km/s', 'tl', 'end');
  o += text(X(ax) + 16, F[1] - 8, 'apocenter', 'ts', 'start') + text(X(ax) + 16, F[1] + 8, r10(ra) + ' AU', 'ts', 'start') + text(X(ax) + 16, F[1] + 24, Math.round(va) + ' km/s', 'tl', 'start');
  o += line(60, 262, 60 + 200 * s, 262, 'ink-b') + text(60 + 100 * s, 278, '200 AU', 'ts', 'middle');
  o += text(300, 262, '灰点：每隔 1 年的位置（period ' + P.toFixed(2) + ' 年）', 'ts', 'middle');
  o += text(300, 278, 'Sgr A* 的 R' + sub('s') + ' = ' + Rs.toFixed(3) + ' AU，在这个比例下只有 ' + (Rs * s).toFixed(2) + ' px', 'ts', 'middle');
  o += text(300, 20, '在 orbit 自己的 plane 里画；动画按真实时间推进（Kepler equation）', 'ts', 'middle');
  return svgA(560, 286, o, '动图：S2 star 沿 eccentricity 0.885 的 ellipse 绕 Sgr A star 转一圈，16 年里大部分时间在远处缓慢移动，在 pericenter 附近几个月内以每秒约 7640 公里急速掠过');
}

// ---------- 第 6 站：photoelectric effect ----------
function photo() {
  let o = '';
  // 装置
  o += rect(20, 40, 200, 110, 'paper', 40) + text(120, 58, 'vacuum tube', 'ts', 'middle');
  o += rect(44, 62, 10, 66, 'solid2') + text(56, 144, 'metal', 'ts', 'start');
  o += rect(186, 62, 10, 66, 'solid2') + text(184, 144, 'collector', 'ts', 'end');
  for (const [y0] of [[60], [78]]) o += arrow(0 + 18, y0 - 26, 54, y0 + 6, 'ln', 6);
  o += text(10, 22, 'light，frequency f', 'tl', 'start');
  for (const y of [80, 96, 112]) o += arrow(58, y, 176, y, 'ink', 6);
  o += text(116, 128, 'electron', 'ts', 'middle');
  o += line(49, 128, 49, 186, 'ink') + line(191, 128, 191, 186, 'ink') + line(49, 186, 100, 186, 'ink') + line(140, 186, 191, 186, 'ink');
  o += line(100, 176, 100, 196, 'ink-b') + line(108, 180, 108, 192, 'ink-b') + line(116, 176, 116, 196, 'ink-b') + line(124, 180, 124, 192, 'ink-b');
  o += line(124, 186, 140, 186, 'ink') + text(112, 214, '反向 voltage V（可调）', 'ts', 'middle');
  o += text(112, 232, '调到 current 刚好为 0：eV₀ = KE' + sub('max'), 'ts', 'middle');
  // 图：KE_max 对 f
  const sx = lin(0, 12, 280, 548), sy = lin(-2.5, 2, 236, 30), h = 4.135667696e-15 * 1e14;
  o += axes({ sx, sy, x0: 0, x1: 12, y0: -2.5, y1: 2, xt: [0, 2, 4, 6, 8, 10, 12], yt: [-2, -1, 0, 1, 2], xAt: 0, grid: false });
  o += text(sx(12), sy(-2.5) + 16, 'f（10¹⁴ Hz）', 'ts', 'end') + text(sx(0) + 6, sy(2) - 2, 'KE' + sub('max') + '（eV）', 'ts', 'start');
  const PNa = 2.46, PZn = 4.31; // OpenStax UP3 Table 6.1
  const met = [[PNa, 'sodium', 'ln'], [PZn, 'zinc', 'ink']];
  for (const [phi, lab, cls] of met) {
    const f0 = phi / h;
    const fs = Math.max(0, (phi - 2.5) / h);
    o += line(sx(f0), sy(0), sx(Math.min(12, (2 + phi) / h)), sy(Math.min(2, h * 12 - phi)), cls) + line(sx(fs), sy(h * fs - phi), sx(f0), sy(0), 'dash');
    o += circle(sx(f0), sy(0), 3.5, cls === 'ln' ? 'ln-f' : 'ink-f');
  }
  o += text(sx(9.7), sy(1.95), 'sodium：φ = ' + PNa + ' eV', 'tl', 'end') + text(sx(12), sy(h * 12 - PZn) - 12, 'zinc：φ = ' + PZn + ' eV', 'tb', 'end');
  const f400 = 2.99792458e8 / 400e-9 / 1e14, f600 = 2.99792458e8 / 600e-9 / 1e14;
  o += circle(sx(f400), sy(h * f400 - PNa), 5, 'ln-f') + text(sx(f400) - 8, sy(h * f400 - PNa) - 6, '400 nm：' + (h * f400 - PNa).toFixed(2) + ' eV', 'tl', 'end');
  o += circle(sx(f600), sy(0), 5, 'paper') + text(sx(0.4), sy(1.62), '600 nm（空心点）在 sodium 的', 'ts', 'start') + text(sx(0.4), sy(1.32), 'threshold 左边，没有 electron', 'ts', 'start');
  o += text(280, 272, '虚线延长到 f = 0 处是 −φ（sodium 是 −' + PNa + '）；', 'ts', 'start') + text(280, 288, '两条 line 平行，slope 都是 h。', 'ts', 'start');
  return svg(560, 294, o, '左边是 photoelectric effect 的装置：light 照到 metal 上打出 electron，用反向 voltage 测最大 kinetic energy；右边是最大 kinetic energy 对 frequency 的两条平行 line，slope 都是 Planck constant，与横轴交于各自的 threshold frequency');
}

// ---------- 第 6 站：Compton scattering ----------
function compton() {
  const h = 6.62607e-34, me = 9.10938e-31, c = 2.99792e8;
  const lam = 71e-12, th = 30 * R, lc = h / (me * c);
  const lam2 = lam + lc * (1 - Math.cos(th));
  const r = lam / lam2;                       // p_f′ / p_f
  const pe = [1 - r * Math.cos(th), -r * Math.sin(th)]; // electron momentum（以 p_f 为单位，y 向上）
  const phiE = Math.atan2(pe[1], pe[0]);
  // 波浪线：沿方向 ang 从 (x0, y0) 走 len，wavelength wl（屏幕坐标 y 向下，ang 按数学方向）
  const wave = (x0, y0, ang, len, wl, amp) => {
    const ux = Math.cos(ang), uy = -Math.sin(ang), nx = -uy, ny = ux, pts = [];
    for (let t = 0; t <= len; t += 1) { const o = amp * Math.sin(2 * Math.PI * t / wl); pts.push([x0 + t * ux + o * nx, y0 + t * uy + o * ny]); }
    return d(pts);
  };
  let o = '';
  // 左：碰撞
  const E = [150, 130], wl = 14;
  o += path(wave(20, E[1], 0, 112, wl, 5), 'ln') + arrow(E[0] - 18, E[1], E[0] - 9, E[1], 'ln', 6);
  o += circle(E[0], E[1], 6, 'ink-f') + text(E[0] - 10, E[1] + 24, 'electron（静止）', 'ts', 'end');
  const L2 = 112, ex = E[0] + 18 * Math.cos(th), ey = E[1] - 18 * Math.sin(th);
  o += path(wave(ex, ey, th, L2, wl / r, 5), 'ln');
  const tx = ex + (L2 + 8) * Math.cos(th), ty = ey - (L2 + 8) * Math.sin(th);
  o += arrow(tx - 10 * Math.cos(th), ty + 10 * Math.sin(th), tx, ty, 'ln', 6);
  o += arrow(E[0] + 8 * Math.cos(phiE), E[1] - 8 * Math.sin(phiE), E[0] + 70 * Math.cos(phiE), E[1] - 70 * Math.sin(phiE), 'ink');
  o += text(E[0] + 70 * Math.cos(phiE) + 8, E[1] - 70 * Math.sin(phiE) + 4, 'electron 弹开', 'ts', 'start');
  o += line(E[0] + 10, E[1], E[0] + 120, E[1], 'dash');
  const arc = []; for (let k = 0; k <= 20; k++) { const a = th * k / 20; arc.push([E[0] + 52 * Math.cos(a), E[1] - 52 * Math.sin(a)]); }
  o += path(d(arc), 'ink') + text(E[0] + 60, E[1] - 8, 'θ = 30°', 'ts', 'start');
  o += text(20, E[1] - 16, 'λ = 71 pm', 'tl', 'start');
  o += text(tx - 4, ty - 12, 'λ′ = ' + (lam2 * 1e12).toFixed(3) + ' pm', 'tl', 'end');
  o += text(20, 236, 'λ′ 只比 λ 长 ' + ((lam2 / lam - 1) * 100).toFixed(2) + '%，图上的波看不出差别。', 'ts', 'start');
  // 右：momentum 三角形
  const O = [318, 190], S = 180;
  const A = [O[0] + S, O[1]], B = [O[0] + S * r * Math.cos(th), O[1] - S * r * Math.sin(th)];
  o += arrow(O[0], O[1], A[0], A[1], 'ln') + arrow(O[0], O[1], B[0], B[1], 'ln') + arrow(B[0], B[1], A[0], A[1], 'ink-b');
  o += text((O[0] + A[0]) / 2, O[1] + 20, 'p' + sub('f') + ' = h/λ', 'tl', 'middle');
  o += text((O[0] + B[0]) / 2 - 8, (O[1] + B[1]) / 2 - 8, 'p' + sub('f') + '′ = h/λ′', 'tl', 'end');
  o += text((A[0] + B[0]) / 2 + 10, (A[1] + B[1]) / 2 - 4, 'p', 'tb', 'start') + text((A[0] + B[0]) / 2 + 10, (A[1] + B[1]) / 2 + 12, 'electron', 'ts', 'start');
  const arc2 = []; for (let k = 0; k <= 20; k++) { const a = th * k / 20; arc2.push([O[0] + 46 * Math.cos(a), O[1] - 46 * Math.sin(a)]); }
  o += path(d(arc2), 'ink') + text(O[0] + 52, O[1] - 8, 'θ', 'ts', 'start');
  o += text(O[0] - 6, 40, 'momentum 守恒：p' + sub('f') + ' = p' + sub('f') + '′ + p', 'tb', 'start');
  o += text(O[0] - 6, 236, '|p| = ' + Math.hypot(pe[0], pe[1]).toFixed(3) + ' p' + sub('f') + '，方向在水平线下 ' + (-phiE / R).toFixed(1) + '°', 'ts', 'start');
  return svg(560, 246, o, '左：wavelength 71 pm 的 X-ray photon 撞上静止的 electron，向 30 度方向 scatter 出去，wavelength 变为 71.325 pm，electron 向右下方弹开；右：撞前 photon 的 momentum 等于撞后 photon 的 momentum 加 electron 的 momentum，画成一个三角形');
}

// ---------- 第 6 站：Mach–Zehnder，单个 photon ----------
function mzA() {
  const S = [20, 210], B1 = [90, 210], M1 = [90, 90], M2 = [330, 210], B2 = [330, 90], D0 = [410, 90], D1 = [330, 22], BL = [210, 210];
  const v = 300; // px/s
  const seg = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]) / v;
  let o = '';
  // 光路
  o += line(S[0], S[1], B1[0], B1[1], 'grid') + line(B1[0], B1[1], M1[0], M1[1], 'grid') + line(M1[0], M1[1], B2[0], B2[1], 'grid');
  o += line(B1[0], B1[1], M2[0], M2[1], 'grid') + line(M2[0], M2[1], B2[0], B2[1], 'grid') + line(B2[0], B2[1], D0[0], D0[1], 'grid') + line(B2[0], B2[1], D1[0], D1[1], 'grid');
  const bs = (p, lab, dx, dy) => line(p[0] - 14, p[1] + 14, p[0] + 14, p[1] - 14, 'ink-b') + text(p[0] + dx, p[1] + dy, lab, 'ts', 'middle');
  o += bs(B1, 'BS1', 0, 34) + bs(B2, 'BS2', 34, 22);
  o += line(M1[0] - 14, M1[1] + 14, M1[0] + 14, M1[1] - 14, 'ink-b') + text(M1[0] - 22, M1[1] - 12, 'mirror', 'ts', 'end');
  o += line(M2[0] - 14, M2[1] + 14, M2[0] + 14, M2[1] - 14, 'ink-b') + text(M2[0] + 22, M2[1] + 18, 'mirror', 'ts', 'start');
  o += rect(D0[0], D0[1] - 14, 22, 28, 'paper', 4) + text(D0[0] + 30, D0[1] + 5, 'D0', 'tb', 'start');
  o += rect(D1[0] - 14, D1[1] - 16, 28, 18, 'paper', 4) + text(D1[0] + 22, D1[1] - 2, 'D1', 'tb', 'start');
  o += text(S[0], S[1] - 12, 'source', 'ts', 'start') + text(210, 82, 'upper arm', 'ts', 'middle') + text(270, 228, 'lower arm', 'ts', 'middle');
  // 时间线
  const t1 = seg(S, B1), t2 = seg(B1, M1), t3 = seg(M1, B2), t4 = seg(B2, D0), gap = 0.7;
  const tBL = seg(B1, BL);
  const outcomes = ['D0', 'D0', 'X', 'D1', 'D0'];
  const per = t1 + t2 + t3 + t4 + gap;
  const T = per * outcomes.length + 0.4;
  const blockFrom = per * 2;
  o += `<g>${rect(BL[0] - 6, BL[1] - 16, 12, 32, 'solid2')}${windows([[blockFrom, T]], T)}</g>`;
  o += showText(BL[0], BL[1] + 34, 'blocker', 'ts', 'middle', [[blockFrom, T]], T);
  outcomes.forEach((oc, i) => {
    const s0 = i * per, sB1 = s0 + t1, sC = sB1 + t2, sB2 = sC + t3, sD = sB2 + t4, end = s0 + per;
    // 进 BS1 之前：一个完整的 photon
    o += mover([[0, ...S], [s0, ...S], [sB1, ...B1], [T, ...B1]], [[0, 0], [s0, 1], [sB1, 0]], T, 6, 'ln-f');
    // 两条 arm 上各一半 amplitude
    const blocked = s0 >= blockFrom;
    const stopU = oc === 'X' ? sB1 + tBL : sB2;
    o += mover([[0, ...B1], [sB1, ...B1], [sC, ...M1], [sB2, ...B2], [T, ...B2]], [[0, 0], [sB1, 1], [stopU, 0]], T, 4.2, 'ln-f');
    if (!blocked) o += mover([[0, ...B1], [sB1, ...B1], [sC, ...M2], [sB2, ...B2], [T, ...B2]], [[0, 0], [sB1, 1], [sB2, 0]], T, 4.2, 'ln-f');
    else o += mover([[0, ...B1], [sB1, ...B1], [sB1 + tBL, ...BL], [T, ...BL]], [[0, 0], [sB1, 1], [sB1 + tBL, 0]], T, 4.2, 'ln-f');
    if (oc === 'X') {
      o += showText(BL[0], BL[1] - 24, 'absorbed', 'tl', 'middle', [[sB1 + tBL, end]], T);
    } else {
      const Dp = oc === 'D0' ? D0 : D1;
      o += mover([[0, ...B2], [sB2, ...B2], [sD, ...Dp], [T, ...Dp]], [[0, 0], [sB2, 1], [sD, 0]], T, 6, 'ln-f');
      o += showText(oc === 'D0' ? D0[0] + 11 : D1[0] - 22, oc === 'D0' ? D0[1] - 22 : D1[1] - 4, 'click', 'tl', oc === 'D0' ? 'middle' : 'end', [[sD, end]], T);
    }
  });
  o += showText(30, 30, '两条 arm 都通：每个 photon 都在 D0', 'tb', 'start', [[0, blockFrom]], T);
  o += showText(30, 30, '挡住 lower arm：D0、D1、absorbed 都会出现', 'tb', 'start', [[blockFrom, T]], T);
  o += text(440, 150, '|D0 amplitude|²', 'ts', 'start');
  o += text(440, 168, '都通：1', 'tl', 'start') + text(440, 186, '挡住：1/4', 'tl', 'start');
  o += text(440, 214, '|D1 amplitude|²', 'ts', 'start');
  o += text(440, 232, '都通：0', 'tl', 'start') + text(440, 250, '挡住：1/4', 'tl', 'start');
  o += text(20, 262, '小点：photon 在 BS1 之后的两份 amplitude；大点：被 detector 测到。', 'ts', 'start');
  return svgA(560, 270, o, '动图：单个 photon 进入 Mach-Zehnder interferometer，两条 arm 都通时每个 photon 都落在 D0；之后挡住 lower arm，photon 有时被 blocker 吸收，有时落在 D0，有时落在 D1');
}

// ---------- 第 6 站：一个一个 photon 攒出的 fringe ----------
function buildupA() {
  let seed = 20261121;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const I = (u) => { const s = Math.abs(u) < 1e-9 ? 1 : Math.sin(Math.PI * 1.1 * u) / (Math.PI * 1.1 * u); return Math.cos(Math.PI * 4.5 * u) ** 2 * s * s; };
  const X0 = 40, X1 = 520, sx = lin(-1, 1, X0, X1);
  const stages = [12, 80, 400, 1600], all = [];
  while (all.length < stages[stages.length - 1]) { const u = 2 * rnd() - 1; if (rnd() < I(u)) all.push([u, rnd()]); }
  const step = 1.6, hold = 2.6, T = hold + step * stages.length + 1.0;
  const showFrom = [hold, hold + step, hold + 2 * step, hold + 3 * step];
  let o = rect(X0, 28, X1 - X0, 96, 'wash2');
  let prev = 0;
  stages.forEach((n, k) => {
    let p = '';
    for (let i = prev; i < n; i++) p += 'M' + f1(sx(all[i][0])) + ' ' + f1(30 + 90 * all[i][1]) + 'h2v2h-2z';
    o += `<path d="${p}" class="ink-f">${windows([[0, hold], [showFrom[k], T]], T)}</path>`;
    prev = n;
  });
  // histogram 与 prediction
  const NB = 48, sy = lin(0, 1, 250, 150);
  const hist = (n) => { const h = Array(NB).fill(0); for (let i = 0; i < n; i++) h[Math.min(NB - 1, Math.floor((all[i][0] + 1) / 2 * NB))]++; return h; };
  // 期望计数：n × ∫bin I / ∫I
  let tot = 0; for (let k = 0; k < 4000; k++) tot += I(-1 + 2 * (k + 0.5) / 4000) * (2 / 4000);
  stages.forEach((n, k) => {
    const h = hist(n), bw = 2 / NB, peak = n * bw / tot; // 中心处期望的 bin 计数
    let p = '';
    h.forEach((c, j) => { if (c) { const x = sx(-1 + j * bw), w = sx(-1 + (j + 1) * bw) - x; const y = sy(Math.min(1.05, c / peak)); p += 'M' + f1(x + 0.5) + ' ' + f1(y) + 'H' + f1(x + w - 0.5) + 'V' + f1(sy(0)) + 'H' + f1(x + 0.5) + 'Z'; } });
    const ws = k === stages.length - 1 ? [[0, hold], [showFrom[k], T]] : [[showFrom[k], showFrom[k + 1]]];
    o += `<path d="${p}" class="wash-strong">${windows(ws, T)}</path>`;
    o += showText(X1, 20, '已到达 ' + n + ' 个 photon', 'tl', 'end', ws, T);
  });
  o += path(curve(I, -1, 1, sx, sy, 600), 'ln');
  const env = (u) => { const s = Math.abs(u) < 1e-9 ? 1 : Math.sin(Math.PI * 1.1 * u) / (Math.PI * 1.1 * u); return 0.5 * s * s; };
  o += path(curve(env, -1, 1, sx, sy, 300), 'dash');
  o += line(X0, sy(0), X1, sy(0), 'axis');
  o += text(X0, 20, 'screen（每个点是一次 detection）', 'ts', 'start');
  o += text(X0, 268, '蓝线：|φ₁ + φ₂|²；虚线：P₁ + P₂（如果每个 photon 只走一条 slit）', 'ts', 'start');
  o += text(X0, 142, 'histogram', 'ts', 'start');
  return svgA(560, 276, o, '动图：double-slit 实验中 photon 一个一个打到 screen 上，最初的点看起来随机，累计到上千个以后排成 interference fringe，histogram 贴合 phi1 加 phi2 的模平方，而不是 P1 加 P2');
}

// ---------- 第 7 站：Bell 实验 ----------
function bell() {
  let o = '';
  const S = [280, 46];
  o += circle(S[0], S[1], 12, 'wash-strong') + text(S[0], S[1] + 32, 'source：一对 photon', 'ts', 'middle');
  o += arrow(S[0] - 16, S[1], 150, S[1], 'ln') + arrow(S[0] + 16, S[1], 410, S[1], 'ln');
  const pol = (cx, ang, lab) => {
    let q = circle(cx, S[1], 22, 'paper');
    const dx = 18 * Math.sin(ang * R), dy = -18 * Math.cos(ang * R);
    q += line(cx - dx, S[1] - dy, cx + dx, S[1] + dy, 'ink-b');
    return q + text(cx, S[1] - 30, lab, 'tb', 'middle');
  };
  o += pol(126, 0, 'Alice 的 polarizer：a') + pol(434, 30, 'Bob 的 polarizer：b');
  o += rect(56, S[1] - 12, 24, 24, 'paper', 4) + rect(480, S[1] - 12, 24, 24, 'paper', 4);
  o += text(68, S[1] + 32, '通过 / 不通过', 'ts', 'middle') + text(492, S[1] + 32, '通过 / 不通过', 'ts', 'middle');
  // 曲线
  const sx = lin(0, 90, 70, 380), sy = lin(0, 1, 270, 110);
  o += axes({ sx, sy, x0: 0, x1: 90, y0: 0, y1: 1, xt: [[0, '0°'], [30, '30°'], [60, '60°'], [90, '90°']], yt: [0, [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], 1], grid: true });
  o += text(sx(90), 302, '两个 polarizer 的夹角 |a − b|', 'ts', 'end') + text(sx(0) + 6, sy(1) - 8, 'P(两边结果不同)', 'ts', 'start');
  o += path(curve((x) => Math.sin(x * R) ** 2, 0, 90, sx, sy), 'ln');
  o += circle(sx(30), sy(0.25), 5, 'ln-f') + circle(sx(60), sy(0.75), 5, 'ln-f');
  o += text(sx(30) + 8, sy(0.25) + 16, 'sin²30° = 0.25', 'ts', 'start') + text(sx(60) - 8, sy(0.75) - 8, 'sin²60° = 0.75', 'tl', 'end');
  o += line(sx(60) - 14, sy(0.5), sx(60) + 14, sy(0.5), 'ink-b') + text(sx(60) + 18, sy(0.5) + 4, '≤ 0.25 + 0.25', 'tb', 'start');
  o += text(400, 150, 'local hidden variable', 'ts', 'start') + text(400, 166, '要求 60° 处不超过', 'ts', 'start') + text(400, 182, '两倍的 30° 处，', 'ts', 'start') + text(400, 198, '即 ≤ 0.5（黑横线）。', 'ts', 'start');
  o += text(400, 224, 'quantum mechanics', 'ts', 'start') + text(400, 240, '和实验给出 0.75。', 'tl', 'start');
  return svg(560, 306, o, 'Bell 实验的装置：source 发出一对 photon 分别飞向 Alice 和 Bob 的 polarizer；下方是两边结果不同的概率 sin 平方随夹角变化的曲线，60 度处为 0.75，超过 local hidden variable 要求的上限 0.5');
}

export default {
  'pc1101-slits': slits,
  'pc1101-rv': rvA,
  'pc1101-transit': transitA,
  'pc1101-mm': mm,
  'pc1101-clock': clockA,
  'pc1101-simul': simul,
  'pc1101-axes': axesA,
  'pc1101-elevator': elevator,
  'pc1101-s2': s2A,
  'pc1101-photo': photo,
  'pc1101-compton': compton,
  'pc1101-mz': mzA,
  'pc1101-buildup': buildupA,
  'pc1101-bell': bell,
};
