import { svg, lin, logx, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes } from '../lib/svg.mjs';

const E = (s) => it('E') + sub(s);
const SLOPE = 61.54; // 2.303 RT/F，37 °C，单位 mV
const nernst = (z, o, i) => (SLOPE / z) * Math.log10(o / i);

// 第 1 站：各种 ion 的 equilibrium potential 排在一条 voltage 轴上
function potentials() {
  const sx = lin(-100, 130, 40, 530);
  const y = 112;
  let o = line(40, y, 530, y, 'axis');
  for (const v of [-100, -50, 0, 50, 100]) o += line(sx(v), y, sx(v), y + 5, 'axis') + text(sx(v), y + 19, (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v), 'ts', 'middle');
  o += text(530, y + 36, 'membrane potential（mV）', 'ts', 'end');
  const mark = (v, lab, up, cls, dy = 0) => {
    const x = sx(v);
    o += line(x, y - 14, x, y + 14, cls);
    o += up ? text(x, y - 22 - dy, lab, cls === 'ln' ? 'tl' : 't', 'middle') : text(x, y + 52 + dy, lab, cls === 'ln' ? 'tl' : 't', 'middle');
  };
  const EK = nernst(1, 5, 100), ENa = nernst(1, 150, 15), ECa = nernst(2, 2, 0.0002), ECl = -nernst(1, 150, 13);
  mark(EK, E('K') + ' = −80', false, 'ink-b');
  mark(ECl, E('Cl') + ' = −65', false, 'ink', 18);
  mark(-65, 'resting ≈ −65', true, 'ln');
  mark(40, 'spike peak ≈ +40', true, 'ln');
  mark(ENa, E('Na') + ' = +62', false, 'ink-b');
  mark(ECa, E('Ca') + ' = +123', false, 'ink');
  o += arrow(sx(-60), 50, sx(34), 50, 'mute') + text(sx(-12), 40, 'g 的权重从 K⁺ 移到 Na⁺', 'ts', 'middle');
  return svg(560, 196, o, '几种 ion 的 equilibrium potential 在 voltage 轴上的位置：E_K 约 −80 mV，E_Cl 约 −65 mV，E_Na 约 +62 mV，E_Ca 约 +123 mV；resting potential 靠近 E_K，action potential 的 peak 靠近 E_Na');
}

// 第 1 站：resting potential 随 [K+]o 的变化，Nernst 与 GHK 对比
function ghk() {
  const sx = logx(1, 100, 80, 520), sy = lin(-130, 10, 236, 26);
  const g = (Ko, a) => SLOPE * Math.log10((Ko + a * 150) / (100 + a * 15));
  let o = axes({ sx, sy, x0: 1, x1: 100, y0: -130, y1: 10, xt: [1, 2, 5, 10, 20, 50, 100], yt: [[-120, '−120'], [-90, '−90'], [-60, '−60'], [-30, '−30'], [0, '0']], grid: true });
  const pts = (fn) => { const p = []; for (let i = 0; i <= 200; i++) { const k = 10 ** (2 * i / 200); p.push([sx(k), sy(fn(k))]); } return d(p); };
  o += path(pts((k) => nernst(1, k, 100)), 'dash') + path(pts((k) => g(k, 0.01)), 'ln');
  o += line(sx(5), sy(-130), sx(5), sy(10), 'mute');
  o += circle(sx(5), sy(g(5, 0.01)), 4, 'ln-f') + circle(sx(5), sy(nernst(1, 5, 100)), 4, 'ink-f');
  o += text(sx(5) - 8, sy(-60), 'GHK：−73 mV', 'tl', 'end') + text(sx(5) + 8, sy(nernst(1, 5, 100)) + 16, 'Nernst：−80 mV', 't');
  o += text(sx(5) + 6, sy(-8), '正常 [K⁺]ₒ = 5 mM', 'ts');
  o += line(sx(7), sy(-104), sx(9.5), sy(-104), 'dash') + text(sx(10.5), sy(-104) + 4, 'Nernst：只有 K⁺ 能通过', 'ts');
  o += line(sx(7), sy(-120), sx(9.5), sy(-120), 'ln') + text(sx(10.5), sy(-120) + 4, 'GHK：p' + sub('Na') + ' / p' + sub('K') + ' = 0.01', 'ts');
  o += text(520, 268, '[K⁺]ₒ（mM，log scale）', 'ts', 'end') + text(80, 14, 'resting potential（mV）', 'ts');
  return svg(560, 276, o, '横轴是 outside 的 K⁺ concentration 的 log，纵轴是 resting potential。Nernst 预测一条 slope 为每十倍 61.5 mV 的直线；加上少量 Na⁺ permeability 的 GHK curve 在低 concentration 处明显偏离这条线');
}

// 第 2 站：leaky integrate-and-fire 的 voltage trace
function lif() {
  const tau = 10, EL = -65, Vth = -50, R = 10;
  const sx = lin(0, 70, 70, 520), sy = lin(-70, -8, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 70, y0: -70, y1: -15, xt: [0, 10, 20, 30, 40, 50, 60, 70], yt: [[-65, '−65'], [-50, '−50'], [-30, '−30']] });
  o += line(sx(0), sy(Vth), sx(70), sy(Vth), 'ln-dash') + text(sx(70), sy(Vth) - 6, 'threshold −50', 'ts', 'end');
  const sim = (I, cls) => {
    let V = EL, pts = [[sx(0), sy(V)]], sp = [];
    for (let t = 0; t <= 70; t += 0.05) {
      const inp = t >= 5 ? I : 0;
      V += (0.05 * (-(V - EL) + R * inp)) / tau;
      if (V >= Vth) { pts.push([sx(t), sy(Vth)]); sp.push(t); V = EL; pts.push([sx(t), sy(V)]); }
      else pts.push([sx(t), sy(V)]);
    }
    o += path(d(pts), cls);
    return sp;
  };
  sim(1.5, 'mute');
  const sp = sim(2.0, 'ln');
  for (const t of sp) o += line(sx(t), sy(Vth), sx(t), sy(-22), 'ln') + circle(sx(t), sy(-22), 2.5, 'ln-f');
  o += text(sx(sp[0]) - 4, sy(-19), 'spike', 'ts', 'end');
  o += text(sx(5.5), sy(-68.2), 'input 从 5 ms 开始', 'ts');
  o += line(sx(24), sy(-10.5) - 4, sx(28), sy(-10.5) - 4, 'ln') + text(sx(29), sy(-10.5), 'I = 2 nA：每 13.9 ms 一个 spike', 'tl');
  o += line(sx(24), sy(-15.5) - 4, sx(28), sy(-15.5) - 4, 'mute') + text(sx(29), sy(-15.5), 'I = 1.5 nA：逼近 −50，永远到不了', 'ts');
  o += text(520, 266, 'time（ms）', 'ts', 'end') + text(70, 20, 'V（mV）', 'ts');
  return svg(560, 274, o, 'Leaky integrate-and-fire neuron 的 voltage trace：input 2 nA 时 voltage 每 13.9 ms 升到 threshold 一次并被 reset；input 1.5 nA 时 voltage 逼近 threshold 但永远到不了');
}

// Hodgkin–Huxley：标准参数，Euler 积分
function hhRun(Ifun, T, dt = 0.005) {
  const gNa = 120, gK = 36, gL = 0.3, ENa = 50, EK = -77, EL = -54.387;
  const an = (V) => (0.01 * (V + 55)) / (1 - Math.exp(-(V + 55) / 10)), bn = (V) => 0.125 * Math.exp(-(V + 65) / 80);
  const am = (V) => (0.1 * (V + 40)) / (1 - Math.exp(-(V + 40) / 10)), bm = (V) => 4 * Math.exp(-(V + 65) / 18);
  const ah = (V) => 0.07 * Math.exp(-(V + 65) / 20), bh = (V) => 1 / (1 + Math.exp(-(V + 35) / 10));
  let V = -65, m = am(V) / (am(V) + bm(V)), h = ah(V) / (ah(V) + bh(V)), n = an(V) / (an(V) + bn(V));
  const out = [];
  for (let t = 0; t < T; t += dt) {
    const gna = gNa * m ** 3 * h, gk = gK * n ** 4;
    out.push([t, V, gna, gk]);
    V += (dt * (Ifun(t) - gna * (V - ENa) - gk * (V - EK) - gL * (V - EL)));
    m += dt * (am(V) * (1 - m) - bm(V) * m); h += dt * (ah(V) * (1 - h) - bh(V) * h); n += dt * (an(V) * (1 - n) - bn(V) * n);
  }
  return out;
}

function hh() {
  const run = hhRun((t) => (t >= 1 && t < 2 ? 20 : 0), 15);
  const sx = lin(0, 15, 80, 520);
  const sy1 = lin(-90, 60, 150, 24), sy2 = lin(0, 36, 300, 190);
  let o = axes({ sx, sy: sy1, x0: 0, x1: 15, y0: -90, y1: 60, xt: [], yt: [[-77, '−77'], [0, '0'], [50, '+50']] });
  o += line(sx(0), sy1(50), sx(15), sy1(50), 'grid') + line(sx(0), sy1(-77), sx(15), sy1(-77), 'grid') + line(sx(0), sy1(0), sx(15), sy1(0), 'grid');
  o += text(sx(15), sy1(50) - 5, E('Na'), 'ts', 'end') + text(sx(15), sy1(-77) + 14, E('K'), 'ts', 'end');
  const step = 10;
  o += path(d(run.filter((_, i) => i % step === 0).map(([t, V]) => [sx(t), sy1(V)])), 'ln');
  o += rect(sx(1), sy1(-90) - 8, sx(2) - sx(1), 8, 'solid2');
  o += text(sx(2) + 4, sy1(-90) - 1, 'input pulse 1 ms', 'ts');
  const pk = run.reduce((a, b) => (b[1] > a[1] ? b : a));
  o += text(sx(pk[0]) + 8, sy1(pk[1]) + 4, `peak +${pk[1].toFixed(0)} mV`, 'tl');
  const und = run.filter((r) => r[0] > pk[0]).reduce((a, b) => (b[1] < a[1] ? b : a));
  o += line(sx(und[0]) + 2, sy1(und[1]) - 3, sx(und[0]) + 14, sy1(-58), 'mute') + text(sx(und[0]) + 16, sy1(-58) - 2, `undershoot ${und[1].toFixed(0)} mV`, 'ts');
  o += text(80, 14, 'V（mV）', 'ts');
  o += axes({ sx, sy: sy2, x0: 0, x1: 15, y0: 0, y1: 36, xt: [0, 3, 6, 9, 12, 15], yt: [0, 10, 20, 30] });
  o += path(d(run.filter((_, i) => i % step === 0).map(([t, , g]) => [sx(t), sy2(g)])), 'ln');
  o += path(d(run.filter((_, i) => i % step === 0).map(([t, , , g]) => [sx(t), sy2(g)])), 'ink-b');
  const gmax = run.reduce((a, b) => (b[2] > a[2] ? b : a));
  o += text(sx(gmax[0]) + 8, sy2(gmax[2]) + 4, 'g' + sub('Na') + '：快开，自己关（inactivation）', 'tl');
  const kmax = run.reduce((a, b) => (b[3] > a[3] ? b : a));
  o += text(sx(kmax[0]) + 8, sy2(kmax[3]) - 6, 'g' + sub('K') + '：慢开，慢关', 't');
  o += text(80, 180, 'conductance（mS/cm²）', 'ts') + text(520, 334, 'time（ms）', 'ts', 'end');
  return svg(560, 342, o, 'Hodgkin–Huxley model 对一个 1 ms input pulse 的响应。上图是 voltage：升到约 +41 mV 再落到约 −76 mV 的 undershoot。下图是两种 conductance：Na conductance 先快速升起又自己落下，K conductance 较晚升起、较晚回落');
}

// 第 3 站：chemical synapse 的五个步骤
function synapse() {
  let o = '';
  const tag = (x, y, n) => circle(x, y, 9, 'solid') + text(x, y + 4.5, n, 'tw', 'middle');
  o += rect(50, 26, 190, 112, 'paper', 36);
  o += text(145, 46, 'presynaptic terminal', 'ts', 'middle');
  for (const [x, y] of [[92, 80], [122, 66], [152, 84], [184, 68], [210, 92], [176, 108]]) o += circle(x, y, 10, 'wash ink-s') + circle(x - 3, y - 2, 1.7, 'ink-f') + circle(x + 3, y + 2, 1.7, 'ink-f');
  o += circle(142, 126, 10, 'wash ink-s') + circle(140, 125, 1.7, 'ink-f');
  for (const [x, y] of [[138, 152], [150, 160], [162, 150], [174, 158], [156, 168]]) o += circle(x, y, 1.8, 'ink-f');
  o += rect(50, 180, 190, 56, 'paper', 6);
  o += text(145, 226, 'postsynaptic membrane', 'ts', 'middle');
  for (const x of [110, 150, 190]) o += rect(x - 9, 174, 18, 14, 'solid');
  o += arrow(150, 190, 150, 210, 'ln');
  o += rect(44, 86, 14, 20, 'solid2');
  o += arrow(20, 74, 46, 92, 'ink') + text(22, 66, 'Ca²⁺', 'tb', 'middle');
  o += arrow(145, 4, 145, 26, 'ln');
  o += tag(162, 12, '1') + tag(30, 118, '2') + tag(118, 124, '3') + tag(214, 170, '4') + tag(118, 158, '5');
  const steps = [
    ['1', 'Action potential 到达 terminal'],
    ['2', 'Voltage-gated Ca²⁺ channel 打开，', 'Ca²⁺ 流入 terminal'],
    ['3', 'Vesicle 与 membrane fuse，', 'transmitter 进入 cleft'],
    ['4', 'Transmitter 结合 receptor，', 'channel 打开，产生 EPSP 或 IPSP'],
    ['5', 'Reuptake 或被 enzyme 分解，', 'signal 结束'],
  ];
  let y = 22;
  for (const [n, l1, l2] of steps) {
    o += tag(272, y - 4, n) + text(288, y, l1, 'ts');
    if (l2) { o += text(288, y + 17, l2, 'ts'); y += 46; } else y += 30;
  }
  return svg(560, 246, o, 'Chemical synapse 的五个步骤：action potential 到达 presynaptic terminal，calcium 进入，vesicle 释放 neurotransmitter，neurotransmitter 结合 postsynaptic receptor，最后被 reuptake 或分解');
}

// 第 3 站：temporal summation 与 spatial summation
function summation() {
  // 与正文同一个 model：EPSP 瞬间升到 1 mV，再以 τ = 10 ms 指数衰减
  const tau = 10;
  const k = (t) => (t < 0 ? 0 : Math.exp(-t / tau));
  const sx = lin(0, 160, 70, 520), sy = lin(-66, -46, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 160, y0: -66, y1: -46, xt: [0, 20, 40, 60, 80, 100, 120, 140, 160], yt: [[-65, '−65'], [-60, '−60'], [-55, '−55'], [-50, '−50']] });
  o += line(sx(0), sy(-50), sx(160), sy(-50), 'ln-dash') + text(sx(160), sy(-50) - 6, 'threshold −50', 'ts', 'end');
  const tr1 = [], tr2 = [];
  for (let i = 0; i < 4; i++) tr1.push(5 + 20 * i);
  for (let i = 0; i < 12; i++) tr2.push(5 + 5 * i);
  const draw = (times, cls, w = 1) => { const p = []; for (let t = 0; t <= 160; t += 0.25) { let v = -65; for (const s of times) v += w * k(t - s); p.push([sx(t), sy(Math.min(v, -46))]); } o += path(d(p), cls); };
  draw(tr1, 'mute');
  draw(tr2, 'ink');
  const sp = [];
  for (let t = 0; t <= 160; t += 0.25) { const v = -65 + 16 * k(t - 115); sp.push([sx(t), sy(Math.min(v, -46))]); }
  o += path(d(sp.filter(([x]) => x >= sx(112))), 'ln');
  o += line(sx(20), sy(-62.6), sx(20), sy(-60.6), 'mute') + text(sx(10), sy(-59.6), '一个 input，200 Hz：最高约 2.5 mV', 't');
  o += line(sx(66), sy(-64.3), sx(74), sy(-62.6), 'mute') + text(sx(75), sy(-62.4), '一个 input，50 Hz', 'ts');
  o += text(sx(113), sy(-47.2), '16 个 input 同时到达', 'tl', 'end');
  o += text(520, 266, 'time（ms）', 'ts', 'end') + text(70, 20, 'V（mV）', 'ts');
  return svg(560, 274, o, '同一个 input 每 20 ms 或每 5 ms 到达一次，EPSP 叠加起来离 threshold 还很远；16 个 input 同时到达，叠加的 EPSP 越过 threshold');
}

// 第 4 站：nervous system 的分区
function ns() {
  let o = '';
  const box = (x, y, w, h, t1, t2, cls = 'paper') => { o += rect(x, y, w, h, cls, 6) + text(x + w / 2, y + (t2 ? 18 : 22), t1, 'tb', 'middle'); if (t2) o += text(x + w / 2, y + 35, t2, 'ts', 'middle'); };
  box(200, 10, 160, 34, 'Nervous system');
  box(40, 78, 200, 44, 'CNS', 'brain + spinal cord', 'wash');
  box(320, 78, 200, 44, 'PNS', 'CNS 以外的 nerve 与 ganglion');
  o += line(280, 44, 140, 78, 'ink') + line(280, 44, 420, 78, 'ink');
  box(250, 156, 130, 44, 'Somatic', 'skeletal muscle，随意');
  box(400, 156, 140, 44, 'Autonomic', 'heart、gland 等，不随意');
  o += line(420, 122, 315, 156, 'ink') + line(420, 122, 470, 156, 'ink');
  box(250, 236, 140, 60, 'Sympathetic', 'fight or flight');
  o += text(320, 288, '多用 norepinephrine', 'ts', 'middle');
  box(400, 236, 140, 60, 'Parasympathetic', 'rest and digest');
  o += text(470, 288, '多用 acetylcholine', 'ts', 'middle');
  o += line(470, 200, 320, 236, 'ink') + line(470, 200, 470, 236, 'ink');
  o += text(40, 150, 'CNS 内部的大块：', 'tb');
  const parts = ['cerebral cortex（四个 lobe）', 'thalamus：sensory 的中转站', 'hypothalamus：hormone 与 autonomic', 'limbic 结构：amygdala、hippocampus', 'cerebellum：movement 的校正', 'brainstem：breathing、arousal'];
  parts.forEach((s, i) => { o += text(48, 172 + i * 20, '· ' + s, 'ts'); });
  return svg(560, 306, o, 'Nervous system 分成 CNS 和 PNS；PNS 再分 somatic 与 autonomic；autonomic 再分 sympathetic 与 parasympathetic。左下列出 CNS 内部的主要结构');
}

// 第 5 站：NMDA receptor 的 Mg2+ block
function nmda() {
  const B = (V) => 1 / (1 + (Math.exp(-0.062 * V) * 1) / 3.57);
  const sx = lin(-100, 40, 80, 520), sy = lin(0, 1, 230, 34);
  let o = axes({ sx, sy, x0: -100, x1: 40, y0: 0, y1: 1, xt: [[-100, '−100'], [-80, '−80'], [-60, '−60'], [-40, '−40'], [-20, '−20'], [0, '0'], [20, '+20'], [40, '+40']], yt: [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], grid: true });
  o += path(curve(B, -100, 40, sx, sy), 'ln');
  for (const [V, lab, dx, dy] of [[-65, `resting：${(B(-65) * 100).toFixed(0)}% 没被堵`, -8, -14], [-20, `depolarize 到 −20：${(B(-20) * 100).toFixed(0)}%`, -10, -8]]) {
    o += circle(sx(V), sy(B(V)), 4.5, 'ln-f') + line(sx(V), sy(0), sx(V), sy(B(V)), 'mute');
    o += text(sx(V) + dx, sy(B(V)) + dy, lab, 'tl', 'end');
  }
  o += text(520, 266, 'postsynaptic membrane potential（mV）', 'ts', 'end') + text(80, 22, '没有被 Mg²⁺ 堵住的 NMDA channel 所占比例（[Mg²⁺]ₒ = 1 mM）', 'ts');
  return svg(560, 274, o, 'NMDA receptor 没有被 magnesium 堵住的比例随 membrane potential 变化：resting 时约 6%，depolarize 到 −20 mV 时约 51%');
}

// 第 5 站：STDP 的 window
function stdp() {
  const Ap = 1.0, Am = 1.05, tp = 20, tm = 20;
  const f = (dt) => (dt > 0 ? Ap * Math.exp(-dt / tp) : dt < 0 ? -Am * Math.exp(dt / tm) : 0);
  const sx = lin(-80, 80, 70, 520), sy = lin(-1.2, 1.2, 236, 30);
  let o = rect(sx(-20), sy(1.2), sx(20) - sx(-20), sy(-1.2) - sy(1.2), 'wash2');
  o += line(sx(-80), sy(0), sx(80), sy(0), 'axis');
  o += axes({ sx, sy, x0: -80, x1: 80, y0: -1.2, y1: 1.2, yAt: -80, xt: [[-80, '−80'], [-40, '−40'], [-20, '−20'], [20, '+20'], [40, '+40'], [80, '+80']], yt: [[-1, '−1%'], [-0.5, '−0.5%'], [0.5, '+0.5%'], [1, '+1%']] });
  o += path(curve(f, 0.01, 80, sx, sy), 'ln') + path(curve(f, -80, -0.01, sx, sy), 'ln');
  o += line(sx(0), sy(1), sx(0), sy(-1.05), 'ln-dash');
  for (const dt of [8, -5, 30]) o += circle(sx(dt), sy(f(dt)), 4.5, 'ink-f');
  o += text(sx(8) + 8, sy(f(8)) - 4, 'Δt = +8', 'tb') + text(sx(-5) - 8, sy(f(-5)) + 14, 'Δt = −5', 'tb', 'end') + text(sx(30) + 8, sy(f(30)) - 6, 'Δt = +30', 'tb');
  o += text(520, sy(0.86), 'pre 先 fire：potentiation', 'tl', 'end') + text(sx(-76), sy(-0.62), 'post 先 fire：depression', 'tl');
  o += text(sx(0), 22, 'Bi 与 Poo（1998）看到变化的范围：±20 ms 以内', 'ts', 'middle');
  o += text(520, 274, 'Δt = post spike 时刻 − pre spike 时刻（ms）', 'ts', 'end');
  return svg(560, 282, o, 'STDP 的 window：presynaptic spike 比 postsynaptic spike 早时 weight 增加，晚时 weight 减少，变化随时间差做 exponential decay；灰色带是 Bi 与 Poo 的 experiment 里观察到变化的正负 20 ms 范围');
}

// 第 6 站：lateral inhibition 造出 Mach band
function lateral() {
  const inp = [10, 10, 10, 10, 20, 20, 20, 20];
  const out = inp.map((v, i) => v - 0.1 * ((inp[i - 1] ?? v) + (inp[i + 1] ?? v)));
  const sy = lin(0, 22, 220, 40), x0 = 80, w = 52;
  let o = line(x0 - 10, sy(0), x0 + 8 * w + 10, sy(0), 'axis');
  for (const v of [5, 10, 15, 20]) o += line(x0 - 10, sy(v), x0 + 8 * w + 10, sy(v), 'grid') + text(x0 - 14, sy(v) + 4, String(v), 'ts', 'end');
  inp.forEach((v, i) => { o += rect(x0 + i * w + 4, sy(v), w - 8, sy(0) - sy(v), 'wash2'); });
  out.forEach((v, i) => { o += rect(x0 + i * w + 14, sy(v), w - 28, sy(0) - sy(v), 'solid'); o += text(x0 + i * w + w / 2, sy(v) - 6, String(+v.toFixed(1)), i === 3 || i === 4 ? 'tl' : 'ts', 'middle'); });
  for (let i = 0; i < 8; i++) o += text(x0 + i * w + w / 2, sy(0) + 16, String(i + 1), 'ts', 'middle');
  o += text(x0 + 4 * w, sy(0) + 34, 'receptor 编号（edge 在 4 和 5 之间）', 'ts', 'middle');
  o += rect(x0 + 8 * w - 150, 24, 12, 10, 'wash2') + text(x0 + 8 * w - 132, 33, 'input（light intensity）', 'ts');
  o += rect(x0 + 8 * w - 150, 6, 12, 10, 'solid') + text(x0 + 8 * w - 132, 15, 'output：自己 − 0.1 × 两个邻居', 'ts');
  return svg(560, 264, o, '八个 receptor，前四个受到强度 10 的光，后四个受到强度 20 的光。每个 receptor 的 output 等于自己的 input 减去两个邻居 input 之和的十分之一，edge 两侧出现一个下凹和一个上凸');
}

// 第 6 站：Hubel–Wiesel 的 simple cell 模型与 orientation tuning
const SC = 0.5, SS = 1.5;
function lgnResp(cx, cy, th) {
  const h = 0.1, dx = Math.sin(th), dy = Math.cos(th);
  let s = 0;
  for (let i = -50; i <= 50; i++) for (let j = -50; j <= 50; j++) {
    const x = cx + i * h, y = cy + j * h, r2 = (i * h) ** 2 + (j * h) ** 2;
    if (r2 >= 25) continue;
    const along = x * dx + y * dy, perp = -x * dy + y * dx;
    if (Math.abs(perp) > 0.5 || Math.abs(along) > 7) continue;
    s += Math.exp(-r2 / (2 * SC * SC)) / (2 * Math.PI * SC * SC) - Math.exp(-r2 / (2 * SS * SS)) / (2 * Math.PI * SS * SS);
  }
  return s * h * h;
}
function simple() {
  const centers = [-3, -1, 1, 3];
  const resp = (deg) => centers.reduce((a, cy) => a + Math.max(0, lgnResp(0, cy, (deg * Math.PI) / 180)), 0);
  const r0 = resp(0);
  // 左：receptive field 与两根 bar
  const U = 20, O = [130, 140];
  const P = (x, y) => [O[0] + U * x, O[1] - U * y];
  let o = '';
  const barPoly = (deg) => {
    const th = (deg * Math.PI) / 180, dx = Math.sin(th), dy = Math.cos(th), px = -dy, py = dx;
    return [[3.5, 0.5], [3.5, -0.5], [-3.5, -0.5], [-3.5, 0.5]].map(([a, b]) => P(a * dx * 1.6 + b * px, a * dy * 1.6 + b * py));
  };
  o += poly(barPoly(0), 'wash-strong');
  o += poly(barPoly(30), 'paper');
  for (const cy of centers) { const [x, y] = P(0, cy); o += circle(x, y, U * 1.5, 'dash') + circle(x, y, U * 0.5, 'ln'); o += text(x, y + 4, '+', 'tl', 'middle'); }
  o += text(O[0], 18, '四个 LGN cell 的 receptive field', 'tb', 'middle');
  o += text(O[0], 270, '实线圈 ON center，虚线圈 OFF surround', 'ts', 'middle');
  o += text(198, 62, '30° 的 bar', 'ts');
  o += text(96, 58, '0° 的 bar', 'ts', 'end');
  // 右：tuning curve
  const sx = lin(-90, 90, 300, 530), sy = lin(0, 1.05, 220, 40);
  o += axes({ sx, sy, x0: -90, x1: 90, y0: 0, y1: 1.05, xt: [[-90, '−90°'], [-45, '−45°'], [0, '0°'], [45, '45°'], [90, '90°']], yt: [[0.5, '0.5'], [1, '1']], grid: true });
  const pts = [];
  for (let deg = -90; deg <= 90; deg += 5) pts.push([deg, resp(deg) / r0]);
  o += path(d(pts.map(([a, v]) => [sx(a), sy(v)])), 'ln');
  for (const [a, v] of pts) if (a % 15 === 0) o += circle(sx(a), sy(v), 2.6, 'ln-f');
  o += text(415, 18, 'simple cell 的 response', 'tb', 'middle');
  o += text(530, 256, 'bar 偏离 vertical 的 angle', 'ts', 'end');
  return svg(560, 280, o, '左图：四个沿竖线排列的 LGN center-surround receptive field，以及竖直和倾斜 30 度的两根 bar。右图：把四个 LGN cell 的 output 相加得到的 simple cell response 随 bar 的 angle 变化，竖直时最大，偏 60 度以上几乎为零');
}

// 第 7 站：HPA axis 与 negative feedback
function hpa() {
  let o = '';
  const box = (x, y, w, t1, t2, cls = 'paper') => { o += rect(x, y, w, 40, cls, 6) + text(x + w / 2, y + (t2 ? 17 : 25), t1, 'tb', 'middle') + (t2 ? text(x + w / 2, y + 33, t2, 'ts', 'middle') : ''); };
  box(20, 14, 140, 'Stressor', 'sensory input');
  box(200, 14, 160, 'Amygdala', '');
  box(400, 14, 140, 'Prefrontal cortex', '');
  box(200, 84, 160, 'Hypothalamus（PVN）', '释放 CRH', 'wash');
  box(200, 154, 160, 'Anterior pituitary', '释放 ACTH', 'wash');
  box(200, 224, 160, 'Adrenal cortex', '释放 cortisol', 'wash');
  box(20, 84, 140, 'Hippocampus', '');
  o += arrow(160, 34, 198, 34, 'ink');
  o += arrow(400, 34, 362, 34, 'ink') + text(381, 28, '−', 'tb', 'middle');
  o += arrow(280, 54, 280, 82, 'ink') + text(288, 72, '+', 'tb');
  o += arrow(280, 124, 280, 152, 'ink') + arrow(280, 194, 280, 222, 'ink');
  o += arrow(160, 104, 198, 104, 'ink') + text(179, 98, '−', 'tb', 'middle');
  o += arrow(362, 236, 382, 236, 'ink') + text(386, 232, 'blood glucose ↑', 'ts') + text(386, 249, 'immune ↓', 'ts');
  // cortisol 的 feedback：从 adrenal cortex 底部出发，右路回 pituitary 与 hypothalamus，左路回 hippocampus
  o += line(280, 264, 280, 282, 'ln') + line(90, 282, 520, 282, 'ln');
  o += line(520, 282, 520, 104, 'ln') + arrow(520, 174, 362, 174, 'ln') + arrow(520, 104, 362, 104, 'ln');
  o += text(500, 168, '−', 'tl', 'middle') + text(500, 98, '−', 'tl', 'middle');
  o += line(90, 282, 90, 126, 'ln') + arrow(90, 160, 90, 126, 'ln') + text(100, 148, '−', 'tl');
  o += text(300, 300, '彩线：cortisol 回到 brain 的 negative feedback', 'ts', 'middle');
  return svg(560, 310, o, 'HPA axis：stressor 经 amygdala 激活 hypothalamus 释放 CRH，pituitary 释放 ACTH，adrenal cortex 释放 cortisol；cortisol 反过来作用于 hippocampus、hypothalamus 和 pituitary，inhibit 这条链；prefrontal cortex inhibit amygdala');
}

export default {
  'lsm2213-potentials': potentials,
  'lsm2213-ghk': ghk,
  'lsm2213-lif': lif,
  'lsm2213-hh': hh,
  'lsm2213-synapse': synapse,
  'lsm2213-summation': summation,
  'lsm2213-ns': ns,
  'lsm2213-nmda': nmda,
  'lsm2213-stdp': stdp,
  'lsm2213-lateral': lateral,
  'lsm2213-simple': simple,
  'lsm2213-hpa': hpa,
};
