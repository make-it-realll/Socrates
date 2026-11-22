import { svg, svgA, anim, apath, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, area, axes } from '../lib/svg.mjs';

// 动图的时间轴：durs[i] 是第 i 帧停留的秒数 → keyTimes；末尾补一个 1
const timeline = (durs) => { const T = durs.reduce((a, b) => a + b, 0); const kt = []; let t = 0; for (const u of durs) { kt.push(t / T); t += u; } kt.push(1); return { T, kt }; };
const onlyAt = (n, ...idx) => { const a = Array.from({ length: n }, (_, i) => idx.includes(i)); a.push(a[n - 1]); return a; };
const atext = (x, y, s, cls, on, kt, T, anchor = 'start') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, kt, T)}</text>`;
// 一条 line w1 x + w2 y + b = 0 与矩形 [x0,x1]×[y0,y1] 的交线段，以及 w·x̃ > 0 那一侧的多边形
function halfplane([w1, w2, b], [x0, x1, y0, y1]) {
  const f = ([x, y]) => w1 * x + w2 * y + b;
  const box = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const poly = [], seg = [];
  for (let i = 0; i < 4; i++) {
    const A = box[i], B = box[(i + 1) % 4], fa = f(A), fb = f(B);
    if (fa > 0) poly.push(A);
    if ((fa > 0) !== (fb > 0)) { const t = fa / (fa - fb), X = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]; poly.push(X); seg.push(X); }
  }
  return { poly, seg };
}

// 从圆心 A 指向圆心 B 的箭头，两端各缩进半径；off 是垂直方向的平移（画一对相反的边时用）
function link(A, B, rA, rB, cls = 'ink', off = 0) {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const ox = -uy * off, oy = ux * off;
  return arrow(A[0] + ux * rA + ox, A[1] + uy * rA + oy, B[0] - ux * rB + ox, B[1] - uy * rB + oy, cls);
}

// 第 1 站：nearest centroid 的 boundary（虚线，静止）与 perceptron 一步步 update 的 boundary（动图）
function centroid() {
  const sx = lin(-2, 8, 40, 300), sy = lin(-1, 10, 285, 20), BOX = [-2, 8, -1, 10];
  const X = [[2, 2], [3, 1], [7, 9], [0, 0], [1, 1], [-1, 2]], Y = [1, 1, 1, -1, -1, -1];
  // 按顺序扫，犯错就 w ← w + y x̃，直到一整轮都对
  let w = [0, 0, 0]; const ups = [];
  for (let round = 1; round < 50; round++) {
    let err = 0;
    X.forEach(([a, b], i) => {
      if (Y[i] * (w[0] * a + w[1] * b + w[2]) <= 0) { w = [w[0] + Y[i] * a, w[1] + Y[i] * b, w[2] + Y[i]]; ups.push({ i, round, w }); err++; }
    });
    if (!err) break;
  }
  const n = ups.length;            // 12
  const frames = [{ w, i: -1 }, ...ups];
  const { T, kt } = timeline(frames.map((f, k) => (k === 0 ? 3 : 1.3)));
  const fr = [...frames, frames[frames.length - 1]];
  const P = (pts) => pts.map(([x, y]) => [sx(x), sy(y)]);
  let o = apath(fr.map((f) => d(P(halfplane(f.w, BOX).poly)) + 'Z'), kt, T, 'wash', true);
  o += axes({ sx, sy, x0: -2, x1: 8, y0: -1, y1: 10, xt: [2, 4, 6], yt: [2, 4, 6, 8], xAt: 0, yAt: 0, grid: true });
  o += text(sx(8), sy(0) - 6, 'x₁', 'ts', 'end') + text(sx(0) + 6, sy(10) + 4, 'x₂', 'ts');
  const g = (x) => (15.5 - 4 * x) / 3;
  o += line(sx(-1.25), sy(g(-1.25)), sx(4.1), sy(g(4.1)), 'dash');
  o += apath(fr.map((f) => d(P(halfplane(f.w, BOX).seg))), kt, T, 'ln', true);
  for (const [x, y] of X.slice(3)) o += circle(sx(x), sy(y), 5.5, 'paper');
  for (const [x, y] of X.slice(0, 3)) o += circle(sx(x), sy(y), 5.5, 'solid');
  for (const [x, y] of [[2, 2], [3, 1]]) o += circle(sx(x), sy(y), 10, 'dash');
  const cross = (x, y) => line(sx(x) - 6, sy(y) - 6, sx(x) + 6, sy(y) + 6, 'ink-b') + line(sx(x) - 6, sy(y) + 6, sx(x) + 6, sy(y) - 6, 'ink-b');
  o += cross(4, 4) + cross(0, 1);
  o += text(sx(4) + 9, sy(4) - 6, 'μ₊ = (4, 4)', 'ts') + text(sx(0) - 10, sy(1) + 4, 'μ₋ = (0, 1)', 'ts', 'end');
  o += text(sx(7) - 9, sy(9) + 4, '(7, 9)', 'ts', 'end');
  // 正在 update 的点：粗圈
  const hx = fr.map((f) => (f.i < 0 ? sx(7) : sx(X[f.i][0]))), hy = fr.map((f) => (f.i < 0 ? sy(9) : sy(X[f.i][1])));
  o += `<circle cx="${f1(hx[0])}" cy="${f1(hy[0])}" r="11" class="ln">${anim('cx', hx.map(f1), kt, T, true)}${anim('cy', hy.map(f1), kt, T, true)}${ashow(fr.map((f) => f.i >= 0), kt, T)}</circle>`;
  // 右栏
  const R0 = 318;
  const T0 = ['实心点 label +1，空心点 label −1。', '虚线：nearest centroid 的 boundary', '4x₁ + 3x₂ = 15.5，虚线圈的两点分错。', '彩线：perceptron 当前的 boundary，', '浅色一侧判为 +1。'];
  T0.forEach((s, i) => { o += text(R0, 40 + i * 19 + (i >= 3 ? 10 : 0), s, i === 3 ? 'tl' : 't'); });
  o += rect(R0 - 6, 160, 248, 96, 'paper', 4);
  const vec = (v) => '(' + v.map((a) => (a < 0 ? '−' : '') + Math.abs(a)).join(', ') + ')';
  const pt = (i) => '(' + X[i].map((a) => (a < 0 ? '−' : '') + Math.abs(a)).join(', ') + ')';
  frames.forEach((f, k) => {
    const on = onlyAt(frames.length, k);
    if (k === 0) {
      o += atext(R0 + 4, 184, `${n} 次 update 之后：六个点全对`, 'tb', on, kt, T);
      o += atext(R0 + 4, 208, 'w = ' + vec(f.w) + '，即 x₁ > 4/3', 't', on, kt, T);
      o += atext(R0 + 4, 232, `接下来从 w = 0 重放这 ${n} 步`, 'ts', on, kt, T);
    } else {
      o += atext(R0 + 4, 184, `update ${k} / ${n}　（第 ${f.round} 轮）`, 'tb', on, kt, T);
      o += atext(R0 + 4, 208, pt(f.i) + ' 分错，label ' + (Y[f.i] > 0 ? '+1' : '−1'), 't', on, kt, T);
      o += atext(R0 + 4, 232, 'w ← w ' + (Y[f.i] > 0 ? '+ ' : '− ') + vec([...X[f.i], 1]) + ' = ' + vec(f.w), 't', on, kt, T);
    }
  });
  return svgA(560, 300, o, '动图：六个点上，nearest centroid 的 boundary（虚线）把两个 positive point 分错；perceptron 从 w 等于 0 出发，每遇到一个分错的点就 update 一次，12 次之后 boundary 停在 x1 等于 4/3，六个点全对');
}

// 第 2 站：PageRank 的 power iteration（动图）。圆的面积正比于当前的 x_k，第一帧是收敛后的 π
function pagerank() {
  const out = [[1, 2], [2], [0], [2], [3]], al = 0.15, nn = 5;
  const step = (x) => { const y = Array(nn).fill(al / nn); x.forEach((v, i) => out[i].forEach((j) => { y[j] += (1 - al) * v / out[i].length; })); return y; };
  const xs = [Array(nn).fill(1 / nn)]; for (let k = 0; k < 200; k++) xs.push(step(xs[k]));
  const pi = xs[200], err = (x) => x.reduce((s, v, i) => s + Math.abs(v - pi[i]), 0);
  const K = [0, 1, 2, 3, 4, 5, 6, 8, 10];
  const frames = [{ x: pi, k: -1 }, ...K.map((k) => ({ x: xs[k], k }))];
  const { T, kt } = timeline(frames.map((f, i) => (i === 0 ? 3.2 : 1.2)));
  const fr = [...frames, frames[frames.length - 1]];
  const inl = [1, 1, 3, 1, 0];
  const pos = [[110, 130], [260, 55], [260, 210], [400, 210], [515, 210]];
  const rad = (p) => 8 + 42 * Math.sqrt(p);
  const rmax = pos.map((_, i) => Math.max(...frames.map((f) => rad(f.x[i]))));
  let o = '';
  const E = [[0, 1, 0], [0, 2, 5], [1, 2, 0], [2, 0, 5], [3, 2, 0], [4, 3, 0]];
  for (const [i, j, off] of E) o += link(pos[i], pos[j], rmax[i] + 2, rmax[j] + 3, 'ink', off);
  pos.forEach(([x, y], i) => {
    const rs = fr.map((f) => f1(rad(f.x[i])));
    o += `<circle cx="${x}" cy="${y}" r="${rs[0]}" class="wash ink-s">${anim('r', rs, kt, T, true)}</circle>` + text(x, y + 5, String(i + 1), 'tb', 'middle');
  });
  frames.forEach((f, k) => {
    const on = onlyAt(frames.length, k), v = (i) => (k === 0 ? 'π' : 'x') + ' = ' + (Math.round(f.x[i] * 1000 + 1e-9) / 1000).toFixed(3);
    const L = (i, dx, dy, s, anchor) => atext(pos[i][0] + dx, pos[i][1] + dy, s, 'ts', on, kt, T, anchor);
    o += L(0, 0, rmax[0] + 18, v(0) + '，in-link 1', 'middle') + L(1, rmax[1] + 8, 4, v(1) + '，in-link 1', 'start') + L(2, 0, rmax[2] + 18, v(2) + '，in-link 3', 'middle');
    o += L(3, 0, -rmax[3] - 26, v(3), 'middle') + L(4, 0, -rmax[4] - 26, v(4), 'middle');
    o += atext(4, 20, k === 0 ? 'π：power iteration converge 之后' : `power iteration　k = ${f.k}`, 'tb', on, kt, T);
    o += atext(4, 40, k === 0 ? '圆的面积 = PageRank' : `‖xₖ − π‖₁ = ${err(f.x).toFixed(3)}`, 'ts', on, kt, T);
  });
  o += text(pos[3][0], pos[3][1] - rmax[3] - 10, 'in-link 1', 'ts', 'middle') + text(pos[4][0], pos[4][1] - rmax[4] - 10, 'in-link 0', 'ts', 'middle');
  return svgA(560, 280, o, '动图：五个 node 的 directed graph，圆的面积是当前的 PageRank 估计。Power iteration 从每个 node 0.2 出发，node 5 第一步就掉到 0.03，node 3 先涨到 0.455，node 1 再从 node 3 接过分数，大约十步之后停在 π；node 1 只有一个 in-link 却排第二，因为那个 in-link 来自排第一的 node 3');
}

// 第 3 站：I am Sam 语料的 bigram Markov chain
function bigram() {
  let o = '';
  const box = (x, y, s, w = 50) => rect(x - w / 2, y - 14, w, 28, 'paper', 6) + text(x, y + 5, s, 't', 'middle');
  const S = [40, 95], I = [170, 45], AM = [320, 45], SAM = [250, 150], END = [515, 95];
  // edges
  const e = (A, B, wA, wB, lab, lx, ly, cls = 'ink') => {
    const dx = B[0] - A[0], dy = B[1] - A[1];
    const t0 = Math.min(Math.abs((wA / 2 + 2) / (dx || 1e-9)), Math.abs(16 / (dy || 1e-9)));
    const t1 = Math.min(Math.abs((wB / 2 + 4) / (dx || 1e-9)), Math.abs(18 / (dy || 1e-9)));
    return arrow(A[0] + dx * t0, A[1] + dy * t0, B[0] - dx * t1, B[1] - dy * t1, cls) + text(lx, ly, lab, 'tl', 'middle');
  };
  o += e(S, I, 50, 40, '2/3', 95, 58);
  o += e(S, SAM, 50, 50, '1/3', 182, 156);
  o += e(I, AM, 40, 50, '2/3', 245, 36);
  o += e(AM, SAM, 50, 50, '1/2', 300, 108);
  o += e(SAM, I, 50, 40, '1/2', 196, 108);
  o += e(AM, END, 50, 60, '1/2', 430, 58);
  o += e(SAM, END, 50, 60, '1/2', 400, 136);
  o += box(S[0], S[1], '&lt;s&gt;') + box(I[0], I[1], 'I', 40) + box(AM[0], AM[1], 'am') + box(SAM[0], SAM[1], 'Sam') + box(END[0], END[1], '&lt;/s&gt;', 60);
  // the long chain from I
  const words = ['do', 'not', 'like', 'green', 'eggs', 'and', 'ham'];
  const y = 235, xs = words.map((_, i) => 60 + i * 66);
  o += arrow(I[0] - 6, I[1] + 15, xs[0] + 4, y - 15, 'ink') + text(76, 162, '1/3', 'tl', 'middle');
  words.forEach((w, i) => {
    o += box(xs[i], y, w, 50);
    if (i < words.length - 1) o += arrow(xs[i] + 26, y, xs[i + 1] - 27, y, 'mute');
  });
  o += arrow(xs[6] + 20, y - 15, END[0] - 6, END[1] + 16, 'mute');
  o += text(280, 276, '灰色箭头的 probability 都是 1。&lt;/s&gt; 是 absorbing state：走到它，句子结束。', 'ts', 'middle');
  return svg(560, 286, o, '由三句话的语料估计出的 bigram language model 画成 Markov chain 的 transition graph，边上标着 transition probability');
}

// 第 4 站：importance sampling，目标在 N(0,1) 的尾巴里
function isamp() {
  const phi = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  const sx = lin(-4, 8, 50, 530), sy = lin(0, 0.42, 220, 30);
  let o = axes({ sx, sy, x0: -4, x1: 8, y0: 0, y1: 0.42, xt: [-4, -2, 0, 2, 4, 6, 8], yt: [0.2, 0.4] });
  o += path(area((x) => phi(x - 4), 4, 8, sx, sy), 'wash');
  o += path(curve(phi, -4, 8, sx, sy), 'ink-b') + path(curve((x) => phi(x - 4), -4, 8, sx, sy), 'ln');
  o += line(sx(4), sy(0), sx(4), sy(0.41), 'dash');
  o += text(sx(0), sy(0.405) - 4, 'p = N(0, 1)', 'tb', 'middle') + text(sx(5.3), sy(0.405) - 4, 'q = N(4, 1)', 'tl', 'start');
  o += text(sx(4) + 8, sy(0.06), 'x > 4', 'ts');
  o += text(sx(-3.9), sy(0.3), 'p 在 x > 4 的 mass', 't') + text(sx(-3.9), sy(0.3) + 18, '只有 3.2 × 10⁻⁵，', 't') + text(sx(-3.9), sy(0.3) + 36, '在图上看不见', 't');
  o += text(sx(5.6), sy(0.2), 'weight', 'ts') + text(sx(5.6), sy(0.2) + 16, 'p/q = e^(8 − 4x)', 'ts');
  return svg(560, 246, o, 'Standard normal density 与平移到 4 的 proposal density；要估计的 tail probability 在原 density 下看不见，在 proposal 下占一半 mass');
}

const TR01 = [3.01,2.31,2.39,3.03,2.23,1.53,3.21,3.22,4.26,4.20,3.09,2.76,3.21,1.73,2.30,1.59,2.08,3.43,3.08,3.09,3.99,3.66,4.10,4.11,3.99,3.26,2.95,1.96,2.85,3.28,2.93,3.44,3.66,4.47,4.01,4.17,3.55,4.50,2.92,3.19,3.07,3.08,4.46,3.25,4.30,4.24,4.75,3.38,3.04,2.98,3.98,2.53,3.05,2.29,1.91,2.66,2.56,2.29,3.44,4.01,3.56,3.12,3.29,4.43,2.92,2.75,2.16,2.73,2.06,3.95,4.19,4.51,4.14,4.71,4.77,4.79,3.31,2.77,3.10,2.77,2.44,2.09,3.21,2.18,1.68,2.50,1.93,3.05,2.27,2.79,3.55,4.39,3.61,3.61,4.72,3.89,4.08,4.11,2.71,2.65,1.69,2.12,2.36,3.05,3.08,2.42,2.89,2.84,3.19,3.67,3.50,3.72,2.69,2.67,3.06,2.13,1.91,3.30,3.22,3.30,3.39,3.26,3.65,4.23,3.15,3.70,4.00,3.45,3.05,2.36,3.56,2.16,1.21,2.03,3.11,0.60,1.41,2.90,4.11,3.58,4.19,3.41,3.51,4.08,3.12,2.57,2.52,2.45,2.90,1.82,1.64,0.91,2.69,3.38,3.65,3.86,3.12,3.13,2.56,1.40,1.20,3.31,3.71,4.28,3.38,2.50,2.68,3.94,2.76,3.01,2.87,4.33,3.85,3.19,4.20,2.35,2.01,2.58,3.69,2.69,1.71,2.16,0.53,0.13,-0.62,-1.30,-2.72,-2.45,-0.92,-3.85,-2.18,-2.46,-1.57,-2.32,-2.76,-3.22,-1.50,-2.09,-2.30,-2.15,-2.36,-3.73,-3.62,-3.58,-3.10,-2.21,-1.18,-1.60,-2.31,-1.18,-1.92,-1.41,-2.16,-2.19,-2.68,-2.42,-2.22,-1.50,-1.26,-3.37,-4.24,-3.75,-2.64,-3.96,-4.32,-3.78,-5.51,-4.83,-3.69,-4.05,-4.18,-4.28,-4.55,-3.92,-2.42,-3.19,-2.53,-2.37,-3.51,-3.20,-2.16,-2.79,-2.10,-2.28,-2.67,-2.10,-3.11,-2.37,-2.41,-3.15,-3.32,-3.57,-3.37,-3.23,-3.91,-5.15,-3.12,-3.74,-3.74,-2.37,-3.02,-2.72,-2.67,-3.04,-1.76,-2.14,-1.39,-2.00,-1.82,-2.61,-3.14,-4.48,-3.33,-2.84,-3.47,-3.52,-3.27,-2.62,-5.02,-4.43,-3.55,-2.57,-3.23,-4.00,-3.56,-2.68,-3.57,-3.33,-2.28,-1.67,-2.31,-2.47,-1.99,-1.34,-1.97,-2.39,-0.97,-2.07,-2.83,-3.43,-4.66,-3.84,-4.37,-3.51,-2.31,-2.74,-1.53,-2.08,-2.98,-1.38,-1.98,-2.43,-3.13,-2.78,-3.10,-2.25,-2.45,-2.17,-4.38,-3.34,-2.91,-0.91,-3.31,-3.02,-2.65,-3.44,-3.89,-3.07,-2.56,-2.98,-0.92,-2.66,-5.14,-4.53,-4.98,-3.94,-3.54,-2.92,-4.32,-2.66,-3.44,-3.99,-3.33,-3.46,-5.08,-4.56,-4.28,-5.01,-3.85,-4.37,-4.29,-4.53,-4.33,-3.95,-4.18,-3.40,-2.56,-3.59,-2.77,-2.43,-2.19,-2.51,-2.92,-2.67,-3.66,-3.14,-2.16,-2.11,-2.33,-3.70,-3.46,-2.52,-3.04,-3.14,-2.89,-3.65,-2.87,-2.71,-3.72,-4.51,-4.70,-2.92,-5.17,-3.57,-3.97,-4.47,-4.42,-4.06,-2.94,-2.36,-2.35,-2.99,-2.54,-2.36,-2.90,-2.19,-4.01,-3.73,-3.27,-2.98,-1.83,-2.65,-1.73,-2.02,-2.86,-3.38,-4.04,-3.31,-3.10,-3.06,-2.71,-3.49,-3.95,-3.55,-4.16,-4.11,-3.59,-3.94,-3.50,-3.07,-1.84,-1.57,-2.07,-1.93,-2.08,-2.43,-2.26,-2.29,-1.99,-1.28,-1.64,-2.65,-2.45,-2.15,-1.96,-2.19,-3.22,-4.92,-4.72,-4.87,-4.05,-4.21,-3.97,-2.96,-4.15,-2.76,-2.56,-2.42,-2.69,-4.21,-3.37,-3.43,-4.43,-3.73,-3.53,-3.37,-2.36,-3.29,-4.29,-4.14,-4.40,-4.77,-3.66,-3.25,-2.80,-3.59,-4.27,-4.89,-3.97,-4.03,-4.18,-3.07,-2.32,-2.67,-2.11,-2.41,-1.83,-2.05,-2.61,-2.46,-1.53,-1.16,-2.96,-3.15,-3.40,-2.42,-3.07,-3.50,-2.93,-3.88,-2.18,-3.70,-3.94,-3.72,-5.01,-4.76,-2.46,-2.51,-3.88,-3.49];
const TR3 = [3.38,-3.00,-3.89,-2.08,-2.46,2.80,2.09,-3.28,2.46,2.55,1.70,2.51,-4.62,3.57,2.66,-3.15,-3.91,-2.94,-4.48,3.53,2.49,2.45,3.58,2.24,-1.06,1.61,-2.28,-4.72,-1.58,5.02,-4.91,-2.58,2.32,-3.07,3.20,3.38,-4.42,-2.53,-4.54,-1.50,3.52,2.87,-2.23,-4.36,-2.97,2.99,-3.20,-3.55,3.77,3.63,3.00,3.09,-0.89,3.44,-2.09,2.49,1.78,-3.82,-2.67,3.44,-1.41,2.61,2.08,4.41,3.71,-4.34,3.12,-2.98,-1.10,2.92,2.10,-1.93,2.66,2.46,2.92,-3.42,2.38,-3.26,-1.37,-1.99,-2.89,-4.12,3.41,4.19,3.32,-3.97,-1.89,2.30,-2.70,-2.82,4.16,3.23,4.88,3.92,2.56,-3.82,2.30,1.44,-3.42,-3.28,-1.74,2.93,-2.59,-1.52,2.40,-4.14,3.77,-3.67,3.33,-4.25,-3.24,-4.12,2.43,1.13,0.87,-2.95,-2.70,2.70,4.28,-3.55,3.40,-2.93,-2.66,-3.26,2.04,4.11,1.66,2.18,-2.66,-2.24,-4.35,3.36,4.03,-1.93,1.90,-3.57,4.64,2.96,-3.26,2.68,3.74,1.37,-2.47,-3.04,-2.98,3.81,1.94,-3.62,1.52,1.66,3.82,-2.55,3.70,2.33,2.90,-5.11,0.84,-2.94,3.73,-3.63,-2.01,-3.73,2.03,-4.50,3.77,-2.69,3.08,-2.81,-3.49,2.26,-4.03,2.16,1.25,-4.17,-3.86,-3.11,-3.26,-2.40,1.91,-2.13,-3.18,-3.03,-4.25,-2.78,3.18,4.82,2.96,3.98,-2.90,-3.86,3.11,-3.99,2.29,1.61,-2.90,2.82,3.19,-1.84,-4.53,3.18,2.31,-4.49,3.43,-3.82,-3.10,3.20,-1.30,-3.66,3.25,2.14,-4.34,2.72,-2.75,2.94,-3.84,-3.48,3.27,2.66,2.50,3.56,-2.53,2.77,-3.18,-3.51,-2.91,-4.06,1.76,-3.88,-4.04,3.94,-3.35,-3.53,1.77,-4.20,2.63,1.53,3.63,-2.50,2.19,2.26,3.23,3.21,3.36,-2.15,2.49,-2.64,-3.22,1.94,1.89,-2.39,-3.08,2.80,-2.71,3.62,-2.52,2.99,-3.55,-3.35,2.31,3.29,-2.97,4.32,2.89,2.71,-2.12,-2.98,4.57,3.32,-4.64,2.25,-1.55,-2.71,-4.85,3.75,-3.12,1.90,1.80,-1.76,-2.00,2.26,2.65,3.39,2.10,3.37,2.55,5.11,-4.38,-1.88,2.63,-3.84,1.24,-4.29,2.91,6.01,4.59,2.70,4.82,-2.10,-4.45,-2.80,-2.98,2.32,-3.59,4.38,-4.14,-3.49,1.91,2.79,-1.17,2.64,2.71,-4.17,1.88,3.08,-4.03,-4.04,-3.47,-4.27,-1.72,3.79,-1.72,3.31,-3.31,-1.73,-3.46,-2.36,2.03,3.69,-2.53,-2.45,2.76,-1.99,-3.47,-1.41,-1.39,3.13,-2.73,-3.07,-1.90,-3.02,-4.92,-3.19,3.38,4.29,-3.11,-3.51,1.76,-4.09,-3.80,-4.42,-1.26,-2.64,-5.39,1.33,-2.39,-1.62,3.10,-2.67,2.58,2.46,-5.22,3.77,-4.05,-1.45,-1.99,-2.14,4.51,4.02,2.99,-3.59,-2.04,-3.26,-5.27,-3.97,2.34,-2.24,-3.70,3.30,3.05,-2.24,-4.48,3.01,-3.44,2.38,2.60,-3.63,2.99,2.09,-2.97,-3.31,2.26,-1.45,3.89,1.08,4.59,-3.48,-2.92,-2.52,-3.00,4.47,-0.47,2.88,-5.11,5.44,-3.52,-2.35,3.35,2.74,3.46,-1.58,-3.77,-1.60,-2.31,2.30,-3.21,-4.60,4.59,5.65,3.41,3.35,2.29,3.13,3.06,-6.25,-2.05,-2.78,-1.13,3.47,3.36,4.10,-4.92,-1.82,1.84,4.78,2.78,4.62,-1.87,-3.42,-3.49,3.88,-4.70,2.23,2.90,2.63,-3.63,-1.19,-3.28,-1.77,-3.86,3.55,-1.20,1.64,-3.92,2.86,-2.67,-2.69,3.01,-5.40,2.09,3.21,-3.27,-2.81,4.97,4.93,3.02,-1.59,1.97,-1.24,-5.06,-4.76,-3.49,-1.48,1.93,-2.17,-3.31,4.08,-3.69,1.67,3.61,-3.12,4.41,-2.06,2.11,-2.43,1.52,-2.98,2.75,4.66,-3.38,-2.64,2.39,2.57,2.04,-1.47,-4.89,2.79,3.29,2.56,-2.10,-1.91];

// 第 4 站：Metropolis 的两条 trace（seed 0，每 100 步取一个点）
function mhtrace() {
  let o = '';
  const panel = (y0, data, title, note) => {
    const sx = lin(0, data.length - 1, 50, 530), sy = lin(-6.5, 6.5, y0 + 100, y0);
    o += rect(50, y0, 480, 100, 'frame');
    for (const v of [-3, 3]) o += line(50, sy(v), 530, sy(v), 'grid') + text(44, sy(v) + 4, v > 0 ? '3' : '−3', 'ts', 'end');
    o += line(50, sy(0), 530, sy(0), 'dash') + text(44, sy(0) + 4, '0', 'ts', 'end');
    o += path(d(data.map((v, i) => [sx(i), sy(v)])), 'ln');
    o += text(50, y0 - 8, title, 'tb') + text(530, y0 - 8, note, 'ts', 'end');
  };
  panel(28, TR01, 'step σ = 0.1：acceptance 97%', '50000 步里只跨过 0 九次');
  panel(170, TR3, 'step σ = 3：acceptance 45%', '50000 步里跨过 0 三千九百多次');
  o += text(290, 296, 'Target ∝ e^(−(x−3)²/2) + e^(−(x+3)²/2)，两个 mode 在 ±3；横轴是 step（0 到 50000）', 'ts', 'middle');
  return svg(560, 306, o, '同一个 bimodal target 上两条 Metropolis chain 的 trace：step 小的 chain 长时间困在一个 mode 里，step 大的 chain 在两个 mode 之间频繁来回');
}

// 第 5 站：f = ½(x² + 10y²) 上的 gradient descent
function zigzag() {
  const sx = lin(-1, 11, 40, 520), sy = lin(-1.6, 1.6, 230, 30);
  let o = '';
  for (const c of [55, 30, 12, 4, 1]) {
    const pts = [];
    for (let i = 0; i <= 160; i++) { const t = (2 * Math.PI * i) / 160; pts.push([sx(Math.sqrt(2 * c) * Math.cos(t)), sy(Math.sqrt(2 * c / 10) * Math.sin(t))]); }
    o += path(d(pts) + 'Z', 'grid');
  }
  o += line(sx(-1), sy(0), sx(11), sy(0), 'axis') + line(sx(0), sy(-1.6), sx(0), sy(1.6), 'axis');
  const N = 14;
  const run = (eta) => { let p = [10, 1]; const out = [p]; for (let k = 0; k < N; k++) { p = [p[0] * (1 - eta), p[1] * (1 - 10 * eta)]; out.push(p); } return out; };
  const z = run(2 / 11), s = run(0.1);
  // 第 0 帧：全部 14 步（静态时看到的）；之后从 k = 0 一步一步走
  const ks = [N, ...Array.from({ length: N + 1 }, (_, k) => k)];
  const { T, kt } = timeline(ks.map((k, i) => (i === 0 ? 3 : 0.55)));
  const kf = [...ks, N];
  const P = ([x, y]) => [sx(x), sy(y)];
  o += apath(kf.map((k) => d(s.slice(0, k + 1).map(P))), kt, T, 'mute', true);
  o += apath(kf.map((k) => d(z.slice(0, k + 1).map(P))), kt, T, 'ln', true);
  z.forEach((p, j) => { const [x, y] = P(p); o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="2.6" class="ln-f">${ashow(kf.map((k) => k >= j), kt, T)}</circle>`; });
  s.forEach((p, j) => { const [x, y] = P(p); o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="2.2" class="mute-f">${ashow(kf.map((k) => k >= j), kt, T)}</circle>`; });
  for (const [run_, cls, r] of [[z, 'ln', 6], [s, 'ink', 5]]) {
    const xs = kf.map((k) => f1(P(run_[k])[0])), ys = kf.map((k) => f1(P(run_[k])[1]));
    o += `<circle cx="${xs[0]}" cy="${ys[0]}" r="${r}" class="${cls}">${anim('cx', xs, kt, T, true)}${anim('cy', ys, kt, T, true)}</circle>`;
  }
  o += circle(sx(0), sy(0), 3.5, 'ink-f');
  o += text(sx(10) - 4, sy(1) - 10, '起点 (10, 1)', 'ts', 'end');
  o += text(sx(5.6), sy(-1.25), '彩线 η = 2/11：y 每步变号，x 每步乘 9/11', 'tl', 'middle');
  o += text(sx(0.3), sy(1.3), '灰线 η = 0.1：y 一步归零，x 每步只乘 0.9', 't');
  ks.forEach((k, i) => {
    const on = onlyAt(ks.length, i);
    o += atext(280, 262, i === 0 ? `两条路径各走 ${N} 步；接下来从 k = 0 重放` : `第 ${k} 步：彩线 x = ${z[k][0].toFixed(2)}，灰线 x = ${s[k][0].toFixed(2)}`, 'ts', on, kt, T, 'middle');
  });
  return svgA(560, 270, o, '动图：在拉长的 quadratic 上，两种 step size 的 gradient descent 一步一步走：η 等于 2/11 的路径在山谷两壁之间 zigzag，η 等于 0.1 的路径第一步就落到谷底，再沿谷底缓慢前进');
}

// 第 6 站：|x|/√d 的 density，d 越大越集中在 1 附近
function shell() {
  const lg = (z) => (z - 0.5) * Math.log(z) - z + 0.5 * Math.log(2 * Math.PI) + 1 / (12 * z) - 1 / (360 * z ** 3);
  const dens = (dd) => (t) => (t <= 0 ? 0 : Math.sqrt(dd) * Math.exp((dd - 1) * Math.log(Math.sqrt(dd) * t) - (dd * t * t) / 2 - (dd / 2 - 1) * Math.log(2) - lg(dd / 2)));
  const sx = lin(0, 2, 60, 520), sy = lin(0, 18, 225, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 18, xt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5'], [2, '2']], yt: [6, 12, 18] });
  const cls = { 2: 'mute', 10: 'ink', 100: 'ink-b', 1000: 'ln' };
  for (const dd of [2, 10, 100, 1000]) o += path(curve(dens(dd), 0.001, 2, sx, sy, 800), cls[dd]);
  o += text(sx(0.42), sy(0.95), 'd = 2', 'ts', 'end') + text(sx(0.6), sy(1.7), 'd = 10', 'ts', 'end') + text(sx(0.87), sy(4), 'd = 100', 'tb', 'end') + text(sx(1.04), sy(11.6), 'd = 1000', 'tl');
  o += text(sx(2), 258, '|x| / √d', 'ts', 'end');
  o += text(sx(0.04), sy(16.5), 'x ~ N(0, I), x ∈ ℝᵈ。', 't') + text(sx(0.04), sy(16.5) + 18, '|x| 的 standard deviation', 't') + text(sx(0.04), sy(16.5) + 36, '始终约 0.71，除以 √d 之后', 't') + text(sx(0.04), sy(16.5) + 54, '宽度按 1/√d 收窄。', 't');
  return svg(560, 268, o, 'Standard Gaussian vector 的 length 除以根号 d 之后的 density：d 等于 2 时很宽，d 等于 1000 时几乎全部集中在 1 附近');
}

// 第 7 站：L1 ball 与 L2 ball 第一次碰到 constraint line 的位置
function l1ball() {
  const S = 95, O = [170, 150];
  const P = (x, y) => [O[0] + S * x, O[1] - S * y];
  let o = line(...P(-1.4, 0), ...P(2.4, 0), 'axis') + line(...P(0, -1.3), ...P(0, 1.45), 'axis');
  o += text(...P(2.4, 0).map((v, i) => v + (i ? 16 : 0)), 'x₁', 'ts', 'end') + text(P(0, 1.45)[0] + 6, P(0, 1.45)[1] + 4, 'x₂', 'ts');
  // 两个 ball 以同样的速度从原点放大：‖x‖ ≤ s；L2 ball 在 s = 2/√5 碰到 line 就停，L1 ball 在 s = 1 碰到
  const r2 = 2 / Math.sqrt(5);
  const ss = [1, 1, 0.08, 0.3, 0.5, 0.7, r2, 1, 1];
  const grow = 4.2, tAt = (v) => 3 + grow * (v - 0.08) / 0.92;
  const times = [0, 2.6, 3, ...ss.slice(3, 8).map(tAt), tAt(1) + 2.5];
  const T = times[times.length - 1], kt = times.map((t) => t / T);
  o += apath(ss.map((v) => d([P(v, 0), P(0, v), P(-v, 0), P(0, -v)]) + 'Z'), kt, T, 'wash ink-s');
  const rr = ss.map((v) => f1(S * Math.min(v, r2)));
  o += `<circle cx="${O[0]}" cy="${O[1]}" r="${rr[0]}" class="dash">${anim('r', rr, kt, T)}</circle>`;
  o += line(...P(-0.15, 1.075), ...P(2.1, -0.05), 'ln');
  const shown = (th) => ashow(ss.map((v, i) => i === 0 || v >= th - 1e-9), kt, T);
  o += `<circle cx="${f1(P(0, 1)[0])}" cy="${f1(P(0, 1)[1])}" r="4.5" class="ink-f">${shown(1)}</circle>`;
  o += `<circle cx="${f1(P(0.4, 0.8)[0])}" cy="${f1(P(0.4, 0.8)[1])}" r="4.5" class="paper">${shown(r2)}</circle>`;
  o += `<text x="${f1(P(0, 1)[0] - 16)}" y="${f1(P(0, 1)[1] + 5)}" class="tb" text-anchor="end">(0, 1)${shown(1)}</text>`;
  o += `<text x="${f1(P(0.4, 0.8)[0] + 6)}" y="${f1(P(0.4, 0.8)[1] - 10)}" class="t" text-anchor="start">(0.4, 0.8)${shown(r2)}</text>`;
  o += text(P(1.3, 0.55)[0], P(1.3, 0.55)[1], 'x₁ + 2x₂ = 2', 'tl');
  o += text(384, 194, '两个 ball 同时从原点放大：', 'tb');
  o += text(384, 218, '实线 diamond：‖x‖₁ = 1，', 't') + text(384, 236, '碰到 line 在 vertex (0, 1)。', 't');
  o += text(384, 262, '虚线 circle：', 't') + text(384, 280, '‖x‖₂ = 0.894，碰到 line', 't') + text(384, 298, '在 (0.4, 0.8)，', 't') + text(384, 316, '两个 component 都不为 0。', 't');
  return svgA(560, 324, o, '动图：L1 ball（diamond）和 L2 ball（circle）从原点同时放大，直到第一次碰到 constraint line：circle 在半径 0.894 时碰在 (0.4, 0.8)，diamond 在半径 1 时碰在 coordinate axis 上的 vertex (0, 1)，得到 sparse solution');
}

// 第 7 站：L1 recovery 的 phase transition（d = 50，每个 n 做 50 次）
function phase() {
  const ns = Array.from({ length: 20 }, (_, i) => 2 + 2 * i);
  const s3 = [0, 0, 0.06, 0.24, 0.44, 0.74, 0.84, 0.92, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const s6 = [0, 0, 0, 0, 0, 0.06, 0.16, 0.26, 0.5, 0.82, 0.84, 1, 0.96, 1, 1, 1, 1, 1, 1, 1];
  const sx = lin(0, 40, 60, 520), sy = lin(0, 1, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 40, y0: 0, y1: 1, xt: [0, 10, 20, 30, 40], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  o += path(d(ns.map((n, i) => [sx(n), sy(s3[i])])), 'ln') + path(d(ns.map((n, i) => [sx(n), sy(s6[i])])), 'ink');
  ns.forEach((n, i) => { o += circle(sx(n), sy(s3[i]), 3, 'ln-f') + circle(sx(n), sy(s6[i]), 3, 'ink-f'); });
  o += text(sx(9.2), sy(0.62), 's = 3', 'tl', 'end') + text(sx(19), sy(0.3), 's = 6', 'tb');
  o += line(sx(6), sy(0), sx(6), sy(1), 'dash') + line(sx(12), sy(0), sx(12), sy(1), 'dash');
  o += text(sx(6) - 4, sy(0.75), 'n = 2s = 6', 'ts', 'end') + text(sx(12) - 4, sy(0.9), 'n = 2s = 12', 'ts', 'end');
  o += text(sx(40), 252, 'measurement 个数 n', 'ts', 'end') + text(60, 18, '50 次里 L1 minimization 恰好 recover 的比例（d = 50）', 'tb');
  return svg(560, 262, o, 'L1 minimization 成功 recover sparse vector 的比例随 measurement 个数的变化：s 等于 3 时 n 到 18 全部成功，s 等于 6 时 n 到 24 左右几乎全部成功，都远多于唯一性所需的 2s');
}

// 第 8 站：不同 ε 下 Sinkhorn 得到的 coupling
function sinkhorn() {
  const Ps = [
    ['ε = 10', [[0.0601, 0.1606, 0.2793], [0.0268, 0.0874, 0.1858], [0.0131, 0.052, 0.1349]], 'cost 1.59'],
    ['ε = 1', [[0.0972, 0.2436, 0.1592], [0.0028, 0.051, 0.2463], [0, 0.0054, 0.1945]], 'cost 1.14'],
    ['ε = 0.1', [[0.1, 0.3, 0.1], [0, 0, 0.3], [0, 0, 0.2]], 'cost 1.00'],
  ];
  let o = '';
  const cell = 46;
  Ps.forEach(([t, P, c], k) => {
    const x0 = 40 + k * 175, y0 = 46;
    o += text(x0 + 1.5 * cell, 30, t, 'tb', 'middle');
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      o += rect(x0 + j * cell, y0 + i * cell, cell, cell, 'frame');
      if (P[i][j] > 0.0005) o += circle(x0 + j * cell + cell / 2, y0 + i * cell + cell / 2, Math.max(1.2, 40 * Math.sqrt(P[i][j] / Math.PI)), 'solid');
    }
    o += text(x0 + 1.5 * cell, y0 + 3 * cell + 22, c, 'ts', 'middle');
  });
  o += text(280, 248, 'Row 是 source（mass 0.5、0.3、0.2，位置 0、1、2），column 是 target（0.1、0.3、0.6）', 'ts', 'middle');
  o += text(280, 266, '圆的面积正比于 Pᵢⱼ；ε → ∞ 时趋于 abᵀ（cost 1.70）', 'ts', 'middle');
  return svg(560, 276, o, '三个 epsilon 下 Sinkhorn 给出的 3 乘 3 transport plan：epsilon 大时 mass 摊开到每一格，epsilon 小时集中到 linear program 的 optimal coupling 上');
}

// ---------- 开头第一个数：pairwise distance 的 spread（第 6 站的数表） ----------
function spread() {
  const rows = [[2, 1.72, 0.048, 5.10], [10, 4.28, 1.42, 8.08], [100, 14.12, 10.69, 17.48], [1000, 44.73, 40.93, 47.90], [10000, 141.48, 138.17, 144.90]];
  const sx = lin(0, 3, 120, 520);
  let o = line(sx(1), 30, sx(1), 214, 'dash') + text(sx(1), 24, 'mean', 'ts', 'middle');
  rows.forEach(([dd, m, lo, hi], i) => {
    const y = 50 + i * 38;
    o += text(110, y + 4, 'd = ' + dd, 't', 'end');
    o += line(sx(lo / m), y, sx(hi / m), y, 'ln') + line(sx(lo / m), y - 5, sx(lo / m), y + 5, 'ln') + line(sx(hi / m), y - 5, sx(hi / m), y + 5, 'ln');
    const rr = (hi - lo) / lo;
    o += text(sx(1.04), y - 10, `${lo.toFixed(lo < 1 ? 3 : 2)} 到 ${hi.toFixed(2)}，(max − min)/min = ${rr >= 10 ? rr.toFixed(0) : rr >= 1 ? rr.toFixed(1) : rr.toPrecision(2)}`, 'ts');
  });
  o += line(sx(0), 222, sx(3), 222, 'axis');
  for (const v of [0, 0.5, 1, 1.5, 2, 2.5, 3]) o += line(sx(v), 222, sx(v), 226, 'axis') + text(sx(v), 240, String(v), 'ts', 'middle');
  o += text(sx(3), 256, 'distance ÷ 这一维的 mean distance', 'ts', 'end');
  return svg(560, 264, o, '100 个 standard Gaussian 点两两之间 4950 个 distance 的最小值到最大值，除以平均值后画出：2 维时从 0.03 到 3，10000 维时挤在 0.98 到 1.02 之间');
}

// ---------- 第 1 站：XOR ----------
function xor() {
  const P = [[0, 1, 1], [1, 0, 1], [0, 0, -1], [1, 1, -1]];
  let o = '';
  const panel = (x0, title) => {
    const sx = lin(-0.3, 1.3, x0, x0 + 200), sy = lin(-0.3, 1.3, 230, 30);
    return { sx, sy, head: text(x0 + 100, 20, title, 'tb', 'middle') + rect(sx(-0.3), sy(1.3), 200, 200, 'frame') };
  };
  const pts = (sx, sy, wrong) => P.map(([a, b, y], i) => (y > 0 ? circle(sx(a), sy(b), 8, 'solid') + text(sx(a), sy(b) + 4, '+', 'tw', 'middle') : circle(sx(a), sy(b), 8, 'paper') + text(sx(a), sy(b) + 4, '−', 'tb', 'middle')) + (wrong && wrong(a, b, y) ? circle(sx(a), sy(b), 13, 'dash') : '')).join('');
  // 左：一条 line x1 + x2 = 0.5
  const L = panel(30, '一条 line：总有一个点在错的一侧');
  o += L.head + path(d([[L.sx(-0.3), L.sy(0.8)], [L.sx(0.8), L.sy(-0.3)]]), 'ln');
  o += pts(L.sx, L.sy, (a, b, y) => (a + b - 0.5 > 0 ? 1 : -1) !== y);
  o += text(L.sx(0.75), L.sy(-0.18), 'x₁ + x₂ = ½', 'tl');
  // 右：x1 + x2 − 2x1x2 − ½ = −2(x1 − ½)(x2 − ½)
  const R = panel(310, '加上 feature x₁x₂');
  o += R.head + rect(R.sx(-0.3), R.sy(1.3), R.sx(0.5) - R.sx(-0.3), R.sy(0.5) - R.sy(1.3), 'wash') + rect(R.sx(0.5), R.sy(0.5), R.sx(1.3) - R.sx(0.5), R.sy(-0.3) - R.sy(0.5), 'wash');
  o += line(R.sx(0.5), R.sy(-0.3), R.sx(0.5), R.sy(1.3), 'ln') + line(R.sx(-0.3), R.sy(0.5), R.sx(1.3), R.sy(0.5), 'ln');
  o += pts(R.sx, R.sy, null);
  o += text(410, 256, 'x₁ + x₂ − 2x₁x₂ − ½ = −2(x₁ − ½)(x₂ − ½) > 0：浅色两块', 'ts', 'middle');
  return svg(560, 266, o, 'XOR 的四个点：左边任何一条 line 都至少分错一个点；右边加上 x1 x2 这个 feature 之后，规则在原平面上的 boundary 是 x1 等于二分之一和 x2 等于二分之一两条 line，positive 点落在对角的两块里');
}

// ---------- 第 2 站：undirected graph 上的 random walk ----------
function undirected() {
  const E = [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4]];
  const deg = [0, 0, 0, 0, 0];
  for (const [i, j] of E) { deg[i]++; deg[j]++; }
  const m2 = deg.reduce((a, b) => a + b, 0), pi = deg.map((x) => x / m2);
  const pos = [[110, 120], [260, 45], [260, 200], [400, 200], [515, 200]];
  const r = pi.map((p) => 8 + 42 * Math.sqrt(p));
  let o = '';
  for (const [i, j] of E) {
    const [A, B] = [pos[i], pos[j]], dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    o += line(A[0] + dx / L * r[i], A[1] + dy / L * r[i], B[0] - dx / L * r[j], B[1] - dy / L * r[j], 'ink');
  }
  pos.forEach(([x, y], i) => { o += circle(x, y, r[i], 'wash ink-s') + text(x, y + 5, String(i + 1), 'tb', 'middle'); });
  const lab = (i) => `degree ${deg[i]}，π = ${deg[i]}/${m2} = ${pi[i].toFixed(1)}`;
  o += text(pos[0][0], pos[0][1] + r[0] + 18, lab(0), 'ts', 'middle') + text(pos[1][0] + r[1] + 8, pos[1][1] + 4, lab(1), 'ts');
  o += text(pos[2][0], pos[2][1] + r[2] + 18, lab(2), 'ts', 'middle');
  o += text(pos[3][0], pos[3][1] - r[3] - 26, `degree ${deg[3]}`, 'ts', 'middle') + text(pos[3][0], pos[3][1] - r[3] - 10, `π = ${pi[3].toFixed(1)}`, 'ts', 'middle');
  o += text(pos[4][0], pos[4][1] - r[4] - 26, `degree ${deg[4]}`, 'ts', 'middle') + text(pos[4][0], pos[4][1] - r[4] - 10, `π = ${pi[4].toFixed(1)}`, 'ts', 'middle');
  return svg(560, 262, o, '五个 node 的 undirected graph，edge 为 1-2、1-3、2-3、3-4、4-5；圆的面积正比于 stationary distribution，也就是 degree 除以 10');
}

// ---------- 第 5 站：两层网络的一次 forward 与 backward ----------
function backprop() {
  const W = [[0.5, -0.5], [0.3, 0.8]], b = [0, -0.2], v = [1, -1], c = 0, x = [1, 0], y = 1;
  const a = [0, 1].map((i) => W[i][0] * x[0] + W[i][1] * x[1] + b[i]);
  const h = a.map(Math.tanh), z = v[0] * h[0] + v[1] * h[1] + c, yh = 1 / (1 + Math.exp(-z)), L = -Math.log(yh);
  const d2 = yh - y, dv = h.map((q) => d2 * q), dh = v.map((q) => d2 * q), d1 = dh.map((q, i) => q * (1 - h[i] * h[i]));
  const f = (q) => q.toFixed(4).replace('-', '−'), vec = (q) => `(${q.map(f).join(', ')})`;
  const rows = [
    ['x', vec(x).replace(/\.0000/g, ''), ''],
    ['Wx + b', vec(a), `δ₁ = ${vec(d1)}`],
    ['h = tanh(·)', vec(h), `∂L/∂h = δ₂ v = ${vec(dh)}`],
    ['z = v·h + c', f(z), `δ₂ = ŷ − y = ${f(d2)}`],
    ['ŷ = σ(z)', f(yh), ''],
    ['L = −log ŷ', f(L), ''],
  ];
  const bx = 200, bw = 130, y0 = 44, gap = 34;
  let o = text(bx - 14, 24, 'forward（存下来）', 'tb', 'end') + text(bx + bw + 14, 24, 'backward', 'tl');
  rows.forEach(([lab, fw, bwd], i) => {
    const yy = y0 + i * gap;
    o += rect(bx, yy, bw, 24, i === 0 ? 'wash2' : 'paper', 5) + text(bx + bw / 2, yy + 17, lab, 't', 'middle');
    o += text(bx - 14, yy + 17, fw, 't', 'end');
    if (bwd) o += text(bx + bw + 14, yy + 17, bwd, 'tl');
    if (i > 0) o += arrow(bx + 30, yy - gap + 25, bx + 30, yy - 1, 'mute');
  });
  o += arrow(bx + bw - 22, y0 + 3 * gap - 1, bx + bw - 22, y0 + 2 * gap + 25, 'ln') + arrow(bx + bw - 22, y0 + 2 * gap - 1, bx + bw - 22, y0 + gap + 25, 'ln');
  o += text(bx + bw + 14, y0 + 3 * gap + 36, `∂L/∂v = δ₂ h = ${vec(dv)}`, 'ts');
  o += text(bx + bw + 14, y0 + 1 * gap + 36, 'δ₁ = ∂L/∂h ⊙ (1 − h²)', 'ts');
  o += text(30, 262, '∂L/∂W = δ₁xᵀ，∂L/∂b = δ₁；每个 δ 只算一次，被这一层的所有 parameter 共用', 'ts');
  return svg(560, 272, o, '两层网络对一个 sample 的计算：左边是 forward 时存下的中间值，右边是从后往前算的 derivative');
}

// ---------- 第 8 站：3 个位置之间的 optimal transport ----------
function otPlan() {
  const a = [0.5, 0.3, 0.2], b = [0.1, 0.3, 0.6];
  // 一维：按顺序依次配对（north-west corner）
  const P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], ra = a.slice(), rb = b.slice();
  let i = 0, j = 0;
  while (i < 3 && j < 3) { const q = Math.min(ra[i], rb[j]); P[i][j] = q; ra[i] -= q; rb[j] -= q; if (ra[i] < 1e-12) i++; else j++; }
  const cost = P.reduce((s2, row, ii) => s2 + row.reduce((t, q, jj) => t + q * (ii - jj) ** 2, 0), 0);
  const X = (k) => 110 + k * 170, yS = 70, yT = 190, H = 120;
  let o = text(30, yS - 34, 'source a', 'tb') + text(30, yT + 52, 'target b', 'tb');
  for (let k = 0; k < 3; k++) {
    o += rect(X(k) - 30, yS - a[k] * H * 0.5, 60, a[k] * H * 0.5, 'solid') + text(X(k) + 36, yS - 4, a[k].toFixed(1), 'tl');
    o += rect(X(k) - 30, yT, 60, b[k] * H * 0.5, 'wash-strong') + text(X(k) + 36, yT + 14, b[k].toFixed(1), 't');
    o += text(X(k), yT + b[k] * H * 0.5 + 16, 'x = ' + k, 'ts', 'middle');
  }
  for (let ii = 0; ii < 3; ii++) for (let jj = 0; jj < 3; jj++) if (P[ii][jj] > 1e-9) {
    const x1 = X(ii) + (jj - 1) * 14, x2 = X(jj) + (ii - 1) * 14;
    o += arrow(x1, yS + 4, x2, yT - 4, ii === jj ? 'mute' : 'ink');
    // 标注放在箭头旁边、避开别的箭头：(0,2) 放得靠下，(0,0)、(0,1)、(0,2) 放在左侧
    const t = ii === 0 && jj === 2 ? 0.72 : 0.5, left = ii === 0;
    const lx = x1 + (x2 - x1) * t, ly = yS + 4 + (yT - yS - 8) * t;
    o += text(lx + (left ? -6 : 6), ly + 4, `${P[ii][jj].toFixed(1)}，cost ${(ii - jj) ** 2}`, 'ts', left ? 'end' : 'start');
  }
  o += text(30, 276, `⟨C, P*⟩ = 0.3×1 + 0.1×4 + 0.3×1 = ${cost.toFixed(1)}（C = (i − j)²）`, 't');
  return svg(560, 288, o, '位置 0、1、2 上的 source mass 0.5、0.3、0.2 搬到 target mass 0.1、0.3、0.6：从左到右依次配对，总 cost 为 1.0');
}

// ---------- 第 8 站开头：WGAN 的 Example 1，两条平行 segment ----------
function wgan() {
  const ths = [1.2, 1.5, 1, 0.6, 0.3, 0.1, 0.03, 0];
  const { T, kt } = timeline(ths.map((t, i) => (i === 0 ? 3.2 : i === ths.length - 1 ? 2.4 : 1.2)));
  const LOG2 = Math.log(2);
  const W = (t) => Math.abs(t), TV = (t) => (t === 0 ? 0 : 1), JS = (t) => (t === 0 ? 0 : LOG2);
  // 左：平面上的两条 segment
  const lx = lin(-0.35, 1.75, 40, 262), ly = lin(0, 1, 196, 56);
  let o = text(150, 22, '平面上的两个 distribution', 'tb', 'middle');
  o += line(lx(-0.35), ly(0), lx(1.75), ly(0), 'axis') + text(lx(1.75), ly(0) + 16, 'x', 'ts', 'end');
  for (const v of [0, 1]) o += line(lx(v), ly(0), lx(v), ly(0) + 4, 'axis') + text(lx(v), ly(0) + 16, String(v), 'ts', 'middle');
  o += line(lx(0), ly(0), lx(0), ly(1), 'ink-b') + text(lx(0) - 8, ly(1) + 4, 'P₀', 'tb', 'end');
  // 右：四个量作为 θ 的 function
  const sx = lin(0, 1.6, 330, 540), sy = lin(0, 1.7, 196, 40);
  o += text(435, 22, '四个量随 θ 的变化', 'tb', 'middle');
  o += axes({ sx, sy, x0: 0, x1: 1.6, y0: 0, y1: 1.7, xt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], yt: [[LOG2, 'log 2'], [1, '1']] });
  o += text(sx(1.6), sy(0) + 32, 'θ', 'ts', 'end');
  o += path(d([[sx(0), sy(0)], [sx(1.6), sy(1.6)]]), 'ln');
  o += line(sx(0) + 4, sy(1), sx(1.6), sy(1), 'ink') + line(sx(0) + 4, sy(LOG2), sx(1.6), sy(LOG2), 'mute');
  o += circle(sx(0), sy(1), 3.5, 'paper') + circle(sx(0), sy(LOG2), 3.5, 'paper') + circle(sx(0), sy(0), 3.5, 'ink-f');
  o += text(sx(1.18), sy(1.18) - 12, 'W₁ = |θ|', 'tl', 'end');
  o += text(sx(1.6), sy(1) - 6, 'TV = 1', 'ts', 'end') + text(sx(1.6), sy(LOG2) + 15, 'JS = log 2', 'ts', 'end');
  o += text(sx(0.05), sy(1.7) + 4, 'KL = +∞（θ ≠ 0 时）', 'ts');
  // 每一帧
  const fmt = (v) => v.toFixed(2);
  ths.forEach((t, k) => {
    const on = onlyAt(ths.length, k);
    let g = line(lx(t), ly(0), lx(t), ly(1), 'ln') + text(lx(t) + 8, ly(1) + 4, 'P' + sub('θ'), 'tl');
    if (t > 0.05) for (const z of [0.2, 0.5, 0.8]) g += arrow(lx(0) + 4, ly(z), lx(t) - 4, ly(z), 'mute', 6);
    if (t > 0) g += text((lx(0) + lx(t)) / 2, ly(1) - 10, `θ = ${fmt(t)}`, 'ts', 'middle');
    else g += text(lx(0) + 8, ly(1) - 12, 'θ = 0：两条重合', 'ts');
    g += line(sx(t), sy(0), sx(t), sy(1.62), 'grid');
    g += circle(sx(t), sy(W(t)), 4.5, 'ln-f') + circle(sx(t), sy(TV(t)), 4, 'ink-f') + circle(sx(t), sy(JS(t)), 4, 'mute-f');
    const vals = t === 0 ? 'W₁ = 0，TV = 0，JS = 0，KL = 0' : `W₁ = ${fmt(W(t))}，TV = 1，JS = 0.693，KL = +∞`;
    g += text(150, 232, vals, t === 0 ? 'tb' : 't', 'middle');
    g += text(150, 252, t === 0 ? '只有 θ 恰好为 0 时其余三个量才变' : '只有 W₁ 随 θ 变小而变小', 'ts', 'middle');
    o += `<g>${g}${ashow(on, kt, T)}</g>`;
  });
  o += text(435, 252, '空心圈：θ → 0 时的极限；实心点：θ = 0 时的值', 'ts', 'middle');
  return svgA(560, 262, o, '动图：P0 是 x 等于 0 处竖直 segment 上的 uniform distribution，P theta 是把它平移到 x 等于 theta。Theta 从 1.5 一路减到 0：Wasserstein-1 distance 等于 theta，跟着变小；total variation 一直是 1，JS 一直是 log 2，KL 一直是正无穷，直到 theta 恰好等于 0 才一起跳到 0');
}

export default {
  'ma3270-wgan': wgan,
  'ma3270-centroid': centroid,
  'ma3270-pagerank': pagerank,
  'ma3270-bigram': bigram,
  'ma3270-is': isamp,
  'ma3270-mh': mhtrace,
  'ma3270-zigzag': zigzag,
  'ma3270-shell': shell,
  'ma3270-l1': l1ball,
  'ma3270-phase': phase,
  'ma3270-sinkhorn': sinkhorn,
  'ma3270-spread': spread,
  'ma3270-xor': xor,
  'ma3270-undirected': undirected,
  'ma3270-backprop': backprop,
  'ma3270-ot': otPlan,
};
