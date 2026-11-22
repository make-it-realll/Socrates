import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const box = (x, y, w, h, s, cls = 'paper', tcls = 't', rx = 4) => rect(x, y, w, h, cls, rx) + (s === '' ? '' : text(x + w / 2, y + h / 2 + 4.5, s, tcls, 'middle'));
const OWN = ['solid', 'wash-strong', 'wash', 'wash2'];
const OWNT = ['tw', 't', 't', 't'];
const g = (s, inner) => `<g>${inner}${s}</g>`; // 包一层，把 animate 放进去
const show = (inner, on, kt, T) => `<g>${inner}${ashow(on, kt, T)}</g>`;

// ---------- 开头第一次：thread 数与时间（Lab 2 Exercise 3 的 perf stat） ----------
function threads() {
  const th = [8, 16, 32, 64, 128, 256];
  const wall = [1.451, 1.340, 1.256, 1.156, 1.165, 1.167];
  const cpu = [11.325, 17.829, 21.329, 21.304, 21.389, 21.510];
  let o = '';
  const panel = (x0, w, vals, y1, yt, title, unit, cls, fmt) => {
    const sx = (t) => x0 + (Math.log2(t) - 3) / 5 * w, sy = lin(0, y1, 200, 40);
    o += axes({ sx, sy, x0: 8, x1: 256, y0: 0, y1, xt: th.map((t) => [t, String(t)]), yt, grid: true });
    o += text(x0 - 30, 24, title, 'tb', 'start');
    o += path(d(th.map((t, i) => [sx(t), sy(vals[i])])), cls);
    th.forEach((t, i) => { o += circle(sx(t), sy(vals[i]), 3.5, 'ln-f'); });
    o += text(sx(8) + 8, sy(vals[0]) + (vals === cpu ? 16 : -9), fmt(vals[0]), 'ts', 'start') + text(sx(256), sy(vals[5]) - 9, fmt(vals[5]), 'ts', 'end');
    o += text(x0 + w, 236, 'thread 数', 'ts', 'end');
  };
  panel(50, 200, wall, 1.6, [0, 0.4, 0.8, 1.2, 1.6], 'wall-clock time（s）', 's', 'ln', (v) => v.toFixed(2) + ' s');
  panel(330, 200, cpu, 24, [0, 6, 12, 18, 24], '所有 CPU 加起来的时间（s）', 's', 'ln-dash', (v) => v.toFixed(1) + ' s');
  o += text(280, 262, '8 → 64 个 thread：wall-clock 只快 1.25 倍，CPU time 却多了 88%', 'ts', 'middle');
  return svg(560, 270, o, '两个 plot：横轴 thread 数从 8 到 256。左边 wall-clock time 从 1.45 秒降到 1.16 秒后不再变；右边所有 CPU 的时间从 11.3 秒涨到 21.5 秒');
}

// ---------- 开头第二次：loop order ----------
function looporder() {
  let o = '';
  const n = 6, c = 22;
  const panel = (x0, title, code, cells, note) => {
    o += text(x0, 20, title, 'tb', 'start') + text(x0, 38, code, 'ts', 'start');
    const y0 = 52;
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) o += rect(x0 + k * c, y0 + r * c, c, c, 'frame');
    cells.forEach(([r, k], i) => { o += rect(x0 + k * c + 2, y0 + r * c + 2, c - 4, c - 4, i === 0 ? 'solid' : 'wash-strong', 2); });
    const [r0, k0] = cells[0], [r1, k1] = cells[cells.length - 1];
    o += arrow(x0 + k0 * c + c / 2 + (k1 > k0 ? 0 : 0), y0 + r0 * c + c / 2, x0 + k1 * c + c / 2, y0 + r1 * c + c / 2, 'ink-b');
    o += text(x0 + n * c + 8, y0 + 14, 'b', 'tl', 'start') + text(x0 + n * c + 8, y0 + 30, '（row-major）', 'ts', 'start');
    // memory 条：6 个 row 首尾相接，每格一个 float
    const my = 214, mw = 7;
    o += text(x0, my - 8, 'memory 里的顺序（每段是一个 row）', 'ts', 'start');
    for (let i = 0; i < n * n; i++) o += rect(x0 + i * mw, my, mw, 16, 'frame');
    for (let r = 1; r < n; r++) o += line(x0 + r * n * mw, my - 3, x0 + r * n * mw, my + 19, 'ink');
    cells.forEach(([r, k]) => { o += rect(x0 + (r * n + k) * mw + 1, my + 2, mw - 2, 12, 'solid'); });
    o += text(x0, my + 34, note, 'ts', 'start');
  };
  panel(14, 'ijk：inner loop 沿 column', 'result[i][j] += a[i][k] * b[k][j]', [0, 1, 2, 3, 4, 5].map((k) => [k, 2]), '每一步跳过一整个 row：真实大小下 4 KB');
  panel(300, 'ikj：inner loop 沿 row', 'result[i][k] += a[i][j] * b[j][k]', [0, 1, 2, 3, 4, 5].map((k) => [2, k]), '相邻 address，一条 line 用满 16 个');
  return svg(560, 260, o, '左：inner loop 沿 matrix b 的一个 column 往下走，在 memory 里每步跳过一整个 row；右：inner loop 沿一个 row 走，memory 里是连续的一段');
}

// ---------- 开头第三次：ring 上四个 send 互相等 ----------
function ring() {
  const C = [280, 150], R = 92;
  const pos = (r) => { const a = Math.PI / 2 - r * Math.PI / 2; return [C[0] + R * 1.7 * Math.cos(a), C[1] - R * Math.sin(a)]; };
  let o = '';
  for (let r = 0; r < 4; r++) {
    const [x, y] = pos(r), [lx, ly] = pos((r + 3) % 4);
    const dx = lx - x, dy = ly - y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const off = Math.min(62 / Math.abs(ux || 1e-9), 22 / Math.abs(uy || 1e-9)) + 6;
    o += arrow(x + ux * off, y + uy * off, lx - ux * off, ly - uy * off, 'ln-dash');
  }
  for (let r = 0; r < 4; r++) {
    const [x, y] = pos(r);
    o += box(x - 62, y - 22, 124, 44, '', 'paper');
    o += text(x, y - 4, 'rank ' + r, 'tb', 'middle') + text(x, y + 13, 'MPI_Send → rank ' + ((r + 3) % 4), 'ts', 'middle');
  }
  o += text(C[0], C[1] - 4, '每个箭头都在等', 'ts', 'middle') + text(C[0], C[1] + 13, '对方先调用 MPI_Recv', 'ts', 'middle');
  return svg(560, 298, o, '四个 rank 排成一圈，每个都在执行 MPI_Send 给左边的邻居，四个虚线箭头都在等待，没有一个 MPI_Recv 被调用');
}

// ---------- 开头第四次：自己写的 broadcast ----------
function bcast0() {
  const sx = lin(0, 0.52, 120, 530), T = 0.51484 / 3;
  let o = axes({ sx, sy: lin(0, 1, 170, 30), x0: 0, x1: 0.52, y0: 0, y1: 1, xt: [0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => [v, v.toFixed(1)]), yt: [] });
  o += text(530, 204, '时间（s）', 'ts', 'end');
  const rows = ['rank 0 的 link', 'rank 1', 'rank 2', 'rank 3'];
  rows.forEach((s, i) => { o += text(112, 52 + i * 32, s, i ? 't' : 'tb', 'end'); });
  for (let k = 0; k < 3; k++) {
    o += rect(sx(k * T), 38, sx(T) - sx(0) - 2, 22, 'solid', 3) + text(sx(k * T + T / 2), 53, '→ rank ' + (k + 1), 'tw', 'middle');
    o += rect(sx(0), 72 + k * 32, sx(k * T) - sx(0), 18, 'wash2', 3);
    if (k > 0) o += text(sx(k * T / 2), 85 + k * 32, '等', 'ts', 'middle');
    o += rect(sx(k * T), 72 + k * 32, sx(T) - sx(0) - 2, 18, 'wash-strong', 3) + text(sx(k * T + T / 2), 85 + k * 32, '接收 20 MB', 'ts', 'middle');
  }
  return svg(560, 214, o, '时间线：rank 0 依次给 rank 1、2、3 各发 20 MB，每次约 0.17 秒；rank 3 要等前两次发完，到 0.515 秒才收完');
}

// ---------- 第 1 站：issue slot ----------
function simSlots(mode) {
  const A = [3, 1, { s: 3 }, 2, 4, 1, { s: 2 }, 3], B = [2, 2, 1, { s: 3 }, 3, 1, 2, 2];
  const W = 4, C = 8;
  const th = [{ p: A, i: 0, rem: null, st: 0 }, { p: B, i: 0, rem: null, st: 0 }];
  const ready = (t) => { if (t.st > 0) return false; if (t.i < t.p.length && typeof t.p[t.i] === 'object') { t.st = t.p[t.i].s; t.i++; return false; } return t.i < t.p.length; };
  const grid = []; let cur = 0, rr = 0;
  for (let c = 0; c < C; c++) {
    const row = [];
    const take = (k) => { const t = th[k]; const need = t.rem ?? t.p[t.i]; const n = Math.min(need, W - row.length); for (let j = 0; j < n; j++) row.push(k); if (need - n > 0) t.rem = need - n; else { t.rem = null; t.i++; } };
    const rd = th.map(ready);
    if (mode === 'single') { if (rd[0]) take(0); }
    else if (mode === 'fine') { for (let q = 0; q < 2; q++) { const k = (rr + q) % 2; if (rd[k]) { take(k); rr = (k + 1) % 2; break; } } }
    else if (mode === 'coarse') { if (!rd[cur]) cur = 1 - cur; if (rd[cur]) take(cur); }
    else { for (const k of [0, 1]) if (rd[k]) take(k); }
    for (const t of th) if (t.st > 0) t.st--;
    grid.push(row);
  }
  return grid;
}
function slots() {
  const modes = [['single', '只有 A'], ['fine', 'fine-grained'], ['coarse', 'coarse-grained'], ['smt', 'SMT']];
  const c = 20, y0 = 48;
  let o = '';
  modes.forEach(([m, name], j) => {
    const x0 = 40 + j * 132, G = simSlots(m);
    o += text(x0 + 2 * c, 20, name, 'tb', 'middle');
    let used = 0;
    for (let r = 0; r < 8; r++) for (let s = 0; s < 4; s++) {
      const k = G[r][s];
      o += rect(x0 + s * c, y0 + r * c, c, c, 'frame');
      if (k !== undefined) { used++; o += rect(x0 + s * c + 2, y0 + r * c + 2, c - 4, c - 4, k === 0 ? 'solid' : 'wash-strong', 2) + text(x0 + s * c + c / 2, y0 + r * c + c / 2 + 4.5, k === 0 ? 'A' : 'B', k === 0 ? 'tw' : 't', 'middle'); }
    }
    o += text(x0 + 2 * c, y0 + 8 * c + 20, used + ' / 32', 'tl', 'middle');
    if (j === 0) for (let r = 0; r < 8; r++) o += text(x0 - 8, y0 + r * c + c / 2 + 4, String(r), 'ts', 'end');
  });
  o += text(32, 40, 'cycle', 'ts', 'end');
  o += text(280, y0 + 8 * c + 46, '每一行是一个 cycle 的 4 个 issue slot；下面的数是 8 个 cycle 里用掉的 slot', 'ts', 'middle');
  return svg(560, y0 + 8 * c + 54, o, '四个 4 列 8 行的格子：只有 thread A 时用掉 11 个 slot，fine-grained multithreading 15 个，coarse-grained 16 个，SMT 19 个，SMT 的一行里可以同时有 A 和 B');
}

// ---------- 第 1 站：memory 组织 ----------
function memorg() {
  let o = '';
  // distributed
  o += text(90, 20, 'distributed memory', 'tb', 'middle');
  for (let i = 0; i < 3; i++) {
    const y = 36 + i * 62;
    o += rect(20, y, 140, 48, 'frame', 6) + box(28, y + 10, 50, 28, 'P', 'paper') + box(98, y + 10, 54, 28, 'M', 'wash');
    o += line(78, y + 24, 98, y + 24, 'ink') + line(160, y + 24, 172, y + 24, 'ink');
  }
  o += rect(172, 36, 10, 172, 'solid2', 3) + text(177, 226, 'network', 'ts', 'middle');
  // UMA
  o += text(290, 20, 'UMA', 'tb', 'middle');
  for (let i = 0; i < 4; i++) { const x = 220 + i * 36; o += box(x, 44, 30, 28, 'P', 'paper') + line(x + 15, 72, x + 15, 100, 'ink'); }
  o += rect(214, 100, 152, 8, 'solid2', 3) + text(372, 108, 'bus', 'ts', 'start');
  o += line(290, 108, 290, 140, 'ink') + box(240, 140, 100, 36, 'memory', 'wash');
  o += text(290, 200, '每个 P 到 memory', 'ts', 'middle') + text(290, 216, '一样远', 'ts', 'middle');
  // NUMA
  o += text(480, 20, 'NUMA', 'tb', 'middle');
  for (let s = 0; s < 2; s++) {
    const x = 410 + s * 80;
    o += rect(x, 36, 66, 136, 'frame', 6);
    o += box(x + 6, 44, 24, 26, 'P', 'paper') + box(x + 36, 44, 24, 26, 'P', 'paper');
    o += line(x + 18, 70, x + 18, 84, 'ink') + line(x + 48, 70, x + 48, 84, 'ink') + line(x + 18, 84, x + 48, 84, 'ink') + line(x + 33, 84, x + 33, 104, 'ink');
    o += box(x + 6, 104, 54, 30, 'M', 'wash') + text(x + 33, 158, 'socket ' + s, 'ts', 'middle');
  }
  o += line(476, 119, 490, 119, 'ln');
  o += arrow(446, 72, 506, 110, 'ln-dash', 6);
  o += text(480, 196, '本地约 30 ns', 'ts', 'middle') + text(480, 212, '对面 socket 约 100 ns', 'ts', 'middle');
  return svg(560, 232, o, '三张示意图：distributed memory 里每个 node 有自己的 P 和 M，只通过 network 相连；UMA 里四个 P 经同一条 bus 到同一块 memory；NUMA 里两个 socket 各有本地 memory，跨 socket 访问更慢');
}

// ---------- 第 2 站：四种 schedule ----------
function sched() {
  const N = 16, P = 4, cost = Array.from({ length: N }, (_, i) => N - i);
  const dyn = (chunks) => { const free = [0, 0, 0, 0], res = [[], [], [], []]; for (const ch of chunks) { let t = 0; for (let k = 1; k < P; k++) if (free[k] < free[t]) t = k; res[t].push([free[t], ch]); free[t] += ch.reduce((s, i) => s + cost[i], 0); } return res; };
  const seqAssign = (lists) => lists.map((chs) => { let t = 0; return chs.map((ch) => { const r = [t, ch]; t += ch.reduce((s, i) => s + cost[i], 0); return r; }); });
  const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);
  const guided = []; for (let s = 0; s < N;) { const c = Math.max(1, Math.ceil((N - s) / P)); guided.push(range(s, s + c)); s += c; }
  const plans = [
    ['schedule(static)', seqAssign([0, 1, 2, 3].map((t) => [range(4 * t, 4 * t + 4)]))],
    ['schedule(static, 1)', seqAssign([0, 1, 2, 3].map((t) => [0, 1, 2, 3].map((k) => [t + 4 * k])))],
    ['schedule(dynamic, 1)', dyn(range(0, N).map((i) => [i]))],
    ['schedule(guided)', dyn(guided)],
  ];
  const sx = (v) => 110 + v * 7, rh = 15;
  let o = '';
  plans.forEach(([name, res], j) => {
    const y0 = 14 + j * 92;
    let mk = 0;
    o += text(14, y0 + 12, name, 'tb', 'start');
    res.forEach((chs, t) => {
      const y = y0 + 20 + t * (rh + 2);
      o += text(104, y + 11, 'thread ' + t, 'ts', 'end');
      chs.forEach(([s, ch], q) => {
        const w = ch.reduce((a, i) => a + cost[i], 0) * 7;
        o += rect(sx(s), y, w - 1, rh, q % 2 ? 'wash-strong' : 'wash', 2);
        const lab = ch.length > 1 ? ch[0] + '–' + ch[ch.length - 1] : String(ch[0]);
        if (w > 16) o += text(sx(s) + w / 2, y + 11, lab, 'ts', 'middle');
        mk = Math.max(mk, s + ch.reduce((a, i) => a + cost[i], 0));
      });
    });
    o += text(sx(mk) + 6, y0 + 20 + 1.5 * (rh + 2) + 11, '完成 ' + mk, 'tl', 'start');
  });
  o += line(sx(34), 30, sx(34), 14 + 3 * 92 + 20 + 4 * (rh + 2), 'dash') + text(sx(34), 380, '理想 34', 'ts', 'middle');
  return svg(560, 388, o, '四组甘特图：上三角 loop 的 16 个 iteration 分给 4 个 thread。static 完成时间 58，static 1 是 40，dynamic 1 是 34，guided 是 58');
}

// ---------- 第 3 站：task dependence graph ----------
function dag() {
  const P = { 1: [90, 50], 2: [250, 50], 3: [410, 50], 4: [170, 135], 5: [330, 135], 6: [130, 220], 7: [300, 220], 8: [220, 300] };
  const W = { 1: 4, 2: 2, 3: 3, 4: 2, 5: 5, 6: 3, 7: 2, 8: 1 };
  const E = [[1, 4], [2, 4], [2, 5], [3, 5], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8]];
  const crit = new Set(['3-5', '5-7', '7-8']);
  const r = 24;
  let o = '';
  for (const [a, b] of E) {
    const [x1, y1] = P[a], [x2, y2] = P[b], L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    o += arrow(x1 + ux * r, y1 + uy * r, x2 - ux * (r + 2), y2 - uy * (r + 2), crit.has(a + '-' + b) ? 'ln' : 'mute');
  }
  for (const k of Object.keys(P)) {
    const [x, y] = P[k], hot = ['3', '5', '7', '8'].includes(k);
    o += circle(x, y, r, hot ? 'paper' : 'paper') + (hot ? circle(x, y, r - 4, 'wash') : '');
    o += text(x, y - 2, 'T' + k, 'tb', 'middle') + text(x, y + 13, String(W[k]), 'ts', 'middle');
  }
  o += text(470, 150, 'W = 22', 't', 'start') + text(470, 172, 'critical path = 11', 'tl', 'start') + text(470, 194, 'W / CP = 2', 't', 'start');
  return svg(560, 330, o, '一个有 8 个 task 的 directed acyclic graph，每个 node 标着执行时间；T3、T5、T7、T8 组成的 critical path 用粗线标出，长度 11，总工作量 22');
}

// ---------- 第 3 站：agglomeration ----------
function agglom() {
  let o = '';
  const s = 22, x0 = 30, y0 = 46;
  o += text(x0 + 3.5 * s, 22, '64 个 task，每个 1 个点', 'tb', 'middle');
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) o += circle(x0 + c * s, y0 + r * s, 3.5, 'ink-f');
  for (const [r, c] of [[2, 2], [5, 5]]) {
    const cx = x0 + c * s, cy = y0 + r * s;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) o += arrow(cx + dx * 6, cy + dy * 6, cx + dx * (s - 5), cy + dy * (s - 5), 'ln', 5);
    o += circle(cx, cy, 5.5, 'ln-f');
  }
  o += text(x0 + 3.5 * s, y0 + 7 * s + 38, '每个点每步 4 个 message', 'ts', 'middle');
  o += text(x0 + 3.5 * s, y0 + 7 * s + 56, '共 256 个 message、256 个值', 'tl', 'middle');
  const X = 330, q = 19, B = 4 * q, gap = 18;
  o += text(X + B + gap / 2, 20, '4 个 task，每个 4×4', 'tb', 'middle');
  for (let br = 0; br < 2; br++) for (let bc = 0; bc < 2; bc++) {
    const bx = X + bc * (B + gap), by = y0 + 4 + br * (B + gap);
    o += rect(bx, by, B, B, 'wash', 6);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const edge = r === 0 || r === 3 || c === 0 || c === 3;
      o += circle(bx + q / 2 + c * q, by + q / 2 + r * q, edge ? 4 : 2.8, edge ? 'ln-f' : 'mute-f');
    }
  }
  const bx = X, by = y0 + 4, cy = by + B / 2, cx = bx + B / 2;
  o += arrow(bx + B + 2, cy, bx + B + gap - 2, cy, 'ink-b', 6);
  o += arrow(cx, by + B + 2, cx, by + B + gap - 2, 'ink-b', 6);
  o += arrow(bx - 2, cy, bx - 18, cy, 'ink-b', 6);
  o += arrow(cx, by - 2, cx, by - 14, 'ink-b', 6);
  o += text(bx - 22, cy - 8, '4 个值', 'ts', 'end');
  o += text(X + B + gap / 2, y0 + 7 * s + 38, '每个 task 每步 4 个 message，各装 4 个值', 'ts', 'middle');
  o += text(X + B + gap / 2, y0 + 7 * s + 56, '共 16 个 message、64 个值', 'tl', 'middle');
  return svg(560, 262, o, '左：8 乘 8 的 grid，每个点是一个 task，每步向四个邻居各发一个值；右：合成 4 个 4 乘 4 的 task，只有边上的点（深色）需要发出去，每条边打包成一个 message，左上那个 task 的四个 message 用箭头画出');
}

// ---------- 第 3 站：data distribution ----------
function dist() {
  let o = '';
  const one = (y, name, owner) => {
    o += text(14, y + 15, name, 'tb', 'start');
    for (let i = 0; i < 16; i++) { const w = owner(i); o += rect(170 + i * 23, y, 22, 22, OWN[w], 2) + text(170 + i * 23 + 11, y + 15.5, String(w), OWNT[w], 'middle'); }
  };
  one(14, 'blockwise', (i) => Math.floor(i / 4));
  one(44, 'cyclic', (i) => i % 4);
  one(74, 'block-cyclic, b = 2', (i) => Math.floor(i / 2) % 4);
  for (let i = 0; i < 16; i += 4) o += text(170 + i * 23 + 11, 114, String(i), 'ts', 'middle');
  const two = (x0, name, owner) => {
    const c = 17, y0 = 150;
    o += text(x0 + 4 * c, y0 - 10, name, 'tb', 'middle');
    for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) { const w = owner(r, k); o += rect(x0 + k * c, y0 + r * c, c - 1, c - 1, OWN[w], 1) + text(x0 + k * c + c / 2, y0 + r * c + 12, String(w), OWNT[w] === 'tw' ? 'tw' : 'ts', 'middle'); }
  };
  two(22, 'row blockwise', (r) => Math.floor(r / 2));
  two(206, 'checkerboard', (r, k) => 2 * Math.floor(r / 4) + Math.floor(k / 4));
  two(390, '2D block-cyclic', (r, k) => 2 * (Math.floor(r / 2) % 2) + (Math.floor(k / 2) % 2));
  return svg(560, 296, o, '上面三条：16 个 element 按 blockwise、cyclic、block-cyclic 分给 4 个 process，数字是 process 编号；下面三个 8 乘 8 的 matrix 按 row blockwise、checkerboard、2D block-cyclic 分');
}

// ---------- 第 3 站：pipeline ----------
function pipe() {
  const c = 64, x0 = 110, y0 = 34;
  let o = '';
  for (let t = 0; t < 6; t++) o += text(x0 + t * c + c / 2, 24, 't = ' + (t + 1), 'ts', 'middle');
  for (let s = 0; s < 3; s++) {
    o += text(x0 - 10, y0 + s * 34 + 20, 'stage ' + (s + 1), 't', 'end');
    for (let t = 0; t < 6; t++) o += rect(x0 + t * c, y0 + s * 34, c, 30, 'frame');
    for (let e = 0; e < 4; e++) { const t = s + e; o += rect(x0 + t * c + 3, y0 + s * 34 + 3, c - 6, 24, OWN[e], 3) + text(x0 + t * c + c / 2, y0 + s * 34 + 20, 'e' + (e + 1), OWNT[e], 'middle'); }
  }
  o += text(x0 + 3 * c, y0 + 3 * 34 + 22, '(k + n − 1) t = (3 + 4 − 1) t = 6t；不用 pipeline 要 12t', 'ts', 'middle');
  return svg(560, 160, o, '3 个 stage 乘 6 个时间单位的格子：element e1 到 e4 依次斜着进入各 stage，6 个时间单位全部完成');
}

// ---------- 第 4 站：求和 ----------
function sumtree() {
  const v = [8, 19, 7, 15, 7, 13, 12, 14];
  let o = '';
  // 左：master 逐个收
  o += text(130, 18, 'master 逐个接收：7 轮', 'tb', 'middle');
  let acc = v[0];
  o += box(14, 34, 40, 24, '8', 'solid', 'tw');
  o += text(34, 74, 'core 0', 'ts', 'middle');
  for (let k = 1; k < 8; k++) {
    acc += v[k];
    const y = 30 + k * 26;
    o += box(84, y, 34, 20, String(v[k]), 'wash', 'ts') + text(124, y + 15, '→', 't', 'start') + text(146, y + 15, '第 ' + k + ' 轮：' + acc, 't', 'start');
  }
  o += text(14, 250, 'core 1 到 7 的 partial sum 依次送到 core 0', 'ts', 'start');
  // 右：tree
  o += text(398, 18, 'tree：3 轮', 'tb', 'middle');
  const lv = [v, [27, 22, 20, 26], [49, 46], [95]];
  const xs = (l, i) => 290 + (i + 0.5) * (216 / lv[l].length), ys = (l) => 50 + l * 58;
  for (let l = 1; l < 4; l++) lv[l].forEach((_, i) => { for (const c of [2 * i, 2 * i + 1]) o += line(xs(l - 1, c), ys(l - 1) + 11, xs(l, i), ys(l) - 11, 'mute'); });
  lv.forEach((row, l) => row.forEach((x, i) => { o += box(xs(l, i) - 15, ys(l) - 11, 30, 22, String(x), l === 3 ? 'solid' : l === 0 ? 'wash' : 'paper', l === 3 ? 'tw' : 'ts'); }));
  for (let l = 1; l < 4; l++) o += text(552, ys(l) + 4, '第 ' + l + ' 轮', 'ts', 'end');
  return svg(560, 262, o, '左：core 0 依次接收 7 个 partial sum，累加到 95 用 7 轮；右：8 个 partial sum 两两相加，27、22、20、26，然后 49、46，最后 95，3 轮');
}

// ---------- 第 4 站：Amdahl vs Gustafson ----------
function gustafson() {
  let o = '';
  const bar = (x, y, w1, w2, l1, l2) => rect(x, y, w1, 22, 'solid2', 2) + rect(x + w1, y, w2, 22, 'wash-strong', 2) + text(x + w1 / 2, y + 15, l1, 'tw', 'middle') + text(x + w1 + w2 / 2, y + 15, l2, 't', 'middle');
  o += text(14, 20, 'Amdahl：问题固定', 'tb', 'start');
  o += text(14, 46, '1 个 P', 'ts', 'start') + bar(62, 32, 30, 150, 's', 'p');
  o += text(14, 78, 'N 个 P', 'ts', 'start') + bar(62, 64, 30, 30, 's', 'p/N');
  o += text(14, 124, 'Gustafson：时间固定', 'tb', 'start');
  o += text(14, 150, 'N 个 P', 'ts', 'start') + bar(62, 136, 30, 60, "s'", "p'");
  o += text(14, 182, '1 个 P', 'ts', 'start') + bar(62, 168, 30, 160, "s'", "N·p'");
  o += text(14, 220, '上面那根是 1，下面算 speedup', 'ts', 'start');
  // 右：曲线
  const sx = lin(0, 0.04, 300, 540), sy = lin(0, 1024, 220, 40);
  o += axes({ sx, sy, x0: 0, x1: 0.04, y0: 0, y1: 1024, xt: [[0, '0'], [0.01, '1%'], [0.02, '2%'], [0.03, '3%'], [0.04, '4%']], yt: [0, 256, 512, 768, 1024], grid: true });
  o += text(540, 254, 'serial fraction（N = 1024）', 'ts', 'end');
  const N = 1024;
  o += path(curve((f) => 1 / (f + (1 - f) / N), 0, 0.04, sx, sy, 400), 'ln');
  o += path(curve((f) => N + (1 - N) * f, 0, 0.04, sx, sy), 'ln-dash');
  o += text(sx(0.03), sy(N + (1 - N) * 0.03) - 10, 'Gustafson', 'tl', 'middle');
  o += text(sx(0.012) + 6, sy(1 / (0.012 + 0.988 / N)) - 6, 'Amdahl', 'tl', 'start');
  for (const f of [0.004, 0.008]) o += circle(sx(f), sy(1 / (f + (1 - f) / N)), 3.5, 'ink-f');
  o += text(14, 244, '右图两个黑点：f = 0.4% 时 201，0.8% 时 111', 'ts', 'start');
  return svg(560, 262, o, '左：Amdahl 固定问题，N 个 processor 的时间是 s 加 p 除以 N；Gustafson 固定 parallel 机器上的时间，一个 processor 要 s 撇加 N 倍 p 撇。右：N 等于 1024 时 Amdahl 的 speedup 随 serial fraction 迅速下降，Gustafson 是缓降的直线');
}

// ---------- 第 4 站：energy vs frequency ----------
function energy() {
  const E = (f) => { const V = Math.max(f, 0.7); return V * V + 0.3 / f; };
  const sx = lin(0.4, 1.0, 80, 520), sy = lin(0.8, 1.4, 200, 30);
  let o = axes({ sx, sy, x0: 0.4, x1: 1.0, y0: 0.8, y1: 1.4, xt: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((v) => [v, v.toFixed(1)]), yt: [0.8, 1.0, 1.2, 1.4].map((v) => [v, v.toFixed(1)]), grid: true, xl: 'frequency', yl: '完成同一个工作的 energy' });
  o += path(curve(E, 0.4, 1.0, sx, sy, 300), 'ln');
  for (const f of [1.0, 0.8, 0.7, 0.5]) o += circle(sx(f), sy(E(f)), 4, 'ink-f') + (f === 0.7 ? text(sx(f) + 8, sy(E(f)) + 18, E(f).toFixed(3), 'ts', 'start') : text(sx(f), sy(E(f)) - 10, E(f).toFixed(3), 'ts', 'middle'));
  o += line(sx(0.7), sy(0.8), sx(0.7), sy(1.4), 'dash') + text(sx(0.7) - 6, 48, 'voltage 到下限 0.7', 'ts', 'end');
  o += text(sx(0.85), 60, 'V 跟着 f 降', 'ts', 'start') + text(sx(0.45), 60, 'V 不能再降', 'ts', 'start');
  return svg(560, 236, o, 'energy 随 frequency 变化的曲线：从 1.0 降到 0.7 时 energy 从 1.3 降到 0.919，再往下降到 0.5 时 energy 回升到 1.09');
}

// ---------- 第 5 站：invalidate vs update ----------
function invupd() {
  let o = '';
  const cw = 18;
  const row = (y, ops, marks, label, total) => {
    o += text(112, y + 13, label, 't', 'end');
    ops.forEach((op, i) => {
      const x = 120 + i * cw;
      o += rect(x, y, cw - 2, 18, op === 'W' ? 'paper' : 'wash', 2) + text(x + cw / 2 - 1, y + 13, op, 'ts', 'middle');
      const m = marks[i];
      if (m) m.split('').forEach((k, j) => { o += rect(x + 3, y + 22 + j * 8, cw - 8, 6, k === 'i' ? 'solid' : 'wash-strong', 1); });
    });
    o += text(548, y + 13, total, 'tl', 'end');
  };
  o += text(14, 20, 'Pattern 1：P1 连写 10 次，P0 读 1 次', 'tb', 'start');
  const p1 = [...Array(10).fill('W'), 'R'];
  row(32, p1, ['i', '', '', '', '', '', '', '', '', '', 'd'], 'invalidate', '2 次');
  row(80, p1, [...Array(10).fill('i'), ''], 'update', '10 次');
  o += text(14, 150, 'Pattern 2：P1 写、P0 读，交替 10 轮', 'tb', 'start');
  const p2 = []; for (let k = 0; k < 10; k++) p2.push('W', 'R');
  row(162, p2, p2.map((op) => (op === 'W' ? 'i' : 'd')), 'invalidate', '20 次');
  row(210, p2, p2.map((op) => (op === 'W' ? 'i' : '')), 'update', '10 次');
  o += rect(120, 262, 10, 6, 'solid', 1) + text(136, 268, 'invalidation 或 update', 'ts', 'start') + rect(300, 262, 10, 6, 'wash-strong', 1) + text(316, 268, 'miss 之后取 data', 'ts', 'start');
  o += text(120, 290, 'W = P1 写 x，R = P0 读 x；方块下面是这次操作引起的 bus transaction', 'ts', 'start');
  return svg(560, 298, o, '两种 access pattern 下 invalidate 和 update 的 bus transaction：pattern 1 中 invalidate 2 次、update 10 次；pattern 2 中 invalidate 20 次、update 10 次');
}

// ---------- 第 5 站：snooping vs directory ----------
function dir() {
  let o = '';
  const has = (i) => i === 2 || i === 5;
  o += text(130, 18, 'snooping：broadcast', 'tb', 'middle');
  o += rect(20, 126, 220, 8, 'solid2', 3);
  for (let i = 0; i < 8; i++) {
    const y = i < 4 ? 70 : 160, xx = 20 + (i % 4) * 56 + 6;
    o += box(xx, y, 44, 26, 'C' + i, i === 0 ? 'solid' : has(i) ? 'wash-strong' : 'paper', i === 0 ? 'tw' : 'ts');
    o += line(xx + 22, i < 4 ? y + 26 : y, xx + 22, i < 4 ? 126 : 134, 'ink');
  }
  o += text(130, 214, '其余 7 个 cache 都要查 tag', 'ts', 'middle');
  o += text(420, 18, 'directory：点对点', 'tb', 'middle');
  const pos = (i) => [300 + (i % 4) * 64, i < 4 ? 34 : 190];
  for (let i = 0; i < 8; i++) { const [x, y] = pos(i); o += box(x, y, 44, 26, 'C' + i, i === 0 ? 'solid' : has(i) ? 'wash-strong' : 'paper', i === 0 ? 'tw' : 'ts'); }
  const H = [372, 106, 120, 44];
  o += rect(H[0], H[1], H[2], H[3], 'paper', 4) + text(H[0] + H[2] / 2, H[1] + 17, 'home directory', 'ts', 'middle') + text(H[0] + H[2] / 2, H[1] + 35, '0 0 1 0 0 1 0 0', 'tb', 'middle');
  o += arrow(330, 60, 392, 104, 'ln', 6) + text(370, 76, '1', 'tl', 'middle');
  o += arrow(380, 104, 316, 62, 'mute', 6) + text(330, 92, '6', 'ts', 'middle');
  o += arrow(442, 104, 442, 62, 'ln', 6) + text(432, 88, '2', 'tl', 'end');
  o += arrow(462, 62, 462, 104, 'mute', 6) + text(472, 88, '4', 'ts', 'start');
  o += arrow(380, 152, 380, 188, 'ln', 6) + text(370, 175, '3', 'tl', 'end');
  o += arrow(400, 188, 400, 152, 'mute', 6) + text(410, 175, '5', 'ts', 'start');
  o += text(420, 240, '1 请求，2、3 invalidation，4、5 ack，6 回复', 'ts', 'middle');
  return svg(560, 248, o, '左：8 个 cache 挂在一条 bus 上，C0 的写请求 broadcast 给其余 7 个；右：C0 先问 home directory，presence vector 显示只有 C2、C5 有 copy，home 只给它们发 invalidation，收到 ack 后回复 C0，共 6 个 message');
}

// ---------- 第 5 站：PC 允许的结局（动图） ----------
function pcA() {
  const X = { P1: 110, P2: 280, P3: 450 }, y0 = 56, sy = (t) => y0 + t * 34;
  const T = 9;
  // 事件时间（单位：抽象时间）
  const ev = [0.4, 1.4, 2.0, 2.5, 3.0, 3.6, 4.2, 5.4]; // 依次出现的事件
  const kt = [0, 0.1, ...ev.map((t) => 0.12 + t / 6.4 * 0.7), 1];
  const nF = kt.length;
  const vis = (k) => kt.map((_, i) => i === 0 || i >= 2 + k); // 第 0 帧全显示，第 1 帧清空
  let o = '';
  for (const [n, x] of Object.entries(X)) o += text(x, 24, n, 'tb', 'middle') + line(x, 34, x, sy(6.3), 'mute');
  o += text(30, sy(0) + 4, '时间', 'ts', 'start') + arrow(30, sy(0.4), 30, sy(5.8), 'axis', 5);
  // P1 写 A=1
  o += show(box(X.P1 - 40, sy(0) - 12, 80, 24, 'A = 1', 'solid', 'tw'), vis(0), kt, T);
  // A=1 到 P2（快）
  o += show(arrow(X.P1 + 2, sy(0.5), X.P2 - 2, sy(1.3), 'ln') + text((X.P1 + X.P2) / 2, sy(0.9) - 8, '快', 'ts', 'middle'), vis(1), kt, T);
  // P2 读到 A==1
  o += show(box(X.P2 - 52, sy(1.5) - 11, 104, 22, '读 A，得 1', 'wash', 'ts'), vis(1), kt, T);
  // P2 写 B=1
  o += show(box(X.P2 - 40, sy(2.3) - 12, 80, 24, 'B = 1', 'solid', 'tw'), vis(2), kt, T);
  // B=1 到 P3
  o += show(arrow(X.P2 + 2, sy(2.6), X.P3 - 2, sy(3.3), 'ln'), vis(3), kt, T);
  // P3 读 B==1
  o += show(box(X.P3 - 52, sy(3.5) - 11, 104, 22, '读 B，得 1', 'wash', 'ts'), vis(4), kt, T);
  // P3 读 A==0
  o += show(box(X.P3 - 52, sy(4.3) - 11, 104, 22, '读 A，得 0', 'wash-strong', 't'), vis(5), kt, T);
  // A=1 到 P3（慢），最后才到
  o += show(path(`M${f1(X.P1 + 2)} ${f1(sy(0.5))}Q${f1(X.P2 - 20)} ${f1(sy(5.6))} ${f1(X.P3 - 4)} ${f1(sy(5.3))}`, 'ln-dash') + poly([[X.P3 - 2, sy(5.32)], [X.P3 - 11, sy(5.32) - 7], [X.P3 - 13, sy(5.32) + 1]], 'ln-f') + text(X.P3 - 30, sy(5.6) + 6, '慢：读完 A 才到', 'ts', 'end'), vis(6), kt, T);
  o += show(text(280, sy(6.3) + 20, 'P3 看到了新的 B，却读到旧的 A：PC 允许，TSO 和 SC 不允许', 'tl', 'middle'), vis(7), kt, T);
  return svgA(560, 290, o, '动图：三条竖直的时间线 P1、P2、P3。P1 写 A 等于 1，这个 write 很快到达 P2、很慢才到达 P3；P2 读到 A 等于 1 后写 B 等于 1，B 先到 P3；P3 读到 B 等于 1，接着读 A 得到 0');
}

// ---------- 第 6 站：coalescing ----------
function coalesce() {
  const a0 = 64, a1 = 352, sx = lin(a0, a1, 60, 532);
  let o = '';
  const rowY = [40, 110, 180];
  const cases = [
    ['对齐：96–223', Array.from({ length: 32 }, (_, k) => 96 + 4 * k), '4 个 sector，100%'],
    ['错位：112–239', Array.from({ length: 32 }, (_, k) => 112 + 4 * k), '5 个 sector，80%'],
    ['stride 2：从 96 起每隔一个', Array.from({ length: 32 }, (_, k) => 96 + 8 * k), '8 个 sector，50%'],
  ];
  cases.forEach(([name, addrs, note], j) => {
    const y = rowY[j];
    o += text(60, y - 10, name, 'tb', 'start') + text(532, y - 10, note, 'tl', 'end');
    const secs = new Set(addrs.map((a) => Math.floor(a / 32)));
    for (const s of secs) o += rect(sx(s * 32), y, sx(32) - sx(0), 24, 'wash');
    for (let a = a0; a < a1; a += 4) o += rect(sx(a), y, sx(4) - sx(0), 24, 'frame');
    for (const a of addrs) o += rect(sx(a) + 0.8, y + 5, sx(4) - sx(0) - 1.6, 14, 'solid');
    for (let a = a0; a <= a1; a += 32) o += line(sx(a), y - 3, sx(a), y + 27, 'ink-b');
  });
  for (let a = a0; a <= a1; a += 32) o += text(sx(a), 228, String(a), 'ts', 'middle');
  o += text(296, 248, 'byte address；粗线之间是一个 32-byte sector，浅底是被取回的 sector', 'ts', 'middle');
  return svg(560, 256, o, '三行 global memory，每 32 byte 一个 sector：连续对齐的 128 byte 落在 4 个 sector；从 112 开始的错位访问落在 5 个；stride 2 的访问散布在 8 个 sector，一半的 byte 没用上');
}

// ---------- 第 6 站：bank conflict ----------
function bank() {
  let o = '';
  const c = 24;
  const tile = (x0, cols, title, note) => {
    const y0 = 50;
    o += text(x0 + cols * c / 2, 20, title, 'tb', 'middle');
    for (let r = 0; r < 8; r++) for (let k = 0; k < cols; k++) {
      const b = (r * cols + k) % 8, pad = k === 8, hot = k === 0;
      o += rect(x0 + k * c, y0 + r * c, c - 1, c - 1, pad ? 'wash2' : hot ? 'solid' : 'paper', 1);
      if (!pad) o += text(x0 + k * c + c / 2, y0 + r * c + 16, String(b), hot ? 'tw' : 'ts', 'middle');
    }
    o += text(x0 + cols * c / 2, y0 + 8 * c + 22, note, 'ts', 'middle');
  };
  tile(30, 8, 'tile[8][8]', 'column 0 的 8 个元素都在 bank 0');
  tile(300, 9, 'tile[8][9]（最后一列是 padding）', 'column 0 落在 bank 0 到 7');
  return svg(560, 270, o, '两个 8 行的 tile，格子里是 bank 编号。8 列的 tile 里第 0 列全是 bank 0；多一列 padding 之后，第 0 列依次是 bank 0、1、2 到 7');
}

// ---------- 第 7 站：六种 topology ----------
function topo() {
  let o = '';
  const node = (x, y, r = 5) => circle(x, y, r, 'paper');
  const cut = (pts) => path(d(pts), 'ln-dash');
  // 1. linear array
  o += text(14, 20, 'linear array（p = 16）', 'tb', 'start');
  for (let i = 0; i < 16; i++) { if (i) o += line(30 + (i - 1) * 32, 44, 30 + i * 32, 44, 'ink'); }
  for (let i = 0; i < 16; i++) o += node(30 + i * 32, 44);
  o += cut([[30 + 7.5 * 32, 30], [30 + 7.5 * 32, 58]]) + text(30 + 7.5 * 32 + 6, 70, '剪断 1 条', 'ts', 'start');
  // 2. ring
  const R0 = [96, 160], rr = 56;
  o += text(14, 96, 'ring', 'tb', 'start');
  const rp = (i) => [R0[0] + rr * Math.cos(i * Math.PI / 8 - Math.PI / 2), R0[1] + rr * Math.sin(i * Math.PI / 8 - Math.PI / 2)];
  for (let i = 0; i < 16; i++) { const [a, b] = rp(i), [c2, e] = rp((i + 1) % 16); o += line(a, b, c2, e, 'ink'); }
  for (let i = 0; i < 16; i++) o += node(...rp(i), 4.5);
  o += cut([[R0[0] - 72 * Math.cos(Math.PI / 16), R0[1] + 72 * Math.sin(Math.PI / 16)], [R0[0] + 72 * Math.cos(Math.PI / 16), R0[1] - 72 * Math.sin(Math.PI / 16)]]) + text(R0[0], R0[1] + 82, '剪断 2 条', 'ts', 'middle');
  // 3. mesh
  const M0 = [226, 118], s = 30;
  o += text(206, 96, '2D mesh', 'tb', 'start');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { if (c < 3) o += line(M0[0] + c * s, M0[1] + r * s, M0[0] + (c + 1) * s, M0[1] + r * s, 'ink'); if (r < 3) o += line(M0[0] + c * s, M0[1] + r * s, M0[0] + c * s, M0[1] + (r + 1) * s, 'ink'); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) o += node(M0[0] + c * s, M0[1] + r * s);
  o += cut([[M0[0] + 1.5 * s, M0[1] - 14], [M0[0] + 1.5 * s, M0[1] + 3 * s + 14]]) + text(M0[0] + 1.5 * s, M0[1] + 3 * s + 34, '剪断 4 条', 'ts', 'middle');
  // 4. torus
  const T0 = [414, 118];
  o += text(386, 96, '2D torus', 'tb', 'start');
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { if (c < 3) o += line(T0[0] + c * s, T0[1] + r * s, T0[0] + (c + 1) * s, T0[1] + r * s, 'ink'); if (r < 3) o += line(T0[0] + c * s, T0[1] + r * s, T0[0] + c * s, T0[1] + (r + 1) * s, 'ink'); }
  for (let r = 0; r < 4; r++) { const y = T0[1] + r * s; o += line(T0[0] - 14, y, T0[0], y, 'mute') + line(T0[0] + 3 * s, y, T0[0] + 3 * s + 14, y, 'mute'); }
  for (let c = 0; c < 4; c++) { const x = T0[0] + c * s; o += path(`M${f1(x)} ${f1(T0[1])}L${f1(x)} ${f1(T0[1] - 12)}`, 'mute') + path(`M${f1(x)} ${f1(T0[1] + 3 * s)}L${f1(x)} ${f1(T0[1] + 3 * s + 12)}`, 'mute'); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) o += node(T0[0] + c * s, T0[1] + r * s);
  o += cut([[T0[0] + 1.5 * s, T0[1] - 18], [T0[0] + 1.5 * s, T0[1] + 3 * s + 18]]) + text(T0[0] + 1.5 * s, T0[1] + 3 * s + 34, '剪断 8 条：中间 4 + wrap 4', 'ts', 'middle');
  o += text(T0[0] + 1.5 * s, T0[1] + 3 * s + 50, '灰色短线：wrap-around', 'ts', 'middle');
  // 5. hypercube：两个 3-cube
  o += text(14, 290, 'hypercube（两个 3-cube）', 'tb', 'start');
  const cube = (ox, oy) => { const P = []; for (let i = 0; i < 8; i++) { const x = (i & 1) ? 1 : 0, y = (i & 2) ? 1 : 0, z = (i & 4) ? 1 : 0; P.push([ox + x * 50 + z * 24, oy - y * 50 - z * 18]); } return P; };
  const A = cube(36, 400), B = cube(176, 400);
  const cubeEdges = (P) => { let q = ''; for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) q += line(P[i][0], P[i][1], P[i | b][0], P[i | b][1], 'ink'); return q; };
  o += cubeEdges(A) + cubeEdges(B);
  for (let i = 0; i < 8; i++) o += line(A[i][0], A[i][1], B[i][0], B[i][1], 'mute');
  for (let i = 0; i < 8; i++) o += node(...A[i]) + node(...B[i]);
  o += cut([[150, 306], [150, 414]]) + text(150, 432, '剪断 8 条', 'ts', 'middle');
  // 6. tree
  o += text(330, 290, 'complete binary tree（15 个 node）', 'tb', 'start');
  const tp = (l, i) => [330 + (i + 0.5) * (220 / 2 ** l), 314 + l * 34];
  for (let l = 1; l < 4; l++) for (let i = 0; i < 2 ** l; i++) { const [x, y] = tp(l, i), [px, py] = tp(l - 1, i >> 1); o += line(x, y, px, py, 'ink'); }
  for (let l = 0; l < 4; l++) for (let i = 0; i < 2 ** l; i++) o += node(...tp(l, i), 4.5);
  const [rx, ry] = tp(0, 0), [lx, ly] = tp(1, 0);
  o += cut([[(rx + lx) / 2 - 16, (ry + ly) / 2 - 16], [(rx + lx) / 2 + 14, (ry + ly) / 2 + 14]]) + text(330, 432, '剪断 1 条（root 左边那条）', 'ts', 'start');
  return svg(560, 440, o, '六种 topology：16 个 node 的 linear array、ring、4 乘 4 mesh、4 乘 4 torus、由两个 3-cube 组成的 4-dimensional hypercube、15 个 node 的 complete binary tree；虚线是 bisection，分别剪断 1、2、4、8、8、1 条 link');
}

// ---------- 第 7 站：omega network ----------
function omega() {
  const rot = (x) => ((x << 1) | (x >> 2)) & 7;
  const yP = (i) => 40 + i * 30;
  const X = [70, 150, 190, 270, 310, 390, 430, 500]; // in | sh0→ sw0 in, sw0 out | sh1 | ...
  const swX = [[150, 190], [270, 310], [390, 430]];
  let o = '';
  for (let i = 0; i < 8; i++) o += text(60, yP(i) + 4, i.toString(2).padStart(3, '0'), 'ts', 'end') + text(512, yP(i) + 4, i.toString(2).padStart(3, '0'), 'ts', 'start');
  // shuffle 连线
  const sh = (x0, x1) => { let q = ''; for (let i = 0; i < 8; i++) q += line(x0, yP(i), x1, yP(rot(i)), 'grid'); return q; };
  o += sh(70, 150) + sh(190, 270) + sh(310, 390) + (() => { let q = ''; for (let i = 0; i < 8; i++) q += line(430, yP(i), 500, yP(i), 'grid'); return q; })();
  for (const [a, b] of swX) for (let k = 0; k < 4; k++) o += rect(a, yP(2 * k) - 8, b - a, 46, 'paper', 4);
  for (let s = 0; s < 3; s++) o += text((swX[s][0] + swX[s][1]) / 2, 22, '第 ' + (s + 1) + ' 级', 'ts', 'middle');
  const route = (src, dst, cls) => {
    const Tg = src ^ dst; let pos = src, pts = [[70, yP(src)]];
    for (let s = 0; s < 3; s++) {
      const inp = rot(pos); pts.push([swX[s][0], yP(inp)]);
      const out = ((Tg >> (2 - s)) & 1) ? inp ^ 1 : inp; pts.push([swX[s][1], yP(out)]);
      pos = out; if (s < 2) {} else pts.push([500, yP(out)]);
    }
    return path(d(pts), cls);
  };
  o += route(2, 7, 'ln') + route(6, 4, 'ink-b');
  o += circle(190, yP(5), 10, 'ln') + line(186, yP(5) + 10, 120, yP(7) + 22, 'mute') + text(118, yP(7) + 34, '两条 route 都要这个 output', 'tl', 'middle');
  o += text(280, 312, '彩线：010 → 111（cross、straight、cross）；黑线：110 → 100（straight、cross、straight）', 'ts', 'middle');
  return svg(560, 320, o, '8 乘 8 omega network：左边 8 个 input，三级各 4 个 2 乘 2 switch，级间按 perfect shuffle 连线。010 到 111 和 110 到 100 两条 route 在第一级的同一个 switch 里争同一个 output');
}

// ---------- 第 7 站：XY routing（动图） ----------
function xyA() {
  const s = 64, X0 = 120, Y0 = 236; // (x, y)，y 向上
  const P = (x, y) => [X0 + x * s, Y0 - y * s];
  let o = '';
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { if (x < 3) o += line(...P(x, y), ...P(x + 1, y), 'grid'); if (y < 3) o += line(...P(x, y), ...P(x, y + 1), 'grid'); }
  const route = [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]];
  o += path(d(route.map(([x, y]) => P(x, y))), 'ln-dash');
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) o += circle(...P(x, y), 9, 'paper') + text(P(x, y)[0], P(x, y)[1] + 24, `(${x},${y})`, 'ts', 'middle');
  o += circle(...P(0, 0), 9, 'wash-strong') + circle(...P(3, 2), 9, 'wash-strong');
  const T = 5, kt = [0, 0.12, 0.26, 0.4, 0.54, 0.68, 0.9, 1];
  const seq = [route[0], route[0], route[1], route[2], route[3], route[4], route[5], route[5]];
  o += acircle(seq.map(([x, y]) => P(x, y)[0]), seq.map(([x, y]) => P(x, y)[1]), kt, T, 6, 'ln-f');
  o += text(P(1.5, 0)[0], P(0, 0)[1] + 44, '先走 X：3 步', 'tl', 'middle');
  o += text(P(3, 1)[0] + 20, P(3, 1)[1] + 4, '再走 Y：2 步', 'tl', 'start');
  o += text(30, 30, 'X →', 'ts', 'start') + text(30, 48, 'Y ↑', 'ts', 'start');
  return svgA(560, 290, o, '动图：4 乘 4 mesh 上一个 packet 从 (0,0) 先沿 X 方向走 3 步到 (3,0)，再沿 Y 方向走 2 步到 (3,2)');
}

// ---------- 第 7 站：转弯与 deadlock ----------
function turns() {
  let o = '';
  const panel = (x0, title, banned) => {
    const S = 120, y0 = 60;
    const Pn = [[x0, y0 + S], [x0 + S, y0 + S], [x0 + S, y0], [x0, y0]];
    o += text(x0 + S / 2, 26, title, 'tb', 'middle');
    for (let i = 0; i < 4; i++) o += line(...Pn[i], ...Pn[(i + 1) % 4], 'grid');
    for (let k = 0; k < 4; k++) {
      const [ax, ay] = Pn[k], [bx, by] = Pn[(k + 1) % 4], [cx, cy] = Pn[(k + 2) % 4];
      const P = (t) => [ax + (bx - ax) * t, ay + (by - ay) * t];
      o += arrow(...P(0.12), ...P(0.6), 'ln', 7);
      o += circle(...P(0.3), 6, 'ln-f');
      const t0 = P(0.76), t1 = [bx + (cx - bx) * 0.24, by + (cy - by) * 0.24];
      const no = banned && (k === 1 || k === 3);
      o += path(`M${f1(t0[0])} ${f1(t0[1])}Q${f1(bx)} ${f1(by)} ${f1(t1[0])} ${f1(t1[1])}`, no ? 'dash' : 'ink');
      if (no) { const ix = bx + (x0 + S / 2 - bx) * 0.22, iy = by + (y0 + S / 2 - by) * 0.22; o += text(ix, iy + 6, '×', 'tl', 'middle'); }
    }
    for (const pt of Pn) o += circle(...pt, 6, 'paper');
  };
  panel(70, '四个等待围成一圈', false);
  panel(370, 'XY routing：Y → X 的弯不允许', true);
  o += text(130, 220, '彩色箭头：packet 占着的 link', 'ts', 'middle') + text(130, 238, '黑色弯线：它等着转进的下一条', 'ts', 'middle');
  o += text(430, 220, '向上之后向左、向下之后向右（×）被禁止，', 'ts', 'middle') + text(430, 238, '圈合不上', 'ts', 'middle');
  return svg(560, 248, o, '左：一个方格四条边上各有一个 packet，每个都占着自己的 link 等着转进下一条，形成循环等待；右：XY routing 禁止从 Y 方向转回 X 方向，四个弯中两个被打叉，循环不成立');
}

// ---------- 第 7 站：store-and-forward vs cut-through ----------
function switching() {
  const ts = 1, th = 0.05, mw = 4.096, L = 6, sx = lin(0, 27, 110, 540), lh = 17;
  const yCT = 40 + (L + 1) * lh + 34;
  const yEnd = yCT + 10 + (L + 1) * lh + 6;
  let o = axes({ sx, sy: lin(0, 1, yEnd, 30), x0: 0, x1: 27, y0: 0, y1: 1, xt: [0, 5, 10, 15, 20, 25], yt: [] });
  o += text(540, yEnd + 32, 'μs', 'ts', 'end');
  const lane = (y, lab) => text(102, y + 11, lab, 'ts', 'end');
  o += text(14, 24, 'store-and-forward', 'tb', 'start');
  o += lane(34, 'startup') + rect(sx(0), 34, sx(ts) - sx(0), lh - 3, 'wash2', 2);
  for (let h = 0; h < L; h++) { const t0 = ts + h * (mw + th); o += lane(34 + (h + 1) * lh, 'link ' + (h + 1)) + rect(sx(t0 + th), 34 + (h + 1) * lh, sx(mw) - sx(0), lh - 3, 'solid', 2); }
  const tSF = ts + L * (mw + th);
  o += text(sx(tSF), 34 + (L + 1) * lh + 12, tSF.toFixed(1) + ' μs', 'tl', 'end');
  o += text(14, yCT, 'cut-through', 'tb', 'start');
  o += lane(yCT + 10, 'startup') + rect(sx(0), yCT + 10, sx(ts) - sx(0), lh - 3, 'wash2', 2);
  for (let h = 0; h < L; h++) { const t0 = ts + (h + 1) * th; o += lane(yCT + 10 + (h + 1) * lh, 'link ' + (h + 1)) + rect(sx(t0), yCT + 10 + (h + 1) * lh, sx(mw) - sx(0), lh - 3, 'wash-strong', 2); }
  const tCT = ts + L * th + mw;
  o += text(sx(tCT) + 6, yCT + 10 + L * lh + 11, tCT.toFixed(2) + ' μs', 'tl', 'start');
  return svg(560, yEnd + 40, o, '两组甘特图：一个 4096 byte 的 message 走 6 跳。store-and-forward 每段 link 依次传 4.1 微秒，共 25.9 微秒；cut-through 六段 link 几乎同时传，共 5.40 微秒');
}

// ---------- 第 7 站：shear sort（动图） ----------
function shearA() {
  const F = [
    [[11, 15, 6, 2], [10, 3, 4, 12], [14, 8, 9, 5], [1, 7, 16, 13]],
    [[2, 6, 11, 15], [12, 10, 4, 3], [5, 8, 9, 14], [16, 13, 7, 1]],
    [[2, 6, 4, 1], [5, 8, 7, 3], [12, 10, 9, 14], [16, 13, 11, 15]],
    [[1, 2, 4, 6], [8, 7, 5, 3], [9, 10, 12, 14], [16, 15, 13, 11]],
    [[1, 2, 4, 3], [8, 7, 5, 6], [9, 10, 12, 11], [16, 15, 13, 14]],
    [[1, 2, 3, 4], [8, 7, 6, 5], [9, 10, 11, 12], [16, 15, 14, 13]],
  ];
  const names = ['开始', 'row phase 1', 'column phase 1', 'row phase 2', 'column phase 2', 'row phase 3'];
  const T = 12, n = F.length, kt = [], step = 1 / n;
  for (let i = 0; i < n; i++) kt.push(i * step);
  kt.push(1);
  const on = (i) => [...F.map((_, j) => j === i), i === n - 1];
  let o = '';
  const c = 40, X0 = 40, Y0 = 44;
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o += rect(X0 + k * c, Y0 + r * c, c - 2, c - 2, 'paper', 3);
  F.forEach((G, i) => {
    let q = text(X0 + 2 * c, 26, names[i], 'tb', 'middle');
    G.forEach((row, r) => row.forEach((v, k) => { q += text(X0 + k * c + c / 2 - 1, Y0 + r * c + c / 2 + 5, String(v), 't', 'middle'); }));
    o += show(q, on(i), kt, T);
  });
  o += text(X0 + 2 * c, Y0 + 4 * c + 18, '偶数行向右递增，奇数行向左递增', 'ts', 'middle');
  // 右边：6 个小图一字排开（静态），当前帧加框
  const mc = 13, MX = (i) => 232 + (i % 3) * 108, MY = (i) => 50 + Math.floor(i / 3) * 100;
  F.forEach((G, i) => {
    o += text(MX(i) + 2 * mc, MY(i) - 10, names[i], 'ts', 'middle');
    G.forEach((row, r) => row.forEach((v, k) => { o += rect(MX(i) + k * mc, MY(i) + r * mc, mc - 1, mc - 1, 'wash', 1); }));
    G.forEach((row, r) => row.forEach((v, k) => { o += `<text x="${f1(MX(i) + k * mc + mc / 2)}" y="${f1(MY(i) + r * mc + 10)}" class="ts" text-anchor="middle" style="font-size:9px">${v}</text>`; }));
    o += show(rect(MX(i) - 4, MY(i) - 4, 4 * mc + 7, 4 * mc + 7, 'ln', 3), on(i), kt, T);
  });
  // 最后一张小图上画 snake
  o += text(390, 250, '5 个 phase = log₂16 + 1；框出的是当前这一步', 'ts', 'middle');
  return svgA(560, 262, o, '动图：16 个数在 4 乘 4 mesh 上的 shear sort，依次经过 3 个 row phase 和 2 个 column phase，最后按 snake order 是 1 到 16；右边 6 个小图是每个 phase 之后的状态');
}

// ---------- 第 8 站：三种 send ----------
function sendmodes() {
  let o = '';
  const panel = (y0, title, parts) => {
    o += text(14, y0 + 4, title, 'tb', 'start');
    o += text(100, y0 + 30, 'sender', 'ts', 'end') + line(108, y0 + 26, 540, y0 + 26, 'mute');
    o += text(100, y0 + 70, 'receiver', 'ts', 'end') + line(108, y0 + 66, 540, y0 + 66, 'mute');
    o += parts;
  };
  const blk = (x, y, w, s, cls = 'solid', tc = 'tw') => rect(x, y - 9, w, 18, cls, 3) + text(x + w / 2, y + 4.5, s, tc, 'middle');
  panel(10, 'synchronous（MPI_Ssend，或大 message 的 MPI_Send）',
    blk(120, 36, 240, 'MPI_Send：等对方开始接收') + blk(380, 36, 120, '之后的计算', 'wash', 't') +
    blk(120, 76, 230, '还在做别的', 'wash2', 'ts') + blk(352, 76, 56, 'Recv', 'wash-strong', 't') + arrow(356, 45, 362, 66, 'ln', 6));
  panel(110, 'buffered（MPI_Bsend，或小 message 的 MPI_Send）',
    blk(120, 136, 50, 'copy') + blk(174, 136, 326, '之后的计算', 'wash', 't') +
    blk(120, 176, 230, '还在做别的', 'wash2', 'ts') + blk(352, 176, 56, 'Recv', 'wash-strong', 't') + arrow(176, 146, 356, 166, 'ln-dash', 6) + text(414, 168, '← data 从 system buffer 送来', 'ts', 'start'));
  panel(210, 'non-blocking（MPI_Isend … MPI_Wait）',
    blk(120, 236, 40, 'Isend') + blk(164, 236, 230, '计算，同时 data 在传', 'wash', 't') + blk(398, 236, 48, 'Wait') + blk(450, 236, 60, '之后', 'wash', 't') +
    blk(120, 276, 36, 'Irecv', 'wash-strong', 't') + blk(160, 276, 200, '计算', 'wash2', 'ts') + blk(364, 276, 48, 'Wait', 'wash-strong', 't') + arrow(164, 245, 300, 266, 'ln', 6));
  return svg(560, 300, o, '三组时间线。synchronous send 一直 block 到 receiver 调用 Recv；buffered send 拷进 buffer 后马上返回；non-blocking 的 Isend 立即返回，计算和传输重叠，Wait 时确认完成');
}

// ---------- 第 8 站：ring 的两种修法（动图） ----------
function ringfixA() {
  const T = 8, kt = [0, 0.08, 0.3, 0.52, 0.74, 1];
  // 帧：0 全显示；1 清空；2..5 第 1..4 轮之后
  let o = '';
  const panel = (cx, title, msgs) => {
    const R = 64, pos = (r) => { const a = Math.PI / 2 - r * Math.PI / 2; return [cx + R * 1.25 * Math.cos(a), 150 - R * Math.sin(a)]; };
    o += text(cx, 24, title, 'tb', 'middle');
    msgs.forEach(([a, b, round]) => {
      const [x1, y1] = pos(a), [x2, y2] = pos(b), L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
      const nx = -uy * 9, ny = ux * 9;
      const on = [true, false, ...[1, 2, 3, 4].map((k) => k >= round)];
      const mx = (x1 + x2) / 2 + nx * 2.2, my = (y1 + y2) / 2 + ny * 2.2;
      o += show(arrow(x1 + ux * 26 + nx, y1 + uy * 22 + ny, x2 - ux * 26 + nx, y2 - uy * 22 + ny, 'ln') + circle(mx, my, 9, 'paper') + text(mx, my + 4.5, String(round), 'tl', 'middle'), on, kt, T);
    });
    for (let r = 0; r < 4; r++) { const [x, y] = pos(r); o += box(x - 24, y - 15, 48, 30, 'rank ' + r, 'paper', 'ts'); }
  };
  panel(140, '奇偶交错：2 轮', [[0, 3, 1], [2, 1, 1], [1, 0, 2], [3, 2, 2]]);
  panel(420, '最后一个 rank 反过来：4 轮', [[0, 3, 1], [1, 0, 2], [2, 1, 3], [3, 2, 4]]);
  o += text(280, 262, '圈里的数字是这个 message 在第几轮完成', 'ts', 'middle');
  return svgA(560, 272, o, '动图：4 个 rank 向左发 message 的两种修法。奇偶交错时第 1 轮完成 0 到 3、2 到 1，第 2 轮完成 1 到 0、3 到 2；最后一个 rank 反过来时每轮只完成一个，共 4 轮');
}

// ---------- 第 8 站：collective ----------
function coll() {
  const ops = [
    ['Bcast', [['A'], [], [], []], [['A'], ['A'], ['A'], ['A']]],
    ['Scatter', [['A0', 'A1', 'A2', 'A3'], [], [], []], [['A0'], ['A1'], ['A2'], ['A3']]],
    ['Gather', [['A'], ['B'], ['C'], ['D']], [['A', 'B', 'C', 'D'], [], [], []]],
    ['Allgather', [['A'], ['B'], ['C'], ['D']], [['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D'], ['A', 'B', 'C', 'D']]],
    ['Reduce', [['A'], ['B'], ['C'], ['D']], [['Σ'], [], [], []]],
    ['Allreduce', [['A'], ['B'], ['C'], ['D']], [['Σ'], ['Σ'], ['Σ'], ['Σ']]],
    ['Alltoall', [['A0', 'A1', 'A2', 'A3'], ['B0', 'B1', 'B2', 'B3'], ['C0', 'C1', 'C2', 'C3'], ['D0', 'D1', 'D2', 'D3']], [['A0', 'B0', 'C0', 'D0'], ['A1', 'B1', 'C1', 'D1'], ['A2', 'B2', 'C2', 'D2'], ['A3', 'B3', 'C3', 'D3']]],
    ['Scan', [['A'], ['B'], ['C'], ['D']], [['A'], ['A+B'], ['A+B+C'], ['A..D']]],
  ];
  const cw = 22, ch = 15;
  let o = '';
  const grid = (x, y, G, wide) => {
    let q = '';
    for (let r = 0; r < 4; r++) for (let k = 0; k < (wide ? 1 : 4); k++) {
      const v = G[r][k];
      const w = wide ? 4 * cw : cw;
      q += rect(x + k * cw, y + r * ch, w - 1, ch - 1, v ? 'wash' : 'frame', 1);
      if (v) q += `<text x="${f1(x + k * cw + w / 2)}" y="${f1(y + r * ch + 11)}" class="ts" text-anchor="middle" style="font-size:10.5px">${v}</text>`;
    }
    return q;
  };
  ops.forEach(([name, before, after], j) => {
    const x0 = 14 + (j % 2) * 276, y0 = 30 + Math.floor(j / 2) * 82;
    o += text(x0, y0 - 8, name, 'tb', 'start');
    if (j % 2 === 0) for (let r = 0; r < 4; r++) o += text(x0 + 2, y0 + r * ch + 11, String(r), 'ts', 'start');
    o += grid(x0 + 14, y0, before, false);
    o += arrow(x0 + 14 + 4 * cw + 8, y0 + 2 * ch, x0 + 14 + 4 * cw + 34, y0 + 2 * ch, 'ink', 6);
    o += grid(x0 + 14 + 4 * cw + 42, y0, after, name === 'Scan');
  });
  o += text(280, 354, '每个小格子的 4 行是 rank 0 到 3；左边是调用前，右边是调用后；Σ = A + B + C + D', 'ts', 'middle');
  return svg(560, 362, o, '八个 collective 的 data 移动：Bcast、Scatter、Gather、Allgather、Reduce、Allreduce、Alltoall、Scan，每个都画出 4 个 rank 在调用前后的 buffer');
}

// ---------- 第 8 站：recursive doubling broadcast（动图） ----------
function btreeA() {
  const T = 7, kt = [0, 0.1, 0.32, 0.54, 0.76, 1];
  const xs = (r) => 46 + r * 66, Y = 170;
  const recv = { 0: 0, 4: 1, 2: 2, 6: 2, 1: 3, 3: 3, 5: 3, 7: 3 };
  const msgs = [[0, 4, 1], [0, 2, 2], [4, 6, 2], [0, 1, 3], [2, 3, 3], [4, 5, 3], [6, 7, 3]];
  let o = '';
  msgs.forEach(([a, b, k]) => {
    const h = [0, 110, 66, 34][k];
    const x1 = xs(a), x2 = xs(b), mx = (x1 + x2) / 2;
    const on = [true, false, ...[1, 2, 3].map((q) => q >= k), true];
    o += show(path(`M${f1(x1)} ${f1(Y - 18)}Q${f1(mx)} ${f1(Y - 18 - h * 1.6)} ${f1(x2 - 2)} ${f1(Y - 20)}`, 'ln') + poly([[x2 - 1, Y - 19], [x2 - 9, Y - 27], [x2 - 11, Y - 18]], 'ln-f') + circle(mx, Y - 18 - h * 0.8, 9, 'paper') + text(mx, Y - 18 - h * 0.8 + 4.5, String(k), 'tl', 'middle'), on, kt, T);
  });
  for (let r = 0; r < 8; r++) {
    const k = recv[r];
    const on = [true, true, ...[1, 2, 3].map((q) => q >= k), true];
    o += rect(xs(r) - 24, Y - 16, 48, 32, 'paper', 4) + show(rect(xs(r) - 24, Y - 16, 48, 32, 'wash-strong', 4), on.map((v, i) => (i === 1 ? k === 0 : v)), kt, T);
    o += text(xs(r), Y + 5, 'rank ' + r, 'ts', 'middle');
  }
  o += text(280, 212, '圈里的数字是第几轮；有 data 的 rank：1 → 2 → 4 → 8', 'ts', 'middle');
  return svgA(560, 222, o, '动图：8 个 rank 的 recursive doubling broadcast。第 1 轮 rank 0 发给 4，第 2 轮 0 发给 2、4 发给 6，第 3 轮 0、2、4、6 分别发给 1、3、5、7');
}

// ---------- 第 8 站：Cartesian topology ----------
function cart() {
  const c = 70, X0 = 110, Y0 = 56;
  let o = '';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) {
    const rank = 4 * r + k, hot = rank === 5, nb = [1, 9, 4, 6].includes(rank);
    o += rect(X0 + k * c, Y0 + r * 52, c - 8, 44, hot ? 'solid' : nb ? 'wash-strong' : 'paper', 4);
    o += text(X0 + k * c + (c - 8) / 2, Y0 + r * 52 + 19, String(rank), hot ? 'tw' : 'tb', 'middle');
    o += text(X0 + k * c + (c - 8) / 2, Y0 + r * 52 + 36, `(${r}, ${k})`, hot ? 'tw' : 'ts', 'middle');
  }
  o += text(X0 + 2 * c - 4, 18, 'dims = {4, 4}，periods = {0, 0}', 'ts', 'middle');
  o += arrow(X0 + 31, Y0 - 2, X0 + 31, Y0 - 24, 'dash', 5) + text(X0 + 38, Y0 - 14, 'up = −2', 'ts', 'start');
  o += arrow(X0 - 2, Y0 + 22, X0 - 30, Y0 + 22, 'dash', 5) + text(X0 - 34, Y0 + 27, 'left = −2', 'ts', 'end');
  const R = X0 + 4 * c + 4;
  o += text(R, Y0 + 52 + 14, 'rank 5 的邻居', 'tb', 'start') + text(R, Y0 + 52 + 32, 'up 1、down 9', 'ts', 'start') + text(R, Y0 + 52 + 48, 'left 4、right 6', 'ts', 'start');
  o += text(R, Y0 + 52 * 3 - 4, '−2 是', 'ts', 'start') + text(R, Y0 + 52 * 3 + 12, 'MPI_PROC_NULL', 'ts', 'start');
  return svg(560, 268, o, '4 乘 4 的 Cartesian grid，每格写着 rank 和 coordinate。rank 5 在坐标 (1,1)，邻居 1、9、4、6 用浅色标出；rank 0 往上、往左得到 MPI_PROC_NULL，值是负 2');
}

export default {
  'cs3210-threads': threads,
  'cs3210-looporder': looporder,
  'cs3210-ring': ring,
  'cs3210-bcast0': bcast0,
  'cs3210-slots': slots,
  'cs3210-memorg': memorg,
  'cs3210-sched': sched,
  'cs3210-dag': dag,
  'cs3210-agglom': agglom,
  'cs3210-dist': dist,
  'cs3210-pipe': pipe,
  'cs3210-sumtree': sumtree,
  'cs3210-gustafson': gustafson,
  'cs3210-energy': energy,
  'cs3210-invupd': invupd,
  'cs3210-dir': dir,
  'cs3210-pc': pcA,
  'cs3210-coalesce': coalesce,
  'cs3210-bank': bank,
  'cs3210-topo': topo,
  'cs3210-omega': omega,
  'cs3210-xy': xyA,
  'cs3210-turns': turns,
  'cs3210-switching': switching,
  'cs3210-shear': shearA,
  'cs3210-sendmodes': sendmodes,
  'cs3210-ringfix': ringfixA,
  'cs3210-coll': coll,
  'cs3210-btree': btreeA,
  'cs3210-cart': cart,
};
