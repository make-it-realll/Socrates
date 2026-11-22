import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1, sub } from '../lib/svg.mjs';

// ---------- 时间轴小工具 ----------
// 每个 state 停一段、两个 state 之间移动一段；kt 和 s 一一对应
function tl(n, { move = 0.6, hold = 0.6, first = 2.2, last = 2.6 } = {}) {
  const t = [], s = [];
  let now = 0;
  for (let k = 0; k < n; k++) {
    if (k > 0) now += move;
    t.push(now); s.push(k);
    now += k === 0 ? first : k === n - 1 ? last : hold;
    t.push(now); s.push(k);
  }
  return { kt: t.map((x) => x / now), s, T: now };
}
// discrete：每个 state 一段时长，values 比 holds 多一个（最后一个重复）
function tlD(holds) {
  const T = holds.reduce((a, b) => a + b, 0), kt = [];
  let t = 0;
  for (const h of holds) { kt.push(t / T); t += h; }
  kt.push(1);
  return { kt, T };
}
const gshow = (on, kt, T, body) => `<g opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}${body}</g>`;
const fmt = (v, n = 2) => v.toFixed(n);

// ---------- 图 1：布 market，三种 ownership，征不征 12 元 ----------
function clothA() {
  const W = (Q) => 48 * Q - 1.5 * Q * Q;
  const frames = [
    { name: '1000 个作坊，各自是 price taker', Q0: 20, Q1: 16, groups: [] },
    { name: '两家 firm，各管一半作坊', Q0: 120 / 7, Q1: 96 / 7, groups: [[0, 2], [3, 5]] },
    { name: '一家 monopoly', Q0: 15, Q1: 12, groups: [[0, 5]] },
  ];
  const { kt, T } = tlD([3.4, 3.4, 3.4]);
  const on = (f) => [0, 1, 2, 2].map((k) => k === f);
  let o = '';
  // 左：作坊和河
  const cx = (c) => 24 + c * 38, ry = (r) => 52 + r * 28;
  for (let c = 0; c < 6; c++) for (let r = 0; r < 4; r++) {
    const x = cx(c), y = ry(r);
    o += rect(x + 17, y - 7, 4, 8, 'paper') + rect(x, y, 26, 13, 'paper', 1);
  }
  for (let c = 0; c < 6; c++) o += line(cx(c) + 13, ry(3) + 15, cx(c) + 13, 186, 'mute');
  o += text(8, 184, '废水', 'ts', 'start');
  o += rect(8, 188, 252, 26, 'wash', 3);
  const fish = (x, y) => path(`M${x - 9} ${y}Q${x} ${y - 6} ${x + 8} ${y}Q${x} ${y + 6} ${x - 9} ${y}Z`, 'ink-f') + poly([[x + 7, y], [x + 13, y - 5], [x + 13, y + 5]], 'ink-f');
  o += fish(212, 198) + fish(236, 205) + fish(222, 208);
  o += arrow(30, 201, 150, 201, 'mute', 6) + text(158, 205, '下游', 'ts', 'start');
  o += text(8, 232, '渔民：每卷布损失 12 元', 'ts', 'start');
  o += text(8, 250, '24 个图标，每个代表约 42 个作坊', 'ts', 'start');
  frames.forEach((fr, f) => {
    let g = text(8, 24, fr.name, 'tb', 'start');
    fr.groups.forEach(([c0, c1], j) => {
      g += rect(cx(c0) - 6, ry(0) - 13, cx(c1) - cx(c0) + 38, ry(3) - ry(0) + 32, 'ln-dash', 4);
    });
    o += gshow(on(f), kt, T, g);
  });
  // 右：market
  const sx = lin(0, 25, 318, 548), sy = lin(0, 80, 222, 30);
  o += axes({ sx, sy, x0: 0, x1: 25, y0: 0, y1: 80, xt: [0, 5, 10, 15, 20, 25], yt: [0, 20, 40, 60, 80], xl: 'Q（千卷）' });
  o += text(sx(0) + 6, sy(80) - 8, 'P（元）', 'ts', 'start');
  o += line(sx(0), sy(70), sx(25), sy(45), 'ink');
  o += line(sx(0), sy(10), sx(25), sy(60), 'ink');
  o += line(sx(0), sy(22), sx(25), sy(72), 'dash');
  o += text(sx(1), sy(70) - 8, 'demand', 'ts', 'start');
  o += text(sx(8), sy(26) + 14, 'private MC', 'ts', 'start');
  o += text(sx(25) - 4, sy(72) - 7, 'social MC', 'ts', 'end');
  o += line(sx(16), sy(0), sx(16), sy(54), 'grid');
  frames.forEach((fr, f) => {
    let g = '';
    g += circle(sx(fr.Q0), sy(70 - fr.Q0), 5, 'paper') + circle(sx(fr.Q1), sy(70 - fr.Q1), 5, 'ln-f');
    o += gshow(on(f), kt, T, g);
    const t1 = `不征 tax：Q = ${fr.Q0 === 20 || fr.Q0 === 15 ? fr.Q0 : fmt(fr.Q0)}，W = ${fr.Q0 === 20 || fr.Q0 === 15 ? f1(W(fr.Q0)) : fmt(W(fr.Q0))}`;
    const t2 = `每卷征 12 元：Q = ${fr.Q1 === 16 || fr.Q1 === 12 ? fr.Q1 : fmt(fr.Q1)}，W = ${fr.Q1 === 16 || fr.Q1 === 12 ? f1(W(fr.Q1)) : fmt(W(fr.Q1))}`;
    o += gshow(on(f), kt, T, circle(298, 270, 4.5, 'paper') + text(308, 274, t1, 't', 'start') + circle(298, 290, 4.5, 'ln-f') + text(308, 294, t2, 't', 'start'));
  });
  o += text(sx(16) + 4, sy(4), 'efficient 16', 'ts', 'start');
  o += text(8, 274, 'W 把渔民的损失算在里面：', 'ts', 'start') + text(8, 292, 'W(Q) = 48Q − 1.5Q²', 'ts', 'start');
  return svgA(560, 300, o, '动图：左边是 24 个作坊图标、它们排废水的河和下游的鱼，虚线框表示 ownership，依次是 1000 个独立作坊、两家 firm、一家 monopoly；右边是 demand、private MC、social MC，空心点是不征 tax 时的 Q（20、17.14、15），实心点是每卷征 12 元后的 Q（16、13.71、12），下方写着对应的 total surplus');
}

// ---------- 图 2：两家 firm 轮流做 best response ----------
function brdynA() {
  const br = (q) => (60 - q) / 6, qs = 60 / 7;
  const st = [[7.5, 7.5]];
  let [a, b] = st[0];
  for (let k = 0; k < 6; k++) { if (k % 2 === 0) a = br(b); else b = br(a); st.push([a, b]); }
  const n = st.length, { kt, s, T } = tl(n, { move: 0.7, hold: 0.9, first: 2.4, last: 2.6 });
  const S = s.map((k) => st[k]);
  let o = text(118, 22, '两家 firm 当前的 output（千卷）', 'tb', 'middle');
  const by = lin(0, 10, 236, 66), bw = 48;
  o += line(36, by(0), 206, by(0), 'axis');
  for (const v of [0, 5, 10]) o += line(32, by(v), 36, by(v), 'axis') + text(28, by(v) + 4, String(v), 'ts', 'end');
  const factory = (x, lab) => {
    const y = 34;
    const roof = d([[x, y + 22], [x, y + 9], [x + 12, y], [x + 12, y + 9], [x + 24, y], [x + 24, y + 9], [x + 36, y], [x + 36, y + 9], [x + bw, y + 9], [x + bw, y + 22]]) + 'Z';
    return path(roof, 'paper') + path(d([[x, y + 22], [x, by(0)]]), 'ink') + path(d([[x + bw, y + 22], [x + bw, by(0)]]), 'ink') + text(x + bw / 2, by(0) + 18, lab, 'tb', 'middle');
  };
  const bar = (x, idx) => {
    const ys = S.map((p) => f1(by(p[idx]))), hs = S.map((p) => f1(by(0) - by(p[idx])));
    return `<rect x="${x}" y="${ys[0]}" width="${bw}" height="${hs[0]}" class="${idx ? 'solid2' : 'solid'}">${anim('y', ys, kt, T)}${anim('height', hs, kt, T)}</rect>`;
  };
  o += factory(64, 'Firm 1') + factory(144, 'Firm 2') + bar(64, 0) + bar(144, 1);
  o += line(54, by(qs), 202, by(qs), 'dash') + text(208, by(qs) + 4, '60/7', 'ts', 'start');
  // 右：plane
  const sx = lin(7, 9.5, 304, 540), sy = lin(7, 9.5, 236, 40);
  o += axes({ sx, sy, x0: 7, x1: 9.5, y0: 7, y1: 9.5, xt: [7, 7.5, 8, 8.5, 9, 9.5], yt: [7.5, 8, 8.5, 9, 9.5], xl: 'q₁' });
  o += text(sx(7) + 4, sy(9.5) - 6, 'q₂', 'ts', 'start');
  o += line(sx(br(7)), sy(7), sx(br(9.5)), sy(9.5), 'ink');
  o += line(sx(7), sy(br(7)), sx(9.5), sy(br(9.5)), 'ink');
  o += text(sx(br(9.5)) + 10, sy(9.5) + 10, 'Firm 1 的', 'ts', 'start') + text(sx(br(9.5)) + 10, sy(9.5) + 24, 'best response', 'ts', 'start');
  o += text(310, sy(br(7)) - 10, 'Firm 2 的 best response', 'ts', 'start');
  o += circle(sx(7.5), sy(7.5), 4, 'paper') + text(sx(7.5) + 8, sy(7.5) + 16, '说好各卖 7.5', 'ts', 'start');
  // 完整的轨迹先淡淡画一遍，静态时也看得到
  o += path(d(st.map(([x, y]) => [sx(x), sy(y)])), 'mute');
  const pathAt = (k) => d(st.map((p, j) => (j <= k ? p : st[k])).map(([x, y]) => [sx(x), sy(y)]));
  o += apath(s.map((k) => pathAt(k)), kt, T, 'ln');
  o += acircle(S.map((p) => sx(p[0])), S.map((p) => sy(p[1])), kt, T, 5, 'ln-f');
  const say = (k) => {
    if (k === 0) return '起点：两家说好各卖 7.5';
    const [p, q] = st[k], [p0, q0] = st[k - 1];
    if (k % 2 === 1) return `第 ${k} 步：Firm 1 对 q₂ = ${fmt(q0, 4).replace(/0+$/, '').replace(/\.$/, '')} 做 best response，q₁ = (60 − q₂)/6 = ${fmt(p, 4)}`;
    return `第 ${k} 步：Firm 2 对 q₁ = ${fmt(p0, 4)} 做 best response，q₂ = (60 − q₁)/6 = ${fmt(q, 4)}`;
  };
  for (let k = 0; k < n; k++) o += gshow(s.map((j) => j === k), kt, T, text(280, 276, say(k), 't', 'middle'));
  o += text(280, 296, '每一步离 60/7 = 8.5714 的距离乘 −1/6', 'ts', 'middle');
  return svgA(560, 302, o, '动图：EC1101E 的两家 firm 从各卖 7.5 出发，轮流对对方的 output 做 best response，柱高和右边 plane 上的点同步，折线在两条近乎垂直的 best response line 之间来回，三四步就收到 60/7');
}

// ---------- 图 3：Coase 的 p 和 Fearon 的 range ----------
function bargainA() {
  const dl = 0.9, S = 1.5;
  const sh = [1];
  for (let n = 2; n <= 12; n++) sh.push(1 - dl * sh[sh.length - 1]);
  const pN = sh.map((x) => 1.5 + (1 - x) * S), pInf = 1.5 + (dl / (1 + dl)) * S;
  // 第一帧是没有最后期限的 SPE，然后 n = 1, 2, ..., 12，最后一个值重复第一帧
  const seq = [Infinity, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Infinity];
  const holds = [3].concat(Array(11).fill(1.05), [1.6]);
  const { kt, T } = tlD(holds);
  const val = (v) => (v === Infinity ? pInf : pN[v - 1]);
  const sx = lin(1, 3.5, 48, 520), y = 104;
  let o = text(8, 20, 'LC1002A，Rule B：farmer 每年付给 rancher 的 p', 'tb', 'start');
  o += text(8, 40, '谈不拢：4 头牛，farmer 修围栏，(rancher, farmer) = (14, −9)', 'ts', 'start');
  o += text(8, 57, '谈成：3 头牛，(12.5 + p, −6 − p)；δ = 0.9，farmer 先提', 'ts', 'start');
  o += rect(sx(1.5), y - 10, sx(3) - sx(1.5), 20, 'wash', 2);
  o += line(sx(1), y, sx(3.5), y, 'axis');
  for (const v of [1, 1.5, 2, 2.5, 3, 3.5]) o += line(sx(v), y + 10, sx(v), y + 14, 'axis') + text(sx(v), y + 28, String(v), 'ts', 'middle');
  o += text(sx(1.5) - 4, y - 14, 'rancher 刚好不亏', 'ts', 'end');
  o += text(sx(3) + 4, y - 14, 'farmer 刚好不亏', 'ts', 'start');
  o += line(sx(pInf), y - 12, sx(pInf), y + 12, 'ln');
  o += text(sx(pInf), y + 46, 'n → ∞：p = 2.211', 'tl', 'middle');
  const xs = seq.map((v) => f1(sx(val(v))));
  o += `<circle cx="${xs[0]}" cy="${y}" r="6" class="ln-f">${anim('cx', xs, kt, T, true)}</circle>`;
  seq.forEach((v, i) => {
    if (i === seq.length - 1) return;
    const on = seq.map((_, j) => j === i || (i === 0 && j === seq.length - 1));
    const lab = v === Infinity ? '没有最后期限' : `最多谈 ${v} 轮：p = ${val(v).toFixed(3)}`;
    o += gshow(on, kt, T, text(sx(3.5), 76, lab, 'tl', 'end'));
  });
  // 下：Fearon
  const y2 = 232, s2 = lin(0.3, 0.9, 48, 520);
  o += text(8, 172, 'PS1101E：两国争价值 1 的东西，A 得 x，B 得 1 − x', 'tb', 'start');
  o += text(8, 190, '谈不拢就开战：(A, B) = (p − c' + sub('A') + ', 1 − p − c' + sub('B') + ') = (0.5, 0.3)', 'ts', 'start');
  o += rect(s2(0.5), y2 - 10, s2(0.7) - s2(0.5), 20, 'wash', 2);
  o += line(s2(0.3), y2, s2(0.9), y2, 'axis');
  for (const v of [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]) o += line(s2(v), y2 + 10, s2(v), y2 + 14, 'axis') + text(s2(v), y2 + 28, String(v), 'ts', 'middle');
  o += text(s2(0.6), y2 + 46, 'range 宽 c' + sub('A') + ' + c' + sub('B') + ' = 0.2，是谈成比开战多出的 W', 'ts', 'middle');
  o += text(s2(0.5) - 4, y2 - 14, 'A 刚好不亏', 'ts', 'end');
  o += text(s2(0.7) + 4, y2 - 14, 'B 刚好不亏', 'ts', 'start');
  return svgA(560, 284, o, '动图：上面一条数轴是 rancher 与 farmer 谈判的 p，range 从 1.5 到 3，点依次是最多谈 1、2、3 到 12 轮时 SPE 的 p，在 2.211 两边来回收拢；下面一条是 Fearon model 里 A 的份额，range 从 0.5 到 0.7');
}

// ---------- 图 4：路灯的 VCG ----------
function vcgA() {
  const H = [{ k: 'A', a: 20, x: 100 }, { k: 'B', a: 16, x: 280 }, { k: 'C', a: 12, x: 460 }];
  const frames = [
    { out: null, q: 6, l1: '三户都在：报出来的 MB 合计 48 − 3q = 30，装 6 盏，W = 54', l2: '下面轮流拿掉一户，看其余的人（连同付 cost 的 government）得多少' },
    { out: 'A', q: 0, l1: '没有 A：B、C 合计 28 − 2q，第一盏就不到 30，装 0 盏，其余的人得 0', l2: '有 A 时其余的人得 78 + 54 − 180 = −48，所以 A 付 0 − (−48) = 48' },
    { out: 'B', q: 1, l1: '没有 B：A、C 合计 32 − 2q = 30，装 1 盏，其余的人得 1', l2: '有 B 时其余的人得 102 + 54 − 180 = −24，所以 B 付 1 − (−24) = 25' },
    { out: 'C', q: 3, l1: '没有 C：A、B 合计 36 − 2q = 30，装 3 盏，其余的人得 9', l2: '有 C 时其余的人得 102 + 78 − 180 = 0，所以 C 付 9 − 0 = 9' },
  ];
  const { kt, T } = tlD([3.6, 3.8, 3.8, 3.8]);
  const on = (f) => [0, 1, 2, 3, 3].map((k) => k === f);
  let o = '';
  const house = (x, cls) => poly([[x - 38, 66], [x, 38], [x + 38, 66]], cls) + rect(x - 32, 66, 64, 40, cls, 1) + rect(x - 8, 84, 16, 22, cls);
  o += rect(8, 132, 544, 24, 'wash2', 2) + line(8, 144, 552, 144, 'dash');
  frames.forEach((fr, f) => {
    let g = '';
    for (const h of H) {
      const gone = fr.out === h.k;
      g += house(h.x, gone ? 'dash' : 'paper');
      g += text(h.x, 58, h.k, gone ? 'ts' : 'tb', 'middle');
      g += text(h.x, 124, gone ? `${h.k} 不在` : `MB = ${h.a} − q`, gone ? 'ts' : 't', 'middle');
    }
    const n = fr.q, xs = n === 0 ? [] : Array.from({ length: n }, (_, i) => (n === 1 ? 280 : 60 + (440 * i) / (n - 1)));
    for (const x of xs) {
      g += circle(x, 172, 13, 'wash') + line(x, 178, x, 214, 'ink-b') + line(x - 8, 214, x + 8, 214, 'ink') + circle(x, 172, 6, 'solid');
    }
    if (n === 0) g += text(280, 196, '一盏也不装', 'ts', 'middle');
    g += text(280, 18, f === 0 ? '三户都说真话' : `拿掉 ${fr.out}`, 'tb', 'middle');
    g += text(280, 240, fr.l1, 't', 'middle') + text(280, 258, fr.l2, 'ts', 'middle');
    o += gshow(on(f), kt, T, g);
  });
  o += rect(70, 270, 420, 24, 'wash', 4) + text(280, 287, 'A 付 48，B 付 25，C 付 9；合计 82，6 盏灯花 180', 'tb', 'middle');
  return svgA(560, 298, o, '动图：一条街上三户人家，三户都在时街边装 6 盏路灯；依次拿掉 A、B、C，其余的人分别会装 0、1、3 盏，下方算出每户的 VCG payment 48、25、9');
}

// ---------- 图 5：selfish mining 的 state 与 revenue ----------
function selfishS() {
  const R = (a, g) => (a * (1 - a) ** 2 * (4 * a + g * (1 - 2 * a)) - a ** 3) / (1 - a * (1 + (2 - a) * a));
  let o = '';
  const Y = 84, r = 17;
  const P = { s0: [62, Y], s1: [182, Y], s2: [302, Y], s3: [422, Y], s0p: [182, 152] };
  const node = ([x, y], lab) => circle(x, y, r, 'paper') + text(x, y + 5, lab, 'tb', 'middle');
  const ar = (p, q, cls = 'ink', r1 = r + 2, r2 = r + 4) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy);
    return arrow(p[0] + (dx * r1) / L, p[1] + (dy * r1) / L, q[0] - (dx * r2) / L, q[1] - (dy * r2) / L, cls, 6);
  };
  // α：往右，私藏
  o += ar([P.s0[0], Y - 6], [P.s1[0], Y - 6]) + text(122, Y - 12, 'α：私藏', 'ts', 'middle');
  o += ar([P.s1[0], Y - 6], [P.s2[0], Y - 6]) + text(242, Y - 12, 'α', 'ts', 'middle');
  o += ar([P.s2[0], Y - 6], [P.s3[0], Y - 6]) + text(362, Y - 12, 'α', 'ts', 'middle');
  o += arrow(P.s3[0] + r + 2, Y - 6, 500, Y - 6, 'ink', 6) + text(520, Y - 2, '…', 'tb', 'middle');
  // 1 − α
  o += ar([P.s3[0], Y + 6], [P.s2[0], Y + 6], 'mute') + text(362, Y + 22, '1 − α：公布 1 个', 'ts', 'middle');
  o += arrow(500, Y + 6, P.s3[0] + r + 2, Y + 6, 'mute', 6);
  // 2 → 0：从上面绕回去
  {
    const p0 = [P.s2[0] - 8, Y - r + 1], c = [(P.s0[0] + P.s2[0]) / 2, Y - 92], p2 = [P.s0[0] + 9, Y - r - 1];
    o += path(`M${p0[0]} ${p0[1]}Q${c[0]} ${c[1]} ${p2[0]} ${p2[1]}`, 'mute');
    const tx = p2[0] - c[0], ty = p2[1] - c[1], L = Math.hypot(tx, ty);
    o += arrow(p2[0] - (tx / L) * 12, p2[1] - (ty / L) * 12, p2[0], p2[1], 'mute', 6);
    o += text(c[0], 18, '1 − α：全部公布，别人刚挖的作废', 'ts', 'middle');
  }
  // 1 → 0′ → 0
  o += ar(P.s1, P.s0p, 'mute') + text(P.s1[0] + 8, 126, '1 − α：公布 1 个', 'ts', 'start');
  o += ar(P.s0p, P.s0, 'mute') + text(104, 146, '谁挖到都结束', 'ts', 'end');
  // 0 的 self-loop（在左边）
  o += path(`M${P.s0[0] - 15} ${Y - 9}C${P.s0[0] - 56} ${Y - 34} ${P.s0[0] - 56} ${Y + 34} ${P.s0[0] - 17} ${Y + 7}`, 'mute');
  o += poly([[P.s0[0] - r, Y + 6], [P.s0[0] - r - 6, Y + 15], [P.s0[0] - r - 11, Y + 6]], 'mute-f');
  o += text(P.s0[0] - 34, Y + 40, '1 − α', 'ts', 'middle');
  o += node(P.s0, '0') + node(P.s1, '1') + node(P.s2, '2') + node(P.s3, '3') + node(P.s0p, '0′');
  o += text(P.s0p[0] + r + 8, P.s0p[1] + 5, '两条等长 branch 竞争', 'ts', 'start');
  o += text(8, 194, '圈里的数：pool 私下领先几个 block。α：下一个 block 由 pool 挖到；1 − α：由别人挖到。', 'ts', 'start');
  // 下：revenue
  const sx = lin(0, 0.45, 70, 470), sy = lin(0, 0.7, 345, 222);
  o += axes({ sx, sy, x0: 0, x1: 0.45, y0: 0, y1: 0.7, xt: [0, 0.1, 0.2, [0.25, '¼'], [1 / 3, '⅓'], 0.4], yt: [0, 0.2, 0.4, 0.6], xl: 'α（pool 的 hash power）' });
  o += text(sx(0) + 6, sy(0.7) - 6, 'pool 的 block 在最终 chain 里的比例', 'ts', 'start');
  o += path(d([[sx(0), sy(0)], [sx(0.45), sy(0.45)]]), 'dash');
  o += text(sx(0.45) + 6, sy(0.45) + 4, '按 protocol：α', 'ts', 'start');
  o += path(curve((a) => R(a, 0), 0.02, 0.45, sx, sy), 'ln');
  o += path(curve((a) => R(a, 0.5), 0.02, 0.45, sx, sy), 'ink');
  o += text(sx(0.45) + 6, sy(R(0.45, 0)) + 12, 'γ = 0', 'tl', 'start');
  o += text(sx(0.45) + 6, sy(R(0.45, 0.5)) - 3, 'γ = ½', 'tb', 'start');
  o += line(sx(1 / 3), sy(1 / 3) + 6, sx(1 / 3), sy(0), 'grid') + line(sx(0.25), sy(0.25) + 6, sx(0.25), sy(0), 'grid');
  o += circle(sx(1 / 3), sy(1 / 3), 4, 'ln-f') + circle(sx(0.25), sy(0.25), 4, 'ink-f');
  o += text(sx(0.15), sy(0.48), '曲线在虚线上方：selfish mining 比按 protocol 多拿', 'ts', 'middle');
  return svg(560, 380, o, '上面是 selfish mining 的 state machine：0、1、2、3 表示 pool 私下领先的 block 数，0 撇表示两条等长 branch 竞争，箭头标着 alpha 或 1 减 alpha；下面是 pool 的 relative revenue 随 alpha 变化的两条曲线（gamma 为 0 和二分之一），和对角虚线 alpha 分别交于三分之一和四分之一');
}

// ---------- 图 6：AMM 的 supply curve 和 arbitrageur 拿走的 area ----------
function ammA() {
  const k = 3e7, x = (p) => Math.sqrt(k / p), yU = (p) => Math.sqrt(k * p);
  const S = (p) => x(3000) - x(p);
  const prof = (p) => 100 * (p - 3000) - Math.sqrt(k) * 2 * (Math.sqrt(p) - Math.sqrt(3000));
  // state 0 是终点 3300（静态时看到的），其余是一步步涨上去
  const states = [3300, 3000, 3060, 3120, 3180, 3240];
  const kf = [0, 0, 1, 1, 2, 3, 4, 5, 0, 0];
  const times = [0, 2.6, 3.0, 3.6, 4.6, 5.6, 6.6, 7.6, 8.6, 11.0], T = 11.0;
  const kt = times.map((t) => t / T);
  const vals = kf.map((i) => states[i]);
  const sx = lin(0, 5, 300, 540), sy = lin(2980, 3320, 226, 40);
  let o = axes({ sx, sy, x0: 0, x1: 5, y0: 2980, y1: 3320, xt: [0, 1, 2, 3, 4, 5], yt: [3000, 3100, 3200, 3300], xl: 'pool 卖出的 ETH' });
  o += text(sx(0) + 6, sy(3320) - 20, 'price（USDC）', 'ts', 'start');
  const N = 40;
  const shape = (pe) => {
    const pts = [];
    for (let i = 0; i <= N; i++) { const p = 3000 + ((pe - 3000) * i) / N; pts.push([sx(S(p)), sy(p)]); }
    pts.push([sx(0), sy(pe)]);
    return d(pts) + 'Z';
  };
  o += apath(vals.map(shape), kt, T, 'wash-strong');
  o += path(curve((p) => p, 3000, 3320, (p) => sx(S(p)), sy), 'ink-b');
  o += text(sx(S(3100)) + 12, sy(3100) + 16, 'supply curve', 'ts', 'start');
  o += apath(vals.map((pe) => d([[sx(0), sy(pe)], [sx(5), sy(pe)]])), kt, T, 'ln');
  o += acircle(vals.map((pe) => sx(S(pe))), vals.map((pe) => sy(pe)), kt, T, 4.5, 'ln-f');
  states.forEach((pe, i) => {
    const on = kf.map((j) => j === i);
    let g = text(sx(0) + 70, sy(pe) - 7, `外面的 price ${pe}`, 'tl', 'start');
    if (i === 0) g += text(sx(1.1), sy(3235), 'arbitrageur 的利润', 'ts', 'start');
    g += text(420, 278, `卖出 ${S(pe).toFixed(4)} ETH，arbitrageur 赚 ${prof(pe).toFixed(2)}`, 't', 'middle');
    g += text(56, 278, `ETH ${x(pe).toFixed(2)}`, 'ts', 'middle') + text(150, 278, `USDC ${Math.round(yU(pe)).toLocaleString('en-US')}`, 'ts', 'middle');
    o += gshow(on, kt, T, g);
  });
  o += text(280, 298, '按 3300 一次卖完收 15,357.35；按 curve 一单位一单位卖，只收 14,642.65', 'ts', 'middle');
  const jar = (x0, lab, full, val) => {
    const top = 50, bot = 240, h = (v) => bot - ((bot - top) * v) / full;
    const ys = vals.map((pe) => f1(h(val(pe)))), hs = vals.map((pe) => f1(bot - h(val(pe))));
    return `<rect x="${x0 + 3}" y="${ys[0]}" width="58" height="${hs[0]}" class="wash-strong">${anim('y', ys, kt, T)}${anim('height', hs, kt, T)}</rect>` +
      path(d([[x0, top], [x0, bot], [x0 + 64, bot], [x0 + 64, top]]), 'ink-b') + text(x0 + 32, top - 10, lab, 'tb', 'middle');
  };
  o += jar(24, 'ETH', 110, x) + jar(118, 'USDC', 330000, yU);
  o += text(104, 20, 'pool 里的两种 token', 'ts', 'middle');
  return svgA(560, 304, o, '动图：左边两个罐子是 pool 里的 ETH 和 USDC；右边是 pool 的 supply curve，横轴是卖出的 ETH，纵轴是 price，外面的 price 从 3000 涨到 3300，price line 和 supply curve 之间的 area 是 arbitrageur 的利润，长到 714.69');
}

// ---------- 图 7：merge，每一轮重新 plan ----------
function mergeA() {
  const brR = (uh) => 0.2 - 0.3 * uh, brH = (u) => -u, uN = 2 / 7;
  const st = [[0.2, 0]];
  let [u, h] = st[0];
  for (let k = 0; k < 8; k++) { if (k % 2 === 0) h = brH(u); else u = brR(h); st.push([u, h]); }
  const n = st.length, { kt, s, T } = tl(n, { move: 0.6, hold: 0.8, first: 2.6, last: 2.8 });
  const S = s.map((j) => st[j]);
  let o = '';
  // 左：road
  const top = 70, lw = 40;
  o += text(8, 22, '每一轮：robot 把人上一轮的反应当作固定的', 'tb', 'start');
  o += rect(8, top, 262, 2 * lw, 'wash2', 2) + line(8, top + lw, 270, top + lw, 'dash');
  o += text(12, top - 8, 'robot 的 lane', 'ts', 'start') + text(12, top + 2 * lw + 16, '要并进的 lane', 'ts', 'start');
  const ys = S.map(([uu]) => f1(top + lw / 2 + uu * lw - 10));
  o += `<rect x="156" y="${ys[0]}" width="48" height="20" rx="4" class="solid">${anim('y', ys, kt, T)}</rect>`;
  o += `<text x="180" y="${f1(+ys[0] + 15)}" class="tw" text-anchor="middle">R${anim('y', ys.map((v) => f1(+v + 15)), kt, T)}</text>`;
  const hx = 84, hy = top + lw + lw / 2;
  o += rect(hx - 24, hy - 10, 48, 20, 'paper', 4) + text(hx, hy + 5, 'H', 'tb', 'middle');
  const x2 = S.map(([, hh]) => f1(hx - 26 + hh * 110));
  o += `<line x1="${hx - 26}" y1="${hy}" x2="${x2[0]}" y2="${hy}" class="ink-b">${anim('x2', x2, kt, T)}</line>`;
  o += text(150, top + 2 * lw + 16, '向左的粗线：减速多少', 'ts', 'start');
  // 右：plane，纵轴是减速的大小 −u_H
  const sx = lin(0, 0.6, 318, 500), sy = lin(0, 0.6, 236, 40);
  o += axes({ sx, sy, x0: 0, x1: 0.6, y0: 0, y1: 0.6, xt: [0, 0.2, 0.4, 0.6], yt: [0.2, 0.4, 0.6] });
  o += text(sx(0.6), sy(0) + 32, 'u' + sub('R') + '：切进去多少', 'ts', 'end');
  o += text(sx(0) + 6, sy(0.6) - 6, '−u' + sub('H') + '：减速多少', 'ts', 'start');
  o += line(sx(brR(0)), sy(0), sx(brR(-0.6)), sy(0.6), 'ink');
  o += line(sx(0), sy(0), sx(0.6), sy(0.6), 'ink');
  o += text(sx(brR(-0.6)) - 14, sy(0.55), 'robot 的', 'ts', 'end') + text(sx(brR(-0.6)) - 14, sy(0.55) + 14, 'best response', 'ts', 'end');
  o += text(sx(0.5), 128, 'human 的', 'ts', 'start') + text(sx(0.5), 142, 'best response', 'ts', 'start');
  o += circle(sx(0.5), sy(0.5), 6, 'paper') + text(sx(0.5) + 10, sy(0.5) + 20, 'Stackelberg', 'ts', 'start');
  o += path(d(st.map(([a, b]) => [sx(a), sy(-b)])), 'mute');
  const pathAt = (k) => d(st.map((p, j) => (j <= k ? p : st[k])).map(([a, b]) => [sx(a), sy(-b)]));
  o += apath(s.map((k) => pathAt(k)), kt, T, 'ln');
  o += acircle(S.map((p) => sx(p[0])), S.map((p) => sy(-p[1])), kt, T, 4.5, 'ln-f');
  o += text(sx(uN) + 10, sy(uN) + 18, 'Nash', 'tl', 'start');
  const U = (t) => t.replace(/u_R/g, 'u' + sub('R')).replace(/u_H/g, 'u' + sub('H'));
  const say = (k) => {
    const [a, b] = st[k];
    if (k === 0) return 'robot 以为人不动（u_H = 0），切进去 0.2';
    if (k === n - 1) return '收到 Nash：u_R = 2/7 ≈ 0.286，robot 得 0.163；Stackelberg 是 0.5，得 0.200';
    if (k % 2 === 1) return `人对 u_R = ${a.toFixed(4)} 做 best response：u_H = −u_R = ${b.toFixed(4)}`;
    return `robot 对 u_H = ${st[k - 1][1].toFixed(4)} 做 best response：u_R = 0.2 − 0.3u_H = ${a.toFixed(4)}`;
  };
  for (let k = 0; k < n; k++) o += gshow(s.map((j) => j === k), kt, T, text(280, 280, U(say(k)), 't', 'middle'));
  o += text(280, 298, '每一轮离 2/7 的距离乘 0.3', 'ts', 'middle');
  return svgA(560, 304, o, '动图：左边是两条 lane，robot 车 R 往下切，后面的 human 车 H 减速；右边横轴是 u_R，纵轴是减速的大小，两条 best response line，折线是每一轮重新 plan 的轨迹，从 0.2 收到 Nash 2/7，Stackelberg 点 (0.5, 0.5) 在 human 的 line 上');
}

export default {
  'thread-equilibrium-cloth': clothA,
  'thread-equilibrium-brdyn': brdynA,
  'thread-equilibrium-bargain': bargainA,
  'thread-equilibrium-vcg': vcgA,
  'thread-equilibrium-selfish': selfishS,
  'thread-equilibrium-amm': ammA,
  'thread-equilibrium-merge': mergeA,
};
