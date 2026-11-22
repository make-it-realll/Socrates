import { svg, svgA, ashow, apath, acircle, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// Power 的三个 face：各自作用在从 preference 到 outcome 的哪一段
function faces() {
  const bx = 20, bw = 150, bh = 40, gap = 22;
  const rows = [
    ['Preference', 'B 想要什么', 'Third face（Lukes, 1974）', '塑造 B 的 preference 本身，conflict 根本不出现', 'Evidence：需要论证 B 的 interest 与他表达的 preference 不一致'],
    ['Agenda', '哪些 issue 被摆上桌面', 'Second face（Bachrach 与 Baratz, 1962）', '把对 A 不利的 issue 挡在 agenda 之外', 'Evidence：non-decision，即有人不满却从未进入表决的 issue'],
    ['Decision', '公开的 conflict 里谁赢', 'First face（Dahl, 1957）', 'A 让 B 做了 B 本来不会做的事', 'Evidence：可观察的 decision，谁的提案通过、谁让步'],
    ['Outcome', '谁得到什么', '', '三个 face 的结果都落在这里：', 'who gets what, when, how（Lasswell, 1936）'],
  ];
  let o = '';
  rows.forEach((r, i) => {
    const y = 16 + i * (bh + gap);
    o += rect(bx, y, bw, bh, i === 3 ? 'wash' : 'paper', 6);
    o += text(bx + bw / 2, y + 17, r[0], 'tb', 'middle') + text(bx + bw / 2, y + 33, r[1], 'ts', 'middle');
    if (i < 3) o += arrow(bx + bw / 2, y + bh + 2, bx + bw / 2, y + bh + gap - 2, 'ink');
    const tx = bx + bw + 34;
    if (r[2]) {
      o += line(bx + bw + 4, y + bh / 2, tx - 8, y + bh / 2, 'ln');
      o += text(tx, y + 10, r[2], 'tl') + text(tx, y + 27, r[3], 't') + text(tx, y + 43, r[4], 'ts');
    } else {
      o += text(tx, y + 17, r[3], 't') + text(tx, y + 34, r[4], 'ts');
    }
  });
  return svg(560, 266, o, '从 preference 到 agenda 到 decision 到 outcome 的四个环节，以及 power 的 third face、second face、first face 各自作用在哪一环、各靠什么 evidence 识别');
}

// 一个 2×2 game 的画法：单元格、payoff、equilibrium 的底色
function matrix(x0, y0, w, h, pay, eq, opt = {}) {
  let o = '';
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const x = x0 + c * w, y = y0 + r * h;
    o += rect(x, y, w, h, eq.some(([a, b]) => a === r && b === c) ? 'wash' : 'paper-f');
    const [p1, p2] = pay[r][c];
    const cy = y + h / 2 + (opt.dy || 5);
    o += text(x + w / 2 - 6, cy, String(p1), 'tb', 'end') + text(x + w / 2, cy, ',', 't', 'middle') + text(x + w / 2 + 7, cy, String(p2), 'tl', 'start');
  }
  o += rect(x0, y0, 2 * w, 2 * h, 'ink') + line(x0 + w, y0, x0 + w, y0 + 2 * h, 'ink') + line(x0, y0 + h, x0 + 2 * w, y0 + h, 'ink');
  return o;
}

// Prisoner's dilemma：best response 的箭头全部指向 (Defect, Defect)
function pd() {
  const x0 = 120, y0 = 64, w = 140, h = 84;
  let o = matrix(x0, y0, w, h, [[[3, 3], [1, 4]], [[4, 1], [2, 2]]], [[1, 1]]);
  o += text(x0 + w, y0 - 32, 'Player 2', 'tl', 'middle');
  o += text(x0 + w / 2, y0 - 9, 'Cooperate', 't', 'middle') + text(x0 + w * 1.5, y0 - 9, 'Defect', 't', 'middle');
  o += text(x0 - 10, y0 - 9, 'Player 1', 'tb', 'end');
  o += text(x0 - 10, y0 + h / 2 + 5, 'Cooperate', 't', 'end') + text(x0 - 10, y0 + h * 1.5 + 5, 'Defect', 't', 'end');
  // Player 1 的 deviation（向下），Player 2 的 deviation（向右）
  for (const c of [0, 1]) o += arrow(x0 + c * w + 22, y0 + 54, x0 + c * w + 22, y0 + h + 32, 'ink');
  for (const r of [0, 1]) o += arrow(x0 + 94, y0 + r * h + 66, x0 + w + 12, y0 + r * h + 66, 'ln');
  o += text(x0 + w - 8, y0 + 19, 'Pareto efficient', 'ts', 'end') + text(x0 + 2 * w - 8, y0 + 2 * h - 9, 'Nash equilibrium', 'ts', 'end');
  const lx = x0 + 2 * w + 22;
  o += text(lx, y0 + 16, '每格左边是', 'ts') + text(lx, y0 + 32, 'Player 1 的 payoff，', 'ts') + text(lx, y0 + 48, '右边是 Player 2 的', 'ts');
  o += text(lx, y0 + 84, '4 最好，1 最差', 'ts');
  o += line(30, y0 + 2 * h + 26, 52, y0 + 2 * h + 26, 'ink') + text(60, y0 + 2 * h + 30, '黑色箭头：Player 2 不动，Player 1 改成 Defect，payoff 变高（3→4，1→2）', 'ts');
  o += line(30, y0 + 2 * h + 46, 52, y0 + 2 * h + 46, 'ln') + text(60, y0 + 2 * h + 50, '彩色箭头：Player 1 不动，Player 2 改成 Defect，payoff 同样变高', 'ts');
  o += text(30, y0 + 2 * h + 72, '箭头最后都通向右下角：在那一格没有人愿意单方面改变，而左上角对两人都更好。', 't');
  return svg(560, 310, o, 'Prisoner’s dilemma 的 payoff matrix：无论对方怎么选，Defect 都更好，所以双方落在 Defect、Defect 这个 Nash equilibrium，而 Cooperate、Cooperate 对双方都更好');
}

// N 人 public goods game：contribute 与 free ride 的 payoff 是两条 parallel 的 line
function publicgood() {
  const N = 10, c = 10, b = 3;
  const sx = lin(0, 9, 62, 360), sy = lin(-10, 30, 232, 34);
  const fr = (k) => b * k, co = (k) => b * (k + 1) - c;
  let o = axes({ sx, sy, x0: 0, x1: 9, y0: -10, y1: 30, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yt: [[-10, '−10'], 0, 10, 20, 30] });
  o += line(sx(0), sy(0), sx(9), sy(0), 'grid');
  o += line(sx(0), sy(fr(0)), sx(9), sy(fr(9)), 'ink') + line(sx(0), sy(co(0)), sx(9), sy(co(9)), 'ln');
  for (let k = 0; k <= 9; k++) o += circle(sx(k), sy(fr(k)), 2.6, 'ink-f') + circle(sx(k), sy(co(k)), 2.6, 'ln-f');
  o += line(sx(5), sy(fr(5)) + 4, sx(5), sy(co(5)) - 4, 'ink-b') + text(sx(5) + 7, (sy(fr(5)) + sy(co(5))) / 2 + 4, `差 ${c - b}`, 'tb');
  o += text(sx(0.6), sy(17), 'Free ride：3k', 'tb') + text(sx(3.3), sy(-6.2), 'Contribute：3(k + 1) − 10', 'tl');
  o += circle(sx(9), sy(co(9)), 6, 'ln paper-f') + circle(sx(0), sy(fr(0)), 6, 'ink paper-f');
  o += text(sx(9), 262, '其余 9 人里有 k 人 contribute', 'ts', 'end') + text(62, 20, '你的 payoff', 'ts');
  const tx = 400;
  o += text(tx, 50, `N = ${N} 人`, 'tb') + text(tx, 68, `每份 contribution：`, 'ts') + text(tx, 84, `自己付 ${c}，每人得 ${b}`, 'ts');
  o += circle(tx + 6, 112, 6, 'ln paper-f') + text(tx + 18, 116, `全体 contribute：`, 'ts') + text(tx + 18, 132, `每人 ${co(9)}`, 'tb');
  o += circle(tx + 6, 158, 6, 'ink paper-f') + text(tx + 18, 162, `无人 contribute：`, 'ts') + text(tx + 18, 178, `每人 ${fr(0)}`, 'tb');
  o += text(tx, 210, '不管 k 是多少，', 'ts') + text(tx, 226, `free ride 都多得 ${c - b}`, 'ts');
  return svg(560, 272, o, '十个人的 public goods game：无论其他人有多少个 contribute，free ride 的 payoff 总比 contribute 高 7，但全体 contribute 时每人得 20，无人 contribute 时每人得 0');
}

// Hobbes、Locke、Rousseau 的 social contract 并排
function contract() {
  const x0 = 96, cw = 152, top = 44;
  const cols = [['Hobbes', 'Leviathan, 1651'], ['Locke', 'Second Treatise, 1689'], ['Rousseau', 'Social Contract, 1762']];
  const rows = [
    ['State of', 'nature', [
      ['没有 common power；', 'war of every man', 'against every man'],
      ['有 law of nature；', '自由而平等，但', '各人自己 enforce'],
      ['人原本自足而独立；', 'society 带来', 'dependence 与 inequality'],
    ]],
    ['缺的', '是什么', [
      ['Security：没有人', '能 enforce covenant'],
      ['Known law、', 'impartial judge、', 'enforcement power'],
      ['合力自保之后，', '怎样仍然只服从自己'],
    ]],
    ['Contract', '', [
      ['彼此立约，授权给', '一个 sovereign'],
      ['Consent；只交出', '自行 enforce 的 power'],
      ['Total alienation：', '人人把一切交给全体'],
    ]],
    ['Sovereign', '', [
      ['Absolute，不可分；', '自己不是立约的一方'],
      ['Limited；legislative', '受 people 的 trust 约束'],
      ['People 自身，按', 'general will 立法；', '不可 represent'],
    ]],
    ['何时可以', '不服从', [
      ['Sovereign 不再能', '保护你的 life 时'],
      ['Government 违背 trust：', 'a long train of abuses'],
      ['Compact 被违反时，各人', '恢复 natural liberty'],
    ]],
  ];
  const rh = 58;
  let o = '';
  cols.forEach((c, j) => {
    o += rect(x0 + j * cw, 6, cw - 6, top - 10, 'wash', 6);
    o += text(x0 + j * cw + (cw - 6) / 2, 21, c[0], 'tb', 'middle') + text(x0 + j * cw + (cw - 6) / 2, 35, c[1], 'ts', 'middle');
  });
  rows.forEach((r, i) => {
    const y = top + i * rh;
    o += line(8, y, 552, y, 'grid');
    o += text(10, y + 24, r[0], 'tb') + (r[1] ? text(10, y + 41, r[1], 'tb') : '');
    r[2].forEach((cell, j) => cell.forEach((s, k) => { o += text(x0 + j * cw + 4, y + 19 + k * 15.5, s, 'ts'); }));
  });
  o += line(8, top + rows.length * rh, 552, top + rows.length * rh, 'grid');
  return svg(560, top + rows.length * rh + 8, o, 'Hobbes、Locke、Rousseau 三人的 social contract 论证并排比较：state of nature 是什么样、缺什么、contract 的内容、sovereign 的性质、何时可以不服从');
}

// Dahl 的两个 dimension：public contestation 与 inclusiveness
function dahl() {
  const X0 = 150, X1 = 410, Y0 = 262, Y1 = 42;
  let o = rect(X0, Y1, X1 - X0, Y0 - Y1, 'frame');
  o += rect(X1 - 118, Y1, 118, 62, 'wash');
  o += text(X0 + 10, Y0 - 26, 'closed', 'tb') + text(X0 + 10, Y0 - 10, 'hegemony', 'tb');
  o += text(X0 + 10, Y1 + 22, 'competitive', 'tb') + text(X0 + 10, Y1 + 38, 'oligarchy', 'tb');
  o += text(X1 - 10, Y0 - 26, 'inclusive', 'tb', 'end') + text(X1 - 10, Y0 - 10, 'hegemony', 'tb', 'end');
  o += text(X1 - 10, Y1 + 30, 'polyarchy', 'tl', 'end');
  // 三条 path
  o += arrow(X0 + 34, Y0 - 50, X0 + 34, Y1 + 56, 'ink') + arrow(X0 + 96, Y1 + 30, X1 - 124, Y1 + 30, 'ink');
  o += arrow(X0 + 92, Y0 - 22, X1 - 86, Y0 - 22, 'ink') + arrow(X1 - 36, Y0 - 50, X1 - 36, Y1 + 68, 'ink');
  o += arrow(X0 + 70, Y0 - 62, X1 - 76, Y1 + 76, 'ln');
  o += text(X0 + 42, (Y0 + Y1) / 2 + 4, 'I', 'tb') + text((X0 + X1) / 2 + 20, Y0 - 30, 'II', 'tb', 'middle') + text((X0 + X1) / 2 + 16, (Y0 + Y1) / 2 + 22, 'III', 'tl');
  o += arrow(X0, Y0 + 14, X1, Y0 + 14, 'mute') + text((X0 + X1) / 2, Y0 + 32, 'Inclusiveness：多大比例的 adult 有权参与', 't', 'middle');
  o += arrow(X0 - 14, Y0, X0 - 14, Y1, 'mute');
  o += text(X0 - 24, Y1 + 12, 'Public', 't', 'end') + text(X0 - 24, Y1 + 28, 'contestation：', 't', 'end') + text(X0 - 24, Y1 + 46, 'opposition 能否', 'ts', 'end') + text(X0 - 24, Y1 + 61, '公开竞争 office', 'ts', 'end');
  const tx = X1 + 14;
  o += text(tx, Y1 + 98, 'Path I', 'tb') + text(tx, Y1 + 114, '先放开 contestation，', 'ts') + text(tx, Y1 + 129, '再扩大 suffrage', 'ts');
  o += text(tx, Y1 + 154, 'Path II', 'tb') + text(tx, Y1 + 170, '先扩大 participation，', 'ts') + text(tx, Y1 + 185, '再放开 contestation', 'ts');
  o += text(tx, Y1 + 210, 'Path III', 'tl') + text(tx, Y1 + 226, '两者同时', 'ts');
  o += text(280, 318, '只看一个 dimension 会把 competitive oligarchy 或 inclusive hegemony 错当成 polyarchy。', 'ts', 'middle');
  return svg(560, 328, o, 'Dahl 用 public contestation 和 inclusiveness 两个 dimension 划分 regime：两者都低是 closed hegemony，只有 contestation 高是 competitive oligarchy，只有 inclusiveness 高是 inclusive hegemony，两者都高是 polyarchy；图上画了从 closed hegemony 走向 polyarchy 的三条 path');
}

// UK 2015：同一组 vote，plurality 下的实际 seat 与全国一个 district 的 Sainte-Laguë
function seats() {
  const res = [['Conservative', 11299609, 330], ['Labour', 9347273, 232], ['UKIP', 3881099, 1], ['Lib Dem', 2415916, 8], ['SNP', 1454436, 56], ['Green (E&W)', 1111603, 1], ['DUP', 184260, 8], ['Plaid Cymru', 181704, 3], ['Sinn Féin', 176232, 4], ['UUP', 114935, 2], ['SDLP', 99809, 3]];
  const T = 30697525, S = 650;
  const sl = res.map(() => 0);
  for (let i = 0; i < S; i++) { let b = 0; res.forEach((r, j) => { if (r[1] / (2 * sl[j] + 1) > res[b][1] / (2 * sl[b] + 1)) b = j; }); sl[b]++; }
  const sx = lin(0, 55, 118, 450);
  let o = '';
  const bot = 44 + 6 * 54;
  for (const t of [0, 10, 20, 30, 40, 50]) o += line(sx(t), 40, sx(t), bot, 'grid') + text(sx(t), bot + 15, t + '%', 'ts', 'middle');
  o += rect(118, 12, 12, 9, 'wash2') + text(135, 21, 'vote share', 'ts');
  o += rect(206, 12, 12, 9, 'solid') + text(223, 21, 'seats：plurality（实际结果）', 'ts');
  o += rect(384, 12, 12, 9, 'ink') + text(401, 21, 'seats：Sainte-Laguë', 'ts');
  const pl = (n) => (n === 1 ? '1 seat' : n + ' seats');
  res.slice(0, 6).forEach((r, i) => {
    const y = 46 + i * 54, v = (100 * r[1]) / T, s = (100 * r[2]) / S, p = (100 * sl[i]) / S;
    o += text(110, y + 27, r[0], 't', 'end');
    o += rect(sx(0), y, sx(v) - sx(0), 11, 'wash2') + text(sx(v) + 5, y + 10, v.toFixed(1) + '%', 'ts');
    o += rect(sx(0), y + 16, Math.max(sx(s) - sx(0), 1.5), 11, 'solid') + text(sx(s) + 5, y + 26, `${pl(r[2])}，${s.toFixed(1)}%`, 'tb');
    o += rect(sx(0), y + 32, sx(p) - sx(0), 11, 'ink') + text(sx(p) + 5, y + 42, `${pl(sl[i])}，${p.toFixed(1)}%`, 'ts');
  });
  o += line(sx(0), 40, sx(0), bot, 'axis');
  o += text(280, bot + 38, '共 650 个 seat。Sainte-Laguë 一行把全国当成一个 district、不设 threshold，用的是同一组 vote。', 'ts', 'middle');
  return svg(560, bot + 48, o, '2015 年英国大选六个 party 的 vote share、plurality 下实际得到的 seat share，以及用同一组 vote 按全国 Sainte-Laguë 算出的 seat 数；UKIP 得 12.6% 的 vote 只有 1 个 seat，SNP 得 4.7% 的 vote 有 56 个 seat');
}

// Security dilemma 的两种 game：prisoner's dilemma 与 stag hunt
function games() {
  const w = 92, h = 58, y0 = 86;
  let o = '';
  const one = (x0, title, sub, pay, eq, notes) => {
    o += text(x0 + w, 20, title, 'tb', 'middle') + text(x0 + w, 36, sub, 'ts', 'middle');
    o += text(x0 + w / 2, y0 - 8, 'Restrain', 'ts', 'middle') + text(x0 + w * 1.5, y0 - 8, 'Arm', 'ts', 'middle');
    o += text(x0 - 8, y0 + h / 2 + 4, 'Restrain', 'ts', 'end') + text(x0 - 8, y0 + h * 1.5 + 4, 'Arm', 'ts', 'end');
    o += text(x0 - 8, y0 - 8, 'State A', 'tb', 'end') + text(x0 + w, y0 - 24, 'State B', 'tl', 'middle');
    o += matrix(x0, y0, w, h, pay, eq);
    notes.forEach((s, i) => { o += text(x0 + w, y0 + 2 * h + 22 + i * 16, s, 'ts', 'middle'); });
  };
  one(84, 'Prisoner’s dilemma', '单方面 arm 比 mutual restraint 更好', [[[3, 3], [1, 4]], [[4, 1], [2, 2]]], [[1, 1]], ['唯一的 equilibrium：(Arm, Arm)', 'Arm 是 dominant strategy，', '知道对方的 intention 也不改变选择']);
  one(366, 'Stag hunt', 'mutual restraint 最好', [[[4, 4], [1, 3]], [[3, 1], [2, 2]]], [[0, 0], [1, 1]], ['两个 equilibrium', '相信对方 restrain，就 restrain；', '怕对方 arm，就 arm']);
  o += text(280, 290, '有底色的格是 Nash equilibrium。两个 game 只差一处：单方面 arm 的 payoff 是 4 还是 3。', 't', 'middle');
  return svg(560, 302, o, '把 security dilemma 写成两种 game：prisoner’s dilemma 里 arm 是 dominant strategy，唯一的 equilibrium 是双方都 arm；stag hunt 里双方都 restrain 和双方都 arm 都是 equilibrium，结果取决于对对方的 expectation');
}

// Arms race 的 reaction model：x(t+1) = g + k·y(t)，对称情形
function spiral() {
  const g = 10;
  const seq = (k, n) => { const s = [g]; for (let i = 0; i < n; i++) s.push(g + k * s[i]); return s; };
  let o = '';
  const panel = (x0, k, ymax, yt, title, note, limit) => {
    const sx = lin(0, 8, x0, x0 + 190), sy = lin(0, ymax, 232, 44);
    o += axes({ sx, sy, x0: 0, x1: 8, y0: 0, y1: ymax, xt: [0, 2, 4, 6, 8], yt, grid: true });
    const s = seq(k, 8);
    if (limit) o += line(sx(0), sy(limit), sx(8), sy(limit), 'dash') + text(sx(8), sy(limit) - 6, `g / (1 − k) = ${limit}`, 'ts', 'end');
    o += path(d(s.map((v, t) => [sx(t), sy(v)])), 'ln');
    s.forEach((v, t) => { o += circle(sx(t), sy(v), 3, 'ln-f'); });
    o += text(x0 + 95, 20, title, 'tb', 'middle') + text(x0 + 95, 36, note, 'ts', 'middle');
    o += text(x0 + 190, 262, 'round t', 'ts', 'end');
    return s;
  };
  const a = panel(64, 0.5, 25, [0, 5, 10, 15, 20, 25], 'k = 0.5', '10, 15, 17.5, 18.75, … 趋近 20', 20);
  const b = panel(340, 1.2, 220, [0, 50, 100, 150, 200], 'k = 1.2', '10, 22, 36.4, 53.7, … 没有上限', null);
  o += text(sx0(64), 282, `每一轮：我的 arms = ${g} + k × 对方上一轮的 arms。两国 symmetric，两条 curve 重合。`, 'ts');
  o += text(sx0(64), 298, `第 8 轮：左图 ${a[8].toFixed(2)}，右图 ${b[8].toFixed(1)}。纵轴是 arms 的数量，两图 scale 不同。`, 'ts');
  return svg(560, 308, o, 'Arms race 的 reaction model 在两种 reaction coefficient 下的轨迹：系数小于 1 时双方的 arms 收敛到一个有限的水平，系数大于 1 时无限上升');
}
const sx0 = (x) => x - 34;

// Repeated PD：一直 Cooperate 与今天 Defect 的总 payoff 随 δ 变化
function delta() {
  let o = '';
  const sx = lin(0, 0.8, 60, 420), sy = lin(0, 16, 250, 30);
  o += axes({ sx, sy, x0: 0, x1: 0.8, y0: 0, y1: 16, xt: [0, 0.2, 0.4, 0.5, 0.6, 0.8], yt: [0, 4, 8, 12, 16], grid: true, xl: 'δ', yl: '总 payoff' });
  const C = (x) => 3 / (1 - x), D = (x) => 4 + (2 * x) / (1 - x);
  o += path(curve(D, 0, 0.8, sx, sy), 'ink-b') + path(curve(C, 0, 0.8, sx, sy), 'ln');
  o += text(sx(0.8) + 8, sy(C(0.8)) + 4, 'Cooperate：3/(1−δ)', 'tl') + text(sx(0.8) + 8, sy(D(0.8)) + 4, 'Defect：4 + 2δ/(1−δ)', 'tb');
  o += line(sx(0.5), sy(0), sx(0.5), sy(6), 'dash') + circle(sx(0.5), sy(6), 4, 'ink-f');
  o += text(sx(0.5) - 8, sy(6) - 10, 'δ = ½：两边都是 6', 'ts', 'end');
  for (const x of [0.4, 0.6]) { o += circle(sx(x), sy(C(x)), 3.5, 'ln-f') + circle(sx(x), sy(D(x)), 3.5, 'ink-f'); }
  o += text(sx(0.4), sy(2.6), '0.4：5 对 5.33', 'ts', 'middle') + text(sx(0.6) + 8, sy(5.5), '0.6：7.5 对 7', 'ts');
  o += text(sx(0.2), sy(14), 'δ < ½：Defect 高', 'ts', 'middle') + text(sx(0.55), sy(14), 'δ > ½：Cooperate 高', 'ts', 'middle');
  return svg(560, 290, o, '无限重复的 prisoner’s dilemma：一直 Cooperate 的总 payoff 3/(1−δ) 与今天 Defect 一次的总 payoff 4+2δ/(1−δ) 在 δ 等于二分之一处相交，都是 6；δ 小于一半时 Defect 高，大于一半时 Cooperate 高');
}

// Transition 与 survival：两个 rate 决定 democracy 的长期比例
function markov() {
  let o = '';
  const panel = (x0, title, b, s) => {
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    o += rect(x0 + 10, 56, 90, 40, 'wash2', 6) + text(x0 + 55, 81, 'autocracy', 't', 'middle');
    o += rect(x0 + 160, 56, 90, 40, 'wash', 6) + text(x0 + 205, 81, 'democracy', 't', 'middle');
    o += arrow(x0 + 102, 64, x0 + 158, 64, 'ln') + text(x0 + 130, 52, 't = 0.02', 'tl', 'middle');
    o += arrow(x0 + 158, 88, x0 + 102, 88, 'ink') + text(x0 + 130, 112, 'b = ' + b, 'tb', 'middle');
    const W = 240, y = 146;
    o += rect(x0 + 10, y, W, 22, 'wash2', 3) + rect(x0 + 10 + W * (1 - s), y, W * s, 22, 'solid', 3);
    o += text(x0 + 10 + W * (1 - s) + W * s / 2, y + 16, (s * 100).toFixed(0) + '%', 'tw', 'middle');
    o += text(x0 + 130, y + 44, 's = 0.02 / (0.02 + ' + b + ')', 'ts', 'middle');
  };
  panel(10, '穷国', '0.06', 0.02 / 0.08);
  panel(290, '富国', '0.01', 0.02 / 0.03);
  o += line(280, 14, 280, 200, 'grid');
  o += text(280, 226, '上：每年的转移 probability。下：长期稳定下来 democracy 所占的比例（深色）。', 'ts', 'middle');
  o += text(280, 244, '两边的 t 一样，只有 b 不同，比例就差了一倍多。', 'ts', 'middle');
  return svg(560, 256, o, '两状态 model：穷国和富国每年由 autocracy 转为 democracy 的 probability 都是 0.02，democracy 退回的 probability 穷国 0.06、富国 0.01，长期 democracy 比例分别是 25% 和 67%');
}

// New Zealand：1993 plurality 与 1996 MMP
function nz() {
  let o = '';
  const P = [['National', 35.05, 50 / 99, 44 / 120], ['Labour', 34.68, 45 / 99, 37 / 120], ['Alliance', 18.21, 2 / 99, 13 / 120], ['NZ First', 8.4, 2 / 99, 17 / 120], ['ACT', null, null, 8 / 120], ['United', null, null, 1 / 120]];
  const sy = lin(0, 55, 230, 40);
  o += axes({ sx: lin(0, 6, 50, 530), sy, x0: 0, x1: 6, y0: 0, y1: 55, yt: [[0, '0%'], [10, '10%'], [20, '20%'], [30, '30%'], [40, '40%'], [50, '50%']], grid: true });
  const bw = 20;
  P.forEach(([n, v, s93, s96], i) => {
    const cx = 50 + (i + 0.5) * 80;
    const bars = [[v, 'wash2'], [s93 == null ? null : s93 * 100, 'wash-strong'], [s96 * 100, 'solid']];
    bars.forEach(([val, cls], k) => {
      if (val == null) return;
      const x = cx - 31 + k * (bw + 1);
      o += rect(x, sy(val), bw, sy(0) - sy(val), cls);
      if (k > 0 || i < 4) o += text(x + bw / 2, sy(val) - 5, val >= 10 ? val.toFixed(0) : val.toFixed(1), 'ts', 'middle');
    });
    o += text(cx, 248, n, 'tb', 'middle');
  });
  const lg = (x, cls, s) => rect(x, 18, 12, 12, cls) + text(x + 17, 28, s, 'ts');
  o += lg(250, 'wash2', '1993 vote') + lg(335, 'wash-strong', '1993 seat') + lg(420, 'solid', '1996 seat（MMP）');
  o += text(290, 278, 'Seat 的 effective number：2.16 → 3.76　　Gallagher index：18.2 → 4.8', 'ts', 'middle');
  return svg(560, 290, o, 'New Zealand 1993 年最后一次 plurality election 与 1996 年第一次 MMP election：1993 年 Alliance 得 18.21% 的 vote 只有 2% 的 seat，National 和 Labour 的 seat share 远高于 vote share；1996 年 seat 分散到六个 party');
}

// 英德海军竞赛的时间线
function naval() {
  let o = '';
  o += text(150, 22, 'Britain', 'tb', 'middle') + text(410, 22, 'Germany', 'tb', 'middle');
  const rows = [
    ['1898', null, null, 'First Naval Act', '7 年内建 11 艘 battleship'],
    ['1900', null, null, 'Second Naval Law', '计划大致翻了一倍'],
    ['1906', 'HMS Dreadnought 下水', '现有 battleship 全部过时', '追加建造', ''],
    ['1908', null, null, '再次追加', '每年从 3 艘增到 4 艘'],
    ['1909', '“We want eight”', '折中：先造 4 艘，必要时再 4 艘', null, null],
    ['1912', 'Haldane Mission：拒绝', '不接受中立的条件', '接受 Britain 优势', '条件是 Britain 中立'],
  ];
  const y0 = 50, dy = 40;
  o += line(280, 34, 280, y0 + rows.length * dy + 40, 'grid');
  rows.forEach(([yr, b1, b2, g1, g2], i) => {
    const y = y0 + i * dy;
    o += rect(258, y - 2, 44, 22, 'paper', 4) + text(280, y + 14, yr, 'tb', 'middle');
    if (b1) o += text(248, y + 6, b1, 'tl', 'end') + text(248, y + 23, b2, 'ts', 'end');
    if (g1) o += text(312, y + 6, g1, 'tb') + (g2 ? text(312, y + 23, g2, 'ts') : '');
  });
  const y = y0 + rows.length * dy + 6;
  o += rect(258, y - 2, 44, 22, 'paper', 4) + text(280, y + 14, '1914', 'tb', 'middle');
  const sq = (x, yy, cls) => rect(x, yy, 7, 12, cls, 1);
  for (let k = 0; k < 29; k++) o += sq(248 - 8 * (k + 1), y + 3, k < 20 ? 'solid' : 'wash ink-s');
  for (let k = 0; k < 22; k++) o += sq(312 + 8 * k, y + 3, k < 15 ? 'solid' : 'wash ink-s');
  o += text(248, y + 38, '20 dreadnought + 9 battlecruiser', 'ts', 'end') + text(312, y + 38, '15 dreadnought + 7 battlecruiser', 'ts');
  o += text(280, y + 62, '上下只按先后排列，间距不代表时间长短。实心是 dreadnought，空心是 battlecruiser。', 'ts', 'middle');
  return svg(560, y + 72, o, '1898 到 1914 年英德海军竞赛的时间线：Germany 1898 和 1900 年两次 naval law，1906 年 Britain 的 HMS Dreadnought 下水，1908 年 Germany 把每年建造数提到 4 艘，1909 年 Britain 的 we want eight，1912 年 Haldane Mission 失败；1914 年 Britain 有 20 艘 dreadnought 和 9 艘 battlecruiser，Germany 有 15 艘和 7 艘');
}

// Bargaining model：range 与 commitment problem
function bargain() {
  let o = '';
  const sx = lin(0, 1, 60, 500), y = 92;
  o += text(20, 22, '一期：p = 0.6，c_A = c_B = 0.1。横轴是 A 分到的份额 x', 'tb');
  o += rect(sx(0.5), y - 12, sx(0.7) - sx(0.5), 24, 'wash-strong');
  o += line(sx(0), y, sx(1), y, 'axis');
  for (const v of [0, 0.5, 0.6, 0.7, 1]) o += line(sx(v), y - 4, sx(v), y + 4, 'axis') + text(sx(v), y + 28, String(v), 'ts', 'middle');
  o += text(sx(0), y + 44, '全部归 B', 'ts', 'middle') + text(sx(1), y + 44, '全部归 A', 'ts', 'middle');
  o += text(sx(0.6), y + 46, 'bargaining range', 'tl', 'middle');
  o += arrow(sx(0.5), y - 26, sx(0.82), y - 26, 'ink') + text(sx(0.5) - 6, y - 22, 'A 接受：x ≥ p − c_A = 0.5', 'ts', 'end');
  o += arrow(sx(0.7), y - 46, sx(0.38), y - 46, 'ink') + text(sx(0.7) + 6, y - 42, 'B 接受：x ≤ p + c_B = 0.7', 'ts');
  o += line(20, 160, 540, 160, 'grid');
  o += text(20, 186, '两期：p₁ = 0.3，p₂ = 0.7，c_B = 0.1。B 两期合计能拿到多少', 'tb');
  const bx = lin(0, 1.5, 200, 520);
  const bar = (yy, v, lab, cls, note) => rect(bx(0), yy, bx(v) - bx(0), 22, cls, 3) + text(190, yy + 16, lab, 't', 'end') + text(bx(v) + 6, yy + 16, note, 'tb');
  o += bar(202, 1.3, '现在开战', 'solid', '1.3');
  o += bar(234, 1.2, '接受，且 A 第一期全让', 'wash-strong', '1.2');
  o += line(bx(0), 198, bx(0), 260, 'axis');
  o += text(280, 284, '一期时 range 总是非空；两期时 A 让到底也比不上 B 现在开战：preventive war。', 'ts', 'middle');
  return svg(560, 294, o, 'Bargaining model：一期时 A 接受 x 不小于 0.5，B 接受 x 不大于 0.7，双方都宁愿和平的分法是 0.5 到 0.7；两期 commitment problem 中，B 现在开战得 1.3，即使 A 第一期全部让出 B 也只得 1.2，所以 B 选择开战');
}

// ====================== 第 9–16 站 ======================
// 一段内容只在某些 state 出现（第一个 state 就是静态截图时看到的样子）
const showG = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
// n 个 state 均分时间
const evenKt = (n) => Array.from({ length: n }, (_, i) => i / n);

// 第 9 站：policy cycle，用 ALS 走一遍（静态部分完整，动画只移动高亮框）
function cycleA() {
  const bx = 70, bw = 170, y0 = 14, rh = 54, bh = 40;
  const st = [
    ['Problem identification', ['1962–73 年私家车每年 +8.8%', '1975 年底 143,155 辆，CBD 早高峰拥堵']],
    ['Agenda setting', ['1974 年 1 月成立', 'Road Transport Action Committee']],
    ['Formulation 与 adoption', ['1974 年 5 月公布 ALS', '目标：高峰 traffic 减少 25%–30%']],
    ['Implementation', ['1975 年 6 月 2 日起，6.7 km²，27 个 gantry', '7:30–9:30，每天 SGD 3；Park-and-Ride']],
    ['Evaluation', ['', '']],
  ];
  let o = '';
  st.forEach(([name, notes], i) => {
    const y = y0 + i * rh;
    o += rect(bx, y, bw, bh, 'paper', 6) + text(bx + bw / 2, y + 25, name, 'tb', 'middle');
    if (i < 4) o += arrow(bx + bw / 2, y + bh + 1, bx + bw / 2, y + rh - 1, 'ink');
    o += text(bx + bw + 16, y + 16, notes[0], 'ts') + text(bx + bw + 16, y + 33, notes[1], 'ts');
  });
  // evaluation 一行：两根 bar
  const ye = y0 + 4 * rh, sx = lin(0, 42790, 0, 180), ex = bx + bw + 16;
  o += rect(ex + 52, ye + 4, sx(42790), 11, 'wash2') + text(ex, ye + 14, '1975.3', 'ts') + text(ex + 56 + sx(42790), ye + 14, '42,790 辆', 'ts');
  o += rect(ex + 52, ye + 22, sx(11363), 11, 'solid') + text(ex, ye + 32, '9–10 月', 'ts') + text(ex + 56 + sx(11363), ye + 32, '11,363 辆（−73.4%）', 'tb');
  // feedback：从 evaluation 回到 agenda setting
  const yb = y0 + 4 * rh + bh / 2, ya = y0 + rh + bh / 2;
  o += line(bx, yb, bx - 22, yb, 'ln') + line(bx - 22, yb, bx - 22, ya, 'ln') + arrow(bx - 22, ya, bx - 2, ya, 'ln');
  o += text(bx - 28, (ya + yb) / 2 - 6, 'feed', 'tl', 'end') + text(bx - 28, (ya + yb) / 2 + 10, 'back', 'tl', 'end');
  const yr = y0 + 5 * rh + 6;
  o += rect(bx, yr, 482, 64, 'wash', 6);
  o += text(bx + 10, yr + 18, '下一轮：车流挪到收费时段前后，傍晚高峰没人管。', 'ts');
  o += text(bx + 10, yr + 37, '1975.8 延到 10:15 → 1989 加傍晚、取消豁免', 'tb');
  o += text(bx + 10, yr + 56, '→ 1994 全天 → 1998.4.1 改为 ERP', 'tb');
  // 动画：高亮框依次落在五个 stage，再落到下一轮
  const T = 15, kt = evenKt(6);
  const fr = (y, h, w = bw) => d([[bx - 4, y - 4], [bx + w + 4, y - 4], [bx + w + 4, y + h + 4], [bx - 4, y + h + 4], [bx - 4, y - 4]]);
  const frames = [0, 1, 2, 3, 4].map((i) => fr(y0 + i * rh, bh, 482)).concat([fr(yr, 64, 482)]);
  o += apath(frames, kt, T, 'ln', true);
  return svgA(560, yr + 70, o, '动图：Singapore 1975 年的 Area Licensing Scheme 依次经过 policy cycle 的五个 stage：problem identification、agenda setting、formulation 与 adoption、implementation、evaluation；evaluation 显示进 CBD 的车从 42,790 辆降到 11,363 辆，之后 feedback 回到 agenda setting，引出 1975 到 1998 年的一系列修改');
}

// 第 9 站：Mexico tobacco control 的三条 stream
function streamsA() {
  const sx = lin(2008, 2022, 120, 530);
  const rows = [['Problem stream', '倡导者不断改写说法：health → law、economy、青少年', 2008], ['Policy stream', '方案现成：100% 无烟、广告禁令', 2008], ['Politics stream', '2018 年新 president，legislature 有多数', 2018]];
  let o = '';
  for (const yr of [2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022]) o += line(sx(yr), 36, sx(yr), 214, 'grid') + text(sx(yr), 232, String(yr), 'ts', 'middle');
  o += rect(sx(2018), 36, sx(2022) - sx(2018), 178, 'wash');
  o += text((sx(2018) + sx(2022)) / 2, 30, 'policy window', 'tl', 'middle');
  rows.forEach(([n, note, from], i) => {
    const y = 66 + i * 56;
    o += text(112, y + 4, n, 'tb', 'end');
    if (from > 2008) o += line(sx(2008), y, sx(from), y, 'dash');
    o += line(sx(from), y, sx(2022), y, 'ln');
    o += circle(sx(from), y, 4, 'ln-f');
    o += text(sx(2008) + 8, y + 20, note, 'ts');
  });
  o += text(sx(2008), 252, '2008–2020：修订 tobacco 控制法的提案和倡议超过 100 项，都没有通过', 'ts');
  o += circle(sx(2022), 178, 6, 'ink-f') + text(sx(2022) - 10, 200, '2022 修正案通过', 'tb', 'end');
  // 动画：年份游标
  const T = 12, yrs = [2008, 2022, 2022], kt = [0, 10 / 12, 1];
  o += apath(yrs.map((y) => `M${f1(sx(y))} 40V214`), kt, T, 'ink-b');
  return svgA(560, 260, o, '动图：Mexico tobacco control 的三条 stream。Problem stream 和 policy stream 从 2008 年起就在，politics stream 到 2018 年新 president 上任、拥有 legislature 多数时才到位，三者同时到位的 2018 到 2022 年是 policy window，修正案在 2022 年通过；2008 到 2020 年间超过 100 项提案失败');
}

// 第 10 站：Iyengar、Peters 与 Kinder 的 experiment 2
function iyengar() {
  const G = [['Defense', 15, '+5 条，17 分钟', 0.76, 'p < .05'], ['Pollution', 14, '+5 条，15 分钟', 1.53, 'p < .01'], ['Inflation', 15, '+8 条，21 分钟', 0.11, '不显著']];
  let o = text(20, 18, '44 个 New Haven 居民，随机分三组', 'tb') + text(128, 40, '第 2–5 天每晚看的新闻', 'ts');
  o += text(410, 18, 'Importance 的变化', 'tb') + text(410, 34, 'adjusted change，4–20 分', 'ts');
  const sx = lin(0, 1.6, 410, 520);
  G.forEach(([n, N, add, ch, p], i) => {
    const y = 52 + i * 62;
    o += rect(20, y, 92, 44, 'paper', 6) + text(66, y + 19, n, 'tb', 'middle') + text(66, y + 36, `N = ${N}`, 'ts', 'middle');
    // 四天的 newscast：浅色是原来的节目，深色是剪进去的报道
    for (let k = 0; k < 4; k++) {
      const x = 128 + k * 44;
      o += rect(x, y + 6, 38, 32, 'wash2', 3);
      o += rect(x + 5, y + 13, 28, 7, 'solid', 1);
      o += text(x + 19, y + 33, String(k + 2), 'ts', 'middle');
    }
    o += text(306, y + 18, add, 'ts') + text(306, y + 34, '另两个 issue 删掉', 'ts');
    o += rect(sx(0), y + 12, sx(ch) - sx(0), 18, i === 2 ? 'wash-strong' : 'solid', 2);
    o += text(sx(ch) + 5, y + 20, '+' + ch.toFixed(2), 'tb') + text(sx(ch) + 5, y + 35, p, 'ts');
  });
  o += line(sx(0), 46, sx(0), 236, 'axis');
  o += text(20, 252, '深色条：剪进当晚 ABC 或 NBC 新闻里的报道。第 1 天 pretest，最后一次看完 24 小时后 posttest。', 'ts');
  o += text(20, 270, 'Inflation 的 pretest 平均已是 18.5 分（满分 20），没有多少上升的空间。', 'ts');
  return svg(560, 276, o, 'Iyengar、Peters 与 Kinder 1982 年的第二次 experiment：44 人随机分成 defense、pollution、inflation 三组，四天的新闻里分别剪进相应报道；defense 组 importance 上升 0.76，pollution 组上升 1.53，inflation 组只上升 0.11，因为 pretest 时已接近满分');
}

// 第 10 站：Asian disease，同一棵结果树，两种说法
function frame() {
  let o = '';
  const panel = (x0, title, N, a, b, pa, pb) => {
    o += text(x0 + 130, 18, title, 'tb', 'middle') + text(x0 + 130, 34, `N = ${N}；预计 600 人会死`, 'ts', 'middle');
    const two = (cx, y, l) => text(cx, y, l[0], 'ts', 'middle') + (l[1] ? text(cx, y + 15, l[1], 'ts', 'middle') : '');
    // 方案 1：确定
    o += rect(x0 + 6, 52, 120, 30, 'paper', 5) + text(x0 + 66, 72, a[0], 'tb', 'middle');
    o += line(x0 + 66, 82, x0 + 66, 104, 'ink') + rect(x0 + 16, 104, 100, 44, 'wash2', 5);
    o += two(x0 + 66, 121, a[1]) + text(x0 + 66, 166, '（200 人活）', 'ts', 'middle');
    // 方案 2：赌
    o += rect(x0 + 140, 52, 120, 30, 'paper', 5) + text(x0 + 200, 72, b[0], 'tb', 'middle');
    o += line(x0 + 200, 82, x0 + 168, 104, 'ink') + line(x0 + 200, 82, x0 + 232, 104, 'ink');
    o += text(x0 + 176, 96, '⅓', 'ts', 'end') + text(x0 + 224, 96, '⅔', 'ts');
    o += rect(x0 + 138, 104, 60, 44, 'wash2', 5) + two(x0 + 168, 121, b[1]) + text(x0 + 168, 166, '（600 活）', 'ts', 'middle');
    o += rect(x0 + 202, 104, 60, 44, 'wash2', 5) + two(x0 + 232, 121, b[2]) + text(x0 + 232, 166, '（0 活）', 'ts', 'middle');
    o += text(x0 + 200, 186, 'expected：200 人活', 'ts', 'middle');
    // 选择比例
    const W = 252, yb = 200;
    o += rect(x0 + 6, yb, W * pa, 22, 'solid', 3) + rect(x0 + 6 + W * pa, yb, W * pb, 22, 'wash-strong', 3);
    o += text(x0 + 6 + (W * pa) / 2, yb + 16, `${a[0].slice(-1)} ${Math.round(pa * 100)}%`, 'tw', 'middle');
    o += text(x0 + 6 + W * pa + (W * pb) / 2, yb + 16, `${b[0].slice(-1)} ${Math.round(pb * 100)}%`, 'tb', 'middle');
  };
  panel(10, '第一组：说“救活”', 152, ['方案 A', ['200 人', '被救活']], ['方案 B', ['600 人', '被救活'], ['没有人', '被救活']], 0.72, 0.28);
  panel(290, '第二组：说“死去”', 155, ['方案 C', ['400 人', '会死']], ['方案 D', ['没有人死', ''], ['600 人', '都死']], 0.22, 0.78);
  o += line(280, 10, 280, 226, 'grid');
  o += text(280, 248, '括号里是同一个结果换成“活几人”的说法：A 与 C、B 与 D 完全相同。下面的条是选每个方案的比例。', 'ts', 'middle');
  o += text(280, 266, '多数人在“救活”的说法下选确定的方案，在“死去”的说法下选冒险的方案。', 'ts', 'middle');
  return svg(560, 274, o, 'Tversky 与 Kahneman 1981 年的 Asian disease 问题：两组拿到的方案结果完全相同，第一组用救活描述，72% 选确定救活 200 人的方案；第二组用死去描述，只有 22% 选确定 400 人会死的方案，78% 选冒险的方案');
}

// 第 11 站：costly signal，一次袭击之后 government 的 belief
function signalA() {
  const sx = lin(0, 1, 70, 520);
  let o = '';
  const row = (y, title, sub, post, note) => {
    o += text(20, y - 26, title, 'tb') + text(20, y - 10, sub, 'ts');
    o += line(sx(0), y + 20, sx(1), y + 20, 'axis');
    for (const v of [0, 0.25, 0.5, 0.75, 1]) o += line(sx(v), y + 16, sx(v), y + 24, 'axis') + text(sx(v), y + 38, String(v), 'ts', 'middle');
    o += rect(sx(0.375), y - 2, sx(1) - sx(0.375), 22, 'wash');
    o += line(sx(0.375), y - 6, sx(0.375), y + 24, 'ln') + text(sx(0.375) + 4, y + 52, '0.375：超过它就让步', 'tl');
    o += circle(sx(0.3), y + 9, 6, 'ink paper-f') + text(sx(0.3) - 9, y + 13, 'prior 0.3', 'ts', 'end');
    if (post !== 0.3) o += arrow(sx(0.3) + 8, y + 9, sx(post) - 8, y + 9, 'ink') + circle(sx(post), y + 9, 6, 'ink-f') + text(sx(post) + 10, y + 13, note, 'tb');
    else o += text(sx(0.62), y + 13, note, 'tb');
  };
  row(62, 'Costly 的袭击：resolute 的 group 发动的 probability 0.9，weak 的只有 0.3', '0.3 × 0.9 / (0.3 × 0.9 + 0.7 × 0.3) = 0.27 / 0.48', 0.5625, 'posterior 0.5625');
  row(186, '便宜的袭击：两种 group 都有 0.9 的 probability 发动', '0.3 × 0.9 / (0.3 × 0.9 + 0.7 × 0.9) = 0.3', 0.3, 'posterior 仍是 0.3');
  // 动画：上一行的点从 0.3 走到 0.5625
  const T = 8, kt = [0, 0.25, 0.55, 1];
  o += acircle([0.3, 0.3, 0.5625, 0.5625].map(sx), [71, 71, 71, 71], kt, T, 4, 'ln-f');
  o += acircle([0.3, 0.3, 0.3, 0.3].map(sx), [195, 195, 195, 195], kt, T, 4, 'ln-f');
  o += `<text x="500" y="75" class="tl" text-anchor="start" opacity="0">袭击${ashow([0, 1, 0, 0], kt, T)}</text>`;
  o += `<text x="500" y="199" class="tl" text-anchor="start" opacity="0">袭击${ashow([0, 1, 0, 0], kt, T)}</text>`;
  o += text(20, 290, 'Government 继续打的 expected cost 是 2 + 8π，让步的 cost 是 5；π > 0.375 时让步更划算。', 'ts');
  return svgA(560, 298, o, '动图：government 认为对手 resolute 的 probability 起初是 0.3。袭击 costly 时，用 Bayes rule 更新为 0.5625，越过 0.375 的让步门槛；袭击便宜到两种 group 都会发动时，belief 仍是 0.3，袭击不传递信息');
}

// 第 11 站：Kydd 与 Walter 的五种 strategy
function strategies() {
  const cols = [['说服敌方 government', [
    ['Attrition', '让步比继续打更便宜', ['1983 年 Beirut 美军兵营袭击，', '之后美军撤出 Lebanon']],
    ['Spoiling', '对面的温和派管不住极端分子', ['1979 年 Bazargan 与 Brzezinski 握手，', '三天后激进学生扣押 52 名美国人']],
  ]], ['说服自己一方或当地的 population', [
    ['Intimidation', 'Government 保护不了不服从的人', ['Government 弱、地形崎岖、', '司法无力时有效']],
    ['Provocation', 'Government 会无差别报复，不可信', ['要求 government 处在', '“中等程度的残暴”']],
    ['Outbidding', '我们比其他 group 更坚决', ['1980 年 Peru 交还民选政权后，', 'Shining Path 与参选的左翼划清界线']],
  ]]];
  let o = '';
  const cw = 266, ch = 80;
  cols.forEach(([head, cells], j) => {
    const x = 10 + j * (cw + 8);
    o += rect(x, 6, cw, 28, 'wash', 6) + text(x + cw / 2, 25, head, 'tb', 'middle');
    cells.forEach(([n, belief, ex], i) => {
      const y = 44 + i * (ch + 8);
      o += rect(x, y, cw, ch, 'paper', 6);
      o += text(x + 10, y + 20, n, 'tl') + text(x + 10, y + 39, belief, 't') + text(x + 10, y + 57, ex[0], 'ts') + text(x + 10, y + 72, ex[1], 'ts');
    });
  });
  o += text(10, 230, '每一格：strategy 的名字、', 'ts') + text(10, 246, '它想让 audience 相信什么、', 'ts') + text(10, 262, '例子或生效的条件。', 'ts');
  return svg(560, 312, o, 'Kydd 与 Walter 的五种 terrorism strategy：attrition 和 spoiling 要说服敌方 government，intimidation、provocation、outbidding 要说服自己一方或当地的 population；每一格写了要改变的 belief 和例子');
}

// 第 12 站：Ricardo，autarky 与 specialization（每个方块 10 个人干一年）
function ricardoA() {
  const s = 15, g = 3, cols = 11;
  let o = '';
  const T = 9, kt = [0, 0.5];
  const grp = (x0, y0, n, nCloth, title, sub) => {
    o += text(x0, y0 - 24, title, 'tb') + text(x0, y0 - 8, sub, 'ts');
    for (let k = 0; k < n; k++) {
      const x = x0 + (k % cols) * (s + g), y = y0 + Math.floor(k / cols) * (s + g);
      o += rect(x, y, s, s, 'solid', 2);
      // 盖在上面的 wine 方块：autarky 时 k ≥ nCloth 为 wine，specialization 时看国家
      const wineA = k >= nCloth, wineS = title.startsWith('Portugal');
      if (wineA || wineS) o += `<rect x="${f1(x)}" y="${f1(y)}" width="${s}" height="${s}" rx="2" class="paper" opacity="${wineA ? 1 : 0}">${ashow([wineA, wineS], kt, T)}</rect>`;
    }
  };
  grp(20, 60, 22, 10, 'England：220 人', 'cloth 每份 100 人，wine 每份 120 人');
  grp(300, 60, 17, 9, 'Portugal：170 人', 'cloth 每份 90 人，wine 每份 80 人');
  o += rect(20, 120, 12, 12, 'solid', 2) + text(38, 131, 'cloth', 'ts') + rect(90, 120, 12, 12, 'paper', 2) + text(108, 131, 'wine', 'ts') + text(150, 131, '每个方块 = 10 个人干一年', 'ts');
  const lab = (on, s1, s2, s3) => showG(text(20, 166, s1, 'tb') + text(20, 186, s2, 't') + text(20, 206, s3, 't'), on, kt, T);
  o += lab([1, 0], '不 trade：各做 1 份 cloth、1 份 wine', 'England 100 + 120 = 220 人，Portugal 90 + 80 = 170 人', '合计：2 份 cloth、2 份 wine');
  o += lab([0, 1], 'Specialization：England 只做 cloth，Portugal 只做 wine', 'England 220 / 100 = 2.2 份 cloth，Portugal 170 / 80 = 2.125 份 wine', '合计：2.2 份 cloth、2.125 份 wine，人力一个没多');
  o += text(20, 232, '按 1 份 cloth 换 1 份 wine，交换 1.1 份之后：', 'ts');
  o += text(20, 250, 'England 有 1.1 份 cloth、1.1 份 wine；Portugal 有 1.1 份 cloth、1.025 份 wine。', 'ts');
  return svgA(560, 258, o, '动图：Ricardo 的 England 与 Portugal。不 trade 时 England 用 100 人做 cloth、120 人做 wine，Portugal 用 90 人做 cloth、80 人做 wine，合计 2 份 cloth、2 份 wine；specialization 之后 England 220 人全做 cloth 得 2.2 份，Portugal 170 人全做 wine 得 2.125 份');
}

// 第 13 站：AJR 的链条与两个 coefficient
function ajr() {
  const nodes = [['Settler', 'mortality'], ['欧洲人', '是否定居'], ['早期', 'institution'], ['今天的', 'institution'], ['ln GDP', 'per capita 1995']];
  const w = 100, gap = 10, y = 40, h = 46;
  let o = '';
  nodes.forEach(([a, b], i) => {
    const x = 10 + i * (w + gap);
    o += rect(x, y, w, h, i === 0 || i === 4 ? 'wash' : 'paper', 6) + text(x + w / 2, y + 20, a, 'tb', 'middle') + text(x + w / 2, y + 37, b, 'ts', 'middle');
    if (i < 4) o += arrow(x + w + 1, y + h / 2, x + w + gap - 1, y + h / 2, 'ink');
  });
  const cx = (i) => 10 + i * (w + gap) + w / 2;
  // first stage 与 2SLS 的括号
  o += line(cx(0), y - 6, cx(0), y - 16, 'ln') + line(cx(0), y - 16, cx(3), y - 16, 'ln') + line(cx(3), y - 16, cx(3), y - 6, 'ln');
  o += text((cx(0) + cx(3)) / 2, y - 21, 'first stage：−0.61（R² ≈ 0.27）', 'tl', 'middle');
  o += line(cx(3), y + h + 6, cx(3), y + h + 16, 'ln') + line(cx(3), y + h + 16, cx(4), y + h + 16, 'ln') + line(cx(4), y + h + 16, cx(4), y + h + 6, 'ln');
  o += text((cx(3) + cx(4)) / 2, y + h + 32, '2SLS：0.94', 'tl', 'middle') + text((cx(3) + cx(4)) / 2, y + h + 48, '（OLS 只有 0.52）', 'ts', 'middle');
  // exclusion restriction
  o += path(`M${cx(0)} ${y + h + 4}C${cx(0)} ${y + h + 70} ${cx(2)} ${y + h + 70} ${cx(3) - 40} ${y + h + 70}`, 'dash');
  o += text(cx(3) - 36, y + h + 75, '×', 'tb', 'middle');
  o += text(cx(0) + 6, y + h + 88, 'Exclusion restriction：mortality 不能绕过 institution 直接影响今天的收入', 'ts');
  // 例子
  const ey = 210;
  o += rect(10, ey, 540, 70, 'wash2', 6);
  o += text(22, ey + 20, 'Mortality 高 10 倍', 'tb') + text(22, ey + 38, 'ln 10 = 2.303', 'ts');
  o += arrow(150, ey + 30, 176, ey + 30, 'ink');
  o += text(182, ey + 20, 'Institution 指数', 'tb') + text(182, ey + 38, '−0.61 × 2.303 = −1.40', 'ts');
  o += arrow(318, ey + 30, 344, ey + 30, 'ink');
  o += text(350, ey + 20, 'ln GDP', 'tb') + text(350, ey + 38, '0.94 × (−1.40) = −1.32', 'ts');
  o += text(22, ey + 60, '人均 GDP 约为另一国的 e^(−1.32) = 0.27 倍，约四分之一。', 't');
  return svg(560, ey + 78, o, 'Acemoglu、Johnson 与 Robinson 的因果链：settler mortality 影响欧洲人是否定居，进而影响早期 institution、今天的 expropriation risk 和 1995 年人均 GDP；first stage coefficient 是负 0.61，2SLS coefficient 是 0.94；mortality 高 10 倍时 institution 指数低 1.40，log GDP 低 1.32，人均 GDP 约为四分之一');
}

// 第 14 站：Singapore 的 foreign workforce，2024 年 12 月
function passes() {
  const T = 1576500;
  const seg = [['EP', 202100, 'solid'], ['S Pass', 178200, 'wash-strong'], ['WP：家庭帮佣', 301600, 'wash2'], ['WP：建筑、造船、加工', 456800, 'wash'], ['WP：其他行业', 1165900 - 301600 - 456800, 'wash2'], ['其他', 30400, 'mute-f']];
  const sx = lin(0, T, 20, 540);
  let o = text(20, 20, 'Foreign workforce 1,576,500 人（2024 年 12 月）', 'tb');
  let acc = 0;
  const y = 70, h = 40;
  seg.forEach(([n, v, cls], i) => {
    const x0 = sx(acc), x1 = sx(acc + v);
    o += rect(x0, y, x1 - x0, h, cls + ' ink-s');
    const mid = (x0 + x1) / 2, pct = ((100 * v) / T).toFixed(1) + '%';
    if (i === 5) { o += line(mid, y, mid, y - 10, 'mute') + text(mid + 2, y - 14, `${n} ${pct}`, 'ts', 'end'); }
    else if (x1 - x0 > 60) { o += text(mid, y + h + 18, n, 'ts', 'middle') + text(mid, y + h + 34, `${v.toLocaleString('en-US')}，${pct}`, 'ts', 'middle'); }
    else { o += line(mid, y, mid, y - 10, 'mute') + text(mid, y - 14, `${n} ${pct}`, 'ts', 'middle'); }
    acc += v;
  });
  const wx0 = sx(202100 + 178200), wx1 = sx(202100 + 178200 + 1165900);
  o += line(wx0, y + h + 46, wx1, y + h + 46, 'ink') + line(wx0, y + h + 40, wx0, y + h + 46, 'ink') + line(wx1, y + h + 40, wx1, y + h + 46, 'ink');
  o += text((wx0 + wx1) / 2, y + h + 64, 'Work Permit 合计 1,165,900，74.0%', 'tb', 'middle');
  o += text(20, 200, '最左边是 EP 202,100（12.8%）和 S Pass 178,200（11.3%）。', 'ts');
  o += text(20, 218, '只有月薪至少 SGD 6,000 的 EP 和 S Pass 持有人能带家属。', 'ts');
  return svg(560, 226, o, 'Singapore 2024 年 12 月的 foreign workforce 共 1,576,500 人：Employment Pass 202,100，S Pass 178,200，Work Permit 1,165,900，其中家庭帮佣 301,600、建筑造船加工 456,800；其他 work pass 30,400');
}

// 第 14 站：Harris–Todaro，进城的人越多，expected wage 越低
function todaroA() {
  const wm = 900, wr = 400, Lm = 600;
  const sx = lin(500, 1700, 300, 540), sy = lin(0, 1000, 230, 40);
  let o = axes({ sx, sy, x0: 500, x1: 1700, y0: 0, y1: 1000, xt: [600, 1000, 1350, 1700], yt: [0, 400, 900], grid: true });
  o += text(sx(1700), 262, '城市劳动力 L_U', 'ts', 'end') + text(sx(500) - 4, 30, 'expected wage', 'ts', 'start');
  o += path(curve((L) => (Lm * wm) / L, 600, 1700, sx, sy), 'ln') + path(curve((L) => (700 * wm) / L, 700, 1700, sx, sy), 'ln-dash');
  o += line(sx(500), sy(wr), sx(1700), sy(wr), 'ink') + text(sx(520), sy(wr) - 7, 'w_r = 400', 'tb');
  o += circle(sx(1350), sy(400), 4.5, 'ink-f') + line(sx(1350), sy(400), sx(1350), sy(0), 'dash');
  o += circle(sx(1575), sy(400), 4, 'paper') + text(sx(1575) + 4, sy(400) - 10, '1,575', 'ts', 'start');
  o += text(sx(780), sy(820), 'L_m = 600：600 × 900 / L_U', 'tl') + text(sx(1180), sy(560), 'L_m = 700', 'ts');
  // 左边：城市里的人（每个点 50 人），工作 12 个格
  const steps = [600, 750, 900, 1050, 1200, 1350];
  const T = 12, kt = [0, 0.14, 0.28, 0.42, 0.56, 0.7];
  o += text(20, 22, '城市：600 个 modern sector 的工作', 'tb') + text(20, 40, '每个圆点 = 50 人，深色 = 有工作', 'ts');
  for (let k = 0; k < 27; k++) {
    const x = 30 + (k % 9) * 26, y = 64 + Math.floor(k / 9) * 26;
    const cls = k < 12 ? 'ln-f' : 'paper';
    if (k < 12) o += circle(x, y, 8, cls);
    else {
      const on = steps.map((L) => L / 50 > k);
      o += `<g opacity="${on[0] ? 1 : 0}">${circle(x, y, 8, 'ink paper-f')}${ashow(on, kt, T)}</g>`;
    }
  }
  steps.forEach((L, i) => {
    const on = steps.map((_, j) => j === i);
    const ew = (Lm * wm) / L;
    o += showG(text(20, 160, `L_U = ${L.toLocaleString('en-US')}，失业 ${(L - Lm).toLocaleString('en-US')}`, 'tb') + text(20, 180, `找到工作的 probability ${(Lm / L).toFixed(3)}`, 't') + text(20, 200, `expected wage = ${Math.round(ew)}${i === 5 ? '，等于 w_r，停止' : ' > 400，继续进城'}`, i === 5 ? 'tl' : 't'), on, kt, T);
  });
  const st2 = steps.concat([1350]);
  o += acircle(st2.map(sx), st2.map((L) => sy((Lm * wm) / L)), kt.concat([1]), T, 6, 'ln-f');
  o += text(20, 240, 'Equilibrium：1,350 人，750 人失业（55.6%）。', 'ts');
  return svgA(560, 270, o, '动图：Harris–Todaro model。城市有 600 个工资 900 的工作，农村工资 400。进城的人从 600 增加到 1,350，找到工作的 probability 从 1 降到 0.444，expected wage 从 900 降到 400，此时 migration 停止，750 人失业；工作增加到 700 个时 equilibrium 变成 1,575 人');
}

// 第 15 站：Posner 的边界
function posner() {
  let o = '';
  const bx = 280;
  o += text(140, 20, 'Zambia（Eastern Province）', 'tb', 'middle') + text(420, 20, 'Malawi', 'tb', 'middle');
  o += rect(30, 40, 500, 44, 'wash2', 4) + rect(30, 92, 500, 44, 'wash', 4);
  o += text(40, 67, 'Tumbuka', 'tb') + text(40, 119, 'Chewa', 'tb');
  o += line(bx, 30, bx, 146, 'ink-b') + text(bx, 162, '1891 年 British South Africa Company 划的行政边界', 'ts', 'middle');
  for (const [x, y] of [[bx - 40, 62], [bx + 40, 62], [bx - 40, 114], [bx + 40, 114]]) o += circle(x, y, 5, 'ink-f');
  o += text(bx - 50, 66, '村', 'ts', 'end') + text(bx + 50, 66, '村', 'ts');
  o += text(bx - 50, 118, '村', 'ts', 'end') + text(bx + 50, 118, '村', 'ts');
  // 人口比例
  const sx = lin(0, 30, 0, 130);
  const bar = (x, y, v, lab) => rect(x, y, sx(v), 12, 'solid', 2) + text(x + sx(v) + 5, y + 11, lab, 'ts');
  o += text(30, 192, '占全国人口', 'tb') + text(310, 192, '占全国人口', 'tb');
  o += text(30, 212, 'Chewa', 'ts') + bar(90, 202, 7, '约 7%') + text(30, 230, 'Tumbuka', 'ts') + bar(90, 220, 4, '约 4%');
  o += text(310, 212, 'Chewa', 'ts') + bar(370, 202, 28, '约 28%') + text(310, 230, 'Tumbuka', 'ts') + bar(370, 220, 12, '约 12%');
  // survey
  o += text(400, 252, 'Zambia', 'ts', 'end') + text(500, 252, 'Malawi', 'ts', 'end');
  o += text(30, 270, '本人不愿和另一个 group 通婚', 't') + text(30, 288, '本人不会投另一个 group 的 candidate', 't');
  o += text(400, 270, '24%', 'tb', 'end') + text(400, 288, '24%', 'tb', 'end');
  o += text(500, 270, '55%', 'tl', 'end') + text(500, 288, '45%', 'tl', 'end');
  o += text(30, 312, '感知到的文化差别（平均说出几条）：Zambia 1.66，Malawi 1.70。2001 年访问 180 人。', 'ts');
  return svg(560, 320, o, 'Posner 的 natural experiment：Zambia 与 Malawi 的边界把 Chewa 和 Tumbuka 切开；两族在 Zambia 只占全国人口的约 7% 和 4%，在 Malawi 占约 28% 和 12%；两边被访者感知到的文化差别相同，但 Malawi 一侧不愿跨族通婚的比例是 55%，Zambia 是 24%');
}

// 第 15 站：EIP 的 resale 规则，两栋 100 个单位的 block
function eipA() {
  const cell = 13, gap = 2;
  let o = '';
  const blocks = [
    { x: 20, name: 'Block X', c: 72, m: 25, i: 3, note: 'Malay 25 户，正好是上限 25%' },
    { x: 290, name: 'Block Y', c: 87, m: 10, i: 3, note: 'Chinese 87 户，正好是上限 87%' },
  ];
  const pos = (b, k) => [b.x + (k % 10) * (cell + gap), 56 + Math.floor(k / 10) * (cell + gap)];
  blocks.forEach((b) => {
    o += text(b.x, 20, b.name, 'tb') + text(b.x, 38, b.note, 'ts');
    for (let k = 0; k < 100; k++) {
      const [x, y] = pos(b, k);
      o += rect(x, y, cell, cell, k < b.c ? 'wash2' : k < b.c + b.m ? 'solid' : 'wash-strong', 1);
    }
  });
  o += rect(190, 60, 11, 11, 'wash2', 1) + text(205, 70, 'Chinese', 'ts');
  o += rect(190, 80, 11, 11, 'solid', 1) + text(205, 90, 'Malay', 'ts');
  o += rect(190, 100, 11, 11, 'wash-strong', 1) + text(205, 110, 'Indian', 'ts') + text(205, 124, '与 others', 'ts');
  const tries = [
    [0, 5, 'Block X：Chinese 卖家 → Malay 买家', 'Malay 会变成 26 户 > 25', false],
    [0, 80, 'Block X：Malay 卖家 → Malay 买家', 'Malay 仍是 25 户', true],
    [0, 85, 'Block X：Malay 卖家 → Chinese 买家', 'Chinese 73 户 ≤ 87', true],
    [1, 90, 'Block Y：Malay 卖家 → Chinese 买家', 'Chinese 会变成 88 户 > 87', false],
    [1, 92, 'Block Y：Malay 卖家 → Malay 买家', 'Chinese 不变，Malay 10 户 ≤ 25', true],
  ];
  const ty = 222;
  tries.forEach(([bi, k, s, why, ok], j) => {
    const y = ty + j * 19;
    o += text(20, y, s, 'ts') + text(300, y, why, 'ts') + text(540, y, ok ? '允许' : '不允许', ok ? 'tl' : 'tb', 'end');
  });
  // 动画：依次高亮一笔交易的卖家单位和对应的那一行
  const n = tries.length, T = 3 * n, kt = evenKt(n);
  const sel = tries.map(([bi, k]) => { const [x, y] = pos(blocks[bi], k); return d([[x - 2, y - 2], [x + cell + 2, y - 2], [x + cell + 2, y + cell + 2], [x - 2, y + cell + 2], [x - 2, y - 2]]); });
  o += apath(sel, kt, T, 'ink-b', true);
  const rowsel = tries.map((_, j) => { const y = ty + j * 19; return d([[14, y - 14], [548, y - 14], [548, y + 5], [14, y + 5], [14, y - 14]]); });
  o += apath(rowsel, kt, T, 'ln', true);
  return svgA(560, ty + n * 19, o, '动图：两栋 100 个单位的 HDB block。Block X 有 Chinese 72 户、Malay 25 户，Malay 达到 25% 的上限，所以 Chinese 卖家不能卖给 Malay 买家，Malay 卖家可以卖给 Malay 或 Chinese 买家；Block Y 有 Chinese 87 户，达到上限，Malay 卖家不能卖给 Chinese 买家');
}

// 第 16 站：每三个 GP 保留一个，以及三项投资的差别
function reserve() {
  let o = text(20, 20, 'GP 按编号每三个保留一个', 'tb');
  for (let k = 1; k <= 12; k++) {
    const x = 20 + ((k - 1) % 6) * 40, y = 36 + Math.floor((k - 1) / 6) * 40;
    const r = (k - 1) % 3 === 0;
    o += rect(x, y, 32, 30, r ? 'solid' : 'paper', 4) + text(x + 16, y + 20, String(k), r ? 'tw' : 't', 'middle');
  }
  o += text(20, 130, '深色：保留给 women', 'ts') + text(20, 147, 'Birbhum 县 161 个 GP 里 54 个', 'ts');
  o += text(20, 170, 'Pradhan 是 women 的比例：', 'ts') + text(20, 187, '保留 100%，不保留 6.5%', 'ts');
  const items = [['Drinking water 设施（村级）', 23.83, 14.74, 25, (v) => v.toFixed(2)], ['道路状况良好的村的比例', 0.41, 0.23, 0.5, (v) => v.toFixed(2)], ['非正式教育中心（GP 级）', 0.67, 0.82, 1, (v) => v.toFixed(2)]];
  items.forEach(([n, a, b, max, f], i) => {
    const y = 30 + i * 62, sx = lin(0, max, 290, 460);
    o += text(290, y, n, 't');
    o += rect(290, y + 8, sx(a) - 290, 14, 'solid', 2) + text(sx(a) + 5, y + 20, f(a) + ' 保留', 'tb');
    o += rect(290, y + 26, sx(b) - 290, 14, 'wash2', 2) + text(sx(b) + 5, y + 38, f(b), 'ts');
  });
  o += text(20, 222, '右边深色：保留的 GP；浅色：不保留的。', 'ts') + text(20, 240, 'Women 提的问题里 drinking water 占 26%，men 提的只占 14%。', 'ts');
  return svg(560, 248, o, 'Chattopadhyay 与 Duflo 的 natural experiment：West Bengal 把 GP 按编号每三个保留一个给 women；保留的 GP 里 drinking water 设施 23.83 对 14.74，道路良好的比例 0.41 对 0.23，非正式教育中心 0.67 对 0.82');
}

// 第 16 站：closed-list 的名单规则，赢的 seat 从 1 到 10
function listA() {
  const designs = [
    ['只规定 40%', [7, 8, 9, 10]],
    ['每连续 5 个至少 2 个', [4, 5, 9, 10]],
    ['每连续 2 个至少 1 个', [2, 4, 6, 8, 10]],
  ];
  const ks = [5, 6, 7, 8, 9, 10, 1, 2, 3, 4];
  const T = 15, kt = evenKt(ks.length);
  const sh = 20, y0 = 76;
  let o = '';
  designs.forEach(([name, W], j) => {
    const x = 30 + j * 178;
    o += text(x + 60, 44, name, 'tb', 'middle') + text(x + 60, 62, 'women 在第 ' + W.join('、') + ' 位', 'ts', 'middle');
    for (let p = 1; p <= 10; p++) {
      const y = y0 + (p - 1) * (sh + 2), w = W.includes(p);
      o += rect(x, y, 120, sh, w ? 'wash-strong' : 'wash2', 3);
      o += text(x + 8, y + 15, String(p), 'ts') + text(x + 60, y + 15, w ? 'W' : 'M', w ? 'tb' : 't', 'middle');
    }
    // 当选的部分：边框
    o += apath(ks.map((k) => d([[x - 3, y0 - 3], [x + 123, y0 - 3], [x + 123, y0 + k * (sh + 2) - 1], [x - 3, y0 + k * (sh + 2) - 1], [x - 3, y0 - 3]])), kt, T, 'ln', true);
    ks.forEach((k, i) => {
      const on = ks.map((_, q) => q === i);
      const nW = W.filter((p) => p <= k).length;
      o += showG(text(x + 60, y0 + 10 * (sh + 2) + 22, `当选 women：${nW} / ${k}`, 'tl', 'middle'), on, kt, T);
    });
  });
  ks.forEach((k, i) => { o += showG(text(298, 18, `Party 赢 ${k} 个 seat：框住的位置当选`, 'tb', 'middle'), ks.map((_, q) => q === i), kt, T); });
  o += text(30, y0 + 10 * (sh + 2) + 46, '静止时：赢 5 个 seat，三种规则下当选的 women 是 0、2、2。', 'ts');
  return svgA(560, y0 + 10 * (sh + 2) + 54, o, '动图：一个 party 的 10 人 closed list，三种规则下女性的位置不同。框住的是当选的位置，party 赢的 seat 从 5 个变到 10 个再从 1 个变到 4 个；赢 5 个 seat 时三种规则下当选的 women 分别是 0、2、2，赢 3 个时是 0、0、1');
}

export default {
  'ps1101e-faces': faces,
  'ps1101e-pd': pd,
  'ps1101e-public': publicgood,
  'ps1101e-contract': contract,
  'ps1101e-dahl': dahl,
  'ps1101e-seats': seats,
  'ps1101e-games': games,
  'ps1101e-spiral': spiral,
  'ps1101e-delta': delta,
  'ps1101e-markov': markov,
  'ps1101e-nz': nz,
  'ps1101e-naval': naval,
  'ps1101e-bargain': bargain,
  'ps1101e-cycle': cycleA,
  'ps1101e-streams': streamsA,
  'ps1101e-iyengar': iyengar,
  'ps1101e-frame': frame,
  'ps1101e-signal': signalA,
  'ps1101e-strategies': strategies,
  'ps1101e-ricardo': ricardoA,
  'ps1101e-ajr': ajr,
  'ps1101e-passes': passes,
  'ps1101e-todaro': todaroA,
  'ps1101e-posner': posner,
  'ps1101e-eip': eipA,
  'ps1101e-reserve': reserve,
  'ps1101e-list': listA,
};
