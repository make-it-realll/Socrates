import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const sup = (n) => String(n).split('').map((c) => (c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])).join('');
const pow10 = (k) => (k === 0 ? '1' : k === 1 ? '10' : '10' + sup(k));

// Roofline：RTX 4090，peak 165 TFLOPS，bandwidth 1 TB/s（AWQ 论文的数）
function roofline() {
  const sx = logx(0.1, 1e4, 70, 530), sy = logx(0.1, 1000, 236, 30);
  const peak = 165, bw = 1; // TFLOPS, TB/s → attainable(TFLOPS) = min(peak, I*bw)
  let o = '';
  for (let k = -1; k <= 4; k++) o += line(sx(10 ** k), sy(0.1), sx(10 ** k), sy(1000), 'grid') + text(sx(10 ** k), 253, k === -1 ? '0.1' : pow10(k), 'ts', 'middle');
  for (let k = -1; k <= 3; k++) o += line(sx(0.1), sy(10 ** k), sx(1e4), sy(10 ** k), 'grid') + text(64, sy(10 ** k) + 4, k === -1 ? '0.1' : pow10(k), 'ts', 'end');
  o += line(sx(0.1), sy(0.1), sx(1e4), sy(0.1), 'axis') + line(sx(0.1), sy(0.1), sx(0.1), sy(1000), 'axis');
  const ridge = peak / bw;
  o += path(d([[sx(0.1), sy(0.1 * bw)], [sx(ridge), sy(peak)], [sx(1e4), sy(peak)]]), 'ln');
  o += line(sx(ridge), sy(peak), sx(ridge), sy(0.1), 'dash') + text(sx(ridge) + 5, sy(0.25), 'ridge 165', 'ts');
  const pts = [
    [1, 'decode fp16（I ≈ 1）', 'end', -8, -8],
    [4, 'decode W4A16（I ≈ 4）', 'start', 8, 14],
    [182, 'prefill 200 token（I ≈ 182）', 'end', -8, -10],
    [1117, 'diffusion（I ≈ 1117）', 'start', -20, 20],
  ];
  for (const [I, s, anc, dx, dy] of pts) {
    const y = Math.min(peak, I * bw);
    o += circle(sx(I), sy(y), 4.5, 'ink-f') + text(sx(I) + dx, sy(y) + dy, s, 't', anc);
  }
  o += text(sx(3), sy(30), 'memory-bound', 'tl', 'middle') + text(sx(2500), sy(400), 'compute-bound', 'tl', 'middle');
  o += text(530, 270, 'arithmetic intensity I（FLOP/byte，log scale）', 'ts', 'end');
  o += text(70, 18, 'attainable TFLOPS（log scale）', 'ts');
  return svg(560, 278, o, 'RTX 4090 的 roofline：intensity 小于 165 时速度受 bandwidth 限制，大于 165 时受算力限制；decode 落在左边，prefill 和 diffusion 落在右边');
}

// 逐层 sensitivity scan（2024 版 Pruning lab 镜像的结果）
function sensitivity() {
  const sp = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const rows = [
    [92.42, 91.19, 87.55, 83.39, 69.41, 31.81],
    [92.93, 92.88, 92.71, 92.40, 91.32, 84.78],
    [92.94, 92.64, 92.46, 91.77, 89.85, 78.56],
    [92.86, 92.72, 92.23, 91.09, 85.35, 51.31],
    [92.88, 92.68, 92.22, 89.47, 76.86, 38.78],
    [92.92, 92.71, 92.63, 91.88, 89.90, 82.19],
    [92.94, 92.86, 92.65, 92.10, 90.58, 83.65],
    [92.94, 92.92, 92.88, 92.81, 92.63, 91.34],
    [92.91, 92.83, 92.81, 92.97, 92.68, 92.52],
  ];
  const sx = lin(0.4, 0.9, 70, 400), sy = lin(25, 100, 236, 24);
  let o = axes({ sx, sy, x0: 0.4, x1: 0.9, y0: 25, y1: 100, xt: sp.map((v) => [v, v.toFixed(1)]), yt: [30, 50, 70, 90], grid: true });
  o += line(sx(0.4), sy(92.95), sx(0.9), sy(92.95), 'dash');
  rows.forEach((r, i) => {
    const cls = i === 0 ? 'ln' : i === rows.length - 1 ? 'ink-b' : 'mute';
    o += path(d(r.map((a, j) => [sx(sp[j]), sy(a)])), cls);
    for (let j = 0; j < 6; j++) if (i === 0) o += circle(sx(sp[j]), sy(r[j]), 3, 'ln-f');
  });
  o += text(sx(0.9) + 8, sy(31.81) + 4, '第 1 个 conv', 'tl');
  o += text(sx(0.9) + 8, sy(92.52) + 14, '最后一层', 'tb');
  o += text(sx(0.9) + 8, sy(51.31) + 4, '第 4 个 conv', 'ts');
  o += text(sx(0.9) + 8, sy(38.78) + 4, '第 5 个 conv', 'ts');
  o += text(sx(0.9) + 8, sy(84.78) - 2, '其余各层', 'ts');
  o += text(sx(0.4) + 4, sy(92.95) - 6, 'dense 92.95%', 'ts');
  o += text(400, 270, 'sparsity（只剪这一层）', 'ts', 'end') + text(70, 14, 'accuracy（%）', 'ts');
  return svg(560, 278, o, 'VGG 在 CIFAR-10 上逐层 sensitivity scan：第一层剪到 0.9 时 accuracy 掉到约 32%，最后一层几乎不变');
}

// 三种 pruning granularity
function granularity() {
  let seed = 7;
  const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const n = 8;
  const W = Array.from({ length: n }, () => Array.from({ length: n }, () => rnd()));
  const flat = W.flat().slice().sort((a, b) => a - b), thr = flat[n * n / 2 - 1];
  const fine = W.map((r) => r.map((v) => v > thr));
  const nm = W.map((r) => r.map((v, j) => { const g = r.slice(j - (j % 4), j - (j % 4) + 4).slice().sort((a, b) => b - a); return v >= g[1]; }));
  const norms = W.map((r) => r.reduce((s, v) => s + v * v, 0));
  const keepRows = norms.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 4).map((t) => t[1]);
  const chan = W.map((r, i) => r.map(() => keepRows.includes(i)));
  let o = '';
  const cell = 19;
  const panel = (x0, M, title, note1, note2, groups) => {
    o += text(x0 + (n * cell) / 2, 22, title, 'tb', 'middle');
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += rect(x0 + j * cell, 34 + i * cell, cell - 2, cell - 2, M[i][j] ? 'solid' : 'wash2', 2);
    if (groups) for (let i = 0; i < n; i++) o += line(x0 + 4 * cell - 1, 34 + i * cell - 1, x0 + 4 * cell - 1, 34 + (i + 1) * cell - 1, 'ink-b');
    o += text(x0 + (n * cell) / 2, 34 + n * cell + 20, note1, 'ts', 'middle') + text(x0 + (n * cell) / 2, 34 + n * cell + 36, note2, 'ts', 'middle');
  };
  panel(20, fine, 'Fine-grained', '任意位置', '难以加速', false);
  panel(200, nm, '2:4', '每 4 个留 2 个', 'Ampere 以后的 GPU', true);
  panel(380, chan, 'Channel', '整 row（output channel）', '任何 hardware 都快', false);
  o += rect(150, 254, 12, 12, 'solid', 2) + text(168, 264, '保留', 'ts') + rect(214, 254, 12, 12, 'wash2', 2) + text(232, 264, '剪掉', 'ts');
  o += text(280, 264, '三张图都剪掉 50%', 'ts');
  return svg(560, 274, o, '同一个 8 乘 8 的 weight matrix 用三种 granularity 剪掉一半：fine-grained 位置任意，2:4 每 4 个留 2 个，channel pruning 整行剪掉');
}

// 2-bit linear quantization 的格点
function linquant() {
  const W = [2.09, -0.98, 1.48, 0.09, 0.05, -0.14, -1.08, 2.12, -0.91, 1.92, 0, -1.03, 1.87, 0, 1.53, 1.49];
  const S = 3.2 / 3, Z = -1;
  const sx = lin(-1.6, 2.6, 40, 520);
  const yr = 70, yq = 190;
  let o = line(40, yr, 520, yr, 'axis') + text(40, yr - 40, 'real number r', 'tb');
  // decision regions
  for (let q = -2; q <= 1; q++) {
    const c = S * (q - Z), a = q === -2 ? -1.6 : c - S / 2, b = q === 1 ? 2.6 : c + S / 2;
    o += rect(sx(a), yr - 12, sx(b) - sx(a), 24, q % 2 === 0 ? 'wash' : 'wash2');
  }
  for (const w of W) o += circle(sx(w), yr, 3.5, 'ink-f');
  o += line(40, yq, 520, yq, 'axis') + text(40, yq + 46, 'integer q（2-bit）', 'tb');
  for (let q = -2; q <= 1; q++) {
    const c = S * (q - Z);
    o += line(sx(c), yr + 12, sx(c), yr + 22, 'ink') + arrow(sx(c), yr + 24, sx(c), yq - 8, 'ink');
    o += circle(sx(c), yq, 6, q === Z ? 'ln-f' : 'ink-f') + text(sx(c), yq + 24, 'q = ' + q, q === Z ? 'tl' : 't', 'middle');
    o += text(sx(c) + 6, (yr + yq) / 2 + 4, 'r̂ = ' + c.toFixed(2), 'ts');
  }
  o += text(sx(-1.08), yr - 18, 'r_min = −1.08', 'ts', 'middle') + text(sx(2.12), yr - 18, 'r_max = 2.12', 'ts', 'middle');
  o += text(sx(0) + 30, yq + 44, 'r = 0 精确对应 q = Z = −1', 'tl');
  o += text(280, 262, 'S = 3.2 / 3 = 1.07。色带是 round 到同一个 q 的区间，黑点是 W 的 16 个 entry', 'ts', 'middle');
  return svg(560, 272, o, '2-bit linear quantization：real number 轴上等距的四个格点分别对应 integer q 等于 −2、−1、0、1，real number 0 对应 zero point −1');
}

// Laplace 分布的 4-bit 量化：MSE 随 clipping range 的变化
function clip() {
  const qmax = 7, dx = 0.004, X0 = 30;
  const xs = [];
  for (let x = -X0; x <= X0; x += dx) xs.push(x);
  const mse = (a) => {
    const D = a / qmax;
    let r = 0, c = 0;
    for (const x of xs) {
      const p = 0.5 * Math.exp(-Math.abs(x)) * dx;
      const q = Math.max(-qmax, Math.min(qmax, Math.round(x / D))) * D;
      const e = (x - q) ** 2 * p;
      if (Math.abs(x) <= a) r += e; else c += e;
    }
    return [r + c, r, c];
  };
  const as = [], T = [], R = [], C = [];
  for (let a = 1.5; a <= 12.001; a += 0.15) { const [t, r, c] = mse(a); as.push(a); T.push(t); R.push(r); C.push(c); }
  let bi = 0; T.forEach((v, i) => { if (v < T[bi]) bi = i; });
  const sx = lin(1.5, 12, 70, 520), sy = lin(0, 0.24, 232, 24);
  let o = axes({ sx, sy, x0: 1.5, x1: 12, y0: 0, y1: 0.24, xt: [2, 4, 6, 8, 10, 12], yt: [[0.05, '0.05'], [0.1, '0.10'], [0.15, '0.15'], [0.2, '0.20']], grid: true });
  const ser = (Y, cls) => path(d(as.map((a, i) => [sx(a), sy(Math.min(Y[i], 0.24))])), cls);
  o += ser(R, 'mute') + ser(C, 'dash') + ser(T, 'ln');
  o += circle(sx(as[bi]), sy(T[bi]), 4.5, 'ln-f') + text(sx(as[bi]), sy(T[bi]) + 22, `最小：α ≈ ${as[bi].toFixed(1)}，MSE ${T[bi].toFixed(3)}`, 'tl', 'middle');
  const m = mse(7.9)[0];
  o += circle(sx(7.9), sy(m), 4, 'ink-f') + text(sx(7.9) + 8, sy(m) - 8, `取样本最大值 7.9：MSE ${m.toFixed(3)}`, 't');
  o += text(sx(2.3), sy(0.205), 'clipping error', 'tb') + text(sx(11.6), sy(0.17), 'rounding error', 'ts', 'end') + text(sx(11.6), sy(0.235), 'total', 'tl', 'end');
  o += text(520, 266, 'clipping range α（Laplace 分布，scale b = 1，4-bit symmetric）', 'ts', 'end') + text(70, 14, 'mean squared error', 'ts');
  return svg(560, 274, o, '4-bit 量化 Laplace 分布时，clipping range 小则 clipping error 大，range 大则 rounding error 大，total MSE 在中间某处最小');
}

// SmoothQuant 的玩具例子：每个 input channel 的 max|X_j| 和 max|W_j|
function smooth() {
  const mx = [1.0, 1.2, 110, 1.1], mw = [0.40, 0.50, 0.02, 0.45];
  const s = mx.map((v, j) => Math.sqrt(v / mw[j]));
  const ax = mx.map((v, j) => v / s[j]), aw = mw.map((v, j) => v * s[j]);
  const sy = logx(0.01, 300, 220, 36);
  let o = '';
  const panel = (x0, X, Wv, title) => {
    o += text(x0 + 110, 20, title, 'tb', 'middle');
    for (const k of [-2, -1, 0, 1, 2]) o += line(x0, sy(10 ** k), x0 + 220, sy(10 ** k), 'grid') + (x0 < 100 ? text(x0 - 6, sy(10 ** k) + 4, k < 0 ? (10 ** k).toString() : pow10(k), 'ts', 'end') : '');
    o += line(x0, sy(0.01), x0 + 220, sy(0.01), 'axis');
    for (let j = 0; j < 4; j++) {
      const cx = x0 + 18 + j * 52;
      o += rect(cx, sy(X[j]), 16, sy(0.01) - sy(X[j]), 'solid') + rect(cx + 18, sy(Wv[j]), 16, sy(0.01) - sy(Wv[j]), 'solid2');
      o += text(cx + 17, 240, 'ch ' + (j + 1), 'ts', 'middle');
      o += text(cx + 8, sy(X[j]) - 4, X[j] >= 10 ? X[j].toFixed(0) : X[j].toFixed(2), 'ts', 'middle');
    }
  };
  panel(70, mx, mw, 'smoothing 之前');
  panel(320, ax, aw, 'smoothing 之后（α = 0.5）');
  o += rect(150, 254, 12, 12, 'solid') + text(167, 264, 'max |X_j|（activation）', 'ts') + rect(330, 254, 12, 12, 'solid2') + text(347, 264, 'max |W_j|（weight 的 row）', 'ts');
  return svg(560, 272, o, 'Smoothing 前第 3 个 channel 的 activation 比其他 channel 大约 100 倍；smoothing 后每个 channel 的 activation 和 weight 的最大值相等，且差别不到 3 倍');
}

// Knowledge distillation：不同 temperature 下的 soft target
function kd() {
  const z = [5, 3, -2], Ts = [1, 2, 4, 10], names = ['cat', 'dog', 'car'];
  const sm = (T) => { const e = z.map((v) => Math.exp(v / T)), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); };
  const sy = lin(0, 1, 226, 30);
  let o = '';
  for (const v of [0, 0.25, 0.5, 0.75, 1]) o += line(60, sy(v), 540, sy(v), v === 0 ? 'axis' : 'grid') + text(54, sy(v) + 4, v.toString(), 'ts', 'end');
  const cls = ['solid', 'solid2', 'wash-strong'];
  Ts.forEach((T, g) => {
    const p = sm(T), x0 = 80 + g * 118;
    p.forEach((v, k) => {
      const x = x0 + k * 30;
      o += rect(x, sy(v), 26, sy(0) - sy(v), cls[k]);
      o += text(x + 13, sy(v) - 5, v < 0.01 ? v.toFixed(4) : v.toFixed(2), 'ts', 'middle');
    });
    o += text(x0 + 43, 246, 'T = ' + T, 'tb', 'middle');
  });
  names.forEach((nm, k) => { o += rect(180 + k * 90, 258, 12, 12, cls[k]) + text(197 + k * 90, 268, nm, 'ts'); });
  o += text(60, 16, 'teacher logit：cat 5，dog 3，car −2', 'ts');
  return svg(560, 276, o, 'Teacher logit 5、3、−2 在 temperature 1、2、4、10 下的 softmax：temperature 越高，第二、第三类的 probability 越大');
}

// KV cache 随 sequence length 增长（batch 16，fp16）
function kvcache() {
  const kv = (L, H, N) => (2 * L * H * 128 * N * 16 * 2) / 2 ** 30;
  const sx = lin(0, 8192, 70, 470), sy = lin(0, 340, 232, 24);
  let o = axes({ sx, sy, x0: 0, x1: 8192, y0: 0, y1: 340, xt: [0, 2048, 4096, 6144, 8192], yt: [0, 100, 200, 300], grid: true });
  const ser = (L, H, cls) => path(d([[sx(0), sy(0)], [sx(8192), sy(kv(L, H, 8192))]]), cls);
  o += ser(80, 64, 'ln') + ser(80, 8, 'ink-b') + ser(32, 32, 'mute');
  o += line(sx(0), sy(140e9 / 2 ** 30), sx(8192), sy(140e9 / 2 ** 30), 'dash') + text(sx(150), sy(140e9 / 2 ** 30) - 6, '70B 的 fp16 weight 130 GiB', 'ts');
  o += line(sx(0), sy(13.48e9 / 2 ** 30), sx(8192), sy(13.48e9 / 2 ** 30), 'ln-dash');
  o += text(476, sy(kv(80, 64, 8192)) + 4, '70B，MHA', 'tl') + text(476, sy(kv(80, 64, 8192)) + 20, '320 GiB', 'ts');
  o += text(476, sy(kv(32, 32, 8192)) - 4, '7B，MHA', 'tb') + text(476, sy(kv(32, 32, 8192)) + 11, '64 GiB', 'ts');
  o += text(476, sy(kv(80, 8, 8192)) + 22, '70B，GQA', 'tb') + text(476, sy(kv(80, 8, 8192)) + 37, '40 GiB', 'ts');
  o += text(sx(3200), sy(58), '7B 的 fp16 weight 12.6 GiB', 'ts') + line(sx(3300), sy(50), sx(3000), sy(13.48e9 / 2 ** 30) - 2, 'mute');
  o += circle(sx(4096), sy(kv(80, 64, 4096)), 4, 'ln-f') + text(sx(4096) - 8, sy(kv(80, 64, 4096)) - 8, '160 GiB', 'ts', 'end');
  o += text(470, 268, 'sequence length N', 'ts', 'end') + text(70, 14, 'KV cache（GiB，batch size 16，fp16）', 'ts');
  return svg(560, 276, o, 'KV cache 随 sequence length 线性增长；70B 模型用 multi-head attention 在 8192 个 token 时达到 320 GiB，换成 8 组 GQA 后是 40 GiB');
}

// Speculative decoding 的 speedup 随 γ 的变化
function specdec() {
  const c = 0.05;
  const sp = (a, g) => (1 - a ** (g + 1)) / ((1 - a) * (g * c + 1));
  const sx = lin(1, 12, 70, 470), sy = lin(1, 5, 230, 26);
  let o = axes({ sx, sy, x0: 1, x1: 12, y0: 1, y1: 5, xt: [1, 2, 4, 6, 8, 10, 12], yt: [1, 2, 3, 4, 5], grid: true });
  const al = [[0.6, 'mute'], [0.8, 'ln'], [0.9, 'ink-b']];
  for (const [a, cls] of al) {
    const pts = []; let best = 1;
    for (let g = 1; g <= 12; g++) { pts.push([sx(g), sy(sp(a, g))]); if (sp(a, g) > sp(a, best)) best = g; }
    o += path(d(pts), cls);
    for (let g = 1; g <= 12; g++) o += circle(sx(g), sy(sp(a, g)), 2.5, cls === 'ln' ? 'ln-f' : 'ink-f');
    o += text(476, sy(sp(a, 12)) + 4, 'α = ' + a, cls === 'ln' ? 'tl' : 'tb');
    o += text(sx(best), sy(sp(a, best)) - 9, '最大 ' + sp(a, best).toFixed(2) + '（γ = ' + best + '）', 'ts', 'middle');
  }
  o += circle(sx(4), sy(sp(0.8, 4)), 5, 'ln') + text(sx(4) + 10, sy(sp(0.8, 4)) + 18, 'α = 0.8，γ = 4：2.80', 'tl');
  o += text(470, 266, '每轮 draft 的 token 数 γ', 'ts', 'end') + text(70, 14, 'speedup（draft 的成本 c = 0.05）', 'ts');
  return svg(560, 274, o, 'Speculative decoding 的 speedup 随 draft 长度先升后降；acceptance rate 越高，最佳的 draft 长度越长、speedup 越大');
}

// MobileNetV2（int8，224 input）每个 block 的 peak activation
function mcupeak() {
  const md = (v, dv = 8) => { let n = Math.max(dv, Math.floor((v + dv / 2) / dv) * dv); if (n < 0.9 * v) n += dv; return n; };
  const cfg = [[1, 16, 1, 1], [6, 24, 2, 2], [6, 32, 3, 2], [6, 64, 4, 2], [6, 96, 3, 1], [6, 160, 3, 2], [6, 320, 1, 1]];
  let H = 224, c = 3;
  const peaks = [];
  const c1 = md(32); let H2 = Math.ceil(H / 2);
  peaks.push(H * H * c + H2 * H2 * c1); H = H2; c = c1;
  for (const [t, cc, n, s] of cfg) {
    const co = md(cc);
    for (let i = 0; i < n; i++) {
      const st = i === 0 ? s : 1, keep = st === 1 && c === co ? H * H * c : 0, hid = c * t;
      let p = 0;
      if (t !== 1) p = Math.max(p, H * H * c + H * H * hid);
      const Ho = Math.ceil(H / st);
      p = Math.max(p, H * H * hid + keep); // in-place depthwise
      p = Math.max(p, Ho * Ho * hid + Ho * Ho * co + keep);
      peaks.push(p); H = Ho; c = co;
    }
  }
  const kib = peaks.map((v) => v / 1024);
  const sy = lin(0, 1450, 226, 26), bw = 22, x0 = 70;
  let o = '';
  for (const v of [0, 250, 500, 750, 1000, 1250]) o += line(x0, sy(v), 540, sy(v), v === 0 ? 'axis' : 'grid') + text(x0 - 6, sy(v) + 4, String(v), 'ts', 'end');
  kib.forEach((v, i) => {
    const x = x0 + 6 + i * 25.5;
    o += rect(x, sy(v), bw, sy(0) - sy(v), v > 320 ? 'solid' : 'solid2');
    o += text(x + bw / 2, 242, i === 0 ? 'stem' : String(i), 'ts', 'middle');
  });
  o += line(x0, sy(320), 540, sy(320), 'ln-dash') + text(538, sy(320) - 6, 'STM32F746 的 SRAM 320 kB', 'tl', 'end');
  o += text(x0 + 6 + 2 * 25.5 + bw + 6, sy(kib[2]) + 12, `${kib[2].toFixed(0)} KiB：block 2 的 1×1 expand`, 'tb');
  o += text(305, 262, 'block（stem 之后是 17 个 inverted residual block）', 'ts', 'middle') + text(x0, 14, 'peak activation（KiB，int8）', 'ts');
  return svg(560, 272, o, 'MobileNetV2 每个 block 的 peak activation memory：前几个 block 远超 320 kB 的 SRAM，最高的是第 2 个 block 的 1372 KiB，后面的 block 都在 200 KiB 以下');
}

// Patch-based inference 的示意
function patch() {
  let o = '';
  const g = 34, X = 30, Y = 50, n = 4;
  o += text(X + (g * n) / 2, 30, 'input（4 × 4 个 patch）', 'tb', 'middle');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += rect(X + j * g, Y + i * g, g, g, i === 1 && j === 1 ? 'wash-strong' : 'wash2');
  o += rect(X + g - 8, Y + g - 8, g + 16, g + 16, 'ln');
  o += text(X + (g * n) / 2, Y + g * n + 22, '一个 patch 加一圈 halo', 'tl', 'middle');
  o += arrow(X + g * n + 10, Y + 1.5 * g, 228, Y + 1.5 * g, 'ink');
  o += rect(232, Y + 0.5 * g, 110, 2 * g, 'paper', 6) + text(287, Y + 1.5 * g - 4, 'patch stage', 't', 'middle') + text(287, Y + 1.5 * g + 14, '前几个 block', 'ts', 'middle');
  o += text(287, Y + 3 * g + 10, '每次只有一个 patch', 'ts', 'middle') + text(287, Y + 3 * g + 26, '的 activation 在 SRAM 里', 'ts', 'middle');
  o += arrow(346, Y + 1.5 * g, 380, Y + 1.5 * g, 'ink');
  const s = 18, X2 = 386, Y2 = Y + 1.5 * g - 2 * s;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) o += rect(X2 + j * s, Y2 + i * s, s, s, i === 1 && j === 1 ? 'wash-strong' : 'wash2');
  o += rect(X2, Y2, 4 * s, 4 * s, 'frame');
  o += text(X2 + 2 * s, Y2 - 10, '拼回 feature map', 'ts', 'middle');
  o += arrow(X2 + 4 * s + 4, Y + 1.5 * g, X2 + 4 * s + 30, Y + 1.5 * g, 'ink');
  o += text(X2 + 4 * s + 34, Y + 1.5 * g - 4, '其余', 'ts') + text(X2 + 4 * s + 34, Y + 1.5 * g + 12, '逐层', 'ts');
  o += text(280, 248, '28 × 28 的 output patch 经过 3 个 3×3 conv 需要 34 × 34 的 input：重叠部分重复计算，这一段多算 47%', 'ts', 'middle');
  return svg(560, 258, o, 'Patch-based inference：input 切成 4 乘 4 个 patch，每个 patch 带一圈 halo 单独通过前几个 block，拼回 feature map 后剩下的网络逐层执行');
}

// ---------- 开头第一次：model size 与 8 GB ----------
function fit() {
  const P = 6738415616;
  const rows = [['fp16', 16], ['int8', 8], ['int4', 4]];
  const sx = lin(0, 16, 90, 500);
  let o = '';
  rows.forEach(([lab, bit], i) => {
    const y = 40 + i * 50, gb = P * bit / 8 / 1e9;
    o += text(80, y + 20, lab, 'tb', 'end') + rect(sx(0), y, sx(gb) - sx(0), 30, gb > 8 ? 'wash2' : 'solid', 3);
    o += gb > 8 ? text(sx(gb) + 8, y + 20, gb.toFixed(2) + ' GB', 't') : text(sx(gb) - 8, y + 20, gb.toFixed(2) + ' GB', 'tw', 'end');
  });
  o += line(sx(8), 26, sx(8), 196, 'ln') + text(sx(8) + 6, 30, 'Jetson Orin NX：8 GB', 'tl');
  o += line(sx(0), 196, sx(16), 196, 'axis');
  for (const v of [0, 4, 8, 12, 16]) o += line(sx(v), 196, sx(v), 200, 'axis') + text(sx(v), 214, v + ' GB', 'ts', 'middle');
  o += text(90, 240, `Llama-2-7B：${P.toLocaleString('en-US')} 个 parameter × bit 数；int4 还要加上 scale`, 'ts');
  return svg(560, 252, o, 'Llama-2-7B 的 weight 在 fp16、int8、int4 下分别是 13.48、6.74、3.37 GB，与 Jetson Orin NX 的 8 GB memory 对比');
}

// ---------- 第 1 站：AlexNet conv1 与 FC1 的 parameter 和 MACs ----------
function convfc() {
  const conv = { p: 96 * 3 * 11 * 11, m: 96 * 3 * 11 * 11 * 55 * 55 }, fc = { p: 4096 * 9216, m: 4096 * 9216 };
  const sx = logx(1e4, 1e9, 150, 520);
  const fmt = (v) => v.toLocaleString('en-US');
  let o = '';
  for (const k of [4, 5, 6, 7, 8, 9]) o += line(sx(10 ** k), 30, sx(10 ** k), 206, 'grid') + text(sx(10 ** k), 222, '10' + sup(k), 'ts', 'middle');
  const bar = (y, v, cls, lab) => rect(sx(1e4), y, sx(v) - sx(1e4), 22, cls, 3) + text(sx(v) + (v > 3e8 ? -6 : 6), y + 16, fmt(v), v > 3e8 ? 'tw' : 'ts', v > 3e8 ? 'end' : 'start') + text(140, y + 16, lab, 't', 'end');
  o += text(20, 44, 'conv1', 'tb') + bar(52, conv.p, 'wash-strong', 'params') + bar(80, conv.m, 'solid', 'MACs');
  o += text(20, 132, 'FC1', 'tb') + bar(140, fc.p, 'wash-strong', 'params') + bar(168, fc.m, 'solid', 'MACs');
  o += text(sx(1e9), 244, 'log scale', 'ts', 'end');
  o += text(20, 244, `conv1 的 parameter 是 FC1 的 1/${Math.round(fc.p / conv.p)}，MACs 是 FC1 的 ${(conv.m / fc.m).toFixed(1)} 倍`, 'ts');
  return svg(560, 256, o, 'AlexNet 的 conv1 只有 34,848 个 parameter，却有一亿多次 MAC；第一个 fully-connected layer 有三千七百多万个 parameter，MACs 与 parameter 数相同');
}

// ---------- 第 3 站：k-means 与 linear 两种 4 个值 ----------
function kmeans() {
  const W = [2.09, -0.98, 1.48, 0.09, 0.05, -0.14, -1.08, 2.12, -0.91, 1.92, 0, -1.03, 1.87, 0, 1.53, 1.49];
  let c = [-1.08, -1.08 + 3.2 / 3, -1.08 + 6.4 / 3, 2.12];
  const assign = () => W.map((w) => c.reduce((bi, ci, i) => (Math.abs(w - ci) < Math.abs(w - c[bi]) ? i : bi), 0));
  for (let it2 = 0; it2 < 10; it2++) { const a = assign(); c = c.map((ci, k) => { const m = W.filter((_, i) => a[i] === k); return m.reduce((x, y) => x + y, 0) / m.length; }); }
  const a = assign();
  const S = 3.2 / 3, grid = [-2, -1, 0, 1].map((q) => S * (q + 1));
  const lq = W.map((w) => grid.reduce((b, g) => (Math.abs(w - g) < Math.abs(w - b) ? g : b), grid[0]));
  const nrm = Math.sqrt(W.reduce((x, w) => x + w * w, 0));
  const eK = Math.sqrt(W.reduce((x, w, i) => x + (w - c[a[i]]) ** 2, 0)) / nrm, eL = Math.sqrt(W.reduce((x, w, i) => x + (w - lq[i]) ** 2, 0)) / nrm;
  const sx = lin(-1.5, 2.5, 40, 520), y1 = 80, y2 = 190;
  const cls = ['ink-f', 'mute-f', 'ln-f', 'solid'];
  let o = text(40, 30, 'k-means：codebook 放在 weight 密集的地方', 'tb') + line(40, y1, 520, y1, 'axis');
  W.forEach((w, i) => { o += circle(sx(w), y1 - 14, 3.5, cls[a[i]]); });
  c.forEach((ci, k) => { o += line(sx(ci), y1 - 4, sx(ci), y1 + 8, 'ink-b') + text(sx(ci), y1 + 24, ci.toFixed(2).replace('-', '−'), 'tb', 'middle'); });
  o += text(520, y1 + 44, `error ${eK.toFixed(3)}`, 'tl', 'end');
  o += text(40, 140, 'linear：4 个格点只能等距，间隔 S = 1.07', 'tb') + line(40, y2, 520, y2, 'axis');
  W.forEach((w) => { o += circle(sx(w), y2 - 14, 3.5, 'ink-f'); });
  grid.forEach((g) => { o += line(sx(g), y2 - 4, sx(g), y2 + 8, 'ink-b') + text(sx(g), y2 + 24, g.toFixed(2).replace('-', '−'), 'tb', 'middle'); });
  o += text(520, y2 + 44, `error ${eL.toFixed(3)}`, 'tl', 'end');
  return svg(560, 246, o, '同一个 4 乘 4 matrix 的 16 个 weight：k-means 的四个值是 −1、0、1.5、2，贴着 weight 的聚集处；linear quantization 的四个值等距，误差约为 k-means 的 2.8 倍');
}

// ---------- 第 2 站：channel pruning 要改的三处 ----------
function chprune() {
  let o = '';
  const keep = 0.7;
  const slab = (x, y, w, h, n, cut, dir, lab, sub2) => {
    let q = text(x + w / 2, y - 10, lab, 'tb', 'middle') + text(x + w / 2, y + h + 18, sub2, 'ts', 'middle');
    for (let i = 0; i < n; i++) {
      const pruned = i >= Math.round(n * keep);
      if (dir === 'row') q += rect(x, y + i * h / n, w, h / n, pruned ? 'wash2' : 'wash-strong');
      else q += rect(x + i * w / n, y, w / n, h, pruned ? 'wash2' : 'wash-strong');
    }
    return q + rect(x, y, w, h, 'frame');
  };
  o += slab(30, 50, 120, 120, 10, true, 'row', 'layer ℓ 的 weight', 'c_o × c_i × k × k：剪第 0 维');
  o += slab(220, 50, 40, 120, 10, true, 'row', 'BatchNorm', '4 个 tensor 都剪');
  o += slab(340, 50, 120, 120, 10, true, 'col', 'layer ℓ+1 的 weight', 'c_o × c_i × k × k：剪第 1 维');
  o += arrow(152, 110, 216, 110, 'mute') + arrow(262, 110, 336, 110, 'mute');
  o += rect(470, 56, 12, 12, 'wash-strong') + text(488, 66, '保留 70%', 'ts') + rect(470, 76, 12, 12, 'wash2') + text(488, 86, '剪掉 30%', 'ts');
  o += text(30, 230, `三处必须用同一组 channel；layer ℓ+1 的 c_i 和 c_o 都乘 ${keep}，MACs 乘 ${(keep * keep).toFixed(2)}，即 1/${(1 / keep / keep).toFixed(2)}`, 't');
  return svg(560, 244, o, 'Channel pruning：剪掉 layer ℓ 的 30% output channel 时，要同时剪它的 BatchNorm 和 layer ℓ+1 对应的 input channel');
}

// ---------- 第 3 站：integer-only matmul 的 data flow ----------
function intmm() {
  let o = '';
  const box = (x, y, w, lines, cls = 'paper') => { o += rect(x, y, w, 20 + lines.length * 16, cls, 6); lines.forEach((s2, i) => { o += text(x + w / 2, y + 17 + i * 16, s2, cls === 'solid' ? 'tw' : i === 0 ? 'tb' : 'ts', 'middle'); }); };
  box(20, 40, 130, ['q_W（int8）', 'symmetric，Z_W = 0']);
  box(20, 110, 130, ['q_X（int8）', 'Z_X = −64']);
  box(190, 70, 150, ['q_W q_X（int32）', '(−20565, 15384, …)']);
  box(190, 150, 150, ['Z_X q_W 𝟏（int32）', 'offline 算好，折进 bias'], 'wash2');
  box(380, 70, 160, ['accumulator（int32）', '(−10325, 19032,', '11389, 10880)']);
  box(380, 172, 160, ['× M = 2⁻⁶ × 0.56155', 'integer 乘 + bit shift', '+ Z_Y，clamp'], 'wash');
  box(380, 270, 160, ['q_Y（int8）', '(−128, 127, 62, 57)'], 'solid');
  o += arrow(152, 60, 188, 86, 'ink') + arrow(152, 128, 188, 96, 'ink') + arrow(342, 94, 378, 94, 'ink') + arrow(342, 172, 378, 112, 'mute');
  o += text(370, 162, '−', 'tb', 'middle');
  o += arrow(460, 136, 460, 170, 'ink') + arrow(460, 236, 460, 268, 'ink');
  o += text(20, 230, 'int8 只是 memory 里的格式；', 'ts') + text(20, 248, '中间的 accumulator 要 int32，', 'ts') + text(20, 266, '整条路上没有 floating-point', 'ts');
  return svg(560, 330, o, 'Integer-only matrix multiplication 的数据流：int8 的 weight 和 input 相乘累加成 int32，减去 offline 算好的 zero point 项，乘以定点数 M 并移位，加上 output 的 zero point 后 clamp 回 int8');
}

// ---------- 第 4 站：scale 沿哪个维度才能提到 sum 外面 ----------
function scaleAxes() {
  let o = '';
  const T = 3, C = 4, J = 2, c = 26;
  const xX = 40, yX = 70, xW = 250, yW = 44;
  for (let t = 0; t < T; t++) for (let i = 0; i < C; i++) o += rect(xX + i * c, yX + t * c, c, c, i === 2 ? 'wash-strong' : 'paper');
  for (let i = 0; i < C; i++) for (let j = 0; j < J; j++) o += rect(xW + j * c, yW + i * c, c, c, i === 2 ? 'wash-strong' : 'paper');
  o += text(xX + C * c / 2, yX - 26, 'X：token t × input channel i', 'ts', 'middle') + text(xW + J * c / 2, yW - 10, 'W：i × output j', 'ts', 'middle');
  for (let t = 0; t < T; t++) o += text(xX - 8, yX + t * c + 18, 'a' + '₁₂₃'[t], 'tl', 'end');
  for (let j = 0; j < J; j++) o += text(xW + j * c + c / 2, yW + C * c + 18, 'b' + '₁₂'[j], 'tl', 'middle');
  o += text(xX + 2 * c + c / 2, yX - 8, 'outlier', 'ts', 'middle');
  o += text(xW + J * c + 8, yW + 2 * c + 18, '← c_i 在这一维', 'ts');
  o += text(30, 200, 'Y_tj = Σ_i X_ti W_ij，sum 沿着 i 走：', 't');
  o += text(30, 222, '· per-token a_t、per-output-channel b_j 不随 i 变 → 提到 sum 外面，仍是 integer GEMM', 'ts');
  o += text(30, 242, '· per-input-channel c_i 随 i 变 → 每一项乘的数不同，留在 sum 里', 'ts');
  o += text(400, 80, 'outlier 沿 i 分布，', 'ts') + text(400, 96, '最需要的恰好是 c_i', 'ts');
  return svg(560, 256, o, 'Y 等于 X 乘 W 时，activation 的每个 token 一个 scale、weight 的每个 output channel 一个 scale 可以提到求和之外；按 input channel 的 scale 沿着求和的维度变化，提不出来');
}

// ---------- 第 6 站：MHA 与 GQA ----------
function gqa() {
  let o = '';
  const row = (y, nKV, lab, sub2) => {
    o += text(20, y - 22, lab, 'tb') + text(540, y - 22, sub2, 'ts', 'end');
    const H = 64, w = 7.4, x0 = 30;
    for (let h = 0; h < H; h++) o += rect(x0 + h * w, y, w - 1.5, 14, 'wash-strong');
    const per = H / nKV;
    for (let g = 0; g < nKV; g++) {
      const xa = x0 + g * per * w, xb = x0 + (g + 1) * per * w - 1.5;
      o += rect(xa, y + 34, xb - xa, 14, 'solid') + line((xa + xb) / 2, y + 16, (xa + xb) / 2, y + 32, 'mute');
    }
    o += text(x0 - 6, y + 11, 'Q', 'ts', 'end') + text(x0 - 6, y + 45, 'KV', 'ts', 'end');
  };
  const per = (g) => 2 * 80 * g * 128 * 2 / 1024;
  row(50, 64, 'Multi-head attention：64 组 K、V', `每 token ${per(64) / 1024} MiB`);
  row(150, 8, 'Grouped-query attention：8 个 query head 共用一组 K、V', `每 token ${per(8)} KiB`);
  o += text(20, 236, 'Llama-2-70B：80 层，d_h = 128，fp16。Query head 不变，KV cache 小 8 倍', 'ts');
  return svg(560, 248, o, 'Llama-2-70B 的 64 个 query head：multi-head attention 每个 head 一组 key 和 value；grouped-query attention 每 8 个 query head 共用一组，KV cache 从每 token 2.5 MiB 降到 320 KiB');
}

// ---------- 第 7 站：MobileNetV2 第 2 个 block 的 expand ----------
function invres() {
  const H = 112, cin = 16, cexp = 96;
  const bIn = cin * H * H, bOut = cexp * H * H, tot = bIn + bOut;
  const sram = 320 * 1000;
  const sx = lin(0, 1.5e6, 40, 520);
  let o = text(40, 28, `第 2 个 block 的 1×1 expand：${cin} → ${cexp} 个 channel，${H}×${H}，int8`, 'tb');
  o += rect(sx(0), 50, sx(bIn) - sx(0), 34, 'wash-strong', 3) + rect(sx(bIn), 50, sx(tot) - sx(bIn), 34, 'solid', 3);
  o += text(sx(bIn / 2), 104, `input ${cin}×${H}×${H}`, 'ts', 'middle') + text(sx(bIn / 2), 120, bIn.toLocaleString('en-US') + ' B', 'ts', 'middle');
  o += text(sx(bIn + bOut / 2), 72, `output ${cexp}×${H}×${H} = ${bOut.toLocaleString('en-US')} B`, 'tw', 'middle');
  o += text(sx(tot), 104, `合计 ${Math.round(tot / 1024)} KiB`, 'tl', 'end');
  o += rect(sx(0), 150, sx(sram) - sx(0), 34, 'wash2', 3) + text(sx(sram) + 8, 172, 'SRAM 320 kB（STM32F746）', 't');
  o += line(sx(sram), 44, sx(sram), 190, 'dash');
  o += line(sx(0), 200, sx(1.5e6), 200, 'axis');
  for (const v of [0, 5e5, 1e6, 1.5e6]) o += line(sx(v), 200, sx(v), 204, 'axis') + text(sx(v), 218, (v / 1e6).toFixed(1) + ' MB', 'ts', 'middle');
  o += text(40, 244, `一个 layer 的 input 和 output 必须同时在 SRAM 里：${(tot / sram).toFixed(1)} 倍；weight 放在 Flash，不占这里`, 'ts');
  return svg(560, 256, o, 'MobileNetV2 第二个 block 的 1x1 expand conv：input 200,704 byte 加 output 1,204,224 byte 共 1372 KiB，是 320 kB SRAM 的四倍多');
}

export default {
  'm6940-roofline': roofline,
  'm6940-sensitivity': sensitivity,
  'm6940-granularity': granularity,
  'm6940-linquant': linquant,
  'm6940-clip': clip,
  'm6940-smooth': smooth,
  'm6940-kd': kd,
  'm6940-kvcache': kvcache,
  'm6940-specdec': specdec,
  'm6940-mcupeak': mcupeak,
  'm6940-patch': patch,
  'm6940-fit': fit,
  'm6940-convfc': convfc,
  'm6940-kmeans': kmeans,
  'm6940-chprune': chprune,
  'm6940-intmm': intmm,
  'm6940-scaleaxes': scaleAxes,
  'm6940-gqa': gqa,
  'm6940-invres': invres,
};
