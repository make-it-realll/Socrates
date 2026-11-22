import { svg, svgA, d, path, line, rect, circle, poly, text, anim, ashow, f1 } from '../lib/svg.mjs';

// 概念线“排成一列”（concurrency 与 consistency）的图。
// 贯穿全文的例子：bal = 5，两个 withdraw(5)，每个只有 R（读 bal）和 W（写回）两步。

// ---------- 小工具 ----------
function arr(x1, y1, x2, y2, lc = 'ink', fc = 'ink-f', size = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang) => [x2 - size * Math.cos(a + ang), y2 - size * Math.sin(a + ang)];
  return line(x1, y1, x2 - 2 * Math.cos(a), y2 - 2 * Math.sin(a), lc) + poly([[x2, y2], p(0.42), p(-0.42)], fc);
}
// 逐帧离散显示：durs 是每一帧停留的秒数
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [0];
  let acc = 0;
  for (let i = 0; i < durs.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  kt.push(1);
  const show = (on) => ashow([...on, on[on.length - 1]], kt, T);
  return { T, kt, show, n: durs.length };
}
// 同一位置、随帧变化的一段文字
function swapText(F, x, y, vals, cls, anchor = 'middle') {
  const uniq = [...new Set(vals)].filter((v) => v !== '' && v != null);
  return uniq.map((v) => `<g>${text(x, y, v, cls, anchor)}${F.show(vals.map((w) => w === v))}</g>`).join('');
}
const showG = (F, on, body) => `<g>${body}${F.show(on)}</g>`;

// ---------- 1. 开头：两处 double spend ----------
function double() {
  let o = '';
  const ys = [78, 118, 168, 208];
  // 左：两个 thread，一个 bal
  o += text(140, 16, '两个 thread，一个共享的 bal', 'tb', 'middle');
  const xT1 = 40, xB = 140, xT2 = 240;
  o += text(xT1, 42, 'T1', 'tb', 'middle') + text(xT2, 42, 'T2', 'tb', 'middle') + text(xB, 42, 'bal', 'tb', 'middle');
  o += line(xT1, 50, xT1, 236, 'grid') + line(xT2, 50, xT2, 236, 'grid');
  o += rect(xB - 16, 52, 32, ys[2] - 52, 'wash') + rect(xB - 16, ys[2], 32, 236 - ys[2], 'wash2');
  o += text(xB, 124, '5', 'tl', 'middle') + text(xB, 206, '0', 'tb', 'middle');
  o += arr(xB - 18, ys[0], xT1 + 5, ys[0]) + text(xT1 + 8, ys[0] - 6, 'R1：b = 5', 'ts');
  o += arr(xB + 18, ys[1], xT2 - 5, ys[1]) + text(xT2 - 8, ys[1] - 6, 'R2：b = 5', 'ts', 'end');
  o += arr(xT1 + 5, ys[2], xB - 18, ys[2]) + text(xT1 + 8, ys[2] - 6, 'W1：bal = 0', 'ts');
  o += arr(xT2 - 5, ys[3], xB + 18, ys[3]) + text(xT2 - 8, ys[3] - 6, 'W2：bal = 0', 'ts', 'end');
  o += circle(xT1, ys[2], 4, 'solid') + text(xT1 + 8, ys[2] + 17, '付 5', 'tl');
  o += circle(xT2, ys[3], 4, 'solid') + text(xT2 - 8, ys[3] + 17, '付 5', 'tl', 'end');
  o += text(140, 272, '两次检查都看到 5，一共付出 10', 'ts', 'middle');
  // 右：两个 node，各一份 ledger
  const xL = 332, xR = 505, yR = [78, 100, 130, 160];
  o += line(285, 8, 285, 276, 'grid');
  o += text(420, 16, '两个 node，各一份 ledger', 'tb', 'middle');
  o += text(xL, 42, 'Bob 的 node', 'tb', 'middle') + text(xR, 42, 'Carol 的 node', 'tb', 'middle');
  o += line(xL, 50, xL, 236, 'grid') + line(xR, 50, xR, 236, 'grid');
  o += circle(xL, yR[0], 4, 'ink-f') + text(xL + 8, yR[0] + 4, 'R：coin c 还没花', 'ts');
  o += circle(xR, yR[1], 4, 'ink-f') + text(xR - 8, yR[1] + 4, 'R：coin c 还没花', 'ts', 'end');
  o += circle(xL, yR[2], 4, 'solid') + text(xL + 8, yR[2] + 4, 'W：标成 spent', 'tl');
  o += circle(xR, yR[3], 4, 'solid') + text(xR - 8, yR[3] + 4, 'W：标成 spent', 'tl', 'end');
  // 互相通知，但都晚到
  o += arr(xL + 3, yR[2] + 8, xR - 3, 240, 'dash', 'ink-f');
  o += arr(xR - 3, yR[3] + 8, xL + 3, 232, 'dash', 'ink-f');
  o += text(xL + 6, 244, '收到', 'ts') + text(xR - 6, 252, '收到', 'ts', 'end');
  o += text(420, 272, '“c 已经 spent”的消息到达时，对方早已检查完', 'ts', 'middle');
  return svg(560, 278, o, '左边：两个 thread 共享 bal = 5，按 R1、R2、W1、W2 的顺序执行，两个都读到 5，都付出 5。右边：Bob 和 Carol 的 node 各有一份 ledger，分别收到 Alice 用同一个 coin 付款的 transaction，各自先检查 coin 还没花、再标成 spent，互相通知的消息都在对方检查之后才到');
}

// ---------- 2. progress graph ----------
function grid(ox, oy, n, m, s, xl, yl) {
  // 返回点 (i, j) 的坐标函数和底图
  const P = (i, j) => [ox + i * s, oy - j * s];
  let o = '';
  for (let i = 0; i <= n; i++) o += line(...P(i, 0), ...P(i, m), 'grid');
  for (let j = 0; j <= m; j++) o += line(...P(0, j), ...P(n, j), 'grid');
  xl.forEach((t, i) => { o += text(ox + (i + 0.5) * s, oy + 18, t, 'ts', 'middle'); });
  yl.forEach((t, j) => { o += text(ox - 8, oy - (j + 0.5) * s + 4, t, 'ts', 'end'); });
  return { P, o };
}
function progress() {
  let o = '';
  // 左：withdraw，2 × 2
  const s1 = 70, L = grid(70, 200, 2, 2, s1, ['R1', 'W1'], ['R2', 'W2']);
  o += text(140, 16, 'withdraw：6 条路', 'tb', 'middle');
  o += L.o;
  o += path(d([L.P(0, 0), L.P(2, 0), L.P(2, 2)]), 'ln') + path(d([L.P(0, 0), L.P(0, 2), L.P(2, 2)]), 'ln');
  for (let i = 0; i <= 2; i++) for (let j = 0; j <= 2; j++) o += circle(...L.P(i, j), 3.2, 'ink-f');
  o += circle(...L.P(1, 1), 9, 'wash-strong') + circle(...L.P(1, 1), 3.5, 'ink-f');
  o += text(L.P(1, 1)[0] + 12, L.P(1, 1)[1] - 10, '(1, 1)', 'tb');
  o += text(140, 236, '横向：T1 走一步；纵向：T2 走一步', 'ts', 'middle');
  o += text(L.P(2, 0)[0] + 6, L.P(2, 0)[1] + 4, 'T1 整个在前', 'tl');
  o += text(L.P(0, 2)[0] + 4, L.P(0, 2)[1] - 10, 'T2 整个在前', 'tl');
  // 右：counter，3 × 3
  const s2 = 46, R = grid(360, 200, 3, 3, s2, ['L1', 'U1', 'S1'], ['L2', 'U2', 'S2']);
  o += text(430, 16, 'counter++：20 条路', 'tb', 'middle');
  const [ux0, uy0] = R.P(1, 2), [ux1, uy1] = R.P(2, 1);
  o += rect(ux0 - 11, uy0 - 11, ux1 - ux0 + 22, uy1 - uy0 + 22, 'wash-strong', 8);
  o += R.o;
  o += path(d([R.P(0, 0), R.P(3, 0), R.P(3, 3)]), 'ln') + path(d([R.P(0, 0), R.P(0, 3), R.P(3, 3)]), 'ln');
  for (let i = 0; i <= 3; i++) for (let j = 0; j <= 3; j++) o += circle(...R.P(i, j), 3, 'ink-f');
  // CS2106 图里那条：L1 U1 L2 U2 S2 S1
  o += path(d([R.P(0, 0), R.P(1, 0), R.P(2, 0), R.P(2, 1), R.P(2, 2), R.P(2, 3), R.P(3, 3)]), 'dash');
  o += text(R.P(1.4, 1.5)[0] - 4, R.P(1.4, 1.5)[1] + 4, 'unsafe', 'tb', 'middle');
  o += text(430, 236, '中间 4 个点：两人都 load 过、都没 store', 'ts', 'middle');
  o += text(430, 254, '虚线 L1 U1 L2 U2 S2 S1：结果 51', 'ts', 'middle');
  return svg(560, 260, o, '两张 progress graph。左边是两个 withdraw，横轴 R1、W1，纵轴 R2、W2，3 × 3 个点，从左下到右上的 6 条路里，沿两条边走的 2 条是 serial order，其余 4 条都经过中间的点 (1, 1)。右边是两个 counter++，各三步，中间 4 个点组成 unsafe region，20 条路里只有沿边的 2 条不进去');
}

// ---------- 3. serialization graph 随着路一步步长出来（动图） ----------
function sgA() {
  const s = 74, ox = 60, oy = 222;
  const P = (i, j) => [ox + i * s, oy - j * s];
  const bad = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2]], badSt = ['', 'R1', 'R2', 'W1', 'W2'];
  const good = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]], goodSt = ['', 'R1', 'W1', 'R2', 'W2'];
  // 帧：0 坏路走完；1..5 坏路；6 停；7..11 好路
  const fr = [];
  fr.push({ run: 'b', k: 4, hold: true });
  for (let k = 0; k <= 4; k++) fr.push({ run: 'b', k });
  for (let k = 0; k <= 4; k++) fr.push({ run: 'g', k });
  const durs = fr.map((q, i) => (i === 0 ? 3.6 : q.k === 4 ? 3 : 1.3));
  const F = frames(durs);
  // 每一帧有哪些 edge：e12 = T1→T2，e21 = T2→T1；以及新加的 conflict 说明
  const info = (q) => {
    const seq = (q.run === 'b' ? badSt : goodSt).slice(1, q.k + 1);
    const pos = (x) => seq.indexOf(x);
    const has = (a, b) => pos(a) >= 0 && pos(b) >= 0 && pos(a) < pos(b);
    const why12 = [], why21 = [];
    for (const [a, b] of [['R1', 'W2'], ['W1', 'W2'], ['W1', 'R2']]) if (has(a, b)) why12.push(a + ' 在 ' + b + ' 前');
    for (const [a, b] of [['R2', 'W1'], ['W2', 'W1'], ['W2', 'R1']]) if (has(a, b)) why21.push(a + ' 在 ' + b + ' 前');
    return { seq, e12: why12.length > 0, e21: why21.length > 0, why12, why21 };
  };
  let o = '';
  for (let i = 0; i <= 2; i++) o += line(...P(i, 0), ...P(i, 2), 'grid');
  for (let j = 0; j <= 2; j++) o += line(...P(0, j), ...P(2, j), 'grid');
  ['R1', 'W1'].forEach((t, i) => { o += text(ox + (i + 0.5) * s, oy + 18, t, 'ts', 'middle'); });
  ['R2', 'W2'].forEach((t, j) => { o += text(ox - 8, oy - (j + 0.5) * s + 4, t, 'ts', 'end'); });
  for (let i = 0; i <= 2; i++) for (let j = 0; j <= 2; j++) o += circle(...P(i, j), 3, 'ink-f');
  o += circle(...P(1, 1), 9, 'wash-strong');
  // 走过的路
  for (const [run, pts] of [['b', bad], ['g', good]]) {
    for (let k = 1; k <= 4; k++) {
      const on = fr.map((q) => q.run === run && q.k >= k);
      o += showG(F, on, line(...P(...pts[k - 1]), ...P(...pts[k]), 'ln'));
    }
    for (let k = 0; k <= 4; k++) {
      const on = fr.map((q) => q.run === run && q.k === k);
      o += showG(F, on, circle(...P(...pts[k]), 7, 'solid'));
    }
  }
  // 右边的 SG
  const A = [370, 92], B = [500, 92];
  o += text(435, 30, 'serialization graph', 'tb', 'middle');
  o += circle(...A, 20, 'paper') + text(A[0], A[1] + 5, 'T1', 'tb', 'middle');
  o += circle(...B, 20, 'paper') + text(B[0], B[1] + 5, 'T2', 'tb', 'middle');
  o += showG(F, fr.map((q) => info(q).e12), arr(A[0] + 20, A[1] - 8, B[0] - 21, B[1] - 8, 'ln', 'ln-f', 8));
  o += showG(F, fr.map((q) => info(q).e21), arr(B[0] - 20, B[1] + 8, A[0] + 21, A[1] + 8, 'ln', 'ln-f', 8));
  o += swapText(F, 435, 66, fr.map((q) => info(q).why12.join('，')), 'ts');
  o += swapText(F, 435, 128, fr.map((q) => info(q).why21.join('，')), 'ts');
  o += swapText(F, 435, 170, fr.map((q) => { const z = info(q); return z.e12 && z.e21 ? 'cycle：排不成一列' : z.e12 ? '只有 T1 → T2：排成 T1, T2' : z.e21 ? '目前只有 T2 → T1' : '还没有 edge'; }), 'tb');
  o += swapText(F, 435, 196, fr.map((q) => { const z = info(q); return z.seq.length ? '已执行：' + z.seq.join(' ') : '开始'; }), 'ts');
  o += swapText(F, 435, 218, fr.map((q) => (q.k < 4 ? '' : q.run === 'b' ? '付出 10，bal = 0' : '付出 5，bal = 0')), 'tl');
  o += text(435, 246, 'Ti → Tj：Ti 的某个 step 在 Tj 的 conflicting step 之前', 'ts', 'middle');
  return svgA(560, 252, o, '动图：左边是 withdraw 的 progress graph，一个点沿着路一步步走；右边是 serialization graph。先走 R1 R2 W1 W2：W1 时因为 R2 在 W1 前长出 T2 到 T1 的 edge，W2 时因为 R1 在 W2 前长出 T1 到 T2 的 edge，形成 cycle。再走 R1 W1 R2 W2：只长出 T1 到 T2 的 edge，排成 T1、T2');
}

// ---------- 4. 两把 lock 的 progress graph：deadlock region ----------
function locks() {
  let o = '';
  const s = 36, oy = 222;
  const panel = (ox, title, yl, deadlock) => {
    const P = (i, j) => [ox + i * s, oy - j * s];
    let g = text(ox + 2.5 * s, 18, title, 'tb', 'middle');
    // T1：+L1 +L2 −L2 −L1，拿着 L1 在 [1,4]，L2 在 [2,3]
    const hold1 = { L1: [1, 4], L2: [2, 3] };
    const hold2 = deadlock ? { L2: [1, 4], L1: [2, 3] } : { L1: [1, 4], L2: [2, 3] };
    for (const k of ['L1', 'L2']) {
      const [a, b] = hold1[k], [c, e] = hold2[k];
      const [x0, y0] = P(a, e), [x1, y1] = P(b, c);
      g += rect(x0, y0, x1 - x0, y1 - y0, k === 'L1' ? 'wash' : 'wash-strong');
    }
    if (deadlock) {
      g += text(...P(3.5, 2.5).map((v, i) => v + (i ? 5 : 0)), 'L1', 'tb', 'middle');
      g += text(...P(2.5, 3.5).map((v, i) => v + (i ? 5 : 0)), 'L2', 'tb', 'middle');
      const [x0, y0] = P(1, 2), [x1, y1] = P(2, 1);
      g += rect(x0, y0, x1 - x0, y1 - y0, 'band-n');
      g += path(d([P(0, 0), P(0.5, 0), P(0.5, 0.55), P(1.65, 0.55), P(1.65, 1.7)]), 'ink-b');
      g += circle(...P(1.65, 1.7), 4.5, 'solid');
    } else {
      g += text(...P(1.5, 3.5).map((v, i) => v + (i ? 5 : 0)), 'L1', 'tb', 'middle');
      g += text(...P(2.5, 2.5).map((v, i) => v + (i ? 5 : 0)), 'L2', 'tb', 'middle');
      g += path(d([P(0, 0), P(0.5, 0), P(0.5, 0.55), P(4.5, 0.55), P(4.5, 5)]), 'ink-b');
    }
    for (let i = 0; i <= 5; i++) g += line(...P(i, 0), ...P(i, 5), 'grid');
    for (let j = 0; j <= 5; j++) g += line(...P(0, j), ...P(5, j), 'grid');
    ['+L1', '+L2', '−L2', '−L1'].forEach((t, i) => { g += text(P(i + 1, 0)[0], oy + 16, t, 'ts', 'middle'); });
    yl.forEach((t, j) => { g += text(ox - 6, P(0, j + 1)[1] + 4, t, 'ts', 'end'); });
    g += text(ox + 2.5 * s, oy + 34, '横轴 T1，纵轴 T2', 'ts', 'middle');
    return g;
  };
  o += panel(40, 'T2 先拿 L2', ['+L2', '+L1', '−L1', '−L2'], true);
  o += panel(352, 'T2 也先拿 L1', ['+L1', '+L2', '−L2', '−L1'], false);
  o += text(228, 196, '灰色方块：', 'ts', 'start') + text(228, 212, 'deadlock region', 'ts', 'start');
  o += arr(226, 200, 40 + 2 * s - 2, oy - s - 1, 'mute', 'mute-f', 6);
  return svg(560, 262, o, '两张 progress graph，横轴是 T1 的 +L1 +L2 −L2 −L1（+ 是拿，− 是放），纵轴是 T2。标 L1、L2 的是两人同时拿着那把 lock 的 forbidden region。左边 T2 先拿 L2 再拿 L1，两个 forbidden region 交成十字，左下夹出一块灰色的 deadlock region，粗线走进去后向右、向上都会撞进 forbidden region，停在那里。右边 T2 也先拿 L1，L2 的区域在 L1 的里面，粗线可以绕过去');
}

// ---------- 5. quorum：mutual exclusion 是 n = 1 ----------
function quorum() {
  let o = '';
  const rows = [
    { n: 1, A: [0, 0], B: [0, 0], f: [], y: 56, lab: 'n = 1，Q = 1：一把 lock', note: '重叠 ≥ 1 + 1 − 1 = 1' },
    { n: 5, A: [0, 2], B: [2, 4], f: [], y: 142, lab: 'n = 5，Q = 3：majority（只会 crash）', note: '重叠 ≥ 3 + 3 − 5 = 1' },
    { n: 9, A: [0, 5], B: [3, 8], f: [4, 5], y: 228, lab: 'n = 9，Q = 6，f = 2：2/3 quorum', note: '重叠 ≥ 6 + 6 − 9 = 3 > f' },
  ];
  const sp = 42, x0 = 40;
  for (const r of rows) {
    o += text(x0 - 14, r.y - 32, r.lab, 'tb') + text(550, r.y - 32, r.note, 'tl', 'end');
    const X = (i) => x0 + i * sp;
    o += rect(X(r.A[0]) - 17, r.y - 20, X(r.A[1]) - X(r.A[0]) + 34, 22, 'wash', 8);
    o += rect(X(r.B[0]) - 17, r.y - 2, X(r.B[1]) - X(r.B[0]) + 34, 22, 'wash-strong', 8);
    for (let i = 0; i < r.n; i++) {
      const bad = r.f.includes(i);
      o += circle(X(i), r.y, 10, bad ? 'solid2' : 'paper');
      if (bad) o += text(X(i), r.y + 4, 'f', 'tw', 'middle');
    }
  }
  o += text(110, 52, '上面一条：X 的 quorum', 'ts') + text(110, 70, '下面一条：Y 的 quorum', 'ts');
  o += text(280, 268, '深色的 f：可能作恶、X 和 Y 都签的 node；重叠里至少还剩一个 honest 的', 'ts', 'middle');
  return svg(560, 274, o, '三行 node。第一行只有 1 个 node，X 和 Y 都要它同意，重叠是 1，就是一把 lock。第二行 5 个 node，X 拿到前 3 个、Y 拿到后 3 个，重叠 1 个。第三行 9 个 node，X 拿到前 6 个、Y 拿到后 6 个，重叠 3 个，其中 2 个是可能作恶的 node，至少还剩 1 个 honest 的');
}

// ---------- 6. Peterson 在 TSO 上（动图） ----------
function petersonA() {
  // 帧：0 = 走完；1 开始；2..5 四个 store 进 buffer；6 T0 读；7 T1 读；8 drain
  const st = [];
  const S = (b0, b1, mem, r0, r1, in0, in1, msg) => ({ b0, b1, mem, r0, r1, in0, in1, msg });
  const m0 = { f0: '0', f1: '0', t: '–' }, m1 = { f0: '1', f1: '1', t: '0' };
  st.push(S(['flag[0] = 1', 'turn = 1'], ['flag[1] = 1', 'turn = 0'], m0, 'flag[1] → 0，turn → 1', 'flag[0] → 0', true, true, '两人都在 critical section 里，四个 store 还在 buffer 里'));
  st.push(S([], [], m0, '', '', false, false, '开始：flag[0] = flag[1] = 0'));
  st.push(S(['flag[0] = 1'], [], m0, '', '', false, false, 'T0：flag[0] = 1，进 T0 的 store buffer'));
  st.push(S(['flag[0] = 1', 'turn = 1'], [], m0, '', '', false, false, 'T0：turn = 1，也进 buffer'));
  st.push(S(['flag[0] = 1', 'turn = 1'], ['flag[1] = 1'], m0, '', '', false, false, 'T1：flag[1] = 1，进 T1 的 buffer'));
  st.push(S(['flag[0] = 1', 'turn = 1'], ['flag[1] = 1', 'turn = 0'], m0, '', '', false, false, 'T1：turn = 0，也进 buffer'));
  st.push(S(['flag[0] = 1', 'turn = 1'], ['flag[1] = 1', 'turn = 0'], m0, 'flag[1] → 0，turn → 1', '', true, false, 'T0 读 flag[1]：memory 里是 0；条件不成立，进去'));
  st.push(S(['flag[0] = 1', 'turn = 1'], ['flag[1] = 1', 'turn = 0'], m0, 'flag[1] → 0，turn → 1', 'flag[0] → 0', true, true, 'T1 读 flag[0]：memory 里也是 0；进去'));
  st.push(S([], [], m1, 'flag[1] → 0，turn → 1', 'flag[0] → 0', true, true, 'buffer 这才 drain 到 memory，已经晚了'));
  const F = frames(st.map((_, i) => (i === 0 ? 3.8 : i === st.length - 1 ? 2.6 : 1.7)));
  let o = '';
  const cores = [{ x: 20, nm: 'T0（core 0）', k: 'b0', r: 'r0', inn: 'in0' }, { x: 300, nm: 'T1（core 1）', k: 'b1', r: 'r1', inn: 'in1' }];
  for (const c of cores) {
    o += rect(c.x, 26, 240, 92, 'paper', 8) + text(c.x + 10, 44, c.nm, 'tb');
    o += text(c.x + 10, 66, 'store buffer（FIFO）', 'ts');
    o += rect(c.x + 10, 72, 220, 36, 'wash2', 4);
    for (let slot = 0; slot < 2; slot++) {
      o += swapText(F, c.x + 65 + slot * 110, 95, st.map((q) => q[c.k][slot] || ''), 'tb');
    }
    o += showG(F, st.map((q) => q[c.inn]), rect(c.x + 150, 32, 82, 20, 'solid', 4) + text(c.x + 191, 46, 'in CS', 'tw', 'middle'));
  }
  // memory
  o += rect(170, 170, 220, 62, 'paper', 8) + text(280, 188, 'memory', 'tb', 'middle');
  const cells = [['flag[0]', 'f0', 215], ['flag[1]', 'f1', 280], ['turn', 't', 345]];
  for (const [nm, k, x] of cells) {
    o += text(x, 206, nm, 'ts', 'middle');
    o += swapText(F, x, 224, st.map((q) => q.mem[k]), 'tl');
  }
  // 读的箭头
  o += showG(F, st.map((q) => !!q.r0), arr(280, 168, 110, 124, 'ln', 'ln-f'));
  o += showG(F, st.map((q) => !!q.r1), arr(280, 168, 450, 124, 'ln', 'ln-f'));
  o += swapText(F, 20, 162, st.map((q) => (q.r0 ? 'T0 读到 ' + q.r0 : '')), 'ts', 'start');
  o += swapText(F, 540, 162, st.map((q) => (q.r1 ? 'T1 读到 ' + q.r1 : '')), 'ts', 'end');
  o += swapText(F, 280, 258, st.map((q) => q.msg), 'tb');
  o += text(280, 280, 'Load 先查自己的 buffer（turn 读到的是自己写的 1），查不到才读 memory', 'ts', 'middle');
  return svgA(560, 286, o, '动图：两个 core 各有一个 store buffer，下面是 memory。T0 写 flag[0] = 1、turn = 1，T1 写 flag[1] = 1、turn = 0，四个 store 都停在各自的 buffer 里。T0 读 flag[1]，memory 里是 0，进入 critical section；T1 读 flag[0]，也是 0，也进入。最后 buffer 才 drain 到 memory');
}

// ---------- 7. 两个 stage 的 ring buffer（动图） ----------
const LOAD7 = [[0, 3], [3, 6], [6, 9], [9, 12]], MMA7 = [[3, 5], [6, 8], [9, 11], [12, 14]];
function ringA() {
  const DUR = 16, TEND = 14;                 // 0..14 走游标，最后 2 秒停在结尾
  const kt = (t) => t / DUR;
  const sx = (t) => 60 + t * 33;
  const ev = [0, 3, 5, 6, 8, 9, 11, 12, 14];
  const showAt = (fn) => anim('opacity', ev.map((t) => (fn(t) ? 1 : 0)), ev.map(kt), DUR, true);
  let o = '';
  o += rect(10, 22, 112, 50, 'paper', 8) + text(66, 42, 'producer', 'tb', 'middle') + text(66, 60, 'TMA warp', 'ts', 'middle');
  o += rect(438, 22, 112, 50, 'paper', 8) + text(494, 42, 'consumer', 'tb', 'middle') + text(494, 60, 'MMA warp', 'ts', 'middle');
  const tile = (st, t) => {
    for (let i = st; i < 4; i += 2) {
      if (t >= LOAD7[i][0] && t < LOAD7[i][1]) return ['搬 tile ' + i, 'wash'];
      if (t >= LOAD7[i][1] && t < MMA7[i][0]) return ['tile ' + i + '：满', 'wash-strong'];
      if (t >= MMA7[i][0] && t < MMA7[i][1]) return ['算 tile ' + i, 'wash-strong'];
    }
    return ['空', 'wash2'];
  };
  for (const st of [0, 1]) {
    const x = 160 + st * 130;
    const keys = [...new Set(ev.map((t) => tile(st, t).join('|')))];
    for (const key of keys) {
      const [lab, cls] = key.split('|');
      o += `<g>${rect(x, 22, 110, 50, cls, 6)}${text(x + 55, 52, lab, 'tb', 'middle')}${showAt((t) => tile(st, t).join('|') === key)}</g>`;
    }
    o += rect(x, 22, 110, 50, 'frame', 6) + text(x + 55, 88, 'stage ' + st, 'ts', 'middle');
  }
  o += arr(124, 47, 158, 47, 'mute', 'mute-f', 6) + arr(402, 47, 436, 47, 'mute', 'mute-f', 6);
  const notFull = (t) => 2 - LOAD7.filter(([a]) => a <= t).length + MMA7.filter(([, b]) => b <= t).length;
  const notEmpty = (t) => LOAD7.filter(([, b]) => b <= t).length - MMA7.filter(([a]) => a <= t).length;
  for (const v of [0, 1, 2]) {
    o += `<g>${text(20, 114, 'notFull（空的 stage）= ' + v, 'tl', 'start')}${showAt((t) => notFull(t) === v)}</g>`;
    o += `<g>${text(540, 114, 'notEmpty（满的 stage）= ' + v, 'tl', 'end')}${showAt((t) => notEmpty(t) === v)}</g>`;
  }
  const yL = 140, yM = 174;
  o += text(52, yL + 15, 'load', 'ts', 'end') + text(52, yM + 15, 'MMA', 'ts', 'end');
  LOAD7.forEach(([a, b], i) => { o += rect(sx(a), yL, sx(b) - sx(a) - 2, 20, i % 2 ? 'wash-strong' : 'wash', 3) + text((sx(a) + sx(b)) / 2, yL + 15, 'L' + i, 'tb', 'middle'); });
  MMA7.forEach(([a, b], i) => { o += rect(sx(a), yM, sx(b) - sx(a) - 2, 20, i % 2 ? 'wash-strong' : 'wash', 3) + text((sx(a) + sx(b)) / 2, yM + 15, 'M' + i, 'tb', 'middle'); });
  o += line(sx(0), 204, sx(14), 204, 'axis');
  for (let t = 0; t <= 14; t++) { o += line(sx(t), 204, sx(t), 208, 'axis'); if (t % 2 === 0) o += text(sx(t), 222, String(t), 'ts', 'middle'); }
  o += arr(sx(5), yM - 2, sx(6) - 1, yL + 22, 'dash', 'ink-f', 6);
  o += text(sx(5), 244, 'L2 写 stage 0 之前要等 M0 读完（5），producer 到 6 才空出来', 'ts', 'middle');
  const xs = [sx(0), sx(TEND), sx(TEND)].map(f1), kk = [0, kt(TEND), 1];
  o += `<line x1="${sx(0)}" y1="132" x2="${sx(0)}" y2="206" class="ln">${anim('x1', xs, kk, DUR)}${anim('x2', xs, kk, DUR)}</line>`;
  return svgA(560, 252, o, '动图：上面是 producer、两个 stage 和 consumer，下面是 4 块 tile 的 timeline，load 每块 3 个时间单位，MMA 每块 2 个。竖线走过 timeline 时，上面的 stage 显示空、正在搬、满、正在算，中间是 notFull 和 notEmpty 的值。L2 要等 M0 在时刻 5 读完 stage 0，producer 到 6 才空出来，最后一个 MMA 在 14 结束');
}

// ---------- 8. stage 数：2 和 4 ----------
function simPipe(loads, mma, K) {
  const n = loads.length, ls = [], le = [], ms = [], me = [];
  for (let i = 0; i < n; i++) {
    let s = i > 0 ? le[i - 1] : 0;
    if (i >= K) s = Math.max(s, me[i - K]);
    ls.push(s); le.push(s + loads[i]);
    ms.push(Math.max(le[i], i > 0 ? me[i - 1] : 0)); me.push(ms[i] + mma);
  }
  return { ls, le, ms, me };
}
function depth() {
  const loads = [1, 1, 1, 7, 1, 1, 1, 7];
  const sx = (t) => 70 + t * 14.5;
  let o = '';
  o += text(10, 14, '浅色 load 用 1，深色 load 用 7；MMA 每块 3；实心灰块：MMA 在等数据', 'ts');
  [[2, 34], [4, 126]].forEach(([K, y0]) => {
    const r = simPipe(loads, 3, K);
    const idle = loads.reduce((acc, _, i) => acc + (i ? r.ms[i] - r.me[i - 1] : 0), 0);
    o += text(10, y0 + 4, 'K = ' + K + ' 个 stage', 'tb') + text(550, y0 + 4, '结束于 ' + r.me[7] + '，MMA 空等 ' + idle, 'tl', 'end');
    o += text(62, y0 + 30, 'load', 'ts', 'end') + text(62, y0 + 58, 'MMA', 'ts', 'end');
    r.ls.forEach((a, i) => { o += rect(sx(a), y0 + 16, sx(r.le[i]) - sx(a) - 1.5, 20, i === 3 || i === 7 ? 'wash-strong' : 'wash', 2) + text((sx(a) + sx(r.le[i])) / 2, y0 + 30, String(i), 'ts', 'middle'); });
    r.ms.forEach((a, i) => { o += rect(sx(a), y0 + 44, sx(r.me[i]) - sx(a) - 1.5, 20, 'wash', 2) + text((sx(a) + sx(r.me[i])) / 2, y0 + 58, String(i), 'ts', 'middle'); });
    for (let i = 1; i < loads.length; i++) if (r.ms[i] > r.me[i - 1]) o += rect(sx(r.me[i - 1]), y0 + 44, sx(r.ms[i]) - sx(r.me[i - 1]) - 1.5, 20, 'solid2', 2);
  });
  o += line(sx(0), 218, sx(33), 218, 'axis');
  for (let t = 0; t <= 33; t++) { o += line(sx(t), 218, sx(t), 222, 'axis'); if (t % 5 === 0) o += text(sx(t), 236, String(t), 'ts', 'middle'); }
  return svg(560, 242, o, '同样 8 块 tile，load 的时间依次是 1、1、1、7、1、1、1、7，MMA 每块 3。上面 2 个 stage：慢的 load 期间 MMA 两次各空等 4，结束于 33。下面 4 个 stage：producer 在快的几块里先搬好 3 块，慢的 load 被盖住，MMA 一次也不等，结束于 25');
}

// ---------- 9. 会回来的值：tag 与 sequence number ----------
function wrap() {
  let o = '';
  const R = 60;
  const dial = (cx, cy, hi) => {
    let g = circle(cx, cy, R, 'frame');
    for (let i = 0; i < 4; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 2, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      g += circle(x, y, 15, hi.includes(i) ? 'solid' : 'paper') + text(x, y + 5, String(i), hi.includes(i) ? 'tw' : 'tb', 'middle');
    }
    return g;
  };
  const arc = (cx, cy, r, a0, a1, cls) => {
    const p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)];
    const big = a1 - a0 > Math.PI ? 1 : 0;
    const tx = -Math.sin(a1), ty = Math.cos(a1);
    const h = [[p1[0] + 7 * tx, p1[1] + 7 * ty], [p1[0] - 3 * ty, p1[1] + 3 * tx], [p1[0] + 3 * ty, p1[1] - 3 * tx]];
    return `<path d="M${f1(p0[0])} ${f1(p0[1])}A${r} ${r} 0 ${big} 1 ${f1(p1[0])} ${f1(p1[1])}" class="${cls}"/>` + poly(h, cls === 'ln' ? 'ln-f' : 'ink-f');
  };
  const c1 = [140, 136];
  o += text(140, 16, 'CAS 的 2-bit tag', 'tb', 'middle');
  o += dial(...c1, [0]);
  ['pop A', 'pop B', 'push D', 'push A'].forEach((op, i) => {
    const a0 = -Math.PI / 2 + (i * Math.PI) / 2 + 0.34, a1 = -Math.PI / 2 + ((i + 1) * Math.PI) / 2 - 0.42;
    o += arc(...c1, R + 6, a0, a1, 'ln');
    const am = (a0 + a1) / 2, lx = c1[0] + (R + 26) * Math.cos(am), ly = c1[1] + (R + 26) * Math.sin(am);
    o += text(lx, ly + 4, op, 'tl', Math.cos(am) > 0 ? 'start' : 'end');
  });
  o += text(c1[0], c1[1] - 4, 'T1 手里', 'ts', 'middle') + text(c1[0], c1[1] + 14, '(A, 0)', 'tb', 'middle');
  o += text(140, 240, 'T2 的四次 CAS 之后 top 又是 (A, 0)', 'ts', 'middle');
  o += text(140, 258, 'T1 的 CAS 成功，top 指向已经 free 的 B', 'ts', 'middle');
  const c2 = [420, 136];
  o += line(280, 8, 280, 264, 'grid');
  o += text(420, 16, 'SR 的 2-bit sequence number', 'tb', 'middle');
  o += text(420, 40, 'receiver window：{3, 0, 1}', 'ts', 'middle');
  o += dial(...c2, [0]);
  o += arc(...c2, R + 20, Math.PI - 0.25, 2 * Math.PI + 0.25, 'dash');
  o += text(c2[0], c2[1] - 4, '收到 0：', 'ts', 'middle') + text(c2[0], c2[1] + 14, '新的？旧的？', 'tb', 'middle');
  o += text(420, 240, '已收下 0、1、2，window 挪到 {3, 0, 1}', 'ts', 'middle');
  o += text(420, 258, 'N = 3 > 2<tspan class="sup" dy="-5">k−1</tspan><tspan dy="5"> = 2：重发的旧 pkt0 落进 window</tspan>', 'ts', 'middle');
  return svg(560, 264, o, '两个只有 0 到 3 四个值的圈。左边是 CAS 用的 2-bit tag：T1 读到 (A, 0) 后被换下，T2 做了 pop A、pop B、push D、push A 四次成功的 CAS，tag 走了一整圈回到 0，T1 的 CAS 看不出区别。右边是 CS2105 Selective Repeat 的 2-bit sequence number：receiver 收完 0、1、2 后 window 是 3、0、1，再收到编号 0 时分不清是新数据还是重发的旧数据');
}

// ---------- 10. spin：CPU 上浪费，GPU 上 deadlock ----------
function spin() {
  let o = '';
  const sx = (t) => 108 + t * 10.4;
  o += text(10, 16, 'CPU：一个 core，quantum 10 ms', 'tb');
  const rows = ['H：拿着 lock', 'S1：spin', 'S2：spin', 'S3：spin'];
  rows.forEach((r, i) => { o += text(98, 48 + i * 22, r, 'ts', 'end'); o += line(sx(0), 44 + i * 22, sx(42), 44 + i * 22, 'grid'); });
  o += rect(sx(0), 36, sx(10) - sx(0), 16, 'wash-strong', 2);
  [1, 2, 3].forEach((i) => { o += rect(sx(i * 10), 36 + i * 22, sx(10) - sx(0), 16, 'solid2', 2); });
  o += rect(sx(40), 36, sx(42) - sx(40), 16, 'solid', 2) + text(sx(41), 30, 'unlock', 'tl', 'middle');
  o += line(sx(0), 128, sx(42), 128, 'axis');
  for (let t = 0; t <= 40; t += 10) o += line(sx(t), 128, sx(t), 132, 'axis') + text(sx(t), 146, t + ' ms', 'ts', 'middle');
  o += text(sx(21), 164, 'Timer interrupt 把 core 抢回来：浪费 30 ms，H 最后总能回来 unlock', 'ts', 'middle');
  o += line(10, 176, 550, 176, 'grid');
  o += text(10, 196, 'GPU：SM 一次只放得下一个 block', 'tb');
  o += rect(30, 210, 220, 56, 'paper', 8) + text(140, 228, 'SM', 'tb', 'middle');
  o += rect(44, 238, 192, 20, 'solid2', 4) + text(140, 253, 'block 1：while (*flag == 0)', 'tw', 'middle');
  o += rect(340, 224, 180, 34, 'wash', 6) + text(430, 246, 'block 0：等 SM 空出来', 'tb', 'middle');
  o += arr(338, 241, 254, 241, 'dash', 'ink-f');
  o += text(430, 278, '只有 block 0 会写 flag = 1', 'ts', 'middle');
  o += text(140, 282, 'block 不会被抢下：永远转下去', 'ts', 'middle');
  return svg(560, 288, o, '上：一个 CPU core，H 拿着 lock 时被 timer interrupt 换下，S1、S2、S3 依次各 spin 一整个 10 ms 的 quantum，40 ms 时 H 回来 unlock。下：一个 SM 只能放一个 block，block 1 占着 SM spin，等 block 0 写 flag；block 0 在外面等 SM 空出来，block 不会被抢下，两边永远等');
}

// ---------- 11. data parallel：谁来加 ----------
function allreduce() {
  let o = '';
  const g = ['0.1', '0.2', '0.3', '0.4'];
  const own = ['1.0', '1.0', '1.0000001', '1.0'];
  const ordr = ['0 + 1 + 2 + 3', '1 + 2 + 3 + 0', '2 + 3 + 0 + 1', '3 + 0 + 1 + 2'];
  o += text(140, 16, '每个 rank 从自己的那份开始加', 'tb', 'middle');
  o += text(420, 16, 'ring：这一段只沿一条路加一次', 'tb', 'middle');
  for (let r = 0; r < 4; r++) {
    const y = 52 + r * 48;
    o += rect(10, y - 17, 72, 34, 'paper', 6) + text(46, y - 2, 'rank ' + r, 'tb', 'middle') + text(46, y + 12, 'g = ' + g[r], 'ts', 'middle');
    o += text(92, y - 3, ordr[r], 'ts');
    o += text(92, y + 13, '和 = ' + own[r], r === 2 ? 'tl' : 'tb');
    o += text(272, y + 13, 'w → ' + (r === 2 ? '0.09999999' : '0.1'), r === 2 ? 'tl' : 'ts', 'end');
  }
  o += line(285, 8, 285, 264, 'grid');
  const C = [[360, 70], [480, 70], [480, 186], [360, 186]];
  C.forEach(([x, y], r) => { o += rect(x - 36, y - 18, 72, 36, 'paper', 6) + text(x, y - 2, 'rank ' + r, 'tb', 'middle') + text(x, y + 13, 'g = ' + g[r], 'ts', 'middle'); });
  const ro = [1, 2, 3, 0];
  for (let k = 0; k < 3; k++) {
    const a = C[ro[k]], b = C[ro[k + 1]];
    const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]);
    o += arr(a[0] + dx * 38, a[1] + dy * 20, b[0] - dx * 38, b[1] - dy * 20, 'ln', 'ln-f');
  }
  o += text(524, 124, '0.2 + 0.3', 'ts', 'middle') + text(524, 140, '= 0.5', 'ts', 'middle');
  o += text(420, 222, '+ 0.4 = 0.9', 'ts', 'middle');
  o += text(318, 124, '+ 0.1', 'ts', 'middle') + text(318, 140, '= 1.0', 'tl', 'middle');
  o += text(420, 242, 'all-gather 把这同一个 1.0 拷给每个 rank', 'ts', 'middle');
  o += text(420, 260, '四份 replica 的 w 都是 0.1', 'tb', 'middle');
  o += text(140, 260, 'float32；w = 0.2，learning rate 0.1', 'ts', 'middle');
  return svg(560, 266, o, '左边：四个 rank 的 gradient 是 0.1、0.2、0.3、0.4（float32），每个 rank 从自己的那份开始按 ring 的顺序加，rank 2 得到 1.0000001，其余得到 1.0，一步 SGD 之后 rank 2 的 w 是 0.09999999，其余是 0.1。右边：ring reduce-scatter 里这一段从 rank 1 开始沿 ring 加到 rank 0，只加一遍，得到 1.0，再 all-gather 拷给所有 rank，四份 w 都是 0.1');
}

export default {
  'thread-concurrency-double': double,
  'thread-concurrency-progress': progress,
  'thread-concurrency-sg': sgA,
  'thread-concurrency-locks': locks,
  'thread-concurrency-quorum': quorum,
  'thread-concurrency-peterson': petersonA,
  'thread-concurrency-ring': ringA,
  'thread-concurrency-depth': depth,
  'thread-concurrency-wrap': wrap,
  'thread-concurrency-spin': spin,
  'thread-concurrency-allreduce': allreduce,
};
