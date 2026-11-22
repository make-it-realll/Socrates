import { svg, svgA, anim, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 动图小工具：durs 是每一帧停留的秒数 → keyTimes；on[k] 决定第 k 帧显示不显示
const frames = (durs) => { const T = durs.reduce((a, b) => a + b, 0); let acc = 0; const kt = durs.map((v) => { const t = acc / T; acc += v; return t; }); return { kt, T }; };
const sText = (x, y, s, cls, anchor, on, F) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, F.kt, F.T)}</text>`;
const sPath = (dd, cls, on, F) => `<path d="${dd}" class="${cls}">${ashow(on, F.kt, F.T)}</path>`;
const sRect = (x, y, w, h, cls, rx, on, F) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${cls}">${ashow(on, F.kt, F.T)}</rect>`;
const sCircle = (x, y, r, cls, on, F) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" class="${cls}">${ashow(on, F.kt, F.T)}</circle>`;

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
  const adj = {}; for (const k in P) adj[k] = [];
  for (const [u, v] of E) { adj[u].push(v); adj[v].push(u); }
  for (const k in adj) adj[k].sort();
  // BFS：每一帧 = dequeue 一个 vertex 之后
  const bfs = [];
  { const D = { s: 0 }, par = {}, done = new Set(); let Q = ['s'];
    bfs.push({ D: { ...D }, par: { ...par }, done: new Set(done), ds: [...Q], msg: '开始：s 进 queue，D = 0' });
    while (Q.length) {
      const u = Q.shift(), add = [];
      for (const v of adj[u]) if (!(v in D)) { D[v] = D[u] + 1; par[v] = u; Q.push(v); add.push(v); }
      done.add(u);
      bfs.push({ D: { ...D }, par: { ...par }, done: new Set(done), ds: [...Q], msg: `dequeue ${u}：` + (add.length ? `放进 ${add.join('、')}，D = ${D[u] + 1}` : '没有新的 neighbor') });
    } }
  // DFS：每一帧 = recursion stack 变一次
  const dfs = [];
  { const ord = {}, par = {}, done = new Set(), stk = [], popped = []; let n = 0;
    const snap = (msg) => { dfs.push({ D: { ...ord }, par: { ...par }, done: new Set(done), ds: [...stk], msg }); popped.length = 0; };
    const go = (u) => {
      ord[u] = ++n; stk.push(u); snap((popped.length ? popped.join('、') + ' return，' : '') + `visit ${u}（第 ${n} 个）`);
      for (const v of adj[u]) if (!(v in ord)) { par[v] = u; go(v); }
      stk.pop(); done.add(u); popped.push(u);
    };
    go('s'); snap(popped.join('、') + ' 全部 return，stack 空了'); }
  const N = Math.max(bfs.length, dfs.length);
  const pad = (arr) => [...arr, ...Array(N - arr.length).fill(arr[arr.length - 1])];
  const Bs = pad(bfs), Ds = pad(dfs);
  const fr = [N - 1, ...Array.from({ length: N }, (_, k) => k)];
  const F = frames(fr.map((k, j) => (j === 0 ? 3.2 : k === N - 1 ? 1.6 : 1.1)));
  const panel = (x0, seq, title, sub, labOf, dsName, final, inf) => {
    const Q = Object.fromEntries(Object.entries(P).map(([k, [x, y]]) => [k, [x0 + x, 48 + y]]));
    const st = fr.map((k) => seq[k]);
    for (const [u, v] of E) {
      o += edge(Q[u], Q[v], 'dash');
      o += `<g>${edge(Q[u], Q[v], 'ln')}${ashow(st.map((S) => S.par[v] === u || S.par[u] === v), F.kt, F.T)}</g>`;
    }
    for (const k in Q) {
      const [x, y] = Q[k];
      o += circle(x, y, R, 'paper');
      o += sCircle(x, y, R, 'wash-strong', st.map((S) => k in S.D && !S.done.has(k)), F);
      o += sCircle(x, y, R, 'solid', st.map((S) => S.done.has(k)), F);
      o += sText(x, y + 4.5, k, 't', 'middle', st.map((S) => !S.done.has(k)), F) + sText(x, y + 4.5, k, 'tw', 'middle', st.map((S) => S.done.has(k)), F);
      const [dx, dy, an] = labOf[k];
      const vals = [...new Set(st.map((S) => S.D[k]).filter((v) => v !== undefined))];
      for (const v of vals) o += sText(x + dx, y + dy, String(v), 'tl', an, st.map((S) => S.D[k] === v), F);
      if (inf) o += sText(x + dx, y + dy, '∞', 'ts', an, st.map((S) => !(k in S.D)), F);
    }
    o += text(x0 + 140, 20, title, 'tb', 'middle') + text(x0 + 140, 38, sub, 'ts', 'middle');
    // queue / stack 的内容
    const yq = 238;
    o += text(x0 + 10, yq + 15, dsName, 'ts');
    st.forEach((S, j) => {
      const on = st.map((_, m) => m === j);
      let q = '';
      S.ds.forEach((v, i) => { q += rect(x0 + 60 + i * 24, yq, 22, 22, 'wash-strong', 3) + text(x0 + 71 + i * 24, yq + 15, v, 't', 'middle'); });
      if (!S.ds.length) q += text(x0 + 60, yq + 15, '空', 'ts');
      o += `<g>${q}${ashow(on, F.kt, F.T)}</g>`;
      o += sText(x0 + 10, yq + 42, j === 0 ? final : S.msg, j === 0 ? 'ts' : 't', 'start', on, F);
    });
  };
  const lab = { s: [0, 30, 'middle'], a: [20, -8, 'start'], c: [0, -20, 'middle'], b: [-20, -8, 'end'], d: [0, -20, 'middle'], e: [0, 30, 'middle'], f: [0, -20, 'middle'], g: [20, 5, 'start'] };
  panel(4, Bs, 'BFS(s)', '数字是 D：从 s 出发最少要走几条 edge', lab, 'queue', 'BFS tree 里 s 到 f 是 3 条 edge', true);
  panel(284, Ds, 'DFS(s)', '数字是 visit 的先后次序', lab, 'stack', 'DFS tree 里是 s → c → d → e → f，4 条', false);
  o += text(280, 306, '灰底：在 queue / recursion stack 里；深色：处理完。粗线是第一次到达某个 vertex 时走的 edge。', 'ts', 'middle');
  o += text(280, 323, 'Neighbor 都按字母顺序试。两边都到不了 g（BFS 里它的 D 一直是 ∞）。', 'ts', 'middle');
  return svgA(560, 332, o, '动图：同一个 undirected graph 上从 s 出发，左边 BFS 用 queue 一层一层往外，右边 DFS 用 recursion stack 一条路走到底；BFS tree 里 s 到 f 是 3 条 edge，DFS tree 里是 4 条');
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

// ---------- 新加的图共用：按 inorder 排 x、按 depth 排 y 画一棵 binary tree ----------
function bstFrom(keys) {
  let root = null;
  for (const k of keys) {
    const n = { k, l: null, r: null };
    if (!root) { root = n; continue; }
    let c = root;
    for (;;) {
      if (k < c.k) { if (!c.l) { c.l = n; break; } c = c.l; }
      else { if (!c.r) { c.r = n; break; } c = c.r; }
    }
  }
  return root;
}
function drawTree(root, ox, oy, dx, dy, hl = [], r = 13) {
  const pos = new Map();
  let i = 0;
  const walk = (n, dep) => { if (!n) return; walk(n.l, dep + 1); pos.set(n, [ox + i * dx, oy + dep * dy]); i++; walk(n.r, dep + 1); };
  walk(root, 0);
  let o = '';
  for (const [n, p] of pos) for (const c of [n.l, n.r]) if (c) o += edge(p, pos.get(c), 'ink', r);
  for (const [n, [x, y]] of pos) o += node(x, y, String(n.k), hl.includes(n.k) ? 'wash ink-s' : 'paper', 't', r);
  return o;
}
const height = (n) => (n ? 1 + Math.max(height(n.l), height(n.r)) : -1);

// ---------- 开头第三件事：按顺序 insert 得到一条链，同样的 key 可以很矮 ----------
function chain() {
  let o = '';
  const KA = [1, 2, 3, 4, 5, 6, 7], KB = [4, 2, 6, 1, 3, 5, 7];
  const A = bstFrom(KA), B = bstFrom(KB);
  // 帧：0 = 全部 insert 完；然后两边同步、一次 insert 一个 key
  const steps = [7, 1, 2, 3, 4, 5, 6, 7];
  const F = frames(steps.map((s, j) => (j === 0 ? 3 : s === 7 ? 1.8 : 1.0)));
  const has = (pos) => steps.map((s) => s > pos); // 第 pos 个 insert 的 key 在不在
  const isNew = (pos) => steps.map((s, j) => j > 0 && s === pos + 1);
  const depth = (root, k) => { let c = root, dd = 0; while (c.k !== k) { c = k < c.k ? c.l : c.r; dd++; } return dd; };
  const grow = (root, keys, ox, oy, dx, dy) => {
    const pos = new Map(); let i = 0;
    const walk = (n, dep) => { if (!n) return; walk(n.l, dep + 1); pos.set(n.k, [ox + i * dx, oy + dep * dy]); i++; walk(n.r, dep + 1); };
    walk(root, 0);
    const parent = new Map();
    const pw = (n) => { for (const c of [n.l, n.r]) if (c) { parent.set(c.k, n.k); pw(c); } }; pw(root);
    let q = '';
    keys.forEach((k, j) => { if (parent.has(k)) q += `<g>${edge(pos.get(parent.get(k)), pos.get(k), 'ink', 13)}${ashow(has(j), F.kt, F.T)}</g>`; });
    keys.forEach((k, j) => {
      const [x, y] = pos.get(k);
      q += `<g>${circle(x, y, 13, 'paper')}${ashow(has(j), F.kt, F.T)}</g>` + sCircle(x, y, 13, 'wash', isNew(j), F);
      q += sText(x, y + 4.5, String(k), 't', 'middle', has(j), F);
    });
    // height 和这一次比较了几次
    steps.forEach((s, j) => {
      const on = steps.map((_, m) => m === j);
      const h = Math.max(...keys.slice(0, s).map((k) => depth(root, k)));
      const cmp = depth(root, keys[s - 1]);
      q += sText(ox + 3 * dx, 40, j === 0 ? `height ${h}` : `height ${h}　insert ${keys[s - 1]}：比较了 ${cmp} 次`, 'ts', 'middle', on, F);
    });
    return q;
  };
  o += text(120, 22, '依次 insert 1, 2, …, 7', 'tb', 'middle');
  o += grow(A, KA, 40, 66, 27, 27);
  o += text(410, 22, '同样 7 个 key，按 4, 2, 6, 1, 3, 5, 7 insert', 'tb', 'middle');
  o += grow(B, KB, 314, 92, 32, 56);
  o += text(280, 262, 'Search 7：左边要比 7 次，右边 3 次。', 'ts', 'middle');
  o += text(280, 280, '10⁶ 个 key 时，左边那种 height 是 999999，右边那种可以只有 19。', 'ts', 'middle');
  return svgA(560, 292, o, '动图：两边同步一次 insert 一个 key。依次 insert 1 到 7，每个新 key 都挂在最右下角，height 一路涨到 6；按 4, 2, 6, 1, 3, 5, 7 insert，height 只有 2');
}

// ---------- Insertion sort 排 3 个 element 的 decision tree ----------
function dtree() {
  let o = '';
  const names = ['a', 'b', 'c'];
  const perms = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
  const root = { q: null, kids: {} };
  for (const val of perms) {
    const A = names.slice(), v = Object.fromEntries(names.map((n, i) => [n, val[i]]));
    let cur = root;
    for (let i = 1; i < 3; i++) {
      const x = A[i]; let j = i - 1;
      while (j >= 0) {
        const q = `${A[j]} > ${x} ?`, ans = v[A[j]] > v[x] ? 'yes' : 'no';
        cur.q = q; cur.kids[ans] = cur.kids[ans] || { q: null, kids: {} }; cur = cur.kids[ans];
        if (ans === 'no') break;
        A[j + 1] = A[j]; j--;
      }
      A[j + 1] = x;
    }
    cur.leaf = A.join(' < ');
  }
  // 布局：leaf 按 DFS 次序排开，内部 node 取 children 的平均
  let li = 0; const nl = 6, X = (k) => 52 + k * (456 / (nl - 1));
  const place = (n, dep) => {
    n.y = 58 + dep * 66;
    if (n.leaf) { n.x = X(li++); return; }
    const ks = ['yes', 'no'].filter((k) => n.kids[k]);
    ks.forEach((k) => place(n.kids[k], dep + 1));
    n.x = ks.reduce((s, k) => s + n.kids[k].x, 0) / ks.length;
  };
  place(root, 0);
  let maxd = 0;
  const draw = (n, dep) => {
    maxd = Math.max(maxd, dep);
    if (n.leaf) { o += rect(n.x - 38, n.y - 13, 76, 24, 'wash', 5) + text(n.x, n.y + 4, n.leaf, 't', 'middle'); return; }
    for (const k of ['yes', 'no']) if (n.kids[k]) {
      const c = n.kids[k];
      o += line(n.x, n.y + 12, c.x, c.y - 13, 'ink');
      const mx = (n.x + c.x) / 2, my = (n.y + 12 + c.y - 13) / 2;
      o += text(mx + (k === 'yes' ? -6 : 6), my + 4, k, 'ts', k === 'yes' ? 'end' : 'start');
      draw(c, dep + 1);
    }
    o += rect(n.x - 30, n.y - 12, 60, 24, 'paper', 5) + text(n.x, n.y + 4, n.q, 't', 'middle');
  };
  draw(root, 0);
  o += text(20, 24, 'Insertion sort 排三个不同的 element a, b, c（一开始依次放在 A[0], A[1], A[2]）', 'ts');
  o += text(20, 58 + 3 * 66 + 38, `6 个 leaf 对应 3! = 6 种 input 顺序；最深的 leaf 在第 ${maxd} 层：worst case 要 ${maxd} 次 comparison。`, 'ts');
  o += text(20, 58 + 3 * 66 + 56, '只有 2 层的话最多 4 个 leaf，分不出 6 种情况。', 'ts');
  return svg(560, 58 + 3 * 66 + 68, o, 'Insertion sort 排三个 element 的 decision tree：6 个 leaf，最深 3 层');
}

// ---------- Linked list：两行 pointer 赋值的先后 ----------
function linsert() {
  let o = '';
  const box = (x, y, s, cls = 'paper') => rect(x, y, 34, 24, cls) + rect(x + 34, y, 18, 24, cls) + text(x + 17, y + 16, s, 't', 'middle') + circle(x + 43, y + 12, 2.5, 'ink-f');
  const ptr = (x1, y1, x2, y2, cls = 'ink') => arrow(x1, y1, x2, y2, cls);
  const row = (x0, y, title, st) => {
    o += text(x0, y - 8, title, 'ts');
    const C = [x0, y + 14], B = [x0 + 170, y + 14], N = [x0 + 85, y + 50];
    o += box(C[0], C[1], 'cur') + box(B[0], B[1], 'B') + box(N[0], N[1], 'x', 'wash');
    o += text(B[0] + 60, B[1] + 16, '…', 't');
    if (st.cb) o += ptr(C[0] + 45, C[1] + 12, B[0] - 1, B[1] + 12, st.cb);
    if (st.cn) o += ptr(C[0] + 45, C[1] + 14, N[0] - 1, N[1] + 6, 'ln');
    if (st.nb) o += ptr(N[0] + 45, N[1] + 10, B[0] + 6, B[1] + 25, 'ln');
    if (st.nn) o += path(`M${N[0] + 46} ${N[1] + 14}C${N[0] + 90} ${N[1] + 44} ${N[0] - 30} ${N[1] + 50} ${N[0] - 2} ${N[1] + 18}`, 'ln') + arrow(N[0] - 6, N[1] + 22, N[0] - 1, N[1] + 16, 'ln');
    if (st.lost) o += text(B[0] + 26, B[1] + 44, '没人指着了', 'tl', 'middle');
  };
  o += text(20, 22, '正确的顺序', 'tb');
  row(20, 50, '开始：x 刚建好', { cb: 'ink' });
  row(20, 150, '① node.next = cur.next', { cb: 'ink', nb: true });
  row(20, 250, '② cur.next = node', { cn: true, nb: true });
  o += text(300, 22, '反过来写', 'tb');
  row(300, 150, '① cur.next = node', { cn: true, lost: true });
  row(300, 250, '② node.next = cur.next（即 node）', { cn: true, nn: true, lost: true });
  o += text(20, 354, '粗线是改过的 pointer。右边第一步覆盖了 cur.next，而 B 那一整段原本只有它记着。', 'ts');
  return svg(560, 366, o, 'Linked list insert：先让新 node 指向后半段再改 cur.next 是对的；反过来写，后半段丢失，新 node 指向自己');
}

// ---------- Quadratic probing：m = 11 ----------
function quad() {
  let o = '';
  const m = 11, cw = 40, x0 = 60;
  const sx = (i) => x0 + i * cw;
  const insert = (T, k) => { const seq = []; for (let j = 0; j < 2 * m; j++) { const s = (k % m + j * j) % m; seq.push(s); if (T[s] === null) { T[s] = k; return seq; } } return seq; };
  const arr = (y, T, mark = []) => {
    for (let i = 0; i < m; i++) {
      o += cell(sx(i), y, cw, 28, T[i] === null ? '' : String(T[i]), mark.includes(i) ? 'wash' : 'paper');
      o += text(sx(i) + cw / 2, y + 44, String(i), 'ts', 'middle');
    }
  };
  // 上：14, 25, 3, 36, 5
  const T1 = Array(m).fill(null); let s36 = [];
  for (const k of [14, 25, 3, 36, 5]) { const s = insert(T1, k); if (k === 36) s36 = s; }
  o += text(20, 24, 'insert 14, 25, 3, 36, 5（home 依次是 3, 3, 3, 3, 5），偏移是 0, 1, 4, 9, …', 'ts');
  const y1 = 92;
  arr(y1, T1, [3, 4, 7, 1]);
  // 36 的 probe：3 → 4 → 7 → 1
  for (let j = 1; j < s36.length; j++) {
    const a = sx(s36[j - 1]) + cw / 2, b = sx(s36[j]) + cw / 2, lift = 14 + 7 * j;
    o += path(`M${a} ${y1 - 2}Q${(a + b) / 2} ${y1 - 2 - lift * 2} ${b} ${y1 - 4}`, 'ln') + poly([[b, y1 - 2], [b - 4, y1 - 10], [b + 4, y1 - 10]], 'ln-f');
  }
  o += text(sx(s36[0]) + cw / 2, y1 - 8, '', 'ts');
  o += text(x0 + m * cw + 6, y1 + 18, '', 'ts');
  o += text(sx(9) + 10, 44, '36 的 probe：3 → 4 → 7 → 1', 'tl', 'middle');
  // 下：3, 14, 25, 36, 47, 58，再 insert 69
  const T2 = Array(m).fill(null);
  for (const k of [3, 14, 25, 36, 47, 58]) insert(T2, k);
  const offs = []; for (let j = 0; j < m; j++) offs.push((j * j) % m);
  const reach = [...new Set(offs.map((d) => (3 + d) % m))];
  const y2 = 214;
  o += text(20, y2 - 40, 'insert 3, 14, 25, 36, 47, 58（home 都是 3）之后，再 insert 69（home 也是 3）', 'ts');
  o += text(20, y2 - 22, `j² mod 11 = ${offs.join(', ')}：69 只会看 ${reach.length} 个 slot`, 'ts');
  arr(y2, T2, reach);
  for (let i = 0; i < m; i++) if (!reach.includes(i)) o += text(sx(i) + cw / 2, y2 + 18, '·', 'ts', 'middle');
  o += text(20, y2 + 72, `彩色底是 69 的 probe sequence 会看的 slot（全满）；其余 ${m - reach.length} 个空 slot 它永远看不到。`, 'ts');
  return svg(560, y2 + 84, o, 'Quadratic probing，m 等于 11：上面 36 依次看 slot 3、4、7、1；下面 home 为 3 的 key 只能用到 6 个 slot，第 7 个 key 找不到空位');
}

// ---------- Heap 画成 tree：用 index 算位置 ----------
function heapTree(A, x0, y0, w, dy, hl = [], pathI = [], r = 13) {
  let o = '';
  const P = (i) => { const lv = Math.floor(Math.log2(i)), k = i - (1 << lv); return [x0 + (k + 0.5) * w / (1 << lv), y0 + lv * dy]; };
  for (let i = 2; i < A.length; i++) o += edge(P(i >> 1), P(i), pathI.includes(i) && pathI.includes(i >> 1) ? 'ln' : 'ink', r);
  for (let i = 1; i < A.length; i++) { const [x, y] = P(i); o += node(x, y, String(A[i]), hl.includes(i) ? 'wash ink-s' : 'paper', 't', r); }
  return o;
}
function shiftPanels(up) {
  let o = '';
  const base = [null, 90, 70, 80, 30, 60, 50, 20, 10, 25, 40];
  const A0 = up ? [...base, 85] : [null, 60, 85, 80, 30, 70, 50, 20, 10, 25, 40];
  const n = A0.length - 1;
  // 逐步推出来：每一步先“比较”一帧，再“swap”一帧
  const st = [];
  let A = [...A0], i = up ? n : 1;
  st.push({ A: [...A], at: i, cmp: [], swap: null, msg: up ? `85 放在最后一格 index ${n}` : '取走 90，把最后一格的 60 放到 root' });
  for (;;) {
    if (up) {
      if (i === 1) break;
      const p = i >> 1;
      const go = A[p] < A[i];
      st.push({ A: [...A], at: i, cmp: [p], swap: null, msg: `parent 是 index ${i} / 2 = ${p} 的 ${A[p]}：` + (go ? `${A[p]} < ${A[i]}，swap` : `${A[p]} ≥ ${A[i]}，停`) });
      if (!go) break;
      [A[p], A[i]] = [A[i], A[p]]; st.push({ A: [...A], at: p, cmp: [], swap: [i, p], msg: `swap 之后 ${A[p]} 在 index ${p}` }); i = p;
    } else {
      const ch = [2 * i, 2 * i + 1].filter((c) => c <= n);
      if (!ch.length) break;
      const c = ch.reduce((a, b) => (A[b] > A[a] ? b : a));
      const go = A[c] > A[i];
      st.push({ A: [...A], at: i, cmp: ch, swap: null, msg: (ch.length === 2 ? `child 是 index ${ch.join('、')} 的 ${ch.map((k) => A[k]).join('、')}，较大的 ${A[c]}` : `child 只有 index ${c} 的 ${A[c]}`) + (go ? ` > ${A[i]}，swap` : `，不比 ${A[i]} 大，停`) });
      if (!go) break;
      [A[c], A[i]] = [A[i], A[c]]; st.push({ A: [...A], at: c, cmp: [], swap: [i, c], msg: `swap 之后 ${A[c]} 在 index ${c}` }); i = c;
    }
  }
  const pathI = up ? [11, 5, 2, 1] : [1, 2, 5, 10];
  const fr = [st.length - 1, ...st.map((_, k) => k)];
  const F = frames(fr.map((k, j) => (j === 0 ? 3.2 : k === st.length - 1 ? 1.8 : 1.3)));
  const S = fr.map((k) => st[k]);
  // tree
  const x0 = 120, w = 320, y0 = 30, dy = 42;
  const P = (k) => { const lv = Math.floor(Math.log2(k)), m = k - (1 << lv); return [x0 + (m + 0.5) * w / (1 << lv), y0 + lv * dy]; };
  for (let k = 2; k <= n; k++) o += edge(P(k >> 1), P(k), pathI.includes(k) && pathI.includes(k >> 1) ? 'ln' : 'ink', 13);
  // array
  const cw = 38, ax = (560 - n * cw) / 2, ay = 214;
  for (let k = 1; k <= n; k++) {
    o += text(ax + (k - 0.5) * cw, ay - 6, String(k), 'ts', 'middle');
    o += rect(ax + (k - 1) * cw, ay, cw, 26, 'paper');
  }
  o += text(ax - 8, ay + 18, 'array', 'ts', 'end') + text(ax - 8, ay - 6, 'index', 'ts', 'end');
  const mover = up ? 85 : 60;
  for (let k = 1; k <= n; k++) {
    const [x, y] = P(k);
    o += circle(x, y, 13, 'paper');
    o += sCircle(x, y, 13, 'wash-strong', S.map((s) => s.A[k] === mover), F);
    o += sCircle(x, y, 13, 'wash', S.map((s, j) => j > 0 && s.cmp.includes(k)), F);
    o += sRect(ax + (k - 1) * cw, ay, cw, 26, 'wash-strong', 0, S.map((s) => s.A[k] === mover), F);
    o += sRect(ax + (k - 1) * cw, ay, cw, 26, 'wash', 0, S.map((s, j) => j > 0 && s.cmp.includes(k)), F);
    const vals = [...new Set(S.map((s) => s.A[k]))];
    for (const v of vals) {
      const on = S.map((s) => s.A[k] === v), cls = v === mover ? 'tb' : 't';
      o += sText(x, y + 4.5, String(v), cls, 'middle', on, F) + sText(ax + (k - 0.5) * cw, ay + 18, String(v), cls, 'middle', on, F);
    }
  }
  // swap：array 上方画一条弧
  S.forEach((s, j) => {
    if (!s.swap || j === 0) return;
    const [a, b] = s.swap.map((k) => ax + (k - 0.5) * cw), on = S.map((_, m) => m === j);
    o += sPath(`M${f1(a)} ${ay + 28}Q${f1((a + b) / 2)} ${ay + 50} ${f1(b)} ${ay + 28}`, 'ln', on, F);
  });
  const note = up ? '85 沿 11 → 5 → 2 往上换了两次；到 index 2 时 parent 90 不小于它，停。' : '60 沿 1 → 2 → 5 往下，每次和较大的 child 换；到 index 5 时唯一的 child 40 比它小，停。';
  S.forEach((s, j) => {
    const on = S.map((_, m) => m === j);
    o += sText(280, 272, j === 0 ? note : s.msg, j === 0 ? 'ts' : 't', 'middle', on, F);
  });
  o += text(280, 290, '粗线是它走过的 path，其余的 node 一个都没碰。Tree 里 index k 的 parent 是 k / 2，children 是 2k、2k + 1。', 'ts', 'middle');
  return svgA(560, 300, o, up ? '动图：insert 85，先放在 index 11，和 parent 比较后两次 swap 换到 index 2，上面的 tree 和下面的 array 同步变化' : '动图：extractMax，60 补到 root，每次和较大的 child 比较并 swap，两次后停在 index 5，上面的 tree 和下面的 array 同步变化');
}
const shiftup = () => shiftPanels(true);
const shiftdown = () => shiftPanels(false);

// ---------- Bottom-up build heap：[4,1,7,3,8,5,9] ----------
function buildheap() {
  let o = '';
  const A = [null, 4, 1, 7, 3, 8, 5, 9], n = 7, steps = [[A.slice(), null, 0, []]];
  for (let i = Math.floor(n / 2); i >= 1; i--) {
    let k = i, sw = 0; const pth = [i];
    while (2 * k <= n) {
      let c = 2 * k; if (c + 1 <= n && A[c + 1] > A[c]) c++;
      if (A[k] >= A[c]) break;
      [A[k], A[c]] = [A[c], A[k]]; k = c; sw++; pth.push(k);
    }
    steps.push([A.slice(), i, sw, pth]);
  }
  steps.forEach(([T, i, sw, pth], s) => {
    const x0 = 6 + s * 138;
    o += text(x0 + 64, 24, i === null ? '开始' : `shiftDown(${i})`, 'tb', 'middle');
    o += text(x0 + 64, 42, i === null ? '把 array 当成 tree' : `swap ${sw} 次`, 'ts', 'middle');
    o += heapTree(T, x0, 70, 128, 50, pth.slice(-1).concat(i ? [i] : []), pth, 12);
    o += text(x0 + 64, 200, T.slice(1).join(' '), 'ts', 'middle');
  });
  o += text(280, 230, '粗线是这一次 shiftDown 走过的 path；浅色底是它的起点和终点。Index 4 到 7 是 leaf，不用处理。', 'ts', 'middle');
  return svg(560, 242, o, 'Bottom-up build heap：对 index 3、2、1 依次 shiftDown，一共 4 次 swap');
}

// ---------- BST delete 的三种情况 ----------
function bstdel() {
  let o = '';
  const cases = [
    ['删 20：没有 child', '直接摘掉', [50, 30, 70, 40, 60, 80, 35], []],
    ['删 40：一个 child', '35 顶替它，挂到 30 的右边', [50, 30, 70, 20, 35, 60, 80], [35]],
    ['删 50：两个 child', '换成 successor 60，再删旧的 60', [60, 30, 70, 20, 40, 80, 35], [60]],
  ];
  cases.forEach(([t, s, keys, hl], k) => {
    const x0 = 10 + k * 184;
    o += text(x0 + 82, 24, t, 'tb', 'middle') + text(x0 + 82, 42, s, 'ts', 'middle');
    o += drawTree(bstFrom(keys), x0 + 10, 76, 24, 46, hl, 12);
  });
  o += text(280, 258, '三棵都是从正文那棵 8 个 node 的 tree 删一个 key 得到的；浅色底是位置或 key 变了的 node。', 'ts', 'middle');
  return svg(560, 270, o, 'BST delete 的三种情况：删 leaf 20、删只有一个 child 的 40、删有两个 child 的 50');
}

// ---------- AVL：height 为 h、node 最少的 tree ----------
function minavl() {
  let o = '';
  let id = 0;
  const T = (h) => (h < 0 ? null : h === 0 ? { k: '', l: null, r: null, id: id++ } : { k: '', l: T(h - 1), r: T(h - 2), id: id++ });
  const cnt = (n) => (n ? 1 + cnt(n.l) + cnt(n.r) : 0);
  const xs = [30, 92, 178, 330], dxs = [0, 26, 26, 26];
  for (let h = 0; h <= 3; h++) {
    const t = T(h);
    o += text(xs[h] + (cnt(t) - 1) * dxs[h] / 2, 26, `h = ${h}`, 'tb', 'middle') + text(xs[h] + (cnt(t) - 1) * dxs[h] / 2, 44, `N${'₀₁₂₃'[h]} = ${cnt(t)}`, 'tl', 'middle');
    o += drawTree(t, xs[h], 72, dxs[h] || 1, 40, [], 9);
  }
  o += text(280, 238, '每一棵都是：一个 root，左边接上一棵（height 少 1 的最小 tree），右边接上上一棵（height 少 2 的）。', 'ts', 'middle');
  o += text(280, 256, '1 + 4 + 2 = 7：这就是 Nₕ = 1 + Nₕ₋₁ + Nₕ₋₂。', 'ts', 'middle');
  return svg(560, 268, o, 'height 为 0 到 3 的 node 最少的 AVL tree，node 数是 1、2、4、7');
}

// ---------- 第 6 站前半部分的 undirected graph ----------
function ugraph() {
  let o = '';
  const P = { b: [34, 30], a: [96, 30], s: [96, 100], c: [158, 100], d: [204, 46], e: [204, 154], f: [250, 100], g: [34, 154] };
  const E = [['a', 'b'], ['a', 's'], ['s', 'c'], ['c', 'd'], ['c', 'e'], ['d', 'e'], ['d', 'f'], ['e', 'f']];
  const Q = Object.fromEntries(Object.entries(P).map(([k, [x, y]]) => [k, [x + 30, y + 20]]));
  for (const [u, v] of E) o += edge(Q[u], Q[v], 'ink');
  for (const k in Q) o += node(Q[k][0], Q[k][1], k, k === 's' ? 'wash ink-s' : 'paper');
  // adjacency list
  const adj = {};
  for (const k of Object.keys(P).sort()) adj[k] = [];
  for (const [u, v] of E) { adj[u].push(v); adj[v].push(u); }
  const keys = Object.keys(adj).sort((x, y) => (x === 's' ? 1 : y === 's' ? -1 : x < y ? -1 : 1));
  o += text(340, 26, 'adjacency list', 'tb');
  keys.forEach((k, i) => {
    const y = 50 + i * 22;
    o += text(352, y, k + ':', 'tb', 'end');
    adj[k].sort().forEach((v, j) => { o += cell(360 + j * 26, y - 15, 26, 20, v, 'paper', 'ts'); });
    o += text(360 + Math.max(adj[k].length, 0) * 26 + 8, y, String(adj[k].length), 'tl');
  });
  o += text(20, 238, `8 个 vertex、${E.length} 条 edge；g 是孤立的。右边彩色数字是每条 list 的长度，加起来是 ${Object.values(adj).reduce((s, l) => s + l.length, 0)} = 2 × ${E.length}。`, 'ts');
  return svg(560, 250, o, '第 6 站前半部分的 undirected graph：8 个 vertex，8 条 edge，以及它的 adjacency list');
}

// ---------- Bellman–Ford 的例子 ----------
function bfgraph() {
  let o = '';
  const P = { s: [70, 130], a: [230, 60], b: [230, 200], c: [390, 60] };
  const E = [['a', 'c', 1, 1], ['b', 'a', -4, 2], ['s', 'a', 2, 3], ['s', 'b', 5, 4]];
  for (const [u, v, w, k] of E) {
    o += dedge(P[u], P[v], 'ink', 16);
    const [mx, my] = mid(P[u], P[v]);
    const off = u === 'b' ? [14, 4, 'start'] : u === 'a' ? [0, -10, 'middle'] : u === 's' && v === 'a' ? [-10, -8, 'end'] : [-10, 18, 'end'];
    o += text(mx + off[0], my + off[1], (w < 0 ? '−' + -w : String(w)) + `（第 ${k} 条）`, 't', off[2]);
  }
  // 只在 negative cycle 那一段才加的 c → b
  o += path(`M${P.c[0] + 4} ${P.c[1] + 16}Q${P.c[0] + 10} ${P.b[1] - 10} ${P.b[0] + 18} ${P.b[1] - 2}`, 'dash') + arrow(P.b[0] + 30, P.b[1] - 5, P.b[0] + 16, P.b[1] - 1, 'ink');
  o += text(P.c[0] + 20, 150, 'c → b（1）', 'ts') + text(P.c[0] + 20, 166, '只在 negative cycle', 'ts') + text(P.c[0] + 20, 182, '那一段才加上', 'ts');
  for (const k in P) o += node(P[k][0], P[k][1], k, k === 's' ? 'wash ink-s' : 'paper', 't', 15);
  o += text(20, 256, '括号里是它在 edge list 里的次序：每一轮按 a→c、b→a、s→a、s→b 的顺序 relax。', 'ts');
  o += text(20, 274, '到 c 的 shortest path 是 s → b → a → c，weight 5 − 4 + 1 = 2，正好和 edge list 的顺序相反。', 'ts');
  return svg(560, 286, o, 'Bellman–Ford 的例子：s、a、b、c 四个 vertex，四条 edge，其中 b 到 a 的 weight 是负 4');
}

// ---------- Floyd–Warshall：在 Bellman–Ford 的例子上，k 按 s、a、b、c 的次序 ----------
function fw() {
  let o = '';
  const V = ['s', 'a', 'b', 'c'];
  const E = [['a', 'c', 1], ['b', 'a', -4], ['s', 'a', 2], ['s', 'b', 5]];
  const n = V.length, id = Object.fromEntries(V.map((v, i) => [v, i]));
  const D = V.map((_, i) => V.map((_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of E) D[id[u]][id[v]] = w;
  const mats = [D.map((r) => r.slice())], changed = [[]], when = V.map(() => V.map(() => -1));
  for (let k = 0; k < n; k++) {
    const ch = [];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      if (D[i][k] + D[k][j] < D[i][j]) { ch.push([i, j, D[i][j], D[i][k] + D[k][j]]); D[i][j] = D[i][k] + D[k][j]; when[i][j] = k; }
    }
    mats.push(D.map((r) => r.slice())); changed.push(ch);
  }
  const fmt = (x) => (x === Infinity ? '∞' : x < 0 ? '−' + -x : String(x));
  // 帧 0 = 算完的总结；帧 1 = D⁰；帧 2..5 = 许经过 s、a、b、c
  const nf = n + 2;
  const F = frames([3.2, 2.2, 2, 2.4, 2.4, 2]);
  const onAt = (f) => Array.from({ length: nf }, (_, m) => m === f);
  const mOf = (f) => (f === 0 ? mats[n] : mats[f - 1]);
  const kOf = (f) => (f >= 2 ? f - 2 : -1);
  const titles = [
    '算完：彩色格子是中途改小过的，小字是在哪一轮',
    'D⁰：只许直接走一条 edge',
    ...V.map((v, k) => (changed[k + 1].length ? `许经过 ${v}：` + changed[k + 1].map(([i, j, a, b]) => `(${V[i]}, ${V[j]}) ${fmt(a)} → ${fmt(b)}`).join('，') : `许经过 ${v}：没有格子变小`)),
  ];
  titles.forEach((t, f) => { o += sText(280, 18, t, 'tb', 'middle', onAt(f), F); });
  // 左边：graph
  const P = { s: [34, 140], a: [124, 74], b: [124, 206], c: [214, 74] };
  const wo = { 'a-c': [0, -10, 'middle'], 'b-a': [10, 4, 'start'], 's-a': [-8, -8, 'end'], 's-b': [-8, 18, 'end'] };
  for (const [u, v, w] of E) {
    o += dedge(P[u], P[v], 'ink', 15);
    const [mx, my] = mid(P[u], P[v]);
    const [dx, dy, an] = wo[`${u}-${v}`];
    o += text(mx + dx, my + dy, fmt(w), 't', an);
  }
  V.forEach((v, k) => {
    const [x, y] = P[v];
    const isK = Array.from({ length: nf }, (_, f) => kOf(f) === k);
    o += circle(x, y, 15, 'paper') + sCircle(x, y, 15, 'solid', isK, F);
    o += sText(x, y + 4.5, v, 't', 'middle', isK.map((b) => !b), F) + sText(x, y + 4.5, v, 'tw', 'middle', isK, F);
  });
  o += text(124, 252, '深色的 vertex：这一轮许用的中间点', 'ts', 'middle');
  // 右边：matrix
  const x0 = 300, y0 = 64, cw = 58, ch = 44;
  V.forEach((v, j) => { o += text(x0 + j * cw + cw / 2, y0 - 10, v, 'tb', 'middle'); });
  V.forEach((v, i) => { o += text(x0 - 12, y0 + i * ch + ch / 2 + 4.5, v, 'tb', 'middle'); });
  o += text(x0 + 2 * cw, y0 - 30, '终点 →', 'ts', 'middle');
  o += text(x0 - 30, y0 + 2 * ch + 4, '起点', 'ts', 'end');
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const x = x0 + j * cw, y = y0 + i * ch;
    o += rect(x, y, cw, ch, 'paper');
    const hl = Array.from({ length: nf }, (_, f) => (f === 0 ? when[i][j] >= 0 : f >= 2 && changed[f - 1].some(([a, b]) => a === i && b === j)));
    o += sRect(x + 1, y + 1, cw - 2, ch - 2, 'wash', 0, hl, F);
    for (let f = 0; f < nf; f++) {
      const isHl = hl[f];
      const ty = f === 0 && when[i][j] >= 0 ? y + ch / 2 + 1 : y + ch / 2 + 5;
      o += sText(x + cw / 2, ty, fmt(mOf(f)[i][j]), isHl ? 'tl' : 't', 'middle', onAt(f), F);
    }
    if (when[i][j] >= 0) o += sText(x + cw / 2, y + ch - 6, `k = ${V[when[i][j]]}`, 'ts', 'middle', onAt(0), F);
  }
  o += text(x0 + 2 * cw, y0 + 4 * ch + 26, '第一行 0, 1, 5, 2 就是从 s 出发的 δ', 'ts', 'middle');
  return svgA(560, 300, o, `动图：Floyd–Warshall 在 s、a、b、c 四个 vertex 的 graph 上依次许 s、a、b、c 当中间点。许经过 a 时 (s, c) 变成 3、(b, c) 变成 −3；许经过 b 时 (s, a) 变成 1、(s, c) 变成 2；最后第一行是 0, 1, 5, 2`);
}

export default {
  'cs2040-fw': fw,
  'cs2040-chain': chain,
  'cs2040-dtree': dtree,
  'cs2040-linsert': linsert,
  'cs2040-quad': quad,
  'cs2040-shiftup': shiftup,
  'cs2040-shiftdown': shiftdown,
  'cs2040-buildheap': buildheap,
  'cs2040-bstdel': bstdel,
  'cs2040-minavl': minavl,
  'cs2040-ugraph': ugraph,
  'cs2040-bf': bfgraph,
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
