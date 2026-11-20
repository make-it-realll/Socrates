import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, axes } from '../lib/svg.mjs';

// ---------- 小工具：polynomial 与 step response（全部实算） ----------
const pmul = (a, b) => { const r = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
const padd = (a, b) => { const n = Math.max(a.length, b.length); const A = Array(n - a.length).fill(0).concat(a), B = Array(n - b.length).fill(0).concat(b); return A.map((x, i) => x + B[i]); };
const G0 = pmul([1, 2, 0], [1, 20]); // s(s+2)(s+20)，真实 plant 是 20 / G0

// Transfer function num/den 的 step response，controllable canonical form + RK4
function step(num, den, T, n = 4000) {
  const a0 = den[0]; const A = den.map((x) => x / a0); const N = num.map((x) => x / a0);
  const k = A.length - 1; const b = Array(k + 1 - N.length).fill(0).concat(N);
  // y = sum c_i x_i + d u, 其中 b(s)/a(s) = d + (c(s))/a(s)
  const dd = b[0]; const c = []; for (let i = 1; i <= k; i++) c.push(b[i] - dd * A[i]);
  const f = (x) => { const dx = x.slice(1); let s = 1; for (let i = 0; i < k; i++) s -= A[k - i] * x[i]; dx.push(s); return dx; };
  let x = Array(k).fill(0); const h = T / n; const out = [];
  const y = (x) => { let s = dd; for (let i = 0; i < k; i++) s += c[k - 1 - i] * x[i]; return s; };
  for (let i = 0; i <= n; i++) {
    out.push([i * h, y(x)]);
    const k1 = f(x), k2 = f(x.map((v, j) => v + (h / 2) * k1[j])), k3 = f(x.map((v, j) => v + (h / 2) * k2[j])), k4 = f(x.map((v, j) => v + h * k3[j]));
    x = x.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
  }
  return out;
}
const plotPts = (pts, sx, sy, every = 4) => d(pts.filter((_, i) => i % every === 0).map(([t, v]) => [sx(t), sy(v)]));

// 1. Unity feedback 的 block diagram
function loop() {
  let o = '';
  const y0 = 70;
  const sum = (x, y) => circle(x, y, 13, 'paper') + line(x - 6, y, x + 6, y, 'ink') + line(x, y - 6, x, y + 6, 'ink');
  o += text(22, y0 + 5, it('r'), 'tb') + arrow(34, y0, 77, y0, 'ink');
  o += sum(90, y0) + text(74, y0 + 28, '−', 'tb', 'middle');
  o += arrow(103, y0, 150, y0, 'ink') + text(126, y0 - 8, it('e'), 't', 'middle');
  o += rect(150, y0 - 22, 92, 44, 'paper', 6) + text(196, y0 - 2, 'controller', 'ts', 'middle') + text(196, y0 + 15, it('C') + '(' + it('s') + ')', 't', 'middle');
  o += arrow(242, y0, 287, y0, 'ink') + text(264, y0 - 8, it('u'), 't', 'middle');
  o += sum(300, y0) + text(300, 22, it('d') + '（disturbance）', 't', 'middle') + arrow(300, 30, 300, y0 - 13, 'ink');
  o += arrow(313, y0, 350, y0, 'ink');
  o += rect(350, y0 - 22, 92, 44, 'wash', 6) + rect(350, y0 - 22, 92, 44, 'frame', 6) + text(396, y0 - 2, 'plant', 'ts', 'middle') + text(396, y0 + 15, it('G') + '(' + it('s') + ')', 't', 'middle');
  o += line(442, y0, 482, y0, 'ink') + arrow(482, y0, 530, y0, 'ink') + text(536, y0 + 5, it('y'), 'tb');
  o += circle(482, y0, 3, 'ink-f') + line(482, y0, 482, 150, 'ink') + line(482, 150, 412, 150, 'ink');
  o += sum(400, 150) + text(430, 178, it('n') + '（sensor noise）', 't', 'start') + arrow(400, 185, 400, 163, 'ink');
  o += line(387, 150, 90, 150, 'ink') + arrow(90, 150, 90, y0 + 13, 'ink');
  o += text(240, 142, 'measurement ' + it('y') + ' + ' + it('n'), 'ts', 'middle');
  return svg(560, 200, o, 'Unity feedback 的 block diagram：reference r 减去 measurement 得到 error e，controller C(s) 的 output 是 u，disturbance d 加在 plant G(s) 的 input 上，sensor noise n 加在 measurement 上');
}

// 2. steady-state output 对 plant gain 的敏感程度：open loop vs closed loop
function sens() {
  const sx = lin(0.3, 0.7, 70, 400), sy = lin(0.5, 1.5, 240, 30);
  let o = axes({ sx, sy, x0: 0.3, x1: 0.7, y0: 0.5, y1: 1.5, xt: [0.3, 0.4, 0.5, 0.6, 0.7], yt: [0.6, 0.8, 1, 1.2, 1.4], grid: true });
  o += path(curve((g) => 2 * g, 0.3, 0.7, sx, sy), 'ink-b') + path(curve((g) => (50 * g) / (1 + 50 * g), 0.3, 0.7, sx, sy), 'ln');
  o += line(sx(0.5), sy(0.5), sx(0.5), sy(1.5), 'dash') + line(sx(0.4), sy(0.5), sx(0.4), sy(1.5), 'dash');
  o += circle(sx(0.4), sy(0.8), 4, 'ink-f') + circle(sx(0.4), sy(20 / 21), 4, 'ln-f') + circle(sx(0.5), sy(1), 4, 'ink-f') + circle(sx(0.5), sy(25 / 26), 4, 'ln-f');
  o += text(sx(0.4) - 6, sy(0.8) + 4, '0.80', 'ts', 'end') + text(sx(0.4) - 6, sy(20 / 21) + 16, '0.952', 'tl', 'end');
  o += text(sx(0.5) + 6, sy(25 / 26) + 16, '0.962', 'tl') + text(sx(0.5) - 8, sy(1) - 6, '1.00', 'ts', 'end');
  o += text(sx(0.63), sy(1.33), 'open loop', 'tb', 'end') + text(sx(0.69), sy(1.0), 'closed loop，K = 50', 'tl', 'end');
  o += text(sx(0.7), 272, 'plant 的 DC gain（rad/s per V）', 'ts', 'end') + text(70, 18, 'steady-state speed / reference', 'ts');
  o += text(418, 70, '同样 −20% 的', 't') + text(418, 90, 'plant gain 变化：', 't');
  o += text(418, 118, 'open loop 的 output', 't') + text(418, 136, '跟着 −20%', 'tb');
  o += text(418, 164, 'closed loop 的 output', 't') + text(418, 182, '只 −0.95%', 'tl');
  return svg(560, 282, o, 'Steady-state output 随 plant DC gain 变化：open loop 是一条 slope 很大的直线，closed loop 几乎是平的');
}

// 3. s-plane 上的 specification 区域，以及 P control 时 pole 走的路
function region() {
  const sx = lin(-8, 1, 40, 400), sy = lin(-10, 10, 290, 20);
  let o = '';
  const z = 0.4, tq = Math.sqrt(1 - z * z) / z; // ζ = 0.4 的 ray：|Im| = tq·|Re|
  const xTop = -10 / tq;
  o += poly([[sx(-2), sy(2 * tq)], [sx(xTop), sy(10)], [sx(-8), sy(10)], [sx(-8), sy(-10)], [sx(xTop), sy(-10)], [sx(-2), sy(-2 * tq)]], 'wash');
  o += line(sx(-8), sy(0), sx(1), sy(0), 'axis') + line(sx(0), sy(-10), sx(0), sy(10), 'axis');
  o += line(sx(0), sy(0), sx(xTop), sy(10), 'dash') + line(sx(0), sy(0), sx(xTop), sy(-10), 'dash');
  o += line(sx(-2), sy(-10), sx(-2), sy(10), 'dash');
  o += path(d([[sx(0), sy(0)], [sx(-1), sy(0)]]), 'ln') + path(d([[sx(-2), sy(0)], [sx(-1), sy(0)]]), 'ln');
  o += arrow(sx(-1), sy(0), sx(-1), sy(9.6), 'ln') + arrow(sx(-1), sy(0), sx(-1), sy(-9.6), 'ln');
  o += text(sx(0) + 6, sy(0) + 16, '0', 'ts') + text(sx(-2) - 4, sy(0) + 16, '−2', 'ts', 'end') + text(sx(-1) + 4, sy(0) + 16, '−1', 'ts');
  for (const p of [0, -2]) o += line(sx(p) - 5, sy(0) - 5, sx(p) + 5, sy(0) + 5, 'ink-b') + line(sx(p) - 5, sy(0) + 5, sx(p) + 5, sy(0) - 5, 'ink-b');
  const k = Math.sqrt(5.25);
  o += circle(sx(-1), sy(k), 4.5, 'ln-f') + circle(sx(-1), sy(-k), 4.5, 'ln-f') + text(sx(-1) + 10, sy(k) - 12, 'K = 6.25', 'tl');
  o += text(sx(-5.6), sy(-1.6), '允许区域', 'tb', 'middle');
  o += text(sx(-2) - 4, sy(-9.2), 'Re ' + it('s') + ' = −2', 'ts', 'end');
  o += text(sx(-3.6), sy(9.0), 'ζ = 0.4', 'ts');
  o += text(418, 50, 'Overshoot ≤ 25%：', 'tb') + text(418, 68, '在 ζ = 0.4 的', 't') + text(418, 86, '两条 ray 之间', 't');
  o += text(418, 114, 'Settling time ≤ 2 s：', 'tb') + text(418, 132, '在 Re ' + it('s') + ' = −2 左边', 't');
  o += text(418, 168, 'P control 的 pole', 'tl') + text(418, 186, '只能在 Re ' + it('s') + ' = −1', 't') + text(418, 204, '这条竖线上走，', 't') + text(418, 222, '永远进不了', 't') + text(418, 240, '浅色区域', 't');
  return svg(560, 300, o, 's-plane 上 overshoot 与 settling time 的要求划出一个区域；P control 时 closed-loop pole 只能沿 Re s 等于 −1 的竖线移动，进不了这个区域');
}

// 4. P control：K 越大越 oscillate，但 decay 快慢不变
function pstep() {
  const sx = lin(0, 8, 60, 520), sy = lin(0, 1.8, 230, 25);
  let o = axes({ sx, sy, x0: 0, x1: 8, y0: 0, y1: 1.8, xt: [0, 2, 4, 6, 8], yt: [0.5, 1, 1.5], grid: true });
  o += path(curve((t) => 1 + 1.0126 * Math.exp(-t), 0.3, 8, sx, sy), 'dash') + path(curve((t) => 1 - 1.0126 * Math.exp(-t), 0.3, 8, sx, sy), 'dash');
  const cls = { 1: 'mute', 4: 'ink', 40: 'ln' };
  for (const K of [1, 4, 40]) o += path(plotPts(step([K], [1, 2, K], 8, 4000), sx, sy), cls[K]);
  o += text(sx(2.6), sy(0.5), 'K = 1', 'ts') + text(sx(1.95), sy(1.27), 'K = 4', 'tb') + text(sx(0.62), sy(1.66), 'K = 40', 'tl');
  o += text(sx(3.3), sy(1.5), '虚线：1 ± e⁻ᵗ，K 再大也逃不出这个 envelope', 't');
  o += text(sx(8), 262, 'time（s）', 'ts', 'end') + text(60, 16, 'θ（rad），unit step reference', 'ts');
  return svg(560, 272, o, 'Motor 在 P control 下的 step response：K 越大 oscillation 越厉害，但都被同一条 e 的负 t 次方的 envelope 限制，settling time 几乎不变');
}

// 5. Zero 对 step response 的影响
function zero() {
  const sx = lin(0, 6, 60, 400), sy = lin(0, 1.8, 230, 25);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 0, y1: 1.8, xt: [0, 1, 2, 3, 4, 5, 6], yt: [0.5, 1, 1.5], grid: true });
  const lab = [[1, 'ln', 'zero 在 −1：70%'], [2, 'ink', 'zero 在 −2：30%'], [4, 'mute', 'zero 在 −4：19%'], [0, 'dash', '没有 zero：16%']];
  for (const [a, cls] of lab) {
    const num = a ? [4 / a, 4] : [4];
    o += path(plotPts(step(num, [1, 2, 4], 6, 3000), sx, sy), cls);
  }
  lab.forEach(([, cls, s], i) => { o += line(418, 60 + i * 24, 440, 60 + i * 24, cls) + text(446, 64 + i * 24, s, cls === 'ln' ? 'tl' : 't'); });
  o += text(418, 176, 'denominator 都是', 'ts') + text(418, 194, 's² + 2s + 4（ζ = 0.5），', 'ts') + text(418, 212, 'DC gain 都是 1', 'ts');
  o += text(sx(6), 262, 'time（s）', 'ts', 'end');
  return svg(560, 272, o, '同一对 pole（ζ 等于 0.5）加上不同位置的 zero：zero 越靠近 origin，overshoot 越大');
}

// 6. 真实 plant 的 root locus
function rlocus() {
  const sx = lin(-24, 4, 30, 530), sy = lin(-9, 9, 330, 20);
  let o = line(sx(-24), sy(0), sx(4), sy(0), 'axis') + line(sx(0), sy(-9), sx(0), sy(9), 'axis');
  for (const v of [-20, -15, -10, -5]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 17, String(v).replace('-', '−'), 'ts', 'middle');
  // asymptotes from −22/3 at ±60°
  const c = -22 / 3;
  o += line(sx(c), sy(0), sx(c + 9 / Math.tan(Math.PI / 3)), sy(9), 'dash') + line(sx(c), sy(0), sx(c + 9 / Math.tan(Math.PI / 3)), sy(-9), 'dash');
  // ζ = 0.5 ray
  o += line(sx(0), sy(0), sx(-9 / Math.tan(Math.PI / 3)), sy(9), 'grid');
  // branches
  const A = [], B = [], C = [];
  const roots3 = (K) => {
    // s^3 + 22 s^2 + 40 s + 20K：Durand–Kerner
    let z = [{ re: -21, im: 0.1 }, { re: -1, im: 1 }, { re: -1, im: -1 }];
    const P = (s) => { const m = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }); let r = { re: 1, im: 0 }; for (const co of [22, 40, 20 * K]) { r = m(r, s); r.re += co; } return r; };
    for (let it2 = 0; it2 < 200; it2++) z = z.map((zi, i) => { let den = { re: 1, im: 0 }; z.forEach((zj, j) => { if (j !== i) { const df = { re: zi.re - zj.re, im: zi.im - zj.im }; den = { re: den.re * df.re - den.im * df.im, im: den.re * df.im + den.im * df.re }; } }); const p = P(zi); const q = den.re * den.re + den.im * den.im; return { re: zi.re - (p.re * den.re + p.im * den.im) / q, im: zi.im - (p.im * den.re - p.re * den.im) / q }; });
    return z;
  };
  for (let i = 0; i <= 600; i++) {
    const K = 10 ** (-4 + (i / 600) * 6.3);
    const r = roots3(K).sort((a, b) => a.re - b.re);
    A.push(r[0]);
    const [u, v] = [r[1], r[2]];
    if (Math.abs(u.im) > 1e-6) { const up = u.im > 0 ? u : v, lo = u.im > 0 ? v : u; B.push(up); C.push(lo); } else { B.push(u.re > v.re ? u : v); C.push(u.re > v.re ? v : u); }
  }
  const inBox = (p) => p.re >= -24 && p.re <= 4 && Math.abs(p.im) <= 9;
  for (const br of [A, B, C]) o += path(d(br.filter(inBox).map((p) => [sx(p.re), sy(p.im)])), 'ln');
  for (const p of [0, -2, -20]) o += line(sx(p) - 5, sy(0) - 5, sx(p) + 5, sy(0) + 5, 'ink-b') + line(sx(p) - 5, sy(0) + 5, sx(p) + 5, sy(0) - 5, 'ink-b');
  // marks
  const w44 = Math.sqrt(40);
  o += circle(sx(0), sy(w44), 4.5, 'ink-f') + circle(sx(0), sy(-w44), 4.5, 'ink-f') + text(sx(0) + 8, sy(w44) + 8, '±j6.32', 'tb') + text(sx(0) + 8, sy(w44) + 24, 'K = 44', 'tb');
  o += circle(sx(-10 / 11), sy(1.5746), 4.5, 'paper') + text(sx(-23.5), sy(-5), '空心圆：ζ = 0.5 的点，K = 3.34', 't');
  o += circle(sx(-0.974), sy(0), 3.5, 'ink-f') + text(sx(-0.974) - 8, sy(0) - 10, 'breakaway −0.97', 'ts', 'end');
  o += circle(sx(c), sy(0), 3.5, 'ink-f') + text(sx(c) - 6, sy(0) - 8, 'centroid −7.33', 'ts', 'end');
  o += text(sx(-3.4), sy(7.9), 'asymptote 60°', 'ts', 'end');
  o += text(sx(-23.5), sy(2), '第三个 pole 沿', 'ts') + text(sx(-23.5), sy(2) + 16, 'real axis 往左', 'ts');
  o += text(sx(1.5), sy(-3.2), 'K > 44：', 'ts') + text(sx(1.5), sy(-3.2) + 16, '进入 RHP', 'ts');
  return svg(560, 345, o, 'L(s) 等于 20 除以 s(s+2)(s+20) 的 root locus：两个 branch 从 0 和 −2 出发，在 −0.97 相遇后沿 asymptote 方向弯向右上和右下，K 等于 44 时穿过 imaginary axis；第三个 branch 从 −20 沿 real axis 往左');
}

// 7. Angle condition：在想要的 pole 位置上数 angle
function angle() {
  const sx = lin(-9.6, 1, 40, 530), sy = lin(-0.6, 5.2, 250, 30);
  const P = [-2.5, 5 * Math.sqrt(3) / 2];
  let o = line(sx(-9.6), sy(0), sx(1), sy(0), 'axis');
  o += line(sx(0), sy(0), sx(-5.2 / Math.tan(Math.PI / 3)), sy(5.2), 'grid');
  const items = [[0, 'p', '120.0°'], [-2, 'p', '96.6°'], [-2.5, 'z', '90.0°'], [-7.75, 'p', '39.5°']];
  for (const [x, kind] of items) o += line(sx(x), sy(0), sx(P[0]), sy(P[1]), kind === 'z' ? 'ln' : 'ink');
  // −20 的 vector：从左边界进来
  const sl = P[1] / (P[0] + 20);
  o += line(sx(-9.6), sy(P[1] - sl * (P[0] + 9.6)), sx(P[0]), sy(P[1]), 'mute');
  o += text(sx(-9.5), sy(P[1] - sl * (P[0] + 9.6)) + 18, '来自 −20：13.9°', 'ts');
  for (const [x, kind] of items) {
    if (kind === 'z') o += circle(sx(x), sy(0), 5, 'paper ln');
    else o += line(sx(x) - 5, sy(0) - 5, sx(x) + 5, sy(0) + 5, 'ink-b') + line(sx(x) - 5, sy(0) + 5, sx(x) + 5, sy(0) - 5, 'ink-b');
  }
  o += circle(sx(P[0]), sy(P[1]), 5, 'ln-f') + text(sx(P[0]) + 10, sy(P[1]) - 4, it('s') + '* = −2.5 + j4.33', 'tl');
  o += text(sx(0), sy(0) + 20, '0', 'ts', 'middle') + text(sx(-2) + 6, sy(0) + 20, '−2', 'ts', 'start') + text(sx(-2.5) - 4, sy(0) + 20, '−2.5', 'tl', 'end') + text(sx(-7.75), sy(0) + 20, '−7.75', 'ts', 'middle');
  o += text(sx(-0.6), sy(1.2), '120.0°', 'ts') + text(sx(-1.5), sy(2.6), '96.6°', 'ts') + text(sx(-2.62), sy(1.2), '90°', 'tl', 'end') + text(sx(-5.6), sy(2.6), '39.5°', 'ts', 'end');
  o += text(285, 290, 'Zero 的 angle 减去各个 pole 的 angle：90 − 120 − 96.6 − 13.9 − 39.5 = −180°', 'ts', 'middle');
  return svg(560, 300, o, '从每个 open-loop pole 和 zero 向想要的 closed-loop pole 位置画 vector，量出各自的 angle；加上 lead 的 zero 和 pole 之后，angle 之和正好是负 180 度');
}

// 8. Nyquist plot：K = 20 与 K = 60
function nyquist() {
  let o = '';
  const Lc = (w, K) => {
    // L(jw) = 20K / (jw (jw+2)(jw+20))
    const re1 = 0, im1 = w; // jw
    const m = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    const den = m(m([re1, im1], [2, w]), [20, w]);
    const q = den[0] ** 2 + den[1] ** 2;
    return [(20 * K * den[0]) / q, (-20 * K * den[1]) / q];
  };
  const panel = (x0, K, title, note) => {
    const sx = lin(-3, 1, x0, x0 + 240), sy = lin(-3, 3, 270, 30);
    o += rect(x0, 30, 240, 240, 'frame');
    o += line(x0, sy(0), x0 + 240, sy(0), 'grid') + line(sx(0), 30, sx(0), 270, 'grid');
    const pts = [], neg = [];
    for (let i = 0; i <= 900; i++) {
      const w = 10 ** (-1.5 + (i / 900) * 4);
      const [re, im] = Lc(w, K);
      if (re >= -3 && re <= 1 && im >= -3 && im <= 3) { pts.push([sx(re), sy(im)]); neg.push([sx(re), sy(-im)]); }
    }
    o += path(d(pts), 'ln') + path(d(neg), 'ln-dash');
    o += circle(sx(-1), sy(0), 4, 'ink-f') + text(sx(-1), sy(0) - 22, '−1', 'tb', 'middle');
    const xc = -K / 44;
    o += circle(sx(xc), sy(0), 3.5, 'paper ln') + text(sx(xc) + (K < 44 ? 4 : -4), sy(0) + (K < 44 ? 17 : 28), xc.toFixed(2).replace('-', '−'), 'tl', K < 44 ? 'start' : 'end');
    o += text(x0 + 120, 20, title, 'tb', 'middle');
    o += text(x0 + 120, 290, note, 'ts', 'middle');
    // 箭头：ω 增大的方向（实线上）
    const [w1, w2] = K < 44 ? [3.2, 3.9] : [8, 10];
    const a1 = Lc(w1, K), a2 = Lc(w2, K);
    o += arrow(sx(a1[0]), sy(a1[1]), sx(a2[0]), sy(a2[1]), 'ln') + arrow(sx(a2[0]), sy(-a2[1]), sx(a1[0]), sy(-a1[1]), 'ln');
  };
  panel(30, 20, 'K = 20：不包围 −1', 'crossing 在 −0.45，GM = 2.2');
  panel(290, 60, 'K = 60：clockwise 包围 −1 两圈', 'crossing 在 −1.36，Z = N + P = 2');
  o += text(280, 312, '实线是 ω 从 0⁺ 到 ∞，虚线是它的 mirror image（ω < 0）；ω → 0 时 curve 往下、往上跑向无穷远，', 'ts', 'middle');
  o += text(280, 328, '由 origin 处的 indentation 对应的右半边无穷大 semicircle 接上（图外）', 'ts', 'middle');
  return svg(560, 338, o, '真实 motor 的 loop transfer function 的 Nyquist plot：K 等于 20 时 curve 在 −0.45 处穿过 negative real axis，不包围 −1；K 等于 60 时在 −1.36 处穿过，clockwise 包围 −1 两圈');
}

// 9. Phase margin 与 overshoot
function pm() {
  let o = '';
  const zs = []; for (let i = 0; i <= 160; i++) zs.push(0.05 + (0.85 * i) / 160);
  const PM = (z) => (Math.atan((2 * z) / Math.sqrt(Math.sqrt(1 + 4 * z ** 4) - 2 * z * z)) * 180) / Math.PI;
  const MP = (z) => 100 * Math.exp((-Math.PI * z) / Math.sqrt(1 - z * z));
  // 左：PM vs ζ
  {
    const sx = lin(0, 0.9, 55, 245), sy = lin(0, 80, 230, 30);
    o += axes({ sx, sy, x0: 0, x1: 0.9, y0: 0, y1: 80, xt: [0, 0.3, 0.6, 0.9], yt: [20, 40, 60, 80], grid: true });
    o += path(d(zs.map((z) => [sx(z), sy(PM(z))])), 'ln') + path(d([[sx(0), sy(0)], [sx(0.8), sy(80)]]), 'dash');
    o += text(sx(0.42), sy(30), 'PM = 100ζ', 'ts') + text(sx(0.03), sy(71), 'second-order loop', 'tl');
    o += text(sx(0.9), 262, 'ζ', 'ts', 'end') + text(55, 18, 'phase margin（°）', 'ts');
  }
  // 右：Mp vs PM，加上本页几个 design 的实算点
  {
    const sx = lin(0, 80, 320, 540), sy = lin(0, 80, 230, 30);
    o += axes({ sx, sy, x0: 0, x1: 80, y0: 0, y1: 80, xt: [0, 20, 40, 60, 80], yt: [20, 40, 60, 80], grid: true });
    o += path(d(zs.map((z) => [sx(PM(z)), sy(MP(z))])), 'ln');
    const pts = [[13.6, 68.2], [51.6, 16.2], [48.0, 20.8], [47.1, 22.6], [50.0, 18.6], [49.4, 19.7]];
    for (const [a, b] of pts) o += circle(sx(a), sy(b), 4, 'ink-f');
    o += text(sx(13.6) + 8, sy(68.2) + 4, 'P，K = 20', 'ts');
    o += text(sx(54), sy(36), '其余五个 design', 'ts') + text(sx(54), sy(36) + 15, '挤在这里', 'ts');
    o += text(sx(80), 262, 'phase margin（°）', 'ts', 'end') + text(320, 18, 'overshoot（%）', 'ts');
  }
  return svg(560, 272, o, '左图：second-order loop 的 phase margin 与 damping ratio 几乎成正比；右图：overshoot 与 phase margin 的关系 curve，以及本页真实 third-order plant 上几个 design 的实算点，都落在 curve 附近');
}

// 10. Bode：P（K = 20）与 Bode lead-lag design 的 loop
function bode() {
  const sx = logx(0.01, 100, 70, 530);
  const sm = lin(-60, 80, 160, 34), sp = lin(-270, -90, 320, 196);
  let o = '';
  for (const w of [0.01, 0.1, 1, 10, 100]) o += line(sx(w), 34, sx(w), 160, 'grid') + line(sx(w), 196, sx(w), 320, 'grid') + text(sx(w), 336, String(w), 'ts', 'middle');
  for (const m of [-40, 0, 40, 80]) o += line(70, sm(m), 530, sm(m), m === 0 ? 'axis' : 'grid') + text(64, sm(m) + 4, String(m).replace('-', '−'), 'ts', 'end');
  for (const p of [-270, -180, -90]) o += line(70, sp(p), 530, sp(p), p === -180 ? 'axis' : 'grid') + text(64, sp(p) + 4, String(p).replace('-', '−') + '°', 'ts', 'end');
  const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
  const ev = (num, den, w) => { const pv = (c) => c.reduce((acc, co) => { const r = cm(acc, [0, w]); return [r[0] + co, r[1]]; }, [0, 0]); const n = pv(num), dd = pv(den); const q = dd[0] ** 2 + dd[1] ** 2; return [(n[0] * dd[0] + n[1] * dd[1]) / q, (n[1] * dd[0] - n[0] * dd[1]) / q]; };
  const Lp = { num: [400], den: G0 };
  const Ln = { num: pmul([20 * 62.683], pmul([1, 2.214], [1, 0.1])), den: pmul(G0, pmul([1, 11.292], [1, 0.05])) };
  const series = (L, cls) => {
    const M = [], Ph = []; let prev = null, off = 0;
    for (let i = 0; i <= 500; i++) {
      const w = 10 ** (-2 + (i / 500) * 4); const [re, im] = ev(L.num, L.den, w);
      let ph = (Math.atan2(im, re) * 180) / Math.PI; if (prev !== null) { while (ph + off - prev > 180) off -= 360; while (ph + off - prev < -180) off += 360; }
      ph += off; if (prev === null && ph > 0) { off -= 360; ph -= 360; } prev = ph;
      const m = 20 * Math.log10(Math.hypot(re, im));
      if (m <= 80 && m >= -60) M.push([sx(w), sm(m)]); if (ph >= -270) Ph.push([sx(w), sp(ph)]);
    }
    o += path(d(M), cls) + path(d(Ph), cls);
  };
  series(Lp, 'ink'); series(Ln, 'ln');
  // crossover 标记
  o += line(sx(4.204), sm(0), sx(4.204), sp(-166.4), 'dash') + line(sx(5), sm(0), sx(5), sp(-130), 'ln-dash');
  o += line(sx(4.204) - 4, sp(-180), sx(4.204) - 4, sp(-166.4), 'ink-b') + line(sx(5) + 4, sp(-180), sx(5) + 4, sp(-130.6), 'ln');
  o += line(sx(0.013), sm(-22), sx(0.03), sm(-22), 'ink') + text(sx(0.033), sm(-22) + 4, 'P，K = 20', 't');
  o += line(sx(0.013), sm(-44), sx(0.03), sm(-44), 'ln') + text(sx(0.033), sm(-44) + 4, 'lead-lag', 'tl');
  o += text(sx(0.013), sp(-215), 'crossover 处的竖条是 PM：', 'ts') + text(sx(0.013), sp(-215) + 17, '黑 13.6°，彩 49.4°', 'ts');
  o += text(70, 24, 'magnitude（dB）', 'ts') + text(70, 188, 'phase', 'ts');
  o += text(530, 350, 'ω（rad/s）', 'ts', 'end');
  return svg(560, 356, o, 'P control（K 等于 20）与 lead-lag design 的 loop 的 Bode plot：两者低频 gain 相近，lead 在 crossover 附近把 phase 抬高，phase margin 从 13.6 度变成 49.4 度');
}

// 11. 几个 design 的 step response
function designs() {
  const sx = lin(0, 6, 60, 375), sy = lin(0, 1.4, 230, 25);
  let o = axes({ sx, sy, x0: 0, x1: 6, y0: 0, y1: 1.4, xt: [0, 1, 2, 3, 4, 5, 6], yt: [0.5, 1, 1.25], grid: true });
  o += line(sx(0), sy(1.02), sx(6), sy(1.02), 'dash') + line(sx(0), sy(0.98), sx(6), sy(0.98), 'dash');
  const closed = (Cn, Cd) => { const num = pmul([20], Cn), den = pmul(G0, Cd); return [num, padd(den, num)]; };
  const sets = [
    [[3.336], [1], 'mute', 'P，K = 3.34'],
    [pmul(pmul([30.875], [1, 2.5]), [1, 0.1]), pmul([1, 7.75], [1, 0.04]), 'ink', 'root locus lead-lag'],
    [pmul(pmul([62.683], [1, 2.214]), [1, 0.1]), pmul([1, 11.292], [1, 0.05]), 'ln', 'Bode lead-lag'],
  ];
  sets.forEach(([Cn, Cd, cls, lab], i) => { const [n, dd] = closed(Cn, Cd); o += path(plotPts(step(n, dd, 6, 6000), sx, sy, 6), cls); o += line(392, 60 + i * 24, 412, 60 + i * 24, cls) + text(418, 64 + i * 24, lab, cls === 'ln' ? 'tl' : 't'); });
  o += text(392, 150, '虚线：±2% band', 'ts') + text(392, 168, '1.25：overshoot 的上限', 'ts');
  o += text(sx(6), 262, 'time（s）', 'ts', 'end') + text(60, 16, 'θ（rad），真实 plant，unit step', 'ts');
  return svg(560, 272, o, '真实 plant 上三个 design 的 step response：P control 慢，两个 lead-lag design 快得多，overshoot 都在 25% 以内');
}

// 12. Load disturbance：P、lead-lag、PID
function dist() {
  const sx = lin(0, 10, 60, 375), sy = lin(-0.02, 0.36, 230, 25);
  let o = axes({ sx, sy, x0: 0, x1: 10, y0: -0.02, y1: 0.36, xt: [0, 2, 4, 6, 8, 10], yt: [0, 0.1, 0.2, 0.3], xAt: 0, grid: true });
  const sets = [
    [[3.336], [1], 'mute', 'P'],
    [pmul(pmul([30.875], [1, 2.5]), [1, 0.1]), pmul([1, 7.75], [1, 0.04]), 'ink', 'root locus lead-lag'],
    [[7.6, 38.4, 64], [1, 0], 'ln', 'PID'],
  ];
  sets.forEach(([Cn, Cd, cls, lab], i) => {
    const num = pmul([20], Cd), den = padd(pmul(G0, Cd), pmul([20], Cn));
    o += path(plotPts(step(num, den, 10, 5000), sx, sy, 5), cls);
    o += line(392, 60 + i * 24, 412, 60 + i * 24, cls) + text(418, 64 + i * 24, lab, cls === 'ln' ? 'tl' : 't');
  });
  o += text(392, 150, '最后的偏离：', 'ts') + text(392, 168, 'P 是 0.30', 'ts') + text(392, 186, 'lead-lag 是 0.040', 'ts') + text(392, 204, 'PID 是 0', 'ts');
  o += text(sx(10), 262, 'time（s）', 'ts', 'end') + text(60, 16, 'θ 的偏离（rad），plant input 上一个 unit step disturbance', 'ts');
  return svg(560, 272, o, 'Plant input 上加一个 step disturbance 后 position 的偏离：P control 留下 0.3 的 error，lead-lag 小一些但不为零，PID 把它拉回 0');
}

export default {
  'ee3331c-loop': loop,
  'ee3331c-sens': sens,
  'ee3331c-region': region,
  'ee3331c-pstep': pstep,
  'ee3331c-zero': zero,
  'ee3331c-rlocus': rlocus,
  'ee3331c-angle': angle,
  'ee3331c-nyquist': nyquist,
  'ee3331c-pm': pm,
  'ee3331c-bode': bode,
  'ee3331c-designs': designs,
  'ee3331c-dist': dist,
};
