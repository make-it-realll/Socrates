import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 全页共用的那个 market：demand P = 70 − Q，supply（也就是 MC）P = 10 + 2Q。Q 的单位是千卷，P 的单位是元。
const PD = (q) => 70 - q;
const PS = (q) => 10 + 2 * q;
const seg = (fn, x0, x1, sx, sy, cls) => line(sx(x0), sy(fn(x0)), sx(x1), sy(fn(x1)), cls);
const dot = (sx, sy, x, y, cls = 'ink-f', r = 4) => circle(sx(x), sy(y), r, cls);
const guide = (sx, sy, x, y, x0 = 0, y0 = 0) => line(sx(x), sy(y), sx(x), sy(y0), 'grid') + line(sx(x0), sy(y), sx(x), sy(y), 'grid');

// 1. Greta 和 Carlos 的 PPF，以及按 40 个 apple 换 1 吨 wheat 做 trade 之后能到达的范围（数字取自 CORE Econ Unit 2）
function ppf() {
  let o = '';
  const panel = (x0, name, wMax, aMax, xMaxAxis, yMaxAxis, tradeW, tradeA, aut, aft, xt, yt) => {
    const sx = lin(0, xMaxAxis, x0, x0 + 190), sy = lin(0, yMaxAxis, 250, 50);
    o += poly([[sx(0), sy(aMax)], [sx(wMax), sy(0)], [sx(tradeW), sy(0)], [sx(0), sy(tradeA)]], 'wash');
    o += axes({ sx, sy, x0: 0, x1: xMaxAxis, y0: 0, y1: yMaxAxis, xt, yt, xl: 'wheat（吨）', yl: 'apple（个）' });
    o += line(sx(0), sy(tradeA), sx(tradeW), sy(0), 'ln-dash') + line(sx(0), sy(aMax), sx(wMax), sy(0), 'ink-b');
    o += dot(sx, sy, aut[0], aut[1], 'ink-f', 4.5) + circle(sx(aft[0]), sy(aft[1]), 4.5, 'ln-f');
    o += text(x0 + 95, 22, name, 'tb', 'middle');
    return { sx, sy };
  };
  const g = panel(62, 'Greta', 50, 1250, 55, 2100, 50, 2000, [30, 500], [35, 600], [10, 30, 50], [500, 1250, 2000]);
  o += text(g.sx(30) - 8, g.sy(500) + 16, '自给 (30, 500)', 'ts', 'end');
  o += text(g.sx(35) + 9, g.sy(600) - 6, 'trade 后 (35, 600)', 'tl');
  o += text(g.sx(13), g.sy(1930), '按 40 apple / 吨 trade', 'tl') + text(g.sx(13), g.sy(1930) + 16, '能到达的范围', 'tl');
  o += text(g.sx(2), g.sy(770), 'PPF', 'tb') + text(g.sx(2), g.sy(770) + 15, 'slope −25', 'ts');
  const c = panel(345, 'Carlos', 20, 1000, 27.5, 1050, 25, 1000, [14, 300], [15, 400], [10, 20, 25], [500, 1000]);
  o += text(c.sx(14) - 8, c.sy(300) + 16, '自给 (14, 300)', 'ts', 'end');
  o += text(c.sx(15) + 9, c.sy(400) - 22, 'trade 后', 'tl') + text(c.sx(15) + 9, c.sy(400) - 6, '(15, 400)', 'tl');
  o += text(c.sx(1.2), c.sy(450), 'PPF', 'tb') + text(c.sx(1.2), c.sy(450) + 15, 'slope −50', 'ts');
  o += text(280, 300, '粗线是各自的 PPF，虚线是 specialize 之后按 40 apple 换 1 吨 wheat 能换到的组合。', 'ts', 'middle');
  o += text(280, 317, '浅色区域是没有 trade 时到不了的；两个人 trade 后的 consumption 都落在自己的 PPF 外面。', 'ts', 'middle');
  return svg(560, 328, o, 'Greta 和 Carlos 各自的 production possibility frontier 与 trade 之后的 consumption：两个人 trade 后的点都在自己的 frontier 之外');
}

// 2. Demand 右移：equilibrium 从 (20, 50) 到 (24, 58)，supply curve 不动
function sd() {
  const sx = lin(0, 40, 60, 330), sy = lin(0, 90, 262, 28);
  let o = guide(sx, sy, 20, 50) + guide(sx, sy, 24, 58);
  o += axes({ sx, sy, x0: 0, x1: 40, y0: 0, y1: 90, xt: [10, 20, 24, 30, 40], yt: [10, 50, 58, 70, 82], xl: 'quantity Q（千卷 / 周）', yl: 'price P（元 / 卷）' });
  o += seg(PS, 0, 37, sx, sy, 'ink-b') + seg(PD, 0, 40, sx, sy, 'ln') + seg((q) => 82 - q, 0, 40, sx, sy, 'ln-dash');
  o += dot(sx, sy, 20, 50) + circle(sx(24), sy(58), 4.5, 'ln paper-f');
  o += text(sx(36.5), sy(PS(36.5)) + 20, 'S', 'tb') + text(sx(38.5), sy(31.5) + 18, 'D', 'tl', 'middle') + text(sx(38), sy(46) - 8, 'D′', 'tl', 'middle');
  o += arrow(sx(31), sy(40.5), sx(31), sy(49.5), 'mute');
  const tx = 352;
  o += text(tx, 60, 'Demand: P = 70 − Q', 'tl') + text(tx, 80, 'Supply: P = 10 + 2Q', 'tb');
  o += text(tx, 110, 'Equilibrium (20, 50)', 't');
  o += text(tx, 144, 'Demand 右移到 P = 82 − Q：', 't') + text(tx, 164, '新 equilibrium (24, 58)', 't');
  o += text(tx, 198, 'Supply curve 没有动。', 'ts') + text(tx, 215, 'Quantity supplied 沿着它', 'ts') + text(tx, 232, '从 20 增加到 24。', 'ts');
  return svg(560, 300, o, 'Supply 和 demand 的 equilibrium 在 quantity 20、price 50；demand 右移后新的 equilibrium 在 quantity 24、price 58，supply curve 本身没有移动');
}

// 3. 同一条 linear demand 上 elasticity 处处不同；total revenue 在 elasticity = −1 处最大
function elast() {
  const sx = lin(0, 70, 70, 520);
  const sy1 = lin(0, 70, 150, 30), sy2 = lin(0, 1300, 318, 200);
  let o = line(sx(35), sy1(70), sx(35), sy2(0), 'grid');
  o += axes({ sx, sy: sy1, x0: 0, x1: 70, y0: 0, y1: 70, xt: [], yt: [35, 55, 70], yl: 'price P' });
  o += seg(PD, 0, 70, sx, sy1, 'ln');
  for (const [q, lab, dx, anchor] of [[15, 'ε = −3.67', 9, 'start'], [35, 'ε = −1', 9, 'start'], [50, 'ε = −0.4', 9, 'start']]) {
    o += dot(sx, sy1, q, PD(q)) + text(sx(q) + dx, sy1(PD(q)) - 7, lab, 'tb', anchor);
  }
  o += text(sx(17.5), sy1(4), 'elastic：|ε| > 1', 't', 'middle') + text(sx(52.5), sy1(4), 'inelastic：|ε| < 1', 't', 'middle');
  o += text(sx(2), sy1(40), 'D: P = 70 − Q', 'tl');
  o += axes({ sx, sy: sy2, x0: 0, x1: 70, y0: 0, y1: 1300, xt: [15, 35, 50, 70], yt: [600, 1225], xl: 'quantity Q', yl: 'total revenue = P × Q' });
  o += path(curve((q) => q * PD(q), 0, 70, sx, sy2), 'ink-b');
  o += dot(sx, sy2, 35, 1225) + text(sx(35) + 9, sy2(1225) - 5, '最大值 1225', 'tb');
  o += arrow(sx(11), sy2(230), sx(25), sy2(230), 'mute') + text(sx(18), sy2(230) - 7, '降价，revenue 上升', 'ts', 'middle');
  o += arrow(sx(45), sy2(230), sx(59), sy2(230), 'mute') + text(sx(52), sy2(230) - 7, '降价，revenue 下降', 'ts', 'middle');
  return svg(560, 358, o, '上图是一条 linear demand curve，elasticity 从左上到右下由很大变到很小；下图是对应的 total revenue，在 elasticity 等于负一、quantity 35 处达到最大值 1225');
}

// 4. 每卷 12 元的 tax：wedge、三块 surplus 和 deadweight loss
function tax() {
  const sx = lin(0, 36, 60, 340), sy = lin(0, 75, 262, 28);
  let o = '';
  o += poly([[sx(0), sy(70)], [sx(0), sy(54)], [sx(16), sy(54)]], 'wash');
  o += poly([[sx(0), sy(54)], [sx(16), sy(54)], [sx(16), sy(42)], [sx(0), sy(42)]], 'wash-strong');
  o += poly([[sx(0), sy(42)], [sx(16), sy(42)], [sx(0), sy(10)]], 'wash2');
  o += poly([[sx(16), sy(54)], [sx(20), sy(50)], [sx(16), sy(42)]], 'solid2');
  o += line(sx(0), sy(50), sx(20), sy(50), 'grid') + line(sx(20), sy(50), sx(20), sy(0), 'grid') + line(sx(16), sy(42), sx(16), sy(0), 'grid');
  o += axes({ sx, sy, x0: 0, x1: 36, y0: 0, y1: 75, xt: [16, 20, 30], yt: [10, 42, 50, 54, 70], xl: 'quantity Q（千卷 / 周）', yl: 'price P（元 / 卷）' });
  o += seg(PS, 0, 32.5, sx, sy, 'ink-b') + seg(PD, 0, 36, sx, sy, 'ln');
  o += line(sx(16), sy(54), sx(16), sy(42), 'ink-b') + dot(sx, sy, 16, 54) + dot(sx, sy, 16, 42) + dot(sx, sy, 20, 50, 'ink-f', 3.5);
  o += text(sx(4.2), sy(60) + 4, 'CS 128', 't', 'middle') + text(sx(8), sy(48) + 4, 'tax revenue 192', 'tb', 'middle') + text(sx(5.2), sy(30) + 4, 'PS 256', 't', 'middle');
  o += text(sx(31.5), sy(PS(31.5)) + 22, 'S', 'tb') + text(sx(34), sy(PD(34)) - 9, 'D', 'tl');
  o += line(sx(18), sy(49), sx(24.5), sy(27), 'mute') + text(sx(24.8), sy(27) + 13, 'deadweight loss 24', 'tb', 'middle');
  const tx = 362;
  o += text(tx, 58, 'Tax = 12 元 / 卷', 'tb');
  o += text(tx, 86, 'Buyer 付 54（原来 50）', 't') + text(tx, 106, 'Seller 实得 42（原来 50）', 't');
  o += text(tx, 126, 'Quantity 从 20 降到 16', 't');
  o += text(tx, 160, 'Buyer 承担 4，seller 承担 8：', 't') + text(tx, 180, 'supply 比 demand 更', 't') + text(tx, 200, 'inelastic，seller 担得多。', 't');
  o += text(tx, 232, 'Deadweight loss 是没有', 'ts') + text(tx, 249, '成交的那 4 千卷的 surplus。', 'ts');
  return svg(560, 300, o, '每卷 12 元的 tax 在 demand 和 supply 之间打进一个 wedge：buyer 付 54，seller 得 42，quantity 从 20 降到 16；图中标出 consumer surplus、producer surplus、tax revenue 和 deadweight loss 三角形');
}

// 5. Minimum wage：competitive labor market 与 monopsony 的预测相反
function minwage() {
  const LD = (l) => 20 - l, LS = (l) => 2 + l / 2, MCL = (l) => 2 + l;
  let o = '';
  const mk = (x0) => ({ sx: lin(0, 20, x0, x0 + 195), sy: lin(0, 20, 308, 76) });
  // 左：competitive
  {
    const { sx, sy } = mk(58);
    o += line(sx(0), sy(10), sx(20), sy(10), 'ln-dash') + guide(sx, sy, 12, 8);
    o += line(sx(10), sy(10), sx(10), sy(0), 'grid') + line(sx(16), sy(10), sx(16), sy(0), 'grid');
    o += axes({ sx, sy, x0: 0, x1: 20, y0: 0, y1: 20, xt: [10, 12, 16], yt: [8, 10, 20], xl: 'employment L（千人）', yl: 'wage w（元 / 小时）' });
    o += seg(LD, 0, 20, sx, sy, 'ln') + seg(LS, 0, 20, sx, sy, 'ink-b');
    o += dot(sx, sy, 12, 8) + dot(sx, sy, 10, 10, 'ln-f') + circle(sx(16), sy(10), 4, 'ink paper-f');
    o += line(sx(10), sy(10) - 10, sx(16), sy(10) - 10, 'mute') + line(sx(10), sy(10) - 14, sx(10), sy(10) - 6, 'mute') + line(sx(16), sy(10) - 14, sx(16), sy(10) - 6, 'mute');
    o += text(sx(13.6), sy(10) - 17, '找不到工作：6', 'ts', 'middle');
    o += text(sx(1.6), sy(19), 'demand', 'tl') + text(sx(19.8), sy(13.2), 'supply', 'tb', 'end');
    o += text(sx(0.4), sy(10) - 6, 'w = 10', 'tl');
    o += text(sx(10), 20, 'Competitive labor market', 'tb', 'middle') + text(sx(10), 37, 'minimum wage 10：employment 12 → 10', 'ts', 'middle');
  }
  // 右：monopsony
  {
    const { sx, sy } = mk(342);
    o += line(sx(0), sy(8), sx(20), sy(8), 'ln-dash') + line(sx(9), sy(11), sx(9), sy(0), 'grid') + line(sx(0), sy(6.5), sx(9), sy(6.5), 'grid') + line(sx(0), sy(11), sx(9), sy(11), 'grid') + line(sx(12), sy(8), sx(12), sy(0), 'grid');
    o += axes({ sx, sy, x0: 0, x1: 20, y0: 0, y1: 20, xt: [9, 12], yt: [[6.5, '6.5'], [8.2, '8'], 11, 20], xl: 'employment L（千人）', yl: 'wage w（元 / 小时）' });
    o += seg(LD, 0, 20, sx, sy, 'ln') + seg(LS, 0, 20, sx, sy, 'ink-b') + seg(MCL, 0, 18, sx, sy, 'dash');
    o += dot(sx, sy, 9, 6.5) + circle(sx(9), sy(11), 3.5, 'ink paper-f') + dot(sx, sy, 12, 8, 'ln-f');
    o += text(sx(1.6), sy(19), 'demand', 'tl') + text(sx(19.8), sy(13.2), 'supply', 'tb', 'end');
    o += text(sx(13.4), sy(16.2), 'MC of labor', 't', 'end');
    o += text(sx(19.8), sy(8) + 16, 'w = 8', 'tl', 'end');
    o += text(sx(10), 20, 'Monopsony', 'tb', 'middle') + text(sx(10), 37, 'minimum wage 8：employment 9 → 12', 'ts', 'middle');
  }
  o += text(280, 362, '两张图的 labor demand 和 labor supply 完全相同。', 'ts', 'middle');
  o += text(280, 379, '左边 wage 由 market 决定，右边由唯一的 employer 决定，同一类 policy 的效果相反。', 'ts', 'middle');
  return svg(560, 390, o, '左图是 competitive labor market，minimum wage 10 高于 equilibrium wage 8，employment 从 12 降到 10；右图是 monopsony，原来 employment 9、wage 6.5，minimum wage 8 使 employment 升到 12');
}

// 6. 一个 firm 的 cost curve：c(q) = 400 + 10q + q²
function cost() {
  const sx = lin(0, 42, 60, 350), sy = lin(0, 100, 262, 28);
  const ATC = (q) => 400 / q + 10 + q, AVC = (q) => 10 + q, MC = (q) => 10 + 2 * q;
  let o = '';
  for (const p of [30, 50, 58]) o += line(sx(0), sy(p), sx((p - 10) / 2), sy(p), 'grid') + line(sx((p - 10) / 2), sy(p), sx((p - 10) / 2), sy(0), 'grid');
  o += axes({ sx, sy, x0: 0, x1: 42, y0: 0, y1: 100, xt: [10, 20, 24, 40], yt: [10, 30, 50, 58], xl: 'output q（卷 / 周）', yl: '元 / 卷' });
  o += path(curve(ATC, 5, 42, sx, sy), 'ink-b') + seg(AVC, 0, 42, sx, sy, 'mute') + seg(MC, 0, 42, sx, sy, 'ln');
  o += dot(sx, sy, 20, 50) + dot(sx, sy, 24, 58, 'ln-f') + dot(sx, sy, 10, 30, 'ln-f');
  o += text(sx(36), sy(MC(36)) - 12, 'MC', 'tl', 'end') + text(sx(9.6), sy(78), 'ATC', 'tb') + text(sx(41), sy(AVC(41)) + 18, 'AVC', 'ts', 'end');
  const tx = 372;
  o += text(tx, 56, 'c(q) = 400 + 10q + q²', 'tb');
  o += text(tx, 84, 'MC 在 ATC 的最低点', 't') + text(tx, 104, '(20, 50) 穿过它。', 't');
  o += text(tx, 136, 'Price-taking firm 沿着 MC', 't') + text(tx, 156, '选 output：', 't');
  o += text(tx, 180, 'P = 58 → q = 24，profit 176', 'ts') + text(tx, 198, 'P = 50 → q = 20，profit 0', 'ts') + text(tx, 216, 'P = 30 → q = 10，亏 300', 'ts');
  o += text(tx, 240, '不生产要亏 400，所以', 'ts') + text(tx, 257, 'P = 30 时仍然生产。', 'ts');
  return svg(560, 300, o, '一个 firm 的 marginal cost、average total cost 和 average variable cost 三条 curve；marginal cost 在 average total cost 的最低点 output 20、每卷 50 元处穿过它');
}

// 7. Monopoly：MR = MC 定 quantity，demand curve 定 price
function monopoly() {
  const sx = lin(0, 38, 60, 340), sy = lin(0, 75, 262, 28);
  const ATC15 = 400 / 15 + 10 + 15;
  let o = '';
  o += rect(sx(0), sy(55), sx(15) - sx(0), sy(ATC15) - sy(55), 'wash-strong');
  o += poly([[sx(15), sy(55)], [sx(20), sy(50)], [sx(15), sy(40)]], 'solid2');
  o += line(sx(0), sy(55), sx(15), sy(55), 'grid') + line(sx(15), sy(40), sx(15), sy(0), 'grid') + line(sx(0), sy(40), sx(15), sy(40), 'grid') + line(sx(20), sy(50), sx(20), sy(0), 'grid');
  o += axes({ sx, sy, x0: 0, x1: 38, y0: 0, y1: 75, xt: [15, 20, 35], yt: [10, 40, 55, 70], xl: 'quantity Q（千卷 / 周）', yl: '元 / 卷' });
  o += seg(PS, 0, 32.5, sx, sy, 'ink-b') + seg(PD, 0, 38, sx, sy, 'ln') + seg((q) => 70 - 2 * q, 0, 35, sx, sy, 'ln-dash');
  o += line(sx(15), sy(55), sx(15), sy(40), 'ink') + dot(sx, sy, 15, 55) + circle(sx(15), sy(40), 4, 'ink paper-f') + dot(sx, sy, 20, 50, 'ink-f', 3.5);
  o += text(sx(31.5), sy(PS(31.5)) + 22, 'MC', 'tb') + text(sx(36), sy(PD(36)) - 9, 'D', 'tl') + text(sx(29.5), sy(11) - 9, 'MR', 'tl');
  o += line(sx(3), sy(51), sx(3), sy(47.6), 'mute') + text(sx(0.7), sy(43.2), 'profit 50', 'tb');
  o += text(sx(23.2), sy(51.4), 'deadweight loss 37.5', 'ts');
  const tx = 362;
  o += text(tx, 54, '第 1 步：MR = MC', 'tb') + text(tx, 74, '70 − 2Q = 10 + 2Q，Q = 15', 't');
  o += text(tx, 102, '第 2 步：上到 demand curve', 'tb') + text(tx, 122, 'P = 70 − 15 = 55', 't');
  o += text(tx, 150, 'Profit 矩形：高 55 − ATC，', 'ts') + text(tx, 167, 'ATC = 51.67，宽 15。', 'ts');
  o += text(tx, 195, 'Competitive market 是', 'ts') + text(tx, 212, 'Q = 20，P = 50。少卖的 5 千卷，', 'ts') + text(tx, 229, 'buyer 愿付 50 到 55，MC 只有', 'ts') + text(tx, 246, '40 到 50，这部分 surplus 没了。', 'ts');
  return svg(560, 300, o, 'Monopoly 的 demand、marginal revenue 和 marginal cost：marginal revenue 等于 marginal cost 给出 quantity 15，demand curve 给出 price 55；图中标出 profit 矩形和 deadweight loss 三角形');
}

// 8. Externality：private cost 与 social cost 相差每卷 12 元
function extern() {
  const sx = lin(0, 36, 60, 340), sy = lin(0, 80, 262, 28);
  const MSC = (q) => 22 + 2 * q;
  let o = '';
  o += poly([[sx(16), sy(54)], [sx(20), sy(62)], [sx(20), sy(50)]], 'solid2');
  o += guide(sx, sy, 16, 54) + guide(sx, sy, 20, 50);
  o += axes({ sx, sy, x0: 0, x1: 36, y0: 0, y1: 80, xt: [16, 20, 30], yt: [10, 22, 50, 54, 70], xl: 'quantity Q（千卷 / 周）', yl: '元 / 卷' });
  o += seg(PS, 0, 33, sx, sy, 'ink-b') + seg(MSC, 0, 25, sx, sy, 'dash') + seg(PD, 0, 36, sx, sy, 'ln');
  o += dot(sx, sy, 20, 50) + dot(sx, sy, 16, 54, 'ln-f') + circle(sx(20), sy(62), 3.5, 'ink paper-f');
  o += text(sx(26), sy(77.5), 'private MC', 'tb') + text(sx(24.2), sy(MSC(24.2)) - 10, 'social MC', 't', 'end') + text(sx(34), sy(PD(34)) - 9, 'D', 'tl');
  o += text(sx(20) + 7, sy(57.5), '12', 'ts');
  o += text(sx(22.8), sy(50.2), 'deadweight loss 24', 'ts');
  const tx = 370;
  o += text(tx, 58, 'Market：Q = 20，P = 50', 'tb');
  o += text(tx, 78, 'Buyer 和 seller 只看', 'ts') + text(tx, 95, 'private MC。', 'ts');
  o += text(tx, 126, 'Efficient：Q = 16，P = 54', 'tl');
  o += text(tx, 146, 'Social MC = demand 的地方。', 'ts');
  o += text(tx, 178, '第 16 到 20 千卷：social cost', 'ts') + text(tx, 195, '54 到 62，buyer 只愿付', 'ts') + text(tx, 212, '54 到 50。多生产的这一段', 'ts') + text(tx, 229, '净亏掉三角形的 area。', 'ts');
  return svg(560, 300, o, 'Private marginal cost 之上平行的一条 social marginal cost，两者相差每卷 12 元；market 的 quantity 是 20，efficient 的 quantity 是 16，两者之间的三角形是 deadweight loss');
}

// 9. 同一次 demand shock 在两个 model 里：price 不变时 output 掉 100，price 可以动时掉 50
function adas() {
  let o = '';
  // 左：Keynesian cross（放大到 Y 在 800 到 1100 之间）
  {
    const sx = lin(800, 1100, 58, 248), sy = lin(800, 1100, 250, 60);
    const Z0 = (y) => 250 + 0.75 * y, Z1 = (y) => 225 + 0.75 * y;
    o += line(sx(1000), sy(1000), sx(1000), sy(800), 'grid') + line(sx(900), sy(900), sx(900), sy(800), 'grid');
    o += axes({ sx, sy, x0: 800, x1: 1100, y0: 800, y1: 1100, xt: [900, 1000, 1100], yt: [900, 1000, 1100], xl: 'income Y', yl: 'spending' });
    o += line(sx(800), sy(800), sx(1100), sy(1100), 'ink') + seg(Z0, 800, 1100, sx, sy, 'ln') + seg(Z1, 800, 1100, sx, sy, 'ln-dash');
    o += dot(sx, sy, 1000, 1000) + circle(sx(900), sy(900), 4, 'ln paper-f');
    o += text(sx(1046), sy(1078), '45° line', 't', 'end');
    o += text(sx(812), sy(Z0(812)) - 10, 'Z', 'tl') + text(sx(1076), sy(Z1(1076)) + 26, 'Z′', 'tl', 'end');
    o += arrow(sx(992), sy(822), sx(908), sy(822), 'mute') + text(sx(950), sy(822) - 6, '−100', 'tb', 'middle');
    o += text(sx(950), 22, 'Price 不变：spending 少 25，', 'tb', 'middle') + text(sx(950), 39, 'output 少 100', 'tb', 'middle');
  }
  // 右：AD–AS
  {
    const sx = lin(880, 1060, 352, 530), sy = lin(65, 115, 250, 60);
    const AD0 = (y) => (1400 - y) / 4, AD1 = (y) => (1300 - y) / 4, AS = (y) => (y - 600) / 4;
    o += line(sx(1000), sy(65), sx(1000), sy(115), 'dash');
    o += line(sx(950), sy(87.5), sx(950), sy(65), 'grid') + line(sx(880), sy(87.5), sx(950), sy(87.5), 'grid') + line(sx(880), sy(100), sx(1000), sy(100), 'grid') + line(sx(880), sy(75), sx(1000), sy(75), 'grid');
    o += axes({ sx, sy, x0: 880, x1: 1060, y0: 65, y1: 115, xt: [950, 1000], yt: [75, [87.5, '87.5'], 100], xl: 'real GDP Y', yl: 'price level P' });
    o += seg(AS, 880, 1050, sx, sy, 'ink-b') + seg(AD0, 950, 1060, sx, sy, 'ln') + seg(AD1, 880, 1030, sx, sy, 'ln-dash');
    o += dot(sx, sy, 1000, 100) + circle(sx(950), sy(87.5), 4, 'ln paper-f') + circle(sx(1000), sy(75), 3.5, 'ink paper-f');
    o += text(sx(1046), sy(AS(1046)) + 20, 'SRAS', 'tb') + text(sx(1036), sy(AD0(1036)) - 7, 'AD', 'tl') + text(sx(885), sy(AD1(885)) - 8, 'AD′', 'tl');
    o += text(sx(996), sy(112.5), 'LRAS', 'ts', 'end');
    o += text(sx(1000) + 10, sy(75) + 4, 'long run', 'ts');
    o += text(sx(970), 22, 'Price 可以动：AD 左移 100，', 'tb', 'middle') + text(sx(970), 39, 'output 少 50', 'tb', 'middle');
  }
  o += text(280, 304, 'Z = 250 + 0.75Y，Z′ = 225 + 0.75Y。左图 equilibrium 左移的 100，就是右图 AD 左移的距离；', 'ts', 'middle');
  o += text(280, 321, '右图里其中一半被 price level 的下降吸收。', 'ts', 'middle');
  return svg(560, 332, o, '左图是 Keynesian cross，spending 线下移 25 使 equilibrium income 从 1000 降到 900；右图是 AD–AS，AD 左移 100 使 output 从 1000 降到 950、price level 从 100 降到 87.5，long run 回到 1000');
}

// 10. S$NEER policy band 的三个可调参数（示意，不是真实数据）
function band() {
  let o = '';
  const panel = (x0, title, note1, note2, before, after) => {
    const sx = lin(0, 10, x0, x0 + 150), sy = lin(90, 118, 215, 55);
    o += rect(x0, 55, 150, 160, 'frame') + line(sx(5), 55, sx(5), 215, 'grid');
    const draw = (f, t0, t1) => {
      o += line(sx(t0), sy(f.c(t0)), sx(t1), sy(f.c(t1)), 'dash');
      o += line(sx(t0), sy(f.c(t0) + f.w), sx(t1), sy(f.c(t1) + f.w), 'ln') + line(sx(t0), sy(f.c(t0) - f.w), sx(t1), sy(f.c(t1) - f.w), 'ln');
    };
    draw(before, 0, 5); draw(after, 5, 10);
    o += text(x0 + 75, 24, title, 'tb', 'middle') + text(x0 + 75, 42, note1, 'ts', 'middle');
    o += text(sx(2.5), 229, '之前', 'ts', 'middle') + text(sx(7.5), 229, '之后', 'ts', 'middle');
    o += text(x0 + 75, 249, note2, 'ts', 'middle');
  };
  panel(28, 'Slope', 'crawl 的速度', '例：2008 年 10 月降到 0%', { c: (t) => 98 + 1.6 * t, w: 4 }, { c: () => 106, w: 4 });
  panel(205, 'Centre', '整条 band 平移', '例：2009 年 4 月下移', { c: (t) => 104 + 0.4 * t, w: 4 }, { c: (t) => 100 + 0.4 * t, w: 4 });
  panel(382, 'Width', 'band 的宽度', '例：2001 年 10 月加宽', { c: (t) => 100 + 0.8 * t, w: 3 }, { c: (t) => 100 + 0.8 * t, w: 6.5 });
  o += text(280, 276, '纵轴是 S$NEER（越高表示 Singapore dollar 对一篮子 currency 越贵），横轴是时间。', 'ts', 'middle');
  o += text(280, 293, '虚线是 band 的 centre，两条实线是上下界。数值只是示意，不是 MAS 的实际参数。', 'ts', 'middle');
  return svg(560, 304, o, 'S$NEER policy band 的三个可调参数示意：slope 是 band 随时间升值的速度，centre 是整条 band 的水平位置，width 是 band 的宽度');
}

export default {
  'ec1101e-ppf': ppf,
  'ec1101e-sd': sd,
  'ec1101e-elast': elast,
  'ec1101e-tax': tax,
  'ec1101e-minwage': minwage,
  'ec1101e-cost': cost,
  'ec1101e-monopoly': monopoly,
  'ec1101e-extern': extern,
  'ec1101e-adas': adas,
  'ec1101e-band': band,
};
