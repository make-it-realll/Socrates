import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes, svgA, anim, ashow } from '../lib/svg.mjs';

// ---------- 共用：两个 state 的 MDP（第 1、2、5 站） ----------
// A：stay（r = 1，留在 A）或 go（r = 0，去 B）；B：r = 2，0.9 留在 B，0.1 回到 A。
function twostate() {
  const A = [150, 120], B = [400, 120], R = 34;
  let o = '';
  o += circle(A[0], A[1], R, 'paper') + text(A[0], A[1] + 6, 'A', 'tbig', 'middle');
  o += circle(B[0], B[1], R, 'paper') + text(B[0], B[1] + 6, 'B', 'tbig', 'middle');
  // A 的 self-loop（stay）
  o += path(`M${A[0] - 22} ${A[1] - 26} C ${A[0] - 70} ${A[1] - 110}, ${A[0] + 70} ${A[1] - 110}, ${A[0] + 22} ${A[1] - 26}`, 'ink');
  o += arrow(A[0] + 30, A[1] - 40, A[0] + 22, A[1] - 26, 'ink');
  o += text(A[0], A[1] - 92, 'stay：r = 1', 't', 'middle');
  // A → B（go）
  o += path(`M${A[0] + 30} ${A[1] - 16} C ${A[0] + 100} ${A[1] - 50}, ${B[0] - 100} ${B[1] - 50}, ${B[0] - 30} ${B[1] - 16}`, 'ln');
  o += arrow(B[0] - 44, B[1] - 22, B[0] - 30, B[1] - 16, 'ln');
  o += text((A[0] + B[0]) / 2, A[1] - 52, 'go：r = 0', 'tl', 'middle');
  // B → A（probability 0.1）
  o += path(`M${B[0] - 30} ${B[1] + 16} C ${B[0] - 100} ${B[1] + 50}, ${A[0] + 100} ${A[1] + 50}, ${A[0] + 30} ${A[1] + 16}`, 'mute');
  o += arrow(A[0] + 44, A[1] + 22, A[0] + 30, A[1] + 16, 'mute');
  o += text((A[0] + B[0]) / 2, A[1] + 62, 'r = 2，probability 0.1 回到 A', 't', 'middle');
  // B 的 self-loop
  o += path(`M${B[0] - 22} ${B[1] - 26} C ${B[0] - 70} ${B[1] - 110}, ${B[0] + 70} ${B[1] - 110}, ${B[0] + 22} ${B[1] - 26}`, 'ink');
  o += arrow(B[0] + 30, B[1] - 40, B[0] + 22, B[1] - 26, 'ink');
  o += text(B[0], B[1] - 92, 'r = 2，probability 0.9 留在 B', 't', 'middle');
  o += text(280, 222, 'A 有两个 action，B 只有一个 action。γ = 0.9 时 optimal 的是 go；γ < 10/19 时是 stay。', 'ts', 'middle');
  return svg(560, 234, o, '两个 state 的 MDP：A 可以 stay 拿 reward 1，或者 go 到 B；B 每步拿 reward 2，以 0.1 的 probability 回到 A');
}

// ---------- gridworld：value iteration ----------
const GW = (() => {
  const W = 4, H = 3, wall = '2,2', term = { '4,3': 1, '4,2': -1 }, g = 0.9;
  const cells = [];
  for (let y = H; y >= 1; y--) for (let x = 1; x <= W; x++) if (`${x},${y}` !== wall) cells.push([x, y]);
  const acts = { N: [0, 1], S: [0, -1], E: [1, 0], W: [-1, 0] };
  const perp = { N: ['E', 'W'], S: ['E', 'W'], E: ['N', 'S'], W: ['N', 'S'] };
  const move = (s, a) => {
    const n = [s[0] + acts[a][0], s[1] + acts[a][1]];
    if (`${n[0]},${n[1]}` === wall || n[0] < 1 || n[0] > W || n[1] < 1 || n[1] > H) return s;
    return n;
  };
  const key = (s) => `${s[0]},${s[1]}`;
  const trans = (s, a) => [[0.8, move(s, a)], [0.1, move(s, perp[a][0])], [0.1, move(s, perp[a][1])]];
  const backup = (V) => {
    const Vn = {}, pol = {};
    for (const s of cells) {
      const k = key(s);
      if (k in term) { Vn[k] = 0; continue; }
      let best = -Infinity, ba = null;
      for (const a of ['N', 'S', 'E', 'W']) {
        const q = trans(s, a).reduce((t, [p, s2]) => t + p * ((term[key(s2)] || 0) + g * V[key(s2)]), 0);
        if (q > best + 1e-12) { best = q; ba = a; }
      }
      Vn[k] = best; pol[k] = ba;
    }
    return [Vn, pol];
  };
  let V = {};
  for (const s of cells) V[key(s)] = 0;
  const hist = [V];
  let pol;
  for (let k = 0; k < 200; k++) { [V, pol] = backup(V); hist.push(V); }
  const err = hist.slice(0, 60).map((h) => Math.max(...cells.map((s) => Math.abs(h[key(s)] - V[key(s)]))));
  return { V, pol, err, term, wall, hist, greedy: (V) => backup(V)[1] };
})();

function grid() {
  const S = 92, x0 = 24, y0 = 18;
  const px = (x) => x0 + (x - 1) * S, py = (y) => y0 + (3 - y) * S;
  let o = '';
  for (let y = 3; y >= 1; y--) for (let x = 1; x <= 4; x++) {
    const k = `${x},${y}`, X = px(x), Y = py(y);
    if (k === GW.wall) { o += rect(X, Y, S, S, 'solid2'); continue; }
    if (k in GW.term) {
      const v = GW.term[k];
      o += rect(X, Y, S, S, v > 0 ? 'wash-strong' : 'wash2') + rect(X, Y, S, S, 'frame');
      o += text(X + S / 2, Y + S / 2 + 8, v > 0 ? '+1' : '−1', 'tbig', 'middle');
      continue;
    }
    o += rect(X, Y, S, S, 'frame');
    o += text(X + S / 2, Y + 26, GW.V[k].toFixed(3), 'tb', 'middle');
    const a = GW.pol[k], cx = X + S / 2, cy = Y + 58, L = 17;
    const dir = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[a];
    o += arrow(cx - dir[0] * L, cy - dir[1] * L, cx + dir[0] * L, cy + dir[1] * L, 'ln');
  }
  o += rect(x0, y0, 4 * S, 3 * S, 'frame');
  const tx = x0 + 4 * S + 18;
  o += text(tx, 40, 'γ = 0.9', 'tb') + text(tx, 62, '每个 action：', 't') + text(tx, 80, '0.8 按意图走，', 'ts') + text(tx, 97, '0.1 + 0.1 偏到两侧，', 'ts') + text(tx, 114, '撞墙就原地不动。', 'ts');
  o += text(tx, 146, '进入 +1 或 −1', 't') + text(tx, 164, '拿到那个 reward，', 'ts') + text(tx, 181, 'episode 结束。', 'ts');
  o += text(tx, 214, '数字是 V*，', 't') + text(tx, 232, '箭头是对 V* 的', 'ts') + text(tx, 249, 'greedy policy。', 'ts');
  return svg(560, 3 * S + 2 * y0, o, '4 乘 3 的 gridworld，value iteration converge 后每个格子的 optimal value 和 greedy policy 的箭头');
}

// ---------- value iteration 前几轮：value 从 +1 一圈圈往外传 ----------
function visweeps() {
  const S = 58, H = 40;
  let o = '';
  const panel = (x0, y0, k, title) => {
    const V = GW.hist[k];
    o += text(x0, y0 - 8, title, 'tb', 'start');
    for (let y = 3; y >= 1; y--) for (let x = 1; x <= 4; x++) {
      const key = `${x},${y}`, X = x0 + (x - 1) * S, Y = y0 + (3 - y) * H;
      if (key === GW.wall) { o += rect(X, Y, S, H, 'solid2'); continue; }
      if (key in GW.term) { o += rect(X, Y, S, H, GW.term[key] > 0 ? 'wash-strong' : 'wash2') + text(X + S / 2, Y + H / 2 + 5, GW.term[key] > 0 ? '+1' : '−1', 'tb', 'middle'); continue; }
      const v = V[key];
      if (v > 1e-9) o += rect(X, Y, S, H, 'wash');
      o += text(X + S / 2, Y + H / 2 + 5, v > 1e-9 ? v.toFixed(3) : '0', v > 1e-9 ? 't' : 'ts', 'middle');
    }
    for (let i = 0; i <= 4; i++) o += line(x0 + i * S, y0, x0 + i * S, y0 + 3 * H, 'frame');
    for (let j = 0; j <= 3; j++) o += line(x0, y0 + j * H, x0 + 4 * S, y0 + j * H, 'frame');
  };
  panel(20, 30, 1, 'V₁：只剩 1 步');
  panel(308, 30, 2, 'V₂：只剩 2 步');
  panel(20, 192, 3, 'V₃：只剩 3 步');
  panel(308, 192, 5, 'V₅：只剩 5 步');
  o += text(280, 338, '浅色格子是 value 已经非零的格子。每做一次 sweep，非零的区域从 +1 往外多走一格。', 'ts', 'middle');
  return svg(560, 348, o, 'gridworld 上 value iteration 的 V1、V2、V3、V5：非零的 value 从 +1 的格子一圈一圈往外扩');
}

// ---------- value iteration 的 error：log scale ----------
function vierr() {
  const g = 0.9;
  const vA = (2 * g) / ((1 - g) * (1 + 0.1 * g)), vB = vA / g;
  let V = [0, 0];
  const e2 = [];
  for (let k = 0; k <= 60; k++) {
    e2.push(Math.max(Math.abs(V[0] - vA), Math.abs(V[1] - vB)));
    V = [Math.max(1 + g * V[0], g * V[1]), 2 + g * (0.9 * V[1] + 0.1 * V[0])];
  }
  const eg = GW.err;
  const sx = lin(0, 60, 70, 520), sy = lin(-12, 2, 236, 24);
  let o = '';
  for (const k of [-12, -9, -6, -3, 0]) o += line(sx(0), sy(k), sx(60), sy(k), 'grid') + text(64, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
  for (const k of [0, 10, 20, 30, 40, 50, 60]) o += line(sx(k), sy(-12), sx(k), sy(-12) + 4, 'axis') + text(sx(k), sy(-12) + 18, String(k), 'ts', 'middle');
  o += line(sx(0), sy(-12), sx(60), sy(-12), 'axis') + line(sx(0), sy(-12), sx(0), sy(2), 'axis');
  const ser = (arr, cls, kmax = 60) => path(d(arr.slice(0, kmax + 1).map((v, k) => [sx(k), sy(Math.max(Math.log10(v), -12))])), cls);
  const bound = (e0) => path(d([[sx(0), sy(Math.log10(e0))], [sx(60), sy(Math.log10(e0 * g ** 60))]]), 'dash');
  o += bound(e2[0]) + bound(eg[0]);
  o += ser(e2, 'ln') + ser(eg, 'ink-b', 39);
  o += text(sx(14), sy(1.6), '两个 state 的 MDP（彩线）：与上面那条虚线 γᵏ 重合', 'tl');
  o += text(sx(32), sy(-6.5), 'gridworld：比 γᵏ 快得多', 'tb') + text(sx(32), sy(-7.5), '后期每轮约乘 0.41', 'ts');
  o += text(sx(31), sy(-3.4), '虚线：γᵏ ‖V₀ − V*‖∞', 't');
  o += text(520, 268, 'sweep 次数 k', 'ts', 'end') + text(70, 14, '‖Vₖ − V*‖∞（log scale）', 'tb');
  return svg(560, 276, o, 'Value iteration 的 error 随 sweep 次数下降：两个 state 的 MDP 每轮恰好乘 0.9，gridworld 下降得更快');
}
const sup = (k) => String(k).replace('-', '⁻').split('').map((c) => ({ '⁻': '⁻' }[c] || '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])).join('');

// ---------- Tiger POMDP：V*(b) 是 piecewise linear convex ----------
function belief() {
  const al = [[-98.5499, 11.4501, 'L'], [-12.3031, 6.6603, 'l'], [-10.8543, 6.5169, 'l'], [-0.3391, 3.2078, 'l'], [1.9334, 1.9334, 'l'], [3.2078, -0.3391, 'l'], [6.5169, -10.8543, 'l'], [6.6603, -12.3031, 'l'], [11.4501, -98.5499, 'R']];
  const sx = lin(0, 1, 70, 520), sy = lin(-14, 12, 236, 52);
  const V = (b) => Math.max(...al.map(([p, q]) => b * p + (1 - b) * q));
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -14, y1: 12, xt: [[0, '0'], [0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']], yt: [[-10, '−10'], [-5, '−5'], [0, '0'], [5, '5'], [10, '10']], grid: true });
  for (const [p, q] of al) {
    const f = (b) => b * p + (1 - b) * q;
    // 只画落在 y 范围内的那一段
    let b0 = 0, b1 = 1;
    if (p !== q) {
      const bl = (-14 - q) / (p - q), bh = (12 - q) / (p - q);
      b0 = Math.max(0, Math.min(bl, bh)); b1 = Math.min(1, Math.max(bl, bh));
    }
    if (b1 > b0) o += path(curve(f, b0, b1, sx, sy, 2), 'mute');
  }
  o += path(curve(V, 0, 1, sx, sy, 800), 'ln');
  for (const b of [0.0525, 0.9475]) o += line(sx(b), sy(-14), sx(b), sy(12), 'dash');
  o += text(sx(0.5), sy(-12.2), 'listen', 'tb', 'middle');
  o += text(sx(0), 40, '← b ≤ 0.0525：open-left', 'ts', 'start') + text(sx(1), 40, 'b ≥ 0.9475：open-right →', 'ts', 'end');
  for (const [b, lab, dx, anc, up] of [[0.5, 'b = 0.5：1.93', 0, 'middle', 12], [0.85, '0.85：3.91', -6, 'end', 16], [0.9698, '0.97：8.13', -16, 'end', 2]]) {
    o += circle(sx(b), sy(V(b)), 4, 'ink-f') + text(sx(b) + dx, sy(V(b)) - up, lab, 't', anc);
  }
  o += text(520, 268, 'belief b = P(tiger-left)', 'ts', 'end') + text(70, 16, 'V*(b)：灰线是各个 α-vector，彩线是它们的 upper envelope', 'tb');
  return svg(560, 276, o, 'Tiger POMDP 的 optimal value function 是一组直线的 upper envelope，中间一段是 listen，两端很窄的区间是开门');
}

// ---------- bandit regret（模拟：seed 0，2000 次 run 的平均） ----------
// ---------- Tiger：belief 只取决于“听到左”减“听到右”的次数 ----------
function tigerchain() {
  const bel = (n) => 0.85 ** n / (0.85 ** n + 0.15 ** n);
  const pL = (b) => 0.85 * b + 0.15 * (1 - b);
  const xs = (n) => 280 + n * 108, y = 120, R = 32;
  let o = '';
  o += text(280, 22, '从 b = 0.5 开始一直 listen；b = P(tiger-left)', 'tb', 'middle');
  for (let n = -2; n <= 2; n++) {
    const b = bel(n), open = Math.abs(n) === 2;
    o += circle(xs(n), y, R, open ? 'wash-strong' : 'paper');
    o += text(xs(n), y - 2, b.toFixed(n === 2 || n === -2 ? 4 : 2), 'tb', 'middle') + text(xs(n), y + 15, 'n = ' + (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n), 'ts', 'middle');
    if (n < 2) {
      const up = pL(bel(n)), dn = 1 - pL(bel(n + 1));
      // 上：hear L（向右，只从 listen 的 belief 出发）；下：hear R（向左）
      if (n >= -1) o += path(`M${xs(n) + 20} ${y - 26} Q ${xs(n) + 54} ${y - 58}, ${xs(n + 1) - 22} ${y - 26}`, 'ln');
      if (n >= -1) o += arrow(xs(n + 1) - 32, y - 34, xs(n + 1) - 22, y - 26, 'ln');
      if (n >= -1) o += text(xs(n) + 54, y - 52, 'hear L ' + up.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''), 'tl', 'middle');
      if (n + 1 <= 1) o += path(`M${xs(n + 1) - 20} ${y + 26} Q ${xs(n) + 54} ${y + 58}, ${xs(n) + 22} ${y + 26}`, 'mute');
      if (n + 1 <= 1) o += arrow(xs(n) + 32, y + 34, xs(n) + 22, y + 26, 'mute');
      if (n + 1 <= 1) o += text(xs(n) + 54, y + 62, 'hear R ' + dn.toFixed(3).replace(/0+$/, '').replace(/\.$/, ''), 'ts', 'middle');
    }
  }
  o += text(xs(2) + 34, y + 88, '≥ 0.9475：open-right', 'tl', 'end') + text(xs(-2) - 34, y + 88, '≤ 0.0525：open-left', 'tl', 'start');
  o += text(280, y + 88, '中间三个：listen', 't', 'middle');
  o += text(280, y + 116, 'n = 听到左的次数 − 听到右的次数。箭头上的数是从这个 belief 出发听到这一边的 probability。', 'ts', 'middle');
  return svg(560, y + 126, o, 'Tiger 问题里 belief 随 listen 结果在一条链上左右移动：0.5、0.85、0.9698，两端越过 threshold 就开门');
}

const REG = { t: [1, 2, 5, 10, 20, 50, 100, 200, 400, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400, 6800, 7200, 7600, 8000, 8400, 8800, 9200, 9600, 10000, 10400, 10800, 11200, 11600, 12000, 12400, 12800, 13200, 13600, 14000, 14400, 14800, 15200, 15600, 16000, 16400, 16800, 17200, 17600, 18000, 18400, 18800, 19200, 19600, 20000], g: [0.4, 0.6, 1.0, 1.6, 2.8, 6.0, 11.1, 21.2, 41.1, 80.7, 120.2, 159.8, 199.2, 238.7, 278.1, 317.5, 356.8, 396.2, 435.6, 474.9, 514.3, 553.6, 593.0, 632.4, 671.7, 711.1, 750.4, 789.8, 829.2, 868.5, 907.8, 947.1, 986.4, 1025.7, 1064.9, 1104.2, 1143.5, 1182.8, 1222.0, 1261.3, 1300.6, 1339.9, 1379.2, 1418.4, 1457.6, 1496.9, 1536.1, 1575.4, 1614.6, 1653.8, 1693.1, 1732.3, 1771.6, 1810.8, 1850.0, 1889.3, 1928.5, 1967.8], e: [0.4, 0.6, 1.0, 1.7, 2.8, 5.3, 8.1, 11.9, 17.3, 25.9, 34.0, 42.0, 50.0, 58.0, 66.0, 74.1, 82.0, 90.0, 98.0, 106.0, 114.0, 121.9, 129.9, 137.8, 145.8, 153.8, 161.8, 169.8, 177.8, 185.8, 193.8, 201.8, 209.8, 217.8, 225.8, 233.8, 241.8, 249.8, 257.8, 265.8, 273.8, 281.9, 289.8, 297.9, 305.9, 313.9, 321.9, 329.9, 337.9, 345.9, 353.9, 362.0, 370.0, 378.0, 386.0, 394.0, 402.0, 410.0], u: [0.4, 0.6, 0.9, 1.7, 3.1, 6.6, 11.4, 18.6, 28.6, 41.3, 49.7, 55.9, 61.0, 65.2, 68.8, 72.1, 74.9, 77.4, 79.7, 81.8, 83.7, 85.4, 87.0, 88.7, 90.2, 91.7, 92.9, 94.1, 95.2, 96.4, 97.5, 98.6, 99.6, 100.6, 101.5, 102.4, 103.2, 104.0, 104.8, 105.5, 106.3, 107.0, 107.6, 108.3, 109.0, 109.7, 110.3, 110.9, 111.5, 112.1, 112.7, 113.3, 113.8, 114.3, 114.8, 115.4, 115.9, 116.4] };
function regret() {
  const sx = lin(0, 20000, 70, 500), sy = lin(0, 450, 236, 30);
  let o = axes({ sx, sy, x0: 0, x1: 20000, y0: 0, y1: 450, xt: [[0, '0'], [5000, '5000'], [10000, '10000'], [15000, '15000'], [20000, '20000']], yt: [100, 200, 300, 400], grid: true });
  const ser = (arr, cls) => {
    const pts = [];
    for (let i = 0; i < REG.t.length; i++) {
      if (arr[i] > 450) {
        const t0 = REG.t[i - 1], t1 = REG.t[i], y0 = arr[i - 1], y1 = arr[i];
        pts.push([sx(t0 + ((450 - y0) * (t1 - t0)) / (y1 - y0)), sy(450)]);
        break;
      }
      pts.push([sx(REG.t[i]), sy(arr[i])]);
    }
    return path(d(pts), cls);
  };
  o += ser(REG.g, 'mute') + ser(REG.e, 'ink-b') + ser(REG.u, 'ln');
  o += text(sx(5200), sy(430), 'greedy：每步约 0.098，', 'ts', 'start') + text(sx(5200), sy(396), 't = 20000 时 1968', 'ts', 'start');
  o += text(sx(8000), sy(360), 'ε-greedy（ε = 0.1）：410', 'tb', 'start') + text(sx(8000), sy(324), '每步约 0.02，linear', 'ts', 'start');
  o += text(sx(19800), sy(116.4) - 14, 'UCB1：116，增长越来越慢', 'tl', 'end');
  o += circle(sx(3035), sy(70), 4, 'ink-f') + text(sx(3035) + 8, sy(70) + 22, 't ≈ 3035 之前 UCB1 反而更差', 'ts');
  o += text(500, 268, '步数 t', 'ts', 'end') + text(70, 18, 'Cumulative regret：arm 的 mean 是 0.3、0.5、0.7', 'tb');
  return svg(560, 276, o, '三种 bandit algorithm 的 cumulative regret：greedy 和 epsilon-greedy linear 增长，UCB1 按 log 增长');
}

// ---------- backup diagram：DP、MC、TD ----------
function backup() {
  let o = '';
  const st = (x, y, cls = 'paper') => circle(x, y, 8, cls);
  const ac = (x, y, cls = 'ink-f') => circle(x, y, 4.5, cls);
  const panel = (x0, title, kind, n1, n2) => {
    const cx = x0 + 85;
    o += text(cx, 22, title, 'tb', 'middle');
    const top = 48;
    if (kind === 'dp') {
      o += st(cx, top, 'paper');
      for (const ax of [-40, 40]) {
        o += line(cx, top + 8, cx + ax, top + 46, 'ln') + ac(cx + ax, top + 50, 'ln-f');
        for (const sxo of [-18, 18]) o += line(cx + ax, top + 54, cx + ax + sxo, top + 90, 'ln') + st(cx + ax + sxo, top + 98, 'wash ink-s');
      }
      o += text(cx, top + 128, '下一层用的是 V(s′)', 'ts', 'middle');
    } else if (kind === 'td') {
      o += st(cx, top);
      for (const ax of [-40, 40]) {
        const on = ax === 40;
        o += line(cx, top + 8, cx + ax, top + 46, on ? 'ln' : 'mute') + ac(cx + ax, top + 50, on ? 'ln-f' : 'mute-f');
        for (const sxo of [-18, 18]) {
          const on2 = on && sxo === -18;
          o += line(cx + ax, top + 54, cx + ax + sxo, top + 90, on2 ? 'ln' : 'mute') + st(cx + ax + sxo, top + 98, on2 ? 'wash ink-s' : 'paper');
        }
      }
      o += text(cx, top + 128, '一步真 reward，再用 V(s′)', 'ts', 'middle');
    } else {
      o += st(cx, top);
      let x = cx, y = top;
      const xs = [40, -18, 30, -20, 22, -16];
      for (let i = 0; i < 6; i++) {
        const ax = i % 2 === 0 ? 1 : 0;
        const nx = x + xs[i] * 0.7, ny = y + 26;
        o += line(x, y + (ax ? 8 : 4.5), nx, ny - (ax ? 4.5 : 8), 'ln');
        o += ax ? ac(nx, ny, 'ln-f') : st(nx, ny, 'paper');
        x = nx; y = ny;
      }
      o += rect(x - 9, y + 16, 18, 14, 'solid') + line(x, y + 8, x, y + 16, 'ln');
      o += text(cx, top + 196, '走到 episode 结束', 'ts', 'middle');
    }
    o += text(cx, 272, n1, 't', 'middle') + text(cx, 290, n2, 'ts', 'middle');
  };
  panel(5, 'DP', 'dp', 'expectation，bootstrap', '需要 model');
  panel(190, 'TD(0)', 'td', 'sample，bootstrap', 'target 有 bias，variance 小');
  panel(375, 'Monte Carlo', 'mc', 'sample，不 bootstrap', 'target unbiased，variance 大');
  o += text(280, 316, '空心圆是 state，实心点是 action，方块是 terminal；彩色是一次 update 用到的部分。', 'ts', 'middle');
  return svg(560, 326, o, '三种 backup：DP 对所有 action 和下一 state 取 expectation 并用 estimate；TD 只sample 一步再用 estimate；Monte Carlo sample 整条 trajectory直到结束');
}

// ---------- 最小的 divergence 例子：w → 2w ----------
function triad() {
  let o = '';
  const s1 = [70, 80], s2 = [200, 80];
  o += circle(s1[0], s1[1], 30, 'paper') + text(s1[0], s1[1] + 5, 'w', 'tb', 'middle');
  o += circle(s2[0], s2[1], 30, 'paper') + text(s2[0], s2[1] + 5, '2w', 'tb', 'middle');
  o += rect(268, 68, 24, 24, 'solid');
  o += arrow(s1[0] + 30, s1[1], s2[0] - 30, s2[1], 'ln') + text((s1[0] + s2[0]) / 2, s1[1] - 10, 'r = 0', 'ts', 'middle');
  o += arrow(s2[0] + 30, s2[1], 266, 80, 'mute') + text(248, 64, 'r = 0', 'ts', 'middle');
  o += text(s1[0], 134, 'feature 1', 'ts', 'middle') + text(s2[0], 134, 'feature 2', 'ts', 'middle');
  o += text(30, 170, '同一个 parameter w 管两个 state。', 't') + text(30, 190, 'True value 都是 0，即 w = 0。', 't');
  o += text(30, 218, 'Off-policy：只在左边 update', 'tl') + text(30, 236, 'w ← (1 + α(2γ − 1)) w', 't');
  o += text(30, 262, 'On-policy：右边也会被访问', 'tb') + text(30, 280, '右边的 update 把 w 往 0 拉', 't');
  // 右侧：w 随 update 次数（log scale）
  const sx = lin(0, 20, 360, 540), sy = lin(-1, 2, 250, 40);
  o += line(sx(0), sy(-1), sx(20), sy(-1), 'axis') + line(sx(0), sy(-1), sx(0), sy(2), 'axis');
  for (const k of [-1, 0, 1, 2]) o += line(sx(0), sy(k), sx(20), sy(k), 'grid') + text(sx(0) - 6, sy(k) + 4, ['0.1', '1', '10', '100'][k + 1], 'ts', 'end');
  for (const k of [0, 10, 20]) o += text(sx(k), sy(-1) + 16, String(k), 'ts', 'middle');
  const a = 0.1, g = 0.99;
  const off = [], on = [];
  let w1 = 10, w2 = 10;
  for (let k = 0; k <= 20; k++) { off.push([sx(k), sy(Math.log10(w1))]); w1 *= 1 + a * (2 * g - 1); }
  w1 = 10 * (1 + a * (2 * g - 1)) ** 20;
  const f2 = (1 + a * (2 * g - 1)) * (1 - 4 * a);
  for (let k = 0; w2 >= 0.1; k++) { on.push([sx(k), sy(Math.log10(w2))]); w2 *= f2; }
  on.push([sx(Math.log(0.01) / Math.log(f2)), sy(-1)]);
  o += path(d(off), 'ln') + path(d(on), 'ink-b');
  o += text(sx(2), sy(1.6), 'off-policy', 'tl');
  o += text(sx(12.5), sy(-0.75), 'on-policy', 'tb');
  o += text(sx(10), 22, 'w（log scale），α = 0.1，γ = 0.99', 'ts', 'middle') + text(sx(20), sy(-1) + 32, 'update 轮数', 'ts', 'end');
  return svg(560, 296, o, '两个 state 共用一个 parameter：只在第一个 state 上做 semi-gradient TD update 时 w exponential 增长，两个 state 都 update 时 w converge 到 0');
}

// ---------- policy gradient 的 variance：有没有 baseline ----------
const PG = { c: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], nob: [0.903, 5.77, 10.763, 15.764, 20.757, 25.76, 30.757, 35.752, 40.745, 45.751, 50.753], b: [0.504, 0.499, 0.503, 0.502, 0.498, 0.5, 0.502, 0.504, 0.494, 0.502, 0.502] };
function pgvar() {
  const sx = lin(0, 100, 70, 500), sy = lin(-1, 2, 236, 36);
  let o = '';
  for (const k of [-1, 0, 1, 2]) o += line(sx(0), sy(k), sx(100), sy(k), 'grid') + text(64, sy(k) + 4, ['0.1', '1', '10', '100'][k + 1], 'ts', 'end');
  for (const c of [0, 25, 50, 75, 100]) o += line(sx(c), sy(-1), sx(c), sy(-1) + 4, 'axis') + text(sx(c), sy(-1) + 18, String(c), 'ts', 'middle');
  o += line(sx(0), sy(-1), sx(100), sy(-1), 'axis') + line(sx(0), sy(-1), sx(0), sy(2), 'axis');
  const sdNo = (c) => Math.sqrt(0.125 * ((2 + c) ** 2 + 1 + (1 + c) ** 2 + 1) - 0.0625);
  o += path(curve((c) => Math.log10(sdNo(c)), 0, 100, sx, sy), 'ink') + path(curve(() => Math.log10(0.5), 0, 100, sx, sy, 2), 'ln');
  PG.c.forEach((c, i) => { o += circle(sx(c), sy(Math.log10(PG.nob[i])), 3.5, 'ink-f') + circle(sx(c), sy(Math.log10(PG.b[i])), 3.5, 'ln-f'); });
  o += text(sx(98), sy(1.0), '不用 baseline：std ≈ c / 2', 'tb', 'end');
  o += text(sx(98), sy(Math.log10(0.5)) - 12, '用 baseline b = E[r]：std = 0.5，与 c 无关', 'tl', 'end');
  o += text(sx(50), sy(1.92), '两条的 mean 都是 0.25（true gradient）', 'ts', 'middle');
  o += text(500, 268, '所有 reward 加上的 constant c', 'ts', 'end') + text(70, 18, '单个 episode 的 gradient estimate 的 std（log scale）', 'tb');
  return svg(560, 276, o, 'REINFORCE 的 gradient estimate 的 standard deviation 随 reward 的整体平移linear 增长，减去 baseline 之后保持不变');
}

// ---------- MCTS：50 次 iteration 后的树（seed 3，c = √2） ----------
// ---------- 同一批 8 个 episode：batch MC 与 batch TD ----------
function batch() {
  const eps = [['A', 0, 'B', 0], ['B', 1], ['B', 1], ['B', 1], ['B', 1], ['B', 1], ['B', 1], ['B', 0]];
  // MC：每个 state 首次出现之后的 return 取平均（γ = 1）
  const ret = { A: [], B: [] };
  for (const e of eps) for (let i = 0; i < e.length; i += 2) { let G = 0; for (let j = i + 1; j < e.length; j += 2) G += e[j]; ret[e[i]].push(G); }
  const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const mcA = mean(ret.A), mcB = mean(ret.B);
  // TD 的 certainty-equivalence model
  const pB1 = ret.B.filter((g) => g === 1).length / ret.B.length, tdB = pB1, tdA = 0 + tdB;
  let o = '';
  o += text(20, 22, 'Data（γ = 1）', 'tb');
  o += text(20, 46, 'A, 0, B, 0', 't') + text(130, 46, '× 1', 'ts');
  o += text(20, 66, 'B, 1', 't') + text(130, 66, '× 6', 'ts');
  o += text(20, 86, 'B, 0', 't') + text(130, 86, '× 1', 'ts');
  o += line(176, 14, 176, 196, 'grid');
  // MC panel
  const nd = (x, y, s) => circle(x, y, 20, 'paper') + text(x, y + 5, s, 'tb', 'middle');
  o += text(276, 22, 'MC：只看从 A 出发的 return', 'tb', 'middle');
  o += nd(222, 80, 'A') + nd(312, 80, 'B') + arrow(242, 80, 290, 80, 'ink') + text(266, 72, '0', 'ts', 'middle');
  o += arrow(332, 80, 352, 80, 'ink') + text(343, 72, '0', 'ts', 'middle') + rect(354, 72, 12, 16, 'solid2');
  o += text(276, 124, 'A 只出现 1 次，return = 0', 'ts', 'middle');
  o += text(276, 160, 'V(A) = ' + mcA.toFixed(2), 'tl', 'middle') + text(276, 182, 'V(B) = ' + mcB.toFixed(2) + '（6 / 8）', 't', 'middle');
  o += line(380, 14, 380, 196, 'grid');
  // TD panel：估计出的 Markov model
  o += text(470, 22, 'TD：先估计 model 再解', 'tb', 'middle');
  o += nd(410, 80, 'A') + nd(486, 80, 'B') + arrow(430, 80, 464, 80, 'ln') + text(447, 70, '1, r 0', 'ts', 'middle');
  o += rect(530, 40, 14, 16, 'solid2') + rect(530, 104, 14, 16, 'solid2');
  o += arrow(504, 70, 528, 50, 'ln') + text(500, 44, (pB1).toFixed(2) + ', r 1', 'ts', 'end');
  o += arrow(504, 90, 528, 110, 'ln') + text(500, 124, (1 - pB1).toFixed(2) + ', r 0', 'ts', 'end');
  o += text(470, 160, 'V(A) = 0 + V(B) = ' + tdA.toFixed(2), 'tl', 'middle') + text(470, 182, 'V(B) = ' + tdB.toFixed(2), 't', 'middle');
  o += text(280, 222, 'B 两边都是 0.75；A 的分歧来自 TD 把其余 7 次关于 B 的经验也用在了 A 上。', 'ts', 'middle');
  return svg(560, 236, o, '同一批 8 个 episode：MC 给 V(A)=0，TD 先估计出 A 到 B、B 以 3/4 拿到 1 的 model，给 V(A)=0.75');
}

// ---------- flat Monte Carlo：random 的第二步把 a 的 value 拉低 ----------
function flatmc() {
  const p = { a1: 0.2, a2: 0.9, b1: 0.6, b2: 0.6 };
  const flat = { a: (p.a1 + p.a2) / 2, b: (p.b1 + p.b2) / 2 }, opt = { a: Math.max(p.a1, p.a2), b: Math.max(p.b1, p.b2) };
  let o = '';
  const box = (x, y, top, cls) => rect(x - 34, y - 16, 68, 32, cls, 6) + rect(x - 34, y - 16, 68, 32, 'frame', 6) + text(x, y + 5, top, 'tb', 'middle');
  const R = [280, 34], A = [150, 116], B = [410, 116];
  const L = { a1: [80, 200], a2: [220, 200], b1: [340, 200], b2: [480, 200] };
  o += line(R[0], R[1] + 16, A[0], A[1] - 16, 'ink') + line(R[0], R[1] + 16, B[0], B[1] - 16, 'ink');
  for (const k in L) { const P = k[0] === 'a' ? A : B; o += line(P[0], P[1] + 16, L[k][0], L[k][1] - 16, k === 'a2' ? 'ln' : 'mute'); }
  o += box(R[0], R[1], 'root', 'paper-f') + box(A[0], A[1], 'a', 'paper-f') + box(B[0], B[1], 'b', 'paper-f');
  for (const k in L) o += box(L[k][0], L[k][1], k, k === 'a2' ? 'wash' : 'paper-f') + text(L[k][0], L[k][1] + 34, 'p = ' + p[k], 'ts', 'middle');
  o += text(A[0] - 44, A[1] - 2, 'flat MC：' + flat.a.toFixed(2), 'ts', 'end') + text(A[0] - 44, A[1] + 14, '真正：' + opt.a.toFixed(1), 'tl', 'end');
  o += text(B[0] + 44, B[1] - 2, 'flat MC：' + flat.b.toFixed(2), 'ts', 'start') + text(B[0] + 44, B[1] + 14, '真正：' + opt.b.toFixed(1), 'tl', 'start');
  o += text(280, 268, 'Flat MC 在 a 下面 random 地选 a1 或 a2，估计的是 ½ × 0.2 + ½ × 0.9 = 0.55 < 0.6，于是选 b。', 'ts', 'middle');
  return svg(560, 280, o, '两层的 search tree：flat Monte Carlo 估计 a 为 0.55、b 为 0.6，选错；a 真正的 value 是 0.9');
}

function mcts() {
  let o = '';
  const node = (x, y, top, bot, hot) => {
    o += rect(x - 62, y - 20, 124, 40, hot ? 'wash' : 'paper-f', 6) + rect(x - 62, y - 20, 124, 40, hot ? 'ink' : 'frame', 6);
    o += text(x, y - 3, top, 'tb', 'middle') + text(x, y + 13, bot, 'ts', 'middle');
  };
  const R = [280, 40], A = [150, 130], B = [410, 130];
  const leaves = [[75, 230, 'a1', 'N = 4，mean 0.00', 'p = 0.2', false], [212, 230, 'a2', 'N = 32，mean 0.91', 'p = 0.9', true], [350, 230, 'b1', 'N = 6，mean 0.50', 'p = 0.6', false], [487, 230, 'b2', 'N = 6，mean 0.50', 'p = 0.6', false]];
  o += line(R[0], R[1] + 20, A[0], A[1] - 20, 'ln') + line(R[0], R[1] + 20, B[0], B[1] - 20, 'mute');
  for (const [x, y, n, , , hot] of leaves) { const P = n[0] === 'a' ? A : B; o += line(P[0], P[1] + 20, x, y - 20, hot ? 'ln' : 'mute'); }
  node(R[0], R[1], 'root', 'N = 50', true);
  node(A[0], A[1], 'a', 'N = 37，mean 0.81', true);
  node(B[0], B[1], 'b', 'N = 13，mean 0.46', false);
  for (const [x, y, n, s, p, hot] of leaves) { node(x, y, n, s, hot); o += text(x, y + 38, 'true ' + p, 'ts', 'middle'); }
  o += text(280, 296, '先选 a 再选 a2 的 path 被走了 32 次；b 那边只用来确认它确实不好。', 'ts', 'middle');
  o += text(280, 314, 'a 的 N 比 a1 + a2 多 1：那一次是展开 a 时直接 rollout 的。', 'ts', 'middle');
  return svg(560, 324, o, 'UCT 跑 50 次 iteration 之后的 search tree：大部分 simulation 集中在 a 然后 a2 这条 path 上');
}


// ---------- 动图共用：按帧切换 ----------
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [0];
  let acc = 0;
  for (let i = 0; i < durs.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  kt.push(1);
  const show = (on) => ashow([...on, on[on.length - 1]], kt, T);
  const vals = (v) => [...v, v[v.length - 1]];
  return { T, kt, show, vals };
}
const gshow = (inner, F, on) => `<g>${inner}${F.show(on)}</g>`;
function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return (s + 0.5) / 4294967296; }; }

// 开头第二次：greedy 守着最差的那台 slot machine
function greedyA() {
  const P = [0.3, 0.5, 0.7], u = rng(5);
  // 前四次按正文：1、2、3 都没中，第 4 次拉第一台中了；之后 greedy（平手取编号小的）
  const pulls = [[0, 0], [1, 0], [2, 0], [0, 1]];
  const n = [2, 1, 1], s = [1, 0, 0];
  while (pulls.length < 20) {
    const m = [0, 1, 2].map((k) => s[k] / n[k]); let a = 0; for (let k = 1; k < 3; k++) if (m[k] > m[a]) a = k;
    const r = u() < P[a] ? 1 : 0; pulls.push([a, r]); n[a]++; s[a] += r;
  }
  const states = []; { const N = [0, 0, 0], S = [0, 0, 0]; states.push({ N: N.slice(), S: S.slice(), cur: -1 }); pulls.forEach(([a, r], t) => { N[a]++; S[a] += r; states.push({ N: N.slice(), S: S.slice(), cur: a, r, t: t + 1 }); }); }
  const fin = states[states.length - 1];
  const seq = [{ ...fin, cur: -1, fin: true }, ...states];
  const F = frames(seq.map((q, i) => (i === 0 ? 3 : i === 1 ? 0.6 : i === seq.length - 1 ? 2.4 : 0.75)));
  let o = '';
  const X = [100, 280, 460], Y = 40;
  X.forEach((x, k) => {
    // slot machine：机身、窗口、拉杆
    o += rect(x - 46, Y, 92, 92, 'paper', 8) + rect(x - 32, Y + 14, 64, 34, 'wash2', 4);
    o += line(x + 46, Y + 54, x + 60, Y + 54, 'ink-b') + line(x + 60, Y + 54, x + 60, Y + 22, 'ink-b') + circle(x + 60, Y + 18, 5, 'solid');
    o += rect(x - 30, Y + 64, 60, 16, 'wash2', 3) + text(x, Y + 76, 'machine ' + (k + 1), 'ts', 'middle');
    o += text(x, Y + 112, '真实 p = ' + P[k] + '（你不知道）', 'ts', 'middle');
    // 每一帧：窗口里的结果、被拉的高亮、计数和 sample mean
    seq.forEach((q, i) => {
      const on = seq.map((_, j) => j === i);
      let g = '';
      if (q.cur === k) g += rect(x - 50, Y - 4, 100, 100, 'ln', 10) + text(x, Y + 37, q.r ? 'WIN' : 'lose', q.r ? 'tl' : 'tb', 'middle');
      const m = q.N[k] ? q.S[k] / q.N[k] : 0;
      g += text(x, Y + 140, `拉了 ${q.N[k]} 次，中 ${q.S[k]} 次`, 't', 'middle');
      g += rect(x - 40, Y + 152, 80, 12, 'frame') + (m > 0 ? rect(x - 40, Y + 152, 80 * m, 12, 'solid') : '');
      g += text(x, Y + 182, 'sample mean ' + (q.N[k] ? m.toFixed(2) : '—'), m > 0 ? 'tl' : 'ts', 'middle');
      o += gshow(g, F, on);
    });
  });
  seq.forEach((q, i) => {
    const on = seq.map((_, j) => j === i);
    let msg = q.fin ? `20 次之后：machine 1 被拉了 ${fin.N[0]} 次，p = 0.7 的 machine 3 只试过 ${fin.N[2]} 次` : q.cur < 0 ? '开始：三台都没试过' : q.t <= 3 ? `第 ${q.t} 次：每台先试一次` : q.t === 4 ? '第 4 次：平手，拉第一台，中了' : `第 ${q.t} 次：machine 1 的 sample mean > 0，别的都是 0，greedy 又拉它`;
    o += gshow(text(280, 262, msg, q.fin ? 'tl' : 't', 'middle'), F, on);
  });
  o += text(280, 284, 'Greedy：总拉 sample mean 最大的那台。中过一次之后，第一台的 mean 再也不会回到 0', 'ts', 'middle');
  return svgA(560, 294, o, '动图：三台 slot machine，greedy 规则每台试一次都没中后，第一台碰巧中了一次，从此一直拉第一台（p = 0.3，最差的那台），p = 0.7 的那台再也没被拉过');
}

// 开头第三次：两个 state 共用 w，只 update 第一个，w 越追越远
function tdblowA() {
  const g = 0.99, al = 0.1, K = 25, f = 1 + al * (2 * g - 1);
  const ws = [10]; for (let k = 0; k < K; k++) ws.push(ws[k] * f);
  const seq = [K, ...ws.map((_, i) => i)]; // 第一帧显示最终
  const F2 = frames([2.4, ...ws.map((_, i) => (i === K ? 2.4 : 0.42))]);
  let o = '';
  // 左：两个 state，value 画成柱子
  const S1 = [70, 230], S2 = [190, 230], TT = [280, 230], base = 206, sc = 150 / (2 * ws[K]);
  o += circle(S1[0], S1[1], 20, 'paper') + text(S1[0], S1[1] + 5, 's₁', 'tb', 'middle');
  o += circle(S2[0], S2[1], 20, 'paper') + text(S2[0], S2[1] + 5, 's₂', 'tb', 'middle');
  o += rect(TT[0] - 12, TT[1] - 12, 24, 24, 'solid2');
  o += arrow(S1[0] + 22, S1[1], S2[0] - 24, S2[1], 'ink') + text((S1[0] + S2[0]) / 2, S1[1] + 22, 'r = 0', 'ts', 'middle');
  o += arrow(S2[0] + 22, S2[1], TT[0] - 16, TT[1], 'ink') + text((S2[0] + TT[0]) / 2 + 2, S2[1] + 22, 'r = 0', 'ts', 'middle');
  o += text(S1[0], S1[1] + 40, 'feature 1', 'ts', 'middle') + text(S2[0], S2[1] + 40, 'feature 2', 'ts', 'middle');
  const bar = (x, k, cls) => { const h = seq.map((i) => (k * ws[i]) * sc); return `<rect x="${x - 14}" y="${(base - h[0]).toFixed(1)}" width="28" height="${h[0].toFixed(1)}" class="${cls}">${anim('y', F2.vals(h.map((v) => (base - v).toFixed(1))), F2.kt, F2.T, true)}${anim('height', F2.vals(h.map((v) => v.toFixed(1))), F2.kt, F2.T, true)}</rect>`; };
  o += bar(S1[0], 1, 'solid') + bar(S2[0], 2, 'wash-strong');
  // target 2γw：在 s1 上方的虚线
  const ty = seq.map((i) => base - 2 * g * ws[i] * sc);
  o += `<path d="M${S1[0] - 24} ${ty[0].toFixed(1)}H${S1[0] + 24}" class="ln-dash">${anim('d', F2.vals(ty.map((v) => `M${S1[0] - 24} ${v.toFixed(1)}H${S1[0] + 24}`)), F2.kt, F2.T, true)}</path>`;
  o += text(S1[0] - 28, 36, 'v̂(s₁) = w', 'tl', 'start') + text(S2[0], 36, 'v̂(s₂) = 2w', 'tb', 'middle');
  o += line(30, base, 300, base, 'axis');
  // 右：w 随 update 次数
  const px = lin(0, K, 350, 545), py = lin(0, 120, 206, 40);
  o += axes({ sx: px, sy: py, x0: 0, x1: K, y0: 0, y1: 120, xt: [0, 5, 10, 15, 20, 25], yt: [0, 40, 80, 120], xl: 'update 次数', grid: true });
  o += text(350, 28, 'w（true value 是 0）', 'tb', 'start');
  o += path(d(ws.map((w, i) => [px(i), py(w)])), 'ln');
  const cx = F2.vals(seq.map((i) => px(i).toFixed(1))), cy = F2.vals(seq.map((i) => py(ws[i]).toFixed(1)));
  o += `<circle cx="${cx[0]}" cy="${cy[0]}" r="5" class="ln-f">${anim('cx', cx, F2.kt, F2.T, true)}${anim('cy', cy, F2.kt, F2.T, true)}</circle>`;
  seq.forEach((i, j) => { o += gshow(text(448, 262, `第 ${i} 次 update 后 w = ${ws[i].toFixed(2)}`, j === 0 ? 'tl' : 't', 'middle'), F2, seq.map((_, q) => q === j)); });
  o += text(448, 282, `每次乘 1 + α(2γ − 1) = ${f.toFixed(3)}`, 'ts', 'middle');
  o += text(165, 288, 's₁ 上的虚线是 TD target 0 + γ · 2w：w 往上追，它涨得更快', 'ts', 'middle');
  return svgA(560, 296, o, '动图：两个 state 共用 parameter w，value 是 w 和 2w；只在第一个 state 上做 TD update，w 去追 target 0.99 乘 2w，target 涨得更快，w 每次乘 1.098，25 次后从 10 涨到 104');
}

// 第 2 站：value iteration 一次次 sweep，value 和 greedy policy 一起变
function viA() {
  const S = 74, H = 56, x0 = 20, y0 = 30, K = 12;
  const ks = [200, ...Array.from({ length: K + 1 }, (_, i) => i), 200];
  const F = frames(ks.map((k, i) => (i === 0 ? 3 : i === ks.length - 1 ? 2.4 : 1.1)));
  const lab = (k) => (k === 200 ? 'V*' : 'V' + '₀₁₂₃₄₅₆₇₈₉'[k % 10] + (k >= 10 ? '' : '')).replace('V₀', k >= 10 ? 'V₁₀' : 'V₀');
  const name = (k) => (k === 200 ? 'converge 之后（V*）' : `sweep ${k} 之后（V${k}）`);
  let o = '';
  for (let y = 3; y >= 1; y--) for (let x = 1; x <= 4; x++) {
    const key = `${x},${y}`, X = x0 + (x - 1) * S, Y = y0 + (3 - y) * H;
    if (key === GW.wall) { o += rect(X, Y, S, H, 'solid2'); continue; }
    if (key in GW.term) { o += rect(X, Y, S, H, GW.term[key] > 0 ? 'wash-strong' : 'wash2') + text(X + S / 2, Y + H / 2 + 5, GW.term[key] > 0 ? '+1' : '−1', 'tb', 'middle'); continue; }
    // 浅色底的深浅 = value
    const op = F.vals(ks.map((k) => Math.min(1, GW.hist[k][key] / 0.95).toFixed(3)));
    o += `<rect x="${X}" y="${Y}" width="${S}" height="${H}" class="wash" opacity="${op[0]}">${anim('opacity', op, F.kt, F.T, true)}</rect>`;
    // 数字和 greedy 箭头
    const vs = ks.map((k) => GW.hist[k][key]);
    const uniq = [...new Set(vs.map((v) => v.toFixed(3)))];
    uniq.forEach((u) => { o += gshow(text(X + S / 2, Y + 22, +u > 1e-9 ? u : '0', +u > 1e-9 ? 'tb' : 'ts', 'middle'), F, vs.map((v) => v.toFixed(3) === u)); });
    const pols = ks.map((k) => (GW.hist[k][key] > 1e-9 ? GW.greedy(GW.hist[k])[key] : ''));
    for (const a of ['N', 'S', 'E', 'W']) {
      const on = pols.map((p) => p === a);
      if (!on.some((v) => v)) continue;
      const dir = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[a], cx = X + S / 2, cy = Y + 40, L = 10;
      o += gshow(arrow(cx - dir[0] * L, cy - dir[1] * L, cx + dir[0] * L, cy + dir[1] * L, 'ln'), F, on);
    }
  }
  for (let i = 0; i <= 4; i++) o += line(x0 + i * S, y0, x0 + i * S, y0 + 3 * H, 'frame');
  for (let j = 0; j <= 3; j++) o += line(x0, y0 + j * H, x0 + 4 * S, y0 + j * H, 'frame');
  const tx = 340;
  ks.forEach((k, i) => {
    const on = ks.map((_, j) => j === i);
    const prev = k === 0 || k === 200 ? null : GW.hist[k - 1];
    const dmax = prev ? Math.max(...Object.keys(prev).map((q) => Math.abs(GW.hist[k][q] - prev[q]))) : null;
    let g = text(tx, 44, name(k), 'tl', 'start');
    if (dmax !== null) g += text(tx, 68, `这一 sweep 最大改动 ${dmax.toFixed(3)}`, 't', 'start');
    if (k === 0) g += text(tx, 68, '全部从 0 开始', 't', 'start');
    if (k === 200) g += text(tx, 68, '再 sweep 也不变了', 't', 'start');
    o += gshow(g, F, on);
  });
  o += text(tx, 110, '每次 sweep：每个格子用上一轮的', 'ts', 'start') + text(tx, 127, 'value 做一次 Bellman backup。', 'ts', 'start');
  o += text(tx, 156, '底色越深 value 越大；箭头是对', 'ts', 'start') + text(tx, 173, '当前 value 的 greedy action', 'ts', 'start') + text(tx, 190, '（value 还是 0 的格子不画）。', 'ts', 'start');
  o += text(x0 + 2 * S, y0 + 3 * H + 22, 'γ = 0.9，(2,2) 是墙', 'ts', 'middle');
  return svgA(560, 3 * H + y0 + 30, o, '动图：4 乘 3 gridworld 上 value iteration 一次次 sweep，非零的 value 从 +1 一圈圈往外扩，greedy policy 的箭头跟着出现和改变，最后停在 V*');
}

export default {
  'cs4246-greedy': greedyA,
  'cs4246-tdblow': tdblowA,
  'cs4246-twostate': twostate,
  'cs4246-grid': grid,
  'cs4246-visweeps': viA,
  'cs4246-tigerchain': tigerchain,
  'cs4246-batch': batch,
  'cs4246-flatmc': flatmc,
  'cs4246-vierr': vierr,
  'cs4246-belief': belief,
  'cs4246-regret': regret,
  'cs4246-backup': backup,
  'cs4246-triad': triad,
  'cs4246-pgvar': pgvar,
  'cs4246-mcts': mcts,
};
