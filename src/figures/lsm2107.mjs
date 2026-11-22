import { svg, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes, area } from '../lib/svg.mjs';

// 固定 seed 的 PRNG（mulberry32），让 drift 的图每次构建都一样
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 第 1 站：error threshold。完整复制一条长 L 的序列的 probability (1−u)^L，和 1/σ 比
function threshold() {
  const sx = lin(0, 300, 70, 520), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 300, y0: 0, y1: 1, xt: [0, 50, 100, 150, 200, 250, 300], yt: [[0.1, '0.1'], [0.5, '0.5'], [1, '1']], grid: true });
  o += path(curve((L) => (1 - 0.01) ** L, 0, 300, sx, sy), 'ln') + path(curve((L) => (1 - 0.001) ** L, 0, 300, sx, sy), 'ink');
  o += line(sx(0), sy(0.5), sx(300), sy(0.5), 'dash') + line(sx(0), sy(0.1), sx(300), sy(0.1), 'dash');
  o += text(sx(300), sy(0.5) - 6, '1/σ，σ = 2', 'ts', 'end') + text(sx(300), sy(0.1) - 6, '1/σ，σ = 10', 'ts', 'end');
  const L2 = Math.log(2) / -Math.log(0.99), L10 = Math.log(10) / -Math.log(0.99);
  o += line(sx(L2), sy(0.5), sx(L2), sy(0), 'mute') + circle(sx(L2), sy(0.5), 4, 'ln-f') + text(sx(L2) - 8, sy(0.5) + 18, 'L ≈ 69', 'tl', 'end');
  o += line(sx(L10), sy(0.1), sx(L10), sy(0), 'mute') + circle(sx(L10), sy(0.1), 4, 'ln-f') + text(sx(L10) - 8, sy(0.1) + 18, 'L ≈ 229', 'tl', 'end');
  o += text(sx(132), sy(0.36), 'u = 0.01', 'tl') + text(sx(160), sy(0.92), 'u = 0.001', 'tb');
  o += text(520, 266, 'sequence length L（nucleotide）', 'ts', 'end') + text(70, 16, '一次复制完全没有错的 probability (1 − u)ᴸ', 'tb');
  return svg(560, 274, o, '完全正确复制一条序列的 probability 随长度 L 指数下降；u 等于 0.01 时，它在 L 约 69 处跌破 1/2，在 L 约 229 处跌破 1/10，超过这个长度 master sequence 就维持不住');
}

// 第 2 站：Hardy–Weinberg 的三条 curve，以及 Cleghorn 1960 的 MN 数据
function hw() {
  const sx = lin(0, 1, 70, 400), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.25, 0.5, 0.75, 1], yt: [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], grid: true });
  o += path(curve((p) => p * p, 0, 1, sx, sy), 'ink') + path(curve((p) => (1 - p) ** 2, 0, 1, sx, sy), 'mute') + path(curve((p) => 2 * p * (1 - p), 0, 1, sx, sy), 'ln');
  const p = 0.5425;
  o += line(sx(p), sy(0), sx(p), sy(1), 'dash');
  for (const v of [0.298, 0.489, 0.213]) o += circle(sx(p), sy(v), 4.5, 'ink-f');
  o += text(sx(0.9), sy(0.86), 'MM：p²', 't', 'end') + text(sx(0.1), sy(0.86), 'NN：q²', 'ts');
  o += text(sx(0.585), sy(0.66), 'MN：2pq', 'tl');
  o += text(415, 60, 'Cleghorn（1960），', 'tb') + text(415, 78, '1000 个 English', 't') + text(415, 96, 'blood donor：', 't');
  o += text(415, 122, 'p = 0.5425', 't') + text(415, 146, 'MM 0.298', 'ts') + text(415, 164, 'MN 0.489', 'ts') + text(415, 182, 'NN 0.213', 'ts');
  o += text(415, 206, '三个黑点几乎正好', 'ts') + text(415, 222, '落在三条 curve 上', 'ts');
  o += text(400, 266, 'allele M 的 frequency p', 'ts', 'end');
  return svg(560, 274, o, '横轴是 allele frequency p，三条 curve 是 Hardy–Weinberg 预测的 genotype frequency p 方、2pq、q 方；Cleghorn 1960 年的 MN blood group 数据在 p 等于 0.5425 处的三个点几乎落在 curve 上');
}

// 第 3 站：同样 s = 0.1，dominance 不同的三种 sweep
function sweep() {
  const run = (h) => {
    let p = 0.01; const pts = [[0, p]];
    for (let t = 1; t <= 1300; t++) {
      const q = 1 - p, w11 = 1.1, w12 = 1 + 0.1 * h, w22 = 1;
      const wb = p * p * w11 + 2 * p * q * w12 + q * q * w22;
      p = (p * p * w11 + p * q * w12) / wb; pts.push([t, p]);
    }
    return pts;
  };
  const sx = lin(0, 1300, 70, 520), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1300, y0: 0, y1: 1, xt: [0, 200, 400, 600, 800, 1000, 1200], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  const draw = (h, cls) => path(d(run(h).map(([t, p]) => [sx(t), sy(p)])), cls);
  o += draw(0.5, 'ln') + draw(1, 'ink') + draw(0, 'mute');
  o += text(sx(205), sy(0.5), 'additive（h = ½）', 'tl');
  o += text(sx(300), sy(0.8), 'dominant（h = 1）：前快后慢', 'tb');
  o += text(sx(1000), sy(0.28), 'recessive（h = 0）', 't', 'middle') + text(sx(1000), sy(0.18), '前慢后快', 'ts', 'middle');
  o += text(520, 266, 'generation', 'ts', 'end') + text(70, 16, '有利 allele 的 frequency p，从 0.01 出发，s = 0.1', 'tb');
  return svg(560, 274, o, '同一个 selection coefficient 下三条 allele frequency 的 trajectory：additive 约 190 代从 0.01 到 0.99；dominant 起步快、收尾极慢；recessive 起步极慢、收尾快');
}

// 第 3 站：Majerus 的实验，每年被吃掉的比例
function moth() {
  const rows = [[2002, 706, 101, 162, 31], [2003, 731, 82, 204, 24], [2004, 751, 53, 128, 17], [2005, 763, 58, 166, 18], [2006, 774, 34, 145, 6], [2007, 797, 14, 158, 4]];
  const sx = lin(0, 6, 80, 520), sy = lin(0, 0.4, 220, 30);
  let o = '';
  for (const v of [0.1, 0.2, 0.3, 0.4]) o += line(80, sy(v), 520, sy(v), 'grid') + text(74, sy(v) + 4, String(v), 'ts', 'end');
  o += line(80, sy(0), 520, sy(0), 'axis') + line(80, sy(0), 80, sy(0.4), 'axis');
  rows.forEach(([y, T, M, te, me], i) => {
    const x = sx(i) + 14;
    o += rect(x, sy(te / T), 26, sy(0) - sy(te / T), 'wash2 ink-s') + rect(x + 30, sy(me / M), 26, sy(0) - sy(me / M), 'solid');
    o += text(x + 28, 238, String(y), 'ts', 'middle') + text(x + 43, sy(me / M) - 5, `${me}/${M}`, 'ts', 'middle');
  });
  o += rect(96, 260, 14, 12, 'wash2 ink-s') + text(116, 270, 'typica（浅色）', 'ts') + rect(230, 260, 14, 12, 'solid') + text(250, 270, 'carbonaria（黑色），柱顶是 被吃掉数 / 放出数', 'ts');
  o += text(80, 18, '每年被 bird 吃掉的比例：Majerus 2002–2007（Cook 等 2012，Table 2）', 'tb');
  return svg(560, 282, o, 'Majerus 实验 2002 到 2007 年每年 typica 和 carbonaria 被鸟吃掉的比例；六年里有五年 carbonaria 被吃得更多，但后几年 carbonaria 的样本只有十几个到几十个');
}

// 第 3 站：breeder's equation。左：Boag 1976 年 20 对 midparent–offspring（Stratton 教材从 Boag 1983 图 1 取数），slope 就是 h²；
// 右：1977 年 drought 的 S，以及用这个 h² 预测的 R 和实测的 R
function breeder() {
  const mp = [8.2, 8.3, 8.4, 9.3, 8.9, 8.8, 9.9, 10.9, 9.1, 9.1, 9.3, 9.2, 9.7, 9.4, 9.7, 9.9, 10.4, 10.0, 10.2, 10.7];
  const of = [8.0, 7.8, 8.2, 7.8, 8.3, 8.6, 8.7, 8.8, 8.9, 9.0, 9.2, 9.5, 9.2, 9.7, 9.7, 9.6, 9.8, 9.9, 10.1, 10.9];
  const n = mp.length, mx = mp.reduce((a, b) => a + b) / n, my = of.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (mp[i] - mx) * (of[i] - my); sxx += (mp[i] - mx) ** 2; }
  const h2 = sxy / sxx, b0 = my - h2 * mx;
  const sx = lin(7.8, 11.2, 60, 290), sy = lin(7.6, 11.2, 230, 40);
  let o = axes({ sx, sy, x0: 7.8, x1: 11.2, y0: 7.6, y1: 11.2, xt: [8, 9, 10, 11], yt: [8, 9, 10, 11], grid: true });
  o += line(sx(8), sy(b0 + h2 * 8), sx(11), sy(b0 + h2 * 11), 'ln');
  for (let i = 0; i < n; i++) o += circle(sx(mp[i]), sy(of[i]), 3.4, 'ink-f');
  o += text(sx(7.95), sy(10.75), 'regression：slope ≈ ' + h2.toFixed(2), 'tl') + text(sx(7.95), sy(10.75) + 16, '这就是 h²', 'ts');
  o += text(60, 14, '1976：offspring 对 midparent（20 个家庭）', 'tb') + text(56, 34, 'offspring 的 beak depth（mm）', 'ts');
  o += text(290, 266, 'midparent 的 beak depth（mm）', 'ts', 'end');
  // 右边：一条 beak depth 的数轴
  const H = 0.78, all = 9.31, surv = 9.84, obs = 9.70, pred = all + H * (surv - all);
  const ty = lin(9.2, 9.95, 228, 48), cA = 372, cB = 470;
  o += line(330, 14, 330, 262, 'grid');
  o += text(348, 30, '1977 年 drought 的 selection（mm）', 'tb');
  o += line(cA, ty(9.25), cA, ty(9.9), 'axis') + line(cB, ty(9.25), cB, ty(9.9), 'axis');
  o += line(cA, ty(all), cB + 10, ty(all), 'dash');
  o += circle(cA, ty(all), 5, 'ink-f') + circle(cA, ty(surv), 5, 'ln-f');
  o += text(cA + 10, ty(all) + 16, '全体 ' + all.toFixed(2), 'ts') + text(cA + 10, ty(surv) + 4, 'survivor ' + surv.toFixed(2), 'tl');
  o += line(cA - 16, ty(all), cA - 16, ty(surv), 'ink-b') + line(cA - 20, ty(all), cA - 12, ty(all), 'ink') + line(cA - 20, ty(surv), cA - 12, ty(surv), 'ink');
  o += text(cA - 22, (ty(all) + ty(surv)) / 2 + 4, 'S = ' + (surv - all).toFixed(2), 'tb', 'end');
  o += circle(cB, ty(pred), 5, 'paper') + circle(cB, ty(obs), 5, 'solid');
  o += text(cB + 10, ty(pred) - 6, '预测 ' + pred.toFixed(2), 'ts') + text(cB + 10, ty(obs) + 15, '实测 ' + obs.toFixed(2), 'tl');
  o += line(cB - 16, ty(all), cB - 16, ty(obs), 'ink-b') + line(cB - 20, ty(all), cB - 12, ty(all), 'ink') + line(cB - 20, ty(obs), cB - 12, ty(obs), 'ink');
  o += text(cB - 22, (ty(all) + ty(obs)) / 2 + 4, 'R = ' + (obs - all).toFixed(2), 'tb', 'end');
  o += text(cA - 6, 246, 'parent', 'ts', 'middle') + text(cB, 246, '1978 offspring', 'ts', 'middle');
  o += text(348, 266, '预测 R = h²S = 0.78 × ' + (surv - all).toFixed(2) + ' ≈ ' + (H * (surv - all)).toFixed(2), 'ts');
  return svg(560, 274, o, '左边是 1976 年 20 个家庭的 offspring 对 midparent 的 beak depth，regression 的 slope 约 0.78，就是 heritability；右边是 1977 年 drought：全体 9.31 毫米、survivor 9.84 毫米，S 等于 0.53；按 h² 预测 1978 年 offspring 是 9.72 毫米，实测 9.70 毫米');
}

// 第 4 站：Wright–Fisher drift，20 个 population，N = 20（2N = 40 个 gene copy），seed 固定
function drift() {
  const R = rng(2107), twoN = 40, G = 80;
  const sx = lin(0, G, 70, 470), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: G, y0: 0, y1: 1, xt: [0, 20, 40, 60, 80], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  let fixed = 0, lost = 0;
  for (let r = 0; r < 20; r++) {
    let k = twoN / 2; const pts = [[sx(0), sy(0.5)]];
    for (let t = 1; t <= G; t++) {
      const p = k / twoN; let nk = 0;
      for (let i = 0; i < twoN; i++) if (R() < p) nk++;
      k = nk; pts.push([sx(t), sy(k / twoN)]);
    }
    if (k === twoN) fixed++; else if (k === 0) lost++;
    o += path(d(pts), r % 2 ? 'ink' : 'ln');
  }
  o += text(480, sy(1) + 4, `fixed：${fixed}`, 'tb') + text(480, sy(0) + 4, `lost：${lost}`, 'tb');
  o += text(480, sy(0.5) + 4, `还在漂：${20 - fixed - lost}`, 'ts');
  o += text(470, 266, 'generation', 'ts', 'end') + text(70, 16, '20 个 population，各 20 个 diploid 个体，起点 p = 0.5，seed 2107', 'tb');
  return svg(560, 274, o, '20 条 Wright–Fisher trajectory 从 0.5 出发，各自随机游走，陆续撞上 0 或 1 并停在那里');
}

// 第 5 站：two-fold cost 的家谱
function twofold() {
  let o = '';
  const fem = (x, y, cls) => circle(x, y, 9, cls);
  const male = (x, y) => rect(x - 8, y - 8, 16, 16, 'paper');
  const gy = [50, 120, 190];
  o += text(130, 20, 'Sexual female', 'tb', 'middle') + text(380, 20, 'Asexual female', 'tb', 'middle');
  // sexual：每个 female 生 1 son + 1 daughter
  o += fem(130, gy[0], 'solid');
  o += line(130, gy[0] + 9, 100, gy[1] - 9, 'mute') + line(130, gy[0] + 9, 160, gy[1] - 9, 'mute');
  o += male(100, gy[1]) + fem(160, gy[1], 'solid');
  o += line(160, gy[1] + 9, 135, gy[2] - 9, 'mute') + line(160, gy[1] + 9, 185, gy[2] - 9, 'mute');
  o += male(135, gy[2]) + fem(185, gy[2], 'solid');
  // asexual：每个 female 生 2 daughter
  o += fem(380, gy[0], 'ink-f');
  o += line(380, gy[0] + 9, 340, gy[1] - 9, 'mute') + line(380, gy[0] + 9, 420, gy[1] - 9, 'mute');
  o += fem(340, gy[1], 'ink-f') + fem(420, gy[1], 'ink-f');
  for (const x of [340, 420]) o += line(x, gy[1] + 9, x - 22, gy[2] - 9, 'mute') + line(x, gy[1] + 9, x + 22, gy[2] - 9, 'mute');
  for (const x of [318, 362, 398, 442]) o += fem(x, gy[2], 'ink-f');
  for (let g = 0; g < 3; g++) {
    o += text(20, gy[g] + 4, 'gen ' + g, 'ts');
    o += text(255, gy[g] + 4, '1 个 female', 'tl', 'middle');
    o += text(548, gy[g] + 4, 2 ** g + ' 个 female', 'tb', 'end');
  }
  o += text(280, 236, '圆是 female，方块是 male。两边每个 female 都生 2 个 offspring，male 不参与抚育。', 'ts', 'middle');
  return svg(560, 248, o, '左边 sexual female 每代生一儿一女，female 数目保持为 1；右边 asexual female 每代生两个女儿，female 数目每代翻倍');
}

// 第 6 站：Lack 的 clutch size，再加上 parent 的 survival cost
function lack() {
  const sx = lin(0, 10, 70, 450), sy = lin(0, 6, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 10, y0: 0, y1: 6, xt: [0, 2, 4, 6, 8, 10], yt: [1, 2, 3, 4, 5, 6], grid: true });
  const f1 = (n) => n * (1 - 0.1 * n), f2 = (n) => n * (1 - 0.1 * n) + 5 * (0.8 - 0.05 * n);
  o += path(curve(f1, 0, 10, sx, sy), 'ink') + path(curve(f2, 0, 10, sx, sy), 'ln');
  o += line(sx(5), sy(0), sx(5), sy(2.5), 'dash') + circle(sx(5), sy(2.5), 4, 'ink-f');
  o += line(sx(3.75), sy(0), sx(3.75), sy(f2(3.75)), 'ln-dash') + circle(sx(3.75), sy(f2(3.75)), 4, 'ln-f');
  o += text(sx(5) + 6, sy(2.5) + 18, 'n = 5，2.5', 't');
  o += text(sx(3.75) - 6, sy(f2(3.75)) - 10, 'n = 3.75', 'tl', 'end');
  o += text(462, sy(0.8), '本季 fledgling', 'tb') + text(462, sy(0.8) + 16, 'n(1 − 0.1n)', 'ts');
  o += text(462, sy(4.4), '本季 + 以后', 'tl') + text(462, sy(4.4) + 16, '再加上 parent', 'ts') + text(462, sy(4.4) + 32, '明年活着的价值', 'ts');
  o += text(450, 266, 'clutch size n（每窝 egg 数）', 'ts', 'end') + text(70, 16, '期望的 offspring 数', 'tb');
  return svg(560, 274, o, '只看本季，fledgling 数 n 乘以 1 减 0.1n 在 n 等于 5 时最大；把 parent 第二年的 survival 随 clutch size 下降也算进去，总数在 n 等于 3.75 时最大');
}

// 第 7 站：Dobzhansky–Muller incompatibility
function dm() {
  let o = '';
  const box = (x, y, w, s, cls = 'paper') => rect(x - w / 2, y - 15, w, 30, cls, 6) + text(x, y + 5, s, cls === 'solid' ? 'tw' : 't', 'middle');
  o += box(280, 34, 90, 'aa bb');
  o += text(280, 66, 'ancestor，两群被隔开', 'ts', 'middle');
  o += arrow(250, 50, 140, 92, 'ink') + arrow(310, 50, 420, 92, 'ink');
  o += box(110, 108, 90, 'Aa bb') + box(450, 108, 90, 'aa Bb');
  o += arrow(110, 124, 110, 152, 'ink') + arrow(450, 124, 450, 152, 'ink');
  o += box(110, 168, 90, 'AA bb') + box(450, 168, 90, 'aa BB');
  o += text(110, 202, 'population 1', 'ts', 'middle') + text(450, 202, 'population 2', 'ts', 'middle');
  o += text(200, 132, 'A 只遇到过 b', 'ts', 'middle') + text(360, 132, 'B 只遇到过 a', 'ts', 'middle');
  o += arrow(160, 180, 236, 222, 'mute') + arrow(400, 180, 324, 222, 'mute');
  o += box(280, 236, 90, 'Aa Bb', 'solid');
  o += text(280, 270, 'Hybrid：A 和 B 第一次放进同一个 genome，相互作用出了问题', 'ts', 'middle');
  return svg(560, 280, o, 'Dobzhansky–Muller model：ancestor 是 aabb，一群换成 AAbb，另一群换成 aaBB，每一步都可行；hybrid AaBb 第一次把 A 和 B 放在一起，二者不兼容');
}

// 第 8 站：relatedness 的来历：diploid 的 full sib 与 haplodiploid 的 sister
function kin() {
  let o = '';
  const panel = (x0, title, pat, patNote, total) => {
    o += text(x0 + 120, 20, title, 'tb', 'middle');
    o += rect(x0 + 10, 40, 100, 34, 'paper', 6) + text(x0 + 60, 62, 'mother', 't', 'middle');
    o += rect(x0 + 130, 40, 100, 34, 'paper', 6) + text(x0 + 180, 62, 'father', 't', 'middle');
    o += text(x0 + 60, 92, '2 套，各给一套', 'ts', 'middle') + text(x0 + 180, 92, patNote, 'ts', 'middle');
    o += rect(x0 + 10, 108, 100, 34, 'wash', 6) + text(x0 + 60, 130, 'maternal copy', 't', 'middle');
    o += rect(x0 + 130, 108, 100, 34, 'wash', 6) + text(x0 + 180, 130, 'paternal copy', 't', 'middle');
    o += text(x0 + 60, 166, '相同的 prob = ½', 'tl', 'middle') + text(x0 + 180, 166, '相同的 prob = ' + pat, 'tl', 'middle');
    o += text(x0 + 120, 196, '½ × ½ + ½ × ' + pat + ' = ' + total, 'tb', 'middle');
  };
  panel(20, 'Diploid：full sibling', '½', '2 套，各给一套', '½');
  panel(300, 'Haplodiploid：sister', '1', '只有 1 套，全给', '¾');
  o += line(280, 30, 280, 210, 'grid');
  o += text(280, 232, '从我身上随便取一个 gene copy：它有 ½ 的机会来自 mother、½ 来自 father，', 'ts', 'middle');
  o += text(280, 250, '再问 sibling 从同一个 parent 拿到同一个 copy 的 probability。', 'ts', 'middle');
  return svg(560, 260, o, 'Relatedness 的计算：diploid 的 full sibling 从两个 parent 各有一半机会拿到同一个 copy，合起来是二分之一；haplodiploid 的 sister 从 haploid 的 father 一定拿到同一个 copy，合起来是四分之三');
}

// 第 9 站：lactase persistence allele 在不同 s 下需要多久
function lactase() {
  const gen = 28;
  const run = (s) => {
    let p = 0.01; const pts = [[0, p]];
    for (let t = 1; t * gen <= 20000; t++) {
      const q = 1 - p, wb = 1 + s * (1 - q * q);
      p = (p * (1 + s)) / wb; pts.push([t * gen, p]);
    }
    return pts;
  };
  const sx = lin(0, 20000, 70, 450), sy = lin(0, 1, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 20000, y0: 0, y1: 1, xt: [[0, '0'], [5000, '5000'], [10000, '10000'], [15000, '15000'], [20000, '20000']], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  o += line(sx(0), sy(0.74), sx(20000), sy(0.74), 'dash') + text(sx(20000), sy(0.74) - 6, '0.74', 'ts', 'end');
  const series = [[0.1, 'ln'], [0.07, 'ln'], [0.025, 'ink'], [0.015, 'mute']];
  for (const [s, cls] of series) {
    const pts = run(s);
    o += path(d(pts.map(([x, p]) => [sx(x), sy(p)])), cls);
    const k = pts.findIndex(([, p]) => p >= 0.74);
    o += text(460, sy(pts[pts.length - 1][1]) + (s === 0.1 ? -8 : s === 0.07 ? 8 : 4), 's = ' + s, s >= 0.07 ? 'tl' : 'ts');
    if (k > 0) o += circle(sx(pts[k][0]), sy(pts[k][1]), 3, cls === 'mute' ? 'mute-f' : cls + '-f');
  }
  o += text(450, 266, '年（一代按 28 年算），从 frequency 0.01 起算', 'ts', 'end') + text(70, 16, 'dominant 的有利 allele 的 frequency', 'tb');
  return svg(560, 274, o, '一个 dominant 的有利 allele 从 0.01 涨到 0.74 所需的时间：s 等于 0.1 约 2500 年，0.07 约 3600 年，0.025 约 9700 年，0.015 约 16000 年');
}

// Hypercycle：cheater 与 compartment
function hyper() {
  let o = '';
  const node = (x, y, s, cls = 'paper') => circle(x, y, 17, cls) + text(x, y + 5, s, 'tb', 'middle');
  const link = (x1, y1, x2, y2, cls = 'ln') => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return arrow(x1 + dx * 20 / L, y1 + dy * 20 / L, x2 - dx * 20 / L, y2 - dy * 20 / L, cls); };
  o += text(135, 22, '自由扩散的 solution', 'tb', 'middle');
  const A = [100, 62], B = [160, 150], C = [40, 150], X = [218, 84];
  o += link(...A, ...B) + link(...B, ...C) + link(...C, ...A) + link(...A, ...X);
  o += line(X[0] - 6, X[1] + 18, X[0] - 18, X[1] + 34, 'dash');
  o += text(X[0] - 22, X[1] + 48, '✗', 'tb', 'middle');
  o += node(...A, 'A') + node(...B, 'B') + node(...C, 'C') + node(...X, 'B*', 'wash-strong');
  o += text(240, 150, 'cheater：', 'ts', 'middle') + text(240, 166, '收 A 的帮助，', 'ts', 'middle') + text(240, 182, '不帮 C', 'ts', 'middle');
  o += text(125, 206, '每轮快 10%：1.1⁵⁰ ≈ 117 倍', 'tl', 'middle');
  o += line(280, 14, 280, 236, 'grid');
  o += text(420, 22, '关进 compartment', 'tb', 'middle');
  const comp = (cx, cy, cheat, lab1, lab2) => {
    o += circle(cx, cy, 58, cheat ? 'wash2' : 'wash');
    const a = [cx, cy - 30], b = [cx + 28, cy + 20], c = [cx - 28, cy + 20];
    o += link(...a, ...b) + link(...c, ...a) + (cheat ? line(b[0] - 18, b[1] + 2, c[0] + 18, c[1] + 2, 'dash') : link(...b, ...c));
    o += node(...a, 'A') + node(...b, cheat ? 'B*' : 'B', cheat ? 'wash-strong' : 'paper') + node(...c, 'C');
    o += text(cx, cy + 82, lab1, 'tb', 'middle') + text(cx, cy + 98, lab2, 'ts', 'middle');
  };
  comp(355, 108, false, '合作者', 'replicate 快，分裂快');
  comp(487, 108, true, '有 cheater', '整个 compartment 变慢');
  o += text(280, 236, '', 'ts');
  return svg(560, 228, o, 'Hypercycle：A 帮 B、B 帮 C、C 帮 A。在自由扩散的 solution 里，B 的 mutant B* 接受 A 的帮助却不帮 C，每轮快 10%，50 轮后多出约 117 倍；关进 compartment 后，帮助只给同一个 compartment 的成员，有 cheater 的 compartment 整体变慢');
}

// John 和 Jill 的 pedigree
function pedigree() {
  let o = '';
  const sq = (x, y, cls = 'paper') => rect(x - 14, y - 14, 28, 28, cls, 2);
  const ci = (x, y, cls = 'paper') => circle(x, y, 14, cls);
  o += sq(140, 50) + ci(220, 50) + line(154, 50, 206, 50, 'ink');
  o += text(180, 24, 'John 的 parents：都是 Aa', 'ts', 'middle');
  o += line(180, 50, 180, 84, 'ink') + line(100, 84, 260, 84, 'ink') + line(100, 84, 100, 106, 'ink') + line(260, 84, 260, 106, 'ink');
  o += sq(100, 120, 'ink-f') + text(100, 154, '哥哥：aa', 'ts', 'middle') + text(100, 170, '死于这种病', 'ts', 'middle');
  o += sq(260, 120) + text(260, 154, 'John：健康', 'tb', 'middle') + text(260, 172, 'P(Aa) = ½ ÷ ¾ = ⅔', 'tl', 'middle');
  o += ci(420, 120) + text(420, 154, 'Jill：健康', 'tb', 'middle') + text(420, 172, 'P(Aa) = 0.18 ÷ 0.99 ≈ 0.182', 'tl', 'middle');
  o += line(274, 120, 406, 120, 'ink');
  o += rect(354, 30, 132, 44, 'wash2', 6) + text(420, 48, 'population：q² = 1%', 'ts', 'middle') + text(420, 65, 'q = 0.1，2pq = 0.18', 'ts', 'middle');
  o += line(420, 74, 420, 106, 'dash');
  o += line(340, 120, 340, 200, 'ink');
  o += poly([[340, 200], [354, 214], [340, 228], [326, 214]], 'paper') + text(340, 219, '?', 'tb', 'middle');
  o += text(362, 210, '孩子是 aa 的 probability', 'ts') + text(362, 228, '⅔ × 0.182 × ¼ ≈ 0.030', 'tl');
  o += text(280, 260, '方块是 male，圆是 female，涂黑是患者。John 健康，所以排除了 aa，只在 AA 与 Aa 之间算。', 'ts', 'middle');
  return svg(560, 272, o, 'John 和 Jill 的 pedigree：John 的哥哥是 aa，所以 parents 都是 Aa；John 健康，是 carrier 的 probability 为三分之二；Jill 来自 carrier 占 0.18 的 population，健康，是 carrier 的 probability 约 0.182；孩子得病的 probability 约 0.030');
}

// Euler–Lotka：两种策略每个年龄的 l_x m_x
function lotka() {
  let o = '';
  const sx = lin(0.4, 6.6, 60, 370), sy = lin(0, 1.3, 220, 40);
  o += axes({ sx, sy, x0: 0.4, x1: 6.6, y0: 0, y1: 1.3, xt: [1, 2, 3, 4, 5, 6], yt: [0, 0.5, 1], grid: true, xl: '年龄 x', yl: 'lₓmₓ：这个年龄平均生几个 daughter' });
  for (let x = 1; x <= 6; x++) {
    const a = 0.2 * 0.5 ** (x - 1) * 5, b = x >= 2 ? 0.2 * 0.5 ** (x - 1) * 12 : 0;
    o += rect(sx(x) - 17, sy(a), 16, sy(0) - sy(a), 'solid') + rect(sx(x) + 1, sy(b), 16, sy(0) - sy(b), 'wash-strong');
    if (x <= 3) { o += text(sx(x) - 9, sy(a) - 5, a.toFixed(2).replace(/0$/, ''), 'ts', 'middle'); if (b) o += text(sx(x) + 9, sy(b) - 5, b.toFixed(1), 'ts', 'middle'); }
  }
  o += rect(392, 56, 14, 14, 'solid') + text(412, 68, 'A：1 岁起，每年 5', 'tb');
  o += text(412, 88, 'R₀ = 2.0，λ = 1.5', 'tl');
  o += rect(392, 120, 14, 14, 'wash-strong') + text(412, 132, 'B：2 岁起，每年 12', 'tb');
  o += text(412, 152, 'R₀ = 2.4，λ ≈ 1.37', 'tl');
  o += text(392, 190, 'R₀ 是 bar 的总和：B 多。', 'ts') + text(392, 208, 'λ 还看早晚：A 早一年。', 'ts');
  return svg(560, 256, o, '两种 life history 策略每个年龄的 l_x m_x：策略 A 从 1 岁起依次是 1、0.5、0.25……，总和 R0 为 2.0，λ 为 1.5；策略 B 从 2 岁起依次是 1.2、0.6、0.3……，总和 2.4 更大，但 λ 只有约 1.37');
}

// Fly：每天 expected 产卵数，晚年几乎不占分量
function aging() {
  let o = '';
  const sx = lin(0.3, 25.7, 60, 520), sy = lin(0, 11, 220, 36), w = 13;
  o += axes({ sx, sy, x0: 0.3, x1: 25.7, y0: 0, y1: 11, xt: [1, 5, 10, 15, 19, 25], yt: [0, 2, 4, 6, 8, 10], grid: true, xl: '第 t 天', yl: 'expected egg 数 = 10 × 0.8ᵗ⁻¹' });
  for (let t = 1; t <= 25; t++) {
    const v = 10 * 0.8 ** (t - 1);
    o += rect(sx(t) - w / 2, sy(v), w, sy(0) - sy(v), t <= 19 ? 'solid' : 'wash-strong');
  }
  o += rect(sx(1) - w / 2, sy(11), w, sy(10) - sy(11), 'wash2 ink-s');
  o += text(sx(1) + 12, sy(10.6) + 4, '第二个 mutant：第 1 天多 1 个，+1', 'ts');
  o += line(sx(19.5), sy(0), sx(19.5), sy(7.2), 'dash');
  o += text(sx(19.5) + 4, sy(6.6), '第 19 天之后必死：', 'ts') + text(sx(19.5) + 4, sy(6.6) + 16, '浅色部分合计只有 0.72', 'tl');
  o += text(sx(19.5) + 4, sy(6.6) + 32, '（活到第 20 天的', 'ts') + text(sx(19.5) + 4, sy(6.6) + 48, 'probability 约 1.4%）', 'ts');
  o += text(sx(8), sy(7.6), '不 aging：全部 bar 合计 50', 'tb');
  return svg(560, 264, o, '一只每天 survival 为 0.8 的 fly 每天 expected 的 egg 数：第 1 天 10 个，之后每天乘 0.8，全部合计 50；第 19 天之后的部分合计只有 0.72，所以一个第 1 天多产 1 个、代价是第 19 天后必死的 mutant 总数更多');
}

// 读 tree：clade、paraphyletic 与绕 node 旋转
function tree() {
  let o = '';
  const panel = (x0, title, tips, nodes, shade, note) => {
    o += text(x0 + 130, 22, title, 'tb', 'middle');
    const ty = (i) => 52 + i * 28, X = (dep) => x0 + 20 + dep * 28;
    const pos = {};
    tips.forEach((t, i) => { pos[t] = [X(5), ty(i)]; });
    if (shade) { const ys = shade.map((t) => pos[t][1]); o += rect(X(shade.length === 3 ? 3 : 1) - 6, Math.min(...ys) - 13, X(5) - X(3) + 88, Math.max(...ys) - Math.min(...ys) + 26, 'wash', 6); }
    for (const [name, dep, kids] of nodes) {
      const ys = kids.map((k) => pos[k][1]);
      const y = (Math.min(...ys) + Math.max(...ys)) / 2, x = X(dep);
      o += line(x, Math.min(...ys), x, Math.max(...ys), 'ink');
      for (const k of kids) o += line(x, pos[k][1], pos[k][0], pos[k][1], 'ink');
      pos[name] = [x, y];
    }
    o += line(X(0) - 12, pos.root[1], X(0), pos.root[1], 'ink');
    tips.forEach((t) => { o += text(X(5) + 6, pos[t][1] + 5, t, 't'); });
    o += text(x0 + 130, 236, note[0], 'ts', 'middle') + text(x0 + 130, 252, note[1], 'ts', 'middle');
    return pos;
  };
  const N = [['amn', 4, ['lizard', 'human']], ['tet', 3, ['frog', 'amn']], ['sar', 2, ['lungfish', 'tet']], ['ost', 1, ['tuna', 'sar']], ['root', 0, ['shark', 'ost']]];
  const p = panel(10, 'Tetrapod 是 clade，“fish”不是', ['shark', 'tuna', 'lungfish', 'frog', 'lizard', 'human'], N, ['frog', 'lizard', 'human'], ['阴影：一个 node 加上它全部 descendant。', '“fish”缺了 tetrapod，是 paraphyletic。']);
  o += text(p.tet[0] - 4, p.tet[1] - 6, '', 'ts');
  o += path(`M240 42L248 42L248 118L240 118`, 'dash');
  o += text(250, 34, '“fish”', 'ts', 'middle');
  const N2 = [['amn', 4, ['lizard', 'human']], ['tet', 3, ['frog', 'amn']], ['sar', 2, ['lungfish', 'tet']], ['ost', 1, ['sar', 'tuna']], ['root', 0, ['shark', 'ost']]];
  panel(290, '把一个 node 转 180°', ['shark', 'lungfish', 'frog', 'lizard', 'human', 'tuna'], N2, null, ['human 现在挨着 tuna，关系一点没变：', 'human 和 lungfish 的 common ancestor 更近。']);
  o += line(280, 14, 280, 258, 'grid');
  return svg(560, 264, o, '同一棵 vertebrate 的 tree 画两次：左边 frog、lizard、human 组成 tetrapod clade，shark、tuna、lungfish 合称的 fish 不包含 tetrapod，是 paraphyletic；右边把 tuna 所在的 node 转了 180 度，human 排到了 tuna 旁边，但 human 与 lungfish 的 common ancestor 仍然比与 tuna 的更近');
}

// Hamilton：cousin 的 relatedness 走哪几步
function paths() {
  let o = '';
  const sq = (x, y, cls = 'paper') => rect(x - 13, y - 13, 26, 26, cls, 2);
  const ci = (x, y, cls = 'paper') => circle(x, y, 13, cls);
  o += sq(200, 44) + ci(300, 44) + line(213, 44, 287, 44, 'ink') + text(250, 22, '两个共同的 grandparent', 'ts', 'middle');
  o += line(250, 44, 250, 72, 'ink') + line(150, 72, 350, 72, 'ink') + line(150, 72, 150, 92, 'ink') + line(350, 72, 350, 92, 'ink');
  o += ci(150, 106, 'wash') + text(150, 111, 'P', 'tb', 'middle') + sq(70, 106) + line(83, 106, 137, 106, 'ink');
  o += sq(350, 106, 'wash') + text(350, 111, 'U', 'tb', 'middle') + ci(430, 106) + line(363, 106, 417, 106, 'ink');
  o += text(150, 138, 'parent', 'ts', 'middle') + text(350, 138, 'aunt / uncle', 'ts', 'middle');
  o += line(110, 106, 110, 160, 'ink') + line(80, 160, 140, 160, 'ink') + line(80, 160, 80, 174, 'ink') + line(140, 160, 140, 174, 'ink');
  o += line(390, 106, 390, 174, 'ink');
  o += circle(80, 188, 15, 'solid') + text(80, 193, 'me', 'tw', 'middle') + ci(140, 188) + ci(390, 188);
  o += text(140, 220, 'full sibling', 'ts', 'middle') + text(140, 236, 'r = ½', 'tl', 'middle');
  o += text(390, 220, 'cousin', 'ts', 'middle') + text(390, 236, 'r = 2 × (½)⁴ = ⅛', 'tl', 'middle');
  const hop = (x1, y1, x2, y2) => { o += path(`M${x1} ${y1}Q${(x1 + x2) / 2 + (y2 > y1 ? 18 : -18)} ${(y1 + y2) / 2} ${x2} ${y2}`, 'ln-dash'); o += text((x1 + x2) / 2 + (y2 > y1 ? 22 : -22), (y1 + y2) / 2 + 4, '½', 'tl', 'middle'); };
  hop(92, 176, 140, 120); hop(160, 94, 208, 56); hop(292, 56, 340, 94); hop(362, 120, 382, 176);
  o += text(500, 160, '从 me 走到 cousin：', 'ts', 'middle') + text(500, 176, '上两代、下两代，', 'ts', 'middle') + text(500, 192, '每一步 ½；', 'ts', 'middle') + text(500, 208, '经过两个 grandparent', 'ts', 'middle') + text(500, 224, '各有一条这样的路', 'ts', 'middle');
  o += text(280, 262, '虚线画的是经过 grandmother 的那条路；经过 grandfather 的另一条同样是 (½)⁴。', 'ts', 'middle');
  return svg(560, 272, o, 'Cousin 之间 relatedness 的算法：从 me 到 parent、到 grandparent、到 aunt 或 uncle、到 cousin，每一步 probability 二分之一，共四步；两个共同 grandparent 各给一条这样的路，所以 r 等于 2 乘以二分之一的四次方，即八分之一。Full sibling 的 r 是二分之一');
}

// Human、Neanderthal、Denisovan：分开时间按 Prüfer 等 2014 在 μ = 0.5e-9 下的区间画
function hominin() {
  let o = '';
  const sx = lin(800, 0, 60, 430);
  const yH = 70, yA = 168, yN = 146, yD = 192;
  const sp1 = [550, 765], sp2 = [381, 473], m1 = (sp1[0] + sp1[1]) / 2, m2 = (sp2[0] + sp2[1]) / 2;
  o += line(sx(800), yH, sx(15), yH, 'ln');
  o += line(sx(m1), yH, sx(m1), yA, 'ink') + line(sx(m1), yA, sx(m2), yA, 'ink');
  o += line(sx(m2), yN, sx(m2), yD, 'ink') + line(sx(m2), yN, sx(40), yN, 'ink') + line(sx(m2), yD, sx(40), yD, 'ink');
  o += rect(sx(sp1[1]), 96, sx(sp1[0]) - sx(sp1[1]), 7, 'wash-strong', 2);
  o += text(sx(m1) + 6, 120, '分开：' + sp1[0] / 10 + '–' + Math.round(sp1[1] / 10) + ' 万年前', 'ts');
  o += rect(sx(sp2[1]), 204, sx(sp2[0]) - sx(sp2[1]), 7, 'wash-strong', 2);
  o += text(sx(m2), 226, Math.floor(sp2[0] / 10) + '–' + Math.round(sp2[1] / 10) + ' 万年前', 'ts', 'middle');
  o += text(sx(40) + 6, yN + 5, 'Neanderthal', 'tb') + text(sx(40) + 6, yD + 5, 'Denisovan', 'tb');
  const tips = [['African', 44], ['non-African', 70], ['Oceanian', 96]];
  o += line(sx(15), 44, sx(15), 96, 'ln');
  for (const [t, y] of tips) o += line(sx(15), y, sx(0), y, 'ln') + text(sx(0) + 6, y + 5, t, 'tb');
  o += arrow(sx(55), yN - 4, sx(10), 74, 'ink') + text(sx(66), 124, '1.5–2.1%', 'ts', 'end');
  o += arrow(sx(55), yD - 4, sx(5), 100, 'ink') + text(sx(66), 176, '3–6%', 'ts', 'end');
  for (const k of [315, 195, 160]) o += circle(sx(k), yH, 5, 'paper');
  o += text(sx(315), yH - 12, 'Jebel Irhoud 315', 'ts', 'middle');
  o += text((sx(195) + sx(160)) / 2, yH + 20, 'Omo 195、Herto 160', 'ts', 'middle');
  o += text(sx(250), 40, 'H. sapiens 的 fossil（千年前）', 'tl', 'middle');
  const ya = 244;
  o += line(sx(800), ya, sx(0), ya, 'axis');
  for (const k of [800, 600, 400, 200, 0]) o += line(sx(k), ya, sx(k), ya + 4, 'axis') + text(sx(k), ya + 17, k === 0 ? '今天' : String(k), 'ts', 'middle');
  o += text(sx(800), ya + 34, '千年前。分开时间按 μ = 0.5 × 10⁻⁹ per site per year；用 1.0 × 10⁻⁹ 则都减半', 'ts');
  o += text(sx(800), 12, '← chimpanzee 与 bonobo：6–12 million 年前（远在轴外）', 'ts');
  return svg(560, 284, o, '现代人、Neanderthal 与 Denisovan 的关系：按每年每个位点 0.5 乘 10 的负 9 次方的 mutation rate，现代人与两者的共同 ancestor 在 55 万到 77 万年前分开，Neanderthal 与 Denisovan 在 38 万到 47 万年前分开；H. sapiens 最早的 fossil 是 Morocco 的 Jebel Irhoud，约 31.5 万年，Ethiopia 的 Omo 约 19.5 万年、Herto 约 16 万年；non-African 的 genome 有 1.5% 到 2.1% 来自 Neanderthal，Oceanian 有 3% 到 6% 来自 Denisovan');
}

// 第 7 站：parsimony。同一张 character matrix 放在三棵 rooted tree 上，数最少要几次 change
function parsimony() {
  const M = { O: [0, 0, 0, 0, 0, 0], A: [0, 0, 0, 0, 0, 1], B: [1, 1, 0, 0, 0, 1], C: [1, 1, 1, 1, 1, 0] };
  // Fitch 的算法：每个 character 在一棵 tree 上最少几次 change
  const fitch = (t, c) => {
    if (typeof t === 'string') return [new Set([M[t][c]]), 0];
    const [l, cl] = fitch(t[0], c), [r, cr] = fitch(t[1], c);
    const inter = new Set([...l].filter((v) => r.has(v)));
    return inter.size ? [inter, cl + cr] : [new Set([...l, ...r]), cl + cr + 1];
  };
  // 每棵 tree：pair、第三个 taxon，以及每条 branch 上画出的 change（一种最省的放法）
  const trees = [
    { pair: ['A', 'B'], third: 'C', marks: { A: '', B: '1 2', C: '1 2 3 4 5', stem: '6' } },
    { pair: ['B', 'C'], third: 'A', marks: { B: '6', C: '3 4 5', A: '6', stem: '1 2' } },
    { pair: ['A', 'C'], third: 'B', marks: { A: '6', C: '1 2 3 4 5', B: '1 2 6', stem: '' } },
  ];
  const totals = trees.map(({ pair, third }) => [0, 1, 2, 3, 4, 5].reduce((acc, c) => acc + fitch(['O', [[pair[0], pair[1]], third]], c)[1], 0));
  const best = Math.min(...totals);
  trees.forEach(({ marks }, k) => { const m = Object.values(marks).join(' ').split(' ').filter(Boolean).length; if (m !== totals[k]) throw new Error('parsimony 图的标注和 Fitch 的次数不一致'); });
  let o = '';
  trees.forEach(({ pair, third, marks }, k) => {
    const x0 = 6 + k * 186, ys = { [pair[0]]: 64, [pair[1]]: 98, [third]: 132, O: 166 };
    const xr = x0 + 12, xi = x0 + 40, xp = x0 + 82, xt = x0 + 156;
    if (totals[k] === best) o += rect(x0 - 2, 14, 180, 214, 'wash', 8);
    o += text(x0 + 88, 34, '((' + pair[0] + ',' + pair[1] + '),' + third + ')', 'tb', 'middle');
    const yp = (ys[pair[0]] + ys[pair[1]]) / 2, yi = (yp + ys[third]) / 2, yr = (yi + ys.O) / 2;
    const seg = (x1, x2, y, lab) => {
      o += line(x1, y, x2, y, 'ink');
      if (lab) {
        const n = lab.split(' ').length, mid = (x1 + x2) / 2;
        for (let q = 0; q < n; q++) { const tx = mid + (q - (n - 1) / 2) * 6; o += line(tx, y - 4, tx, y + 4, 'ln'); }
        o += text(mid, y - 8, lab, 'tl', 'middle');
      }
    };
    o += line(xr, yi, xr, ys.O, 'ink') + line(xi, yp, xi, ys[third], 'ink') + line(xp, ys[pair[0]], xp, ys[pair[1]], 'ink');
    o += line(xr - 8, yr, xr, yr, 'ink');
    seg(xr, xi, yi, '');
    seg(xi, xp, yp, marks.stem);
    seg(xp, xt, ys[pair[0]], marks[pair[0]]);
    seg(xp, xt, ys[pair[1]], marks[pair[1]]);
    seg(xi, xt, ys[third], marks[third]);
    seg(xr, xt, ys.O, '');
    for (const t of [pair[0], pair[1], third, 'O']) o += text(xt + 6, ys[t] + 5, t, 'tb');
    o += text(x0 + 88, 204, '共 ' + totals[k] + ' 次 change', totals[k] === best ? 'tl' : 't', 'middle');
  });
  o += text(280, 248, 'O 是 outgroup，它的 state 当作 ancestral；短竖线一条代表一次 change。', 'ts', 'middle');
  return svg(560, 256, o, '同一张六个 character 的 matrix 放在三棵可能的 rooted tree 上：A 和 B 为 sister 的 tree 需要 8 次 change，B 和 C 为 sister 的需要 7 次，A 和 C 为 sister 的需要 9 次；parsimony 选 7 次的那棵，代价是 character 6 在 A 和 B 上各变了一次');
}

export default {
  'lsm2107-threshold': threshold,
  'lsm2107-hw': hw,
  'lsm2107-sweep': sweep,
  'lsm2107-moth': moth,
  'lsm2107-breeder': breeder,
  'lsm2107-drift': drift,
  'lsm2107-twofold': twofold,
  'lsm2107-lack': lack,
  'lsm2107-dm': dm,
  'lsm2107-kin': kin,
  'lsm2107-lactase': lactase,
  'lsm2107-hyper': hyper,
  'lsm2107-pedigree': pedigree,
  'lsm2107-lotka': lotka,
  'lsm2107-aging': aging,
  'lsm2107-tree': tree,
  'lsm2107-paths': paths,
  'lsm2107-hominin': hominin,
  'lsm2107-parsimony': parsimony,
};
