import { svg, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes } from '../lib/svg.mjs';

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

// 第 3 站：breeder's equation 的几何：parent–offspring regression 的 slope 就是 h²
function breeder() {
  const sx = lin(8.6, 10.4, 80, 400), sy = lin(8.6, 10.4, 240, 30);
  let o = axes({ sx, sy, x0: 8.6, x1: 10.4, y0: 8.6, y1: 10.4, xt: [9, 9.5, 10], yt: [9, 9.5, 10] });
  const h2 = 0.5 / 0.7;
  const f = (x) => 9.2 + h2 * (x - 9.2);
  o += line(sx(8.6), sy(8.6), sx(10.4), sy(10.4), 'grid');
  o += line(sx(8.6), sy(f(8.6)), sx(10.4), sy(f(10.4)), 'ln');
  o += line(sx(9.2), sy(8.6), sx(9.2), sy(9.2), 'dash') + line(sx(9.9), sy(8.6), sx(9.9), sy(9.7), 'dash');
  o += line(sx(8.6), sy(9.2), sx(9.2), sy(9.2), 'dash') + line(sx(8.6), sy(9.7), sx(9.9), sy(9.7), 'dash');
  o += circle(sx(9.2), sy(9.2), 5, 'ink-f') + circle(sx(9.9), sy(9.7), 5, 'ln-f');
  o += text(sx(9.2) + 8, sy(9.2) + 18, '全体 1977 parent', 'ts') + text(sx(9.9) + 8, sy(9.7) + 22, 'survivor', 'tl');
  // S 和 R 的标注
  o += line(sx(9.2), 214, sx(9.9), 214, 'ink-b') + text((sx(9.2) + sx(9.9)) / 2, 208, 'S = 0.7', 'tb', 'middle');
  o += line(100, sy(9.2), 100, sy(9.7), 'ink-b') + text(106, (sy(9.2) + sy(9.7)) / 2 + 4, 'R = 0.5', 'tb');
  o += text(sx(10.35), sy(10.35) - 8, 'slope 1', 'ts', 'end') + text(sx(10.4), sy(f(10.4)) + 18, 'slope h² ≈ 0.71', 'tl', 'end');
  o += text(420, 50, 'Offspring 的 mean', 't') + text(420, 68, '只追回了 parent 被', 't') + text(420, 86, 'selection 推动的', 't') + text(420, 104, '那段距离的 h²。', 't');
  o += text(420, 138, 'R = h² S', 'tbig');
  o += text(400, 276, 'parent 的 beak depth（mm）', 'ts', 'end') + text(80, 18, 'offspring 的 beak depth（mm）', 'ts');
  return svg(560, 284, o, '横轴是 parent 的 beak depth，纵轴是 offspring 的 beak depth；全体 parent 的 mean 是 9.2 毫米，survivor 的 mean 是 9.9 毫米，它们的 offspring 的 mean 是 9.7 毫米；连接两点的 regression line slope 约 0.71，就是 heritability');
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
};
