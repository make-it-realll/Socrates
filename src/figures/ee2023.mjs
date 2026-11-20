import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const sinc = (x) => (Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));
const minus = (v) => String(v).replace('-', '−');

// 同一个 LTI system（h = e^{-t}u(t)）：rect pulse 进去形状变了，cos 进去还是同一个 frequency 的 cos
function eigen() {
  let o = '';
  const pulseOut = (t) => (t < 0 ? 0 : t <= 1 ? 1 - Math.exp(-t) : Math.exp(-(t - 1)) - Math.exp(-t));
  const row = (y0, t0, t1, ymin, ymax, drawIn, yout, inLab, outLab, note, xt) => {
    const sxL = lin(t0, t1, 36, 206), sxR = lin(t0, t1, 354, 524), sy = lin(ymin, ymax, y0 + 104, y0 + 24);
    for (const sx of [sxL, sxR]) {
      o += line(sx(t0), sy(0), sx(t1), sy(0), 'axis');
      for (const [v, s] of xt) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(ymin) + 14, s, 'ts', 'middle');
    }
    o += path(drawIn(sxL, sy), 'ink') + path(drawIn(sxR, sy), 'dash') + path(curve(yout, t0, t1, sxR, sy, 400), 'ln');
    o += rect(232, y0 + 40, 96, 48, 'paper', 6) + text(280, y0 + 60, 'LTI system', 'tb', 'middle') + text(280, y0 + 78, `${it('h')}(${it('t')}) = ${it('e')}⁻ᵗ${it('u')}(${it('t')})`, 'ts', 'middle');
    o += arrow(210, y0 + 64, 230, y0 + 64, 'ink') + arrow(330, y0 + 64, 350, y0 + 64, 'ink');
    o += text(36, y0 + 12, inLab, 'tb') + text(354, y0 + 12, outLab, 'tb');
    o += text(280, y0 + 136, note, 'ts', 'middle');
  };
  row(0, -1, 5, -0.25, 1.25,
    (sx, sy) => d([[sx(-1), sy(0)], [sx(0), sy(0)], [sx(0), sy(1)], [sx(1), sy(1)], [sx(1), sy(0)], [sx(5), sy(0)]]),
    pulseOut, 'Input：rect pulse', 'Output：形状变了', '虚线是 input，彩线是 output = input ∗ h，要算 convolution integral', [[0, '0'], [1, '1'], [3, '3']]);
  row(150, 0, 4 * Math.PI, -1.3, 1.3,
    (sx, sy) => curve(Math.cos, 0, 4 * Math.PI, sx, sy, 300),
    (t) => Math.SQRT1_2 * Math.cos(t - Math.PI / 4), 'Input：cos t', 'Output：0.707 cos(t − 45°)', '还是 cos，frequency 没变，只有 amplitude 和 phase 变了：这一行不用算 integral', [[Math.PI, 'π'], [2 * Math.PI, '2π'], [3 * Math.PI, '3π']]);
  return svg(560, 296, o, 'Rect pulse 通过 LTI system 后形状改变；cos t 通过同一个 system 后仍是同 frequency 的 cos，amplitude 乘 0.707，phase 落后 45 度');
}

// Convolution 的 flip and slide：x = [0,1] 上的 rect pulse，h = e^{-t}u(t)
function conv() {
  let o = '';
  const top = (x0, t, areaTxt) => {
    const sx = lin(-2.5, 3, x0, x0 + 230), sy = lin(0, 1.3, 118, 34);
    const hi = Math.min(t, 1);
    const hflip = (tau) => Math.exp(-(t - tau));
    o += path(area(hflip, 0, hi, sx, sy, 0, 80), 'wash-strong');
    o += line(sx(-2.5), sy(0), sx(3), sy(0), 'axis');
    for (const v of [0, 1]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), sy(0) + 16, String(v), 'ts', 'middle');
    o += text(sx(3), sy(0) + 16, it('τ'), 'ts', 'end');
    o += path(d([[sx(-2.5), sy(0)], [sx(0), sy(0)], [sx(0), sy(1)], [sx(1), sy(1)], [sx(1), sy(0)], [sx(3), sy(0)]]), 'ink');
    o += path(curve(hflip, -2.5, t, sx, sy, 200), 'ln') + line(sx(t), sy(1), sx(t), sy(0), 'ln');
    o += line(sx(t), sy(0), sx(t), sy(0) + 4, 'axis') + text(sx(t), sy(0) + 30, `τ = t = ${t}`, 'tl', 'middle');
    o += text(sx(1) + 6, sy(1) - 6, `${it('x')}(${it('τ')})`, 't');
    o += text(sx(-2.4), sy(0.42), `${it('h')}(${it('t')} − ${it('τ')})`, 'tl');
    o += text(x0 + 115, 20, areaTxt, 'tb', 'middle');
  };
  top(30, 0.5, 't = 0.5：阴影 area = 0.393');
  top(300, 2, 't = 2：阴影 area = 0.233');
  const sx = lin(-1, 5, 60, 520), sy = lin(0, 0.75, 268, 186);
  const y = (t) => (t < 0 ? 0 : t <= 1 ? 1 - Math.exp(-t) : Math.exp(-(t - 1)) - Math.exp(-t));
  o += axes({ sx, sy, x0: -1, x1: 5, y0: 0, y1: 0.75, xt: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4']], yt: [[0.632, '0.632']], xl: 't', yAt: 0 });
  o += line(sx(0), sy(0.632), sx(1), sy(0.632), 'grid') + path(curve(y, -1, 5, sx, sy, 400), 'ln');
  o += circle(sx(0.5), sy(y(0.5)), 4.5, 'ink-f') + text(sx(0.5) + 10, sy(y(0.5)) + 24, '(0.5, 0.393)', 't');
  o += circle(sx(2), sy(y(2)), 4.5, 'ink-f') + text(sx(2) + 9, sy(y(2)) - 6, '(2, 0.233)', 't');
  o += text(520, sy(0.66), `${it('y')}(${it('t')}) = (${it('x')} ∗ ${it('h')})(${it('t')})：每个 ${it('t')} 是上面的一块 area`, 'ts', 'end');
  return svg(560, 306, o, 'Convolution 的 flip and slide：把 h 翻转后滑到 t，与 x 重叠部分的乘积的 area 就是 y(t)；t 等于 0.5 时 area 是 0.393，t 等于 2 时是 0.233');
}

// Square wave 的 Fourier series partial sum：N = 1, 3, 9, 49
function partial() {
  let o = '';
  const SN = (N) => (t) => {
    let s = 0.5;
    for (let k = 1; k <= N; k += 2) s += (2 * Math.sin((Math.PI * k) / 2)) / (Math.PI * k) * Math.cos(2 * Math.PI * k * t);
    return s;
  };
  const panel = (x0, y0, N, title) => {
    const sx = lin(-0.6, 0.6, x0, x0 + 235), sy = lin(-0.3, 1.3, y0 + 112, y0 + 22);
    o += line(sx(-0.6), sy(0), sx(0.6), sy(0), 'axis') + line(sx(-0.6), sy(1), sx(0.6), sy(1), 'grid');
    o += path(d([[sx(-0.6), sy(0)], [sx(-0.25), sy(0)], [sx(-0.25), sy(1)], [sx(0.25), sy(1)], [sx(0.25), sy(0)], [sx(0.6), sy(0)]]), 'dash');
    o += path(curve(SN(N), -0.6, 0.6, sx, sy, 900), 'ln');
    for (const [v, s] of [[-0.25, '−¼'], [0.25, '¼']]) o += line(sx(v), sy(0), sx(v), sy(0) + 4, 'axis') + text(sx(v), y0 + 126, s, 'ts', 'middle');
    o += text(x0 - 5, sy(1) + 4, '1', 'ts', 'end') + text(x0 - 5, sy(0) + 4, '0', 'ts', 'end');
    o += text(x0, y0 + 12, title, 'tb');
  };
  panel(30, 0, 1, 'N = 1：只有 DC 和 1 Hz');
  panel(305, 0, 3, 'N = 3：加上 3 Hz');
  panel(30, 140, 9, 'N = 9：peak 1.091');
  panel(305, 140, 49, 'N = 49：peak 1.090，更靠近 jump');
  o += text(280, 290, '虚线是 square wave，彩线是只留 |k| ≤ N 的 partial sum', 'ts', 'middle');
  return svg(560, 300, o, 'Square wave 的 Fourier series partial sum，N 等于 1、3、9、49；项数越多越贴合，但 jump 附近始终有约 9% 的 overshoot');
}

// Period 变长时，T0·c_k 是同一条 envelope ½sinc(f/2) 上越来越密的 sample
function ftlimit() {
  const fx = lin(-6.6, 6.6, 50, 530);
  const env = (f) => 0.5 * sinc(f / 2);
  let o = '';
  [[1, 'T₀ = 1 s：每隔 1 Hz 一根 line'], [2, 'T₀ = 2 s：每隔 ½ Hz 一根'], [4, 'T₀ = 4 s：每隔 ¼ Hz 一根']].forEach(([T0, title], r) => {
    const yb = 96 + r * 94, fy = lin(-0.14, 0.56, yb, yb - 66);
    o += line(fx(-6.6), fy(0), fx(6.6), fy(0), 'axis') + path(curve(env, -6.6, 6.6, fx, fy, 400), 'dash');
    for (let k = -Math.floor(6.5 * T0); k <= 6.5 * T0; k++) {
      const f = k / T0;
      o += line(fx(f), fy(0), fx(f), fy(env(f)), 'ln') + circle(fx(f), fy(env(f)), 2.6, 'ln-f');
    }
    for (const v of [-6, -4, -2, 2, 4, 6]) o += line(fx(v), fy(0), fx(v), fy(0) + 4, 'axis') + (r === 2 ? text(fx(v), fy(0) + 17, minus(v), 'ts', 'middle') : '');
    o += text(50, yb - 72, title, 'tb');
    if (r === 0) o += text(fx(0.5), fy(0.5) + 2, '½', 'ts');
  });
  o += text(530, 318, 'f（Hz）', 'ts', 'end');
  o += text(50, 318, `圆点是 ${it('T')}₀·${it('c')}ₖ，虚线是 envelope ½ sinc(${it('f')} / 2)`, 'ts');
  return svg(560, 328, o, 'Pulse 宽度固定为二分之一秒，period 取 1、2、4 秒时，T0 乘以 Fourier series coefficient 都落在同一条 sinc envelope 上，period 越长 sample 越密');
}

// rect ↔ sinc：pulse 宽 1/2 秒 ↔ main lobe 的 zero 在 ±2 Hz
function rectsinc() {
  const tx = lin(-1, 1, 40, 250), ty = lin(-0.3, 1.25, 170, 30);
  let o = axes({ sx: tx, sy: ty, x0: -1, x1: 1, y0: -0.3, y1: 1.25, xt: [[-0.25, '−¼'], [0.25, '¼']], xl: 't（s）', xAt: 0, yAt: 0 });
  o += path(d([[tx(-1), ty(0)], [tx(-0.25), ty(0)], [tx(-0.25), ty(1)], [tx(0.25), ty(1)], [tx(0.25), ty(0)], [tx(1), ty(0)]]), 'ln');
  o += text(145, 20, 'rect(2t)：width ½ s', 'tb', 'middle') + text(tx(0.25) + 8, ty(1) + 4, 'height 1', 'ts');
  const fx = lin(-7, 7, 310, 540), fy = lin(-0.15, 0.625, 170, 30);
  o += axes({ sx: fx, sy: fy, x0: -7, x1: 7, y0: -0.15, y1: 0.625, xt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], xl: 'f（Hz）', xAt: 0, yAt: 0 });
  o += path(area((f) => 0.5 * sinc(f / 2), -2, 2, fx, fy), 'wash') + path(curve((f) => 0.5 * sinc(f / 2), -7, 7, fx, fy), 'ln');
  o += text(425, 20, '½ sinc(f / 2)：zero 在 ±2, ±4, …', 'tb', 'middle') + text(fx(0.9), fy(0.5) + 4, 'peak ½', 'ts');
  o += arrow(262, 100, 298, 100, 'ink') + arrow(298, 100, 262, 100, 'ink');
  o += text(280, 205, 'Width 为 T 的 pulse，第一个 zero 在 1 / T。阴影是 main lobe，占 energy 的 90%。', 'ts', 'middle');
  return svg(560, 215, o, 'Width 二分之一秒的 rect pulse，Fourier transform 是 sinc，第一个 zero 在正负 2 Hz');
}

// 第 3 题的 system：input 在 t = 0 才接上时，complete response 与 steady state
function sss() {
  const sx = lin(0, 14, 56, 530), sy = lin(-1, 13, 250, 62);
  const full = (t) => 6 - 1.5 * Math.exp(-t) - Math.exp(-2 * t) - 3.5 * Math.cos(t) + 4.5 * Math.sin(t);
  const ss = (t) => 6 - 3.5 * Math.cos(t) + 4.5 * Math.sin(t);
  let o = axes({ sx, sy, x0: 0, x1: 14, y0: -1, y1: 13, xt: [2, 4, 6, 8, 10, 12], yt: [[0, '0'], [6, '6'], [11.7, '11.7']], xl: 't（s）', xAt: 0 });
  o += line(sx(0), sy(6), sx(14), sy(6), 'grid') + line(sx(0), sy(11.7), sx(14), sy(11.7), 'grid');
  o += path(curve(ss, 0, 14, sx, sy, 400), 'dash') + path(curve(full, 0, 14, sx, sy, 400), 'ln');
  o += line(56, 18, 86, 18, 'ln') + text(92, 22, 'complete response = steady state − 1.5e⁻ᵗ − e⁻²ᵗ', 'tl');
  o += line(56, 38, 86, 38, 'dash') + text(92, 42, 'steady state = 6 + 5.70 sin(t − 37.9°)', 't');
  return svg(560, 276, o, 'Input 在 t 等于 0 接上时，complete response 从 0 出发，几秒之内 transient 消失，之后与 steady state 重合');
}

// Pole–zero plot：H(s) = (s−4)(s+20) / [ s (s²+10s+100)(s+3) ]
function pz() {
  const sx = lin(-23, 7, 40, 420), sy = lin(-11, 11, 250, 20);
  let o = rect(sx(-23), sy(11), sx(0) - sx(-23), sy(-11) - sy(11), 'wash');
  o += axes({ sx, sy, x0: -23, x1: 7, y0: -11, y1: 11, xt: [[-20, '−20'], [-10, '−10'], [-5, '−5'], [4, '4']], yt: [[8.66, 'j8.66'], [-8.66, '−j8.66']], xAt: 0, yAt: 0 });
  const X = (x, y) => line(sx(x) - 5, sy(y) - 5, sx(x) + 5, sy(y) + 5, 'ink-b') + line(sx(x) - 5, sy(y) + 5, sx(x) + 5, sy(y) - 5, 'ink-b');
  o += X(0, 0) + X(-3, 0) + X(-5, 8.66) + X(-5, -8.66);
  o += circle(sx(4), sy(0), 5.5, 'ln paper-f') + circle(sx(-20), sy(0), 5.5, 'ln paper-f');
  o += text(sx(7) - 2, sy(0) - 8, 'Re', 'ts', 'end') + text(sx(0) + 6, sy(11) + 10, 'Im', 'ts');
  o += text(sx(-22), sy(10) + 4, 'left half-plane：pole 在这里，mode 才 decay', 'ts');
  o += text(436, 60, '× pole', 'tb') + text(436, 80, '0，−3，−5 ± j8.66', 'ts');
  o += text(436, 118, '○ zero', 'tl') + text(436, 138, '4，−20', 'ts');
  o += text(436, 180, 'Origin 上有 pole：', 't') + text(436, 198, '不是 BIBO stable。', 't');
  o += text(436, 226, 'Right half-plane 的', 'ts') + text(436, 242, 'zero 不影响 stability。', 'ts');
  return svg(560, 270, o, 'Pole–zero plot：pole 在 0、负 3、负 5 加减 j8.66；zero 在 4 和负 20；origin 处的 pole 使 system 不是 BIBO stable');
}

// Second-order system：pole 的位置（左）与 step response（右），ωn = 1
function zeta() {
  const zs = [[0.2, 'ln', 'ζ = 0.2'], [0.5, 'ink', 'ζ = 0.5'], [1, 'dash', 'ζ = 1'], [2, 'mute', 'ζ = 2']];
  const px = lin(-2.2, 0.5, 30, 210), py = lin(-1.35, 1.35, 222, 42);
  let o = rect(px(-2.2), py(1.35), px(0) - px(-2.2), py(-1.35) - py(1.35), 'wash');
  o += line(px(-2.2), py(0), px(0.5), py(0), 'axis') + line(px(0), py(-1.35), px(0), py(1.35), 'axis');
  const arc = [];
  for (let i = 0; i <= 60; i++) { const a = Math.PI / 2 + (Math.PI * i) / 60; arc.push([px(Math.cos(a)), py(Math.sin(a))]); }
  o += path(d(arc), 'grid');
  const X = (x, y, cls) => line(px(x) - 4.5, py(y) - 4.5, px(x) + 4.5, py(y) + 4.5, cls) + line(px(x) - 4.5, py(y) + 4.5, px(x) + 4.5, py(y) - 4.5, cls);
  // ζ = 0.2, 0.5：共轭复 pole；ζ = 1：重 pole；ζ = 2：两个实 pole（快的那个在图外）
  for (const z of [0.2, 0.5]) { const wd = Math.sqrt(1 - z * z); o += X(-z, wd, 'ink-b') + X(-z, -wd, 'ink-b'); }
  o += X(-1, 0, 'ink-b') + X(-2 + Math.sqrt(3), 0, 'ink-b');
  o += text(px(-0.2) - 9, py(0.98) - 6, '0.2', 'tl', 'end') + text(px(-0.5) - 9, py(0.866) - 4, '0.5', 'tb', 'end');
  o += text(px(-1), py(0) - 10, 'ζ = 1', 'ts', 'middle') + text(px(-1), py(0) + 20, '（double）', 'ts', 'middle');
  o += text(px(-0.268) - 2, py(0) + 20, '2', 'ts', 'middle');
  o += arrow(px(-1.75), py(-0.42), px(-2.15), py(-0.42), 'mute') + text(px(-1.7), py(-0.42) + 4, 'ζ = 2 的另一个', 'ts') + text(px(-1.7), py(-0.42) + 18, 'pole 在 −3.73', 'ts');
  o += text(px(0.5), py(0) - 6, 'Re', 'ts', 'end') + text(px(0) + 5, py(1.35) + 10, 'Im', 'ts');
  o += text(px(-2.15), py(1.35) + 12, '|s| = ωₙ 的半圆', 'ts');
  o += text(120, 26, 'Pole 的位置（ωₙ = 1）', 'tb', 'middle');
  const sx = lin(0, 13, 262, 536), sy = lin(0, 1.65, 222, 42);
  const step = (z) => (t) => {
    if (z < 1) { const wd = Math.sqrt(1 - z * z); return 1 - Math.exp(-z * t) * (Math.cos(wd * t) + (z / wd) * Math.sin(wd * t)); }
    if (z === 1) return 1 - (1 + t) * Math.exp(-t);
    const r = Math.sqrt(z * z - 1), s1 = -z + r, s2 = -z - r;
    return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
  };
  o += axes({ sx, sy, x0: 0, x1: 13, y0: 0, y1: 1.65, xt: [2, 4, 6, 8, 10, 12], yt: [[1, '1']], xl: 'ωₙt' });
  o += line(sx(0), sy(1), sx(13), sy(1), 'grid');
  for (const [z, cls] of zs) o += path(curve(step(z), 0, 13, sx, sy), cls);
  zs.forEach(([z, cls, lab], i) => {
    const y = sy(0.56) + i * 17, note = ['overshoot 53%', 'overshoot 16%', '没有 overshoot', '没有，但慢'][i];
    o += line(372, y - 4, 394, y - 4, cls) + text(401, y, `${lab}：${note}`, 't');
  });
  o += text(399, 26, 'Step response', 'tb', 'middle');
  return svg(560, 258, o, '左边是 damping ratio 取 0.2、0.5、1、2 时 pole 在 s-plane 上的位置，右边是对应的 step response：pole 越靠近 imaginary axis，oscillation 越久');
}

// Bode plot：H(s) = 40000 s / [ (s+1)(s²+40s+2000) ]
function bode() {
  const wn = Math.sqrt(2000);
  const sx = logx(0.01, 10000, 60, 540);
  const my = lin(-80, 40, 184, 34), py = lin(-180, 90, 338, 224);
  const mag = (w) => 20 * Math.log10((40000 * w) / (Math.hypot(1, w) * Math.hypot(2000 - w * w, 40 * w)));
  const ph = (w) => 90 - (Math.atan(w) * 180) / Math.PI - (Math.atan2(40 * w, 2000 - w * w) * 180) / Math.PI;
  const asym = (w) => (w < 1 ? 20 * Math.log10(20 * w) : w < wn ? 20 * Math.log10(20) : 20 * Math.log10(20) - 40 * Math.log10(w / wn));
  const xt = [0.01, 0.1, 1, 10, 100, 1000, 10000].map((v) => [v, String(v)]);
  let o = '';
  for (const [v] of xt) o += line(sx(v), my(-80), sx(v), my(40), 'grid') + line(sx(v), py(-180), sx(v), py(90), 'grid');
  for (const v of [-80, -40, 0, 40]) o += line(60, my(v), 540, my(v), 'grid') + text(54, my(v) + 4, minus(v), 'ts', 'end');
  for (const v of [-180, -90, 0, 90]) o += line(60, py(v), 540, py(v), 'grid') + text(54, py(v) + 4, minus(v) + '°', 'ts', 'end');
  for (const [v, s] of xt) o += text(sx(v), 354, s, 'ts', 'middle');
  const lg = (fn, sy, cls) => {
    const pts = [];
    for (let i = 0; i <= 300; i++) { const w = 10 ** (-2 + (6 * i) / 300); pts.push([sx(w), sy(fn(w))]); }
    return path(d(pts), cls);
  };
  o += line(sx(1), my(-80), sx(1), my(40), 'mute') + line(sx(wn), my(-80), sx(wn), my(40), 'mute');
  o += lg(asym, my, 'dash') + lg(mag, my, 'ln') + lg(ph, py, 'ln');
  o += text(sx(1) + 4, my(-70), 'ω = 1', 'ts') + text(sx(wn) + 4, my(-70), 'ω = √2000 ≈ 44.7', 'ts');
  o += text(sx(0.09), my(-20), '+20 dB/dec', 't') + text(sx(6.5), my(-6), 'flat：26 dB', 't', 'middle') + text(sx(500), my(2), '−40 dB/dec', 't');
  o += text(sx(1) - 5, my(34), '比 asymptote 低 3 dB', 'ts', 'end') + text(sx(wn) + 8, my(31), 'peak 28.0 dB（ω ≈ 35）', 'ts');
  o += text(60, 18, '|H(jω)|（dB）  虚线是 asymptote', 'tb') + text(60, 212, '∠H(jω)', 'tb') + text(540, 372, 'ω（rad/s，log scale）', 'ts', 'end');
  return svg(560, 380, o, 'Bode plot：magnitude 先以每 decade 20 dB 上升，在 1 到 44.7 之间持平于 26 dB，之后以每 decade 40 dB 下降；phase 从 90 度降到负 180 度');
}

// 6 kHz 和 4 kHz 的 cos，以 10 kHz sampling 时 sample 完全相同
function samples() {
  const sx = lin(0, 1, 50, 530), sy = lin(-1.3, 1.3, 190, 44);
  const hi = (t) => Math.cos(2 * Math.PI * 6 * t), lo = (t) => Math.cos(2 * Math.PI * 4 * t);
  let o = line(sx(0), sy(0), sx(1), sy(0), 'axis');
  for (let n = 0; n <= 10; n++) o += line(sx(n / 10), sy(-1.3), sx(n / 10), sy(1.3), 'grid') + text(sx(n / 10), 206, (n / 10).toFixed(1), 'ts', 'middle');
  o += path(curve(hi, 0, 1, sx, sy, 600), 'mute') + path(curve(lo, 0, 1, sx, sy, 600), 'ln');
  for (let n = 0; n <= 10; n++) o += circle(sx(n / 10), sy(lo(n / 10)), 4.5, 'ink-f');
  o += line(50, 20, 80, 20, 'mute') + text(86, 24, 'cos(2π · 6000t)', 't') + line(220, 20, 250, 20, 'ln') + text(256, 24, 'cos(2π · 4000t)', 'tl');
  o += circle(400, 20, 4.5, 'ink-f') + text(410, 24, '每 0.1 ms 一个 sample', 't');
  o += text(530, 224, 't（ms）', 'ts', 'end');
  return svg(560, 232, o, '6 kHz 和 4 kHz 两个 cos 在每 0.1 毫秒一次的 sampling instant 上取值完全相同');
}

// Sampling 在 frequency domain：X(f) = 10cos(πf/8)，|f| ≤ 4；fs = 10 不 overlap，fs = 6 overlap
function alias() {
  const fx = lin(-17, 17, 40, 540);
  const X = (f) => (Math.abs(f) <= 4 ? 10 * Math.cos((Math.PI * f) / 8) : 0);
  let o = '';
  const panel = (yb, ymax, title, ticks, draw) => {
    const fy = lin(0, ymax * 1.12, yb, yb - 74);
    o += draw(fy);
    o += axes({ sx: fx, sy: fy, x0: -17, x1: 17, y0: 0, y1: ymax * 1.12, xt: ticks, yAt: 0 });
    o += text(40, yb - 82, title, 'tb');
  };
  panel(104, 10, 'X(f)：bandwidth 4 Hz，peak 10', [[-4, '−4'], [4, '4']], (fy) => path(area(X, -17, 17, fx, fy, 0, 680), 'wash') + path(curve(X, -17, 17, fx, fy, 680), 'ln') + text(fx(0) + 6, fy(10) - 4, '10', 'ts'));
  panel(222, 100, 'fₛ = 10 Hz：replica 之间留有 2 Hz 的空隙', [[-10, '−10'], [-6, '−6'], [-4, '−4'], [4, '4'], [6, '6'], [10, '10']], (fy) => {
    const Xs = (f) => 10 * (X(f + 20) + X(f + 10) + X(f) + X(f - 10) + X(f - 20));
    return path(area(Xs, -17, 17, fx, fy, 0, 680), 'wash') + path(curve(Xs, -17, 17, fx, fy, 680), 'ln') + text(fx(0) + 6, fy(100) - 4, '100', 'ts');
  });
  panel(340, 60, 'fₛ = 6 Hz：replica 叠在一起，f = 3 处 23.0 + 23.0 = 45.9', [[-6, '−6'], [-4, '−4'], [-2, '−2'], [2, '2'], [4, '4'], [6, '6']], (fy) => {
    const Xs = (f) => { let s = 0; for (let k = -4; k <= 4; k++) s += X(f - 6 * k); return 6 * s; };
    let s = '';
    for (const c of [-15, -9, -3, 3, 9, 15]) s += rect(fx(c - 1), fy(60 * 1.12), fx(c + 1) - fx(c - 1), fy(0) - fy(60 * 1.12), 'wash2');
    for (let k = -3; k <= 3; k++) s += path(curve((f) => 6 * X(f - 6 * k), Math.max(6 * k - 4, -17), Math.min(6 * k + 4, 17), fx, fy, 80), 'dash');
    s += path(curve(Xs, -17, 17, fx, fy, 680), 'ln');
    s += circle(fx(3), fy(Xs(3)), 3.5, 'ink-f') + circle(fx(3), fy(6 * X(3)), 3.5, 'ink-f');
    return s;
  });
  o += text(540, 372, 'f（Hz）', 'ts', 'end') + text(40, 372, '第三行：虚线是各个 replica，彩线是它们的和，灰色是 overlap 的 band', 'ts');
  return svg(560, 380, o, '原 spectrum 占正负 4 Hz；以 10 Hz sampling 时 replica 互不 overlap；以 6 Hz sampling 时相邻 replica 在 2 到 4 Hz 之间叠加，f 等于 3 处的值从 23.0 变成 45.9');
}

// Modulation：乘以 cos(2π·15t) 把 spectrum 搬到 ±15，height 减半
function modulation() {
  const fx = lin(-22, 22, 40, 540);
  const X = (f) => (Math.abs(f) <= 4 ? 10 * Math.cos((Math.PI * f) / 8) : 0);
  let o = '';
  const panel = (yb, fn, ymax, title, ticks, peaks) => {
    const fy = lin(0, 11.5, yb, yb - 78);
    o += axes({ sx: fx, sy: fy, x0: -22, x1: 22, y0: 0, y1: 11.5, xt: ticks, yAt: 0 });
    for (const c of peaks) o += c === 0 ? text(fx(0) + 7, fy(ymax) - 2, 'peak ' + ymax, 'ts') : text(fx(c), fy(ymax) - 6, 'peak ' + ymax, 'ts', 'middle');
    o += path(area(fn, -22, 22, fx, fy, 0, 440), 'wash') + path(curve(fn, -22, 22, fx, fy, 440), 'ln');
    o += text(40, yb - 86, title, 'tb');
  };
  panel(110, X, 10, 'X(f)：bandwidth 4 Hz', [[-4, '−4'], [4, '4']], [0]);
  panel(240, (f) => 0.5 * (X(f - 15) + X(f + 15)), 5, 'Y(f) = ½ [ X(f − 15) + X(f + 15) ]', [[-19, '−19'], [-15, '−15'], [-11, '−11'], [11, '11'], [15, '15'], [19, '19']], [-15, 15]);
  o += text(540, 276, 'f（Hz）', 'ts', 'end');
  return svg(560, 284, o, 'Baseband 的 spectrum 在 modulation 之后搬到正负 15 Hz 处，height 减半，占据 11 到 19 Hz');
}

// Bandpass sampling：fs = 19 恰好不 overlap，fs = 18 overlap
function sampling() {
  const fx = lin(-40, 40, 30, 540);
  let o = '';
  const panel = (yb, fs, title, clash) => {
    o += line(30, yb, 540, yb, 'axis') + text(30, yb - 58, title, 'tb');
    const band = (a, b, cls) => { const lo = Math.max(a, -40), hi = Math.min(b, 40); if (hi > lo) o += rect(fx(lo), yb - 36, fx(hi) - fx(lo), 36, cls); };
    for (let k = -4; k <= 4; k++) {
      band(11 + k * fs, 19 + k * fs, k === 0 ? 'solid' : 'band-p');
      band(-19 + k * fs, -11 + k * fs, k === 0 ? 'solid2' : 'band-n');
    }
    for (const [a, b] of clash) o += line(fx(a), yb - 42, fx(b), yb - 42, 'ink-b') + line(fx(a), yb - 46, fx(a), yb - 38, 'ink') + line(fx(b), yb - 46, fx(b), yb - 38, 'ink');
    for (const v of [-38, -19, -11, 0, 11, 19, 38]) o += line(fx(v), yb, fx(v), yb + 4, 'axis') + text(fx(v), yb + 17, minus(v), 'ts', 'middle');
  };
  panel(80, 19, 'fₛ = 19 Hz：replica 最多首尾相接，不 overlap', []);
  panel(190, 18, 'fₛ = 18 Hz：粗线标出的地方两个 band 叠在一起，aliasing', [[-19, -17], [-1, 1], [17, 19]]);
  o += rect(30, 222, 14, 10, 'solid') + text(50, 231, '原来的 positive band [11, 19]，浅色是它的 replica', 'ts');
  o += rect(30, 240, 14, 10, 'solid2') + text(50, 249, '原来的 negative band [−19, −11]，浅色是它的 replica', 'ts');
  o += text(540, 249, 'f（Hz）', 'ts', 'end');
  return svg(560, 258, o, 'Bandpass signal 占据 11 到 19 Hz；sampling rate 为 19 Hz 时 replica 恰好不 overlap，18 Hz 时 replica 重叠产生 aliasing');
}

export default {
  'ee2023-eigen': eigen,
  'ee2023-conv': conv,
  'ee2023-partial': partial,
  'ee2023-ftlimit': ftlimit,
  'ee2023-rectsinc': rectsinc,
  'ee2023-sss': sss,
  'ee2023-pz': pz,
  'ee2023-zeta': zeta,
  'ee2023-bode': bode,
  'ee2023-samples': samples,
  'ee2023-alias': alias,
  'ee2023-modulation': modulation,
  'ee2023-sampling': sampling,
};
