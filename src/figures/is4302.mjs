import { createHash } from 'node:crypto';
import { svg, lin, logx, d, path, line, rect, circle, poly, text, arrow, curve, area } from '../lib/svg.mjs';

const sha = (b) => createHash('sha256').update(b).digest();
const hex8 = (b) => b.toString('hex').slice(0, 8);

// 用 hash pointer 串起来的三个 block：改动 block 2 的内容，block 3 里存的 prev 就对不上了
function chain() {
  const blocks = (data2) => {
    const b1 = 'prev=00000000;data=coinbase 50 to Goofy';
    const h1 = hex8(sha(b1));
    const b2 = `prev=${h1};data=${data2}`;
    const h2 = hex8(sha(b2));
    return { h1, h2 };
  };
  const orig = blocks('Alice pays Bob 5'), fake = blocks('Alice pays Bob 6');
  let o = '';
  const W = 150, Hh = 74, y0 = 40;
  const xs = [20, 205, 390];
  const box = (x, y, title, prev, data, cls) => {
    o += rect(x, y, W, Hh, cls, 6);
    o += text(x + 10, y + 20, title, 'tb');
    o += text(x + 10, y + 42, prev, 'ts');
    o += text(x + 10, y + 62, data, 't');
  };
  box(xs[0], y0, 'block 1', 'prev: 00000000', 'coinbase', 'paper');
  box(xs[1], y0, 'block 2', 'prev: ' + orig.h1, 'Alice→Bob 5', 'paper');
  box(xs[2], y0, 'block 3', 'prev: ' + orig.h2, '……', 'paper');
  o += arrow(xs[1], y0 + 37, xs[0] + W + 2, y0 + 37, 'ink') + arrow(xs[2], y0 + 37, xs[1] + W + 2, y0 + 37, 'ink');
  o += text(xs[0], 24, '原来：每个 block 存着前一个 block 的 hash（只显示前 8 个 hex 位）', 'ts');
  const y1 = 170;
  o += text(xs[0], y1 - 16, '有人把 block 2 的 5 改成 6：', 'ts');
  box(xs[0], y1, 'block 1', 'prev: 00000000', 'coinbase', 'paper');
  box(xs[1], y1, 'block 2', 'prev: ' + fake.h1, 'Alice→Bob 6', 'wash');
  o += rect(xs[1], y1, W, Hh, 'frame', 6);
  box(xs[2], y1, 'block 3', 'prev: ' + orig.h2, '……', 'paper');
  o += arrow(xs[1], y1 + 37, xs[0] + W + 2, y1 + 37, 'ink');
  o += line(xs[2], y1 + 37, xs[1] + W + 2, y1 + 37, 'dash');
  o += text(xs[1] + W / 2, y1 + Hh + 22, '现在 H(block 2) = ' + fake.h2, 'tl', 'middle');
  o += text(xs[2] + W / 2, y1 + Hh + 22, '但 block 3 记的是 ' + orig.h2, 'tb', 'middle');
  o += text(280, y1 + Hh + 50, '要掩盖这次改动，就得把 block 3 以及之后每个 block 的 prev 都改掉，一直改到最新的 head', 'ts', 'middle');
  return svg(560, 300, o, '三个用 hash pointer 串起来的 block；改动中间 block 的内容后，它的 hash 变了，和下一个 block 里记录的 prev 对不上');
}

// 4 笔 transaction 的 Merkle tree，证明 tx3 在里面
function merkle() {
  const L = ['tx1', 'tx2', 'tx3', 'tx4'].map((t) => sha(Buffer.from(t)));
  const h12 = sha(Buffer.concat([L[0], L[1]])), h34 = sha(Buffer.concat([L[2], L[3]]));
  const root = sha(Buffer.concat([h12, h34]));
  let o = '';
  const node = (cx, cy, label, val, kind) => {
    const w = 112, h = 40;
    const cls = kind === 'proof' ? 'wash-strong' : kind === 'path' ? 'wash' : 'paper-f';
    o += rect(cx - w / 2, cy - h / 2, w, h, cls, 6) + rect(cx - w / 2, cy - h / 2, w, h, kind === 'path' ? 'ln' : 'frame', 6);
    o += text(cx, cy - 3, label, 'tb', 'middle') + text(cx, cy + 13, hex8(val) + '…', 'ts', 'middle');
  };
  const X = [80, 213, 346, 479], yL = 200, yM = 128, yR = 56;
  const xM = [(X[0] + X[1]) / 2, (X[2] + X[3]) / 2], xR = (xM[0] + xM[1]) / 2;
  o += line(X[0], yL - 20, xM[0], yM + 20, 'mute') + line(X[1], yL - 20, xM[0], yM + 20, 'mute');
  o += line(X[2], yL - 20, xM[1], yM + 20, 'ln') + line(X[3], yL - 20, xM[1], yM + 20, 'mute');
  o += line(xM[0], yM - 20, xR, yR + 20, 'mute') + line(xM[1], yM - 20, xR, yR + 20, 'ln');
  node(xR, yR, 'root', root, 'path');
  node(xM[0], yM, 'h12', h12, 'proof');
  node(xM[1], yM, 'h34', h34, 'path');
  ['L1', 'L2', 'L3', 'L4'].forEach((s, i) => node(X[i], yL, s + ' = H(tx' + (i + 1) + ')', L[i], i === 3 ? 'proof' : i === 2 ? 'path' : ''));
  ['tx1', 'tx2', 'tx3', 'tx4'].forEach((s, i) => { o += line(X[i], yL + 20, X[i], yL + 34, 'mute') + text(X[i], yL + 50, s, i === 2 ? 'tl' : 't', 'middle'); });
  o += text(20, 22, '深色：proof 里给出的两个 hash。彩框：verifier 自己算出来的。', 'ts');
  o += text(280, 284, '验证 tx3：H(tx3) → 和 L4 拼起来再 hash 得 h34 → 和 h12 拼起来再 hash，应等于 root', 'ts', 'middle');
  return svg(560, 296, o, '四笔 transaction 的 Merkle tree。要证明 tx3 在里面，只需给出 L4 和 h12 两个 hash，verifier 沿着 path 算到 root 并比较');
}

// double spend 的赛跑：merchant 等 z 个 confirmation，attacker 在私下延长另一条 branch
function fork() {
  let o = '';
  const bw = 40, bh = 30, gap = 12;
  const blk = (x, y, s, cls = 'paper') => { o += rect(x, y, bw, bh, cls, 4) + text(x + bw / 2, y + 20, s, cls === 'solid' ? 'tw' : 't', 'middle'); };
  const y0 = 105;
  blk(20, y0, '…');
  blk(20 + bw + gap, y0, 'B');
  const fx = 20 + 2 * (bw + gap);
  const yh = 45, ya = 170;
  for (let i = 0; i < 6; i++) {
    const x = fx + i * (bw + gap);
    blk(x, yh, i === 0 ? 'tx1' : '', i === 0 ? 'wash' : 'paper');
    if (i) o += line(x, yh + bh / 2, x - gap, yh + bh / 2, 'ink');
  }
  for (let i = 0; i < 4; i++) {
    const x = fx + i * (bw + gap);
    blk(x, ya, i === 0 ? 'tx2' : '', i === 0 ? 'wash-strong' : 'wash2');
    if (i) o += line(x, ya + bh / 2, x - gap, ya + bh / 2, 'dash');
  }
  o += line(20 + bw, y0 + bh / 2, 20 + bw + gap, y0 + bh / 2, 'ink');
  const bx = 20 + bw + gap + bw;
  o += path(d([[bx, y0 + bh / 2], [fx - 6, yh + bh / 2], [fx, yh + bh / 2]]), 'ink');
  o += path(d([[bx, y0 + bh / 2], [fx - 6, ya + bh / 2], [fx, ya + bh / 2]]), 'dash');
  const ex = fx + 6 * (bw + gap) - gap;
  o += text(ex + 8, yh + 13, 'honest chain', 'tb') + text(ex + 8, yh + 29, '公开，z = 6', 'ts');
  const ax = fx + 4 * (bw + gap) - gap;
  o += text(ax + 8, ya + 13, 'attacker 的 branch', 'tb') + text(ax + 8, ya + 29, '私下 mine，还差 2 个', 'ts');
  o += text(fx, 30, 'tx1：Alice 把 coin 付给 merchant', 'ts') + text(fx, ya + bh + 22, 'tx2：同一个 coin 付回 Alice 自己的 address', 'ts');
  o += text(280, 248, '只要私下这条追上并超过公开那条，全网按 longest chain rule 切过去，tx1 作废', 'ts', 'middle');
  return svg(560, 260, o, 'Double spend attack：从同一个 block fork 出去，公开的 honest chain 含 tx1，attacker 私下 mine 的 branch 含冲突的 tx2，attacker 落后若干个 block');
}

// Nakamoto 论文第 11 节的 attacker success probability，对数坐标
function race() {
  const P = (q, z) => {
    const p = 1 - q, lam = (z * q) / p;
    let s = 1, po = Math.exp(-lam);
    for (let k = 0; k <= z; k++) { if (k) po *= lam / k; s -= po * (1 - (q / p) ** (z - k)); }
    return s;
  };
  const sx = lin(0, 12, 70, 400), sy = lin(-7, 0, 240, 30);
  let o = '';
  for (const e of [0, -2, -4, -6]) o += line(sx(0), sy(e), sx(12), sy(e), 'grid') + text(64, sy(e) + 4, e === 0 ? '1' : '10⁻' + '⁰¹²³⁴⁵⁶⁷⁸⁹'[-e], 'ts', 'end');
  for (let z = 0; z <= 12; z += 2) o += line(sx(z), sy(-7), sx(z), sy(-7) + 4, 'axis') + text(sx(z), sy(-7) + 18, String(z), 'ts', 'middle');
  o += line(sx(0), sy(-7), sx(12), sy(-7), 'axis') + line(sx(0), sy(-7), sx(0), sy(0), 'axis');
  o += line(sx(0), sy(-3), sx(12), sy(-3), 'ln-dash') + text(sx(12) + 6, sy(-3) + 4, '0.1%', 'tl');
  const series = [[0.1, 'ln'], [0.2, 'ink'], [0.3, 'dash']];
  for (const [q, cls] of series) {
    const pts = [];
    for (let z = 0; z <= 12; z++) pts.push([sx(z), sy(Math.max(Math.log10(P(q, z)), -7))]);
    o += path(d(pts), cls);
    for (let z = 0; z <= 12; z++) { const v = Math.log10(P(q, z)); if (v >= -7) o += circle(sx(z), sy(v), 2.4, cls === 'ln' ? 'ln-f' : 'ink-f'); }
  }
  o += text(sx(7.3), sy(-3.75), 'q = 0.1', 'tl');
  o += text(sx(12) + 6, sy(Math.log10(P(0.2, 12))) + 4, 'q = 0.2', 'tb');
  o += text(sx(12) + 6, sy(Math.log10(P(0.3, 12))) + 4, 'q = 0.3', 'tb');
  o += text(sx(12), 278, 'z：merchant 等的 confirmation 数', 'ts', 'end');
  o += text(70, 16, 'attacker 最终追上的 probability（log scale）', 'tb');
  o += text(sx(0.3), sy(-5.0), '每多等一个 block，', 'ts') + text(sx(0.3), sy(-5.0) + 16, 'probability 大约乘上', 'ts') + text(sx(0.3), sy(-5.0) + 32, '一个小于 1 的数', 'ts');
  return svg(560, 288, o, 'Attacker 追上 honest chain 的 probability 随 confirmation 数 z 指数下降；attacker 的 hash power 占比 q 越大，下降越慢');
}

// 9 个 validator，两个 6 人 quorum 至少重叠 3 人
function quorum() {
  let o = '';
  const cx = (i) => 60 + i * 55, cy = 120;
  o += rect(cx(0) - 24, 52, cx(5) - cx(0) + 48, 36, 'wash', 6) + text((cx(0) + cx(5)) / 2, 75, 'quorum A：6 票，finalize block X', 'tb', 'middle');
  o += rect(cx(3) - 24, 152, cx(8) - cx(3) + 48, 36, 'wash', 6) + text((cx(3) + cx(8)) / 2, 175, 'quorum B：6 票，finalize block Y', 'tb', 'middle');
  for (let i = 0; i < 9; i++) {
    const both = i >= 3 && i <= 5;
    o += circle(cx(i), cy, 16, both ? 'solid' : 'paper') + text(cx(i), cy + 5, String(i + 1), both ? 'tw' : 't', 'middle');
    if (i <= 5) o += line(cx(i), 88, cx(i), cy - 16, 'mute');
    if (i >= 3) o += line(cx(i), cy + 16, cx(i), 152, 'mute');
  }
  o += text(cx(4), 30, '实心的 4、5、6 同时给 X 和 Y 都签了：两个冲突的 block 都被 finalize', 'ts', 'middle');
  o += text(280, 220, '重叠至少 6 + 6 − 9 = 3 = n / 3 个 validator，signature 就是证据，可以 slash 他们的 stake', 'ts', 'middle');
  return svg(560, 232, o, '九个 validator 中两个各有六个成员的 quorum，至少有三个成员重叠；这些重叠的 validator 给两个冲突的 block 都签了名');
}

// UTXO：一笔 transaction 消费一个 output，产生两个新的 output
function utxo() {
  let o = '';
  const box = (x, y, w, h, title, lines, cls = 'paper') => {
    o += rect(x, y, w, h, cls, 6) + text(x + 10, y + 19, title, 'tb');
    lines.forEach((s, i) => { o += text(x + 10, y + 39 + i * 17, s, 'ts'); });
  };
  box(20, 70, 150, 92, 'Tx A（更早）', ['output 0：7 BTC', 'lock：H(pkAlice)', '（尚未花掉）']);
  box(215, 52, 150, 128, 'Tx B', ['input：Tx A 的 output 0', '  + Alice 的 sig, pk', 'output 0：5 BTC → Bob', 'output 1：1.9998 BTC', '  → Alice（change）', 'fee = 7 − 6.9998']);
  o += arrow(170, 116, 213, 116, 'ink');
  box(410, 40, 132, 58, 'UTXO', ['5 BTC，H(pkBob)'], 'wash');
  box(410, 130, 132, 58, 'UTXO', ['1.9998 BTC，H(pkAlice)'], 'wash');
  o += arrow(365, 92, 408, 72, 'ln') + arrow(365, 140, 408, 158, 'ln');
  o += text(20, 24, 'Ledger 里没有 “balance”，只有一笔笔还没被花掉的 output', 'ts');
  o += text(20, 214, 'Tx B 进入 block 后：Tx A 的 output 0 从 UTXO set 里删除，Tx B 的两个 output 加入。', 't');
  o += text(20, 236, '剩下的 0.0002 BTC 不属于任何 output，归打包这个 block 的 miner。', 't');
  return svg(560, 250, o, 'Transaction B 引用并消费 transaction A 的一个 7 BTC output，产生付给 Bob 的 5 BTC 和找零给 Alice 的 1.9998 BTC 两个新 output，差额是 fee');
}

// reentrancy：先转账后记账的 Bank 被同一个 transaction 反复调用
function reent() {
  let o = '';
  const xa = 120, xb = 400;
  o += rect(xa - 70, 20, 140, 30, 'paper', 6) + text(xa, 40, 'Attacker contract', 'tb', 'middle');
  o += rect(xb - 70, 20, 140, 30, 'paper', 6) + text(xb, 40, 'Bank contract', 'tb', 'middle');
  o += line(xa, 50, xa, 300, 'dash') + line(xb, 50, xb, 300, 'dash');
  let y = 72;
  const steps = 3;
  for (let i = 0; i < steps; i++) {
    o += arrow(xa, y, xb, y, 'ink') + text((xa + xb) / 2, y - 5, 'withdrawAll()', 'ts', 'middle');
    o += text(xb + 10, y + 4, 'balances[A] 还是 75', 'ts');
    y += 22;
    o += arrow(xb, y, xa, y, 'ln') + text((xa + xb) / 2, y - 5, 'call{value: 75}', 'ts', 'middle');
    o += text(xb + 10, y + 4, 'Bank 剩 ' + (375 - 75 * (i + 1)), 'tl');
    o += text(xa - 10, y + 4, 'receive() 再调', 'ts', 'end');
    y += 30;
  }
  o += text((xa + xb) / 2, y + 2, '……直到 Bank 被搬空', 'ts', 'middle');
  o += text((xa + xb) / 2, y + 26, '最后一层层返回，才执行到 balances[A] = 0', 'tb', 'middle');
  o += text(280, 318, '每一层都在“把 balance 改成 0”之前重新进入，所以每一层的检查都通过', 'ts', 'middle');
  return svg(560, 330, o, 'Reentrancy 攻击的时序：Bank 先转账、后把 balance 清零；attacker 在收到转账的 receive 函数里再次调用 withdraw，每次检查都看到 75 的 balance');
}

// constant product 曲线：tangent 是 marginal price，chord 是实际成交的 average price
function amm() {
  const k = 100 * 300000;
  const sx = lin(60, 170, 70, 520), sy = lin(120000, 520000, 250, 30);
  let o = '';
  for (const v of [200000, 300000, 400000, 500000]) o += line(sx(60), sy(v), sx(170), sy(v), 'grid') + text(64, sy(v) + 4, (v / 1000) + 'k', 'ts', 'end');
  for (const v of [60, 80, 100, 110, 130, 150, 170]) o += line(sx(v), sy(120000), sx(v), sy(120000) + 4, 'axis') + text(sx(v), sy(120000) + 18, String(v), 'ts', 'middle');
  o += line(sx(60), sy(120000), sx(170), sy(120000), 'axis') + line(sx(60), sy(120000), sx(60), sy(520000), 'axis');
  o += path(curve((x) => k / x, 60, 170, sx, sy), 'ink');
  const A = [100, 300000], B = [110, k / 110], C = [150, k / 150];
  o += line(sx(78), sy(300000 + 3000 * 22), sx(122), sy(300000 - 3000 * 22), 'dash');
  o += line(sx(A[0]), sy(A[1]), sx(C[0]), sy(C[1]), 'ink');
  o += line(sx(A[0]), sy(A[1]), sx(B[0]), sy(B[1]), 'ln');
  o += circle(sx(A[0]), sy(A[1]), 4.5, 'ink-f') + circle(sx(B[0]), sy(B[1]), 4.5, 'ln-f') + circle(sx(C[0]), sy(C[1]), 4.5, 'ink-f');
  o += text(sx(A[0]) + 6, sy(A[1]) - 12, 'A', 'tb') + text(sx(B[0]) + 4, sy(B[1]) + 20, 'B', 'tl') + text(sx(C[0]) + 6, sy(C[1]) - 10, 'C', 'tb');
  const lx = 300, ly = 48;
  o += line(lx, ly - 4, lx + 26, ly - 4, 'dash') + text(lx + 34, ly, 'A 点 tangent：slope −3000', 't');
  o += line(lx, ly + 18, lx + 26, ly + 18, 'ln') + text(lx + 34, ly + 22, 'A→B 卖 10 ETH：slope −2727', 't');
  o += line(lx, ly + 40, lx + 26, ly + 40, 'ink') + text(lx + 34, ly + 44, 'A→C 卖 50 ETH：slope −2000', 't');
  o += text(sx(64), sy(160000), 'curve：x · y = 3 × 10⁷', 'tb');
  o += text(sx(170), 284, 'x：pool 里的 ETH', 'ts', 'end') + text(70, 18, 'y：pool 里的 USDC', 'ts');
  return svg(560, 294, o, 'Constant product curve x 乘 y 等于三千万。A 点的 tangent slope 是 marginal price 3000；卖入 10 ETH 走到 B，chord slope 2727；卖入 50 ETH 走到 C，chord slope 2000');
}

// impermanent loss：LP 相对于拿着不动的价值比
function il() {
  const f = (r) => (2 * Math.sqrt(r)) / (1 + r) - 1;
  const sx = logx(0.25, 4, 70, 520), sy = lin(-0.22, 0.02, 240, 50);
  let o = '';
  for (const v of [0, -0.05, -0.1, -0.15, -0.2]) o += line(sx(0.25), sy(v), sx(4), sy(v), 'grid') + text(64, sy(v) + 4, v === 0 ? '0' : '−' + Math.round(-v * 100) + '%', 'ts', 'end');
  for (const r of [0.25, 0.5, 1, 2, 4]) o += line(sx(r), sy(-0.22), sx(r), sy(-0.22) + 4, 'axis') + text(sx(r), sy(-0.22) + 18, (r === 0.25 ? '¼' : r === 0.5 ? '½' : String(r)) + '×', 'ts', 'middle');
  o += line(sx(0.25), sy(-0.22), sx(4), sy(-0.22), 'axis');
  const pts = [];
  for (let i = 0; i <= 200; i++) { const r = 0.25 * 16 ** (i / 200); pts.push([sx(r), sy(f(r))]); }
  o += path(d(pts), 'ln');
  for (const r of [0.5, 2, 4]) o += circle(sx(r), sy(f(r)), 3.5, 'ink-f');
  o += text(sx(2) - 8, sy(f(2)) + 20, '−5.7%', 'tb', 'end') + text(sx(0.5) + 8, sy(f(0.5)) + 20, '−5.7%', 'tb');
  o += text(sx(4) - 10, sy(f(4)) - 8, '−20%', 'tb', 'end');
  o += text(sx(1), sy(0) - 10, 'price 不变时没有损失', 'ts', 'middle');
  o += text(sx(4), 276, 'ETH 的 price 变成原来的几倍（log scale）', 'ts', 'end');
  o += text(70, 18, 'LP 的 position 价值 ÷ 一直拿着同样的币的价值，减 1', 'tb');
  return svg(560, 286, o, 'Impermanent loss 曲线：price 变成原来的 r 倍时，LP 相对于持有不动损失 1 减 2 根号 r 除以 1 加 r；价格翻倍或减半都损失约 5.7%，变 4 倍损失 20%');
}

// custodial stablecoin 的 peg：primary market 和 secondary market 之间的 arbitrage
function peg() {
  let o = '';
  o += rect(20, 60, 150, 92, 'paper', 8) + text(95, 82, 'Issuer（Circle）', 'tb', 'middle') + text(95, 102, 'primary market', 'ts', 'middle') + text(95, 122, '1 USDC ⇄ 1 USD', 't', 'middle') + text(95, 140, '只在银行营业时间', 'ts', 'middle');
  o += rect(380, 60, 160, 92, 'paper', 8) + text(460, 82, 'DEX / CEX', 'tb', 'middle') + text(460, 102, 'secondary market', 'ts', 'middle') + text(460, 122, 'price 随 supply and demand', 'ts', 'middle') + text(460, 140, '7 × 24 小时', 'ts', 'middle');
  o += rect(195, 196, 170, 46, 'wash', 8) + text(280, 216, 'arbitrageur', 'tb', 'middle') + text(280, 233, '（有 redemption 资格）', 'ts', 'middle');
  o += arrow(380, 92, 173, 92, 'ln') + text(280, 84, 'price < 1：右边买入，左边 redeem', 'ts', 'middle');
  o += arrow(170, 124, 377, 124, 'ink') + text(280, 142, 'price > 1：左边 mint，右边卖出', 'ts', 'middle');
  o += line(95, 152, 230, 196, 'mute') + line(460, 152, 330, 196, 'mute');
  o += text(20, 30, '买低于 1 的 USDC 去 redeem，或 mint 后卖高于 1 的 USDC，都把 price 推回 1', 'ts');
  o += rect(20, 262, 520, 30, 'wash2', 6) + text(280, 282, '2023 年 3 月 11–12 日周末：左边关门，这条 arbitrage 断了', 'tb', 'middle');
  return svg(560, 302, o, 'Custodial stablecoin 的 peg 靠 arbitrage 维持：secondary market 的 price 低于一就买入并向 issuer redeem，高于一就 mint 并卖出；primary market 关闭时这条联系断开');
}

// 货币的层级：谁的 liability、记在谁的 ledger 上
function tiers() {
  let o = '';
  const b = (x, y, w, h, t1, t2, cls = 'paper') => { o += rect(x, y, w, h, cls, 8) + text(x + w / 2, y + 22, t1, 'tb', 'middle') + text(x + w / 2, y + 40, t2, 'ts', 'middle'); };
  b(150, 20, 260, 52, 'Central bank 的 ledger', 'reserves、cash；retail CBDC 也记在这一层', 'wash');
  b(30, 120, 220, 52, 'Commercial bank A 的 ledger', '客户的 deposit 是 bank 的 liability');
  b(310, 120, 220, 52, 'Stablecoin issuer', 'token 是 issuer 的 liability');
  b(30, 222, 220, 46, 'Alice 的 deposit', '');
  b(310, 222, 220, 46, 'On-chain 的 USDC balance', '');
  o += arrow(140, 120, 230, 74, 'ink') + text(130, 100, 'reserves', 'ts', 'end');
  o += arrow(140, 222, 140, 174, 'ink');
  o += arrow(420, 222, 420, 174, 'ink');
  o += arrow(310, 146, 252, 146, 'ln') + text(281, 138, 'reserve', 'tl', 'middle') + text(281, 166, '存在 bank', 'ts', 'middle');
  o += text(280, 292, '箭头指向“对谁有 claim”。Stablecoin 的 1:1 最终落在 commercial bank 和 central bank 身上', 'ts', 'middle');
  return svg(560, 302, o, 'Money 的层级：central bank 的 ledger 在最上层，commercial bank 的 deposit 是下一层，stablecoin issuer 把 reserve 存在 commercial bank，on-chain 的 token 是对 issuer 的 claim');
}

export default {
  'is4302-chain': chain,
  'is4302-merkle': merkle,
  'is4302-fork': fork,
  'is4302-race': race,
  'is4302-quorum': quorum,
  'is4302-utxo': utxo,
  'is4302-reent': reent,
  'is4302-amm': amm,
  'is4302-il': il,
  'is4302-peg': peg,
  'is4302-tiers': tiers,
};
