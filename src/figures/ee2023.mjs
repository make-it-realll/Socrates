import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const sinc = (x) => (Math.abs(x) < 1e-9 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x));

// LTI 系统：一般输入要做卷积；复指数输入只被乘上一个数 H(s)
function eigen() {
  let o = '';
  const row = (y, inp, out, note) => {
    o += text(40, y + 5, inp, 't') + arrow(120, y, 200, y, 'ink');
    o += rect(202, y - 26, 150, 52, 'paper', 6) + text(277, y - 2, 'LTI 系统', 'tb', 'middle') + text(277, y + 16, '冲激响应 h(t)', 'ts', 'middle');
    o += arrow(354, y, 430, y, 'ink') + text(438, y + 5, out, 't');
    o += text(277, y + 46, note, 'ts', 'middle');
  };
  row(50, `${it('x')}(${it('t')}) 任意信号`, `${it('y')} = ${it('x')} ∗ ${it('h')}`, '一般输入：输出是卷积，要算积分');
  row(150, `${it('e')}<tspan class="sup" dy="-5">st</tspan><tspan dy="5"> 复指数</tspan>`, `${it('H')}(${it('s')}) · ${it('e')}<tspan class="sup" dy="-5">st</tspan>`, '复指数输入：形状不变，只被乘上复数 H(s)');
  return svg(560, 210, o, 'LTI 系统对任意输入做卷积；对复指数输入只是乘上一个复数 H(s)');
}

// rect ↔ sinc：脉冲宽 1/2 秒 ↔ 主瓣零点在 ±2 Hz
function rectsinc() {
  const tx = lin(-1, 1, 40, 250), ty = lin(-0.3, 1.25, 170, 30);
  let o = axes({ sx: tx, sy: ty, x0: -1, x1: 1, y0: -0.3, y1: 1.25, xt: [[-0.25, '−¼'], [0.25, '¼']], xl: 't（秒）', xAt: 0, yAt: 0 });
  o += path(d([[tx(-1), ty(0)], [tx(-0.25), ty(0)], [tx(-0.25), ty(1)], [tx(0.25), ty(1)], [tx(0.25), ty(0)], [tx(1), ty(0)]]), 'ln');
  o += text(145, 20, 'rect(2t)：宽 ½ 秒', 'tb', 'middle') + text(tx(0.25) + 8, ty(1) + 4, '高 1', 'ts');
  const fx = lin(-7, 7, 310, 540), fy = lin(-0.15, 0.625, 170, 30);
  o += axes({ sx: fx, sy: fy, x0: -7, x1: 7, y0: -0.15, y1: 0.625, xt: [[-4, '−4'], [-2, '−2'], [2, '2'], [4, '4']], xl: 'f（Hz）', xAt: 0, yAt: 0 });
  o += path(area((f) => 0.5 * sinc(f / 2), -2, 2, fx, fy), 'wash') + path(curve((f) => 0.5 * sinc(f / 2), -7, 7, fx, fy), 'ln');
  o += text(425, 20, '½ sinc(f / 2)：零点在 ±2, ±4, …', 'tb', 'middle') + text(fx(0.9), fy(0.5) + 4, '峰值 ½', 'ts');
  o += arrow(262, 100, 298, 100, 'ink') + arrow(298, 100, 262, 100, 'ink');
  o += text(280, 205, '脉冲越窄，主瓣越宽：宽度 T 的脉冲，第一个零点在 1 / T', 'ts', 'middle');
  return svg(560, 215, o, '宽度二分之一秒的矩形脉冲，傅里叶变换是 sinc，第一个零点在正负 2 赫兹');
}

// 调制：乘以 cos(2π·15t) 把频谱搬到 ±15，高度减半
function modulation() {
  const fx = lin(-22, 22, 40, 540);
  const X = (f) => (Math.abs(f) <= 4 ? 10 * Math.cos((Math.PI * f) / 8) : 0);
  let o = '';
  const panel = (yb, fn, ymax, title, ticks, peaks) => {
    const fy = lin(0, 11.5, yb, yb - 78);
    o += axes({ sx: fx, sy: fy, x0: -22, x1: 22, y0: 0, y1: 11.5, xt: ticks, yAt: 0 });
    for (const c of peaks) o += text(fx(c), fy(ymax) - 6, '峰值 ' + ymax, 'ts', 'middle');
    o += path(area(fn, -22, 22, fx, fy, 0, 440), 'wash') + path(curve(fn, -22, 22, fx, fy, 440), 'ln');
    o += text(40, yb - 86, title, 'tb');
  };
  panel(110, X, 10, 'X(f)：带宽 4 Hz', [[-4, '−4'], [4, '4']], [0]);
  panel(240, (f) => 0.5 * (X(f - 15) + X(f + 15)), 5, 'Y(f) = ½ [ X(f − 15) + X(f + 15) ]', [[-19, '−19'], [-15, '−15'], [-11, '−11'], [11, '11'], [15, '15'], [19, '19']], [-15, 15]);
  o += text(540, 276, 'f（Hz）', 'ts', 'end');
  return svg(560, 284, o, '基带频谱在调制后搬到正负 15 赫兹处，高度减半，占据 11 到 19 赫兹');
}

// 零极点图：H(s) = (s−4)(s+20) / [ s (s²+10s+100)(s+3) ]
function pz() {
  const sx = lin(-23, 7, 40, 420), sy = lin(-11, 11, 250, 20);
  let o = rect(sx(-23), sy(11), sx(0) - sx(-23), sy(-11) - sy(11), 'wash');
  o += axes({ sx, sy, x0: -23, x1: 7, y0: -11, y1: 11, xt: [[-20, '−20'], [-10, '−10'], [-5, '−5'], [4, '4']], yt: [[8.66, 'j8.66'], [-8.66, '−j8.66']], xAt: 0, yAt: 0 });
  const X = (x, y) => line(sx(x) - 5, sy(y) - 5, sx(x) + 5, sy(y) + 5, 'ink-b') + line(sx(x) - 5, sy(y) + 5, sx(x) + 5, sy(y) - 5, 'ink-b');
  o += X(0, 0) + X(-3, 0) + X(-5, 8.66) + X(-5, -8.66);
  o += circle(sx(4), sy(0), 5.5, 'ln paper-f') + circle(sx(-20), sy(0), 5.5, 'ln paper-f');
  o += text(sx(7) - 2, sy(0) - 8, 'Re', 'ts', 'end') + text(sx(0) + 6, sy(11) + 10, 'Im', 'ts');
  o += text(sx(-22), sy(10) + 4, '左半平面：极点在这里才衰减', 'ts');
  o += text(436, 60, '× 极点', 'tb') + text(436, 80, '0，−3，−5 ± j8.66', 'ts');
  o += text(436, 118, '○ 零点', 'tl') + text(436, 138, '4，−20', 'ts');
  o += text(436, 180, '原点上有极点：', 't') + text(436, 198, '不是 BIBO 稳定。', 't');
  o += text(436, 226, '右半平面的零点', 'ts') + text(436, 242, '不影响稳定性。', 'ts');
  return svg(560, 270, o, '零极点图：极点在 0、负 3、负 5 加减 j8.66；零点在 4 和负 20；原点处的极点使系统不是 BIBO 稳定');
}

// Bode 图：H(s) = 40000 s / [ (s+1)(s²+40s+2000) ]
function bode() {
  const wn = Math.sqrt(2000);
  const sx = logx(0.01, 10000, 60, 540);
  const my = lin(-80, 40, 184, 34), py = lin(-180, 90, 338, 224);
  const mag = (w) => 20 * Math.log10((40000 * w) / (Math.hypot(1, w) * Math.hypot(2000 - w * w, 40 * w)));
  const ph = (w) => 90 - (Math.atan(w) * 180) / Math.PI - (Math.atan2(40 * w, 2000 - w * w) * 180) / Math.PI;
  const asym = (w) => (w < 1 ? 20 * Math.log10(20 * w) : w < wn ? 20 * Math.log10(20) : 20 * Math.log10(20) - 40 * Math.log10(w / wn));
  const xt = [0.01, 0.1, 1, 10, 100, 1000, 10000].map((v) => [v, v >= 1 ? String(v) : String(v)]);
  let o = '';
  for (const [v] of xt) o += line(sx(v), my(-80), sx(v), my(40), 'grid') + line(sx(v), py(-180), sx(v), py(90), 'grid');
  for (const v of [-80, -40, 0, 40]) o += line(60, my(v), 540, my(v), 'grid') + text(54, my(v) + 4, String(v), 'ts', 'end');
  for (const v of [-180, -90, 0, 90]) o += line(60, py(v), 540, py(v), 'grid') + text(54, py(v) + 4, v + '°', 'ts', 'end');
  for (const [v, s] of xt) o += text(sx(v), 354, s, 'ts', 'middle');
  const lg = (fn, sy, cls) => {
    const pts = [];
    for (let i = 0; i <= 300; i++) { const w = 10 ** (-2 + (6 * i) / 300); pts.push([sx(w), sy(fn(w))]); }
    return path(d(pts), cls);
  };
  o += lg(asym, my, 'dash') + lg(mag, my, 'ln') + lg(ph, py, 'ln');
  o += line(sx(1), my(-80), sx(1), my(40), 'mute') + line(sx(wn), my(-80), sx(wn), my(40), 'mute');
  o += text(sx(1) + 4, my(-70), 'ω = 1', 'ts') + text(sx(wn) + 4, my(-70), 'ω = √2000 ≈ 44.7', 'ts');
  o += text(sx(0.09), my(-20), '+20 dB/dec', 't') + text(sx(6), my(33), '平台 26 dB', 't', 'middle') + text(sx(500), my(2), '−40 dB/dec', 't');
  o += text(60, 18, '|H(jω)|（dB）  虚线是渐近线', 'tb') + text(60, 212, '∠H(jω)', 'tb') + text(540, 372, 'ω（rad/s，对数刻度）', 'ts', 'end');
  return svg(560, 380, o, 'Bode 图：幅频先以每十倍频 20 分贝上升，在 1 到 44.7 之间持平于 26 分贝，之后以每十倍频 40 分贝下降；相位从 90 度降到负 180 度');
}

// 带通采样：fs = 19 恰好不重叠，fs = 18 重叠
function sampling() {
  const fx = lin(-40, 40, 30, 540);
  let o = '';
  const panel = (yb, fs, title) => {
    o += line(30, yb, 540, yb, 'axis') + text(30, yb - 58, title, 'tb');
    const band = (a, b, cls) => { const lo = Math.max(a, -40), hi = Math.min(b, 40); if (hi > lo) o += rect(fx(lo), yb - 36, fx(hi) - fx(lo), 36, cls); };
    for (let k = -4; k <= 4; k++) {
      band(11 + k * fs, 19 + k * fs, k === 0 ? 'solid' : 'band-p');
      band(-19 + k * fs, -11 + k * fs, k === 0 ? 'solid2' : 'band-n');
    }
    for (const v of [-38, -19, -11, 0, 11, 19, 38]) o += line(fx(v), yb, fx(v), yb + 4, 'axis') + text(fx(v), yb + 17, String(v).replace('-', '−'), 'ts', 'middle');
  };
  panel(80, 19, 'fs = 19 Hz：副本首尾相接，不重叠');
  panel(190, 18, 'fs = 18 Hz：副本压到一起（颜色变深处），发生混叠');
  o += rect(30, 222, 14, 10, 'solid') + text(50, 231, '原来的正频带 [11, 19] 及其副本（浅色）', 'ts');
  o += rect(290, 222, 14, 10, 'solid2') + text(310, 231, '原来的负频带 [−19, −11] 及其副本', 'ts');
  o += text(540, 231, 'f（Hz）', 'ts', 'end');
  return svg(560, 240, o, '带通信号占据 11 到 19 赫兹；采样率 19 赫兹时频谱副本恰好不重叠，18 赫兹时副本重叠产生混叠');
}

// 二阶系统阶跃响应随阻尼比变化
function zeta() {
  const sx = lin(0, 14, 50, 520), sy = lin(0, 1.65, 220, 20);
  const step = (z) => (t) => {
    if (z < 1) { const wd = Math.sqrt(1 - z * z); return 1 - Math.exp(-z * t) * (Math.cos(wd * t) + (z / wd) * Math.sin(wd * t)); }
    if (z === 1) return 1 - (1 + t) * Math.exp(-t);
    const r = Math.sqrt(z * z - 1), s1 = -z + r, s2 = -z - r;
    return 1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1);
  };
  let o = axes({ sx, sy, x0: 0, x1: 14, y0: 0, y1: 1.65, xt: [2, 4, 6, 8, 10, 12], yt: [[1, '1']], xl: 'ωₙt' });
  o += line(sx(0), sy(1), sx(14), sy(1), 'grid');
  o += path(curve(step(0.2), 0, 14, sx, sy), 'ln') + path(curve(step(0.5), 0, 14, sx, sy), 'ink') + path(curve(step(1), 0, 14, sx, sy), 'dash') + path(curve(step(2), 0, 14, sx, sy), 'mute');
  [['ln', 'ζ = 0.2：超调大，振荡久'], ['ink', 'ζ = 0.5：略有超调'], ['dash', 'ζ = 1：临界阻尼，恰好不超调'], ['mute', 'ζ = 2：过阻尼，最慢']].forEach(([c, s], i) => {
    const y = sy(0.62) + i * 20;
    o += line(sx(7.2), y - 4, sx(8.1), y - 4, c) + text(sx(8.3), y, s, 't');
  });
  return svg(560, 255, o, '二阶系统的阶跃响应：阻尼比 0.2 时振荡明显，0.5 时略有超调，1 时不超调，2 时缓慢爬升');
}

export default {
  'ee2023-eigen': eigen,
  'ee2023-rectsinc': rectsinc,
  'ee2023-modulation': modulation,
  'ee2023-pz': pz,
  'ee2023-bode': bode,
  'ee2023-sampling': sampling,
  'ee2023-zeta': zeta,
};
