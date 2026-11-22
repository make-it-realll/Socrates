import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 公共的小工具 ----------
const sig = (z) => 1 / (1 + Math.exp(-z));
function rng(seed) { // mulberry32，构建时结果固定
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const kts = (n) => Array.from({ length: n }, (_, i) => i / n); // discrete 动画的 keyTimes
// 一组 discrete 帧：第 k 个元素只在第 k 帧显示
const frames = (items, dur) => items.map((s, k) => `<g opacity="${k === 0 ? 1 : 0}">${s}${ashow(items.map((_, j) => j === k), kts(items.length), dur)}</g>`).join('');
function dashArrow(x1, y1, x2, y2) {
  const a = Math.atan2(y2 - y1, x2 - x1), s = 7;
  const p = (g) => [x2 - s * Math.cos(a + g), y2 - s * Math.sin(a + g)];
  return line(x1, y1, x2 - 2 * Math.cos(a), y2 - 2 * Math.sin(a), 'dash') + poly([[x2, y2], p(0.42), p(-0.42)], 'mute-f');
}

// ================= Offline RL：3×3 grid 上的 stitching =================
// s1 s2 s3 / s4 s5 s6 / s7 s8 s9；data 里有三条 trajectory
const G0 = { x: 40, y: 40, c: 70 };
const cen = (k, g = G0) => { const i = (k - 1) % 3, j = Math.floor((k - 1) / 3); return [g.x + g.c * i + g.c / 2, g.y + g.c * j + g.c / 2]; };
function gridBase(g = G0) {
  let o = '';
  for (let k = 1; k <= 9; k++) {
    const i = (k - 1) % 3, j = Math.floor((k - 1) / 3);
    const cls = k === 6 ? 'wash2' : k === 9 ? 'wash' : 'paper';
    o += rect(g.x + g.c * i, g.y + g.c * j, g.c, g.c, cls);
    o += text(g.x + g.c * i + 6, g.y + g.c * j + 15, 's' + k, 'ts');
  }
  o += text(cen(6, g)[0], cen(6, g)[1] + 24, 'r = −1', 'ts', 'middle') + text(cen(9, g)[0], cen(9, g)[1] + 24, 'r = +1', 'tl', 'middle');
  return o;
}
function seg(a, b, cls, off, g = G0) {
  const [x1, y1] = cen(a, g), [x2, y2] = cen(b, g);
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * off, ny = ux * off;
  const sx = x1 + ux * 12 + nx, sy = y1 + uy * 12 + ny, ex = x2 - ux * 12 + nx, ey = y2 - uy * 12 + ny;
  return cls === 'dash' ? dashArrow(sx, sy, ex, ey) : arrow(sx, sy, ex, ey, cls);
}
const TA = [1, 2, 5, 6], TB = [5, 8, 9], TC = [1, 4, 7];
function trajs(g = G0) {
  let o = '';
  for (let i = 0; i < 3; i++) o += seg(TA[i], TA[i + 1], 'ink', 5, g);
  for (let i = 0; i < 2; i++) o += seg(TB[i], TB[i + 1], 'ln', -5, g);
  for (let i = 0; i < 2; i++) o += seg(TC[i], TC[i + 1], 'dash', 5, g);
  return o;
}
function stitch() {
  let o = gridBase() + trajs();
  o += text(cen(1)[0], 30, 'start', 'ts', 'middle');
  const lx = 300;
  o += line(lx, 62, lx + 30, 62, 'ink') + text(lx + 40, 66, 'τA：s1 → s2 → s5 → s6，return −0.81', 'ts');
  o += line(lx, 92, lx + 30, 92, 'ln') + text(lx + 40, 96, 'τB：s5 → s8 → s9，return +0.9', 'ts');
  o += line(lx, 122, lx + 30, 122, 'dash') + text(lx + 40, 126, 'τC：s1 → s4 → s7，return 0', 'ts');
  o += text(lx, 172, '从 s1 出发的 trajectory 里最好的是 τC（0）。', 'ts');
  o += text(lx, 192, '沿 τA 走到 s5 再换到 τB：', 'ts');
  o += text(lx, 212, 's1 → s2 → s5 → s8 → s9，return 0.9³ = 0.729', 'tb');
  o += text(lx, 232, 'data 里没有这一整条，但每一步都在 data 里。', 'ts');
  return svg(560, 260, o, '3 乘 3 的 grid，data 里有三条 trajectory：τA 从 s1 经 s2、s5 走到 s6 得 −1；τB 从 s5 经 s8 到 s9 得 +1；τC 从 s1 经 s4 到 s7 得 0。把 τA 的前半段和 τB 接起来就能从 s1 到 s9。');
}

// AWAC 在这张 grid 上的 policy iteration（tabular，exact evaluation）
export function awacIter(lam = 0.5, gam = 0.9, K = 3) {
  const E = { s1: [['R', 's2', 0], ['D', 's4', 0]], s2: [['D', 's5', 0]], s5: [['R', 's6', -1], ['D', 's8', 0]], s4: [['D', 's7', 0]], s8: [['R', 's9', 1]] };
  const term = new Set(['s6', 's9', 's7']);
  const beta = { s1: { R: 0.5, D: 0.5 }, s2: { D: 1 }, s5: { R: 0.5, D: 0.5 }, s4: { D: 1 }, s8: { R: 1 } };
  const evalQ = (pi) => {
    const V = { s6: 0, s9: 0, s7: 0 }, Q = {};
    for (const s of ['s8', 's5', 's4', 's2', 's1']) { Q[s] = {}; let v = 0; for (const [a, n, r] of E[s]) { Q[s][a] = r + (term.has(n) ? 0 : gam * V[n]); v += pi[s][a] * Q[s][a]; } V[s] = v; }
    return { Q, V };
  };
  let pi = JSON.parse(JSON.stringify(beta));
  const out = [];
  for (let k = 0; k < K; k++) {
    const { Q, V } = evalQ(pi);
    out.push({ pi, Q, V });
    const np = {};
    for (const s in E) { np[s] = {}; let Z = 0; for (const [a] of E[s]) { const w = beta[s][a] * Math.exp((Q[s][a] - V[s]) / lam); np[s][a] = w; Z += w; } for (const a in np[s]) np[s][a] /= Z; }
    pi = np;
  }
  return out;
}
function awacA() {
  const it3 = awacIter(), dur = 9;
  const g = { x: 24, y: 46, c: 62 };
  let o = gridBase(g) + trajs(g);
  // 右侧：两个 state 的 policy 柱状图
  const bx = 262, by = 196, bh = 120;
  const groups = [
    { s: 's1', acts: [['R', 's1 → s2'], ['D', 's1 → s4']], x: bx },
    { s: 's5', acts: [['R', 's5 → s6'], ['D', 's5 → s8']], x: bx + 156 },
  ];
  o += line(bx - 10, by, 556, by, 'axis');
  for (const gr of groups) {
    o += text(gr.x + 58, 64, 'π(a | ' + gr.s + ')', 'tb', 'middle');
    gr.acts.forEach(([a, lab], j) => {
      const x = gr.x + j * 66, w = 46;
      const ds = it3.map((f) => { const h = bh * f.pi[gr.s][a]; return d([[x, by], [x, by - h], [x + w, by - h], [x + w, by]]) + 'Z'; });
      const kt = [0, 0.3, 0.333, 0.633, 0.666, 0.966, 1];
      const seq = [ds[0], ds[0], ds[1], ds[1], ds[2], ds[2], ds[0]];
      o += apath(seq, kt, dur, j === 1 && gr.s === 's5' ? 'solid' : j === 0 && gr.s === 's1' ? 'solid' : 'wash-strong');
      o += text(x + w / 2, by + 16, lab, 'ts', 'middle');
      o += frames(it3.map((f) => text(x + w / 2, by + 32, 'Q = ' + f.Q[gr.s][a].toFixed(3).replace('-', '−'), 'ts', 'middle') + text(x + w / 2, by - bh * f.pi[gr.s][a] - 6, f.pi[gr.s][a].toFixed(3), 'ts', 'middle')), dur);
    });
  }
  const titles = ['iteration 0：π 就是 behavior policy（对整个 data 做 BC）', 'iteration 1：用 π_β 的 Q 加权（这就是 AWR）', 'iteration 2：用新 policy 的 Q 再加权'];
  o += frames(titles.map((t) => text(24, 22, t, 'tb')), dur);
  o += text(24, 270, 'Q 和 π 交替更新：s5 先学会往下，s1 → s2 的 Q 随之从 −0.04 涨到 0.70，s1 才开始偏向 s2。', 'ts');
  return svgA(560, 280, o, '动图：AWAC 在 stitching grid 上迭代三次。iteration 0 时两个 state 的 policy 都是 0.5 对 0.5；iteration 1 时 s5 往下的概率变成 0.978，s1 往右反而降到 0.480；iteration 2 时 s1 往右升到 0.801。');
}

// ================= Reward learning：goal classifier 与 VICE =================
export function viceIter(K = 6) {
  const fit = (pos, neg, lamR = 0.02, iters = 4000, lr = 0.3) => {
    let w = [0, 0, 0];
    const data = [...pos.map((x) => [x, 1, 0.5 / pos.length]), ...neg.map((x) => [x, 0, 0.5 / neg.length])];
    for (let t = 0; t < iters; t++) {
      const gr = [0, 0, 0];
      for (const [x, y, wt] of data) { const p = sig(w[0] + w[1] * x + w[2] * x * x); gr[0] += wt * (p - y); gr[1] += wt * (p - y) * x; gr[2] += wt * (p - y) * x * x; }
      gr[1] += lamR * w[1]; gr[2] += lamR * w[2];
      for (let k = 0; k < 3; k++) w[k] -= lr * gr[k];
    }
    return w;
  };
  const P = [0.8, 0.9, 1.0, 1.1, 1.2], N0 = [-2, -1.5, -1, -0.5, 0];
  let neg = [...N0];
  const out = [];
  for (let k = 0; k < K; k++) {
    const w = fit(P, neg), p = (x) => sig(w[0] + w[1] * x + w[2] * x * x);
    let best = -3, bv = -1;
    for (let i = 0; i <= 600; i++) { const x = -3 + i / 100; if (p(x) > bv) { bv = p(x); best = x; } }
    out.push({ w, p, best, pbest: bv, neg: [...neg] });
    neg.push(best - 0.1, best, best + 0.1);
  }
  return { P, out };
}
function clsPanel(P, fr, sx, sy) {
  let o = '';
  o += rect(sx(0.8), sy(1.05), sx(1.2) - sx(0.8), sy(-0.05) - sy(1.05), 'wash');
  o += path(curve(fr.p, -3, 3, sx, sy), 'ln');
  for (const x of P) o += circle(sx(x), sy(1), 4, 'ink-f');
  return o;
}
function classifier() {
  const { P, out } = viceIter(1), fr = out[0];
  const sx = lin(-3, 3, 60, 520), sy = lin(0, 1, 200, 50);
  let o = axes({ sx, sy, x0: -3, x1: 3, y0: 0, y1: 1, xt: [-3, -2, -1, 0, 1, 2, 3], yt: [0, 0.5, 1], xl: 'state x', grid: true });
  o += clsPanel(P, fr, sx, sy);
  for (const x of fr.neg) o += circle(sx(x), sy(0), 4, 'paper');
  o += text(sx(1), 40, 'goal：x ∈ [0.8, 1.2]', 'ts', 'middle');
  o += text(sx(-1), sy(0) - 12, 'negative：失败的 state', 'ts', 'middle');
  o += arrow(sx(2.55), sy(0.6), sx(2.95), sy(0.96), 'ink') + text(sx(2.5), sy(0.56), 'policy 去这里', 'ts', 'end') + text(sx(2.5), sy(0.56) + 15, 'p(3) = ' + fr.p(3).toFixed(3), 'ts', 'end');
  o += text(sx(1) + 10, sy(fr.p(1)) + 22, 'p(1) = ' + fr.p(1).toFixed(3), 'ts', 'start');
  o += text(64, 252, '实心点是 success 的例子，空心点是失败的例子。Classifier 只被告知“右边好、左边坏”，', 'ts');
  o += text(64, 268, '它对 x = 3 打的分比真正的 goal 还高，那里一个例子都没有。', 'ts');
  return svg(560, 278, o, 'Goal classifier 的输出曲线：在 goal 附近是 0.925，在 x 等于 3 处接近 1，policy 最大化这个 reward 会跑到 x 等于 3。');
}
function viceA() {
  const { P, out } = viceIter(6), dur = 12;
  const sx = lin(-3, 3, 60, 520), sy = lin(0, 1, 210, 60);
  let o = axes({ sx, sy, x0: -3, x1: 3, y0: 0, y1: 1, xt: [-3, -2, -1, 0, 1, 2, 3], yt: [0, 0.5, 1], xl: 'state x', grid: true });
  o += rect(sx(0.8), sy(1.05), sx(1.2) - sx(0.8), sy(-0.05) - sy(1.05), 'wash');
  for (const x of P) o += circle(sx(x), sy(1), 4, 'ink-f');
  const items = out.map((fr, k) => {
    let s = path(curve(fr.p, -3, 3, sx, sy), 'ln');
    fr.neg.forEach((x, i) => { s += circle(sx(x), sy(0), 4, i >= 5 ? 'wash-strong' : 'paper'); });
    s += line(sx(fr.best), sy(fr.pbest) - 8, sx(fr.best), sy(0) + 8, 'dash');
    s += circle(sx(fr.best), sy(fr.pbest), 5.5, 'ink-f');
    s += text(60, 24, `round ${k}：policy 走到 argmax x = ${fr.best.toFixed(2)}，那里 p = ${fr.pbest.toFixed(3)}`, 'tb');
    s += text(60, 42, k === 0 ? '只有最初的 5 个 negative' : `negative 里已有 ${fr.neg.length - 5} 个 policy 自己到过的 state（涂色）`, 'ts');
    return s;
  });
  o += frames(items, dur);
  o += text(64, 262, '每轮把 policy 到过的 state 当成 negative 加进去再 train：被钻的空子一轮轮被堵上。', 'ts');
  return svgA(560, 272, o, '动图：VICE 的六轮。第 0 轮 classifier 在 x 等于 3 最高，policy 跑去那里；把那里的 state 当 negative 后，第 1 轮的 argmax 回到 1.03 附近；之后 argmax 停在 goal 内，最高的 p 逐轮降向 0.5。');
}

// ================= Multi-task：chain 上的 goal reaching 与 HER =================
export function herRun(her, seed, N = 16, H = 20, eps = 0.1, alpha = 0.5, gam = 0.9, episodes = 600, every = 50, K = 4) {
  const R = rng(seed);
  const ri = (n) => Math.floor(R() * n);
  const Q = Array.from({ length: N }, () => Array.from({ length: N }, () => [0, 0]));
  const evals = []; let pos = 0, tot = 0;
  const step = (s, a) => Math.max(0, Math.min(N - 1, s + (a === 1 ? 1 : -1)));
  const greedy = (g) => { let s = 0; for (let t = 0; t < H; t++) { const q = Q[s][g]; if (q[0] === q[1]) return 0; s = step(s, q[1] > q[0] ? 1 : 0); if (s === g) return 1; } return 0; };
  const evalAll = () => { let c = 0; for (let g = 1; g < N; g++) c += greedy(g); return c / (N - 1); };
  const upd = (s, a, s2, g) => { const r = s2 === g ? 1 : 0; pos += r; tot++; const tgt = r ? 1 : gam * Math.max(...Q[s2][g]); Q[s][g][a] += alpha * (tgt - Q[s][g][a]); };
  for (let ep = 0; ep < episodes; ep++) {
    if (ep % every === 0) evals.push(evalAll());
    const g = 1 + ri(N - 1);
    let s = 0; const tr = [];
    for (let t = 0; t < H; t++) {
      const q = Q[s][g];
      const a = R() < eps || q[0] === q[1] ? ri(2) : q[1] > q[0] ? 1 : 0;
      const s2 = step(s, a); tr.push([s, a, s2]); s = s2;
      if (s === g) break;
    }
    for (const [a0, a1, a2] of tr) upd(a0, a1, a2, g);
    if (her) tr.forEach(([a0, a1, a2], i) => { for (let k = 0; k < K; k++) { const j = i + ri(tr.length - i); upd(a0, a1, a2, tr[j][2]); } });
  }
  evals.push(evalAll());
  return { evals, frac: pos / tot };
}
export function herCurves(S = 20) {
  const res = {};
  for (const her of [false, true]) {
    let acc = null, fr = 0;
    for (let sd = 1; sd <= S; sd++) { const r = herRun(her, sd); fr += r.frac / S; acc = acc ? acc.map((v, i) => v + r.evals[i] / S) : r.evals.map((v) => v / S); }
    res[her ? 'her' : 'plain'] = { curve: acc, frac: fr };
  }
  return res;
}
const CH = { x0: 30, y: 78, w: 31, N: 16 };
const chx = (s) => CH.x0 + CH.w * s + CH.w / 2;
function chainCells(y = CH.y) {
  let o = '';
  for (let s = 0; s < CH.N; s++) { o += rect(CH.x0 + CH.w * s, y - 14, CH.w, 28, 'paper'); o += text(chx(s), y + 5, String(s), 'ts', 'middle'); }
  return o;
}
function flag(x, y, lab, cls = 'solid') {
  return line(x, y, x, y - 30, 'ink') + poly([[x, y - 30], [x + 16, y - 25], [x, y - 20]], cls) + text(x + 2, y - 36, lab, 'ts', 'middle');
}
function chain() {
  let o = chainCells();
  o += flag(chx(0), CH.y - 16, 'start', 'wash2') + flag(chx(12), CH.y - 16, 'goal 12');
  // 一条 random walk：0 1 2 1 2 3 4 5
  const tr = [0, 1, 2, 1, 2, 3, 4, 5];
  for (let i = 0; i < tr.length - 1; i++) {
    const y = CH.y + 30 + i * 9, a = chx(tr[i]), b = chx(tr[i + 1]);
    o += arrow(a, y, b + (b > a ? -3 : 3), y, 'mute', 5);
  }
  o += text(chx(3), CH.y + 112, '7 步全部 r = 0：这条 data 对“去 12”毫无信息', 'ts', 'middle');
  o += text(300, CH.y + 104, 'trajectory：0 → 1 → 2 → 1 → 2 → 3 → 4 → 5', 'ts');
  const lx = 300;
  o += text(lx, CH.y + 44, 'reward：到达 goal 时 r = 1，其余 r = 0', 'ts');
  o += text(lx, CH.y + 62, 'Q 全部初始化为 0，ε-greedy 在平局时随机走', 'ts');
  o += text(lx, CH.y + 80, '20 步之内 random walk 很难走到 12', 'ts');
  return svg(560, 205, o, '16 个 state 排成一条 chain，从 0 出发，goal 在 12。一条 random walk 0、1、2、1、2、3、4、5 走了 7 步，每一步的 reward 都是 0。');
}
function herA() {
  const tr = [0, 1, 2, 1, 2, 3, 4, 5], dur = 9;
  let o = chainCells();
  for (let i = 0; i < tr.length - 1; i++) {
    const y = CH.y + 30 + i * 13, a = chx(tr[i]), b = chx(tr[i + 1]);
    o += arrow(a, y, b + (b > a ? -3 : 3), y, 'mute', 5);
  }
  const goals = [[12, '原来的 goal：12'], [5, 'relabel：goal = 终点 s_T = 5（final）'], [3, 'relabel：goal = 之后到过的 3（future）']];
  const items = goals.map(([g, lab]) => {
    let s = flag(chx(g), CH.y - 16, 'goal ' + g) + text(30, 24, lab, 'tb');
    let first = -1;
    for (let i = 0; i < tr.length - 1; i++) {
      const y = CH.y + 34 + i * 13, r = tr[i + 1] === g ? 1 : 0;
      if (r && first < 0) first = i;
      const done = first >= 0 && i > first;
      s += text(chx(Math.max(tr[i], tr[i + 1])) + 14, y, done ? '' : 'r = ' + r, r ? 'tl' : 'ts');
    }
    const n = first < 0 ? 0 : 1;
    s += text(330, CH.y + 150, n ? `第 ${first + 1} 步到达 goal：r = 1，episode 在这里结束` : '7 步全是 r = 0', n ? 'tl' : 'ts', 'middle');
    return s;
  });
  o += frames(items, dur);
  return svgA(560, 240, o, '动图：同一条 trajectory 0、1、2、1、2、3、4、5 配上三个不同的 goal。goal 是 12 时全是 0；relabel 成 5 时最后一步 reward 是 1；relabel 成 3 时第 5 步 reward 是 1。');
}
function herCurve() {
  const res = herCurves();
  const n = res.her.curve.length;
  const sx = lin(0, 600, 70, 520), sy = lin(0, 1, 210, 40);
  let o = axes({ sx, sy, x0: 0, x1: 600, y0: 0, y1: 1, xt: [0, 100, 200, 300, 400, 500, 600], yt: [0, [0.5, '50%'], [1, '100%']], xl: 'training episode', grid: true });
  const pts = (c) => c.map((v, i) => [sx(i * 50), sy(v)]);
  o += path(d(pts(res.plain.curve)), 'ink-b') + path(d(pts(res.her.curve)), 'ln');
  const last = (c) => c[n - 1];
  o += text(sx(600) - 4, sy(last(res.her.curve)) - 10, 'HER（future，每步 4 个 goal）' + Math.round(100 * last(res.her.curve)) + '%', 'tl', 'end');
  o += text(sx(600) - 4, sy(last(res.plain.curve)) + 30, '只用原来的 goal ' + Math.round(100 * last(res.plain.curve)) + '%', 'tb', 'end');
  o += text(74, 30, 'greedy policy 能到达的 goal 比例（15 个 goal，20 个 seed 的平均）', 'ts');
  o += text(74, 278, `buffer 里 r = 1 的 transition 占比：没有 relabeling ${(100 * res.plain.frac).toFixed(1)}%，有 relabeling ${(100 * res.her.frac).toFixed(1)}%`, 'ts');
  return svg(560, 288, o, '两条 learning curve：横轴是 training episode，纵轴是 greedy policy 能到达的 goal 比例。HER 一直高于不做 relabeling 的版本。');
}

// ================= Model-based RL：ensemble 与 short rollout =================
const trueDelta = (s) => 0.15 + 0.03 * s;
function polyfit(xs, ys, deg) {
  const m = deg + 1, A = Array.from({ length: m }, () => new Array(m + 1).fill(0));
  for (let i = 0; i < xs.length; i++) for (let r = 0; r < m; r++) { for (let c = 0; c < m; c++) A[r][c] += xs[i] ** (r + c); A[r][m] += ys[i] * xs[i] ** r; }
  for (let c = 0; c < m; c++) { let p = c; for (let r = c + 1; r < m; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; for (let r = 0; r < m; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= m; k++) A[r][k] -= f * A[c][k]; } }
  const w = A.map((row, i) => row[m] / row[i]);
  return (x) => w.reduce((s, wi, i) => s + wi * x ** i, 0);
}
export function ensemble(M = 5) {
  const R = rng(1), gauss = () => Math.sqrt(-2 * Math.log(R() + 1e-12)) * Math.cos(2 * Math.PI * R());
  const xs = [], ys = [];
  for (let i = 0; i < 24; i++) { const x = -1 + 2 * R(); xs.push(x); ys.push(trueDelta(x) + 0.01 * gauss()); }
  const models = [];
  for (let m = 0; m < M; m++) { const bx = [], by = []; for (let i = 0; i < xs.length; i++) { const j = Math.floor(R() * xs.length); bx.push(xs[j]); by.push(ys[j]); } models.push(polyfit(bx, by, 3)); }
  const roll = (f, s0, T) => { const o = [s0]; for (let t = 0; t < T; t++) o.push(o[t] + f(o[t])); return o; };
  return { xs, ys, models, roll };
}
function ensembleFig() {
  const { xs, ys, models } = ensemble();
  const sx = lin(-1.6, 3, 60, 520), sy = lin(-0.1, 0.5, 220, 40);
  let o = axes({ sx, sy, x0: -1.6, x1: 3, y0: -0.1, y1: 0.5, xt: [-1, 0, 1, 2, 3], yt: [0, 0.2, 0.4], xl: 'state s', grid: true });
  o += rect(sx(-1), sy(0.5), sx(1) - sx(-1), sy(-0.1) - sy(0.5), 'wash');
  o += text((sx(-1) + sx(1)) / 2, sy(0.5) + 16, 'data 覆盖的范围', 'ts', 'middle');
  const clip = (f) => (x) => { const v = f(x); return v > 0.5 || v < -0.1 ? NaN : v; };
  for (const m of models) o += path(curve(clip(m), -1.6, 3, sx, sy), 'mute');
  o += path(curve(trueDelta, -1.6, 3, sx, sy), 'ink-b');
  for (let i = 0; i < xs.length; i++) o += circle(sx(xs[i]), sy(ys[i]), 3, 'ink-f');
  const spread = (x) => { const v = models.map((m) => m(x)); return Math.max(...v) - Math.min(...v); };
  o += text(sx(1.55), sy(0.47), '5 个 model 在这里各说各话', 'ts', 'start');
  o += text(64, 274, `纵轴是一步的位移 s' − s。粗线是真的 dynamics，灰线是 5 个 bootstrap 的 cubic fit。`, 'ts');
  o += text(64, 290, `5 个 model 的最大分歧：s = 0 处 ${spread(0).toFixed(3)}，s = 1.5 处 ${spread(1.5).toFixed(3)}，s = 2 处 ${spread(2).toFixed(2)}。`, 'ts');
  return svg(560, 298, o, '五个 model 在 data 覆盖的 s 从 −1 到 1 之间几乎重合，离开这个范围后迅速分开。');
}
function branchA() {
  const { models, roll } = ensemble();
  const T = 25, dur = 10;
  const sx = lin(0, T, 70, 520), sy = lin(-1.2, 6, 222, 50);
  let o = axes({ sx, sy, x0: 0, x1: T, y0: -1.2, y1: 6, xt: [0, 5, 10, 15, 20, 25], yt: [-1, 0, 1, 2, 4, 6], xl: 'rollout 步数 t', grid: true });
  o += rect(sx(0), sy(1), sx(T) - sx(0), sy(-1) - sy(1), 'wash');
  o += text(sx(T) - 4, sy(-1) - 6, 'data 覆盖的 state', 'ts', 'end');
  const truth = roll(trueDelta, -1, T);
  const mr = models.map((m) => roll(m, -1, T));
  const clipY = (v) => Math.max(-1.2, Math.min(6, v));
  // 第一帧是完整的图（静态截图看到的样子），然后从 t = 0 重新画
  const kt = [0]; for (let t = 0; t <= T; t++) kt.push(0.2 + 0.7 * t / T); kt.push(1);
  const prefix = (arr) => { const ds = []; for (let t = 0; t <= T; t++) ds.push(d(arr.slice(0, t + 1).map((v, i) => [sx(i), sy(clipY(v))]).concat(t === 0 ? [[sx(0) + 0.1, sy(clipY(arr[0]))]] : []))); return [ds[T], ...ds, ds[T]]; };
  for (const r of mr) o += apath(prefix(r), kt, dur, 'mute', true);
  o += apath(prefix(truth), kt, dur, 'ink-b', true);
  // 从 data 里的 state 出发的 3 步 branch（静态，始终显示）
  for (const [t0, s0] of [[2, -0.6], [6, -0.1], [10, 0.45]]) {
    for (const m of models) { const r = roll(m, s0, 3); o += path(d(r.map((v, i) => [sx(t0 + i), sy(v)])), 'ln'); }
    o += circle(sx(t0), sy(s0), 3.5, 'ln-f');
  }
  const sp = (t) => { const v = mr.map((r) => r[t]); return Math.max(...v) - Math.min(...v); };
  o += text(74, 22, '灰线：5 个 model 各自从 s = −1 rollout 25 步；粗线：真实的 trajectory', 'ts');
  o += text(74, 36, '彩色短线：从 data 里的 state 出发的 3 步 branch', 'ts');
  o += text(74, 276, `5 个 model 的分歧：t = 10 时 ${sp(10).toFixed(3)}，t = 20 时 ${sp(20).toFixed(2)}，t = 25 时 ${sp(25).toFixed(2)}`, 'ts');
  o += text(74, 292, '真实的 s 在 t = 14 左右离开 data 覆盖的范围', 'ts');
  return svgA(560, 300, o, '动图：五个 model 从同一个初始 state 往前 rollout，前几步与真实 trajectory 重合，离开 data 覆盖的范围后迅速分开；从 data 里的 state 出发的 3 步 branch 始终重合。');
}
function horizon() {
  const x0 = 40, w = 52, y = 96;
  let o = '';
  for (let s = 0; s <= 8; s++) { o += rect(x0 + w * s, y - 18, w, 36, s === 2 || s === 8 ? 'wash' : 'paper'); o += text(x0 + w * s + w / 2, y + 5, String(s), 'ts', 'middle'); }
  const cx = (s) => x0 + w * s + w / 2;
  o += text(cx(2), y - 26, 'r = +1，结束', 'ts', 'middle') + text(cx(8), y - 26, 'r = +10，结束', 'tl', 'middle');
  o += circle(cx(3), y + 34, 6, 'ink-f') + text(cx(3), y + 54, 'start', 'ts', 'middle');
  // H = 3 的窗口
  o += rect(x0 + w * 0, y + 66, w * 7, 22, 'wash2', 4);
  o += text(cx(3), y + 81, 'H = 3 看得到的范围：0 到 6', 'ts', 'middle');
  const g = 0.9, left = 1, right3 = 0, right3V = g ** 3 * (g * 10);
  o += arrow(cx(3) - 8, y + 34, cx(2) + 10, y + 34, 'ink');
  o += arrow(cx(3) + 8, y + 34, cx(6) - 10, y + 34, 'ln');
  o += text(40, 210, `只看 H = 3 步的 reward：向左 ${left}，向右 ${right3}，选向左。`, 'ts');
  o += text(40, 228, `加上 terminal value V̂(6) = 0.9 × 10 = 9：向右 0.9³ × 9 = ${right3V.toFixed(3)}，选向右。`, 'ts');
  return svg(560, 240, o, '9 个 state 的 chain，从 3 出发，state 2 有 +1，state 8 有 +10。horizon 为 3 的 planner 看不到 8，选了左边；加上 terminal value 后选右边。');
}

// ================= Meta-RL：hallway 与 sign =================
function hallwayA() {
  const sx = lin(-6, 6, 50, 510);
  const rows = [
    { y: 84, lab: 'posterior sampling：先猜 −6，猜错再去 +6', path: [0, -6, 6] },
    { y: 200, lab: '先去 −2 读 sign，再直接去 +6', path: [0, -2, 6] },
  ];
  // 每一步 0.25 秒
  const sp = 0.25;
  const lens = rows.map((r) => r.path.slice(1).reduce((s, p, i) => s + Math.abs(p - r.path[i]), 0));
  const dur = sp * Math.max(...lens) + 2.5;
  let o = '';
  for (const r of rows) {
    o += rect(sx(-6) - 14, r.y - 12, sx(6) - sx(-6) + 28, 24, 'paper', 4);
    for (let p = -6; p <= 6; p++) o += line(sx(p), r.y + 12, sx(p), r.y + 16, 'axis');
    o += text(sx(-6), r.y + 30, '−6', 'ts', 'middle') + text(sx(6), r.y + 30, '+6', 'ts', 'middle') + text(sx(0), r.y + 30, '0', 'ts', 'middle') + text(sx(-2), r.y + 30, '−2', 'ts', 'middle');
    o += rect(sx(-2) - 9, r.y - 28, 18, 12, 'wash-strong', 2) + text(sx(-2), r.y - 33, 'sign', 'ts', 'middle');
    o += rect(sx(6) - 10, r.y - 10, 20, 20, 'wash') + text(sx(6) + 18, r.y + 4, 'goal', 'tl');
    o += text(sx(-6) - 14, r.y - 52, r.lab, 'tb');
    // keyframes：按真实步数
    const xs = [], kt = [];
    let t = 0;
    xs.push(sx(r.path[0])); kt.push(0);
    for (let i = 1; i < r.path.length; i++) { t += sp * Math.abs(r.path[i] - r.path[i - 1]); xs.push(sx(r.path[i])); kt.push(t / dur); }
    xs.push(xs[xs.length - 1]); kt.push(1);
    o += acircle(xs, xs.map(() => r.y), kt, dur, 7, 'ink-f');
  }
  o += text(50, 262, `goal 在 +6 这一次：上面走 6 + 12 = ${lens[0]} 步，下面走 2 + 8 = ${lens[1]} 步。`, 'ts');
  o += text(50, 280, 'goal 在 −6 时两者分别是 6 步和 2 + 4 = 6 步。平均：12 步对 8 步。', 'ts');
  return svgA(560, 290, o, '动图：一条 hallway，从 0 出发，goal 在 −6 或 +6 之一，−2 处有一个写着 goal 在哪边的 sign。这一次 goal 在 +6。上面的 agent 先猜 −6，走了 18 步；下面的 agent 先去读 sign，只走 10 步。');
}

// ================= RL for VLA：DSRL 与 EXPO =================
// base policy：两个 mode（±1，σ = 0.1）上训练好的 flow matching policy，a = f(z) 是它的 ODE map
export function flowMap(z, sigma = 0.1, n = 200) {
  let x = z;
  for (let k = 0; k < n; k++) {
    const tau = k / n, V = tau * tau * sigma * sigma + (1 - tau) ** 2, c = (tau * sigma * sigma - (1 - tau)) / V;
    let num = 0, den = 0;
    for (const m of [-1, 1]) { const w = Math.exp(-((x - tau * m) ** 2) / (2 * V)); num += w * (m + c * (x - tau * m)); den += w; }
    x += num / den / n;
  }
  return x;
}
export const Qvla = (a) => Math.exp(-((a - 1.45) ** 2) / (2 * 0.2 * 0.2));
function dsrl() {
  const sz = lin(-3, 3, 60, 300), sa = lin(-1.6, 1.8, 230, 40);
  let o = axes({ sx: sz, sy: sa, x0: -3, x1: 3, y0: -1.6, y1: 1.8, xt: [-3, -2, -1, 0, 1, 2, 3], yt: [-1, 0, 1], xl: 'noise z', grid: true });
  o += text(64, 24, 'base VLA 的 action head：a = f(z)', 'tb');
  o += path(curve((z) => flowMap(z), -3, 3, sz, sa, 160), 'ink-b');
  o += rect(sz(1), sa(1.8), sz(3) - sz(1), sa(-1.6) - sa(1.8), 'wash');
  o += text(sz(2), sa(-1.2), 'DSRL 的 latent', 'ts', 'middle') + text(sz(2), sa(-1.2) + 14, 'policy 选这一段', 'ts', 'middle');
  // 右：Q(a)
  const sq = lin(0, 1, 330, 420);
  o += line(330, sa(-1.6), 330, sa(1.8), 'axis');
  const qpts = []; for (let i = 0; i <= 120; i++) { const a = -1.6 + 3.4 * i / 120; qpts.push([sq(Qvla(a)), sa(a)]); }
  o += path(d(qpts), 'ln') + text(336, 24, 'Q(s, a)', 'tl');
  o += text(sq(1) + 4, sa(1.45) + 4, 'a = 1.45', 'ts');
  const f3 = flowMap(3), f1v = flowMap(1);
  o += line(330, sa(f3), sq(Qvla(f3)), sa(f3), 'dash');
  // EXPO 的 edit
  o += arrow(470, sa(f1v), 470, sa(1.45), 'ln') + circle(470, sa(f1v), 4, 'ink-f');
  o += text(480, sa(f1v) + 4, 'base 的 a', 'ts') + text(480, sa(1.45) - 4, 'edit 之后', 'ts');
  o += text(458, sa(-0.2), 'EXPO：', 'tb') + text(458, sa(-0.2) + 16, '加一个小 δ', 'ts');
  o += text(64, 284, `f 只把 z 映到两个 mode 附近。z 最大取到 3 时 a = ${f3.toFixed(3)}，Q = ${Qvla(f3).toFixed(3)}；Q 的峰在 a = 1.45，`, 'ts');
  o += text(64, 300, `不在 base policy 的 support 里。从 z = 1（a = ${f1v.toFixed(3)}，Q = ${Qvla(f1v).toFixed(3)}）edit 上去就到得了。`, 'ts');
  return svg(560, 310, o, '左边是 flow policy 的 noise 到 action 的映射，几乎是阶梯形，只把 noise 映到正负 1 附近；右边是 Q 在 a 等于 1.45 处最高。DSRL 只能在 f 的值域里选，EXPO 可以把 action 往上 edit。');
}

export default {
  'cs224r-stitch': stitch,
  'cs224r-awac': awacA,
  'cs224r-classifier': classifier,
  'cs224r-vice': viceA,
  'cs224r-ensemble': ensembleFig,
  'cs224r-branch': branchA,
  'cs224r-horizon': horizon,
  'cs224r-chain': chain,
  'cs224r-her': herA,
  'cs224r-hercurve': herCurve,
  'cs224r-hallway': hallwayA,
  'cs224r-dsrl': dsrl,
};
