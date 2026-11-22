import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, axes, apath, acircle, ashow, anim, f1, logx } from '../lib/svg.mjs';

// ---------- 小工具 ----------
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function gauss(r) { const u = Math.max(r(), 1e-12), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const fmt = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
// 一个矩形里填 opacity 表示灰度（颜色只走 class）
const shade = (x, y, w, h, v, cls = 'ink-f') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" class="${cls}" opacity="${Math.max(0, Math.min(1, v)).toFixed(3)}"/>`;

// ---------- 开头：一张 image 分不出大小和远近 ----------
function ambig() {
  const sx = lin(0, 4.6, 70, 540), Y0 = 200, k = 70;
  const sy = (h) => Y0 - h * k;
  let o = line(40, Y0, 548, Y0, 'axis');
  // chair（侧视，有厚度）：高 H，放在 depth z
  const chair = (z, H) => {
    const s = H; const x0 = sx(z) - 0.45 * s * 70 / 1.0 * (sx(1) - sx(0)) / 70 / 2;
    const u = (sx(1) - sx(0)) * s; // 每单位长度的像素 × 尺寸
    const X = (a) => sx(z) + a * u, Yh = (b) => sy(b * s);
    let q = '';
    q += poly([[X(-0.25), Yh(0.5)], [X(0.25), Yh(0.5)], [X(0.25), Yh(0.44)], [X(-0.25), Yh(0.44)]], 'solid2');
    q += poly([[X(-0.25), Yh(1)], [X(-0.2), Yh(1)], [X(-0.2), Yh(0.44)], [X(-0.25), Yh(0.44)]], 'solid2');
    q += poly([[X(-0.25), Yh(0.44)], [X(-0.2), Yh(0.44)], [X(-0.2), Yh(0)], [X(-0.25), Yh(0)]], 'solid2');
    q += poly([[X(0.2), Yh(0.44)], [X(0.25), Yh(0.44)], [X(0.25), Yh(0)], [X(0.2), Yh(0)]], 'solid2');
    return q;
  };
  o += chair(2, 1) + chair(4, 2);
  // camera：pinhole 在 z=0，图像平面画在 z=0.5（virtual image plane）
  const C = [sx(0), Y0];
  o += poly([[C[0] - 30, Y0 - 14], [C[0], Y0], [C[0] - 30, Y0 + 14]], 'paper');
  o += circle(C[0], C[1], 3, 'ink-f');
  o += line(sx(0.5), Y0 + 20, sx(0.5), sy(0.75), 'ink-b');
  o += text(sx(0.5) + 4, sy(0.75) - 4, 'image plane', 'ts', 'start');
  // 两把 chair 顶端的 ray：同一条
  o += line(C[0], C[1], sx(4) - 0.25 * (sx(1) - sx(0)) * 2, sy(2), 'ln-dash');
  const hit = sy(0.25);
  o += circle(sx(0.5), hit, 4, 'ln-f');
  o += text(sx(0.5) - 6, hit - 6, '同一个 pixel', 'tl', 'end');
  for (const [z, s] of [[0, 'Z = 0'], [2, 'H = 1 m，Z = 2 m'], [4, 'H = 2 m，Z = 4 m']]) o += line(sx(z), Y0, sx(z), Y0 + 5, 'axis') + text(sx(z), Y0 + 19, s, 'ts', 'middle');
  o += text(300, 246, 'f = 500 px 时两把 chair 在 image 上都是 500 × H / Z = 250 px 高', 'ts', 'middle');
  return svg(560, 254, o, '侧视图：1 米高、2 米远的 chair 和 2 米高、4 米远的 chair，顶端落在同一条 ray 上，在 image 里一样高');
}

// ---------- 第 1 站：同一个 shape 的四种 representation ----------
function repr() {
  let o = '';
  const R = 1, W = 128, gap = 16, Y = 30, S = 120;
  const panel = (k) => 8 + k * (W + gap);
  const map = (k) => { const x0 = panel(k); return [(x) => x0 + W / 2 + x * S / 3, (y) => Y + S / 2 - y * S / 3]; };
  // 目标 shape：radius 1 的 circle 加一个向右的小凸起，范围 [-1.5,1.5]²
  const sdf = (x, y) => Math.min(Math.hypot(x, y) - R, Math.hypot(x - 1.05, y) - 0.32);
  // (a) voxel 12×12
  {
    const [X, Yy] = map(0), n = 12, h = 3 / n;
    let filled = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const cx = -1.5 + (i + 0.5) * h, cy = -1.5 + (j + 0.5) * h;
      const a = X(cx - h / 2), b = Yy(cy + h / 2), w = X(cx + h / 2) - a;
      o += rect(a, b, w, w, sdf(cx, cy) < 0 ? 'solid2' : 'grid');
      if (sdf(cx, cy) < 0) filled++;
    }
    o += text(panel(0) + W / 2, Y + S + 20, 'voxel grid', 'tb', 'middle');
    o += text(panel(0) + W / 2, Y + S + 37, `12² 格，填了 ${filled} 格`, 'ts', 'middle');
    o += text(panel(0) + W / 2, Y + S + 53, '3D：N³ 个 occupancy', 'ts', 'middle');
  }
  // 画轮廓（marching squares 式地取 sdf=0 的近似：用细 polyline）
  const outline = (X, Yy, cls) => {
    const pts = [];
    for (let k = 0; k <= 360; k++) { const a = (k / 360) * 2 * Math.PI; let r0 = 0.5, r1 = 1.6; for (let it2 = 0; it2 < 40; it2++) { const m = (r0 + r1) / 2; if (sdf(m * Math.cos(a), m * Math.sin(a)) < 0) r0 = m; else r1 = m; } pts.push([X(r0 * Math.cos(a)), Yy(r0 * Math.sin(a))]); }
    return path(d(pts), cls);
  };
  // (b) point cloud：在边界上按弧长均匀采 28 个点（加一点 jitter）
  {
    const [X, Yy] = map(1); const r = rng(7);
    o += outline(X, Yy, 'grid');
    for (let k = 0; k < 28; k++) { const a = (k + 0.5 * r()) / 28 * 2 * Math.PI; let r0 = 0.5, r1 = 1.6; for (let t = 0; t < 40; t++) { const m = (r0 + r1) / 2; if (sdf(m * Math.cos(a), m * Math.sin(a)) < 0) r0 = m; else r1 = m; } o += circle(X(r0 * Math.cos(a)), Yy(r0 * Math.sin(a)), 2.6, 'ink-f'); }
    o += text(panel(1) + W / 2, Y + S + 20, 'point cloud', 'tb', 'middle');
    o += text(panel(1) + W / 2, Y + S + 37, '28 个点，没有连接', 'ts', 'middle');
    o += text(panel(1) + W / 2, Y + S + 53, '3D：P × 3', 'ts', 'middle');
  }
  // (c) mesh：14 个 vertex 连成闭合 polygon（2D 里的 mesh）
  {
    const [X, Yy] = map(2); const vs = [];
    for (let k = 0; k < 14; k++) { const a = k / 14 * 2 * Math.PI; let r0 = 0.5, r1 = 1.6; for (let t = 0; t < 40; t++) { const m = (r0 + r1) / 2; if (sdf(m * Math.cos(a), m * Math.sin(a)) < 0) r0 = m; else r1 = m; } vs.push([X(r0 * Math.cos(a)), Yy(r0 * Math.sin(a))]); }
    o += poly(vs, 'wash') + path(d([...vs, vs[0]]), 'ink');
    for (const p of vs) o += circle(p[0], p[1], 2.6, 'ink-f');
    o += text(panel(2) + W / 2, Y + S + 20, 'mesh', 'tb', 'middle');
    o += text(panel(2) + W / 2, Y + S + 37, '14 个 vertex + 连接', 'ts', 'middle');
    o += text(panel(2) + W / 2, Y + S + 53, '3D：V × 3 与 F × 3', 'ts', 'middle');
  }
  // (d) SDF：几条 level set
  {
    const [X, Yy] = map(3);
    o += rect(panel(3), Y, W, S, 'frame');
    for (const lv of [-0.5, 0.25, 0.5]) {
      const pts = [];
      for (let k = 0; k <= 240; k++) { const a = (k / 240) * 2 * Math.PI; let r0 = 0, r1 = 2.5; for (let t = 0; t < 40; t++) { const m = (r0 + r1) / 2; if (sdf(m * Math.cos(a), m * Math.sin(a)) < lv) r0 = m; else r1 = m; } const px = X(r0 * Math.cos(a)), py = Yy(r0 * Math.sin(a)); pts.push([Math.max(panel(3), Math.min(panel(3) + W, px)), Math.max(Y, Math.min(Y + S, py))]); }
      o += path(d(pts), 'mute');
    }
    o += outline(X, Yy, 'ln');
    o += text(X(0), Yy(0) + 4, 'f < 0', 'ts', 'middle');
    o += text(X(-1.47), Yy(-1.38), 'f > 0', 'ts', 'start');
    o += text(panel(3) + W / 2, Y + S + 20, 'implicit：SDF', 'tb', 'middle');
    o += text(panel(3) + W / 2, Y + S + 37, '红线是 f = 0', 'ts', 'middle');
    o += text(panel(3) + W / 2, Y + S + 53, '3D：一个 function', 'ts', 'middle');
  }
  return svg(560, 220, o, '同一个 shape 的四种 representation：voxel grid、point cloud、mesh、signed distance function 的 level set');
}

// ---------- 第 2 站：Chamfer distance 的两个方向 ----------
function chamfer() {
  const P = [[0, 0], [1, 0], [2, 0.5]], G = [[0, 0.5], [1, 0], [2, 0], [3, 0]];
  const nn = (p, S) => { let b = 0, bd = 1e9; S.forEach((q, i) => { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (dd < bd) { bd = dd; b = i; } }); return [b, bd]; };
  const sx = lin(-0.4, 3.4, 40, 520), sy = lin(-0.3, 0.8, 190, 40);
  let o = '';
  for (const p of P) { const [i, dd] = nn(p, G); const q = G[i]; if (dd > 0) o += arrow(sx(p[0]), sy(p[1]), sx(q[0]) + (q[0] === p[0] ? 0 : -6), sy(q[1]) + (q[1] > p[1] ? 6 : q[1] < p[1] ? -6 : 0), 'ln'); }
  for (const g of G) { const [i, dd] = nn(g, P); const q = P[i]; if (dd > 0) { const ang = Math.atan2(sy(q[1]) - sy(g[1]), sx(q[0]) - sx(g[0])); o += arrow(sx(g[0]), sy(g[1]), sx(q[0]) - 7 * Math.cos(ang), sy(q[1]) - 7 * Math.sin(ang), 'ln-dash'); } }
  for (const g of G) o += circle(sx(g[0]), sy(g[1]), 6, 'paper');
  for (const p of P) o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink-f');
  const lab = (p, s, dx, dy, a = 'middle') => text(sx(p[0]) + dx, sy(p[1]) + dy, s, 'ts', a);
  lab([0, 0], '(0, 0)', 0, 22); lab([1, 0], '', 0, 0);
  o += lab([0, 0], '(0, 0)', 0, 22) + lab([1, 0], '(1, 0) 两边都有', 0, 22) + lab([2, 0.5], '(2, 0.5)', 0, -14) + lab([0, 0.5], '(0, 0.5)', 0, -14) + lab([2, 0], '(2, 0)', 0, 22) + lab([3, 0], '(3, 0)', 0, 22);
  o += text(sx(2.5) + 4, sy(0.25) - 16, '1.25', 'tl', 'middle');
  o += circle(48, 222, 4.5, 'ink-f') + text(58, 226, 'prediction', 'ts') + circle(140, 222, 6, 'paper') + text(152, 226, 'ground truth', 'ts');
  o += line(250, 222, 280, 222, 'ln') + text(286, 226, 'pred → 最近的 GT', 'ts') + line(400, 222, 430, 222, 'ln-dash') + text(436, 226, 'GT → 最近的 pred', 'ts');
  o += text(280, 250, '箭头旁不标的都是 0.25；只有从 (3, 0) 出发的那条长：squared distance 1.25', 'ts', 'middle');
  return svg(560, 258, o, '三个 predicted point 和四个 ground-truth point，以及两个方向上的 nearest neighbor 箭头；(3, 0) 附近没有 prediction');
}

// ---------- 第 2 站：hard 与 soft rasterization 的 gradient ----------
function soft() {
  let o = '';
  // 左：一行 5 个 pixel，一个 triangle 的右边 edge 在 x = e 处
  const px = (i) => 30 + i * 38, Y = 60, s = 38, e = 2.62;
  for (let i = 0; i < 5; i++) {
    const cx = i + 0.5, inside = cx < e;
    o += rect(px(i), Y, s, s, inside ? 'solid2' : 'paper');
    o += circle(px(i) + s / 2, Y + s / 2, 2.5, 'ink-f');
  }
  const ex = 30 + e * 38;
  o += poly([[10, Y - 30], [ex + 20, Y - 30], [ex - 16, Y + s + 30], [10, Y + s + 30]], 'wash');
  o += line(ex + 20, Y - 30, ex - 16, Y + s + 30, 'ln');
  o += text(ex + 28, Y - 26, 'triangle 的 edge', 'tl', 'start');
  o += text(px(2) + s / 2, Y + s + 48, 'pixel 3：center 在 x = 2.5', 'ts', 'middle');
  o += text(105, 10, '五个 pixel，edge 往右挪', 'tb', 'middle');
  // 右：pixel 3 的值随 edge 的位置 e 变化
  const sx = lin(1.5, 3.5, 300, 540), sy = lin(0, 1, 170, 40);
  o += axes({ sx, sy, x0: 1.5, x1: 3.5, y0: 0, y1: 1, xt: [2, 2.5, 3], yt: [0, 0.5, 1], xl: 'edge 的位置 e', grid: true });
  o += text(300, 22, 'pixel 3 的值', 'tb', 'start');
  const hard = [[sx(1.5), sy(0)], [sx(2.5), sy(0)], [sx(2.5), sy(1)], [sx(3.5), sy(1)]];
  o += path(d(hard), 'ink-b');
  // SoftRas Eq. 1：D = sigmoid(δ d² / σ)，d 是 center 到 edge 的距离，δ = +1 表示 center 在 triangle 里
  const sg = 0.05, sig = (e2) => { const dd = e2 - 2.5; return 1 / (1 + Math.exp(-Math.sign(dd) * dd * dd / sg)); };
  const pts = []; for (let k = 0; k <= 400; k++) { const v = 1.5 + 2 * k / 400; pts.push([sx(v), sy(sig(v))]); }
  o += path(d(pts), 'ln');
  // gradient 大于 0.1 的范围（由公式算）
  let dmax = 0; for (let k = 0; k <= 10000; k++) { const dd = k / 10000, D = sig(2.5 + dd), g = D * (1 - D) * 2 * dd / sg; if (g > 0.1) dmax = dd; }
  o += text(sx(1.6), sy(0.85), 'hard：0 或 1', 'ts', 'start');
  o += text(sx(2.62), sy(0.4), 'SoftRas（σ = 0.05）', 'tl', 'start');
  o += text(420, 228, 'hard 的 derivative 处处是 0（跳变点除外）；', 'ts', 'middle');
  o += text(420, 244, `SoftRas 在 edge 离 center ${dmax.toFixed(1)} pixel 以内都有 gradient`, 'ts', 'middle');
  return svg(560, 252, o, '左边五个 pixel 和一个 triangle 的 edge；右边 pixel 3 的值随 edge 位置变化：hard rasterization 是阶跃，SoftRas 是距离平方的 sigmoid');
}

// ---------- 第 3 站：沿着 ray 积分（动图） ----------
const VR = { sig: [0, 0, 0.8, 0.8, 0, 6, 6, 0], c: [0, 0, 0.2, 0.2, 0, 0.9, 0.9, 0], t0: 2, dl: 0.5 };
function vrAt(t) { // 连续的 T(t)、C(t)：piecewise constant，段内精确
  let T = 1, C = 0;
  for (let i = 0; i < 8; i++) {
    const a = VR.t0 + i * VR.dl, b = a + VR.dl;
    if (t <= a) break;
    const L = Math.min(t, b) - a, al = 1 - Math.exp(-VR.sig[i] * L);
    C += T * al * VR.c[i]; T *= 1 - al;
  }
  return [T, C];
}
function rayA() {
  const sx = lin(1.6, 6.2, 70, 540);
  let o = '';
  // 上：场景
  const yR = 52;
  o += poly([[22, yR - 13], [50, yR], [22, yR + 13]], 'paper') + circle(50, yR, 3, 'ink-f');
  o += text(36, yR + 30, 'camera', 'ts', 'middle');
  o += rect(sx(3), yR - 26, sx(4) - sx(3), 52, 'wash');
  o += text((sx(3) + sx(4)) / 2, yR - 32, 'fog：σ = 0.8，c = 0.2', 'ts', 'middle');
  o += rect(sx(4.5), yR - 26, sx(5.5) - sx(4.5), 52, 'solid2');
  o += text((sx(4.5) + sx(5.5)) / 2, yR - 32, 'solid：σ = 6，c = 0.9', 'ts', 'middle');
  o += arrow(50, yR, sx(6.1), yR, 'ink');
  for (let k = 0; k <= 8; k++) { const t = 2 + k * 0.5; o += line(sx(t), yR - 4, sx(t), yR + 4, 'ink'); }
  o += text(sx(2), yR + 18, 'near = 2', 'ts', 'middle') + text(sx(6), yR + 18, 'far = 6', 'ts', 'middle');
  // 中：σ(t) 和 T(t)
  const sy = lin(0, 1, 230, 110);
  o += axes({ sx, sy, x0: 2, x1: 6, y0: 0, y1: 1, xt: [2, 3, 4, 5, 6], yt: [0, 0.5, 1], xl: 'ray 上的距离 t', grid: true });
  const Tpts = []; for (let k = 0; k <= 400; k++) { const t = 2 + 4 * k / 400; Tpts.push([sx(t), sy(vrAt(t)[0])]); }
  o += path(d(Tpts), 'mute');
  // 动：marker 沿 ray 走，T 曲线画到当前位置
  const N = 80, dur = 8, hold = 1.6, kt = [], ts = [];
  const h0 = 1.2 / dur; kt.push(0, h0); ts.push(6, 6);
  for (let k = 0; k <= N; k++) { kt.push(h0 + 0.002 + (k / N) * (dur - hold - 1.2) / dur); ts.push(2 + 4 * k / N); }
  kt.push(1); ts.push(6);
  const partial = (t) => { const pts = []; for (let k = 0; k <= 160; k++) { const u = 2 + (t - 2) * k / 160; pts.push([sx(u), sy(vrAt(u)[0])]); } return d(pts); };
  o += apath(ts.map(partial), kt, dur, 'ln');
  o += acircle(ts.map(sx), ts.map(() => yR), kt, dur, 5, 'ln-f');
  o += acircle(ts.map(sx), ts.map((t) => sy(vrAt(t)[0])), kt, dur, 4.5, 'ln-f');
  o += text(sx(2) + 6, sy(1) - 8, 'T(t)：走到 t 还没被挡住的 probability', 'tl', 'start');
  // 下：累计的 color C(t)，用一块灰度色块和数字
  const yb = 270;
  o += text(70, yb, '累计 C(t)：', 'tb', 'start');
  o += rect(150, yb - 15, 60, 22, 'paper');
  o += `<rect x="150" y="${yb - 15}" width="60" height="22" class="ink-f" opacity="${vrAt(6)[1].toFixed(3)}">${anim('opacity', ts.map((t) => vrAt(t)[1].toFixed(3)), kt, dur)}</rect>`;
  // 9 个整点的读数
  for (let k = 0; k <= 8; k++) {
    const t = 2 + k * 0.5, [T, C] = vrAt(t);
    const on = ts.map((u) => (u >= t - 1e-9 && u < t + 0.5 - 1e-9) || (k === 8 && u >= 6 - 1e-9));
    o += `<text x="225" y="${yb}" class="ts" text-anchor="start" opacity="${k === 8 ? 1 : 0}">t = ${t.toFixed(1)}：T = ${T.toFixed(3)}，C = ${C.toFixed(3)}${ashow(on, kt, dur)}</text>`;
  }
  o += text(70, yb + 24, 'C 只在 T 往下掉的地方增加：fog 先拿走一部分，solid 拿走剩下的几乎全部。', 'ts', 'start');
  return svgA(560, 300, o, '动图：一个点沿 ray 从 t = 2 走到 6，穿过 fog 和 solid；下面的 transmittance 曲线随之下降，累计 color 从 0 增加到 0.514');
}

// ---------- 第 4 站：positional encoding（1D 的“一行 image”） ----------
function trainMLP(L, steps, H = 32, seed = 3) {
  const target = (x) => 0.5 + 0.3 * (x > 0 ? Math.sign(Math.sin(6 * Math.PI * x)) : 0) + 0.2 * Math.sin(2 * Math.PI * x);
  const feats = (x) => { const f = [x]; for (let k = 0; k < L; k++) f.push(Math.sin(2 ** k * Math.PI * x), Math.cos(2 ** k * Math.PI * x)); return f; };
  const r = rng(seed), M = 128, xs = []; for (let i = 0; i < M; i++) xs.push(-1 + 2 * (i + 0.5) / M);
  const X = xs.map(feats), Y = xs.map(target), D = X[0].length;
  const g = (n) => Float64Array.from({ length: n }, () => gauss(r));
  const W1 = g(H * D).map((v) => v * Math.sqrt(2 / D)), b1 = new Float64Array(H), W2 = g(H * H).map((v) => v * Math.sqrt(2 / H)), b2 = new Float64Array(H), W3 = g(H).map((v) => v * Math.sqrt(1 / H)), b3 = new Float64Array([0.5]);
  const params = [W1, b1, W2, b2, W3, b3], mom = params.map((p) => new Float64Array(p.length)), vel = params.map((p) => new Float64Array(p.length));
  const h1 = new Float64Array(H), h2 = new Float64Array(H), d1 = new Float64Array(H), d2 = new Float64Array(H);
  const fwd = (x) => {
    for (let i = 0; i < H; i++) { let s = b1[i]; for (let j = 0; j < D; j++) s += W1[i * D + j] * x[j]; h1[i] = s > 0 ? s : 0; }
    for (let i = 0; i < H; i++) { let s = b2[i]; for (let j = 0; j < H; j++) s += W2[i * H + j] * h1[j]; h2[i] = s > 0 ? s : 0; }
    let y = b3[0]; for (let j = 0; j < H; j++) y += W3[j] * h2[j]; return y;
  };
  const loss = [], lr = 3e-3;
  for (let t = 0; t <= steps; t++) {
    const grads = params.map((p) => new Float64Array(p.length)); let Ls = 0;
    for (let n = 0; n < M; n++) {
      const x = X[n], y = fwd(x), e = y - Y[n]; Ls += e * e; const dy = (2 * e) / M;
      grads[5][0] += dy;
      for (let j = 0; j < H; j++) { grads[4][j] += dy * h2[j]; d2[j] = h2[j] > 0 ? dy * W3[j] : 0; }
      d1.fill(0);
      for (let i = 0; i < H; i++) { if (!d2[i]) continue; grads[3][i] += d2[i]; for (let j = 0; j < H; j++) { grads[2][i * H + j] += d2[i] * h1[j]; d1[j] += d2[i] * W2[i * H + j]; } }
      for (let i = 0; i < H; i++) { if (h1[i] <= 0) continue; grads[1][i] += d1[i]; for (let j = 0; j < D; j++) grads[0][i * D + j] += d1[i] * x[j]; }
    }
    loss.push(Ls / M);
    if (t === steps) break;
    const k = t + 1;
    params.forEach((p, q) => { const gq = grads[q], m = mom[q], v = vel[q]; for (let i = 0; i < p.length; i++) { m[i] = 0.9 * m[i] + 0.1 * gq[i]; v[i] = 0.999 * v[i] + 0.001 * gq[i] * gq[i]; p[i] -= lr * (m[i] / (1 - 0.9 ** k)) / (Math.sqrt(v[i] / (1 - 0.999 ** k)) + 1e-8); } });
  }
  const dense = []; for (let i = 0; i <= 256; i++) { const x = -1 + 2 * i / 256; dense.push([x, fwd(feats(x))]); }
  return { loss, dense, target, xs, Y };
}
let PE = null;
function peData() { if (!PE) PE = { raw: trainMLP(0, 600), enc: trainMLP(4, 600) }; return PE; }
function pe() {
  const { raw, enc } = peData();
  const sx = lin(-1, 1, 70, 540);
  let o = '';
  // 上：三条 1D image（灰度 strip）
  const strip = (y, fn, label) => {
    let q = text(62, y + 13, label, 'ts', 'end');
    for (let i = 0; i < 128; i++) { const x = -1 + 2 * (i + 0.5) / 128; q += shade(sx(-1) + i * (470 / 128), y, 470 / 128 + 0.3, 18, fn(x)); }
    return q + rect(sx(-1), y, 470, 18, 'frame');
  };
  const near = (res) => (x) => { const k = Math.round((x + 1) / 2 * 256); return res.dense[k][1]; };
  o += strip(16, raw.target, 'target');
  o += strip(40, near(raw), '输入 x');
  o += strip(64, near(enc), '输入 γ(x)');
  // 下：曲线
  const sy = lin(-0.1, 1.1, 262, 116);
  o += axes({ sx, sy, x0: -1, x1: 1, y0: -0.1, y1: 1.1, xt: [-1, -0.5, 0, 0.5, 1], yt: [0, 0.5, 1], xl: 'x（这一行 image 上的位置）', grid: true });
  const tp = []; for (let i = 0; i <= 600; i++) { const x = -1 + 2 * i / 600; tp.push([sx(x), sy(raw.target(x))]); }
  o += path(d(tp), 'mute');
  o += path(d(raw.dense.map(([x, y]) => [sx(x), sy(Math.max(-0.1, Math.min(1.1, y)))])), 'ink-b');
  o += path(d(enc.dense.map(([x, y]) => [sx(x), sy(Math.max(-0.1, Math.min(1.1, y)))])), 'ln');
  const ps = (r) => (10 * Math.log10(1 / r.loss[r.loss.length - 1])).toFixed(1);
  o += line(70, 98, 92, 98, 'ink-b') + text(98, 102, `输入 x：${ps(raw)} dB`, 'tb', 'start');
  o += line(236, 98, 258, 98, 'ln') + text(264, 102, `输入 γ(x)，L = 4：${ps(enc)} dB`, 'tl', 'start');
  o += line(450, 98, 472, 98, 'mute') + text(478, 102, 'target', 'ts', 'start');
  return svg(560, 300, o, '同一个两层 MLP 用 Adam 训练 600 步拟合一行 image：直接输入 x 只学到平滑的部分，输入 positional encoding 后连方波的边都学到了');
}

// ---------- 第 4 站：平面里的 inverse volume rendering（动图） ----------
let FIT = null;
function fitData() {
  if (FIT) return FIT;
  const N = 16, h = 2 / N, dt = 0.04;
  const gtS = (x, y) => { if ((x + 0.35) ** 2 + (y - 0.25) ** 2 < 0.35 ** 2) return [12, 1]; if (Math.abs(x - 0.4) < 0.25 && Math.abs(y + 0.3) < 0.25) return [12, 0.45]; return [0, 0]; };
  const cams = []; for (let k = 0; k < 8; k++) { const a = 2 * Math.PI * k / 8 + 0.2; cams.push({ o: [2.4 * Math.cos(a), 2.4 * Math.sin(a)], f: [-Math.cos(a), -Math.sin(a)] }); }
  const P = 32, fov = 50 * Math.PI / 180, rays = [];
  for (const c of cams) for (let p = 0; p < P; p++) { const u = Math.tan(fov / 2) * (-1 + 2 * (p + 0.5) / P); const dd = [c.f[0] - u * c.f[1], c.f[1] + u * c.f[0]], n = Math.hypot(...dd); rays.push({ o: c.o, d: [dd[0] / n, dd[1] / n] }); }
  const gt = rays.map((r) => { let T = 1, C = 0; const s = 0.005; for (let t = 0.9; t < 3.9; t += s) { const [sg, c] = gtS(r.o[0] + t * r.d[0], r.o[1] + t * r.d[1]); const a = 1 - Math.exp(-sg * s); C += T * a * c; T *= 1 - a; } return C; });
  const ts = []; for (let t = 0.95; t < 3.85; t += dt) ts.push(t);
  const samp = rays.map((r) => ts.map((t) => { const x = r.o[0] + t * r.d[0], y = r.o[1] + t * r.d[1]; const i = Math.floor((x + 1) / h), j = Math.floor((y + 1) / h); return i >= 0 && i < N && j >= 0 && j < N ? j * N + i : -1; }));
  const a = new Float64Array(N * N).fill(Math.log(0.5)), b = new Float64Array(N * N);
  const ma = new Float64Array(N * N), va = new Float64Array(N * N), mb = new Float64Array(N * N), vb = new Float64Array(N * N);
  const its = [0, 2, 5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 400], snaps = {}, loss = [], lr = 0.08;
  const render = (r) => { const ks = samp[r]; let T = 1, C = 0; for (const k of ks) { const s = k < 0 ? 0 : Math.exp(a[k]), c = k < 0 ? 0 : 1 / (1 + Math.exp(-b[k])), al = 1 - Math.exp(-s * dt); C += T * al * c; T *= 1 - al; } return C; };
  for (let itn = 0; itn <= 400; itn++) {
    const ga = new Float64Array(N * N), gb = new Float64Array(N * N); let L = 0;
    for (let r = 0; r < rays.length; r++) {
      const ks = samp[r], n = ks.length, al = new Float64Array(n), cc = new Float64Array(n), Tt = new Float64Array(n + 1); Tt[0] = 1; let C = 0;
      for (let i = 0; i < n; i++) { const k = ks[i]; const s = k < 0 ? 0 : Math.exp(a[k]); cc[i] = k < 0 ? 0 : 1 / (1 + Math.exp(-b[k])); al[i] = 1 - Math.exp(-s * dt); C += Tt[i] * al[i] * cc[i]; Tt[i + 1] = Tt[i] * (1 - al[i]); }
      const e = C - gt[r]; L += e * e; const dC = (2 * e) / rays.length; let S = 0;
      for (let i = n - 1; i >= 0; i--) { const k = ks[i]; if (k >= 0) { const s = Math.exp(a[k]); ga[k] += dC * dt * (Tt[i + 1] * cc[i] - S) * s; gb[k] += dC * Tt[i] * al[i] * cc[i] * (1 - cc[i]); } S += Tt[i] * al[i] * cc[i]; }
    }
    loss.push(L / rays.length);
    if (its.includes(itn)) snaps[itn] = { occ: Array.from(a, (v) => 1 - Math.exp(-Math.exp(v) * h)), col: Array.from(b, (v) => 1 / (1 + Math.exp(-v))), img: Array.from({ length: P }, (_, p) => render(p)) };
    if (itn === 400) break;
    const t = itn + 1;
    for (let k = 0; k < N * N; k++) {
      ma[k] = 0.9 * ma[k] + 0.1 * ga[k]; va[k] = 0.999 * va[k] + 0.001 * ga[k] ** 2; a[k] -= lr * (ma[k] / (1 - 0.9 ** t)) / (Math.sqrt(va[k] / (1 - 0.999 ** t)) + 1e-8);
      mb[k] = 0.9 * mb[k] + 0.1 * gb[k]; vb[k] = 0.999 * vb[k] + 0.001 * gb[k] ** 2; b[k] -= lr * (mb[k] / (1 - 0.9 ** t)) / (Math.sqrt(vb[k] / (1 - 0.999 ** t)) + 1e-8);
    }
  }
  FIT = { N, cams, gt: gt.slice(0, P), its, snaps, loss, P };
  return FIT;
}
function fitA() {
  const F = fitData(), { N, its, snaps, loss, P } = F;
  const S = 176, X0 = 52, Y0 = 56, cs = S / N;
  const sx = lin(-1, 1, X0, X0 + S), sy = lin(-1, 1, Y0 + S, Y0);
  let o = text(X0 + S / 2, 14, '16 × 16 grid 里的 σ 与 c', 'tb', 'middle');
  o += rect(X0, Y0, S, S, 'frame');
  const dur = 10, hold = 2, h0 = 1.4 / dur, kt = [0, h0, ...its.map((i) => h0 + 0.002 + (i / 400) * (dur - hold - 1.4) / dur)]; kt.push(1);
  const seq = [400, 400, ...its, 400];
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = j * N + i, vals = seq.map((itn) => (snaps[itn].occ[k] * snaps[itn].col[k]).toFixed(3));
    o += `<rect x="${f1(X0 + i * cs)}" y="${f1(Y0 + S - (j + 1) * cs)}" width="${f1(cs + 0.2)}" height="${f1(cs + 0.2)}" class="ink-f" opacity="${vals[0]}">${anim('opacity', vals, kt, dur, true)}</rect>`;
  }
  // ground truth 轮廓
  const circ = []; for (let k = 0; k <= 60; k++) { const a = k / 60 * 2 * Math.PI; circ.push([sx(-0.35 + 0.35 * Math.cos(a)), sy(0.25 + 0.35 * Math.sin(a))]); }
  o += path(d(circ), 'ln-dash') + rect(sx(0.15), sy(-0.05), sx(0.65) - sx(0.15), sy(-0.55) - sy(-0.05), 'ln-dash');
  // camera
  F.cams.forEach((c, k) => {
    const rr = S / 2 * 1.32, cx = X0 + S / 2 + c.o[0] / 2.4 * rr, cy = Y0 + S / 2 - c.o[1] / 2.4 * rr, ang = Math.atan2(c.f[1], c.f[0]) * -1;
    const tri = [[0, 0], [-9, -5], [-9, 5]].map(([u, v]) => [cx + u * Math.cos(ang) - v * Math.sin(ang), cy + u * Math.sin(ang) + v * Math.cos(ang)]);
    o += poly(tri, k === 0 ? 'ln-f' : 'paper');
  });
  o += text(X0 + S / 2, Y0 + S + 46, '虚线：ground truth 的 disk（c = 1）和 square（c = 0.45）', 'ts', 'middle');
  o += text(X0 + S / 2, Y0 + S + 62, '外圈 8 个 camera（三角形尖端朝向视线），', 'ts', 'middle') + text(X0 + S / 2, Y0 + S + 78, '不按比例；红色那个的 image 在右下', 'ts', 'middle');
  // 右上：loss（log）
  const lx = lin(0, 400, 330, 545), ly = logx(1e-4, 1, 150, 40);
  o += text(330, 20, 'photometric loss（MSE）', 'tb', 'start');
  o += axes({ sx: lx, sy: ly, x0: 0, x1: 400, y0: 1e-4, y1: 1, xt: [0, 200, 400], yt: [[1e-4, '10⁻⁴'], [1e-2, '10⁻²'], [1, '1']], xl: 'iteration', grid: true });
  o += path(d(loss.map((v, i) => [lx(i), ly(Math.max(v, 1e-4))])), 'ln');
  o += acircle(seq.map(lx), seq.map((i) => ly(Math.max(loss[i], 1e-4))), kt, dur, 5, 'ln-f');
  its.forEach((itn) => {
    const on = seq.map((v, z) => v === itn && (itn !== 400 || true));
    o += `<text x="545" y="32" class="ts" text-anchor="end" opacity="${itn === 400 ? 1 : 0}">iteration ${itn}，loss ${loss[itn].toExponential(1).replace('e-', '×10^-')}${ashow(on, kt, dur)}</text>`.replace(/×10\^-(\d+)/, (m, e) => '×10⁻' + [...e].map((ch) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[ch]).join(''));
  });
  // 右下：camera 0 的 1D image
  const ix = 330, iw = 215, pw = iw / P;
  o += text(ix, 205, '红色 camera 看到的一行 image', 'tb', 'start');
  for (let p = 0; p < P; p++) o += shade(ix + p * pw, 214, pw + 0.3, 16, F.gt[p]);
  o += rect(ix, 214, iw, 16, 'frame') + text(ix - 6, 226, 'GT', 'ts', 'end');
  for (let p = 0; p < P; p++) {
    const vals = seq.map((itn) => Math.max(0, Math.min(1, snaps[itn].img[p])).toFixed(3));
    o += `<rect x="${f1(ix + p * pw)}" y="238" width="${f1(pw + 0.3)}" height="16" class="ink-f" opacity="${vals[0]}">${anim('opacity', vals, kt, dur, true)}</rect>`;
  }
  o += rect(ix, 238, iw, 16, 'frame') + text(ix - 6, 250, 'render', 'ts', 'end');
  o += text(ix, 272, '只有 8 张 1D image 作 supervision', 'ts', 'start');
  return svgA(560, 318, o, '动图：从 8 个 camera 的 1D image 出发，用 volume rendering 和 MSE 对 16 乘 16 的 density 与 color grid 做 gradient descent；400 步内 disk 和 square 逐渐出现，loss 从 0.16 降到约 10 的负 3 次方');
}

// ---------- 第 5 站：sphere tracing ----------
function sphere() {
  const sx = lin(-2.8, 1.4, 20, 330), sy = lin(-1.3, 1.3, 270, 78);
  const u = (sx(1) - sx(0));
  let o = circle(sx(0), sy(0), u, 'wash') + circle(sx(0), sy(0), u, 'ink');
  o += text(sx(0), sy(0) + 4, 'f < 0', 'ts', 'middle');
  const trace = (y0) => { let x = -2.6; const pts = [[x, Math.hypot(x, y0) - 1]]; for (let k = 0; k < 60; k++) { const dd = Math.hypot(x, y0) - 1; if (Math.abs(dd) < 1e-3 || x > 1.3) break; x += dd; pts.push([x, Math.hypot(x, y0) - 1]); } return pts; };
  const A = trace(0.55), B = trace(0.97);
  o += arrow(sx(-2.6), sy(0.55), sx(1.3), sy(0.55), 'mute');
  A.forEach(([x, dd], k) => { if (k < A.length - 1 && dd > 0.02) o += circle(sx(x), sy(0.55), dd * u, 'dash'); o += circle(sx(x), sy(0.55), 3.2, 'ln-f'); });
  o += text(sx(-2.6), sy(0.55) + 18, 'p₀', 'tl', 'middle');
  o += text(14, 276, '最大的虚线圆：step 1 的安全 ball，radius = f(p₀) = ' + A[0][1].toFixed(3), 'ts', 'start');
  o += arrow(sx(-2.6), sy(0.97), sx(1.3), sy(0.97), 'mute');
  B.forEach(([x]) => { o += circle(sx(x), sy(0.97), 2.4, 'ink-f'); });
  o += text(sx(1.3) + 6, sy(0.97) + 4, `${B.length - 1} 步`, 'ts', 'start');
  o += text(sx(1.3) + 6, sy(0.55) + 4, `${A.length - 1} 步`, 'ts', 'start');
  o += text(sx(-2.6), sy(0.97) - 8, 'y = 0.97', 'ts', 'start') + text(sx(-2.6) + 14, sy(0.55) - 8, 'y = 0.55', 'ts', 'start');
  // 右：读数
  const X = 395; o += text(X, 44, 'ray y = 0.55 的读数', 'tb', 'start');
  A.slice(0, 5).forEach(([x, dd], k) => { o += text(X, 66 + k * 19, `x = ${fmt(x, 4)}，f = ${dd.toExponential(1).replace('e-', 'e−')}`, 'ts', 'start'); });
  o += text(X, 66 + 5 * 19 + 6, 'true hit：x = ' + fmt(-Math.sqrt(1 - 0.55 ** 2), 4), 'ts', 'start');
  o += text(X, 66 + 6 * 19 + 6, '停止条件 |f| < 10⁻³', 'ts', 'start');
  return svg(560, 284, o, 'Sphere tracing：从 x 等于负 2.6 出发沿 y 等于 0.55 的 ray 走向 radius 1 的 sphere，每步走当前的 SDF 值；虚线圆是每一步的安全球；擦边的 ray 要走 16 步');
}

// ---------- 第 6 站：Gaussian 的 projection 与 alpha blending（动图，平面里） ----------
function splatA() {
  // camera 在原点看 +z，image line 在 z = f = 1（u = f x / z）
  const G = [
    { m: [0.55, 3.0], s: [0.35, 0.12], th: 25, o: 0.8, cls: 'wash-strong', line: 'ln', name: 'A' },
    { m: [-0.2, 4.2], s: [0.5, 0.15], th: -15, o: 0.9, cls: 'solid2', line: 'ink', name: 'B' },
    { m: [0.25, 5.4], s: [0.35, 0.3], th: 0, o: 0.7, cls: 'faint-f', line: 'mute', name: 'C' },
  ];
  const cov = (g) => { const t = g.th * Math.PI / 180, c = Math.cos(t), s = Math.sin(t), a = g.s[0] ** 2, b = g.s[1] ** 2; return [[c * c * a + s * s * b, c * s * (a - b)], [c * s * (a - b), s * s * a + c * c * b]]; };
  for (const g of G) {
    const S = cov(g), [x, z] = g.m, J = [1 / z, -x / (z * z)];
    g.mu = x / z; g.var = J[0] * J[0] * S[0][0] + 2 * J[0] * J[1] * S[0][1] + J[1] * J[1] * S[1][1]; g.sd = Math.sqrt(g.var); g.S = S;
  }
  const order = [...G].sort((p, q) => p.m[1] - q.m[1]);
  // 左：俯视
  const K = 40, sx = (x) => 140 + K * x, sz = (z) => 270 - K * z;
  let o = text(140, 14, '俯视：camera 在下面，看 +z', 'tb', 'middle');
  o += poly([[sx(0) - 9, sz(0) + 12], [sx(0), sz(0)], [sx(0) + 9, sz(0) + 12]], 'paper');
  o += line(sx(-0.45), sz(1), sx(0.45), sz(1), 'ink-b') + text(sx(0.45) + 6, sz(1) + 4, 'image line（z = 1）', 'ts', 'start');
  const ell = (g, k) => { const t = g.th * Math.PI / 180, pts = []; for (let q = 0; q <= 64; q++) { const a = q / 64 * 2 * Math.PI, u = k * g.s[0] * Math.cos(a), v = k * g.s[1] * Math.sin(a); pts.push([sx(g.m[0] + u * Math.cos(t) - v * Math.sin(t)), sz(g.m[1] + u * Math.sin(t) + v * Math.cos(t))]); } return d(pts) + 'Z'; };
  for (const g of [...G].reverse()) {
    o += path(ell(g, 2), g.cls) + path(ell(g, 2), g.line);
    // footprint：image 上 μ ± 2 sd，连回 camera
    const lo = g.mu - 2 * g.sd, hi = g.mu + 2 * g.sd;
    o += line(sx(0), sz(0), sx(lo * 1.0 * g.m[1]) , sz(g.m[1]), 'grid') + line(sx(0), sz(0), sx(hi * g.m[1]), sz(g.m[1]), 'grid');
    o += line(sx(lo), sz(1), sx(hi), sz(1), g.line === 'ln' ? 'ln' : 'ink-b');
    o += text(sx(g.m[0]) + 2 * g.s[0] * K + 8, sz(g.m[1]) + 4, g.name, 'tb', 'start');
  }
  // 右：image line 上每个 pixel 的 weight 叠起来，和 T(u)
  const ux = lin(-0.45, 0.45, 300, 545), uy = lin(0, 1, 250, 60);
  o += text(300, 14, 'image 上每个 pixel：按 depth 依次 blending', 'tb', 'start');
  o += axes({ sx: ux, sy: uy, x0: -0.45, x1: 0.45, y0: 0, y1: 1, xt: [[-0.4, '−0.4'], [0, '0'], [0.4, '0.4']], yt: [0, 0.5, 1], xl: 'image 坐标 u = x / z', grid: true });
  const U = []; for (let i = 0; i <= 180; i++) U.push(-0.45 + 0.9 * i / 180);
  const state = (k) => U.map((u) => { let T = 1; const ws = []; for (let q = 0; q < k; q++) { const g = order[q]; let a = g.o * Math.exp(-0.5 * (u - g.mu) ** 2 / g.var); a = Math.min(a, 0.99); if (a < 1 / 255) a = 0; ws.push(T * a); T *= 1 - a; } return { ws, T }; });
  const frames = [0, 1, 2, 3].map(state);
  const dur = 9, kt = [0, 0.2, 0.4, 0.6, 0.8, 1], seqF = [3, 0, 1, 2, 3, 3];
  // 堆叠 area（每帧画一层，用 ashow 切换）
  for (let f = 1; f <= 3; f++) {
    const on = seqF.map((s) => s === f);
    let grp = '';
    for (let q = 0; q < f; q++) {
      const top = frames[f].map((st, i) => [ux(U[i]), uy(st.ws.slice(0, q + 1).reduce((s, v) => s + v, 0))]);
      const bot = frames[f].map((st, i) => [ux(U[i]), uy(st.ws.slice(0, q).reduce((s, v) => s + v, 0))]).reverse();
      grp += path(d([...top, ...bot]) + 'Z', order[q].cls) + path(d(top), order[q].line === 'ln' ? 'ln' : 'ink');
    }
    grp += path(d(frames[f].map((st, i) => [ux(U[i]), uy(st.T)])), 'ln-dash');
    o += `<g opacity="${f === 3 ? 1 : 0}">${ashow(on, kt, dur)}${grp}</g>`;
  }
  o += `<g opacity="0">${ashow(seqF.map((s) => s === 0), kt, dur)}${path(d(U.map((u) => [ux(u), uy(1)])), 'ln-dash')}</g>`;
  ['还没有 Gaussian：T = 1', '加上最近的 A', '再加上 B：A 挡住的地方 B 只拿到剩下的', '最后加上 C：weight 之和 + T = 1'].forEach((s, f) => {
    o += `<text x="300" y="36" class="ts" text-anchor="start" opacity="${f === 3 ? 1 : 0}">${s}${ashow(seqF.map((q) => q === f), kt, dur)}</text>`;
  });
    // 读数：u = 0.1 处
  const u0 = 0.1, i0 = Math.round((u0 + 0.45) / 0.9 * 180);
  const fin = frames[3][i0];
  o += line(ux(u0), uy(0), ux(u0), uy(1), 'grid');
  o += text(20, 296, 'A：z = 3，o = 0.8　B：z = 4.2，o = 0.9　C：z = 5.4，o = 0.7', 'ts', 'start');
  o += text(300, 314, `u = 0.1：weight ${order.map((g, q) => g.name + ' ' + fin.ws[q].toFixed(2)).join('，')}，T ${fin.T.toFixed(2)}`, 'ts', 'start');
  return svgA(560, 322, o, '动图：俯视平面里的三个 Gaussian 投影到 image line 上，按 depth 从近到远依次 blending；右边每个 pixel 的 weight 一层层叠起来，剩下的 transmittance 逐渐降低');
}

// ---------- 第 7 站：Plücker coordinates ----------
function plucker() {
  // 斜二测：world z 朝右上
  const C = [120, 170], s = 40;
  const Pj = ([x, y, z]) => [C[0] + s * (x * 1.0 + z * 0.62), C[1] - s * (y * 1.0 + z * 0.42)];
  let o = '';
  for (const [v, lab] of [[[1.6, 0, 0], 'x'], [[0, 2.8, 0], 'y'], [[0, 0, 4.6], 'z']]) { const b = Pj(v); o += arrow(C[0], C[1], b[0], b[1], 'mute', 6) + text(b[0] + 6, b[1] + 4, lab, 'ts', 'start'); }
  o += circle(C[0], C[1], 3.5, 'ink-f') + text(C[0] - 8, C[1] + 16, 'world origin', 'ts', 'end');
  const o1 = [1, 2, 0], o2 = [1, 2, 3], dd = [0, 0, 1];
  const L0 = Pj([1, 2, -0.8]), L1 = Pj([1, 2, 4.6]);
  o += line(L0[0], L0[1], L1[0], L1[1], 'ln');
  o += text(L1[0] + 6, L1[1], 'ray 所在的 line', 'tl', 'start');
  const p1 = Pj(o1), p2 = Pj(o2), q1 = Pj([1, 2, 1]);
  o += circle(p1[0], p1[1], 4.5, 'ink-f') + text(p1[0] + 8, p1[1] + 16, 'o = (1, 2, 0)', 'ts', 'start');
  o += circle(p2[0], p2[1], 4.5, 'paper') + text(p2[0] + 8, p2[1] + 14, "o′ = o + 3d = (1, 2, 3)", 'ts', 'start');
  o += arrow(p1[0], p1[1], q1[0], q1[1], 'ink-b') + text(q1[0] + 8, q1[1] + 12, 'd = (0, 0, 1)', 'ts', 'start');
  // 原点到 line 的垂线（foot = (1,2,0)），以及 m = (2, −1, 0)
  o += line(C[0], C[1], p1[0], p1[1], 'dash');
  const mm = Pj([2, -1, 0]);
  o += arrow(C[0], C[1], mm[0], mm[1], 'ln');
  o += text(mm[0] + 6, mm[1] + 4, 'm = o × d = (2, −1, 0)', 'tl', 'start');
  o += text(330, 100, 'Plücker：(d, m)，m = o × d', 'tb', 'start');
  o += text(330, 122, '把 o 沿 line 挪到 o′：', 'ts', 'start');
  o += text(330, 140, "o′ × d = o × d + 3 d × d = m", 'ts', 'start');
  o += text(330, 164, '|m| = √5 = origin 到 line 的距离', 'ts', 'start');
  o += text(330, 182, 'm 垂直于 origin 和 line 所在的 plane', 'ts', 'start');
  return svg(560, 250, o, '一条平行于 z 轴、过点 (1, 2, 0) 的 line，两个不同的 origin 给出同一个 moment m 等于 (2, 负 1, 0)，它的长度是 origin 到 line 的距离根号 5');
}

// ---------- 第 7 站：SDS 的 loop，和 1D 例子里 seed 全部塌到 mode ----------
function sds() {
  let o = '';
  const box = (x, y, w, h, t1, t2, cls = 'paper') => rect(x, y, w, h, cls, 6) + text(x + w / 2, y + (t2 ? 18 : 24), t1, 'tb', 'middle') + (t2 ? text(x + w / 2, y + 35, t2, 'ts', 'middle') : '');
  o += box(10, 20, 110, 44, 'θ：NeRF', '要 optimize 的');
  o += box(150, 20, 120, 44, '随机 camera', 'render x = g(θ)');
  o += box(300, 20, 110, 44, '加 noise', 'z = αₜx + σₜε');
  o += box(440, 20, 115, 44, 'frozen U-Net', 'ε̂(z; y, t)', 'wash');
  o += arrow(120, 42, 148, 42) + arrow(270, 42, 298, 42) + arrow(410, 42, 438, 42);
  o += path('M497 64 L497 96 L80 96 L80 66', 'ln') + poly([[80, 66], [76, 74], [84, 74]], 'ln-f');
  o += text(290, 112, 'gradient = w(t)(ε̂ − ε) · ∂x/∂θ：不经过 U-Net 的 Jacobian', 'tl', 'middle');
  // 下：1D 例子
  const r = rng(11), mu = 2, s0 = 0.5, steps = 300, lr = 0.05;
  const sx = lin(0, steps, 70, 330), sy = lin(-3, 4, 260, 140);
  o += axes({ sx, sy, x0: 0, x1: steps, y0: -3, y1: 4, xt: [0, 100, 200, 300], yt: [-2, 0, 2, 4], xl: 'iteration', grid: true });
  o += text(70, 132, '1D：x = θ，prior N(2, 0.5²)，6 个 seed', 'tb', 'start');
  const finals = [];
  for (const x0 of [-2.5, -1.2, 0, 1, 3, 3.8]) {
    let x = x0; const pts = [[sx(0), sy(x)]];
    for (let k = 1; k <= steps; k++) { const t = 0.02 + 0.96 * r(), sg = Math.sqrt(t), al = Math.sqrt(1 - t), e = gauss(r); const z = al * x + sg * e; const eh = sg * (z - al * mu) / (al * al * s0 * s0 + sg * sg); x -= lr * (eh - e); pts.push([sx(k), sy(x)]); }
    finals.push(x); o += path(d(pts), 'ln');
  }
  const mean = finals.reduce((a, b) => a + b, 0) / finals.length, sd = Math.sqrt(finals.reduce((a, b) => a + (b - mean) ** 2, 0) / finals.length);
  // 右：真正的 sample 的 spread
  const px = lin(-3, 4, 260, 140);
  const dens = (x) => Math.exp(-0.5 * ((x - mu) / s0) ** 2);
  const pts = []; for (let k = 0; k <= 120; k++) { const x = -3 + 7 * k / 120; pts.push([360 + 60 * dens(x), px(x)]); }
  o += path(d(pts), 'ink') + line(360, px(-3), 360, px(4), 'axis');
  o += text(368, px(3.4), 'prior 本身：sd = 0.5', 'ts', 'start');
  o += text(400, 196, `SDS 之后 6 个 x：`, 'ts', 'start');
  o += text(400, 214, `mean ${mean.toFixed(2)}，sd ${sd.toFixed(2)}`, 'tl', 'start');
  o += text(400, 232, '全部挤到 mode', 'ts', 'start');
  return svg(560, 290, o, '上：score distillation sampling 的 loop，render、加 noise、frozen diffusion model 预测 noise、残差回传到 NeRF；下：一维例子里 6 个起点在 SDS 下都收敛到 prior 的 mode 2');
}

// ---------- 第 8 站：PointNet 的 shared MLP 与 max pooling ----------
function pointnet() {
  const pts = [[0.1, 0.0], [0.9, 0.05], [0.95, 0.9], [0.15, 1.0], [0.2, 2.0], [0.5, 0.55]];
  const h = ([x, y]) => [x, y, Math.max(0, x - y)];
  const F = pts.map(h), G = [0, 1, 2].map((c) => Math.max(...F.map((f) => f[c])));
  const arg = [0, 1, 2].map((c) => F.findIndex((f) => f[c] === G[c]));
  const sx = lin(-0.2, 1.3, 30, 200), sy = lin(-0.2, 2.2, 250, 30);
  let o = text(115, 20, '6 个点（2D）', 'tb', 'middle');
  o += line(sx(-0.1), sy(0), sx(1.2), sy(0), 'grid') + line(sx(0), sy(-0.1), sx(0), sy(2.1), 'grid');
  pts.forEach((p, i) => {
    const crit = arg.includes(i);
    o += circle(sx(p[0]), sy(p[1]), crit ? 6 : 4.5, crit ? 'ln-f' : 'ink-f');
    o += text(sx(p[0]) + 9, sy(p[1]) + 4, 'p' + (i + 1), 'ts', 'start');
  });
  o += text(115, 272, '红点：某个 channel 的 max 来自它', 'ts', 'middle');
  // 右：feature 表
  const X = 250, cw = 74, rh = 24, Y = 50;
  o += text(X, 20, 'shared h(p) = (x, y, ReLU(x − y))', 'tb', 'start');
  ['point', 'h₁ = x', 'h₂ = y', 'h₃'].forEach((s, c) => { o += text(X + c * cw + (c ? cw / 2 : 0), Y - 8, s, 'ts', c ? 'middle' : 'start'); });
  F.forEach((f, i) => {
    o += text(X, Y + 16 + i * rh, 'p' + (i + 1), 't', 'start');
    f.forEach((v, c) => { const hot = arg[c] === i; if (hot) o += rect(X + (c + 1) * cw + 6, Y + i * rh + 2, cw - 12, rh - 4, 'wash', 4); o += text(X + (c + 1) * cw + cw / 2, Y + 16 + i * rh, v.toFixed(2), hot ? 'tl' : 't', 'middle'); });
  });
  const yy = Y + 6 * rh + 10;
  o += line(X, yy - 4, X + 4 * cw, yy - 4, 'ink');
  o += text(X, yy + 14, 'max', 'tb', 'start');
  G.forEach((v, c) => { o += text(X + (c + 1) * cw + cw / 2, yy + 14, v.toFixed(2), 'tl', 'middle'); });
  o += text(X, yy + 40, '把 6 行任意重排，每一列的 max 不变', 'ts', 'start');
  return svg(560, 280, o, 'PointNet 的 toy 版：6 个二维点各自经过同一个 h，三个 channel 分别取 max；取到 max 的点是 critical point');
}

export default {
  'cmu-16825-ambig': ambig,
  'cmu-16825-repr': repr,
  'cmu-16825-chamfer': chamfer,
  'cmu-16825-soft': soft,
  'cmu-16825-ray': rayA,
  'cmu-16825-pe': pe,
  'cmu-16825-fit': fitA,
  'cmu-16825-sphere': sphere,
  'cmu-16825-splat': splatA,
  'cmu-16825-plucker': plucker,
  'cmu-16825-sds': sds,
  'cmu-16825-pointnet': pointnet,
};
