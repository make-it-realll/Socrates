import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具：数值线性代数（图里所有数字都由这些函数现算） ----------
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n) => (n < 0 ? '⁻' : '') + String(Math.abs(n)).split('').map((c) => SUP[+c]).join('');
const sci = (v, dg = 1) => { if (v === 0) return '0'; let e = Math.floor(Math.log10(Math.abs(v))); let m = Math.abs(v) / 10 ** e; if (+m.toFixed(dg) >= 10) { e += 1; m /= 10; } if (+m.toFixed(dg) < 1) { e -= 1; m *= 10; } return (v < 0 ? '−' : '') + m.toFixed(dg) + '×10' + sup(e); };
const mn = (v, dg) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(dg);
const zeros = (m, n) => Array.from({ length: m }, () => new Array(n).fill(0));
const T_ = (A) => A[0].map((_, j) => A.map((r) => r[j]));
const mul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const mv = (A, x) => A.map((r) => r.reduce((s, v, k) => s + v * x[k], 0));
const dot = (x, y) => x.reduce((s, v, i) => s + v * y[i], 0);
const nrm = (x) => Math.sqrt(dot(x, x));
const col = (A, j) => A.map((r) => r[j]);
function rng(seed) {
  let a = seed >>> 0;
  const u = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => { let x = 0; while (x === 0) x = u(); return Math.sqrt(-2 * Math.log(x)) * Math.cos(2 * Math.PI * u()); };
}
// Householder QR：返回 R（上三角 n×n）、reflector 列表；可选显式 Q（m×n）
function hqr(A0, wantQ = true) {
  const A = A0.map((r) => r.slice()), m = A.length, n = A[0].length, vs = [];
  for (let k = 0; k < n; k++) {
    const x = []; for (let i = k; i < m; i++) x.push(A[i][k]);
    const v = x.slice(); v[0] += (x[0] >= 0 ? 1 : -1) * nrm(x);
    const vv = dot(v, v); vs.push(v);
    if (vv === 0) continue;
    for (let j = k; j < n; j++) { let s = 0; for (let i = k; i < m; i++) s += v[i - k] * A[i][j]; s = (2 * s) / vv; for (let i = k; i < m; i++) A[i][j] -= s * v[i - k]; }
  }
  const applyQt = (b) => { const y = b.slice(); vs.forEach((v, k) => { const vv = dot(v, v); if (!vv) return; let s = 0; for (let i = k; i < m; i++) s += v[i - k] * y[i]; s = (2 * s) / vv; for (let i = k; i < m; i++) y[i] -= s * v[i - k]; }); return y; };
  const R = zeros(n, n); for (let i = 0; i < n; i++) for (let j = i; j < n; j++) R[i][j] = A[i][j];
  let Q = null;
  if (wantQ) {
    Q = zeros(m, n); for (let j = 0; j < n; j++) Q[j][j] = 1;
    for (let k = n - 1; k >= 0; k--) { const v = vs[k], vv = dot(v, v); if (!vv) continue; for (let j = 0; j < n; j++) { let s = 0; for (let i = k; i < m; i++) s += v[i - k] * Q[i][j]; s = (2 * s) / vv; for (let i = k; i < m; i++) Q[i][j] -= s * v[i - k]; } }
  }
  return { R, Q, applyQt, vs };
}
function gs(A, modified) {
  const m = A.length, n = A[0].length, Q = zeros(m, n), R = zeros(n, n);
  for (let j = 0; j < n; j++) {
    const a = col(A, j), v = a.slice();
    for (let i = 0; i < j; i++) { const q = col(Q, i); R[i][j] = dot(q, modified ? v : a); for (let k = 0; k < m; k++) v[k] -= R[i][j] * q[k]; }
    R[j][j] = nrm(v); for (let k = 0; k < m; k++) Q[k][j] = v[k] / R[j][j];
  }
  return { Q, R };
}
const backsub = (R, y) => { const n = R.length, x = new Array(n).fill(0); for (let i = n - 1; i >= 0; i--) { let s = y[i]; for (let k = i + 1; k < n; k++) s -= R[i][k] * x[k]; x[i] = s / R[i][i]; } return x; };
function gepp(A0, b0) {
  const A = A0.map((r) => r.slice()), b = b0.slice(), n = A.length;
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
    for (let i = k + 1; i < n; i++) { const l = A[i][k] / A[k][k]; for (let j = k; j < n; j++) A[i][j] -= l * A[k][j]; b[i] -= l * b[k]; }
  }
  return backsub(A, b);
}
// 对称矩阵的 cyclic Jacobi：返回 eigenvalue 与 eigenvector（列）
function jacobiEig(S0) {
  const S = S0.map((r) => r.slice()), n = S.length, V = zeros(n, n);
  for (let i = 0; i < n; i++) V[i][i] = 1;
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += S[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(S[p][q]) < 1e-300) continue;
      const th = (S[q][q] - S[p][p]) / (2 * S[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const a = S[k][p], b = S[k][q]; S[k][p] = c * a - s * b; S[k][q] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = S[p][k], b = S[q][k]; S[p][k] = c * a - s * b; S[q][k] = s * a + c * b; }
      for (let k = 0; k < n; k++) { const a = V[k][p], b = V[k][q]; V[k][p] = c * a - s * b; V[k][q] = s * a + c * b; }
    }
  }
  const idx = [...Array(n).keys()].sort((a, b) => S[b][b] - S[a][a]);
  return { w: idx.map((i) => S[i][i]), V: V.map((r) => idx.map((i) => r[i])) };
}
// one-sided Jacobi SVD（m ≥ n）：数值上和 Householder 一样稳，用来做 least squares 的 SVD 解法
function jsvd(A0) {
  const U = A0.map((r) => r.slice()), m = U.length, n = U[0].length, V = zeros(n, n);
  for (let i = 0; i < n; i++) V[i][i] = 1;
  for (let sweep = 0; sweep < 80; sweep++) {
    let rot = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      let a = 0, b = 0, c = 0; for (let k = 0; k < m; k++) { a += U[k][p] ** 2; b += U[k][q] ** 2; c += U[k][p] * U[k][q]; }
      if (Math.abs(c) <= 1e-16 * Math.sqrt(a * b)) continue;
      rot++;
      const z = (b - a) / (2 * c), t = Math.sign(z || 1) / (Math.abs(z) + Math.sqrt(1 + z * z)), cs = 1 / Math.sqrt(1 + t * t), sn = cs * t;
      for (let k = 0; k < m; k++) { const x = U[k][p], y = U[k][q]; U[k][p] = cs * x - sn * y; U[k][q] = sn * x + cs * y; }
      for (let k = 0; k < n; k++) { const x = V[k][p], y = V[k][q]; V[k][p] = cs * x - sn * y; V[k][q] = sn * x + cs * y; }
    }
    if (!rot) break;
  }
  const s = []; for (let j = 0; j < n; j++) { const c = col(U, j); s.push(nrm(c)); for (let k = 0; k < m; k++) U[k][j] /= s[j] || 1; }
  return { U, s, V };
}

// ---------- 引子 1 / 第 2 站：classical 与 modified Gram–Schmidt 的 r_jj ----------
let GS80 = null;
function gs80() {
  if (GS80) return GS80;
  const g = rng(335), m = 80;
  const G1 = Array.from({ length: m }, () => Array.from({ length: m }, g)), G2 = Array.from({ length: m }, () => Array.from({ length: m }, g));
  const U = hqr(G1).Q, V = hqr(G2).Q;
  const US = U.map((r) => r.map((v, j) => v * 2 ** -(j + 1)));
  const A = mul(US, T_(V));
  const C = gs(A, false), M = gs(A, true), H = hqr(A);
  const orth = (Q) => { const E = mul(T_(Q), Q); let mx = 0; for (let j = 0; j < m; j++) { let s = 0; for (let i = 0; i < m; i++) s += Math.abs(E[i][j] - (i === j ? 1 : 0)); mx = Math.max(mx, s); } return mx; };
  GS80 = { rc: C.R.map((r, i) => r[i]), rm: M.R.map((r, i) => r[i]), rh: H.R.map((r, i) => Math.abs(r[i])), oc: orth(C.Q), om: orth(M.Q), oh: orth(H.Q) };
  return GS80;
}
function gsloss() {
  const { rc, rm, rh, oc, om, oh } = gs80();
  const sx = lin(0, 81, 70, 400), sy = lin(-21, 0, 250, 30);
  let o = '';
  for (const k of [0, -4, -8, -12, -16, -20]) o += line(sx(0), sy(k), sx(81), sy(k), 'grid') + text(64, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
  for (const j of [1, 20, 40, 60, 80]) o += text(sx(j), 268, String(j), 'ts', 'middle');
  o += line(sx(0), sy(-21), sx(81), sy(-21), 'axis') + text(400, 286, 'column 序号 j', 'ts', 'end');
  o += text(70, 18, 'r_jj（log scale）：80×80 的 A，singular value 是 2⁻¹, 2⁻², …, 2⁻⁸⁰', 'tb');
  const eps = 2 ** -52;
  o += line(sx(0), sy(Math.log10(Math.sqrt(eps))), sx(81), sy(Math.log10(Math.sqrt(eps))), 'ln-dash');
  o += line(sx(0), sy(Math.log10(eps)), sx(81), sy(Math.log10(eps)), 'dash');
  o += path(d([...Array(80).keys()].map((j) => [sx(j + 1), sy(-(j + 1) * Math.log10(2))])), 'mute');
  rh.forEach((v, j) => { o += line(sx(j + 1) - 2.5, sy(Math.log10(v)), sx(j + 1) + 2.5, sy(Math.log10(v)), 'ink'); });
  rm.forEach((v, j) => { o += circle(sx(j + 1), sy(Math.log10(v)), 2.2, 'ink-f'); });
  rc.forEach((v, j) => { o += circle(sx(j + 1), sy(Math.log10(v)), 2.8, 'ln'); });
  o += text(sx(80) + 6, sy(Math.log10(Math.sqrt(eps))) + 4, '√ε', 'tl') + text(sx(80) + 6, sy(Math.log10(eps)) + 4, 'ε', 'tb');
  o += text(sx(38), sy(-12.6), '2⁻ʲ（exact）', 'ts', 'end');
  const X = 418;
  o += circle(X + 4, 66, 2.8, 'ln') + text(X + 14, 70, 'classical GS', 'tl') + text(X + 14, 88, '停在 √ε ≈ 10⁻⁸', 'ts');
  o += circle(X + 4, 118, 2.2, 'ink-f') + text(X + 14, 122, 'modified GS', 'tb') + text(X + 14, 140, '一直走到 ε ≈ 10⁻¹⁶', 'ts');
  o += line(X, 170, X + 8, 170, 'ink') + text(X + 14, 174, 'Householder', 'tb') + text(X + 14, 192, '与 modified GS 重合', 'ts');
  o += text(X, 224, '‖QᵀQ − I‖₁：', 'ts');
  o += text(X, 242, 'classical ' + oc.toFixed(1), 'tl') + text(X, 260, 'modified ' + om.toFixed(2), 't') + text(X, 278, 'Householder ' + sci(oh), 't');
  return svg(560, 292, o, '80 乘 80 的 matrix，singular value 从 2 的负 1 次到负 80 次：classical Gram–Schmidt 的 r_jj 在 10 的负 8 次附近停住，modified Gram–Schmidt 和 Householder 一直降到 10 的负 16 次');
}

// ---------- 引子 2 / 第 4 站：degree-14 polynomial fit，五种 algorithm ----------
let LSQ = null;
function toBig(x) { // x = M·2^e，M、e 都是整数
  if (x === 0) return [0n, 0];
  const buf = new DataView(new ArrayBuffer(8)); buf.setFloat64(0, x);
  const hi = buf.getUint32(0), lo = buf.getUint32(4), sgn = hi >>> 31, ex = (hi >>> 20) & 0x7ff;
  let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e;
  if (ex === 0) e = -1074; else { mant |= 1n << 52n; e = ex - 1075; }
  return [sgn ? -mant : mant, e];
}
function lsq() {
  if (LSQ) return LSQ;
  const m = 100, n = 15;
  const t = [...Array(m).keys()].map((i) => i / (m - 1));
  const A = t.map((ti) => { const r = [1]; for (let j = 1; j < n; j++) r.push(r[j - 1] * ti); return r; });
  const b = t.map((ti) => Math.exp(Math.sin(4 * ti)));
  // 这组 double data 的 exact least squares solution：整数化后对 normal equations 做 Bareiss elimination
  const K = 220, toInt = (x) => { const [M, e] = toBig(x); if (e + K < 0) throw new Error('scale'); return M << BigInt(e + K); };
  const Ai = A.map((r) => r.map(toInt)), bi = b.map(toInt);
  const Mx = zeros(n, n + 1).map((r) => r.map(() => 0n));
  for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) { let s = 0n; for (let k = 0; k < m; k++) s += Ai[k][i] * Ai[k][j]; Mx[i][j] = s; } let s = 0n; for (let k = 0; k < m; k++) s += Ai[k][i] * bi[k]; Mx[i][n] = s; }
  let prev = 1n;
  for (let k = 0; k < n - 1; k++) { for (let i = k + 1; i < n; i++) for (let j = k + 1; j <= n; j++) Mx[i][j] = (Mx[k][k] * Mx[i][j] - Mx[i][k] * Mx[k][j]) / prev; prev = Mx[k][k]; }
  const num = Mx[n - 1][n], den = Mx[n - 1][n - 1], SH = 80n;
  const xe = Number((num << SH) / den) / 2 ** 80;
  const H = hqr(A, true), xh = backsub(H.R, H.applyQt(b).slice(0, n));
  const M = gs(A, true), xm = backsub(M.R, mv(T_(M.Q), b));
  const Ab = A.map((r, i) => [...r, b[i]]), Ma = gs(Ab, true), xa = backsub(Ma.R.slice(0, n).map((r) => r.slice(0, n)), Ma.R.slice(0, n).map((r) => r[n]));
  const AtA = mul(T_(A), A), Atb = mv(T_(A), b), xn = gepp(AtA, Atb);
  const S = jsvd(A), utb = S.U[0].map((_, j) => dot(col(S.U, j), b) / S.s[j]), xs = S.V.map((r) => dot(r, utb));
  const rel = (x) => Math.abs(x[n - 1] - xe) / Math.abs(xe);
  const sv = S.s.slice().sort((a, b) => b - a), kap = sv[0] / sv[n - 1];
  const y = mv(A, xh), th = Math.asin(nrm(b.map((v, i) => v - y[i])) / nrm(b)), eta = (sv[0] * Math.abs(nrm(xh))) / nrm(y);
  LSQ = { t, A, b, xe, xh, kap, th, eta, res: nrm(b.map((v, i) => v - y[i])), nb: nrm(b),
    errs: [['Householder', rel(xh)], ['SVD（one-sided Jacobi）', rel(xs)], ['modified GS，b 并进 A 一起做', rel(xa)], ['modified GS，算出 Q 再乘 Qᵀb', rel(xm)], ['normal equations', rel(xn)]], xs: [xh, xs, xa, xm, xn].map((x) => x[n - 1]) };
  return LSQ;
}
function lsqbar() {
  const L = lsq(), eps = 2 ** -53;
  const sx = lin(-10, 1, 250, 540);
  let o = text(20, 20, 'x₁₅ 的 relative error（log scale）：m = 100 个点，degree-14 polynomial', 'tb');
  for (const k of [-10, -8, -6, -4, -2, 0]) o += line(sx(k), 36, sx(k), 222, 'grid') + text(sx(k), 238, k === 0 ? '1' : '10' + sup(k), 'ts', 'middle');
  const bound = (L.kap + (L.kap ** 2 * Math.tan(L.th)) / L.eta) * eps;
  o += line(sx(Math.log10(bound)), 36, sx(Math.log10(bound)), 222, 'ln-dash');
  o += text(sx(Math.log10(bound)) + 5, 50, 'κ(A→x) · ε ≈ ' + sci(bound), 'tl');
  L.errs.forEach(([name, e], i) => {
    const y = 66 + i * 32, bad = e > 1e-4;
    o += text(240, y + 14, name, bad ? 'tl' : 't', 'end');
    o += rect(sx(-10), y, sx(Math.log10(e)) - sx(-10), 20, bad ? 'solid' : 'wash-strong', 2);
    const bx = sx(Math.log10(bound)), ex = sx(Math.log10(e)) + 6;
    o += text(ex < bx + 4 && ex > bx - 60 ? bx + 6 : ex, y + 15, sci(e), 'ts');
  });
  o += text(20, 262, '前三种落在 conditioning 允许的范围之内；后两种分别多丢了五位多和全部的 digit。', 'ts');
  o += text(20, 280, '基准是这组 double data 的 exact solution（用整数 arithmetic 算出）：x₁₅ = ' + L.xe.toFixed(6) + '。', 'ts');
  return svg(560, 290, o, '同一个 least squares 问题五种 algorithm 的 relative error：Householder、SVD 和把 b 并进去的 modified Gram–Schmidt 约 10 的负 8 次，直接用 modified Gram–Schmidt 的 Q 约 10 的负 2 次，normal equations 约为 2');
}

// ---------- 引子 3 / 第 5 站：16×16 Jordan block 加 ε 后的 eigenvalue ----------
function jordanA() {
  const n = 16, epsE = [-16, -12, -8, -32, -24, -16];
  const C = [170, 162], S = 380;
  const P = (re, im) => [C[0] + S * (re - 1), C[1] - S * im];
  let o = line(C[0] - 150, C[1], C[0] + 150, C[1], 'axis') + line(C[0], C[1] - 145, C[0], C[1] + 145, 'axis');
  o += text(C[0] + 150, C[1] + 16, 'Re', 'ts', 'end') + text(C[0] + 6, C[1] - 134, 'Im', 'ts');
  for (const r of [0.1, 0.3]) { const pts = []; for (let i = 0; i <= 90; i++) { const a = (2 * Math.PI * i) / 90; pts.push(P(1 + r * Math.cos(a), r * Math.sin(a))); } o += path(d(pts), 'grid'); }
  o += text(P(1.1, 0)[0] + 3, C[1] + 15, '1.1', 'ts') + text(P(1.3, 0)[0] - 4, C[1] + 15, '1.3', 'ts', 'end');
  o += circle(C[0], C[1], 3, 'ink-f') + text(C[0] - 6, C[1] + 15, '1', 'ts', 'end');
  const hold = 1.8, mvT = 1.0, nF = epsE.length, T = (nF - 1) * (hold + mvT) + hold;
  const times = [], fr = [];
  for (let f = 0; f < nF; f++) { const s = f * (hold + mvT); times.push(s); fr.push(f); times.push(s + hold); fr.push(f); }
  const kt = times.map((x) => x / T);
  const rad = (e) => 10 ** (e / n);
  for (let k = 0; k < n; k++) {
    const a = (2 * Math.PI * k) / n;
    const xs = fr.map((f) => P(1 + rad(epsE[f]) * Math.cos(a), 0)[0]), ys = fr.map((f) => P(0, rad(epsE[f]) * Math.sin(a))[1]);
    o += acircle(xs, ys, kt, T, 4, 'ln-f');
  }
  const X = 352;
  o += text(X, 34, 'J₁₆：diagonal 全是 1，', 'tb') + text(X, 52, 'superdiagonal 全是 1', 'tb');
  o += text(X, 76, '只把左下角的 0 换成 ε：', 't') + text(X, 94, '(λ − 1)¹⁶ = ε', 't');
  o += text(X, 112, '16 个 eigenvalue 落在 circle', 't') + text(X, 130, '|λ − 1| = ε 的 1/16 次方上', 't');
  const seen = new Set();
  epsE.forEach((e, f) => {
    if (seen.has(e) && f !== 0) return; seen.add(e);
    const on = fr.map((g) => epsE[g] === e);
    o += `<g opacity="${on[0] ? 1 : 0}">${text(X, 170, 'ε = 10' + sup(e), 'tl')}${text(X, 192, '|λ − 1| = ' + (rad(e) < 0.1 ? rad(e).toFixed(4) : rad(e).toFixed(3)), 'tb')}${text(X, 212, '放大倍数 ' + sci(rad(e) / 10 ** e, 0), 'ts')}${ashow(on, kt, T)}</g>`;
  });
  o += text(X, 246, '浅色 circle：|λ − 1| = 0.1 和 0.3', 'ts');
  o += text(X, 266, 'ε = 10⁻¹⁶ 是一次 rounding', 'ts') + text(X, 284, '的大小，eigenvalue 已经', 'ts') + text(X, 302, '挪了 0.1。', 'ts');
  return svgA(560, 314, o, '动图：16 乘 16 的 Jordan block 左下角加上 epsilon，16 个 eigenvalue 从 1 散开到半径 epsilon 的 16 分之 1 次方的 circle 上；epsilon 等于 10 的负 16 次时半径就是 0.1');
}

// ---------- 第 1 站：SVD = rotate、stretch、rotate ----------
function svdA() {
  const s1 = Math.sqrt(45), s2 = Math.sqrt(5), aV = Math.PI / 4, aU = Math.atan(3);
  const C = [180, 172], u = 23;
  const stage = (p) => { // p ∈ [0,3]
    const r1 = Math.min(1, Math.max(0, p)), r2 = Math.min(1, Math.max(0, p - 1)), r3 = Math.min(1, Math.max(0, p - 2));
    const a0 = -aV * r1, sxx = 1 + (s1 - 1) * r2, syy = 1 + (s2 - 1) * r2, a1 = aU * r3;
    return ([x, y]) => { const xr = Math.cos(a0) * x - Math.sin(a0) * y, yr = Math.sin(a0) * x + Math.cos(a0) * y; const xs = sxx * xr, ys = syy * yr; return [Math.cos(a1) * xs - Math.sin(a1) * ys, Math.sin(a1) * xs + Math.cos(a1) * ys]; };
  };
  const P = ([x, y]) => [C[0] + u * x, C[1] - u * y];
  const circ = [...Array(97).keys()].map((i) => [Math.cos((2 * Math.PI * i) / 96), Math.sin((2 * Math.PI * i) / 96)]);
  const v1 = [Math.SQRT1_2, Math.SQRT1_2], v2 = [-Math.SQRT1_2, Math.SQRT1_2];
  const hold = 1.3, mvT = 1.5, T = 4 * hold + 3 * mvT;
  const kt = [], ps = [];
  for (let k = 0; k <= 3; k++) { const s = k * (hold + mvT); if (k) { kt.push(s / T); ps.push(k); } kt.push((s + hold) / T); ps.push(k); if (k < 3) for (let i = 1; i < 12; i++) { kt.push((s + hold + (mvT * i) / 12) / T); ps.push(k + i / 12); } }
  kt[kt.length - 1] = 1; kt[0] = 0;
  let o = line(C[0] - 168, C[1], C[0] + 168, C[1], 'grid') + line(C[0], C[1] - 160, C[0], C[1] + 160, 'grid');
  // 终点：dashed ellipse，一直显示
  const F = stage(3);
  o += path(d(circ.map((p) => P(F(p)))), 'dash');
  const q1 = P(F(v1)), q2 = P(F(v2));
  o += text(q1[0] + 8, q1[1] + 4, 'σ₁u₁', 'tb') + text(q2[0] - 8, q2[1] - 4, 'σ₂u₂', 'tb', 'end');
  o += apath(ps.map((p) => d(circ.map((q) => P(stage(p)(q)))) + 'Z'), kt, T, 'wash ink-s');
  o += apath(ps.map((p) => d([P([0, 0]), P(stage(p)(v1))])), kt, T, 'ln');
  o += apath(ps.map((p) => d([P([0, 0]), P(stage(p)(v2))])), kt, T, 'ink-b');
  const t1 = ps.map((p) => P(stage(p)(v1))), t2 = ps.map((p) => P(stage(p)(v2)));
  o += acircle(t1.map((p) => p[0]), t1.map((p) => p[1]), kt, T, 4, 'ln-f') + acircle(t2.map((p) => p[0]), t2.map((p) => p[1]), kt, T, 4, 'ink-f');
  o += text(P(v1)[0] + 6, P(v1)[1] - 4, 'v₁', 'tl') + text(P(v2)[0] - 6, P(v2)[1] - 4, 'v₂', 'tb', 'end');
  const X = 368;
  o += text(X, 30, 'A = [3 0; 4 5] = UΣVᵀ', 'tb');
  const steps = [['起点：unit circle 和 v₁、v₂', '蓝线 v₁ = (1, 1)/√2，黑线 v₂ = (−1, 1)/√2'], ['Vᵀ：rotate −45°', 'v₁ 转到 e₁，v₂ 转到 e₂'], ['Σ：沿两个 axis 各自 stretch', `横向 × √45 ≈ ${s1.toFixed(3)}，纵向 × √5 ≈ ${s2.toFixed(3)}`], ['U：rotate +' + ((aU * 180) / Math.PI).toFixed(2) + '°', 'e₁ 转到 u₁ = (1, 3)/√10']];
  steps.forEach(([a, b], k) => {
    const on = ps.map((p) => Math.round(p) === k && Math.abs(p - k) < 1e-9);
    o += text(X, 64 + k * 46, (k ? k + '. ' : '') + a, 't');
    o += `<g opacity="${on[0] ? 1 : 0}">${text(X - 12, 64 + k * 46, '▸', 'tl')}${ashow(on, kt, T)}</g>`;
    o += text(X, 82 + k * 46, b, 'ts');
  });
  o += text(X, 266, '虚线是终点 ellipse：semi-axis', 'ts') + text(X, 284, '正是 σ₁、σ₂，方向是 u₁、u₂。', 'ts');
  return svgA(560, 340, o, '动图：A 等于 3 0 4 5 作用在 unit circle 上，拆成三步：先 rotate 负 45 度把 v1、v2 转到坐标轴上，再沿两个 axis 分别 stretch 根号 45 和根号 5 倍，最后 rotate 71.57 度');
}

// ---------- 第 1 站：low-rank approximation，一幅 24×24 的“图像” ----------
let IMG = null;
function img() {
  if (IMG) return IMG;
  const N = 24, A = zeros(N, N);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    let v = 0;
    if (i >= 2 && i <= 4 && j >= 2 && j <= 21) v = 1; // 横条
    if (j >= 10 && j <= 13 && i >= 5 && i <= 21) v = 1; // 竖条
    const r = Math.hypot(i - 15.3, j - 15.8); v = Math.max(v, 0.7 * Math.max(0, Math.min(1, 1 - Math.abs(r - 4.8) / 1.4))); // ring
    if (j <= 8 && Math.abs(i - (j + 12)) <= 0.6) v = Math.max(v, 0.85); // 斜线
    A[i][j] = v;
  }
  const { w, V } = jacobiEig(mul(T_(A), A));
  const s = w.map((x) => Math.sqrt(Math.max(x, 0)));
  const approx = (k) => { const Vk = V.map((r) => r.slice(0, k)); return mul(mul(A, Vk), T_(Vk)); };
  IMG = { N, A, s, approx };
  return IMG;
}
function lowrankA() {
  const { N, A, s, approx } = img(), ks = [1, 2, 4, 8, 12, 24];
  const cs = 8, X0 = 24, Y0 = 44;
  const hold = 2.2, T = ks.length * hold, kt = ks.map((_, i) => i / ks.length);
  const Ak = ks.map((k) => (k === N ? A : approx(k)));
  let o = text(X0 + (N * cs) / 2, 26, 'rank-k approximation Aₖ', 'tb', 'middle');
  o += rect(X0 - 1, Y0 - 1, N * cs + 2, N * cs + 2, 'frame');
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const vals = Ak.map((M) => Math.max(0, Math.min(1, M[i][j])).toFixed(2));
    o += `<rect x="${X0 + j * cs}" y="${Y0 + i * cs}" width="${cs}" height="${cs}" class="ink-f" fill-opacity="${vals[0]}">${anim('fill-opacity', vals, kt, T, true)}</rect>`;
  }
  // 右：singular values
  const sx = (i) => 268 + i * 11.4, sy = lin(-3, 1.3, 230, 44);
  o += text(268, 26, 'singular value σᵢ（log scale）', 'tb');
  for (const e of [1, 0, -1, -2, -3]) o += line(262, sy(e), 545, sy(e), 'grid') + text(258, sy(e) + 4, e === 0 ? '1' : e === 1 ? '10' : '10' + sup(e), 'ts', 'end');
  s.forEach((v, i) => {
    const y = sy(Math.max(Math.log10(Math.max(v, 1e-3)), -3));
    const on = ks.map((k) => i < k);
    o += rect(sx(i), y, 8, sy(-3) - y, 'wash2');
    o += `<rect x="${f1(sx(i))}" y="${f1(y)}" width="8" height="${f1(sy(-3) - y)}" class="solid" opacity="${on[0] ? 1 : 0}">${ashow(on, kt, T)}</rect>`;
  });
  o += text(sx(0) + 4, 246, '1', 'ts', 'middle') + text(sx(23) + 4, 246, '24', 'ts', 'middle') + text(545, 262, 'i', 'ts', 'end');
  ks.forEach((k, f) => {
    const on = ks.map((_, g) => g === f);
    const err = k < N ? s[k] : 0;
    const L1 = k < N ? `k = ${k}：留下前 ${k} 个 term（深色柱）` : 'k = 24：全部留下，就是原图';
    const L2 = k < N ? `‖A − Aₖ‖₂ = σ${k + 1 <= 9 ? '₀₁₂₃₄₅₆₇₈₉'[k + 1] : '₁' + '₀₁₂₃₄₅₆₇₈₉'[k + 1 - 10]} = ${err.toFixed(3)}，是 σ₁ 的 ${((100 * err) / s[0]).toFixed(1)}%` : 'error 为 0';
    const L3 = k < N ? `存储 (24 + 24 + 1)·k = ${49 * k} 个数，原图 576 个` : '原图 576 个数；rank 只有 ' + s.filter((x) => x > 1e-8 * s[0]).length + '，k 到 ' + s.filter((x) => x > 1e-8 * s[0]).length + ' 就已经完全一样';
    o += `<g opacity="${on[0] ? 1 : 0}">${text(24, 272, L1, 'tl')}${text(24, 292, L2, 't')}${text(24, 310, L3, 'ts')}${ashow(on, kt, T)}</g>`;
  });
  const tc = 3, TX = 466, TY = 282;
  o += text(TX + (N * tc) / 2, TY - 8, '原图', 'ts', 'middle') + rect(TX - 1, TY - 1, N * tc + 2, N * tc + 2, 'frame');
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (A[i][j] > 0.01) o += `<rect x="${TX + j * tc}" y="${TY + i * tc}" width="${tc}" height="${tc}" class="ink-f" fill-opacity="${A[i][j].toFixed(2)}"/>`;
  return svgA(560, 362, o, '动图：一幅 24 乘 24 的图像依次用 rank 1、2、3、5、8 和 24 的 truncated SVD 重建，右边的 singular value 柱状图标出留下了哪些 term，下方读数给出 2-norm error 等于下一个 singular value');
}

// ---------- 第 1 站：Eckart–Young 证明里的 dimension 论证 ----------
function eyproof() {
  const C = [250, 170], s = 95;
  const Pj = ([x, y, z]) => [C[0] + s * (x - 0.55 * y), C[1] - s * (z - 0.32 * y)];
  const quad = (u, v, a) => d([[-a, -a], [a, -a], [a, a], [-a, a], [-a, -a]].map(([p, q]) => Pj(u.map((ui, i) => p * ui + q * v[i])))) + 'Z';
  // 平面 N：z = 0.35x ；平面 S：x 与 y 张成之外，取 (1,0,0.35) 和 (0,0.6,1)
  const n1 = [1, 0, 0.35], n2 = [0, 1, -0.15], s1 = [1, 0, 0.35], s2 = [0, 0.5, 1];
  let o = path(quad(n1, n2, 1.15), 'wash') + path(quad(s1, s2.map((v) => v / Math.hypot(...s2)), 1.15), 'wash2 ink-s');
  const L = Pj(n1.map((v) => v * 1.5)), L0 = Pj(n1.map((v) => v * -1.5));
  o += line(L0[0], L0[1], L[0], L[1], 'ink-b');
  const xu = n1.map((v) => v / Math.hypot(...n1)), xp = Pj(xu);
  o += arrow(C[0], C[1], xp[0], xp[1], 'ln') + text(xp[0] + 2, xp[1] - 10, 'x', 'tl');
  o += circle(C[0], C[1], 3, 'ink-f');
  const a = Pj([-0.6, 1.2, -0.18]); o += text(a[0] - 4, a[1] + 26, 'null(B)', 'tl', 'end');
  const b = Pj([-1.1, 0.2, 1.05]); o += text(b[0], b[1] - 8, 'span{v₁, …, vₖ₊₁}', 'tb', 'start');
  o += text(L[0] + 6, L[1] + 4, '交线', 'ts');
  o += text(20, 316, 'ℝⁿ 里，null(B) 的 dimension ≥ n − k，span{v₁, …, vₖ₊₁} 的 dimension 是 k + 1，', 'ts');
  o += text(20, 334, '两者加起来超过 n，所以一定有一个公共的 unit vector x。', 'ts');
  o += text(20, 352, '图里 n = 3、k = 1：两个 plane 必交于一条 line。', 'ts');
  return svg(560, 362, o, '三维空间里两个 plane：一个是 B 的 null space，一个是 A 的前 k 加 1 个 right singular vector 张成的 subspace，它们必然交于一条 line，x 取在这条 line 上');
}

// ---------- 第 2 站：orthogonal projector 与 oblique projector ----------
function projector() {
  let o = '';
  const panel = (x0, title, P, dirTxt, note) => {
    const O = [x0 + 70, 200], s = 95, Pt = ([x, y]) => [O[0] + s * x, O[1] - s * y];
    o += line(O[0] - 60, O[1], O[0] + 175, O[1], 'axis') + line(O[0], O[1] + 20, O[0], O[1] - 140, 'axis');
    const pts = [...Array(65).keys()].map((i) => Pt([Math.cos((Math.PI * i) / 64), Math.sin((Math.PI * i) / 64)])); o += path(d(pts), 'grid');
    const x = [Math.SQRT1_2, Math.SQRT1_2], px = [P[0][0] * x[0] + P[0][1] * x[1], P[1][0] * x[0] + P[1][1] * x[1]];
    o += line(...Pt(x), ...Pt(px), 'dash');
    o += arrow(...Pt([0, 0]), ...Pt(x), 'ink-b') + arrow(...Pt([0, 0]), ...Pt(px), 'ln');
    o += text(Pt(x)[0] - 4, Pt(x)[1] - 8, 'x', 'tb', 'end') + text(Pt(px)[0], Pt(px)[1] + 18, 'Px', 'tl', 'middle');
    o += text(x0 + 120, 26, title, 'tb', 'middle') + text(x0 + 120, 46, dirTxt, 'ts', 'middle');
    o += text(x0 + 120, 236, note, 't', 'middle');
  };
  panel(10, 'orthogonal：P = [1 0; 0 0]', [[1, 0], [0, 0]], '沿 perpendicular 方向落到 x-axis', '‖Px‖ = 0.707 < ‖x‖ = 1');
  panel(290, 'oblique：P = [1 1; 0 0]', [[1, 1], [0, 0]], '沿 (1, −1) 方向斜着落到 x-axis', '‖Px‖ = √2 ≈ 1.414 > ‖x‖ = 1');
  o += text(280, 268, '两个都满足 P² = P，range 都是 x-axis。只有左边的 Pᵀ = P，它的 2-norm 是 1；右边是 √2。', 'ts', 'middle');
  return svg(560, 278, o, '左边 orthogonal projector 把 x 沿垂直方向投到 x 轴上，长度变短；右边 oblique projector 把同一个 x 斜着投到 x 轴上，长度变成根号 2');
}

// ---------- 第 2 站：CGS 与 MGS 的第三个 vector（ε 例子，在 e₂, e₃, e₄ 张成的空间里看） ----------
function cgsmgs() {
  let o = '';
  const panel = (x0, title, v3, ang, note) => {
    const C = [x0 + 120, 175], s = 72;
    const Pj = ([a, b, c]) => [C[0] + s * (a - 0.5 * b), C[1] - s * (c - 0.3 * b)];
    for (const [v, lab] of [[[1.25, 0, 0], 'e₂'], [[0, 1.6, 0], 'e₃'], [[0, 0, 1.4], 'e₄']]) { const p = Pj(v); o += arrow(C[0], C[1], p[0], p[1], 'axis', 5) + text(p[0] + (lab === 'e₃' ? -4 : 5), p[1] + (lab === 'e₄' ? -4 : 14), lab, 'ts', lab === 'e₃' ? 'end' : 'start'); }
    const n = (v) => v.map((x) => x / Math.hypot(...v));
    const q2 = Pj(n([-1, 1, 0])), q3 = Pj(n(v3));
    o += arrow(C[0], C[1], q2[0], q2[1], 'ink-b') + text(q2[0] - 6, q2[1] + 4, 'q₂', 'tb', 'end');
    o += arrow(C[0], C[1], q3[0], q3[1], 'ln') + text(q3[0] + 6, q3[1] - 2, 'q₃', 'tl');
    o += text(x0 + 120, 26, title, 'tb', 'middle');
    o += text(x0 + 120, 268, '∠(q₂, q₃) = ' + ang + '°', 'tl', 'middle') + text(x0 + 120, 288, note, 'ts', 'middle');
  };
  const ang = (a, b) => ((Math.acos(dot(a, b) / (nrm(a) * nrm(b))) * 180) / Math.PI).toFixed(0);
  panel(10, 'classical：r₂₃ = q₂ᵀa₃ = 0', [-1, 0, 1], ang([-1, 1, 0], [-1, 0, 1]), 'a₃ 在 q₂ 方向上的分量算成了 0');
  panel(290, 'modified：r₂₃ = q₂ᵀv₃ = ε/√2', [-0.5, -0.5, 1], ang([-1, 1, 0], [-0.5, -0.5, 1]), '用的是已经减掉 q₁ 分量的 v₃');
  o += text(280, 312, '1 + ε² 存成 1 之后，三个 vector 去掉 q₁ 方向剩下的部分都落在 e₂, e₃, e₄ 张成的空间里，这里只画这一部分。', 'ts', 'middle');
  return svg(560, 322, o, '在 e2、e3、e4 张成的三维空间里看：classical Gram–Schmidt 得到的 q3 与 q2 成 60 度，modified Gram–Schmidt 得到的 q3 与 q2 垂直');
}

// ---------- 第 2 站：Householder QR 一步步作用在 [A | b] 上 ----------
const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;
function houseA() {
  const A = [[1, 1, 1], [1, 2, 2], [1, 3, 2]];
  const refl = (M, k) => { const x = M.slice(k).map((r) => r[k]), v = x.slice(); v[0] += Math.sign(x[0]) * nrm(x); const vv = dot(v, v); const N = M.map((r) => r.slice()); for (let j = 0; j < 3; j++) { let s = 0; for (let i = k; i < 3; i++) s += v[i - k] * M[i][j]; s = (2 * s) / vv; for (let i = k; i < 3; i++) N[i][j] -= s * v[i - k]; } return { N, v }; };
  const r1 = refl(A, 0), r2 = refl(r1.N, 1);
  const frames = [
    { M: A, hot: -1, rows: [], L: ['[A | b]：A 的两列是 1 和 t，b 是三个点的 y', '目标：column 1 在 diagonal 下面变成 0'] },
    { M: r1.N, hot: 0, rows: [0, 1, 2], L: [`H₁：v₁ = (${r1.v.map((x) => x.toFixed(4)).join(', ')})`, 'column 1 变成 (−‖a₁‖, 0, 0) = (−√3, 0, 0)，三行都变了'] },
    { M: r2.N, hot: 1, rows: [1, 2], L: [`H₂：只动 row 2、3，v₂ = (${r2.v.map((x) => x.toFixed(4)).join(', ')})`, 'row 1 不动，column 1 的两个 0 保住了'] },
  ];
  const cw = 70, ch = 34, X0 = 40, Y0 = 46;
  const n = frames.length, step = 3.2, T = n * step, kt = frames.map((_, i) => i / n);
  let o = text(X0 + cw, 28, 'A → R', 'tb', 'middle') + text(X0 + 2 * cw + 16 + cw / 2, 28, 'b → Qᵀb', 'tb', 'middle');
  frames.forEach((F, f) => {
    let g = '';
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = X0 + j * cw + (j === 2 ? 16 : 0), y = Y0 + i * ch, v = Math.abs(F.M[i][j]) < 1e-12 ? 0 : F.M[i][j];
      const isHot = j === F.hot && i >= F.hot, changed = F.rows.includes(i);
      g += rect(x, y, cw, ch, isHot ? 'wash-strong' : changed ? 'wash' : 'paper');
      g += text(x + cw / 2, y + ch / 2 + 5, v === 0 ? '0' : Number.isInteger(v) ? String(v) : mn(v, 4), isHot ? 'tl' : 't', 'middle');
    }
    g += text(X0, 184, F.L[0], 'tl') + text(X0, 204, F.L[1], 'ts');
    o += grp(g, frames.map((_, k) => k === f), kt, T);
  });
  o += line(X0 + 2 * cw + 8, Y0 - 4, X0 + 2 * cw + 8, Y0 + 3 * ch + 4, 'ink');
  const XR = 310;
  o += text(XR, 64, '−1.7321 = −√3，−3.4641 = −2√3', 'ts') + text(XR, 84, '−1.4142 = −√2', 'ts');
  o += text(XR, 112, 'Qᵀb 的前两个：−5/√3，−1/√2', 'ts') + text(XR, 132, '第三个 −1/√6：它的 square', 'ts') + text(XR, 152, '就是最小 residual 1/6', 'ts');
  o += text(X0, 232, '深色：这一步要清零的 column；浅色：这一步被 reflection 改动的 row', 'ts');
  return svgA(560, 240, o, '动图：对 1 1 1、1 2 2、1 3 2 这个增广矩阵做两次 Householder reflection，第一次把 column 1 变成负根号 3 和两个 0，第二次只动后两行，得到 R 和 Q 转置乘 b');
}

// ---------- 第 2 站：Givens rotation ----------
function givens() {
  const O = [80, 210], s = 34;
  const P = ([x, y]) => [O[0] + s * x, O[1] - s * y];
  let o = line(O[0] - 20, O[1], O[0] + 6.4 * s, O[1], 'axis') + line(O[0], O[1] + 14, O[0], O[1] - 5.3 * s, 'axis');
  const th = Math.atan2(4, 3);
  const arc = [...Array(31).keys()].map((i) => P([5 * Math.cos((th * i) / 30), 5 * Math.sin((th * i) / 30)]));
  o += path(d(arc), 'dash');
  o += arrow(...P([0, 0]), ...P([3, 4]), 'ink-b') + arrow(...P([0, 0]), ...P([5, 0]), 'ln');
  o += text(P([3, 4])[0] + 6, P([3, 4])[1], '(3, 4)', 'tb') + text(P([5, 0])[0], P([5, 0])[1] + 20, '(5, 0)', 'tl', 'middle');
  const a1 = [...Array(16).keys()].map((i) => P([1.3 * Math.cos((th * i) / 15), 1.3 * Math.sin((th * i) / 15)]));
  o += path(d(a1), 'mute') + text(P([1.5, 0.55])[0], P([1.5, 0.55])[1], 'θ = ' + ((th * 180) / Math.PI).toFixed(2) + '°', 'ts');
  const X = 320;
  o += text(X, 50, 'c = 3/5 = 0.6，s = 4/5 = 0.8', 'tb');
  o += text(X, 80, 'G = [ c  s ; −s  c ]', 't');
  o += text(X, 104, 'G (3, 4)ᵀ = (0.6·3 + 0.8·4,', 't') + text(X, 122, '           −0.8·3 + 0.6·4)', 't') + text(X, 140, '         = (5, 0)', 'tl');
  o += text(X, 178, '只动两个 row，一次清掉一个 entry；', 'ts') + text(X, 196, 'length 不变，因为 c² + s² = 1。', 'ts');
  return svg(560, 232, o, 'Givens rotation 把 vector 3,4 转过 53.13 度变成 5,0：c 等于 0.6，s 等于 0.8');
}

// ---------- 第 3 站：forward error 与 backward error ----------
function backward() {
  let o = '';
  const blob = (cx, cy, rx, ry) => path(d([...Array(73).keys()].map((i) => { const a = (2 * Math.PI * i) / 72; const w = 1 + 0.06 * Math.sin(3 * a); return [cx + rx * w * Math.cos(a), cy + ry * w * Math.sin(a)]; })) + 'Z', 'wash2 ink-s');
  o += blob(125, 140, 92, 66) + blob(435, 140, 92, 66);
  o += text(125, 230, 'input 的空间', 'tb', 'middle') + text(435, 230, 'output 的空间', 'tb', 'middle');
  const x = [100, 158], xt = [150, 122], y = [408, 172], yt = [462, 112];
  o += path(`M${x[0] + 2} ${x[1] - 6} C 170 30, 390 30, ${yt[0] - 4} ${yt[1] - 6}`, 'ln') + text(280, 36, '机器上的 algorithm f̃', 'tl', 'middle');
  o += path(`M${xt[0] + 6} ${xt[1]} C 260 118, 350 112, ${yt[0] - 6} ${yt[1] + 2}`, 'dash') + text(285, 100, '对 x̃ 用 exact 的 f', 'ts', 'middle');
  o += path(`M${x[0] + 6} ${x[1] + 4} C 220 215, 330 215, ${y[0] - 6} ${y[1] + 4}`, 'ink') + text(280, 222, 'exact 的 f', 'ts', 'middle');
  o += line(...x, ...xt, 'ln-dash') + line(...y, ...yt, 'mute');
  o += circle(...x, 4.5, 'ink-f') + text(x[0] - 8, x[1] + 4, 'x', 'tb', 'end');
  o += circle(...xt, 4.5, 'ln-f') + text(xt[0] + 6, xt[1] - 8, 'x̃', 'tl');
  o += circle(...y, 4.5, 'ink-f') + text(y[0] - 8, y[1] + 4, 'f(x)', 'tb', 'end');
  o += circle(...yt, 4.5, 'ln-f') + text(yt[0] + 4, yt[1] + 20, 'f̃(x) = f(x̃)', 'tl', 'start');
  o += text(125, 252, 'backward error：‖x̃ − x‖ / ‖x‖', 'ts', 'middle') + text(435, 252, 'forward error：‖f̃(x) − f(x)‖ / ‖f(x)‖', 'ts', 'middle');
  o += text(280, 282, 'Backward stable：总能找到这样一个 x̃，backward error 是 O(ε)。', 'ts', 'middle');
  o += text(280, 300, 'Forward error ≲ κ × backward error。', 'ts', 'middle');
  return svg(560, 310, o, 'input 空间里 x 和一个很近的 x-tilde；algorithm 对 x 算出的结果恰好是 exact 的 f 作用在 x-tilde 上；两者在 input 一侧的距离是 backward error，在 output 一侧的距离是 forward error');
}

// ---------- 第 3 站：partial pivoting 的 growth factor 2ⁿ⁻¹ ----------
function growthA() {
  const n = 6;
  const A = zeros(n, n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) A[i][j] = j === n - 1 ? 1 : i === j ? 1 : i > j ? -1 : 0;
  const frames = [A.map((r) => r.slice())];
  let M = A.map((r) => r.slice());
  for (let k = 0; k < n - 1; k++) { M = M.map((r) => r.slice()); for (let i = k + 1; i < n; i++) { const l = M[i][k] / M[k][k]; for (let j = k; j < n; j++) M[i][j] -= l * M[k][j]; } frames.push(M); }
  const cw = 38, ch = 28, X0 = 30, Y0 = 44;
  const nF = frames.length, step = 1.9, T = (nF + 1) * step, kt = [...frames.map((_, i) => i / (nF + 1))];
  const shows = (f) => { const on = frames.map((_, k) => k === f); on[nF - 1] = f === nF - 1; return on; };
  let o = text(X0 + 3 * cw, 26, '6×6：diagonal 1，下方 −1，最后一列 1', 'tb', 'middle');
  frames.forEach((F, f) => {
    let g = '';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = F[i][j], x = X0 + j * cw, y = Y0 + i * ch;
      const hot = j === n - 1 && i >= f && f > 0, piv = f < n && i === f - 1 && j === f - 1;
      g += rect(x, y, cw, ch, hot ? 'wash-strong' : j === n - 1 ? 'wash' : piv ? 'wash2' : 'paper');
      g += text(x + cw / 2, y + ch / 2 + 5, v === 0 ? '0' : v < 0 ? '−' + -v : String(v), hot ? 'tl' : v === 0 ? 'ts' : 't', 'middle');
    }
    const L = f === 0 ? ['每个 column 里 |entry| 都一样大，partial pivoting 不换 row', ''] : [`消完 column ${f}：row ${f + 1} 到 6 的最后一列都翻倍`, f === n - 1 ? `U 的右下角 = 2⁵ = 32 = 2ⁿ⁻¹` : `最后一列现在是 ${F.map((r) => r[n - 1]).join(', ')}`];
    g += text(X0, Y0 + n * ch + 26, L[0], 'tl') + text(X0, Y0 + n * ch + 46, L[1], 'ts');
    const on = [...frames.map((_, k) => k === f), f === nF - 1];
    o += grp(g, on, [...kt, nF / (nF + 1)], T);
  });
  const X = 290;
  o += text(X, 66, '每一步 row i 减去 −1 倍的 pivot row：', 'ts') + text(X, 84, '最后一列的数加上 pivot row 的数。', 'ts');
  o += text(X, 112, 'Multiplier 全是 −1，|ℓᵢⱼ| ≤ 1，', 'ts') + text(X, 130, 'pivoting 没有失职，可 U 里的数仍按', 'ts') + text(X, 148, '2 的 power 涨。', 'ts');
  o += text(X, 176, 'n = 60 时 growth factor 是 2⁵⁹ ≈ 5.8×10¹⁷，', 'tb') + text(X, 196, 'κ(A) 只有 27，solution 却错了 55%。', 'tb');
  return svgA(560, 280, o, '动图：6 乘 6 的 Wilkinson 矩阵做 partial pivoting 的 elimination，每消一列，最后一列下面的数翻倍，最后 U 的右下角是 32');
}

// ---------- 第 4 站：least squares 的 θ 与这个例子的 fit ----------
function lsqgeo() {
  const L = lsq();
  let o = '';
  { // 左：data 与 fit
    const sx = lin(0, 1, 50, 260), sy = lin(0, 3, 230, 40);
    o += axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 3, xt: [0, 0.5, 1], yt: [1, 2, 3] });
    const p = (t) => { let s = 0; for (let j = 14; j >= 0; j--) s = s * t + L.xh[j]; return s; };
    o += path(curve(p, 0, 1, sx, sy, 300), 'ln');
    L.t.forEach((t, i) => { if (i % 3 === 0) o += circle(sx(t), sy(L.b[i]), 2, 'ink-f'); });
    o += text(155, 24, 'bᵢ = exp(sin 4tᵢ) 与 degree-14 fit', 'tb', 'middle');
    o += text(40, 284, `点（每 3 个画 1 个）和 curve 看不出差别：`, 'ts') + text(40, 302, `‖b − Ax‖ = ${sci(L.res, 1)}，‖b‖ = ${L.nb.toFixed(2)}`, 'ts');
  }
  { // 右：几何
    const O = [330, 216];
    o += poly([[300, 236], [520, 236], [548, 186], [328, 186]], 'wash ink-s') + text(512, 230, 'range(A)', 'ts', 'end');
    const Y = [470, 202], B = [470, 70];
    o += arrow(...O, ...Y, 'ink-b') + arrow(...O, ...B, 'ln') + line(...Y, ...B, 'dash');
    o += text(B[0] + 6, B[1] + 4, 'b', 'tl') + text(420, 254, 'y = Ax = Pb（在 plane 上）', 'tb', 'middle');
    o += text(B[0] + 6, 140, 'r = b − y', 'ts');
    const a0 = Math.atan2(-(Y[1] - O[1]), Y[0] - O[0]), a1 = Math.atan2(-(B[1] - O[1]), B[0] - O[0]);
    o += path(d([...Array(21).keys()].map((i) => { const a = a0 + ((a1 - a0) * i) / 20; return [O[0] + 44 * Math.cos(a), O[1] - 44 * Math.sin(a)]; })), 'mute') + text(O[0] + 54, O[1] - 20, 'θ', 'tb');
    o += text(430, 24, 'θ 是 b 与 range(A) 的 angle', 'tb', 'middle');
    o += text(318, 284, `这个例子：θ = ${sci(L.th, 2)}`, 'ts') + text(318, 302, `κ = ${sci(L.kap, 2)}，η = ${sci(L.eta, 2)}`, 'ts');
  }
  return svg(560, 312, o, '左边是 100 个数据点 exp(sin 4t) 和 degree-14 least squares polynomial，几乎重合；右边是 b、它在 range(A) 上的 projection y 以及两者之间的 angle theta');
}

// ---------- 第 5 站：为什么先化成 Hessenberg ----------
function hessA() {
  const n = 5, X = (s) => s;
  const full = () => zeros(n, n).map((r) => r.map(() => 'x'));
  // 上排：直接追求 triangular
  const t0 = full(), t1 = full(); for (let i = 1; i < n; i++) t1[i][0] = '0';
  const t2 = full();
  // 下排：Hessenberg
  const h = [full()];
  let cur = full();
  for (let k = 0; k < n - 2; k++) {
    const L = cur.map((r) => r.slice()); for (let i = k + 2; i < n; i++) L[i][k] = '0'; h.push(L);
    h.push(L.map((r) => r.slice())); cur = L;
  }
  const topF = [t0, t1, t2], topHot = [[], ['rows', 0], ['cols', 0]];
  const botHot = [[]]; for (let k = 0; k < n - 2; k++) { botHot.push(['rows', k + 1]); botHot.push(['cols', k + 1]); }
  const nF = h.length, step = 1.7, T = nF * step, kt = h.map((_, i) => i / nF);
  const cs = 22;
  const grid = (M, x0, y0, hot) => {
    let g = '';
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const isHot = hot[0] === 'rows' ? i >= hot[1] : hot[0] === 'cols' ? j >= hot[1] : false;
      g += rect(x0 + j * cs, y0 + i * cs, cs, cs, isHot ? 'wash' : 'paper');
      g += text(x0 + j * cs + cs / 2, y0 + i * cs + cs / 2 + 4, M[i][j] === 'x' ? '×' : '0', M[i][j] === 'x' ? 't' : 'tl', 'middle');
    }
    return g;
  };
  let o = text(20, 24, '直接追求 triangular（Schur form）：', 'tb') + text(20, 172, '先化成 Hessenberg：', 'tb');
  const labT = ['A', 'Q₁ᵀA：column 1 清零', 'Q₁ᵀAQ₁：右乘把 0 又填满'];
  h.forEach((M, f) => {
    const tf = Math.min(f, 2);
    let g = grid(topF[tf], 30, 34, f <= 2 ? topHot[tf] : []) + text(160, 80, labT[tf], tf === 2 ? 'tl' : 't');
    if (tf === 2) g += text(160, 100, '右乘 Q₁ 动的是 column 1 到 5，', 'ts') + text(160, 116, 'similarity 要求两边都乘，0 保不住', 'ts');
    g += grid(M, 30, 182, botHot[f]);
    const k = Math.ceil(f / 2);
    const lb = f === 0 ? 'A' : f % 2 ? `Q${'₁₂₃'[k - 1]}ᵀ 只动 row ${k + 1}–5，清掉 column ${k} 里 row ${k + 2} 以下` : `右乘 Q${'₁₂₃'[k - 1]} 只动 column ${k + 1}–5，column ${k} 的 0 不受影响`;
    g += text(160, 230, lb, f % 2 || f === 0 ? 't' : 'tl');
    if (f === nF - 1) g += text(160, 252, '三步之后是 upper Hessenberg：subdiagonal 以下全是 0', 'tl');
    o += grp(g, h.map((_, q) => q === f), kt, T);
  });
  o += text(20, 312, '浅色：这一次乘法改动的 row（左乘）或 column（右乘）。', 'ts');
  return svgA(560, 320, o, '动图：上排试图用 Householder 一步把 A 的 column 1 清零，但右乘又把 0 填满；下排只清零 subdiagonal 以下的部分，左乘只动下面几行，右乘只动后面几列，三步后得到 upper Hessenberg');
}

// ---------- 第 5 站：三种 shift 下 subdiagonal 的衰减 ----------
let SH = null;
function shiftData() {
  if (SH) return SH;
  const A = [[2, 1, 1], [1, 3, 1], [1, 1, 4]];
  const x = [A[1][0], A[2][0]], v = x.slice(); v[0] += Math.sign(x[0]) * nrm(x); const vv = dot(v, v);
  const H = [[1, 0, 0], [0, 1 - (2 * v[0] * v[0]) / vv, (-2 * v[0] * v[1]) / vv], [0, (-2 * v[1] * v[0]) / vv, 1 - (2 * v[1] * v[1]) / vv]];
  const Tm = mul(mul(H, A), H);
  const run = (kind, K) => {
    let M = Tm.map((r) => r.slice()); const out = [Math.abs(M[2][1])];
    for (let k = 0; k < K; k++) {
      let mu = 0;
      if (kind === 'rq') mu = M[2][2];
      if (kind === 'w') { const a = M[1][1], b = M[2][1], c = M[2][2], dd = (a - c) / 2, sg = dd >= 0 ? 1 : -1; mu = c - (sg * b * b) / (Math.abs(dd) + Math.hypot(dd, b)); }
      const S = M.map((r, i) => r.map((v2, j) => v2 - (i === j ? mu : 0))), q = hqr(S);
      M = mul(q.R, q.Q).map((r, i) => r.map((v2, j) => v2 + (i === j ? mu : 0)));
      out.push(Math.abs(M[2][1]));
    }
    return { out, last: M[2][2] };
  };
  SH = { Tm, none: run('none', 12), rq: run('rq', 4), w: run('w', 4) };
  return SH;
}
function shift() {
  const S = shiftData();
  const sx = lin(0, 12, 70, 380), sy = lin(-17, 0, 236, 34);
  let o = text(70, 20, '|t₃₂|（log scale）：3×3 tridiagonal，每一步一次 QR', 'tb');
  for (const k of [0, -4, -8, -12, -16]) o += line(sx(0), sy(k), sx(12), sy(k), 'grid') + text(64, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
  for (let k = 0; k <= 12; k += 2) o += text(sx(k), 254, String(k), 'ts', 'middle');
  o += text(380, 272, 'iteration k', 'ts', 'end') + line(sx(0), sy(-17), sx(12), sy(-17), 'axis');
  const thr = Math.log10(2 ** -52 * 5);
  o += line(sx(0), sy(thr), sx(12), sy(thr), 'dash') + text(sx(12), sy(thr) - 6, 'deflate：≈ ε‖T‖', 'ts', 'end');
  const ser = (arr, cls, mk) => { const pts = []; arr.forEach((v, k) => { pts.push([sx(k), sy(Math.max(Math.log10(v), -17)), Math.log10(v) < -17]); }); o += path(d(pts), cls); pts.forEach((p) => { o += p[2] ? poly([[p[0] - 5, p[1] - 9], [p[0] + 5, p[1] - 9], [p[0], p[1] - 1]], mk) : circle(p[0], p[1], 3, mk); }); return pts; };
  const cut = (arr) => { const r = []; for (const v of arr) { r.push(v); if (v < 2 ** -52 * 5) break; } return r; };
  ser(S.none.out, 'mute', 'mute-f');
  ser(cut(S.rq.out), 'ln', 'ln-f');
  ser(cut(S.w.out), 'ink', 'ink-f');
  const X = 398;
  o += text(X, 60, '没有 shift', 'tb') + text(X, 78, '每步约 × ' + (S.none.out[12] / S.none.out[11]).toFixed(2), 'ts');
  o += text(X, 112, 'Rayleigh quotient shift', 'tl') + text(X, 130, cut(S.rq.out).map((v) => sci(v, 1)).slice(1, 4).join('，'), 'ts');
  o += text(X, 164, 'Wilkinson shift', 'tb') + text(X, 182, cut(S.w.out).map((v) => sci(v, 1)).slice(1, 4).join('，'), 'ts');
  o += text(X, 218, '三角形：已低于 10⁻¹⁷。', 'ts') + text(X, 236, 'Rayleigh 三步、Wilkinson', 'ts') + text(X, 254, '四步就可以 deflate。', 'ts');
  return svg(560, 282, o, '三种做法下 3 乘 3 tridiagonal matrix 右下角 subdiagonal entry 的大小：不加 shift 每步只缩小约一半，Rayleigh quotient shift 和 Wilkinson shift 三步内降到 10 的负 15 次以下');
}

// ---------- 第 6 站：steepest descent 与 CG（Shewchuk 的例子） ----------
function cgA() {
  const A = [[3, 2], [2, 6]], b = [2, -8], xs = [2, -2];
  const sx = lin(-4.2, 4.6, 30, 330), sy = lin(-4.6, 2.6, 300, 50);
  const P = ([x, y]) => [sx(x), sy(y)];
  let o = '';
  // 等高线：f(x) − f(x*) = ½ eᵀAe = c
  const ev = jacobiEig(A);
  for (const c of [0.5, 2, 5, 10, 18, 28]) {
    const pts = [...Array(97).keys()].map((i) => { const a = (2 * Math.PI * i) / 96; const p = ev.V.map((r) => r[0] * Math.sqrt((2 * c) / ev.w[0]) * Math.cos(a) + r[1] * Math.sqrt((2 * c) / ev.w[1]) * Math.sin(a)); return P([xs[0] + p[0], xs[1] + p[1]]); });
    o += path(d(pts), 'grid');
  }
  const eA = (x) => { const e = [x[0] - xs[0], x[1] - xs[1]]; return Math.sqrt(dot(e, mv(A, e))); };
  const sd = [[-2, -2]]; for (let k = 0; k < 6; k++) { const x = sd[k], r = b.map((v, i) => v - mv(A, x)[i]), a = dot(r, r) / dot(r, mv(A, r)); sd.push([x[0] + a * r[0], x[1] + a * r[1]]); }
  const cg = [[-2, -2]]; { let x = [-2, -2], r = b.map((v, i) => v - mv(A, x)[i]), p = r.slice(); for (let k = 0; k < 2; k++) { const Ap = mv(A, p), a = dot(r, r) / dot(p, Ap); x = [x[0] + a * p[0], x[1] + a * p[1]]; const rn = r.map((v, i) => v - a * Ap[i]), be = dot(rn, rn) / dot(r, r); p = rn.map((v, i) => v + be * p[i]); r = rn; cg.push(x); } }
  const per = 1.3, mvT = 0.7, K = 6, T = 0.8 + K * per + 1.6;
  const times = [0], idx = [0];
  for (let k = 0; k < K; k++) { const s = 0.8 + k * per; times.push(s, s + mvT); idx.push(k, k + 1); }
  times.push(T); idx.push(K);
  const kt = times.map((t) => t / T);
  const at = (path0, q) => { const i = Math.min(Math.floor(q), path0.length - 1), f = q - i; if (i >= path0.length - 1) return path0[path0.length - 1]; return [path0[i][0] + f * (path0[i + 1][0] - path0[i][0]), path0[i][1] + f * (path0[i + 1][1] - path0[i][1])]; };
  // 帧序列里的位置（移动中线性插值）
  const posSeq = (pth) => idx.map((q, j) => { const prev = j && idx[j - 1] < q ? q : q; return at(pth, prev); });
  const trail = (pth) => idx.map((q) => d([...Array(K + 1).keys()].map((h) => P(at(pth, Math.min(h, q))))));
  o += path(d(sd.map(P)), 'mute') + path(d(cg.map(P)), 'ln-dash');
  o += apath(trail(sd), kt, T, 'ink');
  o += apath(trail(cg), kt, T, 'ln');
  const ps = posSeq(sd).map(P), pc = posSeq(cg).map(P);
  o += acircle(ps.map((p) => p[0]), ps.map((p) => p[1]), kt, T, 4.5, 'ink-f');
  o += acircle(pc.map((p) => p[0]), pc.map((p) => p[1]), kt, T, 5.5, 'ln-f');
  o += circle(...P([-2, -2]), 3, 'ink-f') + text(P([-2, -2])[0] - 6, P([-2, -2])[1] + 16, 'x₀ = (−2, −2)', 'ts', 'end');
  o += circle(...P(xs), 3.5, 'ink-f') + text(P(xs)[0] + 8, P(xs)[1] + 16, 'x* = (2, −2)', 'tb');
  const X = 352;
  o += text(X, 30, 'A = [3 2; 2 6]，b = (2, −8)', 'tb') + text(X, 48, '椭圆：f(x) = ½xᵀAx − bᵀx 的等高线', 'ts');
  o += line(X, 74, X + 22, 74, 'ink') + text(X + 28, 78, 'steepest descent', 't');
  o += line(X, 96, X + 22, 96, 'ln') + text(X + 28, 100, 'conjugate gradient', 'tl');
  o += text(X, 134, 'A-norm 的 error ‖e‖：', 'ts');
  for (let k = 0; k <= K; k++) {
    const on = idx.map((q) => Math.floor(q + 1e-9) === k && (k === K || q < k + 1));
    const ec = k <= 2 ? eA(cg[k]) : 0, es = eA(sd[k]);
    o += grp(text(X, 156, `k = ${k}`, 'tb') + text(X, 178, `steepest descent：${es.toFixed(3)}`, 't') + text(X, 200, `CG：${k >= 2 ? '0（到了）' : ec.toFixed(3)}`, 'tl'), on, kt, T);
  }
  o += text(X, 236, 'steepest descent 每步只缩小到', 'ts') + text(X, 254, `约 ${(eA(sd[2]) / eA(sd[1])).toFixed(3)}，来回折；CG 第二步`, 'ts') + text(X, 272, '就到了 solution。', 'ts');
  return svgA(560, 316, o, '动图：在 f 的椭圆等高线上，steepest descent 从负 2 负 2 出发来回折线逼近解 2 负 2，conjugate gradient 第一步与它相同，第二步直接到达解');
}

// ---------- 第 6 站：GMRES 的 convergence 取决于 eigenvalue 在哪里 ----------
let GM = null;
function gmresData() {
  if (GM) return GM;
  const m = 200, g = rng(4230);
  const G = Array.from({ length: m }, () => Array.from({ length: m }, () => g() / Math.sqrt(m) * 0.5));
  const A1 = G.map((r, i) => r.map((v, j) => v + (i === j ? 2 : 0)));
  const A2 = G.map((r) => r.slice()), lam2 = [];
  for (let k = 0; k < m / 2; k++) { const ph = (Math.PI * (k + 0.5)) / (m / 2), c = 2 * Math.cos(ph), s = 2 * Math.sin(ph); const i = 2 * k; A2[i][i] += c; A2[i][i + 1] -= s; A2[i + 1][i] += s; A2[i + 1][i + 1] += c; lam2.push([c, s], [c, -s]); }
  const bvec = Array.from({ length: m }, () => 1 / Math.sqrt(m));
  const gm = (A, K) => {
    const Q = [bvec.slice()], H = zeros(K + 1, K), res = [1];
    for (let k = 0; k < K; k++) {
      const v = mv(A, Q[k]);
      for (let j = 0; j <= k; j++) { H[j][k] = dot(Q[j], v); for (let i = 0; i < m; i++) v[i] -= H[j][k] * Q[j][i]; }
      H[k + 1][k] = nrm(v); Q.push(v.map((x) => x / H[k + 1][k]));
      const Hk = H.slice(0, k + 2).map((r) => r.slice(0, k + 1)), e1 = new Array(k + 2).fill(0); e1[0] = 1;
      const q = hqr(Hk, false), z = q.applyQt(e1);
      res.push(Math.abs(z[k + 1]));
    }
    return res;
  };
  GM = { r1: gm(A1, 30), r2: gm(A2, 30), lam2 };
  return GM;
}
function gmres() {
  const G = gmresData();
  let o = '';
  { // 左：两个 matrix 的 eigenvalue 各画在一个小 complex plane 里
    const mini = (cx, lab, draw) => {
      const C = [cx, 150], sc = 28, P = ([x, y]) => [C[0] + sc * x, C[1] - sc * y];
      o += line(C[0] - 66, C[1], C[0] + 72, C[1], 'axis') + line(C[0], C[1] - 70, C[0], C[1] + 70, 'axis');
      o += circle(...P([0, 0]), 3.5, 'paper') + text(P([0, 0])[0] - 5, P([0, 0])[1] + 15, '0', 'ts', 'end');
      draw(P);
      o += text(cx, 246, lab, 'tb', 'middle');
    };
    mini(78, 'A₁', (P) => { o += circle(...P([2, 0]), 0.5 * 28, 'wash') + circle(...P([2, 0]), 2.5, 'ln-f') + text(P([2, 0])[0], P([2, 0])[1] + 28, '2', 'ts', 'middle'); });
    mini(232, 'A₂', (P) => { G.lam2.forEach(([a, bb]) => { o += circle(...P([a, bb]), 1.4, 'ink-f'); }); o += text(P([-1.5, 1.5])[0] - 4, P([-1.5, 1.5])[1] - 6, '|λ| = 2', 'ts', 'end'); });
    o += text(155, 24, 'eigenvalue 大致在哪里', 'tb', 'middle');
    o += text(20, 276, 'A₁ = 2I + noise：挤在 2 附近半径 ½ 的 disc 里', 'ts') + text(20, 294, 'A₂：diagonal 部分的 eigenvalue 绕着 0 排成一圈', 'ts');
  }
  { // 右：residual
    const sx = lin(0, 30, 330, 545), sy = lin(-16, 0, 270, 40);
    for (const k of [0, -4, -8, -12, -16]) o += line(sx(0), sy(k), sx(30), sy(k), 'grid') + text(324, sy(k) + 4, k === 0 ? '1' : '10' + sup(k), 'ts', 'end');
    for (const k of [0, 10, 20, 30]) o += text(sx(k), 288, String(k), 'ts', 'middle');
    o += text(545, 304, 'GMRES 步数 k', 'ts', 'end');
    o += path(d(G.r1.map((v, k) => [sx(k), sy(Math.max(Math.log10(v), -16))])), 'ln');
    o += path(d(G.r2.map((v, k) => [sx(k), sy(Math.max(Math.log10(v), -16))])), 'ink-b');
    o += path(d([...Array(31).keys()].map((k) => [sx(k), sy(Math.max(-k * Math.log10(4), -16))])), 'dash');
    o += text(sx(13), sy(-4.4), 'A₁', 'tl') + text(sx(25), sy(-0.6) + 16, 'A₂', 'tb') + text(sx(13), sy(-9), '虚线 4⁻ᵏ', 'ts', 'end');
    o += text(438, 24, '‖rₖ‖ / ‖b‖（log scale）', 'tb', 'middle');
    o += text(330, 322, `30 步：A₁ ${sci(G.r1[30], 0)}，A₂ ${G.r2[30].toFixed(2)}`, 'ts');
  }
  return svg(560, 330, o, '左边：A1 的 eigenvalue 挤在 2 附近半径一半的 disc 里，A2 的 eigenvalue 绕着原点排成一圈；右边：GMRES 的 residual，A1 大约每步缩小到四分之一，A2 30 步几乎没有下降');
}

export default {
  'ma4230-gsloss': gsloss,
  'ma4230-lsqbar': lsqbar,
  'ma4230-jordan': jordanA,
  'ma4230-svd': svdA,
  'ma4230-lowrank': lowrankA,
  'ma4230-ey': eyproof,
  'ma4230-proj': projector,
  'ma4230-cgsmgs': cgsmgs,
  'ma4230-house': houseA,
  'ma4230-givens': givens,
  'ma4230-backward': backward,
  'ma4230-growth': growthA,
  'ma4230-lsqgeo': lsqgeo,
  'ma4230-hess': hessA,
  'ma4230-shift': shift,
  'ma4230-cg': cgA,
  'ma4230-gmres': gmres,
};
