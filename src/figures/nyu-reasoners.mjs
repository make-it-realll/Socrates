import { svg, svgA, lin, logx, d, path, line, rect, circle, text, it, arrow, curve, axes, anim, ashow, f1 } from '../lib/svg.mjs';

// ---------- 公用：Countdown [96, 97, 68] → 125，只用 + − ×（减法大数在前） ----------
const START = [96, 97, 68], TARGET = 125;
function moves(nums) {
  const out = [];
  for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) {
    const a = Math.max(nums[i], nums[j]), b = Math.min(nums[i], nums[j]);
    const rest = nums.filter((_, k) => k !== i && k !== j);
    for (const [op, v] of [['+', a + b], ['−', a - b], ['×', a * b]]) out.push({ step: `${a}${op}${b}`, op, a, b, v, rest: [v, ...rest] });
  }
  return out;
}
// 第一层的 9 个节点，各自的 3 个叶子和 Monte Carlo value（随机 completion policy 下命中 125 的比例）
const L1 = moves(START).map((m) => {
  const leaves = moves(m.rest).map((x) => ({ ...x, hit: x.v === TARGET }));
  const hits = leaves.filter((x) => x.hit).length;
  return { ...m, leaves, hits, value: hits / leaves.length };
});
const frac = (v) => (v === 0 ? '0' : Math.abs(v - 1 / 3) < 1e-9 ? '1/3' : Math.abs(v - 2 / 3) < 1e-9 ? '2/3' : '1');

// 一个元素按帧显示 / 隐藏（discrete）：on[0] 是静态时的样子
const gshow = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// ---------- 第 1 站：三个数的整棵树 ----------
function tree() {
  let o = '';
  const R = [280, 22];
  o += rect(R[0] - 70, R[1] - 15, 140, 26, 'paper', 6) + text(R[0], R[1] + 3, '96, 97, 68 → 125', 'tb', 'middle');
  const X = (i) => 33 + i * 61.75, Y = 82;
  L1.forEach((m, i) => {
    const x = X(i);
    o += line(R[0], R[1] + 11, x, Y - 19, 'mute');
    o += rect(x - 29, Y - 19, 58, 38, 'paper', 5);
    o += text(x, Y - 4, m.step, 't', 'middle');
    o += text(x, Y + 12, m.rest.join(', '), 'ts', 'middle');
    m.leaves.forEach((lf, k) => {
      const y = Y + 44 + k * 19;
      if (lf.hit) o += rect(x - 28, y - 13, 56, 18, 'wash', 4);
      o += text(x, y, `${lf.op} ${lf.v}`, lf.hit ? 'tl' : 'ts', 'middle');
    });
    o += line(x, Y + 19, x, Y + 27, 'mute');
  });
  o += text(280, 200, '第一层：合并哪两个数、用哪个 operation（下一行是剩下的两个数）。', 'ts', 'middle');
  o += text(280, 217, '下面三行：剩下两个数的 3 种合并结果。27 个 leaf 里只有 3 个等于 125。', 'ts', 'middle');
  return svg(560, 224, o, 'Countdown 用 96、97、68 凑 125 的整个 search tree：第一层 9 种合并，每种下面 3 个结果，共 27 个 leaf，其中 3 个等于 125');
}

// ---------- 第 1 站：每个 token 的串行深度 ----------
function depth() {
  let o = '';
  const L = 4, bw = 22, bh = 12, lp = 17, cp = 34, top = 58;
  const colTop = top, colBot = top + (L - 1) * lp + bh;
  const column = (cx, hot) => {
    let q = '';
    for (let l = 0; l < L; l++) q += rect(cx - bw / 2, top + (L - 1 - l) * lp, bw, bh, hot ? 'wash-strong' : 'wash2', 2);
    return q;
  };
  // 左：直接作答
  const xl = [70, 104, 138];
  o += text(104, 20, '直接作答', 'tb', 'middle');
  xl.forEach((cx, j) => { o += column(cx, j === 2) + text(cx, colBot + 18, `x${['₁', '₂', '₃'][j]}`, 't', 'middle'); });
  o += line(xl[2], colBot - 2, xl[2], colTop + 2, 'ln');
  o += arrow(xl[2], colTop - 2, xl[2], colTop - 14, 'ln') + text(xl[2], colTop - 20, 'a', 'tl', 'middle');
  o += text(104, colBot + 44, '答案能用到的串行计算：L 层', 'ts', 'middle');
  // 右：先写中间 token
  const names = ['x₁', 'x₂', 'x₃', 'z₁', 'z₂', 'z₃'], outs = ['z₁', 'z₂', 'z₃', 'a'];
  const xr = names.map((_, j) => 302 + j * cp);
  o += text(387, 20, '先写中间 token', 'tb', 'middle');
  xr.forEach((cx, j) => { o += column(cx, j >= 2) + text(cx, colBot + 18, names[j], j >= 3 ? 'tl' : 't', 'middle'); });
  for (let j = 2; j < 6; j++) {
    const cx = xr[j];
    o += line(cx, colBot - 2, cx, colTop + 2, 'ln');
    o += text(cx, colTop - 10, outs[j - 2], 'tl', 'middle');
    if (j < 5) {
      const gx = cx + cp / 2, nx = xr[j + 1];
      o += path(d([[cx + 7, colTop - 14], [gx, colTop - 14], [gx, colBot + 6], [nx, colBot + 6]]), 'ln-dash');
      o += arrow(nx, colBot + 6, nx, colBot + 1, 'ln', 5);
    }
  }
  o += text(387, colBot + 44, '每个写出的 token 回到下一列的底部：串行计算 4 × L 层', 'ts', 'middle');
  o += text(40, colTop + 6, 'layer L', 'ts', 'end') + text(40, colBot, 'layer 1', 'ts', 'end');
  o += text(280, colBot + 72, '每一列是同一个 model 在一个位置上的一次 forward（约 2N FLOPs）。z 是“96+97=193”这样的中间 token。', 'ts', 'middle');
  return svg(560, colBot + 80, o, '左边直接作答，答案 token 的计算只经过一列 L 层；右边先写三个中间 token，每个 token 作为下一列的 input 回到底部，最长的串行路径经过四列共 4L 层');
}

// ---------- 第 2 站：pass@k 随 k 变化（动图） ----------
const PS = [0.95, 0.8, 0.6, 0.4, 0.25, 1 / 9, 0.05, 0.02, 0.005, 0];
const passk = (p, k) => 1 - Math.pow(1 - p, k);
function passkA() {
  const U = [], kt = [], holds = [];
  // u = log2 k，从 0 走到 8；整数处停顿
  let t = 0;
  const step = 0.1, hold = 0.7;
  for (let i = 0; i <= 64; i++) {
    const u = i / 8;
    U.push(u); kt.push(t);
    if (i % 8 === 0) { t += hold; U.push(u); kt.push(t); holds.push([kt[kt.length - 2], t, Math.round(u)]); }
    if (i < 64) t += step;
  }
  t += 0.9; U.push(8); kt.push(t - 0.01); U.push(0); kt.push(t);
  const T = t, KT = kt.map((x) => x / T);
  const mean = (k) => PS.reduce((s, p) => s + passk(p, k), 0) / PS.length;
  let o = '';
  // 左：每题一个 bar
  const bx = 84, bwid = 180, y0 = 44, rh = 19;
  o += text(20, 22, '每道题的 pass@k', 'tb', 'start');
  PS.forEach((p, i) => {
    const y = y0 + i * rh;
    const lab = Math.abs(p - 1 / 9) < 1e-9 ? '1/9' : String(p);
    o += text(bx - 8, y + 4, 'p = ' + lab, 'ts', 'end');
    o += rect(bx, y - 7, bwid, 13, 'wash2', 2);
    const ws = U.map((u) => f1(bwid * passk(p, 2 ** u)));
    o += `<rect x="${bx}" y="${f1(y - 7)}" width="${ws[0]}" height="13" rx="2" class="solid">${anim('width', ws, KT, T)}</rect>`;
    if (Math.abs(p - 1 / 9) < 1e-9) o += text(bx + bwid + 6, y + 4, 'Countdown', 'ts', 'start');
  });
  o += line(bx + bwid, y0 - 10, bx + bwid, y0 + 9 * rh + 9, 'dash') + text(bx + bwid, y0 + 9 * rh + 24, '1', 'ts', 'middle') + text(bx, y0 + 9 * rh + 24, '0', 'ts', 'middle');
  // 右：平均 pass@k
  const sx = lin(0, 8, 372, 548), sy = lin(0, 1, 214, 44);
  o += text(372, 22, '10 道题平均', 'tb', 'start');
  o += axes({ sx, sy, x0: 0, x1: 8, y0: 0, y1: 1, xt: [[0, '1'], [2, '4'], [4, '16'], [6, '64'], [8, '256']], yt: [0, [0.5, '0.5'], 1], grid: true, xl: 'k（对数刻度）' });
  o += path(curve((u) => mean(2 ** u), 0, 8, sx, sy), 'ln');
  o += line(sx(0), sy(mean(1)), sx(8), sy(mean(1)), 'dash') + text(sx(8), sy(mean(1)) + 14, 'pass@1 = ' + mean(1).toFixed(3), 'ts', 'end');
  o += `<circle cx="${f1(sx(0))}" cy="${f1(sy(mean(1)))}" r="5" class="ln-f">${anim('cx', U.map((u) => f1(sx(u))), KT, T)}${anim('cy', U.map((u) => f1(sy(mean(2 ** u)))), KT, T)}</circle>`;
  // 当前 k 的读数（离散）
  holds.forEach(([a, b, u]) => {
    const on = KT.map((x) => x >= a / T - 1e-9 && (u === 8 ? x < 1 - 1e-9 : x < b / T + step / T - 1e-9));
    const s = `k = ${2 ** u}：平均 pass@k = ${mean(2 ** u).toFixed(3)}`;
    o += gshow(text(460, 262, s, 't', 'middle'), on, KT, T);
  });
  return svgA(560, 270, o, '动图：10 道题的 pass@k 随 k 从 1 翻倍到 256，各题的 bar 向右涨，p 大的题很快到顶，p 等于 0 的一道始终为 0；右边平均 pass@k 的曲线上一个点跟着移动，从 0.319 涨到 0.872');
}

// ---------- 第 2 站：majority vote 与 pass@k ----------
const lgam = (() => { const t = [0]; for (let i = 1; i <= 200; i++) t.push(t[i - 1] + Math.log(i)); return t; })();
function majk(probs, k) {
  // 精确枚举 multinomial（2 或 3 类），平票时随机选；probs[0] 是正确答案
  let acc = 0;
  const m = probs.length;
  const rec = (i, left, cs) => {
    if (i === m - 1) {
      const c = [...cs, left];
      let lp = lgam[k];
      c.forEach((x, j) => { lp += x * Math.log(probs[j]) - lgam[x]; });
      const mx = Math.max(...c), ties = c.filter((x) => x === mx).length;
      if (c[0] === mx) acc += Math.exp(lp) / ties;
      return;
    }
    for (let x = 0; x <= left; x++) rec(i + 1, left - x, [...cs, x]);
  };
  rec(0, k, []);
  return acc;
}
function maj() {
  let o = '';
  const panel = (x0, title, probs, labels) => {
    o += text(x0 + 120, 18, title, 'tb', 'middle');
    // 上：answer distribution
    const bw = 44, base = 104, hmax = 70;
    probs.forEach((p, j) => {
      const x = x0 + 120 + (j - (probs.length - 1) / 2) * 66 - bw / 2;
      o += rect(x, base - hmax * p, bw, hmax * p, j === 0 ? 'solid' : 'wash2', 2);
      o += text(x + bw / 2, base - hmax * p - 6, p.toFixed(1), 'ts', 'middle');
      o += text(x + bw / 2, base + 16, labels[j], j === 0 ? 'tl' : 'ts', 'middle');
    });
    o += line(x0 + 30, base, x0 + 210, base, 'axis');
    // 下：pass@k 与 maj@k
    const sx = lin(1, 65, x0 + 30, x0 + 230), sy = lin(0, 1, 296, 146);
    o += axes({ sx, sy, x0: 1, x1: 65, y0: 0, y1: 1, xt: [1, 17, 33, 49, 65], yt: [0, [0.5, '0.5'], 1], grid: true, xl: 'k' });
    const ks = []; for (let k = 1; k <= 65; k += 2) ks.push(k);
    o += path(d(ks.map((k) => [sx(k), sy(1 - Math.pow(1 - probs[0], k))])), 'dash');
    o += path(d(ks.map((k) => [sx(k), sy(majk(probs, k))])), 'ln');
    return { sx, sy, ks };
  };
  const A = [0.6, 0.4], B = [0.3, 0.5, 0.2];
  const pa = panel(20, '第一道：对的答案是 mode', A, ['125（对）', '126']);
  const pb = panel(300, '第二道：错答案是 mode', B, ['对', '常见的错', '其他']);
  o += text(pa.sx(9), pa.sy(1) - 7, 'pass@k', 'ts', 'start');
  o += text(pa.sx(40), pa.sy(majk(A, 41)) + 18, 'maj@k', 'tl', 'middle');
  o += text(pb.sx(9), pb.sy(1) - 7, 'pass@k', 'ts', 'start');
  o += text(pb.sx(40), pb.sy(majk(B, 41)) - 10, 'maj@k', 'tl', 'middle');
  return svg(560, 326, o, '两道题：第一道正确答案 probability 0.6 是 mode，maj@k 随 k 涨向 1；第二道正确答案 0.3、错答案 0.5，maj@k 随 k 跌向 0，而 pass@k 都涨到 1');
}

// ---------- 第 3 站：best-of-N 与不完美的 verifier（动图） ----------
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const PC = 0.3, PH = 0.7 * 0.05, PW = 0.7 * 0.95, MU = { c: 2, w: 0, h: 3 };
const Phi = (x) => { // Abramowitz–Stegun 7.1.26 的 erf
  const z = Math.abs(x) / Math.SQRT2, t = 1 / (1 + 0.3275911 * z);
  const e = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z);
  return 0.5 * (1 + (x >= 0 ? e : -e));
};
const phi = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
const Fmix = (s) => PC * Phi(s - 2) + PW * Phi(s) + PH * Phi(s - 3);
function selProb(N, w, mu) {
  const lo = -8, hi = 14, n = 2200, h = (hi - lo) / n;
  let tot = 0;
  for (let i = 0; i <= n; i++) { const s = lo + i * h; tot += (i === 0 || i === n ? 0.5 : 1) * w * phi(s - mu) * Math.pow(Fmix(s), N - 1); }
  return N * tot * h;
}
function bonA() {
  // 一次具体的 sampling（seed 520）：64 个 sample
  const r = mulberry32(520);
  const gauss = () => { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const S = [];
  for (let i = 0; i < 64; i++) { const u = r(); const t = u < PC ? 'c' : u < PC + PH ? 'h' : 'w'; S.push({ t, s: MU[t] + gauss() }); }
  const NS = [64, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48];
  const durs = NS.map((N, i) => (i === 0 ? 3 : 0.9));
  const T = durs.reduce((a, b) => a + b, 0);
  const kt = []; let acc = 0; durs.forEach((x) => { kt.push(acc / T); acc += x; });
  const best = (N) => { let b = 0; for (let i = 1; i < N; i++) if (S[i].s > S[b].s) b = i; return b; };
  let o = '';
  // 上：verifier 分数的数轴
  const sx = lin(-3, 6.5, 40, 540), AY = 132;
  o += text(40, 18, '每个 sample 的 verifier 分数', 'tb', 'start');
  o += line(40, AY, 540, AY, 'axis');
  for (let v = -3; v <= 6; v++) o += line(sx(v), AY, sx(v), AY + 4, 'axis') + text(sx(v), AY + 17, (v < 0 ? '−' : '') + Math.abs(v), 'ts', 'middle');
  const rowY = (i) => 40 + (i % 7) * 12.5;
  S.forEach((x, i) => {
    const X = sx(x.s), Y = rowY(i);
    const mark = x.t === 'c' ? circle(X, Y, 4.5, 'ln-f') : x.t === 'h' ? rect(X - 4.5, Y - 4.5, 9, 9, 'paper') : circle(X, Y, 4, 'paper');
    o += gshow(mark, NS.map((N) => i < N), kt, T);
  });
  // 被选中的那个：画圈
  const bi = NS.map(best);
  o += `<circle cx="${f1(sx(S[bi[0]].s))}" cy="${f1(rowY(bi[0]))}" r="9.5" class="ink-b" fill="none">${anim('cx', bi.map((i) => f1(sx(S[i].s))), kt, T, true)}${anim('cy', bi.map((i) => f1(rowY(i))), kt, T, true)}</circle>`;
  // 图例
  o += circle(300, 14, 4.5, 'ln-f') + text(309, 18, '对', 'ts', 'start');
  o += circle(338, 14, 4, 'paper') + text(347, 18, '普通的错', 'ts', 'start');
  o += rect(403.5, 9.5, 9, 9, 'paper') + text(417, 18, '骗过 verifier 的错', 'ts', 'start');
  // 读数
  NS.forEach((N, j) => {
    const on = NS.map((_, q) => q === j);
    const t = S[bi[j]].t;
    const s = `N = ${N}：被选中的是${t === 'c' ? '对的' : t === 'h' ? '骗过 verifier 的错' : '普通的错'}`;
    o += gshow(text(290, 172, s, t === 'h' ? 'tl' : 't', 'middle'), on, kt, T);
  });
  // 下：expectation 曲线
  const px = logx(1, 1024, 70, 520), py = lin(0, 1, 330, 196);
  o += axes({ sx: px, sy: py, x0: 1, x1: 1024, y0: 0, y1: 1, xt: [1, 4, 16, 64, 256, 1024], yt: [0, [0.5, '0.5'], 1], grid: true, xl: 'N（对数刻度）' });
  const Ns = []; for (let e = 0; e <= 10; e += 0.25) Ns.push(2 ** e);
  const pc = Ns.map((N) => selProb(N, PC, 2)), ph = Ns.map((N) => selProb(N, PH, 3));
  o += path(d(Ns.map((N, i) => [px(N), py(pc[i])])), 'ln');
  o += path(d(Ns.map((N, i) => [px(N), py(ph[i])])), 'dash');
  o += text(px(1024) - 2, py(pc[pc.length - 1]) + 18, '选中对的', 'tl', 'end');
  o += text(px(1024) - 2, py(ph[ph.length - 1]) - 8, '选中骗过 verifier 的错', 'ts', 'end');
  const pk = (N) => selProb(N, PC, 2);
  o += `<circle cx="${f1(px(NS[0]))}" cy="${f1(py(pk(NS[0])))}" r="5" class="ln-f">${anim('cx', NS.map((N) => f1(px(N))), kt, T, true)}${anim('cy', NS.map((N) => f1(py(pk(N)))), kt, T, true)}</circle>`;
  const m12 = pk(12);
  o += text(px(12), py(m12) - 12, 'N = 12：' + m12.toFixed(3), 'ts', 'middle');
  return svgA(560, 366, o, '动图：64 个 sample 一个一个加入，按 verifier 分数排在数轴上；N 从 2 到 32 时分数最高的是一个对的 sample，N 到 48 和 64 时分数最高的变成一个骗过 verifier 的错 sample。下方的 expectation 曲线在 N 约 12 时最高 0.733，之后下降');
}

// ---------- 第 3 站：Math-Shepherd 的 Monte Carlo label ----------
function shepherd() {
  let o = '';
  const pick = ['97+96', '96−68', '97−96'].map((s) => L1.find((m) => m.step === s));
  const R = [280, 22];
  o += rect(R[0] - 70, R[1] - 15, 140, 26, 'paper', 6) + text(R[0], R[1] + 3, '96, 97, 68 → 125', 'tb', 'middle');
  pick.forEach((m, i) => {
    const cx = 95 + i * 185, Y = 84;
    o += line(R[0], R[1] + 11, cx, Y - 18, 'mute');
    o += rect(cx - 62, Y - 18, 124, 34, 'paper', 5) + text(cx, Y - 2, `prefix：${m.a}${m.op}${m.b} = ${m.v}`, 't', 'middle') + text(cx, Y + 12, `剩下 ${m.rest.join(' 和 ')}`, 'ts', 'middle');
    m.leaves.forEach((lf, k) => {
      const lx = cx + (k - 1) * 58, ly = 170;
      o += line(cx, Y + 16, lx, ly - 24, 'mute');
      if (lf.hit) o += rect(lx - 27, ly - 21, 54, 38, 'wash', 4);
      o += text(lx, ly - 6, `${lf.a}${lf.op}${lf.b}`, 'ts', 'middle');
      o += text(lx, ly + 10, `= ${lf.v}${lf.hit ? ' ✓' : ''}`, lf.hit ? 'tl' : 't', 'middle');
    });
    o += text(cx, 214, `soft label ${frac(m.value)}，hard label ${m.hits ? 1 : 0}`, 'tb', 'middle');
  });
  o += text(280, 244, 'Completion policy 在剩下两个数的 3 种合并里均匀地选，所以 soft label 就是打勾的比例。', 'ts', 'middle');
  return svg(560, 252, o, '三个 prefix 各自的三个 completion：97 加 96 等于 193 和 96 减 68 等于 28 各有一个 completion 等于 125，soft label 三分之一、hard label 1；97 减 96 等于 1 的三个 completion 都不等于 125，label 为 0');
}

// ---------- 第 4 站：beam search 在 Countdown 树上展开（动图） ----------
function beamA() {
  const B = 2;
  const order = L1.map((m, i) => i).sort((a, b) => L1[b].value - L1[a].value || a - b);
  const kept = new Set(order.slice(0, B));
  // 帧：0 结果（停顿）、1 只有 root、2 扩展 9 个、3 留下 2 个、4 扩展叶子
  const durs = [3.2, 1.2, 1.8, 1.8, 1.8];
  const T = durs.reduce((a, b) => a + b, 0);
  const kt = []; let acc = 0; durs.forEach((x) => { kt.push(acc / T); acc += x; });
  const F = (fs) => [0, 1, 2, 3, 4].map((f) => fs.includes(f));
  let o = '';
  const R = [280, 22];
  o += rect(R[0] - 70, R[1] - 15, 140, 26, 'paper', 6) + text(R[0], R[1] + 3, '96, 97, 68 → 125', 'tb', 'middle');
  const X = (i) => 33 + i * 61.75, Y = 82;
  L1.forEach((m, i) => {
    const x = X(i), k = kept.has(i);
    const node = (cls, tcls, lcls) => line(R[0], R[1] + 11, x, Y - 19, lcls) + rect(x - 29, Y - 19, 58, 38, cls, 5) + text(x, Y - 4, m.step, tcls, 'middle') + text(x, Y + 12, 'PRM ' + frac(m.value), m.value > 0 ? 'tl' : 'ts', 'middle');
    // 帧 2：全部正常
    o += gshow(node('paper', 't', 'mute'), F([2]), kt, T);
    if (k) o += gshow(node('wash', 'tb', 'ln') + rect(x - 29, Y - 19, 58, 38, 'ln', 5), F([0, 3, 4]), kt, T);
    else o += gshow(`<g opacity="0.35">${node('wash2', 'ts', 'grid')}</g>`, F([0, 3, 4]), kt, T);
    if (k) {
      let lv = line(x, Y + 19, x, Y + 27, 'ln');
      m.leaves.forEach((lf, q) => {
        const y = Y + 44 + q * 19;
        if (lf.hit) lv += rect(x - 28, y - 13, 56, 18, 'wash', 4);
        lv += text(x, y, `${lf.op} ${lf.v}${lf.hit ? ' ✓' : ''}`, lf.hit ? 'tl' : 'ts', 'middle');
      });
      o += gshow(lv, F([0, 4]), kt, T);
    }
  });
  const status = [
    '结果：找到 2 个解，共生成 9 + 6 = 15 步',
    '第 0 步：只有 root',
    '扩展：生成 9 个第一步，PRM 给每个打分',
    '保留分数最高的 B = 2 个（三个并列，按顺序取）',
    '扩展：6 个第二步，outcome verifier 检查是否等于 125',
  ];
  status.forEach((s, f) => { o += gshow(text(280, 200, s, f === 0 ? 'tl' : 't', 'middle'), F([f]), kt, T); });
  o += text(280, 220, '灰色：被砍掉的 prefix。每个 node 下的数是 PRM 分数（上一站的 soft label）。', 'ts', 'middle');
  return svgA(560, 228, o, '动图：beam search 在 Countdown 的 tree 上展开，先只有 root，再生成 9 个第一步并用 PRM 打分，保留分数最高的 2 个，其余变灰，最后把保留的两个各扩展 3 个第二步，其中 193 减 68 和 97 加 28 都等于 125');
}

// ---------- 第 5 站：masked_mean 与 masked_normalize 的 token weight ----------
function lennorm() {
  let o = '';
  const bw = 40, gap = 4, x0 = 150;
  const row = (y, n, wtxt, cls, total, pad) => {
    for (let j = 0; j < 7; j++) {
      const x = x0 + j * (bw + gap);
      if (j < n) o += rect(x, y - 13, bw, 22, cls, 3) + text(x + bw / 2, y + 3, wtxt, 'ts', 'middle');
      else if (pad) o += rect(x, y - 13, bw, 22, 'dash', 3);
    }
    o += text(x0 + 7 * (bw + gap) + 8, y + 3, '合计 ' + total, 't', 'start');
  };
  o += text(20, 22, 'masked_mean：每个回复在自己的 token 上平均', 'tb', 'start');
  o += text(20, 54, '回复 1（4 个 token）', 'ts', 'start'); row(50, 4, '1/4', 'wash-strong', '1', true);
  o += text(20, 84, '回复 2（7 个 token）', 'ts', 'start'); row(80, 7, '1/7', 'wash', '1', false);
  o += text(20, 126, 'masked_normalize：在自己的 token 上求和，除以常数 7', 'tb', 'start');
  o += text(20, 158, '回复 1（4 个 token）', 'ts', 'start'); row(154, 4, '1/7', 'wash', '4/7', true);
  o += text(20, 188, '回复 2（7 个 token）', 'ts', 'start'); row(184, 7, '1/7', 'wash', '1', false);
  o += text(280, 222, '格子里是每个 token 的 loss 进入总和时乘的 weight。每个 token 的值都是 2 时，', 'ts', 'middle');
  o += text(280, 239, '两种做法分别给出 [2, 2] 和 [8/7, 2] = [1.1429, 2]，就是 handout 打印的结果。', 'ts', 'middle');
  return svg(560, 246, o, '两个回复分别 4 个和 7 个 token。masked_mean 下短回复每个 token 的 weight 是四分之一，长回复是七分之一，两个回复各合计 1；masked_normalize 下每个 token 都是七分之一，短回复合计七分之四');
}

// ---------- 第 6 站：tokenize_prompt_and_output 的错位与 mask ----------
function sftmask() {
  let o = '';
  const toks = ['p₁', 'p₂', 'p₃', 'o₁', 'o₂', 'o₃', 'o₄'];
  const bw = 46, pitch = 54, x0 = 132;
  const X = (j) => x0 + j * pitch;
  const box = (j, y, s, cls, tcls = 't') => rect(X(j), y - 15, bw, 24, cls, 3) + text(X(j) + bw / 2, y + 2, s, tcls, 'middle');
  o += text(20, 34, '拼接后的序列', 'ts', 'start');
  toks.forEach((s, j) => { o += box(j, 30, s, j < 3 ? 'wash2' : 'paper'); });
  o += text(X(1) + bw / 2, 60, 'prompt', 'ts', 'middle') + text(X(4.5) + bw / 2, 60, 'output', 'ts', 'middle');
  o += text(20, 104, 'input_ids', 't', 'start') + text(20, 120, '去掉最后一个', 'ts', 'start');
  o += text(20, 168, 'labels', 't', 'start') + text(20, 184, '去掉第一个', 'ts', 'start');
  o += text(20, 222, 'response_mask', 't', 'start');
  for (let j = 0; j < 6; j++) {
    o += box(j, 106, toks[j], j < 3 ? 'wash2' : 'paper');
    o += arrow(X(j) + bw / 2, 114, X(j) + bw / 2, 148, 'mute', 5);
    const m = j >= 2;
    o += box(j, 170, toks[j + 1], m ? 'wash' : 'wash2', m ? 'tb' : 't');
    o += text(X(j) + bw / 2, 224, m ? '1' : '0', m ? 'tl' : 'ts', 'middle');
  }
  o += text(X(6) + 4, 134, '每个位置读 input、', 'ts', 'start') + text(X(6) + 4, 150, '预测 label', 'ts', 'start');
  o += text(290, 254, '第 3 个位置的 input 是 prompt 的最后一个 token，', 'ts', 'middle');
  o += text(290, 271, '它的 label 是 output 的第一个 token，mask 从这里开始为 1。', 'ts', 'middle');
  return svg(560, 278, o, 'prompt 三个 token、output 四个 token 拼成长 7 的序列；input_ids 是前 6 个，labels 是后 6 个，错开一位；response_mask 在 label 属于 output 的第 3 到第 6 个位置为 1');
}

// ---------- 第 7 站：95% 区间半宽随题数的变化 ----------
function ci() {
  let o = '';
  const sx = logx(10, 10000, 70, 530), sy = lin(0, 32, 230, 30);
  o += axes({ sx, sy, x0: 10, x1: 10000, y0: 0, y1: 32, xt: [[10, '10'], [100, '100'], [1000, '1,000'], [10000, '10,000']], yt: [0, 10, 20, 30], grid: true, xl: '题数 n（对数刻度）', yl: '95% 区间的半宽（百分点）' });
  const hw = (n) => 196 * Math.sqrt(0.25 / n);
  o += path(curve((u) => hw(10 ** u), 1, 4, (u) => sx(10 ** u), sy), 'ln');
  for (const [n, name, x, y, anc] of [[30, 'AIME（30 题）', sx(30) + 12, sy(hw(30)) - 2, 'start'], [500, 'MATH-500', sx(500) - 10, 224, 'end'], [1319, 'GSM8K（1,319 题）', 548, 190, 'end']]) {
    const v = hw(n);
    o += circle(sx(n), sy(v), 4.5, 'ink-f');
    o += text(x, y, `${name}：±${v.toFixed(1)}`, 't', anc);
  }
  o += text(300, 286, '真实 accuracy 取 50%（variance 最大的情形），半宽 = 1.96 × √(0.25 / n)。', 'ts', 'middle');
  return svg(560, 292, o, '95% 区间的半宽随题数增加而按一除以根号 n 下降：30 题时 17.9 个百分点，500 题时 4.4，1319 题时 2.7');
}

export default {
  'nyu-reasoners-tree': tree,
  'nyu-reasoners-depth': depth,
  'nyu-reasoners-passk': passkA,
  'nyu-reasoners-maj': maj,
  'nyu-reasoners-bon': bonA,
  'nyu-reasoners-shepherd': shepherd,
  'nyu-reasoners-beam': beamA,
  'nyu-reasoners-lennorm': lennorm,
  'nyu-reasoners-sftmask': sftmask,
  'nyu-reasoners-ci': ci,
};
