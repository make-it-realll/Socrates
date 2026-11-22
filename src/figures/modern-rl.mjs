import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, svgA, anim, ashow } from '../lib/svg.mjs';

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

// 第 2 站：history-based policy 配 state critic。S 出发，直接去岔口 F，或绕到 P 看告示再去 F；
// F 两端一边 +1 一边 −1（随机）。q = 绕路的 probability，critic 用 TD(0) 学到的 value。
function asym() {
  const g = 0.9, q = 0.5;
  // state critic：F 处把两种 robot 平均；P 的 TD target 是 γV(F)
  const sF = q * 1 + (1 - q) * 0, sP = g * sF;
  // history-state critic：F 处按有没有看过告示分开
  const hFv = 1, hFn = 0, hP = g * hFv;
  const diffS = g * sP - g * sF, diffH = g * hP - g * hFn;
  const fmt = (x) => String(Number(x.toFixed(3))).replace('-', '−');
  let o = '';
  const panel = (x0, title, labP, labF, diff) => {
    const S = [x0 + 28, 150], P = [x0 + 100, 82], F = [x0 + 168, 150], L = [x0 + 236, 110], R = [x0 + 236, 190];
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    o += arrow(S[0] + 16, S[1], F[0] - 18, F[1], 'ink');
    o += arrow(S[0] + 12, S[1] - 12, P[0] - 13, P[1] + 11, 'ln') + arrow(P[0] + 13, P[1] + 11, F[0] - 12, F[1] - 12, 'ln');
    o += arrow(F[0] + 15, F[1] - 8, L[0] - 22, L[1] + 4, 'mute') + arrow(F[0] + 15, F[1] + 8, R[0] - 22, R[1] - 4, 'mute');
    o += circle(S[0], S[1], 16, 'paper') + text(S[0], S[1] + 5, 'S', 'tb', 'middle');
    o += circle(P[0], P[1], 16, 'wash') + text(P[0], P[1] + 5, 'P', 'tb', 'middle');
    o += circle(F[0], F[1], 16, 'paper') + text(F[0], F[1] + 5, 'F', 'tb', 'middle');
    o += rect(L[0] - 20, L[1] - 13, 40, 26, 'wash2', 4) + text(L[0], L[1] + 5, '±1', 'ts', 'middle');
    o += rect(R[0] - 20, R[1] - 13, 40, 26, 'wash2', 4) + text(R[0], R[1] + 5, '∓1', 'ts', 'middle');
    o += text(S[0] + 50, S[1] - 6, 'direct', 'ts', 'middle') + text(x0 + 46, 104, '绕路', 'tl', 'middle');
    o += text(P[0], P[1] - 34, '看告示', 'ts', 'middle') + text(P[0], P[1] - 20, labP, 'tl', 'middle');
    labF.forEach((s2, i) => { o += text(F[0] + 12, F[1] + 32 + i * 16, s2, labF.length === 1 ? 'tl' : 't', 'end'); });
    o += text(x0 + 130, 234, 'δ(绕路) − δ(direct) = ' + fmt(diff), diff < 0 ? 'tl' : 'tb', 'middle');
  };
  panel(10, '只看 state 的 critic', 'V(P) = ' + fmt(sP), ['V(F) = ' + fmt(sF)], diffS);
  panel(290, '看 history 和 state 的 critic', 'V(P) = ' + fmt(hP), ['看过告示：V(F) = ' + fmt(hFv), '没看过：V(F) = ' + fmt(hFn)], diffH);
  o += line(280, 34, 280, 244, 'grid');
  o += text(280, 264, `q = ${q}，γ = ${g}；真实的 Q(S, 绕路) − Q(S, direct) = ${fmt(g * g)}。F 两端哪边是 +1 每个 episode 随机。`, 'ts', 'middle');
  return svg(560, 276, o, '同一个设定下两种 critic 学到的 value：只看 state 的 critic 在岔口 F 只有一个平均值 0.5，算出绕路的 TD error 比直接走小 0.045；同时看 history 的 critic 在 F 分出看过告示的 1 和没看过的 0，绕路的好处 0.81 留在 TD error 里');
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

// ---------- 第 1 站：λ 实验用的 21-state random walk ----------
function walk() {
  const N = 21, p = 0.6, g = 0.98;
  // DP：两端是 terminal，进入右端得 1
  let V = new Array(N).fill(0);
  for (let it2 = 0; it2 < 5000; it2++) {
    const W = V.slice();
    for (let s2 = 1; s2 < N - 1; s2++) W[s2] = p * ((s2 + 1 === N - 1 ? 1 : 0) + g * V[s2 + 1]) + (1 - p) * g * V[s2 - 1];
    V = W;
  }
  const sx = (i) => 56 + i * 23.5, y = 70;
  let o = '';
  for (let i = 0; i < N; i++) {
    const term = i === 0 || i === N - 1;
    o += term ? rect(sx(i) - 9, y - 9, 18, 18, 'wash2', 2) : circle(sx(i), y, 8, i === 10 ? 'solid' : 'paper');
  }
  o += text(sx(10), y - 18, 'start', 'tl', 'middle');
  o += arrow(sx(10) + 10, y + 22, sx(11) + 2, y + 22, 'ln') + text(sx(11) + 6, y + 27, '0.6', 'ts');
  o += arrow(sx(10) - 10, y + 22, sx(9) - 2, y + 22, 'mute') + text(sx(9) - 6, y + 27, '0.4', 'ts', 'end');
  o += text(sx(N - 1), y - 18, 'r = +1', 'tl', 'middle') + text(sx(0), y - 18, 'r = 0', 'ts', 'middle');
  o += text(sx(0), y + 30, 'end', 'ts', 'middle') + text(sx(N - 1), y + 30, 'end', 'ts', 'middle');
  // true V（DP）
  const sy = lin(0, 1, 230, 130);
  o += line(sx(0) - 10, sy(0), sx(N - 1) + 10, sy(0), 'axis');
  for (const v of [0, 0.5, 1]) o += line(sx(0) - 14, sy(v), sx(0) - 10, sy(v), 'axis') + text(sx(0) - 16, sy(v) + 4, String(v), 'ts', 'end');
  for (let i = 1; i < N - 1; i++) o += rect(sx(i) - 7, sy(V[i]), 14, sy(0) - sy(V[i]), i === 10 ? 'solid' : 'wash-strong');
  o += text(sx(10), sy(V[10]) - 8, V[10].toFixed(3), 'tl', 'middle');
  o += text(sx(1), 124, '真实的 V(s)（γ = 0.98，dynamic programming）；critic = V + 固定的 N(0, 0.1) error', 'ts');
  return svg(560, 246, o, '21 个 state 排成一条线的 random walk：从中间出发，向右的 probability 0.6，走到右端 reward 1，两端都结束；下方是用 dynamic programming 算出的真实 value');
}

// ---------- 第 2 站：24 步一段时，段末 bootstrap 在每个位置的 coefficient ----------
function segCoef() {
  const g = 0.99, lam = 0.95, T = 24;
  const c = (t) => g * (g * lam) ** (T - 1 - t);
  const avg = Array.from({ length: T }, (_, t) => c(t)).reduce((a, b) => a + b, 0) / T;
  const sx = lin(-0.5, 23.5, 60, 520), sy = lin(0, 1, 210, 40);
  let o = axes({ sx, sy, x0: -0.5, x1: 23.5, y0: 0, y1: 1, xt: [0, 5, 10, 15, 20, 23], yt: [0, 0.5, 1], xl: 't（这一段里的第几步）', yl: 'V(s₂₄) 在 Â_t 里的 coefficient' });
  for (let t = 0; t < T; t++) o += rect(sx(t) - 7, sy(c(t)), 14, sy(0) - sy(c(t)), 'wash-strong');
  o += line(sx(-0.5), sy(avg), sx(23.5), sy(avg), 'dash') + text(sx(1), sy(avg) - 6, '24 个位置平均 ' + avg.toFixed(2), 'ts');
  o += text(sx(0) - 6, sy(c(0)) - 10, c(0).toFixed(2), 'tl') + text(sx(23), sy(c(23)) - 6, c(23).toFixed(2), 'tl', 'middle');
  o += text(290, 262, 'γ(γλ)^(23 − t)，γλ = 0.99 × 0.95 = 0.9405', 'ts', 'middle');
  return svg(560, 272, o, '一段 24 步的 trajectory 里，段末 critic value 在每一步 advantage 中的 coefficient：第 0 步是 0.24，第 23 步是 0.99，平均 0.53');
}

// ---------- 第 6 站：DPPO 的两层 MDP ----------
function dppo() {
  let o = '';
  const sY = 50;
  const xs = [40, 290, 520];
  o += circle(xs[0], sY, 18, 'paper') + text(xs[0], sY + 5, 's_t', 'tb', 'middle');
  o += circle(xs[2], sY, 18, 'paper') + text(xs[2], sY + 5, 's_t+1', 'tb', 'middle');
  o += arrow(58, sY, 502, sY, 'ink') + text(290, sY - 10, 'environment 执行 a_t = a⁰，拿到 reward', 'ts', 'middle');
  // 内层：denoising chain
  const ks = ['a^K', 'a^K−1', '…', 'a¹', 'a⁰'];
  const kx = (i) => 90 + i * 95, ky = 116;
  o += rect(60, 100, 440, 100, 'wash', 8) + text(150, 186, '内层：K 步 denoising，每一步都是一次 Gaussian 的 “action”', 'tl');
  ks.forEach((s2, i) => {
    if (s2 === '…') { o += text(kx(i), ky + 18, '…', 'tb', 'middle'); return; }
    o += rect(kx(i) - 28, ky, 56, 28, i === ks.length - 1 ? 'solid' : 'paper', 5) + text(kx(i), ky + 19, s2, i === ks.length - 1 ? 'tw' : 't', 'middle');
    if (i < ks.length - 1) o += arrow(kx(i) + 29, ky + 14, kx(i + 1) - (ks[i + 1] === '…' ? 14 : 30), ky + 14, 'ink');
    if (ks[i - 1] === '…') o += arrow(kx(i - 1) + 14, ky + 14, kx(i) - 30, ky + 14, 'ink');
  });
  o += line(xs[0], sY + 18, 90, ky, 'mute') + line(kx(4), ky, 510, sY + 16, 'mute');
  o += text(kx(0), ky + 46, '~ N(0, I)', 'ts', 'middle');
  o += text(60, 222, 'a^(k−1) ~ N(μ_θ(a^k, k, s_t), σ_k² I)：每步的 log-probability 有 closed form', 't');
  o += text(60, 242, 'log π_θ(整条链 | s_t) = 各步之和；advantage 只看外层的 environment', 't');
  return svg(560, 256, o, 'DPPO 把 environment 的 MDP 和 denoising 的 MDP 叠成两层：外层每一步执行一个 action，内层从 Gaussian noise 经过 K 步 Gaussian denoising 得到这个 action');
}

// ---------- 第 6 站：RECAP 的 advantage conditioning ----------
function recap() {
  const pi = [0.5, 0.3, 0.2], A = [0, -0.2, 0.3], sd = 0.3;
  const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
  const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
  const P = A.map((a) => Phi(a / sd));
  const norm = (v) => { const z = v.reduce((a, b) => a + b, 0); return v.map((x) => x / z); };
  const c1 = norm(pi.map((x, i) => x * P[i])), c3 = norm(pi.map((x, i) => x * P[i] ** 3));
  const meanA = (q) => q.reduce((a, x, i) => a + x * A[i], 0);
  const groups = [['data 里的 policy', pi, 'wash2'], ['conditioned on I = 1', c1, 'wash-strong'], ['P(I=1|a) 取 3 次方', c3, 'solid']];
  const sy = lin(0, 0.7, 200, 40), gx = (k) => 70 + k * 160;
  let o = line(50, sy(0), 540, sy(0), 'axis');
  groups.forEach(([lab, q, cls], k) => {
    q.forEach((v, i) => {
      const x = gx(k) + i * 40;
      o += rect(x, sy(v), 30, sy(0) - sy(v), cls) + text(x + 15, sy(v) - 5, v.toFixed(3), 'ts', 'middle') + text(x + 15, sy(0) + 15, 'a' + (i + 1), 'ts', 'middle');
    });
    o += text(gx(k) + 55, sy(0) + 34, lab, 'tb', 'middle') + text(gx(k) + 55, sy(0) + 50, '平均 advantage ' + meanA(q).toFixed(3), 'ts', 'middle');
  });
  o += text(50, 24, `真实 advantage A = (0, −0.2, 0.3)；Â = A + N(0, 0.3²)；P(I=1 | a) = Φ(A/0.3) = (${P.map((x) => x.toFixed(3)).join(', ')})`, 'ts');
  return svg(560, 262, o, '三个 action 的例子：data 里的 policy 是 0.5、0.3、0.2，按 P(I=1|a) 重新加权后变成 0.506、0.153、0.341，取三次方后变成 0.335、0.026、0.639，平均 advantage 依次升高');
}

// ---------- 第 7 站：(B,1) 减 (B,) 被 broadcast 成 (B,B) ----------
function bcast() {
  const B = 4, c = 44, x0 = 200, y0 = 64;
  let o = text(30, 28, 'q.shape = (B, 1)', 'tb') + text(200, 28, 'y.shape = (B,)', 'tb') + text(390, 28, '(q − y).shape = (B, B)', 'tl');
  for (let i = 0; i < B; i++) o += rect(60, y0 + i * c, 50, c, 'paper') + text(85, y0 + i * c + 27, 'q' + (i + 1), 't', 'middle');
  for (let j = 0; j < B; j++) o += rect(x0 + j * c, 38, c, 22, 'wash2') + text(x0 + j * c + c / 2, 54, 'y' + (j + 1), 'ts', 'middle');
  for (let i = 0; i < B; i++) for (let j = 0; j < B; j++) {
    o += rect(x0 + j * c, y0 + i * c, c, c, i === j ? 'wash-strong' : 'paper');
    o += text(x0 + j * c + c / 2, y0 + i * c + 27, `q${i + 1}−y${j + 1}`, 'ts', 'middle');
  }
  o += arrow(112, y0 + 2 * c, 196, y0 + 2 * c, 'mute') + text(154, y0 + 2 * c - 8, 'broadcast', 'ts', 'middle');
  o += text(390, 90, '想要的只有对角线：', 't') + text(390, 108, 'q_i − y_i', 'ts');
  o += text(390, 144, '.mean() 平均了全部 B² 个，', 't') + text(390, 162, '每个 q_i 的最优解都是', 't') + text(390, 180, 'mean(y)，与 state 无关', 'tl');
  o += text(30, 260, 'Loss 照样是一个数、照样下降：critic 退化成常数 baseline，explained variance ≈ 0', 'ts');
  return svg(560, 272, o, 'Shape 为 B 乘 1 的 critic 输出减去 shape 为 B 的 target，被 broadcast 成 B 乘 B 的 matrix，只有对角线是想要的差');
}


// ---------- 动图共用：按帧切换 ----------
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [0];
  let acc = 0;
  for (let i = 0; i < durs.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  kt.push(1);
  const show = (on) => ashow([...on, on[on.length - 1]], kt, T);
  const vals = (v) => [...v, v[v.length - 1]];
  return { T, kt, show, vals };
}
const gshow = (inner, F, on) => `<g>${inner}${F.show(on)}</g>`;

// 第 7 站 + 开头第一件：同样 10 个 seed，换一种分组，两条平均曲线就换一个样子
function seedsA() {
  const S = SEEDS_ALL;
  const n = S[0].length, xs = Array.from({ length: n }, (_, i) => 2048 + i * 3072);
  const sx = lin(0, 150000, 70, 400), sy = lin(0, 520, 230, 40);
  let s = 12345;
  const u = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const splits = [[0, 1, 2, 3, 4]];
  while (splits.length < 8) { const idx = [...Array(10).keys()].sort(() => u() - 0.5).slice(0, 5).sort((a, b) => a - b); if (!splits.some((q) => q.join() === idx.join())) splits.push(idx); }
  const F = frames(splits.map((_, i) => (i === 0 ? 3.4 : 2)));
  let o = axes({ sx, sy, x0: 0, x1: 150000, y0: 0, y1: 520, xt: [[0, '0'], [50000, '50k'], [100000, '100k'], [150000, '150k']], yt: [0, 100, 200, 300, 400, 500], xl: 'environment steps', yl: 'episodic return', grid: true });
  const mean = (ids) => xs.map((_, j) => ids.reduce((t, i) => t + S[i][j], 0) / ids.length);
  S.forEach((c, i) => {
    o += gshow(polyline(xs, c, sx, sy, 'ln-dash'), F, splits.map((q) => q.includes(i)));
    o += gshow(polyline(xs, c, sx, sy, 'dash'), F, splits.map((q) => !q.includes(i)));
  });
  splits.forEach((A, k) => {
    const B = [...Array(10).keys()].filter((i) => !A.includes(i));
    const mA = mean(A), mB = mean(B);
    let yA = sy(mA[n - 1]) + 4, yB = sy(mB[n - 1]) + 4;
    if (Math.abs(yA - yB) < 34) { const mid = (yA + yB) / 2; if (yA < yB) { yA = mid - 17; yB = mid + 17; } else { yA = mid + 17; yB = mid - 17; } }
    let g = polyline(xs, mA, sx, sy, 'ln') + polyline(xs, mB, sx, sy, 'ink-b');
    g += text(410, yA, '组 A 平均 ' + Math.round(mA[n - 1]), 'tl') + text(410, yA + 15, 'seed ' + A.join(','), 'ts');
    g += text(410, yB, '组 B 平均 ' + Math.round(mB[n - 1]), 'tb') + text(410, yB + 15, 'seed ' + B.join(','), 'ts');
    g += text(70, 284, `第 ${k + 1} 种分法：最后一点两组差 ${Math.round(Math.abs(mA[n - 1] - mB[n - 1]))}`, k === 0 ? 'tl' : 't');
    o += gshow(g, F, splits.map((_, j) => j === k));
  });
  o += text(70, 16, '同一份代码、同一组 hyperparameter，只换 seed；10 个 seed 随机分成两组', 'tb');
  return svgA(560, 294, o, '动图：同一份 PPO 代码在 CartPole 上跑 10 个 seed，每一帧换一种分成两组的方法，两组平均的 learning curve 每次都差得像两个不同的 algorithm');
}

// 开头第三件 + 第 3 站：truncation 被当成 termination，critic 学到一半
function truncA() {
  const g = 0.99, T = 100, lr = 0.01, E = 600;
  const Vb = [0], Vo = [0];
  { let vb = 0, vo = 0; for (let e = 1; e <= E; e++) { for (let t = 0; t < T; t++) { vo += lr * (1 + g * vo - vo); vb += lr * ((t === T - 1 ? 1 : 1 + g * vb) - vb); } Vb.push(vb); Vo.push(vo); } }
  let o = '';
  // 上：一个 episode 的 100 步
  const x0 = 30, x1 = 530, sxs = lin(0, T, x0, x1), Y = 54;
  o += text(x0, 18, '一个 episode：一个 state，每步 stay 拿 +1，第 100 步时间到了被 reset', 'tb', 'start');
  for (let t = 0; t < T; t++) o += rect(sxs(t) + 0.6, Y - 9, sxs(1) - sxs(0) - 1.2, 18, t === T - 1 ? 'solid' : 'wash', 1);
  for (const t of [0, 25, 50, 75, 99]) o += text(sxs(t + 0.5), Y + 24, String(t + 1), 'ts', 'middle');
  // 走动的 robot：一个 episode 4 秒
  o += `<circle cx="${sxs(0.5).toFixed(1)}" cy="${Y - 18}" r="5" class="ink-f">${anim('cx', [sxs(0.5), sxs(99.5), sxs(99.5)].map((v) => v.toFixed(1)), [0, 0.9, 1], 4)}</circle>`;
  o += text(sxs(48), Y + 44, '第 1–99 步：target = 1 + γV(s′)', 'ts', 'middle');
  o += text(x1, Y + 44, '第 100 步：bug 写成 target = 1', 'tl', 'end') + text(x1, Y + 60, '正确：仍是 1 + γV(s′)', 'tb', 'end');
  // 下：两个 critic 的 V，随 episode 学
  const by = lin(0, 110, 262, 128), hold = 3, ep = 0.02, Tt = hold + 0.3 + E * ep + 2;
  const samp = []; for (let e = 0; e <= E; e += 10) samp.push(e);
  const kt = [0, hold / Tt, ...samp.map((e) => (hold + 0.3 + e * ep) / Tt), 1];
  const vals = (V) => [V[E], V[E], ...samp.map((e) => V[e]), V[E]];
  o += line(70, by(0), 330, by(0), 'axis');
  for (const v of [0, 50, 100]) o += text(64, by(v) + 4, String(v), 'ts', 'end') + line(66, by(v), 70, by(v), 'axis');
  o += line(70, by(100), 330, by(100), 'grid') + line(70, by(60), 330, by(60), 'ln-dash') + text(334, by(60) + 4, 'jump 的 reward 60', 'ts', 'start');
  o += text(334, by(100) + 4, '真实 value 100', 'ts', 'start');
  const bar = (x, V, cls) => { const hs = vals(V).map((v) => (by(0) - by(v)).toFixed(1)), ys = vals(V).map((v) => by(v).toFixed(1)); return `<rect x="${x}" y="${ys[0]}" width="60" height="${hs[0]}" class="${cls}">${anim('y', ys, kt, Tt)}${anim('height', hs, kt, Tt)}</rect>`; };
  o += bar(110, Vb, 'solid') + bar(230, Vo, 'wash-strong');
  o += text(140, by(0) + 18, '有 bug 的 critic', 'tl', 'middle') + text(260, by(0) + 18, '正确的 critic', 'tb', 'middle');
  // 读数：每 50 个 episode 换一次
  const marks = []; for (let e = 0; e <= E; e += 10) marks.push(e);
  const mkt = [0, hold / Tt, ...marks.map((e) => (hold + 0.3 + e * ep) / Tt), 1];
  marks.forEach((m, i) => {
    const on = [m === E, false, ...marks.map((_, j) => j === i), m === E];
    o += `<text x="500" y="${by(84)}" class="t" text-anchor="middle">episode ${m}${anim('opacity', on.map((v) => (v ? 1 : 0)), mkt, Tt, true)}</text>`;
    o += `<text x="500" y="${by(84) + 20}" class="tl" text-anchor="middle">bug：V = ${Vb[m].toFixed(1)}${anim('opacity', on.map((v) => (v ? 1 : 0)), mkt, Tt, true)}</text>`;
    o += `<text x="500" y="${by(84) + 38}" class="tb" text-anchor="middle">正确：V = ${Vo[m].toFixed(1)}${anim('opacity', on.map((v) => (v ? 1 : 0)), mkt, Tt, true)}</text>`;
  });
  o += text(280, 296, 'TD(0)，learning rate 0.01。Bug 版停在一半，低于 jump 的 60：jump 看起来比一直 stay 更好', 'ts', 'middle');
  return svgA(560, 304, o, '动图：一个 episode 100 步，最后一步因时间到被 reset；把它当成终点的 critic 用 TD 学到的 value 停在 50 左右，正确的 critic 涨到 100，jump 的 reward 60 夹在两者之间');
}

// 第 2 站 + 开头第二件：一轮 PPO：4096 个 robot 一起走 24 步，再做 20 个 gradient step
function batchA() {
  const tick = 0.22, hold = 2.6;
  // 时间线：0 停在“全部收集完 + 20 步都做完”的样子；然后清空，8 列一列一列填（每列代表 3 步），batch 亮起，20 个 gradient step 一个个亮，回到收集
  const tFill = hold + 0.4, tBatch = tFill + 8 * tick * 1.5, tUpd = tBatch + 0.8, tBack = tUpd + 20 * tick, Tt = tBack + 1.4;
  const on = (tOn, tOff = null) => { const kt = [0, hold / Tt, tOn / Tt], v = [1, 0, 1]; if (tOff !== null) { kt.push(tOff / Tt); v.push(0); } kt.push(1); v.push(v[v.length - 1]); return anim('opacity', v, kt, Tt, true); };
  const only = (t0, t1) => { const kt = [0, t0 / Tt, t1 / Tt, 1]; return anim('opacity', [0, 1, 0, 0], kt, Tt, true); };
  let o = '';
  const gx = 62, gy = 50;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 8; j++) o += rect(gx + j * 13, gy + i * 11, 11, 9, 'frame');
  for (let j = 0; j < 8; j++) {
    let cells = ''; for (let i = 0; i < 12; i++) cells += rect(gx + j * 13, gy + i * 11, 11, 9, 'wash-strong');
    o += `<g>${cells}${on(tFill + (j + 1) * tick * 1.5)}</g>`;
  }
  o += text(gx + 52, gy - 10, '24 步 →', 'ts', 'middle') + text(gx - 8, gy + 66, '4096', 'ts', 'end') + text(gx - 8, gy + 82, '个', 'ts', 'end');
  o += text(gx + 52, gy + 150, '每行一个 robot', 'ts', 'middle') + text(gx + 52, gy + 166, '一轮 0.48 s 的经验', 'ts', 'middle');
  o += arrow(172, 115, 206, 115, 'ink');
  o += rect(210, 85, 120, 60, 'paper', 6) + `<g>${rect(210, 85, 120, 60, 'ln', 6)}${only(tBatch, tUpd)}</g>` + text(270, 110, 'batch', 'tb', 'middle') + text(270, 128, '98,304 个 sample', 'ts', 'middle');
  o += arrow(332, 115, 358, 115, 'ink');
  o += rect(362, 64, 175, 120, 'paper', 6) + text(450, 86, 'PPO update', 'tb', 'middle') + text(450, 106, '5 epochs × 4 minibatches', 'ts', 'middle') + text(450, 124, '= 20 个 gradient step', 'ts', 'middle') + text(450, 142, '每个 minibatch 24,576', 'ts', 'middle');
  for (let k = 0; k < 20; k++) {
    const x = 378 + k * 7.4 + Math.floor(k / 4) * 1.6, y = 158;
    o += rect(x, y, 5.4, 12, 'frame', 1) + `<g>${rect(x, y, 5.4, 12, 'solid', 1)}${on(tUpd + (k + 1) * tick)}</g>`;
  }
  o += path(d([[450, 186], [450, 214], [270, 214], [270, 148]]), 'mute');
  o += poly([[270, 147], [266, 155], [274, 155]], 'mute-f');
  o += `<g>${path(d([[450, 186], [450, 214], [270, 214], [270, 150]]), 'ln')}${only(tBack, Tt)}</g>`;
  o += text(360, 208, '新 policy 再去收集', 'ts', 'middle');
  // 状态说明
  const st = (s, a, b) => `<text x="280" y="20" class="tl" text-anchor="middle">${s}${only(a, b)}</text>`;
  o += `<text x="280" y="20" class="tl" text-anchor="middle">一轮：收集 98,304 个 sample，只做 20 个 gradient step${anim('opacity', [1, 0, 0], [0, hold / Tt, 1], Tt, true)}</text>`;
  o += st('收集：4096 个 robot 同时走一步，一共 24 步', hold, tBatch) + st('合成一个 batch', tBatch, tUpd) + st('PPO update：一个个 gradient step', tUpd, tBack) + st('用新 policy 开始下一轮', tBack, Tt);
  o += text(20, 246, '1500 轮 × 98,304 ≈ 1.47 亿个 sample，20 分钟内跑完：约 12 万个 sample / 秒。', 't');
  o += text(20, 266, '每个 sample 分到 20 / 98,304 ≈ 0.0002 个 gradient step；', 't');
  o += text(20, 286, 'UTD = 1 的 off-policy 方法每个 sample 要 1 个，是它的 5000 倍。', 't');
  return svgA(560, 296, o, '动图：大规模并行 PPO 的一轮：4096 个 robot 同时一步步走满 24 步，得到约十万个 sample，合成一个 batch，再一个个做 5 个 epoch、每个 4 个 minibatch 共 20 个 gradient step，然后回去收集');
}

export default {
  'mrl-tdtrunc': truncA,
  'mrl-gae': gae,
  'mrl-clip': clip,
  'mrl-epochs': epochs,
  'mrl-batch': batchA,
  'mrl-asym': asym,
  'mrl-teacher': teacher,
  'mrl-dr': dr,
  'mrl-shaping': shaping,
  'mrl-trunc': trunc,
  'mrl-offline': offline,
  'mrl-mixed': mixed,
  'mrl-passk': passk,
  'mrl-seeds': seedsA,
  'mrl-walk': walk,
  'mrl-segcoef': segCoef,
  'mrl-dppo': dppo,
  'mrl-recap': recap,
  'mrl-bcast': bcast,
};
