import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, anim, ashow, apath, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const box = (cx, cy, w, h, cls = 'paper') => rect(cx - w / 2, cy - h / 2, w, h, cls, 6);
const grid = (x, y, rows, cols, cw, ch, cls = 'frame') => {
  let o = '';
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) o += rect(x + j * cw, y + i * ch, cw, ch, cls);
  return o;
};
const vals = (x, y, M, cw, ch, cls = 't', fmt = String) => {
  let o = '';
  M.forEach((row, i) => row.forEach((v, j) => { o += text(x + j * cw + cw / 2, y + i * ch + ch / 2 + 4.5, fmt(v), cls, 'middle'); }));
  return o;
};
const neg = (s) => String(s).replace('-', '−');
const fmt2 = (v) => { const r = Math.round(v * 100) / 100; return neg(Math.abs(r) < 1e-9 ? '0' : r.toFixed(2).replace(/\.?0+$/, '')); };
// 一段内容只在某些 state 出现
const showG = (body, on, kt, T) => `<g>${body}${ashow(on, kt, T)}</g>`;
// keyTimes：第一个 state 停 hold0 秒，之后每个 state 停 step 秒，最后一个 state 停 hold1 秒
function timeline(n, hold0, step, hold1) {
  const T = hold0 + step * (n - 2) + hold1;
  const kt = [0];
  for (let s = 1; s < n; s++) kt.push((hold0 + step * (s - 1)) / T);
  return { T, kt };
}
const V = (k) => 'v' + '̄' + '₀₁₂₃₄₅₆₇₈₉'[k];
const v = (k) => 'v' + '₀₁₂₃₄₅₆₇₈₉'[k];

// ---------- 第 1 站：reverse mode 在 graph 上逐个 node 造出 adjoint ----------
function adgraphA() {
  const x = Math.log(2), v2 = Math.exp(x), v3 = v2 + 1, v4 = v2 * v3;
  const b4 = 1, b24 = b4 * v3, b3 = b4 * v2, b2 = b24 + b3, b1 = b2 * Math.exp(x);
  const node = (cx, cy, w, l1, l2, cls = 'paper') => box(cx, cy, w, 40, cls) + text(cx, cy - 3, l1, 't', 'middle') + text(cx, cy + 13, l2, 'ts', 'middle');
  let o = text(14, 14, 'forward graph', 'tb') + text(552, 272, 'backward 时', 'tb', 'end') + text(552, 290, '新造的 node', 'tb', 'end');
  // forward
  o += arrow(112, 50, 144, 50, 'ink') + arrow(246, 42, 418, 42, 'ink') + arrow(226, 70, 290, 98, 'ink') + arrow(372, 98, 436, 70, 'ink');
  o += node(62, 50, 100, v(1) + ' = x', '= ln 2 ≈ 0.693');
  o += node(196, 50, 100, v(2) + ' = exp(' + v(1) + ')', '= ' + v2);
  o += node(330, 118, 100, v(3) + ' = ' + v(2) + ' + 1', '= ' + v3);
  o += node(470, 50, 100, v(4) + ' = ' + v(2) + ' × ' + v(3), '= ' + v4);
  // 状态：0 = 全部算完（静态帧），1 = 只有 forward，2..5 逐步加 node，5 与 0 相同
  const { T, kt } = timeline(6, 3.2, 2.1, 2.6);
  const at = (s) => [0, 1, 2, 3, 4, 5].map((k) => k === 0 || k >= s);
  // step 2：seed
  o += showG(node(470, 212, 84, V(4) + ' = 1', 'seed', 'wash'), at(2), kt, T);
  // step 3：处理 v4，给两个 input 各造一个 partial adjoint
  o += showG(
    line(340, 138, 346, 176, 'dash') + line(215, 70, 290, 262, 'dash') +
    arrow(428, 206, 412, 200, 'ln') + arrow(446, 232, 412, 274, 'ln') +
    node(350, 196, 116, V(2) + '→₄ = ' + V(4) + ' · ' + v(3), '= ' + b24, 'wash') +
    node(350, 284, 116, V(3) + ' = ' + V(4) + ' · ' + v(2), '= ' + b3, 'wash'), at(3), kt, T);
  // step 4：处理 v3 和 v2 的两条路：相加
  o += showG(arrow(292, 204, 264, 230, 'ln') + arrow(292, 278, 264, 252, 'ln') +
    node(200, 240, 124, V(2) + ' = ' + V(2) + '→₄ + ' + V(3), '= ' + b24 + ' + ' + b3 + ' = ' + b2, 'wash'), at(4), kt, T);
  // step 5：处理 v1
  o += showG(line(176, 70, 92, 220, 'dash') + arrow(138, 240, 117, 240, 'ln') +
    node(58, 240, 112, V(1) + ' = ' + V(2) + ' · exp(' + v(1) + ')', '= ' + b2 + ' × ' + v2 + ' = ' + b1, 'wash-strong'), at(5), kt, T);
  // 说明文字，每个 state 一句
  const cap = [
    '走完了：' + V(1) + ' = ' + b1 + '，正是 f′(x) = 2e²ˣ + eˣ 在 x = ln 2 的值。虚线是 backward 用到的 forward 值。',
    'Forward 已经算完。Reverse mode 从 output 出发，按 reverse topological order 处理每个 node。',
    '先放一个 seed：' + V(4) + ' = ∂y/∂' + v(4) + ' = 1。',
    '处理 ' + v(4) + ' = ' + v(2) + ' × ' + v(3) + '：用 ' + V(4) + ' 和两个 input 的值，给每个 input 造一个 partial adjoint。',
    v(3) + ' 处理完后，' + v(2) + ' 收到两条路的 partial adjoint：' + b24 + ' 和 ' + b3 + '，相加得 ' + b2 + '。',
    '最后处理 ' + v(2) + ' = exp(' + v(1) + ')：' + V(1) + ' = ' + V(2) + ' · exp(' + v(1) + ') = ' + b1 + '。',
  ];
  cap.forEach((s, k) => { o += `<text x="280" y="330" class="ts" text-anchor="middle">${s}${ashow([0, 1, 2, 3, 4, 5].map((j) => j === k), kt, T)}</text>`; });
  return svgA(560, 336, o, '动图：f(x) = e^x (e^x + 1) 在 x = ln 2 的 computational graph。Reverse mode 按 reverse topological order 逐个处理 node，每一步都往 graph 里加新的 node：v4 的 adjoint 为 1，v2 经两条路得到 3 和 2，相加为 5，最后 v1 的 adjoint 为 10');
}

// ---------- 第 1 站：BroadcastTo 与 Summation 的 gradient 互为对方 ----------
function bcast() {
  const cw = 28, ch = 22;
  let o = text(140, 14, 'forward', 'tb', 'middle') + text(420, 14, 'gradient：返回 input 的 shape', 'tb', 'middle');
  o += line(282, 22, 282, 214, 'grid');
  // 第一行：BroadcastTo (3,) -> (2, 3)
  const b = [1, 2, 3], g1 = [[1, 0, 2], [3, 1, 1]];
  const sum0 = g1[0].map((_, j) => g1[0][j] + g1[1][j]);
  o += text(14, 44, 'BroadcastTo', 'ts');
  o += grid(14, 52, 1, 3, cw, ch) + vals(14, 52, [b], cw, ch);
  o += arrow(104, 63, 150, 63, 'ink') + text(127, 54, '复制', 'ts', 'middle');
  o += grid(158, 41, 2, 3, cw, ch, 'wash') + vals(158, 41, [b, b], cw, ch);
  o += text(206, 104, 'shape (2, 3)', 'ts', 'middle') + text(56, 92, 'shape (3,)', 'ts', 'middle');
  o += grid(300, 41, 2, 3, cw, ch, 'wash') + vals(300, 41, g1, cw, ch);
  o += arrow(390, 63, 436, 63, 'ln') + text(413, 34, '沿 axis 0 加', 'ts', 'middle');
  o += grid(444, 52, 1, 3, cw, ch, 'wash-strong') + vals(444, 52, [sum0], cw, ch, 'tb');
  o += text(342, 104, 'out_grad', 'ts', 'middle') + text(486, 92, '回到 (3,)', 'ts', 'middle');
  // 第二行：Summation(axes=(1,)) (2,3) -> (2,)
  const X = [[1, 2, 3], [4, 5, 6]], s1 = X.map((r) => r.reduce((a, c) => a + c, 0)), g2 = [10, 20];
  o += text(14, 134, 'Summation(axes=(1,))', 'ts');
  o += grid(14, 142, 2, 3, cw, ch) + vals(14, 142, X, cw, ch);
  o += arrow(104, 164, 150, 164, 'ink') + text(127, 155, '每行加', 'ts', 'middle');
  o += grid(158, 142, 2, 1, cw, ch, 'wash') + vals(158, 142, s1.map((v) => [v]), cw, ch);
  o += text(56, 204, 'shape (2, 3)', 'ts', 'middle') + text(172, 204, 'shape (2,)', 'ts', 'middle');
  o += grid(300, 142, 2, 1, cw, ch, 'wash') + vals(300, 142, g2.map((v) => [v]), cw, ch);
  o += arrow(338, 164, 436, 164, 'ln') + text(387, 155, 'reshape (2, 1)', 'ts', 'middle') + text(387, 180, '再 broadcast', 'ts', 'middle');
  o += grid(444, 142, 2, 3, cw, ch, 'wash-strong') + vals(444, 142, g2.map((v) => [v, v, v]), cw, ch, 'tb');
  o += text(314, 204, 'out_grad', 'ts', 'middle') + text(486, 204, '回到 (2, 3)', 'ts', 'middle');
  return svg(560, 210, o, 'BroadcastTo 把 (1, 2, 3) 复制成两行，它的 gradient 把 out_grad 沿 axis 0 加回 (4, 1, 3)；Summation 把每行加起来，它的 gradient 把 out_grad reshape 成一列再 broadcast 回 2 × 3');
}

// ---------- 第 2 站：LayerNorm 与 BatchNorm 沿哪个 axis 做 ----------
function norm() {
  const X = [[1, 2, 3], [3, 6, 9], [5, 2, 1], [7, 6, 3]];
  const eps = 1e-5;
  const stat = (a) => { const m = a.reduce((s, c) => s + c, 0) / a.length; const vv = a.reduce((s, c) => s + (c - m) ** 2, 0) / a.length; return [m, vv]; };
  const LN = X.map((r) => { const [m, vv] = stat(r); return r.map((c) => (c - m) / Math.sqrt(vv + eps)); });
  const cols = [0, 1, 2].map((j) => stat(X.map((r) => r[j])));
  const BN = X.map((r) => r.map((c, j) => (c - cols[j][0]) / Math.sqrt(cols[j][1] + eps)));
  const cw = 30, ch = 24, ow = 42;
  let o = '';
  const panel = (x0, title, out, rowsMode) => {
    o += text(x0 + 128, 16, title, 'tb', 'middle');
    o += grid(x0, 44, 4, 3, cw, ch) + vals(x0, 44, X, cw, ch);
    if (rowsMode) for (let i = 0; i < 4; i++) o += rect(x0 - 3, 44 + i * ch + 2, 3 * cw + 6, ch - 4, 'ln', 8);
    else for (let j = 0; j < 3; j++) o += rect(x0 + j * cw + 3, 41, cw - 6, 4 * ch + 6, 'ln', 8);
    o += arrow(x0 + 98, 92, x0 + 124, 92, 'ink');
    o += grid(x0 + 130, 44, 4, 3, ow, ch, 'wash') + vals(x0 + 130, 44, out, ow, ch, 't', fmt2);
    o += text(x0, 36, 'batch 4 × feature 3', 'ts');
  };
  panel(14, 'LayerNorm：每个 row 各自 normalize', LN, true);
  panel(296, 'BatchNorm：每个 column 跨 batch', BN, false);
  const r2 = (vv) => neg(Math.round(vv * 100) / 100);
  o += text(14, 160, 'row mean：' + X.map((r) => r2(stat(r)[0])).join('，'), 'ts');
  o += text(14, 178, '前两行差 3 倍，normalize 之后完全一样', 'ts');
  o += text(296, 160, 'column mean：' + cols.map((c) => r2(c[0])).join('，') + '；var：' + cols.map((c) => r2(c[1])).join('，'), 'ts');
  o += text(296, 178, 'eval 时改用 running mean / var', 'ts');
  return svg(560, 184, o, '同一个 4 乘 3 的 batch：LayerNorm 对每一行求 mean 和 variance，前两行 normalize 后相同；BatchNorm 对每一列求，三列的 mean 都是 4');
}

// ---------- 第 3 站：compact() 按 A.T 的逻辑顺序从 handle 里取数 ----------
function compactA() {
  const cw = 34, chh = 26, gx = 60, gy = 44;
  const order = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) order.push([i, j, i * 1 + j * 4]);
  const states = [11, ...order.map((_, k) => k)];
  const { T, kt } = timeline(states.length, 1.8, 0.8, 1.8);
  let o = '';
  // 逻辑上的 A.T
  for (let j = 0; j < 3; j++) o += text(gx + j * cw + cw / 2, gy - 8, 'j=' + j, 'ts', 'middle');
  for (let i = 0; i < 4; i++) o += text(gx - 8, gy + i * chh + 17, 'i=' + i, 'ts', 'end');
  const xs = states.map((k) => f1(gx + order[k][1] * cw)), ys = states.map((k) => f1(gy + order[k][0] * chh));
  o += `<rect x="${xs[0]}" y="${ys[0]}" width="${cw}" height="${chh}" class="wash-strong">${anim('x', xs, kt, T, true)}${anim('y', ys, kt, T, true)}</rect>`;
  o += grid(gx, gy, 4, 3, cw, chh);
  for (const [i, j, off] of order) o += text(gx + j * cw + cw / 2, gy + i * chh + 17, String(off), 't', 'middle');
  o += text(200, 52, 'A.T 这个 view：shape (4, 3)，strides (1, 4)，offset 0', 't');
  o += text(200, 72, 'element (i, j) 存在 handle 的第 0 + 1·i + 4·j 格', 'ts');
  states.forEach((k, s) => {
    const [i, j, off] = order[k];
    o += `<text x="200" y="104" class="tl" text-anchor="start">(i, j) = (${i}, ${j}) → 0 + 1·${i} + 4·${j} = ${off}${ashow(states.map((_, t) => t === s), kt, T)}</text>`;
  });
  // handle
  const bx = 52, bw = 38, by = 170, oy = 252;
  o += text(bx, by - 8, 'handle：12 个 float，按 A 的 row-major 顺序存（没有动过）', 'ts');
  const hx = states.map((k) => f1(bx + order[k][2] * bw));
  o += `<rect x="${hx[0]}" y="${by}" width="${bw}" height="26" class="wash-strong">${anim('x', hx, kt, T, true)}</rect>`;
  o += grid(bx, by, 1, 12, bw, 26);
  for (let c = 0; c < 12; c++) o += text(bx + c * bw + bw / 2, by + 18, String(c), 't', 'middle');
  // output
  o += text(bx, oy - 8, 'compact() 写进的新 buffer：按 A.T 自己的 row-major 顺序', 'ts');
  const ox = states.map((k) => f1(bx + k * bw));
  o += `<rect x="${ox[0]}" y="${oy}" width="${bw}" height="26" class="wash-strong">${anim('x', ox, kt, T, true)}</rect>`;
  o += grid(bx, oy, 1, 12, bw, 26);
  order.forEach(([, , off], k) => { o += `<text x="${f1(bx + k * bw + bw / 2)}" y="${oy + 18}" class="t" text-anchor="middle">${off}${ashow(states.map((s) => s >= k), kt, T)}</text>`; });
  o += apath(states.map((k) => d([[bx + order[k][2] * bw + bw / 2, by + 28], [bx + k * bw + bw / 2, oy - 4]])), kt, T, 'ln', true);
  o += text(bx, oy + 46, '写出来的顺序 0, 4, 8, 1, 5, 9, … 不是等差的：A.T 无法不复制就 reshape 成 (12,)', 'ts');
  return svgA(560, 300, o, '动图：A 是 3 乘 4 的 arange(12)，A.T 的 strides 是 (1, 4)。compact 按 A.T 的逻辑顺序逐个 element 计算 offset，从 handle 里取出 0、4、8、1、5、9 等，写进新的 buffer');
}

// ---------- 第 3 站：同一块 memory 的三个 view ----------
function views() {
  const A = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];
  const cw = 26, ch = 22, bw = 15;
  let o = '';
  const panel = (x0, title, l1, l2, M, touched, note) => {
    o += text(x0, 14, title, 'tb') + text(x0, 32, l1, 'ts') + text(x0, 48, l2, 'ts');
    o += grid(x0, 60, M.length, M[0].length, cw, ch, 'wash') + vals(x0, 60, M, cw, ch);
    const by = 150;
    o += text(x0, by - 8, 'handle', 'ts');
    for (let c = 0; c < 12; c++) {
      o += rect(x0 + c * bw, by, bw, 20, touched.includes(c) ? 'wash-strong' : 'frame');
      o += text(x0 + c * bw + bw / 2, by + 14.5, String(c), 'ts', 'middle');
    }
    o += text(x0, by + 40, note, 'ts');
  };
  panel(4, 'A', 'shape (3, 4)，offset 0', 'strides (4, 1)', A, A.flat(), '12 格各用一次');
  const S = [[4, 6], [8, 10]];
  panel(194, 'A[1:3, ::2]', 'shape (2, 2)，offset 4', 'strides (4, 2)', S, S.flat(), 'start 改 offset，step 乘 stride');
  const Bc = [A[1], A[1], A[1]];
  panel(384, 'A[1:2, :] broadcast 到 (3, 4)', 'shape (3, 4)，offset 4', 'strides (0, 1)', Bc, A[1], '4 格各被读 3 次');
  return svg(560, 196, o, '同一个 12 格的 handle 上的三个 view：A 本身；slice A[1:3, ::2] 的 offset 是 4、strides 是 (4, 2)；把第二行 broadcast 成三行，第一个 stride 是 0');
}

// ---------- 第 4 站：register tiling，一个 v1 × v2 的 tile 沿 k 走 ----------
function regtileA() {
  const n = 6, v1 = 2, v2 = 3, c = 18;
  const Ax = 28, Bx = 210, Cx = 396, Y = 58;
  const states = [n - 1, ...Array.from({ length: n }, (_, k) => k)];
  const { T, kt } = timeline(states.length, 2.2, 1.3, 2.4);
  let o = text(Ax + 54, 22, 'A', 'tb', 'middle') + text(Ax + 54, 40, 'row i = 0, 1', 'ts', 'middle');
  o += text(Bx + 54, 22, 'B（C = A Bᵀ）', 'tb', 'middle') + text(Bx + 54, 40, 'row j = 0, 1, 2', 'ts', 'middle');
  o += text(Cx + 54, 22, 'C', 'tb', 'middle') + text(Cx + 54, 40, 'v₁ × v₂ = 2 × 3 的 tile', 'ts', 'middle');
  o += rect(Ax, Y, n * c, v1 * c, 'wash') + rect(Bx, Y, n * c, v2 * c, 'wash') + rect(Cx, Y, v2 * c, v1 * c, 'wash-strong');
  const ax = states.map((k) => f1(Ax + k * c)), bx = states.map((k) => f1(Bx + k * c));
  o += `<rect x="${ax[0]}" y="${Y}" width="${c}" height="${v1 * c}" class="solid">${anim('x', ax, kt, T, true)}</rect>`;
  o += `<rect x="${bx[0]}" y="${Y}" width="${c}" height="${v2 * c}" class="solid">${anim('x', bx, kt, T, true)}</rect>`;
  o += grid(Ax, Y, n, n, c, c) + grid(Bx, Y, n, n, c, c) + grid(Cx, Y, n, n, c, c);
  o += text(Ax + 54, Y + n * c + 18, 'k →', 'ts', 'middle') + text(Bx + 54, Y + n * c + 18, 'k →', 'ts', 'middle');
  o += text(Cx + 54, Y + n * c + 18, '6 个 partial sum 一直在 register', 'ts', 'middle');
  o += text(Ax + n * c + 37, Y + 50, '×', 'tbig', 'middle') + text(Bx + n * c + 40, Y + 50, '→', 'tbig', 'middle');
  states.forEach((k, s) => {
    const on = states.map((_, t) => t === s);
    const loads = (k + 1) * (v1 + v2), fma = (k + 1) * v1 * v2;
    o += `<g>${text(28, 214, 'k = ' + k + '：读进 A 的 ' + v1 + ' 个数、B 的 ' + v2 + ' 个数，做 ' + v1 * v2 + ' 次 multiply-add（每个数被用 ' + v2 + ' 次或 ' + v1 + ' 次）', 'tl')}${text(28, 236, '累计：读 ' + loads + ' 个数、做 ' + fma + ' 次 multiply-add；不分 tile 要读 ' + 2 * fma + ' 个', 't')}${ashow(on, kt, T)}</g>`;
  });
  const tiles = (n / v1) * (n / v2);
  o += text(28, 266, '整个 C 有 ' + tiles + ' 个 tile：A 一共读 n³/v₂ = ' + n ** 3 / v2 + ' 次，B 一共读 n³/v₁ = ' + n ** 3 / v1 + ' 次，合计 ' + (n ** 3 / v1 + n ** 3 / v2) + '，不分 tile 是 2n³ = ' + 2 * n ** 3, 'ts');
  return svgA(560, 274, o, '动图：n 等于 6，C = A 乘 B 的 transpose。一个 2 乘 3 的 C tile 沿 k 走 6 步，每步读 A 的两个数和 B 的三个数、做 6 次 multiply-add，这个 tile 共读 30 个数，不分 tile 要 72 个');
}

// ---------- 第 4 站：同一个 6 × 6 matrix 的两种 memory 顺序 ----------
function tiled() {
  const n = 6, t = 2, c = 22, X0 = 24, Y0 = 34;
  const tileId = (r, cc) => Math.floor(r / t) * (n / t) + Math.floor(cc / t);
  let o = text(X0, 20, '6 × 6 matrix，按 2 × 2 切 tile', 'tb');
  for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) {
    o += rect(X0 + cc * c, Y0 + r * c, c, c, (Math.floor(r / t) + Math.floor(cc / t)) % 2 ? 'wash-strong' : 'wash');
    o += text(X0 + cc * c + c / 2, Y0 + r * c + 15, String(r * n + cc), 't', 'middle');
  }
  o += grid(X0, Y0, n, n, c, c);
  // tiled 顺序：as_strided(shape=(3,3,2,2), strides=(12,2,6,1)) 再 compact
  const st = [2 * n, t, n, 1], ord = [];
  for (let I = 0; I < n / t; I++) for (let J = 0; J < n / t; J++) for (let a = 0; a < t; a++) for (let b = 0; b < t; b++) ord.push(I * st[0] + J * st[1] + a * st[2] + b * st[3]);
  const tx = 196;
  o += text(tx, 48, 'as_strided(A, shape=(3, 3, 2, 2), strides=(12, 2, 6, 1))', 't');
  o += text(tx, 68, '前两维挑 tile：下移一个 tile 跳 12，右移一个 tile 跳 2', 'ts');
  o += text(tx, 86, '后两维在 tile 里走：下一行跳 6，下一列跳 1', 'ts');
  o += text(tx, 112, '这一步不复制；再 compact，tile 就成了连续的 4 格', 'ts');
  o += text(tx, 130, '一个 TILE × TILE 的块可以一次整块读进来', 'ts');
  const bw = 14.5, B1 = 190, B2 = 248;
  const row = (y, seq, label) => {
    o += text(X0, y - 8, label, 'ts');
    seq.forEach((val, k) => {
      const r = Math.floor(val / n), cc = val % n;
      o += rect(X0 + k * bw, y, bw, 22, (Math.floor(r / t) + Math.floor(cc / t)) % 2 ? 'wash-strong' : 'wash') + text(X0 + k * bw + bw / 2, y + 15.5, String(val), 'ts', 'middle');
    });
    o += grid(X0, y, 1, seq.length, bw, 22);
  };
  row(B1, Array.from({ length: n * n }, (_, k) => k), 'row-major（原来的 handle）：tile (0, 0) 的 4 个数 0、1、6、7 分在两段');
  row(B2, ord, 'tiled 之后：每个 tile 的 4 个数挨在一起');
  for (let k = 0; k < n * n; k += t * t) o += line(X0 + k * bw, B2 - 3, X0 + k * bw, B2 + 25, 'ink-b');
  o += line(X0 + n * n * bw, B2 - 3, X0 + n * n * bw, B2 + 25, 'ink-b');
  void tileId;
  return svg(560, 276, o, '一个 6 乘 6 的 matrix 按 2 乘 2 切成 9 个 tile。原来的 row-major 顺序里一个 tile 的四个数分在两段；用 strides (12, 2, 6, 1) 重新看再 compact 之后，每个 tile 的四个数连在一起');
}

// ---------- 第 5 站：GPU matmul 的两级 tiling ----------
function gpu() {
  const L = 16, Vt = 4, S = 8, c = 8;
  const Cx = 300, Cy = 110, Ax = Cx - S * c - 18, By = Cy - S * c - 18;
  let o = '';
  // sB：S × L，在 C 的上方
  o += rect(Cx, By, L * c, S * c, 'wash') + grid(Cx, By, S, L, c, c);
  o += rect(Cx + 2 * Vt * c, By + 3 * c, Vt * c, c, 'solid');
  o += text(Cx + L * c + 10, By + 18, 'sB：B 的 S × L 块', 't') + text(Cx + L * c + 10, By + 36, '（shared memory）', 'ts');
  // sA：L × S（按 C 的 row 方向画），在 C 的左边
  o += rect(Ax, Cy, S * c, L * c, 'wash') + grid(Ax, Cy, L, S, c, c);
  o += rect(Ax + 3 * c, Cy + 1 * Vt * c, c, Vt * c, 'solid');
  o += text(Ax - 8, Cy + L * c + 18, 'sA：A 的 S × L 块', 't', 'start');
  // C block
  o += rect(Cx, Cy, L * c, L * c, 'paper');
  for (let i = 0; i < L / Vt; i++) for (let j = 0; j < L / Vt; j++) o += rect(Cx + j * Vt * c, Cy + i * Vt * c, Vt * c, Vt * c, (i === 1 && j === 2) ? 'wash-strong' : 'frame');
  o += text(Cx + L * c + 10, Cy + 40, 'thread (1, 2) 的 V × V', 't') + text(Cx + L * c + 10, Cy + 58, '= 16 个 accumulator', 'ts');
  o += line(Cx + L * c + 6, Cy + 50, Cx + 3 * Vt * c - 2, Cy + 1.5 * Vt * c, 'mute');
  o += text(Cx + L * c + 10, Cy + 104, 'C 的 L × L block', 't') + text(Cx + L * c + 10, Cy + 122, '（一个 thread block）', 'ts');
  // 文字
  const N = 1024, threads = (L / Vt) ** 2, smem = 2 * S * L;
  const g2s = 2 * N ** 3 / L;
  const lines = [
    ['L = ' + L + '，V = ' + Vt + '，S = ' + S, 'tb'],
    ['每个 block (L/V)² = ' + threads + ' 个 thread', 'ts'],
    ['shared memory：2SL = ' + smem + ' 个 float', 'ts'],
    ['每步每个 thread 从 sA、sB', 'ts'],
    ['各取 V 个数（深色）进 register，', 'ts'],
    ['做 V² = ' + Vt * Vt + ' 次 multiply-add', 'ts'],
  ];
  lines.forEach(([s, cls], k) => { o += text(14, 30 + k * 20, s, cls); });
  const fmtE = (x) => (x / 1e6).toFixed(0) + ' 百万';
  o += text(14, 170, 'N = ' + N + ' 时每个 float 的读取次数：', 'ts');
  o += text(14, 190, 'global → shared：2N³/L ≈ ' + fmtE(g2s), 'ts');
  o += text(14, 210, 'shared → register：2N³/V ≈ ' + fmtE(2 * N ** 3 / Vt), 'ts');
  o += text(14, 230, '不分 tile：2N³ ≈ ' + fmtE(2 * N ** 3), 'ts');
  return svg(560, 262, o, 'GPU matmul 的两级 tiling：一个 thread block 负责 C 的 16 乘 16 块，分给 16 个 thread，每个 thread 负责 4 乘 4；A 和 B 各有 8 乘 16 的一块先搬进 shared memory，每个 thread 每步从中各取 4 个数');
}

// ---------- 第 6 站：im2col 是一个 strided view ----------
function im2colA() {
  const n = 6, K = 3, m = n - K + 1, c = 26, X0 = 20, Y0 = 40;
  const states = [m * m - 1, ...Array.from({ length: m * m }, (_, k) => k)];
  const { T, kt } = timeline(states.length, 2.2, 0.6, 2.2);
  let o = text(X0, 22, 'input：6 × 6', 'tb');
  o += grid(X0, Y0, n, n, c, c);
  for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) o += text(X0 + cc * c + c / 2, Y0 + r * c + 17, String(r * n + cc), 't', 'middle');
  const wx = states.map((k) => f1(X0 + (k % m) * c)), wy = states.map((k) => f1(Y0 + Math.floor(k / m) * c));
  o += `<rect x="${wx[0]}" y="${wy[0]}" width="${K * c}" height="${K * c}" class="ln wash" rx="3">${anim('x', wx, kt, T, true)}${anim('y', wy, kt, T, true)}</rect>`;
  o += text(X0, Y0 + n * c + 22, '每格的值就是它在 handle 里的位置', 'ts');
  o += text(X0, Y0 + n * c + 46, 'view：shape (4, 4, 3, 3)', 'ts');
  o += text(X0, Y0 + n * c + 64, 'strides (6, 1, 6, 1)，不复制', 'ts');
  o += text(X0, Y0 + n * c + 88, 'reshape 成 16 × 9 才复制：', 'ts');
  o += text(X0, Y0 + n * c + 106, m * m * K * K + ' 个数，原来只有 ' + n * n + ' 个', 'ts');
  // im2col matrix
  const Mx = 232, My = 40, mw = 34, mh = 14;
  o += text(Mx, 22, 'im2col matrix：16 × 9，每个 window 一行', 'tb');
  const rx = states.map((k) => f1(My + k * mh));
  o += `<rect x="${Mx}" y="${rx[0]}" width="${K * K * mw}" height="${mh}" class="wash-strong">${anim('y', rx, kt, T, true)}</rect>`;
  o += grid(Mx, My, m * m, K * K, mw, mh);
  for (let k = 0; k < m * m; k++) {
    const r0 = Math.floor(k / m), c0 = k % m, vs = [];
    for (let a = 0; a < K; a++) for (let b = 0; b < K; b++) vs.push((r0 + a) * n + c0 + b);
    let row = '';
    vs.forEach((val, j) => { row += text(Mx + j * mw + mw / 2, My + k * mh + 11, String(val), 'ts', 'middle'); });
    o += showG(row, states.map((s) => s >= k), kt, T);
  }
  o += text(Mx, My + m * m * mh + 18, '乘以 reshape 成 9 维的 kernel，再 reshape 回 4 × 4', 'ts');
  return svgA(560, 308, o, '动图：6 乘 6 的 input 上一个 3 乘 3 的 window 依次走过 16 个位置，右边的 im2col matrix 每次填上一行，这一行就是 window 盖住的 9 个 element');
}

// ---------- 第 7 站：checkpointing，n = 16，每 4 层存一个 ----------
function ckptA() {
  const n = 16, seg = 4, bw = 28, gap = 3, X0 = 22, Y = 70;
  // 每个 state：stored（checkpoint）、recomputed、grad（已经 backward 过的 layer）
  const st = [];
  const ck = (s) => Array.from({ length: s }, (_, i) => i * seg);
  for (let s = 1; s <= n / seg; s++) st.push({ c: ck(s), r: [], g: 0, cap: 'forward 走完第 ' + s + ' 段：只留下每段开头的 x，其余算完就扔' });
  for (let s = n / seg; s >= 1; s--) {
    const base = (s - 1) * seg, keep = ck(s);
    const rec = Array.from({ length: seg - 1 }, (_, i) => base + 1 + i);
    st.push({ c: keep, r: rec, g: n - s * seg, cap: 'backward 走到第 ' + s + ' 段：从 x' + sub2(base) + ' 重算出 ' + rec.map((i) => 'x' + sub2(i)).join('、') });
    st.push({ c: ck(s - 1), r: [], g: n - (s - 1) * seg, cap: '第 ' + s + ' 段的 backward 做完，这一段的 activation 全部释放' });
  }
  const first = 6; // 第 3 段重算时作为静态帧
  const seq = [first, ...st.map((_, k) => k)];
  const { T, kt } = timeline(seq.length, 2.6, 1.5, 2.2);
  const on = (pred) => seq.map((k) => pred(st[k]));
  let o = text(X0, 16, '16 个 layer 的 input x₀ … x₁₅；深色是 checkpoint，浅色是 backward 时重算的', 'tb');
  o += arrow(X0, 38, X0 + 200, 38, 'mute') + text(X0 + 206, 42, 'forward', 'ts');
  for (let i = 0; i < n; i++) {
    const x = X0 + i * (bw + gap);
    o += showG(rect(x, Y, bw, 30, 'solid'), on((s) => s.c.includes(i)), kt, T);
    o += showG(rect(x, Y, bw, 30, 'wash-strong'), on((s) => s.r.includes(i)), kt, T);
    o += rect(x, Y, bw, 30, 'frame');
    o += text(x + bw / 2, Y + 50, 'x' + sub2(i), 'ts', 'middle');
    // 已经 backward 过的 layer：下方一条
    o += showG(rect(x, Y + 58, bw, 6, 'ink-f'), on((s) => i >= n - s.g), kt, T);
  }
  for (let s = 1; s < n / seg; s++) o += line(X0 + s * seg * (bw + gap) - gap / 2, Y - 8, X0 + s * seg * (bw + gap) - gap / 2, Y + 38, 'dash');
  o += text(X0 + n * (bw + gap) - 4, Y + 80, '下方黑条：gradient 已经算过的 layer', 'ts', 'end');
  seq.forEach((k, idx) => {
    const s = st[k], cnt = s.c.length + s.r.length;
    o += `<g>${text(X0, 186, s.cap, 'tl')}${text(X0, 208, '此刻存着 ' + cnt + ' 个 activation。Peak 是 4 + 3 = 7 个；全部存着要 16 个', 't')}${ashow(seq.map((_, t) => t === idx), kt, T)}</g>`;
  });
  o += text(X0, 234, '代价：x₁ … x₁₅ 里不是 checkpoint 的 12 个，forward 各多算一次', 'ts');
  return svgA(560, 242, o, '动图：16 层的 network 每 4 层存一个 checkpoint。Forward 时只留下 x0、x4、x8、x12；backward 从最后一段开始，每段先从它的 checkpoint 重算出其余 3 个 activation，做完这段的 backward 再释放，peak 是 7 个 activation');
}
function sub2(i) { return String(i).split('').map((ch) => '₀₁₂₃₄₅₆₇₈₉'[+ch]).join(''); }

// ---------- 第 8 站：split + reorder 改变的是一次碰到哪些数 ----------
function sched() {
  const n = 8, c = 9, t = 4;
  let o = '';
  const mat = (x, y, label, hi) => {
    for (let r = 0; r < n; r++) for (let cc = 0; cc < n; cc++) o += rect(x + cc * c, y + r * c, c, c, hi(r, cc) ? 'wash-strong' : 'frame');
    o += text(x + n * c / 2, y - 8, label, 'ts', 'middle');
  };
  const panel = (x0, title, hA, hB, hC, l1, l2, l3) => {
    o += text(x0, 16, title, 'tb');
    mat(x0, 50, 'A', hA); mat(x0 + 92, 50, 'B', hB); mat(x0 + 184, 50, 'C', hC);
    o += text(x0 + 82, 88, '×', 't', 'middle') + text(x0 + 174, 88, '=', 't', 'middle');
    o += text(x0, 150, l1, 'ts') + text(x0, 168, l2, 'ts') + text(x0, 190, l3, 'tl');
  };
  const rowOut = n, rowRead = n + n * n, tileOut = t * t, tileRead = 2 * t * n;
  panel(6, 'loop (m, n, k)：一行一行算', () => false, () => true, (r) => r === 0, '算完 C 的 row 0：' + rowOut + ' 个 output', '读 A 的 ' + n + ' 个、B 的全部 ' + n * n + ' 个', '每个 output ' + rowRead / rowOut + ' 个数');
  o += line(282, 10, 282, 196, 'grid');
  panel(292, 'split 成 4，reorder (mo, no, k, mi, ni)', (r) => r < t, (r, cc) => cc < t, (r, cc) => r < t && cc < t, '算完一个 4 × 4 tile：' + tileOut + ' 个 output', '读 A 的 ' + t * n + ' 个、B 的 ' + t * n + ' 个', '每个 output ' + tileRead / tileOut + ' 个数');
  // 第一个 panel 里 A 的 row 0 也要高亮
  for (let cc = 0; cc < n; cc++) o += rect(6 + cc * c, 50, c, c, 'wash-strong');
  o += grid(6, 50, 1, n, c, c);
  return svg(560, 198, o, 'C = A B，8 乘 8。原来的 loop order 算完 C 的一行要读 A 的一行和整个 B，每个 output 9 个数；按 4 split 并 reorder 后，一个 4 乘 4 tile 只读 A 的 4 行和 B 的 4 列，每个 output 4 个数');
}

// ---------- 第 7 站：gradient 的 allreduce 与 backward 重叠 ----------
function overlap() {
  const L = 4, X0 = 130, u = 50;
  let o = text(14, 16, '假设每层 backward 和每层 gradient 的 allreduce 都花 1 个单位时间', 'ts');
  const sub = (i) => '₀₁₂₃₄₅₆₇₈₉'[i];
  const lane = (y, label) => { o += text(X0 - 10, y + 17, label, 'ts', 'end'); o += line(X0, y + 26, X0 + 8 * u, y + 26, 'grid'); };
  const bar = (t0, y, cls, s) => { o += rect(X0 + t0 * u + 1, y, u - 2, 24, cls, 3) + text(X0 + t0 * u + u / 2, y + 17, s, 't', 'middle'); };
  const panel = (y0, title, arStart) => {
    o += text(14, y0, title, 'tb');
    lane(y0 + 10, 'backward'); lane(y0 + 42, 'allreduce');
    for (let k = 0; k < L; k++) bar(k, y0 + 10, 'wash', '∇W' + sub(L - k));
    let end = 0;
    for (let k = 0; k < L; k++) { const t = arStart(k); bar(t, y0 + 42, 'wash-strong', '∇W' + sub(L - k)); end = Math.max(end, t + 1); }
    o += line(X0 + end * u, y0 + 4, X0 + end * u, y0 + 72, 'ln') + text(X0 + end * u + 4, y0 + 88, '一步结束：t = ' + end, 'tl', 'end');
    return end;
  };
  const a = panel(44, '先做完 backward 再 allreduce', (k) => L + k);
  const b = panel(150, '每层的 gradient 一算出来就开始 allreduce', (k) => k + 1);
  o += line(X0, 256, X0 + 8 * u, 256, 'axis');
  for (let t = 0; t <= 8; t++) o += line(X0 + t * u, 256, X0 + t * u, 260, 'axis') + text(X0 + t * u, 274, String(t), 'ts', 'middle');
  o += text(X0 + 8 * u, 290, '时间', 'ts', 'end');
  o += text(14, 290, '同样的 compute 和 communication：' + a + ' 对 ' + b, 'ts');
  return svg(560, 296, o, '同一个 4 层 network 的一步 data parallel 训练。先做完 backward 再 allreduce 共 8 个单位时间；每层 gradient 算出就 allreduce，通信和后面几层的 backward 重叠，共 5 个单位时间');
}

// ---------- 第 7 站：两个 matmul 的 tensor parallelism ----------
function tp() {
  const X = [1, 2];
  const W1 = [[1, 0, 2, -3], [0, 1, 1, 1]];
  const W2 = [1, -1, 2, 5];
  const cw = 26, ch = 24;
  const mm = (x, cols) => cols.map((j) => x[0] * W1[0][j] + x[1] * W1[1][j]);
  const shards = [[0, 1], [2, 3]].map((cols) => {
    const pre = mm(X, cols), h = pre.map((v) => Math.max(v, 0));
    const part = h.reduce((s, v, k) => s + v * W2[cols[k]], 0);
    return { cols, pre, h, part };
  });
  const Y = shards[0].part + shards[1].part;
  const full = W2.reduce((s, w, j) => s + w * Math.max(X[0] * W1[0][j] + X[1] * W1[1][j], 0), 0);
  let o = '';
  // 表头
  const heads = [[86, 'X', 'replicated'], [160, 'W⁽¹⁾', '按 column 切'], [246, 'ReLU 之后', 'sharded'], [309, 'W⁽²⁾', '按 row 切'], [366, 'partial', 'result']];
  heads.forEach(([x, a, b]) => { o += text(x, 16, a, 'tb', 'middle') + text(x, 32, b, 'ts', 'middle'); });
  o += text(436, 16, 'allreduce', 'tb', 'middle') + text(512, 16, 'Y', 'tb', 'middle');
  const yc = [92, 190];
  shards.forEach((s, g) => {
    const c = yc[g];
    o += rect(4, c - 40, 394, 80, 'wash2', 8) + text(12, c - 26, 'GPU ' + g, 'tb');
    o += grid(60, c - ch / 2, 1, 2, cw, ch, 'paper') + vals(60, c - ch / 2, [X], cw, ch);
    o += text(122, c + 5, '×', 't', 'middle');
    const Wsh = [0, 1].map((r) => s.cols.map((j) => W1[r][j]));
    o += grid(134, c - ch, 2, 2, cw, ch, 'wash') + vals(134, c - ch, Wsh, cw, ch, 't', neg);
    o += arrow(190, c, 216, c, 'ink');
    o += grid(220, c - ch / 2, 1, 2, cw, ch, 'wash-strong') + vals(220, c - ch / 2, [s.h], cw, ch, 't', neg);
    o += text(246, c + 30, 'ReLU 前：(' + s.pre.map(neg).join(', ') + ')', 'ts', 'middle');
    o += text(284, c + 5, '×', 't', 'middle');
    o += grid(296, c - ch, 2, 1, cw, ch, 'wash') + vals(296, c - ch, s.cols.map((j) => [W2[j]]), cw, ch, 't', neg);
    o += text(334, c + 5, '=', 't', 'middle');
    o += grid(346, c - ch / 2, 1, 1, 40, ch, 'wash-strong') + vals(346, c - ch / 2, [[s.part]], 40, ch, 'tb', neg);
    o += arrow(388, c, 412, c + (g ? -18 : 18), 'ln');
    o += arrow(460, c + (g ? -18 : 18), 488, c, 'ln');
    o += grid(492, c - ch / 2, 1, 1, 40, ch, 'solid') + text(512, c + 4.5, String(Y), 'tw', 'middle');
  });
  o += rect(410, 104, 52, 74, 'paper', 6) + text(436, 136, 'sum', 'ts', 'middle') + text(436, 154, neg(shards[0].part) + ' + ' + shards[1].part, 't', 'middle');
  o += text(4, 254, '不切时 ReLU(X W⁽¹⁾) = (' + [0, 1, 2, 3].map((j) => neg(Math.max(X[0] * W1[0][j] + X[1] * W1[1][j], 0))).join(', ') + ')，乘 W⁽²⁾ 得 ' + full + '。中间的 hidden 从不离开各自的卡', 'ts');
  return svg(560, 260, o, 'Tensor parallelism：X 等于 (1, 2) 两张卡各一份。GPU 0 用 W1 的前两列算出 (1, 2)，乘 W2 的前两行得 -1；GPU 1 用后两列算出 (4, -1)，ReLU 后 (4, 0)，乘后两行得 8。Allreduce 相加，两张卡都得到 7');
}

export default {
  'cmu-10714-tp': tp,
  'cmu-10714-adgraph': adgraphA,
  'cmu-10714-bcast': bcast,
  'cmu-10714-norm': norm,
  'cmu-10714-compact': compactA,
  'cmu-10714-views': views,
  'cmu-10714-regtile': regtileA,
  'cmu-10714-tiled': tiled,
  'cmu-10714-gpu': gpu,
  'cmu-10714-im2col': im2colA,
  'cmu-10714-ckpt': ckptA,
  'cmu-10714-overlap': overlap,
  'cmu-10714-sched': sched,
};
