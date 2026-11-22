import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, anim, ashow, f1, sub } from '../lib/svg.mjs';

// ---------- 共用：MA3252 第 6 站的 network，这里求的是到 t 的 cost-to-go ----------
const ARCS = [['s', 'a', 4], ['s', 'b', 1], ['b', 'a', 2], ['a', 'c', 3], ['b', 'c', 7], ['b', 'd', 4], ['c', 'd', 1], ['c', 't', 5], ['d', 't', 2]];
const NODES = ['s', 'a', 'b', 'c', 'd', 't'];
const INF = Infinity;
const VSTAR = { s: 7, a: 6, b: 6, c: 3, d: 2, t: 0 };
const POLICY = new Set(['s>b', 'b>d', 'd>t', 'a>c', 'c>d']);
function sweeps(init, n) {
  let V = Object.fromEntries(NODES.map((x) => [x, x === 't' ? 0 : init]));
  const out = [V];
  for (let k = 1; k <= n; k++) {
    const W = { t: 0 };
    for (const x of NODES) if (x !== 't') W[x] = Math.min(...ARCS.filter((e) => e[0] === x).map(([, y, c]) => c + V[y]));
    V = W; out.push(V);
  }
  return out;
}
const fmt = (v) => (v === INF ? '∞' : String(v));

// 把从 p 到 q 的箭头两端各缩进 r
function trim(p, q, r1, r2 = r1) {
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  return [p[0] + (dx * r1) / L, p[1] + (dy * r1) / L, q[0] - (dx * r2) / L, q[1] - (dy * r2) / L];
}
// arc 的 cost 标在中点的一侧（side = ±1）
function midLabel(p, q, s, cls, side = 1, off = 11) {
  const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
  const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
  const nx = (-dy / L) * side, ny = (dx / L) * side;
  return text(mx + nx * off, my + ny * off + 4, s, cls, 'middle');
}
// network 的几何：给定缩放和平移
function netGeom(x0, y0, W, H) {
  const P = { s: [0, 0.5], a: [0.3, 0], b: [0.3, 1], c: [0.67, 0], d: [0.67, 1], t: [1, 0.5] };
  const G = {};
  for (const [k, [u, v]] of Object.entries(P)) G[k] = [x0 + u * W, y0 + v * H];
  return G;
}
// 每条 arc 的 cost 标在哪一侧：上面一排标在上方，下面一排标在下方
const SIDE = { 's>a': -1, 's>b': 1, 'b>a': 1, 'a>c': -1, 'b>c': -1, 'b>d': 1, 'c>d': 1, 'c>t': 1, 'd>t': -1 };

// ---------- 图 1：从 t 往回算，每个 node 只算一次 ----------
function netA() {
  const R = 17, G = netGeom(45, 62, 460, 140);
  const order = ['t', 'd', 'c', 'a', 'b', 's'];
  const expl = {
    t: 't 是 destination：V(t) = 0',
    d: 'V(d) = 2 + V(t) = 2',
    c: 'V(c) = min(1 + V(d), 5 + V(t)) = min(3, 5) = 3',
    a: 'V(a) = 3 + V(c) = 6',
    b: 'V(b) = min(2 + V(a), 7 + V(c), 4 + V(d)) = min(8, 10, 6) = 6',
    s: 'V(s) = min(4 + V(a), 1 + V(b)) = min(10, 7) = 7',
  };
  const chosen = { d: 'd>t', c: 'c>d', a: 'a>c', b: 'b>d', s: 's>b' };
  const T0 = 0.9, st = 2.3, hold = 2.6, T = T0 + order.length * st + hold;
  const K = (i) => (i < 0 ? 0.45 / T : (T0 + i * st) / T);
  const showFrom = (i) => ashow([1, 0, 1], [0, K(-1), K(i)], T);
  const onlyAt = (i) => (i === order.length - 1 ? ashow([0, 1], [0, K(i)], T) : ashow([0, 1, 0], [0, K(i), K(i + 1)], T));
  let o = '';
  for (const [x, y, c] of ARCS) {
    const k = `${x}>${y}`;
    o += arrow(...trim(G[x], G[y], R + 1, R + 3), 'mute');
    o += midLabel(G[x], G[y], String(c), 't', SIDE[k]);
  }
  // 被选中的 arc：到它那一步才出现
  order.forEach((n, i) => {
    if (!chosen[n]) return;
    const [x, y] = chosen[n].split('>');
    o += `<g>${arrow(...trim(G[x], G[y], R + 1, R + 3), 'ln')}${showFrom(i)}</g>`;
  });
  for (const n of NODES) o += circle(G[n][0], G[n][1], R, 'paper') + text(G[n][0], G[n][1] + 5, n, 'tb', 'middle');
  // V 的标注
  const vpos = { s: [0, 34], a: [0, -27], b: [0, 38], c: [0, -27], d: [0, 38], t: [0, 34] };
  order.forEach((n, i) => {
    const [dx, dy] = vpos[n];
    o += `<g>${text(G[n][0] + dx, G[n][1] + dy, `V = ${VSTAR[n]}`, 'tl', 'middle')}${showFrom(i)}</g>`;
    // 正在算的 node 加一个圈
    o += `<g opacity="0">${circle(G[n][0], G[n][1], R + 5, 'ln')}${onlyAt(i)}</g>`;
  });
  // 底下一行：这一步的算式
  const yb = 268;
  o += `<g>${text(280, yb, '粗线是每个 node 选的第一条 arc；按 t、d、c、a、b、s 的次序，每个 node 只算一次', 'ts', 'middle')}${ashow([1, 0, 1], [0, K(-1), K(order.length)], T)}</g>`;
  order.forEach((n, i) => {
    const on = [0, 1, 0], kt = [0, K(i), Math.min(K(i + 1), 1)];
    o += `<g opacity="0">${text(280, yb, expl[n], 't', 'middle')}${ashow(on, kt, T)}</g>`;
  });
  return svgA(560, 276, o, '动图：MA3252 的 network，从 destination t 往回，按 t、d、c、a、b、s 的次序逐个算出到 t 的最小 cost V，并标出每个 node 选的第一条 arc');
}

// ---------- 图 2：value iteration 从上面和从下面同时逼近 ----------
function sweepA() {
  const R = 17, G = netGeom(45, 70, 460, 140);
  const up = sweeps(INF, 4), lo = sweeps(0, 4);
  const frames = [2, 0, 1, 2, 3, 4];
  const st = 1.8, T = frames.length * st + 0.6;
  const kt = frames.map((_, i) => (i === 0 ? 0 : (0.6 + i * st - st) / T));
  let o = '';
  for (const [x, y, c] of ARCS) {
    o += arrow(...trim(G[x], G[y], R + 1, R + 3), 'mute');
    o += midLabel(G[x], G[y], String(c), 'ts', SIDE[`${x}>${y}`]);
  }
  for (const n of NODES) o += circle(G[n][0], G[n][1], R, 'paper') + text(G[n][0], G[n][1] + 5, n, 'tb', 'middle');
  const vpos = { s: 36, a: -26, b: 38, c: -26, d: 38, t: 36 };
  for (let k = 0; k <= 4; k++) {
    const on = frames.map((f) => f === k);
    const vis = on[0] ? '' : ' opacity="0"';
    let g = '';
    for (const n of NODES) {
      if (n === 't') continue;
      const y = G[n][1] + vpos[n];
      g += text(G[n][0] - 5, y, fmt(up[k][n]), 'tl', 'end') + text(G[n][0], y, '/', 'ts', 'middle') + text(G[n][0] + 5, y, fmt(lo[k][n]), 'tb', 'start');
    }
    g += text(552, 22, `k = ${k}`, 'tbig', 'end');
    o += `<g${vis}>${g}${ashow(on, kt, T)}</g>`;
  }
  o += text(G.t[0], G.t[1] + 36, '0', 'tb', 'middle');
  o += text(8, 20, '每个 node 下面：', 'ts', 'start') + text(104, 20, '从 V₀ = ∞ 出发', 'tl', 'start') + text(198, 20, '/', 'ts', 'start') + text(208, 20, '从 V₀ = 0 出发', 'tb', 'start');
  o += text(280, 282, '左边的数一直 ≥ V*，右边的一直 ≤ V*；k = 4 时两边都等于 V* = (7, 6, 6, 3, 2)', 'ts', 'middle');
  return svgA(560, 290, o, '动图：同一个 network 上做 value iteration，一边从无穷大出发，一边从 0 出发，k 从 0 到 4，两边分别从上面和下面收敛到同一个 V*');
}

// ---------- 图 3：distance vector，从旧值（下面）和从 ∞（上面）出发 ----------
function dvRun(Vy, Vz, n) {
  const cxy = 60, cyz = 1, cxz = 50;
  const out = [[Vy, Vz]];
  for (let k = 1; k <= n; k++) { const ny = Math.min(cxy, cyz + Vz), nz = Math.min(cxz, cyz + Vy); Vy = ny; Vz = nz; out.push([Vy, Vz]); }
  return out;
}
function dvA() {
  const n = 47, lo = dvRun(4, 5, n), up = dvRun(INF, INF, n);
  let o = '';
  // 左：三个 router
  const P = { x: [48, 140], y: [160, 62], z: [160, 218] };
  o += line(...trim(P.x, P.y, 16), 'ink-b') + line(...trim(P.y, P.z, 16), 'ink') + line(...trim(P.x, P.z, 16), 'ink');
  o += text(92, 88, '4 → 60', 'tl', 'end') + text(170, 144, '1', 't', 'start') + text(92, 200, '50', 't', 'end');
  for (const [k, [x, y]] of Object.entries(P)) o += circle(x, y, 16, 'paper') + text(x, y + 5, k, 'tb', 'middle');
  o += text(8, 22, 'destination 是 x', 'ts', 'start');
  o += text(8, 256, '新的答案：', 'ts', 'start') + text(8, 274, 'D' + sub('y') + '(x) = 51，D' + sub('z') + '(x) = 50', 't', 'start');
  // 右：D_y(x) 随 sweep 变化
  const sx = lin(0, n, 250, 548), sy = lin(0, 70, 236, 36);
  for (const v of [0, 20, 40, 60]) o += line(246, sy(v), 548, sy(v), 'grid') + text(242, sy(v) + 4, String(v), 'ts', 'end');
  for (const k of [0, 10, 20, 30, 40, 47]) o += text(sx(k), 254, String(k), 'ts', 'middle');
  o += text(548, 272, 'sweep k', 'ts', 'end');
  o += line(250, sy(51), 548, sy(51), 'dash');
  o += text(548, sy(51) - 6, 'V* = 51', 'ts', 'end');
  o += text(242, 22, 'D' + sub('y') + '(x) 的 estimate', 'tb', 'start');
  // 从 ∞：第 0 步画在顶上
  const yInf = sy(70);
  const upPts = up.map(([v], k) => [sx(k), v === INF ? yInf : sy(v)]);
  o += path(d(upPts), 'ink-b');
  o += text(244, yInf + 5, '∞', 't', 'end');
  o += text(sx(4), sy(60) - 8, '从 ∞ 出发：2 个 sweep', 't', 'start');
  // 从旧值：staircase
  const loPts = [];
  lo.forEach(([v], k) => { if (k) loPts.push([sx(k), sy(lo[k - 1][0])]); loPts.push([sx(k), sy(v)]); });
  o += path(d(loPts), 'ln');
  o += text(sx(18), sy(8), '从旧值 (4, 5) 出发：47 个 sweep', 'tl', 'start');
  // 两个跟着 sweep 走的点
  const kts = [0, ...lo.map((_, k) => (0.4 + k * 0.22) / (0.4 + (n + 1) * 0.22 + 2))];
  const T = 0.4 + (n + 1) * 0.22 + 2;
  const mk = (pts, cls) => {
    const xs = [pts[n][0], ...pts.map((p) => p[0])].map(f1), ys = [pts[n][1], ...pts.map((p) => p[1])].map(f1);
    return `<circle cx="${xs[0]}" cy="${ys[0]}" r="4.5" class="${cls}">${anim('cx', xs, kts, T, true)}${anim('cy', ys, kts, T, true)}</circle>`;
  };
  o += mk(lo.map(([v], k) => [sx(k), sy(v)]), 'ln-f') + mk(upPts, 'ink-f');
  return svgA(560, 280, o, '动图：x 到 y 的 link cost 从 4 变成 60。从旧的 estimate 出发，D_y(x) 每两个 sweep 涨 2，47 个 sweep 后才到 51；从无穷大出发，2 个 sweep 就到了');
}

// ---------- 图 4：discount 就是一个吸收的“结束”state ----------
function qcurve(p0, p1, p2, cls) {
  const t = 0.92, bx = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], by = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1];
  return path(`M${f1(p0[0])} ${f1(p0[1])} Q ${f1(p1[0])} ${f1(p1[1])}, ${f1(p2[0])} ${f1(p2[1])}`, cls) + arrow(bx, by, p2[0], p2[1], cls);
}
// 虚线箭头：线是 dash，头是实心
function darrow(x1, y1, x2, y2, size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  return line(x1, y1, x2 - 3 * Math.cos(a), y2 - 3 * Math.sin(a), 'dash') + poly([[x2, y2], p(0.42), p(-0.42)], 'ink-f');
}
function death() {
  const A = [70, 110], B = [250, 110], E = [160, 236], R = 26;
  let o = '';
  o += qcurve([A[0] + 22, A[1] - 15], [160, 50], [B[0] - 22, B[1] - 15], 'ln');
  o += text(160, 62, '0.9 × 1 = 0.9', 'tl', 'middle');
  o += qcurve([B[0] - 22, B[1] + 14], [160, 168], [A[0] + 22, A[1] + 14], 'ink');
  o += text(160, 166, '0.9 × 0.1 = 0.09', 't', 'middle');
  o += path(`M${B[0] + 8} ${B[1] - 25} C ${B[0] + 30} ${B[1] - 90}, ${B[0] + 90} ${B[1] - 40}, ${B[0] + 26} ${B[1] - 4}`, 'ink');
  o += arrow(B[0] + 40, B[1] - 14, B[0] + 26, B[1] - 4, 'ink');
  o += text(292, 36, '0.9 × 0.9 = 0.81', 'ts', 'middle');
  o += darrow(...trim(A, E, R + 1, 22)) + darrow(...trim(B, E, R + 1, 22));
  o += text(96, 192, '0.1', 't', 'end') + text(224, 192, '0.1', 't', 'start');
  o += circle(A[0], A[1], R, 'paper') + text(A[0], A[1] - 2, 'A', 'tb', 'middle') + text(A[0], A[1] + 14, 'r = 0', 'ts', 'middle');
  o += circle(B[0], B[1], R, 'paper') + text(B[0], B[1] - 2, 'B', 'tb', 'middle') + text(B[0], B[1] + 14, 'r = 2', 'ts', 'middle');
  o += rect(E[0] - 40, E[1] - 20, 80, 40, 'wash2', 8) + text(E[0], E[1] + 5, '结束', 'tb', 'middle');
  const tx = 352;
  o += text(tx, 40, '每一步先以 1 − γ = 0.1', 't') + text(tx, 58, '的 probability 结束，', 't') + text(tx, 76, '没结束才按 π' + sub('go') + ' 走。', 't');
  o += text(tx, 112, '从 A 出发、结束之前：', 'tb');
  o += text(tx, 134, '在 A 的 expected 次数  1.743', 't') + text(tx, 154, '在 B 的 expected 次数  8.257', 'tl');
  o += text(tx, 176, 'expected 一共走 10 步 = 1/(1 − γ)', 'ts');
  o += text(tx, 212, 'v(A) = 1.743 × 0 + 8.257 × 2', 't') + text(tx + 36, 232, '= 16.514', 'tb');
  return svg(560, 262, o, '把 discount 换成一个吸收的结束 state：A、B 之间的 transition probability 都乘 0.9，另外各有 0.1 的 probability 进入结束。从 A 出发，结束前在 A 期望停留 1.743 次，在 B 期望停留 8.257 次');
}

// ---------- 图 5：reduced cost，tight 的 arc 就是 policy ----------
function reduced() {
  const R = 13;
  let o = '';
  const panel = (x0, title, labelOf, bold, showV) => {
    const G = netGeom(x0 + 16, 64, 236, 124);
    o += text(x0 + 2, 20, title, 'tb', 'start');
    for (const [x, y, c] of ARCS) {
      const k = `${x}>${y}`;
      o += arrow(...trim(G[x], G[y], R + 1, R + 3), bold(k, c) ? 'ln' : 'mute');
      o += midLabel(G[x], G[y], labelOf(x, y, c), bold(k, c) ? 'tl' : 'ts', SIDE[k], 9);
    }
    for (const n of NODES) {
      o += circle(G[n][0], G[n][1], R, 'paper') + text(G[n][0], G[n][1] + 5, n, 'tb', 'middle');
      if (showV) {
        const dy = { s: 30, a: -21, b: 32, c: -21, d: 32, t: 30 }[n];
        o += text(G[n][0], G[n][1] + dy, String(VSTAR[n]), 't', 'middle');
      }
    }
  };
  panel(0, 'cost c；node 旁是 V*', (x, y, c) => String(c), (k) => POLICY.has(k), true);
  panel(290, 'reduced cost c + V*(x′) − V*(x)', (x, y, c) => String(c + VSTAR[y] - VSTAR[x]), (k, c) => POLICY.has(k), false);
  o += line(280, 34, 280, 236, 'grid');
  o += text(280, 256, '右边每条 arc 都 ≥ 0；等于 0 的正好是左边粗线，也就是每个 node 的 argmin', 'ts', 'middle');
  return svg(560, 264, o, '同一个 network：左边是原来的 cost 和 V*，右边是 reduced cost。Reduced cost 都不是负的，等于 0 的 arc 正好是每个 node 选的第一条 arc');
}

// ---------- 图 6：scalar LQR，grid 上的 value iteration 对 Riccati ----------
const LQ = (() => {
  const a = 1.2, b = 0.5, q = 1, r = 1, K = 12;
  const s = [0];
  for (let k = 1; k <= K; k++) s.push(q + (a * a * r * s[k - 1]) / (r + b * b * s[k - 1]));
  // grid：[-3, 3] 上 301 个点，u 每 0.002 一格，线性插值
  const N = 301, xs = Array.from({ length: N }, (_, i) => -3 + (6 * i) / (N - 1));
  const us = Array.from({ length: 6001 }, (_, i) => -6 + 0.002 * i);
  const interp = (V, x) => { const t = ((x + 3) * (N - 1)) / 6; const i = Math.min(N - 2, Math.max(0, Math.floor(t))); const w = t - i; return V[i] * (1 - w) + V[i + 1] * w; };
  let V = new Array(N).fill(0);
  const hist = [V];
  for (let k = 1; k <= K; k++) {
    const W = new Array(N);
    for (let i = 0; i < N; i++) {
      const x = xs[i];
      let best = Infinity;
      for (const u of us) { const xn = a * x + b * u; if (xn < -3 || xn > 3) continue; const c = q * x * x + r * u * u + interp(V, xn); if (c < best) best = c; }
      W[i] = best;
    }
    V = W; hist.push(V);
  }
  const at = (k, x) => hist[k][Math.round(((x + 3) * (N - 1)) / 6)];
  return { s, at, K };
})();
function lqrA() {
  const { s, at, K } = LQ;
  const sx = lin(-2, 2, 54, 300), sy = lin(0, 16, 236, 34);
  const sx2 = lin(0, K, 372, 548), sy2 = lin(0, 4.2, 236, 34);
  let o = '';
  for (const v of [0, 4, 8, 12, 16]) o += line(50, sy(v), 300, sy(v), 'grid') + text(44, sy(v) + 4, String(v), 'ts', 'end');
  for (const v of [-2, -1, 0, 1, 2]) o += text(sx(v), 254, String(v), 'ts', 'middle');
  o += text(300, 272, 'x', 'ts', 'end') + text(30, 22, 'V' + sub('k') + '(x)', 'tb', 'start');
  for (const v of [0, 1, 2, 3, 4]) o += line(372, sy2(v), 548, sy2(v), 'grid') + text(368, sy2(v) + 4, String(v), 'ts', 'end');
  for (const k of [0, 4, 8, 12]) o += text(sx2(k), 254, String(k), 'ts', 'middle');
  o += text(548, 272, 'k', 'ts', 'end') + text(372, 22, 's' + sub('k') + ' 与 V' + sub('k') + '(1)', 'tb', 'start');
  // 右：s_k 的折线和 grid 上的 V_k(1)
  o += path(d(s.map((v, k) => [sx2(k), sy2(v)])), 'ln');
  for (let k = 0; k <= K; k++) o += circle(sx2(k), sy2(at(k, 1)), 2.6, 'ink-f');
  o += line(372, sy2(s[K]), 548, sy2(s[K]), 'dash') + text(548, sy2(s[K]) + 16, 's∞ = 3.810', 'ts', 'end');
  // 左：动画，k = 12 是静态帧
  const frames = [K, ...Array.from({ length: K }, (_, i) => i + 1)];
  const st = 1.1, T = 0.8 + K * st + 1.5;
  const kt = frames.map((_, i) => (i === 0 ? 0 : (0.8 + (i - 1) * st) / T));
  o += path(d(Array.from({ length: 41 }, (_, i) => { const x = -2 + i * 0.1; return [sx(x), sy(s[K] * x * x)]; })), 'ln-dash');
  const curveD = (k) => d(Array.from({ length: 41 }, (_, i) => { const x = -2 + i * 0.1; return [sx(x), sy(s[k] * x * x)]; }));
  o += `<path d="${curveD(K)}" class="ln">${anim('d', frames.map(curveD), kt, T, true)}</path>`;
  for (let j = 0; j <= 20; j++) {
    const x = -2 + j * 0.2;
    const ys = frames.map((k) => f1(sy(at(k, x))));
    o += `<circle cx="${f1(sx(x))}" cy="${ys[0]}" r="3" class="ink-f">${anim('cy', ys, kt, T, true)}</circle>`;
  }
  // 右边跟着走的点
  const mx = frames.map((k) => f1(sx2(k))), my = frames.map((k) => f1(sy2(s[k])));
  o += `<circle cx="${mx[0]}" cy="${my[0]}" r="5" class="ln-f">${anim('cx', mx, kt, T, true)}${anim('cy', my, kt, T, true)}</circle>`;
  frames.forEach((k, i) => {
    const on = frames.map((_, j) => j === i);
    o += `<g${i === 0 ? '' : ' opacity="0"'}>${text(172, 22, `k = ${k}`, 'tl', 'middle')}${text(172, 54, `s${sub('k')} = ${s[k].toFixed(3)}`, 't', 'middle')}${ashow(on, kt, T)}</g>`;
  });
  return svgA(560, 280, o, '动图：scalar LQR，x 的下一步是 1.2x + 0.5u。左边的点是 301 个 grid point 上做 value iteration 得到的 V_k，线是 Riccati recursion 给出的 s_k x 平方，两者重合；右边是 s_k 随 k 收敛到 3.810');
}

// ---------- 图 7：edit distance 的 table 是一个 DAG ----------
function editDag() {
  const X = ['∅', 'S', 'N'], Y = ['∅', 'S', 'U', 'N'];
  const E = [[0, 1, 2, 3], [1, 0, 1, 2], [2, 1, 1, 1]];
  const px = (j) => 84 + 106 * j, py = (i) => 52 + 88 * i, R = 15;
  const pathSet = new Set(['0,0>1,1', '1,1>1,2', '1,2>2,3']);
  let o = '';
  const edge = (i1, j1, i2, j2, lab) => {
    const k = `${i1},${j1}>${i2},${j2}`, on = pathSet.has(k);
    o += arrow(...trim([px(j1), py(i1)], [px(j2), py(i2)], R + 1, R + 3), on ? 'ln' : 'mute');
    if (lab !== null) o += midLabel([px(j1), py(i1)], [px(j2), py(i2)], lab, on ? 'tl' : 'ts', 1, 10);
  };
  for (let i = 0; i <= 2; i++) for (let j = 0; j <= 3; j++) {
    if (j < 3) edge(i, j, i, j + 1, null);
    if (i < 2) edge(i, j, i + 1, j, null);
    if (i < 2 && j < 3) edge(i, j, i + 1, j + 1, X[i + 1] === Y[j + 1] ? '0' : '1');
  }
  for (let i = 0; i <= 2; i++) for (let j = 0; j <= 3; j++) o += circle(px(j), py(i), R, 'paper') + text(px(j), py(i) + 5, String(E[i][j]), 'tb', 'middle');
  for (let j = 0; j <= 3; j++) o += text(px(j), 20, Y[j], 'tl', 'middle');
  for (let i = 0; i <= 2; i++) o += text(44, py(i) + 5, X[i], 'tl', 'middle');
  o += text(436, 70, '→ insert，+1', 'ts', 'start') + text(436, 90, '↓ delete，+1', 'ts', 'start') + text(436, 110, '↘ 对齐两个字母', 'ts', 'start') + text(450, 128, '相同 +0，不同 +1', 'ts', 'start');
  o += text(280, 262, '圆里是 E(i, j)，也就是从左上角到这个 node 的 shortest distance；粗线是 SN 到 SUN 的一条 shortest path', 'ts', 'middle');
  return svg(560, 270, o, 'SN 和 SUN 的 edit distance table 画成 DAG：每个格子是一个 node，向右、向下的 arc cost 1，斜向的 arc cost 0 或 1；格子里的数是从左上角出发的 shortest distance');
}

export default {
  'thread-bellman-net': netA,
  'thread-bellman-sweeps': sweepA,
  'thread-bellman-dv': dvA,
  'thread-bellman-death': death,
  'thread-bellman-reduced': reduced,
  'thread-bellman-lqr': lqrA,
  'thread-bellman-edit': editDag,
};
