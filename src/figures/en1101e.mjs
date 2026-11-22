import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, ashow, apath, f1 } from '../lib/svg.mjs';

// 估计文字宽度：13.5px 的 Latin 约 6.6px，12px 约 5.9px，CJK 按字号
const tw = (s, small = false) => {
  let w = 0;
  for (const ch of String(s)) w += /[　-鿿＀-￯]/.test(ch) ? (small ? 12 : 13.5) : (small ? 5.9 : 6.6);
  return w;
};
// 一个元素在 build-up 动图里的显隐：第 0 帧完整显示，随即清空，然后第 i 步出现，一直留到结束
const KT0 = 0.03;
const stepOn = (i, n, a = 0.08, b = 0.8) => a + ((b - a) * i) / n;
const showFrom = (i, n, dur) => ashow([1, 0, 1], [0, KT0, stepOn(i, n)], dur);
// 只在第 i 步（到第 i+1 步之前）显示；第 0 帧显示的是 finalIdx 那一步
const showOnly = (i, n, dur, finalIdx = n - 1) => {
  const on = [i === finalIdx ? 1 : 0, 0, 1, 0];
  const kt = [0, KT0, stepOn(i, n), i === n - 1 ? 0.999 : stepOn(i + 1, n)];
  if (i === n - 1) { on[3] = 1; }
  return ashow(on, kt, dur);
};
const g = (body, extra = '') => `<g>${body}${extra}</g>`;

// ---------- Oedipus：fabula 的顺序和 play 第一次提到的顺序 ----------
const SHORT = ['oracle', 'exposed', 'Corinth', 'Delphi', 'crossroads', 'Sphinx', 'plague'];
const FAB = [
  ['F1', "Laius's oracle"],
  ['F2', 'infant exposed'],
  ['F3', 'raised in Corinth'],
  ['F4', 'Delphi; flight'],
  ['F5', 'the crossroads'],
  ['F6', 'Sphinx; marriage'],
  ['F7', 'plague'],
];
// play 里各段 testimony 讲到哪些 fabula 事件（1-based）
const SCENES = [
  ['Creon', [5]],
  ['Tiresias', [5, 6]],
  ['Jocasta', [1, 2, 5]],
  ['Oedipus', [4, 5]],
  ['Messenger', [2, 3]],
  ['Herdsman', [1, 2, 3]],
];
function firstMention() {
  const seen = new Set([7]), ord = [7];
  for (const [, ev] of SCENES) for (const e of ev) if (!seen.has(e)) { seen.add(e); ord.push(e); }
  return ord;
}

function intro() {
  const ord = firstMention();
  const xs = (i) => 50 + i * 77;
  const y1 = 52, y2 = 168;
  let o = text(8, 18, 'Story：事件实际发生的顺序（跨越几十年）', 'tb');
  o += text(8, 214, 'Play：这些事件第一次被讲出来的顺序（舞台上只过了一天）', 'tb');
  for (let k = 0; k < 7; k++) {
    const e = ord[k];
    o += line(xs(e - 1), y1 + 26, xs(k), y2 - 26, e === 7 ? 'ln' : 'mute');
  }
  for (let i = 0; i < 7; i++) {
    const [id, lab] = FAB[i];
    o += rect(xs(i) - 34, y1 - 14, 68, 40, i === 6 ? 'wash' : 'paper', 5) + text(xs(i), y1 + 2, id, 'tb', 'middle') + text(xs(i), y1 + 18, SHORT[i], 'ts', 'middle');
    const e = ord[i];
    o += rect(xs(i) - 34, y2 - 26, 68, 40, e === 7 ? 'wash' : 'paper', 5) + text(xs(i), y2 - 10, FAB[e - 1][0], 'tb', 'middle') + text(xs(i), y2 + 6, SHORT[e - 1], 'ts', 'middle');
  }
  return svg(560, 222, o, 'Oedipus 的七个 story 事件：上面按发生顺序 F1 到 F7，下面按 play 第一次讲到它们的顺序 F7、F5、F6、F1、F2、F4、F3，连线交叉');
}

// ---------- 第 1 站：She dwelt among the untrodden ways 里的 opposition ----------
function lucy() {
  const pairs = [
    ['untrodden', 'ways'],
    ['none to praise', 'very few to love'],
    ['violet, half hidden', 'star, only one'],
    ["liv'd unknown", 'the difference to me'],
  ];
  let o = '';
  const panel = (x0, title, sub, unify) => {
    o += text(x0 + 130, 18, title, 'tb', 'middle') + text(x0 + 130, 36, sub, 'ts', 'middle');
    pairs.forEach(([a, b], k) => {
      const y = 62 + k * 40;
      o += rect(x0, y, 116, 26, 'wash2', 4) + text(x0 + 58, y + 17, a, 'ts', 'middle');
      o += rect(x0 + 144, y, 116, 26, 'wash', 4) + text(x0 + 202, y + 17, b, 'ts', 'middle');
      if (unify) {
        o += line(x0 + 116, y + 13, x0 + 126, 236, 'mute') + line(x0 + 144, y + 13, x0 + 134, 236, 'mute');
      } else {
        o += line(x0 + 124, y + 6, x0 + 124, y + 20, 'ink-b') + line(x0 + 136, y + 6, x0 + 136, y + 20, 'ink-b');
      }
    });
    if (unify) o += circle(x0 + 130, 240, 6, 'ln-f') + text(x0 + 130, 266, 'speaker 的 feeling 把两边统一', 'ts', 'middle');
    else o += text(x0 + 130, 236, '每一对都没有被调和', 'ts', 'middle') + text(x0 + 130, 254, 'pathos 来自这个 conflict 本身', 'ts', 'middle');
  };
  panel(0, 'Brooks：unity', '两边在一个视角里同时成立', true);
  panel(296, 'Bateson：unresolved', '两边始终互相抵消', false);
  o += line(280, 10, 280, 270, 'grid');
  return svg(560, 274, o, 'She dwelt among the untrodden ways 里的四对 opposition：左栏 Brooks 把每一对收束到 speaker 的 feeling，右栏 Bateson 认为每一对都没有被调和');
}

// ---------- 第 2 站：Sonnet 73 第 1 行和第 4 行的 scansion（动图） ----------
function scanA() {
  const L1 = { syl: ['That', 'time', 'of', 'year', 'thou', 'mayst', 'in', 'me', 'be', 'hold'], st: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1], label: 'line 1' };
  const L4 = { syl: ['Bare', 'ru', "in'd", 'choirs,', 'where', 'late', 'the', 'sweet', 'birds', 'sang.'], st: [1, 1, 0, 1, 0, 1, 0, 1, 1, 1], label: 'line 4' };
  const meter = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
  const x0 = 70, dx = 40, xs = (i) => x0 + i * dx + dx / 2;
  const n = 4, T = 9;
  let o = text(8, 16, 'Shakespeare, Sonnet 73：iambic pentameter 的 grid 和实际 speech stress', 'tb');
  const rows = (Lx, y) => {
    let s = text(8, y + 20, Lx.label, 'tb');
    s += text(8, y + 44, 'speech', 'ts') + text(8, y + 66, 'meter', 'ts');
    // 第 1 步：音节
    let a = '';
    Lx.syl.forEach((w, i) => { a += text(xs(i), y + 20, w, Lx.st[i] ? 'tb' : 't', 'middle'); });
    s += g(a, showFrom(0, n, T));
    // 第 2 步：speech stress
    let b = '';
    Lx.syl.forEach((w, i) => { b += text(xs(i), y + 44, Lx.st[i] ? '/' : '×', Lx.st[i] ? 'tb' : 'ts', 'middle'); });
    const cnt = Lx.st.reduce((p, q) => p + q, 0);
    b += text(552, y + 44, cnt + ' 个 stress', 'ts', 'end');
    s += g(b, showFrom(1, n, T));
    // 第 3 步：meter 的 grid 和 foot 分界
    let c = '';
    meter.forEach((m, i) => { c += text(xs(i), y + 66, m ? '/' : '×', m ? 'tb' : 'ts', 'middle'); });
    for (let k = 1; k < 5; k++) c += line(x0 + k * 2 * dx, y + 4, x0 + k * 2 * dx, y + 72, 'grid');
    c += text(552, y + 66, '5 个 beat', 'ts', 'end');
    s += g(c, showFrom(2, n, T));
    // 第 4 步：不一致的位置
    let e = '';
    Lx.st.forEach((v, i) => { if (v !== meter[i]) e += rect(xs(i) - 18, y + 2, 36, 72, 'wash-strong', 5); });
    s = g(e, showFrom(3, n, T)) + s;
    return { s, cnt };
  };
  const r1 = rows(L1, 30), r4 = rows(L4, 124);
  o += r1.s + r4.s;
  const feet = [];
  for (let k = 0; k < 5; k++) {
    const pr = [L4.st[2 * k], L4.st[2 * k + 1]];
    feet.push(pr[0] && pr[1] ? 'spondee' : !pr[0] && pr[1] ? 'iamb' : pr[0] ? 'trochee' : 'pyrrhic');
  }
  let note = '';
  feet.forEach((f, k) => { note += text(x0 + (2 * k + 1) * dx, 222, f, f === 'iamb' ? 'ts' : 'tl', 'middle'); });
  o += g(note, showFrom(3, n, T));
  o += text(8, 246, '第 1 行的 stress 和 grid 完全重合；第 4 行同样 10 个 syllable，却有 ' + r4.cnt + ' 个 stress，', 'ts');
  o += text(8, 262, '多出来的两个落在第 1 和第 5 个 foot（深色格），读的时候这一行被迫放慢。', 'ts');
  return svgA(560, 268, o, '动图：Sonnet 73 第 1 行和第 4 行依次标出 syllable、speech stress、iambic pentameter 的 grid，最后标出两者不一致的位置；第 4 行有 7 个 stress，第一个和最后一个 foot 是 spondee');
}

// ---------- 第 2 站：Jakobson 的两条 axis，I like Ike ----------
function axes2() {
  const slots = [
    { x: 100, chosen: 'I', alts: ['we', 'everyone'] },
    { x: 220, chosen: 'like', alts: ['support', 'prefer'] },
    { x: 340, chosen: 'Ike', alts: ['Eisenhower', 'the general'] },
  ];
  const yC = 200;
  let o = text(8, 18, 'Selection axis：每个位置上可以互相替换的词（按 meaning 的 equivalence 聚在一起）', 'ts');
  slots.forEach((s) => {
    s.alts.forEach((a, k) => {
      const y = 56 + k * 40;
      o += rect(s.x - 50, y - 17, 100, 26, 'wash2', 4) + text(s.x, y, a, 'ts', 'middle');
    });
    o += line(s.x - 56, 38, s.x - 56, yC + 12, 'dash');
    o += rect(s.x - 50, yC - 18, 100, 30, 'solid', 5) + text(s.x, yC + 2, s.chosen, 'tw', 'middle');
  });
  o += arrow(30, yC + 28, 420, yC + 28, 'ink');
  o += text(420, yC + 46, 'Combination axis：选出来的词排成 sequence', 'ts', 'end');
  o += text(100, yC - 30, '/aɪ/', 'tl', 'middle') + text(220, yC - 30, '/laɪk/', 'tl', 'middle') + text(340, yC - 30, '/aɪk/', 'tl', 'middle');
  o += text(420, 70, '同一列 meaning 相近，', 'ts', 'start') + text(420, 88, '口号按 sound 选：', 'ts', 'start') + text(420, 106, 'Ike 藏在 like 里，', 'ts', 'start') + text(420, 124, 'I 又藏在 Ike 里', 'ts', 'start');
  return svg(560, 252, o, 'Jakobson 的 selection axis 与 combination axis：I like Ike 的三个位置各有 meaning 相近的候选词，选中的三个词在 sound 上一个包含另一个');
}

// ---------- 第 3 站：Oedipus 的 frequency 和 order（动图） ----------
function orderA() {
  const rows = FAB.slice(0, 6);
  const cx = (j) => 214 + j * 58, ry = (i) => 74 + i * 30;
  const n = SCENES.length, T = 10;
  let o = text(8, 16, '纵向：story 的顺序；横向：play 里讲述的顺序', 'tb');
  SCENES.forEach(([nm], j) => { o += text(cx(j), 42, nm, 'ts', 'middle'); });
  o += text(548, 42, 'told', 'ts', 'middle');
  rows.forEach(([id, lab], i) => {
    o += text(8, ry(i) + 5, id, 'tb') + text(36, ry(i) + 5, lab, 't');
    o += line(180, ry(i), 530, ry(i), 'grid');
  });
  // 每一列在第 j 步出现
  SCENES.forEach(([, ev], j) => {
    let c = rect(cx(j) - 20, 62, 40, 182, 'wash', 5);
    ev.forEach((e) => { c += circle(cx(j), ry(e - 1), 7, 'ln-f'); });
    o += g(c, showFrom(j, n, T));
  });
  // 右边的计数随步数变化
  rows.forEach((_, i) => {
    const counts = SCENES.map((_, j) => SCENES.slice(0, j + 1).filter(([, ev]) => ev.includes(i + 1)).length);
    counts.forEach((c, j) => {
      const on = [j === n - 1 ? 1 : 0, 0, 1, j === n - 1 ? 1 : 0];
      const kt = [0, KT0, stepOn(j, n), j === n - 1 ? 0.999 : stepOn(j + 1, n)];
      o += `<text x="548" y="${ry(i) + 5}" class="${c >= 3 ? 'tl' : 't'}" text-anchor="middle">×${c}${ashow(on, kt, T)}</text>`;
    });
  });
  o += text(8, 268, 'F5（crossroads 的那次杀人）被讲了 4 次；F1 到 F3 要等到最后两个人上场才说全。', 'ts');
  return svgA(560, 274, o, '动图：Oedipus 的六个 story 事件按发生顺序纵向排列，六段 testimony 按 play 的顺序横向逐列出现，圆点表示这一段讲到这个事件；右边的计数显示 F5 被讲了 4 次');
}

// ---------- 第 4 站：narrative communication 的层次，The Tell-Tale Heart ----------
function comm() {
  let o = '';
  const box = (x, y, w, h, cls) => rect(x, y, w, h, cls, 8);
  o += box(4, 4, 552, 262, 'frame');
  o += text(16, 26, 'Real author：Edgar Allan Poe（1843）', 'tb') + text(544, 26, 'Real reader：今天的你', 'tb', 'end');
  o += box(30, 40, 500, 214, 'wash2');
  o += text(44, 62, 'Implied author：从整篇 text 推出来的设计者', 't') + text(516, 62, 'Implied reader', 't', 'end');
  o += box(56, 76, 448, 166, 'wash');
  o += text(70, 98, 'Narrator：“I”', 'tb') + text(490, 98, 'Narratee：“you”', 'tb', 'end');
  o += text(70, 116, '坚持自己没疯', 'ts') + text(490, 116, '据说说过 narrator 疯了', 'ts', 'end');
  o += arrow(170, 104, 390, 104, 'ln');
  o += box(84, 132, 392, 96, 'paper');
  o += text(280, 152, 'Level of action：characters', 'tb', 'middle');
  const ch = [['the “I” (当时)', 150], ['old man', 280], ['three police officers', 405]];
  ch.forEach(([s, x]) => { o += rect(x - 58, 166, 116, 28, 'wash2', 14) + text(x, 185, s, 'ts', 'middle'); });
  o += text(280, 218, '讲述时的“I”和行动时的“I”是同一个人的两个时刻', 'ts', 'middle');
  return svg(560, 270, o, 'Narrative communication 的四层：real author 与 real reader，implied author 与 implied reader，narrator 与 narratee，最里面是 characters；以 The Tell-Tale Heart 为例');
}

// ---------- 第 5 站：每一场之后谁知道多少（动图） ----------
function knowA() {
  const sc = ['Creon', 'Tiresias', 'Jocasta', 'Oedipus', 'Messenger', 'Herdsman'];
  const K = { audience: [6, 6, 6, 6, 6, 6], jocasta: [0, 0, 0, 0, 6, 6], oedipus: [0, 0, 0, 0, 1, 6] };
  const S = { jocasta: [0, 0, 0, 1, 6, 6], oedipus: [0, 0, 1, 1, 2, 6] }; // 连同“怀疑”在内
  const sx = (j) => 130 + j * 70, sy = lin(0, 6, 214, 56);
  const n = sc.length, T = 11;
  let o = text(8, 16, '六件关于身份的事实里，每一场结束时各自知道几件', 'tb');
  for (let v = 0; v <= 6; v += 2) o += line(100, sy(v), 520, sy(v), 'grid') + text(94, sy(v) + 4, String(v), 'ts', 'end');
  sc.forEach((s, j) => { o += text(sx(j), 236, s, 'ts', 'middle'); });
  const stepLine = (arr) => {
    const pts = [];
    arr.forEach((v, j) => { pts.push([sx(j) - 35, sy(v)], [sx(j) + 35, sy(v)]); });
    return d(pts);
  };
  // dramatic irony 的区域：audience 与 Oedipus 之间
  let area = '';
  K.oedipus.forEach((v, j) => { if (v < 6) area += rect(sx(j) - 35, sy(6), 70, sy(v) - sy(6), 'wash'); });
  o += area;
  o += path(stepLine(S.oedipus), 'ln-dash') + path(stepLine(S.jocasta), 'dash');
  o += path(stepLine(K.audience), 'ink-b') + path(stepLine(K.jocasta), 'ink') + path(stepLine(K.oedipus), 'ln');
  o += text(sx(0) - 33, sy(6) - 8, 'audience', 'tb');
  o += text(sx(1), sy(3) + 4, 'dramatic irony', 'tl', 'middle');
  o += text(sx(4) - 42, sy(6) + 18, 'Jocasta', 't', 'end');
  o += text(sx(4) + 30, sy(1) + 16, 'Oedipus', 'tl', 'start');
  o += text(sx(2), sy(1) - 8, '虚线：开始怀疑', 'ts', 'middle');
  // 一条扫描线标出当前这一场
  const xsA = sc.map((_, j) => f1(sx(j)));
  const kt = [0, KT0, ...sc.map((_, j) => stepOn(j, n)).slice(1)];
  const vals = [xsA[n - 1], xsA[0], ...xsA.slice(1)];
  o += `<line x1="${xsA[n - 1]}" y1="46" x2="${xsA[n - 1]}" y2="222" class="mute">${anim('x1', vals, kt, T, true)}${anim('x2', vals, kt, T, true)}</line>`;
  return svgA(560, 244, o, '动图：Oedipus Tyrannus 的六场里，audience 一直知道全部六件事实；Jocasta 在 Messenger 那一场一下子全知道；Oedipus 在 Messenger 那一场只知道一件，到 Herdsman 那一场才全知道；中间的阴影是 dramatic irony');
}

// ---------- 第 6 站：Lévi-Strauss 的四个 column（动图） ----------
function leviA() {
  const M = [
    [0, 'Kadmos seeks Europa'], [2, 'Kadmos kills dragon'],
    [1, 'Spartoi kill each other'],
    [3, 'Labdacos = lame?'],
    [1, 'Oedipus kills Laios'], [3, 'Laios = left-sided?'],
    [2, 'Oedipus kills Sphinx'],
    [3, 'Oedipus = swollen foot?'],
    [0, 'Oedipus weds Jocasta'],
    [1, 'Eteocles kills brother'],
    [0, 'Antigone buries brother'],
  ];
  const rowOf = [0, 0, 1, 2, 3, 3, 4, 5, 6, 7, 8];
  const cx = (c) => 70 + c * 140, ry = (r) => 78 + r * 24;
  const n = M.length, T = 12;
  const heads = [['I  overrating', 'blood relations'], ['II  underrating', 'blood relations'], ['III  denial of', 'autochthony'], ['IV  persistence of', 'autochthony']];
  let o = '';
  heads.forEach(([a, b], c) => {
    o += rect(cx(c) - 66, 4, 132, 40, c % 2 ? 'wash2' : 'wash', 5) + text(cx(c), 20, a, 'tb', 'middle') + text(cx(c), 37, b, 'ts', 'middle');
    if (c) o += line(cx(c) - 70, 50, cx(c) - 70, ry(8) + 10, 'grid');
  });
  o += text(-2, ry(0) + 4, '↓', 'ts');
  M.forEach(([c, s], k) => {
    o += `<g>${text(cx(c), ry(rowOf[k]) + 4, s, 't', 'middle')}${showFrom(k, n, T)}</g>`;
  });
  o += line(10, ry(8) + 16, 550, ry(8) + 16, 'grid');
  o += text(280, ry(8) + 36, '从上往下按 narrative 读；按 column 读才是 Lévi-Strauss 要的 structure：I : II = III : IV', 'ts', 'middle');
  return svgA(560, ry(8) + 44, o, '动图：Lévi-Strauss 把 Oedipus myth 的 11 个 mytheme 按出现顺序一个个放进四个 column：overrating 与 underrating blood relations，denial 与 persistence of autochthony');
}

// ---------- 第 7 站：hermeneutic circle，A slumber did my spirit seal（动图） ----------
function circleA() {
  // 1800 年 Lyrical Ballads 第 2 卷的文本
  const P = ['A slumber did my spirit seal,', 'I had no human fears:', "She seem'd a thing that could not feel", 'The touch of earthly years.', 'No motion has she now, no force', 'She neither hears nor sees', "Roll'd round in earth's diurnal course", 'With rocks and stones and trees!'];
  const ly = (i) => 46 + i * 22 + (i >= 4 ? 10 : 0);
  // 每一步：读到哪几行（高亮），对 whole 的 hypothesis
  const steps = [
    { hi: [0, 1, 2, 3], h: ['hypothesis 1：', '她还活着，speaker 以为', '她不受 time 影响'] },
    { hi: [4, 5], h: ['hypothesis 2：', '她死了；stanza 1 是', '当时的 illusion'] },
    { hi: [6, 7], h: ['到这里分岔：', 'inert matter，horror（Brooks）', '或 nature 的 motion（Bateson）'] },
    { hi: [2], h: ['回头重读 line 3：', '“a thing that could not feel”', '活着时已经用了死物的词'] },
  ];
  const n = steps.length, T = 12;
  let o = text(8, 18, 'Part：一行一行读', 'tb') + text(392, 18, 'Whole：对整首诗的 hypothesis', 'tb', 'middle');
  steps.forEach((s, k) => {
    let hl = '';
    s.hi.forEach((i) => { hl += rect(4, ly(i) - 15, 250, 21, 'wash', 4); });
    o += g(hl, showOnly(k, n, T));
  });
  P.forEach((l, i) => { o += text(10, ly(i), l, 't'); });
  o += rect(286, 60, 212, 88, 'paper', 8);
  steps.forEach((s, k) => {
    let h = text(298, 84, s.h[0], 'tb') + text(298, 106, s.h[1], 'ts') + text(298, 126, s.h[2], 'ts');
    o += g(h, showOnly(k, n, T));
  });
  o += arrow(258, 80, 284, 80, 'ln') + arrow(284, 128, 258, 128, 'ln-dash');
  o += text(271, 72, '读', 'ts', 'middle') + text(271, 146, '重读', 'ts', 'middle');
  o += text(392, 174, 'whole 改变以后，已经读过的', 'ts', 'middle') + text(392, 192, 'part 要按新的 whole 重读', 'ts', 'middle');
  return svgA(560, 248, o, '动图：读 A slumber did my spirit seal 时，读到的诗行和对整首诗的 hypothesis 交替修正：先以为她活着，读到第二节知道她死了，第 7、8 行出现两种读法，再回头重读第 3 行');
}

// ---------- 第 3 站：The Story of an Hour 每段的词数（Standard Ebooks 的 1894 年 Vogue 文本） ----------
const HOUR_W = [28, 86, 55, 31, 63, 28, 42, 57, 51, 41, 62, 31, 65, 74, 40, 8, 40, 22, 56, 49, 68, 5, 15];
const HOUR_BLOCKS = [
  { from: 1, to: 3, name: 'news, grief', tempo: 'speed-up', cls: 'wash2' },
  { from: 4, to: 16, name: 'alone in the room', tempo: 'pause, then near-isochrony', cls: 'wash-strong' },
  { from: 17, to: 19, name: 'at the door', tempo: '', cls: 'wash' },
  { from: 20, to: 22, name: 'Brently returns', tempo: 'speed-up, ellipsis', cls: 'wash2' },
  { from: 23, to: 23, name: 'doctors', tempo: '', cls: 'paper' },
];
function hour() {
  const total = HOUR_W.reduce((a, b) => a + b, 0);
  const X0 = 10, X1 = 550, sx = (X1 - X0) / total;
  const cum = [0];
  HOUR_W.forEach((w) => cum.push(cum[cum.length - 1] + w));
  const px = (k) => X0 + cum[k] * sx; // 第 k 段（0 起）左边界
  const Y = 96, H = 46;
  let o = text(8, 18, 'The Story of an Hour：23 段，共 ' + total + ' 个词；每一格的宽度按这一段的词数', 'tb');
  HOUR_BLOCKS.forEach((b) => {
    for (let k = b.from - 1; k < b.to; k++) o += rect(px(k), Y, px(k + 1) - px(k), H, b.cls);
  });
  for (let k = 0; k <= HOUR_W.length; k++) o += line(px(k), Y, px(k), Y + H, 'frame');
  o += rect(X0, Y, X1 - X0, H, 'frame');
  // 标注的层次和对齐：top/bot 是第几层（0 最靠近条），anchor 是对齐方式
  const LAY = [
    { top: 0, bot: 0, anc: 'start' },
    { top: 0, bot: 0, anc: 'middle' },
    { top: 0, bot: 1, anc: 'end' },
    { top: 1, bot: 0, anc: 'end' },
    { top: null, bot: 2, anc: 'end' },
  ];
  HOUR_BLOCKS.forEach((b, i) => {
    const L = LAY[i];
    const xa = px(b.from - 1), xb = px(b.to), xm = (xa + xb) / 2;
    const n = cum[b.to] - cum[b.from - 1];
    const pct = (Math.round((n / total) * 1000) / 10).toFixed(1) + '%';
    const tx = L.anc === 'start' ? X0 : L.anc === 'middle' ? xm : i === 4 ? X1 : xb;
    // 上方：括号 + 名字
    o += line(xa + 1, Y - 4, xb - 1, Y - 4, 'ink') + line(xa + 1, Y - 4, xa + 1, Y - 1, 'ink') + line(xb - 1, Y - 4, xb - 1, Y - 1, 'ink');
    const nm = b.name + '（' + b.from + (b.to > b.from ? '–' + b.to : '') + '）';
    if (L.top !== null) {
      const yt = Y - 10 - L.top * 20;
      if (L.top) o += line(xm, Y - 5, xm, yt + 3, 'mute');
      o += text(tx, yt, nm, 'ts', L.anc);
    }
    // 下方：词数
    const yb = Y + H + 17 + L.bot * 18;
    if (L.bot) o += line(xm, Y + H + 2, xm, yb - 12, 'mute');
    o += text(tx, yb, (L.top === null ? nm + '：' : '') + n + ' words, ' + pct, i === 1 ? 'tl' : 'ts', L.anc);
  });
  const T = Y + H + 92;
  o += text(8, T, 'Tempo（Jahn 5-08）：', 'tb');
  o += text(8, T + 20, '1–3 speed-up：“When the storm of grief had spent itself” 一个分句带过大哭', 'ts');
  o += text(8, T + 38, '5–6 pause：窗外景物 91 个词，story 几乎不动；9–11 认出 free 的过程 154 个词，接近 isochrony', 'ts');
  o += text(8, T + 56, '22–23 ellipsis：“But Richards was too late.” 5 个词之后直接是医生的诊断', 'ts');
  return svg(560, T + 62, o, 'The Story of an Hour 23 段的词数条：news 与 grief 169 词，房间里 593 词，门口 118 词，Brently 回来 122 词，医生 15 词；房间里的部分合计约七成');
}

// ---------- 第 6 站：Fry 的检验，没列进表的三件事 ----------
function levi2() {
  const cx = (c) => 70 + c * 140;
  const heads = [['I  overrating', 'blood relations'], ['II  underrating', 'blood relations'], ['III  denial of', 'autochthony'], ['IV  persistence of', 'autochthony']];
  const cols = [
    ['Kadmos seeks Europa', 'Oedipus weds Jocasta', 'Antigone buries brother'],
    ['Spartoi kill each other', 'Oedipus kills Laios', 'Eteocles kills brother'],
    ['Kadmos kills dragon', 'Oedipus kills Sphinx'],
    ['Labdacos = lame?', 'Laios = left-sided?', 'Oedipus = swollen foot'],
  ];
  let o = '';
  heads.forEach(([a, b], c) => {
    o += rect(cx(c) - 66, 4, 132, 40, c % 2 ? 'wash2' : 'wash', 5) + text(cx(c), 20, a, 'tb', 'middle') + text(cx(c), 37, b, 'ts', 'middle');
    if (c) o += line(cx(c) - 70, 50, cx(c) - 70, 250, 'grid');
  });
  cols.forEach((col, c) => col.forEach((m, r) => { o += text(cx(c), 70 + r * 22, m, 't', 'middle'); }));
  o += line(10, 136, 550, 136, 'dash');
  o += text(8, 154, 'Fry 找出的、Lévi-Strauss 没有列的三件：', 'tb');
  // Jocasta：I 或 II
  const yJ = 186;
  o += rect(cx(0) - 60, yJ - 16, cx(1) - cx(0) + 120, 24, 'paper', 12) + text((cx(0) + cx(1)) / 2, yJ, 'Jocasta hangs herself（I 还是 II 都说得通）', 'tl', 'middle');
  const iv = ['feet pierced, exposed', 'swallowed by earth'];
  iv.forEach((m, k) => {
    const w = tw(m) + 26, y = yJ + k * 34;
    o += rect(554 - w, y - 16, w, 24, 'paper', 12) + text(554 - w / 2, y, m, 'tl', 'middle');
  });
  o += text(410, yJ + 17, '落进 IV →', 'ts', 'end');
  o += text(410, yJ + 34, '（Colonus 的结尾）', 'ts', 'end');
  o += text(280, 248, '没被挑选过的材料也能装进去，Fry 认为这是替这张表辩护的理由', 'ts', 'middle');
  return svg(560, 254, o, 'Lévi-Strauss 的四个 column，下方加上 Fry 找出的三件没有列进表的事：Jocasta 自尽落在 I 与 II 之间，婴儿被刺穿脚踝丢弃和 Oedipus 在 Colonus 被大地吞没落进 IV');
}

// ---------- 第 8 站：Brooks 的 plot，Oedipus 的 detour ----------
function plot() {
  const X0 = 40, X1 = 520, Y = 170;
  let o = text(8, 18, 'Desire：谁杀了 Laius？', 'tb') + text(552, 18, 'End：discharge', 'tb', 'end');
  o += circle(X0, Y, 6, 'ink-f') + circle(X1, Y, 6, 'ln-f');
  o += line(X0, Y, X1, Y, 'dash');
  o += text(280, Y + 22, 'short-circuit：一开场就把唯一的 survivor 叫来问', 'ts', 'middle');
  // 实际的路径：一串 detour
  const det = [
    [100, 'Tiresias 被斥为', '受 Creon 指使'],
    [190, '与 Creon 争吵', ''],
    [280, 'Jocasta：oracle', '不可信'],
    [370, '“robbers” 是复数', ''],
    [460, 'Polybus 死了：', '一场虚假的 relief'],
  ];
  let pts = [[X0, Y]];
  det.forEach(([x], k) => { pts.push([x - 30, Y - 30], [x, Y - 92 - (k % 2) * 18], [x + 30, Y - 30]); });
  pts.push([X1, Y]);
  // 平滑一点：用 quadratic 段
  let dd = `M${X0} ${Y}`;
  det.forEach(([x], k) => {
    const top = Y - 92 - (k % 2) * 18;
    dd += ` C ${x - 40} ${Y - 10}, ${x - 34} ${top}, ${x} ${top} S ${x + 40} ${Y - 10}, ${x + 44} ${Y - 26}`;
  });
  dd += ` L ${X1} ${Y}`;
  o += path(dd, 'ln');
  det.forEach(([x, a, b], k) => {
    const top = Y - 92 - (k % 2) * 18;
    o += text(x, top - 24, a, 'ts', 'middle');
    if (b) o += text(x, top - 10, b, 'ts', 'middle');
  });
  // survivor 被叫和到场
  const xs = 300, xa = 500;
  o += line(xs, Y + 34, xs, Y + 48, 'ink') + text(xs, Y + 64, 'survivor 被派人去叫', 'ts', 'middle');
  o += line(xa, Y + 34, xa, Y + 48, 'ink') + text(xa, Y + 64, '到场', 'ts', 'middle');
  o += arrow(xs + 64, Y + 60, xa - 18, Y + 60, 'mute');
  return svg(560, 240, o, 'Peter Brooks 的 plot 模型套在 Oedipus Tyrannus 上：从 desire 到 end 的直线是 short-circuit，实际的路径绕了五个 detour；survivor 在中段被派人去叫，到最后才到场');
}

export default {
  'en1101e-intro': intro,
  'en1101e-lucy': lucy,
  'en1101e-scan': scanA,
  'en1101e-axes': axes2,
  'en1101e-order': orderA,
  'en1101e-comm': comm,
  'en1101e-know': knowA,
  'en1101e-levi': leviA,
  'en1101e-circle': circleA,
  'en1101e-plot': plot,
  'en1101e-hour': hour,
  'en1101e-levi2': levi2,
};
