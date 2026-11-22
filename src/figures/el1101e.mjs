import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 估计一段文字的宽度（13px：Latin 约 7px，CJK 约 13px）
const tw = (s, small = false) => {
  let w = 0;
  for (const ch of String(s)) w += /[　-鿿＀-￯]/.test(ch) ? (small ? 11.5 : 13) : (small ? 6.3 : 7.1);
  return w;
};

// 通用的 tree：node = { t: 'label', c: [children], cls, ecls }；叶子统一放在最底一行
function drawTree(root, x0, y0, dy, opt = {}) {
  const gap = opt.gap ?? 10;
  let o = '';
  const depth = (n) => (n.c ? 1 + Math.max(...n.c.map(depth)) : 0);
  const H = depth(root);
  let cursor = x0;
  const place = (n, k) => {
    if (!n.c) {
      const w = tw(n.t);
      n.x = cursor + w / 2;
      cursor += w + gap;
      n.y = y0 + H * dy;
    } else {
      n.c.forEach((c) => place(c, k + 1));
      n.x = (n.c[0].x + n.c[n.c.length - 1].x) / 2;
      n.y = y0 + k * dy;
    }
  };
  place(root, 0);
  const draw = (n) => {
    if (n.c) for (const c of n.c) {
      o += line(n.x, n.y + 5, c.x, c.y - 13, c.ecls || 'ink');
      draw(c);
    }
    o += text(n.x, n.y, n.t, n.cls || (n.c ? 'tb' : 't'), 'middle');
  };
  draw(root);
  return { o, width: cursor - gap - x0, root };
}
const L = (t, cls) => ({ t, cls });
const N = (t, c, cls, ecls) => ({ t, c, cls, ecls });

// 1. Center embedding 与 right branching：同样三对 subject–verb dependency
function embed() {
  let o = '';
  const row = (y, toks, arcs, title, note) => {
    o += text(20, y - 70, title, 'tb');
    let x = 30;
    const pos = toks.map((s) => { const w = tw(s); const c = x + w / 2; x += w + 16; return c; });
    toks.forEach((s, i) => { o += text(pos[i], y, s, 't', 'middle'); });
    arcs.forEach(([a, b], k) => {
      const h = 16 + Math.abs(b - a) * 7;
      o += path(`M${pos[a].toFixed(1)} ${y - 15}Q${((pos[a] + pos[b]) / 2).toFixed(1)} ${(y - 15 - 2 * h).toFixed(1)} ${pos[b].toFixed(1)} ${y - 15}`, k === 0 ? 'ln' : 'ink');
    });
    o += text(20, y + 22, note, 'ts');
  };
  row(110, ['the rat', 'the cat', 'the dog', 'chased', 'killed', 'ate', 'the malt'], [[2, 3], [1, 4], [0, 5]],
    'Center embedding：dependency 一层套一层', '要先记住三个 subject，等三个 verb 依次出现时倒着配对：nested。');
  row(232, ['the dog', 'chased', 'the cat', 'that', 'killed', 'the rat', 'that', 'ate', 'the malt'], [[0, 1], [3, 4], [6, 7]],
    'Right branching：同样的三件事', '每个 dependency 刚打开就关上，任何时刻只要记住一个：没有 nesting。');
  return svg(560, 268, o, '上一行是 center-embedded 的句子，三条 subject 到 verb 的 dependency 一层套一层；下一行是表达同样内容的 right-branching 句子，三条 dependency 依次出现、互不嵌套');
}

// 2. English vowel chart（24.900 Phonetics 的 transcription 与例词）
function vowels() {
  let o = '';
  const yh = (h) => 52 + h * 84;
  const xf = (h) => 92 + h * 38;
  const X = (f, h) => xf(h) + f * (392 - xf(h));
  o += poly([[xf(0), yh(0)], [392, yh(0)], [392, yh(2)], [xf(2), yh(2)]], 'wash2');
  o += poly([[xf(0), yh(0)], [392, yh(0)], [392, yh(2)], [xf(2), yh(2)]], 'frame');
  o += line(xf(1), yh(1), 392, yh(1), 'grid');
  o += text(xf(0), 36, 'front', 'ts', 'middle') + text((xf(0) + 392) / 2, 36, 'central', 'ts', 'middle') + text(392, 36, 'back', 'ts', 'middle');
  o += text(80, yh(0) + 4, 'high', 'ts', 'end') + text(xf(1) - 12, yh(1) + 4, 'mid', 'ts', 'end') + text(xf(2) - 12, yh(2) + 4, 'low', 'ts', 'end');
  const V = [
    ['i', "he'd", 0.05, 0.12], ['ɪ', 'hid', 0.16, 0.45], ['e', 'hate', 0.06, 0.82], ['ɛ', 'head', 0.13, 1.22], ['æ', 'had', 0.07, 1.82],
    ['ə', 'machine', 0.47, 0.98], ['ʌ', 'dove', 0.62, 1.38],
  ];
  for (const [s, w, f, h] of V) { const x = X(f, h), y = yh(h); o += text(x, y + 5, s, 'tb', 'middle') + text(x + 12, y + 5, w, 'ts'); }
  const B = [['u', "who'd", 0.93, 0.12], ['ʊ', 'hood', 0.8, 0.45], ['o', 'hoed', 0.93, 0.82], ['ɔ', 'hawed', 0.93, 1.25], ['ɑ', 'hot', 0.93, 1.82]];
  for (const [s, w, f, h] of B) { const x = X(f, h), y = yh(h); o += text(x, y + 5, s, h < 1.6 ? 'tl' : 'tb', 'middle') + text(402, y + 5, w, 'ts'); }
  o += text(446, 96, '彩色：rounded', 'tl') + text(446, 114, '恰好是全部 nonlow', 'ts') + text(446, 130, 'back vowel', 'ts');
  o += text(446, 176, '同一高度的一对：', 'ts') + text(446, 192, '外侧 tense，内侧 lax', 'ts');
  o += text(280, 248, '舌位最高、最靠前的 [i] 在左上角；舌位越低越往下，越靠后越往右。', 'ts', 'middle');
  return svg(560, 260, o, 'English vowel chart：横轴是 front 到 back，纵轴是 high 到 low，每个 vowel 旁边是 24.900 用的例词；rounded vowel 恰好是 nonlow back vowel');
}

// 3. VOT：同一条 continuum，三种语言切法不同（示意）
function vot() {
  let o = '';
  const sx = lin(-180, 120, 150, 540);
  // 色块：示意的区域；dots：Abramson & Whalen (2017) 图注里的单个 token（ms）
  const rows = [
    ['Thai', 'Abramson 的三个 token', [[-175, 0, '/b/', 'wash2'], [0, 25, '/p/', 'wash'], [25, 115, '/pʰ/', 'wash-strong']], [[-158, '−158'], [13, '13'], [62, '62']]],
    ['Hindi', 'bal · pal · pʰal', [[-175, 0, '/b/', 'wash2'], [0, 25, '/p/', 'wash'], [25, 115, '/pʰ/', 'wash-strong']], []],
    ['Mandarin', '爸 bà · 怕 pà', [[0, 25, 'b', 'wash'], [25, 115, 'p', 'wash-strong']], []],
    ['English（词首）', 'bin · pin', [[0, 25, '/b/', 'wash'], [25, 115, '/p/', 'wash-strong']], [[5, 'books 5'], [-67, 'two books −67']]],
    ['English（s 之后）', 'spin', [[0, 25, '/p/', 'wash']], []],
  ];
  const y0 = 62, dy = 64;
  rows.forEach(([name, sub, bands, dots], k) => {
    const y = y0 + k * dy;
    o += text(140, y + 1, name, 'tb', 'end') + text(140, y + 18, sub, 'ts', 'end');
    for (const [a, b, lab, cls] of bands) {
      o += rect(sx(a), y - 15, sx(b) - sx(a), 30, cls, 4);
      o += text((sx(a) + sx(b)) / 2, y + 5, lab, 't', 'middle');
    }
    // 0 与 25 ms 的参考线只画在色块这一行里，行与行之间留给标注
    o += line(sx(0), y - 15, sx(0), y + 15, 'grid') + line(sx(25), y - 15, sx(25), y + 15, 'dash');
    for (const [v, lab] of dots) {
      o += circle(sx(v), y - 15, 4.5, 'ink-f');
      o += text(sx(v), y - 25, lab, 'ts', 'middle');
    }
  });
  const ya = y0 + 4 * dy + 34;
  o += line(sx(25), 24, sx(25), y0 - 15, 'dash');
  o += text(sx(25) + 4, 18, '24.900 给的分界：约 25 ms', 'ts');
  o += line(sx(-180), ya, sx(120), ya, 'axis');
  for (const [v, s] of [[-150, '−150'], [-100, '−100'], [-50, '−50'], [0, '0'], [25, '25'], [50, '50'], [100, '100']]) o += line(sx(v), ya, sx(v), ya + 4, 'axis') + text(sx(v), ya + 17, s, 'ts', 'middle');
  o += text(sx(-90), ya + 36, 'voicing lead', 'ts', 'middle') + text(sx(12), ya + 36, 'short lag', 'ts', 'middle') + text(sx(75), ya + 36, 'long lag = aspirated', 'ts', 'middle');
  o += text(540, ya + 56, 'VOT（ms）：release 之后多久 vocal folds 开始振动；负数表示 release 之前就在振动', 'ts', 'end');
  return svg(560, ya + 66, o, 'Voice onset time 的 continuum 被几种语言切成不同的类：Thai 和 Hindi 用到 lead、short lag、long lag 三个区，Mandarin 和 English 词首只用 short lag 和 long lag；圆点是实测 token：Thai 的 −158、13、62 ms，English books 的 5 ms 与 two books 的 −67 ms。色块边界是示意');
}

// 4. Mandarin 四个 tone（Chao 五度标记）与 third-tone sandhi
function tones() {
  let o = '';
  const W = 92, top = 46, bot = 166;
  const sy = lin(1, 5, bot, top);
  const panel = (x0, title, gloss, pts, sub) => {
    o += rect(x0, top - 10, W, bot - top + 20, 'frame');
    for (let k = 1; k <= 5; k++) o += line(x0, sy(k), x0 + W, sy(k), 'grid');
    o += path(curve(pts, 0, 1, lin(0, 1, x0 + 12, x0 + W - 12), sy, 60), 'ln');
    o += text(x0 + W / 2, 22, title, 'tb', 'middle');
    o += text(x0 + W / 2, bot + 30, gloss, 't', 'middle');
    if (sub) o += text(x0 + W / 2, bot + 48, sub, 'ts', 'middle');
  };
  const q = (a, m, b) => (t) => { // 过 (0,a)、(0.45,m)、(1,b) 的 quadratic
    const t0 = 0, t1 = 0.45, t2 = 1;
    return a * ((t - t1) * (t - t2)) / ((t0 - t1) * (t0 - t2)) + m * ((t - t0) * (t - t2)) / ((t1 - t0) * (t1 - t2)) + b * ((t - t0) * (t - t1)) / ((t2 - t0) * (t2 - t1));
  };
  const xs = [40, 142, 244, 346];
  panel(xs[0], 'Tone 1：55', 'mā 妈', (t) => 5, "'mother'");
  panel(xs[1], 'Tone 2：35', 'má 麻', (t) => 3 + 2 * t, "'hemp'");
  panel(xs[2], 'Tone 3：214', 'mǎ 马', q(2, 1.05, 4), "'horse'");
  panel(xs[3], 'Tone 4：51', 'mà 骂', (t) => 5 - 4 * t, "'scold'");
  for (let k = 1; k <= 5; k++) o += text(34, sy(k) + 4, String(k), 'ts', 'end');
  // sandhi 小图：nǐ hǎo 实际是 35 + 214
  const x0 = 452, w = 100;
  o += rect(x0, top - 10, w, bot - top + 20, 'frame');
  for (let k = 1; k <= 5; k++) o += line(x0, sy(k), x0 + w, sy(k), 'grid');
  o += path(curve((t) => 3 + 2 * t, 0, 1, lin(0, 1, x0 + 8, x0 + 46), sy, 30), 'ln');
  o += path(curve(q(2, 1.05, 4), 0, 1, lin(0, 1, x0 + 54, x0 + w - 8), sy, 40), 'ln');
  o += text(x0 + w / 2, 22, 'sandhi', 'tb', 'middle');
  o += text(x0 + w / 2, bot + 30, 'nǐ hǎo 你好', 't', 'middle') + text(x0 + w / 2, bot + 48, '214 214 → 35 214', 'ts', 'middle');
  o += text(280, 238, 'Pitch 分 5 度，5 最高。Tone 是 pitch 随时间的形状，不是绝对高度。', 'ts', 'middle');
  return svg(560, 250, o, 'Mandarin 四个 tone 的 pitch contour：55 高平，35 升，214 降升，51 全降；最右是 third-tone sandhi，你好在实际发音里第一个音节变成 35');
}

// 5. 同样两个 phone，在 English 和 Mandarin 里地位不同
function phoneme() {
  let o = '';
  const box = (x, y, s, cls = 'paper') => rect(x - 30, y - 16, 60, 30, cls, 6) + text(x, y + 5, s, 'tb', 'middle');
  const ph = (x, y, s, w) => text(x, y + 5, s, 'tl', 'middle') + text(x, y + 26, w, 'ts', 'middle');
  // English
  o += text(140, 24, 'English：一个 phoneme', 'tb', 'middle');
  o += box(140, 68, '/p/');
  o += line(128, 84, 84, 140, 'ink') + line(152, 84, 196, 140, 'ink');
  o += ph(80, 156, '[pʰ]', 'pin：词首') + ph(200, 156, '[p]', 'spin：s 之后');
  o += text(140, 216, '换掉也不会变成另一个词，', 'ts', 'middle') + text(140, 232, '只是听起来“口音怪”', 'ts', 'middle');
  o += line(280, 20, 280, 236, 'grid');
  // Mandarin
  o += text(420, 24, 'Mandarin：两个 phoneme', 'tb', 'middle');
  o += box(360, 68, '/p/') + box(480, 68, '/pʰ/');
  o += line(360, 84, 360, 140, 'ink') + line(480, 84, 480, 140, 'ink');
  o += ph(360, 156, '[p]', '爸 bà') + ph(480, 156, '[pʰ]', '怕 pà');
  o += text(420, 216, '换掉就换了一个词：', 'ts', 'middle') + text(420, 232, '爸 bà 和 怕 pà 是 minimal pair', 'ts', 'middle');
  return svg(560, 244, o, '同样的两个 phone [p] 和 [pʰ]：在 English 里是同一个 phoneme 的两个 allophone，由环境决定出现哪个；在 Mandarin 里是两个 phoneme，能区分 爸 和 怕');
}

// 6. unlockable 的两个结构
function unlock() {
  let o = '';
  const t1 = N('A', [N('V', [L('un₁-'), N('V', [L('lock')])]), L('-able')]);
  const t2 = N('A', [L('un₂-'), N('A', [N('V', [L('lock')]), L('-able')])]);
  const a = drawTree(t1, 60, 52, 48, { gap: 30 });
  const b = drawTree(t2, 330, 52, 48, { gap: 30 });
  o += a.o + b.o;
  o += text(140, 22, '“able to be unlocked”', 'tb', 'middle') + text(410, 22, '“not able to be locked”', 'tb', 'middle');
  o += text(140, 222, '先 un₁ + V，得到 V（unlock）', 'ts', 'middle') + text(140, 238, '再 + -able，得到 A', 'ts', 'middle');
  o += text(410, 222, '先 V + -able，得到 A（lockable）', 'ts', 'middle') + text(410, 238, '再 un₂ + A，得到 A', 'ts', 'middle');
  o += line(275, 14, 275, 244, 'grid');
  return svg(560, 250, o, 'unlockable 的两种结构：左边 un 先和 verb lock 合并成 verb unlock，再加 able，意思是能被 unlock；右边 lock 先加 able 成为 adjective，再加否定的 un，意思是不能被 lock');
}

// 7. I shot an elephant in my pajamas：PP attachment 的两棵 tree
function pp() {
  let o = '';
  const np = (d, n) => N('NP', [L(d), L(n)].map((x, i) => N(i ? 'N' : 'Det', [x])));
  const PP = () => N('PP', [N('P', [L('in')]), np('my', 'pajamas')], 'tl', 'ln');
  const vpAttach = N('S', [N('NP', [L('I')]), N('VP', [N('VP', [N('V', [L('shot')]), np('an', 'elephant')]), PP()], 'tl')]);
  const npAttach = N('S', [N('NP', [L('I')]), N('VP', [N('V', [L('shot')]), N('NP', [np('an', 'elephant'), PP()], 'tl')])]);
  const a = drawTree(vpAttach, 10, 42, 34, { gap: 10 });
  const b = drawTree(npAttach, 292, 42, 34, { gap: 10 });
  o += a.o + b.o;
  o += text(140, 18, 'PP 挂在 VP 上：我穿着睡衣开枪', 'tb', 'middle') + text(420, 18, 'PP 挂在 NP 上：大象穿着我的睡衣', 'tb', 'middle');
  o += line(282, 10, 282, 290, 'grid');
  o += text(280, 296, '彩色的是 PP 和它所 modify 的那个 node。同样的 word sequence，两个 constituent structure。', 'ts', 'middle');
  return svg(560, 306, o, 'I shot an elephant in my pajamas 的两棵 tree：左边 PP in my pajamas 和 VP 合并，修饰开枪这件事；右边 PP 和 NP an elephant 合并，修饰大象');
}

// 8. Yes/no question：被移到句首的是哪一个 is
function aux() {
  let o = '';
  const rc = N('RC', [L('who'), N('Aux', [L('is')], 'tb'), N('AP', [L('tall')])], 'tb');
  const subj = N('NP', [N('Det', [L('the')]), N('N', [L('man')]), rc]);
  const t = N('S', [subj, N('Aux', [L('is', 'tl')], 'tl', 'ln'), N('AP', [L('happy')])], 'tb');
  const r = drawTree(t, 120, 40, 40, { gap: 22 });
  o += r.o;
  // 两个 is 的位置
  const isEmb = t.c[0].c[2].c[1].c[0], isMain = t.c[1].c[0];
  o += text(isEmb.x, isEmb.y + 22, '第一个 is', 'ts', 'middle') + text(isMain.x - 8, isMain.y + 22, 'main clause 的 is', 'tl');
  o += text(24, 246, 'Linear rule：把第一个 is 提前', 'tb') + text(330, 246, '*Is the man who tall is happy?', 't');
  o += text(24, 270, 'Structural rule：把 main clause 的 Aux 提前', 'tl') + text(330, 270, 'Is the man who is tall happy?', 't');
  return svg(560, 284, o, 'The man who is tall is happy 的 tree：第一个 is 在 subject 内部的 relative clause 里，第二个 is 是 main clause 的 Aux；按线性顺序移动第一个 is 得到 ungrammatical 的句子，移动main clause 的 Aux 才对');
}

// 9. Quantifier = 两个 set 之间的关系
function sets() {
  let o = '';
  const panel = (cx, title, rel, kind) => {
    o += text(cx, 24, title, 'tb', 'middle');
    if (kind === 'every') {
      o += circle(cx, 108, 62, 'wash ink-s') + circle(cx - 8, 116, 30, 'wash-strong');
      o += text(cx - 8, 121, 'A', 'tb', 'middle') + text(cx + 34, 70, 'B', 'tb', 'middle');
    } else if (kind === 'some') {
      o += circle(cx - 28, 108, 44, 'wash ink-s') + circle(cx + 28, 108, 44, 'wash ink-s');
      o += text(cx - 50, 113, 'A', 'tb', 'middle') + text(cx + 50, 113, 'B', 'tb', 'middle');
      o += circle(cx, 108, 4, 'ink-f');
    } else {
      o += circle(cx - 40, 108, 34, 'wash ink-s') + circle(cx + 40, 108, 34, 'wash ink-s');
      o += text(cx - 40, 113, 'A', 'tb', 'middle') + text(cx + 40, 113, 'B', 'tb', 'middle');
    }
    o += text(cx, 196, rel, 'tl', 'middle');
  };
  panel(95, 'every A B', 'A ⊆ B', 'every');
  panel(280, 'some A B', 'A ∩ B ≠ ∅', 'some');
  panel(465, 'no A B', 'A ∩ B = ∅', 'no');
  o += text(280, 226, 'A 是 noun 给的 set（linguists），B 是 predicate 给的 set（smoke 的人）。', 'ts', 'middle');
  o += text(280, 244, '中间那个黑点：some 只要求交集里至少有一个元素。', 'ts', 'middle');
  return svg(560, 254, o, 'Every、some、no 三个 determiner 分别表达两个 set 之间的 subset、交集非空、交集为空三种关系');
}

// 10. Someone loves everyone：两个 reading 在两个 model 里的真假
function scope() {
  let o = '';
  const P = ['Ann', 'Bo', 'Cy'];
  const panel = (x0, title, edges, r1, r2) => {
    o += text(x0 + 120, 22, title, 'tb', 'middle');
    const yl = (i) => 64 + i * 46;
    o += text(x0 + 40, 44, 'lover', 'ts', 'middle') + text(x0 + 200, 44, 'loved', 'ts', 'middle');
    P.forEach((p, i) => { o += rect(x0 + 16, yl(i) - 14, 48, 26, 'paper', 6) + text(x0 + 40, yl(i) + 5, p, 't', 'middle'); o += rect(x0 + 176, yl(i) - 14, 48, 26, 'paper', 6) + text(x0 + 200, yl(i) + 5, p, 't', 'middle'); });
    for (const [a, b] of edges) o += arrow(x0 + 66, yl(a), x0 + 174, yl(b), 'ln');
    o += text(x0 + 120, 218, r1, 't', 'middle') + text(x0 + 120, 238, r2, 't', 'middle');
  };
  panel(10, 'Model 1：一个圈', [[0, 1], [1, 2], [2, 0]], '∀x ∃y loves(y, x)：真', '∃y ∀x loves(y, x)：假');
  panel(290, 'Model 2：Ann 爱所有人', [[0, 0], [0, 1], [0, 2]], '∀x ∃y loves(y, x)：真', '∃y ∀x loves(y, x)：真');
  o += line(280, 14, 280, 244, 'grid');
  return svg(560, 250, o, '两个 model：在第一个 model 里每个人都被某人爱，但没有人爱所有人，所以两个 reading 一真一假；在第二个 model 里 Ann 爱所有人，两个 reading 都真');
}

// 11. Labov（1966）department store 研究：至少一次 [r]
function labov() {
  let o = '';
  const sy = lin(0, 80, 220, 40);
  const data = [['Saks', 62, 68], ["Macy's", 51, 125], ['S. Klein', 20, 71]];
  o += axes({ sx: lin(0, 3, 90, 470), sy, x0: 0, x1: 3, y0: 0, y1: 80, yt: [[0, '0%'], [20, '20%'], [40, '40%'], [60, '60%'], [80, '80%']], grid: true });
  data.forEach(([s, v, n], i) => {
    const cx = 90 + (i + 0.5) * (380 / 3);
    o += rect(cx - 36, sy(v), 72, sy(0) - sy(v), i === 0 ? 'solid' : i === 1 ? 'wash-strong' : 'wash');
    o += text(cx, sy(v) - 8, v + '%', 'tb', 'middle');
    o += text(cx, 240, s, 'tb', 'middle') + text(cx, 256, 'n = ' + n, 'ts', 'middle');
  });
  o += text(90, 22, '说 fourth floor 时至少出现一次 constricted [r] 的店员比例', 'tb');
  o += text(470, 280, '店的社会地位从左到右降低。数据：Labov（1966/1972）。', 'ts', 'end');
  return svg(560, 290, o, 'Labov 的 department store 研究：Saks 的店员 62% 至少一次发出 r，Macy’s 51%，S. Klein 20%');
}

// Arabic 的 al-：按 place 排开，[+coronal] 的那几列 l 被同化
function coronal() {
  let o = '';
  const cols = ['bilabial', 'labiodental', 'interdental', 'alveolar', 'postalveolar', 'palatal', 'velar', 'uvular'];
  const W = 64, x0 = 24, X = (i) => x0 + i * W + W / 2;
  o += rect(x0 + 2 * W, 64, 3 * W, 170, 'wash', 6);
  cols.forEach((c, i) => { o += text(X(i), i % 2 ? 54 : 36, c, 'ts', 'middle'); o += line(X(i), i % 2 ? 58 : 40, X(i), 64, 'grid'); });
  const S = [[1, 0, 'f', 'al-faras'], [2, 0, 'θ', 'aθ-θawb'], [3, 0, 'd', 'ad-daar'], [3, 1, 'n', 'an-nahr'], [3, 2, 'z', 'az-zajt'], [4, 0, 'ʃ', 'aʃ-ʃams'], [6, 0, 'k', 'al-kitaab'], [7, 0, 'q', 'al-qamr']];
  for (const [i, r, c, w] of S) {
    const y = 92 + r * 48;
    o += text(X(i), y, c, (i >= 2 && i <= 4) ? 'tl' : 'tb', 'middle') + text(X(i), y + 18, w, 'ts', 'middle');
  }
  o += text(x0 + 3.5 * W, 226, '[+coronal]：l 变成后面的 consonant', 'tl', 'middle');
  o += text(X(1), 160, 'l 不变', 'ts', 'middle') + text((X(6) + X(7)) / 2, 160, 'l 不变', 'ts', 'middle');
  o += arrow(40, 262, 520, 262, 'mute') + text(40, 280, 'lips', 'ts') + text(520, 280, 'throat', 'ts', 'end');
  o += text(280, 280, 'uvular 不在第 2 站的表里：q 比 velar 的 k 更靠后', 'ts', 'middle');
  return svg(560, 290, o, 'Arabic 定冠词 al- 的同化：把后面的 consonant 按 place 从唇到喉排开，interdental、alveolar、postalveolar 三列是 coronal，其中的 θ、d、n、z、ʃ 前面 l 变成同一个 consonant；labiodental 的 f、velar 的 k、uvular 的 q 前面 l 不变');
}

// 买好酒：third-tone sandhi 由内层到外层
function sandhi() {
  let o = '';
  const panel = (x0, title, gloss, inner, rows) => {
    const xs = [x0 + 96, x0 + 160, x0 + 224];
    o += text(x0 + 140, 22, title, 'tb', 'middle') + text(x0 + 140, 40, gloss, 'ts', 'middle');
    const [a, b] = inner, mid = (xs[a] + xs[b]) / 2, top = (xs[0] + xs[2]) / 2;
    const other = inner[0] === 0 ? 2 : 0;
    o += line(top, 58, mid, 78, 'ink') + line(top, 58, xs[other], 100, 'ink');
    o += line(mid, 78, xs[a], 100, 'ink') + line(mid, 78, xs[b], 100, 'ink');
    o += circle(top, 58, 3, 'ink-f') + circle(mid, 78, 3, 'ln-f');
    ['买 mǎi', '好 hǎo', '酒 jiǔ'].forEach((w, i) => { o += text(xs[i], 118, w, 't', 'middle'); });
    rows.forEach(([lab, tones, hi], r) => {
      const y = 152 + r * 30;
      o += text(x0 + 2, y, lab, 'ts');
      tones.forEach((t, i) => { o += text(xs[i], y, t, hi === i ? 'tl' : 't', 'middle'); });
    });
  };
  panel(10, '[[买 好] 酒]', "'finished buying wine'", [0, 1], [['underlying', ['214', '214', '214']], ['内层', ['35', '214', '214'], 0], ['外层', ['35', '35', '214'], 1]]);
  panel(290, '[买 [好 酒]]', "'buy good wine'", [1, 2], [['underlying', ['214', '214', '214']], ['内层', ['214', '35', '214'], 1], ['外层', ['214', '35', '214']]]);
  o += line(280, 14, 280, 222, 'grid');
  o += text(280, 246, '彩色的 node 是内层，先用 rule；彩色的数字是这一层刚改的 tone。', 'ts', 'middle');
  o += text(280, 264, '右边外层时 买 后面已经是 35，rule 不再适用。', 'ts', 'middle');
  return svg(560, 274, o, '买好酒的两种结构：左边内层是买好，买先变 35，外层好在酒前也变 35，得 35 35 214；右边内层是好酒，好先变 35，外层买后面已不是 214，不变，得 214 35 214');
}

// BPE 8 轮合并与最后的切分
function bpe() {
  let o = '';
  const M = [['a + b', 'ab', 15], ['ab + l', 'abl', 15], ['abl + e', 'able', 15], ['able + _', 'able_', 15], ['l + o', 'lo', 11], ['lo + c', 'loc', 11], ['loc + k', 'lock', 11], ['lock + _', 'lock_', 8]];
  o += text(20, 22, '8 轮合并（括号里是加权次数）', 'tb');
  M.forEach(([p, r, n], i) => {
    const y = 48 + i * 26;
    o += text(30, y, String(i + 1), 'ts', 'end') + text(42, y, p, 't') + text(126, y, '→', 'ts') + text(146, y, r, 'tl') + text(196, y, '(' + n + ')', 'ts');
  });
  o += line(250, 14, 250, 254, 'grid');
  const seg = (y, word, bpeParts, morph) => {
    o += text(268, y, word, 'tb');
    let x = 268;
    const draw = (parts, yy, cls) => { let xx = 356; for (const s of parts) { const w = 12 + s.length * 8; o += rect(xx, yy - 15, w, 22, cls, 4) + text(xx + w / 2, yy, s, 't', 'middle'); xx += w + 4; } };
    draw(bpeParts, y, 'wash');
    draw(morph, y + 28, 'paper');
  };
  o += text(340, 22, 'BPE（上）与 morpheme（下）', 'tb');
  seg(60, 'table', ['t', 'able_'], ['table']);
  seg(130, 'unable', ['u', 'n', 'able_'], ['un', 'able']);
  seg(200, 'unlockable', ['u', 'n', 'lock', 'able_'], ['un', 'lock', 'able']);
  o += text(280, 276, '合并只看 frequency：table 里切出了 able，un 一直没被合并。', 'ts', 'middle');
  return svg(560, 286, o, '在 table、able、lock、unlock、lockable、unable、unlockable 这个小 corpus 上跑 8 轮 BPE：依次合并 ab、abl、able、able_、lo、loc、lock、lock_；最后 table 被切成 t 加 able_，unlockable 被切成 u、n、lock、able_，和 morpheme 的切分不一致');
}

// Grimm's law：整类 stop 一起变
function grimm() {
  let o = '';
  const block = (x0, title, cells) => {
    o += text(x0 + 125, 22, title, 'tb', 'middle');
    cells.forEach(([pl, a, b, ex1, ex2, grey], i) => {
      const cx = x0 + 42 + i * 83;
      o += text(cx, 46, pl, 'ts', 'middle');
      o += rect(cx - 22, 58, 44, 32, grey ? 'wash2' : 'paper', 6) + text(cx, 80, a, grey ? 'ts' : 'tb', 'middle');
      o += arrow(cx, 92, cx, 124, grey ? 'mute' : 'ln');
      o += rect(cx - 22, 126, 44, 32, grey ? 'wash2' : 'wash', 6) + text(cx, 148, b, grey ? 'ts' : 'tb', 'middle');
      o += text(cx, 180, ex1, 'ts', 'middle') + text(cx, 198, ex2, 'ts', 'middle');
    });
  };
  block(10, 'voiceless stop → fricative', [['labial', 'p', 'f', 'pater', 'father'], ['dental', 't', 'θ', 'tres', 'three'], ['velar', 'k', 'h', 'cornu', 'horn']]);
  block(290, 'voiced stop → voiceless stop', [['labial', 'b', 'p', 'labium', 'lip'], ['dental', 'd', 't', 'duo', 'two'], ['velar', 'g', 'k', 'genus', 'kin']]);
  o += line(280, 14, 280, 206, 'grid');
  o += text(280, 228, '每一格上面是 Latin，下面是 English。同一个 manner 的一整行在三个 place 上一起变：', 'ts', 'middle') + text(280, 246, '变的是一个 natural class，不是一个个 sound。', 'ts', 'middle');
  return svg(560, 258, o, 'Grimm’s law：Latin 保留的 voiceless stop p、t、k 在 English 里对应 fricative f、θ、h，voiced stop b、d、g 对应 voiceless stop p、t、k；例词是 pater 和 father、tres 和 three、cornu 和 horn、labium 和 lip、duo 和 two、genus 和 kin');
}

export default {
  'el1101e-embed': embed,
  'el1101e-vowels': vowels,
  'el1101e-vot': vot,
  'el1101e-tones': tones,
  'el1101e-phoneme': phoneme,
  'el1101e-unlock': unlock,
  'el1101e-pp': pp,
  'el1101e-aux': aux,
  'el1101e-sets': sets,
  'el1101e-scope': scope,
  'el1101e-labov': labov,
  'el1101e-coronal': coronal,
  'el1101e-sandhi': sandhi,
  'el1101e-bpe': bpe,
  'el1101e-grimm': grimm,
};
