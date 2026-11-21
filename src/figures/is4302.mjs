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

// ---------- 第 1 站：GoofyCoin 的 double spend ----------
function goofy() {
  let o = '';
  const box = (x, y, w, title, lines, cls = 'paper') => {
    o += rect(x, y, w, 30 + lines.length * 17, cls, 6) + text(x + 10, y + 19, title, 'tb');
    lines.forEach((s, i) => { o += text(x + 10, y + 38 + i * 17, s, 'ts'); });
  };
  box(16, 86, 140, 'CreateCoin', ['coinID = 73', 'signed by Goofy']);
  box(196, 86, 150, 'Pay to pkAlice', ['pointer → CreateCoin', 'signed by Goofy']);
  box(390, 30, 154, 'Pay to pkBob', ['pointer → pkAlice 那条', 'signed by Alice'], 'wash');
  box(390, 150, 154, 'Pay to pkChuck', ['pointer → pkAlice 那条', 'signed by Alice'], 'wash');
  o += arrow(194, 116, 158, 116, 'ink') + arrow(388, 64, 348, 104, 'ln') + arrow(388, 178, 348, 128, 'ln');
  o += text(530, 112, 'Verify ✓', 'tl', 'end') + text(530, 232, 'Verify ✓', 'tl', 'end');
  o += text(16, 24, '箭头是 pointer：顺着它往回查，每一步的 signature 都对得上', 'ts');
  o += text(16, 252, '两条都是 Alice 亲手签的，各自都有效；矛盾只有看到全部记录才能发现', 't');
  return svg(560, 264, o, 'GoofyCoin 的 double spend：Alice 对同一个 coin 签了两条转账，一条给 Bob、一条给 Chuck，两条都指向她收到这个 coin 的那条记录，各自都能通过验证');
}

// ---------- 第 2 站：deficit 的 random walk（gambler's ruin） ----------
function ruin() {
  const q = 0.3, p = 0.7, N = 6;
  let o = '';
  const X = (z) => 50 + z * 88, Y = 100;
  for (let z = 0; z < N; z++) {
    o += circle(X(z), Y, 20, z === 0 ? 'solid' : 'paper') + text(X(z), Y + 5, String(z), z === 0 ? 'tw' : 'tb', 'middle');
    o += text(X(z), Y + 50, (q / p) ** z === 1 ? '1' : ((q / p) ** z).toFixed(4), z === 0 ? 'tl' : 't', 'middle');
    if (z > 0) {
      o += path(`M${X(z) - 16} ${Y - 12} Q${X(z) - 44} ${Y - 42} ${X(z - 1) + 16} ${Y - 12}`, 'ln');
      o += poly([[X(z - 1) + 16, Y - 12], [X(z - 1) + 18, Y - 22], [X(z - 1) + 25, Y - 15]], 'ln-f');
      o += text(X(z) - 44, Y - 34, 'q', 'tl', 'middle');
    }
    if (z < N - 1) {
      o += path(`M${X(z) + 16} ${Y + 12} Q${X(z) + 44} ${Y + 30} ${X(z + 1) - 16} ${Y + 12}`, 'mute');
      o += poly([[X(z + 1) - 16, Y + 12], [X(z + 1) - 18, Y + 22], [X(z + 1) - 25, Y + 15]], 'mute-f');
    }
  }
  o += text(X(N - 1) + 26, Y + 5, '…', 'tb');
  o += text(X(0) + 44, Y + 30, 'p', 'ts', 'middle');
  o += text(X(0) - 20, 40, 'deficit = 0：追平', 'tl');
  o += text(20, Y + 50, '', 'ts') + text(530, 40, 'q = 0.3，p = 0.7', 'tb', 'end');
  o += text(20, 182, '每出一个 block，attacker 落后的 block 数 z 以 probability q 减 1、以 p 加 1；', 't');
  o += text(20, 202, '圆圈下的数是从 z 出发最终追平的 probability a_z = (q/p)^z = (3/7)^z。', 't');
  return svg(560, 216, o, 'Attacker 落后 block 数的 random walk：每一步以 q 向 0 走一格、以 p 远离一格，从 z 出发到达 0 的 probability 是 q/p 的 z 次方');
}

// ---------- 第 3 站：Ethereum 的两层 ledger ----------
function ffg() {
  const slot = 12, perEpoch = 32;
  let o = '';
  const y = 110, bw = 22, gap = 8, n = 15;
  const X = (i) => 30 + i * (bw + gap);
  const cps = [0, 4, 8, 12];          // 画出的 checkpoint 位置（每个 epoch 的第一个 slot，图里每 4 个 block 代表一个 epoch）
  const fin = 8;                      // 到这里为止已 finalize
  o += rect(X(0) - 6, y - 26, X(fin) + bw + 6 - (X(0) - 6), 52, 'wash', 8);
  for (let i = 0; i < n; i++) {
    const cp = cps.includes(i);
    o += rect(X(i), y - 11, bw, 22, cp ? (i <= fin ? 'solid' : 'paper') : 'paper', 3);
    if (i > 0) o += line(X(i) - gap, y, X(i), y, 'ink');
  }
  // head 处的 fork
  o += line(X(n - 1) + bw, y, X(n - 1) + bw + gap, y, 'ink') + rect(X(n - 1) + bw + gap, y - 11, bw, 22, 'paper', 3);
  o += line(X(n - 2) + bw, y, X(n - 1) + 4, y + 34, 'mute') + rect(X(n - 1) + 4, y + 26, bw, 22, 'wash2', 3);
  for (const i of cps) o += text(X(i) + bw / 2, y - 34, 'checkpoint', 'ts', 'middle');
  o += text(X(0), 40, 'Finalized chain：checkpoint 得到 2/3 stake 的票（Casper FFG）', 'tl');
  o += text(X(0), 60, '永远是 available chain 的 prefix，不会被推翻', 'ts');
  o += text(X(n - 1) + bw + gap + bw, y + 5, '', 'ts');
  o += text(X(0), y + 66, 'Available chain：一直往前长，head 处的 fork 用 LMD GHOST 选', 'ts');
  o += text(30, 206, `1 slot = ${slot} s，1 epoch = ${perEpoch} slot = ${(slot * perEpoch / 60).toFixed(1)} 分钟（图里每个 epoch 只画 4 个 block）`, 't');
  o += text(30, 228, '小额收款看 available chain，不必等；大额收款等到 finalize。', 't');
  return svg(560, 240, o, 'Ethereum 的两层 ledger：底下的 available chain 一直增长，每个 epoch 开头的 checkpoint 经 2/3 投票后 finalize，finalized 部分是 available chain 的 prefix');
}

// ---------- 第 5 站：一笔 EIP-1559 fee 的去向 ----------
function fee() {
  const baseFee = 20, maxFee = 30, tip = 2, gasLimit = 30000, used = 21000;
  const gp = Math.min(maxFee, baseFee + tip);
  const pre = gasLimit * gp, burn = used * baseFee, prop = used * (gp - baseFee), refund = (gasLimit - used) * gp;
  const fmt = (v) => v.toLocaleString('en-US');
  const sx = lin(0, pre, 30, 530);
  let o = text(30, 30, `gasPrice = min(maxFee, baseFee + tip) = min(${maxFee}, ${baseFee} + ${tip}) = ${gp} gwei`, 't');
  o += rect(sx(0), 56, sx(pre) - sx(0), 30, 'wash2', 4) + text(sx(pre / 2), 76, `先扣 gasLimit × gasPrice = ${fmt(gasLimit)} × ${gp} = ${fmt(pre)} gwei`, 't', 'middle');
  const y = 120;
  o += rect(sx(0), y, sx(burn) - sx(0), 34, 'solid', 3) + rect(sx(burn), y, sx(burn + prop) - sx(burn), 34, 'wash-strong', 0) + rect(sx(burn + prop), y, sx(pre) - sx(burn + prop), 34, 'paper', 3);
  o += text(sx(burn / 2), y + 22, 'burn', 'tw', 'middle');
  o += text(sx(burn + prop + refund / 2), y + 22, 'refund', 't', 'middle');
  o += text(sx(0), y + 56, `burn = ${fmt(used)} × ${baseFee}`, 'ts') + text(sx(0), y + 72, `= ${fmt(burn)}`, 'tb');
  o += line(sx(burn + prop / 2), y + 36, sx(burn + prop / 2), y + 82, 'mute');
  o += text(sx(burn + prop / 2) + 4, y + 96, `proposer = ${fmt(used)} × ${gp - baseFee} = ${fmt(prop)}`, 'ts', 'middle');
  o += text(sx(pre), y + 56, `退回 ${fmt(gasLimit - used)} × ${gp}`, 'ts', 'end') + text(sx(pre), y + 72, `= ${fmt(refund)}`, 'tb', 'end');
  o += text(30, 246, `实付 ${fmt(pre)} − ${fmt(refund)} = ${fmt(burn + prop)} gwei = ${((burn + prop) / 1e9).toFixed(6)} ETH = burn + proposer`, 't');
  return svg(560, 258, o, '一笔 EIP-1559 transaction 的 fee：先按 gasLimit 乘 gasPrice 预扣，未用完的 gas 退回，实际用掉的部分按 baseFee 烧掉、其余给 proposer');
}

// ---------- 第 6 站：Bob 的 health 随 ETH price 变化 ----------
function health() {
  const eth = 2, debt = 4000, th = 0.83;
  const H = (P) => (eth * P * th) / debt, Pl = debt / (eth * th);
  const sx = lin(1500, 3600, 60, 400), sy = lin(0.5, 1.6, 220, 30);
  let o = rect(sx(1500), sy(1.6), sx(Pl) - sx(1500), sy(0.5) - sy(1.6), 'wash2');
  o += line(sx(1500), sy(1), sx(3600), sy(1), 'dash');
  for (const v of [2000, 2500, 3000, 3500]) o += line(sx(v), sy(0.5), sx(v), sy(0.5) + 4, 'axis') + text(sx(v), sy(0.5) + 17, String(v), 'ts', 'middle');
  for (const v of [0.6, 1, 1.4]) o += line(sx(1500) - 4, sy(v), sx(1500), sy(v), 'axis') + text(sx(1500) - 7, sy(v) + 4, String(v), 'ts', 'end');
  o += line(sx(1500), sy(0.5), sx(3600), sy(0.5), 'axis') + line(sx(1500), sy(0.5), sx(1500), sy(1.6), 'axis');
  o += text(sx(3600), sy(0.5) + 32, 'ETH price（USDC）', 'ts', 'end') + text(sx(1500) - 4, sy(1.6) - 8, 'health', 'ts');
  o += path(d([[sx(1500), sy(H(1500))], [sx(3600), sy(H(3600))]]), 'ln');
  o += circle(sx(3000), sy(H(3000)), 4.5, 'ln-f') + text(sx(3000) - 8, sy(H(3000)) - 8, `3000：${H(3000).toFixed(3)}`, 'tl', 'end');
  o += circle(sx(Pl), sy(1), 4.5, 'ink-f') + text(sx(Pl) + 8, sy(1) + 18, Pl.toFixed(2), 'tb');
  o += text(sx(1560), sy(1.5), '可以被 liquidate', 'ts');
  o += text(418, 50, 'Bob：2 ETH collateral', 't') + text(418, 68, 'debt 4000 USDC', 't') + text(418, 86, 'threshold 0.83', 't');
  o += text(418, 120, 'health = 2P × 0.83 / 4000', 'ts') + text(418, 136, '跌破 1 时可以被', 'ts') + text(418, 152, 'liquidate', 'ts');
  return svg(560, 262, o, 'Bob 的 health 随 ETH price 线性变化：price 3000 时是 1.245，跌到 2409.64 时等于 1，再低就可以被 liquidate');
}

// ---------- 第 6 站：flash loan 在一笔 transaction 里 ----------
function flash() {
  const L = 1e6, r1 = 1.002, r2 = 1.001;
  const dai = L * r1, back = dai / r2, prof = back - L;
  const fmt = (v) => Math.round(v).toLocaleString('en-US');
  const A = 56, B = 216, U = 352, C = 488;
  let o = rect(16, 34, 528, 262, 'wash', 8) + text(28, 54, '同一笔 transaction', 'tl');
  for (const [s2, x, sub] of [['Aave', A, ''], ['Borrower', B, '（一个 contract）'], ['Uniswap', U, `1 USDC = ${r1} DAI`], ['Curve', C, `1 USDC = ${r2} DAI`]]) {
    o += text(x, 80, s2, 'tb', 'middle') + text(x, 96, sub, 'ts', 'middle') + line(x, 104, x, 262, 'dash');
  }
  const msg = (y, x1, x2, s2, cls = 'ink', lx = (x1 + x2) / 2) => arrow(x1, y, x2, y, cls) + text(lx, y - 6, s2, 'ts', 'middle');
  o += msg(126, A, B, `borrow ${fmt(L)} USDC`);
  o += msg(152, B, U, `${fmt(L)} USDC`);
  o += msg(178, U, B, `${fmt(dai)} DAI`);
  o += msg(204, B, C, `${fmt(dai)} DAI`, 'ink', (U + C) / 2);
  o += msg(230, C, B, `${fmt(back)} USDC`, 'ink', (U + C) / 2);
  o += msg(256, B, A, `repay ${fmt(L)} USDC`, 'ln');
  o += text(B, 284, `Borrower 剩下 ${fmt(back)} − ${fmt(L)} = ${fmt(prof)} ≈ 1,000 USDC`, 'tl', 'middle');
  o += text(16, 318, '最后一步还不上，整笔 transaction revert，等于从没借过：lender 没有风险，也就不需要 collateral。', 'ts');
  return svg(560, 328, o, 'Flash loan 的顺序：在同一笔 transaction 里从 Aave 借一百万 USDC，在 Uniswap 换成 DAI，在 Curve 换回 USDC，再还给 Aave，剩下约一千 USDC');
}

// ---------- 第 7 站：custodial stablecoin 的 mint、transfer、burn ----------
function mintBurn() {
  const steps = [
    ['① mint', { Alice: 35, Bob: 100, Carol: 0 }],
    ['② transfer Bob → Carol 15', { Alice: 35, Bob: 85, Carol: 15 }],
    ['③ Bob redeem 60：burn', { Alice: 35, Bob: 25, Carol: 15 }],
  ];
  let o = line(16, 150, 544, 150, 'dash') + text(544, 144, 'on-chain', 'ts', 'end') + text(544, 166, 'off-chain（bank）', 'ts', 'end');
  steps.forEach(([title, bal], i) => {
    const x = 20 + i * 176, sup = Object.values(bal).reduce((a, b) => a + b, 0);
    o += text(x, 26, title, 'tb');
    o += rect(x, 38, 150, 96, 'paper', 6) + text(x + 10, 56, 'ERC-20 balances', 'ts');
    Object.entries(bal).forEach(([k, v], j) => { o += text(x + 10, 76 + j * 17, k, 't') + text(x + 140, 76 + j * 17, String(v), 't', 'end'); });
    o += line(x + 8, 128 - 1, x + 142, 128 - 1, 'grid');
    o += rect(x, 178, 150, 44, 'wash2', 6) + text(x + 10, 196, 'reserve（USD）', 'ts') + text(x + 140, 214, String(sup), 'tb', 'end');
    o += text(x + 10, 214, 'supply = ' + sup, 'ts');
  });
  o += text(20, 246, 'mint 和 burn 要 custodian 在 bank 和 chain 两边同时动；transfer 只在 chain 上完成。', 't');
  return svg(560, 258, o, 'Custodial stablecoin 的三步：custodian 收到 USD 后 mint，用户之间 on-chain transfer，redeem 时 custodian 付出 USD 并 burn；每一步 off-chain 的 reserve 都等于 on-chain 的 supply');
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
  'is4302-goofy': goofy,
  'is4302-ruin': ruin,
  'is4302-ffg': ffg,
  'is4302-fee': fee,
  'is4302-health': health,
  'is4302-flash': flash,
  'is4302-mint': mintBurn,
};
