import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 共用：Mandelbrot（与 asst1 prog1 相同的 float 运算） ----------
const F = Math.fround;
function mandel(cre, cim, count) {
  let zr = cre, zi = cim, i;
  for (i = 0; i < count; ++i) {
    if (F(F(zr * zr) + F(zi * zi)) > 4) break;
    const nr = F(F(zr * zr) - F(zi * zi)), ni = F(F(2 * zr) * zi);
    zr = F(cre + nr); zi = F(cim + ni);
  }
  return i;
}
const MW = 1600, MH = 1200, MX0 = -2, MX1 = 1, MY0 = -1, MY1 = 1;
const MDX = F((MX1 - MX0) / MW), MDY = F((MY1 - MY0) / MH);
const mpix = (i, j) => mandel(F(MX0 + F(i * MDX)), F(MY0 + F(j * MDY)), 256);
let rowCostCache = null;
function rowCost() {
  if (rowCostCache) return rowCostCache;
  const r = [];
  for (let j = 0; j < MH; j++) { let s = 0; for (let i = 0; i < MW; i++) s += mpix(i, j); r.push(s); }
  rowCostCache = r;
  return r;
}

// ---------- 第 1 站：SIMD 上的 if/else，一条 instruction 一条 instruction 地走（动图） ----------
function simdA() {
  const xs = [2.1, 0.7, -1.3, 0.4, -0.2, -3.0, -0.6, -1.1];
  const T = xs.map((x) => x > 0);
  const code = [
    ['float x = A[i];', 'all'],
    ['if (x > 0) {', 'all'],
    ['  float tmp = exp(x, 5.f);', 'T'],
    ['  tmp *= kMyConst1;', 'T'],
    ['  x = tmp + kMyConst2;', 'T'],
    ['} else {', null],
    ['  float tmp = kMyConst1;', 'F'],
    ['  x = 2.f * tmp;', 'F'],
    ['}', null],
    ['result[i] = x;', 'all'],
  ];
  const L0 = 262, cw = 30, top = 62, rh = 24;
  let o = text(12, 20, 'ISPC/CUDA 里一个 program instance 的代码', 'tb') + text(L0 + 4 * cw, 20, '8 条 SIMD lane', 'tb', 'middle');
  o += text(L0 - 8, 44, 'x =', 'ts', 'end');
  xs.forEach((x, k) => { o += text(L0 + k * cw + cw / 2, 44, (x < 0 ? '−' : '') + Math.abs(x).toFixed(1), 'ts', 'middle'); });
  // 每一行
  const steps = [];
  let used = 0, slots = 0;
  code.forEach(([s, who], r) => {
    const y = top + r * rh;
    o += `<text x="12" y="${y + 16}" class="t" text-anchor="start">${s.replace(/ /g, '&#160;')}</text>`;
    if (!who) return;
    steps.push(r);
    let n = 0;
    xs.forEach((x, k) => {
      const on = who === 'all' || (who === 'T' ? T[k] : !T[k]);
      if (on) n++;
      o += rect(L0 + k * cw + 2, y + 3, cw - 4, rh - 6, on ? 'solid' : 'wash2', 2);
    });
    used += n; slots += 8;
    o += text(L0 + 8 * cw + 8, y + 16, n + '/8', n === 8 ? 'ts' : 'tl', 'start');
  });
  // 动：当前 instruction 的框
  const dur = 9.6, kt = [], ys = [];
  steps.forEach((r, i) => { kt.push(i / steps.length); ys.push(top + r * rh); });
  kt.push(1); ys.push(top + steps[steps.length - 1] * rh);
  o += `<rect x="6" y="${ys[0]}" width="${L0 + 8 * cw + 40}" height="${rh}" rx="3" class="frame" style="stroke-width:2">${anim('y', ys.map(f1), kt, dur, true)}</rect>`;
  const yb = top + code.length * rh + 22;
  o += text(12, yb, `masked 的 lane（灰）这一拍什么也不做。8 条 instruction × 8 条 lane = ${slots} 个 slot，`, 'ts');
  o += text(12, yb + 17, `实际用上 ${used} 个，utilization ${(used / slots * 100).toFixed(0)}%。两条 branch 是先后执行的，不是同时。`, 'ts');
  return svgA(560, yb + 26, o, `动图：8 条 SIMD lane 执行带 if/else 的代码，框逐条下移；then 分支只有 3 条 lane 工作，else 分支只有 5 条，utilization ${(used / slots * 100).toFixed(0)}%`);
}

// ---------- 第 1 站：multithreading 隐藏 latency ----------
function mthread() {
  const C = 3, Lat = 12, P = C + Lat, X0 = 96, sx = lin(0, 30, X0, 546);
  let o = '';
  const cases = [1, 2, 5];
  let y = 26;
  o += text(X0, 14, '每个 thread：3 条 arithmetic，然后一个 load 要等 12 个 cycle', 'ts');
  for (const n of cases) {
    o += text(10, y + 12, n + ' 个 thread', 'tb');
    for (let t = 0; t < n; t++) {
      const yy = y + 18 + t * 15;
      o += text(X0 - 6, yy + 10, 'T' + t, 'ts', 'end');
      for (let start = t * C; start < 30; start += P) {
        o += rect(sx(start), yy, sx(start + C) - sx(start), 11, 'solid');
        const e = Math.min(start + P, 30);
        if (start + C < 30) o += rect(sx(start + C), yy + 3, sx(e) - sx(start + C), 5, 'wash2');
      }
    }
    const yc = y + 18 + n * 15 + 2;
    o += text(X0 - 6, yc + 10, 'core', 'ts', 'end');
    o += rect(sx(0), yc, sx(30) - sx(0), 11, 'frame');
    let busy = 0;
    for (let c = 0; c < 30; c++) {
      const on = Array.from({ length: n }, (_, t) => t).some((t) => { const ph = (((c - t * C) % P) + P) % P; return c >= t * C && ph < C; });
      if (on) { busy++; o += rect(sx(c), yc, sx(c + 1) - sx(c), 11, 'ink-f'); }
    }
    o += text(546, y + 12, `core utilization ${Math.min(100, (n * C / P) * 100).toFixed(0)}%`, 'tl', 'end');
    y = yc + 26;
  }
  for (const c of [0, 15, 30]) o += line(sx(c), y - 6, sx(c), y - 2, 'axis') + text(sx(c), y + 10, String(c), 'ts', 'middle');
  o += text(546, y + 24, 'cycle', 'ts', 'end');
  o += rect(X0, y + 16, 12, 8, 'solid') + text(X0 + 16, y + 24, '在 issue instruction', 'ts');
  o += rect(X0 + 140, y + 18, 12, 5, 'wash2') + text(X0 + 156, y + 24, '等 memory', 'ts');
  return svg(560, y + 30, o, '1、2、5 个 hardware thread 交替执行时 core 的 utilization：20%、40%、100%');
}

// ---------- 第 2 站：interleaved 与 blocked 的 assignment，一次 load 碰到哪些 address ----------
function gang() {
  const n = 32, cw = 16, X0 = 20;
  let o = '';
  const panel = (y, title, owner, hit, note1, note2) => {
    o += text(X0, y, title, 'tb');
    // cache line 括号
    for (let l = 0; l < 2; l++) {
      const a = X0 + l * 16 * cw, b = a + 16 * cw;
      o += line(a + 1, y + 30, b - 1, y + 30, 'mute') + line(a + 1, y + 26, a + 1, y + 34, 'mute') + line(b - 1, y + 26, b - 1, y + 34, 'mute');
      o += text((a + b) / 2, y + 24, `cache line ${l}（64 byte = 16 个 float）`, 'ts', 'middle');
    }
    for (let k = 0; k < n; k++) {
      const x = X0 + k * cw;
      o += rect(x, y + 38, cw, 22, hit(k) ? 'solid' : 'paper');
      o += text(x + cw / 2, y + 54, String(owner(k)), hit(k) ? 'tw' : 'ts', 'middle');
      if (k % 4 === 0) o += text(x + 2, y + 74, String(k), 'ts', 'start');
    }
    o += text(X0, y + 94, note1, 't') + text(X0, y + 112, note2, 'ts');
  };
  panel(16, 'Interleaved：instance i 处理 i、i+8、i+16、…', (k) => k % 8, (k) => k < 8,
    '第一次 load：8 条 lane 要的是 element 0–7，连续的 32 byte，', '一条 packed load（vmovaps），只碰 cache line 0。');
  panel(156, 'Blocked：instance i 处理 4i 到 4i+3', (k) => Math.floor(k / 4), (k) => k % 4 === 0,
    '第一次 load：8 条 lane 要的是 element 0、4、8、…、28，', '跨两条 cache line，只能用 gather（vgatherdps）逐个取。');
  o += text(X0, 296, '格子里的数字是负责这个 element 的 programIndex；深色是第一次 load 要读的 element。', 'ts');
  return svg(560, 302, o, '32 个 float 由 8 个 program instance 处理：interleaved 时一次 load 读连续的 8 个，blocked 时一次 load 读间隔为 4 的 8 个');
}

// ---------- 第 3 站：Mandelbrot 每段 row 的工作量，以及 3 个 thread 的分法 ----------
function mandelImb() {
  const r = rowCost(), tot = r.reduce((a, b) => a + b, 0);
  const B = 40, band = [];
  for (let k = 0; k < B; k++) { let s = 0; for (let j = k * 30; j < (k + 1) * 30; j++) s += r[j]; band.push(s); }
  const mx = Math.max(...band);
  const top = 34, bh = 5.5, X0 = 70, sx = lin(0, mx, X0, 250);
  let o = text(10, 16, 'View 1 每 30 个 row 的 iteration 总数', 'tb');
  band.forEach((s, k) => { o += rect(X0, top + k * bh, sx(s) - X0, bh - 1, 'wash-strong'); });
  // 3 个 thread 的 blocked 边界
  const share3 = [0, 1, 2].map((t) => { let s = 0; for (let j = t * 400; j < (t + 1) * 400; j++) s += r[j]; return s / tot; });
  for (let t = 0; t <= 3; t++) {
    const y = top + t * (B / 3) * bh - 0.5;
    o += line(X0 - 56, y, 258, y, t === 0 || t === 3 ? 'axis' : 'ink-b');
  }
  for (let t = 0; t < 3; t++) {
    const yc = top + (t + 0.5) * (B / 3) * bh;
    o += text(X0 - 8, yc - 2, 'thread ' + t, 'ts', 'end') + text(X0 - 8, yc + 12, (share3[t] * 100).toFixed(1) + '%', t === 1 ? 'tl' : 'ts', 'end');
  }
  o += text(X0 - 56, top + B * bh + 18, 'row 0（上）到 row 1199（下），', 'ts') + text(X0 - 56, top + B * bh + 34, '每个 thread 400 个 row', 'ts');
  // 右：各 thread 用时
  const X1 = 330, bw = 26, base = 230, sy = lin(0, 0.62, base, 50);
  const il = [0, 0, 0]; r.forEach((s, j) => { il[j % 3] += s; });
  const shareI = il.map((s) => s / tot);
  o += text(X1, 16, '三个 thread 各自的工作量（占总量）', 'tb');
  const group = (x0, shares, label, sp) => {
    shares.forEach((s, t) => {
      const x = x0 + t * (bw + 6);
      o += rect(x, sy(s), bw, base - sy(s), t === shares.indexOf(Math.max(...shares)) ? 'solid' : 'wash-strong');
      o += text(x + bw / 2, sy(s) - 5, (s * 100).toFixed(1), 'ts', 'middle');
      o += text(x + bw / 2, base + 14, 'T' + t, 'ts', 'middle');
    });
    o += text(x0 + 1.5 * bw + 6, base + 32, label, 't', 'middle');
    o += text(x0 + 1.5 * bw + 6, base + 48, 'speedup ≤ ' + sp.toFixed(2), 'tl', 'middle');
  };
  group(X1, share3, 'blocked', 1 / Math.max(...share3));
  group(X1 + 120, shareI, 'interleaved', 1 / Math.max(...shareI));
  o += line(X1 - 6, sy(1 / 3), X1 + 222, sy(1 / 3), 'dash') + text(X1 - 10, sy(1 / 3) + 4, '⅓', 'ts', 'end');
  o += line(X1 - 6, base, X1 + 230, base, 'axis');
  return svg(560, 290, o, `Mandelbrot view 1 的工作集中在中间的 row；3 个 thread 按 blocked 分，中间的 thread 拿到 ${(share3[1] * 100).toFixed(1)}%，speedup 上限 ${(1 / Math.max(...share3)).toFixed(2)}；按 row interleaved 分，每个约三分之一`);
}

// ---------- 第 4 站：grid solver 的两种分法，要收多少 ghost cell ----------
function grid() {
  const N = 16, c = 11;
  let o = '';
  const panel = (x0, title, mine, ghost, note1, note2) => {
    const y0 = 34;
    o += text(x0 + N * c / 2, 16, title, 'tb', 'middle');
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const cls = mine(i, j) ? 'solid' : ghost(i, j) ? 'wash-strong' : 'paper';
      o += rect(x0 + j * c, y0 + i * c, c, c, cls);
    }
    o += text(x0 + N * c / 2, y0 + N * c + 20, note1, 't', 'middle') + text(x0 + N * c / 2, y0 + N * c + 37, note2, 'ts', 'middle');
  };
  // 1D blocked, P=16：每个 processor 1 个 row；看 processor 6（row 6）
  panel(30, '1D blocked：16 个 processor 各拿 1 个 row', (i) => i === 6, (i) => i === 5 || i === 7,
    '算 16 个 cell，要收 32 个', 'communication / computation = 2');
  // 2D blocked 4×4，看 block (1,1)
  const inB = (i, j) => i >= 4 && i < 8 && j >= 4 && j < 8;
  const gh = (i, j) => !inB(i, j) && ((i === 3 || i === 8) && j >= 4 && j < 8 || (j === 3 || j === 8) && i >= 4 && i < 8);
  panel(320, '2D blocked：16 个 processor 各拿 4×4', inB, gh,
    '算 16 个 cell，要收 16 个', 'communication / computation = 1');
  o += rect(30, 276, 12, 10, 'solid') + text(46, 285, '一个 processor 负责更新的 cell', 'ts');
  o += rect(250, 276, 12, 10, 'wash-strong') + text(266, 285, '每轮 iteration 要从别的 processor 收来的 ghost cell', 'ts');
  return svg(560, 292, o, '16×16 的 grid 分给 16 个 processor：按 row 分时每个 processor 算 16 个 cell 要收 32 个邻居；按 4×4 的 block 分时只要收 16 个');
}

// ---------- 第 5 站：1D convolution 的一个 thread block，以及它在 core 上占多少资源 ----------
function conv() {
  let o = text(10, 16, '一个 thread block：128 个 thread，各算一个 output[i] = (in[i] + in[i+1] + in[i+2]) / 3', 'tb');
  const X0 = 20, w = 520 / 130;
  // input 130 个
  o += text(X0, 42, 'global memory 里的 input：这个 block 要 130 个', 'ts');
  o += rect(X0, 48, 130 * w, 14, 'wash-strong');
  o += rect(X0 + 128 * w, 48, 2 * w, 14, 'solid');
  o += text(X0 + 130 * w + 6, 59, '+2', 'tl');
  o += arrow(X0 + 30 * w, 64, X0 + 30 * w, 84, 'ink');
  o += text(X0 + 30 * w + 8, 79, '每个 thread 搬 1 个，前 2 个多搬 1 个；然后 __syncthreads()', 'ts');
  o += rect(X0, 88, 130 * w, 14, 'paper');
  o += text(X0 + 4, 99, '__shared__ float support[130]（520 byte）', 'ts');
  // 一个 output 读 3 个
  const k = 96;
  for (let t = 0; t < 3; t++) o += rect(X0 + (k + t) * w, 88, w, 14, 'ink-f') + line(X0 + (k + t + 0.5) * w, 102, X0 + (k + 0.5) * w, 124, 'ink');
  o += rect(X0 + k * w, 124, w, 14, 'ink-f');
  o += rect(X0, 124, 128 * w, 14, 'wash');
  o += text(X0 + 4, 135, 'output：128 个，每个从 shared memory 读 3 个', 'ts');
  o += text(X0, 160, '不用 shared memory：128 × 3 = 384 次 global load；用了：130 次。', 't');
  // core 资源
  const y0 = 186;
  o += text(10, y0, '一个虚构的 GPU core：12 个 warp 的 context（384 个 thread），1.5 KB shared memory', 'tb');
  const wx = 20, ww = 26;
  o += text(wx, y0 + 24, 'warp context', 'ts');
  for (let i = 0; i < 12; i++) {
    const blk = Math.floor(i / 4);
    o += rect(wx + i * (ww + 3), y0 + 30, ww, 22, blk < 2 ? 'solid' : 'paper', 2);
  }
  for (const blk of [0, 1]) o += text(wx + (4 * blk + 2) * (ww + 3) - 1.5, y0 + 66, 'block ' + blk + ' 的 4 个 warp', 'ts', 'middle');
  o += text(wx + 10 * (ww + 3) - 1.5, y0 + 66, '空着', 'ts', 'middle');
  const sx = lin(0, 1536, wx, wx + 348);
  o += text(wx, y0 + 84, 'shared memory（byte）', 'ts');
  o += rect(sx(0), y0 + 90, sx(1536) - sx(0), 22, 'paper');
  o += rect(sx(0), y0 + 90, sx(520) - sx(0) - 1, 22, 'solid') + text((sx(0) + sx(520)) / 2, y0 + 105, 'block 0：520', 'tw', 'middle');
  o += rect(sx(520) + 1, y0 + 90, sx(1040) - sx(520) - 1, 22, 'solid') + text((sx(520) + sx(1040)) / 2, y0 + 105, 'block 1：520', 'tw', 'middle');
  o += text((sx(1040) + sx(1536)) / 2, y0 + 105, '剩 496 < 520', 'tl', 'middle');
  for (const v of [0, 520, 1040, 1536]) o += text(sx(v), y0 + 126, String(v), 'ts', 'middle');
  o += text(390, y0 + 40, 'thread 数允许 3 个 block，', 'ts') + text(390, y0 + 56, 'shared memory 只允许 2 个。', 'ts');
  o += text(390, y0 + 96, '第 3 个 block 要等前面', 'ts') + text(390, y0 + 112, '某个 block 结束才能上。', 'ts');
  return svg(560, y0 + 134, o, '1D convolution 的 thread block 先把 130 个 input 搬进 shared memory，再各自读 3 个；一个 block 占 4 个 warp 和 520 byte，因此 1.5 KB 的 core 上同时只能放 2 个 block');
}

// ---------- 第 5 站：warp divergence，32 条 lane 各自的 loop 次数（动图） ----------
function warpA() {
  const j = 225, i0 = 800;
  const cnt = Array.from({ length: 32 }, (_, k) => mpix(i0 + k, j));
  const mx = Math.max(...cnt), sum = cnt.reduce((a, b) => a + b, 0);
  const X0 = 46, lw = 15, base = 236, sy = lin(0, mx, base, 54);
  let o = text(10, 16, `一个 warp = view 1 第 ${j} 个 row 上相邻的 32 个 pixel（第 ${i0}–${i0 + 31} 个）`, 'tb');
  o += text(10, 34, '每条 lane 跑自己的 while loop，柱高是它的 iteration 次数；warp 要等最慢的那条退出', 'ts');
  const dur = 8, kt0 = 0.14, kt1 = 0.16, kt2 = 0.9;
  const tAt = (c) => kt1 + (kt2 - kt1) * (c / mx);
  cnt.forEach((c, k) => {
    const x = X0 + k * lw;
    o += rect(x + 1, sy(mx), lw - 2, base - sy(mx), 'wash2');
    const yTop = sy(c);
    const kt = [0, kt0, kt1, tAt(c), 1];
    const ys = [yTop, yTop, base, yTop, yTop].map(f1);
    const hs = [base - yTop, base - yTop, 0, base - yTop, base - yTop].map(f1);
    o += `<rect x="${f1(x + 1)}" y="${f1(yTop)}" width="${lw - 2}" height="${f1(base - yTop)}" class="solid">${anim('y', ys, kt, dur)}${anim('height', hs, kt, dur)}</rect>`;
    if (c === mx || k % 4 === 0) o += text(x + lw / 2, base + 14, String(c), c === mx ? 'tl' : 'ts', 'middle');
  });
  // 扫描线
  const kts = [0, kt0, kt1, kt2, 1], yl = [sy(mx), sy(mx), base, sy(mx), sy(mx)];
  o += `<line x1="${X0 - 4}" x2="${X0 + 32 * lw + 4}" y1="${f1(yl[0])}" y2="${f1(yl[0])}" class="ln">${anim('y1', yl.map(f1), kts, dur)}${anim('y2', yl.map(f1), kts, dur)}</line>`;
  for (const v of [0, 20, 40, 60, 80]) if (v <= mx) o += line(X0 - 6, sy(v), X0 - 2, sy(v), 'axis') + text(X0 - 9, sy(v) + 4, String(v), 'ts', 'end');
  o += text(X0, base + 34, `深色：lane 在做有用的 iteration，共 ${sum} 次；灰色：已经退出、被 mask 掉但仍占着 slot。`, 'ts');
  o += text(X0, base + 51, `warp 发出 ${mx} 轮 instruction，每轮 32 条 lane：utilization = ${sum} / (32 × ${mx}) = ${(sum / 32 / mx * 100).toFixed(1)}%。`, 'ts');
  return svgA(560, base + 58, o, `动图：一个 warp 的 32 条 lane 各自 loop 不同次数，最多 ${mx} 次；先退出的 lane 被 mask 掉，utilization ${(sum / 32 / mx * 100).toFixed(1)}%`);
}

// ---------- 第 5 站：work-efficient exclusive scan ----------
function scan() {
  const a = [3, 8, 4, 6, 3, 9, 2, 8], N = 8;
  const rows = [{ v: a.slice(), label: 'input', hl: [] }];
  const o2 = a.slice(), arrows = [];
  for (let dd = 1; dd <= N / 2; dd *= 2) {
    const ar = [];
    for (let i = 0; i < N; i += 2 * dd) { o2[i + 2 * dd - 1] += o2[i + dd - 1]; ar.push([i + dd - 1, i + 2 * dd - 1, 'add']); }
    rows.push({ v: o2.slice(), label: 'upsweep d=' + dd, hl: ar.map((x) => x[1]), ar });
  }
  o2[N - 1] = 0; rows.push({ v: o2.slice(), label: '最后一个置 0', hl: [N - 1], ar: [] });
  for (let dd = N / 2; dd >= 1; dd /= 2) {
    const ar = [];
    for (let i = 0; i < N; i += 2 * dd) {
      const t = o2[i + dd - 1]; o2[i + dd - 1] = o2[i + 2 * dd - 1]; o2[i + 2 * dd - 1] += t;
      ar.push([i + dd - 1, i + 2 * dd - 1, 'swap']);
    }
    rows.push({ v: o2.slice(), label: 'downsweep d=' + dd, hl: ar.flatMap((x) => [x[0], x[1]]), ar });
  }
  const X0 = 150, cw = 44, rh = 34, top = 24;
  let o = text(X0 + 4 * cw, 14, 'exclusive scan of [3, 8, 4, 6, 3, 9, 2, 8]', 'tb', 'middle');
  rows.forEach((r, k) => {
    const y = top + k * rh;
    o += text(X0 - 12, y + 17, r.label, k === 0 || k === rows.length - 1 ? 'tb' : 'ts', 'end');
    r.v.forEach((v, i) => {
      const hl = r.hl.includes(i);
      o += rect(X0 + i * cw + 3, y, cw - 6, 22, hl ? 'solid' : 'paper', 3) + text(X0 + i * cw + cw / 2, y + 16, String(v), hl ? 'tw' : 't', 'middle');
    });
    if (k > 0 && r.ar) for (const [s, t2, kind] of r.ar) {
      const ys = y - rh + 22, ye = y;
      o += line(X0 + s * cw + cw / 2, ys, X0 + t2 * cw + cw / 2 - 4, ye - 1, 'mute');
      if (kind === 'swap') o += line(X0 + t2 * cw + cw / 2, ys, X0 + s * cw + cw / 2 + 4, ye - 1, 'mute');
    }
  });
  const yb = top + rows.length * rh + 6;
  o += text(X0 - 140, yb, 'Upsweep 每层把左边的部分和加到右边（共 4+2+1 = 7 次加法）；downsweep 每层', 'ts');
  o += text(X0 - 140, yb + 17, '左边拿右边的旧值、右边加上左边的旧值（又 7 次）。同一层的各对互不相干，可以同时做。', 'ts');
  return svg(560, yb + 24, o, '8 个元素的 work-efficient exclusive scan：三层 upsweep，把最后一个置零，三层 downsweep，得到 0 3 11 15 21 24 33 35');
}

// ---------- 第 6 站：MSI protocol 走一遍（动图） ----------
function msiA() {
  const steps = [
    { act: 'P1 read x', bus: 'BusRd', from: 'memory', st: ['S', '–', '–'], val: ['0', '', ''], mem: '0', edges: [['I', 'S', 0]], src: 'M', dst: [0] },
    { act: 'P3 read x', bus: 'BusRd', from: 'memory', st: ['S', '–', 'S'], val: ['0', '', '0'], mem: '0', edges: [['I', 'S', 2]], src: 'M', dst: [2] },
    { act: 'P3 write x = 1', bus: 'BusRdX', from: 'memory', st: ['I', '–', 'M'], val: ['', '', '1'], mem: '0', edges: [['S', 'M', 2], ['S', 'I', 0]], src: 'M', dst: [2] },
    { act: 'P1 read x', bus: 'BusRd（P3 回 BusWB）', from: 'P3 的 cache', st: ['S', '–', 'S'], val: ['1', '', '1'], mem: '1', edges: [['I', 'S', 0], ['M', 'S', 2]], src: 2, dst: [0] },
    { act: 'P2 write x = 2', bus: 'BusRdX', from: 'memory', st: ['I', 'M', 'I'], val: ['', '2', ''], mem: '1', edges: [['I', 'M', 1], ['S', 'I', 0], ['S', 'I', 2]], src: 'M', dst: [1] },
  ];
  const n = steps.length, hold = 2.4, dur = n * hold;
  const kt = [...steps.map((_, i) => i / n), 1];
  const on = (i) => [...steps.map((_, k) => k === i), i === n - 1];
  let o = '';
  // 上半：三个 processor、bus、memory
  const PX = [70, 200, 330], PY = 30, BUSY = 132;
  o += text(10, 16, 'x 一开始在 memory 里，值为 0', 'ts');
  PX.forEach((x, p) => {
    o += rect(x - 46, PY, 92, 30, 'paper', 4) + text(x, PY + 20, 'P' + (p + 1), 'tb', 'middle');
    o += rect(x - 46, PY + 40, 92, 34, 'wash', 3) + text(x - 40, PY + 52, 'cache 里的 x', 'ts');
    o += line(x, PY + 74, x, BUSY, 'ink');
    steps.forEach((s, i) => {
      const lab = s.st[p] === '–' ? '（没有）' : s.st[p] + (s.val[p] ? '，值 ' + s.val[p] : '');
      const req = s.dst.includes(p);
      o += `<text x="${x}" y="${PY + 68}" class="${req ? 'tl' : 't'}" text-anchor="middle">${lab}${ashow(on(i), kt, dur)}</text>`;
    });
  });
  o += line(20, BUSY, 470, BUSY, 'ink-b') + text(22, BUSY - 6, 'bus', 'ts');
  o += rect(400, PY + 40, 120, 34, 'paper', 3) + text(460, PY + 54, 'memory', 'ts', 'middle') + line(460, PY + 74, 460, BUSY, 'ink');
  steps.forEach((s, i) => {
    o += `<text x="460" y="${PY + 69}" class="t" text-anchor="middle">x = ${s.mem}${ashow(on(i), kt, dur)}</text>`;
    o += `<g>${text(400, 18, `第 ${i + 1} 步：${s.act}`, 'tl', 'middle')}${ashow(on(i), kt, dur)}</g>`;
    o += `<g>${text(245, BUSY + 18, `bus 上：${s.bus}；data 来自 ${s.from}`, 't', 'middle')}${ashow(on(i), kt, dur)}</g>`;
    // data 箭头
    const sx0 = s.src === 'M' ? 460 : PX[s.src];
    for (const dpp of s.dst) {
      const dx = PX[dpp];
      o += `<g>${path(`M${sx0} ${BUSY - 4}C${sx0} ${BUSY - 24} ${dx} ${BUSY - 24} ${dx} ${BUSY - 6}`, 'ln')}${poly([[dx, BUSY - 4], [dx - 4, BUSY - 13], [dx + 4, BUSY - 13]], 'ln-f')}${ashow(on(i), kt, dur)}</g>`;
    }
  });
  // 下半：state diagram
  const S = { I: [80, 360], S: [480, 360], M: [280, 222] }, R = 22;
  o += text(10, 178, 'MSI 的 state transition（实线箭头 = 自己的 processor 发起；虚线 = 听到 bus 上别人的请求）', 'ts');
  const edge = (a, b, bend, label, lx, ly, snoop) => {
    const [x1, y1] = S[a], [x2, y2] = S[b];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const nx = -dy / L, ny = dx / L, cx = mx + nx * bend, cy = my + ny * bend;
    const ang0 = Math.atan2(cy - y1, cx - x1), ang1 = Math.atan2(cy - y2, cx - x2);
    const p0 = [x1 + R * Math.cos(ang0), y1 + R * Math.sin(ang0)], p1 = [x2 + R * Math.cos(ang1), y2 + R * Math.sin(ang1)];
    const dd = `M${f1(p0[0])} ${f1(p0[1])}Q${f1(cx)} ${f1(cy)} ${f1(p1[0])} ${f1(p1[1])}`;
    const ah = Math.atan2(p1[1] - cy, p1[0] - cx);
    const head = (cls) => poly([[p1[0], p1[1]], [p1[0] - 9 * Math.cos(ah - 0.4), p1[1] - 9 * Math.sin(ah - 0.4)], [p1[0] - 9 * Math.cos(ah + 0.4), p1[1] - 9 * Math.sin(ah + 0.4)]], cls);
    const anc = label === 'BusRdX / BusWB' || label === 'PrWr / BusRdX' && lx < 280 ? 'end' : label === 'BusRd / BusWB' || label === 'PrWr / BusRdX' ? 'start' : 'middle';
    let q = path(dd, snoop ? 'dash' : 'mute') + head('mute-f') + text(lx, ly, label, 'ts', anc);
    const use = steps.map((s) => s.edges.some(([u, v]) => u === a && v === b));
    if (use.some(Boolean)) q += `<g>${path(dd, 'ln')}${head('ln-f')}${anim('opacity', [...use, use[n - 1]].map((v) => (v ? 1 : 0)), kt, dur, true)}</g>`;
    return q;
  };
  o += edge('I', 'S', -34, 'PrRd / BusRd', 280, 334, false);
  o += edge('S', 'I', -34, 'BusRdX / —（invalidate）', 280, 398, true);
  o += edge('I', 'M', -30, 'PrWr / BusRdX', 160, 268, false);
  o += edge('M', 'I', -30, 'BusRdX / BusWB', 272, 316, true);
  o += edge('S', 'M', 30, 'PrWr / BusRdX', 400, 268, false);
  o += edge('M', 'S', 30, 'BusRd / BusWB', 288, 316, true);
  for (const [k, [x, y]] of Object.entries(S)) {
    o += circle(x, y, R, 'paper') + text(x, y + 6, k, 'tbig', 'middle');
  }
  o += text(S.M[0] + 30, S.M[1] - 8, 'M：PrRd、PrWr 都不上 bus', 'ts', 'start');
  o += text(S.S[0], S.S[1] + 40, 'S：PrRd 不上 bus', 'ts', 'middle');
  return svgA(560, 410, o, '动图：三个 processor 依次读写同一个 x，每一步 bus 上的 transaction、各 cache 里 x 的 state，以及 MSI state diagram 上走过的 transition');
}

// ---------- 第 6 站：false sharing ----------
function falseShare() {
  let o = '';
  const X0 = 30, cw = 31;
  const lineRow = (y, label, cells) => {
    o += text(X0, y - 6, label, 'ts');
    cells.forEach((c, k) => { o += rect(X0 + k * cw, y, cw - 1, 22, c ? 'solid' : 'paper') + (c ? text(X0 + k * cw + cw / 2, y + 16, c, 'tw', 'middle') : ''); });
  };
  o += text(10, 16, '8 个 int counter 挤在一起：都落在同一条 64 byte 的 cache line 里', 'tb');
  const cells = Array.from({ length: 16 }, (_, k) => (k < 8 ? 'c' + k : ''));
  lineRow(44, 'cache line（16 个 int 的位置）', cells);
  // 两个 core
  const cx = [130, 400];
  ['core 0：只写 c0', 'core 1：只写 c1'].forEach((s, i) => {
    o += rect(cx[i] - 80, 90, 160, 50, 'paper', 4) + text(cx[i], 108, s, 't', 'middle');
    o += text(cx[i], 128, '要写就得先把 line 拿到 M', 'ts', 'middle');
  });
  o += arrow(214, 106, 316, 106, 'ln') + arrow(316, 124, 214, 124, 'ln');
  o += text(265, 100, 'BusRdX', 'ts', 'middle') + text(265, 140, 'BusRdX', 'ts', 'middle');
  o += text(10, 166, '每次写都把整条 line 从对方抢过来，line 在 core 之间来回搬；两个 thread 其实从不读写同一个 counter。', 'ts');
  o += text(10, 196, 'padding 之后：每个 counter 独占一条 line，各 core 的 line 一直停在 M，写都是 cache hit', 'tb');
  for (let k = 0; k < 4; k++) {
    const y = 214 + k * 0;
    const x = X0 + k * 128;
    o += rect(x, y, 120, 22, 'paper') + rect(x, y, 15, 22, 'solid') + text(x + 7.5, y + 16, 'c' + k, 'tw', 'middle') + text(x + 70, y + 16, 'padding', 'ts', 'middle');
    o += text(x + 60, y + 38, 'line ' + k, 'ts', 'middle');
  }
  o += text(10, 276, 'Lecture 14 的实测（8 个 thread，4 核）：挤在一起 14.2 s，padding 之后 4.7 s。', 't');
  return svg(560, 284, o, '8 个 counter 落在同一条 cache line 上，两个 core 各写各的 counter，line 被 BusRdX 来回抢；padding 让每个 counter 占一条 line');
}

// ---------- 第 6 站：write buffer 让 SC 禁止的结果出现 ----------
function litmus() {
  let o = text(10, 16, '一开始 A = B = 0。P0：A = 1; r1 = B;   P1：B = 1; r2 = A;', 'tb');
  const P = [[150, 'P0', 'A = 1（未写出）', -1], [410, 'P1', 'B = 1（未写出）', 1]];
  for (const [x, name, buf, side] of P) {
    o += rect(x - 70, 34, 140, 30, 'paper', 4) + text(x, 54, name, 'tb', 'middle');
    const bx = side < 0 ? x - 70 : x - 40;
    o += rect(bx, 92, 110, 28, 'wash', 3) + text(bx + 55, 111, buf, 't', 'middle');
    o += text(side < 0 ? bx - 6 : bx + 116, 111, 'write buffer', 'ts', side < 0 ? 'end' : 'start');
    const ax = side < 0 ? x - 30 : x + 30;
    o += arrow(ax, 64, ax, 92, 'ink');
  }
  o += text(114, 82, '① A = 1 进 buffer', 'ts', 'end') + text(446, 82, '② B = 1 进 buffer', 'ts', 'start');
  o += rect(190, 168, 180, 36, 'paper', 4) + text(280, 184, 'memory', 'ts', 'middle') + text(280, 199, 'A = 0，B = 0', 't', 'middle');
  o += arrow(214, 168, 206, 66, 'ln') + text(214, 128, '③ r1 = B，读到 0', 'tl', 'start');
  o += arrow(346, 168, 354, 66, 'ln') + text(346, 150, '④ r2 = A，读到 0', 'tl', 'end');
  o += text(280, 232, '⑤ 之后两个 buffer 才写进 memory。结果 r1 = r2 = 0。', 't', 'middle');
  o += text(280, 254, 'SC 下四条 operation 不论怎样交错，至少有一个 read 排在对方的 write 后面，所以 (0, 0) 不可能。', 'ts', 'middle');
  return svg(560, 262, o, '两个 processor 各自先写一个变量再读另一个；写先停在 write buffer 里，读直接去 memory，两个读都得到 0');
}

// ---------- 第 8 站：systolic array 算 y = Wx ----------
function systolic() {
  const n = 4, c = 64, X0 = 150, Y0 = 50;
  let o = text(10, 16, '4×4 的 systolic array 算 y = Wx（weight 预先放进每个 PE，不动）', 'tb');
  for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
    const x = X0 + k * c, y = Y0 + r * c;
    o += rect(x + 6, y + 6, c - 12, c - 12, 'paper', 4);
    o += text(x + c / 2, y + c / 2 - 2, `w${k + 1}${r + 1}`, 't', 'middle');
    o += text(x + c / 2, y + c / 2 + 14, `cycle ${r + k}`, 'ts', 'middle');
    if (k < n - 1) o += arrow(x + c - 6, y + c / 2 - 10, x + c + 6, y + c / 2 - 10, 'mute', 5);
    if (r < n - 1) o += arrow(x + c / 2 + 18, y + c - 6, x + c / 2 + 18, y + c + 6, 'ln', 5);
  }
  for (let r = 0; r < n; r++) {
    const y = Y0 + r * c + c / 2 - 10;
    o += arrow(X0 - 40, y, X0 + 6, y, 'mute', 5);
    o += text(X0 - 46, y + 4, `x${r + 1}（cycle ${r} 进）`, 't', 'end');
  }
  for (let k = 0; k < n; k++) {
    const x = X0 + k * c + c / 2 + 18;
    o += arrow(x, Y0 + n * c - 6, x, Y0 + n * c + 18, 'ln', 5);
    o += text(x, Y0 + n * c + 34, `y${k + 1}`, 'tl', 'middle');
    o += text(x, Y0 + n * c + 50, `cycle ${k + n} 出`, 'ts', 'middle');
  }
  o += text(X0 + n * c + 14, Y0 + 20, 'x 向右传一格，', 'ts') + text(X0 + n * c + 14, Y0 + 36, '部分和向下传一格；', 'ts');
  o += text(X0 + n * c + 14, Y0 + 60, '每个 PE 每个 cycle', 'ts') + text(X0 + n * c + 14, Y0 + 76, '只做一次 multiply-add，', 'ts');
  o += text(X0 + n * c + 14, Y0 + 92, '只和邻居说话。', 'ts');
  o += text(X0 + n * c + 14, Y0 + 130, '第 r 行第 k 列的 PE', 'ts') + text(X0 + n * c + 14, Y0 + 146, '在 cycle r+k 收到 x', 'ts');
  o += text(X0 + n * c + 14, Y0 + 162, '和 y 的部分和。', 'ts');
  return svg(560, Y0 + n * c + 58, o, '4×4 systolic array：x 从左边错开一拍进入、向右流，部分和沿每一列向下流，第 k 列在 cycle k+4 输出 y_k');
}

// ---------- 第 8 站：Halide 的 compute_at：一个 output tile 要多少 blurx ----------
function halide() {
  let o = text(10, 16, 'out.tile(x, y, xi, yi, 256, 32) 之后，blurx.compute_at(out, x)：每个 tile 自己算需要的 blurx', 'tb');
  const X0 = 70, sx = 1.2, sy = 4;
  const y0 = 50;
  // blurx 34 行
  o += rect(X0, y0, 256 * sx, 34 * sy, 'wash');
  o += rect(X0, y0, 256 * sx, sy, 'wash-strong') + rect(X0, y0 + 33 * sy, 256 * sx, sy, 'wash-strong');
  o += rect(X0, y0 + sy, 256 * sx, 32 * sy, 'frame');
  o += text(X0 + 128 * sx, y0 + 17 * sy + 5, 'out 的一个 tile：256 × 32', 't', 'middle');
  o += text(X0 + 256 * sx + 10, y0 + 8, '多出的 1 行 blurx（上）', 'ts') + text(X0 + 256 * sx + 10, y0 + 34 * sy, '多出的 1 行 blurx（下）', 'ts');
  o += text(X0 + 256 * sx + 10, y0 + 17 * sy - 4, 'blurx：256 × 34', 'tl');
  o += text(X0 + 256 * sx + 10, y0 + 17 * sy + 13, '只活在这个 tile 里', 'ts');
  o += text(X0 - 8, y0 + 17 * sy + 5, '34 行', 'ts', 'end');
  const red = (2 / 32 * 100).toFixed(2);
  o += text(10, y0 + 34 * sy + 30, `out(x, y) 要 blurx 的 y−1、y、y+1 三行，所以 32 行的 tile 要 34 行 blurx；相邻 tile 各算一遍边上那两行，`, 'ts');
  o += text(10, y0 + 34 * sy + 47, `blurx 多算 2/32 = ${red}%。换来的是 blurx 的 256 × 34 个 float（约 ${(256 * 34 * 4 / 1024).toFixed(0)} KB）放得进 L2 cache。`, 'ts');
  return svg(560, y0 + 34 * sy + 54, o, 'Halide schedule 里 256 乘 32 的 output tile 需要 256 乘 34 的 blurx，上下各多一行');
}

export default {
  'cs149-simd': simdA,
  'cs149-mthread': mthread,
  'cs149-gang': gang,
  'cs149-mandel': mandelImb,
  'cs149-grid': grid,
  'cs149-conv': conv,
  'cs149-warp': warpA,
  'cs149-scan': scan,
  'cs149-msi': msiA,
  'cs149-falseshare': falseShare,
  'cs149-litmus': litmus,
  'cs149-systolic': systolic,
  'cs149-halide': halide,
};
