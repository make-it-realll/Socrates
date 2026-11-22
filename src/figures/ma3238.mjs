import { svg, svgA, anim, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes } from '../lib/svg.mjs';
const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;

// ---------- 小工具 ----------
function mulberry32(a) {
  return function () { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const expo = (rnd, rate) => -Math.log(1 - rnd()) / rate;
function head(x, y, fx, fy, cls, size = 7) {
  const a = Math.atan2(y - fy, x - fx);
  const p = (ang) => [x - size * Math.cos(a + ang), y - size * Math.sin(a + ang)];
  return poly([[x, y], p(0.42), p(-0.42)], cls + '-f');
}
// 圆 A 到圆 B 的弯箭头，bend > 0 向左弯；返回 label 位置
function bent(ax, ay, bx, by, r, bend, cls) {
  const mx = (ax + bx) / 2, my = (ay + by) / 2, L = Math.hypot(bx - ax, by - ay);
  const nx = -(by - ay) / L, ny = (bx - ax) / L;
  const cx = mx + bend * nx, cy = my + bend * ny;
  const s = Math.atan2(cy - ay, cx - ax), e = Math.atan2(cy - by, cx - bx);
  const x1 = ax + r * Math.cos(s), y1 = ay + r * Math.sin(s), x2 = bx + r * Math.cos(e), y2 = by + r * Math.sin(e);
  return { o: path(`M${f1(x1)} ${f1(y1)}Q${f1(cx)} ${f1(cy)} ${f1(x2)} ${f1(y2)}`, cls) + head(x2, y2, cx, cy, cls), lx: 0.25 * x1 + 0.5 * cx + 0.25 * x2, ly: 0.25 * y1 + 0.5 * cy + 0.25 * y2 };
}
const node = (x, y, r, s, cls = 'paper') => circle(x, y, r, cls) + text(x, y + 5, s, 'tb', 'middle');
// 把一组时刻（秒）变成去重、排序后的 key time
// 只在若干 [a, b) 区间（秒）里显示：每个元素用自己的短 keyTimes，文件不会膨胀
function showOn(ivs, T) {
  const ev = new Map();
  const inside = (x) => ivs.some(([a, b]) => x >= a && x < b);
  const pts = [0]; ivs.forEach(([a, b]) => { pts.push(a, b); });
  [...new Set(pts)].filter((x) => x >= 0 && x < T).sort((a, b) => a - b).forEach((x) => ev.set(x, inside(x)));
  const ks = [...ev.keys()];
  return ashow(ks.map((x) => ev.get(x)), ks.map((x) => x / T), T);
}
const keyline = (set, T) => { const tl = [...set].filter((x) => x >= 0 && x <= T).sort((a, b) => a - b); return { tl, kt: tl.map((x) => x / T) }; };

// ---------- 开头 / 第 1 站：从 1 出发，往右的 probability 0.6，0 是 absorbing ----------
function escape() {
  const P = 0.6, R = 6, RUNS = 10;
  const rnd = mulberry32(11), runs = [];
  for (let j = 0; j < RUNS; j++) {
    let x = 1; const p = [1];
    while (x > 0 && x <= R) { x += rnd() < P ? 1 : -1; p.push(x); }
    runs.push(p);
  }
  const MAXS = Math.max(...runs.map((p) => p.length - 1));
  const fate = runs.map((p) => (p[p.length - 1] === 0 ? 'hit' : 'away'));
  const nx = (i) => 40 + i * 62, NY = 46;
  const sy = lin(0, MAXS, 96, 300);
  const step = 0.09, gapT = 0.6, hold = 3.2;
  const start = []; let t = hold;
  runs.forEach((p) => { start.push(t); t += step * (p.length - 1) + gapT; });
  const T = t + 0.4;
  const keys = new Set([0, hold, T]);
  runs.forEach((p, j) => { for (let k = 0; k < p.length; k++) keys.add(start[j] + step * k); keys.add(start[j] + step * (p.length - 1) + gapT); });
  const { tl, kt } = keyline(keys, T);
  const at = (fn) => tl.map(fn);
  const end = runs.map((p, j) => start[j] + step * (p.length - 1) + gapT);
  const done = (j, x) => x < hold || x >= end[j];
  const live = (j, x) => x >= hold && x >= start[j] && x < end[j];
  const stepAt = (j, x) => Math.min(Math.floor((x - start[j]) / step + 1e-9), runs[j].length - 1);
  let o = '';
  // chain 本身
  for (let i = 0; i <= R; i++) {
    o += arrow(nx(i) + 16, NY - 6, nx(i + 1) - 16, NY - 6, i === 0 ? 'mute' : 'ink', 5);
    if (i > 0) o += arrow(nx(i + 1) - 16, NY + 6, nx(i) + 16, NY + 6, 'ink', 5);
  }
  o += arrow(nx(1) + 16, NY + 6, nx(0) + 16, NY + 6, 'ink', 5);
  o += text((nx(1) + nx(2)) / 2, NY - 13, '0.6', 'ts', 'middle') + text((nx(1) + nx(2)) / 2, NY + 22, '0.4', 'ts', 'middle');
  o += line(nx(R + 1) + 16, NY, nx(R + 1) + 30, NY, 'dash') + text(nx(R + 1) + 40, NY + 4, '…', 'tb', 'middle');
  for (let i = 0; i <= R + 1; i++) o += node(nx(i), NY, 15, String(i), i === 0 ? 'wash-strong' : i === R + 1 ? 'wash' : 'paper');
  o += text(nx(R + 1), NY - 22, '到 7 就停止模拟', 'ts', 'middle');
  o += text(nx(0), NY - 22, 'absorbing', 'ts', 'middle');
  // 下面：每一次的 path，横轴就是上面的 state，往下是 step
  o += line(18, sy(0), 18, sy(MAXS), 'axis') + text(14, sy(0) + 4, '0', 'ts', 'end') + text(14, sy(MAXS) + 4, String(MAXS), 'ts', 'end');
  o += text(22, sy(MAXS / 2), 'step', 'ts', 'start');
  for (let i = 0; i <= R + 1; i++) o += line(nx(i), sy(0), nx(i), sy(MAXS), 'grid');
  const X = (v) => nx(v);
  runs.forEach((p, j) => {
    const off = 1.4 * (j - (RUNS - 1) / 2);
    const last = p[p.length - 1], endMark = last === 0 ? circle(nx(0) + off, sy(p.length - 1), 4.5, 'ln-f') : poly([[X(last) + off, sy(p.length - 1) + 7], [X(last) + off - 5, sy(p.length - 1) - 1], [X(last) + off + 5, sy(p.length - 1) - 1]], 'ink-f');
    o += `<g>${path(d(p.map((v, k) => [X(v) + off, sy(k)])), 'mute')}${endMark}${showOn([[0, hold], [end[j], T + 1]], T)}</g>`;
    // 正在走的这一次：用一个往下长的 clip 把 path 一步一步露出来
    const y0 = sy(0) - 4, y1 = sy(p.length - 1) + 4, s0 = start[j], s1 = start[j] + step * (p.length - 1);
    const hk = [0, s0 / T, s1 / T, 1], hv = [0.01, 0.01, y1 - y0, y1 - y0];
    o += `<clipPath id="ma3238-esc${j}"><rect x="0" y="${f1(y0)}" width="560" height="0.01">${anim('height', hv.map(f1), hk, T)}</rect></clipPath>`;
    o += `<path d="${d(p.map((v, k) => [X(v), sy(k)]))}" class="ln" clip-path="url(#ma3238-esc${j})">${showOn([[s0, end[j]]], T)}</path>`;
  });
  // token 在 chain 上走
  const cur = (x) => runs.findIndex((p, j) => live(j, x));
  const tx = at((x) => { const j = cur(x); if (j < 0) return f1(nx(1)); const v = runs[j][stepAt(j, x)]; return f1(nx(v)); });
  o += `<circle cx="${tx[0]}" cy="${NY}" r="7" class="ln-f">${anim('cx', tx, kt, T, true)}${ashow(at((x) => cur(x) >= 0), kt, T)}</circle>`;
  // 计数
  const cnt = (a) => { const w = fate.slice(0, a).filter((f) => f === 'hit').length; return text(40, 326, `跑完 ${a} 次：${w} 次落进 0（圆点），${a - w} 次走到了 7（三角）`, 'tb', 'start'); };
  o += `<g>${cnt(RUNS)}${showOn([[0, hold], [end[RUNS - 1], T + 1]], T)}</g>`;
  for (let a = 0; a < RUNS; a++) o += `<g>${cnt(a)}${showOn([[a ? end[a - 1] : hold, end[a]]], T)}</g>`;
  o += text(40, 346, 'First-step equations 同时允许 h₁ = 1 和 h₁ = 2/3，真实的值是 2/3（第 1 站）', 'ts', 'start');
  return svgA(560, 354, o, `动图：state 0 到 7 排成一行的 random walk，向右的 probability 0.6，0 是 absorbing，到 7 就停止模拟。从 1 出发跑 10 次，每次的 path 画在 chain 下方，往下是 step；${fate.filter((f) => f === 'hit').length} 次落进 0，其余走到 7`);
}

// ---------- 第 1 站：一族 nonnegative solution，iteration 从下面爬向 minimal 的那个 ----------
function minimal() {
  const sx = lin(0, 10, 60, 400), sy = lin(0, 1.6, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 10, y0: 0, y1: 1.6, xt: [0, 2, 4, 6, 8, 10], yt: [0, 0.5, 1, 1.5], grid: true, xl: 'state i' });
  o += text(60, 18, 'hᵢ = a + (1 − a)(2/3)' + sup('i') + '，h₀ = 1', 'tb', 'start');
  const fam = [[1.5, 'mute', 'a = 1.5'], [1, 'ink', 'a = 1'], [0.5, 'mute', 'a = 0.5'], [0, 'ln', 'a = 0（minimal）']];
  for (const [a, cls, lab] of fam) {
    const pts = []; for (let i = 0; i <= 10; i++) pts.push([sx(i), sy(a + (1 - a) * (2 / 3) ** i)]);
    o += path(d(pts), cls);
    for (const [x, y] of pts) o += circle(x, y, 2.6, cls === 'ln' ? 'ln-f' : cls === 'ink' ? 'ink-f' : 'mute-f');
    const yy = a + (1 - a) * (2 / 3) ** 10;
    o += text(sx(10) + 8, sy(yy) + 4, lab, cls === 'ln' ? 'tl' : 'ts', 'start');
  }
  // iteration：P_i(H ≤ n)
  const M = 300, iter = (n) => { let v = new Array(M).fill(0); v[0] = 1; for (let k = 0; k < n; k++) { const w = new Array(M).fill(0); w[0] = 1; for (let i = 1; i < M - 1; i++) w[i] = 0.4 * v[i - 1] + 0.6 * v[i + 1]; v = w; } return v; };
  for (const n of [3, 10, 50]) {
    const v = iter(n);
    for (let i = 1; i <= 10; i++) o += rect(sx(i) - 2.5, sy(v[i]) - 2.5, 5, 5, 'paper');
  }
  o += text(sx(4.3), sy(0.36), '方块：每个 i 上从下到上是 n = 3, 10, 50', 'ts', 'start');
  o += text(60, 300, '方块是从 h⁽⁰⁾ = 1{i = 0} 开始 iterate 第 n 次的结果 Pᵢ(H ≤ n)。它们从下面逼近 a = 0，', 'ts', 'start');
  o += text(60, 316, '永远不会越过它，也就不会跑到 a = 0.5、a = 1 那几条去。', 'ts', 'start');
  return svg(560, 322, o, 'p 等于 0.6 的 random walk 上，first-step equations 的一族 nonnegative solution：a 等于 0、0.5、1、1.5 四条。从 0 开始 iterate 得到的 P_i(H 小于等于 n) 在 n 等于 3、10、50 时从下方逼近 a 等于 0 那条');
}

// ---------- 第 2 站：一次 excursion 里每个 level 被访问几次 ----------
function cycle() {
  const rnd = mulberry32(7);
  const excursion = () => { const p = [0]; let x = 0; do { x = rnd() < 0.4 ? x + 1 : Math.max(x - 1, 0); p.push(x); } while (x !== 0); return p; };
  // 找一个长一点、能看清的 excursion
  let ex; do ex = excursion(); while (ex.length < 18 || ex.length > 30 || Math.max(...ex) < 3 || Math.max(...ex) > 5);
  const sx = lin(0, 30, 50, 330), sy = lin(0, 5, 230, 50);
  let o = axes({ sx, sy, x0: 0, x1: 30, y0: 0, y1: 5, xt: [0, 10, 20, 30], yt: [0, 1, 2, 3, 4, 5], xl: 'time n', grid: true });
  o += text(50, 22, `一次 excursion：从 0 出发，第 ${ex.length - 1} 步回到 0`, 'tb', 'start');
  o += path(d(ex.map((v, n) => [sx(n), sy(v)])), 'ink');
  ex.forEach((v, n) => { if (n < ex.length - 1) o += circle(sx(n), sy(v), 3.6, 'ln-f'); });
  o += circle(sx(ex.length - 1), sy(0), 4.2, 'paper');
  o += text(sx(ex.length - 1) + 8, sy(0) - 8, '回到 0，不算', 'ts', 'start');
  const cnt = [0, 0, 0, 0, 0, 0]; ex.slice(0, -1).forEach((v) => { if (v <= 5) cnt[v]++; });
  // 右边：10 万次 excursion 的平均访问次数 vs (2/3)^i
  const N = 100000, tot = [0, 0, 0, 0, 0, 0];
  for (let k = 0; k < N; k++) { const e = excursion(); e.slice(0, -1).forEach((v) => { if (v <= 5) tot[v]++; }); }
  const bx = lin(0, 1.05, 400, 540);
  o += text(400, 22, '每个 level 的访问次数', 'tb', 'start');
  for (let i = 0; i <= 5; i++) {
    const y = sy(i);
    o += text(392, y + 4, String(i), 'ts', 'end');
    o += rect(400, y - 7, bx(tot[i] / N) - 400, 14, 'wash');
    o += line(bx((2 / 3) ** i), y - 10, bx((2 / 3) ** i), y + 10, 'ink-b');
    o += text(bx(1.05), y + 4, `${cnt[i]} | ${(tot[i] / N).toFixed(3)}`, 'ts', 'end');
  }
  o += text(400, 266, '左：这一次的次数', 'ts', 'start') + text(400, 282, '右：10⁵ 次的平均', 'ts', 'start');
  o += text(400, 298, '竖线：γ⁰ᵢ = (2/3)' + sup('i'), 'ts', 'start');
  o += text(50, 282, '圆点是 n = 0, 1, …, T₀ − 1 时所在的 level，', 'ts', 'start') + text(50, 298, '每个 level 上的圆点个数就是这次对它的访问次数。', 'ts', 'start');
  return svg(560, 306, o, 'Reflecting random walk（向上 0.4）的一次 excursion 和每个 level 的访问次数；右边 10 万次 excursion 的平均访问次数与 2/3 的 i 次方对齐');
}

// ---------- 第 3 站：Poisson arrivals，thinning 成两路 ----------
function poisson() {
  const lam = 2, pw = 0.25, TT = 6, rnd = mulberry32(2024);
  const arr = []; let s = 0;
  for (;;) { s += expo(rnd, lam); if (s > TT) break; arr.push({ t: s, w: rnd() < pw }); }
  const sx = lin(0, TT, 50, 470);
  const nTot = arr.length, nW = arr.filter((a) => a.w).length;
  const sy = lin(0, Math.max(nTot, 14), 262, 120);
  const speed = 1.5, hold = 3, T = hold + TT * speed + 1.5;
  const tc = (x) => hold + x * speed; // 过程时刻 → 动画秒
  const keys = new Set([0, hold - 0.001, hold, T, tc(TT)]);
  arr.forEach((a) => keys.add(tc(a.t)));
  const { tl, kt } = keyline(keys, T);
  const seen = (x, tt) => x < hold || x >= tc(tt);
  let o = text(50, 18, `λ = 2 per minute；每个 arrival 以 1/4 的 probability 是 write（实心）`, 'tb', 'start');
  // timeline
  const TY = 56;
  o += line(sx(0), TY, sx(TT), TY, 'axis');
  for (let m = 0; m <= TT; m++) o += line(sx(m), TY - 4, sx(m), TY + 4, 'axis') + text(sx(m), TY + 18, String(m), 'ts', 'middle');
  o += text(sx(TT), TY + 34, 'minute', 'ts', 'end');
  arr.forEach((a) => {
    o += `<circle cx="${f1(sx(a.t))}" cy="${TY}" r="5" class="${a.w ? 'ln-f' : 'paper'}">${ashow(tl.map((x) => seen(x, a.t)), kt, T)}</circle>`;
  });
  // staircases
  const stair = (pts) => { const q = [[sx(0), sy(0)]]; let c = 0; pts.forEach((tt) => { q.push([sx(tt), sy(c)]); c++; q.push([sx(tt), sy(c)]); }); q.push([sx(TT), sy(c)]); return d(q); };
  o += axes({ sx, sy, x0: 0, x1: TT, y0: 0, y1: Math.max(nTot, 14), xt: [], yt: [0, 5, 10, 14], grid: true });
  const cw = tl.map((x) => f1(x < hold ? sx(TT) - sx(0) + 2 : Math.max(0.01, sx(Math.min((x - hold) / speed, TT)) - sx(0))));
  o += `<clipPath id="ma3238-pclip"><rect x="${sx(0) - 1}" y="100" height="170" width="${cw[0]}">${anim('width', cw, kt, T)}</rect></clipPath>`;
  o += `<g clip-path="url(#ma3238-pclip)">${path(stair(arr.map((a) => a.t)), 'ink-b')}${path(stair(arr.filter((a) => a.w).map((a) => a.t)), 'ln')}</g>`;
  o += text(sx(TT) + 6, sy(nTot) + 4, `N(t)，共 ${nTot}`, 'ts', 'start');
  o += text(sx(TT) + 6, sy(nW) + 4, `N₁(t)，${nW}`, 'tl', 'start');
  o += text(56, 112, '按 rate：N(6) 的 mean 12，N₁(6) 的 mean 3', 'ts', 'start');
  // cursor
  const cx = tl.map((x) => f1(x < hold ? sx(TT) : sx(Math.min((x - hold) / speed, TT))));
  for (const [ya, yb] of [[TY - 12, TY + 8], [sy(Math.max(nTot, 14)), sy(0)]]) o += `<line x1="${cx[0]}" y1="${f1(ya)}" x2="${cx[0]}" y2="${f1(yb)}" class="dash">${anim('x1', cx, kt, T)}${anim('x2', cx, kt, T)}</line>`;
  return svgA(560, 292, o, `动图：rate 2 per minute 的 Poisson process 在 6 分钟里来了 ${nTot} 个 arrival，其中 ${nW} 个被标成 write。上面是 timeline 上的点，下面是 N(t) 和只数 write 的 N1(t) 两条 staircase，随时间画出来`);
}

// ---------- 第 4 站：三个 state 的 continuous-time chain ----------
const Q3 = [[-2, 1, 1], [1, -1, 0], [2, 1, -3]];
function ctmc() {
  const rnd = mulberry32(31), TT = 40;
  const jumps = [{ t: 0, x: 0 }]; let x = 0, s = 0;
  for (;;) {
    const qx = -Q3[x][x]; s += expo(rnd, qx); if (s > TT) break;
    let u = rnd() * qx, y = -1; for (let j = 0; j < 3; j++) { if (j === x) continue; u -= Q3[x][j]; if (u <= 0) { y = j; break; } }
    if (y < 0) y = [0, 1, 2].filter((j) => j !== x && Q3[x][j] > 0).pop();
    x = y; jumps.push({ t: s, x });
  }
  const occ = (tt) => { const o = [0, 0, 0]; for (let k = 0; k < jumps.length; k++) { const a = jumps[k].t; if (a >= tt) break; const b = Math.min(k + 1 < jumps.length ? jumps[k + 1].t : TT, tt); o[jumps[k].x] += b - a; } return o.map((v) => v / tt); };
  const stateAt = (tt) => { let c = 0; for (const j of jumps) if (j.t <= tt) c = j.x; return c; };
  const speed = 0.4, hold = 3.4, T = hold + TT * speed + 1.4;
  const tc = (tt) => hold + tt * speed;
  const keys = new Set([0, hold - 0.001, hold, T, tc(TT)]);
  jumps.forEach((j) => keys.add(tc(j.t)));
  for (let tt = 0.5; tt < TT; tt += 0.5) keys.add(tc(tt));
  const { tl, kt } = keyline(keys, T);
  const proc = (sec) => (sec < hold ? TT : Math.min((sec - hold) / speed, TT));
  const pos = [[90, 62], [190, 222], [40, 222]];
  let o = '';
  const lab = (e, s, dx = 0, dy = 0) => text(e.lx + dx, e.ly + dy + 4, s, 'ts', 'middle');
  let e = bent(...pos[0], ...pos[1], 22, 22, 'ink'); o += e.o + lab(e, '1', 10, 2);
  e = bent(...pos[1], ...pos[0], 22, 22, 'ink'); o += e.o + lab(e, '1', 10, 2);
  e = bent(...pos[0], ...pos[2], 22, 14, 'ink'); o += e.o + lab(e, '1', -12, -4);
  e = bent(...pos[2], ...pos[0], 22, 14, 'ink'); o += e.o + lab(e, '2', 12, 4);
  e = bent(...pos[2], ...pos[1], 22, 0, 'ink'); o += e.o + text(115, 240, '1', 'ts', 'middle');
  ['1', '2', '3'].forEach((s, i) => { o += node(...pos[i], 22, s); });
  o += text(90, 26, 'holding rate q₁ = 2', 'ts', 'middle');
  o += text(190, 262, 'q₂ = 1', 'ts', 'middle') + text(40, 262, 'q₃ = 3', 'ts', 'middle');
  const tx = tl.map((sec) => f1(pos[stateAt(proc(sec))][0])), ty = tl.map((sec) => f1(pos[stateAt(proc(sec))][1]));
  o += `<circle cx="${tx[0]}" cy="${ty[0]}" r="27" class="ln" fill="none">${anim('cx', tx, kt, T, true)}${anim('cy', ty, kt, T, true)}</circle>`;
  // 右边：到时刻 t 为止，在每个 state 的时间比例
  const by = lin(0, 0.7, 230, 70), X0 = 330, BW = 44;
  o += text(X0 - 20, 26, '到时刻 t 为止，三个 state 各占的时间比例', 'tb', 'start');
  o += line(X0 - 10, by(0), X0 + 3 * 64, by(0), 'axis');
  const target = [3 / 8, 1 / 2, 1 / 8];
  for (let i = 0; i < 3; i++) {
    const xL = X0 + i * 64;
    const hs = tl.map((sec) => { const t = proc(sec); return t < 0.05 ? 0 : occ(t)[i]; });
    const H = hs.map((h) => f1(by(0) - by(h)));
    const Y = hs.map((h) => f1(by(h)));
    o += `<rect x="${xL}" y="${Y[0]}" width="${BW}" height="${H[0]}" class="wash">${anim('y', Y, kt, T)}${anim('height', H, kt, T)}</rect>`;
    o += line(xL - 4, by(target[i]), xL + BW + 4, by(target[i]), 'ink-b');
    o += text(xL + BW / 2, by(0) + 18, 'state ' + (i + 1), 'ts', 'middle');
    o += text(xL + BW / 2, by(target[i]) - 7, ['3/8', '1/2', '1/8'][i], 'ts', 'middle');
  }
  const ttxt = tl.map((sec) => proc(sec));
  // 时间读数：每个整数时刻换一次
  for (let m = 0; m <= TT; m += 2) {
    const iv = m === TT ? [[0, hold], [tc(TT), T + 1]] : [[tc(m), tc(m + 2)]];
    o += `<g>${text(X0 - 10, 266, `t = ${m}`, 'tb', 'start')}${showOn(iv, T)}</g>`;
  }
  const fin = occ(TT);
  o += text(X0 - 10, 286, `t = ${TT} 时：${fin.map((v) => v.toFixed(2)).join('、')}`, 'ts', 'start');
  o += text(X0 - 10, 304, '粗横线是 πQ = 0 的解 (3/8, 1/2, 1/8)', 'ts', 'start');
  return svgA(560, 310, o, `动图：三个 state 的 continuous-time Markov chain，箭头上是 rate。圈在 state 之间跳，每次停留 Exponential 长的时间；右边三根柱子是到时刻 t 为止各 state 占的时间比例，t 等于 40 时是 ${fin.map((v) => v.toFixed(2)).join('、')}，向 3/8、1/2、1/8 靠拢`);
}

// ---------- 第 4 站：P(t) 的第一行 ----------
function prow() {
  const sx = lin(0, 2.5, 60, 450), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2.5, y0: 0, y1: 1, xt: [0, 0.5, 1, 1.5, 2, 2.5], yt: [0, 0.25, 0.5, 0.75, 1], grid: true, xl: 't' });
  const f = [(t) => 3 / 8 + Math.exp(-2 * t) / 4 + 3 / 8 * Math.exp(-4 * t), (t) => 1 / 2 - Math.exp(-2 * t) / 2, (t) => 1 / 8 + Math.exp(-2 * t) / 4 - 3 / 8 * Math.exp(-4 * t)];
  const lim = [3 / 8, 1 / 2, 1 / 8], cls = ['ln', 'ink-b', 'ink'], nm = ['p₁₁(t)', 'p₁₂(t)', 'p₁₃(t)'];
  for (let j = 0; j < 3; j++) {
    o += line(sx(0), sy(lim[j]), sx(2.5), sy(lim[j]), 'dash');
    o += path(curve(f[j], 0, 2.5, sx, sy), cls[j]);
    o += text(sx(2.5) + 8, sy(f[j](2.5)) + 4, nm[j] + ' → ' + ['3/8', '1/2', '1/8'][j], j === 0 ? 'tl' : 'ts', 'start');
  }
  o += text(sx(0.2), sy(0.93), 'p₁₁(t) = 3/8 + ¼e' + sup('−2t') + ' + ⅜e' + sup('−4t'), 'ts', 'start');
  o += text(sx(0.95), sy(0.04), 'p₁₃ 先升后降：从 1 要先跳一次才到得了 3', 'ts', 'start');
  return svg(560, 266, o, '从 state 1 出发，p11、p12、p13 随 t 的变化，分别趋向 3/8、1/2、1/8');
}

// ---------- 第 5 站：M/M/1 queue ----------
function queue() {
  const lam = 0.8, mu = 1, TT = 150, rnd = mulberry32(8);
  const ev = [{ t: 0, n: 0 }]; let n = 0, s = 0;
  for (;;) {
    const rate = lam + (n > 0 ? mu : 0); s += expo(rnd, rate); if (s > TT) break;
    n += rnd() < lam / rate ? 1 : -1; ev.push({ t: s, n });
  }
  const nAt = (tt) => { let c = 0; for (const e of ev) if (e.t <= tt) c = e.n; return c; };
  let area = 0; for (let k = 0; k < ev.length; k++) area += ((k + 1 < ev.length ? ev[k + 1].t : TT) - ev[k].t) * ev[k].n;
  const avg = area / TT, nMax = Math.max(...ev.map((e) => e.n));
  const speed = 0.12, hold = 3.2, T = hold + TT * speed + 1.5;
  const tc = (tt) => hold + tt * speed, proc = (sec) => (sec < hold ? TT : Math.min((sec - hold) / speed, TT));
  const keys = new Set([0, hold - 0.001, hold, T, tc(TT)]); ev.forEach((e) => keys.add(tc(e.t)));
  const { tl, kt } = keyline(keys, T);
  const ivs = (pred) => { const r = []; if (pred(ev[ev.length - 1].n)) r.push([0, hold]); ev.forEach((e, k) => { if (pred(e.n)) r.push([tc(e.t), k + 1 < ev.length ? tc(ev[k + 1].t) : T + 1]); }); return r; };
  let o = text(30, 18, 'λ = 0.8 per minute 到达，μ = 1 per minute 服务（ρ = 0.8）', 'tb', 'start');
  // 上：server 和排着的人
  const SX = 470, SY = 40;
  o += rect(SX, SY, 60, 44, 'paper', 6) + text(SX + 30, SY + 62, 'server', 'ts', 'middle');
  o += arrow(30, SY + 22, 70, SY + 22, 'ink') + text(30, SY + 40, 'arrivals', 'ts', 'start');
  o += arrow(SX + 60, SY + 22, SX + 84, SY + 22, 'ink');
  const KM = Math.max(nMax, 12);
  for (let k = 1; k <= KM; k++) {
    const x = k === 1 ? SX + 18 : SX - 10 - (k - 1) * 28, y = SY + 10;
    if (k > 1 && x < 76) continue;
    const iv = ivs((m) => m >= k);
    if (!iv.length) continue;
    o += `<rect x="${f1(x)}" y="${y}" width="24" height="24" rx="3" class="${k === 1 ? 'solid' : 'wash-strong'}">${showOn(iv, T)}</rect>`;
  }
  o += text(SX - 12, SY - 6, '← queue', 'ts', 'end');
  // 读数
  for (let m = 0; m <= nMax; m++) {
    const iv = ivs((v) => v === m);
    if (!iv.length) continue;
    o += `<g>${text(SX + 30, SY + 80, `N(t) = ${m}`, 'tb', 'middle')}${showOn(iv, T)}</g>`;
  }
  // 下：N(t) 的 path
  const sx = lin(0, TT, 50, 530), sy = lin(0, Math.max(nMax, 10), 290, 150);
  o += axes({ sx, sy, x0: 0, x1: TT, y0: 0, y1: Math.max(nMax, 10), xt: [0, 30, 60, 90, 120, 150], yt: [0, 4, 8, 12], grid: true, xl: 'minute' });
  const pts = [[sx(0), sy(0)]]; ev.forEach((e, k) => { if (k) { pts.push([sx(e.t), sy(ev[k - 1].n)]); pts.push([sx(e.t), sy(e.n)]); } }); pts.push([sx(TT), sy(ev[ev.length - 1].n)]);
  const cw = tl.map((sec) => f1(sec < hold ? sx(TT) - sx(0) + 2 : Math.max(0.01, sx(proc(sec)) - sx(0))));
  o += `<clipPath id="ma3238-qclip"><rect x="${sx(0) - 1}" y="130" height="170" width="${cw[0]}">${anim('width', cw, kt, T)}</rect></clipPath>`;
  o += `<g clip-path="url(#ma3238-qclip)">${path(d(pts), 'ln')}</g>`;
  o += line(sx(0), sy(4), sx(TT), sy(4), 'dash') + text(sx(TT) + 4, sy(4) + 4, 'L = 4', 'ts', 'start');
  o += text(56, 142, `这 ${TT} 分钟里 N(t) 的 time average 是 ${avg.toFixed(2)}；long run 的值 ρ/(1 − ρ) = 4`, 'ts', 'start');
  return svgA(560, 328, o, `动图：M/M/1 queue，arrival rate 0.8，service rate 1。上面是 server 和排队的人，下面是 ${TT} 分钟里人数 N(t) 的 path，最多 ${nMax} 人，time average ${avg.toFixed(2)}`);
}

// ---------- 第 5 站：Little's law 的面积 ----------
function little() {
  const A = [0.5, 1.5, 2, 4.5], D = [2, 3, 3.5, 5.5];
  const sx = lin(0, 6, 60, 470), sy = lin(0, 4.6, 240, 40);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 0, y1: 4.6, xt: [0, 1, 2, 3, 4, 5, 6], yt: [0, 1, 2, 3, 4], xl: 'time', grid: true });
  for (let k = 0; k < 4; k++) {
    o += rect(sx(A[k]), sy(k + 1), sx(D[k]) - sx(A[k]), sy(k) - sy(k + 1), 'wash');
    o += text((sx(A[k]) + sx(D[k])) / 2, sy(k + 0.5) + 4, `W${'₁₂₃₄'[k]} = ${D[k] - A[k]}`, 'ts', 'middle');
  }
  const st = (xs) => { const q = [[sx(0), sy(0)]]; let c = 0; xs.forEach((t) => { q.push([sx(t), sy(c)]); c++; q.push([sx(t), sy(c)]); }); q.push([sx(6), sy(c)]); return d(q); };
  o += path(st(A), 'ink-b') + path(st(D), 'ln');
  o += text(sx(4.5) - 6, sy(4) - 8, 'A(t)：到达的累计数', 'ts', 'end');
  o += text(sx(5.5) + 6, sy(3.4), 'D(t)：离开的累计数', 'tl', 'start');
  o += text(480, 120, '两条线之间', 'ts', 'start') + text(480, 136, '竖着量是 N(t)', 'ts', 'start') + text(480, 152, '横着量是 Wₖ', 'ts', 'start');
  o += text(60, 292, '面积 = ∫₀⁶ N(t) dt = 1.5 + 1.5 + 1.5 + 1 = 5.5。除以 6 得 L；除以 4 个人得 W；4/6 是 λ。', 'ts', 'start');
  return svg(560, 300, o, '4 个 customer 的 arrival 累计曲线 A(t) 和 departure 累计曲线 D(t)，两者之间的面积由 4 条宽为各自 sojourn time 的横条组成，总面积 5.5');
}

// ---------- 第 5 站 :::wrong：两条队 vs 一条队两个 server ----------
function pool() {
  let o = '';
  const cust = (x, y, k) => { let s = ''; for (let i = 0; i < k; i++) s += rect(x - i * 18, y, 14, 14, 'wash-strong', 2); return s; };
  o += text(20, 18, '两条独立的队，各 λ = 0.9', 'tb', 'start');
  for (const [y, k] of [[34, 3], [74, 2]]) { o += cust(110, y, k) + rect(140, y - 6, 36, 26, 'paper', 4) + arrow(126, y + 7, 138, y + 7, 'ink', 5); }
  o += text(20, 128, '一条队，两个 server，λ = 1.8', 'tb', 'start');
  o += cust(110, 162, 4) + rect(150, 140, 36, 26, 'paper', 4) + rect(150, 180, 36, 26, 'paper', 4);
  o += arrow(126, 169, 148, 154, 'ink', 5) + arrow(126, 169, 148, 192, 'ink', 5);
  o += text(20, 236, '每个 server 都是 μ = 1，ρ = 0.9：', 'ts', 'start') + text(20, 252, '左上 W = 10，左下 W = 5.26', 'tl', 'start');
  const sx = lin(0, 1, 270, 520), sy = lin(0, 20, 236, 30);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 20, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt: [0, 5, 10, 15, 20], grid: true, xl: 'ρ' });
  o += text(272, 18, 'mean sojourn time W（单位 1/μ）', 'tb', 'start');
  o += path(curve((r) => 1 / (1 - r), 0, 0.95, sx, sy), 'ink-b') + path(curve((r) => 1 / (1 - r * r), 0, 0.975, sx, sy), 'ln');
  o += text(sx(0.93) - 6, sy(17), '1/(1 − ρ)', 'ts', 'end') + text(sx(0.9) + 6, sy(5.26) + 16, '1/(1 − ρ²)', 'tl', 'start');
  o += circle(sx(0.9), sy(10), 4, 'ink-f') + circle(sx(0.9), sy(1 / (1 - 0.81)), 4, 'ln-f');
  return svg(560, 272, o, '左边画两种安排：两条各自 arrival rate 0.9 的队，和一条 arrival rate 1.8、两个 server 的队。右边是 mean sojourn time 随 rho 的变化，分开时是 1 除以 1 减 rho，合并时是 1 除以 1 减 rho 平方，rho 等于 0.9 时分别是 10 和 5.26');
}

// ---------- 第 6 站：inspection paradox，residual life 的 sawtooth ----------
function inspect() {
  const rnd = mulberry32(19), TT = 80;
  const ren = []; let s = 0; while (s < TT) { s += rnd() < 0.5 ? 2 : 18; ren.push(s); }
  const sx = lin(0, TT, 40, 530), sy = lin(0, 18, 270, 136);
  let o = text(40, 18, 'Interval 以各 1/2 的 probability 是 2 或 18 分钟（mean 10）', 'tb', 'start');
  const TY = 56;
  o += line(sx(0), TY, sx(TT), TY, 'axis');
  let prev = 0;
  ren.forEach((r) => { const e = Math.min(r, TT); if (r - prev > 10) o += rect(sx(prev), TY - 9, sx(e) - sx(prev), 18, 'wash'); prev = r; });
  o += line(sx(0), TY - 10, sx(0), TY + 10, 'ink-b');
  ren.forEach((r) => { if (r <= TT) o += line(sx(r), TY - 10, sx(r), TY + 10, 'ink-b'); });
  // 随机的 inspection 时刻
  const ins = []; for (let k = 0; k < 12; k++) ins.push(rnd() * TT);
  let inLong = 0;
  ins.forEach((u) => { const k = ren.findIndex((r) => r > u); const a = k ? ren[k - 1] : 0; const long = ren[k] - a > 10; if (long) inLong++; o += poly([[sx(u), TY + 13], [sx(u) - 4, TY + 21], [sx(u) + 4, TY + 21]], long ? 'ln-f' : 'ink-f'); });
  o += text(sx(0), TY + 36, `12 个 uniform 的 inspection 时刻（三角）里 ${inLong} 个落在 18 分钟的 interval 里（浅底）`, 'ts', 'start');
  // sawtooth
  o += axes({ sx, sy, x0: 0, x1: TT, y0: 0, y1: 18, xt: [0, 20, 40, 60, 80], yt: [0, 5, 10, 18], grid: true, xl: 'minute' });
  const pts = []; prev = 0;
  ren.forEach((r) => { const e = Math.min(r, TT); pts.push([sx(prev), sy(r - prev)]); pts.push([sx(e), sy(r - e)]); prev = r; });
  o += path(d(pts), 'ln');
  o += line(sx(0), sy(8.2), sx(TT), sy(8.2), 'dash') + text(sx(TT) + 4, sy(8.2) + 4, '8.2', 'ts', 'start');
  o += line(sx(0), sy(5), sx(TT), sy(5), 'mute') + text(sx(TT) + 4, sy(5) + 4, '5', 'ts', 'start');
  o += text(sx(0) + 4, sy(18) - 8, 'Residual life Y(t)：从 t 到下一个 renewal 还要等多久', 'ts', 'start');
  return svg(560, 300, o, `Renewal interval 是 2 或 18 分钟的 renewal process。上面是 timeline，浅底是 18 分钟的 interval，12 个随机 inspection 时刻里 ${inLong} 个落在长 interval 里；下面是 residual life 的 sawtooth，time average 8.2，而不是 mean interval 的一半 5`);
}

// ---------- 第 7 站：stopped at 1 的 simple random walk ----------
function stopped() {
  const rnd = mulberry32(5), NM = 60, K = 12, paths = [];
  for (let j = 0; j < K; j++) { const p = [0]; let x = 0; for (let n = 1; n <= NM && x < 1; n++) { x += rnd() < 0.5 ? 1 : -1; p.push(x); } paths.push(p); }
  const lo = Math.min(...paths.flat());
  const sx = lin(0, NM, 50, 470), sy = lin(Math.min(lo, -10), 2, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: NM, y0: Math.min(lo, -10), y1: 2, xt: [0, 10, 20, 30, 40, 50, 60], yt: [-10, -5, 0, 1], grid: true, xl: 'n' });
  o += line(sx(0), sy(1), sx(NM), sy(1), 'ink-b') + text(sx(NM) + 6, sy(1) + 4, 'level 1：停', 'ts', 'start');
  paths.forEach((p) => {
    const hit = p[p.length - 1] === 1;
    o += path(d(p.map((v, n) => [sx(n), sy(v)])), hit ? 'mute' : 'ln');
    if (hit) o += circle(sx(p.length - 1), sy(1), 2.8, 'ink-f');
    else o += text(sx(NM) + 6, sy(p[p.length - 1]) + 4, `S = ${p[p.length - 1]}`, 'tl', 'start');
  });
  const nh = paths.filter((p) => p[p.length - 1] === 1).length;
  o += text(50, 22, `12 条 path，${nh} 条在 60 步内碰到 1 就停下；没停的已经走得很低`, 'tb', 'start');
  o += text(50, 294, '每个固定的 n，E[S' + sub('T∧n') + '] = 0：少数没停的 path 很负，抵消了大多数停在 1 的 path。', 'ts', 'start');
  return svg(560, 302, o, `Simple random walk 从 0 出发，碰到 1 就停。12 条 path 里 ${nh} 条在 60 步内停在 1，其余几条走到很负的位置`);
}

// ---------- 第 7 站：gambler's ruin 上的 martingale 1.5^S ----------
function ruinmart() {
  const nx = (i) => 70 + i * 105, NY = 70;
  let o = text(280, 20, '每局以 0.4 赢 1 美元、0.6 输 1 美元；0 和 4 是 absorbing', 'tb', 'middle');
  for (let i = 0; i < 4; i++) {
    if (i > 0) o += arrow(nx(i) + 22, NY - 7, nx(i + 1) - 22, NY - 7, 'ink', 6);
    if (i + 1 < 4) o += arrow(nx(i + 1) - 22, NY + 7, nx(i) + 22, NY + 7, 'ink', 6);
  }
  o += arrow(nx(1) - 22, NY + 7, nx(0) + 22, NY + 7, 'ink', 6) + arrow(nx(3) + 22, NY - 7, nx(4) - 22, NY - 7, 'ink', 6);
  o += text((nx(1) + nx(2)) / 2, NY - 15, '0.4', 'ts', 'middle') + text((nx(1) + nx(2)) / 2, NY + 26, '0.6', 'ts', 'middle');
  for (let i = 0; i <= 4; i++) {
    o += node(nx(i), NY, 20, String(i), i === 0 || i === 4 ? 'wash-strong' : i === 2 ? 'wash' : 'paper');
    o += text(nx(i), NY + 52, '1.5' , 't', 'middle').replace('</text>', sup(String(i)) + '</text>') + text(nx(i), NY + 72, (1.5 ** i).toFixed(i < 3 ? 2 : 4).replace(/\.?0+$/, ''), 'tb', 'middle');
  }
  o += text(nx(2), NY - 32, '起点', 'ts', 'middle');
  // 下面：2.25 在 1 和 5.0625 之间的位置
  const sx = lin(1, 5.0625, 70, 490), Y = 196;
  o += line(sx(1), Y, sx(5.0625), Y, 'ink-b');
  o += line(sx(1), Y - 7, sx(1), Y + 7, 'ink-b') + line(sx(5.0625), Y - 7, sx(5.0625), Y + 7, 'ink-b');
  o += text(sx(1), Y + 22, '1（停在 0）', 'ts', 'middle') + text(sx(5.0625), Y + 22, '5.0625（停在 4）', 'ts', 'middle');
  o += circle(sx(2.25), Y, 6, 'ln-f') + text(sx(2.25), Y - 14, '停下时的 expectation 仍是 1.5² = 2.25', 'tl', 'middle');
  o += line(sx(1), Y + 34, sx(2.25), Y + 34, 'mute') + text((sx(1) + sx(2.25)) / 2, Y + 50, '1.25', 'ts', 'middle');
  o += line(sx(1), Y + 60, sx(5.0625), Y + 60, 'mute') + text(sx(3.03), Y + 76, '4.0625', 'ts', 'middle');
  o += text(280, Y + 100, '2.25 落在两端之间的比例就是 h：h = 1.25 / 4.0625 = 4/13', 't', 'middle');
  return svg(560, 306, o, 'Gambler ruin 的 chain，state 0 到 4，每个 state 下面写着 1.5 的 x 次方：1、1.5、2.25、3.375、5.0625。下方的线段从 1 到 5.0625，从 2 出发的 expectation 2.25 落在其中 1.25 比 4.0625 的位置，给出 h 等于 4/13');
}

export default {
  'ma3238-escape': escape,
  'ma3238-minimal': minimal,
  'ma3238-cycle': cycle,
  'ma3238-poisson': poisson,
  'ma3238-ctmc': ctmc,
  'ma3238-prow': prow,
  'ma3238-queue': queue,
  'ma3238-little': little,
  'ma3238-pool': pool,
  'ma3238-inspect': inspect,
  'ma3238-stopped': stopped,
  'ma3238-ruinmart': ruinmart,
};
