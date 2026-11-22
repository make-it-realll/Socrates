import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, anim, ashow, f1, sub } from '../lib/svg.mjs';

const kts = (kt) => kt.map((t) => (Math.round(t * 1e5) / 1e5).toString()).join(';');
// 整组平移的动画：xs、ys 是每个 keyframe 的位移
const atrans = (xs, ys, kt, dur) =>
  `<animateTransform attributeName="transform" type="translate" values="${xs.map((x, i) => f1(x) + ' ' + f1(ys[i])).join(';')}" keyTimes="${kts(kt)}" dur="${dur}s" repeatCount="indefinite"/>`;
const lg = (p) => Math.log(p / (1 - p));
const sg = (l) => 1 / (1 + Math.exp(-l));
const r2 = (v) => v.toFixed(2);

// ---------- CS4278 的 corridor：10 格，door 在 0、1、8，sensor 报对 0.75，motion 0/1/2 格 = 0.1/0.8/0.1 ----------
const NC = 10, DOORS = new Set([0, 1, 8]);
const ZS = ['door', 'door', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'door'];
const likOf = (z, i) => ((DOORS.has(i) === (z === 'door')) ? 0.75 : 0.25);
function corridorBeliefs() {
  let bel = Array(NC).fill(0.1).map((v, i) => v * likOf(ZS[0], i));
  let s = bel.reduce((a, b) => a + b); bel = bel.map((v) => v / s);
  const out = [bel];
  for (let t = 1; t < ZS.length; t++) {
    const pb = Array(NC).fill(0);
    for (let i = 0; i < NC; i++) [[0, 0.1], [1, 0.8], [2, 0.1]].forEach(([k, p]) => { pb[(i + k) % NC] += p * bel[i]; });
    bel = pb.map((v, i) => v * likOf(ZS[t], i)); s = bel.reduce((a, b) => a + b); bel = bel.map((v) => v / s);
    out.push(bel);
  }
  return out;
}

// 一个从上往下看的 robot：圆形底盘，朝上（墙）的 sensor
function robotIcon(x, y) {
  return circle(x, y, 10, 'paper') + poly([[x - 5, y - 8], [x + 5, y - 8], [x, y - 17]], 'ink-f') + line(x - 6, y + 2, x + 6, y + 2, 'ink');
}

// ---------- 图 1：trellis，每一行是一个时刻的 belief ----------
function trellisA() {
  const B = corridorBeliefs();
  const x0 = 44, cw = 42, cx = (i) => x0 + cw * i + cw / 2;
  const yTop = 98, rh = 30, bh = 16, scale = bh / 0.6;
  const base = (t) => yTop + t * rh + bh + 2;
  let o = '';
  // corridor：上面是墙，door 是墙上的一段门
  o += rect(x0, 12, cw * NC, 12, 'wash2');
  for (let i = 0; i < NC; i++) {
    if (DOORS.has(i)) o += rect(cx(i) - 14, 10, 28, 16, 'paper') + circle(cx(i) + 8, 18, 1.8, 'ink-f');
    o += text(cx(i), 74, String(i), 'ts', 'middle');
  }
  o += line(x0, 62, x0 + cw * NC, 62, 'grid');
  o += text(x0 + cw * NC + 8, 22, 'wall', 'ts', 'start') + text(x0 + cw * NC + 8, 74, 'cell', 'ts', 'start');
  // 表头
  o += text(486, yTop - 8, 'z' + sub('t'), 'ts', 'middle') + text(536, yTop - 8, 'max', 'ts', 'middle');
  // 可能的 move：细线（不绕回的画成线，绕回的画到边上为止）
  for (let t = 0; t < 8; t++) {
    const y1 = base(t) + 1, y2 = base(t + 1) - bh - 1;
    for (let i = 0; i < NC; i++) for (const k of [0, 1, 2]) {
      const j = i + k;
      if (j < NC) o += line(cx(i), y1, cx(j), y2, 'grid');
      else o += line(cx(i), y1, Math.min(cx(i) + (cx(j) - cx(i)) * 0.5, x0 + cw * NC), (y1 + y2) / 2, 'grid');
    }
  }
  // 时间轴：静态显示全部 9 行；动起来时先清空，再一行一行出现
  const T0 = 2.4, st = 1.25, hold = 2.2, T = T0 + 9 * st + hold;
  const kOn = (t) => (T0 + t * st) / T;
  for (let t = 0; t < 9; t++) {
    let g = '';
    const b = B[t], mi = b.indexOf(Math.max(...b));
    for (let i = 0; i < NC; i++) {
      const h = Math.max(b[i] * scale, 0.6);
      g += rect(cx(i) - 15, base(t) - h, 30, h, b[i] > b[mi] - 1e-9 ? 'solid' : 'wash-strong');
    }
    g += line(x0, base(t), x0 + cw * NC, base(t), 'axis');
    g += text(486, base(t) - 4, ZS[t], ZS[t] === 'door' ? 'tb' : 't', 'middle');
    g += text(536, base(t) - 4, b[mi].toFixed(2), 'ts', 'middle');
    o += `<g>${g}${ashow([1, 0, 1], [0, 0.6 / T, kOn(t)], T)}</g>`;
    o += text(36, base(t) - 4, 't = ' + t, 'ts', 'end');
  }
  // robot 沿 corridor 走：静态时在第 8 格
  const xs = [cx(8), cx(8), cx(0)], ys = [0, 0, 0], kt = [0, 0.6 / T, 0.6 / T + 0.0001];
  for (let t = 1; t < 9; t++) { xs.push(cx(t - 1), cx(t)); ys.push(0, 0); kt.push(kOn(t) - 0.35 / T, kOn(t)); }
  xs.push(cx(8)); ys.push(0); kt.push(1);
  o += `<g>${robotIcon(0, 46)}${atrans(xs, ys, kt, T)}</g>`;
  return svgA(560, 370, o, '动图：CS4278 的 10 格 corridor，robot 走 8 步、读 9 次，下面每一行是这一时刻的 belief，一行一行由上一行和这一次读数算出');
}

// ---------- 图 2：方块：prior 分栏，likelihood 切块，读到 door 之后按比例放大 ----------
function squareA() {
  const X = 34, Y = 46, W = 220, H = 170;
  const wd = 0.3 * W, hd = 0.75 * H, hw = 0.25 * H;
  const T = 11.5, k1 = 2.6 / T, k2 = 4.8 / T, k3 = 7.4 / T, k4 = 9.4 / T;
  const showFinal = () => ashow([1, 0, 1], [0, k1, k2], T);
  let o = '';
  // 分栏（一直在）
  o += rect(X, Y, W, H, 'frame') + line(X + wd, Y, X + wd, Y + H, 'ink');
  o += text(X + wd / 2, Y - 10, 'door 格', 'tb', 'middle') + text(X + wd / 2, Y + H + 18, 'prior 0.3', 'ts', 'middle');
  o += text(X + wd + (W - wd) / 2, Y - 10, 'wall 格', 'tb', 'middle') + text(X + wd + (W - wd) / 2, Y + H + 18, 'prior 0.7', 'ts', 'middle');
  // likelihood 切出的块：f1 时隐藏
  let g = '';
  g += rect(X, Y, wd, hd, 'solid') + rect(X, Y + hd, wd, H - hd, 'wash2');
  g += rect(X + wd, Y, W - wd, hw, 'wash-strong') + rect(X + wd, Y + hw, W - wd, H - hw, 'wash2');
  g += text(X + wd / 2, Y + 40, '× 0.75', 'tw', 'middle') + text(X + wd / 2, Y + 60, '0.225', 'tw', 'middle');
  g += text(X + wd / 2, Y + hd + 26, '0.075', 'ts', 'middle');
  g += text(X + wd + (W - wd) / 2, Y + 27, '× 0.25 → 0.175', 'tb', 'middle');
  g += text(X + wd + (W - wd) / 2, Y + hw + 70, '读到 wall：0.525', 'ts', 'middle');
  o += `<g>${g}${showFinal()}</g>`;
  // 右边：posterior 的长条
  const BX = 318, BY = 118, BW = 222, BH = 40, pd = 0.5625;
  let gb = '';
  gb += rect(BX, BY, BW, BH, 'frame');
  gb += text(BX, BY - 34, '只留下读到 door 的两块，', 'ts', 'start') + text(BX, BY - 16, '各自除以 0.225 + 0.175 = 0.4', 'ts', 'start');
  gb += text(BX + (pd * BW) / 2, BY + BH + 18, 'door 0.5625', 'tl', 'middle') + text(BX + pd * BW + ((1 - pd) * BW) / 2, BY + BH + 18, 'wall 0.4375', 'tb', 'middle');
  gb += text(BX + BW / 2, BY + BH + 44, 'posterior', 'ts', 'middle');
  gb += arrow(X + W + 10, BY + BH / 2, BX - 8, BY + BH / 2, 'mute');
  o += `<g>${gb}${ashow([1, 0, 1], [0, k1, k4], T)}</g>`;
  // 两块深色的复制品：从方块里滑到长条上
  const moving = (from, to, cls) => {
    const [fx, fy, fw, fh] = from, [tx, ty, tw, th] = to;
    const kt = [0, k1, k3, k4, 1];
    const vx = [tx, fx, fx, tx, tx], vy = [ty, fy, fy, ty, ty], vw = [tw, fw, fw, tw, tw], vh = [th, fh, fh, th, th];
    return `<rect x="${f1(tx)}" y="${f1(ty)}" width="${f1(tw)}" height="${f1(th)}" class="${cls}">${anim('x', vx.map(f1), kt, T)}${anim('y', vy.map(f1), kt, T)}${anim('width', vw.map(f1), kt, T)}${anim('height', vh.map(f1), kt, T)}${ashow([1, 0, 1], [0, k1, k2], T)}</rect>`;
  };
  o += moving([X, Y, wd, hd], [BX, BY, pd * BW, BH], 'solid');
  o += moving([X + wd, Y, W - wd, hw], [BX + pd * BW, BY, (1 - pd) * BW, BH], 'wash-strong');
  return svgA(560, 250, o, '动图：一个方块按 prior 分成 door 格 0.3 和 wall 格 0.7 两栏，再按 likelihood 切出读到 door 的部分 0.225 和 0.175，最后这两块按比例放大成 posterior 0.5625 和 0.4375');
}

// ---------- 图 3：pedigree，John 和 Jill 下面一个一个添健康的孩子 ----------
function pedigreeA() {
  const both0 = 4 / 33;
  const rows = [0, 1, 2, 3, 4].map((k) => { const o = (4 / 29) * Math.pow(0.75, k); const p = o / (1 + o); return [k, p, p / 4]; });
  const sq = (x, y, cls = 'paper', s = 22) => rect(x - s / 2, y - s / 2, s, s, cls);
  const ci = (x, y, cls = 'paper') => circle(x, y, 11, cls);
  let o = '';
  // generation I：John 的父母
  o += sq(70, 30) + ci(140, 30) + line(81, 30, 129, 30, 'ink') + line(105, 30, 105, 62, 'ink');
  o += text(105, 18 - 4, 'Aa × Aa', 'ts', 'middle');
  o += line(50, 62, 140, 62, 'ink') + line(50, 62, 50, 89, 'ink') + line(140, 62, 140, 89, 'ink');
  // generation II：哥哥（患者，已故）、John、Jill
  o += sq(50, 100, 'solid2') + line(36, 116, 64, 84, 'ink');
  o += text(50, 128, '哥哥', 'ts', 'middle');
  o += sq(140, 100) + text(140, 128, 'John', 't', 'middle');
  o += ci(230, 100) + text(230, 128, 'Jill', 't', 'middle');
  o += line(151, 100, 219, 100, 'ink') + line(185, 100, 185, 146, 'ink');
  o += text(140, 146, '2/3 carrier', 'ts', 'end') + text(240, 146, '2/11 carrier', 'ts', 'start');
  // generation III：孩子
  const kx = [110, 160, 210, 260], qx = 310;
  const T0 = 2.6, st = 2.0, T = T0 + 5 * st + 0.4;
  const kOn = (k) => (T0 + k * st) / T;
  o += line(110, 160, 310, 160, 'ink');
  kx.forEach((x, i) => {
    const sym = i % 2 === 0 ? ci(x, 186) : sq(x, 186);
    o += `<g>${line(x, 160, x, 175, 'ink')}${sym}${ashow([1, 0, 1], [0, 0.5 / T, kOn(i + 1)], T)}</g>`;
  });
  o += line(qx, 160, qx, 175, 'ink') + rect(qx - 11, 175, 22, 22, 'dash') + text(qx, 191, '?', 'tb', 'middle');
  o += text(qx, 214, '下一个', 'ts', 'middle');
  o += text(185, 236, '空心：健康', 'ts', 'middle');
  // 右边的表
  const TX = 352, cK = 368, cP = 444, cR = 522, ty0 = 54, trh = 30;
  o += text(cK, 34, 'k', 'ts', 'middle') + text(cP, 34, '两人都是 carrier', 'ts', 'middle') + text(cR, 34, '下一个得病', 'ts', 'middle');
  o += line(TX, 42, 556, 42, 'axis');
  // 当前那一行的底色：静态时在 k = 4
  const hy = (k) => ty0 + k * trh - 19;
  const ys = [hy(4), hy(4), hy(0)], kt = [0, 0.5 / T, 0.5 / T];
  for (let k = 1; k <= 4; k++) { ys.push(hy(k)); kt.push(kOn(k)); }
  o += `<rect x="${TX}" y="${f1(hy(4))}" width="${556 - TX}" height="26" rx="4" class="wash">${anim('y', ys.map(f1), kt, T, true)}</rect>`;
  rows.forEach(([k, p, r]) => {
    const y = ty0 + k * trh;
    o += text(cK, y, String(k), 't', 'middle') + text(cP, y, p.toFixed(4), 't', 'middle') + text(cR, y, r.toFixed(4), 'tb', 'middle');
  });
  o += text(TX, 212, '每个健康的孩子：odds × 3/4', 'ts', 'start');
  o += text(TX, 232, 'risk = P(都是 carrier) × 1/4', 'ts', 'start');
  return svgA(560, 244, o, '动图：LSM2107 的 pedigree，John 和 Jill 下面依次添上 0 到 4 个健康的孩子，右边的表给出两人都是 carrier 的 probability 从 0.1212 降到 0.0418，下一个孩子的 risk 从 0.0303 降到 0.0105');
}

function mulberry(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ---------- 图 4：400 个被检验的 hypothesis，significant 的圈起来 ----------
function studies() {
  const panel = (X, tp, fp, title, foot, seed) => {
    let o = '';
    const S = 11, Y = 44;
    // 前 100 个（前 5 行）是真的
    const rnd = mulberry(seed);
    const pick = (lo, hi, k) => { const a = Array.from({ length: hi - lo }, (_, i) => lo + i); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return new Set(a.slice(0, k)); };
    const sigT = pick(0, 100, tp), sigF = pick(100, 400, fp);
    for (let n = 0; n < 400; n++) {
      const r = Math.floor(n / 20), c = n % 20, x = X + c * S + S / 2, y = Y + r * S + S / 2;
      o += n < 100 ? circle(x, y, 3, 'ink-f') : circle(x, y, 3, 'mute');
      if (sigT.has(n) || sigF.has(n)) o += circle(x, y, 5.6, 'ln');
    }
    o += line(X, Y + 5 * S, X + 20 * S, Y + 5 * S, 'grid');
    o += text(X + 110, 22, title, 'tb', 'middle');
    o += text(X + 110, 286, foot, 't', 'middle');
    return o;
  };
  let o = '';
  o += panel(36, 9, 8, '每组 21 人：power 0.092', 'significant：9 真 + 8 假，9/17 = 0.53', 3);
  o += panel(304, 29, 8, '每组 100 人：power 0.290', 'significant：29 真 + 8 假，29/37 = 0.78', 5);
  o += text(28, 47 + 30, '真', 'ts', 'end') + text(28, 47 + 150, '假', 'ts', 'end');
  o += text(280, 47 + 30, '真', 'ts', 'middle') + text(280, 47 + 150, '假', 'ts', 'middle');
  return svg(560, 296, o, '两组各 400 个被检验的 hypothesis，100 个为真。每组 21 人时 significant 的是 9 个真的和 8 个假的；每组 100 人时是 29 个真的和 8 个假的');
}

// ---------- 图 5：gain：Beta 的 pseudo-count 与 Kalman 的 precision ----------
function gain() {
  let o = '';
  // 左：Beta(1,1) → Beta(4,2)
  {
    const sx = lin(0, 1, 30, 262), sy = lin(0, 2.4, 150, 36);
    o += text(146, 18, 'coin：Beta(1,1)，4 次里 3 次 head', 'tb', 'middle');
    o += line(sx(0), sy(0), sx(1), sy(0), 'axis');
    [0, 0.5, 1].forEach((v) => { o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle'); });
    o += path(curve(() => 1, 0, 1, sx, sy, 4), 'dash') + text(sx(0.08), sy(1) - 8, 'prior', 'ts', 'start');
    o += path(curve((x) => 20 * x ** 3 * (1 - x), 0, 1, sx, sy), 'ln') + text(sx(0.86), sy(1.9), 'Beta(4,2)', 'tl', 'start');
    // lever：prior mean 0.5 → data 0.75，posterior 在 2/3 处
    const y = 190;
    o += line(sx(0.5), y, sx(0.75), y, 'ink-b');
    o += circle(sx(0.5), y, 4, 'paper') + circle(sx(0.75), y, 4, 'ink-f') + circle(sx(2 / 3), y, 5, 'solid');
    o += text(sx(0.5) - 8, y + 4, 'prior mean 0.5', 'ts', 'end') + text(sx(0.75) + 8, y + 4, 'k/n = 0.75', 'ts', 'start');
    o += text(sx(2 / 3), y - 10, '0.667', 'tl', 'middle');
    // information 的长条：a+b = 2，n = 4
    const bx = 30, bw = 232, by = 210, u = bw / 6;
    o += rect(bx, by, 2 * u, 22, 'wash2') + rect(bx + 2 * u, by, 4 * u, 22, 'solid');
    o += text(bx + u, by + 16, 'a+b = 2', 't', 'middle') + text(bx + 4 * u, by + 16, 'n = 4', 'tw', 'middle');
    o += text(146, 252, 'K = 4/(2+4) = 2/3', 'tb', 'middle');
  }
  // 右：N(10, 0.04) 与 z = 11
  {
    const sx = lin(9.4, 11.4, 316, 548), sy = lin(0, 4.8, 150, 36);
    const g = (m, v) => (x) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
    o += text(432, 18, 'track：prior N(10, 0.04)，z = 11，R = 0.01', 'tb', 'middle');
    o += line(sx(9.4), sy(0), sx(11.4), sy(0), 'axis');
    [9.5, 10, 10.5, 11].forEach((v) => { o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle'); });
    o += path(curve(g(10, 0.04), 9.4, 11.4, sx, sy), 'dash') + text(sx(9.62), sy(1.2), 'prior', 'ts', 'end');
    o += path(curve(g(11, 0.01), 9.4, 11.4, sx, sy), 'mute') + text(sx(11.4), sy(4.6), 'likelihood', 'ts', 'end');
    o += path(curve(g(10.8, 0.008), 9.4, 11.4, sx, sy), 'ln') + text(sx(10.62), sy(4.3), 'posterior', 'tl', 'end');
    const y = 190;
    o += line(sx(10), y, sx(11), y, 'ink-b');
    o += circle(sx(10), y, 4, 'paper') + circle(sx(11), y, 4, 'ink-f') + circle(sx(10.8), y, 5, 'solid');
    o += text(sx(10) - 8, y + 4, '10', 'ts', 'end') + text(sx(11) + 8, y + 4, 'z = 11', 'ts', 'start');
    o += text(sx(10.8), y - 10, '10.8', 'tl', 'middle');
    const bx = 316, bw = 232, by = 210, u = bw / 125;
    o += rect(bx, by, 25 * u, 22, 'wash2') + rect(bx + 25 * u, by, 100 * u, 22, 'solid');
    o += text(bx + 12.5 * u, by + 16, '25', 't', 'middle') + text(bx + 75 * u, by + 16, '1/R = 100', 'tw', 'middle');
    o += text(bx + 12.5 * u, by - 6, '1/P̄', 'ts', 'middle');
    o += text(432, 252, 'K = 100/(25+100) = 0.8', 'tb', 'middle');
  }
  return svg(560, 260, o, '左：coin 的 prior Beta(1,1) 与 posterior Beta(4,2)，posterior mean 0.667 落在 prior mean 0.5 到 data 0.75 的三分之二处，information 长条 2 比 4。右：prior N(10, 0.04)、likelihood、posterior N(10.8, 0.008)，posterior mean 落在 10 到 11 的 0.8 处，information 25 比 100');
}

// ---------- 图 6：log-odds 的 line：每份 evidence 是一段固定长度的 step ----------
function logodds() {
  const sx = lin(-5, 5, 40, 528);
  let o = '';
  // 上面：probability 的刻度
  o += line(sx(-5), 40, sx(5), 40, 'axis');
  for (const p of [0.01, 0.05, 0.15, 0.5, 0.85, 0.95, 0.99]) { const x = sx(lg(p)); o += line(x, 36, x, 40, 'axis') + text(x, 30, String(p), 'ts', 'middle'); }
  o += text(sx(5), 14, 'probability', 'ts', 'end');
  // 下面：log-odds 的刻度
  const yA = 236;
  o += line(sx(-5), yA, sx(5), yA, 'axis');
  for (let v = -4; v <= 4; v += 2) o += line(sx(v), yA, sx(v), yA + 4, 'axis') + text(sx(v), yA + 17, String(v), 'ts', 'middle');
  o += text(sx(5), yA + 17, 'ℓ', 'ts', 'end');
  o += line(sx(0), 44, sx(0), yA, 'grid');
  // 第 1 行：breathalyzer
  {
    const y = 84, a = lg(0.02), b = a + Math.log(19.6);
    o += text(sx(-5), y - 18, 'Breathalyzer（ST2131）：prior 0.02，positive 的 LR 19.6', 'tb', 'start');
    o += arrow(sx(a) + 5, y, sx(b) - 4, y, 'ln');
    o += circle(sx(a), y, 4.5, 'paper') + circle(sx(b), y, 4.5, 'solid');
    o += text(sx(a), y + 20, '−3.892', 'ts', 'middle') + text((sx(a) + sx(b)) / 2, y + 20, '+ ln 19.6 = 2.976', 'tl', 'middle') + text(sx(b) + 8, y + 5, '−0.916，即 0.286', 't', 'start');
  }
  // 第 2 行：Tiger
  {
    const y = 144, s = Math.log(0.85 / 0.15), th = lg(0.9475);
    o += rect(sx(th), y - 12, sx(5) - sx(th), 24, 'wash') + rect(sx(-5), y - 12, sx(-th) - sx(-5), 24, 'wash');
    o += text(sx(5) - 4, y + 4, 'open-right', 'ts', 'end') + text(sx(-5) + 4, y + 4, 'open-left', 'ts', 'start');
    o += text(sx(-5), y - 20, 'Tiger（CS4246）：每次 listen ±1.735', 'tb', 'start');
    o += arrow(sx(0) + 5, y, sx(s) - 4, y, 'ln') + arrow(sx(s) + 5, y, sx(2 * s) - 4, y, 'ln');
    o += circle(sx(0), y, 4.5, 'paper') + circle(sx(s), y, 4.5, 'wash-strong') + circle(sx(2 * s), y, 4.5, 'solid');
    o += text(sx(s / 2), y + 22, '听到左', 'ts', 'middle') + text(sx(1.5 * s), y + 22, '再听到左', 'ts', 'middle');
    o += line(sx(th), y - 12, sx(th), y + 12, 'dash');
  }
  // 第 3 行：occupancy cell
  {
    const y = 200, h = lg(0.7), m = lg(0.4);
    o += line(sx(-2), y - 10, sx(-2), y + 10, 'dash') + line(sx(3.5), y - 10, sx(3.5), y + 10, 'dash');
    o += text(sx(3.5) + 6, y - 10, 'clamp 3.5', 'ts', 'start') + text(sx(-2) - 6, y - 10, 'clamp −2', 'ts', 'end');
    o += text(sx(-5), y - 20, 'Occupancy cell（EE4706）：hit +0.847，miss −0.405', 'tb', 'start');
    let v = 0;
    o += circle(sx(0), y, 4.5, 'paper');
    for (let k = 0; k < 3; k++) { o += arrow(sx(v) + 4, y, sx(v + h) - 4, y, 'ln'); v += h; o += circle(sx(v), y, 3.5, k === 2 ? 'solid' : 'wash-strong'); }
    o += arrow(sx(v) - 2, y + 9, sx(v + m) + 3, y + 9, 'ink');
    o += text(sx(v) + 6, y + 14, 'miss', 'ts', 'start');
    o += text(sx(1.0), y + 26, '3 次 hit：2.54，即 0.927', 'ts', 'middle');
  }
  return svg(560, 256, o, '一条 log-odds 的 line，上面标着 probability。Breathalyzer 从 −3.892 走 2.976 到 −0.916；Tiger 每次 listen 走 1.735，两步后越过 open-right 的 threshold；occupancy cell 每次 hit 走 0.847、miss 走 −0.405，clamp 在 −2 与 3.5');
}

// ---------- 图 7：同一个 cell 的 l_t：static、clamp、带 predict ----------
function clampSeries(kind, n = 36) {
  const hit = lg(0.7), miss = lg(0.4), eps = 0.01;
  let l = 0; const out = [0];
  for (let t = 1; t <= n; t++) {
    if (kind === 'pred') l = lg(eps + (1 - 2 * eps) * sg(l));
    l += t <= 10 ? hit : miss;
    if (kind === 'clamp') l = Math.max(-2, Math.min(3.5, l));
    out.push(l);
  }
  return out;
}
function clampA() {
  const n = 36, sx = lin(0, n, 128, 540), sy = lin(-4.5, 9, 226, 26);
  const S = clampSeries('static', n), C = clampSeries('clamp', n), P = clampSeries('pred', n);
  let o = '';
  o += line(sx(0), sy(0), sx(n), sy(0), 'axis') + line(sx(0), sy(-4.5), sx(0), sy(9), 'axis');
  for (const v of [-4, 0, 4, 8]) o += line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  for (const t of [0, 10, 19, 31]) o += line(sx(t), sy(-4.5), sx(t), sy(-4.5) + 4, 'axis') + text(sx(t), sy(-4.5) + 17, String(t), 'ts', 'middle');
  o += text(sx(n), sy(-4.5) + 17, 'scan', 'ts', 'end') + text(sx(0) + 4, sy(9) - 6, 'l', 'ts', 'start');
  o += rect(sx(0), sy(9), sx(10) - sx(0), sy(-4.5) - sy(9), 'wash2');
  o += text(sx(5), sy(-3.4), 'person 站着', 'ts', 'middle');
  const pts = (A) => d(A.map((v, t) => [sx(t), sy(v)]));
  o += path(pts(S), 'dash') + path(pts(C), 'mute') + path(pts(P), 'ln');
  o += text(sx(10) + 10, sy(S[10]) - 2, 'static：8.47', 't', 'start');
  o += text(sx(5.2), sy(3.5) + 17, 'clamp：3.5', 'ts', 'start');
  o += text(sx(13.5), sy(4.9), 'predict，ε = 0.01：4.86', 'tl', 'start');
  o += line(sx(19), sy(0), sx(19), sy(-4.5), 'grid') + line(sx(31), sy(0), sx(31), sy(-4.5), 'grid');
  o += circle(sx(31), sy(S[31]), 3, 'ink-f') + circle(sx(19), sy(P[19]), 3, 'ln-f');
  // 动画：cursor 从 scan 0 走到 n；静态时停在 scan 10
  const T = 13, a = 0.35 / T, b = 1.6 / T, e = 11.4 / T;
  const kt = [0, b, b + 0.0001], frames = [10, 10, 0];
  for (let t = 1; t <= n; t++) { kt.push(b + ((e - b) * t) / n); frames.push(t); }
  kt.push(1); frames.push(n);
  const X = frames.map((t) => sx(t));
  o += `<line x1="${f1(sx(10))}" y1="${f1(sy(9))}" x2="${f1(sx(10))}" y2="${f1(sy(-4.5))}" class="grid">${anim('x1', X.map(f1), kt, T)}${anim('x2', X.map(f1), kt, T)}</line>`;
  for (const [A, cls] of [[S, 'ink-f'], [C, 'mute-f'], [P, 'ln-f']]) {
    const Y = frames.map((t) => sy(A[t]));
    o += `<circle cx="${f1(sx(10))}" cy="${f1(sy(A[10]))}" r="4" class="${cls}">${anim('cx', X.map(f1), kt, T)}${anim('cy', Y.map(f1), kt, T)}</circle>`;
  }
  // 左边：cell 本身，深浅跟着 predict 那条线的 probability
  const cx0 = 20, cy0 = 84, cs = 64;
  o += text(cx0 + cs / 2, cy0 - 12, 'cell', 'ts', 'middle');
  const op = frames.map((t) => sg(P[t]).toFixed(3));
  o += `<rect x="${cx0}" y="${cy0}" width="${cs}" height="${cs}" class="solid" fill-opacity="${op[0]}">${anim('fill-opacity', op, kt, T)}</rect>`;
  o += rect(cx0, cy0, cs, cs, 'frame');
  // person：只在 scan 1 到 10 出现
  const on = frames.map((t) => t >= 1 && t <= 10);
  o += `<g>${circle(cx0 + cs / 2, cy0 + 20, 7, 'paper')}${line(cx0 + cs / 2, cy0 + 27, cx0 + cs / 2, cy0 + 46, 'ink-b')}${line(cx0 + cs / 2 - 10, cy0 + 34, cx0 + cs / 2 + 10, cy0 + 34, 'ink-b')}${anim('opacity', on.map((v) => (v ? 1 : 0)), kt, T, true)}</g>`;
  o += text(cx0 + cs / 2, cy0 + cs + 18, '深浅 = p', 'ts', 'middle');
  return svgA(560, 246, o, '动图：一个 occupancy cell 的 log-odds 随 scan 变化，前 10 个 scan 有 person 站着。Static 的升到 8.47，要 21 个 miss 才回到 0；clamp 在 3.5，9 个 miss；加了 ε = 0.01 的 predict 停在 4.86 附近，同样 9 个 miss');
}

export default {
  'thread-bayes-update-trellis': trellisA,
  'thread-bayes-update-square': squareA,
  'thread-bayes-update-pedigree': pedigreeA,
  'thread-bayes-update-studies': studies,
  'thread-bayes-update-gain': gain,
  'thread-bayes-update-logodds': logodds,
  'thread-bayes-update-clamp': clampA,
};
