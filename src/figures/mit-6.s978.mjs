import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

// 小工具：一张 2×2 的 binary 图像，b = [x1, x2, x3, x4]（raster order）
function mini(x, y, b, s = 12, hot = false) {
  let o = '';
  for (let i = 0; i < 4; i++) {
    const cx = x + (i % 2) * s, cy = y + Math.floor(i / 2) * s;
    o += rect(cx, cy, s, s, b[i] ? 'solid' : 'paper');
  }
  if (hot) o += rect(x - 3, y - 3, 2 * s + 6, 2 * s + 6, 'ln', 3);
  return o;
}
const BARS = [[1, 1, 0, 0], [0, 0, 1, 1], [1, 0, 1, 0], [0, 1, 0, 1]];
const isBar = (b) => BARS.some((q) => q.every((v, i) => v === b[i]));

// ---------- 开头：independent pixel 的失败 ----------
function bars() {
  let o = text(110, 18, 'Data：四种 bar，各 1/4', 'tb', 'middle');
  BARS.forEach((b, k) => { const x = 22 + k * 46; o += mini(x, 40, b, 14); o += text(x + 14, 90, '1/4', 'ts', 'middle'); });
  o += text(110, 122, '每个 pixel 的 marginal：', 'ts', 'middle');
  o += text(110, 140, 'p(x' + '<tspan class="sub" dy="3">i</tspan><tspan dy="-3">=1) = 1/2</tspan>', 't', 'middle');
  o += text(110, 172, '按 independent 建模，', 'ts', 'middle') + text(110, 189, '只能得到右边 16 种、各 1/16。', 'ts', 'middle');
  o += line(222, 30, 222, 250, 'grid');
  o += text(400, 18, 'p(x₁)p(x₂)p(x₃)p(x₄)：16 种图像各 1/16', 'tb', 'middle');
  let k = 0;
  for (let a = 0; a < 16; a++) {
    const b = [(a >> 3) & 1, (a >> 2) & 1, (a >> 1) & 1, a & 1];
    const x = 262 + (k % 8) * 36, y = 44 + Math.floor(k / 8) * 50;
    o += mini(x, y, b, 11, isBar(b));
    k++;
  }
  o += text(400, 170, '框出来的 4 种是 bar，合计 4/16 = 25%；', 'ts', 'middle');
  o += text(400, 187, '其余 75% 的 sample 是 data 里从未出现的图像。', 'ts', 'middle');
  o += text(400, 220, '四个 marginal 全对，错的是 pixel 之间的 dependence。', 't', 'middle');
  return svg(560, 236, o, '左边四种 bar 图像各占四分之一；右边是把四个 pixel 当成 independent 时得到的 16 种图像，只有 4 种是 bar');
}

// ---------- 第 1 站：raster order 的 sampling tree（动图） ----------
function tree() {
  const X = [40, 130, 220, 310, 400], LY = [46, 104, 162, 220];
  const leaves = [[1, 1, 0, 0], [1, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 1]];
  const nodeY = [[133], [75, 191], LY, LY, LY];
  let o = '';
  const lbl = ['', 'x₁', 'x₂', 'x₃', 'x₄'];
  for (let l = 1; l <= 4; l++) o += text(X[l], 20, lbl[l], 'tb', 'middle');
  o += text(X[0], 20, 'start', 'ts', 'middle');
  // edges
  const edges = [];
  edges.push([0, 0, 1, 0, '1/2'], [0, 0, 1, 1, '1/2']);
  edges.push([1, 0, 2, 0, '1/2'], [1, 0, 2, 1, '1/2'], [1, 1, 2, 2, '1/2'], [1, 1, 2, 3, '1/2']);
  for (let k = 0; k < 4; k++) edges.push([2, k, 3, k, '1'], [3, k, 4, k, '1']);
  for (const [l0, i0, l1, i1, p] of edges) {
    const x0 = X[l0] + 12, y0 = nodeY[l0][i0], x1 = X[l1] - 12, y1 = nodeY[l1][i1];
    o += line(x0, y0, x1, y1, 'mute');
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
    o += text(mx, my + (y1 < y0 ? -6 : y1 > y0 ? 14 : -6), p, 'ts', 'middle');
  }
  const val = (l, k) => (l === 1 ? (k === 0 ? 1 : 0) : leaves[k][l - 1]);
  o += circle(X[0], nodeY[0][0], 10, 'paper');
  for (let l = 1; l <= 4; l++) nodeY[l].forEach((y, k) => {
    const v = l === 1 ? (k === 0 ? 1 : 0) : val(l, k);
    o += circle(X[l], y, 11, 'paper') + text(X[l], y + 4, String(v), 'ts', 'middle');
  });
  leaves.forEach((b, k) => { o += mini(450, LY[k] - 12, b, 12); });
  o += text(450 + 12, 252, '4 种结果各 1/4', 'ts', 'middle');
  // 动画：一个点沿某条 path 往下走，四条 path 轮流
  const per = 2.4, T = per * 4;
  const xs = [], ys = [], kt = [];
  leaves.forEach((b, k) => {
    const pts = [[X[0], nodeY[0][0]], [X[1], nodeY[1][k < 2 ? 0 : 1]], [X[2], LY[k]], [X[3], LY[k]], [X[4], LY[k]]];
    pts.forEach((p, j) => { xs.push(p[0]); ys.push(p[1]); kt.push((k * per + j * 0.45) / T); });
    xs.push(X[4]); ys.push(LY[k]); kt.push((k * per + per - 0.01) / T);
  });
  xs.push(X[0]); ys.push(nodeY[0][0]); kt.push(1);
  o += `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="5" class="ln-f">${anim('cx', xs.map(f1), kt, T, true)}${anim('cy', ys.map(f1), kt, T, true)}</circle>`;
  o += text(250, 272, '前两个 pixel 各是一次 coin flip；一旦 x₁、x₂ 定了，x₃、x₄ 只剩一种可能（probability 1）。', 'ts', 'middle');
  return svgA(560, 282, o, '动图：按 raster order 逐个 sample 四个 pixel 的 probability tree。前两层每个分支 1/2，后两层 probability 为 1，四条 path 对应四种 bar');
}

// ---------- 第 2 站：vector quantization 与 straight-through ----------
function vq() {
  const sx = lin(-0.4, 1.5, 40, 300), sy = lin(-0.4, 1.4, 250, 34);
  let o = '';
  o += rect(sx(-0.4), sy(1.4), sx(1.5) - sx(-0.4), sy(-0.4) - sy(1.4), 'frame');
  o += line(sx(0.5), sy(1.4), sx(0.5), sy(-0.4), 'dash') + line(sx(-0.4), sy(0.5), sx(1.5), sy(0.5), 'dash');
  const E = [[0, 0], [1, 0], [0, 1], [1, 1]];
  E.forEach(([a, b], k) => {
    o += rect(sx(a) - 6, sy(b) - 6, 12, 12, k === 1 ? 'solid' : 'paper', 2);
    o += text(sx(a) + 10, sy(b) - 9, 'e' + '<tspan class="sub" dy="3">' + k + '</tspan>', 'ts', 'start');
  });
  const ze = [0.9, 0.2];
  o += circle(sx(ze[0]), sy(ze[1]), 5, 'ink-f');
  o += text(sx(ze[0]) + 10, sy(ze[1]) - 6, 'z' + '<tspan class="sub" dy="3">e</tspan><tspan dy="-3"> = (0.9, 0.2)</tspan>', 'ts', 'start');
  o += arrow(sx(ze[0]) - 1, sy(ze[1]) + 4, sx(1) - 3, sy(0) - 8, 'ink', 6);
  // gradient arrows
  const g = [-0.35, 0.25];
  o += arrow(sx(1), sy(0), sx(1 + g[0]), sy(0 + g[1]) , 'ln', 6);
  o += arrow(sx(ze[0]), sy(ze[1]), sx(ze[0] + g[0]), sy(ze[1] + g[1]), 'ln', 6);
  o += text(sx(1 + g[0]) - 4, sy(g[1]) + 22, '−∇L', 'tl', 'end');
  o += text(sx(0.25), sy(1.25), 'Voronoi cell 的边界', 'ts', 'middle');
  // 右边：说明
  const X = 330;
  o += text(X, 50, 'Forward：z' + '<tspan class="sub" dy="3">e</tspan><tspan dy="-3"> 换成最近的 codeword</tspan>', 'tb', 'start');
  o += text(X, 70, '到 e₀…e₃ 的 squared distance：', 'ts', 'start');
  o += text(X, 88, '0.85、0.05、1.45、0.65 → 取 e₁', 'ts', 'start');
  o += text(X, 122, 'Backward：argmin 没有 gradient，', 'tb', 'start');
  o += text(X, 140, 'decoder 对 z' + '<tspan class="sub" dy="3">q</tspan><tspan dy="-3"> 的 gradient 原样</tspan>', 'ts', 'start');
  o += text(X, 158, '抄给 z' + '<tspan class="sub" dy="3">e</tspan><tspan dy="-3">（两支彩色箭头相同）</tspan>', 'ts', 'start');
  o += text(X, 192, 'Codebook 自己靠另一项 loss 移动：', 'tb', 'start');
  o += text(X, 210, 'e₁ 被拉向 z' + '<tspan class="sub" dy="3">e</tspan><tspan dy="-3">，像 K-means 的 M-step</tspan>', 'ts', 'start');
  return svg(560, 262, o, '二维 latent 平面上四个 codeword 和它们的 Voronoi cell；encoder 输出 (0.9, 0.2) 被换成最近的 e1，backward 时 gradient 从 e1 原样抄回 encoder 输出');
}

// ---------- 第 3 站：三种 attention mask ----------
function mask() {
  let o = '';
  const grid = (x0, y0, n, c, allow, title, note, blocks) => {
    o += text(x0 + n * c / 2, y0 - 26, title, 'tb', 'middle');
    o += text(x0 - 6, y0 - 8, 'query ↓  key →', 'ts', 'start');
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += rect(x0 + j * c, y0 + i * c, c, c, allow(i, j) ? 'solid' : 'paper');
    if (blocks) { let s = 0; for (const b of blocks) { s += b; if (s < n) o += line(x0, y0 + s * c, x0 + n * c, y0 + s * c, 'ln') + line(x0 + s * c, y0, x0 + s * c, y0 + n * c, 'ln'); } }
    note.forEach((t, k) => { o += text(x0 + n * c / 2, y0 + n * c + 18 + k * 16, t, 'ts', 'middle'); });
  };
  grid(30, 50, 6, 20, () => true, 'Full（bidirectional）', ['每个 token 看见全部', '不能用来做 AR'], null);
  grid(212, 50, 6, 20, (i, j) => j <= i, 'Causal', ['只看见自己和前面', '一次 forward 算出 6 个', 'conditional'], null);
  const sc = [1, 4, 9], id = []; sc.forEach((s, k) => { for (let q = 0; q < s; q++) id.push(k); });
  grid(398, 50, 14, 9, (i, j) => id[j] <= id[i], 'Block-causal（VAR）', ['scale 1×1、2×2、3×3：', '同一 scale 内互相看见，', '只看见更粗的 scale'], sc);
  return svg(560, 240, o, '三个 attention mask：full 全部可见；causal 是下三角；VAR 的 block-causal 按 scale 分块，块内全可见、只看见更粗的 scale');
}

// ---------- 第 4 站：VAR 的 token pyramid ----------
function varpyr() {
  const sc = [1, 2, 3, 4, 5, 6, 8, 10, 13, 16], c = 6, gap = 11;
  let x = 14, o = '', cum = 0;
  const base = 150;
  o += text(280, 18, 'VAR：每一步生成一整张 token map，10 步共 680 个 token', 'tb', 'middle');
  sc.forEach((s, k) => {
    const w = s * c;
    for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) o += rect(x + j * c, base - w + i * c, c, c, k === sc.length - 1 ? 'wash-strong' : 'wash');
    o += rect(x, base - w, w, w, 'frame');
    cum += s * s;
    if (k >= 3) { o += text(x + w / 2, base + 16, s + '×' + s, 'ts', 'middle'); o += text(x + w / 2, base + 32, 'step ' + (k + 1), 'ts', 'middle'); }
    else o += text(x + w / 2, base - w - 8 - k * 14, s + '×' + s, 'ts', 'middle');
    if (k < sc.length - 1) o += arrow(x + w + 1, base - 4, x + w + gap - 1, base - 4, 'mute', 4);
    x += w + gap;
  });
  o += text(14 + 34, base + 24, 'step 1–3', 'ts', 'middle');
  o += text(14, 206, '每个 scale 都量化同一张 16×16 feature map 的 residual：先把它缩小到 k×k 量化，', 'ts', 'start');
  o += text(14, 222, '放大回 16×16 减掉，剩下的交给下一个 scale；decode 时把各 scale 放大后加起来。', 'ts', 'start');
  o += text(14, 246, 'Raster AR 要 256 步，一步一个 token；VAR 只要 10 步，但 token 总数从 256 增加到 680。', 't', 'start');
  return svg(560, 256, o, 'VAR 的十个 scale 从 1×1 到 16×16 依次排开，每一步生成一个 scale 的全部 token');
}

// ---------- 第 5 站：JS divergence 与 Wasserstein distance（动图） ----------
function jsw() {
  const thetas = [];
  for (let k = 20; k >= 0; k--) thetas.push(k / 10);
  const hold0 = 8; for (let h = 0; h < hold0; h++) thetas.push(0);
  for (let k = 1; k <= 20; k++) thetas.push(k / 10);
  const n = thetas.length, T = 7, kt = thetas.map((_, i) => i / (n - 1));
  const L2 = Math.log(2);
  const js = (t) => (Math.abs(t) < 1e-9 ? 0 : L2);
  // 上：number line 上的两个 delta
  const sx = lin(-0.4, 2.2, 60, 520), Y = 92;
  let o = text(280, 18, 'p = δ₀（real），q' + '<tspan class="sub" dy="3">θ</tspan><tspan dy="-3"> = δ</tspan><tspan class="sub" dy="3">θ</tspan><tspan dy="-3">（generator），θ 从 2 移到 0 再移回</tspan>', 'tb', 'middle');
  o += line(sx(-0.4), Y, sx(2.2), Y, 'axis');
  for (const v of [0, 0.5, 1, 1.5, 2]) o += line(sx(v), Y, sx(v), Y + 4, 'axis') + text(sx(v), Y + 18, String(v), 'ts', 'middle');
  o += arrow(sx(0), Y, sx(0), 40, 'ink-b', 7) + text(sx(0) - 8, 50, 'p', 'tb', 'end');
  o += `<g>${arrow(sx(0), Y, sx(0), 46, 'ln', 7)}<animateTransform attributeName="transform" type="translate" values="${thetas.map((t) => f1(sx(t) - sx(0)) + ' 0').join(';')}" keyTimes="${kt.map((t) => (Math.round(t * 1e5) / 1e5)).join(';')}" dur="${T}s" repeatCount="indefinite"/></g>`;
  o += `<text class="tl" text-anchor="start" x="${f1(sx(thetas[0]) + 8)}" y="56">q<tspan class="sub" dy="3">θ</tspan>${anim('x', thetas.map((t) => f1(sx(t) + 8)), kt, T)}</text>`;
  // 下：两条 curve
  const px = lin(0, 2, 90, 330), py = lin(0, 2.1, 262, 136);
  o += axes({ sx: px, sy: py, x0: 0, x1: 2, y0: 0, y1: 2.1, xt: [0, 0.5, 1, 1.5, 2], yt: [[0, '0'], [L2, '0.69'], [1, '1'], [2, '2']] });
  o += text(px(2) + 14, py(0) + 4, 'θ', 'ts', 'start');
  o += line(px(0), py(0), px(2), py(2), 'ink-b');
  o += path(d([[px(0.004), py(L2)], [px(2), py(L2)]]), 'ln');
  o += circle(px(0), py(0), 4, 'ln-f') + circle(px(0), py(L2), 4, 'paper');
  o += text(px(2) + 6, py(2) + 4, 'W₁ = |θ|', 'tb', 'start');
  o += text(px(2) + 6, py(L2) + 4, 'JS = log 2', 'tl', 'start');
  o += acircle(thetas.map(px), thetas.map((t) => py(Math.abs(t))), kt, T, 5, 'ink-f');
  o += acircle(thetas.map(px), thetas.map((t) => py(js(t))), kt, T, 5, 'ln-f');
  o += text(400, 170, 'θ ≠ 0 时两个 support 不重叠，', 'ts', 'start') + text(400, 186, 'JS 恒为 log 2，对 θ 的', 'ts', 'start') + text(400, 202, 'gradient 是 0；', 'ts', 'start');
  o += text(400, 226, 'W₁ 随 θ 线性变化，', 'ts', 'start') + text(400, 242, 'gradient 一直指向 0。', 'ts', 'start');
  return svgA(560, 280, o, '动图：generator 的 delta 从 2 移到 0 再移回；JS divergence 在 theta 不为 0 时一直是 log 2，只在 0 处跳到 0；Wasserstein distance 等于 theta 的绝对值');
}

// ---------- 第 6 站：timestep sampling 与 resolution shift ----------
function tsample() {
  const ln = (t) => Math.exp(-((Math.log(t / (1 - t))) ** 2) / 2) / (Math.sqrt(2 * Math.PI) * t * (1 - t));
  const shift = (t, a) => (a * t) / (1 + (a - 1) * t);
  const inv = (t, a) => t / (a - (a - 1) * t);
  const dens = (t, a) => { const u = inv(t, a), h = 1e-6; const g1 = (shift(u + h, a) - shift(u - h, a)) / (2 * h); return ln(u) / g1; };
  let o = '';
  const sx = lin(0, 1, 50, 260), sy = lin(0, 2.6, 230, 40);
  o += text(155, 18, 'training 时 t 的 density', 'tb', 'middle');
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 2.6, xt: [0, 0.25, 0.5, 0.75, 1], yt: [0, 1, 2], xl: 't（1 = 纯 noise）' });
  o += path(curve(() => 1, 0, 1, sx, sy, 2), 'dash');
  o += path(curve(ln, 0.002, 0.998, sx, sy), 'ink-b');
  o += path(curve((t) => dens(t, 3), 0.002, 0.995, sx, sy), 'ln');
  o += text(sx(0.04), sy(1.85), 'logit-normal(0, 1)', 'ts', 'start');
  o += text(sx(0.62), sy(2.4), 'shift α = 3', 'tl', 'end');
  o += text(sx(0.02), sy(1) - 5, 'uniform', 'ts', 'start');
  // 右：mapping
  const mx = lin(0, 1, 330, 530), my = lin(0, 1, 230, 40);
  o += text(430, 18, 't' + '<tspan class="sub" dy="3">n</tspan><tspan dy="-3"> → t</tspan><tspan class="sub" dy="3">m</tspan><tspan dy="-3">（α = √(m/n)）</tspan>', 'tb', 'middle');
  o += axes({ sx: mx, sy: my, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.5, 1], yt: [0, 0.5, 0.75, 1], xl: 't' + '<tspan class="sub" dy="3">n</tspan>' });
  o += path(curve((t) => t, 0, 1, mx, my, 2), 'dash');
  o += path(curve((t) => shift(t, 3), 0, 1, mx, my), 'ln');
  o += path(curve((t) => shift(t, 4), 0, 1, mx, my), 'ink');
  o += line(mx(0.5), my(0), mx(0.5), my(0.8), 'grid') + line(mx(0), my(0.75), mx(0.5), my(0.75), 'grid') + line(mx(0), my(0.8), mx(0.5), my(0.8), 'grid');
  o += circle(mx(0.5), my(0.75), 3.5, 'ln-f') + circle(mx(0.5), my(0.8), 3.5, 'ink-f');
  o += text(mx(0.55), my(0.32), 'α = 3：0.5 → 0.75', 'tl', 'start');
  o += text(mx(0.55), my(0.2), 'α = 4：0.5 → 0.8', 'ts', 'start');
  o += text(mx(0.55), my(0.08), 'α = 1：虚线', 'ts', 'start');
  return svg(560, 262, o, '左边是 training 时 t 的三种 density：uniform、logit-normal(0,1)、以及经过 alpha 等于 3 的 shift 后的 density；右边是 shift 的 mapping，alpha 等于 3 时 0.5 被送到 0.75');
}

// ---------- 第 7 站：一个 bimodal 的 token：三种 loss 各学到什么 ----------
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function gauss(r) { const u = Math.max(r(), 1e-12), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function bimodal() {
  const mu = [-0.9, 0.9], s = 0.15;
  const pdf = (x) => 0.5 * (Math.exp(-((x - mu[0]) ** 2) / (2 * s * s)) + Math.exp(-((x - mu[1]) ** 2) / (2 * s * s))) / (s * Math.sqrt(2 * Math.PI));
  // diffusion loss 的 sampler：用 exact velocity（linear path，t=1 是 noise）走 100 步 Euler
  const vel = (z, t) => {
    let num = 0, den = 0;
    for (const m of mu) {
      const vv = (1 - t) ** 2 * s * s + t * t, mean = (1 - t) * m;
      const w = Math.exp(-((z - mean) ** 2) / (2 * vv)) / Math.sqrt(vv);
      const ex = m + ((1 - t) * s * s / vv) * (z - mean);
      num += w * ex; den += w;
    }
    return (z - num / den) / t;
  };
  const r = rng(7), N = 1200, samp = [];
  for (let i = 0; i < N; i++) { let z = gauss(r); for (let k = 0; k < 100; k++) { const t = 1 - k / 100; z -= 0.01 * vel(z, t); } samp.push(z); }
  const panel = (x0, title, lines) => {
    const sx = lin(-1.6, 1.6, x0, x0 + 160), sy = lin(0, 3.2, 200, 50);
    o += text(x0 + 80, 22, title, 'tb', 'middle');
    o += line(sx(-1.6), sy(0), sx(1.6), sy(0), 'axis');
    for (const v of [-1, 0, 1]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, v < 0 ? '−1' : String(v), 'ts', 'middle');
    o += path(area(pdf, -1.6, 1.6, sx, sy), 'wash2');
    lines.forEach((t, k) => { o += text(x0 + 80, 236 + k * 16, t, 'ts', 'middle'); });
    return [sx, sy];
  };
  let o = '';
  // (a) L2
  let [sx, sy] = panel(20, 'L2 regression', ['output 永远是 E[x] = 0，', '恰好落在两个 mode 之间']);
  o += line(sx(0), sy(0), sx(0), sy(3.1), 'ink-b') + circle(sx(0), sy(3.1), 4, 'ink-f');
  // (b) VQ：8 个 level，间隔 0.4
  [sx, sy] = panel(200, 'VQ + cross-entropy', ['只能输出 8 个 level 之一；', '0.9 附近的值被换成 0.6、1.0 或 1.4']);
  const lev = []; for (let k = 0; k < 8; k++) lev.push(-1.4 + 0.4 * k);
  const cnt = lev.map(() => 0);
  for (const x of samp) { let b = 0; for (let k = 1; k < 8; k++) if (Math.abs(x - lev[k]) < Math.abs(x - lev[b])) b = k; cnt[b]++; }
  lev.forEach((v, k) => { const h = cnt[k] / N / 0.4; if (h > 0) o += rect(sx(v) - 5, sy(h), 10, sy(0) - sy(h), 'solid'); o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'ink'); });
  // (c) diffusion loss
  [sx, sy] = panel(380, 'Diffusion loss', ['1200 个 sample 的 histogram，', '两个 mode 各约一半']);
  const bw = 0.1, bins = new Array(32).fill(0);
  for (const x of samp) { const b = Math.floor((x + 1.6) / bw); if (b >= 0 && b < 32) bins[b]++; }
  bins.forEach((c, b) => { const h = c / N / bw; if (h > 0) o += rect(sx(-1.6 + b * bw) + 0.5, sy(h), sx(bw) - sx(0) - 1, sy(0) - sy(h), 'solid'); });
  o += path(curve(pdf, -1.6, 1.6, sx, sy), 'ink');
  const pos = samp.filter((x) => x > 0).length;
  o += text(460, 56, (pos / N * 100).toFixed(1) + '% 在右边', 'ts', 'middle');
  return svg(560, 270, o, '同一个 token 的 conditional distribution 有两个 mode，在 −0.9 和 0.9。L2 regression 输出 0；VQ 加 cross-entropy 只能输出离散的 level；diffusion loss 的 sample 落在两个 mode 上');
}

// ---------- 第 7 站：raster AR 与 MAR 同样走 64 步（动图） ----------
function margrid() {
  const N = 256, K = 64;
  const per = []; let m = N;
  for (let step = 0; step < K; step++) {
    let ml = Math.floor(N * Math.cos(Math.PI / 2 * (step + 1) / K)); ml = Math.max(1, Math.min(m - 1, ml));
    let pred; if (step >= K - 1) { pred = m; ml = 0; } else pred = m - ml;
    per.push(pred); m = ml;
  }
  const cum = [0]; per.forEach((p) => cum.push(cum[cum.length - 1] + p));
  // random order（固定 seed）
  const r = rng(11), order = [...Array(N).keys()];
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const stepOf = new Array(N); for (let k = 0; k < K; k++) for (let q = cum[k]; q < cum[k + 1]; q++) stepOf[order[q]] = k + 1;
  // 时间轴：先停在终态 hold 秒，再从 0 走到 64，每步 dt
  const hold = 2.2, dt = 0.07, T = hold + 0.4 + K * dt + 0.3;
  const tAt = (k) => (hold + 0.4 + k * dt) / T; // 第 k 步完成的时刻
  const c = 9, G = 16;
  let o = '';
  const cell = (x0, y0, idx, k) => {
    const x = x0 + (idx % G) * c, y = y0 + Math.floor(idx / G) * c;
    // k = 这个 token 在第几步生成；k > K 表示 64 步内生成不了
    let a = rect(x, y, c, c, 'paper');
    if (k <= K) a += `<rect x="${x}" y="${y}" width="${c}" height="${c}" class="solid">${anim('opacity', [1, 0, 0, 1, 1], [0, hold / T, Math.max(hold / T + 0.0001, tAt(k) - 0.0002), tAt(k), 1], T, true)}</rect>`;
    return a;
  };
  const X1 = 40, X2 = 330, Y = 46;
  o += text(X1 + 72, 22, 'Raster AR：一步一个 token', 'tb', 'middle');
  o += text(X2 + 72, 22, 'MAR：random order、cosine schedule', 'tb', 'middle');
  for (let i = 0; i < N; i++) o += cell(X1, Y, i, i + 1);
  for (let i = 0; i < N; i++) o += cell(X2, Y, i, stepOf[i]);
  // 计数：几个里程碑
  const marks = [8, 16, 32, 48, 64];
  marks.forEach((k, j) => {
    const last = j === marks.length - 1;
    const vals = last ? [1, 0, 1, 1] : [0, 1, 0, 0];
    const kts = last ? [0, hold / T, tAt(k), 1] : [0, tAt(k), tAt(marks[j + 1]), 1];
    const show = (txt, x) => `<text x="${x}" y="214" class="t" text-anchor="middle" opacity="${vals[0]}">${txt}${anim('opacity', vals, kts, T, true)}</text>`;
    o += show('走了 ' + k + ' 步：' + k + ' / 256', X1 + 72);
    o += show('走了 ' + k + ' 步：' + cum[k] + ' / 256', X2 + 72);
  });
  o += text(280, 240, 'MAR 每步生成的 token 数：前 13 步各 1 个，之后逐渐增加，最后几步各 6 到 7 个。', 'ts', 'middle');
  o += text(280, 256, 'Raster AR 走完 64 步只有四分之一；还要再走 192 步。', 'ts', 'middle');
  return svgA(560, 266, o, '动图：16 乘 16 的 token grid，左边 raster AR 每步填一个格，右边 MAR 按 random order 和 cosine schedule 每步填若干格；64 步后 MAR 填满，raster 只填了 64 格');
}

// ---------- 第 8 站：一步生成为什么难（动图） ----------
function onestep() {
  // toy：data = ±1 各 1/2，z_t = (1−t)x + tε，t = 1 是 noise
  const v = (z, t) => (z - Math.tanh(((1 - t) * z) / (t * t))) / t;
  const sx = lin(1, 0, 50, 360), sy = lin(-2.3, 2.3, 250, 30);
  const z1s = [-2.0, -1.2, -0.5, -0.15, 0.3, 0.8, 1.5, 2.1];
  let o = '';
  o += axes({ sx, sy, x0: 1, x1: 0, y0: -2.3, y1: 2.3, xt: [[1, '1'], [0.75, '0.75'], [0.5, '0.5'], [0.25, '0.25'], [0, '0']], yt: [-2, -1, 0, 1, 2], xAt: -2.3, yAt: 1 });
  o += text(sx(0), sy(-2.3) + 32, 't（从 noise 走到 data）', 'ts', 'end');
  o += text(sx(1) - 4, sy(2.3) - 8, 'z', 'ts', 'start');
  o += line(sx(0), sy(1), sx(0) + 8, sy(1), 'ink-b') + line(sx(0), sy(-1), sx(0) + 8, sy(-1), 'ink-b');
  o += text(sx(0) + 12, sy(1) + 4, '+1', 'ts', 'start') + text(sx(0) + 12, sy(-1) + 4, '−1', 'ts', 'start');
  // exact trajectories（RK4）
  for (const z1 of z1s) {
    const pts = []; let z = z1; const n = 800, te = 0.002;
    pts.push([sx(1), sy(z)]);
    for (let i = 0; i < n; i++) {
      const t = 1 - (1 - te) * i / n, h = -(1 - te) / n;
      const k1 = v(z, t), k2 = v(z + h / 2 * k1, t + h / 2), k3 = v(z + h / 2 * k2, t + h / 2), k4 = v(z + h * k3, t + h);
      z += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); pts.push([sx(t + h), sy(z)]);
    }
    pts.push([sx(0), sy(Math.sign(z1))]);
    o += path(d(pts), 'mute');
  }
  // Euler with n steps
  const eul = (z1, n) => { const pts = [[1, z1]]; let z = z1; for (let i = 0; i < n; i++) { const t = 1 - i / n; z -= (1 / n) * v(z, t); pts.push([1 - (i + 1) / n, z]); } return pts; };
  const phases = [1, 2, 4];
  const dur = 2.6, T = dur * (phases.length + 1);
  const kt = [0, 1 / 4, 2 / 4, 3 / 4, 1];
  for (const z1 of z1s) {
    // 每个 phase 的 path：Euler n 步（n=1,2,4），最后一个 phase 是 MeanFlow 的一步
    const ds = phases.map((n) => { const pts = eul(z1, n); while (pts.length < 5) pts.push(pts[pts.length - 1]); return d(pts.map(([t, z]) => [sx(t), sy(z)])); });
    const mf = [[1, z1], [0, Math.sign(z1)]]; while (mf.length < 5) mf.push(mf[mf.length - 1]);
    ds.push(d(mf.map(([t, z]) => [sx(t), sy(z)])));
    ds.push(ds[3]);
    o += apath(ds, kt, T, 'ln', true);
    o += circle(sx(1), sy(z1), 3.5, 'ink-f');
  }
  const X = 410;
  const lab = ['Euler 1 步：', 'Euler 2 步：', 'Euler 4 步：', 'MeanFlow 1 步：'];
  const res = ['全部落在 0', '落在 tanh(z₁)', '几乎都到 ±1', 'z₁ − u(z₁, 0, 1) = ±1'];
  lab.forEach((s, k) => {
    const on = [0, 0, 0, 0, 0]; on[k] = 1; if (k === 3) on[4] = 1;
    o += `<g>${text(X, 70, s, 'tl', 'start')}${text(X, 88, res[k], 't', 'start')}${ashow(on, kt, T)}</g>`;
  });
  o += text(X, 130, '灰线：exact ODE', 'ts', 'start') + text(X, 146, 'trajectory（RK4）', 'ts', 'start');
    o += text(X, 170, '彩色线：实际走的', 'ts', 'start') + text(X, 186, '每一步', 'ts', 'start');
  o += text(X, 218, '起点 z₁ 是 8 个', 'ts', 'start') + text(X, 234, '固定的 noise', 'ts', 'start');
  return svgA(560, 280, o, '动图：data 是正负 1 两个点。灰色是 exact ODE trajectory；彩色线依次是 Euler 走 1 步、2 步、4 步和 MeanFlow 的 1 步。Euler 1 步全部落在 0，2 步落在 tanh(z1)，4 步几乎到正负 1，MeanFlow 一步直接到正负 1');
}

export default {
  'mit6s978-bars': bars,
  'mit6s978-tree': tree,
  'mit6s978-vq': vq,
  'mit6s978-mask': mask,
  'mit6s978-var': varpyr,
  'mit6s978-jsw': jsw,
  'mit6s978-tsample': tsample,
  'mit6s978-bimodal': bimodal,
  'mit6s978-mar': margrid,
  'mit6s978-onestep': onestep,
};
