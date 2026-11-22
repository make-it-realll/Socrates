import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 通用小工具 ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const T = (x, y, s, cls = 't', anchor = 'start') => text(x, y, esc(s), cls, anchor);
// 帧序列：durs 是每帧停留的秒数，返回 { kt, dur, show(onArr) }
function frames(durs) {
  const dur = durs.reduce((a, b) => a + b, 0);
  const kt = []; let t = 0;
  for (const s of durs) { kt.push(t / dur); t += s; }
  return { kt, dur, n: durs.length, show: (on) => ashow(on, kt, dur) };
}
// 一个只在某些帧出现的 group
const G = (F, on, body) => `<g>${body}${F.show(on)}</g>`;
const only = (F, i) => Array.from({ length: F.n }, (_, j) => j === i);
const from = (F, i) => Array.from({ length: F.n }, (_, j) => j >= i);
// 一个 cell：方框加居中文字
const cell = (x, y, w, h, s, cls = 'paper', tcls = 't', rx = 4) => rect(x, y, w, h, cls, rx) + T(x + w / 2, y + h / 2 + 5, s, tcls, 'middle');

// ---------- 开头：compiler 把 spin loop 删掉 ----------
function hoist() {
  let o = '';
  o += T(140, 18, '源代码里的 test2', 'tb', 'middle') + T(420, 18, 'g++ -O2 实际生成的（写回 C++）', 'tb', 'middle');
  o += rect(20, 30, 240, 78, 'paper', 8) + rect(300, 30, 240, 78, 'paper', 8);
  o += T(34, 58, 'while (flag == 0) {}') + T(34, 84, 'printf("a=%d b=%d", a, b);');
  o += T(314, 58, 'int ra = a, rb = b;') + T(314, 84, 'printf("a=%d b=%d", ra, rb);');
  o += arrow(262, 69, 298, 69, 'ink');
  o += T(280, 128, '没有 atomic：compiler 假定没有别的 thread 写 flag，loop 要么不转、要么永远转；后者不允许，于是删掉', 'ts', 'middle');
  // 时间轴
  const sx = lin(0, 110, 70, 530), Y = 186;
  o += line(sx(0), Y, sx(110), Y, 'axis');
  for (const v of [0, 50, 100]) o += line(sx(v), Y - 4, sx(v), Y + 4, 'axis') + T(sx(v), Y + 18, v + ' ms', 'ts', 'middle');
  o += T(20, Y - 28, 'test2', 'tb') + T(20, Y + 2, 'test1', 'tb');
  o += circle(sx(0.5), Y - 32, 5, 'ln-f') + T(sx(0.5) + 10, Y - 28, '立刻打印 a=0 b=0', 'tl');
  o += rect(sx(0), Y - 8, sx(100) - sx(0), 10, 'wash2', 2) + T((sx(0) + sx(100)) / 2, Y - 13, 'sleep 100 ms', 'ts', 'middle');
  o += circle(sx(100), Y - 3, 5, 'ink-f') + T(sx(100) - 6, Y + 36, 'a = 1; b = 1; flag = 1;', 'ts', 'middle');
  return svg(560, 228, o, '左边是 test2 的源代码，先 spin 等 flag 再打印；右边是 g++ -O2 生成的代码，loop 没了，直接读 a 和 b。时间轴上 test2 在 0 毫秒就打印了 a=0 b=0，test1 在 100 毫秒才写');
}

// ---------- 开头：store buffering（动图） ----------
function sbA() {
  // 帧：0 两个 read 都得 0（关键帧）；1 buffer 排空；2 复位；3 Core1 写入 buffer；4 Core2 写入 buffer；5 Core1 读 y
  const F = frames([3.2, 1.6, 1.0, 1.4, 1.4, 1.4]);
  let o = '';
  const core = (x, name, l1, l2) => rect(x, 20, 170, 74, 'paper', 8) + T(x + 85, 40, name, 'tb', 'middle') + T(x + 24, 62, l1) + T(x + 24, 84, l2);
  o += core(20, 'Core 1', 'x = 1;', 'r1 = y;') + core(370, 'Core 2', 'y = 1;', 'r2 = x;');
  // 当前执行的那一行的小三角
  const mark = (x, y, on) => G(F, on, poly([[x, y - 5], [x + 8, y], [x, y + 5]], 'ln-f'));
  o += mark(30, 57, [false, false, false, true, false, false]) + mark(30, 79, [true, false, false, false, false, true]);
  o += mark(380, 57, [false, false, false, false, true, false]) + mark(380, 79, [true, false, false, false, false, false]);
  // store buffer
  const buf = (x) => rect(x, 116, 170, 32, 'frame', 4) + T(x + 85, 164, 'store buffer', 'ts', 'middle');
  o += buf(20) + buf(370);
  const inbuf = [true, false, false, true, true, true], inbuf2 = [true, false, false, false, true, true];
  o += G(F, inbuf, cell(60, 120, 90, 24, 'x = 1', 'wash', 'tb'));
  o += G(F, inbuf2, cell(410, 120, 90, 24, 'y = 1', 'wash', 'tb'));
  o += line(105, 94, 105, 116, 'mute') + line(455, 94, 455, 116, 'mute');
  // memory
  o += rect(205, 170, 150, 66, 'paper', 8) + T(280, 188, 'memory', 'ts', 'middle');
  const memv = (x, name, oneOn) => {
    let q = T(x, 222, name + ' =', 't', 'end');
    q += G(F, oneOn.map((v) => !v), T(x + 6, 222, '0', 'tb'));
    q += G(F, oneOn, T(x + 6, 222, '1', 'tl'));
    return q;
  };
  o += memv(250, 'x', [false, true, false, false, false, false]) + memv(320, 'y', [false, true, false, false, false, false]);
  // 读：从 memory 到 core
  o += G(F, [true, false, false, false, false, true], arrow(225, 172, 150, 96, 'ln'));
  o += G(F, [true, false, false, false, false, false], arrow(335, 172, 410, 96, 'ln'));
  o += G(F, [true, false, false, false, false, true], T(196, 36, 'r1 = 0', 'tl', 'start'));
  o += G(F, [true, false, false, false, false, false], T(364, 36, 'r2 = 0', 'tl', 'end'));
  o += G(F, [false, true, false, false, false, false], T(280, 36, 'r1 = 0, r2 = 0', 'tl', 'middle'));
  // 排空的箭头
  o += G(F, [false, true, false, false, false, false], arrow(150, 148, 215, 190, 'mute') + arrow(410, 148, 345, 190, 'mute'));
  const cap = ['两个 read 都从 memory 读到 0：两个 write 还在各自的 buffer 里', '之后两个 buffer 才排空，memory 变成 x = 1, y = 1', '重新开始：x = y = 0', 'Core 1 执行 x = 1：只进了自己的 store buffer', 'Core 2 执行 y = 1：同样只进 buffer', 'Core 1 读 y：buffer 里没有 y，去 memory 读，得 0'];
  cap.forEach((s, i) => { o += G(F, only(F, i), T(280, 260, s, 'ts', 'middle')); });
  return svgA(560, 268, o, '动图：两个 core 各自先写一个变量再读另一个。写入停在各自的 store buffer 里，两个读都从 memory 读到 0，之后 buffer 才排空');
}

// ---------- 第 1 站：check-then-act ----------
function checkact() {
  let o = '';
  const X1 = 150, X2 = 300, XQ = 470;
  o += T(X1, 20, 'Consumer C1', 'tb', 'middle') + T(X2, 20, 'Consumer C2', 'tb', 'middle') + T(XQ, 20, 'queue', 'tb', 'middle');
  o += T(30, 20, '时间', 'ts') + arrow(40, 30, 40, 238, 'axis');
  const rows = [
    [1, 'empty() → false', '', ['J']],
    [2, '', 'empty() → false', ['J']],
    [1, 'front() → J', '', ['J']],
    [2, '', 'front() → J', ['J']],
    [1, 'pop()', '', []],
    [2, '', 'pop()：空 queue', null],
  ];
  rows.forEach(([who, a, b, q], i) => {
    const y = 50 + i * 32;
    o += line(60, y + 10, 540, y + 10, 'grid');
    if (a) o += cell(X1 - 62, y - 8, 124, 26, a, 'paper', 't', 5);
    if (b) o += cell(X2 - 66, y - 8, 132, 26, b, i === 5 ? 'wash-strong' : 'paper', i === 5 ? 'tb' : 't', 5);
    if (q === null) o += T(XQ, y + 9, '未定义行为', 'tl', 'middle');
    else if (q.length) o += cell(XQ - 15, y - 8, 30, 26, 'J', 'wash', 'tb');
    else o += rect(XQ - 15, y - 8, 30, 26, 'frame', 4) + T(XQ + 24, y + 9, '空', 'ts');
  });
  o += T(290, 254, '两个 empty() 都发生在任何 pop() 之前；J 被两人各取一次，第二次 pop 落在空 queue 上', 'ts', 'middle');
  return svg(560, 262, o, '时间从上往下。C1 和 C2 先后调用 empty 都得到 false，再各自 front 得到同一个 J，C1 pop 之后 queue 空了，C2 再 pop 是未定义行为');
}

// ---------- 第 1 站：两把 lock 顺序相反 ----------
function deadlock() {
  let o = '';
  o += T(130, 20, '执行顺序', 'tb', 'middle');
  const steps = [['f', 'lock(m)', '拿到 m'], ['g', 'slot.acquire()', '拿到 slot（1 → 0）'], ['f', 'slot.acquire()', '等 slot'], ['g', 'lock(m)', '等 m']];
  steps.forEach(([who, op, res], i) => {
    const y = 44 + i * 44;
    o += T(24, y + 17, String(i + 1), 'tb');
    o += cell(40, y, 34, 26, who, who === 'f' ? 'wash' : 'wash2', 'tb', 5);
    o += T(84, y + 17, op) + T(84, y + 35, res, i >= 2 ? 'tl' : 'ts');
  });
  // wait-for graph
  const cx = 410, cy = 128;
  const P = { f: [cx - 90, cy], g: [cx + 90, cy], m: [cx, cy - 72], s: [cx, cy + 72] };
  o += T(cx, 20, 'wait-for graph', 'tb', 'middle');
  o += circle(...P.f, 24, 'wash') + circle(...P.f, 24, 'ink') + T(P.f[0], P.f[1] + 5, 'f', 'tb', 'middle');
  o += circle(...P.g, 24, 'wash2') + circle(...P.g, 24, 'ink') + T(P.g[0], P.g[1] + 5, 'g', 'tb', 'middle');
  o += cell(P.m[0] - 30, P.m[1] - 15, 60, 30, 'm', 'paper', 'tb');
  o += cell(P.s[0] - 30, P.s[1] - 15, 60, 30, 'slot', 'paper', 'tb');
  // m 被 f 持有（m → f），f 等 slot（f → slot），slot 被 g 持有（slot → g），g 等 m（g → m）
  o += arrow(P.m[0] - 30, P.m[1] + 8, P.f[0] + 10, P.f[1] - 22, 'ink') + T(cx - 92, cy - 56, '持有', 'ts', 'middle');
  o += arrow(P.f[0] + 12, P.f[1] + 21, P.s[0] - 32, P.s[1] - 6, 'ln') + T(cx - 92, cy + 66, '等', 'tl', 'middle');
  o += arrow(P.s[0] + 30, P.s[1] - 8, P.g[0] - 10, P.g[1] + 22, 'ink') + T(cx + 92, cy + 66, '持有', 'ts', 'middle');
  o += arrow(P.g[0] - 12, P.g[1] - 21, P.m[0] + 32, P.m[1] + 6, 'ln') + T(cx + 92, cy - 56, '等', 'tl', 'middle');
  o += T(cx, cy + 5, 'cycle', 'ts', 'middle');
  return svg(560, 232, o, '左边四步：f 拿到 m，g 拿到 slot，f 等 slot，g 等 m。右边的 wait-for graph 里 m 被 f 持有、f 等 slot、slot 被 g 持有、g 等 m，成为一个 cycle');
}

// ---------- 第 2 站：Mesa semantics（动图） ----------
function mesaA() {
  // 帧 0 = S4（关键帧），然后 S1、S2、S3，循环回 S4
  const F = frames([4.2, 2.4, 2.4, 2.4]);
  let o = '';
  const Z = { q: [20, 30, 300, 68], m: [20, 112, 300, 92], w: [20, 218, 300, 68] };
  o += rect(...Z.q, 'frame', 6) + T(30, Z.q[1] + 17, '等 lock 的队伍', 'ts');
  o += rect(...Z.m, 'wash2', 6) + T(30, Z.m[1] + 17, '在 monitor 里（拿着 lock）', 'ts');
  o += rect(...Z.w, 'frame', 6) + T(30, Z.w[1] + 17, '在 not_full 上睡着', 'ts');
  // buffer（容量 1）
  const BX = 210, BY = 138;
  o += rect(BX, BY, 52, 44, 'paper', 5) + T(BX + 26, BY + 60, 'buffer（容量 1）', 'ts', 'middle');
  const bufItem = ['b', 'a', '', 'b'];
  bufItem.forEach((s, i) => { if (s) o += G(F, only(F, i), T(BX + 26, BY + 28, s, 'tb', 'middle')); });
  // 溢出的 c
  o += G(F, only(F, 0), cell(BX + 62, BY + 8, 30, 28, 'c', 'wash-strong', 'tb', 5) + T(BX + 77, BY - 4, '✗', 'tl', 'middle'));
  // 线程位置：每帧一个 (zone, slot)
  const slotXY = (z, k) => [Z[z][0] + 34 + k * 54, Z[z][1] + (z === 'm' ? 56 : 50)];
  const pos = {
    P1: [['m', 0], ['w', 0], ['q', 1], ['q', 0]],
    P2: [null, ['q', 1], ['q', 0], ['m', 0]],
    C1: [null, ['q', 0], ['m', 0], null],
  };
  for (const [name, ps] of Object.entries(pos)) {
    ps.forEach((p, i) => {
      if (!p) return;
      const [x, y] = slotXY(...p);
      const cls = name === 'P1' ? 'ln-f' : name[0] === 'C' ? 'ink-f' : 'mute-f';
      o += G(F, only(F, i), circle(x, y - 5, 17, cls) + T(x, y, name, 'tw', 'middle'));
    });
  }
  // 右侧日志
  const X = 340;
  o += T(X, 40, '发生的事', 'tb');
  const log = ['① P1 看到满，wait：放 lock、睡下', '② C1 取走 a，notify：P1 去排队', '③ P2 先拿到 lock：不满，放入 b', '④ P1 拿到 lock，wait 返回'];
  const vis = [[true, true, false, false], [true, true, true, false], [true, true, true, true], [true, false, false, false]];
  // vis[k][i]：第 k 行在第 i 帧（0..3 = S4,S1,S2,S3）是否显示
  const order = [3, 0, 1, 2]; // 帧 i 对应的步骤编号
  log.forEach((s, k) => { const on = Array.from({ length: 4 }, (_, i) => order[i] >= k); o += G(F, on, T(X, 70 + k * 26, s, k === order[0] ? 't' : 't')); });
  o += G(F, only(F, 0), T(X, 184, '用 if：不再检查，把 c 写进', 'tl') + T(X, 204, '满的 buffer', 'tl') + T(X, 232, '用 while：再看一次，满，', 'ts') + T(X, 250, '重新 wait', 'ts'));
  return svgA(560, 292, o, '动图：容量为 1 的 buffer。P1 看到满就 wait；C1 取走 a 并 notify，P1 去排队；P2 先拿到 lock 放入 b；P1 拿到 lock 时 buffer 又满了，用 if 会把 c 写进满的 buffer');
}

// ---------- 第 2 站：H2O ----------
function h2o() {
  let o = '';
  const atom = (x, y, s, cls) => circle(x, y, 13, cls) + T(x, y + 5, s, cls === 'ink-f' || cls === 'ln-f' ? 'tw' : 'tb', 'middle');
  const LO = 70, LH = 170; // 两条 lane 的 y
  o += T(20, LO - 30, 'O 的 lane', 'ts') + T(20, LH + 44, 'H 的 lane', 'ts');
  // 等着的
  for (const [i, x] of [[0, 60], [1, 92]].map((a) => a)) o += atom(x, LO, 'O', 'paper');
  for (const x of [40, 72, 104]) o += atom(x, LH, 'H', 'paper');
  o += T(76, LO + 34, '在 semaphore 前等', 'ts', 'middle');
  // semaphore 门
  const gate = (x, y, h, lab, ly) => rect(x, y - h / 2, 22, h, 'solid2', 3) + T(x + 11, ly, lab, 'ts', 'middle');
  o += gate(140, LO, 40, 'o_sem：1 个 permit', LO - 30) + gate(140, LH, 70, 'h_sem：2 个 permit', LH + 52);
  // 过了 semaphore、在 barrier 前
  o += atom(210, LO, 'O', 'ln-f');
  o += atom(200, LH - 16, 'H', 'ln-f') + atom(230, LH + 16, 'H', 'ln-f');
  // barrier
  o += line(280, 30, 280, 222, 'ink-b') + T(280, 238, 'barrier(3)', 'ts', 'middle');
  o += T(292, 108, '3 个 holder', 'tl') + T(292, 126, '凑齐', 'tl');
  o += arrow(292, 140, 350, 140, 'ln');
  // bond
  const B = [440, 120];
  o += line(B[0], B[1], B[0] - 34, B[1] + 28, 'ink-b') + line(B[0], B[1], B[0] + 34, B[1] + 28, 'ink-b');
  o += atom(B[0], B[1], 'O', 'ln-f') + atom(B[0] - 34, B[1] + 28, 'H', 'ln-f') + atom(B[0] + 34, B[1] + 28, 'H', 'ln-f');
  o += T(B[0], B[1] - 26, 'bond()，然后各自 release', 'ts', 'middle');
  o += T(280, 264, '任何时刻 holder 最多 1 个 O、2 个 H；barrier 的一轮要 3 个 holder 同时在场', 'ts', 'middle');
  return svg(560, 272, o, 'H2O：O 和 H 各自排队过 semaphore，O 的 semaphore 只有 1 个 permit，H 的有 2 个；过了 semaphore 的三个原子在 barrier 前凑齐后一起 bond');
}

// ---------- 第 3 站：ARM 上的 message passing（动图） ----------
function armA() {
  // 帧：0 关键帧（r1=1, r2=0，x 还在路上）；1 x 到达；2 复位；3 Core 1 写两次；4 y 先到；5 读 y 得 1
  const F = frames([3.4, 1.6, 1.0, 1.6, 1.6, 1.4]);
  let o = '';
  const box = (x, name, l1, l2) => rect(x, 20, 160, 70, 'paper', 8) + T(x + 80, 40, name, 'tb', 'middle') + T(x + 22, 62, l1) + T(x + 22, 82, l2);
  o += box(20, 'Core 1', 'x = 1;', 'y = 1;') + box(380, 'Core 2', 'r1 = y;', 'r2 = x;');
  const copy = (x, lab) => rect(x, 120, 160, 70, 'frame', 8) + T(x + 80, 206, lab, 'ts', 'middle');
  o += copy(20, 'Core 1 看到的 memory') + copy(380, 'Core 2 看到的 memory');
  const val = (x, y, name, ones) => T(x, y, name + ' =', 't', 'end') + G(F, ones.map((v) => !v), T(x + 6, y, '0', 'tb')) + G(F, ones, T(x + 6, y, '1', 'tl'));
  o += val(80, 150, 'x', [true, true, false, true, true, true]) + val(80, 176, 'y', [true, true, false, true, true, true]);
  o += val(440, 150, 'x', [false, true, false, false, false, false]) + val(440, 176, 'y', [true, true, false, false, true, true]);
  // 在路上的两个 write
  const flight = (y, s, on) => G(F, on, arrow(190, y, 370, y, 'ln-dash') + T(280, y - 6, s, 'tl', 'middle'));
  o += flight(146, 'x = 1 还在路上', [true, false, false, true, true, true]);
  o += flight(172, 'y = 1 还在路上', [false, false, false, true, false, false]);
  o += G(F, [false, false, false, false, true, true], T(280, 172 - 6, 'y = 1 已到', 'ts', 'middle'));
  o += G(F, [true, false, false, false, false, true], T(366, 62, 'r1 = 1', 'tl', 'end'));
  o += G(F, [true, false, false, false, false, false], T(366, 82, 'r2 = 0', 'tl', 'end'));
  o += G(F, [false, true, false, false, false, false], T(366, 72, 'r1 = 1, r2 = 0', 'tl', 'end'));
  const cap = ['Core 2 读 y 得 1，读 x 得 0：x = 1 还没传到', '之后 x = 1 才到达 Core 2', '重新开始：两边都是 0', 'Core 1 依次写 x、y，两个 write 各自出发', 'y = 1 先到了 Core 2', 'Core 2 读 y，得 1'];
  cap.forEach((s, i) => { o += G(F, only(F, i), T(280, 236, s, 'ts', 'middle')); });
  return svgA(560, 246, o, '动图：ARM 的模型里每个 core 有自己看到的 memory。Core 1 先写 x 再写 y，y 先传到 Core 2，Core 2 读 y 得 1、读 x 得 0，然后 x 才传到');
}

// ---------- 第 4 站：release/acquire 的 happens-before ----------
function hb() {
  let o = '';
  const X1 = 110, X2 = 360, W = 200;
  o += T(X1, 20, 'Thread 1', 'tb', 'middle') + T(X2, 20, 'Thread 2', 'tb', 'middle');
  const node = (x, y, lab, s, cls = 'paper') => rect(x - W / 2, y - 16, W, 32, cls, 6) + T(x - W / 2 + 10, y + 5, lab, 'tb') + T(x - W / 2 + 28, y + 5, s);
  const Ya = 56, Yb = 128, Yp = 128, Yq = 200;
  o += node(X1, Ya, 'a', 'x.store(1, relaxed)') + node(X1, Yb, 'b', 'y.store(2, release)', 'wash');
  o += node(X2, Yp, 'p', 'y.load(acquire) 读到 2', 'wash') + node(X2, Yq, 'q', 'x.load(relaxed)');
  o += arrow(X1, Ya + 16, X1, Yb - 16, 'ink') + T(X1 + 8, (Ya + Yb) / 2 + 4, 'sb', 'ts');
  o += arrow(X2, Yp + 16, X2, Yq - 16, 'ink') + T(X2 + 8, (Yp + Yq) / 2 + 4, 'sb', 'ts');
  o += arrow(X1 + W / 2, Yb, X2 - W / 2, Yp, 'ln') + T((X1 + X2) / 2, Yb - 8, 'sw', 'tl', 'middle');
  o += path(`M${X1 - W / 2 - 6} ${Ya} C ${X1 - W / 2 - 60} ${Ya + 120}, ${X2 - W / 2 - 80} ${Yq + 30}, ${X2 - W / 2} ${Yq + 4}`, 'dash');
  o += poly([[X2 - W / 2, Yq + 4], [X2 - W / 2 - 9, Yq + 1], [X2 - W / 2 - 7, Yq + 10]], 'ink-f');
  o += T(X1 - 30, Yq + 26, 'a hb q', 'tb', 'middle');
  // x 的 mo
  o += T(490, 56, 'x 的 mo', 'ts', 'middle');
  o += cell(465, 68, 50, 28, '0', 'paper', 't') + arrow(490, 96, 490, 118, 'mute') + cell(465, 120, 50, 28, '1', 'wash', 'tb');
  o += T(490, 166, 'q 只能读 1', 'tl', 'middle');
  return svg(560, 236, o, 'Thread 1 的 a 和 b、Thread 2 的 p 和 q，各自用 sb 连接；b 和 p 之间是 sw；于是 a happens-before q，q 只能读到 x 的 modification order 里不早于 1 的值，也就是 1');
}

// ---------- 第 4 站：modification order 上的 cycle ----------
function mo() {
  let o = '';
  const C = [280, 112], R = 70;
  const P = { 6: [C[0], C[1] - R], 3: [C[0] + R * 1.25, C[1] + R * 0.7], 4: [C[0] - R * 1.25, C[1] + R * 0.7] };
  for (const [k, p] of Object.entries(P)) o += circle(p[0], p[1], 20, 'wash') + circle(p[0], p[1], 20, 'ink') + T(p[0], p[1] + 6, k, 'tb', 'middle');
  const edge = (a, b, lab, lx, ly, anchor) => {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    return arrow(x1 + ux * 22, y1 + uy * 22, x2 - ux * 23, y2 - uy * 23, 'ln') + T(lx, ly, lab, 'ts', anchor);
  };
  o += edge(6, 3, 'Thread 3：先读到 6，后读到 3', C[0] + 58, C[1] - 40, 'start');
  o += edge(3, 4, 'Thread 4：先读到 3，后读到 4', C[0], C[1] + R * 0.7 + 34, 'middle');
  o += edge(4, 6, 'Thread 2：先写 4，后写 6', C[0] - 58, C[1] - 40, 'end');
  o += T(C[0], C[1] + 22, 'mo 里', 'ts', 'middle');
  o += T(C[0], 236, '箭头表示“在 x 的 modification order 里排在前面”；三条连成 cycle，B 不可能', 'ts', 'middle');
  return svg(560, 246, o, '三个值 6、3、4 之间的三条先后关系：6 在 3 前（Thread 3 的两次读），3 在 4 前（Thread 4 的两次读），4 在 6 前（Thread 2 的两次写），连成一个 cycle');
}

// ---------- 第 4 站：三种 mo 与可能的读值 ----------
function q2() {
  const orders = [[1, 2, 3], [1, 3, 2], [3, 1, 2]];
  let o = T(30, 20, 'x 的 modification order', 'tb') + T(390, 20, '两次读可能的输出', 'tb');
  orders.forEach((ord, r) => {
    const y = 40 + r * 62, mo = [0, ...ord], pos = Object.fromEntries(mo.map((v, i) => [v, i]));
    mo.forEach((v, i) => {
      const x = 30 + i * 80, ok = pos[v] >= pos[1];
      o += cell(x, y, 46, 30, String(v), ok ? 'wash' : 'paper', ok ? 'tb' : 'ts');
      if (i) o += arrow(x - 32, y + 15, x - 3, y + 15, 'mute');
    });
    const pairs = [];
    for (const a of ord) for (const b of ord) if (pos[a] >= pos[1] && pos[b] >= pos[a]) pairs.push(`${a}${b}`);
    o += T(390, y + 20, pairs.join('  '), 't');
  });
  o += T(30, 236, '浅色是不早于 1 的位置；第二次读不能比第一次在 mo 里更早', 'ts');
  return svg(560, 246, o, 'x 的三种 modification order：0,1,2,3；0,1,3,2；0,3,1,2。每种只有不早于 1 的值能被读到，第二次读不早于第一次，分别给出 6、6、3 种输出');
}

// ---------- 第 4 站：release sequence ----------
function relseq() {
  let o = '';
  const panel = (y0, title, second, okSync) => {
    let q = T(20, y0, title, 'tb');
    const y = y0 + 18;
    q += cell(30, y, 40, 30, '0', 'paper', 't');
    q += arrow(72, y + 15, 98, y + 15, 'mute');
    q += cell(100, y, 150, 30, '1：T1 store(release)', 'wash', 't');
    q += arrow(252, y + 15, 278, y + 15, 'mute');
    q += cell(280, y, 160, 30, second, 'paper', 't');
    // release sequence 的括号
    const x1 = 100, x2 = okSync ? 440 : 250;
    q += path(d([[x1, y + 40], [x1, y + 46], [x2, y + 46], [x2, y + 40]]), 'ln');
    q += T((x1 + x2) / 2, y + 62, 'T1 store 的 release sequence', 'tl', 'middle');
    // T3 的 load
    q += cell(462, y, 90, 30, 'T3 读到 2', 'wash2', 't');
    q += arrow(462, y + 15, 442, y + 15, 'ink');
    q += T(507, y + 50, okSync ? 'sw 接到 T1' : 'sw 只到 T2', okSync ? 'tl' : 'tb', 'middle');
    q += T(507, y + 66, okSync ? '一定打印 1' : '可以打印 0', 'ts', 'middle');
    return q;
  };
  o += panel(20, 'T2 做 fetch_add(1)：RMW 不打断 release sequence', '2：T2 fetch_add', true);
  o += panel(132, 'T2 做 load 再 store(2, release)：普通 store 把它打断', '2：T2 store(release)', false);
  return svg(560, 226, o, '上面：z 的 modification order 是 0、T1 的 release store 写的 1、T2 的 fetch_add 写的 2，release sequence 包含 2，T3 读到 2 时和 T1 同步。下面：2 由 T2 的普通 store 写出，release sequence 只有 1，T3 只和 T2 同步');
}

// ---------- 第 4 站：seq_cst 与 acquire/release 的四个 thread ----------
function iriw() {
  let o = '';
  // 左：seq_cst 的一条时间线
  o += T(140, 20, 'seq_cst：一条所有人同意的 S', 'tb', 'middle');
  const ev = [['T1', 'x = true'], ['T3', '读 x：true'], ['T3', '读 y：false'], ['T2', 'y = true'], ['T4', '读 y：true'], ['T4', '读 x：true，z++']];
  o += arrow(30, 40, 30, 232, 'axis');
  ev.forEach(([t, s], i) => {
    const y = 50 + i * 30;
    o += circle(30, y + 8, 4, 'ink-f') + T(44, y + 13, t, 'tb') + T(76, y + 13, s, i === 5 ? 'tl' : 't');
  });
  o += T(150, 248, 'y 写在 T3 读 y 之后，x 写得更早，T4 必然看到 x', 'ts', 'middle');
  // 右：acq/rel 下各自的视角
  o += T(420, 20, 'acquire/release：各看各的', 'tb', 'middle');
  const view = (y0, who, first, second, r) => {
    let q = T(300, y0, who + ' 看到的顺序', 'ts');
    q += cell(300, y0 + 10, 110, 28, first, 'wash', 't') + arrow(412, y0 + 24, 428, y0 + 24, 'mute') + cell(430, y0 + 10, 110, 28, second, 'paper', 'ts');
    q += T(300, y0 + 58, r, 't');
    return q;
  };
  o += view(50, 'T3', 'x = true', 'y = true（还没到）', '读 x：true，读 y：false');
  o += view(130, 'T4', 'y = true', 'x = true（还没到）', '读 y：true，读 x：false');
  o += T(420, 220, '没有人执行 z++，z = 0', 'tl', 'middle');
  o += T(420, 248, '两条 sw 都成立，没有任何 hb 被违反', 'ts', 'middle');
  return svg(560, 258, o, '左边 seq_cst：六个 operation 排在一条时间线上，T3 读 y 为 false 时，T4 后来读 x 一定是 true。右边 acquire/release：T3 看到 x 先写、T4 看到 y 先写，两人都不执行 z++');
}

// ---------- 第 5 站：ABA（动图） ----------
function abaA() {
  // 帧 0 = T1 的 CAS（关键帧）；1 T1 读完被换下；2 T2 pop A；3 T2 pop B；4 T2 push D（重用 0x20）
  const F = frames([4.6, 2.4, 1.8, 1.8, 2.2]);
  let o = '';
  const X = 40, W = 120, H = 30;
  const topCell = (ptr, gen) => cell(X, 40, 150, H, `top = (${ptr}, gen ${gen})`, 'wash', 'tb');
  const nodeAt = (y, name, addr, cls = 'paper') => cell(X + 15, y, W, H, `${name} @ ${addr}`, cls, cls === 'wash2' ? 'ts' : 't');
  const down = (y) => arrow(X + 75, y, X + 75, y + 18, 'ink');
  const states = [
    // [top ptr, gen, 节点列表, freed 列表]
    ['0x30', 3, [], [['B', '0x30']]],
    ['0x20', 0, [['A', '0x20'], ['B', '0x30'], ['C', '0x40']], []],
    ['0x30', 1, [['B', '0x30'], ['C', '0x40']], [['A', '0x20']]],
    ['0x40', 2, [['C', '0x40']], [['A', '0x20'], ['B', '0x30']]],
    ['0x20', 3, [['D', '0x20'], ['C', '0x40']], [['B', '0x30']]],
  ];
  states.forEach(([ptr, gen, nodes, freed], i) => {
    let q = topCell(ptr, gen);
    let y = 70;
    q += down(y); y += 20;
    nodes.forEach((n, k) => { q += nodeAt(y, ...n); y += H; if (k < nodes.length - 1) { q += down(y); y += 20; } });
    if (i === 0) q += cell(X + 15, y, W + 20, H, 'B @ 0x30（已 free）', 'wash2', 'ts') + T(X + 85, y + 54, '指向已 delete 的 node', 'tl', 'middle');
    else if (freed.length) q += T(X + 75, 230, '已 delete：' + freed.map((f) => f[0] + ' @ ' + f[1]).join('，'), 'ts', 'middle');
    o += G(F, only(F, i), q);
  });
  // 右边：T1 的本地变量和日志
  const RX = 250;
  o += rect(RX, 30, 300, 52, 'paper', 6) + T(RX + 12, 50, 'T1 手里：old = (0x20, gen 0)', 't') + T(RX + 12, 70, 'old->next = 0x30（当时的 B）', 't');
  const log = ['① T1 读 top 和 next，被换下', '② T2 pop A，delete A', '③ T2 pop B，delete B', '④ T2 push D，new 恰好给了 0x20'];
  const step = [4, 0, 1, 2, 3]; // 帧 i 已发生到第几步（0 起）
  log.forEach((s, k) => { o += G(F, Array.from({ length: 5 }, (_, i) => step[i] >= k), T(RX, 108 + k * 22, s, 't')); });
  o += G(F, only(F, 0), T(RX, 206, '⑤ T1 回来做 CAS：', 'tb') + T(RX, 226, '只比 pointer：0x20 相等，成功，top = 0x30', 'tl') + T(RX, 246, '比 (pointer, gen)：gen 0 ≠ 3，失败，重读', 'ts'));
  return svgA(560, 256, o, '动图：stack 从 top 起是 A、B、C。T1 读到 top 是 0x20、next 是 0x30 后被换下；T2 pop 掉 A 和 B 并 delete，再 push 一个 D，地址恰好是 0x20；T1 的 CAS 只比较 pointer 就成功，把 top 设成已经 delete 的 0x30；带 generation counter 时 CAS 失败');
}

// ---------- 第 5 站：lock-free queue 断开的一段 ----------
function lfq() {
  let o = '';
  const Y = 90, H = 52;
  const nd = (x, name, job, next, cls) => rect(x, Y, 110, H, cls, 6) + T(x + 55, Y - 8, name, 'ts', 'middle') + T(x + 10, Y + 22, 'job: ' + job) + T(x + 10, Y + 42, 'next: ' + next);
  o += nd(40, 'D0（T1 抢到的）', '还没写', 'null', 'wash');
  o += nd(230, 'D1（T2 的 node）', '34', 'D2', 'paper');
  o += nd(420, 'D2（新 dummy）', '—', 'null', 'paper');
  o += arrow(340, Y + 26, 418, Y + 26, 'ink');
  o += line(150, Y + 26, 228, Y + 26, 'dash') + T(189, Y + 18, '断开', 'tl', 'middle');
  o += T(189, Y + 76, 'T1 还没执行', 'ts', 'middle') + T(189, Y + 94, 'D0.next = D1', 'ts', 'middle');
  // front / back
  o += T(95, 30, 'front', 'tb', 'middle') + arrow(95, 36, 95, Y - 16, 'ink');
  o += T(475, 30, 'back', 'tb', 'middle') + arrow(475, 36, 475, Y - 16, 'ink');
  o += T(40, 222, 'T2 的 try_pop：从 front 看 D0.next 是 null，判断为空，返回 nullopt', 'tl');
  o += T(40, 244, '可是 T2 自己的 enqueue(34) 已经返回了', 'ts');
  return svg(560, 254, o, '队列里有三个 node：front 指向 D0，T1 抢到了它但还没写 job、没接 next；D1 是 T2 enqueue 的 34，接到新 dummy D2，back 指向 D2。D0 和 D1 之间断开，try_pop 从 front 看到 next 为空，返回 nullopt');
}

// ---------- 第 6 站：channel 上传 counter 的 deadlock（动图） ----------
function tokenA() {
  // 帧 0 = deadlock（关键帧）；1 main 送出 0 给 G1；2 G1 送出 1 给 G2，G1 Done；3 main 进入 Wait，G2 加到 2
  const F = frames([4.2, 2.2, 2.2, 2.2]);
  let o = '';
  const cols = [['main', 90], ['G1', 280], ['G2', 470]];
  for (const [n, x] of cols) o += rect(x - 80, 24, 160, 34, 'paper', 6) + T(x, 46, n, 'tb', 'middle');
  const st = {
    main: ['wg.Wait()：等 Done', 'ch <- 0：交给 G1', '往下走到 wg.Wait()', 'wg.Wait()：等 Done'],
    G1: ['已结束', 'count := <-ch 得 0', 'count = 1；ch <- 1 交给 G2；Done', '已结束'],
    G2: ['ch <- 2：等 receiver', 'count := <-ch：等', 'count := <-ch 得 1', 'count = 2'],
  };
  const hot = { main: [true, false, false, true], G1: [false, false, false, false], G2: [true, false, false, false] };
  for (const [n, x] of cols) st[n].forEach((s, i) => {
    const parts = s.split('；');
    o += G(F, only(F, i), parts.map((p, k) => T(x, 84 + k * 20, p, hot[n][i] ? 'tl' : 't', 'middle')).join(''));
  });
  // token 的位置
  const tok = [null, [185, 140, '0'], [375, 140, '1'], null];
  tok.forEach((p, i) => { if (p) o += G(F, only(F, i), arrow(p[0] - 70, 140, p[0] + 70, 140, 'ln') + circle(p[0], 140, 14, 'ln-f') + T(p[0], 145, p[2], 'tw', 'middle')); });
  o += G(F, only(F, 0), circle(470, 150, 14, 'ln-f') + T(470, 155, '2', 'tw', 'middle') + T(470, 182, '送不出去', 'ts', 'middle'));
  // wg 计数
  const wg = ['1', '2', '1', '1'];
  wg.forEach((v, i) => { o += G(F, only(F, i), T(90, 160, 'wg 计数 = ' + v, 'ts', 'middle')); });
  const cap = ['main 等 G2 的 Done，G2 等 main 来 receive：all goroutines are asleep', '① main 把 0 送进 unbuffered 的 ch，G1 接住', '② G1 加 1，把 1 交给 G2，然后 Done', '③ main 走到 wg.Wait()，G2 加到 2，接下来要 send'];
  cap.forEach((s, i) => { o += G(F, only(F, i), T(280, 222, s, i ? 'ts' : 'tl', 'middle')); });
  return svgA(560, 234, o, '动图：main 把 0 送给 G1，G1 加 1 后送给 G2 并 Done，main 进入 wg.Wait，G2 加到 2 后要 send，却没有 receiver，main 也在等 G2 的 Done，deadlock');
}

// ---------- 第 6 站：Go server 的 pipeline ----------
function pipeline() {
  let o = '';
  const box = (x, y, w, h, s, cls = 'paper', tcls = 't') => cell(x, y, w, h, s, cls, tcls, 6);
  const chan = (x, y, lab) => { let q = ''; for (let k = 0; k < 4; k++) q += rect(x + k * 14, y, 14, 26, k < 2 ? 'wash' : 'frame', 1); return q + T(x + 28, y - 8, lab, 'tb', 'middle'); };
  // 上排：client reader → SQ → workers → CQ
  o += box(10, 40, 90, 30, 'client A 读') + box(10, 90, 90, 30, 'client B 读');
  o += chan(140, 66, 'SQ');
  for (let k = 0; k < 3; k++) o += box(250, 30 + k * 40, 90, 30, 'worker ' + (k + 1), 'wash2');
  o += chan(380, 66, 'CQ');
  o += arrow(100, 55, 138, 75, 'ink') + arrow(100, 105, 138, 84, 'ink');
  for (let k = 0; k < 3; k++) { o += arrow(198, 79, 248, 45 + k * 40, 'mute'); o += arrow(340, 45 + k * 40, 378, 79, 'mute'); }
  o += T(295, 164, 'W 个 worker：process()', 'ts', 'middle');
  // 下排：dispatcher → 每个 client 的 response channel → writer
  const Y2 = 192;
  o += line(436, 79, 495, 79, 'ink') + arrow(495, 79, 495, Y2 - 2, 'ink');
  o += box(440, Y2, 110, 30, 'W 个分发者', 'wash2');
  o += arrow(438, Y2 + 15, 360, Y2 - 2, 'ink') + arrow(438, Y2 + 15, 360, Y2 + 34, 'ink');
  o += chan(300, Y2 - 14, '') + chan(300, Y2 + 22, '') ;
  o += T(330, Y2 + 68, '每个 request 带着的 response channel', 'ts', 'middle');
  o += box(150, Y2 - 16, 100, 28, 'client A 写') + box(150, Y2 + 20, 100, 28, 'client B 写');
  o += arrow(298, Y2 - 1, 252, Y2 - 2, 'ink') + arrow(298, Y2 + 35, 252, Y2 + 34, 'ink');
  o += T(70, Y2 + 6, '写回', 'ts', 'middle') + T(70, Y2 + 22, 'connection', 'ts', 'middle');
  o += arrow(148, Y2 - 2, 108, Y2 + 2, 'mute') + arrow(148, Y2 + 34, 108, Y2 + 16, 'mute');
  return svg(560, 276, o, 'Go server 的 pipeline：两个 client 的读 goroutine 把 request 送进 SQ，三个 worker 从 SQ 取出处理后送进 CQ，分发者按 request 带的 response channel 把结果交给对应 client 的写 goroutine');
}

// ---------- 第 7 站：borrow 的 lifetime ----------
function borrow() {
  let o = '';
  const lines = ['let mut x = 1;', 'let y = &amp;mut x;', 'x = 2;', '*y += 1;'];
  o += rect(14, 40 + 2 * 34 - 14, 532, 26, 'wash', 4);
  lines.forEach((s, i) => { const y = 40 + i * 34; o += T(24, y + 5, String(i + 1), 'ts') + text(48, y + 5, s, 't'); });
  const sx = 230;
  o += T(sx + 40, 18, 'x（owner）', 'tb', 'middle') + T(sx + 150, 18, 'y：&mut x', 'tb', 'middle');
  o += rect(sx + 30, 28, 20, 4 * 34 - 4, 'wash2', 4);
  o += rect(sx + 140, 28 + 34, 20, 3 * 34 - 4, 'wash-strong', 4);
  o += T(sx + 172, 28 + 34 + 16, '从创建', 'ts') + T(sx + 172, 28 + 4 * 34 - 14, '到最后一次使用', 'ts');
  o += T(540, 40 + 2 * 34 + 5, '✗ E0506', 'tl', 'end');
  return svg(560, 176, o, '四行代码旁边画着两条 lifetime：x 从第 1 行到第 4 行；y 对 x 的 exclusive borrow 从第 2 行到第 4 行。第 3 行给 x 赋值落在 borrow 期间，编译器报 E0506');
}

// ---------- 第 7 站：Arc<Mutex<i32>> ----------
function arc() {
  let o = '';
  for (let k = 0; k < 3; k++) {
    const y = 40 + k * 62;
    o += rect(20, y, 130, 44, 'paper', 6) + T(30, y + 18, 'thread ' + (k + 1), 'tb') + cell(30, y + 22, 110, 18, 'Arc（一个 pointer）', 'wash2', 'ts', 3);
    o += arrow(150, y + 31, 268, 96 + k * 18, 'ink');
  }
  // heap 上的块
  const X = 270;
  o += T(X + 130, 26, 'heap 上的一块（ArcInner）', 'tb', 'middle');
  o += rect(X, 38, 260, 190, 'paper', 8);
  o += cell(X + 12, 50, 236, 28, 'strong = 3（atomic）', 'wash', 't');
  o += cell(X + 12, 84, 236, 28, 'weak = 1（atomic）', 'wash', 't');
  o += rect(X + 12, 122, 236, 96, 'frame', 6) + T(X + 24, 140, 'Mutex<i32>', 'tb');
  o += cell(X + 24, 150, 100, 26, 'lock 状态', 'paper', 'ts') + cell(X + 136, 150, 100, 26, 'poison flag', 'paper', 'ts');
  o += cell(X + 24, 184, 212, 26, 'UnsafeCell<i32> = 0', 'wash-strong', 't');
  o += T(280, 252, 'clone：strong 加 1；drop：strong 减 1，减到 0 时 free 整块', 'ts', 'middle');
  return svg(560, 262, o, '三个 thread 各持有一个 Arc pointer，都指向 heap 上同一块：atomic 的 strong 和 weak 计数，以及 Mutex，Mutex 里有 lock 状态、poison flag 和 UnsafeCell 包着的 i32');
}

// ---------- 第 8 站：async fn 的 state machine ----------
function fsm() {
  let o = '';
  const S = [['New', 10, 40, 76], ['LoadingMsg', 126, 40, 118], ['FetchingDB', 300, 130, 118], ['AddingInbox', 300, 40, 118], ['Done', 466, 40, 84]];
  const pos = {}, wd = {};
  for (const [n, x, y, w] of S) { pos[n] = [x, y]; wd[n] = w; o += cell(x, y, w, 34, n, n === 'Done' ? 'wash' : 'paper', 'tb', 8); }
  const r = (n) => pos[n][0] + wd[n], cy = (n) => pos[n][1] + 17;
  o += arrow(r('New'), cy('New'), pos.LoadingMsg[0] - 2, cy('LoadingMsg'), 'ink');
  o += arrow(r('LoadingMsg'), cy('LoadingMsg'), pos.AddingInbox[0] - 2, cy('AddingInbox'), 'ln') + T(265, 30, 'cache 命中', 'tl', 'middle');
  o += arrow(r('LoadingMsg') - 40, cy('LoadingMsg') + 17, pos.FetchingDB[0] - 2, cy('FetchingDB'), 'ink') + T(206, 128, 'cache 没命中', 'ts', 'middle');
  o += arrow(pos.FetchingDB[0] + 59, pos.FetchingDB[1] - 2, pos.AddingInbox[0] + 59, pos.AddingInbox[1] + 36, 'ink');
  o += arrow(r('AddingInbox'), cy('AddingInbox'), pos.Done[0] - 2, cy('Done'), 'ink');
  o += T(136, 96, '存着：msg', 'ts') + T(426, 158, '存着：msg、user id', 'ts') + T(426, 100, '存着：msg、user', 'ts');
  o += T(20, 204, '每次 poll：从当前 state 执行到下一个 .await；子 future 返回 Pending，就把 state 记下、返回 Pending', 'ts');
  o += T(20, 224, '执行到 Done 时返回 Ready', 'ts');
  return svg(560, 234, o, 'add_to_inbox 的 state machine：New、LoadingMsg、FetchingDB、AddingInbox、Done。LoadingMsg 之后 cache 命中直接到 AddingInbox，没命中先到 FetchingDB');
}

// ---------- 第 8 站：await 与 spawn 的时间线（动图） ----------
function echoA() {
  const sx = lin(0, 8, 110, 540);
  let o = '';
  const axisY = 228;
  o += line(sx(0), axisY, sx(8), axisY, 'axis');
  for (let t = 0; t <= 8; t += 2) o += line(sx(t), axisY - 4, sx(t), axisY + 4, 'axis') + T(sx(t), axisY + 18, t + ' s', 'ts', 'middle');
  // A：0 连上，6 断开；B：2 连上，7 断开；行在 1,3,5（A）、2.5,4（B）
  const lane = (y, name, segs, marks) => {
    let q = T(100, y + 15, name, 't', 'end');
    for (const [a, b, cls] of segs) q += rect(sx(a), y, sx(b) - sx(a), 20, cls, 3);
    for (const [t, s] of marks) q += line(sx(t), y - 3, sx(t), y + 23, 'ink-b');
    return q;
  };
  o += T(20, 22, 'handle_client(socket).await', 'tb');
  o += lane(34, 'A', [[0, 6, 'wash-strong']], [[1], [3], [5]]);
  o += lane(64, 'B', [[2, 6, 'wash2'], [6, 7, 'wash-strong']], [[6], [6.12]]);
  o += T(sx(4), 98, 'B 连上了，但 loop 回不到 accept', 'ts', 'middle');
  o += T(20, 128, 'tokio::spawn(...)', 'tb');
  o += lane(140, 'A', [[0, 6, 'wash-strong']], [[1], [3], [5]]);
  o += lane(170, 'B', [[2, 7, 'wash-strong']], [[2.5], [4]]);
  o += T(sx(4.4), 206, '深色：connection 有 handler 在服务；竖线：回送一行', 'ts', 'middle');
  // 移动的时间线
  const N = 40, kt = [], xs = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); xs.push(sx(8 * i / N)); }
  o += `<line x1="${f1(xs[0])}" y1="26" x2="${f1(xs[0])}" y2="${axisY}" class="ln">${anim('x1', xs.map(f1), kt, 8)}${anim('x2', xs.map(f1), kt, 8)}</line>`;
  return svgA(560, 254, o, '动图：两个 client，A 在 0 秒连上、6 秒断开，B 在 2 秒连上、7 秒断开。直接 await 时 B 要等到 6 秒才被服务；spawn 时 A 和 B 同时被服务。一条竖线随时间扫过');
}

export default {
  'cs3211-hoist': hoist,
  'cs3211-sbA': sbA,
  'cs3211-checkact': checkact,
  'cs3211-deadlock': deadlock,
  'cs3211-mesaA': mesaA,
  'cs3211-h2o': h2o,
  'cs3211-armA': armA,
  'cs3211-hb': hb,
  'cs3211-mo': mo,
  'cs3211-q2': q2,
  'cs3211-relseq': relseq,
  'cs3211-iriw': iriw,
  'cs3211-abaA': abaA,
  'cs3211-lfq': lfq,
  'cs3211-tokenA': tokenA,
  'cs3211-pipeline': pipeline,
  'cs3211-borrow': borrow,
  'cs3211-arc': arc,
  'cs3211-fsm': fsm,
  'cs3211-echoA': echoA,
};
