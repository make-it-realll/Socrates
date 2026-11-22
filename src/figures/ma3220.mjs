import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 数值工具 ----------
// RK4：f(t, y) 返回导数数组，返回 [t, y] 的列表
function rk4(f, t0, y0, t1, n) {
  const h = (t1 - t0) / n, out = [[t0, y0.slice()]];
  let t = t0, y = y0.slice();
  for (let i = 0; i < n; i++) {
    const k1 = f(t, y), y2 = y.map((v, j) => v + (h / 2) * k1[j]);
    const k2 = f(t + h / 2, y2), y3 = y.map((v, j) => v + (h / 2) * k2[j]);
    const k3 = f(t + h / 2, y3), y4 = y.map((v, j) => v + h * k3[j]);
    const k4 = f(t + h, y4);
    y = y.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    t += h;
    out.push([t, y.slice()]);
  }
  return out;
}
// 线性插值找 zero
const zerosOf = (pts) => {
  const z = [];
  for (let i = 1; i < pts.length; i++) {
    const [a, ya] = pts[i - 1], [b, yb] = pts[i];
    if (ya === 0) z.push(a);
    else if (ya * yb < 0) z.push(a - (ya * (b - a)) / (yb - ya));
  }
  return z;
};
// integer order 的 Bessel function：J_p(x) = (1/π)∫₀^π cos(pτ − x sin τ) dτ（Simpson）
function besselJ(p, x) {
  const n = 400, h = Math.PI / n;
  let s = 0;
  for (let i = 0; i <= n; i++) {
    const t = i * h, w = i === 0 || i === n ? 1 : i % 2 ? 4 : 2;
    s += w * Math.cos(p * t - x * Math.sin(t));
  }
  return (s * h) / 3 / Math.PI;
}
const thin = (pts, k) => pts.filter((_, i) => i % k === 0 || i === pts.length - 1);
const fmt = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);
const sup = (s) => `<tspan class="sup" dy="-5">${s}</tspan><tspan dy="5">​</tspan>`;
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// ---------- 开头第一件事：y' = 3y^(2/3)，y(0) = 0 ----------
function nonuniq() {
  const sx = lin(-1.6, 2.1, 50, 400), sy = lin(-2.2, 3.4, 250, 20);
  let o = axes({ sx, sy, x0: -1.6, x1: 2.1, y0: -2.2, y1: 3.4, xt: [[-1, '−1'], [1, '1'], [2, '2']], yt: [[-2, '−2'], [2, '2']], xAt: 0, yAt: 0, xl: 'x', yl: 'y' });
  const piece = (c, d0) => (x) => (x > c ? (x - c) ** 3 : x < d0 ? (x - d0) ** 3 : 0);
  o += line(sx(-1.6), sy(0), sx(2.1), sy(0), 'ink-b');
  const sets = [[0, 0, 'ln'], [0.6, 0, 'ln'], [1.2, -0.7, 'ln-dash']];
  for (const [c, d0, cls] of sets) o += path(curve(piece(c, d0), -1.6, 2.1, sx, sy, 400), cls);
  o += circle(sx(0), sy(0), 4.5, 'ink-f');
  o += text(sx(1.36), sy(2.75), 'y = x³', 'tl', 'end');
  o += text(sx(1.92), sy(2.0), '等到 0.6 再离开', 'ts', 'end');
  o += text(sx(2.05), sy(-0.42), 'y = 0 一直不动', 'tb', 'end');
  o += text(sx(-1.55), sy(-1.25), '往左也可以', 'ts') + text(sx(-1.55), sy(-1.6), '等一段再走', 'ts');
  o += text(sx(0.08), sy(-0.35), '(0, 0)', 'ts');
  const X = 420;
  o += text(X, 50, '同一个 initial condition', 'tb') + text(X, 70, 'y(0) = 0', 't');
  o += text(X, 104, '每一条都处处满足', 't') + text(X, 124, 'y′ = 3y' + sup('2/3') + '：', 't');
  o += text(X, 150, '在 y = 0 上 y′ = 0；', 'ts') + text(X, 168, '在 (x − c)³ 上', 'ts') + text(X, 186, 'y′ = 3(x − c)²', 'ts') + text(X, 204, '= 3y' + sup('2/3') + '。', 'ts');
  o += text(X, 238, '接口处 y′ = 0，', 'ts') + text(X, 256, '两边接得上。', 'ts');
  return svg(560, 270, o, 'y 撇等于 3 倍 y 的三分之二次方、y(0)=0 的几条不同的 solution：y=0、y=x 的三次方，以及在 0 上停留一段再离开的分段 solution');
}

// ---------- 开头第二件事 / 第 2 站：y' = y²，Picard 的 rectangle 与 cone ----------
function blowup() {
  const sx = lin(-1.1, 1.25, 50, 360), sy = lin(-0.3, 6.3, 262, 20);
  let o = axes({ sx, sy, x0: -1.1, x1: 1.25, y0: -0.3, y1: 6.3, xt: [[-1, '−1'], [-0.5, '−½'], [-0.25, '−¼'], [0.25, '¼'], [0.5, '½'], [1, '1']], yt: [1, 2, 3, 4, 5, 6], xAt: 0, yAt: 0, xl: 'x', yl: 'y' });
  // rectangle |x| ≤ ½, |y − 1| ≤ 1
  o += rect(sx(-0.5), sy(2), sx(0.5) - sx(-0.5), sy(0) - sy(2), 'wash');
  o += rect(sx(-0.25), sy(2), sx(0.25) - sx(-0.25), sy(0) - sy(2), 'wash-strong');
  // cone：slope ±M = ±4
  o += line(sx(-0.25), sy(2), sx(0.25), sy(0), 'dash') + line(sx(-0.25), sy(0), sx(0.25), sy(2), 'dash');
  o += line(sx(1), sy(-0.3), sx(1), sy(6.3), 'ln-dash');
  o += path(curve((x) => 1 / (1 - x), -1.1, 1 - 1 / 6.3, sx, sy, 400), 'ln');
  o += circle(sx(0), sy(1), 4, 'ink-f');
  o += text(sx(1) + 6, sy(5.9), 'x = 1', 'tl');
  o += text(sx(0.62), sy(4.4), 'y = 1 / (1 − x)', 'tl', 'end');
  o += text(sx(-1.05), sy(2.35), 'R：|x| ≤ ½，|y − 1| ≤ 1', 'ts');
  const X = 380;
  o += text(X, 40, 'f(y) = y² 处处 smooth，', 't') + text(X, 60, 'solution 却在 x = 1 冲到 ∞。', 't');
  o += text(X, 98, '在 R 里 |f| ≤ M = 4：graph 的', 'ts') + text(X, 116, 'slope 夹在 ±4 之间（虚线 cone），', 'ts');
  o += text(X, 134, '最快在 x = ±¼ 碰到 y = 2 或 0。', 'ts');
  o += text(X, 166, 'Picard theorem 保证：', 'tb') + text(X, 186, 'α = min(a, b / M) = ¼（深色）。', 't');
  o += text(X, 220, '它只保证 ¼，', 'ts') + text(X, 238, '实际 solution 活到 x = 1 之前。', 'ts');
  return svg(560, 296, o, 'y 撇等于 y 平方、y(0)=1 的 solution 1/(1−x) 在 x=1 处 blow up；rectangle R 里 slope 不超过 4，Picard theorem 保证 solution 至少存在于 x 在负四分之一到四分之一之间');
}

// ---------- 开头第三件事：y'' + xy = 0 没有 formula，但 zero 越来越密 ----------
function airy() {
  const sol = rk4((t, y) => [y[1], -t * y[0]], 0, [1, 0], 12, 6000);
  const pts = sol.map(([t, y]) => [t, y[0]]), z = zerosOf(pts);
  const sx = lin(0, 12, 46, 530), sy = lin(-1.15, 1.25, 190, 24);
  let o = axes({ sx, sy, x0: 0, x1: 12, y0: -1.15, y1: 1.25, xt: [], yt: [[-1, '−1'], [1, '1']], xAt: 0, xl: 'x', yl: 'y' });
  o += path(d(thin(pts, 10).map(([t, y]) => [sx(t), sy(y)])), 'ln');
  z.forEach((x) => { o += circle(sx(x), sy(0), 3.5, 'ink-f'); });
  const gaps = z.slice(1).map((x, i) => x - z[i]);
  o += text(46, 204, `x 从 0 到 12。Zero 在 ${z.slice(0, 4).map((x) => x.toFixed(2)).join('，')}，……，${z[z.length - 1].toFixed(2)}`, 'ts');
  o += text(46, 222, `相邻 zero 的间距：${gaps.slice(0, 4).map((g) => g.toFixed(2)).join('，')}，……，最后一段 ${gaps[gaps.length - 1].toFixed(2)}`, 'ts');
  o += text(46, 240, 'y(0) = 1，y′(0) = 0，RK4 numerical solution。x 越大，y 被拉回 0 的力 xy 越强，oscillation 越快。', 'ts');
  return svg(560, 250, o, 'y 两撇加 x 乘 y 等于 0 的一个 solution 在 0 到 12 之间的 graph，oscillation 越来越快，相邻 zero 的间距从 1.84 缩小到 0.93');
}

// ---------- 第 1 站：exact equation 的 solution 就是 u 的 level curve ----------
function exact() {
  const sx = lin(-3, 3, 40, 330), sy = lin(-3, 3, 250, 20);
  let o = rect(sx(-3), sy(3), sx(3) - sx(-3), sy(-3) - sy(3), 'frame');
  o += line(sx(-3), sy(0), sx(3), sy(0), 'grid') + line(sx(0), sy(-3), sx(0), sy(3), 'grid');
  // slope field：y' = −(x²y + y + 1) / (x(1 + x²))
  for (let i = -5; i <= 5; i++) for (let j = -5; j <= 5; j++) {
    const x = i * 0.55 + 0.02, y = j * 0.55;
    const m = -(x * x * y + y + 1) / (x * (1 + x * x));
    const L = 0.16 / Math.hypot(1, m);
    o += line(sx(x - L), sy(y - m * L), sx(x + L), sy(y + m * L), 'mute');
  }
  const cs = [-2, -1, -0.5, 0.5, 1, 2];
  for (const c of cs) {
    for (const [a, b] of [[-3, -0.03], [0.03, 3]]) {
      const pts = [];
      for (let k = 0; k <= 300; k++) { const x = a + ((b - a) * k) / 300, y = (c - Math.atan(x)) / x; if (Math.abs(y) <= 3) pts.push([sx(x), sy(y)]); else if (pts.length) break; }
      // 只保留连续的一段（可能从中间开始进入画框）
      const seg = [];
      for (let k = 0; k <= 300; k++) { const x = a + ((b - a) * k) / 300, y = (c - Math.atan(x)) / x; if (Math.abs(y) <= 3) seg.push([sx(x), sy(y)]); else if (seg.length) { o += path(d(seg), c === 1 ? 'ln' : 'ink'); seg.length = 0; } }
      if (seg.length > 1) o += path(d(seg), c === 1 ? 'ln' : 'ink');
    }
  }
  // c = 0：y = −arctan(x)/x，以及 x = 0 这条 line 上 u 也是 0
  o += path(curve((x) => -Math.atan(x) / x, -3, -0.001, sx, sy), 'ink') + path(curve((x) => -Math.atan(x) / x, 0.001, 3, sx, sy), 'ink');
  for (const v of [-3, 0, 3]) o += text(sx(v), 266, v < 0 ? '−3' : String(v), 'ts', 'middle');
  o += text(sx(-3) - 6, sy(3) + 10, '3', 'ts', 'end') + text(sx(-3) - 6, sy(-3) + 4, '−3', 'ts', 'end');
  const X = 350;
  o += text(X, 40, 'u(x, y) = xy + arctan x', 'tb');
  o += text(X, 64, '每条 curve 是 u = c', 't') + text(X, 84, '（c = 0, ±½, ±1, ±2）。', 't');
  o += text(X, 116, '短线段是 equation 规定的', 'ts') + text(X, 134, 'slope：y′ = −M / N。', 'ts');
  o += text(X, 166, 'Curve 处处和短线段相切：', 'ts') + text(X, 184, '沿 u = c 走，du = 0，', 'ts') + text(X, 202, '正是 M dx + N dy = 0。', 'ts');
  o += text(X, 236, '彩色那条是 u = 1，', 'ts') + text(X, 254, '过 (1, 1 − π/4)。', 'ts');
  return svg(560, 272, o, 'Exact equation 乘上 integrating factor 之后的 potential u 等于 xy 加 arctan x，它的 level curve 就是 solution curve，处处与 slope field 相切');
}

// ---------- 第 1 站：Clairaut equation 的 line 族与 envelope ----------
function clairaut() {
  const sx = lin(-2.6, 2.6, 40, 330), sy = lin(-3.2, 5.2, 262, 20);
  let o = rect(sx(-2.6), sy(5.2), sx(2.6) - sx(-2.6), sy(-3.2) - sy(5.2), 'frame');
  o += line(sx(-2.6), sy(0), sx(2.6), sy(0), 'grid') + line(sx(0), sy(-3.2), sx(0), sy(5.2), 'grid');
  const clipLine = (c, cls) => { const pts = []; for (let k = 0; k <= 200; k++) { const x = -2.6 + 5.2 * k / 200, y = c * x - c * c / 4; if (y >= -3.2 && y <= 5.2) pts.push([sx(x), sy(y)]); } return pts.length > 1 ? path(d(pts), cls) : ''; };
  for (let c = -4; c <= 4; c += 1) if (c !== 0 && c !== 4) o += clipLine(c, 'mute');
  o += clipLine(0, 'ink-b') + clipLine(4, 'ink-b');
  o += path(curve((x) => x * x, -2.28, 2.28, sx, sy), 'ln');
  o += circle(sx(1), sy(0), 4.5, 'ink-f') + text(sx(1) + 6, sy(0) + 18, '(1, 0)', 'tb');
  o += circle(sx(0), sy(0), 3, 'ln-f') + circle(sx(2), sy(4), 3, 'ln-f');
  o += text(sx(2.0) - 6, sy(4) - 8, '(2, 4)', 'ts', 'end');
  o += text(sx(-0.15), sy(3.9), 'y = x²', 'tl', 'end');
  o += text(sx(1.7), sy(-2.4), 'y = 4x − 4', 'tb');
  const X = 350;
  o += text(X, 40, 'y = xy′ − (y′)² / 4', 'tb');
  o += text(X, 66, '灰线：y = cx − c²/4（c 取整数），', 'ts') + text(X, 84, '每一条都是 solution。', 'ts');
  o += text(X, 112, '彩线 y = x² 也是 solution，', 'ts') + text(X, 130, '它和每条 line 相切，', 'ts') + text(X, 148, '叫 singular solution。', 'ts');
  o += text(X, 180, '过 (1, 0) 的 solution 至少两条：', 'ts') + text(X, 198, 'y = 0 和 y = 4x − 4；', 'ts');
  o += text(X, 216, '再拼上 parabola 的一段', 'ts') + text(X, 234, '还能拼出更多。', 'ts');
  return svg(560, 272, o, 'Clairaut equation 的 solution：一族直线 y=cx−c²/4，它们的 envelope 是 parabola y=x²；过点 (1,0) 有两条直线 solution');
}

// ---------- 第 2 站动图：Picard iteration，x' = x，x(0) = 1 ----------
function picardA() {
  const N = 6, polys = [];
  for (let n = 0; n <= N; n++) polys.push((t) => { let s = 0, term = 1; for (let k = 0; k <= n; k++) { s += term; term *= t / (k + 1); } return s; });
  const sx = lin(-2, 2, 50, 330), sy = lin(-1.2, 7.6, 250, 24);
  let o = axes({ sx, sy, x0: -2, x1: 2, y0: -1.2, y1: 7.6, xt: [[-2, '−2'], [-1, '−1'], [0, '0'], [1, '1'], [2, '2']], yt: [[-1, '−1'], [1, '1'], [3, '3'], [5, '5'], [7, '7']], xAt: 0, xl: 't' });
  o += line(sx(1), sy(-1.2), sx(1), sy(7.6), 'grid');
  o += path(curve(Math.exp, -2, 2, sx, sy), 'ink-b');
  o += text(sx(1.98), sy(7.35), 'eᵗ', 'tb', 'end');
  const hold = 1.7, T = (N + 1) * hold + 0.8;
  const kt = [0], fr = [0];
  for (let n = 1; n <= N; n++) { kt.push((n * hold) / T); fr.push(n); }
  kt.push(1); fr.push(N);
  const clip = (f) => { const pts = []; for (let k = 0; k <= 160; k++) { const t = -2 + (4 * k) / 160; pts.push([sx(t), sy(Math.max(-1.2, Math.min(7.6, f(t))))]); } return d(pts); };
  o += apath(fr.map((n) => clip(polys[n])), kt, T, 'ln', true);
  const v1 = fr.map((n) => polys[n](1));
  o += `<circle cx="${f1(sx(1))}" cy="${f1(sy(v1[0]))}" r="4.5" class="ln-f">${anim('cy', v1.map((v) => f1(sy(v))), kt, T, true)}</circle>`;
  const X = 350;
  o += text(X, 40, 'φ₀ = 1，', 'tb') + text(X, 60, 'φₙ₊₁(t) = 1 + ∫₀ᵗ φₙ(s) ds', 'tb');
  const formulas = ['φ₀ = 1', 'φ₁ = 1 + t', 'φ₂ = 1 + t + t²/2', 'φ₃ = … + t³/6', 'φ₄ = … + t⁴/24', 'φ₅ = … + t⁵/120', 'φ₆ = … + t⁶/720'];
  for (let n = 0; n <= N; n++) {
    const on = fr.map((k) => k === n);
    const v = polys[n](1);
    o += grp(text(X, 100, formulas[n], 'tl') + text(X, 124, `φ${'₀₁₂₃₄₅₆'[n]}(1) = ${v.toFixed(4)}`, 't') + text(X, 144, `e − φ${'₀₁₂₃₄₅₆'[n]}(1) = ${(Math.E - v).toFixed(4)}`, 'ts'), on, kt, T);
  }
  o += text(X, 184, '每一轮把上一轮代进 integral，', 'ts') + text(X, 202, '多对一个 Taylor term。', 'ts');
  o += text(X, 236, '圆点：t = 1 处的值，', 'ts') + text(X, 254, '逼近 e = 2.7183。', 'ts');
  return svgA(560, 266, o, '动图：对 x 撇等于 x、x(0)=1 做 Picard iteration，iterate 依次是 e 的 t 次方的 Taylor polynomial，一轮比一轮贴近 e 的 t 次方');
}

// ---------- 第 2 站：uniqueness 把 solution 关在两个 equilibrium 之间 ----------
function trap() {
  const f = (t, y) => [(y[0] ** 3 - y[0]) / (1 + t * t * y[0] * y[0])];
  const sx = lin(-4, 4, 50, 360), sy = lin(-1.75, 1.75, 250, 24);
  let o = axes({ sx, sy, x0: -4, x1: 4, y0: -1.75, y1: 1.75, xt: [[-4, '−4'], [-2, '−2'], [0, '0'], [2, '2'], [4, '4']], yt: [[-1, '−1'], [0, '0'], [1, '1']], xl: 't' });
  o += rect(sx(-4), sy(1), sx(4) - sx(-4), sy(0) - sy(1), 'wash');
  for (const c of [-1, 0, 1]) o += line(sx(-4), sy(c), sx(4), sy(c), 'ink-b');
  const draw = (x0, cls) => {
    for (const t1 of [4, -4]) {
      const s = rk4(f, 0, [x0], t1, 800), pts = [];
      for (const [t, y] of s) { if (Math.abs(y[0]) > 1.75) break; pts.push([sx(t), sy(y[0])]); }
      o += path(d(thin(pts, 4)), cls);
    }
  };
  for (const x0 of [0.15, 0.5, 0.85, 0.97]) draw(x0, x0 === 0.5 ? 'ln' : 'ink');
  for (const x0 of [-0.5, -0.9]) draw(x0, 'mute');
  for (const x0 of [1.03, 1.15]) draw(x0, 'mute');
  o += circle(sx(0), sy(0.5), 4.5, 'ink-f') + line(sx(-2.2), sy(0.3), sx(0) - 5, sy(0.48), 'mute') + text(sx(-2.25), sy(0.3) + 5, 'x(0) = ½', 'tb', 'end');
  const X = 375;
  o += text(X, 40, "x′ = (x³ − x) / (1 + t²x²)", 'tb');
  o += text(X, 66, 'x ≡ 0、x ≡ 1、x ≡ −1', 't') + text(X, 84, '都是 solution（粗黑线）。', 't');
  o += text(X, 118, '从 x(0) = ½ 出发的 solution', 'ts') + text(X, 136, '（粗彩线）若碰到 x = 1，', 'ts');
  o += text(X, 154, '在碰点就有两条 solution', 'ts') + text(X, 172, '同过一点，违反 uniqueness。', 'ts');
  o += text(X, 206, '所以它永远留在浅色带里，', 'ts') + text(X, 224, '只能贴近、不能穿过。', 'ts');
  return svg(560, 284, o, '方程 x 撇等于 x 三次方减 x 除以 1 加 t 平方 x 平方 的若干 solution：constant solution 0、1、负 1 把 plane 分成几条带，从 x(0)=1/2 出发的 solution 始终留在 0 和 1 之间');
}

// ---------- 第 3 站动图：Wronskian 是两个 state vector 张成的面积 ----------
function wronskA() {
  // y'' + ½y' + (65/16)y = 0：y₁ = e^(−x/4) cos 2x，y₂ = e^(−x/4) sin 2x，W = 2e^(−x/2)
  const Y1 = (x) => [Math.exp(-x / 4) * Math.cos(2 * x), Math.exp(-x / 4) * (-0.25 * Math.cos(2 * x) - 2 * Math.sin(2 * x))];
  const Y2 = (x) => [Math.exp(-x / 4) * Math.sin(2 * x), Math.exp(-x / 4) * (-0.25 * Math.sin(2 * x) + 2 * Math.cos(2 * x))];
  const O = [150, 146], S = 50;
  const P = ([a, b]) => [O[0] + S * a, O[1] - S * b];
  const N = 80, X1 = 4, T = 9;
  const xs = [], kt = [];
  for (let i = 0; i <= N; i++) { xs.push((X1 * i) / N); kt.push(i / N); }
  let o = line(O[0] - 130, O[1], O[0] + 130, O[1], 'axis') + line(O[0], O[1] - 128, O[0], O[1] + 128, 'axis');
  o += text(O[0] + 128, O[1] - 6, 'y', 'ts', 'end') + text(O[0] - 6, O[1] - 116, 'y′', 'ts', 'end');
  o += apath(xs.map((x) => { const a = P(Y1(x)), b = P(Y2(x)), c = P([Y1(x)[0] + Y2(x)[0], Y1(x)[1] + Y2(x)[1]]); return d([O, a, c, b]) + 'Z'; }), kt, T, 'wash ink-s');
  o += apath(xs.map((x) => d([O, P(Y1(x))])), kt, T, 'ink-b');
  o += apath(xs.map((x) => d([O, P(Y2(x))])), kt, T, 'ln');
  const t1 = xs.map((x) => P(Y1(x))), t2 = xs.map((x) => P(Y2(x)));
  o += acircle(t1.map((p) => p[0]), t1.map((p) => p[1]), kt, T, 4, 'ink-f');
  o += acircle(t2.map((p) => p[0]), t2.map((p) => p[1]), kt, T, 4, 'ln-f');
  // 右：W(x) 的 curve
  const sx = lin(0, 4, 330, 540), sy = lin(0, 2.2, 230, 60);
  o += axes({ sx, sy, x0: 0, x1: 4, y0: 0, y1: 2.2, xt: [0, 1, 2, 3, 4], yt: [[1, '1'], [2, '2']], xl: 'x' });
  o += path(curve((x) => 2 * Math.exp(-x / 2), 0, 4, sx, sy), 'ln');
  o += acircle(xs.map(sx), xs.map((x) => sy(2 * Math.exp(-x / 2))), kt, T, 4.5, 'ink-f');
  o += text(330, 44, 'W(x) = parallelogram 的 area = 2e' + sup('−x/2') + '', 'tb');
  o += text(536, 104, 'Abel：W(0) e' + sup('−∫p') + '', 'ts', 'end');
  o += text(160, 22, '黑：(y₁, y₁′)，彩：(y₂, y₂′)', 'tb');
  o += text(20, 290, 'y″ + ½y′ + (65/16)y = 0。两个 vector 一边转一边缩短，夹出的 area 从 2 按 e' + sup('−x/2') + ' 减小，永远不会变成 0。', 'ts');
  return svgA(560, 300, o, '动图：y 两撇加二分之一 y 撇加十六分之六十五 y 等于 0 的两个 solution 的 state vector 在 y–y撇 plane 里转动，它们张成的 parallelogram 的 area 即 Wronskian，按 2 乘 e 的负 x/2 次方减小');
}

// ---------- 第 4 站动图：shooting，y'' + λy = 0，y(0) = 0 ----------
function shootA() {
  const lams = [];
  for (let l = -1; l <= 10.5 + 1e-9; l += 0.25) lams.push(l);
  const yAt = (l, x) => (l > 1e-9 ? Math.sin(Math.sqrt(l) * x) / Math.sqrt(l) : l < -1e-9 ? Math.sinh(Math.sqrt(-l) * x) / Math.sqrt(-l) : x);
  const norm = (l) => { let m = 0; for (let k = 0; k <= 200; k++) m = Math.max(m, Math.abs(yAt(l, (Math.PI * k) / 200))); return m; };
  const sx = lin(0, Math.PI, 50, 330), sy = lin(-1.15, 1.15, 230, 40);
  let o = rect(sx(0), sy(1.15), sx(Math.PI) - sx(0), sy(-1.15) - sy(1.15), 'frame');
  o += line(sx(0), sy(0), sx(Math.PI), sy(0), 'axis');
  o += text(sx(0), 248, '0', 'ts', 'middle') + text(sx(Math.PI), 248, 'π', 'ts', 'middle');
  o += line(sx(Math.PI), sy(-1.15), sx(Math.PI), sy(1.15), 'ink-b');
  // 时间：λ = 1、4、9 处停一下
  const kt = [], idx = [];
  let t = 0;
  const dt = 0.11, stop = 1.4;
  lams.forEach((l, i) => { kt.push(t); idx.push(i); if ([1, 4, 9].some((e) => Math.abs(l - e) < 1e-9)) { t += stop; kt.push(t); idx.push(i); } t += dt; });
  const T = t + 0.6; kt.push(T); idx.push(lams.length - 1);
  const ktn = kt.map((v) => v / T);
  const shape = (l) => { const m = norm(l), pts = []; for (let k = 0; k <= 60; k++) { const x = (Math.PI * k) / 60; pts.push([sx(x), sy(yAt(l, x) / m)]); } return d(pts); };
  o += apath(idx.map((i) => shape(lams[i])), ktn, T, 'ln');
  const end = idx.map((i) => sy(yAt(lams[i], Math.PI) / norm(lams[i])));
  o += `<circle cx="${f1(sx(Math.PI))}" cy="${f1(end[0])}" r="5" class="ln-f">${anim('cy', end.map(f1), ktn, T)}</circle>`;
  o += circle(sx(0), sy(0), 4, 'ink-f');
  const X = 350;
  o += text(X, 40, 'y″ + λy = 0，y(0) = 0，y′(0) = 1', 'tb');
  o += text(X, 60, '（画的是除以最大值之后的形状）', 'ts');
  for (let i = 0; i < lams.length; i++) {
    const on = idx.map((j) => j === i), l = lams[i];
    const hit = [1, 4, 9].some((e) => Math.abs(l - e) < 1e-9);
    o += grp(text(X, 100, `λ = ${fmt(l, 3).replace(/0+$/, '').replace(/\.$/, '')}`, hit ? 'tl' : 't') + text(X, 122, `y(π) = ${fmt(yAt(l, Math.PI), 3)}`, hit ? 'tl' : 't') + (hit ? text(X, 144, `y(π) = 0：λ = ${l} 是 eigenvalue`, 'tl') : ''), on, ktn, T);
  }
  o += text(X, 186, 'λ ≤ 0：y 一路增大，', 'ts') + text(X, 204, '回不到 0。', 'ts');
  o += text(X, 228, 'λ > 0：y = sin(√λ x)/√λ，', 'ts') + text(X, 246, '√λ = 1, 2, 3 时正好落在 π。', 'ts');
  return svgA(560, 262, o, '动图：从 x=0 出发解 y 两撇加 lambda y 等于 0，lambda 从负 1 增大到 10.5，右端 y(π) 在 lambda 等于 1、4、9 时恰好为 0，这些就是 eigenvalue');
}

// ---------- 第 4 站：Green's function 是一个 point load 下的 string ----------
function green() {
  const sx = lin(0, Math.PI, 50, 360), sy = lin(-0.95, 0.25, 230, 50);
  let o = line(sx(0), sy(0), sx(Math.PI), sy(0), 'grid');
  o += poly([[sx(0) - 10, sy(0) - 12], [sx(0), sy(0)], [sx(0) - 10, sy(0) + 12]], 'ink-f') + poly([[sx(Math.PI) + 10, sy(0) - 12], [sx(Math.PI), sy(0)], [sx(Math.PI) + 10, sy(0) + 12]], 'ink-f');
  const G = (x, t) => (x <= t ? (x * (t - Math.PI)) / Math.PI : (t * (x - Math.PI)) / Math.PI);
  const ts = [Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4], lab = ['t = π/4', 't = π/2', 't = 3π/4'];
  ts.forEach((t, i) => {
    o += path(d([[sx(0), sy(0)], [sx(t), sy(G(t, t))], [sx(Math.PI), sy(0)]]), i === 1 ? 'ln' : 'ink');
    o += arrow(sx(t), sy(G(t, t)) - 36, sx(t), sy(G(t, t)) - 6, i === 1 ? 'ln' : 'mute');
    o += text(sx(t), sy(G(t, t)) + 20, lab[i], i === 1 ? 'tl' : 'ts', 'middle');
  });
  o += text(sx(Math.PI / 2) + 8, sy(G(Math.PI / 2, Math.PI / 2)) + 38, '最低点 −π/4 ≈ −0.785', 'ts', 'middle');
  o += text(sx(0), sy(0) - 18, 'y(0) = 0', 'ts', 'middle') + text(sx(Math.PI), sy(0) - 18, 'y(π) = 0', 'ts', 'middle');
  const X = 384;
  o += text(X, 44, 'G(·, t)：只在 x = t 一点受力', 'tb');
  o += text(X, 68, 'x ≠ t 处 y″ = 0，是 line；', 'ts') + text(X, 86, '两端 pin 住；', 'ts') + text(X, 104, '在 x = t 处 slope 跳 +1。', 'ts');
  o += text(X, 138, 'f 是许多小 point load', 'ts') + text(X, 156, 'f(t) dt 的叠加：', 'ts') + text(X, 178, 'y(x) = ∫₀' + sup('π') + ' G(x, t) f(t) dt', 't');
  o += text(X, 212, '左段 slope (t − π)/π，', 'ts') + text(X, 230, '右段 slope t/π，相差 1。', 'ts');
  return svg(560, 270, o, '边界条件 y(0)=y(π)=0 下 y 两撇等于 f 的 Green function：对固定的 t，G 是两端固定、在 t 处折一下的折线，t 等于 π/2 时最低点是负 π/4');
}

// ---------- 第 5 站：y'' + xy = 0 的两个 solution，zeros 交替出现 ----------
function interlace() {
  const s1 = rk4((t, y) => [y[1], -t * y[0]], 0, [1, 0], 9, 4500).map(([t, y]) => [t, y[0]]);
  const s2 = rk4((t, y) => [y[1], -t * y[0]], 0, [0, 1], 9, 4500).map(([t, y]) => [t, y[0]]);
  const z1 = zerosOf(s1), z2 = zerosOf(s2).filter((x) => x > 1e-6);
  const sx = lin(0, 9, 40, 530), sy = lin(-1.1, 1.45, 170, 22);
  let o = line(sx(0), sy(0), sx(9), sy(0), 'axis');
  for (let k = 0; k <= 9; k += 1) o += line(sx(k), sy(0), sx(k), sy(0) + 4, 'axis') + text(sx(k), sy(0) + 16, String(k), 'ts', 'middle');
  o += path(d(thin(s1, 8).map(([t, y]) => [sx(t), sy(y)])), 'ink-b') + path(d(thin(s2, 8).map(([t, y]) => [sx(t), sy(y)])), 'ln');
  for (const x of z1) o += circle(sx(x), sy(0), 4, 'ink-f');
  for (const x of z2) o += circle(sx(x), sy(0), 4, 'ln-f');
  o += circle(sx(0), sy(0), 4, 'ln-f');
  o += text(sx(4.4), sy(1.3), '黑 y₁：y(0) = 1，y′(0) = 0', 'tb') + text(sx(4.4), sy(1.05), '彩 y₂：y(0) = 0，y′(0) = 1', 'tl');
  const all = [...z1.map((x) => [x, 1]), ...z2.map((x) => [x, 2]), [0, 2]].sort((a, b) => a[0] - b[0]);
  o += text(40, 205, 'Zero 从左到右：' + all.map(([x, k]) => (k === 1 ? '●' : '○') + x.toFixed(2)).join(' '), 'ts');
  o += text(40, 225, '●是 y₁ 的 zero，○是 y₂ 的 zero，一个隔一个，没有两个同类挨着。', 'ts');
  return svg(560, 235, o, 'y 两撇加 x y 等于 0 的两个 linearly independent solution 在 0 到 9 上的 graph，两者的 zero 交替出现');
}

// ---------- 第 5 站：Bessel equation normal form 的 zero 间距和 π 比 ----------
function bessel() {
  const sx = lin(0, 20, 46, 530);
  let o = '';
  const panel = (p, y0, title, note) => {
    const sy = lin(-1, 1, y0 + 70, y0);
    const u = (x) => Math.sqrt(x) * besselJ(p, x);
    const pts = []; for (let k = 0; k <= 800; k++) { const x = (20 * k) / 800; pts.push([x, u(x)]); }
    const z = zerosOf(pts).filter((x) => x > 0.01);
    o += line(sx(0), sy(0), sx(20), sy(0), 'axis');
    o += path(d(pts.map(([x, y]) => [sx(x), sy(Math.max(-1, Math.min(1, y)))])), p === 0 ? 'ln' : 'ink-b');
    z.forEach((x) => { o += circle(sx(x), sy(0), 3.5, 'ink-f'); });
    o += text(46, y0 - 10, title, 'tb');
    const gaps = z.slice(1).map((x, i) => x - z[i]);
    o += text(530, y0 - 10, '间距 ' + gaps.slice(0, 5).map((g) => g.toFixed(3)).join('，'), 'ts', 'end');
    o += text(530, y0 + 90, note, 'ts', 'end');
  };
  panel(0, 40, 'p = 0：u″ + (1 + 1/(4x²))u = 0', '比 1 大：间距都小于 π = 3.1416，从下面逼近 π');
  panel(1, 170, 'p = 1：u″ + (1 − 3/(4x²))u = 0', '比 1 小：间距都大于 π，从上面逼近 π');
  for (let k = 0; k <= 20; k += 5) o += text(sx(k), 290, String(k), 'ts', 'middle');
  o += text(46, 308, 'u = √x Jₚ(x)，zero 和 Jₚ 相同。第一个 zero：J₀ 在 2.405，J₁ 在 3.832。', 'ts');
  return svg(560, 316, o, 'Bessel function 的 normal form：p=0 时相邻 zero 的间距小于 π，p=1 时大于 π，两者都随 x 增大逼近 π');
}

// ---------- 第 6 站动图：四种 critical point，点沿 trajectory 按真实时间走 ----------
function phaseA() {
  const panels = [
    { A: [[-3, 1], [1, -3]], title: 'node：λ = −2, −4', sub: '沿 (1, 1) 方向进入', tmax: 1.6, starts: [[1, 0.2], [0.2, 1], [-1, -0.2], [-0.2, -1], [1, -0.9], [-1, 0.9], [-0.3, 1], [0.3, -1]] },
    { A: [[2, 1], [-3, -2]], title: 'saddle：λ = 1, −1', sub: '例 4.8，平移到原点', tmax: 2.6, starts: [0.04, -0.04, 0.12, -0.12].flatMap((b) => [[0.38 + b, -1.14 - b], [-0.38 - b, 1.14 + b]]) },
    { A: [[-1, -4], [1, -1]], title: 'spiral：λ = −1 ± 2i', sub: 'c = 1 &gt; 0：counterclockwise 转进去', tmax: 3, starts: [[1, 0], [-1, 0], [0, 0.55], [0, -0.55]] },
    { A: [[0, 1], [-4, 0]], title: 'center：λ = ±2i', sub: 'c = −4 &lt; 0：clockwise 绕 ellipse', tmax: Math.PI, starts: [[0.2, 0], [0.4, 0], [0.55, 0]] },
  ];
  const T = 6, N = 60, kt = []; for (let i = 0; i <= N; i++) kt.push(i / N);
  let o = '';
  panels.forEach((pn, k) => {
    const x0 = 14 + (k % 2) * 276, y0 = 30 + Math.floor(k / 2) * 196, W = 256, H = 150;
    const sx = lin(-1.25, 1.25, x0, x0 + W * 0.62), sy = lin(-1.25, 1.25, y0 + H, y0);
    const cx = (x0 + x0 + W * 0.62) / 2;
    o += rect(x0, y0, W * 0.62, H, 'frame');
    o += line(x0, sy(0), x0 + W * 0.62, sy(0), 'grid') + line(sx(0), y0, sx(0), y0 + H, 'grid');
    const f = (t, y) => [pn.A[0][0] * y[0] + pn.A[0][1] * y[1], pn.A[1][0] * y[0] + pn.A[1][1] * y[1]];
    const inside = (p) => Math.abs(p[0]) <= 1.25 && Math.abs(p[1]) <= 1.25;
    for (const st of pn.starts) {
      const s = rk4(f, 0, st, pn.tmax, 600);
      const pts = []; for (const [, y] of s) { if (!inside(y)) break; pts.push([sx(y[0]), sy(y[1])]); }
      o += path(d(thin(pts, 6)), 'mute');
      const pos = []; for (let i = 0; i <= N; i++) { const j = Math.min(600, Math.round((i / N) * 600)); const y = s[j][1]; pos.push(inside(y) ? y : s[Math.max(0, pts.length - 1)][1]); }
      o += acircle(pos.map((p) => sx(p[0])), pos.map((p) => sy(p[1])), kt, T, 3.5, 'ln-f');
    }
    o += circle(sx(0), sy(0), 3, 'ink-f');
    o += text(x0 + W * 0.62 + 8, y0 + 18, pn.title.split('：')[0], 'tb');
    o += text(x0 + W * 0.62 + 8, y0 + 38, pn.title.split('：')[1], 't');
    o += text(x0 + W * 0.62 + 8, y0 + 62, 'A = [' + pn.A.map((r) => r.map((v) => fmt(v, 0)).join(' ')).join('; ') + ']', 'ts');
    const subs = pn.sub.split('：');
    o += text(x0 + W * 0.62 + 8, y0 + 86, subs[0] + (subs[1] ? '：' : ''), 'ts');
    if (subs[1]) o += text(x0 + W * 0.62 + 8, y0 + 104, subs[1], 'ts');
    void cx;
  });
  o += text(280, 404, '灰线是 trajectory，彩点按真实时间沿它走（动图里 1 秒约等于 t 走过 0.27 到 0.52）。', 'ts', 'middle');
  return svgA(560, 412, o, '动图：四种 critical point 的 phase portrait，node、saddle、spiral、center，彩点沿 trajectory 按真实时间移动');
}

// ---------- 第 6 站：trace–determinant plane ----------
function trdet() {
  const sx = lin(-7, 7, 40, 400), sy = lin(-3, 13, 262, 24);
  let o = rect(sx(-7), sy(0), sx(7) - sx(-7), sy(-3) - sy(0), 'wash2');
  o += line(sx(-7), sy(0), sx(7), sy(0), 'axis') + line(sx(0), sy(-3), sx(0), sy(13), 'axis');
  o += path(curve((t) => (t * t) / 4, -7, 7, sx, sy), 'ln');
  o += line(sx(0), sy(0), sx(0), sy(13), 'ink-b');
  o += text(sx(6.9), sy(0) + 16, 'T = trace', 'ts', 'end') + text(sx(0) + 6, sy(12.6), 'D = det', 'ts');
  o += text(sx(4.9), sy(-1.8), 'D &lt; 0：saddle', 'tb', 'middle');
  o += text(sx(-5.2), sy(2.2), 'node', 'tb', 'middle') + text(sx(-5.2), sy(1.0), 'stable', 'ts', 'middle');
  o += text(sx(5.2), sy(2.2), 'node', 'tb', 'middle') + text(sx(5.2), sy(1.0), 'unstable', 'ts', 'middle');
  o += text(sx(-2.6), sy(10.4), 'spiral', 'tb', 'middle') + text(sx(-2.6), sy(9.2), 'stable', 'ts', 'middle');
  o += text(sx(2.6), sy(10.4), 'spiral', 'tb', 'middle') + text(sx(2.6), sy(9.2), 'unstable', 'ts', 'middle');
  o += text(sx(0) + 6, sy(7), 'center', 'tb');
  o += line(sx(3.7), sy(12.2), sx(6.5), sy(10.7), 'mute') + text(sx(3.6), sy(12.2) + 4, 'D = T²/4', 'tl', 'end');
  const pts = [[-6, 8, '例 4.3'], [0, -1, '例 4.8'], [-2, 5, 'spiral'], [0, 4, '例 4.5']];
  for (const [T, D, lab] of pts) { o += circle(sx(T), sy(D), 4, 'ink-f'); o += T === -6 ? text(sx(T) - 4, sy(D) + 18, lab, 'ts', 'end') : text(sx(T) + (T === 0 ? -7 : 7), sy(D) + 4, lab, 'ts', T === 0 ? 'end' : 'start'); }
  const X = 418;
  o += text(X, 44, 'λ² − Tλ + D = 0', 'tb');
  o += text(X, 70, 'λ₁λ₂ = D，λ₁ + λ₂ = T，', 'ts') + text(X, 88, 'discriminant T² − 4D。', 'ts');
  o += text(X, 120, 'D &lt; 0：两个 real root', 'ts') + text(X, 138, '异号。', 'ts');
  o += text(X, 164, 'Parabola 以上：complex，', 'ts') + text(X, 182, 'real part = T/2。', 'ts');
  o += text(X, 208, 'Parabola 以下、D &gt; 0：', 'ts') + text(X, 226, '同号 real root。', 'ts');
  o += text(X, 248, 'Parabola 上：', 'ts') + text(X, 266, 'repeated root。', 'ts');
  return svg(560, 276, o, 'Trace determinant plane：横轴 trace，纵轴 determinant，D 小于 0 是 saddle，parabola D 等于 T 平方除以 4 以上是 spiral，以下是 node，正的 D 轴上是 center；四个例子的位置已标出');
}

// ---------- 第 7 站动图：partial sum，一个 R = 1，一个 R = ∞ ----------
function seriesA() {
  const N = 9, hold = 1.3, T = (N + 1) * hold + 0.8;
  const kt = [0], fr = [0];
  for (let n = 1; n <= N; n++) { kt.push((n * hold) / T); fr.push(n); }
  kt.push(1); fr.push(N);
  let o = '';
  // 左：artanh x = x + x³/3 + x⁵/5 + …
  {
    const sx = lin(-1.5, 1.5, 30, 260), sy = lin(-2.6, 2.6, 230, 40);
    o += rect(sx(-1), sy(2.6), sx(1) - sx(-1), sy(-2.6) - sy(2.6), 'wash');
    o += line(sx(-1.5), sy(0), sx(1.5), sy(0), 'axis') + line(sx(0), sy(-2.6), sx(0), sy(2.6), 'axis');
    for (const v of [-1, 1]) o += line(sx(v), sy(-2.6), sx(v), sy(2.6), 'dash') + text(sx(v), 248, v < 0 ? '−1' : '1', 'ts', 'middle');
    o += path(curve(Math.atanh, -0.995, 0.995, sx, sy, 300).replace(/^/, ''), 'ink-b');
    const S = (n) => (x) => { let s = 0; for (let k = 0; k <= n; k++) s += x ** (2 * k + 1) / (2 * k + 1); return s; };
    const clip = (f) => { const pts = []; for (let k = 0; k <= 200; k++) { const x = -1.5 + (3 * k) / 200; pts.push([sx(x), sy(Math.max(-2.6, Math.min(2.6, f(x))))]); } return d(pts); };
    o += apath(fr.map((n) => clip(S(n))), kt, T, 'ln', true);
    o += text(145, 22, 'Legendre p = 0：x + x³/3 + x⁵/5 + ⋯', 'tb', 'middle');
    o += text(145, 266, '粗黑线 ½ln((1 + x)/(1 − x))；浅色带 |x| &lt; 1', 'ts', 'middle');
  }
  // 右：Airy 型 y'' + xy = 0，y(0) = 1，y'(0) = 0
  {
    const sx = lin(0, 8, 300, 540), sy = lin(-2.6, 2.6, 230, 40);
    o += line(sx(0), sy(0), sx(8), sy(0), 'axis') + line(sx(0), sy(-2.6), sx(0), sy(2.6), 'axis');
    for (const v of [2, 4, 6, 8]) o += text(sx(v), 246, String(v), 'ts', 'middle');
    const sol = rk4((t, y) => [y[1], -t * y[0]], 0, [1, 0], 8, 3200);
    o += path(d(thin(sol, 12).map(([t, y]) => [sx(t), sy(y[0])])), 'ink-b');
    const a = [1]; for (let k = 1; k <= 3 * N + 3; k++) a.push(0);
    const c = [1, 0, 0]; for (let n = 1; n <= 3 * N + 3; n++) c.push(-c[n - 1] / ((n + 2) * (n + 1)));
    const S = (n) => (x) => { let s = 0; for (let k = 0; k <= n; k++) s += c[3 * k] * x ** (3 * k); return s; };
    const clip = (f) => { const pts = []; for (let k = 0; k <= 200; k++) { const x = (8 * k) / 200; pts.push([sx(x), sy(Math.max(-2.6, Math.min(2.6, f(x))))]); } return d(pts); };
    o += apath(fr.map((n) => clip(S(n))), kt, T, 'ln', true);
    o += text(420, 22, 'y″ + xy = 0：1 − x³/6 + x⁶/180 − ⋯', 'tb', 'middle');
    o += text(420, 266, '粗黑线是 numerical solution；R = ∞', 'ts', 'middle');
    void a;
  }
  for (let n = 0; n <= N; n++) {
    const on = fr.map((k) => k === n);
    o += grp(text(280, 290, `彩线：前 ${n + 1} 个 nonzero term 的 partial sum`, 'tl', 'middle'), on, kt, T);
  }
  return svgA(560, 300, o, '动图：左边是 Legendre equation 的 series solution x 加 x 立方除以 3 加…的 partial sum，只在 x 的绝对值小于 1 时 converge；右边是 y 两撇加 x y 等于 0 的 series solution 的 partial sum，在整条 line 上都逐渐贴近 numerical solution');
}

// ---------- 第 7 站：regular singular point 处的两个 solution ----------
function frob() {
  const sx = lin(0, 4, 50, 380), sy = lin(-3.2, 3.2, 250, 24);
  let o = axes({ sx, sy, x0: 0, x1: 4, y0: -3.2, y1: 3.2, xt: [0, 1, 2, 3, 4], yt: [[-3, '−3'], [-1, '−1'], [1, '1'], [3, '3']], xAt: 0, xl: 'x' });
  o += path(curve((x) => Math.sin(3 * x) / (3 * x), 0.001, 4, sx, sy), 'ink-b');
  const pts = []; for (let k = 0; k <= 400; k++) { const x = 0.02 + (3.98 * k) / 400, y = Math.cos(3 * x) / x; if (Math.abs(y) <= 3.2) pts.push([sx(x), sy(y)]); }
  o += path(d(pts), 'ln');
  o += circle(sx(0), sy(1), 4, 'ink-f');
  o += line(sx(0.05), sy(1.03), sx(0.62), sy(1.42), 'mute') + text(sx(0.66), sy(1.42) + 4, 'sin 3x / (3x) → 1', 'tb');
  o += text(sx(0.42), sy(2.9), 'cos 3x / x → ∞', 'tl');
  const X = 398;
  o += text(X, 44, 'xy″ + 2y′ + 9xy = 0', 'tb');
  o += text(X, 70, 'Indicial：r(r + 1) = 0，', 'ts') + text(X, 88, 'r = 0 和 r = −1。', 'ts');
  o += text(X, 120, 'r = 0：x⁰ 乘一个', 'ts') + text(X, 138, 'power series，', 'ts') + text(X, 156, '在 0 处有限（黑）。', 'ts');
  o += text(X, 188, 'r = −1：x⁻¹ 乘', 'ts') + text(X, 206, 'power series，', 'ts') + text(X, 224, '在 0 处 blow up（彩）。', 'ts');
  return svg(560, 262, o, 'xy 两撇加 2y 撇加 9xy 等于 0 的两个 Frobenius solution：sin 3x 除以 3x 在 0 处趋于 1，cos 3x 除以 x 在 0 处趋于无穷');
}

export default {
  'ma3220-nonuniq': nonuniq,
  'ma3220-blowup': blowup,
  'ma3220-airy': airy,
  'ma3220-exact': exact,
  'ma3220-clairaut': clairaut,
  'ma3220-picard': picardA,
  'ma3220-trap': trap,
  'ma3220-wronsk': wronskA,
  'ma3220-shoot': shootA,
  'ma3220-green': green,
  'ma3220-interlace': interlace,
  'ma3220-bessel': bessel,
  'ma3220-phase': phaseA,
  'ma3220-trdet': trdet,
  'ma3220-series': seriesA,
  'ma3220-frob': frob,
};
