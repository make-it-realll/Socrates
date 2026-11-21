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

// ---------- 新加的图共用的小零件 ----------
const vtx = (x, y, s, cls = 'paper', r = 13, tcls = 't') => circle(x, y, r, cls) + text(x, y + 4.5, s, tcls, 'middle');
const boxT = (x, y, w, h, s, cls = 'paper', tcls = 't') => rect(x - w / 2, y - h / 2, w, h, cls, 4) + text(x, y + 4.5, s, tcls, 'middle');

// ---------- 开头第一件：拆成 4 个 vs 3 个半长的 product ----------
function split() {
  let o = '';
  const panel = (cx, b, title) => {
    o += text(cx, 22, title, 'tb', 'middle');
    const y = [52, 112, 172], w = 250;
    const X = (lvl, k) => cx - w / 2 + (k + 0.5) * w / b ** lvl;
    for (let k = 0; k < b; k++) {
      o += line(X(0, 0), y[0] + 12, X(1, k), y[1] - 12, 'mute');
      for (let c = 0; c < b; c++) o += line(X(1, k), y[1] + 12, X(2, b * k + c), y[2] - 6, 'mute');
    }
    o += boxT(X(0, 0), y[0], 44, 24, 'n = 4');
    for (let k = 0; k < b; k++) o += boxT(X(1, k), y[1], 28, 24, '2');
    for (let k = 0; k < b * b; k++) o += circle(X(2, k), y[2], 5, 'solid');
    o += text(cx, 204, `一位数乘法：${b}² = ${b * b} 次`, 'tl', 'middle');
    o += text(cx, 224, `n = 1024 = 2¹⁰ 时：${b}¹⁰ = ${(b ** 10).toLocaleString('en-US')}`, 'ts', 'middle');
  };
  panel(140, 4, '拆成 4 个半长的 product');
  panel(420, 3, '拆成 3 个半长的 product');
  o += text(280, 254, '每少一个分支，每一层都少一些，乘起来就是 (3/4)¹⁰ ≈ 0.056：少了 94%。', 'ts', 'middle');
  return svg(560, 266, o, '两个 4 位数相乘：每次拆成 4 个半长 product，最后要 16 次一位数乘法；拆成 3 个，只要 9 次');
}

// ---------- 开头第二件：knapsack 的两种装法 ----------
function knap0() {
  let o = '';
  const items = [[6, 30], [3, 14], [4, 16], [2, 9]];
  const sx = lin(0, 10, 150, 520);
  o += text(20, 22, '容量 10。四件物品（weight, value）与每单位 weight 的 value：', 'ts');
  items.forEach(([w, v], i) => { o += text(20 + i * 134, 44, `${i + 1}：(${w}, ${v})，${+(v / w).toFixed(2)}`, 't'); });
  const row = (y, title, pick, note) => {
    o += text(140, y + 17, title, 'tb', 'end') + text(140, y + 33, note, 'ts', 'end');
    let x = 0, val = 0;
    for (const i of pick) {
      const [w, v] = items[i];
      o += rect(sx(x) + 1, y + 2, sx(x + w) - sx(x) - 2, 24, 'wash', 3) + text((sx(x) + sx(x + w)) / 2, y + 19, `${i + 1}：w ${w}，v ${v}`, 't', 'middle');
      x += w; val += v;
    }
    if (x < 10) o += rect(sx(x) + 1, y + 2, sx(10) - sx(x) - 2, 24, 'dash', 3);
    o += rect(sx(0), y, sx(10) - sx(0), 28, 'frame');
    o += text(sx(10) + 8, y + 19, String(val), 'tl');
    return x;
  };
  row(74, '按比值从高到低', [0, 1], '再装哪件都超重');
  row(134, '第 1 件 + 第 3 件', [0, 2], 'weight 正好 10');
  o += line(sx(0), 182, sx(10), 182, 'axis');
  for (let t = 0; t <= 10; t++) o += line(sx(t), 182, sx(t), 186, 'axis') + text(sx(t), 199, String(t), 'ts', 'middle');
  o += text(sx(10), 214, 'weight', 'ts', 'end');
  o += text(20, 236, '上面一行剩下 1 个单位的容量（虚线框）用不上：44 < 46。', 'ts');
  return svg(560, 248, o, '容量为 10 的 knapsack：按比值装得到第 1、2 件，value 44，剩 1 个单位；装第 1、3 件正好装满，value 46');
}

// ---------- lower_bound 的逐步执行，以及 lo = mid 的死循环 ----------
function bsearch() {
  let o = '';
  const A = [2, 3, 5, 5, 8, 13], cw = 30;
  const run = (x, bad) => {
    const st = []; let lo = 0, hi = A.length, seen = new Set();
    while (lo < hi) {
      const mid = (lo + hi) >> 1, key = lo + ',' + hi;
      if (seen.has(key)) { st.push([lo, hi, mid, 'loop']); break; }
      seen.add(key);
      const go = A[mid] < x ? (bad ? 'lo = mid' : 'lo = mid + 1') : 'hi = mid';
      st.push([lo, hi, mid, go]);
      if (A[mid] < x) lo = bad ? mid : mid + 1; else hi = mid;
    }
    if (lo >= hi) st.push([lo, hi, null, `停，返回 ${lo}`]);
    return st;
  };
  const panel = (x0, title, st) => {
    o += text(x0, 22, title, 'tb');
    A.forEach((v, i) => { o += text(x0 + i * cw + cw / 2, 44, String(i), 'ts', 'middle'); });
    st.forEach(([lo, hi, mid, act], r) => {
      const y = 52 + r * 44;
      for (let i = 0; i < A.length; i++) {
        o += rect(x0 + i * cw, y, cw, 24, i >= lo && i < hi ? 'wash' : 'paper-f') + rect(x0 + i * cw, y, cw, 24, 'frame');
        o += text(x0 + i * cw + cw / 2, y + 16, String(A[i]), i === mid ? 'tb' : 'ts', 'middle');
      }
      if (mid !== null) o += rect(x0 + mid * cw + 2, y + 2, cw - 4, 20, 'ink', 3);
      o += text(x0 + A.length * cw + 8, y + 10, `[${lo}, ${hi})`, 'ts') + text(x0 + A.length * cw + 8, y + 26, act === 'loop' ? '死循环' : act, act === 'loop' ? 'tl' : 'ts');
    });
  };
  panel(14, 'x = 5，正确的 code', run(5, false));
  panel(290, 'x = 6，把 lo = mid + 1 写成 lo = mid', run(6, true));
  o += text(14, 244, '浅色底是当前的 range [lo, hi)，方框是 mid。左边 range 每次都严格变短；右边到 [3, 4) 时 mid = lo，', 'ts');
  o += text(14, 262, 'A[3] = 5 < 6，lo 还是 3，range 不再变短。', 'ts');
  return svg(560, 274, o, 'lower_bound 在 2 3 5 5 8 13 上找 5 的三步；把 lo = mid + 1 改成 lo = mid 后找 6，range 停在 3 到 4 不动');
}

// ---------- Karatsuba：1234 × 5678 ----------
function karat() {
  let o = '';
  const K = (x, y) => {
    const s = String(Math.max(x, y)).length; if (s <= 1) return { x, y, v: x * y };
    const m = Math.ceil(s / 2), p = 10 ** m;
    const a = Math.floor(x / p), b = x % p, c = Math.floor(y / p), d = y % p;
    return { x, y, a, b, c, d, m, v: x * y, kids: [[a, c], [b, d], [a + b, c + d]] };
  };
  const R = K(1234, 5678);
  const [ac, bd, ab] = R.kids.map(([p, q]) => p * q);
  o += boxT(280, 34, 150, 28, '1234 × 5678', 'paper', 'tb');
  o += text(280, 66, `a = ${R.a}, b = ${R.b}, c = ${R.c}, d = ${R.d}`, 'ts', 'middle');
  const xs = [110, 280, 450], labs = ['ac', 'bd', '(a+b)(c+d)'];
  R.kids.forEach(([p, q], i) => {
    o += line(280, 72, xs[i], 104, 'mute');
    o += boxT(xs[i], 120, 150, 28, `${p} × ${q} = ${p * q}`, i === 0 ? 'wash' : 'paper');
    o += text(xs[i], 148, labs[i], 'ts', 'middle');
  });
  // 12 × 56 再往下一层
  const S = K(12, 56), gx = [40, 110, 180];
  S.kids.forEach(([p, q], i) => {
    o += line(110, 154, gx[i], 182, 'mute');
    o += boxT(gx[i], 196, 62, 24, `${p}×${q}=${p * q}`, 'paper', 'ts');
  });
  const s1 = S.kids.map(([p, q]) => p * q);
  o += text(110, 230, `${s1[2]} − ${s1[0]} − ${s1[1]} = ${s1[2] - s1[0] - s1[1]}`, 'ts', 'middle');
  o += text(110, 248, `${s1[0] * 100} + ${(s1[2] - s1[0] - s1[1]) * 10} + ${s1[1]} = ${S.v}`, 'tl', 'middle');
  o += text(370, 196, `ad + bc = ${ab} − ${ac} − ${bd} = ${ab - ac - bd}`, 't', 'middle');
  o += text(370, 222, `${ac}·10⁴ + ${ab - ac - bd}·10² + ${bd}`, 't', 'middle');
  o += text(370, 248, `= ${R.v}`, 'tl', 'middle');
  return svg(560, 262, o, 'Karatsuba 算 1234 乘 5678：三个 recursive call 是 12 乘 56、34 乘 78、46 乘 134，12 乘 56 再拆成三个一位数乘法');
}

// ---------- 同时找 max 和 min：先配对 ----------
function maxmin() {
  let o = '';
  const n = 8, ex = (i) => 46 + i * 66, y0 = 58;
  for (let k = 0; k < n / 2; k++) o += rect(ex(2 * k) - 20, y0 - 18, 106, 36, 'wash2', 18);
  for (let i = 0; i < n; i++) o += vtx(ex(i), y0, 'e' + (i + 1));
  const lx = (k) => 50 + k * 56, rx = (k) => 330 + k * 56, ly = 136;
  for (let k = 0; k < n / 2; k++) {
    const cx = (ex(2 * k) + ex(2 * k + 1)) / 2;
    o += arrow(cx - 6, y0 + 20, lx(k), ly - 15, 'ink') + arrow(cx + 6, y0 + 20, rx(k), ly - 15, 'dash');
  }
  const tour = (X, lab) => {
    for (let k = 0; k < 4; k++) o += vtx(X(k), ly, '', 'paper', 10);
    const m1 = (X(0) + X(1)) / 2, m2 = (X(2) + X(3)) / 2, top = (m1 + m2) / 2;
    o += line(X(0), ly + 10, m1, 176, 'mute') + line(X(1), ly + 10, m1, 176, 'mute') + line(X(2), ly + 10, m2, 176, 'mute') + line(X(3), ly + 10, m2, 176, 'mute');
    o += vtx(m1, 184, '', 'paper', 8) + vtx(m2, 184, '', 'paper', 8);
    o += line(m1, 192, top, 220, 'mute') + line(m2, 192, top, 220, 'mute') + boxT(top, 230, 44, 22, lab, 'solid', 'tw');
  };
  tour(lx, 'max'); tour(rx, 'min');
  o += text(280, 22, '第一步：两两比一次，4 次', 'tl', 'middle');
  o += text(lx(1.5), 270, '赢的 4 个里找 max：3 次', 'ts', 'middle') + text(rx(1.5), 270, '输的 4 个里找 min：3 次', 'ts', 'middle');
  o += text(280, 296, '实线箭头是每一对里赢的，虚线是输的。合计 4 + 3 + 3 = 10 次，而先找 max 再找 min 要 7 + 6 = 13 次。', 'ts', 'middle');
  return svg(560, 308, o, '8 个 element 同时找 max 和 min：先两两配对比 4 次，赢的 4 个里 3 次找 max，输的 4 个里 3 次找 min，共 10 次');
}

// ---------- z_i 和 z_j 什么时候被比较 ----------
function zij() {
  let o = '';
  const n = 7, i0 = 2, j0 = 5, X = (k) => 40 + (k - 1) * 52;
  o += '';
  const rows = [
    [7, '第一个 pivot 在 Z₂₅ 外（例如 z₇）', '它比 z₂ 到 z₅ 都大：四个数一起去了左边，还没分出结果'],
    [2, '第一个 pivot 是 z₂（或 z₅）', 'z₅ 和 pivot 比了一次：X₂₅ = 1'],
    [4, '第一个 pivot 是 z₃ 或 z₄（例如 z₄）', 'z₂ 去左边、z₅ 去右边，以后再也碰不到：X₂₅ = 0'],
  ];
  rows.forEach(([p, t, s], r) => {
    const y = 66 + r * 106;
    o += text(20, y - 42, t, 'tb');
    o += rect(X(i0) - 18, y - 17, X(j0) - X(i0) + 36, 34, 'wash', 17);
    for (let k = 1; k <= n; k++) o += vtx(X(k), y, 'z' + k, k === p ? 'solid' : 'paper', 13, k === p ? 'tw' : 't');
    if (p === 2) o += path(`M${X(2)} ${y - 14}Q${(X(2) + X(5)) / 2} ${y - 44} ${X(5)} ${y - 15}`, 'ln');
    if (p === 4) o += line(X(4) - 26, y - 17, X(4) - 26, y + 17, 'dash') + line(X(4) + 26, y - 17, X(4) + 26, y + 17, 'dash');
    o += text(20, y + 38, s, 'ts');
  });
  return svg(560, 66 + 2 * 106 + 50, o, 'z2 和 z5 是否被比较，取决于 z2 到 z5 这四个数里谁最先被选为 pivot');
}

// ---------- Knapsack 的 DP table 与倒推 ----------
function knaptab() {
  let o = '';
  const items = [[6, 30], [3, 14], [4, 16], [2, 9]], W = 10, n = 4;
  const K = [Array(W + 1).fill(0)];
  for (let j = 1; j <= n; j++) { K.push([]); for (let w = 0; w <= W; w++) { const [wj, vj] = items[j - 1]; K[j][w] = Math.max(K[j - 1][w], wj <= w ? K[j - 1][w - wj] + vj : -1); } }
  const trail = []; let w = W;
  for (let j = n; j >= 1; j--) { const take = K[j][w] !== K[j - 1][w]; trail.push([j, w, take]); if (take) w -= items[j - 1][0]; }
  trail.push([0, w, false]);
  const cw = 36, rh = 28, x0 = 120, y0 = 46;
  const cx = (w2) => x0 + w2 * cw + cw / 2, cy = (j) => y0 + j * rh + rh / 2;
  for (let c = 0; c <= W; c++) o += text(cx(c), y0 - 8, String(c), 'ts', 'middle');
  o += text(x0 - 8, y0 - 8, 'j \\ w', 'ts', 'end');
  for (let j = 0; j <= n; j++) {
    o += text(x0 - 8, cy(j) + 4, j ? `${j}：(${items[j - 1].join(', ')})` : '0', 'ts', 'end');
    for (let c = 0; c <= W; c++) {
      const on = trail.some(([a, b]) => a === j && b === c);
      o += rect(x0 + c * cw, y0 + j * rh, cw, rh, on ? 'wash' : 'paper-f') + rect(x0 + c * cw, y0 + j * rh, cw, rh, 'frame');
      o += text(cx(c), cy(j) + 4, String(K[j][c]), on ? 'tb' : 't', 'middle');
    }
  }
  for (const [j, w2, take] of trail) if (j > 0) {
    const w3 = take ? w2 - items[j - 1][0] : w2;
    o += arrow(cx(w2) - (take ? 8 : 0), cy(j) - 9, cx(w3) + (take ? 10 : 0), cy(j - 1) + 9, take ? 'ln' : 'ink');
  }
  const picked = trail.filter((t) => t[2]).map((t) => t[0]).sort();
  o += text(20, y0 + 5 * rh + 26, `从右下角 K(10, 4) = ${K[n][W]} 往回走：竖直向上 = 第 j 件没拿；斜着向左上（彩色）= 拿了，容量减去 w_j。`, 'ts');
  o += text(20, y0 + 5 * rh + 44, `拿的是第 ${picked.join('、')} 件。`, 'ts');
  return svg(560, y0 + 5 * rh + 56, o, 'Knapsack 的 DP table，从 K(10,4)=46 倒推：第 4 件没拿，第 3 件拿了，第 2 件没拿，第 1 件拿了');
}

// ---------- Earliest finish time 在 9 个 interval 上 ----------
function eft() {
  let o = '';
  const iv = { p: [0, 4], q: [1, 3], r: [4, 7], s: [3, 6], t: [7, 9], u: [6, 10], v: [9, 12], w: [10, 13], x: [2, 8] };
  const order = Object.keys(iv).sort((a, b) => iv[a][1] - iv[b][1]);
  const sx = lin(0, 13, 110, 500), rh = 22, y0 = 30;
  let last = -Infinity; const chosen = [];
  order.forEach((k, r) => {
    const [s, f] = iv[k], take = s >= last, y = y0 + r * rh;
    if (take) { chosen.push(k); last = f; }
    o += text(20, y + 14, k, 'tb') + text(36, y + 14, `[${s}, ${f})`, 'ts');
    o += rect(sx(s) + 1, y + 2, sx(f) - sx(s) - 2, 16, take ? 'solid' : 'wash2', 3);
    o += text(sx(f) + 6, y + 14, take ? '选' : '', 'tl');
  });
  for (const k of chosen) o += line(sx(iv[k][1]), y0, sx(iv[k][1]), y0 + 9 * rh, 'dash');
  const ya = y0 + 9 * rh + 6;
  o += line(sx(0), ya, sx(13), ya, 'axis');
  for (let t = 0; t <= 13; t++) o += line(sx(t), ya, sx(t), ya + 4, 'axis') + text(sx(t), ya + 17, String(t), 'ts', 'middle');
  o += text(20, ya + 40, '从上往下按 finish time 扫；虚线是每个选中的 interval 的结束时刻，', 'ts');
  o += text(20, ya + 58, `之后的 interval 要从它之后开始才能选。选出 ${chosen.join(', ')}。`, 'ts');
  return svg(560, ya + 70, o, '9 个 interval 按 finish time 排好，earliest finish time 依次选出 q、s、t、v');
}

// ---------- 5-cycle 上的 independent set 与 vertex cover ----------
function c5() {
  let o = '';
  const S = [1, 3], P = (k) => { const a = -Math.PI / 2 + (k - 1) * 2 * Math.PI / 5; return [100 + 72 * Math.cos(a), 104 + 72 * Math.sin(a)]; };
  for (let k = 1; k <= 5; k++) { const a = P(k), b = P(k % 5 + 1); o += line(...[a, b].flat(), 'ink'); }
  for (let k = 1; k <= 5; k++) { const [x, y] = P(k); o += (S.includes(k) ? '' : circle(x, y, 15, 'paper')) + vtx(x, y, String(k), S.includes(k) ? 'solid' : 'wash', 15, S.includes(k) ? 'tw' : 'tb'); }
  o += circle(220, 70, 9, 'solid') + text(236, 75, 'S = {1, 3}：两两不相邻，independent set', 't');
  o += circle(220, 104, 9, 'paper') + circle(220, 104, 9, 'wash') + text(236, 109, 'V ∖ S = {2, 4, 5}：每条 edge 至少碰到一个', 't');
  o += text(236, 129, '12、23、34、45、51 全被盖住，vertex cover', 'ts');
  o += text(220, 166, '|S| = 2，|V ∖ S| = 5 − 2 = 3：f(G, k) = (G, n − k)', 'tl');
  return svg(560, 196, o, '5 个 vertex 的 cycle：S 等于 1 和 3 是 independent set，其余 2、4、5 是 vertex cover');
}

export default {
  'cs3230-split': split,
  'cs3230-knap0': knap0,
  'cs3230-bsearch': bsearch,
  'cs3230-karat': karat,
  'cs3230-maxmin': maxmin,
  'cs3230-zij': zij,
  'cs3230-knaptab': knaptab,
  'cs3230-eft': eft,
  'cs3230-c5': c5,
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
