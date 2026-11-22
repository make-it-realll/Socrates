// 概念线 entropy 的图。所有数都按正文里的设定现算（不是手填的），和正文对得上。
import { svg, svgA, lin, d, path, line, rect, circle, text, it, sub, arrow, curve, area, axes, anim, ashow, f1 } from '../lib/svg.mjs';

const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;
const PREF = 'π' + sub('ref'), PTH = 'π' + sub('θ');

const fx = (v, k = 3) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
const L2 = Math.log2, LN = Math.log;
const KLn = (p, q) => p.reduce((s, x, i) => (x > 0 ? s + x * LN(x / q[i]) : s), 0);
// 一组离散帧：先停 hold 秒在第一帧，之后每帧 step 秒，最后停 tail 秒
function frames(n, hold, step, tail) {
  const T = hold + step * (n - 1) + tail;
  const ts = [0], fr = [0];
  for (let k = 0; k < n; k++) { ts.push(hold + step * k); fr.push(k); }
  ts.push(T); fr.push(n - 1);
  return { kt: ts.map((t) => t / T), fr, T };
}
const only = (k, fr, kt, T, body) => `<g opacity="${fr[0] === k ? 1 : 0}">${body}${ashow(fr.map((f) => f === k), kt, T)}</g>`;
// spans 是若干 [起, 止] 的 0..1 时刻（止 = null 表示到最后），只在这些时段显示
function gshow(spans, T, body) {
  const times = new Set([0]);
  spans.forEach(([a, b]) => { times.add(a); if (b !== null) times.add(b); });
  const ks = [...times].filter((t) => t <= 1).sort((x, y) => x - y);
  const vis = (t) => (spans.some(([a, b]) => t >= a - 1e-12 && (b === null || t < b - 1e-12)) ? 1 : 0);
  const vals = ks.map(vis);
  return `<g opacity="${vals[0]}">${body}${anim('opacity', vals, ks, T, true)}</g>`;
}
// 高度随帧变化的 bar（底边固定在 base）
function abar(x, w, base, hs, fr, kt, T, cls) {
  const H = fr.map((f) => hs[f]);
  return `<rect x="${f1(x)}" y="${f1(base - H[0])}" width="${f1(w)}" height="${f1(H[0])}" class="${cls}">${anim('y', H.map((h) => f1(base - h)), kt, T, true)}${anim('height', H.map(f1), kt, T, true)}</rect>`;
}

// ---------- 1. 开头：arithmetic coding，一个 token 把 interval 缩成 q(x) 倍 ----------
function arithA() {
  const seq = ['a', 'b', 'a', 'c', 'a'];
  const P = { a: 0.5, b: 0.3, c: 0.2 }, U = { a: 1 / 3, b: 1 / 3, c: 1 / 3 };
  const cols = [{ q: P, x0: 30, name: '按 q = (0.5, 0.3, 0.2) 设计' }, { q: U, x0: 312, name: '按 uniform 的 q 设计' }];
  const W = 150, BH = 18, top = 40, gap = 46;
  const hold = 3, step = 1.1, T = hold + 0.3 + seq.length * step + 2.5;
  const h0 = hold / T, ti = (i) => (hold + 0.3 + i * step) / T;
  let o = '';
  for (const c of cols) o += text(c.x0 - 18, 16, c.name, 'tb');
  for (const c of cols) {
    let Lk = 1;
    seq.forEach((s, i) => {
      const y = top + i * gap;
      let g = '';
      let x = c.x0;
      for (const k of ['a', 'b', 'c']) {
        const w = W * c.q[k];
        g += rect(x, y, w, BH, k === s ? 'wash-strong' : 'paper-f');
        g += text(x + w / 2, y + 13, k, k === s ? 'tb' : 'ts', 'middle');
        if (k === s && i < seq.length - 1) {
          g += line(x, y + BH, c.x0, y + gap, 'dash') + line(x + w, y + BH, c.x0 + W, y + gap, 'dash');
        }
        x += w;
      }
      g += rect(c.x0, y, W, BH, 'frame');
      let xx = c.x0;
      for (const k of ['a', 'b']) { xx += W * c.q[k]; g += line(xx, y, xx, y + BH, 'mute'); }
      g += text(c.x0 - 18, y + 13, s, 'tb', 'start');
      Lk *= c.q[s];
      const Ltxt = c.q === U ? `3⁻${['¹', '²', '³', '⁴', '⁵'][i]}` : String(+Lk.toPrecision(3));
      g += text(c.x0 + W + 8, y + 13, `L = ${Ltxt}，${fx(L2(1 / Lk), 2)} bit`, 'ts');
      o += gshow([[0, h0], [ti(i), null]], T, g);
    });
  }
  const yS = top + seq.length * gap + 6;
  const sum = text(cols[0].x0 - 18, yS, '5 个 token 共 7.06 bit', 'tl') + text(cols[1].x0 - 18, yS, '5 个 token 共 7.92 bit', 'tb') +
    text(cols[0].x0 - 18, yS + 20, '长的 data 上平均每个 token：1.485 bit', 'ts') + text(cols[1].x0 - 18, yS + 20, '不管 data 是什么，每个 token：1.585 bit', 'ts');
  o += gshow([[0, h0], [ti(seq.length), null]], T, sum);
  return svgA(560, yS + 26, o, '动图：arithmetic coding 把 [0,1) 按 q 切成 a、b、c 三段，每来一个 token 就进入对应的一段，interval 的长度 L 乘上 q(token)。左边按 (0.5, 0.3, 0.2) 设计，5 个 token a b a c a 之后 L = 0.0075，要 7.06 bit；右边按 uniform 设计，L = 3 的 −5 次方，要 7.92 bit。');
}

// ---------- 2. q 从 uniform 走到 p 再走过头：多付的 bit 就是 D(p‖q) ----------
function gibbsA() {
  const p = [0.5, 0.3, 0.2];
  const u = [1 / 3, 1 / 3, 1 / 3], over = [0.8, 0.15, 0.05];
  const Q = [];
  const n1 = 8, n2 = 7;
  for (let k = 0; k <= n1; k++) { const t = k / n1; Q.push(u.map((x, i) => (1 - t) * x + t * p[i])); }
  for (let k = 1; k <= n2; k++) { const t = k / n2; Q.push(p.map((x, i) => (1 - t) * x + t * over[i])); }
  const N = Q.length;
  const { kt, fr, T } = frames(N, 2.2, 0.7, 2.2);
  const H = -p.reduce((s, x) => s + x * L2(x), 0);
  const CE = Q.map((q) => -p.reduce((s, x, i) => s + x * L2(q[i]), 0));
  let o = '';
  // 左：三个 token 的 q（实心）与 p（虚线框）
  const base = 210, sy = 190; // probability 1 → 190 px
  const xs = [60, 140, 220], bw = 30;
  o += line(28, base, 258, base, 'axis');
  o += text(20, 22, 'model 的 q（实心）与真实的 p（虚线框）', 'tb');
  ['a', 'b', 'c'].forEach((k, i) => {
    o += abar(xs[i] - bw / 2, bw, base, Q.map((q) => q[i] * sy), fr, kt, T, 'wash-strong');
    o += rect(xs[i] - bw / 2, base - p[i] * sy, bw, p[i] * sy, 'dash');
    o += text(xs[i], base + 18, k, 'tb', 'middle');
  });
  for (let k = 0; k < N; k++) {
    let g = '';
    ['a', 'b', 'c'].forEach((_, i) => {
      g += text(xs[i], base + 36, `q = ${fx(Q[k][i], 3)}`, 'ts', 'middle');
      g += text(xs[i], base + 52, `${fx(-L2(Q[k][i]), 2)} bit`, 'ts', 'middle');
    });
    o += only(k, fr, kt, T, g);
  }
  o += text(xs[2] + 26, base + 52, 'code length', 'ts', 'start');
  // 右：每个 token 平均付多少 bit
  const X0 = 300, sx = lin(0, 2.2, X0, X0 + 240), yb = 96;
  o += text(X0, 22, '每个 token 平均的 bit 数', 'tb');
  o += rect(sx(0), yb, sx(H) - sx(0), 26, 'wash2');
  o += text(sx(0) + 6, yb + 17, `H(p) = ${fx(H, 3)}`, 't');
  const Dw = CE.map((c) => sx(c) - sx(H));
  o += `<rect x="${f1(sx(H))}" y="${yb}" width="${f1(Dw[0])}" height="26" class="solid">${anim('width', fr.map((f) => f1(Dw[f])), kt, T, true)}</rect>`;
  o += line(sx(H), yb - 8, sx(H), yb + 34, 'ink');
  for (const v of [0, 0.5, 1, 1.5, 2]) o += line(sx(v), yb + 40, sx(v), yb + 44, 'axis') + text(sx(v), yb + 57, String(v), 'ts', 'middle');
  o += line(sx(0), yb + 40, sx(2.2), yb + 40, 'axis');
  for (let k = 0; k < N; k++) {
    const D = CE[k] - H;
    o += only(k, fr, kt, T, text(X0, yb + 90, `H(p, q) = ${fx(CE[k], 3)} bit`, 'tb') + text(X0, yb + 110, `其中多付的 D(p‖q) = ${fx(D, 3)} bit`, 'tl') +
      text(X0, yb + 136, k === 0 ? 'q 是 uniform' : k === n1 ? 'q = p：D = 0' : k < n1 ? 'q 向 p 移动' : 'q 越过 p，压低 b、c', 'ts'));
  }
  return svgA(560, 266, o, '动图：q 从 uniform 一步步移到 p = (0.5, 0.3, 0.2)，再移向 (0.8, 0.15, 0.05)。右边每个 token 的平均 bit 数 H(p,q) 分成两段：灰色的 H(p) = 1.485 不动，彩色的 D(p‖q) 在 q = p 时缩到 0，之后又变长。第一帧是 q 为 uniform，多付 0.099 bit。');
}

// ---------- 3. 骨架二：π_ref × e^{(r − 2)/β} 再 normalize ----------
function tiltA() {
  const pref = [0.5, 0.3, 0.2], r = [0, 1, 2];
  const betas = [1, 8, 4, 2, 1, 0.5, 0.25];
  const N = betas.length;
  const { kt, fr, T } = frames(N, 3, 1.6, 2.4);
  const lik = betas.map((b) => r.map((x) => Math.exp((x - 2) / b)));
  const ev = lik.map((l) => l.reduce((s, x, i) => s + x * pref[i], 0));
  const post = lik.map((l, k) => l.map((x, i) => (x * pref[i]) / ev[k]));
  const base = 190, sy = 130, bw = 22;
  const panels = [{ x: 22, t1: PREF, t2: '（prior）', w: 34 }, { x: 214, t1: 'e' + sup('(r − 2)/β'), t2: '（likelihood）', w: 62 }, { x: 406, t1: 'π*', t2: '（posterior）', w: 22 }];
  let o = '';
  panels.forEach((P, j) => {
    o += line(P.x, base, P.x + 132, base, 'axis');
    o += text(P.x, 20, P.t1, 'tb') + text(P.x + P.w, 20, P.t2, 'ts');
    ['a', 'b', 'c'].forEach((k, i) => {
      const cx = P.x + 24 + i * 42;
      const hs = j === 0 ? betas.map(() => pref[i] * sy) : j === 1 ? lik.map((l) => l[i] * sy) : post.map((q) => q[i] * sy);
      o += abar(cx - bw / 2, bw, base, hs, fr, kt, T, j === 1 ? 'wash' : j === 2 ? 'solid' : 'wash-strong');
      if (j === 1) o += rect(cx - bw / 2, base - sy, bw, sy, 'frame');
      o += text(cx, base + 16, k, 'tb', 'middle');
      if (j === 1) o += text(cx, base + 31, `r = ${r[i]}`, 'ts', 'middle');
    });
  });
  o += text(186, 112, '×', 'tbig', 'middle') + text(380, 112, '→', 'tbig', 'middle');
  o += text(380, 132, '除以 Z', 'ts', 'middle');
  for (let k = 0; k < N; k++) {
    const b = betas[k], q = post[k];
    const Er = q.reduce((s, x, i) => s + x * r[i], 0), kl = KLn(q, pref);
    let g = '';
    panels.forEach((P, j) => {
      ['a', 'b', 'c'].forEach((_, i) => {
        const cx = P.x + 24 + i * 42;
        const v = j === 0 ? pref[i] : j === 1 ? lik[k][i] : q[i];
        const h = v * sy;
        g += text(cx, base - h - 5, v.toFixed(j === 1 ? 2 : 3), 'ts', 'middle');
      });
    });
    g += text(22, 246, `β = ${b}`, 'tb') + text(90, 246, `E[r] = ${fx(Er, 2)}`, 't') + text(200, 246, `KL(π* ‖ ${PREF}) = ${fx(kl, 3)}`, 't') + text(380, 246, `evidence = ${fx(ev[k], 3)}`, 't');
    g += text(22, 268, `E[r] − β·KL = ${fx(Er - b * kl, 3)} = 2 + β ln(evidence)`, 'ts');
    o += only(k, fr, kt, T, g);
  }
  return svgA(560, 276, o, '动图：同一个 π_ref = (0.5, 0.3, 0.2) 和 reward r = (0, 1, 2)。中间是 e^{(r−2)/β}，读作 likelihood；乘上 π_ref 再 normalize 得到右边的 π*，读作 posterior。β 从 8 降到 0.25，π* 从 π_ref 移向全押在 c 上。第一帧是 β = 1。');
}

// ---------- 4. 桥：按 Known 分一次，发送 label 的 bit 数少了多少 ----------
function split() {
  const E = [[1, 'Y', 'N', 'Y', 1], [2, 'Y', 'N', 'N', 1], [3, 'Y', 'N', 'N', 1], [4, 'N', 'N', 'Y', 1], [5, 'N', 'N', 'N', 0], [6, 'N', 'N', 'N', 0], [7, 'Y', 'Y', 'Y', 0], [8, 'N', 'Y', 'Y', 0]];
  const cw = 46, ch = 34, g = 10;
  const card = (x, y, e, bits) => rect(x, y, cw, ch, e[4] ? 'wash-strong' : 'paper-f', 4) + rect(x, y, cw, ch, 'frame', 4) +
    text(x + 6, y + 13, '#' + e[0], 'ts') + text(x + cw - 8, y + 26, e[4] ? '+' : '−', 'tb', 'end') + text(x + cw / 2, y + ch + 15, bits, 'ts', 'middle');
  let o = '';
  const x0 = 46;
  o += text(14, 18, '分之前：每封邮件的 label 按 p(+) = 4/8 encode', 'tb');
  E.forEach((e, i) => { o += card(x0 + i * (cw + g), 30, e, '1 bit'); });
  o += text(x0 + 8 * (cw + g) - g, 98, '合计 8 × 1 = 8 bit', 'tb', 'end');
  o += arrow(280, 104, 150, 140, 'mute') + arrow(280, 104, 380, 140, 'mute');
  o += text(280, 126, '按 Known 分', 'ts', 'middle');
  // 左堆：Known = Y
  const yL = 160;
  o += text(46, yL - 6, 'Known = Y：p(+) = 0/2', 'ts');
  [E[6], E[7]].forEach((e, i) => { o += card(46 + i * (cw + g), yL + 4, e, '0 bit'); });
  // 右堆：Known = N
  o += text(206, yL - 6, 'Known = N：p(+) = 4/6', 'ts');
  E.slice(0, 6).forEach((e, i) => { o += card(206 + i * (cw + g), yL + 4, e, e[4] ? '0.585' : '1.585'); });
  o += text(14, yL + 82, '分之后：0 + 4 × 0.585 + 2 × 1.585 = 5.510 bit', 'tb');
  o += text(14, yL + 104, '少了 8 − 5.510 = 2.490 bit = 8 × 0.311，0.311 就是 Known 的 information gain', 'tl');
  return svg(560, yL + 110, o, 'CS2109S 的 8 封邮件。分之前每封的 label 用 1 bit；按 Known 分开后，Known = Y 的两封一定是 −，用 0 bit，Known = N 的六封里 + 用 0.585 bit、− 用 1.585 bit。总数从 8 bit 降到 5.510 bit，差 2.490 bit，是 8 乘以 information gain 0.311。');
}

// ---------- 5. 桥：Bernoulli 的 KL 与它的二阶展开 ----------
function kissFisher() {
  const sx = lin(0.5, 0.9, 70, 520), sy = lin(0, 0.4, 230, 30);
  const D = (x) => x * LN(x / 0.5) + (1 - x) * LN((1 - x) / 0.5);
  const Q = (x) => 2 * (x - 0.5) ** 2;
  let o = axes({ sx, sy, x0: 0.5, x1: 0.9, y0: 0, y1: 0.4, xt: [0.5, 0.6, 0.7, 0.8, 0.9], yt: [0, 0.1, 0.2, 0.3, 0.4], xl: '', yl: 'nat', grid: true });
  o += text(520, 266, 'p̂', 'ts', 'end');
  o += path(curve(Q, 0.5, 0.9, sx, sy), 'dash') + path(curve(D, 0.5, 0.9, sx, sy), 'ln');
  o += text(sx(0.9) - 4, sy(D(0.9)) - 8, 'D(p̂ ‖ 0.5)', 'tl', 'end');
  o += text(sx(0.9) - 4, sy(0.03), '虚线：½ · I(0.5) · (p̂ − 0.5)²，I(0.5) = 4', 'ts', 'end');
  const x = 80 / 124;
  o += line(sx(x), sy(0), sx(x), sy(D(x)), 'mute') + circle(sx(x), sy(D(x)), 4, 'ln-f') + circle(sx(x), sy(Q(x)), 3.5, 'ink-f');
  o += line(sx(x), sy(D(x)) - 6, sx(x), sy(0.245), 'mute');
  o += text(sx(0.515), sy(0.34), 'Kiss data：p̂ = 80/124 = 0.645', 'ts');
  o += text(sx(0.515), sy(0.34) + 18, 'D = 0.0428，× 248 = 10.60 = −2 ln Λ', 'tl');
  o += text(sx(0.515), sy(0.34) + 36, '½ I δ² = 0.0421，× 248 = 10.45', 'ts');
  return svg(560, 272, o, '横轴是 p̂，彩色曲线是 Bernoulli(p̂) 到 Bernoulli(0.5) 的 KL（nat），虚线是它的二阶展开 2(p̂ − 0.5)²。Kiss data 的 p̂ = 0.645 处，两者是 0.0428 和 0.0421，乘以 2n = 248 分别是 ST2132 里的 10.60 和 10.45。');
}

// ---------- 6. 桥：EM 的 gap 是每个点的 KL(r⁽⁰⁾ ‖ r⁽¹⁾) 之和 ----------
function emGap() {
  const X = [1, 2, 3, 5, 8, 9];
  const Nd = (x, m, v) => Math.exp(-((x - m) ** 2) / (2 * v)) / Math.sqrt(2 * Math.PI * v);
  const resp = ([pi, mu, v]) => X.map((x) => { const a = [0, 1].map((j) => pi[j] * Nd(x, mu[j], v[j])); const s = a[0] + a[1]; return a.map((t) => t / s); });
  const th0 = [[0.5, 0.5], [2, 8], [1, 1]];
  const R0 = resp(th0);
  const Nj = [0, 1].map((j) => R0.reduce((s, r) => s + r[j], 0));
  const pi = Nj.map((n) => n / 6), mu = [0, 1].map((j) => R0.reduce((s, r, n) => s + r[j] * X[n], 0) / Nj[j]);
  const v = [0, 1].map((j) => R0.reduce((s, r, n) => s + r[j] * (X[n] - mu[j]) ** 2, 0) / Nj[j]);
  const R1 = resp([pi, mu, v]);
  const kl = X.map((_, n) => KLn(R0[n], R1[n]));
  const sx = lin(0, 10, 40, 520), yb = 250, sy = lin(0, 0.3, yb, 150);
  let o = '';
  o += line(sx(0), yb, sx(10), yb, 'axis');
  for (let t = 0; t <= 10; t += 1) o += line(sx(t), yb, sx(t), yb + 4, 'axis') + text(sx(t), yb + 17, String(t), 'ts', 'middle');
  o += path(curve((x) => pi[0] * Nd(x, mu[0], v[0]), 0, 10, sx, sy), 'mute') + path(curve((x) => pi[1] * Nd(x, mu[1], v[1]), 0, 10, sx, sy), 'dash');
  o += text(sx(3.3), sy(0.165), 'θ₁ 的 component 1（实线）', 'ts');
  o += text(sx(9.9), sy(0.135), 'component 2（虚线）', 'ts', 'end');
  const BH = 64, bw = 11, top = 46;
  X.forEach((x, n) => {
    const cx = sx(x);
    o += circle(cx, yb, 4, 'ink-f');
    [R0[n], R1[n]].forEach((r, j) => {
      const bx = cx - bw - 1 + j * (bw + 2);
      o += rect(bx, top, bw, BH * r[0], 'solid') + rect(bx, top + BH * r[0], bw, BH * r[1], 'wash') + rect(bx, top, bw, BH, 'frame');
    });
    o += text(cx, top + BH + 16, (kl[n] * 1000).toFixed(kl[n] > 0.001 ? 1 : 2), x === 5 ? 'tl' : 'ts', 'middle');
  });
  o += text(sx(0), 22, '每个点：左条 r⁽⁰⁾（E-step 用的 q），右条 r⁽¹⁾（θ₁ 下的 posterior）；深色是 component 1', 'ts');
  o += text(sx(0) - 6, top + BH + 16, 'KL × 10³', 'ts', 'end');
  const tot = kl.reduce((s, x) => s + x, 0);
  o += text(sx(10), top + BH + 40, `Σ KL = ${tot.toFixed(4)} = ℓ(θ₁) − 𝓕(r⁽⁰⁾, θ₁)`, 'tl', 'end');
  return svg(560, 272, o, 'CS3244 的 6 个点。每个点上两条 bar：E-step 时的 responsibility r⁽⁰⁾，和 M-step 之后的 parameter θ₁ 下的 posterior r⁽¹⁾。两者的 KL 主要来自 x = 5（0.0114）和 x = 3（0.0033），总和 0.0152 正好是 log-likelihood 与 ELBO 的差。');
}

// ---------- 7. 桥：VAE 的 KL 项是 latent 带走的 information ----------
function rateA() {
  const xsv = [2, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];
  const N = xsv.length;
  const { kt, fr, T } = frames(N, 3, 0.9, 2);
  const v = 1 / 17, m = (x) => (8 * x) / 17;
  const KL = (x) => 0.5 * (v + m(x) ** 2 - 1 - LN(v));
  const g = (z, mu, s2) => Math.exp(-((z - mu) ** 2) / (2 * s2)) / Math.sqrt(2 * Math.PI * s2);
  const sx = lin(-3, 3, 30, 320), sy = lin(0, 1.7, 230, 40);
  let o = '';
  o += line(sx(-3), sy(0), sx(3), sy(0), 'axis');
  for (const t of [-3, -2, -1, 0, 1, 2, 3]) o += line(sx(t), sy(0), sx(t), sy(0) + 4, 'axis') + text(sx(t), sy(0) + 17, String(t), 'ts', 'middle');
  o += text(sx(3), sy(0) + 34, it('z'), 'ts', 'end');
  o += path(curve((z) => g(z, 0, 1), -3, 3, sx, sy), 'dash');
  o += text(sx(-1.25), sy(0.27) - 10, 'prior N(0, 1)', 'ts', 'end');
  const shapes = xsv.map((x) => area((z) => g(z, m(x), v), Math.max(-3, m(x) - 1), Math.min(3, m(x) + 1), sx, sy, 0, 120));
  o += `<path d="${shapes[0]}" class="wash-strong">${anim('d', fr.map((f) => shapes[f]), kt, T, true)}</path>`;
  o += text(20, 22, 'q(z | x) = N(8x/17, 1/17)：看到 x 之后 z 被定到多窄', 'tb');
  for (let k = 0; k < N; k++) {
    const x = xsv[k];
    o += only(k, fr, kt, T, text(sx(m(x)) + 16, sy(1.35), `x = ${fx(x, 1)}`, 'tl', 'start') + text(30, 270, `KL(q(z|x) ‖ p(z)) = ${fx(KL(x), 3)} nat`, 't'));
  }
  // 右：KL 随 x 变化
  const rx = lin(-3, 3, 380, 545), ry = lin(0, 3.2, 230, 60);
  o += line(rx(-3), ry(0), rx(3), ry(0), 'axis') + line(rx(-3), ry(0), rx(-3), ry(3.2), 'axis');
  for (const t of [-2, 0, 2]) o += line(rx(t), ry(0), rx(t), ry(0) + 4, 'axis') + text(rx(t), ry(0) + 17, String(t), 'ts', 'middle');
  for (const t of [0, 1, 2, 3]) o += text(rx(-3) - 6, ry(t) + 4, String(t), 'ts', 'end');
  o += text(rx(3), ry(0) + 34, it('x'), 'ts', 'end');
  o += path(curve(KL, -3, 3, rx, ry), 'ln');
  o += line(rx(-3), ry(0.5 * LN(17)), rx(3), ry(0.5 * LN(17)), 'dash');
  o += text(rx(-2.9), ry(2.75), '虚线：对 x 平均', 'ts') + text(rx(-2.9), ry(2.75) + 16, '½ ln 17 = 1.417 = I(X;Z)', 'ts');
  o += text(rx(-3), 44, 'KL（nat）', 'ts');
  const cxs = fr.map((f) => f1(rx(xsv[f]))), cys = fr.map((f) => f1(ry(KL(xsv[f]))));
  o += `<circle cx="${cxs[0]}" cy="${cys[0]}" r="4.5" class="ln-f">${anim('cx', cxs, kt, T, true)}${anim('cy', cys, kt, T, true)}</circle>`;
  return svgA(560, 280, o, '动图：CS5788 的 toy model，z ~ N(0,1)，x | z ~ N(2z, 0.25)。左边虚线是 prior，彩色是看到 x 之后的 posterior N(8x/17, 1/17)；x 从 −2.5 走到 2.5，posterior 跟着移动。右边是 KL(q(z|x) ‖ p(z)) 随 x 的变化，对 x 的 distribution 平均是 ½ ln 17 = 1.417 nat，等于 I(X;Z)。第一帧是 x = 2，KL = 1.389。');
}

// ---------- 8. 桥：k3 少掉的那一块 ----------
function k3() {
  const pt = [0.6, 0.3999, 0.0001], pr = [0.5, 0.3, 0.2];
  const base = 170, sy = 220, bw = 26;
  let o = '';
  o += text(14, 20, `sample 来自 ${PTH}（实心）；${PREF} 是虚线框`, 'tb');
  o += line(20, base, 300, base, 'axis');
  ['a', 'b', 'c'].forEach((k, i) => {
    const cx = 70 + i * 95;
    o += rect(cx - bw / 2, base - pt[i] * sy, bw, Math.max(pt[i] * sy, 0.8), 'solid');
    o += rect(cx - bw / 2, base - pr[i] * sy, bw, pr[i] * sy, 'dash');
    o += text(cx, base + 17, k, 'tb', 'middle');
    const rho = pr[i] / pt[i];
    const k3v = rho - 1 - LN(rho);
    o += text(cx, base + 35, `ρ = ${rho < 10 ? fx(rho, 3) : Math.round(rho)}`, 'ts', 'middle');
    o += text(cx, base + 52, `k₃ = ${k3v < 10 ? fx(k3v, 4) : Math.round(k3v)}`, i === 2 ? 'tl' : 'ts', 'middle');
    o += text(cx, base + 69, `${PTH} = ${pt[i]}`, 'ts', 'middle');
  });
  const X0 = 330;
  o += text(X0, 60, `KL(${PTH} ‖ ${PREF}) = 0.2236`, 'tb');
  o += text(X0, 84, 'E[k₃] 里 c 那一项：', 't');
  o += text(X0, 102, '0.0001 × 1991 = 0.199', 'tl');
  o += text(X0, 126, '1000 个 sample 里一个 c 都没有', 't');
  o += text(X0, 144, '的 probability：0.905', 't');
  o += text(X0, 168, '这时 k₃ 的平均约 0.024，', 't');
  o += text(X0, 186, 'k₁ 的平均约 0.224', 't');
  return svg(560, 246, o, 'π_θ = (0.6, 0.3999, 0.0001)，π_ref = (0.5, 0.3, 0.2)。token c 的 ratio ρ = 2000，k₃ = 1991，但它只以 0.0001 的 probability 被 sample 到。真实的 KL 是 0.2236，其中 0.199 由这个罕见的 c 承担。');
}

export default {
  'thread-entropy-arith': arithA,
  'thread-entropy-gibbs': gibbsA,
  'thread-entropy-tilt': tiltA,
  'thread-entropy-split': split,
  'thread-entropy-kiss': kissFisher,
  'thread-entropy-emgap': emGap,
  'thread-entropy-rate': rateA,
  'thread-entropy-k3': k3,
};
