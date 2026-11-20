import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// 容斥：三种都出现 = 三个"缺某一种"事件的并集之外
function inclusion() {
  let o = rect(16, 16, 528, 268, 'wash', 6);
  const cs = [[212, 122], [308, 122], [260, 196]];
  for (const [x, y] of cs) o += circle(x, y, 78, 'paper-f');
  for (const [x, y] of cs) o += circle(x, y, 78, 'ink');
  o += text(160, 92, '缺 C', 'tb', 'middle') + text(360, 92, '缺 P', 'tb', 'middle') + text(260, 252, '缺 R', 'tb', 'middle');
  o += text(260, 104, '全是 R', 'ts', 'middle') + text(214, 178, '全是 P', 'ts', 'middle') + text(306, 178, '全是 C', 'ts', 'middle');
  o += text(260, 150, '∅', 'ts', 'middle');
  o += text(452, 60, '圈外（涂色）', 'tl', 'middle') + text(452, 80, '= 三种都出现', 'tl', 'middle');
  o += text(452, 232, '整个方框：', 'ts', 'middle') + text(452, 250, '4 次遭遇的所有结果', 'ts', 'middle');
  return svg(560, 300, o, '三个圆分别表示缺少 C、缺少 P、缺少 R；圆外的区域就是三种都出现');
}

// Bayes：自然频率。1000 个司机 → 阳性的 68.6 人里只有 19.6 个真的酒驾
function bayes() {
  const x0 = 30, W = 500;
  let o = text(x0 + W / 2, 28, '1000 个被拦下的司机', 't', 'middle') + text(x0, 28, '20 个酒驾', 'tl') + text(x0 + W, 28, '980 个没有酒驾', 'ts', 'end');
  o += rect(x0, 38, 10, 34, 'solid') + rect(x0 + 10, 38, W - 10, 34, 'wash2');
  // 放大到"检测为阳性"的那一部分
  const s = 5; // 每人 5px
  const tp = 19.6 * s, fp = 49 * s;
  o += path(d([[x0, 72], [x0, 150]]), 'mute') + path(d([[x0 + 10, 72], [x0 + tp, 150]]), 'mute') + path(d([[x0 + W, 72], [x0 + tp + fp, 150]]), 'mute');
  o += rect(x0, 150, tp, 40, 'solid') + rect(x0 + tp, 150, fp, 40, 'wash2');
  o += line(x0 + tp, 150, x0 + tp, 190, 'ink');
  o += text(x0 + tp / 2, 175, '19.6', 'tw', 'middle') + text(x0 + tp + fp / 2, 175, '49', 't', 'middle');
  o += text(x0, 210, '酒驾且阳性', 'tl') + text(x0, 226, '20 × 98%', 'ts');
  o += text(x0 + tp + fp, 210, '没酒驾却阳性', 't', 'end') + text(x0 + tp + fp, 226, '980 × 5%', 'ts', 'end');
  o += text(x0 + tp + fp + 18, 166, '阳性共 68.6 人', 't') + text(x0 + tp + fp + 18, 186, '真酒驾占 19.6 / 68.6', 't') + text(x0 + tp + fp + 18, 206, '≈ 28.6%', 'tl');
  o += text(x0 + W / 2, 124, '只看检测为阳性的人（放大 5 倍）', 'ts', 'middle');
  return svg(560, 240, o, '1000 个司机中 20 个酒驾；阳性共 68.6 人，其中真酒驾 19.6 人，约占 28.6%');
}

// 支撑集：1 ≤ k < n ≤ 5，条件在 K = 3 时只剩 n = 4, 5
function support() {
  const sx = lin(0, 6, 60, 330), sy = lin(0, 6, 250, 20);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 0, y1: 6, xt: [1, 2, 3, 4, 5], yt: [1, 2, 3, 4, 5], xl: 'n', yl: 'k', grid: true });
  o += rect(sx(0.5), sy(3.42), sx(5.5) - sx(0.5), sy(2.58) - sy(3.42), 'wash', 4);
  for (let n = 1; n <= 5; n++) for (let k = 1; k <= 5; k++) {
    const inS = k < n;
    o += circle(sx(n), sy(k), inS ? 6 : 3, inS ? (k === 3 ? 'solid' : 'ink paper-f') : 'faint-f');
  }
  o += text(350, 60, '实心圆：pmf 非零的点', 't') + text(350, 80, '（要求 k < n）', 'ts');
  o += text(350, 128, '给定 K = 3', 'tl') + text(350, 148, '只看涂色这一行，', 't') + text(350, 168, '里面只有 n = 4 和 n = 5，', 't') + text(350, 188, '分母只对这两个点求和。', 't');
  return svg(560, 292, o, '联合 pmf 的支撑集是 k 小于 n 的三角形；给定 K 等于 3 时只剩 n 等于 4 和 5 两个点');
}

// 层次模型与总方差分解
function hier() {
  let o = rect(30, 22, 200, 58, 'paper', 6) + text(130, 46, 'X ~ Beta(3, 5)', 'tb', 'middle') + text(130, 66, '这枚硬币出正面的概率', 'ts', 'middle');
  o += arrow(232, 51, 318, 51, 'ink');
  o += text(275, 42, '先定 X', 'ts', 'middle');
  o += rect(320, 22, 210, 58, 'paper', 6) + text(425, 46, 'N | X ~ Bin(6, X)', 'tb', 'middle') + text(425, 66, '再抛 6 次，数正面', 'ts', 'middle');
  const x0 = 30, W = 500, a = 1.25, b = 0.9375, tot = a + b;
  const wa = (W * a) / tot;
  o += text(x0, 122, 'Var(N) = 35/16', 't');
  o += rect(x0, 132, wa, 40, 'wash2') + rect(x0 + wa, 132, W - wa, 40, 'solid');
  o += line(x0 + wa, 132, x0 + wa, 172, 'ink');
  o += text(x0 + wa / 2, 157, '5/4', 't', 'middle') + text(x0 + wa + (W - wa) / 2, 157, '15/16', 'tw', 'middle');
  o += text(x0, 194, 'E[ Var(N | X) ]', 'tb') + text(x0, 212, '就算知道 X，抛硬币本身还有随机性', 'ts');
  o += text(x0 + W, 194, 'Var( E[N | X] )', 'tl', 'end') + text(x0 + W, 212, '不知道 X 是多少带来的额外不确定', 'ts', 'end');
  return svg(560, 228, o, '总方差 35/16 分成两段：给定 X 后的随机性 5/4，和 X 本身不确定带来的 15/16');
}

// 变量替换：单位正方形 → 菱形，面积翻倍、密度减半
function jacobian() {
  const lx = lin(0, 1, 50, 190), ly = lin(0, 1, 225, 85);
  let o = line(lx(0), ly(0), lx(1.25), ly(0), 'axis') + line(lx(0), ly(0), lx(0), ly(1.25), 'axis');
  o += poly([[lx(0), ly(0)], [lx(1), ly(0)], [lx(1), ly(1)], [lx(0), ly(1)]], 'wash ink-s');
  o += text(lx(1.25) + 4, ly(0) + 4, it('x'), 't') + text(lx(0) - 4, ly(1.25) - 4, it('y'), 't', 'end');
  o += text(lx(1), ly(0) + 16, '1', 'ts', 'middle') + text(lx(0) - 8, ly(1) + 4, '1', 'ts', 'end');
  o += text(lx(0.5), 276, '面积 1，密度 1', 't', 'middle');
  o += arrow(232, 150, 300, 150, 'ink') + text(266, 138, 'u = x + y', 'ts', 'middle') + text(266, 168, 'v = y − x', 'ts', 'middle');
  const rx = lin(0, 2, 330, 520), ry = lin(-1, 1, 245, 55);
  o += line(rx(0), ry(0), rx(2.15), ry(0), 'axis') + line(rx(0), ry(-1.1), rx(0), ry(1.1), 'axis');
  o += poly([[rx(0), ry(0)], [rx(1), ry(1)], [rx(2), ry(0)], [rx(1), ry(-1)]], 'wash ink-s');
  o += poly([[rx(0), ry(0)], [rx(0.5), ry(0.5)], [rx(0.5), ry(-0.5)]], 'solid');
  o += line(rx(0.5), ry(-1.05), rx(0.5), ry(1.05), 'dash') + text(rx(0.5) + 4, ry(1.05) + 4, 'u = ½', 'ts');
  o += text(rx(2.15) + 4, ry(0) + 4, it('u'), 't') + text(rx(0) - 4, ry(1.1) - 2, it('v'), 't', 'end');
  o += text(rx(1), ry(0) + 16, '1', 'ts', 'middle') + text(rx(2), ry(0) + 16, '2', 'ts', 'middle') + text(rx(0) - 6, ry(1) + 4, '1', 'ts', 'end') + text(rx(0) - 6, ry(-1) + 4, '−1', 'ts', 'end');
  o += text(rx(1), 276, '面积 2，密度 ½', 't', 'middle');
  o += text(rx(1), 294, '深色小三角：U < ½，面积 ¼ × 密度 ½ = ⅛', 'ts', 'middle');
  return svg(560, 304, o, '单位正方形在 u 等于 x 加 y、v 等于 y 减 x 的变换下变成面积为 2 的菱形，密度从 1 变成二分之一');
}

// CLT：n 个骰子点数和的分布，与正态曲线
function clt() {
  let o = '';
  const ns = [1, 2, 10];
  ns.forEach((n, pi) => {
    let pmf = [1];
    for (let i = 0; i < n; i++) {
      const nx = new Array(pmf.length + 6).fill(0);
      pmf.forEach((p, j) => { for (let k = 1; k <= 6; k++) nx[j + k] += p / 6; });
      pmf = nx;
    }
    const lo = n, hi = 6 * n;
    const mu = 3.5 * n, sd = Math.sqrt((35 * n) / 12);
    const max = Math.max(...pmf, 1 / (sd * Math.sqrt(2 * Math.PI)));
    const x0 = 30 + pi * 180, x1 = x0 + 150;
    const sx = lin(lo - 0.5, hi + 0.5, x0, x1), sy = lin(0, max * 1.08, 170, 36);
    const bw = (x1 - x0) / (hi - lo + 1);
    for (let s = lo; s <= hi; s++) o += rect(sx(s) - bw / 2 + 0.5, sy(pmf[s]), Math.max(bw - 1, 1), 170 - sy(pmf[s]), 'wash-strong');
    o += path(curve((x) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * Math.sqrt(2 * Math.PI)), lo - 0.5, hi + 0.5, sx, sy), 'ink');
    o += line(x0, 170, x1, 170, 'axis');
    o += text(x0, 187, String(lo), 'ts', 'middle') + text(x1, 187, String(hi), 'ts', 'middle') + text((x0 + x1) / 2, 187, '点数和', 'ts', 'middle');
    o += text((x0 + x1) / 2, 20, n === 1 ? '1 个骰子' : n + ' 个骰子', 'tb', 'middle');
  });
  o += text(280, 212, '柱子是精确分布，黑线是同均值、同方差的正态密度', 'ts', 'middle');
  return svg(560, 222, o, '1 个、2 个、10 个骰子点数和的分布；骰子越多，柱形越贴近正态曲线');
}

export default {
  'st2131-inclusion': inclusion,
  'st2131-bayes': bayes,
  'st2131-support': support,
  'st2131-hier': hier,
  'st2131-jacobian': jacobian,
  'st2131-clt': clt,
};
