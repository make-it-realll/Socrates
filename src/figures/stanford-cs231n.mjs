import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, anim, ashow, f1 } from '../lib/svg.mjs';

// 小工具
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const gauss = (r) => () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
const iou = (a, b) => {
  const iw = Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])), ih = Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]));
  const I = iw * ih; return I / ((a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - I);
};
const cwh = (cx, cy, w, h) => [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
// 带离散动画的元素
const showT = (x, y, s, cls, anchor, on, kt, T) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" opacity="${on[0] ? 1 : 0}">${s}${ashow(on, kt, T)}</text>`;
const showR = (x, y, w, h, cls, on, kt, T) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" class="${cls}" opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}</rect>`;
const showP = (pts, cls, on, kt, T) => `<polygon points="${pts.map(([x, y]) => f1(x) + ',' + f1(y)).join(' ')}" class="${cls}" opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}</polygon>`;
const moveR = (xs, ys, w, h, cls, kt, T) => `<rect x="${f1(xs[0])}" y="${f1(ys[0])}" width="${f1(w)}" height="${f1(h)}" class="${cls}">${anim('x', xs.map(f1), kt, T, true)}${anim('y', ys.map(f1), kt, T, true)}</rect>`;
const fmt = (v) => (v < 0 ? '−' : '') + Math.abs(v);

// ---------- 开头 / 第 1 站：raw pixel 上的 nearest neighbor ----------
const LET = (() => {
  const z = () => Array.from({ length: 8 }, () => Array(8).fill(0));
  const T = z(); for (let c = 1; c < 7; c++) T[1][c] = 1; for (let r = 2; r < 7; r++) T[r][3] = 1;
  const Ts = T.map((row) => row.map((_, c) => row[(c + 7) % 8]));
  const G = z(); for (let c = 1; c < 7; c++) G[1][c] = 1; for (let r = 2; r < 7; r++) G[r][1] = 1;
  const P = z(); for (let c = 1; c < 7; c++) P[3][c] = 1; for (let r = 1; r < 7; r++) P[r][3] = 1;
  return { T, Ts, G, P, E: z() };
})();
function pixeldist() {
  const c = 9, L1 = (A, B) => A.reduce((s, row, r) => s + row.reduce((t, v, k) => t + Math.abs(v - B[r][k]), 0), 0);
  const img = (X, x0, y0) => {
    let o = '';
    for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) if (X[r][k]) o += rect(x0 + k * c, y0 + r * c, c, c, 'ink-f');
    for (let k = 1; k < 8; k++) o += line(x0 + k * c, y0, x0 + k * c, y0 + 8 * c, 'grid') + line(x0, y0 + k * c, x0 + 8 * c, y0 + k * c, 'grid');
    return o + rect(x0, y0, 8 * c, 8 * c, 'frame');
  };
  let o = text(52, 30, 'test image', 'tb', 'middle') + img(LET.Ts, 16, 44) + text(52, 136, 'T 右移 1 pixel', 'ts', 'middle');
  o += line(118, 22, 118, 170, 'grid') + text(337, 14, 'training set 里的 4 张 image 和它的 L1 distance', 'ts', 'middle');
  const tr = [['T', LET.T], ['Γ', LET.G], ['+', LET.P], ['空白', LET.E]];
  const ds = tr.map(([, X]) => L1(LET.Ts, X)), best = ds.indexOf(Math.min(...ds));
  tr.forEach(([nm, X], i) => {
    const x0 = 140 + i * 106;
    o += text(x0 + 36, 36, 'label：' + nm, 't', 'middle') + img(X, x0, 44);
    o += text(x0 + 36, 136, 'L1 = ' + ds[i], i === best ? 'tl' : 't', 'middle');
    if (i === best) o += rect(x0 - 4, 40, 80, 80, 'ln') + text(x0 + 36, 154, '最近', 'tl', 'middle');
  });
  o += text(280, 186, 'L1 只数有几个 pixel 不同：右移一格，T 的 stem 整列对不上，反而离“空白”最近。', 'ts', 'middle');
  return svg(560, 192, o, '一个 8 乘 8 的字母 T 右移一个 pixel 后，与原来的 T 的 L1 distance 是 12，比与空白 image 的 11 还大，nearest neighbor 会把它判成空白');
}

// ---------- 第 2 站：conv 的滑窗计算（动图） ----------
const CX = [[2, 0, 1, 1, 0], [1, 2, 2, 0, 1], [0, 1, 2, 2, 0], [1, 0, 1, 2, 1], [2, 1, 0, 1, 2]];
const CW = [[1, 0, -1], [1, 0, -1], [1, 0, -1]], CB = 1;
const convOut = () => {
  const Xp = Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, k) => (r >= 1 && r <= 5 && k >= 1 && k <= 5 ? CX[r - 1][k - 1] : 0)));
  const out = [], prods = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const pr = []; let s = 0;
    for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) { const p = CW[u][v] * Xp[2 * i + u][2 * j + v]; pr.push(p); s += p; }
    prods.push(pr); out.push(s + CB);
  }
  return { Xp, out, prods };
};
function convA() {
  const { Xp, out, prods } = convOut();
  const n = 9, step = 1.3, T = n * step + 1.2, kt = Array.from({ length: n }, (_, f) => (f * step) / T);
  const c = 24, ix = 20, iy = 48, fx = 236, fy = 48, px = 236, py = 168, ox = 384, oy = 72, oc = 40;
  let o = text(ix + 3.5 * c, 22, 'input 5×5，四周 pad 1 圈 0', 'tb', 'middle') + text(ix + 3.5 * c, 38, '（灰格是 padding）', 'ts', 'middle');
  for (let r = 0; r < 7; r++) for (let k = 0; k < 7; k++) {
    const pad = r === 0 || r === 6 || k === 0 || k === 6;
    o += rect(ix + k * c, iy + r * c, c, c, pad ? 'wash2' : 'paper-f') + text(ix + k * c + c / 2, iy + r * c + 16, String(Xp[r][k]), pad ? 'ts' : 't', 'middle');
  }
  for (let k = 0; k <= 7; k++) o += line(ix + k * c, iy, ix + k * c, iy + 7 * c, 'grid') + line(ix, iy + k * c, ix + 7 * c, iy + k * c, 'grid');
  const wx = [], wy = [];
  for (let f = 0; f < n; f++) { wx.push(ix + 2 * (f % 3) * c); wy.push(iy + 2 * Math.floor(f / 3) * c); }
  o += moveR(wx, wy, 3 * c, 3 * c, 'ln', kt, T);
  o += text(fx + 1.5 * c, 22, 'filter 3×3', 'tb', 'middle') + text(fx + 1.5 * c, 38, 'b = ' + CB, 'ts', 'middle');
  for (let u = 0; u < 3; u++) for (let v = 0; v < 3; v++) o += rect(fx + v * c, fy + u * c, c, c, 'wash') + text(fx + v * c + c / 2, fy + u * c + 16, fmt(CW[u][v]), 't', 'middle');
  o += rect(fx, fy, 3 * c, 3 * c, 'frame');
  o += text(px + 1.5 * c, py - 10, 'window × filter，逐格相乘', 'ts', 'middle');
  for (let u = 0; u <= 3; u++) o += line(px + u * c, py, px + u * c, py + 3 * c, 'grid') + line(px, py + u * c, px + 3 * c, py + u * c, 'grid');
  for (let f = 0; f < n; f++) {
    const on = kt.map((_, g) => g === f);
    prods[f].forEach((p, q) => { o += showT(px + (q % 3) * c + c / 2, py + Math.floor(q / 3) * c + 16, fmt(p), 't', 'middle', on, kt, T); });
    const s = prods[f].reduce((a, b) => a + b, 0);
    o += showT(280, 276, `output[${Math.floor(f / 3)}][${f % 3}] = 9 个乘积之和 + b = ${fmt(s)} + ${CB} = ${fmt(out[f])}`, 'tb', 'middle', on, kt, T);
  }
  o += text(ox + 1.5 * oc, 30, 'output 3×3', 'tb', 'middle') + text(ox + 1.5 * oc, 46, '(5 − 3 + 2·1) / 2 + 1 = 3', 'ts', 'middle');
  for (let q = 0; q < 9; q++) o += rect(ox + (q % 3) * oc, oy + Math.floor(q / 3) * oc, oc, oc, 'paper') + text(ox + (q % 3) * oc + oc / 2, oy + Math.floor(q / 3) * oc + 25, fmt(out[q]), 't', 'middle');
  o += moveR(wx.map((_, f) => ox + (f % 3) * oc), wy.map((_, f) => oy + Math.floor(f / 3) * oc), oc, oc, 'ln', kt, T);
  o += text(ox + 1.5 * oc, oy + 3 * oc + 22, 'stride 2：window 每次跳 2 格', 'ts', 'middle');
  return svgA(560, 288, o, '动图：5 乘 5 的 input 四周补一圈 0，3 乘 3 的 filter 以 stride 2 滑过 9 个位置，每个位置逐格相乘再加 bias，得到 3 乘 3 的 output');
}

// ---------- 第 3 站：receptive field 一层层长大（动图） ----------
function rfA() {
  // 每个 panel：rows 从上到下；每行 {name, n, w(格宽倍数), lo, hi(高亮区间，按本行的格编号)}
  const P1 = { title: '三层 3×3 conv，stride 1', x0: 96, c: 26, rows: [
    { nm: 'conv3', n: 9, s: 1, lo: 4, hi: 4, rf: 1 }, { nm: 'conv2', n: 9, s: 1, lo: 3, hi: 5, rf: 3 }, { nm: 'conv1', n: 9, s: 1, lo: 2, hi: 6, rf: 5 }, { nm: 'input', n: 9, s: 1, lo: 1, hi: 7, rf: 7 }] };
  const P2 = { title: '中间插一层 2×2 max pool（stride 2）', x0: 96, c: 20, rows: [
    { nm: 'conv3', n: 8, s: 2, lo: 3, hi: 3, rf: 1 }, { nm: 'conv2', n: 8, s: 2, lo: 2, hi: 4, rf: 3 }, { nm: 'pool', n: 8, s: 2, lo: 1, hi: 5, rf: 5 }, { nm: 'conv1', n: 16, s: 1, lo: 2, hi: 11, rf: 10 }, { nm: 'input', n: 16, s: 1, lo: 1, hi: 12, rf: 12 }] };
  // 动画帧：0 = 完整；1 = 只有顶层；之后每帧往下多一层；最后一帧完整并停住
  const maxL = 5, frames = [0, 1, 2, 3, 4, 5], dur = [2.4, 0.9, 0.9, 0.9, 0.9, 2.0];
  const T = dur.reduce((a, b) => a + b, 0), kt = []; let acc = 0; for (const t of dur) { kt.push(acc / T); acc += t; }
  let o = '';
  const panel = (P, y0) => {
    o += text(P.x0, y0, P.title, 'tb', 'start');
    const H = 18, gap = 36;
    const L = P.rows.length;
    P.rows.forEach((R, li) => {
      const y = y0 + 14 + li * gap, cw = P.c * R.s;
      o += text(P.x0 - 10, y + 13, R.nm, 'ts', 'end');
      for (let k = 0; k < R.n; k++) o += rect(P.x0 + k * cw, y, cw, H, 'paper');
      const on = frames.map((f) => f === 0 || li <= f - 1 || (f === maxL && true));
      const cls = li === 0 ? 'solid' : 'wash-strong';
      o += showR(P.x0 + R.lo * cw, y, (R.hi - R.lo + 1) * cw, H, cls, li === 0 ? frames.map(() => true) : on, kt, T);
      const last = P.x0 + R.n * cw;
      if (li > 0) o += showT(last + 10, y + 13, li === L - 1 ? 'RF = ' + R.rf : R.rf + ' 格', li === L - 1 ? 'tl' : 'ts', 'start', on, kt, T);
      if (li > 0) {
        const U = P.rows[li - 1], uw = P.c * U.s, yu = y - gap + H;
        o += showP([[P.x0 + U.lo * uw, yu], [P.x0 + (U.hi + 1) * uw, yu], [P.x0 + (R.hi + 1) * cw, y], [P.x0 + R.lo * cw, y]], 'wash', on, kt, T);
      }
    });
    return y0 + 14 + (L - 1) * gap + H;
  };
  const b1 = panel(P1, 18);
  const b2 = panel(P2, b1 + 34);
  o += text(280, b2 + 26, '右边的数：顶上那个 unit 依赖这一行的几格。', 'ts', 'middle') + text(280, b2 + 44, 'Pool 之后一格代表 input 上 2 格，所以再往上每层 3×3 conv 在 input 上多看 4 个 pixel。', 'ts', 'middle');
  return svgA(560, b2 + 52, o, '动图：从最上层的一个 unit 往下追，看它依赖下面哪些 unit。三层 3 乘 3 conv 的 receptive field 依次是 3、5、7；中间插一层 stride 2 的 pool 后，最后是 12');
}

// ---------- 第 3 站：VGG16 的 volume、activation 和 parameter ----------
function vgg() {
  const st = [[224, 64, 2], [112, 128, 2], [56, 256, 3], [28, 512, 3], [14, 512, 3]];
  let Cin = 3; const items = [];
  st.forEach(([S, C, n]) => { let p = 0; for (let k = 0; k < n; k++) { p += 9 * (k ? C : Cin) * C + C; } Cin = C; items.push({ lab: S + '²×' + C, sub: n + ' 个 conv', acts: n * S * S * C, par: p, h: 150 * Math.sqrt(S / 224), w: 6 + 20 * C / 512 }); });
  [[7 * 7 * 512, 4096], [4096, 4096], [4096, 1000]].forEach(([a, b], i) => items.push({ lab: 'FC' + (i + 1), sub: String(b), acts: b, par: a * b + b, h: b === 1000 ? 40 : 100, w: 8 }));
  const K = (v) => (v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? Math.round(v / 1e3) + 'K' : String(v));
  const base = 196; let o = '';
  const xs = [42, 112, 180, 246, 312, 384, 448, 512];
  items.forEach((it, i) => {
    const x = xs[i];
    o += rect(x - it.w / 2, base - it.h, it.w, it.h, i < 5 ? 'wash ink-s' : 'wash2 ink-s');
    o += text(x, base - it.h - 22, it.lab, 'ts', 'middle') + text(x, base - it.h - 8, it.sub, 'ts', 'middle');
    o += text(x, base + 20, K(it.acts), i < 2 ? 'tl' : 't', 'middle') + text(x, base + 40, K(it.par), i === 5 ? 'tl' : 't', 'middle');
  });
  o += line(10, base, 550, base, 'axis');
  o += text(280, base + 64, '第一行：这一段 conv 或 FC 的 output 一共多少个数（activation）；第二行：这一段的 parameter 个数', 'ts', 'middle');
  o += text(280, base + 82, '方块高度按 spatial size 的 square root 画，宽度随 channel 数变宽', 'ts', 'middle');
  return svg(560, base + 88, o, 'VGG16 各段的 volume：activation 集中在前两段的 224 和 112 分辨率上，parameter 集中在第一个 FC 层的一亿零二百万个');
}

// ---------- 第 4 站：BN、LN、IN、GN 各在哪些数上取 mean ----------
function norms() {
  const N = 3, C = 6, R = 4, c = 12, dz = 9;
  const cube = (cx, y0, name, shade, l1, l2) => {
    const x0 = cx - (C * c + (N - 1) * dz) / 2 + (N - 1) * dz;
    let o = '';
    for (let nn = N - 1; nn >= 0; nn--) {
      const ox = x0 - nn * dz, oy = y0 + nn * dz;
      for (let ch = 0; ch < C; ch++) for (let r = 0; r < R; r++) o += rect(ox + ch * c, oy + r * c, c, c, 'paper-f');
      for (let ch = 0; ch < C; ch++) if (shade(nn, ch)) o += rect(ox + ch * c, oy, c, R * c, 'wash-strong');
      for (let k = 0; k <= C; k++) o += line(ox + k * c, oy, ox + k * c, oy + R * c, 'grid');
      for (let k = 0; k <= R; k++) o += line(ox, oy + k * c, ox + C * c, oy + k * c, 'grid');
      o += rect(ox, oy, C * c, R * c, 'ink-s paper-f').replace('paper-f"', 'frame"');
    }
    const yb = y0 + (N - 1) * dz + R * c;
    o += text(cx, yb + 20, name, 'tb', 'middle') + text(cx, yb + 38, l1, 'ts', 'middle') + text(cx, yb + 54, l2, 'ts', 'middle');
    return o;
  };
  let o = '';
  const y0 = 34;
  o += cube(72, y0, 'Batch Norm', (nn, ch) => ch === 0, '每个 channel 一组', '一组 N·H·W 个数');
  o += cube(208, y0, 'Layer Norm', (nn, ch) => nn === 0, '每个 sample 一组', '一组 C·H·W 个数');
  o += cube(344, y0, 'Instance Norm', (nn, ch) => nn === 0 && ch === 0, '每个 (sample, channel)', '一组 H·W 个数');
  o += cube(480, y0, 'Group Norm', (nn, ch) => nn === 0 && ch < 3, '每个 sample 的每组 channel', '一组 (C/G)·H·W 个数');
  // 坐标轴标注（只在第一个上）
  const x0 = 72 - (C * c + (N - 1) * dz) / 2 + (N - 1) * dz;
  o += text(x0 + C * c / 2, y0 - 8, 'C →', 'ts', 'middle') + text(x0 + C * c + 6, y0 + R * c / 2 + 4, 'H, W', 'ts', 'start');
  o += text(x0 - (N - 1) * dz - 6, y0 + (N - 1) * dz + R * c - 2, 'N', 'ts', 'end');
  o += text(280, 186, '深色格是同一组：在这一组数上算一个 mean 和一个 variance，再用它们 normalize 这一组。', 'ts', 'middle');
  return svg(560, 192, o, '四种 normalization 的分组方式：N 个 sample 叠成纵深，横向是 C 个 channel，竖向是 H 乘 W 个位置；深色部分是共用一组 mean 和 variance 的数');
}

// ---------- 第 4 站：grid search 与 random search ----------
function search() {
  const perf = (u) => Math.exp(-((u - 0.62) ** 2) / (2 * 0.06 ** 2));
  const r = rng(7);
  const rand = Array.from({ length: 9 }, () => [r(), r()]);
  const grid = []; for (const a of [1 / 6, 0.5, 5 / 6]) for (const b of [1 / 6, 0.5, 5 / 6]) grid.push([a, b]);
  let o = '';
  const panel = (x0, pts, title, note) => {
    const S = 170, y0 = 74, sx = lin(0, 1, x0, x0 + S), sy = lin(0, 1, y0 + S, y0);
    o += text(x0 + S / 2, 16, title, 'tb', 'middle');
    const cy = lin(0, 1, y0 - 6, y0 - 46);
    o += path(curve(perf, 0, 1, sx, cy), 'ln') + text(x0, y0 - 40, 'val accuracy', 'ts', 'start');
    o += rect(x0, y0, S, S, 'frame');
    for (const [u, v] of pts) { o += circle(sx(u), sy(v), 4, 'ink-f') + line(sx(u), y0 + S + 2, sx(u), y0 + S + 12, 'ink') + line(sx(u), y0 - 6, sx(u), cy(perf(u)), 'grid'); }
    o += text(x0 + S / 2, y0 + S + 30, 'learning rate（重要）', 'ts', 'middle');
    o += text(x0 - 8, y0 + S / 2, 'momentum', 'ts', 'end') + text(x0 - 8, y0 + S / 2 + 14, '（不重要）', 'ts', 'end');
    o += text(x0 + S / 2, y0 + S + 50, note, 't', 'middle');
  };
  panel(86, grid, 'Grid search：9 次', 'learning rate 只试到 3 个值');
  panel(370, rand, 'Random search：9 次', 'learning rate 试到 9 个不同的值');
  return svg(560, 300, o, '同样跑 9 次：grid search 在重要的 hyperparameter 上只试了 3 个值，random search 试了 9 个不同的值，更接近 validation accuracy 曲线的峰');
}

// ---------- 第 5 站：1D transposed convolution ----------
function tconv() {
  const a = [2, 3], w = [1, 2, 1], c = 40, x0 = 84;
  const out = [0, 0, 0, 0, 0]; a.forEach((v, i) => w.forEach((k, j) => { out[2 * i + j] += v * k; }));
  let o = text(x0 - 8, 44, 'input', 'ts', 'end');
  a.forEach((v, i) => { o += rect(x0 + 2 * i * c, 28, c, 26, 'wash ink-s') + text(x0 + 2 * i * c + c / 2, 46, String(v), 'tb', 'middle'); });
  o += text(x0 - 8, 98, '2 × filter', 'ts', 'end') + text(x0 - 8, 136, '3 × filter', 'ts', 'end');
  a.forEach((v, i) => {
    const y = 82 + i * 38;
    w.forEach((k, j) => { o += rect(x0 + (2 * i + j) * c, y, c, 26, 'paper') + text(x0 + (2 * i + j) * c + c / 2, y + 18, String(v * k), 't', 'middle'); });
  });
  o += line(x0, 158, x0 + 5 * c, 158, 'ink');
  o += text(x0 - 8, 186, 'output', 'ts', 'end');
  out.forEach((v, j) => { o += rect(x0 + j * c, 168, c, 28, j === 2 ? 'wash-strong ink-s' : 'wash ink-s') + text(x0 + j * c + c / 2, 187, String(v), 'tb', 'middle'); });
  const X = 306;
  o += text(X, 40, 'filter = (1, 2, 1)，stride 2', 'tb', 'start');
  o += text(X, 66, '每个 input 数乘上整个 filter，', 't', 'start') + text(X, 84, '放到 output 上；input 每走 1 格，', 't', 'start') + text(X, 102, '副本在 output 上走 2 格。', 't', 'start');
  o += text(X, 130, '重叠的那一格相加：2·1 + 3·1 = 5。', 't', 'start');
  o += text(X, 158, 'Output 长度 = (2 − 1) × 2 + 3 = 5', 't', 'start');
  return svg(560, 204, o, '一维 transposed convolution：input 2 和 3 各自乘上 filter 1、2、1，以 stride 2 错开放到 output 上，重叠处相加，得到 2、4、5、6、3');
}

// ---------- 第 5 站：anchor 与 IoU（动图） ----------
const GT = [336, 240, 100, 190];
const ANC = [[128, 128], [181, 91], [91, 181]];
function anchorA() {
  const s = 0.5, X0 = 20, Y0 = 28, P = (x, y) => [X0 + x * s, Y0 + y * s];
  const gt = cwh(...GT);
  const seqI = [10, 11, 12, 13, 7, 8, 9];
  const n = seqI.length, step = 1.1, T = n * step + 0.6, kt = seqI.map((_, f) => (f * step) / T);
  const res = (i) => { const cx = 32 * i + 16; const v = ANC.map(([w, h]) => iou(cwh(cx, 240, w, h), gt)); return { cx, v, best: v.indexOf(Math.max(...v)) }; };
  const lab = (m) => (m >= 0.7 ? ['positive', 'tl'] : m < 0.3 ? ['negative', 't'] : ['忽略', 't']);
  let o = text(X0, 16, 'image 640×480（画成一半大小），feature map 20×15，每格 32 pixel', 'ts', 'start');
  for (let k = 0; k <= 20; k++) o += line(...P(32 * k, 0), ...P(32 * k, 480), 'grid');
  for (let k = 0; k <= 15; k++) o += line(...P(0, 32 * k), ...P(640, 32 * k), 'grid');
  o += rect(X0, Y0, 320, 240, 'frame');
  const g0 = P(gt[0], gt[1]);
  o += rect(g0[0], g0[1], GT[2] * s, GT[3] * s, 'ink-b') + text(g0[0] + GT[2] * s / 2, g0[1] - 6, 'ground truth', 't', 'middle');
  // 三个 anchor：每个用离散动画移动
  ANC.forEach(([w, h], a) => {
    const xs = seqI.map((i) => P(32 * i + 16 - w / 2, 0)[0]), ys = seqI.map(() => P(0, 240 - h / 2)[1]);
    o += moveR(xs, ys, w * s, h * s, 'dash', kt, T);
  });
  // best anchor 高亮
  const bx = seqI.map((i) => { const r = res(i), [w] = ANC[r.best]; return P(32 * i + 16 - w / 2, 0)[0]; });
  const by = seqI.map((i) => { const r = res(i), [, h] = ANC[r.best]; return P(0, 240 - h / 2)[1]; });
  const bw = seqI.map((i) => ANC[res(i).best][0] * s), bh = seqI.map((i) => ANC[res(i).best][1] * s);
  o += `<rect x="${f1(bx[0])}" y="${f1(by[0])}" width="${f1(bw[0])}" height="${f1(bh[0])}" class="ln">${anim('x', bx.map(f1), kt, T, true)}${anim('y', by.map(f1), kt, T, true)}${anim('width', bw.map(f1), kt, T, true)}${anim('height', bh.map(f1), kt, T, true)}</rect>`;
  o += `<circle cx="${f1(P(32 * seqI[0] + 16, 0)[0])}" cy="${f1(P(0, 240)[1])}" r="3.5" class="ln-f">${anim('cx', seqI.map((i) => f1(P(32 * i + 16, 0)[0])), kt, T, true)}</circle>`;
  // 右侧读数
  const RX = 362;
  o += text(RX, 44, '这个位置的 3 个 anchor', 'tb', 'start') + text(RX, 62, '（area 都是 128²）', 'ts', 'start');
  seqI.forEach((i, f) => {
    const on = kt.map((_, g) => g === f), r = res(i), m = r.v[r.best], [lb, cl] = lab(m);
    o += showT(RX, 90, 'center x = ' + r.cx, 't', 'start', on, kt, T);
    ANC.forEach(([w, h], a) => { o += showT(RX, 114 + a * 20, `${w}×${h}：IoU ${r.v[a].toFixed(2)}`, a === r.best ? 'tb' : 't', 'start', on, kt, T); });
    o += showT(RX, 190, '最大 IoU ' + m.toFixed(2) + ' → ' + lb, cl, 'start', on, kt, T);
  });
  o += text(RX, 222, '≥ 0.7 记 positive，< 0.3 记 negative，', 'ts', 'start') + text(RX, 240, '中间的忽略，不参与 loss。', 'ts', 'start') + text(RX, 258, '粗线是 IoU 最大的那个 anchor', 'ts', 'start');
  // 下方：沿这一行每个位置的最大 IoU，横坐标和上图对齐
  const py0 = 300, py1 = 368, sy = lin(0, 1, py1, py0);
  o += line(X0, py1, X0 + 320, py1, 'axis') + line(X0, sy(0.7), X0 + 320, sy(0.7), 'ln-dash') + line(X0, sy(0.3), X0 + 320, sy(0.3), 'dash');
  o += text(X0 + 324, sy(0.7) + 4, '0.7', 'ts', 'start') + text(X0 + 324, sy(0.3) + 4, '0.3', 'ts', 'start');
  for (let i = 4; i <= 16; i++) { const r = res(i), m = r.v[r.best], x = P(r.cx, 0)[0]; o += rect(x - 5, sy(m), 10, py1 - sy(m), m >= 0.7 ? 'solid' : 'wash-strong'); }
  o += text(X0, py0 - 12, '这一行每个 anchor center 上的最大 IoU（与上图同一横坐标）', 'ts', 'start');
  o += moveR(seqI.map((i) => P(32 * i + 16, 0)[0] - 8), seqI.map(() => py0 - 4), 16, py1 - py0 + 8, 'ln', kt, T);
  return svgA(560, 376, o, '动图：anchor 的中心沿 feature map 的一行移动，每个位置有三个形状的 anchor，右边显示它们与 ground truth box 的 IoU 以及标成 positive、negative 还是忽略');
}

// ---------- 第 5 站：NMS ----------
function nms() {
  const B = { A: [[30, 40, 150, 160], 0.9], B: [[38, 48, 158, 168], 0.8], C: [[140, 60, 250, 170], 0.75], D: [[148, 52, 258, 162], 0.7] };
  const ox = 16, oy = 18, R = ([a, b, c, e]) => [ox + a, oy + b, c - a, e - b];
  const I = (p, q) => iou(B[p][0], B[q][0]);
  let o = '';
  o += `<ellipse cx="${ox + 92}" cy="${oy + 112}" rx="48" ry="42" class="wash2"/>` + `<ellipse cx="${ox + 198}" cy="${oy + 112}" rx="44" ry="40" class="wash2"/>`;
  o += text(ox + 92, oy + 116, 'dog 1', 'ts', 'middle') + text(ox + 198, oy + 116, 'dog 2', 'ts', 'middle');
  const kept = { A: true, B: false, C: true, D: false };
  for (const k of ['D', 'C', 'B', 'A']) { const [x, y, w, h] = R(B[k][0]); o += rect(x, y, w, h, kept[k] ? 'ln' : 'dash'); }
  o += text(ox + 30, oy + 34, 'A 0.9', 'tl', 'start') + text(ox + 38, oy + 184, 'B 0.8（删）', 'ts', 'start');
  o += text(ox + 168, oy + 186, 'C 0.75', 'tl', 'start') + text(ox + 258, oy + 46, 'D 0.7（删）', 'ts', 'end');
  const X = 320, f2 = (v) => v.toFixed(2);
  const lines = [
    ['1. 最高分 A（0.9）：保留', 'tb'],
    [`2. IoU(A, B) = ${f2(I('A', 'B'))} > 0.7：删 B`, 't'],
    [`    IoU(A, C) = ${f2(I('A', 'C'))}，IoU(A, D) = ${f2(I('A', 'D'))}：留下`, 'ts'],
    ['3. 剩下的最高分 C（0.75）：保留', 'tb'],
    [`4. IoU(C, D) = ${f2(I('C', 'D'))} > 0.7：删 D`, 't'],
    ['结果：A、C，每只 dog 一个 box', 'tl'],
  ];
  lines.forEach(([s, cl], i) => { o += text(X, 44 + i * 26, s, cl, 'start'); });
  o += text(X, 44 + 6 * 26 + 6, '实线：保留；虚线：被删', 'ts', 'start');
  return svg(560, 212, o, 'Non-maximum suppression 的例子：两只 dog 各有两个重叠的 detection；按分数从高到低，删去与已保留的 box 的 IoU 超过 0.7 的，最后每只 dog 留一个 box');
}

// ---------- 第 6 站：ViT 里 patch 之间的 attention（动图） ----------
const VG = ['SSSS', 'SOOS', 'GOOO', 'GGGO'];
function vitA() {
  const cls = VG.map((r) => r.split('')), N = 16, a = 2.5, dk = 3;
  const vec = (ch) => ({ O: [a, 0, 0], S: [0, a, 0], G: [0, 0, a] })[ch];
  const toks = []; for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) toks.push({ r, k, ch: cls[r][k], v: vec(cls[r][k]) });
  const att = (q) => { const lg = toks.map((t) => t.v.reduce((s, x, j) => s + x * toks[q].v[j], 0) / Math.sqrt(dk)); const m = Math.max(...lg); const e = lg.map((x) => Math.exp(x - m)); const Z = e.reduce((s, x) => s + x, 0); return e.map((x) => x / Z); };
  const queries = [5, 15, 3, 12];
  const n = queries.length, step = 2.6, T = n * step, kt = queries.map((_, f) => (f * step) / T);
  const c = 44, L = 24, Y = 52, R = 316;
  const name = { O: 'object', S: 'sky', G: 'grass' };
  let o = text(L + 2 * c, 20, '32×32 image 切成 4×4 = 16 个 patch', 'tb', 'middle') + text(L + 2 * c, 38, '（A3 的 ViT 默认就是这个大小）', 'ts', 'middle');
  toks.forEach((t) => { o += rect(L + t.k * c, Y + t.r * c, c, c, t.ch === 'O' ? 'wash-strong' : t.ch === 'G' ? 'wash2' : 'paper-f') + text(L + t.k * c + c / 2, Y + t.r * c + 26, name[t.ch], 'ts', 'middle'); });
  for (let k = 0; k <= 4; k++) o += line(L + k * c, Y, L + k * c, Y + 4 * c, 'grid') + line(L, Y + k * c, L + 4 * c, Y + k * c, 'grid');
  o += rect(L, Y, 4 * c, 4 * c, 'frame');
  // query 框 和 3×3 conv window（虚线）
  const qx = queries.map((q) => L + toks[q].k * c), qy = queries.map((q) => Y + toks[q].r * c);
  const wx = queries.map((q) => L + Math.max(0, toks[q].k - 1) * c), wy = queries.map((q) => Y + Math.max(0, toks[q].r - 1) * c);
  const ww = queries.map((q) => (Math.min(3, toks[q].k + 1) - Math.max(0, toks[q].k - 1) + 1) * c), wh = queries.map((q) => (Math.min(3, toks[q].r + 1) - Math.max(0, toks[q].r - 1) + 1) * c);
  o += `<rect x="${f1(wx[0])}" y="${f1(wy[0])}" width="${f1(ww[0])}" height="${f1(wh[0])}" class="ln-dash">${anim('x', wx.map(f1), kt, T, true)}${anim('y', wy.map(f1), kt, T, true)}${anim('width', ww.map(f1), kt, T, true)}${anim('height', wh.map(f1), kt, T, true)}</rect>`;
  o += moveR(qx, qy, c, c, 'ink-b', kt, T);
  o += text(L, Y + 4 * c + 20, '粗框：query patch', 't', 'start') + text(L, Y + 4 * c + 38, '虚线：一层 3×3 conv 在这里能看到的范围', 'ts', 'start');
  // 右：attention weight
  o += text(R + 2 * c, 20, 'query 对 16 个 patch 的 attention weight', 'tb', 'middle') + text(R + 2 * c, 38, 'softmax(q·k / √3)，每张图之和为 1', 'ts', 'middle');
  queries.forEach((q, f) => {
    const w = att(q), on = kt.map((_, g) => g === f), mx = Math.max(...w);
    toks.forEach((t, i) => {
      o += `<rect x="${R + t.k * c}" y="${Y + t.r * c}" width="${c}" height="${c}" class="solid" opacity="${on[0] ? f1(0.85 * w[i] / mx) : 0}">${anim('opacity', on.map((v) => (v ? f1(0.85 * w[i] / mx) : 0)), kt, T, true)}</rect>`;
      o += showT(R + t.k * c + c / 2, Y + t.r * c + 27, w[i].toFixed(w[i] < 0.01 ? 3 : 2), w[i] > 0.5 * mx ? 'tw' : 'ts', 'middle', on, kt, T);
    });
    const same = toks.reduce((s, t, i) => s + (t.ch === toks[q].ch ? w[i] : 0), 0), cnt = toks.filter((t) => t.ch === toks[q].ch).length;
    const outside = toks.filter((t) => t.ch === toks[q].ch && (Math.abs(t.r - toks[q].r) > 1 || Math.abs(t.k - toks[q].k) > 1)).length;
    o += showT(R, Y + 4 * c + 20, `${cnt} 个 ${name[toks[q].ch]} patch 合计 ${same.toFixed(2)}`, 'tl', 'start', on, kt, T);
    o += showT(R, Y + 4 * c + 38, `其中 ${outside} 个在 3×3 window 之外，weight 一样大`, 'ts', 'start', on, kt, T);
  });
  for (let k = 0; k <= 4; k++) o += line(R + k * c, Y, R + k * c, Y + 4 * c, 'grid') + line(R, Y + k * c, R + 4 * c, Y + k * c, 'grid');
  o += rect(R, Y, 4 * c, 4 * c, 'frame');
  return svgA(560, Y + 4 * c + 46, o, '动图：4 乘 4 个 patch 里依次选一个做 query，右边显示它对 16 个 patch 的 attention weight；同类的 patch 不论远近拿到一样大的 weight，而一层 3 乘 3 conv 只能看到相邻的 patch');
}

// ---------- 第 7 站：SimCLR 的 similarity matrix ----------
const SANG = [0, 90, 20, 120];
function simclr() {
  const z = SANG.map((a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]);
  const S = z.map((p) => z.map((q) => p[0] * q[0] + p[1] * q[1]));
  const O = [120, 130], Rr = 86;
  let o = text(O[0], 18, '4 个 view 的 embedding（单位 vector）', 'tb', 'middle');
  o += `<circle cx="${O[0]}" cy="${O[1]}" r="${Rr}" class="grid"/>`;
  const names = ['z₁ cat view 1', 'z₂ dog view 1', 'z₃ cat view 2', 'z₄ dog view 2'];
  const off = [[8, 16], [10, -2], [8, -6], [-8, -8]], anc = ['start', 'start', 'start', 'end'];
  z.forEach(([x, y], i) => {
    const P = [O[0] + Rr * x, O[1] - Rr * y];
    o += arrow(O[0], O[1], P[0], P[1], i % 2 ? 'ink' : 'ln');
    o += text(P[0] + off[i][0], P[1] + off[i][1], names[i], i % 2 ? 't' : 'tl', anc[i]);
  });
  o += text(O[0], O[1] + Rr + 26, 'cat 的两个 view 夹角 20°，dog 的夹角 30°', 'ts', 'middle');
  const M0 = [330, 50], c = 46;
  o += text(M0[0] + 2 * c, 18, 'sim(zᵢ, zⱼ) = cos 夹角', 'tb', 'middle');
  for (let i = 0; i < 4; i++) {
    o += text(M0[0] - 8, M0[1] + i * c + 28, 'z' + '₁₂₃₄'[i], 'ts', 'end') + text(M0[0] + i * c + c / 2, M0[1] - 6, 'z' + '₁₂₃₄'[i], 'ts', 'middle');
    for (let j = 0; j < 4; j++) {
      const pos = (i + 2) % 4 === j, diag = i === j;
      o += rect(M0[0] + j * c, M0[1] + i * c, c, c, diag ? 'wash2' : pos ? 'wash-strong' : 'paper-f');
      o += text(M0[0] + j * c + c / 2, M0[1] + i * c + 28, diag ? '不用' : S[i][j].toFixed(2).replace('-', '−'), diag ? 'ts' : pos ? 'tb' : 't', 'middle');
    }
  }
  for (let k = 0; k <= 4; k++) o += line(M0[0] + k * c, M0[1], M0[0] + k * c, M0[1] + 4 * c, 'grid') + line(M0[0], M0[1] + k * c, M0[0] + 4 * c, M0[1] + k * c, 'grid');
  o += text(M0[0] + 2 * c, M0[1] + 4 * c + 22, '深色：positive pair；其余：negative', 'ts', 'middle');
  return svg(560, 262, o, '两张 image 各做两个 augmentation 得到 4 个 embedding，画在单位圆上；右边是它们两两的 cosine similarity，positive pair 是同一张 image 的两个 view');
}

// ---------- 第 7 站：MAE 的 masking ----------
function mae() {
  const r = rng(11), idx = Array.from({ length: 196 }, (_, i) => i);
  for (let i = 195; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const vis = new Set(idx.slice(0, 49));
  const c = 9.4, G = (x0, y0, f) => { let o = ''; for (let i = 0; i < 196; i++) o += rect(x0 + (i % 14) * c, y0 + Math.floor(i / 14) * c, c, c, f(i)); return o + rect(x0, y0, 14 * c, 14 * c, 'frame'); };
  let o = text(10 + 7 * c, 22, 'input：196 个 patch', 'tb', 'middle');
  o += G(10, 34, (i) => (vis.has(i) ? 'wash-strong' : 'wash2'));
  o += text(10 + 7 * c, 34 + 14 * c + 20, '深色 49 个 visible（25%）', 'ts', 'middle') + text(10 + 7 * c, 34 + 14 * c + 36, '灰色 147 个被 mask（75%）', 'ts', 'middle');
  const box = (x, w, l1, l2, l3) => rect(x, 70, w, 84, 'paper', 6) + text(x + w / 2, 98, l1, 'tb', 'middle') + text(x + w / 2, 118, l2, 'ts', 'middle') + text(x + w / 2, 136, l3, 'ts', 'middle');
  o += arrow(147, 112, 165, 112, 'ink');
  o += box(167, 112, 'encoder', '大 ViT', '只处理 49 个 token');
  o += arrow(281, 112, 297, 112, 'ink');
  o += box(299, 124, 'decoder', '8 block，512 维', '加 147 个 mask token');
  o += arrow(425, 112, 439, 112, 'ink');
  const c2 = 8.4, ox2 = 441;
  o += text(ox2 + 7 * c2, 22, 'output：196 个', 'tb', 'middle');
  for (let i = 0; i < 196; i++) o += rect(ox2 + (i % 14) * c2, 34 + Math.floor(i / 14) * c2, c2, c2, vis.has(i) ? 'paper-f' : 'wash');
  o += rect(ox2, 34, 14 * c2, 14 * c2, 'frame');
  o += text(ox2 + 7 * c2, 34 + 14 * c2 + 20, 'loss 只算 147 个', 'ts', 'middle') + text(ox2 + 7 * c2, 34 + 14 * c2 + 36, '被 mask 的 patch', 'ts', 'middle');
  o += text(280, 234, 'Encoder 的 sequence 只有 49 长，这是 MAE 训练快 3 倍左右的原因；downstream 只用 encoder，decoder 丢掉。', 'ts', 'middle');
  return svg(560, 240, o, 'MAE：224 乘 224 的 image 切成 196 个 patch，随机 mask 掉 147 个，encoder 只处理剩下 49 个，decoder 补上 mask token 重建全部 196 个 patch，loss 只在被 mask 的 patch 上算');
}

// ---------- 第 8 站：DDPM 的 forward process ----------
function ddpm() {
  const n = 16, x0 = [];
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
    const dx = k - 7.5, dy = r - 7.5, rr = Math.hypot(dx, dy);
    let v = rr < 7 ? 1 : -1;
    if (Math.hypot(k - 5, r - 5.5) < 1.6 || Math.hypot(k - 10, r - 5.5) < 1.6) v = -1;
    if (r >= 9 && r <= 11 && rr > 3.2 && rr < 4.8) v = -1;
    x0.push(v);
  }
  const g = gauss(rng(5)), eps = x0.map(() => g());
  const beta = Array.from({ length: 1000 }, (_, i) => 1e-4 + ((0.02 - 1e-4) * i) / 999);
  const ab = []; beta.reduce((p, b, i) => (ab[i] = p * (1 - b)), 1);
  const ts = [0, 100, 250, 500, 1000], c = 5.4, W = n * c, gap = (560 - 5 * W) / 4;
  let o = '';
  ts.forEach((t, f) => {
    const a = t === 0 ? 1 : ab[t - 1], X = f * (W + gap), Y = 34;
    o += text(X + W / 2, 20, 't = ' + t, 'tb', 'middle');
    x0.forEach((v, i) => {
      const xt = Math.sqrt(a) * v + Math.sqrt(1 - a) * eps[i], op = Math.min(1, Math.max(0, (xt + 1) / 2));
      if (op > 0.02) o += `<rect x="${f1(X + (i % n) * c)}" y="${f1(Y + Math.floor(i / n) * c)}" width="${f1(c)}" height="${f1(c)}" class="ink-f" opacity="${f1(op * 0.9)}"/>`;
    });
    o += rect(X, Y, W, W, 'frame');
    o += text(X + W / 2, Y + W + 18, '√ᾱ = ' + Math.sqrt(a).toFixed(2), 'ts', 'middle') + text(X + W / 2, Y + W + 34, '√(1−ᾱ) = ' + Math.sqrt(1 - a).toFixed(2), 'ts', 'middle');
  });
  o += text(280, 34 + W + 60, 'xₜ = √ᾱₜ x₀ + √(1−ᾱₜ) ε，同一个 ε；linear schedule，β 从 0.0001 到 0.02，T = 1000', 'ts', 'middle');
  return svg(560, 34 + W + 66, o, '一张 16 乘 16 的笑脸在 DDPM forward process 下的样子：t 等于 100 时还清楚，250 时轮廓尚在，500 时几乎全是 noise，1000 时是纯 noise');
}

export default {
  'stanford-cs231n-pixeldist': pixeldist,
  'stanford-cs231n-conv': convA,
  'stanford-cs231n-rf': rfA,
  'stanford-cs231n-vgg': vgg,
  'stanford-cs231n-norms': norms,
  'stanford-cs231n-search': search,
  'stanford-cs231n-tconv': tconv,
  'stanford-cs231n-anchor': anchorA,
  'stanford-cs231n-nms': nms,
  'stanford-cs231n-vit': vitA,
  'stanford-cs231n-simclr': simclr,
  'stanford-cs231n-mae': mae,
  'stanford-cs231n-ddpm': ddpm,
};

