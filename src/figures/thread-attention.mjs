import { svg, svgA, lin, d, path, line, rect, circle, text, arrow, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// 概念线：attention。所有数字都在这里现算，和正文一致。

const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const atext = (x, y, s, cls, anchor, on, kt, T) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" opacity="${on[0] ? 1 : 0}">${s}${ashow(on, kt, T)}</text>`;
const softmax = (s) => { const m = Math.max(...s), e = s.map((x) => Math.exp(x - m)), z = e.reduce((a, b) => a + b, 0); return e.map((x) => x / z); };
// 状态序列 → keyTimes：每个状态停 hold[i] 秒，状态之间过渡 move 秒，最后回到第一个状态
function hold(n, holdS, move) {
  const h = Array.isArray(holdS) ? holdS : Array(n).fill(holdS);
  const ts = [0], idx = [0];
  let t = 0;
  for (let i = 0; i < n; i++) {
    t += h[i]; ts.push(t); idx.push(i);
    t += move; ts.push(t); idx.push((i + 1) % n);
  }
  return { kt: ts.map((x) => x / t), idx, T: t };
}
const arrowD = (x1, y1, x2, y2, size = 7) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  const [ax, ay] = p(0.42), [bx, by] = p(-0.42);
  return `M${f1(x1)} ${f1(y1)}L${f1(x2)} ${f1(y2)}M${f1(ax)} ${f1(ay)}L${f1(x2)} ${f1(y2)}L${f1(bx)} ${f1(by)}`;
};

// the green witch：CS4248 第 5 站的三个 encoder state
const KEYS = [[1, 0], [0.5, 2], [1.5, 0.5]];
const NAMES = ['the', 'green', 'witch'];
const attend = (q, tau = 1) => { const a = softmax(KEYS.map((k) => (q[0] * k[0] + q[1] * k[1]) / tau)); return { a, o: [0, 1].map((c) => a.reduce((s, w, j) => s + w * KEYS[j][c], 0)) }; };
const argmax = (q) => { const sc = KEYS.map((k) => q[0] * k[0] + q[1] * k[1]); return sc.indexOf(Math.max(...sc)); };

// ---------- 1. Hard lookup 会跳，softmax 加权平均连续地走 ----------
function lookupA() {
  const sx = lin(-0.35, 2.0, 24, 235), sy = lin(-0.35, 2.3, 250, 12);
  // q 的角度：90° 停一会儿，转到 0°，再转到 150°，回到 90°；每 3° 一个 keyframe，角速度恒定
  const path0 = [];
  for (let t = 90; t >= 0; t -= 3) path0.push(t);
  for (let t = 3; t <= 150; t += 3) path0.push(t);
  for (let t = 147; t >= 90; t -= 3) path0.push(t);
  const holdS = 1.6, speed = 60; // 度每秒
  const T = holdS + (path0.length - 1) * 3 / speed;
  const th = [90, ...path0], kt = [0, ...path0.map((_, i) => (holdS + i * 3 / speed) / T)];
  const Q = th.map((t) => [Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)]);
  const st = Q.map((q) => attend(q)), hw = Q.map(argmax);
  let o = '';
  o += line(sx(-0.35), sy(0), sx(2.0), sy(0), 'axis') + line(sx(0), sy(-0.35), sx(0), sy(2.3), 'axis');
  for (const v of [1, 2]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle') + line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  // argmax 在 green 与 witch 之间换人的方向：q·(h_green − h_witch) = 0，即 33.69°
  const b = Math.atan2(1.5, 1), R = 2.15;
  o += path(d([[sx(0), sy(0)], [sx(R * Math.cos(b) * 0.93), sy(R * Math.sin(b) * 0.93)]]), 'dash');
  o += text(sx(1.83), sy(1.38), '33.7°', 'ts', 'start');
  // soft output 的轨迹（θ 从 0° 到 150°）
  const tr = [];
  for (let t = 0; t <= 150; t += 1) { const q = [Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)]; const { o: c } = attend(q); tr.push([sx(c[0]), sy(c[1])]); }
  o += path(d(tr), 'grid');
  // keys
  const lab = [[8, -9, 'start'], [9, 4, 'start'], [9, 4, 'start']];
  KEYS.forEach(([x, y], j) => { o += circle(sx(x), sy(y), 4, 'ink-f') + text(sx(x) + lab[j][0], sy(y) + lab[j][1], 'h' + `<tspan class="sub" dy="3">${NAMES[j]}</tspan>`, 't', lab[j][2]); });
  // query 方向（画成长 0.75 的 arrow，只表示方向）
  const L = 0.75;
  o += apath(Q.map((q) => arrowD(sx(0), sy(0), sx(L * q[0]), sy(L * q[1]))), kt, T, 'ln');
  o += atext(sx(0.05), sy(0.86), 'q', 'tl', 'start', th.map((_, i) => i === 0), kt, T);
  // hard lookup：方块，跳
  const sq = (j) => `M${f1(sx(KEYS[j][0]) - 7)} ${f1(sy(KEYS[j][1]) - 7)}h14v14h-14Z`;
  o += `<path d="${sq(hw[0])}" class="ink">${anim('d', hw.map(sq), kt, T, true)}</path>`;
  // soft output：圆点，连续
  o += acircle(st.map((s) => sx(s.o[0])), st.map((s) => sy(s.o[1])), kt, T, 5.5, 'ln-f');
  o += atext(sx(st[0].o[0]) - 9, sy(st[0].o[1]) + 5, 'c', 'tl', 'end', th.map((_, i) => i === 0), kt, T);
  // 右：三个 weight
  const X0 = 360, W = 150, Y = [78, 128, 178];
  o += text(300, 30, 'softmax 的 weight αⱼ（实心）', 'ts', 'start');
  o += text(300, 46, 'hard lookup 选中的那个（框）', 'ts', 'start');
  NAMES.forEach((n, j) => {
    o += text(X0 - 10, Y[j] + 5, n, 't', 'end');
    o += rect(X0, Y[j] - 9, W, 18, 'wash2');
    o += `<rect x="${X0}" y="${Y[j] - 9}" width="${f1(W * st[0].a[j])}" height="18" class="solid">${anim('width', st.map((s) => f1(W * s.a[j])), kt, T)}</rect>`;
    o += grp(rect(X0 - 3, Y[j] - 12, W + 6, 24, 'ink'), hw.map((h) => h === j), kt, T);
    o += atext(X0 + W + 8, Y[j] + 5, st[0].a[j].toFixed(3), 'ts', 'start', th.map((_, i) => i === 0), kt, T);
  });
  o += atext(300, 214, 'q = (0, 1)：分数 0、2、0.5', 'tb', 'start', th.map((_, i) => i === 0), kt, T);
  o += atext(300, 232, 'c = (0.714, 1.554)', 'tl', 'start', th.map((_, i) => i === 0), kt, T);
  o += atext(300, 214, 'q 转动：方块只有两个位置，圆点连续地走', 'ts', 'start', th.map((_, i) => i > 0), kt, T);
  o += text(300, 250, '淡线：θ 从 0° 到 150° 时 c 的轨迹', 'ts', 'start');
  return svgA(560, 256, o, '动图：三个 encoder state 画在 plane 上，query 的方向从 90° 转到 0° 再到 150°。Hard lookup 取出的 vector 在 33.7° 处从 green 跳到 witch；softmax 加权平均取出的 vector 沿一条连续曲线移动。右边是三个 weight。');
}

// ---------- 2. 对 q 做 gradient descent：weight 从 green 流走，the 与 witch 分不开 ----------
function gradA() {
  const target = KEYS[2], eta = 1;
  const steps = [];
  let q = [0, 1];
  for (let k = 0; k <= 40; k++) {
    const { a, o } = attend(q);
    const g = [o[0] - target[0], o[1] - target[1]];
    const Ls = 0.5 * (g[0] * g[0] + g[1] * g[1]);
    const dLds = KEYS.map((v, j) => a[j] * ((v[0] - o[0]) * g[0] + (v[1] - o[1]) * g[1]));
    const dq = [0, 1].map((c) => dLds.reduce((s, w, j) => s + w * KEYS[j][c], 0));
    steps.push({ k, q: [...q], a, o, L: Ls });
    q = [q[0] - eta * dq[0], q[1] - eta * dq[1]];
  }
  const show = [0, 1, 2, 3, 5, 10, 20, 40];
  const S = show.map((k) => steps[k]);
  const { kt, idx, T } = hold(S.length, [2.4, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.8], 0.6);
  const sx = lin(-0.35, 2.0, 24, 224), sy = lin(-0.65, 2.3, 262, 11);
  let o = '';
  o += line(sx(-0.35), sy(0), sx(2.0), sy(0), 'axis') + line(sx(0), sy(-0.65), sx(0), sy(2.3), 'axis');
  for (const v of [1, 2]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle') + line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  // c 走过的路
  o += path(d(steps.map((s) => [sx(s.o[0]), sy(s.o[1])])), 'grid');
  const lab = [[8, -9, 'start'], [9, 4, 'start'], [15, -5, 'start']];
  KEYS.forEach(([x, y], j) => { o += circle(sx(x), sy(y), 4, 'ink-f') + text(sx(x) + lab[j][0], sy(y) + lab[j][1], 'h' + `<tspan class="sub" dy="3">${NAMES[j]}</tspan>`, 't', lab[j][2]); });
  o += circle(sx(target[0]), sy(target[1]), 10, 'ink') + text(sx(target[0]) + 15, sy(target[1]) + 13, 'target', 'ts', 'start');
  // q 是真实长度的 vector
  o += apath(idx.map((i) => arrowD(sx(0), sy(0), sx(S[i].q[0]), sy(S[i].q[1]))), kt, T, 'ln');
  o += acircle(idx.map((i) => sx(S[i].o[0])), idx.map((i) => sy(S[i].o[1])), kt, T, 5.5, 'ln-f');
  o += atext(sx(0.05), sy(1.05), 'q', 'tl', 'start', idx.map((i) => i === 0), kt, T);
  o += atext(sx(0.66), sy(1.62), 'c', 'tl', 'end', idx.map((i) => i === 0), kt, T);
  // 右：weight 与 loss
  const X0 = 350, W = 150, Y = [96, 140, 184];
  NAMES.forEach((n, j) => {
    o += text(X0 - 10, Y[j] + 5, n, 't', 'end');
    o += rect(X0, Y[j] - 9, W, 18, 'wash2');
    o += `<rect x="${X0}" y="${Y[j] - 9}" width="${f1(W * S[0].a[j])}" height="18" class="solid">${anim('width', idx.map((i) => f1(W * S[i].a[j])), kt, T)}</rect>`;
    S.forEach((s, m) => { o += atext(X0 + W + 8, Y[j] + 5, s.a[j].toFixed(3), 'ts', 'start', idx.map((i) => i === m), kt, T); });
  });
  o += text(290, 24, '目标 h_witch，L = ½‖c − h_witch‖²，η = 1', 'ts', 'start');
  S.forEach((s, m) => {
    const on = idx.map((i) => i === m);
    o += atext(290, 52, `第 ${s.k} 步`, 'tb', 'start', on, kt, T);
    o += atext(360, 52, `L = ${s.L.toFixed(3)}　‖q‖ = ${Math.hypot(...s.q).toFixed(2)}`, 'ts', 'start', on, kt, T);
  });
  o += atext(290, 226, '第 1 步：green 的 weight 从 0.736 掉到 0.347', 'ts', 'start', idx.map((i) => i === 1), kt, T);
  o += atext(290, 226, '之后 the 和 witch 只能靠拉长 q 慢慢分开', 'ts', 'start', idx.map((i) => i >= 3), kt, T);
  o += atext(290, 226, '第 0 步就是上一张图的 q = (0, 1)', 'ts', 'start', idx.map((i) => i === 0), kt, T);
  o += text(290, 246, '淡线：c 在 40 步里走过的路', 'ts', 'start');
  return svgA(560, 266, o, '动图：要取出 h_witch，对 query 做 gradient descent。第 1 步 green 的 weight 从 0.736 降到 0.347；之后 the 与 witch 的方向相近，只能靠 q 变长慢慢分开，40 步后 witch 的 weight 是 0.608，q 的长度从 1 变成 1.67。');
}

// ---------- 3. 一个 sum 的比值：三种分组，同一个答案 ----------
function mergeA() {
  const s = [1, 2, 3, 0], v = [10, 20, 30, 40];
  const one = (j) => ({ m: s[j], l: 1, u: v[j], set: [j] });
  const mg = (a, b) => { const m = Math.max(a.m, b.m), fa = Math.exp(a.m - m), fb = Math.exp(b.m - m); return { m, l: fa * a.l + fb * b.l, u: fa * a.u + fb * b.u, set: [...a.set, ...b.set] }; };
  // A：一个一个读
  const A = [one(0)]; for (let j = 1; j < 4; j++) A.push(mg(A[j - 1], one(j)));
  // B：相邻两块
  const B1 = mg(one(0), one(1)), B2 = mg(one(2), one(3)), B = mg(B1, B2);
  // C：不相邻的两块
  const C1 = mg(one(0), one(3)), C2 = mg(one(1), one(2)), C = mg(C1, C2);
  const lbl = (st) => '{' + st.set.map((j) => `(${s[j]}, ${v[j]})`).join(' ') + '}';
  const card = (x, y, st, head, fin) => {
    let c = rect(x, y, 112, fin ? 62 : 48, fin ? 'paper' : 'wash', 5);
    c += text(x + 56, y + 15, head, 'ts', 'middle');
    c += text(x + 56, y + 31, `m = ${st.m}　l = ${st.l.toFixed(3)}`, 't', 'middle');
    c += text(x + 56, y + 45, `u = ${st.u.toFixed(2)}`, 't', 'middle');
    if (fin) c += text(x + 56, y + 59, `u / l = ${(st.u / st.l).toFixed(2)}`, 'tl', 'middle');
    return c;
  };
  // 时间表：0 全部显示；1 清空；2–5 A 逐个；6 B 两块；7 B 合并；8 C 两块；9 C 合并；10 全部
  const ph = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const hs = [3.0, 0.6, 0.9, 0.9, 0.9, 1.1, 1.1, 1.3, 1.1, 1.3, 1.6];
  let t = 0; const ts = [0];
  hs.forEach((h) => { t += h; ts.push(t); });
  const kt = ts.slice(0, -1).map((x) => x / t), T = t;
  const vis = (from) => ph.map((p) => p === 0 || p === 10 || (p >= from && p > 1));
  let o = '';
  const X = [10, 140, 270, 440];
  const RY = [34, 126, 218];
  [['一个一个读（online softmax）', RY[0]], ['相邻的两块（FlashAttention 的 tile）', RY[1]], ['不相邻的两块（PagedAttention 的 block、Flash-Decoding 的 split）', RY[2]]].forEach(([h, y]) => { o += text(10, y - 9, h, 'tb', 'start'); });
  // A
  const headA = ['(1, 10)', '+ (2, 20)', '+ (3, 30)', '+ (0, 40)'];
  A.forEach((st, j) => {
    const fin = j === 3, x = X[j];
    let g = card(x, RY[0], st, headA[j], fin);
    if (j > 0) g += arrow(X[j - 1] + 112, RY[0] + 24, x - 2, RY[0] + 24, 'ink');
    o += grp(g, vis(2 + j), kt, T);
  });
  // B、C
  const two = (y, b1, b2, bm, from) => {
    o += grp(card(X[0], y, b1, lbl(b1), false) + card(X[1], y, b2, lbl(b2), false), vis(from), kt, T);
    let g = path(`M${X[0] + 56} ${y + 48}V${y + 56}H${X[3] - 9}`, 'ink') + arrow(X[3] - 10, y + 56, X[3] - 2, y + 56, 'ink');
    g += arrow(X[1] + 112, y + 24, X[3] - 2, y + 24, 'ink') + text((X[1] + 112 + X[3]) / 2, y + 18, '⊕', 'tb', 'middle') + card(X[3], y, bm, '合并', true);
    o += grp(g, vis(from + 1), kt, T);
  };
  two(RY[1], B1, B2, B, 6);
  two(RY[2], C1, C2, C, 8);
  o += atext(280, 304, '每张卡片是 (m, l, u)：m 是见过的最大 score，l = Σ e^(s−m)，u = Σ e^(s−m) v', 'ts', 'middle', ph.map((p) => p === 0 || p === 10), kt, T);
  o += atext(280, 304, '一个一个合并进来：m 变大时，旧的 l、u 先乘 e^(m旧 − m新)', 'ts', 'middle', ph.map((p) => p >= 2 && p <= 5), kt, T);
  o += atext(280, 304, '两块各自算完，再合并一次', 'ts', 'middle', ph.map((p) => p >= 6 && p <= 9), kt, T);
  return svgA(560, 310, o, '动图：四个 score 1、2、3、0 和 value 10、20、30、40。一个一个读、分成相邻的两块、分成不相邻的两块，各自合并 (m, l, u)，最后都是 m = 3、l = 1.553、u = 40.70，u/l = 26.21。');
}

// ---------- 4. Causal mask：新 token 只加一行；不加 mask：整张重算 ----------
function cacheA() {
  const n = 5, c = 24;
  // 时间表：先停在第 5 步，再从第 1 步走到第 5 步
  const seq = [5, 1, 2, 3, 4, 5];
  const hs = [2.6, 1.2, 1.2, 1.2, 1.2, 1.6];
  let t = 0; const ts = [0]; hs.forEach((h) => { t += h; ts.push(t); });
  const kt = ts.slice(0, -1).map((x) => x / t), T = t;
  let o = '';
  const panel = (x0, y0, causal, title, sub) => {
    o += text(x0 + n * c / 2, 18, title, 'tb', 'middle') + text(x0 + n * c / 2, 34, sub, 'ts', 'middle');
    for (let j = 0; j < n; j++) o += text(x0 + j * c + c / 2, y0 - 6, 'x' + `<tspan class="sub" dy="3">${j + 1}</tspan>`, 'ts', 'middle');
    for (let i = 0; i < n; i++) o += text(x0 - 6, y0 + i * c + c / 2 + 4, 'x' + `<tspan class="sub" dy="3">${i + 1}</tspan>`, 'ts', 'end');
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const allowed = causal ? j <= i : true;
      const x = x0 + j * c, y = y0 + i * c;
      o += rect(x + 1, y + 1, c - 2, c - 2, 'wash2');
      if (!allowed) continue;
      const now = seq.map((s) => (causal ? i === s - 1 : i < s && j < s));
      const old = seq.map((s) => causal && i < s - 1);
      o += grp(rect(x + 1, y + 1, c - 2, c - 2, 'wash-strong'), old, kt, T);
      o += grp(rect(x + 1, y + 1, c - 2, c - 2, 'solid'), now, kt, T);
    }
  };
  const L0 = 78, R0 = 346, Y0 = 62;
  panel(L0, Y0, true, 'causal mask（GPT）', '第 t 步只新算第 t 行');
  panel(R0, Y0, false, '不加 mask（BERT、ViT）', '加进一个 token，整张都变');
  // KV cache：每个 column 一格，随步数增长
  const ky = Y0 + n * c + 14;
  o += text(L0 - 6, ky + 13, 'K、V', 'ts', 'end');
  for (let j = 0; j < n; j++) {
    const x = L0 + j * c;
    o += rect(x + 1, ky, c - 2, 18, 'frame');
    o += grp(rect(x + 1, ky, c - 2, 18, 'wash-strong'), seq.map((s) => j < s - 1), kt, T);
    o += grp(rect(x + 1, ky, c - 2, 18, 'solid'), seq.map((s) => j === s - 1), kt, T);
  }
  o += text(L0 + n * c + 8, ky + 13, 'cache', 'ts', 'start');
  // 读数
  const cum = (s, f) => { let a = 0; for (let k = 1; k <= s; k++) a += f(k); return a; };
  seq.forEach((s, m) => {
    const on = seq.map((_, i) => i === m);
    o += atext(L0 + n * c / 2, 236, `第 ${s} 步：新算 ${s} 个 score`, 'tl', 'middle', on, kt, T);
    o += atext(L0 + n * c / 2, 254, `累计 ${cum(s, (k) => k)} 个；每步 1 个 token 过 layer`, 'ts', 'middle', on, kt, T);
    o += atext(R0 + n * c / 2, 236, `第 ${s} 步：重算 ${s * s} 个 score`, 'tl', 'middle', on, kt, T);
    o += atext(R0 + n * c / 2, 254, `累计 ${cum(s, (k) => k * k)} 个；每步 ${s} 个 token 过 layer`, 'ts', 'middle', on, kt, T);
  });
  o += rect(206, 92, 12, 12, 'solid') + text(224, 102, '这一步算的', 'ts', 'start');
  o += rect(206, 112, 12, 12, 'wash-strong') + text(224, 122, '以前算的，不变', 'ts', 'start');
  return svgA(560, 262, o, '动图：一个一个加入 token。左边 causal mask 下，第 t 步只新算第 t 行，前面各行和 cache 里的 K、V 都不变；右边不加 mask，每加一个 token，整张 t × t 的 score 都要重算。');
}

// ---------- 5. Decode 一步要读多少 byte：weight 与 KV cache ----------
function decodeA() {
  const L = 40, Hd = 128, bw = 3.35e12, d = 5120, S = 1024;
  const Pm = 13015864320, Pg = Pm - L * 2 * d * (d - 8 * Hd), emb = 2 * 32000 * 5120;
  const kvTok = (K) => 2 * L * K * Hd * 2;
  const wb = (P, w4) => (w4 ? (P - emb) * 4.125 / 8 + emb * 2 : 2 * P);
  const cfg = [['MHA，bf16', Pm, 40, false], ['MHA，W4A16', Pm, 40, true], ['GQA 8 组，bf16', Pg, 8, false], ['GQA 8 组，W4A16', Pg, 8, true]];
  const Bs = [64, 1, 4, 16];
  const { kt, idx, T } = hold(Bs.length, [3.0, 1.8, 1.8, 1.8], 0.9);
  const X0 = 150, px = 3.6; // 每 GB 的像素
  const Y = [70, 118, 166, 214];
  let o = '';
  o += text(4, 22, 'Llama 2 13B，每条 sequence 1024 个 token，H100 的 HBM 3.35 TB/s', 'ts', 'start');
  Bs.forEach((B, m) => { o += atext(4, 42, `batch B = ${B}：decode 一步要从 HBM 读的 byte`, 'tb', 'start', idx.map((i) => i === m), kt, T); });
  // 80 GB 线
  o += line(X0 + 80 * px, 52, X0 + 80 * px, 238, 'dash') + text(X0 + 80 * px, 252, '80 GB', 'ts', 'middle');
  for (const g of [0, 20, 40, 60]) o += line(X0 + g * px, 232, X0 + g * px, 238, 'axis') + text(X0 + g * px, 252, String(g), 'ts', 'middle');
  o += line(X0, 235, X0 + 80 * px, 235, 'axis');
  cfg.forEach(([name, P, K, w4], r) => {
    const y = Y[r];
    o += text(X0 - 8, y + 5, name, 't', 'end');
    const w = wb(P, w4) / 1e9, kv = Bs.map((B) => B * S * kvTok(K) / 1e9);
    o += rect(X0, y - 11, w * px, 22, 'wash2');
    o += `<rect x="${f1(X0 + w * px)}" y="${y - 11}" width="${f1(kv[0] * px)}" height="22" class="solid">${anim('width', idx.map((i) => f1(kv[i] * px)), kt, T)}</rect>`;
    Bs.forEach((B, m) => {
      const tot = w + kv[m];
      o += atext(X0 + 80 * px + 8, y - 2, `${tot.toFixed(1)} GB`, 'ts', 'start', idx.map((i) => i === m), kt, T);
      o += atext(X0 + 80 * px + 8, y + 13, `${(tot * 1e9 / bw * 1e3).toFixed(1)} ms 一步`, 'ts', 'start', idx.map((i) => i === m), kt, T);
    });
    if (r === 0) o += text(X0 + w * px / 2, y + 5, 'weights', 'ts', 'middle');
  });
  o += rect(X0 + 26 * px + 10, 278 - 12, 12, 12, 'solid') + text(X0 + 26 * px + 28, 277, 'KV cache（B × 1024 个 token）', 'ts', 'start');
  o += rect(X0, 278 - 12, 12, 12, 'wash2') + text(X0 + 18, 277, 'weights', 'ts', 'start');
  return svgA(560, 284, o, '动图：Llama 2 13B 在 batch 64、1、4、16 时，decode 一步要读的 weight 和 KV cache。Batch 小时 weight 占大头，W4A16 省得多；batch 64 时 KV cache 占大头，W4A16 只从 79.7 GB 降到 60.9 GB，GQA 降到 33.4 GB。');
}

// ---------- 6. Action token 怎样读 observation：三种 mask ----------
function masks() {
  const c = 13;
  let o = '';
  o += text(280, 14, '行是 query，列是 key；深色的格子能看见', 'ts', 'middle');
  const grid = (x0, y0, rows, cols, ok, rl, cl) => {
    for (let i = 0; i < rows.length; i++) for (let j = 0; j < cols.length; j++) o += rect(x0 + j * c + 0.5, y0 + i * c + 0.5, c - 1, c - 1, ok(i, j) ? 'solid' : 'wash2');
    cols.forEach((s, j) => { o += text(x0 + j * c + c / 2, y0 - 4, s, 'ts', 'middle'); });
    if (rl) rows.forEach((s, i) => { o += text(x0 - 4, y0 + i * c + c / 2 + 4, s, 'ts', 'end'); });
  };
  const brace = (x, y1, y2, label, sub, cls = 'ink') => {
    o += path(`M${f1(x)} ${f1(y1)}h5V${f1(y2)}h-5`, cls);
    o += text(x + 9, (y1 + y2) / 2 + (sub ? -2 : 4), label, 'ts', 'start');
    if (sub) o += text(x + 9, (y1 + y2) / 2 + 12, sub, 'ts', 'start');
  };
  // (a) RT-2 / OpenVLA：一条 causal sequence
  const sa = ['I', 'I', 'I', 'I', 'L', 'L', 'a', 'a', 'a'];
  const ax = 22, ay = 56;
  o += text(ax + 4.5 * c, 36, 'RT-2、OpenVLA', 'tb', 'middle');
  grid(ax, ay, sa, sa, (i, j) => j <= i, true);
  brace(ax + 9 * c + 4, ay, ay + 6 * c, 'prefill', '');
  brace(ax + 9 * c + 4, ay + 6 * c + 2, ay + 9 * c, 'decode', '一次一行');
  o += text(ax + 4.5 * c, ay + 9 * c + 22, 'causal：OpenVLA 每个', 'ts', 'middle');
  o += text(ax + 4.5 * c, ay + 9 * c + 38, 'action 要 decode 7 个 token', 'ts', 'middle');
  // (b) ACT：k 个 query slot 读 encoder 的全部 token
  const bx = 232, by = 56;
  const cb = ['I', 'I', 'I', 'I', 'j', 'z'];
  const rb = ['1', '2', '3', '⋮', 'k'];
  o += text(bx + 3 * c, 36, 'ACT 的 decoder', 'tb', 'middle');
  grid(bx, by, rb, cb, () => true, true);
  o += text(bx - 4, by + 5 * c + 18, 'query 是第几步', 'ts', 'start');
  o += text(bx + 3 * c, by + 9 * c + 22, 'cross-attention：', 'ts', 'middle');
  o += text(bx + 3 * c, by + 9 * c + 38, 'k 个 action 一次出来', 'ts', 'middle');
  // (c) π0：block-causal
  const sc = ['I', 'I', 'I', 'L', 'q', 'a', 'a', 'a'];
  const blk = [0, 0, 0, 0, 1, 2, 2, 2];
  const cx = 350, cy = 56;
  o += text(cx + 4 * c, 36, 'π0', 'tb', 'middle');
  grid(cx, cy, sc, sc, (i, j) => blk[j] <= blk[i], true);
  brace(cx + 8 * c + 4, cy, cy + 5 * c, 'K、V 算一次', '存进 cache', 'ln');
  brace(cx + 8 * c + 4, cy + 5 * c + 2, cy + 8 * c, '每个 flow', 'step 重算');
  o += text(cx + 4 * c, cy + 9 * c + 22, 'block-causal：prefix', 'ts', 'middle');
  o += text(cx + 4 * c, cy + 9 * c + 38, '看不见 noisy action', 'ts', 'middle');
  o += text(4, 238, 'I：image token　L：language token　q：robot state　a：action token', 'ts', 'start');
  o += text(4, 254, 'j：joint position　z：CVAE 的 style variable', 'ts', 'start');
  return svg(560, 260, o, '三种 VLA 的 attention mask。RT-2 与 OpenVLA 是一条 causal sequence，action token 逐个 decode；ACT 的 decoder 用 k 个 query 一次读完全部 observation token；π0 是 block-causal，prefix 与 state 看不见 noisy action，所以它们的 K、V 只算一次。');
}

export default {
  'thread-attention-lookup': lookupA,
  'thread-attention-grad': gradA,
  'thread-attention-merge': mergeA,
  'thread-attention-cache': cacheA,
  'thread-attention-decode': decodeA,
  'thread-attention-masks': masks,
};
