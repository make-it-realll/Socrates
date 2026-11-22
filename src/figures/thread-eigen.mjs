import { svg, svgA, lin, d, path, line, rect, circle, text, arrow, f1, sub, apath, acircle, animRot, ashow, anim } from '../lib/svg.mjs';

const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;

const fmt = (v, n) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
// 一组离散帧：hold 秒停在第一帧，之后每帧 step 秒，最后停 tail 秒。返回 keyTimes、每个 keyTime 对应的帧号、总时长。
function frames(n, hold, step, tail) {
  const T = hold + step * (n - 1) + tail;
  const ts = [0], fr = [0];
  for (let k = 0; k < n; k++) { ts.push(hold + step * k); fr.push(k); }
  ts.push(T); fr.push(n - 1);
  return { kt: ts.map((t) => t / T), fr, T };
}
// 同上，但先停在最后一帧（静态截图和 reduced-motion 看到的是结果），再从第 0 帧开始走
function framesEnd(n, hold, hold0, step, tail) {
  const T = hold + hold0 + step * (n - 1) + tail, e = 0.001;
  const ts = [0, hold, hold + e], fr = [n - 1, n - 1, 0];
  for (let k = 0; k < n; k++) { ts.push(hold + e + hold0 + step * k); fr.push(k); }
  ts.push(T); fr.push(n - 1);
  return { kt: ts.map((t) => t / T), fr, T };
}
// 只在第 k 帧显示的一组元素
const only = (k, fr, kt, T, body) => `<g opacity="${fr[0] === k ? 1 : 0}">${body}${ashow(fr.map((f) => f === k), kt, T)}</g>`;

// ---------- 1. 开头：倒立 pendulum 的 Euler iteration ----------
function pendulumA() {
  const N = 37; // k = 0..36
  const xs = [[0.1, -0.08]];
  for (let k = 1; k < N; k++) { const [a, b] = xs[k - 1]; xs.push([a + 0.1 * b, b + 0.1 * a]); }
  const c1 = 0.01, c2 = 0.09;
  const { kt, fr, T } = frames(N, 1.4, 0.14, 1.8);
  let o = '';
  // 左：pendulum
  const P = [104, 262], L = 170;
  o += rect(72, 262, 64, 14, 'wash2', 2) + line(P[0], P[1], P[0], P[1] - L - 22, 'dash');
  o += text(P[0], P[1] - L - 28, 'upright', 'ts', 'middle');
  const deg = xs.map(([t]) => (t * 180) / Math.PI);
  const rod = rect(P[0] - 4, P[1] - L, 8, L, 'paper', 3) + circle(P[0], P[1] - L, 13, 'solid');
  const rot = fr.map((f) => deg[f]);
  o += `<g transform="rotate(${f1(rot[0])} ${P[0]} ${P[1]})">${rod}${animRot(rot, P[0], P[1], kt, T)}</g>`;
  o += circle(P[0], P[1], 4.5, 'ink-f');
  for (let k = 0; k < N; k++) {
    const [t, w] = xs[k];
    o += only(k, fr, kt, T, text(8, 22, `k = ${k}`, 'tb') + text(8, 42, `θ = ${fmt(t, 4)}`, 't') + text(8, 60, `ω = ${fmt(w, 4)}`, 't'));
  }
  // 右：state plane
  const O = [338, 214], s = 560;
  const X = (t) => O[0] + s * t, Y = (w) => O[1] - s * w;
  o += line(X(-0.05), O[1], X(0.37), O[1], 'axis') + line(O[0], Y(-0.11), O[0], Y(0.345), 'axis');
  o += text(X(0.37), O[1] - 7, 'θ', 'ts', 'end') + text(O[0] - 8, Y(0.345) + 8, 'ω', 'ts', 'end');
  for (const v of [0.1, 0.2, 0.3]) o += line(X(v), O[1], X(v), O[1] + 4, 'axis') + text(X(v), O[1] + 16, String(v), 'ts', 'middle');
  o += line(X(-0.03), Y(-0.03), X(0.335), Y(0.335), 'mute') + line(X(-0.055), Y(0.055), X(0.1), Y(-0.1), 'mute');
  o += text(X(0.335) - 8, Y(0.335) - 6, 'ω = θ：每步 ×1.1', 'ts', 'end');
  o += text(X(-0.055) - 4, Y(0.055) - 4, 'ω = −θ：每步 ×0.9', 'ts', 'end');
  for (let k = 0; k < N; k++) o += circle(X(xs[k][0]), Y(xs[k][1]), 2, 'mute-f');
  const p1 = fr.map((f) => c1 * 1.1 ** f);
  o += apath(fr.map((f, i) => d([O, [X(p1[i]), Y(p1[i])]])), kt, T, 'ink-b');
  o += apath(fr.map((f, i) => d([[X(p1[i]), Y(p1[i])], [X(xs[f][0]), Y(xs[f][1])]])), kt, T, 'dash');
  o += acircle(fr.map((f) => X(xs[f][0])), fr.map((f) => Y(xs[f][1])), kt, T, 5, 'ln-f');
  o += text(X(0.1) + 10, Y(-0.08) + 5, 'x₀ = (0.1, −0.08)', 'ts', 'start');
  return svgA(560, 282, o, '动图：倒立的 pendulum 按 Euler iteration 一步步走。右边 state 拆成沿 ω=θ 的部分（每步乘 1.1）和沿 ω=−θ 的部分（每步乘 0.9），前者从极小长大、后者衰减，state 先靠近原点再沿 ω=θ 被甩出去，pendulum 先往回摆再倒下');
}

// ---------- 2. 同一对 eigenvector 的六处 ----------
function family() {
  const W = 186, R = 68;
  const C = (col, row) => [93 + W * col, 102 + 222 * row];
  let o = '';
  const frameP = (c, title, foot1, foot2) => {
    let q = line(c[0] - R, c[1] + R, c[0] + R, c[1] - R, 'dash') + line(c[0] - R, c[1] - R, c[0] + R, c[1] + R, 'dash');
    q += text(c[0], c[1] - R - 16, title, 'tb', 'middle');
    q += text(c[0], c[1] + R + 18, foot1, 'ts', 'middle') + text(c[0], c[1] + R + 34, foot2, 'ts', 'middle');
    return q;
  };
  const tp = (c, s) => ([u, v]) => [c[0] + s * u, c[1] - s * v];
  // (a) power iteration
  {
    const c = C(0, 0), P = tp(c, 1);
    o += frameP(c, 'DSA2102：Aᵏx 的方向', '(1, 1)：×3　(1, −1)：×1', '方向每步转向 (1, 1)');
    let v = [1, 0];
    const cls = ['mute', 'mute', 'ink', 'ln'];
    for (let k = 0; k < 4; k++) {
      const n = Math.hypot(v[0], v[1]), p = P([62 * v[0] / n, 62 * v[1] / n]);
      o += arrow(c[0], c[1], p[0], p[1], cls[k], 6);
      v = [2 * v[0] + v[1], v[0] + 2 * v[1]];
    }
    o += text(c[0] + 64, c[1] + 14, 'k=0', 'ts', 'end');
    o += circle(c[0], c[1], 2.5, 'ink-f');
  }
  // (b) pendulum trajectory
  {
    const c = C(1, 0), P = tp(c, 112);
    o += frameP(c, 'MIT-6.8210：pendulum', '(1, 1)：×1.1　(1, −1)：×0.9', '沿 (1, 1) 倒下');
    const pts = []; let x = [0.1, -0.08];
    for (let k = 0; k <= 42; k++) { pts.push(P(x)); x = [x[0] + 0.1 * x[1], x[1] + 0.1 * x[0]]; }
    o += path(d(pts), 'ln') + circle(pts[0][0], pts[0][1], 3.5, 'ink-f') + circle(c[0], c[1], 2.5, 'ink-f');
    o += text(pts[0][0] + 7, pts[0][1] + 4, 'x₀', 'ts', 'start');
  }
  // (c) saddle
  {
    const c = C(2, 0), P = tp(c, 1);
    o += frameP(c, 'LSM2234：saddle', '(1, 1)：−2.19　(1, −1)：+0.19', '沿 (1, 1) 吸进，沿 (1, −1) 推出');
    const l1 = -2.191, l2 = 0.191, s2 = Math.SQRT1_2;
    for (const [a, b] of [[66, 12], [66, -12], [-66, 12], [-66, -12], [66, 26], [-66, -26]]) {
      const pts = [];
      for (let t = 0; t <= 16; t += 0.02) {
        const A = a * Math.exp(l1 * t), B = b * Math.exp(l2 * t);
        const u = s2 * (A + B), v = s2 * (A - B);
        if (Math.hypot(u, v) > R + 6 && t > 0.5) break;
        pts.push(P([u, v]));
      }
      o += path(d(pts), 'ink');
      for (const fr0 of [0.03, 0.9]) { const i = Math.floor(pts.length * fr0); o += arrow(pts[i][0], pts[i][1], pts[i + 2][0], pts[i + 2][1], 'ink', 6); }
    }
    o += circle(c[0], c[1], 4, 'paper');
  }
  // (d) gradient descent zigzag
  {
    const c = C(0, 1), sc = 27;
    o += frameP(c, 'DSA3102：gradient descent', '(1, 1)：1 − 11t　(1, −1)：1 − t', 't = 0.17：每步 −0.87 与 0.83');
    const toXY = (a, b) => { const u = Math.SQRT1_2 * (a + b), v = Math.SQRT1_2 * (a - b); return [c[0] + sc * u, c[1] - sc * v]; };
    for (const lev of [6.0, 1.5]) {
      const pts = [];
      for (let i = 0; i <= 120; i++) { const t = (2 * Math.PI * i) / 120; pts.push(toXY(Math.sqrt(lev / 11) * Math.cos(t), Math.sqrt(lev) * Math.sin(t))); }
      o += path(d(pts) + 'Z', 'grid');
    }
    let a = 0.5, b = 1.8; const pts = [];
    for (let k = 0; k <= 12; k++) { pts.push(toXY(a, b)); a *= -0.87; b *= 0.83; }
    o += path(d(pts), 'ln');
    for (const p of pts) o += circle(p[0], p[1], 2.2, 'ln-f');
    o += circle(c[0], c[1], 2.5, 'ink-f');
  }
  // (e) 2-pixel images
  {
    const c = C(1, 1), P = tp(c, 1.55);
    o += frameP(c, 'CS4243：12 张 image', '(1, 1)：variance 840', '(1, −1)：112.5，身份全在这里');
    for (const l of [-30, -18, -6, 6, 18, 30]) {
      const a = P([7.5 + l, -7.5 + l]), b = P([-7.5 + l, 7.5 + l]);
      o += circle(a[0], a[1], 3.6, 'ink-f') + circle(b[0], b[1], 3.6, 'paper');
    }
    o += text(c[0] + 44, c[1] + 2, 'A', 'ts', 'middle') + text(c[0] - 44, c[1] + 2, 'B', 'ts', 'middle');
  }
  // (f) Harris corner level set
  {
    const c = C(2, 1), sc = 50;
    o += frameP(c, 'CS4243：corner 的 SSD', '(1, 1)：125　(1, −1)：75', 'E(u, v) = 100 的 level set');
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const t = (2 * Math.PI * i) / 120, a = Math.sqrt(100 / 125) * Math.cos(t), b = Math.sqrt(100 / 75) * Math.sin(t);
      const u = Math.SQRT1_2 * (a + b), v = Math.SQRT1_2 * (a - b);
      pts.push([c[0] + sc * u, c[1] - sc * v]);
    }
    o += path(d(pts) + 'Z', 'wash ink-s') + circle(c[0], c[1], 2.5, 'ink-f');
  }
  return svg(560, 428, o, '六个小图：DSA2102 的 power iteration、MIT-6.8210 的 pendulum、LSM2234 的 saddle、DSA3102 的 gradient descent、CS4243 的 2-pixel image 与 Harris corner，全都以 (1,1) 和 (1,-1) 两条对角线为 eigenvector');
}

// ---------- 3. Norm bound 与 spectral radius ----------
function bound() {
  // 实际的 error 序列
  const jac = []; { let x = [0, 0]; const xs = [1 / 11, 7 / 11]; for (let k = 0; k <= 20; k++) { jac.push(Math.max(Math.abs(x[0] - xs[0]), Math.abs(x[1] - xs[1]))); x = [(1 - x[1]) / 4, (2 - x[0]) / 3]; } }
  const mulRow = (x, P) => P[0].map((_, j) => x.reduce((s, xi, i) => s + xi * P[i][j], 0));
  const l1 = (a, b) => a.reduce((s, v, i) => s + Math.abs(v - b[i]), 0);
  const Ps = [[0.7, 0.2, 0.1], [0.3, 0.5, 0.2], [0.2, 0.4, 0.4]], pis = [22 / 47, 16 / 47, 9 / 47];
  const soc = []; { let x = [1, 0, 0]; for (let k = 0; k <= 20; k++) { soc.push(l1(x, pis)); x = mulRow(x, Ps); } }
  const Pp = [[0, 0.5, 0.5, 0, 0], [0, 0, 1, 0, 0], [1, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 0]];
  const G = Pp.map((r) => r.map((v) => 0.85 * v + 0.03));
  let pr = [0.2, 0.2, 0.2, 0.2, 0.2]; for (let k = 0; k < 400; k++) pr = mulRow(pr, G);
  const pag = []; { let x = [0.2, 0.2, 0.2, 0.2, 0.2]; for (let k = 0; k <= 20; k++) { pag.push(l1(x, pr)); x = mulRow(x, G); } }
  const panels = [
    { title: 'DSA2102 Jacobi', e: jac, b: [[1 / 3, '‖G‖∞ᵏ = (1/3)ᵏ', 'dash', -4.2]], rho: 0.28868, rl: 'ρᵏ = 0.289ᵏ', ry: -6.3, below: true },
    { title: 'ST3236 social mobility', e: soc, b: [[0.8, '0.8ᵏ', 'dash', -1.3], [0.5, '0.5ᵏ', 'ln-dash', -4.6]], rho: 0.44142, rl: 'ρᵏ = 0.441ᵏ', ry: -5.6, below: true },
    { title: 'MA3270 PageRank', e: pag, b: [[0.85, '0.85ᵏ', 'dash', -1.0]], rho: 0.60104, rl: 'ρᵏ = 0.601ᵏ', ry: -2.4, below: false },
  ];
  let o = '';
  const w = 140, gap = 42, top = 30, H = 196;
  panels.forEach((pn, i) => {
    const x0 = 46 + i * (w + gap);
    const sx = lin(0, 20, x0, x0 + w), sy = lin(0, -8, top, top + H);
    o += text(x0 + w / 2, top - 12, pn.title, 'tb', 'middle');
    o += line(x0, top, x0, top + H, 'axis') + line(x0, top + H, x0 + w, top + H, 'axis');
    for (const v of [0, -2, -4, -6, -8]) { o += line(x0, sy(v), x0 + w, sy(v), 'grid'); if (i === 0) o += text(x0 - 6, sy(v) + 4, v === 0 ? '1' : '10' + ['', '', '⁻²', '', '⁻⁴', '', '⁻⁶', '', '⁻⁸'][-v], 'ts', 'end'); }
    for (const k of [0, 10, 20]) o += text(sx(k), top + H + 16, String(k), 'ts', 'middle');
    if (i === 1) o += text(x0 + w / 2, top + H + 34, 'k', 'ts', 'middle');
    const at = (r, y) => { const k = y / Math.log10(r); return [sx(k), sy(y)]; };
    const clipLine = (r) => { const kmax = Math.min(20, -8 / Math.log10(r)); return d([[sx(0), sy(0)], [sx(kmax), sy(kmax * Math.log10(r))]]); };
    for (const [r, lab, cls, y] of pn.b) {
      o += path(clipLine(r), cls);
      const [lx, ly] = at(r, y);
      o += text(lx + 5, ly - 5, lab, 'ts', 'start');
    }
    o += path(clipLine(pn.rho), 'ink');
    const e0 = pn.e[0];
    pn.e.forEach((e, k) => { const y = Math.log10(e / e0); if (y >= -8) o += circle(sx(k), sy(y), 2.6, 'ln-f'); });
    const [rx, ry] = at(pn.rho, pn.ry);
    o += pn.below ? text(rx - 6, ry + 12, pn.rl, 'ts', 'end') : text(rx + 6, ry - 6, pn.rl, 'ts', 'start');
  });
  return svg(560, 268, o, '三个 semilog 小图：Jacobi、social mobility chain、PageRank 的实际 error（点）贴着 spectral radius 的 k 次方（细实线），一步 norm bound 的 k 次方（虚线）在它们上方越拉越远');
}

// ---------- 4. z-plane：e^{hλ} 与 1+hλ ----------
function zplaneA() {
  const n = 41;
  const { kt, fr, T } = framesEnd(n, 2.4, 0.8, 0.15, 2);
  const s = fr.map((f) => f / (n - 1));
  let o = '';
  // 左：Q 的三个 eigenvalue，全是 real
  const LC = [172, 152], LR = 92;
  const LX = (re) => LC[0] + LR * re, LY = (im) => LC[1] - LR * im;
  o += text(LC[0] - 6, 14, 'MA3238 的 Q：λ = 0, −2, −4', 'tb', 'middle');
  o += path(d(Array.from({ length: 121 }, (_, i) => [LX(Math.cos((2 * Math.PI * i) / 120)), LY(Math.sin((2 * Math.PI * i) / 120))])) + 'Z', 'ink');
  o += line(LX(-1.6), LC[1], LX(1.35), LC[1], 'axis') + line(LC[0], LY(1.12), LC[0], LY(-1.12), 'axis');
  for (const v of [-1, 1]) o += text(LX(v) + (v < 0 ? -4 : 4), LC[1] + 16, v < 0 ? '−1' : '1', 'ts', v < 0 ? 'end' : 'start');
  const hL = s.map((v) => 0.6 * v);
  for (const lam of [-2, -4]) {
    o += acircle(hL.map((h) => LX(Math.exp(h * lam))), hL.map(() => LC[1]), kt, T, 7, 'ink');
    o += acircle(hL.map((h) => LX(1 + h * lam)), hL.map(() => LC[1]), kt, T, 4, 'ln-f');
  }
  o += circle(LX(1), LC[1], 4, 'ln-f') + circle(LX(1), LC[1], 7, 'ink');
  // 右：RB2203 下垂的 joint，放大 z = 1 附近
  const RC = [432, 152], RS = 250, re0 = 0.86;
  const RX = (re) => RC[0] + RS * (re - re0), RY = (im) => RC[1] - RS * im;
  o += text(RC[0] - 4, 14, 'RB2203：λ = −1 ± 6.18j', 'tb', 'middle');
  const arc = []; for (let i = 0; i <= 60; i++) { const t = -0.5 + 1.0 * i / 60; arc.push([RX(Math.cos(t)), RY(Math.sin(t))]); }
  o += path(d(arc), 'ink') + line(RX(0.66), RC[1], RX(1.17), RC[1], 'axis');
  o += text(RX(1) + 6, RC[1] + 16, '1', 'ts', 'start');
  const hR = s.map((v) => 0.07 * v), wr = Math.sqrt(38.24);
  for (const sg of [1, -1]) {
    o += line(RX(1), RC[1], RX(1 - 0.074), RY(sg * wr * 0.074), 'grid');
    o += acircle(hR.map((h) => RX(Math.exp(-h) * Math.cos(wr * h))), hR.map((h) => RY(sg * Math.exp(-h) * Math.sin(wr * h))), kt, T, 7, 'ink');
    o += acircle(hR.map((h) => RX(1 - h)), hR.map((h) => RY(sg * wr * h)), kt, T, 4, 'ln-f');
  }
  // 读数
  for (let k = 0; k < n; k++) {
    const hl = 0.6 * k / (n - 1), hr = 0.07 * k / (n - 1);
    let body = text(LC[0] - 6, 296, `h = ${hl.toFixed(3)}：Euler 的 1 − 4h = ${fmt(1 - 4 * hl, 2)}`, 't', 'middle');
    body += text(RC[0] - 4, 296, `h = ${hr.toFixed(3)} s：|1 + hλ| = ${Math.sqrt((1 - hr) ** 2 + 38.24 * hr * hr).toFixed(3)}`, 't', 'middle');
    if (hl >= 0.5) body += text(LX(-1.35), LC[1] - 22, '出界', 'tl', 'middle');
    if (hr >= 0.051) body += text(RX(0.985), RY(0.33), '出界', 'tl', 'start');
    o += only(k, fr, kt, T, body);
  }
  o += text(280, 318, '空心：准确的 e' + sup('hλ') + '　　实心：Euler 的 1 + hλ', 'ts', 'middle');
  return svgA(560, 324, o, '动图：h 增大时，准确采样的 eigenvalue e^{hλ}（空心点）始终在 unit circle 内，Euler 的 1+hλ（实心点）沿直线往外走。左边 MA3238 的 generator 在 h=0.5 时出界，右边 RB2203 下垂的 joint 在 h=0.051 s 时出界');
}

// ---------- 5. toggle switch：α 扫过 2 ----------
function toggleA() {
  const alphas = []; for (let a = 1.5; a <= 3.0001; a += 0.05) alphas.push(+a.toFixed(2));
  const n = alphas.length;
  const { kt, fr, T } = framesEnd(n, 2.4, 1.0, 0.16, 2.2);
  const cub = (al) => { let u = 1; for (let i = 0; i < 60; i++) u -= (u ** 3 + u - al) / (3 * u * u + 1); return u; };
  const sx = lin(0, 3.2, 46, 282), sy = lin(0, 3.2, 262, 26);
  let o = line(sx(0), sy(0), sx(3.2), sy(0), 'axis') + line(sx(0), sy(0), sx(0), sy(3.2), 'axis');
  for (const v of [1, 2, 3]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle') + line(sx(0) - 4, sy(v), sx(0), sy(v), 'axis') + text(sx(0) - 7, sy(v) + 4, String(v), 'ts', 'end');
  o += text(sx(3.2), sy(0) + 30, 'u', 'ts', 'end') + text(sx(0) - 10, sy(3.2) + 4, 'v', 'ts', 'end');
  o += line(sx(0), sy(0), sx(3.15), sy(3.15), 'grid');
  const M = 48;
  const uNull = (al) => d(Array.from({ length: M + 1 }, (_, i) => { const v = 3.2 * i / M; return [sx(al / (1 + v * v)), sy(v)]; }));
  const vNull = (al) => d(Array.from({ length: M + 1 }, (_, i) => { const u = 3.2 * i / M; return [sx(u), sy(al / (1 + u * u))]; }));
  o += apath(fr.map((f) => uNull(alphas[f])), kt, T, 'ln') + apath(fr.map((f) => vNull(alphas[f])), kt, T, 'ink-b');
  const diag = fr.map((f) => cub(alphas[f]));
  const asym = fr.map((f, i) => { const al = alphas[f]; if (al <= 2) return [diag[i], diag[i]]; const r = Math.sqrt(al * al - 4); return [(al + r) / 2, (al - r) / 2]; });
  const st = fr.map((f) => alphas[f] < 2), on = fr.map((f) => alphas[f] > 2);
  o += `<circle cx="${f1(sx(diag[0]))}" cy="${f1(sy(diag[0]))}" r="6" class="ink-f" opacity="${st[0] ? 1 : 0}">${anim('cx', diag.map((u) => f1(sx(u))), kt, T)}${anim('cy', diag.map((u) => f1(sy(u))), kt, T)}${ashow(st, kt, T)}</circle>`;
  o += `<circle cx="${f1(sx(diag[0]))}" cy="${f1(sy(diag[0]))}" r="6" class="paper" opacity="${st[0] ? 0 : 1}">${anim('cx', diag.map((u) => f1(sx(u))), kt, T)}${anim('cy', diag.map((u) => f1(sy(u))), kt, T)}${ashow(st.map((b) => !b), kt, T)}</circle>`;
  for (const sw of [0, 1]) {
    const xs = asym.map((p) => sx(p[sw])), ys = asym.map((p) => sy(p[1 - sw]));
    o += `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="6" class="ink-f" opacity="${on[0] ? 1 : 0}">${anim('cx', xs.map(f1), kt, T)}${anim('cy', ys.map(f1), kt, T)}${ashow(on, kt, T)}</circle>`;
  }
  o += text(sx(0.2), sy(3.2) - 8, 'u nullcline', 'tl', 'start') + text(sx(3.2) + 4, sy(0.2) + 4, 'v nullcline', 'tb', 'start');
  // 右侧读数
  const X = 318;
  o += text(X, 30, '对角线上的 fixed point', 'tb');
  for (let k = 0; k < n; k++) {
    const al = alphas[k], u = cub(al), a = 2 * u * u / (1 + u * u), det = 1 - a * a;
    let b = text(X, 54, `α = ${al.toFixed(2)}`, 'tl');
    b += text(X, 74, `u* = v* = ${u.toFixed(3)}，a = ${a.toFixed(3)}`, 't');
    b += text(X, 94, `tr J = −2，det J = 1 − a² = ${fmt(det, 3)}`, 't');
    b += text(X, 114, `Routh first column：1, 2, ${fmt(det, 3)}`, 't');
    b += text(X, 134, Math.abs(det) < 0.0005 ? '恰好在边界上（eigenvalue 0）' : det > 0 ? 'sign change 0 次：stable' : 'sign change 1 次：saddle', det < -0.0005 ? 'tl' : 'tb');
    if (al > 2.0001) {
      const dA = 1 - 4 / (al * al);
      b += text(X, 168, '两个不对称的 fixed point', 'tb') + text(X, 188, `det J = 1 − 4/α² = ${dA.toFixed(3)}`, 't') + text(X, 208, `Routh first column：1, 2, ${dA.toFixed(3)}`, 't') + text(X, 228, 'sign change 0 次：stable', 'tb');
    } else b += text(X, 168, 'α ≤ 2：没有不对称的 fixed point', 'ts');
    o += only(k, fr, kt, T, b);
  }
  return svgA(560, 290, o, '动图：toggle switch 的 phase plane，alpha 从 1.5 增大到 3。两条 nullcline 移动，对角线上的 fixed point 在 alpha=2 时由 stable 变成 saddle，Routh first column 的最后一项变号，同时两侧各分出一个 stable 的 fixed point');
}

// ---------- 6. Harris 的 M 是 gradient 的 second moment ----------
function harris() {
  const img = (r, c) => (r >= 5 && c >= 5 ? 10 : 0);
  const grad = (r, c) => [(img(r, c + 1) - img(r, c - 1)) / 2, (img(r + 1, c) - img(r - 1, c)) / 2];
  let o = '';
  // 左：11×11 toy image 的缩略图，框出两个 window
  const cs = 9, TX = 8, TY = 92;
  for (let r = 0; r < 11; r++) for (let c = 0; c < 11; c++) o += rect(TX + c * cs, TY + r * cs, cs, cs, img(r, c) ? 'wash-strong' : 'paper');
  o += text(TX + 49, TY - 10, 'toy image', 'ts', 'middle') + text(TX, TY + 116, '上框：corner', 'ts', 'start') + text(TX, TY + 134, '下框：edge', 'ts', 'start');
  const rows = [{ ctr: [5, 5], name: 'corner (5, 5)', y0: 20 }, { ctr: [8, 5], name: 'edge (8, 5)', y0: 182 }];
  for (const R of rows) {
    const [r0, c0] = R.ctr;
    o += rect(TX + (c0 - 1) * cs, TY + (r0 - 1) * cs, 3 * cs, 3 * cs, 'ln', 0);
    // 中：放大的 window，每个 pixel 画出 gradient
    const WX = 140, WY = R.y0 + 14, ws = 38;
    o += text(WX + 57, R.y0, R.name, 'tb', 'middle');
    const pts = {};
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const r = r0 - 1 + i, c = c0 - 1 + j;
      o += rect(WX + j * ws, WY + i * ws, ws, ws, img(r, c) ? 'wash-strong' : 'paper');
      const [gx, gy] = grad(r, c), cx = WX + j * ws + ws / 2, cy = WY + i * ws + ws / 2;
      if (gx || gy) { const L = 2.8; o += arrow(cx - L * gx / 2, cy - L * gy / 2, cx + L * gx / 2, cy + L * gy / 2, 'ink', 5); } else o += circle(cx, cy, 2, 'ink-f');
      const key = gx + ',' + gy; pts[key] = (pts[key] || 0) + 1;
    }
    // 右：9 个 gradient 画成 (I_x, I_y) plane 里的点，I_y 朝下
    const O = [330, R.y0 + 40], sc = 12;
    const P = ([gx, gy]) => [O[0] + sc * gx, O[1] + sc * gy];
    o += line(O[0], O[1], O[0] + 110, O[1], 'axis') + line(O[0], O[1], O[0], O[1] + 92, 'axis');
    o += text(O[0] + 112, O[1] + 4, 'I' + sub('x'), 'ts', 'start') + text(O[0] - 6, O[1] + 90, 'I' + sub('y'), 'ts', 'end');
    const lab = { '0,0': [-8, 4, 'end'], '5,0': [8, -7, 'start'], '0,5': [8, 4, 'start'], '5,5': [9, -6, 'start'] };
    for (const [key, m] of Object.entries(pts)) {
      const g = key.split(',').map(Number), p = P(g), [dx, dy, an] = lab[key];
      o += circle(p[0], p[1], 5, 'ln-f') + text(p[0] + dx, p[1] + dy, '×' + m, 'ts', an);
    }
    if (r0 === 5) {
      const a1 = P([6.6, 6.6]), a2 = P([3.4, -3.4]);
      o += arrow(O[0], O[1], a1[0], a1[1], 'ink', 6) + text(a1[0] + 6, a1[1] + 12, '(1, 1)：125', 'tl', 'start');
      o += arrow(O[0], O[1], a2[0], a2[1], 'ink', 6) + text(a2[0] + 6, a2[1] + 4, '(1, −1)：75', 'tl', 'start');
      o += text(O[0] + 150, O[1] + 30, 'λ' + sub('min') + ' = 75', 't', 'start') + text(O[0] + 150, O[1] + 50, '→ corner', 'tb', 'start');
    } else {
      const a1 = P([8.2, 0]);
      o += text(a1[0] - 4, a1[1] + 22, '(1, 0)：150', 'tl', 'end') + text(O[0] + 8, O[1] + 70, '(0, 1)：0', 'tl', 'start');
      o += text(O[0] + 150, O[1] + 30, 'λ' + sub('min') + ' = 0', 't', 'start') + text(O[0] + 150, O[1] + 50, '→ edge', 'tb', 'start');
    }
  }
  return svg(560, 320, o, 'Harris 的 second moment matrix 就是 gradient 的 PCA：corner window 的 9 个 gradient 在两个方向上散开，eigenvalue 125 和 75；edge window 的 gradient 全在 I_x 轴上，只有一个 principal direction');
}

// ---------- 7. PCA 用 power iteration ----------
function pcaA() {
  const ls = [-30, -18, -6, 6, 18, 30];
  const X = [...ls.map((l) => [7.5 + l, -7.5 + l]), ...ls.map((l) => [-7.5 + l, 7.5 + l])];
  const Cmul = (u) => { const p = X.map(([a, b]) => a * u[0] + b * u[1]); return [p.reduce((s, v, i) => s + v * X[i][0], 0) / 12, p.reduce((s, v, i) => s + v * X[i][1], 0) / 12]; };
  const us = [[1, 0]]; for (let k = 0; k < 4; k++) { const c = Cmul(us[k]), n = Math.hypot(c[0], c[1]); us.push([c[0] / n, c[1] / n]); }
  const n = us.length;
  const { kt, fr, T } = frames(n, 1.8, 1.8, 1.8);
  const O = [170, 148], s = 3.1;
  const P = ([a, b]) => [O[0] + s * a, O[1] - s * b];
  let o = line(O[0] - 140, O[1], O[0] + 140, O[1], 'grid') + line(O[0], O[1] - 136, O[0], O[1] + 136, 'grid');
  o += line(O[0] - 128, O[1] + 128, O[0] + 128, O[1] - 128, 'dash') + text(O[0] + 112, O[1] - 136, '(1, 1)：λ = 840', 'ts', 'middle');
  const ln = (u) => d([P([-45 * u[0], -45 * u[1]]), P([45 * u[0], 45 * u[1]])]);
  o += apath(fr.map((f) => ln(us[f])), kt, T, 'ink', true);
  X.forEach((x) => {
    const foot = (u) => { const t = x[0] * u[0] + x[1] * u[1]; return [t * u[0], t * u[1]]; };
    o += apath(fr.map((f) => d([P(x), P(foot(us[f]))])), kt, T, 'mute', true);
  });
  X.forEach((x, i) => { const p = P(x); o += circle(p[0], p[1], 3.8, i < 6 ? 'ink-f' : 'paper'); });
  const cu = us.map(Cmul), sc = 0.045;
  const tipXY = cu.map(([a, b]) => P([sc * a, sc * b]));
  const arrowD = (q) => { const a = Math.atan2(q[1] - O[1], q[0] - O[0]), z = 8; const L = (ang) => [q[0] - z * Math.cos(a + ang), q[1] - z * Math.sin(a + ang)]; return d([O, q]) + d([L(0.42), q, L(-0.42)]); };
  o += apath(fr.map((f) => arrowD(tipXY[f])), kt, T, 'ln', true);
  const TX = 360;
  o += text(TX, 30, 'Cu = (1/n) Σ xᵢ (xᵢ · u)', 'tb') + text(TX, 50, '先投到 u 上，再按 projection 加权平均', 'ts');
  o += text(TX, 70, '实心：person A　空心：person B', 'ts');
  for (let k = 0; k < n; k++) {
    const u = us[k], ang = 45 - Math.atan2(u[1], u[0]) * 180 / Math.PI;
    const rq = (() => { const c = Cmul(u); return c[0] * u[0] + c[1] * u[1]; })();
    let b = text(TX, 112, `k = ${k}`, 'tl');
    b += text(TX, 134, `u = (${u[0].toFixed(4)}, ${u[1].toFixed(4)})`, 't');
    b += text(TX, 154, `与 (1, 1) 的 angle：${ang < 0.1 ? ang.toFixed(3) : ang.toFixed(2)}°`, 't');
    b += text(TX, 174, `Rayleigh quotient：${rq.toFixed(2)}`, 't');
    if (k < n - 1) b += text(TX, 206, '彩色箭头 Cu 是下一步的方向', 'ts');
    o += only(k, fr, kt, T, b);
  }
  o += text(TX, 240, 'tan(angle) 每步乘 112.5 / 840 = 0.134', 'ts');
  return svgA(560, 290, o, '动图：对 12 张 2-pixel image 的 covariance 做 power iteration。每一帧画出当前方向 u、每个点到 u 的垂足，以及以 projection 为 weight 的平均 Cu；u 两三步就转到 (1,1) 上');
}

export default {
  'thread-eigen-pendulum': pendulumA,
  'thread-eigen-family': family,
  'thread-eigen-bound': bound,
  'thread-eigen-zplane': zplaneA,
  'thread-eigen-toggle': toggleA,
  'thread-eigen-harris': harris,
  'thread-eigen-pca': pcaA,
};
