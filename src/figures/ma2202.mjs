import { svg, svgA, d, path, line, rect, circle, poly, text, it, arrow, anim, apath, ashow, f1 } from '../lib/svg.mjs';

// ---------- D8（Dummit–Foote 记号；有的书写 D4）：正方形的 8 个对称 ----------
// 顶点 1..4 逆时针，1 在右上（45°）。元素 r^a s^b：先做 s（关于竖直轴反射），再转 a·90°。
const R = Math.PI / 180;
const SUP = { 2: '²', 3: '³' };
const name = ([a, b]) => (a === 0 && b === 0 ? 'e' : (a ? 'r' + (SUP[a] || '') : '') + (b ? 's' : ''));
const mul = ([a1, b1], [a2, b2]) => [(((a1 + (b1 ? -a2 : a2)) % 4) + 4) % 4, (b1 + b2) % 2];
const D8 = [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]];
const act = ([a, b], [x, y]) => { const X = b ? -x : x, c = Math.cos(a * 90 * R), s = Math.sin(a * 90 * R); return [c * X - s * y, s * X + c * y]; };
const pos = (k) => [Math.cos((45 + 90 * (k - 1)) * R), Math.sin((45 + 90 * (k - 1)) * R)];
const whichPos = ([x, y]) => { let best = 1, bd = 9; for (let k = 1; k <= 4; k++) { const p = pos(k), dd = Math.hypot(p[0] - x, p[1] - y); if (dd < bd) { bd = dd; best = k; } } return best; };
const permOf = (g) => [0, 1, 2, 3, 4].map((i) => (i ? whichPos(act(g, pos(i))) : 0));
function cycles(p, n) {
  const seen = new Set(), out = [];
  for (let i = 1; i <= n; i++) {
    if (seen.has(i)) continue;
    const c = []; let j = i;
    while (!seen.has(j)) { seen.add(j); c.push(j); j = p[j]; }
    if (c.length > 1) out.push('(' + c.join('') + ')');
  }
  return out.length ? out.join('') : 'e';
}
// 画一个带标号的小正方形：g 作用后的样子。edge12 为真时把原来的 1–2 边加粗
function mini(cx, cy, h, g, { edge12 = false, axis = false, lab = 'ts' } = {}) {
  const P = ([x, y]) => [cx + h * x, cy - h * y];
  let o = poly([1, 2, 3, 4].map((k) => P(pos(k))), 'wash ink');
  if (axis && g[1]) {
    const ang = (90 + 45 * g[0]) * R, L = 1.15;
    o += line(...P([L * Math.cos(ang), L * Math.sin(ang)]), ...P([-L * Math.cos(ang), -L * Math.sin(ang)]), 'ln-dash');
  }
  if (edge12) o += line(...P(act(g, pos(1))), ...P(act(g, pos(2))), 'ln');
  for (let i = 1; i <= 4; i++) {
    const q = act(g, pos(i)), [x, y] = P([q[0] * 1.42, q[1] * 1.42]);
    o += text(x, y + 4, String(i), lab, 'middle');
  }
  return o;
}

// 开头：先 s 后 r 和先 r 后 s，结果不同（动图）
function orderA() {
  const h = 46;
  const stages = (first) => {
    // 返回每个 keyframe 下 4 个顶点（以及标号）的坐标
    const fl = (p, t) => [p[0] * Math.cos(Math.PI * t), p[1]];
    const ro = (p, t) => { const c = Math.cos(90 * t * R), s = Math.sin(90 * t * R); return [c * p[0] - s * p[1], s * p[0] + c * p[1]]; };
    const flipFull = (p) => [-p[0], p[1]];
    const ops = first === 's' ? [fl, ro] : [ro, fl];
    const full = first === 's' ? [flipFull, (p) => ro(p, 1)] : [(p) => ro(p, 1), flipFull];
    const frames = [], times = [];
    const N = 14, hold0 = 0.8, mv = 1.3, mid = 0.7, end = 2.2, T = hold0 + mv + mid + mv + end;
    const base = [1, 2, 3, 4].map(pos);
    const push = (pts, t) => { frames.push(pts); times.push(t / T); };
    push(base, 0); push(base, hold0);
    for (let k = 1; k <= N; k++) push(base.map((p) => ops[0](p, k / N)), hold0 + (mv * k) / N);
    const after1 = base.map(full[0]);
    push(after1, hold0 + mv + mid);
    for (let k = 1; k <= N; k++) push(after1.map((p) => ops[1](p, k / N)), hold0 + mv + mid + (mv * k) / N);
    push(base.map((p) => full[1](full[0](p))), T * 0.999);
    push(base, T);
    return { frames, times, T };
  };
  let o = '';
  const panel = (cx, first, title, res, stepLabs) => {
    const { frames, times, T } = stages(first);
    const cy = 128, P = ([x, y]) => [cx + h * x, cy - h * y];
    o += text(cx, 22, title, 'tb', 'middle');
    o += line(cx, cy - 84, cx, cy + 84, 'dash') + text(cx + 4, cy - 88, 's 的 axis', 'ts', 'start');
    const kt = times;
    // 最后一帧回到初始：用 discrete 跳回去，前面线性
    const ds = frames.map((F) => d([...F.map(P), P(F[0])]) + 'Z');
    o += apath(ds, kt, T, 'wash ink');
    for (let i = 0; i < 4; i++) {
      const xs = frames.map((F) => f1(P([F[i][0] * 1.32, F[i][1] * 1.32])[0]));
      const ys = frames.map((F) => f1(P([F[i][0] * 1.32, F[i][1] * 1.32])[1] + 5));
      o += `<text x="${xs[0]}" y="${ys[0]}" class="${i === 0 ? 'tl' : 'tb'}" text-anchor="middle">${i + 1}${anim('x', xs, kt, T)}${anim('y', ys, kt, T)}</text>`;
    }
    const tA = 0.8 / T, tB = (0.8 + 1.3 + 0.7) / T, tC = (0.8 + 1.3 + 0.7 + 1.3) / T;
    const show = (a, b) => ashow([0, 1, 0], [0, a, b], T);
    o += `<text x="${cx}" y="${cy + 108}" class="ts" text-anchor="middle">第 1 步：${stepLabs[0]}${show(tA, tB)}</text>`;
    o += `<text x="${cx}" y="${cy + 108}" class="ts" text-anchor="middle">第 2 步：${stepLabs[1]}${show(tB, tC)}</text>`;
    o += text(cx, cy + 128, res, 'ts', 'middle');
  };
  panel(140, 's', '先 s 再 r，记作 rs', '结果：1 和 3 对调，2、4 不动', ['s（翻）', 'r（逆时针转 90°）']);
  panel(420, 'r', '先 r 再 s，记作 sr', '结果：2 和 4 对调，1、3 不动', ['r（逆时针转 90°）', 's（翻）']);
  return svgA(560, 266, o, '动图：标好 1 到 4 的正方形，左边先关于竖直 axis 翻再逆时针转 90 度，右边先转再翻，两边最后的样子不同');
}

// 开头：16 种 2-coloring 按 rotation 分成 6 类
function colorings() {
  const all = [];
  for (let m = 0; m < 16; m++) all.push([0, 1, 2, 3].map((i) => (m >> i) & 1));
  const key = (c) => c.join('');
  const rot = (c, k) => [0, 1, 2, 3].map((i) => c[(i - k + 4) % 4]);
  const seen = new Set(), orbits = [];
  for (const c of all) {
    if (seen.has(key(c))) continue;
    const orb = [];
    for (let k = 0; k < 4; k++) { const cc = rot(c, k); if (!orb.some((x) => key(x) === key(cc))) orb.push(cc); }
    orb.forEach((x) => seen.add(key(x)));
    orbits.push(orb);
  }
  const sq = (cx, cy, c) => {
    const h = 13;
    let q = poly([1, 2, 3, 4].map((k) => [cx + h * pos(k)[0] * 1.2, cy - h * pos(k)[1] * 1.2]), 'ink');
    for (let i = 0; i < 4; i++) q += circle(cx + h * pos(i + 1)[0] * 1.2, cy - h * pos(i + 1)[1] * 1.2, 5.2, c[i] ? 'ink-f' : 'paper');
    return q;
  };
  const labelOf = (orb) => { const n = orb[0].reduce((a, b) => a + b, 0); if (n !== 2) return n + ' 个 black'; const c = orb[0]; return c[0] === c[2] ? '2 个 black，相对' : '2 个 black，相邻'; };
  const order = ['0 个 black', '1 个 black', '2 个 black，相邻', '2 个 black，相对', '3 个 black', '4 个 black'];
  orbits.sort((a, b) => order.indexOf(labelOf(a)) - order.indexOf(labelOf(b)));
  let o = '';
  const rows = [[0, 1, 2], [3, 4, 5]], cell = 40;
  rows.forEach((row, ri) => {
    const widths = row.map((i) => Math.max(orbits[i].length * cell + 16, 92));
    const total = widths.reduce((a, b) => a + b, 0) + 14 * (row.length - 1);
    let x = (560 - total) / 2;
    const y = 14 + ri * 106;
    row.forEach((i, k) => {
      const w = widths[k];
      o += rect(x, y, w, 90, 'frame', 6);
      o += text(x + w / 2, y + 18, labelOf(orbits[i]), 'ts', 'middle');
      const n = orbits[i].length, x0 = x + w / 2 - ((n - 1) * cell) / 2;
      orbits[i].forEach((c, j) => { o += sq(x0 + j * cell, y + 45, c); });
      o += text(x + w / 2, y + 82, n + ' 种', 'ts', 'middle');
      x += w + 14;
    });
  });
  o += text(280, 236, '16 种涂法只有 6 类；每类的大小是 1、4、4、2、4、1，不全是 4', 't', 'middle');
  return svg(560, 244, o, '正方形四个 vertex 各涂 black 或 white，共 16 种，按 rotation 能否互相转到分成 6 类，大小分别是 1、4、4、2、4、1');
}

// 第 1 站：D8 的 8 个元素
function d4() {
  let o = '';
  D8.forEach((g, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const cx = 75 + col * 137, cy = 62 + row * 132;
    o += mini(cx, cy, 30, g, { axis: true, lab: 'tb' });
    o += text(cx, cy + 58, name(g), 'tl', 'middle') + (i ? text(cx + 26, cy + 58, cycles(permOf(g), 4), 'ts', 'start') : '');
  });
  o += text(8, 14, 'rotation：转 0°、90°、180°、270°', 'ts', 'start');
  o += text(8, 146, 'reflection：虚线是 mirror', 'ts', 'start');
  return svg(560, 270, o, 'D8 的 8 个元素各自把标好号的正方形变成什么样子：上排 4 个 rotation，下排 4 个 reflection，每个旁边写着它在 vertex 上的 permutation');
}

// 第 2 站：在 Z12 里从 0 出发每次加 k（动图）
function clockA() {
  const n = 12, rr = 74;
  const P = (cx, cy, k) => [cx + rr * Math.sin((2 * Math.PI * k) / n), cy - rr * Math.cos((2 * Math.PI * k) / n)];
  const steps = 12, mv = 0.32, hold = 0.22, tail = 1.6, T = steps * (mv + hold) + tail;
  let o = '';
  const panel = (cx, k, title, foot) => {
    const cy = 134;
    o += text(cx, 16, title, 'tb', 'middle');
    const seq = []; for (let j = 0; j <= steps; j++) seq.push((j * k) % n);
    // 静态：整条路径的淡色 chord
    for (let j = 0; j < steps; j++) { const a = P(cx, cy, seq[j]), b = P(cx, cy, seq[j + 1]); o += line(...a, ...b, 'grid'); }
    const visitT = {}; seq.forEach((v, j) => { if (!(v in visitT)) visitT[v] = j * (mv + hold); });
    for (let v = 0; v < n; v++) {
      const [x, y] = P(cx, cy, v), [lx, ly] = [cx + (rr + 20) * Math.sin((2 * Math.PI * v) / n), cy - (rr + 20) * Math.cos((2 * Math.PI * v) / n)];
      o += circle(x, y, 5, 'paper');
      if (v in visitT) {
        const t0 = visitT[v] / T;
        o += `<circle cx="${f1(x)}" cy="${f1(y)}" r="5" class="ln-f" opacity="${v === 0 ? 1 : 0}">${t0 > 0 ? ashow([0, 1], [0, t0], T) : ''}</circle>`;
      }
      o += text(lx, ly + 4, String(v), v === 0 ? 'tb' : 'ts', 'middle');
    }
    // 每一段 chord 出现
    for (let j = 0; j < steps; j++) {
      const a = P(cx, cy, seq[j]), b = P(cx, cy, seq[j + 1]), t1 = (j * (mv + hold) + mv) / T;
      o += `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="ln" opacity="0">${ashow([0, 1], [0, t1], T)}</line>`;
    }
    // 移动的点
    const xs = [], ys = [], kt = [];
    for (let j = 0; j < steps; j++) {
      const a = P(cx, cy, seq[j]), b = P(cx, cy, seq[j + 1]), t = j * (mv + hold);
      xs.push(a[0], b[0], b[0]); ys.push(a[1], b[1], b[1]); kt.push(t / T, (t + mv) / T, (t + mv + hold) / T);
    }
    xs.push(xs[xs.length - 1]); ys.push(ys[ys.length - 1]); kt.push(1);
    o += `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="8" class="ink">${anim('cx', xs.map(f1), kt, T)}${anim('cy', ys.map(f1), kt, T)}</circle>`;
    o += text(cx, 252, foot[0], 't', 'middle') + text(cx, 270, foot[1], 'ts', 'middle');
  };
  panel(140, 9, '每次加 9', ['⟨9⟩ = {0, 9, 6, 3}', 'order 4 = 12 / gcd(9, 12)']);
  panel(420, 5, '每次加 5', ['⟨5⟩ 走遍全部 12 个', 'order 12 = 12 / gcd(5, 12)']);
  return svgA(560, 276, o, '动图：Z12 的 12 个元素排成钟面，从 0 出发每次加 9，走过 0、9、6、3 就回到 0；每次加 5 则走遍全部 12 个元素');
}

// 第 2 站：Z12 的 subgroup lattice
function z12lat() {
  const nodes = {
    1: [280, 30, '⟨1⟩ = Z₁₂', 'order 12'],
    2: [170, 100, '⟨2⟩ = {0, 2, 4, 6, 8, 10}', 'order 6'],
    3: [420, 130, '⟨3⟩ = {0, 3, 6, 9}', 'order 4'],
    4: [110, 180, '⟨4⟩ = {0, 4, 8}', 'order 3'],
    6: [300, 205, '⟨6⟩ = {0, 6}', 'order 2'],
    0: [210, 268, '⟨0⟩ = {0}', 'order 1'],
  };
  const edges = [[1, 2], [1, 3], [2, 4], [2, 6], [3, 6], [4, 0], [6, 0]];
  let o = '';
  const bw = (s) => 18 + s.length * 6.6;
  for (const [a, b] of edges) {
    const A = nodes[a], B = nodes[b];
    o += line(A[0], A[1] + 14, B[0], B[1] - 14, 'mute');
  }
  for (const k of Object.keys(nodes)) {
    const [x, y, s, ord] = nodes[k], w = bw(s);
    o += rect(x - w / 2, y - 14, w, 28, 'paper', 6) + text(x, y + 5, s, 't', 'middle');
    o += text(x + w / 2 + 6, y + 5, ord, 'ts', 'start');
  }
  o += text(560, 312, '12 的每个 divisor d 恰好对应一个 order d 的 subgroup；线连着的是“下面的包含在上面的里”', 'ts', 'end');
  return svg(560, 318, o, 'Z12 的全部 6 个 subgroup，按 order 从上到下排，连线表示包含关系');
}

// 第 3 站：q∘p 先做 p 再做 q（动图）
function composeA() {
  const p = [0, 2, 4, 5, 1, 3, 6], q = [0, 3, 4, 5, 6, 1, 2];
  const X = (i) => 66 + (i - 1) * 56, Y = [52, 132, 212];
  let o = '';
  const rowLab = ['开始', '做完 p', '再做 q'];
  for (let r = 0; r < 3; r++) {
    o += text(4, Y[r] + 4, rowLab[r], 'ts', 'start');
    for (let i = 1; i <= 6; i++) o += circle(X(i), Y[r], 13, 'paper');
  }
  for (let i = 1; i <= 6; i++) {
    o += arrow(X(i), Y[0] + 14, X(p[i]), Y[1] - 15, 'mute', 6);
    o += arrow(X(i), Y[1] + 14, X(q[i]), Y[2] - 15, 'mute', 6);
  }
  o += text(4, Y[0] - 20, '位置', 'ts', 'start');
  for (let i = 1; i <= 6; i++) o += text(X(i), Y[0] - 20, String(i), 'ts', 'middle');
  // token i 从 X(i) 到 X(p[i]) 再到 X(q[p[i]])
  const T = 6, kt = [0, 0.15, 0.4, 0.5, 0.75, 0.95, 1];
  for (let i = 1; i <= 6; i++) {
    const xs = [X(i), X(i), X(p[i]), X(p[i]), X(q[p[i]]), X(q[p[i]]), X(i)];
    const ys = [Y[0], Y[0], Y[1], Y[1], Y[2], Y[2], Y[0]];
    const cls = i === 1 || i === 4 || i === 3 ? 'solid' : 'wash-strong';
    const tc = cls === 'solid' ? 'tw' : 'tb';
    const xa = xs.map(f1), ya = ys.map(f1), yt = ys.map((y) => f1(y + 4.5));
    o += `<circle cx="${xa[0]}" cy="${ya[0]}" r="11" class="${cls}">${anim('cx', xa, kt, T)}${anim('cy', ya, kt, T)}</circle>`;
    o += `<text x="${xa[0]}" y="${yt[0]}" class="${tc}" text-anchor="middle">${i}${anim('x', xa, kt, T)}${anim('y', yt, kt, T)}</text>`;
  }
  o += text(400, 52, 'p = (124)(35)', 't', 'start') + text(400, 132, 'q = (135)(246)', 't', 'start');
  o += text(400, 200, 'q∘p = (143)(26)', 'tl', 'start') + text(400, 220, '1 → 4 → 3 → 1，2 ↔ 6，5 不动', 'ts', 'start');
  o += text(280, 254, '每个编号圆片从“开始”那行的位置出发，先沿 p 的箭头、再沿 q 的箭头走', 'ts', 'middle');
  return svgA(560, 262, o, '动图：6 个编号的圆片先按 p 移动，再按 q 移动；最后 1 落在 4，4 落在 3，3 落在 1，2 和 6 互换，5 回到原处');
}

// 第 3 站：reversal = 连线图里的 crossing；右乘 (3 4) 少掉一个
function reversal() {
  let o = '';
  const panel = (x0, one, title, swap) => {
    const n = one.length, gap = 52, X = (i) => x0 + 40 + (i - 1) * gap, yT = 64, yB = 170;
    o += text(x0 + 40 + 1.5 * gap, 18, title, 'tb', 'middle');
    o += text(x0 + 2, yT - 18, 'a', 'ts', 'start') + text(x0 + 2, yB + 26, 'σ(a)', 'ts', 'start');
    for (let a = 1; a <= n; a++) {
      o += line(X(a), yT, X(one[a - 1]), yB, swap.includes(a) ? 'ln' : 'ink');
    }
    const pairs = [];
    for (let a = 1; a <= n; a++) for (let b = a + 1; b <= n; b++) {
      if (one[a - 1] < one[b - 1]) continue;
      pairs.push(`(${a}, ${b})`);
      const da = X(one[a - 1]) - X(a), db = X(one[b - 1]) - X(b);
      const t = (X(b) - X(a)) / (da - db);
      o += circle(X(a) + t * da, yT + t * (yB - yT), 5, 'solid');
    }
    for (let a = 1; a <= n; a++) {
      o += circle(X(a), yT, 11, 'paper') + text(X(a), yT + 4.5, String(a), 'tb', 'middle');
      o += circle(X(a), yB, 11, 'paper') + text(X(a), yB + 4.5, String(a), 't', 'middle');
    }
    o += text(x0 + 40 + 1.5 * gap, 34, '一行写成 ' + one.join(' '), 'ts', 'middle');
    o += text(x0 + 40 + 1.5 * gap, 214, pairs.length + ' 个 crossing：' + pairs.join(' '), 't', 'middle');
    return pairs.length;
  };
  const sigma = [2, 3, 4, 1];
  const st = sigma.slice(); [st[2], st[3]] = [st[3], st[2]];
  panel(0, sigma, 'σ = (1 2 3 4)', []);
  panel(284, st, 'σ(3 4)', [3, 4]);
  o += text(280, 240, '每条线从上面的 a 连到下面的 σ(a)；a < b 而 σ(a) > σ(b) 的两条线必定交叉一次', 'ts', 'middle');
  o += text(280, 258, '右乘 (3 4) 只是把从 3、4 出发的两条线的下端对调，这两条线的交叉没了，别的交叉不变', 'ts', 'middle');
  return svg(560, 264, o, '两张连线图：上排是位置 a，下排是值 sigma(a)。sigma = (1 2 3 4) 一行写成 2 3 4 1，有 3 个交叉；右乘 (3 4) 后一行写成 2 3 1 4，只剩 2 个交叉');
}

// 第 4 站：D8 关于 H = {e, s} 的 left coset 与 right coset
function cosets() {
  const H = [[0, 0], [0, 1]];
  const left = [0, 1, 2, 3].map((a) => H.map((h) => mul([a, 0], h)));
  const right = [0, 1, 2, 3].map((a) => H.map((h) => mul(h, [a, 0])));
  let o = '';
  const row = (y, cs, title, note) => {
    o += text(8, y - 52, title, 'tb', 'start') + text(552, y - 52, note, 'ts', 'end');
    cs.forEach((c, k) => {
      const x0 = 8 + k * 138;
      o += rect(x0, y - 40, 130, 108, 'frame', 8);
      c.forEach((g, j) => {
        const cx = x0 + 34 + j * 62;
        o += mini(cx, y + 6, 17, g, { edge12: true });
        o += text(cx, y + 56, name(g), 'tl', 'middle');
      });
    });
  };
  row(76, left, 'left coset gH = {g, gs}', '同一个框里，粗边（原来的 1–2 边）落在同一处');
  row(232, right, 'right coset Hg = {g, sg}', '同一个框里，粗边落在不同处');
  return svg(560, 304, o, 'D8 关于 H = {e, s} 的四个 left coset 和四个 right coset；left coset 里的两个元素把原来的 1-2 边送到同一条边，right coset 不是');
}

// 第 5 站：Z4、U(10)、U(8) 的 Cayley table
function cayley() {
  const fills = ['paper', 'wash', 'wash-strong', 'solid'];
  let o = '';
  const table = (x0, title, els, op, idx, note) => {
    const c = 30, y0 = 50;
    o += text(x0 + 2.5 * c, 22, title, 'tb', 'middle');
    els.forEach((e, i) => {
      o += text(x0 + (i + 1.5) * c, y0 - 8, String(e), 'ts', 'middle');
      o += text(x0 + 0.5 * c, y0 + (i + 0.5) * c + 4, String(e), 'ts', 'middle');
    });
    els.forEach((a, i) => els.forEach((b, j) => {
      const v = op(a, b), k = idx(v);
      o += rect(x0 + (j + 1) * c, y0 + i * c, c, c, fills[k] + ' ink');
      o += text(x0 + (j + 1.5) * c, y0 + (i + 0.5) * c + 4.5, String(v), k === 3 ? 'tw' : 't', 'middle');
    }));
    o += text(x0 + 2.5 * c, y0 + 4 * c + 22, note[0], 'ts', 'middle') + text(x0 + 2.5 * c, y0 + 4 * c + 38, note[1], 'ts', 'middle');
  };
  table(14, 'Z₄，加法', [0, 1, 2, 3], (a, b) => (a + b) % 4, (v) => v, ['同色 = 同一个元素', '']);
  table(200, 'U(10)，乘法', [1, 3, 9, 7], (a, b) => (a * b) % 10, (v) => [1, 3, 9, 7].indexOf(v), ['排成 1, 3, 9, 7 后', '颜色和 Z₄ 一模一样']);
  table(386, 'U(8)，乘法', [1, 3, 5, 7], (a, b) => (a * b) % 8, (v) => [1, 3, 5, 7].indexOf(v), ['diagonal 全是 1：', '每个元素平方都是 identity']);
  return svg(560, 238, o, 'Z4、U(10)、U(8) 的 Cayley table 按元素上色：U(10) 按 1、3、9、7 排列后和 Z4 的颜色图案相同，U(8) 的 diagonal 全是 identity');
}

// 第 5 站：Z12 → Z4，fiber 就是 kernel 的 coset
function fiber() {
  let o = '';
  const fills = ['paper', 'wash', 'wash-strong', 'wash2'];
  o += text(218, 20, 'Z₁₂', 'tb', 'middle') + text(450, 20, 'Z₄', 'tb', 'middle');
  for (let r = 0; r < 4; r++) {
    const y = 50 + r * 46;
    o += rect(130, y - 17, 176, 34, fills[r], 6) + (r ? rect(130, y - 17, 176, 34, 'frame', 6) : '');
    for (let c = 0; c < 3; c++) { const v = r + 4 * c; o += circle(160 + c * 58, y, 12, 'paper') + text(160 + c * 58, y + 4.5, String(v), 't', 'middle'); }
    o += text(122, y + 4, r === 0 ? 'kernel {0, 4, 8}' : r + ' + kernel', 'ts', 'end');
    o += arrow(310, y, 434, y, 'mute');
    o += circle(450, y, 13, 'paper') + text(450, y + 4.5, String(r), 'tb', 'middle');
  }
  o += text(372, 40, 'k ↦ k mod 4', 'ts', 'middle');
  o += text(280, 238, '每个 fiber（送到同一个点的那些元素）都是 kernel 平移出来的一个 coset', 'ts', 'middle');
  return svg(560, 246, o, 'Homomorphism Z12 到 Z4：送到同一个元素的三个数排成一行，每一行是 kernel {0, 4, 8} 的一个 coset');
}

// 第 6 站：D8 的 Cayley table 按 coset 排序上色
function blocks() {
  const fills = ['paper', 'wash', 'wash-strong', 'solid'];
  let o = '';
  const table = (x0, title, orderEls, cosetOf, note) => {
    const c = 26, y0 = 42, hx = x0 + 30;
    o += text(hx + 4 * c, 16, title, 'tb', 'middle');
    orderEls.forEach((g, i) => {
      o += text(hx + (i + 0.5) * c, y0 - 6, name(g), 'ts', 'middle');
      o += text(hx - 6, y0 + (i + 0.5) * c + 4, name(g), 'ts', 'end');
    });
    orderEls.forEach((a, i) => orderEls.forEach((b, j) => {
      const v = mul(a, b), k = cosetOf(v);
      o += rect(hx + j * c, y0 + i * c, c, c, fills[k]);
      o += text(hx + (j + 0.5) * c, y0 + (i + 0.5) * c + 4, name(v), k === 3 ? 'tw' : 'ts', 'middle');
    }));
    for (let k = 0; k <= 8; k += 2) { o += line(hx + k * c, y0, hx + k * c, y0 + 8 * c, 'ink') + line(hx, y0 + k * c, hx + 8 * c, y0 + k * c, 'ink'); }
    o += text(hx + 4 * c, y0 + 8 * c + 20, note, 'ts', 'middle');
  };
  const eq = (g, h) => g[0] === h[0] && g[1] === h[1];
  const N = [[0, 0], [2, 0]], cosN = [[0, 0], [1, 0], [0, 1], [1, 1]].map((g) => N.map((n) => mul(g, n)));
  const H = [[0, 0], [0, 1]], cosH = [0, 1, 2, 3].map((a) => H.map((h) => mul([a, 0], h)));
  const idxIn = (cs) => (v) => cs.findIndex((c) => c.some((x) => eq(x, v)));
  table(0, 'N = {e, r²}：每个 2×2 块只有一种颜色', cosN.flat(), idxIn(cosN), '块的颜色只看行、列属于哪个 coset');
  table(280, 'H = {e, s}：有的块里混着两种颜色', cosH.flat(), idxIn(cosH), '同一对 coset 相乘，落进不同 coset');
  return svg(560, 278, o, 'D8 的 Cayley table，行和列按 coset 排好，乘积按它所在的 coset 上色：对 normal subgroup {e, r 平方}，每个 2 乘 2 块颜色一致；对 {e, s}，有的块颜色不一致');
}

// 第 6 站：Z2×Z3 与 Z2×Z4 里反复加 (1,1)（动图）
function crtA() {
  let o = '';
  const steps = 8, dt = 0.62, tail = 1.4, T = steps * dt + tail;
  const panel = (x0, m, n, title, foot) => {
    const c = 40, y0 = 58;
    o += text(x0 + (n * c) / 2 + 20, 22, title, 'tb', 'middle');
    for (let a = 0; a < m; a++) o += text(x0 + 8, y0 + a * c + c / 2 + 4, String(a), 'ts', 'middle');
    for (let b = 0; b < n; b++) o += text(x0 + 20 + b * c + c / 2, y0 - 8, String(b), 'ts', 'middle');
    const seq = []; for (let k = 0; k <= steps; k++) seq.push([k % m, k % n]);
    const first = {}; seq.forEach(([a, b], k) => { const key = a + ',' + b; if (!(key in first)) first[key] = k; });
    for (let a = 0; a < m; a++) for (let b = 0; b < n; b++) {
      const x = x0 + 20 + b * c, y = y0 + a * c, key = a + ',' + b;
      o += rect(x, y, c, c, 'paper');
      if (key in first) {
        const k = first[key];
        o += `<rect x="${x}" y="${y}" width="${c}" height="${c}" class="wash-strong" opacity="${k === 0 ? 1 : 0}">${k ? ashow([0, 1], [0, (k * dt) / T], T) : ''}</rect>`;
        o += text(x + c / 2, y + c / 2 + 4, String(k), 'ts', 'middle');
      }
    }
    const xs = [], ys = [], kt = [];
    seq.forEach(([a, b], k) => { xs.push(x0 + 20 + b * c + c / 2); ys.push(y0 + a * c + c / 2); kt.push((k * dt) / T); });
    xs.push(xs[xs.length - 1]); ys.push(ys[ys.length - 1]); kt.push(1);
    o += `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="13" class="ln">${anim('cx', xs.map(f1), kt, T, true)}${anim('cy', ys.map(f1), kt, T, true)}</circle>`;
    o += text(x0 + (n * c) / 2 + 20, y0 + m * c + 26, foot[0], 't', 'middle') + text(x0 + (n * c) / 2 + 20, y0 + m * c + 44, foot[1], 'ts', 'middle');
  };
  panel(40, 2, 3, 'Z₂ × Z₃', ['(1, 1) 走遍 6 格', 'order 6：≅ Z₆']);
  panel(300, 2, 4, 'Z₂ × Z₄', ['(1, 1) 只走到 4 格', 'order 4 = lcm(2, 4)：不是 cyclic']);
  o += text(280, 208, '格子里的数是“加了几次 (1, 1) 第一次到这里”；行是第一个 coordinate，列是第二个', 'ts', 'middle');
  return svgA(560, 216, o, '动图：在 Z2 × Z3 的 2 乘 3 格子里反复加 (1, 1)，6 步走遍所有格子；在 Z2 × Z4 的 2 乘 4 格子里只走到 4 个格子就回到起点');
}

// 第 7 站：cube 的三类 rotation axis
function cube() {
  // 斜投影：x 向右，y 向上，z 朝读者左下
  const Pj = (cx, cy, s) => ([x, y, z]) => [cx + s * (x - 0.42 * z), cy - s * (y - 0.32 * z)];
  const V = []; for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push([x, y, z]);
  const E = []; for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const dd = V[i].reduce((s, v, k) => s + Math.abs(v - V[j][k]), 0); if (dd === 2) E.push([i, j]); }
  const hidden = (i) => V[i][0] === -1 && V[i][1] === -1 && V[i][2] === -1; // 看不见的那个顶点
  let o = '';
  const panel = (cx, title, ax, foot, mark) => {
    const P = Pj(cx, 122, 42);
    o += text(cx, 20, title, 'tb', 'middle');
    if (mark) o += mark(P);
    for (const [i, j] of E) o += line(...P(V[i]), ...P(V[j]), hidden(i) || hidden(j) ? 'dash' : 'ink');
    const sc = (v, k) => v.map((t) => t * k);
    o += line(...P(sc(ax, 1.3)), ...P(sc(ax, -1.3)), 'ln');
    o += circle(...P(ax), 4, 'ln-f') + circle(...P(sc(ax, -1)), 4, 'ln-f');
    o += text(cx, 232, foot[0], 't', 'middle') + text(cx, 250, foot[1], 'ts', 'middle');
  };
  panel(100, '过两个 face 的中心', [0, 1, 0], ['6 个 face × 4 = 24', 'stabilizer：0°, 90°, 180°, 270°'],
    (P) => poly([[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]].map(P), 'wash'));
  panel(285, '过两个相对的 vertex', [-1, -1, 1], ['8 个 vertex × 3 = 24', 'stabilizer：0°, 120°, 240°'], null);
  panel(465, '过两条相对 edge 的中点', [0, 1, 1], ['12 条 edge × 2 = 24', 'stabilizer：0°, 180°'],
    (P) => line(...P([-1, 1, 1]), ...P([1, 1, 1]), 'ln'));
  return svg(560, 258, o, 'Cube 的三类 rotation axis：过相对 face 中心、过相对 vertex、过相对 edge 中点；三种数法都得到 24');
}

// 第 7 站：两种涂法在 rotation 下的 orbit（动图）
function orbitA() {
  let o = '';
  const h = 40, steps = 4, mv = 0.7, hold = 0.9, tail = 0.8, T = steps * (mv + hold) + tail;
  const panel = (cx, col, title, foot, list) => {
    const cy = 112;
    o += text(cx, 20, title, 'tb', 'middle');
    const N = 10, kt = [], ang = [];
    for (let s = 0; s < steps; s++) {
      for (let k = 0; k <= N; k++) { kt.push((s * (mv + hold) + (mv * k) / N) / T); ang.push(90 * (s + k / N)); }
      kt.push(((s + 1) * (mv + hold)) / T); ang.push(90 * (s + 1));
    }
    kt.push(1); ang.push(360);
    const P = (a, k) => { const t = (45 + 90 * k + a) * R; return [cx + h * 1.2 * Math.cos(t), cy - h * 1.2 * Math.sin(t)]; };
    o += apath(ang.map((a) => d([0, 1, 2, 3, 0].map((k) => P(a, k))) + 'Z'), kt, T, 'wash ink');
    for (let k = 0; k < 4; k++) {
      const xs = ang.map((a) => f1(P(a, k)[0])), ys = ang.map((a) => f1(P(a, k)[1]));
      o += `<circle cx="${xs[0]}" cy="${ys[0]}" r="8" class="${col[k] ? 'ink-f' : 'paper'}">${anim('cx', xs, kt, T)}${anim('cy', ys, kt, T)}</circle>`;
    }
    // 下方：转 0、1、2、3 次之后的样子（小图，逐个出现）
    for (let s = 0; s < 4; s++) {
      const x = cx - 84 + s * 56, y = 210, hh = 13;
      const c2 = [0, 1, 2, 3].map((i) => col[(i - s + 4) % 4]);
      const same = list[s];
      let g = poly([0, 1, 2, 3].map((k) => [x + hh * 1.2 * Math.cos((45 + 90 * k) * R), y - hh * 1.2 * Math.sin((45 + 90 * k) * R)]), same ? 'mute' : 'ink');
      for (let k = 0; k < 4; k++) g += circle(x + hh * 1.2 * Math.cos((45 + 90 * k) * R), y - hh * 1.2 * Math.sin((45 + 90 * k) * R), 4.2, c2[k] ? 'ink-f' : 'paper');
      g += text(x, y + 30, ['e', 'r', 'r²', 'r³'][s], same ? 'ts' : 'tb', 'middle') + (same ? text(x, y + 45, '重复', 'ts', 'middle') : '');
      const t0 = (s * (mv + hold) + mv) / T;
      o += s === 0 ? `<g>${g}</g>` : `<g opacity="0">${g}${ashow([0, 1], [0, t0], T)}</g>`;
    }
    o += text(cx, 272, foot, 'ts', 'middle');
  };
  panel(140, [1, 1, 0, 0], '两个相邻 vertex 涂 black', 'orbit 4 个，stabilizer = {e}：4 × 1 = 4', [false, false, false, false]);
  panel(420, [1, 0, 1, 0], '两个相对 vertex 涂 black', 'orbit 2 个，stabilizer = {e, r²}：2 × 2 = 4', [false, false, true, true]);
  return svgA(560, 280, o, '动图：两种涂法分别每次转 90 度。相邻两个 black 的涂法转出 4 种不同样子；相对两个 black 的涂法转 180 度就回到原样，只有 2 种');
}

export default {
  'ma2202-order': orderA,
  'ma2202-colorings': colorings,
  'ma2202-d4': d4,
  'ma2202-clock': clockA,
  'ma2202-z12lat': z12lat,
  'ma2202-compose': composeA,
  'ma2202-reversal': reversal,
  'ma2202-cosets': cosets,
  'ma2202-cayley': cayley,
  'ma2202-fiber': fiber,
  'ma2202-blocks': blocks,
  'ma2202-crt': crtA,
  'ma2202-cube': cube,
  'ma2202-orbit': orbitA,
};
