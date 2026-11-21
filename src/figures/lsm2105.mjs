import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

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
  const rhoL = 1.710, rhoH = 1.724;
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
  o += text(14, 398, 'Tube 里越往下 density 越大：¹⁵N/¹⁵N DNA 1.724 g/cm³，¹⁴N/¹⁴N 1.710，hybrid 1.717。', 'ts', 'start');
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

export default {
  'lsm2105-duplex': duplex,
  'lsm2105-meselson': meselson,
  'lsm2105-fork': forkA,
  'lsm2105-beadle': beadle,
  'lsm2105-transcribe': transcribeA,
  'lsm2105-translate': translateA,
  'lsm2105-dihybrid': dihybrid,
  'lsm2105-nineseven': ninesevenFig,
  'lsm2105-pedigree': pedigree,
  'lsm2105-crossover': crossover,
  'lsm2105-map': map3,
  'lsm2105-luria': luria,
  'lsm2105-nondisj': nondisj,
  'lsm2105-lac': lacA,
  'lsm2105-cistrans': cistrans,
  'lsm2105-pcr': pcrA,
  'lsm2105-crispr': crisprA,
};
