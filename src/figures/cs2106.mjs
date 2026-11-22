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
  o += arrowH(245, 54, 313, 54, 'ln', 'ln-f') + text(279, 40, 'dispatch', 'tl', 'middle');
  o += arrowH(315, 72, 247, 72, 'ink', 'ink-f') + text(281, 94, 'preempt', 'ts', 'middle') + text(281, 109, '（timer interrupt）', 'ts', 'middle');
  o += arrowH(405, 62, 453, 62, 'ink', 'ink-f') + text(429, 52, 'exit', 'ts', 'middle');
  o += arrowH(370, 81, 312, 170, 'ink', 'ink-f') + text(356, 136, 'wait for event', 'ts', 'start') + text(356, 151, '（读 disk、wait()）', 'ts', 'start');
  o += arrowH(248, 170, 192, 81, 'ink', 'ink-f') + text(206, 136, 'event 发生', 'ts', 'end');
  o += text(280, 232, 'Scheduler 只在 Ready 里挑；Blocked 的 process 给它 CPU 也没用。', 'ts', 'middle');
  return svg(560, 240, o, 'Process 的五个 state：New 经 admit 到 Ready，Ready 经 dispatch 到 Running，Running 被 preempt 回 Ready、等待事件进入 Blocked、exit 进入 Terminated，Blocked 在事件发生后回到 Ready');
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
  const fat = { 2: 'EOF', 5: '9', 9: '2' }, RH = 14, ry = (i) => 26 + i * RH;
  for (let i = 0; i < 11; i++) {
    const y = ry(i), hot = i in fat;
    o += box(60, y, 70, RH, hot ? 'wash-strong' : 'paper', 0) + text(54, y + 11, String(i), 'ts', 'end') + text(95, y + 11, hot ? fat[i] : i === 0 || i === 1 ? '—' : '0', hot ? 'tb' : 'ts', 'middle');
  }
  const hop = (a, b, bend) => { const ya = ry(a) + RH / 2, yb = ry(b) + RH / 2; return path(`M132 ${ya} C ${bend} ${ya}, ${bend} ${yb}, 134 ${yb}`, 'ln') + poly([[133, yb], [141, yb - 4], [141, yb + 4]], 'ln-f'); };
  o += hop(5, 9, 160) + hop(9, 2, 185);
  o += text(200, 40, 'directory：file → 5', 'ts', 'start');
  o += text(200, 100, '5 → 9 → 2', 'tl', 'start') + text(200, 118, '找第 k 个 block', 'ts', 'start') + text(200, 134, '要顺着走 k 步', 'ts', 'start');
  // 上右：inode
  o += text(310, 16, 'inode：自己的 index', 'tb', 'start');
  o += box(310, 30, 90, 94, 'paper') + text(355, 48, 'inode', 'tb', 'middle');
  ['ptr 0 → 5', 'ptr 1 → 9', 'ptr 2 → 2'].forEach((s, i) => { o += text(320, 70 + i * 18, s, 't', 'start'); });
  [5, 9, 2].forEach((b, i) => { const y = 40 + i * 30; o += box(470, y, 70, 24, 'wash', 2) + text(505, y + 17, 'block ' + b, 't', 'middle') + arrowH(400, 66 + i * 18, 468, y + 12, 'mute', 'mute-f'); });
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
  return svg(560, Y + 162, o, '上左：FAT 中 file 的 chain 5 到 9 到 2；上右：inode 里三个 pointer 直接列出 block 5、9、2；下：ext2 inode 的 12 个 direct pointer 与 single、double、triple indirect 各自覆盖 48 KB、4 MB、4 GB、4 TB');
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
};
