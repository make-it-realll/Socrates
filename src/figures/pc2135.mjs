import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;
// ln n! 表
const LF = [0];
for (let i = 1; i <= 20000; i++) LF.push(LF[i - 1] + Math.log(i));
const lnC = (n, k) => LF[n] - LF[k] - LF[n - k];
const lnOmega = (N, q) => lnC(q + N - 1, q); // Einstein solid
// 粗箭头（宽度正比于 energy）
function fat(x1, y1, x2, y2, w, cls = 'wash-strong') {
  const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = -uy, ny = ux;
  const hl = Math.min(14, L * 0.5), hw = w / 2 + 6, sw = w / 2;
  const bx = x2 - ux * hl, by = y2 - uy * hl;
  return poly([[x1 + nx * sw, y1 + ny * sw], [bx + nx * sw, by + ny * sw], [bx + nx * hw, by + ny * hw], [x2, y2], [bx - nx * hw, by - ny * hw], [bx - nx * sw, by - ny * sw], [x1 - nx * sw, y1 - ny * sw]], cls);
}
const sci = (v, dg = 1) => { const e = Math.floor(Math.log10(v)); const m = v / 10 ** e; return `${m.toFixed(dg)}×10${sup(String(e).replace('-', '−'))}`; };

// ---------- 第 1 站 ----------
// molecule 撞 piston：force 是一串 pulse，time average = m v² / L
function kinetic() {
  const T = 6, X0 = 46, X1 = 394, Y = 70;
  let o = rect(30, 30, 380, 80, 'frame') + line(30, 30, 30, 110, 'ink-b');
  o += rect(410, 26, 14, 88, 'solid2') + rect(424, 64, 90, 12, 'wash2');
  o += text(470, 56, 'piston', 'ts', 'middle') + text(30, 128, 'x = 0', 'ts', 'middle') + text(410, 128, 'x = L', 'ts', 'middle');
  const kt = [0, 1, 2, 3, 4, 5, 6].map((t) => t / T), xs = [X0, X1, X0, X1, X0, X1, X0];
  o += acircle(xs, xs.map(() => Y), kt, T, 8, 'ln-f');
  o += text(220, 22, '一个 molecule，x 方向 speed v' + sub('x') + '，来回一趟用时 2L / v' + sub('x'), 'ts', 'middle');
  // force–time
  const sx = lin(0, 6, 60, 520), base = 250, H = 62, w = 0.36;
  o += line(56, base, 530, base, 'axis') + line(60, base + 4, 60, base - H - 18, 'axis');
  o += text(64, base - H - 22, 'piston 受到的 force', 'ts');
  o += text(530, base + 18, 't', 'ts', 'end');
  for (const tc of [1, 3, 5]) o += poly([[sx(tc - w / 2), base], [sx(tc - w / 2), base - H], [sx(tc + w / 2), base - H], [sx(tc + w / 2), base]], 'wash-strong');
  const avg = (H * w) / 2;
  o += line(60, base - avg, 520, base - avg, 'ln-dash');
  o += text(sx(3.3), base + 26, '虚线：time average = m v' + sub('x') + sup('2') + ' / L', 'tl', 'start');
  o += line(sx(1), base + 10, sx(3), base + 10, 'mute') + line(sx(1), base + 6, sx(1), base + 14, 'mute') + line(sx(3), base + 6, sx(3), base + 14, 'mute');
  o += text(sx(2), base + 26, '2L / v' + sub('x'), 'ts', 'middle');
  o += text(sx(5) + 26, base - H + 14, '每个 pulse 的 area', 'ts', 'start') + text(sx(5) + 26, base - H + 30, '= impulse 2mv' + sub('x'), 'ts', 'start');
  // 时间游标
  o += `<line x1="${sx(0)}" y1="${base - H - 6}" x2="${sx(0)}" y2="${base}" class="mute">${anim('x1', [sx(0), sx(6)].map(f1), [0, 1], T)}${anim('x2', [sx(0), sx(6)].map(f1), [0, 1], T)}</line>`;
  return svgA(560, 290, o, '动图：一个 molecule 在 cylinder 里来回飞，每撞一次 piston，下方的 force 曲线出现一个 pulse，相隔 2L/v_x；虚线是 force 的 time average');
}

// midterm 的四段 cycle：cylinder + PV 图同步
function cycleA() {
  const V1 = 1, V2 = 2, P1 = 0.5, P2 = 2;
  const segs = [];
  const iso = []; for (let i = 0; i <= 24; i++) { const v = V1 + (V2 - V1) * i / 24; iso.push([v, P2 * V1 / v]); }
  segs.push(iso);
  const lineSeg = (a, b, n = 12) => Array.from({ length: n + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]);
  segs.push(lineSeg([V2, 1], [V2, P1]));
  segs.push(lineSeg([V2, P1], [V1, P1]));
  segs.push(lineSeg([V1, P1], [V1, P2]));
  const segT = 2, T = 8;
  const pts = [], kt = [], segOf = [];
  segs.forEach((s, k) => s.forEach((p, i) => { if (k > 0 && i === 0) return; pts.push(p); kt.push((k * segT + segT * i / (s.length - 1)) / T); segOf.push(k); }));
  // PV 图
  const sx = lin(0.6, 2.3, 300, 540), sy = lin(0, 2.3, 250, 40);
  let o = axes({ sx, sy, x0: 0.6, x1: 2.3, y0: 0, y1: 2.3, xt: [[1, '1'], [2, '2']], yt: [[0.5, '0.5'], [1, '1'], [2, '2']], xl: 'V（L）', yl: 'P（10⁵ Pa）' });
  const all = segs.flat();
  o += path(d(all.map(([v, p]) => [sx(v), sy(p)])) + 'Z', 'wash') + path(d(all.map(([v, p]) => [sx(v), sy(p)])), 'ink');
  const lab = [[1, 2, 'A 400 K', -6, -8, 'end'], [2, 1, 'B 400 K', 8, -6, 'start'], [2, 0.5, 'C 200 K', 8, 14, 'start'], [1, 0.5, 'D 100 K', -6, 14, 'end']];
  for (const [v, p, s, dx, dy, an] of lab) o += circle(sx(v), sy(p), 3, 'ink-f') + text(sx(v) + dx, sy(p) + dy, s, 'ts', an);
  o += text(sx(1.62), sy(1.5), '① +138.6 J', 'ts', 'start');
  o += text(sx(2) + 8, sy(0.76), '② −150 J', 'ts', 'start');
  o += text(sx(1.5), sy(0.5) + 18, '③ −125 J', 'ts', 'middle');
  o += text(sx(1) - 8, sy(1.25), '④ +225 J', 'ts', 'end');
  o += acircle(pts.map((p) => sx(p[0])), pts.map((p) => sy(p[1])), kt, T, 6, 'ln-f');
  // cylinder
  const cx = (v) => 40 + 90 * v; // piston 位置
  const cy0 = 90, cy1 = 200;
  o += line(40, cy0, 240, cy0, 'ink') + line(40, cy1, 240, cy1, 'ink') + line(40, cy0, 40, cy1, 'ink-b');
  const gas = pts.map((p) => d([[40, cy0], [cx(p[0]), cy0], [cx(p[0]), cy1], [40, cy1]]) + 'Z');
  o += apath(gas, kt, T, 'wash');
  const pist = pts.map((p) => d([[cx(p[0]), cy0 + 1], [cx(p[0]) + 9, cy0 + 1], [cx(p[0]) + 9, cy1 - 1], [cx(p[0]), cy1 - 1]]) + 'Z');
  o += apath(pist, kt, T, 'solid2');
  const rod = pts.map((p) => d([[cx(p[0]) + 9, (cy0 + cy1) / 2], [cx(p[0]) + 60, (cy0 + cy1) / 2]]));
  o += apath(rod, kt, T, 'ink-b');
  o += text(140, 60, 'monatomic ideal gas', 'tb', 'middle');
  // 每段的 heat 箭头
  const segK = [0, 1, 2, 3].map((k) => [k * segT / T, (k + 1) * segT / T]);
  const show = (k) => {
    if (k === 0) return { on: [1, 0], kk: [0, segK[0][1]] };
    if (k === 3) return { on: [0, 1], kk: [0, segK[3][0]] };
    return { on: [0, 1, 0], kk: [0, segK[k][0], segK[k][1]] };
  };
  const heat = [['① isothermal：吸热 138.6 J', true], ['② isochoric：放热 150 J', false], ['③ isobaric：放热 125 J', false], ['④ isochoric：吸热 225 J', true]];
  heat.forEach(([s, inn], k) => {
    const { on, kk } = show(k);
    const ys = inn ? [262, 214] : [214, 262];
    const arr = arrow(110, ys[0], 110, ys[1], 'ln');
    const vis = k === 0 ? 1 : 0;
    o += `<g opacity="${vis}">${arr}${text(126, 244, s, 'tl', 'start')}${anim('opacity', on, kk, T, true)}</g>`;
  });
  return svgA(560, 290, o, '动图：midterm 的四段 cycle。左边 cylinder 的 piston 随 volume 移动，右边 PV 图上的点同步走过 isothermal、isochoric、isobaric、isochoric 四段，每段显示吸热或放热的数值');
}

// ---------- 第 2 站 ----------
function solid() {
  const states = { '3 + 0 + 0': [[3, 0, 0], [0, 3, 0], [0, 0, 3]], '1 + 1 + 1': [[1, 1, 1]], '2 + 1 + 0': [[2, 1, 0], [2, 0, 1], [1, 2, 0], [0, 2, 1], [1, 0, 2], [0, 1, 2]] };
  let o = '';
  const cell = (x, y, s) => {
    let q = '';
    s.forEach((n, j) => {
      const bx = x + j * 26;
      q += rect(bx, y, 20, 36, 'frame', 3);
      for (let k = 0; k < n; k++) q += circle(bx + 10, y + 30 - k * 9.5, 3.6, 'ln-f');
    });
    const str = s.map((n) => '●'.repeat(n)).join(' | ');
    q += text(x + 88, y + 23, str, 'ts', 'start');
    return q;
  };
  const col = (x, groups) => {
    let y = 34;
    for (const g of groups) {
      o += text(x, y, g + '（' + states[g].length + ' 个）', 'tb', 'start');
      y += 10;
      for (const s of states[g]) { o += cell(x, y, s); y += 42; }
      y += 16;
    }
  };
  col(20, ['3 + 0 + 0', '1 + 1 + 1']);
  col(300, ['2 + 1 + 0']);
  o += text(20, 322, '三个方框是三个 oscillator，点数是它分到的 energy 份数', 'ts', 'start');
  o += text(20, 340, '右边是同一个 microstate 写成 3 个点、2 条竖线的排列：从 5 个位置里选 3 个放点', 'ts', 'start');
  return svg(560, 346, o, 'Einstein solid 里 3 个 oscillator 分 3 份 energy 的全部 10 个 microstate，按分配方式分三组');
}

// 两块 solid：N 变大，Ω_total 的峰变窄
function twosolidA() {
  const Ns = [3, 30, 300, 3000];
  const sx = lin(0, 1, 70, 400), sy = lin(0, 1.05, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1.05, xt: [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'q' + sub('A') + ' / q', yl: 'Ω' + sub('total') + ' / Ω' + sub('max') });
  const M = 240;
  const frame = (N) => {
    const q = 2 * N;
    const vals = []; for (let a = 0; a <= q; a++) vals.push(lnOmega(N, a) + lnOmega(N, q - a));
    const mx = Math.max(...vals);
    const pts = [];
    for (let i = 0; i <= M; i++) {
      const xq = (i / M) * q, a = Math.floor(xq), b = Math.min(q, a + 1), t = xq - a;
      const v = Math.exp(vals[a] - mx) * (1 - t) + Math.exp(vals[b] - mx) * t;
      pts.push([sx(i / M), sy(v)]);
    }
    return d(pts);
  };
  const ds = Ns.map(frame);
  const hold = 2, T = hold * Ns.length;
  const kt = [0, 0.25, 0.5, 0.75];
  o += `<path d="${ds[0]}" class="ln">${anim('d', ds, kt, T, true)}</path>`;
  // N=3 时的 7 个点（只在第一帧显示）
  let dots = '';
  for (let a = 0; a <= 6; a++) { const v = Math.exp(lnOmega(3, a) + lnOmega(3, 6 - a) - Math.log(100)); dots += circle(sx(a / 6), sy(v), 3.5, 'ln-f'); }
  o += `<g>${dots}${anim('opacity', [1, 0], [0, 0.25], T, true)}</g>`;
  const info = [['N = 3，q = 6', 'half-width 0.33'], ['N = 30，q = 60', 'half-width 0.12'], ['N = 300，q = 600', 'half-width 0.040'], ['N = 3000，q = 6000', 'half-width 0.013']];
  info.forEach(([a, b], k) => {
    const on = Ns.map((_, j) => j === k);
    o += `<g opacity="${k === 0 ? 1 : 0}">${text(420, 110, a, 'tl', 'start')}${text(420, 130, b, 't', 'start')}${anim('opacity', on.map((v) => (v ? 1 : 0)), kt, T, true)}</g>`;
  });
  o += text(420, 60, '两块 solid，各 N 个', 'ts', 'start') + text(420, 76, 'oscillator，共 q = 2N 份', 'ts', 'start');
  o += text(420, 170, 'half-width：Ω 降到', 'ts', 'start') + text(420, 186, 'max 的 1/e 处，距峰的', 'ts', 'start') + text(420, 202, '距离 ÷ q', 'ts', 'start');
  return svgA(560, 290, o, '动图：两块各 N 个 oscillator 的 Einstein solid 共 2N 份 energy，Omega_total 随 q_A/q 的分布，N 从 3 变到 30、300、3000，峰越来越窄');
}

// ---------- 第 3 站 ----------
function st() {
  const NA = 300, NB = 200, q = 100;
  const SA = (a) => lnOmega(NA, a), SB = (a) => lnOmega(NB, q - a);
  const sx = lin(0, 100, 70, 470), sy = lin(0, 280, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 100, y0: 0, y1: 280, xt: [0, 20, 40, 60, 80, 100], yt: [0, 100, 200], xl: 'q' + sub('A'), yl: 'S / k', grid: true });
  const pts = (f) => d(Array.from({ length: 101 }, (_, a) => [sx(a), sy(f(a))]));
  o += path(pts((a) => SA(a) + SB(a)), 'ink-b') + path(pts(SA), 'ln') + path(pts(SB), 'ln-dash');
  const s0 = Math.log(1 + NA / 60);
  const tang = (f, sl) => line(sx(45), sy(f(60) - 15 * sl), sx(75), sy(f(60) + 15 * sl), 'ink');
  o += tang(SA, s0) + tang(SB, -s0);
  o += line(sx(60), sy(0), sx(60), sy(SA(60) + SB(60)), 'grid');
  o += circle(sx(60), sy(SA(60) + SB(60)), 4, 'ink-f');
  o += text(sx(20), sy(SA(20) + SB(20)) - 12, 'S' + sub('total'), 'tb', 'middle');
  o += text(sx(100) + 6, sy(SA(100)) + 4, 'S' + sub('A'), 'tl', 'start');
  o += text(sx(8), sy(SB(8)) - 9, 'S' + sub('B') + '（对 q' + sub('B') + ' = 100 − q' + sub('A') + '）', 'tl', 'start');
  o += text(sx(60) + 6, sy(SA(60) + SB(60)) - 10, 'maximum：q' + sub('A') + ' = 60', 'ts', 'start');
  o += text(sx(64), sy(52), '两条短线：tangent，', 'ts', 'start');
  o += text(sx(64), sy(52) + 16, 'slope ±ln 6 = ±1.79', 'ts', 'start');
  return svg(560, 292, o, 'N_A=300、N_B=200 的两块 Einstein solid 共 100 份 energy：S_A、S_B 与 S_total 随 q_A 的变化，S_total 在 q_A=60 取 maximum，此处 S_A 与 S_B 的 slope 大小相等');
}

function para() {
  const N = 100;
  const sx = lin(-1, 1, 60, 500), sy = lin(0, 75, 170, 34);
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: 0, y1: 75, xt: [[-1, '−NμB'], [0, '0'], [1, '+NμB']], yt: [0, 35, 70], xl: 'U', yl: 'S / k' });
  const pts = [];
  for (let nu = N; nu >= 0; nu--) pts.push([sx((N - 2 * nu) / N), sy(lnC(N, nu))]);
  o += path(d(pts), 'ln');
  o += text(sx(-0.55), sy(lnC(N, 77)) - 34, 'slope > 0：T > 0', 'ts', 'middle');
  o += text(sx(0.55), sy(lnC(N, 23)) - 34, 'slope < 0：T < 0', 'ts', 'middle');
  o += text(sx(0), sy(lnC(N, 50)) - 10, 'T = ±∞', 'ts', 'middle');
  // 典型 spin 排列
  const row = (cx, ups, lab) => {
    let q = '';
    for (let i = 0; i < 10; i++) {
      const x = cx - 54 + i * 12, up = ups.includes(i);
      q += up ? arrow(x, 252, x, 222, 'ink', 5) : arrow(x, 222, x, 252, 'ln', 5);
    }
    q += text(cx, 272, lab, 'ts', 'middle');
    return q;
  };
  o += row(sx(-0.85), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], '全部 up：T → +0');
  o += row(sx(0), [0, 2, 3, 6, 8], '一半 up：T = ±∞');
  o += row(sx(0.85) - 20, [4, 7], '大多 down：T < 0');
  o += arrow(22, 252, 22, 222, 'mute', 5) + text(22, 272, 'B', 'ts', 'middle');
  return svg(560, 282, o, 'N=100 个 spin 的 paramagnet 的 entropy 随 energy 的变化：左半边 slope 为正、temperature 为正，中间 slope 为零，右半边 slope 为负、temperature 为负；下方是三个典型的 spin 排列');
}

function schottky() {
  let o = '';
  const empty = [[1, 2], [3, 0]];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const x = 50 + i * 40, y = 70 + j * 40, e = empty.some(([a, b]) => a === i && b === j);
    o += e ? `<circle cx="${x}" cy="${y}" r="13" class="ink" stroke-dasharray="3 3"/>` : circle(x, y, 13, 'wash-strong');
  }
  o += text(110, 40, 'N = 16 个 site，n = 2 个空位', 'ts', 'middle');
  o += text(110, 250, '排法 C(16, 2) = 120', 'ts', 'middle');
  const sx = lin(0, 0.5, 290, 530), ly = (v) => Math.log10(v), sy = lin(-10, 0, 230, 40);
  o += axes({ sx, sy: (v) => sy(v), x0: 0, x1: 0.5, y0: -10, y1: 0, xt: [[0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4'], [0.5, '0.5']], yt: [[-10, '10⁻¹⁰'], [-5, '10⁻⁵'], [0, '1']], xl: 'kT / ε' });
  o += text(294, 30, 'n / N', 'ts', 'start');
  const f = (x) => ly(1 / (Math.exp(1 / x) + 1));
  o += path(curve(f, 0.044, 0.5, sx, sy, 200), 'ln');
  const x0 = 8.617e-5 * 1000;
  o += circle(sx(x0), sy(f(x0)), 4, 'ink-f');
  o += text(sx(x0) + 8, sy(f(x0)) + 16, 'ε = 1 eV，T = 1000 K：9.1×10' + sup('−6'), 'ts', 'start');
  o += text(sx(0.3), sy(f(0.3)) - 12, 'n/N = 1/(e' + sup('ε/kT') + ' + 1)', 'ts', 'middle');
  return svg(560, 262, o, '左：16 个 lattice site 中 2 个空位的 Schottky defect；右：空位比例 n/N 随 kT/epsilon 的变化，纵轴为 log scale');
}

// ---------- 第 4 站 ----------
function engine() {
  let o = '';
  const res = (x, y, w, lab, s1, s2) => rect(x, y, w, 36, 'wash2', 4) + text(x + w / 2, y + 23, lab, 'tb', 'middle') + text(x + w + 8, y + 15, s1, 'ts', 'start') + text(x + w + 8, y + 31, s2, 'ts', 'start');
  // engine
  o += text(120, 16, 'Heat engine', 'tb', 'middle');
  o += res(50, 28, 130, 'T' + sub('h') + ' = 373 K', 'ΔS = −1 / 373', '= −2.68 mJ/K');
  o += res(50, 230, 130, 'T' + sub('c') + ' = 293 K', 'ΔS = +0.786 / 293', '= +2.68 mJ/K');
  o += circle(115, 150, 26, 'paper') + text(115, 155, 'engine', 'ts', 'middle');
  o += fat(115, 64, 115, 124, 30) + text(140, 100, 'Q' + sub('h') + ' = 1 J', 't', 'start');
  o += fat(115, 176, 115, 230, 23.6) + text(140, 212, 'Q' + sub('c') + ' = 0.786 J', 't', 'start');
  o += fat(141, 150, 196, 150, 6.4) + text(150, 172, 'W = 0.214 J', 'tl', 'start');
  // fridge
  o += text(390, 16, 'Refrigerator', 'tb', 'middle');
  o += res(325, 28, 130, 'T' + sub('h') + ' = 293 K', 'ΔS = +528.9 / 293', '= +1.805 W/K');
  o += res(325, 230, 130, 'T' + sub('c') + ' = 277 K', 'ΔS = −500 / 277', '= −1.805 W/K');
  o += circle(390, 150, 26, 'paper') + text(390, 155, 'fridge', 'ts', 'middle');
  o += fat(390, 124, 390, 64, 30) + text(415, 100, 'Q' + sub('h') + ' = 528.9 W', 't', 'start');
  o += fat(390, 230, 390, 176, 28.4) + text(415, 212, 'Q' + sub('c') + ' = 500 W', 't', 'start');
  o += fat(300, 150, 364, 150, 1.6) + text(296, 154, 'W = 28.9 W', 'tl', 'end');
  return svg(560, 272, o, '左：heat engine 从 373 K 吸 1 J、向 293 K 放 0.786 J、输出 0.214 J work，两个 reservoir 的 entropy 变化相消；右：refrigerator 输入 28.9 W，从 277 K 抽出 500 W、向 293 K 放出 528.9 W');
}

function otto() {
  const g = 1.4, r = 8, V1 = 8, V2 = 1, P1 = 1, P2 = P1 * r ** g, P3 = 2.5 * P2, P4 = P3 / r ** g;
  const sx = lin(-1.4, 9, 70, 470), sy = lin(0, 50, 250, 30);
  let o = axes({ sx, sy, x0: -1.4, x1: 9, y0: 0, y1: 50, xt: [[1, 'V₂'], [8, 'V₁']], yt: [], xl: 'V', yl: 'P' });
  const ad = (P0, V0) => (v) => P0 * (V0 / v) ** g;
  const pts = [];
  for (let i = 0; i <= 60; i++) { const v = V1 + (V2 - V1) * i / 60; pts.push([sx(v), sy(ad(P1, V1)(v))]); }
  for (let i = 0; i <= 60; i++) { const v = V2 + (V1 - V2) * i / 60; pts.push([sx(v), sy(ad(P3, V2)(v))]); }
  o += path(d(pts) + 'Z', 'wash') + path(d(pts) + 'Z', 'ink');
  const T1 = 300, T2 = T1 * r ** (g - 1), T3 = 2.5 * T2, T4 = T3 / r ** (g - 1);
  const v = [[V1, P1, '1：' + T1.toFixed(0) + ' K', 10, 16, 'start'], [V2, P2, '2：' + T2.toFixed(0) + ' K', -10, 6, 'end'], [V2, P3, '3：' + T3.toFixed(0) + ' K', -10, 4, 'end'], [V1, P4, '4：' + T4.toFixed(0) + ' K', 10, -10, 'start']];
  for (const [vv, pp, s, dx, dy, an] of v) o += circle(sx(vv), sy(pp), 3.5, 'ink-f') + text(sx(vv) + dx, sy(pp) + dy, s, 'ts', an);
  o += arrow(sx(1) - 40, sy(32), sx(1) - 6, sy(32), 'ln') + text(sx(1) - 44, sy(32) + 4, 'Q' + sub('h'), 'tl', 'end');
  o += arrow(sx(8) + 6, sy(1.8), sx(8) + 40, sy(1.8), 'ln') + text(sx(8) + 44, sy(1.8) + 4, 'Q' + sub('c'), 'tl', 'start');
  o += text(sx(2.4) + 8, sy(15.5), 'adiabat', 'ts', 'start') + text(sx(1.15), sy(3), 'adiabat', 'ts', 'start');
  o += text(480, 42, 'V₁ = 8V₂', 'ts', 'start') + text(480, 60, 'r = 8，γ = 1.4', 'ts', 'start') + text(480, 78, 'e = 1 − 8' + sup('−0.4'), 'ts', 'start') + text(480, 96, '= 0.565', 'ts', 'start');
  return svg(560, 292, o, 'Otto cycle 的 PV 图：两段 adiabat 加两段 isochoric，四个顶点的 temperature 依次为 300、689、1723、750 K');
}

function carnot() {
  let o = '';
  // ideal gas γ = 5/3, Nk = 1, Th = 2, Tc = 1
  {
    const g = 5 / 3, Th = 2, Tc = 1, Va = 1, Vb = 2, Vc = Vb * (Th / Tc) ** (1 / (g - 1)), Vd = Va * (Th / Tc) ** (1 / (g - 1));
    const sx = lin(0, 6.2, 50, 270), sy = lin(0, 2.2, 250, 50);
    o += axes({ sx, sy, x0: 0, x1: 6.2, y0: 0, y1: 2.2, xt: [], yt: [], xl: 'V', yl: 'P' });
    const pts = [];
    for (let i = 0; i <= 40; i++) { const v = Va + (Vb - Va) * i / 40; pts.push([v, Th / v]); }
    for (let i = 1; i <= 40; i++) { const v = Vb + (Vc - Vb) * i / 40; pts.push([v, (Th / Vb) * (Vb / v) ** g]); }
    for (let i = 1; i <= 40; i++) { const v = Vc + (Vd - Vc) * i / 40; pts.push([v, Tc / v]); }
    for (let i = 1; i <= 40; i++) { const v = Vd + (Va - Vd) * i / 40; pts.push([v, (Tc / Vd) * (Vd / v) ** g]); }
    const P = pts.map(([v, p]) => [sx(v), sy(p)]);
    o += path(d(P) + 'Z', 'wash') + path(d(P) + 'Z', 'ln');
    o += text(sx(1.5) + 6, sy(1.33) - 8, 'T' + sub('h') + ' isotherm', 'ts', 'start');
    o += text(sx(4.2), sy(Tc / 4.2) + 18, 'T' + sub('c') + ' isotherm', 'ts', 'middle');
    o += text(160, 30, 'ideal gas（γ = 5/3）', 'tb', 'middle');
    o += text(160, 300, 'isotherm PV = const，adiabat PV' + sup('5/3') + ' = const', 'ts', 'middle');
  }
  // photon gas, a/3 = 1: P = T^4
  {
    const Th = 2, Tc = 1, Va = 1, Vb = 3, Vc = Vb * (Th / Tc) ** 3, Vd = Va * (Th / Tc) ** 3;
    const sx = lin(0, 26, 330, 545), sy = lin(0, 17.5, 250, 50);
    o += axes({ sx, sy, x0: 0, x1: 26, y0: 0, y1: 17.5, xt: [], yt: [], xl: 'V', yl: 'P' });
    const pts = [];
    pts.push([Va, Th ** 4], [Vb, Th ** 4]);
    for (let i = 1; i <= 50; i++) { const v = Vb + (Vc - Vb) * i / 50; pts.push([v, Th ** 4 * (Vb / v) ** (4 / 3)]); }
    pts.push([Vd, Tc ** 4]);
    for (let i = 1; i <= 50; i++) { const v = Vd + (Va - Vd) * i / 50; pts.push([v, Tc ** 4 * (Vd / v) ** (4 / 3)]); }
    const P = pts.map(([v, p]) => [sx(v), sy(p)]);
    o += path(d(P) + 'Z', 'wash') + path(d(P) + 'Z', 'ln');
    o += text(sx(2) + 4, sy(16) - 8, 'T' + sub('h') + '：P = aT' + sub('h') + sup('4') + '/3', 'ts', 'start');
    o += line(sx(13.5), sy(4.2), sx(12), sy(1) - 2, 'mute') + text(sx(13.5), sy(4.2) - 4, 'T' + sub('c') + ' isotherm', 'ts', 'start');
    o += text(438, 30, 'photon gas', 'tb', 'middle');
    o += text(438, 300, 'isotherm 水平，adiabat PV' + sup('4/3') + ' = const', 'ts', 'middle');
  }
  return svg(560, 306, o, '两个都在 T_h = 2T_c 之间工作的 Carnot cycle：左边 ideal gas 的 isotherm 是 hyperbola，右边 photon gas 的 isotherm 是水平线');
}

// ---------- 第 5 站 ----------
function fuelcell() {
  let o = '';
  const box = (x, lab) => rect(x, 90, 120, 70, 'paper', 6) + text(x + 60, 130, lab, 'tb', 'middle');
  // fuel cell
  o += text(140, 18, 'Fuel cell（298 K）', 'tb', 'middle');
  o += box(80, 'fuel cell');
  o += arrow(36, 110, 78, 110, 'ink') + text(32, 114, 'H₂', 't', 'end');
  o += arrow(36, 140, 78, 140, 'ink') + text(32, 144, '½O₂', 't', 'end');
  o += arrow(140, 162, 140, 196, 'ink') + text(140, 212, 'H₂O（liquid）', 't', 'middle');
  o += fat(202, 112, 262, 112, 23.7, 'solid') + text(206, 80, 'electrical work', 'tl', 'start') + text(206, 96, '≤ 237.1 kJ', 'tl', 'start');
  o += fat(202, 146, 262, 146, 4.9) + text(206, 172, 'heat ≥ 48.7 kJ', 't', 'start') + text(206, 188, '交给环境', 'ts', 'start');
  o += text(140, 240, 'ΔH = −285.8 kJ，ΔG = −237.1 kJ', 'ts', 'middle') + text(140, 256, 'TΔS = −48.7 kJ', 'ts', 'middle');
  // electrolysis
  o += text(430, 18, 'Electrolysis（298 K）', 'tb', 'middle');
  o += box(370, 'electrolysis');
  o += fat(290, 112, 368, 112, 23.7, 'solid') + text(300, 80, 'electrical work', 'tl', 'start') + text(300, 96, '≥ 237.1 kJ', 'tl', 'start');
  o += fat(290, 146, 368, 146, 4.9) + text(300, 172, 'heat ≤ 48.7 kJ', 't', 'start') + text(300, 188, '由环境供给', 'ts', 'start');
  o += arrow(430, 196, 430, 162, 'ink') + text(430, 212, 'H₂O（liquid）', 't', 'middle');
  o += arrow(492, 110, 524, 110, 'ink') + text(528, 114, 'H₂', 't', 'start');
  o += arrow(492, 140, 524, 140, 'ink') + text(528, 144, '½O₂', 't', 'start');
  o += text(430, 240, '1 mol H₂O 分解要 ΔH = 285.8 kJ，', 'ts', 'middle') + text(430, 256, '其中 237.1 kJ 必须是 work', 'ts', 'middle');
  return svg(560, 266, o, '左：fuel cell 把 285.8 kJ 的反应 enthalpy 分成最多 237.1 kJ 的 electrical work 和至少 48.7 kJ 的 heat；右：electrolysis 倒过来，需要输入至少 237.1 kJ 的 electrical work，其余 48.7 kJ 由环境以 heat 供给');
}

// ---------- 第 6 站 ----------
function gphase() {
  const Tb = 373.15, dS = 108.96;
  const sx = lin(345, 401, 70, 470), sy = lin(-2400, 2400, 250, 40);
  let o = axes({ sx, sy, x0: 345, x1: 401, y0: -2400, y1: 2400, xt: [[353.15, '80 °C'], [373.15, '100 °C'], [393.15, '120 °C']], yt: [], xl: 'T', yl: 'G（相对值）', xAt: -2400 });
  const Sl = 70; // 只为画图取一个 slope，比较的是两条线的差
  const Gl = (T) => -Sl * (T - Tb), Gg = (T) => -(Sl + dS) * (T - Tb);
  o += path(curve(Gl, 345, Tb, sx, sy), 'ln') + path(curve(Gl, Tb, 401, sx, sy), 'ln-dash');
  o += path(curve(Gg, Tb, Tb + 2400 / (Sl + dS), sx, sy), 'ink-b') + path(curve(Gg, Tb - 2400 / (Sl + dS), Tb, sx, sy), 'dash');
  o += line(sx(Tb), sy(-2400), sx(Tb), sy(0), 'grid') + circle(sx(Tb), sy(0), 4, 'ink-f');
  o += text(sx(349), sy(Gl(349)) - 10, 'liquid', 'tl', 'start');
  o += text(sx(382) + 8, sy(Gg(382)) + 4, 'vapor', 'tb', 'start');
  o += text(sx(380), sy(Gl(380)) - 30, 'liquid（metastable）', 'ts', 'start');
  o += text(sx(362) + 8, sy(Gg(362)) + 4, 'vapor（metastable）', 'ts', 'start');
  o += text(sx(Tb) - 8, sy(0) + 22, '交点：coexistence', 'ts', 'end');
  o += text(478, 70, '实线：G 较低，', 'ts', 'start') + text(478, 86, '实际出现', 'ts', 'start') + text(478, 102, '的 phase', 'ts', 'start');
  o += text(478, 136, '两条线 slope', 'ts', 'start') + text(478, 152, '之差 = ΔS', 'ts', 'start') + text(478, 168, '= 109 J/(mol·K)', 'ts', 'start');
  return svg(560, 292, o, '1 atm 下 liquid 与 vapor 的 molar Gibbs free energy 随 temperature 变化，两条直线在 100 度相交，vapor 的 slope 更陡');
}

function clap() {
  const LR = 4890.26, T0 = 373.15;
  const P = (Tc) => Math.exp(-LR * (1 / (Tc + 273.15) - 1 / T0));
  const sx = lin(60, 106, 70, 500), sy = lin(0, 1.2, 250, 30);
  let o = axes({ sx, sy, x0: 60, x1: 106, y0: 0, y1: 1.2, xt: [[60, '60'], [70, '70'], [80, '80'], [90, '90'], [100, '100']], yt: [[0.36, '0.36'], [1, '1']], xl: 'T（°C）', yl: 'P（atm）', grid: true });
  const slope = 3617 / 101325;
  o += path(curve(P, 60, 106, sx, sy), 'ln');
  o += path(curve((t) => 1 + slope * (t - 100), 76, 106, sx, sy), 'dash');
  o += line(sx(60), sy(0.36), sx(84), sy(0.36), 'mute');
  o += circle(sx(73.01), sy(0.36), 4, 'ln-f') + circle(sx(82.07), sy(0.36), 4, 'ink-f') + circle(sx(100), sy(1), 4, 'ink-f');
  o += text(sx(73.01), sy(0.36) + 20, '73 °C', 'tl', 'middle') + text(sx(82.07) + 6, sy(0.36) + 20, '82 °C', 't', 'start');
  o += text(sx(100) - 8, sy(1) - 8, '1 atm，100 °C', 'ts', 'end');
  o += text(sx(90), sy(0.95), 'tangent：3617 Pa/K', 'ts', 'end');
  o += text(sx(88) + 4, sy(P(88)) + 22, 'ln P 对 1/T 是 linear', 'ts', 'start');
  o += text(sx(62), sy(0.36) - 8, 'Everest 顶上', 'ts', 'start');
  return svg(560, 292, o, '水的 coexistence curve：积分形式在 0.36 atm 给出 73 度，100 度处的 tangent 给出 82 度');
}

const vdwP = (v, t) => (8 * t) / (3 * v - 1) - 3 / (v * v);
function vdw() {
  const sx = lin(0.4, 4, 70, 470), sy = lin(-0.2, 2, 250, 30);
  let o = axes({ sx, sy, x0: 0.4, x1: 4, y0: -0.2, y1: 2, xt: [[1, '1'], [2, '2'], [3, '3'], [4, '4']], yt: [[0, '0'], [1, '1'], [2, '2']], xl: 'V / V' + sub('c'), yl: 'P / P' + sub('c'), xAt: 0, grid: true });
  for (const t of [1.2, 1.0, 0.85]) {
    const segs = []; let cur = [];
    for (let i = 0; i <= 400; i++) {
      const v = 0.42 + (4 - 0.42) * i / 400, p = vdwP(v, t);
      if (p > 2 || p < -0.2) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
      cur.push([sx(v), sy(p)]);
    }
    if (cur.length > 1) segs.push(cur);
    const cls = t === 1 ? 'ink-b' : t < 1 ? 'ln' : 'mute';
    for (const s of segs) o += path(d(s), cls);
    const ly = { 1.2: 1.9, 1: 1.72, 0.85: 1.54 }[t];
    o += line(sx(2.75), sy(ly), sx(3.05), sy(ly), cls) + text(sx(3.12), sy(ly) + 4, 'T = ' + (t === 1 ? '' : t.toFixed(t === 0.85 ? 2 : 1) + ' ') + 'T' + sub('c'), t === 1 ? 'tb' : 'ts', 'start');
  }
  o += circle(sx(1), sy(1), 4.5, 'ink-f') + text(sx(1) + 8, sy(1) - 9, 'critical point', 'tb', 'start');
  o += text(sx(1.0), sy(0.17), 'T < T' + sub('c') + '：中间一段 slope > 0', 'ts', 'start');
  return svg(560, 292, o, 'Van der Waals gas 在 reduced variable 下的三条 isotherm：T 大于 T_c 单调下降，T 等于 T_c 在 critical point 有 inflection point，T 小于 T_c 出现 loop');
}

function maxwellA() {
  const t = 0.9, pc = 0.6470, vl = 0.6034, vg = 2.3488;
  const vs = []; for (let i = 0; i <= 300; i++) vs.push(0.565 + (3.2 - 0.565) * i / 300);
  // G(v)：dG = (3/8) v dP（单位 N k T_c）
  const G = [0];
  for (let i = 1; i < vs.length; i++) { const vm = (vs[i] + vs[i - 1]) / 2; G.push(G[i - 1] + 0.375 * vm * (vdwP(vs[i], t) - vdwP(vs[i - 1], t))); }
  const Gl = (() => { let i = vs.findIndex((v) => v >= vl); return G[i]; })();
  const Gr = G.map((g) => g - Gl);
  // 左图
  const sx = lin(0.4, 3.3, 50, 270), sy = lin(0.3, 1.0, 250, 50);
  let o = axes({ sx, sy, x0: 0.4, x1: 3.3, y0: 0.3, y1: 1.0, xt: [[1, '1'], [2, '2'], [3, '3']], yt: [[0.4, '0.4'], [0.647, '0.647'], [0.8, '0.8']], xl: 'V / V' + sub('c'), yl: 'P / P' + sub('c') });
  // equal areas
  const up = [], dn = [];
  vs.forEach((v) => { if (v >= vl && v <= vg) { const p = vdwP(v, t); (p >= pc ? up : dn).push([v, p]); } });
  const fillBetween = (arr) => { const a = arr.filter(([, p]) => p >= 0.3); if (a.length < 2) return ''; return path(d([[sx(a[0][0]), sy(pc)], ...a.map(([v, p]) => [sx(v), sy(p)]), [sx(a[a.length - 1][0]), sy(pc)]]) + 'Z', 'wash-strong'); };
  const lo = dn, hi = up;
  o += fillBetween(lo) + fillBetween(hi);
  const curPts = vs.map((v) => [sx(v), sy(Math.max(0.3, Math.min(1.0, vdwP(v, t))))]);
  o += path(d(curPts), 'ink');
  o += line(sx(vl), sy(pc), sx(vg), sy(pc), 'ln');
  o += text(sx(0.62), sy(0.92), 'liquid', 'ts', 'start') + text(sx(2.75), sy(0.68), 'gas', 'ts', 'start');
  o += text(160, 30, 'T = 0.9 T' + sub('c') + ' 的 isotherm', 'tb', 'middle');
  o += text(sx(1.95), sy(0.79), '两块 area 相等', 'ts', 'start');
  // 右图：G vs P
  const gx = lin(0.38, 1.0, 330, 545), gy = lin(-0.11, 0.09, 250, 50);
  o += axes({ sx: gx, sy: gy, x0: 0.38, x1: 1.0, y0: -0.11, y1: 0.09, xt: [[0.4, '0.4'], [0.647, '0.647'], [0.9, '0.9']], yt: [], xl: 'P / P' + sub('c'), yl: 'G' });
  const gpts = vs.map((v, i) => [vdwP(v, t), Gr[i]]).filter(([p]) => p >= 0.38 && p <= 1.0);
  o += path(d(gpts.map(([p, g]) => [gx(p), gy(g)])), 'ink');
  o += circle(gx(pc), gy(0), 4.5, 'ln-f') + text(gx(pc) + 8, gy(0) + 18, 'liquid = gas', 'tl', 'start');
  o += text(438, 30, '同一个点在 G–P 图上', 'tb', 'middle') + text(gx(0.86), gy(0.035) + 18, 'liquid 支', 'ts', 'start') + text(gx(0.56) - 6, gy(-0.09), 'gas 支', 'ts', 'end');
  // spinodal 标注
  o += text(gx(0.724) + 4, gy(Gr[vs.findIndex((v) => v >= 1.5285)]) - 6, 'spinodal', 'ts', 'start');
  // 动点：沿 v 走
  const idx = []; for (let k = 0; k <= 60; k++) idx.push(Math.round(k * (vs.length - 1) / 60));
  const N = idx.length, T = 9, move = 7;
  const kt = idx.map((_, k) => (move * k / (N - 1)) / T); kt.push(1);
  const seq = [...idx, idx[idx.length - 1]];
  const lpx = seq.map((i) => sx(vs[i])), lpy = seq.map((i) => sy(Math.max(0.3, Math.min(1.0, vdwP(vs[i], t)))));
  o += acircle(lpx, lpy, kt, T, 5.5, 'ln-f');
  o += acircle(seq.map((i) => gx(vdwP(vs[i], t))), seq.map((i) => gy(Gr[i])), kt, T, 5.5, 'ln-f');
  return svgA(560, 282, o, '动图：T=0.9T_c 的 van der Waals isotherm 与同一点在 G-P 图上的位置同步移动；G(P) 在两条 spinodal 处折回并自相交，交点处 pressure 0.647P_c 即 coexistence pressure，左图两块 area 相等');
}

// ---------- 第 7 站 ----------
function reservoir() {
  const N = 50, q = 100;
  const lnB = (m) => lnOmega(N, m);
  const tot = lnC(q + N, q);
  const pex = (n) => Math.exp(lnB(q - n) - tot);
  const r = q / (q + N);
  let o = '';
  // 左：一个 oscillator + 一块 solid
  o += rect(30, 110, 34, 34, 'wash-strong', 3) + text(47, 165, 'A', 'tb', 'middle') + text(47, 181, '1 个', 'ts', 'middle');
  o += rect(80, 60, 150, 134, 'wash2', 4);
  for (let i = 0; i < 10; i++) for (let j = 0; j < 5; j++) o += rect(88 + i * 14, 72 + j * 24, 10, 14, 'paper', 2);
  o += line(64, 127, 80, 127, 'ink-b');
  o += text(155, 214, 'B：N = 50 个 oscillator', 'ts', 'middle') + text(155, 230, '合起来 q = 100 份', 'ts', 'middle');
  o += text(130, 40, '一个 oscillator 接一块 solid', 'tb', 'middle');
  // 右：柱状图
  const sx = lin(-0.6, 8.6, 300, 540), sy = lin(0, 0.36, 230, 40);
  o += axes({ sx, sy, x0: -0.6, x1: 8.6, y0: 0, y1: 0.36, xt: [0, 1, 2, 3, 4, 5, 6, 7, 8], yt: [[0, '0'], [0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3']], xl: 'n', yl: 'p(n)' });
  for (let n = 0; n <= 8; n++) {
    o += rect(sx(n) - 9, sy(pex(n)), 18, sy(0) - sy(pex(n)), 'wash-strong');
    o += circle(sx(n), sy((1 - r) * r ** n), 3.5, 'ink-f');
  }
  o += rect(430, 52, 12, 10, 'wash-strong') + text(448, 61, 'exact counting', 'ts', 'start');
  o += circle(436, 78, 3.5, 'ink-f') + text(448, 82, '(q/(q+N))' + sup('n') + ' × 1/3', 'ts', 'start');
  return svg(560, 262, o, '左：一个 oscillator 接在 50 个 oscillator 的 solid 上；右：exact counting 给出的 p(n) 与 geometric 的 Boltzmann factor 几乎重合');
}

function hydrogen() {
  let o = '';
  const sy = lin(-14.5, -2.5, 240, 40);
  o += line(40, sy(-13.6), 140, sy(-13.6), 'ink-b') + text(36, sy(-13.6) + 4, '−13.6 eV', 'ts', 'end');
  o += line(40, sy(-3.4), 290, sy(-3.4), 'ink-b') + text(36, sy(-3.4) + 4, '−3.4 eV', 'ts', 'end');
  o += rect(70, sy(-13.6) - 26, 40, 22, 'solid', 3) + text(90, sy(-13.6) - 11, '1s', 'tw', 'middle');
  ['2s', '2p' + sub('x'), '2p' + sub('y'), '2p' + sub('z')].forEach((s, i) => { o += rect(50 + i * 60, sy(-3.4) - 26, 44, 22, 'paper', 3) + text(72 + i * 60, sy(-3.4) - 11, s, 't', 'middle'); });
  o += arrow(160, sy(-13.6), 160, sy(-3.4) + 4, 'ln') + text(168, (sy(-13.6) + sy(-3.4)) / 2 + 4, '10.2 eV', 'tl', 'start');
  o += text(310, 70, '每个 excited microstate：', 'tb', 'start');
  o += text(310, 90, 'e' + sup('−10.2 eV / kT') + ' = 4.0×10' + sup('−6') + ' 倍于 1s', 't', 'start');
  o += text(310, 122, '四个合起来：', 'tb', 'start');
  o += text(310, 142, '4 × 4.0×10' + sup('−6') + ' = 1.6×10' + sup('−5'), 't', 'start');
  o += text(310, 176, '由此 kT = 10.2 eV / ln(2.5×10' + sup('5') + ')', 'ts', 'start');
  o += text(310, 194, '= 0.821 eV，T = 9.5×10' + sup('3') + ' K', 'ts', 'start');
  o += text(90, sy(-13.6) + 22, 'ground state：1 个 microstate', 'ts', 'start');
  return svg(560, 270, o, 'Hydrogen 的 ground state 只有一个 microstate，第一 excited level 有 2s、2p_x、2p_y、2p_z 四个 microstate，两者相差 10.2 eV');
}

function heatcap() {
  const C = (x) => { const b = 1 / x; return (b * b * Math.exp(b)) / (Math.exp(b) - 1) ** 2; };
  const sx = lin(0, 2.5, 70, 480), sy = lin(0, 1.1, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 2.5, y0: 0, y1: 1.1, xt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5'], [2, '2'], [2.5, '2.5']], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'kT / ε', yl: 'C / k', grid: true });
  o += line(sx(0), sy(1), sx(2.5), sy(1), 'dash') + text(sx(2.5), sy(1) - 8, 'equipartition', 'ts', 'end');
  o += path(curve(C, 0.03, 2.5, sx, sy, 300), 'ln');
  for (const [x, lab, an, dx] of [[1, '0.921', 'start', 8], [0.2, '0.171', 'start', 8]]) o += circle(sx(x), sy(C(x)), 4, 'ink-f') + text(sx(x) + dx, sy(C(x)) + 16, lab, 'ts', an);
  o += text(sx(0.45), sy(0.3), '← frozen out', 'tl', 'start');
  return svg(560, 292, o, '一个 quantum harmonic oscillator 的 heat capacity 随 kT/epsilon 的变化：高温趋于 k，低温指数地趋于 0');
}

// ---------- 第 8 站 ----------
function baro() {
  const Hs = 8.777; // km
  let o = '';
  const colY = lin(0, 20, 250, 30);
  o += rect(60, colY(20), 90, colY(0) - colY(20), 'frame');
  // 确定性的 “随机” 点：density ∝ e^{-h/H}
  let s = 12345; const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let k = 0; k < 900; k++) { const h = rnd() * 20, x = 64 + rnd() * 82; if (rnd() < Math.exp(-h / Hs)) o += circle(x, colY(h), 1.4, 'mute-f'); }
  const bx = (h, lab) => rect(100, colY(h) - 10, 30, 20, 'ln') + text(156, colY(h) + 5, lab, 't', 'start');
  o += bx(0.6, 'μ(0)') + bx(8.85, 'μ(8.85 km)');
  o += text(105, colY(20) - 8, '300 K 的空气柱', 'ts', 'middle');
  o += text(156, colY(4.7), '两个 box 交换 molecule，', 'ts', 'start') + text(156, colY(4.7) + 16, 'equilibrium 时 μ 相等', 'ts', 'start');
  const sx = lin(0, 1, 330, 520), sy = colY;
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 20, xt: [[0, '0'], [0.5, '0.5'], [1, '1']], yt: [[0, '0'], [10, '10'], [20, '20 km']], xl: 'n(h) / n(0)' });
  const pts = []; for (let i = 0; i <= 100; i++) { const h = 20 * i / 100; pts.push([sx(Math.exp(-h / Hs)), sy(h)]); }
  o += path(d(pts), 'ln');
  const e = Math.exp(-8.849 / Hs);
  o += circle(sx(e), sy(8.849), 4, 'ink-f') + text(sx(e) + 8, sy(8.849) - 6, 'Everest：0.365', 'ts', 'start');
  o += text(sx(0.55), sy(15), 'e' + sup('−mgh/kT'), 'tl', 'start') + text(sx(0.55), sy(15) + 18, 'kT/mg = 8.78 km', 'ts', 'start');
  return svg(560, 292, o, '左：竖直的空气柱，molecule 的 density 随高度指数减少，两个高度的小 box 的 chemical potential 相等；右：n(h)/n(0) 随高度的变化，Everest 处为 0.365');
}

function speed() {
  const k = 1.380649e-23, m = 28.0134 * 1.660539e-27, T = 300;
  const D = (v) => (m / (2 * Math.PI * k * T)) ** 1.5 * 4 * Math.PI * v * v * Math.exp((-m * v * v) / (2 * k * T));
  const sx = lin(0, 1400, 70, 500), sy = lin(0, 2.9e-3, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1400, y0: 0, y1: 2.9e-3, xt: [0, 200, 400, 600, 800, 1000, 1200, 1400], yt: [], xl: 'v（m/s）', yl: 'D(v)' });
  o += path(area(D, 0, 1400, sx, sy), 'wash') + path(curve(D, 0, 1400, sx, sy), 'ln');
  const marks = [[422, 'v' + sub('mp') + ' = 422', 84, 'end'], [476, '⟨v⟩ = 476', 66, 'end'], [517, 'v' + sub('rms') + ' = 517', 48, 'start']];
  for (const [v, s, y, an] of marks) o += line(sx(v), sy(0), sx(v), y, 'mute') + text(sx(v) + (an === 'end' ? -4 : 4), y + 4, s, 'ts', an);
  o += text(sx(900), sy(D(900)) - 8, '300 K 的 N₂', 'ts', 'start');
  return svg(560, 292, o, '300 K 的氮气分子 speed distribution，标出 most probable speed 422、mean speed 476 和 rms speed 517 m/s');
}

// ---------- 第 9 站 ----------
function dist() {
  const sx = lin(-3, 5, 70, 480), ly = (v) => Math.log10(v), sy = lin(-2.5, 1.5, 250, 30);
  let o = axes({ sx, sy, x0: -3, x1: 5, y0: -2.5, y1: 1.5, xt: [-3, -2, -1, 0, 1, 2, 3, 4, 5], yt: [[-2, '0.01'], [-1, '0.1'], [0, '1'], [1, '10']], xl: '(ε − μ) / kT', yl: 'n̄', xAt: -2.5, grid: true });
  o += path(curve((x) => ly(Math.exp(-x)), -1.5, 5, sx, sy), 'dash');
  o += path(curve((x) => ly(1 / (Math.exp(x) + 1)), -3, 5, sx, sy), 'ln');
  o += path(curve((x) => ly(1 / (Math.exp(x) - 1)), 0.03, 5, sx, sy), 'ink-b');
  o += text(sx(-1.5) - 6, sy(ly(Math.exp(1.5))) + 4, 'Boltzmann（虚线）', 'ts', 'end');
  o += text(sx(-2.9), sy(-0.5), 'Fermi–Dirac', 'tl', 'start') + text(sx(-2.9), sy(-0.5) + 16, '不超过 1', 'ts', 'start');
  o += text(sx(0.25), sy(1.2), 'Bose–Einstein', 'tb', 'start') + text(sx(0.25), sy(1.2) + 16, 'ε → μ 时 diverge', 'ts', 'start');
  o += text(sx(2.6), sy(-1.95), '三条合在一起', 'ts', 'start');
  return svg(560, 292, o, 'Fermi-Dirac、Bose-Einstein 与 Boltzmann 三种 distribution 随 (epsilon-mu)/kT 的变化，纵轴为 log scale');
}

function five() {
  let o = '';
  const lv = 6, dy = 11;
  const ladder = (x, y, w, lev = lv) => { let q = ''; for (let i = 0; i < lev; i++) q += line(x, y - i * dy, x + w, y - i * dy, 'axis'); return q; };
  const ball = (x, y, cls = 'ln-f', lab = '') => circle(x, y - 4, 4, cls) + (lab ? text(x, y - 13, lab, 'ts', 'middle') : '');
  // 标题
  o += text(80, 20, 'fermion', 'tb', 'middle') + text(240, 20, 'boson', 'tb', 'middle') + text(430, 20, 'distinguishable', 'tb', 'middle');
  o += text(6, 84, 'ground', 'ts', 'start');
  o += text(6, 200, '+1 份', 'ts', 'start');
  // fermion
  o += ladder(50, 100, 60);
  for (let i = 0; i < 5; i++) o += ball(80, 100 - i * dy);
  o += text(80, 124, 'E₀ = 10ε', 'ts', 'middle');
  o += ladder(50, 220, 60, 7);
  for (const i of [0, 1, 2, 3, 5]) o += ball(80, 220 - i * dy);
  o += text(80, 244, '1 个', 'tl', 'middle');
  // boson
  o += ladder(200, 100, 80);
  for (let i = 0; i < 5; i++) o += ball(212 + i * 14, 100);
  o += text(240, 124, 'E₀ = 0', 'ts', 'middle');
  o += ladder(200, 220, 80);
  for (let i = 0; i < 4; i++) o += ball(212 + i * 14, 220);
  o += ball(240, 220 - dy);
  o += text(240, 244, '1 个', 'tl', 'middle');
  // distinguishable
  o += ladder(370, 100, 120);
  for (let i = 0; i < 5; i++) o += circle(386 + i * 22, 96, 7, 'paper') + text(386 + i * 22, 100, String(i + 1), 'ts', 'middle');
  o += text(430, 124, 'E₀ = 0', 'ts', 'middle');
  for (let s = 0; s < 5; s++) {
    const x0 = 330 + s * 46, y0 = 220;
    o += line(x0, y0, x0 + 40, y0, 'axis') + line(x0, y0 - 16, x0 + 40, y0 - 16, 'axis');
    let k = 0;
    for (let i = 0; i < 5; i++) {
      if (i === s) { o += circle(x0 + 20, y0 - 21, 5.5, 'ln-f') + text(x0 + 20, y0 - 18, String(i + 1), 'tw', 'middle'); continue; }
      o += circle(x0 + 5 + k * 10, y0 - 5, 4.5, 'paper'); k++;
    }
  }
  o += text(430, 244, '5 个（哪一个跳上去）', 'tl', 'middle');
  o += text(280, 272, 'Level 间距 ε，从下往上是 0, ε, 2ε, …；每个球是一个 particle', 'ts', 'middle');
  return svg(560, 280, o, '五个 particle 在等间距 level 上：fermion 的 ground state 填到第 4 级，多一份 energy 只有 1 个 state；boson 全在第 0 级，多一份 energy 有 1 个 state；distinguishable 多一份 energy 有 5 个 state');
}

// ---------- 第 10 站 ----------
function fermisphere() {
  const nmax = 10.5, s = 19, X0 = 60, Y0 = 250;
  let o = line(X0, Y0, X0 + 14 * s, Y0, 'axis') + line(X0, Y0, X0, Y0 - 12 * s, 'axis');
  o += text(X0 + 14 * s, Y0 + 16, 'n' + sub('x'), 'ts', 'end') + text(X0 - 6, Y0 - 12 * s, 'n' + sub('y'), 'ts', 'end');
  const arcp = []; for (let k = 0; k <= 60; k++) { const a = (Math.PI / 2) * k / 60; arcp.push([X0 + nmax * s * Math.cos(a), Y0 - nmax * s * Math.sin(a)]); }
  o += path(d([[X0, Y0], ...arcp]) + 'Z', 'wash') + path(d(arcp), 'ln');
  let inside = 0;
  for (let i = 1; i <= 13; i++) for (let j = 1; j <= 11; j++) {
    const r = Math.hypot(i, j), x = X0 + i * s, y = Y0 - j * s;
    if (r <= nmax) { o += circle(x, y, 3, 'ink-f'); inside++; } else o += circle(x, y, 2.6, 'paper');
  }
  o += arrow(X0, Y0, X0 + nmax * s * Math.cos(0.95), Y0 - nmax * s * Math.sin(0.95), 'ink');
  o += text(X0 + 0.5 * nmax * s * Math.cos(0.95) + 8, Y0 - 0.5 * nmax * s * Math.sin(0.95), 'n' + sub('max'), 'tb', 'start');
  o += text(360, 70, '实心点：ε ≤ ε' + sub('F') + '，每个放 2 个 electron', 'ts', 'start');
  o += text(360, 90, '空心点：空着', 'ts', 'start');
  o += text(360, 130, '三维时数 octant 的 volume：', 'ts', 'start');
  o += text(360, 150, 'N = 2 × ⅛ × ⁴⁄₃ π n' + sub('max') + sup('3'), 't', 'start');
  o += text(360, 190, 'ε' + sub('F') + ' = h² n' + sub('max') + sup('2') + ' / (8mL²)', 't', 'start');
  return svg(560, 270, o, 'n-space 的一个截面：半径 n_max 以内的格点是 energy 不超过 Fermi energy 的 orbital，全部被占据');
}

function fdA() {
  // 3D：∫0^∞ √x n̄ dx = 2/3（x = ε/ε_F）
  const nbar = (x, m, t) => 1 / (Math.exp((x - m) / t) + 1);
  const count = (m, t) => { let s = 0; const M = 3000, X = 3; for (let i = 0; i < M; i++) { const x = (i + 0.5) * X / M; s += Math.sqrt(x) * nbar(x, m, t) * X / M; } return s; };
  const solveMu = (t) => { let lo = -2, hi = 1.5; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (count(m, t) > 2 / 3) hi = m; else lo = m; } return (lo + hi) / 2; };
  const ts = [0.01, 0.05, 0.1, 0.2, 0.3, 0.4];
  const mus = ts.map(solveMu);
  const sx = lin(0, 2, 70, 470), syA = lin(0, 1.1, 120, 30), syB = lin(0, 1.3, 260, 150);
  let o = axes({ sx, sy: syA, x0: 0, x1: 2, y0: 0, y1: 1.1, xt: [], yt: [[0, '0'], [1, '1']], yl: 'n̄(ε)' });
  o += axes({ sx, sy: syB, x0: 0, x1: 2, y0: 0, y1: 1.3, xt: [[0, '0'], [0.5, '0.5'], [1, 'ε' + sub('F')], [1.5, '1.5'], [2, '2']], yt: [], xl: 'ε / ε' + sub('F'), yl: 'g(ε) n̄(ε)' });
  o += path(curve((x) => Math.sqrt(x), 0, 2, sx, syB), 'dash') + text(sx(1.75), syB(Math.sqrt(1.75)) - 8, 'g(ε) ∝ √ε', 'ts', 'middle');
  const M = 200;
  const topD = (m, t) => d(Array.from({ length: M + 1 }, (_, i) => { const x = 2 * i / M; return [sx(x), syA(nbar(x, m, t))]; }));
  const botD = (m, t) => { const pts = Array.from({ length: M + 1 }, (_, i) => { const x = 2 * i / M; return [sx(x), syB(Math.sqrt(x) * nbar(x, m, t))]; }); return d([[sx(0), syB(0)], ...pts, [sx(2), syB(0)]]) + 'Z'; };
  const muD = (m) => d([[sx(m), syA(0) + 4], [sx(m), syA(1.08)]]);
  const n = ts.length, hold = 1.3, T = hold * n * 2 - hold * 2;
  // 来回：0..n-1..0
  const seq = [...ts.keys(), ...[...ts.keys()].reverse().slice(1)];
  const kt = seq.map((_, i) => i / (seq.length - 1));
  o += apath(seq.map((i) => botD(mus[i], ts[i])), kt, T, 'wash');
  o += apath(seq.map((i) => topD(mus[i], ts[i])), kt, T, 'ln');
  o += apath(seq.map((i) => muD(mus[i])), kt, T, 'mute');
  ts.forEach((t, k) => {
    const on = seq.map((i) => (i === k ? 1 : 0));
    o += `<g opacity="${k === 0 ? 1 : 0}">${text(480, 50, 'kT/ε' + sub('F') + ' = ' + t.toFixed(2), 'tl', 'start')}${text(480, 70, 'μ/ε' + sub('F') + ' = ' + mus[k].toFixed(3), 't', 'start')}${anim('opacity', on, kt, T, true)}</g>`;
  });
  o += text(sx(mus[0]) - 6, syA(1.08) + 4, 'μ', 'ts', 'end');
  return svgA(560, 300, o, '动图：3D Fermi gas 的占有数和每个 energy 上的 electron 数随 kT/epsilon_F 从 0.01 升到 0.4 的变化，step 被抹平，chemical potential 向下移');
}

// ---------- 第 11 站 ----------
function planckA() {
  const kB = 8.617333e-5;
  const u = (e, T) => (e ** 3) / (Math.exp(e / (kB * T)) - 1);
  const Ts = []; for (let T = 3000; T <= 6000; T += 250) Ts.push(T);
  const seq = [...Ts, ...[...Ts].reverse().slice(1)];
  const umax = u(2.821 * kB * 6000, 6000);
  const sx = lin(0, 4, 70, 470), sy = lin(0, 1.08, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 1.08, xt: [[0, '0'], [1, '1'], [2, '2'], [3, '3'], [4, '4 eV']], yt: [], xl: 'photon energy ε', yl: 'u(ε)' });
  const M = 160;
  const cD = (T) => d([[sx(0), sy(0)], ...Array.from({ length: M }, (_, i) => { const e = 4 * (i + 1) / M; return [sx(e), sy(u(e, T) / umax)]; }), [sx(4), sy(0)]]) + 'Z';
  const pk = (T) => d([[sx(2.821 * kB * T), sy(0)], [sx(2.821 * kB * T), sy(u(2.821 * kB * T, T) / umax)]]);
  const Tt = 8, kt = seq.map((_, i) => i / (seq.length - 1));
  o += path(curve((e) => u(e, 6000) / umax, 0.02, 4, sx, sy), 'mute') + text(sx(2.821 * kB * 6000) + 6, sy(1) - 4, '6000 K', 'ts', 'start');
  o += apath(seq.map(cD), kt, Tt, 'wash');
  o += apath(seq.map((T) => d([...Array.from({ length: M }, (_, i) => { const e = 4 * (i + 1) / M; return [sx(e), sy(u(e, T) / umax)]; })])), kt, Tt, 'ln');
  o += apath(seq.map(pk), kt, Tt, 'dash');
  // 读数（离散）
  Ts.forEach((T, k) => {
    const on = seq.map((x) => (x === T ? 1 : 0));
    o += `<g opacity="${k === 0 ? 1 : 0}">${text(480, 70, 'T = ' + T + ' K', 'tl', 'start')}${text(480, 90, 'peak ' + (2.821 * kB * T).toFixed(2) + ' eV', 't', 'start')}${text(480, 110, 'area ∝ ' + ((T / 3000) ** 4).toFixed(1) + ' ×', 't', 'start')}${anim('opacity', on, kt, Tt, true)}</g>`;
  });
  o += text(480, 150, '（以 3000 K', 'ts', 'start') + text(480, 166, '的 area 为 1）', 'ts', 'start');
  o += text(sx(2.4), sy(0.95), '虚线：peak 在 2.821 kT', 'ts', 'start');
  return svgA(560, 292, o, '动图：blackbody 的 Planck spectrum 随 temperature 在 3000 K 与 6000 K 之间变化，peak 线性地移动，curve 下的 area 按 T 的四次方变化');
}

function bec() {
  const sx = lin(0, 1.5, 70, 470), sy = lin(0, 1.05, 250, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1.5, y0: 0, y1: 1.05, xt: [[0, '0'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']], yt: [[0, '0'], [0.5, '0.5'], [1, '1']], xl: 'T / T' + sub('c'), yl: 'N₀ / N', grid: true });
  o += path(curve((t) => 1 - t ** 1.5, 0, 1, sx, sy), 'ln') + path(d([[sx(1), sy(0)], [sx(1.5), sy(0)]]), 'ln');
  o += path(curve((t) => t ** 1.5, 0, 1, sx, sy), 'dash') + text(sx(0.97) + 6, sy(0.93), 'excited：(T/T' + sub('c') + ')' + sup('3/2'), 'ts', 'start');
  const y = 1 - 0.5 ** 1.5;
  o += circle(sx(0.5), sy(y), 4, 'ink-f') + text(sx(0.5) - 8, sy(y) + 20, 'T = T' + sub('c') + '/2：64.6%', 'ts', 'end');
  o += text(sx(0.2), sy(0.95) - 6, 'ground state', 'tl', 'start');
  o += text(480, 120, 'liquid ⁴He 的', 'ts', 'start') + text(480, 136, 'density 算出', 'ts', 'start') + text(480, 152, 'T' + sub('c') + ' = 3.13 K', 'ts', 'start');
  return svg(560, 292, o, 'Bose-Einstein condensation：ground state 上的 particle 比例 1 减 (T/T_c) 的 3/2 次方，T_c 以上为 0');
}

export default {
  'pc2135-kinetic': kinetic,
  'pc2135-cycle': cycleA,
  'pc2135-solid': solid,
  'pc2135-twosolid': twosolidA,
  'pc2135-st': st,
  'pc2135-para': para,
  'pc2135-schottky': schottky,
  'pc2135-engine': engine,
  'pc2135-otto': otto,
  'pc2135-carnot': carnot,
  'pc2135-fuelcell': fuelcell,
  'pc2135-gphase': gphase,
  'pc2135-clap': clap,
  'pc2135-vdw': vdw,
  'pc2135-maxwell': maxwellA,
  'pc2135-reservoir': reservoir,
  'pc2135-hydrogen': hydrogen,
  'pc2135-heatcap': heatcap,
  'pc2135-baro': baro,
  'pc2135-speed': speed,
  'pc2135-dist': dist,
  'pc2135-five': five,
  'pc2135-fermisphere': fermisphere,
  'pc2135-fdA': fdA,
  'pc2135-planck': planckA,
  'pc2135-bec': bec,
};
