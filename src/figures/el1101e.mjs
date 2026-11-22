import { svg, svgA, anim, ashow, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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

// Accommodation：Street（1982）的 speech rate 例子，每个小块是 12 秒里的一个 word
function accommodate() {
  let o = '';
  const x0 = 176, x1 = 532, W = x1 - x0;
  const strip = (y, n, cls) => {
    o += rect(x0, y - 12, W, 24, 'wash2', 4);
    for (let i = 0; i < n; i++) o += rect(x0 + (i + 0.5) * W / n - 5, y - 7, 10, 14, cls, 3);
  };
  const row = (y, name, sub, n, cls) => { o += text(20, y - 2, name, 'tb') + text(20, y + 14, sub, 'ts'); strip(y, n, cls); };
  row(46, 'A', '100 words/min', 20, 'solid');
  row(96, 'B 原来', '50 words/min', 10, 'wash-strong');
  o += line(20, 128, 540, 128, 'grid');
  o += text(20, 148, 'B 和 A 说了一会儿之后，三种可能：', 'ts');
  row(180, 'full convergence', 'B：100，和 A 一样', 20, 'wash-strong');
  row(228, 'partial convergence', 'B：75，走了一半', 15, 'wash-strong');
  row(276, 'maintenance', 'B：50，不变', 10, 'wash-strong');
  const ya = 304, sx = lin(0, 12, x0, x1);
  o += line(x0, ya, x1, ya, 'axis');
  for (const t of [0, 3, 6, 9, 12]) o += line(sx(t), ya, sx(t), ya + 4, 'axis') + text(sx(t), ya + 17, t + ' s', 'ts', 'middle');
  o += text(x1, ya + 36, '每个小块是一个 word。12 秒里 A 说 20 个，B 原来说 10 个。', 'ts', 'end');
  return svg(560, ya + 44, o, 'Speech rate 的 accommodation：A 每分钟 100 个 word，B 原来每分钟 50 个；B 提到 100 是 full convergence，提到 75 是 partial convergence，留在 50 是 maintenance');
}

// Ferguson（1959）的四个 defining case
function ferguson() {
  let o = '';
  const C = [
    ['Arabic', 'Classical Arabic', 'Egyptian Arabic', ["'now'", "H  al'āna", "L  dilwa'ti"], ['H 3 个 case', 'L 没有 case']],
    ['Swiss German', 'Standard German', 'Swiss German', ['没有成对的词：', '差在规则的', 'sound correspondence'], ['H 4 个 case', 'L 3 个 case']],
    ['Modern Greek', 'katharévusa', 'dhimotikí', ["'house'", 'H  íkos', 'L  spíti'], ['H 4 个 case', 'L 3 个 case']],
    ['Haiti', 'French', 'Haitian Creole', ["'donkey'", 'H  âne', 'L  bourik'], ['H 有 gender、number', 'L 都没有']],
  ];
  const cw = 132, gx = 16;
  C.forEach(([name, h, l, lex, gram], i) => {
    const cx = gx + i * cw + cw / 2;
    o += text(cx, 22, name, 'tb', 'middle');
    o += rect(cx - 61, 34, 122, 46, 'solid', 6) + text(cx, 53, 'H', 'tw', 'middle') + text(cx, 71, h, 'tw', 'middle');
    o += rect(cx - 61, 88, 122, 46, 'wash', 6) + text(cx, 107, 'L', 'tb', 'middle') + text(cx, 125, l, 't', 'middle');
    lex.forEach((s, k) => { o += text(cx, 186 + k * 18, s, k === 0 && i !== 1 ? 'ts' : (i === 1 ? 'ts' : 't'), 'middle'); });
    gram.forEach((s, k) => { o += text(cx, 272 + k * 18, s, 't', 'middle'); });
    if (i) o += line(gx + i * cw, 14, gx + i * cw, 300, 'grid');
  });
  o += text(16, 162, 'Lexicon：同一个意思，H 和 L 各有一个词', 'tl');
  o += text(16, 250, 'Grammar：noun 上标多少东西', 'tl');
  o += text(280, 326, 'H 在学校学会，用于写作和正式场合；L 是每个人的 mother tongue，用于日常对话。', 'ts', 'middle');
  return svg(560, 334, o, 'Ferguson 的四个 defining case：Arabic 的 Classical 与 Egyptian、Swiss German 的 Standard German 与 Swiss German、Greek 的 katharévusa 与 dhimotikí、Haiti 的 French 与 Creole；每一列下面是一个 lexical doublet 和 noun 的 case 数');
}

// Fishman（1967）：diglossia 与 bilingualism 的四格
function fishman() {
  let o = '';
  const gx = 112, gy = 52, cw = 218, ch = 118;
  o += text(gx + cw / 2, 26, 'bilingualism：有', 'tb', 'middle') + text(gx + cw * 1.5, 26, 'bilingualism：没有', 'tb', 'middle');
  o += text(gx + cw / 2, 42, '多数人自己会两种 variety', 'ts', 'middle') + text(gx + cw * 1.5, 42, '多数人只会一种', 'ts', 'middle');
  o += text(12, gy + ch / 2 - 6, 'diglossia：有', 'tb') + text(12, gy + ch / 2 + 12, '社会给两种 variety', 'ts') + text(12, gy + ch / 2 + 28, '分好了用途', 'ts');
  o += text(12, gy + ch * 1.5 - 6, 'diglossia：没有', 'tb') + text(12, gy + ch * 1.5 + 12, '用途没有分开', 'ts');
  const cell = (c, r, cls, lines) => {
    const x = gx + c * cw, y = gy + r * ch;
    o += rect(x + 3, y + 3, cw - 6, ch - 6, cls, 6);
    lines.forEach(([s, k], j) => { o += text(x + 14, y + 26 + j * 20, s, k); });
  };
  cell(0, 0, 'wash', [['1. both', 'tb'], ['Paraguay：Spanish 与 Guaraní', 't'], ['Swiss-German cantons', 't'], ['人人会两种，各管各的 domain', 'ts']]);
  cell(1, 0, 'paper', [['3. diglossia without bilingualism', 'tb'], ['一战前的 European elite 之间', 't'], ['说 French，大众说别的 language', 't'], ['两边隔着 interpreter', 'ts']]);
  cell(0, 1, 'wash-strong', [['2. bilingualism without diglossia', 'tb'], ['工业化中的工人、移民家庭：', 't'], ['学校和工作的 language 进了家', 't'], ['tends to be transitional → shift', 'tl']]);
  cell(1, 1, 'paper', [['4. neither', 'tb'], ['很小、孤立、内部没有分化', 't'], ['的 community', 't'], ['easier to hypothesize than to find', 'ts']]);
  return svg(560, gy + 2 * ch + 8, o, 'Fishman 的四格：diglossia 是社会层面的用途分工，bilingualism 是个人层面会几种 variety；两者都有的如 Paraguay，只有 diglossia 的如一战前说 French 的 European elite，只有 bilingualism 的如工业化中的工人和移民家庭，这种情况往往是过渡性的，导向 language shift');
}

// Blom 与 Gumperz（1972）：situational 与 metaphorical switching
function hemnes() {
  let o = '';
  const bub = (x, y, w, who, code, cls) => {
    o += rect(x, y, w, 50, cls, 8);
    o += text(x + 12, y + 20, who, cls === 'solid' ? 'tw' : 'ts') + text(x + 12, y + 40, code, cls === 'solid' ? 'tw' : 'tb');
  };
  const panel = (x0, title, place, b1, b2, notes) => {
    o += text(x0 + 130, 22, title, 'tb', 'middle') + text(x0 + 130, 42, place, 'ts', 'middle');
    bub(x0 + 10, 58, 240, b1[0], b1[1], b1[2]);
    o += arrow(x0 + 130, 112, x0 + 130, 138, 'mute');
    bub(x0 + 10, 142, 240, b2[0], b2[1], b2[2]);
    notes.forEach(([s, k], j) => { o += text(x0 + 130, 222 + j * 18, s, k, 'middle'); });
  };
  panel(10, 'Situational switching', 'school（据 teacher 的描述）',
    ['teacher · lecture', 'Bokmål（standard）', 'solid'], ['teacher 与学生 · discussion', 'Ranamål（local）', 'wash'],
    [['activity 从 lecture 换成 discussion，', 'ts'], ['code 跟着 situation 一起换', 'tl']]);
  o += line(280, 14, 280, 270, 'grid');
  panel(290, 'Metaphorical switching', 'community administration office',
    ['clerk 与 resident · greeting', 'Ranamål（local）', 'wash'], ['同样两个人 · business', 'Bokmål（standard）', 'solid'],
    [['人、地点、rights and obligations 都没变，', 'ts'], ['local code 带进另一种关系的联想', 'tl']]);
  return svg(560, 270, o, 'Hemnesberget 的两种 switching：左边学校里 teacher 讲课用 Bokmål、讨论时换成 Ranamål，code 随 activity 变；右边办公室里 clerk 和 resident 寒暄用 Ranamål、办事用 Bokmål，situation 没变，switch 本身带来意义');
}

// Myers-Scotton（1993a: 40）：Nairobi 邮局里一次 marked choice，逐个 turn 出现
function postoffice() {
  let o = '';
  const turns = [
    [0, 'Swahili', 'ee-sema（“说吧”）：要办什么？'],
    [1, 'Swahili', '要一张 withdrawal form'],
    [0, 'Swahili', '先给我 passbook'],
    [1, 'Swahili', 'form 你先收着'],
    [0, 'Swahili', '今天不能取：离上次取款还不到七天'],
    [1, 'Luo', "Konya an marach 'Help, I'm in trouble'"],
    [0, 'Luo', "Anyalo konyi, kik inuo kendo 'I can help, but don't repeat it'"],
  ];
  const tw2 = (s) => { let w = 0; for (const ch of s) w += /[　-鿿＀-￯]/.test(ch) ? 13 : 7.1; return w; };
  const T = 14, kt = [0, 0.004, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66];
  o += text(20, 22, 'clerk', 'tb') + text(540, 22, 'customer', 'tb', 'end');
  turns.forEach(([who, lang, s], k) => {
    const y = 38 + k * 38, tag = (k + 1) + ' · ' + lang;
    const w = Math.min(520, tw2(s) + tw2(tag) * 0.9 + 40);
    const x = who === 0 ? 20 : 540 - w;
    const luo = lang === 'Luo';
    const on = kt.map((_, j) => j === 0 || j >= k + 1);
    o += `<g>${rect(x, y, w, 28, luo ? 'solid' : 'wash', 7)}${text(x + 10, y + 19, tag, luo ? 'tw' : 'ts')}${text(x + 18 + tw2(tag) * 0.9, y + 19, s, luo ? 'tw' : 't')}${ashow(on, kt, T)}</g>`;
  });
  o += text(280, 324, 'Turn 1–5 一直是 Swahili。被拒绝之后 customer 换成 Luo，clerk 也用 Luo 回答。', 'ts', 'middle');
  return svgA(560, 334, o, 'Nairobi 邮局的一段对话：clerk 和 customer 前五个 turn 都说 Swahili，clerk 说今天不能取款之后，customer 改用 Luo 求助，clerk 用 Luo 回答说能帮，但别再提');
}

// Singapore Chinese residents 的 home language：四次 census
function smc() {
  let o = '';
  const sx = lin(1975, 2030, 60, 480), sy = lin(0, 100, 262, 72);
  const data = [[1990, 50.3, 30.1, 19.3], [2000, 30.7, 45.1, 23.9], [2010, 19.2, 47.7, 32.6], [2020, 11.8, 40.2, 47.6]];
  o += line(sx(1975), sy(0), sx(2026), sy(0), 'axis');
  for (const v of [0, 50, 100]) o += line(sx(1975), sy(v), sx(1975) - 4, sy(v), 'axis') + text(sx(1975) - 7, sy(v) + 4, v + '%', 'ts', 'end');
  o += line(sx(1975), sy(0), sx(1975), sy(100), 'axis');
  for (const y of [1980, 1990, 2000, 2010, 2020]) o += line(sx(y), sy(0), sx(y), sy(0) + 4, 'axis') + text(sx(y), sy(0) + 18, String(y), 'ts', 'middle');
  const seg = [['wash2', 't'], ['wash-strong', 't'], ['solid', 'tw']];
  data.forEach(([yr, dd, mm, ee]) => {
    const vals = [dd, mm, ee];
    let acc = 0;
    vals.forEach((v, k) => {
      const ya = sy(acc + v), yb = sy(acc);
      o += rect(sx(yr) - 22, ya, 44, yb - ya, seg[k][0], 2);
      o += text(sx(yr), (ya + yb) / 2 + 4, v.toFixed(1), seg[k][1], 'middle');
      acc += v;
    });
  });
  // 2020 柱子右边直接标名字
  let acc = 0;
  [['Chinese dialects', 11.8], ['Mandarin', 40.2], ['English', 47.6]].forEach(([s, v]) => { o += text(sx(2020) + 30, sy(acc + v / 2) + 4, s, 'tb'); acc += v; });
  for (const [yr, s, yy] of [[1979, '1979 Speak Mandarin Campaign 开始', 40], [1994, '1994 起对象转向 English-educated Chinese', 58]]) {
    o += line(sx(yr), yy + 6, sx(yr), sy(0), 'dash') + text(sx(yr) + 4, yy, s, 'ts');
  }
  o += text(480, 300, 'Chinese residents，5 岁以上，在家最常说的 language（%）。数据：Census 1990–2020。', 'ts', 'end');
  return svg(560, 308, o, 'Singapore Chinese residents 在家最常说的 language：dialect 从 1990 年的 50.3% 降到 2020 年的 11.8%；Mandarin 从 30.1% 升到 2010 年的 47.7%，2020 年回落到 40.2%；English 从 19.3% 升到 47.6%');
}

// 同一组 age group，1990 → 2000 → 2020：dialect、Mandarin、English 的份额
function cohort() {
  const rows = ['5–14', '15–24', '25–39', '40–54', '55 & over'];
  const Y = {
    1990: [[18.9, 57.6, 23.3], [51.5, 28.5, 19.9], [44.8, 30.4, 24.6], [58.8, 24.8, 16.1], [87.7, 6.1, 5.3]],
    2000: [[4.3, 59.6, 35.8], [18.4, 59.8, 21.5], [28.0, 46.5, 25.2], [30.7, 43.9, 25.1], [71.8, 17.8, 9.9]],
    2020: [[0.4, 22.1, 77.4], [1.0, 29.6, 69.2], [3.0, 44.9, 51.5], [8.9, 45.0, 45.7], [27.4, 43.3, 29.0]],
  };
  const yrs = [1990, 1990, 2000, 2000, 2020, 2020, 1990];
  const kt = [0, 0.22, 0.34, 0.52, 0.64, 0.94, 1];
  const T = 12, x0 = 110, W = 340, sx = (p) => x0 + W * p / 100;
  const cls = ['wash2', 'wash-strong', 'solid'];
  let o = '';
  rows.forEach((r, i) => {
    const y = 58 + i * 46;
    o += text(x0 - 10, y + 19, r, 'tb', 'end');
    for (let k = 0; k < 3; k++) {
      const xs = yrs.map((yr) => sx(Y[yr][i].slice(0, k).reduce((a, b) => a + b, 0)));
      const ws = yrs.map((yr) => W * Y[yr][i][k] / 100);
      o += `<rect x="${f1(xs[0])}" y="${y}" width="${f1(ws[0])}" height="28" rx="2" class="${cls[k]}">${anim('x', xs.map(f1), kt, T)}${anim('width', ws.map(f1), kt, T)}</rect>`;
    }
    // 2020 年 dialect 的右边界：虚线一直留着
    const g = sx(Y[2020][i][0]);
    o += line(g, y - 4, g, y + 32, 'ln-dash');
    // 右边的数字：dialect 份额，随年份切换
    for (const yr of [1990, 2000, 2020]) {
      const on = yrs.map((q) => q === yr);
      o += `<text x="${x0 + W + 54}" y="${y + 19}" class="t" text-anchor="end" opacity="${on[0] ? 1 : 0}">${Y[yr][i][0].toFixed(1)}%${ashow(on, kt, T)}</text>`;
    }
  });
  o += text(x0 + W + 54, 44, 'dialect', 'ts', 'end');
  // 顶部标签跟着第一行的色块走
  const names = ['dialect', 'Mandarin', 'English'];
  for (let k = 0; k < 3; k++) {
    const cs = yrs.map((yr) => { const a = Y[yr][0].slice(0, k).reduce((p, q) => p + q, 0); return sx(a + Y[yr][0][k] / 2); });
    if (k === 0) continue;
    o += `<text x="${f1(cs[0])}" y="44" class="ts" text-anchor="middle">${names[k]}${anim('x', cs.map(f1), kt, T)}</text>`;
  }
  for (const yr of [1990, 2000, 2020]) {
    const on = yrs.map((q) => q === yr);
    o += `<text x="20" y="28" class="tbig" opacity="${on[0] ? 1 : 0}">${yr}${ashow(on, kt, T)}</text>`;
  }
  o += text(20, 300, '灰色是 dialect，浅色 Mandarin，深色 English。虚线是 2020 年 dialect 的位置。', 'ts');
  o += text(20, 318, 'Chinese residents 在家最常说的 language。数据：Census 1990、2000、2020。', 'ts');
  return svgA(560, 326, o, '五个 age group 在家最常说的 language 从 1990 到 2000 再到 2020 的变化：1990 年 55 岁以上 87.7% 说 dialect，5 到 14 岁 18.9%；2020 年分别是 27.4% 和 0.4%；每一个 age group 里 dialect 都在缩小，English 在扩大');
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
  'el1101e-accommodate': accommodate,
  'el1101e-ferguson': ferguson,
  'el1101e-fishman': fishman,
  'el1101e-hemnes': hemnes,
  'el1101e-postoffice': postoffice,
  'el1101e-smc': smc,
  'el1101e-cohort': cohort,
};
