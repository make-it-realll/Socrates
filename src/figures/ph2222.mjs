import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 一个带标题和若干行小字的卡片
function box(x, y, w, h, title, lines = [], cls = 'paper') {
  let o = rect(x, y, w, h, cls, 6) + text(x + 12, y + 20, title, 'tb');
  lines.forEach((s, i) => { o += text(x + 12, y + 38 + i * 16, s, 'ts'); });
  return o;
}

// Elenchus 的结构：Euthyphro 7a–8a
function elenchus() {
  let o = '';
  o += box(20, 14, 236, 48, 'P　target thesis', ['Pious = dear to the gods（7a）'], 'wash ink-s');
  o += box(304, 14, 236, 48, 'Q　agreed premise', ['The gods quarrel（7b）']);
  o += box(304, 76, 236, 48, 'R　agreed premise', ['争的是 just 与 unjust，各爱各的（7d–e）']);
  o += box(304, 196, 236, 48, 'S　agreed premise', ['Pious 与 impious 是 opposites（7a）']);
  o += box(20, 106, 236, 48, '由 Q、R', ['同一件事既 god-loved 又 god-hated（8a）']);
  o += box(20, 196, 236, 48, '再用 P', ['同一件事既 pious 又 impious（8a）']);
  // Q、R → 中间结论
  o += arrow(304, 38, 258, 118, 'ink') + arrow(304, 100, 258, 132, 'ink');
  // P → “再用 P”（从左侧绕下去），中间结论 → “再用 P”
  o += path(d([[20, 38], [8, 38], [8, 220], [16, 220]]), 'ink') + poly([[20, 220], [13, 216.5], [13, 223.5]], 'ink-f');
  o += arrow(138, 154, 138, 194, 'ink');
  // “再用 P”与 S 相撞
  o += line(258, 220, 302, 220, 'ln');
  o += text(280, 211, '冲突', 'tl', 'middle');
  o += text(280, 272, 'Elenchus 证明的是：P、Q、R、S 不能同时为 true。Logic 不指定该放弃哪一个。', 't', 'middle');
  o += text(280, 292, 'Euthyphro 放弃了 P（9d 改成“all the gods”）；他同样可以放弃 Q。', 'ts', 'middle');
  return svg(560, 304, o, 'Elenchus 的结构：对方提出 thesis P，又同意 premise Q、R、S，由 Q 和 R 推出同一件事既被 gods 爱又被 gods 恨，再用 P 推出同一件事既 pious 又 impious，与 S 冲突');
}

// Euthyphro dilemma 的两个 horn：explanation 的方向相反
function horns() {
  let o = '';
  const panel = (x0, title, top, bottom, notes, hl) => {
    o += text(x0 + 125, 20, title, 'tb', 'middle');
    o += rect(x0 + 25, 34, 200, 38, hl ? 'wash ink-s' : 'paper', 6) + text(x0 + 125, 58, top, 't', 'middle');
    o += arrow(x0 + 125, 74, x0 + 125, 118, 'ln');
    o += text(x0 + 135, 100, 'explains', 'tl');
    o += rect(x0 + 25, 120, 200, 38, hl ? 'paper' : 'wash ink-s', 6) + text(x0 + 125, 144, bottom, 't', 'middle');
    notes.forEach((s, i) => { o += text(x0 + 125, 182 + i * 17, s, 'ts', 'middle'); });
  };
  panel(15, 'Horn 1：loved because pious', 'X is pious', 'all the gods love X',
    ['Gods 的 love 有 reason，', '但 piety 的来源不在 gods 身上；', '“god-loved”只是 pathos，不是 ousia。', 'Euthyphro 在 10d 选了这一边。'], true);
  panel(295, 'Horn 2：pious because loved', 'all the gods love X', 'X is pious',
    ['Piety 完全由 gods 决定，', '但 gods 的 love 背后没有 reason：', '他们爱什么，什么就 pious。', 'Divine command theory 走这一边。'], false);
  o += line(280, 30, 280, 240, 'grid');
  o += text(280, 268, '两边说的是同一批 X：extension 相同，分歧只在哪个 fact 解释哪个 fact。', 't', 'middle');
  return svg(560, 280, o, 'Euthyphro dilemma 的两个 horn：左边是 X pious 解释了 gods 爱 X，右边是 gods 爱 X 解释了 X pious，两者 extension 相同而 explanation 的方向相反');
}

// Crito：两条已同意的 principle，Laws 的三个 argument 各靠哪一条
function crito() {
  let o = '';
  o += box(20, 14, 250, 62, 'A　Never do wrong', ['连 return wrong for wrong 也不行', '（49b–d）'], 'wash ink-s');
  o += box(290, 14, 250, 62, 'B　Keep just agreements', ['同意过的事，只要它 just，就得做', '（49e）'], 'wash ink-s');
  const y = 118, w = 170;
  o += box(20, y, w, 78, '1　Destruction', ['Verdict 被 private person', '作废，city 就站不住', '（50a–b）']);
  o += box(195, y, w, 78, '2　Parent', ['Laws 生养教育了你；', '只能 persuade or obey', '（50d–51c）']);
  o += box(370, y, w, 78, '3　Agreement', ['可以走而不走，', '就是 agreed in deed', '（51c–52e）']);
  o += arrow(105, 78, 105, y - 2, 'ink') + arrow(180, 78, 262, y - 2, 'ink') + arrow(430, 78, 455, y - 2, 'ink');
  o += rect(145, 238, 270, 40, 'paper', 6) + text(280, 263, 'Conclusion：escape is unjust（54c）', 'tb', 'middle');
  o += arrow(105, y + 80, 200, 236, 'ink') + arrow(280, y + 80, 280, 236, 'ink') + arrow(455, y + 80, 360, 236, 'ink');
  o += text(280, 302, 'Argument 1、2 说 escape 是 doing wrong（靠 A），argument 3 说它是 breaking an agreement（靠 B）。', 'ts', 'middle');
  return svg(560, 314, o, 'Crito 的 argument 结构：两条 Crito 已经同意的 principle，Laws 的三个 argument 分别依靠其中一条，共同得出 escape 是 unjust');
}

// Meno 82b–85b：doubling the square
function square() {
  const u = 26; // 每 foot 的像素
  let o = '';
  const grid = (x0, y0, n) => {
    let g = '';
    for (let i = 0; i <= n; i++) g += line(x0 + i * u, y0, x0 + i * u, y0 + n * u, 'grid') + line(x0, y0 + i * u, x0 + n * u, y0 + i * u, 'grid');
    return g;
  };
  const yb = 150; // 三个 panel 的底边
  // Panel 1：side 4
  let x0 = 28, n = 4, y0 = yb - n * u;
  o += rect(x0, yb - 2 * u, 2 * u, 2 * u, 'wash') + grid(x0, y0, n) + rect(x0, y0, n * u, n * u, 'ink') + rect(x0, yb - 2 * u, 2 * u, 2 * u, 'ink');
  o += text(x0 + n * u / 2, yb + 18, 'side 4', 't', 'middle') + text(x0 + n * u / 2, 26, '第一次回答（82e）', 'tb', 'middle');
  o += text(x0 + n * u / 2, yb + 38, 'area 4 × 4 = 16', 't', 'middle') + text(x0 + n * u / 2, yb + 56, '是原来的 4 倍', 'ts', 'middle');
  // Panel 2：side 3
  x0 = 208; n = 3; y0 = yb - n * u;
  o += rect(x0, yb - 2 * u, 2 * u, 2 * u, 'wash') + grid(x0, y0, n) + rect(x0, y0, n * u, n * u, 'ink') + rect(x0, yb - 2 * u, 2 * u, 2 * u, 'ink');
  o += text(x0 + n * u / 2, yb + 18, 'side 3', 't', 'middle') + text(x0 + n * u / 2, 26, '第二次回答（83e）', 'tb', 'middle');
  o += text(x0 + n * u / 2, yb + 38, 'area 3 × 3 = 9', 't', 'middle') + text(x0 + n * u / 2, yb + 56, '比 8 多 1', 'ts', 'middle');
  // Panel 3：diagonal
  x0 = 400; n = 4; y0 = yb - n * u;
  const P = (i, j) => [x0 + i * u, yb - j * u];
  o += poly([P(2, 0), P(4, 2), P(2, 4), P(0, 2)], 'wash') + rect(x0, yb - 2 * u, 2 * u, 2 * u, 'wash2') + grid(x0, y0, n) + rect(x0, y0, n * u, n * u, 'ink');
  o += line(x0 + 2 * u, y0, x0 + 2 * u, yb, 'ink') + line(x0, yb - 2 * u, x0 + 4 * u, yb - 2 * u, 'ink');
  o += path(d([P(2, 0), P(4, 2), P(2, 4), P(0, 2)]) + 'Z', 'ln');
  o += text(x0 + n * u / 2, 26, 'Diagonal（84d–85b）', 'tb', 'middle');
  o += text(x0 + n * u / 2, yb + 18, '4 个 half-square', 't', 'middle') + text(x0 + n * u / 2, yb + 38, 'area 4 × 2 = 8', 't', 'middle') + text(x0 + n * u / 2, yb + 56, 'side = √8 ≈ 2.83', 'ts', 'middle');
  o += text(280, 232, '每个小格是 1 square foot；左下角 2 × 2 的那一块是原来的 square（area 4）。', 'ts', 'middle');
  o += text(280, 249, '右图彩线围住的是 square on the diagonal。', 'ts', 'middle');
  return svg(560, 260, o, 'Doubling the square 的三步：side 取 4 得 area 16，side 取 3 得 area 9，以原 square 的 diagonal 为 side 得 area 8');
}

// Phaedo 的四个 argument 各自（如果 sound）覆盖哪一段时间
function phaedo() {
  const X0 = 270, X1 = 360, X2 = 450, X3 = 540;
  let o = '';
  o += text((X0 + X1) / 2, 22, 'before birth', 'tb', 'middle') + text((X1 + X2) / 2, 22, 'this life', 'tb', 'middle') + text((X2 + X3) / 2, 22, 'after death', 'tb', 'middle');
  const rows = [
    ['Cyclical argument', '70c–72e', true, 'solid', '循环的是不是 soul？'],
    ['Recollection argument', '72e–77a', true, null, 'Cebes：只证了一半（77c）'],
    ['Affinity argument', '78b–80b', false, 'wash-strong', '结论是“or nearly so”（80b）'],
    ['Final argument', '102b–107a', true, 'solid', 'deathless ⇒ imperishable？'],
  ];
  rows.forEach(([name, ref, before, after, note], i) => {
    const y = 38 + i * 52;
    o += text(20, y + 16, name, 'tb') + text(20, y + 33, ref + '　' + note, 'ts');
    o += rect(X0, y, X3 - X0, 26, 'frame');
    o += rect(X1, y, X2 - X1, 26, 'wash2');
    if (before) o += rect(X0, y, X1 - X0, 26, 'solid');
    if (after) o += rect(X2, y, X3 - X2, 26, after);
    o += line(X1, y - 4, X1, y + 30, 'axis') + line(X2, y - 4, X2, y + 30, 'axis');
  });
  o += text(280, 262, '实心：这个 argument 如果 sound，就证明 soul 在这一段存在。浅色：只得到“很可能”。空白：没有涉及。', 'ts', 'middle');
  return svg(560, 274, o, 'Phaedo 四个 argument 各自声称证明 soul 在哪一段时间存在：cyclical argument 覆盖出生前和死后，recollection argument 只覆盖出生前，affinity argument 只给出死后的可能性，final argument 覆盖全部');
}

// Republic IV：city 的三个 class 对 soul 的三个 part
function soul() {
  let o = '';
  const rows = [
    ['Rulers（guardians）', 'Reason', 'learning、wisdom', 'wisdom', '428b–429a；442c'],
    ['Auxiliaries', 'Spirit', 'honor、victory', 'courage', '429a–430c；442b'],
    ['Producers', 'Appetite', 'food、drink、sex、money', '', ''],
  ];
  o += text(105, 20, 'City', 'tb', 'middle') + text(455, 20, 'Soul（每个 part 爱什么）', 'tb', 'middle') + text(280, 20, 'Virtue 落在哪里', 'ts', 'middle');
  rows.forEach(([c, s, loves, v, ref], i) => {
    const y = 32 + i * 58;
    o += rect(20, y, 170, 46, i === 0 ? 'wash ink-s' : 'paper', 6) + text(105, y + 28, c, 't', 'middle');
    o += rect(370, y, 170, 46, i === 0 ? 'wash ink-s' : 'paper', 6) + text(455, y + 21, s, 'tb', 'middle') + text(455, y + 37, loves, 'ts', 'middle');
    if (v) {
      o += line(192, y + 23, 232, y + 23, 'mute') + line(328, y + 23, 368, y + 23, 'mute');
      o += text(280, y + 21, v, 'tl', 'middle') + text(280, y + 37, ref, 'ts', 'middle');
    }
  });
  // temperance 与 justice 是整体的性质
  const yb = 32 + 3 * 58 + 6;
  o += path(d([[20, yb], [20, yb + 8], [540, yb + 8], [540, yb]]), 'ink');
  o += text(280, yb + 28, 'Temperance：三个 part 对“谁该 rule”意见一致（431e–432a；442c–d）', 't', 'middle');
  o += text(280, yb + 48, 'Justice：每个 part 做自己的 work，不去干别的 part 的事（433a–b；441d–e）', 't', 'middle');
  o += text(280, yb + 72, 'Wisdom 和 courage 各住在一个 part 里；temperance 和 justice 说的是三个 part 之间的关系。', 'ts', 'middle');
  return svg(560, yb + 84, o, 'City 的三个 class 与 soul 的三个 part 一一对应：rulers 对 reason，auxiliaries 对 spirit，producers 对 appetite；wisdom 和 courage 各在一个 part，temperance 和 justice 是三个 part 之间的关系');
}

// Divided Line：取 ratio 2 : 1、总长 9，四段是 4、2、2、1
function divline() {
  const r = 2, L = 9;
  const A = (r * r * L) / (1 + r) ** 2, B = (r * L) / (1 + r) ** 2, C = B, D = L / (1 + r) ** 2;
  const s = 30, top = 40, x = 150;
  const yA = top, yB = yA + A * s, yC = yB + B * s, yD = yC + C * s, yE = yD + D * s;
  let o = '';
  o += rect(x - 9, yA, 18, A * s, 'solid') + rect(x - 9, yB, 18, B * s, 'wash-strong') + rect(x - 9, yC, 18, C * s, 'wash2') + rect(x - 9, yD, 18, D * s, 'wash2');
  o += rect(x - 9, yA, 18, L * s, 'ink');
  for (const y of [yB, yD]) o += line(x - 9, y, x + 9, y, 'ink');
  o += line(x - 16, yC, x + 16, yC, 'ink-b');
  // 左侧：两大段
  const brace = (y0, y1, t1, t2) => {
    o += path(d([[x - 26, y0 + 2], [x - 34, y0 + 2], [x - 34, y1 - 2], [x - 26, y1 - 2]]), 'mute');
    o += text(x - 42, (y0 + y1) / 2 - 3, t1, 'tb', 'end') + text(x - 42, (y0 + y1) / 2 + 14, t2, 'ts', 'end');
  };
  brace(yA, yC, 'Intelligible', `长 ${A + B}`);
  brace(yC, yE, 'Visible', `长 ${C + D}`);
  // 右侧：四段
  const row = (y0, y1, len, state, obj, ref) => {
    const m = (y0 + y1) / 2;
    o += line(x + 12, m, x + 34, m, 'mute');
    o += text(x + 42, m + 4, String(len), 'tb');
    o += text(x + 66, m - 3, state, 't') + text(x + 66, m + 13, obj + '　' + ref, 'ts');
  };
  row(yA, yB, A, 'Noesis（intellection）', 'Forms；上到 unhypothetical first principle', '511b–c');
  row(yB, yC, B, 'Dianoia（understanding）', '用 visible figure 作 image，从 hypothesis 往下推', '510b–511a');
  row(yC, yD, C, 'Pistis（belief）', 'animals、plants、artifacts', '510a');
  row(yD, yE, D, 'Eikasia（conjecture）', 'shadows、reflections', '509e–510a');
  o += text(x + 58, 26, '长度', 'ts', 'end') + text(x + 66, 26, 'state of the soul，下面是它的 object', 'ts');
  o += text(280, yE + 30, `(${A} + ${B}) : (${C} + ${D}) = ${A} : ${B} = ${C} : ${D} = ${r} : 1。不论 ratio 取多少，中间两段总是一样长。`, 't', 'middle');
  return svg(560, yE + 44, o, 'Divided Line：一条 line 按 2 比 1 分成 intelligible 和 visible 两段，每段再按同样的 ratio 分，得到长度为 4、2、2、1 的四段，分别对应 noesis、dianoia、pistis、eikasia');
}

// Cave 的侧视示意，标上与 Line 四段的对应
function cave() {
  let o = '';
  // 洞穴轮廓：地面、上坡、洞外地面；洞顶
  o += path(d([[30, 60], [30, 215], [330, 215], [330, 175], [470, 92], [548, 92]]), 'ink-b');
  o += path(d([[30, 60], [180, 44], [330, 70], [440, 44]]), 'ink');
  // 墙上的 shadows
  o += rect(31, 100, 8, 80, 'wash2');
  for (const y of [112, 136, 160]) o += rect(33, y, 4, 12, 'solid2');
  // prisoners：面朝左，被链子拴住
  for (const x of [112, 132]) o += circle(x, 178, 6, 'ink-f') + line(x, 184, x, 213, 'ink-b');
  o += line(100, 196, 144, 196, 'dash');
  // 矮墙与举着的 statues
  o += rect(196, 170, 8, 45, 'solid2');
  o += rect(187, 148, 8, 14, 'wash-strong') + circle(209, 152, 5, 'wash-strong') + line(191, 162, 191, 170, 'mute') + line(209, 157, 209, 170, 'mute');
  // fire
  o += poly([[262, 215], [272, 182], [279, 200], [286, 176], [296, 215]], 'solid');
  // 上坡
  o += arrow(338, 160, 452, 93, 'ln');
  // 洞外：water、一棵树、sun
  o += rect(476, 87, 26, 5, 'wash-strong');
  o += line(528, 92, 528, 72, 'ink-b') + circle(528, 64, 9, 'wash-strong');
  o += circle(498, 26, 11, 'solid');
  const tag = (x, y, n) => circle(x, y, 9, 'paper') + text(x, y + 4.5, String(n), 'tb', 'middle');
  o += tag(58, 140, 1) + tag(200, 128, 2) + tag(279, 158, 2) + tag(489, 110, 3) + tag(541, 38, 4);
  o += text(122, 236, 'prisoners', 'ts', 'middle') + text(200, 236, 'low wall', 'ts', 'middle') + text(279, 236, 'fire', 'ts', 'middle');
  o += text(420, 172, 'steep ascent', 'ts') + text(35, 92, 'shadows', 'ts');
  // 图例
  const leg = (y, n, a, b) => { o += tag(34, y - 4, n) + text(54, y, a, 'tl') + text(132, y, b, 't'); };
  leg(268, 1, 'Eikasia', 'Wall 上的 shadows（515a–c）');
  leg(292, 2, 'Pistis', '举着的 statues，和照亮它们的 fire（514b–515a）');
  leg(316, 3, 'Dianoia', '洞外的 shadows 和 water 里的 reflections（516a）');
  leg(340, 4, 'Noesis', '洞外的 things themselves；最后看到的 sun 是 the Good（516b）');
  o += text(280, 368, 'Socrates 自己的解说只有三条（517b）：prison 是 visible realm，fire 是 sun，', 'ts', 'middle');
  o += text(280, 385, 'ascent 是 soul 上到 intelligible realm。把四个阶段逐一配到 Line 的四段是后人的读法。', 'ts', 'middle');
  return svg(560, 396, o, 'Cave 的侧视示意：prisoners 面对洞壁看 shadows，身后是矮墙上举着的 statues 和 fire，再往后是通向洞外的陡坡，洞外有 reflections、实物和 sun；四个阶段标上了与 Divided Line 四段的通常对应');
}

export default {
  'ph2222-elenchus': elenchus,
  'ph2222-horns': horns,
  'ph2222-crito': crito,
  'ph2222-square': square,
  'ph2222-phaedo': phaedo,
  'ph2222-soul': soul,
  'ph2222-line': divline,
  'ph2222-cave': cave,
};
