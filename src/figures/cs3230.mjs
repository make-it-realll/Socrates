import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, axes } from '../lib/svg.mjs';

// T(n) = 3T(n/2) + n，n = 8 的 recursion tree，右边是每层的 sum
function rtree() {
  const X0 = 24, X1 = 404;
  const leafX = (k) => X0 + ((X1 - X0) * (k + 0.5)) / 27;
  const ys = [34, 94, 154, 214];
  const sizes = [8, 4, 2, 1];
  const nodeX = (lvl, k) => { const span = 27 / 3 ** lvl; let s = 0; for (let i = 0; i < span; i++) s += leafX(k * span + i); return s / span; };
  let o = '';
  for (let lvl = 0; lvl < 3; lvl++) for (let k = 0; k < 3 ** lvl; k++) for (let c = 0; c < 3; c++) {
    const x1 = nodeX(lvl, k), x2 = nodeX(lvl + 1, 3 * k + c);
    o += line(x1, ys[lvl] + (lvl < 2 ? 13 : 9), x2, ys[lvl + 1] - (lvl < 1 ? 13 : lvl < 2 ? 9 : 5), 'mute');
  }
  const box = (x, y, w, h, s) => rect(x - w / 2, y - h / 2, w, h, 'paper', 4) + text(x, y + 4.5, s, 't', 'middle');
  o += box(nodeX(0, 0), ys[0], 40, 26, '8');
  for (let k = 0; k < 3; k++) o += box(nodeX(1, k), ys[1], 34, 26, '4');
  for (let k = 0; k < 9; k++) o += box(nodeX(2, k), ys[2], 22, 18, '2');
  for (let k = 0; k < 27; k++) o += circle(leafX(k), ys[3], 4.5, 'solid');
  o += line(424, 20, 424, 236, 'grid');
  const sums = [['1 × 8', '8'], ['3 × 4', '12'], ['9 × 2', '18'], ['27 × T(1)', '27']];
  sums.forEach(([a, b], i) => { o += text(436, ys[i] + 4.5, a, 'ts') + text(548, ys[i] + 4.5, b, 'tb', 'end'); });
  o += line(436, 236, 548, 236, 'ink') + text(436, 254, 'total', 'ts') + text(548, 254, '65', 'tl', 'end');
  o += text(436, 14, 'level sum', 'ts');
  o += text(214, 252, '27 个 leaf，每个 T(1) = 1', 'ts', 'middle');
  o += text(214, 276, '第 j 层的 sum 是 n·(3/2)ʲ：每往下一层乘 1.5，最后一层最大', 'ts', 'middle');
  return svg(560, 286, o, 'T(n) 等于 3T(n/2) 加 n 在 n 等于 8 时的 recursion tree：各层 sum 依次是 8、12、18、27，合计 65');
}

// 三个 recurrence 在 n = 64 时每层的 sum（水平条形图）
function levels() {
  const n = 64;
  const series = [
    ['4T(n/2) + n', 'r = 2：越往下越大', (j) => 4 ** j * (n / 2 ** j)],
    ['2T(n/2) + n', 'r = 1：每层一样', (j) => 2 ** j * (n / 2 ** j)],
    ['2T(n/2) + n²', 'r = 1/2：越往下越小', (j) => 2 ** j * (n / 2 ** j) ** 2],
  ];
  let o = '';
  series.forEach(([title, sub, f], p) => {
    const x0 = 14 + p * 184, bx = x0 + 22, bw = 108;
    const vals = Array.from({ length: 7 }, (_, j) => f(j));
    const max = Math.max(...vals), tot = vals.reduce((a, b) => a + b, 0);
    o += text(x0 + 82, 18, title, 'tb', 'middle') + text(x0 + 82, 36, sub, 'ts', 'middle');
    vals.forEach((v, j) => {
      const y = 52 + j * 24;
      o += text(x0 + 14, y + 13, String(j), 'ts', 'end');
      o += rect(bx, y + 2, Math.max(1.5, (bw * v) / max), 14, j === vals.indexOf(max) && p !== 1 ? 'solid' : 'wash');
      o += text(bx + (bw * v) / max + 5, y + 13.5, String(v), 'ts');
    });
    o += text(x0 + 82, 230, 'total ' + tot, 't', 'middle');
  });
  o += text(280, 254, '第 j 层的 sum 是 nᵈ · (a / bᵈ)ʲ；j = 0 是 root，j = 6 是 leaf 那一层', 'ts', 'middle');
  return svg(560, 262, o, '三个 recurrence 在 n 等于 64 时每一层的 sum：4T(n/2)+n 逐层翻倍，2T(n/2)+n 每层都是 64，2T(n/2)+n 平方逐层减半');
}

// 3 个 element 的 sorting decision tree（insertion sort 的比较顺序）
function dtree3() {
  let o = '';
  const node = (x, y, s) => rect(x - 30, y - 15, 60, 30, 'paper', 15) + text(x, y + 5, s, 't', 'middle');
  const leaf = (x, y, s) => rect(x - 36, y - 15, 72, 30, 'wash', 4) + rect(x - 36, y - 15, 72, 30, 'frame', 4) + text(x, y + 5, s, 'tb', 'middle');
  const edge = (x1, y1, x2, y2, s, side) => {
    o += line(x1, y1 + 15, x2, y2 - 15, 'ink');
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = side < 0 ? -dy / L : dy / L, ny = side < 0 ? dx / L : -dx / L;
    const mx = (x1 + x2) / 2 + nx * 9, my = (y1 + y2) / 2 + ny * 9 + 4;
    o += text(mx, my, s, 'ts', side < 0 ? 'end' : 'start');
  };
  const P = { root: [280, 40], L: [150, 110], R: [400, 110], LL: [70, 180], LR: [230, 180], RL: [330, 180], RR: [470, 180], LRL: [170, 250], LRR: [290, 250], RRL: [420, 250], RRR: [520, 250] };
  edge(...P.root, ...P.L, 'a < b', -1); edge(...P.root, ...P.R, 'a > b', 1);
  edge(...P.L, ...P.LL, 'b < c', -1); edge(...P.L, ...P.LR, 'b > c', 1);
  edge(...P.R, ...P.RL, 'a < c', -1); edge(...P.R, ...P.RR, 'a > c', 1);
  edge(...P.LR, ...P.LRL, 'a < c', -1); edge(...P.LR, ...P.LRR, 'a > c', 1);
  edge(...P.RR, ...P.RRL, 'b < c', -1); edge(...P.RR, ...P.RRR, 'b > c', 1);
  o += node(...P.root, 'a : b') + node(...P.L, 'b : c') + node(...P.R, 'a : c') + node(...P.LR, 'a : c') + node(...P.RR, 'b : c');
  o += leaf(...P.LL, 'a < b < c') + leaf(...P.RL, 'b < a < c') + leaf(...P.LRL, 'a < c < b') + leaf(...P.LRR, 'c < a < b') + leaf(...P.RRL, 'b < c < a') + leaf(...P.RRR, 'c < b < a');
  o += text(280, 298, '6 种 order 各占一个 leaf；height 为 h 的 tree 最多 2ʰ 个 leaf，2² = 4 < 6，所以 h ≥ 3', 'ts', 'middle');
  return svg(560, 308, o, 'Sort a、b、c 三个 element 的 decision tree：root 比较 a 和 b，六个 leaf 是六种 order，两个在 depth 2，四个在 depth 3');
}

// median of medians：n = 45，9 组每组 5 个
function mom() {
  const cx = (c) => 100 + c * 30, ry = (r) => 196 - r * 34;
  let o = '';
  o += rect(cx(0) - 15, ry(2) - 15, cx(4) - cx(0) + 30, ry(0) - ry(2) + 30, 'wash', 6);
  o += rect(cx(4) - 15, ry(4) - 15, cx(8) - cx(4) + 30, ry(2) - ry(4) + 30, 'wash', 6);
  o += rect(cx(0) - 15, ry(2) - 15, cx(4) - cx(0) + 30, ry(0) - ry(2) + 30, 'frame', 6);
  o += rect(cx(4) - 15, ry(4) - 15, cx(8) - cx(4) + 30, ry(2) - ry(4) + 30, 'frame', 6);
  for (let c = 0; c < 9; c++) {
    o += line(cx(c), ry(0), cx(c), ry(4), 'grid');
    for (let r = 0; r < 5; r++) {
      if (c === 4 && r === 2) continue;
      o += circle(cx(c), ry(r), r === 2 ? 6 : 4.5, r === 2 ? 'ink-f' : 'mute-f');
    }
  }
  o += circle(cx(4), ry(2), 10, 'solid') + text(cx(4), ry(2) + 4.5, 'x', 'tw', 'middle');
  o += arrow(cx(0) - 30, ry(0), cx(0) - 30, ry(4), 'mute') + text(cx(0) - 36, ry(2) + 4, '组内递增', 'ts', 'end');
  o += arrow(cx(0), 232, cx(8), 232, 'mute') + text(cx(4), 250, '按各组的 median 从左到右递增', 'ts', 'middle');
  o += text(cx(2), ry(0) + 30, '≤ x', 'tl', 'middle') + text(cx(6), ry(4) - 24, '≥ x', 'tl', 'middle');
  const tx = 362;
  o += text(tx, 62, '黑点是每组的 median', 't');
  o += text(tx, 92, '左下角：5 组 × 3 个', 't') + text(tx, 110, '= 15 个一定 ≤ x', 'tb');
  o += text(tx, 140, '右上角：5 组 × 3 个', 't') + text(tx, 158, '= 15 个一定 ≥ x', 'tb');
  o += text(tx, 188, '所以不管 recurse 到哪一边，', 't') + text(tx, 206, '最多剩 45 − 15 = 30 个', 't');
  return svg(560, 262, o, '45 个数分成 9 组，每组 5 个；以各组 median 的 median x 为界，左下角 15 个数一定不大于 x，右上角 15 个数一定不小于 x');
}

// Edit distance：SNOWY → SUNNY 的 DP table 与倒推路径
function edit() {
  const x = 'SNOWY', y = 'SUNNY';
  const E = [];
  for (let i = 0; i <= 5; i++) { E.push([]); for (let j = 0; j <= 5; j++) E[i].push(i === 0 ? j : j === 0 ? i : Math.min(E[i - 1][j] + 1, E[i][j - 1] + 1, E[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1))); }
  const S = 38, X0 = 62, Y0 = 46;
  const cx = (j) => X0 + (j + 0.5) * S, cy = (i) => Y0 + (i + 0.5) * S;
  const pathCells = [[0, 0], [1, 1], [1, 2], [2, 3], [3, 4], [4, 4], [5, 5]];
  let o = '';
  for (const [i, j] of pathCells) o += rect(X0 + j * S, Y0 + i * S, S, S, 'wash');
  for (let i = 0; i <= 6; i++) o += line(X0, Y0 + i * S, X0 + 6 * S, Y0 + i * S, 'grid');
  for (let j = 0; j <= 6; j++) o += line(X0 + j * S, Y0, X0 + j * S, Y0 + 6 * S, 'grid');
  for (const [i, j] of pathCells) o += rect(X0 + j * S + 1, Y0 + i * S + 1, S - 2, S - 2, 'ink', 3);
  o += text(cx(0), Y0 - 10, '∅', 'ts', 'middle') + text(X0 - 12, cy(0) + 4, '∅', 'ts', 'middle');
  for (let j = 1; j <= 5; j++) o += text(cx(j), Y0 - 10, y[j - 1], 'tb', 'middle');
  for (let i = 1; i <= 5; i++) o += text(X0 - 12, cy(i) + 5, x[i - 1], 'tb', 'middle');
  for (let i = 0; i <= 5; i++) for (let j = 0; j <= 5; j++) o += text(cx(j), cy(i) + 5, String(E[i][j]), 't', 'middle');
  for (let k = 1; k < pathCells.length; k++) {
    const [i1, j1] = pathCells[k - 1], [i2, j2] = pathCells[k];
    const ax = cx(j1) + (j2 - j1) * 10, ay = cy(i1) + (i2 - i1) * 10, bx = cx(j2) - (j2 - j1) * 10, by = cy(i2) - (i2 - i1) * 10;
    o += arrow(ax + (j2 - j1) * 2, ay + (i2 - i1) * 2, bx, by, 'ln', 6);
  }
  o += text(X0 + 3 * S, 20, 'y = SUNNY', 'ts', 'middle') + text(26, Y0 + 3 * S, 'x', 'ts', 'middle');
  const tx = 318;
  o += text(tx, 66, '斜着走：对齐 xᵢ 和 yⱼ', 't') + text(tx, 84, '相同 +0，不同 +1', 'ts');
  o += text(tx, 110, '向右：插入 yⱼ，+1', 't') + text(tx, 136, '向下：删除 xᵢ，+1', 't');
  o += text(tx, 176, '这条 path 对应的 alignment：', 'tb');
  const top = ['S', '−', 'N', 'O', 'W', 'Y'], bot = ['S', 'U', 'N', 'N', '−', 'Y'];
  top.forEach((c, k) => {
    const xx = tx + 12 + k * 30, diff = c !== bot[k];
    if (diff) o += rect(xx - 12, 186, 24, 46, 'wash2', 4);
    o += text(xx, 204, c, 'tb', 'middle') + text(xx, 226, bot[k], 'tb', 'middle');
  });
  o += text(tx, 254, '灰底的 3 列不同：cost 3', 'ts');
  return svg(560, 290, o, 'SNOWY 与 SUNNY 的 edit distance DP table，右下角为 3；标出的 optimal path 依次是对齐 S、插入 U、对齐 N、把 O 换成 N、删除 W、对齐 Y');
}

// interval scheduling：三条错误规则的 counterexample
function wrongrules() {
  let o = '';
  const panel = (y0, title, T, ivs, chosen, verdict) => {
    const sx = lin(0, T, 150, 470);
    o += text(14, y0 + 14, title, 'tb');
    o += text(552, y0 + 14, verdict, 'ts', 'end');
    let maxRow = 0;
    ivs.forEach(([s, f, row], k) => {
      maxRow = Math.max(maxRow, row);
      const y = y0 + 24 + row * 15;
      o += rect(sx(s) + 1, y, sx(f) - sx(s) - 2, 11, chosen.includes(k) ? 'solid' : 'wash2', 2);
    });
    const ya = y0 + 24 + (maxRow + 1) * 15 + 2;
    o += line(sx(0), ya, sx(T), ya, 'axis');
    for (let t = 0; t <= T; t += T > 12 ? 3 : 2) o += text(sx(t), ya + 13, String(t), 'ts', 'middle');
    return ya + 26;
  };
  let y = 4;
  y = panel(y, '最早开始', 10, [[0, 10, 0], [1, 3, 1], [4, 6, 1], [7, 9, 1]], [0], 'rule：1　optimum：3');
  y = panel(y, '最短', 11, [[4, 7, 0], [0, 5, 1], [6, 11, 1]], [0], 'rule：1　optimum：2');
  y = panel(y, '冲突最少', 15, [[0, 3, 0], [4, 7, 0], [8, 11, 0], [12, 15, 0], [6, 9, 1], [2, 5, 2], [10, 13, 2], [2, 5, 3], [10, 13, 3], [2, 5, 4], [10, 13, 4]], [4, 0, 3], 'rule：至多 3　optimum：4');
  o += text(14, y + 2, '第三组：rule 先选只有 2 个冲突的 [6, 9)，它挡掉了第一行中间的两个', 'ts');
  return svg(560, y + 12, o, '三条错误的 interval scheduling 规则各自的 counterexample：最早开始选出 1 个而 optimum 是 3，最短选出 1 个而 optimum 是 2，冲突最少至多选出 3 个而 optimum 是 4');
}

// exchange argument：从 OPT 一步步换成 greedy
function exchange() {
  const iv = { p: [0, 4], q: [1, 3], r: [4, 7], s: [3, 6], t: [7, 9], u: [6, 10], v: [9, 12], w: [10, 13], x: [2, 8] };
  const rows = [
    ['OPT', ['p', 'r', 't', 'w'], null, ''],
    ['换第 1 个', ['q', 'r', 't', 'w'], 'q', 'f(q) = 3 ≤ f(p) = 4'],
    ['换第 2 个', ['q', 's', 't', 'w'], 's', 'f(s) = 6 ≤ f(r) = 7'],
    ['换第 4 个', ['q', 's', 't', 'v'], 'v', 'f(v) = 12 ≤ f(w) = 13'],
  ];
  const sx = lin(0, 13, 96, 382);
  let o = '';
  rows.forEach(([lab, set, nw, note], k) => {
    const y = 20 + k * 48;
    o += text(14, y + 15, lab, k === 3 ? 'tl' : 'tb');
    for (const name of set) {
      const [s, f] = iv[name];
      const isNew = name === nw;
      o += rect(sx(s) + 1, y + 2, sx(f) - sx(s) - 2, 18, isNew ? 'solid' : 'wash', 3);
      o += text((sx(s) + sx(f)) / 2, y + 15.5, name, isNew ? 'tw' : 't', 'middle');
    }
    if (note) o += text(394, y + 15, note, 'ts');
    if (k > 0) o += arrow(60, y - 22, 60, y - 4, 'mute');
  });
  const ya = 26 + 4 * 48 - 10;
  o += line(sx(0), ya, sx(13), ya, 'axis');
  for (let t = 0; t <= 13; t++) o += line(sx(t), ya, sx(t), ya + 4, 'axis') + (t % 2 === 0 || t === 13 ? text(sx(t), ya + 17, String(t), 'ts', 'middle') : '');
  o += text(394, 196, '= greedy 的结果', 'tl');
  o += text(280, 248, '每次换进来的 interval 结束得不晚于换出去的，所以后面的 interval 仍然不冲突', 'ts', 'middle');
  return svg(560, 258, o, '从 optimal solution p、r、t、w 出发，依次把 p 换成 q、r 换成 s、w 换成 v，得到 greedy 的 q、s、t、v，每一步都仍是四个不重叠的 interval');
}

// Huffman tree
function huffman() {
  const N = {
    root: [290, 30, '100'], a: [170, 96, 'a 45'], n55: [400, 96, '55'],
    n25: [310, 162, '25'], n30: [480, 162, '30'],
    c: [260, 228, 'c 12'], b: [360, 228, 'b 13'], n14: [430, 228, '14'], d: [528, 228, 'd 16'],
    f: [390, 294, 'f 5'], e: [470, 294, 'e 9'],
  };
  const E = [['root', 'a', '0'], ['root', 'n55', '1'], ['n55', 'n25', '0'], ['n55', 'n30', '1'], ['n25', 'c', '0'], ['n25', 'b', '1'], ['n30', 'n14', '0'], ['n30', 'd', '1'], ['n14', 'f', '0'], ['n14', 'e', '1']];
  const code = { a: '0', c: '100', b: '101', d: '111', f: '1100', e: '1101' };
  let o = '';
  for (const [u, v, bit] of E) {
    const [x1, y1] = N[u], [x2, y2] = N[v];
    o += line(x1, y1 + 14, x2, y2 - 14, 'mute');
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + 4;
    o += text(mx + (x2 < x1 ? -8 : 8), my, bit, 'tl', x2 < x1 ? 'end' : 'start');
  }
  for (const [k, [x, y, s]] of Object.entries(N)) {
    if (k in code) {
      o += rect(x - 26, y - 14, 52, 28, 'wash', 4) + rect(x - 26, y - 14, 52, 28, 'frame', 4) + text(x, y + 5, s, 'tb', 'middle');
      o += text(x, y + 30, code[k], 'ts', 'middle');
    } else {
      o += circle(x, y, 15, 'paper') + text(x, y + 4.5, s, 't', 'middle');
    }
  }
  o += text(14, 96, 'depth 1', 'ts') + text(14, 162, 'depth 2', 'ts') + text(14, 228, 'depth 3', 'ts') + text(14, 294, 'depth 4', 'ts');
  o += text(14, 352, 'cost = 45·1 + (12 + 13 + 16)·3 + (5 + 9)·4 = 224', 'tb');
  return svg(560, 364, o, 'Huffman code tree：a 的 code 是 0，c、b、d 是 100、101、111，f、e 是 1100、1101，total cost 224');
}

// dynamic table：实际 cost、potential、amortized cost
function potential() {
  const actual = [1, 2, 3, 1, 5, 1, 1, 1, 9];
  const phi = [1, 2, 2, 4, 2, 4, 6, 8, 2];
  const amort = [2, 3, 3, 3, 3, 3, 3, 3, 3];
  const sx = lin(0.4, 9.6, 70, 400), sy = lin(0, 10, 236, 30);
  let o = axes({ sx, sy, x0: 0.4, x1: 9.6, y0: 0, y1: 10, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9], yt: [2, 4, 6, 8, 10], grid: false });
  for (const v of [2, 4, 6, 8, 10]) o += line(sx(0.4), sy(v), sx(9.6), sy(v), 'grid');
  actual.forEach((c, k) => {
    const x = sx(k + 1);
    o += rect(x - 12, sy(c), 24, sy(0) - sy(c), 'wash') + rect(x - 12, sy(c), 24, sy(0) - sy(c), 'frame');
    if (c >= 5) o += text(x, sy(c) - 5, String(c), 'ts', 'middle');
  });
  o += path(d(amort.map((v, k) => [sx(k + 1), sy(v)])), 'dash');
  o += path(d(phi.map((v, k) => [sx(k + 1), sy(v)])), 'ln');
  phi.forEach((v, k) => { o += circle(sx(k + 1), sy(v), 3.5, 'ln-f'); });
  o += text(sx(9.6), 268, 'insert 第几次', 'ts', 'end');
  const lx = 420;
  o += rect(lx, 44, 18, 12, 'wash') + rect(lx, 44, 18, 12, 'frame') + text(lx + 26, 54, '实际 cost', 't');
  o += line(lx, 80, lx + 18, 80, 'ln') + circle(lx + 9, 80, 3.5, 'ln-f') + text(lx + 26, 84, 'Φ = 2·size − cap', 't');
  o += line(lx, 110, lx + 18, 110, 'dash') + text(lx + 26, 114, 'amortized cost', 't');
  o += text(lx, 150, '第 5 次：copy 4 个', 'ts') + text(lx, 166, '实际 5，Φ 从 4 掉到 2', 'ts') + text(lx, 182, '5 + (2 − 4) = 3', 'tb');
  o += text(lx, 208, '第 9 次：copy 8 个', 'ts') + text(lx, 224, '实际 9，Φ 从 8 掉到 2', 'ts') + text(lx, 240, '9 + (2 − 8) = 3', 'tb');
  return svg(560, 276, o, '连续 9 次 insert 的实际 cost、potential 和 amortized cost：doubling 时实际 cost 跳到 3、5、9，potential 同时下降，amortized cost 一直是 3');
}

// 3-SAT → Independent Set 的 gadget
function gadget() {
  const V = {
    c1a: [215, 160, 'x₁', 0], c1b: [205, 62, '¬x₂', 0], c1c: [112, 128, 'x₃', 1],
    c2a: [355, 62, '¬x₁', 1], c2b: [345, 160, 'x₂', 0], c2c: [448, 128, 'x₃', 0],
    c3a: [240, 228, '¬x₁', 1], c3b: [320, 228, '¬x₂', 0], c3c: [280, 312, '¬x₃', 0],
  };
  const tri = [['c1a', 'c1b'], ['c1b', 'c1c'], ['c1c', 'c1a'], ['c2a', 'c2b'], ['c2b', 'c2c'], ['c2c', 'c2a'], ['c3a', 'c3b'], ['c3b', 'c3c'], ['c3c', 'c3a']];
  const conf = [['c1a', 'c2a'], ['c1a', 'c3a'], ['c1b', 'c2b'], ['c2b', 'c3b'], ['c1c', 'c3c'], ['c2c', 'c3c']];
  let o = '';
  const seg = ([u, v], cls) => {
    const [x1, y1] = V[u], [x2, y2] = V[v], L = Math.hypot(x2 - x1, y2 - y1), r = 17;
    return line(x1 + ((x2 - x1) * r) / L, y1 + ((y2 - y1) * r) / L, x2 - ((x2 - x1) * r) / L, y2 - ((y2 - y1) * r) / L, cls);
  };
  for (const e of conf) o += seg(e, 'ln-dash');
  for (const e of tri) o += seg(e, 'ink');
  for (const [x, y, s, pick] of Object.values(V)) {
    o += circle(x, y, 17, pick ? 'solid' : 'paper') + text(x, y + 5, s, pick ? 'tw' : 't', 'middle');
  }
  o += text(160, 26, 'C₁ = x₁ ∨ ¬x₂ ∨ x₃', 'tb', 'middle');
  o += text(400, 26, 'C₂ = ¬x₁ ∨ x₂ ∨ x₃', 'tb', 'middle');
  o += text(314, 318, 'C₃ = ¬x₁ ∨ ¬x₂ ∨ ¬x₃', 'tb', 'start');
  o += line(14, 352, 40, 352, 'ink') + text(46, 356, '同一 clause 的 triangle（9 条）', 'ts');
  o += line(250, 352, 276, 352, 'ln-dash') + text(282, 356, '互补 literal 之间（6 条）', 'ts');
  o += text(14, 378, '实心点：x₁ = false、x₂ = false、x₃ = true 时每个 clause 选一个真 literal，3 个点两两不相邻', 'ts');
  return svg(560, 388, o, '把三个 clause 的 3-SAT formula 变成 graph：每个 clause 是一个 triangle，互补的 literal 之间连 edge；一个 satisfying assignment 对应一个大小为 3 的 independent set');
}

export default {
  'cs3230-rtree': rtree,
  'cs3230-levels': levels,
  'cs3230-dtree3': dtree3,
  'cs3230-mom': mom,
  'cs3230-edit': edit,
  'cs3230-wrongrules': wrongrules,
  'cs3230-exchange': exchange,
  'cs3230-huffman': huffman,
  'cs3230-potential': potential,
  'cs3230-gadget': gadget,
};
