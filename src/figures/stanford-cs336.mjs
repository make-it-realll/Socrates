import { svg, svgA, anim, ashow, f1, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 第 1 站：合并 (s, t) 时只改写两个 pre-token、只改三个 pair count
function bpeindex() {
  const words = [
    { b: ['l', 'o', 'w'], n: 5, hit: -1 },
    { b: ['l', 'o', 'w', 'e', 'r'], n: 2, hit: -1 },
    { b: ['w', 'i', 'd', 'e', 's', 't'], n: 3, hit: 4 },
    { b: ['n', 'e', 'w', 'e', 's', 't'], n: 6, hit: 4 },
  ];
  let o = text(20, 22, 'Pre-token 计数表', 'tb') + text(340, 22, 'Pair count 的变化', 'tb');
  const W = 26, H = 26, x0 = 30;
  words.forEach((w, r) => {
    const y = 42 + r * 40;
    const touched = w.hit >= 0;
    if (touched) o += rect(x0 - 8, y - 6, 6 * W + 70, H + 12, 'wash', 5);
    w.b.forEach((c, i) => {
      const inHit = touched && (i === w.hit || i === w.hit + 1);
      o += rect(x0 + i * W, y, W - 3, H, inHit ? 'solid' : 'paper', 3) + text(x0 + i * W + (W - 3) / 2, y + 18, c, inHit ? 'tw' : 't', 'middle');
    });
    o += text(x0 + 6 * W + 10, y + 18, '× ' + w.n, 'ts');
  });
  o += text(x0 - 8, 220, '浅底的两行含有 s t，只有它们需要改写', 'ts');
  const rows = [
    ['(e, s)', '9 → 0', 'tl'],
    ['(s, t)', '9 → 0', 'tl'],
    ['(e, st)', '新增 9', 'tl'],
    ['(w, e) (d, e) (l, o) …', '不变', 'ts'],
  ];
  rows.forEach(([p, ch, cls], i) => {
    const y = 62 + i * 34;
    o += text(340, y, p, i < 3 ? 't' : 'ts') + text(545, y, ch, cls, 'end');
    o += line(340, y + 10, 545, y + 10, 'grid');
  });
  o += arrow(250, 125, 325, 125, 'mute');
  o += text(340, 210, '11 个旧 count 只动了 2 个', 'ts');
  return svg(560, 232, o, 'Sennrich 例子里合并 s 和 t：四个 pre-token 中只有 widest 和 newest 含有这个 pair，pair count 只有 e s、s t 减少，e st 新增');
}

// 第 2 站：A1 model 的数据流与 parameter 分布（TinyStories config）
function lm() {
  let o = '';
  const bx = 40, bw = 190;
  const box = (y, h, label, cls = 'paper') => rect(bx, y, bw, h, cls, 6) + text(bx + bw / 2, y + h / 2 + 5, label, 't', 'middle');
  const rows = [
    { y: 30, h: 30, label: 'token IDs', shape: '(B, T)', p: '' },
    { y: 78, h: 30, label: 'Embedding', shape: '(B, T, 512)', p: '5,120,000' },
    { y: 126, h: 80, label: '', shape: '(B, T, 512)', p: '12,455,936' },
    { y: 224, h: 30, label: 'Final RMSNorm', shape: '(B, T, 512)', p: '512' },
    { y: 272, h: 30, label: 'LM head', shape: '(B, T, 10000)', p: '5,120,000' },
  ];
  rows.forEach((r, i) => {
    if (i !== 2) o += box(r.y, r.h, r.label);
    o += text(258, r.y + r.h / 2 + 5, r.shape, 'ts');
    if (r.p) o += text(545, r.y + r.h / 2 + 5, r.p, 't', 'end');
    if (i < rows.length - 1) o += arrow(bx + bw / 2, r.y + r.h + 2, bx + bw / 2, rows[i + 1].y - 2, 'mute');
  });
  // block 内部
  const b = rows[2];
  o += rect(bx, b.y, bw, b.h, 'wash', 6) + text(bx + 10, b.y + 18, '4 × pre-norm block', 'tb');
  o += text(bx + 10, b.y + 44, 'z = x + Attn(RMSNorm(x))', 'ts') + text(bx + 10, b.y + 64, 'y = z + SwiGLU(RMSNorm(z))', 'ts');
  o += text(545, 18, 'parameter', 'ts', 'end') + text(258, 18, 'shape', 'ts');
  o += text(258, 334, 'Embedding 与 LM head 合计占 45%，4 个 block 占 55%', 'ts');
  return svg(560, 344, o, 'A1 的 Transformer LM：token ID 经 embedding、4 个 pre-norm block、final RMSNorm 和 LM head 变成 logits，右侧标出每一步的 shape 和 parameter 数');
}

// 第 3 站：GPT-2 XL 大小的 model，context 1024 与 16384 的 FLOPs 分布
function flops() {
  const parts = ['Q, K, V projection', 'Output projection', 'QKᵀ 与乘 V', 'SwiGLU FFN', 'LM head'];
  const cls = ['wash', 'wash2', 'solid', 'wash-strong', 'paper'];
  const tcls = ['t', 't', 'tw', 't', 't'];
  const data = [
    { T: 'T = 1024', v: [21.5, 7.2, 9.2, 57.5, 4.7], tot: '3.52 × 10¹²' },
    { T: 'T = 16384', v: [9.0, 3.0, 61.7, 24.2, 2.0], tot: '1.34 × 10¹⁴' },
  ];
  const x0 = 100, W = 330;
  let o = '';
  data.forEach((row, r) => {
    const y = 32 + r * 64;
    let x = x0;
    o += text(x0 - 10, y + 24, row.T, 'tb', 'end');
    row.v.forEach((p, i) => {
      const w = (W * p) / 100;
      o += rect(x, y, w, 36, cls[i]);
      if (p >= 10) o += text(x + w / 2, y + 23, p.toFixed(1) + '%', tcls[i], 'middle');
      else if (i === 2) o += text(x + w / 2, y - 6, p.toFixed(1) + '%', 'tl', 'middle');
      x += w;
    });
    o += rect(x0, y, W, 36, 'frame');
    o += text(x0 + W + 10, y + 16, '合计', 'ts') + text(x0 + W + 10, y + 32, row.tot, 't');
  });
  // 图例
  parts.forEach((p, i) => {
    const col = i % 3, rw = Math.floor(i / 3);
    const x = 30 + col * 175, y = 172 + rw * 24;
    o += rect(x, y - 11, 14, 14, cls[i]) + rect(x, y - 11, 14, 14, 'frame') + text(x + 20, y, p, 'ts');
  });
  o += text(30, 226, '与 T 成正比的项放大 16 倍，T² 项放大 256 倍，合计 38 倍', 'ts');
  return svg(560, 236, o, 'GPT-2 XL 大小的 model 一次 forward 的 FLOPs 分布：context 1024 时 FFN 占 57.5%，attention 的 T² 项占 9.2%；context 16384 时 attention 的 T² 项升到 61.7%');
}

// 第 4 站：warmup + cosine learning rate schedule
function lr() {
  const f = (t) => {
    const amax = 1e-3, amin = 1e-4, Tw = 500, Tc = 10000;
    if (t < Tw) return (t / Tw) * amax;
    if (t <= Tc) return amin + 0.5 * (1 + Math.cos(((t - Tw) / (Tc - Tw)) * Math.PI)) * (amax - amin);
    return amin;
  };
  const sx = lin(0, 11000, 70, 530), sy = lin(0, 1.12e-3, 210, 24);
  let o = axes({ sx, sy, x0: 0, x1: 11000, y0: 0, y1: 1.12e-3, xt: [[0, '0'], [2500, '2500'], [5000, '5000'], [7500, '7500'], [10000, '10000']], yt: [[2e-4, '2e-4'], [5e-4, '5e-4'], [1e-3, '1e-3']], grid: true });
  o += line(sx(0), sy(1e-4), sx(11000), sy(1e-4), 'dash') + text(sx(1200), sy(1e-4) - 6, 'α_min = 1e-4', 'ts');
  o += path(curve(f, 0, 11000, sx, sy, 600), 'ln');
  const pts = [[250, '(250, 5e-4)', 8, 4, 'start'], [500, '(500, 1e-3)', 8, -6, 'start'], [5250, '(5250, 5.5e-4)', 8, -6, 'start'], [10000, 'T_c = 10000', 0, -12, 'middle']];
  for (const [t, s, dx, dy, a] of pts) o += circle(sx(t), sy(f(t)), 4, 'ln-f') + text(sx(t) + dx, sy(f(t)) + dy, s, 'ts', a);
  o += text(sx(900), sy(3e-4), '前 500 步是 warmup', 'ts');
  o += text(530, 254, 'step t', 'ts', 'end') + text(70, 14, 'learning rate', 'ts');
  return svg(560, 262, o, 'Learning rate 在前 500 步从 0 linear 地升到 1e-3，之后沿 cosine curve在第 10000 步降到 1e-4，此后保持不变');
}

// 第 5 站：H100 roofline
function roofline() {
  const peak = 989.5e12, bw = 3.35e12;
  const sx = logx(0.1, 3000, 80, 530), sy = logx(1e11, 3e15, 230, 24);
  const r = (I) => Math.min(peak, bw * I);
  let o = '';
  for (const v of [0.1, 1, 10, 100, 1000]) o += line(sx(v), sy(1e11), sx(v), sy(3e15), 'grid') + text(sx(v), 247, String(v), 'ts', 'middle');
  for (const [v, s] of [[1e11, '10¹¹'], [1e12, '10¹²'], [1e13, '10¹³'], [1e14, '10¹⁴'], [1e15, '10¹⁵']]) o += line(sx(0.1), sy(v), sx(3000), sy(v), 'grid') + text(74, sy(v) + 4, s, 'ts', 'end');
  o += line(sx(0.1), sy(1e11), sx(3000), sy(1e11), 'axis') + line(sx(0.1), sy(1e11), sx(0.1), sy(3e15), 'axis');
  const pts = [];
  for (let i = 0; i <= 200; i++) { const I = 0.1 * Math.pow(30000, i / 200); pts.push([sx(I), sy(r(I))]); }
  o += path(d(pts), 'ln');
  o += line(sx(295), sy(peak), sx(295), sy(1e11), 'dash') + text(sx(295) + 5, 222, '295', 'tl');
  const ops = [
    [0.25, 'ReLU', 'end', -8, -6],
    [1, 'XW, B = 1', 'start', 8, 14],
    [62, 'XW, B = 64', 'end', -8, -2],
    [341, 'n × n matmul', 'end', -8, -10],
    [683, 'B = 1024', 'start', 6, -10],
  ];
  for (const [I, s, a, dx, dy] of ops) o += circle(sx(I), sy(r(I)), 4.5, 'ink-f') + text(sx(I) + dx, sy(r(I)) + dy, s, 'ts', a);
  o += text(sx(1.2), sy(2e14), 'memory-bound', 'tb') + text(sx(1.2), sy(2e14) + 16, 'slope = 3.35 TB/s', 'ts');
  o += text(526, sy(peak) + 26, 'compute-bound', 'tb', 'end') + text(526, sy(peak) + 44, '989.5 TFLOP/s', 'ts', 'end');
  o += text(530, 266, 'arithmetic intensity（FLOP / byte，log scale）', 'ts', 'end') + text(80, 14, '能达到的 FLOP/s（log scale）', 'ts');
  return svg(560, 274, o, 'H100 的 roofline：arithmetic intensity 低于 295 时 FLOP/s 与 intensity 成正比，高于 295 时停在 989.5 TFLOP/s；ReLU 和 batch 为 1 的 matrix-vector 乘法远在左侧');
}

// 第 5 站：FlashAttention-2 forward 的 tiling
function flash() {
  const n = 4, s = 42, gx = 150, gy = 62;
  // Q₂ 这一行用正文 online softmax 的例子：score (1, 2, 3, 0)，value (10, 20, 30, 40)，每块 1 个 key
  const sc = [1, 2, 3, 0], vv = [10, 20, 30, 40], acc = [];
  let m = -Infinity, l = 0, O = 0;
  for (let j = 0; j < n; j++) { const m2 = Math.max(m, sc[j]), f = m === -Infinity ? 0 : Math.exp(m - m2); l = f * l + Math.exp(sc[j] - m2); O = f * O + Math.exp(sc[j] - m2) * vv[j]; m = m2; acc.push([m, l, O]); }
  // 帧 p：0 = 四块都处理完（静态图）；1 = 开始；2..5 = 处理 K₁…K₄；6 = 输出
  const dur = [3.2, 1.2, 1.7, 1.7, 1.7, 1.7, 2.2], T = dur.reduce((a, b) => a + b, 0);
  const kt = [0]; for (let k = 0; k < dur.length - 1; k++) kt.push(kt[k] + dur[k] / T);
  const P = dur.map((_, k) => k);
  const g = (body, on) => `<g>${body}${ashow(P.map(on), kt, T)}</g>`;
  const cur = (p) => (p >= 2 && p <= 5 ? p - 2 : -1);              // 正在处理的 j
  const done = (j, p) => p === 0 || p === 6 || (p >= 2 && j < p - 2);
  let o = '';
  for (let j = 0; j < n; j++) {
    const x = gx + j * s + 2, lab = 'K' + '₁₂₃₄'[j];
    o += rect(x, 24, s - 4, 26, 'wash2', 3) + text(x + s / 2 - 2, 42, lab, 'ts', 'middle');
    o += g(rect(x, 24, s - 4, 26, 'solid', 3) + text(x + s / 2 - 2, 42, lab, 'tw', 'middle'), (p) => cur(p) === j);
  }
  o += text(gx - 8, 42, 'Kᵀ', 'ts', 'end');
  for (let i = 0; i < n; i++) o += rect(96, gy + i * s + 2, 40, s - 4, i === 1 ? 'wash-strong' : 'wash2', 3) + text(116, gy + i * s + s / 2 + 5, 'Q' + '₁₂₃₄'[i], 't', 'middle');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = gx + j * s + 1, y = gy + i * s + 1;
    o += rect(x, y, s - 2, s - 2, 'paper', 2);
    if (i === 1) {
      o += g(rect(x, y, s - 2, s - 2, 'wash', 2) + text(x + s / 2 - 1, y + s / 2 + 4, 's = ' + sc[j], 'ts', 'middle'), (p) => done(j, p));
      o += g(rect(x, y, s - 2, s - 2, 'solid', 2) + text(x + s / 2 - 1, y + s / 2 + 4, 's = ' + sc[j], 'tw', 'middle'), (p) => cur(p) === j);
    }
  }
  o += text(gx + (n * s) / 2, gy + n * s + 20, 'Q₂ 这一行：j = 1 … 4 依次读入 Kⱼ、Vⱼ', 'ts', 'middle');
  // 累加量的读数
  const Y = gy + n * s + 46, f2 = (v) => v.toFixed(v >= 10 ? 2 : 3);
  o += g(text(gx + (n * s) / 2, Y, '开始：m = −∞，l = 0，O = 0', 't', 'middle'), (p) => p === 1);
  for (let j = 0; j < n; j++) {
    const [mm, ll, OO] = acc[j];
    o += g(text(gx + (n * s) / 2, Y, `读完 K${'₁₂₃₄'[j]}：m = ${mm}，l = ${f2(ll)}，O = ${f2(OO)}`, 'tl', 'middle'), (p) => cur(p) === j);
  }
  o += g(text(gx + (n * s) / 2, Y, `m = 3，l = ${f2(acc[3][1])}，O = ${f2(acc[3][2])}；输出 O / l = ${(acc[3][2] / acc[3][1]).toFixed(2)}`, 'tl', 'middle'), (p) => p === 0 || p === 6);
  o += text(gx + (n * s) / 2, Y + 20, '（score 和 value 取上面 online softmax 的例子，每块 1 个 key）', 'ts', 'middle');
  // SRAM 与 HBM
  o += rect(350, 24, 196, 136, 'wash', 6) + text(360, 44, 'SRAM', 'tb') + text(360, 62, '每个 program instance 一份', 'ts');
  o += text(360, 84, 'Q₂、当前的 Kⱼ 与 Vⱼ', 't') + text(360, 104, 'S 的一小块', 't') + text(360, 124, 'm、l、O₂ 的累加量（fp32）', 't') + text(360, 146, '用完即丢，不写回 HBM', 'ts');
  o += rect(350, 176, 196, 70, 'paper', 6) + text(360, 196, 'HBM', 'tb') + text(360, 216, '读 Q、K、V', 't') + text(360, 236, '只写 O 和每行一个 L', 't');
  return svgA(560, Y + 30, o, '动图：FlashAttention-2 forward。负责 Q2 这一块 query 的 program instance 依次读入 K1 到 K4，每次只在 SRAM 里算 S 的一小块，并更新 m、l、O；读完四块后 m 为 3，l 为 1.553，O 为 40.70，输出 26.21。T 乘 T 的 matrix 从不写入 HBM');
}

// 第 6 站：ZeRO 各级在 8 块卡上每个 parameter 每块卡占的 byte
function zero() {
  const parts = ['bf16 parameter', 'bf16 gradient', 'fp32 master', 'Adam m', 'Adam v'];
  const cls = ['solid', 'wash-strong', 'wash', 'wash2', 'paper'];
  const rows = [
    ['DDP', [2, 2, 4, 2, 2], '12', '6.7B'],
    ['ZeRO-1', [2, 2, 0.5, 0.25, 0.25], '5', '16B'],
    ['ZeRO-2', [2, 0.25, 0.5, 0.25, 0.25], '3.25', '24.6B'],
    ['ZeRO-3', [0.25, 0.25, 0.5, 0.25, 0.25], '1.5', '53.3B'],
  ];
  const x0 = 90, k = 28;
  let o = text(x0, 16, 'byte / parameter / GPU', 'ts') + text(545, 16, '80 GB 能放下', 'ts', 'end');
  rows.forEach(([name, v, tot, cap], r) => {
    const y = 28 + r * 38;
    let x = x0;
    o += text(x0 - 10, y + 19, name, 'tb', 'end');
    v.forEach((b, i) => { o += rect(x, y, b * k, 26, cls[i]) + rect(x, y, b * k, 26, 'frame'); x += b * k; });
    o += text(x + 8, y + 18, tot, 't') + text(545, y + 18, cap, 't', 'end');
  });
  parts.forEach((p, i) => {
    const x = 30 + i * 106, y = 196;
    o += rect(x, y - 11, 14, 14, cls[i]) + rect(x, y - 11, 14, 14, 'frame') + text(x + 19, y, p, 'ts');
  });
  return svg(560, 210, o, '8 块卡上，DDP 每块卡每个 parameter 存 12 byte；ZeRO-1 切开 optimizer state 后是 5 byte，ZeRO-2 再切 gradient 是 3.25 byte，ZeRO-3 全部切开是 1.5 byte');
}

// 第 6 站：4 个 stage、4 个 microbatch 的 pipeline schedule
function pipe() {
  const p = 4, m = 4, slots = 2 * (m + p - 1), x0 = 70, w = 33, h = 30, y0 = 34;
  // 帧：先停在画满的样子（静态图），再从空的开始一格一格往右走
  const R = [slots, 0]; const ts = [0, 3.2];
  for (let t = 1; t <= slots; t++) { R.push(t); ts.push(3.2 + 0.9 + 0.55 * (t - 1)); }
  const T = ts[ts.length - 1] + 2.2, kt = ts.map((t) => t / T);
  const g = (body, on) => `<g>${body}${ashow(R.map(on), kt, T)}</g>`;
  const busy = Array.from({ length: slots }, () => 0);
  let o = '';
  for (let s = 1; s <= p; s++) {
    const y = y0 + (s - 1) * (h + 6);
    o += text(x0 - 8, y + 20, 'GPU ' + s, 'ts', 'end');
    const work = {};
    for (let k = 1; k <= m; k++) {
      const tf = s - 1 + k - 1, tb = m + p - 1 + (p - s) + (m - k);
      work[tf] = rect(x0 + tf * w + 1, y, w - 2, h, 'wash-strong', 2) + text(x0 + tf * w + w / 2, y + 20, 'F' + k, 't', 'middle');
      work[tb] = rect(x0 + tb * w + 1, y, w - 2, h, 'solid', 2) + text(x0 + tb * w + w / 2, y + 20, 'B' + k, 'tw', 'middle');
      busy[tf]++; busy[tb]++;
    }
    for (let t = 0; t < slots; t++) {
      o += rect(x0 + t * w + 1, y, w - 2, h, 'paper', 2);
      o += g(work[t] || rect(x0 + t * w + 1, y, w - 2, h, 'wash2', 2), (r) => r > t);
    }
  }
  const cx = R.map((r) => f1(x0 + r * w));
  o += `<line x1="${cx[0]}" y1="${y0 - 6}" x2="${cx[0]}" y2="${y0 + p * (h + 6)}" class="ln">${anim('x1', cx, kt, T, true)}${anim('x2', cx, kt, T, true)}</line>`;
  const yb = y0 + p * (h + 6) + 6;
  o += arrow(x0, yb, x0 + slots * w, yb, 'mute') + text(x0 + slots * w, yb + 16, 'time', 'ts', 'end');
  o += text(x0, 20, 'F：forward；B：backward；灰色：bubble（这里设 forward 与 backward 一样长）', 'ts');
  o += g(text(x0, yb + 34, '每块卡 14 格里有 8 格在算：m / (m + p − 1) = 4 / 7', 'ts'), (r) => r === slots);
  for (let t = 1; t < slots; t++) o += g(text(x0, yb + 34, `第 ${t} 格：${busy[t - 1]} 块卡在算，${p - busy[t - 1]} 块在等`, busy[t - 1] < p ? 'tl' : 't'), (r) => r === t);
  return svgA(560, 228, o, '动图：4 个 stage 和 4 个 microbatch 的 pipeline schedule 一格一格展开：forward 依次流过 4 块卡，backward 反向流回，开头和中间每块卡都有空等的 bubble，每块卡在 14 个时间格里只有 8 格在计算');
}

// 第 7 站：A3 的 IsoFLOP 数据与拟合
const ISO = {
  6e18: [[49999999, 7.1928], [78730505, 6.7502], [123969849, 6.4066], [195204177, 6.1544], [307370470, 5.9878], [483988649, 5.9034], [762093419, 5.8999], [1200000000, 5.9779]],
  1e19: [[83333333, 6.5751], [131217508, 6.2208], [206616415, 5.953], [325340296, 5.7656], [512284118, 5.6546], [806647749, 5.6179], [1270155698, 5.6553], [2000000000, 5.7683]],
  3e19: [[249999999, 5.56], [393652526, 5.3509], [619849246, 5.2075], [976020888, 5.1268], [1536852354, 5.1072], [2419943249, 5.1488], [3810467096, 5.2532], [6000000000, 5.4237]],
  6e19: [[499999999, 5.0893], [787305053, 4.9476], [1239698493, 4.8619], [1952041776, 4.8306], [3073704708, 4.8534], [4839886498, 4.9313], [7620934193, 5.0668], [12000000000, 5.264]],
  1e20: [[833333333, 4.807], [1312175088, 4.7056], [2066164155, 4.6545], [3253402960, 4.6529], [5122841181, 4.7011], [8066477497, 4.8008], [12701556988, 4.955], [20000000000, 5.1681]],
  3e20: [[249999999, 5.2059], [423453495, 4.8955], [717251449, 4.6574], [1214890532, 4.4841], [2057798568, 4.3706], [3485527984, 4.3134], [5903836027, 4.3112], [10000000000, 4.3646]],
  6e20: [[499999999, 4.7352], [846906990, 4.502], [1434502899, 4.3285], [2429781065, 4.2092], [4115597137, 4.1407], [6971055968, 4.1212], [11807672055, 4.1506], [20000000000, 4.2303]],
  1e21: [[833333333, 4.4529], [1411511650, 4.266], [2390838165, 4.1311], [4049635109, 4.0442], [6859328563, 4.0028], [11618426614, 4.006], [19679453425, 4.0542], [33333333333, 4.1498]],
  3e21: [[2499999999, 3.9889], [4234534950, 3.8781], [7172514497, 3.8069], [12148905329, 3.7732], [20577985689, 3.7762], [34855279842, 3.8165], [59038360277, 3.8959], [100000000000, 4.0174]],
};
function isoflop() {
  let o = '';
  // 左：loss vs N
  const sx = lin(7.6, 11.1, 50, 270), sy = lin(3.6, 7.3, 220, 30);
  o += axes({ sx, sy, x0: 7.6, x1: 11.1, y0: 3.6, y1: 7.3, xt: [[8, '10⁸'], [9, '10⁹'], [10, '10¹⁰'], [11, '10¹¹']], yt: [[4, '4'], [5, '5'], [6, '6'], [7, '7']], grid: true });
  const best = [];
  for (const [C, runs] of Object.entries(ISO)) {
    o += path(d(runs.map(([n, l]) => [sx(Math.log10(n)), sy(l)])), 'mute');
    const b = runs.reduce((a, r) => (r[1] < a[1] ? r : a));
    best.push([+C, b[0]]);
    o += circle(sx(Math.log10(b[0])), sy(b[1]), 3.5, 'ln-f');
  }
  o += text(sx(7.8) + 6, sy(7.25), 'C = 6 × 10¹⁸', 'ts');
  o += text(sx(7.7), sy(3.86), 'C = 3 × 10²¹', 'ts') + line(sx(7.7) + 84, sy(3.9), sx(9.38), sy(3.98), 'mute');
  o += text(160, 262, 'parameter N（log scale）', 'ts', 'middle') + text(50, 18, 'final loss', 'ts');
  // 右：N_opt vs C
  const rx = lin(18.6, 22.2, 340, 540), ry = lin(8.6, 10.6, 220, 30);
  o += axes({ sx: rx, sy: ry, x0: 18.6, x1: 22.2, y0: 8.6, y1: 10.6, xt: [[19, '10¹⁹'], [20, '10²⁰'], [21, '10²¹'], [22, '10²²']], yt: [[9, '10⁹'], [10, '10¹⁰']], grid: true });
  const a = 0.4687, b = 0.0657;
  o += line(rx(18.6), ry(a * 18.6 + b), rx(21.48), ry(a * 21.48 + b), 'ln') + line(rx(21.48), ry(a * 21.48 + b), rx(22), ry(a * 22 + b), 'ln-dash');
  for (const [C, N] of best) o += circle(rx(Math.log10(C)), ry(Math.log10(N)), 3.5, 'ink-f');
  o += circle(rx(22), ry(a * 22 + b), 4.5, 'ln paper-f') + text(rx(22) - 6, ry(a * 22 + b) - 10, 'extrapolate：2.38 × 10¹⁰', 'tl', 'end');
  o += text(rx(18.75), ry(10.15), 'N = 1.16 × C⁰·⁴⁶⁹', 'tb');
  o += text(440, 262, 'compute C（FLOP，log scale）', 'ts', 'middle') + text(340, 18, '最优 N', 'ts');
  return svg(560, 272, o, '左图是 A3 数据里九条 IsoFLOP curve，每条的最低点标为彩色；右图把最低点的 N 对 compute 画在 log-log 的 axis 上，fit 出的 line 是 N 等于 1.16 乘 C 的 0.469 power，虚线 extrapolate 到 10 的 22 power');
}

// 第 8 站：Llama 2 13B 在 H100 上的 decode throughput，MHA 与 GQA
function kv() {
  const V = 32000, D = 5120, F = 13824, N = 40, H = 128, L = 40, S = 1024, bw = 3.35e12;
  const stat = (B, K) => {
    const P = 2 * V * D + D * F * 3 * L + (2 * D * N * H + 2 * D * K * H) * L;
    const mem = B * S * K * H * L * 2 * 2 + 2 * P;
    return { mem, thr: B / (mem / bw) };
  };
  const Bs = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  const sx = lin(0, 8, 80, 500), sy = lin(0, 14000, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 8, y0: 0, y1: 14000, xt: Bs.map((b, i) => [i, String(b)]), yt: [[4000, '4000'], [8000, '8000'], [12000, '12000']], grid: true });
  for (const [K, cls, fcls, lab] of [[40, 'ink', 'ink-f', 'MHA（40 组 KV head）'], [8, 'ln', 'ln-f', 'GQA（8 组 KV head）']]) {
    const pts = Bs.map((B, i) => [sx(i), sy(stat(B, K).thr)]);
    o += path(d(pts), cls);
    Bs.forEach((B, i) => {
      const s = stat(B, K);
      o += circle(sx(i), sy(s.thr), 4, s.mem > 80e9 ? cls + ' paper-f' : fcls);
    });
    const last = stat(256, K);
    o += text(sx(8) + 6, sy(last.thr) + 4, K === 40 ? 'MHA' : 'GQA', K === 40 ? 'tb' : 'tl');
  }
  o += text(sx(0.2), sy(12500), '空心点：memory 超过 80 GB', 'ts');
  o += text(sx(0.2), sy(11300), 'MHA 每 token KV cache 0.78 MiB，GQA 0.16 MiB', 'ts');
  o += text(500, 256, 'batch size B（log scale）', 'ts', 'end') + text(80, 18, 'throughput（token/s）', 'ts');
  return svg(560, 266, o, 'Llama 2 13B 在 H100 上 decode 的理论 throughput 随 batch size 增长；GQA 的 KV cache 小 5 倍，同样的 batch 下 throughput 更高，并且 batch 256 仍放得进 80 GB，MHA 从 batch 128 起就放不下');
}

// 第 9 站：LSH 的候选概率曲线
function lsh() {
  const sx = lin(0, 1, 70, 400), sy = lin(0, 1, 220, 24);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [[0, '0'], [0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6'], [0.8, '0.8'], [1, '1']], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  o += path(curve((s) => s, 0, 1, sx, sy), 'dash');
  const P = (b, r) => (s) => 1 - Math.pow(1 - Math.pow(s, r), b);
  const cs = [[10, 10, 'ink', 'ink-f'], [20, 20, 'ln', 'ln-f'], [10, 20, 'ink-b', 'ink-f']];
  for (const [b, r, cls] of cs) o += path(curve(P(b, r), 0, 1, sx, sy, 400), cls);
  // 标注放在右侧，引线指向各自的阈值点
  const lab = [[10, 10, '(10, 10)：0.794', 70], [20, 20, '(20, 20)：0.861', 110], [10, 20, '(10, 20)：0.891', 150]];
  o += text(416, 44, '(b, r)：threshold', 'tb');
  for (const [b, r, s, y] of lab) {
    const t = Math.pow(1 / b, 1 / r), px = sx(t), py = sy(P(b, r)(t));
    o += circle(px, py, 3.5, 'ink-f') + line(px + 4, py, 412, y - 4, 'mute') + text(416, y, s, 'ts');
  }
  o += text(sx(0.06), sy(0.55), '单个 MinHash：P = s', 'ts');
  o += text(400, 256, 'Jaccard similarity s', 'ts', 'end') + text(70, 16, '成为候选的 probability', 'ts');
  return svg(560, 266, o, '三组 band 设置下两个文档成为候选的 probability 随 Jaccard similarity 变化的 S 形 curve；r 越大 curve 越靠右越陡，b 越大越靠左；虚线是单个 MinHash 的 collision probability');
}

// 第 10 站：PPO 式 clipping 的 objective
function clip() {
  const eps = 0.2;
  let o = '';
  const panel = (x0, A, title) => {
    const sx = lin(0, 2, x0, x0 + 210), sy = lin(-2, 2, 210, 40);
    o += line(sx(0), sy(0), sx(2), sy(0), 'axis') + line(sx(0), sy(-2), sx(0), sy(2), 'axis');
    for (const v of [0.8, 1.2]) o += line(sx(v), sy(-2), sx(v), sy(2), 'grid');
    o += text(sx(0.8), 226, '0.8', 'ts', 'middle') + text(sx(1.2), 226, '1.2', 'ts', 'middle') + text(sx(2), 226, '2', 'ts', 'middle');
    o += text(sx(0) - 5, sy(1) + 4, '1', 'ts', 'end') + text(sx(0) - 5, sy(-1) + 4, '−1', 'ts', 'end') + text(sx(0) - 5, sy(0) + 4, '0', 'ts', 'end');
    const f = (w) => Math.min(w * A, Math.max(Math.min(w, 1 + eps), 1 - eps) * A);
    if (A > 0) {
      o += path(curve(f, 0, 1.2, sx, sy, 60), 'ln') + path(curve(f, 1.2, 2, sx, sy, 60), 'ln-dash');
      o += text(sx(2), sy(1.2) - 12, '超过 1 + ε：无 gradient', 'ts', 'end');
    } else {
      o += path(curve(f, 0, 0.8, sx, sy, 60), 'ln-dash') + path(curve(f, 0.8, 2, sx, sy, 60), 'ln');
      o += text(sx(0.05), sy(-0.8) - 10, '低于 1 − ε：无 gradient', 'ts');
      o += text(sx(0.05), sy(-1.92), '右侧实线：坏 token 照常受罚', 'ts');
    }
    o += text(x0 + 105, 22, title, 'tb', 'middle');
  };
  panel(50, 1, 'A = +1');
  panel(320, -1, 'A = −1');
  o += text(280, 250, '横轴是 importance ratio w = π_θ / π_old，纵轴是 min(wA, clip(w, 0.8, 1.2) A)', 'ts', 'middle');
  return svg(560, 260, o, 'PPO 式 clipping：advantage 为正时 ratio 超过 1.2 后 objective 变平、gradient 为零；advantage 为负时 ratio 低于 0.8 时变平，ratio 增大的一侧不截断');
}

// 第 1 站：Sennrich 例子的前 12 次 merge（并列时取 lexicographically greater 的 pair）
function bpemerges() {
  const words = [['low', 5], ['lower', 2], ['widest', 3], ['newest', 6]];
  let seg = words.map(([w]) => w.split(''));
  const merges = [], snaps = { 0: seg.map((t) => t.slice()) };
  const greater = (a, b) => (a[0] !== b[0] ? a[0] > b[0] : a[1] > b[1]);
  for (let k = 1; k <= 12; k++) {
    const cnt = new Map();
    seg.forEach((t, i) => { for (let j = 0; j + 1 < t.length; j++) { const key = t[j] + '\u0000' + t[j + 1]; cnt.set(key, (cnt.get(key) || 0) + words[i][1]); } });
    let best = null, bc = -1;
    for (const [key, c] of cnt) { const pr = key.split('\u0000'); if (c > bc || (c === bc && greater(pr, best))) { best = pr; bc = c; } }
    merges.push(best);
    seg = seg.map((t) => { const o = []; for (let j = 0; j < t.length; j++) { if (j + 1 < t.length && t[j] === best[0] && t[j + 1] === best[1]) { o.push(best[0] + best[1]); j++; } else o.push(t[j]); } return o; });
    snaps[k] = seg.map((t) => t.slice());
  }
  const cw = 15, X0 = 96, gap = 22, xs = [];
  let x = X0;
  for (const [w] of words) { xs.push(x); x += w.length * cw + gap; }
  let o = '';
  words.forEach(([w, c], i) => { o += text(xs[i], 20, `${w} ×${c}`, 'tb'); });
  [0, 2, 4, 6, 9, 12].forEach((k, r) => {
    const y = 34 + r * 38;
    o += text(10, y + 17, `${k} 次 merge`, 't');
    let total = 0;
    snaps[k].forEach((toks, i) => {
      let xx = xs[i];
      total += toks.length * words[i][1];
      for (const t of toks) {
        const wd = t.length * cw;
        o += rect(xx + 1, y, wd - 2, 26, t.length > 1 ? 'wash' : 'paper', 3);
        o += text(xx + wd / 2, y + 17, t, t.length > 1 ? 'tb' : 't', 'middle');
        xx += wd;
      }
    });
    o += text(548, y + 17, `${total}`, r === 5 ? 'tl' : 't', 'end');
  });
  o += text(548, 20, 'token 数', 'ts', 'end');
  const yl = 34 + 6 * 38 + 8;
  const ms = merges.map((m, i) => `${i + 1} (${m[0]}, ${m[1]})`);
  o += text(10, yl, 'merge 顺序：' + ms.slice(0, 6).join('  '), 'ts') + text(10, yl + 18, '　　　　　' + ms.slice(6).join('  '), 'ts');
  return svg(560, yl + 28, o, 'Sennrich 例子在 0、2、4、6、9、12 次 merge 之后的切分，token 总数从 79 降到 ' + (snaps[12].reduce((a, t, i) => a + t.length * words[i][1], 0)));
}

// 第 2 站：RoPE 每一对 dimension 的转速
function rope() {
  const dk = 32, rate = (k) => 10000 ** (-(2 * k - 2) / dk);
  let o = '';
  // 左：第 1、2 对在位置 0..6 的角度
  const cx = 130, cy = 150, R1 = 100, R2 = 62;
  o += text(20, 22, '位置 i = 0…6 时每一对转到的角度', 'tb');
  o += circle(cx, cy, R1, 'grid') + circle(cx, cy, R2, 'grid') + line(cx - R1 - 8, cy, cx + R1 + 8, cy, 'grid') + line(cx, cy - R1 - 8, cx, cy + R1 + 8, 'grid');
  for (const [k, R, cls, tcls] of [[1, R1, 'ln-f', 'tl'], [2, R2, 'ink-f', 'ts']]) {
    for (let i = 0; i <= 6; i++) {
      const a = i * rate(k), px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
      o += circle(px, py, 3.5, cls);
      const lx = cx + (R + (k === 1 ? 13 : -12)) * Math.cos(a), ly = cy - (R + (k === 1 ? 13 : -12)) * Math.sin(a) + 4 - (i === 0 ? 9 : 0);
      o += text(lx, ly, String(i), tcls, 'middle');
    }
  }
  o += text(cx, cy + R1 + 30, 'k = 1：每个 token 转 1 rad（外圈）', 'tl', 'middle');
  o += text(cx, cy + R1 + 47, `k = 2：每个 token 转 ${rate(2).toFixed(3)} rad（内圈）`, 'ts', 'middle');
  // 右：转一圈要多少个 token（log scale）
  const sx = lin(1, 16, 330, 530), sy = lin(0, 5, 250, 50);
  o += text(300, 22, '转一圈要多少个 token', 'tb');
  for (let e = 0; e <= 5; e++) o += line(sx(1), sy(e), sx(16), sy(e), 'grid') + text(322, sy(e) + 4, ['1', '10', '100', '1k', '10k', '100k'][e], 'ts', 'end');
  o += line(sx(1), sy(0), sx(16), sy(0), 'axis');
  for (const k of [1, 4, 8, 12, 16]) o += text(sx(k), sy(0) + 16, String(k), 'ts', 'middle');
  o += text(sx(16), sy(0) + 32, 'pair k', 'ts', 'end');
  const pts = [];
  for (let k = 1; k <= 16; k++) pts.push([sx(k), sy(Math.log10(2 * Math.PI / rate(k)))]);
  o += path(d(pts), 'mute');
  pts.forEach(([px, py]) => { o += circle(px, py, 3, 'ln-f'); });
  o += text(pts[0][0] + 8, pts[0][1] + 4, (2 * Math.PI).toFixed(1), 'tl', 'start');
  o += text(pts[15][0] - 8, pts[15][1] - 2, Math.round(2 * Math.PI / rate(16)).toLocaleString('en-US'), 'tl', 'end');
  return svg(560, 300, o, 'RoPE：第 1 对 dimension 每个 token 转 1 rad，6.3 个 token 转一圈；第 16 对要约 35000 个 token 才转一圈');
}

// 第 5 站：wave quantization，A100 108 个 SM，tile 256 × 128
function wave() {
  const SM = 108, th = 256, tw = 128, px = 16 / tw; // 每个 element 的像素
  let o = '';
  const panel = (x0, n, title) => {
    const R = Math.ceil(n / th), C = Math.ceil(n / tw), tot = R * C;
    o += text(x0, 22, title, 'tb') + text(x0, 40, `${R} × ${C} = ${tot} 块`, 'ts');
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
      const idx = r * C + c, second = idx >= SM;
      o += rect(x0 + c * tw * px + 1, 52 + r * th * px + 1, tw * px - 2, th * px - 2, second ? 'solid' : 'wash');
    }
    o += rect(x0, 52, n * px, n * px, 'frame');
    const waves = Math.ceil(tot / SM);
    return { R, C, tot, waves, last: tot - (waves - 1) * SM };
  };
  const a = panel(20, 1792, '1792 × 1792');
  const b = panel(300, 1793, '1793 × 1793');
  const yb = 52 + 8 * 32 + 22;
  o += text(20, yb, `${a.waves} 轮：${a.tot} 块 ≤ ${SM} 个 SM`, 't');
  o += text(300, yb, `${b.waves} 轮：${SM} 块，再单独跑 ${b.last} 块`, 'tl');
  o += text(280, yb + 22, '浅色：第一轮；深色：第二轮，这时 108 个 SM 里只有 12 个在干活。', 'ts', 'middle');
  o += text(280, yb + 40, '外框是 matrix 的实际大小：1793 只比 1792 多 1，却多出一整行和一整列 tile。', 'ts', 'middle');
  return svg(560, yb + 50, o, 'A100 上 256×128 的 tile：1792 的 matmul 切成 98 块一轮做完；1793 切成 120 块，要两轮，第二轮只有 12 块');
}

// 第 5 站：online softmax 分两段读一行
function online() {
  const s = [1, 2, 3, 0], v = [10, 20, 30, 40];
  let m = -Infinity, l = 0, O = 0;
  const st = [];
  for (const [a, b] of [[0, 2], [2, 4]]) {
    const mn = Math.max(m, ...s.slice(a, b)), sc = Math.exp(m - mn);
    let ln = sc * l, On = sc * O;
    for (let i = a; i < b; i++) { ln += Math.exp(s[i] - mn); On += Math.exp(s[i] - mn) * v[i]; }
    st.push({ m: mn, l: ln, O: On, sc }); m = mn; l = ln; O = On;
  }
  const Z = s.reduce((a2, x) => a2 + Math.exp(x), 0), direct = s.reduce((a2, x, i) => a2 + Math.exp(x) / Z * v[i], 0);
  let o = '';
  const cx = (i) => 150 + i * 70 + (i >= 2 ? 30 : 0);
  o += text(20, 50, 'score s', 'tb') + text(20, 84, 'value v', 'tb');
  for (let i = 0; i < 4; i++) {
    o += rect(cx(i) - 26, 32, 52, 26, 'paper', 3) + text(cx(i), 50, String(s[i]), 't', 'middle');
    o += rect(cx(i) - 26, 66, 52, 26, 'paper', 3) + text(cx(i), 84, String(v[i]), 't', 'middle');
  }
  o += rect(cx(0) - 34, 24, cx(1) - cx(0) + 68, 76, 'frame', 6) + text((cx(0) + cx(1)) / 2, 18, '第一段', 'ts', 'middle');
  o += rect(cx(2) - 34, 24, cx(3) - cx(2) + 68, 76, 'frame', 6) + text((cx(2) + cx(3)) / 2, 18, '第二段', 'ts', 'middle');
  const box = (x, y, t, a1) => {
    o += rect(x, y, 170, 82, 'wash', 6) + text(x + 12, y + 20, t, 'tb');
    o += text(x + 12, y + 42, `m = ${a1.m}`, 't') + text(x + 12, y + 60, `l = ${a1.l.toFixed(3)}`, 't') + text(x + 12, y + 78 - 2, `O = ${a1.O.toFixed(2)}`, 't');
  };
  const b1 = 50, b2 = 340;
  box(b1, 124, '读完第一段', st[0]);
  box(b2, 124, '读完第二段', st[1]);
  const x1 = b1 + 170, x2 = b2;
  o += arrow(x1 + 6, 165, x2 - 6, 165, 'ln');
  o += text((x1 + x2) / 2, 154, '× e^(2 − 3)', 'tl', 'middle') + text((x1 + x2) / 2, 184, `= ${st[1].sc.toFixed(3)}`, 'tl', 'middle');
  o += line((cx(0) + cx(1)) / 2, 100, b1 + 85, 124, 'mute') + line((cx(2) + cx(3)) / 2, 100, b2 + 85, 124, 'mute');
  o += text(280, 236, `O / l = ${st[1].O.toFixed(2)} / ${st[1].l.toFixed(3)} = ${(st[1].O / st[1].l).toFixed(2)}；整行一次做 softmax 再加权：${direct.toFixed(2)}`, 'tb', 'middle');
  o += text(280, 258, '读到更大的 max 时，旧的 l 和 O 乘 e^(m − m′) 换到新的基准，再加上新一段的项。', 'ts', 'middle');
  return svg(560, 268, o, 'online softmax：score 1,2,3,0 分两段读，第一段后 m=2、l=1.368、O=23.68，第二段后 m=3、l=1.553、O=40.70，O/l=26.21');
}

// 第 6 站：ring all-gather，N = 4
function ring() {
  const N = 4, names = ['A', 'B', 'C', 'D'];
  const C = [[150, 78], [410, 78], [410, 222], [150, 222]], bw = 120, bh = 50; // GPU 0..3 顺时针排成一圈
  const acq = (g, c) => (g - c + N) % N;  // chunk c 在第几步到达 GPU g（0 = 本来就有）
  // 阶段 p：0 = 全部完成（静态图）；1 = 开始；然后每一步 k 两个阶段：传送中（2k）、到达（2k+1）；最后回到完成
  const dur = [3.4, 1.4, 0.9, 1.0, 0.9, 1.0, 0.9, 1.6], T = dur.reduce((a, b) => a + b, 0);
  const kt = [0]; for (let k = 0; k < dur.length - 1; k++) kt.push(kt[k] + dur[k] / T);
  const Pp = dur.map((_, k) => k);
  const g = (body, on) => `<g>${body}${ashow(Pp.map(on), kt, T)}</g>`;
  const owned = (gg, c, p) => p === 0 || (p === 1 ? c === gg : acq(gg, c) <= (p % 2 === 1 ? (p - 1) / 2 : p / 2 - 1));
  const fresh = (gg, c, p) => p >= 3 && p % 2 === 1 && acq(gg, c) === (p - 1) / 2 && acq(gg, c) > 0;
  let o = '';
  // ring 上的四条 link
  const edge = (a, b) => { const [x1, y1] = C[a], [x2, y2] = C[b]; if (y1 === y2) { const sg = Math.sign(x2 - x1); return [x1 + sg * (bw / 2 + 6), y1, x2 - sg * (bw / 2 + 6), y2]; } const sg = Math.sign(y2 - y1); return [x1, y1 + sg * (bh / 2 + 6), x2, y2 - sg * (bh / 2 + 6)]; };
  for (let a = 0; a < N; a++) { const [x1, y1, x2, y2] = edge(a, (a + 1) % N); o += arrow(x1, y1, x2, y2, 'mute'); }
  C.forEach(([x, y], gg) => {
    o += rect(x - bw / 2, y - bh / 2, bw, bh, 'paper', 6) + text(x, gg < 2 ? y - bh / 2 - 8 : y + bh / 2 + 20, 'GPU ' + gg, 'tb', 'middle');
    for (let c = 0; c < N; c++) {
      const sx = x - bw / 2 + 10 + c * 26, sy = y - 13;
      o += rect(sx, sy, 22, 26, 'wash2', 2);
      o += g(rect(sx, sy, 22, 26, 'wash', 2) + text(sx + 11, sy + 18, names[c], 't', 'middle'), (p) => owned(gg, c, p) && !fresh(gg, c, p));
      o += g(rect(sx, sy, 22, 26, 'solid', 2) + text(sx + 11, sy + 18, names[c], 'tw', 'middle'), (p) => fresh(gg, c, p));
    }
  });
  // 传送中的 packet：第 k 步，GPU gg 把 chunk (gg − (k − 1)) 传给 gg + 1
  for (let k = 1; k < N; k++) for (let gg = 0; gg < N; gg++) {
    const c = (gg - (k - 1) + N) % N, [x1, y1, x2, y2] = edge(gg, (gg + 1) % N);
    const t0 = kt[2 * k], t1 = kt[2 * k + 1];
    const xs = [x1, x1, x2, x2].map((v) => f1(v - 11)), ys = [y1, y1, y2, y2].map((v) => f1(v - 13)), kk = [0, t0, t1, 1];
    const on = [0, 1, 0, 0];
    o += `<g>${ashow(on, kk, T)}<rect x="${xs[0]}" y="${ys[0]}" width="22" height="26" rx="2" class="solid">${anim('x', xs, kk, T)}${anim('y', ys, kk, T)}</rect><text x="${f1(x1)}" y="${f1(y1 + 5)}" class="tw" text-anchor="middle">${names[c]}${anim('x', [x1, x1, x2, x2].map(f1), kk, T)}${anim('y', [y1, y1, y2, y2].map((v) => f1(v + 5)), kk, T)}</text></g>`;
  }
  // 状态说明
  const X = 280, Y = 150;
  o += g(text(X, Y - 8, '3 步之后', 'tb', 'middle') + text(X, Y + 12, '每块卡都有 A B C D', 'ts', 'middle'), (p) => p === 0 || p === 7);
  o += g(text(X, Y - 8, '开始', 'tb', 'middle') + text(X, Y + 12, '每块卡只有自己那 1/4', 'ts', 'middle'), (p) => p === 1);
  for (let k = 1; k < N; k++) o += g(text(X, Y - 8, `第 ${k} 步`, 'tl', 'middle') + text(X, Y + 12, k === 1 ? '把自己那段传给下一块' : '把上一步收到的传下去', 'ts', 'middle'), (p) => p === 2 * k || p === 2 * k + 1);
  o += text(280, 286, '每一步四条 link 同时在用，每块卡每步只发 S/N；N − 1 = 3 步，每块卡一共发了 (N − 1)/N · S。', 'ts', 'middle');
  return svgA(560, 296, o, '动图：4 块 GPU 排成一圈做 ring all-gather。开始时每块卡只有自己的一段；每一步每块卡把一段沿 ring 传给下一块，四条 link 同时在用；3 步之后每块卡都有 A、B、C、D');
}


// 第 8 站：静态 batching 与 continuous batching，3 个 slot、5 个请求
function contbatch() {
  const reqs = [
    { id: 'R1', arr: 0, len: 8 }, { id: 'R2', arr: 0, len: 3 }, { id: 'R3', arr: 0, len: 5 },
    { id: 'R4', arr: 2, len: 4 }, { id: 'R5', arr: 4, len: 3 },
  ];
  const S = 3, T = 13;
  // 静态：前 3 个一批，等最长的结束，再开下一批
  const stat = [[], [], []];
  let t0 = 0, queue = reqs.slice();
  while (queue.length) {
    const batch = queue.splice(0, S);
    const start = Math.max(t0, ...batch.map((r) => r.arr));
    batch.forEach((r, k) => stat[k].push({ ...r, s: start, e: start + r.len }));
    t0 = start + Math.max(...batch.map((r) => r.len));
  }
  // continuous：每一步结束时有空 slot 且有已到达的请求就接上
  const cont = [[], [], []], free = [0, 0, 0];
  for (const r of reqs) {
    let k = 0; for (let j = 1; j < S; j++) if (free[j] < free[k]) k = j;
    const st = Math.max(free[k], r.arr);
    cont[k].push({ ...r, s: st, e: st + r.len }); free[k] = st + r.len;
  }
  const cls = { R1: 'wash', R2: 'wash-strong', R3: 'wash', R4: 'solid', R5: 'solid' };
  const tcls = { R1: 't', R2: 't', R3: 't', R4: 'tw', R5: 'tw' };
  const x0 = 86, cw = 34, ch = 24;
  let o = '';
  const panel = (y0, rows, title) => {
    o += text(20, y0 - 30, title, 'tb');
    for (const r of reqs.filter((q) => q.arr > 0)) o += line(x0 + r.arr * cw, y0 - 8, x0 + r.arr * cw, y0 - 1, 'ink') + text(x0 + r.arr * cw + 3, y0 - 10, r.id + ' 到达', 'ts');
    const end = Math.max(...rows.flat().map((r) => r.e));
    for (let k = 0; k < S; k++) {
      const y = y0 + k * (ch + 4);
      o += text(x0 - 8, y + 17, 'slot ' + (k + 1), 'ts', 'end');
      for (let t = 0; t < end; t++) o += rect(x0 + t * cw + 1, y, cw - 2, ch, 'wash2', 2);
      for (const r of rows[k]) {
        o += rect(x0 + r.s * cw + 1, y, r.len * cw - 2, ch, cls[r.id], 3) + text(x0 + (r.s + r.len / 2) * cw, y + 17, r.id, tcls[r.id], 'middle');
      }
    }
    o += line(x0 + end * cw, y0 - 4, x0 + end * cw, y0 + S * (ch + 4), 'ln') + text(x0 + end * cw - 4, y0 + S * (ch + 4) + 10, `第 ${end} 步全部完成`, 'tl', 'end');
    return end;
  };
  const e1 = panel(62, stat, '静态 batching：一批要等最长的 R1 结束');
  const e2 = panel(232, cont, 'Continuous batching：每一步结束都可以换人');
  // 时间轴
  const ya = 232 + S * (ch + 4) + 26;
  for (let t = 0; t <= T; t += 2) o += text(x0 + t * cw, ya, String(t), 'ts', 'middle');
  o += text(x0 + T * cw, ya + 16, 'decode 步数', 'ts', 'end');
  o += text(20, ya + 16, '灰色：slot 空着在等', 'ts');
  const fin = (rows, id) => rows.flat().find((r) => r.id === id).e;
  return svg(560, ya + 26, o, `3 个 slot 服务 5 个请求。静态 batching 下 R4、R5 要等第一批里最长的 R1 在第 8 步结束，全部在第 ${e1} 步完成，R4 第 ${fin(stat, 'R4')} 步完成；continuous batching 下 R4 在 R2 结束后立刻接上，第 ${fin(cont, 'R4')} 步完成，全部在第 ${e2} 步完成`);
}

// 第 8 站：PagedAttention，两个请求共享 system prompt 的 block
function paged() {
  const B = 4; // 每个 block 4 个 token
  const logical = {
    A: [{ fill: 4, shared: true, p: 4 }, { fill: 4, shared: true, p: 1 }, { fill: 4, p: 6 }, { fill: 1, p: 2 }],
    B: [{ fill: 4, shared: true, p: 4 }, { fill: 4, shared: true, p: 1 }, { fill: 3, p: 5 }],
  };
  const tokCls = (b, r) => (b.shared ? 'solid' : r === 'A' ? 'wash-strong' : 'wash');
  const bw = 64, bh = 26, tw = bw / B;
  let o = text(20, 22, '逻辑上：每个请求的 block 连续编号', 'tb') + text(390, 22, '物理 block', 'tb');
  const occ = {};
  ['A', 'B'].forEach((r, i) => {
    const y = 56 + i * 104;
    o += text(20, y + 18, '请求 ' + r, 't');
    logical[r].forEach((b, j) => {
      const x = 78 + j * (bw + 8);
      o += rect(x, y, bw, bh, 'paper', 3);
      for (let k = 0; k < b.fill; k++) o += rect(x + k * tw + 2, y + 4, tw - 4, bh - 8, tokCls(b, r), 2);
      o += text(x + bw / 2, y + bh + 16, 'L' + j + ' → P' + b.p, b.shared ? 'tl' : 'ts', 'middle');
      occ[b.p] = { ...b, r };
    });
  });
  o += text(78, 260, 'L → P 就是 block table：逻辑 block 存在哪个物理 block。', 'ts');
  // 物理 block：8 个排成一列
  const px = 410, py0 = 36, ph = 26;
  for (let p = 0; p < 8; p++) {
    const y = py0 + p * (ph + 5);
    o += text(px - 8, y + 18, 'P' + p, 'ts', 'end');
    o += rect(px, y, bw, ph, 'paper', 3);
    const b = occ[p];
    if (b) {
      for (let k = 0; k < b.fill; k++) o += rect(px + k * tw + 2, y + 4, tw - 4, ph - 8, tokCls(b, b.r), 2);
      o += text(px + bw + 8, y + 18, b.shared ? 'A、B 共用' : '只属于 ' + b.r, b.shared ? 'tl' : 'ts');
    } else o += text(px + bw + 8, y + 18, '空闲', 'ts');
  }
  // 图例
  const ly = 308;
  [['solid', 'system prompt 的 token（共享）'], ['wash-strong', '请求 A 自己的 token'], ['wash', '请求 B 自己的 token']].forEach(([c, t], k) => {
    const x = [20, 240, 404][k];
    o += rect(x, ly - 11, 12, 14, c, 2) + text(x + 18, ly, t, 'ts');
  });
  o += text(20, 332, '只有每个请求最后一个 block 可能没填满，最多浪费 3 个位置；', 'ts') + text(20, 350, '新 token 填满一个 block 之后才再分配下一个。', 'ts');
  return svg(560, 362, o, 'PagedAttention：两个请求的 KV cache 在逻辑上各自连续编号，物理上分散在 8 个 block 里；共享的 system prompt 占两个 block，只存一份，由两个请求的 block table 同时指向');
}

// 第 11 站：一个 token 的 top-2 routing
function moe() {
  const logit = [1.2, 0.3, 2.0, -0.5];
  const ex = logit.map(Math.exp), Z = ex.reduce((a, b) => a + b, 0), s = ex.map((v) => v / Z);
  const order = [0, 1, 2, 3].sort((a, b) => s[b] - s[a]), top = order.slice(0, 2);
  const tot = top.reduce((a, i) => a + s[i], 0);
  let o = '';
  // token
  o += rect(20, 118, 70, 34, 'paper', 6) + text(55, 140, 'token u', 't', 'middle');
  // router bars
  o += text(120, 30, 'router：softmax(uᵀeᵢ)', 'tb');
  const bx = 120, by = 46, bwid = 110;
  s.forEach((v, i) => {
    const y = by + i * 40;
    const on = top.includes(i);
    o += rect(bx, y, bwid, 22, 'wash2', 3) + rect(bx, y, bwid * v, 22, on ? 'solid' : 'mute-f', 3);
    o += text(bx + bwid + 6, y + 16, v.toFixed(3), on ? 'tl' : 'ts');
  });
  o += arrow(92, 135, 116, 120, 'mute');
  // experts
  const ex0 = 290;
  s.forEach((v, i) => {
    const y = by + i * 40, on = top.includes(i);
    o += rect(ex0, y - 2, 92, 26, on ? 'wash-strong' : 'wash2', 5) + text(ex0 + 46, y + 15, 'FFN' + '₁₂₃₄'[i], on ? 'tb' : 'ts', 'middle');
    if (on) o += arrow(bx + bwid + 50, y + 11, ex0 - 4, y + 11, 'ln');
    else o += text(ex0 + 98, y + 15, '不计算', 'ts');
  });
  // sum
  const sx = 470, sy = 120;
  o += circle(sx, sy, 16, 'paper') + text(sx, sy + 5, '+', 'tb', 'middle');
  top.forEach((i) => { const y = by + i * 40 + 11; o += arrow(ex0 + 94, y, sx - 16, sy + (y < sy ? -6 : 6), 'ink'); o += text(ex0 + 140, y + (i === top[0] ? 18 : -6), '× ' + s[i].toFixed(3), 'tl', 'middle'); });
  o += path(d([[55, 154], [55, 230], [sx, 230], [sx, sy + 18]]), 'dash') + text(260, 224, 'residual：+ u', 'ts', 'middle');
  o += arrow(sx + 16, sy, 540, sy, 'ink') + text(540, sy - 8, 'h', 'tb', 'end');
  o += text(20, 262, `top-2 选 FFN₃ 和 FFN₁；gate 先 softmax 再选是 ${s[top[0]].toFixed(3)}、${s[top[1]].toFixed(3)}，`, 'ts');
  o += text(20, 280, `选了再 normalize 是 ${(s[top[0]] / tot).toFixed(3)}、${(s[top[1]] / tot).toFixed(3)}。另外两个 expert 的 parameter 在，但这个 token 不经过它们。`, 'ts');
  return svg(560, 292, o, 'MoE 的 top-2 routing：router 给 4 个 expert 的 probability 是 0.262、0.107、0.583、0.048，只计算 expert 3 和 expert 1，按 gate 加权后加回 residual');
}

// 第 13 站：CLIP 的 3 × 3 logits 与两个方向的 cross-entropy
function clip3() {
  const L = [[4, 1, 0], [1, 3, 1], [0, 2, 3]];
  const lse = (v) => { const m = Math.max(...v); return m + Math.log(v.reduce((a, x) => a + Math.exp(x - m), 0)); };
  const row = L.map((r, i) => lse(r) - r[i]);
  const col = [0, 1, 2].map((j) => lse(L.map((r) => r[j])) - L[j][j]);
  const x0 = 150, y0 = 60, c = 58;
  let o = '';
  for (let j = 0; j < 3; j++) o += text(x0 + j * c + c / 2, y0 - 12, 'text ' + (j + 1), 'ts', 'middle');
  for (let i = 0; i < 3; i++) {
    o += text(x0 - 12, y0 + i * c + c / 2 + 5, 'image ' + (i + 1), 'ts', 'end');
    for (let j = 0; j < 3; j++) {
      const diag = i === j;
      o += rect(x0 + j * c + 2, y0 + i * c + 2, c - 4, c - 4, diag ? 'solid' : (L[i][j] >= 2 ? 'wash-strong' : 'wash2'), 4);
      o += text(x0 + j * c + c / 2, y0 + i * c + c / 2 + 6, String(L[i][j]), diag ? 'tw' : 't', 'middle');
    }
    o += text(x0 + 3 * c + 14, y0 + i * c + c / 2 + 5, row[i].toFixed(3), 'tl');
  }
  for (let j = 0; j < 3; j++) o += text(x0 + j * c + c / 2, y0 + 3 * c + 20, col[j].toFixed(3), 'tl', 'middle');
  o += text(x0 + 3 * c + 14, y0 - 12, '按行：image → text', 'ts');
  o += text(x0 - 12, y0 + 3 * c + 20, '按列：', 'ts', 'end');
  const ra = row.reduce((a, b) => a + b, 0) / 3, ca = col.reduce((a, b) => a + b, 0) / 3;
  o += text(x0 + 3 * c + 14, y0 + 3 * c + 20, `平均 ${ra.toFixed(3)} 与 ${ca.toFixed(3)}，loss = ${((ra + ca) / 2).toFixed(3)}`, 'tb');
  o += text(20, y0 + 3 * c + 50, '深色对角线是正确的配对；中间色的 2 是最像正确答案的错配（image 3 与 text 2），', 'ts');
  o += text(20, y0 + 3 * c + 68, '所以第 3 行、第 2 列的 loss 最大。', 'ts');
  return svg(560, y0 + 3 * c + 80, o, 'CLIP 的 3 乘 3 logits，对角线是配对；按行的 cross-entropy 是 0.066、0.240、0.349，按列是 0.066、0.408、0.170，总 loss 0.216');
}

export default {
  'cs336-bpeindex': bpeindex,
  'cs336-bpemerges': bpemerges,
  'cs336-rope': rope,
  'cs336-wave': wave,
  'cs336-online': online,
  'cs336-ring': ring,
  'cs336-lm': lm,
  'cs336-flops': flops,
  'cs336-lr': lr,
  'cs336-roofline': roofline,
  'cs336-flash': flash,
  'cs336-zero': zero,
  'cs336-pipe': pipe,
  'cs336-isoflop': isoflop,
  'cs336-kv': kv,
  'cs336-lsh': lsh,
  'cs336-clip': clip,
  'cs336-contbatch': contbatch,
  'cs336-paged': paged,
  'cs336-moe': moe,
  'cs336-clipmat': clip3,
};
