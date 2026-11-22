import { svg, svgA, d, path, line, rect, circle, poly, text, sub, ashow, f1 } from '../lib/svg.mjs';

// 概念线“搜索”的图。贯穿全文的是 CS2109S 第 1、2 站那张六个 state 的 graph。
const GN = { S: [60, 128], A: [180, 52], C: [290, 128], B: [400, 52], G: [510, 128], D: [290, 222] };
const GH = { S: 7, A: 6, C: 5, B: 3, D: 9, G: 0 };
const HSTAR = { S: 8, A: 7, C: 5, B: 3, D: 10, G: 0 };
const GE = [['S', 'A', 1, 1], ['S', 'C', 4, 1], ['S', 'D', 2, -1], ['A', 'B', 5, 1], ['A', 'C', 2, 1], ['C', 'B', 2, -1], ['C', 'G', 7, 1], ['B', 'G', 3, 1], ['D', 'G', 10, -1]];

// 线和箭头头分开给 class（虚线、淡线的箭头头需要单独的填充色）
function arr(x1, y1, x2, y2, lc, fc, size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  return line(x1, y1, x2 - 2 * Math.cos(a), y2 - 2 * Math.sin(a), lc) + poly([[x2, y2], p(0.42), p(-0.42)], fc);
}
// 两个圆心之间、去掉半径的一段，外加 label 的位置
function seg(P, Q, R, side, off = 12) {
  const [x1, y1] = P, [x2, y2] = Q;
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
  return { a: [x1 + ux * R, y1 + uy * R], b: [x2 - ux * (R + 2), y2 - uy * (R + 2)], m: [(x1 + x2) / 2 + uy * off * side, (y1 + y2) / 2 - ux * off * side] };
}
// 逐帧离散显示：durs 是每一帧停留的秒数
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [0];
  let acc = 0;
  for (let i = 0; i < durs.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  kt.push(1);
  const show = (on) => ashow([...on, on[on.length - 1]], kt, T);
  return { T, kt, show, n: durs.length };
}
// 同一位置、随帧变化的一段文字
function swapText(F, x, y, vals, cls, anchor = 'middle') {
  const uniq = [...new Set(vals)].filter((v) => v !== '' && v != null);
  return uniq.map((v) => `<g>${text(x, y, v, cls, anchor)}${F.show(vals.map((w) => w === v))}</g>`).join('');
}

// ---------- 1. 开头：algorithm 看得见什么 ----------
function view() {
  let o = '';
  const R = 17, seen = new Set(['S', 'A', 'C', 'D']);
  for (const [a, b, c, side] of GE) {
    const s = seg(GN[a], GN[b], R, side);
    if (a === 'S') {
      o += arr(...s.a, ...s.b, 'ink', 'ink-f') + text(s.m[0], s.m[1] + 4, String(c), 'tb', 'middle');
    } else {
      o += arr(...s.a, ...s.b, 'grid', 'faint-f') + text(s.m[0], s.m[1] + 4, String(c), 'ts', 'middle');
    }
  }
  for (const k of Object.keys(GN)) {
    const [x, y] = GN[k];
    if (k === 'S') o += circle(x, y, R, 'solid2') + text(x, y + 5, k, 'tw', 'middle');
    else if (seen.has(k)) o += circle(x, y, R + 4, 'wash') + circle(x, y, R, 'paper') + text(x, y + 5, k, 'tb', 'middle');
    else o += circle(x, y, R, 'frame') + text(x, y + 5, k, 'ts', 'middle');
  }
  o += text(60, 166, 'expand 过', 'ts', 'middle');
  o += text(180, 22, 'S-A：g = 1', 'tl', 'middle');
  o += text(290, 172, 'S-C：g = 4', 'tl', 'middle');
  o += text(338, 230, 'S-D：g = 2', 'tl', 'start');
  o += text(455, 210, '淡色的部分', 'ts', 'middle') + text(455, 226, 'algorithm 还看不见', 'ts', 'middle');
  o += text(280, 270, 'Expand 过 S 之后的 frontier 是 {S-A, S-D, S-C}。', 't', 'middle');
  o += text(280, 290, '还没见过的每一条 solution，都是从这三个 node 之一往下长出来的。', 'ts', 'middle');
  return svg(560, 298, o, '六个 state 的 graph：S 已经 expand，A、C、D 在 frontier 里，标着到它们的 g；其余的 edge 和 state 画成淡色，表示 algorithm 还没有看到');
}

// ---------- 2. 同一个 loop，UCS 和 A* 的 pop 次序（动图） ----------
const TP = {
  S: [270, 62], SA: [116, 117], SC: [362, 117], SD: [490, 117],
  SAB: [50, 172], SAC: [182, 172], SCB: [320, 172], SCG: [405, 172], SDG: [490, 172],
  SABG: [50, 227], SACB: [140, 227], SACG: [225, 227], SCBG: [320, 227], SACBG: [140, 282],
};
const TG = { S: 0, SA: 1, SC: 4, SD: 2, SAB: 6, SAC: 3, SCB: 6, SCG: 11, SDG: 12, SABG: 9, SACB: 5, SACG: 10, SCBG: 9, SACBG: 8 };
const kids = (k) => Object.keys(TP).filter((c) => c.length === k.length + 1 && c.startsWith(k));
const nm = (k) => k.split('').join('-');
function runSearch(order) {
  // 每一帧：已 pop 的（带序号）和已生成的
  const st = [];
  let gen = new Set(['S']);
  st.push({ pop: {}, gen: new Set(gen), cur: null });
  order.forEach((k, i) => {
    const pop = { ...st[st.length - 1].pop, [k]: i + 1 };
    if (!k.endsWith('G')) for (const c of kids(k)) gen.add(c);
    st.push({ pop, gen: new Set(gen), cur: k });
  });
  return st;
}
function loopA() {
  const ucsOrder = ['S', 'SA', 'SD', 'SAC', 'SC', 'SACB', 'SAB', 'SCB', 'SACBG'];
  const astOrder = ['S', 'SA', 'SAC', 'SACB', 'SACBG'];
  const U = runSearch(ucsOrder), A = runSearch(astOrder);
  const fU = (k) => TG[k], fA = (k) => TG[k] + GH[k[k.length - 1]];
  // 帧：UCS 的结果；A* 0..5；UCS 0..9
  const fr = [{ run: 'U', s: U[9] }, ...A.map((s) => ({ run: 'A', s })), ...U.map((s) => ({ run: 'U', s }))];
  const durs = fr.map((q, i) => (i === 0 ? 3.4 : q.run === 'A' && q.s === A[5] ? 3 : q.run === 'U' && q.s === U[9] ? 1.6 : 1.25));
  const F = frames(durs);
  let o = '';
  for (const k of Object.keys(TP)) if (k.length > 1) {
    const [x1, y1] = TP[k.slice(0, -1)], [x2, y2] = TP[k];
    o += line(x1, y1 + 13, x2, y2 - 13, 'grid');
    o += `<g>${line(x1, y1 + 13, x2, y2 - 13, 'ink')}${F.show(fr.map((q) => q.s.gen.has(k)))}</g>`;
  }
  for (const k of Object.keys(TP)) {
    const [x, y] = TP[k], s = k[k.length - 1], goal = s === 'G';
    o += circle(x, y, 13, 'frame') + text(x, y + 4.5, s, 'ts', 'middle');
    const isGen = fr.map((q) => q.s.gen.has(k) && !q.s.pop[k]);
    const isPop = fr.map((q) => !!q.s.pop[k]);
    o += `<g>${circle(x, y, 13, 'paper')}${text(x, y + 4.5, s, 'tb', 'middle')}${F.show(isGen)}</g>`;
    o += `<g>${circle(x, y, 13, goal ? 'solid' : 'solid2')}${text(x, y + 4.5, s, 'tw', 'middle')}${F.show(isPop)}</g>`;
    o += swapText(F, x + 17, y + 4, fr.map((q) => (q.s.gen.has(k) ? 'f = ' + (q.run === 'U' ? fU(k) : fA(k)) : '')), 'ts', 'start');
    o += swapText(F, x - 17, y + 4, fr.map((q) => (q.s.pop[k] ? '#' + q.s.pop[k] : '')), 'tl', 'end');
  }
  // 标题和 frontier
  const head = fr.map((q, i) => {
    const nmR = q.run === 'U' ? 'UCS（f = g）' : 'A*（f = g + h）';
    const n = Object.keys(q.s.pop).length;
    if (i === 0) return 'UCS（f = g）：pop 9 次，返回 cost 8';
    if (!q.s.cur) return nmR + '：frontier 里只有 root';
    const f = q.run === 'U' ? fU(q.s.cur) : fA(q.s.cur);
    if (q.s.cur.endsWith('G')) return nmR + '：第 ' + n + ' 次 pop 出 goal ' + nm(q.s.cur) + '，f = ' + f + '，返回';
    return nmR + '：第 ' + n + ' 次 pop，' + nm(q.s.cur) + '，f = ' + f;
  });
  o += swapText(F, 280, 18, head, 'tb');
  const front = fr.map((q) => {
    const fn = q.run === 'U' ? fU : fA;
    const ks = [...q.s.gen].filter((k) => !q.s.pop[k]).sort((a, b) => fn(a) - fn(b) || a.length - b.length);
    return 'frontier：' + ks.map((k) => nm(k) + ' ' + fn(k)).join('，');
  });
  o += swapText(F, 280, 318, front, 'ts');
  o += text(300, 282, '#k：第 k 次 pop；实心：已 pop', 'ts', 'start');
  return svgA(560, 326, o, '动图：同一棵 search tree 上先跑 A*，再跑 UCS。A* 按 f = g + h 只 pop 5 次，UCS 按 f = g pop 9 次，两次都在 pop 出 cost 8 的 goal 时停下；下方列出每一步的 frontier 和其中的 f 值');
}

// ---------- 3. reduced weight ----------
function reduced() {
  const H2 = { S: 7, A: 7, C: 0, B: 3, D: 9, G: 0 };
  const pos = (ox, k) => { const [x, y] = GN[k]; return [ox + 18 + (x - 60) * 0.5, 44 + (y - 52) * 0.62]; };
  let o = '';
  [[0, GH, 'consistent 的 h：每条 w′ ≥ 0'], [290, H2, 'h(A) = 7，h(C) = 0：两条 w′ < 0']].forEach(([ox, h, title]) => {
    o += text(ox + 133, 14, title, 'tb', 'middle');
    for (const [a, b, c, side] of GE) {
      const w = c - h[a] + h[b];
      const s = seg(pos(ox, a), pos(ox, b), 12, side, 9);
      const neg = w < 0;
      o += arr(...s.a, ...s.b, neg ? 'ln' : 'mute', neg ? 'ln-f' : 'mute-f', 6) + text(s.m[0], s.m[1] + 4, String(w).replace('-', '−'), neg ? 'tl' : 'tb', 'middle');
    }
    for (const k of Object.keys(GN)) {
      const [x, y] = pos(ox, k);
      o += circle(x, y, 12, k === 'G' ? 'solid' : 'paper') + text(x, y + 4.5, k, k === 'G' ? 'tw' : 'tb', 'middle');
      const up = k === 'A' || k === 'B';
      o += text(x, up ? y - 17 : y + 26, 'h = ' + h[k], 'ts', 'middle');
    }
  });
  o += line(280, 8, 280, 186, 'grid');
  o += text(280, 206, 'w′(u → v) = c(u → v) − h(u) + h(v)；c 是原来的 cost（见开头的图）', 'ts', 'middle');
  return svg(560, 212, o, '同一张 graph 画两遍，edge 上标的是 reduced weight w′ = c − h(u) + h(v)。左边用 consistent 的 heuristic，九条 w′ 都不小于 0；右边把 h(A) 改成 7、h(C) 改成 0，S 到 C 的 w′ 是 −3，A 到 C 的 w′ 是 −5');
}

// ---------- 4. value iteration：h* 一轮一轮算出来（动图） ----------
function viA() {
  const INF = Infinity;
  const sweeps = [{ G: 0, S: INF, A: INF, C: INF, B: INF, D: INF }];
  for (let k = 1; k <= 4; k++) {
    const V = sweeps[k - 1], W = { G: 0 };
    for (const u of ['S', 'A', 'C', 'B', 'D']) W[u] = Math.min(...GE.filter((e) => e[0] === u).map((e) => e[2] + V[e[1]]));
    sweeps.push(W);
  }
  const argE = (k) => (k === 0 ? [] : GE.filter(([a, b, c]) => Number.isFinite(sweeps[k][a]) && c + sweeps[k - 1][b] === sweeps[k][a]));
  const fr = [4, 0, 1, 2, 3, 4];
  const F = frames([3.4, 1.6, 1.9, 1.9, 1.9, 2.4]);
  let o = '';
  const R = 17;
  for (const [a, b, c, side] of GE) {
    const s = seg(GN[a], GN[b], R, side);
    o += arr(...s.a, ...s.b, 'mute', 'mute-f');
    o += `<g>${arr(...s.a, ...s.b, 'ln', 'ln-f')}${F.show(fr.map((k) => argE(k).some((e) => e[0] === a && e[1] === b)))}</g>`;
    o += text(s.m[0], s.m[1] + 4, String(c), 'tb', 'middle');
  }
  for (const k of Object.keys(GN)) {
    const [x, y] = GN[k];
    o += circle(x, y, R, k === 'G' ? 'solid' : 'paper') + text(x, y + 5, k, k === 'G' ? 'tw' : 'tb', 'middle');
    const vy = k === 'D' ? y - 26 : y - 25, hy = k === 'A' || k === 'B' ? y + 36 : y + 36;
    o += swapText(F, x, vy, fr.map((q) => { const v = sweeps[q][k]; return 'V = ' + (Number.isFinite(v) ? v : '∞'); }), 'tl');
    if (k !== 'G') o += text(x, hy, 'h = ' + GH[k], 'ts', 'middle');
  }
  const head = fr.map((q, i) => (i === 0 ? '收敛之后：V = h*，粗线是每个 state 取到 min 的那条 edge' : q === 0 ? '开始：V(G) = 0，其余是 ∞' : '第 ' + q + ' 轮之后：V 是最多走 ' + q + ' 条 edge 到 G 的最小 cost'));
  o += swapText(F, 280, 290, head, 't');
  o += text(280, 310, 'V(n) ← min over n → n′ [ c(n, n′) + V(n′) ]；下面的灰字 h 是 CS2109S 用的 heuristic，处处 ≤ h*', 'ts', 'middle');
  return svgA(560, 318, o, '动图：从 goal 往回做 value iteration。开始时只有 V(G) = 0，第 1 轮 B、C、D 得到 3、7、10，第 2 轮 A 是 8、C 改成 5、S 是 11，第 3 轮 A 改成 7、S 是 9，第 4 轮 S 是 8，之后不再变化，得到 h*');
}

// ---------- 5. knapsack 的 branch and bound tree ----------
function bb() {
  // [id, parent, 条件, bound 或 'inf'，是否 integer]
  const N = [
    ['r', null, '根', 22.2, false],
    ['a', 'r', 'x3 = 1', 22, false], ['b', 'r', 'x3 = 0', 22, false],
    ['aa', 'a', 'x4 = 1', 22, false], ['ab', 'a', 'x4 = 0', 21.67, false],
    ['ba', 'b', 'x2 = 1', 21.5, false], ['bb', 'b', 'x2 = 0', 18, true],
    ['aaa', 'aa', 'x1 = 1', 'inf', false], ['aab', 'aa', 'x1 = 0', 21, true],
    ['aba', 'ab', 'x2 = 1', 21, false], ['abb', 'ab', 'x2 = 0', 19, true],
    ['baa', 'ba', 'x4 = 1', 21.5, false], ['bab', 'ba', 'x4 = 0', 20, true],
    ['abaa', 'aba', 'x1 = 1', 'inf', false], ['abab', 'aba', 'x1 = 0', 15, true],
    ['baaa', 'baa', 'x1 = 1', 'inf', false], ['baab', 'baa', 'x1 = 0', 14, true],
  ];
  const by = Object.fromEntries(N.map((n) => [n[0], n]));
  const ch = (id) => N.filter((n) => n[1] === id).map((n) => n[0]);
  // 叶子按 DFS 次序排开
  const X = {}; let leaf = 0;
  const place = (id) => { const c = ch(id); if (!c.length) { X[id] = 34 + leaf * 61.5; leaf++; } else { c.forEach(place); X[id] = (X[c[0]] + X[c[c.length - 1]]) / 2; } };
  place('r');
  const Y = (id) => 52 + (id === 'r' ? 0 : id.length) * 62;
  const ma = new Set(['r', 'a', 'aa', 'aaa', 'aab', 'ab', 'b', 'ba', 'bb']); // MA3252 实际解过 LP 的
  const must = new Set(['r', 'a', 'aa', 'b']);
  let o = '';
  for (const [id, p] of N) if (p) o += line(X[p], Y(p) + 16, X[id], Y(id) - 16, ma.has(id) ? 'ink' : 'grid');
  for (const [id, , cond, bnd, isInt] of N) {
    const x = X[id], y = Y(id), on = ma.has(id);
    const cls = must.has(id) ? 'wash ink-s' : on ? 'paper' : 'frame';
    o += rect(x - 27, y - 16, 54, 32, cls, 4);
    if (isInt) o += rect(x - 27, y - 16, 54, 32, on ? 'ink-b' : 'mute', 4);
    const c = cond === '根' ? 'root' : cond.replace(/x(\d)/, (_, k) => 'x' + sub(k));
    o += text(x, y - 2, c, on ? 'ts' : 'ts', 'middle');
    const b = bnd === 'inf' ? '✕' : (bnd === 22.2 ? '22.2' : bnd === 21.67 ? '21.67' : String(bnd)) ;
    o += text(x, y + 12, b, must.has(id) ? 'tb' : on ? 't' : 'ts', 'middle');
  }
  o += text(280, 14, '每个 box：加的条件，下面是 LP bound。✕：infeasible；粗框：LP 的解恰好是 integer', 'ts', 'middle');
  o += text(280, 346, '着色：bound 的 floor 是 22 > 21，必须 branch', 'ts', 'middle');
  o += text(280, 364, '实线：MA3252 的顺序实际解过 LP 的 9 个 node；淡色：被 prune、没有生成', 'ts', 'middle');
  return svg(560, 370, o, 'Knapsack 的完整 branch and bound tree，17 个 node。每个 node 标出加的条件和 LP relaxation 的 bound。Bound 取 floor 后大于 21 的只有 root、x3 = 1、x3 = 1 且 x4 = 1、x3 = 0 四个，用深色标出；MA3252 页面的顺序实际解了其中 9 个 node 的 LP');
}

// ---------- 6. RRT* 的 choose parent 和 rewire 就是 relax ----------
function relax() {
  const P = { S: [0, 0], A: [2, 0], B: [2, 2], C: [4, 2], x: [2.6, 1.6] };
  const c = { S: 0, A: 2, B: 4, C: 6 };
  const dist = (p, q) => Math.hypot(P[p][0] - P[q][0], P[p][1] - P[q][1]);
  const at = (ox, k) => [ox + 30 + P[k][0] * 52, 168 - P[k][1] * 52];
  let o = '';
  const node = (ox, k, lab, cls = 'paper') => { const [x, y] = at(ox, k); return circle(x, y, 6, cls) + lab; };
  const edge = (ox, p, q, lc, fc) => { const s = seg(at(ox, p), at(ox, q), 6, 1, 0); return arr(...s.a, ...s.b, lc, fc, 6); };
  // 左：choose parent
  let ox = 0;
  o += text(135, 16, 'choose parent：relax 每条进入 x 的 edge', 'tb', 'middle');
  o += edge(ox, 'S', 'A', 'ink', 'ink-f') + edge(ox, 'A', 'B', 'ink', 'ink-f') + edge(ox, 'B', 'C', 'ink', 'ink-f');
  o += edge(ox, 'B', 'x', 'dash', 'ink-f') + edge(ox, 'C', 'x', 'dash', 'ink-f') + edge(ox, 'A', 'x', 'ln', 'ln-f');
  for (const k of ['S', 'A', 'B', 'C']) {
    const [x, y] = at(ox, k);
    o += node(ox, k, text(x + (k === 'C' ? 0 : k === 'S' ? -6 : -8), y + (k === 'B' || k === 'C' ? -12 : 20), k + '  c = ' + c[k], 'ts', k === 'C' ? 'middle' : k === 'S' ? 'start' : 'end'));
  }
  { const [x, y] = at(ox, 'x'); o += node(ox, 'x', '', 'solid') + text(x + 6, y + 22, 'x', 'tl', 'middle'); }
  o += text(30, 200, '经 A：2 + 1.709 = 3.709（选它）', 'tl', 'start');
  o += text(30, 218, '经 B：4 + 0.721 = 4.721（RRT 会选的最近点）', 'ts', 'start');
  o += text(30, 236, '经 C：6 + 1.456 = 7.456', 'ts', 'start');
  // 右：rewire
  ox = 290;
  o += text(425, 16, 'rewire：relax 每条从 x 出发的 edge', 'tb', 'middle');
  o += edge(ox, 'S', 'A', 'ink', 'ink-f') + edge(ox, 'A', 'B', 'ink', 'ink-f') + edge(ox, 'A', 'x', 'ink', 'ink-f');
  { const s = seg(at(ox, 'B'), at(ox, 'C'), 6, 1, 0); o += line(...s.a, ...s.b, 'grid'); const m = [(s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2]; o += line(m[0] - 5, m[1] - 5, m[0] + 5, m[1] + 5, 'mute') + line(m[0] - 5, m[1] + 5, m[0] + 5, m[1] - 5, 'mute'); }
  o += edge(ox, 'x', 'C', 'ln', 'ln-f') + edge(ox, 'x', 'B', 'dash', 'ink-f');
  for (const k of ['S', 'A', 'B', 'C']) {
    const [x, y] = at(ox, k);
    const lab = k === 'C' ? 'C  c: 6 → 5.165' : k + '  c = ' + c[k];
    o += node(ox, k, text(x + (k === 'C' ? -6 : k === 'S' ? -6 : -8), y + (k === 'B' || k === 'C' ? -12 : 20), lab, k === 'C' ? 'tl' : 'ts', k === 'C' ? 'middle' : k === 'S' ? 'start' : 'end'));
  }
  { const [x, y] = at(ox, 'x'); o += node(ox, 'x', '', 'solid') + text(x + 9, y + 19, 'x  c = 3.709', 'tl', 'start'); }
  o += text(320, 200, 'x → C：3.709 + 1.456 = 5.165 < 6，改 parent', 'tl', 'start');
  o += text(320, 218, 'x → B：3.709 + 0.721 = 4.430 > 4，不动', 'ts', 'start');
  o += line(280, 8, 280, 240, 'grid');
  return svg(560, 244, o, 'RB3302 的 RRT* 例子画成 relax：左边新 node x 的三个候选 parent，经 A 是 3.709，经最近的 B 是 4.721，经 C 是 7.456；右边 rewire，C 改由 x 当 parent，cost 从 6 降到 5.165，B 不变');
}

// ---------- 7. CBS 的 constraint tree ----------
function cbs() {
  let o = '';
  const box = (x, y, w, l1, l2, cls) => rect(x - w / 2, y - 22, w, 44, cls, 5) + text(x, y - 4, l1, 'tb', 'middle') + text(x, y + 14, l2, 'ts', 'middle');
  o += line(280, 70, 150, 124, 'ink') + line(280, 70, 410, 124, 'ink');
  o += box(280, 48, 300, 'root：没有 constraint，cost 4 + 4 = 8', 'conflict：a1、a2 都在 t = 2 到 C', 'paper');
  o += box(150, 146, 250, '加 (a1, C, 2)：a1 在 W1 等一步', 'cost 5 + 4 = 9；没有 conflict，返回', 'wash ink-s');
  o += box(410, 146, 250, '加 (a2, C, 2)：a2 在 N1 等一步', 'cost 4 + 5 = 9', 'paper');
  o += text(280, 194, 'Lemma 1：一个 CT node 的 cost 不超过它允许的任何 solution 的 cost', 't', 'middle');
  o += text(280, 212, 'Lemma 2：任何合法的 solution，任何时刻都被 OPEN 里某个 CT node 允许', 't', 'middle');
  o += text(280, 232, '分别就是骨架里的 P1（f 是 lower bound）和 P2（frontier 盖住所有 solution）', 'ts', 'middle');
  return svg(560, 240, o, 'RB3302 十字路口例子的 constraint tree：root 的 cost 8，有一个 conflict；两个 child 各加一条 constraint，cost 都是 9；左边的 child 没有 conflict，被返回。下方写出 CBS 的两条 lemma 和骨架两个前提的对应');
}

// ---------- 8. 两层的例子当作两步 reasoning ----------
function twolayer() {
  let o = '';
  const R = [280, 42], A = [200, 120], B = [360, 120];
  const L = { a1: [70, 208], a2: [230, 208], b1: [330, 208], b2: [490, 208] };
  const p = { a1: 0.2, a2: 0.9, b1: 0.6, b2: 0.6 };
  o += line(R[0], R[1] + 14, A[0], A[1] - 14, 'ln') + line(R[0], R[1] + 14, B[0], B[1] - 14, 'ln-dash');
  o += line(A[0], A[1] + 14, L.a1[0], L.a1[1] - 14, 'mute') + line(A[0], A[1] + 14, L.a2[0], L.a2[1] - 14, 'ln');
  o += line(B[0], B[1] + 14, L.b1[0], L.b1[1] - 14, 'ln-dash') + line(B[0], B[1] + 14, L.b2[0], L.b2[1] - 14, 'mute');
  o += circle(...R, 14, 'solid2') + text(R[0], R[1] + 5, 'x', 'tw', 'middle');
  o += circle(...A, 14, 'paper') + text(A[0], A[1] + 5, 'a', 'tb', 'middle');
  o += circle(...B, 14, 'paper') + text(B[0], B[1] + 5, 'b', 'tb', 'middle');
  for (const k of Object.keys(L)) {
    const [x, y] = L[k];
    o += rect(x - 18, y - 13, 36, 26, 'paper', 4) + text(x, y + 5, k, 'tb', 'middle');
    o += text(x, y + 32, 'p = ' + p[k], 'ts', 'middle');
  }
  o += text(A[0] - 22, A[1] - 6, 'random completion：0.55', 'ts', 'end') + text(A[0] - 22, A[1] + 11, '最好的 completion：0.9', 'tl', 'end');
  o += text(B[0] + 22, B[1] - 6, 'random completion：0.6', 'tl', 'start') + text(B[0] + 22, B[1] + 11, '最好的 completion：0.6', 'ts', 'start');
  o += text(280, 268, '实线：按“最好的 completion”走，0.9；虚线：按 soft label 走，0.6', 't', 'middle');
  o += text(280, 14, 'p：写到这个 leaf 时，最终答案对的 probability', 'ts', 'middle');
  return svg(560, 276, o, 'CS4246 的两层例子画成两步 reasoning：第一步 a 或 b，第二步 a1、a2、b1、b2，最终答案对的 probability 是 0.2、0.9、0.6、0.6。a 的 random completion 分数 0.55、最好的 completion 0.9；b 都是 0.6。按 random completion 的分数会走 b，得到 0.6；按最好的续写走 a 再 a2，得到 0.9');
}

// ---------- 9. dovetailing 就是两个方向的 iterative deepening（动图） ----------
function dovetailA() {
  const n = 8, cs = 24, x0 = 92, y0 = 40; // 列：string w_j；行：步数 s
  const target = [3, 5];
  const ks = [5, 1, 2, 3, 4, 5];
  const F = frames([3.4, 1.4, 1.4, 1.4, 1.4, 2.6]);
  let o = '';
  for (let j = 1; j <= n; j++) for (let s = 1; s <= n; s++) {
    const x = x0 + (j - 1) * cs, y = y0 + (s - 1) * cs;
    o += rect(x, y, cs, cs, 'frame');
    o += `<g>${rect(x + 1, y + 1, cs - 2, cs - 2, 'wash')}${F.show(ks.map((k) => j <= k && s <= k))}</g>`;
  }
  for (let j = 1; j <= n; j++) o += text(x0 + (j - 0.5) * cs, y0 - 8, 'w' + sub(String(j)), 'ts', 'middle');
  for (let s = 1; s <= n; s++) o += text(x0 - 8, y0 + (s - 0.5) * cs + 4, String(s), 'ts', 'end');
  o += text(x0 - 50, y0 + 4 * cs - 8, 'simulate', 'ts', 'middle') + text(x0 - 50, y0 + 4 * cs + 8, '的步数', 'ts', 'middle');
  const [tj, ts] = target, tx = x0 + (tj - 0.5) * cs, ty = y0 + (ts - 0.5) * cs;
  o += circle(tx, ty, 8, 'paper');
  o += `<g>${circle(tx, ty, 8, 'solid')}${F.show(ks.map((k, i) => i === 0 || (i === 5)))}</g>`;
  o += text(x0 + 2 * cs, y0 + n * cs + 20, 'M 在第 5 步 accept w' + sub('3'), 'tl', 'start');
  // 右侧说明
  const cum = (k) => (k * (k + 1) * (2 * k + 1)) / 6;
  const rx = 316;
  o += swapText(F, rx, 70, ks.map((k, i) => (i === 0 ? '第 5 轮找到：一共 simulate 了 55 步' : k === 1 ? '第 1 轮：w₁ 跑 1 步' : '第 ' + k + ' 轮：w₁…w' + '₁₂₃₄₅'[k - 1] + ' 各跑 ' + k + ' 步')), 'tb', 'start');
  o += swapText(F, rx, 92, ks.map((k) => '这一轮 ' + k * k + ' 步，累计 ' + cum(k) + ' 步'), 't', 'start');
  o += text(rx, 130, '第 k 轮从头 simulate 前 k 个 string 各 k 步。', 'ts', 'start');
  o += text(rx, 148, '“M 在第 s 步 accept wⱼ”的 cell，', 'ts', 'start');
  o += text(rx, 166, '到第 max(j, s) 轮一定被覆盖。', 'ts', 'start');
  o += text(rx, 196, '只沿 w₁ 一列往下跑（DFS 的走法）：', 'ts', 'start');
  o += text(rx, 214, 'M 在 w₁ 上不停，就永远到不了 w₃。', 'ts', 'start');
  o += arr(x0 + 0.5 * cs, y0 + n * cs + 4, x0 + 0.5 * cs, y0 + n * cs + 30, 'mute', 'mute-f', 6) + text(x0 + 0.5 * cs, y0 + n * cs + 44, '∞', 'ts', 'middle');
  return svgA(560, 300, o, '动图：横轴是 string w1 到 w8，纵轴是 simulate 的步数。Dovetailing 的第 k 轮覆盖左上角 k 乘 k 的方块，第 5 轮覆盖到 M 在第 5 步 accept w3 的那一格，累计 simulate 55 步');
}

export default {
  'thread-search-view': view,
  'thread-search-loop': loopA,
  'thread-search-reduced': reduced,
  'thread-search-vi': viA,
  'thread-search-bb': bb,
  'thread-search-relax': relax,
  'thread-search-cbs': cbs,
  'thread-search-twolayer': twolayer,
  'thread-search-dovetail': dovetailA,
};
