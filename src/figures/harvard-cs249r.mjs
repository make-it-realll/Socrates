import { svg, svgA, anim, ashow, f1, lin, d, path, line, rect, circle, poly, text, arrow, axes } from '../lib/svg.mjs';

// ---------- 通用小工具 ----------
const kt5 = (x) => Math.round(x * 1e5) / 1e5;
// 一个 block 在动画里“长出来”：hold 阶段完整显示，sweep 开始时清空，到 t0 开始长，到 t1 长满
function growRect(x, y, w, h, cls, s0, s1, H, S, T, rx = 2) {
  // H: 开头静止（完整）占的比例；S: sweep 占的比例；s0/s1: block 在 sweep 里的起止比例
  const a = H, b = H + S * s0, c = H + S * s1;
  const op = anim('opacity', [1, 0, 1, 1], [0, a, Math.max(a + 1e-4, b), 1], T, true);
  const wd = anim('width', [f1(w), f1(w), '0', f1(w), f1(w)], [0, a, Math.max(a + 1e-4, b), Math.max(a + 2e-4, c), 1], T);
  return `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${rx}" class="${cls}">${op}${wd}</rect>`;
}
// 一个元素在某一步出现（discrete）：hold 阶段可见，sweep 开始消失，到 s 时出现
const showFrom = (s, H, S, T) => anim('opacity', [1, 0, 1, 1], [0, H, Math.max(H + 1e-4, H + S * s), 1], T, true);
const showOnly = (s0, s1, H, S, T, inHold = false) => {
  const a = H + S * s0, b = H + S * s1;
  const v = [inHold ? 1 : 0, 0, 1, s1 >= 1 ? 1 : 0, s1 >= 1 ? 1 : 0];
  return anim('opacity', v, [0, H, Math.max(H + 1e-4, a), Math.max(H + 2e-4, b), 1], T, true);
};
// 时间游标：hold 时停在终点，sweep 时从 x0 走到 x1
function cursor(x0, x1, y0, y1, H, S, T) {
  const xs = [x1, x1, x0, x1, x1].map(f1), kt = [0, H - 1e-4, H, H + S, 1];
  return `<line x1="${f1(x1)}" y1="${f1(y0)}" x2="${f1(x1)}" y2="${f1(y1)}" class="ln">${anim('x1', xs, kt, T)}${anim('x2', xs, kt, T)}</line>`;
}
// 可复现的 random
function mulberry(seed) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- 开头：同一条命令跑两次 ----------
function stages() {
  const cold = [289.7, 2545.1, 1540.9], warm = [237.6, 519.3, 506.7];
  const sx = lin(0, 4500, 110, 545);
  const cls = ['wash2', 'solid', 'wash'];
  let o = text(20, 18, 'Raspberry Pi Zero 2 W，同一个 320×320 YOLO detector（NCNN），同一条命令连跑两次', 'tb');
  const bar = (y, v, name) => {
    let x = sx(0); o += text(100, y + 21, name, 't', 'end');
    v.forEach((t, i) => { const w = sx(t) - sx(0); o += rect(x, y, w, 32, cls[i]) + rect(x, y, w, 32, 'frame'); x += w; });
    return x;
  };
  const yc = 46, yw = 128;
  const endC = bar(yc, cold, '第一次（cold）');
  const endW = bar(yw, warm, '第二次（warm）');
  // cold 的标注
  const c1 = sx(cold[0]), c2 = sx(cold[0] + cold[1]);
  o += line((sx(0) + c1) / 2, yc, (sx(0) + c1) / 2, yc - 6, 'mute') + text((sx(0) + c1) / 2 - 4, yc - 9, 'preprocess 289.7', 'ts', 'start');
  o += text((c1 + c2) / 2, yc + 21, 'inference 2545.1 ms', 'tw', 'middle');
  o += text((c2 + endC) / 2, yc + 21, 'postprocess 1540.9', 't', 'middle');
  o += text(endC - 2, yc + 50, '合计 4375.7 ms', 'tb', 'end');
  // warm 的标注放在右边空白处
  o += text(endW + 12, yw + 12, 'preprocess 237.6 ms', 'ts') + text(endW + 12, yw + 27, 'inference 519.3 ms（深色）', 'ts') + text(endW + 12, yw + 42, 'postprocess 506.7 ms', 'ts');
  o += text(endW + 160, yw + 27, '合计 1263.6 ms', 'tb');
  o += axes({ sx, sy: (v) => v, x0: 0, x1: 4500, y0: 186, y1: 186, xt: [0, 1000, 2000, 3000, 4000], xAt: 186, yAt: 0 }).replace(/<line[^>]*x1="110"[^>]*y1="186"[^>]*x2="110"[^>]*\/>/, '');
  o += text(545, 222, 'ms', 'ts', 'end');
  o += text(20, 246, '第二次里 inference 只占 41%：把 model 换成快一倍的，总时间只从 1263.6 ms 降到 1004.0 ms。', 'ts');
  return svg(560, 256, o, '两条横条：第一次运行 preprocess 289.7、inference 2545.1、postprocess 1540.9 ms，共 4375.7；第二次 237.6、519.3、506.7，共 1263.6');
}

// ---------- 开头：export 时没写 imgsz ----------
function imgsz() {
  let o = '';
  const box = (x, w, t1, t2, t3, cls = 'paper') => { o += rect(x, 30, w, 76, cls, 6) + text(x + w / 2, 54, t1, 'tb', 'middle') + text(x + w / 2, 74, t2, 'ts', 'middle') + text(x + w / 2, 92, t3, 'ts', 'middle'); };
  box(10, 150, 'Train', 'imgsz = 320', 'weight 是对 320×320 学的');
  box(205, 150, 'Export 到 NCNN', '没写 imgsz', 'graph 的 input 定成 640×640', 'wash');
  box(400, 150, 'Predict', 'imgsz = 320', '送进来的是 320×320');
  o += arrow(162, 68, 203, 68, 'ink') + arrow(357, 68, 398, 68, 'ink');
  // 两个 input 的实际大小对比
  const s = 0.11, y = 132;
  o += rect(205, y, 640 * s, 640 * s, 'frame') + text(205 + 640 * s / 2, y + 640 * s + 14, 'graph 要的 640²', 'ts', 'middle');
  o += rect(300, y, 320 * s, 320 * s, 'solid') + text(300 + 320 * s / 2, y + 640 * s + 14, '给的 320²', 'ts', 'middle');
  o += text(360, y + 14, '输出：113 个 box、', 't') + text(360, y + 32, '164 个 wheel，', 't') + text(360, y + 50, '大多 confidence 1.00；', 't') + text(360, y + 68, '图里其实只有 1 个 box。', 't');
  o += text(20, y + 100, '没有 exception，没有 warning。', 'tb');
  return svg(560, 240, o, 'Train 时 imgsz 320，export 时没写 imgsz 所以 graph 输入定成 640，predict 时给 320 的图，输出 113 个 box 和 164 个 wheel，没有任何报错');
}

// ---------- 第 1 站：光在 fiber 里往返 ----------
function light() {
  const rows = [['robot 上的 Jetson / Pi', 0, '0 km'], ['Singapore 本地 region', 0.3, '约 30 km，假设'], ['Mumbai', 39.04, '3904 km'], ['Tokyo', 53.11, '5311 km'], ['San Francisco', 135.82, '13582 km']];
  const sx = lin(0, 150, 170, 400);
  let o = text(20, 18, '从 Singapore 出发，光在 fiber（200,000 km/s）里往返一次的最短时间', 'tb');
  const y0 = 50, dy = 38;
  rows.forEach(([n, ms, km], i) => {
    const y = y0 + i * dy;
    o += text(160, y + 17, n, 't', 'end');
    if (ms > 0) o += rect(sx(0), y + 4, Math.max(2, sx(ms) - sx(0)), 18, ms > 20 ? 'wash-strong' : 'solid');
    o += text(ms > 0 ? Math.max(sx(ms), sx(20)) + 6 : sx(20) + 6, y + 17, ms > 0 ? `${ms.toFixed(1)} ms（单程 ${km}）` : '只有板上 bus 的 ns 级 latency', 'ts');
  });
  const yb = y0 + rows.length * dy + 4;
  o += line(sx(20), y0 - 4, sx(20), yb, 'dash') + text(sx(20) + 4, y0 - 8, '20 ms：50 Hz control loop 的整个周期', 'ts');
  o += axes({ sx, sy: (v) => v, x0: 0, x1: 150, y0: yb, y1: yb, xt: [0, 50, 100, 150], xAt: yb, yAt: 0 }).replace(/<line[^>]*y2="\d+(\.\d+)?" class="axis"\/>$/, '');
  o += text(400, yb + 32, 'ms', 'ts', 'end');
  return svg(560, yb + 40, o, '横条：从 Singapore 到 Mumbai、Tokyo、San Francisco 的光纤往返最短时间分别是 39、53、136 ms，都超过 50 Hz control loop 的 20 ms周期');
}

// ---------- 第 2 站：按 frame 切 vs 按 episode 切 ----------
function split() {
  const rnd = mulberry(7);
  const E = 3, F = 14, cw = 7, gap = 2, x0 = 118, eg = 16;
  let o = text(20, 18, '三段 demonstration，每段 14 个 frame（30 fps，相邻两个 frame 只差 33 ms）', 'tb');
  const row = (y, name, isTest) => {
    o += text(110, y + 10, name, 't', 'end');
    for (let e = 0; e < E; e++) for (let f = 0; f < F; f++) {
      const x = x0 + e * (F * (cw + gap) + eg) + f * (cw + gap);
      o += rect(x, y, cw, 12, isTest(e, f) ? 'solid' : 'wash2');
    }
  };
  for (let e = 0; e < E; e++) o += text(x0 + e * (F * (cw + gap) + eg) + (F * (cw + gap)) / 2, 40, `episode ${e + 1}`, 'ts', 'middle');
  const pick = []; for (let e = 0; e < E; e++) { pick.push([]); for (let f = 0; f < F; f++) pick[e].push(rnd() < 0.25); }
  row(52, '随机按 frame 切', (e, f) => pick[e][f]);
  row(86, '按 episode 切', (e) => e === 2);
  o += rect(x0, 118, 10, 10, 'solid') + text(x0 + 16, 127, 'test', 'ts') + rect(x0 + 60, 118, 10, 10, 'wash2') + text(x0 + 76, 127, 'train', 'ts');
  o += text(20, 154, '第一行：每个 test frame 旁边都有几乎一样的 train frame，', 'ts') + text(20, 170, 'test accuracy 量到的是“记住了这一段”。', 'ts');
  o += text(20, 192, '第二行：test 是 model 从没见过的一整段，', 'ts') + text(20, 208, '量到的才是换一次摆放、换一次光照之后的表现。', 'ts');
  return svg(560, 216, o, '三段 demonstration 的 frame 排成一行：随机按 frame 切分时 test frame 散落在 train frame 之间；按 episode 切分时第三段整段是 test');
}

// ---------- 第 2 站：dataloader 的三种排法（动图） ----------
function loaderA() {
  const L = 30, C = 20, NB = 5;
  const groups = [];
  // 1. 不 prefetch：load 完再算
  { const b = []; for (let i = 0; i < NB; i++) { b.push([0, 50 * i, 50 * i + L, i]); b.push([1, 50 * i + L, 50 * i + L + C, i]); } groups.push({ name: '不 prefetch', lanes: ['CPU', 'GPU'], b }); }
  // 2. 一个 worker 在后台一直 load
  { const b = []; let gEnd = 0; for (let i = 0; i < NB; i++) { const le = L * (i + 1); b.push([0, L * i, le, i]); const s = Math.max(le, gEnd); b.push([1, s, s + C, i]); gEnd = s + C; } groups.push({ name: 'num_workers = 1', lanes: ['worker 0', 'GPU'], b }); }
  // 3. 两个 worker
  { const b = []; let gEnd = 0; for (let i = 0; i < NB; i++) { const w = i % 2, k = Math.floor(i / 2); const le = L * (k + 1); b.push([w, L * k, le, i]); const s = Math.max(le, gEnd); b.push([2, s, s + C, i]); gEnd = s + C; } groups.push({ name: 'num_workers = 2', lanes: ['worker 0', 'worker 1', 'GPU'], b }); }
  const Tmax = 300, sx = lin(0, Tmax, 112, 540);
  const H = 0.18, S = 0.62, T = 1.2 / H; // hold 1.2 s；sweep 约 4.1 s 走完 300 ms
  let o = text(20, 16, '每个 batch：CPU decode + augment 30 ms，GPU forward + backward 20 ms，一共 5 个 batch', 'tb');
  let y = 30;
  const ends = [];
  for (const g of groups) {
    o += text(20, y + 14, g.name, 'tb');
    y += 20;
    const laneY = g.lanes.map((_, i) => y + i * 20);
    g.lanes.forEach((n, i) => { o += text(104, laneY[i] + 12, n, 'ts', 'end') + line(sx(0), laneY[i] + 16, sx(Tmax), laneY[i] + 16, 'grid'); });
    let end = 0;
    for (const [lane, t0, t1, i] of g.b) {
      const isG = lane === g.lanes.length - 1, cls = isG ? 'solid' : 'wash-strong';
      o += rect(sx(t0), laneY[lane], sx(t1) - sx(t0), 15, 'frame', 2);
      o += growRect(sx(t0), laneY[lane], sx(t1) - sx(t0), 15, cls, t0 / Tmax, t1 / Tmax, H, S, T);
      o += text((sx(t0) + sx(t1)) / 2, laneY[lane] + 11.5, 'b' + i, isG ? 'tw' : 'ts', 'middle');
      end = Math.max(end, t1);
    }
    ends.push(end);
    const yl = laneY[laneY.length - 1];
    o += line(sx(end), laneY[0] - 3, sx(end), yl + 18, 'ink') + text(sx(end) + 5, yl + 12, end + ' ms', 'tb');
    y = yl + 30;
  }
  o += axes({ sx, sy: (v) => v, x0: 0, x1: Tmax, y0: y, y1: y, xt: [0, 50, 100, 150, 200, 250], xAt: y, yAt: 0 }).replace(/<line[^>]*class="axis"\/>$/, '');
  o += text(540, y + 30, 'ms', 'ts', 'end');
  o += cursor(sx(0), sx(Tmax), 30, y, H, S, T);
  return svgA(560, y + 36, o, `动图：同样 5 个 batch，不 prefetch 用 ${ends[0]} ms，一个 worker 后台加载用 ${ends[1]} ms，两个 worker 用 ${ends[2]} ms，此时 GPU 不再等 data`);
}

// ---------- 第 3 站：loop order 与 cache line（动图） ----------
function cacheA() {
  const n = 8, cs = 17, LW = 4; // 一条 cache line 放 4 个数（示意；真实的 64 B 放 8 个 double）
  const H = 0.2, S = 0.62, T = 1.4 / H, steps = n;
  let o = '';
  const panel = (x0, title, sub, acc) => {
    const y0 = 62;
    o += text(x0 + n * cs / 2, 20, title, 'tb', 'middle') + text(x0 + n * cs / 2, 38, sub, 'ts', 'middle');
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) o += rect(x0 + c * cs, y0 + r * cs, cs, cs, 'grid');
    // 已经搬进 cache 的 line
    const loaded = new Map();
    acc.forEach(([r, c], s) => { const key = r + ',' + Math.floor(c / LW); if (!loaded.has(key)) loaded.set(key, s); });
    for (const [key, s] of loaded) {
      const [r, b] = key.split(',').map(Number);
      o += `<rect x="${f1(x0 + b * LW * cs)}" y="${f1(y0 + r * cs)}" width="${f1(LW * cs)}" height="${cs}" class="wash">${showFrom(s / steps, H, S, T)}</rect>`;
    }
    for (let r = 0; r <= n; r++) o += line(x0, y0 + r * cs, x0 + n * cs, y0 + r * cs, 'mute');
    for (let r = 0; r < n; r++) for (let b = 0; b <= n / LW; b++) o += line(x0 + b * LW * cs, y0 + r * cs, x0 + b * LW * cs, y0 + (r + 1) * cs, 'ink-b');
    // 当前访问的那个数
    acc.forEach(([r, c], s) => { o += `<rect x="${f1(x0 + c * cs + 3)}" y="${f1(y0 + r * cs + 3)}" width="${cs - 6}" height="${cs - 6}" class="solid">${showOnly(s / steps, (s + 1) / steps, H, S, T, s === steps - 1)}</rect>`; });
    // 计数
    const cnt = []; let k = 0; const seen = new Set();
    acc.forEach(([r, c]) => { const key = r + ',' + Math.floor(c / LW); if (!seen.has(key)) { seen.add(key); k++; } cnt.push(k); });
    const yt = y0 + n * cs + 22;
    acc.forEach((_, s) => {
      const used = ((s + 1) / (cnt[s] * LW)) * 100;
      o += `<text x="${f1(x0 + n * cs / 2)}" y="${yt}" class="t" text-anchor="middle">读了 ${s + 1} 个数，搬进 ${cnt[s]} 条 line${showOnly(s / steps, s === steps - 1 ? 1 : (s + 1) / steps, H, S, T, s === steps - 1)}</text>`;
      o += `<text x="${f1(x0 + n * cs / 2)}" y="${yt + 18}" class="ts" text-anchor="middle">搬进来的数用上了 ${used.toFixed(0)}%${showOnly(s / steps, s === steps - 1 ? 1 : (s + 1) / steps, H, S, T, s === steps - 1)}</text>`;
    });
    return { y0, x0 };
  };
  const col = [], row = [];
  for (let k = 0; k < n; k++) col.push([k, 0]);
  for (let j = 0; j < n; j++) row.push([2, j]);
  panel(40, 'i, j, k：最内层沿 B 的 column 走', 'B[k][j]，k 每加 1 就跳过一整行', col);
  panel(380, 'i, k, j：最内层沿 B 的 row 走', 'B[k][j]，j 每加 1 只挪一格', row);
  o += text(280, 270, 'B 按 row-major 存：同一行相邻的数在 memory 里挨着。粗线分出 cache line，这里一条装 4 个数。', 'ts', 'middle');
  o += text(280, 288, '每读一个数，它所在的整条 line 都被搬进 cache（浅色）。', 'ts', 'middle');
  return svgA(560, 296, o, '动图：左边最内层循环沿 B 的列走，读 8 个数搬进 8 条 cache line，只用上 25%；右边沿行走，读 8 个数只搬进 2 条 line，全部用上');
}

// ---------- 第 3 站：tiling（动图） ----------
function tileA() {
  const n = 8, t = 4, cs = 13, nt = n / t;
  const H = 0.18, S = 0.64, T = 1.4 / H;
  const steps = [];
  for (let I = 0; I < nt; I++) for (let J = 0; J < nt; J++) for (let K = 0; K < nt; K++) steps.push([I, J, K]);
  const NS = steps.length;
  const mats = { C: [24, 52], A: [214, 52], B: [404, 52] };
  let o = text(20, 18, '8×8 的 matrix，tile 是 4×4：C 的每个 tile = 两次 “A 的 tile × B 的 tile” 累加', 'tb');
  const grid = (name, [x0, y0]) => {
    o += text(x0 + n * cs / 2, y0 - 8, name, 'tb', 'middle');
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) o += rect(x0 + c * cs, y0 + r * cs, cs, cs, 'grid');
    for (let k = 0; k <= nt; k++) o += line(x0 + k * t * cs, y0, x0 + k * t * cs, y0 + n * cs, 'ink') + line(x0, y0 + k * t * cs, x0 + n * cs, y0 + k * t * cs, 'ink');
  };
  // 高亮 tile：每一步各自出现
  const hi = (name, rI, cI, s, cls) => {
    const [x0, y0] = mats[name];
    return `<rect x="${f1(x0 + cI * t * cs)}" y="${f1(y0 + rI * t * cs)}" width="${t * cs}" height="${t * cs}" class="${cls}">${showOnly(s / NS, (s + 1) / NS, H, S, T, s === NS - 1)}</rect>`;
  };
  steps.forEach(([I, J, K], s) => { o += hi('C', I, J, s, 'wash-strong') + hi('A', I, K, s, 'wash-strong') + hi('B', K, J, s, 'wash-strong'); });
  grid('C', mats.C); grid('A', mats.A); grid('B', mats.B);
  o += text(184, 52 + n * cs / 2 + 8, '+=', 'tbig', 'middle') + text(374, 52 + n * cs / 2 + 8, '×', 'tbig', 'middle');
  // L1 box
  const yb = 182;
  o += rect(24, yb, 250, 74, 'paper', 6) + text(36, yb + 20, 'L1 cache（这一步里同时在的三个 tile）', 'tb');
  o += rect(40, yb + 32, 30, 30, 'wash-strong') + text(55, yb + 52, 'C', 'ts', 'middle') + rect(96, yb + 32, 30, 30, 'wash-strong') + text(111, yb + 52, 'A', 'ts', 'middle') + rect(152, yb + 32, 30, 30, 'wash-strong') + text(167, yb + 52, 'B', 'ts', 'middle');
  o += text(196, yb + 52, '3·t² 个数', 'ts');
  steps.forEach(([I, J, K], s) => {
    const sh = showOnly(s / NS, (s + 1) / NS, H, S, T, s === NS - 1);
    o += `<text x="300" y="${yb + 16}" class="t">第 ${s + 1} / ${NS} 步：C(${I},${J}) += A(${I},${K}) · B(${K},${J})${sh}</text>`;
    o += `<text x="300" y="${yb + 40}" class="t">从 DRAM 搬进 A、B 的数：${(s + 1) * 2 * t * t}${sh}</text>`;
  });
  o += text(300, yb + 64, '不分 tile、每次 multiply-add 都去 DRAM', 'ts') + text(300, yb + 80, '取 A、B 各一个数：2·8³ = 1024', 'ts');
  return svgA(560, yb + 90, o, '动图：C 等于 A 乘 B，按 4 乘 4 的 tile 走 8 步，每步把 A 和 B 的各一个 tile 放进 L1 累加进 C 的 tile，一共从 DRAM 搬进 256 个数，不分 tile 时是 1024 个');
}

// ---------- 第 3 站：im2col ----------
function im2col() {
  const cs = 26, X = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  let o = text(20, 18, '1 个 channel 的 3×3 input，2×2 kernel，stride 1：4 个 output 位置，4 个 patch', 'tb');
  const x0 = 30, y0 = 46;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o += rect(x0 + c * cs, y0 + r * cs, cs, cs, X[r][c] === 5 ? 'wash-strong' : 'paper') + text(x0 + c * cs + cs / 2, y0 + r * cs + 18, X[r][c], 't', 'middle');
  o += rect(x0 + 1, y0 + 1, 2 * cs - 2, 2 * cs - 2, 'ln-dash') + text(x0 + 3 * cs / 2, y0 + 3 * cs + 18, 'input X', 'ts', 'middle');
  o += text(x0 - 4, y0 - 8, '虚线：位置 (0,0) 的 patch', 'ts', 'start');
  o += arrow(130, y0 + 40, 200, y0 + 40, 'ink') + text(165, y0 + 30, 'im2col', 'ts', 'middle');
  const P = [[1, 2, 4, 5], [2, 3, 5, 6], [4, 5, 7, 8], [5, 6, 8, 9]], px = 230, py = 36;
  P.forEach((row, i) => {
    row.forEach((v, j) => o += rect(px + j * cs, py + i * cs, cs, cs, v === 5 ? 'wash-strong' : 'paper') + text(px + j * cs + cs / 2, py + i * cs + 18, v, 't', 'middle'));
    o += text(px - 6, py + i * cs + 18, `(${i >> 1},${i & 1})`, 'ts', 'end');
  });
  o += text(px + 2 * cs, py + 4 * cs + 18, 'X_col：每行一个 patch', 'ts', 'middle');
  o += text(px + 4 * cs + 12, py + 2 * cs + 6, '×', 'tbig', 'middle');
  const wx = px + 4 * cs + 28;
  ['w₁', 'w₂', 'w₃', 'w₄'].forEach((w, i) => o += rect(wx, py + i * cs, cs, cs, 'wash') + text(wx + cs / 2, py + i * cs + 18, w, 't', 'middle'));
  o += text(wx + cs / 2, py + 4 * cs + 18, 'kernel', 'ts', 'middle');
  o += text(wx + cs + 14, py + 2 * cs + 6, '=', 'tbig', 'middle');
  const yx = wx + cs + 28;
  for (let i = 0; i < 4; i++) o += rect(yx, py + i * cs, cs, cs, 'paper') + text(yx + cs / 2, py + i * cs + 18, 'y' + '₁₂₃₄'[i], 't', 'middle');
  o += text(20, 196, '一个 convolution 变成一次 matrix multiplication。', 'ts') + text(20, 212, '代价是重复：中间的 5 在 X 里存一次，在 X_col 里存了 4 次。', 'ts');
  return svg(560, 220, o, 'im2col：3 乘 3 的输入按 2 乘 2 的窗口展开成 4 行的矩阵，再乘上展平的 kernel 得到 4 个输出；中间的像素 5 被复制了 4 次');
}

// ---------- 第 4 站：tensor arena 的 memory planning（动图） ----------
const ARENA = (() => {
  // [name, size KB, first op, last op]
  const bufs = [['X', 48, 0, 1], ['A', 64, 1, 4], ['B', 128, 2, 3], ['C', 64, 3, 4], ['D', 64, 4, 5], ['E', 16, 5, 5]];
  const order = [...bufs].sort((a, b) => b[1] - a[1] || bufs.indexOf(a) - bufs.indexOf(b));
  const placed = [];
  for (const b of order) {
    const clash = placed.filter((p) => !(p[3] < b[2] || p[2] > b[3])).sort((p, q) => p.off - q.off);
    let off = 0;
    for (const p of clash) { if (off + b[1] <= p.off) break; off = Math.max(off, p.off + p[1]); }
    const q = [...b]; q.off = off; placed.push(q);
  }
  const arena = Math.max(...placed.map((p) => p.off + p[1]));
  const naive = bufs.reduce((s, b) => s + b[1], 0);
  let peak = 0; for (let k = 0; k <= 5; k++) peak = Math.max(peak, bufs.filter((b) => b[2] <= k && k <= b[3]).reduce((s, b) => s + b[1], 0));
  return { bufs, placed, arena, naive, peak };
})();
function arenaA() {
  const { placed, arena, naive } = ARENA;
  const H = 0.2, S = 0.62, T = 1.4 / H, NS = placed.length;
  let o = text(20, 16, '一个小 network：op 1 到 op 5，A 有一条 skip connection 直接进 op 4', 'tb');
  // 上方：network 本身
  const gy = 32, ops = ['op 1', 'op 2', 'op 3', 'op 4', 'op 5'], gx = (i) => 70 + i * 96;
  ops.forEach((n, i) => { o += rect(gx(i), gy, 56, 24, 'paper', 4) + text(gx(i) + 28, gy + 17, n, 'ts', 'middle'); });
  o += text(gx(0) - 26, gy + 17, 'X', 'tb', 'middle') + arrow(gx(0) - 18, gy + 12, gx(0) - 2, gy + 12, 'ink', 5);
  ['A', 'B', 'C', 'D'].forEach((n, i) => { o += arrow(gx(i) + 58, gy + 12, gx(i + 1) - 2, gy + 12, 'ink', 5) + text(gx(i) + 77, gy + 8, n, 'tb', 'middle'); });
  o += arrow(gx(4) + 58, gy + 12, gx(4) + 78, gy + 12, 'ink', 5) + text(gx(4) + 86, gy + 17, 'E', 'tb', 'middle');
  o += path(`M${gx(0) + 77} ${gy + 26}C${gx(0) + 77} ${gy + 52} ${gx(3) + 28} ${gy + 52} ${gx(3) + 28} ${gy + 26}`, 'dash') + text(gx(2) + 28, gy + 62, 'skip：A 要一直活到 op 4', 'ts', 'middle');
  // 下方：arena，横轴 op，纵轴 offset
  const cx = (k) => 70 + k * 46, oy = lin(0, 256, 324, 120);
  for (let k = 0; k <= 5; k++) o += text(cx(k) + 23, 340, k === 0 ? 'input' : 'op ' + k, 'ts', 'middle') + line(cx(k), 120, cx(k), 324, 'grid');
  o += line(cx(6), 120, cx(6), 324, 'grid');
  for (const v of [0, 64, 128, 192, 256]) o += text(62, oy(v) + 4, v, 'ts', 'end') + line(66, oy(v), 70, oy(v), 'axis');
  o += text(20, 112, 'offset（KB）', 'ts');
  placed.forEach((p, s) => {
    const [n, sz, a, b] = p, x = cx(a) + 2, w = cx(b + 1) - cx(a) - 4, y = oy(p.off + sz) + 1, h = oy(p.off) - oy(p.off + sz) - 2;
    const sh = showFrom(s / NS, H, S, T);
    o += `<g>${rect(x, y, w, h, s === 0 ? 'wash-strong' : 'wash', 3)}${rect(x, y, w, h, 'frame', 3)}${text(x + w / 2, y + h / 2 + 5, `${n} ${sz}`, 'tb', 'middle')}${sh}</g>`;
  });
  o += rect(70, oy(256), 276, oy(0) - oy(256), 'frame');
  // 右侧说明，逐步出现
  const notes = placed.map((p) => `${p[0]}（${p[1]} KB）放在 offset ${p.off}`);
  const why = { B: '最大，先放', A: '和 B 同时活着，只能叠在上面', C: '和 A、B 都同时活着', D: 'B 已经死了，D 用回 offset 0', X: '只和 A 重叠，用 offset 0', E: '和 D 重叠，放在 D 上面' };
  placed.forEach((p, s) => {
    const sh = showOnly(s / NS, s === NS - 1 ? 1 : (s + 1) / NS, H, S, T, s === NS - 1);
    o += `<text x="362" y="156" class="t">第 ${s + 1} 步${sh}</text><text x="362" y="176" class="t">${notes[s]}${sh}</text><text x="362" y="194" class="ts">${why[p[0]]}${sh}</text>`;
  });
  o += text(362, 250, `arena：${arena} KB`, 'tb') + text(362, 270, `各占一块：${naive} KB`, 'ts') + text(362, 288, '按 size 从大到小，', 'ts') + text(362, 304, '放进第一个够大的空隙', 'ts');
  return svgA(560, 348, o, `动图：六个中间 tensor 按大小依次放进 arena，lifetime 不重叠的复用同一段地址，arena 只要 ${arena} KB，各占一块要 ${naive} KB`);
}

// ---------- 第 5 站：camera pipeline（动图） ----------
function pipeA() {
  const per = 1000 / 30, pre = 8, inf = 25, post = 6, NF = 6, Tmax = 240;
  const sx = lin(0, Tmax, 112, 540);
  const H = 0.18, S = 0.64, T = 1.2 / H;
  let o = text(20, 16, '每 33.3 ms 来一个 frame；每个 frame：preprocess 8、inference 25、postprocess 6 ms', 'tb');
  const lane = (y, name) => { o += text(104, y + 12, name, 'ts', 'end') + line(sx(0), y + 16, sx(Tmax), y + 16, 'grid'); };
  const blk = (y, t0, t1, cls, lab, tw) => {
    o += rect(sx(t0), y, sx(t1) - sx(t0), 15, 'frame', 2) + growRect(sx(t0), y, sx(t1) - sx(t0), 15, cls, t0 / Tmax, t1 / Tmax, H, S, T);
    if (lab) o += text((sx(t0) + sx(t1)) / 2, y + 11.5, lab, tw ? 'tw' : 'ts', 'middle');
  };
  // arrival
  let y = 30;
  lane(y, 'camera');
  for (let i = 0; i < 8; i++) { const t = i * per; if (t <= Tmax - 12) o += line(sx(t), y + 2, sx(t), y + 16, 'ink-b') + text(sx(t) + 3, y + 10, 'f' + i, 'ts'); }
  // serial
  y += 32; o += text(20, y + 10, '一个 thread 依次做完', 'tb'); y += 16;
  lane(y, 'CPU');
  let end = 0; const lagS = [];
  for (let i = 0; i < NF; i++) {
    const s = Math.max(i * per, end);
    blk(y, s, s + pre, 'wash2'); blk(y, s + pre, s + pre + inf, 'solid', 'f' + i, true); blk(y, s + pre + inf, s + pre + inf + post, 'wash');
    end = s + pre + inf + post; lagS.push(end - i * per);
  }
  o += text(sx(Tmax) - 10, y + 34, `f${NF - 1} 从到达到出结果：${lagS[NF - 1].toFixed(1)} ms，而且每个 frame 多 5.7 ms`, 'ts', 'end');
  // pipelined
  y += 50; o += text(20, y + 10, '三个 stage 各占一个 core / accelerator', 'tb'); y += 16;
  const ys = [y, y + 20, y + 40];
  lane(ys[0], 'preprocess'); lane(ys[1], 'inference'); lane(ys[2], 'postprocess');
  let e1 = 0, e2 = 0, e3 = 0; const lagP = [];
  for (let i = 0; i < NF; i++) {
    const a = i * per, s1 = Math.max(a, e1); e1 = s1 + pre; const s2 = Math.max(e1, e2); e2 = s2 + inf; const s3 = Math.max(e2, e3); e3 = s3 + post;
    blk(ys[0], s1, e1, 'wash2'); blk(ys[1], s2, e2, 'solid', 'f' + i, true); blk(ys[2], s3, e3, 'wash');
    lagP.push(e3 - a);
  }
  o += text(sx(Tmax) - 10, ys[2] + 34, `每个 frame 从到达到出结果都是 ${lagP[NF - 1].toFixed(0)} ms，跟得上 30 fps`, 'ts', 'end');
  const yb = ys[2] + 44;
  o += axes({ sx, sy: (v) => v, x0: 0, x1: Tmax, y0: yb, y1: yb, xt: [0, 50, 100, 150, 200], xAt: yb, yAt: 0 }).replace(/<line[^>]*class="axis"\/>$/, '');
  o += text(540, yb + 30, 'ms', 'ts', 'end');
  o += cursor(sx(0), sx(Tmax), 30, yb, H, S, T);
  return svgA(560, yb + 36, o, `动图：serial 处理时每个 frame 39 ms，比 33.3 ms 的 frame 间隔长，latency 越积越多，第 6 个 frame 已到 ${lagS[NF - 1].toFixed(1)} ms；三个 stage pipeline 化后每个 frame 的 latency 固定 39 ms`);
}

// ---------- 第 5 站：dual-trigger batcher（动图） ----------
const BATCH = (() => {
  const rnd = mulberry(11), lam = 0.2; // 每 ms 0.2 个 request = 200 req/s
  const arr = []; let t = 0;
  while (true) { t += -Math.log(1 - rnd()) / lam; if (t > 118) break; arr.push(t); }
  const Bmax = 4, win = 10, T0 = 8, t1 = 1;
  const batches = []; let q = [], idx = 0, busyTill = 0, now = 0;
  const lat = [];
  for (now = 0; now <= 200; now += 0.01) {
    while (idx < arr.length && arr[idx] <= now + 1e-9) q.push(arr[idx++]);
    if (now >= busyTill - 1e-9 && q.length && (q.length >= Bmax || now - q[0] >= win - 1e-9)) {
      const take = q.splice(0, Bmax), dur = T0 + t1 * take.length;
      batches.push({ s: now, e: now + dur, reqs: take });
      take.forEach((a) => lat.push(now + dur - a));
      busyTill = now + dur;
    }
    if (idx >= arr.length && !q.length && now > busyTill) break;
  }
  const mean = lat.reduce((a, b) => a + b, 0) / lat.length;
  return { arr, batches, lat, mean, max: Math.max(...lat) };
})();
function batchA() {
  const { arr, batches, mean, max } = BATCH;
  const Tmax = Math.ceil(Math.max(...batches.map((b) => b.e)) / 10) * 10;
  const sx = lin(0, Tmax, 112, 540);
  const H = 0.18, S = 0.64, T = 1.2 / H;
  let o = text(20, 16, 'request 平均每秒 200 个（Poisson）；batch 满 4 个、或最早的一个等满 10 ms 就发', 'tb');
  const ya = 40, yq = 78, yg = 112;
  o += text(104, ya + 4, 'request 到达', 'ts', 'end') + line(sx(0), ya, sx(Tmax), ya, 'grid');
  o += text(104, yg + 12, 'GPU', 'ts', 'end') + line(sx(0), yg + 16, sx(Tmax), yg + 16, 'grid');
  // 每个 request 从到达连到它所在 batch 的开始
  batches.forEach((b, k) => b.reqs.forEach((a) => {
    o += `<g>${circle(sx(a), ya, 3.5, 'ink-f')}${showFrom(a / Tmax, H, S, T)}</g>`;
    o += `<g>${line(sx(a), ya + 4, sx(b.s), yg - 2, 'mute')}${showFrom(b.s / Tmax, H, S, T)}</g>`;
  }));
  batches.forEach((b, k) => {
    o += rect(sx(b.s), yg, sx(b.e) - sx(b.s), 16, 'frame', 2) + growRect(sx(b.s), yg, sx(b.e) - sx(b.s), 16, 'solid', b.s / Tmax, b.e / Tmax, H, S, T);
    o += text((sx(b.s) + sx(b.e)) / 2, yg + 12, 'B=' + b.reqs.length, 'tw', 'middle');
  });
  const ybase = yg + 48;
  o += axes({ sx, sy: (v) => v, x0: 0, x1: Tmax, y0: ybase, y1: ybase, xt: [0, 20, 40, 60, 80, 100, 120].filter((v) => v <= Tmax), xAt: ybase, yAt: 0 }).replace(/<line[^>]*class="axis"\/>$/, '');
  o += text(540, ybase + 30, 'ms', 'ts', 'end');
  o += text(20, ybase + 52, 'batch 的执行时间按 8 ms + 每个 request 1 ms 算。', 'ts') + text(20, ybase + 68, `这 ${arr.length} 个 request 从到达到拿到结果，平均 ${mean.toFixed(1)} ms，最长 ${max.toFixed(1)} ms。`, 'ts');
  o += cursor(sx(0), sx(Tmax), 30, ybase, H, S, T);
  return svgA(560, ybase + 76, o, `动图：request 随机到达，dual-trigger batcher 凑满 4 个或等满 10 ms就发一个 batch，平均 latency ${mean.toFixed(1)} ms`);
}

// ---------- 第 6 站：latency 的分布 ----------
const LAT = (() => {
  const rnd = mulberry(3), N = 1000, xs = [];
  const gauss = () => { const u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  for (let i = 0; i < N; i++) {
    let x = 20 * Math.exp(0.08 * gauss());
    const r = rnd();
    if (r < 0.05) x += 5 + 10 * rnd(); else if (r < 0.06) x += 30 + 30 * rnd();
    xs.push(x);
  }
  const s = [...xs].sort((a, b) => a - b), q = (p) => s[Math.ceil(p * N) - 1];
  return { xs, mean: xs.reduce((a, b) => a + b, 0) / N, med: (s[N / 2 - 1] + s[N / 2]) / 2, p90: q(0.9), p99: q(0.99), max: s[N - 1], N };
})();
function latdist() {
  const { xs, mean, med, p90, p99, max } = LAT;
  const sx = lin(14, 82, 60, 540), bins = new Array(68).fill(0);
  xs.forEach((x) => { const b = Math.floor(x - 14); if (b >= 0 && b < 68) bins[b]++; });
  const top = Math.max(...bins), ymax = Math.ceil(top * 1.4 / 50) * 50, sy = lin(0, ymax, 220, 44);
  let o = text(20, 18, '1000 次 inference 的 latency（1 ms 一格）', 'tb');
  bins.forEach((c, b) => { if (c) o += rect(sx(14 + b) + 0.5, sy(c), sx(15) - sx(14) - 1, Math.max(2, sy(0) - sy(c)), 'solid'); });
  o += axes({ sx, sy, x0: 14, x1: 82, y0: 0, y1: ymax, xt: [20, 30, 40, 50, 60, 70, 80], yt: [0, 100, 200], xl: 'latency（ms）', yl: '次数' });
  const mark = (v, lab, yy, anchor = 'start') => { o += line(sx(v), sy(0), sx(v), yy + 4, 'dash') + text(sx(v) + (anchor === 'start' ? 3 : -3), yy, `${lab} ${v.toFixed(1)}`, 'ts', anchor); };
  mark(med, 'median', sy(top * 1.3), 'end'); mark(mean, 'mean', sy(top * 1.3)); mark(p90, 'p90', sy(top * 1.1)); mark(p99, 'p99', sy(top * 0.6));
  o += text(sx(62), sy(top * 0.35), '1% 的请求落在这里（GC、page fault、', 'ts', 'middle') + text(sx(62), sy(top * 0.35) + 16, 'thermal throttling 一类的停顿）', 'ts', 'middle');
  return svg(560, 262, o, `1000 次 latency 的 histogram：median ${med.toFixed(1)}、mean ${mean.toFixed(1)}、p90 ${p90.toFixed(1)}、p99 ${p99.toFixed(1)} ms，右侧有一条长尾`);
}

// ---------- 第 7 站：一个 bit 翻转 ----------
function bitflip() {
  const bits = '00111101001011000000100000110001'; // 0.042 的 float32
  const cw = 15.5, x0 = 24;
  let o = text(20, 18, 'float32 的 0.042：1 位 sign、8 位 exponent、23 位 mantissa', 'tb');
  const row = (y, bs, flipAt) => {
    for (let i = 0; i < 32; i++) {
      const cls = i === flipAt ? 'solid' : i === 0 ? 'wash2' : i <= 8 ? 'wash' : 'paper';
      o += rect(x0 + i * cw, y, cw, 20, cls) + text(x0 + i * cw + cw / 2, y + 15, bs[i], i === flipAt ? 'tw' : 'ts', 'middle');
    }
  };
  row(34, bits, -1);
  o += text(x0 + cw / 2, 70, 'sign', 'ts', 'middle') + text(x0 + 4.5 * cw + cw / 2, 70, 'exponent = 122', 'ts', 'middle') + text(x0 + 20 * cw, 70, 'mantissa：1.344', 'ts', 'middle');
  o += text(x0, 94, '= 1.344 × 2<tspan class="ts" dy="-6">122 − 127</tspan><tspan dy="6"> = 0.042</tspan>', 't');
  const fl = bits.slice(0, 1) + (bits[1] === '0' ? '1' : '0') + bits.slice(2);
  row(108, fl, 1);
  o += text(x0, 146, 'bit 30（exponent 的最高位）翻成 1：exponent 变成 250', 't');
  o += text(x0, 168, '= 1.344 × 2<tspan class="ts" dy="-6">250 − 127</tspan><tspan dy="6"> ≈ 1.43 × 10³⁷，仍是一个合法的有限数，NaN check 拦不住</tspan>', 'tb');
  // int8
  const q = '00001011', qf = '10001011', y8 = 196;
  o += text(20, y8, '同一个 weight 存成 int8（scale = 0.5/127，q = 11）', 'tb');
  const r8 = (y, bs, flip) => { for (let i = 0; i < 8; i++) o += rect(x0 + i * 22, y, 22, 20, i === flip ? 'solid' : 'paper') + text(x0 + i * 22 + 11, y + 15, bs[i], i === flip ? 'tw' : 'ts', 'middle'); };
  r8(y8 + 10, q, -1); o += text(x0 + 186, y8 + 25, 'q = 11，值 11 × 0.5/127 = 0.043', 't');
  r8(y8 + 38, qf, 0); o += text(x0 + 186, y8 + 53, '最坏的一位（最高位）翻转：q = −117，值 −0.461', 't');
  o += text(20, y8 + 82, 'int8 能表示的值就在 ±0.5 之间，翻哪一位都跑不出这个范围。', 'ts');
  return svg(560, y8 + 90, o, 'float32 的 0.042 翻转 exponent 最高位变成约 1.43 乘 10 的 37 次方；同一个 weight 存成 int8 时最坏翻转只变成负 0.461');
}

export default {
  'cs249r-stages': stages,
  'cs249r-imgsz': imgsz,
  'cs249r-light': light,
  'cs249r-split': split,
  'cs249r-loader': loaderA,
  'cs249r-cache': cacheA,
  'cs249r-tile': tileA,
  'cs249r-im2col': im2col,
  'cs249r-arena': arenaA,
  'cs249r-pipe': pipeA,
  'cs249r-batch': batchA,
  'cs249r-latdist': latdist,
  'cs249r-bitflip': bitflip,
};

export const _data = { ARENA, BATCH, LAT };
