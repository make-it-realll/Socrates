import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// 两个小面板共用：画一条折线
const polyline = (xs, ys, sx, sy, cls) => path(d(xs.map((x, i) => [sx(x), sy(ys[i])])), cls);

// 1. GAE：λ 从 0 到 1，policy gradient estimate 的 |bias|、standard deviation 和 RMSE
// 数据来自 /tmp 下的模拟：21 个 state 的 random walk，π(right) = 0.6，γ = 0.98，
// critic 的 error ~ N(0, 0.1)（seed 0），20000 条 trajectory（seed 1）。
function gae() {
  const lam = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
  const b2 = [0.00094, 0.000653, 0.000436, 0.000276, 0.000161, 0.000082, 0.000034, 0.000009, 0.000001, 0, 0];
  const v = [0.000153, 0.000184, 0.000208, 0.000225, 0.00024, 0.000254, 0.000275, 0.000323, 0.000477, 0.00119, 0.009962];
  const bias = b2.map(Math.sqrt), sd = v.map(Math.sqrt), rmse = b2.map((x, i) => Math.sqrt(x + v[i]));
  const sx = lin(0, 1, 70, 400), sy = lin(0, 0.105, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 0.105, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt: [[0.02, '0.02'], [0.04, '0.04'], [0.06, '0.06'], [0.08, '0.08'], [0.1, '0.10']], xl: 'λ', grid: true });
  o += line(sx(0), sy(0.0178), sx(1), sy(0.0178), 'ln-dash');
  o += polyline(lam, sd, sx, sy, 'mute') + polyline(lam, bias, sx, sy, 'ink') + polyline(lam, rmse, sx, sy, 'ln');
  for (let i = 0; i < lam.length; i++) o += circle(sx(lam[i]), sy(rmse[i]), 2.5, 'ln-f');
  const k = rmse.indexOf(Math.min(...rmse));
  o += line(sx(lam[k]), sy(rmse[k]) - 5, sx(lam[k]), sy(0.044), 'mute') + text(sx(lam[k]), sy(0.044) - 6, `最小 RMSE 在 λ = ${lam[k]}`, 'tl', 'middle');
  o += text(412, sy(0.0998) + 4, 'λ = 1：std 0.0998', 'ts');
  o += text(412, sy(0.0178) - 6, 'true gradient', 'ts') + text(412, sy(0.0178) + 9, '= 0.0178', 'ts');
  o += line(412, 106, 436, 106, 'ln') + text(442, 110, 'RMSE', 'tl');
  o += line(412, 126, 436, 126, 'mute') + text(442, 130, 'standard deviation', 'ts');
  o += line(412, 146, 436, 146, 'ink') + text(442, 150, '|bias|', 't');
  o += text(70, 18, '单个 trajectory 的 gradient estimate（第一个 action），随 λ 的变化', 'tb');
  o += text(70, 282, '数据来自模拟：critic 带 N(0, 0.1) 的 error，20000 条 trajectory', 'ts');
  return svg(560, 292, o, 'GAE 的 lambda 从 0 增大到 1：bias 下降到 0，standard deviation 上升，RMSE 在中间最小');
}

// 2. PPO 的 clipped objective：A > 0 和 A < 0 两种情形
function clip() {
  const eps = 0.2;
  let o = '';
  const panel = (x0, A, title) => {
    const sx = lin(0.4, 1.6, x0, x0 + 220), sy = A > 0 ? lin(0.3, 1.7, 220, 40) : lin(-1.7, -0.3, 220, 40);
    o += line(x0, 220, x0 + 220, 220, 'axis') + line(x0, 220, x0, 40, 'axis');
    o += rect(sx(1 - eps), 40, sx(1 + eps) - sx(1 - eps), 180, 'wash2');
    o += path(curve((r) => r * A, 0.4, 1.6, sx, sy), 'dash');
    o += path(curve((r) => Math.min(r * A, Math.min(Math.max(r, 1 - eps), 1 + eps) * A), 0.4, 1.6, sx, sy), 'ln');
    for (const r of [1 - eps, 1, 1 + eps]) o += line(sx(r), 220, sx(r), 225, 'axis') + text(sx(r), 238, r.toFixed(1), 'ts', 'middle');
    o += text(x0 + 220, 254, 'ratio ρ', 'ts', 'end');
    o += text(x0 + 110, 24, title, 'tb', 'middle');
    if (A > 0) {
      o += text(sx(1.2) + 6, sy(1.2) + 20, '平的：', 'ts') + text(sx(1.2) + 6, sy(1.2) + 36, 'gradient = 0', 'ts');
      o += text(sx(0.62), sy(0.62) - 30, '仍有 gradient', 'ts', 'middle');
      o += text(sx(1.58), sy(1.58) + 2, 'ρ·A', 'ts', 'end');
    } else {
      o += text(x0 + 8, sy(-0.8) + 20, '平的：', 'ts') + text(x0 + 8, sy(-0.8) + 36, 'gradient = 0', 'ts');
      o += text(sx(1.05), sy(-1.5), '仍有 gradient', 'ts', 'middle');
    }
  };
  panel(50, 1, 'A > 0：ρ 超过 1 + ε 后不再有好处');
  panel(310, -1, 'A < 0：ρ 低于 1 − ε 后不再有好处');
  o += text(280, 276, '彩线是 min(ρA, clip(ρ, 1 − ε, 1 + ε)A)，ε = 0.2；虚线是不 clip 的 ρA；灰底是 [1 − ε, 1 + ε]', 'ts', 'middle');
  return svg(560, 286, o, 'PPO clipped objective 作为 ratio 的 function：advantage 为正时 ratio 超过 1.2 后变平，advantage 为负时 ratio 低于 0.8 后变平');
}

// 3. 同一批 data 上做多少个 epoch：clip 与不 clip（5-arm bandit，30 轮，每轮 64 个 sample，1000 个 seed）
function epochs() {
  const E = [1, 2, 5, 10, 20, 50, 100];
  const jN = [1.059, 1.111, 1.168, 1.18, 1.18, 1.128, 1.067], jC = [1.059, 1.111, 1.164, 1.172, 1.173, 1.174, 1.175];
  const pN = [0.999, 0.299, 0.021, 0.035, 0.06, 0.329, 0.588], pC = [0.999, 0.299, 0.027, 0.022, 0.03, 0.028, 0.021];
  let o = '';
  const panel = (x0, ys1, ys2, y0, y1, yt, title) => {
    const sx = logx(1, 100, x0, x0 + 200), sy = lin(y0, y1, 220, 40);
    o += axes({ sx, sy, x0: 1, x1: 100, y0, y1, xt: [[1, '1'], [10, '10'], [100, '100']], yt, grid: true });
    o += polyline(E, ys1, sx, sy, 'ln') + polyline(E, ys2, sx, sy, 'ink');
    E.forEach((e, i) => { o += circle(sx(e), sy(ys1[i]), 3, 'ln-f') + circle(sx(e), sy(ys2[i]), 2.5, 'ink-f'); });
    o += text(x0 + 100, 24, title, 'tb', 'middle') + text(x0 + 200, 252, 'epochs（log）', 'ts', 'end');
  };
  panel(60, jN, jC, 1.04, 1.2, [[1.05, '1.05'], [1.1, '1.10'], [1.15, '1.15'], [1.2, '1.20']], '30 轮之后的 J（最优 1.2）');
  panel(330, pN, pC, 0, 1, [[0, '0'], [0.5, '0.5'], [1, '1']], '卡在 J < 1.1 的 seed 比例');
  o += text(510, 76, '不 clip', 'tl', 'end') + text(510, 210, 'clip', 'tb', 'end');
  o += text(280, 274, '5 个 arm 的 bandit，每轮 64 个 sample，在同一批 data 上做 K 个 epoch，1000 个 seed（0–999）', 'ts', 'middle');
  return svg(560, 284, o, '在同一批 data 上训练的 epoch 越多，不 clip 的 surrogate 越容易让 policy 过早收敛到差的 arm；clip 之后 epoch 数几乎不影响结果');
}

// 4. 大规模并行 PPO 的一轮：4096 个 robot × 24 步 → 98304 个 sample → 20 个 gradient step
function batch() {
  let o = '';
  // 左：robots × steps 网格
  const gx = 62, gy = 50;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 8; j++) o += rect(gx + j * 13, gy + i * 11, 11, 9, i % 3 === 0 && j === 0 ? 'solid' : 'wash');
  o += text(gx + 52, gy - 10, '24 步 →', 'ts', 'middle') + text(gx - 8, gy + 66, '4096', 'ts', 'end') + text(gx - 8, gy + 82, '个', 'ts', 'end');
  o += text(gx + 52, gy + 150, '每行一个 robot', 'ts', 'middle') + text(gx + 52, gy + 166, '一轮 0.48 s 的经验', 'ts', 'middle');
  o += arrow(172, 115, 206, 115, 'ink');
  o += rect(210, 85, 120, 60, 'paper', 6) + text(270, 110, 'batch', 'tb', 'middle') + text(270, 128, '98,304 个 sample', 'ts', 'middle');
  o += arrow(332, 115, 358, 115, 'ink');
  o += rect(362, 70, 175, 90, 'paper', 6) + text(450, 92, 'PPO update', 'tb', 'middle') + text(450, 112, '5 epochs × 4 minibatches', 'ts', 'middle') + text(450, 130, '= 20 个 gradient step', 'ts', 'middle') + text(450, 148, '每个 minibatch 24,576', 'ts', 'middle');
  o += path(d([[450, 162], [450, 200], [270, 200], [270, 148]]), 'mute');
  o += poly([[270, 147], [266, 155], [274, 155]], 'mute-f');
  o += text(360, 194, '新 policy 再去收集', 'ts', 'middle');
  o += text(20, 238, '1500 轮 × 98,304 ≈ 1.47 亿个 sample，20 分钟内跑完：约 12 万个 sample / 秒。', 't');
  o += text(20, 258, '每个 sample 分到 20 / 98,304 ≈ 0.0002 个 gradient step；', 't');
  o += text(20, 278, 'UTD = 1 的 off-policy 方法每个 sample 要 1 个，是它的 5000 倍。', 't');
  return svg(560, 290, o, '大规模并行 PPO 的一轮：4096 个 robot 各走 24 步，得到约十万个 sample，做 5 个 epoch、每个 4 个 minibatch 共 20 个 gradient step');
}

// 5. Teacher–student：先用 privileged information 训练 teacher，再用 DAgger 蒸馏给只看 proprioception 的 student
function teacher() {
  let o = '';
  o += text(20, 22, '第一阶段：RL', 'tb') + text(20, 152, '第二阶段：distillation（DAgger）', 'tb');
  o += rect(20, 34, 150, 74, 'wash', 6) + text(95, 54, 'privileged obs', 'tb', 'middle') + text(95, 72, 'terrain、contact、', 'ts', 'middle') + text(95, 88, 'friction、外力', 'ts', 'middle');
  o += rect(20, 112, 150, 26, 'paper', 6) + text(95, 129, 'proprioception', 'ts', 'middle');
  o += arrow(172, 80, 222, 80, 'ink') + arrow(172, 125, 222, 95, 'ink');
  o += rect(225, 60, 110, 48, 'solid', 6) + text(280, 89, 'teacher π', 'tw', 'middle');
  o += arrow(337, 84, 387, 84, 'ink') + rect(390, 60, 150, 48, 'paper', 6) + text(465, 81, 'simulator', 'tb', 'middle') + text(465, 98, 'reward → PPO', 'ts', 'middle');
  // stage 2
  o += rect(20, 166, 150, 44, 'paper', 6) + text(95, 185, 'proprioception', 'ts', 'middle') + text(95, 201, '的 history', 'ts', 'middle');
  o += arrow(172, 188, 222, 188, 'ink') + rect(225, 166, 110, 44, 'solid', 6) + text(280, 193, 'student', 'tw', 'middle');
  o += arrow(337, 188, 387, 188, 'ln') + rect(390, 166, 150, 44, 'paper', 6) + text(465, 185, 'student 的 action', 'ts', 'middle') + text(465, 201, '在 sim 里真的执行', 'ts', 'middle');
  o += rect(225, 236, 110, 36, 'wash', 6) + text(280, 258, 'teacher 标注', 'ts', 'middle');
  o += path(d([[465, 212], [465, 254], [337, 254]]), 'mute') + poly([[337, 254], [345, 250], [345, 258]], 'mute-f');
  o += text(458, 238, 'student 走到的 state', 'ts', 'end');
  o += arrow(280, 234, 280, 212, 'ln');
  o += text(20, 296, 'Loss：student 与 teacher 的 action 之差的 square，加上 latent 之差的 square（Lee et al. 2020）', 'ts');
  return svg(560, 306, o, 'Teacher student 两阶段：teacher 用 privileged observation 通过 RL 训练；student 只看 proprioception 的 history，在自己走到的 state 上模仿 teacher 的 action');
}

// 6. Domain randomization：对 nominal mass 最优的 gain 与对 mass 的 distribution最优的 gain
function dr() {
  const cost = (k, m) => { const c = 1 - k / m; return Math.abs(c) < 1 ? 1 / (1 - c * c) : Infinity; };
  const sx = lin(0.4, 2.0, 70, 400), sy = lin(0.8, 4, 230, 40);
  let o = axes({ sx, sy, x0: 0.4, x1: 2.0, y0: 0.8, y1: 4, xt: [0.4, 0.5, 1, 1.5, 2], yt: [1, 2, 3, 4], xl: 'mass m', yl: 'cost Σ x²', grid: true });
  o += rect(sx(0.4), 40, sx(0.5) - sx(0.4), 190, 'wash2');
  o += path(curve((m) => (cost(1, m) > 4.02 ? NaN : cost(1, m)), 0.5005, 2, sx, sy, 400), 'ln');
  o += path(curve((m) => cost(0.728, m), 0.4, 2, sx, sy, 400), 'ink');
  o += text(sx(0.7), sy(3.4), '灰底 m < 0.5：k = 1 diverge', 'ts');
  o += text(412, 70, 'k = 1', 'tl') + text(412, 88, '对 m = 1 最优', 'ts');
  o += text(412, 140, 'k = 0.728', 'tb') + text(412, 158, '对 m ~ U[0.4, 2]', 'ts') + text(412, 174, '的平均 cost 最优', 'ts');
  o += text(70, 14, 'xₜ₊₁ = xₜ + uₜ / m，uₜ = −k xₜ，从 x₀ = 1 出发', 'tb');
  o += text(70, 284, '代价：在 m = 1 处 cost 从 1.00 变成 1.08；换来的是整个区间都 stable。', 'ts');
  return svg(560, 294, o, '对 nominal mass 最优的 gain 在 mass 小于 0.5 时 diverge；对 mass 的 distribution平均最优的 gain 在整个区间都 stable，只在 nominal 处略差');
}

// 7. Reward shaping 的环路：赛道与 lagoon
function shaping() {
  let o = '';
  const node = (x, y, s, cls = 'paper') => o += circle(x, y, 20, cls) + text(x, y + 5, s, cls === 'solid' ? 'tw' : 'tb', 'middle');
  node(60, 70, '0'); node(180, 70, '1'); node(300, 70, '2'); node(430, 70, 'finish', 'solid');
  o += arrow(82, 70, 157, 70, 'ink') + arrow(202, 70, 277, 70, 'ink') + arrow(322, 70, 407, 70, 'ink');
  o += text(365, 60, 'r = 10', 'tl', 'middle');
  node(180, 170, 'L', 'wash');
  o += path('M168 92 C150 120 150 140 166 152', 'ln') + poly([[166, 152], [157, 147], [163, 141]], 'ln-f');
  o += path('M194 152 C210 140 210 120 194 92', 'mute') + poly([[194, 92], [188, 100], [200, 101]], 'mute-f');
  o += text(140, 128, 'loop', 'tl', 'end') + text(212, 128, '回到 1', 'ts');
  o += text(180, 206, 'lagoon 里的 target', 'ts', 'middle');
  const rows = [['reward', 'Q(1, fwd)', 'Q(1, loop)', '选择'], ['只有终点 +10', '9.90', '9.70', 'fwd'], ['进 L 时加 +1', '9.90', '50.25', 'loop'], ['potential-based', '8.90', '8.70', 'fwd']];
  rows.forEach((r, i) => {
    const y = 236 + i * 20;
    o += text(20, y, r[0], i ? 't' : 'tb') + text(230, y, r[1], i ? 't' : 'tb', 'middle') + text(330, y, r[2], i === 2 ? 'tl' : (i ? 't' : 'tb'), 'middle') + text(430, y, r[3], i ? 't' : 'tb', 'middle');
  });
  o += line(20, 242, 470, 242, 'grid');
  return svg(560, 310, o, '一条赛道从 0 经 1、2 到终点；在 1 处可以绕进 lagoon 再回来。给 lagoon 里的 target 加 reward 后，无限绕圈的 value 超过跑完全程');
}

// 8. Truncation 当成 termination：critic 学到的 value 随 time limit T 的变化
function trunc() {
  const g = 0.99;
  const vb = (T) => 1 / (1 - g * (1 - 1 / T));
  const sx = logx(10, 10000, 70, 420), sy = lin(0, 110, 230, 30);
  let o = axes({ sx, sy, x0: 10, x1: 10000, y0: 0, y1: 110, xt: [[10, '10'], [100, '100'], [1000, '1000'], [10000, '10⁴']], yt: [0, 20, 40, 60, 80, 100], xl: 'time limit T（log）', grid: true });
  o += line(sx(10), sy(100), sx(10000), sy(100), 'ink-b') + line(sx(10), sy(60), sx(10000), sy(60), 'ln-dash');
  const pts = []; for (let i = 0; i <= 200; i++) { const T = 10 ** (1 + 3 * i / 200); pts.push([sx(T), sy(vb(T))]); }
  o += path(d(pts), 'ln');
  o += circle(sx(100), sy(vb(100)), 4, 'ln-f') + text(sx(148.5) + 8, sy(42), '圆点：T = 100 时 V = 50.25', 'tl');
  o += line(sx(148.5), sy(60), sx(148.5), 230, 'mute') + text(sx(148.5) + 4, 222, 'T ≈ 148', 'ts');
  o += text(430, sy(100) + 4, '正确：100', 'tb') + text(430, sy(60) + 4, 'jump 的 reward 60', 'ts');
  o += text(430, sy(80), '有 bug 时', 'tl') + text(430, sy(80) + 16, '学到的 V', 'ts');
  o += text(70, 18, '一个 state，stay 每步 +1，γ = 0.99；critic 评估“一直 stay”', 'tb');
  o += text(70, 284, 'T 小于约 148 时，有 bug 的 V 低于 60，“jump”的 advantage 变成正的。', 'ts');
  return svg(560, 294, o, '把 truncation 当成 termination 后，critic 学到的 value 随 time limit 变化，远低于正确值 100；time limit 小于约 148 时会让错误的 action 看起来更好');
}

// 9. Offline：fit 出来的 Q(a)，data 只覆盖 [−0.3, 0.3]
function offline() {
  const q = (w) => (a) => w[0] + w[1] * a + w[2] * a * a + w[3] * a * a * a;
  const naive = q([23.8549, -0.1429, -0.6156, 3.7097]), cql = q([9.2263, 0.5538, -11.6764, -3.0037]);
  const sx = lin(-1, 1, 70, 400), sy = lin(-6, 30, 235, 44);
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: -6, y1: 30, xt: [-1, -0.5, 0, 0.5, 1], yt: [0, 10, 20, 30], xl: 'action a', yl: 'Q(a)', grid: true, xAt: -6 });
  o += rect(sx(-0.3), 44, sx(0.3) - sx(-0.3), 191, 'wash');
  o += line(sx(-1), sy(0), sx(1), sy(0), 'axis');
  o += path(curve((a) => 10 - a * a, -1, 1, sx, sy), 'dash');
  o += path(curve(naive, -1, 1, sx, sy), 'ln') + path(curve(cql, -1, 1, sx, sy), 'ink-b');
  o += text(sx(0), 62, 'data 只在这里', 'ts', 'middle');
  o += text(412, sy(26.8) + 4, '不加 penalty', 'tl') + text(412, sy(26.8) + 20, '（α = 0）', 'ts');
  o += text(412, sy(10) - 2, 'Q*(a) = 10 − a²', 'ts');
  o += text(412, sy(-4.9) + 4, 'CQL，α = 1', 'tb');
  o += text(70, 16, '一个 state 的 self-loop，γ = 0.9，Q 是 a 的 cubic polynomial', 'tb');
  o += text(70, 290, 'α = 0 时 softmax policy 有 85.5% 的 probability 落在 data 以外。', 'ts');
  return svg(560, 300, o, '只在 action 区间中间有 data 时，不加约束 fit 出的 Q 在两端外推得很高；CQL 把 data 以外的 Q 压低，最大值回到 data 区域');
}

// 10. GRPO：一组 G 个 rollout 里同时有成功和失败的 probability
function mixed() {
  const sx = lin(0, 1, 70, 420), sy = lin(0, 1, 230, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.2, 0.4, 0.6, 0.8, 1], yt: [0, 0.5, 1], xl: '单次 rollout 的 success probability p', grid: true });
  const f = (G) => (p) => 1 - p ** G - (1 - p) ** G;
  o += path(curve(f(8), 0, 1, sx, sy, 400), 'ln') + path(curve(f(64), 0, 1, sx, sy, 400), 'ink');
  o += circle(sx(0.01), sy(f(8)(0.01)), 3.5, 'ln-f') + text(sx(0.01) + 8, sy(f(8)(0.01)) + 4, 'p = 0.01：0.077', 'tl');
  o += text(sx(0.86), sy(0.93), 'G = 64', 'tb', 'middle');
  o += text(sx(0.17) + 4, sy(f(8)(0.17)) + 18, 'G = 8', 'tl');
  o += text(70, 18, '一组里 reward 不全相同的 probability：1 − pᴳ − (1 − p)ᴳ', 'tb');
  o += text(70, 284, 'Reward 全是 0 或全是 1 的组，advantage 全为 0，这组 sample 不产生 gradient。', 'ts');
  return svg(560, 294, o, '一组 G 个 binary reward 的 rollout 中同时出现成功与失败的 probability；p 接近 0 或 1 时迅速下降，G 越大越平');
}

// 11. pass@k：构造出来的 base model 与 RL 之后的 model
function passk() {
  const base = (k) => 0.5 * (1 - 0.4 ** k) + 0.5 * (1 - 0.98 ** k);
  const rl = (k) => 0.5 * (1 - 0.05 ** k) + 0.1 * (1 - 0.9 ** k);
  const sx = logx(1, 256, 70, 410), sy = lin(0.2, 1, 230, 40);
  let o = axes({ sx, sy, x0: 1, x1: 256, y0: 0.2, y1: 1, xt: [[1, '1'], [4, '4'], [16, '16'], [64, '64'], [256, '256']], yt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6'], [0.8, '0.8'], [1, '1.0']], xl: 'k（log）', yl: 'pass@k', grid: true });
  const pts = (fn) => { const p = []; for (let i = 0; i <= 160; i++) { const k = 2 ** (8 * i / 160); p.push([sx(k), sy(fn(k))]); } return d(p); };
  o += path(pts(base), 'ink-b') + path(pts(rl), 'ln');
  o += text(420, sy(0.997) + 4, 'base 0.997', 'tb') + text(420, sy(0.6) + 4, 'RL 之后 0.600', 'tl');
  o += text(sx(1) + 6, sy(0.485) - 14, '0.485', 'tl') + text(sx(1) + 6, sy(0.31) + 16, '0.310', 'tb');
  o += text(70, 16, '构造的例子（不是实验数据）：k 小时 RL 更好，k 大时 base 更好', 'tb');
  o += text(70, 284, 'Base：一半题 p = 0.6，一半 p = 0.02。RL 之后：前一半 0.95，后一半里 10 道 0.1、40 道 0。', 'ts');
  return svg(560, 294, o, '构造的 pass at k 曲线：RL 之后的 model 在 k 小时更高，但 k 大时被 base model 超过');
}

// 12. 同一份代码、10 个 seed：numpy 写的 PPO 在 CartPole 上
// 数据：/tmp 下的 numpy 实现（4 个 env × 128 步一轮，lr 1e-3，4 epochs × 4 minibatches），seed 0–9，每 6 轮取一个点
const SEEDS_ALL = [[41,78,125,188,215,235,195,203,234,267,260,187,179,173,224,179,186,198,147,132,135,168,172,191,255,315,390,424,403,271,304,385,425,330,296,321,368,311,233,228,207,212,230,246,248,283,312,304,281],[39,79,122,152,198,254,346,350,381,326,230,147,172,166,191,165,167,171,213,252,268,285,217,161,161,219,264,296,337,347,265,230,245,326,344,239,218,220,210,207,222,222,223,216,205,207,211,211,210],[31,73,121,163,185,230,254,286,268,191,236,333,294,271,309,365,415,404,427,397,395,358,297,242,257,281,228,291,315,319,365,438,480,481,463,463,482,489,499,499,499,492,492,479,487,487,500,500,500],[41,74,116,151,241,276,251,254,287,232,270,242,201,233,151,134,210,294,343,323,171,142,144,173,191,191,213,237,250,281,306,323,379,407,433,409,398,353,348,336,302,300,338,334,311,298,316,328,333],[46,105,122,190,223,228,235,190,212,256,272,215,206,171,229,299,325,218,204,202,180,199,224,224,201,206,220,199,218,254,314,374,390,333,335,353,280,245,238,263,276,256,261,240,213,212,219,240,230],[38,82,139,207,274,293,252,278,299,306,346,405,319,151,180,188,201,249,257,312,316,195,151,152,140,158,155,126,140,164,174,162,148,148,147,142,148,130,119,133,132,140,149,160,164,161,166,161,170],[38,79,134,196,231,225,206,195,259,282,247,221,210,204,178,198,240,235,211,186,151,140,140,151,179,218,190,206,233,189,164,144,151,157,139,138,157,159,168,165,169,175,181,179,188,185,190,186,201],[36,78,126,184,222,198,191,201,242,240,264,291,274,174,145,153,158,166,171,201,218,184,152,164,183,184,183,217,253,292,328,317,250,226,239,251,243,236,246,278,311,313,312,311,304,306,322,326,333],[31,71,126,160,151,198,241,271,202,153,146,144,146,180,202,245,300,266,206,221,269,231,252,303,312,279,174,167,151,163,151,170,181,179,197,207,209,219,201,178,191,188,179,182,175,159,158,166,156],[35,103,156,202,257,233,241,166,162,222,250,191,227,238,185,207,184,203,222,166,178,177,147,158,195,212,227,213,202,204,188,203,179,173,166,160,168,169,193,180,191,176,174,174,173,178,180,172,185]];
function seeds() {
  const S = SEEDS_ALL;
  const n = S[0].length, xs = Array.from({ length: n }, (_, i) => 2048 + i * 3072);
  const sx = lin(0, 150000, 70, 400), sy = lin(0, 520, 230, 40);
  let o = axes({ sx, sy, x0: 0, x1: 150000, y0: 0, y1: 520, xt: [[0, '0'], [50000, '50k'], [100000, '100k'], [150000, '150k']], yt: [0, 100, 200, 300, 400, 500], xl: 'environment steps', yl: 'episodic return', grid: true });
  S.forEach((c, i) => { o += polyline(xs, c, sx, sy, i < 5 ? 'ln-dash' : 'dash'); });
  const mean = (a, b) => xs.map((_, j) => S.slice(a, b).reduce((s, c) => s + c[j], 0) / (b - a));
  o += polyline(xs, mean(0, 5), sx, sy, 'ln') + polyline(xs, mean(5, 10), sx, sy, 'ink-b');
  o += text(410, sy(mean(0, 5)[n - 1]) + 4, 'seed 0–4 的平均', 'tl') + text(410, sy(mean(5, 10)[n - 1]) + 14, 'seed 5–9 的平均', 'tb');
  o += text(70, 16, '同一份代码、同一组 hyperparameter，只换 seed', 'tb');
  o += text(70, 284, '细线是每个 seed（最近 20 个 episode 的平均），粗线是每组 5 个 seed 的平均。', 'ts');
  return svg(560, 294, o, '同一份 PPO 代码在 CartPole 上跑 10 个 seed，按 seed 分成两组，两组平均的 learning curve 看起来像两个不同的 algorithm');
}

export default {
  'mrl-gae': gae,
  'mrl-clip': clip,
  'mrl-epochs': epochs,
  'mrl-batch': batch,
  'mrl-teacher': teacher,
  'mrl-dr': dr,
  'mrl-shaping': shaping,
  'mrl-trunc': trunc,
  'mrl-offline': offline,
  'mrl-mixed': mixed,
  'mrl-passk': passk,
  'mrl-seeds': seeds,
};
