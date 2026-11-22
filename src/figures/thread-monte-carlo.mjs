// 概念线 monte-carlo 的图。所有随机数都来自下面的 mulberry32，数字和正文对得上。
import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, f1 } from '../lib/svg.mjs';

function rng(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const normal = () => Math.sqrt(-2 * Math.log(1 - u())) * Math.cos(2 * Math.PI * u());
  return { u, normal };
}
const k5 = (t) => (Math.round(t * 1e5) / 1e5).toString();
// 在若干时间段里显示（spans 是 [起, 止] 的 0..1 时刻，止 = null 表示到最后）
function gshow(spans, T, body) {
  const times = new Set([0]);
  spans.forEach(([a, b]) => { times.add(a); if (b !== null) times.add(b); });
  const ks = [...times].filter((t) => t <= 1).sort((x, y) => x - y);
  const vis = (t) => (spans.some(([a, b]) => t >= a - 1e-12 && (b === null || t < b - 1e-12)) ? 1 : 0);
  const vals = ks.map(vis);
  return `<g opacity="${vals[0]}">${body}<animate attributeName="opacity" values="${vals.join(';')}" keyTimes="${ks.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite" calcMode="discrete"/></g>`;
}
const rotD = (angles, cx, cy, kt, T) => `<animateTransform attributeName="transform" type="rotate" values="${angles.map((a) => f1(a) + ' ' + f1(cx) + ' ' + f1(cy)).join(';')}" keyTimes="${kt.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite" calcMode="discrete"/>`;
const discAttr = (attr, vals, kt, T) => `<animate attributeName="${attr}" values="${vals.join(';')}" keyTimes="${kt.map(k5).join(';')}" dur="${T}s" repeatCount="indefinite" calcMode="discrete"/>`;
const fx = (v, k = 3) => v.toFixed(k);

// ---------- 2R arm：两个 disk obstacle，link 有 0.04 的 half-width ----------
const L1 = 1.0, L2 = 0.8, HW = 0.04;
const OBS = [[0.9, 0.6, 0.35], [-0.7, -0.9, 0.4]];
function segDist(ax, ay, bx, by, cx, cy) {
  const dx = bx - ax, dy = by - ay;
  let t = ((cx - ax) * dx + (cy - ay) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(ax + t * dx - cx, ay + t * dy - cy);
}
function armFree(t1, t2) {
  const ex = L1 * Math.cos(t1), ey = L1 * Math.sin(t1);
  const hx = ex + L2 * Math.cos(t1 + t2), hy = ey + L2 * Math.sin(t1 + t2);
  for (const [cx, cy, r] of OBS) {
    if (segDist(0, 0, ex, ey, cx, cy) < r + HW) return false;
    if (segDist(ex, ey, hx, hy, cx, cy) < r + HW) return false;
  }
  return true;
}
const ARM_P = 0.6597; // 4000×4000 grid 算出的 free 比例（正文）
function armSamples(seed, n) {
  const R = rng(seed), out = [];
  for (let i = 0; i < n; i++) { const t1 = (R.u() * 2 - 1) * Math.PI, t2 = (R.u() * 2 - 1) * Math.PI; out.push({ t1, t2, ok: armFree(t1, t2) }); }
  return out;
}
// 一根有厚度的 link：从 (x0,y0) 沿 +x 方向长 len 个 px，half-width hw px，两端是半圆
const linkShape = (x0, y0, len, hw, cls) => `<path d="M${f1(x0)} ${f1(y0 - hw)}L${f1(x0 + len)} ${f1(y0 - hw)}A${hw} ${hw} 0 0 1 ${f1(x0 + len)} ${f1(y0 + hw)}L${f1(x0)} ${f1(y0 + hw)}A${hw} ${hw} 0 0 1 ${f1(x0)} ${f1(y0 - hw)}Z" class="${cls}"/>`;

function armA() {
  const n = 120, S = armSamples(7, n);
  const sc = 58, bx = 130, by = 158; // workspace：1 unit = 58 px
  const W = (x, y) => [bx + x * sc, by - y * sc];
  const cx0 = 318, cy0 = 42, CW = 224; // C-space 方框
  const sxC = lin(-Math.PI, Math.PI, cx0, cx0 + CW), syC = lin(-Math.PI, Math.PI, cy0 + CW, cy0);
  const H = 3, st = 0.13, T = H + n * st;
  const tk = (i) => (H + i * st) / T;
  let o = '';
  // workspace
  o += rect(14, 42, 232, 232, 'frame', 4);
  o += circle(bx, by, 1.8 * sc, 'grid');
  for (const [x, y, r] of OBS) { const [px, py] = W(x, y); o += circle(px, py, r * sc, 'solid2'); }
  { const [px, py] = W(0.9, 0.6); o += text(px, py + 4, 'A', 'tw', 'middle'); }
  { const [px, py] = W(-0.7, -0.9); o += text(px, py + 4, 'B', 'tw', 'middle'); }
  o += poly([[bx - 12, by + 14], [bx + 12, by + 14], [bx + 6, by + 3], [bx - 6, by + 3]], 'solid2');
  // arm：外层 group 转 θ1（绕 base），内层 group 转 θ2（绕 elbow）
  const deg = (r) => (-r * 180) / Math.PI;
  const order = [n - 1, ...S.keys()];
  const kt = [0, ...S.map((_, i) => tk(i))];
  const a1 = order.map((i) => deg(S[i].t1)), a2 = order.map((i) => deg(S[i].t2));
  const bad = order.map((i) => (S[i].ok ? 0 : 1));
  const ex = bx + L1 * sc, hw = HW * sc;
  let inner = linkShape(ex, by, L2 * sc, hw, 'paper') + `<g opacity="${bad[0]}">${linkShape(ex, by, L2 * sc, hw + 1.2, 'ln')}${discAttr('opacity', bad, kt, T)}</g>` + circle(ex, by, 3, 'ink-f');
  let outer = linkShape(bx, by, L1 * sc, hw, 'paper') + `<g opacity="${bad[0]}">${linkShape(bx, by, L1 * sc, hw + 1.2, 'ln')}${discAttr('opacity', bad, kt, T)}</g>`;
  outer += `<g transform="rotate(${f1(a2[0])} ${f1(ex)} ${f1(by)})">${rotD(a2, ex, by, kt, T)}${inner}</g>`;
  o += `<g transform="rotate(${f1(a1[0])} ${f1(bx)} ${f1(by)})">${rotD(a1, bx, by, kt, T)}${outer}</g>` + circle(bx, by, 3.4, 'ink-f');
  o += text(20, 34, 'Workspace：2R arm，L₁ = 1，L₂ = 0.8', 'tb');
  // C-space：C-obstacle 用 96×96 的格子画出来
  const G = 96, cw = CW / G;
  let cd = '';
  for (let j = 0; j < G; j++) {
    const t2 = -Math.PI + ((j + 0.5) / G) * 2 * Math.PI;
    let run = -1;
    for (let i = 0; i <= G; i++) {
      const t1 = -Math.PI + ((i + 0.5) / G) * 2 * Math.PI;
      const blocked = i < G && !armFree(t1, t2);
      if (blocked && run < 0) run = i;
      if (!blocked && run >= 0) { cd += `M${f1(cx0 + run * cw)} ${f1(cy0 + CW - (j + 1) * cw)}h${f1((i - run) * cw)}v${f1(cw)}h${f1(-(i - run) * cw)}Z`; run = -1; }
    }
  }
  o += `<path d="${cd}" class="wash2" style="stroke:none"/>`;
  o += rect(cx0, cy0, CW, CW, 'frame');
  for (const [v, s] of [[-Math.PI, '−180°'], [0, '0'], [Math.PI, '180°']]) {
    o += text(sxC(v), cy0 + CW + 15, s, 'ts', 'middle');
    o += text(cx0 - 5, syC(v) + 4, s, 'ts', 'end');
  }
  o += text(sxC(Math.PI / 2), cy0 + CW + 15, it('θ') + '₁', 'ts', 'middle');
  o += text(cx0 - 5, syC(Math.PI / 2) + 4, it('θ') + '₂', 'ts', 'end');
  o += text(cx0, 34, 'C-space：每个点是一组 (' + it('θ') + '₁, ' + it('θ') + '₂)', 'tb');
  // sample
  S.forEach((s, i) => {
    const dot = s.ok ? circle(sxC(s.t1), syC(s.t2), 2.3, 'paper') : circle(sxC(s.t1), syC(s.t2), 2.6, 'ln-f');
    o += gshow([[0, tk(0)], [tk(i), null]], T, dot);
  });
  // 当前 sample 的圈
  const rx = order.map((i) => f1(sxC(S[i].t1))), ry = order.map((i) => f1(syC(S[i].t2)));
  o += `<circle cx="${rx[0]}" cy="${ry[0]}" r="6" class="ink">${discAttr('cx', rx, kt, T)}${discAttr('cy', ry, kt, T)}</circle>`;
  // 读数
  let f = 0;
  S.forEach((s, i) => {
    if (s.ok) f++;
    const m = i + 1, ph = f / m, se = Math.sqrt((ph * (1 - ph)) / m);
    const body = text(14, 296, `第 ${m} 个 sample：${s.ok ? 'free' : 'collision'}`, s.ok ? 'ts' : 'tl') + text(546, 296, `${m} 个里 ${f} 个 free，μ̂ = ${fx(ph)}` + (m >= 10 ? ` ± ${fx(1.96 * se)}` : ''), 'tb', 'end');
    o += gshow(i === n - 1 ? [[0, tk(0)], [tk(i), null]] : [[tk(i), tk(i + 1)]], T, body);
  });
  return svgA(560, 304, o, `动图：2R arm 的 configuration 被随机抽 ${n} 次。左边 arm 摆到这一次的角度，碰到 obstacle 时 link 描成彩色；右边 C-space 里灰色是 C-obstacle，每个 sample 落成一个点，free 是空心点、collision 是彩色实心点；底下是到目前为止 free 的比例 μ̂ 和 95% error bar`);
}
export function armStats() { const S = armSamples(7, 120); const f = S.filter((s) => s.ok).length; return { n: 120, f, ph: f / 120 }; }

// ---------- grid 与 random：6 维里各 4096 个点，投到前两个 coordinate ----------
function gridProj() {
  let o = '';
  const box = (x0, title, sub) => rect(x0, 46, 200, 200, 'frame') + text(x0, 18, title, 'tb') + text(x0, 36, sub, 'ts');
  const sxL = lin(-1, 1, 40, 240), syL = lin(-1, 1, 246, 46);
  o += box(40, 'Grid：每个方向 4 个值，4⁶ = 4096 个点', '投到 (' + it('x') + '₁, ' + it('x') + '₂)：只占 16 个位置');
  for (const a of [-0.75, -0.25, 0.25, 0.75]) for (const b of [-0.75, -0.25, 0.25, 0.75]) o += circle(sxL(a), syL(b), 4.2, 'ink-f');
  o += text(140, 262, '每个黑点上叠着 256 个 grid point', 'ts', 'middle');
  const sxR = lin(-1, 1, 320, 520), syR = lin(-1, 1, 246, 46);
  o += box(320, 'Uniform random：同样 4096 个点', '投到 (' + it('x') + '₁, ' + it('x') + '₂)：4096 个不同的位置');
  const R = rng(4096);
  let dd = '';
  for (let i = 0; i < 4096; i++) { const v = Array.from({ length: 6 }, () => R.u() * 2 - 1); dd += `M${f1(sxR(v[0]))} ${f1(syR(v[1]))}h0`; }
  o += `<path d="${dd}" class="mute" style="stroke-linecap:round;stroke-width:1.9"/>`;
  for (const x0 of [40, 320]) o += text(x0, 262, '−1', 'ts', 'middle') + text(x0 + 200, 262, '1', 'ts', 'middle');
  return svg(560, 268, o, '六维的 4096 个点投到前两个 coordinate：grid 只落在 16 个位置上，每个位置叠着 256 个点；uniform random 的 4096 个点各在不同的位置，铺满整个方块');
}

// ---------- 漏斗：5 次独立的 running estimate，与 μ ± 1.96σ/√n ----------
function funnel() {
  const N = 10000, sig = Math.sqrt(ARM_P * (1 - ARM_P));
  const sx = logx(10, N, 60, 500), sy = lin(0.35, 0.95, 236, 30);
  let o = '';
  const up = [], dn = [];
  for (let i = 0; i <= 120; i++) { const n = 10 * Math.pow(N / 10, i / 120); up.push([sx(n), sy(ARM_P + (1.96 * sig) / Math.sqrt(n))]); dn.push([sx(n), sy(Math.max(0.35, ARM_P - (1.96 * sig) / Math.sqrt(n)))]); }
  o = path(d([...up, ...dn.reverse()]) + 'Z', 'wash');
  o += axes({ sx, sy, x0: 10, x1: N, y0: 0.35, y1: 0.95, xt: [[10, '10'], [100, '100'], [1000, '1000'], [10000, '10⁴']], yt: [[0.4, '0.4'], [0.5, '0.5'], [0.6, '0.6'], [0.7, '0.7'], [0.8, '0.8'], [0.9, '0.9']], xl: '' });
  o += line(sx(10), sy(ARM_P), sx(N), sy(ARM_P), 'dash');
  const ends = [];
  for (let r = 0; r < 5; r++) {
    const S = armSamples(100 + r, N);
    let f = 0; const pts = [];
    let nextM = 10;
    S.forEach((s, i) => { if (s.ok) f++; const m = i + 1; if (m >= nextM) { pts.push([sx(m), sy(Math.min(0.95, Math.max(0.35, f / m)))]); nextM = Math.max(m + 1, Math.round(m * 1.02)); } });
    o += path(d(pts), r === 0 ? 'ln' : 'mute');
    ends.push(f / N);
  }
  o += text(sx(N) + 6, sy(ARM_P) + 4, 'μ = 0.660', 'ts');
  o += text(sx(400), sy(ARM_P + (1.96 * sig) / Math.sqrt(400) + 0.035), 'μ ± 1.96σ/√' + it('n'), 'ts', 'middle');
  o += text(sx(N), 264, 'sample 数 ' + it('n') + '（log scale）', 'ts', 'end');
  o += text(60, 18, '5 次独立地撒点，每次画出 μ̂ 随 ' + it('n') + ' 的变化', 'tb');
  return svg(560, 270, o, `五条 running estimate 随 sample 数从 10 增加到一万，都收进 μ 加减 1.96 σ 除以根号 n 的漏斗里；n 等于一万时五次的估计是 ${ends.map((v) => v.toFixed(3)).join('、')}`);
}
export function funnelEnds() { return [0, 1, 2, 3, 4].map((r) => { const S = armSamples(100 + r, 10000); return S.filter((s) => s.ok).length / 10000; }); }

// ---------- inverse transform：连续的 τ 与离散的两次选择 ----------
function inverse() {
  let o = '';
  const sx = lin(0, 2, 50, 250), sy = lin(0, 1, 230, 50);
  o += axes({ sx, sy, x0: 0, x1: 2, y0: 0, y1: 1, xt: [0, [0.5, '0.5'], 1, [1.5, '1.5'], 2], yt: [[0.2468, '0.2468'], [0.5, '0.5'], [1, '1']] });
  o += path(curve((t) => Math.exp(-2 * t), 0, 2, sx, sy), 'ln');
  const tau = -Math.log(0.2468) / 2;
  o += line(sx(0), sy(0.2468), sx(tau), sy(0.2468), 'dash') + line(sx(tau), sy(0.2468), sx(tau), sy(0), 'dash');
  o += circle(sx(tau), sy(0.2468), 3.5, 'ln-f');
  o += text(sx(tau) + 6, sy(0) - 8, it('τ') + ' = ' + tau.toFixed(3), 'tl');
  o += text(sx(0.42), sy(0.72), it('S') + '(' + it('t') + ') = ' + it('e') + '⁻²ᵗ', 'tl');
  o += text(50, 18, 'Gillespie 的 waiting time，' + it('R') + ' = 2', 'tb');
  o += text(50, 36, '在 ' + it('S') + '(' + it('t') + ') = P(' + it('τ') + ' > ' + it('t') + ') 上反查 ' + it('u') + '₁', 'ts');
  o += text(sx(2) + 14, sy(0) + 4, it('t'), 'ts', 'start');
  // 右边：两个按 probability 切开的 [0,1]
  const bx = lin(0, 1, 300, 545);
  const bar = (y, segs, ptrs, title, note) => {
    let g = text(300, y - 40, title, 'tb');
    let c = 0;
    segs.forEach(([w, lab, hi], j) => { g += rect(bx(c), y, bx(c + w) - bx(c), 22, hi ? 'wash-strong' : 'wash'); g += line(bx(c), y, bx(c), y + 22, 'ink'); g += text((bx(c) + bx(c + w)) / 2, y + 15, lab, 'ts', 'middle'); c += w; });
    g += line(bx(1), y, bx(1), y + 22, 'ink') + line(bx(0), y, bx(1), y, 'ink') + line(bx(0), y + 22, bx(1), y + 22, 'ink');
    for (const p of ptrs) g += arrow(bx(p), y - 18, bx(p), y - 2, 'ink', 5) + text(bx(p), y - 22, String(p), 'ts', 'middle');
    g += text(300, y + 40, note, 'ts');
    return g;
  };
  o += bar(92, [[0.375, '0.4 m'], [0.125, '3.1'], [0.125, '5.6'], [0.375, '8.3 m']], [0.1, 0.35, 0.6, 0.85], 'CS4278：4 个 particle 的 weight 切开 [0, 1]', '4 个等距 pointer 选出 0.4、0.4、5.6、8.3');
  o += bar(198, [[2 / 3.5, 'production 2'], [1.5 / 3.5, 'degradation 1.5', true]], [0.6965], 'LSM2234 第 4 步：' + it('n') + ' = 3，' + it('R') + ' = 3.5', it('u') + '₂ = 0.6965 落在 degradation 那一段');
  return svg(560, 252, o, '左边是 rate 为 2 的 exponential 的 survival function，把 uniform 的 u1 等于 0.2468 横着查到 curve 上再竖着落到 t 轴，得到 waiting time 0.700；右边两条按 probability 切开的 0 到 1 区间，pointer 落在哪一段就选哪一个，上面是 4 个 particle 的 systematic resampling，下面是 Gillespie 选 reaction');
}

// ---------- particle 的 weight：sensor 越准，weight 越集中 ----------
export function essRows() {
  const R = rng(30), N = 30;
  const xs = Array.from({ length: N }, () => R.normal());
  return [1, 0.3, 0.1].map((r) => { const w = xs.map((x) => Math.exp(-(x * x) / (2 * r * r))); const s = w.reduce((a, b) => a + b, 0), s2 = w.reduce((a, b) => a + b * b, 0); return { r, xs, w: w.map((v) => v / s), ess: (s * s) / s2 }; });
}
function ess() {
  const rows = essRows(), N = 30;
  const sx = lin(-3, 3, 40, 430);
  let o = text(40, 16, '同样 30 个 particle（predict 之后，来自 N(0, 1)），读数 ' + it('z') + ' = 0', 'tb');
  o += text(40, 33, '竖条高度 ∝ ' + it('N') + it('w') + '⁽ⁱ⁾：weight 都相等时每条高到细横线；虚线是 likelihood', 'ts');
  rows.forEach((row, k) => {
    const y0 = 116 + k * 84;
    o += line(40, y0, 430, y0, 'axis');
    o += line(40, y0 - 9, 430, y0 - 9, 'grid');
    const hs = lin(0, 1, 0, 9);
    o += path(curve((x) => y0 - 52 * Math.exp(-(x * x) / (2 * row.r * row.r)), -3, 3, sx, (v) => v, 300), 'dash');
    row.xs.forEach((x, i) => {
      if (x < -3 || x > 3) return;
      const h = Math.min(62, hs(N * row.w[i]));
      if (h > 0.4) o += rect(sx(x) - 1.6, y0 - h, 3.2, h, 'solid');
      o += circle(sx(x), y0 + 4, 1.8, 'ink-f');
    });
    o += text(444, y0 - 34, it('r') + ' = ' + row.r, 'tb');
    o += text(444, y0 - 16, 'ESS = ' + row.ess.toFixed(1) + ' / 30', 'tl');
    o += text(444, y0 + 2, 'theory ' + (30 * row.r * Math.sqrt(row.r * row.r + 2) / (row.r * row.r + 1)).toFixed(1), 'ts');
  });
  for (const v of [-2, 0, 2]) o += text(sx(v), 300, String(v).replace('-', '−'), 'ts', 'middle');
  return svg(560, 304, o, '三行是同样 30 个来自 standard normal 的 particle，measurement 的 noise r 分别是 1、0.3、0.1；虚线是 likelihood，竖条是每个 particle 的 normalized weight 乘以 N；r 越小，weight 越集中到少数几个 particle 上，effective sample size 从约 26 降到约 4');
}

// ---------- 同一个 bimodal target：big-step Metropolis 与 Langevin ----------
const S2 = 0.25;
function lpMix(x) { const a = Math.log(0.8) - (x + 2) ** 2 / (2 * S2), b = Math.log(0.2) - (x - 2) ** 2 / (2 * S2); const m = Math.max(a, b); return m + Math.log(Math.exp(a - m) + Math.exp(b - m)); }
function scMix(x) { const a = Math.log(0.8) - (x + 2) ** 2 / (2 * S2), b = Math.log(0.2) - (x - 2) ** 2 / (2 * S2); const m = Math.max(a, b), wa = Math.exp(a - m), wb = Math.exp(b - m); return (wa * (-(x + 2) / S2) + wb * (-(x - 2) / S2)) / (wa + wb); }
const pMix = (x) => (0.8 * Math.exp(-((x + 2) ** 2) / (2 * S2)) + 0.2 * Math.exp(-((x - 2) ** 2) / (2 * S2))) / Math.sqrt(2 * Math.PI * S2);
export function chains(n = 50000) {
  const R1 = rng(11), R2 = rng(12);
  let x = -2, lp = lpMix(x), acc = 0; const mh = [];
  for (let i = 0; i < n; i++) { const y = x + 3 * R1.normal(), ly = lpMix(y); if (Math.log(R1.u()) < ly - lp) { x = y; lp = ly; acc++; } mh.push(x); }
  let z = -2; const ula = [];
  for (let i = 0; i < n; i++) { z = z + 0.005 * scMix(z) + 0.1 * R2.normal(); ula.push(z); }
  const frac = (a) => a.filter((v) => v > 0).length / a.length;
  return { mh, ula, accMH: acc / n, fMH: frac(mh), fULA: frac(ula) };
}
function mcmcA() {
  const C = chains(), K = 300;
  const H = 2.2, run = 11, T = H + run + 1.2;
  const sxT = lin(0, K, 44, 350);
  let o = '';
  const rows = [[C.mh, 'Metropolis，proposal 的 step σ = 3', C.fMH, `accept ${(C.accMH * 100).toFixed(0)}%`], [C.ula, 'Langevin（ULA），' + it('ε') + ' = 0.1', C.fULA, '']];
  rows.forEach(([xs, title, fr, note], k) => {
    const y0 = 40 + k * 140, sy = lin(-3.5, 3.5, y0 + 112, y0);
    o += text(44, y0 - 10, title, 'tb');
    o += line(44, sy(0), 350, sy(0), 'grid');
    o += line(44, sy(-3.5), 350, sy(-3.5), 'axis') + line(44, sy(-3.5), 44, sy(3.5), 'axis');
    for (const v of [-2, 0, 2]) o += text(38, sy(v) + 4, String(v).replace('-', '−'), 'ts', 'end');
    const pts = xs.slice(0, K + 1).map((v, i) => [sxT(i), sy(Math.max(-3.5, Math.min(3.5, v)))]);
    const cid = 'tmc-mcmc-' + k, cw = 350 - 40;
    o += `<clipPath id="${cid}"><rect x="40" y="${f1(y0 - 6)}" width="${cw}" height="124">${anim('width', [cw, cw, 0, cw, cw], [0, H / T, H / T + 0.0005, (H + run) / T, 1], T)}</rect></clipPath>`;
    o += `<path d="${d(pts)}" class="ink" style="stroke-width:1.1" clip-path="url(#${cid})"/>`;
    const kt = [0, H / T, ...pts.map((_, i) => (H + 0.0005 + (i / K) * (run - 0.0005)) / T), 1];
    const cx = [pts[K][0], pts[K][0], ...pts.map((p) => p[0]), pts[K][0]].map(f1), cy = [pts[K][1], pts[K][1], ...pts.map((p) => p[1]), pts[K][1]].map(f1);
    o += `<circle cx="${cx[0]}" cy="${cy[0]}" r="3.6" class="ln-f">${anim('cx', cx, kt, T)}${anim('cy', cy, kt, T)}</circle>`;
    if (k === 1) o += text(350, sy(-3.5) + 16, 'step（前 300 步）', 'ts', 'end');
    // 右边：真 density（虚线）与 5 万步的 histogram
    const dx = lin(0, 1.0, 368, 428), bins = 28, bw = 7 / bins, hist = new Array(bins).fill(0);
    for (const v of xs) { const b = Math.floor((v + 3.5) / bw); if (b >= 0 && b < bins) hist[b]++; }
    hist.forEach((c, b) => { const den = c / xs.length / bw; if (den > 0.002) o += rect(368, sy(-3.5 + (b + 1) * bw), dx(Math.min(1.25, den)) - 368, sy(-3.5 + b * bw) - sy(-3.5 + (b + 1) * bw) - 0.6, 'wash-strong'); });
    const dp = []; for (let i = 0; i <= 200; i++) { const yv = -3.5 + (7 * i) / 200; dp.push([dx(pMix(yv)), sy(yv)]); }
    o += path(d(dp), 'dash');
    o += line(368, sy(-3.5), 368, sy(3.5), 'axis');
    o += text(446, sy(2) - 6, '5 万步里 ' + it('x') + ' > 0', 'ts') + text(446, sy(2) + 12, `的比例 ${fr.toFixed(3)}`, 'tl') + text(446, sy(2) + 30, '应为 0.2', 'ts');
    if (note) o += text(446, sy(-1.2), note, 'ts');
  });
  return svgA(560, 316, o, `动图：同一个 target 0.8 N(−2, 0.25) + 0.2 N(2, 0.25)。上面是 step 为 3 的 random-walk Metropolis，前 300 步频繁地在两个 mode 之间跳；下面是 epsilon 为 0.1 的 Langevin，一直留在左边的 mode。右边是 5 万步的 histogram 和真 density（虚线）：Metropolis 在 x 大于 0 的比例是 ${C.fMH.toFixed(3)}，Langevin 是 ${C.fULA.toFixed(3)}，应为 0.2`);
}

// ---------- Gillespie：birth–death chain 上的一次 walk ----------
export function gillespiePath(seed = 2234, TT = 12) {
  const R = rng(seed); let t = 0, n = 0; const ev = [{ t: 0, n: 0 }];
  for (;;) { const Rt = 2 + 0.5 * n; t += -Math.log(1 - R.u()) / Rt; if (t > TT) break; n += R.u() * Rt < 2 ? 1 : -1; ev.push({ t, n }); }
  return ev;
}
function gillespieA() {
  const TT = 12, ev = gillespiePath(), nS = 10;
  const H = 2.4, sp = 1.0, T = H + TT * sp + 1.0;
  const tc = (t) => (H + t * sp) / T;
  const bx = (i) => 30 + i * 52, BY = 52, BW = 36;
  let o = text(30, 18, 'MA3238 的 Q-matrix 画出来：state 是 mRNA 的个数 ' + it('n'), 'tb');
  for (let i = 0; i < nS; i++) {
    o += rect(bx(i), BY, BW, 28, 'paper', 4) + text(bx(i) + BW / 2, BY + 19, String(i), 't', 'middle');
    if (i < nS - 1) {
      o += arrow(bx(i) + BW + 1, BY + 7, bx(i + 1) - 1, BY + 7, 'ink', 5);
      o += arrow(bx(i + 1) - 1, BY + 21, bx(i) + BW + 1, BY + 21, 'mute', 5);
      o += text(bx(i) + BW + 8, BY - 4, '2', 'ts', 'middle');
      o += text(bx(i) + BW + 8, BY + 42, String(0.5 * (i + 1)), 'ts', 'middle');
    }
  }
  o += text(30, BY + 60, '上面一排箭头的 rate 都是 ' + it('k') + ' = 2，下面一排是 ' + it('γn') + '；在 ' + it('n') + ' 停留 Exponential(2 + 0.5' + it('n') + ') 那么久', 'ts');
  // token：discrete 跳
  const kt = [0, ...ev.map((e) => tc(e.t))];
  const last = ev[ev.length - 1].n;
  const xsT = [last, ...ev.map((e) => e.n)].map((v) => f1(bx(v) + BW / 2));
  o += `<circle cx="${xsT[0]}" cy="${BY + 14}" r="17" class="ln" style="stroke-width:2.6">${discAttr('cx', xsT, kt, T)}</circle>`;
  // trajectory
  const sx = lin(0, TT, 50, 530), sy = lin(0, 9, 250, 136);
  o += axes({ sx, sy, x0: 0, x1: TT, y0: 0, y1: 9, xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 4, 8] });
  o += line(sx(0), sy(4), sx(TT), sy(4), 'dash') + text(sx(TT) + 4, sy(4) + 4, it('k') + '/' + it('γ'), 'ts');
  const pts = [];
  ev.forEach((e, i) => { const t1 = i + 1 < ev.length ? ev[i + 1].t : TT; pts.push([sx(e.t), sy(e.n)], [sx(t1), sy(e.n)]); });
  const gw = sx(TT) - sx(0) + 4;
  o += `<clipPath id="tmc-gill"><rect x="${f1(sx(0) - 2)}" y="${f1(sy(9) - 4)}" width="${f1(gw)}" height="${f1(sy(0) - sy(9) + 8)}">${anim('width', [gw, gw, 0, gw, gw].map(f1), [0, H / T, H / T + 0.0005, (H + TT * sp) / T, 1], T)}</rect></clipPath>`;
  o += `<path d="${d(pts)}" class="ln" clip-path="url(#tmc-gill)"/>`;
  const cur = [sx(TT), sx(TT), sx(0), sx(TT), sx(TT)].map(f1);
  o += `<line x1="${cur[0]}" y1="${f1(sy(9))}" x2="${cur[0]}" y2="${f1(sy(0))}" class="mute">${anim('x1', cur, [0, H / T, H / T + 0.0005, (H + TT * sp) / T, 1], T)}${anim('x2', cur, [0, H / T, H / T + 0.0005, (H + TT * sp) / T, 1], T)}</line>`;
  o += text(sx(TT), 278, it('t')+'（min）', 'ts', 'end') + text(50, 130, it('n') + '(' + it('t') + ')', 'ts', 'start');
  return svgA(560, 282, o, `动图：birth–death chain 的 10 个 state 排成一排，向右的 rate 是 2，向左的 rate 是 0.5n；圈按 Gillespie 抽出的时刻在 state 之间跳，下面同步画出 n(t)，12 分钟里一共跳了 ${ev.length - 1} 次`);
}

// ---------- 一个 sample 落进 mass 为 0.05 的区域：passage 与 threshold ----------
function passage() {
  const n = 60;
  const R = rng(60);
  const P = Array.from({ length: n }, () => [R.u(), R.u()]);
  let o = '';
  const sx = lin(0, 1, 30, 230), sy = lin(0, 1, 250, 50);
  o += rect(sx(0), sy(0.75), sx(0.45) - sx(0), sy(0.25) - sy(0.75), 'solid2') + rect(sx(0.55), sy(0.75), sx(1) - sx(0.55), sy(0.25) - sy(0.75), 'solid2');
  o += rect(sx(0.45), sy(0.75), sx(0.55) - sx(0.45), sy(0.25) - sy(0.75), 'wash');
  o += rect(sx(0), sy(1), 200, 200, 'frame');
  let hitA = 0;
  for (const [x, y] of P) { const inG = x >= 0.45 && x < 0.55 && y >= 0.25 && y < 0.75; const inObs = !inG && y >= 0.25 && y < 0.75; if (inG) hitA++; o += inG ? circle(sx(x), sy(y), 3.4, 'ln-f') : circle(sx(x), sy(y), 2.2, inObs ? 'mute-f' : 'paper'); }
  o += text(30, 18, 'C-space：wall 中间的 passage', 'tb');
  o += text(30, 36, 'passage 的 area 是 0.1 × 0.5 = 0.05', 'ts');
  o += text(30, 270, `${n} 个 uniform sample，${hitA} 个落进 passage`, 'tl');
  // 右边：CS3264 的 threshold
  const tx = lin(0, 1, 300, 540), Y = 150;
  const R2 = rng(61); const U = Array.from({ length: n }, () => R2.u());
  o += rect(tx(0.45), Y - 26, tx(0.5) - tx(0.45), 52, 'wash');
  o += line(tx(0), Y, tx(1), Y, 'ink');
  let hitB = 0;
  U.forEach((u, i) => { const inI = u >= 0.45 && u < 0.5; if (inI) hitB++; const yy = Y - 8 - (i % 4) * 5; o += inI ? circle(tx(u), yy, 3.4, 'ln-f') : circle(tx(u), yy, 2.2, 'paper'); });
  for (const v of [0, 0.45, 0.5, 1]) o += line(tx(v), Y, tx(v), Y + 5, 'axis');
  o += text(tx(0), Y + 20, '0', 'ts', 'middle') + text(tx(0.45) - 3, Y + 20, '0.45', 'ts', 'end') + text(tx(0.5) + 3, Y + 20, '0.5', 'ts', 'start') + text(tx(1), Y + 20, '1', 'ts', 'middle');
  o += text(300, 18, 'CS3264：threshold 的 training set', 'tb');
  o += text(300, 36, '[0.45, 0.5) 的 probability 是 0.05', 'ts');
  o += text(300, 270, `${n} 个 uniform 的 ` + it('x') + '，' + hitB + ' 个落进 [0.45, 0.5)', 'tl');
  o += text(300, 214, '两边“一个都没落进去”的 probability', 'ts') + text(300, 232, '都是 0.95⁶⁰ = 0.046', 'tb');
  return svg(560, 276, o, `左边是 C-space 里一道 wall，中间留了一个 area 为 0.05 的 passage，60 个 uniform sample 有 ${hitA} 个落进去；右边是 CS3264 的 0 到 1 区间，60 个 uniform 的 x 有 ${hitB} 个落进长度 0.05 的 [0.45, 0.5)；两边一个都没落进去的 probability 都是 0.95 的 60 次方，0.046`);
}

// ---------- 挑最大的那个：100 个没有预测力的 signal ----------
export function selectRows() {
  const R = rng(4211);
  return [0, 1, 2, 3].map(() => Array.from({ length: 100 }, () => Math.SQRT1_2 * R.normal()));
}
function select() {
  const rows = selectRows();
  const sx = lin(-2.5, 3, 70, 520);
  let o = text(70, 18, '100 个真实 Sharpe 都是 0 的 signal，各 backtest 两年；estimate ~ N(0, 1/2)', 'tb');
  o += line(sx(0), 34, sx(0), 228, 'ink') + text(sx(0), 246, 'true Sharpe = 0', 'ts', 'middle');
  rows.forEach((xs, k) => {
    const y = 56 + k * 46;
    o += line(sx(-2.5), y, sx(3), y, 'grid');
    o += text(62, y + 4, `第 ${k + 1} 次`, 'ts', 'end');
    let mi = 0; xs.forEach((v, i) => { if (v > xs[mi]) mi = i; });
    xs.forEach((v, i) => { if (i !== mi) o += circle(sx(Math.max(-2.5, Math.min(2.5, v))), y + ((i % 3) - 1) * 4, 2, 'mute-f'); });
    o += circle(sx(xs[mi]), y, 4.2, 'ln-f') + text(sx(xs[mi]) + 8, y + 4, 'max ' + xs[mi].toFixed(2), 'tl');
  });
  for (const v of [-2, -1, 1, 2]) o += text(sx(v), 246, String(v).replace('-', '−'), 'ts', 'middle');
  return svg(560, 252, o, '四次独立的实验，每次 100 个真实 Sharpe 为 0 的 signal 的 estimate 排在一条线上，最大的那个用彩色标出，四次都远在 0 的右边');
}

export default {
  'thread-monte-carlo-arm': armA,
  'thread-monte-carlo-gridproj': gridProj,
  'thread-monte-carlo-funnel': funnel,
  'thread-monte-carlo-inverse': inverse,
  'thread-monte-carlo-ess': ess,
  'thread-monte-carlo-mcmc': mcmcA,
  'thread-monte-carlo-gillespie': gillespieA,
  'thread-monte-carlo-passage': passage,
  'thread-monte-carlo-select': select,
};
