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
  o += text(300, 158, 'Singapore：1978–82 年出生的 son，本人 income 对父亲 income（MOF 2015）', 'ts', 'middle');
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
};
