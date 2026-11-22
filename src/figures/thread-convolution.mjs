import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, axes, apath, anim, f1 } from '../lib/svg.mjs';

// 概念线：convolution 与 Fourier。所有数在这里现算，和正文一致。

const PI = Math.PI;
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${anim('opacity', on.map((v) => (v ? 1 : 0)), kt, T, true)}</g>`;
const atext = (x, y, s, cls, anchor, on, kt, T) => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" opacity="${on[0] ? 1 : 0}">${s}${anim('opacity', on.map((v) => (v ? 1 : 0)), kt, T, true)}</text>`;
// 只动 cy 的点
const dotY = (x, ys, kt, T, r, cls) => `<circle cx="${f1(x)}" cy="${f1(ys[0])}" r="${r}" class="${cls}">${anim('cy', ys.map(f1), kt, T)}</circle>`;
// 一串状态，每个停 hold[i] 秒，状态之间跳变（discrete）。返回每个状态的 on 数组生成器
function steps(holds) {
  const T = holds.reduce((a, b) => a + b, 0);
  const kt = [];
  let t = 0;
  for (const h of holds) { kt.push(t / T); t += h; }
  return { kt, T, on: (i) => holds.map((_, j) => j === i) };
}
const frac = (v) => (Math.abs(v - 0.5) < 1e-9 ? '½' : Math.abs(v - 0.25) < 1e-9 ? '¼' : Math.abs(v - 0.75) < 1e-9 ? '¾' : String(v));
// 像素格：值 1 深色、0 白、½ 浅色
function cell(x, y, s, v, label = true) {
  const cls = v === 1 ? 'solid' : v === 0 ? 'paper' : 'wash-strong';
  let o = rect(x, y, s, s, cls, 2);
  if (v !== 1 && v !== 0) o += rect(x, y, s, s, 'frame', 2);
  if (label) o += text(x + s / 2, y + s / 2 + 4.5, frac(v), v === 1 ? 'tw' : 't', 'middle');
  return o;
}

// ---------- 1. 条纹：stride 2 直接取 vs 先 (1,2,1)/4 再取 ----------
function stripesA() {
  const S = 28, G = 32, Y0 = 46, Y1 = 118, Y2 = 190;
  const X = (half, n) => (half ? 296 : 16) + n * G;
  const st = steps([2.2, 2.2]);
  const xs = [[1, 0, 1, 0, 1, 0, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1]];
  let o = '';
  o += text(X(0, 0), 16, '直接隔一个取一个', 'tb', 'start');
  o += text(X(1, 0), 16, '先 (1, 2, 1)/4，再隔一个取一个', 'tb', 'start');
  for (const half of [0, 1]) {
    for (let s = 0; s < 2; s++) {
      let g = '';
      const x = xs[s];
      for (let n = 0; n < 8; n++) g += cell(X(half, n), Y0, S, x[n]);
      if (half === 0) {
        for (let m = 0; m < 4; m++) g += cell(X(0, 2 * m), Y2, S, x[2 * m]);
        g += text(X(0, 0), Y2 + S + 20, s ? 'output (0, 0, 0, 0)' : 'output (1, 1, 1, 1)', 'tl', 'start');
      }
      o += grp(g, st.on(s), st.kt, st.T);
      o += atext(X(half, 0), Y0 - 8, s ? 'input 向右挪了 1 个 pixel' : 'input', 'ts', 'start', st.on(s), st.kt, st.T);
    }
    // 被取的位置：彩框与向下的箭头
    const last = half ? Y1 : Y0;
    for (let m = 0; m < 4; m++) {
      const cx = X(half, 2 * m);
      o += rect(cx - 2, last - 2, S + 4, S + 4, 'ln', 3);
      o += arrow(cx + S / 2, last + S + 4, cx + S / 2, Y2 - 5, 'ink');
    }
    if (half === 1) {
      // 平均：三个邻居的箭头（画在第 3 格上）
      const c = X(1, 3) + S / 2;
      for (const [dx, w] of [[-1, '¼'], [0, '½'], [1, '¼']]) {
        o += line(c + dx * G, Y0 + S + 3, c + dx * 6, Y1 - 3, 'mute');
        o += text(c + dx * (G - 3) + (dx ? 0 : 6), Y0 + S + 17, w, 'ts', dx < 0 ? 'end' : 'start');
      }
      for (let n = 0; n < 8; n++) o += cell(X(1, n), Y1, S, 0.5);
      o += text(X(1, 7) + S, Y1 - 6, '每格 = ½', 'ts', 'end');
      for (let m = 0; m < 4; m++) o += cell(X(1, 2 * m), Y2, S, 0.5);
      o += text(X(1, 0), Y2 + S + 20, 'output (½, ½, ½, ½)，挪不挪都一样', 'tl', 'start');
    }
  }
  o += line(280, 6, 280, 240, 'grid');
  return svgA(560, 244, o, '动图：左边，条纹 (1,0,1,0,1,0,1,0) 隔一个取一个得 (1,1,1,1)，向右挪一个 pixel 后得 (0,0,0,0)。右边，先用 (1,2,1)/4 平均，整行变成 ½，再取，挪不挪都是 (½,½,½,½)');
}

// ---------- 2. Circulant：每个 column 是 h 往下挪 ----------
function circulantA() {
  const N = 8, s = 23, cx0 = 34, cy0 = 52, sx0 = 336;
  const h = (k) => (k === 0 ? 0.5 : Math.abs(k) === 1 ? 0.25 : 0);
  const Cv = (i, j) => h(((i - j + N + 4) % N) - 4); // C[i][j] = h[i-j]（cyclic）
  let o = '';
  o += text(cx0, 18, 'C：N = 8，kernel (1, 2, 1)/4', 'tb', 'start');
  o += text(sx0, 18, 'S：(Sx)[n] = x[n − 1]', 'tb', 'start');
  for (let j = 0; j < N; j++) o += text(cx0 + j * s + s / 2, cy0 - 6, String(j), 'ts', 'middle') + text(sx0 + j * s + s / 2, cy0 - 6, String(j), 'ts', 'middle');
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const v = Cv(i, j), x = cx0 + j * s, y = cy0 + i * s;
    o += rect(x, y, s, s, v === 0.5 ? 'wash-strong' : v === 0.25 ? 'wash' : 'paper-f');
    o += rect(x, y, s, s, 'frame');
    if (v) o += text(x + s / 2, y + s / 2 + 4.5, frac(v), 't', 'middle');
    const sv = (i - j + N) % N === 1 ? 1 : 0, xs = sx0 + j * s;
    o += rect(xs, y, s, s, sv ? 'solid' : 'paper-f') + rect(xs, y, s, s, 'frame');
    if (sv) o += text(xs + s / 2, y + s / 2 + 4.5, '1', 'tw', 'middle');
  }
  // 彩框走过每个 column
  const st = steps(Array.from({ length: N }, (_, j) => (j === 0 ? 2.4 : 0.9)));
  const xsF = Array.from({ length: N }, (_, j) => f1(cx0 + j * s - 1.5));
  o += `<rect x="${xsF[0]}" y="${f1(cy0 - 1.5)}" width="${s + 3}" height="${N * s + 3}" rx="2" class="ln">${anim('x', xsF, st.kt, st.T, true)}</rect>`;
  const colTxt = (j) => '(' + Array.from({ length: N }, (_, i) => (Cv(i, j) ? frac(Cv(i, j)) : '0')).join(', ') + ')';
  for (let j = 0; j < N; j++) o += atext(cx0, cy0 + N * s + 22, `column ${j} = S${'⁰¹²³⁴⁵⁶⁷'[j]}h = ${colTxt(j)}`, 'tl', 'start', st.on(j), st.kt, st.T);
  o += text(sx0, cy0 + N * s + 22, 'C = ¼S⁻¹ + ½I + ¼S', 't', 'start');
  o += text(sx0, cy0 + N * s + 42, '所以 CS = SC', 'ts', 'start');
  o += text(cx0, cy0 + N * s + 42, '挪出底部的从顶部回来', 'ts', 'start');
  return svgA(560, cy0 + N * s + 50, o, '动图：8×8 的 circulant C，diagonal 上是 ½，两侧和两个角上是 ¼；彩框依次走过每个 column，第 j 个 column 是第 0 个往下挪 j 格。右边是 cyclic shift 的 permutation matrix S');
}

// ---------- 3. Eigenvector：cos ωn 经过 (1,2,1)/4 ----------
function eigenA() {
  const H = (w) => Math.cos(w / 2) ** 2;
  // ω 的路线：π/2 停，扫到 π，停，扫到 0，停，扫回 π/2
  const seq = [], tim = [];
  let t = 0;
  const push = (w, dt) => { t += dt; seq.push(w); tim.push(t); };
  seq.push(PI / 2); tim.push(0);
  push(PI / 2, 1.8);
  for (let k = 1; k <= 8; k++) push(PI / 2 + (k * PI) / 16, 0.22);
  push(PI, 1.0);
  for (let k = 1; k <= 16; k++) push(PI - (k * PI) / 16, 0.22);
  push(0, 1.0);
  for (let k = 1; k <= 8; k++) push((k * PI) / 16, 0.22);
  const T = t, kt = tim.map((x) => x / T);
  const sx = lin(0, 15, 34, 300), sy = lin(-1.15, 1.15, 196, 44);
  let o = '';
  o += line(sx(-0.5), sy(0), sx(15.5), sy(0), 'axis') + text(sx(15.5), sy(0) + 16, 'n', 'ts', 'end');
  for (const v of [-1, 1]) o += line(sx(-0.5) - 4, sy(v), sx(-0.5), sy(v), 'axis') + text(sx(-0.5) - 7, sy(v) + 4, v < 0 ? '−1' : '1', 'ts', 'end');
  for (let n = 0; n < 16; n++) {
    o += dotY(sx(n), seq.map((w) => sy(Math.cos(w * n))), kt, T, 4.2, 'paper');
    o += dotY(sx(n), seq.map((w) => sy(H(w) * Math.cos(w * n))), kt, T, 3.4, 'ln-f');
  }
  o += circle(40, 20, 4.2, 'paper') + text(48, 24, 'input cos ωn', 'ts', 'start');
  o += circle(150, 20, 3.4, 'ln-f') + text(158, 24, 'output = H(ω) cos ωn', 'ts', 'start');
  // 右：H(ω) = cos²(ω/2)
  const px = lin(0, PI, 360, 540), py = lin(0, 1, 196, 56);
  o += axes({ sx: px, sy: py, x0: 0, x1: PI, y0: 0, y1: 1, xt: [[0, '0'], [PI / 2, 'π/2'], [PI, 'π']], yt: [[0, '0'], [0.5, '½'], [1, '1']] });
  o += text(px(PI) + 2, py(0) + 32, 'ω', 'ts', 'end');
  o += path(d(Array.from({ length: 121 }, (_, i) => { const w = (PI * i) / 120; return [px(w), py(H(w))]; })), 'ink');
  o += text(px(0.35), py(1) - 10, 'H(ω) = cos²(ω/2)', 't', 'start');
  o += `<line x1="${f1(px(seq[0]))}" y1="${f1(py(0))}" x2="${f1(px(seq[0]))}" y2="${f1(py(H(seq[0])))}" class="dash">${anim('x1', seq.map((w) => f1(px(w))), kt, T)}${anim('x2', seq.map((w) => f1(px(w))), kt, T)}${anim('y2', seq.map((w) => f1(py(H(w)))), kt, T)}</line>`;
  o += `<circle cx="${f1(px(seq[0]))}" cy="${f1(py(H(seq[0])))}" r="5" class="ln-f">${anim('cx', seq.map((w) => f1(px(w))), kt, T)}${anim('cy', seq.map((w) => f1(py(H(w)))), kt, T)}</circle>`;
  o += line(px(PI) - 2, py(0) - 4, px(PI) - 14, py(0.22), 'mute') + text(px(PI) - 16, py(0.22) - 4, 'H(π) = 0', 'ts', 'end');
  return svgA(560, 236, o, '动图：cos ωn 的 16 个 sample 经过 (1,2,1)/4，output 是同一个 frequency 的 cos，乘以 H(ω) = cos²(ω/2)；ω 从 π/2 扫到 π（output 变成 0），再扫到 0（output 等于 input）');
}

// ---------- 4. 隔一个取一个：frequency 折叠 ----------
function foldA() {
  const fold = (w) => (w <= PI / 2 ? 2 * w : 2 * PI - 2 * w); // 取完之后的 frequency（以 output 的 index 计）
  const seq = [], tim = [];
  let t = 0;
  const push = (w, dt) => { t += dt; seq.push(w); tim.push(t); };
  seq.push(0.8 * PI); tim.push(0);
  push(0.8 * PI, 2.0);
  push(0.9 * PI, 0.5); push(PI, 0.5); push(PI, 1.0);
  for (let k = 9; k >= 2; k--) push((k / 10) * PI, 0.55);
  push(0.2 * PI, 1.0);
  for (let k = 3; k <= 8; k++) push((k / 10) * PI, 0.55);
  const T = t, kt = tim.map((x) => x / T);
  const sx = lin(0, 15, 34, 316), sy = lin(-1.15, 1.15, 200, 48);
  let o = '';
  o += line(sx(-0.4), sy(0), sx(15.4), sy(0), 'axis') + text(sx(15.4), sy(0) + 16, 'n', 'ts', 'end');
  const curve = (f) => d(Array.from({ length: 61 }, (_, i) => { const n = (15 * i) / 60; return [sx(n), sy(f(n))]; }));
  o += apath(seq.map((w) => curve((n) => Math.cos(w * n))), kt, T, 'mute');
  o += apath(seq.map((w) => curve((n) => Math.cos((fold(w) / 2) * n))), kt, T, 'ln');
  for (let n = 0; n < 16; n++) o += dotY(sx(n), seq.map((w) => sy(Math.cos(w * n))), kt, T, n % 2 ? 3.8 : 4.6, n % 2 ? 'paper' : 'ink-f');
  o += circle(40, 22, 4.6, 'ink-f') + text(48, 26, '留下的（n 为 even）', 'ts', 'start');
  o += circle(168, 22, 3.8, 'paper') + text(176, 26, '丢掉的', 'ts', 'start');
  o += line(226, 22, 244, 22, 'mute') + text(248, 26, 'cos ωn', 'ts', 'start');
  o += line(34, 230, 52, 230, 'ln') + text(56, 234, '穿过留下的点、frequency 最低的 cos', 'ts', 'start');
  // 右：折叠图
  const px = lin(0, PI, 372, 540), py = lin(0, PI, 200, 52);
  o += rect(px(0), py(PI), px(PI / 2) - px(0), py(0) - py(PI), 'wash2');
  o += axes({ sx: px, sy: py, x0: 0, x1: PI, y0: 0, y1: PI, xt: [[0, '0'], [PI / 2, 'π/2'], [PI, 'π']], yt: [[0, '0'], [PI / 2, 'π/2'], [PI, 'π']] });
  o += path(d([[px(0), py(0)], [px(PI / 2), py(PI)], [px(PI), py(0)]]), 'ink');
  o += text(px(PI / 4), py(PI) + 30, '认得出', 'ts', 'middle');
  o += text(px(PI) + 2, py(0) + 32, 'input 的 ω', 'ts', 'end');
  o += text(px(0) - 6, py(PI) - 12, '取完之后的 frequency', 'ts', 'start');
  o += `<circle cx="${f1(px(seq[0]))}" cy="${f1(py(fold(seq[0])))}" r="5" class="ln-f">${anim('cx', seq.map((w) => f1(px(w))), kt, T)}${anim('cy', seq.map((w) => f1(py(fold(w)))), kt, T)}</circle>`;
  return svgA(560, 240, o, '动图：cos ωn 隔一个取一个。ω 小于 π/2 时留下的点仍是原来的 frequency；超过 π/2 后，留下的点和一个 frequency 更低的 cos 完全重合，右边的 frequency 折回来，ω = π 时折到 0。静止时 ω = 0.8π');
}

// ---------- 5. Noise factor = Parseval ----------
function noise() {
  const K = Array.from({ length: 17 }, (_, i) => i - 8);
  let dog = K.map((k) => k * Math.exp(-(k * k) / 8));
  const nrm = K.reduce((s, k, i) => s + k * dog[i], 0);
  dog = dog.map((v) => v / nrm);
  const resp2 = (taps, ks) => (w) => { let re = 0, im = 0; ks.forEach((k, i) => { re += taps[i] * Math.cos(w * k); im += taps[i] * Math.sin(w * k); }); return re * re + im * im; };
  const rows = [
    { name: '(1, 2, 1)/4', taps: [0.25, 0.5, 0.25], ks: [-1, 0, 1], s2: 0.375, lab: 'Σh² = 0.375', mean: '平均 0.375' },
    { name: 'central difference', taps: [0.5, 0, -0.5], ks: [-1, 0, 1], s2: 0.5, lab: 'Σd² = 0.5', mean: '平均 0.5' },
    { name: 'derivative of Gaussian，σ = 2', taps: dog, ks: K, s2: dog.reduce((s, v) => s + v * v, 0), lab: 'Σw² = 0.0176', mean: '平均 0.0176' },
  ];
  let o = '';
  const top0 = 22, RH = 100;
  rows.forEach((r, ri) => {
    const y0 = top0 + ri * RH, base = y0 + 46;
    o += text(20, y0 + 2, r.name, 'tb', 'start');
    // kernel 的 bar
    const n = r.ks.length, bw = n > 3 ? 11 : 26, gap = n > 3 ? 1.5 : 10;
    const tot = n * bw + (n - 1) * gap, x0 = 165 - tot / 2;
    const mx = Math.max(...r.taps.map(Math.abs));
    const sc = 30 / mx;
    o += line(x0 - 8, base, x0 + tot + 8, base, 'axis');
    r.taps.forEach((v, i) => {
      const x = x0 + i * (bw + gap), hgt = v * sc;
      if (Math.abs(v) > 1e-9) o += rect(x, hgt > 0 ? base - hgt : base, bw, Math.abs(hgt), 'solid2', 1);
      if (n === 3) o += text(x + bw / 2, hgt >= 0 ? base - hgt - 5 : base - hgt + 14, v === 0 ? '0' : (v < 0 ? '−' : '') + frac(Math.abs(v)), 'ts', 'middle');
    });
    o += text(20, y0 + 20, r.lab, 'tl', 'start');
    // |H|² 的 curve
    const px = lin(-PI, PI, 280, 488), py = lin(0, 1, base + 34, y0 + 8);
    const f = resp2(r.taps, r.ks);
    const pts = Array.from({ length: 201 }, (_, i) => { const w = -PI + (2 * PI * i) / 200; return [px(w), py(f(w))]; });
    o += path(d([[px(-PI), py(0)], ...pts, [px(PI), py(0)]]) + 'Z', 'wash');
    o += path(d(pts), 'ink');
    o += line(px(-PI), py(0), px(PI), py(0), 'axis') + line(px(0), py(0), px(0), py(1), 'axis');
    o += line(px(-PI), py(r.s2), px(PI), py(r.s2), 'dash');
    o += text(px(PI) + 6, py(r.s2) + 4, r.mean, 'ts', 'start');
    for (const [w, s] of [[-PI, '−π'], [0, '0'], [PI, 'π']]) o += text(px(w), py(0) + 14, s, 'ts', 'middle');
    o += text(px(0) - 5, py(1) + 4, '1', 'ts', 'end');
    if (ri === 0) o += text(px(-PI), y0 + 2, '|H(ω)|²', 'ts', 'start');
    if (ri === 1) o += text(px(PI / 2) + 4, py(1) - 2, 'ω = π/2 处最大', 'ts', 'start');
    if (ri === 2) o += line(px(0.5), py(0.092) - 3, px(0.7), py(0.4) + 3, 'mute') + text(px(0.7) + 2, py(0.45), '最大 0.092，在 ω = ±0.5', 'ts', 'start');
  });
  return svg(560, top0 + 3 * RH - 4, o, '三个 kernel：(1,2,1)/4、central difference、σ = 2 的 derivative of Gaussian。左边是 weight，右边是 |H(ω)|²；虚线是 |H|² 的平均，分别是 0.375、0.5、0.0176，等于 weight 的 square 之和');
}

// ---------- 6. Effective receptive field：L 层 (1,1,1)/3 ----------
function erfA() {
  const ks = [];
  let k = [1];
  for (let L = 1; L <= 10; L++) {
    const nk = new Array(k.length + 2).fill(0);
    k.forEach((v, i) => { for (let j = 0; j < 3; j++) nk[i + j] += v / 3; });
    k = nk; ks.push(k);
  }
  const C = 21, cw = 22, x0 = 49, base = 186, sc = 360; // weight 1/3 → 120 px
  const X = (i) => x0 + i * cw; // 第 i 格（0..20），中心在 10
  const order = [9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const st = steps(order.map((L, j) => (j === 0 ? 2.6 : j === order.length - 1 ? 0.01 : 0.85)));
  // 最后一个状态和第一个一样（L = 10），时间几乎为 0，只是为了让循环首尾相接
  let o = '';
  for (let i = 0; i < C; i++) o += rect(X(i) + 1, base + 2, cw - 2, 12, 'paper', 1);
  o += line(X(0) - 4, base, X(C - 1) + cw + 4, base, 'axis');
  o += text(X(0), base + 30, 'input pixel', 'ts', 'start');
  order.forEach((L0, j) => {
    const L = L0 + 1, kk = ks[L0], off = 10 - L; // kernel 长 2L+1，居中
    const sd = Math.sqrt((2 * L) / 3);
    let g = '';
    kk.forEach((v, i) => { const hgt = v * sc; g += rect(X(off + i) + 3, base - hgt, cw - 6, hgt, 'solid2', 1); });
    // Gaussian（同样 variance）
    const gp = Array.from({ length: 161 }, (_, q) => { const t = -10.5 + (21 * q) / 160; return [x0 + (t + 10.5) * cw, base - (sc * Math.exp(-(t * t) / (2 * sd * sd))) / Math.sqrt(2 * PI * sd * sd)]; });
    if (L > 1) g += path(d(gp), 'dash');
    // 括号：receptive field 与 ±σ
    const bl = X(off), br = X(off + 2 * L) + cw, by = base + 46;
    g += path(`M${f1(bl)} ${by - 6}V${by}H${f1(br)}V${by - 6}`, 'ink') + text((bl + br) / 2, by + 15, `receptive field ${2 * L + 1}`, 'ts', 'middle');
    const cx = X(10) + cw / 2, sl = cx - sd * cw, sr = cx + sd * cw, sy2 = base - 128;
    g += path(`M${f1(sl)} ${sy2 + 6}V${sy2}H${f1(sr)}V${sy2 + 6}`, 'ln') + text(cx, sy2 - 6, `±σ = ±${sd.toFixed(2)}`, 'tl', 'middle');
    g += text(20, 22, `L = ${L} 层 (1, 1, 1)/3`, 'tb', 'start');
    g += text(20, 40, `中间的 weight ${kk[L].toFixed(3)}，最边上 ${kk[0] < 0.001 ? kk[0].toExponential(1).replace('e-', '×10⁻').replace(/(\d)$/, (m) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[m]) : kk[0].toFixed(3)}`, 'ts', 'start');
    o += grp(g, st.on(j), st.kt, st.T);
  });
  return svgA(560, 250, o, '动图：L 层 (1,1,1)/3 叠起来，合起来的 kernel 在 input pixel 上的 weight。Receptive field 是 2L+1 格，±σ 只有 √(2L/3)；L = 10 时 receptive field 21，σ = 2.58，形状接近虚线的 Gaussian');
}

// ---------- 7. Dilation：WaveNet 的三层，与 dilation 2 遇到 period 4 ----------
function dilate() {
  let o = '';
  const N = 15, sx = (n) => 24 + n * 18.5, Y = [212, 158, 104, 50]; // input、d=1、d=2、d=4
  const dil = [1, 2, 4];
  const lab = ['input', 'dilation 1', 'dilation 2', 'dilation 4'];
  for (let l = 0; l < 4; l++) o += text(sx(N - 1) + 14, Y[l] + 4, lab[l], 'ts', 'start');
  // 依赖：第 l 层（1..3）在 n 处用第 l-1 层的 n 和 n - dil[l-1]
  const deps = (top) => { // 返回每层用到的 node 集合与 edge
    const used = [new Set(), new Set(), new Set(), new Set([top])], edges = [];
    for (let l = 3; l >= 1; l--) for (const n of used[l]) for (const m of [n, n - dil[l - 1]]) { used[l - 1].add(m); edges.push([l, n, m]); }
    return { used, edges };
  };
  const A = deps(14), B = deps(12);
  const valid = (l, n) => n >= [0, 1, 3, 7][l];
  for (const [l, n, m] of B.edges) o += line(sx(n), Y[l] + 6, sx(m), Y[l - 1] - 6, 'mute');
  for (const [l, n, m] of A.edges) o += line(sx(n), Y[l] + 6, sx(m), Y[l - 1] - 6, 'ln');
  for (let l = 0; l < 4; l++) for (let n = 0; n < N; n++) {
    if (!valid(l, n)) continue;
    const inA = A.used[l].has(n), inB = B.used[l].has(n);
    o += circle(sx(n), Y[l], 5.5, inA && inB && l > 0 ? 'solid2' : inA ? 'ln-f' : 'paper');
  }
  o += text(sx(14), Y[3] - 14, 'y[14]', 't', 'middle') + text(sx(12), Y[3] - 14, 'y[12]', 'ts', 'middle');
  o += text(sx(10.5), Y[0] + 22, 'x[7] … x[14]：8 个 input 各一条 path', 'ts', 'middle');
  o += text(24, 18, '深色 node 被 y[12] 和 y[14] 共用', 'ts', 'start');
  // 右：dilation 2 遇到 period 4
  const rx = (n) => 404 + n * 18, ry0 = 100, ry1 = 160;
  o += line(372, 8, 372, 240, 'grid');
  o += text(388, 22, 'dilation 2 的一层单独看', 'tb', 'start');
  o += text(388, 40, 'y[n] = x[n] + x[n − 2]', 't', 'start');
  const xp = [1, 0, -1, 0, 1, 0, -1, 0];
  xp.forEach((v, n) => {
    o += rect(rx(n) - 8, ry0 - 8, 16, 16, v > 0 ? 'solid' : v < 0 ? 'band-n' : 'paper', 2);
    o += text(rx(n), ry0 + 4, v < 0 ? '−1' : String(v), v > 0 ? 'tw' : 'ts', 'middle');
  });
  o += text(388, ry0 - 18, 'x：period 4', 'ts', 'start');
  for (let n = 2; n < 8; n++) {
    o += rect(rx(n) - 8, ry1 - 8, 16, 16, 'paper', 2) + text(rx(n), ry1 + 4, '0', 'ts', 'middle');
    if (n === 4 || n === 5) { o += line(rx(n), ry1 - 9, rx(n), ry0 + 9, 'ln') + line(rx(n), ry1 - 9, rx(n - 2), ry0 + 9, 'ln'); }
  }
  o += text(388, ry1 + 26, 'y 处处为 0：', 'ts', 'start');
  o += text(388, ry1 + 42, '1 + e<tspan class="sup" dy="-5">−j2ω</tspan><tspan dy="5">​</tspan> 在 ω = π/2 为 0', 'ts', 'start');
  o += text(388, 222, '三层合起来：(1+x)(1+x²)(1+x⁴)', 'ts', 'start');
  o += text(388, 238, '= 1 + x + x² + … + x⁷', 'ts', 'start');
  return svg(560, 244, o, '左：kernel 2、dilation 1、2、4 的三层 causal conv，y[14] 依赖 x[7] 到 x[14]，每个一条 path；y[12] 和 y[14] 共用一部分 node。右：period 4 的 input (1,0,−1,0,…) 经过 dilation 2 的一层，x[n] + x[n−2] 处处为 0');
}

// ---------- 8. Backward：W 与 Wᵀ，以及 polynomial 的写法 ----------
function backward() {
  const s = 28, w = [1, 2, 3];
  let o = '';
  const mat = (x0, y0, R, Cc, val, hiRow = -1) => {
    let g = '';
    for (let i = 0; i < R; i++) for (let j = 0; j < Cc; j++) {
      const v = val(i, j), x = x0 + j * s, y = y0 + i * s;
      g += rect(x, y, s, s, v ? 'wash' : 'paper-f') + rect(x, y, s, s, 'frame');
      g += text(x + s / 2, y + s / 2 + 4.5, v ? String(v) : '0', v ? 't' : 'ts', 'middle');
    }
    if (hiRow >= 0) g += rect(x0 - 2, y0 + hiRow * s - 2, Cc * s + 4, s + 4, 'ln', 3);
    return g;
  };
  const Wv = (i, j) => (j - i >= 0 && j - i < 3 ? w[j - i] : 0);
  o += text(16, 18, 'W（3×5）：y = Wx', 'tb', 'start');
  o += mat(16, 32, 3, 5, Wv);
  o += text(16, 32 + 3 * s + 18, '每个 row：kernel 右移一格', 'ts', 'start');
  o += text(184, 18, 'Wᵀ（5×3）', 'tb', 'start');
  o += mat(184, 32, 5, 3, (i, j) => Wv(j, i), 2);
  o += text(184 + 3 * s + 8, 32 + 2 * s + s / 2 + 4, '← 3, 2, 1', 'tl', 'start');
  o += text(184, 32 + 5 * s + 18, '<tspan text-decoration="overline">x</tspan> = Wᵀȳ', 't', 'start');
  // 右：polynomial：ȳ 的每个 entry 留下一份挪过的 kernel
  const yb = [1, 0, 2], gx = 372, gy = 50, g2 = 28;
  o += line(352, 8, 352, 236, 'grid');
  o += text(gx - 6, 18, 'ȳ = (1, 0, 2) 与 kernel (1, 2, 3)', 'tb', 'start');
  for (let j = 0; j < 5; j++) o += text(gx + 30 + j * g2 + g2 / 2, gy - 4, 'x' + '⁰¹²³⁴'[j], 'ts', 'middle');
  yb.forEach((b, i) => {
    o += text(gx + 22, gy + i * 30 + 20, `${b} ×`, 'ts', 'end');
    for (let k = 0; k < 3; k++) {
      const x = gx + 30 + (i + k) * g2;
      o += rect(x + 2, gy + i * 30 + 2, g2 - 4, 24, b ? 'wash' : 'paper-f', 2) + rect(x + 2, gy + i * 30 + 2, g2 - 4, 24, 'frame', 2);
      o += text(x + g2 / 2, gy + i * 30 + 19, String(b * w[k]), b ? 't' : 'ts', 'middle');
    }
  });
  const sumY = gy + 3 * 30 + 12;
  o += line(gx + 30, sumY - 4, gx + 30 + 5 * g2, sumY - 4, 'ink');
  [1, 2, 5, 4, 6].forEach((v, j) => { o += rect(gx + 30 + j * g2 + 2, sumY, g2 - 4, 24, 'solid', 2) + text(gx + 30 + j * g2 + g2 / 2, sumY + 17, String(v), 'tw', 'middle'); });
  o += text(gx + 22, sumY + 17, '<tspan text-decoration="overline">x</tspan>', 't', 'end');
  o += text(gx - 6, sumY + 48, '(1 + 2x²)(1 + 2x + 3x²)', 'ts', 'start');
  o += text(gx - 6, sumY + 66, '= 1 + 2x + 5x² + 4x³ + 6x⁴', 'ts', 'start');
  return svg(560, 240, o, '左：3×5 的 W，每个 row 是 kernel (1,2,3) 往右挪一格；中：Wᵀ 的第 3 个 row 读成 3、2、1。右：ȳ = (1,0,2) 的每个 entry 留下一份挪过的 kernel，按 column 相加得 x̄ = (1,2,5,4,6)');
}

// ---------- 9. Halo：一块 output 要多读一圈 input ----------
function haloA() {
  const P = 20, cw = 21, x0 = 22, Y = [40, 92, 144, 196];
  const lab = ['output', 'layer 2', 'layer 1', 'input'];
  const X = (i) => x0 + i * cw;
  const rangeA = (l) => [4 - l, 7 + l], rangeB = (l) => [8 - l, 11 + l]; // 第 l 层（0 = output）需要的位置
  let o = '';
  for (let l = 0; l < 4; l++) {
    for (let i = 0; i < P; i++) o += rect(X(i) + 1, Y[l], cw - 2, 16, 'paper', 1);
    o += text(X(P - 1) + cw + 8, Y[l] + 12, lab[l], 'ts', 'start');
  }
  const trap = (r0, r1, y0, y1, cls) => poly([[X(r0[0]) + 1, y0 + 16], [X(r0[1]) + cw - 1, y0 + 16], [X(r1[1]) + cw - 1, y1], [X(r1[0]) + 1, y1]], cls);
  const fill = (r, y, cls) => { let g = ''; for (let i = r[0]; i <= r[1]; i++) g += rect(X(i) + 1, y, cw - 2, 16, cls, 1); return g; };
  // 状态：0 = 全图（两块与重叠），1..4 = 第一块逐层往下，5 = 回到全图
  const st = steps([3.0, 0.9, 0.9, 0.9, 1.4, 0.01]);
  const phaseOf = [9, 0, 1, 2, 3, 9];
  for (let l = 0; l < 4; l++) {
    const onA = phaseOf.map((p) => p >= l);
    let g = fill(rangeA(l), Y[l], 'wash-strong');
    if (l > 0) g += trap(rangeA(l - 1), rangeA(l), Y[l - 1], Y[l], 'wash');
    o += grp(g, onA, st.kt, st.T);
    let gb = fill(rangeB(l), Y[l], 'band-n');
    if (l > 0) gb += trap(rangeB(l - 1), rangeB(l), Y[l - 1], Y[l], 'wash2');
    o += grp(gb, phaseOf.map((p) => p === 9), st.kt, st.T);
  }
  // 重叠的 6 格
  const ov = [5, 10];
  o += grp(path(`M${f1(X(ov[0]) + 1)} ${Y[3] + 24}V${Y[3] + 30}H${f1(X(ov[1]) + cw - 1)}V${Y[3] + 24}`, 'ink') + text((X(ov[0]) + X(ov[1]) + cw) / 2, Y[3] + 46, '重叠 6 个 = R − 1，读两次、算两次', 'tb', 'middle'), phaseOf.map((p) => p === 9), st.kt, st.T);
  o += grp(text(X(0), 20, '两块 output，各 4 个，相邻', 'ts', 'start'), phaseOf.map((p) => p === 9), st.kt, st.T);
  const msg = ['一块 4 个 output', '往下一层：两边各多 1 个，6 个', '再往下：8 个', 'input：4 + 6 = 10 个'];
  msg.forEach((m, k) => { o += atext(X(0), 20, m, 'tl', 'start', phaseOf.map((p) => p === k), st.kt, st.T); });
  o += text(X(P - 1) + cw, 20, 'kernel 3，三层，R = 7', 'ts', 'end');
  return svgA(560, 252, o, '动图：三层 kernel 3 的 conv。一块 4 个 output 往下追，每层两边各多一格，到 input 是 10 个；往右再取一块 4 个 output，两块的 input 重叠 6 个');
}

export default {
  'thread-convolution-stripes': stripesA,
  'thread-convolution-circulant': circulantA,
  'thread-convolution-eigen': eigenA,
  'thread-convolution-fold': foldA,
  'thread-convolution-noise': noise,
  'thread-convolution-erf': erfA,
  'thread-convolution-dilate': dilate,
  'thread-convolution-backward': backward,
  'thread-convolution-halo': haloA,
};
