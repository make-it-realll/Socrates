import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ================= 模型（正文里的数字都由这些函数算出） =================

// SIR：s, i, r 是 fraction，R0 = beta/gamma，时间单位是 day
export function sir(R0, gamma, i0, days, dt = 0.02) {
  const beta = R0 * gamma;
  let s = 1 - i0, i = i0, r = 0;
  const out = [[0, s, i, r]];
  const n = Math.round(days / dt), every = Math.round(1 / dt);
  for (let k = 1; k <= n; k++) {
    const f = (S, I) => [-beta * S * I, beta * S * I - gamma * I];
    const [a1, b1] = f(s, i), [a2, b2] = f(s + a1 * dt / 2, i + b1 * dt / 2), [a3, b3] = f(s + a2 * dt / 2, i + b2 * dt / 2), [a4, b4] = f(s + a3 * dt, i + b3 * dt);
    s += (a1 + 2 * a2 + 2 * a3 + a4) * dt / 6;
    i += (b1 + 2 * b2 + 2 * b3 + b4) * dt / 6;
    r = 1 - s - i;
    if (k % every === 0) out.push([k * dt, s, i, r]);
  }
  return out;
}
export const finalSize = (R0) => { let z = 0.9; for (let k = 0; k < 500; k++) z = 1 - Math.exp(-R0 * z); return z; };

// Prevalence 的 stock-flow：dp/dt = I(1-p) - p/D
export const prevAt = (I, D, p0, t) => { const pinf = (I * D) / (1 + I * D), tau = 1 / (I + 1 / D); return pinf + (p0 - pinf) * Math.exp(-t / tau); };

// Demographic transition 的示意 rate（per 1000 per year）
export const deathRate = (t) => 10 + 28 / (1 + Math.exp((t - 1820) / 25));
export const birthRate = (t) => 12 + 28 / (1 + Math.exp((t - 1890) / 20));
export function popPath() { // N(t)/N(1700)，按年积分
  const out = [[1700, 1]]; let ln = 0;
  for (let t = 1700; t < 2000; t++) { ln += (birthRate(t + 0.5) - deathRate(t + 0.5)) / 1000; out.push([t + 1, Math.exp(ln)]); }
  return out;
}

// Competing risks：infection hazard c（常数）+ chronic hazard A e^{Ba}
const GA = 3e-5, GB = 0.09;
export function compete(c) {
  const dt = 0.1; let s = 1, e0 = 0, inf = 0, chr = 0; const S = [[0, 1]];
  for (let k = 0; k < 1200; k++) {
    const a = (k + 0.5) * dt, hc = GA * Math.exp(GB * a), sm = s * Math.exp(-(c + hc) * dt / 2);
    e0 += sm * dt; inf += sm * c * dt; chr += sm * hc * dt;
    s *= Math.exp(-(c + hc) * dt);
    if ((k + 1) % 10 === 0) S.push([(k + 1) * dt, s]);
  }
  return { e0, inf, chr, S };
}

// Cohort-component projection（one-sex，female；male 按出生 sex ratio 1.05 同样 survival）
const PB = 0.09;
const fam = (l) => { const c = Math.exp(Math.log(0.03) * (1 - l) + Math.log(0.0003) * l), A = Math.exp(Math.log(1.5e-4) * (1 - l) + Math.log(2.5e-5) * l); return (a) => c + A * Math.exp(PB * a); };
function lifeL(h) {
  let s = 1, e = 0; const L = new Array(21).fill(0), dt = 0.05;
  for (let k = 0; k < 120 / dt; k++) { const a = (k + 0.5) * dt, g = Math.floor(a / 5), sm = s * Math.exp(-h(a) * dt / 2); if (g < 21) L[g] += sm * dt; e += sm * dt; s *= Math.exp(-h(a) * dt); }
  return { L, e0: e };
}
const mcache = {};
export function mortality(e0) {
  const key = e0.toFixed(1);
  if (mcache[key]) return mcache[key];
  let lo = 0, hi = 1;
  for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (lifeL(fam(m)).e0 < e0) lo = m; else hi = m; }
  return (mcache[key] = lifeL(fam((lo + hi) / 2)));
}
const ASF = [0.05, 0.2, 0.28, 0.25, 0.15, 0.06, 0.01]; // 15–19 … 45–49 的 fertility 占比
const FF = 1 / 2.05;
export function step(F, m, tfr) {
  const n = new Array(20).fill(0), L = m.L;
  for (let g = 0; g < 19; g++) n[g + 1] = (F[g] * L[g + 1]) / L[g];
  let births = 0;
  for (let k = 0; k < 7; k++) births += 5 * ((tfr * ASF[k]) / 5) * 0.5 * (F[3 + k] + n[3 + k]);
  n[0] = (births * FF * L[0]) / 5;
  return n;
}
export const total = (F) => F.reduce((a, b) => a + b, 0) * 2.05;
export const supportRatio = (F) => { let w = 0, o = 0; for (let g = 4; g < 13; g++) w += F[g]; for (let g = 13; g < 20; g++) o += F[g]; return w / o; };
export const share65 = (F) => { let o = 0; for (let g = 13; g < 20; g++) o += F[g]; return o / F.reduce((a, b) => a + b, 0); };
export function stable(m, tfr) { let F = new Array(20).fill(1); for (let k = 0; k < 200; k++) { F = step(F, m, tfr); const t = F.reduce((a, b) => a + b); F = F.map((x) => x / t); } return F; }
export function replacementTFR(m) {
  let lo = 1, hi = 4;
  for (let k = 0; k < 60; k++) { const x = (lo + hi) / 2, F = stable(m, x), g = step(F, m, x).reduce((a, b) => a + b); if (g < 1) lo = x; else hi = x; }
  return (lo + hi) / 2;
}
export function momentumRun() {
  const m = mortality(70), rep = replacementTFR(m);
  let F = stable(m, 5); const frames = [{ y: 0, F, tfr: 5 }];
  for (let y = 5; y <= 100; y += 5) { F = step(F, m, rep); frames.push({ y, F, tfr: rep }); }
  return { frames, rep };
}
const interp = (pts) => (t) => { if (t <= pts[0][0]) return pts[0][1]; for (let k = 1; k < pts.length; k++) if (t <= pts[k][0]) { const [a, x] = pts[k - 1], [b, y] = pts[k]; return x + ((y - x) * (t - a)) / (b - a); } return pts[pts.length - 1][1]; };
export const sgTFR = interp([[1957, 6.0], [1960, 6.0], [1975, 2.1], [1987, 1.44], [2014, 1.25], [2019, 1.14], [2020, 1.10], [2023, 0.97], [2024, 0.97], [2025, 0.87]]);
export const sgE0 = interp([[1900, 30], [1950, 60], [1970, 68], [2000, 78], [2020, 83], [2060, 87]]);
export function sgRun() {
  let F = stable(mortality(30), 6.0); const out = {};
  for (let y = 1900; y <= 2070; y += 5) { out[y] = F; F = step(F, mortality(sgE0(y + 2.5)), sgTFR(y + 2.5)); }
  return out;
}

// ================= 图 =================

const pct = (v, k = 0) => (v * 100).toFixed(k) + '%';

// 开头：两个 population，每个 age group 都是 B 的 death rate 高，crude rate 却是 A 高
const POP = {
  A: { w: [0.2, 0.65, 0.15], r: [0.5, 2.5, 40] },
  B: { w: [0.3, 0.63, 0.07], r: [1.0, 3.0, 50] },
};
const crude = (p) => p.w.reduce((s, w, k) => s + w * p.r[k], 0);
function intro() {
  const ages = ['0–14', '15–64', '65+'];
  let o = '';
  const panel = (cx, key, title) => {
    const p = POP[key], s = 300; // 1.0 的 share = 300 px 总宽
    o += text(cx, 20, title, 'tb', 'middle');
    p.w.forEach((w, k) => {
      const y = 168 - k * 50, half = (w * s) / 2;
      o += text(cx, y - 6, ages[k] + ' 岁占 ' + pct(w) + '，death rate ' + p.r[k] + '‰', 'ts', 'middle');
      o += rect(cx - half, y, 2 * half, 22, k === 2 ? 'wash-strong' : 'wash');
    });
    o += text(cx, 218, 'crude death rate = ' + String(+crude(p).toFixed(3)) + '‰', 'tl', 'middle');
  };
  panel(140, 'A', 'Population A（年龄结构偏老）');
  panel(420, 'B', 'Population B（年龄结构偏年轻）');
  o += text(280, 246, '三个 age group 里都是 B 的 death rate 更高，crude death rate 却是 A 更高。', 'ts', 'middle');
  o += text(280, 263, '条的宽度是该 age group 占 population 的比例，‰ 是每 1000 人每年的 death 数。', 'ts', 'middle');
  return svg(560, 270, o, '两个三层的 population pyramid：A 偏老，B 偏年轻；每层 B 的 death rate 都更高，但 A 的 crude death rate 千分之 7.725 高于 B 的 5.69');
}

// 第 1 站：6 个人的 follow-up timeline
function cohort() {
  const sx = lin(0, 5, 110, 520), y0 = 46, gap = 30;
  // [label, enter, exit, exitKind, sick intervals]
  const P = [
    ['P1', 0, 5, 'end', []],
    ['P2', 0, 5, 'end', [[2, 5]]],
    ['P3', 0, 3, 'lost', []],
    ['P4', 0, 5, 'end', [[0, 5]]],
    ['P5', 0, 5, 'end', [[3.5, 4.5]]],
    ['P6', 1, 5, 'end', []],
  ];
  let o = '';
  for (let t = 0; t <= 5; t++) o += line(sx(t), y0 - 14, sx(t), y0 + gap * 5 + 14, 'grid') + text(sx(t), y0 + gap * 5 + 30, 'year ' + t, 'ts', 'middle');
  o += line(sx(4), y0 - 18, sx(4), y0 + gap * 5 + 14, 'ln-dash') + text(sx(4) - 6, y0 - 24, 'point prevalence 在 t = 4', 'tl', 'end');
  P.forEach(([lab, a, b, kind, sick], k) => {
    const y = y0 + k * gap;
    o += text(60, y + 4, lab, 'tb', 'end');
    const atRiskEnd = sick.length && sick[0][0] > a ? sick[0][0] : sick.length ? a : b;
    o += line(sx(a), y, sx(b), y, 'mute');
    if (atRiskEnd > a) o += line(sx(a), y, sx(atRiskEnd), y, 'ink-b');
    for (const [u, v] of sick) o += rect(sx(u), y - 6, sx(v) - sx(u), 12, 'solid');
    if (sick.length && sick[0][0] > a) o += circle(sx(sick[0][0]), y, 4, 'ink-f');
    if (kind === 'lost') o += text(sx(b) + 6, y + 4, '× 失联', 'ts');
    if (a > 0) o += circle(sx(a), y, 3, 'paper') + text(sx(a) - 6, y + 4, '入组', 'ts', 'end');
    const pt = atRiskEnd - a;
    o += text(552, y + 4, pt ? pt + ' PY' : '0 PY', 'ts', 'end');
  });
  const ly = y0 + gap * 5 + 52;
  o += line(110, ly, 140, ly, 'ink-b') + text(146, ly + 4, 'at risk（计入 person-time）', 'ts');
  o += rect(310, ly - 6, 30, 12, 'solid') + text(346, ly + 4, '患病', 'ts');
  o += circle(400, ly, 4, 'ink-f') + text(410, ly + 4, 'onset（new case）', 'ts');
  o += text(552, y0 - 24, 'person-time', 'ts', 'end');
  return svg(560, ly + 10, o, '六个人五年的 follow-up：粗线是 at risk 的时间，色块是患病期间，黑点是 new case 的 onset；person-time 合计 17.5 person-years');
}

// 第 1 站：prevalence 是一个 stock（动图）
function tankA() {
  const I = 0.005, p0 = (I * 10) / (1 + I * 10), T = 60, N = 60;
  const ts = [], ps = [];
  for (let k = 0; k <= N; k++) { const t = (T * k) / N; ts.push(t); ps.push(prevAt(I, 20, p0, t)); }
  const pre = 1.0, run = 9, post = 2.5, dur = pre + run + post;
  const kt = [0, ...ts.map((t) => (pre + (run * t) / T) / dur), 1];
  const seq = [ps[0], ...ps, ps[N]];
  // 左：tank
  const tx = 70, tw = 150, ty = 50, th = 170, lvl = lin(0, 0.12, ty + th, ty);
  let o = text(tx + tw / 2, 22, '有这种病的人（stock）', 'tb', 'middle');
  const waterD = (p) => d([[tx, lvl(p)], [tx + tw, lvl(p)], [tx + tw, ty + th], [tx, ty + th]]) + 'Z';
  o += apath(seq.map(waterD), kt, dur, 'wash-strong');
  o += path(d([[tx, ty - 6], [tx, ty + th], [tx + tw, ty + th], [tx + tw, ty - 6]]), 'ink-b');
  for (const v of [0.04, 0.08, 0.12]) o += line(tx + tw, lvl(v), tx + tw + 6, lvl(v), 'axis') + text(tx + tw + 9, lvl(v) + 4, pct(v), 'ts');
  o += arrow(tx - 52, ty + 20, tx + 30, ty + 20, 'ln') + text(tx - 54, ty + 8, 'new cases', 'ts', 'start') ;
  o += text(tx - 54, ty + 38, 'I · (1 − p)', 'tl', 'start');
  o += arrow(tx + tw / 2, ty + th, tx + tw / 2, ty + th + 34, 'ink') + text(tx + tw / 2 + 8, ty + th + 26, '离开：cure 或 death，p / D', 'ts', 'start');
  const lab = (p, x, y, cls) => `<text x="${x}" y="${y}" class="${cls}" text-anchor="middle">${p}</text>`;
  o += `<text x="${tx + tw / 2}" y="${f1(lvl(p0) + 18)}" class="tb" text-anchor="middle">p = ${pct(p0, 1)}${anim('y', seq.map((p) => f1(lvl(p) + 18)), kt, dur)}</text>`;
  o += `<g>${lab('D = 10 年', tx + tw / 2, ty - 14, 'ts')}${ashow([1, ...ts.map(() => 0), 0], kt, dur)}</g>`;
  o += `<g opacity="0">${lab('D = 20 年（新 treatment）', tx + tw / 2, ty - 14, 'tl')}${ashow([0, ...ts.map(() => 1), 1], kt, dur)}</g>`;
  // 右：p(t)
  const sx = lin(0, 60, 330, 548), sy = lin(0, 0.1, 220, 50);
  o += axes({ sx, sy, x0: 0, x1: 60, y0: 0, y1: 0.1, xt: [0, 20, 40, 60], yt: [[0, '0'], [0.05, '5%'], [0.1, '10%']], xl: '换 treatment 之后的年数' });
  o += text(330, 30, 'prevalence p(t)', 'tb', 'start');
  o += line(sx(0), sy(0.1 / 1.1), sx(60), sy(0.1 / 1.1), 'dash') + text(sx(60), sy(0.1 / 1.1) - 6, '新的 steady state ' + pct(0.1 / 1.1, 1), 'ts', 'end');
  o += path(curve((t) => prevAt(I, 20, p0, t), 0, 60, sx, sy), 'ln');
  o += acircle(seq.map((p, k) => sx(k === 0 ? 0 : k === seq.length - 1 ? 60 : ts[k - 1])), seq.map(sy), kt, dur, 5, 'ln-f');
  o += text(sx(0) + 6, sy(p0) + 18, '起点 ' + pct(p0, 1), 'ts', 'start');
  o += text(280, 276, 'Incidence I = 5 per 1000 person-years 始终没变；只是 D 从 10 年变成 20 年，水位就涨到将近两倍。', 'ts', 'middle');
  return svgA(560, 284, o, '动图：prevalence 画成水箱里的水位，入水是 new case，出水是 cure 或 death；duration D 从 10 年变为 20 年后，水位从 4.8% 慢慢涨到 9.1%，incidence 不变');
}

// 第 2 站：同一个 population，cohort 和 case-control 两条路
function designs() {
  let o = '';
  o += text(140, 20, 'Cohort：从 exposure 出发往后看', 'tb', 'middle');
  o += text(420, 20, 'Case-control：从 disease 出发往回看', 'tb', 'middle');
  o += line(280, 30, 280, 270, 'grid');
  // cohort
  const box = (x, y, w, h, l1, l2, cls = 'paper') => rect(x, y, w, h, cls, 5) + text(x + w / 2, y + 18, l1, 't', 'middle') + (l2 ? text(x + w / 2, y + 34, l2, 'ts', 'middle') : '');
  o += box(20, 40, 110, 42, 'Exposed', '2000 人', 'wash');
  o += box(150, 40, 110, 42, 'Unexposed', '8000 人');
  o += arrow(75, 84, 75, 118, 'ink') + arrow(205, 84, 205, 118, 'ink');
  o += text(140, 106, 'follow-up', 'ts', 'middle');
  o += box(20, 120, 110, 42, '100 cases', 'risk 5.0%', 'wash');
  o += box(150, 120, 110, 42, '80 cases', 'risk 1.0%');
  o += text(140, 192, 'RR = 5.0% / 1.0% = 5.0', 'tl', 'middle');
  o += text(140, 212, '能直接算 risk，因为分母', 'ts', 'middle') + text(140, 228, '就是 exposed 和 unexposed 的人数', 'ts', 'middle');
  // case-control
  o += box(300, 40, 110, 42, '全部 cases', '180 人', 'wash');
  o += box(430, 40, 110, 42, 'Controls', '491 人（1/20）');
  o += arrow(355, 118, 355, 84, 'ink') + arrow(485, 118, 485, 84, 'ink');
  o += text(420, 106, '回头问 exposure', 'ts', 'middle');
  o += box(300, 120, 110, 42, 'exposed 100', 'unexposed 80', 'wash');
  o += box(430, 120, 110, 42, 'exposed 95', 'unexposed 396');
  o += text(420, 192, 'OR = (100 × 396) / (95 × 80) = ' + ((100 * 396) / (95 * 80)).toFixed(2), 'tl', 'middle');
  o += text(420, 212, '和整个 population 的 OR 一样；', 'ts', 'middle') + text(420, 228, '“100/195 = 51%”不是 risk', 'ts', 'middle');
  o += text(280, 258, '同一个 10,000 人的 population（CDC Lesson 3 Table 3.15）：', 'ts', 'middle') + text(280, 274, 'exposed 2000 人中 100 例，unexposed 8000 人中 80 例。', 'ts', 'middle');
  return svg(560, 280, o, '左边 cohort design 从 exposed 与 unexposed 出发 follow-up，算出 risk ratio 5.0；右边 case-control 取全部 180 个 case 和 491 个 control 回头问 exposure，算出 odds ratio 5.21');
}

// 第 3 站：crude rate 的差拆成两部分
function decomp() {
  const A = crude(POP.A), Bc = crude(POP.B);
  const wbar = POP.A.w.map((w, k) => (w + POP.B.w[k]) / 2), rbar = POP.A.r.map((r, k) => (r + POP.B.r[k]) / 2);
  const ageP = POP.A.w.reduce((s, w, k) => s + (w - POP.B.w[k]) * rbar[k], 0);
  const rateP = wbar.reduce((s, w, k) => s + w * (POP.A.r[k] - POP.B.r[k]), 0);
  const sy = lin(0, 10, 230, 40), bw = 70;
  let o = axes({ sx: (x) => x, sy, x0: 60, x1: 540, y0: 0, y1: 10, yt: [0, 2, 4, 6, 8, 10], yl: 'crude death rate（‰）' });
  const xs = [100, 210, 320, 430];
  o += rect(xs[0], sy(Bc), bw, sy(0) - sy(Bc), 'wash2') + text(xs[0] + bw / 2, sy(Bc) - 8, Bc.toFixed(2), 'tb', 'middle') + text(xs[0] + bw / 2, 250, 'B 的 crude', 'ts', 'middle');
  o += rect(xs[1], sy(Bc + ageP), bw, sy(Bc) - sy(Bc + ageP), 'wash-strong') + text(xs[1] + bw / 2, sy(Bc + ageP) - 8, '+' + ageP.toFixed(2), 'tb', 'middle');
  o += text(xs[1] + bw / 2, 250, '年龄结构的差', 'ts', 'middle') + text(xs[1] + bw / 2, 266, 'A 老人多', 'ts', 'middle');
  o += rect(xs[2], sy(Bc + ageP), bw, sy(A) - sy(Bc + ageP), 'solid') + text(xs[2] + bw / 2, (sy(Bc + ageP) + sy(A)) / 2 + 5, rateP.toFixed(3).replace('-', '−'), 'tw', 'middle');
  o += text(xs[2] + bw / 2, 250, 'age-specific rate 的差', 'ts', 'middle') + text(xs[2] + bw / 2, 266, 'A 每层都更低', 'ts', 'middle');
  o += rect(xs[3], sy(A), bw, sy(0) - sy(A), 'wash2') + text(xs[3] + bw / 2, sy(A) - 8, A.toFixed(3), 'tb', 'middle') + text(xs[3] + bw / 2, 250, 'A 的 crude', 'ts', 'middle');
  o += line(xs[0] + bw, sy(Bc), xs[1], sy(Bc), 'dash') + line(xs[1] + bw, sy(Bc + ageP), xs[2], sy(Bc + ageP), 'dash') + line(xs[2] + bw, sy(A), xs[3], sy(A), 'dash');
  return svg(560, 272, o, '从 B 的 crude death rate 5.69 出发，年龄结构的差贡献加 3.58，age-specific rate 的差贡献减 1.545，得到 A 的 7.725');
}

// 第 3 站：direct 与 indirect standardization 并排
function smrFig() {
  const ages = ['0–14', '15–64', '65+'];
  const std = POP.A.w.map((w, k) => (w + POP.B.w[k]) / 2);
  const dirA = std.reduce((s, w, k) => s + w * POP.A.r[k], 0), dirB = std.reduce((s, w, k) => s + w * POP.B.r[k], 0);
  const expB = POP.B.w.reduce((s, w, k) => s + w * POP.A.r[k], 0), obsB = crude(POP.B);
  const fmt = (v) => String(+v.toFixed(3)), fw = (v) => v.toFixed(2), fr = (v) => (v < 10 ? v.toFixed(1) : String(v));
  let o = '';
  const top = 58, rh = 34;
  // 一个表：cols = [[x, w, header, (k) => text, cls]]
  const table = (cols) => {
    cols.forEach(([x, w, h1, h2, cell, cls]) => {
      o += text(x + w / 2, top - 22, h1, 'ts', 'middle') + text(x + w / 2, top - 8, h2, 'ts', 'middle');
      for (let k = 0; k < 3; k++) {
        o += rect(x, top + k * rh, w - 4, rh - 4, cls, 3);
        o += text(x + (w - 4) / 2, top + k * rh + 19, cell(k), 't', 'middle');
      }
    });
  };
  o += text(135, 18, 'Direct：同一套 standard weight', 'tb', 'middle');
  table([
    [8, 52, '', 'age', (k) => ages[k], 'wash2'],
    [60, 66, 'standard', 'weight', (k) => fw(std[k]), 'wash-strong'],
    [126, 66, 'A 的', 'rate（‰）', (k) => fr(POP.A.r[k]), 'paper'],
    [192, 66, 'B 的', 'rate（‰）', (k) => fr(POP.B.r[k]), 'paper'],
  ]);
  const yT = top + 3 * rh + 18;
  o += text(135, yT, 'A：Σ weight × rate = ' + fmt(dirA), 't', 'middle');
  o += text(135, yT + 18, 'B：Σ weight × rate = ' + fmt(dirB), 't', 'middle');
  o += text(135, yT + 40, 'CMR = ' + fmt(dirB) + ' / ' + fmt(dirA) + ' = ' + (dirB / dirA).toFixed(2), 'tl', 'middle');
  o += line(280, 10, 280, yT + 56, 'grid');
  o += text(425, 18, 'Indirect：B 自己的 weight', 'tb', 'middle');
  table([
    [298, 52, '', 'age', (k) => ages[k], 'wash2'],
    [350, 66, 'B 的', 'weight', (k) => fw(POP.B.w[k]), 'wash-strong'],
    [416, 66, 'A 的 rate', '（standard）', (k) => fr(POP.A.r[k]), 'paper'],
    [482, 74, 'weight', '× rate', (k) => fmt(POP.B.w[k] * POP.A.r[k]), 'paper'],
  ]);
  o += text(425, yT, 'expected E = ' + fmt(expB) + '（每 1000 人）', 't', 'middle');
  o += text(425, yT + 18, 'B 实际的 crude rate O = ' + fmt(obsB), 't', 'middle');
  o += text(425, yT + 40, 'SMR = O / E = ' + fmt(obsB) + ' / ' + fmt(expB) + ' = ' + (obsB / expB).toFixed(2), 'tl', 'middle');
  return svg(560, yT + 50, o, '左边 direct standardization：标准 weight 0.25、0.64、0.11 分别乘 A 和 B 的 age-specific rate，得到 6.125 和 7.67，CMR 1.25；右边 indirect：B 的 weight 乘 A 的 rate 得到 expected 4.525，B 实际 5.69，SMR 1.26');
}

// 第 4 站：SIR 动图，400 个人的格子 + 三条 curve
function sirA() {
  const R0 = 3, g = 1 / 8.4, days = 160;
  const sol = sir(R0, g, 0.01, days);
  const Np = 400, cols = 20;
  // 每个人的感染时刻与恢复时刻：cumulative incidence 和 r 跨过 (k+0.5)/N 的时刻
  const cross = (idx, thr) => { for (const row of sol) if ((idx === 'inc' ? 1 - row[1] : row[3]) >= thr) return row[0]; return Infinity; };
  // 打乱顺序，让感染的人散开（固定 seed）
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const order = Array.from({ length: Np }, (_, k) => k).sort(() => rnd() - 0.5);
  const pre = 0.6, run = 11, post = 2.4, dur = pre + run + post;
  const tk = (t) => (t === Infinity ? 2 : (pre + (run * t) / days) / dur);
  let o = text(110, 20, '400 个人：S、I、R', 'tb', 'middle');
  const cs = 10.5, gx = 6, gy = 34;
  order.forEach((who, k) => {
    const x = gx + (k % cols) * cs, y = gy + Math.floor(k / cols) * cs;
    const ti = cross('inc', (who + 0.5) / Np), tr = cross('rec', (who + 0.5) / Np);
    o += rect(x, y, cs - 1.5, cs - 1.5, 'paper');
    if (ti < Infinity) {
      const first = ti === 0, a = tk(ti), b = Math.min(tk(tr), 1);
      const vi = first ? (b < 1 ? '1;0' : '1') : b < 1 ? '0;1;0' : '0;1';
      const kti = first ? (b < 1 ? `0;${b.toFixed(4)}` : '0') : b < 1 ? `0;${a.toFixed(4)};${b.toFixed(4)}` : `0;${a.toFixed(4)}`;
      o += `<rect x="${f1(x)}" y="${f1(y)}" width="${cs - 1.5}" height="${cs - 1.5}" class="solid" opacity="${first ? 1 : 0}"><animate attributeName="opacity" values="${vi}" keyTimes="${kti}" dur="${dur}s" repeatCount="indefinite" calcMode="discrete"/></rect>`;
      if (b < 1) o += `<rect x="${f1(x)}" y="${f1(y)}" width="${cs - 1.5}" height="${cs - 1.5}" class="solid2" opacity="0"><animate attributeName="opacity" values="0;1" keyTimes="0;${b.toFixed(4)}" dur="${dur}s" repeatCount="indefinite" calcMode="discrete"/></rect>`;
    }
  });
  const ly = gy + 20 * cs + 16;
  o += rect(gx, ly - 9, 11, 11, 'paper') + text(gx + 16, ly, 'S', 'ts') + rect(gx + 46, ly - 9, 11, 11, 'solid') + text(gx + 62, ly, 'I', 'ts') + rect(gx + 90, ly - 9, 11, 11, 'solid2') + text(gx + 106, ly, 'R（immune）', 'ts');
  // 右：curves
  const sx = lin(0, days, 270, 548), sy = lin(0, 1, 230, 40);
  o += axes({ sx, sy, x0: 0, x1: days, y0: 0, y1: 1, xt: [0, 40, 80, 120, 160], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'day' });
  o += text(270, 22, 'fraction（R₀ = 3，1/γ = 8.4 天）', 'tb', 'start');
  const ptsOf = (j) => d(sol.map((row) => [sx(row[0]), sy(row[j])]));
  o += path(ptsOf(1), 'ink') + path(ptsOf(2), 'ln') + path(ptsOf(3), 'mute');
  let pk = sol[0]; for (const row of sol) if (row[2] > pk[2]) pk = row;
  o += line(sx(pk[0]), sy(0), sx(pk[0]), sy(1), 'dash');
  o += line(sx(pk[0]) + 3, sy(pk[2]) - 3, sx(66) - 4, sy(0.52) + 4, 'mute');
  o += text(sx(66), sy(0.52), 'I 的 peak ' + pct(pk[2]) + '，', 'tl', 'start');
  o += text(sx(66), sy(0.52) + 16, '此刻 s = 1/R₀', 'ts', 'start');
  const last = sol[sol.length - 1];
  o += text(sx(days) - 2, sy(last[1]) - 6, 's → ' + last[1].toFixed(3), 'ts', 'end');
  o += text(sx(days) - 2, sy(last[3]) + 16, 'r → ' + last[3].toFixed(3), 'ts', 'end');
  o += text(sx(12), sy(0.8), 's', 'tb', 'middle');
  // 时间光标
  const tsK = [0, 20, 40, 60, 80, 100, 120, 140, 160];
  const ktC = [0, ...tsK.map(tk), 1];
  const xsC = [sx(0), ...tsK.map(sx), sx(days)];
  o += `<line x1="${f1(xsC[0])}" y1="${f1(sy(0))}" x2="${f1(xsC[0])}" y2="${f1(sy(1))}" class="ln-dash">${anim('x1', xsC.map(f1), ktC, dur)}${anim('x2', xsC.map(f1), ktC, dur)}</line>`;
  o += text(gx, ly + 20, '最后约 6% 的格子始终没有被感染。', 'ts', 'start');
  return svgA(560, ly + 26, o, '动图：400 个人的格子，染色的是正在感染的人，灰色是已经恢复而 immune 的人；右边是 s、i、r 三条 curve，R0 等于 3 时 infected 在 s 等于三分之一时达到 peak，最后约 94% 的人被感染过');
}

// 第 4 站：final size 和 herd immunity threshold
function finalPlot() {
  const sx = lin(1, 5, 70, 520), sy = lin(0, 1, 240, 30);
  let o = axes({ sx, sy, x0: 1, x1: 5, y0: 0, y1: 1, xt: [1, 2, 3, 4, 5], yt: [[0, '0'], [0.25, '25%'], [0.5, '50%'], [0.75, '75%'], [1, '100%']], grid: true, xl: 'R₀' });
  o += path(curve(finalSize, 1.0001, 5, sx, sy, 300), 'ln') + path(curve((R) => 1 - 1 / R, 1, 5, sx, sy), 'ink');
  o += text(sx(4.2), sy(finalSize(4.2)) - 8, 'final size z（最终被感染过的比例）', 'tl', 'end');
  o += text(sx(4.2), sy(1 - 1 / 4.2) + 20, 'herd immunity threshold 1 − 1/R₀', 't', 'middle');
  for (const R of [1.6, 3]) {
    const z = finalSize(R), h = 1 - 1 / R;
    o += line(sx(R), sy(0), sx(R), sy(z), 'dash') + circle(sx(R), sy(z), 4, 'ln-f') + circle(sx(R), sy(h), 4, 'ink-f');
    o += text(sx(R) + 7, sy(z) + 14, pct(z), 'ts', 'start') + text(sx(R) + 7, sy(h) + 14, pct(h), 'ts', 'start');
  }
  o += text(295, 278, '两条 curve 之间的差是 overshoot：peak 之后 I 还很多，感染继续越过 threshold。', 'ts', 'middle');
  return svg(560, 286, o, '横轴 R0 从 1 到 5：final size curve 一直在 herd immunity threshold curve 之上；R0 等于 3 时分别是 94% 和 67%，R0 等于 1.6 时是 64% 和 38%');
}

// 第 5 站：demographic transition（动图）
function transA() {
  const t0 = 1700, t1 = 2000, sx = lin(t0, t1, 60, 360), sy = lin(0, 45, 220, 40);
  const P = popPath(), lnP = (t) => P[Math.round(t - t0)][1];
  let o = axes({ sx, sy, x0: t0, x1: t1, y0: 0, y1: 45, xt: [1700, 1800, 1900, 2000], yt: [0, 10, 20, 30, 40], yl: '每 1000 人每年' });
  o += text(210, 18, 'birth rate 和 death rate（示意）', 'tb', 'middle');
  const frames = []; for (let t = t0; t <= t1; t += 10) frames.push(t);
  const pre = 0.6, run = 10, post = 2.4, dur = pre + run + post;
  const kt = [0, ...frames.map((t) => (pre + (run * (t - t0)) / (t1 - t0)) / dur), 1];
  const seq = [t0, ...frames, t1];
  const partial = (fn, tc) => { const pts = []; for (let t = t0; t <= t1; t += 5) pts.push([sx(Math.min(t, tc)), sy(fn(Math.min(t, tc)))]); return pts; };
  const gapD = (tc) => { const up = partial(birthRate, tc), dn = partial(deathRate, tc).reverse(); return d([...up, ...dn]) + 'Z'; };
  o += path(curve(birthRate, t0, t1, sx, sy), 'ln-dash') + path(curve(deathRate, t0, t1, sx, sy), 'dash');
  o += apath(seq.map(gapD), kt, dur, 'wash');
  o += apath(seq.map((tc) => d(partial(birthRate, tc))), kt, dur, 'ln');
  o += apath(seq.map((tc) => d(partial(deathRate, tc))), kt, dur, 'ink-b');
  o += text(sx(1700) + 4, sy(birthRate(1700)) - 8, 'birth rate', 'tl', 'start');
  o += text(sx(1700) + 4, sy(deathRate(1700)) + 18, 'death rate', 'tb', 'start');
  o += `<g opacity="0">${text(sx(1855), sy(26), '两者之差', 'ts', 'middle')}${text(sx(1855), sy(26) + 15, '= growth rate', 'ts', 'middle')}${ashow(seq.map((t) => t >= 1880), kt, dur)}</g>`;
  // 三段
  for (const [a, b, s] of [[1700, 1780, '①'], [1780, 1950, '②'], [1950, 2000, '③']]) o += text((sx(a) + sx(b)) / 2, 248, s, 'tb', 'middle');
  o += text(210, 266, '① 两个 rate 都高　② death rate 先降、birth rate 晚约 70 年才降　③ 都低', 'ts', 'middle');
  // 右：population 柱
  const by = lin(0, 14, 220, 40), bx = 430, bw = 60;
  o += text(bx + bw / 2, 18, 'population 是 1700 年的几倍', 'tb', 'middle');
  for (const v of [1, 4, 8, 12]) o += line(bx - 6, by(v), bx, by(v), 'axis') + text(bx - 9, by(v) + 4, v + '×', 'ts', 'end');
  o += line(bx, by(0), bx, by(14), 'axis') + line(bx, by(0), bx + bw + 20, by(0), 'axis');
  const barD = (t) => d([[bx + 4, by(lnP(t))], [bx + 4 + bw, by(lnP(t))], [bx + 4 + bw, by(0)], [bx + 4, by(0)]]) + 'Z';
  o += apath(seq.map(barD), kt, dur, 'solid');
  const lab = [1700, 1750, 1800, 1850, 1900, 1950, 2000];
  lab.forEach((t) => {
    const on = seq.map((u, k) => { const nxt = lab.find((x) => x > t); return u >= t && (nxt === undefined || u < nxt); });
    on[0] = t === 1700; on[on.length - 1] = t === 2000;
    o += `<g opacity="${t === 1700 ? 1 : 0}">${text(bx + 4 + bw / 2, by(lnP(t)) - 8, lnP(t).toFixed(1) + '×', 'tb', 'middle')}${text(bx + 4 + bw / 2, 240, String(t), 'ts', 'middle')}${ashow(on, kt, dur)}</g>`;
  });
  return svgA(560, 272, o, '动图：1700 到 2000 年示意的 birth rate 和 death rate 逐年画出，death rate 先降，birth rate 晚约 70 年才降，中间的差是 growth rate；右边柱子显示 population 涨到 1700 年的 12.8 倍');
}

// 第 5 站：competing risks，survival curve 变方
function competeFig() {
  const hi = compete(0.03), lo = compete(0.001);
  const sx = lin(0, 100, 60, 330), sy = lin(0, 1, 230, 40);
  let o = axes({ sx, sy, x0: 0, x1: 100, y0: 0, y1: 1, xt: [0, 20, 40, 60, 80, 100], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'age', grid: true });
  o += text(195, 20, 'survival curve S(a)', 'tb', 'middle');
  const cur = (S, cls) => path(d(S.filter(([a]) => a <= 100).map(([a, s]) => [sx(a), sy(s)])), cls);
  o += cur(lo.S, 'ln') + cur(hi.S, 'ink-b');
  o += text(sx(14), sy(0.7), 'c = 0.001：e₀ = ' + lo.e0.toFixed(1), 'tl', 'start');
  o += text(sx(3), sy(0.08), 'c = 0.03：e₀ = ' + hi.e0.toFixed(1), 'tb', 'start');
  // 右：死因占比
  const bx = 400, bw = 66, by = lin(0, 1, 230, 40);
  o += text(470, 20, '死于哪一类 cause', 'tb', 'middle');
  [[hi, 'c = 0.03'], [lo, 'c = 0.001']].forEach(([m, lab], k) => {
    const x = bx + k * 84, fi = m.inf / (m.inf + m.chr);
    const yc = by(1 - fi);
    o += rect(x, by(1), bw, yc - by(1), 'solid') + rect(x, yc, bw, by(0) - yc, 'wash');
    o += text(x + bw / 2, 250, lab, 'ts', 'middle');
    if (fi > 0.5) { o += text(x + bw / 2, (by(1) + yc) / 2 - 4, 'infection', 'tw', 'middle') + text(x + bw / 2, (by(1) + yc) / 2 + 12, pct(fi), 'tw', 'middle'); }
    else o += text(x + bw / 2, by(1) - 6, 'infection ' + pct(fi), 'ts', 'middle');
    if (1 - fi > 0.5) o += text(x + bw / 2, (yc + by(0)) / 2 - 4, 'chronic', 'ts', 'middle') + text(x + bw / 2, (yc + by(0)) / 2 + 12, pct(1 - fi), 'ts', 'middle');
    else o += text(x + bw / 2, yc + (by(0) - yc) / 2 + 4, 'chronic ' + pct(1 - fi), 'ts', 'middle');
  });
  o += text(280, 284, '两种 hazard：infection 不分年龄 c，chronic disease 随年龄指数增长 0.00003·e^(0.09a)；只改 c。', 'ts', 'middle');
  return svg(560, 292, o, '左图两条 survival curve：infection hazard 从 0.03 降到 0.001，life expectancy 从 30 岁升到 79 岁，curve 变方；右图死因占比从 infection 占 91% 变成 chronic disease 占 92%');
}

// pyramid 画法：F 是 20 个 female age group，male = 1.05 F
function pyrPath(F, cx, yBase, h, k, side) {
  let pts = '';
  for (let g = 0; g < 20; g++) {
    const y = yBase - (g + 1) * h, w = F[g] * (side < 0 ? 1.05 : 1) * k;
    const x0 = side < 0 ? cx - 2 - w : cx + 2, x1 = side < 0 ? cx - 2 : cx + 2 + w;
    pts += d([[x0, y + 0.6], [x1, y + 0.6], [x1, y + h - 0.6], [x0, y + h - 0.6]]) + 'Z';
  }
  return pts;
}
function pyrAxes(cx, yBase, h) {
  let o = '';
  for (const a of [0, 20, 40, 65, 80]) { const y = yBase - (a / 5) * h; o += text(cx - 150, y + 3, String(a), 'ts', 'end') + line(cx - 146, y, cx - 140, y, 'axis'); }
  o += text(cx - 150, yBase - 20 * h - 6, 'age', 'ts', 'end');
  o += line(cx - 140, yBase - 13 * h, cx + 140, yBase - 13 * h, 'grid');
  o += text(cx + 140, yBase - 13 * h - 4, '65', 'ts', 'end');
  o += text(cx - 60, yBase + 16, 'male', 'ts', 'middle') + text(cx + 60, yBase + 16, 'female', 'ts', 'middle');
  return o;
}

// 第 6 站：population momentum（动图）
function momA() {
  const { frames, rep } = momentumRun();
  const N0 = total(frames[0].F);
  const cx = 170, yBase = 236, h = 10, k = 115 / Math.max(...frames.flatMap((f) => f.F.map((x) => x * 1.05)));
  const pre = 1.2, per = 0.5, post = 2.4, dur = pre + per * (frames.length - 1) + post;
  const kt = [0, ...frames.map((f, j) => (pre + per * j) / dur), 1];
  const seq = [0, ...frames.map((f, j) => j), frames.length - 1];
  let o = text(cx, 18, 'TFR 从 5 一下降到 replacement（' + rep.toFixed(2) + '）', 'tb', 'middle');
  o += pyrAxes(cx, yBase, h);
  o += path(pyrPath(frames[0].F, cx, yBase, h, k, -1) + pyrPath(frames[0].F, cx, yBase, h, k, 1), 'ink-s dash');
  for (const side of [-1, 1]) o += apath(seq.map((j) => pyrPath(frames[j].F, cx, yBase, h, k, side)), kt, dur, 'wash-strong', true);
  // 右：读数
  const X = 360;
  o += text(X, 44, 'population 是 t = 0 时的几倍', 'tb', 'start');
  const sxN = lin(0, 100, X, 548), syN = lin(1, 1.7, 200, 70);
  o += axes({ sx: sxN, sy: syN, x0: 0, x1: 100, y0: 1, y1: 1.7, xt: [0, 50, 100], yt: [[1, '1.0'], [1.3, '1.3'], [1.6, '1.6']], xl: '年' });
  o += path(d(frames.map((f) => [sxN(f.y), syN(total(f.F) / N0)])), 'ln');
  o += `<circle cx="${f1(sxN(0))}" cy="${f1(syN(1))}" r="5" class="ln-f">${anim('cx', seq.map((j) => f1(sxN(frames[j].y))), kt, dur, true)}${anim('cy', seq.map((j) => f1(syN(total(frames[j].F) / N0))), kt, dur, true)}</circle>`;
  frames.forEach((f, j) => {
    if (j % 2) return;
    const on = seq.map((q) => q === j || q === j + 1);
    o += `<g opacity="${j === 0 ? 1 : 0}">${text(X, 236, 't = ' + f.y + ' 年：' + (total(f.F) / N0).toFixed(2) + ' 倍', 'tl', 'start')}${ashow(on, kt, dur)}</g>`;
  });
  o += text(X, 256, '虚线框是 t = 0 的 pyramid', 'ts', 'start');
  return svgA(560, 262, o, '动图：TFR 从 5 突然降到 replacement 之后，population pyramid 底部立刻变窄，但大批年轻 cohort 逐年进入生育和老年年龄，population 在 75 年里继续涨到 1.6 倍后停住');
}

// 第 6 站：Singapore 式的 aging（动图）
function sgA() {
  const run = sgRun();
  const years = []; for (let y = 1960; y <= 2060; y += 5) years.push(y);
  const cx = 170, yBase = 236, h = 10;
  const k = 125 / Math.max(...years.flatMap((y) => run[y].map((x) => x * 1.05)));
  const pre = 1.2, per = 0.55, post = 2.4, dur = pre + per * (years.length - 1) + post;
  const kt = [0, ...years.map((y, j) => (pre + per * j) / dur), 1];
  const seq = [0, ...years.map((y, j) => j), years.length - 1];
  let o = text(cx, 18, 'Closed population，TFR 大致沿着 Singapore 的路径', 'tb', 'middle');
  o += pyrAxes(cx, yBase, h);
  for (const side of [-1, 1]) o += apath(seq.map((j) => pyrPath(run[years[j]], cx, yBase, h, k, side)), kt, dur, 'wash-strong', true);
  const X = 360;
  years.forEach((y, j) => {
    const on = seq.map((q) => q === j);
    const F = run[y];
    o += `<g opacity="${j === 0 ? 1 : 0}">${text(X, 60, String(y), 'tbig', 'start')}${text(X, 92, 'TFR ' + sgTFR(y).toFixed(2), 't', 'start')}${text(X, 114, '65+ 占 ' + pct(share65(F), 1), 't', 'start')}${text(X, 136, 'old-age support ratio ' + supportRatio(F).toFixed(1), 'tl', 'start')}${ashow(on, kt, dur)}</g>`;
  });
  o += text(X, 176, 'support ratio = 20–64 岁人数 / 65+ 人数', 'ts', 'start');
  o += text(X, 196, '模型没有 migration；mortality 按假设', 'ts', 'start');
  o += text(X, 212, '的 e₀ 路径（30 岁在 1900 年 → 87 岁', 'ts', 'start');
  o += text(X, 228, '在 2060 年）逐步改善。', 'ts', 'start');
  return svgA(560, 262, o, '动图：从 1960 到 2060 年，一个没有 migration、TFR 从 6 降到 0.87 的 population，pyramid 从底宽的三角形变成上宽下窄；old-age support ratio 从 14.8 降到 1.1');
}

// 第 7 站：causal diagram（toy numbers）
function dag() {
  let o = '';
  const node = (x, y, w, l1, l2, cls = 'paper') => rect(x - w / 2, y - 20, w, 40, cls, 6) + text(x, y - 2, l1, 'tb', 'middle') + (l2 ? text(x, y + 13, l2, 'ts', 'middle') : '');
  o += node(90, 140, 130, 'Employment grade', 'exposure');
  o += node(290, 50, 150, 'Smoking', 'mediator');
  o += node(490, 140, 110, 'CHD', 'outcome', 'wash');
  o += node(290, 230, 150, 'Age', 'confounder', 'wash2');
  o += arrow(150, 122, 216, 66, 'ink') + arrow(366, 66, 438, 122, 'ink');
  o += arrow(156, 140, 433, 140, 'ln');
  o += arrow(250, 210, 150, 160, 'mute') + arrow(330, 210, 438, 160, 'mute');
  o += text(150, 84, '低 grade 61% 吸烟', 'ts', 'end') + text(150, 100, '高 grade 29%', 'ts', 'end');
  o += text(412, 84, 'risk × 2', 'ts', 'start');
  o += text(290, 121, '其余 pathway（job control 等）：risk × 2.5', 'tl', 'middle');
  o += text(290, 286, '箭头表示 cause；Age 同时影响 grade 和 CHD，所以要 adjust；Smoking 在 grade 到 CHD 的路上。', 'ts', 'middle');
  return svg(560, 292, o, 'Causal diagram：employment grade 通过 smoking 和其余 pathway 影响 CHD，age 同时影响 grade 和 CHD');
}

// 第 7 站：两个 factor 的 attributable fraction 为什么加起来超过 joint
function pafFig() {
  const c = 30; let o = '';
  const block = (x0, y0, nx, ny, title, sub) => {
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const byX = i > 0, byY = j > 0;
      const cls = byX && byY ? 'solid' : byX || byY ? 'wash-strong' : 'paper';
      o += rect(x0 + i * c, y0 - (j + 1) * c, c - 3, c - 3, cls, 2);
      const lab = byX && byY ? '' : byX ? 'X' : byY ? 'Y' : '';
      if (lab) o += text(x0 + i * c + (c - 3) / 2, y0 - (j + 1) * c + 18, lab, 'ts', 'middle');
    }
    o += text(x0 + (nx * c) / 2 - 1, y0 + 18, title, 'tb', 'middle') + text(x0 + (nx * c) / 2 - 1, y0 + 34, sub, 'ts', 'middle');
  };
  const Y0 = 176;
  block(30, Y0, 1, 1, '都不暴露', '1 个 case');
  block(100, Y0, 3, 1, '只暴露 X', '3 个');
  block(230, Y0, 1, 3, '只暴露 Y', '3 个');
  block(310, Y0, 3, 3, 'X、Y 都暴露', '9 个');
  o += text(30, 20, '四组各占 25% 的人；X、Y 各让 risk 乘 3，同时暴露乘 9；一共 16 个 case。', 'ts', 'start');
  o += rect(30, 34, 14, 14, 'paper', 2) + text(50, 46, 'baseline', 'ts', 'start');
  o += rect(120, 34, 14, 14, 'wash-strong', 2) + text(140, 46, '只有去掉标注的那个 factor 才消失', 'ts', 'start');
  o += rect(350, 34, 14, 14, 'solid', 2) + text(370, 46, '去掉 X 或 Y 任一个都消失', 'ts', 'start');
  o += text(30, 242, '去掉 X：右边整两列消失，免掉 2 + 6 = 8 个，PAF = 50%。去掉 Y：上面两行消失，同样 8 个，50%。', 'ts', 'start');
  o += text(30, 260, '两者都去掉：只剩 4 个 baseline，免掉 12 个，joint PAF = 75%。深色的 4 个被 X 和 Y 各算了一次，', 'ts', 'start');
  o += text(30, 278, '所以 50% + 50% = 100% 比 75% 多出 4/16 = 25%。', 'ts', 'start');
  return svg(560, 284, o, '16 个 case 画成格子：去掉 X 免掉 8 个，去掉 Y 免掉 8 个，两个都去掉免掉 12 个，有 4 个格子被重复计算');
}

export default {
  'mih1101-intro': intro,
  'mih1101-cohort': cohort,
  'mih1101-tank': tankA,
  'mih1101-designs': designs,
  'mih1101-decomp': decomp,
  'mih1101-smr': smrFig,
  'mih1101-sir': sirA,
  'mih1101-final': finalPlot,
  'mih1101-trans': transA,
  'mih1101-compete': competeFig,
  'mih1101-momentum': momA,
  'mih1101-sg': sgA,
  'mih1101-dag': dag,
  'mih1101-paf': pafFig,
};
