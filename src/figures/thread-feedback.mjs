import { svg, svgA, lin, d, path, line, rect, circle, text, arrow, f1, sub, apath, acircle, ashow, anim } from '../lib/svg.mjs';

const fmt = (v, n) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
// 一组帧：hold 秒停在第 0 帧，之后每帧 step 秒，最后停 tail 秒
function frames(n, hold, step, tail) {
  const T = hold + step * (n - 1) + tail;
  const ts = [0], fr = [0];
  for (let k = 0; k < n; k++) { ts.push(hold + step * k); fr.push(k); }
  ts.push(T); fr.push(n - 1);
  return { kt: ts.map((t) => t / T), fr, T };
}
// 只在第 k 帧显示
const only = (k, fr, kt, T, body) => `<g opacity="${fr[0] === k ? 1 : 0}">${body}${ashow(fr.map((f) => f === k), kt, T)}</g>`;

// ---------- 1. 开头：Joint J 的 current loop ----------
function simCurrent({ R = 1, Rhat = 1, kp = 5, tau = 0, T = 2e-3, dt = 1e-7, every = 100 }) {
  const La = 0.5e-3, n = Math.round(T / dt), dly = Math.round(tau / dt);
  const i = new Float64Array(n + 1);
  for (let k = 0; k < n; k++) {
    const im = k - dly >= 0 ? i[k - dly] : 0;
    const V = Rhat * 1 + kp * (1 - im);
    i[k + 1] = i[k] + (dt * (-R * i[k] + V)) / La;
  }
  const out = [];
  for (let k = 0; k <= n; k += every) out.push([k * dt, i[k]]);
  return out;
}
function currentA() {
  let o = '';
  // 左：loop 本身
  const cx0 = 18, cw = 118;
  o += rect(cx0, 24, cw, 40, 'paper', 4) + text(cx0 + cw / 2, 41, 'controller', 'tb', 'middle') + text(cx0 + cw / 2, 57, 'V = R̂i' + sub('d') + ' + k' + sub('p') + '(i' + sub('d') + ' − i)', 'ts', 'middle');
  o += arrow(cx0 + cw / 2, 64, cx0 + cw / 2, 92, 'ink') + text(cx0 + cw / 2 + 6, 82, 'V', 'ts', 'start');
  o += rect(cx0, 92, cw, 30, 'wash2', 4) + text(cx0 + cw / 2, 112, 'driver', 'tb', 'middle');
  // coil：resistor 的锯齿 + inductor 的圈
  const wx = cx0 + cw / 2;
  o += line(wx, 122, wx, 136, 'ink');
  const zz = [[wx, 136]];
  for (let k = 0; k < 6; k++) zz.push([wx + (k % 2 ? -7 : 7), 140 + 6 * k]);
  zz.push([wx, 176]);
  o += path(d(zz), 'ink') + text(wx + 14, 160, 'R', 'ts', 'start');
  let arcs = `M${wx} 180`;
  for (let k = 0; k < 4; k++) arcs += ` a7 6 0 0 1 0 12`;
  o += line(wx, 176, wx, 180, 'ink') + path(arcs, 'ink') + text(wx + 14, 206, 'L' + sub('a'), 'ts', 'start');
  o += text(wx - 14, 192, 'coil', 'ts', 'end');
  o += line(wx, 228, wx, 246, 'ink');
  // sensor
  o += circle(wx, 256, 10, 'paper') + text(wx, 260, 'A', 'ts', 'middle') + text(wx + 15, 260, 'sensor', 'ts', 'start');
  // measurement 回到 controller：经过 delay
  o += path(d([[wx - 10, 256], [cx0 - 6, 256], [cx0 - 6, 196]]), 'mute');
  o += rect(cx0 - 16, 150, 20, 46, 'paper', 3) + text(cx0 - 6, 177, 'τ', 'tb', 'middle');
  o += arrow(cx0 - 6, 150, cx0 - 6, 44, 'mute') ;
  o += path(d([[cx0 - 6, 44], [cx0, 44]]), 'mute');
  o += text(cx0 + 2, 140, 'i(t − τ)', 'ts', 'start');
  // 右：两张 i(t)
  const X0 = 236, X1 = 548;
  const sx = lin(0, 2, X0, X1);
  const panels = [
    { y0: 22, h: 108, lo: 0, hi: 1.15, ticks: [0, 0.5, 1], curves: [
      { data: simCurrent({ R: 1.2, kp: 0 }), cls: 'dash', lab: 'open loop：0.833', ly: -12 },
      { data: simCurrent({ R: 1.2 }), cls: 'ln', lab: 'closed loop：0.968', ly: -8 },
    ], title: 'R = 1.2 Ω（发热）' },
    { y0: 174, h: 40, lo: -0.1, hi: 1.6, ticks: [0, 1], curves: [
      { data: simCurrent({ tau: 0.1e-3 }), cls: 'ink' },
    ], title: 'R = 1 Ω，k' + sub('p') + ' = 5，只改 delay' },
    { y0: 228, h: 66, lo: -1.3, hi: 3.0, ticks: [-1, 0, 1, 2, 3], curves: [
      { data: simCurrent({ tau: 0.2e-3 }), cls: 'ln' },
    ], title: '' },
  ];
  const N = 81; // 帧：t = 0, 0.025, ..., 2 ms
  const { kt, fr, T } = frames(N, 1.2, 0.07, 1.6);
  for (const pn of panels) {
    const sy = lin(pn.lo, pn.hi, pn.y0 + pn.h, pn.y0);
    o += line(X0, pn.y0, X0, pn.y0 + pn.h, 'axis') + line(X0, sy(0), X1, sy(0), 'axis');
    for (const v of pn.ticks) o += line(X0 - 4, sy(v), X0, sy(v), 'axis') + text(X0 - 7, sy(v) + 4, String(v), 'ts', 'end');
    o += line(X0, sy(1), X1, sy(1), 'grid');
    if (pn.title) o += text(X0 + 6, pn.y0 - 8, pn.title, 'ts', 'start');
    for (const c of pn.curves) {
      o += path(d(c.data.map(([t, v]) => [sx(t * 1e3), sy(v)])), c.cls);
      const idx = fr.map((f) => Math.min(c.data.length - 1, Math.round((f / (N - 1)) * (c.data.length - 1))));
      o += acircle(idx.map((j) => sx(c.data[j][0] * 1e3)), idx.map((j) => sy(c.data[j][1])), kt, T, 4.2, c.cls === 'dash' ? 'ink-f' : c.cls === 'ink' ? 'ink-f' : 'ln-f');
    }
    pn.sy = sy;
  }
  // 标注
  const p0 = panels[0], p1 = panels[1], p2 = panels[2];
  o += text(X1, p0.sy(0.833) + 15, 'open loop：0.833', 'ts', 'end');
  o += text(X1, p0.sy(0.968) - 6, 'closed loop：0.968', 'tl', 'end');
  o += text(X1, p1.sy(0.35), 'τ = 0.1 ms：peak 1.47，0.9 ms 后停住', 'ts', 'end');
  o += text(sx(0.36), p2.sy(2.55), 'τ = 0.2 ms：越振越大', 'tl', 'start');
  for (const v of [0, 0.5, 1, 1.5, 2]) o += line(sx(v), p2.sy(-1.3), sx(v), p2.sy(-1.3) + 4, 'axis') + text(sx(v), p2.sy(-1.3) + 16, String(v), 'ts', 'middle');
  o += text(X1, p2.sy(-1.3) + 30, 't（ms）', 'ts', 'end');
  // 时间：每 4 帧更新一次
  const tf = fr.map((f) => Math.floor(f / 4) * 4);
  for (let k = 0; k < N; k += 4) o += only(k, tf, kt, T, text(X1, 14, `t = ${(k * 0.025).toFixed(2)} ms`, 'ts', 'end'));
  return svgA(560, 330, o, '动图：左边是 current loop 的实物结构，controller 经 driver 给 coil 加 voltage，sensor 量 current，measurement 经过 delay τ 回到 controller。右上：发热的 motor 上 open loop 停在 0.833 A，closed loop 停在 0.968 A 而且快得多。右下：delay 0.1 ms 时振几下停住，0.2 ms 时越振越大');
}

// ---------- 2. Closed-loop pole 随 L 和 f 移动 ----------
function poleA() {
  let o = '';
  const negL = [0, 0.5, 1, 2, 3, 4, 5], posF = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2];
  const states = [...negL.map((L) => ({ L, p: -(1 + L) })), ...posF.map((f) => ({ f, p: -(1 - f) }))];
  const N = states.length;
  const { kt, fr, T } = frames(N, 1.4, 1.1, 1.8);
  // 左：real axis
  const ax = lin(-6.6, 1.2, 18, 252), ay = 118;
  o += line(ax(-6.6), ay, ax(1.2), ay, 'axis') + line(ax(0), ay - 58, ax(0), ay + 58, 'axis');
  o += text(ax(1.2), ay - 6, 'Re s', 'ts', 'end') + text(ax(0), ay - 64, 'Im s', 'ts', 'middle');
  o += path(`M${f1(ax(0))} ${ay - 58}L${f1(ax(1.2))} ${ay - 58}L${f1(ax(1.2))} ${ay + 58}L${f1(ax(0))} ${ay + 58}Z`, 'wash2');
  o += text(ax(0.6), ay + 44, 'unstable', 'ts', 'middle');
  for (const v of [-6, -4, -2, -1, 0]) o += line(ax(v), ay, ax(v), ay + 4, 'axis') + text(ax(v), ay + 17, v === 0 ? '0' : v === -1 ? '−a' : '−' + Math.abs(v) + 'a', 'ts', 'middle');
  o += circle(ax(-1), ay, 5, 'paper');
  o += text(ax(-1), ay - 12, 'open loop', 'ts', 'middle');
  o += acircle(fr.map((f) => ax(states[f].p)), fr.map(() => ay), kt, T, 6, 'ln-f');
  for (let k = 0; k < N; k++) {
    const s = states[k];
    const lab = s.L !== undefined ? `negative feedback：L = ${s.L}` : `positive feedback：f = ${s.f.toFixed(1)}`;
    const p = s.L === 0 ? 'p = −a：open loop' : s.L !== undefined ? `p = −${f1(1 + s.L)}a，快 ${f1(1 + s.L)} 倍` : s.f < 1 ? `p = −${(1 - s.f).toFixed(1)}a，慢 ${f1(1 / (1 - s.f))} 倍，放大 ${f1(1 / (1 - s.f))} 倍` : s.f === 1 ? 'p = 0：integrator' : `p = +${(s.f - 1).toFixed(1)}a：一直长`;
    o += only(k, fr, kt, T, text(18, 26, lab, 'tb', 'start') + text(18, 44, p, 'ts', 'start'));
  }
  // 右上：negative feedback 的 step response
  const X0 = 300, X1 = 548;
  const sxA = lin(0, 3, X0, X1), syA = lin(0, 1.1, 120, 22);
  o += line(X0, 22, X0, 120, 'axis') + line(X0, 120, X1, 120, 'axis');
  for (const v of [0, 1, 2, 3]) o += text(sxA(v), 134, String(v), 'ts', 'middle');
  o += text(X1, 148, 'at', 'ts', 'end') + text(X0 - 6, syA(1) + 4, '1', 'ts', 'end') + text(X0 - 6, syA(0) + 4, '0', 'ts', 'end');
  o += line(X0, syA(1), X1, syA(1), 'grid');
  const stepNeg = (L) => d(Array.from({ length: 121 }, (_, i) => { const t = (3 * i) / 120; return [sxA(t), syA(1 - Math.exp(-(1 + L) * t))]; }));
  for (const L of [0, 5]) o += path(stepNeg(L), 'mute');
  o += text(sxA(1.5), syA(1 - Math.exp(-1.5)) + 16, 'L = 0', 'ts', 'start') + text(sxA(0.5), syA(0.78), 'L = 5', 'ts', 'start');
  const dsNeg = states.map((s) => stepNeg(s.L !== undefined ? s.L : 5));
  o += apath(fr.map((f) => dsNeg[f]), kt, T, 'ln', true);
  o += text(X0 + 6, 14, 'negative：y / y' + sub('ss'), 'ts', 'start');
  // 右下：positive feedback
  const sxB = lin(0, 10, X0, X1), syB = lin(0, 5.6, 300, 186);
  o += line(X0, 186, X0, 300, 'axis') + line(X0, 300, X1, 300, 'axis');
  for (const v of [0, 5, 10]) o += text(sxB(v), 314, String(v), 'ts', 'middle');
  for (const v of [0, 1, 5]) o += text(X0 - 6, syB(v) + 4, String(v), 'ts', 'end') + line(X0, syB(v), X1, syB(v), 'grid');
  o += text(X0 + 6, 178, 'positive：y / （open loop 的 y' + sub('ss') + '）', 'ts', 'start');
  const stepPos = (f) => d(Array.from({ length: 161 }, (_, i) => { const t = (10 * i) / 160; const y = Math.abs(1 - f) < 1e-9 ? t : (1 - Math.exp(-(1 - f) * t)) / (1 - f); return [sxB(t), syB(Math.min(y, 5.6))]; }));
  o += path(stepPos(0), 'mute') + path(stepPos(0.8), 'mute');
  o += text(sxB(10), syB(1) - 5, 'f = 0', 'ts', 'end') + text(sxB(10), syB(4.32) + 15, 'f = 0.8', 'ts', 'end');
  const dsPos = states.map((s) => stepPos(s.f !== undefined ? s.f : 0));
  o += apath(fr.map((f) => dsPos[f]), kt, T, 'ln', true);
  return svgA(560, 322, o, '动图：左边 real axis 上的 closed-loop pole，右边同步的 step response。L 从 0 到 5，pole 从 −a 滑到 −6a，response 快 6 倍；换成 positive feedback，f 从 0.2 到 0.8，pole 向 0 靠，response 变慢、终值放大；f = 1 时 pole 在 0，f = 1.2 时越过 0，output 一直增长');
}

// ---------- 3. Delay 卷起 Nyquist curve，crossover 点转向 −1 ----------
function marginA() {
  let o = '';
  const a = 2000, g = 10000, wc = Math.sqrt(g * g - a * a), phi0 = Math.atan(wc / a), PM = Math.PI - phi0, tc = PM / wc;
  const sc = 44, O = [100, 100];
  const X = (re) => O[0] + sc * re, Y = (im) => O[1] - sc * im;
  o += line(X(-1.8), O[1], X(5.4), O[1], 'axis') + line(O[0], Y(1.6), O[0], Y(-3.3), 'axis');
  o += text(X(5.4), O[1] - 6, 'Re', 'ts', 'end') + text(O[0] + 5, Y(1.6) + 10, 'Im', 'ts', 'start');
  o += circle(O[0], O[1], sc, 'dash');
  o += circle(X(-1), O[1], 3.5, 'ink-f') + text(X(-1) - 4, O[1] - 7, '−1', 'tb', 'end');
  o += line(X(5), O[1] - 3, X(5), O[1] + 3, 'axis') + text(X(5), O[1] - 8, '5', 'ts', 'middle');
  const ws = [];
  for (let i = 0; i <= 260; i++) ws.push(Math.pow(10, 1 + (4.7 * i) / 260)); // 10 .. 5e5 rad/s
  const curveAt = (tau) => d(ws.map((w) => { const m = 5 / Math.sqrt(1 + (w / a) ** 2), ph = -Math.atan(w / a) - w * tau; return [X(m * Math.cos(ph)), Y(m * Math.sin(ph))]; }).filter((p, i, arr) => i === 0 || Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1]) > 0.01 || i % 1 === 0));
  const taus = [];
  for (let k = 0; k <= 9; k++) taus.push(k * 0.02e-3);
  taus.push(tc); taus.push(0.2e-3); taus.push(0.22e-3);
  const N = taus.length;
  const { kt, fr, T } = frames(N, 1.6, 0.55, 2.2);
  o += path(curveAt(0), 'mute');
  o += apath(fr.map((f) => curveAt(taus[f])), kt, T, 'ln');
  const arcPts = (tau) => { const th0 = -phi0 - wc * tau, th1 = -Math.PI; const pts = []; for (let i = 0; i <= 40; i++) { const th = th0 + ((th1 - th0) * i) / 40; pts.push([X(Math.cos(th)), Y(Math.sin(th))]); } return d(pts); };
  o += apath(fr.map((f) => arcPts(Math.min(taus[f], tc))), kt, T, 'ink-b');
  const cp = (tau) => { const th = -phi0 - wc * tau; return [X(Math.cos(th)), Y(Math.sin(th))]; };
  o += acircle(fr.map((f) => cp(taus[f])[0]), fr.map((f) => cp(taus[f])[1]), kt, T, 5.5, 'ln-f');
  o += text(X(-0.08), Y(-1.36), 'L(jω' + sub('c') + ')', 'ts', 'end');
  // 右：数字
  const tx = 378;
  o += text(tx, 30, 'L(jω) = 5e' + '<tspan dy="-5" class="sup">−jωτ</tspan><tspan dy="5">​</tspan>' + ' / (1 + jω/2000)', 'ts', 'start');
  o += text(tx, 50, 'ω' + sub('c') + ' = 9798 rad/s', 'ts', 'start');
  o += text(tx, 68, 'PM = 101.5°', 'ts', 'start');
  for (let k = 0; k < N; k++) {
    const tau = taus[k], eat = (wc * tau * 180) / Math.PI, left = 101.537 - eat;
    let b = text(tx, 104, `τ = ${(tau * 1e3).toFixed(3)} ms`, 'tb', 'start') + text(tx, 124, `ω` + sub('c') + `τ = ${eat.toFixed(1)}°`, 'ts', 'start');
    b += text(tx, 142, left > 0.05 ? `还剩 ${left.toFixed(1)}°` : left > -0.05 ? '压到 −1：τ' + sub('c') : `超出 ${(-left).toFixed(1)}°`, left > 0.05 ? 'ts' : 'tl', 'start');
    b += text(tx, 168, left > 0.05 ? 'stable' : left > -0.05 ? '临界' : 'unstable', 'tb', 'start');
    o += only(k, fr, kt, T, b);
  }
  o += text(tx, 200, '粗弧：crossover 点', 'ts', 'start') + text(tx, 216, '到 −1 还差的 angle', 'ts', 'start');
  return svgA(560, 272, o, '动图：current loop 的 Nyquist curve（ω ≥ 0）与 unit circle。灰线是 τ = 0，彩色线随 τ 增大按 e^{−jωτ} 卷起来；彩色点是 crossover 点，沿 unit circle 顺时针转 ω_cτ，粗弧是剩下的 phase margin，τ = 0.181 ms 时它压到 −1 上');
}

// ---------- 4. 离散 loop 的 root ----------
function dkStep(coef, roots) {
  // Durand–Kerner，一次迭代（monic polynomial，coef 从高次到低次）
  const n = roots.length;
  const ev = (z) => { let re = 1, im = 0; for (let i = 1; i < coef.length; i++) { const r2 = re * z[0] - im * z[1] + coef[i], i2 = re * z[1] + im * z[0]; re = r2; im = i2; } return [re, im]; };
  const out = roots.map((z, i) => {
    let dre = 1, dim = 0;
    for (let j = 0; j < n; j++) if (j !== i) { const w = [z[0] - roots[j][0], z[1] - roots[j][1]]; const r2 = dre * w[0] - dim * w[1], i2 = dre * w[1] + dim * w[0]; dre = r2; dim = i2; }
    const p = ev(z), den = dre * dre + dim * dim;
    return [z[0] - (p[0] * dre + p[1] * dim) / den, z[1] - (p[1] * dre - p[0] * dim) / den];
  });
  return out;
}
function zrootsA() {
  let o = '';
  const N = 46, R = 52;
  const { kt, fr, T } = frames(N, 1.2, 0.16, 2.0);
  const ds = [0, 1, 2];
  ds.forEach((dd, pi) => {
    const C = [96 + 186 * pi, 118];
    const cmax = 2 * Math.sin(Math.PI / (2 * (2 * dd + 1)));
    const X = (re) => C[0] + R * re, Y = (im) => C[1] - R * im;
    o += line(X(-1.55), C[1], X(1.4), C[1], 'axis') + line(C[0], Y(1.35), C[0], Y(-1.35), 'axis');
    o += circle(C[0], C[1], R, 'dash');
    o += text(C[0], 22, `d = ${dd}：c` + sub('max') + ` = ${cmax.toFixed(3).replace(/\.?0+$/, '')}`, 'tb', 'middle');
    const th = Math.PI / (2 * dd + 1);
    o += line(C[0], C[1], X(1.3 * Math.cos(th)), Y(1.3 * Math.sin(th)), 'ink');
    o += text(X(1.32 * Math.cos(th)) + (dd === 0 ? -2 : 4), Y(1.32 * Math.sin(th)) + (dd === 0 ? -6 : 4), `${Math.round((th * 180) / Math.PI)}°`, 'ts', dd === 0 ? 'end' : 'start');
    // root 轨迹
    const nr = dd + 1;
    const cs = Array.from({ length: N }, (_, k) => (1.15 * cmax * k) / (N - 1));
    const coefOf = (c) => { const co = [1, -1]; for (let i = 1; i < dd; i++) co.push(0); co.push(c); if (dd === 0) return [1, c - 1]; return co; };
    let roots = Array.from({ length: nr }, (_, i) => [0.4 * Math.cos((2 * Math.PI * i) / nr + 0.3), 0.4 * Math.sin((2 * Math.PI * i) / nr + 0.3)]);
    const hist = [];
    const fine = 12 * (N - 1);
    const track = Array.from({ length: nr }, () => []);
    for (let s = 0; s <= fine; s++) {
      const c = 1e-4 + (1.15 * cmax * s) / fine;
      roots = roots.map((z, i) => [z[0], z[1] + (i % 2 ? 1e-4 : -1e-4)]);
      for (let it = 0; it < 80; it++) roots = dkStep(coefOf(c), roots);
      roots.forEach((z, i) => track[i].push(z));
      if (s % 12 === 0) hist.push(roots.map((z) => z.slice()));
    }
    for (const tr of track) o += path(d(tr.map(([re, im]) => [X(re), Y(im)])), 'mute');
    for (let i = 0; i < nr; i++) o += acircle(fr.map((f) => X(hist[f][i][0])), fr.map((f) => Y(hist[f][i][1])), kt, T, 4.5, 'ln-f');
    const tf = fr.map((f) => (f === N - 1 ? f : f - (f % 3)));
    for (let k = 0; k < N; k++) if (k % 3 === 0 || k === N - 1) {
      const c = cs[k];
      o += only(k, tf, kt, T, text(C[0], 214, `c = ${c.toFixed(3)}`, c > cmax ? 'tl' : 'ts', 'middle'));
    }
  });
  return svgA(560, 226, o, '动图：d = 0、1、2 三种 delay 下 z^{d+1} − z^d + c = 0 的 root（彩色点）与 unit circle（虚线），灰线是 c 从 0 增大时 root 走过的路线。Root 在 θ = 180°、60°、36° 处穿出 unit circle，对应 c_max = 2、1、0.618');
}

// ---------- 5. Negative autoregulation 的 rate balance ----------
function nar() {
  let o = '';
  const panels = [
    { x0: 46, title: 'simple regulation', prod: (b) => () => b, bs: [2, 2.4], xs: [2, 2.4], lab: '+20%' },
    { x0: 322, title: 'negative autoregulation（n = 2）', prod: (b) => (x) => b / (1 + x * x), bs: [10, 12], xs: [2, 2.1440404], lab: '+7.2%' },
  ];
  const w = 210, top = 34, H = 176;
  panels.forEach((pn, pi) => {
    const sx = lin(0, 3.2, pn.x0, pn.x0 + w), sy = lin(0, 4, top + H, top);
    o += text(pn.x0 + w / 2, top - 14, pn.title, 'tb', 'middle');
    o += line(pn.x0, top, pn.x0, top + H, 'axis') + line(pn.x0, top + H, pn.x0 + w, top + H, 'axis');
    for (const v of [0, 1, 2, 3]) o += line(sx(v), top + H, sx(v), top + H + 4, 'axis') + text(sx(v), top + H + 16, String(v), 'ts', 'middle');
    for (const v of [0, 2, 4]) o += text(pn.x0 - 6, sy(v) + 4, String(v), 'ts', 'end');
    o += text(pn.x0 + w, top + H + 30, 'x', 'ts', 'end');
    if (pi === 0) o += text(pn.x0 - 8, top - 16, 'rate', 'ts', 'end');
    // removal
    o += path(d([[sx(0), sy(0)], [sx(3.2), sy(3.2)]]), 'ink-b');
    o += text(sx(3.1) - 4, sy(3.1) - 6, 'removal αx', 'ts', 'end');
    // production
    pn.bs.forEach((b, j) => {
      const F = pn.prod(b);
      const pts = [];
      for (let i = 0; i <= 200; i++) { const x = (3.2 * i) / 200; const y = F(x); if (y <= 4) pts.push([sx(x), sy(y)]); }
      o += path(d(pts), j === 0 ? 'ln' : 'ln-dash');
    });
    // intersection
    pn.xs.forEach((x, j) => { o += line(sx(x), sy(x), sx(x), top + H, 'grid') + circle(sx(x), sy(x), 4.5, j === 0 ? 'ln-f' : 'paper'); });
    const yb = top + H - 18;
    o += arrow(sx(pn.xs[0]), yb, sx(pn.xs[1]), yb, 'ink', 5) + text((sx(pn.xs[0]) + sx(pn.xs[1])) / 2, yb - 7, pn.lab, 'tb', 'middle');
  });
  // 标注
  {
    const sx = lin(0, 3.2, 46, 256), sy = lin(0, 4, 210, 34);
    o += text(sx(0.15), sy(2) - 6, 'production β = 2', 'ts', 'start');
    o += text(sx(0.15), sy(2.4) - 6, '×1.2', 'ts', 'start');
  }
  {
    const sx = lin(0, 3.2, 322, 532), sy = lin(0, 4, 210, 34);
    o += text(sx(1.12), sy(3.7), '10/(1 + x²)', 'ts', 'end');
    o += text(sx(1.75), sy(3.55), '×1.2', 'ts', 'start');
    // tangent slope −1.6
    const tl = (x) => 2 - 1.6 * (x - 2);
    o += path(d([[sx(1.55), sy(tl(1.55))], [sx(2.45), sy(tl(2.45))]]), 'ink');
    o += text(sx(2.42), sy(0.72), 'slope −1.6', 'ts', 'start');
  }
  return svg(560, 250, o, '两张 rate balance 图：直线是 removal αx，彩色 curve 是 production，虚线是 production 加强 20% 之后。左边 simple regulation 的 intersection 从 2 移到 2.4，右边 negative autoregulation 只从 2 移到 2.144，intersection 处 production 的 slope −1.6 就是 loop gain');
}

// ---------- 6. Keynesian cross 与 climate：同一个阶梯 ----------
function crossA() {
  let o = '';
  const pans = [
    { x0: 50, lo: 880, hi: 1020, A: 225, f: 0.75, start: 1000, old: 250, title: 'EC1101E：Z = 225 + 0.75Y', ticks: [900, 950, 1000], xl: 'Y', fin: 900, finlab: 'Y* = 900', rounds: '每轮：−25，−18.75，−14.06，…', rx: 884, ry: 1008, ra: 'start' },
    { x0: 326, lo: 0, hi: 3.4, A: 0.99, f: 0.67, start: 0, old: null, title: 'GE1101E：ΔT' + sub('new') + ' = 0.99 + 0.67ΔT', ticks: [0, 1, 2, 3], xl: 'ΔT（K）', fin: 3.0, finlab: 'ΔT* = 3.0 K', rounds: '每轮：+0.99，+0.66，+0.44，…', rx: 3.35, ry: 0.25, ra: 'end' },
  ];
  const w = 196, top = 34, H = 196;
  const Nst = 12;
  const nodes = [];
  pans.forEach((pn) => {
    const sx = lin(pn.lo, pn.hi, pn.x0, pn.x0 + w), sy = lin(pn.lo, pn.hi, top + H, top);
    o += text(pn.x0 + w / 2, top - 16, pn.title, 'tb', 'middle');
    o += line(pn.x0, top, pn.x0, top + H, 'axis') + line(pn.x0, top + H, pn.x0 + w, top + H, 'axis');
    for (const v of pn.ticks) o += line(sx(v), top + H, sx(v), top + H + 4, 'axis') + text(sx(v), top + H + 16, String(v), 'ts', 'middle') + text(pn.x0 - 6, sy(v) + 4, String(v), 'ts', 'end');
    o += text(pn.x0 + w, top + H + 30, pn.xl, 'ts', 'end');
    o += path(d([[sx(pn.lo), sy(pn.lo)], [sx(pn.hi), sy(pn.hi)]]), 'ink');
    o += text(sx(pn.hi) + 4, sy(pn.hi) + 4, '45°', 'ts', 'start');
    const Z = (x) => pn.A + pn.f * x;
    o += path(d([[sx(pn.lo), sy(Z(pn.lo))], [sx(pn.hi), sy(Z(pn.hi))]]), 'ln');
    if (pn.old !== null) { o += path(d([[sx(pn.lo), sy(pn.old + pn.f * pn.lo)], [sx(pn.hi - 20), sy(pn.old + pn.f * (pn.hi - 20))]]), 'dash'); o += text(sx(882), sy(950), 'shock 之前', 'ts', 'start'); }
    // 阶梯
    let x = pn.start; const pts = [[sx(x), sy(x)]];
    const seq = [];
    for (let k = 0; k < Nst; k++) { const y = Z(x); pts.push([sx(x), sy(y)]); seq.push(y - x); x = y; pts.push([sx(x), sy(x)]); }
    o += path(d(pts), 'mute');
    o += text(sx(pn.rx), sy(pn.ry), pn.rounds, 'ts', pn.ra);
    o += circle(sx(pn.fin), sy(pn.fin), 4, 'paper');
    o += pn.old !== null ? text(sx(pn.fin) + 6, sy(pn.fin) + 18, pn.finlab, 'tl', 'start') : text(sx(2.85), sy(3.3), pn.finlab, 'tl', 'end');
    nodes.push(pts);
  });
  // 动画：点沿阶梯走
  const M = nodes[0].length;
  const { kt, fr, T } = frames(M, 1.0, 0.45, 1.5);
  for (const pts of nodes) o += acircle(fr.map((f) => pts[f][0]), fr.map((f) => pts[f][1]), kt, T, 4.8, 'ln-f');
  return svgA(560, 266, o, '动图：左边 Keynesian cross，investment 少 25 后 Z 线下移，阶梯从 1000 逐轮走到 900，每轮少掉上一轮的 0.75；右边 climate 写成同一形式，Planck response 0.99 K 之后每轮多出上一轮的 0.67，阶梯走到 3.0 K');
}

// ---------- 7. Cobweb ----------
function cobwebA() {
  let o = '';
  const pans = [
    { x0: 48, S: (P) => (P - 10) / 2, Sinv: (Q) => 10 + 2 * Q, title: 'Q' + sub('S') + ' = (P − 10)/2：supply 陡', steps: 8, q: [12, 30], p: [42, 60], qt: [15, 20, 25], pt: [45, 50, 55] },
    { x0: 324, S: (P) => 1.25 * (P - 34), Sinv: (Q) => 34 + 0.8 * Q, title: 'Q' + sub('S') + ' = 1.25(P − 34)：supply 平', steps: 4, q: [0, 40], p: [25, 75], qt: [0, 20, 40], pt: [25, 50, 75] },
  ];
  const w = 200, top = 34, H = 178;
  const all = [];
  pans.forEach((pn, pi) => {
    const sx = lin(pn.q[0], pn.q[1], pn.x0, pn.x0 + w), sy = lin(pn.p[0], pn.p[1], top + H, top);
    o += text(pn.x0 + w / 2, top - 16, pn.title, 'tb', 'middle');
    o += line(pn.x0, top, pn.x0, top + H, 'axis') + line(pn.x0, top + H, pn.x0 + w, top + H, 'axis');
    for (const v of pn.qt) o += line(sx(v), top + H, sx(v), top + H + 4, 'axis') + text(sx(v), top + H + 16, String(v), 'ts', 'middle');
    for (const v of pn.pt) o += text(pn.x0 - 6, sy(v) + 4, String(v), 'ts', 'end');
    o += text(pn.x0 + w, top + H + 30, 'Q', 'ts', 'end');
    if (pi === 0) o += text(pn.x0 - 28, top - 4, 'P', 'ts', 'start');
    const qa = Math.max(pn.q[0], 70 - pn.p[1]), qb = Math.min(pn.q[1], 70 - pn.p[0]);
    o += path(d([[sx(qa), sy(70 - qa)], [sx(qb), sy(70 - qb)]]), 'ink');
    o += text(sx(qa + 1) + 4, sy(70 - qa) + 2, 'demand', 'ts', 'start');
    const slope = pi === 0 ? 2 : 0.8, icp = pi === 0 ? 10 : 34;
    const q0 = Math.max(pn.q[0], (pn.p[0] - icp) / slope), q1 = Math.min(pn.q[1], (pn.p[1] - icp) / slope);
    o += path(d([[sx(q0), sy(pn.Sinv(q0))], [sx(q1), sy(pn.Sinv(q1))]]), 'ln');
    o += text(sx(q1) + (pi === 0 ? 6 : -2), sy(pn.Sinv(q1)) + (pi === 0 ? 12 : -8), 'supply', 'tl', pi === 0 ? 'start' : 'end');
    // 路线：从 P0 = 56 出发
    let P = 56; const pts = []; const seq = [P];
    let Q = pn.S(P); pts.push([sx(Q), sy(P)]);
    for (let k = 0; k < pn.steps; k++) {
      const P2 = 70 - Q; pts.push([sx(Q), sy(P2)]);
      P = P2; seq.push(P); Q = pn.S(P);
      if (k < pn.steps - 1) pts.push([sx(Q), sy(P)]);
    }
    for (let k = 0; k < 3; k++) { P = 70 - Q; seq.push(P); Q = pn.S(P); }
    o += path(d(pts), 'mute');
    o += circle(sx(20), sy(50), 3, 'ink-f');
    o += circle(pts[0][0], pts[0][1], 4, 'paper');
    const shown = seq.slice(0, 6).map((v) => (Math.round(v * 10) / 10).toString());
    o += text(pn.x0 + w / 2, top + H + 48, 'P：' + shown.join('，'), 'ts', 'middle');
    all.push(pts);
  });
  const M = Math.max(...all.map((p) => p.length));
  const { kt, fr, T } = frames(M, 1.0, 0.5, 1.6);
  for (const pts of all) o += acircle(fr.map((f) => pts[Math.min(f, pts.length - 1)][0]), fr.map((f) => pts[Math.min(f, pts.length - 1)][1]), kt, T, 5, 'ln-f');
  return svgA(560, 290, o, '动图：两个 market 的 cobweb。点按“横着走到 supply（按上季 price 定产量）、竖着走到 demand（按产量定 price）”一季一季走。左边 supply 陡，转着圈收进 (20, 50)；右边 supply 平，转着圈甩出去');
}

// ---------- 8. El Niño 的 delayed oscillator ----------
function ensoA() {
  const al = 0.75, tau = 4, dt = 0.002;
  const n = Math.round(220 / dt), dl = Math.round(tau / dt);
  const x = new Float64Array(n + 1); x[0] = 0.6;
  for (let k = 0; k < n; k++) { const xd = k - dl >= 0 ? x[k - dl] : 0.6; x[k + 1] = x[k] + dt * (x[k] - al * xd - x[k] ** 3); }
  // 取最后一段：找一个向上穿过 0 的时刻，往后画 34 个单位
  let k0 = Math.round(170 / dt);
  while (!(x[k0] <= 0 && x[k0 + 1] > 0)) k0++;
  const span = 36, sampleEvery = Math.round(0.25 / dt);
  const ser = [];
  for (let k = k0 - dl; k <= k0 + Math.round(span / dt); k += sampleEvery) ser.push([(k - k0) * dt, x[k]]);
  let o = '';
  // 上：截面
  const L0 = 40, L1 = 520, sea = 58;
  o += line(L0, sea, L1, sea, 'ink');
  o += text(L0, sea - 22, 'west：warm pool', 'ts', 'start') + text(L1, sea - 22, 'east：cold tongue', 'ts', 'end');
  const thermo = (T) => { const yw = sea + 96, ye = sea + 34 + 22 * T; const pts = []; for (let i = 0; i <= 40; i++) { const s = i / 40; pts.push([L0 + (L1 - L0) * s, yw + (ye - yw) * (0.5 - 0.5 * Math.cos(Math.PI * s))]); } return pts; };
  // 帧
  const fidx = []; for (let i = 0; i < ser.length; i++) if (ser[i][0] >= 0) fidx.push(i);
  const N = fidx.length;
  const { kt, fr, T } = frames(N, 0.8, 0.075, 0.8);
  const warmArea = (Tv) => { const p = thermo(Tv); return d([[L0, sea], ...p, [L1, sea]]) + 'Z'; };
  o += apath(fr.map((f) => warmArea(ser[fidx[f]][1])), kt, T, 'wash');
  o += apath(fr.map((f) => d(thermo(ser[fidx[f]][1]))), kt, T, 'ln');
  o += text(L0 + 6, sea + 112, 'thermocline', 'ts', 'start');
  // trade winds 箭头：长度随 −T
  const wy = sea - 8, wx = 300;
  const wlen = (Tv) => 70 - 40 * Tv;
  o += apath(fr.map((f) => { const l = wlen(ser[fidx[f]][1]); return d([[wx + l / 2, wy], [wx - l / 2 + 6, wy]]); }), kt, T, 'ink-b');
  o += apath(fr.map((f) => { const xl = wx - wlen(ser[fidx[f]][1]) / 2; return d([[xl, wy], [xl + 10, wy - 5], [xl + 10, wy + 5]]) + 'Z'; }), kt, T, 'ink-f');
  o += text(wx, wy - 8, 'trade winds', 'ts', 'middle');
  for (let k = 0; k < N; k += 4) {
    const Tv = Math.round(ser[fidx[k]][1] * 100) / 100 + 0;
    const lab = Tv > 0.3 ? 'El Niño 一侧' : Tv < -0.3 ? 'La Niña 一侧' : '';
    const tf = fr.map((f) => f - (f % 4));
    o += only(k, tf, kt, T, text(L1, sea - 6, `T = ${fmt(Tv, 2)}` + (lab ? '（' + lab + '）' : ''), 'tb', 'end'));
  }
  // 下：T(t)
  const P0 = 60, P1 = 540, yT = lin(-1.4, 1.4, 296, 196);
  const sxT = lin(-tau, span, P0, P1);
  o += line(P0, yT(0), P1, yT(0), 'axis') + line(sxT(0), yT(-1.4), sxT(0), yT(1.4), 'grid');
  for (const v of [-1, 0, 1]) o += text(P0 - 6, yT(v) + 4, String(v), 'ts', 'end');
  o += text(P0 - 30, 190, 'T', 'ts', 'start');
  o += path(d(ser.map(([t, v]) => [sxT(t), yT(v)])), 'mute');
  const cur = fr.map((f) => fidx[f]);
  const del = fr.map((f) => fidx[f] - Math.round(tau / 0.25));
  o += acircle(cur.map((i) => sxT(ser[i][0])), cur.map((i) => yT(ser[i][1])), kt, T, 5, 'ln-f');
  o += acircle(del.map((i) => sxT(ser[i][0])), del.map((i) => yT(ser[i][1])), kt, T, 4.5, 'paper');
  o += apath(fr.map((f, j) => d([[sxT(ser[del[j]][0]), yT(1.3)], [sxT(ser[cur[j]][0]), yT(1.3)]])), kt, T, 'ink');
  o += apath(fr.map((f, j) => d([[sxT(ser[cur[j]][0]), yT(1.3) - 4], [sxT(ser[cur[j]][0]), yT(1.3) + 4]])), kt, T, 'ink');
  const lbl = `<text x="${f1(sxT(-tau / 2))}" y="${f1(yT(1.3) - 6)}" class="ts" text-anchor="middle">τ${anim('x', fr.map((f, j) => f1((sxT(ser[cur[j]][0]) + sxT(ser[del[j]][0])) / 2)), kt, T)}</text>`;
  o += lbl;
  o += text(P1, yT(-1.4) + 14, 't（以 Bjerknes 的 growth time 为单位），τ = 4', 'ts', 'end');
  return svgA(560, 314, o, '动图：上面是 equatorial Pacific 的截面，thermocline 东端和 trade winds 的长度随 T 变化；下面是 Suarez–Schopf delayed oscillator 在 τ = 4 时的 T(t)，实心点是现在的 T，空心点是 τ 以前的 T，即此刻起作用的 negative feedback');
}

export default {
  'thread-feedback-current': currentA,
  'thread-feedback-pole': poleA,
  'thread-feedback-margin': marginA,
  'thread-feedback-zroots': zrootsA,
  'thread-feedback-nar': nar,
  'thread-feedback-cross': crossA,
  'thread-feedback-cobweb': cobwebA,
  'thread-feedback-enso': ensoA,
};
