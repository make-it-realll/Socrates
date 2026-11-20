import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 可复现的随机数：mulberry32 加 Box–Muller
function rng(seed) {
  let a = seed >>> 0;
  const u = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const n = () => Math.sqrt(-2 * Math.log(u() + 1e-12)) * Math.cos(2 * Math.PI * u());
  return { u, n };
}

// 只画落在 [y0, y1] 里的部分，越界就断开
function clipped(fn, x0, x1, sx, sy, y0, y1, cls, n = 400) {
  let o = '', seg = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n, y = fn(x);
    if (y >= y0 && y <= y1) seg.push([sx(x), sy(y)]);
    else { if (seg.length > 1) o += path(d(seg), cls); seg = []; }
  }
  if (seg.length > 1) o += path(d(seg), cls);
  return o;
}

const npdf = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI));

// 第 2 站：bimodal Q 与 soft policy exp(Q/α)
function soft() {
  const Q = (a) => Math.exp(-(((a + 0.6) / 0.15) ** 2)) + 0.9 * Math.exp(-(((a - 0.5) / 0.15) ** 2));
  const N = 2000, xs = Array.from({ length: N + 1 }, (_, i) => -1 + (2 * i) / N);
  const pol = (al) => {
    const w = xs.map((a) => Math.exp((Q(a) - 1) / al));
    const Z = w.reduce((s, v) => s + v, 0) * (2 / N);
    const p = w.map((v) => v / Z);
    const left = p.reduce((s, v, i) => s + (xs[i] < 0 ? v : 0), 0) * (2 / N);
    return { f: (a) => p[Math.round(((a + 1) / 2) * N)], left };
  };
  const p1 = pol(0.3), p2 = pol(0.05);
  let o = '';
  const sx = lin(-1, 1, 60, 520);
  // 上：Q(a)
  const syQ = lin(0, 1.1, 110, 22);
  o += line(60, syQ(0), 520, syQ(0), 'axis') + path(curve(Q, -1, 1, sx, syQ, 400), 'ink-b');
  o += text(52, syQ(1) + 4, '1.0', 'ts', 'end') + text(52, syQ(0) + 4, '0', 'ts', 'end');
  o += text(sx(-0.6), syQ(1) - 6, 'Q = 1.0', 'ts', 'middle') + text(sx(0.5), syQ(0.9) - 6, 'Q = 0.9', 'ts', 'middle');
  o += text(66, 24, 'Q(s, a)', 'tb');
  // 下：两个 α 的 policy
  const ymax = Math.max(...xs.map(p2.f));
  const syP = lin(0, ymax * 1.05, 262, 140);
  o += line(60, syP(0), 520, syP(0), 'axis');
  o += path(area(p1.f, -1, 1, sx, syP, 0, 400), 'wash') + path(curve(p1.f, -1, 1, sx, syP, 400), 'ink');
  o += path(curve(p2.f, -1, 1, sx, syP, 400), 'ln');
  for (const t of [-1, -0.5, 0, 0.5, 1]) o += line(sx(t), syP(0), sx(t), syP(0) + 4, 'axis') + text(sx(t), syP(0) + 17, String(t).replace('-', '−'), 'ts', 'middle');
  o += text(520, syP(0) + 32, 'action a', 'ts', 'end');
  o += text(66, 146, 'π*(a) ∝ exp(Q / α)', 'tb');
  const lab2 = sx(-0.6) + 22, lab1 = sx(0.5) + 26;
  o += text(lab2, syP(ymax * 0.82), `α = 0.05：左 ${p2.left.toFixed(3)}，右 ${(1 - p2.left).toFixed(3)}`, 'tl');
  o += text(lab1, syP(ymax * 0.42), `α = 0.3（浅底）：`, 'ts') + text(lab1, syP(ymax * 0.42) + 16, `左 ${p1.left.toFixed(3)}，右 ${(1 - p1.left).toFixed(3)}`, 'ts');
  return svg(560, 300, o, '上图是有两个峰的 Q function，左峰略高；下图是对应的 soft optimal policy，temperature 大时两个峰都有 probability，temperature 小时几乎全部集中在左峰');
}

// 第 3 站：bootstrap ensemble 在 data 外散开
function ens() {
  const W = [[1.007, -0.042, -0.374], [0.99, -0.028, -0.273], [1.01, -0.056, -0.319], [1.013, 0.01, -0.492], [1.01, -0.007, -0.376]];
  const w0 = [0.999, -0.031, -0.3];
  const f = (w) => (a) => w[0] * a + w[1] * a * a + w[2] * a ** 3;
  const sx = lin(-3, 3, 60, 520), sy = lin(-2.4, 3.2, 250, 22);
  let o = rect(sx(-0.5), sy(3.2), sx(0.5) - sx(-0.5), sy(-2.4) - sy(3.2), 'wash');
  o += axes({ sx, sy, x0: -3, x1: 3, y0: -2.4, y1: 3.2, xt: [[-3, '−3'], [-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2'], [3, '3']], yt: [[-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2'], [3, '3']], xAt: -2.4 });
  o += line(sx(-3), sy(2), sx(3), sy(2), 'dash') + text(sx(3) - 4, sy(2) - 6, '目标 Δs = 2', 'ts', 'end');
  for (const w of W) o += clipped(f(w), -3, 3, sx, sy, -2.4, 3.2, 'mute');
  o += clipped(f(w0), -3, 3, sx, sy, -2.4, 3.2, 'ln');
  o += path(curve(Math.tanh, -3, 3, sx, sy), 'ink-b');
  const a = -2.5;
  o += circle(sx(a), sy(f(w0)(a)), 4.5, 'ln-f') + circle(sx(a), sy(Math.tanh(a)), 4.5, 'ink-f');
  o += arrow(sx(a), sy(f(w0)(a)) + 6, sx(a), sy(Math.tanh(a)) - 7, 'ink');
  o += line(sx(a) + 5, sy(f(w0)(a)) - 4, sx(-1.65), sy(2.62), 'mute');
  o += text(sx(-1.6), sy(2.62) + 4, 'planner 选 a = −2.5：model 说 2.0', 'tl');
  o += text(sx(-2.95), sy(-1.45), '实际 tanh(−2.5) = −0.99', 't');
  o += text(sx(0), sy(3.2) + 14, 'data', 'ts', 'middle');
  o += text(sx(1.15), sy(1.25), 'tanh(a)', 'tb') + text(sx(1.78), sy(-1.9), '5 个 bootstrap model', 'ts', 'end');
  o += text(sx(1.78), sy(-1.9) + 16, '彩线：planner 用的单个 model', 'ts', 'end');
  o += text(520, 282, 'action a', 'ts', 'end') + text(64, 16, '预测的 Δs', 'ts');
  return svg(560, 292, o, '在 action 的 data 范围内，单个 cubic model 和 5 个 bootstrap model 都贴合真实的 tanh；离开 data 之后它们向不同方向散开，planner 选中 a 等于负 2.5，model 预测到达目标，实际却向相反方向走');
}

// 第 4 站：domain randomization 覆盖 parameter space
function dr() {
  const cmax = [2, 1, (Math.sqrt(5) - 1) / 2]; // d = 0, 1, 2 时 c = κ/m 的 stability 上限（正文推导与数值求根）
  const sx = logx(0.25, 4, 110, 530);
  const rowY = [70, 140, 210];
  let o = rect(sx(0.5), 40, sx(2) - sx(0.5), 200, 'wash');
  o += text((sx(0.5) + sx(2)) / 2, 34, 'randomization 范围：m ∈ [0.5, 2]，d ∈ {0, 1, 2}', 'ts', 'middle');
  for (const t of [0.25, 0.5, 1, 2, 4]) o += line(sx(t), 40, sx(t), 244, 'grid') + text(sx(t), 260, String(t), 'ts', 'middle');
  o += text(530, 278, 'mass m（log scale，nominal = 1）', 'ts', 'end');
  const bars = [[1, 'ink-b', -12, 'nominal gain κ = 1'], [0.21, 'ln', 12, 'randomized gain κ = 0.21']];
  rowY.forEach((y, dI) => {
    o += text(100, y + 4, `latency d = ${dI}`, 't', 'end');
    for (const [k, cls, dy] of bars) {
      const mlo = k / cmax[dI];
      const x0 = sx(Math.max(mlo, 0.25));
      o += line(x0, y + dy, sx(4), y + dy, cls);
      if (mlo > 0.25) o += line(x0, y + dy - 5, x0, y + dy + 5, cls);
    }
  });
  o += circle(sx(1), rowY[0], 5, 'paper') + text(sx(1) + 8, rowY[0] - 16, 'simulator nominal', 'ts');
  o += circle(sx(0.8), rowY[1], 6, 'ink-f') + text(sx(0.8) - 9, rowY[1] + 31, '真机 m = 0.8, d = 1', 'tb', 'end');
  o += line(118, 300, 148, 300, 'ink-b') + text(154, 304, 'nominal gain κ = 1 的 stable 范围', 'ts');
  o += line(350, 300, 380, 300, 'ln') + text(386, 304, 'κ = 0.21 的 stable 范围', 'ts');
  return svg(560, 314, o, '横轴是 mass，三行分别是 0、1、2 步 latency。Nominal gain 在有 latency 时只在质量较大的一侧 stable，真机那一点落在它的 stable 范围外；randomized gain 的 stable 范围盖住了整个 randomization 范围');
}

// 第 5 站：BC 与 DAgger 的 expected cost 随 horizon 增长
function compound() {
  const e = 0.01;
  const bc = (T) => T - ((1 - e) * (1 - (1 - e) ** T)) / e;
  const sx = lin(0, 300, 70, 520), sy = lin(0, 200, 250, 24);
  let o = axes({ sx, sy, x0: 0, x1: 300, y0: 0, y1: 200, xt: [0, 50, 100, 150, 200, 250, 300], yt: [0, 50, 100, 150, 200], grid: true });
  o += clipped((T) => T, 0, 300, sx, sy, 0, 200, 'mute');
  o += clipped((T) => (e * T * T) / 2, 0, 300, sx, sy, 0, 200, 'dash');
  o += clipped(bc, 0, 300, sx, sy, 0, 200, 'ln');
  o += path(curve((T) => e * T, 0, 300, sx, sy), 'ink-b');
  o += text(sx(168), sy(186), 'cost 上限：每步都错', 'ts', 'end');
  o += text(sx(206), sy(196), 'εT² / 2', 'ts');
  o += text(sx(250), sy(128), 'BC（exact）', 'tl');
  o += text(sx(296), sy(e * 296) - 10, 'DAgger（可恢复）：εT', 'tb', 'end');
  o += circle(sx(100), sy(bc(100)), 4, 'ln-f') + text(sx(100) + 10, sy(bc(100)) + 16, 'T = 100：37.2', 'ts');
  o += text(520, 284, 'horizon T（步）', 'ts', 'end') + text(74, 16, 'expected cost（错的步数），ε = 0.01', 'ts');
  return svg(560, 294, o, 'Behavior cloning 的 expected cost 随 horizon 按平方增长，直到被 horizon 本身封顶；可以恢复时 DAgger 的 expected cost 随 horizon linear 增长');
}

// 第 5 站：DAgger 的 loop
function dagger() {
  const box = (x, y, w, h, t1, t2, cls = 'paper') => rect(x, y, w, h, cls, 8) + text(x + w / 2, y + (t2 ? 22 : 28), t1, 'tb', 'middle') + (t2 ? text(x + w / 2, y + 40, t2, 'ts', 'middle') : '');
  let o = box(20, 20, 140, 48, 'demonstration', '初始 dataset D');
  o += arrow(160, 44, 196, 44, 'ink');
  o += box(198, 20, 160, 48, '训练 policy', '在全部 D 上 supervised');
  o += arrow(358, 44, 398, 44, 'ink');
  o += box(400, 20, 140, 48, '在机器人上跑 policy', '可能偏离、犯错');
  o += arrow(470, 68, 470, 118, 'ink');
  o += box(380, 120, 160, 64, 'expert 给 learner', '走到的每个 state 标 action', 'wash');
  o += text(460, 172, '（包括犯错之后的 state）', 'ts', 'middle');
  o += arrow(380, 152, 302, 152, 'ink');
  o += box(140, 128, 160, 48, 'D ← D ∪ Dᵢ', '数据只增不删');
  o += path(d([[220, 128], [220, 96], [278, 96], [278, 72]]), 'ink') + poly([[278, 68], [274, 76], [282, 76]], 'ink-f');
  o += text(280, 214, '每一轮新增的 data 恰好落在 learner 自己的 state distribution 上', 'ts', 'middle');
  return svg(560, 226, o, 'DAgger 的循环：用 demonstration 初始化 dataset，训练 policy，在机器人上运行 policy，请 expert 给 policy 走到的 state 标注 action，把新 data 并入 dataset，再训练');
}

// 第 6 站：两个 mode 的 demonstration
function modes() {
  const cnt = [0, 1, 2, 5, 21, 24, 12, 15, 6, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 11, 16, 31, 26, 17, 5, 1, 1, 0];
  const bw = 0.1, N = 200, x0 = -1.6;
  const sx = lin(-1.8, 1.8, 50, 530), sy = lin(0, 36, 240, 30);
  let o = rect(sx(-0.5), 30, sx(0.5) - sx(-0.5), 210, 'wash2');
  o += text(sx(0), 46, 'obstacle', 'tb', 'middle') + text(sx(0), 62, '|y| < 0.5', 'ts', 'middle');
  cnt.forEach((c, i) => { if (c) o += rect(sx(x0 + i * bw) + 0.5, sy(c), sx(bw) - sx(0) - 1, sy(0) - sy(c), 'wash-strong'); });
  const g = (x) => N * bw * npdf(x, 0.094, 1.007);
  const mix = (x) => N * bw * (0.445 * npdf(x, -1.017, 0.167) + 0.555 * npdf(x, 0.985, 0.148));
  o += path(curve(g, -1.8, 1.8, sx, sy), 'ink');
  o += clipped(mix, -1.8, 1.8, sx, sy, 0, 36, 'ln', 600);
  o += line(sx(0.094), sy(0), sx(0.094), 80, 'ink-b') + circle(sx(0.094), sy(0), 4.5, 'ink-f');
  o += text(sx(0.094) + 6, 96, 'MSE：0.094', 'tb');
  o += line(70, 300, 98, 300, 'ink') + text(104, 304, '单个 Gaussian：σ = 1.007，P(撞) = 0.38', 'ts');
  o += line(330, 300, 358, 300, 'ln') + text(364, 304, 'mixture：P(撞) = 0.0007', 'ts');
  o += line(sx(-1.8), sy(0), sx(1.8), sy(0), 'axis');
  for (const t of [-1.5, -1, -0.5, 0, 0.5, 1, 1.5]) o += line(sx(t), sy(0), sx(t), sy(0) + 4, 'axis') + text(sx(t), sy(0) + 17, String(t).replace('-', '−'), 'ts', 'middle');
  o += text(530, 272, 'lateral offset y', 'ts', 'end') + text(sx(-1.75), 22, '200 条 demonstration：左 89，右 111', 'ts');
  return svg(560, 314, o, '两个 mode 的 demonstration 的 histogram；MSE 给出的 action 落在中间的 obstacle 里，单个 Gaussian 很宽，两个 component 的 mixture 贴住两个 mode');
}

// 第 6 站：diffusion 的 reverse chain（exact minimizer，40 条）
function denoise() {
  const w = [0.445, 0.555], m = [-1.017, 0.985], s = [0.167, 0.148];
  const K = 50, beta = Array.from({ length: K }, (_, i) => 1e-3 + ((0.2 - 1e-3) * i) / (K - 1));
  const alpha = beta.map((b) => 1 - b), abar = [];
  alpha.reduce((p, a, i) => (abar[i] = p * a), 1);
  const epsHat = (x, k) => {
    const ab = abar[k - 1];
    const v = s.map((sj) => ab * sj * sj + 1 - ab);
    const lw = [0, 1].map((j) => Math.log(w[j]) - 0.5 * Math.log(v[j]) - (0.5 * (x - Math.sqrt(ab) * m[j]) ** 2) / v[j]);
    const mx = Math.max(...lw), r = lw.map((l) => Math.exp(l - mx)), Z = r[0] + r[1];
    let x0 = 0;
    for (const j of [0, 1]) x0 += (r[j] / Z) * (m[j] + ((Math.sqrt(ab) * s[j] * s[j]) / v[j]) * (x - Math.sqrt(ab) * m[j]));
    return (x - Math.sqrt(ab) * x0) / Math.sqrt(1 - ab);
  };
  const R = rng(11);
  const Y = 3.2;
  const sx = lin(50, 0, 60, 440), sy = lin(-Y, Y, 250, 26);
  let o = rect(sx(0) + 30, sy(0.5), 34, sy(-0.5) - sy(0.5), 'wash2');
  o += text(sx(0) + 47, sy(0.5) - 8, 'obstacle', 'ts', 'middle');
  o += axes({ sx, sy, x0: 50, x1: 0, y0: -Y, y1: Y, xt: [50, 40, 30, 20, 10, 0], yt: [[-3, '−3'], [-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2'], [3, '3']], xAt: -Y, yAt: 50 });
  const chains = [];
  for (let c = 0; c < 30; c++) {
    let x = R.n();
    const pts = [[x, K]];
    for (let k = K; k >= 1; k--) {
      const e = epsHat(x, k);
      const mean = (x - (beta[k - 1] / Math.sqrt(1 - abar[k - 1])) * e) / Math.sqrt(alpha[k - 1]);
      x = k > 1 ? mean + Math.sqrt((beta[k - 1] * (1 - abar[k - 2])) / (1 - abar[k - 1])) * R.n() : mean;
      pts.push([x, k - 1]);
    }
    chains.push(pts);
  }
  const draw = (pts, cls) => path(d(pts.map(([x, k]) => [sx(k), sy(Math.max(-Y, Math.min(Y, x)))])), cls);
  for (const ch of chains) o += draw(ch, 'mute');
  // 起点最靠近 0 的两条，一条落左一条落右，加粗
  const near = (pts) => Math.abs(pts[0][0]);
  const L = chains.filter((ch) => ch[K][0] < 0).sort((p, q) => near(p) - near(q))[0];
  const Rr = chains.filter((ch) => ch[K][0] > 0).sort((p, q) => near(p) - near(q))[0];
  if (L) o += draw(L, 'ink-b');
  if (Rr) o += draw(Rr, 'ln');
  o += text(440, 284, 'denoising step k（从左往右，noise 越来越小）', 'ts', 'end');
  o += text(64, 18, 'action', 'ts');
  return svg(560, 294, o, '30 条 diffusion reverse chain 从 k 等于 50 的标准 Gaussian 出发，前半段散在中间，中段分叉，最后落在左右两个 mode 上，没有停在中间的 obstacle 里');
}

// 第 7 站：action chunk 与 temporal ensembling
function chunk() {
  const k = 4, mm = 0.5;
  const wts = Array.from({ length: k }, (_, i) => Math.exp(-mm * i));
  const Z = wts.reduce((a, b) => a + b, 0);
  const sub = (i) => String.fromCharCode(0x2080 + i);
  const cw = 52, x0 = 170, y0 = 46, rh = 34, tcol = 3;
  let o = '';
  for (let t = 0; t <= 6; t++) o += text(x0 + t * cw + cw / 2, 30, t === tcol ? 't' : 't ' + (t < tcol ? '− ' + (tcol - t) : '+ ' + (t - tcol)), t === tcol ? 'tb' : 'ts', 'middle');
  o += rect(x0 + tcol * cw - 2, 36, cw + 4, 4 * rh + 14, 'wash');
  for (let r = 0; r < 4; r++) {
    const y = y0 + r * rh;
    o += text(x0 - 10, y + 20, r === 3 ? '在 t 预测的 chunk' : `在 t − ${3 - r} 预测的 chunk`, 'ts', 'end');
    for (let j = 0; j < k; j++) {
      const t = r + j, hit = t === tcol;
      o += rect(x0 + t * cw + 3, y + 4, cw - 6, rh - 8, hit ? 'solid' : 'paper', 4);
      if (hit) o += text(x0 + t * cw + cw / 2, y + 22, 'w' + sub(r), 'tw', 'middle');
    }
  }
  const yb = y0 + 4 * rh + 28;
  o += text(x0 + tcol * cw + cw / 2, yb, 'aₜ = Σ wᵢ aₜ⁽ⁱ⁾ / Σ wᵢ', 'tb', 'middle');
  o += text(280, yb + 26, 'wᵢ = exp(−m·i)，w₀ 属于最早的那次预测', 'ts', 'middle');
  const lab = wts.map((v, i) => `w${sub(i)} = ${(v / Z).toFixed(3)}`).join('，');
  o += text(280, yb + 44, `m = 0.5 时归一化后：${lab}`, 'ts', 'middle');
  return svg(560, yb + 56, o, '每一步预测一个长度为 4 的 action chunk；时刻 t 的 action 由此前四次预测中对应 t 的四个值按 exponential decay 的 weight 平均得到，最早的预测 weight 最大');
}

// 第 8 站：两种把 action 接到 VLM 上的方式
function vla() {
  const box = (x, y, w, h, t1, t2, cls = 'paper') => rect(x, y, w, h, cls, 8) + text(x + w / 2, y + (t2 ? 21 : 27), t1, 'tb', 'middle') + (t2 ? text(x + w / 2, y + 38, t2, 'ts', 'middle') : '');
  let o = '';
  o += box(10, 30, 120, 44, 'camera image', '1 帧或多帧');
  o += box(10, 90, 120, 44, 'language 指令', '“把方块放进碗里”');
  o += box(10, 150, 120, 44, 'robot state', 'joint、gripper');
  for (const y of [52, 112, 172]) o += arrow(130, y, 168, 112, 'ink');
  o += rect(170, 62, 120, 100, 'wash', 10) + text(230, 100, 'VLM backbone', 'tb', 'middle') + text(230, 118, '在 web data 上', 'ts', 'middle') + text(230, 134, 'pretrain', 'ts', 'middle');
  o += path(d([[290, 90], [320, 90], [320, 52], [340, 52]]), 'ink') + poly([[346, 52], [338, 48], [338, 56]], 'ink-f');
  o += path(d([[290, 134], [320, 134], [320, 172], [340, 172]]), 'ink') + poly([[346, 172], [338, 168], [338, 176]], 'ink-f');
  o += box(348, 26, 200, 52, 'action token，逐个生成', '每维 256 个 bin，7 到 8 个 token');
  o += box(348, 146, 200, 52, 'action expert', '约 3 亿 parameter，flow matching', 'wash');
  o += text(448, 96, '→ 一步的 action', 't', 'middle') + text(448, 112, 'RT-2、OpenVLA：约 1 到 6 Hz', 'ts', 'middle');
  o += text(448, 216, '→ 50 步的 action chunk', 't', 'middle') + text(448, 232, 'π0：10 步 Euler，可控制到 50 Hz', 'ts', 'middle');
  return svg(560, 244, o, 'Image、语言指令和robot state输入一个预训练的 vision-language model；上路把 action 当作离散 token 逐个生成，下路用一个 action expert 以 flow matching 一次生成整段 action chunk');
}

export default {
  'rb4301-soft': soft,
  'rb4301-ens': ens,
  'rb4301-dr': dr,
  'rb4301-compound': compound,
  'rb4301-dagger': dagger,
  'rb4301-modes': modes,
  'rb4301-denoise': denoise,
  'rb4301-chunk': chunk,
  'rb4301-vla': vla,
};
