import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, svgA, anim, ashow } from '../lib/svg.mjs';

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


// 第 8 站：CQL 在一个 state 的例子上，α 从 0 到 ∞ 时 policy 的变化
function cql() {
  const pb = [0.7, 0.25, 0.05], rh = [0, 1, 2], rt = [0, 1, 0.5], g = 0.9;
  // max Σπ r̂ − α Σ π²/π_β：π(a) = max(0, π_β(a)(r̂(a) − λ)/(2α))，λ 用二分定
  const best = (al) => {
    if (al === 0) return [0, 0, 1];
    if (al === Infinity) return pb.slice();
    const f = (l) => pb.map((p, i) => Math.max(0, (p * (rh[i] - l)) / (2 * al)));
    let lo = -100, hi = 100;
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(m).reduce((a, b) => a + b, 0) > 1) lo = m; else hi = m; }
    return f((lo + hi) / 2);
  };
  let o = '';
  // 左：data
  o += text(20, 20, 'Data：一个 state，γ = 0.9', 'tb');
  const bx = (i) => 40 + i * 58, base = 150, hgt = 100;
  pb.forEach((p, i) => {
    o += rect(bx(i), base - p * hgt, 40, p * hgt, i === 2 ? 'solid' : i === 1 ? 'wash-strong' : 'wash2');
    o += rect(bx(i), base - hgt, 40, hgt, 'frame');
    o += text(bx(i) + 20, base - p * hgt - 6, p.toFixed(2), 'ts', 'middle');
    o += text(bx(i) + 20, base + 18, 'a = ' + i, 'tb', 'middle');
    o += text(bx(i) + 20, base + 38, 'r̂ = ' + rh[i], i === 2 ? 'tl' : 't', 'middle');
    o += text(bx(i) + 20, base + 56, 'r = ' + rt[i], 'ts', 'middle');
  });
  const PB = 'π<tspan class="sub" dy="3">β</tspan><tspan dy="-3">\u200b</tspan>';
  o += text(20, 42, '柱高：behavior policy ' + PB, 'ts');
  o += text(20, base + 82, 'a = 2 很少见，', 'ts') + text(20, base + 98, '估出的 r̂ 偏高了 1.5', 'ts');
  // 右：各个 α 下的 policy
  const X0 = 300, W = 170, rows = [[0, 'α = 0'], [0.05, '0.05'], [0.15, '0.15'], [0.3, '0.3'], [1, '1'], [Infinity, '∞']];
  o += text(X0, 20, 'CQL 选出的 policy π', 'tb') + text(X0 + W + 12, 20, '真实 return', 'tb');
  const cls = ['wash2', 'wash-strong', 'solid'];
  rows.forEach(([al, lab], j) => {
    const y = 40 + j * 34, p = best(al);
    let x = X0;
    p.forEach((q, i) => {
      const w = q * W;
      if (w > 0.5) {
        o += rect(x, y, w, 22, cls[i]);
        if (w > 26) o += text(x + w / 2, y + 15, q.toFixed(2), i === 2 ? 'tw' : 'ts', 'middle');
      }
      x += w;
    });
    o += rect(X0, y, W, 22, 'frame');
    o += text(X0 - 8, y + 15, lab, 'ts', 'end');
    const v = p.reduce((s, q, i) => s + q * rt[i], 0) / (1 - g);
    o += text(X0 + W + 12, y + 15, v.toFixed(2), al === 0.15 ? 'tl' : 't', 'start');
  });
  o += text(X0, 40 + 6 * 34 + 14, '每条按 a = 0, 1, 2 分段；α = ∞ 就是 ' + PB, 'ts');
  o += text(X0, 40 + 6 * 34 + 30, 'data 里最好的是一直选 a = 1：10.00', 'ts');
  return svg(560, 290, o, 'CQL 的一个 state 例子：alpha 为 0 时 policy 全选 sample 偏高的 action 2，真实 return 5；alpha 为 0.15 时真实 return 最高 8.47；alpha 趋于无穷时退回 behavior policy，真实 return 2.75');
}

// ---------- 动图共用：按帧切换 ----------
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [0];
  let acc = 0;
  for (let i = 0; i < durs.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  kt.push(1);
  const show = (on) => ashow([...on, on[on.length - 1]], kt, T);
  const vals = (v) => [...v, v[v.length - 1]];
  return { T, kt, show, vals };
}
const gshow = (inner, F, on) => `<g>${inner}${F.show(on)}</g>`;
function rng(seed) {
  let s = seed >>> 0;
  const u = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; };
  const n = () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u());
  return { u, n };
}
const sgn = (v, k = 1) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);

// 开头第一次：每个 batch 4 条 trajectory，full return 估 gradient
function pgbatchA() {
  const R = rng(14), T = 10, NB = 24;
  const batches = Array.from({ length: NB }, () => {
    const tr = Array.from({ length: 4 }, () => { const a = Array.from({ length: T }, () => (R.u() < 0.5 ? 1 : 0)); const X = a.reduce((s, v) => s + v - 0.5, 0); const Rt = a.reduce((s, v) => s + v + R.n(), 0); return { a, X, R: Rt }; });
    return { tr, g: tr.reduce((s, q) => s + q.X * q.R, 0) / 4 };
  });
  // 第 0 帧：全部 24 个 batch 都做完的样子；之后从第 1 个 batch 重放
  const F = frames([3.2, ...batches.map((_, i) => (i === NB - 1 ? 2.4 : 1.1))]);
  const at = (k) => [k === NB - 1, ...batches.map((_, j) => j === k)];
  const upto = (k) => [true, ...batches.map((_, j) => j >= k)];
  let o = text(20, 16, '每个 batch：4 条 trajectory，每格是一步的 action（实心 a = 1）', 'ts', 'start');
  const cs = 15, x0 = 20, y0 = 26;
  for (let r = 0; r < 4; r++) for (let t = 0; t < T; t++) o += rect(x0 + t * cs, y0 + r * 22, cs - 3, 16, 'frame', 2);
  batches.forEach((b, k) => {
    const on = at(k);
    let q = '';
    b.tr.forEach((tr, r) => {
      tr.a.forEach((v, t) => { if (v) q += rect(x0 + t * cs, y0 + r * 22, cs - 3, 16, 'solid', 2); });
      q += text(x0 + T * cs + 8, y0 + r * 22 + 13, `X = ${sgn(tr.X, 0)}，R = ${sgn(tr.R)}`, 'ts', 'start');
    });
    q += text(x0 + T * cs + 160, y0 + 30, `batch ${k + 1}：g = ${sgn(b.g, 2)}`, b.g < 0 ? 'tl' : 'tb', 'start');
    q += text(x0 + T * cs + 160, y0 + 52, b.g < 0 ? '方向反了' : '方向对', b.g < 0 ? 'tl' : 'ts', 'start');
    o += gshow(q, F, on);
  });
  // 数轴：每个 batch 的 g 落下来堆成点
  const sx = lin(-20, 25, 40, 540), Y = 232;
  o += rect(sx(-20), 128, sx(0) - sx(-20), Y - 128, 'wash2');
  o += line(sx(-20), Y, sx(25), Y, 'axis');
  for (const v of [-20, -10, 0, 10, 20]) o += line(sx(v), Y, sx(v), Y + 5, 'axis') + text(sx(v), Y + 19, sgn(v, 0), 'ts', 'middle');
  o += line(sx(2.5), 120, sx(2.5), Y, 'ln-dash') + text(sx(2.5) + 5, 128, 'true gradient 2.5', 'tl', 'start');
  o += text(sx(-19), 144, 'g < 0：往反方向更新', 'ts', 'start');
  const stack = {};
  batches.forEach((b, k) => {
    const bin = Math.round(b.g / 1.6); stack[bin] = (stack[bin] || 0) + 1;
    const cx = sx(bin * 1.6), cy = Y - 7 - (stack[bin] - 1) * 11;
    o += gshow(circle(cx, cy, 5, b.g < 0 ? 'ln-f' : 'ink-f'), F, upto(k));
  });
  batches.forEach((_, k) => {
    const neg = batches.slice(0, k + 1).filter((b) => b.g < 0).length;
    o += gshow(text(280, 270, `到第 ${k + 1} 个 batch 为止，${neg} 个方向反了（理论上约 1/3）`, k === NB - 1 ? 'tl' : 't', 'middle'), F, at(k));
  });
  o += text(280, 288, '每个点是一个 batch 估出的 g，按值堆起来；彩色点是方向反了的', 'ts', 'middle');
  return svgA(560, 296, o, '动图：10 步的问题，每个 batch 用 4 条 trajectory 的 full return 估 policy gradient，估出的 g 散在负 12 到 14 之间，24 个里 8 个落在 0 的左边，方向反了');
}

// 第 8 站 + 开头第二次：fitted Q-iteration 一轮轮把 line 抬高
function oodA() {
  const sx = lin(0, 9, 70, 400), sy = lin(0, 95, 235, 30), g = 0.9, K = 60;
  const W = [0], Wd = [0];
  for (let k = 0; k < K; k++) { W.push(g * (W[k] + 9)); Wd.push(g * (Wd[k] + 1)); }
  // W[k]：第 k+1 轮 fit 出的 w0（w1 恒为 1）；第 1 轮 = W[0] = 0
  const its = [K - 1, ...Array.from({ length: K }, (_, i) => i)];
  const F = frames(its.map((k, i) => (i === 0 ? 3 : i === its.length - 1 ? 2.4 : k < 10 ? 0.6 : 0.09)));
  let o = rect(sx(0), 30, sx(1.2) - sx(0), 205, 'wash');
  o += axes({ sx, sy, x0: 0, x1: 9, y0: 0, y1: 95, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => [v, String(v)]), yt: [[20, '20'], [40, '40'], [60, '60'], [80, '80']], grid: true });
  const lineD = (w0) => `M${sx(0).toFixed(1)} ${sy(w0).toFixed(1)}L${sx(9).toFixed(1)} ${sy(w0 + 9).toFixed(1)}`;
  o += `<path d="${lineD(W[its[0]])}" class="ln">${anim('d', F.vals(its.map((k) => lineD(W[k]))), F.kt, F.T, true)}</path>`;
  o += `<path d="${lineD(Wd[its[0]])}" class="ink">${anim('d', F.vals(its.map((k) => lineD(Wd[k]))), F.kt, F.T, true)}</path>`;
  const dot = (xa, ws, off, r, cls) => { const ys = F.vals(its.map((k) => sy(ws[k] + off).toFixed(1))); return `<circle cx="${sx(xa).toFixed(1)}" cy="${ys[0]}" r="${r}" class="${cls}">${anim('cy', ys, F.kt, F.T, true)}</circle>`; };
  o += dot(0, W, 0, 4, 'ln-f') + dot(1, W, 1, 4, 'ln-f') + dot(9, W, 9, 6, 'ln') + dot(0, Wd, 0, 4, 'ink-f') + dot(1, Wd, 1, 4, 'ink-f');
  o += text(424, 240, '黑线：max 只在 data', 'tb', 'start') + text(424, 256, '的 action 里取，', 'tb', 'start') + text(424, 272, '停在 Q(1) = 10', 'tb', 'start');
  o += text(sx(1.35), sy(55), '← 阴影：data 只有 a = 0, 1', 'ts');
  its.forEach((k, i) => {
    o += gshow(text(424, 64, `第 ${k + 1} 轮`, 'tl', 'start') + text(424, 86, `max 在 a = 9：Q(9) = ${(W[k] + 9).toFixed(1)}`, 't', 'start') + text(424, 106, `Q(1) = ${(W[k] + 1).toFixed(1)}`, 't', 'start'), F, its.map((_, j) => j === i));
  });
  o += text(424, 146, '每轮 target：', 'ts', 'start') + text(424, 162, 'r(a) + γ · max Q(a′)，', 'ts', 'start') + text(424, 178, '在 a = 0, 1 两点上 fit。', 'ts', 'start') + text(424, 200, 'max 总落在 a = 9，', 'ts', 'start') + text(424, 216, '把整条 line 往上抬。', 'ts', 'start');
  o += text(235, 266, 'action a', 'ts', 'middle') + text(70, 18, 'Q(a) = w₀ + w₁a，γ = 0.9', 'tb');
  return svgA(560, 280, o, '动图：linear Q-function 只在 action 0 和 1 上有 data；fitted Q-iteration 每轮对所有 action 取 max，max 落在 a = 9，整条 line 一轮轮抬高，60 轮后 Q(9) 到 89.8；只在 data 的 action 里取 max 时停在 Q(1) = 10');
}

// 开头第三次：GRPO，8 个回答全错的 prompt 没有 gradient
function grpoA() {
  const R = rng(23), P = 24, G = 8, NB = 4;
  const batches = Array.from({ length: NB }, () => Array.from({ length: P }, () => Array.from({ length: G }, () => (R.u() < 0.23 ? 1 : 0))));
  const F = frames(Array(NB).fill(3));
  const cw = 21, x0 = 28, y0 = 44, rh = 19;
  let o = text(280, 16, '每一列是一个 prompt 的 8 个回答：● 答对（reward 1），○ 答错（reward 0）', 'ts', 'middle');
  for (let a = 0; a < G; a++) o += text(x0 - 8, y0 + a * rh + 4, String(a + 1), 'ts', 'end');
  batches.forEach((b, k) => {
    const on = batches.map((_, j) => j === k);
    let q = '', z = 0;
    b.forEach((col, p) => {
      const x = x0 + p * cw + cw / 2, dead = col.every((v) => !v);
      if (dead) { z++; q += rect(x - cw / 2 + 1, y0 - 12, cw - 2, G * rh + 6, 'wash-strong', 3) + text(x, y0 + G * rh + 12, '0', 'tl', 'middle'); }
      col.forEach((v, a) => { q += circle(x, y0 + a * rh, 5, v ? 'ink-f' : 'paper'); });
    });
    q += text(280, 230, `第 ${k + 1} 批：${P} 个 prompt 里有 ${z} 个 8 个回答全错（${Math.round((100 * z) / P)}%）`, 'tl', 'middle');
    o += gshow(q, F, on);
  });
  o += text(280, 252, '涂色的列：8 个 reward 都是 0，减去 group mean 后 advantage 全是 0，这个 prompt 的 gradient 就是 0', 'ts', 'middle');
  o += text(280, 270, '每个回答独立地以 23% 答对时，8 个全错的 probability 是 0.77⁸ ≈ 12%', 'ts', 'middle');
  return svgA(560, 278, o, '动图：每批 24 个 prompt、每个 8 个回答，答对率 23%；大约八分之一的 prompt 8 个回答全错，group 内的 advantage 全是 0，没有 gradient');
}

export default {
  'cs285-pgbatch': pgbatchA,
  'cs285-grpo': grpoA,
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
  'cs285-ood': oodA,
  'cs285-expectile': expectile,
  'cs285-cql': cql,
};
