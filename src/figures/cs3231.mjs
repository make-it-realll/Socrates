import { svg, svgA, d, path, line, rect, circle, poly, text, it, arrow, anim, f1 } from '../lib/svg.mjs';

// ---------- state diagram 小工具 ----------
const R0 = 17;
function head(x, y, ang, cls, size = 7) {
  const p = (a) => [x - size * Math.cos(ang + a), y - size * Math.sin(ang + a)];
  return poly([[x, y], p(0.42), p(-0.42)], cls.split(' ').map((c) => c + '-f').join(' '));
}
function st(x, y, lab, { acc = false, r = R0, cls = 'paper', tcls = 't' } = {}) {
  let o = circle(x, y, r, cls);
  if (acc) o += circle(x, y, r - 4, 'ink');
  return o + text(x, y + 4.5, lab, tcls, 'middle');
}
// 两个 state 之间的 edge；bend 为正时向前进方向的左侧弯
function ed(a, b, lab, { bend = 0, cls = 'ink', r = R0, lo = 11, tcls = 'ts', both = false } = {}) {
  const [x1, y1] = a, [x2, y2] = b;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = uy, ny = -ux;
  const mx = (x1 + x2) / 2 + nx * bend, my = (y1 + y2) / 2 + ny * bend; // 控制点
  const trim = (px, py, qx, qy) => { const l = Math.hypot(qx - px, qy - py); return [px + (qx - px) * r / l, py + (qy - py) * r / l]; };
  const s = trim(x1, y1, mx, my), e = trim(x2, y2, mx, my);
  let o = bend ? `<path d="M${f1(s[0])} ${f1(s[1])}Q${f1(mx)} ${f1(my)} ${f1(e[0])} ${f1(e[1])}" class="${cls}" fill="none"/>` : line(s[0], s[1], e[0], e[1], cls);
  o += head(e[0], e[1], Math.atan2(e[1] - my, e[0] - mx), cls);
  if (both) o += head(s[0], s[1], Math.atan2(s[1] - my, s[0] - mx), cls);
  // label 放在曲线中点外侧
  const cx = 0.25 * s[0] + 0.5 * mx + 0.25 * e[0], cy = 0.25 * s[1] + 0.5 * my + 0.25 * e[1];
  const sg = bend >= 0 ? 1 : -1;
  if (lab) o += text(cx + nx * lo * sg, cy + ny * lo * sg + 4, lab, tcls, 'middle');
  return o;
}
// self-loop；ang 是 loop 朝向（度，0 = 右，-90 = 上）
function loop(a, lab, { ang = -90, cls = 'ink', r = R0, tcls = 'ts' } = {}) {
  const [x, y] = a, t = (ang * Math.PI) / 180, w = 0.5;
  const p1 = [x + r * Math.cos(t - w), y + r * Math.sin(t - w)], p2 = [x + r * Math.cos(t + w), y + r * Math.sin(t + w)];
  const k = 2.9 * r;
  const c1 = [x + k * Math.cos(t - 0.75), y + k * Math.sin(t - 0.75)], c2 = [x + k * Math.cos(t + 0.75), y + k * Math.sin(t + 0.75)];
  let o = `<path d="M${f1(p1[0])} ${f1(p1[1])}C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}" class="${cls}" fill="none"/>`;
  o += head(p2[0], p2[1], Math.atan2(p2[1] - c2[1], p2[0] - c2[0]), cls);
  const lx = x + (2.45 * r + 8) * Math.cos(t), ly = y + (2.45 * r + 8) * Math.sin(t) + 4;
  return o + text(lx, ly, lab, tcls, 'middle');
}
const start = (a, dx = -38, dy = 0, r = R0) => {
  const L = Math.hypot(dx, dy);
  return arrow(a[0] + dx, a[1] + dy, a[0] + (dx / L) * r, a[1] + (dy / L) * r, 'ink');
};
// 动图：每帧一段时长；fg(k) 让一组内容只在第 k 帧显示，fr(k) 从第 k 帧起一直显示
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [];
  let c = 0;
  for (const x of durs) { kt.push(c / T); c += x; }
  const fg = (k, body) => `<g opacity="${k === 0 ? 1 : 0}">${body}${anim('opacity', kt.map((_, i) => (i === k ? 1 : 0)), kt, T, true)}</g>`;
  const fr = (k, body) => (k === 0 ? `<g>${body}</g>` : `<g opacity="0">${body}${anim('opacity', kt.map((_, i) => (i >= k ? 1 : 0)), kt, T, true)}</g>`);
  return { T, kt, fg, fr };
}
const cell = (x, y, w, h, s, cls = 'paper', tcls = 't') => rect(x, y, w, h, cls) + text(x + w / 2, y + h / 2 + 5, s, tcls, 'middle');
const sb = (b, i) => `${b}<tspan class="sub" dy="3">${i}</tspan><tspan dy="-3">​</tspan>`;
const q = (i) => sb('q', i);

// 1. 被 3 整除的 DFA 读 1001
function mod3() {
  const P = [[110, 92], [280, 92], [450, 92]];
  let o = text(280, 18, '每个 state 记住“目前读到的数 mod 3”', 'tb', 'middle');
  o += loop(P[0], '0', { ang: -90 }) + loop(P[2], '1', { ang: -90 });
  o += ed(P[0], P[1], '1', { bend: -16 }) + ed(P[1], P[0], '1', { bend: -16 });
  o += ed(P[1], P[2], '0', { bend: -16 }) + ed(P[2], P[1], '0', { bend: -16 });
  o += start(P[0], -44);
  const w = '1001', val = [0, 1, 2, 4, 9], cur = [0, 1, 2, 1, 0];
  const { fg, fr } = frames([1.4, 1.2, 1.2, 1.2, 1.2, 2.4]);
  // 当前 state 高亮
  for (let k = 0; k <= 5; k++) { const s = cur[Math.min(k, 4)]; o += fg(k, circle(P[s][0], P[s][1], R0, 'solid') + text(P[s][0], P[s][1] + 4.5, String(s), 'tw', 'middle')); }
  for (let s = 0; s < 3; s++) o += st(P[s][0], P[s][1], String(s), { acc: s === 0, cls: 'paper' });
  // 让高亮压在上面：再画一遍高亮（state 圆在下）
  for (let k = 0; k <= 5; k++) { const s = cur[Math.min(k, 4)]; o += fg(k, circle(P[s][0], P[s][1], R0 - 4, 'solid') + text(P[s][0], P[s][1] + 4.5, String(s), 'tw', 'middle')); }
  o += text(P[0][0], P[0][1] + 38, 'start，accepting', 'ts', 'middle');
  // input
  const X0 = 200, Y = 150, cw = 40;
  o += text(X0 - 12, Y + 22, 'input', 'ts', 'end');
  for (let i = 0; i < 4; i++) o += cell(X0 + i * cw, Y, cw, 32, w[i]);
  for (let k = 1; k <= 4; k++) o += fr(k, rect(X0 + (k - 1) * cw + 3, Y + 3, cw - 6, 26, 'wash') + text(X0 + (k - 1) * cw + cw / 2, Y + 21, w[k - 1], 't', 'middle'));
  for (let k = 0; k <= 5; k++) {
    const kk = Math.min(k, 4), pre = w.slice(0, kk) || 'ε';
    let s = text(280, Y + 58, `已读 ${pre}，值为 ${val[kk]}，${val[kk]} mod 3 = ${val[kk] % 3}；当前 state = ${cur[kk]}`, 't', 'middle');
    if (k >= 4) s += text(280, Y + 80, '读完时在 state 0（accepting），accept：9 能被 3 整除', 'tl', 'middle');
    else s += line(X0 + kk * cw + cw / 2, Y + 36, X0 + kk * cw + cw / 2, Y + 44, 'ink') + head(X0 + kk * cw + cw / 2, Y + 35, -Math.PI / 2, 'ink', 6);
    o += fg(k, s);
  }
  return svgA(560, 240, o, '动图：被 3 整除的 DFA 有 0、1、2 三个 state，读 1001 时依次经过 0、1、2、1、0，最后停在 accepting state 0');
}

// 2. product construction：mod 3 × parity
function product() {
  const X = [110, 280, 450], Y = [70, 200];
  const P = (r, p) => [X[r], Y[p]];
  const nm = ['e', 'o'];
  let o = '';
  o += loop(P(0, 0), '0', { ang: 180, r: 22 }) + loop(P(0, 1), '0', { ang: 180, r: 22 });
  for (const p of [0, 1]) o += ed(P(1, p), P(2, p), '0', { both: true, r: 22, lo: 10 });
  // 读 1：(0,e)↔(1,o)，(1,e)↔(0,o)，(2,e)↔(2,o)
  o += ed(P(0, 0), P(1, 1), '', { both: true, r: 22 }) + ed(P(1, 0), P(0, 1), '', { both: true, r: 22 });
  o += text(195, 122, '1', 'ts', 'middle');
  o += ed(P(2, 0), P(2, 1), '1', { both: true, r: 22 });
  for (let r = 0; r < 3; r++) for (const p of [0, 1]) o += st(...P(r, p), `${r}, ${nm[p]}`, { acc: r === 0 && p === 0, r: 22 });
  o += arrow(X[0] + 34, 16, X[0] + 12, Y[0] - 20, 'ink') + text(X[0] + 38, 20, 'start', 'ts');
  o += text(530, Y[0] + 4, '偶数个 1', 'ts', 'end') + text(530, Y[1] + 4, '奇数个 1', 'ts', 'end');
  for (let r = 0; r < 3; r++) o += text(X[r], 252, `mod 3 = ${r}`, 'ts', 'middle');
  o += text(280, 276, 'Intersection 只有 (0, e) 是 accepting；union 则是 (0, e)、(0, o)、(1, e)、(2, e) 四个', 'ts', 'middle');
  return svg(560, 284, o, 'Product DFA 的 6 个 state 排成 3 列 2 行：列是 remainder，行是 1 的个数的 parity；读 0 在行内走，读 1 换行');
}

// 3. NFA 读 0110：active set
const NP = [[100, 92], [270, 92], [440, 92]];
function nfaBody(P = NP, r = R0) {
  let o = loop(P[0], '0, 1', { ang: -90, r }) + ed(P[0], P[1], '1', { r }) + ed(P[1], P[2], '0, 1', { r }) + start(P[0], -40, 0, r);
  return o;
}
function nfarun() {
  const w = '0110', sets = [[0], [0], [0, 1], [0, 1, 2], [0, 2]];
  const { fg, fr } = frames([1.4, 1.3, 1.3, 1.3, 1.3, 2.6]);
  let o = text(280, 18, '“倒数第二个是 1”的 NFA：在某个 1 上猜“就是它”', 'tb', 'middle');
  o += nfaBody();
  for (let i = 0; i < 3; i++) o += st(NP[i][0], NP[i][1], q(i), { acc: i === 2 });
  for (let k = 0; k <= 5; k++) {
    const S = sets[Math.min(k, 4)];
    o += fg(k, S.map((i) => circle(NP[i][0], NP[i][1], R0 - 4, 'solid') + text(NP[i][0], NP[i][1] + 4.5, q(i), 'tw', 'middle')).join(''));
  }
  const X0 = 200, Y = 148, cw = 40;
  o += text(X0 - 12, Y + 22, 'input', 'ts', 'end');
  for (let i = 0; i < 4; i++) o += cell(X0 + i * cw, Y, cw, 32, w[i]);
  for (let k = 1; k <= 4; k++) o += fr(k, rect(X0 + (k - 1) * cw + 3, Y + 3, cw - 6, 26, 'wash') + text(X0 + (k - 1) * cw + cw / 2, Y + 21, w[k - 1], 't', 'middle'));
  for (let k = 0; k <= 5; k++) {
    const kk = Math.min(k, 4), S = sets[kk];
    let s = text(280, Y + 60, `已读 ${w.slice(0, kk) || 'ε'}，active set = { ${S.map(q).join(', ')} }`, 't', 'middle');
    if (k >= 4) s += text(280, Y + 82, '读完时 set 里有 accepting 的 q₂，accept', 'tl', 'middle');
    else s += head(X0 + kk * cw + cw / 2, Y + 35, -Math.PI / 2, 'ink', 6) + line(X0 + kk * cw + cw / 2, Y + 36, X0 + kk * cw + cw / 2, Y + 44, 'ink');
    if (k === 2) s += text(280, Y + 82, '读到 1：q₀ 既可以留在 q₀，也可以去 q₁', 'ts', 'middle');
    if (k === 3) s += text(280, Y + 82, 'q₀ 读 1 去 {q₀, q₁}，q₁ 读 1 去 {q₂}，并起来', 'ts', 'middle');
    o += fg(k, s);
  }
  return svgA(560, 244, o, '动图：NFA 读 0110 时 active set 依次是 {q0}、{q0}、{q0,q1}、{q0,q1,q2}、{q0,q2}，最后含 accepting state q2');
}

// 4. subset construction 逐行生成
function subset() {
  const Ps = [[55, 92], [145, 92], [235, 92]];
  let o = text(145, 22, '原来的 NFA', 'tb', 'middle');
  o += loop(Ps[0], '0, 1', { ang: -90, r: 15 }) + ed(Ps[0], Ps[1], '1', { r: 15 }) + ed(Ps[1], Ps[2], '0, 1', { r: 15 });
  o += arrow(Ps[0][0], 136, Ps[0][0], 92 + 15, 'ink');
  for (let i = 0; i < 3; i++) o += st(Ps[i][0], Ps[i][1], q(i), { acc: i === 2, r: 15 });
  const S = (a) => '{' + a.map(q).join(', ') + '}';
  const rows = [
    { s: [0], z: [0], o: [0, 1], born: 0 },
    { s: [0, 1], z: [0, 2], o: [0, 1, 2], born: 1 },
    { s: [0, 2], z: [0], o: [0, 1], born: 2 },
    { s: [0, 1, 2], z: [0, 2], o: [0, 1, 2], born: 2 },
  ];
  const { fg, fr } = frames([1.6, 1.8, 1.8, 1.8, 1.8, 3]);
  const X = [350, 435, 520], Y0 = 40, rh = 28;
  o += text(X[0], Y0 - 12, 'DFA 的 state', 'tb', 'middle') + text(X[1], Y0 - 12, '读 0', 'tb', 'middle') + text(X[2], Y0 - 12, '读 1', 'tb', 'middle');
  o += line(300, Y0 - 4, 560, Y0 - 4, 'axis');
  for (let k = 1; k <= 4; k++) o += fg(k, rect(302, Y0 + (k - 1) * rh, 258, rh, 'wash'));
  rows.forEach((r, i) => {
    const y = Y0 + i * rh + 18;
    o += fr(r.born, text(X[0], y, S(r.s), 't', 'middle'));
    o += fr(i + 1, text(X[1], y, S(r.z), 't', 'middle') + text(X[2], y, S(r.o), 't', 'middle'));
  });
  const msg = [
    ['从 start state {q₀} 开始，表里只有它，等待处理。', ''],
    ['处理 {q₀}：q₀ 读 0 去 {q₀}，读 1 去 {q₀, q₁}。', '{q₀, q₁} 是新的，加到表中。'],
    ['处理 {q₀, q₁}：读 0 得 {q₀} ∪ {q₂}，读 1 得 {q₀, q₁} ∪ {q₂}。', '{q₀, q₂} 和 {q₀, q₁, q₂} 是新的，加到表中。'],
    ['处理 {q₀, q₂}：q₂ 没有 transition，结果和 {q₀} 一样。', '没有新的 subset。'],
    ['处理 {q₀, q₁, q₂}：结果和 {q₀, q₁} 一样。', '没有新的 subset，构造结束。'],
    ['只有 4 个 reachable subset；标 * 的两行含 q₂，是 accepting state。', '四行依次表示最后两位是 00、01、10、11。'],
  ];
  for (let k = 0; k <= 5; k++) o += fg(k, text(20, 186, msg[k][0], 't') + text(20, 206, msg[k][1], 'ts'));
  o += fr(5, text(310, Y0 + 2 * rh + 18, '*', 'tl', 'middle') + text(310, Y0 + 3 * rh + 18, '*', 'tl', 'middle'));
  o += text(20, 240, '每个 DFA state 是 NFA state 的一个 subset；“读 a”就是把 subset 里每个 state 读 a 能去的地方并起来。', 'ts');
  return svgA(560, 248, o, '动图：对倒数第二个是 1 的 NFA 做 subset construction，依次生成 {q0}、{q0,q1}、{q0,q2}、{q0,q1,q2} 四个 state 及其 transition');
}

// 5. 0*1 的 ε-NFA（讲义的构造：concatenation 也另加 start 和 accepting state）
function thompson() {
  const xs = [26, 96, 166, 236, 306, 376, 446, 524], Y0 = 112;
  const keys = ['q0', 's', 's0', 'f0', 'f', 's1', 'f1', 'qf'];
  const P = Object.fromEntries(keys.map((k, i) => [k, [xs[i], Y0]]));
  const r = 14, E = 'ε';
  let o = '';
  o += rect(144, 64, 114, 82, 'wash2', 6) + text(201, 78, '0 的 automaton', 'ts', 'middle');
  o += rect(354, 64, 114, 82, 'wash2', 6) + text(411, 78, '1 的 automaton', 'ts', 'middle');
  o += ed(P.q0, P.s, E, { r }) + ed(P.s, P.s0, E, { r }) + ed(P.s0, P.f0, '0', { r, lo: -14 }) + ed(P.f0, P.f, E, { r });
  o += ed(P.f, P.s1, E, { r }) + ed(P.s1, P.f1, '1', { r, lo: -14 }) + ed(P.f1, P.qf, E, { r });
  o += ed(P.s, P.f, E, { bend: -58, r, lo: 10 }) + ed(P.f0, P.s0, E, { bend: -34, r, lo: 8 });
  o += arrow(P.q0[0], Y0 + 44, P.q0[0], Y0 + r, 'ink') + text(P.q0[0] + 6, Y0 + 54, 'start', 'ts', 'middle');
  const lab = { q0: q(0), s: 's', s0: 's₀', f0: 'f₀', f: 'f', s1: 's₁', f1: 'f₁', qf: q('f') };
  for (const k of keys) o += st(P[k][0], P[k][1], lab[k], { acc: k === 'qf', r });
  // star 的范围（s 到 f）和 concatenation 的范围（q0 到 qf）
  const brk = (x1, x2, y, s) => line(x1, y - 3, x1, y + 3, 'mute') + line(x1, y, x2, y, 'mute') + line(x2, y - 3, x2, y + 3, 'mute') + text((x1 + x2) / 2, y - 6, s, 'ts', 'middle');
  o += brk(xs[0], xs[7], 18, `concatenation：另加 ${q(0)}、${q('f')} 和三条 ε（${q(0)} → s，f → s₁，f₁ → ${q('f')}）`);
  o += brk(xs[1], xs[4], 44, 'star：另加 s、f 和四条 ε');
  const Y = 214;
  const rows = [
    ['start', `Eclose(${q(0)}) = {${q(0)}, s, s₀, f, s₁}`],
    ['读 0', 's₀ → f₀，Eclose(f₀) = {f₀, s₀, f, s₁}'],
    ['读 0', '同上，{f₀, s₀, f, s₁}'],
    ['读 1', `s₁ → f₁，Eclose(f₁) = {f₁, ${q('f')}}，含 accepting state ${q('f')}，accept`],
  ];
  rows.forEach(([a, b], i) => { o += text(60, Y + i * 20, a, 'tb', 'end') + text(72, Y + i * 20, b, 't'); });
  return svg(560, 284, o, '按讲义的构造为 0 星 1 造出的 epsilon-NFA，共 8 个 state，以及它读 001 时每一步的 active set');
}

// 6. 奇数个 1 的 DFA 与 R^(1)_22
function odd() {
  const A = [170, 110], B = [390, 110];
  let o = '';
  o += loop(A, '0', { ang: -90, cls: 'ln' }) + loop(B, '0', { ang: -90 });
  o += ed(A, B, '1', { bend: 22, cls: 'ln', tcls: 'tl' }) + ed(B, A, '1', { bend: 22, cls: 'ln', tcls: 'tl' });
  o += start(A, -46);
  o += st(A[0], A[1], '1') + st(B[0], B[1], '2', { acc: true });
  o += text(A[0], A[1] + 70, '偶数个 1', 'ts', 'middle') + text(B[0], B[1] + 70, '奇数个 1', 'ts', 'middle');
  o += text(280, 222, 'R⁽¹⁾₂₂ = (ε + 0) + 1 0* 1', 'tb', 'middle');
  o += text(280, 242, '不经过 state 1：停在原地或走自己的 loop（ε + 0）；经过 state 1：彩色的 path（1 0* 1）', 'ts', 'middle');
  return svg(560, 250, o, '两个 state 的 DFA：state 1 表示偶数个 1，state 2 表示奇数个 1；彩色 path 从 2 读 1 到 1，在 1 上读若干 0，再读 1 回到 2');
}

// 7. pumping lemma 的套索
function pump() {
  let o = '';
  const cw = 26, X0 = 98, Y0 = 26;
  const s = '00000001111111';
  o += text(X0 - 10, Y0 + 18, 'w', 'tl', 'end');
  for (let i = 0; i < 14; i++) o += cell(X0 + i * cw, Y0, cw, 26, s[i], i >= 2 && i < 5 ? 'wash' : 'paper');
  const br = (a, b, lab) => { const x1 = X0 + a * cw + 2, x2 = X0 + b * cw - 2, y = Y0 + 34; return line(x1, y, x2, y, 'mute') + line(x1, y - 3, x1, y + 3, 'mute') + line(x2, y - 3, x2, y + 3, 'mute') + text((x1 + x2) / 2, y + 16, lab, 'ts', 'middle'); };
  o += br(0, 2, 'x = 00') + br(2, 5, 'y = 000') + br(5, 14, 'z = 00 1111111');
  // 套索
  const r = 13, P = [[60, 190], [130, 190], [200, 190]], L1 = [235, 125], L2 = [290, 150];
  const T = [[290, 205], [360, 205], [520, 205]];
  o += ed(P[0], P[1], '0', { r }) + ed(P[1], P[2], '0', { r });
  o += ed(P[2], L1, '0', { r, cls: 'ln', tcls: 'tl' }) + ed(L1, L2, '0', { r, cls: 'ln', tcls: 'tl' }) + ed(L2, P[2], '0', { r, cls: 'ln', tcls: 'tl' });
  o += ed(P[2], T[0], '0', { r, lo: -13 }) + ed(T[0], T[1], '0', { r }) + line(T[1][0] + r, 205, 440, 205, 'ink') + text(458, 209, '…', 't', 'middle') + arrow(476, 205, T[2][0] - r, 205, 'ink');
  o += text(458, 192, '读 1⁷', 'ts', 'middle');
  o += st(...P[0], 'q₀', { r }) + st(...P[1], 'q₁', { r }) + st(...P[2], '', { r, cls: 'wash-strong' }) + st(...L1, 'q₃', { r }) + st(...L2, 'q₄', { r });
  o += st(...T[0], 'q₆', { r }) + st(...T[1], 'q₇', { r }) + st(...T[2], '', { r, acc: true });
  o += text(P[2][0], P[2][1] + 30, 'q₂ = q₅', 'tb', 'middle') + start(P[0], -34, 0, r);
  o += text(262, 112, 'y 的圈', 'tl', 'start');
  o += text(T[2][0], 234, '终点', 'ts', 'middle');
  const rows = [['k = 0', 'xz = 0⁴1⁷', '不绕圈'], ['k = 1', 'xyz = 0⁷1⁷', '绕一圈'], ['k = 2', 'xy²z = 0¹⁰1⁷', '绕两圈']];
  rows.forEach(([a, b, c], i) => { const y = 262 + i * 19; o += text(120, y, a, 'tb', 'end') + text(132, y, b, 't') + text(250, y, c, 'ts'); });
  o += text(330, 272, '三条 path 的终点相同，', 'ts') + text(330, 290, '所以 0⁴1⁷、0¹⁰1⁷ 也会被 accept，', 'ts') + text(330, 308, '但它们不在 {0ⁿ1ⁿ} 里。', 'ts');
  return svg(560, 314, o, '常数 n 等于 7，读 0 的 7 次方 1 的 7 次方时前 8 个 state 中 q2 等于 q5，path 形成套索：x 是柄，y 是圈，z 是剩下的路；绕圈 0、1、2 次终点相同');
}

// 8. minimization
function minim() {
  const A = [90, 80], E = [90, 215], B = [280, 80], D = [280, 215], C = [460, 148];
  let o = '';
  o += rect(52, 42, 76, 212, 'wash', 10) + rect(242, 42, 76, 212, 'wash', 10) + rect(422, 110, 76, 76, 'wash', 10);
  o += text(90, 34, '{A, E}', 'tl', 'middle') + text(280, 34, '{B, D}', 'tl', 'middle') + text(460, 204, '{C}', 'tl', 'middle');
  o += ed(A, B, '0') + ed(A, E, '1', { both: true }) + ed(E, B, '0', { lo: -12 }) + ed(B, D, '0');
  o += loop(D, '0', { ang: 180 });
  o += ed(B, C, '1') + ed(D, C, '1', { bend: 14 }) + ed(C, D, '0', { bend: 14 });
  o += ed(C, E, '', { bend: 150 }) + text(186, 272, '1', 'ts', 'middle');
  o += start(A, -34, -26);
  for (const [P, n] of [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E']]) o += st(P[0], P[1], n, { acc: n === 'C' });
  return svg(560, 290, o, '5 个 state 的 DFA，C 是 accepting state；table-filling 之后 A 与 E 合并、B 与 D 合并、C 单独一组');
}

// 9. a+a×a 的两个 parse tree
function parse() {
  let o = '';
  const tree = (nodes, edges) => {
    let s = '';
    for (const [a, b] of edges) s += line(nodes[a][0], nodes[a][1] + 8, nodes[b][0], nodes[b][1] - 12, 'mute');
    for (const k in nodes) { const [x, y, lab, cls] = nodes[k]; s += text(x, y + 4, lab, cls || 't', 'middle'); }
    return s;
  };
  // 左：E → E + E，右边 E → E × E
  const L = { r: [140, 30, 'E', 'tb'], a: [70, 85, 'E'], p: [140, 85, '+'], b: [210, 85, 'E', 'tl'], la: [70, 140, 'a'], c: [160, 140, 'E'], t: [210, 140, '×'], e: [260, 140, 'E'], lc: [160, 195, 'a'], le: [260, 195, 'a'] };
  o += tree(L, [['r', 'a'], ['r', 'p'], ['r', 'b'], ['a', 'la'], ['b', 'c'], ['b', 't'], ['b', 'e'], ['c', 'lc'], ['e', 'le']]);
  const Rr = { r: [420, 30, 'E', 'tb'], a: [350, 85, 'E', 'tl'], t: [420, 85, '×'], b: [490, 85, 'E'], c: [300, 140, 'E'], p: [350, 140, '+'], e: [400, 140, 'E'], lb: [490, 140, 'a'], lc: [300, 195, 'a'], le: [400, 195, 'a'] };
  o += tree(Rr, [['r', 'a'], ['r', 't'], ['r', 'b'], ['a', 'c'], ['a', 'p'], ['a', 'e'], ['b', 'lb'], ['c', 'lc'], ['e', 'le']]);
  o += text(160, 232, 'a + (a × a)：a = 2 时得 6', 't', 'middle') + text(400, 232, '(a + a) × a：a = 2 时得 8', 't', 'middle');
  o += line(280, 20, 280, 215, 'grid');
  return svg(560, 242, o, 'a 加 a 乘 a 在 ambiguous grammar 下的两个 parse tree：左边乘法在下面先算，右边加法在下面先算');
}

// 10. PDA 读 0011
function pda() {
  const w = '0011';
  const fr = [
    { st: 0, h: 0, stack: ['Z₀'], tr: '', id: '(q₀, 0011, Z₀)' },
    { st: 0, h: 1, stack: ['0', 'Z₀'], tr: 'δ(q₀, 0, Z₀) ∋ (q₀, 0Z₀)：push 0', id: '(q₀, 011, 0Z₀)' },
    { st: 0, h: 2, stack: ['0', '0', 'Z₀'], tr: 'δ(q₀, 0, 0) ∋ (q₀, 00)：push 0', id: '(q₀, 11, 00Z₀)' },
    { st: 1, h: 3, stack: ['0', 'Z₀'], tr: 'δ(q₀, 1, 0) ∋ (q₁, ε)：pop', id: '(q₁, 1, 0Z₀)' },
    { st: 1, h: 4, stack: ['Z₀'], tr: 'δ(q₁, 1, 0) ∋ (q₁, ε)：pop', id: '(q₁, ε, Z₀)' },
    { st: 2, h: 4, stack: ['Z₀'], tr: 'δ(q₁, ε, Z₀) ∋ (q₂, Z₀)：不读 input', id: '(q₂, ε, Z₀)：accept' },
  ];
  const { fg, fr: from } = frames([1.6, 1.4, 1.4, 1.4, 1.4, 2.8]);
  const X0 = 60, Y = 60, cw = 44;
  let o = text(X0 + 88, 30, 'input', 'tb', 'middle') + text(470, 30, 'stack', 'tb', 'middle');
  for (let i = 0; i < 4; i++) o += cell(X0 + i * cw, Y, cw, 34, w[i]);
  const SX = 440, SB = 210, sh = 30;
  o += line(SX - 4, SB - 4 * sh - 6, SX - 4, SB + 2, 'ink') + line(SX + 64, SB - 4 * sh - 6, SX + 64, SB + 2, 'ink') + line(SX - 4, SB + 2, SX + 64, SB + 2, 'ink');
  fr.forEach((f, k) => {
    let s = '';
    for (let i = 0; i < f.h; i++) s += rect(X0 + i * cw + 3, Y + 3, cw - 6, 28, 'wash2');
    for (let i = 0; i < f.h; i++) s += text(X0 + i * cw + cw / 2, Y + 22, w[i], 'ts', 'middle');
    const hx = X0 + f.h * cw + (f.h < 4 ? cw / 2 : 4);
    s += head(hx, Y + 38, -Math.PI / 2, 'ink', 7) + line(hx, Y + 39, hx, Y + 52, 'ink');
    s += text(hx, Y + 68, 'state ' + q(f.st), f.st === 2 ? 'tl' : 'tb', 'middle');
    f.stack.forEach((c, i) => { const y = SB - (f.stack.length - i) * sh; s += rect(SX, y, 60, sh - 3, i === 0 ? 'wash-strong' : 'paper') + text(SX + 30, y + 19, c, 't', 'middle'); });
    s += text(SX + 72, SB - f.stack.length * sh + 18, '← 顶', 'ts');
    s += text(40, 196, f.tr || '开始：stack 里只有 bottom marker Z₀', 't');
    s += text(40, 222, 'ID：' + f.id, f.st === 2 ? 'tl' : 'ts');
    o += fg(k, s);
  });
  return svgA(560, 234, o, '动图：PDA 读 0011，两个 0 依次 push，两个 1 依次 pop，露出 Z0 时走 epsilon-transition 进入 accepting state q2');
}

// 11. CFL pumping 的 parse tree
function cflpump() {
  let o = '';
  const tri = (ax, ay, x1, x2, by, cls) => poly([[ax, ay], [x1, by], [x2, by]], cls);
  const seg = (xs, labs, by) => {
    let s = '';
    for (let i = 0; i < labs.length; i++) {
      const a = xs[i] + 2, b = xs[i + 1] - 2;
      s += line(a, by + 8, b, by + 8, 'mute') + line(a, by + 5, a, by + 11, 'mute') + line(b, by + 5, b, by + 11, 'mute');
      s += text((a + b) / 2, by + 26, labs[i], labs[i] === 'v' || labs[i] === 'x' ? 'tl' : 't', 'middle');
    }
    return s;
  };
  // 左：原来
  const by = 220;
  o += tri(140, 28, 20, 262, by, 'paper') + tri(150, 88, 70, 226, by, 'wash') + tri(152, 150, 116, 186, by, 'wash-strong');
  o += text(140, 22, 'S', 'tb', 'middle') + text(150, 84, 'A', 'tl', 'middle') + text(152, 146, 'A', 'tl', 'middle');
  o += line(140, 32, 150, 74, 'dash') + line(150, 92, 152, 136, 'dash');
  o += seg([20, 70, 116, 186, 226, 262], ['u', 'v', 'w', 'x', 'y'], by);
  o += text(141, 270, 'z = uvwxy', 't', 'middle');
  // 右：i = 2
  const ox = 290;
  o += tri(ox + 130, 28, ox, ox + 262, by, 'paper') + tri(ox + 138, 70, ox + 40, ox + 238, by, 'wash') + tri(ox + 140, 118, ox + 76, ox + 206, by, 'wash') + tri(ox + 141, 166, ox + 112, ox + 172, by, 'wash-strong');
  o += text(ox + 130, 22, 'S', 'tb', 'middle') + text(ox + 138, 66, 'A', 'tl', 'middle') + text(ox + 140, 114, 'A', 'tl', 'middle') + text(ox + 141, 162, 'A', 'tl', 'middle');
  o += seg([ox, ox + 40, ox + 76, ox + 112, ox + 172, ox + 206, ox + 238, ox + 262], ['u', 'v', 'v', 'w', 'x', 'x', 'y'], by);
  o += text(ox + 131, 270, 'uv²wx²y', 't', 'middle');
  o += line(275, 20, 275, 250, 'grid');
  return svg(560, 278, o, '左边：parse tree 的一条 path 上 variable A 出现两次，上面的 A 生成 vwx，下面的生成 w；右边：把下面的 A 换成上面 subtree 的 copy，得到 u v v w x x y');
}

// 12. 讲义的 TM：a 和 b 个数相等，读 abba
function tm() {
  const dl = {
    'q0,a': ['q1', 'X', 'R'], 'q0,b': ['q2', 'X', 'R'], 'q0,X': ['q0', 'X', 'R'], 'q0,B': ['qA', 'B', 'R'],
    'q1,a': ['q1', 'a', 'R'], 'q1,b': ['q3', 'X', 'L'], 'q1,X': ['q1', 'X', 'R'],
    'q2,a': ['q3', 'X', 'L'], 'q2,b': ['q2', 'b', 'R'], 'q2,X': ['q2', 'X', 'R'],
    'q3,a': ['q3', 'a', 'L'], 'q3,b': ['q3', 'b', 'L'], 'q3,X': ['q3', 'X', 'L'], 'q3,B': ['q0', 'B', 'R'],
  };
  const tape = 'BabbaBB'.split('');
  let h = 1, s = 'q0';
  const ids = [];
  for (let n = 0; n < 60; n++) {
    const m = dl[s + ',' + tape[h]];
    ids.push({ t: tape.slice(), h, s, key: m ? s + ',' + tape[h] : null });
    if (!m) break;
    tape[h] = m[1]; h += m[2] === 'R' ? 1 : -1; s = m[0];
  }
  const N = ids.length; // 18 个 ID，17 步
  const { fg } = frames(ids.map((_, i) => (i === N - 1 ? 3 : 0.9)));
  const X0 = 100, Y = 34, cw = 40;
  let o = text(X0 - 12, Y + 22, 'tape', 'ts', 'end');
  for (let i = 0; i < 7; i++) o += rect(X0 + i * cw, Y, cw, 32, 'paper');
  o += text(X0 + 7 * cw + 8, Y + 22, '…', 't');
  const syms = ['a', 'b', 'X', 'B'], sts = ['q0', 'q1', 'q2', 'q3', 'qA'];
  const TX = [60, 170, 280, 390, 500], TY = 150, rh = 21;
  o += line(20, TY - 4, 560, TY - 4, 'axis');
  syms.forEach((c, j) => { o += text(TX[j + 1], TY - 10, c, 'tb', 'middle'); });
  const sub = (x) => x.replace(/q(\d|A)/g, (m, a) => q(a));
  const cellC = (s0, c) => { const m = dl[s0 + ',' + c]; return m ? `(${m[0]}, ${m[1]}, ${m[2]})` : ''; };
  ids.forEach((f, k) => {
    let g = '';
    if (f.key) { const [s0, c] = f.key.split(','); const i = sts.indexOf(s0), j = syms.indexOf(c); g += rect(TX[j + 1] - 50, TY + i * rh, 100, rh, 'wash-strong'); }
    for (let i = 0; i < 7; i++) g += text(X0 + i * cw + cw / 2, Y + 21, f.t[i], f.t[i] === 'B' ? 'ts' : 't', 'middle');
    const hx = X0 + f.h * cw + cw / 2;
    g += head(hx, Y + 36, -Math.PI / 2, 'ink', 7) + line(hx, Y + 37, hx, Y + 50, 'ink') + text(hx, Y + 66, sub(f.s), f.s === 'qA' ? 'tl' : 'tb', 'middle');
    g += text(560, Y + 10, `第 ${k} 步`, 'ts', 'end');
    if (f.s === 'qA') g += text(560, Y + 30, `进入 ${q('A')} ∈ F：accept`, 'tl', 'end');
    o += fg(k, g);
  });
  sts.forEach((s0, i) => {
    o += text(TX[0], TY + i * rh + 15, sub(s0), 'tb', 'middle');
    syms.forEach((c, j) => { o += text(TX[j + 1], TY + i * rh + 15, sub(cellC(s0, c)), 'ts', 'middle'); });
  });
  o += text(280, TY + 5 * rh + 20, '深色格是当前 ID 下要用的 transition：(新 state, 写下的 symbol, head 移动方向)；空格是没有定义', 'ts', 'middle');
  return svgA(560, 282, o, `动图：讲义里识别 a 和 b 个数相等的 TM 读 abba，${N - 1} 步后进入 accepting state qA；每一帧显示 tape、head 位置、当前 state 和用到的 transition`);
}

// 13. diagonalization 的表：L_d
function diag() {
  const rowsN = ['M₁', 'M₂', 'M₃', 'M₄', 'M₅'], cols = ['w₁', 'w₂', 'w₃', 'w₄', 'w₅'];
  const T = [[1, 0, 1, 1, 0], [0, 0, 1, 0, 1], [1, 1, 1, 0, 0], [0, 1, 0, 1, 1], [1, 0, 0, 1, 0]];
  const X0 = 120, Y0 = 44, cw = 76, rh = 30;
  let o = '';
  cols.forEach((c, j) => { o += text(X0 + j * cw + cw / 2, Y0 - 10, c, 'tb', 'middle'); });
  o += text(X0 + 5 * cw + 14, Y0 + 2.5 * rh + 4, '…', 't');
  const lab = (v) => (v ? 'acc' : 'rej');
  T.forEach((r, i) => {
    o += text(X0 - 14, Y0 + i * rh + 20, rowsN[i], 'tb', 'end');
    r.forEach((v, j) => { o += rect(X0 + j * cw, Y0 + i * rh, cw, rh, i === j ? 'wash-strong' : 'paper') + text(X0 + j * cw + cw / 2, Y0 + i * rh + 20, lab(v), i === j ? 'tb' : 't', 'middle'); });
  });
  const yD = Y0 + 5 * rh + 14;
  o += text(X0 - 14, yD + 20, sb('L', 'd'), 'tl', 'end');
  for (let j = 0; j < 5; j++) {
    const inL = 1 - T[j][j];
    o += rect(X0 + j * cw, yD, cw, rh, 'wash') + text(X0 + j * cw + cw / 2, yD + 20, inL ? '在' : '不在', 'tl', 'middle');
  }
  o += text(20, yD + 54, `acc：${sb('M', 'i')} accept ${sb('w', 'j')}；rej：不 accept（halt 但不 accept，或永远不停）。深色是对角线。`, 'ts');
  o += text(20, yD + 74, `${sb('L', 'd')} 一行写 ${sb('w', 'j')} 在不在 ${sb('L', 'd')} 里，在第 j 列和 ${sb('M', 'j')} 相反。`, 'ts');
  return svg(560, 290, o, '一张表的第 i 行第 j 列是 Mi 是否 accept wj；L_d 一行把对角线逐格取反，所以和每一行都在对角线那格不同');
}

// 14. 隔一个划一个：a^6 b^6
function cross() {
  const n = 6;
  let alive = Array(2 * n).fill(true);
  const rounds = [];
  for (let k = 0; k < 4; k++) {
    const ca = alive.slice(0, n).filter(Boolean).length, cb = alive.slice(n).filter(Boolean).length;
    rounds.push({ a: alive.slice(), ca, cb });
    if (ca === 0) break;
    for (const [lo, hi] of [[0, n], [n, 2 * n]]) { let c = 0; for (let i = lo; i < hi; i++) if (alive[i]) { if (c % 2 === 0) alive[i] = false; c++; } }
  }
  const X0 = 20, cw = 20, rh = 50, Y0 = 34;
  let o = text(X0, 20, '每轮：先读剩余个数的 parity，再从第一个开始隔一个划掉一个', 'tb');
  rounds.forEach((r, k) => {
    const y = Y0 + k * rh;
    for (let i = 0; i < 2 * n; i++) {
      const x = X0 + i * cw, ch = i < n ? 'a' : 'b';
      o += rect(x, y, cw, 28, r.a[i] ? 'paper' : 'wash2') + text(x + cw / 2, y + 19, ch, r.a[i] ? 't' : 'ts', 'middle');
      if (!r.a[i]) o += line(x + 5, y + 23, x + cw - 5, y + 5, 'mute');
    }
    const tx = X0 + 2 * n * cw + 18;
    const msg = r.ca === 0 ? '全部划完，个数相等：accept' : `剩 ${r.ca} 个 a、${r.cb} 个 b，parity 都是 ${r.ca % 2}`;
    o += text(tx, y + 19, (r.ca === 0 ? '结束：' : `第 ${k + 1} 轮前：`) + msg, r.ca === 0 ? 'tl' : 't');
  });
  o += text(X0, Y0 + rounds.length * rh + 6, '依次读到的 parity 是 0、1、1，从低位读起正是 6 的 binary 110：每轮相当于把个数右移一位。', 'ts');
  return svg(560, Y0 + rounds.length * rh + 14, o, 'a 的 6 次方 b 的 6 次方在 O(n log n) machine 上的各轮：剩余个数 6、3、1、0，parity 依次 0、1、1');
}


// 15. CYK：S → AT | AB，T → SB，A → 0，B → 1，读 0011
function cyk() {
  const w = '0011';
  const G = { S: [['A', 'T'], ['A', 'B']], T: [['S', 'B']] }, U = { A: '0', B: '1' };
  const n = w.length, X = {};
  for (let i = 1; i <= n; i++) X[`${i},${i}`] = Object.keys(U).filter((v) => U[v] === w[i - 1]);
  const why = {};
  for (let L = 2; L <= n; L++) for (let i = 1; i + L - 1 <= n; i++) {
    const j = i + L - 1, set = new Set(), notes = [];
    for (let k = i; k < j; k++) for (const B of X[`${i},${k}`]) for (const C of X[`${k + 1},${j}`]) for (const A in G) if (G[A].some(([b, c]) => b === B && c === C)) { set.add(A); notes.push(`${B}${C} → ${A}`); }
    X[`${i},${j}`] = [...set]; why[`${i},${j}`] = notes;
  }
  // 帧：0 = 完成的表；1..4 = 逐层填
  const durs = [3.2, 1.8, 2.2, 2.2, 2.6];
  const T = durs.reduce((a, b) => a + b, 0), kt = [];
  let c0 = 0; for (const d0 of durs) { kt.push(c0 / T); c0 += d0; }
  const showIn = (fs, body) => (fs.includes(0) ? `<g>${body}${anim('opacity', durs.map((_, f) => (fs.includes(f) ? 1 : 0)), kt, T, true)}</g>` : `<g opacity="0">${body}${anim('opacity', durs.map((_, f) => (fs.includes(f) ? 1 : 0)), kt, T, true)}</g>`);
  const X0 = 80, step = 100, cw = 96, ch = 34, yOf = (L) => 176 - (L - 1) * 42;
  const xOf = (i, L) => X0 + (i - 1) * step + (L - 1) * (step / 2);
  let o = text(280, 20, 'CYK：每格是能生成那一段 substring 的 variable', 'tb', 'middle');
  for (let L = 1; L <= n; L++) {
    o += text(36, yOf(L) + 22, `长 ${L}`, 'ts', 'end');
    for (let i = 1; i + L - 1 <= n; i++) {
      const j = i + L - 1, x = xOf(i, L), y = yOf(L), v = X[`${i},${j}`];
      o += rect(x, y, cw, ch, 'paper');
      const lab = text(x + 6, y + 12, sb('X', `${i}${j}`), 'ts');
      const val = text(x + cw / 2, y + 25, v.length ? '{' + v.join(', ') + '}' : '∅', v.includes('S') && L === n ? 'tl' : 't', 'middle');
      const fsFull = [0]; for (let f = L; f <= n; f++) fsFull.push(f);
      // 正在填的这一层加底色
      o += showIn([L], rect(x + 1, y + 1, cw - 2, ch - 2, 'wash'));
      o += lab + showIn(fsFull, (L === n && v.includes('S') ? rect(x + 3, y + 3, cw - 6, ch - 6, 'wash') : '') + val);
    }
  }
  for (let i = 1; i <= n; i++) o += text(xOf(i, 1) + cw / 2, yOf(1) + ch + 22, w[i - 1], 'tb', 'middle');
  const msg = [
    ['完成的表：最上面一格 X₁₄ 含 S，所以 0011 ∈ L(G)。', '下面一层一层地填一遍。'],
    [`长度 1：${sb('X', 'ii')} 是 A → 0、B → 1 里右边等于这个 symbol 的 variable。`, ''],
    ['长度 2：X₂₃ 拆成 X₂₂ X₃₃ = A B，由 S → AB 得 S。', 'X₁₂ 是 A A、X₃₄ 是 B B，没有对应的 production，∅。'],
    ['长度 3：X₂₄ 拆成 X₂₃ X₄₄ = S B，由 T → SB 得 T。', 'X₁₃ 的两种拆法 A S、∅ A 都没有对应的 production。'],
    ['长度 4：X₁₄ 拆成 X₁₁ X₂₄ = A T，由 S → AT 得 S。', '其余两种拆法都含 ∅。S ∈ X₁₄，accept。'],
  ];
  msg.forEach(([a, b], f) => { o += showIn([f], text(20, 258, a, 't') + text(20, 278, b, 'ts')); });
  return svgA(560, 286, o, '动图：CYK 对 0011 填表，X23 = {S}，X24 = {T}，X14 = {S}，所以 0011 在 language 里');
}

// 16. linear speedup：m = 3，home cell 和左右邻居
function speedup() {
  const m = 3, G = 6, cw = 26, X0 = 46, Y1 = 46, home = 2;
  const content = 'abbaXbabXXaabbaBBB';
  let o = text(X0 - 8, Y1 + 18, 'M', 'tb', 'end');
  const win0 = X0 + (home - 1) * m * cw, win1 = X0 + (home + 2) * m * cw;
  o += rect(win0 - 3, Y1 - 6, win1 - win0 + 6, 40, 'wash', 6);
  for (let i = 0; i < G * m; i++) o += cell(X0 + i * cw, Y1, cw, 28, content[i] === 'B' ? 'B' : content[i], 'paper', content[i] === 'B' ? 'ts' : 't');
  for (let g = 0; g <= G; g++) o += line(X0 + g * m * cw, Y1 - 4, X0 + g * m * cw, Y1 + 32, 'ink-b');
  o += text(X0 + (home + 0.5) * m * cw, Y1 - 12, 'home', 'tl', 'middle');
  o += text(X0 + (home - 0.5) * m * cw, Y1 - 12, '左邻居', 'ts', 'middle') + text(X0 + (home + 1.5) * m * cw, Y1 - 12, '右邻居', 'ts', 'middle');
  // M 的 head：从 home 最右一格出发向右走 3 步（最坏的出发点）
  const start = home * m + m - 1, path = [start, start + 1, start + 2, start + 3];
  const { fg } = frames([1.6, 1.1, 1.1, 2.4]);
  path.forEach((c, k) => {
    const hx = X0 + c * cw + cw / 2;
    let g = head(hx, Y1 + 36, -Math.PI / 2, 'ink', 7) + line(hx, Y1 + 37, hx, Y1 + 50, 'ink');
    g += text(280, Y1 + 70, k === 0 ? 'M 的 head 从 home cell 的最右一格出发（离出口最近）' : `M 走了第 ${k} 步，仍在三组之内`, k === 3 ? 'tl' : 't', 'middle');
    o += fg(k, g);
  });
  // M' 的 tape：每格是 M 的一组 3 个 cell
  const Y2 = 160, bw = m * cw;
  o += text(X0 - 8, Y2 + 26, "M′", 'tb', 'end');
  o += rect(X0 + (home - 1) * bw - 3, Y2 - 6, 3 * bw + 6, 52, 'wash', 6);
  for (let g = 0; g < G; g++) {
    o += rect(X0 + g * bw, Y2, bw, 40, 'paper');
    o += text(X0 + g * bw + bw / 2, Y2 + 25, content.slice(g * m, g * m + m).split('').join(' '), 't', 'middle');
    o += line(X0 + g * bw + bw / 2, Y1 + 80, X0 + g * bw + bw / 2, Y2 - 8, 'grid');
  }
  o += text(X0 + (home + 0.5) * bw, Y2 + 58, 'M′ 的 head 在 home cell', 'ts', 'middle');
  o += text(20, Y2 + 86, 'M 的 head 离开这 3 组（9 个 cell）至少要走 m = 3 步；M′ 读、写这 3 个大 cell 最多 8 步。', 'ts');
  o += text(20, Y2 + 106, '所以 M′ 每 8 步至少 simulate M 的 m 步，m 取得够大就压下任意常数倍。', 'ts');
  return svgA(560, 276, o, '动图：m 等于 3 时，M 的 tape 每 3 格压成 M′ 的 1 格；M 的 head 从 home cell 出发走 3 步仍在 home 和左右邻居三组之内');
}

// 17. PCP 的解 2,1,1,3
function pcp() {
  const A = ['1', '10111', '10'], B = ['111', '10', '0'], seq = [2, 1, 1, 3];
  let o = text(20, 18, 'A = (1, 10111, 10)，B = (111, 10, 0)，index 序列 2, 1, 1, 3', 'tb');
  // domino
  let x = 20;
  seq.forEach((i) => {
    const w = Math.max(A[i - 1].length, B[i - 1].length) * 13 + 24;
    o += rect(x, 34, w, 66, 'paper', 6) + line(x, 67, x + w, 67, 'mute');
    o += text(x + w / 2, 56, A[i - 1], 't', 'middle') + text(x + w / 2, 89, B[i - 1], 't', 'middle');
    o += text(x + w / 2, 116, String(i), 'tl', 'middle');
    x += w + 14;
  });
  // 逐个 symbol 对齐
  const top = seq.map((i) => A[i - 1]).join(''), bot = seq.map((i) => B[i - 1]).join('');
  const cw = 30, X0 = 100, YT = 154, YB = 192;
  o += text(X0 - 12, YT + 20, '上面', 'ts', 'end') + text(X0 - 12, YB + 20, '下面', 'ts', 'end');
  for (let c = 0; c < top.length; c++) { o += cell(X0 + c * cw, YT, cw, 28, top[c]); o += cell(X0 + c * cw, YB, cw, 28, bot[c]); }
  // 每块 domino 在两行里各占哪一段：上面的括号画在上方，下面的画在下方
  const segs = (lens) => { const r = []; let t = 0; lens.forEach((l) => { r.push([t, t + l]); t += l; }); return r; };
  const brk = (a0, a1, y, up, lab) => { const x1 = X0 + a0 * cw + 3, x2 = X0 + a1 * cw - 3, d0 = up ? 4 : -4; return line(x1, y, x2, y, 'ln') + line(x1, y, x1, y + d0, 'ln') + line(x2, y, x2, y + d0, 'ln') + text((x1 + x2) / 2, up ? y - 5 : y + 15, lab, 'tl', 'middle'); };
  segs(seq.map((i) => A[i - 1].length)).forEach(([a0, a1], k) => { o += brk(a0, a1, YT - 6, true, String(seq[k])); });
  segs(seq.map((i) => B[i - 1].length)).forEach(([a0, a1], k) => { o += brk(a0, a1, YB + 34, false, String(seq[k])); });
  o += text(X0 + top.length * cw + 12, YT + 20, `${top.length} 个 symbol`, 'ts') + text(X0 + top.length * cw + 12, YB + 20, `${bot.length} 个 symbol`, 'ts');
  o += text(20, 266, '括号是每块 domino 占的一段：上面在第 5、6、7、9 个 symbol 后切开，下面在第 2、5、8、9 个后。', 'ts');
  o += text(20, 286, '两行的内容逐个相同，边界却一直错开，直到最后一块才同时收尾。', 'ts');
  return svg(560, 294, o, 'PCP 的解 2 1 1 3：四块 domino，上面接起来和下面接起来都是 101111110，但 domino 的边界上下错开');
}

// 18. 3-SAT 到 vertex cover
function vc() {
  const r = 15;
  const top = { u1: [60, 52], w1: [124, 52], u2: [236, 52], w2: [300, 52], u3: [412, 52], w3: [476, 52] };
  const cx = [92, 280, 468], lits = [[['x', 1, 1], ['x', 2, 0], ['x', 3, 1]], [['x', 1, 0], ['x', 2, 1], ['x', 3, 1]], [['x', 1, 0], ['x', 2, 0], ['x', 3, 0]]];
  const Z = {};
  cx.forEach((c, j) => { Z[`${j + 1}1`] = [c - 46, 236]; Z[`${j + 1}2`] = [c, 168]; Z[`${j + 1}3`] = [c + 46, 236]; });
  const cover = new Set(['w1', 'w2', 'u3', 'z11', 'z13', 'z22', 'z23', 'z32', 'z33']);
  let o = '';
  // literal edges
  lits.forEach((cl, j) => cl.forEach(([, v, pos], rr) => {
    const z = Z[`${j + 1}${rr + 1}`], t = top[(pos ? 'u' : 'w') + v];
    o += line(z[0], z[1] - r, t[0], t[1] + r, 'mute');
  }));
  // variable edges
  for (let v = 1; v <= 3; v++) o += line(top['u' + v][0] + r, 52, top['w' + v][0] - r, 52, 'ink-b');
  // triangles
  cx.forEach((c, j) => {
    const a = Z[`${j + 1}1`], b = Z[`${j + 1}2`], d = Z[`${j + 1}3`];
    o += line(a[0], a[1], b[0], b[1], 'ink-b') + line(b[0], b[1], d[0], d[1], 'ink-b') + line(a[0], a[1], d[0], d[1], 'ink-b');
    o += text(c, 276, sb('c', j + 1), 'tb', 'middle');
  });
  const node = (P, name, lab) => {
    const on = cover.has(name);
    return circle(P[0], P[1], r, on ? 'solid' : 'paper') + text(P[0], P[1] + 4.5, lab, on ? 'tw' : 't', 'middle');
  };
  for (const k in top) o += node(top[k], k, sb(k[0], k[1]));
  lits.forEach((cl, j) => cl.forEach(([, v, pos], rr) => { o += node(Z[`${j + 1}${rr + 1}`], `z${j + 1}${rr + 1}`, (pos ? '' : '¬') + sb('x', v)); }));
  o += text(560, 16, '实心 9 个 = cover；k = 2m + n = 9', 'ts', 'end');
  o += text(20, 16, sb('u', 'i') + ' 代表 ' + sb('x', 'i') + '，' + sb('w', 'i') + ' 代表 ¬' + sb('x', 'i'), 'ts');
  return svg(560, 284, o, '3-SAT 公式的 vertex cover 构造：上面三对 u w，下面三个 clause triangle，triangle 的每个 vertex 连向它的 literal；实心的 9 个 vertex 是 cover');
}

export default {
  'cs3231-mod3': mod3,
  'cs3231-product': product,
  'cs3231-nfarun': nfarun,
  'cs3231-subset': subset,
  'cs3231-thompson': thompson,
  'cs3231-odd': odd,
  'cs3231-pump': pump,
  'cs3231-minim': minim,
  'cs3231-parse': parse,
  'cs3231-pda': pda,
  'cs3231-cflpump': cflpump,
  'cs3231-tm': tm,
  'cs3231-diag': diag,
  'cs3231-cross': cross,
  'cs3231-cyk': cyk,
  'cs3231-speedup': speedup,
  'cs3231-pcp': pcp,
  'cs3231-vc': vc,
};
