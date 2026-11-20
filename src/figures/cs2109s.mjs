import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 第 1、2 站共用的 state space graph
const GN = { S: [60, 128], A: [180, 52], C: [290, 128], B: [400, 52], G: [510, 128], D: [290, 222] };
const GH = { S: 7, A: 6, C: 5, B: 3, D: 9, G: 0 };
const GE = [['S', 'A', 1, 1], ['S', 'C', 4, 1], ['S', 'D', 2, -1], ['A', 'B', 5, 1], ['A', 'C', 2, 1], ['C', 'B', 2, -1], ['C', 'G', 7, 1], ['B', 'G', 3, 1], ['D', 'G', 10, -1]];

function graph() {
  let o = '';
  const R = 17;
  for (const [a, b, c, side] of GE) {
    const [x1, y1] = GN[a], [x2, y2] = GN[b];
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    o += arrow(x1 + ux * R, y1 + uy * R, x2 - ux * (R + 2), y2 - uy * (R + 2), 'ink');
    const mx = (x1 + x2) / 2 + uy * 12 * side, my = (y1 + y2) / 2 - ux * 12 * side;
    o += text(mx, my + 4, String(c), 'tb', 'middle');
  }
  for (const k of Object.keys(GN)) {
    const [x, y] = GN[k];
    o += circle(x, y, R, k === 'G' ? 'solid' : 'paper') + text(x, y + 5, k, k === 'G' ? 'tw' : 'tb', 'middle');
  }
  const hl = { S: [60, 166], A: [180, 24], C: [290, 166], B: [400, 24], G: [510, 166], D: [290, 260] };
  for (const k of Object.keys(hl)) o += text(hl[k][0], hl[k][1], 'h = ' + GH[k], 'ts', 'middle');
  o += text(280, 288, 'Edge 上的粗体数字是 action cost；每个 state 旁的 h 是第 2 站才用到的 heuristic', 'ts', 'middle');
  return svg(560, 298, o, '一个六个 state 的 state space graph：S 是 start，G 是 goal，edge 上标着 cost，每个 state 旁标着 heuristic 的值');
}

// 上面那张 graph 的 search tree，标出 UCS 的 pop 顺序
function tree() {
  const P = {
    S: [270, 28],
    SA: [116, 83], SC: [362, 83], SD: [490, 83],
    SAB: [50, 138], SAC: [182, 138], SCB: [320, 138], SCG: [405, 138], SDG: [490, 138],
    SABG: [50, 193], SACB: [140, 193], SACG: [225, 193], SCBG: [320, 193],
    SACBG: [140, 248],
  };
  const g = { S: 0, SA: 1, SC: 4, SD: 2, SAB: 6, SAC: 3, SCB: 6, SCG: 11, SDG: 12, SABG: 9, SACB: 5, SACG: 10, SCBG: 9, SACBG: 8 };
  const order = { S: 1, SA: 2, SD: 3, SAC: 4, SC: 5, SACB: 6, SAB: 7, SCB: 8, SACBG: 9 };
  let o = '';
  for (const k of Object.keys(P)) if (k.length > 1) {
    const [x1, y1] = P[k.slice(0, -1)], [x2, y2] = P[k];
    o += line(x1, y1, x2, y2, 'mute');
  }
  for (const k of Object.keys(P)) {
    const [x, y] = P[k], s = k[k.length - 1], goal = s === 'G';
    o += circle(x, y, 13, goal ? 'solid' : 'paper') + text(x, y + 4.5, s, goal ? 'tw' : 'tb', 'middle');
    o += text(x + 17, y + 4, 'g = ' + g[k], 'ts');
    if (order[k]) o += text(x - 17, y + 4, '#' + order[k], 'tl', 'end');
  }
  o += text(50, 224, 'DFS 返回，cost 9', 'ts', 'middle');
  o += text(140, 279, 'UCS 返回，cost 8', 'tl', 'middle');
  o += text(405, 169, 'BFS 返回，cost 11', 'ts', 'middle');
  o += text(330, 252, '#k：UCS 第 k 个 pop 出来的 node', 't');
  o += text(330, 272, 'g：从 root 到这个 node 的 path cost', 't');
  return svg(560, 292, o, '同一张 graph 对应的 search tree，共 14 个 node；标出了 UCS 的 pop 顺序，以及 DFS、BFS、UCS 各自返回的 goal node');
}

// UCS 与 A* 在同一个 grid 上展开了哪些 cell（实际跑出来的）
function gridSearch(useH) {
  const W = 12, Hh = 9, start = [1, 4], goal = [10, 4];
  const wall = new Set();
  for (let r = 1; r <= 7; r++) wall.add(6 + ',' + r);
  const key = (c) => c[0] + ',' + c[1];
  const h = (c) => (useH ? Math.abs(c[0] - goal[0]) + Math.abs(c[1] - goal[1]) : 0);
  const open = [{ c: start, g: 0, f: h(start), n: 0 }];
  const best = { [key(start)]: 0 }, parent = {}, closed = new Set();
  let cnt = 1;
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) {
      const a = open[i], b = open[bi];
      if (a.f < b.f || (a.f === b.f && (a.g > b.g || (a.g === b.g && a.n < b.n)))) bi = i;
    }
    const cur = open.splice(bi, 1)[0], k = key(cur.c);
    if (closed.has(k)) continue;
    if (k === key(goal)) break;
    closed.add(k);
    for (const [dx, dy] of [[1, 0], [0, -1], [0, 1], [-1, 0]]) {
      const nc = [cur.c[0] + dx, cur.c[1] + dy], nk = key(nc);
      if (nc[0] < 0 || nc[0] >= W || nc[1] < 0 || nc[1] >= Hh || wall.has(nk)) continue;
      if (!(nk in best) || cur.g + 1 < best[nk]) { best[nk] = cur.g + 1; parent[nk] = k; open.push({ c: nc, g: cur.g + 1, f: cur.g + 1 + h(nc), n: cnt++ }); }
    }
  }
  const pathCells = [];
  for (let k = key(goal); k; k = parent[k]) pathCells.unshift(k.split(',').map(Number));
  return { W, Hh, start, goal, wall, closed, pathCells, cost: best[key(goal)] };
}
function grid() {
  let o = '';
  const S = 20;
  const panel = (x0, res, title, note) => {
    const y0 = 34;
    for (const k of res.closed) { const [c, r] = k.split(',').map(Number); o += rect(x0 + c * S, y0 + r * S, S, S, 'wash'); }
    for (const k of res.wall) { const [c, r] = k.split(',').map(Number); o += rect(x0 + c * S, y0 + r * S, S, S, 'solid2'); }
    for (let c = 0; c <= res.W; c++) o += line(x0 + c * S, y0, x0 + c * S, y0 + res.Hh * S, 'grid');
    for (let r = 0; r <= res.Hh; r++) o += line(x0, y0 + r * S, x0 + res.W * S, y0 + r * S, 'grid');
    o += path(d(res.pathCells.map(([c, r]) => [x0 + c * S + S / 2, y0 + r * S + S / 2])), 'ln');
    const mark = (c, s) => { o += circle(x0 + c[0] * S + S / 2, y0 + c[1] * S + S / 2, 8.5, 'paper') + text(x0 + c[0] * S + S / 2, y0 + c[1] * S + S / 2 + 4, s, 'tb', 'middle'); };
    mark(res.start, 'S'); mark(res.goal, 'G');
    o += text(x0 + (res.W * S) / 2, 22, title, 'tb', 'middle') + text(x0 + (res.W * S) / 2, y0 + res.Hh * S + 20, note, 'ts', 'middle');
  };
  const u = gridSearch(false), a = gridSearch(true);
  panel(25, u, 'UCS（h = 0）', `expand 了 ${u.closed.size} 个 state，path cost ${u.cost}`);
  panel(295, a, 'A*（h = Manhattan distance）', `expand 了 ${a.closed.size} 个 state，path cost ${a.cost}`);
  o += text(280, 262, '浅色 cell 是 goal 被 pop 之前 expand 过的 state，深色是墙，彩线是返回的 path', 'ts', 'middle');
  return svg(560, 272, o, '同一个 grid 上，UCS 在找到 goal 之前几乎 expand 了全部 cell，A* 只 expand 了朝向 goal 的一部分，两者返回的 path cost 相同');
}

// 4-queens：每个空格里的数是“把这一 column 的 queen 移到这里之后有几对互相 attack”
function queens() {
  const conf = (s) => { let c = 0; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (s[i] === s[j] || Math.abs(s[i] - s[j]) === j - i) c++; return c; };
  let o = '';
  const S = 40;
  const board = (x0, s, title, note) => {
    const y0 = 40, cur = conf(s);
    let min = 99;
    const val = [];
    for (let r = 1; r <= 4; r++) for (let c = 0; c < 4; c++) if (s[c] !== r) { const t = s.slice(); t[c] = r; const v = conf(t); val.push([r, c, v]); min = Math.min(min, v); }
    for (const [r, c, v] of val) {
      if (v === min) o += rect(x0 + c * S, y0 + (r - 1) * S, S, S, 'wash');
      o += text(x0 + c * S + S / 2, y0 + (r - 1) * S + S / 2 + 5, String(v), v === min ? 'tl' : 't', 'middle');
    }
    for (let c = 0; c < 4; c++) o += circle(x0 + c * S + S / 2, y0 + (s[c] - 1) * S + S / 2, 13, 'solid') + text(x0 + c * S + S / 2, y0 + (s[c] - 1) * S + S / 2 + 4.5, 'Q', 'tw', 'middle');
    for (let i = 0; i <= 4; i++) o += line(x0 + i * S, y0, x0 + i * S, y0 + 4 * S, 'mute') + line(x0, y0 + i * S, x0 + 4 * S, y0 + i * S, 'mute');
    for (let i = 0; i < 4; i++) o += text(x0 - 8, y0 + i * S + S / 2 + 4, String(i + 1), 'ts', 'end') + text(x0 + i * S + S / 2, y0 - 7, String(i + 1), 'ts', 'middle');
    o += text(x0 + 80, 16, title + `：现在 ${cur} 对`, 'tb', 'middle') + text(x0 + 80, y0 + 4 * S + 22, note, 'ts', 'middle');
    return min;
  };
  board(70, [2, 1, 4, 1], 'State (2, 1, 4, 1)', '最小的数是 1，比 3 小：往那里走');
  board(340, [3, 1, 2, 4], 'State (3, 1, 2, 4)', '最小的数也是 1，不比现在小：停住');
  o += text(280, 250, '空格里的数：把这个 column 的 queen 移到这一格之后，互相 attack 的 queen 有几对', 'ts', 'middle');
  return svg(560, 260, o, '两个 4-queens 的 state 和它们全部 neighbor 的 conflict 数：左边有更好的 neighbor，右边没有，是 local minimum');
}

// Alpha-beta：被剪掉的 leaf
function alphabeta() {
  let o = '';
  const root = [280, 42], mins = [[100, 118], [280, 118], [460, 118]];
  const leaves = [[3, 12, 8], [2, 4, 6], [14, 5, 2]];
  const pruned = new Set(['1,1', '1,2']);
  const up = (x, y, cls) => poly([[x, y - 17], [x - 19, y + 13], [x + 19, y + 13]], cls);
  const down = (x, y, cls) => poly([[x, y + 17], [x - 19, y - 13], [x + 19, y - 13]], cls);
  let k = 0;
  mins.forEach(([mx, my], i) => {
    o += line(root[0], root[1] + 13, mx, my - 13, 'ink');
    leaves[i].forEach((v, j) => {
      const lx = mx + (j - 1) * 52, ly = 196, cut = pruned.has(i + ',' + j);
      o += line(mx, my + 17, lx, ly - 13, cut ? 'dash' : 'ink');
      if (cut) { const cx = (mx + lx) / 2, cy = (my + 17 + ly - 13) / 2; o += line(cx - 7, cy - 5, cx + 7, cy + 5, 'ln') + line(cx - 7, cy + 5, cx + 7, cy - 5, 'ln'); }
      o += rect(lx - 16, ly - 13, 32, 26, cut ? 'frame' : 'paper', 3) + text(lx, ly + 5, String(v), cut ? 'ts' : 'tb', 'middle');
      if (!cut) o += text(lx, ly + 30, '#' + ++k, 'ts', 'middle');
    });
  });
  o += up(root[0], root[1], 'wash ink-s') + text(root[0], root[1] + 8, '3', 'tb', 'middle');
  const mv = ['3', '≤ 2', '2'];
  mins.forEach(([mx, my], i) => { o += down(mx, my, 'paper') + text(mx, my + 2, mv[i], i === 1 ? 'tl' : 'tb', 'middle'); });
  o += text(root[0] + 28, root[1] + 4, 'MAX', 'ts') + text(mins[2][0] + 26, mins[2][1] + 2, 'MIN', 'ts');
  o += text(280, 252, '看完 #4 的 2：中间这个 MIN node 的 value ≤ 2，而 root 手里已经有 3', 't', 'middle');
  o += text(280, 272, '剩下的 4 和 6 取什么值都改变不了 root 的选择，不用 evaluate', 't', 'middle');
  return svg(560, 284, o, '一棵两层的 game tree：root 是 MAX，下面三个 MIN node 各有三个 leaf；中间那个 MIN node 看完第一个 leaf 之后，另外两个 leaf 被剪掉');
}

// Entropy 与 error rate 作为 impurity：谁是 strictly concave
function entropy() {
  const Hb = (p) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
  const er = (p) => Math.min(p, 1 - p);
  const sx = lin(0, 1, 60, 340), sy = lin(0, 1.05, 232, 28);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.05, xt: [[0, '0'], [0.5, '½'], [2 / 3, '⅔'], [1, '1']], yt: [[0.5, '0.5'], [1, '1']], xl: 'p：这一堆里 positive 的比例', yl: 'impurity' });
  o += path(curve(Hb, 0, 1, sx, sy, 300), 'ln') + path(curve(er, 0, 1, sx, sy, 200), 'ink');
  o += line(sx(0.5), sy(1), sx(1), sy(0), 'ln-dash');
  const p = 2 / 3, chord = 2 / 3;
  o += line(sx(p), sy(chord), sx(p), sy(Hb(p)), 'ink-b');
  o += circle(sx(0.5), sy(1), 4, 'ln-f') + circle(sx(1), sy(0), 4, 'ln-f') + circle(sx(p), sy(Hb(p)), 4, 'ln-f') + circle(sx(p), sy(chord), 3.5, 'ln paper-f');
  o += circle(sx(0.5), sy(0.5), 4, 'ink-f') + circle(sx(p), sy(er(p)), 4, 'ink-f');
  o += text(sx(0.2), sy(0.9), 'entropy', 'tl', 'end') + text(sx(0.2) + 8, sy(0.12), 'error rate', 'tb');
  o += text(362, 52, 'Parent：p = ⅔（4 +，2 −）', 'tb');
  o += text(362, 74, '两个 child：p = 1（占 ⅓）', 't') + text(362, 94, '和 p = ½（占 ⅔）', 't');
  o += text(362, 128, 'Entropy：curve 在 chord 上方', 'tl') + text(362, 148, '0.918 − 0.667 = 0.252', 't') + text(362, 168, '粗线就是 information gain', 't');
  o += text(362, 202, 'Error rate：这一段是 line，', 'tb') + text(362, 222, 'chord 与 curve 重合，', 't') + text(362, 242, 'gain = 0', 't');
  return svg(560, 270, o, 'Entropy 和 error rate 随 positive 比例变化的两条 curve：entropy 处处向下弯，split 之后的加权平均一定落在 curve 下方；error rate 在二分之一到一之间是一条 line，加权平均落在 curve 上');
}

// Gradient descent 在三个点的 loss 上的 path，两种 step size
function gd() {
  const X = [[1, 1], [1, 2], [1, 3]], y = [1, 2, 2], n = 3;
  const grad = (w) => { const g = [0, 0]; X.forEach((r, i) => { const e = r[0] * w[0] + r[1] * w[1] - y[i]; g[0] += (e * r[0]) / n; g[1] += (e * r[1]) / n; }); return g; };
  const ws = [2 / 3, 1 / 2];
  const a = 1, b = 2, c = 14 / 3, m = (a + c) / 2, r = Math.hypot((a - c) / 2, b);
  const l1 = m + r, l2 = m - r;
  const v1 = [b, l1 - a], n1 = Math.hypot(v1[0], v1[1]);
  const e1 = [v1[0] / n1, v1[1] / n1], e2 = [-e1[1], e1[0]];
  let o = '';
  const panel = (x0, alpha, steps, title, note) => {
    const sx = lin(-0.35, 1.35, x0, x0 + 225), sy = lin(-0.2, 1.3, 222, 32);
    const inside = (p) => p[0] >= -0.35 && p[0] <= 1.35 && p[1] >= -0.2 && p[1] <= 1.3;
    o += rect(x0, 32, 225, 190, 'frame');
    for (const lv of [0.004, 0.02, 0.06, 0.15, 0.35, 0.7, 1.2, 1.9]) {
      let seg = [];
      for (let i = 0; i <= 240; i++) {
        const t = (2 * Math.PI * i) / 240, u = Math.sqrt((2 * lv) / l1) * Math.cos(t), v = Math.sqrt((2 * lv) / l2) * Math.sin(t);
        const p = [ws[0] + u * e1[0] + v * e2[0], ws[1] + u * e1[1] + v * e2[1]];
        if (inside(p)) seg.push([sx(p[0]), sy(p[1])]);
        else { if (seg.length > 1) o += path(d(seg), 'grid'); seg = []; }
      }
      if (seg.length > 1) o += path(d(seg), 'grid');
    }
    let w = [0, 0];
    const pts = [[sx(0), sy(0)]];
    for (let k = 0; k < steps; k++) { const g = grad(w); w = [w[0] - alpha * g[0], w[1] - alpha * g[1]]; pts.push([sx(w[0]), sy(w[1])]); }
    o += path(d(pts), 'ln');
    pts.forEach((p, i) => { if (i < 7) o += circle(p[0], p[1], 2.6, 'ln-f'); });
    o += circle(sx(ws[0]), sy(ws[1]), 4.5, 'ink-f') + circle(sx(0), sy(0), 4, 'ln paper-f');
    o += text(sx(0) + 8, sy(0) + 14, '(0, 0)', 'ts') + text(sx(ws[0]) + 8, sy(ws[1]) - 7, 'minimum (⅔, ½)', 'ts');
    o += text(x0 + 112, 20, title, 'tb', 'middle') + text(x0 + 112, 240, note, 'ts', 'middle');
  };
  panel(40, 0.1, 40, 'α = 0.1：前 40 步', '两步下到谷底，然后沿谷底慢慢爬');
  panel(300, 0.3, 40, 'α = 0.3：前 40 步', '在谷的两壁之间来回跳，同时沿谷底前进');
  o += text(280, 262, '横轴 w₀，纵轴 w₁；灰线是 loss J 的 contour，共用同一组 level', 'ts', 'middle');
  return svg(560, 272, o, '同一个 quadratic loss 的 contour 上，两种 step size 的 gradient descent path：小 step size 平滑但沿狭长的谷底走得很慢，大 step size 在谷的两侧来回振荡');
}

// 同一组 10 个点，degree 1、2、9 三种 polynomial
function polyfit() {
  const n = 10, xs = Array.from({ length: n }, (_, i) => -1 + (2 * i) / 9);
  const ys = [-3.9433, -2.5272, -1.161, -0.7324, 1.2807, 1.5284, 1.2357, 1.4173, 0.8251, -0.1661];
  const truth = (x) => 1 + 2 * x - 3 * x * x;
  const solve = (A, b) => {
    const m = b.length, M = A.map((r, i) => [...r, b[i]]);
    for (let c = 0; c < m; c++) {
      let p = c;
      for (let r = c + 1; r < m; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < m; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= m; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = Array(m).fill(0);
    for (let r = m - 1; r >= 0; r--) { let s = M[r][m]; for (let k = r + 1; k < m; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  };
  const fit = (deg) => {
    if (deg === n - 1) return (x) => { let s = 0; for (let i = 0; i < n; i++) { let l = 1; for (let j = 0; j < n; j++) if (j !== i) l *= (x - xs[j]) / (xs[i] - xs[j]); s += l * ys[i]; } return s; };
    const A = Array.from({ length: deg + 1 }, (_, i) => Array.from({ length: deg + 1 }, (_, j) => xs.reduce((s, x) => s + x ** (i + j), 0)));
    const b = Array.from({ length: deg + 1 }, (_, i) => xs.reduce((s, x, k) => s + x ** i * ys[k], 0));
    const w = solve(A, b);
    return (x) => w.reduce((s, c, i) => s + c * x ** i, 0);
  };
  let o = '';
  const panel = (x0, deg, title) => {
    const f = fit(deg);
    const sx = lin(-1, 1, x0 + 6, x0 + 154), lo = -4.6, hi = 2.8, sy = lin(lo, hi, 205, 34);
    o += rect(x0, 34, 160, 171, 'frame');
    o += path(curve(truth, -1, 1, sx, sy), 'dash');
    let seg = [];
    for (let i = 0; i <= 400; i++) {
      const x = -1 + i / 200, v = f(x);
      if (v >= lo && v <= hi) seg.push([sx(x), sy(v)]);
      else { if (seg.length > 1) o += path(d(seg), 'ln'); seg = []; }
    }
    if (seg.length > 1) o += path(d(seg), 'ln');
    xs.forEach((x, i) => { o += circle(sx(x), sy(ys[i]), 3.2, 'ink-f'); });
    const tr = xs.reduce((s, x, i) => s + (f(x) - ys[i]) ** 2, 0) / n;
    let te = 0;
    for (let i = 0; i <= 400; i++) { const x = -1 + i / 200; te += (f(x) - truth(x)) ** 2; }
    te = te / 401 + 0.09;
    o += text(x0 + 80, 22, title, 'tb', 'middle');
    o += text(x0 + 80, 223, `training error ${tr.toFixed(3)}`, 'ts', 'middle') + text(x0 + 80, 240, `test error ${te.toFixed(3)}`, 't', 'middle');
  };
  panel(20, 1, 'Degree 1');
  panel(200, 2, 'Degree 2');
  panel(380, 9, 'Degree 9');
  o += text(280, 264, '虚线是产生 data 的 quadratic function，彩线是 fit 出来的 polynomial；error 都是 mean squared error', 'ts', 'middle');
  return svg(560, 274, o, '同样十个带 noise 的点，用 degree 1、2、9 的 polynomial 去 fit：degree 1 弯不过来，degree 2 贴合，degree 9 穿过每个点但在点之间剧烈摆动');
}

// 用 linear regression 做 classification：一个离得很远的点把 threshold 拉偏
function lsclass() {
  const sx = lin(0, 21, 50, 530), sy = lin(-0.35, 1.45, 215, 25);
  let o = axes({ sx, sy, x0: 0, x1: 21, y0: -0.35, y1: 1.45, xt: [1, 2, 3, 4, 5, 6, 20], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'x', yl: 'y' });
  o += line(sx(0), sy(0.5), sx(21), sy(0.5), 'dash');
  const l1 = (x) => -0.4 + 0.2571429 * x, l2 = (x) => 0.3012478 + 0.0461312 * x;
  o += line(sx(0.3), sy(l1(0.3)), sx(7), sy(l1(7)), 'ink') + line(sx(0), sy(l2(0)), sx(21), sy(l2(21)), 'ln');
  for (const x of [1, 2, 3]) o += circle(sx(x), sy(0), 4.5, 'paper');
  for (const x of [4, 5, 6, 20]) o += circle(sx(x), sy(1), 4.5, 'ink-f');
  const t1 = 3.5, t2 = (0.5 - 0.3012478) / 0.0461312;
  o += line(sx(t1), sy(0.5) - 7, sx(t1), sy(0.5) + 7, 'ink-b') + line(sx(t2), sy(0.5) - 7, sx(t2), sy(0.5) + 7, 'ln');
  o += text(sx(7.4), sy(1.33), '只用前 6 个点：threshold 在 3.5', 'tb');
  o += text(sx(8), sy(0.3), '加上 x = 20 的点之后：threshold 在 4.31', 'tl');
  o += text(sx(8), sy(0.3) + 18, 'x = 4 的 prediction 是 0.486，被判成 class 0', 'ts');
  o += text(sx(20), sy(1) + 20, '新加的点', 'ts', 'middle');
  return svg(560, 250, o, '六个点用 least squares 的 line 做 classification 时 threshold 在 3.5；加入一个远处的、本来就分对的点之后，line 被拉平，threshold 移到 4.31，原来分对的一个点被分错');
}

// SVM：maximum margin 与一个 outlier 的影响
function svm() {
  const pos = [[2, 2], [3, 2], [2, 3], [3, 4]], neg = [[1, 1], [0, 0], [1, 0], [0, 1]];
  let o = '';
  const panel = (x0, title, extra) => {
    const sx = lin(-0.6, 4.6, x0, x0 + 220), sy = lin(-0.6, 4.6, 250, 30);
    o += rect(x0, 30, 220, 220, 'frame');
    // 画一条 w·x + b = c 的线，裁在面板内
    const hl = (w, b, c, cls) => {
      const pts = [];
      for (let i = 0; i <= 400; i++) {
        const t = -0.6 + (5.2 * i) / 400;
        const p = Math.abs(w[1]) > 1e-9 ? [t, (c - b - w[0] * t) / w[1]] : [(c - b) / w[0], t];
        if (p[0] >= -0.6 && p[0] <= 4.6 && p[1] >= -0.6 && p[1] <= 4.6) pts.push([sx(p[0]), sy(p[1])]);
      }
      if (pts.length > 1) o += line(pts[0][0], pts[0][1], pts[pts.length - 1][0], pts[pts.length - 1][1], cls);
    };
    extra(sx, sy, hl);
    for (const p of neg) o += circle(sx(p[0]), sy(p[1]), 4.5, 'paper');
    for (const p of pos) o += circle(sx(p[0]), sy(p[1]), 4.5, 'ink-f');
    o += text(x0 + 110, 20, title, 'tb', 'middle');
    return [sx, sy];
  };
  panel(40, '8 个点：maximum margin', (sx, sy, hl) => {
    o += poly([[sx(-0.6), sy(2.6)], [sx(2.6), sy(-0.6)], [sx(4.6), sy(-0.6)], [sx(-0.6), sy(4.6)]], 'wash');
    hl([1, 1], -3, 0, 'ink-b'); hl([1, 1], -3, 1, 'dash'); hl([1, 1], -3, -1, 'dash');
    o += circle(sx(2), sy(2), 9, 'ln') + circle(sx(1), sy(1), 9, 'ln');
  });
  panel(300, '多一个 + 点 (1.5, 1)', (sx, sy, hl) => {
    hl([4, 0], -5, 0, 'ink-b'); hl([4, 0], -5, 1, 'dash'); hl([4, 0], -5, -1, 'dash');
    hl([0.8, 0.6], -1.8, 0, 'ln'); hl([0.8, 0.6], -1.8, 1, 'ln-dash'); hl([0.8, 0.6], -1.8, -1, 'ln-dash');
    o += circle(sx(1.5), sy(1), 4.5, 'ink-f') + circle(sx(1.5), sy(1), 9, 'ln');
  });
  o += text(150, 268, 'Boundary：x₁ + x₂ = 3，margin 0.707', 't', 'middle') + text(150, 286, '圈出的两个点是 support vector', 'ts', 'middle');
  o += text(410, 268, '黑线：hard margin，margin 0.25', 't', 'middle') + text(410, 286, '彩线：soft margin，C = 1，margin 1.0', 'tl', 'middle');
  o += text(280, 310, '实心点是 class +1，空心点是 class −1；实线是 decision boundary，虚线是 margin 的两条边', 'ts', 'middle');
  return svg(560, 320, o, '左图是八个点的 maximum-margin boundary，margin 由一正一负两个 support vector 决定；右图多了一个靠近负类的正点，hard margin 被挤到 0.25，soft margin 取 C 等于 1 时放弃这个点，margin 是 1.0');
}

// Feature map：一维上分不开，升到 (x, x²) 就能用一条 line 分开
function lift() {
  let o = '';
  const pts = [[-3, 1], [-1, -1], [1, -1], [3, 1]];
  const sx1 = lin(-4, 4, 30, 250);
  o += line(30, 150, 250, 150, 'axis');
  for (const v of [-3, -1, 1, 3]) o += line(sx1(v), 146, sx1(v), 154, 'axis') + text(sx1(v), 172, String(v).replace('-', '−'), 'ts', 'middle');
  for (const [x, c] of pts) o += circle(sx1(x), 150, 5, c > 0 ? 'ink-f' : 'paper');
  o += text(140, 22, '只有 x：一个 threshold 分不开', 'tb', 'middle');
  o += text(140, 108, '+ 在两边，− 在中间', 'ts', 'middle');
  o += arrow(258, 150, 296, 150, 'ink') + text(277, 138, 'φ', 't', 'middle');
  const sx = lin(-4, 4, 320, 540), sy = lin(0, 10.5, 232, 36);
  o += axes({ sx, sy, x0: -4, x1: 4, y0: 0, y1: 10.5, xt: [[-3, '−3'], [-1, '−1'], [1, '1'], [3, '3']], yt: [1, 5, 9], yAt: -4 });
  o += path(curve((x) => x * x, -3.24, 3.24, sx, sy), 'mute');
  o += rect(sx(-4), sy(9), sx(4) - sx(-4), sy(1) - sy(9), 'wash');
  o += line(sx(-4), sy(5), sx(4), sy(5), 'ink-b') + line(sx(-4), sy(1), sx(4), sy(1), 'dash') + line(sx(-4), sy(9), sx(4), sy(9), 'dash');
  for (const [x, c] of pts) o += circle(sx(x), sy(x * x), 5, c > 0 ? 'ink-f' : 'paper');
  o += text(430, 22, 'φ(x) = (x, x²)：一条 line 就够', 'tb', 'middle');
  o += text(sx(0), sy(5) - 7, 'x² = 5', 't', 'middle') + text(sx(0), sy(7.1), 'margin 4', 'tl', 'middle');
  o += text(sx(4), 262, '横轴 x，纵轴 x²', 'ts', 'end');
  return svg(560, 272, o, '四个一维的点正类在两边、负类在中间，一个 threshold 分不开；加上 x 的平方作为第二个 coordinate 之后，四个点落在 parabola 上，一条水平的 line 就把它们分开');
}

// 一个 2-2-1 network 的 computational graph：forward 的值与 backward 的 gradient
function backprop() {
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const x = [1, 2], y = 1, W = [[0.3, 0.2], [-0.4, 0.1]], b1 = [0.1, 0.2], w2 = [0.5, -0.6], b2 = 0.1;
  const z = [0, 1].map((i) => W[i][0] * x[0] + W[i][1] * x[1] + b1[i]), a = z.map(sig);
  const z3 = w2[0] * a[0] + w2[1] * a[1] + b2, yh = sig(z3), L = -Math.log(yh);
  const dyh = -1 / yh, dz3 = yh - y, da = w2.map((w) => w * dz3), dz = da.map((v, i) => v * a[i] * (1 - a[i]));
  const f = (v, k = 4) => v.toFixed(k).replace('-', '−');
  let o = '';
  const box = (cx, cy, w, top, val, grad) => {
    o += rect(cx - w / 2, cy - 27, w, 54, 'paper', 6);
    o += text(cx, cy - 11, top, 'ts', 'middle') + text(cx, cy + 5, val, 'tb', 'middle');
    if (grad !== null) o += text(cx, cy + 21, grad, 'tl', 'middle');
  };
  const r1 = 62, r2 = 182, mid = 122;
  const B = { x: [25, 38], z: [139, 70], a: [231, 78], z3: [353, 70], yh: [442, 76], L: [524, 56] };
  const R = (k) => B[k][0] + B[k][1] / 2, Lf = (k) => B[k][0] - B[k][1] / 2;
  const link = (x1, y1, x2, y2, lab, t) => {
    o += arrow(x1, y1, x2, y2, 'mute', 6);
    if (lab) { const mx = x1 + (x2 - x1) * t, my = y1 + (y2 - y1) * t; o += rect(mx - 15, my - 8, 30, 16, 'paper-f') + text(mx, my + 4, lab, 'ts', 'middle'); }
  };
  link(R('x'), r1 - 6, Lf('z') - 2, r1 - 8, '0.3', 0.5);
  link(R('x'), r1 + 6, Lf('z') - 2, r2 - 10, '−0.4', 0.72);
  link(R('x'), r2 - 6, Lf('z') - 2, r1 + 10, '0.2', 0.72);
  link(R('x'), r2 + 6, Lf('z') - 2, r2 + 8, '0.1', 0.5);
  link(R('z'), r1, Lf('a') - 2, r1); link(R('z'), r2, Lf('a') - 2, r2);
  link(R('a'), r1, Lf('z3') - 2, mid - 10, '0.5', 0.5);
  link(R('a'), r2, Lf('z3') - 2, mid + 10, '−0.6', 0.5);
  link(R('z3'), mid, Lf('yh') - 2, mid); link(R('yh'), mid, Lf('L') - 2, mid);
  box(B.x[0], r1, B.x[1], 'x₁', '1', null); box(B.x[0], r2, B.x[1], 'x₂', '2', null);
  box(B.z[0], r1, B.z[1], 'z₁', f(z[0], 1), f(dz[0])); box(B.z[0], r2, B.z[1], 'z₂', f(z[1], 1), f(dz[1]));
  box(B.a[0], r1, B.a[1], 'a₁ = σ(z₁)', f(a[0]), f(da[0])); box(B.a[0], r2, B.a[1], 'a₂ = σ(z₂)', f(a[1], 1), f(da[1]));
  box(B.z3[0], mid, B.z3[1], 'z₃', f(z3), f(dz3)); box(B.yh[0], mid, B.yh[1], 'ŷ = σ(z₃)', f(yh), f(dyh));
  box(B.L[0], mid, B.L[1], 'L', f(L), '1');
  o += text(280, 238, '每个 box 里：黑色粗体是 forward pass 算出的值，彩色是 backward pass 算出的 ∂L/∂(这个量)', 'ts', 'middle');
  o += text(280, 256, 'Forward 从左往右算，backward 从右往左算；线上的灰色小字是 weight，bias 没有画出', 'ts', 'middle');
  return svg(560, 268, o, '一个两个 input、两个 hidden unit、一个 output 的 network 的 computational graph，每个 node 标着 forward pass 的值和 backward pass 传回来的 gradient');
}

export default {
  'cs2109s-graph': graph,
  'cs2109s-tree': tree,
  'cs2109s-grid': grid,
  'cs2109s-queens': queens,
  'cs2109s-alphabeta': alphabeta,
  'cs2109s-entropy': entropy,
  'cs2109s-gd': gd,
  'cs2109s-lsclass': lsclass,
  'cs2109s-polyfit': polyfit,
  'cs2109s-svm': svm,
  'cs2109s-lift': lift,
  'cs2109s-backprop': backprop,
};
