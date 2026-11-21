import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, area, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// 直和：两条 line 时分解唯一；三条 line 两两只交于 0，分解却不唯一
function directsum() {
  const s = 50;
  let o = '';
  const panel = (ox, oy, three, title, l1, l2) => {
    const P = (x, y) => [ox + s * x, oy - s * y];
    const seg = (a, b, cls) => line(...P(...a), ...P(...b), cls);
    const arr = (a, b, cls) => arrow(...P(...a), ...P(...b), cls);
    o += seg([-0.4, 0], [3.7, 0], 'mute') + seg([-0.3, -0.3], [2.45, 2.45], 'mute');
    o += text(P(3.7, 0)[0] + 4, P(3.7, 0)[1] + 4, 'U', 'tb') + text(P(2.45, 2.45)[0] + 5, P(2.45, 2.45)[1] + 2, 'W', 'tb');
    if (three) o += seg([0, -0.4], [0, 2.5], 'mute') + text(P(0, 2.5)[0] - 5, P(0, 2.5)[1] + 4, 'X', 'tb', 'end');
    o += arr([0, 0], [3, 1], 'ln');
    o += arr([0, 0], [2, 0], 'ink-b') + arr([2, 0], [3, 1], 'ink-b');
    if (three) o += arr([0, 0], [0, 1], 'dash') + arr([0, 1], [3, 1], 'dash');
    else o += seg([0, 0], [1, 1], 'dash') + seg([1, 1], [3, 1], 'dash');
    o += circle(...P(0, 0), 3, 'ink-f');
    o += text(P(3, 1)[0] + 7, P(3, 1)[1] - 4, 'v = (3, 1)', 'tl');
    o += text(P(1, 0)[0], P(1, 0)[1] + 17, '(2, 0)', 'ts', 'middle') + text(P(2.6, 0.42)[0] + 6, P(2.6, 0.42)[1] + 6, '(1, 1)', 'ts');
    if (three) o += text(P(0, 0.5)[0] - 6, P(0, 0.5)[1] + 4, '(0, 1)', 'ts', 'end') + text(P(2.1, 1)[0], P(2.1, 1)[1] - 7, '(3, 0)', 'ts', 'middle');
    o += text(ox + 80, 22, title, 'tb', 'middle');
    o += text(ox + 80, 262, l1, 't', 'middle') + (l2 ? text(ox + 80, 280, l2, 't', 'middle') : '');
  };
  panel(50, 200, false, 'U ∩ W = {0}：只有一种拆法', 'v = (2, 0) + (1, 1)', '');
  panel(335, 200, true, '三条 line 两两只交于 0：两种拆法', 'v = (2, 0) + (1, 1) + (0, 0)', '   = (3, 0) + (0, 0) + (0, 1)');
  return svg(560, 290, o, '左图两条 line U 和 W 只交于原点，vector v 只有一种方式拆成 U 里的一个加 W 里的一个；右图加上第三条 line X，三条 line 两两只交于原点，但 v 有两种拆法，所以 U 加 W 加 X 不是 direct sum');
}

// dim(U + W)：从 U ∩ W 的 basis 向两边各自扩充
function dimsum() {
  const y = 96, h = 46, w = 150, x1 = 55, x2 = 205, x3 = 355;
  let o = rect(x1, y, w, h, 'paper') + rect(x2, y, w, h, 'wash ink-s') + rect(x3, y, w, h, 'paper');
  const lab = (x, a, n) => text(x + w / 2, y + 28, `${a}₁, …, ${a}${n}`, 't', 'middle');
  o += lab(x1, 'u', 'ⱼ') + lab(x2, 'v', 'ₘ') + lab(x3, 'w', 'ₖ');
  const br = (xa, xb, yy, up, s, cls) => {
    const t = up ? -8 : 8;
    o += path(d([[xa, yy], [xa, yy + t], [xb, yy + t], [xb, yy]]), 'ink') + text((xa + xb) / 2, yy + (up ? -15 : 27), s, cls, 'middle');
  };
  br(x1 + 2, x2 + w - 2, y - 6, true, 'basis of U：j + m 个', 't');
  br(x2 + 2, x3 + w - 2, y + h + 6, false, 'basis of W：m + k 个', 't');
  o += text(x2 - 10, y + h + 27, '中间：basis of U ∩ W', 'ts', 'end');
  o += path(d([[x1 + 2, 42], [x1 + 2, 34], [x3 + w - 2, 34], [x3 + w - 2, 42]]), 'ln') + text(280, 24, '合起来是 basis of U + W：j + m + k 个', 'tl', 'middle');
  o += text(280, 236, 'dim(U + W) = j + m + k = (j + m) + (m + k) − m = dim U + dim W − dim(U ∩ W)', 't', 'middle');
  return svg(560, 250, o, '先取 U 交 W 的 basis，向左扩充成 U 的 basis，向右扩充成 W 的 basis，三段合起来是 U 加 W 的 basis，由此数出 dimension formula');
}

// linear map 由 basis 的去向决定：T(x, y) = (4x − 2y, x + y)
function basismap() {
  const s = 30;
  let o = '';
  const L = [48, 150], R = [372, 150];
  const P = (O, x, y) => [O[0] + s * x, O[1] - s * y];
  const T = (x, y) => [4 * x - 2 * y, x + y];
  // 左：standard grid 里 v = e₁ + 2e₂ 走过的两个格子
  for (let i = 0; i <= 1; i++) o += line(...P(L, i, 0), ...P(L, i, 2), 'grid');
  for (let j = 0; j <= 2; j++) o += line(...P(L, 0, j), ...P(L, 1, j), 'grid');
  o += line(L[0] - 12, L[1], L[0] + 2.4 * s, L[1], 'axis') + line(L[0], L[1] + 10, L[0], L[1] - 2.9 * s, 'axis');
  o += line(...P(L, 1, 0), ...P(L, 1, 2), 'dash');
  o += arrow(...P(L, 0, 0), ...P(L, 1, 2), 'ln');
  o += arrow(...P(L, 0, 0), ...P(L, 1, 0), 'ink-b') + arrow(...P(L, 0, 0), ...P(L, 0, 1), 'ink-b');
  o += text(P(L, 1, 0)[0], P(L, 1, 0)[1] + 18, 'e₁', 'tb', 'middle') + text(P(L, 0, 1)[0] - 8, P(L, 0, 1)[1] + 6, 'e₂', 'tb', 'end');
  o += text(P(L, 1, 2)[0] + 7, P(L, 1, 2)[1] + 2, 'v = e₁ + 2e₂', 'tl');
  // 右：同样两个格子的 image
  for (let i = 0; i <= 1; i++) o += line(...P(R, ...T(i, 0)), ...P(R, ...T(i, 2)), 'grid');
  for (let j = 0; j <= 2; j++) o += line(...P(R, ...T(0, j)), ...P(R, ...T(1, j)), 'grid');
  o += line(R[0] - 4.6 * s, R[1], R[0] + 5 * s, R[1], 'axis') + line(R[0], R[1] + 10, R[0], R[1] - 3.6 * s, 'axis');
  const te1 = T(1, 0), te2 = T(0, 1), tv = T(1, 2);
  o += line(...P(R, ...te1), ...P(R, ...tv), 'dash');
  o += arrow(...P(R, 0, 0), ...P(R, ...tv), 'ln');
  o += arrow(...P(R, 0, 0), ...P(R, ...te1), 'ink-b') + arrow(...P(R, 0, 0), ...P(R, ...te2), 'ink-b');
  o += text(P(R, ...te1)[0] - 34, P(R, ...te1)[1] + 24, 'T(e₁) = (4, 1)', 'tb');
  o += text(P(R, ...te2)[0] - 8, P(R, ...te2)[1] + 16, 'T(e₂) = (−2, 1)', 'tb', 'end');
  o += text(P(R, ...tv)[0] + 9, P(R, ...tv)[1] + 2, 'T(v) = (0, 3)', 'tl');
  o += arrow(168, 62, 208, 62, 'ink') + text(188, 52, 'T', 'tb', 'middle');
  o += text(L[0] + 40, 194, '知道 e₁、e₂ 去哪', 't', 'middle') + text(R[0] - 10, 194, '同一组 coefficient 1、2：T(v) = T(e₁) + 2T(e₂)', 't', 'middle');
  return svg(560, 208, o, '左边是 standard basis 和 vector v 等于 e1 加两倍 e2；右边是它们在 linear map T 下的 image，T(v) 等于 T(e1) 加两倍 T(e2)，所以 T 完全由 basis 的 image 决定');
}

// rank–nullity：basis of ker T 补全成 basis of V，补上的那些被送成 range T 的 basis
function ranknullity() {
  let o = '';
  o += rect(40, 46, 200, 150, 'paper') + rect(40, 46, 200, 62, 'wash ink-s');
  o += text(140, 30, 'V', 'tb', 'middle');
  o += text(140, 72, 'ker T', 'tb', 'middle') + text(140, 92, 'basis：u₁, …, uₘ', 't', 'middle');
  o += text(140, 146, '补上 v₁, …, vᵣ', 't', 'middle') + text(140, 166, '合起来是 basis of V', 'ts', 'middle');
  o += rect(340, 46, 190, 150, 'paper') + rect(356, 104, 158, 76, 'wash ink-s');
  o += text(435, 30, 'W', 'tb', 'middle');
  o += circle(435, 72, 3.5, 'ink-f') + text(446, 76, '0', 't');
  o += text(435, 134, 'range T', 'tb', 'middle') + text(435, 156, 'basis：Tv₁, …, Tvᵣ', 't', 'middle');
  o += arrow(242, 76, 427, 72, 'ink') + text(300, 64, '全部送到 0', 'ts', 'middle');
  o += arrow(242, 150, 353, 146, 'ln') + text(297, 138, 'T', 'tl', 'middle');
  o += text(280, 224, 'dim V = m + r = dim ker T + dim range T', 't', 'middle');
  return svg(560, 238, o, 'V 的 basis 分成两段：ker T 的 basis 被 T 送到零，补上的那一段被 T 送成 range T 的 basis，所以 V 的 dimension 等于 ker T 的 dimension 加 range T 的 dimension');
}

// change of basis 的方块图，带上 T(x, y) = (4x − 2y, x + y)、v = (3, 2) 的数
function square() {
  let o = '';
  const node = (x, y, s1, s2) => rect(x, y, 150, 54, 'paper', 8) + text(x + 75, y + 23, s1, 'tb', 'middle') + text(x + 75, y + 42, s2, 'ts', 'middle');
  const B = sub('B'), S = sub('S');
  o += node(60, 40, `[v]${B}`, '(1, 1)') + node(350, 40, `[Tv]${B}`, '(2, 3)');
  o += node(60, 190, `[v]${S}`, '(3, 2)') + node(350, 190, `[Tv]${S}`, '(8, 5)');
  o += arrow(212, 67, 347, 67, 'ln') + text(280, 56, `[T]${B} = P⁻¹[T]${S}P`, 'tl', 'middle');
  o += arrow(212, 217, 347, 217, 'ink') + text(280, 206, `[T]${S}`, 'tb', 'middle');
  o += arrow(135, 96, 135, 187, 'ink') + text(126, 146, 'P', 'tb', 'end');
  o += arrow(425, 187, 425, 96, 'ink') + text(434, 146, 'P⁻¹', 'tb');
  o += text(280, 136, '上面一条路 = 下面绕一圈', 'ts', 'middle') + text(280, 154, '先 P，再 [T]ₛ，最后 P⁻¹', 'ts', 'middle');
  o += text(280, 274, `P 的 column 是 B 的 vector 在 S 下的 coordinate：它把 B-coordinate 换成 S-coordinate`, 'ts', 'middle');
  return svg(560, 286, o, '方块图：B-coordinate 经过 P 变成 S-coordinate，乘上 T 在 S 下的 matrix，再经过 P 的 inverse 回到 B-coordinate，等于直接乘 T 在 B 下的 matrix');
}

// 同一个 T 在两组 basis 下：standard basis 被带离自己的 span，eigenvector basis 只被拉长
function twobases() {
  const s = 27;
  let o = '';
  const T = ([x, y]) => [4 * x - 2 * y, x + y];
  const panel = (ox, oy, b1, b2, xl, xr, labels, title, sub2) => {
    const P = (x, y) => [ox + s * x, oy - s * y];
    o += line(ox + xl * s, oy, ox + xr * s, oy, 'axis') + line(ox, oy + 12, ox, oy - 3.7 * s, 'axis');
    for (const b of [b1, b2]) { const t = Math.min(b[0] > 0 ? (xr - 0.2) / b[0] : 99, b[1] > 0 ? 3.6 / b[1] : 99); o += line(...P(-0.25 * b[0], -0.25 * b[1]), ...P(b[0] * t, b[1] * t), 'dash'); }
    for (const b of [b1, b2]) o += arrow(...P(0, 0), ...P(...T(b)), 'ln');
    for (const b of [b1, b2]) o += arrow(...P(0, 0), ...P(...b), 'ink-b');
    o += labels(P);
    o += text(ox + ((xl + xr) / 2) * s, 22, title, 'tb', 'middle') + text(ox + ((xl + xr) / 2) * s, 40, sub2, 'ts', 'middle');
  };
  panel(90, 170, [1, 0], [0, 1], -2.8, 4.9, (P) =>
    text(P(1, 0)[0], P(1, 0)[1] + 18, 'e₁', 'tb', 'middle') + text(P(0, 1)[0] + 8, P(0, 1)[1] + 2, 'e₂', 'tb') +
    text(P(4, 1)[0] + 6, P(4, 1)[1] - 9, 'T(e₁)', 'tl', 'end') + text(P(-2, 1)[0] + 4, P(-2, 1)[1] - 9, 'T(e₂)', 'tl', 'middle'),
  'Standard basis', 'image 离开了原来的 span');
  panel(346, 170, [1, 1], [2, 1], -0.8, 6.8, (P) =>
    text(P(1, 1)[0] - 8, P(1, 1)[1] + 1, 'b₁', 'tb', 'end') + text(P(2, 1)[0] + 3, P(2, 1)[1] + 17, 'b₂', 'tb') +
    text(P(2, 2)[0] - 10, P(2, 2)[1] - 2, 'T(b₁) = 2b₁', 'tl', 'end') + text(P(3.4, 0.72)[0], P(3.4, 0.72)[1], 'T(b₂) = 3b₂', 'tl'),
  'B = {(1, 1), (2, 1)}', 'image 留在原来的 span 上，只被拉长');
  o += text(90 + 1.05 * s, 214, `[T]${sub('S')} 的 column：(4, 1)、(−2, 1)`, 't', 'middle');
  o += text(346 + 3 * s, 214, `[T]${sub('B')} 的 column：(2, 0)、(0, 3)`, 't', 'middle');
  o += text(280, 240, '黑色是 basis vector，彩色是它的 image，虚线是 basis vector 的 span', 'ts', 'middle');
  return svg(560, 252, o, '同一个 linear map 在两组 basis 下：standard basis 的两个 vector 的 image 都离开了各自的 span；另一组 basis 的两个 vector 的 image 仍在各自的 span 上，分别被拉长 2 倍和 3 倍，所以 matrix 是 diagonal 的');
}

// shear：只有一个方向留在自己的 span 上
function shear() {
  const s = 62, O = [130, 150];
  const P = (x, y) => [O[0] + s * x, O[1] - s * y];
  let o = line(O[0] - 1.6 * s, O[1], O[0] + 2.7 * s, O[1], 'axis') + line(O[0], O[1] + 14, O[0], O[1] - 1.55 * s, 'axis');
  o += line(...P(-1.5, 1), ...P(2.6, 1), 'grid');
  const vs = [[1, 1], [0, 1], [-1, 1]];
  for (const [x, y] of vs) o += arrow(...P(0, 0), ...P(x, y), 'mute');
  for (const [x, y] of vs) o += arrow(...P(0, 0), ...P(x + y, y), 'ink');
  for (const [x, y] of vs) o += arrow(P(x, y)[0] + 5, P(x, y)[1] - 7, P(x + y, y)[0] - 5, P(x + y, y)[1] - 7, 'dash', 5);
  o += arrow(...P(0, 0), ...P(1, 0), 'ln');
  o += text(P(1, 0)[0], P(1, 0)[1] + 18, 'e₁ = Ae₁', 'tl', 'middle');
  o += text(P(0, 1)[0] - 8, P(0, 1)[1] - 22, 'e₂', 'ts', 'end') + text(P(1, 1)[0], P(1, 1)[1] - 22, 'Ae₂ = e₁ + e₂', 'ts', 'middle');
  o += text(318, 52, 'A(x, y) = (x + y, y)', 'tb');
  o += text(318, 78, '灰色：原来的 vector；黑色：image。', 't');
  o += text(318, 98, '每个 tip 水平滑动 y 这么远，', 't');
  o += text(318, 118, '只要 y ≠ 0，方向就变了。', 't');
  o += text(318, 146, '留在自己 span 上的只有 x-axis：', 't');
  o += text(318, 166, 'E(1) = span(e₁)，dim = 1 &lt; 2', 'tl');
  return svg(560, 190, o, 'Shear 把每个 vector 的端点水平推动，只有水平方向的 vector 留在自己的 span 上，所以 eigenvector 只有一个方向，凑不成 basis');
}

// dot diagram 与对应的 Jordan form：chain 的长度是 3、2、2、1
function dots() {
  const lens = [3, 2, 2, 1];
  const cx = (c) => 60 + 40 * c, ry = (r) => 86 + 50 * r;
  let o = text(12, 22, 'Dot diagram：每个 column 是一条 chain', 'tb');
  lens.forEach((n, c) => {
    for (let r = 0; r < n; r++) {
      o += circle(cx(c), ry(r), 6, r === 0 ? 'ln-f' : 'ink-f');
      if (r > 0) o += arrow(cx(c), ry(r) - 9, cx(c), ry(r - 1) + 9, 'ink', 6);
    }
    o += arrow(cx(c), ry(0) - 9, cx(c), ry(0) - 30, 'mute', 5) + text(cx(c), ry(0) - 35, '0', 'ts', 'middle');
    o += text(cx(c), ry(2) + 34, String(n), 'ts', 'middle');
  });
  o += text(22, ry(2) + 34, 'length', 'ts', 'middle');
  o += text(22, ry(1) + 4, 'N', 'tb', 'middle') + arrow(22, ry(1) - 12, 22, ry(1) - 34, 'ink', 6);
  const rl = ['4 = dim ker N', '3 = dim ker N² − dim ker N', '1 = dim ker N³ − dim ker N²'];
  rl.forEach((s, r) => { o += text(206, ry(r) + 4, s, 't'); });
  o += text(206, ry(2) + 34, '每个 row 的 dot 数', 'ts');
  // Jordan form
  const x0 = 398, y0 = 50, c = 18;
  o += text(x0 + 4 * c, 22, 'N 在这组 basis 下的 matrix', 'tb', 'middle');
  o += rect(x0, y0, 8 * c, 8 * c, 'frame');
  let k = 0;
  for (const n of lens) {
    o += rect(x0 + k * c, y0 + k * c, n * c, n * c, 'wash ink-s');
    for (let i = 0; i < n; i++) {
      o += text(x0 + (k + i) * c + c / 2, y0 + (k + i) * c + 13, '0', 'ts', 'middle');
      if (i < n - 1) o += text(x0 + (k + i + 1) * c + c / 2, y0 + (k + i) * c + 13, '1', 'tb', 'middle');
    }
    k += n;
  }
  o += text(x0 + 4 * c, y0 + 8 * c + 20, 'block 的大小：3、2、2、1', 'ts', 'middle') + text(x0 + 4 * c, y0 + 8 * c + 36, '空白处全是 0', 'ts', 'middle');
  return svg(560, 236, o, 'Dot diagram 有四个 column，长度是 3、2、2、1，N 把每个 dot 送到它上面的 dot，把最上面一个 row 送到零；三个 row 的 dot 数是 4、3、1，分别等于相邻两个 kernel 的 dimension 之差；右边是对应的 Jordan form，四个 block 的大小是 3、2、2、1');
}

// orthogonal projection：P_U v 是 U 里离 v 最近的点
function proj() {
  let o = poly([[40, 236], [380, 236], [480, 142], [140, 142]], 'wash ink-s');
  const O = [120, 212], Pv = [300, 196], V = [300, 52], Uu = [400, 214];
  o += line(Pv[0], Pv[1], V[0], V[1], 'dash') + arrow(O[0], O[1], Pv[0], Pv[1], 'ink') + arrow(O[0], O[1], V[0], V[1], 'ln');
  o += line(Pv[0], Pv[1], Uu[0], Uu[1], 'ink-b') + line(V[0], V[1], Uu[0], Uu[1], 'mute');
  const a = Math.atan2(Uu[1] - Pv[1], Uu[0] - Pv[0]), q = 12;
  o += path(d([[Pv[0] + q * Math.cos(a), Pv[1] + q * Math.sin(a)], [Pv[0] + q * Math.cos(a), Pv[1] + q * Math.sin(a) - q], [Pv[0], Pv[1] - q]]), 'ink');
  o += circle(O[0], O[1], 3, 'ink-f') + circle(Uu[0], Uu[1], 4, 'ink-f') + circle(Pv[0], Pv[1], 4, 'ink-f') + circle(V[0], V[1], 4, 'ln-f');
  o += text(O[0] - 8, O[1] + 4, '0', 'ts', 'end') + text(V[0] - 9, V[1] + 2, 'v', 'tl', 'end');
  o += text(Pv[0] - 40, Pv[1] + 22, `P${sub('U')}v`, 'tb', 'middle') + text(Uu[0] + 9, Uu[1] + 5, 'u：U 里任意别的点', 't');
  o += text(Pv[0] - 9, 176, `v − P${sub('U')}v ∈ U⊥`, 't', 'end');
  o += text(366, 122, '‖v − u‖', 'ts');
  o += text(468, 160, 'U', 'tb');
  o += text(280, 264, `‖v − u‖² = ‖v − P${sub('U')}v‖² + ‖P${sub('U')}v − u‖² ≥ ‖v − P${sub('U')}v‖²`, 't', 'middle');
  return svg(560, 278, o, 'Vector v 向 subspace U 做 orthogonal projection；v 减去 projection 与 U 里的每个 vector perpendicular，所以对 U 里任意一点 u，v 到 u 的距离是 right triangle 的 hypotenuse，不小于 v 到 projection 的距离');
}

// 函数空间里的 projection：x³ 在 P₂ 里的最佳近似是 (3/5)x
function approx() {
  const sx = lin(-1, 1, 56, 300), sy = lin(-1.05, 1.05, 214, 30);
  const f = (x) => x ** 3, g = (x) => 0.6 * x;
  let o = axes({ sx, sy, x0: -1, x1: 1, y0: -1.05, y1: 1.05, xt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], yt: [[-1, '−1'], [-0.5, '−0.5'], [0, '0'], [0.5, '0.5'], [1, '1']], grid: true });
  o += line(sx(-1), sy(0), sx(1), sy(0), 'axis');
  const pts = [];
  for (let i = 0; i <= 120; i++) { const x = -1 + i / 60; pts.push([sx(x), sy(f(x))]); }
  for (let i = 120; i >= 0; i--) { const x = -1 + i / 60; pts.push([sx(x), sy(g(x))]); }
  o += path(d(pts) + 'Z', 'wash');
  o += path(curve(g, -1, 1, sx, sy), 'ln') + path(curve(f, -1, 1, sx, sy), 'ink');
  o += text(sx(0.74), sy(0.2), 'x³', 'tb') + text(sx(0.3), sy(0.42), '(3/5)x', 'tl', 'end');
  o += text(322, 62, 'U = P₂(ℝ)，⟨p, q⟩ = ∫ p q', 'tb');
  o += text(322, 88, 'x³ 在 U 上的 projection：(3/5)x', 't');
  o += text(322, 114, '‖x³ − (3/5)x‖² = 8/175 ≈ 0.046', 'tl');
  o += text(322, 146, '对比：degree ≤ 2 的 Taylor polynomial', 't');
  o += text(322, 166, '是 0，‖x³ − 0‖² = 2/7 ≈ 0.286', 't');
  o += text(322, 198, '阴影是两条 curve 之差；它的', 'ts') + text(322, 214, 'square 的 integral 就是 ‖·‖²。', 'ts');
  return svg(560, 246, o, '在 minus 1 到 1 上画出 x 的三次方和它在二次及以下 polynomial 里的最佳近似五分之三 x；两条 curve 之差的 square 的 integral 是 175 分之 8');
}

// 开头第二件事：A 有两条 line 被送回自己，S 只有一条
function intro() {
  let o = '';
  const panel = (x0, title, M, lines, vs) => {
    const sx = lin(-0.6, 2.6, x0, x0 + 230), sy = lin(-0.5, 1.5, 200, 50);
    const P = (x, y) => [sx(x), sy(y)];
    o += text(x0 + 115, 26, title, 'tb', 'middle');
    o += line(sx(-0.6), sy(0), sx(2.6), sy(0), 'grid') + line(sx(0), sy(-0.5), sx(0), sy(1.5), 'grid');
    for (const [a, b] of lines) { const t = Math.min(2.6 / a, 1.5 / b); o += line(...P(-0.5 * a / Math.max(a, b), -0.5 * b / Math.max(a, b)), ...P(t * a, t * b), 'dash'); }
    for (const [v, cls, lab, dx, dy] of vs) {
      const w = [M[0][0] * v[0] + M[0][1] * v[1], M[1][0] * v[0] + M[1][1] * v[1]];
      o += arrow(...P(0, 0), ...P(...w), cls) + arrow(...P(0, 0), ...P(...v), 'mute');
      if (lab) o += text(P(...w)[0] + dx, P(...w)[1] + dy, lab, cls === 'ln' ? 'tl' : 'ts', dx < 0 ? 'end' : 'start');
    }
  };
  panel(30, 'A：两条 line 被送回自己', [[4, -2], [1, 1]], [[1, 1], [2, 1]],
    [[[0.6, 0.6], 'ln', '×2', -6, 4], [[0.6, 0.3], 'ln', '×3', 6, 12], [[0, 0.5], 'ink', 'Ae₂ 转离了 e₂', 6, -6]]);
  panel(300, 'S：只有一条', [[1, 1], [0, 1]], [[1, 0]],
    [[[0.9, 0], 'ln', 'Se₁ = e₁', 0, 18], [[0, 0.9], 'ink', 'Se₂ = e₁ + e₂', 6, -6], [[-0.6, 0.6], 'ink', '', 0, 0]]);
  o += text(280, 232, '灰色是原来的 vector，深色是 image，虚线是被送回自己的 line（第 5 站叫 eigenvector 的方向）。', 'ts', 'middle');
  o += text(280, 250, 'A 的两条 line 拿来当 basis，matrix 就是 diagonal 的；S 凑不出第二条。', 'ts', 'middle');
  return svg(560, 260, o, '左边 A 把 (1,1) 方向拉长 2 倍、把 (2,1) 方向拉长 3 倍，两条 line 都留在原地；右边 shear S 只有 x 轴方向留在原地');
}

// 第 2 站：用 u 逐个替换 w，list 的长度不变
function exchange() {
  let o = '';
  const panel = (x0, title, sub2, keep, drop, rel) => {
    const sx = lin(-1.4, 1.6, x0, x0 + 165), sy = lin(-1.4, 1.4, 205, 50);
    const P = (x, y) => [sx(x), sy(y)];
    o += text(x0 + 82, 22, title, 'tb', 'middle') + text(x0 + 82, 40, sub2, 'ts', 'middle');
    o += line(sx(-1.4), sy(0), sx(1.6), sy(0), 'grid') + line(sx(0), sy(-1.4), sx(0), sy(1.4), 'grid');
    if (rel) o += rel(P);
    for (const [v, lab] of drop) o += arrow(...P(0, 0), ...P(...v), 'dash') + text(P(...v)[0] + (v[0] > 0 ? 8 : -8), P(...v)[1] + (v[1] > 0 ? -4 : 16), lab, 'ts', v[0] > 0 ? 'start' : 'end');
    for (const [v, lab, cls] of keep) o += arrow(...P(0, 0), ...P(...v), cls) + text(P(...v)[0] + (v[0] > 0 ? 8 : -8), P(...v)[1] + (v[1] < 0 ? 16 : v[1] > 0 ? -4 : 18), lab, cls === 'ln' ? 'tl' : 'tb', v[0] > 0 ? 'start' : v[0] < 0 ? 'end' : 'middle');
  };
  const w1 = [1, 0], w2 = [0, 1], u1 = [1, 1], u2 = [1, -1];
  panel(15, '开始', 'w₁, w₂', [[w1, 'w₁', 'ink-b'], [w2, 'w₂', 'ink-b']], [], null);
  panel(198, '第 1 步：放进 u₁', '去掉 w₂ = u₁ − w₁', [[u1, 'u₁', 'ln'], [w1, 'w₁', 'ink-b']], [[w2, 'w₂']],
    (P) => line(...P(...w1), ...P(...u1), 'mute'));
  panel(381, '第 2 步：放进 u₂', '去掉 w₁ = ½(u₁ + u₂)', [[u1, 'u₁', 'ln'], [u2, 'u₂', 'ln']], [[w1, '']],
    (P) => line(...P(...u1), ...P(...u2), 'mute') + circle(...P(...w1), 3, 'ink-f') + text(P(...w1)[0] + 7, P(...w1)[1] + 16, 'w₁', 'ts'));
  o += text(280, 236, '实线是手里的 list，虚线是刚被换掉的 w。', 'ts', 'middle');
  o += text(280, 254, '每一步换进一个 u、换出一个 w，length 始终是 2，而且一直 span ℝ²。', 'ts', 'middle');
  return svg(560, 264, o, '在 R2 里用 u1 等于 (1,1)、u2 等于 (1,-1) 逐个替换 w1 等于 (1,0)、w2 等于 (0,1)：每步换进一个 u 换出一个 w，list 始终 span 整个平面');
}

// 3D 的斜投影：x 指向左下，y 向右，z 向上
const P3 = (O, s) => ([x, y, z]) => [O[0] + s * (y - 0.5 * x), O[1] - s * (z - 0.32 * x)];

// 第 7 站：A₃ 的 N = A₃ − 2I，chain e₁ → (1,1,0) → 0
function chain() {
  const P = P3([170, 172], 80);
  const pt = (a, b) => [a, a + b, b]; // a(1,1,0) + b(0,1,1)
  let o = poly([pt(-0.3, -0.3), pt(1.3, -0.3), pt(1.3, 1.3), pt(-0.3, 1.3)].map(P), 'wash');
  o += arrow(...P([0, 0, 0]), ...P([1.55, 0, 0]), 'axis', 5) + arrow(...P([0, 0, 0]), ...P([0, 1.9, 0]), 'axis', 5) + arrow(...P([0, 0, 0]), ...P([0, 0, 1.45]), 'axis', 5);
  o += text(P([1.55, 0, 0])[0] - 6, P([1.55, 0, 0])[1] + 4, 'x', 'ts', 'end') + text(P([0, 1.9, 0])[0] + 6, P([0, 1.9, 0])[1] + 4, 'y', 'ts') + text(P([0, 0, 1.45])[0] + 6, P([0, 0, 1.45])[1] + 4, 'z', 'ts');
  o += line(...P(pt(-0.3, 0)), ...P(pt(1.3, 0)), 'ln-dash');
  const e1 = [1, 0, 0], v1 = [1, 1, 0], v3 = [0, 1, 1];
  o += arrow(...P([0, 0, 0]), ...P(v1), 'ln') + arrow(...P([0, 0, 0]), ...P(v3), 'ln') + arrow(...P([0, 0, 0]), ...P(e1), 'ink-b');
  o += circle(...P([0, 0, 0]), 3.5, 'ink-f');
  const a = P(e1), b = P(v1);
  o += path(`M${a[0] + 4} ${a[1] + 8}Q${(a[0] + b[0]) / 2} ${a[1] + 42} ${b[0] - 6} ${b[1] + 10}`, 'dash') + arrow(b[0] - 14, b[1] + 17, b[0] - 6, b[1] + 10, 'ink', 6);
  o += text((a[0] + b[0]) / 2, a[1] + 44, 'N', 'tb', 'middle');
  o += text(a[0] - 8, a[1] + 4, 'e₁', 'tb', 'end');
  o += text(b[0] + 8, b[1] + 8, '(1, 1, 0)', 'tl');
  o += text(P(v3)[0] + 8, P(v3)[1] + 4, '(0, 1, 1)', 'tl');
  o += text(P(pt(-0.3, 1.3))[0] - 6, P(pt(-0.3, 1.3))[1] + 4, 'E₂ = ker N', 'ts', 'end');
  o += text(P(pt(-0.3, 0))[0] - 4, P(pt(-0.3, 0))[1] - 6, 'range N', 'ts', 'end');
  const tx = 392;
  o += text(tx, 64, 'N = A₃ − 2I', 'tb');
  o += text(tx, 92, 'ker N：plane x − y + z = 0', 'ts');
  o += text(tx, 112, 'range N：span{(1, 1, 0)}', 'ts');
  o += text(tx, 140, 'chain：e₁ → (1, 1, 0) → 0', 't');
  o += text(tx, 160, 'chain：(0, 1, 1) → 0', 't');
  o += text(tx, 188, 'e₁ 不在 plane 上，', 'ts') + text(tx, 206, 'N 把它送进 plane，', 'ts') + text(tx, 224, 'N² 把它送到 0。', 'ts');
  return svg(560, 262, o, 'A3 减 2I 的 kernel 是 plane x-y+z=0，range 是这个 plane 里过 (1,1,0) 的 line；e1 在 plane 外，被 N 送到 (1,1,0)，再被送到 0');
}

// 第 8 站：G 的两个 eigenspace，以及 E₁ 里的 Gram–Schmidt
function spectral() {
  const r2 = Math.SQRT2, r3 = Math.sqrt(3), r6 = Math.sqrt(6);
  const U = [1 / r2, -1 / r2, 0], W = [1 / r6, 1 / r6, -2 / r6], Nn = [1 / r3, 1 / r3, 1 / r3];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const O = [190, 175], s = 78;
  const P = (v) => [O[0] + s * (dot(v, U) + 0.3 * dot(v, W)), O[1] - s * (0.92 * dot(v, Nn) - 0.5 * dot(v, W))];
  let o = '';
  const disk = [];
  for (let k = 0; k <= 72; k++) { const t = (2 * Math.PI * k) / 72, R = 1.75; disk.push(P([0, 1, 2].map((i) => R * (Math.cos(t) * U[i] + Math.sin(t) * W[i])))); }
  o += path(d(disk) + 'Z', 'wash ink-s');
  const a = [1, -1, 0], b = [1, 0, -1], c = [0.5, 0.5, -1], n = [1, 1, 1];
  o += arrow(...P([0, 0, 0]), ...P(n), 'ink-b');
  o += arrow(...P([0, 0, 0]), ...P(b), 'mute') + arrow(...P([0, 0, 0]), ...P(a), 'ln') + arrow(...P([0, 0, 0]), ...P(c), 'ln');
  // 直角标记（在 3D 里算，再投影）
  const m = 0.16, ua = a.map((x) => x / r2), uc = c.map((x) => x / Math.sqrt(1.5));
  o += path(d([[0, 1, 2].map((i) => m * ua[i]), [0, 1, 2].map((i) => m * (ua[i] + uc[i])), [0, 1, 2].map((i) => m * uc[i])].map(P)), 'ink');
  o += text(P(n)[0] + 8, P(n)[1] + 4, '(1, 1, 1)，λ = 4', 'tb');
  o += text(P(a)[0] + 8, P(a)[1] + 4, '(1, −1, 0)', 'tl');
  o += text(P(b)[0] - 2, P(b)[1] + 16, '(1, 0, −1)', 'ts', 'end');
  o += text(P(c)[0] - 8, P(c)[1] + 10, '(½, ½, −1)', 'tl', 'end');
  o += text(24, O[1] - 75, 'E₁：x + y + z = 0', 'ts');
  const tx = 372;
  o += text(tx, 60, 'E₄ ⟂ E₁：不同 eigenvalue，', 'ts') + text(tx, 78, '自动 orthogonal。', 'ts');
  o += text(tx, 112, '同在 E₁ 里的 (1, −1, 0) 与', 'ts') + text(tx, 130, '(1, 0, −1)：dot product 是 1，', 'ts') + text(tx, 148, '夹角 60°（灰色）。', 'ts');
  o += text(tx, 182, 'Gram–Schmidt 换成 (½, ½, −1)，', 'ts') + text(tx, 200, '与 (1, −1, 0) 成直角。', 'ts');
  return svg(560, 262, o, 'G 的 eigenspace：E4 是过 (1,1,1) 的 line，E1 是与它垂直的 plane x+y+z=0；plane 里 (1,-1,0) 与 (1,0,-1) 夹 60 度，Gram–Schmidt 后得到与 (1,-1,0) 垂直的 (1/2,1/2,-1)');
}

// ---------- 动图 ----------
// 开头第二件：v 转一圈，看 Av 什么时候和 v 在同一条 line 上
function introA() {
  const R = Math.PI / 180, rate = 40, hold = 1.1;
  const EA = [[Math.atan2(1, 1) / R, 2, '(1, 1)'], [Math.atan2(1, 2) / R, 3, '(2, 1)']];
  const ES = [[0, 1, '(1, 0)']];
  const eigAll = [];
  for (const [a] of [...EA, ...ES]) eigAll.push(a, a + 180);
  const ths = [];
  for (let a = 0; a < 360; a += 3) ths.push(a);
  for (const a of eigAll) if (!ths.some((t) => Math.abs(t - a) < 1e-9)) ths.push(a);
  ths.push(360); ths.sort((x, y) => x - y);
  const isE = (a) => eigAll.some((e) => Math.abs(((a % 360) - e)) < 1e-9);
  const times = [], th = [];
  let t = 0;
  ths.forEach((a, i) => {
    if (i) t += (a - ths[i - 1]) / rate;
    times.push(t); th.push(a);
    if (isE(a) && a < 360) { t += hold; times.push(t); th.push(a); }
  });
  const T = t, kt = times.map((x) => x / T);
  let o = '';
  const panel = (cx, cy, u, M, eigs, title, Ln) => {
    const P = ([x, y]) => [cx + u * x, cy - u * y];
    const mv = ([x, y]) => [M[0][0] * x + M[0][1] * y, M[1][0] * x + M[1][1] * y];
    o += text(cx, 22, title, 'tb', 'middle');
    o += line(cx - 128, cy, cx + 128, cy, 'grid') + line(cx, cy - 130, cx, cy + 130, 'grid');
    const circ = [], ell = [];
    for (let k = 0; k <= 72; k++) { const a = k * 5 * R; circ.push(P([Math.cos(a), Math.sin(a)])); ell.push(P(mv([Math.cos(a), Math.sin(a)]))); }
    o += path(d(circ), 'grid') + path(d(ell), 'grid');
    for (const [a] of eigs) { const c = Math.cos(a * R), s = Math.sin(a * R), L = 128 / u / Math.max(Math.abs(c), Math.abs(s) * 128 / 130); o += line(...P([-L * c, -L * s]), ...P([L * c, L * s]), 'dash'); }
    const dir = th.map((a) => [Math.cos(a * R), Math.sin(a * R)]);
    const Ls = 120 / u;
    o += apath(dir.map(([c, s]) => d([P([-Ls * c, -Ls * s]), P([Ls * c, Ls * s])])), kt, T, 'mute');
    o += apath(dir.map((v) => d([P([0, 0]), P(v)])), kt, T, 'ink-b');
    o += apath(dir.map((v) => d([P([0, 0]), P(mv(v))])), kt, T, 'ln');
    const tv = dir.map(P), ta = dir.map((v) => P(mv(v)));
    o += acircle(ta.map((p) => p[0]), ta.map((p) => p[1]), kt, T, 4.5, 'ln-f');
    o += acircle(tv.map((p) => p[0]), tv.map((p) => p[1]), kt, T, 3.5, 'ink-f');
    // 读数
    const hit = (a, e) => Math.abs((a % 180) - (e % 180)) < 1e-9;
    const none = th.map((a) => !eigs.some(([e]) => hit(a, e)));
    o += `<text x="${cx}" y="${cy + 150}" class="ts" text-anchor="middle" opacity="${none[0] ? 1 : 0}">${Ln}v 不在 v 的 line 上：方向被转走了${ashow(none, kt, T)}</text>`;
    for (const [e, lam, nm] of eigs) {
      const on = th.map((a) => hit(a, e));
      o += `<text x="${cx}" y="${cy + 150}" class="tl" text-anchor="middle" opacity="${on[0] ? 1 : 0}">v 在 ${nm} 的 line 上：${Ln}v = ${lam === 1 ? '' : lam}v${ashow(on, kt, T)}</text>`;
    }
  };
  panel(140, 168, 28, [[4, -2], [1, 1]], EA, 'A = [4 −2; 1 1]', 'A');
  panel(420, 168, 70, [[1, 1], [0, 1]], ES, 'S = [1 1; 0 1]', 'S');
  o += text(280, 346, '黑：unit vector v 转一圈；蓝：它的 image；灰线：v 的 line；虚线：被送回自己的 line。', 'ts', 'middle');
  o += text(280, 364, 'A 有两条这样的 line（停顿四次），S 只有 x-axis 一条（停顿两次）。', 'ts', 'middle');
  return svgA(560, 372, o, '动图：unit vector v 绕原点转一圈，同时画出 Av 和 Sv。A 在 (1,1) 和 (2,1) 两个方向上 image 与 v 同线，分别是 2v 和 3v；S 只在 x 轴方向上 Sv 等于 v');
}

// 第 5 站：shear 把每个 tip 水平推 y 这么远
function shearA() {
  const s = 62, O = [130, 150];
  const P = (x, y) => [O[0] + s * x, O[1] - s * y];
  const T = 6, kt = [0, 0.3, 0.37, 0.45, 0.85, 1], tt = [1, 1, 0, 0, 1, 1];
  let o = line(O[0] - 1.6 * s, O[1], O[0] + 2.7 * s, O[1], 'axis') + line(O[0], O[1] + 14, O[0], O[1] - 1.55 * s, 'axis');
  o += line(...P(-1.5, 1), ...P(2.6, 1), 'grid');
  // unit square → parallelogram
  o += apath(tt.map((t) => d([P(0, 0), P(1, 0), P(1 + t, 1), P(t, 1)]) + 'Z'), kt, T, 'wash');
  const vs = [[1, 1], [0, 1], [-1, 1], [0.5, 0.5]];
  for (const [x, y] of vs) o += arrow(...P(0, 0), ...P(x, y), 'mute');
  for (const [x, y] of vs) {
    o += apath(tt.map((t) => d([P(0, 0), P(x + t * y, y)])), kt, T, 'ink');
    const q = tt.map((t) => P(x + t * y, y));
    o += acircle(q.map((p) => p[0]), q.map((p) => p[1]), kt, T, 3.5, 'ink-f');
  }
  o += arrow(...P(0, 0), ...P(1, 0), 'ln');
  o += text(P(1, 0)[0], P(1, 0)[1] + 18, 'e₁ = Se₁', 'tl', 'middle');
  o += text(P(0, 1)[0] - 8, P(0, 1)[1] - 12, 'e₂', 'ts', 'end') + text(P(1, 1)[0] + 6, P(1, 1)[1] - 12, 'Se₂', 'ts', 'start');
  o += text(318, 52, 'S(x, y) = (x + y, y)', 'tb');
  o += text(318, 78, '灰色：原来的 vector；黑色：image。', 't');
  o += text(318, 98, '每个 tip 水平滑动 y 这么远，', 't');
  o += text(318, 118, '只要 y ≠ 0，方向就变了。', 't');
  o += text(318, 146, '留在自己 span 上的只有 x-axis：', 't');
  o += text(318, 166, 'E(1) = span(e₁)，dim = 1 &lt; 2', 'tl');
  return svgA(560, 190, o, '动图：shear S 作用时每个 vector 的端点水平滑动 y 那么远，unit square 斜成平行四边形；只有水平方向的 vector 留在自己的 span 上');
}

// 第 7 站：沿 chain 走：e₁ → (1,1,0) → 0
function chainA() {
  const base = chain().replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const P = P3([170, 172], 80);
  const pts = [[1, 0, 0], [1, 1, 0], [0, 0, 0]].map(P);
  const T = 6.6, tk = [0, 1 / 3, 2 / 3];
  const seq = [0, 1, 2];
  let o = base.replace(/<text x="392"[^>]*>e₁ 不在 plane 上，<\/text><text[^>]*>N 把它送进 plane，<\/text><text[^>]*>N² 把它送到 0。<\/text>/, '');
  o += `<circle cx="${f1(pts[0][0])}" cy="${f1(pts[0][1])}" r="6" class="ln-f">${anim('cx', seq.map((i) => f1(pts[i][0])), tk, T, true)}${anim('cy', seq.map((i) => f1(pts[i][1])), tk, T, true)}</circle>`;
  const lines = [['v = e₁：不在 plane 上', '所以不是 eigenvector'], ['Nv = (1, 1, 0)：进了 plane', '是 eigenvector，但不是 0'], ['N²v = 0', 'e₁ 走两步才到 0']];
  lines.forEach(([a, b], k) => {
    const on = seq.map((i) => i === k);
    o += `<g opacity="${on[0] ? 1 : 0}">${text(392, 196, a, 'tl')}${text(392, 216, b, 'ts')}${ashow(on, tk, T)}</g>`;
  });
  return svgA(560, 262, o, '动图：A3 减 2I 的 kernel 是 plane x-y+z=0；一个点从 e1 出发，被 N 送到 plane 里的 (1,1,0)，再被送到 0');
}

export default {
  'ma2101-intro': introA,
  'ma2101-exchange': exchange,
  'ma2101-chain': chainA,
  'ma2101-spectral': spectral,
  'ma2101-directsum': directsum,
  'ma2101-dimsum': dimsum,
  'ma2101-basismap': basismap,
  'ma2101-ranknullity': ranknullity,
  'ma2101-square': square,
  'ma2101-twobases': twobases,
  'ma2101-shear': shearA,
  'ma2101-dots': dots,
  'ma2101-proj': proj,
  'ma2101-approx': approx,
};
