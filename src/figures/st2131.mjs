import { svg, svgA, anim, ashow, apath, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

// Inclusion–exclusion：52 张里抽 4 张，三个 event 是 "no J"、"no Q"、"no K"，每一块里写的是实际的手数
function inclusion() {
  const all = C(52, 4), one = C(48, 4), two = C(44, 4), three = C(40, 4);
  const pairOnly = two - three, singleOnly = one - 2 * two + three, outside = all - 3 * one + 3 * two - three;
  let o = rect(16, 16, 528, 284, 'wash', 6);
  const cs = [[196, 118], [292, 118], [244, 192]];
  for (const [x, y] of cs) o += circle(x, y, 78, 'paper-f');
  for (const [x, y] of cs) o += circle(x, y, 78, 'ink');
  o += text(108, 60, 'no J', 'tb', 'end') + text(380, 60, 'no Q', 'tb') + text(292, 282, 'no K', 'tb');
  o += text(150, 104, String(singleOnly), 'ts', 'middle') + text(338, 104, String(singleOnly), 'ts', 'middle') + text(244, 244, String(singleOnly), 'ts', 'middle');
  o += text(244, 88, String(pairOnly), 'ts', 'middle') + text(190, 184, String(pairOnly), 'ts', 'middle') + text(298, 184, String(pairOnly), 'ts', 'middle');
  o += text(244, 148, String(three), 'tb', 'middle');
  o += text(462, 108, '三个 circle 之外', 'tl', 'middle') + text(462, 128, 'J、Q、K 都有', 'tl', 'middle') + text(462, 152, String(outside), 'tl', 'middle');
  o += text(462, 226, '整个方框', 'ts', 'middle') + text(462, 244, `C(52, 4) = ${all}`, 'ts', 'middle');
  return svg(560, 316, o, '三个 circle 分别是没有 J、没有 Q、没有 K 的手牌；每一块里标着手数，三个 circle 之外的 2848 手就是 J、Q、K 都有的');
}

// Conditioning：两次掷 4-sided die，已知 min = 2 之后 sample space 缩成 5 个 outcome
function cond() {
  const S = 38, y0 = 58;
  let o = '';
  const grid = (x0, after) => {
    for (let x = 1; x <= 4; x++) for (let y = 1; y <= 4; y++) {
      const inB = Math.min(x, y) === 2, m3 = inB && Math.max(x, y) === 3;
      const px = x0 + (x - 1) * S, py = y0 + (4 - y) * S;
      o += rect(px, py, S, S, m3 ? 'solid' : inB ? 'wash-strong' : 'frame');
      if (!m3 && inB) o += rect(px, py, S, S, 'frame');
      const lab = after ? (inB ? '1/5' : '0') : '1/16';
      o += text(px + S / 2, py + S / 2 + 4, lab, m3 ? 'tw' : (after && !inB) ? 'ts' : 't', 'middle');
    }
    for (let k = 1; k <= 4; k++) o += text(x0 + (k - 0.5) * S, y0 + 4 * S + 16, String(k), 'ts', 'middle') + text(x0 - 8, y0 + (4.5 - k) * S + 4, String(k), 'ts', 'end');
    o += text(x0 + 2 * S, y0 + 4 * S + 34, 'first roll', 'ts', 'middle') + text(x0 - 8, y0 - 8, 'second roll', 'ts', 'middle');
  };
  grid(70, false);
  grid(350, true);
  o += arrow(246, y0 + 2 * S, 318, y0 + 2 * S, 'ink') + text(282, y0 + 2 * S - 10, 'given B', 'ts', 'middle');
  o += text(70 + 2 * S, 24, '16 个 outcome，各 1/16', 'tb', 'middle') + text(350 + 2 * S, 24, 'B 之外归零，B 之内各 1/5', 'tb', 'middle');
  o += text(280, 268, '涂色的 5 格是 B = {min = 2}，其中深色的两格 max = 3，所以 P(max = 3 | B) = 2/5', 'ts', 'middle');
  return svg(560, 280, o, '左边是两次掷 4-sided die 的 16 个等可能 outcome，右边是已知 min 等于 2 之后剩下的 5 个 outcome，每个 probability 是五分之一');
}

// Bayes：1000 个 driver，positive 的 68.6 人里只有 19.6 个 drunk
function bayes() {
  const x0 = 30, W = 500;
  let o = text(x0, 28, '20 个 drunk', 'tl') + text(x0 + W / 2, 28, '1000 个被拦下的 driver', 't', 'middle') + text(x0 + W, 28, '980 个 sober', 'ts', 'end');
  o += rect(x0, 38, 10, 34, 'solid') + rect(x0 + 10, 38, W - 10, 34, 'wash2');
  const s = 5;
  const tp = 19.6 * s, fp = 49 * s;
  o += path(d([[x0, 72], [x0, 150]]), 'mute') + path(d([[x0 + 10, 72], [x0 + tp, 150]]), 'mute') + path(d([[x0 + W, 72], [x0 + tp + fp, 150]]), 'mute');
  o += rect(x0, 150, tp, 40, 'solid') + rect(x0 + tp, 150, fp, 40, 'wash2');
  o += line(x0 + tp, 150, x0 + tp, 190, 'ink');
  o += text(x0 + tp / 2, 175, '19.6', 'tw', 'middle') + text(x0 + tp + fp / 2, 175, '49', 't', 'middle');
  o += text(x0, 210, 'drunk 且 positive', 'tl') + text(x0, 226, '20 × 98%', 'ts');
  o += text(x0 + tp + fp, 210, 'sober 却 positive', 't', 'end') + text(x0 + tp + fp, 226, '980 × 5%', 'ts', 'end');
  o += text(x0 + tp + fp + 18, 162, 'positive 共 68.6 人', 't') + text(x0 + tp + fp + 18, 182, '其中 drunk 占', 't') + text(x0 + tp + fp + 18, 202, '19.6 / 68.6 ≈ 28.6%', 'tl');
  o += text(x0 + (tp + fp) / 2 + 60, 124, '只看 test 为 positive 的人（放大 5 倍）', 'ts', 'middle');
  return svg(560, 240, o, '1000 个 driver 中 20 个 drunk；test 为 positive 的共 68.6 人，其中 drunk 的 19.6 人，约占 28.6%');
}

// 一个分段的 density：area 才是 probability，高度可以超过 1
function pdf() {
  const c = 0.3;
  const f = (x) => (x < 1 ? 2 * c * x : c * x * x);
  const sx = lin(0, 2.2, 60, 330), sy = lin(0, 1.4, 232, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2.2, y0: 0, y1: 1.4, xt: [1, 2], yt: [[0.3, '0.3'], [0.6, '0.6'], [1, '1'], [1.2, '1.2']], xl: 'x', yl: 'f(x)' });
  o += line(sx(0), sy(1), sx(2.2), sy(1), 'grid');
  o += path(area((x) => 2 * c * x, 0, 1, sx, sy), 'wash') + path(area((x) => c * x * x, 1, 2, sx, sy), 'wash-strong');
  o += path(curve((x) => 2 * c * x, 0, 1, sx, sy), 'ln') + path(curve((x) => c * x * x, 1, 2, sx, sy), 'ln');
  o += line(sx(1), sy(0.3), sx(1), sy(0.6), 'dash') + line(sx(2), sy(0), sx(2), sy(1.2), 'dash');
  o += text(sx(0.66), sy(0.07), '0.3', 'tb', 'middle') + text(sx(1.62), sy(0.2), '0.7', 'tb', 'middle');
  o += text(sx(0.34), sy(0.44), '0.6x', 't', 'middle') + text(sx(1.4), sy(0.84), '0.3x²', 't', 'end');
  o += text(350, 62, '两块 area 合起来是 1：', 'tb') + text(350, 84, 'c + 7c/3 = 1，c = 0.3', 't');
  o += text(350, 122, 'x 接近 2 时 f(x) 超过 1。', 'tb') + text(350, 144, 'Density 是每单位长度的', 't') + text(350, 164, 'probability，本身不是', 't') + text(350, 184, 'probability；只有 area 不能', 't') + text(350, 204, '超过 1。', 't');
  return svg(560, 272, o, '一个分段的 density：在 0 到 1 上是 0.6x，在 1 到 2 上是 0.3x 平方；两块 area 分别是 0.3 和 0.7，右端的高度超过 1');
}

// Joint PMF 的 support：1 ≤ k < n ≤ 5；given K = 3 只剩 n = 4, 5
function support() {
  const sx = lin(0, 6, 60, 330), sy = lin(0, 6, 250, 20);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 0, y1: 6, xt: [1, 2, 3, 4, 5], yt: [1, 2, 3, 4, 5], xl: 'n', yl: 'k', grid: true });
  o += rect(sx(0.5), sy(3.42), sx(5.5) - sx(0.5), sy(2.58) - sy(3.42), 'wash', 4);
  for (let n = 1; n <= 5; n++) for (let k = 1; k <= 5; k++) {
    const inS = k < n;
    o += circle(sx(n), sy(k), inS ? 6 : 3, inS ? (k === 3 ? 'solid' : 'ink paper-f') : 'faint-f');
  }
  o += text(sx(4), sy(3) - 12, '3/20', 'ts', 'middle') + text(sx(5), sy(3) - 12, '3/25', 'ts', 'middle');
  o += text(350, 56, '大圆点：PMF 不为 0 的点', 't') + text(350, 76, '（support：k &lt; n）', 'ts');
  o += text(350, 124, 'Given K = 3', 'tl') + text(350, 146, '只看涂色的这一个 row，', 't') + text(350, 166, '里面只有 n = 4 和 n = 5。', 't') + text(350, 186, '两个值相加是 P(K = 3)，', 't') + text(350, 206, '各自除以它就是', 't') + text(350, 226, 'conditional PMF。', 't');
  return svg(560, 292, o, 'Joint PMF 的 support 是 k 小于 n 的 triangle；given K 等于 3 时只剩 n 等于 4 和 5 两个点');
}

// Joint PDF 8xy 的 support 0 < x < y < 1：竖切得 marginal of X，横切得 marginal of Y，深色是 x + y < 1
function region() {
  const sx = lin(0, 1.15, 70, 300), sy = lin(0, 1.15, 250, 20);
  let o = '';
  o += poly([[sx(0), sy(0)], [sx(0), sy(1)], [sx(1), sy(1)]], 'wash');
  o += poly([[sx(0), sy(0)], [sx(0), sy(1)], [sx(0.5), sy(0.5)]], 'wash-strong');
  o += axes({ sx, sy, x0: 0, x1: 1.15, y0: 0, y1: 1.15, xt: [[0.3, '0.3'], [0.5, '0.5'], [1, '1']], yt: [[0.5, '0.5'], [0.8, '0.8'], [1, '1']], xl: 'x', yl: 'y' });
  o += line(sx(0), sy(0), sx(1), sy(1), 'ink') + line(sx(0), sy(1), sx(1), sy(1), 'ink') + line(sx(1), sy(0), sx(1), sy(1), 'grid');
  o += line(sx(0), sy(1), sx(0.5), sy(0.5), 'dash');
  o += line(sx(0.3), sy(0.3), sx(0.3), sy(1), 'ln') + circle(sx(0.3), sy(0.3), 3.5, 'ln-f') + circle(sx(0.3), sy(1), 3.5, 'ln-f');
  o += line(sx(0), sy(0.8), sx(0.8), sy(0.8), 'ink-b') + circle(sx(0.8), sy(0.8), 3.5, 'ink-f') + circle(sx(0), sy(0.8), 3.5, 'ink-f');
  o += text(sx(0.72), sy(0.5), 'y = x', 'ts') + text(sx(0.40), sy(0.69), 'x + y = 1', 'ts');
  o += text(330, 44, '涂色的 triangle 是 support：', 'tb') + text(330, 64, 'f(x, y) = 8xy，0 &lt; x &lt; y &lt; 1', 't');
  o += text(330, 100, '彩色竖线：固定 x = 0.3，', 'tl') + text(330, 120, 'y 从 x 走到 1，得 marginal of X', 't');
  o += text(330, 154, '黑色横线：固定 y = 0.8，', 'tb') + text(330, 174, 'x 从 0 走到 y，得 marginal of Y；', 't') + text(330, 194, '除以它就是 conditional PDF', 't');
  o += text(330, 228, '深色：x + y &lt; 1 的部分，', 't') + text(330, 248, 'probability 是 1/6', 't');
  return svg(560, 290, o, 'Joint PDF 的 support 是 y 大于 x 的 triangle；一条竖线和一条横线分别表示求两个 marginal 时的 integration 范围，深色部分是 x 加 y 小于 1 的 region');
}

// Tower rule：三种 coin，各自的 Bin(4, p)，再按 1/2、1/3、1/6 加权
function tower() {
  const coins = [['A', 0.9, '1/2'], ['B', 0.6, '1/3'], ['C', 0.2, '1/6']];
  let o = rect(205, 12, 150, 30, 'paper', 6) + text(280, 32, '随机取一枚 coin', 't', 'middle');
  coins.forEach(([nm, p, w], i) => {
    const x0 = 40 + i * 170, W = 140, cx = x0 + W / 2;
    const ax = [240, 280, 320][i];
    o += arrow(ax, 44, cx, 76, 'ink');
    o += text([158, 294, 402][i], [50, 66, 50][i], w, 'tl', 'middle');
    o += text(cx, 94, `${nm}：P(head) = ${p}`, 'tb', 'middle');
    const sy = lin(0, 0.7, 196, 108), bw = W / 5;
    for (let k = 0; k <= 4; k++) {
      const v = C(4, k) * p ** k * (1 - p) ** (4 - k);
      o += rect(x0 + k * bw + 2, sy(v), bw - 4, 196 - sy(v), 'wash-strong') + text(x0 + (k + 0.5) * bw, 211, String(k), 'ts', 'middle');
    }
    o += line(x0, 196, x0 + W, 196, 'axis');
    const mx = x0 + (4 * p + 0.5) * bw;
    o += line(mx, 104, mx, 196, 'ln-dash');
    o += text(cx, 232, `E[N | ${nm}] = ${(4 * p).toFixed(1)}`, 't', 'middle') + text(cx, 250, `Var(N | ${nm}) = ${(4 * p * (1 - p)).toFixed(2)}`, 'ts', 'middle');
  });
  o += text(280, 278, '每个 chart 是 4 次 toss 里 head 数 N 的 conditional PMF，虚线是它的 mean', 'ts', 'middle');
  return svg(560, 290, o, '三种 coin 各自的 head 数 conditional PMF 和 conditional mean；按取到三种 coin 的 probability 加权平均就是 head 数的 expectation');
}

// Total variance 的两段，以及把 X 换成 mean 的错误算法
function hier() {
  let o = rect(30, 18, 200, 54, 'paper', 6) + text(130, 40, 'X ~ Beta(3, 5)', 'tb', 'middle') + text(130, 60, '这枚 coin 的 P(head)', 'ts', 'middle');
  o += arrow(232, 45, 318, 45, 'ink') + text(275, 36, '先定 X', 'ts', 'middle');
  o += rect(320, 18, 210, 54, 'paper', 6) + text(425, 40, 'N | X ~ Bin(6, X)', 'tb', 'middle') + text(425, 60, '再 toss 6 次，数 head', 'ts', 'middle');
  const x0 = 30, W = 500, a = 1.25, b = 0.9375, tot = a + b;
  const wa = (W * a) / tot;
  o += text(x0, 108, 'Var(N) = 35/16', 'tb');
  o += rect(x0, 118, wa, 38, 'wash2') + rect(x0 + wa, 118, W - wa, 38, 'solid');
  o += line(x0 + wa, 118, x0 + wa, 156, 'ink');
  o += text(x0 + wa / 2, 142, '5/4', 't', 'middle') + text(x0 + wa + (W - wa) / 2, 142, '15/16', 'tw', 'middle');
  o += text(x0, 176, 'E[Var(N | X)]', 'tb') + text(x0, 194, '已知 X 时，toss 本身的 randomness', 'ts');
  o += text(x0 + W, 176, 'Var(E[N | X])', 'tl', 'end') + text(x0 + W, 194, '不知道 X 是多少带来的 uncertainty', 'ts', 'end');
  const ww = (W * 1.40625) / tot;
  o += rect(x0, 222, ww, 22, 'frame') + path(d([[x0, 222], [x0 + ww, 222], [x0 + ww, 244], [x0, 244]]) + 'Z', 'dash');
  o += text(x0 + ww / 2, 238, '45/32', 't', 'middle') + text(x0 + ww + 12, 238, '把 X 当成 3/8 算出的 variance', 'ts');
  return svg(560, 258, o, 'Total variance 35/16 分成两段：已知 X 时的 5/4 和 X 的 uncertainty 带来的 15/16；把 X 换成 mean 算出的 45/32 比它短');
}

// Y = X²，X ~ Uniform(0, 1)：x 上等宽的五段被 stretch 成 y 上不等宽的五段
function stretch() {
  const lx = lin(0, 1, 60, 230), ly = lin(0, 1, 228, 48);
  let o = axes({ sx: lx, sy: ly, x0: 0, x1: 1, y0: 0, y1: 1, xt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6'], [0.8, '0.8'], [1, '1']], yt: [[0.04, '0.04'], [0.16, '0.16'], [0.36, '0.36'], [0.64, '0.64'], [1, '1']] });
  o += text(lx(1) + 10, ly(0) + 4, it('x'), 't') + text(lx(0) + 8, ly(1) - 4, 'y = x²', 'ts');
  for (let i = 1; i <= 5; i++) { const x = i / 5; o += path(d([[lx(x), ly(0)], [lx(x), ly(x * x)], [lx(0), ly(x * x)]]), 'mute'); }
  o += path(curve((x) => x * x, 0, 1, lx, ly), 'ln');
  o += line(lx(0), ly(0) + 0.5, lx(0.2), ly(0) + 0.5, 'ink-b') + line(lx(0.8), ly(0) + 0.5, lx(1), ly(0) + 0.5, 'ink-b');
  o += line(lx(0) - 0.5, ly(0), lx(0) - 0.5, ly(0.04), 'ink-b') + line(lx(0) - 0.5, ly(0.64), lx(0) - 0.5, ly(1), 'ink-b');
  o += text(145, 22, 'x 上每段宽 0.2，probability 0.2', 'tb', 'middle');
  const rx = lin(0, 1, 330, 530), ry = lin(0, 5.6, 228, 48);
  o += axes({ sx: rx, sy: ry, x0: 0, x1: 1, y0: 0, y1: 5.6, xt: [[0.16, '0.16'], [0.36, '0.36'], [0.64, '0.64'], [1, '1']], yt: [1, 2, 3, 4, 5] });
  o += text(rx(1) + 10, ry(0) + 4, it('y'), 't');
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) ** 2, b = ((i + 1) / 5) ** 2, h = 0.2 / (b - a);
    o += rect(rx(a), ry(h), rx(b) - rx(a), ry(0) - ry(h), 'wash') + rect(rx(a), ry(h), rx(b) - rx(a), ry(0) - ry(h), 'frame');
  }
  o += path(curve((y) => 1 / (2 * Math.sqrt(y)), 0.008, 1, rx, ry, 400), 'ln');
  o += text(430, 22, 'y 上每段 area 仍是 0.2', 'tb', 'middle');
  o += text(rx(0.3), ry(3.4), 'density of Y：', 't') + text(rx(0.3), ry(2.75), '1 / (2√y)', 'tl');
  o += text(280, 270, '左边 curve 平的地方，一段 x 被压进很短的一段 y，同样的 probability 挤在更短的长度上，density 就高', 'ts', 'middle');
  return svg(560, 282, o, '左图是 y 等于 x 平方，x 轴上等宽的五段对应 y 轴上宽度不等的五段；右图是 Y 的 density，每段的 area 都是 0.2，越靠近 0 越高');
}

// Change of variables：unit square → diamond，area 翻倍，density 减半
function jacobian() {
  const lx = lin(0, 1, 50, 190), ly = lin(0, 1, 225, 85);
  let o = line(lx(0), ly(0), lx(1.25), ly(0), 'axis') + line(lx(0), ly(0), lx(0), ly(1.25), 'axis');
  o += poly([[lx(0), ly(0)], [lx(1), ly(0)], [lx(1), ly(1)], [lx(0), ly(1)]], 'wash ink-s');
  o += poly([[lx(0), ly(0)], [lx(0.5), ly(0)], [lx(0), ly(0.5)]], 'solid');
  o += poly([[lx(0.2), ly(0.6)], [lx(0.4), ly(0.6)], [lx(0.4), ly(0.8)], [lx(0.2), ly(0.8)]], 'solid2');
  o += text(lx(1.25) + 4, ly(0) + 4, it('x'), 't') + text(lx(0) - 4, ly(1.25) - 4, it('y'), 't', 'end');
  o += text(lx(1), ly(0) + 16, '1', 'ts', 'middle') + text(lx(0) - 8, ly(1) + 4, '1', 'ts', 'end');
  o += text(lx(0.5), 262, 'area 1，density 1', 't', 'middle');
  o += arrow(232, 150, 300, 150, 'ink') + text(266, 138, 'u = x + y', 'ts', 'middle') + text(266, 168, 'v = y − x', 'ts', 'middle');
  const rx = lin(0, 2, 330, 520), ry = lin(-1, 1, 245, 55);
  o += line(rx(0), ry(0), rx(2.15), ry(0), 'axis') + line(rx(0), ry(-1.1), rx(0), ry(1.1), 'axis');
  o += poly([[rx(0), ry(0)], [rx(1), ry(1)], [rx(2), ry(0)], [rx(1), ry(-1)]], 'wash ink-s');
  o += poly([[rx(0), ry(0)], [rx(0.5), ry(0.5)], [rx(0.5), ry(-0.5)]], 'solid');
  o += poly([[rx(0.8), ry(0.4)], [rx(1.0), ry(0.2)], [rx(1.2), ry(0.4)], [rx(1.0), ry(0.6)]], 'solid2');
  o += line(rx(0.5), ry(-1.05), rx(0.5), ry(1.05), 'dash') + text(rx(0.5) + 5, ry(1.05) + 6, 'u = ½', 'ts');
  o += text(rx(2.15) + 4, ry(0) + 4, it('u'), 't') + text(rx(0) - 4, ry(1.1) - 2, it('v'), 't', 'end');
  o += text(rx(1), ry(0) + 16, '1', 'ts', 'middle') + text(rx(2), ry(0) + 16, '2', 'ts', 'middle') + text(rx(0) - 6, ry(1) + 4, '1', 'ts', 'end') + text(rx(0) - 6, ry(-1) + 4, '−1', 'ts', 'end');
  o += text(rx(1), 262, 'area 2，density ½', 't', 'middle');
  o += text(280, 290, '灰色小方块：area 0.04 变成 0.08。彩色 triangle 是 U &lt; ½：左边 area ⅛ × 1，右边 area ¼ × ½，都是 ⅛', 'ts', 'middle');
  return svg(560, 302, o, 'Unit square 在 u 等于 x 加 y、v 等于 y 减 x 的 transformation 下变成 area 为 2 的 diamond，density 从 1 变成二分之一；一个小方块的 area 也翻倍');
}

// CLT：n 个 die 的 sum 的 exact PMF，与同 mean、同 variance 的 normal density
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
    o += text(x0, 187, String(lo), 'ts', 'middle') + text(x1, 187, String(hi), 'ts', 'middle') + text((x0 + x1) / 2, 187, 'sum', 'ts', 'middle');
    o += text((x0 + x1) / 2, 20, n === 1 ? '1 个 die' : n + ' 个 die', 'tb', 'middle');
  });
  o += text(280, 212, '柱子是 sum 的 exact PMF，黑线是 mean、variance 相同的 normal density', 'ts', 'middle');
  return svg(560, 222, o, '1 个、2 个、10 个 die 的 sum 的 PMF；die 越多，柱形越贴近 normal 曲线');
}

// CLT 对 skewed 的 distribution 来得慢：n 个 Exp(1) 之和 standardize 后的 exact density
function cltskew() {
  let o = '';
  const ns = [1, 4, 30];
  const lfact = (m) => { let s = 0; for (let i = 2; i <= m; i++) s += Math.log(i); return s; };
  ns.forEach((n, pi) => {
    const rt = Math.sqrt(n);
    const fz = (z) => { const s = n + z * rt; return s <= 0 ? 0 : rt * Math.exp((n - 1) * Math.log(s) - s - lfact(n - 1)); };
    let cdf0 = 0, term = Math.exp(-n);
    for (let k = 0; k < n; k++) { cdf0 += term; term *= n / (k + 1); }
    cdf0 = 1 - cdf0;
    const x0 = 30 + pi * 180, x1 = x0 + 150;
    const sx = lin(-3.2, 3.2, x0, x1), sy = lin(0, 1.05, 170, 36);
    const zmin = Math.max(-3.2, -rt);
    o += path(area(fz, zmin + 1e-6, 3.2, sx, sy), 'wash-strong') + path(curve(phi, -3.2, 3.2, sx, sy), 'ink');
    o += line(x0, 170, x1, 170, 'axis') + line(sx(0), 170, sx(0), 174, 'axis');
    o += text(x0, 187, '−3.2', 'ts', 'middle') + text(sx(0), 187, '0', 'ts', 'middle') + text(x1, 187, '3.2', 'ts', 'middle');
    o += text((x0 + x1) / 2, 20, 'n = ' + n, 'tb', 'middle');
    o += text((x0 + x1) / 2, 206, `P(Zₙ ≤ 0) = ${cdf0.toFixed(3)}`, 'ts', 'middle');
  });
  o += text(280, 232, '涂色是 n 个 Exp(1) 之和 standardize 后的 exact density，黑线是 N(0, 1)，它的 P(Z ≤ 0) = 0.500', 'ts', 'middle');
  return svg(560, 242, o, 'n 等于 1、4、30 时，n 个 exponential 之和 standardize 后的 density 与 standard normal 的对比；n 越大越接近，但 n 等于 4 时仍明显偏斜');
}

// 第 1 站：两次 4-sided die 的 16 个 outcome；左边 B = {min = 2}，右边“至少一次 4” = 两条重叠的带
function dice() {
  const S = 34, y0 = 52;
  let o = '';
  const grid = (x0, inA, inB2, title, note) => {
    for (let x = 1; x <= 4; x++) for (let y = 1; y <= 4; y++) {
      const a = inA(x, y), b = inB2 ? inB2(x, y) : false;
      const px = x0 + (x - 1) * S, py = y0 + (4 - y) * S;
      o += rect(px, py, S, S, a && b ? 'solid' : (a || b) ? 'wash-strong' : 'frame');
      if (!(a && b)) o += rect(px, py, S, S, 'frame');
      o += text(px + S / 2, py + S / 2 + 4, `${x},${y}`, a && b ? 'tw' : (a || b) ? 't' : 'ts', 'middle');
    }
    for (let k = 1; k <= 4; k++) o += text(x0 + (k - 0.5) * S, y0 + 4 * S + 15, String(k), 'ts', 'middle') + text(x0 - 7, y0 + (4.5 - k) * S + 4, String(k), 'ts', 'end');
    o += text(x0 + 2 * S, y0 + 4 * S + 31, 'first roll x', 'ts', 'middle') + text(x0 - 7, y0 - 8, 'second roll y', 'ts', 'start');
    o += text(x0 + 2 * S, 22, title, 'tb', 'middle');
    note.forEach((t, i) => { o += text(x0 + 4 * S + 14, y0 + 30 + 20 * i, t, 'ts', 'start'); });
  };
  let nB = 0, n4 = 0;
  for (let x = 1; x <= 4; x++) for (let y = 1; y <= 4; y++) { if (Math.min(x, y) === 2) nB++; if (x === 4 || y === 4) n4++; }
  grid(48, (x, y) => Math.min(x, y) === 2, null, 'B = {min(x, y) = 2}', [`${nB} 个 outcome`, `P(B) = ${nB}/16`]);
  grid(318, (x, y) => x === 4, (x, y) => y === 4, '至少一次 4', ['x = 4：4 格', 'y = 4：4 格', '重叠 (4,4)：1 格', `4 + 4 − 1 = ${n4}`]);
  return svg(560, 238, o, '两次掷 4-sided die 的 16 个 outcome 排成 4 乘 4 的格子。左边涂色的 5 格是 min 等于 2；右边第一次是 4 的一列和第二次是 4 的一行，交于 (4,4)，合起来 7 格');
}

// 第 5 站：Bayes' billiards（n = 5 个白球）。上：先定红球的位置 x；下：先扔 6 个球再随机挑一个涂红
function billiards() {
  const W = [0.08, 0.27, 0.55, 0.71, 0.9], R = 0.42, n = W.length;
  const sx = lin(0, 1, 50, 510);
  const K = W.filter((w) => w < R).length;
  let o = text(30, 22, '第一种：先扔红球，落在 x；每个白球独立地以 probability x 落在它左边', 'tb');
  const y1 = 70;
  o += rect(sx(0), y1 - 12, sx(R) - sx(0), 24, 'wash');
  o += line(sx(0), y1, sx(1), y1, 'axis') + text(sx(0), y1 + 30, '0', 'ts', 'middle') + text(sx(1), y1 + 30, '1', 'ts', 'middle');
  for (const w of W) o += circle(sx(w), y1, 7, 'paper');
  o += circle(sx(R), y1, 7, 'solid') + text(sx(R), y1 + 30, 'x = ' + R, 'tl', 'middle');
  o += text((sx(0) + sx(R)) / 2, y1 - 18, 'length x', 'ts', 'middle');
  o += text(sx(1), y1 - 18, `这一次 K = ${K}；given x，K ~ Bin(${n}, x)`, 'ts', 'end');
  o += text(30, 140, `第二种：先扔 ${n + 1} 个一样的球，再随机挑一个涂红`, 'tb');
  const all = [...W, R].sort((a, b) => a - b), y2 = 186;
  o += line(sx(0), y2, sx(1), y2, 'axis');
  all.forEach((v, k) => {
    o += circle(sx(v), y2, 7, v === R ? 'solid' : 'paper');
    o += text(sx(v), y2 + 26, 'K = ' + k, v === R ? 'tl' : 'ts', 'middle');
  });
  o += text(280, 238, `红球在 ${n + 1} 个名次里 equally likely，所以 K 取 0, 1, …, ${n} 各 1/${n + 1}`, 'ts', 'middle');
  return svg(560, 250, o, 'Bayes billiards：5 个白球和 1 个红球扔在 0 到 1 上。上面先定红球在 0.42，左边有 2 个白球；下面把 6 个球排好，红球是哪一个都等可能，K 取 0 到 5 各六分之一');
}

// 开头第一次：同一手 card 被“先各挑一张，第四张随便挑”造出两遍
function twice() {
  const card = (x, y, rank, suit, cls = 'paper') => {
    const red = suit === '♥' || suit === '♦';
    return rect(x, y, 40, 54, cls, 5) + text(x + 20, y + 25, rank, red ? 'tl' : 'tb', 'middle') + text(x + 20, y + 44, suit, red ? 'tl' : 'tb', 'middle');
  };
  const slots = ['挑一张 J', '挑一张 Q', '挑一张 K', '剩下 49 张里任取'];
  const X = [40, 100, 160, 236];
  let o = '';
  slots.forEach((s, i) => { o += text(X[i] + 20, 24, s, 'ts', 'middle'); });
  const rows = [[['J', '♠'], ['Q', '♦'], ['K', '♣'], ['J', '♥']], [['J', '♥'], ['Q', '♦'], ['K', '♣'], ['J', '♠']]];
  rows.forEach((r, k) => {
    const y = 40 + k * 92;
    o += text(10, y + 32, k ? '②' : '①', 'tb', 'middle');
    r.forEach(([rk, su], i) => { o += card(X[i], y, rk, su, (i === 0 || i === 3) ? 'wash-strong' : 'paper'); });
    o += arrow(290, y + 27, 352, k ? 128 : 102, 'mute');
  });
  o += line(222, 34, 222, 190, 'grid');
  // 右边：造出的那一手（unordered）
  o += rect(362, 70, 186, 90, 'wash', 6);
  [['J', '♠'], ['J', '♥'], ['Q', '♦'], ['K', '♣']].forEach(([rk, su], i) => { o += card(372 + i * 44, 88, rk, su); });
  o += text(455, 60, '造出的是同一手 card', 'tb', 'middle');
  o += text(455, 182, '这一手在 3136 里被数了两次', 'tl', 'middle');
  o += text(280, 224, '两张 J 谁在第一步、谁在第四步都行，所以凡是某个 rank 有两张的 hand（288 手）都被数两遍：', 'ts', 'middle');
  o += text(280, 242, '2 × 288 + 2560 = 3136，正确的是 288 + 2560 = 2848', 'ts', 'middle');
  return svg(560, 254, o, '两种选法造出同一手 card：第一步挑黑桃 J、第四步挑红桃 J，或者反过来，结果都是黑桃 J、红桃 J、方块 Q、梅花 K，所以这手 card 被数了两次');
}

// 开头第二次：1000 个被拦下的 driver，每个点是一个人；test 之后只剩 positive 的人
function crowd() {
  const cols = 40, gap = 8.4, x0 = 20, y0 = 48;
  const T = 9, kt = [0, 3 / T, 6 / T, 1];
  // 980 个 sober 里取 49 个 false positive（期望 980 × 5% = 49），用固定的伪随机挑位置
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const fp = new Set(); while (fp.size < 49) fp.add(20 + Math.floor(rnd() * 980));
  let drunk = '', pos = '', neg = '';
  for (let i = 0; i < 1000; i++) {
    const cx = x0 + (i % cols) * gap, cy = y0 + Math.floor(i / cols) * gap;
    if (i < 20) drunk += circle(cx, cy, 3.2, 'solid');
    else if (fp.has(i)) pos += circle(cx, cy, 3.2, 'ink-f');
    else neg += circle(cx, cy, 2.6, 'wash2');
  }
  // 帧：0 全体（positive 的 sober 还看不出来） / 1 test 结果亮出来 / 2 只剩 positive
  let o = `<g>${neg}${anim('opacity', [1, 1, 0.12, 0.12], kt, T, true)}</g>`;
  o += `<g>${pos.replace(/class="ink-f"/g, 'class="wash2"')}${ashow([1, 0, 0, 1], kt, T)}</g>`;
  o += `<g>${pos}${ashow([0, 1, 1, 0], kt, T)}</g>`;
  o += drunk;
  o += text(x0 - 4, 30, '1000 个被拦下的 driver，每个点是一个人', 'tb', 'start');
  const X = 370;
  const say = (lines, on) => `<g>${lines.map(([s, cls], k) => text(X, 70 + k * 20, s, cls)).join('')}${ashow(on, kt, T)}</g>`;
  o += say([['20 个 drunk（左上角深色）', 'tl'], ['980 个 sober', 't'], ['', 't'], ['Test 对 drunk 98% 报 positive，', 'ts'], ['对 sober 95% 报 negative。', 'ts']], [1, 0, 0, 1]);
  o += say([['做 test：', 'tb'], ['20 个 drunk 几乎全是 positive', 'tl'], ['（期望 19.6 个）', 'ts'], ['980 个 sober 里 5% 也 positive', 't'], ['（期望 49 个，亮出来的点）', 'ts']], [0, 1, 0, 0]);
  o += say([['只留下 positive 的人：', 'tb'], ['19.6 个 drunk + 49 个 sober', 't'], ['= 68.6 个', 't'], ['drunk 只占 19.6 / 68.6 ≈ 28.6%', 'tl'], ['不是 98%', 'ts']], [0, 0, 1, 0]);
  return svgA(560, 264, o, '动图：1000 个 driver 画成 1000 个点，其中 20 个 drunk；做 test 后 drunk 的几乎都 positive，980 个 sober 里也有 49 个 positive；只留 positive 的人时，drunk 只占约 28.6%');
}

// 第 5 站：Uniform prior → 4 次 3 head → 再 4 次 1 head 的 posterior
function posterior() {
  const lg = (z) => { let s = 0; for (let k = 2; k < z; k++) s += Math.log(k); return s; }; // log((z-1)!)，z 是 integer
  const beta = (a, b) => (x) => Math.exp(lg(a + b) - lg(a) - lg(b) + (a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x));
  const sx = lin(0, 1, 60, 520), sy = lin(0, 2.6, 272, 92);
  const seq = ['H', 'T', 'H', 'H', 'H', 'T', 'T', 'T'];
  const st = [[1, 1]]; seq.forEach((c) => { const [a, b] = st[st.length - 1]; st.push(c === 'H' ? [a + 1, b] : [a, b + 1]); });
  // 时间：先停在最后（静态图看到的就是全部 8 次之后），再从 prior 起每 1.1 s 一次 toss
  const step = 1.1, hold0 = 2.6, T = hold0 + 0.8 + step * seq.length + 1.2;
  const frames = [8, 0], shown = [8, 0], times = [0, hold0];
  for (let i = 1; i <= 8; i++) { frames.push(i - 1, i); shown.push(i, i); times.push(hold0 + 0.8 + step * (i - 1), hold0 + 0.8 + step * (i - 1) + 0.35); }
  frames.push(8); shown.push(8); times.push(T);
  const kt = times.map((t) => t / T);
  const curveD = (k) => curve(beta(...st[k]), 0.002, 0.998, sx, sy, 160);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 2.6, xt: [0, [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], 1], yt: [[1, '1'], [2, '2']], xl: 'x = P(head)', yl: 'density' });
  // 两个 milestone 留作参照
  o += path(curve(beta(1, 1), 0.002, 0.998, sx, sy), 'mute') + text(sx(0.02), sy(1) - 6, 'prior Beta(1, 1)', 'ts');
  o += path(curve(beta(4, 2), 0.002, 0.998, sx, sy), 'ln-dash') + text(sx(0.86), sy(2.1), 'Beta(4, 2)', 'tl', 'start');
  o += apath(frames.map(curveD), kt, T, 'ink-b');
  const mx = frames.map((k) => sx(st[k][0] / (st[k][0] + st[k][1])));
  o += `<line x1="${mx[0]}" y1="${sy(0)}" x2="${mx[0]}" y2="${sy(2.6)}" class="dash">${anim('x1', mx, kt, T)}${anim('x2', mx, kt, T)}</line>`;
  // 上面一排：toss 的结果
  o += text(156, 20, '第一轮 4 次 toss：3 head', 'ts', 'middle') + text(376, 20, '第二轮 4 次 toss：1 head', 'ts', 'middle');
  seq.forEach((c, i) => {
    const x = 90 + i * 44 + (i >= 4 ? 28 : 0);
    o += circle(x, 44, 14, 'paper');
    const on = shown.map((k) => k > i);
    o += `<g>${circle(x, 44, 14, c === 'H' ? 'solid' : 'wash2')}${text(x, 49, c, c === 'H' ? 'tw' : 't', 'middle')}${ashow(on, kt, T)}</g>`;
  });
  o += line(240, 28, 240, 60, 'grid');
  // 状态说明：现在是哪个 Beta、mean 多少
  for (let k = 0; k <= 8; k++) {
    const [a, b] = st[k], on = shown.map((f) => f === k);
    o += `<g>${text(84, 112, `现在：Beta(${a}, ${b})`, 'tl', 'start')}${text(84, 130, `mean = ${a}/${a + b}`, 'ts', 'start')}${ashow(on, kt, T)}</g>`;
  }
  return svgA(560, 312, o, '动图：coin 依次出 H T H H，再出 H T T T；每次 head 把 Beta 的第一个 parameter 加 1，每次 tail 把第二个加 1，density 从平的 Beta(1,1) 变到 Beta(4,2)，再变到 Beta(5,5)，越来越窄');
}

// 第 1 站：stars and bars。8 个一样的球，7 个空隙里选 4 个插隔板，切成 5 段
function stars() {
  const n = 8, bars = [2, 3, 6, 7]; // 隔板插在第 i 个球之后
  const sp = 52, x0 = 280 - ((n - 1) * sp) / 2, y = 92;
  const bx = (i) => x0 + (i - 0.5) * sp; // 第 i 个球之后的空隙
  let o = text(280, 24, `8 个一样的球之间有 ${n - 1} 个空隙，选 ${bars.length} 个插隔板：C(${n - 1}, ${bars.length}) = ${C(n - 1, bars.length)}`, 'tb', 'middle');
  for (let i = 1; i < n; i++) {
    const on = bars.includes(i);
    if (on) o += line(bx(i), y - 30, bx(i), y + 30, 'ink-b');
    else o += line(bx(i), y + 12, bx(i), y + 20, 'mute');
    o += text(bx(i), y + 46, String(i), on ? 'tb' : 'ts', 'middle');
  }
  for (let i = 0; i < n; i++) o += circle(x0 + i * sp, y, 13, 'solid');
  o += text(x0 - 30, y + 46, '空隙', 'ts', 'end');
  const cuts = [0, ...bars, n];
  for (let s = 0; s < cuts.length - 1; s++) {
    const a = x0 + cuts[s] * sp - sp / 2 + 6, b = x0 + (cuts[s + 1] - 1) * sp + sp / 2 - 6;
    o += path(d([[a, 154], [a, 162], [b, 162], [b, 154]]), 'mute');
    o += text((a + b) / 2, 182, `box ${s + 1}`, 'ts', 'middle') + text((a + b) / 2, 200, String(cuts[s + 1] - cuts[s]), 'tl', 'middle');
  }
  o += text(280, 230, `这一种插法对应 (${cuts.slice(1).map((c, s) => c - cuts[s]).join(', ')})，和为 ${n}；隔板不插两端、不重叠，所以每个 box 至少一个`, 'ts', 'middle');
  return svg(560, 244, o, '8 个一样的球排成一行，球之间的 7 个空隙里有 4 个插了隔板，把球切成 2、1、3、1、1 五段，对应 5 个 box 里的球数');
}

export default {
  'st2131-stars': stars,
  'st2131-inclusion': inclusion,
  'st2131-cond': cond,
  'st2131-bayes': bayes,
  'st2131-pdf': pdf,
  'st2131-support': support,
  'st2131-region': region,
  'st2131-tower': tower,
  'st2131-hier': hier,
  'st2131-stretch': stretch,
  'st2131-jacobian': jacobian,
  'st2131-clt': clt,
  'st2131-cltskew': cltskew,
  'st2131-dice': dice,
  'st2131-billiards': billiards,
  'st2131-posterior': posterior,
  'st2131-twice': twice,
  'st2131-crowd': crowd,
};
