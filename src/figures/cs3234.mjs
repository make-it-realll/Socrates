import { svg, svgA, d, path, line, rect, circle, text, arrow, anim, ashow, f1 } from '../lib/svg.mjs';

// 一个随时间跳到不同位置的高亮框：frames 是 [x, y, w, h]
const arect = (frames, kt, dur, cls, rx = 5) =>
  `<rect x="${f1(frames[0][0])}" y="${f1(frames[0][1])}" width="${f1(frames[0][2])}" height="${f1(frames[0][3])}" rx="${rx}" class="${cls}">` +
  ['x', 'y', 'width', 'height'].map((a, k) => anim(a, frames.map((f) => f1(f[k])), kt, dur, true)).join('') + '</rect>';
// 只在某几帧出现的文字
const stext = (x, y, s, cls, anchor, on, kt, dur) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${ashow(on, kt, dur)}</text>`;
// 等长的 keyTimes：n 帧，每帧 step 秒，最后一帧多停 hold 秒
const frames = (n, step, hold) => {
  const T = step * (n - 1) + hold, kt = [];
  for (let i = 0; i < n; i++) kt.push((step * i) / T);
  return { T, kt };
};

// ---------- 第 1 站：∨e 的 box proof ----------
function boxor() {
  let o = '';
  const row = (y, n, f, r, x0 = 40) => text(x0, y, n, 'ts', 'end') + text(x0 + 12, y, f, 't') + text(x0 + 12, y + 15, r, 'ts');
  o += row(28, '1', 'p ∧ (q ∨ r)', 'premise');
  o += row(66, '2', 'p', '∧e₁ 1');
  o += row(104, '3', 'q ∨ r', '∧e₂ 1');
  // 两个 box
  const B = (x, y, lines) => {
    let q = rect(x, y, 228, 124, 'wash', 6) + rect(x, y, 228, 124, 'frame', 6);
    lines.forEach(([n, f, r], k) => { q += row(y + 26 + k * 38, n, f, r, x + 28); });
    return q;
  };
  o += B(30, 126, [['4', 'q', 'assumption'], ['5', 'p ∧ q', '∧i 2, 4'], ['6', '(p ∧ q) ∨ (p ∧ r)', '∨i₁ 5']]);
  o += B(300, 126, [['7', 'r', 'assumption'], ['8', 'p ∧ r', '∧i 2, 7'], ['9', '(p ∧ q) ∨ (p ∧ r)', '∨i₂ 8']]);
  o += text(144, 268, 'case q：只在这个 box 里能用 q', 'ts', 'middle') + text(414, 268, 'case r：只在这个 box 里能用 r', 'ts', 'middle');
  o += row(300, '10', '(p ∧ q) ∨ (p ∧ r)', '∨e 3, 4–6, 7–9');
  o += text(300, 40, '两个 box 的最后一行必须是同一个 formula，', 'ts') + text(300, 58, '它才能被带出 box，写在第 10 行。', 'ts');
  o += text(300, 86, '第 2 行在 box 外，两个 box 里都能用。', 'ts');
  return svg(560, 322, o, 'p 且 (q 或 r) 推出 (p 且 q) 或 (p 且 r) 的 box proof：第 3 行的 disjunction 分成两个 box，各自假设 q 和 r，最后一行相同，由 or-elimination 带出');
}

// ---------- 第 2 站：DPLL 在 Paulson 的例子上（动图） ----------
function dpllA() {
  const root = '{¬Q, R}  {¬R, P}  {¬R, Q}  {¬P, Q, R}  {P, Q}  {¬P, ¬Q}';
  const L = [['{¬Q, R}  {¬R, Q}  {Q, R}  {¬Q}', 'P = 1'], ['{¬R}  {R}', 'unit ¬Q'], ['□', 'unit R']];
  const R = [['{¬Q, R}  {¬R}  {¬R, Q}  {Q}', 'P = 0'], ['{¬Q}  {Q}', 'unit ¬R'], ['□', 'unit ¬Q']];
  const ys = [118, 188, 258], cxL = 140, cxR = 420;
  let o = '';
  // 高亮框：按 depth-first 的顺序走
  const box = (cx, y, w) => [cx - w / 2, y - 18, w, 28];
  const seq = [box(280, 40, 380), box(cxL, ys[0], 230), box(cxL, ys[1], 110), box(cxL, ys[2], 50), box(cxR, ys[0], 230), box(cxR, ys[1], 110), box(cxR, ys[2], 50), box(280, 40, 380)];
  const { T, kt } = frames(seq.length, 2.2, 3.2);
  o += arect(seq, kt, T, 'wash-strong');
  o += text(280, 44, root, 't', 'middle');
  o += line(250, 60, cxL + 20, ys[0] - 22, 'ink') + line(310, 60, cxR - 20, ys[0] - 22, 'ink');
  o += text(200, 68, 'P = 1', 'tl', 'end') + text(360, 68, 'P = 0', 'tl', 'start');
  const col = (cx, items) => {
    items.forEach(([s, lab], k) => {
      o += text(cx, ys[k] + 4, s, k === 2 ? 'tbig' : 't', 'middle');
      if (k > 0) { o += arrow(cx, ys[k - 1] + 12, cx, ys[k] - 20, 'mute', 6) + text(cx + 8, (ys[k - 1] + ys[k]) / 2 + 2, lab, 'ts', 'start'); }
    });
    o += text(cx, ys[2] + 30, 'empty clause：这一支 unsatisfiable', 'ts', 'middle');
  };
  col(cxL, L);
  col(cxR, R);
  const cap = [
    '没有 unit clause，也没有 pure literal：只能 case split，选 P',
    'P = 1：删掉含 P 的 clause，从其余 clause 里删去 ¬P',
    '{¬Q} 是 unit clause：Q 只能是 0',
    'R 也被逼成 1，{¬R} 变空：P = 1 走不通，backtrack',
    'P = 0：删掉含 ¬P 的 clause，从其余 clause 里删去 P',
    '{¬R} 是 unit clause：R 只能是 0',
    '{Q} 与 {¬Q} 冲突，又是 empty clause',
    '两支都走不通：这 6 个 clause unsatisfiable',
  ];
  cap.forEach((s, k) => { o += stext(280, 330, s, 'tb', 'middle', seq.map((_, j) => j === k), kt, T); });
  return svgA(560, 340, o, '动图：DPLL 在 6 个 clause 上先 case split P，两支各自做两次 unit propagation，都得到 empty clause，所以 unsatisfiable');
}

// ---------- 第 3 站：Kripke model 反例 ----------
function kripke() {
  let o = '';
  const W0 = [150, 90], W1 = [410, 90], r = 34;
  o += circle(W0[0], W0[1], r, 'paper') + circle(W1[0], W1[1], r, 'paper');
  o += text(W0[0], W0[1] + 5, 'w₀', 'tb', 'middle') + text(W1[0], W1[1] + 5, 'w₁', 'tb', 'middle');
  o += arrow(W0[0] + r + 4, W0[1], W1[0] - r - 4, W1[1], 'ink');
  o += text(280, W0[1] - 10, '以后可能到达', 'ts', 'middle');
  o += text(W0[0], 30, '现在：还不知道 p', 'tl', 'middle') + text(W1[0], 30, '以后：p 被证明了', 'tl', 'middle');
  const list = (x, rows) => rows.forEach(([f, v], k) => { o += text(x - 8, 158 + k * 20, f, 't', 'end') + text(x + 8, 158 + k * 20, v, v === '✗' ? 'tl' : 't', 'start'); });
  list(W0[0], [['p', '✗'], ['¬p', '✗'], ['p ∨ ¬p', '✗'], ['¬¬p', '✓']]);
  list(W1[0], [['p', '✓'], ['¬p', '✗'], ['p ∨ ¬p', '✓'], ['¬¬p', '✓']]);
  o += text(280, 252, '¬p 在一个 world 成立，要求从它出发能到达的所有 world 都没有 p。', 'ts', 'middle');
  o += text(280, 270, 'w₀ 能到达 w₁，w₁ 有 p，所以 w₀ 上 ¬p 不成立；p 也不成立。', 'ts', 'middle');
  return svg(560, 280, o, '两个 world 的 Kripke model：w0 可以到达 w1，p 只在 w1 成立。在 w0 上 p 和 not p 都不成立，所以 p or not p 不成立，而 not not p 成立');
}

// ---------- 第 3 站：同一个 proof，两种写法 ----------
function curry() {
  let o = '';
  // 一棵两层的 derivation tree，左右各一棵
  const tree = (cx, a, b, c, dd, ra, rb, rc, rd) => {
    let q = '';
    q += text(cx - 70, 48, a[0], 't', 'middle') + text(cx + 70, 48, a[1], 't', 'middle');
    q += line(cx - 112, 58, cx - 28, 58, 'ink') + line(cx + 28, 58, cx + 112, 58, 'ink');
    q += text(cx - 24, 62, ra, 'ts', 'start') + text(cx + 116, 62, rb, 'ts', 'start');
    q += text(cx - 70, 78, b[0], 't', 'middle') + text(cx + 70, 78, b[1], 't', 'middle');
    q += line(cx - 118, 88, cx + 118, 88, 'ink') + text(cx + 122, 92, rc, 'ts', 'start');
    q += text(cx, 108, c, 't', 'middle');
    q += line(cx - 118, 118, cx + 118, 118, 'ink') + text(cx + 122, 122, rd, 'ts', 'start');
    q += text(cx, 140, dd, 't', 'middle');
    return q;
  };
  o += text(140, 18, 'natural deduction', 'tb', 'middle') + text(420, 18, 'proof term（program）', 'tb', 'middle');
  o += tree(126, ['u : A ∧ B', 'u : A ∧ B'], ['B', 'A'], 'B ∧ A', '(A ∧ B) ⊃ (B ∧ A)', '∧E₂', '∧E₁', '∧I', '⊃Iᵘ');
  // 右边：只写 term，按同样的位置
  const cx = 400;
  o += text(cx - 60, 48, 'u', 't', 'middle') + text(cx + 60, 48, 'u', 't', 'middle');
  o += line(cx - 92, 58, cx - 28, 58, 'ink') + line(cx + 28, 58, cx + 92, 58, 'ink');
  o += text(cx - 60, 78, 'snd u', 'tl', 'middle') + text(cx + 60, 78, 'fst u', 'tl', 'middle');
  o += line(cx - 100, 88, cx + 100, 88, 'ink');
  o += text(cx, 108, '⟨snd u, fst u⟩', 'tl', 'middle');
  o += line(cx - 100, 118, cx + 100, 118, 'ink');
  o += text(cx, 140, 'fn u ⇒ ⟨snd u, fst u⟩', 'tl', 'middle');
  const pairs = [['∧I（pair 两个 proof）', '⟨M, N⟩'], ['∧E₁ / ∧E₂', 'fst M / snd M'], ['⊃I（discharge 假设 u）', 'fn u ⇒ M'], ['⊃E（modus ponens）', 'M N（function application）']];
  o += line(30, 168, 530, 168, 'grid');
  pairs.forEach(([l, r], k) => { o += text(260, 192 + k * 22, l, 't', 'end') + text(280, 192 + k * 22, r, 'tl', 'start'); });
  return svg(560, 268, o, '左边是 A 且 B 推出 B 且 A 的 natural deduction tree，右边是同一棵树每个节点换成 proof term，最后得到 fn u 映到 snd u 与 fst u 组成的 pair；下方是 rule 与 term 的对应');
}

// ---------- 第 3 站：proof 的化简就是 program 的计算（动图） ----------
function reduceA() {
  const steps = [
    ['(fn u ⇒ fn w ⇒ (snd u) ((fst u) w)) ⟨fn x ⇒ x, fn y ⇒ y⟩', '⊃：(fn u ⇒ M) N ⇒ [N/u]M'],
    ['fn w ⇒ (snd ⟨fn x ⇒ x, fn y ⇒ y⟩) ((fst ⟨fn x ⇒ x, fn y ⇒ y⟩) w)', '∧：snd ⟨M, N⟩ ⇒ N'],
    ['fn w ⇒ (fn y ⇒ y) ((fst ⟨fn x ⇒ x, fn y ⇒ y⟩) w)', '∧：fst ⟨M, N⟩ ⇒ M'],
    ['fn w ⇒ (fn y ⇒ y) ((fn x ⇒ x) w)', '⊃：把 w 代入 x'],
    ['fn w ⇒ (fn y ⇒ y) w', '⊃：把 w 代入 y'],
    ['fn w ⇒ w', '没有 redex 了：normal form'],
  ];
  const y0 = 36, dy = 34;
  const seq = steps.map((_, k) => [14, y0 + k * dy - 19, 532, 28]);
  const { T, kt } = frames(steps.length, 2, 3);
  let o = arect(seq, kt, T, 'wash');
  steps.forEach(([s, r], k) => {
    o += text(24, y0 + k * dy, s, k === steps.length - 1 ? 'tl' : 't', 'start');
    o += stext(24, 250, '这一步用的 reduction：' + r, 'tb', 'start', steps.map((_, j) => j === k), kt, T);
  });
  o += text(24, 276, '每一步都是一个 introduction 紧接着同一个 connective 的 elimination，把这对拆掉。', 'ts', 'start');
  return svgA(560, 288, o, '动图：comp 作用在两个 identity function 组成的 pair 上，五步 reduction 后得到 fn w 映到 w；每一帧高亮当前这一行并写出所用的 reduction rule');
}

// ---------- 第 4 站：add_0_r 的 proof state（动图） ----------
function goalsA() {
  const script = ['Theorem add_0_r : forall n : nat, n + 0 = n.', 'Proof.', '  induction n as [| n\' IHn\'].', '  - reflexivity.', '  - simpl.', '    rewrite -> IHn\'.', '    reflexivity.', 'Qed.'];
  const st = [
    { at: 1, hyp: [], goal: ['forall n : nat, n + 0 = n'], note: '还没有开始：一个 goal' },
    { at: 2, hyp: [], goal: ['0 + 0 = 0', 'S n\' + 0 = S n\''], note: 'induction 给出两个 goal，第二个带着 IHn\'', hyp2: ['n\' : nat', 'IHn\' : n\' + 0 = n\''] },
    { at: 3, hyp: ['n\' : nat', 'IHn\' : n\' + 0 = n\''], goal: ['S n\' + 0 = S n\''], note: '0 + 0 按定义就是 0：第一个 goal 关掉' },
    { at: 4, hyp: ['n\' : nat', 'IHn\' : n\' + 0 = n\''], goal: ['S (n\' + 0) = S n\''], note: 'simpl 按 + 的第二条定义把 S 提到外面' },
    { at: 5, hyp: ['n\' : nat', 'IHn\' : n\' + 0 = n\''], goal: ['S n\' = S n\''], note: '用 IHn\' 把 n\' + 0 换成 n\'' },
    { at: 6, hyp: [], goal: [], note: 'No more goals：可以 Qed' },
  ];
  const { T, kt } = frames(st.length, 2.4, 3);
  let o = text(16, 20, 'proof script', 'tb', 'start') + text(318, 20, 'proof state（Coq 显示的）', 'tb', 'start');
  const ly = (k) => 46 + k * 24;
  o += arect(st.map((s) => [10, ly(s.at) - 17, 294, 24]), kt, T, 'wash-strong', 4);
  script.forEach((s, k) => { const ind = s.length - s.trimStart().length; o += text(16 + ind * 9, ly(k), s.trimStart(), 't', 'start'); });
  o += rect(312, 32, 240, 216, 'frame', 6);
  st.forEach((s, k) => {
    const on = st.map((_, j) => j === k);
    let y = 56;
    for (const h of s.hyp) { o += stext(324, y, h, 't', 'start', on, kt, T); y += 20; }
    if (s.goal.length) {
      o += `<g>${line(324, y - 8, 540, y - 8, 'ink')}${ashow(on, kt, T)}</g>`;
      y += 12;
      o += stext(324, y, s.goal[0], 'tl', 'start', on, kt, T);
      y += 24;
      if (s.goal.length > 1) {
        o += stext(324, y, '第 2 个 goal：', 'ts', 'start', on, kt, T); y += 20;
        for (const h of s.hyp2) { o += stext(324, y, h, 't', 'start', on, kt, T); y += 20; }
        o += `<g>${line(324, y - 8, 540, y - 8, 'ink')}${ashow(on, kt, T)}</g>`;
        o += stext(324, y + 12, s.goal[1], 't', 'start', on, kt, T);
      }
    } else o += stext(324, y + 8, 'No more goals.', 'tl', 'start', on, kt, T);
    o += stext(280, 276, s.note, 'tb', 'middle', on, kt, T);
  });
  return svgA(560, 288, o, '动图：Coq 里证明 n 加 0 等于 n，左边高亮当前执行的 tactic，右边是执行后的 hypothesis 和 goal');
}

// ---------- 第 5 站：一个 model，两种 quantifier 顺序 ----------
function model() {
  let o = '';
  const S = [[110, 80, 's₁'], [110, 170, 's₂']], I = [[330, 80, 'i₁'], [330, 170, 'i₂']];
  o += rect(60, 40, 100, 170, 'wash', 8) + rect(280, 40, 100, 170, 'wash', 8);
  o += text(110, 30, 'S（student）', 'tb', 'middle') + text(330, 30, 'I（instructor）', 'tb', 'middle');
  for (const [x, y, n] of [...S, ...I]) o += circle(x, y, 18, 'paper') + text(x, y + 5, n, 't', 'middle');
  o += arrow(130, 80, 310, 80, 'ln') + arrow(130, 170, 310, 170, 'ln');
  o += text(220, 72, 'Y（younger than）', 'ts', 'middle') + text(220, 162, 'Y', 'ts', 'middle');
  o += text(400, 62, 'universe 有 4 个 element', 'ts', 'start') + text(400, 80, 'Y 只有两对：', 'ts', 'start') + text(400, 98, '(s₁, i₁)，(s₂, i₂)', 'ts', 'start');
  o += text(30, 246, '∀x (S(x) → ∃y (I(y) ∧ Y(x, y)))', 't', 'start') + text(530, 246, 'true：s₁ 找 i₁，s₂ 找 i₂', 'tl', 'end');
  o += text(30, 272, '∃y (I(y) ∧ ∀x (S(x) → Y(x, y)))', 't', 'start') + text(530, 272, 'false：没有一个 instructor 比两人都大', 'tl', 'end');
  return svg(560, 284, o, '一个有两个 student、两个 instructor 的 model，younger-than 只连了 s1 到 i1、s2 到 i2。先 for all 再 exists 的句子为真，先 exists 再 for all 的句子为假');
}

// ---------- 第 6 站：add_acc 的 accumulator 一路在变（动图） ----------
function traddA() {
  const rows = [[3, 0], [2, 1], [1, 2], [0, 3]];
  const { T, kt } = frames(rows.length + 1, 1.6, 3.4);
  let o = text(30, 24, '计算 add_acc 3 0', 'tb', 'start');
  o += text(330, 24, '每一次 call 的两个 argument', 'tb', 'start');
  const y = (k) => 62 + k * 40;
  const seq = [...rows.map((_, k) => [22, y(k) - 22, 280, 32]), [22, y(4) - 22, 280, 32]];
  o += arect(seq, kt, T, 'wash-strong');
  rows.forEach(([n, m], k) => {
    o += text(36, y(k), (k ? '= ' : '') + `add_acc ${n} ${m}`, 't', 'start');
    if (k < 3) o += text(170, y(k), `← n = ${n} 是 S ${n - 1}，第二条 equation`, 'ts', 'start');
    // 右边的柱子
    const bx = 340 + k * 50;
    o += rect(bx, 200 - n * 30, 16, n * 30, 'solid2') + rect(bx + 18, 200 - m * 30, 16, m * 30, 'solid');
    o += text(bx + 17, 218, `第 ${k + 1} 次`, 'ts', 'middle');
  });
  o += text(36, y(4), '= 3', 'tl', 'start') + text(170, y(4), '← n = 0，第一条 equation', 'ts', 'start');
  o += rect(340, 236, 12, 12, 'solid2') + text(358, 247, 'n', 't', 'start') + rect(392, 236, 12, 12, 'solid') + text(410, 247, 'm（accumulator）', 't', 'start');
  o += text(30, 286, '第二个 argument 从 0 变成 1、2、3：关于 add_acc n′ 0 的 induction hypothesis 用不上，', 'ts', 'start');
  o += text(30, 304, '需要一个对所有 m 都成立的 statement。', 'ts', 'start');
  return svgA(560, 314, o, '动图：add_acc 3 0 逐步变成 add_acc 2 1、add_acc 1 2、add_acc 0 3、最后是 3；右边的柱子显示 n 每次减一、accumulator m 每次加一');
}

// ---------- 第 6 站：two-step induction 的窗口（动图） ----------
function ind2A() {
  const N = 9, x = (k) => 44 + k * 58, Y = 90;
  const { T, kt } = frames(7, 1.5, 3);
  let o = '';
  for (let k = 0; k < N; k++) o += circle(x(k), Y, 16, 'paper') + text(x(k), Y + 5, String(k), 't', 'middle');
  // 已经得到的 P(k)：第 i 帧时 0..i+1 都已经有
  for (let k = 0; k < N; k++) {
    const on = Array.from({ length: 7 }, (_, i) => k <= i + 1);
    o += `<g>${circle(x(k), Y, 16, 'solid')}<text x="${f1(x(k))}" y="${f1(Y + 5)}" class="tw" text-anchor="middle">${k}</text>${ashow(on, kt, T)}</g>`;
  }
  // 窗口 Q(i) = P(i) ∧ P(i+1)
  o += arect(Array.from({ length: 7 }, (_, i) => [x(i) - 26, Y - 28, 110, 56]), kt, T, 'ln-dash', 10);
  // 从 P(i) 指向 P(i+2) 的箭头
  for (let i = 0; i < 6; i++) {
    const on = Array.from({ length: 7 }, (_, j) => j === i + 1);
    o += `<g>${path(`M${x(i)} ${Y - 30} Q${x(i + 1)} ${Y - 80} ${x(i + 2) - 4} ${Y - 32}`, 'ln')}${ashow(on, kt, T)}</g>`;
    o += stext(x(i + 1), Y - 66, `由 P(${i}) 推出 P(${i + 2})`, 'tl', 'middle', on, kt, T);
  }
  o += stext(x(0) + 30, Y - 50, 'Q(0) = P(0) ∧ P(1)：两个 base case', 'tl', 'start', Array.from({ length: 7 }, (_, j) => j === 0), kt, T);
  o += text(280, 156, '虚线框是 Q(n) = P(n) ∧ P(n+1)。每一步只用 ordinary induction：', 'ts', 'middle');
  o += text(280, 174, '从 Q(n) 推出 Q(n+1)，新进框的 P(n+2) 由框里的 P(n) 推出。', 'ts', 'middle');
  return svgA(560, 184, o, '动图：0 到 8 九个数，虚线框框住相邻两个数表示 Q(n)，框每次右移一格，新进来的数由框中左边那个数往后跳两格推出');
}

// ---------- 第 7 站：assignment rule 从下往上算 ----------
function swapbk() {
  let o = '';
  const L = [
    ['{ X = m ∧ Y = n }', 'a', 'precondition'],
    ['{ (X+Y) − ((X+Y) − Y) = n ∧ (X+Y) − Y = m }', 'a', '下面那条里的 X 换成 X + Y'],
    ['X := X + Y;', 'c'],
    ['{ X − (X − Y) = n ∧ X − Y = m }', 'a', '下面那条里的 Y 换成 X − Y'],
    ['Y := X − Y;', 'c'],
    ['{ X − Y = n ∧ Y = m }', 'a', 'postcondition 里的 X 换成 X − Y'],
    ['X := X − Y', 'c'],
    ['{ X = n ∧ Y = m }', 'a', 'postcondition'],
  ];
  const y = (k) => 30 + k * 32;
  L.forEach(([s, t, note], k) => {
    o += text(34, y(k), s, t === 'c' ? 'tb' : (k === 0 || k === 7 ? 'tl' : 't'), 'start');
    if (note) o += text(540, y(k), note, 'ts', 'end');
  });
  // 往上的箭头
  for (const [from, to] of [[7, 5], [5, 3], [3, 1]]) o += arrow(20, y(from) - 10, 20, y(to) + 2, 'ln', 6);
  o += text(280, 284, '只有最上面一步要算：(X+Y) − ((X+Y) − Y) 化简是 Y，(X+Y) − Y 化简是 X。', 'ts', 'middle');
  return svg(560, 294, o, '用加减交换两个变量的 decorated program：从 postcondition 开始，每过一条 assignment 就把被赋值的变量替换成右边的 expression，箭头从下往上');
}

// ---------- 第 7 站：loop invariant 在循环中保持不变（动图） ----------
function invA() {
  const st = [[3, 5], [2, 4], [1, 3], [0, 2]];
  const { T, kt } = frames(st.length, 1.8, 3.2);
  let o = text(20, 22, 'while X ≠ 0 do  Y := Y − 1;  X := X − 1  end', 'tb', 'start');
  o += text(20, 42, '开始时 X = m = 3，Y = n = 5', 'ts', 'start');
  const base = 230, u = 28;
  // X、Y 两根柱子，高度动画
  const bar = (bx, vals, cls, name) => {
    const ys = vals.map((v) => f1(base - v * u)), hs = vals.map((v) => f1(v * u));
    o += `<rect x="${bx}" y="${ys[0]}" width="44" height="${hs[0]}" class="${cls}">${anim('y', ys, kt, T, true)}${anim('height', hs, kt, T, true)}</rect>`;
    o += text(bx + 22, base + 18, name, 'tb', 'middle');
    vals.forEach((v, k) => { o += stext(bx + 22, base - v * u - 8, String(v), 't', 'middle', st.map((_, j) => j === k), kt, T); });
  };
  o += line(40, base, 240, base, 'axis');
  bar(70, st.map((s) => s[0]), 'solid2', 'X');
  bar(150, st.map((s) => s[1]), 'solid', 'Y');
  // 读数
  const X = 290;
  st.forEach(([a, b], k) => {
    const on = st.map((_, j) => j === k);
    o += stext(X, 90, k === 0 ? '进入 loop 之前' : `第 ${k} 次执行 body 之后`, 'tb', 'start', on, kt, T);
    o += stext(X, 118, `X = ${a}，Y = ${b}`, 't', 'start', on, kt, T);
    o += stext(X, 146, `Y − X = ${b} − ${a} = ${b - a}`, 'tl', 'start', on, kt, T);
    o += stext(X, 174, a === 0 ? 'guard X ≠ 0 为 false：退出' : 'guard X ≠ 0 为 true：再执行一次', 'ts', 'start', on, kt, T);
  });
  o += text(X, 214, 'n − m = 5 − 3 = 2 始终不变。', 'ts', 'start');
  o += text(X, 232, '退出时 X = 0，于是 Y = n − m。', 'ts', 'start');
  return svgA(560, 254, o, '动图：slow subtraction 循环，m 等于 3、n 等于 5；X 和 Y 两根柱子每轮各减 1，右边读数显示 Y 减 X 一直等于 2，X 到 0 时退出');
}

// ---------- 第 8 站：Prolog 的 search tree（动图） ----------
function sldA() {
  const N = {
    root: [280, 34, '?- k(Y).'],
    a: [280, 92, 'f(V), g(V), h(V)'],
    b1: [150, 158, 'g(a), h(a)'],
    b2: [410, 158, 'g(b), h(b)'],
    c1: [150, 218, 'h(a)'],
    c2: [410, 218, 'h(b)'],
    d1: [150, 274, '✗ 没有 clause 的 head 是 h(a)'],
    d2: [410, 274, '□  成功：Y = b'],
  };
  let o = '';
  const E = (p, q, lab, side = 1) => {
    const [x1, y1] = N[p], [x2, y2] = N[q];
    o += line(x1, y1 + 8, x2, y2 - 16, 'mute');
    // 斜的边：标注再往外挪，避开线
    const slant = x1 !== x2 ? 40 : 10, up = x1 !== x2 ? -8 : 2;
    if (lab) o += text((x1 + x2) / 2 + side * slant, (y1 + y2) / 2 + up, lab, 'ts', side > 0 ? 'start' : 'end');
  };
  E('root', 'a', 'k(X) :- f(X), g(X), h(X)，Y = V');
  E('a', 'b1', 'f(a)，V = a', -1); E('a', 'b2', 'f(b)，V = b');
  E('b1', 'c1', 'g(a)'); E('b2', 'c2', 'g(b)'); E('c1', 'd1', ''); E('c2', 'd2', 'h(b)');
  const order = ['root', 'a', 'b1', 'c1', 'd1', 'b2', 'c2', 'd2'];
  const w = { root: 90, a: 140, b1: 100, b2: 100, c1: 60, c2: 60, d1: 200, d2: 130 };
  const { T, kt } = frames(order.length, 1.6, 3.4);
  o += arect(order.map((k) => [N[k][0] - w[k] / 2, N[k][1] - 18, w[k], 26]), kt, T, 'wash-strong');
  for (const k in N) o += text(N[k][0], N[k][1], N[k][2], k === 'd2' ? 'tl' : 't', 'middle');
  const cap = ['query 和 rule 的 head unify', '从左往右：先解 f(V)，按顺序先试 f(a)', 'f(a) 留下一个 choice point（还有 f(b)）', 'g(a) 是 fact，剩 h(a)', 'h(a) 失败：回到最近的 choice point', 'backtrack：撤销 V = a，改试 f(b)', 'g(b) 是 fact，剩 h(b)', 'h(b) 是 fact，goal 清空：答案 Y = b'];
  cap.forEach((s, k) => { o += stext(280, 318, s, 'tb', 'middle', order.map((_, j) => j === k), kt, T); });
  return svgA(560, 328, o, '动图：Prolog 解 k(Y) 的 search tree。先试 V 等于 a，到 h(a) 失败后 backtrack，再试 V 等于 b，三个 goal 都成功，答案 Y 等于 b');
}

// ---------- 第 8 站：unification 是两棵 term tree 对齐 ----------
function unify() {
  let o = '';
  const node = (x, y, s, cls = 't') => circle(x, y, 15, 'paper') + text(x, y + 5, s, cls, 'middle');
  const lnk = (x1, y1, x2, y2) => line(x1, y1 + 15, x2, y2 - 15, 'mute');
  // 左：f(X, X)
  o += lnk(110, 50, 70, 120) + lnk(110, 50, 150, 120);
  o += node(110, 50, 'f') + node(70, 120, 'X', 'tl') + node(150, 120, 'X', 'tl');
  o += text(110, 20, 'f(X, X)', 'tb', 'middle');
  // 右：f(g(a, Y), g(Y, a))
  const R = { f: [400, 50], g1: [330, 120], g2: [470, 120], a1: [300, 190], y1: [360, 190], y2: [440, 190], a2: [500, 190] };
  o += lnk(...R.f, ...R.g1) + lnk(...R.f, ...R.g2) + lnk(...R.g1, ...R.a1) + lnk(...R.g1, ...R.y1) + lnk(...R.g2, ...R.y2) + lnk(...R.g2, ...R.a2);
  o += node(...R.f, 'f') + node(...R.g1, 'g') + node(...R.g2, 'g') + node(...R.a1, 'a') + node(...R.y1, 'Y', 'tl') + node(...R.y2, 'Y', 'tl') + node(...R.a2, 'a');
  o += text(400, 20, 'f(g(a, Y), g(Y, a))', 'tb', 'middle');
  // 对应关系
  // 对应关系：编号写在两边对应的 node 旁边
  o += text(70, 158, '①', 'tl', 'middle') + text(150, 158, '②', 'tl', 'middle');
  o += text(306, 106, '①', 'tl', 'end') + text(494, 106, '②', 'tl', 'start');
  o += text(30, 196, '① X ≐ g(a, Y)', 'tl', 'start') + text(30, 220, '② X ≐ g(Y, a)', 'tl', 'start');
  o += text(30, 260, '由 ①，X 换成 g(a, Y)；② 变成 g(a, Y) ≐ g(Y, a)，逐个 argument 比：a ≐ Y，Y ≐ a。', 'ts', 'start');
  o += text(30, 280, 'Most general unifier：X = g(a, a)，Y = a。两边都变成 f(g(a, a), g(a, a))。', 'ts', 'start');
  return svg(560, 290, o, '两个 term 画成 tree：f(X, X) 和 f(g(a, Y), g(Y, a))。根相同，两个 X 分别对上两个 g 子树，得到 X 等于 g(a, a)、Y 等于 a');
}

// ---------- 第 8 站：同样的 logic，不同的 clause 顺序 ----------
function descend() {
  let o = '';
  o += text(140, 20, 'descend1：先用 child', 'tb', 'middle') + text(420, 20, 'descend2：先递归', 'tb', 'middle');
  const ch = ['descend(martha, rose)', 'child(martha, Z₁), descend(Z₁, rose)', 'descend(charlotte, rose)', 'descend(caroline, rose)', 'descend(laura, rose)', 'child(laura, rose)  □'];
  ch.forEach((s, k) => {
    o += text(140, 50 + k * 42, s, k === 5 ? 'tl' : 't', 'middle');
    if (k < 5) o += arrow(140, 56 + k * 42, 140, 76 + k * 42, 'mute', 5);
  });
  o += text(150, 50 + 2 * 42 - 22, 'Z₁ = charlotte', 'ts', 'start');
  const lp = ['descend(martha, rose)', 'descend(W₁, rose), child(martha, W₁)', 'descend(W₂, rose), child(W₁, W₂), …', 'descend(W₃, rose), …', '……'];
  lp.forEach((s, k) => {
    o += text(420, 50 + k * 42, s, 't', 'middle');
    if (k < 4) o += arrow(420, 56 + k * 42, 420, 76 + k * 42, 'ln', 5);
  });
  o += text(420, 264, '最左边的 goal 永远是 descend(Wᵢ, rose)，', 'ts', 'middle') + text(420, 282, '一个 child fact 都没碰到：out of stack', 'ts', 'middle');
  o += line(280, 34, 280, 290, 'grid');
  return svg(560, 296, o, '左边 descend1 先查 child 再递归，沿 martha、charlotte、caroline、laura 走到 rose 成功；右边 descend2 先递归，最左边的 goal 永远是新的 descend(W, rose)，无限下去');
}

// ---------- 第 3 站：∃e 的 box 里有一个 fresh variable ----------
function boxex() {
  let o = '';
  const row = (y, n, f, r, x0 = 40) => text(x0, y, n, 'ts', 'end') + text(x0 + 12, y, f, 't') + text(x0 + 220, y, r, 'ts');
  o += row(26, '1', '∀x (P(x) → Q(x))', 'premise');
  o += row(56, '2', '∃x P(x)', 'premise');
  o += rect(30, 74, 330, 146, 'wash', 6) + rect(30, 74, 330, 146, 'frame', 6);
  o += text(44, 94, 'x₀', 'tl', 'start') + text(66, 94, '（fresh：别处都没出现过）', 'ts', 'start');
  o += row(126, '3', 'P(x₀)', 'assumption', 60);
  o += row(158, '4', 'P(x₀) → Q(x₀)', '∀e 1', 60);
  o += row(190, '5', 'Q(x₀)', '→e 4, 3', 60);
  o += row(250, '6', '∃x Q(x)', '∃i 5', 40);
  o += row(282, '7', '∃x Q(x)', '∃e 2, 3–6', 40);
  o += text(380, 120, '第 3 行：给 ∃x P(x) 的那个', 'ts', 'start') + text(380, 138, 'witness 起名 x₀，只知道 P(x₀)。', 'ts', 'start');
  o += text(380, 178, '第 4 行：∀x 对任何 term 成立，', 'ts', 'start') + text(380, 196, '包括 x₀。', 'ts', 'start');
  o += text(380, 246, '第 6 行不含 x₀：', 'ts', 'start') + text(380, 264, '结论和 witness 叫什么无关，', 'ts', 'start') + text(380, 282, '所以能带出 box。', 'ts', 'start');
  return svg(560, 294, o, '从 for all x P(x) 推出 Q(x)，以及 exists x P(x)，推出 exists x Q(x) 的 box proof：box 里引入 fresh variable x0 并假设 P(x0)，推出 Q(x0) 后用 exists-introduction，最后由 exists-elimination 带出');
}

// ---------- 第 2 站：resolution 推出 empty clause ----------
function resol() {
  let o = '';
  const N = [
    [70, 46, '{H}', 'tl'], [220, 46, '{¬H, M, N}', 't'],
    [145, 116, '{M, N}', 't'], [295, 116, '{¬M, P}', 't'],
    [220, 186, '{N, P}', 't'], [370, 186, '{¬N, P}', 't'],
    [295, 256, '{P}', 't'], [445, 256, '{¬P}', 'tl'],
    [370, 326, '{ }', 'tbig'],
  ];
  const E = [[0, 2], [1, 2], [2, 4], [3, 4], [4, 6], [5, 6], [6, 8], [7, 8]];
  for (const [a, b] of E) o += line(N[a][0], N[a][1] + 8, N[b][0], N[b][1] - 16, 'mute');
  for (const [x, y, s, c] of N) o += text(x, y, s, c, 'middle');
  const on = [['H', 2], ['M', 4], ['N', 6], ['P', 8]];
  for (const [v, k] of on) o += text(N[k][0] - 40, N[k][1] - 22, `resolve on ${v}`, 'ts', 'end');
  o += text(370, 350, 'empty clause：clause set unsatisfiable', 'ts', 'middle');
  o += text(540, 50, '没用上：{¬M, K}  {¬N, L}', 'ts', 'end');
  o += text(540, 68, '（K、L 是 pure literal）', 'ts', 'end');
  o += text(540, 110, '主题色的两个 clause 来自', 'ts', 'end') + text(540, 128, 'negated goal ¬(H → P)', 'ts', 'end');
  return svg(560, 360, o, 'Resolution 的推导树：H 与 not H or M or N 得到 M or N，再依次与 not M or P、not N or P、not P resolve，得到 P，最后得到 empty clause');
}

// ---------- 第 7 站：compile 出的 byte code 在 VM 上跑（动图） ----------
function vmA() {
  let o = '';
  const T0 = { mi: [100, 54, 'Minus'], l10: [52, 124, 'Lit 10'], pl: [150, 124, 'Plus'], l3: [110, 194, 'Lit 3'], l4: [192, 194, 'Lit 4'] };
  const tl = (a, b) => line(T0[a][0], T0[a][1] + 10, T0[b][0], T0[b][1] - 16, 'mute');
  o += tl('mi', 'l10') + tl('mi', 'pl') + tl('pl', 'l3') + tl('pl', 'l4');
  o += text(100, 22, 'source：arithmetic expression', 'tb', 'middle');
  const code = [['PUSH 10', 'l10'], ['PUSH 3', 'l3'], ['PUSH 4', 'l4'], ['ADD', 'pl'], ['SUB', 'mi']];
  const stacks = [[], [10], [10, 3], [10, 3, 4], [10, 7], [3]];
  const n = stacks.length;
  const { T, kt } = frames(n, 1.8, 3.2);
  const nodeBox = (k) => { const [x, y] = T0[k]; return [x - 34, y - 18, 68, 26]; };
  // 高亮：第 0 帧什么都不亮（放在画布外），之后依次是第 k 条 instruction 和它来自的 node
  const off = [-100, -100, 1, 1];
  o += arect([off, ...code.map(([, k]) => nodeBox(k))], kt, T, 'wash-strong');
  const cy = (k) => 64 + k * 32;
  o += arect([off, ...code.map((_, k) => [262, cy(k) - 19, 96, 27])], kt, T, 'wash-strong');
  for (const k in T0) o += text(T0[k][0], T0[k][1], T0[k][2], 't', 'middle');
  o += text(310, 22, 'byte code', 'tb', 'middle');
  code.forEach(([s], k) => { o += text(272, cy(k), s, 't', 'start'); });
  o += text(470, 22, 'stack（顶在上）', 'tb', 'middle');
  const base = 236, h = 30;
  o += line(420, base, 520, base, 'axis');
  stacks.forEach((st, f) => {
    const on = stacks.map((_, j) => j === f);
    let g = '';
    st.forEach((v, i) => {
      const y = base - (i + 1) * h;
      g += rect(430, y, 80, h - 4, i === st.length - 1 ? 'solid' : 'paper', 4) + `<text x="470" y="${y + 18}" class="${i === st.length - 1 ? 'tw' : 't'}" text-anchor="middle">${v}</text>`;
    });
    if (!st.length) g += text(470, base - 12, 'empty', 'ts', 'middle');
    o += `<g>${g}${ashow(on, kt, T)}</g>`;
  });
  const cap = [
    'translate：先左 subtree，再右 subtree，最后是这个 node 的 operator',
    'PUSH 10：把 10 压上 stack',
    'PUSH 3',
    'PUSH 4',
    'ADD：弹出 4 和 3，压入 3 + 4 = 7',
    'SUB：弹出 7 和 10，压入 10 − 7 = 3；stack 上恰好一个数：结果是 3',
  ];
  cap.forEach((s, k) => { o += stext(280, 284, s, 'tb', 'middle', stacks.map((_, j) => j === k), kt, T); });
  return svgA(560, 296, o, '动图：Minus(Lit 10, Plus(Lit 3, Lit 4)) 编译成 PUSH 10、PUSH 3、PUSH 4、ADD、SUB 五条 instruction；每一帧高亮一条 instruction 和它对应的 tree node，右边显示执行后的 stack，最后 stack 上只剩 3');
}

export default {
  'cs3234-boxex': boxex,
  'cs3234-resol': resol,
  'cs3234-vm': vmA,
  'cs3234-boxor': boxor,
  'cs3234-dpll': dpllA,
  'cs3234-kripke': kripke,
  'cs3234-curry': curry,
  'cs3234-reduce': reduceA,
  'cs3234-goals': goalsA,
  'cs3234-model': model,
  'cs3234-tradd': traddA,
  'cs3234-ind2': ind2A,
  'cs3234-swap': swapbk,
  'cs3234-inv': invA,
  'cs3234-sld': sldA,
  'cs3234-unify': unify,
  'cs3234-descend': descend,
};
