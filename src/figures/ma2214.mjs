import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 动图的时间轴：每一帧一个时长，返回 keyTimes 和总时长 ----------
function timeline(durs) {
  const T = durs.reduce((s, v) => s + v, 0);
  const kt = [];
  let t = 0;
  for (const v of durs) { kt.push(t / T); t += v; }
  kt.push(1);
  return { T, kt, n: durs.length };
}
// 某个元素在哪些帧可见：cond(i) 为真就显示
const showIf = (tl, cond) => {
  const on = [];
  for (let i = 0; i < tl.n; i++) on.push(!!cond(i));
  on.push(on[on.length - 1]);
  return ashow(on, tl.kt, tl.T);
};
const g = (body, anims) => `<g>${body}${anims}</g>`;
const vtx = (x, y, lab, cls = 'paper', tcls = 't', r = 13) => circle(x, y, r, cls) + text(x, y + 4.5, lab, tcls, 'middle');

// ---------- 第 1 站：stars and bars ----------
function bars() {
  const counts = [2, 0, 6, 2, 2], names = ['chocolate', 'lemon', 'sugar', 'glazed', 'plain'];
  const seq = [];
  counts.forEach((c, i) => { for (let k = 0; k < c; k++) seq.push(0); if (i < 4) seq.push(1); });
  const x0 = 40, dx = 32, X = (i) => x0 + i * dx;
  let o = '';
  seq.forEach((s, i) => {
    if (s === 0) o += circle(X(i), 72, 10, 'paper') + circle(X(i), 72, 3.5, 'paper-f');
    else o += rect(X(i) - 2.5, 52, 5, 40, 'solid');
    o += text(X(i), 116, String(s), s ? 'tl' : 't', 'middle');
  });
  // 每种口味的标签放在它那一段的正上方
  let pos = 0;
  counts.forEach((c, i) => {
    const a = pos, b = pos + c - 1;
    const cx = c ? (X(a) + X(b)) / 2 : (X(pos - 1) + X(pos)) / 2;
    o += text(cx, 30, names[i], 'ts', 'middle') + text(cx, 44, '×' + c, 'tb', 'middle');
    pos += c + (i < 4 ? 1 : 0);
  });
  o += text(18, 116, 'bit', 'ts', 'end');
  o += text(280, 146, '12 个 doughnut（○）和 4 根 bar：bar 把 doughnut 分成 5 段，第 i 段有几个就选几个第 i 种。', 'ts', 'middle');
  o += text(280, 164, '读成 0、1：16 位里恰有 4 个 1。反过来任意这样一串也能读回一种选法，所以是 bijection。', 'ts', 'middle');
  return svg(560, 172, o, '选法 2 个 chocolate、0 个 lemon、6 个 sugar、2 个 glazed、2 个 plain 画成 12 个圆和 4 根竖线，对应 bit string 0011000000100100');
}

// ---------- 第 1 站：R(3,3) = 6 ----------
function ramsey() {
  let o = '';
  // 左：K5，外圈 5-cycle 为红（ln），五角星为蓝（dash）
  const c = [140, 118], R = 72;
  const P = (k) => [c[0] + R * Math.sin((2 * Math.PI * k) / 5), c[1] - R * Math.cos((2 * Math.PI * k) / 5)];
  for (let k = 0; k < 5; k++) o += line(...P(k), ...P((k + 2) % 5), 'dash');
  for (let k = 0; k < 5; k++) o += line(...P(k), ...P((k + 1) % 5), 'ln');
  for (let k = 0; k < 5; k++) o += vtx(...P(k), String(k + 1), 'paper', 'tb', 12);
  // 检查：两种颜色都没有 triangle
  const red = new Set(), blue = new Set();
  for (let k = 0; k < 5; k++) { red.add([k, (k + 1) % 5].sort().join()); blue.add([k, (k + 2) % 5].sort().join()); }
  for (const S of [red, blue]) for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) for (let e = b + 1; e < 5; e++)
    if (S.has([a, b].join()) && S.has([b, e].join()) && S.has([a, e].join())) throw new Error('ramsey: mono triangle in K5');
  o += text(c[0], 22, 'K₅：没有同色 triangle', 'tb', 'middle');
  o += text(c[0], 222, '实线（红）：1–2–3–4–5–1', 'ts', 'middle');
  o += text(c[0], 240, '虚线（蓝）：1–3–5–2–4–1', 'ts', 'middle');
  // 右：K6 里的 v 和它的 5 条 edge，3 条红
  const v = [330, 124];
  const nb = [[470, 64], [505, 124], [470, 184], [402, 192], [402, 56]];
  const lab = ['x', 'y', 'z', '', ''];
  for (let k = 0; k < 5; k++) o += line(...v, ...nb[k], k < 3 ? 'ln' : 'dash');
  // x、y、z 之间：问号的三条 edge
  o += line(...nb[0], ...nb[1], 'mute') + line(...nb[1], ...nb[2], 'mute') + line(...nb[0], ...nb[2], 'mute');
  o += circle(...v, 13, 'paper') + vtx(...v, 'v', 'wash-strong ink-s', 'tb', 13);
  for (let k = 0; k < 5; k++) o += vtx(...nb[k], lab[k], 'paper', 'tb', 12);
  o += text(422, 22, 'K₆：看一个 vertex v', 'tb', 'middle');
  o += text(415, 222, '5 条 edge 两种颜色，至少 3 条同色', 'ts', 'middle');
  o += text(415, 240, 'x、y、z 之间有红 edge → 红 triangle，否则全蓝', 'ts', 'middle');
  return svg(560, 250, o, '左：K5 的外圈 5-cycle 涂红、五角星涂蓝，没有同色 triangle；右：K6 中 vertex v 的 5 条 edge 至少 3 条同色，连向 x、y、z');
}

// ---------- 第 2 站：reflection principle ----------
function lattice() {
  const u = 44, O = [52, 262], P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  let o = '';
  for (let x = 0; x <= 4; x++) o += line(...P([x, 0]), ...P([x, 5]), 'grid');
  for (let y = 0; y <= 5; y++) o += line(...P([0, y]), ...P([4, y]), 'grid');
  o += line(...P([0, 0]), ...P([4, 4]), 'mute') + line(...P([0, 1]), ...P([4, 5]), 'dash');
  const tip = P([4, 4]);
  o += text(P([4, 5])[0] + 8, P([4, 5])[1] + 16, 'y = x + 1', 'ts', 'start');
  o += text(tip[0] + 8, tip[1] + 18, 'y = x', 'ts', 'start');
  const walk = (start, steps) => { const pts = [start]; let [x, y] = start; for (const s of steps) { if (s === 'E') x++; else y++; pts.push([x, y]); } return pts; };
  const first = walk([0, 0], ['E', 'N', 'N']);
  const rest = walk([1, 2], ['E', 'N', 'E', 'N', 'E']);
  const refl = walk([1, 2], ['N', 'E', 'N', 'E', 'N']);
  o += path(d(first.map(P)), 'ink-b') + path(d(rest.map(P)), 'ink-b') + path(d(refl.map(P)), 'ln');
  o += circle(...P([0, 0]), 4, 'ink-f') + circle(...P([1, 2]), 5.5, 'ln-f') + circle(...P([4, 4]), 4.5, 'ink-f') + circle(...P([3, 5]), 4.5, 'ln-f');
  o += text(P([0, 0])[0] - 8, P([0, 0])[1] + 16, '(0, 0)', 'ts', 'middle');
  o += text(P([1, 2])[0] - 9, P([1, 2])[1] - 2, '(1, 2)', 'tl', 'end');
  o += text(P([4, 4])[0] + 8, P([4, 4])[1] + 4, '(4, 4)', 'tb', 'start');
  o += text(P([3, 5])[0], P([3, 5])[1] - 10, '(3, 5)', 'tl', 'middle');
  const X = 300;
  o += text(X, 40, '黑色：一条 bad path', 'tb');
  o += text(X, 60, 'E N N E N E N E，在 (1, 2) 第一次', 'ts') + text(X, 76, '碰到 y = x + 1', 'ts');
  o += text(X, 106, '彩色：(1, 2) 之后每一步 E、N 对调', 'tl');
  o += text(X, 126, '后半段原来有 3 个 E、2 个 N，', 'ts') + text(X, 142, '对调后是 2 个 E、3 个 N，', 'ts') + text(X, 158, '终点从 (4, 4) 变成 (3, 5)', 'ts');
  o += text(X, 190, 'bad path 的个数 = 到 (3, 5) 的 path 数', 't') + text(X, 210, '= C(8, 3) = 56', 't');
  o += text(X, 240, 'good path = 70 − 56 = 14', 'tb');
  return svg(560, 282, o, '4 乘 4 的 lattice，一条越过 diagonal 的 path 在第一次碰到 y 等于 x 加 1 的点 (1, 2) 之后被反射，终点从 (4, 4) 变成 (3, 5)');
}

// ---------- 第 3 站：4 个元素的 24 个 permutation，9 个 derangement ----------
function derange() {
  const perms = [];
  const rec = (p, left) => { if (!left.length) { perms.push(p); return; } for (const v of left) rec([...p, v], left.filter((w) => w !== v)); };
  rec([], [1, 2, 3, 4]);
  let o = text(30, 22, '位置', 'ts', 'end');
  for (let c = 0; c < 6; c++) for (let k = 0; k < 4; k++) o += text(40 + c * 88 + 10 + k * 18.5, 22, String(k + 1), 'ts', 'middle');
  let cnt = 0;
  perms.forEach((p, i) => {
    const r = Math.floor(i / 6), c = i % 6, x = 40 + c * 88, y = 34 + r * 44;
    const der = p.every((v, k) => v !== k + 1);
    if (der) { o += rect(x - 4, y, 80, 34, 'wash', 6); cnt++; }
    else o += rect(x - 4, y, 80, 34, 'frame', 6);
    p.forEach((v, k) => {
      const cx = x + 10 + k * 18.5, cy = y + 17;
      if (v === k + 1) o += circle(cx, cy, 8.5, 'ln') + text(cx, cy + 4.5, String(v), 'tl', 'middle');
      else o += text(cx, cy + 4.5, String(v), der ? 'tb' : 't', 'middle');
    });
  });
  o += text(280, 226, '圈出的数是 fixed point（第 k 位上正好是 k）。浅底的 ' + cnt + ' 个一个 fixed point 都没有，它们是 derangement。', 'ts', 'middle');
  return svg(560, 234, o, '1 2 3 4 的全部 24 个 permutation 排成 4 行，fixed point 被圈出；9 个没有 fixed point 的 permutation 加了浅底');
}

// ---------- 第 4 站：乘积的 coefficient 是一条 anti-diagonal ----------
function conv() {
  const c = [1, 2, 3, 4, 5, 4, 3, 2, 1];
  const sup = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sp = (k) => String(k).split('').map((ch) => sup[+ch]).join('');
  const X0 = 112, Y0 = 52, W = 46, H = 22;
  let o = text(X0 + 2.5 * W, 18, '第三个 factor 的 term', 'ts', 'middle');
  for (let j = 0; j <= 4; j++) o += text(X0 + j * W + W / 2, 40, 'x' + sp(j), 'tb', 'middle');
  o += text(X0 - 10, 18, '前两个 factor', 'ts', 'end') + text(X0 - 10, 34, '乘出的 term', 'ts', 'end');
  for (let k = 0; k <= 8; k++) {
    const y = Y0 + k * H;
    o += text(X0 - 10, y + 15.5, (c[k] === 1 ? '' : c[k]) + 'x' + sp(k), 'tb', 'end');
    for (let j = 0; j <= 4; j++) {
      const x = X0 + j * W, hit = k + j === 10;
      o += rect(x + 1, y + 1, W - 2, H - 2, hit ? 'solid' : 'frame', 3);
      o += text(x + W / 2, y + 15.5, 'x' + sp(k + j), hit ? 'tw' : 'ts', 'middle');
    }
  }
  const X = 368;
  o += text(X, 66, '每一格是一行乘一列', 'tb');
  o += text(X, 86, '实心的三格指数都是 10：', 'ts');
  o += text(X, 110, '3x⁶ · x⁴ → 3', 't') + text(X, 130, '2x⁷ · x³ → 2', 't') + text(X, 150, '1x⁸ · x² → 1', 't');
  o += text(X, 176, 'x¹⁰ 的 coefficient = 6', 'tl');
  o += text(X, 206, '每一格对应一组 (x₁ + x₂, x₃)，', 'ts') + text(X, 222, '乘上 coefficient 就是方案数', 'ts');
  return svg(560, 256, o, '(1+x+…+x⁴)² 的九个 term 排成行，第三个 factor 的五个 term 排成列，指数加起来等于 10 的三格是 3x⁶·x⁴、2x⁷·x³、x⁸·x²，合计 coefficient 6');
}

// ---------- 第 5 站：2×4 board 的 5 种 domino tiling ----------
function tilings() {
  const s = 24;
  const board = (x0, y0, seq, hiLast) => {
    let o = '', c = 0;
    seq.forEach((t, i) => {
      const last = hiLast && i === seq.length - 1, cls = last ? 'wash-strong ink-s' : 'paper';
      if (t === 'V') { o += rect(x0 + c * s, y0, s, 2 * s, cls, 2); c += 1; }
      else { o += rect(x0 + c * s, y0, 2 * s, s, cls, 2) + rect(x0 + c * s, y0 + s, 2 * s, s, cls, 2); c += 2; }
    });
    return o;
  };
  let o = text(160, 22, '最后一列是一块竖放的 domino', 'tb', 'middle') + text(160, 40, '去掉它，前面是 2×3 的任意 tiling：f(3) = 3 种', 'ts', 'middle');
  o += text(442, 22, '最后是两块横放的 domino', 'tb', 'middle') + text(442, 40, '去掉它们，前面是 2×2：f(2) = 2 种', 'ts', 'middle');
  [['V', 'V', 'V', 'V'], ['V', 'H', 'V'], ['H', 'V', 'V']].forEach((sq, i) => { o += board(16 + i * 104, 62, sq, true); });
  [['V', 'V', 'H'], ['H', 'H']].forEach((sq, i) => { o += board(340 + i * 112, 62, sq, true); });
  o += line(328, 56, 328, 120, 'grid');
  o += text(280, 150, '深色的是最后一块。两类不重叠、不遗漏：f(4) = f(3) + f(2) = 3 + 2 = 5', 'ts', 'middle');
  return svg(560, 158, o, '2 乘 4 的 board 用 domino 铺满的 5 种方法，按最后一块是竖放的一块还是横放的两块分成 3 种和 2 种');
}

// ---------- 第 5 站：n 条 line 把 plane 分成几块 ----------
function lines() {
  const L = [[1.57, 0.1], [-1.07, 7.4], [0.54, 1.2], [-0.14, 6.4]]; // y = m x + b，box [0,10]×[0,8]
  const B = { x0: 26, y0: 24, w: 280, h: 224 };
  const sx = lin(0, 10, B.x0, B.x0 + B.w), sy = lin(0, 8, B.y0 + B.h, B.y0);
  const clip = ([m, b]) => {
    const pts = [];
    for (const x of [0, 10]) { const y = m * x + b; if (y >= 0 && y <= 8) pts.push([x, y]); }
    for (const y of [0, 8]) { const x = (y - b) / m; if (x > 0 && x < 10) pts.push([x, y]); }
    pts.sort((p, q) => p[0] - q[0]);
    return [pts[0], pts[pts.length - 1]];
  };
  const X = (a, b) => { const x = (b[1] - a[1]) / (a[0] - b[0]); return [x, a[0] * x + a[1]]; };
  // 检查 6 个交点都在框内（这样框内的块数就是整个 plane 的块数）
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { const p = X(L[i], L[j]); if (!(p[0] > 0.3 && p[0] < 9.7 && p[1] > 0.3 && p[1] < 7.7)) throw new Error('lines: intersection outside box ' + i + j); }
  let o = rect(B.x0, B.y0, B.w, B.h, 'frame');
  const nm = ['ℓ₁', 'ℓ₂', 'ℓ₃', 'ℓ₄'];
  L.forEach((l, i) => {
    const [p, q] = clip(l);
    o += line(sx(p[0]), sy(p[1]), sx(q[0]), sy(q[1]), i === 3 ? 'ln' : 'ink');
  });
  // label 放在每条 line 右端（x 较大的一端）的外侧
  L.forEach((l, i) => {
    const q = clip(l)[1], X1 = sx(q[0]), Y1 = sy(q[1]);
    const at = q[0] > 9.99 ? [X1 + 8, Y1 + 5, 'start'] : q[1] > 7.99 ? [X1, Y1 - 7, 'middle'] : [X1 + 7, Y1 - 6, 'start'];
    o += text(at[0], at[1], nm[i], i === 3 ? 'tl' : 'tb', at[2]);
  });
  const cuts = [0, 1, 2].map((i) => X(L[3], L[i])).sort((a, b) => a[0] - b[0]);
  cuts.forEach((p) => { o += circle(sx(p[0]), sy(p[1]), 4.5, 'ln-f'); });
  const [p0, p1] = clip(L[3]);
  const ends = [p0, ...cuts, p1];
  for (let k = 0; k < 4; k++) {
    const mx = (ends[k][0] + ends[k + 1][0]) / 2, my = L[3][0] * mx + L[3][1];
    const oy = k === 0 ? 16 : -15; // 第 1 段上方紧贴着 ℓ₂，标在下方
    o += circle(sx(mx), sy(my) + oy, 9, 'paper') + text(sx(mx), sy(my) + oy + 4.5, String(k + 1), 'tl', 'middle');
  }
  const T = 344;
  o += text(T, 50, 'ℓ₁、ℓ₂、ℓ₃ 把 plane 分成 7 块', 'tb');
  o += text(T, 80, '新加的 ℓ₄ 与前 3 条各交一次，', 'ts') + text(T, 96, '3 个交点把它切成 4 段（①–④）', 'ts');
  o += text(T, 126, '每一段穿过原来的一块，', 'ts') + text(T, 142, '把那一块一分为二', 'ts');
  o += text(T, 174, '所以 L₄ = L₃ + 4 = 11', 'tl');
  o += text(T, 204, '一般地，第 n 条被切成 n 段：', 'ts') + text(T, 222, 'L(n) = L(n − 1) + n', 't');
  return svg(560, 256, o, '4 条 general position 的 line，第 4 条被前 3 条切成 4 段，每段把一块 region 一分为二，region 从 7 块变成 11 块');
}

// ---------- 第 6 站：A² 的 entry 数 walk ----------
function walks() {
  const pos = { 1: [0, 0], 2: [1, 0], 3: [1, 1], 4: [0, 1] };
  const E = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]];
  let o = '';
  const panel = (x0, title, walk, note) => {
    const s = 110, P = (v) => [x0 + 30 + pos[v][0] * s, 60 + pos[v][1] * s];
    for (const [a, b] of E) o += line(...P(a), ...P(b), walk ? 'mute' : 'ink');
    if (walk) for (let k = 0; k + 1 < walk.length; k++) {
      const [a, b] = [P(walk[k]), P(walk[k + 1])], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
      o += arrow(a[0] + 15 * ux, a[1] + 15 * uy, b[0] - 15 * ux, b[1] - 15 * uy, 'ln');
    }
    for (const v of [1, 2, 3, 4]) o += vtx(...P(v), String(v), walk && walk.includes(v) && (v === walk[0] || v === walk[walk.length - 1]) ? 'wash-strong ink-s' : 'paper', 'tb');
    o += text(x0 + 85, 24, title, 'tb', 'middle') + text(x0 + 85, 206, note, 'ts', 'middle');
  };
  panel(4, 'graph G', null, '5 条 edge');
  panel(192, 'walk 1 → 2 → 3', [1, 2, 3], '经过 2');
  panel(380, 'walk 1 → 4 → 3', [1, 4, 3], '经过 4');
  o += text(280, 234, '从 1 到 3、长度为 2 的 walk 恰好两条，中间点必须同时是 1 和 3 的 neighbour：(A²)₁₃ = 2', 'ts', 'middle');
  return svg(560, 242, o, '4 个 vertex 的 graph：正方形 1-2-3-4 加 diagonal 1-3；从 1 到 3 长度为 2 的 walk 只有经过 2 和经过 4 两条');
}

// ---------- 第 6 站：G 不 connected，complement connected ----------
function complement() {
  const pos = (x0) => ({ 1: [x0, 70], 2: [x0 - 46, 150], 3: [x0 + 46, 150], 4: [x0 + 150, 70], 5: [x0 + 150, 150] });
  const all = [];
  for (let a = 1; a <= 5; a++) for (let b = a + 1; b <= 5; b++) all.push([a, b]);
  const G = [[1, 2], [1, 3], [2, 3], [4, 5]];
  const inG = (a, b) => G.some(([u, v]) => (u === a && v === b) || (u === b && v === a));
  const comp = all.filter(([a, b]) => !inG(a, b));
  if (comp.length !== 10 - G.length) throw new Error('complement: count');
  let o = '';
  const L = pos(70), R = { 1: [340, 52], 2: [340, 112], 3: [340, 172], 4: [490, 82], 5: [490, 142] };
  for (const [a, b] of G) o += line(...L[a], ...L[b], 'ink-b');
  for (const [a, b] of comp) o += line(...R[a], ...R[b], 'ln');
  for (const v of [1, 2, 3, 4, 5]) o += vtx(...L[v], String(v), 'paper', 'tb', 13) + vtx(...R[v], String(v), 'paper', 'tb', 13);
  o += text(L[1][0] + 75, 26, 'G：两个 component', 'tb', 'middle');
  o += text(415, 26, 'G 的 complement', 'tb', 'middle');
  o += text(L[1][0] + 75, 202, '4 条 edge', 'ts', 'middle');
  o += text(415, 202, `C(5, 2) − 4 = ${comp.length} 条：{1, 2, 3} 与 {4, 5} 之间全连`, 'ts', 'middle');
  o += text(280, 230, '1 和 2 在 G 里同一个 component，complement 里经过 4 连起来：1–4–2', 'ts', 'middle');
  return svg(560, 240, o, '左：G 由 triangle 1-2-3 和 edge 4-5 组成；右：G 的 complement 是 {1,2,3} 与 {4,5} 之间的全部 6 条 edge，是 connected 的');
}

// ---------- 第 6 站：P4 是 self-complementary ----------
function selfcomp() {
  const pos = { 1: [0, 0], 2: [1, 0], 3: [1, 1], 4: [0, 1] };
  const P4 = [[1, 2], [2, 3], [3, 4]];
  const all = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];
  const has = (E, a, b) => E.some(([u, v]) => (u === a && v === b) || (u === b && v === a));
  const C = all.filter(([a, b]) => !has(P4, a, b));
  // 检查 f 是 isomorphism：P4 的 edge 映到 complement 的 edge
  const f = { 1: 3, 2: 1, 3: 4, 4: 2 };
  for (const [a, b] of all) if (has(P4, a, b) !== has(C, f[a], f[b])) throw new Error('selfcomp: f not iso');
  let o = '';
  const panel = (x0, E, cls, title) => {
    const s = 96, Q = (v) => [x0 + pos[v][0] * s, 62 + pos[v][1] * s];
    for (const [a, b] of E) o += line(...Q(a), ...Q(b), cls);
    for (const v of [1, 2, 3, 4]) o += vtx(...Q(v), String(v), 'paper', 'tb', 13);
    o += text(x0 + s / 2, 30, title, 'tb', 'middle');
  };
  panel(40, P4, 'ink-b', 'P₄：1–2–3–4');
  panel(230, C, 'ln', 'complement：3–1–4–2');
  const X = 400;
  o += text(X, 70, 'f(1) = 3，f(2) = 1，', 't') + text(X, 90, 'f(3) = 4，f(4) = 2', 't');
  o += text(X, 124, 'edge 12 → 31', 'ts') + text(X, 142, 'edge 23 → 14', 'ts') + text(X, 160, 'edge 34 → 42', 'ts');
  o += text(X, 190, '三条都是 complement 的 edge', 'ts');
  return svg(560, 206, o, 'P4 的 edge 是 12、23、34；它的 complement 的 edge 是 13、14、24，也是一条 path 3-1-4-2；isomorphism f 把 1、2、3、4 送到 3、1、4、2');
}

// ---------- 第 6 站：Euler circuit 的动图 ----------
function eulerA() {
  const P = { A: [130, 56], B: [130, 206], C: [270, 131], D: [410, 56], E: [410, 206] };
  const E = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['C', 'D'], ['D', 'E'], ['E', 'C']];
  // 帧：0 开始；1–3 第一圈；4 卡住；5 回到 C；6–8 第二圈；9 拼接结果
  const tl = timeline([1.4, 0.8, 0.8, 0.8, 2.2, 1.4, 0.8, 0.8, 0.8, 3.2]);
  const usedAt = [1, 2, 3, 6, 7, 8]; // 第 k 条 edge 在哪一帧被走过
  let o = '';
  E.forEach(([a, b], k) => {
    o += line(...P[a], ...P[b], 'mute');
    o += g(line(...P[a], ...P[b], k < 3 ? 'ln' : 'ink-b'), showIf(tl, (i) => i >= usedAt[k]));
  });
  const deg = { A: 2, B: 2, C: 4, D: 2, E: 2 };
  for (const v of Object.keys(P)) {
    o += vtx(...P[v], v, 'paper', 'tb', 14);
    const [x, y] = P[v], dy = v === 'C' ? 46 : y < 131 ? -28 : 38;
    o += text(x, y + dy, 'degree ' + deg[v], 'ts', 'middle');
  }
  // C 被点名的那两帧，画一个圈
  o += g(circle(...P.C, 27, 'ln-dash'), showIf(tl, (i) => i === 4 || i === 5));
  // 走的人：一个点
  const at = ['A', 'B', 'C', 'A', 'A', 'C', 'D', 'E', 'C', 'A'];
  const xs = at.map((v) => f1(P[v][0])), ys = at.map((v) => f1(P[v][1] - 0));
  xs.push(xs[xs.length - 1]); ys.push(ys[ys.length - 1]);
  o += `<circle cx="${xs[0]}" cy="${ys[0]}" r="20" class="ln">${anim('cx', xs, tl.kt, tl.T, true)}${anim('cy', ys, tl.kt, tl.T, true)}</circle>`;
  // 最终顺序的编号
  const order = [['A', 'B', '1'], ['B', 'C', '2'], ['C', 'D', '3'], ['D', 'E', '4'], ['E', 'C', '5'], ['C', 'A', '6']];
  const C0 = P.C;
  let nums = '';
  for (const [a, b, s] of order) {
    const m = [(P[a][0] + P[b][0]) / 2, (P[a][1] + P[b][1]) / 2];
    const dx = m[0] - C0[0], dy = m[1] - C0[1], L = Math.hypot(dx, dy) || 1;
    const off = a === 'A' && b === 'B' ? [-18, 0] : a === 'D' && b === 'E' ? [18, 0] : [0, 18 * Math.sign(dy)];
    void L; void dx;
    nums += circle(m[0] + off[0], m[1] + off[1], 9, 'paper') + text(m[0] + off[0], m[1] + off[1] + 4.5, s, 'tl', 'middle');
  }
  o += g(nums, showIf(tl, (i) => i === 9));
  const msg = [
    [0, 0, '从 A 出发，每次沿一条没走过的 edge 走'],
    [1, 3, '第一圈：A → B → C → A'],
    [4, 4, '回到 A，A 的 edge 用完了，C–D、D–E、E–C 还剩着'],
    [5, 5, 'C 在第一圈上，而且还有没走过的 edge'],
    [6, 8, '从 C 出发走第二圈：C → D → E → C'],
    [9, 9, '在 C 处把第二圈接进去：A → B → C → D → E → C → A'],
  ];
  for (const [a, b, s] of msg) o += `<text x="280" y="272" class="tb" text-anchor="middle">${s}${showIf(tl, (i) => i >= a && i <= b)}</text>`;
  return svgA(560, 280, o, '动图：bowtie graph 上从 A 出发走 trail，第一圈 A-B-C-A 回到 A 后卡住，再从 C 走第二圈 C-D-E-C，在 C 处拼成 Euler circuit');
}

// ---------- 第 7 站：BFS 2-colouring 找到 odd cycle ----------
function bfsA() {
  const P = { 0: [200, 40], 1: [130, 110], 2: [270, 110], 3: [70, 180], 4: [190, 180], 5: [310, 180], 6: [130, 250] };
  const layer = { 0: 0, 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3 };
  const E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [3, 6], [4, 6], [4, 5]];
  // 帧：0 未上色；1–4 逐层上色；5 检查出冲突的 edge；6 画出 odd cycle
  const tl = timeline([1.4, 1, 1, 1, 1, 2.2, 3.4]);
  let o = '';
  for (const [a, b] of E) {
    const bad = a === 4 && b === 5;
    o += line(...P[a], ...P[b], 'ink');
    if (bad) o += g(line(...P[a], ...P[b], 'ln'), showIf(tl, (i) => i >= 5));
  }
  const cyc = [0, 1, 4, 5, 2, 0];
  o += g(path(d(cyc.map((v) => P[v])), 'ln'), showIf(tl, (i) => i === 6));
  for (const v of Object.keys(P)) {
    const [x, y] = P[v], L = layer[v];
    o += vtx(x, y, v, 'paper', 'ts', 14);
    o += g(vtx(x, y, v, L % 2 === 0 ? 'solid' : 'wash-strong ink-s', L % 2 === 0 ? 'tw' : 'tb', 14), showIf(tl, (i) => i >= L + 1));
  }
  for (let L = 0; L < 4; L++) o += text(4, 44 + L * 70, 'dist ' + L, 'ts', 'start');
  const X = 350;
  const msg = [
    [0, 0, ['从 vertex 0 做 BFS，', '按 distance 一层一层走']],
    [1, 4, ['distance 是 even 的涂深色，', 'odd 的涂浅色']],
    [5, 5, ['逐条检查 edge：4–5 两端', 'distance 都是 2，同色']],
    [6, 6, ['0→1→4 和 0→2→5 两条 BFS path', '加上 4–5：长度 2 + 2 + 1 = 5', '的 odd cycle，所以不是 bipartite']],
  ];
  for (const [a, b, ls] of msg) ls.forEach((s, k) => { o += `<text x="${X}" y="${92 + k * 20}" class="${k === 0 ? 'tb' : 't'}" text-anchor="start">${s}${showIf(tl, (i) => i >= a && i <= b)}</text>`; });
  return svgA(560, 266, o, '动图：从 vertex 0 做 BFS，按 distance 的 parity 给 vertex 上两种颜色，edge 4-5 两端同色，与两条 BFS path 合成长度 5 的 odd cycle');
}

// ---------- 第 7 站 / 开头：greedy matching 卡住 ----------
const MS = { a: [130, 52], b: [230, 52], c: [330, 52], d: [430, 52], 1: [130, 172], 2: [230, 172], 3: [330, 172], 4: [430, 172] };
const ME = [['a', '1'], ['a', '2'], ['b', '1'], ['c', '2'], ['c', '3'], ['d', '3'], ['d', '4']];
function greedy() {
  const M = new Set(['a1', 'c2', 'd3']);
  let o = '';
  for (const [s, p] of ME) o += line(...MS[s], ...MS[p], M.has(s + p) ? 'ln' : 'mute');
  for (const v of ['a', 'b', 'c', 'd']) o += vtx(...MS[v], v, v === 'b' ? 'wash-strong ink-s' : 'paper', 'tb', 14);
  for (const v of ['1', '2', '3', '4']) o += vtx(...MS[v], v, v === '4' ? 'wash-strong ink-s' : 'paper', 'tb', 14);
  o += text(60, 56, 'student', 'ts', 'end') + text(60, 176, 'project', 'ts', 'end');
  o += text(MS.b[0], 28, 'b 只能做 1，1 已被 a 拿走', 'tl', 'middle');
  o += text(MS[4][0], 204, '4 没人拿', 'tl', 'middle');
  o += text(280, 236, '按 a、b、c、d 的顺序，每人拿编号最小的空 project：a→1，b 无处可去，c→2，d→3。', 'ts', 'middle');
  o += text(280, 254, '可是 b→1、a→2、c→3、d→4 能让四个人都有 project。', 'ts', 'middle');
  return svg(560, 262, o, '四个 student a b c d 与四个 project 1 2 3 4 的 bipartite graph；greedy 给出 a1、c2、d3，b 和 4 没有配上');
}

// ---------- 第 7 站：augmenting path 动图 ----------
function augmentA() {
  const pathV = ['b', '1', 'a', '2', 'c', '3', 'd', '4'];
  const M0 = new Set(['a1', 'c2', 'd3']);
  const key = (x, y) => (/[a-d]/.test(x) ? x + y : y + x);
  // 帧：0 初始；1–7 逐条走 path；8 翻转后
  const tl = timeline([2, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 1.4, 3.6]);
  let o = '';
  const pathEdges = [];
  for (let k = 0; k + 1 < pathV.length; k++) pathEdges.push(key(pathV[k], pathV[k + 1]));
  for (const [s, p] of ME) {
    const k = s + p, onPath = pathEdges.indexOf(k), inM = M0.has(k);
    o += line(...MS[s], ...MS[p], 'mute');
    // 翻转前的 M
    if (inM) o += g(line(...MS[s], ...MS[p], 'ln'), showIf(tl, (i) => i < 8));
    // 走 path 时的高亮：不在 M 的画成粗黑虚线
    if (onPath >= 0 && !inM) o += g(line(...MS[s], ...MS[p], 'ink-b'), showIf(tl, (i) => i >= onPath + 1 && i < 8));
    // 翻转后：原来不在 M 的 path edge 进入 M
    if (onPath >= 0 && !inM) o += g(line(...MS[s], ...MS[p], 'ln'), showIf(tl, (i) => i === 8));
  }
  for (const v of ['a', 'b', 'c', 'd', '1', '2', '3', '4']) {
    const exposed = v === 'b' || v === '4';
    o += vtx(...MS[v], v, 'paper', 'tb', 14);
    if (exposed) o += g(vtx(...MS[v], v, 'wash-strong ink-s', 'tb', 14), showIf(tl, (i) => i < 8));
  }
  o += text(60, 56, 'student', 'ts', 'end') + text(60, 176, 'project', 'ts', 'end');
  o += text(280, 16, '彩色粗线：matching M　　黑色粗线：path 上不在 M 的 edge', 'ts', 'middle');
  const msg = [
    [0, 0, 'M = {a1, c2, d3}，b 和 4 是 exposed vertex（浅底）'],
    [1, 6, '从 b 出发，不在 M 的 edge 与 M 的 edge 交替着走'],
    [7, 7, '走到 exposed 的 4：b–1–a–2–c–3–d–4 是 augmenting path'],
    [8, 8, '把 path 上 7 条 edge 全部翻转：|M| 从 3 变成 4'],
  ];
  for (const [a, b, s] of msg) o += `<text x="280" y="236" class="tb" text-anchor="middle">${s}${showIf(tl, (i) => i >= a && i <= b)}</text>`;
  o += `<text x="280" y="256" class="ts" text-anchor="middle">path 上 M 的 edge 3 条、不在 M 的 4 条，翻转后正好多出一条${showIf(tl, (i) => i >= 7)}</text>`;
  return svgA(560, 264, o, '动图：从 exposed 的 student b 出发，沿 b-1-a-2-c-3-d-4 交替走到 exposed 的 project 4，翻转 path 上的 edge，matching 从 3 条变成 4 条');
}

// ---------- 第 8 站：4 个 labelled vertex 上的 16 个 tree ----------
function trees4() {
  const pos = { 1: [0, 0], 2: [1, 0], 3: [1, 1], 4: [0, 1] };
  const all = [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]];
  const trees = [];
  for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) for (let c = b + 1; c < 6; c++) {
    const es = [all[a], all[b], all[c]];
    const par = { 1: 1, 2: 2, 3: 3, 4: 4 }, find = (x) => (par[x] === x ? x : (par[x] = find(par[x])));
    let ok = true;
    for (const [u, v] of es) { const ru = find(u), rv = find(v); if (ru === rv) ok = false; else par[ru] = rv; }
    if (ok) trees.push(es);
  }
  const isStar = (es) => { const dg = {}; for (const [u, v] of es) { dg[u] = (dg[u] || 0) + 1; dg[v] = (dg[v] || 0) + 1; } return Object.values(dg).includes(3); };
  const paths = trees.filter((t) => !isStar(t)), stars = trees.filter(isStar);
  const list = [...paths, ...stars];
  let o = '';
  list.forEach((es, i) => {
    const r = Math.floor(i / 8), c = i % 8, x0 = 14 + c * 68, y0 = 34 + r * 86, s = 36;
    const P = (v) => [x0 + 12 + pos[v][0] * s, y0 + 12 + pos[v][1] * s];
    o += rect(x0 - 2, y0 - 2, 64, 64, isStar(es) ? 'wash' : 'frame', 6);
    for (const [u, v] of es) o += line(...P(u), ...P(v), 'ink-b');
    for (const v of [1, 2, 3, 4]) o += circle(...P(v), 8, 'paper') + text(P(v)[0], P(v)[1] + 4, String(v), 'ts', 'middle');
  });
  o += text(14, 22, '12 个 path：4! = 24 种排法，每条 path 正着反着各算了一次，24 / 2 = 12', 'ts', 'start');
  o += text(14 + 4 * 68, 204, '4 个 star（浅底）：center 有 4 种选法', 'ts', 'start');
  o += text(280, 230, '合计 16 = 4²，即 nⁿ⁻² 在 n = 4 时的值', 'tb', 'middle');
  return svg(560, 238, o, '顶点 1 到 4 上全部 16 个 labelled tree：12 个是 path，4 个是 star');
}

// ---------- 第 8 站：deletion–contraction ----------
function delcon() {
  const pos = { 1: [0, 0], 2: [1, 0], 3: [1, 1], 4: [0, 1] };
  const E = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]];
  // 用代码数 spanning tree：G、G − e、G · e（multigraph，edge 带编号）
  const countST = (n, edges) => {
    let c = 0;
    const m = edges.length;
    for (let mask = 0; mask < 1 << m; mask++) {
      const pick = edges.filter((_, i) => mask >> i & 1);
      if (pick.length !== n - 1) continue;
      const par = {}; const find = (x) => (par[x] === undefined || par[x] === x ? (par[x] = x) : (par[x] = find(par[x])));
      let ok = true;
      for (const [a, b] of pick) { const ra = find(a), rb = find(b); if (ra === rb) { ok = false; break; } par[ra] = rb; }
      if (ok) c++;
    }
    return c;
  };
  const tG = countST(4, E), tDel = countST(4, E.filter(([a, b]) => !(a === 1 && b === 3)));
  const con = E.filter(([a, b]) => !(a === 1 && b === 3)).map(([a, b]) => [a === 3 ? 1 : a, b === 3 ? 1 : b]); // 3 并进 1（记作 w）
  const tCon = countST(3, con);
  if (tG !== tDel + tCon) throw new Error('delcon: recurrence fails');
  let o = '';
  const s = 92, top = 58;
  const panel = (x0, edges, hi) => {
    const Q = (v) => [x0 + pos[v][0] * s, top + pos[v][1] * s];
    for (const [a, b] of edges) o += line(...Q(a), ...Q(b), hi && a === 1 && b === 3 ? 'ln' : 'ink-b');
    for (const v of [1, 2, 3, 4]) o += vtx(...Q(v), String(v), 'paper', 'tb', 13);
    return Q;
  };
  const Q1 = panel(28, E, true);
  const m = [(Q1(1)[0] + Q1(3)[0]) / 2, (Q1(1)[1] + Q1(3)[1]) / 2];
  o += text(m[0] + 10, m[1] - 4, 'e', 'tl', 'start');
  panel(222, E.filter(([a, b]) => !(a === 1 && b === 3)), false);
  // G · e：w 在中间，2 在右上，4 在左下，各两条 parallel edge
  const W = [462, 104], V2 = [520, 52], V4 = [404, 156];
  const bend = (A, B, k) => {
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy);
    const cx = mx - (dy / L) * k, cy = my + (dx / L) * k;
    return `M${f1(A[0])} ${f1(A[1])}Q${f1(cx)} ${f1(cy)} ${f1(B[0])} ${f1(B[1])}`;
  };
  for (const B of [V2, V4]) o += path(bend(W, B, 16), 'ink-b') + path(bend(W, B, -16), 'ink-b');
  o += circle(...W, 14, 'paper') + vtx(...W, 'w', 'wash-strong ink-s', 'tb', 14) + vtx(...V2, '2', 'paper', 'tb', 13) + vtx(...V4, '4', 'paper', 'tb', 13);
  o += text(74, 26, 'G', 'tb', 'middle') + text(268, 26, 'G − e', 'tb', 'middle') + text(462, 26, 'G · e（1、3 并成 w）', 'tb', 'middle');
  o += text(74, 186, `τ(G) = ${tG}`, 'tl', 'middle');
  o += text(268, 186, `4-cycle：τ = ${tDel}`, 't', 'middle');
  o += text(462, 186, `到 2、到 4 各挑一条：τ = ${tCon}`, 't', 'middle');
  o += text(170, 186, '=', 'tb', 'middle') + text(365, 186, '+', 'tb', 'middle');
  o += text(280, 214, '不含 e 的 spanning tree 是 G − e 的；含 e 的收缩掉 e，一一对应到 G · e 的', 'ts', 'middle');
  return svg(560, 224, o, 'G 是正方形 1-2-3-4 加 diagonal e = 1-3，有 8 个 spanning tree；G 删 e 是 4-cycle，有 4 个；G 收缩 e 后 w 到 2、到 4 各有两条 parallel edge，有 4 个');
}

// ---------- 第 8 站：Prüfer code 动图 ----------
function pruferA() {
  const P = { 1: [190, 120], 2: [96, 52], 7: [96, 188], 3: [300, 120], 6: [410, 120], 4: [500, 52], 5: [500, 188] };
  const E = [[2, 1], [4, 6], [5, 6], [6, 3], [3, 1], [1, 7]];
  const steps = [[2, 1], [4, 6], [5, 6], [6, 3], [3, 1]]; // [删掉的 leaf, 记下的 neighbour]
  // 帧：0 开始；第 k 步（k = 1..5）占两帧：2k−1 高亮，2k 删掉并记下；11 结束
  const durs = [1.6]; for (let k = 0; k < 5; k++) durs.push(1.1, 0.9); durs.push(3);
  const tl = timeline(durs);
  const removedAt = (v) => { const k = steps.findIndex((s) => s[0] === v); return k < 0 ? Infinity : 2 * (k + 1); };
  const hiAt = (v) => { const k = steps.findIndex((s) => s[0] === v); return k < 0 ? -1 : 2 * (k + 1) - 1; };
  let o = '';
  for (const [a, b] of E) {
    const leaf = removedAt(a) < Infinity ? a : b, rAt = Math.min(removedAt(a), removedAt(b)), hAt = rAt - 1;
    void leaf;
    o += g(line(...P[a], ...P[b], 'ink'), showIf(tl, (i) => i < hAt));
    o += g(line(...P[a], ...P[b], 'ln'), showIf(tl, (i) => i === hAt));
    o += g(line(...P[a], ...P[b], 'grid'), showIf(tl, (i) => i >= rAt));
  }
  for (const v of Object.keys(P).map(Number)) {
    const [x, y] = P[v];
    o += g(vtx(x, y, String(v), 'paper', 'tb', 15), showIf(tl, (i) => i < hiAt(v) || (hiAt(v) < 0)));
    if (hiAt(v) > 0) {
      o += g(vtx(x, y, String(v), 'solid', 'tw', 15), showIf(tl, (i) => i === hiAt(v)));
      o += g(circle(x, y, 15, 'grid') + text(x, y + 4.5, String(v), 'ts', 'middle'), showIf(tl, (i) => i >= removedAt(v)));
    }
  }
  // code 的 5 个格子
  const cx = (k) => 214 + k * 40;
  o += text(186, 262, 'Prüfer code', 'tb', 'end');
  steps.forEach(([, nb], k) => {
    o += rect(cx(k) - 16, 244, 32, 28, 'frame', 4);
    o += `<text x="${cx(k)}" y="263" class="tl" text-anchor="middle">${nb}${showIf(tl, (i) => i >= 2 * (k + 1))}</text>`;
  });
  const msg = [[0, 0, '每一步删掉 label 最小的 leaf，记下它的 neighbour']];
  steps.forEach(([lf, nb], k) => {
    msg.push([2 * k + 1, 2 * k + 1, `第 ${k + 1} 步：现在 label 最小的 leaf 是 ${lf}`]);
    msg.push([2 * k + 2, 2 * k + 2, `删掉 ${lf}，记下它的 neighbour ${nb}`]);
  });
  msg.push([11, 11, '只剩 1 和 7 两个 vertex：停。Code 是 (1, 6, 6, 3, 1)']);
  for (const [a, b, s] of msg) o += `<text x="280" y="20" class="tb" text-anchor="middle">${s}${showIf(tl, (i) => i >= a && i <= b)}</text>`;
  return svgA(560, 278, o, '动图：7 个 vertex 的 tree，依次删掉 label 最小的 leaf 2、4、5、6、3，记下 neighbour，得到 Prüfer code 1 6 6 3 1');
}

export default {
  'ma2214-bars': bars,
  'ma2214-ramsey': ramsey,
  'ma2214-complement': complement,
  'ma2214-selfcomp': selfcomp,
  'ma2214-delcon': delcon,
  'ma2214-lattice': lattice,
  'ma2214-derange': derange,
  'ma2214-conv': conv,
  'ma2214-tilings': tilings,
  'ma2214-lines': lines,
  'ma2214-walks': walks,
  'ma2214-euler': eulerA,
  'ma2214-bfs': bfsA,
  'ma2214-greedy': greedy,
  'ma2214-augment': augmentA,
  'ma2214-trees4': trees4,
  'ma2214-prufer': pruferA,
};
