import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

// Experiment 的骨架：sampling → random assignment → 操纵 IV → 测 DV → 比较
function design() {
  let o = '';
  const box = (x, y, w, h, a, b) => rect(x, y, w, h, 'paper', 6) + text(x + w / 2, y + (b ? h / 2 - 2 : h / 2 + 5), a, 'tb', 'middle') + (b ? text(x + w / 2, y + h / 2 + 15, b, 'ts', 'middle') : '');
  o += box(10, 106, 84, 52, 'population');
  o += arrow(96, 132, 150, 132, 'ink') + text(123, 124, 'sampling', 'ts', 'middle');
  o += box(152, 106, 76, 52, 'sample');
  o += line(228, 132, 244, 132, 'ink') + circle(254, 132, 10, 'solid') + text(254, 136.5, 'R', 'tw', 'middle');
  o += arrow(261, 125, 284, 84, 'ink') + arrow(261, 139, 284, 180, 'ink');
  o += text(196, 184, 'random assignment：', 'ts', 'middle') + text(196, 200, '掷硬币决定谁去哪一组', 'ts', 'middle');
  o += text(354, 34, 'IV：manipulated', 'tl', 'middle') + text(496, 34, 'DV：measured', 'tl', 'middle');
  o += box(286, 46, 136, 52, 'treatment group', 'e.g. high-power pose');
  o += box(286, 166, 136, 52, 'control group', 'e.g. low-power pose');
  o += arrow(424, 72, 442, 72, 'ink') + arrow(424, 192, 442, 192, 'ink');
  o += box(444, 46, 104, 52, 'measure', 'e.g. cortisol');
  o += box(444, 166, 104, 52, 'measure', 'same test');
  o += line(496, 100, 496, 164, 'ln') + rect(458, 121, 76, 22, 'paper', 4) + text(496, 136.5, 'compare', 'tl', 'middle');
  o += text(280, 248, 'Random assignment 让两组在其余所有 variable 上只差随机波动，', 'ts', 'middle');
  o += text(280, 265, '所以 DV 上超出随机波动的差别只能归给 IV。', 'ts', 'middle');
  return svg(560, 278, o, 'Experiment 的流程：从 population 取 sample，random assignment 分成 treatment group 和 control group，两组只在 independent variable 上不同，然后用同一个 dependent variable 测量并比较');
}

// 一个 correlation，三种 causal structure
function third() {
  let o = '';
  const node = (x, y, s, cls = 'paper') => rect(x - 20, y - 14, 40, 28, cls, 6) + text(x, y + 5, s, 'tb', 'middle');
  const panel = (x0, title, note, kind) => {
    o += rect(x0, 36, 170, 138, 'frame') + text(x0 + 85, 24, title, 'tb', 'middle');
    const X = [x0 + 40, 136], Y = [x0 + 130, 136], Z = [x0 + 85, 66];
    if (kind === 1) o += arrow(X[0] + 22, X[1], Y[0] - 22, Y[1], 'ln');
    if (kind === 2) o += arrow(Y[0] - 22, Y[1], X[0] + 22, X[1], 'ln');
    if (kind === 3) {
      o += arrow(Z[0] - 12, Z[1] + 16, X[0] + 8, X[1] - 16, 'ln') + arrow(Z[0] + 12, Z[1] + 16, Y[0] - 8, Y[1] - 16, 'ln');
      o += line(X[0] + 22, X[1], Y[0] - 22, Y[1], 'dash') + node(Z[0], Z[1], 'Z', 'wash ink-s');
    }
    o += node(X[0], X[1], 'X') + node(Y[0], Y[1], 'Y');
    o += text(x0 + 85, 192, note, 'ts', 'middle');
  };
  panel(14, 'X causes Y', '药让人活得久', 1);
  panel(195, 'Y causes X', '身体好的人才坚持吃药', 2);
  panel(376, 'Z causes both', 'X 与 Y 之间没有箭头', 3);
  o += text(280, 220, 'X = 按时吃药（adherence ≥ 80%）　Y = 5 年内活着　Z = 例如整体上更在意自己的健康', 'ts', 'middle');
  o += text(280, 238, '三种结构给出同样的 correlation。Placebo 组里也出现同样的差别，排除了第一种。', 'ts', 'middle');
  return svg(560, 250, o, '同一个 correlation 背后的三种 causal structure：X 导致 Y，Y 导致 X，或者第三个 variable Z 同时导致 X 和 Y');
}

// Neuron 与 synapse 的示意
function neuron() {
  let o = '';
  const dend = [
    [[92, 68], [60, 50], [36, 46]], [[60, 50], [52, 28]],
    [[88, 80], [52, 84], [30, 76]], [[52, 84], [34, 100]],
    [[94, 94], [66, 116], [44, 122]], [[66, 116], [62, 138]],
    [[108, 58], [104, 30], [90, 16]], [[104, 30], [118, 14]],
  ];
  for (const p of dend) o += path(d(p), 'ink');
  o += line(132, 80, 430, 80, 'ink-b');
  for (const x of [160, 224, 288, 352]) o += rect(x, 72, 54, 16, 'paper', 8);
  for (const [x, y] of [[470, 56], [474, 80], [470, 104]]) o += line(430, 80, x, y, 'ink') + circle(x, y, 5, 'ln-f');
  o += circle(110, 80, 22, 'wash ink-s');
  o += circle(526, 80, 18, 'wash2 ink-s') + text(552, 46, '下一个 neuron', 'ts', 'end');
  o += arrow(170, 54, 410, 54, 'ln') + text(290, 42, 'action potential：all-or-none，只朝这一头走', 'tl', 'middle');
  o += text(62, 158, 'dendrites：input', 'ts', 'middle') + text(138, 110, 'cell body', 'ts');
  o += text(300, 108, 'axon，外面包着 myelin sheath', 'ts', 'middle') + text(418, 126, 'axon terminals', 'ts', 'end');
  // 放大的 synapse
  o += line(462, 114, 362, 168, 'dash') + line(482, 114, 518, 168, 'dash');
  o += rect(362, 168, 156, 150, 'frame');
  o += path('M400 168L400 196Q400 232 440 232Q480 232 480 196L480 168', 'wash ink-s');
  for (const [x, y] of [[422, 190], [458, 190], [440, 212]]) o += circle(x, y, 7.5, 'paper') + circle(x - 2.5, y - 1, 1.8, 'ln-f') + circle(x + 2.5, y + 1.5, 1.8, 'ln-f');
  for (const [x, y] of [[420, 240], [432, 249], [444, 240], [456, 250], [466, 242], [440, 255]]) o += circle(x, y, 2.3, 'ln-f');
  o += rect(384, 262, 112, 44, 'wash2') + line(384, 262, 496, 262, 'ink');
  for (const x of [408, 434, 460]) o += rect(x, 256, 12, 10, 'paper', 2);
  o += text(440, 292, 'postsynaptic neuron', 'ts', 'middle');
  const lab = (y, s, tx, ty) => { o += text(336, y + 4, s, 'ts', 'end') + line(340, y, tx, ty, 'mute'); };
  lab(180, 'presynaptic terminal', 398, 180);
  lab(206, 'vesicle', 431, 210);
  lab(244, 'synaptic cleft', 414, 244);
  lab(274, 'receptor', 406, 263);
  o += text(20, 202, '1　Action potential 到达 terminal', 'ts') + text(20, 222, '2　Vesicle 放出 neurotransmitter', 'ts');
  o += text(20, 242, '3　它与 receptor 结合，让下一个', 'ts') + text(20, 258, '　　neuron 更容易或更难 fire', 'ts');
  o += text(20, 282, '4　Neurotransmitter 被分解', 'ts') + text(20, 298, '　　或被收回（reuptake）', 'ts');
  return svg(560, 328, o, '一个 neuron 的示意：dendrites 接收 input，cell body 汇总，action potential 沿着包有 myelin sheath 的 axon 传到 axon terminal；下方放大的 synapse 里，vesicle 把 neurotransmitter 放进 synaptic cleft，与下一个 neuron 的 receptor 结合');
}

// Classical conditioning 的三个阶段：CS、US、response 随时间的变化
function cc() {
  let o = '';
  const yC = 92, yU = 142, yR = 204, h = 22;
  const pulse = (x0, x1, y, a, b, cls = 'ink') => (a == null ? line(x0, y, x1, y, cls) : path(d([[x0, y], [a, y], [a, y - h], [b, y - h], [b, y], [x1, y]]), cls));
  const hump = (x0, x1, a, b, k = 1) => {
    const pts = [[x0, yR]];
    for (let i = 0; i <= 40; i++) { const x = a + ((b - a) * i) / 40; pts.push([x, yR - 28 * k * Math.sin((Math.PI * i) / 40) ** 2]); }
    pts.push([x1, yR]);
    return path(d(pts), 'ln');
  };
  o += text(16, yC - 6, 'CS', 'tb') + text(16, yC + 9, 'metronome', 'ts');
  o += text(16, yU - 6, 'US', 'tb') + text(16, yU + 9, 'food', 'ts');
  o += text(16, yR - 6, 'response', 'tb') + text(16, yR + 9, 'salivation', 'ts');
  o += line(250, 14, 250, 222, 'grid') + line(410, 14, 410, 222, 'grid');
  o += text(170, 24, 'Before', 'tb', 'middle') + text(330, 24, 'During（重复多次）', 'tb', 'middle') + text(482, 24, 'After', 'tb', 'middle');
  o += text(170, 42, 'CS 单独、US 单独', 'ts', 'middle') + text(330, 42, 'CS 先出现，US 紧跟', 'ts', 'middle') + text(482, 42, '只给 CS', 'ts', 'middle');
  // before
  o += pulse(100, 240, yC, 112, 142) + pulse(100, 240, yU, 184, 212) + hump(100, 240, 188, 236);
  o += text(127, yR + 16, '没有反应', 'ts', 'middle') + text(212, yR - 34, 'UR', 'tl', 'middle');
  // during
  o += pulse(262, 400, yC, 280, 350) + pulse(262, 400, yU, 312, 350) + hump(262, 400, 316, 392);
  o += text(354, yR - 34, 'UR', 'tl', 'middle');
  // after
  o += pulse(422, 546, yC, 440, 500) + pulse(422, 546, yU) + hump(422, 546, 448, 532, 0.8);
  o += text(490, yR - 29, 'CR', 'tl', 'middle');
  o += text(280, 244, '横向是时间。Forward pairing：CS 的 onset 在 US 之前，CS 才能成为 US 要来的 signal。', 'ts', 'middle');
  return svg(560, 256, o, 'Classical conditioning 的三个阶段：之前 conditioned stimulus 单独出现没有反应，unconditioned stimulus 引起 unconditioned response；训练时 CS 先于 US 出现；之后 CS 单独出现就引起 conditioned response');
}

// Rescorla–Wagner model 实算：acquisition、extinction 与 blocking
function rw() {
  const ab = 0.3;
  const V = [0];
  for (let i = 1; i <= 10; i++) V.push(V[i - 1] + ab * (1 - V[i - 1]));
  for (let i = 11; i <= 16; i++) V.push(V[i - 1] + ab * (0 - V[i - 1]));
  let VA = V[10], VB = 0;
  for (let i = 0; i < 10; i++) { const e = 1 - (VA + VB); VA += ab * e; VB += ab * e; }
  let CA = 0, CB = 0;
  for (let i = 0; i < 10; i++) { const e = 1 - (CA + CB); CA += ab * e; CB += ab * e; }
  const sx = lin(0, 16, 60, 360), sy = lin(0, 1, 222, 50);
  let o = axes({ sx, sy, x0: 0, x1: 16, y0: 0, y1: 1, xt: [0, 2, 4, 6, 8, 10, 12, 14, 16], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], grid: false });
  o += text(sx(16), 256, 'trial', 'ts', 'end');
  o += line(sx(0), sy(1), sx(16), sy(1), 'grid') + line(sx(10), sy(0), sx(10), sy(1.08), 'dash');
  o += path(d(V.map((v, i) => [sx(i), sy(v)])), 'ln');
  V.forEach((v, i) => { o += circle(sx(i), sy(v), 3, 'ln-f'); });
  o += text(60, 24, 'Tone 的 associative strength V', 'tb');
  o += text(sx(3.4), sy(0.3), 'acquisition：λ = 1', 'tl') + text(sx(12.4), sy(0.66), 'extinction：λ = 0', 'tl');
  o += text(sx(1) + 8, sy(V[1]) + 4, '0.30', 'ts') + text(sx(2) + 8, sy(V[2]) + 4, '0.51', 'ts') + text(sx(10) - 8, sy(V[10]) - 8, '0.97', 'ts', 'end');
  // blocking
  const bx = (x, v, lab, val, cls) => rect(x, sy(v), 40, sy(0) - sy(v), cls) + text(x + 20, sy(v) - 7, val, 'tb', 'middle') + text(x + 20, sy(0) + 17, lab, 'ts', 'middle');
  o += line(420, sy(0), 546, sy(0), 'axis');
  o += bx(434, CB, 'control', CB.toFixed(2), 'wash-strong') + bx(494, Math.max(VB, 0.004), 'blocking', VB.toFixed(3), 'solid');
  o += text(483, 24, 'Light 的 V（最后单测）', 'tb', 'middle');
  o += text(280, 276, '每个 trial 都按 ΔV = 0.3 ×（λ − ΣV）更新。右图：tone 已学满之后再加 light，light 几乎什么也没学到。', 'ts', 'middle');
  return svg(560, 288, o, '按 Rescorla–Wagner model 实算的 curve：前十个 trial associative strength 从 0 升到 0.97，每次的增量越来越小；之后 US 不再出现，它逐次下降。右边两根柱子比较 light 的 associative strength：control group 是 0.5，blocking group 只有 0.014');
}

// Ebbinghaus (1885) 的 forgetting curve：savings 数据与他自己拟合的 formula
function forget() {
  const pts = [[20, 58.2, '20 min'], [64, 44.2, '1 h'], [526, 35.8, '9 h'], [1440, 33.7, '1 d'], [2880, 27.8, '2 d'], [8640, 25.4, '6 d'], [44640, 21.1, '31 d']];
  const f = (t) => (100 * 1.84) / (Math.log10(t) ** 1.25 + 1.84);
  const sx = lin(1.1, 4.78, 70, 530), sy = lin(0, 100, 228, 30);
  let o = '';
  for (const v of [0, 20, 40, 60, 80, 100]) o += line(70, sy(v), 530, sy(v), 'grid') + text(62, sy(v) + 4, v + '%', 'ts', 'end');
  for (const [t, , lab] of pts) o += line(sx(Math.log10(t)), sy(0), sx(Math.log10(t)), sy(0) + 4, 'axis') + text(sx(Math.log10(t)), sy(0) + 18, lab, 'ts', 'middle');
  o += line(70, sy(0), 530, sy(0), 'axis') + line(70, sy(0), 70, sy(100), 'axis');
  const cp = [];
  for (let i = 0; i <= 200; i++) { const L = Math.log10(20) + ((Math.log10(44640) - Math.log10(20)) * i) / 200; cp.push([sx(L), sy(f(10 ** L))]); }
  o += path(d(cp), 'dash');
  for (const [t, v] of pts) o += circle(sx(Math.log10(t)), sy(v), 4.5, 'ln-f') + text(sx(Math.log10(t)) + 7, sy(v) - 9, v.toFixed(1), 'tl');
  o += text(70, 18, 'savings：重新学会时省下的时间占第一次学习时间的比例', 'tb');
  o += text(526, 62, '头 1 小时：100% → 44.2%', 't', 'end') + text(526, 82, '之后整整 1 个月：44.2% → 21.1%', 't', 'end');
  o += text(530, 262, '距离学完的时间（log scale）', 'ts', 'end');
  o += text(70, 262, '点：Ebbinghaus 1885 的实测；虚线：他拟合的 formula', 'ts');
  return svg(560, 274, o, 'Ebbinghaus 1885 年的 forgetting curve：savings 在 20 分钟后是 58.2%，1 小时后 44.2%，9 小时后 35.8%，1 天后 33.7%，2 天后 27.8%，6 天后 25.4%，31 天后 21.1%；先陡后平');
}

// Milgram 各个 variation 里走到 450 V 的比例
function milgram() {
  const rows = [
    ['Peer 按开关，自己只念题', 92.5, 0],
    ['Baseline：learner 在隔壁', 65, 1],
    ['搬到 Bridgeport 的办公楼', 47.5, 0],
    ['Learner 在同一个房间', 40, 0],
    ['要亲手把 learner 的手按住', 30, 0],
    ['Experimenter 用电话下指令', 21, 0],
    ['Learner 是朋友或亲属', 15, 0],
    ['两个 peer 中途拒绝', 10, 0],
  ];
  const sx = lin(0, 100, 196, 496);
  let o = text(196, 24, '一直按到最高一档 450 V 的 participant 比例', 'tb');
  for (const v of [0, 25, 50, 75, 100]) o += line(sx(v), 36, sx(v), 250, 'grid') + text(sx(v), 266, v + '%', 'ts', 'middle');
  rows.forEach(([lab, v, base], i) => {
    const y = 42 + i * 26;
    o += rect(sx(0), y, sx(v) - sx(0), 18, base ? 'solid' : 'wash-strong') + text(186, y + 13.5, lab, base ? 'tb' : 't', 'end') + text(sx(v) + 7, y + 13.5, v + '%', base ? 'tl' : 't');
  });
  o += line(sx(0), 36, sx(0), 250, 'axis');
  o += text(280, 290, '数字出自 Milgram (1963, 1974)，按 Wikipedia “Milgram experiment” 条目所列。', 'ts', 'middle');
  return svg(560, 300, o, 'Milgram 各个 variation 里一直按到 450 伏的比例：peer 代按开关时 92.5%，baseline 65%，搬到 Bridgeport 办公楼 47.5%，learner 在同一房间 40%，要亲手按住 learner 的手 30%，experimenter 用电话下指令 21%，learner 是朋友或亲属 15%，两个 peer 拒绝继续时 10%');
}

// 每组 21 人与每组 100 人：observed d 的 sampling distribution（真实 d = 0.2）
function power() {
  let o = '';
  const sx = lin(-1, 1.2, 40, 400);
  const phi = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
  const panel = (base, n, thr, pct, mean) => {
    const se = Math.sqrt(2 / n);
    const sy = lin(0, 1, base, base - 76);
    const f = (x) => phi(x, 0.2, se);
    o += path(area(f, thr, 1.2, sx, sy), 'wash-strong') + path(area(f, -1, -thr, sx, sy), 'wash-strong');
    o += path(curve(f, -1, 1.2, sx, sy), 'ln');
    o += line(sx(-1), base, sx(1.2), base, 'axis');
    for (const v of [-thr, thr]) o += line(sx(v), base, sx(v), base - 84, 'mute');
    o += line(sx(0.2), base, sx(0.2), base - 80, 'dash');
    for (const [v, s] of [[-thr, '−' + thr], [0, '0'], [thr, String(thr)], [1, '1.0']]) o += line(sx(v), base, sx(v), base + 4, 'axis') + text(sx(v), base + 17, s, 'ts', 'middle');
    o += text(sx(0.2), base - 86, 'true d = 0.2', 'ts', 'middle');
    o += text(416, base - 62, '每组 ' + n + ' 人', 'tb');
    o += text(416, base - 42, 'significant：|d| > ' + thr, 'ts');
    o += text(416, base - 22, '比例 ' + pct + '（阴影）', 'tl');
    o += text(416, base - 4, '这些结果的 mean d = ' + mean, 'ts');
  };
  panel(122, 21, 0.62, '9.8%', '0.71');
  panel(262, 100, 0.28, '29%', '0.37');
  o += text(280, 296, '横轴是一次 study 观察到的 d。曲线按 normal 近似画（SE = √(2/n)），', 'ts', 'middle') + text(280, 313, '百分比和 mean 取自正文的 simulation。', 'ts', 'middle');
  return svg(560, 322, o, '真实 effect 为 d 等于 0.2 时，一次 study 观察到的 d 的分布：每组 21 人时分布很宽，只有超过 0.62 的那一小截尾巴才 significant，比例 9.8%，平均报告 0.71；每组 100 人时分布窄得多，门槛 0.28，比例 29%，平均报告 0.37');
}

// Split-brain：两侧 visual field 各送到对侧 hemisphere
function split() {
  let o = '';
  o += rect(150, 30, 260, 56, 'paper', 6);
  o += text(215, 22, 'left visual field', 'ts', 'middle') + text(345, 22, 'right visual field', 'ts', 'middle');
  o += line(280, 34, 280, 82, 'grid') + circle(280, 58, 3, 'ink-f');
  o += text(215, 63, 'KEY', 'tb', 'middle') + text(345, 63, 'RING', 'tb', 'middle');
  o += text(422, 54, '病人盯住中心的点，', 'ts') + text(422, 70, '图像只闪一瞬间', 'ts');
  o += rect(150, 136, 118, 66, 'wash', 30) + rect(292, 136, 118, 66, 'wash', 30);
  o += text(209, 165, 'left', 'tb', 'middle') + text(209, 182, 'hemisphere', 'tb', 'middle');
  o += text(351, 165, 'right', 'tb', 'middle') + text(351, 182, 'hemisphere', 'tb', 'middle');
  o += arrow(215, 90, 330, 132, 'ln') + arrow(345, 90, 230, 132, 'ln');
  o += line(268, 169, 292, 169, 'dash') + line(274, 160, 286, 178, 'ink-b') + line(286, 160, 274, 178, 'ink-b');
  o += text(280, 222, 'corpus callosum 已切断', 'ts', 'middle');
  o += arrow(209, 204, 150, 246, 'ink') + arrow(351, 204, 410, 246, 'ink');
  o += rect(40, 248, 200, 46, 'paper', 6) + text(140, 268, 'speech：', 'tb', 'middle') + text(140, 286, '说看到的是 ring', 't', 'middle');
  o += rect(320, 248, 200, 46, 'paper', 6) + text(420, 268, 'left hand：', 'tb', 'middle') + text(420, 286, '从一堆东西里摸出 key', 't', 'middle');
  o += text(280, 316, '左手由 right hemisphere 控制，开口说话靠 left hemisphere。', 'ts', 'middle') + text(280, 333, '两侧之间没有连接，各自只知道自己看到的那一半。', 'ts', 'middle');
  return svg(560, 344, o, 'Split-brain 实验：左侧 visual field 闪现的 key 只送到 right hemisphere，右侧闪现的 ring 只送到 left hemisphere；corpus callosum 已切断，所以病人开口说看到 ring，左手却摸出 key');
}

// Sperling：whole report 与 partial report
function sperling() {
  let o = '';
  const L = [['R', 'G', 'T', 'F'], ['Q', 'L', 'X', 'B'], ['S', 'N', 'K', 'P']];
  o += text(100, 22, '屏幕闪现几十分之一秒', 'tb', 'middle');
  o += rect(20, 34, 160, 104, 'paper', 6);
  L.forEach((r, i) => r.forEach((c, j) => { o += text(48 + j * 35, 66 + i * 30, c, 'tb', 'middle'); }));
  const tones = ['high tone → 报上一行', 'middle tone → 报中间一行', 'low tone → 报下一行'];
  tones.forEach((s, i) => { o += arrow(184, 61 + i * 30, 206, 61 + i * 30, 'ln') + text(212, 66 + i * 30, s, 'ts'); });
  o += text(212, 22, '字母消失后立刻响一个音（事先不知道是哪个）', 'ts');
  const cells = (y, k, lab, note) => {
    o += text(20, y - 8, lab, 'tb');
    for (let i = 0; i < 12; i++) o += rect(20 + i * 30, y, 26, 22, i < k ? 'solid' : 'wash2', 3);
    o += text(388, y + 16, note, 'tl');
  };
  cells(184, 4, 'Whole report：报告全部字母', '约 4 个');
  cells(246, 9, 'Partial report：任一行报出约 3 个（4 个里）', '¾ × 12 ≈ 9 个');
  o += text(280, 292, '指定哪一行是随机的，所以那一瞬间每一行都有约 ¾ 可用：信息在，只是说不完就消退了。', 'ts', 'middle');
  return svg(560, 302, o, 'Sperling 的实验：12 个字母排成三行四列，闪现后用高、中、低三个音指定报告哪一行。报告全部时只能说出约 4 个；只报指定的一行时能报出 4 个里的约 3 个，推算那一瞬间可用的约有 9 个');
}

// Baillargeon 的 drawbridge：可能事件与不可能事件
function screen() {
  let o = '';
  const L = 72;
  const panel = (x0, title, stop, boxCls, note1, note2) => {
    const px = x0 + 130, py = 170;
    o += text(x0 + 130, 24, title, 'tb', 'middle');
    o += line(x0 + 10, py, x0 + 260, py, 'ink');
    o += rect(px + 30, py - 40, 34, 40, boxCls, 2);
    o += text(px + 47, py + 18, 'box', 'ts', 'middle');
    const tip = (th) => [px - L * Math.cos(th), py - L * Math.sin(th)];
    for (const th of [0, Math.PI / 4, Math.PI / 2]) { const [x, y] = tip(th); o += line(px, py, x, y, 'grid'); }
    const [ex, ey] = tip(stop);
    o += line(px, py, ex, ey, 'ink-b') + circle(px, py, 3, 'ink-f');
    const r = L + 12, pts = [];
    for (let k = 0; k <= 40; k++) { const th = (stop * k) / 40; pts.push([px - r * Math.cos(th), py - r * Math.sin(th)]); }
    o += path(d(pts), 'ln');
    const a = stop - 0.08;
    o += arrow(px - r * Math.cos(a), py - r * Math.sin(a), px - r * Math.cos(stop), py - r * Math.sin(stop), 'ln');
    o += text(x0 + 24, py + 18, 'infant 从这边看', 'ts');
    o += text(x0 + 130, 214, note1, 't', 'middle') + text(x0 + 130, 232, note2, 'ts', 'middle');
  };
  const contact = Math.PI - Math.atan2(40, 30);
  panel(10, 'Possible event', contact, 'wash-strong', '屏板转到碰上箱子就停住', '转的角度小，时间短');
  panel(290, 'Impossible event', Math.PI, 'dash', '屏板一直转到底', '箱子被暗中撤掉（虚线）');
  o += line(280, 14, 280, 240, 'grid');
  o += text(280, 262, '婴儿看右边更久。批评者指出：右边也转得更远、更久，看得久可能只因为它在知觉上不同（premise 2）。', 'ts', 'middle');
  return svg(560, 272, o, 'Baillargeon 的 screen study 的侧视示意：屏板从平放朝婴儿的一侧转起来。可能事件里它碰到后面的箱子就停住；不可能事件里箱子被暗中撤掉，屏板一直转到底。不可能事件转的角度更大、时间更长');
}

// Asch：stimulus 与座位
function asch() {
  let o = '';
  o += text(60, 40, 'standard', 'ts', 'middle');
  o += line(60, 50, 60, 170, 'ink-b') + text(60, 190, 'X', 'tb', 'middle');
  const cmp = [['A', 92], ['B', 120], ['C', 104]].map(([a, h]) => [a, h]);
  o += text(170, 22, '判断哪条和 X 一样长', 'tb', 'middle') + text(170, 40, 'comparison lines', 'ts', 'middle');
  cmp.forEach(([s, h], i) => { const x = 130 + i * 40; o += line(x, 170 - h, x, 170, 'ink-b') + text(x, 190, s, 'tb', 'middle'); });
  o += text(130, 214, '正确答案是 B（长度示意）', 'ts', 'middle');
  o += line(262, 14, 262, 230, 'grid');
  o += text(410, 22, '8 人按座位依次大声报答案', 'tb', 'middle');
  for (let i = 0; i < 8; i++) {
    const x = 291 + i * 34, y = 90, real = i === 7;
    o += circle(x, y, 14, real ? 'solid' : 'wash2') + text(x, y + 5, String(i + 1), real ? 'tw' : 'tb', 'middle');
    if (i < 7) o += text(x, y - 22, '“A”', 'ts', 'middle');
  }
  o += arrow(285, 118, 535, 118, 'mute');
  o += text(410, 146, '1–7：confederates', 't', 'middle') + text(410, 168, 'critical trial 上一致报错（A）', 'ts', 'middle');
  o += text(410, 192, '8：唯一的真被试，最后一个回答', 'tl', 'middle');
  o += text(410, 214, '18 轮里 12 轮是 critical trial', 'ts', 'middle');
  return svg(560, 238, o, 'Asch 的 conformity 实验：左边是 standard line 和三条 comparison line，正确答案一眼可见；右边是 8 个座位，前 7 个是知情的 confederate，在 critical trial 上一致报出错误答案，真被试坐在最后一个');
}

// Regression to the mean：在最糟的日子求助
function regress() {
  let o = '';
  const sx = lin(10, 90, 40, 520), sy = lin(0, 1, 190, 50);
  const f = (x) => Math.exp(-0.5 * ((x - 50) / 10) ** 2);
  o += path(area(f, 10, 30, sx, sy), 'wash-strong');
  o += path(curve(f, 10, 90, sx, sy), 'ln');
  o += axes({ sx, sy, x0: 10, x1: 90, y0: 0, y1: 0, xt: [20, 30, 40, 50, 60, 70, 80], xl: '心情分数' });
  o += line(sx(50), 190, sx(50), 46, 'dash') + text(sx(50), 38, '自己的 mean 50，SD 10', 'ts', 'middle');
  o += text(sx(18), 150, '分数 < 30', 'tb', 'middle') + text(sx(18), 166, '约 2.3% 的日子', 'ts', 'middle');
  const yM = 270;
  o += line(sx(20), yM, sx(56), yM, 'axis');
  o += path(`M${sx(26.3) + 4} ${yM - 5}Q${(sx(26.3) + sx(38.1)) / 2} ${yM - 30} ${sx(38.1) - 4} ${yM - 5}`, 'ln');
  o += path(`M${sx(26.3) + 4} ${yM - 5}Q${(sx(26.3) + sx(50)) / 2} ${yM - 62} ${sx(50) - 4} ${yM - 5}`, 'ln-dash');
  const pt = (v, lab, note, cls) => circle(sx(v), yM, 5, cls) + text(sx(v), yM + 20, lab, 'ts', 'middle') + text(sx(v), yM + 38, note, 'tl', 'middle');
  o += pt(26.3, '26.3', '求助那天', 'solid') + pt(38.1, '38.1', 'r = 0.5', 'wash-strong ink-s') + pt(50, '50', 'r = 0', 'wash-strong ink-s');
  o += text(sx(57), yM - 4, '下一次测量的期望：', 'ts');
  o += text(sx(57), yM + 14, '什么都不做也“提高”12 到 24 分', 'ts');
  return svg(560, 318, o, 'Regression to the mean：一个人的心情分数 mean 50、SD 10；只在分数低于 30 的日子求助，这些日子平均 26.3 分。下一次测量的期望值，相邻两次 correlation 为 0.5 时是 38.1，互不相关时回到 50');
}

export default {
  'pl1101e-design': design,
  'pl1101e-third': third,
  'pl1101e-neuron': neuron,
  'pl1101e-cc': cc,
  'pl1101e-rw': rw,
  'pl1101e-forget': forget,
  'pl1101e-milgram': milgram,
  'pl1101e-power': power,
  'pl1101e-split': split,
  'pl1101e-sperling': sperling,
  'pl1101e-screen': screen,
  'pl1101e-asch': asch,
  'pl1101e-regress': regress,
};
