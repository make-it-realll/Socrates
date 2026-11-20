import { svg, lin, line, rect, circle, poly, text, arrow, path, d } from '../lib/svg.mjs';

// Bentham 的四种 cases unmeet for punishment：四道依次检查的问题
function bentham() {
  const qs = [
    ['这个 act 造成了 mischief 吗？', 'groundless', '没有 mischief 需要防止'],
    ['Punishment 能防止这种 mischief 吗？', 'inefficacious', '例如 ex post facto law'],
    ['它防止的 mischief 大于它自己造成的吗？', 'unprofitable', '罚的代价超过 offence'],
    ['只有 punishment 能达到这个目的吗？', 'needless', '有更便宜的办法'],
  ];
  let o = '';
  const X = 30, W = 300, H = 40, R = 390, RW = 150;
  qs.forEach(([q, name, note], i) => {
    const y = 18 + i * 66;
    o += rect(X, y, W, H, 'paper', 6) + text(X + W / 2, y + 25, q, 't', 'middle');
    o += arrow(X + W + 2, y + H / 2, R - 2, y + H / 2, 'mute') + text((X + W + R) / 2, y + H / 2 - 6, '否', 'ts', 'middle');
    o += rect(R, y, RW, H, 'wash2', 6) + text(R + RW / 2, y + 17, name, 'tb', 'middle') + text(R + RW / 2, y + 33, note, 'ts', 'middle');
    o += arrow(X + W / 2, y + H + 2, X + W / 2, y + 64, 'ink') + text(X + W / 2 + 8, y + H + 17, '是', 'ts');
  });
  const y = 18 + 4 * 66;
  o += rect(X, y, W, H, 'solid', 6) + text(X + W / 2, y + 25, 'Punishment 有 utilitarian 的理由', 'tw', 'middle');
  o += text(R + RW / 2, y + 17, '右边任何一格成立：', 'ts', 'middle') + text(R + RW / 2, y + 33, '不该 punish', 'ts', 'middle');
  return svg(560, 330, o, 'Bentham 的四种不该惩罚的情形画成四道依次检查的问题：有没有 mischief，能不能防止，值不值得，有没有更便宜的办法；四道都通过才有惩罚的理由');
}

// Hart：三个 defect 与三种 secondary rule
function hart() {
  let o = '';
  const rows = [
    ['Uncertainty', '不知道 rule 有哪些', 'Rule of recognition', '什么算本体系的 rule'],
    ['Static', 'Rule 改不快', 'Rules of change', '谁可以立、改、废'],
    ['Inefficiency', '违规与否无人裁决', 'Rules of adjudication', '谁可以权威地裁决'],
  ];
  o += text(120, 22, '只有 primary rules 的社会', 'tb', 'middle') + text(430, 22, 'Secondary rules（关于 rule 的 rule）', 'tb', 'middle');
  rows.forEach(([a, an, b, bn], i) => {
    const y = 40 + i * 62;
    o += rect(30, y, 180, 46, 'wash2', 6) + text(120, y + 20, a, 'tb', 'middle') + text(120, y + 37, an, 'ts', 'middle');
    o += arrow(214, y + 23, 326, y + 23, 'ink') + text(270, y + 16, '补救', 'ts', 'middle');
    o += rect(330, y, 200, 46, 'wash', 6) + text(430, y + 20, b, 'tl', 'middle') + text(430, y + 37, bn, 'ts', 'middle');
  });
  o += line(30, 236, 530, 236, 'grid');
  o += text(280, 258, 'Legal system 存在：valid 的 primary rules 大体被遵守，', 't', 'middle');
  o += text(280, 278, '并且 officials 对 secondary rules 持 internal point of view。', 't', 'middle');
  return svg(560, 290, o, '只有 primary rules 的社会有三个缺陷：不确定、僵化、低效；分别由 rule of recognition、rules of change、rules of adjudication 补救');
}

// Grudge informer：时间线与四条出路
function grudge() {
  let o = '';
  const sx = lin(1932, 1962, 50, 520), Y = 78;
  o += line(40, Y, 530, Y, 'axis');
  const ev = [
    [1934, '1934', 'statute', -1],
    [1938, '1938', 'wartime statute', 1],
    [1944, '1944', '告发丈夫', -1],
    [1949, '1949', '妻子被 convict', 1],
    [1952, '1952', 'BGH 同类案件', -1],
    [1958, '1958', 'Hart–Fuller', 1],
    [1960, '1960', 'Pappe 更正', -1],
  ];
  for (const [yr, a, b, side] of ev) {
    const x = sx(yr);
    o += circle(x, Y, 4, yr === 1949 ? 'ln-f' : 'ink-f');
    if (side < 0) o += text(x, Y - 30, a, 'tb', 'middle') + text(x, Y - 14, b, 'ts', 'middle');
    else o += text(x, Y + 22, a, 'tb', 'middle') + text(x, Y + 38, b, 'ts', 'middle');
  }
  const boxes = [
    ['① 放过她', ['承认她当时合法'], '代价：告发者不受罚', ['Hart 认为诚实', '的选项之一']],
    ['② 新立法', ['新 statute 对过去', '生效（retroactive）'], '代价：retroactivity', ['Hart、Fuller', '都倾向于此']],
    ['③ 宣布不是 law', ['Statute 违反', 'justice 而无效'], '代价：court 自定标准', ['Radbruch；', '1996 BVerfG']],
    ['④ 按当时的 law 读', ['当时的 law 本身', '就不保护她'], '代价：解释可能牵强', ['Pappe 所述；', '2001 ECtHR']],
  ];
  const BW = 124, gap = 8, y0 = 140;
  boxes.forEach(([t, lines, cost, who], i) => {
    const x = 20 + i * (BW + gap), cx = x + BW / 2;
    o += rect(x, y0, BW, 146, i === 2 ? 'wash' : 'wash2', 6);
    o += text(cx, y0 + 22, t, i === 2 ? 'tl' : 'tb', 'middle');
    lines.forEach((s, j) => { o += text(cx, y0 + 44 + j * 16, s, 'ts', 'middle'); });
    o += text(cx, y0 + 92, cost, 'ts', 'middle');
    o += line(x + 10, y0 + 104, x + BW - 10, y0 + 104, 'grid') + text(cx, y0 + 122, who[0], 'ts', 'middle') + text(cx, y0 + 138, who[1], 'ts', 'middle');
  });
  return svg(560, 298, o, '上方是 1934 年到 1960 年的时间线，下方是处理告发者的四条出路：放过她、retroactive legislation、宣布 statute 不是 law、按当时的 law 本身 convict，以及各自的代价和支持者');
}

// Radbruch 公式：不公正程度的门槛
function radbruch() {
  let o = '';
  const L = 40, T = 380, Rr = 520, y = 60, h = 56;
  o += rect(L, y, T - L, h, 'wash2') + rect(T, y, Rr - T, h, 'wash');
  o += text((L + T) / 2, y + 24, 'Positive law 优先', 'tb', 'middle') + text((L + T) / 2, y + 42, '即使内容不公正：legal certainty 本身是价值', 'ts', 'middle');
  o += text((T + Rr) / 2, y + 24, '让位于 justice', 'tl', 'middle') + text((T + Rr) / 2, y + 42, '“flawed law”', 'ts', 'middle');
  o += line(T, y - 18, T, y + h + 10, 'ln-dash') + text(T, y - 24, 'intolerable 的门槛', 'tl', 'middle');
  o += arrow(L, y + h + 26, Rr + 8, y + h + 26, 'axis') + text(L, y + h + 44, 'Statute 与 justice 冲突的程度', 'ts') + text(Rr + 8, y + h + 44, '更严重 →', 'ts', 'end');
  // 两个例子的位置
  const ex = [[200, '大多数不公正的 statute'], [460, '东德边境射杀（1996 BVerfG）']];
  for (const [x, s] of ex) o += circle(x, y + h + 26, 4.5, x > T ? 'ln-f' : 'ink-f') + text(x, y + h + 64, s, 'ts', 'middle');
  o += rect(L, 210, Rr - L, 34, 'paper', 6) + text(280, 232, '另一个独立条件：制定时有意否定人与人的 equality，这样的 statute 根本不具有 law 的性质', 'ts', 'middle');
  return svg(560, 256, o, 'Radbruch formula：statute 不公正的程度在 intolerable 门槛以下时 positive law 优先，越过门槛则让位于 justice；另有一个独立条件是有意否定 equality');
}

// Rule 与 principle：开关与天平
function weigh() {
  let o = '';
  o += text(135, 22, 'Rule：all-or-nothing', 'tb', 'middle') + text(420, 22, 'Principle：有 weight', 'tb', 'middle');
  o += line(275, 10, 275, 250, 'grid');
  // 左：rule
  o += rect(25, 44, 220, 44, 'paper', 6) + text(135, 64, 'Will 有三个 witness 吗？', 't', 'middle') + text(135, 80, '（条件）', 'ts', 'middle');
  o += arrow(85, 90, 70, 136, 'ink') + arrow(185, 90, 200, 136, 'ink');
  o += text(64, 116, '是', 'ts', 'end') + text(206, 116, '否', 'ts');
  o += rect(18, 140, 104, 40, 'wash', 6) + text(70, 165, 'Will valid', 'tl', 'middle');
  o += rect(148, 140, 104, 40, 'wash2', 6) + text(200, 158, 'Rule 不适用', 't', 'middle') + text(200, 173, '不起作用', 'ts', 'middle');
  o += text(135, 212, '适用就决定结果；', 'ts', 'middle') + text(135, 228, '两条 rule 冲突，必有一条不 valid', 'ts', 'middle');
  // 右：天平，左盘下沉
  const P = [420, 120], ang = 0.14, half = 92;
  const A = [P[0] - half * Math.cos(ang), P[1] + half * Math.sin(ang)], B = [P[0] + half * Math.cos(ang), P[1] - half * Math.sin(ang)];
  o += poly([[P[0], P[1] + 2], [P[0] - 16, 198], [P[0] + 16, 198]], 'wash2') + line(P[0] - 40, 198, P[0] + 40, 198, 'ink');
  o += line(A[0], A[1], B[0], B[1], 'ink-b') + circle(P[0], P[1], 3.5, 'ink-f');
  const pan = (Q, cls) => line(Q[0] - 26, Q[1] + 28, Q[0], Q[1], 'mute') + line(Q[0] + 26, Q[1] + 28, Q[0], Q[1], 'mute') + path(d([[Q[0] - 34, Q[1] + 28], [Q[0] + 34, Q[1] + 28], [Q[0] + 24, Q[1] + 38], [Q[0] - 24, Q[1] + 38]]) + 'Z', cls);
  o += pan(A, 'solid') + pan(B, 'solid2');
  o += text(A[0], A[1] + 58, 'No profit from', 'tl', 'middle') + text(A[0], A[1] + 74, 'own wrong', 'tl', 'middle');
  o += text(B[0], B[1] + 58, 'Statute 文字；', 'tb', 'middle') + text(B[0], B[1] + 74, 'legislative', 'tb', 'middle') + text(B[0], B[1] + 90, 'supremacy', 'tb', 'middle');
  o += text(420, 246, 'Riggs：Earl 认为左边重，Gray 认为右边重', 'ts', 'middle');
  return svg(560, 258, o, '左边：rule 像开关，条件满足就决定结果。右边：principle 像天平上的砝码，Riggs v Palmer 中“不得从自己的错误获益”与“按 statute 文字”两边都适用，多数意见认为前者更重');
}

// Coase：每头牛的边际利润与边际损失
function coase() {
  const profit = [5, 4, 3.5, 1.5], damage = [1, 2, 3, 4];
  const sy = lin(0, 5.5, 236, 30), x0 = 70, gw = 80;
  let o = '';
  for (const v of [1, 2, 3, 4, 5]) o += line(x0 - 4, sy(v), x0 + 4 * gw + 10, sy(v), 'grid') + text(x0 - 8, sy(v) + 4, String(v), 'ts', 'end');
  o += line(x0, sy(0), x0 + 4 * gw + 10, sy(0), 'axis') + line(x0, sy(0), x0, sy(5.5), 'axis');
  o += text(x0 - 6, 18, '元', 'ts', 'end');
  for (let i = 0; i < 4; i++) {
    const gx = x0 + 12 + i * gw, bw = 26;
    o += rect(gx, sy(profit[i]), bw, sy(0) - sy(profit[i]), 'solid2') + text(gx + bw / 2, sy(profit[i]) - 5, String(profit[i]), 'ts', 'middle');
    o += rect(gx + bw + 4, sy(damage[i]), bw, sy(0) - sy(damage[i]), 'solid') + text(gx + bw * 1.5 + 4, sy(damage[i]) - 5, String(damage[i]), 'ts', 'middle');
    o += text(gx + bw + 2, sy(0) + 18, '第 ' + (i + 1) + ' 头', 'ts', 'middle');
  }
  const lx = 420;
  o += rect(lx, 40, 14, 14, 'solid2') + text(lx + 20, 52, 'Rancher 边际利润', 't');
  o += rect(lx, 64, 14, 14, 'solid') + text(lx + 20, 76, 'Farmer 边际损失', 't');
  o += text(lx, 120, '前三头：利润 > 损失', 't') + text(lx, 140, '第四头：利润 < 损失', 't') + text(lx, 172, 'Efficient 的牛群：3 头', 'tl');
  o += text(lx, 200, '两种 liability rule', 'ts') + text(lx, 216, '下都停在这里', 'ts');
  return svg(560, 262, o, '四头牛各自给 rancher 的边际利润 5、4、3.5、1.5 和给 farmer 的边际损失 1、2、3、4；前三头利润大于损失，第四头相反，所以 efficient 的牛群是三头');
}

// s 377A：两条线上的时间顺序（不按比例）
function s377a() {
  let o = '';
  const slots = 9, x0 = 120, x1 = 500, sx = (i) => x0 + ((x1 - x0) * i) / (slots - 1);
  const UK = 78, SG = 190;
  o += line(x0 - 20, UK, x1 + 30, UK, 'axis') + line(x0 - 20, SG, x1 + 30, SG, 'axis');
  o += text(16, UK + 4, 'UK', 'tb') + text(16, SG + 4, 'Singapore', 'tb');
  const ev = [
    [0, UK, '1885', 'UK s 11', -1],
    [1, SG, '1938', 's 377A 加入', 1],
    [2, UK, '1957', 'Wolfenden', 1],
    [3, UK, '1959', 'Devlin 讲演', -1],
    [4, UK, '1963', 'Hart 回应', 1],
    [5, SG, '2007', '保留，不主动执法', -1],
    [6, SG, '2014', 'Lim Meng Suang', 1],
    [7, SG, '2022', 'Tan Seng Kee', -1],
    [8, SG, '2022.11', '废除；Art 156', 1],
  ];
  for (const [i, y, a, b, side] of ev) {
    const x = sx(i);
    o += circle(x, y, 4.5, i === 8 ? 'ln-f' : 'ink-f');
    if (side < 0) o += text(x, y - 30, a, 'tb', 'middle') + text(x, y - 14, b, 'ts', 'middle');
    else o += text(x, y + 22, a, 'tb', 'middle') + text(x, y + 38, b, 'ts', 'middle');
  }
  o += arrow(sx(0) + 3, UK + 5, sx(1) - 2, SG - 6, 'ln-dash') + text((sx(0) + sx(1)) / 2 - 12, (UK + SG) / 2 + 4, '几乎逐字照抄', 'ts', 'end');
  return svg(560, 246, o, '两条时间线：英国 1885 年的条文、1957 年 Wolfenden、1959 年 Devlin、1963 年 Hart；Singapore 1938 年照抄加入 s 377A、2007 年保留不执法、2014 年 Lim Meng Suang、2022 年 Tan Seng Kee、2022 年 11 月废除并新增 Article 156');
}

// Solum 的三个定义：法律上站得住的结果占可想象结果的多少
function indet() {
  let o = '';
  const W = 150, H = 110, y = 44;
  const panels = [
    ['Determinate', '站得住的结果只有一个'],
    ['Underdeterminate', '站得住的是一个真子集'],
    ['Indeterminate', '什么结果都站得住'],
  ];
  panels.forEach(([t, s], i) => {
    const x = 25 + i * 180, cx = x + W / 2;
    o += text(cx, 30, t, 'tb', 'middle');
    if (i === 2) o += rect(x, y, W, H, 'wash');
    o += rect(x, y, W, H, 'frame');
    if (i === 0) o += circle(cx, y + H / 2, 5, 'ln-f');
    if (i === 1) {
      o += path(d([[cx - 46, y + 52], [cx - 30, y + 30], [cx + 10, y + 26], [cx + 40, y + 44], [cx + 34, y + 78], [cx - 6, y + 88], [cx - 40, y + 76]]) + 'Z', 'wash ink-s');
      o += circle(cx - 18, y + 56, 4, 'ln-f') + circle(cx + 16, y + 56, 4, 'ln-f');
      o += text(cx - 18, y + 74, 'Elmer', 'ts', 'middle') + text(cx + 16, y + 74, '女儿', 'ts', 'middle');
    }
    o += text(cx, y + H + 22, s, 'ts', 'middle');
  });
  return svg(560, 186, o, '三个方框表示所有可以想象的判决结果。Determinate 时站得住的只有一个；underdeterminate 时是一个真子集，例如 Riggs 案只有两个；indeterminate 时所有结果都站得住');
}

export default {
  'lc1002a-bentham': bentham,
  'lc1002a-hart': hart,
  'lc1002a-grudge': grudge,
  'lc1002a-radbruch': radbruch,
  'lc1002a-weigh': weigh,
  'lc1002a-coase': coase,
  'lc1002a-377a': s377a,
  'lc1002a-indet': indet,
};
