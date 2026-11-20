import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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

export default {
  'ps1101e-faces': faces,
  'ps1101e-pd': pd,
  'ps1101e-public': publicgood,
  'ps1101e-contract': contract,
  'ps1101e-dahl': dahl,
  'ps1101e-seats': seats,
  'ps1101e-games': games,
  'ps1101e-spiral': spiral,
};
