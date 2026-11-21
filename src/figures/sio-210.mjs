import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, ashow, anim, animRot, f1 } from '../lib/svg.mjs';

// 所有数字都在这里算：常数取自正文
const R = Math.PI / 180, g = 9.81, Om = 7.2921e-5, Re = 6.371e6;
const fcor = (lat) => 2 * Om * Math.sin(lat * R);
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;

// EOS-80 在 p = 0 的 density（UNESCO 1981）
function rho0(S, t) {
  const rw = 999.842594 + 6.793952e-2 * t - 9.09529e-3 * t ** 2 + 1.001685e-4 * t ** 3 - 1.120083e-6 * t ** 4 + 6.536332e-9 * t ** 5;
  const A = 0.824493 - 4.0899e-3 * t + 7.6438e-5 * t ** 2 - 8.2467e-7 * t ** 3 + 5.3875e-9 * t ** 4;
  const B = -5.72466e-3 + 1.0227e-4 * t - 1.6546e-6 * t ** 2;
  return rw + A * S + B * S ** 1.5 + 4.8314e-4 * S * S;
}

// marching squares：返回 level c 的等值线（一串线段）
function contour(F, nx, ny, c, X, Y) {
  let o = '';
  const P = (i, j, i2, j2) => { const a = F[j][i], b = F[j2][i2], t = (c - a) / (b - a); return [X(i + (i2 - i) * t), Y(j + (j2 - j) * t)]; };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v = [F[j][i], F[j][i + 1], F[j + 1][i + 1], F[j + 1][i]];
    const e = [];
    if ((v[0] - c) * (v[1] - c) < 0) e.push(P(i, j, i + 1, j));
    if ((v[1] - c) * (v[2] - c) < 0) e.push(P(i + 1, j, i + 1, j + 1));
    if ((v[2] - c) * (v[3] - c) < 0) e.push(P(i + 1, j + 1, i, j + 1));
    if ((v[3] - c) * (v[0] - c) < 0) e.push(P(i, j + 1, i, j));
    if (e.length >= 2) o += 'M' + f1(e[0][0]) + ' ' + f1(e[0][1]) + 'L' + f1(e[1][0]) + ' ' + f1(e[1][1]);
    if (e.length === 4) o += 'M' + f1(e[2][0]) + ' ' + f1(e[2][1]) + 'L' + f1(e[3][0]) + ' ' + f1(e[3][1]);
  }
  return o;
}

// Stommel (1948) 的解：x ∈ [0, 1]（west → east），y ∈ [0, b]
function stommelPsi(alpha, b, nx, ny) {
  const k = Math.PI / b, q2 = Math.sqrt(alpha * alpha / 4 + k * k);
  const A = -alpha / 2 + q2, B = -alpha / 2 - q2;
  const p = (1 - Math.exp(B)) / (Math.exp(A) - Math.exp(B)), q = 1 - p;
  const F = [];
  for (let j = 0; j <= ny; j++) {
    const y = (b * j) / ny, row = [];
    for (let i = 0; i <= nx; i++) { const x = i / nx; row.push(-Math.sin(k * y) * (p * Math.exp(A * x) + q * Math.exp(B * x) - 1)); }
    F.push(row);
  }
  return F;
}
function gyrePanel(x0, y0, w, h, alpha, b) {
  const nx = 120, ny = 60, F = stommelPsi(alpha, b, nx, ny);
  const mx = Math.max(...F.flat());
  let o = rect(x0, y0, w, h, 'frame');
  const X = (i) => x0 + (w * i) / nx, Y = (j) => y0 + h - (h * j) / ny;
  for (const c of [0.1, 0.3, 0.5, 0.7, 0.9]) o += path(contour(F, nx, ny, c * mx, X, Y), c === 0.5 ? 'ln' : 'ink');
  return o;
}

// ---------- 开头：Nansen 看到的 ice drift ----------
function nansen() {
  const O = [170, 200];
  let o = '';
  // 一块 ice floe（有面积的形状）
  const floe = [[-38, -10], [-20, -30], [12, -34], [40, -14], [34, 18], [6, 30], [-30, 22]].map(([x, y]) => [O[0] + x, O[1] + y]);
  o += poly(floe, 'paper');
  // wind：正北
  o += arrow(O[0], O[1], O[0], O[1] - 150, 'ink-b', 9) + text(O[0] - 8, O[1] - 156, 'wind', 'tb', 'end');
  // 20°–40° 的扇形
  const wedge = [[O[0], O[1]]];
  for (let a = 20; a <= 40; a += 2) wedge.push([O[0] + 128 * Math.sin(a * R), O[1] - 128 * Math.cos(a * R)]);
  o += poly(wedge, 'wash');
  const tip = [O[0] + 128 * Math.sin(30 * R), O[1] - 128 * Math.cos(30 * R)];
  o += arrow(O[0], O[1], tip[0], tip[1], 'ln', 9) + text(tip[0] + 10, tip[1] + 2, 'ice drift', 'tl');
  o += text(tip[0] + 10, tip[1] + 18, '在 wind 右边 20° 到 40°', 'ts');
  // 角度弧
  const arcp = []; for (let a = 0; a <= 30; a += 2) arcp.push([O[0] + 52 * Math.sin(a * R), O[1] - 52 * Math.cos(a * R)]);
  o += path(d(arcp), 'mute');
  o += text(O[0] + 2, O[1] + 52, 'Fram 号随 ice 漂流（1893–1896，Arctic）', 'ts', 'middle');
  // 右侧：如果只有 wind 和 drag
  const P = [430, 200];
  o += arrow(P[0], P[1], P[0], P[1] - 120, 'ink-b', 9) + text(P[0] - 8, P[1] - 126, 'wind', 'tb', 'end');
  o += arrow(P[0] + 26, P[1], P[0] + 26, P[1] - 80, 'dash', 8) + text(P[0] + 34, P[1] - 60, '只有 wind 和', 'ts') + text(P[0] + 34, P[1] - 44, 'friction 时预期的', 'ts') + text(P[0] + 34, P[1] - 28, 'drift：顺风', 'ts');
  o += text(P[0] + 10, P[1] + 52, '所有 force 都在这条直线上', 'ts', 'middle');
  o += text(280, 22, 'Top view，北在上', 'ts', 'middle');
  return svg(560, 262, o, 'Nansen 观察到 ice 顺着 wind 右边 20 到 40 度漂流，而不是顺着 wind；右边是只有 wind 与 friction 时预期的顺风漂流');
}

// ---------- 开头：western intensification ----------
function wbc() {
  const x0 = 40, y0 = 40, w = 330, h = 200;
  let o = gyrePanel(x0, y0, w, h, 25, 0.6);
  // 西边北上，内部南下
  o += arrow(x0 - 14, y0 + h / 2 + 30, x0 - 14, y0 + h / 2 - 30, 'ln', 8);
  o += text(x0 - 4, y0 - 10, 'western boundary current：窄、快、往北', 'tl');
  o += rect(x0 + w * 0.5 - 4, y0 + h / 2 - 12, 150, 20, 'paper', 3) + arrow(x0 + w * 0.5 + 6, y0 + h / 2 - 8, x0 + w * 0.5 + 6, y0 + h / 2 + 5, 'ink', 5);
  o += text(x0 + w * 0.5 + 14, y0 + h / 2 + 3, 'interior：宽、慢、往南', 'ts');
  o += text(x0 - 6, y0 + h + 18, 'west', 'ts', 'start') + text(x0 + w, y0 + h + 18, 'east', 'ts', 'end');
  // wind profile：南边 trades 往西，北边 westerlies 往东
  const wx = 470, sy = (y) => y0 + h - (h * y) / 0.6;
  o += line(wx, y0, wx, y0 + h, 'axis');
  const pts = [];
  for (let k = 0; k <= 40; k++) { const y = (0.6 * k) / 40; pts.push([wx - 60 * Math.cos((Math.PI * y) / 0.6), sy(y)]); }
  o += path(d(pts), 'mute');
  for (const y of [0.03, 0.15, 0.45, 0.57]) { const tx = -60 * Math.cos((Math.PI * y) / 0.6); o += arrow(wx, sy(y), wx + tx, sy(y), 'ink', 6); }
  o += text(wx + 6, sy(0.57) - 12, 'westerlies', 'ts') + text(wx - 6, sy(0.03) + 18, 'trade winds', 'ts', 'end');
  o += text(wx, y0 + h + 36, 'wind stress（东西向）', 'ts', 'middle');
  o += text(205, y0 + h + 36, '实线是 streamline（Stommel 1948 的解）', 'ts', 'middle');
  return svg(560, 286, o, '一个 ocean basin 里 wind-driven gyre 的 streamline：南边 trade winds 往西、北边 westerlies 往东，回流挤在西边成为又窄又快的 western boundary current');
}

// ---------- 第 1 站：T-S diagram 与 cabbeling ----------
function ts() {
  const sx = lin(32, 37, 70, 480), sy = lin(0, 26, 250, 30);
  const nx = 100, ny = 104, F = [];
  for (let j = 0; j <= ny; j++) { const row = []; for (let i = 0; i <= nx; i++) row.push(rho0(32 + (5 * i) / nx, (26 * j) / ny) - 1000); F.push(row); }
  const X = (i) => sx(32 + (5 * i) / nx), Y = (j) => sy((26 * j) / ny);
  let o = axes({ sx, sy, x0: 32, x1: 37, y0: 0, y1: 26, xt: [32, 33, 34, 35, 36, 37], yt: [0, 5, 10, 15, 20, 25], xl: 'salinity S（g/kg）', yl: 'temperature T（°C）' });
  for (const c of [22, 23, 24, 25, 27, 28]) {
    o += path(contour(F, nx, ny, c, X, Y), 'grid');
  }
  o += path(contour(F, nx, ny, 26, X, Y), 'ink');
  // 标注等值线：在 T = 1 处找 S
  const Sat = (T, c) => { let lo = 30, hi = 40; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (rho0(m, T) - 1000 < c) lo = m; else hi = m; } return lo; };
  const Tat = (S, c) => { let lo = 0, hi = 30; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (rho0(S, m) - 1000 > c) lo = m; else hi = m; } return lo; };
  for (const c of [22, 23, 24, 25, 27]) { const T = Tat(37, c); if (T > 1 && T < 25.5) o += text(sx(37) + 5, sy(T) + 4, 'σ = ' + c, 'ts'); }
  const SA = Sat(2, 26), SB = Sat(18, 26), SM = (SA + SB) / 2, sM = rho0(SM, 10) - 1000;
  o += line(sx(SA), sy(2), sx(SB), sy(18), 'dash');
  o += circle(sx(SA), sy(2), 5, 'ink-f') + circle(sx(SB), sy(18), 5, 'ink-f') + circle(sx(SM), sy(10), 5.5, 'ln-f');
  o += text(sx(SA) - 8, sy(2) - 6, 'A：' + SA.toFixed(2) + '，2 °C', 'ts', 'end');
  o += text(sx(SB) + 9, sy(18) + 4, 'B：' + SB.toFixed(2) + '，18 °C', 'ts');
  o += text(sx(SM) + 10, sy(10) + 4, '各一半混合：σ = ' + sM.toFixed(2), 'tl');
  o += text(sx(Sat(10, 26)) - 6, sy(10) - 10, 'σ = 26', 'tb', 'end');
  o += text(270, 306, 'σ = ρ − 1000 kg/m³（p = 0）。Isopycnal 是弯的，连接线上的点都落在更密的一侧。', 'ts', 'middle');
  return svg(560, 316, o, 'T-S diagram 上的 isopycnal 是弯的；两团 sigma 都是 26 的水各一半混合，得到 sigma 26.36 的更密的水');
}

// ---------- 第 2 站：抛物面转盘上的 inertial oscillation（动图） ----------
function rotA() {
  const T = 8, N = 96, kt = [], th = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); th.push((2 * Math.PI * i) / N); }
  const R0 = 0.45, u0 = 0.5; // 单位：dish radius；u0 以 Ω·radius 为单位
  const inert = th.map((t) => [R0 * Math.cos(t) + u0 * Math.sin(t), R0 * Math.sin(t)]);
  const rot = th.map((t, i) => { const [x, y] = inert[i]; return [x * Math.cos(t) + y * Math.sin(t), -x * Math.sin(t) + y * Math.cos(t)]; });
  const rad = 100;
  const panel = (cx, cy, pts, title, l1, l2, spin) => {
    let o = circle(cx, cy, rad, 'wash2') + circle(cx, cy, rad, 'frame') + circle(cx, cy, 2.5, 'ink-f');
    const mark = line(cx, cy, cx + rad, cy, 'mute') + circle(cx + rad, cy, 4, 'ink-f');
    o += spin ? `<g>${mark}${animRot(th.map((t) => -t / R), cx, cy, kt, T)}</g>` : mark;
    const P = ([x, y]) => [cx + rad * x, cy - rad * y];
    o += path(d(pts.map(P)), 'dash');
    o += acircle(pts.map((p) => P(p)[0]), pts.map((p) => P(p)[1]), kt, T, 6, 'ln-f');
    o += text(cx, 24, title, 'tb', 'middle') + text(cx, cy + rad + 24, l1, 'ts', 'middle') + text(cx, cy + rad + 41, l2, 'ts', 'middle');
    return o;
  };
  let o = panel(140, 150, inert, '站在外面看（inertial frame）', 'parcel 走一个 ellipse，绕一圈', '正好用 dish 转一圈的时间 2π/Ω', true);
  o += panel(420, 150, rot, '跟着 dish 一起转着看', 'parcel 在一个小 circle 上顺时针转，', '一圈只用一半时间：2π/f，f = 2Ω', false);
  const c = [420 + rad * R0, 150 + rad * (u0 / 2)];
  o += text(c[0] + 34, c[1] + 4, 'inertial circle', 'ts');
  o += arrow(140 + rad + 10, 60, 140 + rad - 14, 46, 'ink', 6) + text(140 + rad + 12, 66, 'Ω（逆时针）', 'ts');
  return svgA(560, 302, o, '动图：表面是抛物面的转盘上，一个 parcel 被推了一下。外面看它走 ellipse，跟着转盘转着看，它在一个小 circle 上顺时针转，周期是转盘周期的一半');
}

// ---------- 第 3 站：从 rest 放开的 parcel 怎样变成 geostrophic flow（动图） ----------
function adjustA() {
  const f = fcor(35), G = g * 1e-5; // 1 m / 100 km 的 sea surface slope
  const Ti = (2 * Math.PI) / f, N = 120, T = 7, kt = [], X = [], Y = [];
  for (let i = 0; i <= N; i++) { const t = (2 * Ti * i) / N; kt.push(i / N); X.push((G / f) * (t - Math.sin(f * t) / f)); Y.push((G / f / f) * (1 - Math.cos(f * t))); }
  const xmax = X[N] / 1e3, ymax = (2 * G) / f / f / 1e3;
  const sx = lin(0, xmax, 70, 520), sy = lin(0, 40, 214, 64);
  let o = '';
  for (let k = 0; k <= 4; k++) { const yy = sy(k * 10); o += line(70, yy, 520, yy, 'grid'); }
  o += text(56, sy(0) + 4, 'η 高', 'ts', 'end') + text(56, sy(40) + 4, 'η 低', 'ts', 'end');
  o += text(280, 30, 'Pressure gradient force 一直指向北（低 η 一侧），大小 g·Δη/Δy = 9.81×10⁻⁵ m/s²', 'ts', 'middle');
  o += text(280, 46, '灰线是 sea surface 的等高线（isobar），北在上', 'ts', 'middle');
  const pts = X.map((x, i) => [sx(x / 1e3), sy(Y[i] / 1e3)]);
  o += path(d(pts), 'dash');
  o += acircle(pts.map((p) => p[0]), pts.map((p) => p[1]), kt, T, 6, 'ln-f');
  const top = pts[N / 4 * 1];
  o += line(sx(X[N / 4] / 1e3), sy(ymax), sx(X[N / 4] / 1e3), sy(0), 'mute');
  o += text(sx(X[N / 4] / 1e3) + 6, sy(ymax / 2) + 4, '最多往北偏 ' + ymax.toFixed(0) + ' km', 'ts');
  o += text(70, 248, '从 rest 放开：先顺着 force 往北，', 'ts') + text(70, 264, '被 Coriolis 一路往右扳，每 ' + (Ti / 3600).toFixed(1) + ' h', 'ts') + text(70, 280, '回到同一条 isobar 一次。', 'ts');
  o += text(520, 248, '平均下来：沿 isobar 往东，', 'tl', 'end') + text(520, 264, '速度 ' + (G / f).toFixed(2) + ' m/s = geostrophic', 'tl', 'end');
  o += text(sx(0), sy(0) + 18, 'start', 'ts', 'middle') + text(sx(xmax), sy(0) + 18, (xmax).toFixed(0) + ' km（' + (2 * Ti / 3600).toFixed(1) + ' h 后）', 'ts', 'end');
  void top;
  return svgA(560, 288, o, '动图：35 度 N，sea surface 每 100 km 降 1 m。Parcel 从 rest 放开，走出一串 cycloid，平均以 1.17 m/s 沿等高线往东走，而不是往低处流');
}

// ---------- 第 3 站：Gulf Stream 的 cross-section ----------
function gulf() {
  const sx = lin(0, 200, 60, 500), sz = lin(0, -3000, 70, 270);
  let o = '';
  // sea surface，1 m 夸张画成 22 px
  const eta = (x) => 0.5 * (1 + Math.tanh((x - 100) / 30));
  const surf = []; for (let x = 0; x <= 200; x += 2) surf.push([sx(x), sz(0) - 22 * eta(x)]);
  o += path(d(surf) + `L${sx(200)} ${sz(-3000)}L${sx(0)} ${sz(-3000)}Z`, 'wash2');
  o += path(d(surf), 'ink-b');
  // isopycnal：在 jet 里往东下沉 500 m
  for (const z0 of [-300, -700, -1100, -1500, -1900]) {
    const pts = []; for (let x = 0; x <= 200; x += 2) pts.push([sx(x), sz(z0 - 500 * eta(x))]);
    o += path(d(pts), 'mute');
  }
  o += text(sx(4), sz(-300) - 5, 'isopycnal', 'ts');
  // velocity：进纸面（往北），随深度线性减到 2050 m 为 0
  const vg = 1.17;
  for (const z of [-150, -650, -1150, -1650]) {
    const v = vg * (1 + z / 2050), r = 3 + 9 * (v / vg);
    const cx = sx(100), cy = sz(z);
    o += circle(cx, cy, r, 'paper') + line(cx - r * 0.7, cy - r * 0.7, cx + r * 0.7, cy + r * 0.7, 'ink') + line(cx - r * 0.7, cy + r * 0.7, cx + r * 0.7, cy - r * 0.7, 'ink');
    o += text(cx + 16, cy + 4, v.toFixed(2) + ' m/s', 'ts');
  }
  o += line(sx(60), sz(-2050), sx(140), sz(-2050), 'ln-dash') + text(sx(142), sz(-2050) + 4, 'v = 0（约 2050 m）', 'tl');
  // 表面的 force balance
  const py = sz(0) - 34;
  o += arrow(sx(100) - 4, py, sx(100) - 60, py, 'ink', 7) + text(sx(100) - 64, py + 4, 'pressure gradient', 'ts', 'end');
  o += arrow(sx(100) + 4, py, sx(100) + 60, py, 'ln', 7) + text(sx(100) + 64, py + 4, 'Coriolis', 'tl');
  o += text(sx(0), sz(0) - 6, 'η 低', 'ts') + text(sx(200), sz(0) - 30, 'η 高 1 m', 'ts', 'end');
  o += text(sx(0), 300, 'west（陆地一侧）', 'ts') + text(sx(200), 300, 'east（Sargasso Sea）', 'ts', 'end');
  o += text(sx(0) - 6, sz(-1000) + 4, '1000 m', 'ts', 'end') + text(sx(0) - 6, sz(-2000) + 4, '2000 m', 'ts', 'end') + text(sx(0) - 6, sz(-3000) + 4, '3000 m', 'ts', 'end');
  o += text(280, 18, '向北看的 cross-section；⊗ 表示流进纸面（往北），大小表示速度', 'ts', 'middle');
  return svg(560, 308, o, 'Gulf Stream 的 cross-section：sea surface 向东升高 1 m，isopycnal 向东下沉，往北的 geostrophic velocity 从表面 1.17 m/s 线性减到约 2050 m 处为零');
}

// ---------- 第 4 站：Ekman spiral（动图） ----------
function ekmanA() {
  const DE = 90.4, a = Math.PI / DE, V0 = 0.151;
  const uv = (z) => [V0 * Math.exp(a * z) * Math.cos(Math.PI / 4 + a * z), V0 * Math.exp(a * z) * Math.sin(Math.PI / 4 + a * z)];
  const N = 90, T = 7, kt = [], zs = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); zs.push(-DE * Math.min(1, i / (N - 12))); }
  // 左：五层水平面（透视），每层画该深度的 velocity
  const ox = 120, oy = 66, gap = 46, s = 360;
  const E = [1, 0], Nn = [0.62, -0.42]; // 屏幕上的 east、north 方向
  const P = (base, u, v) => [base[0] + s * (u * E[0] + v * Nn[0]), base[1] + s * (u * E[1] + v * Nn[1])];
  const baseAt = (z) => [ox, oy + (gap * -z) / (DE / 4)];
  let o = text(140, 16, '五个深度上的 velocity（透视）', 'tb', 'middle');
  o += line(ox, oy, ox, oy + gap * 4 + 6, 'axis');
  for (let k = 0; k <= 4; k++) {
    const z = (-DE * k) / 4, b = baseAt(z);
    const c1 = P(b, -0.1, -0.1), c2 = P(b, 0.16, -0.1), c3 = P(b, 0.16, 0.13), c4 = P(b, -0.1, 0.13);
    o += poly([c1, c2, c3, c4], 'wash');
    const [u, v] = uv(z), t = P(b, u, v);
    if (Math.hypot(t[0] - b[0], t[1] - b[1]) > 3) o += arrow(b[0], b[1], t[0], t[1], 'ink', 5);
    o += text(50, b[1] + 4, (-z).toFixed(0) + ' m', 'ts', 'end');
  }
  const nb = baseAt(0), nt = P(nb, 0, 0.13);
  o += text(nt[0] + 2, nt[1] - 4, 'N', 'ts') + text(P(nb, 0.16, 0)[0] + 4, P(nb, 0.16, 0)[1] + 4, 'E', 'ts');
  o += apath(zs.map((z) => { const b = baseAt(z), t = P(b, ...uv(z)); return d([b, t]); }), kt, T, 'ln');
  o += acircle(zs.map((z) => P(baseAt(z), ...uv(z))[0]), zs.map((z) => P(baseAt(z), ...uv(z))[1]), kt, T, 4, 'ln-f');
  // 右：top view hodograph
  const hc = [390, 140], hs = 700;
  const H = (u, v) => [hc[0] + hs * u, hc[1] - hs * v];
  o += text(420, 16, 'Top view：各层 arrow 的尖端连成 spiral', 'tb', 'middle');
  o += line(hc[0] - 90, hc[1], hc[0] + 130, hc[1], 'grid') + line(hc[0], hc[1] - 118, hc[0], hc[1] + 80, 'grid');
  o += text(hc[0] + 4, hc[1] - 106, 'N', 'ts') + text(hc[0] + 124, hc[1] - 6, 'E', 'ts');
  o += arrow(hc[0] - 60, hc[1] - 20, hc[0] - 60, hc[1] - 100, 'ink-b', 8) + text(hc[0] - 66, hc[1] - 60, 'wind', 'tb', 'end');
  const sp = []; for (let z = 0; z >= -DE; z -= 0.5) sp.push(H(...uv(z)));
  o += path(d(sp), 'ink');
  o += apath(zs.map((z) => d([hc, H(...uv(z))])), kt, T, 'ln');
  o += acircle(zs.map((z) => H(...uv(z))[0]), zs.map((z) => H(...uv(z))[1]), kt, T, 4, 'ln-f');
  const s0 = H(...uv(0)), s1 = H(...uv(-DE / 2)), s2 = H(...uv(-DE));
  o += text(s0[0] + 8, s0[1] - 2, '0 m：0.151 m/s', 'ts') + text(s0[0] + 8, s0[1] + 14, '偏右 45°', 'ts');
  o += line(s1[0] + 2, s1[1] + 2, 446, 186, 'mute') + text(448, 192, '45 m：偏右 135°，', 'ts') + text(448, 208, '剩 21%', 'ts');
  o += line(s2[0] - 2, s2[1] + 2, 352, 182, 'mute') + text(350, 188, '90 m：与 surface', 'ts', 'end') + text(350, 204, '反向，剩 4.3%', 'ts', 'end');
  o += arrow(hc[0], hc[1] + 98, hc[0] + 70, hc[1] + 98, 'ink-b', 7) + text(hc[0] - 8, hc[1] + 102, 'transport（wind 右边 90°）', 'tb', 'end');
  o += text(280, 296, '45°N，U' + sub('10') + ' = 10 m/s，D' + sub('E') + ' = 90.4 m。越往下转得越右，速度按 exp(az) 衰减。', 'ts', 'middle');
  return svgA(560, 304, o, '动图：北半球 wind 往北吹，表面 current 在 wind 右边 45 度，越往深处越往右转、越弱，到 90 米深处方向与表面相反；把各层加起来的 transport 正好在 wind 右边 90 度');
}

// ---------- 第 4 站：basin 里的 Ekman convergence ----------
function pump() {
  const sx = lin(0, 8000, 70, 400), sy = lin(20, 45, 270, 40);
  let o = rect(sx(0), sy(45), sx(8000) - sx(0), sy(20) - sy(45), 'frame');
  o += rect(sx(0), sy(40), sx(8000) - sx(0), sy(25) - sy(40), 'wash');
  for (const lat of [20, 25, 30, 35, 40, 45]) o += text(sx(0) - 6, sy(lat) + 4, lat + '°N', 'ts', 'end');
  o += text(sx(0), sy(20) + 18, '0', 'ts', 'middle') + text(sx(8000), sy(20) + 18, '8000 km', 'ts', 'middle');
  const tau = (lat) => -Math.cos((Math.PI * (lat - 25)) / 15); // 以 0.104 Pa 为单位
  for (const lat of [25, 28.75, 36.25, 40]) {
    const L = 60 * tau(lat);
    for (const x of [1600, 4000, 6400]) o += arrow(sx(x) - L / 2, sy(lat), sx(x) + L / 2, sy(lat), 'ink', 6);
  }
  o += text(sx(4000), sy(32.5) + 4, 'wind = 0', 'ts', 'middle');
  // Ekman transport：25°N 往北，40°N 往南
  const V25 = 0.104 / (1025 * fcor(25)), V40 = 0.104 / (1025 * fcor(40));
  for (const x of [800, 2800, 5200, 7200]) {
    o += arrow(sx(x), sy(25) + 12, sx(x), sy(25) - 12 - 14 * V25, 'ln', 7);
    o += arrow(sx(x), sy(40) - 12, sx(x), sy(40) + 12 + 14 * V40, 'ln', 7);
  }
  const X = 420;
  o += text(X, sy(40) - 22, '40°N：westerlies', 'tb') + text(X, sy(40) - 6, 'Ekman 往南 ' + V40.toFixed(2) + ' m²/s', 'tl');
  o += text(X, sy(25) + 4, '25°N：trade winds', 'tb') + text(X, sy(25) + 20, 'Ekman 往北 ' + V25.toFixed(2) + ' m²/s', 'tl');
  const Q = (V25 + V40) * 8e6, A = 8e6 * 15 * 111.12e3, w = Q / A;
  o += text(X, sy(32.5) - 16, '流进来 ' + (Q / 1e6).toFixed(1) + ' Sv', 'ts');
  o += text(X, sy(32.5), '没有地方去，只能往下：', 'ts');
  o += text(X, sy(32.5) + 16, 'w = −' + (w * 1e6).toFixed(2) + '×10⁻⁶ m/s', 'tl');
  o += text(X, sy(32.5) + 32, '≈ ' + (w * 3.156e7).toFixed(0) + ' m/yr', 'tl');
  o += text(sx(4000), 22, '黑 arrow：wind stress；彩 arrow：Ekman transport', 'ts', 'middle');
  return svg(560, 296, o, '8000 km 宽的 basin：25 度 N 吹 trade winds，Ekman transport 往北；40 度 N 吹 westerlies，Ekman transport 往南；两边的水汇进中间，只能以每年约 52 米的速度往下压');
}

// ---------- 第 4 站：coastal upwelling ----------
function upwell() {
  const sx = lin(-200, 0, 50, 400), sz = lin(0, -300, 90, 250);
  let o = '';
  // 海底与海岸
  const bot = [[sx(-200), sz(-300)], [sx(-60), sz(-300)], [sx(0), sz(-40)], [sx(0), sz(0) - 30], [sx(0) + 20, sz(0) - 30], [sx(0) + 20, sz(-300) + 12], [sx(-200), sz(-300) + 12]];
  o += poly(bot, 'wash2') + path(d(bot.slice(0, 5)), 'ink');
  o += path(d([[sx(-200), sz(0)], [sx(0), sz(0)]]), 'ink-b');
  o += text(sx(0) + 10, sz(0) - 38, 'coast', 'ts', 'middle');
  // isotherm：靠岸往上翘
  for (const [z0, lab] of [[-100, '14 °C'], [-160, '12 °C'], [-220, '10 °C']]) {
    const pts = []; for (let x = -200; x <= -4; x += 2) { const z = z0 + (Math.abs(z0) - 6) * Math.exp(x / 35) * 0.9; pts.push([sx(x), sz(z)]); }
    o += path(d(pts), 'mute') + text(sx(-200) - 4, sz(z0) + 4, lab, 'ts', 'end');
  }
  // Ekman layer 往外
  o += arrow(sx(-30), sz(-18), sx(-150), sz(-18), 'ln', 8) + text(sx(-150), sz(-18) + 22, 'Ekman transport 往 offshore', 'tl');
  o += arrow(sx(-20), sz(-160), sx(-20), sz(-40), 'ln', 8) + text(sx(-20) - 8, sz(-110), 'upwelling', 'tl', 'end');
  o += arrow(sx(-150), sz(-250), sx(-70), sz(-250), 'dash', 7) + text(sx(-110), sz(-250) + 18, '下层补回来', 'ts', 'middle');
  // wind：出纸面（往南）
  const wc = [sx(-100), 48];
  o += circle(wc[0], wc[1], 10, 'paper') + circle(wc[0], wc[1], 3, 'ink-f') + text(wc[0] + 18, wc[1] + 5, 'wind 沿岸往南（出纸面）', 'tb');
  o += text(sx(0) + 30, 130, '冷、富含', 'ts') + text(sx(0) + 30, 146, 'nutrient 的水', 'ts') + text(sx(0) + 30, 162, '被带到靠岸', 'ts') + text(sx(0) + 30, 178, '的表面', 'ts');
  o += text(sx(-200), 276, '200 km offshore', 'ts') + text(sx(0), 276, '岸边', 'ts', 'end');
  o += text(280, 18, '北半球 eastern boundary（如 California）的 cross-section，往北看，east 在右', 'ts', 'middle');
  return svg(560, 286, o, '沿岸往南的 wind 让 Ekman transport 指向 offshore，岸边的表面水被带走，下层的冷水上来补，isotherm 在岸边往上翘');
}

// ---------- 第 5 站：Stommel：没有 β 与有 β ----------
function stommel() {
  let o = gyrePanel(30, 40, 240, 160, 0, 0.6) + gyrePanel(300, 40, 240, 160, 25, 0.6);
  o += text(150, 28, 'f 处处相同（β = 0）', 'tb', 'middle') + text(420, 28, 'f 随 latitude 增加（β > 0）', 'tb', 'middle');
  o += text(30, 216, 'west', 'ts') + text(270, 216, 'east', 'ts', 'end') + text(300, 216, 'west', 'ts') + text(540, 216, 'east', 'ts', 'end');
  o += text(150, 238, '东西对称，没有 boundary current', 'tb', 'middle') + text(420, 238, '回流全挤在西边', 'tb', 'middle');
  o += text(285, 262, '同一个 wind（南 trade winds、北 westerlies）、同一个 bottom friction，只差 β', 'ts', 'middle');
  return svg(560, 272, o, '左边 f 不随 latitude 变化时，gyre 东西对称；右边加上 beta 后，streamline 在西边挤成 western boundary current');
}

// ---------- 第 6 站：upwelling 与 mixing 的平衡 ----------
function thc() {
  let o = '';
  // 左：box ocean
  const bx = 30, by = 50, bw = 200, bh = 190;
  o += rect(bx, by, bw, bh, 'frame') + rect(bx, by, bw, 24, 'wash');
  o += arrow(bx + 14, by + 20, bx + 14, by + bh - 14, 'ln', 8) + text(bx + 4, by - 8, 'high latitude：sinking', 'tl');
  o += arrow(bx + 20, by + bh - 10, bx + bw - 14, by + bh - 10, 'ln', 7);
  for (const x of [80, 130, 180]) o += arrow(bx + x - 30, by + bh - 26, bx + x - 30, by + 50, 'ink', 6);
  for (const x of [72, 122, 172]) {
    const pts = []; for (let k = 0; k <= 20; k++) pts.push([bx + x + 4 * Math.sin(k * 1.2), by + 36 + k * 3.2]);
    o += path(d(pts), 'mute');
  }
  o += text(bx + bw / 2, by + bh + 20, '直 arrow：w ≈ 1 cm/day 往上', 'ts', 'middle') + text(bx + bw / 2, by + bh + 36, '弯线：mixing 把热往下传', 'ts', 'middle');
  // 右：T(z) 曲线
  const sx = lin(0, 22, 300, 530), sz = lin(0, -4000, 50, 240);
  o += axes({ sx, sy: sz, x0: 0, x1: 22, y0: -4000, y1: 0, xt: [0, 5, 10, 15, 20], yt: [[0, '0'], [-1000, '1000 m'], [-2000, '2000 m'], [-3000, '3000 m'], [-4000, '4000 m']], xAt: -4000 });
  o += text(sx(22), sz(-4000) + 32, 'temperature（°C）', 'ts', 'end');
  const w = 1e-7, H = 4000, Ts = 20, Tb = 2;
  const prof = (kap) => (z) => { const dl = kap / w; return Tb + (Ts - Tb) * (Math.exp(z / dl) - Math.exp(-H / dl)) / (1 - Math.exp(-H / dl)); };
  const inv = (fn, T0) => { let lo = -4000, hi = 0; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (fn(m) < T0) lo = m; else hi = m; } return lo; };
  const cases = [[1e-5, 'κ = 10⁻⁵：100 m', 'ink', -250, null], [1e-4, 'κ = 10⁻⁴：1000 m', 'ln', -1000, -1700], [3e-4, 'κ = 3×10⁻⁴：3000 m', 'dash', -2300, -2700]];
  for (const [kap, lab, cls, zp, zt] of cases) {
    const fn = prof(kap), pts = [];
    for (let z = 0; z >= -4000; z -= 10) pts.push([sx(fn(z)), sz(z)]);
    o += path(d(pts), cls);
    const p = [sx(fn(zp)), sz(zp)];
    if (zt === null) o += text(p[0] + 8, p[1] + 4, lab, 'ts');
    else o += line(p[0] + 2, p[1] + 2, 428, sz(zt) - 4, 'mute') + text(430, sz(zt) + 4, lab, cls === 'ln' ? 'tl' : 'ts');
  }
  void inv;
  o += text(415, 30, 'w = 10⁻⁷ m/s 时的 T(z)；标注是 κ（m²/s）和 κ/w', 'ts', 'middle');
  return svg(560, 300, o, '左边是一个盒子海洋：high latitude 下沉，其余地方以每天约 1 厘米往上升，mixing 把热往下传；右边是三种 mixing 强度下算出的温度剖面，κ 除以 w 决定 thermocline 的厚度');
}

// ---------- 第 7 站：deep-water wave 的 particle orbit（动图） ----------
function waveA() {
  const L = 156.1, k = (2 * Math.PI) / L, a = 9, T = 4, N = 48; // a 是画图用的夸张振幅（m）
  const sx = lin(0, 1.5 * L, 40, 520), sz = lin(0, -85, 70, 250);
  const kt = []; for (let i = 0; i <= N; i++) kt.push(i / N);
  let o = '';
  const surf = (i) => { const pts = []; for (let x = 0; x <= 1.5 * L; x += 2) pts.push([sx(x), sz(a * Math.cos(k * x - (2 * Math.PI * i) / N))]); return d(pts); };
  o += apath(kt.map((_, i) => surf(i)), kt, T, 'ink-b');
  const depths = [0, -L / 8, -L / 4, -L / 2];
  const labs = ['surface', 'L/8 = 19.5 m：0.46', 'L/4 = 39 m：0.21', 'L/2 = 78 m：0.043'];
  depths.forEach((z, j) => {
    const r = a * Math.exp(k * z);
    for (const x0 of [L * 0.25, L * 0.5, L * 0.75, L, L * 1.25]) {
      o += `<ellipse cx="${f1(sx(x0))}" cy="${f1(sz(z))}" rx="${f1(Math.abs(sx(r) - sx(0)))}" ry="${f1(Math.abs(sz(-r) - sz(0)))}" class="grid"/>`;
      const xs = [], ys = [];
      for (let i = 0; i <= N; i++) { const ph = k * x0 - (2 * Math.PI * i) / N; xs.push(sx(x0 - r * Math.sin(ph))); ys.push(sz(z + r * Math.cos(ph))); }
      o += acircle(xs, ys, kt, T, j === 0 ? 3.5 : 3, 'ln-f');
    }
    if (j > 0) o += text(sx(1.5 * L) - 2, sz(z) - 10, labs[j], 'ts', 'end');
  });
  o += arrow(sx(0.1 * L), 30, sx(0.4 * L), 30, 'ink', 7) + text(sx(0.42 * L), 34, 'crest 往右走，c = 15.6 m/s（T = 10 s，L = 156 m）', 'ts');
  o += text(280, 276, '每个点在自己的 circle 上转；半径按 exp(kz) 衰减，数字是相对 surface 的比例', 'ts', 'middle');
  return svgA(560, 286, o, '动图：deep-water wave 往右传，水面下的 particle 各自在 circle 上转，circle 的半径随深度指数衰减，半个 wavelength 深处只剩表面的 4.3%');
}

// ---------- 第 7 站：tide-generating force ----------
function tideforce() {
  const GM = 4.905e12, Rm = 3.844e8, r = 6.371e6;
  const c = [270, 160], rad = 92, sc = 48 / 1.1e-6;
  let o = '';
  // 夸张的 equilibrium bulge
  const bul = []; for (let t = 0; t <= 360; t += 3) { const P2 = (3 * Math.cos(t * R) ** 2 - 1) / 2; const rr = rad * (1 + 0.16 * P2); bul.push([c[0] + rr * Math.cos(t * R), c[1] - rr * Math.sin(t * R)]); }
  o += path(d(bul) + 'Z', 'wash');
  o += circle(c[0], c[1], rad, 'paper') + circle(c[0], c[1], 3, 'ink-f');
  for (let t = 0; t < 360; t += 22.5) {
    const px = r * Math.cos(t * R), py = r * Math.sin(t * R);
    const dx = Rm - px, dy = -py, dd = Math.hypot(dx, dy);
    const ax = (GM * dx) / dd ** 3 - GM / Rm ** 2, ay = (GM * dy) / dd ** 3;
    const s0 = [c[0] + rad * Math.cos(t * R), c[1] - rad * Math.sin(t * R)];
    o += arrow(s0[0], s0[1], s0[0] + sc * ax, s0[1] - sc * ay, 'ln', 6);
  }
  const near = GM / (Rm - r) ** 2 - GM / Rm ** 2, far = GM / Rm ** 2 - GM / (Rm + r) ** 2, side = (GM * r) / Rm ** 3;
  o += text(c[0] + rad + 58, c[1] - 12, 'near side', 'ts') + text(c[0] + rad + 58, c[1] + 4, (near * 1e6).toFixed(2) + '×10⁻⁶ m/s²', 'tl');
  o += text(c[0] - rad - 58, c[1] - 12, 'far side', 'ts', 'end') + text(c[0] - rad - 58, c[1] + 4, (far * 1e6).toFixed(2) + '×10⁻⁶ m/s²', 'tl', 'end');
  o += text(c[0], c[1] - rad - 34, '两侧：' + (side * 1e6).toFixed(2) + '×10⁻⁶ m/s²，指向 center', 'ts', 'middle');
  o += arrow(470, c[1] + 110, 540, c[1] + 110, 'ink', 7) + text(540, c[1] + 98, 'to Moon（384,400 km）', 'ts', 'end');
  o += text(280, 300, '彩 arrow：Moon 对该点的 gravity 减去对 Earth center 的 gravity。浅色是夸张后的 bulge。', 'ts', 'middle');
  return svg(560, 310, o, 'Earth 表面各点的 tide-generating acceleration：朝向 Moon 的一侧和背向 Moon 的一侧都指向外，两侧指向地心，于是形成两个 bulge');
}

// ---------- 第 7 站：declination 与 diurnal inequality ----------
function decl() {
  const c = [150, 160], rad = 90, dec = 20, lat = 30;
  let o = '';
  const bul = []; for (let t = 0; t <= 360; t += 3) { const P2 = (3 * Math.cos((t - dec) * R) ** 2 - 1) / 2; const rr = rad * (1 + 0.16 * P2); bul.push([c[0] + rr * Math.cos(t * R), c[1] - rr * Math.sin(t * R)]); }
  o += path(d(bul) + 'Z', 'wash') + circle(c[0], c[1], rad, 'paper');
  o += line(c[0], c[1] + rad + 14, c[0], c[1] - rad - 14, 'mute') + text(c[0] + 4, c[1] - rad - 18, 'rotation axis', 'ts', 'middle');
  o += line(c[0] - rad, c[1], c[0] + rad, c[1], 'grid');
  const md = [Math.cos(dec * R), -Math.sin(dec * R)];
  o += arrow(c[0], c[1], c[0] + 130 * md[0], c[1] + 130 * md[1], 'dash', 7) + text(c[0] + 132 * md[0] + 2, c[1] + 132 * md[1] - 4, 'Moon', 'ts');
  const yl = c[1] - rad * Math.sin(lat * R), xl = rad * Math.cos(lat * R);
  o += line(c[0] - xl, yl, c[0] + xl, yl, 'ln');
  o += circle(c[0] + xl, yl, 4.5, 'ln-f') + circle(c[0] - xl, yl, 4.5, 'ln-f');
  o += text(c[0] + xl + 6, yl - 6, 'A', 'tl') + text(c[0] - xl - 6, yl - 6, 'B', 'tl', 'end');
  o += text(c[0], c[1] + rad + 34, '30°N 的人一天里从 A 转到 B 再转回来', 'ts', 'middle');
  // 右：一天里的 equilibrium tide
  const ld = 24.84, sx = lin(0, ld, 330, 540), sy = lin(-0.6, 1.05, 220, 60);
  const P2t = (h) => { const H = (2 * Math.PI * h) / ld; const ct = Math.cos(lat * R) * Math.cos(dec * R) * Math.cos(H) + Math.sin(lat * R) * Math.sin(dec * R); return (3 * ct * ct - 1) / 2; };
  o += axes({ sx, sy, x0: 0, x1: ld, y0: -0.6, y1: 1.05, xt: [[0, '0'], [ld / 2, '12.42'], [ld, '24.84 h']], yt: [], xAt: -0.6 });
  o += line(sx(0), sy(0), sx(ld), sy(0), 'grid');
  o += path(curve(P2t, 0, ld, sx, sy), 'ln');
  o += text(sx(0) + 4, sy(P2t(0)) - 8, 'A：' + P2t(0).toFixed(2), 'tl') + text(sx(ld / 2), sy(P2t(ld / 2)) - 8, 'B：' + P2t(ld / 2).toFixed(2), 'tl', 'middle');
  o += text(435, 40, '那个人看到的 equilibrium tide', 'tb', 'middle') + text(435, 268, '纵轴 ∝ (3cos²θ − 1)/2，θ 是和 Moon 方向的夹角', 'ts', 'middle');
  return svg(560, 290, o, 'Moon 的 declination 为 20 度时 bulge 是斜的；30 度 N 的人一天两次经过 bulge，A 处高 0.95，B 处只有 0.12，两次高潮高低不同');
}

// ---------- 第 7 站：spring 与 neap ----------
function springneap() {
  const aM = 0.242, aS = 0.113, D = 30;
  const sx = lin(0, D, 50, 530), sy = lin(-0.45, 0.5, 236, 50);
  let o = axes({ sx, sy, x0: 0, x1: D, y0: -0.45, y1: 0.5, xt: [0, 5, 10, 15, 20, 25, [30, '30 天']], yt: [[-0.3, '−0.3'], [0, '0'], [0.3, '0.3']], xAt: -0.45 });
  o += text(20, 34, 'η（m，equilibrium tide 的振幅）', 'ts');
  const wM = (2 * Math.PI) / (12.4206 / 24), wS = 2 * Math.PI * 2;
  o += path(curve((t) => aM * Math.cos(wM * t) + aS * Math.cos(wS * t), 0, D, sx, sy, 2400), 'ln');
  const env = (t) => Math.sqrt(aM * aM + aS * aS + 2 * aM * aS * Math.cos((wS - wM) * t));
  o += path(curve(env, 0, D, sx, sy), 'dash') + path(curve((t) => -env(t), 0, D, sx, sy), 'dash');
  const Tsn = (2 * Math.PI) / (wS - wM);
  o += text(sx(Tsn) + 8, sy(aM + aS) - 6, 'spring：' + (aM + aS).toFixed(3), 'tl');
  o += text(sx(Tsn / 2), sy(-(aM - aS)) + 22, 'neap：' + (aM - aS).toFixed(3), 'tl', 'middle');
  const yb = sy(0.45);
  o += line(sx(0), yb, sx(Tsn), yb, 'mute') + line(sx(0), yb - 5, sx(0), yb + 5, 'mute') + line(sx(Tsn), yb - 5, sx(Tsn), yb + 5, 'mute');
  o += text(sx(Tsn / 2), yb - 6, Tsn.toFixed(2) + ' 天', 'ts', 'middle');
  o += text(290, 272, 'M₂（12.42 h，0.242）加 S₂（12.00 h，0.113）。Sun、Moon 对齐（new / full moon）时', 'ts', 'middle');
  o += text(290, 288, '两者同相相加，成直角（quarter moon）时反相相减。', 'ts', 'middle');
  return svg(560, 296, o, '两个周期相近的 constituent 相加：每 14.77 天振幅在 0.355 和 0.129 之间来回，这就是 spring tide 与 neap tide');
}

// ---------- 第 8 站：equatorial Kelvin wave 穿过 Pacific（动图） ----------
function kelvinA() {
  const L = 15000, c = 2.1, hW = 216, hE = 50, x0 = 2000, amp = 45, wid = 1100;
  const arrive = ((L - x0) * 1e3) / c / 86400; // 天
  const Dtot = 100, T = 7, N = 100;
  const sx = lin(0, L, 50, 520), sz = lin(0, -300, 80, 250);
  const kt = [], days = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); days.push((Dtot * i) / N); }
  const h = (x, day) => {
    const xc = x0 + (c * day * 86400) / 1e3;
    const base = hW + ((hE - hW) * x) / L;
    let bump;
    if (xc < L) bump = amp * Math.exp(-(((x - xc) / wid) ** 2));
    else bump = amp * Math.exp(-(((x - L) / (wid * 1.6)) ** 2));
    return base + bump;
  };
  const shape = (day) => { const pts = [[sx(0), sz(0)]]; for (let x = 0; x <= L; x += 150) pts.push([sx(x), sz(-h(x, day))]); pts.push([sx(L), sz(0)]); return d(pts) + 'Z'; };
  const tline = (day) => { const pts = []; for (let x = 0; x <= L; x += 150) pts.push([sx(x), sz(-h(x, day))]); return d(pts); };
  let o = rect(sx(0), sz(0), sx(L) - sx(0), sz(-300) - sz(0), 'wash2');
  o += apath(days.map(shape), kt, T, 'wash-strong');
  o += apath(days.map(tline), kt, T, 'ln');
  o += path(d([[sx(0), sz(0)], [sx(L), sz(0)]]), 'ink-b');
  o += text(sx(0), sz(-300) + 18, 'west：warm pool（约 130°E）', 'ts') + text(sx(L), sz(-300) + 18, 'east：South America', 'ts', 'end');
  o += text(sx(0) - 6, sz(0) + 4, '0', 'ts', 'end') + text(sx(0) - 6, sz(-150) + 4, '150 m', 'ts', 'end') + text(sx(0) - 6, sz(-300) + 4, '300 m', 'ts', 'end');
  o += text(sx(L * 0.62), sz(-140), 'thermocline', 'tl');
  o += text(sx(L * 0.12), sz(-60), 'warm upper layer', 'ts');
  // westerly wind burst
  o += `<g>${arrow(sx(800), 58, sx(3400), 58, 'ink-b', 8)}${text(sx(800), 48, 'westerly wind burst', 'tb')}${ashow(days.map((dd) => dd < 6), kt, T)}</g>`;
  const marks = [0, 20, 40, 60, Math.round(arrive), 90, 1e9];
  for (let m = 0; m < marks.length - 1; m++) {
    const on = days.map((x) => x >= marks[m] && x < marks[m + 1]);
    on[N] = m === marks.length - 2;
    o += `<text x="${sx(L)}" y="30" class="tl" text-anchor="end">第 ${marks[m]} 天${ashow(on, kt, T)}</text>`;
  }
  o += text(sx(0), 30, 'Kelvin wave 以 c = √(g′H) = 2.1 m/s 往东走', 'ts');
  o += text(285, 290, '从 2000 km 处出发，走 13,000 km 到东边要 ' + arrive.toFixed(0) + ' 天；东边的 thermocline 被压深，cold upwelling 断了来源', 'ts', 'middle');
  return svgA(560, 300, o, '动图：西太平洋一阵 westerly wind burst 把 thermocline 压下去一块，这块 depression 以每秒 2.1 米往东走，约 72 天到达南美，把东边原本很浅的 thermocline 压深');
}

export default {
  'sio-210-nansen': nansen,
  'sio-210-wbc': wbc,
  'sio-210-ts': ts,
  'sio-210-rot': rotA,
  'sio-210-adjust': adjustA,
  'sio-210-gulf': gulf,
  'sio-210-ekman': ekmanA,
  'sio-210-pump': pump,
  'sio-210-upwell': upwell,
  'sio-210-stommel': stommel,
  'sio-210-thc': thc,
  'sio-210-wave': waveA,
  'sio-210-tideforce': tideforce,
  'sio-210-decl': decl,
  'sio-210-springneap': springneap,
  'sio-210-kelvin': kelvinA,
};
