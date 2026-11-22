import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, area, axes, apath, acircle, anim, ashow, f1 } from '../lib/svg.mjs';

const N = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
const pdata = (x) => 0.5 * N(x, -2, 0.25) + 0.5 * N(x, 2, 0.25);
const sg = (a) => 1 / (1 + Math.exp(-a));
// 可复现的随机数
function rng(seed) {
  let s = seed >>> 0;
  const u = () => { s += 0x6d2b79f5; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const g = () => { const a = u() || 1e-12, b = u(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b); };
  return { u, g };
}
const pct = (v) => (v * 100).toFixed(1) + '%';

// ---------- 开头与第 1 站：一个 Gaussian 去 fit 两个 bump ----------
function fit() {
  const sx = lin(-5, 5, 40, 520), sy = lin(0, 0.85, 200, 30);
  let o = path(area(pdata, -5, 5, sx, sy), 'wash') + path(curve(pdata, -5, 5, sx, sy), 'ink');
  o += path(curve((x) => N(x, 0, 4.25), -5, 5, sx, sy), 'ln');
  o += axes({ sx, sy, x0: -5, x1: 5, y0: 0, y1: 0.85, xt: [-4, -2, 0, 2, 4], yt: [] });
  o += rect(sx(-1), 30, sx(1) - sx(-1), 170, 'wash2');
  o += path(curve(pdata, -5, 5, sx, sy), 'ink') + path(curve((x) => N(x, 0, 4.25), -5, 5, sx, sy), 'ln');
  o += text(sx(2) + 28, sy(0.72), 'p' + sub('data'), 't', 'start') + text(sx(2) + 28, sy(0.72) + 16, '两个 bump', 'ts', 'start');
  o += text(sx(-3.3), sy(0.3), 'MLE 的 Gaussian', 'tl', 'end') + text(sx(-3.3), sy(0.3) + 16, 'N(0, 4.25)', 'ts', 'end');
  o += text(sx(0), 46, '|x| < 1', 'tb', 'middle');
  o += text(sx(0), 62, 'model 的 sample：37.2%', 'ts', 'middle') + text(sx(0), 77, 'data：2.3%', 'ts', 'middle');
  // 两行 sample
  const r = rng(7);
  o += text(30, 236, 'data', 'ts', 'end') + text(30, 256, 'model', 'ts', 'end');
  for (let i = 0; i < 40; i++) {
    const a = (r.u() < 0.5 ? -2 : 2) + 0.5 * r.g();
    if (a > -5 && a < 5) o += circle(sx(a), 232, 2.6, 'ink-f');
    const b = Math.sqrt(4.25) * r.g();
    if (b > -5 && b < 5) o += circle(sx(b), 252, 2.6, 'ln-f');
  }
  return svg(560, 266, o, '两个 bump 的 data density 和 MLE 拟合出的单个 Gaussian N(0, 4.25)；Gaussian 把 37% 的 sample 放在 data 只有 2.3% 的中间区域');
}

// 第 1 站：forward KL 与 reverse KL 选出的 Gaussian
function kl() {
  let o = '';
  const panel = (x0, q, title, l1, l2) => {
    const sx = lin(-4.5, 4.5, x0, x0 + 240), sy = lin(0, 0.85, 200, 46);
    o += path(area(pdata, -4.5, 4.5, sx, sy), 'wash') + path(curve(pdata, -4.5, 4.5, sx, sy), 'ink');
    o += path(curve(q, -4.5, 4.5, sx, sy), 'ln');
    o += axes({ sx, sy, x0: -4.5, x1: 4.5, y0: 0, y1: 0.85, xt: [-2, 0, 2], yt: [] });
    o += text(x0 + 120, 20, title, 'tb', 'middle');
    o += text(x0 + 120, 238, l1, 'ts', 'middle') + text(x0 + 120, 254, l2, 'ts', 'middle');
  };
  panel(30, (x) => N(x, 0, 4.25), 'min KL(p ‖ q)：MLE', 'q = N(0, 4.25)', 'KL(p‖q) = 0.724，KL(q‖p) = 2.098');
  panel(300, (x) => N(x, 2, 0.25), 'min KL(q ‖ p)', 'q = N(2, 0.25)，盖住一个 bump', 'KL(q‖p) = 0.693，KL(p‖q) = 15.3');
  o += text(150, 68, 'q 必须盖住 p 的每一处', 'ts', 'middle');
  o += text(318, 76, 'q 只要待在', 'ts', 'start') + text(318, 92, 'p 大的地方', 'ts', 'start');
  return svg(560, 262, o, '左：最小化 KL(p‖q) 得到盖住两个 bump 的宽 Gaussian；右：最小化 KL(q‖p) 得到只盖住一个 bump 的窄 Gaussian');
}

// ---------- 第 2 站：ELBO 随 q 的 mean 变化 ----------
function elbo() {
  const w = 2, s2 = 0.25, x = 2, pv = s2 / (w * w + s2), pm = w * x / (w * w + s2);
  const lpx = Math.log(N(x, 0, w * w + s2));
  const E = (m) => -0.5 * Math.log(2 * Math.PI * s2) - ((x - w * m) ** 2 + w * w * pv) / (2 * s2) - 0.5 * (pv + m * m - 1 - Math.log(pv));
  const sx = lin(-0.2, 2.0, 70, 400), sy = lin(-10, 0, 236, 30);
  let o = axes({ sx, sy, x0: -0.2, x1: 2.0, y0: -10, y1: 0, xt: [0, 0.5, [pm, '0.94'], 1.5, 2], yt: [-10, -8, -6, -4, -2, 0], grid: true, xl: 'q 的 mean μ（variance 固定为 0.0588）' });
  o += line(sx(-0.2), sy(lpx), sx(2.0), sy(lpx), 'ink-b');
  o += path(curve((m) => (E(m) >= -10 ? E(m) : NaN), -0.2, 2.0, sx, sy, 400), 'ln');
  o += line(sx(0.5), sy(lpx), sx(0.5), sy(E(0.5)), 'dash');
  o += text(sx(0.5) - 6, sy(lpx) + 24, 'gap = KL(q ‖ p(z|x))', 'ts', 'end') + text(sx(0.5) - 6, sy(lpx) + 40, '= 1.65（μ = 0.5 处）', 'ts', 'end');
  o += circle(sx(pm), sy(lpx), 4, 'ink-f');
  o += text(sx(2.0), sy(lpx) - 8, 'log p(x) = −2.113', 't', 'end');
  o += text(sx(1.62), sy(E(1.62)) + 18, 'ELBO', 'tl', 'start');
  o += text(416, 70, 'μ = 0.94 就是 posterior', 'ts', 'start') + text(416, 86, 'p(z | x = 2) 的 mean：', 'ts', 'start') + text(416, 102, 'q 等于 posterior，', 'ts', 'start') + text(416, 118, 'gap 为 0。', 'ts', 'start');
  return svg(560, 276, o, 'ELBO 作为 q 的 mean 的 function：它始终在水平线 log p(x) = −2.113 之下，二者之差是 KL(q‖p(z|x))，在 μ = 0.94 处为 0');
}

// ---------- 第 2 站：latent space 插值（动图） ----------
function bar(theta, n = 10) {
  // 10×10 图像里一根经过中心、角度为 theta 的 bar，返回 intensity
  const c = (n - 1) / 2, out = [];
  const ux = Math.cos(theta), uy = Math.sin(theta);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const px = j - c, py = c - i;
    const along = px * ux + py * uy, perp = Math.abs(-px * uy + py * ux);
    const v = Math.max(0, Math.min(1, 1.3 - perp)) * (Math.abs(along) <= 4.2 ? 1 : 0);
    out.push(v);
  }
  return out;
}
function interpA() {
  const thA = 15 * Math.PI / 180, thB = 75 * Math.PI / 180;
  const zA = [Math.cos(2 * thA), Math.sin(2 * thA)], zB = [Math.cos(2 * thB), Math.sin(2 * thB)];
  const F = 24, T = 7, pre = 0.12, post = 0.2;
  const lam = [], kt = [];
  for (let k = 0; k <= F; k++) { lam.push(k / F); kt.push(pre + (1 - pre - post) * k / F); }
  const L = [0, ...lam, 1], K = [0, ...kt, 1];
  const zs = L.map((l) => [(1 - l) * zA[0] + l * zB[0], (1 - l) * zA[1] + l * zB[1]]);
  const dec = zs.map((z) => bar(Math.atan2(z[1], z[0]) / 2));
  const IA = bar(thA), IB = bar(thB);
  const pix = L.map((l) => IA.map((a, i) => (1 - l) * a + l * IB[i]));
  // latent plane
  const sx = lin(-1.4, 1.4, 30, 230), sy = lin(-1.4, 1.4, 246, 46);
  let o = text(130, 22, 'latent space（2 维）', 'tb', 'middle');
  o += line(sx(-1.4), sy(0), sx(1.4), sy(0), 'axis') + line(sx(0), sy(-1.4), sx(0), sy(1.4), 'axis');
  o += path(curve((t) => 0, 0, 0, sx, sy), 'mute');
  const circ = []; for (let k = 0; k <= 80; k++) { const a = 2 * Math.PI * k / 80; circ.push([sx(Math.cos(a)), sy(Math.sin(a))]); }
  o += path(d(circ), 'grid');
  for (let k = 0; k < 12; k++) { const a = 2 * Math.PI * k / 12; o += circle(sx(Math.cos(a)), sy(Math.sin(a)), 2.8, 'mute-f'); }
  o += line(sx(zA[0]), sy(zA[1]), sx(zB[0]), sy(zB[1]), 'dash');
  o += circle(sx(zA[0]), sy(zA[1]), 4.5, 'ink-f') + circle(sx(zB[0]), sy(zB[1]), 4.5, 'ink-f');
  o += text(sx(zA[0]) + 8, sy(zA[1]) + 16, 'z' + sub('A') + '（15°）', 'ts', 'start') + text(sx(zB[0]) - 8, sy(zB[1]) + 16, 'z' + sub('B') + '（75°）', 'ts', 'end');
  o += acircle(zs.map((z) => sx(z[0])), zs.map((z) => sy(z[1])), K, T, 5.5, 'ln-f');
  o += text(130, 270, '灰点：training image 的 latent', 'ts', 'middle');
  // 两张 10×10 图像
  const S = 9;
  const img = (x0, y0, frames, title, sub) => {
    let q = rect(x0 - 1, y0 - 1, 10 * S + 2, 10 * S + 2, 'frame');
    for (let i = 0; i < 100; i++) {
      const vals = frames.map((f) => Math.round(f[i] * 20) / 20);
      if (vals.every((v) => v === 0)) continue;
      const r = i / 10 | 0, c = i % 10;
      q += `<rect x="${x0 + c * S}" y="${y0 + r * S}" width="${S}" height="${S}" class="ink-f" fill-opacity="${vals[0]}">${anim('fill-opacity', vals, K, T)}</rect>`;
    }
    q += text(x0 + 5 * S, y0 - 12, title, 'tb', 'middle') + text(x0 + 5 * S, y0 + 10 * S + 18, sub, 'ts', 'middle');
    return q;
  };
  o += img(276, 70, dec, 'decoder(z)', 'bar 转过去');
  o += img(420, 70, pix, '直接在 pixel 上平均', '两根 bar 叠在一起');
  o += text(398, 216, '同一个 λ：左边 decode (1−λ)z' + sub('A') + ' + λz' + sub('B') + '，', 'ts', 'middle');
  o += text(398, 232, '右边是 (1−λ)x' + sub('A') + ' + λx' + sub('B') + '。', 'ts', 'middle');
  o += text(398, 256, '中点：左边是一根 45° 的 bar，右边是一个 X。', 'ts', 'middle');
  return svgA(560, 278, o, '动图：latent 的点从 z_A 沿直线走到 z_B，decoder 输出的 bar 从 15 度连续转到 75 度；同时在 pixel 上做平均，得到两根 bar 叠在一起的 X');
}

// ---------- 第 3 站：coupling layer 的结构 ----------
function coupling() {
  let o = '';
  o += rect(30, 40, 90, 36, 'paper', 6) + text(75, 63, 'x' + sub('A'), 't', 'middle');
  o += rect(30, 140, 90, 36, 'paper', 6) + text(75, 163, 'x' + sub('B'), 't', 'middle');
  o += arrow(122, 58, 330, 58, 'ink') + text(226, 50, '原样通过', 'ts', 'middle');
  o += rect(150, 86, 110, 36, 'wash', 6) + text(205, 109, 'network s, t', 't', 'middle');
  o += arrow(140, 58, 175, 86, 'mute');
  o += arrow(205, 122, 205, 148, 'mute');
  o += arrow(122, 158, 180, 158, 'ink');
  o += rect(182, 140, 150, 36, 'paper', 6) + text(257, 163, 'x' + sub('B') + ' ⊙ exp(s) + t', 't', 'middle');
  o += arrow(334, 158, 360, 158, 'ink') + arrow(332, 58, 360, 58, 'ink');
  o += text(368, 63, 'y' + sub('A') + ' = x' + sub('A'), 't', 'start') + text(368, 163, 'y' + sub('B'), 't', 'start');
  // Jacobian 的形状
  const X = 452, Y = 54, S = 84;
  o += text(X + S / 2, 32, 'Jacobian ∂y/∂x', 'tb', 'middle');
  o += rect(X, Y, S / 2, S / 2, 'wash') + rect(X, Y + S / 2, S / 2, S / 2, 'wash2') + rect(X + S / 2, Y + S / 2, S / 2, S / 2, 'wash');
  o += rect(X, Y, S, S, 'frame') + line(X + S / 2, Y, X + S / 2, Y + S, 'frame') + line(X, Y + S / 2, X + S, Y + S / 2, 'frame');
  o += text(X + S / 4, Y + S / 4 + 5, 'I', 'tb', 'middle') + text(X + 3 * S / 4, Y + S / 4 + 5, '0', 'tb', 'middle');
  o += text(X + S / 4, Y + 3 * S / 4 + 5, '复杂', 'ts', 'middle') + text(X + 3 * S / 4, Y + 3 * S / 4 - 2, 'diag', 'ts', 'middle') + text(X + 3 * S / 4, Y + 3 * S / 4 + 12, 'exp(s)', 'ts', 'middle');
  o += text(X + S / 2, Y + S + 20, 'det = ∏ exp(s' + sub('i') + ')', 't', 'middle');
  o += text(280, 214, '右上角是 0，所以 det 只看对角线；左下角再复杂也不进 det，s 和 t 可以是任意 network。', 'ts', 'middle');
  return svg(560, 226, o, 'Affine coupling layer：x_A 原样通过并作为 network 的 input 产生 s 和 t，x_B 变成 x_B 乘 e 的 s 次方加 t；Jacobian 是 block lower triangular，determinant 等于 e 的 s_i 次方之积');
}

// ---------- 第 3 站：两层 coupling 把 Gaussian 变成两个 blob（动图） ----------
function flowA() {
  const sA = -0.9, tA = (z2) => 2.2 * Math.tanh(4 * z2), sB = -0.3, tB = (x1) => -0.6 * Math.tanh(2 * x1);
  const mapA = ([z1, z2], l) => [z1 * Math.exp(l * sA) + l * tA(z2), z2];
  const mapB = ([x1, x2], l) => [x1, x2 * Math.exp(l * sB) + l * tB(x1)];
  const full = (p, la, lb) => mapB(mapA(p, la), lb);
  const F = 3, T = 9;
  const stages = [];
  const kt = [];
  // 0..0.1 静止，0.1..0.4 layer 1，0.4..0.5 停，0.5..0.8 layer 2，0.8..0.9 停，0.9..1 回到起点
  stages.push([0, 0]); kt.push(0);
  for (let k = 0; k <= F; k++) { stages.push([k / F, 0]); kt.push(0.1 + 0.3 * k / F); }
  for (let k = 0; k <= F; k++) { stages.push([1, k / F]); kt.push(0.5 + 0.3 * k / F); }
  stages.push([1, 1]); kt.push(0.9);
  stages.push([0, 0]); kt.push(1);
  const sx = lin(-4, 4, 20, 340), sy = lin(-3, 3, 266, 26);
  const P = ([a, b]) => [sx(a), sy(b)];
  let o = rect(20, 26, 320, 240, 'frame');
  // 网格线
  const lines = [];
  for (const c of [-2, -1, 0, 1, 2]) {
    const v = [], h = [];
    for (let k = 0; k <= 36; k++) { const u = -2.6 + 5.2 * k / 36; v.push([c, u]); h.push([u, c]); }
    lines.push(v, h);
  }
  for (const L of lines) o += apath(stages.map(([la, lb]) => d(L.map((p) => P(full(p, la, lb))))), kt, T, 'grid');
  // 一个格子 [0,1]×[0,1]
  const cell = []; for (let k = 0; k <= 10; k++) cell.push([k / 10, 0]); for (let k = 0; k <= 10; k++) cell.push([1, k / 10]); for (let k = 10; k >= 0; k--) cell.push([k / 10, 1]); for (let k = 10; k >= 0; k--) cell.push([0, k / 10]);
  o += apath(stages.map(([la, lb]) => d(cell.map((p) => P(full(p, la, lb)))) + 'Z'), kt, T, 'wash-strong');
  // sample 点
  const r = rng(11);
  for (let i = 0; i < 90; i++) {
    const z = [r.g(), r.g()];
    if (Math.abs(z[0]) > 2.6 || Math.abs(z[1]) > 2.6) continue;
    const pts = stages.map(([la, lb]) => P(full(z, la, lb)));
    o += acircle(pts.map((p) => p[0]), pts.map((p) => p[1]), kt, T, 2.2, 'ln-f');
  }
  // 右侧说明，随阶段出现
  const X = 356;
  const on = (f) => kt.map((_, i) => f(i));
  const nA = F + 2; // stages 下标：1..F+1 是 layer 1
  o += text(X, 40, 'z ~ N(0, I)', 'tb', 'start');
  o += text(X, 64, 'layer 1：x₂ 不动，', 't', 'start') + text(X, 82, 'x₁ ← x₁·exp(−0.9) + 2.2 tanh(4x₂)', 'ts', 'start') + text(X, 100, '上半往右、下半往左：剪开', 'ts', 'start');
  o += text(X, 128, 'layer 2：x₁ 不动，', 't', 'start') + text(X, 146, 'x₂ ← x₂·exp(−0.3) − 0.6 tanh(2x₁)', 'ts', 'start') + text(X, 164, '两块各自挪回中线', 'ts', 'start');
  void on; void nA;
  o += text(X, 198, '深色格子是 z 空间里的 [0,1]²。', 'ts', 'start');
  o += text(X, 216, 'tanh 那一项只是剪切，不改面积；', 'ts', 'start');
  o += text(X, 234, '面积只被 exp(s) 改：两层合计', 'ts', 'start');
  o += text(X, 252, '× exp(−1.2) = 0.301。', 'ts', 'start');
  return svgA(560, 272, o, '动图：二维 Gaussian 的 sample 和网格经过第一层 coupling 被剪成左右两块，再经过第二层各自挪回中线，变成两个 blob；一个格子的面积始终按 e 的 s 次方缩放');
}

// ---------- 第 4 站：Dirac GAN 的训练动态（动图） ----------
function ganA() {
  const h = 0.1, n = 1000, every = 8;
  let th = 1, ps = 0;
  const traj = [[th, ps]];
  for (let k = 1; k <= n; k++) {
    const gps = -th * sg(ps * th), gth = -ps * sg(ps * th);
    th = th - h * gth; ps = ps + h * gps;
    if (k % every === 0) traj.push([th, ps]);
  }
  const m = traj.length, T = 14;
  const kt = traj.map((_, i) => i / (m - 1));
  const rEnd = Math.hypot(...traj[m - 1]);
  // 左：number line + D(x)
  const sx = lin(-3.5, 3.5, 24, 284), sy = lin(0, 1, 200, 60);
  let o = text(154, 22, 'data 与 generator（各是一个点）', 'tb', 'middle');
  o += line(sx(-3.5), sy(0), sx(3.5), sy(0), 'axis') + line(sx(-3.5), sy(0.5), sx(3.5), sy(0.5), 'grid');
  for (const v of [-3, -2, -1, 0, 1, 2, 3]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, v < 0 ? '−' + -v : String(v), 'ts', 'middle');
  o += text(sx(-3.5) - 2, sy(1) + 4, '1', 'ts', 'end') + text(sx(-3.5) - 2, sy(0.5) + 4, '½', 'ts', 'end');
  const Dpath = ([t, p]) => { const pts = []; for (let k = 0; k <= 28; k++) { const x = -3.5 + 7 * k / 28; pts.push([sx(x), sy(sg(p * x))]); } return d(pts); };
  o += apath(traj.map(Dpath), kt, T, 'ink');
  o += text(sx(-3.0), sy(0.95), 'D(x) = σ(ψx)', 'ts', 'start');
  o += circle(sx(0), sy(0), 6, 'ink-f') + text(sx(0), sy(0) + 34, 'data：x = 0', 'ts', 'middle');
  o += acircle(traj.map(([t]) => sx(t)), traj.map(() => sy(0)), kt, T, 6, 'ln-f');
  o += text(154, 252, 'generator 的点：x = θ', 'tl', 'middle');
  // 右：(θ, ψ) 平面
  const px = lin(-3.2, 3.2, 330, 548), py = lin(-3.2, 3.2, 230, 40);
  o += text(439, 22, '参数 (θ, ψ) 的轨迹', 'tb', 'middle');
  o += line(px(-3.2), py(0), px(3.2), py(0), 'axis') + line(px(0), py(-3.2), px(0), py(3.2), 'axis');
  o += text(px(3.2), py(0) - 6, 'θ', 'ts', 'end') + text(px(0) + 6, py(3.2) + 10, 'ψ', 'ts', 'start');
  { let a = 1, b = 0; const fine = [[a, b]]; for (let k = 1; k <= n; k++) { const s1 = sg(a * b); const na = a + h * b * s1, nb = b - h * a * s1; a = na; b = nb; fine.push([a, b]); } o += path(d(fine.map(([t, p]) => [px(t), py(p)])), 'mute'); }
  o += circle(px(0), py(0), 3.5, 'ink-f') + line(px(0), py(0), px(-2.6), py(-2.75), 'mute') + text(px(-3.2), py(-2.75) + 14, 'equilibrium', 'ts', 'start');
  o += acircle(traj.map(([t]) => px(t)), traj.map(([, p]) => py(p)), kt, T, 5, 'ln-f');
  o += text(439, 252, `simultaneous GD，step 0.1：1000 步后`, 'ts', 'middle');
  o += text(439, 268, `离 equilibrium 的距离从 1 变成 ${rEnd.toFixed(2)}`, 'ts', 'middle');
  return svgA(560, 276, o, '动图：data 是 0 处的一个点，generator 是 θ 处的一个点，discriminator 是 sigmoid 曲线；同时做 gradient 更新时，generator 的点在 0 两侧来回越摆越远，参数平面上的轨迹向外螺旋');
}

// ---------- 第 5 站：Langevin 找不到 mixture weight ----------
function langevin() {
  const w = [0.8, 0.2], mu = [-2, 2], v = 0.25;
  const score = (x) => { const a = w[0] * N(x, mu[0], v), b = w[1] * N(x, mu[1], v); return (a * (mu[0] - x) + b * (mu[1] - x)) / v / (a + b); };
  const r = rng(3), M = 4000, eps = 0.1, steps = 2000;
  const X = []; for (let i = 0; i < M; i++) X.push(-4 + 8 * r.u());
  for (let k = 0; k < steps; k++) for (let i = 0; i < M; i++) X[i] += eps * eps / 2 * score(X[i]) + eps * r.g();
  const right = X.filter((x) => x > 0).length / M;
  const p = (x) => w[0] * N(x, mu[0], v) + w[1] * N(x, mu[1], v);
  const sx = lin(-4, 4, 40, 520), sy = lin(0, 0.9, 210, 40);
  let o = '';
  // histogram
  const nb = 40, bw = 8 / nb, cnt = new Array(nb).fill(0);
  for (const x of X) { const b = Math.floor((x + 4) / bw); if (b >= 0 && b < nb) cnt[b]++; }
  cnt.forEach((c, b) => { const hgt = c / M / bw; if (hgt > 0) o += rect(sx(-4 + b * bw) + 0.5, sy(hgt), sx(bw) - sx(0) - 1, sy(0) - sy(hgt), 'wash-strong'); });
  o += path(curve(p, -4, 4, sx, sy), 'ink-b');
  o += axes({ sx, sy, x0: -4, x1: 4, y0: 0, y1: 0.9, xt: [-4, -2, 0, 2, 4], yt: [] });
  o += text(sx(-2), sy(0.74) - 10, '真实 weight 0.8', 't', 'middle');
  o += text(sx(2), sy(0.74) - 10, '真实 weight 0.2', 't', 'middle');
  o += text(sx(-2), 236, 'Langevin：' + pct(1 - right), 'tl', 'middle') + text(sx(2), 236, 'Langevin：' + pct(right), 'tl', 'middle');
  o += text(280, 256, `${M} 条 chain 从 [−4, 4] 均匀出发，用 exact score、ε = 0.1 走 ${steps} 步。`, 'ts', 'middle');
  o += text(280, 272, '柱子是终点的 histogram，曲线是真正的 p。', 'ts', 'middle');
  return { s: svg(560, 280, o, '0.8 和 0.2 两个 weight 的 mixture；用 exact score 跑 Langevin 之后，两边的 sample 比例接近一半一半，而不是 0.8 比 0.2'), right };
}

// ---------- 第 6 站：forward process 的 marginal ----------
function forward() {
  const T = 1000, beta = [], ab = [];
  let a = 1;
  for (let t = 1; t <= T; t++) { const b = 1e-4 + (0.02 - 1e-4) * (t - 1) / (T - 1); beta.push(b); a *= 1 - b; ab.push(a); }
  const rows = [0, 100, 250, 500, 1000];
  const sx = lin(-4, 4, 110, 470);
  let o = '';
  rows.forEach((t, i) => {
    const s = t === 0 ? 1 : Math.sqrt(ab[t - 1]), vv = t === 0 ? 0.25 : ab[t - 1] * 0.25 + 1 - ab[t - 1];
    const q = (x) => 0.8 * N(x, -2 * s, vv) + 0.2 * N(x, 2 * s, vv);
    const base = 60 + i * 48, sy = lin(0, 0.7, base, base - 44);
    o += path(area(q, -4, 4, sx, sy), 'wash') + path(curve(q, -4, 4, sx, sy), 'ln');
    o += line(sx(-4), base, sx(4), base, 'axis');
    o += text(100, base - 4, 't = ' + t, 'tb', 'end');
    o += text(480, base - 4, t === 0 ? 'data' : '√ᾱₜ = ' + s.toFixed(3), 'ts', 'start');
  });
  for (const v of [-2, 0, 2]) o += text(sx(v), 270, v < 0 ? '−2' : String(v), 'ts', 'middle');
  o += text(280, 290, 'q(xₜ) 是两个 Gaussian：center 是 ±2√ᾱₜ，variance 是 0.25ᾱₜ + (1 − ᾱₜ)。', 'ts', 'middle');
  return svg(560, 298, o, 'Forward process 下 0.8 与 0.2 mixture 的 marginal：t = 100 时两个 bump 变宽，t = 500 时已经合成一个偏左的 bump，t = 1000 时接近 N(0,1)');
}

// 第 6 站：VLB 的 chain
function chain() {
  const xs = [50, 160, 270, 400, 510], labs = ['x₀', 'x₁', '…', 'x' + sub('T−1'), 'x' + sub('T')];
  let o = '';
  xs.forEach((x, i) => {
    if (i === 2) { o += text(x, 116, '⋯', 'tbig', 'middle'); return; }
    o += circle(x, 110, 24, i === 0 ? 'wash' : 'paper') + text(x, 115, labs[i], 't', 'middle');
  });
  const pair = (a, b, top, bot) => {
    const x1 = xs[a] + 26, x2 = xs[b] - 26;
    o += arrow(x1, 98, x2, 98, 'mute') + arrow(x2, 122, x1, 122, 'ln');
    if (top) o += text((x1 + x2) / 2, 86, top, 'ts', 'middle');
    if (bot) o += text((x1 + x2) / 2, 142, bot, 'ts', 'middle');
  };
  pair(0, 1, 'q(x₁|x₀)', 'p' + sub('θ') + '(x₀|x₁)');
  pair(1, 2, '', '');
  pair(2, 3, '', '');
  pair(3, 4, 'q(x' + sub('T') + '|x' + sub('T−1') + ')', 'p' + sub('θ') + '(x' + sub('T−1') + '|x' + sub('T') + ')');
  o += text(280, 34, '上面一排：固定的 forward process q，加 noise，不含 θ', 'ts', 'middle');
  o += text(280, 170, '下面一排：学出来的 reverse process，每一步是一个 Gaussian', 'tl', 'middle');
  const br = (x1, x2, y, s1, s2) => { o += path(d([[x1, y - 6], [x1, y], [x2, y], [x2, y - 6]]), 'ink') + text((x1 + x2) / 2, y + 18, s1, 't', 'middle') + text((x1 + x2) / 2, y + 34, s2, 'ts', 'middle'); };
  br(30, 186, 196, 'L₀', '−log p' + sub('θ') + '(x₀|x₁)：reconstruction');
  br(214, 380, 196, 'L' + sub('t−1') + '，t = 2…T', 'KL( q(xₜ₋₁|xₜ, x₀) ‖ p' + sub('θ') + '(xₜ₋₁|xₜ) )');
  br(470, 540, 196, 'L' + sub('T'), 'x' + sub('T') + ' 与 N(0, I)');
  return svg(560, 242, o, 'Diffusion 的 chain：上排是固定的 forward process，下排是学出来的 reverse process；VLB 拆成 L_0、每一步的 KL L_{t-1} 和与 prior 比较的 L_T');
}

// ---------- 第 7 站：autoregressive 的 2×2 例子 ----------
function ar() {
  let o = '';
  const S = 52, X0 = 40, Y0 = 50, xv = [0, 1, 1, 0];
  o += text(X0 + S, 30, 'raster 顺序', 'tb', 'middle');
  for (let i = 0; i < 4; i++) {
    const r = i >> 1, c = i & 1;
    o += rect(X0 + c * S, Y0 + r * S, S, S, xv[i] ? 'solid' : 'paper');
    o += text(X0 + c * S + 8, Y0 + r * S + 16, String(i + 1), xv[i] ? 'tw' : 'ts', 'start');
    o += text(X0 + c * S + S / 2, Y0 + r * S + S / 2 + 10, 'x=' + xv[i], xv[i] ? 'tw' : 't', 'middle');
  }
  o += text(X0 + S, Y0 + 2 * S + 22, 'x = (0, 1, 1, 0)', 't', 'middle');
  // 表
  const th = { 1: [-0.5, []], 2: [0.2, [1.5]], 3: [-0.3, [0.8, 1.2]], 4: [0.4, [-1.0, 0.5, -0.7]] };
  const X = 190;
  o += text(X, 30, 'i', 'tb', 'start') + text(X + 30, 30, 'logit = θ₀ + Σ θⱼxⱼ', 'tb', 'start') + text(X + 196, 30, 'x̂ᵢ', 'tb', 'start') + text(X + 254, 30, '这一项', 'tb', 'start');
  let P = 1;
  for (let i = 1; i <= 4; i++) {
    const [b, ws] = th[i];
    const z = b + ws.reduce((s, wj, j) => s + wj * xv[j], 0), xh = sg(z), f = xv[i - 1] ? xh : 1 - xh;
    P *= f;
    const terms = [String(b).replace('-', '−'), ...ws.map((wj, j) => (wj < 0 ? '−' : '+') + Math.abs(wj) + '·' + xv[j])].join(' ');
    const y = 30 + i * 26;
    o += text(X, y, String(i), 't', 'start') + text(X + 30, y, terms + ' = ' + z.toFixed(2).replace('-', '−'), 'ts', 'start');
    o += text(X + 196, y, xh.toFixed(3), 't', 'start') + text(X + 254, y, (xv[i - 1] ? 'x̂' : '1 − x̂') + ' = ' + f.toFixed(3), 't', 'start');
  }
  o += line(X, 150, X + 350, 150, 'grid');
  o += text(X, 172, 'p(x) = 0.622 × 0.550 × 0.711 × 0.450 = ' + P.toFixed(4), 'tl', 'start');
  o += text(X, 196, '第 i 个 logit 只用 x₁ … xᵢ₋₁：training 时 x 全部已知，', 'ts', 'start');
  o += text(X, 212, '4 个 x̂ 一次算完；sampling 时必须先抽出 x₁ 才能算 x̂₂。', 'ts', 'start');
  return svg(560, 222, o, '2 乘 2 的 binary image 按 raster 顺序排成 4 个 pixel，每个 pixel 的 Bernoulli parameter 由前面的 pixel 经 logistic regression 给出；四项相乘得到 p(x) = 0.1095');
}

// ---------- 第 8 站：FID 看不出的区别 ----------
function fid() {
  let o = '';
  const panels = [
    [(x) => N(x, 0, 4.25), 'N(0, 4.25)', 'FID = 0', 'NLL = 2.142'],
    [(x) => N(x, 2, 0.25), '只生成右边的 bump', 'FID = 6.44', 'NLL = 16.73'],
    [pdata, '真正的 p' + sub('data'), 'FID = 0', 'NLL = 1.419'],
  ];
  panels.forEach(([q, t1, t2, t3], i) => {
    const x0 = 20 + i * 182, sx = lin(-4.5, 4.5, x0, x0 + 164), sy = lin(0, 0.85, 180, 50);
    o += path(area(pdata, -4.5, 4.5, sx, sy), 'wash');
    o += path(curve(q, -4.5, 4.5, sx, sy), 'ln');
    o += line(x0, 180, x0 + 164, 180, 'axis');
    o += text(x0 + 82, 30, t1, 'tb', 'middle');
    o += text(x0 + 82, 204, t2, 'tl', 'middle') + text(x0 + 82, 222, t3, 'ts', 'middle');
  });
  o += text(280, 248, '底色是 p' + sub('data') + '（mean 0，variance 4.25），曲线是 generator。', 'ts', 'middle');
  o += text(280, 264, 'Feature 取 x 本身；NLL 是 data 在 generator 下的平均 −log q（nats）。', 'ts', 'middle');
  return svg(560, 272, o, '三个 generator：moment 相同的单个 Gaussian 和真正的 data distribution 的 FID 都是 0；只生成一个 bump 的 FID 是 6.44；NLL 分别是 2.142、16.73、1.419');
}

// ---------- 第 8 站：behavior cloning 的 averaging ----------
function bc() {
  const sx = lin(-2.2, 2.2, 40, 300), sy = lin(-0.3, 4.3, 250, 20);
  let o = '';
  o += circle(sx(0), sy(2), (sx(0.6) - sx(0)), 'wash2') + circle(sx(0), sy(2), (sx(0.6) - sx(0)), 'frame') + text(sx(0), sy(2) + 4, 'obstacle', 'ts', 'middle');
  const qb = (s) => { const pts = []; for (let k = 0; k <= 40; k++) { const u = k / 40; const x = 2 * (1 - u) * u * (s * 2.4); const y = 4 * u; pts.push([sx(x), sy(y)]); } return d(pts); };
  o += path(qb(-1), 'ln') + path(qb(1), 'ln');
  o += arrow(sx(0), sy(0), sx(0), sy(1.38), 'ink-b');
  o += text(sx(0) + 6, sy(1.0), 'MSE', 'tb', 'start');
  o += circle(sx(0), sy(0), 5, 'ink-f') + text(sx(0), sy(0) + 20, 'start', 'ts', 'middle');
  o += rect(sx(0) - 6, sy(4) - 6, 12, 12, 'solid') + text(sx(0), sy(4) - 12, 'goal', 'ts', 'middle');
  o += text(sx(-1.4), sy(3.0), 'demo A', 'tl', 'middle') + text(sx(1.4), sy(3.0), 'demo B', 'tl', 'middle');
  const X = 330, hd = Math.round(Math.atan2(2 * 2.4, 4) * 180 / Math.PI);
  o += text(X, 50, '在 start 这个 observation 上：', 't', 'start');
  o += text(X, 74, `demo A 的 heading：−${hd}°`, 'ts', 'start');
  o += text(X, 92, `demo B 的 heading：+${hd}°`, 'ts', 'start');
  o += text(X, 116, '平方误差最小的单个输出：0°', 'tl', 'start');
  o += text(X, 134, '正对 obstacle。', 'ts', 'start');
  o += text(X, 168, 'p(a | o) 有两个 mode，', 'ts', 'start');
  o += text(X, 186, '和第 1 站那两个 bump 是同一件事：', 'ts', 'start');
  o += text(X, 204, '要的是能 sample 一个 mode 的', 'ts', 'start');
  o += text(X, 222, 'generative model，而不是 mean。', 'ts', 'start');
  return svg(560, 262, o, '俯视图：从 start 到 goal，demo A 从左边绕过 obstacle，demo B 从右边绕过；两者 heading 的平均是 0 度，正对 obstacle');
}

const L = langevin();
export const langevinRight = L.right;

export default {
  'cs5788-fit': fit,
  'cs5788-kl': kl,
  'cs5788-elbo': elbo,
  'cs5788-interp': interpA,
  'cs5788-coupling': coupling,
  'cs5788-flow': flowA,
  'cs5788-gan': ganA,
  'cs5788-langevin': () => L.s,
  'cs5788-forward': forward,
  'cs5788-chain': chain,
  'cs5788-ar': ar,
  'cs5788-fid': fid,
  'cs5788-bc': bc,
};
