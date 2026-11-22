import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, anim, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

// ---------- 共用：可复现的模拟数据 ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function normals(r) { return () => { let u = 0; while (u === 0) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }; }
// GARCH(1,1)，innovation 是 standardized Student-t(ν)；丢掉前 200 天 burn-in
export function garchSim(n, { omega, alpha, beta, nu, seed }) {
  const N = normals(rng(seed));
  const tdraw = () => { let c = 0; for (let i = 0; i < nu; i++) { const z = N(); c += z * z; } return (N() / Math.sqrt(c / nu)) * Math.sqrt((nu - 2) / nu); };
  let s2 = omega / (1 - alpha - beta);
  const ret = [], sig = [];
  for (let t = 0; t < n + 200; t++) {
    const e = Math.sqrt(s2) * tdraw();
    if (t >= 200) { ret.push(e); sig.push(Math.sqrt(s2)); }
    s2 = omega + alpha * e * e + beta * s2;
  }
  return { ret, sig };
}
export const SIM = { omega: 6.125e-5, alpha: 0.1, beta: 0.85, nu: 4, seed: 11 };
const sim1000 = () => garchSim(1000, SIM);
const pct = (v) => (v < 0 ? '−' : '') + Math.abs(v * 100).toFixed(0) + '%';
const minus = (s) => String(s).replace('-', '−');
// 动图开头先停在最终状态（截图和 reduced-motion 看到的就是它），然后从头播放
const holdFn = (kt, seq, h) => ({ kt: [0, h - 0.002, ...kt.map((t) => h + t * (1 - h))], seq: [seq[seq.length - 1], seq[seq.length - 1], ...seq] });

// ---------- 第 1 站 ----------
function series() {
  const { ret, sig } = sim1000();
  const sx = lin(0, 1000, 50, 550), sy = lin(-0.36, 0.36, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1000, y0: -0.36, y1: 0.36, xt: [0, 250, 500, 750, 1000], yt: [[-0.3, '−30%'], [-0.15, '−15%'], [0, '0'], [0.15, '15%'], [0.3, '30%']], xAt: -0.36, xl: '交易日' });
  o += line(50, sy(0), 550, sy(0), 'grid');
  o += path(ret.map((r, i) => 'M' + f1(sx(i + 0.5)) + ' ' + f1(sy(0)) + 'V' + f1(sy(r))).join(''), 'mute');
  const up = sig.map((s, i) => [sx(i + 0.5), sy(2 * s)]), dn = sig.map((s, i) => [sx(i + 0.5), sy(-2 * s)]);
  o += path(d(up), 'ln') + path(d(dn), 'ln');
  o += text(sx(932) - 6, sy(-0.33) + 4, '第 932 天：−33%', 'ts', 'end');
  o += text(sx(548) + 8, sy(0.3), '±2σₜ 变宽的一段：大波动扎堆', 'ts', 'start') + line(sx(548) + 6, sy(0.29), sx(548), sy(2 * sig[548]), 'mute');
  o += text(300, 22, '1000 天模拟的 daily return（灰）和 model 里的 ±2σₜ（彩线）', 'tb', 'middle');
  return svg(560, 270, o, '1000 天模拟 daily return 的时间序列：大部分时间在正负 5% 内，有几段波动明显变大，第 932 天跌 33%');
}

function tail() {
  const { ret } = sim1000();
  const n = ret.length, m = ret.reduce((a, b) => a + b) / n, sd = Math.sqrt(ret.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1));
  const z = ret.map((r) => Math.abs((r - m) / sd)).sort((a, b) => b - a);
  const sx = lin(0, 9, 60, 530), sy = logx(1e-6, 1, 230, 30);
  const yt = [[1, '1'], [1e-1, '10⁻¹'], [1e-2, '10⁻²'], [1e-3, '10⁻³'], [1e-4, '10⁻⁴'], [1e-5, '10⁻⁵'], [1e-6, '10⁻⁶']];
  let o = axes({ sx, sy, x0: 0, x1: 9, y0: 1e-6, y1: 1, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yt, grid: true, xl: '|z|，以 sample standard deviation 为单位' });
  // normal 的 two-sided tail：erfc
  const erfc = (x) => { const t = 1 / (1 + 0.5 * x); return t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); };
  o += path(curve((x) => { const p = erfc(x / Math.SQRT2); return p >= 1e-6 ? p : NaN; }, 0, 9, sx, sy), 'ink-b');
  const pts = z.map((v, i) => [sx(v), sy((i + 1) / n)]);
  o += path(d(pts), 'ln');
  for (let i = 0; i < 9; i++) o += circle(sx(z[i]), sy((i + 1) / n), 3, 'ln-f');
  o += text(sx(4.9), sy(1e-6) - 8, 'normal', 'tb', 'start');
  o += text(sx(5.4), sy(1.5e-4), '模拟数据：9 天超过 4σ', 'tl', 'start');
  o += text(sx(5.4), sy(1.5e-4) + 18, 'normal 预期 1000 天里 0.06 天', 'ts', 'start');
  o += text(295, 20, '超过 |z| 的天数占比（log scale）', 'tb', 'middle');
  return svg(560, 272, o, 'Survival function：模拟数据的 tail 远比 normal 粗，在 4 个 standard deviation 处高出两个数量级以上');
}

function acf() {
  const { ret } = sim1000();
  const ab = ret.map(Math.abs);
  const ac = (x, l) => { const mm = x.reduce((a, b) => a + b) / x.length; let num = 0, den = 0; for (let i = 0; i < x.length; i++) { den += (x[i] - mm) ** 2; if (i >= l) num += (x[i] - mm) * (x[i - l] - mm); } return num / den; };
  const band = 1.96 / Math.sqrt(ret.length);
  let o = '';
  const panel = (x0, xs, title) => {
    const sx = lin(0, 40.5, x0, x0 + 220), sy = lin(-0.1, 0.25, 220, 40);
    o += axes({ sx, sy, x0: 0, x1: 40.5, y0: -0.1, y1: 0.25, xt: [1, 10, 20, 30, 40], yt: [[-0.1, '−0.1'], [0, '0'], [0.1, '0.1'], [0.2, '0.2']], xAt: -0.1, xl: 'lag' });
    o += line(x0, sy(0), x0 + 220, sy(0), 'axis');
    o += rect(x0, sy(band), 220, sy(-band) - sy(band), 'wash');
    for (let l = 1; l <= 40; l++) o += line(sx(l), sy(0), sx(l), sy(ac(xs, l)), 'ln');
    o += text(x0 + 110, 26, title, 'tb', 'middle');
  };
  panel(50, ret, 'return rₜ 自己');
  panel(320, ab, '|rₜ|');
  o += text(280, 282, '浅色带是 ±1.96/√n：只有 noise 时 95% 的 lag 落在里面', 'ts', 'middle');
  return svg(560, 290, o, '左图 return 的 autocorrelation 几乎都在 noise 带里；右图 absolute return 的 autocorrelation 在前二十多个 lag 都明显为正');
}

// ---------- 第 2 站：一次冲击之后 σ 怎么走（动图） ----------
function garchA() {
  const w = 6.125e-5, a = 0.1, b = 0.85, sb = Math.sqrt(w / (1 - a - b));
  const N = normals(rng(3));
  const D = 60, shock = 12;
  const r = [], s = [];
  let h = sb * sb;
  for (let t = 0; t < D; t++) {
    const sg = Math.sqrt(h);
    const e = t === shock ? -0.15 : sg * Math.max(-2, Math.min(2, N()));
    r.push(e); s.push(sg); h = w + a * e * e + b * h;
  }
  const sx = lin(0, D, 50, 530);
  const syR = lin(-0.16, 0.08, 250, 170), syS = lin(0, 0.065, 140, 34);
  let T = 10.5, hold = 1.5, kt = [], seq = [];
  for (let t = 0; t < D; t++) { kt.push((t / D) * ((T - hold) / T)); seq.push(t); }
  kt.push((T - hold) / T); seq.push(D - 1); kt.push(1); seq.push(D - 1);
  ({ kt, seq } = holdFn(kt, seq, 0.15));
  let o = text(50, 22, 'σₜ：GARCH(1,1) 给第 t 天的 volatility', 'tb', 'start');
  o += axes({ sx, sy: syS, x0: 0, x1: D, y0: 0, y1: 0.065, xt: [], yt: [[0, '0'], [0.02, '2%'], [0.04, '4%'], [0.06, '6%']], grid: true });
  o += line(50, syS(sb), 530, syS(sb), 'dash') + text(530, syS(sb) - 6, 'long-run σ̄ = 3.5%', 'ts', 'end');
  const sp = s.map((v, t) => [sx(t + 0.5), syS(v)]);
  o += path(d(sp), 'mute');
  o += acircle(seq.map((t) => sp[t][0]), seq.map((t) => sp[t][1]), kt, T, 5, 'ln-f');
  o += text(sx(shock + 1.5) - 10, syS(s[shock + 1]) + 4, 'σ 跳到 ' + (s[shock + 1] * 100).toFixed(1) + '%', 'tl', 'end');
  o += text(sx(shock + 16) + 6, syS(s[shock + 16]) - 12, '没有新的大冲击：每天向 σ̄ 收回一点', 'ts', 'start');
  o += text(50, 164, 'rₜ：当天的 return', 'tb', 'start');
  o += line(50, syR(0), 530, syR(0), 'axis');
  for (let t = 0; t < D; t++) {
    const x = sx(t + 0.5);
    o += `<line x1="${f1(x)}" y1="${f1(syR(0))}" x2="${f1(x)}" y2="${f1(syR(r[t]))}" class="${t === shock ? 'ink-b' : 'ink'}">${ashow(seq.map((u) => u >= t), kt, T)}</line>`;
  }
  o += text(sx(shock) + 8, syR(-0.15) + 4, '第 ' + shock + ' 天 −15%', 'ts', 'start');
  o += `<line x1="${f1(sx(seq[0] + 0.5))}" y1="30" x2="${f1(sx(seq[0] + 0.5))}" y2="${f1(syR(-0.16))}" class="grid">${anim('x1', seq.map((t) => f1(sx(t + 0.5))), kt, T)}${anim('x2', seq.map((t) => f1(sx(t + 0.5))), kt, T)}</line>`;
  return svgA(560, 262, o, '动图：60 天里每天的 return 逐根出现，上方 GARCH volatility 在第 12 天 −15% 的冲击后从 3.3% 跳到 5.7%，之后没有新的大冲击，逐日回落向 3.5%');
}

// ---------- 第 3 站 ----------
const NODES = { BTC: [170, 120], ETH: [300, 70], SOL: [430, 110], DOGE: [150, 230], SPX: [320, 200], Gold: [460, 230] };
const RHO = [['BTC', 'ETH', 0.85], ['ETH', 'SOL', 0.8], ['BTC', 'SOL', 0.75], ['BTC', 'DOGE', 0.65], ['ETH', 'DOGE', 0.6], ['SOL', 'DOGE', 0.55], ['BTC', 'SPX', 0.35], ['ETH', 'SPX', 0.33], ['SOL', 'SPX', 0.3], ['DOGE', 'SPX', 0.2], ['SPX', 'Gold', 0.15], ['BTC', 'Gold', 0.1], ['ETH', 'Gold', 0.08], ['SOL', 'Gold', 0.05], ['DOGE', 'Gold', 0.05]];
function kruskalA() {
  const edges = RHO.map(([u, v, r]) => ({ u, v, r, d: Math.sqrt(2 * (1 - r)) })).sort((a, b) => a.d - b.d);
  const par = {}; Object.keys(NODES).forEach((k) => (par[k] = k));
  const find = (x) => (par[x] === x ? x : (par[x] = find(par[x])));
  let acc = 0; const steps = [];
  for (const e of edges) {
    if (acc === 5) break;
    const ok = find(e.u) !== find(e.v);
    if (ok) { par[find(e.u)] = find(e.v); acc++; }
    steps.push({ ...e, ok });
  }
  const S = steps.length, dt = 0.9, H0 = 2.5, T = H0 + S * dt + 2.5;
  const H = H0 / T, at = (i) => H + (i * dt) / T;
  let o = '';
  // 全部候选 edge 先画成 grid
  for (const e of edges) { const A = NODES[e.u], B = NODES[e.v]; o += line(A[0], A[1], B[0], B[1], 'grid'); }
  steps.forEach((e, i) => {
    const A = NODES[e.u], B = NODES[e.v];
    const kt = [0, H, at(i), at(i + 1), 1];
    const vis = e.ok ? [1, 0, 1, 1, 1] : [0, 0, 1, 0, 0];
    o += `<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" class="${e.ok ? 'ln' : 'ln-dash'}">${ashow(vis, kt, T)}</line>`;
    const L = Math.hypot(B[0] - A[0], B[1] - A[1]), nx = -(B[1] - A[1]) / L, ny = (B[0] - A[0]) / L, sg = ny > 0 ? -1 : 1;
    const mx = (A[0] + B[0]) / 2 + sg * nx * 13, my = (A[1] + B[1]) / 2 + sg * ny * 13 + 4;
    o += `<text x="${f1(mx)}" y="${f1(my)}" class="${e.ok ? 'tl' : 'ts'}" text-anchor="middle">${e.d.toFixed(2)}${ashow(vis, kt, T)}</text>`;
  });
  for (const [k, [x, y]] of Object.entries(NODES)) o += circle(x, y, 20, 'paper') + text(x, y + 4, k, 'tb', 'middle');
  // 右侧：步骤表
  const X = 20, Y0 = 290;
  o += text(X, Y0 - 16, '按 distance 从小到大逐条考虑（✓ 加入，✗ 会成 cycle）', 'tb', 'start');
  steps.forEach((e, i) => {
    const col = i < 6 ? 0 : 1, row = i % 6;
    const kt = [0, H, at(i), 1];
    o += `<text x="${X + col * 270}" y="${Y0 + 6 + row * 18}" class="${e.ok ? 't' : 'ts'}" text-anchor="start">${e.ok ? '✓' : '✗'} ${e.u}–${e.v}  ρ = ${e.r.toFixed(2)}  d = ${e.d.toFixed(3)}${ashow([1, 0, 1, 1], kt, T)}</text>`;
  });
  return svgA(560, 400, o, '动图：6 个 asset 的 correlation network 上用 Kruskal algorithm 建 minimum spanning tree，distance 从小到大逐条加入，会形成 cycle 的 edge 被跳过，最后留下 5 条 edge');
}
// 静态首帧之外，给读屏和截图一张最终的树
function mst() {
  const tree = [['BTC', 'ETH', 0.85], ['ETH', 'SOL', 0.8], ['BTC', 'DOGE', 0.65], ['BTC', 'SPX', 0.35], ['SPX', 'Gold', 0.15]];
  let o = '';
  const panel = (dx, rho, title, note) => {
    for (const [u, v] of tree) { const A = NODES[u], B = NODES[v]; o += line(A[0] * 0.5 + dx, A[1] * 0.75 + 10, B[0] * 0.5 + dx, B[1] * 0.75 + 10, 'ln'); }
    let L = 0;
    tree.forEach(([u, v], i) => {
      const A = NODES[u], B = NODES[v], r = rho[i], dd = Math.sqrt(2 * (1 - r)); L += dd;
      const ax = A[0] * 0.5 + dx, ay = A[1] * 0.75 + 10, bx = B[0] * 0.5 + dx, by = B[1] * 0.75 + 10, Ln = Math.hypot(bx - ax, by - ay);
      let nx = -(by - ay) / Ln, ny = (bx - ax) / Ln; if (ny < 0) { nx = -nx; ny = -ny; }
      o += text((ax + bx) / 2 + nx * 12, (ay + by) / 2 + ny * 12 + 4, dd.toFixed(2), 'ts', 'middle');
    });
    for (const [k, [x, y]] of Object.entries(NODES)) o += circle(x * 0.5 + dx, y * 0.75 + 10, 18, 'paper') + text(x * 0.5 + dx, y * 0.75 + 14, k, 'ts', 'middle');
    o += text(dx + 160, 22, title, 'tb', 'middle') + text(dx + 160, 222, note + L.toFixed(2), 't', 'middle');
  };
  panel(-20, [0.85, 0.8, 0.65, 0.35, 0.15], '平时', '5 条 edge 的总长 ');
  panel(260, [0.92, 0.9, 0.85, 0.6, 0.3], 'Crash 期间（示意）', '总长缩到 ');
  return svg(560, 236, o, '同一棵 tree 在平时和 crash 期间：correlation 上升后每条 edge 变短，tree 的总长从 4.46 缩到 3.47');
}

function txnet() {
  // 4 笔 transaction：每个盒子左边是 input address，右边是 output address
  const tx = [
    { x: 30, y: 40, ins: ['a1', 'a2'], outs: ['b1', 'a3'], lab: 'tx1' },
    { x: 30, y: 150, ins: ['a3', 'a4'], outs: ['c1'], lab: 'tx2' },
    { x: 300, y: 40, ins: ['b1'], outs: ['c2', 'b2'], lab: 'tx3' },
    { x: 300, y: 150, ins: ['b2', 'b3'], outs: ['a5'], lab: 'tx4' },
  ];
  const ent = { a1: 'A', a2: 'A', a3: 'A', a4: 'A', b1: 'B', b2: 'B', b3: 'B' };
  let o = '';
  for (const t of tx) {
    o += rect(t.x + 70, t.y, 90, 20 + 26 * Math.max(t.ins.length, t.outs.length), 'paper', 5) + text(t.x + 115, t.y + 16, t.lab, 'tb', 'middle');
    t.ins.forEach((a, i) => {
      const y = t.y + 30 + 26 * i;
      o += rect(t.x, y - 12, 50, 20, ent[a] === 'A' ? 'wash-strong' : ent[a] === 'B' ? 'wash2' : 'paper', 4) + text(t.x + 25, y + 3, a, 't', 'middle') + arrow(t.x + 50, y - 2, t.x + 70, y - 2, 'ink', 5);
    });
    t.outs.forEach((a, i) => {
      const y = t.y + 30 + 26 * i;
      o += arrow(t.x + 160, y - 2, t.x + 180, y - 2, 'ink', 5) + rect(t.x + 180, y - 12, 50, 20, 'frame', 4) + text(t.x + 205, y + 3, a, 't', 'middle');
    });
  }
  o += text(30, 252, 'Common-input：tx1 合并 {a1, a2}，tx2 合并 {a3, a4}，tx4 合并 {b2, b3}。', 'ts', 'start');
  o += text(30, 268, '再把 a3、b2 认作找零（change address），两组各自连起来：a1–a4 成为 entity A，b1–b3 成为 B。', 'ts', 'start');
  return svg(560, 278, o, '四笔 Bitcoin transaction：同一笔里一起当 input 的 address 被认为属于同一个 entity，经由共同的 address 连起来后，七个 address 合并成两个 entity');
}

// ---------- 第 4 站 ----------
function fundingA() {
  // 3 天、9 个 funding interval；premium 先正后负
  const prem = [0.0006, 0.0011, 0.0009, 0.0004, 0.0001, -0.0003, -0.0007, -0.0004, 0.0002];
  const S = [60000, 60600, 61500, 61200, 60500, 59800, 59000, 59300, 59900];
  const n = prem.length, T = 9, kt = [], seq = [];
  for (let i = 0; i < n; i++) { kt.push((i / n) * 0.9); seq.push(i); }
  kt.push(0.9); seq.push(n - 1); kt.push(1); seq.push(n - 1);
  const sx = lin(0, n - 1, 60, 330), sy = lin(58500, 62500, 200, 50);
  let o = text(60, 26, 'Index（spot）与 perpetual 的 price', 'tb', 'start');
  o += axes({ sx, sy, x0: 0, x1: n - 1, y0: 58500, y1: 62000, xt: [[0, '0 h'], [3, '24 h'], [6, '48 h'], [8, '64 h']], yt: [[59000, '59k'], [60000, '60k'], [61000, '61k'], [62000, '62k']], grid: true });
  const lead = (x0, y0, x1, y1) => line(x0, y0, x1, y1, 'mute');
  const F = S.map((s, i) => s * (1 + prem[i] * 10));
  o += path(d(S.map((s, i) => [sx(i), sy(s)])), 'ink-b') + path(d(F.map((f, i) => [sx(i), sy(f)])), 'ln');
  o += text(250, sy(62250), 'perp F', 'tl', 'start') + lead(248, sy(62200), sx(3) + 3, sy(F[3]) - 4);
  o += text(70, sy(59100), 'index S', 'tb', 'start') + lead(92, sy(59300), sx(0.5), sy((S[0] + S[1]) / 2) + 4);
  o += acircle(seq.map((i) => sx(i)), seq.map((i) => sy(F[i])), kt, T, 4.5, 'ln-f');
  o += acircle(seq.map((i) => sx(i)), seq.map((i) => sy(S[i])), kt, T, 4.5, 'ink-f');
  o += text(195, 236, '为了看清，图里把 F − S 放大了 10 倍', 'ts', 'middle');
  // 右边：long 与 short 两个账户，箭头方向随 premium 正负翻转
  const LX = 380, SXX = 500, Y = 120;
  o += rect(LX - 35, Y - 22, 70, 44, 'paper', 6) + text(LX, Y + 5, 'Long', 'tb', 'middle');
  o += rect(SXX - 35, Y - 22, 70, 44, 'paper', 6) + text(SXX, Y + 5, 'Short', 'tb', 'middle');
  const pos = seq.map((i) => prem[i] >= 0);
  o += `<g>${arrow(LX + 38, Y - 34, SXX - 38, Y - 34, 'ln')}${ashow(pos, kt, T)}</g>`;
  o += `<g>${arrow(SXX - 38, Y + 36, LX + 38, Y + 36, 'ink-b')}${ashow(pos.map((p) => !p), kt, T)}</g>`;
  o += `<text x="${(LX + SXX) / 2}" y="${Y - 44}" class="tl" text-anchor="middle">F &gt; S：long 付给 short${ashow(pos, kt, T)}</text>`;
  o += `<text x="${(LX + SXX) / 2}" y="${Y + 60}" class="tb" text-anchor="middle">F &lt; S：short 付给 long${ashow(pos.map((p) => !p), kt, T)}</text>`;
  o += text((LX + SXX) / 2, 36, '每 8 小时结算一次 funding', 'tb', 'middle');
  prem.forEach((p, i) => {
    const on = seq.map((j) => j === i);
    o += `<text x="${(LX + SXX) / 2}" y="${Y + 92}" class="t" text-anchor="middle">premium ${p >= 0 ? '+' : '−'}${Math.abs(p * 100).toFixed(2)}%${ashow(on, kt, T)}</text>`;
  });
  o += text((LX + SXX) / 2, Y + 112, '1 BTC 仓位每次付', 'ts', 'middle');
  prem.forEach((p, i) => {
    const on = seq.map((j) => j === i);
    o += `<text x="${(LX + SXX) / 2}" y="${Y + 128}" class="ts" text-anchor="middle">${(Math.abs(p) * S[i]).toFixed(2)} USD${ashow(on, kt, T)}</text>`;
  });
  return svgA(560, 248, o, '动图：64 小时里 perpetual price 先高于 index、后低于 index，每 8 小时结算 funding，premium 为正时 long 付给 short，为负时 short 付给 long');
}

function perpliq() {
  const P0 = 60000, L = 10, mm = 0.005, Pl = (P0 * (1 - 1 / L)) / (1 - mm);
  const sx = lin(52000, 62000, 40, 520);
  let o = line(40, 120, 520, 120, 'axis');
  for (const v of [52000, 54000, 56000, 58000, 60000, 62000]) o += line(sx(v), 116, sx(v), 124, 'axis') + text(sx(v), 140, (v / 1000).toFixed(0) + 'k', 'ts', 'middle');
  o += rect(sx(Pl), 70, sx(P0) - sx(Pl), 30, 'wash') + text((sx(Pl) + sx(P0)) / 2, 90, 'margin 6,000 USD 能吸收的下跌', 't', 'middle');
  o += line(sx(P0), 60, sx(P0), 120, 'ink-b') + text(sx(P0), 54, 'entry 60,000', 'tb', 'middle');
  o += line(sx(Pl), 60, sx(Pl), 120, 'ln') + text(sx(Pl), 54, 'liquidation ' + Pl.toFixed(0), 'tl', 'middle');
  o += text(40, 168, '到这里剩下的 equity = maintenance margin', 'ts', 'start') + text(40, 184, '0.5% × 1 BTC × ' + Pl.toFixed(0) + ' = ' + (mm * Pl).toFixed(0) + ' USD', 'ts', 'start');
  o += text(sx(P0), 168, '下跌 ' + ((1 - Pl / P0) * 100).toFixed(2) + '% 就被平仓', 'ts', 'middle');
  o += text(280, 22, '1 BTC 的 long perpetual，10x leverage', 'tb', 'middle');
  return svg(560, 196, o, '10 倍 leverage 的 long perpetual：entry 60000，initial margin 6000，price 跌到 54271 时 equity 只剩 maintenance margin，被 liquidate');
}

// ---------- 第 5 站 ----------
const erf = (x) => { const t = 1 / (1 + 0.3275911 * Math.abs(x)); const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x >= 0 ? y : -y; };
const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2)), phi = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
const bs = (S, K, T, s) => { const d1 = (Math.log(S / K) + (s * s / 2) * T) / (s * Math.sqrt(T)); return S * Phi(d1) - K * Phi(d1 - s * Math.sqrt(T)); };
const vega = (S, K, T, s) => { const d1 = (Math.log(S / K) + (s * s / 2) * T) / (s * Math.sqrt(T)); return S * phi(d1) * Math.sqrt(T); };
function newtonA() {
  const S = 60000, K = 65000, Tm = 30 / 365, C = 2000;
  const it0 = [0.2]; for (let i = 0; i < 3; i++) { const s = it0[i]; it0.push(s - (bs(S, K, Tm, s) - C) / vega(S, K, Tm, s)); }
  const sx = lin(0, 1.1, 60, 520), sy = lin(0, 6000, 240, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1.1, y0: 0, y1: 5500, xt: [[0, '0'], [0.2, '20%'], [0.4, '40%'], [0.6, '60%'], [0.8, '80%'], [1, '100%']], yt: [[0, '0'], [1000, '1000'], [2000, '2000'], [3000, '3000'], [4000, '4000'], [5000, '5000']], grid: true, xl: 'σ（annualized）' });
  o += path(curve((s) => bs(S, K, Tm, s), 0.02, 1.1, sx, sy), 'ink-b');
  o += line(60, sy(C), 520, sy(C), 'dash') + text(64, sy(C) - 6, 'market price 2000', 'ts', 'start');
  o += text(sx(1.02), sy(bs(S, K, Tm, 1.02)) - 10, 'C(σ)', 'tb', 'end');
  // 每一步：点在 curve 上 → 沿 tangent 走到 C = 2000 → 竖直回到 curve
  const st = 1.6, T = st * 3 + 2.5;
  for (let i = 0; i < 3; i++) {
    const s = it0[i], p = bs(S, K, Tm, s), v = vega(S, K, Tm, s), s1 = it0[i + 1];
    const kt = [0, 0.2, 0.2 + 0.8 * (i * st) / T, 0.2 + 0.8 * ((i + 1) * st) / T, 1];
    const lo = Math.min(s, s1) - 0.05, hi = Math.max(s, s1) + 0.05;
    o += `<g>${line(sx(lo), sy(p + v * (lo - s)), sx(hi), sy(p + v * (hi - s)), 'ln')}${line(sx(s1), sy(C), sx(s1), sy(bs(S, K, Tm, s1)), 'mute')}${ashow([i === 2 ? 1 : 0, 0, 1, i === 2 ? 1 : 0, i === 2 ? 1 : 0], kt, T / 0.8)}</g>`;
  }
  const kt2 = [0], seq = [0];
  for (let i = 1; i <= 3; i++) { kt2.push((i * st) / T); seq.push(i); }
  kt2.push(1); seq.push(3);
  { const r = holdFn(kt2, seq, 0.2); kt2.length = 0; seq.length = 0; kt2.push(...r.kt); seq.push(...r.seq); }
  o += `<circle cx="${f1(sx(it0[seq[0]]))}" cy="${f1(sy(bs(S, K, Tm, it0[seq[0]])))}" r="5" class="ln-f">${anim('cx', seq.map((i) => f1(sx(it0[i]))), kt2, T / 0.8, true)}${anim('cy', seq.map((i) => f1(sy(bs(S, K, Tm, it0[i])))), kt2, T / 0.8, true)}</circle>`;
  const lab = ['σ₀ = 20%：C = ' + bs(S, K, Tm, it0[0]).toFixed(0) + '，vega 只有 ' + vega(S, K, Tm, it0[0]).toFixed(0), 'σ₁ = ' + (it0[1] * 100).toFixed(1) + '%：冲过头，C = ' + bs(S, K, Tm, it0[1]).toFixed(0), 'σ₂ = ' + (it0[2] * 100).toFixed(1) + '%：C = ' + bs(S, K, Tm, it0[2]).toFixed(1), 'σ₃ = ' + (it0[3] * 100).toFixed(2) + '%：C = ' + bs(S, K, Tm, it0[3]).toFixed(2)];
  lab.forEach((s, i) => { o += `<text x="72" y="${58 + i * 18}" class="${i === 3 ? 'tl' : 't'}" text-anchor="start">${s}${ashow(seq.map((j) => j >= i), kt2, T / 0.8)}</text>`; });
  o += text(290, 20, 'BTC call：S = 60,000，K = 65,000，30 天', 'tb', 'middle');
  return svgA(560, 276, o, '动图：用 Newton method 从 sigma 等于 20% 出发反解 implied volatility，第一步沿 tangent 冲到 89%，之后两步收敛到 56.25%');
}

function smile() {
  const S = 60000, Tm = 30 / 365;
  const mert = (K, s, lam, mj, sj) => { const k = Math.exp(mj + sj * sj / 2) - 1, lp = lam * (1 + k); let tot = 0, f = 1; for (let n = 0; n < 40; n++) { if (n > 0) f *= n; const sn = Math.sqrt(s * s + (n * sj * sj) / Tm), rn = -lam * k + (n * Math.log(1 + k)) / Tm; const wgt = (Math.exp(-lp * Tm) * Math.pow(lp * Tm, n)) / f; const d1 = (Math.log(S / K) + (rn + sn * sn / 2) * Tm) / (sn * Math.sqrt(Tm)); tot += wgt * (S * Phi(d1) - K * Math.exp(-rn * Tm) * Phi(d1 - sn * Math.sqrt(Tm))); } return tot; };
  const iv = (p, K) => { let lo = 0.01, hi = 3; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (bs(S, K, Tm, m) > p) hi = m; else lo = m; } return (lo + hi) / 2; };
  const Ks = []; for (let K = 42000; K <= 78000; K += 1500) Ks.push(K);
  const pts = Ks.map((K) => [K, iv(mert(K, 0.5, 6, -0.08, 0.1), K)]);
  const sx = lin(42000, 78000, 60, 520), sy = lin(0.48, 0.68, 230, 40);
  let o = axes({ sx, sy, x0: 42000, x1: 78000, y0: 0.48, y1: 0.68, xt: [[42000, '42k'], [48000, '48k'], [54000, '54k'], [60000, '60k'], [66000, '66k'], [72000, '72k'], [78000, '78k']], yt: [[0.5, '50%'], [0.55, '55%'], [0.6, '60%'], [0.65, '65%']], grid: true, xl: 'strike K' });
  o += line(sx(60000), sy(0.48), sx(60000), sy(0.68), 'dash') + text(sx(60000) + 4, sy(0.675), 'spot', 'ts', 'start');
  o += line(60, sy(0.5), 520, sy(0.5), 'mute') + text(516, sy(0.5) - 6, 'diffusion 部分的 σ = 50%', 'ts', 'end');
  o += path(d(pts.map(([K, v]) => [sx(K), sy(v)])), 'ln');
  for (const [K, v] of pts) o += circle(sx(K), sy(v), 3, 'ln-f');
  o += text(sx(43000), sy(pts[0][1]) - 10, 'K = 42k：' + (pts[0][1] * 100).toFixed(1) + '%', 'tl', 'start');
  o += text(sx(78000), sy(pts[pts.length - 1][1]) - 10, 'K = 78k：' + (pts[pts.length - 1][1] * 100).toFixed(1) + '%', 'tl', 'end');
  o += text(290, 22, '价格由带 crash jump 的 model 生成，再逐个 strike 反解 Black–Scholes 的 σ', 'tb', 'middle');
  return svg(560, 270, o, '由 Merton jump-diffusion 生成的 30 天 BTC call 价格，逐个 strike 反解出的 implied volatility 从低 strike 的 65% 降到高 strike 的 55%，形成 skew');
}

// ---------- 第 6 站：AMM 上的 arbitrage（动图） ----------
function lvrA() {
  const k = 3e7, X = (P) => Math.sqrt(k / P), Y = (P) => Math.sqrt(k * P);
  const sx = lin(85, 110, 60, 330), sy = lin(270000, 330000, 240, 40);
  let o = axes({ sx, sy, x0: 85, x1: 110, y0: 270000, y1: 330000, xt: [85, 90, 95, 100, 105, 110], yt: [[280000, '280k'], [300000, '300k'], [320000, '320k']], grid: true, xl: 'pool 里的 ETH（x）' });
  o += text(64, 30, 'USDC（y）', 'ts', 'start');
  o += path(curve((x) => k / x, k / 330000, 110, sx, sy), 'ink-b') + text(sx(106), sy(279000), 'xy = 3×10⁷', 'tb', 'end');
  // 关键帧：3000 → 3300（arb 买 ETH）→ 停 → 3000（arb 卖 ETH）
  const Ps = [3000, 3000, 3000, 3000, 3300, 3300, 3000, 3000];
  const kt = [0, 0.2, 0.202, 0.3, 0.5, 0.64, 0.85, 1], T = 10;
  const pt = Ps.map((P) => [sx(X(P)), sy(Y(P))]);
  const tan = (P) => { const x0 = X(P), y0 = Y(P); return d([[sx(x0 - 6), sy(y0 + 6 * P)], [sx(x0 + 6), sy(y0 - 6 * P)]]); };
  o += apath(Ps.map(tan), kt, T, 'ln-dash');
  o += acircle(pt.map((p) => p[0]), pt.map((p) => p[1]), kt, T, 6, 'ln-f');
  o += text(sx(100) - 12, sy(300000) + 22, 'A：100 ETH，300,000 USDC', 'ts', 'end');
  const B = [sx(X(3300)), sy(Y(3300))];
  o += circle(B[0], B[1], 3, 'ink-f') + text(B[0] - 10, B[1] + 18, 'B：95.35 ETH', 'ts', 'end') + text(B[0] - 10, B[1] + 34, '314,642.65 USDC', 'ts', 'end');
  // 右侧读数
  const RX = 350;
  o += text(RX, 30, '外面的 ETH price', 'tb', 'start');
  const ext = [3000, 3300, 3300, 3300, 3000, 3000];
  o += `<text x="${RX}" y="52" class="tbig" text-anchor="start">3000${ashow([1, 1, 1, 0, 0, 0, 1, 1], kt, T)}</text>`;
  o += `<text x="${RX}" y="52" class="tbig" text-anchor="start">3300${ashow([0, 0, 0, 1, 1, 1, 0, 0], kt, T)}</text>`;
  const legUp = [1, 1, 0, 0, 1, 1, 1, 1], legDn = [1, 1, 0, 0, 0, 0, 1, 1];
  o += `<g>${text(RX, 84, '涨到 3300：arb 买走 4.6537 ETH', 't', 'start')}${text(RX, 100, '付 14,642.65 USDC（均价 3146.43）', 'ts', 'start')}${text(RX, 116, '按 3300 卖出，赚 714.69', 'tl', 'start')}${ashow(legUp, kt, T)}</g>`;
  o += `<g>${text(RX, 144, '跌回 3000：arb 卖回 4.6537 ETH', 't', 'start')}${text(RX, 160, '拿回 14,642.65 USDC（均价 3146.43）', 'ts', 'start')}${text(RX, 176, '那些 ETH 只值 13,961.22，又赚 681.43', 'tl', 'start')}${ashow(legDn, kt, T)}</g>`;
  o += `<g>${text(RX, 206, 'Pool 回到 A：impermanent loss = 0', 'tb', 'start')}${text(RX, 222, '两次 arbitrage 共拿走 1,396.12', 'tl', 'start')}${ashow(legDn, kt, T)}</g>`;
  o += text(RX, 254, '虚线的 slope = pool 的 marginal price', 'ts', 'start');
  void ext;
  return svgA(560, 284, o, '动图：constant product pool 的状态点沿 xy 等于常数的 curve 移动；外面 price 从 3000 涨到 3300，arbitrageur 把点推到 B，再跌回 3000，点回到 A；两次 arbitrage 共拿走 1396 USDC');
}

// ---------- 第 7 站 ----------
function kink() {
  const U0 = 0.9, s1 = 0.04, s2 = 0.6;
  const R = (u) => (u < U0 ? (u / U0) * s1 : s1 + ((u - U0) / (1 - U0)) * s2);
  const sx = lin(0, 1, 60, 380), sy = lin(0, 0.66, 240, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 0.66, xt: [[0, '0'], [0.2, '20%'], [0.4, '40%'], [0.6, '60%'], [0.8, '80%'], [0.9, '90%'], [1, '100%']], yt: [[0, '0'], [0.1, '10%'], [0.2, '20%'], [0.3, '30%'], [0.4, '40%'], [0.5, '50%'], [0.6, '60%']], grid: true, xl: 'utilization U' });
  o += path(curve(R, 0, 1, sx, sy, 400), 'ln');
  for (const u of [0.8, 0.95]) o += circle(sx(u), sy(R(u)), 4.5, 'ln-f');
  o += text(sx(0.8) - 6, sy(R(0.8)) - 10, 'U = 80%：' + (R(0.8) * 100).toFixed(2) + '%', 'ts', 'end');
  o += text(sx(0.9) - 8, sy(R(0.95)) + 4, 'U = 95%：' + (R(0.95) * 100).toFixed(0) + '%', 'ts', 'end') + line(sx(0.9) - 4, sy(R(0.95)), sx(0.95) - 6, sy(R(0.95)), 'mute');
  o += text(sx(0.9), sy(0.62), 'kink', 'ts', 'middle') + line(sx(0.9), sy(0.6), sx(0.9), sy(0), 'dash');
  o += text(220, 22, 'Aave 的 USDC variable borrow rate', 'tb', 'middle');
  // 右边：pool 本身
  const PX = 430, PW = 90, PT = 60, PH = 170;
  o += rect(PX, PT, PW, PH, 'frame') + rect(PX, PT + PH * 0.2, PW, PH * 0.8, 'wash');
  o += text(PX + PW / 2, PT + PH * 0.1 + 5, '20 留在 pool', 'ts', 'middle') + text(PX + PW / 2, PT + PH * 0.6, '80 借出', 't', 'middle');
  o += text(PX + PW / 2, PT - 10, '存入 100 USDC', 'tb', 'middle');
  o += text(PX + PW / 2, PT + PH + 18, 'U = 80%', 'tl', 'middle');
  return svg(560, 270, o, 'Aave USDC 的 interest rate curve：utilization 低于 90% 时斜率平缓，超过 90% 后急剧变陡；U 等于 80% 时 3.56%，95% 时 34%');
}

// Stiglitz–Weiss：lender 的 expected repayment 随 loan rate 不单调
function sw() {
  const B = 100, C = 5;
  const types = [
    { name: 'safe', pg: 0.98, good: 112, bad: 12 },
    { name: 'risky', pg: 0.88, good: 125, bad: 0 },
  ];
  // borrower 的 expected profit ≥ 0 才借；lender 收到 min(D, R + C)
  const profit = (t, D) => t.pg * Math.max(t.good - D, -C) + (1 - t.pg) * Math.max(t.bad - D, -C);
  const repay = (t, D) => t.pg * Math.min(D, t.good + C) + (1 - t.pg) * Math.min(D, t.bad + C);
  const Dmax = types.map((t) => { let lo = B, hi = 200; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (profit(t, m) >= 0) lo = m; else hi = m; } return lo; });
  const bank = (r) => { const D = B * (1 + r); const act = types.filter((t, i) => D <= Dmax[i]); return act.length ? act.reduce((s, t) => s + repay(t, D), 0) / act.length : NaN; };
  const rS = Dmax[0] / B - 1, rR = Dmax[1] / B - 1;
  const sx = lin(0, 0.28, 60, 530), sy = lin(92, 112, 250, 70);
  let o = axes({ sx, sy, x0: 0, x1: 0.28, y0: 92, y1: 112, xt: [[0, '0'], [0.05, '5%'], [0.1, '10%'], [0.15, '15%'], [0.2, '20%'], [0.25, '25%']], yt: [[95, '95'], [100, '100'], [105, '105'], [110, '110']], grid: true, xl: 'loan rate r' });
  o += text(64, 64, '每借出 100，lender 收回的 expected value', 'ts', 'start');
  // 谁在借：顶上三段
  const band = (a, b, cls, s) => rect(sx(a), 30, sx(b) - sx(a), 20, cls, 3) + text((sx(a) + sx(b)) / 2, 44, s, 'ts', 'middle');
  o += band(0, rS, 'wash', 'safe 和 risky 都借') + band(rS, rR, 'wash-strong', '只剩 risky') + band(rR, 0.28, 'wash2', '没人借');
  o += line(sx(0), sy(104), sx(0.28), sy(104), 'dash') + text(sx(0.28) - 4, sy(104) + 16, 'funding cost：104', 'ts', 'end');
  o += path(curve(bank, 0, rS - 1e-6, sx, sy, 200), 'ln') + path(curve(bank, rS + 1e-6, rR, sx, sy, 200), 'ln');
  const yTop = bank(rS - 1e-9), yLow = bank(rS + 1e-9), yEnd = bank(rR);
  o += line(sx(rS), sy(yTop), sx(rS), sy(yLow), 'ln-dash');
  o += circle(sx(rS), sy(yTop), 4, 'ln-f') + circle(sx(rS), sy(yLow), 4, 'paper') + circle(sx(rR), sy(yEnd), 4, 'ln-f');
  let lo = 0, hi = rS - 1e-9; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (bank(m) < 104) lo = m; else hi = m; }
  const rBE = lo;
  o += circle(sx(rBE), sy(104), 3.5, 'ink-f') + text(sx(0.015), sy(107.6), '两类都借、刚好打平：r = ' + (rBE * 100).toFixed(2) + '%', 'ts', 'start') + line(sx(0.07), sy(107.2), sx(rBE) - 3, sy(104) - 3, 'mute');
  o += text(sx(rS) + 8, sy(yTop) - 8, (rS * 100).toFixed(2) + '%：' + yTop.toFixed(2), 'tl', 'start');
  o += text(sx(rS) + 8, sy(yLow) + 16, 'safe 退出：掉到 ' + yLow.toFixed(2), 'tl', 'start');
  o += text(sx(rR) - 6, sy(yEnd) - 10, (rR * 100).toFixed(2) + '%：' + yEnd.toFixed(1), 'ts', 'end');
  return svg(560, 290, o, 'Stiglitz–Weiss 的数值例子：loan rate 升到 ' + (rS * 100).toFixed(1) + '% 以上时 safe borrower 退出，lender 每借出 100 收回的 expected value 从 ' + yTop.toFixed(2) + ' 掉到 ' + yLow.toFixed(2));
}

function cascadeA() {
  const run = (exo) => {
    let x = 2000, y = 6e6; const P = () => y / x; const sell = (dx) => { const kk = x * y; x += dx; y = kk / x; };
    const pos = []; for (let i = 0; i < 8; i++) { const L = 2880 - 80 * i; pos.push({ L, c: 40, D: 40 * L * 0.83, at: -1 }); }
    const prices = [3000]; sell(exo); prices.push(P());
    for (let r = 1; r < 20; r++) { const p = P(); const hit = pos.filter((q) => q.at < 0 && q.c * p * 0.83 < q.D); if (!hit.length) break; let s = 0; for (const q of hit) { s += Math.min(q.c, (1.05 * q.D) / p); q.at = r; } sell(s); prices.push(P()); }
    return { prices, pos };
  };
  const { prices, pos } = run(45);
  const sy = lin(2150, 3050, 250, 40);
  let n = prices.length, T = 12, kt = [], seq = [];
  for (let i = 0; i < n; i++) { kt.push((i / (n - 1)) * 0.82); seq.push(i); }
  kt.push(1); seq.push(n - 1);
  ({ kt, seq } = holdFn(kt, seq, 0.15));
  let o = text(20, 22, '8 个 borrower 的 liquidation price', 'tb', 'start');
  o += line(160, sy(2150), 160, sy(3050), 'axis');
  for (const v of [2200, 2400, 2600, 2800, 3000]) o += line(156, sy(v), 160, sy(v), 'axis') + text(152, sy(v) + 4, String(v), 'ts', 'end');
  pos.forEach((q, i) => {
    const y = sy(q.L);
    o += rect(170, y - 7, 120, 14, 'paper', 3);
    o += `<rect x="170" y="${f1(y - 7)}" width="120" height="14" rx="3" class="solid">${ashow(seq.map((s) => s >= q.at + 0), kt, T)}</rect>`;
    o += text(296, y + 4, 'L = ' + q.L + '，40 ETH', 'ts', 'start');
  });
  o += `<line x1="160" y1="${f1(sy(prices[seq[0]]))}" x2="420" y2="${f1(sy(prices[seq[0]]))}" class="ln">${anim('y1', seq.map((i) => f1(sy(prices[i]))), kt, T, true)}${anim('y2', seq.map((i) => f1(sy(prices[i]))), kt, T, true)}</line>`;
  prices.forEach((p, i) => {
    const on = seq.map((s) => s === i);
    const lab = i === 0 ? 'pool price 3000' : i === 1 ? '有人卖 45 ETH → ' + p.toFixed(0) : '第 ' + (i - 1) + ' 轮 liquidation 后 ' + p.toFixed(0);
    o += `<text x="424" y="${f1(sy(p) + 4)}" class="tl" text-anchor="start">P = ${p.toFixed(0)}${ashow(on, kt, T)}</text>`;
    o += `<text x="20" y="276" class="t" text-anchor="start">${lab}${ashow(on, kt, T)}</text>`;
  });
  o += text(20, 296, 'Pool 起始是 2000 ETH 和 6,000,000 USDC；每个 position 被 liquidate 时约 35 ETH 卖进 pool。', 'ts', 'start');
  return svgA(560, 304, o, '动图：一个 ETH/USDC pool 里有人卖出 45 ETH，price 跌破第一个 borrower 的 liquidation price 2880，被卖出的 collateral 又压低 price，八个 position 依次被 liquidate，price 从 3000 跌到 2214');
}

// ---------- 第 8 站 ----------
function peg() {
  let o = '';
  const box = (x, y, w, h, s1, s2) => rect(x, y, w, h, 'paper', 6) + text(x + w / 2, y + h / 2 + (s2 ? -3 : 5), s1, 'tb', 'middle') + (s2 ? text(x + w / 2, y + h / 2 + 14, s2, 'ts', 'middle') : '');
  o += box(30, 90, 120, 56, 'Market', '买卖 stablecoin');
  o += box(220, 90, 120, 56, 'Arbitrageur');
  o += box(410, 90, 120, 56, 'Issuer', '按 1 USD mint/redeem');
  o += text(280, 22, 'Market price 0.995，issuer 收 0.1% redemption fee', 'tb', 'middle');
  o += arrow(150, 106, 218, 106, 'ln') + text(184, 98, '买 1 个', 'ts', 'middle') + text(184, 82, '付 0.995', 'ts', 'middle');
  o += arrow(342, 106, 408, 106, 'ln') + text(375, 98, 'redeem', 'ts', 'middle');
  o += arrow(408, 132, 342, 132, 'ink') + text(375, 150, '收 0.999', 'ts', 'middle');
  o += text(280, 178, '每个赚 0.999 − 0.995 = 0.004（未计 gas 和资金占用）', 't', 'middle');
  // band
  const sx = lin(0.985, 1.015, 60, 500);
  o += line(60, 230, 500, 230, 'axis');
  for (const v of [0.99, 0.995, 1, 1.005, 1.01]) o += line(sx(v), 226, sx(v), 234, 'axis') + text(sx(v), 250, v.toFixed(3), 'ts', 'middle');
  o += rect(sx(0.998), 214, sx(1.002) - sx(0.998), 16, 'wash');
  o += text(sx(1), 208, 'no-arbitrage band [0.998, 1.002]', 'ts', 'middle');
  o += circle(sx(0.995), 230, 5, 'ln-f') + text(sx(0.995), 270, '0.995 在 band 外：有人 redeem', 'ts', 'middle');
  return svg(560, 280, o, 'Stablecoin 的 market price 低于 1 时，arbitrageur 在 market 买入、向 issuer redeem；扣掉 fee 和成本，price 只能停在一个 no-arbitrage band 里');
}

// ---------- 第 9 站 ----------
function pt() {
  const a = 0.88, l = 2.25;
  const v = (x) => (x >= 0 ? Math.pow(x, a) : -l * Math.pow(-x, a));
  const w = (p, c) => Math.pow(p, c) / Math.pow(Math.pow(p, c) + Math.pow(1 - p, c), 1 / c);
  let o = '';
  { const sx = lin(-40, 40, 40, 260), sy = lin(-80, 30, 240, 40);
    o += axes({ sx, sy, x0: -40, x1: 40, y0: -80, y1: 30, xt: [[-40, '−40'], [-20, '−20'], [0, '0'], [20, '20'], [40, '40']], yt: [[-80, '−80'], [-40, '−40'], [0, '0'], [20, '20']], xAt: 0, yAt: 0 });
    o += path(curve(v, -40, 40, sx, sy), 'ln');
    o += circle(sx(20), sy(v(20)), 4, 'ln-f') + circle(sx(-20), sy(v(-20)), 4, 'ln-f');
    o += text(sx(20) + 4, sy(v(20)) + 18, 'v(20) = ' + v(20).toFixed(2), 'ts', 'start');
    o += text(sx(-20) - 6, sy(v(-20)) - 10, 'v(−20) = ' + minus(v(-20).toFixed(2)), 'ts', 'end');
    o += text(150, 22, 'Value function v(x)，λ = 2.25', 'tb', 'middle'); }
  { const sx = lin(0, 1, 330, 530), sy = lin(0, 1, 240, 40);
    o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.5, 1], yt: [0, 0.5, 1], xl: 'p' });
    o += line(sx(0), sy(0), sx(1), sy(1), 'dash') + path(curve((p) => w(p, 0.61), 0.0005, 0.9995, sx, sy), 'ln');
    o += circle(sx(0.01), sy(w(0.01, 0.61)), 4, 'ln-f') + text(sx(0.01) + 14, sy(0.02), 'w(0.01) = ' + w(0.01, 0.61).toFixed(3), 'ts', 'start');
    o += text(430, 22, 'Gain 一侧的 weighting w(p)，γ = 0.61', 'tb', 'middle'); }
  return svg(560, 282, o, '左图 prospect theory 的 value function，在 0 处折弯，loss 一侧更陡；右图 probability weighting function，小 probability 被高估，0.01 被当成约 0.055');
}

export default {
  'dse4211-series': series,
  'dse4211-tail': tail,
  'dse4211-acf': acf,
  'dse4211-garch': garchA,
  'dse4211-kruskal': kruskalA,
  'dse4211-mst': mst,
  'dse4211-txnet': txnet,
  'dse4211-funding': fundingA,
  'dse4211-perpliq': perpliq,
  'dse4211-newton': newtonA,
  'dse4211-smile': smile,
  'dse4211-lvr': lvrA,
  'dse4211-kink': kink,
  'dse4211-sw': sw,
  'dse4211-cascade': cascadeA,
  'dse4211-peg': peg,
  'dse4211-pt': pt,
};
