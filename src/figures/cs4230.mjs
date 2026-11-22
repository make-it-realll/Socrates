import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1, sub } from '../lib/svg.mjs';

const bits = (v, n) => v.toString(2).padStart(n, '0');
const mod = (a, m) => ((a % m) + m) % m;
const pw = (b, e, m) => { let r = 1; b = mod(b, m); for (let i = 0; i < e; i++) r = (r * b) % m; return r; };

// 一行 bit 格子
function bitrow(x, y, s, cw, cls = 'paper', hi = null) {
  let o = '';
  [...s].forEach((ch, i) => {
    const xx = x + i * cw + (i >= 8 ? 8 : 0);
    o += rect(xx, y, cw, 22, hi && hi[i] ? 'wash ink-s' : cls) + text(xx + cw / 2, y + 16, ch, 't', 'middle');
  });
  return o;
}

// ---------- 全课地图：primitive 之间的关系 ----------
function map() {
  let o = '';
  const box = (x, y, w, s, sub, cls = 'paper') => rect(x, y, w, 40, cls, 6) + text(x + w / 2, y + (sub ? 17 : 25), s, 'tb', 'middle') + (sub ? text(x + w / 2, y + 33, sub, 'ts', 'middle') : '');
  o += text(20, 18, 'Secret key：Alice 和 Bob 事先共享一个 key', 'tb');
  o += box(20, 34, 90, 'OWF', '第 4 站') + box(160, 34, 90, 'PRG', '第 2 站') + box(300, 34, 90, 'PRF', '第 3 站');
  o += box(440, 34, 100, 'CPA encryption', '第 3 站');
  o += arrow(112, 48, 158, 48, 'ink') + arrow(158, 62, 112, 62, 'mute');
  o += arrow(252, 48, 298, 48, 'ink') + arrow(298, 62, 252, 62, 'mute');
  o += arrow(392, 54, 438, 54, 'ink');
  o += text(135, 92, 'Goldreich–Levin', 'ts', 'middle') + text(275, 92, 'GGM', 'ts', 'middle');
  o += box(300, 104, 90, 'MAC', '第 7 站') + arrow(345, 76, 345, 102, 'ink');
  o += box(440, 104, 100, 'CCA encryption', '第 7 站') + arrow(392, 124, 438, 124, 'ink') + arrow(490, 76, 490, 102, 'ink');
  o += line(20, 160, 540, 160, 'grid');
  o += text(20, 184, 'Public key：事先什么都不共享，要更具体的 hardness assumption', 'tb');
  o += box(20, 200, 120, 'DL / DDH', '第 5 站') + box(20, 256, 120, 'Factoring', '第 6 站') + box(20, 312, 120, 'LWE', '第 11 站');
  o += box(220, 200, 110, 'Key exchange', '第 5 站') + box(220, 256, 110, 'TDP', '第 6 站');
  o += box(410, 228, 130, 'PKE', '第 5、6、11 站');
  o += box(410, 290, 130, 'Signature', '第 8 站');
  o += arrow(142, 220, 218, 220, 'ink') + arrow(142, 276, 218, 276, 'ink');
  o += arrow(332, 222, 408, 244, 'ink') + arrow(332, 274, 408, 254, 'ink');
  o += line(142, 344, 553, 344, 'ink') + line(553, 344, 553, 248, 'ink') + arrow(553, 248, 542, 248, 'ink');
  o += arrow(332, 284, 408, 304, 'ink');
  o += line(20, 368, 540, 368, 'grid');
  o += text(20, 392, '在不公开的数据上计算', 'tb');
  o += box(20, 408, 150, 'Secret sharing', '第 9 站') + box(205, 408, 150, 'OT、garbled circuit', '第 9 站') + box(390, 408, 150, 'Zero knowledge', '第 10 站');
  o += text(280, 474, '黑箭头：可以由左边构造出右边；灰箭头：反方向也成立（左上四种 secret-key primitive 互相等价）', 'ts', 'middle');
  return svg(560, 484, o, '全课地图：OWF、PRG、PRF 互相可以构造，由它们得到 CPA encryption、MAC、CCA encryption；public key 一侧由 DL、factoring、LWE 三类 assumption 出发，得到 key exchange、trapdoor permutation、PKE 和 signature；最后一行是 secret sharing、OT 与 garbled circuit、zero knowledge');
}

// ---------- 第 1 站：one-time pad，n = 2 ----------
function otp() {
  let o = '';
  const panel = (x0, M) => {
    o += text(x0 + 95, 18, 'M = ' + bits(M, 2), 'tb', 'middle');
    o += text(x0 + 20, 42, 'key K', 'ts', 'middle') + text(x0 + 170, 42, 'C = M ⊕ K', 'ts', 'middle');
    for (let k = 0; k < 4; k++) {
      const y = 54 + k * 36, c = M ^ k, yc = 54 + c * 36;
      o += rect(x0, y, 40, 26, 'paper', 5) + text(x0 + 20, y + 18, bits(k, 2), 't', 'middle');
      o += arrow(x0 + 42, y + 13, x0 + 148, yc + 13, k === 0 ? 'ln' : 'ink');
      o += text(x0 + 60, y + 10, '¼', 'ts', 'middle');
    }
    for (let c = 0; c < 4; c++) { const y = 54 + c * 36; o += rect(x0 + 150, y, 40, 26, 'wash ink-s', 5) + text(x0 + 170, y + 18, bits(c, 2), 't', 'middle'); }
  };
  panel(40, 0b01);
  panel(320, 0b10);
  o += text(280, 214, '两边都是 4 条线一一对到 4 个 ciphertext：每个 C 的 probability 都是 ¼，看 C 猜不出 M', 'ts', 'middle');
  return svg(560, 224, o, '两个 plaintext 01 和 10 在 4 个 key 下的 ciphertext：都恰好把 4 个 ciphertext 各取一次，distribution 完全相同');
}

// ---------- 第 1 站：two-time pad ----------
function twotime() {
  const K = [0xa3, 0x5c];
  const by = (s) => [...s].map((c) => c.charCodeAt(0));
  const M1 = by('OK'), M2 = by('NO');
  const C1 = M1.map((v, i) => v ^ K[i]), C2 = M2.map((v, i) => v ^ K[i]), X = C1.map((v, i) => v ^ C2[i]);
  const str = (a) => a.map((v) => bits(v, 8)).join('');
  const rows = [['M₁ = “OK”', str(M1), 'paper'], ['M₂ = “NO”', str(M2), 'paper'], ['K（同一个）', str(K), 'wash2'], ['C₁ = M₁ ⊕ K', str(C1), 'paper'], ['C₂ = M₂ ⊕ K', str(C2), 'paper'], ['C₁ ⊕ C₂', str(X), 'paper']];
  let o = '';
  const x0 = 150, cw = 23;
  o += text(x0 + 4 * cw, 14, '第 1 个 byte', 'ts', 'middle') + text(x0 + 12 * cw + 8, 14, '第 2 个 byte', 'ts', 'middle');
  rows.forEach(([lab, s, cls], r) => {
    const y = 24 + r * 32 + (r >= 3 ? 8 : 0) + (r === 5 ? 8 : 0);
    o += text(x0 - 12, y + 16, lab, r === 5 ? 'tb' : 't', 'end');
    o += bitrow(x0, y, s, cw, cls, r === 5 ? [...s].map((c) => c === '1') : null);
  });
  o += line(x0, 194, x0 + 16 * cw + 8, 194, 'ink');
  o += text(280, 254, 'K 在两次 XOR 里抵消：C₁ ⊕ C₂ = M₁ ⊕ M₂。Eve 只要猜中一句，另一句就出来了', 'ts', 'middle');
  return svg(560, 264, o, '同一个 key encrypt OK 和 NO：两个 ciphertext 相 XOR 后 key 消失，得到两个 plaintext 的 XOR');
}

// ---------- 第 1 站：Shannon，key 比 message 少 ----------
function shannon() {
  let o = '';
  const xm = 110, xc = 400, Y = (i) => 50 + i * 46;
  o += text(xm, 22, 'message m', 'tb', 'middle') + text(xc, 22, 'ciphertext c', 'tb', 'middle');
  for (let m = 0; m < 4; m++) for (let k = 0; k < 3; k++) {
    const c = (m + k) % 4;
    if (c !== 0) o += line(xm + 22, Y(m), xc - 22, Y(c), 'grid');
  }
  for (let m = 0; m < 4; m++) for (let k = 0; k < 3; k++) {
    const c = (m + k) % 4;
    if (c === 0) { o += arrow(xm + 22, Y(m), xc - 24, Y(0), 'ln'); }
  }
  o += text(250, Y(0) - 8, 'k = 0', 'ts', 'middle') + text(200, 108, 'k = 2', 'tl', 'middle') + text(186, 180, 'k = 1', 'tl', 'middle');
  for (let i = 0; i < 4; i++) {
    o += circle(xm, Y(i), 18, i === 1 ? 'paper' : 'paper') + text(xm, Y(i) + 5, String(i), 'tb', 'middle');
    o += circle(xc, Y(i), 18, i === 0 ? 'wash ink-s' : 'paper') + text(xc, Y(i) + 5, String(i), 'tb', 'middle');
  }
  o += text(xm - 28, Y(1) + 5, '到不了 c = 0', 'tl', 'end');
  o += text(280, 248, 'Enc(k, m) = m + k mod 4，key 只有 0、1、2 三个：落到 c = 0 的线只有 3 条，必有一个 m 连不上', 'ts', 'middle');
  return svg(560, 258, o, '4 个 message、3 个 key 的 shift cipher：ciphertext 0 只能来自 message 0、2、3，message 1 永远 encrypt 不成 0');
}

// ---------- 第 2 站：indistinguishability game ----------
function game() {
  let o = '';
  const L = 120, R = 440;
  o += rect(L - 70, 14, 140, 36, 'paper', 6) + text(L, 37, 'Challenger', 'tb', 'middle');
  o += rect(R - 70, 14, 140, 36, 'wash ink-s', 6) + text(R, 37, 'Adversary A', 'tb', 'middle');
  o += line(L, 50, L, 262, 'grid') + line(R, 50, R, 262, 'grid');
  o += arrow(R, 80, L, 80, 'ink') + text(280, 72, 'm₀, m₁（A 自己挑的两个 message）', 't', 'middle');
  o += text(L - 12, 116, 'b ← {0, 1}', 't', 'end') + text(L - 12, 136, 'k ← KeyGen', 't', 'end');
  o += arrow(L, 162, R, 162, 'ln') + text(280, 154, 'c = Enc(k, m_b)', 'tl', 'middle');
  o += text(R + 12, 196, '想办法', 't', 'start') + text(R + 12, 214, '猜 b', 't', 'start');
  o += arrow(R, 238, L, 238, 'ink') + text(280, 230, 'b′', 't', 'middle');
  o += text(280, 288, 'A 赢 ⇔ b′ = b。Secure：任何 efficient 的 A，Pr[A 赢] ≤ ½ + negl(λ)', 'ts', 'middle');
  return svg(560, 298, o, 'Indistinguishability game：adversary 挑两个 message，challenger 秘密地选一个 encrypt 后发回，adversary 猜是哪一个');
}

// ---------- 第 2 站：reduction 的结构 ----------
function reduction() {
  let o = '';
  o += rect(110, 30, 340, 150, 'wash2', 10) + text(124, 52, 'D′：用 D 当零件造出来的 PRG distinguisher', 'tb');
  o += text(30, 112, 'y', 'tb', 'middle') + arrow(42, 108, 156, 108, 'ink');
  o += rect(158, 86, 96, 44, 'paper', 6) + text(206, 113, 'c = y ⊕ m₀', 't', 'middle');
  o += arrow(256, 108, 302, 108, 'ink');
  o += rect(304, 80, 120, 56, 'wash ink-s', 6) + text(364, 104, 'D', 'tb', 'middle') + text(364, 122, '（假设存在）', 'ts', 'middle');
  o += arrow(426, 108, 520, 108, 'ink') + text(530, 112, '0/1', 't', 'start');
  o += text(30, 216, 'y = G(s)：', 'tb') + text(118, 216, 'c 是 PRG encryption 下 m₀ 的真 ciphertext，D 输出 1 的 probability = W₀', 't');
  o += text(30, 242, 'y 真 random：', 'tb') + text(130, 242, 'c 是 one-time pad 的 ciphertext，D 输出 1 的 probability = W*', 't');
  o += text(280, 276, 'D′ 区分 G(s) 和 random 的 advantage 恰好是 |W₀ − W*|', 'ts', 'middle');
  return svg(560, 286, o, 'Reduction：D′ 收到一个 string y，把它和 m0 做 XOR 交给 D；y 来自 PRG 还是真 random，决定了 D 看到的是哪一个世界');
}

// ---------- 第 2 站：hybrid argument（动图） ----------
function hybridA() {
  const L = 4, hold = 1.9, T = hold * (L + 1);
  const kt = [], fr = [];
  for (let i = 0; i <= L; i++) { kt.push((i * hold) / T); fr.push(i); }
  kt.push(1); fr.push(L);
  const sx = (j) => 62 + j * 112, ys = 92, yb = 168;
  let o = '';
  o += text(280, 20, '把 G′ 的 4 个输出 bit 从左到右一个一个换成真 random', 'tb', 'middle');
  const show = (pred) => ashow(fr.map(pred), kt, T);
  const g = (pred, body) => `<g opacity="${pred(0) ? 1 : 0}">${body}${show(pred)}</g>`;
  for (let j = 0; j <= L; j++) {
    // seed j：j < i 时不存在；j = i 时是 fresh random；j > i 时由 G 算出
    o += g((i) => j > i, circle(sx(j), ys, 19, 'paper') + text(sx(j), ys + 5, 's' + j, 't', 'middle'));
    o += g((i) => j === i, circle(sx(j), ys, 19, 'solid') + text(sx(j), ys + 5, 's' + j, 'tw', 'middle') + text(sx(j), ys - 28, 'fresh random', 'tl', 'middle'));
    if (j >= 1) {
      const x0 = sx(j - 1) + 21, x1 = sx(j) - 21, xm = (x0 + x1) / 2;
      o += g((i) => j > i, arrow(x0, ys, x1, ys, 'ink') + text(xm, ys - 8, 'G', 'ts', 'middle') + line(xm, ys, xm, yb - 2, 'mute'));
      o += g((i) => j > i, rect(xm - 26, yb, 52, 30, 'wash ink-s', 5) + text(xm, yb + 20, 'b' + j, 't', 'middle'));
      o += g((i) => j <= i, rect(xm - 26, yb, 52, 30, 'solid', 5) + text(xm, yb + 20, 'R', 'tw', 'middle'));
      o += g((i) => j === i, text(xm, yb + 50, '刚换掉的一格', 'tl', 'middle'));
    }
  }
  const lab = ['H₀：G′(s) 的真实输出', 'H₁：b₁ 换成真 random，其余照常由 G 生成', 'H₂：前 2 个 bit 是真 random', 'H₃：前 3 个 bit 是真 random', 'H₄：4 个 bit 全是真 random，就是 U₄'];
  lab.forEach((s, i) => { o += `<text x="280" y="254" class="tb" text-anchor="middle" opacity="${i === 0 ? 1 : 0}">${s}${show((f) => f === i)}</text>`; });
  o += text(280, 280, '相邻两帧只差一处：那一格的 (s, b) 是 G 的输出还是真 random，这正是 G 本身的 security', 'ts', 'middle');
  return svgA(560, 290, o, '动图：hybrid H0 到 H4，每一帧把下一个输出 bit 换成真 random，并从那里用一个 fresh random seed 继续迭代 G');
}

// ---------- 第 3 站：GGM tree（动图） ----------
function ggmA() {
  const X = [140, 420], Y = [36, 96, 156, 216];
  const pos = (lv, idx) => [lv === 0 ? 280 : 280 + (idx + 0.5) * (560 / 2 ** lv) - 280 + 0 * idx, Y[lv]];
  const P = (lv, idx) => { const w = 520 / 2 ** lv; return [20 + w * (idx + 0.5), Y[lv]]; };
  const path3 = [0, 1, 2, 5]; // x = 101：右、左、右
  const hold = 1.7, T = hold * 4;
  const kt = [0, 0.25, 0.5, 0.75, 1], fr = [0, 1, 2, 3, 3];
  let o = '';
  for (let lv = 0; lv < 3; lv++) for (let i = 0; i < 2 ** lv; i++) for (const b of [0, 1]) {
    const [x0, y0] = P(lv, i), [x1, y1] = P(lv + 1, 2 * i + b);
    o += line(x0, y0 + 10, x1, y1 - 10, 'grid');
    if (lv < 2) o += text((x0 + x1) / 2 + (b ? 8 : -8), (y0 + y1) / 2 + 2, String(b), 'ts', 'middle');
  }
  for (let lv = 0; lv <= 3; lv++) for (let i = 0; i < 2 ** lv; i++) { const [x, y] = P(lv, i); o += circle(x, y, 10, 'paper'); }
  for (let i = 0; i < 8; i++) { const [x, y] = P(3, i); o += text(x, y + 28, bits(i, 3), 'ts', 'middle'); }
  o += text(P(0, 0)[0], P(0, 0)[1] + 5, 'k', 'tb', 'middle');
  const idxs = [0, 1, 2, 5];
  for (let s = 1; s <= 3; s++) {
    const [x0, y0] = P(s - 1, idxs[s - 1]), [x1, y1] = P(s, idxs[s]);
    o += `<g opacity="0">${line(x0, y0 + 10, x1, y1 - 10, 'ln')}${circle(x1, y1, 10, 'solid')}${ashow(fr.map((f) => f >= s), kt, T)}</g>`;
  }
  o += `<g>${circle(P(0, 0)[0], P(0, 0)[1], 10, 'solid')}${text(P(0, 0)[0], P(0, 0)[1] + 5, 'k', 'tw', 'middle')}</g>`;
  const lab = ['输入 x = 1 0 1，从 root 的 key k 出发', '第 1 个 bit 是 1：取 G(k) 的右半，G₁(k)', '第 2 个 bit 是 0：取左半，G₀(G₁(k))', '第 3 个 bit 是 1：F_k(101) = G₁(G₀(G₁(k)))'];
  lab.forEach((s, i) => { o += `<text x="280" y="276" class="tb" text-anchor="middle" opacity="${i === 0 ? 1 : 0}">${s}${ashow(fr.map((f) => f === i), kt, T)}</text>`; });
  o += text(280, 298, '每往下一层调用一次 length-doubling 的 G；整棵树有 2ⁿ 个 leaf，但算一个 leaf 只走一条 path', 'ts', 'middle');
  return svgA(560, 306, o, '动图：GGM tree 深度为 3，计算输入 101 的 PRF 值时，从 root 出发依次走右、左、右三条边，每一步调用一次 length-doubling PRG 取它的一半');
}

// ---------- 第 4 站：Goldreich–Levin 的一步 ----------
function gl() {
  let o = '';
  const x0 = 120, cw = 30;
  const rows = [['x', '1011', 'paper'], ['r', '0110', 'paper'], ['r ⊕ e₂', '0010', 'paper']];
  o += text(x0 - 10, 16, '位置', 'ts', 'end');
  for (let i = 0; i < 4; i++) o += text(x0 + i * cw + cw / 2, 16, String(i + 1), 'ts', 'middle');
  rows.forEach(([lab, s, cls], r) => {
    const y = 26 + r * 34;
    o += text(x0 - 10, y + 16, lab, 'tb', 'end');
    [...s].forEach((ch, i) => { o += rect(x0 + i * cw, y, cw, 24, r === 2 && i === 1 ? 'wash ink-s' : cls) + text(x0 + i * cw + cw / 2, y + 17, ch, 't', 'middle'); });
  });
  o += text(250, 60, '⟨x, r⟩ = 0 + 0 + 1 + 0 = 1', 't') + text(250, 94, '⟨x, r ⊕ e₂⟩ = 0 + 0 + 1 + 0 = 1', 't');
  o += text(250, 124, '两个答案 XOR：1 ⊕ 1 = 0 = x₂', 'tl');
  // union bound 条
  const bx = 40, bw = 480, by = 170;
  const a = 0.25 - 0.05;
  o += text(bx, by - 10, '设 A 在 r 上答错的 probability ≤ ¼ − ε（图里 ε = 0.05）：', 't');
  o += rect(bx, by, bw * a, 26, 'solid2') + rect(bx + bw * a, by, bw * a, 26, 'solid2') + rect(bx + 2 * bw * a, by, bw * (1 - 2 * a), 26, 'wash ink-s');
  o += line(bx + bw * a, by, bx + bw * a, by + 26, 'paper');
  o += text(bx + bw * a / 2, by + 18, 'r 上错', 'tw', 'middle') + text(bx + 1.5 * bw * a, by + 18, 'r ⊕ e₂ 上错', 'tw', 'middle');
  o += text(bx + 2 * bw * a + bw * (1 - 2 * a) / 2, by + 18, '两次都对：≥ ½ + 2ε = 0.6', 'tb', 'middle');
  o += text(280, by + 50, 'r 和 r ⊕ e₂ 各自都是 uniform 的，所以两种“错”最坏也只是不重叠地加起来（union bound）', 'ts', 'middle');
  return svg(560, 232, o, '用 r 和 r 异或 e2 两次询问 predictor，两次的答案相异或得到 x 的第 2 位；下方的条显示两次都答对的 probability 至少是二分之一加二倍 epsilon');
}

// ---------- 第 4 站：多数表决，独立 vs pairwise independent ----------
function vote() {
  const p = 0.6, dlt = p - 0.5;
  const lg = (n) => { let r = 0; for (let i = 2; i <= n; i++) r += Math.log(i); return r; };
  const binomTail = (k) => { // majority 错：正确票数 ≤ (k-1)/2
    let s = 0; const lp = Math.log(p), lq = Math.log(1 - p), L = lg(k);
    for (let j = 0; j <= (k - 1) / 2; j++) s += Math.exp(L - lg(j) - lg(k - j) + j * lp + (k - j) * lq);
    return s;
  };
  const sx = lin(0, 400, 70, 520), ly = lin(Math.log10(1e-6), Math.log10(0.5), 220, 30), sy = (v) => ly(Math.log10(Math.max(v, 1e-6)));
  let o = '';
  for (const v of [1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 1e-1]) o += line(sx(0), sy(v), sx(400), sy(v), 'grid') + text(sx(0) - 7, sy(v) + 4, v >= 0.01 ? String(v) : '10⁻' + '⁰¹²³⁴⁵⁶'[-Math.log10(v)], 'ts', 'end');
  o += line(sx(0), sy(0.5), sx(400), sy(0.5), 'grid') + text(sx(0) - 7, sy(0.5) + 4, '0.5', 'ts', 'end');
  for (const k of [0, 100, 200, 300, 400]) o += line(sx(k), sy(1e-6), sx(k), sy(0.5), 'grid') + text(sx(k), 237, String(k), 'ts', 'middle');
  o += line(sx(0), sy(1e-6), sx(400), sy(1e-6), 'axis') + line(sx(0), sy(1e-6), sx(0), sy(0.5), 'axis');
  o += text(sx(400), 252, '票数 k', 'ts', 'end') + text(66, 20, 'majority 出错的 probability（log scale）', 'ts', 'start');
  const ex = []; for (let k = 1; k <= 399; k += 2) ex.push([sx(k), sy(binomTail(k))]);
  o += path(d(ex), 'ln');
  o += path(curve((k) => Math.min(0.5, 1 / (4 * dlt * dlt * k)), 1, 400, sx, sy), 'ink');
  o += path(curve((k) => Math.min(0.5, Math.exp(-2 * dlt * dlt * k)), 0, 400, sx, sy), 'dash');
  o += text(sx(395), 44, 'Chebyshev 上界 1/(4δ²k)', 't', 'end');
  o += text(sx(395), 86, 'Chernoff 上界 e^(−2δ²k)', 't', 'end');
  o += text(sx(30), 112, '真实值（完全独立时）', 'tl', 'start');
  o += text(280, 272, 'Chebyshev 只要 pairwise independent，Chernoff 要完全独立。每票答对 0.6（δ = 0.1）', 'ts', 'middle');
  o += text(280, 290, 'k = 101 时 Chebyshev 给 0.25，真实值是 ' + binomTail(101).toFixed(3), 'ts', 'middle');
  return svg(560, 298, o, '多数表决出错的 probability 随票数下降（纵轴 log scale）：独立时的真实值和 Chernoff 上界按 exponential 下降，Chebyshev 上界只按 1/k 下降，但对 pairwise independent 的票也成立');
}

// ---------- 第 5 站：Merkle puzzles ----------
function merkle() {
  // 固定 seed 的 LCG，M = 400 个格子，双方各取 40 个
  let st = 12345; const rnd = () => (st = (st * 1103515245 + 12345) % 2147483648) / 2147483648;
  const M = 400, n = 40;
  const A = new Set(), B = new Set();
  while (A.size < n) A.add(Math.floor(rnd() * M));
  while (B.size < n) B.add(Math.floor(rnd() * M));
  const both = [...A].filter((v) => B.has(v)).sort((a, b) => a - b);
  const sx = lin(0, M, 30, 530);
  let o = line(30, 110, 530, 110, 'axis');
  for (const v of [0, 100, 200, 300, 400]) o += line(sx(v), 106, sx(v), 114, 'axis') + text(sx(v), 170, String(v), 'ts', 'middle') + line(sx(v), 152, sx(v), 158, 'grid');
  for (const v of A) o += line(sx(v + 0.5), 70, sx(v + 0.5), 104, both.includes(v) ? 'ln' : 'ink');
  for (const v of B) o += line(sx(v + 0.5), 116, sx(v + 0.5), 150, both.includes(v) ? 'ln' : 'mute');
  o += text(30, 60, 'Alice 的 40 个 Xᵢ（她公布 H(Xᵢ)）', 't') + text(30, 194, 'Bob 的 40 个 Yⱼ（他公布 H(Yⱼ)）', 't');
  for (const v of both) o += circle(sx(v + 0.5), 110, 5, 'ln-f');
  o += text(530, 60, `重合 ${both.length} 处（expectation n²/M = 4）`, 'tl', 'end');
  o += text(280, 226, `M = 400：双方各问 H 40 次就找到共同的 Xᵢ = Yⱼ；Eve 只看到 hash 值，要在 400 个候选里逐个试`, 'ts', 'middle');
  return svg(560, 236, o, `Merkle puzzles：在 400 个可能的值里，Alice 和 Bob 各随机取 40 个，实际重合 ${both.length} 个；重合的值就是共享的 key`);
}

// ---------- 第 5 站：DH 协议 ----------
function dh() {
  let o = '';
  const L = 90, R = 470;
  o += rect(L - 60, 12, 120, 34, 'paper', 6) + text(L, 34, 'Alice', 'tb', 'middle');
  o += rect(R - 60, 12, 120, 34, 'paper', 6) + text(R, 34, 'Bob', 'tb', 'middle');
  o += rect(206, 12, 148, 34, 'wash2', 6) + text(280, 34, 'Eve 看得见', 'ts', 'middle');
  o += line(L, 46, L, 250, 'grid') + line(R, 46, R, 250, 'grid') + line(280, 46, 280, 250, 'dash');
  o += text(280, 70, '公开：p = 23，g = 2（order 11）', 't', 'middle');
  o += text(L - 50, 100, 'a = 6（自己留着）', 't');
  o += text(R + 50, 100, 'b = 9（自己留着）', 't', 'end');
  o += arrow(L, 130, R, 130, 'ink') + text(200, 124, 'A = 2⁶ mod 23 = 18', 't', 'middle');
  o += arrow(R, 166, L, 166, 'ink') + text(360, 160, 'B = 2⁹ mod 23 = 6', 't', 'middle');
  o += text(L - 50, 206, 'Bᵃ = 6⁶ mod 23', 't') + text(L - 50, 226, '= 12', 'tl');
  o += text(R + 50, 206, 'Aᵇ = 18⁹ mod 23', 't', 'end') + text(R + 50, 226, '= 12', 'tl', 'end');
  o += rect(226, 190, 108, 44, 'paper', 5) + text(280, 208, '(2, 18, 6)', 't', 'middle') + text(280, 226, '算不出 12？', 'ts', 'middle');
  o += text(280, 272, '两边都得到 gᵃᵇ = 2⁵⁴；exponent 可以 mod 11：54 ≡ 10，2¹⁰ = 1024 ≡ 12', 'ts', 'middle');
  return svg(560, 282, o, 'Diffie–Hellman key exchange 的一次完整运行：p 等于 23，g 等于 2，Alice 取 a 等于 6，Bob 取 b 等于 9，双方都得到 12');
}

// ---------- 第 5 站：QR_23 是 11 个点的 cycle，square-and-multiply（动图） ----------
const C11 = [300, 150], R11 = 104;
const cp = (i, r = R11) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / 11; return [C11[0] + r * Math.cos(a), C11[1] + r * Math.sin(a)]; };
function cycle11(o0 = '') {
  let o = o0;
  const pts = []; for (let i = 0; i <= 11; i++) pts.push(cp(i));
  o += path(d(pts), 'grid');
  for (let i = 0; i < 11; i++) {
    const [x, y] = cp(i), [lx, ly] = cp(i, R11 + 24), [ex, ey] = cp(i, R11 - 26);
    o += circle(x, y, 13, 'paper') + text(x, y + 5, String(pw(2, i, 23)), 't', 'middle');
    o += text(ex, ey + 4, String(i), 'ts', 'middle');
  }
  return o;
}
function sqmulA() {
  // 2⁹：bit 1 0 0 1
  const frames = [
    [0, '起点：exponent 0，值 1', ''],
    [0, 'bit 1：square，0 → 0', '1² = 1'],
    [1, 'bit 1：再乘 g，0 → 1', '1 · 2 = 2'],
    [2, 'bit 0：square，1 → 2', '2² = 4'],
    [4, 'bit 0：square，2 → 4', '4² = 16'],
    [8, 'bit 1：square，4 → 8', '16² = 256 ≡ 3'],
    [9, 'bit 1：再乘 g，8 → 9', '3 · 2 = 6 = 2⁹'],
  ];
  const hold = 1.4, n = frames.length, T = hold * n + 1;
  const kt = frames.map((_, i) => (i * hold) / T).concat([1]);
  const seq = frames.map((_, i) => i).concat([n - 1]);
  let o = cycle11();
  o += text(C11[0], C11[1] - 6, 'QR₂₃', 'tb', 'middle') + text(C11[0], C11[1] + 12, '外圈：2ⁱ mod 23', 'ts', 'middle') + text(C11[0], C11[1] + 28, '内圈：exponent i', 'ts', 'middle');
  const mk = seq.map((i) => cp(frames[i][0]));
  o += `<circle cx="${f1(mk[0][0])}" cy="${f1(mk[0][1])}" r="16" class="ln" >${anim('cx', mk.map((p) => f1(p[0])), kt, T, true)}${anim('cy', mk.map((p) => f1(p[1])), kt, T, true)}</circle>`;
  o += text(20, 30, '算 2⁹ mod 23', 'tb') + text(20, 50, '9 = 1001（binary）', 't');
  frames.forEach(([, s, v], i) => {
    o += `<g opacity="${i === 0 ? 1 : 0}">${text(20, 90, s, 'tl')}${text(20, 112, v, 't')}${ashow(seq.map((j) => j === i), kt, T)}</g>`;
  });
  o += text(20, 160, 'square：exponent 翻倍', 'ts') + text(20, 178, '乘 g：exponent 加 1', 'ts') + text(20, 196, '4 次 square、2 次乘法', 'ts');
  o += text(20, 214, '（第一次 square 可省）', 'ts');
  return svgA(560, 290, o, '动图：QR23 的 11 个 element 排成一圈，2 的 i 次方在第 i 个位置；square-and-multiply 按 9 的 binary 1001 依次 square 和乘 g，exponent 走过 0、1、2、4、8、9');
}
function bsgs() {
  let o = cycle11();
  // baby steps 0..3
  for (let j = 0; j < 4; j++) { const [x, y] = cp(j); o += circle(x, y, 16, 'ln'); }
  // 目标 h = 18 = 2^6，giant step 每次退 4
  const t = cp(6); o += circle(t[0], t[1], 16, 'ink-b');
  const a0 = cp(6, R11 - 44), a1 = cp(2, R11 - 44);
  o += arrow(a0[0], a0[1], a1[0], a1[1], 'ink');
  o += text(C11[0], C11[1] + 6, '× 2⁻⁴ = × 13', 't', 'middle');
  o += text(20, 30, '解 2ˣ = 18（mod 23）', 'tb');
  o += text(20, 56, 'baby steps（存表）：', 't') + text(20, 76, '2⁰..2³ = 1, 2, 4, 8', 'tl');
  o += text(20, 110, 'giant steps：', 't') + text(20, 130, '18 不在表里', 't') + text(20, 150, '18 · 13 = 234 ≡ 4 在表里', 'tl');
  o += text(20, 176, '4 = 2²，退了 1 次 4 步', 't') + text(20, 196, 'x = 1 · 4 + 2 = 6', 'tb');
  o += text(280, 284, '|G| = 11，m = ⌈√11⌉ = 4：表里 4 项，最多退 3 次，共约 2√|G| 次 operation', 'ts', 'middle');
  return svg(560, 294, o, 'Baby-step giant-step：先把 2 的 0 到 3 次方存表，再从 18 出发每次乘 2 的负 4 次方，一次之后落到表里的 4，得到 x 等于 6');
}
// Z_23^* 的 22 个 element，偶数 exponent 是 quadratic residue
function ddh() {
  const C = [170, 150], R = 112;
  const P = (i, r = R) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / 22; return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]; };
  let o = '';
  const pts = []; for (let i = 0; i <= 22; i++) pts.push(P(i)); o += path(d(pts), 'grid');
  for (let i = 0; i < 22; i++) { const [x, y] = P(i), [ex, ey] = P(i, R - 22); o += circle(x, y, 11, i % 2 ? 'paper' : 'wash ink-s') + text(x, y + 4, String(pw(5, i, 23)), 'ts', 'middle'); o += text(ex, ey + 4, String(i), 'ts', 'middle'); }
  o += text(C[0], C[1] - 4, 'Z₂₃*，g = 5', 'tb', 'middle') + text(C[0], C[1] + 14, '内圈：exponent', 'ts', 'middle');
  const X = 330;
  o += rect(X, 30, 14, 14, 'wash ink-s') + text(X + 22, 42, '偶数 exponent = QR（11 个）', 't');
  o += rect(X, 54, 14, 14, 'paper') + text(X + 22, 66, '奇数 exponent（11 个）', 't');
  o += text(X, 100, '检验：y¹¹ mod 23 = 1 ⇔ 偶数', 't');
  o += text(X, 128, 'a、b uniform 地取：', 't');
  o += text(X, 148, 'ab 是偶数的 probability = ¾', 'tl');
  o += text(X, 168, '随机的 gᶜ 是 QR 的 probability = ½', 't');
  o += text(X, 200, '看 gᵃ、gᵇ 就知道 a、b 的 parity，', 'ts') + text(X, 218, '进而知道 gᵃᵇ 该不该是 QR', 'ts');
  o += text(X, 236, '→ DDH 在 Zₚ* 里不成立', 'tb');
  return svg(560, 280, o, 'Z23 星的 22 个 element按 5 的 exponent 排成一圈，偶数 exponent 的 11 个是 quadratic residue；用 y 的 11 次方能判断 exponent 的 parity，所以 DDH 在这里不成立');
}

// ---------- 第 6 站：Rabin，CRT 网格 ----------
function rabin() {
  const cw = 38, ch = 26, x0 = 70, y0 = 40;
  const crt = (a, b) => { for (let z = 0; z < 77; z++) if (z % 7 === a && z % 11 === b) return z; };
  const roots = new Set([10, 32, 45, 67]), QR = new Set([1, 4, 9, 15, 16, 23, 25, 36, 37, 53, 58, 60, 64, 67, 71]);
  let o = text(x0 + 5.5 * cw, 16, 'x mod 11', 'ts', 'middle') + text(18, y0 + 3.5 * ch, 'x mod 7', 'ts', 'middle');
  for (let b = 0; b < 11; b++) o += text(x0 + b * cw + cw / 2, y0 - 6, String(b), 'ts', 'middle');
  for (let a = 0; a < 7; a++) {
    o += text(x0 - 8, y0 + a * ch + 17, String(a), 'ts', 'end');
    for (let b = 0; b < 11; b++) {
      const z = crt(a, b);
      const cls = a === 0 || b === 0 ? 'paper-f' : z === 23 ? 'solid' : roots.has(z) ? 'wash-strong' : QR.has(z) ? 'wash' : 'paper-f';
      o += rect(x0 + b * cw, y0 + a * ch, cw, ch, cls) + rect(x0 + b * cw, y0 + a * ch, cw, ch, 'frame');
      o += text(x0 + b * cw + cw / 2, y0 + a * ch + 17, a === 0 || b === 0 ? '·' : String(z), z === 23 ? 'tw' : roots.has(z) ? 'tb' : 'ts', 'middle');
    }
  }
  const yb = y0 + 7 * ch + 22;
  o += rect(x0, yb, 14, 14, 'solid') + text(x0 + 20, yb + 12, 'y = 23 ↔ (2, 1)', 't');
  o += rect(x0 + 160, yb, 14, 14, 'wash-strong') + text(x0 + 180, yb + 12, '23 的四个 square root：(±4, ±1)', 't');
  o += rect(x0, yb + 24, 14, 14, 'wash') + text(x0 + 20, yb + 36, '其余 QR₇₇（连同上面 23、67，一共 15 个）', 't');
  o += rect(x0 + 330, yb + 24, 14, 14, 'paper') + text(x0 + 336, yb + 35, '·', 'ts', 'middle') + text(x0 + 350, yb + 36, '不在 Z₇₇* 里', 't');
  o += text(280, yb + 64, '四个 root 里只有 67 = (4, 1) 本身是 QR：两个 coordinate 各自的 sign 只有一种选法', 'ts', 'middle');
  return svg(560, yb + 74, o, 'Z77 按 CRT 排成 7 行 11 列的格子；23 对应 (2,1)，它的四个 square root 10、32、45、67 对应 (正负 4, 正负 1)，只有 67 是 quadratic residue');
}

// ---------- 第 7 站：stream cipher 改金额 ----------
function flip() {
  const msg = 'PAY 100';
  let o = '';
  const x0 = 70, cw = 52;
  const row = (y, lab, s, hiIdx, cls = 'paper') => {
    o += text(x0 - 10, y + 20, lab, 't', 'end');
    [...s].forEach((c, i) => { o += rect(x0 + i * cw, y, cw - 4, 30, i === hiIdx ? 'wash ink-s' : cls, 4) + text(x0 + i * cw + (cw - 4) / 2, y + 20, c === ' ' ? '␣' : c, 'tb', 'middle'); });
  };
  row(20, 'm', msg, 4);
  o += text(x0 + 7 * cw + 6, 40, 'Alice 写的', 'ts');
  row(70, 'c', '▒▒▒▒▒▒▒', 4, 'wash2');
  o += text(x0 + 7 * cw + 6, 90, 'Eve 看不懂', 'ts');
  row(150, 'c′', '▒▒▒▒▒▒▒', 4, 'wash2');
  o += text(x0 + 7 * cw + 6, 170, 'Eve 改过', 'ts');
  row(200, 'Dec(c′)', 'PAY 900', 4);
  o += text(x0 + 7 * cw + 6, 220, 'Bob 收到', 'ts');
  const xm = x0 + 4 * cw + (cw - 4) / 2;
  o += arrow(xm, 104, xm, 148, 'ln');
  o += text(xm + 14, 122, '第 5 个 byte XOR 00001000', 'tl') + text(xm + 14, 140, '（Eve 不需要 key）', 'ts');
  o += text(280, 262, '“1” = 00110001，“9” = 00111001：c 的某一 bit 翻了，m 的同一 bit 就翻了', 'ts', 'middle');
  return svg(560, 272, o, 'Stream cipher 的 malleability：Eve 把 ciphertext 第 5 个 byte 异或 00001000，Bob 解出来的 PAY 100 变成 PAY 900');
}

// ---------- 第 7 站：CBC-MAC 的 variable-length forgery ----------
function cbcmac() {
  let o = '';
  const blk = (x, y, s) => rect(x, y, 74, 34, 'paper', 5) + text(x + 37, y + 22, s, 't', 'middle');
  const F = (cx, y) => rect(cx - 28, y, 56, 34, 'wash ink-s', 5) + text(cx, y + 22, 'F' + sub('k'), 'tb', 'middle');
  const xor = (x, y) => circle(x, y, 10, 'paper') + line(x - 6, y, x + 6, y, 'ink') + line(x, y - 6, x, y + 6, 'ink');
  o += text(20, 22, '合法查询：一个 block 的 m，tag 是 t = F' + sub('k') + '(m)', 'tb');
  o += blk(60, 36, 'm') + arrow(97, 70, 97, 92, 'ink') + F(97, 94) + arrow(97, 128, 97, 150, 'ink') + text(97, 168, 't', 'tl', 'middle');
  o += text(20, 206, 'Forgery：两个 block 的 m ∥ (t ⊕ m)，没有问过，tag 也是 t', 'tb');
  // 第一个 block
  o += blk(60, 220, 'm') + arrow(97, 254, 97, 276, 'ink') + F(97, 278);
  // F 的输出 t 向右进入 XOR
  o += arrow(125, 295, 258, 295, 'ink') + text(190, 287, 't₁ = t', 'tl', 'middle');
  // 第二个 block 从上面进入 XOR
  o += blk(233, 220, 't ⊕ m') + arrow(270, 254, 270, 283, 'ink') + xor(270, 295);
  // XOR 输出向下进入第二个 F
  o += arrow(270, 305, 270, 330, 'ink') + text(284, 322, 't ⊕ (t ⊕ m) = m', 't', 'start');
  o += F(270, 332) + arrow(270, 366, 270, 388, 'ink') + text(270, 406, 't₂ = F' + sub('k') + '(m) = t', 'tl', 'middle');
  o += text(280, 436, '第二个 block 进 F' + sub('k') + ' 之前被 XOR 回 m，链子末端重复了第一次的计算', 'ts', 'middle');
  return svg(560, 446, o, 'CBC-MAC 的 variable-length forgery：问过 m 的 tag t 后，两个 block 的 m 接 t 异或 m，第二个 block 进入 F_k 前恰好被异或回 m，tag 仍是 t');
}

// ---------- 第 7 站：对 PRF encryption 的 CCA attack ----------
function cca() {
  let o = '';
  const L = 110, R = 450;
  o += rect(L - 70, 12, 140, 34, 'paper', 6) + text(L, 34, 'Challenger', 'tb', 'middle');
  o += rect(R - 70, 12, 140, 34, 'wash ink-s', 6) + text(R, 34, 'Adversary', 'tb', 'middle');
  o += line(L, 46, L, 300, 'grid') + line(R, 46, R, 300, 'grid');
  o += arrow(R, 74, L, 74, 'ink') + text(280, 66, 'm₀ = 0000，m₁ = 1111', 't', 'middle');
  o += arrow(L, 116, R, 116, 'ln') + text(280, 108, '(r, c)，c = F_k(r) ⊕ m_b', 'tl', 'middle');
  o += arrow(R, 166, L, 166, 'ink') + text(280, 158, 'Dec 查询：(r, c ⊕ 0001)（不是 challenge 本身）', 't', 'middle');
  o += arrow(L, 210, R, 210, 'ink') + text(280, 202, 'm_b ⊕ 0001', 't', 'middle');
  o += text(R + 10, 246, '得到 0001 → b = 0', 't', 'start') + text(R + 10, 266, '得到 1110 → b = 1', 't', 'start');
  o += text(280, 322, 'Malleability 加上一个 decryption oracle：advantage 是 ½（赢的 probability 是 1）', 'ts', 'middle');
  return svg(560, 332, o, 'CCA game 里attack PRF encryption：adversary 把 challenge ciphertext 的最后一位翻转后送去 decrypt，得到 m_b 异或 0001，从而知道 b');
}

// ---------- 第 8 站：FDH proof 里 program random oracle ----------
function fdh() {
  let o = '';
  const x0 = 40, y0 = 46, rh = 30;
  o += text(x0, 22, 'B 替 A 回答 H 的 q 次查询（B 想 invert 的是 y）', 'tb');
  const cols = [['query', 0], ['B 给的 H(z)', 140], ['B 知道 f⁻¹(H(z)) 吗', 330]];
  cols.forEach(([s0, dx]) => { o += text(x0 + dx + 4, y0 - 6, s0, 'ts'); });
  const z = (j) => 'z' + sub(j), x = (j) => 'x' + sub(j);
  const rows = [[z('1'), `f(${x('1')})，${x('1')} 随机`, `知道：${x('1')}`], [z('2'), `f(${x('2')})，${x('2')} 随机`, `知道：${x('2')}`], ['⋮', '', ''], [z('j*'), 'y（challenge）', '不知道：要靠 A'], ['⋮', '', ''], [z('q'), `f(${x('q')})`, `知道：${x('q')}`]];
  rows.forEach(([a, b, c], i) => {
    const y = y0 + i * rh, hi = i === 3;
    o += rect(x0, y, 480, rh, hi ? 'wash ink-s' : 'paper-f') + rect(x0, y, 480, rh, 'frame');
    o += text(x0 + 8, y + 20, a, hi ? 'tl' : 't') + text(x0 + 148, y + 20, b, hi ? 'tl' : 't') + text(x0 + 338, y + 20, c, hi ? 'tl' : 't');
  });
  const yb = y0 + 6 * rh + 26;
  o += text(x0, yb, `A 要求签 ${z('j')}（j ≠ j*）：B 直接给 ${x('j')}，验证通过：f(${x('j')}) = H(${z('j')})`, 't');
  o += text(x0, yb + 22, `A 最后 forge 出 (m, σ)：若 m = ${z('j*')}，则 f(σ) = y，σ = f⁻¹(y)，B 赢`, 't');
  o += text(280, yb + 52, 'j* 是 B 事先随机猜的，A 看不出哪一行特殊，所以猜中的 probability 是 1/q', 'ts', 'middle');
  return svg(560, yb + 62, o, 'FDH 的 reduction：B 把 challenge y 埋进随机猜的第 j 星次 hash 查询，其余查询的答案都是 B 自己知道 preimage 的 f(x_j)，用来回答 signing 查询');
}

// ---------- 第 8 站：birthday bound ----------
function birthday() {
  const sx = lin(0, 3.5, 70, 520), sy = lin(0, 1, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 3.5, y0: 0, y1: 1, xt: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], yt: [0, 0.25, 0.5, 0.75, 1], xl: 'q / √N', yl: 'Pr[至少一个 collision]', grid: true });
  o += path(curve((t) => 1 - Math.exp(-t * t / 2), 0, 3.5, sx, sy), 'ln');
  const t5 = Math.sqrt(2 * Math.log(2));
  o += line(sx(t5), sy(0), sx(t5), sy(0.5), 'dash') + line(sx(0), sy(0.5), sx(t5), sy(0.5), 'dash') + circle(sx(t5), sy(0.5), 4, 'ln-f');
  o += text(sx(t5) + 8, sy(0.5) + 18, `q ≈ ${t5.toFixed(3)} √N 时过半`, 't');
  o += text(280, 260, '1 − e^(−q²/2N)：N = 2²⁵⁶ 时，q 要到 2¹²⁸ 量级才有像样的 collision probability', 'ts', 'middle');
  return svg(560, 270, o, 'Birthday bound：随机 function 的 q 个输出里出现 collision 的 probability，q 约为 1.177 倍根号 N 时达到二分之一');
}

// ---------- 第 9 站：interpolation 与 Shamir shares ----------
function shamir() {
  let o = '';
  // 左：实数上过四点的 cubic（Joy Example 3.3.2）
  const F = (X) => 0.5 * (X ** 3 - 4 * X ** 2 - 9 * X + 38);
  const sx = lin(1, 6, 40, 250), sy = lin(-2, 12, 220, 40);
  o += axes({ sx, sy, x0: 1, x1: 6, y0: -2, y1: 12, xt: [2, 3, 4, 5], yt: [0, 5, 10], grid: true });
  o += path(curve(F, 1.2, 5.24, sx, sy), 'ln');
  for (const [x, y] of [[3, 1], [4, 1], [5, 9], [2, 6]]) o += circle(sx(x), sy(y), 4.5, 'ink-f') + text(sx(x) + 7, sy(y) - 7, `(${x}, ${y})`, 'ts');
  o += text(145, 22, '实数上：4 个点定出唯一的 cubic', 'tb', 'middle');
  // 右：Joy 的 3-out-of-5 例子，f(x) = x² + 4x + 7 mod 11
  const Q = (X) => (X * X + 4 * X + 7) % 11;
  const tx = lin(0, 5.5, 330, 540), ty = lin(0, 10.5, 220, 40);
  o += axes({ sx: tx, sy: ty, x0: 0, x1: 5.5, y0: 0, y1: 10.5, xt: [0, 1, 2, 3, 4, 5], yt: [0, 5, 10], grid: true });
  o += circle(tx(0), ty(7), 5, 'paper') + text(tx(0) + 9, ty(7) + 4, 'f(0) = 7：secret', 'tl');
  for (let i = 1; i <= 5; i++) o += circle(tx(i), ty(Q(i)), 4.5, 'ink-f') + text(tx(i), ty(Q(i)) - 9, `(${i}, ${Q(i)})`, 'ts', 'middle');
  o += text(435, 22, 'mod 11：5 个 share 不在一条光滑曲线上', 'tb', 'middle');
  o += text(280, 258, '右边是 f(x) = x² + 4x + 7 mod 11 在 1 到 5 的值：任 3 个能还原 f，任 2 个对 secret 毫无信息', 'ts', 'middle');
  return svg(560, 268, o, '左图：实数上过 (3,1)、(4,1)、(5,9)、(2,6) 的唯一 cubic；右图：mod 11 的 quadratic x 平方加 4x 加 7 在 1 到 5 上的 5 个 share，x 等于 0 处是 secret 7');
}

// ---------- 第 9 站：BGW 的乘法让 degree 翻倍 ----------
function bgw() {
  const ga = (x) => 3 + 2 * x, gb = (x) => 4 + 5 * x, h = (x) => ga(x) * gb(x);
  const sx = lin(0, 3.4, 60, 340), sy = lin(0, 180, 300, 30);
  let o = axes({ sx, sy, x0: 0, x1: 3.4, y0: 0, y1: 180, xt: [0, 1, 2, 3], yt: [0, 40, 80, 120, 160], xl: 'x（party 编号）', grid: true });
  o += path(curve(ga, 0, 3.4, sx, sy), 'ink') + path(curve(gb, 0, 3.4, sx, sy), 'dash') + path(curve(h, 0, 3.32, sx, sy), 'ln');
  for (const x of [1, 2, 3]) {
    o += circle(sx(x), sy(ga(x)), 3.5, 'ink-f') + circle(sx(x), sy(gb(x)), 3.5, 'ink-f') + circle(sx(x), sy(h(x)), 4.5, 'ln-f');
    o += text(sx(x) - 8, sy(h(x)) - 4, String(h(x)), 'tl', 'end');
  }
  o += circle(sx(0), sy(12), 4.5, 'paper') + line(sx(0) + 4, sy(12) - 4, sx(0.35), sy(55), 'mute') + text(sx(0.35) + 2, sy(55) - 4, 'h(0) = 12 = a·b', 'tl', 'start');
  o += text(sx(3.4) + 4, sy(ga(3.4)) + 8, 'g' + sub('a'), 't') + text(sx(3.4) + 4, sy(gb(3.4)) - 2, 'g' + sub('b'), 't');
  o += text(sx(2.55), sy(h(2.55)) - 8, 'h = g' + sub('a') + ' · g' + sub('b'), 'tl', 'end');
  const X = 390;
  o += text(X, 50, '（整数上画，mod 11 之前）', 'ts');
  o += text(X, 76, 'g' + sub('a') + ' = 3 + 2x：degree 1', 't') + text(X, 98, 'g' + sub('b') + ' = 4 + 5x：degree 1', 't');
  o += text(X, 124, 'h = 12 + 23x + 10x²', 'tl') + text(X, 144, 'degree 2', 'tl');
  o += text(X, 176, 'party i 本地算', 'ts') + text(X, 194, 'h(i) = g' + sub('a') + '(i) · g' + sub('b') + '(i)', 'ts');
  o += text(X, 220, '三个点 45、98、171', 'ts') + text(X, 238, '恰好够定 degree 2', 'ts');
  return svg(560, 330, o, '两个 degree 1 的 sharing polynomial 相乘得到 degree 2 的 polynomial，三个 party 的本地乘积 45、98、171 恰好落在它上面，x 等于 0 处是 a 乘 b 等于 12');
}

// ---------- 第 10 站：lattice 与两组 basis ----------
function lattice() {
  let o = '';
  const S = 15;
  const panel = (x0, O, B, title, note) => {
    const P = ([a, b]) => [O[0] + a * S, O[1] - b * S];
    o += rect(x0, 30, 240, 230, 'frame');
    for (let i = -14; i <= 14; i++) for (let j = -14; j <= 14; j++) {
      const v = [3 * i + j, i + 2 * j], [x, y] = P(v);
      if (x > x0 + 4 && x < x0 + 236 && y > 34 && y < 256) o += circle(x, y, 2.4, 'ink-f');
    }
    const c = ['ln', 'ink-b'];
    B.forEach((v, k) => { const [x, y] = P(v); o += arrow(O[0], O[1], x, y, c[k]); o += text(x + (k ? -6 : 6), y - 7, `(${v[0]}, ${v[1]})`, k ? 'tb' : 'tl', k ? 'end' : 'start'); });
    o += circle(O[0], O[1], 3.5, 'paper');
    o += text(x0 + 120, 20, title, 'tb', 'middle') + text(x0 + 120, 278, note, 'ts', 'middle');
  };
  panel(30, [150, 150], [[3, 1], [1, 2]], '好的 basis：短、接近 perpendicular', '最短的 nonzero vector (1, 2) 就是 basis 之一');
  panel(290, [318, 236], [[11, 7], [7, 4]], '坏的 basis：长、几乎 parallel', '同一组点，从这组 basis 看不出谁最短');
  return svg(560, 288, o, '同一个 2 维 lattice 的两组 basis：左边 (3,1)、(1,2) 短而接近垂直，右边 (7,4)、(11,7) 长而几乎平行，生成的点完全相同');
}

// ---------- 第 10 站：Z_17 上的 decryption ----------
function zq() {
  const q = 17, C = [170, 168], R = 106;
  const P = (v, r = R) => { const a = -Math.PI / 2 + (2 * Math.PI * v) / q; return [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)]; };
  let o = '';
  const arc = (v0, v1, r) => { const pts = []; for (let k = 0; k <= 40; k++) pts.push(P(v0 + ((v1 - v0) * k) / 40, r)); return pts; };
  o += path(d(arc(-4.25, 4.25, R + 18)), 'ln');
  o += path(d(arc(4.25, 12.75, R + 18)), 'ink-b');
  for (let v = 0; v < q; v++) { const [x, y] = P(v); o += circle(x, y, 11, 'paper') + text(x, y + 4, String(v), 'ts', 'middle'); }
  const tp = P(0, R + 30), tq = P(8.5, R + 30);
  o += text(tp[0], tp[1] - 4, '解成 0', 'tl', 'middle') + text(tq[0], tq[1] + 14, '解成 1', 'tb', 'middle');
  const marks = [[2, 'encrypt 0：2', 'ln-f', 'end'], [11, 'encrypt 1：11', 'ink-f', 'start'], [9, 'noise 过大：9', 'mute-f', 'middle']];
  for (const [v, s0, cls, anc] of marks) {
    const [x, y] = P(v, R - 24), [lx, ly] = P(v, R - 48);
    o += circle(x, y, 6, cls) + text(lx, ly + 4, s0, 't', anc === 'end' ? 'end' : anc === 'start' ? 'start' : 'middle');
  }
  const X = 336;
  o += text(X, 44, 'q = 17，1 编码成 ⌊(q + 1)/2⌋ = 9', 'tb');
  o += text(X, 70, 'Dec 看 v − ⟨u, s⟩ 离 0 近', 't') + text(X, 90, '还是离 9 近，分界是 q/4 = 4.25', 't');
  o += text(X, 124, 'encrypt 0：noise rᵀe = 2', 't') + text(X, 144, 'encrypt 1：9 + 2 = 11', 't') + text(X, 164, 'noise rᵀe = 9：0 被错解成 1', 't');
  o += text(X, 198, '只要累积的 |rᵀe| < q/4，', 'ts') + text(X, 216, '就落在正确的一边', 'ts');
  return svg(560, 330, o, 'Z17 排成一圈：离 0 不到 4.25 的一段解成 0，其余解成 1；public key encrypt 0 得到 2，encrypt 1 得到 11，都解对；noise 累积到 9 时把 0 错解成 1');
}

// ---------- 第 9 站：OT from RSA（N = 35） ----------
function ot() {
  const N = 35, e = 5, dd = 29;
  const x1 = 12, y1 = pw(x1, e, N), y0 = 9, X0 = pw(y0, dd, N), X1 = pw(y1, dd, N);
  const m0 = 1, m1 = 0, c0 = m0 ^ (X0 & 1), c1 = m1 ^ (X1 & 1);
  let o = '';
  const L = 90, R = 470;
  o += rect(L - 80, 12, 160, 36, 'paper', 6) + text(L, 28, 'Sender', 'tb', 'middle') + text(L, 43, `m₀ = ${m0}，m₁ = ${m1}`, 'ts', 'middle');
  o += rect(R - 80, 12, 160, 36, 'wash ink-s', 6) + text(R, 28, 'Receiver', 'tb', 'middle') + text(R, 43, 'choice b = 1', 'ts', 'middle');
  o += line(L, 48, L, 300, 'grid') + line(R, 48, R, 300, 'grid');
  o += arrow(L, 76, R, 76, 'ink') + text(280, 68, `(N, e) = (${N}, ${e})；d = ${dd} 自己留着`, 't', 'middle');
  o += text(R - 8, 102, `x₁ = ${x1}，y₁ = ${x1}⁵ mod ${N} = ${y1}`, 't', 'end');
  o += text(R - 8, 122, `y₀ = ${y0}：随手取，不知道它的 preimage`, 't', 'end');
  o += arrow(R, 156, L, 156, 'ink') + text(280, 148, `(y₀, y₁) = (${y0}, ${y1})：两个都像 Z₃₅* 里的随机 element`, 't', 'middle');
  o += text(L + 8, 182, `x₀ = ${y0}²⁹ mod ${N} = ${X0}，x₁ = ${y1}²⁹ mod ${N} = ${X1}`, 't', 'start');
  o += text(L + 8, 202, `c₀ = m₀ ⊕ LSB(${X0}) = ${c0}，c₁ = m₁ ⊕ LSB(${X1}) = ${c1}`, 't', 'start');
  o += arrow(L, 234, R, 234, 'ln') + text(280, 226, `(c₀, c₁) = (${c0}, ${c1})`, 'tl', 'middle');
  o += text(R - 8, 260, `m₁ = c₁ ⊕ LSB(${x1}) = ${c1 ^ (x1 & 1)}`, 'tl', 'end');
  o += text(R - 8, 280, 'm₀ 要 LSB(x₀)，而 x₀ 要 d 才算得出', 'ts', 'end');
  o += text(280, 320, 'Sender 看到的 y₀、y₁ 分布相同，不知道 b；receiver 只拿得到自己知道 preimage 的那一个', 'ts', 'middle');
  return svg(560, 330, o, 'RSA 构造的 oblivious transfer：receiver 要第 1 个 bit，自己算 y1 等于 12 的 5 次方 mod 35 等于 17，y0 随机取 9；sender 用 d 解出 4 和 12，把两个 bit 分别和它们的最低位异或后发回');
}

// ---------- 第 9 站：garble 一个 AND gate ----------
function garble() {
  let o = '';
  const K = (w, b) => 'K' + sub(w) + (b ? '¹' : '⁰');
  o += text(110, 20, 'Alice 给每根 wire 取两个 label', 'tb', 'middle');
  o += line(40, 70, 96, 70, 'ink') + line(40, 130, 96, 130, 'ink');
  o += `<path d="M96 52 L130 52 A48 48 0 0 1 130 148 L96 148 Z" class="paper"/>` + text(128, 105, 'AND', 'tb', 'middle');
  o += line(178, 100, 210, 100, 'ink');
  o += text(30, 62, 'a', 'tb', 'middle') + text(30, 122, 'b', 'tb', 'middle') + text(216, 92, 'c', 'tb', 'start');
  o += text(60, 172, `a：${K('a', 0)}、${K('a', 1)}`, 't', 'start') + text(60, 194, `b：${K('b', 0)}、${K('b', 1)}`, 't', 'start') + text(60, 216, `c：${K('c', 0)}、${K('c', 1)}`, 't', 'start');
  o += text(60, 244, '每个 label 是 λ bit 的随机 string，', 'ts', 'start') + text(60, 260, '看 label 本身看不出它代表 0 还是 1', 'ts', 'start');
  const rows = [[1, 1], [0, 0], [1, 0], [0, 1]];
  const X = 268, W = 272;
  o += text(X + W / 2, 20, 'Garbled table（四行打乱后发给 Bob）', 'tb', 'middle');
  rows.forEach(([i, j], r) => {
    const y = 40 + r * 42, hit = i === 1 && j === 0;
    o += rect(X, y, W, 34, hit ? 'wash ink-s' : 'paper', 5);
    o += text(X + 14, y + 22, `Enc( ${K('a', i)} , Enc( ${K('b', j)} , ${K('c', i & j)} ) )`, hit ? 'tl' : 't', 'start');
  });
  o += text(X, 222, `Bob 手里只有 ${K('a', 1)} 和 ${K('b', 0)}：`, 't', 'start');
  o += text(X, 244, '四行都试一遍，只有浅色那一行解得开', 't', 'start');
  o += text(X, 266, `得到 ${K('c', 0)}，但不知道它代表 0`, 'tl', 'start');
  o += text(280, 296, '其余三行在 Bob 看来和 random string 没有区别：他每根 wire 只握着一个 label', 'ts', 'middle');
  return svg(560, 306, o, 'Garble 一个 AND gate：每根 wire 有两个随机 label，garbled table 的四行各用一对输入 label 两层 encrypt 对应的输出 label，打乱顺序；Bob 拿着 K_a 1 和 K_b 0 只能打开一行，得到 K_c 0');
}

// ---------- 第 10 站：QR 的 zero-knowledge protocol 与 simulator ----------
function zkqr() {
  let o = '';
  // 左：真实的一轮
  const L = 50, R = 250;
  o += text(150, 18, '真实的一轮：P 知道 w = 10', 'tb', 'middle');
  o += rect(L - 34, 28, 68, 28, 'paper', 6) + text(L, 47, 'P', 'tb', 'middle');
  o += rect(R - 34, 28, 68, 28, 'wash ink-s', 6) + text(R, 47, 'V', 'tb', 'middle');
  o += line(L, 56, L, 250, 'grid') + line(R, 56, R, 250, 'grid');
  o += text(L - 30, 82, 'r = 4', 't');
  o += arrow(L, 102, R, 102, 'ink') + text(150, 96, 's = r² = 16', 't', 'middle');
  o += arrow(R, 140, L, 140, 'ink') + text(150, 134, 'b = 1', 't', 'middle');
  o += arrow(L, 178, R, 178, 'ink') + text(150, 172, 'z = r·w = 40', 't', 'middle');
  o += text(R + 4, 206, 'z² = 1600 ≡ 60', 't', 'end') + text(R + 4, 226, 's·y = 368 ≡ 60 ✓', 'tl', 'end');
  // 右：simulator
  const X = 320;
  o += line(296, 14, 296, 250, 'grid');
  o += text(430, 18, 'Simulator：不知道 w', 'tb', 'middle');
  o += text(X, 62, '① 先取 b = 1', 't') + text(X, 90, '② 随机取 z = 20', 't');
  o += text(X, 118, '③ 倒着算 s = z² / y', 't') + text(X + 18, 138, '= 15 · 23⁻¹ ≡ 4', 't');
  o += text(X, 168, '④ 输出 (s, b, z) = (4, 1, 20)', 'tb');
  o += text(X, 206, 'z² = 400 ≡ 15', 't') + text(X, 226, 's·y = 92 ≡ 15 ✓', 'tl');
  o += text(280, 276, 'N = 77，y = 23。两边的 (s, b, z) 都是：b uniform，z 是 Z₇₇* 里 uniform 的 element，s 由 z²/yᵇ 决定', 'ts', 'middle');
  return svg(560, 286, o, '左边是 quadratic residuosity protocol 真实的一轮：prover 取 r 等于 4，发 16，收到 b 等于 1，回 40；右边是 simulator 不用 witness，先取 b 和 z 再倒算 s 等于 4，同样通过检验');
}

// ---------- 第 10 站：3-coloring 的一轮 ----------
function col3() {
  const V = { A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] };
  const E = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'C']];
  const chi = { A: 1, B: 3, C: 2, D: 3 };
  const rho = { 1: 2, 2: 3, 3: 1 };
  const fill = { 1: 'wash', 2: 'wash-strong', 3: 'wash2' };
  let o = '';
  const panel = (x0, title, body) => {
    const P = (v) => [x0 + 40 + V[v][0] * 100, 60 + V[v][1] * 100];
    for (const [u, v] of E) {
      const hot = body === 'open' && u === 'B' && v === 'C';
      o += line(...P(u), ...P(v), hot ? 'ln' : 'ink');
    }
    for (const v of Object.keys(V)) {
      const [x, y] = P(v);
      if (body === 'true') o += circle(x, y, 17, 'paper-f') + circle(x, y, 17, fill[chi[v]]) + text(x, y + 5, String(chi[v]), 'tb', 'middle');
      else if (body === 'perm') o += circle(x, y, 17, 'paper-f') + circle(x, y, 17, fill[rho[chi[v]]]) + text(x, y + 5, String(rho[chi[v]]), 'tb', 'middle');
      else {
        const open = v === 'B' || v === 'C';
        if (open) o += circle(x, y, 17, 'paper-f') + circle(x, y, 17, fill[rho[chi[v]]]) + text(x, y + 5, String(rho[chi[v]]), 'tb', 'middle');
        else o += rect(x - 15, y - 13, 30, 26, 'solid2', 4) + text(x, y + 5, '?', 'tw', 'middle');
      }
      const dx = V[v][0] ? 26 : -26;
      o += text(x + dx, y - 16, v, 'ts', 'middle');
    }
    o += text(x0 + 90, 20, title, 'tb', 'middle');
  };
  panel(0, 'P 手里的 coloring χ', 'true');
  panel(185, '换色 ρ：1→2，2→3，3→1', 'perm');
  panel(370, 'V 挑 edge BC，只打开两端', 'open');
  o += text(185 + 90, 196, '每个顶点的颜色放进一个 commitment', 'ts', 'middle');
  o += text(370 + 90, 196, '1 ≠ 3：检查通过', 'tl', 'middle');
  o += text(280, 228, '5 条 edge。图要是不能 3-color，至少有一条 edge 两端同色，每轮被挑中的 probability ≥ 1/5', 'ts', 'middle');
  return svg(560, 238, o, '3-coloring 的 zero-knowledge protocol 一轮：4 个顶点 5 条边的图，prover 先把颜色随机换一遍，对每个顶点的颜色做 commitment；verifier 挑 edge BC，prover 只打开 B 和 C 两个 commitment，颜色 1 和 3 不同');
}

export default {
  'cs4230-map': map,
  'cs4230-otp': otp,
  'cs4230-twotime': twotime,
  'cs4230-shannon': shannon,
  'cs4230-game': game,
  'cs4230-reduction': reduction,
  'cs4230-hybrid': hybridA,
  'cs4230-ggm': ggmA,
  'cs4230-gl': gl,
  'cs4230-vote': vote,
  'cs4230-merkle': merkle,
  'cs4230-dh': dh,
  'cs4230-sqmul': sqmulA,
  'cs4230-bsgs': bsgs,
  'cs4230-ddh': ddh,
  'cs4230-rabin': rabin,
  'cs4230-flip': flip,
  'cs4230-cbcmac': cbcmac,
  'cs4230-cca': cca,
  'cs4230-fdh': fdh,
  'cs4230-birthday': birthday,
  'cs4230-shamir': shamir,
  'cs4230-bgw': bgw,
  'cs4230-ot': ot,
  'cs4230-garble': garble,
  'cs4230-zkqr': zkqr,
  'cs4230-col3': col3,
  'cs4230-lattice': lattice,
  'cs4230-zq': zq,
};
