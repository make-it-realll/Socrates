import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, f1 } from '../lib/svg.mjs';

// 带标题、若干行小字和若干行 objection（主题色）的卡片
function box(x, y, w, h, title, lines = [], cls = 'paper', obj = []) {
  let o = rect(x, y, w, h, cls, 6) + text(x + 10, y + 19, title, 'tb');
  lines.forEach((s, i) => { o += text(x + 10, y + 37 + i * 16, s, 'ts'); });
  obj.forEach((s, i) => { o += text(x + 10, y + 37 + (lines.length + i) * 16, s, 'ts tl'); });
  return o;
}

// 离散显示：ivs 是若干 [开始, 结束) 秒，T 是总时长；第一帧（t = 0）的状态同时写进静态属性
function vis(ivs, T) {
  const on = (t) => ivs.some(([a, b]) => t >= a - 1e-9 && t < b - 1e-9);
  const pts = [...new Set([0, ...ivs.flat().filter((t) => t > 1e-9 && t < T - 1e-9)])].sort((a, b) => a - b);
  const kt = pts.map((t) => t / T), vals = pts.map((t) => (on(t) ? 1 : 0));
  kt.push(1); vals.push(vals[vals.length - 1]);
  return { first: on(0) ? 1 : 0, a: anim('opacity', vals, kt, T, true) };
}
const gshow = (ivs, T, body) => { const v = vis(ivs, T); return `<g opacity="${v.first}">${body}${v.a}</g>`; };

// ---------- 开头：同一个 action，moral evaluation 放在哪一格 ----------
function chain() {
  let o = '';
  const W = 122, G = 24, Y = 96, H = 52;
  const nodes = [['Character', 'stable hexis'], ['Maxim', 'agent 的 principle'], ['Action', '实际做了什么'], ['Consequences', '受影响者的得失']];
  nodes.forEach(([t, s], i) => {
    const x = i * (W + G);
    o += rect(x, Y, W, H, i === 2 ? 'paper' : 'wash ink-s', 6) + text(x + W / 2, Y + 22, t, 'tb', 'middle') + text(x + W / 2, Y + 40, s, 'ts', 'middle');
    if (i < 3) o += arrow(x + W + 2, Y + H / 2, x + W + G - 2, Y + H / 2, 'ink');
  });
  const who = [
    [0, ['Aristotle', '384–322 BC', 'Nicomachean Ethics', '第 1、2 站']],
    [1, ['Kant', '1724–1804', 'Groundwork 1785', '第 4、5 站']],
    [3, ['Mill', '1806–1873', 'Utilitarianism 1863', '第 6 站']],
  ];
  for (const [i, ls] of who) {
    const cx = i * (W + G) + W / 2;
    o += line(cx, Y + H + 4, cx, Y + H + 16, 'mute');
    ls.forEach((s, k) => { o += text(cx, Y + H + 34 + k * 17, s, k ? 'ts' : 'tb', 'middle'); });
  }
  const cx2 = 2 * (W + G) + W / 2;
  o += text(cx2, Y + H + 34, '四个人对这一格', 'ts', 'middle') + text(cx2, Y + H + 51, '的描述没有分歧', 'ts', 'middle');
  // Hume：spectator 看 character
  o += rect(30, 6, 196, 46, 'paper', 6) + text(128, 25, 'Spectator', 'tb', 'middle') + text(128, 42, '从 common point of view 看', 'ts', 'middle');
  o += path(d([[80, 54], [62, 92]]), 'dash') + poly([[61, 95], [58.5, 86], [65.5, 88.5]], 'ink-f');
  o += text(80, 78, 'approval', 'ts', 'start');
  o += text(244, 25, 'Hume　1711–1776', 'tb') + text(244, 42, 'Treatise 1739–40，第 3 站', 'ts');
  return svg(560, 240, o, '一个 action 从 character 到 maxim 到 action 本身再到 consequences 的链条：Aristotle 评价 character，Kant 评价 maxim，Mill 评价 consequences，Hume 看的是 spectator 看到 character 时的 approval');
}

// ---------- 第 1 站：function argument 的 argument map ----------
function ergon() {
  let o = '';
  const w = 132, h = 112, y = 8;
  o += box(0, y, w, h, 'P1', ['X 有 function，', 'X 的 good 就在于', '把 function 做好'], 'paper', ['C：good X ≠', 'good for X']);
  o += box(140, y, w, h, 'P2', ['function 做得好', '= 依照 X 的', 'virtue 去做', 'lyre-player、knife']);
  o += box(288, y, w, h, 'P3', ['Human 有 function', 'carpenter 有，', 'eye、hand 也有'], 'paper', ['A：谁给的？']);
  o += box(428, y, w, h, 'P4', ['Human 的 function', '是它特有的 activity', '排除 plants、animals'], 'paper', ['B：特有 = best？']);
  const yL = 150, hL = 70;
  o += box(20, yL, 232, hL, 'L（由 P1、P2）', ['X 的 good =', '依照 virtue 做好 function']);
  o += box(308, yL, 232, hL, 'C1（由 P3、P4）', ['Human 的 function =', 'soul 依照 reason 的 activity']);
  o += arrow(66, y + h + 2, 110, yL - 2, 'ink') + arrow(206, y + h + 2, 162, yL - 2, 'ink');
  o += arrow(354, y + h + 2, 398, yL - 2, 'ink') + arrow(494, y + h + 2, 450, yL - 2, 'ink');
  const yC = 262;
  o += box(110, yC, 340, 72, 'C2　Human good（I.7）', ['activity of soul in accordance with virtue，', 'in a complete life（1098a16–18）'], 'wash ink-s');
  o += arrow(136, yL + hL + 2, 220, yC - 2, 'ink') + arrow(424, yL + hL + 2, 340, yC - 2, 'ink');
  return svg(560, 334, o, 'Function argument 的 argument map：P1、P2 推出 L，P3、P4 推出 C1，L 和 C1 推出 C2；三个 objection 分别打在 P3、P4 和 P1 上');
}

// ---------- 第 2 站：Milo，mean relative to us ----------
function milo() {
  const sx = lin(0, 12, 36, 524);
  const lo = 2, hi = 10, mid = (lo + hi) / 2;
  let o = line(sx(0), 92, sx(12), 92, 'axis');
  for (let v = 0; v <= 12; v += 2) o += line(sx(v), 88, sx(v), 96, 'axis') + text(sx(v), 112, String(v), 'ts', 'middle');
  o += text(sx(12), 130, 'pounds of food', 'ts', 'end');
  o += circle(sx(lo), 92, 5, 'ink-f') + circle(sx(hi), 92, 5, 'ink-f') + circle(sx(mid), 92, 5, 'ln-f');
  o += text(sx(lo), 72, lo + '：too little', 't', 'middle') + text(sx(hi), 72, hi + '：too much', 't', 'middle');
  o += text(sx(mid), 72, 'arithmetic mean ' + mid, 'tl', 'middle');
  // 两段等距
  const br = (a, b, y) => line(sx(a) + 6, y, sx(b) - 6, y, 'mute') + line(sx(a) + 6, y - 4, sx(a) + 6, y + 4, 'mute') + line(sx(b) - 6, y - 4, sx(b) - 6, y + 4, 'mute') + text((sx(a) + sx(b)) / 2, y - 6, String(b - a), 'ts', 'middle');
  o += br(lo, mid, 40) + br(mid, hi, 40);
  o += text(sx(lo), 24, '6 − 2 与 10 − 6 相等，这是“对于 object 的 mean”', 'ts', 'start');
  // 两个人的 mean relative to us
  const row = (y, a, b, name, inner, note) => text(sx(0), y + 4, name, 'tb', 'start') + rect(sx(a), y - 10, sx(b) - sx(a), 20, 'wash', 4) + text((sx(a) + sx(b)) / 2, y + 4, inner, 'ts', 'middle') + text(sx(b) + 12, y + 4, note, 'ts', 'start');
  o += row(160, lo, mid, 'Beginner', 'mean 在 6 以下', '6 对他 too much');
  o += row(196, mid, hi, 'Milo', 'mean 在 6 以上', '6 对他 too little');
  o += line(sx(mid), 140, sx(mid), 212, 'dash');
  o += text(280, 236, '浅色带只表示“在 6 的哪一边”，Aristotle 没有给两人的具体数字（II.6）', 'ts', 'middle');
  return svg(560, 244, o, 'Milo 的例子：10 磅太多、2 磅太少，arithmetic mean 是 6；但 6 对 beginner 太多、对 wrestler Milo 太少，mean relative to us 因人而异');
}

// ---------- 第 2 站：两个 vice 之间的 virtue；哪个 extreme 更 opposed ----------
function mean() {
  let o = '';
  const x0 = 120, x1 = 440;
  const scale = (y, title, left, right, t, name, hotLeft, pull) => {
    const xm = x0 + (x1 - x0) * t;
    let q = text(x0, y - 44, title, 'tb');
    q += line(x0, y, x1, y, 'axis') + line(x0, y - 5, x0, y + 5, 'axis') + line(x1, y - 5, x1, y + 5, 'axis');
    q += text(x0 - 10, y + 4, left, hotLeft ? 'tl' : 't', 'end') + text(x1 + 10, y + 4, right, hotLeft ? 't' : 'tl', 'start');
    q += text(hotLeft ? x0 - 10 : x1 + 10, y + 21, '更 opposed', 'ts', hotLeft ? 'end' : 'start');
    q += circle(xm, y, 6, 'ln-f') + text(xm, y + 22, name, 'tl', 'middle');
    q += text(x0, y + 21, 'deficiency', 'ts', 'start') + text(x1, y + 21, 'excess', 'ts', 'end');
    q += arrow(xm, y - 12, xm + pull * 46, y - 12, 'ink', 6);
    q += text(xm + pull * 23, y - 20, '瞄准时往这边偏', 'ts', 'middle');
    return q;
  };
  o += scale(72, 'Fear 与 confidence', 'cowardice', 'rashness', 0.62, 'courage', true, 1);
  o += scale(178, 'Bodily pleasures', 'insensibility', 'self-indulgence', 0.36, 'temperance', false, -1);
  o += text(x0, 240, 'Adultery、theft、murder', 'tb');
  o += text(x0, 258, '没有这样一条 scale：simply to do any of them is to go wrong（II.6）', 'ts');
  return svg(560, 266, o, '两条 scale：courage 在 cowardice 与 rashness 之间，更靠近 rashness，cowardice 与它更 opposed；temperance 在 insensibility 与 self-indulgence 之间，更靠近 insensibility；adultery、theft、murder 没有 mean');
}

// ---------- 第 3 站：Hume 的 influence argument ----------
function hume() {
  let o = '';
  const w = 176, h = 74;
  o += box(0, 8, w, h, 'P1　两种 reasoning', ['demonstrative：ideas', 'probable：cause & effect']);
  o += box(192, 8, w, h, 'P2　Demonstrative', ['只通过 causal judgment', '影响 action']);
  o += box(384, 8, w, h, 'P3　Causal reasoning', ['只替已有的 passion', '指出 object 和 means']);
  o += box(40, 122, 270, 76, 'C1　Reason alone 不能 motivate', ['T 2.3.3：reason 是 passions 的 slave'], 'paper', ['Kant 否认：pure practical reason']);
  o += box(340, 122, 220, 76, 'P5　Morals 能 motivate', ['produce or prevent actions', '（T 3.1.1.6）'], 'paper', ['Externalist 否认']);
  o += arrow(88, 84, 140, 120, 'ink') + arrow(280, 84, 190, 120, 'ink') + arrow(472, 84, 250, 120, 'ink');
  o += box(130, 262, 300, 56, 'C3　Moral distinctions', ['不是 reason alone 的 conclusion（T 3.1.1.6）'], 'wash ink-s');
  o += arrow(175, 200, 240, 260, 'ink') + arrow(450, 200, 330, 260, 'ink');
  o += text(18, 232, '这一步：bridge 反例', 'ts tl') + text(18, 248, '（见正文）', 'ts');
  return svg(560, 320, o, 'Hume 的 influence argument：P1、P2、P3 推出 C1，reason alone 不能 motivate；加上 P5，morals 能 motivate，推出 C3，moral distinctions 不来自 reason；objection 分别打在 C1、P5 和最后一步推理上');
}

// ---------- 第 4 站：universalizability test，Kant 的四个例子依次走一遍 ----------
function fulA() {
  const maxims = [
    { m: ['Life 再延续下去，evil 多于', 'satisfaction 时，出于 self-love 缩短它'], s3: '用 self-love 毁掉 life：作为 nature 自相矛盾', s4: null, v: 0 },
    { m: ['缺钱时就借钱并承诺归还，', '尽管知道自己还不了'], s3: '人人如此，promise 就没人信：conceive 不了', s4: null, v: 0 },
    { m: ['有 talent 也不去发展，', '宁可图安逸'], s3: '人人如此的 world 可以 conceive', s4: 'rational being 必然 will 自己的 faculties 发展', v: 1 },
    { m: ['自己过得好，', '别人有难一概不帮'], s3: '人人如此的 world 可以 conceive', s4: '我会需要别人帮：这样 will 就自相矛盾', v: 1 },
    { m: ['为了 health，', '每天早上跑步'], s3: 'conceive 得了', s4: 'will 得了', v: 2 },
  ];
  const lead = 2.2, st = 1.0, hold = 1.6;
  const plan = []; let t = lead;
  for (const q of maxims) {
    const p = { q, t0: t, s2: t + st, s3: t + 2 * st };
    if (q.v === 0) { p.end = t + 3 * st; p.out = t + 3 * st + hold; }
    else { p.s4 = t + 3 * st; p.end = t + 4 * st; p.out = t + 4 * st + hold; }
    plan.push(p); t = p.out;
  }
  const T = t;
  let o = '';
  // 步骤框
  const SX = 0, SW = 220, SH = 42, ys = [8, 70, 150, 230];
  const steps = ['Step 1　写出 maxim', 'Step 2　当作 universal law of nature', 'Step 3　能 conceive 吗？', 'Step 4　能 will 吗？'];
  const hiStep = [plan.map((p) => [p.t0, p.s2]), plan.map((p) => [p.s2, p.s3]), plan.map((p) => [p.s3, p.s4 ?? p.end]), plan.filter((p) => p.s4).map((p) => [p.s4, p.end])];
  steps.forEach((s, i) => {
    o += rect(SX, ys[i], SW, SH, 'paper', 6);
    o += gshow(hiStep[i], T, rect(SX, ys[i], SW, SH, 'wash-strong', 6));
    o += text(SX + 10, ys[i] + 26, s, 't');
  });
  o += arrow(110, ys[0] + SH + 1, 110, ys[1] - 2, 'ink') + arrow(110, ys[1] + SH + 1, 110, ys[2] - 2, 'ink');
  o += arrow(110, ys[2] + SH + 1, 110, ys[3] - 2, 'ink') + text(118, ys[2] + SH + 24, 'yes', 'ts');
  // 结论框
  const VX = 290, VW = 270;
  const verdict = [
    [VX, ys[2] - 4, 'Perfect duty：一律不许', 'Kant 的例子：suicide、false promise'],
    [VX, ys[3] - 4, 'Imperfect duty：不许一概不做', 'Kant 的例子：talents、beneficence'],
    [0, 312, 'Permissible', '例：每天早上跑步'],
  ];
  verdict.forEach(([x, y, a, b], k) => {
    const w = k === 2 ? SW : VW;
    o += rect(x, y, w, 50, 'paper', 6);
    o += gshow(plan.filter((p) => p.q.v === k).map((p) => [p.end, p.out]), T, rect(x, y, w, 50, 'wash-strong', 6));
    o += text(x + 10, y + 21, a, 'tb') + text(x + 10, y + 39, b, 'ts');
  });
  o += arrow(SW + 2, ys[2] + SH / 2, VX - 2, ys[2] + SH / 2, 'ink') + text((SW + VX) / 2, ys[2] + SH / 2 - 6, 'no', 'ts', 'middle');
  o += arrow(SW + 2, ys[3] + SH / 2, VX - 2, ys[3] + SH / 2, 'ink') + text((SW + VX) / 2, ys[3] + SH / 2 - 6, 'no', 'ts', 'middle');
  o += arrow(110, ys[3] + SH + 1, 110, 310, 'ink') + text(118, ys[3] + SH + 24, 'yes', 'ts');
  // 右上：当前 maxim 和它在 step 3、4 的回答
  const CX = 244, CY = 8;
  o += rect(CX, CY, 316, 126, 'frame', 6);
  o += gshow([[0, lead]], T, text(CX + 12, CY + 24, 'Kant 自己的四个例子（Groundwork II）', 'tb') + text(CX + 12, CY + 44, '加一个 permissible 的 maxim，', 'ts') + text(CX + 12, CY + 61, '依次走一遍流程。', 'ts') + text(CX + 12, CY + 86, '前两个停在 step 3，后两个停在 step 4。', 'ts'));
  for (const p of plan) {
    const { q } = p;
    o += gshow([[p.t0, p.out]], T, text(CX + 12, CY + 22, 'Maxim', 'ts tl') + text(CX + 12, CY + 40, q.m[0], 't') + text(CX + 12, CY + 57, q.m[1], 't'));
    o += gshow([[p.s3, p.out]], T, text(CX + 12, CY + 84, 'Step 3：' + q.s3, 'ts'));
    if (q.s4) o += gshow([[p.s4, p.out]], T, text(CX + 12, CY + 104, 'Step 4：' + q.s4, 'ts'));
  }
  return svgA(560, 364, o, '动图：universalizability test 的四步流程。Kant 的 suicide 和 false promise 两个 maxim 在 step 3 失败，得到 perfect duty；talents 和 beneficence 通过 step 3、在 step 4 失败，得到 imperfect duty；每天早上跑步两步都通过，是 permissible');
}

// ---------- 第 5 站：murderer at the door ----------
function door() {
  let o = '';
  // 房子平面：前门在左下，后门在右边
  const X = 20, Y = 40, W = 200, H = 150;
  o += path(d([[X + 50, Y + H], [X, Y + H], [X, Y], [X + W, Y], [X + W, Y + 90]]), 'ink-b');
  o += path(d([[X + W, Y + 126], [X + W, Y + H], [X + 86, Y + H]]), 'ink-b');
  o += text(X + 68, Y + H + 16, 'front door', 'ts', 'middle') + text(X + W + 6, Y + 144, 'back door', 'ts', 'start');
  o += line(X + 110, Y, X + 110, Y + 64, 'ink') + line(X + 110, Y + 64, X + 150, Y + 64, 'ink');
  o += circle(X + 160, Y + 22, 8, 'ln-f') + text(X + 160, Y + 48, 'friend', 'tl', 'middle');
  o += path(d([[X + 169, Y + 24], [X + 188, Y + 30], [X + 188, Y + 108], [X + 244, Y + 108]]), 'ln-dash');
  o += text(X + 216, Y + 66, '也许已经', 'ts', 'start') + text(X + 216, Y + 82, '从后门出去', 'ts', 'start');
  o += circle(X + 68, Y + H - 26, 8, 'paper') + text(X + 68, Y + H - 42, 'you', 'tb', 'middle');
  o += circle(X + 68, Y + H + 40, 8, 'ink-f') + text(X + 84, Y + H + 44, 'murderer：“Is he here?”', 't', 'start');
  o += text(X + 84, Y + H + 62, '他得装成路人，以为你不知道他是谁', 'ts', 'start');
  // 右：Kant 1797 年的两条分支
  const R = 330;
  o += text(R, 22, 'Kant 文中的两条分支', 'tb');
  o += rect(R, 36, 230, 86, 'paper', 6) + text(R + 10, 56, 'Truth：“He is here.”', 't') + text(R + 10, 74, 'Murderer 进屋搜；friend 若已', 'ts') + text(R + 10, 90, '出门，反而碰不上；', 'ts') + text(R + 10, 106, 'neighbors 可能赶来抓住他', 'ts');
  o += rect(R, 134, 230, 70, 'paper', 6) + text(R + 10, 154, 'Lie：“He is not here.”', 't') + text(R + 10, 172, 'Friend 若已从后门出去，', 'ts') + text(R + 10, 188, 'murderer 离开时正好撞上他', 'ts');
  o += arrow(R + 115, 206, R + 115, 228, 'ln');
  o += rect(R, 230, 230, 50, 'wash ink-s', 6) + text(R + 10, 250, 'with justice be accused as', 'ts') + text(R + 10, 266, 'the cause of his death', 'ts');
  return svg(560, 284, o, 'Murderer at the door 的设定：friend 躲在屋里，也许已从后门离开；murderer 在前门问你他在不在。右边是 Kant 文中的两条分支：说真话，murderer 进屋搜，friend 若已出门反而碰不上，邻居可能抓住他；说谎，friend 若已出门，murderer 离开时正好撞上他，Kant 认为说谎的人要负责');
}

// ---------- 第 6 站：competent judges 只数两种都试过的人 ----------
function judges() {
  const both = { pp: 11, pin: 1 }, onlyPin = 30, onlyPoetry = 8;
  const total = both.pp + both.pin + onlyPin + onlyPoetry;
  const votePin = both.pin + onlyPin, votePoetry = both.pp + onlyPoetry;
  let o = '';
  const dots = (x0, y0, n, cols, cls, start = 0) => {
    let q = '';
    for (let k = 0; k < n; k++) { const i = start + k; q += circle(x0 + (i % cols) * 17, y0 + Math.floor(i / cols) * 17, 6, cls); }
    return q;
  };
  // 第一组
  o += rect(0, 6, 172, 128, 'wash ink-s', 6) + text(10, 26, '两种都试过', 'tb') + text(10, 43, 'competent judges', 'ts');
  o += dots(18, 64, both.pp, 6, 'ln-f') + dots(18, 64, both.pin, 6, 'paper', both.pp);
  o += text(10, 114, both.pp + ' 人 prefer poetry（实心）', 'ts') + text(10, 129, both.pin + ' 人 prefer push-pin（空心）', 'ts');
  // 第二组
  o += rect(186, 6, 196, 128, 'paper', 6) + text(196, 26, '只试过 push-pin', 'tb');
  o += dots(206, 46, onlyPin, 10, 'paper');
  o += text(196, 124, onlyPin + ' 人，都说 push-pin 好', 'ts');
  // 第三组
  o += rect(396, 6, 164, 128, 'paper', 6) + text(406, 26, '只试过 poetry', 'tb');
  o += dots(414, 46, onlyPoetry, 6, 'ln-f');
  o += text(406, 124, onlyPoetry + ' 人，都说 poetry 好', 'ts');
  // 两种数法
  o += text(0, 166, '全部 ' + total + ' 人举手：push-pin ' + votePin + '，poetry ' + votePoetry, 't');
  o += text(0, 184, '多数选 push-pin；但 ' + onlyPin + ' 人只知道 their own side of the question', 'ts');
  o += text(0, 212, 'Mill 的 test 只数第一组：poetry ' + both.pp + ' 比 ' + both.pin, 'tl');
  o += text(0, 230, Math.round((100 * both.pp) / (both.pp + both.pin)) + '%，算得上 “all or almost all”，所以 poetry 是 higher quality 的 pleasure', 'ts');
  return svg(560, 238, o, '为本页构造的 50 人：12 人两种都试过，其中 11 人 prefer poetry；30 人只试过 push-pin；8 人只试过 poetry。全体举手 push-pin 31 比 poetry 19，Mill 的 test 只数两种都试过的人，poetry 11 比 1');
}

// ---------- 第 6 站：quantity 加大，三种读法什么时候改判 ----------
function lexA() {
  const A = 2 * 3;                 // poetry：intensity 2 × duration 3 h
  const wq = 5;                    // “quality 只是一个大 weight” 的读法
  const rate = 4, top = 40, start = 12, holdTop = 2, holdZero = 0.8;
  // B(t)：12 → 40（匀速）→ 停 → 跳回 0 → 停 → 0 → 12
  const t1 = (top - start) / rate, t2 = t1 + holdTop, t3 = t2 + holdZero, T = t3 + start / rate;
  const kt = [0, t1 / T, t2 / T, (t2 + 1e-3) / T, t3 / T, 1];
  const Bv = [start, top, top, 0, 0, start];
  const sx = lin(0, 44, 120, 540);
  let o = '';
  // 两根 bar
  o += text(0, 30, 'Poetry 一晚', 'tb') + text(0, 46, 'intensity 2 × 3 h', 'ts');
  o += rect(sx(0), 18, sx(A) - sx(0), 22, 'solid', 3) + text(sx(A) + 8, 34, A + ' units', 'ts');
  o += text(0, 84, 'Push-pin', 'tb') + text(0, 100, '给多少都行', 'ts');
  o += `<rect x="${f1(sx(0))}" y="72" width="${f1(sx(start) - sx(0))}" height="22" rx="3" class="wash-strong">${anim('width', Bv.map((b) => f1(sx(b) - sx(0))), kt, T)}</rect>`;
  o += line(sx(0), 112, sx(44), 112, 'axis');
  for (const v of [0, 10, 20, 30, 40]) o += line(sx(v), 112, sx(v), 116, 'axis') + text(sx(v), 130, String(v), 'ts', 'middle');
  o += text(sx(44), 146, 'push-pin 的 quantity（units）', 'ts', 'end');
  o += line(sx(A), 64, sx(A), 112, 'dash') + line(sx(A * wq), 64, sx(A * wq), 112, 'dash');
  o += text(sx(A) + 4, 62, '= ' + A, 'ts') + text(sx(A * wq) + 4, 62, '= ' + A + ' × ' + wq, 'ts');
  // B(t) 的反函数：B 跨过阈值 c 的时刻
  const cross = (c) => [(c - start) / rate, t3 + c / rate];       // 上升段（c > start）与回升段（c < start）
  const rowY = [186, 220, 254];
  const rows = [['Bentham：只比 quantity', A], ['Quality 是一个 weight（例：× ' + wq + '）', A * wq], ['Mill：not for any quantity', Infinity]];
  rows.forEach(([name, c], i) => {
    const y = rowY[i];
    o += text(0, y, name, i === 2 ? 'tl' : 't');
    // push-pin 胜出的时间段：B > c
    let ivs = [];
    if (Number.isFinite(c)) {
      if (c < start) ivs = [[0, t2 + 1e-3], [cross(c)[1], T]];
      else ivs = [[cross(c)[0], t2 + 1e-3]];
    }
    o += gshow(ivs, T, text(300, y, '→ 选 push-pin', 't'));
    o += gshow(ivs.length ? [[0, T]].flatMap(([a, b]) => { const out = []; let cur = a; for (const [p, q] of ivs) { if (p > cur) out.push([cur, p]); cur = q; } if (cur < b) out.push([cur, b]); return out; }) : [[0, T]], T, text(300, y, '→ 选 poetry', 'tl'));
  });
  return svgA(560, 266, o, '动图：poetry 一晚是 6 个 unit，push-pin 的 quantity 从 12 加到 40。只比 quantity 时 push-pin 超过 6 就胜出；把 quality 当作乘 5 的 weight 时要超过 30；按 Mill 的 not for any quantity，push-pin 给多少都不改判');
}

export default {
  'ph2203-chain': chain,
  'ph2203-ergon': ergon,
  'ph2203-milo': milo,
  'ph2203-mean': mean,
  'ph2203-hume': hume,
  'ph2203-ful': fulA,
  'ph2203-door': door,
  'ph2203-judges': judges,
  'ph2203-lex': lexA,
};
