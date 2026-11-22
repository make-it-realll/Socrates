import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, axes, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 小工具（只在这门课里用） ----------
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
// discrete 帧：每帧的起始时刻 / 总长
const frames = (durs) => { const T = durs.reduce((a, b) => a + b, 0); const kt = []; let t = 0; for (const x of durs) { kt.push(t / T); t += x; } return { kt, T }; };
// 带过渡的帧：每帧停 hold 秒，帧与帧之间线性过渡 trans 秒；lv 给出 linear 动画的 values / keyTimes（最后一个 keyTime 恰好是 1）
function timeline(holds, trans) {
  const s = [], e = []; let t = 0;
  holds.forEach((h, i) => { s.push(t); t += h; e.push(t); if (i < holds.length - 1) t += trans[i]; });
  return { s, e, T: t, kt: s.map((x) => x / t) };
}
const lv = (tl, vals) => { const kt = [], vs = []; vals.forEach((v, i) => { kt.push(tl.s[i] / tl.T, tl.e[i] / tl.T); vs.push(v, v); }); return [vs, kt]; };
const fx = (v, k) => v.toFixed(k);
// 从 box 中心沿方向走到 box 边界
const clipBox = ([cx, cy], [tx, ty], hw, hh, pad = 2) => {
  const dx = tx - cx, dy = ty - cy, t = Math.min(dx ? hw / Math.abs(dx) : 1e9, dy ? hh / Math.abs(dy) : 1e9);
  const L = Math.hypot(dx, dy);
  return [cx + dx * t + (dx / L) * pad, cy + dy * t + (dy / L) * pad];
};
const toward = ([x1, y1], [x2, y2], r) => { const L = Math.hypot(x2 - x1, y2 - y1); return [x1 + ((x2 - x1) * r) / L, y1 + ((y2 - y1) * r) / L]; };

// ---------- 第 1 站：grid world 和满足 KB 的 3 个 model ----------
function wumpus() {
  const c = 62, X0 = 22, Y0 = 46;
  const at = (x, y) => [X0 + (x - 1) * c, Y0 + (2 - y) * c];
  let o = text(X0 + 1.5 * c, 28, 'agent 走过的格子', 'tb', 'middle');
  for (let x = 1; x <= 3; x++) for (let y = 1; y <= 2; y++) {
    const [px, py] = at(x, y), vis = y === 1 && x <= 2;
    o += rect(px, py, c, c, vis ? 'wash' : 'paper') + text(px + 5, py + 15, `[${x},${y}]`, 'ts');
  }
  let [px, py] = at(1, 1); o += text(px + c / 2, py + 42, 'B₁₁ = F', 't', 'middle');
  [px, py] = at(2, 1); o += text(px + c / 2, py + 42, 'B₂₁ = T', 't', 'middle');
  for (const [x, y] of [[1, 2], [2, 2], [3, 1], [3, 2]]) { const [qx, qy] = at(x, y); o += text(qx + c / 2, qy + 42, '?', 'ts', 'middle'); }
  o += text(X0, Y0 + 2 * c + 20, '浅色 = 走过；B = breeze', 'ts');
  // 右边：满足 KB 的 model
  const models = [[[3, 1]], [[2, 2]], [[2, 2], [3, 1]]];
  const labs = ['pit 在 [3,1]', 'pit 在 [2,2]', 'pit 在 [2,2]、[3,1]'];
  const m = 28, MY = 76;
  o += text(384, 28, 'KB 为 true 的全部 3 个 model', 'tb', 'middle');
  models.forEach((pits, k) => {
    const MX = 242 + k * 100;
    for (let x = 1; x <= 3; x++) for (let y = 1; y <= 2; y++) o += rect(MX + (x - 1) * m, MY + (2 - y) * m, m, m, 'paper');
    o += rect(MX, MY, m, m, 'ln');
    for (const [x, y] of pits) o += circle(MX + (x - 0.5) * m, MY + (2 - y + 0.5) * m, 8, 'solid2');
    o += text(MX + 42, MY - 10, 'model ' + (k + 1), 'ts', 'middle');
    o += text(MX + 42, MY + 2 * m + 18, labs[k], 'ts', 'middle');
  });
  o += text(384, MY + 2 * m + 42, '粗框是 [1,2]：三个 model 里都没有 pit', 'ts', 'middle');
  o += text(22, 214, '7 个 symbol 一共 2⁷ = 128 个 model，满足 KB 的只有这 3 个（深色圆 = pit）。', 't');
  o += text(22, 234, '[1,2] 在三个里都安全，所以 KB ⊨ ¬P₁₂；[2,2] 在 model 1 里没有 pit，所以 KB ⊭ P₂₂。', 't');
  return svg(560, 240, o, '左边是 3 乘 2 的 grid，agent 在 [1,1] 没有感到 breeze，在 [2,1] 感到 breeze；右边是满足 KB 的三个 model，pit 分别在 [3,1]、[2,2]、两处都有，三个 model 里 [1,2] 都没有 pit');
}

// ---------- 第 1 站：resolution 一步步推出 empty clause ----------
function resolutionA() {
  const G = [['R₃', '¬B₂₁ ∨ P₁₁ ∨ P₂₂ ∨ P₃₁'], ['R₅', 'B₂₁'], ['R₁', '¬P₁₁'], ['¬α', '¬P₂₂'], ['¬α', '¬P₃₁']];
  const D = ['P₁₁ ∨ P₂₂ ∨ P₃₁', 'P₂₂ ∨ P₃₁', 'P₃₁', 'empty clause'];
  const on = ['B₂₁', 'P₁₁', 'P₂₂', 'P₃₁'];
  const gy = [44, 88, 132, 176, 220], dy = [66, 132, 176, 220], h = 30;
  const GX = 58, GW = 190, DX = 304, DW = 150;
  const durs = [3.4, 2.6, 2.6, 2.4, 2.4], { kt, T } = frames(durs), nF = durs.length;
  const cur = (f) => (f === 0 ? 3 : f === 1 ? -1 : f - 2);
  const parents = (k) => (k === 0 ? [['g', 0], ['g', 1]] : [['d', k - 1], ['g', k + 1]]);
  let o = text(GX + GW / 2, 22, 'KB 里的 clause 与 ¬α 拆出的 clause', 'tb', 'middle') + text(DX + DW / 2, 22, 'resolvent', 'tb', 'middle');
  G.forEach(([tag, s], i) => { o += rect(GX, gy[i], GW, h, i >= 3 ? 'wash' : 'paper', 4) + text(GX - 7, gy[i] + 20, tag, 'ts', 'end') + text(GX + GW / 2, gy[i] + 20, s, 't', 'middle'); });
  // resolvent：每个 step 两个版本（普通 / 当前这一步高亮）
  D.forEach((s, k) => {
    const lines = (k === 0
      ? arrow(GX + GW, gy[0] + h / 2, DX, dy[0] + h / 2, 'ink') + arrow(GX + GW, gy[1] + h / 2, DX, dy[0] + h / 2, 'ink')
      : arrow(GX + GW, gy[k + 1] + h / 2, DX, dy[k] + h / 2, 'ink') + arrow(DX + DW / 2, dy[k - 1] + h, DX + DW / 2, dy[k], 'ink'));
    const body = (cls) => lines + rect(DX, dy[k], DW, h, cls, 4) + text(DX + DW / 2, dy[k] + 20, s, k === 3 ? 'tl' : 't', 'middle') + text(DX + DW + 10, dy[k] + 20, '消去 ' + on[k], 'ts');
    const vis = Array.from({ length: nF }, (_, f) => f === 0 || f >= k + 2);
    o += grp(body('paper'), vis.map((v, f) => v && cur(f) !== k), kt, T);
    o += grp(body('wash-strong'), vis.map((v, f) => v && cur(f) === k), kt, T);
  });
  // 当前这一步的两个 parent 加粗框
  for (let f = 0; f < nF; f++) {
    const k = cur(f); if (k < 0) continue;
    let g = '';
    for (const [t, i] of parents(k)) g += t === 'g' ? rect(GX, gy[i], GW, h, 'ln', 4) : rect(DX, dy[i], DW, h, 'ln', 4);
    o += grp(g, Array.from({ length: nF }, (_, j) => j === f), kt, T);
  }
  const st = [
    ['step 4：P₃₁ 与 ¬P₃₁ 相消，什么都不剩，得到 empty clause（记作 □）。', '所以 KB ∧ ¬α unsatisfiable，KB ⊨ α，其中 α = P₂₂ ∨ P₃₁。'],
    ['左边：KB 的 CNF 里要用到的 3 个 clause，加上 ¬α = ¬P₂₂ ∧ ¬P₃₁ 拆出的 2 个。', '每一步挑两个含一对 complementary literal 的 clause（粗框）。'],
    ['step 1：第一个 clause 含 ¬B₂₁，第二个是 B₂₁，两者相消，', '其余 literal 并起来：P₁₁ ∨ P₂₂ ∨ P₃₁。'],
    ['step 2：和 ¬P₁₁ resolve，消去 P₁₁，剩 P₂₂ ∨ P₃₁。', ''],
    ['step 3：和 ¬P₂₂ resolve，消去 P₂₂，剩 P₃₁。', ''],
  ];
  st.forEach(([a, b], f) => { o += grp(text(GX - 30, 274, a, 't') + text(GX - 30, 293, b, 't'), st.map((_, j) => j === f), kt, T); });
  return svgA(560, 300, o, '动图：五个 clause 依次 resolve，先消 B21 得到 P11 或 P22 或 P31，再消 P11、P22、P31，最后得到 empty clause，说明 KB 加上 query 的否定 unsatisfiable');
}

// ---------- 第 2 站：forward chaining，count 与 agenda ----------
const FC_P = { A: [52, 150], B: [182, 80], C: [182, 220], D: [330, 150], E: [330, 262], Q: [505, 150] };
const FC_K = [
  { pre: ['A'], c: 'B', at: [116, 114], n: '①', lab: 'up' },
  { pre: ['A'], c: 'C', at: [116, 186], n: '②', lab: 'up' },
  { pre: ['B', 'C'], c: 'D', at: [262, 150], n: '③', lab: 'up' },
  { pre: ['D', 'E'], c: 'Q', at: [425, 206], n: '④', lab: 'down' },
  { pre: ['A', 'D'], c: 'Q', at: [425, 94], n: '⑤', lab: 'up' },
];
function fcA() {
  const R = 18, bw = 30, bh = 24;
  // 实际跑一遍 forward chaining，记录每次 pop 之后的状态
  const count = FC_K.map((k) => k.pre.length), inferred = new Set(), agenda = ['A'];
  const S = [{ count: count.slice(), inf: new Set(), ag: agenda.slice(), pop: null, dec: [] }];
  while (agenda.length) {
    const p = agenda.shift();
    if (inferred.has(p)) continue;
    inferred.add(p);
    const dec = [];
    if (p !== 'Q') FC_K.forEach((k, i) => { if (k.pre.includes(p)) { count[i]--; dec.push(i); if (count[i] === 0) agenda.push(k.c); } });
    S.push({ count: count.slice(), inf: new Set(inferred), ag: agenda.slice(), pop: p, dec });
    if (p === 'Q') break;
  }
  const order = [S.length - 1, ...S.slice(0, -1).map((_, i) => i)];
  const durs = order.map((i) => (i === S.length - 1 ? 3.6 : 2.6)), { kt, T } = frames(durs);
  let o = '';
  for (const k of FC_K) {
    for (const p of k.pre) o += line(...FC_P[p], ...k.at, 'mute');
    const end = toward(FC_P[k.c], k.at, R + 2);
    o += arrow(...clipBox(k.at, FC_P[k.c], bw / 2, bh / 2, 0), ...end, 'ink');
    o += text(k.at[0], k.lab === 'up' ? k.at[1] - bh / 2 - 6 : k.at[1] + bh / 2 + 16, k.n, 'ts', 'middle');
  }
  o += text(52, 190, 'fact ⑥', 'ts', 'middle');
  o += text(354, 270, '不是 fact，也没有 clause 推出它', 'ts');
  const names = { 1: '①', 2: '②', 3: '③', 4: '④', 5: '⑤' };
  const msg = (s) => {
    if (!s.pop) return '开始：count = 每个 clause 的 premise 个数；唯一的 fact A 进 agenda。';
    if (s.pop === 'Q') return 'pop Q：query 得证。E 从没进过 agenda，④ 的 count 停在 1。';
    const zero = s.dec.filter((i) => s.count[i] === 0);
    return `pop ${s.pop}：${s.pop} 设为 true，${s.dec.map((i) => names[i + 1]).join('')} 的 count 各减 1` + (zero.length ? `；${zero.map((i) => names[i + 1]).join('')} 变成 0，${zero.map((i) => FC_K[i].c).join('、')} 进 agenda。` : '，没有变成 0 的。');
  };
  order.forEach((si, f) => {
    const s = S[si];
    let g = '';
    for (const [n, [x, y]] of Object.entries(FC_P)) { const on = s.inf.has(n); g += circle(x, y, R, on ? 'solid' : 'paper') + text(x, y + 5, n, on ? 'tw' : 'tb', 'middle'); }
    FC_K.forEach((k, i) => {
      const z = s.count[i] === 0, hot = s.dec.includes(i);
      g += rect(k.at[0] - bw / 2, k.at[1] - bh / 2, bw, bh, z ? 'solid' : hot ? 'wash-strong' : 'paper', 4) + text(k.at[0], k.at[1] + 5, String(s.count[i]), z ? 'tw' : 't', 'middle');
    });
    g += text(20, 304, 'agenda：[' + s.ag.join(', ') + ']', 'tb') + text(20, 326, msg(s), 't');
    o += grp(g, order.map((_, j) => j === f), kt, T);
  });
  return svgA(560, 334, o, '动图：forward chaining 从 fact A 出发，clause 方框里的数是还没满足的 premise 个数，减到 0 时 conclusion 进 agenda；依次推出 B、C、D、Q，E 始终没有推出');
}

// ---------- 第 2 站：backward chaining 的 AND-OR tree ----------
function bctree() {
  const goal = (x, y, s, st) => circle(x, y, 15, st === 'ok' ? 'solid' : 'paper') + text(x, y + 5, s, st === 'ok' ? 'tw' : 'tb', 'middle');
  const cl = (x, y, s, st) => (st === 'fail' ? rect(x - 40, y - 13, 80, 26, 'paper-f', 4) + rect(x - 40, y - 13, 80, 26, 'dash', 4) : rect(x - 40, y - 13, 80, 26, 'paper', 4) + rect(x - 40, y - 13, 80, 26, 'wash-strong', 4)) + text(x, y + 5, s, 't', 'middle');
  const E = [[[280, 34], [150, 90]], [[280, 34], [420, 90]], [[150, 90], [95, 146]], [[150, 90], [205, 146]], [[95, 146], [95, 202]], [[95, 202], [55, 258]], [[95, 202], [135, 258]],
    [[420, 90], [370, 146]], [[420, 90], [470, 146]]];
  let o = '';
  for (const [a, b] of E) o += line(...a, ...b, 'mute');
  o += goal(280, 34, 'Q', 'ok') + text(302, 39, 'query', 'ts');
  o += cl(150, 90, '④ D ∧ E', 'fail') + cl(420, 90, '⑤ A ∧ D', 'ok');
  o += goal(95, 146, 'D', 'ok') + goal(205, 146, 'E', 'no') + text(205, 178, '没有 clause 推出 E：✗', 'ts', 'middle');
  o += cl(95, 202, '③ B ∧ C', 'ok');
  o += goal(55, 258, 'B', 'ok') + goal(135, 258, 'C', 'ok');
  o += text(55, 292, '① 要 A：fact', 'ts', 'middle') + text(150, 292, '② 要 A：fact', 'ts', 'middle');
  o += goal(370, 146, 'A', 'ok') + text(370, 178, 'fact', 'ts', 'middle');
  o += goal(470, 146, 'D', 'ok') + text(470, 178, '左边已证过，直接用', 'ts', 'middle');
  o += text(20, 326, '虚线框 ④ 卡在 E，失败；换 ⑤：A 是 fact，D 已证，Q 得证。深色圆 = 已证的 goal。', 'ts');
  return svg(560, 332, o, 'Backward chaining 的 AND-OR tree：Q 可以由 clause 4（D 且 E）或 clause 5（A 且 D）推出；clause 4 因为 E 推不出而失败，clause 5 成功');
}

// ---------- 第 3 站：Australia 地图与 constraint graph ----------
const AUS = { WA: ['NT', 'SA'], NT: ['WA', 'SA', 'Q'], SA: ['WA', 'NT', 'Q', 'NSW', 'V'], Q: ['NT', 'SA', 'NSW'], NSW: ['Q', 'SA', 'V'], V: ['SA', 'NSW'], T: [] };
function cspmap() {
  const reg = {
    WA: [[[20, 74], [60, 54], [110, 42], [110, 202], [70, 214], [24, 198]], [64, 132]],
    NT: [[[110, 42], [178, 42], [178, 122], [110, 122]], [144, 86]],
    Q: [[[178, 42], [205, 32], [240, 72], [270, 122], [276, 154], [205, 154], [205, 122], [178, 122]], [232, 100]],
    SA: [[[110, 122], [205, 122], [205, 212], [160, 202], [130, 217], [110, 202]], [156, 168]],
    NSW: [[[205, 154], [276, 154], [266, 202], [205, 202]], [238, 182]],
    V: [[[205, 202], [266, 202], [246, 230], [205, 224]], [228, 219]],
    T: [[[222, 246], [246, 246], [242, 264], [226, 264]], [256, 260]],
  };
  let o = text(150, 20, '地图：7 个 region，3 种颜色', 'tb', 'middle');
  for (const [n, [pts, [lx, ly]]] of Object.entries(reg)) o += poly(pts, 'paper') + text(lx, ly + 4, n, n === 'V' ? 'ts' : 'tb', n === 'T' ? 'start' : 'middle');
  const N = { WA: [330, 140], NT: [395, 74], SA: [420, 166], Q: [482, 86], NSW: [502, 178], V: [452, 240], T: [534, 246] };
  o += text(432, 20, 'constraint graph', 'tb', 'middle');
  const seen = new Set();
  for (const [a, ns] of Object.entries(AUS)) for (const b of ns) { const key = [a, b].sort().join(); if (seen.has(key)) continue; seen.add(key); o += line(...N[a], ...N[b], 'ink'); }
  for (const [n, [x, y]] of Object.entries(N)) o += circle(x, y, 19, 'paper') + text(x, y + 4, n, n.length > 2 ? 'ts' : 't', 'middle');
  o += text(280, 290, '相邻的两个 region 不能同色：graph 里每条 edge 是一个 ≠ constraint，一共 9 条。T 不和任何 region 相邻。', 'ts', 'middle');
  return svg(560, 298, o, '左边是 Australia 七个 region 的示意地图，右边是对应的 constraint graph，相邻的 region 之间连一条 edge，Tasmania 孤立');
}

// ---------- 第 3 站：AC-3 在 forward checking 之后继续删 ----------
function ac3A() {
  const C = ['R', 'G', 'B'], assigned = { WA: 'R', Q: 'G' };
  let dom = {}; for (const k in AUS) dom[k] = C.slice();
  for (const [v, c] of Object.entries(assigned)) { dom[v] = [c]; for (const n of AUS[v]) if (!(n in assigned)) dom[n] = dom[n].filter((x) => x !== c); }
  const clone = (D) => Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v.slice()]));
  // queue 的初始顺序照 CS188 note 3 的例子
  const q = [['SA', 'V'], ['V', 'SA'], ['SA', 'NSW'], ['NSW', 'SA'], ['SA', 'NT'], ['NT', 'SA'], ['V', 'NSW'], ['NSW', 'V']];
  const qs = (Q) => Q.map(([a, b]) => `${a}→${b}`).join(', ');
  const states = [{ dom: clone(dom), arc: null, rem: [], q: qs(q) }];
  while (q.length) {
    const [xi, xj] = q.shift();
    const rem = dom[xi].filter((x) => !dom[xj].some((y) => y !== x));
    dom[xi] = dom[xi].filter((x) => !rem.includes(x));
    if (rem.length && dom[xi].length) for (const xk of AUS[xi]) if (!(xk in assigned) && !q.some(([a, b]) => a === xk && b === xi)) q.push([xk, xi]);
    states.push({ dom: clone(dom), arc: [xi, xj], rem, removedFrom: xi, q: qs(q) });
    if (!dom[xi].length) break;
  }
  const N = { WA: [70, 150], NT: [200, 62], SA: [230, 192], Q: [360, 62], NSW: [392, 192], V: [312, 290], T: [480, 290] };
  const hw = 46, hh = 26;
  const order = [states.length - 1, ...states.slice(0, -1).map((_, i) => i)];
  const durs = order.map((i) => (i === states.length - 1 ? 3.8 : 3.0)), { kt, T } = frames(durs);
  let o = '';
  const seen = new Set();
  for (const [a, ns] of Object.entries(AUS)) for (const b of ns) { const key = [a, b].sort().join(); if (seen.has(key)) continue; seen.add(key); o += line(...N[a], ...N[b], 'mute'); }
  for (const [n, [x, y]] of Object.entries(N)) o += rect(x - hw, y - hh, 2 * hw, 2 * hh, 'paper', 6) + (n in assigned ? rect(x - hw, y - hh, 2 * hw, 2 * hh, 'wash', 6) : '') + text(x, y - 7, n + (n in assigned ? ' = ' + assigned[n] : ''), 'tb', 'middle');
  const st = (s) => {
    if (!s.arc) return ['WA = R、Q = G 之后做 forward checking：NT、SA 都只剩 B，NSW 剩 R、B。', '没有哪个 domain 是空的，forward checking 不报错。下面开始 AC-3。'];
    const [a, b] = s.arc, v = s.rem.join('、');
    if (!s.rem.length) return [`arc ${a} → ${b}：${a} 的每个值在 ${b}（${s.dom[b].join('、')}）里都找得到不同的值，不删。`, ''];
    if (!s.dom[a].length) return [`arc ${a} → ${b}：${a} 唯一的 ${v} 在 ${b}（只剩 ${s.dom[b].join('、')}）里找不到不同的值，${a} 的 domain 空了。`, '还没给下一个 variable 赋值，就知道 WA = R、Q = G 必须撤回。'];
    return [`arc ${a} → ${b}：${a} 取 ${v} 时，${b}（${s.dom[b].join('、')}）里没有不同于它的值，删掉 ${v}。`, `${a} 变了，指向 ${a} 的 arc 不在 queue 里的补进去。`];
  };
  order.forEach((si, f) => {
    const s = states[si];
    let g = '';
    for (const [n, [x, y]] of Object.entries(N)) {
      const vals = n in assigned ? [assigned[n]] : C;
      vals.forEach((c, i) => {
        const cx = n in assigned ? x - 9 : x - 32 + i * 23, cy = y + 3;
        const has = s.dom[n].includes(c), now = s.arc && s.removedFrom === n && s.rem.includes(c);
        if (n in assigned) g += rect(cx, cy, 18, 18, 'solid', 3) + text(cx + 9, cy + 14, c, 'tw', 'middle');
        else if (has) g += rect(cx, cy, 18, 18, 'paper', 3) + text(cx + 9, cy + 14, c, 't', 'middle');
        else if (now) g += rect(cx, cy, 18, 18, 'wash-strong', 3) + text(cx + 9, cy + 14, c, 'tl', 'middle') + line(cx + 2, cy + 16, cx + 16, cy + 2, 'ln');
        else g += rect(cx, cy, 18, 18, 'dash', 3);
      });
      if (!s.dom[n].length) g += text(x + 39, y + 16, '∅', 'tl', 'middle');
    }
    if (s.arc) { const [a, b] = s.arc; g += arrow(...clipBox(N[a], N[b], hw, hh), ...clipBox(N[b], N[a], hw, hh), 'ln', 9); }
    const [l1, l2] = st(s);
    g += text(16, 344, l1, 't') + text(16, 363, l2, 't') + text(16, 384, 'queue：' + (s.q || '（空）'), 'ts');
    o += grp(g, order.map((_, j) => j === f), kt, T);
  });
  o += text(548, 22, '虚线格 = 已删的值', 'ts', 'end');
  return svgA(560, 390, o, '动图：WA 为 R、Q 为 G 之后，AC-3 按 queue 依次检查 arc：V 到 SA 删掉 V 的 B，NSW 到 SA 删掉 NSW 的 B，SA 到 NT 删掉 SA 的 B，SA 的 domain 变空');
}

// ---------- 第 4 站：alarm network 和它的 CPT ----------
const BN = { PB: 0.001, PE: 0.002, PA: { '11': 0.95, '10': 0.94, '01': 0.29, '00': 0.001 }, PJ: [0.05, 0.9], PM: [0.01, 0.7] };
function alarm() {
  const N = { B: [150, 52], E: [410, 52], A: [280, 122], J: [100, 290], M: [460, 290] };
  const r = 22;
  let o = '';
  for (const [a, b] of [['B', 'A'], ['E', 'A'], ['A', 'J'], ['A', 'M']]) o += arrow(...toward(N[a], N[b], r), ...toward(N[b], N[a], r + 1), 'ink');
  for (const [n, [x, y]] of Object.entries(N)) o += circle(x, y, r, 'paper') + text(x, y + 5, n, 'tb', 'middle');
  o += text(150, 20, 'Burglary', 'ts', 'middle') + text(410, 20, 'Earthquake', 'ts', 'middle');
  o += text(310, 128, 'Alarm', 'ts') + text(70, 295, 'JohnCalls', 'ts', 'end') + text(490, 295, 'MaryCalls', 'ts');
  o += text(118, 57, `P(+b) = ${BN.PB}`, 't', 'end') + text(442, 57, `P(+e) = ${BN.PE}`, 't');
  // A 的 CPT
  const tx = 222, ty = 208;
  o += rect(tx - 8, ty - 16, 132, 96, 'paper', 4);
  o += text(tx, ty, 'B', 'tb') + text(tx + 28, ty, 'E', 'tb') + text(tx + 116, ty, 'P(+a | B, E)', 'ts', 'end');
  [['+b', '+e', '11'], ['+b', '¬e', '10'], ['¬b', '+e', '01'], ['¬b', '¬e', '00']].forEach(([b, e, k], i) => {
    o += text(tx, ty + 19 + i * 18, b, 't') + text(tx + 28, ty + 19 + i * 18, e, 't') + text(tx + 116, ty + 19 + i * 18, String(BN.PA[k]), 't', 'end');
  });
  o += text(100, 334, `P(+j | +a) = ${BN.PJ[1].toFixed(2)}`, 't', 'middle') + text(100, 353, `P(+j | ¬a) = ${BN.PJ[0].toFixed(2)}`, 't', 'middle');
  o += text(460, 334, `P(+m | +a) = ${BN.PM[1].toFixed(2)}`, 't', 'middle') + text(460, 353, `P(+m | ¬a) = ${BN.PM[0].toFixed(2)}`, 't', 'middle');
  o += text(280, 384, '每个 node 只存“给定 parents 时自己的 distribution”：1 + 1 + 4 + 2 + 2 = 10 个数；', 'ts', 'middle');
  o += text(280, 402, '完整的 joint table 要 2⁵ − 1 = 31 个。', 'ts', 'middle');
  return svg(560, 408, o, 'Alarm network：Burglary 和 Earthquake 指向 Alarm，Alarm 指向 JohnCalls 和 MaryCalls，每个 node 旁边是它的 conditional probability table');
}

// 在 alarm network 上算 conditional probability（给图里的数用）
function alarmP(cond, event) {
  const p = (v, q) => (v ? q : 1 - q);
  let num = 0, den = 0;
  for (let b = 0; b < 2; b++) for (let e = 0; e < 2; e++) for (let a = 0; a < 2; a++) for (let j = 0; j < 2; j++) for (let m = 0; m < 2; m++) {
    const x = { b, e, a, j, m };
    const pr = p(b, BN.PB) * p(e, BN.PE) * p(a, BN.PA[`${b}${e}`]) * p(j, BN.PJ[a]) * p(m, BN.PM[a]);
    if (Object.entries(cond).every(([k, v]) => x[k] === v)) { den += pr; if (Object.entries(event).every(([k, v]) => x[k] === v)) num += pr; }
  }
  return num / den;
}

// ---------- 第 4 站：三种 triple ----------
function triples() {
  const cols = [
    { title: 'causal chain', nodes: ['B', 'A', 'J'], dir: ['r', 'r'],
      top: ['active：B、J dependent', `P(+j | +b) = ${fx(alarmP({ b: 1 }, { j: 1 }), 3)}`, `P(+j) = ${fx(alarmP({}, { j: 1 }), 3)}`], topOn: true,
      bot: ['blocked：B ⊥ J | A', `P(+j | +a, +b) = ${fx(alarmP({ a: 1, b: 1 }, { j: 1 }), 2)}`, '= P(+j | +a)'], botOn: false },
    { title: 'common cause', nodes: ['J', 'A', 'M'], dir: ['l', 'r'],
      top: ['active：J、M dependent', `P(+m | +j) = ${fx(alarmP({ j: 1 }, { m: 1 }), 3)}`, `P(+m) = ${fx(alarmP({}, { m: 1 }), 3)}`], topOn: true,
      bot: ['blocked：J ⊥ M | A', `P(+m | +a, +j) = ${fx(alarmP({ a: 1, j: 1 }, { m: 1 }), 2)}`, '= P(+m | +a)'], botOn: false },
    { title: 'common effect', nodes: ['B', 'A', 'E'], dir: ['r', 'l'],
      top: ['blocked：B ⊥ E', `P(+b | +e) = ${fx(alarmP({ e: 1 }, { b: 1 }), 3)}`, '= P(+b)'], topOn: false,
      bot: ['active：explaining away', `P(+b | +a) = ${fx(alarmP({ a: 1 }, { b: 1 }), 3)}`, `P(+b | +a, +e) = ${fx(alarmP({ a: 1, e: 1 }, { b: 1 }), 4)}`], botOn: true },
  ];
  let o = text(280, 16, '上排：A 没有观测；下排：A 已观测（深色）', 'ts', 'middle');
  cols.forEach((c, k) => {
    const x0 = 8 + k * 185, xs = [x0 + 30, x0 + 88, x0 + 146];
    o += text(x0 + 88, 40, c.title, 'tb', 'middle');
    [[76, c.top, c.topOn, false], [204, c.bot, c.botOn, true]].forEach(([y, lines, act, obs]) => {
      if (act) o += path(`M${f1(xs[0])} ${f1(y - 18)}Q${f1(xs[1])} ${f1(y - 44)} ${f1(xs[2])} ${f1(y - 18)}`, 'ln-dash');
      c.dir.forEach((dd, i) => { const [a, b] = dd === 'r' ? [xs[i], xs[i + 1]] : [xs[i + 1], xs[i]]; o += arrow(a + (a < b ? 15 : -15), y, b + (a < b ? -16 : 16), y, 'ink', 6); });
      c.nodes.forEach((n, i) => { const sh = obs && i === 1; o += circle(xs[i], y, 14, sh ? 'solid2' : 'paper') + text(xs[i], y + 5, n, sh ? 'tw' : 'tb', 'middle'); });
      o += text(x0 + 88, y + 34, lines[0], act ? 'tl' : 'tb', 'middle') + text(x0 + 88, y + 52, lines[1], 'ts', 'middle') + text(x0 + 88, y + 68, lines[2], 'ts', 'middle');
    });
  });
  o += text(280, 296, '虚线弧 = 这条 path 让两端 dependent（active）；没有弧 = blocked。数字都在第 4 站的 alarm network 上算出。', 'ts', 'middle');
  return svg(560, 302, o, '三种 triple：causal chain 和 common cause 在中间的 A 未观测时 active、观测后 blocked；common effect 正好相反，A 未观测时 blocked，观测后 active，即 explaining away');
}

// ---------- 第 5 站：variable elimination 一步步走 ----------
function veA() {
  const { PB, PE, PA, PJ, PM } = BN;
  const g1 = PJ[1] * PM[1], g0 = PJ[0] * PM[0];
  const f1t = {}; for (const b of [1, 0]) for (const e of [1, 0]) f1t[`${b}${e}`] = PA[`${b}${e}`] * g1 + (1 - PA[`${b}${e}`]) * g0;
  const f2t = {}; for (const b of [1, 0]) f2t[b] = PE * f1t[`${b}1`] + (1 - PE) * f1t[`${b}0`];
  const f3t = { 1: PB * f2t[1], 0: (1 - PB) * f2t[0] }, Z = f3t[1] + f3t[0];
  const sig = (v) => (v >= 0.01 ? fx(v, 4) : v.toPrecision(3));
  const chipW = (s) => s.length * 6.9 + 18;
  const chips = (x, y, list) => { let g = '', cx = x; const pos = []; for (const [s, nw] of list) { const w = chipW(s); g += rect(cx, y, w, 24, nw ? 'solid' : 'paper', 12) + text(cx + w / 2, y + 17, s, nw ? 'tw' : 't', 'middle'); pos.push([cx, w]); cx += w + 8; } return [g, pos]; };
  const rowsY = [[10, 76], [84, 214], [222, 296], [304, 384]];
  const durs = [3.6, 2.6, 3.8, 3.2], { kt, T } = frames(durs), nF = durs.length;
  const rows = [];
  // row 0
  let [g, p0] = chips(20, 42, [['P(B)'], ['P(E)'], ['P(A | B, E)'], ['P(+j | A)'], ['P(+m | A)']]);
  rows.push(text(20, 30, '开始：5 个 factor，evidence +j、+m 已经代进各自的 CPT', 'tb') + g);
  // row 1
  const L = 292;
  let [g1c, p1] = chips(20, 128, [['P(B)'], ['P(E)'], ['f₁(B, E)', 1]]);
  let r1 = text(20, 104, 'eliminate A：把含 A 的 3 个 factor 乘起来，对 A 求和', 'tb') + g1c;
  r1 += text(L, 128, `P(+j | a) P(+m | a)：+a ${fx(g1, 2)}，¬a ${g0}`, 'ts');
  [['+b +e', '11'], ['+b ¬e', '10'], ['¬b +e', '01'], ['¬b ¬e', '00']].forEach(([lab, k], i) => {
    r1 += text(L, 148 + i * 17, `${lab}：${PA[k]}·${fx(g1, 2)} + ${+(1 - PA[k]).toFixed(3)}·${g0} = ${sig(f1t[k])}`, 't');
  });
  rows.push(r1);
  // row 2
  let [g2c, p2] = chips(20, 252, [['P(B)'], ['f₂(B)', 1]]);
  let r2 = text(20, 242, 'eliminate E：P(E) × f₁(B, E)，对 E 求和', 'tb') + g2c;
  r2 += text(L, 262, `+b：${PE}·${sig(f1t['11'])} + ${1 - PE}·${sig(f1t['10'])} = ${sig(f2t[1])}`, 't');
  r2 += text(L, 280, `¬b：${PE}·${sig(f1t['01'])} + ${1 - PE}·${sig(f1t['00'])} = ${sig(f2t[0])}`, 't');
  rows.push(r2);
  // row 3
  let [g3c] = chips(20, 338, [['f₃(B)', 1]]);
  let r3 = text(20, 324, '最后：P(B) × f₂(B)，再 normalize', 'tb') + g3c;
  r3 += text(L, 342, `+b：${PB}·${sig(f2t[1])} = ${sig(f3t[1])}`, 't') + text(L, 360, `¬b：${1 - PB}·${sig(f2t[0])} = ${sig(f3t[0])}`, 't');
  r3 += text(L, 379, `P(+b | +j, +m) = ${sig(f3t[1])} / ${sig(Z)} = ${fx(f3t[1] / Z, 3)}`, 'tl');
  rows.push(r3);
  // 每帧：哪一 row 是当前（底色），以及上一 row 里被用掉的 chip（粗框）
  const cur = (f) => (f === 0 ? 3 : f - 1);
  const used = [null, [p0, [2, 3, 4]], [p1, [1, 2]], [p2, [0, 1]]];
  let o = '';
  for (let f = 0; f < nF; f++) {
    const k = cur(f), [y0, y1] = rowsY[k];
    let h = rect(8, y0, 548, y1 - y0, 'wash', 6);
    if (used[k]) { const [pos, idx] = used[k], cy = [42, 128, 252][k - 1]; for (const i of idx) h += rect(pos[i][0] - 2, cy - 2, pos[i][1] + 4, 28, 'ln', 14); }
    o += grp(h, Array.from({ length: nF }, (_, j) => j === f), kt, T);
  }
  rows.forEach((body, k) => { o += grp(body, Array.from({ length: nF }, (_, f) => f === 0 || f >= k + 1), kt, T); });
  return svgA(560, 386, o, '动图：在 alarm network 上求 P(B | +j, +m)。先把含 A 的三个 factor 相乘并对 A 求和得到 f1(B,E)，再和 P(E) 相乘对 E 求和得到 f2(B)，最后乘 P(B) 并 normalize 得到 0.284');
}

// ---------- 第 5 站：elimination order ----------
function veorder() {
  const Z = [150, 50], xs = [40, 100, 160, 260], labX = ['X₁', 'X₂', 'X₃', 'Xₙ'], labY = ['Y₁', 'Y₂', 'Y₃', 'Yₙ'];
  let o = text(150, 18, 'query P(Xₙ | y₁, …, yₙ)；深色 = 观测到的 Y', 'ts', 'middle');
  xs.forEach((x, i) => {
    o += arrow(...toward(Z, [x, 140], 18), ...toward([x, 140], Z, 19), 'ink', 6) + arrow(x, 158, x, 207, 'ink', 6);
    o += circle(x, 140, 17, 'paper') + text(x, 145, labX[i], 't', 'middle');
    o += circle(x, 226, 17, 'solid2') + text(x, 231, labY[i], 'tw', 'middle');
  });
  o += text(210, 145, '⋯', 'tb', 'middle') + text(210, 231, '⋯', 'tb', 'middle');
  o += circle(...Z, 18, 'paper') + text(Z[0], Z[1] + 5, 'Z', 'tb', 'middle');
  const box = (y, h, lines) => { let g = rect(308, y, 246, h, 'paper', 6); lines.forEach(([s, c], i) => { g += text(318, y + 22 + i * 19, s, c); }); return g; };
  o += box(30, 94, [['顺序一：先消 Z', 'tb'], ['P(Z) · P(X₁ | Z) ⋯ P(Xₙ | Z) 乘在一起', 't'], ['得到的 factor 含 Z, X₁, …, Xₙ', 'ts'], ['2ⁿ⁺¹ 行；n = 10 时 2048 行', 'tl']]);
  o += box(140, 94, [['顺序二：先消 X₁, …, Xₙ₋₁', 'tb'], ['每次只乘 P(Xᵢ | Z) · P(yᵢ | Xᵢ)', 't'], ['对 Xᵢ 求和得 fᵢ(Z)，2 行', 'ts'], ['最大的 factor 只含 Z, Xₙ：4 行', 'tl']]);
  return svg(560, 248, o, '一个 Z 有 n 个 child X1 到 Xn、每个 Xi 有一个观测到的 child Yi 的 network；先消 Z 会产生含 n+1 个 variable 的 factor，先消各个 Xi 则最大的 factor 只有两个 variable');
}

// ---------- 第 6 站：HMM 的 forward algorithm ----------
const HMM = { prior: [0.8, 0.2], T: [[0.6, 0.4], [0.1, 0.9]], O: { good: [0.8, 0.3], bad: [0.2, 0.7] } };
function forwardA() {
  const ev = ['good', 'bad', 'bad'];
  const B = [HMM.prior], Bp = [null], U = [null];
  for (const e of ev) {
    const b = B[B.length - 1];
    const bp = [0, 1].map((s) => b[0] * HMM.T[0][s] + b[1] * HMM.T[1][s]);
    const u = [0, 1].map((s) => HMM.O[e][s] * bp[s]), z = u[0] + u[1];
    Bp.push(bp); U.push(u); B.push(u.map((v) => v / z));
  }
  const cx = [80, 210, 340, 470], base = 252, H = 100;
  // 帧：0 完成态；1 t=0；2,3 = t1 预测/更新；4,5；6,7
  const tl = timeline([3.2, 1.8, 2.3, 2.6, 2.3, 2.6, 2.3, 2.6], [0.05, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6]);
  const nF = 8;
  const stage = (t, f) => (f === 0 ? 2 : t === 0 ? 2 : f < 2 * t ? 0 : f === 2 * t ? 1 : 2); // 0 未到，1 预测，2 已更新
  let o = '';
  // 上方 HMM 结构
  cx.forEach((x, t) => {
    o += circle(x, 34, 17, 'paper') + text(x, 39, `W${'₀₁₂₃'[t]}`, 't', 'middle');
    if (t < 3) o += arrow(x + 18, 34, cx[t + 1] - 19, 34, 'ink', 6);
    if (t > 0) {
      o += arrow(x, 52, x, 77, 'ink', 6) + circle(x, 95, 17, 'solid2') + text(x, 100, `F${'₀₁₂₃'[t]}`, 'tw', 'middle');
      o += text(x + 24, 100, ev[t - 1], 'tl');
    }
    o += text(x, 136, `t = ${t}`, 'tb', 'middle');
    o += line(x - 38, base, x + 38, base, 'axis') + text(x - 17, base + 15, 'sun', 'ts', 'middle') + text(x + 17, base + 15, 'rain', 'ts', 'middle');
  });
  o += text(cx[0] + 24, 100, 'prior', 'ts');
  // 柱子
  cx.forEach((x, t) => {
    [0, 1].forEach((s) => {
      const bx = s === 0 ? x - 30 : x + 4;
      const hs = Array.from({ length: nF }, (_, f) => { const st = stage(t, f); return st === 0 ? 0 : st === 1 ? Bp[t][s] * H : B[t][s] * H; });
      const [hv, hk] = lv(tl, hs.map(f1)), [yv] = lv(tl, hs.map((h) => f1(base - h)));
      o += `<rect x="${bx}" y="${yv[0]}" width="26" height="${hv[0]}" class="${s === 0 ? 'solid' : 'band-n'}">${anim('y', yv, hk, tl.T)}${anim('height', hv, hk, tl.T)}</rect>`;
      if (t > 0) o += grp(rect(bx, base - Bp[t][s] * H, 26, Bp[t][s] * H, 'dash'), Array.from({ length: nF }, (_, f) => stage(t, f) >= 1), tl.kt, tl.T);
      for (let f = 0; f < nF; f++) {
        const st = stage(t, f); if (!st) continue;
        const v = st === 1 ? Bp[t][s] : B[t][s];
        const top = base - Math.max(v, st === 2 && t > 0 ? Bp[t][s] : 0) * H;
        o += grp(text(bx + 13, top - 5, fx(v, 3), 'ts', 'middle'), Array.from({ length: nF }, (_, j) => j === f), tl.kt, tl.T);
      }
    });
    const rowP = t === 0 ? 'prior' : `B′ ${fx(Bp[t][0], 3)} / ${fx(Bp[t][1], 3)}`;
    const rowB = `B ${fx(B[t][0], 3)} / ${fx(B[t][1], 3)}`;
    o += grp(text(x, 290, rowP, 'ts', 'middle'), Array.from({ length: nF }, (_, f) => stage(t, f) >= 1), tl.kt, tl.T);
    o += grp(text(x, 307, rowB, t ? 't' : 'ts', 'middle'), Array.from({ length: nF }, (_, f) => stage(t, f) === 2), tl.kt, tl.T);
  });
  const msg = [['三步 filtering 完成：B(W₃) = (' + fx(B[3][0], 3) + ', ' + fx(B[3][1], 3) + ')。', '虚线框是 time elapse 之后的 B′，实心柱是乘上 sensor model、normalize 之后的 B。'], ['t = 0：prior B(W₀) = (0.8, 0.2)。', '']];
  for (let t = 1; t <= 3; t++) {
    const b = B[t - 1], e = ev[t - 1];
    msg.push([`t = ${t} time elapse：B′(sun) = 0.6 × ${fx(b[0], 3)} + 0.1 × ${fx(b[1], 3)} = ${fx(Bp[t][0], 3)}，B′(rain) = ${fx(Bp[t][1], 3)}`, '']);
    msg.push([`t = ${t} 看到 ${e}：sun ${HMM.O[e][0]} × ${fx(Bp[t][0], 3)} = ${fx(U[t][0], 3)}，rain ${HMM.O[e][1]} × ${fx(Bp[t][1], 3)} = ${fx(U[t][1], 3)}`, `normalize：除以两者之和 ${fx(U[t][0] + U[t][1], 3)}，得到 (${fx(B[t][0], 3)}, ${fx(B[t][1], 3)})`]);
  }
  msg.forEach(([a, b], f) => { o += grp(text(16, 336, a, 't') + text(16, 355, b, 't'), msg.map((_, j) => j === f), tl.kt, tl.T); });
  return svgA(560, 360, o, '动图：forecast 依次是 good、bad、bad，每个时刻先做 time elapse 得到虚线的 B prime，再乘 sensor model 并 normalize 得到实心柱 B，sun 的 belief 从 0.8 变成 0.727、0.198、0.066');
}

// ---------- 第 6 站：Viterbi trellis ----------
function viterbi() {
  const ev = ['good', 'bad', 'bad'], S = ['sun', 'rain'];
  const P1 = [0, 1].map((s) => HMM.prior[0] * HMM.T[0][s] + HMM.prior[1] * HMM.T[1][s]);
  const m = [[0, 1].map((s) => P1[s] * HMM.O[ev[0]][s])], bp = [null];
  for (let t = 1; t < 3; t++) {
    const row = [], b = [];
    for (const s of [0, 1]) { const c = [0, 1].map((r) => m[t - 1][r] * HMM.T[r][s]); const r = c[0] >= c[1] ? 0 : 1; row.push(c[r] * HMM.O[ev[t]][s]); b.push(r); }
    m.push(row); bp.push(b);
  }
  let last = m[2][0] >= m[2][1] ? 0 : 1; const pathS = [last]; for (let t = 2; t > 0; t--) { last = bp[t][last]; pathS.unshift(last); }
  const X = [110, 290, 470], Y = [72, 176], bw = 104, bh = 42;
  const onPath = (t, s) => pathS[t] === s;
  let o = '';
  X.forEach((x, t) => { o += text(x, 26, `t = ${t + 1}，F${'₁₂₃'[t]} = ${ev[t]}`, 'tb', 'middle'); });
  for (let t = 1; t < 3; t++) for (const s of [0, 1]) for (const r of [0, 1]) {
    const a = [X[t - 1] + bw / 2, Y[r]], b = [X[t] - bw / 2, Y[s]];
    const best = bp[t][s] === r, inPath = best && onPath(t, s) && onPath(t - 1, r);
    o += inPath ? arrow(...a, b[0] - 1, b[1], 'ln', 8) : best ? arrow(...a, b[0] - 1, b[1], 'ink-b', 7) : line(...a, ...b, 'dash');
  }
  X.forEach((x, t) => [0, 1].forEach((s) => {
    o += rect(x - bw / 2, Y[s] - bh / 2, bw, bh, onPath(t, s) ? 'wash-strong' : 'paper', 5) + text(x, Y[s] - 3, S[s], 'tb', 'middle') + text(x, Y[s] + 14, 'm = ' + +m[t][s].toPrecision(3), 't', 'middle');
  }));
  const fmt = (v) => String(+v.toPrecision(3));
  const ln = (t) => `t = ${t + 1}：sun ← max(${fmt(m[t - 1][0])} × 0.6, ${fmt(m[t - 1][1])} × 0.1) × 0.2 = ${fmt(m[t][0])}；rain ← max(${fmt(m[t - 1][0])} × 0.4, ${fmt(m[t - 1][1])} × 0.9) × 0.7 = ${fmt(m[t][1])}`;
  o += text(16, 226, `t = 1：m = P(W₁) × P(good | W₁) = (0.5 × 0.8, 0.5 × 0.3) = (0.4, 0.15)`, 'ts');
  o += text(16, 244, ln(1), 'ts') + text(16, 262, ln(2), 'ts');
  o += text(16, 284, `粗线 = 每个 node 记下的 back pointer。从 t = 3 最大的 rain 往回走：${pathS.map((s) => S[s]).join(' → ')}。`, 't');
  return svg(560, 290, o, 'Viterbi trellis：三个时刻、两个 state，每个 node 标出 m 值，粗线是 back pointer，从 t 等于 3 的 rain 回溯得到 sun、rain、rain');
}

// ---------- 第 7 站：decision network 与 VPI 的 outcome tree ----------
function umbrella() {
  const PW = [0.7, 0.3], U = { leave: [100, 0], take: [20, 70] };
  const pf = (f) => PW[0] * HMM.O[f][0] + PW[1] * HMM.O[f][1];
  const post = (f) => [0, 1].map((w) => (PW[w] * HMM.O[f][w]) / pf(f));
  const EU = (a, p) => p[0] * U[a][0] + p[1] * U[a][1];
  let o = text(110, 20, 'decision network', 'tb', 'middle');
  // network
  const Um = [70, 58], W = [70, 160], F = [70, 250], Ut = [190, 110];
  o += arrow(Um[0] + 50, Um[1] + 8, Ut[0] - 22, Ut[1] - 10, 'ink', 6) + arrow(W[0] + 46, W[1] - 10, Ut[0] - 20, Ut[1] + 12, 'ink', 6) + arrow(W[0], W[1] + 20, F[0], F[1] - 21, 'ink', 6);
  o += rect(Um[0] - 50, Um[1] - 17, 100, 34, 'paper') + text(Um[0], Um[1] + 5, 'Umbrella', 't', 'middle');
  o += `<ellipse cx="${W[0]}" cy="${W[1]}" rx="48" ry="20" class="paper"/>` + text(W[0], W[1] + 5, 'Weather', 't', 'middle');
  o += `<ellipse cx="${F[0]}" cy="${F[1]}" rx="48" ry="20" class="wash-strong"/>` + text(F[0], F[1] + 5, 'Forecast', 't', 'middle');
  o += poly([[Ut[0], Ut[1] - 24], [Ut[0] + 24, Ut[1]], [Ut[0], Ut[1] + 24], [Ut[0] - 24, Ut[1]]], 'paper') + text(Ut[0], Ut[1] + 5, 'U', 'tb', 'middle');
  o += text(Um[0], Um[1] - 24, 'action', 'ts', 'middle') + text(W[0] + 54, W[1] + 22, 'chance', 'ts') + text(Ut[0], Ut[1] + 40, 'utility', 'ts', 'middle');
  o += text(F[0], F[1] + 38, '决定前能看到', 'ts', 'middle');
  // tree
  const R = [290, 150], Dg = [380, 82], Db = [380, 218];
  o += text(410, 20, '先看 forecast 再决定', 'tb', 'middle');
  o += line(...R, ...Dg, 'ink') + line(...R, ...Db, 'ink');
  o += text(318, 106, `good ${fx(pf('good'), 2)}`, 'ts', 'end') + text(318, 200, `bad ${fx(pf('bad'), 2)}`, 'ts', 'end');
  [[Dg, 'good'], [Db, 'bad']].forEach(([P, f]) => {
    const p = post(f), eu = { leave: EU('leave', p), take: EU('take', p) }, best = eu.leave >= eu.take ? 'leave' : 'take';
    [['leave', -24], ['take', 24]].forEach(([a, dy]) => {
      o += line(P[0] + 11, P[1], 452, P[1] + dy, a === best ? 'ink-b' : 'mute');
      o += text(458, P[1] + dy + 4, `${a}：${+eu[a].toFixed(1)}`, a === best ? 'tb' : 'ts');
    });
    o += rect(P[0] - 11, P[1] - 11, 22, 22, 'paper');
    o += text(P[0] + 4, P[1] + 30, `max = ${+Math.max(eu.leave, eu.take).toFixed(1)}`, 'tl', 'middle') + text(P[0] + 10, P[1] + 47, `P(sun | ${f}) = ${fx(p[0], 3)}`, 'ts', 'middle');
  });
  o += circle(...R, 12, 'paper') + circle(...R, 12, 'wash-strong') + text(R[0], R[1] + 4, 'F', 'tb', 'middle');
  const meuF = pf('good') * Math.max(EU('leave', post('good')), EU('take', post('good'))) + pf('bad') * Math.max(EU('leave', post('bad')), EU('take', post('bad')));
  o += text(16, 318, `先看再决定：${fx(pf('good'), 2)} × ${+Math.max(EU('leave', post('good')), EU('take', post('good'))).toFixed(1)} + ${fx(pf('bad'), 2)} × ${+Math.max(EU('leave', post('bad')), EU('take', post('bad'))).toFixed(1)} = ${+meuF.toFixed(2)}`, 't');
  o += text(16, 338, `不看直接决定：max(EU(leave), EU(take)) = max(70, 35) = 70，所以 VPI(Forecast) = ${+meuF.toFixed(2)} − 70 = ${+(meuF - 70).toFixed(2)}`, 't');
  return svg(560, 344, o, '左边是 umbrella 的 decision network：Umbrella 是 action，Weather 是 chance node，Forecast 依赖 Weather，U 依赖 Umbrella 和 Weather；右边是先看 forecast 再决定的 outcome tree，good 时选 leave 得 86.2，bad 时选 take 得 50');
}

// ---------- 第 8 站：Morra 的两条 line ----------
function morra() {
  const sx = lin(0, 1, 60, 330), sy = lin(-3.5, 4.5, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -3.5, y1: 4.5, xt: [0, 0.25, [7 / 12, '7/12'], 0.75, 1], yt: [-3, -2, -1, 0, 1, 2, 3, 4].map((v) => [v, (v < 0 ? '−' : '') + Math.abs(v)]), grid: true, xl: 'A 出 1 根手指的 probability p', yl: 'A 的 expected payoff' });
  const l1 = (p) => 5 * p - 3, l2 = (p) => 4 - 7 * p, ps = 7 / 12;
  o += line(sx(0), sy(l1(0)), sx(1), sy(l1(1)), 'mute') + line(sx(0), sy(l2(0)), sx(1), sy(l2(1)), 'mute');
  o += path(d([[sx(0), sy(Math.min(l1(0), l2(0)))], [sx(ps), sy(l1(ps))], [sx(1), sy(Math.min(l1(1), l2(1)))]]), 'ln');
  o += circle(sx(ps), sy(l1(ps)), 5, 'ln-f');
  o += text(sx(1) + 4, sy(l1(1)) + 4, 'B 出 1：5p − 3', 'ts') + text(sx(0) + 8, sy(l2(0)) - 6, 'B 出 2：4 − 7p', 'ts');
  o += text(sx(ps) - 10, 214, `交点 p = 7/12，value = −1/12`, 'tl', 'middle');
  // 右：payoff matrix
  const mx = 430, my = 96, cw = 42, ch = 34;
  o += text(mx + 62, 58, 'A 的 payoff', 'tb', 'middle');
  o += text(mx + 63, my - 8, 'B 出 1', 'ts', 'middle') + text(mx + 105, my - 8, 'B 出 2', 'ts', 'middle');
  [[2, -3], [-3, 4]].forEach((row, i) => {
    o += text(mx + 36, my + i * ch + 22, `A 出 ${i + 1}`, 'ts', 'end');
    row.forEach((v, j) => { o += rect(mx + 42 + j * cw, my + i * ch, cw, ch, v > 0 ? 'wash' : 'paper') + text(mx + 63 + j * cw, my + i * ch + 22, (v < 0 ? '−' : '') + Math.abs(v), 't', 'middle'); });
  });
  o += text(mx + 62, my + 2 * ch + 22, 'zero-sum：B 得到', 'ts', 'middle') + text(mx + 62, my + 2 * ch + 38, '每格的相反数', 'ts', 'middle');
  return svg(560, 290, o, 'Two-finger Morra：A 以 probability p 出 1，B 出 1 时 A 的 expected payoff 是 5p 减 3，B 出 2 时是 4 减 7p；取两者较小的那条折线，最高点在 p 等于 7/12，value 是负 1/12；右边是 payoff matrix');
}

export default {
  'cs3263-wumpus': wumpus,
  'cs3263-resolution': resolutionA,
  'cs3263-fc': fcA,
  'cs3263-bc': bctree,
  'cs3263-map': cspmap,
  'cs3263-ac3': ac3A,
  'cs3263-alarm': alarm,
  'cs3263-triples': triples,
  'cs3263-ve': veA,
  'cs3263-veorder': veorder,
  'cs3263-forward': forwardA,
  'cs3263-viterbi': viterbi,
  'cs3263-umbrella': umbrella,
  'cs3263-morra': morra,
};
