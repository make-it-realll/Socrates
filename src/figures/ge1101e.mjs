import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, anim, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;
// 近 3.58 Ma 的 normal polarity 区间（Ma），其余为 reversed。年代取通行的 geomagnetic polarity timescale 的近似值。
const NORMAL = [[0, 0.78], [0.99, 1.07], [1.78, 1.95], [2.58, 3.04], [3.11, 3.22], [3.33, 3.58]];
const AMAX = 3.58;
const isNormal = (a) => NORMAL.some(([x, y]) => a >= x && a < y);

// 给一组 [t_on, t_off]（0..1）窗口生成 discrete opacity 动画
function showWin(wins, dur) {
  const kt = [0], v = [0];
  for (const [a, b] of wins) { if (a <= 0) v[0] = 1; else { kt.push(a); v.push(1); } if (b < 1) { kt.push(b); v.push(0); } }
  return anim('opacity', v, kt, dur, true);
}
const rectD = (x1, y1, x2, y2) => `M${f1(x1)} ${f1(y1)}H${f1(x2)}V${f1(y2)}H${f1(x1)}Z`;

// ---------- 第 1 站：海底扩张，磁条带从 ridge 两侧对称长出来 ----------
function spreadA() {
  const v = 9; // half spreading rate，km/Myr（= mm/yr）
  const X0 = 280, W = 250, sc = W / (AMAX * v);
  const yb0 = 166, yb1 = 236;
  const N = 60, hold = 2.2, play = 9, T = hold + play + 1.8;
  const taus = [0, 0]; const kt = [0, hold / T];
  for (let i = 0; i <= N; i++) { taus.push(AMAX * (1 - i / N)); kt.push((hold + 0.02 + (play * i) / N) / T); }
  taus.push(0); kt.push(1);
  const side = (s, a1, a2, tau) => {
    // crust 形成于 a（Ma 前），在 tau 时刻离 ridge (a − tau)·v
    const lo = Math.max(a1, tau), hi = Math.max(a2, tau);
    const x1 = X0 + s * Math.min((lo - tau) * v * sc, W), x2 = X0 + s * Math.min((hi - tau) * v * sc, W);
    return rectD(Math.min(x1, x2), yb0, Math.max(x1, x2), yb1);
  };
  let o = '';
  // 截面：两块 plate 从 ridge 向两侧移开
  const ys = (x) => 92 + 0.0009 * (x - X0) ** 2 * 0.25;
  const top = []; for (let x = 30; x <= 530; x += 10) top.push([x, Math.min(ys(x), 112)]);
  o += path(d(top), 'ink-b');
  o += path(d([[X0 - 10, 132], [X0, 96], [X0 + 10, 132]]), 'mute');
  o += arrow(X0, 136, X0, 104, 'ln') + text(X0 + 8, 132, 'magma 上升、冷却', 'ts', 'start');
  o += arrow(X0 - 40, 80, X0 - 120, 80, 'ink') + text(X0 - 80, 72, '9 mm/yr', 'ts', 'middle');
  o += arrow(X0 + 40, 80, X0 + 120, 80, 'ink') + text(X0 + 80, 72, '9 mm/yr', 'ts', 'middle');
  o += text(X0, 22, 'mid-ocean ridge', 'tb', 'middle') + text(40, 130, 'plate', 'ts', 'start') + text(520, 130, 'plate', 'ts', 'end');
  // map view 的条带
  o += text(30, yb0 - 8, 'map view（从上往下看 seafloor）', 'ts', 'start');
  o += apath(taus.map((t) => side(-1, AMAX, 99, t) + side(1, AMAX, 99, t)), kt, T, 'wash2');
  o += apath(taus.map((t) => side(-1, 0, AMAX, t) + side(1, 0, AMAX, t)), kt, T, 'wash');
  for (const [a1, a2] of NORMAL) o += apath(taus.map((t) => side(-1, a1, a2, t) + side(1, a1, a2, t)), kt, T, 'solid');
  o += line(X0, yb0 - 4, X0, yb1 + 4, 'ink-b');
  o += rect(X0 - W, yb0, 2 * W, yb1 - yb0, 'frame');
  // 距离刻度（只对应 present）
  for (const km of [-30, -20, -10, 0, 10, 20, 30]) o += line(X0 + km * sc, yb1, X0 + km * sc, yb1 + 5, 'axis') + text(X0 + km * sc, yb1 + 18, Math.abs(km) + ' km', 'ts', 'middle');
  // 时钟与 ridge 处的 polarity
  const tAt = (tau) => (hold + 0.02 + (play * (1 - tau / AMAX))) / T;
  const clock = [];
  for (let k = 0; k <= 17; k++) {
    const tau = AMAX - k * 0.2; if (tau < 0.05) break;
    const a = tAt(tau), b = tAt(Math.max(tau - 0.2, 0));
    clock.push(`<text x="530" y="22" class="ts" text-anchor="end" opacity="0">${tau.toFixed(1)} Ma 前${showWin([[a, b]], T)}</text>`);
  }
  o += clock.join('');
  o += `<text x="530" y="22" class="tl" text-anchor="end">现在${showWin([[0, hold / T], [tAt(0.0001), 1]], T)}</text>`;
  // ridge 处正在记录的 polarity
  let cur = isNormal(AMAX - 1e-6), start = 0;
  const wN = [], wR = [];
  for (let i = 0; i <= 400; i++) {
    const tau = AMAX * (1 - i / 400), n = isNormal(tau - 1e-9);
    if (n !== cur || i === 400) { (cur ? wN : wR).push([tAt(AMAX * (1 - start / 400)), tAt(tau)]); cur = n; start = i; }
  }
  o += `<text x="530" y="${yb0 - 8}" class="tl" text-anchor="end" opacity="0">ridge 此刻记录：normal${showWin(wN, T)}</text>`;
  o += `<text x="530" y="${yb0 - 8}" class="tb" text-anchor="end" opacity="0">ridge 此刻记录：reversed${showWin(wR, T)}</text>`;
  o += text(X0, yb1 + 40, '深色 normal，浅色 reversed，灰色是 3.58 Ma 以前形成的 crust', 'ts', 'middle');
  return svgA(560, 284, o, '动图：mid-ocean ridge 两侧的 plate 以每年 9 mm 向外移开，新 crust 在 ridge 处记录当时的磁场方向，形成关于 ridge 对称的 normal 与 reversed 条带');
}

// ---------- 第 1 站：同一套 barcode，两条 ridge 上的 km 刻度不同 ----------
function barcode() {
  const x0 = 120, x1 = 530, sa = lin(0, AMAX, x0, x1);
  let o = text(x0, 20, 'crust 形成时的 age（Ma）', 'ts', 'start');
  for (const a of [0, 0.78, 1, 2, 3, 3.58]) o += line(sa(a), 30, sa(a), 36, 'axis') + text(sa(a), 50, a === 0.78 ? '0.78' : String(a), 'ts', 'middle');
  o += line(x0, 36, x1, 36, 'axis');
  const strip = (y, v, name, rate, ticks) => {
    let q = rect(x0, y, x1 - x0, 34, 'wash');
    for (const [a1, a2] of NORMAL) q += rect(sa(a1), y, sa(a2) - sa(a1), 34, 'solid');
    q += rect(x0, y, x1 - x0, 34, 'frame');
    q += text(x0 - 10, y + 15, name, 'tb', 'end') + text(x0 - 10, y + 31, rate, 'ts', 'end');
    for (const km of ticks) { const x = sa(km / v); q += line(x, y + 34, x, y + 40, 'axis') + text(x, y + 53, km + ' km', 'ts', 'middle'); }
    const xb = sa(0.78);
    q += line(xb, y - 6, xb, y + 40, 'ink') + text(xb + 4, y - 9, (0.78 * v).toFixed(1) + ' km', 'tl', 'start');
    return q;
  };
  o += strip(80, 9, 'Mid-Atlantic', 'half rate 9 mm/yr', [0, 10, 20, 30]);
  o += strip(175, 75, 'East Pacific Rise', 'half rate 75 mm/yr', [0, 50, 100, 150, 200, 250]);
  o += text(280, 262, '两条 strip 按年代对齐：stripe 的先后顺序和宽窄比例完全相同，只是 km 刻度差了 75 / 9 ≈ 8.3 倍', 'ts', 'middle');
  return svg(560, 272, o, 'Mid-Atlantic Ridge 和 East Pacific Rise 一侧的磁条带按形成年代对齐后完全相同，0.78 Ma 的边界分别在 7.0 km 和 58.5 km');
}

// ---------- 第 1 站：subduction 截面，1:1 比例 ----------
function slabTop() {
  // slab 上表面：海底深 6 km，x = −40 起以 radius 150 km 弯下去，转到 30° 后直线下插
  const pts = [];
  for (let x = -130; x <= -40; x += 10) pts.push([x, 6]);
  const Rb = 150;
  for (let k = 1; k <= 12; k++) { const th = (30 * R * k) / 12; pts.push([-40 + Rb * Math.sin(th), 6 + Rb * (1 - Math.cos(th))]); }
  const [xe, ze] = pts[pts.length - 1];
  for (let s = 20; s <= 520; s += 20) pts.push([xe + s * Math.cos(30 * R), ze + s * Math.sin(30 * R)]);
  return pts;
}
function subductA() {
  const sx = lin(-130, 440, 62, 545), sy = lin(-12, 255, 40, 286);
  const P = ([x, z]) => [sx(x), sy(z)];
  const top = slabTop();
  // 沿 normal 偏移出 slab 下表面（厚 70 km）
  const off = (pts, h) => pts.map((p, i) => {
    const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, pts.length - 1)];
    const tx = b[0] - a[0], tz = b[1] - a[1], L = Math.hypot(tx, tz);
    return [p[0] - (tz / L) * h, p[1] + (tx / L) * h];
  });
  const bot = off(top, 70);
  const clipZ = (pts) => pts.filter(([x, z]) => x <= 440 && z <= 255);
  const T1 = clipZ(top), B1 = clipZ(bot);
  let o = rect(sx(-130), sy(0), sx(440) - sx(-130), sy(255) - sy(0), 'wash2');
  o += path(d([...T1.map(P), ...B1.slice().reverse().map(P)]) + 'Z', 'wash-strong');
  // overriding plate：continental lithosphere，厚约 40 km，从 trench 往右
  const zTop = (x) => { for (let i = 1; i < top.length; i++) if (top[i][0] >= x) { const [a, b] = [top[i - 1], top[i]]; return a[1] + ((x - a[0]) * (b[1] - a[1])) / (b[0] - a[0]); } return 999; };
  const cont = []; for (let x = 0; x <= 440; x += 10) cont.push([x, Math.min(40, zTop(x))]);
  o += path(d([[0, 0], [440, 0], ...cont.slice().reverse()].map(P)) + 'Z', 'paper');
  o += line(sx(-130), sy(6), sx(-40), sy(6), 'ink');
  o += line(sx(-130), sy(0), sx(0), sy(0), 'mute');
  // 弧火山：slab top 在 100 km 深处的正上方
  let xa = 0; for (let x = 0; x < 440; x += 0.5) if (zTop(x) >= 100) { xa = x; break; }
  o += poly([[sx(xa) - 16, sy(0)], [sx(xa), sy(0) - 18], [sx(xa) + 16, sy(0)]], 'solid2');
  o += line(sx(xa), sy(4), sx(xa), sy(96), 'ln-dash');
  o += text(sx(xa), sy(0) - 24, 'volcanic arc', 'tb', 'middle');
  o += text(sx(xa) + 8, sy(70), 'melt 从 slab 上方升起', 'ts', 'start');
  o += text(sx(xa) + 8, sy(100) + 4, 'slab top 深 100 km，离 trench ' + Math.round(xa) + ' km', 'ts', 'start');
  // trench
  o += text(sx(0), sy(0) - 24, 'trench', 'tb', 'middle') + line(sx(0), sy(0) - 18, sx(0), sy(3), 'mute');
  o += text(sx(-52), sy(36), 'oceanic lithosphere', 'tw', 'middle') + text(sx(-52), sy(36) + 16, '老、冷、密', 'tw', 'middle');
  o += text(sx(320), sy(22) + 4, 'continental lithosphere', 'ts', 'middle');
  o += text(sx(-120), sy(150), 'asthenosphere', 'ts', 'start');
  // depth 刻度
  for (const z of [0, 100, 200]) o += line(sx(-130) - 4, sy(z), sx(-130), sy(z), 'axis') + text(sx(-130) - 6, sy(z) + 4, z + ' km', 'ts', 'end');
  // 沿 slab 移动的 marker：间隔 40 km，一个周期走 40 km，循环无缝
  const cum = [0]; for (let i = 1; i < top.length; i++) cum.push(cum[i - 1] + Math.hypot(top[i][0] - top[i - 1][0], top[i][1] - top[i - 1][1]));
  const at = (s) => { for (let i = 1; i < top.length; i++) if (cum[i] >= s) { const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1]); return [top[i - 1][0] + f * (top[i][0] - top[i - 1][0]), top[i - 1][1] + f * (top[i][1] - top[i - 1][1])]; } return top[top.length - 1]; };
  const Tm = 4, NK = 20, kt = Array.from({ length: NK + 1 }, (_, i) => i / NK);
  const inner = off(top, 6);
  const atI = (s) => { const p = at(s); const i = cum.findIndex((c) => c >= s); const q = inner[Math.max(i, 0)]; const p0 = top[Math.max(i, 0)]; return [p[0] + (q[0] - p0[0]), p[1] + (q[1] - p0[1])]; };
  for (let s0 = 0; s0 < 560; s0 += 40) {
    const pts = kt.map((k) => atI(s0 + 40 * k));
    if (pts[0][0] > 440 || pts[0][1] > 250) continue;
    o += acircle(pts.map((p) => sx(p[0])), pts.map((p) => sy(p[1])), kt, Tm, 3.2, 'ink-f');
  }
  // Wadati–Benioff zone：震源沿 slab 越来越深
  const quakes = [12, 30, 55, 80, 110, 145, 185, 225];
  quakes.forEach((z, i) => {
    let x = 0; for (let xx = -40; xx < 440; xx += 0.5) if (zTop(xx) >= z) { x = xx; break; }
    const c = [sx(x) + 6, sy(z) + 10];
    const a = i / quakes.length, b = (i + 1.6) / quakes.length;
    o += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="5" class="ln-f">${showWin([[a, Math.min(b, 1)]], 6)}</circle>`;
    o += circle(c[0], c[1], 2, 'ink-f');
  });
  o += text(sx(-120), sy(205), '彩色的点：earthquake focus，', 'ts', 'start') + text(sx(-120), sy(205) + 16, '越往右越深（Wadati–Benioff zone）', 'ts', 'start');
  o += text(280, 300, '横竖比例 1:1，没有夸大。黑点是 slab 上的记号，随 plate 一起下插', 'ts', 'middle');
  return svgA(560, 306, o, '动图：oceanic plate 在 trench 处弯下，以 30 度插入 mantle；地震震源沿 slab 越来越深；slab 上表面到 100 km 深处的正上方是 volcanic arc');
}

// ---------- 第 1 站：Airy isostasy，三根 column 按比例 ----------
function isostasy() {
  const k = 3.4, y = (z) => 34 + (6.5 - z) * k; // z：km，向上为正
  const rc = 2.8, rm = 3.3, ro = 2.9, rw = 1.03;
  const Hc = 35, e = 0.8, D = Hc - e; // 普通 continent 的 crust 底
  const w = (ro * 7 + rm * (D - 7) - rc * Hc) / (rm - rw);
  const h = 5, root = (h * rc) / (rm - rc), Dc = D + root;
  let o = '';
  const blk = (x0, x1, z0, z1, cls) => rect(x0, y(z0), x1 - x0, y(z1) - y(z0), cls);
  // ocean
  o += blk(60, 210, 0, -w, 'wash') + blk(60, 210, -w, -w - 7, 'solid2') + blk(60, 210, -w - 7, -Dc, 'wash2');
  // continent
  o += blk(210, 350, e, -D, 'wash-strong') + blk(210, 350, -D, -Dc, 'wash2');
  // mountain
  o += blk(350, 480, e + h, -Dc, 'wash-strong');
  o += line(40, y(0), 520, y(0), 'mute') + text(44, y(0) - 5, 'sea level', 'ts', 'start');
  o += line(40, y(-Dc), 520, y(-Dc), 'ink-b');
  o += text(500, y(-Dc) - 6, 'compensation depth ' + Dc.toFixed(1) + ' km', 'ts', 'end');
  // 标注
  o += text(135, y(-w / 2) + 4, 'water ' + w.toFixed(2) + ' km', 'ts', 'middle');
  o += text(135, y(-w - 3.5) + 4, 'oceanic crust 7 km', 'tw', 'middle');
  o += text(135, y(-35) + 4, 'mantle 3.3', 'ts', 'middle');
  o += text(280, y(-15) + 4, 'continental crust', 'ts', 'middle') + text(280, y(-15) + 20, '35 km，2.8', 'ts', 'middle');
  o += text(280, y(-48) + 4, 'mantle', 'ts', 'middle');
  o += text(415, y(-15) + 4, 'mountain crust', 'ts', 'middle') + text(415, y(-15) + 20, (Hc + h + root).toFixed(0) + ' km', 'ts', 'middle');
  o += text(415, y(-D - root / 2) + 4, 'root ' + root.toFixed(0) + ' km', 'tb', 'middle');
  o += line(350, y(-D), 480, y(-D), 'dash');
  o += text(415, y(e + h) - 6, '+' + (e + h).toFixed(1) + ' km', 'ts', 'middle') + text(280, y(e) - 6, '+0.8 km', 'ts', 'middle');
  const mass = (s) => s.toFixed(1);
  const mO = rw * w + ro * 7 + rm * (Dc - w - 7), mC = rc * Hc + rm * root, mM = rc * (Hc + h + root);
  o += text(135, y(-Dc) + 20, '上方 mass ' + mass(mO), 'ts', 'middle') + text(280, y(-Dc) + 20, '上方 mass ' + mass(mC), 'ts', 'middle') + text(415, y(-Dc) + 20, '上方 mass ' + mass(mM), 'ts', 'middle');
  o += text(280, y(-Dc) + 40, '单位 10⁶ kg/m²（density 用 g/cm³，厚度用 km）：三根 column 在 compensation depth 上一样重', 'ts', 'middle');
  return svg(560, y(-Dc) + 50, o, 'Airy isostasy：ocean、普通 continent、高 5 km 的 mountain 三根 column，按比例画出；它们在 62.2 km 深处单位面积上方的质量都是 190.4');
}

// ---------- 第 2 站：rock cycle，一颗 grain 在截面里走一圈 ----------
function rockA() {
  let o = '';
  // 地形：左边山（granite），右边海
  const ground = [[20, 150], [70, 120], [120, 70], [160, 60], [200, 90], [250, 130], [300, 150], [350, 158], [380, 162]];
  const sea = 162;
  o += path(d([...ground, [380, 300], [20, 300]]) + 'Z', 'wash2');
  o += path(d(ground), 'ink');
  o += rect(380, sea, 160, 138, 'wash2');
  o += rect(380, sea - 22, 160, 22, 'wash') + line(380, sea - 22, 540, sea - 22, 'mute');
  o += text(534, sea - 6, 'ocean', 'ts', 'end');
  for (let i = 0; i < 3; i++) o += rect(380, sea + i * 14, 160, 12, i % 2 ? 'wash-strong' : 'wash');
  o += text(534, sea + 56, 'sedimentary rock', 'ts', 'end');
  o += path('M300 250 Q 420 228 540 246 L540 282 Q 420 266 300 288 Z', 'band-n');
  o += text(534, 272, 'metamorphic', 'tw', 'end');
  o += path('M70 262 Q 110 232 160 244 Q 200 256 184 286 Q 124 300 70 286 Z', 'solid');
  o += text(126, 274, 'magma', 'tw', 'middle');
  o += path('M110 160 Q 150 140 190 165 L 190 200 Q 150 215 110 200 Z', 'band-p');
  o += text(150, 210, 'granite', 'tb', 'middle');
  const route = [[150, 182], [150, 120], [160, 64], [205, 96], [255, 134], [310, 150], [360, 158], [410, 168], [450, 180], [462, 210], [452, 256], [360, 266], [250, 266], [190, 270], [140, 262], [118, 230], [140, 200], [150, 182]];
  o += path(d(route), 'ln-dash');
  // 步骤：[route 下标, 文字, 路线上标号的位置]
  const stops = [
    [0, 'magma 冷却、crystallize：igneous rock', [132, 176]],
    [2, 'uplift、exhumation，weathering', [166, 52]],
    [4, 'erosion，river transport', [262, 124]],
    [8, 'deposition、burial、lithification', [470, 176]],
    [10, '更深处：metamorphism', [470, 248]],
    [13, 'melting，再次变成 magma', [204, 282]],
  ];
  const cum = [0]; for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]));
  const L = cum[cum.length - 1], T = 10, kt = cum.map((c) => c / L);
  stops.forEach(([i, s, [nx, ny]], j) => {
    const a = kt[i], b = j + 1 < stops.length ? kt[stops[j + 1][0]] : 1;
    const y = 50 + j * 17;
    o += circle(nx, ny, 8, 'paper') + text(nx, ny + 4, String(j + 1), 'ts', 'middle');
    o += `<text x="316" y="${y}" class="ts" text-anchor="start" opacity="${j === 0 ? 0 : 1}">${j + 1}. ${s}${showWin([[0, a], [b, 1]].filter(([p, q]) => q > p), T)}</text>`;
    o += `<text x="316" y="${y}" class="tl" text-anchor="start" opacity="${j === 0 ? 1 : 0}">${j + 1}. ${s}${showWin([[a, b]], T)}</text>`;
  });
  o += acircle(route.map((p) => p[0]), route.map((p) => p[1]), kt, T, 6, 'ink-f');
  o += text(20, 22, '一颗 mineral grain 的一圈：每一段都要 10⁶ 到 10⁸ 年', 'tb', 'start');
  return svgA(560, 306, o, '动图：一颗 mineral grain 从 granite 里出发，经 uplift、weathering、river 搬运、海底沉积、burial、metamorphism、melting，再随 magma 回到 granite');
}

// ---------- 第 2 站：meander 越弯越厉害，直到 cutoff ----------
// sine-generated curve：方向角 θ(s) = ω sin(2πs/λ)
function sineCurve(om, lam, n, step = 2) {
  const pts = [[0, 0]]; let x = 0, y = 0;
  const S = lam * n;
  for (let s = step; s <= S + 1e-9; s += step) { const th = om * Math.cos((2 * Math.PI * (s - step / 2)) / lam); x += step * Math.cos(th); y += step * Math.sin(th); pts.push([x, y]); }
  return pts;
}
function J0(x) { let s = 0, t = 1; for (let k = 0; k < 30; k++) { if (k) t *= -((x / 2) ** 2) / (k * k); s += t; } return s; }
function meanderA() {
  const lam = 260, n = 2, width = 9; // lam：一个 wavelength 的河道长度（任意单位）；width：画出来的 channel 宽（px）
  const fit = (pts) => {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    return { L: Math.max(...xs) - Math.min(...xs), H: Math.max(...ys) - Math.min(...ys), cx: (Math.max(...xs) + Math.min(...xs)) / 2, cy: (Math.max(...ys) + Math.min(...ys)) / 2 };
  };
  // valley 长度固定：每一帧按 valley 长度缩放，channel 变长、弯变高
  let VAL = 440;
  const scl = (f) => VAL / f.L;
  const minGapPx = (om) => {
    const p = sineCurve(om, lam, n, 2), f = fit(p), k = scl(f); let m = 1e9, at = null;
    for (let i = 0; i < p.length; i++) for (let j = i + 20; j < p.length; j++) { if ((j - i) * 2 >= lam) break; const g = Math.hypot(p[i][0] - p[j][0], p[i][1] - p[j][1]) * k; if (g < m) { m = g; at = [i * 2, j * 2]; } }
    return [m, at];
  };
  // 先找 cutoff 的 ω（两段 channel 中心线距离小于 1.6 个 channel 宽），再按那一帧的高度定 VAL
  let omc = 1.5;
  for (let it = 0; it < 2; it++) {
    for (let om = 1.5; om < 2.6; om += 0.01) { if (minGapPx(om)[0] < width * 1.6) { omc = om; break; } }
    const fc0 = fit(sineCurve(omc, lam, n, 2));
    VAL = Math.min(440, (180 * fc0.L) / fc0.H);
  }
  const oms = []; for (let k = 0; k <= 16; k++) oms.push(0.4 + ((omc - 0.4) * k) / 16);
  const X = (p, f) => [280 + (p[0] - f.cx) * scl(f), 124 + (p[1] - f.cy) * scl(f)];
  const stripD = (pts, f) => {
    const L = [], Rr = [], w2 = width / 2 / scl(f);
    pts.forEach((p, i) => { const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, pts.length - 1)]; const tx = b[0] - a[0], ty = b[1] - a[1], m = Math.hypot(tx, ty); L.push(X([p[0] - (ty / m) * w2, p[1] + (tx / m) * w2], f)); Rr.push(X([p[0] + (ty / m) * w2, p[1] - (tx / m) * w2], f)); });
    return d([...L, ...Rr.reverse()]) + 'Z';
  };
  const frames = oms.map((om) => { const p = sineCurve(om, lam, n, 4); return stripD(p, fit(p)); });
  // cutoff：在最弯那一帧里找第一个 neck，河道走 neck 的直线，被截掉的 loop 留成 oxbow
  const pc = sineCurve(omc, lam, n, 4), fc = fit(pc);
  let best = 1e9, i0 = 0, j0 = 0;
  for (let i = 0; i < pc.length; i++) for (let j = i + 10; j < pc.length; j++) { if ((j - i) * 4 >= lam) break; const g = Math.hypot(pc[i][0] - pc[j][0], pc[i][1] - pc[j][1]); if (g < best - 1e-9) { best = g; i0 = i; j0 = j; } }
  const cutPts = [...pc.slice(0, i0 + 1), ...pc.slice(j0)];
  const oxbow = pc.slice(i0 + 2, j0 - 1);
  const resample = (pts, m) => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const out = []; for (let k = 0; k < m; k++) { const s = (c[c.length - 1] * k) / (m - 1); let i = c.findIndex((v) => v >= s); if (i <= 0) i = 1; const f = (s - c[i - 1]) / (c[i] - c[i - 1] || 1); out.push([pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])]); } return out; };
  const NP = sineCurve(0.4, lam, n, 4).length;
  const cutFrame = stripD(resample(cutPts, NP), fc);
  const i1 = 8; // 第一帧（静态）用中等弯曲的那一帧，方便标注
  let o = '';
  o += line(30, 124, 530, 124, 'grid') + text(530, 116, 'valley axis', 'ts', 'end');
  // 动画：先从 i1 帧长到 cutoff，再回到 ω=0.4 重长到 i1
  const seqF = [...frames.slice(i1), cutFrame, cutFrame, ...frames.slice(0, i1 + 1)];
  const seqK = []; const dt = 0.32;
  let t = 0; for (let k = i1; k <= 16; k++) { seqK.push(t); t += dt; }
  t += 0.25; seqK.push(t - 0.25 + 0.02); seqK.push(t + 1.6); t += 1.6 + 0.02;
  for (let k = 0; k <= i1; k++) { seqK.push(t); t += dt; }
  const Ttot = seqK[seqK.length - 1];
  const ktN = seqK.map((v) => v / Ttot);
  o += apath(seqF, ktN, Ttot, 'wash-strong ink-s', false);
  // oxbow：只在 cutoff 之后出现
  const oxD = d(oxbow.map((p) => X(p, fc))) + 'Z';
  const tc = seqK[16 - i1 + 1] / Ttot, tc2 = seqK[16 - i1 + 2] / Ttot;
  o += `<path d="${oxD}" class="wash ink-s" opacity="0">${showWin([[tc, tc2]], Ttot)}</path>`;
  const oxc = X(oxbow[Math.floor(oxbow.length / 2)], fc);
  o += `<text x="${f1(oxc[0])}" y="${f1(oxc[1] + (oxc[1] > 124 ? 22 : -12))}" class="tl" text-anchor="middle" opacity="0">oxbow lake${showWin([[tc, tc2]], Ttot)}</text>`;
  // sinuosity 读数
  const rd = (om) => 'ω = ' + om.toFixed(2) + ' rad，sinuosity = ' + (1 / J0(om)).toFixed(2);
  const seqOm = [...oms.slice(i1), null, null, ...oms.slice(0, i1 + 1)];
  seqOm.forEach((om, k) => {
    if (om === null || k === seqOm.length - 1) return;
    const a = ktN[k], b = ktN[k + 1];
    o += `<text x="30" y="250" class="t" text-anchor="start" opacity="${k === 0 ? 1 : 0}">${rd(om)}${showWin([[a, b]], Ttot)}</text>`;
  });
  o += `<text x="30" y="250" class="tl" text-anchor="start" opacity="0">neck cutoff：channel 走捷径，长度骤减${showWin([[tc, tc2]], Ttot)}</text>`;
  // 第一帧上的标注：外岸 cut bank、内岸 point bar
  const p1 = sineCurve(oms[i1], lam, n, 4), f1_ = fit(p1);
  let imax = 0; p1.forEach((p, i) => { if (i < p1.length / 2 && p[1] > p1[imax][1]) imax = i; });
  const pk = X(p1[imax], f1_);
  o += `<g>${line(pk[0], pk[1] + 7, pk[0], pk[1] + 30, 'mute')}${text(pk[0], pk[1] + 44, 'cut bank：outer bank 被 erosion', 'ts', 'middle')}${line(pk[0], pk[1] - 7, pk[0], 52, 'mute')}${text(pk[0], 44, 'point bar：inner bank 上 deposition', 'ts', 'middle')}${showWin([[0, ktN[1]]], Ttot)}</g>`;
  o += text(30, 272, 'Sinuosity = channel 长度 / valley 长度 = 1 / J₀(ω)。Slope 按同样倍数变小', 'ts', 'start');
  return svgA(560, 282, o, '动图：一条 meandering river 的弯越长越大，sinuosity 从 1.3 左右增加到 ' + (1 / J0(omc)).toFixed(1) + '，相邻两段河道贴在一起时发生 neck cutoff，留下 oxbow lake');
}

// ---------- 第 3 站：energy balance，一层 atmosphere ----------
function energy() {
  const S = 1361, al = 0.3, sg = 5.67e-8;
  const F = (S * (1 - al)) / 4, Te = (F / sg) ** 0.25, Ts = 288, eps = 2 - 2 * (Te / Ts) ** 4;
  const up = sg * Ts ** 4, ea = (eps * up) / 2, tr = (1 - eps) * up;
  let o = '';
  const Y0 = 40, Ya = 130, Ys = 232;
  o += rect(20, Ya - 18, 520, 36, 'wash') + text(530, Ya + 4, 'atmosphere（ε = ' + eps.toFixed(2) + '）', 'ts', 'end');
  o += rect(20, Ys, 520, 26, 'wash2') + text(530, Ys + 18, 'surface，T = 288 K', 'ts', 'end');
  // solar
  o += arrow(70, Y0, 70, Ys - 2, 'ln') + text(78, Y0 + 6, 'sunlight ' + (S / 4).toFixed(0), 'tl', 'start');
  o += arrow(165, Ys - 4, 165, Y0, 'mute') + text(173, Y0 + 26, 'reflected ' + ((S / 4) * al).toFixed(0), 'ts', 'start');
  o += text(78, Ys - 10, 'absorbed ' + F.toFixed(0), 'ts', 'start');
  // IR
  o += arrow(250, Ys - 2, 250, Ya + 18, 'ink') + text(258, Ys - 20, 'surface 发出 ' + up.toFixed(0), 't', 'start');
  o += arrow(250, Ya - 18, 250, Y0, 'ink') + text(258, Y0 + 6, 'transmitted ' + tr.toFixed(0), 'ts', 'start');
  o += arrow(400, Ya - 18, 400, Y0, 'ink') + text(408, Y0 + 6, 'atmosphere 向上 ' + ea.toFixed(0), 'ts', 'start');
  o += arrow(400, Ya + 18, 400, Ys - 2, 'ink') + text(408, Ys - 20, 'atmosphere 向下 ' + ea.toFixed(0), 'ts', 'start');
  o += text(280, 20, '离开 top of atmosphere 的 IR：' + tr.toFixed(0) + ' + ' + ea.toFixed(0) + ' = ' + (tr + ea).toFixed(0) + '，等于吸收的 ' + F.toFixed(0), 'tb', 'middle');
  o += text(280, 280, '单位 W/m²，按整个地球表面平均。Surface 收到 ' + F.toFixed(0) + ' + ' + ea.toFixed(0) + ' = ' + (F + ea).toFixed(0) + '，等于它发出的 ' + up.toFixed(0), 'ts', 'middle');
  return svg(560, 290, o, '一层 atmosphere 的 energy balance：吸收 238 W/m² 的 sunlight，surface 288 K 发出 390，atmosphere 向上向下各 152，穿过 atmosphere 的 86');
}

// ---------- 第 3 站：air parcel 上升，先按 dry、再按 moist adiabat 降温 ----------
function moistLapse(Tk, p) {
  const es = 6.112 * Math.exp((17.67 * (Tk - 273.15)) / (Tk - 273.15 + 243.5));
  const r = (0.622 * es) / (p - es), L = 2.5e6, Rd = 287, cp = 1005, g = 9.8;
  return (g * (1 + (L * r) / (Rd * Tk))) / (cp + (L * L * r * 0.622) / (Rd * Tk * Tk));
}
export function parcelProfile() {
  // 地面 31 °C、dewpoint 24 °C、1008 hPa；LCL 用 125 m/K 估计
  const T0 = 31, Td = 24, zl = 0.125 * (T0 - Td);
  const pts = []; let T = T0 + 273.15, p = 1008, z = 0; const dz = 0.01;
  while (z <= 6 + 1e-9) {
    pts.push([z, T - 273.15]);
    const G = z < zl ? 9.8 / 1005 * 1000 : moistLapse(T, p) * 1000;
    const rho = (p * 100) / (287 * T);
    T -= G * dz; p -= (rho * 9.8 * dz * 1000) / 100; z += dz;
  }
  return { zl, pts };
}
function parcelA() {
  const { zl, pts } = parcelProfile();
  const sz = lin(0, 6, 262, 40), sT = lin(-15, 35, 300, 540);
  const env = (z) => 31 - 6.5 * z;
  let o = axes({ sx: sT, sy: sz, x0: -15, x1: 35, y0: 0, y1: 6, xt: [-10, 0, 10, 20, 30], yt: [0, 1, 2, 3, 4, 5, 6], xl: 'T（°C）', yl: 'z（km）', grid: true });
  o += path(d([[sT(env(0)), sz(0)], [sT(env(6)), sz(6)]]), 'dash');
  o += path(d(pts.map(([z, T]) => [sT(T), sz(z)])), 'ln');
  o += line(sT(-15), sz(zl), sT(35), sz(zl), 'grid');
  const T6 = pts[pts.length - 1][1];
  o += text(sT(env(3)) - 6, sz(3) + 4, 'environment 6.5 K/km', 'ts', 'end');
  o += text(sT(T6) + 6, sz(5.8), 'parcel', 'tl', 'start');
  o += text(sT(22), sz(zl) - 6, 'LCL ' + Math.round(zl * 1000) + ' m', 'ts', 'start');
  // 左侧：上升的 parcel 和云
  const X = 140;
  o += line(40, sz(0), 250, sz(0), 'ink') + text(45, sz(0) + 16, 'Singapore 地面', 'ts', 'start');
  const idx = (z) => Math.min(pts.length - 1, Math.round(z / 0.01));
  const T = 8, NK = 40, kt = [], zs = [];
  for (let i = 0; i <= NK; i++) { kt.push((i / NK) * (6.2 / T)); zs.push((6 * i) / NK); }
  kt.push(6.2 / T + 0.001); zs.push(0); kt.push(1); zs.push(0);
  o += acircle(zs.map(() => X), zs.map((z) => sz(z)), kt, T, 9, 'wash-strong');
  o += acircle(zs.map((z) => sT(pts[idx(z)][1])), zs.map((z) => sz(z)), kt, T, 4.5, 'ln-f');
  // 云：LCL 以上
  o += `<path d="M${X - 50} ${f1(sz(zl))} Q ${X - 46} ${f1(sz(zl + 0.6))} ${X - 20} ${f1(sz(zl + 0.7))} Q ${X - 10} ${f1(sz(3.2))} ${X + 18} ${f1(sz(3.4))} Q ${X + 44} ${f1(sz(2.6))} ${X + 40} ${f1(sz(1.6))} Q ${X + 60} ${f1(sz(1.2))} ${X + 50} ${f1(sz(zl))} Z" class="wash2" opacity="0">${showWin([[(zl / 6) * (6.2 / T), 6.2 / T]], T)}</path>`;
  o += line(30, sz(zl), 250, sz(zl), 'dash') + text(30, sz(zl) - 6, 'LCL = cloud base', 'ts', 'start');
  // 读数
  const lines = [[0.5, 'dry：每 km 降 9.8 K'], [2.5, 'saturated：condensation 放出 latent heat，每 km 只降 ' + (moistLapse(pts[idx(2.5)][1] + 273.15, 760) * 1000).toFixed(1) + ' K 左右']];
  o += `<text x="20" y="22" class="tb" text-anchor="start" opacity="1">${lines[0][1]}${showWin([[0, (zl / 6) * (6.2 / T)], [6.2 / T, 1]], T)}</text>`;
  o += `<text x="20" y="22" class="tb" text-anchor="start" opacity="0">${lines[1][1]}${showWin([[(zl / 6) * (6.2 / T), 6.2 / T]], T)}</text>`;
  o += text(280, 318, '地面 31 °C、dewpoint 24 °C。Parcel（彩线）在 LCL 以上一直比 environment（虚线）暖，所以继续上升', 'ts', 'middle');
  return svgA(560, 326, o, '动图：一团空气从 Singapore 地面上升，到 875 m 前按 dry adiabatic lapse rate 每 km 降 9.8 K，之后饱和、凝结成云，降温变慢，比周围空气暖而继续上升');
}

// ---------- 第 3 站：Hadley cell 截面 ----------
function hadleyA() {
  const sl = lin(-40, 40, 40, 520), sz = lin(0, 16, 220, 40);
  let o = line(sl(-40), sz(0), sl(40), sz(0), 'ink');
  for (const la of [-30, 0, 30]) o += line(sl(la), sz(0), sl(la), sz(0) + 5, 'axis') + text(sl(la), sz(0) + 19, la === 0 ? 'equator' : Math.abs(la) + '°' + (la < 0 ? 'S' : 'N'), 'ts', 'middle');
  o += text(sl(-40), sz(0) + 19, '40°S', 'ts', 'middle') + text(sl(40), sz(0) + 19, '40°N', 'ts', 'middle');
  o += line(sl(-40), sz(15), sl(40), sz(15), 'grid') + text(sl(-40) + 4, sz(15) - 5, 'tropopause 约 15 km', 'ts', 'start');
  // ITCZ 云塔
  o += path(`M${sl(-5)} ${sz(1)} Q ${sl(-7)} ${sz(9)} ${sl(-3)} ${sz(13)} Q ${sl(0)} ${sz(15.5)} ${sl(3)} ${sz(13)} Q ${sl(7)} ${sz(9)} ${sl(5)} ${sz(1)} Z`, 'wash2');
  o += text(sl(0), sz(0) + 36, 'ITCZ：上升、降雨', 'tb', 'middle');
  o += text(sl(-30), sz(0) + 36, '下沉、干：desert', 'ts', 'middle') + text(sl(30), sz(0) + 36, '下沉、干：desert', 'ts', 'middle');
  // 两个 cell 的环流：椭圆路径上的点
  const loop = (sgn) => (u) => {
    const a = 2 * Math.PI * u; // 0：地面中点，往 equator 走
    return [sgn * (15 - 13 * Math.cos(a + Math.PI / 2) * 1), 7 + 6 * Math.sin(a + Math.PI / 2) * -1];
  };
  const T = 6, NK = 36, kt = Array.from({ length: NK + 1 }, (_, i) => i / NK);
  for (const sgn of [1, -1]) {
    const f = loop(sgn);
    const pts = []; for (let i = 0; i <= 72; i++) pts.push(f(i / 72));
    o += path(d(pts.map(([la, z]) => [sl(la), sz(z)])) + 'Z', 'ln-dash');
    for (let j = 0; j < 6; j++) {
      const ps = kt.map((k) => f((-k + j / 6 + 2) % 1)); // 地面流向 equator，高空流向 pole
      o += acircle(ps.map((p) => sl(p[0])), ps.map((p) => sz(p[1])), kt, T, 3.5, 'ink-f');
    }
  }
  o += text(sl(15), sz(7) + 4, 'Hadley cell', 'tl', 'middle') + text(sl(-15), sz(7) + 4, 'Hadley cell', 'tl', 'middle');
  o += text(sl(16), sz(0) + 19, '← NE trades', 'tl', 'middle');
  o += text(sl(-16), sz(0) + 19, 'SE trades →', 'tl', 'middle');
  o += text(280, 282, '高空的空气流向 pole，越走越偏东；地面的 trade winds 流向 equator，偏向西（见正文）', 'ts', 'middle');
  return svgA(560, 292, o, '动图：两个 Hadley cell 的截面。空气在 equator 附近的 ITCZ 上升、在高空向两极流动、在南北纬 30 度附近下沉，再沿地面作为 trade winds 流回 equator');
}

// ---------- 第 4 站：同一场雨，forest 和 paved 两种 catchment 的 hydrograph ----------
export function hydro(C, k, n = 2) {
  // n 个串联 linear reservoir；1 km² catchment，50 mm 雨在 1 h 内均匀落下
  const dt = 1 / 120, S = Array(n).fill(0), out = [];
  for (let t = 0; t <= 8 + 1e-9; t += dt) {
    const P = t < 1 ? 50 : 0;
    let inflow = (C * P / 1000) * 1e6 / 3600;
    for (let i = 0; i < n; i++) { const q = S[i] / (k * 3600); S[i] += (inflow - q) * dt * 3600; inflow = q; }
    out.push([t, inflow]);
  }
  return out;
}
function hydrograph() {
  const fo = hydro(0.3, 1.0), ur = hydro(0.9, 0.25);
  const pk = (a) => a.reduce((m, p) => (p[1] > m[1] ? p : m), [0, 0]);
  const pf = pk(fo), pu = pk(ur);
  const st = lin(0, 6, 270, 540), sq = lin(0, 12, 250, 70);
  let o = axes({ sx: st, sy: sq, x0: 0, x1: 6, y0: 0, y1: 12, xt: [0, 1, 2, 3, 4, 5, 6], yt: [0, 4, 8, 12], xl: 't（h）', grid: true });
  o += text(st(0) - 4, 58, 'discharge（m³/s）', 'ts', 'start');
  o += rect(st(0), 18, st(1) - st(0), 16, 'solid') + text(st(1) + 6, 31, 'rain：50 mm，1 h', 'ts', 'start');
  o += path(d(fo.filter((p) => p[0] <= 6).map(([t, q]) => [st(t), sq(q)])), 'ink-b');
  o += path(d(ur.filter((p) => p[0] <= 6).map(([t, q]) => [st(t), sq(q)])), 'ln');
  o += text(st(pu[0]) + 8, sq(pu[1]) + 4, 'paved：peak ' + pu[1].toFixed(1) + ' m³/s，' + pu[0].toFixed(1) + ' h', 'tl', 'start');
  o += text(st(pf[0]) + 8, sq(pf[1]) - 22, 'forest：peak ' + pf[1].toFixed(1) + ' m³/s，' + pf[0].toFixed(1) + ' h', 'tb', 'start');
  // 左：两块 catchment
  const tile = (y, cls, lab, sub2) => {
    let q = rect(30, y, 200, 70, cls, 6);
    q += text(130, y + 30, lab, 'tb', 'middle') + text(130, y + 50, sub2, 'ts', 'middle');
    return q;
  };
  o += tile(60, 'wash', 'forest', 'C = 0.3，k = 1 h');
  for (let i = 0; i < 9; i++) o += circle(46 + i * 21, 72, 5, 'wash-strong');
  o += tile(170, 'wash2', 'paved + drains', 'C = 0.9，k = 0.25 h');
  for (let i = 0; i < 4; i++) o += line(40 + i * 50, 232, 70 + i * 50, 232, 'mute');
  o += text(130, 268, '同样 1 km²，同一场雨', 'ts', 'middle');
  return svg(560, 280, o, '同一场 1 小时 50 mm 的雨落在 1 平方公里上：forest catchment 的 peak discharge 约 ' + pf[1].toFixed(1) + '，paved catchment 约 ' + pu[1].toFixed(1) + ' 立方米每秒，而且来得更早');
}

// ---------- 第 5 站：Sunda shelf，sea level 从 −120 m 回升 ----------
function sundaA() {
  // 示意的 bathymetry：Singapore（左）到 Borneo（右），水平约 700 km
  const prof = (x) => {
    const base = -55 - 25 * Math.sin((Math.PI * x) / 700) ** 2;
    const chan = -30 * Math.exp(-(((x - 330) / 28) ** 2));
    const edgeL = 60 * Math.exp(-x / 18), edgeR = 60 * Math.exp(-(700 - x) / 18);
    return Math.min(base + chan + edgeL + edgeR, 20);
  };
  const sx = lin(0, 700, 40, 520), sy = lin(30, -140, 40, 220);
  let o = '';
  const gd = []; for (let x = 0; x <= 700; x += 5) gd.push([x, prof(x)]);
  // 时间序列：19 ka 时 −120 m，按平均 10 mm/yr 升到 7 ka 的 0 m
  const T = 9, ages = []; for (let a = 19; a >= 7 - 1e-9; a -= 0.5) ages.push(a);
  const slAt = (a) => -120 + (120 * (19 - a)) / 12;
  const kt = [0, 1.5 / T], sls = [-120, -120];
  ages.forEach((a, i) => { kt.push((1.5 + (5.5 * i) / (ages.length - 1)) / T); sls.push(slAt(a)); });
  kt.push(1); sls.push(0);
  // 水体：sea level 线以下、地形以上
  const waterD = (sl) => {
    let s = ''; let seg = [];
    const flush = () => { if (seg.length > 1) s += d([...seg.map(([x, z]) => [sx(x), sy(sl)]), ...seg.slice().reverse().map(([x, z]) => [sx(x), sy(z)])]) + 'Z'; seg = []; };
    for (const p of gd) { if (p[1] < sl) seg.push(p); else flush(); }
    flush();
    return s || 'M0 0Z';
  };
  // discrete 帧（形状数目会变）
  o += apath(sls.map(waterD), kt, T, 'wash', true);
  o += path(d([...gd.map(([x, z]) => [sx(x), sy(z)]), [sx(700), sy(-140)], [sx(0), sy(-140)]]) + 'Z', 'wash2');
  o += path(d(gd.map(([x, z]) => [sx(x), sy(z)])), 'ink');
  o += apath(sls.map((sl) => d([[sx(0), sy(sl)], [sx(700), sy(sl)]])), kt, T, 'ln');
  for (const z of [0, -50, -100]) o += line(sx(0) - 4, sy(z), sx(0), sy(z), 'axis') + text(sx(0) - 7, sy(z) + 4, z + ' m', 'ts', 'end');
  o += text(sx(0), sy(30) - 6, 'Singapore', 'tb', 'start') + text(sx(700), sy(30) - 6, 'Borneo', 'tb', 'end');
  o += text(sx(330) + 34, sy(-98), 'paleo-river valley', 'ts', 'start');
  // 读数
  o += `<text x="280" y="262" class="tb" text-anchor="middle">19 ka：sea level −120 m，shelf 大部分是陆地${showWin([[0, kt[3]]], T)}</text>`;
  for (let i = 1; i < ages.length; i += 2) {
    const k0 = kt[2 + i], k1 = kt[Math.min(2 + i + 2, kt.length - 2)];
    o += `<text x="280" y="262" class="t" text-anchor="middle" opacity="0">${ages[i].toFixed(1)} ka：sea level ${Math.round(slAt(ages[i]))} m${showWin([[k0, k1]], T)}</text>`;
  }
  o += `<text x="280" y="262" class="tl" text-anchor="middle" opacity="0">7 ka：接近今天的 sea level，shelf 全部被淹${showWin([[kt[kt.length - 2], 1]], T)}</text>`;
  o += text(280, 284, '示意的 profile，竖向放大约 1500 倍；sea level 按平均 10 mm/yr 线性回升', 'ts', 'middle');
  return svgA(560, 292, o, '动图：Singapore 到 Borneo 之间 Sunda shelf 的示意截面，sea level 从 19 ka 的负 120 米升到 7 ka 的今天水平，shelf 从陆地变成浅海');
}

// ---------- 第 6 站：两家 firm 的 marginal abatement cost ----------
function abate() {
  let o = '';
  const panel = (x0, title, qa, qb, note) => {
    const sq = lin(0, 100, x0, x0 + 220), sp = lin(0, 450, 230, 50);
    o += axes({ sx: sq, sy: sp, x0: 0, x1: 100, y0: 0, y1: 450, xt: [0, 25, 50, 75, 100], yt: [0, 150, 300, 450], xl: '减排量 q（t）', yl: 'marginal cost（$/t）' });
    const fa = (q) => 2 * q, fb = (q) => 6 * q;
    o += path(d([[sq(0), sp(0)], [sq(qa), sp(fa(qa))]]) + `L${f1(sq(qa))} ${f1(sp(0))}Z`, 'wash');
    o += path(d([[sq(0), sp(0)], [sq(qb), sp(fb(qb))]]) + `L${f1(sq(qb))} ${f1(sp(0))}Z`, 'wash2');
    o += path(curve(fa, 0, 100, sq, sp), 'ink-b') + path(curve(fb, 0, 75, sq, sp), 'ln');
    o += text(sq(100) - 2, sp(200) - 8, 'A：MC = 2q', 'tb', 'end') + text(sq(75) + 4, sp(450) + 14, 'B：6q', 'tl', 'start');
    o += circle(sq(qa), sp(fa(qa)), 4, 'ink-f') + circle(sq(qb), sp(fb(qb)), 4, 'ln-f');
    o += text(x0 + 110, 22, title, 'tb', 'middle') + text(x0 + 110, 278, note, 'ts', 'middle');
  };
  panel(60, '每家各减 50 t', 50, 50, 'A 的 MC 100，B 的 MC 300；总 cost 10,000');
  panel(330, '可以交易 permit', 75, 25, '两家 MC 都是 150；总 cost 7,500');
  o += line(330 - 3, 50 + (180 * 300) / 450, 330 + 220, 50 + (180 * 300) / 450, 'grid');
  return svg(560, 288, o, '两家 firm 的 marginal abatement cost 分别是 2q 和 6q。各减 50 吨时两家 marginal cost 不等，总 cost 一万；交易后 A 减 75、B 减 25，marginal cost 都是 150，总 cost 七千五');
}

export default {
  'ge1101e-spread': spreadA,
  'ge1101e-barcode': barcode,
  'ge1101e-subduct': subductA,
  'ge1101e-isostasy': isostasy,
  'ge1101e-rock': rockA,
  'ge1101e-meander': meanderA,
  'ge1101e-energy': energy,
  'ge1101e-parcel': parcelA,
  'ge1101e-hadley': hadleyA,
  'ge1101e-hydro': hydrograph,
  'ge1101e-sunda': sundaA,
  'ge1101e-abate': abate,
};
