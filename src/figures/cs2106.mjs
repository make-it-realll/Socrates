import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const box = (x, y, w, h, cls = 'paper', rx = 4) => rect(x, y, w, h, cls, rx);
// 线条用 cls，箭头头部用 headCls（给虚线箭头用）
function arrowH(x1, y1, x2, y2, cls, headCls, size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  return line(x1, y1, x2 - 3 * Math.cos(a), y2 - 3 * Math.sin(a), cls) + poly([[x2, y2], p(0.42), p(-0.42)], headCls);
}
const hex = (v, w) => '0x' + v.toString(16).toUpperCase().padStart(w, '0');
const bin = (v, w) => v.toString(2).padStart(w, '0');

// ---------- 开头：两次加法只加了一次 ----------
function race0() {
  const rows = [
    [1, 'load counter → 50', 50],
    [1, 'add 1 → 51', 50],
    null,
    [2, 'load counter → 50', 50],
    [2, 'add 1 → 51', 50],
    [2, 'store 51', 51],
    null,
    [1, 'store 51', 51],
  ];
  const X1 = 70, X2 = 270, XC = 470, W = 170;
  let o = text(X1 + W / 2, 18, 'Thread 1', 'tb', 'middle') + text(X2 + W / 2, 18, 'Thread 2', 'tb', 'middle') + text(XC + 25, 18, 'counter（memory）', 'tb', 'middle');
  let y = 34;
  o += arrow(30, 34, 30, 262, 'mute') + text(22, 150, 'time', 'ts', 'end');
  for (const r of rows) {
    if (!r) {
      o += line(X1, y + 9, X2 + W, y + 9, 'dash') + text(X2 + W + 12, y + 13, 'switch', 'ts', 'start');
      y += 20; continue;
    }
    const [th, s, c] = r, x = th === 1 ? X1 : X2;
    o += box(x, y, W, 24, s.startsWith('store') ? 'wash ink-s' : 'paper') + text(x + W / 2, y + 17, s, 't', 'middle');
    o += text(XC + 25, y + 17, String(c), c === 51 ? 'tl' : 't', 'middle');
    y += 30;
  }
  o += text(280, 284, '两个 thread 都读到 50、都写回 51：两次加法，counter 只多了 1。', 'ts', 'middle');
  return svg(560, 292, o, '两个 thread 交错执行 counter 加一：Thread 1 读到 50 后被换下，Thread 2 完成一次加法写回 51，Thread 1 回来又写回 51');
}

// ---------- 开头：external fragmentation ----------
function frag() {
  const sx = lin(0, 64, 30, 530);
  const seg = [[0, 8, 'OS'], [8, 20, 'A'], [20, 26, null], [26, 38, 'B'], [38, 42, null], [42, 52, 'C'], [52, 58, null], [58, 64, 'D']];
  let o = text(30, 20, '64 KB physical memory，空闲 6 + 4 + 6 = 16 KB', 'tb');
  const Y = 40, H = 46;
  for (const [a, b, n] of seg) {
    o += rect(sx(a), Y, sx(b) - sx(a), H, n ? 'wash2' : 'paper-f');
    o += rect(sx(a), Y, sx(b) - sx(a), H, 'frame');
    o += text((sx(a) + sx(b)) / 2, Y + H / 2 + 5, n ?? (b - a) + ' KB', n ? 't' : 'tl', 'middle');
  }
  o += rect(sx(0), Y, sx(64) - sx(0), H, 'ink');
  for (const v of [0, 16, 32, 48, 64]) o += line(sx(v), Y + H, sx(v), Y + H + 5, 'axis') + text(sx(v), Y + H + 19, v + ' KB', 'ts', 'middle');
  // 新 process：10 KB，和每个空洞对比
  const NY = 128;
  o += rect(sx(20), NY, sx(30) - sx(20), 30, 'wash-strong') + text(sx(25), NY + 20, '10 KB', 'tb', 'middle') + text(sx(20) - 10, NY + 20, '新 process', 'tb', 'end');
  o += line(sx(20), Y + H + 26, sx(20), NY - 2, 'dash') + line(sx(26), Y + H + 26, sx(26), NY - 2, 'dash');
  o += text(sx(30) + 10, NY + 13, '放进 6 KB 的空洞：多出 4 KB，压到了 B', 'ts', 'start');
  o += text(sx(30) + 10, NY + 29, '4 KB 和另一个 6 KB 的空洞更不够', 'ts', 'start');
  return svg(560, 166, o, '64 KB memory 中 OS 和 A、B、C、D 四个 process 之间夹着 6 KB、4 KB、6 KB 三个空洞，一个 10 KB 的新 process 放不进任何一个');
}

// ---------- 第 1 站：fork 之后两个 address space ----------
function fork() {
  const sp = (x, title, xval, pid, hot) => {
    let q = text(x + 100, 22, title, 'tb', 'middle');
    const rows = [['stack', 'pid = ' + pid], ['heap', ''], ['data', 'x = ' + xval], ['code', 'main(), fork() …']];
    rows.forEach(([n, v], i) => {
      const y = 34 + i * 40;
      q += box(x, y, 200, 36, i === 2 && hot ? 'wash ink-s' : i === 0 ? 'wash2' : 'paper', 2);
      q += text(x + 10, y + 23, n, 'ts', 'start') + text(x + 190, y + 23, v, i === 2 && hot ? 'tl' : 't', 'end');
    });
    return q;
  };
  let o = sp(20, 'parent', 100, 4242, false) + sp(340, 'child（PID 4242）', 101, 0, true);
  o += arrowH(226, 80, 334, 80, 'ink', 'ink-f') + text(280, 70, 'fork() 复制', 'ts', 'middle');
  o += text(280, 125, 'x 在两边的', 'ts', 'middle') + text(280, 141, 'address 相同', 'ts', 'middle');
  o += line(222, 132, 238, 132, 'dash') + line(322, 132, 338, 132, 'dash');
  o += text(280, 210, '之后 child 执行 x = x + 1，只改了自己那一份；parent 的 x 仍是 100。', 'ts', 'middle');
  return svg(560, 218, o, 'fork 之后 parent 和 child 各有一个 address space，结构相同；parent 的 pid 是 4242、x 是 100，child 的 pid 是 0、x 改成了 101');
}

// ---------- 第 1 站：一次 write() 的路径 ----------
function syscall() {
  let o = '';
  const B = (x, y, w, h, t1, t2, cls = 'paper') => box(x, y, w, h, cls) + text(x + w / 2, y + 20, t1, 'tb', 'middle') + (t2 ? text(x + w / 2, y + 38, t2, 'ts', 'middle') : '');
  o += B(20, 28, 170, 48, 'write(1, buf, 3)', 'program 调用 library');
  o += B(220, 28, 180, 48, 'trap instruction', '编号放进 $v0 / a7');
  o += B(420, 28, 130, 48, '下一条 instruction', '回到 user mode');
  o += arrowH(190, 52, 218, 52, 'ink', 'ink-f');
  o += line(20, 116, 550, 116, 'dash');
  o += text(20, 108, 'user mode', 'ts', 'start') + text(20, 134, 'kernel mode', 'ts', 'start');
  // kernel 一侧
  o += B(20, 150, 170, 74, 'kernel stack', 'user 的 PC、SP 等存在这里');
  o += box(220, 150, 180, 74) + text(310, 168, 'trap table（开机时填好）', 'tb', 'middle');
  [['system call', 'syscall handler'], ['timer', 'timer handler'], ['page fault', 'fault handler']].forEach(([a, b], i) => {
    const y = 186 + i * 14;
    o += text(232, y, a, 'ts', 'start') + text(388, y, '→ ' + b, 'ts', 'end');
  });
  o += box(420, 150, 130, 74, 'wash ink-s') + text(485, 170, 'syscall handler', 'tb', 'middle') + text(485, 190, '按编号找 sys_write', 'ts', 'middle') + text(485, 208, '检查 fd 和 buf', 'ts', 'middle');
  o += arrowH(310, 76, 310, 148, 'ln', 'ln-f') + text(318, 98, 'trap', 'tl', 'start');
  o += arrowH(400, 187, 418, 187, 'ink', 'ink-f');
  o += arrowH(485, 150, 485, 78, 'ln', 'ln-f') + text(477, 98, 'return-from-trap', 'tl', 'end');
  o += arrowH(302, 132, 192, 170, 'mute', 'mute-f');
  o += text(285, 252, 'Process 只能选编号；跳到哪里由 OS 开机时填好的 trap table 决定。', 'ts', 'middle');
  return svg(560, 260, o, '一次 write 的路径：program 调用 library，library 执行 trap instruction 进入 kernel mode，硬件把 register 存到 kernel stack 并按 trap table 跳到 syscall handler，handler 检查 argument 后 return-from-trap 回到 user mode 的下一条 instruction');
}

// ---------- 第 1 站：context switch（动图） ----------
function ctxA() {
  const frames = [
    { cpu: ['0x4010', '0x7FF0', 'user'], ka: [], kb: ['PC 0x8200', 'SP 0x7FA0'], pa: '—', pb: 'B 的 kernel register', cur: 0,
      s: ['① A 在 user mode 下跑。', 'B 上次被换下时的 PC、SP 还留在 B 的 kernel stack 上。'] },
    { cpu: ['timer handler', 'A 的 kstack', 'kernel'], ka: ['PC 0x4010', 'SP 0x7FF0'], kb: ['PC 0x8200', 'SP 0x7FA0'], pa: '—', pb: 'B 的 kernel register', cur: 1, hot: 'ka',
      s: ['② Timer interrupt：hardware 把 A 的 PC、SP 压到 A 的 kernel stack，', '切到 kernel mode，跳进 timer handler。'] },
    { cpu: ['switch()', 'B 的 kstack', 'kernel'], ka: ['PC 0x4010', 'SP 0x7FF0'], kb: ['PC 0x8200', 'SP 0x7FA0'], pa: 'A 的 kernel register', pb: '已装回 CPU', cur: 2, hot: 'pcb',
      s: ['③ switch()：A 此刻的 kernel register 存进 PCB A，', '从 PCB B 装回 B 的，SP 随之换成 B 的 kernel stack。'] },
    { cpu: ['0x8200', '0x7FA0', 'user'], ka: ['PC 0x4010', 'SP 0x7FF0'], kb: [], pa: 'A 的 kernel register', pb: '—', cur: 3, hot: 'cpu',
      s: ['④ Return-from-trap：从 B 的 kernel stack 取回 PC 0x8200、SP 0x7FA0，', '切回 user mode，B 从上次被打断的地方接着跑。'] },
  ];
  const n = frames.length, step = 3.2, T = n * step, kt = frames.map((_, i) => i / n);
  let o = text(95, 20, 'CPU', 'tb', 'middle') + text(270, 20, 'kernel stack', 'tb', 'middle') + text(460, 20, 'PCB（在 kernel memory 里）', 'tb', 'middle');
  o += box(20, 30, 150, 130, 'frame', 4);
  o += box(200, 30, 140, 56, 'frame') + box(200, 104, 140, 56, 'frame');
  o += box(370, 30, 180, 56, 'frame') + box(370, 104, 180, 56, 'frame');
  o += text(208, 46, 'A', 'ts', 'start') + text(208, 120, 'B', 'ts', 'start') + text(378, 46, 'PCB A', 'ts', 'start') + text(378, 120, 'PCB B', 'ts', 'start');
  // 时间线
  const TY = 186, seg = [[20, 250, 'A（user mode）'], [250, 340, 'OS'], [340, 550, 'B（user mode）']];
  seg.forEach(([a, b, s], i) => { o += box(a, TY, b - a, 24, i === 1 ? 'wash2' : 'paper', 0) + text((a + b) / 2, TY + 17, s, 'ts', 'middle'); });
  const cx = [135, 268, 322, 445];
  frames.forEach((F, f) => {
    let g = '';
    const lab = ['PC', 'SP', 'mode'];
    F.cpu.forEach((v, i) => {
      const y = 44 + i * 38;
      g += box(30, y, 130, 28, F.hot === 'cpu' && i < 2 ? 'wash-strong' : 'paper', 3) + text(40, y + 19, lab[i], 'ts', 'start') + text(150, y + 19, v, 't', 'end');
    });
    const ks = (x, y, L, hot) => L.map((s, i) => (hot ? rect(x + 30, y + 6 + i * 22, 100, 18, 'wash-strong', 2) : '') + text(x + 80, y + 20 + i * 22, s, 't', 'middle')).join('');
    g += ks(200, 30, F.ka, F.hot === 'ka') + ks(200, 104, F.kb, false);
    if (!F.kb.length) g += text(270, 136, '（空）', 'ts', 'middle');
    if (!F.ka.length) g += text(270, 62, '（空）', 'ts', 'middle');
    const pc = (y, s, hot) => (hot ? rect(380, y + 24, 160, 22, 'wash-strong', 2) : '') + text(460, y + 40, s, 't', 'middle');
    g += pc(30, F.pa, F.hot === 'pcb') + pc(104, F.pb, F.hot === 'pcb');
    g += poly([[cx[f], TY - 2], [cx[f] - 6, TY - 12], [cx[f] + 6, TY - 12]], 'ln-f');
    g += text(20, 236, F.s[0], f === 0 ? 't' : 'tl', 'start') + text(20, 256, F.s[1], 'ts', 'start');
    o += grp(g, frames.map((_, k) => k === f), kt, T);
  });
  return svgA(560, 264, o, '动图：context switch 四步。A 在跑；timer interrupt 时硬件把 A 的 PC 和 SP 压到 A 的 kernel stack；switch 把 A 的 kernel register 存进 PCB A 并装回 B 的；return-from-trap 从 B 的 kernel stack 取回 B 的 PC 0x8200，回到 user mode');
}

// ---------- 第 1 站：五个 state ----------
function states() {
  const N = { New: [55, 62], Ready: [200, 62], Running: [360, 62], Term: [500, 62], Blocked: [280, 190] };
  let o = '';
  const node = ([x, y], s, hot) => box(x - 45, y - 18, 90, 36, hot ? 'wash ink-s' : 'paper', 18) + text(x, y + 5, s, 'tb', 'middle');
  o += node(N.New, 'New') + node(N.Ready, 'Ready', true) + node(N.Running, 'Running', true) + node(N.Term, 'Terminated') + node(N.Blocked, 'Blocked');
  o += arrowH(100, 62, 153, 62, 'ink', 'ink-f') + text(127, 52, 'admit', 'ts', 'middle');
  o += arrowH(245, 54, 313, 54, 'ln', 'ln-f') + text(279, 40, 'switch（scheduled）', 'tl', 'middle');
  o += arrowH(315, 72, 247, 72, 'ink', 'ink-f') + text(281, 94, 'switch', 'ts', 'middle') + text(281, 109, '（preempt 或 yield）', 'ts', 'middle');
  o += arrowH(405, 62, 453, 62, 'ink', 'ink-f') + text(429, 52, 'exit', 'ts', 'middle');
  o += arrowH(370, 81, 312, 170, 'ink', 'ink-f') + text(356, 136, 'event wait', 'ts', 'start') + text(356, 151, '（读 disk、wait()）', 'ts', 'start');
  o += arrowH(248, 170, 192, 81, 'ink', 'ink-f') + text(206, 136, 'event occurs', 'ts', 'end');
  o += text(280, 232, 'Scheduler 只在 Ready 里挑；Blocked 的 process 给它 CPU 也没用。', 'ts', 'middle');
  return svg(560, 240, o, 'Process 的五个 state：New 经 admit 到 Ready，Ready 经 switch 到 Running，Running 被 preempt 或主动 yield 时 switch 回 Ready、event wait 进入 Blocked、exit 进入 Terminated，Blocked 在 event occurs 后回到 Ready');
}

// ---------- 第 2 站：SJF 与 SRT ----------
function srt() {
  const sx = lin(0, 120, 90, 540);
  let o = '';
  const row = (y, name, segs, avg) => {
    o += text(20, y + 19, name, 'tb', 'start');
    for (const [p, a, b] of segs) o += box(sx(a), y, sx(b) - sx(a), 28, p === 'A' ? 'wash2' : 'wash ink-s', 0) + rect(sx(a), y, sx(b) - sx(a), 28, 'frame') + text((sx(a) + sx(b)) / 2, y + 19, p, 'tb', 'middle');
    o += text(540, y + 46, avg, 'ts', 'end');
  };
  o += arrowH(sx(10), 20, sx(10), 42, 'ln', 'ln-f') + text(sx(10) + 8, 28, 'B、C 在 t = 10 到达', 'tl', 'start');
  row(48, 'SJF', [['A', 0, 100], ['B', 100, 110], ['C', 110, 120]], 'turnaround：A 100，B 100，C 110，平均 103.33');
  row(118, 'SRT', [['A', 0, 10], ['B', 10, 20], ['C', 20, 30], ['A', 30, 120]], 'turnaround：A 120，B 10，C 20，平均 50');
  for (const v of [0, 10, 20, 30, 100, 110, 120]) o += line(sx(v), 190, sx(v), 195, 'axis') + text(sx(v), 209, String(v), 'ts', 'middle');
  o += line(sx(0), 190, sx(120), 190, 'axis') + text(sx(0) - 8, 209, 't (ms)', 'ts', 'end');
  return svg(560, 216, o, 'SJF 与 SRT 的 Gantt chart：A 在 0 到达需 100，B、C 在 10 到达各需 10；SJF 让 A 跑完再跑 B、C，SRT 在 t 等于 10 抢占 A');
}

// ---------- 第 2 站：RR q = 20（动图） ----------
function rrA() {
  const P = [['P1', 53], ['P2', 8], ['P3', 68], ['P4', 24]], q = 20;
  const rem = Object.fromEntries(P), Q = P.map((p) => p[0]);
  const segs = [], states = [], done = [];
  let t = 0;
  while (Q.length) {
    const p = Q.shift(), r = Math.min(q, rem[p]);
    states.push({ t, run: p, queue: Q.slice(), done: done.slice() });
    segs.push([p, t, t + r]); t += r; rem[p] -= r;
    if (rem[p]) Q.push(p); else done.push([p, t]);
  }
  states.push({ t, run: null, queue: [], done: done.slice() });
  // 相邻同一 process 的段合并显示状态（P3 125–145–153 中途没人排队）
  const sx = lin(0, 153, 40, 540), GY = 40;
  const cls = { P1: 'wash', P2: 'wash2', P3: 'wash-strong', P4: 'paper' };
  let o = text(40, 22, 'RR，q = 20 ms；P1 53、P2 8、P3 68、P4 24，同时在 t = 0 到达', 'tb', 'start');
  for (const [p, a, b] of segs) {
    o += rect(sx(a), GY, sx(b) - sx(a), 32, cls[p]) + rect(sx(a), GY, sx(b) - sx(a), 32, 'frame');
    if (sx(b) - sx(a) > 18) o += text((sx(a) + sx(b)) / 2, GY + 21, p, 'tb', 'middle');
  }
  o += rect(sx(0), GY, sx(153) - sx(0), 32, 'ink');
  o += text(sx(110), GY - 5, 'P4', 'ts', 'middle');
  const ticks = [...new Set(segs.flatMap((s) => [s[1], s[2]]))];
  for (const v of ticks) {
    const low = v === 112;
    o += line(sx(v), GY + 32, sx(v), GY + (low ? 50 : 37), 'axis') + text(sx(v), GY + (low ? 63 : 50), String(v), 'ts', 'middle');
  }
  // 时间与 keyTimes
  const pre = 1.0, sc = 0.08, post = 3.0, T = pre + 153 * sc + post;
  const rt = (x) => (x === 0 ? 0 : pre + x * sc);
  const kt = states.map((s) => rt(s.t) / T).concat([1]);
  // 光标
  const ckt = [0, pre / T, (pre + 153 * sc) / T, 1];
  const cxs = [sx(0), sx(0), sx(153), sx(153)];
  o += apath(cxs.map((x) => d([[x, GY - 8], [x, GY + 40]])), ckt, T, 'ink-b');
  // 下方：此刻的状态
  const Y = 130;
  o += text(40, Y, 'running', 'ts', 'start') + text(170, Y, 'ready queue（左边是队头）', 'ts', 'start') + text(400, Y, '已完成（完成时刻）', 'ts', 'start');
  states.forEach((S, i) => {
    let g = '';
    g += S.run ? box(40, Y + 10, 60, 30, 'solid', 4) + text(70, Y + 30, S.run, 'tw', 'middle') : text(40, Y + 30, '全部完成', 'tl', 'start');
    if (!S.queue.length && S.run) g += text(170, Y + 30, '（空）', 'ts', 'start');
    S.queue.forEach((p, k) => { g += box(170 + k * 52, Y + 10, 46, 30, cls[p] === 'paper' ? 'paper' : cls[p] + ' ink-s', 4) + text(193 + k * 52, Y + 30, p, 'tb', 'middle'); });
    S.done.forEach(([p, ft], k) => { g += text(400, Y + 28 + k * 18, `${p}（${ft}）`, 't', 'start'); });
    g += text(40, Y + 70, S.run ? `t = ${S.t}：${S.run} 上 CPU，跑到 ${segs[i][2]}` + (segs[i][2] - S.t < q ? '，做完离开' : '，quantum 用完，排到队尾') : `t = ${S.t}：全部完成`, 'ts', 'start');
    o += grp(g, kt.map((_, k) => Math.min(k, states.length - 1) === i), kt, T);
  });
  return svgA(560, 214, o, '动图：RR 时间片 20 的 Gantt chart，竖线从 0 走到 153，下方显示此刻在跑的 process、ready queue 和已完成的 process 及完成时刻 P2 28、P4 112、P1 125、P3 153');
}

// ---------- 第 3 站：race 的逐条 interleaving（动图） ----------
function raceA() {
  const code = ['100  mov 0x8049a1c, %eax', '105  add $0x1, %eax', '108  mov %eax, 0x8049a1c'];
  // [谁在跑, 刚执行的行, eax1, eax2, counter, 说明]
  const F = [
    [1, -1, '—', '—', 50, '开始：counter = 50，Thread 1 先跑。'],
    [1, 0, '50', '—', 50, 'Thread 1 读 counter：eax = 50。'],
    [1, 1, '51', '—', 50, 'Thread 1 加 1：eax = 51，还没写回。'],
    [0, -1, '51（存在 PCB）', '—', 50, 'Timer interrupt：保存 Thread 1 的 register（eax 51），换 Thread 2。'],
    [2, 0, '51（存在 PCB）', '50', 50, 'Thread 2 读 counter：读到的仍是 50。'],
    [2, 1, '51（存在 PCB）', '51', 50, 'Thread 2 加 1：eax = 51。'],
    [2, 2, '51（存在 PCB）', '51', 51, 'Thread 2 写回：counter = 51。'],
    [0, -1, '51', '51（存在 PCB）', 51, 'Timer interrupt：换回 Thread 1，恢复它的 eax = 51。'],
    [1, 2, '51', '51（存在 PCB）', 51, 'Thread 1 写回 51：两次加法，counter 只从 50 变到 51。'],
  ];
  const n = F.length, step = 2.2, T = n * step + 1.5;
  const kt = F.map((_, i) => (i * step) / T).concat([1]);
  const X = [20, 300], W = 240;
  let o = '';
  [0, 1].forEach((k) => {
    o += box(X[k], 30, W, 84, 'frame');
  });
  o += box(200, 172, 160, 40, 'paper') + text(280, 166, 'memory', 'ts', 'middle');
  F.forEach((f, i) => {
    const [who, ln, e1, e2, c, s] = f;
    let g = '';
    [0, 1].forEach((k) => {
      const me = who === k + 1;
      g += text(X[k] + W / 2, 20, `Thread ${k + 1}` + (me ? '（在 CPU 上）' : ''), me ? 'tl' : 'tb', 'middle');
      if (me && ln >= 0) g += rect(X[k] + 4, 38 + ln * 24, W - 8, 22, 'wash-strong', 3);
      g += text(X[k] + 14, 140, 'eax = ' + (k ? e2 : e1), me ? 'tb' : 't', 'start');
    });
    if (who === 0) g += text(280, 140, '⇄', 'tl', 'middle');
    g += text(280, 198, 'counter = ' + c, c === 51 ? 'tl' : 'tb', 'middle');
    g += text(20, 240, `${i}. ${s}`, i === n - 1 ? 'tl' : 't', 'start');
    o += grp(g, kt.map((_, k) => Math.min(k, n - 1) === i), kt, T);
  });
  // 重新把代码行画在高亮条上面
  [0, 1].forEach((k) => code.forEach((s, i) => { o += text(X[k] + 14, 54 + i * 24, s, 't', 'start'); }));
  return svgA(560, 250, o, '动图：两个 thread 执行 counter 加一的三条 x86 instruction，Thread 1 读到 50 加到 51 后被换下，Thread 2 读 50 写回 51，Thread 1 恢复后再写回 51');
}

// ---------- 第 4 站：dining philosophers ----------
function dine() {
  let o = '';
  const panel = (cx, title, holds, waits, note) => {
    const cy = 150, RP = 92, RC = 60;
    const ang = (i) => (-90 + 72 * i) * Math.PI / 180;
    const Pp = (i) => [cx + RP * Math.cos(ang(i)), cy + RP * Math.sin(ang(i))];
    const Cp = (i) => [cx + RC * Math.cos(ang(i) - 0.2 * Math.PI), cy + RC * Math.sin(ang(i) - 0.2 * Math.PI)];
    o += text(cx, 20, title, 'tb', 'middle');
    o += circle(cx, cy, 24, 'paper') + text(cx, cy + 4, 'table', 'ts', 'middle');
    for (let i = 0; i < 5; i++) {
      const [x, y] = Cp(i), a = ang(i) - 0.2 * Math.PI;
      const ux = Math.cos(a) * 11, uy = Math.sin(a) * 11;
      o += line(x - ux, y - uy, x + ux, y + uy, 'ink-b');
      const lx = cx + (RC - 21) * Math.cos(a), ly = cy + (RC - 21) * Math.sin(a);
      o += text(lx, ly + 4, String(i), 'ts', 'middle');
    }
    // 箭头：拿着 chopstick → philosopher（实线），philosopher 等 → chopstick（虚线）
    const edge = (A, B, r1, r2) => { const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy); return [A[0] + dx * r1 / L, A[1] + dy * r1 / L, B[0] - dx * r2 / L, B[1] - dy * r2 / L]; };
    for (const [p, c] of holds) { const e = edge(Cp(c), Pp(p), 10, 19); o += arrowH(...e, 'ink', 'ink-f'); }
    for (const [p, c] of waits) { const e = edge(Pp(p), Cp(c), 19, 10); o += arrowH(...e, 'ln-dash', 'ln-f'); }
    for (let i = 0; i < 5; i++) {
      const [x, y] = Pp(i), eat = note && note.eat === i;
      o += circle(x, y, 17, eat ? 'solid' : 'paper') + text(x, y + 5, 'P' + i, eat ? 'tw' : 'tb', 'middle');
    }
  };
  panel(140, '每人先拿左手（编号 i）', [0, 1, 2, 3, 4].map((i) => [i, i]), [0, 1, 2, 3, 4].map((i) => [i, (i + 1) % 5]), null);
  panel(420, '按编号先拿小的', [[0, 0], [1, 1], [2, 2], [3, 3], [3, 4]], [[0, 1], [1, 2], [2, 3], [4, 0]], { eat: 3 });
  o += text(140, 272, '五个都拿着一根、等下一根：一圈', 'ts', 'middle');
  o += text(420, 272, 'P4 先等 chopstick 0，P3 拿到 3 和 4', 'ts', 'middle');
  o += text(280, 296, '实线箭头：chopstick 在这个 philosopher 手里；虚线箭头：在等这根 chopstick', 'ts', 'middle');
  return svg(560, 304, o, '左图五个 philosopher 各拿着自己左手的 chopstick 并等右手那根，形成 circular wait；右图按编号先拿小的，P4 先等 chopstick 0，P3 拿到两根可以吃，圈被打断');
}

// ---------- 第 5 站：paging 的小例子 ----------
function paging() {
  const pt = [3, 7, 5, 2];
  let o = '';
  // 上：bit
  const bits = (x, y, s, split, hot) => {
    let q = '';
    [...s].forEach((c, i) => { const xx = x + i * 22 + (i >= split ? 8 : 0); q += box(xx, y, 20, 26, i < split ? (hot ? 'wash-strong' : 'wash') : 'paper', 2) + text(xx + 10, y + 18, c, 'tb', 'middle'); });
    return q;
  };
  o += text(30, 20, 'virtual address 21', 'tb', 'start') + bits(30, 28, bin(21, 6), 2, false);
  o += text(30, 70, 'VPN = 1', 'ts', 'start') + text(84, 70, 'offset = 5', 'ts', 'start');
  const PX = 360;
  o += text(PX, 20, 'physical address 117', 'tb', 'start') + bits(PX, 28, bin(117, 7), 3, true);
  o += text(PX, 70, 'PFN = 7', 'ts', 'start') + text(PX + 74, 70, 'offset = 5', 'ts', 'start');
  o += arrowH(30 + 4 * 22 + 8 + 44 + 10, 41, PX - 6, 41, 'mute', 'mute-f') + text(250, 34, 'offset 原样抄过去', 'ts', 'middle');
  // 下：virtual pages、page table、physical frames
  const Y = 108, RH = 30;
  o += text(70, Y - 8, 'virtual pages', 'ts', 'middle') + text(255, Y - 8, 'page table', 'ts', 'middle') + text(470, Y - 8, 'physical frames', 'ts', 'middle');
  const FY = Y, FH = 22;
  for (let f = 0; f < 8; f++) {
    const vp = pt.indexOf(f), y = FY + f * FH;
    o += box(420, y, 100, FH, f === 7 ? 'wash-strong' : vp >= 0 ? 'wash' : f === 0 ? 'wash2' : 'paper', 0) + rect(420, y, 100, FH, 'frame');
    o += text(526, y + 15, 'PF ' + f, 'ts', 'start') + text(470, y + 15, vp >= 0 ? 'VP ' + vp : f === 0 ? 'OS' : 'free', vp >= 0 ? 't' : 'ts', 'middle');
  }
  for (let v = 0; v < 4; v++) {
    const y = Y + v * RH + 10, hot = v === 1;
    o += box(30, y, 80, RH - 6, hot ? 'wash-strong' : 'wash', 2) + text(70, y + 17, 'VP ' + v, 'tb', 'middle');
    o += box(215, y, 80, RH - 6, hot ? 'wash-strong' : 'paper', 2) + text(225, y + 17, String(v), 'ts', 'start') + text(285, y + 17, '→ ' + pt[v], hot ? 'tl' : 't', 'end');
    o += arrowH(110, y + 12, 213, y + 12, hot ? 'ln' : 'mute', hot ? 'ln-f' : 'mute-f');
    const fy = FY + pt[v] * FH + FH / 2;
    o += arrowH(295, y + 12, 418, fy, hot ? 'ln' : 'mute', hot ? 'ln-f' : 'mute-f');
  }
  o += text(30, 296, '64-byte address space，16-byte page：VPN 2 位，offset 4 位；VP 1 → PF 7。', 'ts', 'start');
  return svg(560, 304, o, 'Virtual address 21 等于 binary 010101，VPN 01 查 page table 得到 PFN 7，与 offset 0101 拼成 1110101 即 117；下方四个 virtual page 分别映射到 frame 3、7、5、2');
}

// ---------- 第 5 站：two-level walk + TLB（动图） ----------
function walkA() {
  const VA = 0x00403004, dirI = VA >>> 22, tblI = (VA >>> 12) & 0x3ff, off = VA & 0xfff;
  const DIR = 0x00100000, TBLF = 0x2a0, DATAF = 0x5c1;
  const dirE = DIR + dirI * 4, tblE = (TBLF << 12) + tblI * 4, PA = (DATAF << 12) | off;
  const VA2 = VA + 4, PA2 = (DATAF << 12) | (VA2 & 0xfff);
  const tlb0 = [['0x7FFFF', '0x0B2'], ['0x00401', '0x5BF']];
  const fr = [
    { va: VA, tlb: tlb0, miss: true, hot: 'tlb', cnt: 0, s: [`第 1 次 access ${hex(VA, 8)}：先查 TLB，VPN ${hex(VA >>> 12, 5)} 不在里面，miss。`, ''] },
    { va: VA, tlb: tlb0, hot: 'dir', cnt: 1, s: [`读 page directory 第 ${dirI} 项：address ${hex(DIR, 8)} + ${dirI} × 4 = ${hex(dirE, 8)}`, `得到 page table 在 frame ${hex(TBLF, 3)}。`] },
    { va: VA, tlb: tlb0, hot: 'tbl', cnt: 2, s: [`读 page table 第 ${tblI} 项：address ${hex(TBLF << 12, 8)} + ${tblI} × 4 = ${hex(tblE, 8)}`, `得到 data 在 frame ${hex(DATAF, 3)}。`] },
    { va: VA, tlb: [...tlb0, ['0x00403', '0x5C1']], hot: 'data', cnt: 3, s: [`读 data：physical address ${hex(PA, 8)}。翻译存进 TLB。`, '一次 load 用了 3 次 memory access。'] },
    { va: VA2, tlb: [...tlb0, ['0x00403', '0x5C1']], hot: 'hit', cnt: 1, s: [`第 2 次 access ${hex(VA2, 8)}：同一个 page，TLB hit，直接得到 frame ${hex(DATAF, 3)}。`, `读 ${hex(PA2, 8)}，只用 1 次 memory access。`] },
  ];
  const n = fr.length, step = 3.0, T = n * step, kt = fr.map((_, i) => i / n);
  let o = '';
  // 静态骨架
  const TX = 20, DX = 196, PX = 366, RY = 120;
  o += text(TX + 70, RY - 10, 'TLB（VPN → PFN）', 'tb', 'middle');
  o += text(DX + 70, RY - 24, 'page directory', 'tb', 'middle') + text(DX + 70, RY - 10, '@ ' + hex(DIR, 8), 'ts', 'middle');
  o += text(PX + 70, RY - 24, 'page table', 'tb', 'middle') + text(PX + 70, RY - 10, '@ ' + hex(TBLF << 12, 8), 'ts', 'middle');
  const dirRows = [['0', '—'], ['1', '0x2A0'], ['2', '—'], ['…', ''], ['1023', '0x3E1']];
  const tblRows = [['0', '0x5BE'], ['1', '0x5BF'], ['2', '0x5C0'], ['3', '0x5C1'], ['…', '']];
  const rows = (x, R, hotI, hot) => R.map(([a, b], i) => box(x, RY + i * 22, 140, 22, hot && i === hotI ? 'wash-strong' : 'paper', 0) + text(x + 10, RY + 15 + i * 22, a, 'ts', 'start') + text(x + 130, RY + 15 + i * 22, b, 't', 'end')).join('');
  fr.forEach((F, f) => {
    let g = '';
    // VA 的三段
    const v = F.va;
    const parts = [[bin(v >>> 22, 10), 'dir index ' + (v >>> 22), 'dir'], [bin((v >>> 12) & 0x3ff, 10), 'table index ' + ((v >>> 12) & 0x3ff), 'tbl'], [bin(v & 0xfff, 12), 'offset ' + hex(v & 0xfff, 3), 'data']];
    let x = 20;
    g += text(20, 18, 'virtual address ' + hex(v, 8), 'tb', 'start');
    parts.forEach(([b, lab, key], i) => {
      const w = i < 2 ? 112 : 130;
      g += box(x, 26, w, 26, F.hot === key ? 'wash-strong' : 'wash', 2) + text(x + w / 2, 44, b, 't', 'middle') + text(x + w / 2, 68, lab, 'ts', 'middle');
      x += w + 6;
    });
    g += text(406, 44, 'memory access：' + F.cnt, 'tl', 'start');
    // TLB
    F.tlb.forEach(([a, b], i) => {
      const hot = (F.hot === 'hit' && i === 2) || (F.hot === 'data' && i === 2);
      g += box(TX, RY + i * 22, 140, 22, hot ? 'wash-strong' : 'paper', 0) + text(TX + 10, RY + 15 + i * 22, a, 't', 'start') + text(TX + 130, RY + 15 + i * 22, '→ ' + b, 't', 'end');
    });
    for (let i = F.tlb.length; i < 4; i++) g += box(TX, RY + i * 22, 140, 22, 'paper', 0);
    if (F.miss) g += text(TX + 70, RY + 4 * 22 + 18, 'miss', 'tl', 'middle');
    if (F.hot === 'hit') g += text(TX + 70, RY + 4 * 22 + 18, 'hit', 'tl', 'middle');
    g += rows(DX, dirRows, 1, F.hot === 'dir') + rows(PX, tblRows, 3, F.hot === 'tbl');
    if (F.hot === 'dir') g += arrowH(DX + 140, RY + 33, PX - 2, RY - 30, 'ln', 'ln-f');
    if (F.hot === 'tbl') g += arrowH(PX + 70, RY + 5 * 22, PX + 70, 248, 'ln', 'ln-f');
    if (F.hot === 'hit') g += path(d([[TX + 140, RY + 55], [TX + 162, RY + 55], [TX + 162, 264]]), 'ln') + arrowH(TX + 162, 264, PX - 42, 264, 'ln', 'ln-f');
    // data frame
    g += box(PX - 40, 250, 220, 28, F.hot === 'data' || F.hot === 'hit' ? 'wash-strong' : 'paper', 2) + text(PX + 70, 269, 'frame ' + hex(DATAF, 3) + '：data 所在的 page', 't', 'middle');
    g += text(20, 304, F.s[0], f === 0 || f === 4 ? 'tl' : 't', 'start') + (F.s[1] ? text(20, 322, F.s[1], 'ts', 'start') : '');
    o += grp(g, fr.map((_, k) => k === f), kt, T);
  });
  return svgA(560, 330, o, `动图：virtual address ${hex(VA, 8)} 第一次访问 TLB miss，依次读 page directory 第 1 项和 page table 第 3 项得到 frame 0x5C1，physical address ${hex(PA, 8)}，共 3 次 memory access；第二次访问同一 page TLB hit，只要 1 次`);
}

// ---------- 第 6 站：OPT / LRU / FIFO 同步走（动图） ----------
function replA() {
  const R = [0, 1, 2, 0, 1, 3, 0, 3, 1, 2, 1], NF = 3;
  const sim = (pol) => {
    const fr = [], last = {}, loaded = {}, out = [];
    R.forEach((r, t) => {
      const slot = fr.indexOf(r);
      if (slot >= 0) { last[r] = t; out.push({ hit: true, fr: fr.slice(), slot }); return; }
      let ev = null, s = fr.length;
      if (fr.length < NF) fr.push(r);
      else {
        const by = (f) => fr.reduce((b, p) => (f(p) < f(b) ? p : b));
        if (pol === 'FIFO') ev = by((p) => loaded[p]);
        else if (pol === 'LRU') ev = by((p) => last[p]);
        else { const nx = (p) => { for (let k = t + 1; k < R.length; k++) if (R[k] === p) return k; return 1e9; }; ev = by((p) => -nx(p)); }
        s = fr.indexOf(ev); fr[s] = r;
      }
      loaded[r] = t; last[r] = t;
      out.push({ hit: false, fr: fr.slice(), slot: s, ev });
    });
    return out;
  };
  const pols = ['OPT', 'LRU', 'FIFO'].map((p) => [p, sim(p)]);
  const step = 1.3, n = R.length, T = n * step + 2.0;
  const kt = R.map((_, i) => (i * step) / T).concat([1]);
  const CX = 150, CW = 36;
  let o = text(20, 24, 'reference string', 'ts', 'start');
  R.forEach((r, i) => { o += box(CX + i * CW, 10, CW - 4, 24, 'paper', 2) + text(CX + i * CW + (CW - 4) / 2, 27, String(r), 'tb', 'middle'); });
  // 光标：高亮当前 access 的那一列
  o += `<rect x="${CX - 2}" y="6" width="${CW}" height="${3 * 78 + 40}" rx="3" class="wash">${anim('x', R.map((_, i) => f1(CX + i * CW - 2)).concat([f1(CX + (n - 1) * CW - 2)]), kt, T, true)}</rect>`;
  pols.forEach(([name, out], pi) => {
    const Y = 52 + pi * 78;
    const hits = out.filter((x) => x.hit).length;
    o += text(20, Y + 16, name, 'tb', 'start') + text(20, Y + 34, `hit ${hits}，miss ${n - hits}`, 'ts', 'start');
    out.forEach((x, i) => {
      const cx = CX + i * CW + (CW - 4) / 2;
      o += text(cx, Y + 16, x.hit ? 'H' : 'M', x.hit ? 'tb' : 'tl', 'middle');
      if (x.ev != null) o += text(cx, Y + 34, '−' + x.ev, 'ts', 'middle');
    });
    // 当前 frame 内容（动）
    out.forEach((x, i) => {
      let g = '';
      for (let s = 0; s < NF; s++) {
        const v = x.fr[s];
        g += box(20 + s * 34, Y + 44, 30, 24, s === x.slot ? (x.hit ? 'wash' : 'wash-strong') : 'paper', 2) + text(35 + s * 34, Y + 61, v == null ? '' : String(v), 'tb', 'middle');
      }
      o += grp(g, kt.map((_, k) => Math.min(k, n - 1) === i), kt, T);
    });
  });
  o += text(20, 292, '每行左下的三个格子是此刻 3 个 frame 里的 page；M 下面的 −x 是被赶走的 page。', 'ts', 'start') + text(20, 310, '第 6 步（page 3）：OPT 和 LRU 赶走 2，FIFO 赶走最早进来的 0，下一步就要用 0。', 'ts', 'start');
  return svgA(560, 318, o, '动图：reference string 0 1 2 0 1 3 0 3 1 2 1 在 3 个 frame 上分别用 OPT、LRU、FIFO，逐步显示 frame 内容，OPT 和 LRU 各 6 次 hit，FIFO 4 次');
}

// ---------- 第 7 站：三张表 ----------
function fdtab() {
  let o = '';
  const fdt = (x, y, who) => {
    let q = text(x, y - 6, who + ' 的 fd table', 'ts', 'start');
    q += box(x, y, 110, 22, 'paper', 0) + text(x + 8, y + 15, '0, 1, 2', 'ts', 'start') + text(x + 102, y + 15, 'terminal', 'ts', 'end');
    q += box(x, y + 22, 110, 22, 'wash', 0) + rect(x, y + 22, 110, 22, 'frame') + text(x + 8, y + 37, '3', 'tb', 'start');
    return q;
  };
  const oft = (x, y, l1, l2, hot) => box(x, y, 170, 44, hot ? 'wash ink-s' : 'paper') + text(x + 85, y + 18, l1, 'tb', 'middle') + text(x + 85, y + 36, l2, 'ts', 'middle');
  const ino = (x, y) => box(x, y, 110, 44, 'paper') + text(x + 55, y + 18, 'inode', 'tb', 'middle') + text(x + 55, y + 36, 'log.txt', 'ts', 'middle');
  // 上：fork 共享
  o += text(20, 16, 'fork 之后：两个 descriptor 指向同一项', 'tb', 'start');
  o += fdt(20, 40, 'parent') + fdt(20, 108, 'child');
  o += text(305, 46, 'open file table', 'ts', 'middle') + oft(220, 64, 'offset 0 → 6 → 13', '2 个 descriptor 指向它', true);
  o += text(485, 46, 'inode table', 'ts', 'middle') + ino(430, 64);
  o += arrowH(130, 73, 218, 82, 'ink', 'ink-f') + arrowH(130, 141, 218, 98, 'ink', 'ink-f') + arrowH(390, 86, 428, 86, 'ink', 'ink-f');
  // 下：各自 open
  const Y = 186;
  o += line(20, Y - 22, 540, Y - 22, 'grid');
  o += text(20, Y, '各自 open：两项，两个 offset', 'tb', 'start');
  o += fdt(20, Y + 24, 'parent') + fdt(20, Y + 92, 'child');
  o += oft(220, Y + 40, 'offset 0 → 7', 'parent 写 parent\\n', false) + oft(220, Y + 98, 'offset 0 → 6', 'child 写 child\\n', false);
  o += ino(430, Y + 69);
  o += arrowH(130, Y + 57, 218, Y + 62, 'ink', 'ink-f') + arrowH(130, Y + 125, 218, Y + 120, 'ink', 'ink-f');
  o += arrowH(390, Y + 62, 428, Y + 84, 'ink', 'ink-f') + arrowH(390, Y + 120, 428, Y + 100, 'ink', 'ink-f');
  o += text(20, Y + 166, '上：file 是 child\\nparent\\n（13 byte）；下：两边都从 0 写，file 只剩 parent\\n。', 'ts', 'start');
  return svg(560, Y + 174, o, '上图 fork 之后 parent 和 child 的 3 号 descriptor 指向 open file table 的同一项，共享 offset；下图两个 process 各自 open，各有一项和自己的 offset，但指向同一个 inode');
}

// ---------- 第 7 站：FAT vs inode，以及 inode 的覆盖范围 ----------
function index() {
  let o = '';
  // 上左：FAT
  o += text(20, 16, 'FAT：chain 在一张表里', 'tb', 'start');
  // NUS L12 的例子：ex1.c 3 → 5 → 8，ex2.c 6 → 7，test 2
  const fat = { 2: 'EOF', 3: '5', 5: '8', 6: '7', 7: 'EOF', 8: 'EOF' }, RH = 14, ry = (i) => 26 + i * RH;
  const chain = [3]; while (fat[chain[chain.length - 1]] !== 'EOF') chain.push(+fat[chain[chain.length - 1]]);
  for (let i = 0; i < 11; i++) {
    const y = ry(i), used = i in fat, hot = chain.includes(i);
    o += box(60, y, 70, RH, hot ? 'wash-strong' : used ? 'wash' : 'paper', 0) + text(54, y + 11, String(i), 'ts', 'end') + text(95, y + 11, used ? fat[i] : i < 2 ? '—' : 'FREE', hot ? 'tb' : 'ts', 'middle');
  }
  const hop = (a, b, bend) => { const ya = ry(a) + RH / 2, yb = ry(b) + RH / 2; return path(`M132 ${ya} C ${bend} ${ya}, ${bend} ${yb}, 134 ${yb}`, 'ln') + poly([[133, yb], [141, yb - 4], [141, yb + 4]], 'ln-f'); };
  for (let k = 0; k + 1 < chain.length; k++) o += hop(chain[k], chain[k + 1], 158 + 14 * k);
  o += text(200, 40, 'directory：ex1.c → 3', 'ts', 'start');
  o += text(200, 100, chain.join(' → '), 'tl', 'start') + text(200, 118, '找第 k 个 block', 'ts', 'start') + text(200, 134, '要顺着走 k 步', 'ts', 'start');
  // 上右：inode
  o += text(310, 16, 'inode：自己的 index', 'tb', 'start');
  o += box(310, 30, 90, 94, 'paper') + text(355, 48, 'inode', 'tb', 'middle');
  chain.forEach((b, i) => { o += text(320, 70 + i * 18, `ptr ${i} → ${b}`, 't', 'start'); });
  chain.forEach((b, i) => { const y = 40 + i * 30; o += box(470, y, 70, 24, 'wash', 2) + text(505, y + 17, 'block ' + b, 't', 'middle') + arrowH(400, 66 + i * 18, 468, y + 12, 'mute', 'mute-f'); });
  o += text(310, 150, '第 k 个 block 就是第 k 个 pointer', 'ts', 'start');
  // 下：15 个 pointer 的覆盖
  const Y = 222;
  o += line(20, Y - 22, 540, Y - 22, 'grid');
  o += text(20, Y - 4, 'ext2 inode 的 15 个 pointer（block 4 KB，一个 block 装 1024 个 pointer）', 'tb', 'start');
  for (let i = 0; i < 15; i++) o += box(20 + i * 22, Y + 8, 20, 24, i < 12 ? 'wash' : i === 13 ? 'wash-strong' : 'wash2', 1);
  o += text(20 + 6 * 22, Y + 50, '12 个 direct：48 KB', 'ts', 'middle');
  const lv = [['single', '1024 个 block，4 MB', 12], ['double', '1024² 个 block，4 GB', 13], ['triple', '1024³ 个 block，4 TB', 14]];
  lv.forEach(([nm, s, i], k) => {
    const x = 20 + i * 22 + 10, ty = Y + 70 + k * 34;
    o += line(x, Y + 32, x, ty - 4, i === 13 ? 'ln' : 'mute') + line(x, ty - 4, 344, ty - 4, i === 13 ? 'ln' : 'mute');
    o += text(350, ty, nm + ' indirect', i === 13 ? 'tl' : 't', 'start') + text(350, ty + 15, s, 'ts', 'start');
  });
  o += text(20, Y + 92, '第 5,000,000 个 byte：block 1220', 'ts', 'start') + text(20, Y + 110, '= 12 + 1024 + 184，落在 double indirect', 'ts', 'start') + text(20, Y + 128, '下第 0 个 pointer 的第 184 项', 'ts', 'start');
  return svg(560, Y + 162, o, '上左：FAT 中 ex1.c 的 chain 3 到 5 到 8；上右：inode 里三个 pointer 直接列出 block 3、5、8；下：ext2 inode 的 12 个 direct pointer 与 single、double、triple indirect 各自覆盖 48 KB、4 MB、4 GB、4 TB');
}

// ---------- 第 1 站：stack frame ----------
function stack() {
  // 从高 address（上）到低 address（下），每格一行
  const rows = [
    ['main', 'saved register、旧 FP', 0],
    ['main', 'local r', 0],
    ['f', 'argument x = 5', 1],
    ['f', 'return PC（回到 main）', 1],
    ['f', 'saved FP（main 的）', 1],
    ['f', 'saved register', 1],
    ['f', 'local y', 1],
    ['g', 'argument a = 5', 2],
    ['g', 'argument b = 3', 2],
    ['g', 'return PC（回到 f）', 2],
    ['g', 'saved FP（f 的）', 2],
    ['g', 'saved register', 2],
    ['g', 'local t = 15', 2],
  ];
  const X = 170, W = 210, Y0 = 26, RH = 20;
  let o = text(X + W / 2, 16, 'stack（此刻在 g 里面）', 'tb', 'middle');
  rows.forEach(([fn, s, k], i) => {
    const y = Y0 + i * RH;
    o += box(X, y, W, RH, k === 2 ? 'wash' : k === 1 ? 'wash2' : 'paper', 0) + rect(X, y, W, RH, 'frame') + text(X + 10, y + 14, s, 't', 'start');
  });
  // 右边：每个 frame 的范围
  ['main', 'f', 'g'].forEach((fn, k) => {
    const idx = rows.map((r, i) => (r[2] === k ? i : -1)).filter((i) => i >= 0);
    const y1 = Y0 + idx[0] * RH + 2, y2 = Y0 + (idx[idx.length - 1] + 1) * RH - 2, x = X + W + 10;
    o += path(d([[x, y1], [x + 6, y1], [x + 6, y2], [x, y2]]), 'ink') + text(x + 14, (y1 + y2) / 2 + 4, `${fn} 的 stack frame`, k === 2 ? 'tl' : 'ts', 'start');
  });
  // 左边：FP、SP
  const fpY = Y0 + 10 * RH + RH / 2, spY = Y0 + rows.length * RH;
  o += arrowH(X - 60, fpY, X - 3, fpY, 'ln', 'ln-f') + text(X - 66, fpY + 4, 'FP', 'tl', 'end');
  o += arrowH(X - 60, spY, X - 3, spY, 'ln', 'ln-f') + text(X - 66, spY + 4, 'SP', 'tl', 'end');
  o += text(24, Y0 + 10, '高 address', 'ts', 'start') + arrowH(40, Y0 + 20, 40, Y0 + 120, 'mute', 'mute-f') + text(48, Y0 + 75, 'stack 往下长', 'ts', 'start');
  o += text(24, spY - 24, '低 address', 'ts', 'start');
  const by = spY + 26;
  o += text(20, by, 't 在 FP 往下 2 格、a 在 FP 往上 3 格：g 运行期间 SP 会变，这两个距离不变。', 'ts', 'start');
  return svg(560, by + 8, o, 'main 调用 f，f 调用 g 时的 stack：从高 address 往下依次是 main、f、g 三个 stack frame，每个 callee 的 frame 里有 argument、return PC、saved FP、saved register 和 local variable；FP 指向 g 的 saved FP，SP 指向栈顶 local t');
}

// ---------- 第 1 站：kernel 的结构 ----------
function kernel() {
  const cols = [
    { t: 'monolithic', x: 10, rows: [[['app', 'app']], [['scheduler、memory', 'file system', 'driver']], [['hardware']]], kern: 1 },
    { t: 'microkernel', x: 148, rows: [[['app', 'file system', 'driver']], [['microkernel', 'IPC、底层', 'scheduling']], [['hardware']]], kern: 1 },
    { t: 'type 1 hypervisor', x: 286, rows: [[['guest OS 1', 'guest OS 2']], [['type 1 hypervisor']], [['hardware']]] },
    { t: 'type 2 hypervisor', x: 424, rows: [[['guest OS', 'app']], [['type 2 hypervisor', '']], [['host OS']], [['hardware']]] },
  ];
  const W = 126, RH = 44, top = 34;
  let o = '';
  cols.forEach((c) => {
    o += text(c.x + W / 2, 18, c.t, 'tb', 'middle');
    const n = c.rows.length, H = 4 * RH, rh = H / n;
    c.rows.forEach((r, i) => {
      const y = top + i * rh, cells = r[0].filter((v, k, a) => !(c.t.startsWith('type 2') && i === 1 && k === 1));
      if (c.t.startsWith('type 2') && i === 0) {
        // guest OS 在 hypervisor 上，program 直接在 host OS 上
        o += box(c.x, y + 2, W / 2 - 2, rh - 4, 'wash', 3) + text(c.x + W / 4, y + rh / 2 + 4, 'guest OS', 'ts', 'middle');
        o += box(c.x + W / 2 + 2, y + 2, W / 2 - 2, rh * 2 - 4, 'paper', 3) + text(c.x + 3 * W / 4, y + rh + 4, 'app', 'ts', 'middle');
        return;
      }
      if (c.t.startsWith('type 2') && i === 1) {
        o += box(c.x, y + 2, W / 2 - 2, rh - 4, 'wash-strong', 3) + text(c.x + W / 4, y + rh / 2 - 2, 'type 2', 'ts', 'middle') + text(c.x + W / 4, y + rh / 2 + 11, 'hypervisor', 'ts', 'middle');
        return;
      }
      const isHw = cells[0] === 'hardware';
      if (cells.length > 1 && i === 0) {
        const w = (W - 4 * (cells.length - 1)) / cells.length;
        cells.forEach((s, k) => {
          const xx = c.x + k * (w + 4), hot = s === 'file system' || s === 'driver' || s.startsWith('guest');
          const words = s.split(' ');
          o += box(xx, y + 2, w, rh - 4, hot ? 'wash' : 'paper', 3);
          if (words.length === 2 && w < 50) o += text(xx + w / 2, y + rh / 2 - 2, words[0], 'ts', 'middle') + text(xx + w / 2, y + rh / 2 + 11, words[1], 'ts', 'middle');
          else o += text(xx + w / 2, y + rh / 2 + 4, s, 'ts', 'middle');
        });
      } else {
        const cls = isHw ? 'wash2' : c.kern && i === 1 ? 'solid' : s0(cells[0]);
        o += box(c.x, y + 2, W, rh - 4, cls, 3);
        cells.forEach((s, k) => { o += text(c.x + W / 2, y + rh / 2 + 4 + (k - (cells.length - 1) / 2) * 15, s, cls === 'solid' ? 'tw' : 'ts', 'middle'); });
      }
    });
    if (c.kern) o += line(c.x - 2, top + RH * 4 / 3, c.x + W + 2, top + RH * 4 / 3, 'dash');
  });
  function s0(s) { return s.includes('hypervisor') ? 'wash-strong' : 'paper'; }
  o += text(10, top + 4 * RH + 22, '左边两栏：虚线上面是 user mode，深色是 kernel mode；file system 和 driver 放在哪一边是区别所在。', 'ts', 'start');
  o += text(10, top + 4 * RH + 40, '右边两栏：浅色是 guest OS，深一些的是 hypervisor。', 'ts', 'start');
  return svg(560, top + 4 * RH + 48, o, '四栏对比：monolithic kernel 把 scheduler、memory、file system、driver 都放在 kernel mode；microkernel 只留 IPC 和底层 scheduling，file system 和 driver 在 user mode；type 1 hypervisor 直接在 hardware 上跑多个 guest OS；type 2 hypervisor 跑在 host OS 上');
}

// ---------- 第 2 站：priority inversion ----------
function invSim(inherit) {
  const T = {
    H: { prio: 3, arrive: 2, prog: [['lock'], ['cpu', 2], ['unlock']] },
    M: { prio: 2, arrive: 3, prog: [['cpu', 10]] },
    L: { prio: 1, arrive: 0, prog: [['cpu', 1], ['lock'], ['cpu', 4], ['unlock'], ['cpu', 1]] },
  };
  for (const k in T) Object.assign(T[k], { eff: T[k].prio, pc: 0, left: null, blocked: false, done: false, holds: false });
  let holder = null; const waiters = [], segs = [], events = [];
  for (let t = 0; t < 40; t++) {
    const ready = () => Object.keys(T).filter((k) => T[k].arrive <= t && !T[k].blocked && !T[k].done);
    let cur = null;
    for (let guard = 0; guard < 20; guard++) {
      const r = ready(); if (!r.length) { cur = null; break; }
      cur = r.reduce((a, b) => (T[b].eff > T[a].eff ? b : a));
      const P = T[cur], op = P.prog[P.pc];
      if (!op) { P.done = true; continue; }
      if (op[0] === 'lock') {
        if (holder === null) { holder = cur; P.holds = true; P.pc++; continue; }
        P.blocked = true; waiters.push(cur); events.push([cur, t, 'block']);
        if (inherit) T[holder].eff = Math.max(T[holder].eff, P.eff);
        continue;
      }
      if (op[0] === 'unlock') {
        holder = null; P.holds = false; P.eff = P.prio; P.pc++;
        while (waiters.length) { T[waiters.shift()].blocked = false; }
        events.push([cur, t, 'unlock']);
        continue;
      }
      break;
    }
    if (!cur) { if (Object.values(T).every((P) => P.done)) break; continue; }
    const P = T[cur], op = P.prog[P.pc];
    if (P.left === null) P.left = op[1];
    segs.push([cur, t, t + 1, P.holds]);
    if (--P.left === 0) { P.left = null; P.pc++; if (P.pc >= P.prog.length) P.done = true; }
  }
  // 合并相邻段
  const out = [];
  for (const sg of segs) { const l = out[out.length - 1]; if (l && l[0] === sg[0] && l[2] === sg[1] && l[3] === sg[3]) l[2] = sg[2]; else out.push(sg.slice()); }
  return { segs: out, events, end: Math.max(...out.map((s) => s[2])) };
}
function inv() {
  const A = invSim(false), B = invSim(true), end = Math.max(A.end, B.end);
  const sx = lin(0, end, 70, 540);
  let o = '';
  const lanes = ['H', 'M', 'L'], arrive = { H: 2, M: 3, L: 0 };
  const panel = (R, y0, title) => {
    o += text(20, y0, title, 'tb', 'start');
    lanes.forEach((n, i) => {
      const y = y0 + 28 + i * 26;
      o += text(54, y + 15, n, 'tb', 'end') + line(sx(0), y + 10, sx(end), y + 10, 'grid');
      o += poly([[sx(arrive[n]), y - 1], [sx(arrive[n]) - 4, y - 7], [sx(arrive[n]) + 4, y - 7]], 'ink-f');
      for (const [p, a, b, h] of R.segs.filter((s) => s[0] === n)) o += rect(sx(a), y + 1, sx(b) - sx(a), 18, h ? 'wash-strong' : 'wash2') + rect(sx(a), y + 1, sx(b) - sx(a), 18, 'frame');
    });
    // H 被 R 挡住的那段
    const blk = R.events.find((e) => e[0] === 'H' && e[2] === 'block'), hs = R.segs.find((s) => s[0] === 'H' && s[3]);
    const y = y0 + 28, lab = `H 等 R：${hs[1] - blk[1]} ms`;
    o += line(sx(blk[1]) + 2, y + 10, sx(hs[1]) - 2, y + 10, 'ln-dash');
    if (sx(hs[1]) - sx(blk[1]) > 120) o += text((sx(blk[1]) + sx(hs[1])) / 2, y + 4, lab, 'tl', 'middle');
    else o += text(sx(hs[2]) + 8, y + 15, lab, 'tl', 'start');
    return R;
  };
  panel(A, 16, '没有修正');
  panel(B, 136, 'priority inheritance：L 拿着 R 时继承 H 的 priority');
  const ticks = [...new Set([0, ...A.segs.flatMap((s) => [s[1], s[2]]), ...B.segs.flatMap((s) => [s[1], s[2]])])].sort((a, b) => a - b);
  const AY = 264;
  o += line(sx(0), AY, sx(end), AY, 'axis');
  for (const v of ticks) o += line(sx(v), AY, sx(v), AY + 4, 'axis') + text(sx(v), AY + 16, String(v), 'ts', 'middle');
  o += text(sx(0) - 8, AY + 16, 't (ms)', 'ts', 'end');
  o += rect(70, AY + 28, 18, 12, 'wash-strong') + rect(70, AY + 28, 18, 12, 'frame') + text(94, AY + 38, '拿着 R 在跑', 'ts', 'start');
  o += rect(190, AY + 28, 18, 12, 'wash2') + rect(190, AY + 28, 18, 12, 'frame') + text(214, AY + 38, '没拿 R 在跑', 'ts', 'start');
  o += poly([[320, AY + 30], [316, AY + 24], [324, AY + 24]], 'ink-f') + text(330, AY + 38, '到达', 'ts', 'start');
  return svg(560, AY + 46, o, `priority inversion：上面没有修正，H 在 t=2 被 L 持有的 lock 挡住，M 在 t=3 抢走 CPU 跑到 13，H 等到 t=15；下面 priority inheritance，L 继承 H 的 priority，在 t=5 放掉 lock，H 只等 3 ms`);
}

// ---------- 第 3 站：user thread 与 kernel thread ----------
function uthread() {
  let o = '';
  const panel = (x0, title, kernelView) => {
    const W = 260;
    o += text(x0 + W / 2, 16, title, 'tb', 'middle');
    o += box(x0, 26, W, 74, 'paper', 4) + text(x0 + 8, 40, kernelView ? 'process（user mode）' : 'process（user mode，thread library 管调度）', 'ts', 'start');
    const st = kernelView ? ['Blocked', 'Running', 'Running', 'Ready'] : ['读 disk', '能跑', '能跑', '能跑'];
    for (let i = 0; i < 4; i++) {
      const x = x0 + 10 + i * 62;
      o += box(x, 48, 54, 42, i === 0 ? 'wash-strong' : 'wash', 3) + text(x + 27, 66, 'T' + (i + 1), 'tb', 'middle') + text(x + 27, 82, kernelView ? '' : st[i], 'ts', 'middle');
    }
    o += line(x0, 112, x0 + W, 112, 'dash');
    if (!kernelView) {
      o += box(x0, 122, W, 50, 'wash2', 4) + text(x0 + 8, 138, 'kernel 的 process table', 'ts', 'start');
      o += box(x0 + 60, 144, 140, 22, 'wash-strong', 3) + text(x0 + 130, 159, '这个 process：Blocked', 'tb', 'middle');
    } else {
      o += box(x0, 122, W, 50, 'wash2', 4) + text(x0 + 8, 138, 'kernel 的 thread table', 'ts', 'start');
      for (let i = 0; i < 4; i++) { const x = x0 + 10 + i * 62; o += box(x, 144, 54, 22, i === 0 ? 'wash-strong' : 'paper', 3) + text(x + 27, 159, st[i], 'ts', 'middle'); }
    }
    // cores
    const core = (k, s) => { const x = x0 + 30 + k * 110; return box(x, 186, 90, 26, s ? 'solid' : 'paper', 3) + text(x + 45, 203, s || 'core ' + k + '：空闲', s ? 'tw' : 'ts', 'middle'); };
    o += kernelView ? core(0, 'core 0：T2') + core(1, 'core 1：T3') : core(0, '') + core(1, '');
  };
  panel(10, 'user thread', false);
  panel(290, 'kernel thread', true);
  o += text(10, 232, '左：kernel 只知道有一个 process，它在等 disk，T2 到 T4 也跟着停。右：kernel 逐个 thread 调度。', 'ts', 'start');
  return svg(560, 240, o, '左边 user thread：process 里 4 个 thread，T1 读 disk，kernel 的 process table 里整个 process 是 Blocked，两个 core 都空闲；右边 kernel thread：thread table 里 T1 Blocked、T2 和 T3 在两个 core 上 Running、T4 Ready');
}

// ---------- 第 5 站：first / best / worst fit ----------
function fitSim(strategy, reqs) {
  let holes = [[20, 6], [38, 4], [52, 6]];
  const placed = [];
  reqs.forEach((r, k) => {
    const cand = holes.filter((h) => h[1] >= r);
    if (!cand.length) { placed.push([k, r, null]); return; }
    const h = strategy === 'first' ? cand[0] : strategy === 'best' ? cand.reduce((a, b) => (b[1] < a[1] ? b : a)) : cand.reduce((a, b) => (b[1] > a[1] ? b : a));
    placed.push([k, r, h[0]]); h[0] += r; h[1] -= r; holes = holes.filter((x) => x[1] > 0);
  });
  return { placed, holes };
}
function fit() {
  const reqs = [4, 6, 6], sx = lin(0, 64, 100, 470);
  const fixed = [[0, 8, 'OS'], [8, 20, 'A'], [26, 38, 'B'], [42, 52, 'C'], [58, 64, 'D']];
  let o = text(100, 16, '依次来三个 process：P1 要 4 KB，P2 要 6 KB，P3 要 6 KB', 'tb', 'start');
  [['first', 'First-fit'], ['best', 'Best-fit'], ['worst', 'Worst-fit']].forEach(([st, name], i) => {
    const R = fitSim(st, reqs), y = 34 + i * 58, H = 30;
    o += text(92, y + 20, name, 'tb', 'end');
    o += rect(sx(0), y, sx(64) - sx(0), H, 'paper-f');
    for (const [a, b, n] of fixed) o += rect(sx(a), y, sx(b) - sx(a), H, 'wash2') + rect(sx(a), y, sx(b) - sx(a), H, 'frame') + text((sx(a) + sx(b)) / 2, y + 20, n, 'ts', 'middle');
    for (const [k, r, at] of R.placed) if (at !== null) o += rect(sx(at), y, sx(at + r) - sx(at), H, 'wash-strong') + rect(sx(at), y, sx(at + r) - sx(at), H, 'frame') + text((sx(at) + sx(at + r)) / 2, y + 20, 'P' + (k + 1), 'tb', 'middle');
    for (const [a, len] of R.holes) o += rect(sx(a), y, sx(a + len) - sx(a), H, 'frame') + text((sx(a) + sx(a + len)) / 2, y + H + 13, len + ' KB', 'tl', 'middle');
    o += rect(sx(0), y, sx(64) - sx(0), H, 'ink');
    const fail = R.placed.filter((p) => p[2] === null);
    o += text(482, y + 20, fail.length ? fail.map((p) => 'P' + (p[0] + 1)).join('、') + ' 放不下' : '全部放下', fail.length ? 'tl' : 'ts', 'start');
  });
  for (const v of [0, 16, 32, 48, 64]) o += text(sx(v), 34 + 3 * 58 + 4, v + ' KB', 'ts', 'middle');
  return svg(560, 34 + 3 * 58 + 10, o, 'First-fit、best-fit、worst-fit 处理 4、6、6 KB 三个请求：first-fit 和 worst-fit 把 P1 放进 20 KB 处的 6 KB hole，剩下 2 KB 和 4 KB 两个 hole，P3 放不下；best-fit 把 P1 放进 4 KB 的 hole，三个都放下');
}

// ---------- 第 5 站：buddy system ----------
function buddySim() {
  const K = 6, A = Array.from({ length: K + 1 }, () => []);
  A[K].push(0);
  const used = []; const states = [];
  const snap = (label) => {
    const blocks = [];
    for (let j = 0; j <= K; j++) for (const a of A[j]) blocks.push([a, 1 << j, null]);
    for (const u of used) blocks.push([u.addr, u.size, u.name, u.req]);
    blocks.sort((x, y) => x[0] - y[0]);
    states.push({ label, blocks });
  };
  const alloc = (name, n) => {
    let S = 0; while ((1 << S) < n) S++;
    let R = S; while (R <= K && !A[R].length) R++;
    let addr = A[R].shift();
    while (R > S) { R--; A[R].push(addr + (1 << R)); A[R].sort((a, b) => a - b); }
    used.push({ name, addr, size: 1 << S, req: n });
  };
  const free = (name) => {
    const i = used.findIndex((u) => u.name === name); let { addr, size } = used[i]; used.splice(i, 1);
    let S = Math.log2(size);
    for (;;) {
      const b = addr ^ (1 << S), j = A[S].indexOf(b);
      if (S < K && j >= 0) { A[S].splice(j, 1); addr = Math.min(addr, b); S++; } else { A[S].push(addr); A[S].sort((a, c) => a - c); break; }
    }
  };
  snap('开始');
  alloc('A', 10); snap('1. A 要 10');
  alloc('B', 6); snap('2. B 要 6');
  alloc('C', 20); snap('3. C 要 20');
  free('A'); snap('4. 释放 A');
  free('B'); snap('5. 释放 B');
  return states;
}
function buddy() {
  const st = buddySim(), sx = lin(0, 64, 110, 540), RH = 40;
  let o = '';
  st.forEach((S, i) => {
    const y = 10 + i * RH;
    o += text(100, y + 18, S.label, 'tb', 'end');
    for (const [a, sz, nm, req] of S.blocks) {
      o += rect(sx(a), y, sx(a + sz) - sx(a), 26, nm ? 'wash-strong' : 'paper') + rect(sx(a), y, sx(a + sz) - sx(a), 26, 'frame');
      const lab = nm ? `${nm}：${req} 用 ${sz}` : `${sz}`;
      o += text((sx(a) + sx(a + sz)) / 2, y + 18, lab, nm && sx(a + sz) - sx(a) > 80 ? 'tb' : 'ts', 'middle');
    }
  });
  const by = 10 + st.length * RH;
  for (const v of [0, 8, 16, 24, 32, 48, 64]) o += line(sx(v), by - 12, sx(v), by - 8, 'axis') + text(sx(v), by + 4, String(v), 'ts', 'middle');
  o += text(sx(64), by + 20, 'address（KB）', 'ts', 'end');
  o += text(20, by + 20, '白色是空闲块，数字是大小（KB）', 'ts', 'start');
  return svg(560, by + 26, o, 'buddy system 管理 64 KB：A 要 10 KB 时 64 被分成 32、16、16，A 得 0 处的 16；B 要 6 KB 时 16 处的 16 分成两个 8，B 得 16 处的 8；C 要 20 KB 得 32 处的 32；释放 A 后 0 处 16 空闲但无法合并；释放 B 后先与 24 处的 8 合并成 16，再与 0 处的 16 合并成 32');
}

// ---------- 第 5 站：copy-on-write ----------
function cow() {
  let o = '';
  const panel = (x0, title, after) => {
    o += text(x0 + 130, 16, title, 'tb', 'middle');
    const pt = (y, who, pf, ro) => box(x0, y, 120, 46, 'paper', 3) + text(x0 + 8, y + 16, who + ' 的 page table', 'ts', 'start') + box(x0 + 8, y + 22, 104, 18, 'wash', 2) + text(x0 + 14, y + 35, 'VP 2 → PF ' + pf, 't', 'start') + text(x0 + 108, y + 35, ro ? '只读' : '可写', ro ? 'tl' : 'ts', 'end');
    o += pt(34, 'parent', 9, !after) + pt(120, 'child', after ? 14 : 9, !after);
    const fr = (y, pf, val, hot) => box(x0 + 170, y, 90, 40, hot ? 'wash-strong' : 'wash2', 3) + text(x0 + 215, y + 16, 'PF ' + pf, 'tb', 'middle') + text(x0 + 215, y + 32, 'x = ' + val, 't', 'middle');
    o += fr(50, 9, 100, false);
    o += arrowH(x0 + 120, 65, x0 + 168, 68, 'ink', 'ink-f');
    if (!after) o += arrowH(x0 + 120, 151, x0 + 168, 80, 'ink', 'ink-f');
    else { o += fr(130, 14, 101, true) + arrowH(x0 + 120, 151, x0 + 168, 150, 'ln', 'ln-f'); }
  };
  panel(10, 'fork 刚结束', false);
  panel(300, 'child 写了 x 之后', true);
  o += line(285, 30, 285, 180, 'grid');
  o += text(10, 202, '左：两个 PTE 指向同一个 frame，都只读。右：child 的写入触发 exception，OS 复制出 PF 14 给 child。', 'ts', 'start');
  return svg(560, 210, o, 'copy-on-write：fork 刚结束时 parent 和 child 的 page table 中 VP 2 都指向 PF 9 且只读；child 写 x 后 OS 把 PF 9 复制到 PF 14，child 的 VP 2 改指 PF 14 可写，x 等于 101，parent 仍指 PF 9，x 等于 100');
}

// ---------- 第 5 站：segmentation ----------
function seg() {
  const T = [['0 code', 1400, 1100], ['1 data', 6300, 400], ['2 heap', 4300, 1000], ['3 stack', 3200, 1000]];
  const sid = 2, off = 53, pa = T[sid][1] + off;
  let o = text(20, 18, 'logical address (2, 53)', 'tb', 'start');
  o += box(20, 26, 60, 26, 'wash-strong', 2) + text(50, 44, 'id 2', 'tb', 'middle') + box(84, 26, 70, 26, 'wash', 2) + text(119, 44, 'offset 53', 't', 'middle');
  const TX = 44, TY = 86;
  o += text(TX, TY - 8, 'segment table', 'ts', 'start') + text(TX + 120, TY - 8, 'base', 'ts', 'middle') + text(TX + 180, TY - 8, 'limit', 'ts', 'middle');
  T.forEach(([n, b, l], i) => {
    const y = TY + i * 24, hot = i === sid;
    o += box(TX, y, 210, 24, hot ? 'wash-strong' : 'paper', 0) + text(TX + 8, y + 16, n, hot ? 'tb' : 't', 'start') + text(TX + 120, y + 16, String(b), 't', 'middle') + text(TX + 180, y + 16, String(l), 't', 'middle');
  });
  o += path(d([[28, 54], [28, TY + sid * 24 + 12]]), 'ln') + arrowH(28, TY + sid * 24 + 12, TX - 2, TY + sid * 24 + 12, 'ln', 'ln-f');
  o += text(TX, TY + 4 * 24 + 24, `${off} < ${T[sid][2]}：合法`, 'tl', 'start') + text(TX, TY + 4 * 24 + 44, `physical = ${T[sid][1]} + ${off} = ${pa}`, 'tb', 'start');
  o += text(TX, TY + 4 * 24 + 66, '(1, 500)：500 ≥ 400，segmentation fault', 'ts', 'start');
  // physical memory
  const sy = lin(0, 7000, 26, 290), MX = 400, MW = 120;
  o += text(MX + MW / 2, 16, 'physical memory', 'ts', 'middle');
  o += rect(MX, sy(0), MW, sy(7000) - sy(0), 'paper-f') + rect(MX, sy(0), MW, sy(7000) - sy(0), 'frame');
  T.forEach(([n, b, l], i) => { o += rect(MX, sy(b), MW, sy(b + l) - sy(b), i === sid ? 'wash-strong' : 'wash') + rect(MX, sy(b), MW, sy(b + l) - sy(b), 'frame') + text(MX + MW / 2, (sy(b) + sy(b + l)) / 2 + 4, n.split(' ')[1], 'ts', 'middle'); });
  for (const v of [0, 1400, 2500, 3200, 4200, 4300, 5300, 6300, 6700]) {
    if (v === 4200 || v === 4300) continue;
    o += text(MX - 6, sy(v) + 4, String(v), 'ts', 'end');
  }
  o += text(MX - 6, sy(4250) + 4, '4200 / 4300', 'ts', 'end');
  o += arrowH(MX + MW + 40, sy(pa), MX + MW + 3, sy(pa), 'ln', 'ln-f') + text(MX + MW + 8, sy(pa) - 6, String(pa), 'tl', 'start');
  return svg(560, 300, o, 'segmentation：logical address (2, 53) 用 segment id 2 查 segment table 得到 heap 的 base 4300 和 limit 1000，53 小于 1000，physical address 4353；右边四个 segment 分别在 1400、3200、4300、6300 开始，之间有空隙');
}

// ---------- 第 7 站：disk 与 partition 的布局 ----------
function layout() {
  let o = '';
  const bar = (y, label, parts, x0 = 20, x1 = 540) => {
    o += text((x0 + x1) / 2, y - 6, label, 'tb', 'middle');
    const tot = parts.reduce((a, p) => a + p[1], 0), sx = lin(0, tot, x0, x1);
    let acc = 0; const xs = [];
    for (const [s, w, cls] of parts) {
      const a = sx(acc), b = sx(acc + w); xs.push([a, b]);
      o += rect(a, y, b - a, 30, cls || 'paper') + rect(a, y, b - a, 30, 'frame') + text((a + b) / 2, y + 19, s, 'ts', 'middle');
      acc += w;
    }
    return xs;
  };
  const d1 = bar(24, '一块 disk', [['MBR', 1, 'wash2'], ['partition 1（FAT）', 5, 'wash'], ['partition 2（ext2）', 5, 'wash']]);
  const f = bar(100, 'partition 1 展开：FAT', [['boot', 2, 'wash2'], ['FAT', 3, 'wash-strong'], ['FAT 副本', 3, 'wash'], ['root dir', 3], ['data blocks', 9]]);
  o += line(d1[1][0], 54, 20, 94, 'dash') + line(d1[1][1], 54, 540, 94, 'dash');
  const e = bar(176, 'partition 2 展开：ext2', [['boot', 2, 'wash2'], ['block group 0', 5, 'wash-strong'], ['block group 1', 5, 'wash'], ['…', 2]]);
  bar(252, 'block group 0 展开', [['superblock', 4, 'wash2'], ['group desc', 4, 'wash2'], ['block bitmap', 4, 'wash'], ['inode bitmap', 4, 'wash'], ['inode table', 4, 'wash-strong'], ['data blocks', 5]]);
  o += line(e[1][0], 206, 20, 246, 'dash') + line(e[1][1], 206, 540, 246, 'dash');
  return svg(560, 288, o, 'disk 布局：MBR 后面是两个 partition；FAT partition 依次是 boot、FAT、FAT 副本、root directory、data blocks；ext2 partition 由 boot 和若干 block group 组成，每个 block group 依次是 superblock、group descriptor、block bitmap、inode bitmap、inode table、data blocks');
}

// ---------- 第 7 站：ext2 的 /sub/file ----------
function pathWalk() {
  const steps = [
    ['inode 2（/）', ['data → block 15'], 'ino'],
    ['block 15', ['.  D  2', 'sub  D  8', '…'], 'dir'],
    ['inode 8（sub）', ['data → block 20'], 'ino'],
    ['block 20', ['.  D  8', 'file  F  6', '…'], 'dir'],
    ['inode 6（file）', ['检查 permission', 'data → block 23'], 'ino'],
    ['block 23', ['file 的内容'], 'data'],
  ];
  const W = 150, H = 78, GX = 40;
  let o = '';
  const pos = (i) => [20 + (i % 3) * (W + GX), 30 + Math.floor(i / 3) * (H + 46)];
  steps.forEach(([t, lines, k], i) => {
    const [x, y] = pos(i);
    o += text(x, y - 8, `${i + 1}. 读 ${t.split('（')[0]}`, 'ts', 'start');
    o += box(x, y, W, H, k === 'ino' ? 'wash' : k === 'data' ? 'wash-strong' : 'paper', 4) + text(x + W / 2, y + 18, t, 'tb', 'middle');
    lines.forEach((s, j) => { const hot = /sub|file  F|→/.test(s); o += text(x + W / 2, y + 38 + j * 16, s, hot ? 'tl' : 't', 'middle'); });
    if (i < steps.length - 1) {
      if (i % 3 < 2) o += arrowH(x + W + 2, y + H / 2, x + W + GX - 2, y + H / 2, 'ln', 'ln-f');
      else { const [nx, ny] = pos(i + 1); o += path(d([[x + W / 2, y + H + 2], [x + W / 2, y + H + 22], [nx + W / 2, y + H + 22]]), 'ln') + arrowH(nx + W / 2, y + H + 22, nx + W / 2, ny - 18, 'ln', 'ln-f'); }
    }
  });
  o += text(20, 2 * (H + 46) + 26, 'Directory entry 写成 “名字 type inode number”；root 的 inode number 约定为 2。', 'ts', 'start');
  return svg(560, 2 * (H + 46) + 34, o, 'ext2 读 /sub/file 的六步：读 inode 2 得 block 15，block 15 里 sub 的 inode 是 8，读 inode 8 得 block 20，block 20 里 file 的 inode 是 6，读 inode 6 得 block 23，读 block 23 得到内容');
}

// ---------- 第 7 站：disk scheduling ----------
function disk() {
  const start = 13, req = [13, 14, 2, 18, 17, 21, 15];
  const fcfs = req.slice();
  const ssf = []; { let cur = start; const left = req.slice(); while (left.length) { let bi = 0; left.forEach((r, i) => { if (Math.abs(r - cur) < Math.abs(left[bi] - cur)) bi = i; }); cur = left.splice(bi, 1)[0]; ssf.push(cur); } }
  const dist = (seq) => seq.reduce((acc, r, i) => acc + Math.abs(r - (i ? seq[i - 1] : start)), 0);
  const sx = lin(0, 24, 50, 540);
  let o = '';
  const panel = (y0, name, seq) => {
    const sy = (i) => y0 + 18 + i * 13;
    o += text(20, y0 + 4, `${name}：${seq.join(' → ')}，共移动 ${dist(seq)} 个 track`, 'tb', 'start');
    for (const v of [0, 2, 13, 14, 15, 17, 18, 21, 24]) o += line(sx(v), sy(0) - 4, sx(v), sy(seq.length - 1) + 4, 'grid');
    o += path(d(seq.map((r, i) => [sx(r), sy(i)])), 'ln');
    seq.forEach((r, i) => { o += circle(sx(r), sy(i), 3.5, i ? 'ln-f' : 'ink-f'); });
    return sy(seq.length - 1);
  };
  const e1 = panel(14, 'FCFS', fcfs);
  const e2 = panel(e1 + 32, 'SSF', ssf);
  const AY = e2 + 14;
  o += line(sx(0), AY, sx(24), AY, 'axis');
  for (const v of [0, 2, 13, 14, 15, 17, 18, 21, 24]) o += line(sx(v), AY, sx(v), AY + 4, 'axis') + text(sx(v), AY + 16, String(v), 'ts', 'middle');
  o += text(sx(0) - 8, AY + 16, 'track', 'ts', 'end');
  return svg(560, AY + 22, o, `disk scheduling：head 在 track 13，请求 13、14、2、18、17、21、15；FCFS 按到达顺序移动 ${dist(fcfs)} 个 track，SSF 每次去最近的请求，顺序 ${ssf.join('、')}，移动 ${dist(ssf)} 个 track`);
}

export default {
  'cs2106-race0': race0,
  'cs2106-frag': frag,
  'cs2106-fork': fork,
  'cs2106-syscall': syscall,
  'cs2106-ctx': ctxA,
  'cs2106-states': states,
  'cs2106-srt': srt,
  'cs2106-rr': rrA,
  'cs2106-race': raceA,
  'cs2106-dine': dine,
  'cs2106-paging': paging,
  'cs2106-walk': walkA,
  'cs2106-repl': replA,
  'cs2106-fdtab': fdtab,
  'cs2106-index': index,
  'cs2106-stack': stack,
  'cs2106-kernel': kernel,
  'cs2106-inv': inv,
  'cs2106-uthread': uthread,
  'cs2106-fit': fit,
  'cs2106-buddy': buddy,
  'cs2106-cow': cow,
  'cs2106-seg': seg,
  'cs2106-layout': layout,
  'cs2106-path': pathWalk,
  'cs2106-disk': disk,
};
