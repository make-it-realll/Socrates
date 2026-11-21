import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, sub, arrow, curve, axes, anim, animRot, apath, acircle, ashow, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const add = (a, b, k = 1) => [a[0] + k * b[0], a[1] + k * b[1]];
const closed = (pts) => d(pts) + 'Z';
const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const fmt = (v, k = 2) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(k);

// planar wrench (fx, fy, τ)，τ = px·fy − py·fx
const wrench = (p, f) => [f[0], f[1], p[0] * f[1] - p[1] * f[0]];

// 4 个点组成的 tetrahedron：origin 到它表面的最近距离（origin 在外面时为负）
function tetEps(W) {
  let eps = Infinity;
  for (let k = 0; k < 4; k++) {
    const [a, b, c] = W.filter((_, i) => i !== k), q = W[k];
    let n = cross3([b[0] - a[0], b[1] - a[1], b[2] - a[2]], [c[0] - a[0], c[1] - a[1], c[2] - a[2]]);
    const nn = Math.hypot(...n);
    n = n.map((v) => v / nn);
    let off = dot3(n, a);
    if (dot3(n, q) > off) { n = n.map((v) => -v); off = -off; } // 法向朝外
    eps = Math.min(eps, off); // origin 到 plane 的 signed distance：n·x = off，origin 在内侧时 off > 0
  }
  return eps;
}

// 车：中心、heading、长宽 → polygon
const carPts = (x, y, h, L = 1, Wd = 0.5) => [[L / 2, Wd / 2], [L / 2, -Wd / 2], [-L / 2, -Wd / 2], [-L / 2, Wd / 2]].map((p) => add([x, y], rot(p, h)));

// ---------- 开头：四个 finger 夹着 square，square 还是能转 ----------
function spinA() {
  const s = 52;
  const panel = (cx, cy, contacts, spin, title, note1, note2) => {
    const P = ([x, y]) => [cx + s * x, cy - s * y];
    let o = text(cx, 24, title, 'tb', 'middle');
    const sq = closed([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(P));
    if (spin) {
      const T = 4, kt = [0, 0.25, 0.5, 0.75, 1], ang = [0, -14, 0, 14, 0];
      o += `<g>${path(sq, 'wash ink')}${circle(cx, cy, 3, 'ink-f')}${animRot(ang, cx, cy, kt, T)}</g>`;
    } else o += path(sq, 'wash ink') + circle(cx, cy, 3, 'ink-f');
    for (const [p, n] of contacts) {
      // finger：从 contact 沿 −n 方向伸出去的有厚度的 pad
      const tVec = [-n[1], n[0]], a = add(p, n, -0.06), b = add(p, n, -0.62);
      const pts = [add(a, tVec, 0.1), add(b, tVec, 0.1), add(b, tVec, -0.1), add(a, tVec, -0.1)].map(P);
      o += path(closed(pts), 'paper') + circle(...P(p), 3.2, 'ln-f');
      const q0 = P(add(p, n, -0.36)), q1 = P(add(p, n, -0.08));
      o += arrow(q0[0], q0[1], q1[0], q1[1], 'ln', 5);
    }
    o += text(cx, cy + s * 1.62 + 22, note1, 'ts', 'middle') + text(cx, cy + s * 1.62 + 38, note2, 'ts', 'middle');
    return o;
  };
  const cen = [[[-1, 0], [1, 0]], [[1, 0], [-1, 0]], [[0, -1], [0, 1]], [[0, 1], [0, -1]]];
  const pin = [[[-1, -0.5], [1, 0]], [[1, 0.5], [-1, 0]], [[-0.5, -1], [0, 1]], [[0.5, 1], [0, -1]]];
  let o = panel(140, 128, cen, true, 'finger 在每条边的中点', '四个 normal 都穿过 center，', '没有一个能挡住 rotation');
  o += panel(420, 128, pin, false, 'finger 错开半个 side', '逆时针转会压进上下两个，', '顺时针转会压进左右两个');
  return svgA(560, 252, o, '动图：左边四个 frictionless finger 顶在 square 四条边的中点，square 照样绕 center 来回转；右边把 finger 错开半个 side，square 转不动');
}

// ---------- 第 1 站：positive span ----------
function span() {
  let o = '';
  const panel = (cx, vecs, title, l1, l2, full) => {
    const cy = 112, r = 58;
    o += text(cx, 24, title, 'tb', 'middle');
    if (full) o += circle(cx, cy, r + 6, 'wash');
    else {
      const angs = vecs.map(([x, y]) => Math.atan2(y, x)).sort((a, b) => a - b);
      const a0 = angs[0], a1 = angs[angs.length - 1], pts = [[cx, cy]];
      for (let k = 0; k <= 40; k++) { const a = a0 + (a1 - a0) * k / 40; pts.push([cx + (r + 6) * Math.cos(a), cy - (r + 6) * Math.sin(a)]); }
      o += path(closed(pts), 'wash');
    }
    o += line(cx - r - 10, cy, cx + r + 10, cy, 'grid') + line(cx, cy - r - 10, cx, cy + r + 10, 'grid');
    for (const [x, y] of vecs) { const L = Math.hypot(x, y); o += arrow(cx, cy, cx + r * x / L, cy - r * y / L, 'ink-b', 7); }
    o += text(cx, 204, l1, 'ts', 'middle') + text(cx, 220, l2, 'ts', 'middle');
  };
  panel(95, [[1, 0], [0.3, 1]], '两个 vector', '非负组合只盖住', '一个 wedge', false);
  panel(280, [[1, 0], [0.3, 1], [-0.8, 0.6]], '三个，在同一侧', 'wedge 变大，', '下半平面仍然够不到', false);
  panel(465, [[1, 0], [-0.5, 0.9], [-0.5, -0.9]], '三个，能组合出 0', 'w₁ + w₂ + w₃ = 0 有正的解，', '整个平面都盖住', true);
  return svg(560, 228, o, 'n 等于 2 时的 positive span：两个 vector 只盖住一个 wedge；三个在同一侧的 vector 仍然盖不住下半平面；三个能以正系数组合出零的 vector 盖住整个平面');
}

// ---------- 第 1 站：两个 frictional finger，错开越多 ε 越小 ----------
function epsFig() {
  const mu = 0.5, s = 46;
  let o = '';
  const offs = [0, 0.4, 0.6];
  offs.forEach((off, k) => {
    const cx = 95 + k * 185, cy = 112;
    const P = ([x, y]) => [cx + s * x, cy - s * y];
    const cs = [[[-1, off], [1, 0]], [[1, -off], [-1, 0]]];
    const W = [];
    for (const [p, n] of cs) for (const sg of [1, -1]) W.push(wrench(p, [n[0], n[1] + sg * mu]));
    const eps = tetEps(W);
    o += path(closed([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(P)), 'wash ink');
    o += line(...P(cs[0][0]), ...P(cs[1][0]), 'dash');
    for (const [p, n] of cs) {
      const L = 0.9, e1 = add(p, [n[0] + 0, n[1] + mu], L / Math.hypot(1, mu)), e2 = add(p, [n[0], n[1] - mu], L / Math.hypot(1, mu));
      o += path(closed([P(p), P(e1), P(e2)]), 'wash-strong');
      o += line(...P(p), ...P(e1), 'ln') + line(...P(p), ...P(e2), 'ln');
      const b = add(p, n, -0.5), tv = [0, 1];
      o += path(closed([add(add(p, n, -0.05), tv, 0.1), add(b, tv, 0.1), add(b, tv, -0.1), add(add(p, n, -0.05), tv, -0.1)].map(P)), 'paper');
      o += circle(...P(p), 3, 'ink-f');
    }
    o += text(cx, 26, 'offset ' + off.toFixed(1), 'tb', 'middle');
    o += text(cx, 190, eps > 1e-9 ? 'ε = ' + eps.toFixed(3) : 'ε = 0，不是 force closure', eps > 1e-9 ? 't' : 'tl', 'middle');
    o += text(cx, 208, '连线 slope ' + off.toFixed(1) + (off < mu ? ' < μ' : ' > μ'), 'ts', 'middle');
  });
  o += text(280, 236, '阴影是 μ = 0.5 的 friction cone；虚线连着两个 contact。连线落在两个 cone 里才是 antipodal。', 'ts', 'middle');
  return svg(560, 246, o, '边长 2 的 square，两个 friction coefficient 0.5 的 finger 一左一右，上下错开 0、0.4、0.6；对应的 grasp quality epsilon 是 0.333、0.067 和 0');
}

// ---------- 第 2 站：wrist 转动时两个 finger 的最优 force ----------
function gfoSolve(phi) {
  const mg = 0.5 * 9.81, mu = 0.5;
  const Fx = mg * Math.sin(phi), Fy = -mg * Math.cos(phi);
  const t = -Fy / 2; // 两个 finger 的 tangential force 相等（torque 平衡）
  let n1, n2;
  if (Fx >= 0) { n1 = Math.abs(t) / mu; n2 = n1 + Fx; } else { n2 = Math.abs(t) / mu; n1 = n2 - Fx; }
  return { n1, n2, t };
}
function gfoA() {
  const cx = 140, cy = 140, s = 1400; // 1 m = 1400 px：box 宽 10 cm = 140 px
  const a = 0.05, h = 0.04, mu = 0.5, fs = 6; // 1 N = 6 px
  const T = 9, N = 72, kt = [], phis = [];
  for (let i = 0; i <= N; i++) { kt.push(i / N); phis.push(90 * Math.sin(2 * Math.PI * i / N)); }
  const P = ([x, y]) => [cx + s * x, cy - s * y];
  let body = '';
  body += path(closed([[-a, -h], [a, -h], [a, h], [-a, h]].map(P)), 'wash ink');
  const fw = 0.012, fh = 0.032, top = 0.05;
  body += path(closed([[-a - fw, -fh], [-a, -fh], [-a, top], [-a - fw, top]].map(P)), 'paper');
  body += path(closed([[a, -fh], [a + fw, -fh], [a + fw, top], [a, top]].map(P)), 'paper');
  body += path(closed([[-a - fw, top], [a + fw, top], [a + fw, top + 0.012], [-a - fw, top + 0.012]].map(P)), 'paper');
  body += path(closed([[-0.008, top + 0.012], [0.008, top + 0.012], [0.008, top + 0.03], [-0.008, top + 0.03]].map(P)), 'paper');
  const coneL = 0.022;
  for (const [px, nx] of [[-a, 1], [a, -1]]) {
    const p = [px, 0], e1 = add(p, [nx, mu], coneL / Math.hypot(1, mu)), e2 = add(p, [nx, -mu], coneL / Math.hypot(1, mu));
    body += path(closed([P(p), P(e1), P(e2)]), 'wash-strong');
  }
  const sol = phis.map((ph) => gfoSolve(ph * R));
  const arrowD = (x0, fx, fy) => {
    const p0 = P([x0, 0]), p1 = [p0[0] + fs * fx, p0[1] - fs * fy];
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    if (L < 1) return d([p0, p0]) + d([p0, p0, p0]);
    const ux = (p1[0] - p0[0]) / L, uy = (p1[1] - p0[1]) / L, hs = Math.min(8, L * 0.4);
    const hl = [p1[0] - hs * ux + 0.42 * hs * uy, p1[1] - hs * uy - 0.42 * hs * ux], hr = [p1[0] - hs * ux - 0.42 * hs * uy, p1[1] - hs * uy + 0.42 * hs * ux];
    return d([p0, p1]) + d([hl, p1, hr]);
  };
  body += apath(sol.map((q) => arrowD(-a, q.n1, q.t)), kt, T, 'ln');
  body += apath(sol.map((q) => arrowD(a, -q.n2, q.t)), kt, T, 'ln');
  let o = `<g>${body}${animRot(phis, cx, cy, kt, T)}</g>`;
  o += circle(cx, cy, 3, 'ink-f');
  o += arrow(cx, cy, cx, cy + 0.5 * 9.81 * fs, 'ink-b', 6) + text(cx - 8, cy + 22, 'mg', 'ts', 'end');
  o += text(cx, 22, 'wrist roll φ 在 −90° 到 90° 之间来回', 'tb', 'middle');
  o += text(cx, 262, '彩色箭头：finger 对 box 的 force', 'ts', 'middle');
  const bx = 300, bw = 220, sx = lin(0, 8, bx, bx + bw);
  o += text(bx, 46, '每个 finger 的 ‖f‖（N）', 'tb', 'start');
  for (const [k, lab, get] of [[0, '左 finger', (q) => Math.hypot(q.n1, q.t)], [1, '右 finger', (q) => Math.hypot(q.n2, q.t)]]) {
    const y = 74 + k * 44;
    o += text(bx, y - 6, lab, 'ts', 'start');
    o += rect(bx, y, bw, 14, 'wash2');
    const ws = sol.map((q) => sx(get(q)) - bx);
    o += `<rect x="${bx}" y="${y}" height="14" width="${f1(ws[0])}" class="solid">${anim('width', ws.map(f1), kt, T)}</rect>`;
  }
  const v0 = Math.hypot(gfoSolve(0).n1, gfoSolve(0).t), v45 = Math.hypot(gfoSolve(45 * R).n2, gfoSolve(45 * R).t);
  o += line(sx(v0), 66, sx(v0), 140, 'dash') + line(sx(v45), 66, sx(v45), 140, 'dash');
  o += text(sx(v0), 156, v0.toFixed(2), 'ts', 'middle') + text(sx(v45), 156, v45.toFixed(2), 'ts', 'middle');
  o += text(sx(v0) - 4, 172, 'φ = 0', 'ts', 'end') + text(sx(v45) + 4, 172, 'φ = ±45°', 'ts', 'start');
  o += text(bx, 206, 'φ = 0：gravity 全靠 friction 托住，', 'ts', 'start');
  o += text(bx, 224, '两个 finger 一样大。φ = ±90°：box 躺在', 'ts', 'start');
  o += text(bx, 242, '一个 finger 上，另一个的最优 force 是 0。', 'ts', 'start');
  return svgA(560, 268, o, '动图：parallel gripper 夹着 0.5 kg、宽 10 cm 的 box，wrist roll 在正负 90 度之间转；两个 finger 的最优 contact force 在 friction cone 里变化，phi 等于 0 时各 5.48 N，45 度时较大的一个是 7.15 N');
}

// ---------- 第 3 站：ramp ----------
function ramp() {
  const g = 9.81, mu = 0.1;
  let o = '';
  [10, 20].forEach((deg, k) => {
    const th = deg * R, x0 = 24 + k * 280, y0 = 176, L = 236;
    const yTop = y0 - L * Math.sin(th);
    o += path(closed([[x0, y0], [x0 + L * Math.cos(th), y0], [x0, yTop]]), 'wash2');
    o += line(x0, yTop, x0 + L * Math.cos(th), y0, 'ink-b');
    const u = [Math.cos(th), Math.sin(th)], nrm = [-Math.sin(th), -Math.cos(th)];
    const along = (t) => [x0 + t * Math.cos(th), yTop + t * Math.sin(th)];
    const c0 = along(0.3 * L), bw = 36, bh = 24;
    const corners = [[-bw / 2, 0], [bw / 2, 0], [bw / 2, bh], [-bw / 2, bh]].map(([a1, b1]) => [c0[0] + a1 * u[0] + b1 * nrm[0], c0[1] + a1 * u[1] + b1 * nrm[1]]);
    o += path(closed(corners), 'paper');
    const cc = [c0[0] + (bh / 2) * nrm[0], c0[1] + (bh / 2) * nrm[1]];
    o += circle(cc[0], cc[1], 2.5, 'ink-f');
    o += arrow(cc[0], cc[1], cc[0], cc[1] + 32, 'ink', 6) + text(cc[0] - 5, cc[1] + 30, 'mg', 'ts', 'end');
    // acceleration：画在 block 前方，沿斜面
    const f0 = [c0[0] + (bw / 2 + 6) * u[0] + (bh / 2) * nrm[0], c0[1] + (bw / 2 + 6) * u[1] + (bh / 2) * nrm[1]];
    const a = g * (Math.sin(th) - mu * Math.cos(th));
    const La = 14 * a + 8;
    o += arrow(f0[0], f0[1], f0[0] + La * u[0], f0[1] + La * u[1], 'ln', 6);
    o += text(f0[0] + La * u[0] + 6, f0[1] + La * u[1] - 6, 'a', 'tl', 'start');
    // incline 的 angle 标在右下角
    const xr = x0 + L * Math.cos(th);
    const arc = []; for (let j = 0; j <= 12; j++) { const t = Math.PI - th * j / 12; arc.push([xr + 40 * Math.cos(t), y0 - 40 * Math.sin(t)]); }
    o += path(d(arc), 'mute') + text(xr - 30, y0 + 16, deg + '°', 'ts', 'middle');
    o += text(x0 + 118, 214, 'θ = ' + deg + '°：a = ' + a.toFixed(3) + ' m/s²', 't', 'middle');
    o += text(x0 + 118, 232, 'g sin θ = ' + (g * Math.sin(th)).toFixed(3) + '，friction 扣掉 ' + (g * mu * Math.cos(th)).toFixed(3), 'ts', 'middle');
  });
  o += text(280, 22, '同一个 object（μ = 0.1）放在两种 incline 上', 'tb', 'middle');
  return svg(560, 240, o, '同一个 friction coefficient 0.1 的 block 放在 10 度和 20 度的 ramp 上，acceleration 分别是 0.737 和 2.433 米每二次方秒');
}

// ---------- 第 3 站：interactive perception，推一下才分得开 ----------
function pushA() {
  const s = 60, cx = 120, cy = 150;
  const P = ([x, y]) => [cx + s * x, cy - s * y];
  // box A: [-1.6,0]x[-0.7,0.7]，box B: [0,1.4]x[-0.7,0.7]，紧挨着
  const A = [[-1.6, -0.7], [0, -0.7], [0, 0.7], [-1.6, 0.7]], B = [[0, -0.7], [1.4, -0.7], [1.4, 0.7], [0, 0.7]];
  const ptsA = [[-1.2, 0.35], [-0.5, -0.3], [-0.9, -0.45], [-0.3, 0.4]], ptsB = [[0.4, 0.3], [1.0, -0.35], [0.8, 0.45], [0.35, -0.4]];
  const T = 6, N = 30, kt = [0], mot = [0];
  // 0–1 s 静止，1–4 s 推，4–6 s 停住
  for (let i = 1; i <= N; i++) { kt.push((1 + 3 * i / N) / T); mot.push(i / N); }
  kt.push(1); mot.push(1);
  const pivot = [0, -0.7];
  const moveB = (p, m) => add(add(rot(add(p, pivot, -1), 20 * R * m), pivot), [0.9 * m, 0.25 * m]);
  let o = '';
  o += path(closed(A.map(P)), 'wash ink');
  o += apath(mot.map((m) => closed(B.map((p) => P(moveB(p, m))))), kt, T, 'wash ink');
  // pusher：从左下推 B 的右下角（实际从下方 contact B 的 bottom）
  const pushTip = (m) => moveB([0.9, -0.7], m);
  const finger = (m) => { const t = pushTip(m); return closed([[t[0] - 0.1, t[1] - 0.05], [t[0] + 0.1, t[1] - 0.05], [t[0] + 0.1, t[1] - 0.9], [t[0] - 0.1, t[1] - 0.9]].map(P)); };
  o += apath(mot.map(finger), kt, T, 'paper');
  // 特征点：开始灰色，推完之后按 rigid motion 分成两组
  const shownAfter = kt.map((t) => t >= (4 / T) - 1e-9);
  for (const p of ptsA) { o += circle(...P(p), 4, 'ink-f'); }
  for (const p of ptsB) o += acircle(mot.map((m) => P(moveB(p, m))[0]), mot.map((m) => P(moveB(p, m))[1]), kt, T, 4, 'ink-f');
  for (const p of ptsB) o += `<circle cx="${f1(P(moveB(p, 1))[0])}" cy="${f1(P(moveB(p, 1))[1])}" r="6" class="ln" opacity="0">${ashow(shownAfter, kt, T)}</circle>`;
  // 一对跨 box 的点与一对 box 内的点：distance 变化
  const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const pA = ptsA[3], pB = ptsB[0], pB2 = ptsB[1];
  const before = dist(pA, pB), after = dist(pA, moveB(pB, 1));
  const in0 = dist(pB, pB2), in1 = dist(moveB(pB, 1), moveB(pB2, 1));
  const X = 340;
  o += text(X, 40, '只看 image：分不出几个 object', 'tb', 'start');
  o += `<text x="${X}" y="58" class="tl" text-anchor="start" opacity="0">推完：一起动的点归成一组${ashow(shownAfter, kt, T)}</text>`;
  o += text(X, 84, '每对点的 distance（box 高 1.4）', 'ts', 'start');
  o += text(X, 106, '跨两个 box 的一对：' + before.toFixed(2) + ' → ' + after.toFixed(2), 't', 'start');
  o += text(X, 126, '同一个 box 里的一对：' + in0.toFixed(2) + ' → ' + in1.toFixed(2), 't', 'start');
  o += text(X, 156, 'Rigid body 上任意两点的 distance', 'ts', 'start');
  o += text(X, 174, '不随 motion 改变。distance 变了的一对', 'ts', 'start');
  o += text(X, 192, '一定属于不同 object。', 'ts', 'start');
  o += text(cx + 10, 268, 'finger 从下面推右边那块', 'ts', 'middle');
  return svgA(560, 280, o, '动图：两个紧挨着的 box 在 image 里看起来是一整块；finger 推右边的 box，它平移并转了 20 度，左边的不动；跟着一起动的特征点被圈出来，分成两个 object');
}

// ---------- 路口：开头的平均 policy，与第 4 站的 CoIL ----------
// 右侧通行：车从 (1.75, −30) 向北；左转 radius 9.5 m 进入 y = +1.75 的 westbound lane，右转 radius 6 m 进入 y = −1.75 的 eastbound lane；两者都在 y = −7.75 开始转
const Lw = 2.5, V = 5, DT = 0.01, Y0 = -30, YT = -7.75, T0 = (YT - Y0) / V;
export const dL = Math.atan(Lw / 9.5), dR = -Math.atan(Lw / 6), TLt = (Math.PI / 2 * 9.5) / V, TRt = (Math.PI / 2 * 6) / V;
const steerOf = (g, t) => (t < 0 ? 0 : g === 'L' ? (t < TLt ? dL : 0) : g === 'R' ? (t < TRt ? dR : 0) : 0);
export function rollout(fn, Ttot = 13) {
  let x = 1.75, y = Y0, th = Math.PI / 2;
  const out = [[0, x, y, th]];
  for (let t = 0; t < Ttot; t += DT) {
    const dd = fn(t - T0);
    x += V * Math.cos(th) * DT; y += V * Math.sin(th) * DT; th += (V / Lw) * Math.tan(dd) * DT;
    out.push([t + DT, x, y, th]);
  }
  return out;
}
export const avgSteer = (t) => (steerOf('L', t) + steerOf('S', t) + steerOf('R', t)) / 3;
const inBox = (q) => Math.abs(q[1]) <= 30 && q[2] <= 30;
function roads(P) {
  let o = '';
  o += path(closed([[-3.5, -32], [3.5, -32], [3.5, 30], [-3.5, 30]].map(P)), 'wash2');
  o += path(closed([[-30, -3.5], [30, -3.5], [30, 3.5], [-30, 3.5]].map(P)), 'wash2');
  o += line(...P([0, -32]), ...P([0, -3.5]), 'grid') + line(...P([0, 3.5]), ...P([0, 30]), 'grid');
  o += line(...P([-30, 0]), ...P([-3.5, 0]), 'grid') + line(...P([3.5, 0]), ...P([30, 0]), 'grid');
  return o;
}
function avgFig() {
  const s = 3.6, cx = 140, cy = 132;
  const P = ([x, y]) => [cx + s * x, cy - s * y];
  let o = roads(P);
  for (const g of ['L', 'S', 'R']) {
    const r = rollout((t) => steerOf(g, t)).filter(inBox);
    o += path(d(r.map((q) => P([q[1], q[2]]))), 'dash');
  }
  const ra = rollout(avgSteer).filter(inBox);
  o += path(d(ra.map((q) => P([q[1], q[2]]))), 'ln');
  o += path(closed(carPts(...P([1.75, -28]), -Math.PI / 2, 12, 6)), 'solid');
  o += text(...P([-29, 6]), 'left', 'ts', 'start');
  o += text(...P([29, -9.5]), 'right', 'ts', 'end');
  const end = ra[ra.length - 1];
  o += text(P([end[1], 30])[0] - 10, P([end[1], 30])[1] + 10, 'straight', 'ts', 'end');
  o += text(P([end[1], 30])[0] + 8, P([end[1], 30])[1] + 10, '学了全部 demo 的 policy', 'tl', 'start');
  const X = 270;
  o += text(X, 72, '虚线：三种 demo，同一个起点', 'ts', 'start');
  o += text(X, 90, '彩色：三种 demo 放在一起用 MSE 学', 'ts', 'start');
  o += text(X, 124, '开始转弯时三种 demo 的 steering：', 't', 'start');
  o += text(X, 144, fmt(dL, 3) + '、0、' + fmt(dR, 3) + ' rad', 't', 'start');
  o += text(X, 164, 'MSE 的最优输出是平均：' + fmt((dL + dR) / 3, 3) + ' rad', 't', 'start');
  o += text(X, 198, '不管想去哪里，都大致直走；', 'ts', 'start');
  o += text(X, 216, '最后 heading ' + (end[3] / R).toFixed(1) + '°，', 'ts', 'start');
  o += text(X, 234, '开到图的上边缘时比直行的 lane 偏右 ' + (end[1] - 1.75).toFixed(2) + ' m。', 'ts', 'start');
  return svg(560, 252, o, '路口俯视图：三条虚线是 left、straight、right 三种 demonstration；把它们放在一起用 MSE 学一个 policy，rollout 出来几乎直走');
}
function coilA() {
  const s = 3.6, cx = 140, cy = 132;
  const P = ([x, y]) => [cx + s * x, cy - s * y];
  let o = roads(P);
  const goals = ['L', 'S', 'R'], names = { L: 'left', S: 'straight', R: 'right' };
  const seg = 5.0, T = seg * 3;
  const kt = [], seq = [];
  const runs = goals.map((g) => rollout((t) => steerOf(g, t)).filter(inBox));
  runs.forEach((r, gi) => {
    const n = 50;
    for (let k = 0; k <= n; k++) {
      const q = r[Math.min(r.length - 1, Math.round(k * (r.length - 1) / n))];
      kt.push((gi * seg + (seg - 0.8) * k / n) / T); seq.push([gi, q]);
    }
  });
  kt.push(1); seq.push(seq[seq.length - 1]);
  for (const r of runs) o += path(d(r.map((q) => P([q[1], q[2]]))), 'dash');
  o += apath(seq.map(([, q]) => closed(carPts(...P([q[1], q[2]]), -q[3], 12, 6))), kt, T, 'solid', true);
  goals.forEach((g, gi) => {
    const on = seq.map(([k]) => k === gi);
    o += `<text x="20" y="24" class="tl" text-anchor="start" opacity="${on[0] ? 1 : 0}">command = ${names[g]}${ashow(on, kt, T)}</text>`;
  });
  // 右边：branched network
  const X = 290;
  o += text(X + 130, 30, 'branched network', 'tb', 'middle');
  o += rect(X, 106, 58, 34, 'paper', 4) + text(X + 29, 128, 'image', 'ts', 'middle');
  o += arrow(X + 60, 123, X + 78, 123, 'ink', 5);
  o += rect(X + 80, 98, 62, 50, 'wash ink', 4) + text(X + 111, 119, 'shared', 'ts', 'middle') + text(X + 111, 135, 'layers', 'ts', 'middle');
  goals.forEach((g, gi) => {
    const y = 58 + gi * 52;
    o += line(X + 142, 123, X + 164, y + 14, 'mute');
    o += rect(X + 164, y, 92, 28, 'paper', 4) + text(X + 210, y + 18, names[g], 'ts', 'middle');
    const on = seq.map(([k]) => k === gi);
    o += `<rect x="${X + 164}" y="${y}" width="92" height="28" rx="4" class="solid" opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}</rect>`;
    o += `<text x="${X + 210}" y="${y + 18}" class="tw" text-anchor="middle" opacity="${on[0] ? 1 : 0}">${names[g]}${ashow(on, kt, T)}</text>`;
  });
  o += text(X + 210, 52, 'heads', 'ts', 'middle');
  o += text(X, 206, '三个 head 共用前面的 layers；', 'ts', 'start');
  o += text(X, 224, 'command 只决定读哪个 head 的 output。', 'ts', 'start');
  return svgA(560, 258, o, '动图：同一个起点，command 依次是 left、straight、right，branched network 只用对应的 head，车分别走三条不同的路线');
}

// ---------- 第 4 站：steering 与 throttle 的 covariance ----------
function covData() {
  const X = [];
  for (let k = 0; k < 40; k++) {
    const s = 0.25 * Math.sin(2 * Math.PI * k * 0.618034);
    const th = 0.6 - 1.2 * s + 0.05 * Math.sin(2 * Math.PI * k * 0.414214 + 1.0);
    X.push([s, th]);
  }
  const m = [0, 1].map((j) => X.reduce((a, p) => a + p[j], 0) / X.length);
  const C = [[0, 0], [0, 0]];
  for (const p of X) for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) C[i][j] += (p[i] - m[i]) * (p[j] - m[j]) / X.length;
  return { X, m, C };
}
const nll2 = (p, m, C) => {
  const det = C[0][0] * C[1][1] - C[0][1] * C[1][0];
  const inv = [[C[1][1] / det, -C[0][1] / det], [-C[1][0] / det, C[0][0] / det]];
  const dx = [p[0] - m[0], p[1] - m[1]];
  const q = dx[0] * (inv[0][0] * dx[0] + inv[0][1] * dx[1]) + dx[1] * (inv[1][0] * dx[0] + inv[1][1] * dx[1]);
  return 0.5 * q + 0.5 * Math.log(det) + Math.log(2 * Math.PI);
};
function covFig() {
  const { X, m, C } = covData();
  const Cd = [[C[0][0], 0], [0, C[1][1]]];
  const sx = lin(-0.45, 0.45, 50, 330), sy = lin(0.1, 1.15, 236, 30);
  let o = axes({ sx, sy, x0: -0.45, x1: 0.45, y0: 0.1, y1: 1.15, xt: [[-0.4, '−0.4'], [-0.2, '−0.2'], [0, '0'], [0.2, '0.2'], [0.4, '0.4']], yt: [0.2, 0.4, 0.6, 0.8, 1.0], xl: 'steering', yl: 'throttle' });
  const ell = (CC, cls) => {
    // 2σ ellipse：eigen 分解
    const a = CC[0][0], b = CC[0][1], c = CC[1][1];
    const tr = a + c, dt = a * c - b * b, l1 = tr / 2 + Math.sqrt(tr * tr / 4 - dt), l2 = tr / 2 - Math.sqrt(tr * tr / 4 - dt);
    const ang = Math.abs(b) < 1e-12 ? 0 : Math.atan2(l1 - a, b);
    const pts = [];
    for (let k = 0; k <= 80; k++) {
      const t = 2 * Math.PI * k / 80, u = [2 * Math.sqrt(l1) * Math.cos(t), 2 * Math.sqrt(l2) * Math.sin(t)];
      const r = rot(u, ang);
      pts.push([sx(m[0] + r[0]), sy(m[1] + r[1])]);
    }
    return path(d(pts), cls);
  };
  o += ell(Cd, 'dash') + ell(C, 'ln');
  for (const p of X) o += circle(sx(p[0]), sy(p[1]), 2.8, 'ink-f');
  const q1 = [0.2, 0.36], q2 = [0.2, 0.84];
  o += circle(sx(q1[0]), sy(q1[1]), 5, 'paper') + text(sx(q1[0]) + 9, sy(q1[1]) + 4, 'P', 'tb', 'start');
  o += circle(sx(q2[0]), sy(q2[1]), 5, 'paper') + text(sx(q2[0]) + 9, sy(q2[1]) + 4, 'Q', 'tb', 'start');
  const X0 = 352;
  o += text(X0, 40, 'demo：转得越多，throttle 越小', 'tb', 'start');
  o += text(X0, 58, '彩色：full covariance 的 2σ', 'ts', 'start');
  o += text(X0, 74, '虚线：diagonal covariance 的 2σ', 'ts', 'start');
  o += text(X0, 108, '−log density', 'tb', 'start');
  o += text(X0, 128, 'P（右转并减速）', 't', 'start');
  o += text(X0, 146, 'full ' + fmt(nll2(q1, m, C)) + '，diagonal ' + fmt(nll2(q1, m, Cd)), 'ts', 'start');
  o += text(X0, 172, 'Q（右转并加速）', 't', 'start');
  o += text(X0, 190, 'full ' + fmt(nll2(q2, m, C), 1) + '，diagonal ' + fmt(nll2(q2, m, Cd)), 'ts', 'start');
  o += text(X0, 222, 'Diagonal 认为 P 和 Q 一样可能。', 'ts', 'start');
  return svg(560, 272, o, '40 个 steering 与 throttle 的 demonstration 点几乎在一条斜线上；full covariance 的 ellipse 是斜的细长形，diagonal covariance 的 ellipse 是正的；点 P 和 Q 的 negative log density 在两种 model 下差别很大');
}

// ---------- 第 5 站：每回答一次 comparison，w 的 posterior 收窄 ----------
export function prefRun() {
  const nA = 180, A = [], post = [];
  for (let i = 0; i < nA; i++) { A.push(2 * i * R); post.push(1 / nA); }
  const ws = 70 * R, sig = (z) => 1 / (1 + Math.exp(-z)), scale = 4;
  const hb = (q) => (q <= 0 || q >= 1 ? 0 : -(q * Math.log2(q) + (1 - q) * Math.log2(1 - q)));
  const frames = [{ post: post.slice(), psi: null, ans: null, H: Math.log2(nA) }];
  let p = post.slice();
  for (let k = 0; k < 8; k++) {
    let best = null;
    for (let b = 0; b < 180; b += 5) {
      const psi = [scale * Math.cos(b * R), scale * Math.sin(b * R)];
      const pa = A.map((a) => sig(Math.cos(a) * psi[0] + Math.sin(a) * psi[1]));
      const PA = pa.reduce((s, v, i) => s + v * p[i], 0);
      const ig = hb(PA) - pa.reduce((s, v, i) => s + p[i] * hb(v), 0);
      if (!best || ig > best.ig + 1e-12) best = { b, psi, ig };
    }
    const ans = Math.cos(ws) * best.psi[0] + Math.sin(ws) * best.psi[1] > 0;
    p = p.map((v, i) => { const z = sig(Math.cos(A[i]) * best.psi[0] + Math.sin(A[i]) * best.psi[1]); return v * (ans ? z : 1 - z); });
    const Z = p.reduce((s, v) => s + v, 0); p = p.map((v) => v / Z);
    const H = -p.reduce((s, v) => s + (v > 0 ? v * Math.log2(v) : 0), 0);
    frames.push({ post: p.slice(), psi: best.b, ans, H, ig: best.ig });
  }
  return { A, frames, ws };
}
function prefA() {
  const { A, frames, ws } = prefRun();
  const cx = 150, cy = 142, r0 = 56, scale = 1100;
  const T = 13, nF = frames.length, kt = [], idx = [];
  for (let k = 0; k < nF; k++) { kt.push(k / (nF + 1)); idx.push(k); }
  kt.push(nF / (nF + 1)); idx.push(nF - 1); kt.push(1); idx.push(nF - 1);
  let o = line(cx - r0 - 70, cy, cx + r0 + 70, cy, 'grid') + line(cx, cy - r0 - 70, cx, cy + r0 + 70, 'grid');
  o += circle(cx, cy, r0, 'ink');
  o += text(cx + r0 + 72, cy + 4, 'w₁', 'ts', 'start') + text(cx + 6, cy - r0 - 66, 'w₂', 'ts', 'start');
  // posterior：从 circle 往外的 radial bar
  const bars = (post) => A.map((a, i) => { const rr = r0 + Math.min(80, scale * post[i]); return 'M' + f1(cx + r0 * Math.cos(a)) + ' ' + f1(cy - r0 * Math.sin(a)) + 'L' + f1(cx + rr * Math.cos(a)) + ' ' + f1(cy - rr * Math.sin(a)); }).join('');
  o += apath(idx.map((k) => bars(frames[k].post)), kt, T, 'ln', true);
  const hp = (k) => {
    const f = frames[k];
    if (f.psi === null) return d([[cx, cy], [cx, cy]]);
    const b = f.psi * R, n = [-Math.sin(b), Math.cos(b)], L = 100;
    return d([[cx - L * n[0], cy + L * n[1]], [cx + L * n[0], cy - L * n[1]]]);
  };
  o += apath(idx.map(hp), kt, T, 'dash', true);
  o += arrow(cx, cy, cx + (r0 - 6) * Math.cos(ws), cy - (r0 - 6) * Math.sin(ws), 'ink-b', 7);
  o += text(cx + 16, cy - 14, 'w*（70°）', 'tb', 'start');
  const X = 340;
  o += text(X, 26, '每次回答之后的 entropy', 'tb', 'start');
  frames.forEach((f, k) => {
    const y = 52 + k * 22;
    const s2 = k === 0 ? 'prior：uniform，H = ' + f.H.toFixed(2) + ' bit' : k + '：ψ 方向 ' + f.psi + '°，选 ' + (f.ans ? 'A' : 'B') + '，H = ' + f.H.toFixed(2);
    const on = idx.map((j) => j >= k);
    o += `<text x="${X}" y="${y}" class="t" text-anchor="start" opacity="${on[0] ? 1 : 0}">${s2}${ashow(on, kt, T)}</text>`;
  });
  o += text(cx, 262, '彩色线越长，那个方向的 w 越可能', 'ts', 'middle') + text(cx, 278, '虚线：这次 query 的 hyperplane', 'ts', 'middle');
  return svgA(560, 286, o, '动图：w 在 unit circle 上的 posterior 画成向外的 radial bar，每回答一次 information gain 最大的 comparison query，posterior 就收窄一些，8 次之后集中在真实的 70 度附近，entropy 从 7.49 bit 降到 4.77 bit');
}

// ---------- 第 6 站：考虑 human 的 response 之后，robot 的 optimum 移动 ----------
function stackFig() {
  const k = 1.2, RR = (u, uh) => 2 * u - 2 * u * u - k * u * (1 + uh);
  const sx = lin(0, 1, 310, 540), sy = lin(-0.2, 0.4, 224, 44);
  const uR = 'u' + sub('R'), uH = 'u' + sub('H');
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: -0.2, y1: 0.4, xt: [0, 0.2, 0.5, 1], yt: [[-0.2, '−0.2'], 0, 0.2, 0.4], grid: true });
  o += text(sx(1), 256, uR + '（robot 切进来多少）', 'ts', 'end');
  o += text(310, 24, 'robot 的 reward R' + sub('R'), 'tb', 'start');
  o += path(curve((u) => RR(u, 0), 0, 0.57, sx, sy), 'dash');
  o += path(curve((u) => RR(u, -u), 0, 1, sx, sy), 'ln');
  o += circle(sx(0.2), sy(RR(0.2, 0)), 4, 'ink-f');
  o += circle(sx(0.2), sy(RR(0.2, -0.2)), 4.5, 'paper');
  o += circle(sx(0.5), sy(RR(0.5, -0.5)), 5, 'ln-f');
  o += text(sx(0.62), sy(0.37), '代入 best response：', 'tl', 'middle') + text(sx(0.62), sy(0.37) + 17, 'optimum 0.5，得 0.200', 'tl', 'middle');
  o += line(sx(0.2), sy(RR(0.2, 0)) + 6, sx(0.2), sy(-0.055), 'mute');
  o += text(sx(0.02), sy(-0.09), '以为人不动，选 0.2', 'ts', 'start');
  o += text(sx(0.02), sy(-0.09) + 16, '实际得到 ' + RR(0.2, -0.2).toFixed(3), 'ts', 'start');
  o += text(sx(0.5) + 8, sy(RR(0.5, 0)) + 4, uH + ' = 0', 'ts', 'start');
  o += text(sx(0.78), sy(RR(0.78, -0.78)) + 26, uH + ' = −' + uR, 'tl', 'middle');
  // 左边：road
  const ry = 60, lw = 36;
  o += text(20, ry - 10, 'robot（R）在上面的 lane，要并进下面', 'ts', 'start');
  o += rect(20, ry, 260, 2 * lw, 'wash2') + line(20, ry + lw, 280, ry + lw, 'dash');
  o += rect(160, ry + 8, 46, 20, 'solid', 4) + text(183, ry + 22, 'R', 'tw', 'middle');
  o += arrow(183, ry + 30, 183, ry + lw + 8, 'ln', 6) + text(190, ry + lw + 4, uR, 'tl', 'start');
  o += rect(70, ry + lw + 8, 46, 20, 'paper', 4) + text(93, ry + lw + 22, 'H', 'tb', 'middle');
  o += arrow(66, ry + lw + 18, 36, ry + lw + 18, 'ink', 6);
  o += text(20, ry + 2 * lw + 18, uH + ' < 0：减速', 'ts', 'start');
  o += text(20, 186, 'human 的 best response：' + uH + '* = −' + uR, 't', 'start');
  o += text(20, 206, '切得越多，人减速越多；robot reward 里', 'ts', 'start');
  o += text(20, 222, 'collision risk 那一项 −1.2 ' + uR + '(1 + ' + uH + ') 就越小。', 'ts', 'start');
  return svg(560, 262, o, '左边：robot 车在上面的 lane，向下切进 u_R，下面 lane 的 human 车以减速回应。右边：robot 的 reward 关于 u_R 的两条 curve，以为人不动时 optimum 在 0.2，算上人的 best response 后 optimum 在 0.5');
}

// ---------- 第 6 站：nudge 一下，看人怎么反应 ----------
function nudgeA() {
  const sig = 0.15, kk = 0.8, n = 0.2, steps = 6, stepT = 0.9;
  const lo1 = (kk * n) ** 2 / (2 * sig * sig);
  // keyframe：0..6 是 nudge 的步数，7 是让开或抢到位置，8 是并道
  const times = [0]; for (let k = 1; k <= steps; k++) times.push(k * stepT);
  times.push(steps * stepT + 1.2, steps * stepT + 2.4, steps * stepT + 4.0);
  const T = times[times.length - 1], kt = times.map((t) => t / T), st = [0, 1, 2, 3, 4, 5, 6, 7, 8, 8];
  const bel = (k, att) => 1 / (1 + Math.exp(-(att ? 1 : -1) * Math.min(k, steps) * lo1));
  let o = '';
  const row = (y0, att, title) => {
    const lw = 26, x0 = 20, x1 = 360, top = y0 + lw / 2, bot = y0 + lw + lw / 2;
    o += rect(x0, y0, x1 - x0, 2 * lw, 'wash2') + line(x0, y0 + lw, x1, y0 + lw, 'dash');
    o += text(x0, y0 - 8, title, 'tb', 'start');
    const rPos = (k) => {
      if (k === 0) return [220, top];
      if (k <= steps) return [220, top + 7];
      if (att) return k === 7 ? [228, top + 7] : [228, bot];
      return k === 7 ? [130, top + 3] : [130, bot];
    };
    const hPos = (k) => (att ? [150 - 9 * Math.min(k, steps) - (k > steps ? 12 : 0), bot] : [150 + (k > steps ? 80 : 0), bot]);
    const box = ([x, y], w = 40, h = 16) => closed([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]);
    o += apath(st.map((k) => box(rPos(k))), kt, T, 'solid');
    o += apath(st.map((k) => box(hPos(k))), kt, T, 'paper');
    o += `<text class="tw" text-anchor="middle" x="${rPos(0)[0]}" y="${rPos(0)[1] + 5}">R${anim('x', st.map((k) => f1(rPos(k)[0])), kt, T)}${anim('y', st.map((k) => f1(rPos(k)[1] + 5)), kt, T)}</text>`;
    o += `<text class="tb" text-anchor="middle" x="${hPos(0)[0]}" y="${hPos(0)[1] + 5}">H${anim('x', st.map((k) => f1(hPos(k)[0])), kt, T)}</text>`;
    const bx = 390, bw = 150;
    o += text(bx, y0 + 6, 'b(attentive)', 'ts', 'start');
    o += rect(bx, y0 + 14, bw, 14, 'wash2');
    const ws = st.map((k) => bw * bel(k, att));
    o += `<rect x="${bx}" y="${y0 + 14}" height="14" width="${f1(ws[0])}" class="solid">${anim('width', ws.map(f1), kt, T, true)}</rect>`;
    o += line(bx + bw / 2, y0 + 10, bx + bw / 2, y0 + 32, 'ink');
    for (let k = 0; k <= steps; k++) {
      const on = st.map((j) => j === k || (k === steps && j > steps));
      o += `<text x="${bx}" y="${y0 + 48}" class="ts" text-anchor="start" opacity="${on[0] ? 1 : 0}">第 ${k} 步：${bel(k, att).toFixed(3)}${ashow(on, kt, T)}</text>`;
    }
  };
  row(36, true, 'attentive 的 human：看到 nudge 就减速');
  row(140, false, 'distracted 的 human：没有反应');
  o += text(280, 236, 'robot 每步往 lane line 挪 0.2 m，从 human 的 acceleration 更新 belief；', 'ts', 'middle');
  o += text(280, 252, '最后 attentive 的 case 并到前面，distracted 的 case 先让开再并到后面。', 'ts', 'middle');
  return svgA(560, 262, o, '动图：两条两车道的路，robot 车每步向 lane line 挪 0.2 米；上面的 human 减速，b(attentive) 六步后升到 0.968；下面的 human 没反应，b 降到 0.032；最后 robot 分别并到前面和后面');
}

// ---------- 第 7 站：shared autonomy 的 lane change ----------
// 简化的 lane change：车以 10 m/s 前进，action 是 lateral velocity（m/s）
export function sharedSim(assist, opt = {}) {
  const { gain = 0.4, sigma = 0.3, clipR = 0.5, win = 5, Tend = 6, jit = 0.12, hes = 1.0, ph = 3.5, gate = 0 } = opt;
  const v = 10, dt = 0.1, yL = 3.5, yRt = -3.5, k = 1.0, cap = 1.5;
  const m = (yg, y) => Math.max(-cap, Math.min(cap, k * (yg - y)));
  const gauss = (a, mu) => Math.exp(-((a - mu) ** 2) / (2 * sigma * sigma));
  let x = 0, y = 0;
  const out = [], hist = [];
  for (let i = 0; i <= Math.round(Tend / dt); i++) {
    const t = i * dt;
    const mL = m(yL, y), mR = m(yRt, y);
    // human 想去 left：前 hes 秒还在犹豫（只有抖动），之后只给出 optimal action 的 gain 倍
    const aH = (t < hes ? 0 : gain * mL) + jit * Math.sin(2.7 * t + ph);
    const lL = gauss(aH, gain * mL), lR = gauss(aH, gain * mR);
    const pStep = lL / (lL + lR);
    hist.push(pStep);
    const pL = hist.slice(-win).reduce((s2, q) => s2 + q, 0) / Math.min(win, hist.length);
    let aR = pL * (mL - gain * mL) + (1 - pL) * (mR - gain * mR);
    if (gate > 0 && Math.max(pL, 1 - pL) < gate) aR = 0;
    aR = Math.max(-clipR, Math.min(clipR, aR));
    if (!assist) aR = 0;
    out.push({ t, x, y, aH, aR, pL, pStep, mL, mR });
    x += v * dt; y += (aH + aR) * dt;
  }
  return out;
}
function sharedA() {
  const A = sharedSim(true), H = sharedSim(false);
  const sx = lin(0, 60, 24, 536), sy = lin(-5.25, 5.25, 178, 46);
  let o = rect(sx(0), sy(5.25), sx(60) - sx(0), sy(-5.25) - sy(5.25), 'wash2');
  o += line(sx(0), sy(1.75), sx(60), sy(1.75), 'dash') + line(sx(0), sy(-1.75), sx(60), sy(-1.75), 'dash');
  o += text(sx(1), sy(3.5) + 4, 'left lane（human 的 goal）', 'ts', 'start');
  o += text(sx(60) - 4, sy(-3.5) + 4, 'right lane', 'ts', 'end');
  o += path(d(H.map((q) => [sx(q.x), sy(q.y)])), 'dash');
  o += path(d(A.map((q) => [sx(q.x), sy(q.y)])), 'ln');
  const hEnd = H[H.length - 1], aEnd = A[A.length - 1];
  o += text(sx(30), sy(H[30].y) + 18, '只有 human：6 s 后 y = ' + hEnd.y.toFixed(2) + ' m', 'ts', 'start');
  o += text(sx(60) - 4, sy(4.75), 'shared autonomy：' + aEnd.y.toFixed(2) + ' m', 'tl', 'end');
  const i5 = A.findIndex((q) => q.t > 0.45);
  o += text(sx(A[i5].x) + 4, sy(-1.75) + 16, '犹豫时被往右推', 'ts', 'start');
  const T = 7, kt = A.map((q) => q.t / T).concat([1]), seq = A.concat([aEnd]);
  const kx = sx(1) - sx(0), ky = sy(0) - sy(1);
  o += apath(seq.map((q) => closed(carPts(sx(q.x), sy(q.y), Math.atan2(-ky * (q.aH + q.aR), kx * 10), 22, 11))), kt, T, 'solid');
  // 下面：P(left) 与两个 action
  const bx = 76, bw = 170, by = 214;
  o += text(24, by + 11, 'P(left)', 'ts', 'start');
  o += rect(bx, by, bw, 14, 'wash2');
  o += `<rect x="${bx}" y="${by}" height="14" width="${f1(bw * seq[0].pL)}" class="solid">${anim('width', seq.map((q) => f1(bw * q.pL)), kt, T)}</rect>`;
  o += line(bx + bw / 2, by - 4, bx + bw / 2, by + 18, 'ink') + text(bx + bw / 2, by + 32, '0.5', 'ts', 'middle');
  const cx = 420, sc = 70;
  o += text(286, by + 4, 'a' + sub('H') + '（黑）', 'ts', 'start') + text(286, by + 22, 'a' + sub('R') + '（彩色）', 'ts', 'start');
  o += line(cx, by - 8, cx, by + 26, 'axis') + text(cx, by + 40, '0', 'ts', 'middle');
  o += apath(seq.map((q) => d([[cx, by], [cx + sc * q.aH, by]])), kt, T, 'ink-b');
  o += apath(seq.map((q) => d([[cx, by + 16], [cx + sc * q.aR, by + 16]])), kt, T, 'ln');
  o += text(cx + 100, by + 40, '向右为 left 方向', 'ts', 'end');
  o += text(280, 24, 'human 想换到左边：前 1 s 犹豫（只有抖动），之后只给出 optimal action 的 0.4 倍', 'tb', 'middle');
  return svgA(560, 262, o, '动图：三车道的路，车从中间 lane 出发；human 前一秒犹豫，robot 把抖动读成想去右边，往右推了半米；human 开始往左之后 P(left) 很快到 1，robot 接着帮忙，6 秒后到 3.30 米，只有 human 时是 2.69 米');
}

export default {
  'cs237b-spin': spinA,
  'cs237b-span': span,
  'cs237b-eps': epsFig,
  'cs237b-gfo': gfoA,
  'cs237b-ramp': ramp,
  'cs237b-push': pushA,
  'cs237b-avg': avgFig,
  'cs237b-coil': coilA,
  'cs237b-cov': covFig,
  'cs237b-pref': prefA,
  'cs237b-stack': stackFig,
  'cs237b-nudge': nudgeA,
  'cs237b-shared': sharedA,
};
