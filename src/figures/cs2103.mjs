import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, ashow, apath, esc, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
// 箭头头部：fill 实心三角（call、navigability 用 open）、tri 空心三角（inheritance）、dia/diaf 菱形
function head(x1, y1, x2, y2, kind = 'fill', s = 9) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const p = (ang, r = s) => [x2 - r * Math.cos(a + ang), y2 - r * Math.sin(a + ang)];
  if (kind === 'fill') return poly([[x2, y2], p(0.4), p(-0.4)], 'ink-f');
  if (kind === 'lnfill') return poly([[x2, y2], p(0.4), p(-0.4)], 'ln-f');
  if (kind === 'mutefill') return poly([[x2, y2], p(0.4), p(-0.4)], 'mute-f');
  if (kind === 'open') return path(d([p(0.45), [x2, y2], p(-0.45)]), 'ink');
  if (kind === 'lnopen') return path(d([p(0.45), [x2, y2], p(-0.45)]), 'ln');
  if (kind === 'tri') { const r = 12; return poly([[x2, y2], p(0.5, r), p(-0.5, r)], 'paper'); }
  if (kind === 'dia' || kind === 'diaf') {
    const r = 9, m = [x2 - r * Math.cos(a), y2 - r * Math.sin(a)], q = [x2 - 2 * r * Math.cos(a), y2 - 2 * r * Math.sin(a)];
    const n = [-Math.sin(a) * 5, Math.cos(a) * 5];
    return poly([[x2, y2], [m[0] + n[0], m[1] + n[1]], q, [m[0] - n[0], m[1] - n[1]]], kind === 'diaf' ? 'ink-f' : 'paper');
  }
  return '';
}
// 折线连接：pts 为点列，end 是终点头部，start 是起点头部（菱形之类）
function conn(pts, { cls = 'ink', end = null, start = null } = {}) {
  let o = path(d(pts), cls);
  const n = pts.length;
  if (end) o += head(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], end);
  if (start) o += head(pts[1][0], pts[1][1], pts[0][0], pts[0][1], start);
  return o;
}
const ul = (x, y, s, cls = 't', anchor = 'middle') => `<text x="${f1(x)}" y="${f1(y)}" class="${cls}" text-anchor="${anchor}" text-decoration="underline">${s}</text>`;
const g = (body, on, kt, T) => `<g>${body}${ashow(on, kt, T)}</g>`;
const LH = 17;
// UML class box，返回 { o, h }
function cbox(x, y, w, name, attrs = [], ops = [], opt = {}) {
  const top = opt.stereo ? 34 : 24;
  const hA = attrs.length ? attrs.length * LH + 8 : (opt.compart ? 8 : 0);
  const hO = ops.length ? ops.length * LH + 8 : (opt.compart ? 8 : 0);
  const h = top + hA + hO;
  let o = rect(x, y, w, h, opt.cls || 'paper');
  if (opt.stereo) o += text(x + w / 2, y + 14, esc(opt.stereo), 'ts', 'middle');
  const nameCls = opt.nameCls || 'tb';
  o += opt.uName ? ul(x + w / 2, y + top - 7, name, nameCls) : text(x + w / 2, y + top - 7, opt.italic ? `<tspan class="i">${name}</tspan>` : name, nameCls, 'middle');
  let yy = y + top;
  if (hA) { o += line(x, yy, x + w, yy, 'ink'); attrs.forEach((a, i) => { o += (a.u ? ul(x + 7, yy + 15 + i * LH, esc(a.s), 't', 'start') : text(x + 7, yy + 15 + i * LH, esc(a.s || a), 't', 'start')); }); yy += hA; }
  if (hO) { o += line(x, yy, x + w, yy, 'ink'); ops.forEach((a, i) => { o += (a.u ? ul(x + 7, yy + 15 + i * LH, esc(a.s), 't', 'start') : text(x + 7, yy + 15 + i * LH, esc(a.s || a), 't', 'start')); }); }
  return { o, h };
}
// 简单方框（一行或两行字）
function box(x, y, w, h, s, opt = {}) {
  let o = rect(x, y, w, h, opt.cls || 'paper', opt.rx || 0);
  const lines = Array.isArray(s) ? s : [s];
  const cls = opt.tcls || 't';
  const y0 = y + h / 2 + 5 - ((lines.length - 1) * 16) / 2;
  lines.forEach((t, i) => { o += text(x + w / 2, y0 + i * 16, t, i === 0 ? cls : (opt.t2 || 'ts'), 'middle'); });
  return o;
}
const obox = (x, y, w, h, label, cls = 'paper') => rect(x, y, w, h, cls) + ul(x + w / 2, y + h / 2 + 5, label);
// 圆柱（数据库）
function cyl(x, y, w, h, s) {
  const rx = w / 2, ry = 6;
  let o = `<path d="M${f1(x)} ${f1(y + ry)}L${f1(x)} ${f1(y + h - ry)}A${f1(rx)} ${ry} 0 0 0 ${f1(x + w)} ${f1(y + h - ry)}L${f1(x + w)} ${f1(y + ry)}" class="paper"/>`;
  o += `<ellipse cx="${f1(x + rx)}" cy="${f1(y + ry)}" rx="${f1(rx)}" ry="${ry}" class="paper"/>`;
  if (s) o += text(x + rx, y + h / 2 + 9, s, 'ts', 'middle');
  return o;
}
// 文件图标
function doc(x, y, w, h, s, cls = 'paper') {
  const c = 10;
  return poly([[x, y], [x + w - c, y], [x + w, y + c], [x + w, y + h], [x, y + h]], cls) + path(d([[x + w - c, y], [x + w - c, y + c], [x + w, y + c]]), 'ink') + (s ? text(x + w / 2, y + h / 2 + 5, s, 'ts', 'middle') : '');
}
// 帧时间表：durs 是每帧停留秒数，返回 { kt, T }
function frames(durs) {
  const T = durs.reduce((a, b) => a + b, 0), kt = [];
  let t = 0;
  for (const s of durs) { kt.push(t / T); t += s; }
  return { kt, T };
}

// ---------- 开头：lost update ----------
function lost() {
  const sx = lin(0, 4, 145, 520);
  const yA = 40, yS = 118, yB = 196;
  let o = text(14, yA + 5, 'Alice', 'tb') + text(14, yS + 5, '共享文件夹', 'tb') + text(14, yB + 5, 'Bob', 'tb');
  o += line(sx(0) - 10, yA, 545, yA, 'grid') + line(sx(0) - 10, yS, 545, yS, 'grid') + line(sx(0) - 10, yB, 545, yB, 'grid');
  const dw = 92, dh = 34;
  const D = (t, y, s, cls) => doc(sx(t) - dw / 2, y - dh / 2, dw, dh, s, cls);
  o += D(0, yS, 'v1');
  o += arrow(sx(0) + 10, yS - dh / 2, sx(0.85) - 10, yA + dh / 2 + 2, 'mute') + text(sx(0.42) - 6, 76, '拷贝', 'ts', 'end');
  o += arrow(sx(0) + 10, yS + dh / 2, sx(0.85) - 10, yB - dh / 2 - 2, 'mute') + text(sx(0.42) - 6, 168, '拷贝', 'ts', 'end');
  o += D(1, yA, 'v1 + find()') + D(1, yB, 'v1 + 修 delete');
  o += arrow(sx(1) + 14, yA + dh / 2, sx(2) - 14, yS - dh / 2 - 2, 'ink') + text(sx(1.55) + 8, 78, 'Alice 先上传', 'ts', 'start');
  o += D(2, yS, 'v1 + find()');
  o += arrow(sx(1) + dw / 2, yB, sx(3) - 30, yS + dh / 2 + 2, 'ink') + text(sx(2.55), 186, 'Bob 后上传', 'ts', 'middle');
  o += D(3, yS, 'v1 + 修 delete', 'wash');
  o += text(sx(3) + 6, yS - 28, 'find() 不见了', 'tl', 'middle');
  return svg(560, 214, o, 'Alice 和 Bob 从同一个 v1 出发各自修改；Alice 先上传带 find 的版本，Bob 后上传只修了 delete 的版本，把 Alice 的 find 覆盖掉');
}

// ---------- 第 1 站：iss53 与 hotfix ----------
function gitdag() {
  const C = { C0: [44, 150], C1: [104, 150], C2: [164, 150], C3: [244, 86], C5: [324, 86], C4: [244, 214], C6: [414, 150] };
  const par = { C1: ['C0'], C2: ['C1'], C3: ['C2'], C4: ['C2'], C5: ['C3'], C6: ['C4', 'C5'] };
  // 每一步存在的 commit、ref 位置、说明
  const S = [
    { c: ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'], refs: [['HEAD → master', 'C6', 'r'], ['iss53', 'C5', 'u']], cap: '最终：C6 有两个 parent（C4、C5）；master 指向 C6，iss53 仍指向 C5' },
    { c: ['C0', 'C1', 'C2'], refs: [['HEAD → master', 'C2', 'd']], cap: '① master 上已有 C0、C1、C2' },
    { c: ['C0', 'C1', 'C2'], refs: [['master', 'C2', 'd'], ['HEAD → iss53', 'C2', 'u']], cap: '② git checkout -b iss53：多一个 ref，没有新 commit' },
    { c: ['C0', 'C1', 'C2', 'C3'], refs: [['master', 'C2', 'd'], ['HEAD → iss53', 'C3', 'u']], cap: '③ 在 iss53 上 commit：C3 的 parent 是 C2，只有 iss53 往前挪' },
    { c: ['C0', 'C1', 'C2', 'C3', 'C4'], refs: [['master', 'C2', 'd'], ['iss53', 'C3', 'u'], ['HEAD → hotfix', 'C4', 'd']], cap: '④ 回到 master，建 hotfix 并 commit C4（parent 也是 C2）' },
    { c: ['C0', 'C1', 'C2', 'C3', 'C4'], refs: [['iss53', 'C3', 'u'], ['hotfix', 'C4', 'd'], ['HEAD → master', 'C4', 'd2']], cap: '⑤ 在 master 上 merge hotfix：master 是 C4 的祖先，只把 master 挪到 C4（fast-forward）' },
    { c: ['C0', 'C1', 'C2', 'C3', 'C4', 'C5'], refs: [['master', 'C4', 'd'], ['HEAD → iss53', 'C5', 'u']], cap: '⑥ 删掉 hotfix，回到 iss53 继续 commit C5' },
    { c: ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'], refs: [['HEAD → master', 'C6', 'r'], ['iss53', 'C5', 'u']], cap: '⑦ 在 master 上 merge iss53：merge base 是 C2，three-way merge 产生 C6' },
  ];
  const { kt, T } = frames([3.6, 2.2, 2.4, 2.4, 2.8, 3.4, 2.6, 3.6]);
  const N = S.length;
  let o = '';
  // 边：child → parent
  for (const [ch, ps] of Object.entries(par)) for (const p of ps) {
    const [x1, y1] = C[ch], [x2, y2] = C[p], a = Math.atan2(y2 - y1, x2 - x1), r = 15;
    const body = line(x1 + r * Math.cos(a), y1 + r * Math.sin(a), x2 - (r + 2) * Math.cos(a), y2 - (r + 2) * Math.sin(a), 'mute') + head(x1, y1, x2 - r * Math.cos(a), y2 - r * Math.sin(a), 'mutefill', 8);
    o += g(body, S.map((s) => s.c.includes(ch)), kt, T);
  }
  for (const [k, [x, y]] of Object.entries(C)) {
    const body = circle(x, y, 15, k === 'C6' ? 'paper' : 'paper') + (k === 'C6' ? circle(x, y, 19, 'ln') : '') + text(x, y + 5, k, 'tb', 'middle');
    o += g(body, S.map((s) => s.c.includes(k)), kt, T);
  }
  // ref 标签
  const refAt = (lab, c, slot) => {
    const [x, y] = C[c], hot = lab.startsWith('HEAD'), cls = hot ? 'tl' : 't';
    if (slot === 'u') return text(x, y - 30, lab, cls, 'middle') + line(x, y - 25, x, y - 17, 'axis');
    if (slot === 'd') return text(x, y + 38, lab, cls, 'middle') + line(x, y + 17, x, y + 25, 'axis');
    if (slot === 'd2') return text(x, y + 56, lab, cls, 'middle');
    return text(x + 26, y + 5, lab, cls, 'start') + line(x + 17, y, x + 23, y, 'axis');
  };
  S.forEach((s, i) => {
    const on = S.map((_, j) => j === i);
    o += g(s.refs.map(([l, c, sl]) => refAt(l, c, sl)).join('') + text(280, 300, s.cap, 'ts', 'middle'), on, kt, T);
  });
  o += text(14, 22, '箭头从 child 指向 parent；HEAD → 表示当前所在的 branch', 'ts', 'start');
  return svgA(560, 308, o, '动图：iss53 与 hotfix 的例子。master 上有 C0 到 C2；iss53 上 commit C3；hotfix 上 commit C4 并 fast-forward 进 master；iss53 上再 commit C5；最后在 master 上 merge iss53 产生有两个 parent 的 C6');
}

// ---------- rebase 与 merge ----------
function rebase() {
  let o = '';
  const node = (x, y, s, cls = 'paper') => circle(x, y, 15, cls) + text(x, y + 5, s, 'tb', 'middle');
  const edge = (a, b, cls = 'mute') => { const a2 = Math.atan2(b[1] - a[1], b[0] - a[0]); return line(a[0] + 15 * Math.cos(a2), a[1] + 15 * Math.sin(a2), b[0] - 17 * Math.cos(a2), b[1] - 17 * Math.sin(a2), cls) + head(a[0], a[1], b[0] - 15 * Math.cos(a2), b[1] - 15 * Math.sin(a2), 'mutefill', 8); };
  // 左：merge
  o += text(135, 22, 'merge main into feature', 'tb', 'middle');
  const m1 = [40, 170], m2 = [110, 170], f1p = [80, 100], f2p = [150, 100], mc = [220, 100];
  o += edge(m2, m1) + edge(f1p, m1) + edge(f2p, f1p) + edge(mc, f2p) + edge(mc, m2);
  o += node(...m1, 'm1') + node(...m2, 'm2') + node(...f1p, 'f1') + node(...f2p, 'f2') + circle(...mc, 19, 'ln') + node(...mc, 'mc');
  o += text(m2[0], 205, 'main', 't', 'middle') + text(mc[0], 66, 'feature', 't', 'middle');
  o += text(135, 238, '多一个 merge commit，f1、f2 不变', 'ts', 'middle');
  // 右：rebase
  o += text(415, 22, 'rebase feature onto main', 'tb', 'middle');
  const r1 = [300, 170], r2 = [362, 170], g1 = [345, 100], g2 = [410, 100], a1 = [430, 170], a2 = [500, 170];
  o += `<g opacity="0.45">${edge(g1, r1)}${edge(g2, g1)}${circle(...g1, 15, 'paper')}${text(g1[0], g1[1] + 5, 'f1', 'ts', 'middle')}${circle(...g2, 15, 'paper')}${text(g2[0], g2[1] + 5, 'f2', 'ts', 'middle')}</g>`;
  o += text(378, 64, '旧的 f1、f2 不再属于任何 branch', 'ts', 'middle');
  o += edge(r2, r1) + edge(a1, r2) + edge(a2, a1);
  o += node(...r1, 'm1') + node(...r2, 'm2') + node(...a1, 'f1a') + circle(...a2, 19, 'ln') + node(...a2, 'f2a');
  o += text(r2[0], 205, 'main', 't', 'middle') + text(a2[0], 205, 'feature', 't', 'middle');
  o += text(415, 238, '一条直线，但 f1a、f2a 是新 commit', 'ts', 'middle');
  o += line(280, 40, 280, 225, 'grid');
  return svg(560, 246, o, '左边：merge main 进 feature，产生 merge commit，f1、f2 不变。右边：把 feature rebase 到 main 上，f1、f2 被重放成新的 f1a、f2a，history 成一条直线');
}

// ---------- forking workflow ----------
function fork() {
  let o = '';
  const U = [30, 40, 170, 62], F = [360, 40, 170, 62], L = [195, 200, 170, 62];
  const bx = ([x, y, w, h], a, b) => rect(x, y, w, h, 'paper', 8) + text(x + w / 2, y + 26, a, 'tb', 'middle') + text(x + w / 2, y + 46, b, 'ts', 'middle');
  o += bx(U, 'upstream repo', 'GitHub 上的原 repository') + bx(F, 'fork', 'GitHub 上 Jean 的副本') + bx(L, 'local repo', 'Jean 电脑上的 clone');
  o += text(280, 20, 'fork（一次性）', 'ts', 'middle') + arrow(202, 32, 358, 32, 'mute');
  o += arrow(355, 82, 205, 82, 'ln') + text(280, 76, 'pull request', 'tl', 'middle');
  o += arrow(430, 104, 330, 196, 'mute') + text(405, 160, 'clone', 'ts', 'start');
  o += arrow(352, 198, 455, 106, 'ink') + text(458, 156, 'push', 't', 'start');
  o += arrow(110, 104, 205, 196, 'ink') + text(105, 152, 'pull（同步）', 't', 'end');
  o += text(280, 286, 'PR 只从下游指向上游；同步是先从上游 pull 到本地，再 push 到自己的 fork', 'ts', 'middle');
  return svg(560, 294, o, 'Forking workflow：upstream 被 fork 到 Jean 的 GitHub 账号下，再 clone 到本地；本地 branch push 到 fork，从 fork 向 upstream 发 pull request；同步时从 upstream pull 到本地再 push 到 fork');
}

// ---------- 第 2 站：sequential 与 iterative ----------
function seqiter() {
  const sx = lin(0, 12, 40, 540);
  let o = '';
  const seg = (t0, t1, y, h, s, cls) => rect(sx(t0), y, sx(t1) - sx(t0), h, cls) + (s ? text((sx(t0) + sx(t1)) / 2, y + h / 2 + 5, s, 't', 'middle') : '');
  const dia = (t, y, cls = 'ln-f') => poly([[sx(t), y - 8], [sx(t) + 7, y], [sx(t), y + 8], [sx(t) - 7, y]], cls);
  o += text(40, 22, 'sequential：按 activity 切', 'tb', 'start');
  const S = [[0, 2, 'Req'], [2, 4, 'Design'], [4, 9, 'Implementation'], [9, 11, 'Test'], [11, 12, 'Dep']];
  S.forEach(([a, b, s], i) => { o += seg(a, b, 32, 28, s, i % 2 ? 'wash2' : 'wash'); o += rect(sx(a), 32, sx(b) - sx(a), 28, 'frame'); });
  o += dia(12, 76) + text(sx(12) - 12, 81, '用户第一次见到能用的产品', 'ts', 'end');
  o += text(40, 118, 'iterative：按 iteration 切，每 3 周一个版本', 'tb', 'start');
  for (let k = 0; k < 4; k++) {
    const t0 = 3 * k;
    [['R', 0, 0.5], ['D', 0.5, 1], ['I', 1, 2.3], ['T', 2.3, 3]].forEach(([s, a, b], i) => { o += seg(t0 + a, t0 + b, 128, 28, s, i % 2 ? 'wash2' : 'wash'); o += rect(sx(t0 + a), 128, sx(t0 + b) - sx(t0 + a), 28, 'frame'); });
    o += dia(t0 + 3, 172) + text(sx(t0 + 3), 194, ['v0.1', 'v0.2', 'v0.3', 'v1.0'][k], 'tl', 'middle');
    if (k < 3) o += text(sx(t0 + 3), 210, 'feedback', 'ts', 'middle');
  }
  o += line(sx(0), 232, sx(12), 232, 'axis');
  for (let t = 0; t <= 12; t += 1) o += line(sx(t), 232, sx(t), 236, 'axis') + (t % 3 === 0 ? text(sx(t), 250, String(t), 'ts', 'middle') : '');
  o += text(sx(12), 266, '周', 'ts', 'end');
  return svg(560, 270, o, '12 周的项目：sequential 依次做 requirements 2 周、design 2 周、implementation 5 周、test 2 周、deployment 1 周，第 12 周才交付；iterative 分 4 个 3 周的 iteration，第 3、6、9、12 周各交出一个版本');
}

// ---------- PERT ----------
const PT = { A: 1, 'B.1': 0.5, 'B.2': 1, 'B.3': 0.5, 'C.1': 1.5, 'C.2': 2, 'C.3': 1, D: 1, E: 1 };
const PP = { A: [], 'B.1': ['A'], 'B.2': ['A'], 'B.3': ['A'], 'C.1': ['B.1'], 'C.2': ['B.2'], 'C.3': ['B.3'], D: ['C.1', 'C.2', 'C.3'], E: ['D'] };
function schedule(T) {
  const ks = Object.keys(T), ES = {}, EF = {}, LS = {}, LF = {};
  for (const k of ks) { ES[k] = Math.max(0, ...PP[k].map((p) => EF[p])); EF[k] = ES[k] + T[k]; }
  const end = Math.max(...ks.map((k) => EF[k]));
  for (const k of [...ks].reverse()) { const su = ks.filter((s) => PP[s].includes(k)); LF[k] = su.length ? Math.min(...su.map((s) => LS[s])) : end; LS[k] = LF[k] - T[k]; }
  return { ES, EF, LS, LF, end };
}
function pert() {
  const s = schedule(PT);
  const pos = { A: [12, 110], 'B.1': [126, 40], 'B.2': [126, 110], 'B.3': [126, 180], 'C.1': [246, 40], 'C.2': [246, 110], 'C.3': [246, 180], D: [366, 110], E: [474, 110] };
  const W = 74, H = 54;
  let o = text(163, 24, 'design', 'ts', 'middle') + text(283, 24, 'coding', 'ts', 'middle');
  for (const [k, ps] of Object.entries(PP)) for (const p of ps) {
    const [x1, y1] = pos[p], [x2, y2] = pos[k];
    const crit = s.LS[k] - s.ES[k] === 0 && s.LS[p] - s.ES[p] === 0;
    const a = [x1 + W, y1 + H / 2], b = [x2 - 2, y2 + H / 2];
    o += line(a[0], a[1], b[0] - 6, b[1] - (b[1] - a[1]) * 6 / (b[0] - a[0]), crit ? 'ln' : 'ink') + head(a[0], a[1], b[0], b[1], crit ? 'lnfill' : 'fill');
  }
  for (const [k, [x, y]] of Object.entries(pos)) {
    const sl = s.LS[k] - s.ES[k], crit = sl === 0;
    o += rect(x, y, W, H, crit ? 'wash' : 'paper-f') + rect(x, y, W, H, crit ? 'ln' : 'ink');
    o += text(x + W / 2, y + 18, k, 'tb', 'middle') + text(x + W / 2, y + 34, PT[k] + ' 天', 't', 'middle') + text(x + W / 2, y + 49, 'slack ' + sl, crit ? 'tl' : 'ts', 'middle');
  }
  o += text(280, 262, 'critical path A → B.2 → C.2 → D → E，共 1 + 1 + 2 + 1 + 1 = ' + s.end + ' 天', 'ts', 'middle');
  return svg(560, 270, o, 'PERT chart：A 之后并行三条 design 与 coding 路线，汇入 D 再到 E；critical path 是 A、B.2、C.2、D、E，共 6 天，B.1 与 C.1 的 slack 为 1，B.3 与 C.3 的 slack 为 1.5');
}

// ---------- Gantt（动图） ----------
function gantt() {
  const ks = Object.keys(PT);
  const base = schedule(PT), late3 = schedule({ ...PT, 'B.3': 1 }), late2 = schedule({ ...PT, 'B.2': 1.5 });
  const durs = [PT, { ...PT, 'B.3': 1 }, { ...PT, 'B.2': 1.5 }];
  const Ss = [base, late3, late2];
  const { kt, T } = frames([3.5, 3.5, 3.5]);
  const sx = lin(0, 7, 70, 540), rh = 22, y0 = 40;
  let o = '';
  for (let t = 0; t <= 7; t++) o += line(sx(t), y0 - 6, sx(t), y0 + ks.length * rh + 2, 'grid') + text(sx(t), y0 + ks.length * rh + 18, String(t), 'ts', 'middle');
  o += text(sx(7), y0 + ks.length * rh + 34, '天', 'ts', 'end');
  ks.forEach((k, i) => {
    const y = y0 + i * rh;
    o += text(60, y + 15, k, 't', 'end');
    const crit = base.LS[k] - base.ES[k] === 0;
    const xs = Ss.map((S) => f1(sx(S.ES[k]))), ws = Ss.map((S, j) => f1(sx(S.ES[k] + durs[j][k]) - sx(S.ES[k])));
    const sxs = Ss.map((S, j) => f1(sx(S.ES[k] + durs[j][k]))), sws = Ss.map((S, j) => f1(Math.max(0, sx(S.LF[k]) - sx(S.ES[k] + durs[j][k]))));
    o += `<rect x="${sxs[0]}" y="${f1(y + 4)}" width="${sws[0]}" height="${rh - 8}" class="wash2">${anim('x', sxs, kt, T, true)}${anim('width', sws, kt, T, true)}</rect>`;
    o += `<rect x="${xs[0]}" y="${f1(y + 3)}" width="${ws[0]}" height="${rh - 6}" class="${crit ? 'solid' : 'wash-strong'}">${anim('x', xs, kt, T, true)}${anim('width', ws, kt, T, true)}</rect>`;
  });
  const endY = y0 + ks.length * rh + 2;
  const ex = Ss.map((S) => f1(sx(S.end)));
  o += `<line x1="${ex[0]}" y1="${y0 - 10}" x2="${ex[0]}" y2="${endY}" class="ln-dash">${anim('x1', ex, kt, T, true)}${anim('x2', ex, kt, T, true)}</line>`;
  const msg = ['计划：深色是 critical path 上的 task，浅灰是 slack，终点 6 天', 'B.3 多用 0.5 天：被它的 slack 吸收，终点仍是 6 天', 'B.2 多用 0.5 天：C.2、D、E 全部右移，终点 6.5 天'];
  msg.forEach((m, i) => { o += g(text(300, 24, m, i ? 'tl' : 'ts', 'middle'), [0, 1, 2].map((j) => j === i), kt, T); });
  return svgA(560, y0 + ks.length * rh + 40, o, '动图：按 earliest start 排的 Gantt chart。先是原计划，终点 6 天；然后 B.3 晚 0.5 天，终点不变；然后 B.2 晚 0.5 天，后续 task 右移，终点 6.5 天');
}

// ---------- 第 3 站：use case 流程 ----------
function ucflow() {
  const X = 170, W = 200, H = 30, gap = 14, y0 = 30;
  const steps = ['1  User chooses to transfer', '2  OBS requests details', '3  User enters details', '4  OBS requests confirmation', '5  User confirms', '6  OBS transfers, shows balance'];
  const Y = (i) => y0 + i * (H + gap);
  let o = text(X + W / 2, 18, 'MSS', 'tb', 'middle');
  steps.forEach((s, i) => { o += rect(X, Y(i), W, H, 'paper', 4) + text(X + 10, Y(i) + 20, s, 't', 'start'); if (i < 5) o += arrow(X + W / 2, Y(i) + H, X + W / 2, Y(i + 1) - 1, 'ink'); });
  const endY = Y(6) + 6;
  o += arrow(X + W / 2, Y(5) + H, X + W / 2, endY - 9, 'ink') + circle(X + W / 2, endY, 8, 'ink-f') + text(X + W / 2 + 14, endY + 5, 'use case ends', 'ts', 'start');
  // 3a
  const R = 400, RW = 150;
  o += rect(R, Y(2) - 18, RW, 54, 'wash', 4) + text(R + 8, Y(2) - 1, '3a  data has error', 'tb', 'start') + text(R + 8, Y(2) + 16, '3a1 OBS asks again', 'ts', 'start') + text(R + 8, Y(2) + 31, '3a2 User re-enters', 'ts', 'start');
  o += arrow(X + W, Y(2) + 10, R - 2, Y(2) + 4, 'ink');
  o += path(`M${R + RW} ${Y(2) - 4}C${R + RW + 14} ${Y(2) - 4} ${R + RW + 14} ${Y(2) + 30} ${R + RW} ${Y(2) + 30}`, 'mute') + text(R + RW - 4, Y(2) - 24, '重复直到正确', 'ts', 'end');
  o += arrow(R + 30, Y(2) + 36, X + W + 2, Y(3) + 16, 'ln') + text(R + 38, Y(3) + 14, 'resumes from step 4', 'tl', 'start');
  // 3b
  o += rect(R, Y(4) - 6, RW, 50, 'wash2', 4) + text(R + 8, Y(4) + 12, '3b  future date', 'tb', 'start') + text(R + 8, Y(4) + 30, '3b1 confirm, 3b2 OK', 'ts', 'start');
  o += path(`M${X + W} ${Y(2) + 22}C${X + W + 20} ${Y(2) + 70} ${R - 30} ${Y(4) - 10} ${R - 2} ${Y(4) + 10}`, 'ink') + head(R - 30, Y(4) - 2, R - 2, Y(4) + 10, 'fill');
  o += arrow(R + RW / 2, Y(4) + 44, R + RW / 2, endY - 9, 'ink') + circle(R + RW / 2, endY, 8, 'ink-f');
  // *a
  const Lx = 8, LW = 140;
  o += rect(Lx, Y(1), LW, 58, 'wash2', 4) + text(Lx + 8, Y(1) + 18, '*a  任何一步', 'tb', 'start') + text(Lx + 8, Y(1) + 35, 'User cancels', 'ts', 'start') + text(Lx + 8, Y(1) + 51, '*a1 confirm, *a2 OK', 'ts', 'start');
  [0, 1, 2, 3, 4, 5].forEach((i) => { o += line(X - 2, Y(i) + H / 2, Lx + LW + 12, Y(1) + 29, 'dash'); });
  o += head(Lx + LW + 30, Y(1) + 29, Lx + LW + 1, Y(1) + 29, 'fill');
  o += arrow(Lx + LW / 2, Y(1) + 58, Lx + LW / 2, endY - 9, 'ink') + circle(Lx + LW / 2, endY, 8, 'ink-f');
  return svg(560, endY + 14, o, 'UC23 Transfer Money 的流程：中间一列是 MSS 的 6 步；3a 从第 3 步分出、反复要求重新输入后回到第 4 步；3b 从第 3 步分出后结束；*a 可以从任何一步分出取消并结束');
}

// ---------- 第 4 站：class 的画法 ----------
function classbox() {
  let o = '';
  const t = cbox(20, 30, 200, 'Table', ['-number: int = 0', '-chairs: Chair[ ] = [ ]'], ['+getNumber(): int', '+setNumber(n: int)']);
  o += t.o;
  o += text(232, 51, '← name', 'ts', 'start') + text(232, 83, '← attributes', 'ts', 'start') + text(232, 125, '← operations', 'ts', 'start');
  o += text(20, 190, '+ public   - private   # protected   ~ package', 'ts', 'start');
  const s = cbox(340, 18, 200, 'Student', [{ s: 'totalStudents: int', u: true }], [{ s: 'getTotalStudents(): int', u: true }]);
  o += s.o + text(545, 18 + s.h + 14, 'class-level：加下划线', 'ts', 'end');
  const i = cbox(340, 130, 95, 'Payee', [], [], { stereo: '<<interface>>' });
  o += i.o;
  const a = cbox(445, 130, 95, 'Shape', [], [], { stereo: '{abstract}' });
  o += a.o;
  const e = cbox(340, 190, 200, 'Rating', ['GOOD', 'OK', 'POOR'], [], { stereo: '<<enumeration>>' });
  o += e.o;
  return svg(560, 190 + e.h + 6, o, 'UML class 的画法：Table 有名字、attribute、operation 三栏，加减号表示 visibility；Student 的 class-level 成员加下划线；interface 和 enumeration 带 stereotype，abstract class 标 abstract');
}

// ---------- Box/Item/Card ----------
function boxclass() {
  let o = '';
  const B = [36, 42, 104, 30], I = [226, 42, 104, 30], Cd = [432, 42, 104, 30];
  const cb = ([x, y, w, h], s) => rect(x, y, w, h, 'paper') + text(x + w / 2, y + 20, s, 'tb', 'middle');
  o += cb(B, 'Box') + cb(I, 'Item') + cb(Cd, 'Card');
  o += conn([[140, 57], [224, 57]], { end: 'open' }) + text(214, 50, '1', 't', 'end');
  o += conn([[278, 42], [278, 16], [88, 16], [88, 40]], { end: 'open' }) + text(96, 32, '*', 't', 'start') + text(183, 30, 'previousBoxes', 'ts', 'middle');
  o += conn([[330, 57], [430, 57]], { end: 'open' }) + text(422, 50, '0..1', 't', 'end') + text(380, 73, 'mainCard', 'ts', 'middle');
  o += conn([[300, 72], [300, 100], [484, 100], [484, 74]], { end: 'open' }) + text(492, 92, '0..1', 't', 'start') + text(392, 94, 'subCard', 'ts', 'middle');
  o += text(548, 128, 'class diagram', 'ts', 'end');
  o += line(10, 140, 550, 140, 'grid');
  // object diagram
  const ob = (x, y, s) => obox(x, y, 104, 30, s);
  o += ob(56, 176, 'box2:Box') + ob(246, 176, 'item2:Item') + ob(432, 176, ':Card') + ob(56, 246, 'box1:Box') + ob(246, 246, 'item1:Item');
  o += conn([[160, 191], [244, 191]], { end: 'open' }) + conn([[160, 261], [244, 261]], { end: 'open' });
  o += conn([[350, 191], [430, 191]], { end: 'open' }) + text(390, 184, 'mainCard', 'ts', 'middle');
  o += path(d([[298, 176], [298, 158], [28, 158], [28, 261]]), 'ink') + conn([[28, 191], [54, 191]], { end: 'open' }) + conn([[28, 261], [54, 261]], { end: 'open' });
  o += text(163, 152, 'previousBoxes', 'ts', 'middle');
  o += text(548, 300, 'object diagram（main 跑完时）', 'ts', 'end');
  return svg(560, 306, o, '上：Box 指向 Item（multiplicity 1），Item 指向 Box（previousBoxes，多重性星号），Item 指向 Card 两条（mainCard、subCard，各 0..1）。下：box1 连 item1，box2 连 item2，item2 的 mainCard 是一个匿名 Card，item2 的 previousBoxes 连 box1 和 box2');
}

// ---------- 七种关系 ----------
function relations() {
  let o = '';
  const cell = (cx, cy, title, L, R, kind, extra = '') => {
    const bw = 96, bh = 26, lx = cx + 6, rx = cx + 168;
    let q = text(cx + 6, cy, title, 'tb', 'start');
    q += rect(lx, cy + 12, bw, bh, 'paper') + text(lx + bw / 2, cy + 30, L, 't', 'middle');
    q += rect(rx, cy + 12, bw, bh, 'paper') + text(rx + bw / 2, cy + 30, R, 't', 'middle');
    const y = cy + 25, a = lx + bw, b = rx;
    if (kind === 'nav') q += conn([[a, y], [b - 1, y]], { end: 'open' });
    if (kind === 'inh') q += conn([[a, y], [b, y]], { end: 'tri' });
    if (kind === 'real') q += conn([[a, y], [b, y]], { cls: 'dash', end: 'tri' });
    if (kind === 'comp') q += conn([[a, y], [b, y]], { start: 'diaf' }) + text(b - 6, y - 6, '*', 't', 'end');
    if (kind === 'agg') q += conn([[a, y], [b, y]], { start: 'dia' }) + text(b - 6, y - 6, '*', 't', 'end');
    if (kind === 'dep') q += conn([[a, y], [b - 1, y]], { cls: 'dash', end: 'open' });
    return q + extra;
  };
  o += cell(4, 18, 'Association + navigability', 'Logic', 'Minefield', 'nav');
  o += cell(286, 18, 'Inheritance', 'Car', 'Vehicle', 'inh');
  o += cell(4, 92, 'Interface 的实现', 'AcademicStaff', 'SalariedStaff', 'real');
  o += cell(286, 92, 'Composition', 'Book', 'Chapter', 'comp');
  o += cell(4, 166, 'Aggregation', 'Club', 'Member', 'agg');
  o += cell(286, 166, 'Dependency', 'ScoreBoard', 'Player', 'dep');
  // association class
  const cy = 240;
  o += text(10, cy, 'Association class', 'tb', 'start');
  o += rect(10, cy + 12, 96, 26, 'paper') + text(58, cy + 30, 'User', 't', 'middle');
  o += rect(174, cy + 12, 96, 26, 'paper') + text(222, cy + 30, 'Book', 't', 'middle');
  o += line(106, cy + 25, 174, cy + 25, 'ink') + text(140, cy + 19, 'borrows', 'ts', 'middle');
  o += line(140, cy + 25, 140, cy + 52, 'dash') + rect(98, cy + 52, 84, 26, 'paper') + text(140, cy + 70, 'Loan', 't', 'middle');
  o += text(300, cy + 22, '实线 + 空心三角：inheritance', 'ts', 'start') + text(300, cy + 40, '虚线 + 空心三角：实现 interface', 'ts', 'start') + text(300, cy + 58, '菱形在 whole 一端；虚线箭头：dependency', 'ts', 'start');
  return svg(560, cy + 84, o, '七种关系的画法：Logic 指向 Minefield 的 navigability；Car 继承 Vehicle；AcademicStaff 实现 SalariedStaff；Book 与 Chapter 的 composition；Club 与 Member 的 aggregation；ScoreBoard 依赖 Player；User 借 Book 的 association 上挂着 association class Loan');
}

// ---------- 第 5 站：sequence diagram（动图） ----------
function seq() {
  const xC = 50, xW = 230, xS = 440;
  let o = '';
  o += text(xC, 28, 'caller', 'ts', 'middle');
  o += rect(xW - 50, 10, 100, 28, 'paper') + text(xW, 29, ':Workflow', 't', 'middle');
  o += rect(xS - 50, 10, 100, 28, 'paper') + text(xS, 29, 'step:Step', 't', 'middle');
  o += line(xC, 40, xC, 300, 'dash') + line(xW, 38, xW, 300, 'dash') + line(xS, 38, xS, 300, 'dash');
  // activation bars
  o += rect(xW - 5, 66, 10, 216, 'paper') + rect(xS - 5, 94, 10, 26, 'paper') + rect(xS - 5, 142, 10, 26, 'paper') + rect(xS - 5, 214, 10, 26, 'paper');
  // opt frame
  o += rect(xW - 60, 188, xS - xW + 120, 64, 'frame') + path(d([[xW - 60, 202], [xW - 18, 202], [xW - 10, 194], [xW - 10, 188]]), 'mute') + text(xW - 55, 200, 'opt', 'tb', 'start') + text(xW + 16, 207, '[isValid]', 't', 'start');
  const msgs = [
    [xC, xW - 5, 66, 'executeStep(step)', false],
    [xW + 5, xS - 5, 94, 'init()', false],
    [xS - 5, xW + 5, 120, '', true],
    [xW + 5, xS - 5, 142, 'isValid()', false],
    [xS - 5, xW + 5, 168, 'isValid', true],
    [xW + 5, xS - 5, 214, 'execute()', false],
    [xS - 5, xW + 5, 240, '', true],
    [xW - 5, xC, 282, 'step', true],
  ];
  const draw = (m, hot) => {
    const [x1, x2, y, s, ret] = m, cls = hot ? (ret ? 'ln-dash' : 'ln') : (ret ? 'dash' : 'ink');
    const hd = ret ? (hot ? 'lnopen' : 'open') : (hot ? 'lnfill' : 'fill');
    return line(x1, y, x2 + (x2 > x1 ? -3 : 3), y, cls) + head(x1, y, x2, y, hd) + (s ? text((x1 + x2) / 2, y - 6, s, hot ? 'tl' : 't', 'middle') : '');
  };
  msgs.forEach((m) => { o += draw(m, false); });
  const N = msgs.length + 1;
  const { kt, T } = frames([3, ...msgs.map(() => 1.3)]);
  msgs.forEach((m, i) => { o += g(draw(m, true), Array.from({ length: N }, (_, j) => j === i + 1), kt, T); });
  return svgA(560, 306, o, '动图：executeStep 的 sequence diagram。caller 调用 Workflow 的 executeStep；Workflow 依次调用 step 的 init 和 isValid；opt 框里在 isValid 为真时调用 execute；最后返回 step');
}

// ---------- sequence diagram：循环与创建 ----------
function seqloop() {
  const xC = 40, xL = 150, xP = 300, xT = 450;
  let o = text(xC, 28, 'caller', 'ts', 'middle') + line(xC, 36, xC, 320, 'dash');
  // personList 创建
  o += line(xC, 58, xL - 77, 58, 'ink') + head(xC, 58, xL - 75, 58, 'fill') + text(58, 52, 'new', 'ts', 'middle');
  o += rect(xL - 75, 44, 150, 28, 'paper') + text(xL, 63, 'personList:PersonList', 't', 'middle') + line(xL, 72, xL, 320, 'dash');
  o += rect(xL - 5, 72, 10, 14, 'paper') + line(xL - 5, 86, xC + 3, 86, 'dash') + head(xL - 5, 86, xC, 86, 'open');
  // loop frame
  o += rect(14, 104, 532, 200, 'frame') + path(d([[14, 120], [60, 120], [68, 112], [68, 104]]), 'mute') + text(20, 117, 'loop', 'tb', 'start') + text(80, 122, '[hasRoom]', 't', 'start');
  // new Person
  o += line(xC, 150, xP - 52, 150, 'ink') + head(xC, 150, xP - 50, 150, 'fill') + text(170, 144, 'Person("Adam", "friend")', 'ts', 'middle');
  o += rect(xP - 50, 136, 100, 28, 'paper') + text(xP, 155, 'p:Person', 't', 'middle') + line(xP, 164, xP, 320, 'dash');
  o += rect(xP - 5, 164, 10, 66, 'paper');
  o += line(xP + 5, 190, xT - 52, 190, 'ink') + head(xP + 5, 190, xT - 50, 190, 'fill') + text(352, 184, 'Tag("friend")', 'ts', 'middle');
  o += rect(xT - 50, 176, 100, 28, 'paper') + text(xT, 195, ':Tag', 't', 'middle') + line(xT, 204, xT, 320, 'dash');
  o += rect(xT - 5, 204, 10, 14, 'paper') + line(xT - 5, 218, xP + 8, 218, 'dash') + head(xT - 5, 218, xP + 5, 218, 'open');
  o += line(xP - 5, 230, xC + 3, 230, 'dash') + head(xP - 5, 230, xC, 230, 'open') + text(170, 225, 'p', 'ts', 'middle');
  o += line(xC, 268, xL - 8, 268, 'ink') + head(xC, 268, xL - 5, 268, 'fill') + text(95, 262, 'addPerson(p)', 'ts', 'middle');
  o += rect(xL - 5, 268, 10, 20, 'paper') + line(xL - 5, 288, xC + 3, 288, 'dash') + head(xL - 5, 288, xC, 288, 'open');
  return svg(560, 324, o, 'Sequence diagram：先创建 personList；loop 框里每一轮创建 p:Person，Person 的 constructor 再创建一个 Tag，返回 p 后调用 personList 的 addPerson');
}

// ---------- activity diagram：汉堡店 ----------
function activity() {
  let o = '';
  const act = (cx, cy, w, s) => rect(cx - w / 2, cy - 15, w, 30, 'paper', 12) + text(cx, cy + 5, s, 't', 'middle');
  const bar = (x1, x2, y) => rect(x1, y - 3, x2 - x1, 6, 'ink-f');
  const dia = (cx, cy) => poly([[cx, cy - 11], [cx + 13, cy], [cx, cy + 11], [cx - 13, cy]], 'paper');
  o += circle(280, 18, 8, 'ink-f') + arrow(280, 26, 280, 40, 'ink');
  o += act(280, 56, 120, 'Take order') + arrow(280, 71, 280, 89, 'ink');
  o += bar(40, 520, 93);
  const cols = [[62, 'Make drinks'], [166, 'Make burgers'], [272, 'Make desserts']];
  cols.forEach(([x, s]) => { o += arrow(x, 96, x, 159, 'ink') + act(x, 175, 98, s) + arrow(x, 190, x, 284, 'ink'); });
  // payment
  o += arrow(440, 96, 440, 116, 'ink') + dia(440, 128);
  o += path(d([[427, 128], [385, 128], [385, 158]]), 'ink') + head(385, 140, 385, 160, 'fill') + text(380, 120, '[has voucher]', 'ts', 'end');
  o += path(d([[453, 128], [497, 128], [497, 158]]), 'ink') + head(497, 140, 497, 160, 'fill') + text(503, 120, '[else]', 'ts', 'start');
  o += act(385, 175, 104, 'Pay by voucher') + act(497, 175, 96, 'Pay by cash');
  o += path(d([[385, 190], [385, 232], [428, 232]]), 'ink') + head(410, 232, 428, 232, 'fill');
  o += path(d([[497, 190], [497, 232], [452, 232]]), 'ink') + head(470, 232, 452, 232, 'fill');
  o += dia(440, 232) + arrow(440, 243, 440, 284, 'ink');
  o += bar(40, 520, 288) + arrow(280, 291, 280, 309, 'ink');
  o += act(280, 325, 120, 'Collect food') + arrow(280, 340, 280, 352, 'ink');
  o += circle(280, 362, 9, 'paper') + circle(280, 362, 5, 'ink-f');
  o += text(530, 98, 'fork', 'ts', 'start') + text(530, 293, 'join', 'ts', 'start') + text(462, 250, 'merge', 'ts', 'start') + text(462, 112, 'branch', 'ts', 'start');
  return svg(560, 374, o, '汉堡店的 activity diagram：Take order 之后一个 fork 分出四条并行路径，分别做饮料、做汉堡、做甜点和付款；付款路径里按是否有 voucher 分支再合并；四条路径在 join 汇合后 Collect food');
}

// ---------- 第 6 站：改文件格式波及多少 ----------
function ripple() {
  let o = '';
  const bx = (x, y, s, hot) => rect(x, y, 88, 30, hot ? 'wash' : 'paper-f') + rect(x, y, 88, 30, hot ? 'ln' : 'ink') + text(x + 44, y + 20, s, hot ? 'tl' : 't', 'middle');
  // 左
  o += text(135, 20, '谁都直接读文件', 'tb', 'middle');
  const L = [['Ui', 40], ['Logic', 90], ['Tests', 140], ['Storage', 190]];
  L.forEach(([s, y]) => { o += bx(16, y, s, true) + arrow(104, y + 15, 172, 128, 'ink'); });
  o += doc(176, 108, 82, 44, 'data.txt');
  o += text(217, 170, '文件格式', 'ts', 'middle');
  o += text(135, 250, '换成 JSON：要改 4 处', 'tl', 'middle');
  o += line(280, 30, 280, 250, 'grid');
  // 右
  o += text(420, 20, '只有 Storage 知道格式', 'tb', 'middle');
  o += bx(300, 40, 'Ui', false) + bx(300, 105, 'Logic', false) + bx(300, 170, 'Storage', true) + bx(446, 40, 'Tests', false);
  o += arrow(344, 70, 344, 103, 'ink') + arrow(344, 135, 344, 168, 'ink') + arrow(470, 70, 390, 112, 'ink');
  o += arrow(388, 185, 446, 185, 'ink') + doc(450, 163, 82, 44, 'data.txt');
  o += text(420, 250, '换成 JSON：要改 1 处', 'tl', 'middle');
  return svg(560, 260, o, '左：Ui、Logic、Tests、Storage 都直接依赖文件格式，改成 JSON 要改 4 处。右：Ui 依赖 Logic，Logic 依赖 Storage，Tests 依赖 Logic，只有 Storage 依赖文件格式，只改 1 处');
}

// ---------- DIP ----------
function dip() {
  let o = '';
  const cb = (x, y, w, s, stereo) => cbox(x, y, w, s, [], [], { stereo }).o;
  o += text(130, 20, '违反 DIP', 'tb', 'middle');
  o += cb(20, 60, 100, 'Payroll') + cb(20, 170, 100, 'Employee');
  o += conn([[70, 84], [70, 168]], { end: 'open' });
  o += text(130, 140, '高层直接依赖低层', 'ts', 'start');
  o += text(130, 240, 'dependency：1 条', 'tl', 'middle');
  o += line(280, 30, 280, 240, 'grid');
  o += text(420, 20, '应用 DIP', 'tb', 'middle');
  o += cb(300, 60, 100, 'Payroll') + cb(430, 110, 110, 'Payee', '<<interface>>') + cb(300, 170, 100, 'Employee');
  o += conn([[400, 72], [485, 72], [485, 108]], { end: 'open' });
  o += conn([[400, 182], [485, 182], [485, 146]], { cls: 'dash', end: 'tri' });
  o += text(420, 240, 'dependency：2 条，方向变了', 'tl', 'middle');
  return svg(560, 250, o, '左：Payroll 直接依赖 Employee，一条 dependency。右：Payroll 依赖 Payee interface，Employee 实现 Payee，两条 dependency，Employee 的箭头方向反了过来');
}

// ---------- 第 7 站：Command ----------
function command() {
  let o = '';
  const cr = cbox(20, 20, 140, 'CommandCreator').o, q = cbox(20, 130, 140, 'CommandQueue', [], ['add(Command)', 'executeAll()']);
  o += cr + q.o;
  o += conn([[90, 44], [90, 128]], { end: 'open' }) + text(98, 92, 'adds commands to', 'ts', 'start');
  const c = cbox(260, 118, 140, 'Command', [], ['execute()', 'undo()'], { stereo: '{abstract}' });
  o += c.o + conn([[160, 160], [258, 160]], { end: 'open' }) + text(250, 153, '*', 't', 'end') + text(209, 177, 'executes', 'ts', 'middle');
  const ks = [['List', 210], ['Sort', 310], ['Reset', 410]];
  ks.forEach(([s, x]) => { o += rect(x, 250, 80, 28, 'paper') + text(x + 40, 269, s, 't', 'middle') + path(d([[x + 40, 248], [x + 40, 232], [330, 232]]), 'ink'); });
  o += conn([[330, 232], [330, 118 + c.h + 1]], { end: 'tri' });
  o += rect(424, 62, 96, 28, 'paper') + text(472, 81, 'DataStore', 't', 'middle');
  o += conn([[470, 248], [470, 92]], { cls: 'dash', end: 'open' }) + text(462, 200, 'uses', 'ts', 'end');
  o += conn([[160, 32], [540, 32], [540, 264], [492, 264]], { cls: 'dash', end: 'open' });
  o += text(350, 26, 'creates List、Sort、Reset', 'ts', 'middle');
  return svg(560, 290, o, 'Command pattern：CommandCreator 创建具体的 command 并加进 CommandQueue；CommandQueue 持有多个 Command 并调用 execute；List、Sort、Reset 继承 Command，执行时使用 DataStore');
}

// ---------- Abstraction Occurrence ----------
function abstocc() {
  let o = text(130, 18, '每本各存一份共同信息', 'tb', 'middle') + text(420, 18, '共同信息只存一处', 'tb', 'middle');
  for (let i = 0; i < 5; i++) {
    const y = 32 + i * 48;
    o += rect(14, y, 240, 40, 'paper') + ul(46, y + 16, ':Book', 'ts');
    o += text(80, y + 16, 'title = Clean Code', 't', 'start') + text(80, y + 33, 'author = R. Martin', 'tl', 'start') + text(246, y + 33, 'B0' + (i + 1), 'ts', 'end');
  }
  o += text(134, 286, '作者名拼错：要改 5 处', 'tl', 'middle');
  o += line(274, 30, 274, 280, 'grid');
  o += rect(300, 100, 130, 76, 'paper') + ul(365, 118, ':BookTitle', 'ts') + text(310, 138, 'Clean Code', 't', 'start') + text(310, 155, 'R. Martin', 'tl', 'start') + text(310, 171, 'ISBN ...', 'ts', 'start');
  for (let i = 0; i < 5; i++) {
    const y = 32 + i * 48;
    o += rect(460, y, 88, 40, 'paper') + ul(504, y + 16, ':BookCopy', 'ts') + text(504, y + 33, 'B0' + (i + 1), 't', 'middle');
    o += line(458, y + 20, 432, 138, 'ink');
  }
  o += text(424, 286, '只改 BookTitle 一处', 'tl', 'middle');
  return svg(560, 294, o, '左：五个 Book object 各自存一份书名和作者。右：一个 BookTitle 存书名、作者和 ISBN，五个 BookCopy 只存各自的条形码并连向它');
}

// ---------- Observer ----------
function observer() {
  let o = text(132, 18, '之前：StudentList 找不到 UI', 'tb', 'middle') + text(420, 18, '之后：经过 Observer interface', 'tb', 'middle');
  const bx = (x, y, w, s, cls = 'paper') => rect(x, y, w, 28, cls) + text(x + w / 2, y + 19, s, 't', 'middle');
  // 之前
  o += bx(70, 200, 120, 'StudentList');
  o += bx(4, 120, 112, 'StudentListUi') + bx(140, 120, 116, 'StudentStatsUi') + bx(70, 50, 120, 'NewStudentUi');
  o += conn([[60, 148], [100, 198]], { end: 'open' }) + conn([[198, 148], [160, 198]], { end: 'open' }) + conn([[130, 78], [130, 198]], { end: 'open' });
  o += text(132, 252, 'navigability 只从 UI 指向 StudentList', 'ts', 'middle');
  o += line(278, 30, 278, 262, 'grid');
  // 之后
  const sl = cbox(294, 186, 128, 'StudentList', [], ['+addUi(Observer)', '-notifyUIs()']);
  o += sl.o;
  const ob = cbox(436, 104, 112, 'Observer', [], ['update()'], { stereo: '<<interface>>' });
  o += ob.o;
  o += conn([[422, 205], [492, 205], [492, 104 + ob.h + 1]], { end: 'open' }) + text(500, 190, '*', 't', 'start');
  o += bx(292, 50, 104, 'StudentListUi') + bx(406, 40, 120, 'StudentStatsUi');
  o += conn([[380, 78], [470, 102]], { cls: 'dash', end: 'tri' }) + conn([[480, 68], [492, 102]], { cls: 'dash', end: 'tri' });
  o += conn([[330, 78], [330, 184]], { end: 'open' });
  return svg(560, 262, o, '左：三个 UI 都指向 StudentList，StudentList 无法通知它们。右：StudentList 持有任意多个 Observer 并调用 update，StudentListUi 和 StudentStatsUi 实现 Observer interface');
}

// ---------- 第 8 站：invoice manager 的两种 architecture ----------
function arch() {
  let o = text(130, 18, '单机：4 个 layer，1 个 tier', 'tb', 'middle') + text(420, 18, '加 server：2 个 tier', 'tb', 'middle');
  const bx = (x, y, w, s, cls = 'paper') => rect(x, y, w, 30, cls, 4) + text(x + w / 2, y + 20, s, 't', 'middle');
  o += rect(14, 32, 232, 236, 'wash2', 10) + text(26, 52, 'one program, one computer', 'ts', 'start');
  o += bx(70, 64, 110, 'Ui') + bx(70, 124, 110, 'Logic') + bx(20, 194, 100, 'Model') + bx(140, 194, 100, 'Storage');
  o += arrow(125, 94, 125, 122, 'ink') + arrow(110, 154, 74, 192, 'ink') + arrow(140, 154, 182, 192, 'ink') + arrow(76, 94, 40, 192, 'ink');
  o += cyl(165, 238, 50, 26, '');
  o += arrow(190, 224, 190, 238, 'ink');
  o += line(275, 30, 275, 290, 'grid');
  // 右
  o += rect(290, 32, 150, 236, 'wash2', 10) + text(300, 52, 'client tier', 'ts', 'start');
  o += bx(300, 64, 130, 'Ui') + bx(300, 124, 130, 'Logic') + bx(300, 194, 130, 'RemoteStorage');
  o += arrow(365, 94, 365, 122, 'ink') + arrow(365, 154, 365, 192, 'ink');
  o += rect(458, 120, 96, 148, 'wash2', 10) + text(466, 140, 'server tier', 'ts', 'start');
  o += bx(464, 152, 84, 'handler');
  o += cyl(481, 218, 50, 30, '');
  o += arrow(506, 182, 506, 216, 'ink');
  o += path(d([[430, 209], [446, 209], [446, 167], [462, 167]]), 'ln-dash') + head(446, 167, 462, 167, 'lnfill');
  o += text(452, 103, 'network', 'tl', 'middle') + text(452, 117, 'request', 'ts', 'middle');
  o += text(280, 286, '箭头是 dependency；彩色虚线是跨网络的消息', 'ts', 'middle');
  return svg(560, 294, o, '左：桌面版 invoice manager，Ui、Logic、Model、Storage 四个 layer 在同一个程序里，一个 tier。右：Storage 换成 RemoteStorage，通过网络向 server 上的 handler 发请求，client 和 server 两个 tier');
}

// ---------- integration：top-down 与 bottom-up（动图） ----------
function integ() {
  const P = { A: [280, 42], B: [130, 104], C: [280, 104], D: [430, 104], E: [80, 166], F: [180, 166], G: [280, 166], H: [400, 166], I: [480, 166], J: [80, 228], K: [240, 228], L: [320, 228], M: [400, 228] };
  const par = { B: 'A', C: 'A', D: 'A', E: 'B', F: 'B', G: 'C', H: 'D', I: 'D', J: 'E', K: 'G', L: 'G', M: 'H' };
  const lvl = { A: 0, B: 1, C: 1, D: 1, E: 2, F: 2, G: 2, H: 2, I: 2, J: 3, K: 3, L: 3, M: 3 };
  const ks = Object.keys(P);
  // 每帧每个节点的状态：R 真、S stub、N 不出现；drivers：哪些节点上方有 driver
  const F = [];
  const all = (f) => Object.fromEntries(ks.map((k) => [k, f(k)]));
  F.push({ st: all(() => 'R'), dr: [], cap: '依赖关系：箭头从调用者指向被调用者' });
  for (let L = 0; L <= 3; L++) F.push({ st: all((k) => (lvl[k] <= L ? 'R' : lvl[k] === L + 1 ? 'S' : 'N')), dr: [], cap: ['top-down ①：A 加上 B、C、D 的 stub（已写 3 个 stub）', 'top-down ②：换上真的 B、C、D，补 E 到 I 的 stub（共 8 个）', 'top-down ③：换上 E 到 I，补 J、K、L、M 的 stub（共 12 个）', 'top-down ④：全部是真 component'][L] });
  const g1 = ['E', 'J', 'G', 'K', 'L', 'H', 'M'], g2 = [...g1, 'B', 'F', 'C', 'D', 'I'];
  F.push({ st: all((k) => (g1.includes(k) ? 'R' : 'N')), dr: ['E', 'G', 'H'], cap: 'bottom-up ①：E+J、G+K+L、H+M 各成一组，顶端由 driver 调用' });
  F.push({ st: all((k) => (g2.includes(k) ? 'R' : 'N')), dr: ['B', 'C', 'D'], cap: 'bottom-up ②：并入 B+F、C、D+I（driver 共写 6 个）' });
  F.push({ st: all(() => 'R'), dr: [], cap: 'bottom-up ③：A 把三组合起来' });
  const { kt, T } = frames([3, 2.6, 2.6, 2.6, 2.2, 3, 3, 2.6]);
  let o = '';
  const W = 52, H = 28;
  for (const [c, p] of Object.entries(par)) {
    const [x1, y1] = P[p], [x2, y2] = P[c];
    const body = line(x1, y1 + H / 2, x2, y2 - H / 2 - 3, 'mute') + head(x1, y1 + H / 2, x2, y2 - H / 2, 'mutefill', 7);
    o += g(body, F.map((f) => f.st[c] !== 'N' && f.st[p] !== 'N'), kt, T);
  }
  for (const k of ks) {
    const [x, y] = P[k];
    o += g(rect(x - W / 2, y - H / 2, W, H, 'paper', 4) + text(x, y + 5, k, 'tb', 'middle'), F.map((f) => f.st[k] === 'R'), kt, T);
    o += g(rect(x - W / 2, y - H / 2, W, H, 'paper-f', 4) + rect(x - W / 2, y - H / 2, W, H, 'ln-dash', 4) + text(x, y + 5, k + ' stub', 'ts', 'middle'), F.map((f) => f.st[k] === 'S'), kt, T);
    o += g(text(x, y - H / 2 - 18, 'driver', 'tl', 'middle') + line(x, y - H / 2 - 14, x, y - H / 2 - 4, 'ln') + head(x, y - H / 2 - 14, x, y - H / 2 - 1, 'lnfill', 7), F.map((f) => f.dr.includes(k)), kt, T);
  }
  F.forEach((f, i) => { o += g(text(280, 280, f.cap, i ? 'tl' : 'ts', 'middle'), F.map((_, j) => j === i), kt, T); });
  return svgA(560, 290, o, '动图：A 到 M 的依赖树。top-down 时逐层把 stub 换成真 component，共写 12 个 stub；bottom-up 时从叶子开始逐组合并，每组顶端由 driver 驱动，A 进来之前共写 6 个 driver');
}

// ---------- 第 9 站：exception 沿 call stack 往回找（动图） ----------
function stack() {
  const fr = [['main', 'try { load(f); } catch (IOException e) { ... }'], ['load', 'readLine(f);   // 没有 catch'], ['readLine', 'throw new IOException(...);']];
  const X = 20, W = 330, H = 44, Y = (i) => 210 - i * 58;
  const S = [
    { live: [1, 1, 1], at: 0, mark: ['ok', 'no', 'no'], cap: '找到 handler：main 的 catch 接住 exception' },
    { live: [1, 1, 1], at: 2, mark: [null, null, null], cap: '① readLine 抛出 IOException' },
    { live: [1, 1, 1], at: 2, mark: [null, null, 'no'], cap: '② readLine 里没有对应的 catch' },
    { live: [1, 1, 0], at: 1, mark: [null, 'no', null], cap: '③ readLine 出栈，回到 load：也没有' },
    { live: [1, 0, 0], at: 0, mark: ['ok', null, null], cap: '④ load 出栈，回到 main：catch (IOException e) 匹配' },
  ];
  const { kt, T } = frames([3.2, 2, 2, 2.4, 3]);
  let o = text(X, 22, 'call stack（新的在上）', 'tb', 'start');
  fr.forEach(([n, code], i) => {
    const y = Y(i);
    o += g(rect(X, y, W, H, 'paper', 4) + text(X + 10, y + 18, n, 'tb', 'start') + text(X + 10, y + 36, esc(code), 'ts', 'start'), S.map((s) => !!s.live[i]), kt, T);
    o += g(text(X + W + 14, y + 27, '✗ 没有 handler', 'ts', 'start'), S.map((s) => s.mark[i] === 'no'), kt, T);
    o += g(rect(X - 3, y - 3, W + 6, H + 6, 'ln', 6) + text(X + W + 14, y + 27, '✓ catch', 'tl', 'start'), S.map((s) => s.mark[i] === 'ok'), kt, T);
  });
  // exception 标记
  [0, 1, 2].forEach((i) => { o += g(rect(X + W - 92, Y(i) + 8, 82, 26, 'solid', 13) + text(X + W - 51, Y(i) + 26, 'exception', 'tw', 'middle'), S.map((s) => s.at === i), kt, T); });
  o += arrow(500, 230, 500, 120, 'mute') + text(508, 180, '往回找', 'ts', 'start');
  S.forEach((s, i) => { o += g(text(20, 280, s.cap, i ? 'tl' : 'ts', 'start'), S.map((_, j) => j === i), kt, T); });
  return svgA(560, 290, o, '动图：main 调用 load，load 调用 readLine；readLine 抛出 IOException，runtime 沿 call stack 往回找，readLine 和 load 都没有 handler，最后 main 的 catch 接住');
}

// ---------- referential integrity（动图） ----------
function refint() {
  const X = { james: 70, jean: 280, yong: 490 };
  const rows = [{ y: 72, title: '普通 setter' }, { y: 212, title: 'defensive setter' }];
  // 每帧每行的链接：[from, to]（girlfriend：男→女；boyfriend：女→男）
  const L = [
    [[['james', 'jean'], ['jean', 'yong']], [['yong', 'jean'], ['jean', 'yong']]],
    [[], []],
    [[['james', 'jean']], [['james', 'jean'], ['jean', 'james']]],
    [[['james', 'jean'], ['jean', 'yong']], [['yong', 'jean'], ['jean', 'yong']]],
  ];
  const caps = ['最终状态：上面 james 指向 jean、jean 却指向 yong；下面两端一致', '开始：三个人都没有链接', '执行 james.setGirlfriend(jean)', '执行 jean.setBoyfriend(yong)'];
  const { kt, T } = frames([3.4, 1.8, 2.6, 3.2]);
  let o = '';
  rows.forEach((r, ri) => {
    o += text(14, r.y - 44, r.title, 'tb', 'start');
    for (const [k, x] of Object.entries(X)) o += obox(x - 50, r.y - 14, 100, 28, k + (k === 'jean' ? ':Woman' : ':Man'));
    const all = [['james', 'jean'], ['jean', 'james'], ['yong', 'jean'], ['jean', 'yong']];
    for (const [a, b] of all) {
      const x1 = X[a], x2 = X[b], up = a !== 'jean';
      const y = up ? r.y - 14 : r.y + 14, bulge = up ? -26 : 26;
      const xa = x1 + (x2 > x1 ? 20 : -20), xb = x2 + (x2 > x1 ? -20 : 20);
      const dd = `M${xa} ${y}C${xa} ${y + bulge} ${xb} ${y + bulge} ${xb} ${y + (up ? -2 : 2)}`;
      const lab = up ? 'girlfriend' : 'boyfriend';
      const body = path(dd, 'ink') + head(xb, y + bulge, xb, y, 'fill', 8) + text((xa + xb) / 2, y + bulge + (up ? -2 : 13), lab, 'ts', 'middle');
      o += g(body, L.map((fr) => fr[ri].some(([p, q]) => p === a && q === b)), kt, T);
    }
  });
  o += g(text(175, 112, 'jean 没有指回 james', 'tl', 'middle'), [true, false, false, true], kt, T);
  caps.forEach((c, i) => { o += g(text(280, 300, c, i ? 'tl' : 'ts', 'middle'), caps.map((_, j) => j === i), kt, T); });
  return svgA(560, 308, o, '动图：先执行 james.setGirlfriend(jean)，再执行 jean.setBoyfriend(yong)。普通 setter 下 james 仍指向 jean，jean 却指向 yong；defensive setter 下 james 被解除，jean 与 yong 互相指向');
}

// ---------- 第 10 站：stub ----------
function stub() {
  let o = text(132, 18, '依赖真的 DatabaseStorage', 'tb', 'middle') + text(422, 18, '注入 StorageStub', 'tb', 'middle');
  const bx = (x, y, w, s, cls = 'paper') => rect(x, y, w, 30, cls, 4) + text(x + w / 2, y + 20, s, 't', 'middle');
  o += bx(70, 40, 120, 'test') + bx(70, 100, 120, 'Logic') + bx(55, 160, 150, 'DatabaseStorage', 'wash2');
  o += arrow(130, 70, 130, 98, 'ink') + arrow(130, 130, 130, 158, 'ink') + arrow(130, 190, 130, 210, 'ink');
  o += cyl(105, 212, 50, 34, '');
  o += text(170, 236, '连不上？数据变了？', 'ts', 'start') + text(170, 252, '它自己有 bug？', 'ts', 'start');
  o += line(280, 30, 280, 260, 'grid');
  o += bx(362, 40, 120, 'test') + bx(362, 100, 120, 'Logic') + bx(347, 160, 150, 'StorageStub', 'wash');
  o += arrow(422, 70, 422, 98, 'ink') + arrow(422, 130, 422, 158, 'ink');
  o += text(422, 212, 'getName(5) → "Adam"', 't', 'middle') + text(422, 230, '其余输入一律 throw', 'ts', 'middle');
  o += text(422, 252, '测试结果只取决于 Logic', 'tl', 'middle');
  return svg(560, 262, o, '左：test 调用 Logic，Logic 依赖真的 DatabaseStorage 和数据库，失败可能来自数据库。右：Logic 被注入 StorageStub，它对 5 返回 Adam，测试结果只取决于 Logic');
}

// ---------- CFG（动图） ----------
function cfg() {
  const N = { in: [150, 24], 2: [150, 74], 3: [60, 134], 5: [230, 124], 6: [230, 174], 7: [160, 234], 9: [300, 234], out: [150, 290] };
  const E = [['in', 2], [2, 3, 'T'], [2, 5, 'F'], [5, 6], [6, 7, 'T'], [6, 9, 'F'], [3, 'out'], [7, 'out'], [9, 'out']];
  const paths = [['in', 2, 3, 'out'], ['in', 2, 5, 6, 7, 'out'], ['in', 2, 5, 6, 9, 'out']];
  const inputs = ['0', '−5', '8'], outs = ['返回 0', 'cap = −20，返回 −1', 'cap = 12，返回 12'];
  const { kt, T } = frames([3, 2.6, 2.6, 2.6]);
  const r = 15;
  const edgeD = (a, b) => { const [x1, y1] = N[a], [x2, y2] = N[b], t = Math.atan2(y2 - y1, x2 - x1); return [x1 + r * Math.cos(t), y1 + r * Math.sin(t), x2 - (r + 1) * Math.cos(t), y2 - (r + 1) * Math.sin(t)]; };
  let o = '';
  for (const [a, b, lab] of E) {
    const [x1, y1, x2, y2] = edgeD(a, b);
    o += line(x1, y1, x2 - 3 * Math.cos(Math.atan2(y2 - y1, x2 - x1)), y2 - 3 * Math.sin(Math.atan2(y2 - y1, x2 - x1)), 'ink') + head(x1, y1, x2, y2, 'fill', 8);
    if (lab) o += text((x1 + x2) / 2 + (x2 < x1 ? -10 : 10), (y1 + y2) / 2, lab, 'ts', x2 < x1 ? 'end' : 'start');
  }
  for (const [k, [x, y]] of Object.entries(N)) o += circle(x, y, r, 'paper') + text(x, y + 5, String(k), k === 'in' || k === 'out' ? 'ts' : 'tb', 'middle');
  o += text(178, 66, 'input == 0', 'ts', 'start') + text(250, 178, 'cap < 0', 'ts', 'start');
  paths.forEach((p, i) => {
    let body = '';
    for (let j = 0; j + 1 < p.length; j++) { const [x1, y1, x2, y2] = edgeD(p[j], p[j + 1]); body += line(x1, y1, x2, y2, 'ln'); }
    for (const k of p) body += circle(N[k][0], N[k][1], r + 3, 'ln');
    o += g(body, [0, 1, 2, 3].map((j) => j === i + 1), kt, T);
  });
  // 右侧表
  const X = 360;
  o += text(X, 40, '路径', 'tb', 'start') + text(X + 110, 40, 'input', 'tb', 'start');
  paths.forEach((p, i) => {
    const y = 80 + i * 70;
    const s = p.map((k) => (k === 'in' ? 'enter' : k === 'out' ? 'exit' : k)).join(' → ');
    o += text(X, y, s.length > 22 ? s.slice(0, s.indexOf('→', 12) + 1) : s, 't', 'start');
    if (s.length > 22) o += text(X + 12, y + 17, s.slice(s.indexOf('→', 12) + 2), 't', 'start');
    o += text(X + 180, y, inputs[i], 'tb', 'end');
    o += text(X, y + 36, outs[i], 'ts', 'start');
    o += g(rect(X - 8, y - 18, 196, 62, 'ln', 6), [0, 1, 2, 3].map((j) => j === i + 1), kt, T);
  });
  return svgA(560, 304, o, '动图：findRate 的 control flow graph，节点是行号。三条路径依次点亮：输入 0 走 2、3；输入负五走 2、5、6、7；输入 8 走 2、5、6、9');
}

// ---------- 第 11 站：isValidMonth 的 EP 与 BVA（动图） ----------
function ep() {
  const sx = lin(-3, 16, 30, 540), Y = 110;
  const { kt, T } = frames([3.5, 4]);
  let o = '';
  o += rect(sx(-3), Y - 24, sx(0.5) - sx(-3), 48, 'wash2') + rect(sx(0.5), Y - 24, sx(12.5) - sx(0.5), 48, 'wash') + rect(sx(12.5), Y - 24, sx(16) - sx(12.5), 48, 'wash2');
  o += text((sx(-3) + sx(0.5)) / 2, Y - 34, '[MIN_INT .. 0]', 'ts', 'middle') + text((sx(0.5) + sx(12.5)) / 2, Y - 34, '[1 .. 12]  返回 true', 'tl', 'middle') + text((sx(12.5) + sx(16)) / 2, Y - 34, '[13 .. MAX_INT]', 'ts', 'middle');
  o += line(sx(-3), Y, sx(16), Y, 'axis');
  for (let t = -2; t <= 15; t++) o += line(sx(t), Y - 3, sx(t), Y + 3, 'axis');
  const tv = [[0, 1], [1, 1], [2, 0], [6, 0], [11, 0], [12, 1], [13, 0]];
  for (const [v, b] of tv) o += circle(sx(v), Y, 5, b ? 'ink-f' : 'paper') + text(sx(v), Y + 22, String(v), 'ts', 'middle');
  o += text(30, 22, '实心：boundary value；空心：非边界值', 'ts', 'start');
  // 第二帧：写错的实现
  const Y2 = 186;
  let bad = text(30, Y2 - 22, '一个写错的实现：m >= 1 && m < 12 才返回 true', 'tl', 'start');
  bad += rect(sx(0.5), Y2 - 8, sx(11.5) - sx(0.5), 16, 'wash-strong') + text(sx(11.5) + 6, Y2 + 5, '接受 1 .. 11', 'ts', 'start');
  for (const [v, ok] of [[3, 1], [6, 1], [9, 1], [12, 0]]) bad += text(sx(v), Y2 + 30, ok ? '✓' : '✗', ok ? 't' : 'tl', 'middle') + text(sx(v), Y2 + 46, String(v), 'ts', 'middle');
  bad += text(sx(12) + 12, Y2 + 38, '只有 12 抓到它', 'tl', 'start');
  o += g(bad, [false, true], kt, T);
  o += g(text(30, Y2 + 10, '三个 EP 各取几个值；边界上和边界两侧的值优先', 'ts', 'start'), [true, false], kt, T);
  return svgA(560, 240, o, '动图：isValidMonth 的三个 equivalence partition 画在数轴上，0、1、12、13 附近是 boundary value；第二帧显示写错的实现只接受 1 到 11，测 3、6、9 都通过，只有 12 失败');
}

// ---------- all pairs 的覆盖表 ----------
function pairs() {
  const tc = [['a', 1, 'T'], ['a', 2, 'T'], ['a', 3, 'F'], ['b', 1, 'F'], ['b', 2, 'T'], ['b', 3, 'F'], ['c', 1, 'T'], ['c', 2, 'F'], ['c', 3, 'T']];
  const V = { p1: ['a', 'b', 'c'], p2: [1, 2, 3], p3: ['T', 'F'] }, idx = { p1: 0, p2: 1, p3: 2 };
  let o = '';
  const grid = (x0, y0, A, B) => {
    const cw = 50, ch = 30;
    let q = text(x0 + 30 + (V[B].length * cw) / 2, y0 - 8, A + ' × ' + B, 'tb', 'middle');
    V[B].forEach((b, j) => { q += text(x0 + 30 + j * cw + cw / 2, y0 + 14, String(b), 'ts', 'middle'); });
    V[A].forEach((a, i) => {
      const y = y0 + 22 + i * ch;
      q += text(x0 + 20, y + 20, String(a), 'ts', 'end');
      V[B].forEach((b, j) => {
        const hits = tc.map((t, k) => (t[idx[A]] === a && t[idx[B]] === b ? k + 1 : 0)).filter(Boolean);
        q += rect(x0 + 30 + j * cw, y, cw, ch, hits.length ? 'wash' : 'paper-f') + rect(x0 + 30 + j * cw, y, cw, ch, 'frame');
        q += text(x0 + 30 + j * cw + cw / 2, y + 20, hits.join(', '), 't', 'middle');
      });
    });
    return q;
  };
  o += grid(0, 30, 'p1', 'p2') + grid(200, 30, 'p1', 'p3') + grid(360, 30, 'p2', 'p3');
  o += text(280, 160, '21 格全部被覆盖；只用 9 个 test case', 'ts', 'middle');
  return svg(560, 168, o, '三张值对表：p1 与 p2 的 9 格、p1 与 p3 的 6 格、p2 与 p3 的 6 格，每格里写着覆盖它的 test case 编号，全部非空');
}

export default {
  'cs2103-lost': lost,
  'cs2103-gitdag': gitdag,
  'cs2103-rebase': rebase,
  'cs2103-fork': fork,
  'cs2103-seqiter': seqiter,
  'cs2103-pert': pert,
  'cs2103-gantt': gantt,
  'cs2103-ucflow': ucflow,
  'cs2103-classbox': classbox,
  'cs2103-boxclass': boxclass,
  'cs2103-relations': relations,
  'cs2103-seq': seq,
  'cs2103-seqloop': seqloop,
  'cs2103-activity': activity,
  'cs2103-ripple': ripple,
  'cs2103-dip': dip,
  'cs2103-command': command,
  'cs2103-abstocc': abstocc,
  'cs2103-observer': observer,
  'cs2103-arch': arch,
  'cs2103-integ': integ,
  'cs2103-stack': stack,
  'cs2103-refint': refint,
  'cs2103-stub': stub,
  'cs2103-cfg': cfg,
  'cs2103-ep': ep,
  'cs2103-pairs': pairs,
};
