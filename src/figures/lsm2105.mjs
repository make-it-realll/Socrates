import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, arrow, anim, apath, acircle, ashow, axes, curve, f1 } from '../lib/svg.mjs';

// ---------- 共用：序列与 genetic code ----------
const COMP = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A' };
const comp = (s) => [...s].map((c) => COMP[c]).join('');
const toRNA = (s) => s.replace(/T/g, 'U');
const B = 'UCAG';
const AA = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
const NAME = { F: 'Phe', L: 'Leu', S: 'Ser', Y: 'Tyr', C: 'Cys', W: 'Trp', P: 'Pro', H: 'His', Q: 'Gln', R: 'Arg', I: 'Ile', M: 'Met', T: 'Thr', N: 'Asn', K: 'Lys', V: 'Val', A: 'Ala', D: 'Asp', E: 'Glu', G: 'Gly', '*': 'stop' };
const codon = (c) => NAME[AA[B.indexOf(c[0]) * 16 + B.indexOf(c[1]) * 4 + B.indexOf(c[2])]];
export const GENE = 'ATGGCCAAGTTCGGATGCTAA'; // 贯穿第 1、2 站的 coding strand
const MRNA = toRNA(GENE);
const CODONS = MRNA.match(/.../g);

// 一个 group，只在第 k 帧（共 n 帧，按 kt 排）可见；第 0 帧是静态图
const frameG = (body, k, kt, T) => {
  const on = kt.map((_, i) => i === k);
  return `<g opacity="${k === 0 ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
};
const showOn = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// ---------- 第 1 站：double helix 拉直了看 ----------
function duplex() {
  const top = GENE.slice(0, 8), bot = comp(top);
  const x0 = 96, dx = 46, yT = 52, yB = 150;
  let o = '';
  o += line(x0 - 18, yT, x0 + dx * 7 + 18, yT, 'ink-b') + line(x0 - 18, yB, x0 + dx * 7 + 18, yB, 'ink-b');
  for (let i = 0; i < 8; i++) {
    const x = x0 + dx * i;
    o += circle(x, yT, 4, 'ink-f') + circle(x, yB, 4, 'ink-f');
    o += rect(x - 13, yT + 6, 26, 26, 'wash-strong', 4) + text(x, yT + 24, top[i], 'tb', 'middle');
    o += rect(x - 13, yB - 32, 26, 26, 'wash2', 4) + text(x, yB - 14, bot[i], 'tb', 'middle');
    const nH = 'GC'.includes(top[i]) ? 3 : 2;
    for (let h = 0; h < nH; h++) { const xx = x + (h - (nH - 1) / 2) * 6; o += line(xx, yT + 36, xx, yB - 36, 'dash'); }
  }
  o += text(x0 - 26, yT + 5, "5′", 'tl', 'end') + text(x0 + dx * 7 + 26, yT + 5, "3′", 'tl', 'start');
  o += text(x0 - 26, yB + 5, "3′", 'tl', 'end') + text(x0 + dx * 7 + 26, yB + 5, "5′", 'tl', 'start');
  o += arrow(x0 + 40, yT - 16, x0 + 160, yT - 16, 'mute') + text(x0 + 168, yT - 12, '这条 strand 从 5′ 读到 3′', 'ts', 'start');
  o += arrow(x0 + 160, yB + 18, x0 + 40, yB + 18, 'mute') + text(x0 + 168, yB + 22, '另一条反过来：antiparallel', 'ts', 'start');
  o += text(280, 196, '黑点和粗线是 sugar-phosphate backbone；方块是 base；虚线是 hydrogen bond（A–T 两根，G–C 三根）。', 'ts', 'middle');
  o += text(280, 214, '知道一条 strand，另一条就完全确定：上面是 ' + top + '，下面一定是 ' + bot + '。', 'ts', 'middle');
  return svg(560, 222, o, 'DNA double helix 拉直后的样子：两条 backbone 方向相反，base 两两配对，A 对 T，G 对 C');
}

// ---------- 第 1 站：Meselson–Stahl 三种 model 的预测 ----------
function meselson() {
  const models = [
    ['conservative', [[['H', 'H']], [['H', 'H'], ['L', 'L']], [['H', 'H'], ['L', 'L'], ['L', 'L'], ['L', 'L']]]],
    ['semi-conservative', [[['H', 'H']], [['H', 'L'], ['L', 'H']], [['H', 'L'], ['L', 'L'], ['L', 'H'], ['L', 'L']]]],
    ['dispersive', [[['H', 'H']], [['M2', 'M2'], ['M2', 'M2']], [['M4', 'M4'], ['M4', 'M4'], ['M4', 'M4'], ['M4', 'M4']]]],
  ];
  const heavyFrac = { H: 1, L: 0, M2: 0.5, M4: 0.25 };
  const rhoL = 1.710, rhoH = rhoL + 0.014; // Meselson & Stahl 1958：¹⁴N DNA 约 1.71，两者相差 0.014
  let o = '';
  const cols = [190, 310, 430];
  ['第 0 代（全在 ¹⁵N）', '换到 ¹⁴N 后第 1 代', '第 2 代'].forEach((s, j) => { o += text(cols[j] + 28, 22, s, 'tb', 'middle'); });
  models.forEach(([name, gens], r) => {
    const y0 = 40 + r * 118;
    if (r === 1) o += rect(4, y0 - 4, 552, 112, 'wash', 8);
    o += text(14, y0 + 44, name, 'tb', 'start');
    if (r === 1) o += text(14, y0 + 62, '实际看到的就是这一行', 'tl', 'start');
    gens.forEach((mols, j) => {
      const tx = cols[j] - 14, ty = y0, th = 100, tw = 22;
      o += rect(tx, ty, tw, th, 'paper', 8);
      const sy = lin(1.705, 1.729, ty + 10, ty + th - 10);
      // 每种 density 的 band，粗细按占的比例
      const bands = {};
      for (const m of mols) { const h = (heavyFrac[m[0]] + heavyFrac[m[1]]) / 2, rho = rhoL + (rhoH - rhoL) * h; bands[rho.toFixed(4)] = (bands[rho.toFixed(4)] || 0) + 1 / mols.length; }
      for (const [rho, fr] of Object.entries(bands)) { const hh = 2 + 7 * fr; o += rect(tx + 3, sy(+rho) - hh / 2, tw - 6, hh, 'solid', 1); }
      // 右边画出 molecule 本身：粗黑 = ¹⁵N strand，主题色 = ¹⁴N strand
      mols.forEach((m, k) => {
        const mx = cols[j] + 18, my = ty + 18 + k * 21;
        m.forEach((sKind, sIdx) => {
          const yy = my + sIdx * 6, L = 60;
          if (sKind === 'H') o += line(mx, yy, mx + L, yy, 'ink-b');
          else if (sKind === 'L') o += line(mx, yy, mx + L, yy, 'ln');
          else { const nseg = sKind === 'M2' ? 4 : 8; for (let q = 0; q < nseg; q++) { const heavy = sKind === 'M2' ? (q + sIdx) % 2 === 0 : (q + 2 * sIdx) % 4 === 0; o += line(mx + q * L / nseg, yy, mx + (q + 1) * L / nseg, yy, heavy ? 'ink-b' : 'ln'); } }
        });
      });
    });
  });
  o += text(14, 398, `Tube 里越往下 density 越大：¹⁴N DNA ${rhoL.toFixed(3)} g/cm³，¹⁵N DNA 重 ${(rhoH - rhoL).toFixed(3)}，即 ${rhoH.toFixed(3)}；hybrid 在正中 ${((rhoL + rhoH) / 2).toFixed(3)}。`, 'ts', 'start');
  o += text(14, 416, '黑线是 ¹⁵N 的 strand，彩色线是 ¹⁴N 的 strand；dispersive 的每条 strand 新旧混杂。', 'ts', 'start');
  return svg(560, 424, o, '三种 replication model 对 Meselson–Stahl 实验的预测：conservative 第 1 代就有 heavy 和 light 两条 band；semi-conservative 第 1 代只有 hybrid 一条，第 2 代 hybrid 和 light 各半；dispersive 始终一条 band 逐渐变轻');
}

// ---------- 第 1 站：replication fork（动图） ----------
function forkA() {
  const X0 = 40, XR = 540, yT = 70, yB = 172, yc = 121, gap = 7;
  const v = 40, F0 = 180, F1 = 470, Tm = (F1 - F0) / v, hold = 1.4, T = Tm + hold;
  const tOfF = (F) => (F - F0) / v; // 可以为负：在动画开始之前发生
  const Lsp = 78, vExt = 95, pl = 12;
  // 第 k 个 Okazaki fragment：primer 放在 p_k（5′ 端），向左延伸到 p_{k-1}
  const P = [70]; while (P[P.length - 1] + Lsp < F1 - 14) P.push(P[P.length - 1] + Lsp);
  const frags = P.map((p, k) => {
    const t0 = tOfF(p + 16), stop = k === 0 ? X0 : P[k - 1];
    const t1 = t0 + (p - pl - stop) / vExt;
    return { p, stop, t0, t1 };
  });
  frags.forEach((f, k) => { f.tRep = k + 1 < frags.length ? frags[k + 1].t1 + 0.35 : 1e9; });
  const cl = (t) => Math.min(Math.max(t, 0), T) / T;
  let o = '';
  // template strands（fork 跟着 F 走）
  const kF = [0, Tm / T, 1], Fs = [F0, F1, F1];
  const tplT = (F) => d([[X0, yT], [F - 34, yT], [F, yc - gap / 2 - 2], [XR, yc - gap / 2 - 2]]);
  const tplB = (F) => d([[X0, yB], [F - 34, yB], [F, yc + gap / 2 + 2], [XR, yc + gap / 2 + 2]]);
  o += apath(Fs.map(tplT), kF, T, 'ink') + apath(Fs.map(tplB), kF, T, 'ink');
  // leading strand：连续
  o += apath(Fs.map((F) => d([[X0, yT + 9], [F - 40, yT + 9]])), kF, T, 'ink-b');
  // lagging strand：一段一段
  for (const f of frags) {
    const kt = [0], xs = [];
    const xl = (t) => (t <= f.t0 ? f.p - pl : Math.max(f.stop, f.p - pl - (t - f.t0) * vExt));
    const times = [0, f.t0, f.t1, T].map((t) => Math.min(Math.max(t, 0), T));
    const uniq = [...new Set(times)].sort((a, b) => a - b);
    const kts = uniq.map((t) => t / T), ds = uniq.map((t) => d([[xl(t), yB - 9], [f.p - pl, yB - 9]]));
    if (kts[kts.length - 1] < 1) { kts.push(1); ds.push(ds[ds.length - 1]); }
    const vis0 = f.t0 <= 0;
    const visKt = [0, cl(f.t0), 1].filter((v, i, a) => i === 0 || v > a[i - 1]);
    const visOn = visKt.map((t) => t * T >= f.t0 - 1e-9);
    o += `<g opacity="${vis0 ? 1 : 0}">${apath(ds, kts, T, 'ink-b')}${ashow(visOn, visKt, T)}</g>`;
    // primer：从放下到被下一个 fragment 替换
    const pk = [0, cl(f.t0), cl(f.tRep), 1].filter((v, i, a) => i === 0 || v > a[i - 1]);
    const pOn = pk.map((t) => t * T >= f.t0 - 1e-9 && t * T < f.tRep - 1e-9);
    o += `<g opacity="${pOn[0] ? 1 : 0}">${line(f.p - pl, yB - 9, f.p, yB - 9, 'ln')}${ashow(pOn, pk, T)}</g>`;
    // primer 被换成 DNA 之后，这一小段改画成 DNA
    const dOn = pk.map((t) => t * T >= f.tRep - 1e-9);
    if (f.tRep < T) o += `<g opacity="${dOn[0] ? 1 : 0}">${line(f.p - pl - 1, yB - 9, f.p, yB - 9, 'ink-b')}${ashow(dOn, pk, T)}</g>`;
    // lagging 的 polymerase：只在延伸时出现
    if (f.t1 > 0 && f.t0 < T) {
      const a = Math.max(f.t0, 0), b = Math.min(f.t1, T);
      const ktp = [0, a / T, b / T, 1].filter((v, i, arr) => i === 0 || v > arr[i - 1]);
      const on = ktp.map((t) => t * T >= f.t0 - 1e-9 && t * T < f.t1 - 1e-9);
      const xsP = ktp.map((t) => xl(t * T) - 6);
      o += `<g opacity="${on[0] ? 1 : 0}"><ellipse cx="${f1(xsP[0])}" cy="${yB - 9}" rx="11" ry="8" class="paper">${anim('cx', xsP.map(f1), ktp, T)}</ellipse>${ashow(on, ktp, T)}</g>`;
    }
  }
  // leading polymerase 与 helicase
  o += `<ellipse cx="${F0 - 46}" cy="${yT + 9}" rx="11" ry="8" class="paper">${anim('cx', Fs.map((F) => f1(F - 46)), kF, T)}</ellipse>`;
  o += `<circle cx="${F0}" cy="${yc}" r="10" class="wash-strong">${anim('cx', Fs.map(f1), kF, T)}</circle>`;
  o += `<text x="${F0 + 14}" y="${yc - 18}" class="ts" text-anchor="start">helicase${anim('x', Fs.map((F) => f1(F + 14)), kF, T)}</text>`;
  // 方向与标注（静止）
  o += text(X0 - 6, yT + 4, "3′", 'ts', 'end') + text(X0 - 6, yB + 4, "5′", 'ts', 'end');
  o += text(XR + 4, yc - 6, "5′", 'ts', 'start') + text(XR + 4, yc + 14, "3′", 'ts', 'start');
  o += text(X0, 30, 'Leading strand：一个 primer，跟着 fork 连续合成（5′→3′ 向右）', 'ts', 'start');
  o += text(X0, 50, '椭圆是 DNA polymerase；它只会往 3′ 端加 nucleotide', 'ts', 'start');
  o += text(X0, 214, 'Lagging strand：5′→3′ 只能向左，所以每露出一段就放一个 RNA primer（彩色短段），', 'ts', 'start');
  o += text(X0, 232, '往回合成到上一段为止，这一段叫 Okazaki fragment；primer 随后换成 DNA，ligase 封口。', 'ts', 'start');
  return svgA(560, 240, o, '动图：replication fork 向右移动，helicase 解开 parental DNA；上方 leading strand 连续延长，下方 lagging strand 每隔一段放一个 RNA primer，再向左合成 Okazaki fragment');
}

// ---------- 第 1 站：Griffith 的四组注射 ----------
function griffith() {
  let o = '';
  // mouse：身体 + 头 + 耳 + 尾；dead 时躺倒（旋转 90°）
  const mouse = (x, y, dead) => {
    const b = `<ellipse cx="0" cy="0" rx="21" ry="13" class="paper"/>`
      + `<circle cx="18" cy="-7" r="8.5" class="paper"/>`
      + `<circle cx="22" cy="-15" r="4" class="paper"/>`
      + `<path d="M-21 2 C-34 2 -34 -8 -28 -12" class="ink"/>`
      + (dead ? line(22.5, -9, 26.5, -5, 'ink-s') + line(26.5, -9, 22.5, -5, 'ink-s') : `<circle cx="24.5" cy="-7" r="1.4" class="ink-f"/>`)
      + [8, 0, -8].map((dx) => line(dx, dead ? -11 : 11, dx, dead ? -22 : 20, 'ink')).join('');
    const g = dead
      ? `<g transform="translate(${f1(x)} ${f1(y + 4)}) rotate(180 0 0)">${b}</g>`
      : `<g transform="translate(${f1(x)} ${f1(y)})">${b}</g>`;
    return g + line(x - 26, y + (dead ? 18 : 21), x + 26, y + (dead ? 18 : 21), 'mute');
  };
  // 一个注射物：S（有 capsule，光滑）/ R（无 capsule，粗糙）/ 加热杀死的 S
  const cells = (x, y, kind) => {
    let q = '';
    const put = (dx, dy) => {
      const cx = x + dx, cy = y + dy;
      if (kind === 'R') {
        const pts = [];
        for (let i = 0; i < 9; i++) { const a = (i / 9) * 2 * Math.PI, r = i % 2 ? 4.2 : 7; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
        q += poly(pts, 'wash2') + poly(pts, 'frame');
      } else {
        q += circle(cx, cy, 7.5, kind === 'Sdead' ? 'wash2' : 'wash-strong') + circle(cx, cy, 7.5, 'frame');
        q += circle(cx, cy, 4, kind === 'Sdead' ? 'paper-f' : 'solid');
        if (kind === 'Sdead') q += line(cx - 5, cy - 5, cx + 5, cy + 5, 'mute') + line(cx + 5, cy - 5, cx - 5, cy + 5, 'mute');
      }
    };
    for (const [dx, dy] of [[-10, -6], [8, -8], [0, 8], [16, 6]]) put(dx, dy);
    return q;
  };
  const cols = [78, 218, 358, 498];
  const data = [
    [['活的 type II', '（R，无 capsule）'], ['R'], false, '活'],
    [['活的 type III', '（S，有 capsule）'], ['S'], true, '死'],
    [['加热杀死的', 'type III（S）'], ['Sdead'], false, '活'],
    [['加热杀死的 S', '＋ 活的 R'], ['Sdead', 'R'], true, '死'],
  ];
  data.forEach(([lab, kinds, dead, res], j) => {
    const x = cols[j];
    o += rect(x - 66, 34, 132, 200, 'frame', 12);
    o += text(x, 24, '第 ' + (j + 1) + ' 组', 'tb', 'middle');
    kinds.forEach((k, i) => { o += cells(x - 18, 62 + i * 34, k); });
    lab.forEach((s, i) => { o += text(x, 136 + i * 16, s, 'ts', 'middle'); });
    o += mouse(x, 196, dead);
    o += text(x, 250, 'mouse ' + res, dead ? 'tl' : 'ts', 'middle');
  });
  // 第 4 组的血里长出什么
  o += arrow(cols[3], 260, cols[3], 288, 'ln');
  o += text(cols[3] - 16, 296, '血里分离出活的、有 capsule 的 type III', 'tl', 'end');
  o += circle(cols[3], 292, 7.5, 'wash-strong') + circle(cols[3], 292, 7.5, 'frame') + circle(cols[3], 292, 4, 'solid');
  o += text(14, 324, '实心带亮圈 = 有 capsule 的 S；锯齿 = 无 capsule 的 R；打叉的灰圈 = 加热杀死的 S。', 'ts', 'start');
  o += text(14, 342, '只有第 4 组死，而且长出来的是 donor 的 type III，不是注射进去的 type II：一个 trait 转移了过去。', 'ts', 'start');
  return svg(560, 350, o,'Griffith 式的四组注射：活的 R 不致死，活的 S 致死，加热杀死的 S 不致死，加热杀死的 S 加活的 R 致死，并从血中分离出活的有 capsule 的 type III');
}

// ---------- 第 1 站：Avery 的 enzyme 实验与 N/P ----------
function avery() {
  let o = '';
  o += text(150, 20, 'assay：R36A 加提取物，还变不变成 type III', 'tb', 'middle');
  const rows = [
    ['不处理', 1],
    ['trypsin', 1],
    ['chymotrypsin', 1],
    ['ribonuclease（结晶）', 1],
    ['DNA depolymerase', 0],
    ['dog serum（未加热）', 0],
    ['dog serum，60 °C', 1],
  ];
  rows.forEach(([name, ok], r) => {
    const y = 52 + r * 34;
    o += text(14, y + 5, name, 't', 'start');
    o += rect(170, y - 13, 16, 26, 'paper', 4);
    o += rect(172, y - 2, 12, 13, ok ? 'wash-strong' : 'wash2', 2);
    if (ok) { o += circle(206, y, 7, 'wash-strong') + circle(206, y, 7, 'frame') + circle(206, y, 3.6, 'solid'); }
    else { const pts0 = []; for (let i = 0; i < 9; i++) { const a = (i / 9) * 2 * Math.PI, rr = i % 2 ? 3.8 : 6.6; pts0.push([206 + rr * Math.cos(a), y + rr * Math.sin(a)]); } o += poly(pts0, 'wash2') + poly(pts0, 'frame'); }
    o += text(220, y + 5, ok ? '变成 type III' : '不再转化', ok ? 'tl' : 'ts', 'start');
  });
  o += line(4, 300, 312, 300, 'grid');
  o += text(14, 318, 'Protease 删掉 protein、RNase 删掉 RNA，活性都在；', 'ts', 'start');
  o += text(14, 336, '只有删掉 DNA 的那一种处理让活性消失。', 'ts', 'start');
  o += line(330, 34, 330, 308, 'grid');
  // 右边：N/P 的刻度
  const sy = lin(1.55, 1.95, 272, 56);
  const AX = 400;
  o += text(448, 20, 'N/P 能排除多少 protein', 'tb', 'middle');
  o += line(AX, sy(1.55), AX, sy(1.95), 'axis');
  for (const v of [1.6, 1.7, 1.8, 1.9]) o += line(AX - 4, sy(v), AX, sy(v), 'axis') + text(AX - 8, sy(v) + 4, v.toFixed(1), 'ts', 'end');
  o += rect(AX + 2, sy(1.75), 22, sy(1.58) - sy(1.75), 'wash', 3);
  o += line(AX + 2, sy(1.696), AX + 24, sy(1.696), 'ln');
  const pts = [[1.731, '掺 2% protein'], [1.786, '掺 5%'], [1.886, '掺 10%']];
  for (const [v, s] of pts) { o += line(AX + 24, sy(v), AX + 40, sy(v), 'dash') + circle(AX + 42, sy(v), 3.5, 'ink-f') + text(AX + 50, sy(v) + 4, s, 'ts', 'start'); }
  o += line(AX + 2, sy(1.68), AX + 40, sy(1.63), 'mute') + text(AX + 46, sy(1.63) + 4, '纯 DNA 1.696', 'tl', 'start');
  o += line(AX + 13, sy(1.575), AX + 40, sy(1.575), 'mute') + text(AX + 46, sy(1.575) + 4, '实测 1.58 到 1.75', 'ts', 'start');
  o += text(342, 318, '实测的上限 1.75 对应约 3% 的 protein：', 'ts', 'start');
  o += text(342, 336, '只能把 protein 压到百分之几，压不到零。', 'ts', 'start');
  return svg(560, 344, o,'左边：trypsin、chymotrypsin、ribonuclease 处理后提取物仍能把 R 转化成 type III，DNA depolymerase 或未加热的 dog serum 处理后不能；右边：N/P 的实测范围 1.58 到 1.75 与纯 DNA 的 1.696、掺入 2%、5%、10% protein 时的预期值');
}

// ---------- 第 1 站：nucleosome ----------
function nucleosome() {
  let o = '';
  const cx = 132, cy = 114, R = 44;
  const nuc = (x, r) => {
    let q = '';
    q += circle(x, cy, r * 0.70, 'wash2') + circle(x, cy, r * 0.70, 'frame');
    // 8 个 histone：里外两层各 4 个
    for (let k = 0; k < 8; k++) {
      const a = (k / 4) * Math.PI + (k < 4 ? 0 : Math.PI / 4), rr = (k < 4 ? 0.40 : 0.24) * r;
      q += circle(x + rr * Math.cos(a), cy + rr * Math.sin(a), r * 0.145, 'solid2');
    }
    // DNA 绕 1.7 圈：两条略微错开的弧
    for (const k of [0, 1]) {
      const rr = r - k * 6;
      q += path(`M ${f1(x - rr)} ${f1(cy)} A ${f1(rr)} ${f1(rr * 0.88)} 0 1 1 ${f1(x + rr)} ${f1(cy)}`, 'ln');
      q += path(`M ${f1(x + rr)} ${f1(cy)} A ${f1(rr)} ${f1(rr * 0.88)} 0 1 1 ${f1(x - rr)} ${f1(cy)}`, 'ln');
    }
    return q;
  };
  o += nuc(cx, R);
  o += text(14, 28, 'histone octamer：H2A、H2B、H3、H4 各两个', 'ts', 'start');
  o += arrow(104, 36, cx - 10, cy - 14, 'mute');
  o += text(cx - R - 12, cy - 10, 'core DNA', 'tl', 'end') + text(cx - R - 12, cy + 6, '约 146 bp', 'ts', 'end') + text(cx - R - 12, cy + 22, '绕 1.7 圈', 'ts', 'end');
  // 直径标注
  const yd = cy + R + 16;
  o += line(cx - R, yd, cx + R, yd, 'mute') + line(cx - R, yd - 4, cx - R, yd + 4, 'mute') + line(cx + R, yd - 4, cx + R, yd + 4, 'mute');
  o += text(cx, yd + 18, '颗粒直径约 10 nm', 'ts', 'middle');
  // 右边：串成一串
  const xs = [330, 410, 490];
  o += text(410, 44, '串珠状的纤维', 'tb', 'middle');
  xs.forEach((x, i) => { o += nuc(x, 26); if (i) o += line(xs[i - 1] + 26, cy, x - 26, cy, 'ln'); });
  o += line(xs[0] - 50, cy, xs[0] - 26, cy, 'ln') + line(xs[2] + 26, cy, xs[2] + 46, cy, 'ln');
  o += arrow(370, cy + 36, 370, cy + 8, 'mute');
  o += text(370, cy + 52, 'linker DNA 约 20 bp', 'ts', 'middle');
  o += text(14, 230, '加上一个 H1，再多绕约 20 bp、凑成约 166 bp 和两整圈，这个单位叫 chromatosome。', 'ts', 'start');
  o += text(14, 248, '166 bp 拉直是 166 × 0.34 = 56.4 nm，装进沿纤维轴只占约 10 nm 的一个重复单位。', 'ts', 'start');
  return svg(560, 256, o,'一个 nucleosome：8 个 histone 组成的 octamer 外面绕着约 146 bp 的 DNA，绕 1.7 圈，颗粒直径约 10 nm；右边是几个 nucleosome 由约 20 bp 的 linker DNA 串成的纤维');
}

// ---------- 第 1 站：compaction 的各级长度 ----------
function compact() {
  let o = '';
  const BP = 2.5e8, nm = BP * 0.34; // chromosome 1 拉直的长度，单位 nm
  const levels = [
    ['裸 DNA（2 nm）', 1],
    ['nucleosome 串珠（约 10 nm）', 7],
    ['30 nm fiber', 31],
    ['loop 与 scaffold', 1200],
    ['metaphase chromosome', 10000],
  ];
  const fmt = (v) => (v >= 1e7 ? (v / 1e7).toFixed(1).replace('.0', '') + ' cm' : v >= 1e6 ? (v / 1e6).toFixed(1).replace('.0', '') + ' mm' : v >= 1e4 ? (v / 1e3).toFixed(0) + ' μm' : v >= 1e3 ? (v / 1e3).toFixed(1) + ' μm' : v.toFixed(0) + ' nm');
  const fmtN = (f) => (f >= 1e4 ? '10 000' : String(f));
  const sx = logx(8.5e3, 8.5e7, 196, 462), y0 = 60, dy = 44;
  o += text(280, 22, 'Chromosome 1（2.5 × 10⁸ bp）在各级结构下的长度', 'tb', 'middle');
  for (const t of [1e4, 1e5, 1e6, 1e7]) o += line(sx(t), y0 - 16, sx(t), y0 + dy * 4 + 16, 'grid') + text(sx(t), y0 - 24, fmt(t), 'ts', 'middle');
  levels.forEach(([name, f], i) => {
    const y = y0 + i * dy, L = nm / f;
    o += text(190, y + 4, name, i === 4 ? 'tl' : 't', 'end');
    o += rect(sx(Math.min(L, 8.5e7)) - 2, y - 7, 4, 14, 'solid');
    o += line(196, y, sx(L), y, 'ln-dash');
    o += text(sx(L) + 10, y + 4, fmt(L) + (f > 1 ? `（压 ${fmtN(f)} 倍）` : ''), i === 4 ? 'tl' : 'ts', 'start');
  });
  // 右侧：每一级画出样子
  const px = 60, py = y0 + dy * 4 + 60, ly = 36;
  o += line(px - 46, py, px + 46, py, 'ink-b');
  o += text(px, py + ly, '裸 DNA', 'ts', 'middle');
  const bead = (x, y, r) => circle(x, y, r, 'wash-strong') + circle(x, y, r, 'frame');
  let x = 170;
  o += line(x - 46, py, x + 46, py, 'ln');
  for (const d0 of [-36, -12, 12, 36]) o += bead(x + d0, py, 8);
  o += text(x, py + ly, '串珠', 'ts', 'middle');
  x = 288;
  for (let k = 0; k < 9; k++) { const a = (k / 9) * 2 * Math.PI * 2.2; o += bead(x - 30 + k * 7.5, py + 13 * Math.sin(a), 6.5); }
  o += text(x, py + ly, '30 nm fiber', 'ts', 'middle');
  x = 400;
  o += line(x, py - 18, x, py + 18, 'ink-b');
  for (let k = 0; k < 4; k++) { const yy = py - 14 + k * 9.5; o += path(`M ${x} ${f1(yy)} C ${x + 34} ${f1(yy - 7)} ${x + 34} ${f1(yy + 7)} ${x} ${f1(yy + 5)}`, 'ln'); o += path(`M ${x} ${f1(yy)} C ${x - 34} ${f1(yy - 7)} ${x - 34} ${f1(yy + 7)} ${x} ${f1(yy + 5)}`, 'ln'); }
  o += text(x, py + ly, 'loop', 'ts', 'middle');
  x = 500;
  o += rect(x - 9, py - 20, 8, 40, 'solid', 4) + rect(x + 1, py - 20, 8, 40, 'solid', 4);
  o += circle(x - 5, py - 4, 2.6, 'paper-f') + circle(x + 5, py - 4, 2.6, 'paper-f');
  o += text(x, py + ly, 'metaphase', 'ts', 'middle');
  o += text(14, py + 68, '10 000 : 1 的检验：8.5 cm / 10 000 = 8.5 μm，而 metaphase 时 chromosome 1 实测长约 10 μm。', 'ts', 'start');
  o += text(14, py + 86, '30 nm fiber 的 31 倍和 loop 的 1200 倍是按“总共 10 000 倍”反推的量级，不是实测值。', 'ts', 'start');
  return svg(560, py + 94, o, 'Chromosome 1 的 2.5 亿 bp 拉直是 8.5 cm，串成 nucleosome 后约 1.2 cm，30 nm fiber 约 2.7 mm，loop 级约 71 μm，metaphase chromosome 约 8.5 μm；下方画出每一级的结构');
}

// ---------- 第 2 站：Beadle–Tatum 式的 supplement 实验 ----------
function beadle() {
  let o = '';
  const steps = ['precursor', 'ornithine', 'citrulline', 'arginine'];
  const xs = [70, 205, 340, 475], y = 34;
  steps.forEach((s, i) => { o += text(xs[i], y + 4, s, 'tb', 'middle'); if (i) { o += arrow(xs[i - 1] + 40, y, xs[i] - 42, y, 'ink'); o += text((xs[i - 1] + xs[i]) / 2, y + 22, 'enzyme ' + i, 'ts', 'middle'); } });
  const cols = ['minimal', '+ ornithine', '+ citrulline', '+ arginine'];
  const cx = [205, 290, 375, 460];
  cols.forEach((c, j) => { o += text(cx[j], 86, c, 'ts', 'middle'); });
  const rows = [['wild type', 0], ['class I（enzyme 1 坏）', 1], ['class II（enzyme 2 坏）', 2], ['class III（enzyme 3 坏）', 3]];
  // 菌落位置固定，看起来像一个 dish
  const dots = [[-9, -6], [4, -10], [10, 2], [-3, 5], [-12, 6], [6, 10], [0, -1], [13, -6], [-6, 12]];
  rows.forEach(([name, blk], r) => {
    const cy = 120 + r * 50;
    o += text(20, cy + 4, name, 't', 'start');
    for (let j = 0; j < 4; j++) {
      o += circle(cx[j], cy, 20, 'paper');
      const grows = blk === 0 || j >= blk; // supplement 在 block 之后才能救
      if (grows) for (const [dx, dy] of dots) o += circle(cx[j] + dx, cy + dy, 2.6, 'ink-f');
    }
  });
  o += text(280, 330, '有点 = 长出 colony。缺哪一步，就要给这一步之后的 compound；能救它的 compound 越多，block 越靠前。', 'ts', 'middle');
  return svg(560, 338, o, 'Neurospora 的三类 arginine 突变体在四种 medium 上的生长：class I 加 ornithine、citrulline 或 arginine 都能长，class II 只在加 citrulline 或 arginine 时长，class III 只在加 arginine 时长');
}

// ---------- 第 2 站：transcription（动图） ----------
function transcribeA() {
  const n = GENE.length, x0 = 172, dx = 17.4, yC = 70, yTp = 100, yR = 168;
  const X = (i) => x0 + i * dx;
  const order = []; for (let k = 11; k <= n; k++) order.push(k); for (let k = 0; k <= 10; k++) order.push(k);
  const step = 0.32;
  const ktFix = [], ordFix = [];
  let t = 0;
  for (let i = 0; i < order.length; i++) { ktFix.push(t); ordFix.push(order[i]); t += order[i] === n ? step + 1.4 : step; }
  const T = t;
  for (let i = 0; i < ktFix.length; i++) ktFix[i] /= T;
  let o = '';
  o += text(8, yC + 5, 'coding strand', 'ts', 'start') + text(8, yTp + 5, 'template strand', 'ts', 'start') + text(8, yR + 5, 'RNA', 'tl', 'start');
  o += rect(X(-1) - 14, yC - 14, 20, yTp - yC + 26, 'wash2', 4) + text(X(-1) - 4, yTp + 34, 'promoter', 'ts', 'middle');
  for (let i = 0; i < n; i++) { o += text(X(i), yC + 5, GENE[i], 't', 'middle') + text(X(i), yTp + 5, comp(GENE)[i], 't', 'middle'); }
  o += text(X(n) - 4, yC + 5, "3′", 'ts', 'start') + text(X(n) - 4, yTp + 5, "5′", 'ts', 'start') + text(X(n) - 4, yR + 5, "3′", 'ts', 'start');
  o += text(X(-1) - 20, yC + 5, "5′", 'ts', 'end') + text(X(-1) - 20, yTp + 5, "3′", 'ts', 'end') + text(X(-1) + 6, yR + 5, "5′", 'ts', 'end');
  // RNA polymerase：盖住正在读的那几个 base
  const pos = ordFix.map((k) => X(Math.min(k, n - 1)) - 28);
  o += `<rect x="${f1(pos[0])}" y="${yC - 22}" width="68" height="${yR - yC + 36}" rx="16" class="wash">${anim('x', pos.map(f1), ktFix, T, true)}</rect>`;
  const lx = (p) => f1(Math.min(p + 34, 500));
  o += `<text x="${lx(pos[0])}" y="${yR + 36}" class="ts" text-anchor="middle">RNA polymerase${anim('x', pos.map(lx), ktFix, T, true)}</text>`;
  // RNA：第 j 个 base 在 k > j 时出现
  for (let j = 0; j < n; j++) {
    const on = ordFix.map((k) => k > j);
    o += `<text x="${f1(X(j))}" y="${yR + 5}" class="tl" text-anchor="middle" opacity="${on[0] ? 1 : 0}">${MRNA[j]}${ashow(on, ktFix, T)}</text>`;
  }
  o += text(280, 236, 'Polymerase 沿 template 从 3′ 读向 5′，RNA 从 5′ 长向 3′。RNA 和 template 互补，', 'ts', 'middle');
  o += text(280, 254, '所以和 coding strand 同序，只是 T 换成 U。', 'ts', 'middle');
  return svgA(560, 262, o, '动图：RNA polymerase 从 promoter 出发沿 DNA 向右移动，读 template strand，下方逐个出现的 RNA base 和上方 coding strand 一致，只是 T 换成 U');
}

// ---------- 第 2 站：translation（动图） ----------
function translateA() {
  const x0 = 46, cw = 70, yM = 196;
  const cX = (k) => x0 + k * cw; // 第 k 个 codon 的左边
  let o = '';
  CODONS.forEach((c, k) => {
    for (let q = 0; q < 3; q++) o += text(cX(k) + 14 + q * 21, yM + 5, c[q], 't', 'middle');
    o += text(cX(k) + 35, yM + 26, codon(c), 'ts', 'middle');
  });
  o += line(x0 - 4, yM + 10, cX(7) + 4, yM + 10, 'mute');
  o += text(x0 - 10, yM + 5, "5′", 'ts', 'end') + text(cX(7) + 8, yM + 5, "3′", 'ts', 'start');
  // 帧：s = P site 上的 codon；s = 6 表示 stop codon 进入 A site 之后释放
  const seq = [3, 4, 5, 6, 0, 1, 2], step = 1.15, hold = 1.6;
  const kt = []; let t = 0; seq.forEach((s) => { kt.push(t); t += s === 6 ? step + hold : step; }); const T = t;
  const ktn = kt.map((v) => v / T);
  const aaR = 15;
  const body = (s) => {
    let g = '';
    if (s <= 5) {
      const rx = cX(s) - 6;
      g += rect(rx, yM - 120, 2 * cw + 12, 104, 'wash', 26) + rect(rx + 10, yM + 12, 2 * cw - 8, 30, 'wash', 12);
      g += text(rx + cw / 2 + 6, yM - 100, 'P site', 'ts', 'middle') + text(rx + cw * 1.5 + 6, yM - 100, 'A site', 'ts', 'middle');
      // P site 的 tRNA 拿着整条 peptide
      const tRNA = (k, withAA) => {
        let q = rect(cX(k) + 10, yM - 44, cw - 20, 34, 'paper', 5);
        q += text(cX(k) + 35, yM - 22, comp(CODONS[k]).replace(/T/g, 'U'), 'ts', 'middle');
        if (withAA) q += line(cX(k) + 35, yM - 44, cX(k) + 35, yM - 58, 'ink');
        return q;
      };
      g += tRNA(s, true);
      // peptide：aa 0..s，从 P-site tRNA 往左上排
      for (let i = s; i >= 0; i--) {
        const cx = cX(s) + 35 - (s - i) * 32, cy = yM - 73 - (s - i) * 3;
        if (i < s) g += line(cx + aaR, cy - 1, cx + 32 - aaR, cy + 2, 'ink');
        g += circle(cx, cy, aaR, i === s ? 'wash-strong' : 'paper') + text(cx, cy + 4, codon(CODONS[i]), 'ts', 'middle');
      }
      if (codon(CODONS[s + 1]) !== 'stop') {
        g += tRNA(s + 1, true);
        const cx = cX(s + 1) + 35, cy = yM - 73;
        g += circle(cx, cy, aaR, 'wash-strong') + text(cx, cy + 4, codon(CODONS[s + 1]), 'ts', 'middle');
        g += text(280, 24, `A site 上是 codon ${CODONS[s + 1]}：anticodon ${comp(CODONS[s + 1]).replace(/T/g, 'U')} 的 tRNA 带着 ${codon(CODONS[s + 1])} 进来`, 'ts', 'middle');
        g += text(280, 42, '接着 peptide 整条转到它的 amino acid 上，ribosome 向 3′ 挪一个 codon', 'ts', 'middle');
      } else {
        g += rect(cX(s + 1) + 8, yM - 50, cw - 16, 40, 'solid2', 6) + text(cX(s + 1) + 35, yM - 26, 'RF', 'tw', 'middle');
        g += text(280, 24, 'A site 上是 stop codon UAA：没有 tRNA 认它，release factor（RF）进来', 'ts', 'middle');
        g += text(280, 42, '下一步 peptide 从 tRNA 上切下来，ribosome 解体', 'ts', 'middle');
      }
    } else {
      g += text(280, 24, 'Peptide 释放：Met–Ala–Lys–Phe–Gly–Cys，6 个 amino acid', 'ts', 'middle');
      g += text(280, 42, '7 个 codon，最后一个是 stop，不对应 amino acid', 'ts', 'middle');
      for (let i = 0; i < 6; i++) { const cx = 140 + i * 56, cy = 104; if (i) g += line(cx - 56 + aaR, cy, cx - aaR, cy, 'ink'); g += circle(cx, cy, aaR, 'paper') + text(cx, cy + 4, codon(CODONS[i]), 'ts', 'middle'); }
    }
    return g;
  };
  seq.forEach((s, i) => { o += frameG(body(s), i, ktn, T); });
  return svgA(560, 232, o, '动图：ribosome 沿 mRNA AUG GCC AAG UUC GGA UGC UAA 一次挪一个 codon，每次 A site 进来一个带 amino acid 的 tRNA，peptide 逐个加长，遇到 UAA 时 release factor 进来，释放 6 个 amino acid 的 peptide');
}

// ---------- 第 3 站：Punnett square ----------
function punnett(gam, cls, sum, title, top = 0) {
  const cw = 70, ch = 40, gx = 100, gy = 56 + top;
  let o = title ? text(14, 20, title, 'tb', 'start') : '';
  o += text(gx + 2 * cw, gy - 26, '一个 F₁ parent 的 gamete（各 ¼）', 'ts', 'middle');
  o += `<text x="${gx - 40}" y="${gy + 2 * ch}" class="ts" text-anchor="middle" transform="rotate(-90 ${gx - 40} ${gy + 2 * ch})">另一个 F₁ 的 gamete</text>`;
  gam.forEach((g, j) => { o += text(gx + j * cw + cw / 2, gy - 8, g, 'tb', 'middle'); o += text(gx - 10, gy + j * ch + ch / 2 + 5, g, 'tb', 'end'); });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const geno = [...gam[i]].map((c, k) => [c, gam[j][k]].sort((a, b) => (a === a.toUpperCase() ? -1 : 1) - (b === b.toUpperCase() ? -1 : 1)).join('')).join('');
    o += rect(gx + j * cw, gy + i * ch, cw, ch, cls(geno)) + rect(gx + j * cw, gy + i * ch, cw, ch, 'frame');
    o += text(gx + j * cw + cw / 2, gy + i * ch + ch / 2 + 5, geno, 't', 'middle');
  }
  const sx = gx + 4 * cw + 26;
  sum.forEach(([c, s1, s2], k) => { const yy = gy + 4 + k * 40; o += rect(sx, yy, 22, 22, c) + rect(sx, yy, 22, 22, 'frame') + text(sx + 30, yy + 11, s1, 't', 'start') + text(sx + 30, yy + 27, s2, 'ts', 'start'); });
  return [o, gy + 4 * ch];
}
function dihybrid() {
  const cls = (g) => { const R = g.includes('R'), Y = g.includes('Y'); return R && Y ? 'wash-strong' : R ? 'wash' : Y ? 'wash2' : 'paper-f'; };
  const [o, yb] = punnett(['RY', 'Ry', 'rY', 'ry'], cls, [['wash-strong', '9 格 round, yellow', 'Mendel 数到 315'], ['wash', '3 格 round, green', '数到 108'], ['wash2', '3 格 wrinkled, yellow', '数到 101'], ['paper-f', '1 格 wrinkled, green', '数到 32']]);
  return svg(560, yb + 34, o + text(280, yb + 26, '16 格等可能：每格 = ¼ × ¼。按 phenotype 数格子就是 9:3:3:1，合计 556 粒，期望 312.75 : 104.25 : 104.25 : 34.75。', 'ts', 'middle'), 'RrYy 自交的 Punnett square，4 种 gamete 两两组合成 16 格，按 phenotype 分成 9、3、3、1 格');
}
function ninesevenFig() {
  let o = '';
  const y = 30, xs = [80, 270, 460];
  ['white precursor', 'white intermediate', 'purple pigment'].forEach((s, i) => { o += text(xs[i], y + 4, s, i === 2 ? 'tl' : 'tb', 'middle'); });
  o += arrow(xs[0] + 62, y, xs[1] - 70, y, 'ink') + text((xs[0] + xs[1]) / 2 - 4, y + 20, 'enzyme C（要 C_）', 'ts', 'middle');
  o += arrow(xs[1] + 72, y, xs[2] - 58, y, 'ink') + text((xs[1] + xs[2]) / 2 + 6, y + 20, 'enzyme P（要 P_）', 'ts', 'middle');
  const cls = (g) => (g.includes('C') && g.includes('P') ? 'wash-strong' : 'paper-f');
  const [p, yb] = punnett(['CP', 'Cp', 'cP', 'cp'], cls, [['wash-strong', '9 格 purple', 'C_P_：两步都通'], ['paper-f', '7 格 white', '3 + 3 + 1：任一步断了'], ['paper-f', '', ''], ['paper-f', '', '']].slice(0, 2), '', 54);
  o += p;
  o += text(280, yb + 26, '两个 white 的 true-breeding line：CCpp × ccPP → F₁ 全是 CcPp（purple）→ F₂ 9 purple : 7 white。', 'ts', 'middle');
  return svg(560, yb + 34, o, '花色由两步 pathway 决定：C 和 P 都至少有一个 dominant allele 才是 purple；CcPp 自交的 16 格中 9 格 purple、7 格 white');
}

// ---------- 第 3 站：pedigree ----------
function pedigree() {
  let o = '';
  const sq = (x, y, cls) => rect(x - 14, y - 14, 28, 28, cls);
  const ci = (x, y, cls) => circle(x, y, 14, cls);
  const yI = 50, yII = 140, yIII = 236;
  o += text(14, yI + 5, 'I', 'tb') + text(14, yII + 5, 'II', 'tb') + text(14, yIII + 5, 'III', 'tb');
  o += line(134, yI, 186, yI, 'ink') + sq(120, yI, 'paper') + ci(200, yI, 'paper');
  o += text(120, yI - 22, 'Aa', 'ts', 'middle') + text(200, yI - 22, 'Aa', 'ts', 'middle');
  o += line(160, yI, 160, yII - 40, 'ink') + line(100, yII - 40, 260, yII - 40, 'ink');
  for (const x of [100, 180, 260]) o += line(x, yII - 40, x, yII - 14, 'ink');
  o += ci(100, yII, 'solid') + text(100, yII + 32, 'aa（affected）', 'ts', 'middle');
  o += ci(180, yII, 'paper');
  o += sq(260, yII, 'paper') + text(260, yII + 32, 'II-2', 'tb', 'middle') + text(260, yII + 50, 'P(Aa) = 2/3', 'tl', 'middle');
  o += line(274, yII, 406, yII, 'ink') + ci(420, yII, 'paper') + text(420, yII + 32, '无家族史', 'ts', 'middle') + text(420, yII + 50, 'P(Aa) = 1/50（设）', 'ts', 'middle');
  o += line(340, yII, 340, yIII - 14, 'ink') + rect(326, yIII - 14, 28, 28, 'wash', 0) + text(340, yIII + 5, '?', 'tb', 'middle');
  o += text(370, yIII + 5, 'P(aa) = 2/3 × 1/50 × 1/4', 'tl', 'start') + text(370, yIII + 23, '= 1/300', 'tl', 'start');
  return svg(560, 262, o, '一个 autosomal recessive 的 pedigree：第 I 代两个 carrier 生出一个 affected 女儿和 unaffected 的儿子 II-2；II-2 与无家族史的人结婚，求孩子 affected 的概率');
}

// ---------- 第 4 站：crossing over ----------
function crossover() {
  let o = '';
  const L = 140, h = 14;
  const chrom = (x, y, segs) => segs.map(([a, b, c]) => rect(x + a * L, y, (b - a) * L, h, c, 6)).join('') + rect(x, y, L, h, 'frame', 6);
  const loci = [0.2, 0.8], cut = 0.5;
  const X1 = 104, ys = [62, 84, 120, 142];
  o += text(X1 + L / 2, 26, 'meiosis I：4 条 chromatid 配成一组', 'tb', 'middle');
  ys.forEach((y, i) => { const c = i < 2 ? 'wash-strong' : 'wash2'; o += chrom(X1, y, [[0, 1, c]]); o += text(X1 + loci[0] * L, y + 11, i < 2 ? 'A' : 'a', 'tb', 'middle') + text(X1 + loci[1] * L, y + 11, i < 2 ? 'B' : 'b', 'tb', 'middle'); });
  o += text(X1 - 8, 80, '一个 homolog', 'ts', 'end') + text(X1 - 8, 96, '（两条 sister）', 'ts', 'end');
  // 交叉标记
  const cx = X1 + cut * L;
  o += line(cx - 12, ys[1] + h, cx + 12, ys[2], 'ln') + line(cx + 12, ys[1] + h, cx - 12, ys[2], 'ln');
  o += text(cx, ys[3] + 38, 'chromatid 2 与 3 在 A、B 之间交换', 'ts', 'middle');
  o += arrow(X1 + L + 14, 102, 312 - 14, 102, 'ink');
  const X2 = 312;
  o += text(X2 + L / 2, 26, '分到 4 个 gamete', 'tb', 'middle');
  const out = [[[0, 1, 'wash-strong']], [[0, cut, 'wash-strong'], [cut, 1, 'wash2']], [[0, cut, 'wash2'], [cut, 1, 'wash-strong']], [[0, 1, 'wash2']]];
  const lab = [['A', 'B', 'parental'], ['A', 'b', 'recombinant'], ['a', 'B', 'recombinant'], ['a', 'b', 'parental']];
  out.forEach((s, i) => {
    const y = 50 + i * 30;
    o += chrom(X2, y, s) + text(X2 + loci[0] * L, y + 11, lab[i][0], 'tb', 'middle') + text(X2 + loci[1] * L, y + 11, lab[i][1], 'tb', 'middle');
    o += text(X2 + L + 10, y + 11, lab[i][2], lab[i][2] === 'recombinant' ? 'tl' : 'ts', 'start');
  });
  o += text(280, 218, '一次 crossover 只碰 4 条里的 2 条：这次 meiosis 给出 2 个 recombinant、2 个 parental。', 'ts', 'middle');
  o += text(280, 236, '所以 recombination frequency 最多 50%；A、B 越远，中间发生 crossover 的 meiosis 越多。', 'ts', 'middle');
  return svg(560, 244, o, 'Meiosis I 中两个 homolog 共四条 chromatid，第 2 和第 3 条在 A 和 B 之间交换，得到 AB、Ab、aB、ab 四种 gamete，两种 parental、两种 recombinant');
}

// ---------- 第 4 站：three-point cross 得出的 map ----------
function map3() {
  let o = '';
  const sx = lin(0, 9.55, 80, 480), y = 70;
  o += line(sx(-0.8), y, sx(10.3), y, 'ink-b');
  const genes = [['sh', 0], ['cn', 2.15], ['vg', 9.55]];
  for (const [g, v] of genes) o += line(sx(v), y - 10, sx(v), y + 10, 'ink-b') + text(sx(v), y + 28, g, 'tb', 'middle');
  const br = (a, b, yy, s, cls) => { o += line(sx(a), yy, sx(b), yy, 'mute') + line(sx(a), yy - 4, sx(a), yy + 4, 'mute') + line(sx(b), yy - 4, sx(b), yy + 4, 'mute') + text((sx(a) + sx(b)) / 2, yy - 6, s, cls, 'middle'); };
  br(0, 2.15, 40, '2.15', 'ts');
  br(2.15, 9.55, 40, '7.4 cM', 'ts');
  br(0, 9.55, 120, 'sh–vg 直接数 9.25 cM；把 double crossover 算两次是 9.55 = 2.15 + 7.4', 'ts');
  // double crossover：只换中间
  const L = 220, X = 60, hh = 13;
  const c = (yy, segs) => segs.map(([a, b, cl]) => rect(X + a * L, yy, (b - a) * L, hh, cl, 5)).join('') + rect(X, yy, L, hh, 'frame', 5);
  const p = [0.1, 0.33, 0.9];
  o += c(160, [[0, 1, 'wash-strong']]) + c(186, [[0, 1, 'wash2']]);
  ['sh', 'cn', 'vg'].forEach((g, i) => { o += text(X + p[i] * L, 171, g, 'ts', 'middle') + text(X + p[i] * L, 197, '+', 'ts', 'middle'); });
  for (const cx of [0.22, 0.6]) { const xx = X + cx * L; o += line(xx - 8, 173, xx + 8, 186, 'ln') + line(xx + 8, 173, xx - 8, 186, 'ln'); }
  o += arrow(X + L + 14, 180, X + L + 50, 180, 'ink');
  const X2 = 340;
  const c2 = (yy, segs) => segs.map(([a, b, cl]) => rect(X2 + a * 150, yy, (b - a) * 150, hh, cl, 5)).join('') + rect(X2, yy, 150, hh, 'frame', 5);
  o += c2(160, [[0, 0.22, 'wash-strong'], [0.22, 0.6, 'wash2'], [0.6, 1, 'wash-strong']]) + c2(186, [[0, 0.22, 'wash2'], [0.22, 0.6, 'wash-strong'], [0.6, 1, 'wash2']]);
  [['sh', '+', 'vg'], ['+', 'cn', '+']].forEach((gs, r) => gs.forEach((g, i) => { o += text(X2 + p[i] * 150, 171 + r * 26, g, 'ts', 'middle'); }));
  o += text(X2 + 75, 226, '两端不变，只有中间的 gene 换了边', 'ts', 'middle');
  o += text(X + L / 2, 226, '两个 interval 里各一次 crossover', 'ts', 'middle');
  return svg(560, 234, o, 'Three-point cross 得出的 genetic map：sh 和 cn 相距 2.15 cM，cn 和 vg 相距 7.4 cM；下方示意 double crossover 只把中间的 cn 换到另一条 chromosome 上');
}

// ---------- 第 4 站：interrupted mating（动图） ----------
export const CONJ = [['T L', 8.5, null], ['azi', 9, 91], ['ton', 11, 72], ['lac', 18, 52], ['gal', 25, 29]];
function conjugA() {
  const T = 11, TMAX = 30; // 动画 11 秒走完 30 分钟
  const tm = (min) => (min / TMAX) * T;
  let o = '';
  // ---- 上半：两个 cell 和中间的 bridge ----
  const yC = 86, hC = 34;
  const dL = [30, 190], dR = [330, 520]; // donor / recipient 的横向范围
  o += rect(dL[0], yC - hC, dL[1] - dL[0], 2 * hC, 'paper', 28);
  o += rect(dR[0], yC - hC, dR[1] - dR[0], 2 * hC, 'paper', 28);
  o += rect(dL[1], yC - 7, dR[0] - dL[1], 14, 'paper', 4);
  o += text(dL[0] + 6, yC - hC - 10, 'Hfr（donor）', 'tb', 'start');
  o += text(dR[1] - 6, yC - hC - 10, 'F⁻（recipient）', 'tb', 'end');
  o += text((dL[1] + dR[0]) / 2, yC + 30, 'conjugation bridge', 'ts', 'middle');
  // donor 的环状 chromosome：origin 在右侧
  const ox = 110, oy = yC, rr = 26;
  o += circle(ox, oy, rr, 'wash') + circle(ox, oy, rr, 'frame');
  o += text(ox, oy + 4, 'Hfr', 'ts', 'middle');
  o += circle(ox + rr, oy, 4.5, 'solid') + text(ox + rr + 4, oy - 12, 'origin', 'ts', 'start');
  // 进入 recipient 的那条线：长度随时间增加
  const xin = (min) => Math.min(dR[0] + (min / TMAX) * (dR[1] - dR[0] - 14), dR[1] - 14);
  const ks = [], xs = [];
  for (let i = 0; i <= 30; i++) { ks.push(i / 30); xs.push(f1(xin((i / 30) * TMAX))); }
  o += `<line x1="${dL[1] - 60}" y1="${yC}" x2="${xs[0]}" y2="${yC}" class="ln"><animate attributeName="x2" values="${xs.join(';')}" keyTimes="${ks.join(';')}" dur="${T}s" repeatCount="indefinite"/></line>`;
  // marker：到时间就出现在 recipient 里
  [['T L、azi', 9], ['ton', 11], ['lac', 18], ['gal', 25]].forEach(([name, min], i) => {
    const x = xin(min), on = [], kt = [];
    for (let k = 0; k <= 30; k++) { kt.push(k / 30); on.push((k / 30) * TMAX >= min); }
    o += circle(x, yC, 5, 'paper') + text(x, yC - (i % 2 ? 14 : -22), name, 'ts', 'middle');
    const body = circle(x, yC, 5, 'solid') + text(x, yC - (i % 2 ? 14 : -22), name, 'tl', 'middle');
    o += `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
  });
  o += text(dR[0] + 4, yC + 48, '空心 = 还没进来，实心 = 已经进来', 'ts', 'start');
  // ---- 下半：各 marker 的 recombinant 比例 ----
  const x0 = 70, y1 = 222, y2 = 330;
  const sx = lin(0, TMAX, x0, 500), sy = lin(0, 100, y2, y1);
  o += axes({ sx, sy, x0: 0, x1: TMAX, y0: 0, y1: 100, xt: [0, 5, 10, 15, 20, 25, 30], yt: [[0, '0'], [25, '25'], [50, '50'], [75, '75'], [100, '100%']] });
  o += text(x0 - 46, y1 - 14, '带这个 donor marker 的 recombinant 占多少', 'ts', 'start');
  o += text(x0 - 46, y2 + 48, '横轴：把 conjugation 打断的时间（分钟）', 'ts', 'start');
  const tau = 2.5;
  CONJ.forEach(([name, min, pl]) => {
    if (!pl) return;
    const fn = (t) => (t <= min ? 0 : pl * (1 - Math.exp(-(t - min) / tau)));
    o += path(curve(fn, 0, TMAX, sx, sy), 'ln');
    o += line(sx(min), sy(0), sx(min), sy(6), 'dash');
    o += text(sx(min), sy(0) + 30, min + ' 分', 'ts', 'middle');
    o += text(506, sy(pl) + 4, name + ' ' + pl + '%', 'tl', 'start');
  });
  // 扫过的竖线 + 分钟读数
  const lk = [], lx = [];
  for (let i = 0; i <= 30; i++) { lk.push(i / 30); lx.push(f1(sx((i / 30) * TMAX))); }
  o += `<line x1="${lx[0]}" y1="${f1(y1 - 18)}" x2="${lx[0]}" y2="${f1(y2)}" class="mute"><animate attributeName="x1" values="${lx.join(';')}" keyTimes="${lk.join(';')}" dur="${T}s" repeatCount="indefinite"/><animate attributeName="x2" values="${lx.join(';')}" keyTimes="${lk.join(';')}" dur="${T}s" repeatCount="indefinite"/></line>`;
  void tm;
  o += text(14, 396, '曲线的形状是示意；实测的是进入时间和最后的 plateau（Jacob 与 Wollman 1958 Table 2）。', 'ts', 'start');
  o += text(14, 414, '越晚进来的 marker，plateau 越低：mating pair 一直在散开，转移得越久、断掉的越多。', 'ts', 'start');
  return svgA(560, 422, o,'动图：Hfr 把 chromosome 从 origin 开始推进 F⁻，azi 在 9 分钟、ton 在 11 分钟、lac 在 18 分钟、gal 在 25 分钟进入；下方每个 marker 的 recombinant 比例在它进入之后才升起来，plateau 依次是 91%、72%、52%、29%');
}

// ---------- 第 4 站：transformation 的吸收与整合 ----------
function transformFig() {
  let o = '';
  const xa = 292, xb = 512, mid = (xa + xb) / 2, W = xb - xa;
  const steps = [
    '① 一段 donor 的 double-stranded DNA',
    '② 一条 strand 被降解，',
    '③ 进来的 strand 和 chromosome',
    '④ 两次 crossover 把它换进去，',
  ];
  const steps2 = ['   贴在 competent cell 的表面', '   另一条穿过膜进来', '   上同源的一段配对', '   换下来的那条被降解'];
  const ys = [64, 134, 210, 286];
  ys.forEach((y, i) => {
    o += text(14, y - 6, steps[i], 'tb', 'start');
    o += text(14, y + 12, steps2[i], 'ts', 'start');
    if (i < 2) {
      // 膜
      o += line(xa - 24, y + 14, xb + 16, y + 14, 'ink-b');
      o += text(xa - 30, y + 18, 'cell 膜', 'ts', 'end');
    }
    if (i === 0) {
      o += line(xa, y - 10, xb, y - 10, 'ln') + line(xa, y - 2, xb, y - 2, 'ln');
      o += text(xb, y - 20, 'donor 片段（a⁺）', 'tl', 'end');
    }
    if (i === 1) {
      for (let k = 0; k < 7; k++) o += line(xa + (k * W) / 7, y - 16, xa + (k * W) / 7 + W / 12, y - 16, 'dash');
      o += text(mid, y - 26, '这一条被降解', 'ts', 'middle');
      o += line(xa, y - 4, xb, y - 4, 'ln');
      o += arrow(mid, y - 2, mid, y + 12, 'mute');
    }
    if (i >= 2) {
      o += line(xa - 50, y + 10, xb + 20, y + 10, 'ink-b');
      if (i === 2) o += text(xb + 20, y + 28, 'chromosome', 'ts', 'end');
    }
    if (i === 2) {
      o += line(xa, y - 6, xb, y - 6, 'ln');
      for (let k = 0; k < 11; k++) o += line(xa + 10 + (k * W) / 11, y - 4, xa + 10 + (k * W) / 11, y + 8, 'dash');
      o += text(mid, y - 16, '进来的 strand（a⁺）', 'tl', 'middle');

    }
    if (i === 3) {
      o += line(xa, y + 10, xb, y + 10, 'ln');
      for (const xx of [xa, xb]) o += line(xx - 9, y, xx + 9, y + 20, 'ink') + line(xx + 9, y, xx - 9, y + 20, 'ink');
      o += text(mid, y - 6, '换进来的 a⁺', 'tl', 'middle');
      o += line(xa + 40, y + 34, xb - 40, y + 34, 'dash');
      o += text(mid, y + 50, '被换下来的 a⁻那条，被 enzyme 降解', 'ts', 'middle');
    }
  });
  o += text(14, 364, '两次 crossover 的位置决定换进去多长一段；两个 gene 都落在同一个片段里，才可能一起换进去。', 'ts', 'start');
  return svg(560, 372, o, '一段 donor 的 double-stranded DNA 贴在 competent cell 表面，一条 strand 被降解、另一条进入 cell 并和 chromosome 上同源的一段配对，再由两次 crossover 换进 chromosome');
}

// ---------- 第 4 站：cotransformation 定顺序 ----------
function cotrans() {
  let o = '';
  const pairs = [['c', 'd', 1], ['a', 'd', 1], ['b', 'e', 1], ['c', 'e', 1], ['d', 'e', 0], ['b', 'c', 0], ['a', 'c', 0]];
  o += text(14, 22, '两两检查：哪几对会一起转进去', 'tb', 'start');
  pairs.forEach(([p, q, ok], i) => {
    const x = 26 + (i % 4) * 134, y = 50 + Math.floor(i / 4) * 40;
    o += rect(x, y - 15, 112, 30, ok ? 'wash' : 'paper-f', 7) + rect(x, y - 15, 112, 30, 'frame', 7);
    o += text(x + 12, y + 5, p + '⁺ 与 ' + q + '⁺', 't', 'start');
    o += text(x + 100, y + 5, ok ? '一起' : '不', ok ? 'tl' : 'ts', 'end');
  });
  // 推出的顺序
  const order = ['a', 'd', 'c', 'e', 'b'], X = lin(0, 4, 110, 450), y0 = 182;
  o += line(X(-0.4), y0, X(4.4), y0, 'ink-b');
  order.forEach((g, i) => { o += line(X(i), y0 - 9, X(i), y0 + 9, 'ink-b') + text(X(i), y0 + 28, g, 'tb', 'middle'); });
  // 相邻的一对画一条弧（cotransform），隔一个的画虚线
  const arc = (i, j, up, cls) => {
    const xa = X(i), xb = X(j), h = up ? -40 : 52;
    return path(`M ${f1(xa)} ${f1(y0 + (up ? -10 : 10))} Q ${f1((xa + xb) / 2)} ${f1(y0 + h)} ${f1(xb)} ${f1(y0 + (up ? -10 : 10))}`, cls);
  };
  [[0, 1], [1, 2], [2, 3], [3, 4]].forEach(([i, j]) => { o += arc(i, j, true, 'ln'); });
  [[1, 3], [2, 4]].forEach(([i, j]) => { o += arc(i, j, false, 'ln-dash'); });
  o += text(X(2), y0 - 52, '相邻的四对：一起转进去', 'tl', 'middle');
  o += text(X(2.5), y0 + 66, '隔着一个的：不会', 'ts', 'middle');
  o += text(14, 272, 'c 与 d、c 与 e 都 cotransform 而 d 与 e 不，所以 c 在中间；b 与 e 而不与 c，所以 b 在 e 外侧；', 'ts', 'start');
  o += text(14, 290, 'a 与 d 而不与 c，所以 a 在 d 外侧。只剩一种排法。', 'ts', 'start');
  return svg(560, 298, o, 'Cotransformation 定顺序：c 与 d、a 与 d、b 与 e、c 与 e 会一起转进去，d 与 e、b 与 c、a 与 c 不会，唯一相容的顺序是 a–d–c–e–b');
}

// ---------- 第 5 站：Luria–Delbrück 两种 hypothesis ----------
function luria() {
  let o = '';
  const tree = (x0, w, mut, label) => {
    // 4 代：1, 2, 4, 8 个 cell；mut = {gen, idx}，该 cell 及其后代是 mutant；或 'end' 列表：最后才变
    let q = '';
    const gy = (g) => 64 + g * 34, gx = (g, i) => x0 + (w * (i + 0.5)) / 2 ** g;
    const isMut = (g, i) => (mut.gen !== undefined && g >= mut.gen && i >> (g - mut.gen) === mut.idx) || (mut.end && g === 3 && mut.end.includes(i));
    for (let g = 0; g < 4; g++) for (let i = 0; i < 2 ** g; i++) {
      if (g) q += line(gx(g - 1, i >> 1), gy(g - 1) + 5, gx(g, i), gy(g) - 5, 'mute');
    }
    let cnt = 0;
    for (let g = 0; g < 4; g++) for (let i = 0; i < 2 ** g; i++) { const m = isMut(g, i); if (g === 3 && m) cnt++; q += circle(gx(g, i), gy(g), 4.5, m ? 'ln-f' : 'paper'); }
    q += text(x0 + w / 2, gy(3) + 24, '存活 ' + cnt, 'ts', 'middle');
    return q;
  };
  o += text(140, 22, 'Hypothesis 1：碰到 phage 才变', 'tb', 'middle') + text(420, 22, 'Hypothesis 2：生长时随机变', 'tb', 'middle');
  o += tree(20, 76, { end: [5] }) + tree(102, 76, { end: [] }) + tree(184, 76, { end: [2] });
  o += tree(300, 76, { gen: 1, idx: 0 }) + tree(382, 76, { end: [] }) + tree(464, 76, { gen: 3, idx: 6 });
  o += line(280, 40, 280, 210, 'grid');
  o += text(140, 222, '每个 cell 在 plating 时独立地以小概率变：', 'ts', 'middle') + text(140, 238, '各管数目都差不多，variance ≈ mean', 'ts', 'middle');
  o += text(420, 222, '早发生的 mutation 带出一整支 clone：', 'ts', 'middle') + text(420, 238, '多数管很少，偶尔一管极多，variance ≫ mean', 'ts', 'middle');
  return svg(560, 246, o, '两种 hypothesis 下的三管培养：左边 resistance 在接触 phage 时才出现，各管数目相近；右边 mutation 在生长中随机出现，早出现的那一管有一半后代都 resistant');
}

// ---------- 第 5 站：nondisjunction ----------
function nondisj() {
  let o = '';
  // 一个 chromosome 画成竖条；replicated = 两条并排
  const chr = (x, y, cls, rep) => (rep ? rect(x - 5, y - 13, 4, 26, cls, 2) + rect(x + 1, y - 13, 4, 26, cls, 2) : rect(x - 2, y - 13, 4, 26, cls, 2));
  const panel = (x0, title, mode) => {
    let q = text(x0 + 130, 22, title, 'tb', 'middle');
    const top = [x0 + 130, 66];
    q += circle(...top, 30, 'paper') + chr(top[0] - 9, top[1], 'solid', true) + chr(top[0] + 9, top[1], 'solid2', true);
    const mid = [[x0 + 65, 140], [x0 + 195, 140]];
    q += arrow(top[0] - 18, top[1] + 26, mid[0][0] + 12, mid[0][1] - 26, 'mute') + arrow(top[0] + 18, top[1] + 26, mid[1][0] - 12, mid[1][1] - 26, 'mute');
    const mi = mode === 'I' ? [['solid', 'solid2'], []] : [['solid'], ['solid2']];
    mid.forEach(([x, y], i) => { q += circle(x, y, 24, 'paper'); mi[i].forEach((c, k) => { q += chr(x + (mi[i].length === 2 ? (k ? 8 : -8) : 0), y, c, true); }); });
    // meiosis II
    const gam = [];
    mid.forEach(([x], i) => {
      const cs = mi[i];
      let a, b;
      if (mode === 'II' && i === 1) { a = [cs[0], cs[0]]; b = []; } else { a = cs; b = cs; }
      gam.push([x - 32, a], [x + 32, b]);
    });
    gam.forEach(([x, cs], k) => {
      const y = 222, par = mid[k >> 1];
      q += arrow(par[0] + (k % 2 ? 10 : -10), par[1] + 22, x + (k % 2 ? -6 : 6), y - 20, 'mute');
      q += circle(x, y, 17, 'paper');
      cs.forEach((c, j) => { q += chr(x + (cs.length === 2 ? (j ? 5 : -5) : 0), y, c, false); });
      const lbl = cs.length === 2 ? 'n + 1' : cs.length === 0 ? 'n − 1' : 'n';
      q += text(x, y + 34, lbl, cs.length === 1 ? 'ts' : 'tl', 'middle');
    });
    return q;
  };
  o += panel(10, 'meiosis I 时 homolog 没分开', 'I') + panel(290, 'meiosis II 时 sister 没分开', 'II');
  o += line(280, 40, 280, 250, 'grid');
  o += text(140, 286, '4 个 gamete 全部不正常', 'ts', 'middle') + text(420, 286, '一半正常，一半不正常', 'ts', 'middle');
  o += text(280, 306, '深浅两色是来自两个 parent 的那一对 homolog。n + 1 的 gamete 受精后就是 trisomy。', 'ts', 'middle');
  return svg(560, 314, o, 'Nondisjunction：meiosis I 时一对 homolog 没有分开，四个 gamete 两个多一条、两个少一条；meiosis II 时一个细胞里的 sister chromatid 没分开，四个 gamete 两个正常、一个多一条、一个少一条');
}

// ---------- 第 6 站：lac operon 的四种状态（动图） ----------
function lacA() {
  const yD = 140;
  const seg = { I: [16, 78], cap: [128, 150], P: [150, 186], O: [186, 214], Z: [214, 356], Y: [356, 446], A: [446, 520] };
  let o = line(10, yD, 540, yD, 'ink-b');
  const box = (k, lab, cls) => { const [a, b] = seg[k]; o += rect(a, yD - 11, b - a, 22, 'paper-f', 3) + rect(a, yD - 11, b - a, 22, cls, 3) + text((a + b) / 2, yD + 5, lab, cls === 'solid2' ? 'tw' : 't', 'middle'); };
  box('I', 'lacI', 'wash2'); box('cap', '', 'wash2'); box('P', 'P', 'paper-f'); box('O', 'O', 'paper-f'); box('Z', 'lacZ', 'wash2'); box('Y', 'lacY', 'wash2'); box('A', 'lacA', 'wash2');
  o += rect(seg.cap[0], yD - 11, 64 + 22, 22, 'frame', 3) + rect(seg.Z[0], yD - 11, seg.A[1] - seg.Z[0], 22, 'frame', 3);
  o += text(139, yD + 30, 'CAP site', 'ts', 'middle') + text(200, yD + 46, 'promoter / operator', 'ts', 'middle');
  o += text(47, yD + 30, '一直在少量表达', 'ts', 'middle') + text(367, yD + 30, '同一条 mRNA 上的三个 gene', 'ts', 'middle');
  // 四种状态：[glucose, lactose]
  const S = [[0, 1], [1, 1], [1, 0], [0, 0]];
  const dur = [3.2, 2.6, 2.6, 2.6], pre = 1.2; // pre：动画最后一段把 ON 状态的前半截补上
  const T = dur.reduce((a, b) => a + b, 0) + pre;
  const w = [0, dur[0], dur[0] + dur[1], dur[0] + dur[1] + dur[2], T - pre, T].map((t) => t / T);
  const stOf = (k) => (k === 4 ? 0 : k); // 第 5 段又是 ON
  const ktS = w.slice(0, 5);
  const stateOn = (i) => [0, 1, 2, 3, 4].map((k) => stOf(k) === i);
  // 状态说明
  const desc = [
    ['没有 glucose，有 lactose', 'repressor 被 allolactose 拉走，CAP–cAMP 帮 polymerase 坐稳：大量 transcription'],
    ['有 glucose，也有 lactose', 'repressor 走了，但 cAMP 低、CAP 不结合：polymerase 很少启动，只有少量'],
    ['有 glucose，没有 lactose', 'repressor 坐在 operator 上：没有 transcription'],
    ['没有 glucose，没有 lactose', 'CAP–cAMP 在，但 repressor 挡着：仍然没有 transcription'],
  ];
  desc.forEach(([a, b], i) => { o += showOn(text(280, 22, a, 'tb', 'middle') + text(280, 42, b, 'ts', 'middle'), stateOn(i), ktS, T); });
  // repressor：坐在 O 上（无 lactose）或飘在上面并带着 allolactose
  const rep = (bound) => {
    const x = bound ? 182 : 300, y = bound ? yD - 32 : 60;
    let q = rect(x, y, 36, 22, 'solid2', 7) + text(x + 18, y + 15, 'LacI', 'tw', 'middle');
    if (!bound) for (const [dx, dy] of [[-4, 4], [40, 6], [10, -5], [28, 26]]) q += circle(x + dx, y + dy, 4, 'ln-f');
    if (!bound) q += text(x + 52, y + 15, 'allolactose 结合后离开 DNA', 'ts', 'start');
    return q;
  };
  const cap = rect(124, yD - 32, 30, 20, 'solid', 6) + text(139, yD - 18, 'CAP', 'tw', 'middle');
  [0, 1, 2, 3].forEach((i) => {
    const [glc, lac] = S[i];
    let g = rep(!lac);
    if (!glc) g += cap;
    if (glc && lac) g += `<ellipse cx="168" cy="${yD - 30}" rx="18" ry="11" class="dash"/>` + text(168, yD - 48, '偶尔', 'ts', 'middle');
    if (!lac && !glc) g += `<ellipse cx="168" cy="${yD - 58}" rx="18" ry="11" class="paper"/>` + text(168, yD - 54, 'pol', 'ts', 'middle') + text(194, yD - 54, 'operator 被占着，transcription 起不来', 'ts', 'start');
    o += showOn(g, stateOn(i), ktS, T);
  });
  // ON 状态：polymerase 沿 Z Y A 移动，mRNA 跟着长
  const tA = [0, dur[0] / T, (T - pre) / T, 1];
  const xs = [300, 520, 186, 300];
  const onlyOn = (body) => showOn(body, [true, false, true, true], [0, dur[0] / T, (T - pre) / T, 1], T);
  // 时间段：0→dur0 走 300→520；隐藏；T-pre→T 走 186→300
  const pX = [300, 520, 520, 186, 300], pk = [0, dur[0] / T, (T - pre) / T - 1e-4, (T - pre) / T, 1];
  o += onlyOn(`<ellipse cx="${pX[0]}" cy="${yD - 18}" rx="18" ry="11" class="paper">${anim('cx', pX, pk, T)}</ellipse>` + apath(pX.map((x) => d([[200, yD - 34], [Math.max(200, x - 16), yD - 34]])), pk, T, 'ln'));
  o += onlyOn(text(206, yD - 42, 'mRNA', 'tl', 'start'));
  o += onlyOn(`<text x="${pX[0]}" y="${yD - 14}" class="ts" text-anchor="middle">pol${anim('x', pX, pk, T)}</text>`);
  void tA; void xs;
  return svgA(560, yD + 58, o, '动图：lac operon 在四种条件下的状态轮流出现。没有 glucose 有 lactose 时 repressor 离开 operator、CAP 结合，RNA polymerase 沿 lacZ、lacY、lacA 大量 transcription；有 lactose 有 glucose 时只有少量；没有 lactose 时 repressor 挡住 operator，没有 transcription');
}

// ---------- 第 6 站：merodiploid 的 cis / trans ----------
function cistrans() {
  let o = '';
  const panel = (x0, title, rows, verdict) => {
    let q = text(x0 + 130, 22, title, 'tb', 'middle');
    q += rect(x0 + 4, 34, 252, 168, 'frame', 18);
    rows.forEach(([name, Oc, Zp], r) => {
      const y = 84 + r * 64;
      q += text(x0 + 16, y - 30, name, 'ts', 'start');
      q += line(x0 + 16, y, x0 + 244, y, 'ink-b');
      q += rect(x0 + 46, y - 10, 30, 20, 'paper-f', 3) + rect(x0 + 46, y - 10, 30, 20, Oc ? 'wash-strong' : 'paper-f', 3) + rect(x0 + 46, y - 10, 30, 20, 'frame', 3) + text(x0 + 61, y + 5, Oc ? 'Oᶜ' : 'O⁺', 't', 'middle');
      q += rect(x0 + 80, y - 10, 100, 20, 'paper-f', 3) + rect(x0 + 80, y - 10, 100, 20, 'wash2', 3) + text(x0 + 130, y + 5, Zp ? 'lacZ⁺' : 'lacZ⁻', 't', 'middle');
      if (!Oc) q += rect(x0 + 44, y - 32, 34, 18, 'solid2', 6) + text(x0 + 61, y - 19, 'LacI', 'tw', 'middle');
      else { q += arrow(x0 + 82, y - 17, x0 + 176, y - 17, 'ln'); q += text(x0 + 186, y - 22, Zp ? '活的' : '坏的', Zp ? 'tl' : 'ts', 'start'); q += text(x0 + 186, y - 8, 'enzyme', 'ts', 'start'); }
    });
    q += text(x0 + 130, 222, verdict, 'tl', 'middle');
    return q;
  };
  o += panel(10, 'Oᶜ lacZ⁺ / F′ O⁺ lacZ⁻（不加 inducer）', [['chromosome', true, true], ['F′', false, false]], '有 β-galactosidase：constitutive');
  o += panel(290, 'Oᶜ lacZ⁻ / F′ O⁺ lacZ⁺（不加 inducer）', [['chromosome', true, false], ['F′', false, true]], '没有活的 β-galactosidase');
  o += text(280, 246, '同一个 cell 里 repressor 能游到两条 DNA 上，可 Oᶜ 只让自己身后的 lacZ 不受管：operator 只管 cis。', 'ts', 'middle');
  return svg(560, 254, o, '两个 merodiploid：Oᶜ 和 lacZ⁺ 在同一条 DNA 上时不加 inducer 也有 β-galactosidase；Oᶜ 和 lacZ⁻ 在同一条上、lacZ⁺ 在受 repressor 控制的 O⁺ 后面时没有');
}

// ---------- 第 7 站：PCR（动图） ----------
function pcrA() {
  const sx = lin(0, 100, 24, 330), a = 30, b = 70, pL = 7;
  // strand：{s, e, sense}；template 0..100
  let duplexes = [[{ s: 0, e: 100, sense: true, orig: true }, { s: 0, e: 100, sense: false, orig: true }]];
  const history = [duplexes];
  for (let c = 1; c <= 3; c++) {
    const nd = [];
    for (const dpx of duplexes) for (const st of dpx) {
      const nw = st.sense ? { s: st.s, e: b, sense: false } : { s: a, e: st.e, sense: true };
      nd.push(st.sense ? [st, nw] : [nw, st]);
    }
    duplexes = nd; history.push(nd);
  }
  const yOf = (k) => 74 + k * 27;
  const strandD = (st, y) => d([[sx(st.s), y], [sx(st.e), y]]);
  const head = (st, y) => (st.sense ? poly([[sx(st.e) + 1, y], [sx(st.e) - 6, y - 3.5], [sx(st.e) - 6, y + 3.5]], st.orig ? 'ink-f' : 'ln-f') : poly([[sx(st.s) - 1, y], [sx(st.s) + 6, y - 3.5], [sx(st.s) + 6, y + 3.5]], st.orig ? 'ink-f' : 'ln-f'));
  const isExact = (st) => st.s === a && st.e === b;
  // 时间线：先停在第 3 cycle 结束的样子，再从头演
  const stages = [['final', 3]];
  for (let c = 1; c <= 3; c++) stages.push(['den', c], ['ann', c], ['ext', c]);
  const dur = { final: 2.4, den: 0.9, ann: 0.9, ext: 1.3 };
  const st0 = []; let t = 0; for (const s of stages) { st0.push(t); t += dur[s[0]]; } const T = t;
  const kt = st0.map((v) => v / T);
  const drawDuplexes = (dps, mode) => {
    // mode: 'full' 已配对；'den' 全分开；'ann' 分开 + primer；'ext' 由 primer 长到整段（动画）
    let g = '';
    dps.forEach((dpx, k) => {
      const y0 = yOf(k), sep = mode === 'full' ? 0 : 4;
      const ex = mode === 'full' && isExact(dpx[0]) && isExact(dpx[1]);
      if (ex) g += rect(sx(a) - 4, y0 - 6, sx(b) - sx(a) + 8, 19, 'wash', 4);
      dpx.forEach((st, j) => {
        const y = y0 + (j ? 7 + sep : -sep);
        const isNew = !st.orig && st.born === mode;
        g += path(strandD(st, y), st.orig ? 'ink' : 'ln') + head(st, y);
      });
    });
    return g;
  };
  // 每个 stage 一个 group
  const groups = stages.map(([kind, c], i) => {
    const prev = history[c - 1], next = history[c];
    let g = '';
    if (kind === 'final') g = drawDuplexes(history[3], 'full');
    else {
      // 用 next 的排列：next[2k], next[2k+1] 来自 prev[k] 的两条 strand
      next.forEach((dpx, k) => {
        const tpl = dpx[0].sense ? dpx[0] : dpx[1].sense ? null : null; void tpl;
        const old = prev[k >> 1][k & 1];
        const nw = old.sense ? dpx[1] : dpx[0];
        const y0 = yOf(k), yOld = old.sense ? y0 : y0 + 7, yNew = old.sense ? y0 + 7 : y0;
        g += path(strandD(old, yOld + (kind === 'den' ? (old.sense ? -2 : 2) : 0)), old.orig ? 'ink' : 'ln') + head(old, yOld + (kind === 'den' ? (old.sense ? -2 : 2) : 0));
        if (kind === 'ann') {
          const pr = nw.sense ? { s: a, e: a + pL, sense: true } : { s: b - pL, e: b, sense: false };
          g += line(sx(pr.s), yNew, sx(pr.e), yNew, 'ln');
        }
        if (kind === 'ext') {
          const t0 = st0[i] / T, t1 = (st0[i] + dur.ext * 0.85) / T, tEnd = (st0[i] + dur.ext) / T;
          const short = nw.sense ? d([[sx(a), yNew], [sx(a + pL), yNew]]) : d([[sx(b - pL), yNew], [sx(b), yNew]]);
          const full = strandD(nw, yNew);
          const ktE = [0, t0, t1, 1];
          g += apath([short, short, full, full], ktE, T, 'ln');
          g += `<g opacity="0">${head(nw, yNew)}${ashow([false, false, true, true], ktE, T)}</g>`;
          void tEnd;
        }
      });
    }
    return g;
  });
  let o = '';
  // primer 位置
  o += line(sx(a), 50, sx(a), 288, 'grid') + line(sx(b), 50, sx(b), 288, 'grid');
  o += text(sx(a), 44, 'forward primer', 'ts', 'middle') + text(sx(b), 44, 'reverse primer', 'ts', 'middle');
  o += text(sx(50), 22, 'target', 'tb', 'middle');
  groups.forEach((g, i) => { o += frameG(g, i, kt, T); });
  // 右边的说明
  const X = 350;
  const label = { final: '第 3 个 cycle 结束', den: '95 °C：两条 strand 分开', ann: '55 °C：primer 结合', ext: '72 °C：polymerase 延伸' };
  stages.forEach(([kind, c], i) => {
    const on = stages.map((_, j) => j === i);
    o += showOn(text(X, 74, kind === 'final' ? label.final : `cycle ${c}`, 'tb', 'start') + (kind === 'final' ? '' : text(X, 94, label[kind], 'ts', 'start')), on, kt, T);
  });
  const rows = [[1, 2, 0], [2, 4, 0], [3, 8, 2], [4, 16, 8], [5, 32, 22], [30, '≈ 1.07×10⁹', '≈ 1.07×10⁹']];
  const cx = [X + 16, X + 72, X + 152];
  o += text(cx[0], 136, 'cycle', 'ts', 'middle') + text(cx[1], 136, 'duplex', 'ts', 'middle') + text(cx[2], 128, '两条都恰好', 'ts', 'middle') + text(cx[2], 144, '是 target 长', 'ts', 'middle');
  rows.forEach(([c, n, e], k) => { const y = 164 + k * 18; o += text(cx[0], y, String(c), 't', 'middle') + text(cx[1], y, String(n), 't', 'middle') + text(cx[2], y, String(e), 't', 'middle'); });
  o += text(X, 286, '浅底：两条 strand 都恰好是 target', 'ts', 'start');
  o += text(24, 304, '黑线是原来的 template，彩色线是 PCR 合成的 strand；箭头是 3′ 端。', 'ts', 'start');
  return svgA(560, 312, o, '动图：PCR 的前三个 cycle。每个 cycle 先加热分开 strand，再降温让两个 primer 结合，再由 polymerase 延伸；第 3 个 cycle 结束时有 8 个 duplex，其中 2 个两条 strand 都恰好从 forward primer 到 reverse primer');
}

// ---------- 第 7 站：CRISPR–Cas9（动图） ----------
export const CR = { decoy: 'ATCAGTATGCATGTACTAGT', dpam: 'AGG', fill: 'CTATCAT', proto: 'GACTTCAGTACAGTCATAGC', pam: 'TGG', tail: 'A' };
function crisprA() {
  const top = CR.decoy + CR.dpam + CR.fill + CR.proto + CR.pam + CR.tail; // 54 nt
  const bot = comp(top), n = top.length, dx = 9.6, x0 = 22, yT = 128, yB = 154;
  const X = (i) => x0 + i * dx;
  const pStart = 30, pamAt = 50, cutAfter = 46; // cut 在 46 和 47 之间
  const guide = toRNA(CR.proto);
  // Cas9 的位置用它右缘对准的 PAM 末端表示
  const cas = (pamEnd) => X(pamEnd) + 8; // 右缘
  const W = 23 * dx + 18;
  // 状态序列
  const st = [
    ['cut', 1.8], ['split', 1.6], ['scan0', 1.3], ['decoy', 1.8], ['scan1', 1.0], ['bind', 1.8],
  ];
  const t0 = []; let t = 0; for (const [, dd] of st) { t0.push(t); t += dd; } const T = t;
  const kt = t0.map((v) => v / T);
  const idx = (k) => st.findIndex((s) => s[0] === k);
  // Cas9 外框的 x（右缘）随时间：cut/split 停在 target；scan0 从左侧滑到 decoy；decoy 停；scan1 滑到 target；bind 停
  const rEdgeTarget = cas(pamAt + 2), rEdgeDecoy = cas(22), rEdgeStart = cas(14);
  const xk = [0, t0[idx('scan0')], t0[idx('scan0')] + 1e-3, t0[idx('decoy')], t0[idx('scan1')], t0[idx('bind')], T].map((v) => v / T);
  const xr = [rEdgeTarget, rEdgeTarget, rEdgeStart, rEdgeDecoy, rEdgeDecoy, rEdgeTarget, rEdgeTarget];
  let o = '';
  // DNA 的两种画法：完整 / 切开分离
  const dna = (split, rloop) => {
    let g = '';
    for (let i = 0; i < n; i++) {
      const sh = split && i > cutAfter ? 12 : 0;
      const up = rloop && i >= pStart && i < pamAt ? -26 : 0;
      g += text(X(i) + sh, yT + up, top[i], (i >= pamAt && i < pamAt + 3) || (i >= 20 && i < 23) ? 'tl' : 't', 'middle');
      g += text(X(i) + sh, yB, bot[i], 't', 'middle');
    }
    if (rloop) for (let i = 0; i < 20; i++) g += text(X(pStart + i) + (split && pStart + i > cutAfter ? 12 : 0), yT + 2, guide[i], 'tl', 'middle');
    return g;
  };
  const ends = (split) => text(x0 - 10, yT, "5′", 'ts', 'end') + text(x0 - 10, yB, "3′", 'ts', 'end') + text(X(n - 1) + 10 + (split ? 12 : 0), yT, "3′", 'ts', 'start') + text(X(n - 1) + 10 + (split ? 12 : 0), yB, "5′", 'ts', 'start');
  const plainOn = st.map(([k]) => k.startsWith('scan') || k === 'decoy');
  o += showOn(dna(false, false) + ends(false), plainOn, kt, T);
  o += showOn(dna(false, true) + ends(false), st.map(([k]) => k === 'bind' || k === 'cut'), kt, T);
  o += showOn(dna(true, true) + ends(true), st.map(([k]) => k === 'split'), kt, T);
  // cut 标记
  const cx = (X(cutAfter) + X(cutAfter + 1)) / 2;
  o += showOn(line(cx, yT - 12, cx, yB + 6, 'ln-dash') + text(cx - 10, yB + 52, '切在 PAM 上游 3 bp：blunt end', 'ts', 'middle'), st.map(([k]) => k === 'cut'), kt, T);
  // Cas9 外框（带 guide 的那一团）
  o += `<rect x="${f1(xr[0] - W)}" y="${yT - 64}" width="${f1(W)}" height="${yB - yT + 84}" rx="22" class="wash">${anim('x', xr.map((x) => f1(x - W)), xk, T)}</rect>`;
  o += `<text x="${f1(xr[0] - W / 2)}" y="${yT - 48}" class="ts" text-anchor="middle">Cas9 + guide RNA${anim('x', xr.map((x) => f1(x - W / 2)), xk, T)}</text>`;
  // 下方标注
  const bracket = (i0, i1, s, cls = 'ts') => line(X(i0) - 4, yB + 14, X(i1) + 4, yB + 14, 'mute') + line(X(i0) - 4, yB + 10, X(i0) - 4, yB + 18, 'mute') + line(X(i1) + 4, yB + 10, X(i1) + 4, yB + 18, 'mute') + text((X(i0) + X(i1)) / 2, yB + 32, s, cls, 'middle');
  o += bracket(pStart, pamAt - 1, 'target：和 guide 一样的 20 nt') + bracket(pamAt, pamAt + 2, 'PAM', 'tl') + bracket(20, 22, 'PAM', 'tl');
  const msg = {
    cut: 'Guide 的 20 nt 全部配上，Cas9 两个 nuclease domain 各切一条 strand',
    split: '得到 double-strand break；之后由 cell 自己修（NHEJ 或 HDR）',
    scan0: 'Cas9 沿 DNA 找 NGG（PAM）；不靠 guide 找',
    decoy: '这里有 PAM（AGG），但旁边的序列和 guide 配不上：松开、继续走',
    scan1: '继续找下一个 PAM',
    bind: '又一个 PAM（TGG）：DNA 在这里打开，guide 和下面那条 strand 配对',
  };
  st.forEach(([k], i) => { o += showOn(text(280, 24, msg[k], 'ts', 'middle'), st.map((_, j) => j === i), kt, T); });
  o += text(280, 44, "Cas9 停下时，彩色字母是 guide RNA；被它顶开的那条 DNA strand 抬到上面一行", 'ts', 'middle');
  return svgA(560, 220, o, '动图：Cas9 带着 guide RNA 沿 DNA 扫描，先在一个 AGG 的 PAM 处停下但序列不配，松开；再到 TGG 的 PAM 处，guide 与 20 nt 的 target 配对，在 PAM 上游 3 bp 处把两条 strand 都切断，DNA 断成两段');
}


// ---------- 第 3 站：incomplete penetrance 的 pedigree ----------
export const PEN = 0.8;
function penetrance() {
  let o = '';
  const sq = (x, y, cls) => rect(x - 14, y - 14, 28, 28, cls);
  const ci = (x, y, cls) => circle(x, y, 14, cls);
  const yI = 46, yII = 136, yIII = 226;
  o += text(14, yI + 5, 'I', 'tb') + text(14, yII + 5, 'II', 'tb') + text(14, yIII + 5, 'III', 'tb');
  o += line(134, yI, 186, yI, 'ink') + sq(120, yI, 'solid') + ci(200, yI, 'paper');
  o += text(120, yI - 22, 'Aa（affected）', 'ts', 'middle') + text(200, yI - 22, 'aa', 'ts', 'middle');
  o += line(160, yI, 160, yII - 14, 'ink');
  o += sq(160, yII, 'paper') + text(160, yII + 32, 'II-1：unaffected', 'tb', 'middle');
  // P(Aa | unaffected)
  const prior = 0.5, pU = 1 - PEN, post = (prior * pU) / (prior * pU + prior * 1);
  const frac = (v) => { for (let q = 1; q <= 60; q++) { const pnum = Math.round(v * q); if (Math.abs(pnum / q - v) < 1e-9) return `${pnum}/${q}`; } return v.toFixed(3); };
  o += text(160, yII + 50, `P(Aa) = ${frac(post)}`, 'tl', 'middle');
  o += line(174, yII, 286, yII, 'ink') + ci(300, yII, 'paper') + text(300, yII + 32, 'aa', 'ts', 'middle');
  o += line(230, yII, 230, yIII - 14, 'ink') + rect(216, yIII - 14, 28, 28, 'wash', 0) + text(230, yIII + 5, '?', 'tb', 'middle');
  const child = post * 0.5 * PEN;
  o += text(258, yIII - 4, `P(affected) = ${frac(post)} × 1/2 × ${PEN}`, 'tl', 'start') + text(258, yIII + 14, `= ${frac(child)}`, 'tl', 'start');
  o += text(350, yI - 4, `penetrance = ${PEN}：`, 'ts', 'start');
  o += text(350, yI + 14, `Aa 的人有 ${Math.round((1 - PEN) * 100)}% 不发病`, 'ts', 'start');
  o += text(350, yII - 4, '出生前 Aa : aa = 1/2 : 1/2', 'ts', 'start');
  o += text(350, yII + 14, `unaffected：1/2 × ${f1(pU)} 对 1/2 × 1`, 'ts', 'start');
  return svg(560, 250, o, 'Incomplete penetrance 的 pedigree：affected 的 Aa father 与 aa mother 生下 unaffected 的儿子 II-1，他是 Aa 的概率降为 1/6；他与 aa 的人结婚，孩子 affected 的概率是 1/15');
}

// ---------- 第 4 站：P1 cotransduction 的四类 transductant ----------
function transduce() {
  let o = '';
  const xs = { A: 230, B: 320, C: 410 }, xl = 180, xr = 460;
  const gaps = { L: 205, AB: 275, BC: 365, R: 435 };
  const rows = [
    ['A⁺B⁺C⁺', ['L', 'R'], '+++'],
    ['A⁺B⁺C⁻', ['L', 'BC'], '++-'],
    ['A⁺B⁻C⁻', ['L', 'AB'], '+--'],
    ['A⁺B⁻C⁺', ['L', 'AB', 'BC', 'R'], '+-+'],
  ];
  o += text(xs.A, 20, 'A', 'tb', 'middle') + text(xs.B, 20, 'B', 'tb', 'middle') + text(xs.C, 20, 'C', 'tb', 'middle');
  rows.forEach(([name, xo, res], r) => {
    const y = 50 + r * 62, yD = y, yR = y + 22;
    if (r === 3) o += rect(4, y - 16, 552, 56, 'wash', 8);
    o += text(14, y + 16, name, 'tb', 'start');
    o += line(xl, yD, xr, yD, 'ln') + line(110, yR, 500, yR, 'ink-b');
    for (const g of ['A', 'B', 'C']) {
      o += circle(xs[g], yD, 4, 'ln-f') + circle(xs[g], yR, 4, 'ink-f');
    }
    for (const k of xo) { const x = gaps[k]; o += line(x - 8, yD + 3, x + 8, yR - 3, 'ink') + line(x + 8, yD + 3, x - 8, yR - 3, 'ink'); }
    // 结果：每个 gene 最后是谁的 allele
    const lab = res.split('').map((c, i) => 'ABC'[i] + (c === '+' ? '⁺' : '⁻')).join(' ');
    o += text(512, y + 6, `${xo.length} 次`, xo.length === 4 ? 'tl' : 'ts', 'start') + text(512, y + 22, 'crossover', 'ts', 'start');
    void lab;
  });
  o += text(xl, 300, '彩色线：phage 带进来的 donor 片段（A⁺B⁺C⁺）', 'ts', 'start');
  o += text(xl, 318, '黑线：recipient 的 chromosome（A⁻B⁻C⁻）；X 是 crossover 的位置。', 'ts', 'start');
  o += text(xl, 336, '要两端换成 ⁺、中间的 B 留下 B⁻，必须 4 次 crossover。', 'ts', 'start');
  return svg(560, 344, o, 'P1 transduction 的四类 A+ transductant：A+B+C+、A+B+C−、A+B−C− 各需要两次 crossover，A+B−C+ 需要四次，最少见，由此可知 B 在中间');
}

// 一条有厚度的 worm：沿正弦曲线取样，向两侧各偏移出轮廓；头尖尾尖
function wormBody(x, y, w, amp = 15, th = 5.5) {
  const n = 48, top = [], bot = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, X = x + u * w, Y = y + amp * Math.sin(u * 2.1 * Math.PI);
    const dY = amp * 2.1 * Math.PI * Math.cos(u * 2.1 * Math.PI) / w;
    const L = Math.hypot(1, dY), nx = -dY / L, ny = 1 / L;
    const t = th * Math.sin(Math.PI * Math.min(1, Math.max(0.04, u))) ** 0.45;
    top.push([X + nx * t, Y + ny * t]); bot.push([X - nx * t, Y - ny * t]);
  }
  const pts = top.concat(bot.reverse());
  return poly(pts, 'wash-strong') + poly(pts, 'frame');
}

// ---------- 第 8 站：Fire 与 Mello 的三组注射 ----------
function rnaiFig() {
  let o = '';
  // 一只 worm：细长的 S 形身体，中间标出 gonad
  const worm = wormBody;
  o += text(14, 20, '往 gonad 里注射，看后代的 phenotype', 'tb', 'start');
  o += worm(40, 58, 230);
  o += text(40, 86, 'C. elegans 成虫', 'ts', 'start');
  o += arrow(150, 108, 150, 70, 'ln') + text(156, 104, '注射', 'tl', 'start');
  o += text(300, 44, 'unc-22 失效的 worm 会不停抽搐（twitching），', 'ts', 'start');
  o += text(300, 62, '肉眼就能数有多少后代在抽。', 'ts', 'start');
  // 四组的条形
  const rows = [
    ['只有 sense strand', 1, '3.6 × 10⁶ 个分子'],
    ['只有 antisense strand', 11, '3.6 × 10⁶ 个分子'],
    ['两条退火成的 dsRNA', 100, '3.6 × 10⁶ 个分子'],
    ['dsRNA，剂量低 120 倍', 30, '3 × 10⁴ 个分子'],
  ];
  const sx = lin(0, 100, 250, 480), yb = 140;
  o += text(250, yb - 14, '后代里抽搐的比例', 'ts', 'start');
  rows.forEach(([name, v, dose], i) => {
    const y = yb + i * 40;
    o += text(242, y + 5, name, i >= 2 ? 'tl' : 't', 'end');
    o += rect(sx(0), y - 10, sx(v) - sx(0), 20, i >= 2 ? 'solid' : 'wash2', 3);
    o += text(sx(v) + 8, y + 5, v + '%', i >= 2 ? 'tl' : 'ts', 'start');
    o += text(242, y + 21, dose, 'ts', 'end');
  });
  for (const v of [0, 50, 100]) o += line(sx(v), yb - 10, sx(v), yb + 3 * 40 + 12, 'grid') + text(sx(v), yb + 3 * 40 + 28, v + '%', 'ts', 'middle');
  o += text(14, 330, 'Antisense 单独给只有 11%；dsRNA 给到 1/120 的量还有 30%。按 antisense model，加进来的 sense 那条', 'ts', 'start');
  o += text(14, 348, '只会把 antisense 占住、让效果变差，实际相反。', 'ts', 'start');
  return svg(560, 356, o, 'Fire 与 Mello 的三组注射：同样剂量下只注射 sense strand 的后代 1% 抽搐，只注射 antisense 的 11%，注射 dsRNA 的 100%；dsRNA 稀释 120 倍后仍有 30%');
}

// ---------- 第 8 站：Dicer 与 RISC（动图） ----------
function dicerA() {
  const T = 14, N = 7;
  const kt = []; for (let i = 0; i < N; i++) kt.push(i / N);
  let o = '';
  const steps = [
    '整条路：dsRNA → Dicer → siRNA → RISC → 切断 mRNA',
    '① 长的 double-stranded RNA 进到 cell 里',
    '② Dicer 把它切成约 21–23 nt 的 siRNA',
    '③ 一条链装进 RISC，另一条丢掉',
    '④ RISC 靠这条链找到互补的 mRNA',
    '⑤ Argonaute 把 mRNA 切断，断片被降解',
    '⑥ RISC 没有被消耗，接着去找下一条 mRNA',
  ];
  steps.forEach((s, i) => {
    const on = kt.map((_, k) => k === i);
    o += `<g opacity="${i === 0 ? 1 : 0}">${text(280, 22, s, 'tb', 'middle')}${ashow(on, kt, T)}</g>`;
  });
  const yA = 76, yB = 150, yC = 222;
  const duplex = (x0, x1, y) => line(x0, y - 4, x1, y - 4, 'ln') + line(x0, y + 4, x1, y + 4, 'ln');
  const risc = (x, y, lab) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="26" ry="17" class="paper"/>` + text(x, y + 4, lab, 'ts', 'middle');
  // 第 0 帧：整条路一起画出来（静态截图看到的就是它）
  const overview = () => {
    let g = '';
    g += duplex(40, 180, yA) + text(110, yA - 18, '长 dsRNA', 'tl', 'middle');
    g += arrow(188, yA, 222, yA, 'mute') + risc(258, yA, 'Dicer');
    g += arrow(294, yA, 326, yA, 'mute');
    for (let j = 0; j < 4; j++) { const a = 336 + j * 54; g += duplex(a, a + 44, yA); }
    g += text(420, yA - 18, 'siRNA，每条 21–23 nt', 'ts', 'middle');
    g += arrow(420, yA + 16, 420, yB - 22, 'mute');
    g += risc(420, yB, 'RISC') + line(394, yB + 14, 446, yB + 14, 'ln');
    g += text(386, yB + 4, '装进去一条链', 'ts', 'end');
    g += line(60, yC, 520, yC, 'ink-b') + text(60, yC - 16, 'target mRNA', 'ts', 'start');
    g += risc(300, yC - 24, 'RISC');
    g += line(294, yC - 10, 306, yC + 10, 'ln') + line(306, yC - 10, 294, yC + 10, 'ln');
    g += text(340, yC + 38, 'Argonaute 在配上的地方切断，RISC 自己不消耗', 'tl', 'middle');
    g += arrow(420, yB + 20, 330, yC - 44, 'mute');
    return g;
  };
  // 每一帧画什么
  const body = (k0) => {
    const k = k0 - 1;
    if (k < 0) return overview();
    let g = '';
    if (k === 0) g += duplex(120, 440, yA) + text(280, yA - 20, '长 dsRNA', 'tl', 'middle');
    if (k >= 1) {
      // 切成 6 段
      for (let j = 0; j < 6; j++) { const a = 120 + j * 54, b = a + 44; g += duplex(a, b, yA); }
      if (k === 1) { g += risc(280, yA - 42, 'Dicer'); for (let j = 1; j < 6; j++) { const x = 114 + j * 54; g += line(x, yA - 14, x, yA + 14, 'dash'); } g += text(470, yA + 4, '每段 21–23 nt', 'ts', 'start'); }
    }
    if (k >= 2) {
      g += arrow(280, yA + 22, 280, yB - 26, 'mute');
      g += risc(200, yB, 'RISC') + line(174, yB + 14, 226, yB + 14, 'ln');
      if (k === 2) g += text(240, yB + 4, '装进去的是和 mRNA 互补的那条', 'ts', 'start') + line(320, yB - 14, 364, yB - 14, 'mute') + text(370, yB - 10, '另一条丢掉', 'ts', 'start');
    }
    if (k >= 3) {
      const mx = k >= 5 ? 300 : 120;
      g += line(60, yC, 520, yC, 'ink-b') + text(60, yC - 14, 'target mRNA', 'ts', 'start');
      if (k === 3) { g += risc(mx + 80, yC - 24, 'RISC'); for (let j = 0; j < 7; j++) g += line(mx + 54 + j * 9, yC - 10, mx + 54 + j * 9, yC - 2, 'dash'); }
      if (k === 4) { g += risc(mx + 80, yC - 24, 'RISC'); g += line(mx + 74, yC - 10, mx + 86, yC + 10, 'ln') + line(mx + 86, yC - 10, mx + 74, yC + 10, 'ln'); g += text(mx + 100, yC + 24, 'Argonaute 在这里切断', 'tl', 'start'); }
      if (k === 5) {
        g += risc(380, yC - 24, 'RISC');
        g += line(120, yC + 34, 230, yC + 34, 'dash') + line(250, yC + 34, 300, yC + 34, 'dash') + text(310, yC + 38, '上一条的断片，正在被降解', 'ts', 'start');
        g += arrow(300, yC - 34, 356, yC - 30, 'mute');
      }
    }
    return g;
  };
  for (let k = 0; k < N; k++) { const on = kt.map((_, i) => i === k); o += `<g opacity="${k === 0 ? 1 : 0}">${body(k)}${ashow(on, kt, T)}</g>`; }
  o += text(14, 290, '两级放大：一条长 dsRNA 切出几十条 siRNA；每个 RISC 切完一条 mRNA 还能切下一条。', 'ts', 'start');
  o += text(14, 308, '所以每个 cell 里只剩几个分子，也足够把一个 gene 的 mRNA 清掉。', 'ts', 'start');
  return svgA(560, 316, o, '动图：长的 dsRNA 被 Dicer 切成约 21 到 23 nt 的 siRNA，一条链装进 RISC，RISC 靠碱基配对找到 target mRNA，Argonaute 把它切断，RISC 本身不被消耗，接着切下一条');
}

// ---------- 第 9 站：Ti plasmid 与 T-DNA 的四步 ----------
function tdna() {
  let o = '';
  const cx = 86, cy = 86;
  // ① Ti plasmid：一个环，T-DNA 是其中一段
  o += text(cx, 24, '① Ti plasmid（约 200 kb）', 'tb', 'middle');
  o += circle(cx, cy, 42, 'paper');
  // T-DNA 那一段弧
  o += path(`M ${f1(cx - 42)} ${f1(cy)} A 42 42 0 0 1 ${f1(cx)} ${f1(cy - 42)}`, 'ln');
  o += circle(cx - 42, cy, 4, 'ink-f') + circle(cx, cy - 42, 4, 'ink-f');
  o += text(cx - 48, cy - 30, 'T-DNA', 'tl', 'end');
  o += text(cx, cy + 4, 'Agrobacterium', 'ts', 'middle');
  o += text(cx, cy + 62, '两端各一段 24 bp 的 border，', 'ts', 'middle');
  o += text(cx, cy + 78, '只有它们之间会被转移', 'ts', 'middle');
  // ② 改造后的 T-DNA
  const x0 = 206, y2 = 72;
  o += text(350, 24, '② 把致瘤的 gene 换掉', 'tb', 'middle');
  o += line(x0, y2, x0 + 290, y2, 'ink-b');
  const seg = [['border', 24, 'wash2'], ['要的 gene', 120, 'solid'], ['kanᴿ', 90, 'wash-strong'], ['border', 24, 'wash2']];
  let xx = x0 + 16;
  seg.forEach(([lab, w, cls]) => {
    o += rect(xx, y2 - 13, w, 26, cls, 4) + rect(xx, y2 - 13, w, 26, 'frame', 4);
    o += text(xx + w / 2, y2 + 5, lab, cls === 'solid' ? 'tw' : cls === 'wash-strong' ? 't' : 'ts', 'middle');
    xx += w + 8;
  });
  o += text(350, y2 + 34, '致瘤的 gene 去掉，换上要的 gene 和一个 kanamycin resistance', 'ts', 'middle');
  // ③ 感染叶盘 + 选择
  const y3 = 232;
  o += text(130, y3 - 46, '③ 感染叶盘，放在含 kanamycin 的培养基上', 'tb', 'middle');
  const leaf = (x, y, r, dots) => {
    let q = `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.68)}" class="wash2"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * 0.68)}" class="frame"/>`;
    q += line(x - r, y, x + r, y, 'mute');
    for (const [dx, dy] of dots) q += circle(x + dx, y + dy, 3, 'ln-f');
    return q;
  };
  o += leaf(66, y3, 46, [[-14, -6], [6, 8], [18, -8]]);
  o += leaf(196, y3, 46, []);
  o += text(66, y3 + 44, '拿到 kanᴿ：能分裂', 'tl', 'middle') + text(66, y3 + 60, '长成 callus', 'ts', 'middle');
  o += text(196, y3 + 44, '没拿到：长不起来', 'ts', 'middle');
  // ④ 长成植株
  o += text(390, y3 - 46, '④ 诱导出芽和根，移到土里', 'tb', 'middle');
  const px = 376, py = y3 + 30;
  o += line(px, py, px, py - 58, 'ink-b');
  for (const [a, b] of [[-1, 0], [1, 16], [-1, 32]]) {
    const yy = py - 54 + b;
    o += `<ellipse cx="${f1(px + a * 21)}" cy="${f1(yy)}" rx="19" ry="8.5" class="wash-strong" transform="rotate(${a * -18} ${f1(px + a * 21)} ${f1(yy)})"/>`;
  }
  o += rect(px - 36, py, 72, 14, 'wash2', 3);
  o += text(px, py + 32, '土', 'ts', 'middle');
  o += text(px + 56, py - 50, '通常只插进一个 copy，', 'ts', 'start') + text(px + 56, py - 32, '按 Mendel 的方式遗传', 'ts', 'start');
  return svg(560, y3 + 86, o,'从 Ti plasmid 到 transgenic plant 的四步：Ti plasmid 上两段 24 bp border 之间的 T-DNA 会被转移；把致瘤 gene 换成目标 gene 和 kanamycin resistance；感染叶盘后在含 kanamycin 的培养基上只有转化成功的 cell 能长成 callus；再诱导出芽和根长成植株');
}

// ---------- 第 9 站：knockout mouse 的 positive-negative selection ----------
function knockout() {
  let o = '';
  const L = 300, X = 150, H = 24;
  const bar = (x, y, w, cls, lab, tw0) => rect(x, y - H / 2, w, H, cls, 4) + rect(x, y - H / 2, w, H, 'frame', 4) + (lab ? text(x + w / 2, y + 5, lab, tw0 || 'ts', 'middle') : '');
  // ① construct
  o += text(14, 20, '① construct：neoᴿ 插在 exon 2 里，tk 接在同源臂之外', 'tb', 'start');
  let y = 56;
  o += bar(X - 130, y, 80, 'wash2', 'tk', 'tb');
  o += bar(X - 44, y, 90, 'wash', '同源臂');
  o += bar(X + 50, y, 70, 'solid', 'neoᴿ', 'tw');
  o += bar(X + 124, y, 90, 'wash', '同源臂');
  o += line(X - 44, y + 20, X + 214, y + 20, 'mute') + text(X + 85, y + 36, '两段同源臂之间 = 会被换进去的部分', 'ts', 'middle');
  // ② 两种结果
  y = 150;
  o += text(14, y - 34, '② 两种整合方式', 'tb', 'start');
  o += text(14, y + 5, 'homologous', 'ts', 'start') + text(14, y + 21, 'recombination', 'ts', 'start');
  o += line(X - 40, y, X + 300, y, 'ink-b');
  o += bar(X + 50, y, 70, 'solid', 'neoᴿ', 'tw');
  for (const xx of [X + 20, X + 150]) o += line(xx - 8, y - 14, xx + 8, y + 14, 'ink') + line(xx + 8, y - 14, xx - 8, y + 14, 'ink');
  o += text(X + 310, y + 5, '有 neoᴿ，没有 tk', 'tl', 'start');
  y = 214;
  o += text(14, y + 5, '随机插入', 'ts', 'start');
  o += line(X - 40, y, X + 300, y, 'ink-b');
  o += bar(X + 10, y, 56, 'wash2', 'tk', 'tb');
  o += bar(X + 70, y, 60, 'solid', 'neoᴿ', 'tw');
  o += text(X + 310, y + 5, 'neoᴿ 和 tk 都在', 'ts', 'start');
  // ③ 两种药
  y = 286;
  o += text(14, y - 24, '③ 两种药一起用', 'tb', 'start');
  const cols = [['什么都没整合进去', 0, 0], ['随机插入', 1, 1], ['同源替换', 1, 0]];
  const cw = 116, cx0 = 200;
  o += text(14, y + 20, 'G418', 'tb', 'start') + text(58, y + 20, '没有 neoᴿ 的死', 'ts', 'start');
  o += text(14, y + 44, 'ganciclovir', 'tb', 'start') + text(94, y + 44, '有 tk 的死', 'ts', 'start');
  o += text(14, y + 70, '结果', 'tb', 'start');
  cols.forEach(([name, hasNeo, hasTk], i) => {
    const x = cx0 + i * cw;
    o += text(x + cw / 2, y - 2, name, 'ts', 'middle');
    o += text(x + cw / 2, y + 20, hasNeo ? '活' : '死', hasNeo ? 'ts' : 'tl', 'middle');
    o += text(x + cw / 2, y + 44, hasTk ? '死' : '活', hasTk ? 'tl' : 'ts', 'middle');
    const live = hasNeo && !hasTk;
    o += text(x + cw / 2, y + 70, live ? '留下来' : '没了', live ? 'tl' : 'ts', 'middle');
  });
  o += text(14, y + 100, 'Crossover 发生在同源臂之内，臂外面的 tk 不会被带进 chromosome，', 'ts', 'start');
  o += text(14, y + 118, '两种药才能把这两类分开。', 'ts', 'start');
  return svg(560, y + 128, o,'Knockout mouse 的 positive-negative selection：construct 的 neoᴿ 插在 exon 2 里、tk 在同源臂之外；同源重组只换进两臂之间的部分所以没有 tk，随机插入则两者都有；G418 杀掉没有 neoᴿ 的 cell，ganciclovir 杀掉带 tk 的 cell，只剩同源替换的 cell');
}

// ---------- 第 9 站：GFP reporter ----------
function gfpFig() {
  let o = '';
  o += text(140, 20, 'mec-7 promoter 接 GFP', 'tb', 'middle');
  // construct
  o += line(20, 44, 264, 44, 'ink-b');
  o += rect(24, 32, 104, 24, 'paper-f', 4) + rect(24, 32, 104, 24, 'wash2', 4) + rect(24, 32, 104, 24, 'frame', 4) + text(76, 49, 'mec-7 promoter', 't', 'middle');
  o += rect(132, 32, 64, 24, 'paper-f', 4) + rect(132, 32, 64, 24, 'solid', 4) + text(164, 49, 'GFP', 'tw', 'middle');
  // worm：亮起来的 neuron
  o += wormBody(20, 130, 250, 22, 7);
  const wy = (u) => 130 + 22 * Math.sin(u * 2.1 * Math.PI);
  [[0.16, 'ALML', 1], [0.34, 'PLML', 1], [0.60, 'AVM', -1], [0.80, 'PVM', -1]].forEach(([u, lab, side]) => {
    const x = 20 + u * 250, y = wy(u);
    o += circle(x, y, 6, 'solid') + text(x, y + side * 18 + 4, lab, 'tl', 'middle');
  });
  o += text(20, 196, '六个 touch receptor neuron 亮起来；', 'ts', 'start');
  o += text(20, 214, '幼虫里最强的是 embryo 来源的 ALML、', 'ts', 'start');
  o += text(20, 232, 'ALMR、PLML、PLMR 这四个。', 'ts', 'start');
  // 光谱
  const sx = lin(350, 580, 322, 530), sy = lin(0, 1, 180, 72);
  o += axes({ sx, sy, x0: 350, x1: 580, y0: 0, y1: 1, xt: [[395, '395'], [470, '470'], [509, '509'], [560, '560 nm']], yt: [] });
  o += text(316, 36, '激发（黑）与发射（绿）', 'tb', 'start');
  o += text(316, 54, '形状是示意，峰的位置是实测', 'ts', 'start');
  const gauss = (mu, s, h) => (x) => h * Math.exp(-((x - mu) ** 2) / (2 * s * s));
  const ex = (x) => Math.max(gauss(395, 22, 1)(x), gauss(470, 18, 0.3)(x));
  const em = (x) => Math.max(gauss(509, 16, 1)(x), gauss(540, 16, 0.45)(x));
  o += path(curve(ex, 350, 580, sx, sy), 'ink');
  o += path(curve(em, 350, 580, sx, sy), 'ln');
  o += text(sx(395) - 2, sy(1) - 7, '395', 'ts', 'middle');
  o += text(sx(509) + 2, sy(1) - 7, '509', 'tl', 'middle');
  const yb2 = sy(0) + 30;
  o += line(sx(395), yb2, sx(509), yb2, 'mute') + line(sx(395), yb2 - 4, sx(395), yb2 + 4, 'mute') + line(sx(509), yb2 - 4, sx(509), yb2 + 4, 'mute');
  o += text(sx(452), yb2 + 18, '差 114 nm，即 0.70 eV', 'tl', 'middle');
  o += text(316, 250, '差这么多，一块滤光片就能挡住照进去的光、', 'ts', 'start');
  o += text(316, 268, '只放绿光出来，活着就能看。', 'ts', 'start');
  return svg(560, 276, o,'左边：mec-7 promoter 驱动 GFP 之后，C. elegans 的几个 touch receptor neuron 亮起来；右边：激发峰 395 nm 带 470 nm 的次峰，发射峰 509 nm 带 540 nm 的肩，相差 114 nm');
}

// ---------- 第 10 站：coverage（动图） ----------
function coverageA() {
  const Cs = [1, 2, 3, 5, 8, 10], T = 12;
  const kt = Cs.map((_, i) => i / Cs.length);
  const G = 4.6e6, L = 150;
  // 画一段 genome：宽 w 像素代表 Gseg 个 bp，read 按同一个 coverage 随机撒
  const x0 = 30, w = 320, yTop = 126, rowH = 9, Gseg = 20000;
  // 固定的随机数（可重复）
  let s = 12345; const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
  const readsFor = (C) => { const n = Math.round((C * Gseg) / L); const a = []; for (let i = 0; i < n; i++) a.push(rnd()); return a.sort((p, q) => p - q); };
  const sets = Cs.map((C) => readsFor(C));
  let o = '';
  o += text(14, 22, 'Coverage C 从 1 涨到 10：同一段 genome 上撒的 read', 'tb', 'start');
  const px = (u) => x0 + u * w, pw = (L / Gseg) * w;
  sets.forEach((rs, k) => {
    let g = '';
    // read 堆叠成几行
    const rows = [];
    rs.forEach((u) => {
      let r = 0; while (rows[r] !== undefined && rows[r] > u) r++;
      rows[r] = u + L / Gseg; g += rect(px(u), yTop + r * rowH, Math.max(pw, 1.2), rowH - 2.5, 'solid', 1);
    });
    // 没盖到的区间
    let cov = 0, gaps = 0;
    const sorted = rs;
    let cur = 0;
    for (const u of sorted) { if (u > cur) { gaps++; g += rect(px(cur), yTop - 18, (u - cur) * w, 9, 'wash2', 1); cov += 0; } cur = Math.max(cur, u + L / Gseg); }
    if (cur < 1) { gaps++; g += rect(px(cur), yTop - 18, (1 - cur) * w, 9, 'wash2', 1); }
    g += line(x0, yTop - 26, x0 + w, yTop - 26, 'ink-b');
    g += text(14, yTop - 38, '这一段 genome（20 kb），灰条 = 没盖到的地方', 'ts', 'start');
    g += text(14, 48, `C = ${Cs[k]}：整个 E. coli 要 ${Math.round((Cs[k] * G) / L).toLocaleString('en-US').replace(/,/g, ' ')} 条 read`, 'tb', 'start');
    g += text(14, 68, `没盖到的碱基：${(100 * Math.exp(-Cs[k])).toFixed(2)}%，即 ${Math.round(G * Math.exp(-Cs[k])).toLocaleString('en-US').replace(/,/g, ' ')} 个`, 'tl', 'start');
    const on = kt.map((_, i) => i === k);
    o += `<g opacity="${k === 0 ? 1 : 0}">${g}${ashow(on, kt, T)}</g>`;
  });
  // 右边：e^-C 曲线
  const sx = lin(0, 11, 420, 536), sy = lin(0, 1, 250, 112);
  o += axes({ sx, sy, x0: 0, x1: 11, y0: 0, y1: 1, xt: [0, 5, [10, '10']], yt: [[0, '0'], [0.5, '0.5'], [1, '1']] });
  o += path(curve((c) => Math.exp(-c), 0, 11, sx, sy), 'ln');
  o += text(400, 92, '没盖到的比例 = e⁻ᶜ', 'ts', 'start');
  o += text(540, 282, 'C', 'ts', 'end');
  Cs.forEach((C, k) => {
    const on = kt.map((_, i) => i === k);
    const lft = C >= 8;
    const g = circle(sx(C), sy(Math.exp(-C)), 5, 'solid') + text(sx(C) + (lft ? -10 : 10), sy(Math.exp(-C)) - 8, 'C = ' + C, 'tl', lft ? 'end' : 'start');
    o += `<g opacity="${k === 0 ? 1 : 0}">${g}${ashow(on, kt, T)}</g>`;
  });
  o += text(14, 290, 'Coverage 每加 1，没盖到的比例就乘以 1/e ≈ 0.37。C = 10 时整个 E. coli 只剩约 209 个碱基没读到。', 'ts', 'start');
  return svgA(560, 298, o, '动图：同一段 20 kb 的 genome 上，coverage 从 1 涨到 10 时 read 逐渐堆叠起来，没被盖到的区间越来越少；右边 e 的负 C 次方这条曲线上的点跟着移动');
}

// ---------- 第 10 站：TPM 的陷阱 ----------
function tpmFig() {
  let o = '';
  const genes = ['A', 'B', 'C', 'H'];
  const n1 = [400, 200, 100, 100], n2 = [400, 200, 100, 3300];
  const cls = ['wash-strong', 'wash2', 'wash', 'solid'];
  const panel = (x0, n, title) => {
    let q = text(x0 + 110, 24, title, 'tb', 'middle');
    const tot = n.reduce((a, b) => a + b, 0);
    // 一管 RNA 画成一根竖着的柱子，按比例分段
    const H = 170, yT = 48;
    let acc = 0;
    n.forEach((v, i) => {
      const h = (v / tot) * H;
      q += rect(x0 + 30, yT + acc, 56, h, cls[i], 2) + rect(x0 + 30, yT + acc, 56, h, 'frame', 2);
      if (h > 14) q += text(x0 + 58, yT + acc + h / 2 + 5, genes[i], i === 3 ? 'tw' : 't', 'middle');
      acc += h;
    });
    q += text(x0 + 58, yT + H + 18, `共 ${tot} 个分子`, 'ts', 'middle');
    // TPM
    q += text(x0 + 100, yT - 6, 'TPM', 'ts', 'start');
    n.forEach((v, i) => {
      const tpm = Math.round((1e6 * v) / tot);
      q += text(x0 + 100, yT + 16 + i * 20, genes[i] + '  ' + tpm.toLocaleString('en-US').replace(/,/g, ' '), i === 3 ? 'tl' : 't', 'start');
    });
    return q;
  };
  o += panel(10, n1, 'sample 1');
  o += line(282, 36, 282, 246, 'grid');
  o += panel(292, n2, 'sample 2：只有 H 被诱导');
  o += arrow(170, 268, 390, 268, 'ln');
  o += text(280, 262, 'A、B、C 的分子数一个没变', 'tl', 'middle');
  o += text(280, 292, 'TPM 却都降到 800 / 4000 = 0.2 倍：只看 TPM 会以为这三个 gene 下调了 5 倍。', 'ts', 'middle');
  return svg(560, 302, o, '两管 RNA：A、B、C 的分子数都是 400、200、100，H 从 100 涨到 3300。TPM 随之从 500 000、250 000、125 000 变成 100 000、50 000、25 000，降到原来的 0.2 倍');
}

// ---------- 第 11 站：七种 model organism ----------
function modelFig() {
  let o = '';
  // 每种生物画出来 + genome 大小与 gene 数
  const dat = [
    ['E. coli', '4.6 Mb', '4 377'],
    ['S. cerevisiae', '12.5 Mb', '5 770'],
    ['C. elegans', '100 Mb', '21 733'],
    ['Drosophila', '123 Mb', '约 17 000'],
    ['Arabidopsis', '135 Mb', '27 407'],
    ['Mouse', '2 800 Mb', '约 23 000'],
    ['Human', '3 300 Mb', '约 21 000'],
  ];
  const cols = [50, 128, 212, 296, 376, 452, 526];
  const yD = 70;
  // 画法
  const draw = {
    0: (x) => `<rect x="${f1(x - 16)}" y="${f1(yD - 7)}" width="32" height="14" rx="7" class="wash-strong"/><rect x="${f1(x - 16)}" y="${f1(yD - 7)}" width="32" height="14" rx="7" class="frame"/>` + [-1, 1].map((s) => path(`M ${f1(x + s * 16)} ${f1(yD)} C ${f1(x + s * 26)} ${f1(yD - 8)} ${f1(x + s * 30)} ${f1(yD + 8)} ${f1(x + s * 38)} ${f1(yD + 2)}`, 'mute')).join(''),
    1: (x) => circle(x - 5, yD, 15, 'wash-strong') + circle(x - 5, yD, 15, 'frame') + circle(x + 14, yD - 9, 8, 'wash-strong') + circle(x + 14, yD - 9, 8, 'frame'),
    2: (x) => wormBody(x - 34, yD, 68, 11, 4.5),
    3: (x) => [-1, 1].map((s) => `<ellipse cx="${f1(x + 8)}" cy="${f1(yD + s * 8)}" rx="15" ry="5" class="wash2" transform="rotate(${s * 14} ${f1(x + 8)} ${f1(yD + s * 8)})"/><ellipse cx="${f1(x + 8)}" cy="${f1(yD + s * 8)}" rx="15" ry="5" class="frame" transform="rotate(${s * 14} ${f1(x + 8)} ${f1(yD + s * 8)})"/>`).join('')
      + `<ellipse cx="${f1(x)}" cy="${f1(yD + 2)}" rx="13" ry="8" class="wash-strong"/><ellipse cx="${f1(x)}" cy="${f1(yD + 2)}" rx="13" ry="8" class="frame"/><circle cx="${f1(x - 14)}" cy="${f1(yD - 2)}" r="6.5" class="paper"/><circle cx="${f1(x - 16)}" cy="${f1(yD - 3)}" r="2" class="ink-f"/>`,
    4: (x) => line(x, yD + 12, x, yD - 14, 'ink-b') + [[-1, -8], [1, -2], [-1, 4]].map(([s, dy]) => `<ellipse cx="${f1(x + s * 11)}" cy="${f1(yD + dy)}" rx="10" ry="5" class="wash-strong" transform="rotate(${s * -20} ${f1(x + s * 11)} ${f1(yD + dy)})"/>`).join('') + line(x - 10, yD + 13, x + 10, yD + 13, 'mute'),
    5: (x) => `<ellipse cx="${f1(x)}" cy="${f1(yD)}" rx="17" ry="11" class="wash-strong"/><ellipse cx="${f1(x)}" cy="${f1(yD)}" rx="17" ry="11" class="frame"/><circle cx="${f1(x + 15)}" cy="${f1(yD - 6)}" r="7" class="paper"/><circle cx="${f1(x + 18)}" cy="${f1(yD - 13)}" r="3.4" class="paper"/><circle cx="${f1(x + 20)}" cy="${f1(yD - 6)}" r="1.4" class="ink-f"/>`
      + [-7, 0, 7].map((dx) => line(x + dx, yD + 9, x + dx, yD + 17, 'ink')).join('')
      + path(`M ${f1(x - 17)} ${f1(yD + 2)} C ${f1(x - 28)} ${f1(yD + 2)} ${f1(x - 28)} ${f1(yD - 7)} ${f1(x - 23)} ${f1(yD - 10)}`, 'ink'),
    6: (x) => circle(x, yD - 12, 7, 'paper') + line(x, yD - 5, x, yD + 8, 'ink-b') + line(x - 9, yD + 1, x + 9, yD + 1, 'ink') + line(x, yD + 8, x - 7, yD + 20, 'ink') + line(x, yD + 8, x + 7, yD + 20, 'ink'),
  };
  dat.forEach(([name, g, n], i) => {
    const x = cols[i];
    o += draw[i](x);
    o += text(x, 108, name, 'tb', 'middle');
    o += text(x, 126, g, 'ts', 'middle');
    o += text(x, 144, n, 'ts', 'middle');
  });
  o += text(14, 24, '七种常用的 model organism（图不按比例）。每种下面是 genome 大小和 gene 数。', 'ts', 'start');
  // 下半：gene density
  const sy = lin(0, 1000, 290, 186), x0 = 60, bw = 54;
  o += text(14, 172, '每 Mb 有几个 gene', 'tb', 'start');
  const dens = [943, 462, 217, 139, 203, 8.2, 6.4];
  dens.forEach((v, i) => {
    const x = x0 + i * 68;
    o += rect(x, sy(v), bw, sy(0) - sy(v), 'solid', 2);
    o += text(x + bw / 2, sy(v) - 6, v >= 10 ? String(Math.round(v)) : v.toFixed(1), 'tl', 'middle');
    o += text(x + bw / 2, sy(0) + 16, ['E. coli', 'S. cer.', 'C. ele.', 'Droso.', 'Arab.', 'mouse', 'human'][i], 'ts', 'middle');
  });
  o += line(x0 - 6, sy(0), x0 + 6 * 68 + bw + 6, sy(0), 'axis');
  o += text(14, 330, 'E. coli 平均每 1.1 kb 一个 gene，human 每 157 kb 一个。', 'ts', 'start');
  o += text(14, 348, '多出来的是 intron、调控 sequence 和重复 sequence。', 'ts', 'start');
  return svg(560, 356, o, '七种 model organism 的 genome 大小与 gene 数，以及每 Mb 的 gene 数：E. coli 943、酵母 462、线虫 217、拟南芥 203、果蝇 139、小鼠 8.2、人 6.4');
}

// ---------- 第 11 站：C-value paradox ----------
function cvalue() {
  let o = '';
  const dat = [
    ['D. melanogaster', 180, 17000],
    ['Fugu rubripes', 400, null],
    ['Boa constrictor', 2100, null],
    ['Homo sapiens', 3100, 21000],
    ['蝗虫 Schistocerca', 9300, null],
    ['洋葱 Allium cepa', 18000, null],
    ['蝾螈 Amphiuma', 84000, null],
    ['肺鱼 Protopterus', 140000, null],
    ['蕨 Ophioglossum', 160000, null],
    ['Amoeba dubia', 670000, null],
  ];
  const sx = logx(100, 1e6, 200, 520), y0 = 44, dy = 23;
  o += text(14, 20, 'Genome 大小（对数轴）', 'tb', 'start');
  for (const t of [100, 1000, 1e4, 1e5, 1e6]) {
    o += line(sx(t), y0 - 12, sx(t), y0 + dy * 9 + 10, 'grid');
    o += text(sx(t), y0 - 16, t >= 1e4 ? (t / 1000) + ' Gb' : t + ' Mb', 'ts', 'middle');
  }
  dat.forEach(([name, mb], i) => {
    const y = y0 + i * dy, hum = name === 'Homo sapiens';
    o += text(194, y + 4, name, hum ? 'tl' : 't', 'end');
    o += rect(sx(100), y - 7, sx(mb) - sx(100), 14, hum ? 'solid' : 'wash-strong', 2);
    o += text(sx(mb) + 8, y + 4, mb >= 1000 ? (mb / 1000) + ' Gb' : mb + ' Mb', hum ? 'tl' : 'ts', 'start');
  });
  const yb = y0 + dy * 10 + 16;
  o += text(14, yb, 'Gene 数（已知的几种）：', 'tb', 'start');
  const gs = [['E. coli', 4377], ['酵母', 5770], ['果蝇', 17000], ['human', 21000], ['线虫', 21733], ['拟南芥', 27407], ['云杉', 28354]];
  const sg = lin(0, 30000, 150, 520), yg = yb + 46;
  o += line(150, yg, 520, yg, 'axis');
  for (const t of [0, 10000, 20000, 30000]) o += line(sg(t), yg, sg(t), yg + 4, 'axis') + text(sg(t), yg + 18, t ? (t / 1000) + ' 000' : '0', 'ts', 'middle');
  gs.forEach(([name, n], i) => {
    const y = yg - 8 - i * 0;
    o += circle(sg(n), y, 5, 'solid');
    o += text(sg(n), y - 10 - (i % 3) * 16, name, 'tl', 'middle');
  });
  o += text(14, yg + 44, 'Amoeba 的 genome 是 human 的 216 倍，洋葱是 5.8 倍；而 gene 数全都挤在 2 万到 3 万之间。', 'ts', 'start');
  o += text(14, yg + 62, '云杉的 DNA 是拟南芥的 145 倍，gene 只多约 900 个。', 'ts', 'start');
  return svg(560, yg + 70, o, 'Genome 大小从果蝇的 180 Mb 到 Amoeba dubia 的 670 000 Mb 跨四个数量级，而已知的 gene 数从 E. coli 的 4 377 到云杉的 28 354，几种真核生物都挤在两万到三万之间');
}

// ---------- 第 7 站：Sanger sequencing 的 gel ----------
function sanger() {
  const seq = GENE, n = seq.length;
  const lanes = ['A', 'C', 'G', 'T'];
  const lx = (k) => 170 + k * 62, y0 = 318, dy = 13;
  const yOf = (len) => y0 - (len - 0.5) * dy; // 长度 len 的片段；短的在下
  let o = '';
  o += rect(140, yOf(n + 1) - 6, 4 * 62 + 0, y0 - yOf(n + 1) + 10, 'paper', 6);
  lanes.forEach((b, k) => { o += text(lx(k) + 2, yOf(n + 1) - 14, 'dd' + b + 'TP', 'tb', 'middle'); });
  for (let i = 0; i < n; i++) {
    const k = lanes.indexOf(seq[i]), y = yOf(i + 1);
    o += rect(lx(k) - 20, y - 3.5, 44, 7, 'solid', 2);
    o += text(lx(4) + 6, y + 4, seq[i], 'tl', 'middle');
    if ((i + 1) % 5 === 0 || i === 0) o += text(130, y + 4, String(i + 1), 'ts', 'end');
  }
  o += text(116, yOf(n + 1) - 14, '片段长度', 'ts', 'end');
  o += text(lx(4) + 6, yOf(n + 1) - 14, '读', 'tb', 'middle');
  o += arrow(lx(4) + 36, yOf(1), lx(4) + 36, yOf(n), 'mute');
  o += text(lx(4) + 48, yOf(1) + 4, '5′（最短）', 'ts', 'start') + text(lx(4) + 48, yOf(n) + 4, '3′（最长）', 'ts', 'start');
  o += text(lx(4) + 48, (yOf(1) + yOf(n)) / 2 - 8, '从下往上读', 'ts', 'start') + text(lx(4) + 48, (yOf(1) + yOf(n)) / 2 + 10, '= 新 strand', 'ts', 'start');
  o += text(280, y0 + 22, `短的片段跑得快，在下面。读出 ${seq}，是新合成 strand 的 5′→3′。`, 'ts', 'middle');
  return svg(560, y0 + 30, o, 'Sanger sequencing 的 gel：ddATP、ddCTP、ddGTP、ddTTP 四个 lane，每个长度只有一个 lane 有 band，从下往上读出新合成 strand 的 sequence ATGGCCAAGTTCGGATGCTAA');
}

export default {
  'lsm2105-griffith': griffith,
  'lsm2105-avery': avery,
  'lsm2105-nucleosome': nucleosome,
  'lsm2105-compact': compact,
  'lsm2105-duplex': duplex,
  'lsm2105-meselson': meselson,
  'lsm2105-fork': forkA,
  'lsm2105-beadle': beadle,
  'lsm2105-transcribe': transcribeA,
  'lsm2105-translate': translateA,
  'lsm2105-dihybrid': dihybrid,
  'lsm2105-nineseven': ninesevenFig,
  'lsm2105-pedigree': pedigree,
  'lsm2105-penetrance': penetrance,
  'lsm2105-crossover': crossover,
  'lsm2105-map': map3,
  'lsm2105-transduce': transduce,
  'lsm2105-conjug': conjugA,
  'lsm2105-transform': transformFig,
  'lsm2105-cotrans': cotrans,
  'lsm2105-luria': luria,
  'lsm2105-nondisj': nondisj,
  'lsm2105-lac': lacA,
  'lsm2105-cistrans': cistrans,
  'lsm2105-pcr': pcrA,
  'lsm2105-crispr': crisprA,
  'lsm2105-sanger': sanger,
  'lsm2105-rnai': rnaiFig,
  'lsm2105-dicer': dicerA,
  'lsm2105-tdna': tdna,
  'lsm2105-knockout': knockout,
  'lsm2105-gfp': gfpFig,
  'lsm2105-coverage': coverageA,
  'lsm2105-tpm': tpmFig,
  'lsm2105-model': modelFig,
  'lsm2105-cvalue': cvalue,
};
