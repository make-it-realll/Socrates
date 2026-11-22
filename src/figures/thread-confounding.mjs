import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// 概念线：confounding。数字都在这里现算，和正文里的一致。

const pct = (v, k = 1) => (v * 100).toFixed(k) + '%';
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const rp = (x, y, w, h) => `M${f1(x)} ${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
const arect = (xs, ys, ws, hs, kt, T, cls) => `<path d="${rp(xs[0], ys[0], ws[0], hs[0])}" class="${cls}">${anim('d', xs.map((x, i) => rp(x, ys[i], ws[i], hs[i])), kt, T)}</path>`;
const amtext = (xs, y, s, cls, anchor, kt, T) => `<text x="${f1(xs[0])}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}">${s}${anim('x', xs.map(f1), kt, T)}</text>`;
// 若干个状态，每个停 hold[i] 秒，状态之间过渡 move 秒，最后回到第一个状态
function timeline(hold, move, back = move) {
  const ts = [0], idx = [0];
  let t = 0;
  hold.forEach((h, i) => {
    t += h; ts.push(t); idx.push(i);
    if (i < hold.length - 1) { t += move; ts.push(t); idx.push(i + 1); }
  });
  t += back; ts.push(t); idx.push(0);
  return { kt: ts.map((x) => x / t), idx, T: t };
}

// ---------- data ----------
const KS = { open: { small: [81, 87], large: [192, 263] }, pcnl: { small: [234, 270], large: [55, 80] } };
const GL = { pinch: { light: [324, 360], heavy: [16, 40] }, power: { light: [38, 40], heavy: [112, 160] } };

// 一行 mosaic：方块宽度 ∝ 人数，涂色高度 = success rate。
// 标注放在涂色的部分里；方块太窄或涂色太矮时，放到这一行下面、和方块右边对齐
function mosaicRow(x0, W, y, H, cells, total) {
  let o = '', x = x0;
  for (const c of cells) {
    const w = (W * c.n) / total, r = c.k / c.n, yT = y + H * (1 - r);
    o += rect(x, y, w, H, 'paper-f') + rect(x, yT, w, H * r, 'wash') + line(x, yT, x + w, yT, 'ln') + rect(x, y, w, H, 'frame');
    const cx = x + w / 2;
    if (w >= 64 && r >= 0.6) {
      o += text(cx, yT + 18, c.name, 'ts', 'middle') + text(cx, yT + 36, pct(r), 'tb', 'middle') + text(cx, yT + 52, `${c.k}/${c.n}`, 'ts', 'middle');
    } else {
      o += text(x + w, y + H + 15, `${c.name} ${pct(r)}（${c.k}/${c.n}）`, 'ts', 'end');
    }
    x += w;
  }
  return o;
}
function totalBlock(x, y, w, H, k, n) {
  const r = k / n;
  return rect(x, y, w, H, 'paper-f') + rect(x, y + H * (1 - r), w, H * r, 'wash-strong') + line(x, y + H * (1 - r), x + w, y + H * (1 - r), 'ln') + rect(x, y, w, H, 'frame') +
    text(x + w / 2, y + H * (1 - r) + 24, pct(r), 'tb', 'middle') + text(x + w / 2, y + H * (1 - r) + 41, `${k}/${n}`, 'ts', 'middle');
}

// ---------- 1. kidney stone ----------
function stones() {
  let o = '';
  const X0 = 112, W = 340, H = 84, TX = 478, TW = 70;
  o += text(TX + TW / 2, 16, '合计', 'tb', 'middle');
  o += text(X0, 16, '按 stone 大小分开（宽度 = 病人数）', 'ts', 'start');
  const rows = [['Open surgery', 'open', 28], ['PCNL', 'pcnl', 140]];
  for (const [lab, key, y] of rows) {
    const g = KS[key];
    o += text(4, y + H / 2 + 5, lab, 'tb', 'start');
    o += mosaicRow(X0, W, y, H, [{ name: 'small', k: g.small[0], n: g.small[1] }, { name: 'large', k: g.large[0], n: g.large[1] }], 350);
    o += totalBlock(TX, y, TW, H, g.small[0] + g.large[0], 350);
  }
  o += text(X0 + W / 2, 246, '涂色的部分是成功的病人；两行各 350 人', 'ts', 'middle');
  return svg(560, 250, o, 'Kidney stone 的 mosaic：open surgery 那一行 87 个 small stone、263 个 large stone，PCNL 那一行 270 个 small、80 个 large；每一块里 open surgery 的 success rate 都更高，合计却是 PCNL 的 82.6% 高于 open surgery 的 78.0%');
}

// ---------- 2. grasp log ----------
// pinch：拇指和食指的指尖夹住一个小 cube；power：四指包住一个 bottle
function pinchIcon(cx, cy) {
  let o = '';
  o += rect(cx - 40, cy - 18, 22, 36, 'paper', 6); // palm
  const finger = (sg) => `<path d="M${cx - 18} ${cy - 18 * sg} L${cx + 8} ${cy - 24 * sg} Q${cx + 18} ${cy - 25 * sg} ${cx + 18} ${cy - 15 * sg} L${cx + 18} ${cy - 10 * sg} L${cx + 9} ${cy - 10 * sg} L${cx + 9} ${cy - 14 * sg} Q${cx + 9} ${cy - 16 * sg} ${cx + 6} ${cy - 15.5 * sg} L${cx - 18} ${cy - 9 * sg} Z" class="paper"/>`;
  o += finger(1) + finger(-1); // index 在上，thumb 在下
  o += rect(cx + 5, cy - 10, 17, 20, 'solid2', 1.5); // cube
  return o;
}
function powerIcon(cx, cy) {
  let o = '';
  o += rect(cx + 2, cy - 30, 22, 7, 'solid2', 1.5) + rect(cx - 4, cy - 24, 34, 54, 'solid2', 6); // bottle
  o += rect(cx - 38, cy - 18, 22, 36, 'paper', 6); // palm
  for (const dy of [-15, -3, 9]) o += `<path d="M${cx - 18} ${cy + dy} L${cx + 26} ${cy + dy} Q${cx + 34} ${cy + dy} ${cx + 34} ${cy + dy + 5} Q${cx + 34} ${cy + dy + 10} ${cx + 26} ${cy + dy + 10} L${cx - 18} ${cy + dy + 10} Z" class="paper"/>`;
  return o;
}
function grasp() {
  let o = '';
  const X0 = 118, W = 336, H = 84, TX = 478, TW = 70;
  o += text(TX + TW / 2, 16, '合计', 'tb', 'middle');
  o += text(X0, 16, '按 object 分开（每一行的宽度 = 这种 primitive 的全部 grasp）', 'ts', 'start');
  const rows = [['pinch', 28, pinchIcon], ['power', 140, powerIcon]];
  for (const [key, y, icon] of rows) {
    const g = GL[key], n = g.light[1] + g.heavy[1];
    o += icon(52, y + 34) + text(52, y + H + 2, key, 'tb', 'middle');
    o += mosaicRow(X0, W, y, H, [{ name: 'light', k: g.light[0], n: g.light[1] }, { name: 'heavy', k: g.heavy[0], n: g.heavy[1] }], n);
    o += totalBlock(TX, y, TW, H, g.light[0] + g.heavy[0], n);
  }
  o += text(X0 + W / 2, 246, 'Pinch 一共 400 次，power 一共 200 次', 'ts', 'middle');
  return svg(560, 250, o, 'Grasp log 的 mosaic：pinch 360 次 light（90%）、40 次 heavy（40%），合计 85%；power 40 次 light（95%）、160 次 heavy（70%），合计 75%');
}

// ---------- 3. IPW：pseudo-population ----------
function reweightA() {
  const { kt, idx, T } = timeline([2.4, 3.2], 1.6, 1.0);
  const X0 = 112, W = 340, H = 84, TX = 478, TW = 70;
  const ns = { small: 357, large: 343 };
  let o = '';
  o += text(TX + TW / 2, 16, '合计', 'tb', 'middle');
  o += grp(text(X0, 16, '实际的病人：每一行各 350 人', 'ts', 'start'), idx.map((i) => i === 0), kt, T);
  o += grp(text(X0, 16, '每人乘上 1/e：每一行都变成 357 个 small、343 个 large', 'ts', 'start'), idx.map((i) => i === 1), kt, T);
  const rows = [['Open surgery', 'open', 28], ['PCNL', 'pcnl', 140]];
  for (const [lab, key, y] of rows) {
    const g = KS[key];
    o += text(4, y + H / 2 + 5, lab, 'tb', 'start');
    // 两个状态下的宽度：实际人数 / 350，加权后人数 / 700
    const w0 = { small: (W * g.small[1]) / 350, large: (W * g.large[1]) / 350 };
    const w1 = { small: (W * ns.small) / 700, large: (W * ns.large) / 700 };
    const at = (f) => idx.map((i) => f(i));
    let xL = X0;
    for (const s of ['small', 'large']) {
      const r = g[s][0] / g[s][1];
      const xs = at((i) => (s === 'small' ? X0 : X0 + (i ? w1.small : w0.small)));
      const ws = at((i) => (i ? w1[s] : w0[s]));
      const yT = y + H * (1 - r);
      o += arect(xs, at(() => y), ws, at(() => H), kt, T, 'paper-f');
      o += arect(xs, at(() => yT), ws, at(() => H * r), kt, T, 'wash');
      o += arect(xs, at(() => yT), ws, at(() => 0), kt, T, 'ln');
      o += arect(xs, at(() => y), ws, at(() => H), kt, T, 'frame');
      const cx = xs.map((x, j) => x + ws[j] / 2);
      o += amtext(cx, yT + 18, s, 'ts', 'middle', kt, T);
      o += amtext(cx, yT + 36, pct(r), 'tb', 'middle', kt, T);
      const wt = ns[s] / g[s][1];
      o += `<g opacity="1">${amtext(cx, yT + 52, `${g[s][1]} 人`, 'ts', 'middle', kt, T)}${ashow(idx.map((i) => i === 0), kt, T)}</g>`;
      o += `<g opacity="0">${amtext(cx, yT + 52, `×${wt.toFixed(2)} → ${ns[s]}`, 'ts', 'middle', kt, T)}${ashow(idx.map((i) => i === 1), kt, T)}</g>`;
      xL += w0[s];
    }
    // 合计：crude 与加权
    const crude = (g.small[0] + g.large[0]) / 350;
    const std = (ns.small * g.small[0] / g.small[1] + ns.large * g.large[0] / g.large[1]) / 700;
    const rr = idx.map((i) => (i ? std : crude));
    o += rect(TX, y, TW, H, 'paper-f');
    o += arect(rr.map(() => TX), rr.map((r) => y + H * (1 - r)), rr.map(() => TW), rr.map((r) => H * r), kt, T, 'wash-strong');
    o += rect(TX, y, TW, H, 'frame');
    o += grp(text(TX + TW / 2, y + H * (1 - crude) + 24, pct(crude), 'tb', 'middle') + text(TX + TW / 2, y + H * (1 - crude) + 41, 'crude', 'ts', 'middle'), idx.map((i) => i === 0), kt, T);
    o += grp(text(TX + TW / 2, y + H * (1 - std) + 24, pct(std), 'tb', 'middle') + text(TX + TW / 2, y + H * (1 - std) + 41, 'adjusted', 'ts', 'middle'), idx.map((i) => i === 1), kt, T);
  }
  o += text(X0 + W / 2, 246, '方块里的 success rate 不变，变的只是每一块有多少人', 'ts', 'middle');
  return svgA(560, 250, o, '动图：kidney stone 的每个病人乘上 1/e。Open surgery 的 87 个 small stone 乘 4.10 变成 357，263 个 large 乘 1.30 变成 343；PCNL 的 270 个乘 1.32、80 个乘 4.29。合计从 78.0% 和 82.6% 变成 83.3% 和 77.9%');
}

// ---------- 4. regression to the mean ----------
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function rtmA() {
  const R = rng(1101), pts = [];
  for (let i = 0; i < 300; i++) {
    const u1 = R() || 1e-9, u2 = R(), u3 = R() || 1e-9, u4 = R();
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2), z2 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
    pts.push([50 + 10 * z1, 50 + 10 * (0.5 * z1 + Math.sqrt(0.75) * z2)]);
  }
  const T = 8, kt = [0, 0.5, 1];
  const fa = [1, 0, 1], fb = [0, 1, 0];
  const sx = lin(15, 85, 62, 302), sy = lin(15, 85, 272, 32);
  let o = '';
  // band
  o += grp(rect(sx(15), sy(85), sx(30) - sx(15), sy(15) - sy(85), 'wash'), fa, kt, T);
  o += grp(rect(sx(15), sy(30), sx(85) - sx(15), sy(15) - sy(30), 'wash'), fb, kt, T);
  o += axes({ sx, sy, x0: 15, x1: 85, y0: 15, y1: 85, xt: [30, 50, 70], yt: [30, 50, 70] });
  o += text(sx(85), sy(15) + 32, '前一次 X₁', 'ts', 'end') + text(sx(15) + 4, sy(85) - 10, '后一次 X₂', 'ts', 'start');
  // contours
  for (const c of [1, 2]) {
    const P = [];
    for (let k = 0; k <= 96; k++) { const t = (2 * Math.PI * k) / 96, a = c * Math.sqrt(150) * Math.cos(t), b = c * Math.sqrt(50) * Math.sin(t); P.push([sx(50 + (a + b) / Math.SQRT2), sy(50 + (a - b) / Math.SQRT2)]); }
    o += path(d(P) + 'Z', 'grid');
  }
  for (const [x, y] of pts) if (x > 16.5 && x < 84 && y > 16.5 && y < 84) o += circle(sx(x), sy(y), 1.7, 'mute-f');
  // 挑出来的点
  o += grp(pts.filter(([x, y]) => x > 16.5 && x < 30 && y > 16.5 && y < 84).map(([x, y]) => circle(sx(x), sy(y), 3, 'ln-f')).join(''), fa, kt, T);
  o += grp(pts.filter(([x, y]) => y > 16.5 && y < 30 && x > 16.5 && x < 84).map(([x, y]) => circle(sx(x), sy(y), 3, 'ln-f')).join(''), fb, kt, T);
  // 45° line
  o += line(sx(18), sy(18), sx(82), sy(82), 'dash');
  // regression line
  const m = 26.27, mm = 50 + 0.5 * (m - 50);
  o += grp(line(sx(15), sy(50 + 0.5 * (15 - 50)), sx(85), sy(50 + 0.5 * (85 - 50)), 'ln') +
    circle(sx(m), sy(m), 4, 'paper') + arrow(sx(m), sy(m) - 5, sx(m), sy(mm) + 6, 'ink') + circle(sx(m), sy(mm), 5, 'ink-f') +
    rect(sx(30) + 3, sy((m + mm) / 2) - 11, 42, 18, 'paper-f') + text(sx(30) + 6, sy((m + mm) / 2) + 3, '+11.9', 'tb', 'start'), fa, kt, T);
  o += grp(line(sx(50 + 0.5 * (15 - 50)), sy(15), sx(50 + 0.5 * (85 - 50)), sy(85), 'ln') +
    circle(sx(m), sy(m), 4, 'paper') + arrow(sx(m) + 5, sy(m), sx(mm) - 6, sy(m), 'ink') + circle(sx(mm), sy(m), 5, 'ink-f') +
    rect((sx(m) + sx(mm)) / 2 - 21, sy(30) - 24, 42, 18, 'paper-f') + text((sx(m) + sx(mm)) / 2, sy(30) - 10, '+11.9', 'tb', 'middle'), fb, kt, T);
  // 右边的读数
  const TX = 330;
  o += grp(text(TX, 70, '按前一次挑：X₁ < 30', 'tb') + text(TX, 96, '这些天 X₁ 的平均：26.3', 't') + text(TX, 120, '它们后一次 X₂ 的平均：', 't') + text(TX, 142, '50 + 0.5 × (26.3 − 50) = 38.1', 't') +
    text(TX, 178, '什么都没做，“好了” 11.9 分', 'ts'), fa, kt, T);
  o += grp(text(TX, 70, '按后一次挑：X₂ < 30', 'tb') + text(TX, 96, '这些天 X₂ 的平均：26.3', 't') + text(TX, 120, '它们前一次 X₁ 的平均：', 't') + text(TX, 142, '50 + 0.5 × (26.3 − 50) = 38.1', 't') +
    text(TX, 178, '最糟那天的前一天也“好得多”', 'ts'), fb, kt, T);
  o += line(TX, 206, TX + 26, 206, 'ln') + grp(text(TX + 34, 210, 'regression line E[X₂ | X₁]', 'ts'), fa, kt, T) + grp(text(TX + 34, 210, 'regression line E[X₁ | X₂]', 'ts'), fb, kt, T);
  o += line(TX, 228, TX + 26, 228, 'dash') + text(TX + 34, 232, 'X₂ = X₁：两次一样', 'ts');
  o += text(TX, 258, 'mean 50，SD 10，ρ = 0.5', 'ts') + text(TX, 278, '彩色的点是被挑出来的那些天', 'ts');
  return svgA(560, 310, o, '动图：两次心情分数的 scatter plot，ρ = 0.5。按前一次低于 30 挑出的那些天，后一次的平均是 38.1；按后一次低于 30 挑出的那些天，前一次的平均也是 38.1');
}

// ---------- 5. component cause：12 个 case ----------
function piesA() {
  // 顺序：只需要 smoking 3 个，两样都需要 6 个，只需要 alcohol 2 个，background 1 个
  const kinds = [...Array(3).fill('s'), ...Array(6).fill('b'), ...Array(2).fill('a'), 'n'];
  const cls = { s: 'band-p ink-s', b: 'solid ink-s', a: 'wash ink-s', n: 'wash2 ink-s' };
  const needS = (k) => k === 's' || k === 'b', needA = (k) => k === 'a' || k === 'b';
  const { kt, idx, T } = timeline([2.4, 2.6, 2.6, 2.8], 0.01, 0.01);
  const frames = [() => true, (k) => !needS(k), (k) => !needA(k), (k) => !needS(k) && !needA(k)];
  let o = '';
  const x0 = 34, step = 42, yb = 118;
  const person = (x, c) => circle(x, yb - 44, 7, c) + `<path d="M${x - 12} ${yb} L${x - 12} ${yb - 22} Q${x - 12} ${yb - 32} ${x} ${yb - 32} Q${x + 12} ${yb - 32} ${x + 12} ${yb - 22} L${x + 12} ${yb} Z" class="${c}"/>`;
  const ghost = (x) => `<circle cx="${x}" cy="${yb - 44}" r="7" class="dash"/><path d="M${x - 12} ${yb} L${x - 12} ${yb - 22} Q${x - 12} ${yb - 32} ${x} ${yb - 32} Q${x + 12} ${yb - 32} ${x + 12} ${yb - 22} L${x + 12} ${yb} Z" class="dash"/>`;
  kinds.forEach((k, j) => {
    const x = x0 + j * step + 12;
    o += ghost(x);
    o += `<g opacity="1">${person(x, cls[k])}${ashow(idx.map((i) => frames[i](k)), kt, T)}</g>`;
  });
  const cx = (j) => x0 + j * step + 12;
  // 上面的括号：需要 smoking 的 9 个；下面的：需要 alcohol 的 8 个
  const br = (j0, j1, y, up, s) => {
    const a = cx(j0) - 14, b = cx(j1) + 14, t = up ? y - 6 : y + 6;
    return path(`M${a} ${y}L${a} ${t}L${b} ${t}L${b} ${y}`, 'ink') + text((a + b) / 2, up ? t - 6 : t + 16, s, 'ts', 'middle');
  };
  o += br(0, 8, 62, true, '需要 smoking：9 个');
  o += br(3, 10, 124, false, '需要 alcohol：8 个');
  o += text(cx(11), 146, 'background', 'ts', 'middle');
  o += text(cx(1), 146, '只需要 smoking', 'ts', 'middle');
  const msgs = [
    ['又吸烟又喝酒的人：每 100,000 person-year 12 个 case', ''],
    ['去掉 smoking：消失 9 个，剩 3 个', '归 smoking 的比例 9/12 = 75%'],
    ['去掉 alcohol：消失 8 个，剩 4 个', '归 alcohol 的比例 8/12 = 67%'],
    ['两样都去掉：消失 11 个，剩 1 个', '11/12 = 92%，不是 75% + 67% = 142%'],
  ];
  msgs.forEach(([a, b], j) => {
    const on = idx.map((i) => i === j);
    o += grp(text(280, 184, a, 'tb', 'middle') + text(280, 206, b, 'ts', 'middle'), on, kt, T);
  });
  return svgA(560, 216, o, '动图：Rothman 与 Greenland 的 Table 1 里，又吸烟又喝酒的人每 100,000 person-year 有 12 个 case：3 个只需要 smoking，6 个两样都需要，2 个只需要 alcohol，1 个是 background。去掉 smoking 消失 9 个，去掉 alcohol 消失 8 个，两样都去掉消失 11 个');
}

// ---------- 6. Fisher randomization test ----------
function frtA() {
  const y = [9, 7, 8, 6, 5, 3, 6, 4];
  const combos = [];
  const rec = (start, pick) => { if (pick.length === 4) { combos.push(pick.slice()); return; } for (let i = start; i < 8; i++) { pick.push(i); rec(i + 1, pick); pick.pop(); } };
  rec(0, []);
  const diff = (c) => { const s = new Set(c); let a = 0, b = 0; y.forEach((v, i) => (s.has(i) ? (a += v) : (b += v))); return a / 4 - b / 4; };
  // 每个 value 一列，按枚举顺序往上堆
  const stack = {}, pos = combos.map((c) => { const v = diff(c), key = v.toFixed(2); stack[key] = (stack[key] || 0) + 1; return [v, stack[key] - 1]; });
  const show = [0, 37, 12, 50, 66, 20]; // 第一个是实际的标法 {0,1,2,3}
  const hold = show.map((_, j) => (j ? 1.7 : 3.2));
  const { kt, idx, T } = timeline(hold, 0.01, 0.01);
  let o = '';
  const base = 300;
  // 8 个 heavy object：bottle
  const bx = (i) => 64 + i * 61;
  y.forEach((v, i) => {
    const x = bx(i);
    o += rect(x - 7, 52, 14, 8, 'solid2', 1.5) + rect(x - 14, 58, 28, 46, 'solid2', 5);
    o += text(x, 124, String(v), 'tb', 'middle');
  });
  o += text(bx(0) - 30, 124, '成功', 'ts', 'end') + text(bx(0) - 30, 138, '/10', 'ts', 'end');
  show.forEach((ci, j) => {
    const on = idx.map((i) => i === j), s = new Set(combos[ci]);
    let g = '';
    y.forEach((v, i) => {
      const x = bx(i);
      g += s.has(i) ? rect(x - 23, 22, 46, 20, 'solid', 4) + text(x, 37, 'power', 'tw', 'middle') : rect(x - 23, 22, 46, 20, 'paper', 4) + text(x, 37, 'pinch', 'ts', 'middle');
    });
    const v = diff(combos[ci]);
    g += text(280, 158, `这一种标法：power 的平均 − pinch 的平均 = ${v < 0 ? '−' : ''}${Math.abs(v).toFixed(2)}`, 'tb', 'middle');
    const [vv, h] = pos[ci];
    g += circle(sx(vv), base - 5 - h * 10, 7.5, 'ln');
    o += grp(g, on, kt, T);
  });
  // dot plot
  function sx(v) { return 280 + v * 70; }
  o += rect(sx(2.75), base - 118, sx(3.25) - sx(2.75), 118, 'wash');
  for (let v = -3; v <= 3; v += 0.5) o += line(sx(v), base, sx(v), base + 4, 'axis') + (Number.isInteger(v) ? text(sx(v), base + 17, (v < 0 ? '−' : '') + Math.abs(v), 'ts', 'middle') : '');
  o += line(sx(-3.25), base, sx(3.25), base, 'axis');
  pos.forEach(([v, h], ci) => { o += circle(sx(v), base - 5 - h * 10, 4.2, ci === 0 || (v >= 3 - 1e-9) ? 'ln-f' : 'mute-f'); });
  o += text(sx(3), base - 124, '≥ 3.0：2 种', 'tl', 'middle');
  o += text(sx(-3.25), base - 100, '70 种标法', 'ts', 'start') + text(sx(-3.25), base - 84, '各一个点', 'ts', 'start');
  return svgA(560, 322, o, '动图：8 个 heavy object 的成功次数 9、7、8、6、5、3、6、4 固定不动，power 与 pinch 的标法一次换一种。70 种标法的平均差堆成一个 symmetric 的 distribution，实际的标法给出 3.0，在最右端，不小于 3.0 的只有 2 种');
}

// ---------- 7. brake light ----------
function brake() {
  let o = '';
  // 左：windshield 与 dashboard
  o += path('M20 18L280 18L262 128L38 128Z', 'paper');
  o += path('M150 40L104 128', 'mute') + path('M150 40L196 128', 'mute') + line(150, 70, 150, 82, 'mute') + line(150, 96, 150, 112, 'mute');
  // pedestrian
  const px = 182, py = 98;
  o += circle(px, py - 26, 5, 'solid2') + path(`M${px - 5} ${py}L${px - 5} ${py - 14}Q${px - 5} ${py - 20} ${px} ${py - 20}Q${px + 5} ${py - 20} ${px + 5} ${py - 14}L${px + 5} ${py}Z`, 'solid2');
  o += text(px + 12, py - 26, 'pedestrian', 'ts', 'start');
  o += rect(20, 134, 260, 62, 'paper', 8);
  o += circle(84, 166, 22, 'paper') + line(84, 166, 98, 154, 'ink-b') + text(84, 179, 'km/h', 'ts', 'middle');
  o += circle(196, 164, 12, 'solid') + text(196, 168, '!', 'tw', 'middle') + text(196, 190, 'brake light', 'ts', 'middle');
  o += text(150, 220, 'model 看到的整个画面', 'ts', 'middle');
  // 右：causal graph
  const node = (x, y, s, w = 96) => rect(x - w / 2, y - 14, w, 28, 'paper', 6) + text(x, y + 5, s, 't', 'middle');
  const At = (sup, rest) => `A<tspan class="sup" dy="-5">${sup}</tspan><tspan dy="5">${rest}</tspan>`;
  const P = [372, 38], A1 = [372, 116], L = [372, 196], A = [508, 116];
  o += node(...P, 'pedestrian') + node(...A1, At('t−1', ' 刹车')) + node(...L, 'brake light', 104) + node(...A, At('t', ' 刹车'), 84);
  o += arrow(P[0], P[1] + 14, A1[0], A1[1] - 15, 'ink');
  o += arrow(P[0] + 40, P[1] + 14, A[0] - 24, A[1] - 15, 'ink');
  o += arrow(A1[0], A1[1] + 14, L[0], L[1] - 15, 'ink');
  o += arrow(L[0] + 52, L[1] - 6, A[0] - 18, A[1] + 15, 'ln-dash');
  o += text(470, 186, 'model 学到的', 'tl', 'start');
  o += text(462, 68, 'expert 的 cause', 'ts', 'start');
  return svg(560, 226, o, '左：driver 视角的画面，前方有 pedestrian，dashboard 上 brake light 亮着。右：causal graph，pedestrian 指向上一步和这一步的刹车，上一步的刹车指向 brake light；model 学到的是从 brake light 指向这一步刹车的虚线');
}

// ---------- 8. positivity ----------
function supportA() {
  const NS = [40, 10, 2, 0];
  const { kt, idx, T } = timeline([2.4, 2.2, 2.2, 2.8], 1.0, 1.0);
  const at = (f) => idx.map((i) => f(i));
  const X0 = 90, W = 360, y = 34, H = 84;
  let o = '';
  o += text(X0, 22, 'Heavy object 的 200 次 grasp', 'ts', 'start');
  o += text(4, y + H / 2 + 5, 'heavy', 'tb', 'start');
  const wP = at((i) => (W * NS[i]) / 200), wW = at((i) => W - (W * NS[i]) / 200);
  const xW = at((i) => X0 + (W * NS[i]) / 200);
  for (const [xs, ws, r, cl] of [[at(() => X0), wP, 0.4, 'p'], [xW, wW, 0.7, 'w']]) {
    const yT = y + H * (1 - r);
    o += arect(xs, at(() => y), ws, at(() => H), kt, T, 'paper-f') + arect(xs, at(() => yT), ws, at(() => H * r), kt, T, 'wash') + arect(xs, at(() => yT), ws, at(() => 0), kt, T, 'ln') + arect(xs, at(() => y), ws, at(() => H), kt, T, 'frame');
    if (cl === 'w') { const cx = xs.map((x, j) => x + ws[j] / 2); o += amtext(cx, yT + 22, 'power 70%', 'ts', 'middle', kt, T); }
    else o += grp(text(X0 + (W * NS[0]) / 400, y + 22, 'pinch 40%', 'ts', 'middle'), idx.map((i) => i === 0), kt, T);
  }
  // 每一帧的读数
  const se = (n) => Math.sqrt((4 / 9) * (0.09 / 360) + (1 / 9) * (0.24 / n));
  const sv = lin(0.4, 1.0, 120, 520), ly = 214;
  NS.forEach((n, j) => {
    const on = idx.map((i) => i === j);
    let g = text(X0 + W + 8, y + 30, `pinch：${n} 次`, 'tb', 'start');
    g += text(X0 + W + 8, y + 52, n ? `weight ${200 / n}` : 'weight ∞', 'ts', 'start');
    if (n) {
      const h = 1.96 * se(n);
      g += line(sv(0.7333 - h), ly, sv(0.7333 + h), ly, 'ln') + line(sv(0.7333 - h), ly - 8, sv(0.7333 - h), ly + 8, 'ln') + line(sv(0.7333 + h), ly - 8, sv(0.7333 + h), ly + 8, 'ln') + circle(sv(0.7333), ly, 5, 'ln-f');
      g += text(sv(0.7333), ly - 16, `0.733 ± ${h.toFixed(3)}`, 'tl', 'middle');
    } else g += text(sv(0.7), ly - 14, '没有 pinch 抓 heavy 的 data：没有 estimate', 'tl', 'middle');
    o += grp(g, on, kt, T);
  });
  o += line(sv(0.4), ly + 22, sv(1.0), ly + 22, 'axis');
  for (const v of [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]) o += line(sv(v), ly + 22, sv(v), ly + 26, 'axis') + text(sv(v), ly + 39, v.toFixed(1), 'ts', 'middle');
  o += text(4, ly + 4, '一律 pinch', 'tb', 'start') + text(4, ly + 20, '的 95% interval', 'ts', 'start');
  o += text(X0, 150, 'Light 那一行不变：pinch 360 次（90%）、power 40 次（95%）', 'ts', 'start');
  return svgA(560, 262, o, '动图：heavy object 上 pinch 的次数从 40 缩到 10、2、0，这几次 grasp 的 IPS weight 从 5 变成 20、100、无穷；一律 pinch 的 success rate 0.733 的 95% interval 从 ±0.055 变成 ±0.103、±0.227，最后没有 estimate');
}

export default {
  'thread-confounding-stones': stones,
  'thread-confounding-grasp': grasp,
  'thread-confounding-reweight': reweightA,
  'thread-confounding-rtm': rtmA,
  'thread-confounding-pies': piesA,
  'thread-confounding-frt': frtA,
  'thread-confounding-brake': brake,
  'thread-confounding-support': supportA,
};
