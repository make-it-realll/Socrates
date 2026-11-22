import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const mm = (v) => (v < 0 ? '−' + Math.abs(v) : String(v));
const pay = (a, b) => `(${mm(a)}, ${mm(b)})`;
// 二进制分母的分数：0.375 → 3/8
const frac = (v) => {
  if (v === 0) return '0';
  for (let k = 0; k <= 12; k++) { const n = v * 2 ** k; if (Math.abs(n - Math.round(n)) < 1e-9) return k ? `${Math.round(n)}/${2 ** k}` : String(Math.round(n)); }
  return v.toFixed(3);
};
// 线性动图的时间轴：n 个 state，每个停一会儿、state 之间走 move 秒
function tl(n, { move = 0.6, hold = 0.5, first = 1.2, last = 2.4 } = {}) {
  const t = [], s = [];
  let now = 0;
  for (let k = 0; k < n; k++) {
    if (k > 0) now += move;
    t.push(now); s.push(k);
    now += k === 0 ? first : k === n - 1 ? last : hold;
    t.push(now); s.push(k);
  }
  return { kt: t.map((x) => x / now), s, T: now };
}
// discrete 动图的时间轴：每个 state 一段时长；values 要比 holds 多一个（最后一个重复）
function tlD(holds) {
  const T = holds.reduce((a, b) => a + b, 0), kt = [];
  let t = 0;
  for (const h of holds) { kt.push(t / T); t += h; }
  kt.push(1);
  return { kt, T };
}
// 只在某些 state 显示的一组元素
const gshow = (on, kt, T, body) => `<g opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}${body}</g>`;
const fade = (x, y, w, h) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" class="paper-f" opacity="0.78"/>`;

function matrix(x0, y0, cw, ch, rows, cols, cells) {
  let o = '';
  for (let c = 0; c < cols.length; c++) o += text(x0 + c * cw + cw / 2, y0 - 9, cols[c], 'tb', 'middle');
  for (let r = 0; r < rows.length; r++) o += text(x0 - 10, y0 + r * ch + ch / 2 + 5, rows[r], 'tb', 'end');
  for (let r = 0; r < rows.length; r++) for (let c = 0; c < cols.length; c++) {
    o += rect(x0 + c * cw, y0 + r * ch, cw, ch, 'frame');
    o += text(x0 + c * cw + cw / 2, y0 + r * ch + ch / 2 + 5, pay(...cells[r][c]), 't', 'middle');
  }
  return o;
}

// ---------- 第 1 站：iterated elimination（动图） ----------
function iesdsA() {
  const R = ['Confess', 'Don’t confess', 'Suicide'];
  const U = [[[-2, -2], [0, -3], [-2, -10]], [[-3, 0], [-1, -1], [0, -10]], [[-10, -2], [-10, 0], [-10, -10]]];
  // 核对：Suicide 被 Confess strictly dominate；删掉之后 Confess strictly dominate Don't confess
  const dom = (a, b, cols) => cols.every((c) => U[a][c][0] > U[b][c][0]);
  if (!dom(0, 2, [0, 1, 2]) || dom(0, 1, [0, 1, 2]) || !dom(0, 1, [0, 1])) throw new Error('iesds 数据不对');
  const x0 = 150, y0 = 48, cw = 104, ch = 38;
  const lv = [3, 0, 1, 2, 3], { kt, T } = tlD([3.4, 1.8, 2.2, 2.2, 3.0]);
  const vals = [...lv, lv[lv.length - 1]];
  const at = (k) => vals.map((v) => v >= k);
  let o = gshow(at(3), kt, T, rect(x0, y0, cw, ch, 'wash-strong'));
  o += matrix(x0, y0, cw, ch, R, R, U);
  o += text(x0 - 10, y0 - 9, 'P1 \\ P2', 'ts', 'end');
  const strike = (k, label) => {
    const r = k; // 同一个 index：row 给 P1，column 给 P2
    return fade(x0, y0 + r * ch, 3 * cw, ch) + fade(x0 + r * cw, y0, cw, 3 * ch) +
      text(x0 + 3 * cw + 8, y0 + r * ch + ch / 2 + 4, label, 'ts') + text(x0 + r * cw + cw / 2, y0 + 3 * ch + 16, label, 'ts', 'middle');
  };
  o += gshow(at(1), kt, T, strike(2, 'round 1 删'));
  o += gshow(at(2), kt, T, strike(1, 'round 2 删'));
  const cap = [
    '原来的 game：Confess 不 dominate Don’t confess（对方选 Suicide 时 0 > −2）',
    'Round 1：Suicide 被 Confess strictly dominate，两人都不会选',
    'Round 2：剩下的 2×2 里，Confess 对 Don’t confess 是 −2 > −3、0 > −1',
    '只剩 (Confess, Confess)，payoff (−2, −2)',
  ];
  cap.forEach((s, k) => { o += gshow(vals.map((v) => v === k), kt, T, text(280, y0 + 3 * ch + 46, s, 't', 'middle')); });
  return svgA(560, y0 + 3 * ch + 56, o, '动图：3×3 的 payoff matrix，第一轮两人都删掉 Suicide，第二轮都删掉 Don’t confess，只剩 Confess, Confess');
}

// ---------- 第 1 站：被 mixed strategy dominate ----------
function mixdom() {
  const sx = lin(0, 1, 70, 310), sy = lin(-1, 2, 226, 36);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -1, y1: 2, xt: [0, [0.5, '0.5'], 1], yt: [[-1, '−1'], 0, [0.5, '½'], 1, 2], grid: true, xl: 'q = P2 选 Left 的 probability' });
  o += text(70, 22, 'P1 各个 strategy 的 expected payoff', 'tb');
  o += path(curve((q) => 3 * q - 1, 0, 1, sx, sy, 2), 'ink') + path(curve((q) => 2 - 3 * q, 0, 1, sx, sy, 2), 'ink');
  o += path(curve(() => 0, 0, 1, sx, sy, 2), 'ink-b') + path(curve(() => 0.5, 0, 1, sx, sy, 2), 'ln');
  o += text(sx(1) + 6, sy(2) + 4, 'U', 'tb') + text(sx(1) + 6, sy(-1) + 4, 'D', 'tb');
  o += text(sx(1) + 6, sy(0) + 4, 'M', 'tb') + text(sx(1) + 6, sy(0.5) + 4, '½U + ½D', 'tl');
  const X = 395;
  o += text(X, 70, 'U 对 Right 只有 −1 < 0', 't') + text(X, 90, 'D 对 Left 只有 −1 < 0', 't');
  o += text(X, 110, '单个都压不住 M', 'ts');
  o += text(X, 148, '½U + ½D 对两边都是 ½', 'tl') + text(X, 168, '整条线都在 M 上方', 'ts');
  o += text(X, 188, '所以 M strictly dominated', 'ts');
  return svg(560, 266, o, 'P1 的 U、D、M 三条 payoff line 和 U、D 各一半的 mixture：mixture 恒为二分之一，整条在 M 的 0 上方');
}

// ---------- 第 2 站：Cournot 的 best-response dynamics（动图） ----------
function brdynA() {
  const br = (q) => (1 - q) / 2;
  const st = [[0.5, 0]];
  let [a, b] = st[0];
  for (let k = 0; k < 8; k++) { if (k % 2 === 0) b = br(a); else a = br(b); st.push([a, b]); }
  const n = st.length, { kt, s, T } = tl(n, { move: 0.7, hold: 0.55, first: 2.2, last: 2.8 });
  const S = s.map((k) => st[k]);
  // 左：两家工厂的 output
  const by = lin(0, 0.5, 236, 76), bw = 46;
  let o = text(110, 22, '两家 firm 当前的 output', 'tb', 'middle');
  o += line(30, by(0), 196, by(0), 'axis');
  for (const v of [0, 0.25, 0.5]) o += line(26, by(v), 30, by(v), 'axis') + text(22, by(v) + 4, frac(v), 'ts', 'end');
  const bar = (x, idx) => {
    const ys = S.map((p) => f1(by(p[idx]))), hs = S.map((p) => f1(by(0) - by(p[idx])));
    return `<rect x="${x}" y="${ys[0]}" width="${bw}" height="${hs[0]}" class="${idx ? 'solid2' : 'solid'}">${anim('y', ys, kt, T)}${anim('height', hs, kt, T)}</rect>`;
  };
  // 工厂轮廓：一排锯齿屋顶
  const factory = (x, lab) => {
    const y = 40;
    const roof = d([[x, y + 20], [x, y + 8], [x + 12, y], [x + 12, y + 8], [x + 24, y], [x + 24, y + 8], [x + 36, y], [x + 36, y + 8], [x + bw, y + 8], [x + bw, y + 20]]) + 'Z';
    return path(roof, 'paper') + text(x + bw / 2, by(0) + 18, lab, 'tb', 'middle');
  };
  o += factory(64, 'Firm 1') + factory(140, 'Firm 2');
  o += bar(64, 0) + bar(140, 1);
  o += line(52, by(1 / 3), 200, by(1 / 3), 'dash') + text(204, by(1 / 3) + 4, '1/3', 'ts');
  // 右：(q1, q2) plane 上的两条 best response line
  const sx = lin(0, 0.6, 290, 510), sy = lin(0, 0.6, 254, 34);
  o += axes({ sx, sy, x0: 0, x1: 0.6, y0: 0, y1: 0.6, xt: [0, [0.25, '¼'], [1 / 3, '⅓'], [0.5, '½']], yt: [[0.25, '¼'], [1 / 3, '⅓'], [0.5, '½']], grid: false, xl: 'q₁' });
  o += text(sx(0) - 4, sy(0.6) - 10, 'q₂', 'ts');
  o += path(d([[sx(0.5), sy(0)], [sx(0.2), sy(0.6)]]), 'ink');
  o += path(d([[sx(0), sy(0.5)], [sx(0.6), sy(0.2)]]), 'ink');
  o += text(sx(0.215) + 8, sy(0.585), 'Firm 1 的 best response', 'ts', 'start');
  o += text(sx(0.327), sy(0.36), 'Firm 2 的 best response', 'ts', 'start');
  // 走过的路：已走的点 + 其余点都叠在当前点上，这样每一段都能线性地画出来
  const pathAt = (k) => d(st.map((p, j) => (j <= k ? p : st[k])).map(([x, y]) => [sx(x), sy(y)]));
  const ds = [];
  for (let i = 0; i < s.length; i++) {
    // 线性插值时，下一个点从当前点出发：用“到达时”的形状
    ds.push(pathAt(s[i]));
  }
  o += apath(ds, kt, T, 'ln');
  o += acircle(S.map((p) => sx(p[0])), S.map((p) => sy(p[1])), kt, T, 5, 'ln-f');
  o += circle(sx(1 / 3), sy(1 / 3), 3.5, 'ink-f');
  // 读数
  const say = (k) => {
    if (k === 0) return '起点：Firm 1 按 monopoly 生产 q₁ = 1/2，Firm 2 还没生产';
    const [p, q] = st[k], [p0, q0] = st[k - 1];
    if (k % 2 === 1) return `第 ${k} 步：Firm 2 对 q₁ = ${frac(p0)} 做 best response，q₂ = (1 − q₁)/2 = ${frac(q)}`;
    return `第 ${k} 步：Firm 1 对 q₂ = ${frac(q0)} 做 best response，q₁ = (1 − q₂)/2 = ${frac(p)}`;
  };
  for (let k = 0; k < n; k++) o += gshow(s.map((j) => j === k), kt, T, text(280, 290, say(k), 't', 'middle'));
  o += text(280, 310, '每一步离 1/3 的距离乘 −1/2：1/6、−1/12、1/24……', 'ts', 'middle');
  return svgA(560, 318, o, '动图：Cournot duopoly 里两家 firm 轮流对对方当前的 output 做 best response，柱高和右边 plane 上的点同步，折线在两条 best response line 之间来回，收敛到 1/3, 1/3');
}

// ---------- 第 3 站：matching pennies 的 best response 转圈（动图） ----------
function cycleA() {
  const x0 = 170, y0 = 50, cw = 130, ch = 64;
  const U = [[[-1, 1], [1, -1]], [[1, -1], [-1, 1]]];
  let o = '';
  const seq = [[0, 0], [1, 0], [1, 1], [0, 1]]; // (H,H) → (T,H) → (T,T) → (H,T)
  const holds = [2.2, 1.4, 1.4, 1.4], { kt, T } = tlD(holds);
  const idx = [0, 1, 2, 3, 3];
  const xs = idx.map((k) => f1(x0 + seq[k][1] * cw + 3)), ys = idx.map((k) => f1(y0 + seq[k][0] * ch + 3));
  o += `<rect x="${xs[0]}" y="${ys[0]}" width="${cw - 6}" height="${ch - 6}" class="wash-strong" rx="4">${anim('x', xs, kt, T, true)}${anim('y', ys, kt, T, true)}</rect>`;
  o += matrix(x0, y0, cw, ch, ['H', 'T'], ['H', 'T'], U);
  o += text(x0 - 10, y0 - 9, 'P1 \\ P2', 'ts', 'end');
  const cx = (c) => x0 + c * cw + cw / 2, cy = (r) => y0 + r * ch + ch / 2;
  // 标注压在格线上时，先垫一块底色，免得线穿过字
  const chip = (x, y, s, anchor) => {
    const w = 46, x1 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
    return `<rect x="${f1(x1 - 2)}" y="${f1(y - 12)}" width="${w + 4}" height="16" class="paper-f"/>` + text(x, y, s, 'ts', anchor);
  };
  o += arrow(cx(0), cy(0) + 12, cx(0), cy(1) - 14, 'ln') + chip(cx(0) - 8, (cy(0) + cy(1)) / 2 + 4, 'P1 改 T', 'end');
  o += arrow(cx(0) + 36, cy(1), cx(1) - 36, cy(1), 'ln') + chip(x0 + cw, cy(1) + 22, 'P2 改 T', 'middle');
  o += arrow(cx(1), cy(1) - 14, cx(1), cy(0) + 12, 'ln') + chip(cx(1) + 8, (cy(0) + cy(1)) / 2 + 4, 'P1 改 H', 'start');
  o += arrow(cx(1) - 36, cy(0), cx(0) + 36, cy(0), 'ln') + chip(x0 + cw, cy(0) - 14, 'P2 改 H', 'middle');
  o += text(452, 92, '每一格都有', 't') + text(452, 112, '一个人想换', 't') + text(452, 140, '没有 pure', 'ts') + text(452, 158, 'Nash equilibrium', 'ts');
  const cap = ['(H, H)：P1 得 −1，改成 T 就得 1', '(T, H)：P2 得 −1，改成 T 就得 1', '(T, T)：P1 得 −1，改成 H 就得 1', '(H, T)：P2 得 −1，改成 H 就得 1，回到起点'];
  cap.forEach((c, k) => { o += gshow(idx.map((j) => j === k), kt, T, text(x0 + cw, y0 + 2 * ch + 34, c, 't', 'middle')); });
  return svgA(560, y0 + 2 * ch + 44, o, '动图：matching pennies 的 2×2 matrix，高亮的格子按 best response 一格一格移动，绕四格转圈，停不下来');
}

// ---------- 第 3 站：tennis 的 indifference（动图） ----------
function tennisA() {
  const uL = (Q) => 50 * Q + 80 * (1 - Q), uR = (Q) => 90 * Q + 20 * (1 - Q);
  // Q 的 keyframe：先停在 0.6，往 1 走，再一路走到 0，回到 0.6（速度恒定 0.25 每秒）
  const keys = [[0, 0.6], [2, 0.6], [3.6, 1], [4.2, 1], [8.2, 0], [8.8, 0], [11.2, 0.6]];
  const T = 11.2, kt = keys.map(([t]) => t / T), Qs = keys.map(([, q]) => q);
  // 左：Serena 的半场
  const cx0 = 40, cw = 200;
  let o = text(cx0 + cw / 2, 16, 'Serena lean l 的 probability Q', 'tb', 'middle');
  const lw = Qs.map((q) => f1(cw * q)), rx = Qs.map((q) => f1(cx0 + cw * q)), rw = Qs.map((q) => f1(cw * (1 - q)));
  o += `<rect x="${cx0}" y="28" width="${lw[0]}" height="18" class="wash-strong">${anim('width', lw, kt, T)}</rect>`;
  o += `<rect x="${rx[0]}" y="28" width="${rw[0]}" height="18" class="wash2">${anim('x', rx, kt, T)}${anim('width', rw, kt, T)}</rect>`;
  o += rect(cx0, 28, cw, 18, 'frame') + text(cx0 - 6, 41, 'l', 'tb', 'end') + text(cx0 + cw + 6, 41, 'r', 'tb', 'start');
  o += rect(cx0, 62, cw, 104, 'frame') + line(cx0 + cw / 2, 62, cx0 + cw / 2, 166, 'grid');
  o += line(cx0 - 8, 166, cx0 + cw + 8, 166, 'ink-b');
  o += text(cx0 + cw / 4, 84, 'backhand 侧', 'ts', 'middle') + text(cx0 + 3 * cw / 4, 84, 'forehand 侧', 'ts', 'middle');
  o += text(cx0 + cw + 12, 170, 'net', 'ts');
  const V = [cx0 + cw / 2, 226], TL = [cx0 + cw / 4, 112], TR = [cx0 + 3 * cw / 4, 112];
  o += circle(V[0], V[1], 6, 'ink-f') + text(V[0] + 12, V[1] + 5, 'Venus', 't');
  o += arrow(V[0], V[1] - 8, TL[0], TL[1], 'mute') + arrow(V[0], V[1] - 8, TR[0], TR[1], 'mute');
  // 当前 best response 的箭头加粗：Q > 0.6 时是 R，Q < 0.6 时是 L，Q = 0.6 时两个一样
  const dk = [0, 2, 5.8, 11.2], dkt = dk.map((t) => t / T);
  o += gshow([1, 0, 1, 1], dkt, T, arrow(V[0], V[1] - 8, TL[0], TL[1], 'ln'));
  o += gshow([1, 1, 0, 0], dkt, T, arrow(V[0], V[1] - 8, TR[0], TR[1], 'ln'));
  o += text(TL[0] - 10, TL[1] + 4, 'L', 'tl', 'end') + text(TR[0] + 10, TR[1] + 4, 'R', 'tl', 'start');
  const brT = ['Q = 0.6：打 L、打 R 胜率都是 62%', 'Q > 0.6：打 R 胜率更高', 'Q < 0.6：打 L 胜率更高', ''];
  [0, 1, 2].forEach((k) => { o += gshow([0, 1, 2, 2].map((j) => j === k), dkt, T, text(cx0 + cw / 2, 258, brT[k], 't', 'middle')); });
  // 右：Venus 两个 pure strategy 的胜率随 Q 变化
  const sx = lin(0, 1, 318, 530), sy = lin(0, 100, 226, 36);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 100, xt: [0, [0.6, '0.6'], 1], yt: [0, 20, 50, [62, '62'], 80, 90], grid: true, xl: 'Q' });
  o += text(318, 18, 'Venus 的胜率（%）', 'tb');
  o += path(curve(uL, 0, 1, sx, sy, 2), 'ink-b') + path(curve(uR, 0, 1, sx, sy, 2), 'ln');
  o += text(sx(0.06), sy(uL(0.06)) - 8, '打 L：80 − 30Q', 'ts', 'start');
  o += text(sx(0.04), sy(uR(0.04)) + 22, '打 R：20 + 70Q', 'ts', 'start');
  o += apath(Qs.map((q) => d([[sx(q), sy(0)], [sx(q), sy(100)]])), kt, T, 'dash');
  o += acircle(Qs.map(sx), Qs.map((q) => sy(uL(q))), kt, T, 4.5, 'ink-f');
  o += acircle(Qs.map(sx), Qs.map((q) => sy(uR(q))), kt, T, 4.5, 'ln-f');
  return svgA(560, 268, o, '动图：Serena lean l 的 probability Q 从 0.6 走到 1 再走到 0，左边是半场上 Venus 打 L 和 R 两个方向，右边是两种打法的胜率；只有 Q 等于 0.6 时两条线交于 62，Venus 才无所谓打哪边');
}

// ---------- 第 3 站：Battle of the sexes 的 best response correspondence ----------
function bos() {
  const sx = lin(0, 1, 70, 280), sy = lin(0, 1, 250, 40);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, [2 / 3, '2/3'], 1], yt: [[1 / 3, '1/3'], 1], xl: 'p = P1 选 Ballet' });
  o += text(sx(0) - 4, sy(1) - 12, 'q = P2 选 Ballet', 'ts');
  o += rect(sx(0), sy(1), sx(1) - sx(0), sy(0) - sy(1), 'frame');
  o += path(d([[sx(0), sy(0)], [sx(0), sy(1 / 3)], [sx(1), sy(1 / 3)], [sx(1), sy(1)]]), 'ln');
  o += path(d([[sx(0), sy(0)], [sx(2 / 3), sy(0)], [sx(2 / 3), sy(1)], [sx(1), sy(1)]]), 'dash');
  o += text(sx(0.3), sy(1 / 3) - 8, 'P1 的 best response', 'tl', 'middle');
  o += text(sx(2 / 3) + 8, sy(0.72), 'P2 的', 't', 'start') + text(sx(2 / 3) + 8, sy(0.72) + 17, 'best response', 't', 'start');
  for (const [p, q] of [[0, 0], [1, 1], [2 / 3, 1 / 3]]) o += circle(sx(p), sy(q), 5.5, 'ink-f');
  const X = 330;
  o += text(X, 60, '三个交点就是三个 Nash equilibrium', 'tb');
  o += text(X, 90, '(1, 1)：(Ballet, Ballet)', 't') + text(X, 108, 'payoff (2, 1)', 'ts');
  o += text(X, 136, '(0, 0)：(Football, Football)', 't') + text(X, 154, 'payoff (1, 2)', 'ts');
  o += text(X, 182, '(2/3, 1/3)：mixed', 't') + text(X, 200, 'payoff (2/3, 2/3)', 'ts');
  o += text(X, 236, '竖段和横段是 indifferent 时的', 'ts') + text(X, 253, '整段 [0, 1]：mixed 补上的部分', 'ts');
  return svg(560, 292, o, '在 p、q 的 unit square 里，P1 的 best response 是先竖后横再竖的折线，P2 的是先横后竖再横的虚线，两者交于 (0,0)、(1,1)、(2/3,1/3) 三点');
}

// ---------- 第 4 站：lower envelope 与 upper envelope ----------
function envelope() {
  const l = (P) => 90 - 40 * P, r = (P) => 20 + 60 * P, rr = (P) => 10 + 80 * P;
  const env = (P) => Math.min(l(P), r(P), rr(P));
  let o = '';
  const sx = lin(0, 1, 52, 250), sy = lin(0, 100, 230, 40);
  o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 100, xt: [0, [0.5, '0.5'], [0.7, '0.7'], 1], yt: [0, 20, 50, [62, '62'], 80, 100], grid: true, xl: 'P = Venus 打 L 的 probability' });
  o += text(52, 16, 'Venus 先定 P，Serena 看着 P 选', 'tb') + text(52, 32, 'Venus 最坏情况下的胜率', 'ts');
  o += path(curve(l, 0, 1, sx, sy, 2), 'mute') + path(curve(r, 0, 1, sx, sy, 2), 'mute') + path(curve(rr, 0, 1, sx, sy, 2), 'dash');
  o += path(curve(env, 0, 1, sx, sy, 400), 'ln');
  o += text(sx(0.04), sy(l(0.04)) + 16, 'Serena 选 l', 'ts', 'start');
  o += text(sx(0.27), sy(r(0.27)) - 8, '选 r', 'ts', 'middle');
  o += text(sx(0.76) - 4, sy(75), '选 rr', 'ts', 'end');
  o += circle(sx(0.7), sy(62), 5, 'ink-f') + text(sx(0.7), sy(62) + 38, 'max = 62', 'tb', 'middle');
  // 右：Serena 先定 Q（只在 l、r 之间）
  const L = (Q) => 80 - 30 * Q, R = (Q) => 20 + 70 * Q, up = (Q) => Math.max(L(Q), R(Q));
  const tx = lin(0, 1, 342, 540);
  o += axes({ sx: tx, sy, x0: 0, x1: 1, y0: 0, y1: 100, xt: [0, [0.6, '0.6'], 1], yt: [[62, '62']], grid: true, xl: 'Q = Serena lean l' });
  o += text(342, 16, 'Serena 先定 Q，Venus 看着 Q 选', 'tb') + text(342, 32, 'Venus 最好情况下的胜率', 'ts');
  o += path(curve(L, 0, 1, tx, sy, 2), 'mute') + path(curve(R, 0, 1, tx, sy, 2), 'mute');
  o += path(curve(up, 0, 1, tx, sy, 400), 'ln');
  o += text(tx(0.03), sy(L(0.03)) - 10, 'Venus 打 L', 'ts', 'start') + text(tx(0.03), sy(R(0.03)) + 16, '打 R', 'ts', 'start');
  o += circle(tx(0.6), sy(62), 5, 'ink-f') + text(tx(0.6), sy(62) + 20, 'min = 62', 'tb', 'middle');
  return svg(560, 268, o, '左图三条线是 Venus 选打 L 的 probability P 时、Serena 三种应对下 Venus 的胜率，彩色 lower envelope 的最高点在 P 等于 0.7、值 62；右图两条线是 Serena 选 Q 时 Venus 两种打法的胜率，upper envelope 最低点在 Q 等于 0.6、值 62');
}

// ---------- 第 5 站：entry game 的 tree 和 strategic form ----------
function entry() {
  let o = '';
  const Rt = [120, 44], Lo = [44, 130], N2 = [196, 130], La = [140, 214], Lf = [252, 214];
  o += line(...Rt, ...Lo, 'ink') + line(...Rt, ...N2, 'ln') + line(...N2, ...La, 'ln') + line(...N2, ...Lf, 'dash');
  o += circle(...Rt, 5, 'ink-f') + circle(...N2, 5, 'ink-f');
  o += text(Rt[0], Rt[1] - 12, 'Entrant', 'tb', 'middle') + text(N2[0] + 12, N2[1] + 4, 'Incumbent', 'tb', 'start');
  o += text((Rt[0] + Lo[0]) / 2 - 8, (Rt[1] + Lo[1]) / 2, 'Out', 't', 'end') + text((Rt[0] + N2[0]) / 2 + 10, (Rt[1] + N2[1]) / 2, 'In', 'tl', 'start');
  o += text((N2[0] + La[0]) / 2 - 8, (N2[1] + La[1]) / 2, 'A', 'tl', 'end') + text((N2[0] + Lf[0]) / 2 + 8, (N2[1] + Lf[1]) / 2, 'F', 't', 'start');
  o += text(Lo[0], Lo[1] + 20, '(1, 2)', 't', 'middle') + text(La[0], La[1] + 20, '(2, 1)', 't', 'middle') + text(Lf[0], Lf[1] + 20, '(0, 0)', 't', 'middle');
  o += text(Lf[0] + 6, Lf[1] - 34, 'F 只得 0', 'ts', 'start') + text(Lf[0] + 6, Lf[1] - 18, '而 A 得 1', 'ts', 'start');
  // 右：strategic form
  const x0 = 380, y0 = 72, cw = 76, ch = 40;
  o += rect(x0, y0, cw, ch, 'wash-strong') + rect(x0 + cw, y0 + ch, cw, ch, 'wash');
  o += matrix(x0, y0, cw, ch, ['In', 'Out'], ['A', 'F'], [[[2, 1], [0, 0]], [[1, 2], [1, 2]]]);
  o += text(x0 + cw, 36, 'strategic form', 'tb', 'middle');
  o += text(x0 + cw, y0 + 2 * ch + 24, '两格都是 Nash equilibrium', 'ts', 'middle');
  o += text(x0 + cw, y0 + 2 * ch + 42, '深色格 (In, A) 才是 SPE', 'ts', 'middle');
  return svg(560, 250, o, 'Entry game：entrant 选 Out 得 1、2，选 In 后 incumbent 选 A 得 2、1，选 F 得 0、0；右边是同一个 game 的 2×2 strategic form，两个 Nash equilibrium 中只有 In、A 是 subgame perfect');
}

// ---------- 第 5 站：在 game tree 上做 backward induction（动图） ----------
function backwardA() {
  const leaves = [[3, 1], [2, 4], [0, 3], [2, 2], [5, 0], [0, 1], [1, 2], [0, 3]];
  const act3 = [['x', 'y'], ['x', 'y'], ['x', 'y'], ['x', 'y']], act2 = [['a', 'b'], ['c', 'd']];
  const LX = (k) => 52 + 64 * k, Y = [56, 116, 176, 234];
  const n3 = [0, 1, 2, 3].map((k) => (LX(2 * k) + LX(2 * k + 1)) / 2), n2 = [0, 1].map((k) => (n3[2 * k] + n3[2 * k + 1]) / 2), n1 = (n2[0] + n2[1]) / 2;
  // backward induction：第 3 层 player 1 比左数，第 2 层 player 2 比右数，root player 1 比左数
  const v3 = [0, 1, 2, 3].map((k) => { const a = leaves[2 * k], b = leaves[2 * k + 1]; return a[0] >= b[0] ? [0, a] : [1, b]; });
  const v2 = [0, 1].map((k) => { const a = v3[2 * k][1], b = v3[2 * k + 1][1]; return a[1] >= b[1] ? [0, a] : [1, b]; });
  const v1 = v2[0][1][0] >= v2[1][1][0] ? [0, v2[0][1]] : [1, v2[1][1]];
  if (pay(...v1[1]) !== '(2, 2)') throw new Error('backward induction 结果不对');
  // 解的顺序：第 3 层四个 node，第 2 层两个，root
  const lv = [7, 0, 1, 2, 3, 4, 5, 6, 7], { kt, T } = tlD([4, 1.6, 1.3, 1.3, 1.3, 1.6, 1.5, 1.7, 4]);
  const vals = [...lv, 7];
  const after = (k) => vals.map((v) => v > k);
  let o = '';
  o += text(4, Y[0] + 4, 'Player 1', 'tb') + text(4, Y[1] + 4, 'Player 2', 'tb') + text(4, Y[2] + 4, 'Player 1', 'tb');
  const edge = (x1, y1, x2, y2, lab, left, solvedAt, chosen) => {
    let q = line(x1, y1, x2, y2, 'ink');
    if (chosen) q += gshow(after(solvedAt), kt, T, line(x1, y1, x2, y2, 'ln'));
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    q += text(mx + (left ? -8 : 8), my - 4, lab, 'ts', left ? 'end' : 'start');
    return q;
  };
  // 第 3 层的 edge
  for (let k = 0; k < 4; k++) for (let j = 0; j < 2; j++) o += edge(n3[k], Y[2], LX(2 * k + j), Y[3], act3[k][j], j === 0, k, v3[k][0] === j);
  for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) o += edge(n2[k], Y[1], n3[2 * k + j], Y[2], act2[k][j], j === 0, 4 + k, v2[k][0] === j);
  for (let j = 0; j < 2; j++) o += edge(n1, Y[0], n2[j], Y[1], ['L', 'R'][j], j === 0, 6, v1[0] === j);
  for (let k = 0; k < 8; k++) o += circle(LX(k), Y[3], 2.5, 'ink-f') + text(LX(k), Y[3] + 18, pay(...leaves[k]), 't', 'middle');
  const node = (x, y) => circle(x, y, 5, 'ink-f');
  const box = (x, y, v, solvedAt) => gshow(after(solvedAt), kt, T, rect(x - 23, y - 11, 46, 22, 'paper', 5) + text(x, y + 5, pay(...v), 'tb', 'middle'));
  n3.forEach((x, k) => { o += node(x, Y[2]) + box(x, Y[2], v3[k][1], k); });
  n2.forEach((x, k) => { o += node(x, Y[1]) + box(x, Y[1], v2[k][1], 4 + k); });
  o += node(n1, Y[0]) + box(n1, Y[0], v1[1], 6);
  const cap = [
    '从最底下一层 decision node 开始',
    '第 3 层：Player 1 比较两片 leaf 上自己的 payoff（左边的数）',
    '第 3 层：Player 1 比较两片 leaf 上自己的 payoff（左边的数）',
    '第 3 层：Player 1 比较两片 leaf 上自己的 payoff（左边的数）',
    '第 3 层：四个 node 都换成了 box 里的结果',
    '第 2 层：Player 2 比较两个 box 里自己的 payoff（右边的数）',
    '第 2 层：Player 2 比较两个 box 里自己的 payoff（右边的数）',
    'Root：Player 1 比较 L 的 2 和 R 的 1，选 L；结果是 (2, 2)',
  ];
  cap.forEach((c, k) => { o += gshow(vals.map((v) => v === k), kt, T, text(280, 280, c, 't', 'middle')); });
  o += text(280, 300, '彩线：该 node 上 mover 的选择；box：把这棵 subgame 换成它的结果', 'ts', 'middle');
  return svgA(560, 306, o, '动图：一棵三层的 game tree，backward induction 从第三层的四个 node 开始，每个 node 选出 mover 更喜欢的分支并换成一个 payoff box，再到第二层两个 node，最后 root 选 L，结果是 2、2');
}

// ---------- 第 5 站：带 information set 的 tree ----------
function subgame() {
  let o = '';
  const Rt = [150, 40], Out = [60, 110], N1 = [240, 110], A = [170, 180], B = [310, 180];
  const lf = [[130, 250], [210, 250], [270, 250], [350, 250]];
  o += line(...Rt, ...Out, 'ink') + line(...Rt, ...N1, 'ink') + line(...N1, ...A, 'ink') + line(...N1, ...B, 'ink');
  o += line(...A, ...lf[0], 'ink') + line(...A, ...lf[1], 'ink') + line(...B, ...lf[2], 'ink') + line(...B, ...lf[3], 'ink');
  o += `<rect x="150" y="166" width="180" height="28" rx="14" class="dash"/>`;
  o += rect(112, 92, 308, 196, 'frame', 10);
  for (const p of [Rt, N1, A, B]) o += circle(...p, 5, 'ink-f');
  o += text(Rt[0], Rt[1] - 12, 'P1', 'tb', 'middle') + text(N1[0] + 10, N1[1] - 4, 'P1', 'tb', 'start');
  o += text(338, 178, 'P2 的', 'tb', 'start') + text(338, 195, 'information set', 'ts', 'start');
  o += text((Rt[0] + Out[0]) / 2 - 6, (Rt[1] + Out[1]) / 2, 'Out', 't', 'end') + text((Rt[0] + N1[0]) / 2 + 8, (Rt[1] + N1[1]) / 2, 'In', 't', 'start');
  o += text(Out[0], Out[1] + 20, '(1.5, 1.5)', 't', 'middle');
  o += text((N1[0] + A[0]) / 2 - 6, (N1[1] + A[1]) / 2, 'B', 'ts', 'end') + text((N1[0] + B[0]) / 2 + 6, (N1[1] + B[1]) / 2, 'F', 'ts', 'start');
  const labs = ['B', 'F', 'B', 'F'], ps = [[2, 1], [0, 0], [0, 0], [1, 2]];
  lf.forEach((p, k) => {
    const par = k < 2 ? A : B, left = k % 2 === 0;
    o += text((par[0] + p[0]) / 2 + (left ? -6 : 6), (par[1] + p[1]) / 2 + 4, labs[k], 'ts', left ? 'end' : 'start');
    o += text(p[0], p[1] + 20, pay(...ps[k]), 't', 'middle');
  });
  o += text(120, 110, 'In 之后的 subgame', 'ts', 'start');
  const X = 432;
  o += text(X, 44, 'subgame 的三个 NE', 'tb');
  o += text(X, 72, '(B, B) → (2, 1)', 't') + text(X, 90, '2 > 1.5：P1 选 In', 'ts');
  o += text(X, 118, '(F, F) → (1, 2)', 't') + text(X, 136, '1 < 1.5：P1 选 Out', 'ts');
  o += text(X, 164, 'mixed → (2/3, 2/3)', 't') + text(X, 182, '2/3 < 1.5：P1 选 Out', 'ts');
  o += text(X, 214, '一共三个 SPE', 'tb');
  return svg(560, 296, o, 'P1 先选 Out 得 1.5、1.5 或 In；In 之后两人同时玩 battle of the sexes，P2 的两个 node 在同一个 information set 里，用虚线圈住；外框是 In 之后的 subgame');
}

// ---------- 第 6 站：feasible 与 individually rational payoff ----------
function folk() {
  const sx = lin(0, 4.5, 60, 300), sy = lin(0, 4.5, 260, 20);
  let o = axes({ sx, sy, x0: 0, x1: 4.5, y0: 0, y1: 4.5, xt: [0, 1, 2, 3, 4], yt: [1, 2, 3, 4], xl: 'Player 1 的 average payoff' });
  o += text(sx(0) - 4, sy(4.5) - 10, 'Player 2', 'ts');
  const hull = [[2, 2], [4, 1], [3, 3], [1, 4]], ir = [[2, 2], [3.5, 2], [3, 3], [2, 3.5]];
  const P = (pts) => pts.map(([a, b]) => [sx(a), sy(b)]);
  o += poly(P(hull), 'wash') + poly(P(ir), 'wash-strong');
  o += path(d(P([...hull, hull[0]])), 'ink');
  o += line(sx(2), sy(0), sx(2), sy(4.4), 'dash') + line(sx(0), sy(2), sx(4.4), sy(2), 'dash');
  const lab = [[[3, 3], '(C, C)', 8, -6, 'start'], [[4, 1], '(D, C)', 8, 4, 'start'], [[1, 4], '(C, D)', -8, -4, 'end'], [[2, 2], '(D, D)', -8, 16, 'end']];
  for (const [[a, b], s, dx, dy, an] of lab) o += circle(sx(a), sy(b), 4.5, 'ink-f') + text(sx(a) + dx, sy(b) + dy, s, 'tb', an);
  o += text(sx(0) + 6, sy(2) - 6, 'minmax = 2', 'ts', 'start');
  const X = 340;
  o += text(X, 50, '浅色：feasible', 'tb') + text(X, 68, '四个 pure outcome 的 convex hull', 'ts');
  o += text(X, 104, '深色：再加上两人都 > 2', 'tl') + text(X, 122, '即 strictly individually rational', 'ts');
  o += text(X, 158, 'Folk theorem：δ 够接近 1 时，', 't') + text(X, 176, '深色里的 payoff 都能由', 't') + text(X, 194, 'equilibrium 维持', 't');
  o += text(X, 228, '(3, 3) 需要 δ ≥ 1/2', 'ts');
  return svg(560, 300, o, '两人 average payoff 的 plane：四个 pure outcome 围成的 quadrilateral 是 feasible set，其中两人都大于 minmax 2 的部分是 strictly individually rational 的区域，顶点为 (2,2)、(3.5,2)、(3,3)、(2,3.5)');
}

// ---------- 第 7 站：Nature 先抽 type ----------
function bayesbos() {
  let o = '';
  const Nn = [280, 30];
  o += circle(...Nn, 6, 'paper') + text(Nn[0], Nn[1] - 12, 'Nature', 'tb', 'middle');
  const cw = 76, ch = 34, xa = 100, xb = 350, y0 = 130;
  o += arrow(Nn[0] - 8, Nn[1] + 5, xa + cw, 76, 'ink') + arrow(Nn[0] + 8, Nn[1] + 5, xb + cw, 76, 'ink');
  o += text(212, 50, '½', 't', 'end') + text(348, 50, '½', 't', 'start');
  const M1 = [[[2, 1], [0, 0]], [[0, 0], [1, 2]]], M2 = [[[2, 0], [0, 2]], [[0, 1], [1, 0]]];
  o += rect(xa, y0, cw, ch, 'wash-strong') + rect(xb + cw, y0, cw, ch, 'wash-strong');
  o += matrix(xa, y0, cw, ch, ['B', 'F'], ['B', 'F'], M1) + matrix(xb, y0, cw, ch, ['B', 'F'], ['B', 'F'], M2);
  o += text(xa + cw, 104, 'P2 想见面', 'tb', 'middle') + text(xb + cw, 104, 'P2 想避开', 'tb', 'middle');
  o += rect(40, 84, 480, 128, 'dash', 10);
  o += text(280, 232, '虚线框：P1 分不清是哪一张表；P2 知道', 'ts', 'middle');
  o += text(280, 250, '深色格是 Bayesian Nash equilibrium (B, (B, F)) 在两种 type 下实际走到的格子', 'ts', 'middle');
  return svg(560, 258, o, 'Nature 以各一半的 probability 选出 P2 的 type：想见面时是普通的 battle of the sexes，想避开时 P2 的 payoff 反过来；P1 不知道是哪张表');
}

// ---------- 第 7 站：Cournot with private cost ----------
function bayescournot() {
  const sx = lin(0, 0.75, 60, 300), sy = lin(0, 0.7, 260, 24);
  let o = axes({ sx, sy, x0: 0, x1: 0.75, y0: 0, y1: 0.7, xt: [0, [0.25, '¼'], [1 / 3, '⅓'], [5 / 12, '5/12'], [0.5, '½']], yt: [[1 / 6, '1/6'], [1 / 3, '⅓'], [0.5, '½']], xl: 'q₁' });
  o += text(sx(0) - 4, sy(0.7) - 8, 'q₂', 'ts');
  const L = (q) => (1.25 - q) / 2, H = (q) => (0.75 - q) / 2;
  o += path(curve(L, 0, 0.75, sx, sy, 2), 'ink') + path(curve(H, 0, 0.75, sx, sy, 2), 'ink');
  o += path(d([[sx(0.5), sy(0)], [sx(0.15), sy(0.7)]]), 'ln');
  o += text(sx(0.75), sy(L(0.6)) - 9, 'low cost', 'ts', 'end');
  o += text(sx(0.75), sy(H(0.6)) - 7, 'high cost', 'ts', 'end');
  o += text(sx(0.17) + 8, sy(0.68), 'Firm 1 对 E[q₂] 的 best response', 'tl', 'start');
  o += line(sx(1 / 3), sy(0), sx(1 / 3), sy(0.62), 'dash');
  // complete information 的两个 NE（空心）与 Bayesian NE（实心）
  const qL = 11 / 24, qH = 5 / 24;
  o += circle(sx(0.25), sy(0.5), 4.5, 'paper') + circle(sx(5 / 12), sy(1 / 6), 4.5, 'paper');
  o += circle(sx(1 / 3), sy(qL), 4.5, 'ink-f') + circle(sx(1 / 3), sy(qH), 4.5, 'ink-f') + circle(sx(1 / 3), sy(1 / 3), 4.5, 'ln-f');
  o += text(sx(1 / 3) + 8, sy(qL) - 8, '11/24', 'ts', 'start') + text(sx(1 / 3) - 6, sy(qH) + 18, '5/24', 'ts', 'end');
  const X = 340;
  o += text(X, 50, '空心点：Firm 1 知道 cost 时', 'tb') + text(X, 68, '两种情形各自的 NE', 'ts');
  o += text(X, 100, '实心点：Bayesian NE', 'tb') + text(X, 118, 'Firm 1 只能选一个 q₁ = 1/3', 'ts');
  o += text(X, 136, '两种 type 各自对它做 best response', 'ts');
  o += text(X, 168, '彩色点是两个 type 的平均 1/3', 'tl') + text(X, 186, '正好落在 Firm 1 的 best response 上', 'ts');
  o += text(X, 222, 'low cost：11/24 < 1/2，少生产', 'ts') + text(X, 240, 'high cost：5/24 > 1/6，多生产', 'ts');
  return svg(560, 290, o, '在 q1、q2 plane 上画出 firm 2 两种 cost 下的 best response line 和 firm 1 对 q2 的 expected value 的 best response line；complete information 的 NE 是空心点，Bayesian NE 时 q1 等于 1/3，两种 type 分别是 11/24 和 5/24');
}

// ---------- 第 8 站：Shapley value 的六种到达顺序 ----------
function orders() {
  const v = (S) => { const k = [...S].sort().join(''); return { '12': 100, '13': 80, '123': 100 }[k] ?? 0; };
  const perms = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
  const tot = { 1: 0, 2: 0, 3: 0 };
  let o = text(40, 20, '6 种到达顺序，每人带来的 marginal contribution', 'tb');
  const bw = 78, gap = 22, x0 = 40, y0 = 36, rh = 32;
  perms.forEach((pm, r) => {
    const S = [];
    pm.forEach((i, c) => {
      const before = v(S); S.push(i); const m = v(S) - before; tot[i] += m;
      const x = x0 + c * (bw + gap), y = y0 + r * rh;
      o += rect(x, y, bw, 24, m > 0 ? 'wash' : 'frame', 5) + rect(x, y, bw, 24, 'frame', 5);
      o += text(x + 10, y + 17, 'P' + i, 'tb') + text(x + bw - 10, y + 17, '+' + m, m > 0 ? 'tl' : 'ts', 'end');
      if (c < 2) o += arrow(x + bw + 3, y + 12, x + bw + gap - 3, y + 12, 'mute', 5);
    });
  });
  const X = 360;
  o += text(X, 58, 'v(12) = 100', 't') + text(X, 78, 'v(13) = 80', 't') + text(X, 98, 'v(123) = 100', 't') + text(X, 118, '其余 coalition 为 0', 'ts');
  o += text(X, 154, '每一行三个数加起来', 'ts') + text(X, 172, '都是 v(123) = 100', 'ts');
  const yy = y0 + 6 * rh + 22;
  const fmt = (t) => `${t} / 6 = ${t / 2}/3 ≈ ${(t / 6).toFixed(1)}`;
  o += text(x0, yy, 'P1：(0 + 0 + 100 + 100 + 80 + 100) / 6 = ' + fmt(tot[1]).split(' = ').slice(1).join(' = '), 't');
  o += text(x0, yy + 20, 'P2：(100 + 20 + 0 + 0 + 20 + 0) / 6 = ' + fmt(tot[2]).split(' = ').slice(1).join(' = '), 't');
  o += text(x0, yy + 40, 'P3：(0 + 80 + 0 + 0 + 0 + 0) / 6 = ' + fmt(tot[3]).split(' = ').slice(1).join(' = '), 't');
  if (tot[1] !== 380 || tot[2] !== 140 || tot[3] !== 80) throw new Error('Shapley 数字不对');
  return svg(560, yy + 48, o, '三个 player 的六种到达顺序，每个方框写出该 player 到达时让 coalition 的 value 增加了多少；对每个人取平均得到 Shapley value 190/3、70/3、40/3');
}

// ---------- 第 8 站：core 与 Shapley value 在 simplex 上 ----------
function core() {
  const A = [170, 34], B = [44, 252], C = [296, 252];
  const P = ([x1, x2, x3]) => [(x1 * A[0] + x2 * B[0] + x3 * C[0]) / 100, (x1 * A[1] + x2 * B[1] + x3 * C[1]) / 100];
  let o = poly([A, B, C], 'wash2');
  // x2 ≤ 20 的一侧（x1 + x3 ≥ 80）
  o += poly([P([80, 20, 0]), P([0, 20, 80]), C, A], 'wash');
  o += poly([A, B, C], 'ink');
  o += path(d([P([80, 20, 0]), P([0, 20, 80])]), 'dash');
  o += path(d([A, P([80, 20, 0])]), 'ln');
  for (const p of [A, P([80, 20, 0])]) o += circle(...p, 4, 'ln-f');
  const sh = P([190 / 3, 70 / 3, 40 / 3]);
  o += circle(...sh, 5, 'ink-f') + text(sh[0] - 9, sh[1] + 5, 'Shapley', 'tb', 'end');
  o += text(A[0], A[1] - 10, '(100, 0, 0)', 'ts', 'middle') + text(B[0] - 4, B[1] + 18, '(0, 100, 0)', 'ts', 'start') + text(C[0] + 4, C[1] + 18, '(0, 0, 100)', 'ts', 'end');
  const q = P([80, 20, 0]);
  o += text(q[0] - 8, q[1] + 4, '(80, 20, 0)', 'ts', 'end');
  const md = P([50, 20, 30]);
  o += text(md[0] + 10, md[1] - 8, 'x₂ = 20', 'ts', 'start');
  o += text((A[0] + B[0]) / 2 - 30, (A[1] + B[1]) / 2 + 10, 'x₃ = 0', 'ts', 'end');
  const X = 340;
  o += text(X, 50, '三角形：所有 x₁ + x₂ + x₃ = 100', 'ts') + text(X, 68, '的 nonnegative 分法', 'ts');
  o += text(X, 100, '{1, 2} 不 block：x₃ = 0', 't') + text(X, 118, '只剩左边那条边', 'ts');
  o += text(X, 150, '{1, 3} 不 block：x₂ ≤ 20', 't') + text(X, 168, '浅色一侧', 'ts');
  o += text(X, 200, 'Core：彩色线段', 'tl') + text(X, 218, 'price x₁ 在 80 到 100 之间', 'ts');
  o += text(X, 250, 'Shapley (63.3, 23.3, 13.3)', 't') + text(X, 268, '不在 core 里：{1, 2} 只分到 86.7', 'ts');
  return svg(560, 278, o, '三个 player 分 100 的所有方法构成一个三角形；core 是 x3 等于 0 且 x2 不超过 20 的一段边，从 (100,0,0) 到 (80,20,0)；Shapley value 63.3、23.3、13.3 落在三角形内部，不在 core 上');
}

// ---------- 第 2 站：homogeneous Bertrand 没有 best response ----------
function bertrand() {
  const a = 2, c = 1, pj = 1.4;
  const mono = (p) => (p - c) * (a - p);
  const prof = (p) => (p < pj ? mono(p) : p === pj ? mono(p) / 2 : 0);
  // 核对正文里的数
  const chk = [[1.39, 0.2379], [1.399, 0.239799], [1.4, 0.12]];
  for (const [p, v] of chk) if (Math.abs(prof(p) - v) > 1e-9) throw new Error('bertrand 数字不对');
  const sx = lin(1, 2, 60, 330), sy = lin(0, 0.3, 250, 30);
  let o = axes({ sx, sy, x0: 1, x1: 2, y0: 0, y1: 0.3, xt: [[1, 'c = 1'], [1.4, '1.4'], [1.5, '1.5'], [2, '2']], yt: [[0.12, '0.12'], [0.24, '0.24']], grid: true, xl: 'firm i 的 price pᵢ' });
  o += text(60, 16, 'pⱼ = 1.4 时 firm i 的 profit', 'tb');
  o += path(curve(mono, pj, 2, sx, sy, 120), 'dash');
  o += path(curve(mono, 1, pj - 1e-6, sx, sy, 160), 'ln');
  o += line(sx(pj), sy(0), sx(2), sy(0), 'ln');
  o += line(sx(pj), sy(0), sx(pj), sy(0.29), 'dash');
  o += circle(sx(pj), sy(mono(pj)), 4.5, 'paper') + circle(sx(pj), sy(mono(pj) / 2), 4.5, 'ln-f');
  o += text(sx(1.62), sy(mono(1.62)) - 8, '独占时的 profit', 'ts', 'start');
  o += text(sx(1.04), sy(0.03), 'pᵢ < 1.4：独占', 'ts', 'start');
  o += text(sx(pj) + 8, sy(mono(pj) / 2) + 4, '相等：分一半', 'ts', 'start');
  o += text(sx(1.72), sy(0) - 8, '更贵：卖不出去', 'ts', 'middle');
  const X = 370;
  o += text(X, 60, '空心点 0.24 是 sup', 'tb') + text(X, 78, '从左边无限逼近，取不到', 'ts');
  o += text(X, 110, 'pᵢ = 1.39：0.2379', 't') + text(X, 128, 'pᵢ = 1.399：0.239799', 't') + text(X, 146, 'pᵢ = 1.4：0.12', 't');
  o += text(X, 182, '没有最大值，', 'tl') + text(X, 200, '所以没有 best response', 'tl');
  return svg(560, 282, o, 'a 等于 2、c 等于 1、对方定价 1.4 时，firm i 的 profit 随自己 price 的变化：低于 1.4 时沿着独占的 profit 曲线上升，逼近 0.24；恰好 1.4 时只有一半 0.12；高于 1.4 时为 0');
}

// ---------- 第 8 站：SPE 排除不了的 L（14.12 Figure 16.2） ----------
function pbetree() {
  const leaf = { X: [2, 6], TL: [0, 1], TR: [3, 2], BL: [-1, 3], BR: [1, 5] };
  // 核对：在 information set 上 R 对每个 μ 都更好
  for (const mu of [0, 0.5, 1]) {
    const L = mu * leaf.TL[1] + (1 - mu) * leaf.BL[1], R = mu * leaf.TR[1] + (1 - mu) * leaf.BR[1];
    if (!(R - L > 0)) throw new Error('pbetree 数字不对');
  }
  let o = '';
  const Rt = [170, 40], Xl = [50, 118], T = [120, 132], B = [240, 132];
  const lv = { TL: [80, 222], TR: [160, 222], BL: [200, 222], BR: [280, 222] };
  o += line(...Rt, ...Xl, 'ink') + line(...Rt, ...T, 'ln') + line(...Rt, ...B, 'ink');
  o += line(...T, ...lv.TL, 'ink') + line(...T, ...lv.TR, 'ln') + line(...B, ...lv.BL, 'ink') + line(...B, ...lv.BR, 'ln');
  o += `<rect x="96" y="116" width="168" height="32" rx="16" class="dash"/>`;
  for (const p of [Rt, T, B]) o += circle(...p, 5, 'ink-f');
  o += text(Rt[0], Rt[1] - 12, 'P1', 'tb', 'middle');
  o += text(180, 108, 'P2', 'tb', 'middle');
  o += text((Rt[0] + Xl[0]) / 2 - 6, (Rt[1] + Xl[1]) / 2, 'X', 't', 'end');
  o += text((Rt[0] + T[0]) / 2 - 6, (Rt[1] + T[1]) / 2 + 2, 'T', 'tl', 'end') + text((Rt[0] + B[0]) / 2 + 6, (Rt[1] + B[1]) / 2 + 2, 'B', 't', 'start');
  o += text(Xl[0], Xl[1] + 20, pay(...leaf.X), 't', 'middle');
  o += text(T[0], T[1] + 66, '[μ]', 'ts', 'middle') + text(B[0], B[1] + 66, '[1 − μ]', 'ts', 'middle');
  for (const [k, [x, y]] of Object.entries(lv)) {
    const par = k[0] === 'T' ? T : B, left = k[1] === 'L';
    o += text((par[0] + x) / 2 + (left ? -5 : 5), (par[1] + y) / 2 + 12, left ? 'L' : 'R', left ? 'ts' : 'tl', left ? 'end' : 'start');
    o += text(x, y + 20, pay(...leaf[k]), 't', 'middle');
  }
  const Xc = 330;
  o += text(Xc, 50, 'P2 在 information set 上', 'tb');
  o += text(Xc, 76, 'L：μ · 1 + (1 − μ) · 3 = 3 − 2μ', 't');
  o += text(Xc, 98, 'R：μ · 2 + (1 − μ) · 5 = 5 − 3μ', 't');
  o += text(Xc, 124, 'R − L = 2 − μ ≥ 1', 'tl');
  o += text(Xc, 150, '任何 belief 下 R 都更好', 'ts');
  o += text(Xc, 184, '(X, L)：是 SPE，不是 PBE', 't');
  o += text(Xc, 206, '(T, R)，μ = 1：唯一的 PBE', 'tl');
  return svg(560, 252, o, 'P1 在 X、T、B 中选，X 结束得 2、6；T、B 之后 P2 在同一个 information set 上选 L 或 R；右边算出 P2 在任何 belief 下 R 都比 L 好，彩线是唯一的 PBE：T 和 R');
}

// ---------- 第 8 站：signaling game 的 tree（Tutorial 8 Ex 4 和 Beer–Quiche 共用） ----------
// pay[type][msg][act] = [sender, receiver]；type 0 在上，msg 0 在左，act 0 在外侧上方
function sigTree({ types, prior, msgs, acts, P, belL, belR }) {
  const N = [280, 148], S = [[280, 72], [280, 224]], RX = [158, 402], LX = [70, 490];
  let o = '';
  o += circle(...N, 6, 'paper') + text(N[0] + 12, N[1] + 5, 'Nature', 'tb', 'start');
  for (let t = 0; t < 2; t++) {
    o += line(N[0], N[1] + (t ? 6 : -6), S[t][0], S[t][1] + (t ? -5 : 5), 'ink');
    o += text(N[0] - 8, (N[1] + S[t][1]) / 2 + 4, prior[t], 'ts', 'end');
    o += circle(...S[t], 5, 'ink-f') + text(S[t][0], S[t][1] + (t ? 22 : -12), types[t], 'tb', 'middle');
  }
  // receiver 的 information set
  for (let m = 0; m < 2; m++) o += line(RX[m], S[0][1], RX[m], S[1][1], 'dash');
  o += text(RX[0] - 10, N[1] + 4, 'Receiver', 'ts', 'end') + text(RX[1] + 10, N[1] + 4, 'Receiver', 'ts', 'start');
  const bel = [belL, belR];
  const node = (t, m) => [RX[m], S[t][1]];
  const leafPt = (t, m, a) => [LX[m], S[t][1] + (a ? 32 : -32)];
  for (let t = 0; t < 2; t++) for (let m = 0; m < 2; m++) {
    const [x, y] = node(t, m);
    o += line(...S[t], x, y, 'ink');
    o += text((S[t][0] + x) / 2, y - 7, msgs[m], 'ts', 'middle');
    for (let a = 0; a < 2; a++) {
      const [lx, ly] = leafPt(t, m, a);
      o += line(x, y, lx, ly, 'ink');
      o += text((x + lx) / 2 + (m ? 6 : -6), (y + ly) / 2 + (a ? 16 : -10), acts[a], 'ts', m ? 'start' : 'end');
      o += text(lx + (m ? 6 : -6), ly + 5, pay(...P[t][m][a]), 't', m ? 'start' : 'end');
    }
    o += circle(x, y, 4.5, 'ink-f');
    o += text(x + (m ? -8 : 8), y + (t ? 18 : -10), bel[m][t], 'ts', m ? 'end' : 'start');
  }
  // 高亮：sender 的 message 选择 snd[t]，receiver 在 message m 之后的 action rec[m]（null 表示不画）
  const hi = (snd, rec, cls = 'ln', offCls = 'ln-dash') => {
    let h = '';
    for (let t = 0; t < 2; t++) h += line(...S[t], ...node(t, snd[t]), cls);
    for (let m = 0; m < 2; m++) {
      if (rec[m] == null) continue;
      const on = snd.includes(m);
      for (let t = 0; t < 2; t++) h += line(...node(t, m), ...leafPt(t, m, rec[m]), on ? cls : offCls);
    }
    return h;
  };
  return { o, hi };
}

// 逐个 sender strategy 找 PBE：返回 [{snd, rec, ok, why}]
function solveSig(prior, P) {
  const res = [];
  for (const snd of [[0, 0], [0, 1], [1, 0], [1, 1]]) {
    const rec = [null, null];
    for (let m = 0; m < 2; m++) {
      const ts = [0, 1].filter((t) => snd[t] === m);
      if (!ts.length) continue;
      const tot = ts.reduce((s, t) => s + prior[t], 0);
      const ev = (a) => ts.reduce((s, t) => s + (prior[t] / tot) * P[t][m][a][1], 0);
      rec[m] = ev(0) >= ev(1) ? 0 : 1;
    }
    // path 外的 message：找一个 receiver action 让所有 type 都不偏离
    const off = [0, 1].find((m) => rec[m] == null);
    let ok = false, offAct = null;
    const stays = (r) => [0, 1].every((t) => P[t][snd[t]][r[snd[t]]][0] >= P[t][1 - snd[t]][r[1 - snd[t]]][0]);
    if (off == null) ok = stays(rec);
    else for (const a of [0, 1]) { const r = rec.slice(); r[off] = a; if (stays(r)) { ok = true; offAct = a; } }
    res.push({ snd, rec, ok, off, offAct });
  }
  return res;
}

function signalA() {
  const P = [[[[1, 2], [2, 0]], [[0, 1], [3, 0]]], [[[0, 0], [3, 1]], [[1, 0], [2, 2]]]];
  const prior = [0.5, 0.5];
  const sol = solveSig(prior, P);
  const okOnes = sol.filter((s) => s.ok);
  if (okOnes.length !== 1 || okOnes[0].snd.join('') !== '11' || okOnes[0].offAct !== 0) throw new Error('signaling 的解不对');
  const { o: base, hi } = sigTree({ types: ['t₁', 't₂'], prior: ['½', '½'], msgs: ['L', 'R'], acts: ['u', 'd'], P, belL: ['[p]', '[1 − p]'], belR: ['[q]', '[1 − q]'] });
  // 顺序：RR（答案）、LL、LR、RL、RR
  const order = [[1, 1], [0, 0], [0, 1], [1, 0], [1, 1]];
  const holds = [4.5, 3.6, 3.6, 3.6, 3.2], { kt, T } = tlD(holds);
  const idx = [0, 1, 2, 3, 4, 4];
  let o = base;
  const caps = {
    '11': ['RR：q = ½ ≤ ⅔，R 之后选 d；t₁ 得 3，t₂ 得 2', 'L 在 path 外：取 p ≥ ⅓，L 之后选 u，t₂ 改发 L 只得 0。是 PBE'],
    '00': ['LL：p = ½ ≥ ⅓，L 之后选 u；t₂ 只得 0', 't₂ 改发 R，遇到 u 得 1，遇到 d 得 2。不是 PBE'],
    '01': ['LR：p = 1，L 之后选 u；q = 0，R 之后选 d', 't₁ 只得 1，改发 R 会遇到 d，得 3。不是 PBE'],
    '10': ['RL：p = 0，L 之后选 d；q = 1，R 之后选 u', 't₁ 只得 0，改发 L 会遇到 d，得 2。不是 PBE'],
  };
  order.forEach((snd, k) => {
    const s = sol.find((x) => x.snd.join('') === snd.join(''));
    const rec = s.rec.slice();
    if (s.ok && s.off != null) rec[s.off] = s.offAct;
    const on = idx.map((j) => j === k || (k === 0 && j === 4));
    if (k === 4) return;
    o += gshow(on, kt, T, hi(snd, rec));
    const key = snd.join('');
    o += gshow(on, kt, T, text(280, 292, caps[key][0], 't', 'middle') + text(280, 312, caps[key][1], 'ts', 'middle'));
  });
  return svgA(560, 320, o, '动图：signaling game 的 tree，Nature 在中间抽出 t1 或 t2，sender 向左发 L 或向右发 R，receiver 在左右两个 information set 上选 u 或 d；依次检查 RR、LL、LR、RL 四个 sender strategy，只有 RR 配上 L 之后 u、R 之后 d 是 PBE');
}

function beer() {
  // type：strong（上）、weak（下）；msg：Beer（左）、Quiche（右）；act：duel（上）、不 duel（下）
  const P = [[[[1, 0], [3, 1]], [[0, 0], [2, 1]]], [[[0, 1], [2, 0]], [[1, 1], [3, 0]]]];
  const sol = solveSig([0.9, 0.1], P);
  const ok = sol.filter((s) => s.ok).map((s) => s.snd.join(''));
  if (ok.join(',') !== '00,11') throw new Error('Beer–Quiche 的解不对');
  const { o: base, hi } = sigTree({ types: ['strong', 'weak'], prior: ['0.9', '0.1'], msgs: ['Beer', 'Quiche'], acts: ['duel', 'not'], P, belL: ['[0.9]', '[0.1]'], belR: ['[1 − μ]', '[μ]'] });
  let o = base + hi([0, 0], [1, 0]);
  o += text(280, 292, '彩线：两种 type 都点 Beer，Beer 之后不 duel（0.1 < 0.9）', 't', 'middle');
  o += text(280, 312, '虚彩线：Quiche 在 path 外，μ ≥ ½ 时 duel，weak 改点 Quiche 只得 1 < 2', 'ts', 'middle');
  return svg(560, 320, o, 'Beer–Quiche 的 signaling game：strong 的 prior 0.9、weak 0.1，sender 点 Beer 或 Quiche，receiver 决定 duel 与否；彩线是两种 type 都点 Beer、Beer 之后不 duel、Quiche 之后 duel 的 pooling equilibrium');
}

// ---------- 第 9 站：Nash bargaining solution 是切点 ----------
function nash() {
  const sx = lin(0, 1.15, 60, 320), sy = lin(0, 1.15, 262, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1.15, y0: 0, y1: 1.15, xt: [0, [1 / Math.sqrt(3), '1/√3'], 1], yt: [[2 / 3, '2/3'], 1], xl: 'u₁ = √x₁' });
  o += text(sx(0) - 4, sy(1.15) - 10, 'u₂ = x₂', 'ts');
  const bd = (u) => 1 - u * u;
  const pts = [[sx(0), sy(0)]];
  for (let i = 0; i <= 120; i++) { const u = i / 120; pts.push([sx(u), sy(bd(u))]); }
  o += poly(pts, 'wash') + path(curve(bd, 0, 1, sx, sy, 160), 'ink-b');
  const ks = 2 / (3 * Math.sqrt(3));
  // 核对：切点处 level curve 与边界的 slope 相同
  const u0 = 1 / Math.sqrt(3);
  if (Math.abs(-2 * u0 - (-ks / (u0 * u0))) > 1e-9) throw new Error('Nash 切点不对');
  for (const k of [0.15, 0.27]) o += path(curve((u) => k / u, k / 1.1, 1.1, sx, sy, 200), 'mute');
  o += path(curve((u) => ks / u, ks / 1.1, 1.1, sx, sy, 200), 'ln');
  o += path(curve((u) => 0.5 / u, 0.5 / 1.1, 1.1, sx, sy, 200), 'dash');
  o += circle(sx(u0), sy(2 / 3), 5, 'ink-f');
  o += line(sx(u0), sy(0), sx(u0), sy(2 / 3), 'grid') + line(sx(0), sy(2 / 3), sx(u0), sy(2 / 3), 'grid');
  o += text(sx(0.2), sy(0.2) + 4, 'F', 'tbig', 'middle');
  o += text(sx(1.1) + 4, sy(ks / 1.1) + 4, 'u₁u₂ ≈ 0.385', 'tl', 'start');
  o += text(sx(1.1) + 4, sy(0.5 / 1.1) - 2, '0.5：够不着 F', 'ts', 'start');
  o += text(sx(1.1) + 4, sy(0.27 / 1.1) + 10, '0.27', 'ts', 'start');
  const X = 420;
  o += text(X, 140, '粗黑线：F 的边界', 'ts') + text(X, 158, 'u₂ = 1 − u₁²', 't');
  o += text(X, 60, '切点 (1/√3, 2/3)', 'tb');
  o += text(X, 82, '换回钱：', 'ts') + text(X, 100, 'x₁ = 1/3，x₂ = 2/3', 't');
  return svg(560, 296, o, 'u1、u2 plane 上的 feasible set F，边界是 u2 等于 1 减 u1 的平方；几条 Nash product 的 level curve u1 u2 等于常数，其中等于约 0.385 的那条与边界相切于 1/√3、2/3');
}

export default {
  'ma4264-bertrand': bertrand,
  'ma4264-pbetree': pbetree,
  'ma4264-signal': signalA,
  'ma4264-beer': beer,
  'ma4264-nash': nash,
  'ma4264-iesds': iesdsA,
  'ma4264-mixdom': mixdom,
  'ma4264-brdyn': brdynA,
  'ma4264-cycle': cycleA,
  'ma4264-tennis': tennisA,
  'ma4264-bos': bos,
  'ma4264-envelope': envelope,
  'ma4264-entry': entry,
  'ma4264-backward': backwardA,
  'ma4264-subgame': subgame,
  'ma4264-folk': folk,
  'ma4264-bayesbos': bayesbos,
  'ma4264-bayescournot': bayescournot,
  'ma4264-orders': orders,
  'ma4264-core': core,
};
