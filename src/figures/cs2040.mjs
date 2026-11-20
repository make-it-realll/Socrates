import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 共用的小零件：圆形 vertex、裁到圆边的 edge、array 的一格
const R = 14;
const node = (x, y, s, cls = 'paper', tcls = 't', r = R) => circle(x, y, r, cls) + text(x, y + 4.5, s, tcls, 'middle');
const trim = (a, b, r = R) => {
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  return [a[0] + r * Math.cos(ang), a[1] + r * Math.sin(ang), b[0] - r * Math.cos(ang), b[1] - r * Math.sin(ang)];
};
const edge = (a, b, cls = 'ink', r = R) => line(...trim(a, b, r), cls);
const dedge = (a, b, cls = 'ink', r = R) => arrow(...trim(a, b, r + 1), cls);
const cell = (x, y, w, h, s, cls = 'paper', tcls = 't') => rect(x, y, w, h, cls) + (s === '' ? '' : text(x + w / 2, y + h / 2 + 4.5, s, tcls, 'middle'));
const mid = (a, b, t = 0.5) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Merge sort 的 recursion：先 split 到底，再一层一层 merge 回来
function mergetree() {
  const W = 27, H = 24, X0 = 62;
  let o = '';
  const row = (y, groups, cls) => {
    let x = X0;
    const gap = groups.length === 1 ? 0 : (8 * W + 56 - groups.flat().length * W) / (groups.length - 1);
    for (const g of groups) {
      for (const v of g) { o += cell(x, y, W, H, String(v), cls); x += W; }
      x += gap;
    }
  };
  const ys = [16, 50, 84, 118, 162, 196, 230];
  row(ys[0], [[7, 1, 5, 6, 2, 4, 9, 3]], 'paper');
  row(ys[1], [[7, 1, 5, 6], [2, 4, 9, 3]], 'paper');
  row(ys[2], [[7, 1], [5, 6], [2, 4], [9, 3]], 'paper');
  row(ys[3], [[7], [1], [5], [6], [2], [4], [9], [3]], 'paper');
  row(ys[4], [[1, 7], [5, 6], [2, 4], [3, 9]], 'wash ink-s');
  row(ys[5], [[1, 5, 6, 7], [2, 3, 4, 9]], 'wash ink-s');
  row(ys[6], [[1, 2, 3, 4, 5, 6, 7, 9]], 'wash ink-s');
  o += arrow(48, ys[0] + 4, 48, ys[3] + H - 2, 'mute') + text(40, (ys[0] + ys[3] + H) / 2 + 4, 'split', 'ts', 'end');
  o += arrow(48, ys[4] + 2, 48, ys[6] + H - 2, 'ln') + text(40, (ys[4] + ys[6] + H) / 2 + 4, 'merge', 'ts tl', 'end');
  o += line(X0, 151, X0 + 8 * W + 56, 151, 'grid');
  const tx = 366;
  o += text(tx, ys[3] + 16, 'size 1：已经 sorted，不用做事', 'ts');
  o += text(tx, ys[4] + 16, '4 次 merge × 2 个 element = 8', 't');
  o += text(tx, ys[5] + 16, '2 次 merge × 4 个 element = 8', 't');
  o += text(tx, ys[6] + 16, '1 次 merge × 8 个 element = 8', 't');
  o += text(tx, ys[0] + 16, 'n = 8', 'tb');
  o += text(tx, ys[1] + 16, 'split 3 次到 size 1：', 'ts') + text(tx, ys[2] + 12, 'log₂ 8 = 3 层', 'ts');
  o += text(280, 276, '每一层 merge 都把 n 个 element 各写一次；一共 log₂ n 层，所以总工作量是 n log₂ n = 24', 'ts', 'middle');
  return svg(560, 286, o, 'Merge sort 在 8 个 element 上的 recursion tree：split 三层到 size 1，再 merge 三层，每层 merge 的总工作量都是 8');
}

// Circular array 实现的 queue：front 和 back 都只往右走，走到头绕回 0
function cqueue() {
  const W = 50, H = 34, X0 = 60;
  let o = '';
  const arr = (y, vals, front, back, title, note) => {
    o += text(X0, y - 42, title, 'tb');
    vals.forEach((v, i) => {
      o += cell(X0 + i * W, y, W, H, v, v === '' ? 'paper' : 'wash ink-s') + text(X0 + i * W + W / 2, y + H + 14, String(i), 'ts', 'middle');
    });
    const fx = X0 + front * W + W / 2, bx = X0 + back * W + W / 2;
    o += arrow(fx, y - 16, fx, y - 2, 'ln') + text(fx, y - 20, 'front', 'tl', 'middle');
    o += arrow(bx, y - 16, bx, y - 2, 'ink') + text(bx, y - 20, 'back', 't', 'middle');
    note.forEach((s, i) => { o += text(X0 + 6 * W + 22, y + 6 + i * 17, s, i === 0 ? 't' : 'ts'); });
  };
  arr(62, ['', '', 'c', 'd', 'e', ''], 2, 5, 'enqueue a b c d e，再 dequeue 两次', ['front = 2，back = 5', 'size = 3', 'a、b 留下的格子空着']);
  arr(186, ['g', '', 'c', 'd', 'e', 'f'], 2, 1, '再 enqueue f、g', ['front = 2，back = 1', 'size = 5', 'back 走过 5 之后绕回 0']);
  o += text(X0, 258, '下一个 index 都是 (i + 1) % 6。没有任何 element 被搬动，enqueue 和 dequeue 都是 O(1)。', 'ts');
  return svg(560, 270, o, '用 capacity 为 6 的 circular array 实现 queue：front 指向最早进入的 element，back 指向下一个空位，两者走到 array 末尾后绕回 index 0');
}

// 同一组 key，两种处理 collision 的办法
function hash() {
  const H = 20, Y0 = 44, m = 11;
  let o = '';
  const col = (x0, w, vals, hi) => {
    for (let i = 0; i < m; i++) {
      o += text(x0 - 8, Y0 + i * H + 14.5, String(i), 'ts', 'end');
      o += cell(x0, Y0 + i * H, w, H, vals[i] ?? '', hi.includes(i) ? 'wash ink-s' : 'paper');
    }
  };
  // 左：separate chaining
  o += text(40, 20, 'Separate chaining', 'tb') + text(40, 36, '每个 slot 挂一条 linked list', 'ts');
  col(48, 26, {}, []);
  const chain = (i, ks) => {
    let x = 48 + 26;
    const y = Y0 + i * H + H / 2;
    o += circle(48 + 13, y, 2.5, 'ink-f');
    ks.forEach((k) => {
      o += arrow(x - (x === 74 ? 13 : 0), y, x + 16, y, 'ink', 5) + cell(x + 16, y - 9, 30, 18, String(k), 'wash ink-s', 'ts');
      x += 46;
    });
  };
  chain(3, [14, 25, 3, 36]);
  chain(5, [5]);
  chain(9, [9, 20]);
  // 右：linear probing
  const X1 = 330;
  o += text(X1 - 8, 20, 'Linear probing', 'tb') + text(X1 - 8, 36, 'slot 被占就往下一格找', 'ts');
  col(X1, 40, { 3: 14, 4: 25, 5: 3, 6: 36, 7: 5, 9: 9, 10: 20 }, [3, 4, 5, 6, 7, 9, 10]);
  const note = (i, s, cls = 'ts') => { o += text(X1 + 50, Y0 + i * H + 14.5, s, cls); };
  note(3, 'home 3，probe 1 次');
  note(4, 'home 3，probe 2 次');
  note(5, 'home 3，probe 3 次');
  note(6, 'home 3，probe 4 次');
  note(7, 'home 5，probe 3 次', 'tl');
  note(9, 'home 9，probe 1 次');
  note(10, 'home 9，probe 2 次');
  o += text(280, 284, 'm = 11，h(k) = k mod 11，依次 insert 14, 25, 3, 36, 9, 20, 5。', 'ts', 'middle');
  o += text(280, 301, '右边的 5 自己的 home slot 是 5，却被 home 3 的那串 key 占了，只能排到 cluster 的末尾。', 'ts', 'middle');
  return svg(560, 311, o, '同样七个 key 放进 size 为 11 的 hash table：左边 separate chaining 在 slot 3 挂出长度为 4 的 chain；右边 linear probing 在 slot 3 到 7 形成一个 cluster');
}

// Binary heap：同一份数据的两种看法，complete binary tree 和 array
function heap() {
  const A = [90, 70, 80, 30, 60, 50, 20, 10, 25, 40];
  const pos = [null, [280, 36], [160, 82], [400, 82], [100, 128], [220, 128], [340, 128], [460, 128], [70, 174], [130, 174], [190, 174]];
  const hi = [2, 5, 10];
  let o = '';
  for (let i = 2; i <= 10; i++) o += edge(pos[i >> 1], pos[i], hi.includes(i) && hi.includes(i >> 1) ? 'ln' : 'ink', 15);
  for (let i = 1; i <= 10; i++) {
    const [x, y] = pos[i];
    o += node(x, y, String(A[i - 1]), hi.includes(i) ? 'wash ink-s' : 'paper', 't', 15);
    if (i === 1) o += text(x - 24, y - 8, '1', 'ts', 'middle');
    else if (i >= 8) o += text(x, y + 29, String(i), 'ts', 'middle');
    else o += text(x + (i % 2 ? 23 : -23), y - 10, String(i), 'ts', 'middle');
  }
  o += text(520, 40, '小号数字是', 'ts', 'middle') + text(520, 56, 'array index', 'ts', 'middle');
  const W = 44, X0 = 60, Y = 248;
  A.forEach((v, k) => {
    const i = k + 1;
    o += cell(X0 + k * W, Y, W, 30, String(v), hi.includes(i) ? 'wash ink-s' : 'paper') + text(X0 + k * W + W / 2, Y + 44, String(i), 'ts', 'middle');
  });
  o += text(X0 - 10, Y + 20, 'A', 'tb', 'end') + text(X0 - 10, Y + 44, 'index', 'ts', 'end');
  const cx = (i) => X0 + (i - 1) * W + W / 2;
  const arc = (a, b, lift) => {
    const mx = (cx(a) + cx(b)) / 2, ex = cx(b), ey = Y - 3;
    const ang = Math.atan2(ey - (Y - lift), ex - mx);
    return path(`M${cx(a)} ${Y - 3}Q${mx} ${Y - lift} ${ex - 3 * Math.cos(ang)} ${ey - 3 * Math.sin(ang)}`, 'ln') + poly([[ex, ey], [ex - 8 * Math.cos(ang + 0.42), ey - 8 * Math.sin(ang + 0.42)], [ex - 8 * Math.cos(ang - 0.42), ey - 8 * Math.sin(ang - 0.42)]], 'ln-f');
  };
  o += arc(5, 2, 30) + arc(5, 10, 40);
  o += text((cx(2) + cx(5)) / 2, Y + 66, 'parent(5) = ⌊5 / 2⌋ = 2', 'tl', 'middle') + text((cx(7) + cx(10)) / 2 + 10, Y + 66, 'left(5) = 2 × 5 = 10', 'tl', 'middle');
  o += text(280, Y + 92, '把 tree 一层一层、从左到右读出来，就是 array。', 'ts', 'middle');
  o += text(280, Y + 109, 'Index 5（值 60）的 parent 和 child 在哪，靠 index 算出来，不需要 pointer。', 'ts', 'middle');
  return svg(560, Y + 120, o, '一个有 10 个 element 的 binary max heap，上面画成 complete binary tree，下面是同一份数据的 1-based array；index 5 的 parent 在 index 2，left child 在 index 10');
}

// 一次 rotation：改三个 pointer，inorder 不变
function rotate() {
  let o = '';
  const tri = (x, y, s, hh) => poly([[x, y], [x - 22, y + hh], [x + 22, y + hh]], 'wash ink-s') + text(x, y + hh - 9, s, 't', 'middle');
  // 左：Q 在上
  const Q = [150, 42], P = [95, 100];
  o += edge(Q, P) + edge(Q, [205, 100]) + edge(P, [55, 150]) + edge(P, [135, 150]);
  o += tri(205, 100, 'C', 46) + tri(55, 150, 'A', 46) + tri(135, 150, 'B', 46);
  o += node(...Q, 'Q') + node(...P, 'P', 'wash ink-s');
  // 右：P 在上
  const P2 = [395, 42], Q2 = [450, 100];
  o += edge(P2, Q2) + edge(P2, [340, 100]) + edge(Q2, [410, 150]) + edge(Q2, [490, 150]);
  o += tri(340, 100, 'A', 46) + tri(410, 150, 'B', 46) + tri(490, 150, 'C', 46);
  o += node(...P2, 'P', 'wash ink-s') + node(...Q2, 'Q');
  o += arrow(238, 78, 308, 78, 'ln') + text(273, 68, 'rotateRight(Q)', 'tl', 'middle');
  o += arrow(308, 108, 238, 108, 'ink') + text(273, 126, 'rotateLeft(P)', 't', 'middle');
  o += text(130, 222, 'inorder：A  P  B  Q  C', 't', 'middle') + text(420, 222, 'inorder：A  P  B  Q  C', 't', 'middle');
  o += text(280, 248, 'P 升一层，Q 降一层。B 里的 key 都在 P 和 Q 之间，所以它从 P 的 right 改挂到 Q 的 left。', 'ts', 'middle');
  o += text(280, 265, 'Subtree A 整体升一层，C 整体降一层，B 的 depth 不变。', 'ts', 'middle');
  return svg(560, 276, o, 'rotateRight 把 left child P 提到 Q 的位置，Q 成为 P 的 right child，subtree B 从 P 的右边改挂到 Q 的左边；inorder 顺序 A P B Q C 保持不变');
}

// Left-right case：一次 rotation 不够，要两次
function avllr() {
  let o = '';
  const dy = 44;
  const draw = (x0, nodes, edges, hi, title, labels) => {
    for (const [a, b] of edges) o += edge(nodes[a], nodes[b], 'ink', 13);
    for (const k in nodes) o += node(nodes[k][0], nodes[k][1], k, hi.includes(+k) ? 'wash ink-s' : 'paper', 't', 13);
    o += text(x0, 18, title, 'tb', 'middle');
    for (const [k, s, dx, anchor] of labels) o += text(nodes[k][0] + dx, nodes[k][1] - 12, s, 'tl', anchor);
  };
  const L = (x0, c) => Object.fromEntries(Object.entries(c).map(([k, [x, lv]]) => [k, [x0 + x, 46 + lv * dy]]));
  draw(95, L(95, { 50: [10, 0], 30: [-30, 1], 70: [50, 1], 20: [-60, 2], 40: [0, 2], 45: [25, 3] }), [[50, 30], [50, 70], [30, 20], [30, 40], [40, 45]], [30, 40, 50], 'insert 45 之后', [[50, '+2', -18, 'end'], [30, '−1', -18, 'end']]);
  draw(285, L(285, { 50: [10, 0], 40: [-30, 1], 70: [50, 1], 30: [-60, 2], 45: [0, 2], 20: [-85, 3] }), [[50, 40], [50, 70], [40, 30], [40, 45], [30, 20]], [30, 40, 50], 'rotateLeft(30)', [[50, '+2', -18, 'end'], [40, '+1', -18, 'end']]);
  draw(470, L(470, { 40: [0, 0], 30: [-45, 1], 50: [45, 1], 20: [-70, 2], 45: [20, 2], 70: [70, 2] }), [[40, 30], [40, 50], [30, 20], [50, 45], [50, 70]], [30, 40, 50], 'rotateRight(50)', [[40, '0', -18, 'end']]);
  o += arrow(168, 110, 196, 110, 'ln') + arrow(358, 110, 386, 110, 'ln');
  o += text(280, 218, '彩色数字是 balance factor。第一次 rotation 把 left-right 变成 left-left，第二次才真正把 height 降下来。', 'ts', 'middle');
  return svg(560, 230, o, 'AVL tree 的 left-right case：insert 45 后 50 的 balance factor 是正 2 而 30 的是负 1，先 rotateLeft(30) 再 rotateRight(50)，最后 40 成为 root');
}

// 同一个 graph 上的 BFS tree 和 DFS tree
function bfsdfs() {
  let o = '';
  const P = { b: [34, 30], a: [96, 30], s: [96, 100], c: [158, 100], d: [204, 46], e: [204, 154], f: [250, 100], g: [34, 154] };
  const E = [['a', 'b'], ['a', 's'], ['s', 'c'], ['c', 'd'], ['c', 'e'], ['d', 'e'], ['d', 'f'], ['e', 'f']];
  const panel = (x0, title, tree, lab, sub) => {
    const Q = Object.fromEntries(Object.entries(P).map(([k, [x, y]]) => [k, [x0 + x, 48 + y]]));
    for (const [u, v] of E) {
      const t = tree.some(([p, q]) => (p === u && q === v) || (p === v && q === u));
      o += edge(Q[u], Q[v], t ? 'ln' : 'dash');
    }
    for (const k in Q) o += node(Q[k][0], Q[k][1], k, k === 's' ? 'wash ink-s' : 'paper');
    for (const k in lab) { const [s, dx, dy, an] = lab[k]; o += text(Q[k][0] + dx, Q[k][1] + dy, s, 'tl', an); }
    o += text(x0 + 140, 20, title, 'tb', 'middle') + text(x0 + 140, 38, sub, 'ts', 'middle');
  };
  panel(4, 'BFS(s)', [['s', 'a'], ['s', 'c'], ['a', 'b'], ['c', 'd'], ['c', 'e'], ['d', 'f']],
    { s: ['D = 0', 0, 30, 'middle'], a: ['1', 20, -8, 'start'], c: ['1', 0, -20, 'middle'], b: ['2', -20, -8, 'end'], d: ['2', 0, -20, 'middle'], e: ['2', 0, 30, 'middle'], f: ['3', 0, -20, 'middle'], g: ['∞', 20, 5, 'start'] },
    '数字是 D：从 s 出发最少要走几条 edge');
  panel(284, 'DFS(s)', [['s', 'a'], ['a', 'b'], ['s', 'c'], ['c', 'd'], ['d', 'e'], ['e', 'f']],
    { s: ['1', 0, 30, 'middle'], a: ['2', 20, -8, 'start'], b: ['3', -20, -8, 'end'], c: ['4', 0, -20, 'middle'], d: ['5', 0, -20, 'middle'], e: ['6', 0, 30, 'middle'], f: ['7', 0, -20, 'middle'] },
    '数字是 visit 的先后次序');
  o += text(280, 250, '粗线是第一次到达某个 vertex 时走的 edge，合起来是一棵 spanning tree；虚线是没用上的 edge。', 'ts', 'middle');
  o += text(280, 267, 'Neighbor 都按字母顺序试。BFS tree 里 s 到 f 是 3 条 edge；DFS tree 里是 s → c → d → e → f，4 条。', 'ts', 'middle');
  o += text(280, 284, '两边都到不了 g。', 'ts', 'middle');
  return svg(560, 294, o, '同一个 undirected graph 上从 s 出发的 BFS tree 和 DFS tree：BFS 按 distance 分层，s 到 f 是 3 条 edge；DFS 一路走到底，tree 里 s 到 f 是 4 条 edge');
}

// 一个 DAG 和它的两个 topological order
function dag() {
  let o = '';
  const P = { 0: [60, 76], 1: [170, 44], 2: [170, 108], 3: [280, 76], 5: [390, 76], 4: [280, 144] };
  const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 5], [4, 5]];
  for (const [u, v] of E) o += dedge(P[u], P[v]);
  const indeg = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 0, 5: 2 };
  for (const k in P) {
    o += node(P[k][0], P[k][1], k, indeg[k] === 0 ? 'wash ink-s' : 'paper');
    o += text(P[k][0], P[k][1] + (k === '1' ? -20 : 30), 'in-degree ' + indeg[k], 'ts', 'middle');
  }
  const seq = (y, title, order) => {
    o += text(40, y + 5, title, 'tb');
    order.forEach((v, i) => {
      const x = 250 + i * 44;
      o += node(x, y, String(v), 'paper', 't', 12);
      if (i) o += arrow(x - 30, y, x - 14, y, 'mute', 5);
    });
      };
  seq(212, 'Kahn’s algorithm', [0, 4, 1, 2, 3, 5]);
  seq(250, 'DFS，post-order 倒过来', [4, 0, 2, 1, 3, 5]);
    o += text(280, 288, '两个次序不同，都合法：把 vertex 按次序排成一行，六条 edge 全部指向右边。', 'ts', 'middle');
  o += text(280, 305, '这个 DAG 一共有 10 个 topological order。', 'ts', 'middle');
  return svg(560, 316, o, '一个有 6 个 vertex、6 条 edge 的 DAG，每个 vertex 标着 in-degree；下面是 Kahn’s algorithm 和 DFS 各自给出的 topological order');
}

// Kosaraju：SCC、第一遍 DFS 的 finishing time、SCC 之间的 DAG
function scc() {
  let o = '';
  const P = { 5: [60, 62], 6: [136, 100], 7: [60, 146], 0: [240, 50], 1: [240, 116], 2: [384, 146], 3: [478, 104], 4: [398, 54] };
  o += rect(28, 30, 144, 150, 'wash', 14) + rect(204, 18, 72, 132, 'wash', 14) + rect(350, 22, 164, 158, 'wash', 14);
  o += text(100, 22, 'C₁', 'tb', 'middle') + text(240, 12, 'C₂', 'tb', 'middle') + text(432, 14, 'C₃', 'tb', 'middle');
  const E = [[5, 6], [6, 7], [7, 5], [6, 0], [1, 2], [7, 2], [2, 3], [3, 4], [4, 2]];
  for (const [u, v] of E) o += dedge(P[u], P[v]);
  // 0 ↔ 1：两条平行的 edge
  o += arrow(P[0][0] - 5, P[0][1] + 15, P[1][0] - 5, P[1][1] - 15, 'ink') + arrow(P[1][0] + 5, P[1][1] - 15, P[0][0] + 5, P[0][1] + 15, 'ink');
  const fin = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 8, 6: 7, 7: 6 };
  const lp = { 5: [-2, -20, 'middle'], 6: [16, 22, 'start'], 7: [-2, 30, 'middle'], 0: [-20, 2, 'end'], 1: [-20, 12, 'end'], 2: [6, 30, 'middle'], 3: [0, 30, 'middle'], 4: [-22, 2, 'end'] };
  for (const k in P) {
    o += node(P[k][0], P[k][1], k);
    o += text(P[k][0] + lp[k][0], P[k][1] + lp[k][1], 'f=' + fin[k], 'tl', lp[k][2]);
  }
  // meta-graph
  const y = 228;
  const box = (x, s1, s2) => rect(x, y, 124, 40, 'paper', 8) + text(x + 62, y + 17, s1, 'tb', 'middle') + text(x + 62, y + 33, s2, 'ts', 'middle');
  o += box(38, 'C₁ = {5, 6, 7}', '最大的 f 是 8') + box(218, 'C₂ = {0, 1}', '最大的 f 是 5') + box(398, 'C₃ = {2, 3, 4}', '最大的 f 是 3');
  o += arrow(164, y + 20, 216, y + 20, 'ink') + arrow(344, y + 20, 396, y + 20, 'ink');
  o += path(`M100 ${y + 42}Q280 ${y + 86} 446 ${y + 49}`, 'ink') + arrow(446, y + 49, 458, y + 46.3, 'ink');
  o += text(280, 312, 'f 是第一遍 DFS（在 G 上，按 0, 1, …, 7 的顺序起步）的 finishing time。', 'ts', 'middle');
  o += text(280, 329, 'SCC 之间的 edge，总是从“最大的 f”较大的那个 SCC 指向较小的那个。', 'ts', 'middle');
  return svg(560, 340, o, '一个有 8 个 vertex 的 directed graph，分成三个 strongly connected component；每个 vertex 标着第一遍 DFS 的 finishing time，下面是把每个 SCC 缩成一个点得到的 DAG');
}

// MST 的例子和一个 cut
function mst() {
  let o = '';
  const P0 = { 0: [34, 36], 1: [34, 150], 2: [108, 84], 3: [186, 116], 4: [246, 36], 5: [246, 150] };
  const E = [[0, 1, 4], [0, 2, 1], [1, 2, 3], [1, 3, 6], [2, 3, 5], [2, 4, 7], [3, 4, 2], [3, 5, 8], [4, 5, 9]];
  const wpos = { '0-1': [-10, 4], '0-2': [6, -6], '1-2': [-2, -8], '1-3': [-4, 16], '2-3': [4, -8], '2-4': [-6, -8], '3-4': [-12, 2], '3-5': [-10, 14], '4-5': [10, 4] };
  const panel = (x0, title, cls, extra) => {
    const Q = Object.fromEntries(Object.entries(P0).map(([k, [x, y]]) => [k, [x0 + x, 40 + y]]));
    for (const [u, v, w] of E) {
      o += edge(Q[u], Q[v], cls(u, v), 13);
      const [mx, my] = mid(Q[u], Q[v]);
      const [dx, dy] = wpos[u + '-' + v];
      o += text(mx + dx, my + dy + 4, String(w), cls(u, v) === 'ln' ? 'tl' : 'ts', 'middle');
    }
    for (const k in Q) o += node(Q[k][0], Q[k][1], k, extra && +k <= 2 ? 'wash ink-s' : 'paper', 't', 13);
    o += text(x0 + 140, 20, title, 'tb', 'middle');
    return Q;
  };
  const T = ['0-2', '1-2', '2-3', '3-4', '3-5'];
  panel(0, 'MST：total weight 19', (u, v) => (T.includes(u + '-' + v) ? 'ln' : 'mute'));
  const Q = panel(280, 'Cut {0, 1, 2} | {3, 4, 5}', (u, v) => (u + '-' + v === '2-3' ? 'ln' : (u <= 2 && v >= 3 ? 'ink' : 'mute')), true);
  o += path(`M${280 + 150} 50Q${280 + 128} 130 ${280 + 112} 212`, 'dash');
  o += text(280, 236, '左：粗线是 MST 的 5 条 edge。右：这个 cut 有三条 crossing edge，weight 是 6、5、7，', 'ts', 'middle');
  o += text(280, 254, '最轻的 2–3（weight 5）一定在 MST 里。', 'ts', 'middle');
  return svg(560, 264, o, '一个有 6 个 vertex、9 条 edge 的 weighted graph。左图标出 total weight 为 19 的 minimum spanning tree；右图是把 vertex 分成 0、1、2 和 3、4、5 的 cut，三条 crossing edge 里最轻的 2–3 在 MST 里');
}

// UFDS：path compression 前后
function ufds() {
  let o = '';
  const draw = (x0, pos, par, hiE, title, parr) => {
    const Q = Object.fromEntries(Object.entries(pos).map(([k, [x, lv]]) => [k, [x0 + x, 50 + lv * 46]]));
    for (const k in par) if (+k !== par[k]) o += dedge(Q[k], Q[par[k]], hiE.includes(+k) ? 'ln' : 'ink', 13);
    for (const k in Q) o += node(Q[k][0], Q[k][1], k, hiE.includes(+k) ? 'wash ink-s' : 'paper', 't', 13);
    o += text(x0 + 120, 22, title, 'tb', 'middle');
    o += text(x0 + 4, 228, 'p', 'tb', 'end') + text(x0 + 4, 246, 'i', 'ts', 'end');
    parr.forEach((v, i) => {
      o += cell(x0 + 12 + i * 26, 213, 26, 22, String(v), hiE.includes(i) ? 'wash ink-s' : 'paper') + text(x0 + 25 + i * 26, 249, String(i), 'ts', 'middle');
    });
  };
  draw(30, { 7: [120, 0], 6: [40, 1], 5: [110, 1], 3: [190, 1], 4: [110, 2], 2: [160, 2], 1: [220, 2], 0: [220, 3] },
    { 0: 1, 1: 3, 2: 3, 3: 7, 4: 5, 5: 7, 6: 7 }, [0, 1, 3], 'findSet(0) 之前', [1, 3, 3, 7, 5, 7, 7, 7]);
  draw(300, { 7: [120, 0], 6: [20, 1], 5: [70, 1], 3: [120, 1], 1: [170, 1], 0: [220, 1], 4: [70, 2], 2: [120, 2] },
    { 0: 7, 1: 7, 2: 3, 3: 7, 4: 5, 5: 7, 6: 7 }, [0, 1, 3], 'findSet(0) 之后', [7, 7, 3, 7, 5, 7, 7, 7]);
  o += arrow(262, 110, 296, 110, 'ln');
  o += text(280, 274, 'Arrow 从 child 指向 parent。走过的 path 0 → 1 → 3 → 7 上，每个 vertex 都被直接挂到 root 7 下面。', 'ts', 'middle');
  o += text(280, 291, 'rank[7] 仍然记着 3，而 tree 的 height 已经变成 2。', 'ts', 'middle');
  return svg(560, 302, o, 'Union-find 的 path compression：findSet(0) 之前 0 到 root 7 要走三条 edge，之后 0、1、3 都直接指向 7，对应的 parent array 从 1 3 3 7 5 7 7 7 变成 7 7 3 7 5 7 7 7');
}

// Dijkstra：每 pop 一个 vertex 之后的样子
function dijkstra() {
  let o = '';
  const P0 = [[22, 62], [84, 24], [84, 100], [150, 24], [150, 100]];
  const E = [[0, 1, 2], [0, 2, 6], [1, 2, 3], [1, 3, 8], [2, 3, 2], [2, 4, 9], [3, 4, 3]];
  const wp = [[-8, -6], [-8, 14], [9, 4], [0, -6], [-9, -2], [0, 14], [9, 4]];
  const INF = '∞';
  const steps = [
    { title: 'pop (0, 0)', done: [0], D: [0, 2, 6, INF, INF], ch: [1, 2], used: [0, 1] },
    { title: 'pop (2, 1)', done: [0, 1], D: [0, 2, 5, 10, INF], ch: [2, 3], used: [2, 3] },
    { title: 'pop (5, 2)', done: [0, 1, 2], D: [0, 2, 5, 7, 14], ch: [3, 4], used: [4, 5] },
    { title: 'pop (7, 3)', done: [0, 1, 2, 3], D: [0, 2, 5, 7, 10], ch: [4], used: [6] },
    { title: 'pop (10, 4)', done: [0, 1, 2, 3, 4], D: [0, 2, 5, 7, 10], ch: [], used: [] },
  ];
  const lab = [[0, 27, 'middle'], [0, -19, 'middle'], [0, 28, 'middle'], [0, -19, 'middle'], [0, 28, 'middle']];
  steps.forEach((st, n) => {
    const x0 = 14 + (n % 3) * 186, y0 = 36 + Math.floor(n / 3) * 162;
    const Q = P0.map(([x, y]) => [x0 + x, y0 + y]);
    E.forEach(([u, v, w], i) => {
      o += dedge(Q[u], Q[v], st.used.includes(i) ? 'ln' : 'mute', 12);
      const [mx, my] = mid(Q[u], Q[v]);
      o += text(mx + wp[i][0], my + wp[i][1], String(w), 'ts', 'middle');
    });
    Q.forEach(([x, y], v) => {
      const isDone = st.done.includes(v);
      o += node(x, y, String(v), isDone ? 'solid' : (st.D[v] === INF ? 'paper' : 'wash ink-s'), isDone ? 'tw' : 't', 12);
      o += text(x + lab[v][0], y + lab[v][1], String(st.D[v]), st.ch.includes(v) ? 'tl' : 'ts', lab[v][2]);
    });
    o += text(x0 + 86, y0 - 18, `${n + 1}. ${st.title}`, 'tb', 'middle');
  });
  const lx = 14 + 2 * 186 + 4, ly = 36 + 162 + 12;
  o += circle(lx + 8, ly, 7, 'solid') + text(lx + 22, ly + 4, '已经 pop：D 是最终值', 'ts');
  o += circle(lx + 8, ly + 22, 7, 'wash ink-s') + text(lx + 22, ly + 26, '在 PQ 里，D 还可能变小', 'ts');
  o += circle(lx + 8, ly + 44, 7, 'paper') + text(lx + 22, ly + 48, '还没碰到，D = ∞', 'ts');
  o += line(lx, ly + 66, lx + 16, ly + 66, 'ln') + text(lx + 22, ly + 70, '这一步 relax 的 edge', 'ts');
  o += text(lx, ly + 92, 'Vertex 旁的数是 D，', 'ts') + text(lx, ly + 108, '彩色的是这一步刚改小的', 'ts');
  o += text(280, 352, '实心的集合每一步多一个 vertex，而且总是外面 D 最小的那个；D 的 pop 次序 0, 2, 5, 7, 10 不会下降。', 'ts', 'middle');
  return svg(560, 362, o, 'Dijkstra’s algorithm 在一个 5 个 vertex 的 directed graph 上的五步：每一步 pop 出 D 最小的 vertex，把它标成已完成，并 relax 它的 outgoing edge；最终的 D 是 0、2、5、7、10');
}

export default {
  'cs2040-mergetree': mergetree,
  'cs2040-cqueue': cqueue,
  'cs2040-hash': hash,
  'cs2040-heap': heap,
  'cs2040-rotate': rotate,
  'cs2040-avllr': avllr,
  'cs2040-bfsdfs': bfsdfs,
  'cs2040-dag': dag,
  'cs2040-scc': scc,
  'cs2040-mst': mst,
  'cs2040-ufds': ufds,
  'cs2040-dijkstra': dijkstra,
};
