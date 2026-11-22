import { svg, svgA, lin, logx, d, path, line, rect, circle, poly, text, arrow, curve, area, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
const fmt = (v, n = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(n);
// 复数
const C = (re, im = 0) => ({ re, im });
const cadd = (a, b) => C(a.re + b.re, a.im + b.im);
const csub = (a, b) => C(a.re - b.re, a.im - b.im);
const cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const cdiv = (a, b) => { const q = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / q, (a.im * b.re - a.re * b.im) / q); };
const cabs = (a) => Math.hypot(a.re, a.im);
const cexp = (t) => C(Math.cos(t), Math.sin(t)); // e^{it}
const conj = (a) => C(a.re, -a.im);
const csqrt = (a) => { const r = Math.sqrt(cabs(a)), t = Math.atan2(a.im, a.re) / 2; return C(r * Math.cos(t), r * Math.sin(t)); };
// ODE：RK4，f(t, y) -> dy
function rk4(f, y0, t0, t1, n) {
  const out = [y0.slice()]; let y = y0.slice(), t = t0; const h = (t1 - t0) / n;
  for (let i = 0; i < n; i++) {
    const k1 = f(t, y), k2 = f(t + h / 2, y.map((v, j) => v + h / 2 * k1[j])), k3 = f(t + h / 2, y.map((v, j) => v + h / 2 * k2[j])), k4 = f(t + h, y.map((v, j) => v + h * k3[j]));
    y = y.map((v, j) => v + h / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])); t += h; out.push(y.slice());
  }
  return out;
}
// erfc（Abramowitz–Stegun 7.1.26，误差 < 1.5e-7）
const erfc = (x) => { const t = 1 / (1 + 0.3275911 * x); return t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429)))) * Math.exp(-x * x); };
// Falkner–Skan（Hartree 形式）f''' + f f'' + β(1 − f'²) = 0；返回 [η, f'] 的表
const fsk = (beta, s, etamax = 6, n = 600) => rk4((t, y) => [y[1], y[2], -y[0] * y[2] - beta * (1 - y[1] * y[1])], [0, 0, s], 0, etamax, n).map((y, i) => [etamax * i / n, y[1], y[0]]);
const G = 9.81;

// ---------- 开头第一件事：cylinder 表面的 pressure，前后对称 ----------
function dalembert() {
  const cx = 190, cy = 140, a = 58;
  let o = '';
  // potential flow 的 streamline：ψ = U(y − a²y/(x²+y²))，单位 U = a = 1
  const yOf = (x, c) => { let lo = 1e-6, hi = 4; if (c < 0) { lo = -4; hi = -1e-6; } const g = (y) => y - y / (x * x + y * y) - c; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((g(m) > 0) === (g(hi) > 0)) hi = m; else lo = m; } return (lo + hi) / 2; };
  for (const c of [0.3, 0.75, 1.3, 2.0]) for (const sg of [1, -1]) {
    const pts = []; for (let i = 0; i <= 120; i++) { const x = -2.9 + 5.8 * i / 120; pts.push([cx + a * x, cy - a * yOf(x, sg * c)]); }
    o += path(d(pts), 'grid');
  }
  o += line(cx - 2.9 * a, cy, cx - a, cy, 'grid') + line(cx + a, cy, cx + 2.9 * a, cy, 'grid');
  o += circle(cx, cy, a, 'paper');
  for (let th = 0; th < 360; th += 15) {
    const t = th * Math.PI / 180, cp = 1 - 4 * Math.sin(t) ** 2, L = 13 * Math.abs(cp);
    const s = [cx + a * Math.cos(t), cy - a * Math.sin(t)], u = [Math.cos(t), -Math.sin(t)];
    if (L < 2) continue;
    if (cp > 0) o += arrow(s[0] + u[0] * (L + 3), s[1] + u[1] * (L + 3), s[0] + u[0] * 2, s[1] + u[1] * 2, 'ink', 5);
    else o += arrow(s[0] + u[0] * 2, s[1] + u[1] * 2, s[0] + u[0] * (L + 2), s[1] + u[1] * (L + 2), 'ln', 5);
  }
  o += arrow(20, 40, 70, 40, 'ink') + text(20, 30, 'U', 'tb');
  o += text(cx - a - 22, cy + 22, 'Cp = +1', 'ts', 'end') + text(cx + a + 22, cy + 22, 'Cp = +1', 'ts', 'start');
  o += text(cx, cy - a - 50, 'Cp = −3', 'tl', 'middle') + text(cx, cy + a + 60, 'Cp = −3', 'tl', 'middle');
  const X = 395;
  o += text(X, 60, 'Potential flow 给出的', 'tb') + text(X, 80, 'surface pressure', 'tb');
  o += text(X, 110, '黑箭头：Cp > 0，推向表面', 't') + text(X, 130, '蓝箭头：Cp < 0，往外吸', 't');
  o += text(X, 160, '左右对称：前面推多少，', 't') + text(X, 180, '后面也推多少，drag = 0', 't');
  o += text(X, 206, '上下对称：lift = 0', 't');
  o += text(X, 236, 'Cp = (p − p∞) / ½ρU²', 'ts') + text(X, 254, '= 1 − 4 sin²θ', 'ts');
  return svg(560, 280, o, '绕 cylinder 的 potential flow 与表面 pressure 的箭头：前后两个 stagnation point 处 pressure 最高，顶部和底部最低，分布前后对称，所以合力为零');
}

// ---------- 开头第二件事：一个 1 m 高、1 km 宽的 hump 在 10 m 深的水上变陡 ----------
const SW = { h0: 10, a: 1, L: 1000 };
SW.c0 = Math.sqrt(G * SW.h0);
SW.V = (x0) => { const eta = SW.a * Math.exp(-(x0 * x0) / (SW.L * SW.L)); return 3 * Math.sqrt(G * (SW.h0 + eta)) - 2 * SW.c0; };
SW.eta = (x0) => SW.a * Math.exp(-(x0 * x0) / (SW.L * SW.L));
SW.tb = (() => { let m = 0; for (let i = 0; i <= 20000; i++) { const x = -4000 + 8000 * i / 20000, h = 0.5; const dv = (SW.V(x + h) - SW.V(x - h)) / (2 * h); if (dv < m) m = dv; } return -1 / m; })();
// 在跟着 c0 走的坐标 ξ = x − c0 t 里，t 时刻的 surface：ξ = x0 + (V − c0) t
const swCurve = (t, sx, sy) => { const pts = []; for (let i = 0; i <= 160; i++) { const x0 = -3200 + 6400 * i / 160; pts.push([sx(x0 + (SW.V(x0) - SW.c0) * t), sy(SW.eta(x0))]); } return pts; };
function steepen0() {
  const sx = lin(-3000, 3000, 40, 520), sy = lin(-0.4, 1.35, 150, 30);
  let o = rect(40, sy(-0.4) - 1, 480, 8, 'wash2');
  o += path(d(swCurve(0, sx, sy)), 'dash') + path(d(swCurve(SW.tb, sx, sy)), 'ln');
  o += line(40, sy(0), 520, sy(0), 'grid');
  o += text(sx(-1700), sy(0.62), 't = 0', 'ts', 'end');
  o += text(sx(700), sy(1.18), `t = ${SW.tb.toFixed(0)} s：前沿竖直`, 'tl', 'start');
  o += text(40, 178, `水深 10 m，hump 高 1 m、宽约 1 km（竖直方向放大了很多倍）。`, 'ts');
  o += text(40, 196, `画在跟着 √(gh₀) = ${SW.c0.toFixed(2)} m/s 走的坐标里，只看形状怎样变：`, 'ts');
  o += text(40, 214, `crest 比两侧快 ${(SW.V(0) - SW.c0).toFixed(2)} m/s，${SW.tb.toFixed(0)} s 后前沿变成竖直的墙。`, 'ts');
  return svg(560, 222, o, '一个高 1 米、宽约 1 公里的水面隆起在 10 米深的水上传播：顶部比前后跑得快，约 808 秒后前沿变成竖直');
}

// ---------- 开头第三件事：同样 10 m 处 5 m/s 的风，白天和夜里在 50 m 处差很多 ----------
const MO = { k: 0.4, z0: 0.1 };
MO.psi = (z, L) => { if (!L) return 0; const ze = z / L; if (ze >= 0) return -5 * ze; const x = (1 - 16 * ze) ** 0.25; return 2 * Math.log((1 + x) / 2) + Math.log((1 + x * x) / 2) - 2 * Math.atan(x) + Math.PI / 2; };
MO.us = (U10, L) => U10 * MO.k / (Math.log(10 / MO.z0) - MO.psi(10, L));
MO.U = (z, U10, L) => MO.us(U10, L) / MO.k * (Math.log(z / MO.z0) - MO.psi(z, L));
function wind0() {
  let o = '';
  const panel = (x0, title, L, note) => {
    const sy = lin(0, 60, 236, 46), su = (u) => u * 15;
    o += text(x0 + 120, 22, title, 'tb', 'middle');
    o += rect(x0 - 10, 236, 250, 6, 'wash2');
    o += rect(x0 + 12, sy(60), 4, 236 - sy(60), 'mute-f');
    for (const z of [2, 10, 30, 50]) {
      const u = MO.U(z, 5, L);
      o += arrow(x0 + 18, sy(z), x0 + 18 + su(u), sy(z), z === 10 ? 'ink' : 'ln');
      o += text(x0 + 24 + su(u), sy(z) + 4, `${u.toFixed(1)} m/s`, z === 10 ? 'tb' : 't');
      o += text(x0 + 6, sy(z) + 4, `${z} m`, 'ts', 'end');
    }
    o += text(x0 + 120, 262, note, 'ts', 'middle');
  };
  panel(60, '午后：地面被晒热', -30, 'Obukhov length L = −30 m');
  panel(320, '夜里：地面变冷', 60, 'L = +60 m');
  o += text(280, 284, '两边 10 m 处都是 5 m/s，地面 roughness 相同；50 m 处夜里的风比午后大一半以上。', 'ts', 'middle');
  return svg(560, 294, o, '同一个地点，10 米高处风速都是 5 米每秒：午后 50 米高处是 6.1，夜里是 9.5');
}

// ---------- 第 1 站：pipe 里的 Hagen–Poiseuille profile ----------
function pipe() {
  const X0 = 60, X1 = 330, cy = 130, R = 70;
  let o = rect(X0, cy - R - 10, X1 - X0, 10, 'wash2') + rect(X0, cy + R, X1 - X0, 10, 'wash2');
  o += line(X0, cy - R, X1, cy - R, 'ink') + line(X0, cy + R, X1, cy + R, 'ink') + line(X0 - 10, cy, X1 + 10, cy, 'dash');
  const xs = 80, umax = 100;
  const pts = []; for (let i = 0; i <= 60; i++) { const r = -1 + 2 * i / 60; pts.push([xs + umax * (1 - r * r), cy - R * r]); }
  o += line(xs, cy - R, xs, cy + R, 'mute') + path(d(pts), 'ln');
  for (const r of [-0.8, -0.5, -0.2, 0.2, 0.5, 0.8, 0]) o += arrow(xs, cy - R * r, xs + umax * (1 - r * r), cy - R * r, 'ln', 6);
  o += text(xs + umax + 4, cy - 10, 'u_max', 'tl');
  o += text(X0, cy - R - 18, 'p₁', 'tb') + text(X1, cy - R - 18, 'p₂ < p₁', 'tb', 'end');
  // force balance 的那个 fluid cylinder
  const rr = 0.45 * R, x1 = 248, x2 = 318;
  o += rect(x1, cy - rr, x2 - x1, 2 * rr, 'wash ink-s');
  o += arrow(x1 - 26, cy, x1 - 2, cy, 'ink', 6) + arrow(x2 + 26, cy, x2 + 2, cy, 'ink', 6);
  o += arrow(x2 - 10, cy - rr - 5, x1 + 10, cy - rr - 5, 'mute', 5) + arrow(x2 - 10, cy + rr + 5, x1 + 10, cy + rr + 5, 'mute', 5);
  o += text((x1 + x2) / 2, cy - rr + 16, 'radius r', 'ts', 'middle');
  o += text(x1 - 14, cy + 20, 'p₁πr²', 'ts', 'middle');
  const X = 360;
  o += text(X, 50, '中间那块 fluid cylinder：', 'tb');
  o += text(X, 72, '两端的 pressure 差推它往前，', 't') + text(X, 92, '侧面的 shear stress 拖它往后', 't');
  o += text(X, 122, 'a = 0.5 mm 的水管，每 m', 't') + text(X, 142, '压降 1000 Pa：', 't');
  o += text(X, 166, 'u_max = 6.25 cm/s', 'tb') + text(X, 186, 'mean speed = 3.13 cm/s', 't');
  o += text(X, 206, 'Q = 88 mL/h，Re = 31', 't');
  o += text(X, 236, 'a 翻倍，Q 变成 16 倍', 'tl');
  return svg(560, 252, o, 'Pipe 里的 Poiseuille flow：velocity profile 是 parabola，中心最快；一块半径 r 的 fluid cylinder 两端的 pressure 差与侧面的 shear stress 平衡');
}

// ---------- 第 1 站：plate 突然开始动，vorticity 向上 diffuse ----------
function rayleighA() {
  const nu = 1e-6, ts = [8, 16, 32, 0.25, 0.5, 1, 2, 4];
  const sy = lin(0, 25, 232, 30), su = lin(0, 1, 70, 300);
  const prof = (t) => { const pts = []; for (let i = 0; i <= 80; i++) { const y = 25 * i / 80; pts.push([su(erfc(y * 1e-3 / (2 * Math.sqrt(nu * t)))), sy(y)]); } return d(pts); };
  const hold = 1.4, T = hold * ts.length, kt = []; const seq = [];
  ts.forEach((t, i) => { kt.push(i * hold / T, (i * hold + hold * 0.75) / T); seq.push(t, t); });
  kt.push(1); seq.push(ts[ts.length - 1]);
  let o = axes({ sx: su, sy, x0: 0, x1: 1, y0: 0, y1: 25, xt: [], yt: [0, 5, 10, 15, 20, 25], xl: '', yl: 'y（mm）' });
  o += text(su(0), 256, '0', 'ts', 'middle') + text(su(1), 256, 'u₀', 'ts', 'middle') + text(su(0.5), 256, 'u', 'ts', 'middle');
  o += rect(su(0) - 6, 233, su(1) - su(0) + 12, 9, 'solid');
  o += arrow(su(0.6), 274, su(1.0), 274, 'ink', 6) + text(su(0.58), 278, 'plate 以 u₀ 向右', 'ts', 'end');
  o += apath(seq.map(prof), kt, T, 'ln');
  // 每 2.5 mm 一根 arrow（用线段 + 圆点代替箭头）
  for (let y = 2.5; y <= 22.6; y += 2.5) {
    const ds = seq.map((t) => d([[su(0), sy(y)], [su(erfc(y * 1e-3 / (2 * Math.sqrt(nu * t)))), sy(y)]]));
    o += apath(ds, kt, T, 'ln-dash');
  }
  const dl = (t) => 3.6428 * Math.sqrt(nu * t) * 1e3;
  o += apath(seq.map((t) => d([[su(0), sy(Math.min(dl(t), 25))], [su(1), sy(Math.min(dl(t), 25))]])), kt, T, 'dash');
  const X = 345;
  ts.forEach((t, i) => {
    const on = seq.map((s) => s === t);
    o += grp(text(X, 70, `t = ${t} s`, 'tl') + text(X, 94, `δ₉₉ = 3.64√(νt) = ${dl(t).toFixed(1)} mm`, 't'), on, kt, T);
  });
  o += text(X, 130, '水，ν = 1.0×10⁻⁶ m²/s', 'ts');
  o += text(X, 152, '虚横线：u 降到 1% u₀ 的高度', 'ts');
  o += text(X, 182, '每一帧 t 翻倍，δ 只长到 √2 倍', 'tb');
  o += text(X, 204, '要 diffuse 到 1 m 远：', 'ts') + text(X, 222, 'L²/ν = 10⁶ s，约 11.6 天', 'ts');
  return svgA(560, 286, o, '动图：plate 突然以 u0 开始向右运动，上方的水被逐渐带动；velocity profile 是 erfc，影响到的厚度按根号 t 增长，32 秒时约 20.6 毫米');
}

// ---------- 第 2 站：cylinder 加上 circulation，stagnation point 往下移 ----------
// w = U(z + a²/z) + iΓ/(2π) ln z，Γ > 0 是 clockwise circulation（U = a = 1）
const cylVel = (x, y, g) => { const z = C(x, y), z2 = cmul(z, z); const w = cadd(csub(C(1), cdiv(C(1), z2)), cdiv(C(0, g / (2 * Math.PI)), z)); return [w.re, -w.im]; };
function traceStream(vel, x, y, xEnd, ds = 0.02, nmax = 900, inside = () => false) {
  const pts = [[x, y]];
  for (let i = 0; i < nmax; i++) {
    const f = (p) => { const v = vel(p[0], p[1]); const s = Math.hypot(v[0], v[1]) || 1e-9; return [v[0] / s, v[1] / s]; };
    const p = [x, y], k1 = f(p), k2 = f([x + ds / 2 * k1[0], y + ds / 2 * k1[1]]), k3 = f([x + ds / 2 * k2[0], y + ds / 2 * k2[1]]), k4 = f([x + ds * k3[0], y + ds * k3[1]]);
    x += ds / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += ds / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
    if (inside(x, y)) break;
    pts.push([x, y]);
    if (x > xEnd) break;
  }
  return pts;
}
function cylA() {
  const cx = 175, cy = 140, s = 46, Ux = 3.3;
  const P = ([x, y]) => [cx + s * x, cy - s * y];
  const gs = [0, 0.25, 0.5, 0.75, 1.0]; // Γ / (4πUa)
  const hold = 2.2, T = hold * gs.length, kt = gs.map((_, i) => i / gs.length), n = gs.length;
  let o = '';
  gs.forEach((q, f) => {
    const g = q * 4 * Math.PI;
    let body = '';
    for (const y0 of [-2.4, -1.8, -1.25, -0.8, -0.4, -0.12, 0.12, 0.4, 0.8, 1.25, 1.8, 2.4]) {
      const pts = traceStream((x, y) => cylVel(x, y, g), -Ux, y0, Ux, 0.02, 1200, (x, y) => x * x + y * y < 1.0004);
      body += path(d(pts.filter(([x, y], i) => Math.abs(y) < 2.9 && (i % 3 === 0 || i === pts.length - 1)).map(P)), 'mute');
    }
    // 两个 stagnation point：sinθ = −Γ/(4πUa)
    const th = Math.asin(-q);
    for (const t of [th, Math.PI - th]) body += circle(...P([Math.cos(t), Math.sin(t)]), 4.5, 'ln-f');
    const Gam = q * 4 * Math.PI * 10 * 0.1, lift = 1.2 * 10 * Gam;
    const X = 360;
    body += text(X, 60, `Γ / (4πUa) = ${q}`, 'tl');
    body += text(X, 84, `stagnation point：sin θ = ${fmt(-q, 2)}`, 't');
    body += text(X, 104, q === 0 ? 'θ = 0° 与 180°' : q === 1 ? '两个点在底部重合' : `θ = ${fmt(th * 180 / Math.PI, 1)}° 与 ${(180 - th * 180 / Math.PI).toFixed(1)}°`, 't');
    body += text(X, 138, 'a = 0.1 m，U = 10 m/s 的空气：', 'ts');
    body += text(X, 158, `Γ = ${Gam.toFixed(2)} m²/s`, 't');
    body += text(X, 178, `lift = ρUΓ = ${lift.toFixed(1)} N/m`, 'tb');
    o += grp(body, gs.map((_, k) => k === f), kt, T);
  });
  o += circle(cx, cy, s, 'paper');
  o += arrow(cx - 1.6 * s, cy - 2 * s, cx - 0.9 * s, cy - 2 * s, 'ink') + text(cx - 1.6 * s, cy - 2 * s - 8, 'U', 'tb');
  const ar = []; for (let i = 0; i <= 30; i++) { const t = Math.PI * (0.75 - 0.5 * i / 30); ar.push([cx + 0.6 * s * Math.cos(t), cy - 0.6 * s * Math.sin(t)]); }
  o += path(d(ar), 'ink'); const e = ar[30], e0 = ar[27]; o += arrow(e0[0], e0[1], e[0], e[1], 'ink', 5);
  o += text(cx, cy + 5, 'Γ', 'tb', 'middle');
  o += text(360, 222, '上方的 flow 被加速、下方被减速：', 'ts') + text(360, 240, '上面 pressure 低，下面高，', 'ts') + text(360, 258, '合力朝上。', 'ts');
  return svgA(560, 282, o, '动图：绕 cylinder 的 potential flow 依次加上越来越强的 clockwise circulation，两个 stagnation point 从左右两端沿表面往下移动，在 Γ 等于 4πUa 时在底部重合');
}

// ---------- 第 2 站：flat plate 的 Kutta condition（Joukowski map） ----------
function kutta() {
  const al = 10 * Math.PI / 180, R = 1;
  const panel = (x0, G, title, note) => {
    const cx = x0 + 135, cy = 120, s = 52;
    const P = ([X, Y]) => [cx + s * X, cy - s * Y];
    const ea = C(Math.cos(al), -Math.sin(al)), eb = C(Math.cos(al), Math.sin(al));
    // dw/dz = e^{-iα} − R² e^{iα}/z² + iΓ/(2π z)；velocity = conj
    const vel = (x, y) => { const z = C(x, y); const w = cadd(csub(ea, cdiv(eb, cmul(z, z))), cdiv(C(0, G / (2 * Math.PI)), z)); return [w.re, -w.im]; };
    const J = ([x, y]) => { const z = C(x, y), q = cadd(z, cdiv(C(R * R), z)); return [q.re, q.im]; };
    let o = text(cx, 20, title, 'tb', 'middle');
    for (const off of [-1.5, -1.0, -0.6, -0.3, -0.1, 0.1, 0.3, 0.6, 1.0, 1.5]) {
      const st = [-4 * Math.cos(al) - off * Math.sin(al), -4 * Math.sin(al) + off * Math.cos(al)];
      const pts = traceStream(vel, st[0], st[1], 4.2, 0.015, 1500, (x, y) => x * x + y * y < 1.0002 * R * R);
      const m = pts.map(J).filter(([X, Y]) => Math.abs(X) < 2.55 && Math.abs(Y) < 1.75);
      o += path(d(m.map(P)), 'mute');
    }
    o += line(...P([-2, 0]), ...P([2, 0]), 'ink-b');
    o += rect(cx - 2 * s, cy - 2, 4 * s, 4, 'solid');
    o += arrow(x0 + 8, 182, x0 + 8 + 40 * Math.cos(al), 182 - 40 * Math.sin(al), 'ink', 6) + text(x0 + 8, 204, 'U，α = 10°', 'ts');
    o += circle(...P([2, 0]), 4, 'ln-f');
    o += text(cx + 2 * s, cy + 22, 'trailing edge', 'ts', 'middle');
    o += text(cx, 228, note, 'ts', 'middle');
    return o;
  };
  const GK = 4 * Math.PI * R * Math.sin(al);
  let o = panel(0, 0, 'Γ = 0', 'flow 绕过 trailing edge，那里 speed 无穷大');
  o += panel(285, GK, 'Γ = πcU sin α', 'flow 从 trailing edge 平顺地离开');
  return svg(560, 238, o, '一块 flat plate 以 10 度 angle of attack 放在 flow 里：左边没有 circulation，flow 从下面绕过尖锐的 trailing edge 跑到上面；右边加上 Kutta condition 要求的 circulation 后，flow 从 trailing edge 平顺地离开');
}

// ---------- 第 3 站：Blasius boundary layer ----------
const BLAS = (() => { // f''' + ½ f f'' = 0，f''(0) = 0.33206
  const tab = rk4((t, y) => [y[1], y[2], -0.5 * y[0] * y[2]], [0, 0, 0.332057], 0, 10, 1000).map((y, i) => [10 * i / 1000, y[1]]);
  return (eta) => { if (eta >= 10) return 1; const i = Math.floor(eta * 100), r = eta * 100 - i; return tab[i][1] * (1 - r) + tab[i + 1][1] * r; };
})();
function blasius() {
  const nu = 1e-6, U = 0.3, sx = lin(0, 1, 50, 450), sy = lin(0, 12, 200, 50); // y：mm
  let o = rect(40, 200, 480, 10, 'solid2');
  o += text(50, 228, 'leading edge', 'ts', 'start') + text(450, 228, 'x = 1 m', 'ts', 'middle');
  const d99 = (x) => 4.91 * Math.sqrt(nu * x / U) * 1e3;
  o += path(curve(d99, 0, 1, sx, sy), 'ln-dash');
  for (const x of [0.25, 0.5, 1]) {
    const sc = 1e3 * Math.sqrt(nu * x / U), base = sx(x), su = (u) => base + 60 * u;
    const pts = []; for (let i = 0; i <= 60; i++) { const y = 12 * i / 60; pts.push([su(BLAS(y / sc)), sy(y)]); }
    o += line(base, sy(0), base, sy(12), 'mute') + path(d(pts), 'ln');
    for (const y of [1, 2.5, 4, 6, 9]) { const u = BLAS(y / sc); if (u > 0.08) o += arrow(base, sy(y), su(u), sy(y), 'ln', 5); }
    o += text(base + 30, sy(12) - 6, `δ₉₉ = ${d99(x).toFixed(1)} mm`, 'ts', 'middle');
  }
  o += arrow(50, 14, 90, 14, 'ink') + text(96, 18, 'U = 0.3 m/s', 'tb');
  o += text(200, 18, '水，ν = 10⁻⁶ m²/s；竖直方向放大约 80 倍', 'ts');
  o += text(280, 250, '虚线：δ₉₉ = 4.91√(νx/U)，按 √x 变厚；三个 profile 形状相同，只是竖直方向拉长', 'ts', 'middle');
  return svg(560, 260, o, '水以 0.3 米每秒流过一块 1 米长的 flat plate：boundary layer 厚度按根号 x 增长，在板尾约 9 毫米；三个位置的 velocity profile 形状相同');
}

// ---------- 第 3 站：pressure gradient 改变 profile 的形状（Falkner–Skan） ----------
function fskFig() {
  const sx = lin(0, 1, 70, 330), sy = lin(0, 5, 230, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 5, xt: [0, 0.5, 1], yt: [0, 1, 2, 3, 4, 5], xl: 'u / U', yl: 'η' });
  const cases = [[1, 'β = 1：stagnation point 附近', 'ink'], [0, 'β = 0：flat plate', 'mute'], [-0.14, 'β = −0.14：adverse', 'ln-dash'], [-0.19884, 'β = −0.1988：separation', 'ln']];
  const endOf = (beta, m) => { const t = fsk(beta, m, 6, 600); const e = t[t.length - 1][1]; return Number.isFinite(e) ? e : -1; };
  const solveS = (beta) => { let hi = 1.6, lo = hi; while (lo > -0.05 && endOf(beta, lo) > 1) lo -= 0.01; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (endOf(beta, m) > 1) hi = m; else lo = m; } return (lo + hi) / 2; };
  const X = 350; let yy = 60;
  for (const [b, lab, cls] of cases) {
    const s = b < -0.198 ? 0 : solveS(b), t = fsk(b, s, 5, 500);
    o += path(d(t.map(([e, fp]) => [sx(fp), sy(e)])), cls);
    o += line(X, yy - 4, X + 24, yy - 4, cls) + text(X + 30, yy, lab, 'ts');
    o += text(X + 30, yy + 16, `wall 处的 slope f″(0) = ${s.toFixed(3)}`, 'ts');
    yy += 44;
  }
  o += text(X, yy + 4, 'β 越负，wall 附近的 fluid 越慢；', 'ts') + text(X, yy + 22, 'slope 降到 0 时 wall stress 为 0。', 'ts');
  return svg(560, 262, o, 'Falkner–Skan profile：favourable pressure gradient 使 wall 附近的 profile 更饱满，adverse 使它变瘪，β 约为 −0.199 时 wall 处的 slope 为零，这就是 separation');
}

// ---------- 第 4 站：两列 deep-water wave 叠加，crest 跑得比 envelope 快一倍 ----------
function groupA() {
  const k1 = 1, k2 = 1.21, w1 = 1, w2 = 1.1, Tp = 20 * Math.PI; // ω = √k（g = 1），ω₂/ω₁ = 11/10，Tp 后回到原样
  const cbar = (w1 + w2) / (k1 + k2), cg = (w2 - w1) / (k2 - k1), W = cbar * Tp;
  const sx = lin(0, W, 30, 530), sy = lin(-2.3, 2.3, 150, 40);
  const eta = (x, t) => Math.cos(k1 * x - w1 * t) + Math.cos(k2 * x - w2 * t);
  const env = (x, t, sg) => sg * 2 * Math.abs(Math.cos(0.5 * ((k2 - k1) * x - (w2 - w1) * t)));
  const N = 96, kt = [], ts = []; for (let i = 0; i <= N; i++) { kt.push(i / N); ts.push(Tp * i / N); }
  const prof = (f, M = 190) => ts.map((t) => { const p = []; for (let i = 0; i <= M; i++) { const x = W * i / M; p.push([sx(x), sy(f(x, t))]); } return d(p); });
  const T = 16;
  let o = line(30, sy(0), 530, sy(0), 'grid');
  o += apath(prof((x, t) => env(x, t, 1), 48), kt, T, 'dash') + apath(prof((x, t) => env(x, t, -1), 48), kt, T, 'dash');
  o += apath(prof(eta), kt, T, 'ln');
  const xc = ts.map((t) => cbar * t), xe = ts.map((t) => cg * t);
  o += acircle(xc.map(sx), xc.map((x, i) => sy(eta(x, ts[i]))), kt, T, 5.5, 'ink-f');
  o += acircle(xe.map(sx), xe.map(() => sy(2) - 12), kt, T, 5, 'mute-f');
  o += text(30, 22, '黑点：跟着一个 crest（speed c）；灰点：跟着 envelope 的最高处（speed c_g）', 'ts');
  o += text(30, 180, `两列 wave 的 k 差 21%，ω = √(gk)，所以 ω 只差 10%。Crest 走完全宽时，envelope 只走一半：`, 'ts');
  o += text(30, 198, `c = ω̄/k̄ = ${cbar.toFixed(3)}，c_g = Δω/Δk = ${cg.toFixed(3)}，比值 ${(cg / cbar).toFixed(3)}（g = 1 的单位）。`, 'ts');
  o += text(30, 216, 'Crest 从 group 后面长出来，在前面消失。', 'ts');
  return svgA(560, 224, o, '动图：两列 wavenumber 相近的 deep-water wave 叠加成一串 wave group；单个 crest 以 phase speed 前进，envelope 以约一半的 group velocity 前进');
}

// ---------- 第 4 站：10 s 的 swell 走上 beach ----------
const kOf = (w, h) => { let k = w * w / G; for (let i = 0; i < 200; i++) k = w * w / (G * Math.tanh(k * h)); return k; };
function shoal() {
  const w = 2 * Math.PI / 10, Lx = 1200, hOf = (x) => 1 + 49 * (1 - x / Lx) ** 2;
  const sx = lin(0, Lx, 30, 530), Y0 = 92, sz = (h) => 112 + 2.2 * h, A = 18; // 水面在 Y0；bed 按 2.2 px/m，振幅 18 px/m
  const cg0 = G / (2 * w);
  const info = (h) => { const k = kOf(w, h), c = w / k, n = 0.5 * (1 + 2 * k * h / Math.sinh(2 * k * h)); return { k, c, cg: n * c, a: 0.5 * Math.sqrt(cg0 / (n * c)) }; };
  let o = '';
  const bed = []; for (let i = 0; i <= 100; i++) { const x = Lx * i / 100; bed.push([sx(x), sz(hOf(x))]); }
  o += path(d([...bed, [sx(Lx), 230], [sx(0), 230]]) + 'Z', 'wash2') + path(d(bed), 'ink');
  let ph = 0; const pts = []; const M = 1200;
  for (let i = 0; i <= M; i++) { const x = Lx * i / M, I = info(hOf(x)); if (i) ph += I.k * Lx / M; pts.push([sx(x), Y0 - A * I.a * Math.cos(ph)]); }
  o += line(30, Y0, 530, Y0, 'grid') + path(d(pts), 'ln');
  const env = []; for (let i = 0; i <= 120; i++) { const x = Lx * i / 120; env.push([sx(x), Y0 - A * info(hOf(x)).a]); }
  o += path(d(env), 'dash');
  for (const h of [50, 20, 10, 5, 2]) {
    const x = Lx * (1 - Math.sqrt((h - 1) / 49)), I = info(h), anc = h === 50 ? 'start' : 'middle';
    o += line(sx(x), Y0 + 16, sx(x), sz(h), 'grid');
    o += text(sx(x) + 4, h === 50 ? sz(h) - 26 : sz(h) + 16, `h = ${h} m`, 'ts', 'start');
    o += text(sx(x), 26, `L ${(2 * Math.PI / I.k).toFixed(0)} m`, 'ts', anc);
    o += text(sx(x), 44, `a ${I.a.toFixed(2)} m`, 'tb', anc);
  }
  o += text(280, 252, '深水里振幅 0.5 m；虚线是 E c_g 不变给出的振幅。水平按真实距离（1.2 km），竖直不按比例。', 'ts', 'middle');
  return svg(560, 260, o, '周期 10 秒的 swell 从 50 米深走到 1 米深：wavelength 从 151 米缩到约 31 米，振幅先略减小到约 0.46 米，再增大到 0.8 米左右');
}

// ---------- 第 4 站：capillary–gravity wave 的 phase speed ----------
function capil() {
  const sig = 0.073, rho = 1000, sx = logx(0.002, 1, 70, 520), sy = lin(0, 0.6, 210, 30);
  const cg_ = (l) => Math.sqrt(G * l / (2 * Math.PI)), cc = (l) => Math.sqrt(sig * 2 * Math.PI / (rho * l)), ct = (l) => Math.sqrt(cg_(l) ** 2 + cc(l) ** 2);
  let o = axes({ sx, sy, x0: 0.002, x1: 1, y0: 0, y1: 0.6, xt: [[0.002, '2 mm'], [0.01, '1 cm'], [0.1, '10 cm'], [1, '1 m']], yt: [[0, '0'], [0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6']], xl: 'wavelength λ', yl: 'c（m/s）' });
  const cv = (f) => { const p = []; for (let i = 0; i <= 200; i++) { const l = 0.002 * Math.pow(500, i / 200); const v = f(l); if (v <= 0.6) p.push([sx(l), sy(v)]); } return d(p); };
  o += path(cv(cg_), 'dash') + path(cv(cc), 'dash') + path(cv(ct), 'ln');
  const km = Math.sqrt(rho * G / sig), lm = 2 * Math.PI / km, cm = Math.pow(4 * G * sig / rho, 0.25);
  o += circle(sx(lm), sy(cm), 4.5, 'ink-f') + line(sx(lm), sy(cm), sx(lm), sy(0), 'grid');
  o += text(sx(lm), sy(0.36), `λ = ${(lm * 100).toFixed(2)} cm，c = ${(cm * 100).toFixed(1)} cm/s`, 'tb', 'middle');
  o += text(sx(0.0028), sy(0.52), 'surface tension 主导', 'ts', 'start') + text(sx(0.9), sy(0.3), 'gravity 主导', 'ts', 'end');
  o += text(sx(0.0022), sy(0.11), '只有 gravity：√(g/k)', 'ts', 'start') + text(sx(0.15), sy(0.09), '只有 σ：√(σk/ρ)', 'ts', 'start');
  return svg(560, 244, o, 'Deep water 上 capillary–gravity wave 的 phase speed 随 wavelength 变化：在 1.71 厘米处有最小值 23.1 厘米每秒，更短的由 surface tension 主导，更长的由 gravity 主导');
}

// ---------- 第 5 站：characteristics 交叉 = 前沿变竖直 ----------
function charA() {
  const sxi = lin(-3000, 3000, 40, 480), syE = lin(-0.1, 1.3, 120, 40), st = lin(0, 1100, 300, 140);
  const ts = [0, 200, 400, 600, 700, 808, 900, 1000, 1100], hold = 1.1, T = hold * ts.length;
  const kt = ts.map((_, i) => i / ts.length);
  let o = text(40, 20, '上：surface（跟着 √(gh₀) 走的坐标）', 'ts') + text(40, 138, '下：characteristic ξ = x₀ + (V − c₀)t', 'ts');
  o += line(40, syE(0), 480, syE(0), 'grid');
  const surf = (t, full) => { const pts = []; for (let i = 0; i <= 200; i++) { const x0 = -3200 + 6400 * i / 200; pts.push([sxi(x0 + (SW.V(x0) - SW.c0) * t), syE(SW.eta(x0))]); } return d(pts); };
  ts.forEach((t, i) => {
    const on = ts.map((_, j) => j === i);
    let b = path(surf(t), t > SW.tb ? 'ln-dash' : 'ln');
    b += line(40, st(t), 480, st(t), 'ink');
    b += text(486, st(t) + 4, `t = ${t} s`, 'ts', 'start');
    if (t > SW.tb + 1) b += text(260, 34, '三值解：shallow water equations 已经失效，实际是一道 bore', 'tl', 'middle');
    if (t === 808) b += text(260, 34, `t_b = ${SW.tb.toFixed(0)} s：前沿第一次竖直`, 'tl', 'middle');
    o += grp(b, on, kt, T);
  });
  // characteristics
  for (let x0 = -3000; x0 <= 3000; x0 += 150) {
    const v = SW.V(x0) - SW.c0; const pts = [[sxi(x0), st(0)], [sxi(x0 + v * 1100), st(1100)]];
    o += path(d(pts), Math.abs(x0) < 1600 ? 'mute' : 'grid');
  }
  o += line(40, st(0), 480, st(0), 'axis') + text(30, st(0) + 4, '0', 'ts', 'end') + text(30, st(1100) + 4, '1100 s', 'ts', 'end');
  const xb = SW.tb; // 交叉的位置
  let m = 0, xm = 0; for (let i = 0; i <= 4000; i++) { const x = -2000 + 4000 * i / 4000; const dv = (SW.V(x + 0.5) - SW.V(x - 0.5)); if (dv < m) { m = dv; xm = x; } }
  o += circle(sxi(xm + (SW.V(xm) - SW.c0) * xb), st(xb), 4.5, 'ln-f');
  return svgA(560, 312, o, '动图：上面是 hump 的 surface 逐渐变形，下面是 characteristic 直线；前沿的线越来越近，808 秒时相邻的线第一次相交，同时 surface 的前沿变成竖直，之后的解变成三值');
}

// ---------- 第 5 站：dam break ----------
function damA() {
  const h0 = 1, c0 = Math.sqrt(G * h0), sx = lin(-7, 13.5, 30, 530), sy = lin(0, 1.3, 190, 50);
  const ts = []; const N = 40, Tt = 2; for (let i = 0; i <= N; i++) ts.push(Tt * i / N);
  const kt = ts.map((_, i) => 0.13 + 0.77 * i / N); kt.unshift(0, 0.12); kt.push(1);
  const seq = [Tt, Tt, ...ts, Tt];
  const shape = (t) => {
    const pts = [[sx(-7), sy(0)], [sx(-7), sy(h0)]];
    if (t === 0) { pts.push([sx(0), sy(h0)], [sx(0), sy(0)], [sx(0.0001), sy(0)]); }
    else { pts.push([sx(-c0 * t), sy(h0)]); for (let i = 1; i <= 40; i++) { const x = -c0 * t + 3 * c0 * t * i / 40; const c = (2 * c0 - x / t) / 3; pts.push([sx(x), sy(c * c / G)]); } }
    pts.push([sx(13.5), sy(0)]);
    return d(pts) + 'Z';
  };
  // 每一帧点数要一样：t = 0 时也用同样的 44 个点
  const shape2 = (t) => {
    const tt = Math.max(t, 1e-4); const pts = [[sx(-7), sy(0)], [sx(-7), sy(h0)], [sx(-c0 * tt), sy(h0)]];
    for (let i = 1; i <= 40; i++) { const x = -c0 * tt + 3 * c0 * tt * i / 40; const c = (2 * c0 - x / tt) / 3; pts.push([sx(x), sy(c * c / G)]); }
    pts.push([sx(13.5), sy(0)]); return d(pts) + 'Z';
  };
  let o = rect(30, sy(0), 500, 8, 'wash2');
  o += apath(seq.map(shape2), kt, 7, 'wash ink-s');
  o += line(sx(0), sy(0), sx(0), sy(1.25), 'dash') + text(sx(0) + 4, sy(1.25) + 4, 'x = 0：原来 dam 的位置', 'ts');
  o += line(sx(-0.6), sy(4 / 9), sx(0.6), sy(4 / 9), 'ink-b') + text(sx(0.8), sy(4 / 9) - 10, 'h = 4h₀/9 = 0.44 m，u = 2c₀/3 = 2.09 m/s', 'tb');
  const back = seq.map((t) => sx(-c0 * Math.max(t, 1e-4))), front = seq.map((t) => sx(2 * c0 * Math.max(t, 1e-4)));
  o += acircle(back, back.map(() => sy(h0)), kt, 7, 4.5, 'ink-f') + acircle(front, front.map(() => sy(0)), kt, 7, 4.5, 'ln-f');
  o += text(sx(-6.8), 30, `h₀ = 1 m，c₀ = √(gh₀) = ${c0.toFixed(2)} m/s，t 从 0 到 2 s`, 'ts');
  o += text(sx(-6.8), 222, `黑点：扰动往上游退，速度 c₀ = ${c0.toFixed(2)} m/s`, 'ts') + text(sx(-6.8), 240, `彩点：水的前沿，速度 2c₀ = ${(2 * c0).toFixed(2)} m/s`, 'ts');
  o += text(sx(13.3), 240, `通过 x = 0 的 flux：(8/27)c₀h₀ = ${(8 / 27 * c0).toFixed(3)} m²/s`, 'ts', 'end');
  return svgA(560, 250, o, '动图：1 米深的水在 dam 拆掉后的 2 秒：上游的扰动以 3.13 米每秒往回退，前沿以 6.26 米每秒冲出，dam 原址的水深一直是 0.44 米');
}

// ---------- 第 5 站：hydraulic jump 的 control volume ----------
function jump() {
  const h1 = 0.1, U1 = 3, q = h1 * U1, Fr1 = U1 / Math.sqrt(G * h1), h2 = h1 * (Math.sqrt(1 + 8 * Fr1 * Fr1) - 1) / 2, U2 = q / h2, dE = (h2 - h1) ** 3 / (4 * h1 * h2);
  const sx = lin(0, 3, 30, 470), sy = lin(0, 0.5, 210, 50);
  const surf = (x) => x < 1.2 ? h1 : x > 1.9 ? h2 : h1 + (h2 - h1) * (0.5 - 0.5 * Math.cos(Math.PI * (x - 1.2) / 0.7));
  let o = path(area(surf, 0, 3, sx, sy), 'wash') + path(curve(surf, 0, 3, sx, sy), 'ink');
  o += rect(30, sy(0), 440, 8, 'wash2');
  // roller
  for (let i = 0; i < 3; i++) { const cx = sx(1.35 + 0.18 * i), cy = sy(surf(1.35 + 0.18 * i) - 0.05); o += circle(cx, cy, 8, 'mute'); }
  o += text(sx(1.3), sy(0.3), 'turbulent roller', 'ts', 'end');
  // control volume
  o += rect(sx(0.6), sy(0.44), sx(2.6) - sx(0.6), sy(0) - sy(0.44), 'dash');
  // 上下游的速度
  o += arrow(sx(0.15), sy(0.05), sx(0.15) + 3 * 24, sy(0.05), 'ln', 6) + text(sx(0.15), sy(0.05) - 22, `U₁ = ${U1} m/s`, 'tb');
  o += arrow(sx(2.7), sy(0.12), sx(2.7) + U2 * 24, sy(0.12), 'ln', 6) + text(sx(2.68), sy(0.12) - 12, `U₂ = ${U2.toFixed(2)} m/s`, 'tb', 'start');
  // hydrostatic pressure 三角形
  const tri = (x, h, sgn) => poly([[sx(x), sy(h)], [sx(x), sy(0)], [sx(x) + sgn * 0.09 * (sy(0) - sy(h)), sy(0)]], 'mute-f');
  o += tri(0.6, h1, 1) + tri(2.6, h2, -1);
  o += text(sx(0.6) - 8, sy(h1) - 46, `h₁ = ${h1} m`, 't', 'end') + text(sx(0.6) - 8, sy(h1) - 28, `Fr₁ = ${Fr1.toFixed(2)}`, 'ts', 'end');
  o += text(sx(2.6) + 8, sy(h2) - 26, `h₂ = ${h2.toFixed(3)} m`, 't', 'start') + text(sx(2.6) + 8, sy(h2) - 10, `Fr₂ = ${(U2 / Math.sqrt(G * h2)).toFixed(2)}`, 'ts', 'start');
  o += text(40, 240, `虚线框：control volume；灰三角：两端的 hydrostatic pressure ½ρgh²。每 m 宽的 flux q = ${q.toFixed(1)} m²/s。`, 'ts');
  o += text(40, 258, `Head loss ΔE = (h₂ − h₁)³/(4h₁h₂) = ${dE.toFixed(3)} m，耗散 ρgqΔE = ${(1000 * G * q * dE).toFixed(0)} W/m。`, 'ts');
  return svg(560, 266, o, '一道 hydraulic jump：左边 0.1 米深、3 米每秒的急流，经过一段 turbulent roller 变成右边 0.381 米深、0.79 米每秒的缓流；control volume 两端受 hydrostatic pressure');
}

// ---------- 第 6 站：internal wave beam ----------
function igwA() {
  const th = 30 * Math.PI / 180; // beam 与水平的 angle，ω/N = sin 30° = 0.5
  const cx = 70, cy = 40, Lb = 330, Wb = 110;
  const eb = [Math.cos(th), Math.sin(th)], ek = [Math.sin(th), -Math.cos(th)]; // SVG 坐标（y 向下）：beam 向右下，k 向右上
  const P = (s, n) => [cx + s * eb[0] + n * ek[0], cy + s * eb[1] + n * ek[1]]; // s 沿 beam，n 沿 k（n > 0 指向右上）
  const lam = 40, T = 4, NF = 48, kt = [], ph = [];
  for (let i = 0; i <= NF; i++) { kt.push(i / NF); ph.push(2 * Math.PI * i / NF); }
  let o = `<defs><clipPath id="pc3238-igwclip"><polygon points="${[P(20, -Wb / 2), P(Lb, -Wb / 2), P(Lb, Wb / 2), P(20, Wb / 2)].map(([x, y]) => f1(x) + ',' + f1(y)).join(' ')}"/></clipPath></defs>`;
  o += poly([P(20, -Wb / 2), P(Lb, -Wb / 2), P(Lb, Wb / 2), P(20, Wb / 2)], 'wash');
  // crest / trough 线：沿 beam 方向，位置 n = n0 + λ·phase/2π（沿 k 移动）
  let g = '';
  for (let j = -4; j <= 3; j++) {
    for (const [off, cls] of [[0, 'ln'], [lam / 2, 'mute']]) {
      const ds = ph.map((p) => { const n = j * lam + off + lam * p / (2 * Math.PI); const a = P(0, n), b = P(Lb + 20, n); return d([a, b]); });
      g += apath(ds, kt, T, cls);
    }
  }
  o += `<g clip-path="url(#pc3238-igwclip)">${g}</g>`;
  // fluid particle：沿 beam 方向来回
  for (const n of [-40, -20, 0, 20, 40]) {
    const s0 = 220, env = Math.exp(-(n * n) / (2 * 35 * 35)), A = 14 * env;
    const xs = ph.map((p) => P(s0 + A * Math.cos(2 * Math.PI * n / lam - p), n)[0]), ys = ph.map((p) => P(s0 + A * Math.cos(2 * Math.PI * n / lam - p), n)[1]);
    o += line(...P(s0 - A, n), ...P(s0 + A, n), 'ink') + acircle(xs, ys, kt, T, 4, 'ink-f');
  }
  // source
  o += circle(cx, cy, 14, 'paper') + text(cx, cy - 22, 'source：以 ω 上下振荡', 'ts', 'start');
  // arrows：c_g 沿 beam，k 垂直 beam
  const a0 = P(200, -Wb / 2 - 16), a1 = P(260, -Wb / 2 - 16);
  o += arrow(a0[0], a0[1], a1[0], a1[1], 'ink-b', 7) + text(a1[0] - 10, a1[1] + 22, 'c_g：energy 沿 beam 往右下', 'tb', 'end');
  const b0 = P(190, Wb / 2 + 10), b1 = P(190, Wb / 2 + 55);
  o += arrow(b0[0], b0[1], b1[0], b1[1], 'ln', 7) + text(b1[0] + 8, b1[1] + 4, 'k、phase：往右上', 'tl');
  o += text(40, 296, '实线：crest；灰线：trough。Phase line 平行于 beam，垂直于 beam 移动；', 'ts');
  o += text(40, 314, '黑点是 fluid particle，沿 phase line（也就是沿 beam）来回。这里 ω/N = 0.5，beam 与水平成 30°。', 'ts');
  return svgA(560, 322, o, '动图：一个以 frequency ω 振荡的 source 发出的 internal wave beam，与水平成 30 度。Phase line 平行于 beam、朝右上方移动，energy 沿 beam 往右下传，fluid particle 沿 beam 方向来回');
}

// ---------- 第 7 站：mixing length ----------
function mixlen() {
  const sz = lin(0, 1, 230, 30), su = lin(0, 1.2, 60, 300), U = (z) => 0.25 * Math.log(1 + 40 * z) / Math.log(41) * 4;
  let o = axes({ sx: su, sy: sz, x0: 0, x1: 1.2, y0: 0, y1: 1, xt: [], yt: [], xl: '', yl: 'z' }) + text(su(0.6), 250, 'ū', 'ts', 'middle');
  o += path(curve((z) => z, 0.001, 1, (z) => su(U(z)), sz).replace(/M|L/g, (m) => m), 'ln');
  const zc = 0.5, l = 0.18;
  o += line(su(0), sz(zc), su(1.15), sz(zc), 'grid') + text(su(1.18), sz(zc) + 4, 'z', 'ts', 'start');
  o += line(su(0), sz(zc - l), su(1.15), sz(zc - l), 'grid') + text(su(1.18), sz(zc - l) + 4, 'z − l', 'ts', 'start');
  o += line(su(0), sz(zc + l), su(1.15), sz(zc + l), 'grid') + text(su(1.18), sz(zc + l) + 4, 'z + l', 'ts', 'start');
  // parcel 从 z − l 上来
  o += circle(su(U(zc - l)), sz(zc - l), 6, 'mute-f') + circle(su(U(zc - l)), sz(zc) + 8, 7, 'ink-f');
  o += arrow(su(U(zc - l)) - 16, sz(zc - l) - 4, su(U(zc - l)) - 16, sz(zc) + 10, 'ink', 6);
  o += circle(su(U(zc + l)), sz(zc + l), 6, 'mute-f') + circle(su(U(zc + l)), sz(zc) - 8, 7, 'ink-f');
  o += arrow(su(U(zc + l)) + 16, sz(zc + l) + 4, su(U(zc + l)) + 16, sz(zc) - 10, 'ink', 6);
  o += circle(su(U(zc)), sz(zc), 4, 'ln-f');
  const X = 345;
  o += text(X, 50, '从 z − l 上来的 parcel：', 'tb') + text(X, 70, "w′ > 0，带来较小的 ū，u′ < 0", 't');
  o += text(X, 100, '从 z + l 下来的 parcel：', 'tb') + text(X, 120, "w′ < 0，带来较大的 ū，u′ > 0", 't');
  o += text(X, 150, "两种都给出 u′w′ < 0：", 't') + text(X, 170, 'momentum 往下（往 ū 小的地方）走', 't');
  o += text(X, 200, "u′ ≈ −l dū/dz，|w′| ≈ l |dū/dz|", 'ts') + text(X, 220, "⇒ −u′w′ ≈ l² |dū/dz| dū/dz", 'ts');
  return svg(560, 252, o, 'Mixing length 的图像：一块 fluid 从 z 减 l 处上来，带着较小的 mean velocity，成为负的 u prime；从 z 加 l 处下来的带着较大的；两者的 u prime w prime 都是负的');
}

// ---------- 第 7 站：law of the wall ----------
function wall() {
  const sx = logx(1, 1e4, 60, 520), sy = lin(0, 30, 220, 30), k = 0.4, B = 5.5;
  let o = axes({ sx, sy, x0: 1, x1: 1e4, y0: 0, y1: 30, xt: [[1, '1'], [10, '10'], [100, '100'], [1000, '1000'], [1e4, '10⁴']], yt: [0, 10, 20, 30], xl: 'z⁺ = z u_* / ν', yl: 'u⁺ = ū / u_*' });
  o += rect(sx(1), sy(30), sx(5) - sx(1), sy(0) - sy(30), 'wash') + rect(sx(30), sy(30), sx(1e4) - sx(30), sy(0) - sy(30), 'wash2');
  o += text((sx(1) + sx(5)) / 2, sy(27), 'viscous', 'ts', 'middle') + text((sx(1) + sx(5)) / 2, sy(25), 'sublayer', 'ts', 'middle');
  o += text((sx(5) + sx(30)) / 2, sy(27), 'buffer', 'ts', 'middle');
  o += text(sx(800), sy(27), 'log layer', 'ts', 'middle');
  const N = (f, a, b) => { const p = []; for (let i = 0; i <= 200; i++) { const y = a * Math.pow(b / a, i / 200); const v = f(y); if (v <= 30 && v >= 0) p.push([sx(y), sy(v)]); } return d(p); };
  o += path(N((y) => y, 1, 30), 'dash') + path(N((y) => Math.log(y) / k + B, 3, 1e4), 'dash');
  const reich = (y) => Math.log(1 + k * y) / k + 7.8 * (1 - Math.exp(-y / 11) - (y / 11) * Math.exp(-y / 3));
  o += path(N(reich, 1, 1e4), 'ln');
  o += text(sx(13), sy(19), 'u⁺ = z⁺', 'tb', 'middle');
  o += text(sx(1500), sy(16), 'u⁺ = (1/κ) ln z⁺ + 5.5', 'tb', 'middle');
  o += text(sx(45), sy(5), '彩线：Reichardt 的经验式', 'ts');
  return svg(560, 262, o, 'Smooth wall 附近的 mean velocity：z plus 小于 5 时 u plus 等于 z plus，大于 30 时是 log law，中间是 buffer layer');
}

// ---------- 第 8 站：一天里 boundary layer 的结构 ----------
function ablday() {
  const sx = lin(12, 36, 50, 530), sy = lin(0, 2, 220, 30);
  const mlTop = (t) => { if (t < 18) return 1.5; if (t < 30) return 1.5; return 0; };
  let o = '';
  // 白天 mixed layer：12–18 h 1.5 km；次日 6–12 h 增长
  const grow = (t) => 0.15 + 1.35 * Math.sin(Math.PI / 2 * Math.min(1, (t - 30) / 6)) ** 1.2;
  o += path(d([[sx(12), sy(0)], [sx(12), sy(1.5)], [sx(18), sy(1.5)], [sx(18), sy(0)]]) + 'Z', 'wash');
  o += path(d([[sx(18), sy(0.25)], [sx(18), sy(1.5)], [sx(30), sy(1.5)], [sx(30), sy(0.25)]]) + 'Z', 'wash2');
  const sbl = (t) => 0.05 + 0.2 * Math.min(1, (t - 18) / 3);
  o += path(area(sbl, 18, 30, sx, sy), 'mute-f');
  const pts = [[sx(30), sy(0)]]; for (let i = 0; i <= 60; i++) { const t = 30 + 6 * i / 60; pts.push([sx(t), sy(grow(t))]); } pts.push([sx(36), sy(0)]);
  o += path(d(pts) + 'Z', 'wash');
  o += path(d([[sx(12), sy(1.5)], [sx(18), sy(1.5)]]), 'ink-b') + path(curve(grow, 30, 36, sx, sy), 'ink-b');
  o += text(sx(15), sy(0.8), 'mixed layer', 'tb', 'middle') + text(sx(15), sy(0.8) + 18, '（convective）', 'ts', 'middle');
  o += text(sx(24), sy(0.9), 'residual layer', 'tb', 'middle');
  o += text(sx(24), sy(0.12) + 4, 'stable boundary layer', 'tw', 'middle');
  o += text(sx(15), sy(1.5) - 8, 'capping inversion，约 1–2 km', 'ts', 'middle');
  o += text(sx(33.5), sy(0.6), 'mixed layer 重新长高', 'ts', 'middle');
  o += line(sx(12), sy(0.1), sx(18), sy(0.1), 'dash') + text(sx(12.3), sy(0.1) - 4, 'surface layer', 'ts');
  o += line(50, sy(0), 530, sy(0), 'axis');
  for (const [t, s] of [[12, '中午'], [18, '日落'], [24, '午夜'], [30, '日出'], [36, '中午']]) o += line(sx(t), sy(0), sx(t), sy(0) + 4, 'axis') + text(sx(t), sy(0) + 18, s, 'ts', 'middle');
  for (const z of [0, 1, 2]) o += text(44, sy(z) + 4, `${z} km`, 'ts', 'end');
  return svg(560, 248, o, '陆地上一天里 atmospheric boundary layer 的典型结构：白天是 1 到 2 公里厚、被 inversion 盖住的 mixed layer；日落后地面附近形成几百米的 stable boundary layer，上面留下 residual layer；日出后 mixed layer 重新长高');
}

// ---------- 第 8 站：由四个高度的风速求 u_* 与 z₀ ----------
function logfit() {
  const z = [1, 3, 10, 30], u = [4.6, 6.0, 7.6, 9.0];
  const n = 4, lx = z.map(Math.log), mx = lx.reduce((a, b) => a + b) / n, mu = u.reduce((a, b) => a + b) / n;
  const sl = lx.reduce((a, x, i) => a + (x - mx) * (u[i] - mu), 0) / lx.reduce((a, x) => a + (x - mx) ** 2, 0), b = mu - sl * mx, z0 = Math.exp(-b / sl);
  const su = lin(0, 10, 70, 330), sz = logx(0.01, 50, 230, 30);
  let o = axes({ sx: su, sy: sz, x0: 0, x1: 10, y0: 0.01, y1: 50, xt: [0, 2, 4, 6, 8, 10], yt: [], xl: 'ū（m/s）', yl: 'z（m，log 刻度）' });
  for (const [v, s] of [[0.01, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10']]) o += line(su(0) - 4, sz(v), su(0), sz(v), 'axis') + text(su(0) - 7, sz(v) + 4, s, 'ts', 'end');
  o += path(d([[su(0), sz(z0)], [su(sl * Math.log(50) + b), sz(50)]]), 'ln');
  z.forEach((zz, i) => { o += circle(su(u[i]), sz(zz), 4.5, 'ink-f') + text(su(u[i]) + 8, sz(zz) + 4, `${u[i]}`, 'ts'); });
  o += circle(su(0), sz(z0), 4.5, 'ln-f') + text(su(0) + 8, sz(z0) + 16, `z₀ = ${z0.toFixed(3)} m`, 'tl');
  const X = 360;
  o += text(X, 50, '日落时的四个高度（neutral）', 'tb');
  o += text(X, 76, '画成 ū 对 ln z，点在一条直线上：', 't');
  o += text(X, 100, `slope = u_*/κ = ${sl.toFixed(3)} m/s`, 't') + text(X, 122, `u_* = ${(0.4 * sl).toFixed(2)} m/s`, 'tb');
  o += text(X, 150, '直线延长到 ū = 0 的高度就是 z₀', 't');
  o += text(X, 180, 'residual 最大 0.019 m/s', 'ts');
  return svg(560, 262, o, '四个高度 1、3、10、30 米的风速画在 log 高度坐标上落在一条直线上，slope 给出 friction velocity 0.52 米每秒，延长到风速为零处给出 roughness length 0.029 米');
}

// ---------- 第 8 站：Monin–Obukhov profile ----------
function moFig() {
  const sz = lin(0, 60, 230, 30), su = lin(0, 11, 70, 360);
  let o = axes({ sx: su, sy: sz, x0: 0, x1: 11, y0: 0, y1: 60, xt: [0, 2, 4, 6, 8, 10], yt: [0, 10, 20, 30, 40, 50, 60], xl: 'ū（m/s）', yl: 'z（m）' });
  const cs = [[-30, 'L = −30 m', 'ln-dash'], [0, 'neutral', 'mute'], [60, 'L = +60 m', 'ln']];
  for (const [L, lab, cls] of cs) {
    const p = []; for (let i = 0; i <= 200; i++) { const z = 0.12 + 59.88 * i / 200; p.push([su(MO.U(z, 5, L || 0)), sz(z)]); }
    o += path(d(p), cls);
    const zl = L < 0 ? 58 : L === 0 ? 44 : 50, an = L === 0 ? 'start' : 'end';
    o += text(su(MO.U(zl, 5, L || 0)) + (L === 0 ? 6 : -8), sz(zl) + 4, lab, 'ts', an);
  }
  o += line(su(0), sz(10), su(5), sz(10), 'grid') + circle(su(5), sz(10), 4, 'ink-f');
  const X = 390;
  o += text(X, 50, '同样 z₀ = 0.1 m、10 m 处 5 m/s：', 'ts');
  for (const [i, L] of [[0, -30], [1, 0], [2, 60]]) {
    o += text(X, 80 + 50 * i, L === 0 ? 'neutral' : `L = ${L > 0 ? '+' : '−'}${Math.abs(L)} m`, 'tb');
    o += text(X, 98 + 50 * i, `u_* = ${MO.us(5, L || 0).toFixed(2)}，ū(50) = ${MO.U(50, 5, L || 0).toFixed(2)} m/s`, 'ts');
  }
  o += text(X, 222, 'stable 时 turbulence 弱，', 'ts') + text(X, 240, '同样的 stress 要更大的 shear', 'ts');
  return svg(560, 262, o, '同一个 10 米风速下三种 stability 的 wind profile：unstable 时 profile 最直，50 米处 6.07 米每秒；neutral 6.75；stable 时 9.54');
}

export default {
  'pc3238-dalembert': dalembert,
  'pc3238-steepen0': steepen0,
  'pc3238-wind0': wind0,
  'pc3238-pipe': pipe,
  'pc3238-rayleigh': rayleighA,
  'pc3238-cyl': cylA,
  'pc3238-kutta': kutta,
  'pc3238-blasius': blasius,
  'pc3238-fsk': fskFig,
  'pc3238-group': groupA,
  'pc3238-shoal': shoal,
  'pc3238-capil': capil,
  'pc3238-char': charA,
  'pc3238-dam': damA,
  'pc3238-jump': jump,
  'pc3238-igw': igwA,
  'pc3238-mixlen': mixlen,
  'pc3238-wall': wall,
  'pc3238-abl': ablday,
  'pc3238-logfit': logfit,
  'pc3238-mo': moFig,
};
