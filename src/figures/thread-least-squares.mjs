import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// 概念线：least squares。数字都在这里现算，和正文里的一致。

const num = (v, k = 3) => (v < -1e-12 ? '−' : '') + Math.abs(v).toFixed(k);
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const atext = (x, y, s, cls, anchor, on, kt, T) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" opacity="${on[0] ? 1 : 0}">${s}${ashow(on, kt, T)}</text>`;
// 一段段 hold + transition 的时间表：stops 是若干个状态，每个状态停 hold 秒，状态之间过渡 move 秒，最后回到第一个状态
function timeline(n, hold, move, back = move) {
  const ts = [0];
  let t = 0;
  const idx = [0];
  for (let i = 0; i < n; i++) {
    t += hold; ts.push(t); idx.push(i);
    if (i < n - 1) { t += move; ts.push(t); idx.push(i + 1); }
  }
  t += back; ts.push(t); idx.push(0);
  return { kt: ts.map((x) => x / t), idx, T: t };
}
// 小 robot：车身加两个轮子，(x, yb) 是车底中点
const robot = (x, yb, cls = 'paper') => rect(x - 13, yb - 18, 26, 13, cls, 3) + circle(x - 7, yb - 2.5, 3.2, 'ink-f') + circle(x + 7, yb - 2.5, 3.2, 'ink-f');
const robotPath = (x, yb) => `M${f1(x - 13)} ${f1(yb - 18)}h26v13h-26Z`;
const arobot = (xs, yb, kt, T, cls) => `<path d="${robotPath(xs[0], yb)}" class="${cls}">${anim('d', xs.map((x) => robotPath(x, yb)), kt, T)}</path>` + acircle(xs.map((x) => x - 7), xs.map(() => yb - 2.5), kt, T, 3.2, 'ink-f') + acircle(xs.map((x) => x + 7), xs.map(() => yb - 2.5), kt, T, 3.2, 'ink-f');

// 2×2 solve
const solve2 = (a, b, c, dd, r1, r2) => { const det = a * dd - b * c; return [(dd * r1 - b * r2) / det, (-c * r1 + a * r2) / det]; };
// 1D pose 例子：odometry 1.1、1.0（Ω=100），landmark x₂ = 2.0（Ω=w）
const poses = (w) => solve2(200, -100, -100, 100 + w, 10, 100 + 2 * w);

// ---------- 1. 两个问题 ----------
function two() {
  let o = '';
  // 左：三个点和任意两点定出的三条 line
  const sx = lin(0, 4, 36, 250), sy = lin(0, 3.2, 200, 40);
  o += axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 3.2, xt: [1, 2, 3], yt: [1, 2, 3] });
  o += text(sx(4) + 8, sy(0) + 4, 't', 'ts', 'start') + text(sx(0) + 6, sy(3.2) + 4, 'y', 'ts', 'start');
  const L = [[(t) => t, 'y = t', 3.1], [() => 2, 'y = 2', 3.7], [(t) => 0.5 + 0.5 * t, 'y = ½ + ½t', 3.7]];
  for (const [f, s, t1] of L) {
    o += path(d([[sx(0.3), sy(f(0.3))], [sx(t1), sy(f(t1))]]), 'dash');
    o += text(sx(t1) + 4, sy(f(t1)) + 4, s, 'ts', 'start');
  }
  // 各自漏掉的那个点：竖线
  o += line(sx(3), sy(2), sx(3), sy(3), 'ln') + text(sx(3) - 5, sy(2.55), '1', 'tl', 'end');
  o += line(sx(1), sy(1), sx(1), sy(2), 'ln') + text(sx(1) - 5, sy(1.55), '1', 'tl', 'end');
  o += line(sx(2), sy(1.5), sx(2), sy(2), 'ln') + text(sx(2) + 5, sy(1.68), '½', 'tl', 'start');
  for (const [t, y] of [[1, 1], [2, 2], [3, 2]]) o += circle(sx(t), sy(y), 4.5, 'ink-f');
  o += text(143, 16, '三个点，一条 line', 'tb', 'middle');
  o += text(143, 236, '每条 line 穿过两个点，漏掉第三个', 'ts', 'middle');
  // 右：corridor 上的 robot
  const px = lin(0, 2.2, 312, 515), F = 118;
  o += text(425, 16, 'corridor 里的 robot', 'tb', 'middle');
  o += line(296, F, 548, F, 'ink-b');
  for (let k = 0; k < 13; k++) o += line(300 + k * 20, F, 292 + k * 20, F + 7, 'mute');
  // landmark：墙上的一根柱子，x₀ 和 x₂ 都看到了它
  const LM = [px(1.0), 60];
  o += line(px(0), F - 18, LM[0], LM[1], 'grid') + line(px(2.1), F - 18, LM[0], LM[1], 'grid');
  o += rect(LM[0] - 4, LM[1] - 22, 8, 22, 'solid2', 1) + text(LM[0] + 10, LM[1] - 8, 'landmark', 'ts', 'start');
  o += robot(px(0), F, 'paper') + robot(px(1.1), F, 'wash ink-s') + robot(px(2.1), F, 'wash ink-s');
  o += text(px(0), F + 22, 'x₀ = 0', 't', 'middle') + text(px(1.1), F + 22, 'x₁', 't', 'middle') + text(px(2.1), F + 22, 'x₂', 't', 'middle');
  // odometry 箭头
  const ay = F + 38;
  o += arrow(px(0) + 2, ay, px(1.1) - 2, ay, 'ink') + text((px(0) + px(1.1)) / 2, ay + 15, 'odometry 1.1', 'ts', 'middle');
  o += arrow(px(1.1) + 2, ay, px(2.1) - 2, ay, 'ink') + text((px(1.1) + px(2.1)) / 2, ay + 15, 'odometry 1.0', 'ts', 'middle');
  // landmark 给的 x₂ − x₀ = 2.0
  const by = F + 76;
  o += arrow(px(0), by, px(2.0), by, 'ln') + text(px(1.0), by + 17, 'landmark：x₂ − x₀ = 2.0', 'tl', 'middle');
  o += line(px(2.0), ay + 22, px(2.0), by - 3, 'dash') + line(px(2.1), ay + 4, px(2.1), by, 'dash');
  o += text(px(2.1) + 6, by + 4, '差 0.1', 'ts', 'start');
  return svg(560, 250, o, '左：三个点 (1,1)、(2,2)、(3,2)，任意两点定出的三条 line 都漏掉第三个点。右：corridor 里的 robot，odometry 说走了 1.1 和 1.0，landmark 说 x2 − x0 = 2.0，两者差 0.1');
}

// ---------- 2. Weight：landmark 的 Ω 从 0 变到 10000 ----------
function weightA() {
  const W = [400, 10000, 0, 25, 100, 400];
  const S = W.map(poses);
  const { kt, idx, T } = timeline(W.length - 1, 1.5, 0.9, 0.9);
  const at = (f) => idx.map((i) => f(i));
  let o = '';
  const px = lin(0, 2.25, 40, 520), F = 74;
  o += line(24, F, 540, F, 'ink-b');
  for (let k = 0; k < 26; k++) o += line(26 + k * 20, F, 18 + k * 20, F + 8, 'mute');
  for (const v of [0, 1, 2]) o += line(px(v), F, px(v), F + 4, 'axis') + text(px(v), F + 20, v + ' m', 'ts', 'middle');
  o += robot(px(0), F, 'paper') + text(px(0), F - 24, 'x₀', 't', 'middle');
  for (const j of [0, 1]) {
    const xs = at((i) => px(S[i][j]));
    o += arobot(xs, F, kt, T, 'wash ink-s');
    o += `<text x="${f1(xs[0])}" y="${F - 24}" class="t" text-anchor="middle">${j ? 'x₂' : 'x₁'}${anim('x', xs.map(f1), kt, T)}</text>`;
  }
  // 放大的两把尺子
  const k = 3600, ruler = (y, v0, v1, x0) => {
    const sx = (v) => x0 + (v - v0) * k;
    let r = line(sx(v0), y, sx(v1), y, 'axis');
    for (let v = Math.ceil(v0 * 100 - 1e-9) / 100; v <= v1 + 1e-9; v += 0.01) r += line(sx(v), y - 4, sx(v), y + 4, 'axis') + text(sx(v), y + 18, v.toFixed(2), 'ts', 'middle');
    return [r, sx];
  };
  const [r1, s1] = ruler(132, 1.04, 1.11, 150), [r2, s2] = ruler(196, 1.99, 2.11, 104);
  o += r1 + r2;
  o += text(140, 136, 'x₁ 放大', 'ts', 'end') + text(94, 200, 'x₂ 放大', 'ts', 'end');
  o += line(s2(2.0), 182, s2(2.0), 190, 'ln') + text(s2(2.0), 176, 'landmark 说 2.0', 'tl', 'middle');
  o += line(s2(2.1), 182, s2(2.1), 190, 'ink') + text(s2(2.1), 176, 'odometry 说 2.1', 'ts', 'middle');
  o += line(s1(1.1), 118, s1(1.1), 126, 'ink') + text(s1(1.1), 112, 'odometry 说 1.1', 'ts', 'middle');
  o += acircle(at((i) => s1(S[i][0])), at(() => 132), kt, T, 5.5, 'ln-f');
  o += acircle(at((i) => s2(S[i][1])), at(() => 196), kt, T, 5.5, 'ln-f');
  // 读数
  const sig = { 0: '∞', 25: '0.2', 100: '0.1', 400: '0.05', 10000: '0.01' };
  W.slice(0, -1).forEach((w, j) => {
    const vis = idx.map((i) => i === j);
    const e = 1.1 - S[j][0], e3 = 2.0 - S[j][1];
    o += atext(280, 236, `Ω = ${w}（σ = ${sig[w]}）：x₁ = ${S[j][0].toFixed(4)}，x₂ = ${S[j][1].toFixed(4)}`, 'tb', 'middle', vis, kt, T);
    o += atext(280, 254, `两段 odometry 各让出 ${e.toFixed(4)}，landmark 让出 ${Math.abs(e3).toFixed(4)}`, 'ts', 'middle', vis, kt, T);
  });
  return svgA(560, 262, o, '动图：landmark 这条 measurement 的 weight 从 0 变到 10000，x1 和 x2 在 odometry 给的 1.1、2.1 和 landmark 给的 2.0 之间滑动；weight 400 时 x2 = 2.0111');
}

// ---------- 3. 消掉一块 unknown：centering 与 SLAM 的 x₁ ----------
function elimA() {
  const T = 6.4, kt = [0, 1.6 / T, 2.8 / T, 5.6 / T, 1];
  const ph = [0, 0, 1, 1, 0];
  let o = '';
  // 左：三个点平移到 centroid
  const sx = lin(-1.4, 3.6, 34, 262), sy = lin(-1.1, 2.6, 196, 42);
  o += line(sx(-1.4), sy(0), sx(3.6), sy(0), 'axis') + line(sx(0), sy(-1.1), sx(0), sy(2.6), 'axis');
  o += text(sx(3.6), sy(0) + 16, 't', 'ts', 'end');
  const P = [[1, 1], [2, 2], [3, 2]], cx = 2, cy = 5 / 3;
  const sh = (p, a) => [p[0] - a * cx, p[1] - a * cy];
  for (const p of P) {
    const xs = ph.map((a) => sx(sh(p, a)[0])), ys = ph.map((a) => sy(sh(p, a)[1]));
    o += acircle(xs, ys, kt, T, 4.5, 'ink-f');
  }
  const lineD = (a) => { const f = (t) => 2 / 3 + 0.5 * t; const t0 = 0.4 - a * cx, t1 = 3.4 - a * cx; return d([[sx(t0), sy(f(t0 + a * cx) - a * cy)], [sx(t1), sy(f(t1 + a * cx) - a * cy)]]); };
  o += apath(ph.map(lineD), kt, T, 'ln');
  const cxs = ph.map((a) => sx(cx - a * cx)), cys = ph.map((a) => sy(cy - a * cy));
  o += `<path d="M${f1(cxs[0] - 6)} ${f1(cys[0])}h12M${f1(cxs[0])} ${f1(cys[0] - 6)}v12" class="ink">${anim('d', cxs.map((x, i) => `M${f1(x - 6)} ${f1(cys[i])}h12M${f1(x)} ${f1(cys[i] - 6)}v12`), kt, T)}</path>`;
  o += atext(sx(2.15), sy(1.15), 'mean (2, 5/3)', 'ts', 'start', ph.map((a) => !a), kt, T);
  o += atext(148, 222, '两个 unknown：3C + 6D = 5，6C + 14D = 11', 'ts', 'middle', ph.map((a) => !a), kt, T);
  o += atext(148, 222, '减掉 mean 之后只剩 D：2D = 1', 'tl', 'middle', ph.map((a) => !!a), kt, T);
  o += text(148, 16, 'line fit：消掉 intercept C', 'tb', 'middle');
  // 右：pose graph 消掉 x₁
  const N0 = [316, 160], N1 = [420, 68], N2 = [524, 160];
  o += text(420, 16, 'pose graph：消掉 x₁', 'tb', 'middle');
  const gone = ph.map((a) => !a), come = ph.map((a) => !!a);
  o += grp(line(...N0, ...N1, 'ink-b') + line(...N1, ...N2, 'ink-b') + text(354, 104, '100', 'ts', 'end') + text(486, 104, '100', 'ts', 'start'), gone, kt, T);
  o += line(...N0, ...N2, 'ink-b') + text(420, 178, '400', 'ts', 'middle');
  const arcD = `M${N0[0]} ${N0[1]}Q420 52 ${N2[0]} ${N2[1]}`;
  o += grp(`<path d="${arcD}" class="ln"/>` + text(420, 92, '50', 'tl', 'middle') + text(420, 74, '100 与 100 串成', 'ts', 'middle'), come, kt, T);
  o += grp(`<circle cx="${N1[0]}" cy="${N1[1]}" r="15" class="paper"/>` + text(N1[0], N1[1] + 5, 'x₁', 't', 'middle'), gone, kt, T);
  o += `<circle cx="${N0[0]}" cy="${N0[1]}" r="15" class="paper"/>` + text(N0[0], N0[1] + 5, 'x₀', 't', 'middle');
  o += `<circle cx="${N2[0]}" cy="${N2[1]}" r="15" class="paper"/>` + text(N2[0], N2[1] + 5, 'x₂', 't', 'middle');
  for (let k = 0; k < 4; k++) o += line(N0[0] - 12 + k * 8, N0[1] + 22, N0[0] - 18 + k * 8, N0[1] + 30, 'mute');
  o += line(N0[0] - 16, N0[1] + 22, N0[0] + 16, N0[1] + 22, 'ink') + text(N0[0], N0[1] + 44, '固定在 0', 'ts', 'middle');
  o += atext(420, 222, 'Ω：x₀–x₁ 100，x₁–x₂ 100，x₀–x₂ 400', 'ts', 'middle', gone, kt, T);
  o += atext(420, 222, 'x₂ 的 information：50 + 400 = 450', 'tl', 'middle', come, kt, T);
  return svgA(560, 232, o, '动图：左边三个点连同 fitted line 平移，使 mean 落到原点，intercept 消失，只剩 slope 的一个 equation；右边 pose graph 去掉 x1，两条 information 为 100 的 edge 串成一条 50，与原来的 400 相加得 450');
}

// ---------- 4. MA2101：sample 越来越密，discrete least squares 趋向 projection ----------
function funcA() {
  const Ns = [3, 4, 5, 8, 20];
  const mid = (N) => Array.from({ length: N }, (_, i) => -1 + (2 * i + 1) / N);
  const bN = (N) => { const x = mid(N); return x.reduce((s, v) => s + v ** 4, 0) / x.reduce((s, v) => s + v * v, 0); };
  const { kt, idx, T } = timeline(Ns.length, 1.4, 0.7, 0.7);
  const sx = lin(-1, 1, 40, 300), sy = lin(-1.1, 1.1, 222, 30);
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: -1.1, y1: 1.1, yt: [[-1, '−1'], [1, '1']], xAt: 0, yAt: 0 });
  for (const v of [-1, -0.5, 0.5, 1]) o += line(sx(v), sy(0) - 3, sx(v), sy(0) + 3, 'axis') + text(sx(v), v < 0 ? sy(0) - 8 : sy(0) + 17, (v < 0 ? '−' : '') + Math.abs(v), 'ts', 'middle');
  const cub = []; for (let k = 0; k <= 200; k++) { const x = -1 + k / 100; cub.push([sx(x), sy(x ** 3)]); }
  o += path(d(cub), 'ink') + text(sx(0.93) - 6, sy(0.93 ** 3) - 2, 'x³', 't', 'end');
  o += path(d([[sx(-1), sy(-0.6)], [sx(1), sy(0.6)]]), 'dash') + text(sx(1) + 4, sy(0.6) + 16, '⅗x', 't', 'start');
  const ld = (b) => d([[sx(-1), sy(-b)], [sx(1), sy(b)]]);
  o += apath(idx.map((i) => ld(bN(Ns[i]))), kt, T, 'ln');
  Ns.forEach((N, j) => {
    const vis = idx.map((i) => i === j);
    let g = ''; for (const x of mid(N)) g += circle(sx(x), sy(x ** 3), 3.6, 'ln-f');
    o += grp(g, vis, kt, T);
    o += atext(330, 96, `N = ${N} 个 midpoint`, 'tb', 'start', vis, kt, T);
    o += atext(330, 120, `b = Σxᵢ⁴ / Σxᵢ² = ${bN(N).toFixed(4)}`, 'tl', 'start', vis, kt, T);
  });
  o += text(330, 40, '对 N 个 sample fit a + bx + cx²', 'ts', 'start');
  o += text(330, 58, '（a、c 由 symmetry 都是 0）', 'ts', 'start');
  o += text(330, 166, 'N → ∞：Σ 变成 ∫', 'ts', 'start');
  o += text(330, 190, 'b → ⟨x³, x⟩ / ⟨x, x⟩', 't', 'start');
  o += text(330, 212, '= (2/5) / (2/3) = 3/5', 't', 'start');
  return svgA(560, 240, o, '动图：在 [−1, 1] 上取 3、4、5、8、20 个 midpoint，对 x³ 的 sample 做 least squares，fitted line 的 slope 从 0.444 逐步趋向 MA2101 里 projection 给出的 3/5');
}

// ---------- 5. Kalman filter 就是 recursive least squares：三个点一个一个来 ----------
function rlsA() {
  const pts = [[1, 1], [2, 2], [3, 2]], s2 = 0.09, tau2 = 1e6;
  // 逐个 update，记下每一步的 mean 和 covariance
  let mu = [0, 0], P = [[tau2, 0], [0, tau2]];
  const st = [];
  for (const [t, y] of pts) {
    const c = [1, t], Pc = [P[0][0] + P[0][1] * t, P[1][0] + P[1][1] * t], S = c[0] * Pc[0] + c[1] * Pc[1] + s2;
    const K = [Pc[0] / S, Pc[1] / S], inn = y - (mu[0] + mu[1] * t);
    mu = [mu[0] + K[0] * inn, mu[1] + K[1] * inn];
    P = [[P[0][0] - K[0] * K[0] * S, P[0][1] - K[0] * K[1] * S], [P[1][0] - K[1] * K[0] * S, P[1][1] - K[1] * K[1] * S]];
    st.push({ mu: [...mu], P: P.map((r) => [...r]), K, inn, S });
  }
  // 时间表：第一帧是三点之后；然后回到第一个点，依次加第二、第三个
  const T = 9.6, kt = [0, 1.8 / T, 1.8 / T, 3.6 / T, 4.5 / T, 6.2 / T, 7.1 / T, 1];
  const phase = [2, 2, 0, 0, 1, 1, 2, 2];
  let o = '';
  // 左：data plane
  const lx = lin(0, 4, 30, 246), ly = lin(0, 3.2, 196, 36);
  o += axes({ sx: lx, sy: ly, x0: 0, x1: 4, y0: 0, y1: 3.2, xt: [1, 2, 3], yt: [1, 2, 3] });
  o += text(lx(4) + 6, ly(0) + 4, 't', 'ts', 'start') + text(lx(0) + 6, ly(3.2) + 4, 'y', 'ts', 'start');
  const lineAt = (m) => { const t1 = Math.min(3.8, m[1] > 0 ? (3.15 - m[0]) / m[1] : 3.8); return d([[lx(0.2), ly(m[0] + m[1] * 0.2)], [lx(t1), ly(m[0] + m[1] * t1)]]); };
  o += apath(phase.map((p) => lineAt(st[p].mu)), kt, T, 'ln');
  pts.forEach(([t, y], j) => { o += grp(circle(lx(t), ly(y), 4.5, 'ink-f'), phase.map((p) => p >= j), kt, T); });
  // 第三个点到来时的 innovation：y = t 在 t = 3 处预测 3
  o += grp(line(lx(3), ly(2), lx(3), ly(3), 'dash') + circle(lx(3), ly(3), 3.5, 'paper') + text(lx(3) + 7, ly(2.5) + 4, 'innovation −1', 'ts', 'start'), phase.map((p) => p === 2), kt, T);
  o += text(138, 16, 'data plane：当前的 line', 'tb', 'middle');
  // 右：parameter plane (C, D)，两个方向同一比例
  const u = 80, cmin = -0.8, cmax = 2.2, dmin = -0.2, dmax = 1.75;
  const px = (c) => 300 + (c - cmin) * u, py = (dd) => 196 - (dd - dmin) * u;
  o += `<clipPath id="tls-rls-clip"><rect x="${px(cmin)}" y="${f1(py(dmax))}" width="${(cmax - cmin) * u}" height="${f1((dmax - dmin) * u)}"/></clipPath>`;
  o += line(px(cmin), py(0), px(cmax), py(0), 'axis') + line(px(0), py(dmin), px(0), py(dmax), 'axis');
  o += text(px(cmax), py(0) + 16, 'C', 'ts', 'end') + text(px(0) + 6, py(dmax) + 8, 'D', 'ts', 'start');
  for (const v of [1, 2]) o += line(px(v), py(0), px(v), py(0) + 4, 'axis') + text(px(v), py(0) + 16, String(v), 'ts', 'middle');
  // 每个点在 (C, D) 里是一条 band：C + tD = y ± σ
  const band = (t, y) => {
    const s = Math.sqrt(s2), c0 = cmin - 0.5, c1 = cmax + 0.5;
    return poly([[c0, y + s], [c1, y + s], [c1, y - s], [c0, y - s]].map(([c, r]) => [px(c), py((r - c) / t)]), 'wash');
  };
  pts.forEach(([t, y], j) => {
    const yl = Math.min(dmax - 0.04, (y - cmin) / t);
    o += grp(`<g clip-path="url(#tls-rls-clip)">${band(t, y)}</g>` + text(px(cmin) - 4, py(yl) + 4, '点 ' + (j + 1), 'ts', 'end'), phase.map((p) => p >= j), kt, T);
  });
  // 1σ ellipse：第一个点之后沿 band 方向几乎无限长，不画
  const ell = (m, Pm) => {
    const a = Pm[0][0], b = Pm[0][1], c = Pm[1][1], tr = a + c, det = a * c - b * b;
    const l1 = tr / 2 + Math.sqrt(tr * tr / 4 - det), l2 = tr / 2 - Math.sqrt(tr * tr / 4 - det);
    const v1 = Math.abs(b) > 1e-12 ? [l1 - c, b] : [1, 0], nv = Math.hypot(...v1), e1 = [v1[0] / nv, v1[1] / nv], e2 = [-e1[1], e1[0]];
    const pp = [];
    for (let k = 0; k <= 48; k++) { const th = (2 * Math.PI * k) / 48, r1 = Math.sqrt(l1) * Math.cos(th), r2 = Math.sqrt(l2) * Math.sin(th); pp.push([px(m[0] + r1 * e1[0] + r2 * e2[0]), py(m[1] + r1 * e1[1] + r2 * e2[1])]); }
    return d(pp) + 'Z';
  };
  const e1 = ell(st[1].mu, st[1].P), e2 = ell(st[2].mu, st[2].P);
  o += grp(apath(phase.map((p) => (p === 2 ? e2 : e1)), kt, T, 'ln'), phase.map((p) => p >= 1), kt, T);
  o += acircle(phase.map((p) => px(st[p].mu[0])), phase.map((p) => py(st[p].mu[1])), kt, T, 4, 'ln-f');
  o += text(434, 16, 'parameter plane：(C, D) 的 belief', 'tb', 'middle');
  // 读数
  const say = [
    ['看到 (1, 1)：只知道 C + D ≈ 1，mean 停在 band 上离 0 最近的 (0.5, 0.5)', 'ts'],
    ['看到 (2, 2)：两条 band 交于 (0, 1)，line 是 y = t', 'ts'],
    ['看到 (3, 2)：innovation −1，K = (−2/3, 1/2)，mean 到 (2/3, 1/2)，ellipse 变小', 'tl'],
  ];
  say.forEach(([s, cls], j) => { o += atext(280, 236, s, cls, 'middle', phase.map((p) => p === j), kt, T); });
  return svgA(560, 246, o, '动图：用 Kalman filter 的 update 一个一个加入三个点。左边是当前的 line，右边是 (C, D) parameter plane：每个点是一条 band，belief 的 mean 依次是 (0.5, 0.5)、(0, 1)、(2/3, 1/2)，ellipse 在第三个点之后变小');
}

// ---------- 6. EKF 的 update 是 Gauss–Newton 的第一步 ----------
function ekfA() {
  const mb = 3, Pb = 0.25, z = 3.95, R = 0.0025;
  const h = (x) => Math.sqrt(x * x + 4), dh = (x) => x / Math.sqrt(x * x + 4);
  const it = [mb];
  for (let k = 0; k < 3; k++) { const x = it[it.length - 1], H = dh(x), K = (Pb * H) / (H * H * Pb + R); it.push(mb + K * (z - h(x) - H * (mb - x))); }
  // it = [3, 3.4081, 3.40086, 3.40085]
  const T = 7.2, kt = [0, 1.6 / T, 2.6 / T, 4.2 / T, 5.0 / T, 6.4 / T, 1];
  const ph = [0, 0, 1, 1, 2, 2, 0];
  let o = '';
  // 上：track 与 landmark
  const sx = lin(-0.4, 4.3, 30, 540), y0 = 112, sy = (v) => y0 - v * 40;
  o += line(sx(-0.4), y0, sx(4.3), y0, 'ink-b');
  for (const v of [0, 1, 2, 3, 4]) o += line(sx(v), y0, sx(v), y0 + 4, 'axis') + text(sx(v), y0 + 18, String(v), 'ts', 'middle');
  o += rect(sx(0) - 5, sy(2) - 12, 10, 20, 'solid2', 1) + text(sx(0) + 10, sy(2) - 2, 'landmark (0, 2)', 'ts', 'start');
  // range 读数 z = 3.95：以 landmark 为中心的 circle，和 track 交在 3.4062
  const arc = []; for (let k = 0; k <= 40; k++) { const t = (-14 - (22 * k) / 40) * Math.PI / 180; arc.push([sx(z * Math.cos(t)), sy(2 + z * Math.sin(t))]); }
  o += path(d(arc), 'dash') + text(arc[0][0] - 6, arc[0][1] - 4, 'range z = 3.95', 'ts', 'end');
  // prior ±σ
  o += rect(sx(2.5), y0 - 3, sx(3.5) - sx(2.5), 6, 'wash') + text(sx(3), y0 + 34, 'prior N(3, 0.5²) 的 ±σ', 'ts', 'middle');
  const rx = ph.map((p) => sx(it[p]));
  o += `<path d="M${f1(sx(0))} ${f1(sy(2) + 8)}L${f1(rx[0])} ${f1(y0 - 18)}" class="mute">${anim('d', rx.map((x) => `M${f1(sx(0))} ${f1(sy(2) + 8)}L${f1(x)} ${f1(y0 - 18)}`), kt, T)}</path>`;
  o += arobot(rx, y0, kt, T, 'paper');
  // 下：放大的尺子 [3.396, 3.412]
  const zx = lin(3.396, 3.412, 70, 530), zy = 196;
  o += line(zx(3.396), zy, zx(3.412), zy, 'axis');
  for (let v = 3.396; v <= 3.4121; v += 0.004) o += line(zx(v), zy - 4, zx(v), zy + 4, 'axis') + text(zx(v), zy + 32, v.toFixed(3), 'ts', 'middle');
  o += text(zx(3.396), zy - 40, 'track 上 3.396 到 3.412 这一小段，放大：', 'ts', 'start');
  const mk = (v, lab, up, cls) => line(zx(v), zy - 9, zx(v), zy + 9, cls === 'tl' ? 'ln' : 'ink') + text(zx(v), up ? zy - 14 : zy + 18, lab, cls, 'middle');
  o += mk(it[1], 'EKF = 第 1 步：3.4081', true, 'tl');
  o += mk(it[3], 'MAP 3.4009', true, 't');
  o += mk(3.4005, 'posterior mean 3.4005', false, 'ts');
  o += mk(Math.sqrt(z * z - 4), '只看 z：3.4062', false, 'ts');
  o += acircle(ph.map((p) => (p === 0 ? zx(3.396) - 26 : zx(it[p]))), ph.map(() => zy), kt, T, 5, 'ln-f');
  o += atext(zx(3.396) - 26, zy - 12, '3.0', 'ts', 'middle', ph.map((p) => p === 0), kt, T);
  o += atext(280, 248, '从 prior mean 3 出发：一次 Gauss–Newton 就是 EKF 的 update', 'ts', 'middle', ph.map((p) => p === 0), kt, T);
  o += atext(280, 248, '第 1 步：3.4081，EKF 到此为止', 'tl', 'middle', ph.map((p) => p === 1), kt, T);
  o += atext(280, 248, '在 3.4081 重新 linearize 再走一步：3.4009，已经是 MAP', 'tl', 'middle', ph.map((p) => p === 2), kt, T);
  return svgA(560, 256, o, '动图：robot 在 track 上，landmark 在 (0, 2)，读到 range 3.95。从 prior mean 3 出发，第一次 Gauss–Newton 到 3.4081，正是 EKF 的结果；在那里重新 linearize 再走一步到 3.4009，即 MAP');
}

// ---------- 7. ICP 的一步：先消掉 translation，再解一个角度 ----------
function kabschA() {
  const m = [[0, 0], [3, 0], [0, 3]], s = [[4, 1], [6.4, 2.8], [2.3, 3.3]];
  const mb = [1, 1], sb = [(4 + 6.4 + 2.3) / 3, (1 + 2.8 + 3.3) / 3];
  let A = 0, B = 0;
  for (let i = 0; i < 3; i++) { const a = [m[i][0] - mb[0], m[i][1] - mb[1]], b = [s[i][0] - sb[0], s[i][1] - sb[1]]; A += a[0] * b[0] + a[1] * b[1]; B += a[0] * b[1] - a[1] * b[0]; }
  const th = Math.atan2(B, A);
  // 三个阶段：model 原位 → 平移使 centroid 重合 → 绕 centroid 转 θ
  const T = 7.6, kt = [0, 1.6 / T, 2.8 / T, 4.0 / T, 5.4 / T, 6.6 / T, 1];
  const pa = [0, 0, 1, 1, 2, 2, 0];
  const pose = (p) => (q) => {
    if (p === 0) return q;
    const c = [q[0] - mb[0], q[1] - mb[1]];
    if (p === 1) return [c[0] + sb[0], c[1] + sb[1]];
    return [Math.cos(th) * c[0] - Math.sin(th) * c[1] + sb[0], Math.sin(th) * c[0] + Math.cos(th) * c[1] + sb[1]];
  };
  const u = 44, X = (v) => 40 + (v + 0.4) * u, Y = (v) => 214 - (v + 0.4) * u;
  let o = line(X(-0.4), Y(0), X(7.2), Y(0), 'axis') + line(X(0), Y(-0.4), X(0), Y(4.2), 'axis');
  for (const v of [2, 4, 6]) o += line(X(v), Y(0), X(v), Y(0) + 4, 'axis') + text(X(v), Y(0) + 16, String(v), 'ts', 'middle');
  for (const v of [2, 4]) o += line(X(0) - 4, Y(v), X(0), Y(v), 'axis') + text(X(0) - 7, Y(v) + 4, String(v), 'ts', 'end');
  o += poly(s.map(([x, y]) => [X(x), Y(y)]), 'wash');
  for (const [x, y] of s) o += circle(X(x), Y(y), 4.5, 'ink-f');
  o += text(X(6.4) + 8, Y(2.8) + 4, 'scene', 'ts', 'start');
  const tri = (p) => d(m.map(pose(p)).map(([x, y]) => [X(x), Y(y)])) + 'Z';
  o += apath(pa.map(tri), kt, T, 'ln');
  for (let i = 0; i < 3; i++) o += acircle(pa.map((p) => X(pose(p)(m[i])[0])), pa.map((p) => Y(pose(p)(m[i])[1])), kt, T, 4, 'paper');
  const cross = (x, y) => `M${f1(x - 6)} ${f1(y)}h12M${f1(x)} ${f1(y - 6)}v12`;
  const cm = pa.map((p) => pose(p)(mb));
  o += `<path d="${cross(X(cm[0][0]), Y(cm[0][1]))}" class="ln">${anim('d', cm.map(([x, y]) => cross(X(x), Y(y))), kt, T)}</path>`;
  o += `<path d="${cross(X(sb[0]), Y(sb[1]))}" class="ink"/>`;
  o += atext(X(0) - 6, Y(3) + 4, 'model', 'tl', 'end', pa.map((p) => p === 0), kt, T);
  // 右边的说明
  const R0 = 382;
  o += text(R0, 30, 'centroid：model (1, 1)', 'ts', 'start') + text(R0, 46, 'scene (4.233, 2.367)', 'ts', 'start');
  o += atext(R0, 70, '第 0 步：model 在原位', 'tb', 'start', pa.map((p) => p === 0), kt, T);
  o += atext(R0, 70, '第 1 步：消掉 translation', 'tb', 'start', pa.map((p) => p === 1), kt, T);
  o += atext(R0, 70, '第 2 步：只剩一个角度', 'tb', 'start', pa.map((p) => p === 2), kt, T);
  o += atext(R0, 92, '两个 centroid 不重合', 'ts', 'start', pa.map((p) => p === 0), kt, T);
  o += atext(R0, 92, 'p* 让两个 centroid 重合', 'ts', 'start', pa.map((p) => p === 1), kt, T);
  o += atext(R0, 92, `θ* = atan2(7.1, 9.3) = ${(th * 180 / Math.PI).toFixed(2)}°`, 'tl', 'start', pa.map((p) => p === 2), kt, T);
  o += text(R0, 140, '和 line fit 先减去 mean、', 'ts', 'start') + text(R0, 158, '消掉 intercept 是同一步：', 'ts', 'start') + text(R0, 176, '先对齐 mean，再解剩下的。', 'ts', 'start');
  return svgA(560, 236, o, '动图：MIT 6.4210 的三个点。Model 三角形先平移使 centroid 与 scene 的 centroid 重合，再绕 centroid 转 37.36 度对上 scene');
}

export default {
  'thread-least-squares-two': two,
  'thread-least-squares-weight': weightA,
  'thread-least-squares-elim': elimA,
  'thread-least-squares-func': funcA,
  'thread-least-squares-rls': rlsA,
  'thread-least-squares-ekf': ekfA,
  'thread-least-squares-kabsch': kabschA,
};
