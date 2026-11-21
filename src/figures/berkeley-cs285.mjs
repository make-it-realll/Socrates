import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 标准正态的 pdf 与分位数（分位数用二分）
const npdf = (x, m = 0, s = 1) => Math.exp(-((x - m) ** 2) / (2 * s * s)) / (Math.sqrt(2 * Math.PI) * s);
const ncdf = (x) => {
  // Abramowitz–Stegun 7.1.26 近似 erf
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
};
const nq = (p) => { let lo = -8, hi = 8; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (ncdf(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };

// 第 1 站：两个 mode 的 2 维 action，三种 policy 在四个格子上的 probability
function ar() {
  const p = 0.555, q = 1 - p;
  const panels = [
    ['Data（200 条）', [[p, 0], [0, q]]],
    ['逐维独立的 softmax', [[p * p, p * q], [q * p, q * q]]],
    ['Autoregressive', [[p, 0], [0, q]]],
  ];
  let o = '';
  panels.forEach(([title, M], k) => {
    const x0 = 40 + k * 180, y0 = 44, c = 56;
    o += text(x0 + c, 22, title, 'tb', 'middle');
    // M = [[P(+,+), P(+,−)], [P(−,+), P(−,−)]]，下标是 (a1, a2)
    const cells = [[-1, 1, M[1][0]], [1, 1, M[0][0]], [-1, -1, M[1][1]], [1, -1, M[0][1]]];
    for (const [a1, a2, v] of cells) {
      const x = x0 + (a1 > 0 ? c : 0), y = y0 + (a2 > 0 ? 0 : c);
      const offDiag = a1 !== a2;
      const cls = v > 0.4 ? 'solid' : v > 0.15 ? 'band-p' : v > 0 ? 'wash' : '';
      if (cls) o += rect(x, y, c, c, cls);
      o += rect(x, y, c, c, 'frame');
      o += text(x + c / 2, y + c / 2 + 5, v === 0 ? '0' : v.toFixed(3), v > 0.4 ? 'tw' : 't', 'middle');
      if (offDiag && v > 0) o += rect(x + 3, y + 3, c - 6, c - 6, 'ln-dash');
    }
    o += text(x0 + c / 2, y0 + 2 * c + 16, '−1', 'ts', 'middle') + text(x0 + 1.5 * c, y0 + 2 * c + 16, '+1', 'ts', 'middle');
    o += text(x0 - 6, y0 + c / 2 + 4, '+1', 'ts', 'end') + text(x0 - 6, y0 + 1.5 * c + 4, '−1', 'ts', 'end');
    o += text(x0 + c, y0 + 2 * c + 32, it('a') + '₁', 'ts', 'middle');
    if (k === 0) o += text(x0 - 26, y0 + c + 4, it('a') + '₂', 'ts', 'middle');
  });
  // MSE 的输出：(0.11, 0.11)，在第一个 panel 的格子交界附近
  const cx = 40 + 56 + 0.11 * 56, cy = 44 + 56 - 0.11 * 56;
  o += circle(cx, cy, 4.5, 'ink-f') + text(cx + 6, cy + 20, 'MSE', 'tb');
  o += text(280, 222, '数字是 probability。虚线框是 data 里没有出现过的组合；黑点是 MSE policy 的输出 (0.11, 0.11)。', 'ts', 'middle');
  return svg(560, 232, o, '两个 mode 的 demonstration 下，逐维独立的 softmax 把约一半的 probability 放到 data 中没有的两个角上，autoregressive 的 policy 与 data 一致');
}

// 第 1 站：flow matching 的 sample path，network 看得到 τ 与看不到 τ
function flowtau() {
  const vstar = (x, tau) => { const s = 1 - tau; return (Math.tanh((tau * x) / (s * s)) - x) / s; };
  const taus = Array.from({ length: 1200 }, (_, i) => (i + 0.5) / 1200);
  const vbar = (x) => {
    let num = 0, den = 0;
    for (const t of taus) { const s = 1 - t; const w = 0.5 * npdf(x, t, s) + 0.5 * npdf(x, -t, s); num += w * vstar(x, t); den += w; }
    return num / den;
  };
  const n = 10, Z = Array.from({ length: 24 }, (_, i) => nq((i + 0.5) / 24));
  let o = '';
  const panel = (x0, title, field) => {
    const sx = lin(0, 1, x0, x0 + 210), sy = lin(-2.4, 2.4, 225, 35);
    o += rect(x0, 35, 210, 190, 'frame');
    o += line(x0, sy(1), x0 + 210, sy(1), 'dash') + line(x0, sy(-1), x0 + 210, sy(-1), 'dash') + line(x0, sy(0), x0 + 210, sy(0), 'grid');
    for (const z of Z) {
      let x = z; const pts = [[sx(0), sy(x)]];
      for (let k = 0; k < n; k++) { x = x + field(x, k / n) / n; pts.push([sx((k + 1) / n), sy(Math.max(-2.4, Math.min(2.4, x)))]); }
      o += path(d(pts), 'ln');
    }
    o += text(x0 + 105, 22, title, 'tb', 'middle');
    o += text(x0, 242, '0', 'ts', 'middle') + text(x0 + 210, 242, '1', 'ts', 'middle') + text(x0 + 105, 242, 'flow timestep τ', 'ts', 'middle');
    o += text(x0 - 6, sy(1) + 4, '+1', 'ts', 'end') + text(x0 - 6, sy(-1) + 4, '−1', 'ts', 'end') + text(x0 - 6, sy(0) + 4, '0', 'ts', 'end');
  };
  panel(45, 'v(x, τ)：network 看得到 τ', vstar);
  panel(315, 'v(x)：network 看不到 τ', (x) => vbar(x));
  o += text(280, 266, '24 条 path，起点是 N(0, 1) 的 24 个等分位点；10 步 Euler；虚线是 data 的两个 mode ±1', 'ts', 'middle');
  return svg(560, 276, o, 'Flow matching 的 sample path：network 以 tau 为 input 时所有 path 都到达正负 1；看不到 tau 时，从 0 附近出发的 path 停在中间');
}

// 第 2 站：方向估反的 probability 随 batch 大小 N 的变化（python3 -I 模拟，seed 0、1）
function pgvar() {
  const N = [1, 2, 4, 8, 16, 32, 64, 128];
  const S = [
    ['full return', [0.5743, 0.4293, 0.3312, 0.2429, 0.152, 0.0691, 0.0176, 0.0015], 'mute'],
    ['reward-to-go', [0.3307, 0.2772, 0.2087, 0.127, 0.0525, 0.0108, 0.0007, 0], 'ink'],
    ['reward-to-go − baseline', [0.2302, 0.1603, 0.0864, 0.0296, 0.004, 0.0001, 0, 0], 'ln'],
  ];
  const sx = lin(0, 7, 70, 400), sy = lin(0, 0.6, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 7, y0: 0, y1: 0.6, xt: N.map((v, i) => [i, String(v)]), yt: [[0.2, '20%'], [0.4, '40%'], [0.6, '60%']], grid: true });
  for (const [name, ys, cls] of S) {
    o += path(d(ys.map((y, i) => [sx(i), sy(y)])), cls === 'mute' ? 'mute' : cls === 'ink' ? 'ink' : 'ln');
    ys.forEach((y, i) => { o += circle(sx(i), sy(y), 3, cls === 'ln' ? 'ln-f' : cls === 'ink' ? 'ink-f' : 'mute-f'); });
  }
  const leg = [['full return', '97.7', 'mute', 'mute-f'], ['reward-to-go', '40.3', 'ink', 'ink-f'], ['减 baseline', '16.5', 'ln', 'ln-f']];
  leg.forEach(([nm, v, cls, f], i) => { const y = 66 + i * 22; o += line(420, y - 4, 444, y - 4, cls) + circle(432, y - 4, 3, f) + text(452, y, nm + '  ' + v, i === 2 ? 'tl' : 'ts'); });
  o += text(420, 148, '右边的数是一条', 'ts') + text(420, 164, 'trajectory 的 variance', 'ts');
  o += text(420, 196, 'True gradient = 2.5', 't');
  o += text(235, 252, '每个 batch 的 trajectory 数 N（log scale）', 'ts', 'middle');
  o += text(70, 18, '估出的 gradient 与 true gradient 反号的 probability', 'tb');
  return svg(560, 262, o, '三种 policy gradient estimator 估反方向的 probability 随 batch 大小下降，减去 baseline 的 reward-to-go 下降得最快');
}

// 第 3 站：GAE 的 bias² 与 variance/100 随 λ 的变化（250,000 个 episode 的模拟）
function gae() {
  const L = [0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 0.98, 1.0];
  const B2 = [0.0657, 0.0505, 0.0369, 0.0305, 0.0241, 0.0176, 0.0108, 0.0074, 0.0041, 0.0013, 0.0002, 0];
  const V = [0.02624, 0.02407, 0.0227, 0.02229, 0.02214, 0.02236, 0.02325, 0.02415, 0.0256, 0.02808, 0.0306, 0.03347];
  const sx = lin(0, 1, 70, 420), sy = lin(0, 0.1, 225, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 0.1, xt: [0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => [v, String(v)]), yt: [[0.025, '0.025'], [0.05, '0.05'], [0.075, '0.075'], [0.1, '0.1']], grid: true });
  const pl = (ys, cls) => path(d(ys.map((y, i) => [sx(L[i]), sy(y)])), cls);
  o += pl(B2, 'mute') + pl(V, 'ink') + pl(B2.map((b, i) => b + V[i]), 'ln');
  L.forEach((l, i) => { o += circle(sx(l), sy(B2[i] + V[i]), 3, 'ln-f'); });
  o += circle(sx(0.95), sy(B2[9] + V[9]), 6, 'mute');
  o += text(sx(0.06), sy(0.067) - 8, 'bias²', 'ts') + text(sx(0.12), sy(0.021) + 16, 'variance / 100', 'ts');
  o += text(sx(0.2), sy(0.079), 'bias² + variance / 100', 'tl');
  o += text(sx(0.85), sy(0.0152), '最低：λ = 0.95', 'tb', 'middle');
  o += text(245, 256, 'GAE 的 λ', 'ts', 'middle');
  o += text(440, 80, 'Random walk，', 'ts') + text(440, 96, 'critic 带 std 0.15 的', 'ts') + text(440, 112, '固定 error；', 'ts') + text(440, 128, '每个 batch 100 个', 'ts') + text(440, 144, 'episode', 'ts');
  return svg(560, 266, o, 'GAE 的 bias 平方随 lambda 增大而下降，variance 在 lambda 接近 1 时上升，两者之和在 lambda 约 0.95 处最小');
}

// 第 4 站：tanh-squashed Gaussian 的 density 与 entropy
function tanh() {
  const dens = (a, s) => { const u = Math.atanh(a); return npdf(u, 0, s) / (1 - a * a); };
  const H = (s) => {
    // H(a) = H(u) + E[log(1 - tanh² u)]，数值积分
    let e = 0; const n = 4000, U = 10 * s;
    for (let i = 0; i < n; i++) { const u = -U + ((i + 0.5) * 2 * U) / n; const t = Math.tanh(u); e += npdf(u, 0, s) * Math.log(Math.max(1 - t * t, 1e-300)) * ((2 * U) / n); }
    return 0.5 * Math.log(2 * Math.PI * Math.E * s * s) + e;
  };
  let o = '';
  // 左：density
  const sx = lin(-1, 1, 50, 250), sy = lin(0, 2, 215, 40);
  o += axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 2, xt: [[-1, '−1'], [0, '0'], [1, '1']], yt: [[1, '1'], [2, '2']] });
  o += line(sx(-1), sy(0.5), sx(1), sy(0.5), 'dash');
  const sig = [[0.3, 'mute'], [0.87, 'ln'], [2.0, 'ink']];
  for (const [s, cls] of sig) o += path(curve((a) => Math.min(dens(a, s), 2.05), -0.999, 0.999, sx, sy, 400), cls);
  o += text(sx(0.2), sy(1.55), 'σ = 0.3', 'ts') + text(sx(0.35), sy(0.82), 'σ = 0.87', 'tl') + text(sx(-0.66), sy(1.3), 'σ = 2', 't', 'middle');
  o += text(150, 22, 'a = tanh(u)，u ~ N(0, σ²)', 'tb', 'middle') + text(150, 248, 'action a（虚线是 uniform 的 density 0.5）', 'ts', 'middle');
  // 右：entropy 随 σ
  const tx = lin(0.1, 3, 320, 530), ty = lin(-1.2, 0.8, 215, 40);
  o += axes({ sx: tx, sy: ty, x0: 0.1, x1: 3, y0: -1.2, y1: 0.8, xt: [[0.5, '0.5'], [1, '1'], [2, '2'], [3, '3']], yt: [[-1, '−1'], [0, '0'], [0.5, '0.5']], xAt: -1.2 });
  o += line(tx(0.1), ty(0), tx(3), ty(0), 'grid');
  o += line(tx(0.1), ty(Math.log(2)), tx(3), ty(Math.log(2)), 'dash') + text(tx(3), ty(Math.log(2)) - 6, 'log 2 = 0.693', 'ts', 'end');
  o += path(curve(H, 0.12, 3, tx, ty, 120), 'ln');
  o += circle(tx(0.874), ty(0.684), 4, 'ink-f') + text(tx(0.874) + 8, ty(0.684) + 18, '最大 0.684（σ ≈ 0.87）', 'ts');
  o += text(425, 22, 'entropy 随 σ 的变化', 'tb', 'middle') + text(425, 248, 'σ', 'ts', 'middle');
  return svg(560, 258, o, 'tanh 压缩后的 Gaussian 的 density 和 entropy：sigma 太大时 mass 被推到两端，entropy 最大约 0.684，略低于 uniform 的 log 2');
}

// 第 5 站：LQR 上 vanilla 与 natural gradient 的方向
function natgrad() {
  const g = 0.9, m0 = 1;
  const M = (k, s) => (m0 + (g * s * s) / (1 - g)) / (1 - g * (1 + k) ** 2);
  const J = (k, s) => -((1 + k * k) * M(k, s) + (s * s) / (1 - g));
  const grad = (k, s, h = 1e-6) => [(J(k + h, s) - J(k - h, s)) / (2 * h), (J(k, s + h) - J(k, s - h)) / (2 * h)];
  const nat = (k, s) => { const [gk, gs] = grad(k, s); return [gk / (M(k, s) / (s * s)), gs / ((2 / (1 - g)) / (s * s))]; };
  let o = '';
  const panel = (x0, title, field) => {
    const sx = lin(-1.8, -0.2, x0, x0 + 210), sy = lin(0, 1.05, 225, 40);
    o += axes({ sx, sy, x0: -1.8, x1: -0.2, y0: 0, y1: 1.05, xt: [[-1.6, '−1.6'], [-1.0, '−1'], [-0.4, '−0.4']], yt: [[0.5, '0.5'], [1, '1']] });
    o += line(sx(-0.588), sy(0), sx(-0.588), sy(1.05), 'ln-dash');
    o += circle(sx(-0.588), sy(0), 5, 'ln-f');
    for (const k of [-1.6, -1.3, -1.0, -0.7, -0.4]) for (const s of [0.1, 0.3, 0.55, 0.8, 1.0]) {
      const [a, b] = field(k, s), n = Math.hypot(a, b);
      // 方向：屏幕坐标里 σ 向上
      const L = 15, ux = (a / n) * L, uy = -(b / n) * L;
      o += circle(sx(k), sy(s), 1.8, 'mute-f') + arrow(sx(k), sy(s), sx(k) + ux, sy(s) + uy, 'ink', 5);
    }
    o += text(x0 + 105, 22, title, 'tb', 'middle') + text(x0 + 105, 256, 'parameter k', 'ts', 'middle');
    o += text(x0 - 30, 34, 'σ', 'ts');
  };
  panel(55, 'vanilla gradient', (k, s) => grad(k, s));
  panel(325, 'natural gradient', nat);
  o += text(280, 276, '彩色虚线和圆点：optimum k* = −0.588，σ* = 0。箭头只表示方向，长度一律相同。', 'ts', 'middle');
  return svg(560, 286, o, 'LQR 问题在 k 和 sigma 平面上的 gradient 方向：vanilla gradient 在小 sigma 处几乎全部指向 sigma 减小，natural gradient 指向 optimum 的 k');
}

// 第 6 站：两个 KL estimator 作为 ratio 的 function
function kl() {
  const sx = lin(0, 3, 70, 400), sy = lin(-1.2, 2.2, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 3, y0: -1.2, y1: 2.2, xt: [[0.5, '0.5'], [1, '1'], [2, '2'], [3, '3']], yt: [[-1, '−1'], [0, '0'], [1, '1'], [2, '2']], xAt: -1.2 });
  o += line(sx(0), sy(0), sx(3), sy(0), 'grid') + line(sx(1), sy(-1.2), sx(1), sy(2.2), 'grid');
  o += path(curve((r) => -Math.log(r), 0.11, 3, sx, sy, 300), 'ink');
  o += path(curve((r) => r - 1 - Math.log(r), 0.11, 3, sx, sy, 300), 'ln');
  o += text(sx(2.2), sy(-0.62), 'k₁ = −log r', 't') + text(sx(1.3), sy(0.78), 'k₃ = r − 1 − log r', 'tl');
  o += text(sx(1) + 6, sy(2.05), 'r = 1：两个 policy 相同', 'ts');
  o += text(235, 262, 'r = π_ref(a) / π_θ(a) = e^Δ，在 a ~ π_θ 的 sample 上计算', 'ts', 'middle');
  o += text(420, 70, '两者的 expectation', 't') + text(420, 88, '都等于', 't') + text(420, 106, 'KL(π_θ ‖ π_ref)。', 't');
  o += text(420, 136, 'k₁ 在 r > 1 时为负；', 'ts') + text(420, 152, 'k₃ 在 r = 1 处与横轴', 'ts') + text(420, 168, '相切，处处非负。', 'ts');
  return svg(560, 272, o, 'KL 的两个 sample estimator：k1 等于负的 log ratio，可以为负；k3 等于 ratio 减 1 减 log ratio，处处非负并在 ratio 为 1 处取 0');
}

// 第 7 站：CEM 在 2 维 action sequence 上的前几轮（python3 -I，seed 0 的实际轨迹）
function cem() {
  const sx = lin(-4.5, 6.5, 40, 340), sy = lin(-4.5, 4.5, 300, 30);
  let o = rect(40, 30, 300, 270, 'frame');
  o += line(sx(0), 30, sx(0), 300, 'grid') + line(40, sy(0), 340, sy(0), 'grid');
  // cost = (a0 − 3)² + (a0 + a1 − 3)²；u = a0 − 3，v = a0 + a1 − 3
  for (const c of [1, 4, 9]) {
    const pts = [];
    for (let i = 0; i <= 160; i++) { const t = (2 * Math.PI * i) / 160, u = Math.sqrt(c) * Math.cos(t), v = Math.sqrt(c) * Math.sin(t); pts.push([sx(3 + u), sy(v - u)]); }
    o += path(d(pts), 'grid');
  }
  const tr = [[[0, 0], [2, 2]], [[2.478, 0.643], [0.665, 0.919]], [[2.923, 0.136], [0.204, 0.223]], [[2.97, 0.02], [0.078, 0.087]]];
  tr.forEach(([[m0, m1], [s0, s1]], i) => {
    const pts = [];
    for (let j = 0; j <= 80; j++) { const t = (2 * Math.PI * j) / 80; pts.push([sx(m0 + 2 * s0 * Math.cos(t)), sy(m1 + 2 * s1 * Math.sin(t))]); }
    o += path(d(pts) + 'Z', i === 0 ? 'mute' : 'ln');
    o += circle(sx(m0), sy(m1), 3, 'ink-f');
  });
  o += text(sx(0) + 6, sy(0) - 6, '第 0 轮', 'ts') + text(sx(2.478) - 30, sy(0.643 + 1.84) - 6, '第 1 轮', 'ts', 'middle');
  o += poly([[sx(3), sy(0) - 6], [sx(3) + 5, sy(0) + 4], [sx(3) - 5, sy(0) + 4]], 'ink-f');
  o += text(sx(6.4), sy(-4.2), 'a₁', 'ts', 'end') + text(sx(-4.3), sy(4.1), 'a₂', 'ts');
  o += text(362, 60, '每轮 100 个 sample，', 't') + text(362, 80, '留 cost 最低的 10 个', 't') + text(362, 100, '重新 fit Gaussian。', 't');
  o += text(362, 134, 'Mean：', 'tb') + text(362, 154, '(0, 0) → (2.48, 0.64)', 'ts') + text(362, 170, '→ (2.92, 0.14)', 'ts') + text(362, 186, '→ (2.97, 0.02)', 'ts') + text(362, 202, '→ (2.997, 0.003)', 'ts');
  o += text(362, 236, '灰线是 cost 的 contour；', 'ts') + text(362, 252, '椭圆是 mean ± 2 std；', 'ts') + text(362, 268, '三角形是 optimum (3, 0)。', 'ts');
  return svg(560, 312, o, 'Cross-entropy method 在两步 action sequence 上的前四轮：sampling distribution 的 Gaussian 一轮比一轮小，收缩到 optimum 附近');
}

// 第 8 站：linear Q 在 data 外取 max
function ood() {
  const sx = lin(0, 9, 70, 400), sy = lin(0, 95, 235, 30);
  let o = rect(sx(0), 30, sx(1.2) - sx(0), 205, 'wash');
  o += axes({ sx, sy, x0: 0, x1: 9, y0: 0, y1: 95, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => [v, String(v)]), yt: [[20, '20'], [40, '40'], [60, '60'], [80, '80']], grid: true });
  const ln_ = (w0, cls) => line(sx(0), sy(w0), sx(9), sy(w0 + 9), cls);
  o += ln_(0, 'mute') + ln_(27.856, 'mute') + ln_(80.838, 'ln') + ln_(9, 'ink');
  o += text(sx(9) + 6, sy(9) + 4, '第 1 轮', 'ts') + text(sx(9) + 6, sy(36.9) + 4, '第 5 轮', 'ts') + text(sx(9) + 6, sy(89.8) + 4, '第 60 轮', 'tl');
  o += text(sx(4.6), sy(19), '只在 data 的 action 里取 max', 'tb');
  o += circle(sx(0), sy(80.8), 4, 'ln-f') + circle(sx(1), sy(81.8), 4, 'ln-f') + circle(sx(0), sy(9), 4, 'ink-f') + circle(sx(1), sy(10), 4, 'ink-f');
  o += circle(sx(9), sy(89.8), 5, 'ln') + text(sx(8.6), sy(89.8) - 10, 'max 落在这里', 'tl', 'end');
  o += text(sx(1.35), sy(55), '← 阴影：data 只有 a = 0, 1', 'ts');
  o += text(235, 266, 'action a', 'ts', 'middle') + text(70, 18, 'Q(a) = w₀ + w₁a，γ = 0.9', 'tb');
  return svg(560, 276, o, 'Linear Q-function 只在 action 0 和 1 上有 data；fitted Q-iteration 对所有 action 取 max，Q 值在 60 轮后涨到 90，只在 data 的 action 里取 max 时停在 10');
}

// 第 8 站：expectile 随 τ 的变化
function expectile() {
  const X = [0, 1, 2, 5], P = [0.4, 0.3, 0.2, 0.1];
  const m = (t) => {
    const f = (mm) => t * X.reduce((s, x, i) => s + P[i] * Math.max(x - mm, 0), 0) - (1 - t) * X.reduce((s, x, i) => s + P[i] * Math.max(mm - x, 0), 0);
    let lo = -1, hi = 6; for (let i = 0; i < 80; i++) { const c = (lo + hi) / 2; if (f(c) > 0) lo = c; else hi = c; } return (lo + hi) / 2;
  };
  const sx = lin(0.5, 1, 70, 400), sy = lin(0, 5.5, 225, 30);
  let o = axes({ sx, sy, x0: 0.5, x1: 1, y0: 0, y1: 5.5, xt: [[0.5, '0.5'], [0.7, '0.7'], [0.9, '0.9'], [1, '1']], yt: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']], grid: true });
  o += line(sx(0.5), sy(5), sx(1), sy(5), 'dash') + line(sx(0.5), sy(1.2), sx(1), sy(1.2), 'dash');
  o += path(curve(m, 0.5, 0.9995, sx, sy, 600), 'ln');
  for (const t of [0.7, 0.9, 0.99]) o += circle(sx(t), sy(m(t)), 3.5, 'ln-f');
  o += text(sx(0.7) - 6, sy(m(0.7)) - 8, '1.714', 'ts', 'end') + text(sx(0.9) - 6, sy(m(0.9)) - 6, '2.889', 'ts', 'end') + text(sx(0.99) - 8, sy(m(0.99)) + 4, '4.648', 'ts', 'end');
  o += text(sx(0.52), sy(5) - 6, 'data 里的 max = 5', 'ts') + text(sx(0.52), sy(1.2) + 16, 'mean = 1.2（τ = 0.5）', 'ts');
  o += text(235, 256, 'τ', 'ts', 'middle') + text(70, 18, 'Q 值 0, 1, 2, 5，频率 0.4, 0.3, 0.2, 0.1 的 τ-expectile', 'tb');
  o += text(420, 110, 'τ → 1 时趋向 5，', 't') + text(420, 128, '但从不超过它：', 't') + text(420, 146, '只用到 data 里', 't') + text(420, 164, '出现过的 action。', 't');
  return svg(560, 266, o, '一个四点 distribution 的 expectile 随 tau 增大从 mean 1.2 单调上升，趋向 data 中的最大值 5');
}

// 第 1 站：random walk 按终点 relabel。左：到 (10, 2) 的 path，第一步向上 126 条、向下 84 条；右：终点的 distribution
function relabel() {
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  const T = 10, G = 2;
  const N = (t, s) => { const n = T - t, dd = G - s; return (n + dd) % 2 === 0 && Math.abs(dd) <= n ? C(n, (n + dd) / 2) : 0; };
  const ok = (t, s) => Math.abs(s) <= t && (t + s) % 2 === 0 && N(t, s) > 0;
  const sx = (t) => 40 + t * 21, sy = (s) => 150 - s * 15;
  let o = text(20, 20, '终点 g = 2 的 path（共 ' + N(0, 0) + ' 条）', 'tb');
  for (let t = 0; t < T; t++) for (let s = -t; s <= t; s += 2) {
    if (!ok(t, s)) continue;
    for (const ds of [1, -1]) if (ok(t + 1, s + ds)) o += line(sx(t), sy(s), sx(t + 1), sy(s + ds), 'grid');
  }
  o += line(sx(0), sy(0), sx(1), sy(1), 'ln') + line(sx(0), sy(0), sx(1), sy(-1), 'ink-b');
  for (let t = 0; t <= T; t++) for (let s = -t; s <= t; s += 2) if (ok(t, s)) o += circle(sx(t), sy(s), 2.2, 'ink-f');
  o += circle(sx(T), sy(G), 5, 'solid') + text(sx(T) + 8, sy(G) + 4, 'g', 'tl');
  o += text(sx(1) - 2, sy(1) - 10, N(1, 1) + ' 条', 'tl', 'end') + text(sx(1) - 2, sy(-1) + 20, N(1, -1) + ' 条', 'tb', 'end');
  o += text(sx(0) - 8, sy(0) + 4, 's = 0', 'ts', 'end');
  o += line(sx(0), sy(-5), sx(T), sy(-5), 'axis') + text(sx(0), sy(-5) + 16, 't = 0', 'ts', 'middle') + text(sx(T), sy(-5) + 16, '10', 'ts', 'middle');
  o += text(20, sy(-5) + 40, `第一步朝 goal：${N(1, 1)} / ${N(0, 0)} = ${(N(1, 1) / N(0, 0)).toFixed(1)}`, 'tl');
  // 右：终点的 distribution
  const bx = lin(-11, 11, 300, 548), by = lin(0, 0.26, 200, 40);
  o += text(300, 20, '10 步 random walk 的终点 g', 'tb');
  for (let g = -10; g <= 10; g += 2) {
    const p = C(10, (10 + g) / 2) / 1024, far = Math.abs(g) >= 8;
    o += rect(bx(g) - 8, by(p), 16, by(0) - by(p), far ? 'solid' : 'wash');
  }
  o += line(bx(-11), by(0), bx(11), by(0), 'axis');
  for (const g of [-10, -6, -2, 2, 6, 10]) o += text(bx(g), by(0) + 16, String(g).replace('-', '−'), 'ts', 'middle');
  o += text(bx(0), by(C(10, 5) / 1024) - 6, '252 / 1024', 'ts', 'middle');
  o += text(bx(8) + 6, by(0.135), '|g| ≥ 8：', 'tl', 'middle') + text(bx(8) + 6, by(0.135) + 16, '22 / 1024', 'tl', 'middle');
  return svg(560, 276, o, '左：10 步 random walk 中终点为 2 的 210 条 path，第一步向上的 126 条；右：终点的 binomial distribution，离 0 越远 data 越少');
}

// 第 3 站：GAE 是 n-step advantage 的加权平均；交换求和次序后 γ^l δ_{t+l} 的系数是 λ^l
function gaesum() {
  const lam = 0.7, R = 6, Cn = 6, X0 = 112, W = 54, Y0 = 44, H = 26;
  let o = '';
  const head = ['δ_t', 'γδ_{t+1}', 'γ²δ_{t+2}', 'γ³δ_{t+3}', 'γ⁴δ_{t+4}', 'γ⁵δ_{t+5}'];
  head.forEach((h, l) => { o += text(X0 + l * W + W / 2, Y0 - 10, h.replace(/_\{([^}]*)\}/, '<tspan class="sub" dy="3">$1</tspan><tspan dy="-3">​</tspan>').replace('_t', '<tspan class="sub" dy="3">t</tspan><tspan dy="-3">​</tspan>'), 'ts', 'middle'); });
  o += text(X0 + Cn * W + 12, Y0 - 10, '× weight', 'ts', 'start');
  for (let n = 1; n <= R; n++) {
    const y = Y0 + (n - 1) * H;
    o += text(16, y + 18, `Â⁽${'¹²³⁴⁵⁶'[n - 1]}⁾`, 'tb', 'start');
    for (let l = 0; l < Math.min(n, Cn); l++) o += rect(X0 + l * W + 2, y + 2, W - 4, H - 4, 'wash', 3);
    o += text(X0 + Cn * W + 12, y + 18, ((1 - lam) * lam ** (n - 1)).toFixed(3), 't', 'start');
  }
  o += text(X0 + 3 * W, Y0 + R * H + 14, '⋮（n 一直到 ∞）', 'ts', 'middle');
  const ys = Y0 + R * H + 46;
  o += line(X0, ys - 18, X0 + Cn * W, ys - 18, 'axis');
  o += text(16, ys, '列的 weight 和', 'tb', 'start');
  for (let l = 0; l < Cn; l++) o += text(X0 + l * W + W / 2, ys, (lam ** l).toFixed(l < 3 ? 2 : 3).replace(/0+$/, '').replace(/\.$/, ''), 'tl', 'middle');
  o += text(16, ys + 22, `= (1 − λ)(λˡ + λˡ⁺¹ + …) = λˡ，这里 λ = ${lam}`, 'ts', 'start');
  return svg(560, ys + 32, o, 'GAE 的交换求和：第 n 行是 n-step advantage，覆盖前 n 个 TD error，weight 是 (1-λ)λ^(n-1)；每一列的 weight 加起来是 λ^l');
}

// 第 3 站：bias 实验用的 random walk
function walk() {
  const sx = (s) => 30 + s * 50, y = 150;
  const visits = (s) => (s === 0 || s === 10 ? 0 : (2 * Math.min(s, 5) * (10 - Math.max(s, 5))) / 10);
  let o = text(20, 20, '从 5 出发，每步 ½ 向右、½ 向左；γ = 1', 'tb');
  for (let s = 0; s <= 10; s++) {
    const v = visits(s), term = s === 0 || s === 10;
    if (v > 0) o += rect(sx(s) - 12, y - 24 - v * 14, 24, v * 14, 'wash') + text(sx(s), y - 30 - v * 14, f(v), 'ts', 'middle');
    o += rect(sx(s) - 16, y - 16, 32, 32, term ? 'solid2' : s === 5 ? 'wash-strong' : 'paper', 4) + text(sx(s), y + 5, String(s), term ? 'tw' : 'tb', 'middle');
    if (!term) o += text(sx(s), y + 34, (s / 10).toFixed(1), 'ts', 'middle');
  }
  function f(v) { return String(Math.round(v)); }
  o += text(sx(0), y + 34, 'r = 0', 'ts', 'middle') + text(sx(10), y + 34, 'r = 1', 'tl', 'middle');
  o += text(sx(5), y - 24 - 5 * 14 - 22, 'start', 'tl', 'middle');
  o += text(20, y + 60, '柱子：一个 episode 里访问每个 state 的 expected 次数 2·min(s,5)·(10−max(s,5))/10；', 'ts');
  o += text(20, y + 78, '格子下面的数是 true value V(s) = s/10。灰色是 terminal state。', 'ts');
  return svg(560, y + 88, o, 'state 0 到 10 的 random walk：从 5 出发，到 10 得 1，到 0 得 0；每个 state 的 expected 访问次数是 1,2,3,4,5,4,3,2,1');
}

// 第 4 站：residual gradient 把 V1、V2 拉向中间
function residual() {
  // 解 2V0 = V1 + V2，2V1 = V0 + 1，2V2 = V0
  const A = [[2, -1, -1], [-1, 2, 0], [-1, 0, 2]], b = [0, 1, 0];
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < 3; c++) { for (let r = 0; r < 3; r++) if (r !== c) { const k = M[r][c] / M[c][c]; for (let j = 0; j < 4; j++) M[r][j] -= k * M[c][j]; } }
  const Vr = M.map((r, i) => r[3] / r[i]);
  const Vt = [0.5, 1, 0];
  let o = '';
  const S0 = [70, 120], S1 = [200, 60], S2 = [200, 180];
  const nd = ([x, y], s) => circle(x, y, 22, 'paper') + text(x, y + 5, s, 'tb', 'middle');
  o += arrow(S0[0] + 20, S0[1] - 10, S1[0] - 20, S1[1] + 10, 'ink') + text(128, 78, '½，r 0', 'ts', 'middle');
  o += arrow(S0[0] + 20, S0[1] + 10, S2[0] - 20, S2[1] - 10, 'ink') + text(128, 172, '½，r 0', 'ts', 'middle');
  o += arrow(S1[0] + 22, S1[1], 272, S1[1], 'ink') + rect(274, S1[1] - 8, 14, 16, 'solid2') + text(248, S1[1] - 8, 'r 1', 'ts', 'middle');
  o += arrow(S2[0] + 22, S2[1], 272, S2[1], 'ink') + rect(274, S2[1] - 8, 14, 16, 'solid2') + text(248, S2[1] - 8, 'r 0', 'ts', 'middle');
  o += nd(S0, 's₀') + nd(S1, 's₁') + nd(S2, 's₂');
  // 表
  const X = 330, cw = 64;
  o += text(X + cw, 50, 'true', 'tb', 'middle') + text(X + 2 * cw + 10, 50, 'residual', 'tl', 'middle') + text(X + 2 * cw + 10, 66, 'gradient', 'tl', 'middle');
  ['V₀', 'V₁', 'V₂'].forEach((v, i) => {
    const y = 100 + i * 34;
    o += text(X, y, v, 'tb') + text(X + cw, y, Vt[i].toFixed(2), 't', 'middle') + text(X + 2 * cw + 10, y, Vr[i].toFixed(2), 'tl', 'middle');
  });
  o += text(X, 212, '把 target 当 constant 的', 'ts') + text(X, 229, 'Q-learning 在 table 上收敛到 true。', 'ts');
  return svg(560, 240, o, '两步的 MDP：s0 各一半转到 s1 或 s2；true value 是 0.5、1、0，residual gradient 的解是 0.5、0.75、0.25');
}

// 第 7 站：open-loop 与 closed-loop
function openloop() {
  let o = '';
  const panel = (x0, title, pick, val) => {
    o += text(x0 + 125, 22, title, 'tb', 'middle');
    const R = [x0 + 125, 58], L = [x0 + 60, 128], Rr = [x0 + 190, 128];
    o += rect(R[0] - 36, R[1] - 14, 72, 28, 'paper', 5) + text(R[0], R[1] + 5, 'nature', 't', 'middle');
    o += line(R[0], R[1] + 14, L[0], L[1] - 16, 'ink') + line(R[0], R[1] + 14, Rr[0], Rr[1] - 16, 'ink');
    o += text((R[0] + L[0]) / 2 - 12, 96, '½', 'ts', 'end') + text((R[0] + Rr[0]) / 2 + 12, 96, '½', 'ts', 'start');
    for (const [P, st] of [[L, 'L'], [Rr, 'R']]) {
      o += circle(P[0], P[1], 16, 'paper') + text(P[0], P[1] + 5, st, 'tb', 'middle');
      const a = pick(st);
      for (const [dx, act] of [[-28, 'left'], [28, 'right']]) {
        const chosen = act === a, r = (act === 'left') === (st === 'L') ? 1 : 0;
        o += line(P[0], P[1] + 16, P[0] + dx, P[1] + 58, chosen ? 'ln' : 'grid');
        o += text(P[0] + dx, P[1] + 74, act, chosen ? 'tl' : 'ts', 'middle') + text(P[0] + dx, P[1] + 92, 'r ' + r, chosen ? 'tl' : 'ts', 'middle');
      }
    }
    o += text(x0 + 125, 246, 'expected reward = ' + val, 'tb', 'middle');
  };
  panel(20, 'Open-loop：先定好第二步 = right', () => 'right', '½ · 0 + ½ · 1 = 0.5');
  panel(300, 'Closed-loop：看到 state 再选', (st) => (st === 'L' ? 'left' : 'right'), '½ · 1 + ½ · 1 = 1');
  o += line(280, 14, 280, 250, 'grid');
  return svg(560, 258, o, '同一个完美的 model：open-loop plan 在看到 state 之前定下第二步，expected reward 0.5；closed-loop 看到 state 再选，expected reward 1');
}

export default {
  'cs285-ar': ar,
  'cs285-relabel': relabel,
  'cs285-gaesum': gaesum,
  'cs285-walk': walk,
  'cs285-residual': residual,
  'cs285-openloop': openloop,
  'cs285-flowtau': flowtau,
  'cs285-pgvar': pgvar,
  'cs285-gae': gae,
  'cs285-tanh': tanh,
  'cs285-natgrad': natgrad,
  'cs285-kl': kl,
  'cs285-cem': cem,
  'cs285-ood': ood,
  'cs285-expectile': expectile,
};
