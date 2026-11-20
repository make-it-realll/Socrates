import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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
  return { V, pol, err, term, wall };
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

export default {
  'cs4246-twostate': twostate,
  'cs4246-grid': grid,
  'cs4246-vierr': vierr,
  'cs4246-belief': belief,
  'cs4246-regret': regret,
  'cs4246-backup': backup,
  'cs4246-triad': triad,
  'cs4246-pgvar': pgvar,
  'cs4246-mcts': mcts,
};
