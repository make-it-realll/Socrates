import { svg, svgA, anim, apath, acircle, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow } from '../lib/svg.mjs';

const SQ = Math.SQRT2, TAU = 2 * Math.PI;
const kts = (v) => (Math.round(v * 1e5) / 1e5).toString();
// 一段时间里显示：first = 第一帧（静态截图）是否显示；之后在 [t0, t1) 显示
const showSpan = (first, t0, t1) => {
  const kt = [0, 0.0005], on = [first ? 1 : 0, 0];
  if (t0 > 0.0005) { kt.push(t0); on.push(1); } else on[1] = 1;
  if (t1 < 1) { kt.push(t1); on.push(0); }
  return `<animate attributeName="opacity" values="${on.join(';')}" keyTimes="${kt.map(kts).join(';')}" dur="DUR" repeatCount="indefinite" calcMode="discrete"/>`;
};
const span = (first, t0, t1, T) => showSpan(first, t0, t1).replace('DUR', T + 's');
const g = (inner, a) => `<g>${inner}${a}</g>`;

// ================= Grid search（第 1 站、第 7 站共用） =================
export const GW = 25, GH = 15, GS = [3, 7], GG = [21, 7];
export function mapM() {
  const occ = Array.from({ length: GH }, () => Array(GW).fill(0));
  for (let r = 3; r <= 11; r++) occ[r][15] = 1;
  for (let c = 9; c <= 15; c++) { occ[3][c] = 1; occ[11][c] = 1; }
  return occ;
}
export const octile = (a, b) => { const dx = Math.abs(a[0] - b[0]), dy = Math.abs(a[1] - b[1]); return (SQ - 1) * Math.min(dx, dy) + Math.max(dx, dy); };
export function gsearch(occ, s, gl, h, eps = 1) {
  const Hh = occ.length, Ww = occ[0].length, key = (c, r) => r * Ww + c;
  const gv = new Map(), par = new Map(), closed = new Set(), order = [];
  const heap = []; let cnt = 0;
  const push = (f, hh, n) => { heap.push([f, hh, cnt++, n]); heap.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]); };
  gv.set(key(...s), 0); push(eps * h(s, gl), h(s, gl), s);
  const free = (c, r) => c >= 0 && r >= 0 && c < Ww && r < Hh && !occ[r][c];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  while (heap.length) {
    const n = heap.shift()[3], k = key(...n);
    if (closed.has(k)) continue; closed.add(k); order.push(n);
    if (n[0] === gl[0] && n[1] === gl[1]) break;
    for (const [dx, dy] of dirs) {
      const c = n[0] + dx, r = n[1] + dy;
      if (!free(c, r)) continue;
      if (dx && dy && (!free(n[0] + dx, n[1]) || !free(n[0], n[1] + dy))) continue;
      const nk = key(c, r); if (closed.has(nk)) continue;
      const ng = gv.get(k) + (dx && dy ? SQ : 1);
      if (!gv.has(nk) || ng < gv.get(nk) - 1e-12) { gv.set(nk, ng); par.set(nk, n); push(ng + eps * h([c, r], gl), h([c, r], gl), [c, r]); }
    }
  }
  const pth = []; let cur = gl;
  if (gv.has(key(...gl))) while (cur) { pth.unshift(cur); cur = par.get(key(...cur)); }
  return { order, path: pth, cost: gv.get(key(...gl)), gv };
}
const cellsPath = (cells, X, Y, s) => cells.map(([c, r]) => `M${f1(X + c * s + 0.5)} ${f1(Y + r * s + 0.5)}h${s - 1}v${s - 1}h${1 - s}Z`).join('');
const gridBg = (occ, X, Y, s, obsCls = 'solid2') => {
  let o = rect(X, Y, occ[0].length * s, occ.length * s, 'frame');
  const obs = []; occ.forEach((row, r) => row.forEach((v, c) => { if (v) obs.push([c, r]); }));
  return o + path(cellsPath(obs, X, Y, s), obsCls);
};
const cpt = ([c, r], X, Y, s) => [X + (c + 0.5) * s, Y + (r + 0.5) * s];

// 第 1 站：Dijkstra 和 A* 同速 expand
function astarA() {
  const occ = mapM(), s = 10, dt = 0.03, hold = 2.6;
  const A = gsearch(occ, GS, GG, () => 0), B = gsearch(occ, GS, GG, octile);
  const T = +(A.order.length * dt + hold).toFixed(2);
  let o = '';
  const panel = (X, Y, res, title) => {
    o += text(X + GW * s / 2, Y - 10, title, 'tb', 'middle');
    o += gridBg(occ, X, Y, s);
    const bin = 8;
    for (let i = 0; i < res.order.length; i += bin) {
      const t0 = (i * dt) / T;
      o += g(path(cellsPath(res.order.slice(i, i + bin), X, Y, s), 'wash-strong'), span(true, t0, 1, T));
    }
    const tDone = (res.order.length * dt) / T;
    o += g(path(d(res.path.map((p) => cpt(p, X, Y, s))), 'ln'), span(true, tDone, 1, T));
    const S0 = cpt(GS, X, Y, s), G0 = cpt(GG, X, Y, s);
    o += circle(S0[0], S0[1], 4, 'ink-f') + circle(G0[0], G0[1], 4, 'paper');
    o += rect(S0[0] - 16, S0[1] - 21, 32, 14, 'paper-f', 3) + text(S0[0], S0[1] - 10, 'start', 'ts', 'middle');
    o += rect(G0[0] - 14, G0[1] - 21, 28, 14, 'paper-f', 3) + text(G0[0], G0[1] - 10, 'goal', 'ts', 'middle');
    o += text(X + GW * s / 2, Y + GH * s + 18, `expand 了 ${res.order.length} 个 cell，path cost ${res.cost.toFixed(2)}`, 'ts', 'middle');
  };
  panel(14, 30, A, 'Dijkstra（h = 0）');
  panel(296, 30, B, 'A*（octile heuristic）');
  o += text(280, 222, '两边每 0.03 s 都 expand 一个 cell；深色是已经 expand 的 cell，粗线是最后得到的 path。', 'ts', 'middle');
  return svgA(560, 230, o, '动图：同一张有 U 形 obstacle 的 grid 上，Dijkstra 向四周一圈圈 expand 了 321 个 cell，A* 朝 goal 方向 expand 了 117 个 cell，两者找到的 path cost 都是 22.14');
}

// ================= 第 2 站：RRT 与 RRT* =================
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export const ROBS = [[3, 2, 7, 8]], RSTART = [1, 5], RGOAL = [9, 5];
function segRect(a, b, r) {
  let t0 = 0, t1 = 1; const dd = [b[0] - a[0], b[1] - a[1]];
  for (let k = 0; k < 2; k++) {
    const lo = r[k], hi = r[k + 2];
    if (Math.abs(dd[k]) < 1e-12) { if (a[k] < lo || a[k] > hi) return false; }
    else { let u = (lo - a[k]) / dd[k], v = (hi - a[k]) / dd[k]; if (u > v) [u, v] = [v, u]; t0 = Math.max(t0, u); t1 = Math.min(t1, v); if (t0 > t1) return false; }
  }
  return true;
}
const rfree = (a, b) => ROBS.every((r) => !segRect(a, b, r));
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export function rrt(star, N, seed, snapAt = [], eta = 0.8, gamma = 12, goalR = 0.5) {
  const R = rng(seed); const V = [{ p: RSTART, par: -1, c: 0, born: 0 }]; const costAt = []; const snaps = {}; const goalNodes = [];
  for (let n = 1; n <= N; n++) {
    let s; do { s = [R() * 10, R() * 10]; } while (ROBS.some((r) => s[0] > r[0] && s[0] < r[2] && s[1] > r[1] && s[1] < r[3]));
    let ni = 0, nd = Infinity; V.forEach((v, i) => { const q = dist(v.p, s); if (q < nd) { nd = q; ni = i; } });
    const near = V[ni].p, k = Math.min(1, eta / nd), x = [near[0] + k * (s[0] - near[0]), near[1] + k * (s[1] - near[1])];
    if (rfree(near, x)) {
      let par = ni, c = V[ni].c + dist(near, x); const nb = [];
      if (star) {
        const m = V.length + 1, r = Math.min(gamma * Math.sqrt(Math.log(m) / m), eta);
        V.forEach((v, i) => { if (dist(v.p, x) <= r) nb.push(i); });
        for (const i of nb) { const cc = V[i].c + dist(V[i].p, x); if (cc < c - 1e-12 && rfree(V[i].p, x)) { c = cc; par = i; } }
      }
      const xi = V.length; V.push({ p: x, par, c, born: n });
      if (star) for (const i of nb) {
        if (i === par) continue;
        const cc = c + dist(x, V[i].p);
        if (cc < V[i].c - 1e-12 && rfree(x, V[i].p)) {
          const delta = V[i].c - cc; V[i].par = xi; V[i].c = cc;
          const st = V.map((v, q) => (v.par === i ? q : -1)).filter((q) => q >= 0);
          while (st.length) { const q = st.pop(); V[q].c -= delta; V.forEach((v, j) => { if (v.par === q) st.push(j); }); }
        }
      }
      if (dist(x, RGOAL) < goalR) goalNodes.push(xi);
    }
    let best = Infinity, bi = -1; for (const gi of goalNodes) { const cc = V[gi].c + dist(V[gi].p, RGOAL); if (cc < best) { best = cc; bi = gi; } }
    costAt[n] = best;
    if (snapAt.includes(n)) snaps[n] = { V: V.map((v) => ({ ...v })), best, bi };
  }
  return { V, costAt, snaps };
}
function rrtStarA() {
  const marks = [50, 150, 300, 600, 1000], N = 1000;
  const A = rrt(false, N, 1, marks), B = rrt(true, N, 1, marks);
  const s = 25, T = 10, hold = 0.22; // 每个 mark 一段，最后一段停留
  const tAt = (n) => (n / N) * (1 - hold);
  let o = '';
  const frame = (X, Y, title) => {
    o += text(X + 125, Y - 10, title, 'tb', 'middle') + rect(X, Y, 250, 250, 'frame');
    for (const r of ROBS) o += rect(X + r[0] * s, Y + (10 - r[3]) * s, (r[2] - r[0]) * s, (r[3] - r[1]) * s, 'solid2');
  };
  const P = (X, Y) => (p) => [X + p[0] * s, Y + (10 - p[1]) * s];
  const treeD = (V, Pp) => V.slice(1).map((v) => { const a = Pp(V[v.par].p), b = Pp(v.p); return `M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}`; }).join('');
  const bestD = (V, bi, Pp) => { if (bi < 0) return ''; const pts = [Pp(RGOAL)]; let q = bi; while (q >= 0) { pts.push(Pp(V[q].p)); q = V[q].par; } return d(pts); };
  // 左：RRT，edge 一旦加上就不变
  const XA = 14, XB = 296, Y = 34, PA = P(XA, Y), PB = P(XB, Y);
  frame(XA, Y, 'RRT'); frame(XB, Y, 'RRT*（rewire）');
  const bins = [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  for (let b = 1; b < bins.length; b++) {
    const vs = A.V.filter((v) => v.born > bins[b - 1] && v.born <= bins[b]);
    o += g(path(vs.map((v) => { const a = PA(A.V[v.par].p), c = PA(v.p); return `M${f1(a[0])} ${f1(a[1])}L${f1(c[0])} ${f1(c[1])}`; }).join(''), 'mute'), span(true, tAt(bins[b]), 1, T));
  }
  // 右：RRT*，每个 mark 一整棵 tree
  marks.forEach((n, i) => {
    const t0 = tAt(n), t1 = i + 1 < marks.length ? tAt(marks[i + 1]) : 1;
    const sn = B.snaps[n];
    o += g(path(treeD(sn.V, PB), 'mute'), span(n === N, t0, t1, T));
    o += g(path(bestD(sn.V, sn.bi, PB), 'ln'), span(n === N, t0, t1, T));
    const sa = A.snaps[n];
    o += g(path(bestD(sa.V, sa.bi, PA), 'ln'), span(n === N, t0, t1, T));
    const lab = (X, c) => text(X + 125, Y + 272, c < Infinity ? `n = ${n}：path cost ${c.toFixed(2)}` : `n = ${n}：还没到 goal`, 'ts', 'middle');
    o += g(lab(XA, sa.best), span(n === N, t0, t1, T)) + g(lab(XB, sn.best), span(n === N, t0, t1, T));
  });
  for (const [X, Pp] of [[XA, PA], [XB, PB]]) {
    const a = Pp(RSTART), b = Pp(RGOAL);
    o += circle(a[0], a[1], 4.5, 'ink-f') + circle(b[0], b[1], 4.5, 'paper');
    o += rect(a[0] - 16, a[1] + 7, 32, 14, 'paper-f', 3) + text(a[0], a[1] + 18, 'start', 'ts', 'middle');
    o += rect(b[0] - 14, b[1] + 7, 28, 14, 'paper-f', 3) + text(b[0], b[1] + 18, 'goal', 'ts', 'middle');
  }
  o += text(280, 330, '两边用同一串 random sample。最短 path 擦过 obstacle 的角，cost 11.21。', 'ts', 'middle');
  return svgA(560, 338, o, '动图：同一串 random sample 下 RRT 和 RRT* 的 tree 逐步长大；RRT 找到 path 后 cost 一直是 13.48，RRT* 的 cost 随 sample 增多从 13.03 降到 11.67');
}

// 第 2 站：choose parent 与 rewire 的手算例子
function rewire() {
  const u = 46;
  const nodes = { S: [0, 0], A: [2, 0], B: [2, 2], C: [4, 2] }, x = [2.6, 1.6];
  let o = '';
  const panel = (X, Y, title, edges, hi, note) => {
    const P = (p) => [X + 46 + p[0] * u, Y + 196 - p[1] * u];
    o += text(X + 140, Y, title, 'tb', 'middle');
    const xc = P(x);
    o += circle(xc[0], xc[1], 2 * u, 'wash');
    for (const [a, b, cls] of edges) { const pa = a === 'x' ? xc : P(nodes[a]), pb = b === 'x' ? xc : P(nodes[b]); o += line(pa[0], pa[1], pb[0], pb[1], cls); }
    for (const [k, p] of Object.entries(nodes)) {
      const q = P(p); o += circle(q[0], q[1], 5, 'paper');
      const cost = { S: '0', A: '2', B: '4', C: hi === 'rw' ? '5.17' : '6' }[k];
      const [dx, dy, anc] = { S: [0, 20, 'middle'], A: [0, 20, 'middle'], B: [-8, -8, 'end'], C: [0, -12, 'middle'] }[k];
      o += text(q[0] + dx, q[1] + dy, `${k}（c = ${cost}）`, k === 'C' && hi === 'rw' ? 'tl' : 'ts', anc);
    }
    o += circle(xc[0], xc[1], 5, 'ln-f') + text(xc[0] + 9, xc[1] + 17, 'x（c = 3.71）', 'tl', 'start');
    o += text(X + 140, Y + 240, note, 'ts', 'middle');
  };
  panel(0, 14, '① choose parent', [['S', 'A', 'ink'], ['A', 'B', 'ink'], ['B', 'C', 'ink'], ['B', 'x', 'dash'], ['C', 'x', 'dash'], ['A', 'x', 'ln']], 'cp', '经 B：4 + 0.72 = 4.72；经 A：2 + 1.71 = 3.71');
  panel(280, 14, '② rewire', [['S', 'A', 'ink'], ['A', 'B', 'ink'], ['A', 'x', 'ln'], ['x', 'C', 'ln'], ['x', 'B', 'dash']], 'rw', 'C 改走 x：3.71 + 1.46 = 5.17 < 6；B：4.43 > 4');
  o += text(280, 280, '浅色圆是 radius r = 2 的 neighborhood；c 是从 start 沿 tree 到这个 node 的 cost。', 'ts', 'middle');
  return svg(560, 288, o, 'RRT* 加入新 node x 的两步：choose parent 在 radius 2 内选让 x 的 cost 最小的 A 而不是最近的 B；rewire 让 C 改以 x 为 parent，cost 从 6 降到 5.17');
}

// ================= 第 3 站：Dubins =================
const md = (a) => ((a % TAU) + TAU) % TAU;
export function dubins(q0, q1, rho) {
  const dx = q1[0] - q0[0], dy = q1[1] - q0[1], D = Math.hypot(dx, dy), dd = D / rho, th = md(Math.atan2(dy, dx));
  const a = md(q0[2] - th), b = md(q1[2] - th), sa = Math.sin(a), sb = Math.sin(b), ca = Math.cos(a), cb = Math.cos(b), cab = Math.cos(a - b);
  const out = {};
  { const p2 = 2 + dd * dd - 2 * cab + 2 * dd * (sa - sb); if (p2 >= 0) { const t = Math.atan2(cb - ca, dd + sa - sb); out.LSL = [md(-a + t), Math.sqrt(p2), md(b - t)]; } }
  { const p2 = 2 + dd * dd - 2 * cab + 2 * dd * (sb - sa); if (p2 >= 0) { const t = Math.atan2(ca - cb, dd - sa + sb); out.RSR = [md(a - t), Math.sqrt(p2), md(-b + t)]; } }
  { const p2 = -2 + dd * dd + 2 * cab + 2 * dd * (sa + sb); if (p2 >= 0) { const p = Math.sqrt(p2), t = Math.atan2(-ca - cb, dd + sa + sb) - Math.atan2(-2, p); out.LSR = [md(-a + t), p, md(-md(b) + t)]; } }
  { const p2 = dd * dd - 2 + 2 * cab - 2 * dd * (sa + sb); if (p2 >= 0) { const p = Math.sqrt(p2), t = Math.atan2(ca + cb, dd - sa - sb) - Math.atan2(2, p); out.RSL = [md(a - t), p, md(b - t)]; } }
  { const t = (6 - dd * dd + 2 * cab + 2 * dd * (sa - sb)) / 8; if (Math.abs(t) <= 1) { const p = md(TAU - Math.acos(t)), t1 = md(a - Math.atan2(ca - cb, dd - sa + sb) + p / 2); out.RLR = [t1, p, md(a - b - t1 + p)]; } }
  { const t = (6 - dd * dd + 2 * cab + 2 * dd * (-sa + sb)) / 8; if (Math.abs(t) <= 1) { const p = md(TAU - Math.acos(t)), t1 = md(-a - Math.atan2(ca - cb, dd + sa - sb) + p / 2); out.LRL = [t1, p, md(md(b) - a - t1 + p)]; } }
  return out;
}
export function dtrace(q0, word, prm, rho, step = 0.05) {
  let [x, y, t] = q0; const pts = [[x, y, t]];
  for (let k = 0; k < 3; k++) {
    const ty = word[k], L = prm[k] * rho, n = Math.max(1, Math.ceil(L / step));
    for (let i = 0; i < n; i++) {
      const ds = L / n;
      if (ty === 'S') { x += ds * Math.cos(t); y += ds * Math.sin(t); }
      else { const sg = ty === 'L' ? 1 : -1, dth = (sg * ds) / rho; x += rho * sg * (Math.sin(t + dth) - Math.sin(t)); y += rho * sg * (-Math.cos(t + dth) + Math.cos(t)); t += dth; }
      pts.push([x, y, t]);
    }
  }
  return pts;
}
const carPoly = (x, y, t, P, L = 0.5, Wd = 0.3) => {
  const c = Math.cos(t), s = Math.sin(t);
  const pts = [[L * 0.65, Wd / 2], [L * 0.65, -Wd / 2], [-L * 0.35, -Wd / 2], [-L * 0.35, Wd / 2]].map(([a, b]) => P([x + a * c - b * s, y + a * s + b * c]));
  return d(pts) + 'Z';
};
function dubinsA() {
  const R = Math.PI / 180, q0 = [0, 0, 90 * R], q1 = [5, 0, -90 * R];
  const W = dubins(q0, q1, 1), u = 44, P = ([x, y]) => [150 + x * u, 74 - y * u];
  let o = '';
  const lens = Object.entries(W).map(([w, p]) => [w, p, p[0] + p[1] + p[2]]).sort((a, b) => a[2] - b[2]);
  const labelPos = { LSL: [-1.0, -1.45, 'middle'], LSR: [-1.6, 1.15, 'end'], RSL: [7.15, -0.55, 'start'], RLR: [2.5, -2.62, 'middle'] };
  for (const [w, p, L] of lens.slice(1)) {
    o += path(d(dtrace(q0, w, p, 1).map(P)), 'dash');
    const [lx, ly, an] = labelPos[w]; const q = P([lx, ly]);
    o += text(q[0], q[1] + 4, `${w}：${L.toFixed(2)}`, 'ts', an);
  }
  const [bw, bp, bl] = lens[0];
  const tr = dtrace(q0, bw, bp, 1, 0.04);
  o += path(d(tr.map(P)), 'ln');
  const top = P([2.5, 1]); o += text(top[0], top[1] - 9, `${bw}：π/2 + 3 + π/2 = ${bl.toFixed(2)}`, 'tl', 'middle');
  // 起点、终点
  for (const [q, lab, dx] of [[q0, 'start (0, 0, 90°)', -10], [q1, 'goal (5, 0, −90°)', 10]]) {
    const a = P(q); o += circle(a[0], a[1], 3.5, 'ink-f') + text(a[0] + dx, a[1] + 18, lab, 'ts', dx < 0 ? 'end' : 'start');
  }
  // 车沿 RSR 走：按真实 arc length 匀速
  const n = 60, T = 6, idx = Array.from({ length: n + 1 }, (_, i) => Math.round((i / n) * (tr.length - 1)));
  const kt = [], ds = [];
  idx.forEach((k, i) => { kt.push((i / n) * 0.8); ds.push(carPoly(...tr[k], P)); });
  kt.push(1); ds.push(ds[ds.length - 1]);
  // 第一帧：车停在 path 中段
  const mid = carPoly(...tr[Math.round(tr.length * 0.45)], P);
  o += `<path d="${mid}" class="solid">${anim('d', [mid, ...ds.slice(1)], [0, ...kt.slice(1)], T, true)}</path>`;
  o += text(556, 16, 'ρ = 1 m，car 只能前进', 'ts', 'end');
  return svgA(560, 196, o, '动图：从 (0, 0) 朝上到 (5, 0) 朝下，五个可行的 Dubins word 用虚线画出并标了长度，最短的是 RSR，长 6.14 m，一辆 car 沿它行驶');
}

// 第 3 站：motion primitive 展开两层
function lattice() {
  const u = 80, P = ([x, y]) => [60 + x * u, 130 - y * u];
  const R = Math.PI / 180, prims = [['L', 45 * R], ['S', 0], ['R', -45 * R]];
  const step = (q, [ty, dth]) => {
    if (ty === 'S') return { pts: [q, [q[0] + 0.785 * Math.cos(q[2]), q[1] + 0.785 * Math.sin(q[2]), q[2]]] };
    const pts = []; for (let i = 0; i <= 12; i++) { const a = (dth * i) / 12, sg = Math.sign(dth); pts.push([q[0] + sg * (Math.sin(q[2] + a) - Math.sin(q[2])), q[1] + sg * (-Math.cos(q[2] + a) + Math.cos(q[2])), q[2] + a]); }
    return { pts };
  };
  let o = '';
  // hybrid A* 的 cell：0.5 m
  for (let x = 0; x <= 2.5 + 1e-9; x += 0.5) { const a = P([x, -1.25]), b = P([x, 1.25]); o += line(a[0], a[1], b[0], b[1], 'grid'); }
  for (let y = -1.25; y <= 1.25 + 1e-9; y += 0.5) { const a = P([0, y]), b = P([2.5, y]); o += line(a[0], a[1], b[0], b[1], 'grid'); }
  const q0 = [0, 0, 0];
  const ends1 = [];
  for (const p of prims) { const { pts } = step(q0, p); o += path(d(pts.map(P)), 'ink-b'); ends1.push(pts[pts.length - 1]); }
  for (const e of ends1) for (const p of prims) { const { pts } = step(e, p); o += path(d(pts.map(P)), 'mute'); const z = P(pts[pts.length - 1]); o += circle(z[0], z[1], 2.5, 'mute-f'); }
  for (const e of ends1) { const z = P(e); o += circle(z[0], z[1], 3.5, 'ink-f'); }
  const z0 = P(q0); o += circle(z0[0], z0[1], 4.5, 'ln-f') + text(z0[0] - 8, z0[1] + 4, 'start', 'ts', 'end');
  const a1 = P(ends1[0]); o += text(a1[0] - 6, a1[1] - 8, 'L', 'tb', 'end');
  const a2 = P(ends1[1]); o += text(a2[0] + 2, a2[1] - 8, 'S', 'tb', 'middle');
  const a3 = P(ends1[2]); o += text(a3[0] - 6, a3[1] + 18, 'R', 'tb', 'end');
  const X = 300;
  o += text(X, 30, '每个 state 三个 successor：', 'tb', 'start');
  o += text(X, 52, 'L：沿 ρ = 1 m 左转 45°（长 0.785 m）', 'ts', 'start');
  o += text(X, 70, 'S：直走 0.785 m', 'ts', 'start');
  o += text(X, 88, 'R：右转 45°', 'ts', 'start');
  o += text(X, 118, '黑点：第一层，9 个灰点：第二层。', 'ts', 'start');
  o += text(X, 136, '格子是 0.5 m 的 cell；endpoint 落在', 'ts', 'start');
  o += text(X, 154, 'cell 里的任意位置，不在 cell 中心。', 'ts', 'start');
  o += text(X, 184, '每条 edge 自己就满足 ρ ≥ 1 m，', 'ts', 'start');
  o += text(X, 202, '所以 graph 上的任何 path 都开得出来。', 'ts', 'start');
  return svg(560, 240, o, '从一个 pose 出发用左转、直行、右转三个 motion primitive 展开两层，共 3 个和 9 个 endpoint，背景是 0.5 米的 grid');
}

// ================= 第 4 站：trajectory optimization =================
function solveTri(n, rhs) {
  const c = Array(n).fill(0), dd = Array(n).fill(0);
  c[0] = -1 / 2; dd[0] = rhs[0] / 2;
  for (let i = 1; i < n; i++) { const m = 2 + c[i - 1]; c[i] = -1 / m; dd[i] = (rhs[i] + dd[i - 1]) / m; }
  const x = Array(n); x[n - 1] = dd[n - 1]; for (let i = n - 2; i >= 0; i--) x[i] = dd[i] - c[i] * x[i + 1]; return x;
}
export function chomp({ n = 24, P0 = [0, 0], P1 = [10, 0], C = [5, 0.4], R = 1.5, eps = 0.6, w = 4, lam = 300, iters = 40, cov = true }) {
  let q = Array.from({ length: n }, (_, i) => [P0[0] + (P1[0] - P0[0]) * (i + 1) / (n + 1), P0[1] + (P1[1] - P0[1]) * (i + 1) / (n + 1)]);
  const cst = (x) => { const e = Math.hypot(x[0] - C[0], x[1] - C[1]) - R; if (e < 0) return -e + eps / 2; if (e <= eps) return (e - eps) ** 2 / (2 * eps); return 0; };
  const grd = (x) => { const v = [x[0] - C[0], x[1] - C[1]], r = Math.hypot(...v), e = r - R; const s = e < 0 ? -1 : e <= eps ? (e - eps) / eps : 0; return [(s * v[0]) / r, (s * v[1]) / r]; };
  const total = (q) => { let sm = 0; const all = [P0, ...q, P1]; for (let i = 0; i + 1 < all.length; i++) sm += 0.5 * ((all[i + 1][0] - all[i][0]) ** 2 + (all[i + 1][1] - all[i][1]) ** 2); let ob = 0; q.forEach((x) => (ob += w * cst(x))); return { sm, ob, tot: sm + ob }; };
  const hist = [q.map((p) => [...p])], stats = [total(q)];
  for (let k = 0; k < iters; k++) {
    const all = [P0, ...q, P1];
    const gr = q.map((x, i) => { const go = grd(x); return [2 * x[0] - all[i][0] - all[i + 2][0] + w * go[0], 2 * x[1] - all[i][1] - all[i + 2][1] + w * go[1]]; });
    let dx;
    if (cov) { const gx = solveTri(n, gr.map((v) => v[0])), gy = solveTri(n, gr.map((v) => v[1])); dx = gx.map((v, i) => [v / lam, gy[i] / lam]); }
    else dx = gr.map((v) => [v[0] / 4, v[1] / 4]);
    q = q.map((x, i) => [x[0] - dx[i][0], x[1] - dx[i][1]]);
    hist.push(q.map((p) => [...p])); stats.push(total(q));
  }
  return { hist, stats };
}
function chompA() {
  const iters = 40, A = chomp({ cov: true, iters }), B = chomp({ cov: false, iters });
  const u = 44, C = [5, 0.4], R = 1.5, PH = 196;
  let o = '';
  const frames = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 40], T = 8, tAt = (i) => (i / frames.length) * 0.92;
  const panel = (Y, res, title) => {
    const P = ([x, y]) => [50 + x * u, Y + 112 - y * u];
    const c = P(C); o += circle(c[0], c[1], R * u, 'wash2') + circle(c[0], c[1], (R + 0.6) * u, 'grid');
    o += text(c[0], c[1] + 4, 'obstacle', 'ts', 'middle');
    o += text(18, Y + 8, title, 'tb', 'start');
    o += path(d([P([0, 0]), P([10, 0])]), 'grid');
    const ds = frames.map((k) => d([[0, 0], ...res.hist[k], [10, 0]].map(P)));
    const kt = frames.map((_, i) => tAt(i)); kt.push(1);
    o += apath([ds[ds.length - 1], ...ds.slice(1), ds[ds.length - 1]], kt, T, 'ln', true);
    const dots = frames.map((k) => res.hist[k].map(P).map(([x, y]) => `M${f1(x - 2)} ${f1(y)}a2 2 0 1 0 4 0a2 2 0 1 0 -4 0`).join(''));
    o += apath([dots[dots.length - 1], ...dots.slice(1), dots[dots.length - 1]], kt, T, 'ink-f', true);
    frames.forEach((k, i) => {
      const t0 = i === 0 ? 0.0005 : tAt(i), t1 = i + 1 < frames.length ? tAt(i + 1) : 1;
      o += g(text(548, Y + 8, `iteration ${k}：cost ${res.stats[k].tot.toFixed(2)}`, 'ts', 'end'), span(k === iters, t0, t1, T));
    });
    const a = P([0, 0]), b = P([10, 0]); o += circle(a[0], a[1], 4, 'ink-f') + circle(b[0], b[1], 4, 'ink-f');
  };
  panel(0, A, 'CHOMP 的 update（A⁻¹ 预处理）');
  panel(PH, B, '普通 gradient descent');
  o += text(280, 2 * PH + 8, '24 个 waypoint，两端固定；初始是穿过 obstacle 的直线（细线）。外圈细圆是 clearance ε = 0.6 m 的边界。', 'ts', 'middle');
  return svgA(560, 2 * PH + 16, o, '动图：同一条穿过圆形 obstacle 的直线 trajectory，用 A 的 inverse 预处理的 gradient 每步整条 path 一起平滑地弯开，8 步后 cost 2.27；普通 gradient descent 只推开撞上的点，path 出现折角，40 步后 cost 仍是 2.39');
}

// ================= 第 5 站：localization =================
export const NC = 10, DOORS = [0, 3, 7];
const pz = (c) => (DOORS.includes(c) ? 0.8 : 0.1);
const senseB = (b) => { const u = b.map((p, c) => p * pz(c)); const s = u.reduce((a, v) => a + v, 0); return u.map((v) => v / s); };
const moveB = (b, k) => b.map((_, c) => 0.8 * b[(c - k + NC) % NC] + 0.1 * b[(c - k + 1 + NC) % NC] + 0.1 * b[(c - k - 1 + NC) % NC]);
export function histSeq() {
  const st = [{ b: Array(NC).fill(0.1), pos: 3, lab: 'prior：完全不知道在哪', z: false }];
  let b = st[0].b;
  b = senseB(b); st.push({ b, pos: 3, lab: 'sense：看到 door', z: true });
  b = moveB(b, 4); st.push({ b, pos: 7, lab: 'move：往右走 4 格（会多走或少走一格）', z: false });
  b = senseB(b); st.push({ b, pos: 7, lab: 'sense：又看到 door', z: true });
  b = moveB(b, 3); st.push({ b, pos: 0, lab: 'move：往右走 3 格（走到头接回 cell 0）', z: false });
  b = senseB(b); st.push({ b, pos: 0, lab: 'sense：又看到 door', z: true });
  return st;
}
const corridor = (X, Y, cw) => {
  let o = rect(X, Y, NC * cw, 34, 'paper');
  for (let c = 1; c < NC; c++) o += line(X + c * cw, Y, X + c * cw, Y + 34, 'grid');
  for (const c of DOORS) o += rect(X + c * cw + 8, Y - 7, cw - 16, 8, 'solid');
  for (let c = 0; c < NC; c++) o += text(X + (c + 0.5) * cw, Y + 52, String(c), 'ts', 'middle');
  return o;
};
function histA() {
  const st = histSeq(), X = 30, cw = 50, Yb = 196, Hb = 130, Yc = 222;
  const T = 13, n = st.length, tA = (i) => (i / n) * 0.96;
  let o = text(X, 20, 'belief：robot 在每个 cell 的 probability', 'tb', 'start');
  o += line(X, Yb, X + NC * cw, Yb, 'axis');
  for (const v of [0.25, 0.5]) { const y = Yb - (v / 0.7) * Hb; o += line(X, y, X + NC * cw, y, 'grid') + text(X - 5, y + 4, String(v), 'ts', 'end'); }
  const bars = st.map((s) => s.b.map((p, c) => { const h = (p / 0.7) * Hb; return `M${f1(X + c * cw + 8)} ${f1(Yb)}v${f1(-h)}h${cw - 16}v${f1(h)}Z`; }).join(''));
  const kt = st.map((_, i) => tA(i)); kt.push(1);
  o += apath([bars[n - 1], ...bars.slice(1), bars[n - 1]], [0, ...kt.slice(1)], T, 'wash-strong', true);
  st.forEach((s, i) => {
    const t0 = i === 0 ? 0.0005 : tA(i), t1 = i + 1 < n ? tA(i + 1) : 1;
    o += g(text(X, 42, `第 ${i} 步　${s.lab}`, 'tl', 'start'), span(i === n - 1, t0, t1, T));
    const vals = s.b.map((p, c) => text(X + (c + 0.5) * cw, Yb - (p / 0.7) * Hb - 5, p.toFixed(2), 'ts', 'middle')).join('');
    o += g(vals, span(i === n - 1, t0, t1, T));
  });
  o += corridor(X, Yc, cw);
  // robot：真实位置，move 时平滑走过去（走到头时直接跳回 cell 0）
  const px = (c) => X + (c + 0.5) * cw;
  const xs = [px(st[n - 1].pos)], kk = [0];
  st.forEach((s, i) => { if (i === 0) { xs.push(px(s.pos)); kk.push(0.0005); } else { xs.push(px(st[i - 1].pos)); kk.push(tA(i)); xs.push(px(s.pos)); kk.push(tA(i) + 0.001); } });
  xs.push(xs[xs.length - 1]); kk.push(1);
  o += `<circle cx="${f1(xs[0])}" cy="${Yc + 17}" r="10" class="ink-f">${anim('cx', xs.map(f1), kk, T, true)}</circle>`;
  o += text(X + NC * cw + 6, Yc + 22, 'robot', 'ts', 'start');
  o += text(X, Yc + 74, '深色小块是 door。Robot 自己只知道 map、看到了什么、让 wheel 转了多少。', 'ts', 'start');
  return svgA(560, 302, o, '动图：一条首尾相连的 10 格 corridor，door 在 cell 0、3、7；robot 三次看到 door、两次移动之后，belief 从均匀分布变成在 cell 0 上 0.65');
}
function particles() {
  const X = 112, cw = 44;
  const Pp = []; for (let c = 0; c < NC; c++) Pp.push(c, c);
  const w = Pp.map(pz), s = w.reduce((a, v) => a + v, 0), wn = w.map((v) => v / s);
  const M = 20, r0 = 0.5 / M; let c = wn[0], i = 0; const cnt = Array(NC).fill(0);
  for (let m = 0; m < M; m++) { const U = r0 + m / M; while (U > c) { i++; c += wn[i]; } cnt[Pp[i]]++; }
  let o = corridor(X, 22, cw);
  const row = (Y, lab) => text(X - 10, Y + 4, lab, 'ts', 'end');
  const Y1 = 104, Y2 = 140, Y3 = 176;
  for (let k = 0; k < NC; k++) {
    const cx = X + (k + 0.5) * cw;
    o += circle(cx - 7, Y1, 4, 'ink-f') + circle(cx + 7, Y1, 4, 'ink-f');
    const rr = DOORS.includes(k) ? 7 : 2.5;
    o += circle(cx - 9, Y2, rr, 'ln-f') + circle(cx + 9, Y2, rr, 'ln-f');
    for (let j = 0; j < cnt[k]; j++) o += circle(cx - ((cnt[k] - 1) * 9) / 2 + j * 9, Y3, 4, 'ink-f');
  }
    o += row(Y1, '① 20 个 particle');
  o += row(Y2, '② weight');
  o += row(Y3, '③ resample 后');
  o += text(12, 206, '① 均匀撒，每格 2 个。② 看到 door：door 格里的 particle weight 0.8，其余 0.1（点的大小）。', 'ts', 'start');
  o += text(12, 224, '③ 按 weight 重新抽 20 个：cell 0、3、7 分到 5、6、5 个，其余 7 格里只剩 4 个。', 'ts', 'start');
  return svg(560, 232, o, '同一条 corridor 上 20 个 particle 的一次 sense 与 resample：door 格的 particle weight 大，resample 后 door 格里有 5、6、5 个 particle');
}

// ================= 第 6 站：mapping 与 SLAM =================
function occgrid() {
  const X = 70, cw = 52, nC = 8, Y0 = 44, rh = 26;
  const lo = Math.log(0.7 / 0.3), lf = Math.log(0.4 / 0.6);
  // 四次 scan：wall 在 cell 6；scan 1 时 cell 3 有人
  const scans = [3, 6, 6, 6];
  let o = text(X + (nC * cw) / 2, 16, '同一个方向上的 4 次 laser scan（robot 在左边，beam 向右）', 'tb', 'middle');
  const L = Array(nC).fill(0);
  scans.forEach((hit, s) => {
    const Y = Y0 + s * rh;
    o += text(X - 10, Y + 17, `scan ${s + 1}`, 'ts', 'end');
    for (let c = 0; c < nC; c++) {
      let v = 0, cls = 'frame';
      if (c < hit) { v = lf; cls = 'wash'; } else if (c === hit) { v = lo; cls = 'wash-strong'; }
      L[c] += v;
      o += rect(X + c * cw, Y, cw, rh, cls) + rect(X + c * cw, Y, cw, rh, 'frame');
      o += text(X + (c + 0.5) * cw, Y + 17, c > hit ? '0' : (v > 0 ? '+' : '−') + Math.abs(v).toFixed(2), 'ts', 'middle');
    }
  });
  const Ys = Y0 + 4 * rh + 12;
  o += text(X - 10, Ys + 17, 'log-odds', 'tb', 'end') + text(X - 10, Ys + rh + 17, 'p(occ)', 'tb', 'end');
  for (let c = 0; c < nC; c++) {
    const p = 1 - 1 / (1 + Math.exp(L[c]));
    o += rect(X + c * cw, Ys, cw, rh, 'frame') + text(X + (c + 0.5) * cw, Ys + 17, (L[c] < -1e-9 ? '−' : L[c] > 1e-9 ? '+' : '') + Math.abs(L[c]).toFixed(2), 'tb', 'middle');
    o += rect(X + c * cw, Ys + rh, cw, rh, c === 6 ? 'solid2' : 'frame') + text(X + (c + 0.5) * cw, Ys + rh + 17, p.toFixed(2), c === 6 ? 'tw' : 't', 'middle');
  }
  for (let c = 0; c < nC; c++) o += text(X + (c + 0.5) * cw, Ys + 2 * rh + 16, `cell ${c}`, 'ts', 'middle');
  o += text(X + 3 * cw + cw / 2, Y0 - 5, 'scan 1 时这里有人', 'ts', 'middle');
  o += text(X + (nC * cw) / 2, Ys + 2 * rh + 38, 'beam 停下的格子 +0.85，beam 穿过的格子 −0.41，beam 之后看不到的格子不改。', 'ts', 'middle');
  return svg(560, Ys + 2 * rh + 46, o, '一行 8 个 cell 的 occupancy grid 经过 4 次 scan：wall 所在的 cell 6 log-odds 累加到 2.54、probability 0.93；scan 1 时有人站过的 cell 3 最后是 0.41');
}
function posegraph() {
  const sx = lin(-0.2, 3.4, 40, 520);
  const before = [0, 1.1, 2.1, 3.2], after = [0, 1.0385, 1.9769, 3.0154];
  let o = '';
  const row = (Y, xs, title, cls) => {
    o += text(40, Y - 44, title, 'tb', 'start');
    o += line(sx(-0.2), Y, sx(3.4), Y, 'axis');
    for (const v of [0, 1, 2, 3]) o += line(sx(v), Y - 4, sx(v), Y + 4, 'axis');
    for (let i = 0; i < 3; i++) { const a = sx(xs[i]), b = sx(xs[i + 1]); o += path(`M${f1(a + 6)} ${Y - 6}Q${f1((a + b) / 2)} ${Y - 26} ${f1(b - 6)} ${Y - 6}`, 'ink'); }
    const a = sx(xs[0]), b = sx(xs[3]);
    o += path(`M${f1(a)} ${Y + 8}Q${f1((a + b) / 2)} ${Y + 54} ${f1(b)} ${Y + 8}`, cls);
    xs.forEach((v, i) => { o += circle(sx(v), Y, 6, i === 0 ? 'ink-f' : 'paper') + text(sx(v), Y - 30 + (i ? 0 : 0), `x${i}`, 'ts', 'middle'); });
    return Y;
  };
  row(76, before, '只用 odometry 拼起来：x = 0, 1.10, 2.10, 3.20', 'ln-dash');
  o += text(sx(0.55), 52, '1.1', 'ts', 'middle') + text(sx(1.6), 52, '1.0', 'ts', 'middle') + text(sx(2.65), 52, '1.1', 'ts', 'middle');
  o += text(sx(1.6), 128, 'loop closure 说 x3 − x0 = 3.0，和 3.2 差 0.2', 'tl', 'middle');
  row(214, after, 'least squares 之后：x = 0, 1.038, 1.977, 3.015', 'ln');
  o += text(sx(1.55), 266, '三条 odometry edge 各让出 0.062，loop closure 让出 0.015', 'ts', 'middle');
  return svg(560, 274, o, '1D pose graph：odometry 给出 x3 等于 3.2，loop closure 说 x3 减 x0 等于 3.0；least squares 后四个 pose 是 0、1.038、1.977、3.015');
}

// ================= 第 7 站：navigation =================
export const DWP = { v0: 0.5, w0: 0, av: 0.5, aw: 2.0, dt: 0.25, ob: [0.92, -0.3], R: 0.5, goal: [4, 1.2], cap: 3, vb: 0.25 };
const arcPose = (v, w, t) => (Math.abs(w) < 1e-9 ? [v * t, 0, 0] : [(v / w) * Math.sin(w * t), (v / w) * (1 - Math.cos(w * t)), w * t]);
export function dwaEval() {
  const { v0, w0, av, aw, dt, ob, R, goal, cap, vb } = DWP;
  const vs = [v0 - av * dt, v0, v0 + av * dt], ws = [-2, -1, 0, 1, 2].map((k) => w0 + (k * aw * dt) / 2);
  const rows = [];
  for (const v of vs) for (const w of ws) {
    let dd = cap;
    for (let s = 0; s <= cap; s += 0.005) { const p = arcPose(v, w, s / v); if (Math.hypot(p[0] - ob[0], p[1] - ob[1]) < R) { dd = s; break; } }
    const adm = v <= Math.sqrt(2 * dd * vb);
    const p = arcPose(v, w, 1.0), ang = Math.atan2(goal[1] - p[1], goal[0] - p[0]) - p[2], dth = Math.abs(Math.atan2(Math.sin(ang), Math.cos(ang)));
    rows.push({ v, w, dist: dd, adm, head: 1 - dth / Math.PI });
  }
  const A = rows.filter((r) => r.adm), mx = (k) => Math.max(...A.map((r) => r[k]));
  const mh = mx('head'), mdd = mx('dist'), mv = mx('v');
  for (const r of rows) r.G = r.adm ? (0.2 * r.head) / mh + (0.2 * r.dist) / mdd + (2.0 * r.v) / mv : null;
  return rows;
}
function dwa() {
  const rows = dwaEval(), best = rows.filter((r) => r.adm).sort((a, b) => b.G - a.G)[0];
  const u = 90, P = ([x, y]) => [36 + x * u, 150 - y * u];
  let o = '';
  const c = P(DWP.ob);
  o += circle(c[0], c[1], 0.3 * u, 'solid2') + circle(c[0], c[1], DWP.R * u, 'dash');
  for (const r of rows.filter((r) => r.v === 0.625)) {
    const pts = []; for (let s = 0; s <= Math.min(r.dist, 1.4); s += 0.02) pts.push(P(arcPose(r.v, r.w, s / r.v)));
    o += path(d(pts), r === best ? 'ln' : r.adm ? 'ink' : 'mute');
  }
  const r0 = P([0, 0]), ga = Math.atan2(DWP.goal[1], DWP.goal[0]);
  o += arrow(r0[0], r0[1], r0[0] + 130 * Math.cos(ga), r0[1] - 130 * Math.sin(ga), 'grid', 6);
  o += text(r0[0] + 136 * Math.cos(ga), r0[1] - 136 * Math.sin(ga) + 4, 'goal 方向', 'ts', 'start');
  o += circle(r0[0], r0[1], 0.2 * u, 'paper') + arrow(r0[0], r0[1], r0[0] + 26, r0[1], 'ink-b', 6);
  const TX = 222;
  o += text(TX, 62, '粗线：ω = 0.5，', 'tl', 'start') + text(TX, 80, '3 m 内不碰', 'tl', 'start');
  o += text(TX, 150, '灰线：另外四条 arc 在', 'ts', 'start') + text(TX, 166, '0.48 到 0.59 m 处碰到，', 'ts', 'start') + text(TX, 182, '刹不住', 'ts', 'start');
  o += text(TX, 212, 'robot 当前：v = 0.5，ω = 0', 'ts', 'start');
  o += text(TX, 238, '实心圆：obstacle；', 'ts', 'start') + text(TX, 254, '虚线圆：加上 robot radius', 'ts', 'start');
  o += text(20, 18, 'v = 0.625 m/s 的五条 arc', 'tb', 'start');
  // 右：velocity space
  const X = 380, Y = 40, cw = 33, ch = 34;
  o += text(X + (5 * cw) / 2, 18, '15 个候选 (v, ω)', 'tb', 'middle');
  const vs = [0.625, 0.5, 0.375], ws = [-0.5, -0.25, 0, 0.25, 0.5];
  vs.forEach((v, i) => ws.forEach((w, j) => {
    const r = rows.find((q) => Math.abs(q.v - v) < 1e-9 && Math.abs(q.w - w) < 1e-9);
    const x = X + j * cw, y = Y + i * ch;
    o += rect(x, y, cw, ch, r === best ? 'solid' : r.adm ? 'wash' : 'paper');
    o += text(x + cw / 2, y + ch / 2 + 4, r.adm ? r.G.toFixed(2) : '×', r === best ? 'tw' : 'ts', 'middle');
  }));
  vs.forEach((v, i) => (o += text(X - 6, Y + i * ch + ch / 2 + 4, String(v), 'ts', 'end')));
  ws.forEach((w, j) => (o += text(X + j * cw + cw / 2, Y + 3 * ch + 16, String(w), 'ts', 'middle')));
  o += text(X - 6, Y - 6, 'v', 'ts', 'end') + text(X + 5 * cw + 4, Y + 3 * ch + 16, 'ω', 'ts', 'start');
  o += text(X + (5 * cw) / 2, Y + 3 * ch + 40, '×：刹不住（not admissible）', 'ts', 'middle');
  o += text(X + (5 * cw) / 2, Y + 3 * ch + 58, '数字：G(v, ω)，深色是最大的', 'ts', 'middle');
  return svg(560, 262, o, 'DWA 的一次决策：左边是 v 等于 0.625 的五条候选 arc，其中四条在 0.5 米左右撞上 obstacle；右边是 3 乘 5 的 velocity 表格，选中 v 0.625、ω 0.5，得分 2.39');
}
export function replanSim(rad = 2.5) {
  const truth = mapM(), known = Array.from({ length: GH }, () => Array(GW).fill(0));
  let pos = GS, travelled = 0, replans = 0; const frames = [];
  let plan = gsearch(known, pos, GG, octile).path;
  for (let step = 0; step < 200; step++) {
    let found = false;
    for (let r = 0; r < GH; r++) for (let c = 0; c < GW; c++) if (truth[r][c] && !known[r][c] && Math.hypot(c - pos[0], r - pos[1]) <= rad) { known[r][c] = step + 1; found = true; }
    const blocked = plan.some(([c, r]) => known[r][c]);
    if (blocked) { plan = gsearch(known.map((row) => row.map((v) => (v ? 1 : 0))), pos, GG, octile).path; replans++; }
    frames.push({ pos, plan: plan.slice(), re: blocked, found });
    if (pos[0] === GG[0] && pos[1] === GG[1]) break;
    const nx = plan[1]; travelled += Math.hypot(nx[0] - pos[0], nx[1] - pos[1]); pos = nx; plan = plan.slice(1);
  }
  return { frames, travelled, replans, known };
}
function replanA() {
  const { frames, known } = replanSim(), s = 18, X = 55, Y = 30, n = frames.length, T = +(n * 0.32 + 2).toFixed(2), tA = (i) => (i * 0.32) / T;
  let o = rect(X, Y, GW * s, GH * s, 'frame');
  const truth = mapM();
  // 还没看到的 obstacle：只画轮廓
  const hidden = []; truth.forEach((row, r) => row.forEach((v, c) => { if (v) hidden.push([c, r]); }));
  o += path(cellsPath(hidden, X, Y, s), 'grid');
  for (let k = 1; k <= n; k++) {
    const cells = []; known.forEach((row, r) => row.forEach((v, c) => { if (v === k) cells.push([c, r]); }));
    if (cells.length) o += g(path(cellsPath(cells, X, Y, s), 'solid2'), span(true, tA(k - 1), 1, T));
  }
  const C = (p) => cpt(p, X, Y, s);
  const kt = frames.map((_, i) => tA(i)); kt.push(1);
  const plans = frames.map((f) => d(f.plan.map(C)));
  o += apath([plans[n - 1], ...plans.slice(1), plans[n - 1]], [0, ...kt.slice(1)], T, 'ln-dash', true);
  const trails = frames.map((_, i) => d(frames.slice(0, i + 1).map((f) => C(f.pos))));
  o += apath([trails[n - 1], ...trails.slice(1), trails[n - 1]], [0, ...kt.slice(1)], T, 'ln', true);
  const xs = frames.map((f) => C(f.pos)[0]), ys = frames.map((f) => C(f.pos)[1]);
  o += acircle([xs[n - 1], ...xs.slice(1), xs[n - 1]], [ys[n - 1], ...ys.slice(1), ys[n - 1]], [0, ...kt.slice(1)], T, 6, 'ink-f');
  const sensor = `<circle cx="${f1(xs[n - 1])}" cy="${f1(ys[n - 1])}" r="${2.5 * s}" class="dash">${anim('cx', [xs[n - 1], ...xs.slice(1), xs[n - 1]].map(f1), [0, ...kt.slice(1)], T)}${anim('cy', [ys[n - 1], ...ys.slice(1), ys[n - 1]].map(f1), [0, ...kt.slice(1)], T)}</circle>`;
  o += sensor;
  const S0 = C(GS), G0 = C(GG);
  o += circle(S0[0], S0[1], 4, 'paper') + circle(G0[0], G0[1], 5, 'paper') + text(S0[0], S0[1] - 10, 'start', 'ts', 'middle') + text(G0[0], G0[1] - 10, 'goal', 'ts', 'middle');
  frames.forEach((f, i) => {
    const re = frames.slice(0, i + 1).filter((q) => q.re).length;
    const t0 = i === 0 ? 0.0005 : tA(i), t1 = i + 1 < n ? tA(i + 1) : 1;
    o += g(text(X, Y - 10, `第 ${i} 步，已经 replan ${re} 次`, 'tl', 'start'), span(i === n - 1, t0, t1, T));
  });
  o += text(X, Y + GH * s + 18, '粗线：走过的路；虚线：当前的 plan；虚线圆：sensor range（2.5 个 cell）。', 'ts', 'start');
  o += text(X, Y + GH * s + 36, '浅色轮廓是真实存在、但 robot 还没看到的 obstacle；看到之后变成深色。', 'ts', 'start');
  return svgA(560, Y + GH * s + 44, o, '动图：robot 假设未知的 cell 都是空的，一路沿 A* plan 走进 U 形 obstacle，边走边看到 wall、replan 12 次，最后绕出来到达 goal，共走 47.3');
}

// ================= 第 8 站：multi-robot =================
// plus 形路口：a1 从 W2 到 E2，a2 从 N2 到 S2
function cbsA() {
  const u = 40, O = [150, 136];
  const pos = { W2: [-2, 0], W1: [-1, 0], C: [0, 0], E1: [1, 0], E2: [2, 0], N2: [0, -2], N1: [0, -1], S1: [0, 1], S2: [0, 2] };
  const P = (k) => [O[0] + pos[k][0] * u, O[1] + pos[k][1] * u];
  let o = '';
  for (const k of Object.keys(pos)) { const p = P(k); o += rect(p[0] - u / 2, p[1] - u / 2, u, u, 'paper'); o += text(p[0] - u / 2 + 3, p[1] - u / 2 + 11, k, 'ts', 'start'); }
  const root = [['W2', 'W1', 'C', 'E1', 'E2'], ['N2', 'N1', 'C', 'S1', 'S2']];
  const sol = [['W2', 'W1', 'W1', 'C', 'E1', 'E2'], ['N2', 'N1', 'C', 'S1', 'S2']];
  const at = (p, t) => p[Math.min(t, p.length - 1)];
  // 时间轴：phase 1（root）t=0..2 然后停 + 标出 conflict；phase 2（child）t=0..5
  const dtm = 0.9, T1 = 2 * dtm + 1.6, T2 = 5 * dtm + 1.6, T = +(T1 + T2).toFixed(2);
  const seq = (pp, tmax, t0) => { const kt = [], xs = [], ys = []; for (let t = 0; t <= tmax; t++) { const p = P(at(pp, t)); kt.push((t0 + t * dtm) / T); xs.push(p[0]); ys.push(p[1]); } return { kt, xs, ys }; };
  for (const a of [0, 1]) {
    const s1 = seq(root[a], 2, 0), s2 = seq(sol[a], 5, T1);
    const kt = [0, ...s1.kt.map((t) => Math.max(t, 0.0005)).slice(0), s1.kt[s1.kt.length - 1] + 1.5 / T, ...s2.kt, 1];
    const last = P(at(sol[a], 5));
    const xs = [last[0], ...s1.xs, s1.xs[2], ...s2.xs, last[0]], ys = [last[1], ...s1.ys, s1.ys[2], ...s2.ys, last[1]];
    const kk = [0, 0.0005, ...s1.kt.slice(1), s1.kt[2] + 1.5 / T, ...s2.kt, 1];
    o += acircle(xs, ys.map((y) => y + 4), kk, T, 8, a === 0 ? 'ink-f' : 'ln-f');
    void kt;
  }
  // 第一帧（最终）上的 a1、a2 标签
  o += text(P('E2')[0] + 26, P('E2')[1] + 4, 'a1', 'tb', 'start') + text(P('S2')[0] + 26, P('S2')[1] + 4, 'a2', 'tl', 'start');
  o += g(text(P('C')[0] + 24, P('C')[1] - 24, 't = 2 两个都在 C', 'tl', 'start'), span(false, (2 * dtm) / T, T1 / T, T));
  // 右：constraint tree
  const node = (x, y, lines, cls) => { let q = rect(x - 75, y - 16, 150, 22 + 16 * (lines.length - 1), cls, 5); lines.forEach((l, i) => (q += text(x, y + 1 + 16 * i, l, i === 0 ? 'tb' : i === 2 ? 'tl' : 'ts', 'middle'))); return q; };
  o += text(430, 18, 'constraint tree', 'tb', 'middle');
  o += g(rect(295, 112, 150, 54, 'wash', 5), span(true, T1 / T, 1, T));
  o += node(430, 50, ['root：cost 4 + 4 = 8', '(a1, a2, C, t = 2)'], 'paper');
  o += line(405, 72, 375, 112, 'ink') + line(462, 72, 476, 184, 'grid');
  o += text(390, 96, '+(a1, C, 2)', 'ts', 'end') + text(480, 112, '+(a2, C, 2)', 'ts', 'start');
  o += node(370, 128, ['cost 5 + 4 = 9', 'a1 在 W1 等一步', '没有 conflict：返回'], 'frame') + node(480, 200, ['cost 4 + 5 = 9', 'a2 在 N1 等一步'], 'paper');
  o += g(text(150, 258, '第一遍：root 的两条 path 各走各的最短路', 'ts', 'middle'), span(false, 0.0005, T1 / T, T));
  o += g(text(150, 258, '第二遍：左边 child 的 solution', 'ts', 'middle'), span(true, T1 / T, 1, T));
  return svgA(560, 266, o, '动图：十字路口上 a1 从西到东、a2 从北到南，各自最短的 path 在 t 等于 2 同时到达中心 C；CBS 加一条 constraint 让 a1 在 W1 等一步，总 cost 9，没有 conflict');
}
function prio() {
  const u = 46;
  let o = '';
  const draw = (X, Y, title, lines) => {
    o += text(X, Y - u - 8, title, 'tb', 'start');
    const P = (k) => (k === 'n' ? [X + 1 * u, Y - u] : [X + +k * u, Y]);
    for (const k of ['0', '1', '2', '3', 'n']) { const [x, y] = P(k); o += rect(x, y, u, u, 'paper') + text(x + u / 2, y + u - 5, k, 'ts', 'middle'); }
    const A = P('1'), B = P('0');
    o += circle(A[0] + u / 2, A[1] + u / 2 - 4, 10, 'ink-f') + text(A[0] + u / 2, A[1] + u / 2, 'A', 'tw', 'middle');
    o += circle(B[0] + u / 2, B[1] + u / 2 - 4, 10, 'ln-f') + text(B[0] + u / 2, B[1] + u / 2, 'B', 'tw', 'middle');
    lines.forEach((l, i) => (o += text(X + 4.4 * u, Y - u + 16 + i * 18, l, i === lines.length - 1 ? 'tl' : 'ts', 'start')));
  };
  draw(10, 84, 'A 先 plan', ['A：1 → 2，停在 goal 2', 'B 要去 3，必须经过 2，', '可 2 永远被 A 占着', 'B 找不到 path']);
  draw(10, 216, 'B 先 plan', ['B：0 → 1 → 2 → 3', 'A：t = 1 躲进 n，t = 2 回到 1，', 't = 3 到 2', '都到了，cost 3 + 3 = 6']);
  o += text(10, 284, 'A 从 cell 1 去 cell 2，B 从 cell 0 去 cell 3；n 是 cell 1 旁边一个只能容一个 robot 的凹处。', 'ts', 'start');
  return svg(560, 292, o, '一条四格 corridor 加一个凹处：A 先 plan 时停在 cell 2 挡住 B，B 无解；B 先 plan 时 A 躲进凹处，两个都能到');
}

// ================= 开头：三个失败 =================
function intro() {
  let o = '';
  // (a) grid path 的 corner
  const s = 22, X = 10, Y = 40;
  o += text(X, 18, '① path 对了，car 开不了', 'tb', 'start');
  for (let c = 0; c < 7; c++) for (let r = 0; r < 6; r++) o += rect(X + c * s, Y + r * s, s, s, 'frame');
  const pts = [[0, 4], [4, 4], [4, 0]].map(([c, r]) => [X + (c + 0.5) * s, Y + (r + 0.5) * s]);
  o += path(d(pts), 'ln');
  const cx = pts[1][0] - 1.5 * s, cy = pts[1][1] - 1.5 * s;
  o += path(`M${f1(pts[1][0] - 1.5 * s)} ${f1(pts[1][1])}A${1.5 * s} ${1.5 * s} 0 0 0 ${f1(pts[1][0])} ${f1(pts[1][1] - 1.5 * s)}`, 'dash');
  void cx; void cy;
  o += text(X + 2, Y + 6 * s + 18, 'A* 的 path 在 corner 处原地转 90°；', 'ts', 'start');
  o += text(X + 2, Y + 6 * s + 34, 'turning radius 1.5 格的 car 只能', 'ts', 'start');
  o += text(X + 2, Y + 6 * s + 50, '走虚线，切进别的 cell。', 'ts', 'start');
  // (b) odometry
  const X2 = 190;
  o += text(X2, 18, '② 不知道自己在哪', 'tb', 'start');
  o += rect(X2, 92, 160, 34, 'paper');
  o += rect(X2 + 92, 85, 30, 8, 'solid');
  o += text(X2 + 107, 78, 'door', 'ts', 'middle');
  o += circle(X2 + 107, 109, 9, 'paper') + text(X2 + 107, 146, 'odometry 说在这', 'ts', 'middle');
  o += circle(X2 + 78, 109, 9, 'ink-f') + text(X2 + 64, 64, '实际在这', 'ts', 'middle');
  o += line(X2 + 72, 68, X2 + 77, 98, 'mute');
  o += text(X2 + 2, Y + 6 * s + 18, '走了 20 m，wheel 的 radius 差 3%，', 'ts', 'start');
  o += text(X2 + 2, Y + 6 * s + 34, '位置就差 0.6 m，比半个 door 还多：', 'ts', 'start');
  o += text(X2 + 2, Y + 6 * s + 50, '转进去撞在 wall 上。', 'ts', 'start');
  // (c) junction
  const X3 = 385, c0 = [X3 + 80, 92];
  o += text(X3, 18, '③ 各自最短，合起来撞车', 'tb', 'start');
  for (const [dx, dy] of [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, -1], [0, 1], [0, 2]]) o += rect(c0[0] + dx * 26 - 13, c0[1] + dy * 26 - 13, 26, 26, 'paper');
  o += circle(c0[0] - 52, c0[1], 8, 'ink-f') + arrow(c0[0] - 42, c0[1], c0[0] - 14, c0[1], 'ink', 6);
  o += circle(c0[0], c0[1] - 26, 8, 'ln-f') + arrow(c0[0], c0[1] - 16, c0[0], c0[1] - 8, 'ln', 6);
  o += text(X3 + 2, Y + 6 * s + 18, '两个 robot 的 path 都最短，', 'ts', 'start');
  o += text(X3 + 2, Y + 6 * s + 34, '同一时刻到达路口中心。', 'ts', 'start');
  return svg(560, Y + 6 * s + 58, o, '三个失败：grid 上的 path 在 corner 处要求原地转向，car 做不到；odometry 偏了 0.6 米，robot 以为对准了 door；两个 robot 各走最短 path，在路口相撞');
}

export default {
  'rb3302-intro': intro,
  'rb3302-astar': astarA,
  'rb3302-rrtstar': rrtStarA,
  'rb3302-rewire': rewire,
  'rb3302-dubins': dubinsA,
  'rb3302-lattice': lattice,
  'rb3302-chomp': chompA,
  'rb3302-histo': histA,
  'rb3302-particles': particles,
  'rb3302-occ': occgrid,
  'rb3302-posegraph': posegraph,
  'rb3302-dwa': dwa,
  'rb3302-replan': replanA,
  'rb3302-cbs': cbsA,
  'rb3302-prio': prio,
};
