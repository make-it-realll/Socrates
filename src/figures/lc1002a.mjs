import { svg, lin, line, rect, circle, poly, text, arrow, path, d, axes } from '../lib/svg.mjs';

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

// Dudley and Stephens：救生艇上的日子
function boat() {
  let o = '';
  const sx = lin(0.5, 25.5, 30, 530), yb = 120;
  const band = (a, b, cls, t1, t2) => {
    o += rect(sx(a - 0.5), yb - 16, sx(b + 0.5) - sx(a - 0.5), 32, cls, 4);
    o += text((sx(a - 0.5) + sx(b + 0.5)) / 2, yb + 5, t1, 't', 'middle');
    if (t2) o += text((sx(a - 0.5) + sx(b + 0.5)) / 2, yb + 52, t2, 'ts', 'middle');
  };
  band(1, 12, 'wash2', '两罐 turnip，一只小海龟', '第 12 天吃完');
  band(13, 20, 'wash', '没有食物', '八天');
  band(21, 25, 'wash-strong', '靠 Parker 的身体', '四天后获救');
  o += line(sx(0.5), yb + 22, sx(25.5), yb + 22, 'axis');
  for (const dd of [1, 12, 20, 21, 25]) o += line(sx(dd), yb + 22, sx(dd), yb + 26, 'axis');
  o += text(sx(1), yb + 38, '1', 'ts', 'middle') + text(sx(12), yb + 38, '12', 'ts', 'middle') + text(sx(20) - 2, yb + 38, '20', 'ts', 'end') + text(sx(21) + 2, yb + 38, '21', 'ts');
  o += text(sx(25), yb + 38, '25', 'ts', 'middle');
  const mark = (dd, y, a, b, anchor) => {
    o += line(sx(dd), y + 6, sx(dd), yb - 18, 'mute');
    o += text(sx(dd) + (anchor === 'end' ? 4 : -4), y - 14, a, 'tb', anchor) + text(sx(dd) + (anchor === 'end' ? 4 : -4), y + 2, b, 'ts', anchor);
  };
  mark(1, 40, '7 月 5 日', 'yacht 沉没，四人上救生艇', 'start');
  mark(21, 40, '7 月 25 日', '杀死 Parker：Stephens 同意，Brooks 不同意', 'end');
  o += line(sx(20), yb + 42, sx(20), yb + 78, 'mute');
  o += text(sx(20) + 4, yb + 94, '7 月 24 日', 'tb', 'end') + text(sx(20) + 4, yb + 110, 'Dudley 提议抽签，Brooks 拒绝', 'ts', 'end');
  return svg(560, 240, o, 'Dudley and Stephens 案的时间线：7 月 5 日 yacht 沉没；前 12 天靠两罐 turnip 和一只海龟；之后八天没有食物；第 20 天即 7 月 24 日 Dudley 提议抽签被拒；7 月 25 日 Parker 被杀；三人靠他的身体活了四天后获救');
}

// 两种 rule 下钱往哪里流
function rules() {
  let o = '';
  const sx = lin(-14, 19, 40, 520);
  o += line(sx(-10), 222, sx(15), 222, 'axis');
  for (const v of [-10, -5, 0, 5, 10, 15]) o += line(sx(v), 222, sx(v), 226, 'axis') + text(sx(v), 240, String(v), 'ts', 'middle');
  o += text(sx(-7), 24, '← farmer 的净得', 'ts', 'middle') + text(sx(9), 24, 'rancher 的净得 →', 'ts', 'middle');
  const row = (y, lab, cows, f0, f1, r0, r1, sum) => {
    o += text(sx(-14), y - 18, lab, 'tb') + text(sx(19), y - 18, cows + '，合计 ' + sum, 'ts', 'end');
    if (f0 < 0) o += rect(sx(f0), y - 10, sx(0) - sx(f0), 22, 'solid2', 3);
    if (f1 < f0) o += rect(sx(f1), y - 10, sx(f0) - sx(f1), 22, 'wash2', 3);
    o += rect(sx(0), y - 10, sx(r0) - sx(0), 22, 'solid', 3) + line(sx(0), y - 14, sx(0), y + 16, 'axis');
    if (r1 > r0) o += rect(sx(r0), y - 10, sx(r1) - sx(r0), 22, 'wash-strong', 3);
    const fl = f1 < f0 ? `${f0} 到 ${f1}` : String(f0);
    const rl = r1 > r0 ? `${r0} 到 ${r1}` : String(r0);
    o += text(sx(f1) - 6, y + 6, fl === '0' ? '0' : fl.replace(/-/g, '−'), 'ts', 'end') + text(sx(r1) + 6, y + 6, rl, 'tb');
  };
  // 数字全部由 Coase 的损失表、为本页设的边际利润和 9 元的围栏算出
  const profit = [5, 4, 3.5, 1.5], damage = [1, 2, 3, 4], fence = 9;
  const cum = (a, n) => a.slice(0, n).reduce((s, v) => s + v, 0);
  const P3 = cum(profit, 3), P4 = cum(profit, 4), D3 = cum(damage, 3);
  const pLo = P4 - P3, pHi = fence - D3;            // farmer 付的 p 的范围：(1.5, 3)
  const fmt = (v) => String(Math.round(v * 10) / 10);
  row(68, 'Rule A：rancher 赔', '3 头', 0, 0, P3 - D3, P3 - D3, fmt(P3 - D3));
  row(132, 'Rule B，farmer 自己修围栏', '4 头', -fence, -fence, P4, P4, fmt(P4 - fence));
  row(196, 'Rule B，farmer 付 p 让他少养一头', '3 头', -(D3 + pLo), -(D3 + pHi), P3 + pLo, P3 + pHi, fmt(P3 - D3));
  o += text(280, 266, `浅色段是 p 在 ${fmt(pLo)} 到 ${fmt(pHi)} 之间时的范围。两种 rule 最后都是 3 头、合计 ${fmt(P3 - D3)}，只是钱的去向不同。`, 'ts', 'middle');
  return svg(560, 276, o, `Coase 例子里双方的净得：Rule A 下 rancher 养 3 头净得 ${fmt(P3 - D3)}，farmer 得到全额赔偿净得 0；Rule B 下不谈判时 rancher 养 4 头净得 ${fmt(P4)}，farmer 自己花 ${fence} 修围栏，合计 ${fmt(P4 - fence)}；谈判后 farmer 付 p 让 rancher 减到 3 头，rancher 净得 ${fmt(P3 + pLo)} 到 ${fmt(P3 + pHi)}，farmer 净得负 ${fmt(D3 + pLo)} 到负 ${fmt(D3 + pHi)}，合计回到 ${fmt(P3 - D3)}`);
}

// Hand formula：PL 与 B
function hand() {
  let o = '';
  const sx = lin(0, 0.6, 70, 420), sy = lin(0, 60, 230, 40);
  o += axes({ sx, sy, x0: 0, x1: 0.6, y0: 0, y1: 60, xt: [[0, '0'], [0.1, '0.1%'], [0.2, '0.2%'], [0.3, '0.3%'], [0.4, '0.4%'], [0.5, '0.5%'], [0.6, '0.6%']], yt: [0, 20, 40, 60], grid: true, xl: 'P：无人看守时出事的 probability', yl: '元' });
  o += path(d([[sx(0.2), sy(20)], [sx(0.6), sy(60)], [sx(0.6), sy(20)]]) + 'Z', 'wash');
  o += path(d([[sx(0), sy(0)], [sx(0.6), sy(60)]]), 'ln');
  o += line(sx(0), sy(20), sx(0.6), sy(20), 'ink-b');
  o += text(sx(0.6) + 6, sy(60) + 4, 'PL = P × 10,000', 'tl') + text(sx(0.6) + 6, sy(20) + 4, 'B = 20', 'tb');
  o += circle(sx(0.1), sy(10), 4.5, 'ink-f') + circle(sx(0.5), sy(50), 4.5, 'ink-f');
  o += text(sx(0.1) + 8, sy(10) + 16, '夜间：PL = 10 < B', 'ts') + text(sx(0.5) - 8, sy(50) - 8, '白天：PL = 50 > B', 'ts', 'end');
  o += line(sx(0.2), sy(0), sx(0.2), sy(20), 'dash');
  o += text(sx(0.45), sy(30), '这一侧不派人', 'ts', 'middle') + text(sx(0.45), sy(30) + 16, '就是 negligent', 'ts', 'middle');
  return svg(560, 276, o, 'Hand formula 的假想数字：expected loss PL 随 P 线性上升，L 为一万；预防成本 B 为 20。两线在 P 等于 0.2% 处相交。夜间 P 为 0.1%，PL 为 10，小于 B；白天 P 为 0.5%，PL 为 50，大于 B，不派人是 negligent');
}

// Michael Fay 案：1994 年的经过
function fay() {
  let o = '';
  o += text(150, 22, 'Singapore', 'tb', 'middle') + text(440, 22, 'United States', 'tb', 'middle');
  const rows = [
    ['2 月 28 日', ['plead guilty：五项 charge', 'vandalism、mischief 各两项，赃物一项'], null],
    ['3 月 3 日', ['四个月 imprisonment、六下 caning', '其余三项 fine 3,500 新元'], null],
    ['3 月 7 日', null, ['Clinton：punishment “extreme”', '']],
    ['4 月 5 日', null, ['Clinton 写信给 Ong Teng Cheong', '要求免除 caning']],
    ['5 月 5 日', ['caning 由六下减为四下后执行', '考虑与美国的关系'], null],
  ];
  const y0 = 50, dy = 44;
  o += line(300, 34, 300, y0 + rows.length * dy - 14, 'grid');
  rows.forEach(([dt, sg, us], i) => {
    const y = y0 + i * dy;
    o += rect(264, y - 2, 72, 22, 'paper', 4) + text(300, y + 14, dt, 'tb', 'middle');
    if (sg) o += text(256, y + 6, sg[0], 'tl', 'end') + text(256, y + 23, sg[1], 'ts', 'end');
    if (us) o += text(344, y + 6, us[0], 'tb') + (us[1] ? text(344, y + 23, us[1], 'ts') : '');
  });
  o += text(280, y0 + rows.length * dy + 8, '全部在 1994 年。上下只按先后排列，间距不代表时间长短。', 'ts', 'middle');
  return svg(560, y0 + rows.length * dy + 18, o, 'Michael Fay 案 1994 年的经过：2 月 28 日认罪，3 月 3 日判四个月监禁和六下鞭刑；美国方面 3 月 7 日 Clinton 称其 extreme，4 月 5 日写信要求免除；5 月 5 日鞭刑减为四下后执行');
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
  'lc1002a-boat': boat,
  'lc1002a-rules': rules,
  'lc1002a-hand': hand,
  'lc1002a-fay': fay,
};
