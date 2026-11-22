import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, axes, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 第 1 站：Durkheim 的 suicide rate ----------
// 数据：Durkheim《Suicide》Book II 第 2 章（每 million 人每年）
function suicide() {
  let o = '';
  const panel = (x0, title, sub, rows) => {
    const sx = lin(0, 280, 0, 140);
    o += text(x0, 20, title, 'tb') + text(x0, 38, sub, 'ts');
    rows.forEach(([lab, v], i) => {
      const y = 58 + i * 34;
      o += text(x0 + 70, y + 15, lab, 't', 'end');
      o += rect(x0 + 80, y, sx(v), 20, i === 0 ? 'solid' : 'wash-strong');
      o += text(x0 + 80 + sx(v) + 6, y + 15, String(v), 'tb');
    });
  };
  panel(0, 'Prussia 各 province（1883–90）', '按 Protestant 占 population 的比例分组',
    [['90% 以上', 264.6], ['68–89%', 220.2], ['40–50%', 163.6], ['28–32%', 95.6]]);
  panel(292, 'Bavaria 各 province（1867–75）', '按 Catholic 占 population 的比例分组',
    [['不到 50%', 192], ['50–90%', 135], ['90% 以上', 75]]);
  o += line(282, 12, 282, 190, 'grid');
  o += text(280, 214, '单位：每年每 million 人中的 suicide 数。两个 state 里都是 Protestant 越多，rate 越高。', 'ts', 'middle');
  return svg(560, 222, o, '两组横条：Prussia 的 province 按 Protestant 比例从高到低，suicide rate 依次是 264.6、220.2、163.6、95.6；Bavaria 的 province 按 Catholic 比例从低到高，依次是 192、135、75');
}

// ---------- 第 2 站：1936 年 Literary Digest ----------
function frame() {
  let o = '';
  // population：横向按收入从低到高
  o += rect(10, 30, 330, 190, 'frame', 8) + text(22, 52, 'Population：1936 年的 voter，约 4500 万', 'tb');
  o += arrow(30, 206, 320, 206, 'mute', 6) + text(30, 198, '收入低', 'ts') + text(320, 198, '收入高', 'ts', 'end');
  // frame 偏在高收入一侧
  o += rect(176, 66, 154, 118, 'wash', 6) + text(186, 86, 'Sampling frame', 'tl') + text(186, 102, '电话簿、杂志订户、', 'ts') + text(186, 117, 'country club 名单', 'ts');
  o += rect(186, 126, 134, 50, 'paper', 5) + text(253, 146, '寄出 1000 万份', 't', 'middle') + text(253, 166, '收回约 240 万份', 'tb', 'middle');
  o += text(24, 80, '这一带的 voter', 'ts') + text(24, 96, '几乎不可能被抽到', 'ts');
  // 右边：三个预测放在同一条数轴上
  const sx = lin(40, 65, 370, 548), Y = 150;
  o += line(sx(40), Y, sx(65), Y, 'axis');
  for (const v of [40, 45, 50, 55, 60, 65]) o += line(sx(v), Y - 4, sx(v), Y + 4, 'axis') + text(sx(v), Y + 18, v + '%', 'ts', 'middle');
  o += line(sx(50), Y - 70, sx(50), Y, 'grid');
  o += text(459, 30, 'Roosevelt 的得票率', 'tb', 'middle');
  const mk = (v, lab, l2, y, cls) => { o += line(sx(v), y + 6, sx(v), Y - 6, 'mute') + circle(sx(v), Y, 5, cls) + text(sx(v), y - 10, lab, 'ts', 'middle') + text(sx(v), y + 3, l2, 'tb', 'middle'); };
  mk(43, 'Digest', '43%', 70, 'ink-f');
  mk(56, 'Gallup', '56%', 70, 'paper');
  mk(61, '实际', '约 61%', 108, 'ln-f');
  o += text(459, 196, '240 万人的 sample 偏了 18 个百分点；', 'ts', 'middle') + text(459, 212, '5 万人的 sample 只偏 5 个。', 'ts', 'middle');
  return svg(560, 228, o, '左：population 是全部 voter，sampling frame 只覆盖高收入一侧，寄出一千万份收回二百四十万份；右：数轴上 Digest 预测 43%，Gallup 预测 56%，实际约 61%');
}

// ---------- 第 2 站：married 与 suicide 的两种读法 ----------
function select() {
  let o = '';
  const box = (cx, cy, w, l1, l2) => { o += rect(cx - w / 2, cy - 22, w, 44, 'paper', 6) + text(cx, l2 ? cy - 3 : cy + 5, l1, 't', 'middle') + (l2 ? text(cx, cy + 14, l2, 'ts', 'middle') : ''); };
  o += text(135, 20, '读法一：marriage 本身起作用', 'tb', 'middle');
  box(135, 70, 150, '结婚', '进入一个 group');
  box(135, 176, 150, 'Suicide rate 降低', '');
  o += arrow(135, 93, 135, 152, 'ln') + text(145, 128, 'cause', 'tl');
  o += line(280, 10, 280, 230, 'grid');
  o += text(420, 20, '读法二：selection', 'tb', 'middle');
  box(420, 66, 170, '原本的倾向', '（mental health 等）');
  box(345, 178, 120, '结不结婚', '');
  box(495, 178, 120, 'Suicide rate', '');
  o += arrow(385, 89, 355, 155, 'ln') + arrow(455, 89, 485, 155, 'ln');
  o += line(406, 178, 434, 178, 'dash');
  o += text(420, 216, '两者之间没有箭头，照样有 correlation', 'ts', 'middle');
  o += text(135, 216, '数据：married 的 rate 低', 'ts', 'middle');
  return svg(560, 228, o, '左图：结婚导致 suicide rate 降低；右图：原本的倾向同时影响结不结婚和 suicide rate，两者之间没有因果箭头也会出现 correlation');
}

// ---------- 第 2 站：ecological fallacy ----------
function ecol() {
  let o = '';
  const W = 160;
  const card = (x, y, pShare, rp, rc) => {
    const wp = W * pShare;
    o += rect(x, y, wp, 18, 'solid') + rect(x + wp, y, W - wp, 18, 'wash2') + rect(x, y, W, 18, 'frame');
    const tot = pShare * rp + (1 - pShare) * rc;
    o += text(x + W + 8, y + 14, '合计 ' + tot, 'tb');
    o += text(x, y + 36, 'Protestant ' + rp, 'tl') + text(x + 104, y + 36, 'Catholic ' + rc, 't');
  };
  o += text(20, 18, 'Province X：90% Protestant', 'tb') + text(300, 18, 'Province Y：20% Protestant', 'tb');
  o += text(20, 50, '情形 A：在每个 province 里，Protestant 的 rate 都更高', 'ts');
  card(20, 60, 0.9, 280, 100); card(300, 60, 0.2, 280, 100);
  o += text(20, 132, '情形 B：在每个 province 里，Catholic 的 rate 都更高', 'ts');
  card(20, 142, 0.9, 240, 460); card(300, 142, 0.2, 100, 145);
  o += line(10, 116, 550, 116, 'grid');
  o += text(280, 216, '深色段是 Protestant，浅色段是 Catholic，长度按 population 比例；数字是每 million 人的 suicide rate。', 'ts', 'middle');
  o += text(280, 233, '只拿到 province 的合计（262 和 136）时，A 和 B 分不出来。', 'ts', 'middle');
  return svg(560, 240, o, '两个 province 的两种情形：情形 A 中 Protestant 的 rate 更高，情形 B 中 Catholic 的 rate 更高，但两个 province 的合计 rate 在两种情形下都是 262 和 136');
}

// ---------- 第 4 站：Lorenz curve ----------
const DEC25 = [506, 1450, 2259, 2977, 3745, 4629, 5672, 7105, 9488, 17958]; // SingStat KHIT 2025
function lorenz() {
  const T = DEC25.reduce((a, b) => a + b, 0);
  let c = 0;
  const L = [0, ...DEC25.map((v) => (c += v) / T)];
  let B = 0;
  for (let i = 1; i <= 10; i++) B += 0.1 * (L[i - 1] + L[i]) / 2;
  const G = 1 - 2 * B;
  const sx = lin(0, 1, 60, 300), sy = lin(0, 1, 270, 30);
  let o = '';
  const pts = L.map((v, i) => [sx(i / 10), sy(v)]);
  o += path(d([[sx(0), sy(0)], [sx(1), sy(1)], ...pts.slice().reverse()]) + 'Z', 'wash-strong');
  o += path(d([...pts, [sx(1), sy(0)]]) + 'Z', 'wash2');
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [[0, '0'], [0.2, '20%'], [0.4, '40%'], [0.6, '60%'], [0.8, '80%'], [1, '100%']], yt: [[0, '0'], [0.2, '20%'], [0.4, '40%'], [0.6, '60%'], [0.8, '80%'], [1, '100%']], xl: '按 income 从低到高排的 households' });
  o += text(sx(0) - 4, sy(1) - 12, '累计 income 份额', 'ts');
  o += line(sx(0), sy(0), sx(1), sy(1), 'ink') + path(d(pts), 'ln');
  for (const p of pts) o += circle(p[0], p[1], 2.6, 'ln-f');
  o += text(sx(0.42), sy(0.6), 'equality line', 'ts', 'end');
  o += text(sx(0.58), sy(0.46), 'A', 'tbig', 'middle');
  o += text(sx(0.86), sy(0.3), 'B', 'tbig', 'middle');
  // 两处读数
  o += line(sx(0.5) + 2, sy(L[5]) + 3, sx(0.56), sy(0.1), 'mute') + text(sx(0.55), sy(0.06), '最低的 50%：' + (100 * L[5]).toFixed(1) + '%', 'ts', 'start');
  // 右栏
  const X = 330;
  o += text(X, 50, 'Singapore 2025，10 个 decile', 'tb');
  o += text(X, 68, 'household market income per member', 'ts');
  o += text(X, 96, 'B = curve 下面的面积 = ' + B.toFixed(3), 't');
  o += text(X, 118, 'A = ½ − B = ' + (0.5 - B).toFixed(3), 't');
  o += text(X, 140, 'Gini = A ⁄ (A + B) = ' + G.toFixed(3), 'tl');
  o += text(X, 172, '最高的 10% 拿走 ' + (100 * (1 - L[9])).toFixed(1) + '%：', 'ts');
  o += text(X, 188, '最后一段 curve 从 ' + (100 * L[9]).toFixed(1) + '% 跳到 100%', 'ts');
  o += text(X, 220, 'SingStat 公布的 Gini 是 0.452：', 'ts');
  o += text(X, 236, '只用 decile 平均数，看不到', 'ts');
  o += text(X, 252, 'decile 内部的差距，算出来偏低', 'ts');
  return svg(560, 312, o, 'Singapore 2025 年按 decile 画出的 Lorenz curve，与 equality line 之间的面积 A 和曲线下面积 B，Gini 等于 A 除以 A 加 B，约 0.442');
}

// ---------- 第 5 站：mobility table ----------
// Chetty et al. (2014) Table II，行 = 父母 quintile，列 = 孩子 quintile（原表是转置）
const CH = [
  [33.7, 28.0, 18.4, 12.3, 7.5],
  [24.2, 24.2, 21.7, 17.6, 12.3],
  [17.8, 19.8, 22.1, 22.0, 18.3],
  [13.4, 16.0, 20.9, 24.4, 25.4],
  [10.9, 11.9, 17.0, 23.6, 36.5],
];
function mobtable() {
  const S = 50, X0 = 150, Y0 = 66;
  let o = text(X0 + 2.5 * S, 20, '孩子 30 岁左右的 family income 落在哪个 quintile', 'tb', 'middle');
  const lab = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
  lab.forEach((q, j) => { o += text(X0 + j * S + S / 2, Y0 - 10, q, 'ts', 'middle'); });
  o += text(X0 - 10, Y0 - 10, '父母的 quintile', 'ts', 'end');
  const shade = (v) => (v >= 30 ? 'solid' : v >= 24 ? 'wash-strong' : v >= 20 ? 'band-p' : v >= 15 ? 'wash' : 'paper-f');
  CH.forEach((row, i) => {
    o += text(X0 - 10, Y0 + i * S + S / 2 + 5, lab[i] + (i === 0 ? '（最低 20%）' : i === 4 ? '（最高 20%）' : ''), 't', 'end');
    row.forEach((v, j) => {
      o += rect(X0 + j * S, Y0 + i * S, S, S, shade(v)) + text(X0 + j * S + S / 2, Y0 + i * S + S / 2 + 5, v.toFixed(1), v >= 30 ? 'tw' : 't', 'middle');
    });
  });
  for (let k = 0; k <= 5; k++) o += line(X0 + k * S, Y0, X0 + k * S, Y0 + 5 * S, 'frame') + line(X0, Y0 + k * S, X0 + 5 * S, Y0 + k * S, 'frame');
  const R = X0 + 5 * S;
  o += arrow(R + 50, Y0 + 20, R + 4, Y0 + 22, 'mute', 5) + text(R + 54, Y0 + 16, '从最低到最高', 'ts') + text(R + 54, Y0 + 31, '只有 7.5%', 'ts');
  o += arrow(R + 50, Y0 + 4.5 * S, R + 4, Y0 + 4.5 * S, 'mute', 5) + text(R + 54, Y0 + 4.5 * S - 3, '最高的留在最高', 'ts') + text(R + 54, Y0 + 4.5 * S + 12, '36.5%', 'ts');
  o += text(R + 18, Y0 + 2.5 * S - 6, '对角线最深：', 'ts') + text(R + 18, Y0 + 2.5 * S + 9, '留在原地的最多', 'ts');
  o += text(280, Y0 + 5 * S + 26, '每一行加起来是 100%。US，1980–82 年出生的孩子（Chetty et al. 2014，Table II）。', 'ts', 'middle');
  return svg(560, Y0 + 5 * S + 36, o, '5 乘 5 的 mobility table：行是父母的 income quintile，列是孩子的 quintile，对角线上的数最大，左上 33.7，右下 36.5，右上只有 7.5');
}

// ---------- 第 5 站：Singapore 与 US，父亲在 Q1 的孩子 ----------
function q1row() {
  const rows = [['Singapore', [24.0, 22.0, 20.9, 18.8, 14.3]], ['US', [33.7, 28.0, 18.4, 12.3, 7.5]]];
  const sx = lin(0, 100, 100, 540), cls = ['wash2', 'wash', 'band-p', 'wash-strong', 'solid'];
  let o = text(320, 20, '父亲（父母）在最低 20% 的孩子，长大后落在哪个 quintile', 'tb', 'middle');
  rows.forEach(([name, v], i) => {
    const y = 52 + i * 56;
    o += text(90, y + 19, name, 'tb', 'end');
    let c = 0;
    v.forEach((p, k) => {
      o += rect(sx(c), y, sx(c + p) - sx(c), 28, cls[k]) + rect(sx(c), y, sx(c + p) - sx(c), 28, 'frame');
      o += text((sx(c) + sx(c + p)) / 2, y + 19, p.toFixed(1), k === 4 ? 'tw' : 't', 'middle');
      if (i === 0) o += text((sx(c) + sx(c + p)) / 2, y - 6, 'Q' + (k + 1), 'ts', 'middle');
      c += p;
    });
  });
  o += text(300, 158, 'Singapore：1978–82 年出生的长子，本人 income 对父亲 income（MOF 2015）', 'ts', 'middle');
  o += text(300, 174, 'US：1980–82 年出生的孩子，family income 对父母 family income（Chetty et al. 2014）', 'ts', 'middle');
  return svg(560, 182, o, '两条 100% 堆叠横条：Singapore 父亲在最低 quintile 的孩子分布为 24.0、22.0、20.9、18.8、14.3；US 为 33.7、28.0、18.4、12.3、7.5');
}

// ---------- 第 5 站：一代一代乘下去（动图） ----------
function genA() {
  const M = CH.map((r) => r.map((v) => v / 100));
  const step = (v) => [0, 1, 2, 3, 4].map((k) => v.reduce((a, vp, p) => a + vp * M[p][k], 0));
  const G = 6, lines = [];
  for (const s of [0, 4]) {
    let v = [0, 0, 0, 0, 0]; v[s] = 1;
    const seq = [];
    for (let g = 1; g <= G; g++) { v = step(v); seq.push(v.map((x) => 100 * x)); }
    lines.push(seq);
  }
  // 时间：第 1 代和最后一代停久一点
  const hold = [2.6, 1.5, 1.5, 1.5, 1.5, 2.6], T = hold.reduce((a, b) => a + b, 0);
  const kt = []; let acc = 0;
  for (const h of hold) { kt.push(acc / T); acc += h; }
  let o = '';
  const sy = lin(0, 40, 0, 84), bw = 28, gap = 8;
  const group = (gi, y0, title) => {
    o += text(30, y0 - 100, title, 'tb');
    const yb = y0;
    o += line(30, yb, 30 + 5 * (bw + gap), yb, 'axis');
    o += line(26, yb - sy(20), 34 + 5 * (bw + gap), yb - sy(20), 'dash') + text(38 + 5 * (bw + gap), yb - sy(20) + 4, '20%', 'ts');
    for (let k = 0; k < 5; k++) {
      const x = 34 + k * (bw + gap);
      const hs = lines[gi].map((v) => sy(v[k]));
      o += `<rect x="${x}" y="${f1(yb - hs[0])}" width="${bw}" height="${f1(hs[0])}" class="${k === 4 ? 'solid' : k === 0 ? 'wash-strong' : 'wash'}">${anim('y', hs.map((h) => f1(yb - h)), kt, T, true)}${anim('height', hs.map(f1), kt, T, true)}</rect>`;
      o += text(x + bw / 2, yb + 15, 'Q' + (k + 1), 'ts', 'middle');
      lines[gi].forEach((v, g) => {
        o += `<text x="${f1(x + bw / 2)}" y="${f1(yb + 31)}" class="t" text-anchor="middle" opacity="${g === 0 ? 1 : 0}">${v[k].toFixed(1)}${ashow(lines[gi].map((_, j) => j === g), kt, T)}</text>`;
      });
    }
  };
  group(0, 132, '起点：一家在 Q1');
  group(1, 296, '起点：一家在 Q5');
  // 代数
  for (let g = 0; g < G; g++) {
    const lab = g === 0 ? '第 1 代：孩子（表里的那一行）' : g === 1 ? '第 2 代：孙辈' : '第 ' + (g + 1) + ' 代';
    o += `<text x="330" y="22" class="tl" text-anchor="start" opacity="${g === 0 ? 1 : 0}">${lab}${ashow([...Array(G)].map((_, j) => j === g), kt, T)}</text>`;
  }
  // 右：落在 Q5 的比例
  const px = lin(1, 6, 350, 530), py = lin(0, 40, 250, 70);
  o += axes({ sx: px, sy: py, x0: 1, x1: 6, y0: 0, y1: 40, xt: [1, 2, 3, 4, 5, 6], yt: [0, 10, 20, 30, 40], xl: '第几代' });
  o += text(330, 52, '这一支里落在 Q5 的比例（%）', 'ts');
  o += line(px(1), py(20), px(6), py(20), 'grid');
  const q5 = lines.map((seq) => seq.map((v) => v[4]));
  o += path(d(q5[1].map((v, g) => [px(g + 1), py(v)])), 'ln') + path(d(q5[0].map((v, g) => [px(g + 1), py(v)])), 'ink');
  o += text(px(1) + 8, py(q5[1][0]) + 4, q5[1][0].toFixed(1) + '　Q5 出身', 'ts');
  o += text(px(1) + 8, py(q5[0][0]) + 4, q5[0][0].toFixed(1) + '　Q1 出身', 'ts');
  for (const [seq, cls] of [[q5[1], 'ln-f'], [q5[0], 'ink-f']]) {
    o += `<circle cx="${f1(px(1))}" cy="${f1(py(seq[0]))}" r="5" class="${cls}">${anim('cx', seq.map((_, g) => f1(px(g + 1))), kt, T, true)}${anim('cy', seq.map((v) => f1(py(v))), kt, T, true)}</circle>`;
  }
  const gaps = q5[1].map((v, g) => v - q5[0][g]);
  o += text(440, 318, '两支的差距：' + gaps.slice(0, 4).map((v) => v.toFixed(1)).join(' → ') + ' …', 'ts', 'middle');
  return svgA(560, 330, o, '动图：用 US 的 mobility table 一代一代乘下去。从 Q1 出发的一支，第 1 代 33.7% 在 Q1；从 Q5 出发的一支，第 1 代 36.5% 在 Q5；几代之后两支都趋向每个 quintile 20%，右边曲线显示落在 Q5 的比例的差距从 29.0 缩到 9.5、3.1、1.0');
}

// ---------- 第 6 站：EIP 下的一次 resale ----------
function eip() {
  // 100 户：Chinese 87、Malay 9、Indian 与 Others 4，用固定的伪随机顺序排进 10 层 × 10 户
  const units = [...Array(87).fill('C'), ...Array(9).fill('M'), ...Array(4).fill('I')];
  let s = 7;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let i = units.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [units[i], units[j]] = [units[j], units[i]]; }
  // 卖家放在最右一列（第 6 层），连线不用穿过别的 flat
  const SELL = 5 * 10 + 9;
  if (units[SELL] !== 'M') { const k = units.findIndex((u, i) => u === 'M' && i % 10 !== 9); [units[SELL], units[k]] = [units[k], units[SELL]]; }
  const cw = 22, ch = 15, X0 = 20, Y0 = 40;
  let o = text(X0 + 5 * cw, 22, '一栋 100 户的 block', 'tb', 'middle');
  o += poly([[X0 - 6, Y0], [X0 + 10 * cw + 6, Y0], [X0 + 10 * cw, Y0 - 8], [X0, Y0 - 8]], 'wash2');
  const seller = SELL;
  units.forEach((u, i) => {
    const r = Math.floor(i / 10), c = i % 10, x = X0 + c * cw, y = Y0 + r * ch;
    o += rect(x, y, cw, ch, u === 'M' ? 'solid' : u === 'I' ? 'band-n' : 'wash') + rect(x, y, cw, ch, 'frame');
    o += text(x + cw / 2, y + 11.5, u, u === 'M' ? 'tw' : 'ts', 'middle');
  });
  const sxp = X0 + (seller % 10) * cw, syp = Y0 + Math.floor(seller / 10) * ch;
  o += rect(sxp - 1.5, syp - 1.5, cw + 3, ch + 3, 'ink-b');
  o += rect(X0 - 6, Y0 + 10 * ch, 10 * cw + 12, 4, 'solid2');
  const yl = Y0 + 10 * ch + 24;
  o += text(X0, yl, 'C：Chinese 87 户，已到 block limit 87%', 'ts');
  o += text(X0, yl + 17, 'M：Malay 9 户（block limit 25%）', 'ts');
  o += text(X0, yl + 34, 'I：Indian 与 Others 4 户（block limit 15%）', 'ts');
  // 右：卖给谁
  const SX = 252, SY = 128;
  o += rect(SX, SY - 16, 56, 32, 'solid', 5) + text(SX + 28, SY - 1, 'Malay', 'tw', 'middle') + text(SX + 28, SY + 12, '屋主', 'tw', 'middle');
  o += line(sxp + cw + 2, syp + ch / 2, SX - 4, SY, 'mute');
  const buyers = [['Chinese 买家', '不批：Chinese 会到 88 户，超过 87%', '', 40, false], ['Malay 买家', '可以：block 的组成不变', '', 112, true], ['Indian 买家', '可以：Malay 变 8 户、Indian 与 Others', '变 5 户，都没到 limit', 184, true]];
  for (const [b, r1, r2, y, ok] of buyers) {
    o += arrow(SX + 58, SY, 328, y + 12, ok ? 'ink' : 'dash', 6);
    o += rect(330, y, 96, 24, 'paper', 5) + text(378, y + 17, b, 't', 'middle');
    o += text(330, y + 42, r1, ok ? 'ts' : 'tl') + (r2 ? text(330, y + 58, r2, 'ts') : '');
  }
  return svg(560, yl + 42, o, '一栋 100 户的 block，87 户 Chinese、9 户 Malay、4 户 Indian 与 Others；一户 Malay 屋主卖给 Chinese 买家不获批准，卖给 Malay 或 Indian 买家可以');
}

// ---------- 第 7 站：两个 occupation 的 pay gap 拆分（数字是为页面造的） ----------
const OCC = {
  men: { share: [0.6, 0.4], pay: [8000, 4000] },
  women: { share: [0.3, 0.7], pay: [7600, 3800] },
};
function gapdecomp() {
  const avg = (sh, pay) => sh[0] * pay[0] + sh[1] * pay[1];
  const M = avg(OCC.men.share, OCC.men.pay), W = avg(OCC.women.share, OCC.women.pay);
  const C = avg(OCC.men.share, OCC.women.pay); // women 换上 men 的分布
  const raw = (100 * (M - W)) / M, within = (100 * (M - C)) / M, comp = raw - within;
  const X0 = 150, BW = 280, H = 30;
  let o = '';
  const bar = (y, name, sub, sh, pay, av, cls2) => {
    o += text(X0 - 10, y + 13, name, 'tb', 'end') + (sub ? text(X0 - 10, y + 27, sub, 'ts', 'end') : '');
    const w0 = BW * sh[0];
    o += rect(X0, y, w0, H, 'solid') + rect(X0 + w0, y, BW - w0, H, 'wash');
    o += rect(X0, y, BW, H, cls2);
    o += text(X0 + w0 / 2, y + 13, 'Manager ' + Math.round(100 * sh[0]) + '%', 'tw', 'middle') + text(X0 + w0 / 2, y + 26, 'S$' + pay[0].toLocaleString('en-US'), 'tw', 'middle');
    o += text(X0 + w0 + (BW - w0) / 2, y + 13, 'Clerk ' + Math.round(100 * sh[1]) + '%', 't', 'middle') + text(X0 + w0 + (BW - w0) / 2, y + 26, 'S$' + pay[1].toLocaleString('en-US'), 'ts', 'middle');
    o += text(X0 + BW + 12, y + 13, '平均', 'ts') + text(X0 + BW + 12, y + 28, 'S$' + av.toLocaleString('en-US'), 'tb');
  };
  o += text(X0 + BW / 2, 14, '人数按比例画；每一段里写的是这个 occupation 的 pay', 'ts', 'middle');
  bar(26, 'Men', '', OCC.men.share, OCC.men.pay, M, 'frame');
  bar(70, 'Women', '', OCC.women.share, OCC.women.pay, W, 'frame');
  bar(124, 'Women', '换上 men 的分布', OCC.men.share, OCC.women.pay, C, 'dash');
  o += text(X0 + BW + 12, 172, '只比 men 低 ' + within.toFixed(1) + '%', 'ts');
  // 下：gap 的拆分
  const sx = lin(0, 25, X0, X0 + BW), Y = 206;
  o += text(X0 - 10, Y + 15, 'Raw gap', 'tb', 'end') + text(X0 - 10, Y + 29, raw.toFixed(1) + '%', 'ts', 'end');
  o += rect(sx(0), Y, sx(comp) - sx(0), 22, 'wash-strong') + rect(sx(comp), Y, sx(raw) - sx(comp), 22, 'solid');
  o += rect(sx(0), Y, sx(raw) - sx(0), 22, 'frame');
  o += text((sx(0) + sx(comp)) / 2, Y + 15, 'composition ' + comp.toFixed(1), 't', 'middle');
  o += text(sx(raw) + 8, Y + 15, '← within-occupation ' + within.toFixed(1), 'ts');
  for (const v of [0, 5, 10, 15, 20, 25]) o += line(sx(v), Y + 26, sx(v), Y + 30, 'axis') + text(sx(v), Y + 43, v + '%', 'ts', 'middle');
  o += line(sx(0), Y + 26, sx(25), Y + 26, 'axis');
  return svg(560, Y + 50, o, '两个 occupation 的例子：men 60% 是 manager，平均 6400；women 30% 是 manager，平均 4940；women 换上 men 的分布后平均 6080；raw gap 22.8% 拆成 composition 17.8 与 within-occupation 5.0');
}

// ---------- 第 7 站：Correll et al. (2007) 的 audit study ----------
// Table 6：callback 数 / 职位数
const CORRELL = [['Mother', 10, 320], ['没有孩子的 woman', 21, 320], ['Father', 16, 318], ['没有孩子的 man', 9, 318]];
function correll() {
  let o = '';
  // 左：一对履历，只差一行
  const card = (x, y, hl) => {
    o += rect(x, y, 104, 132, 'paper', 4);
    for (let k = 0; k < 7; k++) {
      const yy = y + 16 + k * 16, w = [70, 84, 60, 80, 76, 66, 50][k];
      if (k === 4) o += rect(x + 8, yy - 6, 88, 13, 'wash-strong', 2) + text(x + 52, yy + 4, hl, 'ts', 'middle');
      else o += rect(x + 10, yy - 2, w, 5, 'wash2', 2);
    }
  };
  o += text(118, 14, '同一个职位收到的两份履历', 'tb', 'middle');
  card(10, 26, 'PTA officer'); card(124, 26, 'alumni officer');
  o += text(62, 176, '带 parent 信号', 'ts', 'middle') + text(176, 176, '不带', 'ts', 'middle');
  o += text(118, 196, '其余经历、学历相当；', 'ts', 'middle') + text(118, 211, 'cover letter 里一份提到家人', 'ts', 'middle');
  // 右：callback
  const sx = lin(0, 8, 360, 548);
  o += text(454, 14, 'Callback 的比例', 'tb', 'middle');
  CORRELL.forEach(([lab, k, n], i) => {
    const v = (100 * k) / n, y = 32 + i * 40 + (i >= 2 ? 14 : 0);
    o += text(352, y + 15, lab, 't', 'end');
    o += rect(sx(0), y, sx(v) - sx(0), 22, i % 2 === 0 ? 'solid' : 'wash-strong');
    o += text(sx(v) + 6, y + 15, v.toFixed(1) + '%', 'tb') ;
    o += text(sx(v) + 6, y + 29, k + '/' + n, 'ts');
  });
  o += line(sx(0), 26, sx(0), 210, 'axis');
  o += text(454, 226, 'Women 一对：差别 significant', 'ts', 'middle') + text(454, 242, 'Men 一对：差别不 significant', 'ts', 'middle');
  return svg(560, 248, o, 'Correll 等人 2007 年的 audit study：两份只差 parent 信号的履历；mother 的 callback 是 3.1%，没有孩子的 woman 6.6%，father 5.0%，没有孩子的 man 2.8%');
}

// ---------- 第 9 站：Chapel Hill 研究的结构 ----------
function agenda() {
  let o = '';
  const box = (x, y, w, h, l1, l2, l3) => {
    o += rect(x, y, w, h, 'paper', 6) + text(x + w / 2, y + 20, l1, 'tb', 'middle');
    if (l2) o += text(x + w / 2, y + 37, l2, 'ts', 'middle');
    if (l3) o += text(x + w / 2, y + 52, l3, 'ts', 'middle');
  };
  box(10, 10, 170, 62, '9 个 media', '5 份报纸、2 份周刊、2 家电视', '9 月 12 日到 10 月 6 日');
  box(380, 10, 170, 62, '100 个 undecided voter', '五个选区随机抽', '9 月 18 日到 10 月 6 日访问');
  o += arrow(95, 74, 160, 112, 'mute', 6) + text(60, 100, 'content analysis', 'ts', 'middle');
  o += arrow(465, 74, 400, 112, 'mute', 6) + text(505, 100, '“最该关注的两三件事”', 'ts', 'middle');
  // 中：issue 表
  const X = 155, Y = 116, RW = 250, RH = 22;
  o += rect(X, Y, RW, RH, 'wash2') + text(X + 45, Y + 15, 'Issue', 'tb', 'middle') + text(X + 130, Y + 15, '报道份额', 'tb', 'middle') + text(X + 210, Y + 15, 'voter 份额', 'tb', 'middle');
  const rows = ['issue 1', 'issue 2', 'issue 3', '…', 'issue k'];
  rows.forEach((r, i) => {
    const y = Y + RH * (i + 1);
    o += rect(X, y, RW, RH, 'frame') + text(X + 45, y + 15, r, 't', 'middle');
    if (r !== '…') o += rect(X + 110, y + 8, 40, 6, 'solid', 2) + rect(X + 190, y + 8, 40, 6, 'wash-strong', 2);
  });
  o += line(X + 90, Y, X + 90, Y + RH * 6, 'frame') + line(X + 170, Y, X + 170, Y + RH * 6, 'frame');
  o += rect(X, Y, RW, RH * 6, 'frame');
  const yb = Y + RH * 6;
  o += text(X + RW / 2, yb + 20, '在行之间算 correlation：major +.967，minor +.979', 'tl', 'middle');
  o += text(X + RW / 2, yb + 38, '每一行是一个 issue，不是一个人', 'ts', 'middle');
  // 没有做的一步
  o += rect(60, yb + 52, 440, 26, 'dash', 6) + text(280, yb + 70, '没有做的一步：把每个 voter 自己的 agenda 和他自己看的 media 配对', 'ts', 'middle');
  return svg(560, yb + 82, o, 'Chapel Hill 研究：一边对 9 个 media 做 content analysis，一边访问 100 个 undecided voter，两边按同一套 issue category 算份额，在 issue 之间算 correlation');
}

// ---------- 第 9 站：Table 3，agenda-setting 对 selective perception ----------
// McCombs & Shaw (1972) Table 3：[media, group, major-all, major-own, minor-all, minor-own]
const MS3 = [
  ['NYT', 'D', .89, .79, .97, .85], ['NYT', 'R', .80, .40, .88, .98], ['NYT', 'W', .89, .25, .78, -.53],
  ['DMH', 'D', .84, .74, .95, .83], ['DMH', 'R', .59, .88, .84, .69], ['DMH', 'W', .82, .76, .79, .00],
  ['CBS', 'D', .83, .83, .81, .71], ['CBS', 'R', .50, .00, .57, .40], ['CBS', 'W', .78, .80, .86, .76],
  ['NBC', 'D', .57, .76, .64, .73], ['NBC', 'R', .27, .13, .66, .63], ['NBC', 'W', .84, .21, .48, -.33],
];
function selective() {
  const pts = [];
  for (const r of MS3) { pts.push([r[3], r[2], 'major', r[0] + ' ' + r[1]]); pts.push([r[5], r[4], 'minor', r[0] + ' ' + r[1]]); }
  const above = pts.filter((p) => p[1] > p[0]).length, tie = pts.filter((p) => p[1] === p[0]).length, below = pts.length - above - tie;
  const sx = lin(-0.6, 1, 70, 330), sy = lin(0, 1, 290, 30);
  let o = axes({ sx, sy, x0: -0.6, x1: 1, y0: 0, y1: 1, xt: [-0.5, 0, 0.5, 1], yt: [0, 0.25, 0.5, 0.75, 1], xl: '和“本党候选人新闻”的 correlation', grid: true });
  o += text(70, 18, '和“全部新闻”的 correlation', 'ts');
  o += line(sx(0), sy(0), sx(1), sy(1), 'dash');
  o += text(sx(0.12), sy(0.02) - 6, 'y = x', 'ts');
  for (const [x, y, k] of pts) o += k === 'major' ? circle(sx(x), sy(y), 4.5, 'ln-f') : rect(sx(x) - 4, sy(y) - 4, 8, 8, 'paper');
  // 右栏说明
  const X = 360;
  o += circle(X + 6, 60, 4.5, 'ln-f') + text(X + 18, 64, 'major 报道', 't');
  o += rect(X + 2, 78, 8, 8, 'paper') + text(X + 18, 86, 'minor 报道', 't');
  o += text(X, 120, '对角线以上：' + above + ' 对', 'tl');
  o += text(X, 138, '和全部新闻更一致', 'ts');
  o += text(X, 166, '正好在线上：' + tie + ' 对', 't');
  o += text(X, 184, '（CBS、D 组、major）', 'ts');
  o += text(X, 212, '对角线以下：' + below + ' 对', 't');
  o += text(X, 230, '和本党新闻更一致', 'ts');
  o += text(X, 262, 'D、R、W：偏 Humphrey、', 'ts') + text(X, 278, 'Nixon、Wallace 的三组', 'ts');
  return svg(560, 330, o, 'McCombs 与 Shaw 1972 年 Table 3 的 24 对 correlation 的散点图：' + above + ' 对在对角线以上，' + tie + ' 对相等，' + below + ' 对在以下');
}

// ---------- 第 3 站：Garfinkel 式的 breaching experiment（tic-tac-toe） ----------
function breach() {
  let o = '';
  const S = 40;
  const board = (x0, y0, title, sub) => {
    o += text(x0 + 1.5 * S, y0 - 30, title, 'tb', 'middle') + text(x0 + 1.5 * S, y0 - 13, sub, 'ts', 'middle');
    for (let k = 1; k <= 2; k++) o += line(x0 + k * S, y0, x0 + k * S, y0 + 3 * S, 'ink-b') + line(x0, y0 + k * S, x0 + 3 * S, y0 + k * S, 'ink-b');
    const X = (cx, cy, cls) => { o += line(cx - 11, cy - 11, cx + 11, cy + 11, cls) + line(cx - 11, cy + 11, cx + 11, cy - 11, cls); };
    const O = (cx, cy) => { o += circle(cx, cy, 12, 'ink'); };
    const c = (i) => x0 + (i + 0.5) * S, r = (j) => y0 + (j + 0.5) * S;
    O(c(0), r(0)); X(c(1), r(1), 'ink'); O(c(2), r(0));
    return { X, c, r };
  };
  const L = board(40, 60, '对手预期的一步', 'X 画进一个空格');
  L.X(L.c(1), L.r(0), 'ln');
  const R = board(250, 60, '实验者走的一步', 'X 画在两条格线的交点上');
  R.X(250 + 2 * S, 60 + S, 'ln');
  o += circle(250 + 2 * S, 60 + S, 19, 'ln-dash');
  // 右栏：对手的反应
  const X = 440;
  o += text(X, 72, '对手的反应', 'tb');
  o += text(X, 94, '困惑，甚至生气：', 'ts') + text(X, 110, '“你这是干什么？”', 'ts');
  o += text(X, 142, '规则书里没有一条', 'ts') + text(X, 158, '写着 X 必须画进格子', 'ts');
  o += text(X, 190, 'Sanction 出现了，', 'tl') + text(X, 206, 'norm 才被看见', 'tl');
  o += line(422, 40, 422, 214, 'grid');
  return svg(560, 222, o, '两个 tic-tac-toe 棋盘：左边 X 画在一个空格里，是对手预期的一步；右边 X 画在两条格线的交点上，规则里没有禁止，对手却困惑甚至生气');
}

// ---------- 第 3 站：在家最常说的语言，2010 与 2020（动图） ----------
// Census of Population 2020 Statistical Release 1，Key Indicators 与 Chart 4.5
const HOMELANG = [
  ['Chinese', [['English', 32.6, 47.6, 'solid'], ['Mandarin', 47.7, 40.2, 'wash-strong'], ['dialects', 19.2, 11.8, 'wash'], ['', 0.5, 0.4, 'wash2']]],
  ['Malay', [['English', 17.0, 39.0, 'solid'], ['Malay', 82.7, 60.7, 'wash-strong'], ['', 0.3, 0.3, 'wash2']]],
  ['Indian', [['English', 41.6, 59.2, 'solid'], ['Tamil', 36.7, 27.4, 'wash-strong'], ['其他', 21.7, 13.4, 'wash2']]],
];
function homelangA() {
  const sx = lin(0, 100, 100, 540);
  const hold = 2.8, move = 1.4, T = 2 * hold + 2 * move;
  const kt = [0, hold / T, (hold + move) / T, (2 * hold + move) / T, 1];
  // 文字的切换时刻放在移动的中点
  const ktT = [0, (hold + move / 2) / T, (2 * hold + 1.5 * move) / T, 1];
  let o = '';
  o += `<text x="100" y="22" class="tbig" text-anchor="start">2010${ashow([true, false, true, true].map((v, i) => i !== 1), ktT, T)}</text>`;
  o += `<text x="100" y="22" class="tbig" text-anchor="start" opacity="0">2020${ashow([false, true, false, false], ktT, T)}</text>`;
  o += text(180, 20, '5 岁以上 resident，在家最常说哪种语言', 'ts');
  HOMELANG.forEach(([g, segs], i) => {
    const y = 48 + i * 62;
    o += text(90, y + 21, g, 'tb', 'end');
    let a10 = 0, a20 = 0;
    for (const [lab, v10, v20, cls] of segs) {
      const xs = [a10, a10, a20, a20, a10].map((v) => f1(sx(v)));
      const ws = [v10, v10, v20, v20, v10].map((v) => f1(sx(v) - sx(0)));
      o += `<rect x="${xs[0]}" y="${y}" width="${ws[0]}" height="32" class="${cls}">${anim('x', xs, kt, T)}${anim('width', ws, kt, T)}</rect>`;
      const tcls = cls === 'solid' ? 'tw' : 't';
      const lt = (v, a, on, first) => (v >= 9 ? `<text x="${f1(sx(a + v / 2))}" y="${y + 14}" class="${tcls}" text-anchor="middle"${first ? '' : ' opacity="0"'}>${lab}${ashow(on, ktT, T)}</text><text x="${f1(sx(a + v / 2))}" y="${y + 27}" class="${tcls}" text-anchor="middle"${first ? '' : ' opacity="0"'}>${v.toFixed(1)}%${ashow(on, ktT, T)}</text>` : '');
      o += lt(v10, a10, [true, false, true, true], true) + lt(v20, a20, [false, true, false, false], false);
      a10 += v10; a20 += v20;
    }
    // 2020 年 English 的位置，静态时也看得见
    const e20 = segs[0][2];
    o += line(sx(e20), y - 9, sx(e20), y - 1, 'ln') + line(sx(e20), y + 33, sx(e20), y + 41, 'ln') + text(sx(e20) + 5, y - 4, '2020：' + e20.toFixed(1) + '%', 'ts');
  });
  o += text(100, 246, '全体 resident：English 32.3% → 48.3%。条上下的短线标出 2020 年 English 到达的位置。', 'ts');
  o += text(100, 263, '最常说 English 的人里，超过 80% 在家也说一种 vernacular language。', 'ts');
  return svgA(560, 270, o, '动图：Chinese、Malay、Indian 三组 resident 在家最常说的语言，从 2010 年变到 2020 年。English 的份额分别从 32.6% 到 47.6%、17.0% 到 39.0%、41.6% 到 59.2%');
}

// ---------- 第 9 站：citizen 的 age structure，往前走五年（动图） ----------
// Population in Brief 2025，附表 2（2025 年 6 月，千人）
const PIB_M = [81.3, 93.6, 95.2, 96.8, 103.3, 119.8, 131.7, 125.2, 117.3, 112.6, 122.6, 122.3, 134.2, 126.3, 98.4, 67.3, 30.3, 17.6, 8.3];
const PIB_F = [76.8, 89.3, 89.8, 92.3, 96.3, 110.7, 125.9, 125.0, 122.0, 121.0, 131.0, 129.3, 138.2, 132.5, 107.5, 80.2, 41.8, 28.4, 18.4];
const PIB_T = [158.1, 182.9, 185.0, 189.1, 199.5, 230.5, 257.5, 250.2, 239.3, 233.6, 253.6, 251.7, 272.4, 258.8, 205.9, 147.5, 72.1, 46.1, 26.7];
const AGES = ['0–4', '5–9', '10–14', '15–19', '20–24', '25–29', '30–34', '35–39', '40–44', '45–49', '50–54', '55–59', '60–64', '65–69', '70–74', '75–79', '80–84', '85–89', '90+'];
function pyramidA() {
  const n = AGES.length, RH = 13, Y0 = 40, CX = 190, G = 22;
  const yRow = (i) => Y0 + (n - 1 - i) * RH; // i=0 在最下面
  const sw = lin(0, 140, 0, 125);
  const hold = 3.2, move = 1.8, T = 2 * hold + move;
  const kt = [0, hold / T, (hold + move) / T, 1];
  const show25 = [true, false, false], show30 = [false, true, true];
  const ktS = [0, (hold + move * 0.5) / T, 1];
  const tot = PIB_T;
  const sum = (a, b) => tot.slice(a, b).reduce((s, v) => s + v, 0);
  const w25 = sum(4, 13), o25 = sum(13, n), w30 = sum(3, 12), o30 = sum(12, n);
  let o = '';
  o += text(CX, 16, '2025 年 6 月的 citizen（千人）', 'tb', 'middle');
  o += text(CX - G - 4, 32, 'Men', 'ts', 'end') + text(CX + G + 4, 32, 'Women', 'ts', 'start');
  for (let i = 0; i < n; i++) o += text(CX, yRow(i) + 10, AGES[i], 'ts', 'middle');
  // 65 岁的线
  const y65 = yRow(13) + RH;
  o += line(CX - G - 128, y65, CX + G + 128, y65, 'dash') + text(CX - G - 130, y65 - 3, '65 岁', 'ts', 'end');
  const y20 = yRow(4) + RH;
  o += line(CX - G - 128, y20, CX + G + 128, y20, 'grid') + text(CX - G - 130, y20 - 3, '20 岁', 'ts', 'end');
  for (let i = 0; i < n; i++) {
    const cls = i === 12 ? 'solid' : i >= 13 ? 'band-n' : i >= 4 ? 'wash-strong' : 'wash';
    const ys = [yRow(i), yRow(i), yRow(Math.min(i + 1, n - 1)), yRow(Math.min(i + 1, n - 1))].map((v) => f1(v + 1));
    for (const [arr, side] of [[PIB_M, -1], [PIB_F, 1]]) {
      let v0 = arr[i], v1 = arr[i];
      if (i === n - 2) v1 = arr[i] + arr[i + 1]; // 85–89 走进 90+，与原来的 90+ 合并（不计死亡）
      const ws = [v0, v0, v1, v1].map((v) => f1(sw(v)));
      const xs = side < 0 ? [v0, v0, v1, v1].map((v) => f1(CX - G - sw(v))) : [CX + G, CX + G, CX + G, CX + G].map(f1);
      const op = i === n - 1 ? `opacity="1"` : '';
      o += `<rect x="${xs[0]}" y="${ys[0]}" width="${ws[0]}" height="${RH - 2}" class="${cls}" ${op}>${anim('y', ys, kt, T)}${anim('width', ws, kt, T)}${side < 0 ? anim('x', xs, kt, T) : ''}${i === n - 1 ? anim('opacity', [1, 1, 0, 0], kt, T, true) : ''}</rect>`;
    }
  }
  // 2030 年 0–4 岁那一格：还没出生
  o += `<g opacity="0">${rect(CX - G - 80, yRow(0) + 1, 80, RH - 2, 'dash')}${rect(CX + G, yRow(0) + 1, 80, RH - 2, 'dash')}${text(CX - G - 86, yRow(0) + 10, '2025–30 年出生', 'ts', 'end')}${ashow(show30, ktS, T)}</g>`;
  // 右栏
  const X = 384;
  o += `<text x="${X}" y="60" class="tl">2025 年${ashow(show25, ktS, T)}</text>`;
  o += `<g opacity="0"><text x="${X}" y="60" class="tl">五年之后</text><text x="${X + 64}" y="60" class="ts">不计死亡与新 citizen</text>${ashow(show30, ktS, T)}</g>`;
  const panel = (w, ov, on, first) => {
    const op = first ? '' : ' opacity="0"';
    const sh = ashow(on, ktS, T);
    return `<g${op}>${text(X, 88, '20–64 岁：' + w.toFixed(1), 't')}${text(X, 108, '65 岁以上：' + ov.toFixed(1), 't')}${text(X, 134, 'OASR = ' + w.toFixed(1) + ' ÷ ' + ov.toFixed(1), 't')}${text(X, 156, '= ' + (w / ov).toFixed(2), 'tbig')}${sh}</g>`;
  };
  o += panel(w25, o25, show25, true);
  o += panel(w30, o30, show30, false);
  o += text(X, 196, '深色一格是 60–64 岁：', 'ts') + text(X, 212, '272.4 千人，全表最大，', 'ts') + text(X, 228, '五年之内全部越过 65 岁', 'ts');
  o += text(X, 258, '官方 projection（2030）：2.4', 'ts') + text(X, 274, '死亡和新 citizen 都把比往上推', 'ts');
  return svgA(560, Y0 + n * RH + 14, o, '动图：2025 年 Singapore citizen 的 age pyramid，每一格往上移一格代表五年过去。OASR 从 2188.3 除以 757.1 等于 2.89，变成 2105.0 除以 1029.5 等于 2.04（不计死亡与新 citizen）');
}

// ---------- 第 9 站：age effect 还是 cohort effect ----------
// Census 2020 SR1 Chart 4.6：Chinese resident 在家最常说 English 的比例
const ENG_CH = { y2010: [51.9, 40.7, 29.4, 34.4, 31.5, 19.2], y2020: [77.4, 69.2, 53.7, 48.4, 43.9, 29.0] };
function cohort() {
  const lab = ['5–14', '15–24', '25–34', '35–44', '45–54', '55+'];
  const sx = (k) => 80 + k * 80, sy = lin(0, 80, 270, 40);
  let o = axes({ sx: lin(0, 5, 80, 480), sy, x0: 0, x1: 5, y0: 0, y1: 80, xt: lab.map((l, k) => [k, l]), yt: [0, 20, 40, 60, 80].map((v) => [v, v + '%']), xl: '当年的 age group', grid: true });
  o += text(40, 22, 'Chinese resident 在家最常说 English 的比例', 'tb');
  o += path(d(ENG_CH.y2010.map((v, k) => [sx(k), sy(v)])), 'mute') + path(d(ENG_CH.y2020.map((v, k) => [sx(k), sy(v)])), 'ln');
  // 同一批人：2010 年第 k 组 → 2020 年第 k+1 组
  for (let k = 0; k < 4; k++) {
    const x1 = sx(k), y1 = sy(ENG_CH.y2010[k]), x2 = sx(k + 1), y2 = sy(ENG_CH.y2020[k + 1]);
    const a = Math.atan2(y2 - y1, x2 - x1), r = 7;
    o += arrow(x1 + r * Math.cos(a), y1 + r * Math.sin(a), x2 - r * Math.cos(a), y2 - r * Math.sin(a), 'ink', 6);
  }
  ENG_CH.y2010.forEach((v, k) => { o += circle(sx(k), sy(v), 4, 'paper') + text(sx(k), sy(v) + 18, v.toFixed(1), 'ts', 'middle'); });
  ENG_CH.y2020.forEach((v, k) => { o += circle(sx(k), sy(v), 4.5, 'ln-f') + text(sx(k) + (k === 0 ? 10 : 0), sy(v) - 10, v.toFixed(1), 'tl', k === 0 ? 'start' : 'middle'); });
  o += text(480, 70, '2020 年', 'tl', 'end') + text(118, 164, '2010 年', 'ts', 'middle');
  o += text(290, 330, '箭头连起同一批人：十年后每一批都更常说 English，没有一批随着变老而减少', 'ts', 'middle');
  return svg(560, 338, o, '两条折线：2010 年与 2020 年 Chinese resident 按 age group 在家最常说 English 的比例；箭头把 2010 年的每个 age group 连到 2020 年大十岁的那一组，每一支箭头都向上');
}

// ---------- 第 9 站：Singapore 按 age 分配的规则 ----------
function agerules() {
  const sx = lin(0, 80, 30, 540), Y = 118;
  let o = '';
  o += line(sx(0), Y, sx(80), Y, 'ink-b');
  for (let a = 0; a <= 80; a += 10) o += line(sx(a), Y - 4, sx(a), Y + 4, 'axis') + text(sx(a), Y + 20, String(a), 'ts', 'middle');
  // CPF 的两个 band（2026 年起）
  o += rect(sx(55), Y - 16, sx(60) - sx(55), 12, 'wash-strong') + rect(sx(60), Y - 16, sx(65) - sx(60), 12, 'wash');
  // 上方：住房与 CPF
  const up = (a, y, l1, l2, cls = 'ts') => { o += line(sx(a), Y - 6, sx(a), y + 6, 'mute') + text(sx(a), y - 12, l1, 'tb', 'middle') + text(sx(a), y + 2, l2, cls, 'middle'); };
  up(21, 66, '21', 'HDB：couple 可以申请');
  up(35, 26, '35', 'HDB：单身可以申请');
  o += text(sx(60), 50, 'CPF total rate（2026 年起）', 'tb', 'middle') + text(sx(57.5), 70, '55–60：34%', 'ts', 'middle') + text(sx(62.5), 88, '60–65：25%', 'ts', 'middle');
  // 下方：retirement 与 re-employment
  const dn = (a0, a1, y, l1, l2) => {
    o += line(sx(a0), Y + 26, sx(a0), y - 14, 'mute') + circle(sx(a0), Y, 4, 'paper');
    o += circle(sx(a1), Y, 4.5, 'ln-f');
    o += text(sx(a0) - 6, y + 12, l1, 'tb', 'end') + text(sx(a0) - 6, y + 27, l2, 'ts', 'end');
  };
  dn(63, 64, 170, 'Retirement age 63 → 64', '之前不得因 age 解雇');
  dn(68, 69, 222, 'Re-employment age 68 → 69', '雇主须提供 re-employment 到这一年');
  o += text(sx(80), 268, '空心点是 2022 年起的规定，实心点是 2026 年起；目标是 2030 年 65 与 70', 'ts', 'end');
  o += line(sx(65), Y - 2, sx(65), Y + 2, 'ink');
  return svg(560, 276, o, '一条 0 到 80 岁的 age 轴：21 岁 couple 可申请 HDB，35 岁单身可申请；CPF 55 到 60 岁 total rate 34%，60 到 65 岁 25%；retirement age 从 63 到 64，re-employment age 从 68 到 69');
}

// ---------- 第 12 站：Hall 的 encoding/decoding ----------
function hall() {
  let o = '';
  o += rect(10, 30, 150, 110, 'paper', 8) + text(85, 52, 'Encoding', 'tb', 'middle');
  o += text(85, 72, '编辑、记者的', 'ts', 'middle') + text(85, 87, 'professional routine、', 'ts', 'middle') + text(85, 102, '对 audience 的假设', 'ts', 'middle') + text(85, 124, 'Preferred reading', 'tl', 'middle');
  o += arrow(162, 85, 196, 85, 'ink', 6);
  o += rect(198, 44, 150, 82, 'wash', 8) + text(273, 64, '同一条新闻', 'tb', 'middle') + text(273, 86, '“为了 national interest，', 'ts', 'middle') + text(273, 102, '今年的 wage 增长', 'ts', 'middle') + text(273, 118, '要放缓”', 'ts', 'middle');
  const rd = [['Dominant-hegemonic', '照着 preferred reading 读：', '“国家要紧，应该放缓”', 18], ['Negotiated', '大道理接受，局部另立规则：', '“道理对，我们这一行例外”', 100], ['Oppositional', 'national interest 一律读成', 'class interest', 182]];
  for (const [t, l1, l2, y] of rd) {
    o += arrow(350, 85, 384, y + 30, 'mute', 6);
    o += rect(386, y, 166, 64, 'paper', 6) + text(394, y + 19, t, 'tb') + text(394, y + 37, l1, 'ts') + text(394, y + 54, l2, 'ts');
  }
  o += text(180, 176, 'Decoding：audience 用自己的 code 读', 'tb', 'middle');
  o += text(180, 196, '编码与解码的 code 不必对称，', 'ts', 'middle') + text(180, 212, '没有哪一个 moment 能保证下一个', 'ts', 'middle');
  o += text(180, 240, '例子里的新闻是这一页造的；', 'ts', 'middle') + text(180, 256, 'oppositional 的读法是 Hall 自己的例子', 'ts', 'middle');
  return svg(560, 262, o, 'Hall 的 encoding/decoding：production 一端按 professional routine 编码出 preferred reading；同一条新闻被三种 audience 分别以 dominant-hegemonic、negotiated、oppositional 的方式解码');
}

// ---------- 第 12 站：Distinction Table 1 ----------
// [label, N, Blue Danube, Well-Tempered Clavier]
const DIST = {
  middle: [['None、CEP、CAP', 243, 64.0, 1.5], ['BEPC、bac', 289, 31.0, 5.0], ['Higher education', 46, 3.0, 21.0]],
  bac: [['Middle', 289, 31.0, 5.0], ['Upper', 107, 14.0, 3.0]],
  higher: [['Middle', 46, 3.0, 21.0], ['Upper', 325, 16.5, 19.0]],
};
function distinction() {
  let o = '';
  const sw = lin(0, 70, 0, 150);
  const bars = (x0, y0, rows) => {
    rows.forEach(([lab, n, bd, wtc], i) => {
      const y = y0 + i * 46;
      o += text(x0 + 104, y + 12, lab, 't', 'end') + text(x0 + 104, y + 27, 'N = ' + n, 'ts', 'end');
      o += rect(x0 + 112, y, sw(bd), 15, 'wash-strong') + text(x0 + 116 + sw(bd), y + 12, bd.toFixed(1), 'ts');
      o += rect(x0 + 112, y + 17, sw(wtc), 15, 'solid') + text(x0 + 116 + sw(wtc), y + 29, wtc.toFixed(1), 'tl');
    });
  };
  o += text(10, 18, 'Class 不变（middle class），education 变', 'tb');
  bars(0, 34, DIST.middle);
  o += line(282, 8, 282, 238, 'grid');
  o += text(292, 18, 'Education 不变，class 变', 'tb');
  o += text(292, 40, 'BEPC、bac', 'ts');
  bars(282, 48, DIST.bac);
  o += text(292, 152, 'Higher education', 'ts');
  bars(282, 160, DIST.higher);
  o += rect(10, 196, 14, 10, 'wash-strong') + text(30, 205, 'Blue Danube（popular taste）', 'ts');
  o += rect(10, 216, 14, 10, 'solid') + text(30, 225, 'Well-Tempered Clavier（legitimate taste）', 'ts');
  o += text(10, 252, '数字：每 100 人里把这首曲子列进最喜欢的三首的人数', 'ts');
  return svg(560, 260, o, 'Bourdieu Distinction Table 1 的两组比较：middle class 里 education 从低到高，Blue Danube 从 64 降到 3，Well-Tempered Clavier 从 1.5 升到 21；同样 education 下 middle 与 upper class 的差别小，方向也不一致');
}

export default {
  'sc1101e-suicide': suicide,
  'sc1101e-frame': frame,
  'sc1101e-select': select,
  'sc1101e-ecol': ecol,
  'sc1101e-lorenz': lorenz,
  'sc1101e-mobtable': mobtable,
  'sc1101e-q1row': q1row,
  'sc1101e-genA': genA,
  'sc1101e-eip': eip,
  'sc1101e-gapdecomp': gapdecomp,
  'sc1101e-correll': correll,
  'sc1101e-agenda': agenda,
  'sc1101e-selective': selective,
  'sc1101e-breach': breach,
  'sc1101e-homelangA': homelangA,
  'sc1101e-pyramidA': pyramidA,
  'sc1101e-cohort': cohort,
  'sc1101e-agerules': agerules,
  'sc1101e-hall': hall,
  'sc1101e-distinction': distinction,
};
