import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, apath, ashow, f1 } from '../lib/svg.mjs';

const R = Math.PI / 180;

// 一个简单的 neutral face（不是任何影片里的角色）
function face(cx, cy, s) {
  return `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(s * 0.72)}" ry="${f1(s)}" class="paper"/>` +
    circle(cx - s * 0.28, cy - s * 0.15, Math.max(1.4, s * 0.09), 'ink-f') + circle(cx + s * 0.28, cy - s * 0.15, Math.max(1.4, s * 0.09), 'ink-f') +
    line(cx - s * 0.25, cy + s * 0.42, cx + s * 0.25, cy + s * 0.42, 'ink');
}

// ---------- 第 1 站：Kuleshov effect 的 design（Calbi et al. 2017） ----------
function kuleshov() {
  const sx = lin(0, 6, 20, 320);
  let o = text(20, 16, '每一行是一个 6 s 的 sequence：face 1.5 s → scene 3 s → 同一张 face 1.5 s', 'ts');
  const rows = [
    ['neutral scene', 'baseline（对照）', '分类时最多人选 sadness 25.0%', 'wash2'],
    ['fearful scene', 'valence 低 1.25，arousal 高 1.29', '最多人选 fear 24.4%、sadness 22.6%', 'wash'],
    ['happy scene', '和 neutral 没有显著差别', '选 happiness 的占 35.7%', 'wash'],
  ];
  rows.forEach(([scene, r1, r2, cls], i) => {
    const y = 34 + i * 66, h = 48;
    o += rect(sx(0), y, sx(6) - sx(0), h, 'wash2');
    for (let k = 0; k < 30; k++) o += rect(sx(0) + 4 + k * 10, y + 2, 5, 4, 'paper-f') + rect(sx(0) + 4 + k * 10, y + h - 6, 5, 4, 'paper-f');
    const fr = (t0, t1, c) => rect(sx(t0) + 2, y + 9, sx(t1) - sx(t0) - 4, h - 18, c, 2);
    o += fr(0, 1.5, 'paper') + face((sx(0) + sx(1.5)) / 2, y + h / 2, 11);
    o += fr(1.5, 4.5, 'paper') + rect(sx(1.5) + 2, y + 9, sx(4.5) - sx(1.5) - 4, h - 18, cls, 2) + text((sx(1.5) + sx(4.5)) / 2, y + h / 2 + 5, scene, 'tb', 'middle');
    o += fr(4.5, 6, 'paper') + face((sx(4.5) + sx(6)) / 2, y + h / 2, 11);
    o += text(336, y + (r2 ? 20 : 29), r1, i === 1 ? 'tl' : 't');
    if (r2) o += text(336, y + 39, r2, 'ts');
  });
  o += text(20, 246, '两张 face 是同一段 footage。右边是第二张 face 的 rating 和 neutral 那一行相比的差。', 'ts');
  o += text(20, 263, 'Calbi et al. 2017：28 名 participant；valence 量表 −4 到 +4，arousal 量表 1 到 9。', 'ts');
  return svg(560, 270, o, 'Kuleshov 实验的三种 sequence：同一张 neutral face 夹着 neutral、fearful、happy 三种 scene；fearful 那一组的 face 被评得更负面、更 aroused，happy 那一组和 neutral 没有显著差别');
}

// ---------- 第 2 站：three-point lighting 与 lighting ratio ----------
function lighting() {
  let o = text(130, 16, 'Top view', 'tb', 'middle');
  const S = [130, 118];
  // camera
  o += rect(112, 222, 36, 22, 'paper', 3) + poly([[122, 222], [138, 222], [134, 212], [126, 212]], 'paper') + text(130, 260, 'camera', 'ts', 'middle');
  // 灯：一个小盒子 + 灯口，朝向 subject
  const lamp = (x, y, lab, tx, ty, anc) => {
    const a = Math.atan2(S[1] - y, S[0] - x);
    const c = Math.cos(a), s = Math.sin(a);
    const P = (u, v) => [x + u * c - v * s, y + u * s + v * c];
    let q = poly([P(-10, -8), P(6, -8), P(6, 8), P(-10, 8)], 'paper') + poly([P(6, -8), P(14, -13), P(14, 13), P(6, 8)], 'wash');
    q += arrow(...P(18, 0), S[0] - 22 * c, S[1] - 22 * s, 'mute', 6);
    return q + text(tx, ty, lab, 'tb', anc);
  };
  o += lamp(S[0] - 92, S[1] + 70, 'key light', S[0] - 92, S[1] + 102, 'middle');
  o += lamp(S[0] + 96, S[1] + 52, 'fill light', S[0] + 96, S[1] + 84, 'middle');
  o += lamp(S[0] + 60, S[1] - 84, 'back light', S[0] + 80, S[1] - 84, 'start');
  o += circle(S[0], S[1], 16, 'paper') + poly([[S[0] - 5, S[1] + 15], [S[0], S[1] + 23], [S[0] + 5, S[1] + 15]], 'ink-f');
  o += text(S[0] - 22, S[1] - 6, 'subject', 'ts', 'end');
  // 两个 head：key 从 camera 左前方 45° 打来
  const head = (cx, cy, r, shadowCls, t1, t2, t3) => {
    let q = circle(cx, cy, r, 'paper');
    const pts = [];
    for (let k = 0; k <= 40; k++) { const t = (-90 + 180 * k / 40) * R; pts.push([cx + r * Math.cos(t) / Math.SQRT2, cy - r * Math.sin(t)]); }
    for (let k = 0; k <= 40; k++) { const t = (90 - 180 * k / 40) * R; pts.push([cx + r * Math.cos(t), cy - r * Math.sin(t)]); }
    q += path(d(pts) + 'Z', shadowCls) + circle(cx, cy, r, 'ink');
    q += text(cx, cy + r + 22, t1, 'tb', 'middle') + text(cx, cy + r + 39, t2, 'ts', 'middle') + text(cx, cy + r + 55, t3, 'ts', 'middle');
    return q;
  };
  o += text(415, 16, '从 camera 看过去（key 从左前方 45°）', 'tb', 'middle');
  o += head(350, 100, 44, 'wash2', 'high-key', 'fill = key', 'lit : shadow = 2 : 1');
  o += head(480, 100, 44, 'solid2', 'low-key', 'fill = key 的 1/7', 'lit : shadow = 8 : 1');
  o += text(415, 236, 'lit side 收到 key + fill，shadow side 只收到 fill', 'ts', 'middle');
  o += text(415, 252, 'ratio = (key + fill) ÷ fill', 'ts', 'middle');
  return svg(560, 262, o, '左边是 three-point lighting 的俯视机位图：key light 在 camera 左前方，fill light 在右前方，back light 在 subject 后方；右边两个 head 显示 high-key 时 shadow side 很浅，low-key 时 shadow side 很暗');
}

// ---------- 第 2 站：Greed 的婚礼与窗外的送葬行列（multiplane composition） ----------
function greed() {
  let o = '';
  const X0 = 20, Y0 = 20, W = 400, H = 225;
  o += rect(X0, Y0, W, H, 'wash2');
  // 后墙上的窗：窗外是街道
  const wx = 150, wy = 44, ww = 140, wh = 92;
  o += rect(wx, wy, ww, wh, 'paper-f') + line(wx, wy + 62, wx + ww, wy + 62, 'axis');
  // 送葬行列：一辆灵车加几个小人，从左往右走
  const hx = wx + 30, hy = wy + 62;
  o += rect(hx, hy - 20, 34, 16, 'ink-f') + rect(hx + 6, hy - 25, 22, 5, 'ink-f');
  o += circle(hx + 7, hy - 3, 3.4, 'paper') + circle(hx + 27, hy - 3, 3.4, 'paper');
  o += rect(hx + 38, hy - 16, 14, 10, 'ink-f') + line(hx + 38, hy - 6, hx + 36, hy, 'ink') + line(hx + 50, hy - 6, hx + 52, hy, 'ink');
  for (let k = 0; k < 4; k++) { const px = hx - 8 - k * 9; o += circle(px, hy - 15, 2.2, 'ink-f') + rect(px - 2, hy - 13, 4, 12, 'ink-f'); }
  o += rect(wx, wy, ww, wh, 'ink') + line(wx + ww / 2, wy, wx + ww / 2, wy + wh, 'ink');
  o += line(X0, Y0 + 150, X0 + W, Y0 + 150, 'mute');
  // 前景：新郎、新娘、主持婚礼的人，比窗外的人大得多
  const fig = (x, top, w, cls) => circle(x, top + 11, 11, 'paper') + path(d([[x - w, top + 26], [x + w, top + 26], [x + w + 4, Y0 + H], [x - w - 4, Y0 + H]]) + 'Z', cls);
  o += fig(110, 128, 15, 'paper') + fig(330, 136, 14, 'paper');
  // 新娘：白色的长纱
  o += circle(205, 141, 11, 'paper') + path(d([[193, 156], [217, 156], [236, Y0 + H], [174, Y0 + H]]) + 'Z', 'paper');
  o += path(d([[196, 133], [214, 133], [242, Y0 + H], [168, Y0 + H]]) + 'Z', 'wash');
  o += circle(205, 141, 11, 'paper');
  o += circle(252, 139, 11, 'paper') + path(d([[238, 154], [266, 154], [270, Y0 + H], [234, Y0 + H]]) + 'Z', 'ink-f');
  // 标注
  const lx = 434;
  o += text(lx, 70, 'background（窗外）', 'tb') + text(lx, 88, '送葬的行列经过', 't') + text(lx, 106, '人只有指头大', 'ts');
  o += line(wx + ww + 2, 90, lx - 6, 84, 'axis');
  o += text(lx, 186, 'foreground', 'tb') + text(lx, 204, '婚礼正在举行', 't') + text(lx, 222, '人占了半个画面高', 'ts');
  o += line(352, 200, lx - 6, 200, 'axis');
  o += text(X0, 266, '一个 frame、两个平面：婚礼和葬礼在 story 里无关，构图让它们互相评论。', 'ts');
  return svg(560, 272, o, '示意图：一个室内的 frame，前景是新郎、白纱的新娘和主持婚礼的人，后墙的窗外远处一辆灵车和几个送葬的人正经过；右边标出 foreground 是婚礼，background 是送葬行列');
}

// ---------- 第 3 站：shot scale ----------
function scale() {
  const H = 200, y0 = 50, cx = 215, Y = (u) => y0 + u * H;
  let o = '';
  // 人
  o += poly([[cx - 22, Y(0.18)], [cx + 22, Y(0.18)], [cx + 15, Y(0.45)], [cx + 17, Y(0.52)], [cx - 17, Y(0.52)], [cx - 15, Y(0.45)]], 'paper');
  o += poly([[cx - 22, Y(0.18)], [cx - 28, Y(0.2)], [cx - 30, Y(0.5)], [cx - 23, Y(0.5)], [cx - 21, Y(0.27)]], 'paper');
  o += poly([[cx + 22, Y(0.18)], [cx + 28, Y(0.2)], [cx + 30, Y(0.5)], [cx + 23, Y(0.5)], [cx + 21, Y(0.27)]], 'paper');
  o += poly([[cx - 17, Y(0.52)], [cx - 1, Y(0.52)], [cx - 3, Y(1)], [cx - 14, Y(1)]], 'paper') + poly([[cx + 1, Y(0.52)], [cx + 17, Y(0.52)], [cx + 14, Y(1)], [cx + 3, Y(1)]], 'paper');
  o += rect(cx - 4, Y(0.12), 8, Y(0.18) - Y(0.12), 'paper');
  o += face(cx, Y(0.065), 0.065 * H);
  // 16:9 的 frame：[top, bottom]（以身高为单位）
  const F = [['ECU', 0.035, 0.095], ['CU', -0.04, 0.21], ['MCU', -0.05, 0.33], ['MS', -0.06, 0.48], ['MLS', -0.07, 0.74], ['LS', -0.08, 1.04]];
  for (const [lab, t, b] of F) {
    const h = (b - t) * H, w = h * 16 / 9;
    o += rect(cx - w / 2, Y(t), w, h, lab === 'LS' ? 'ink' : 'mute');
    if (lab === 'ECU') o += line(cx + w / 2 + 1, Y(0.065), cx + 15, Y(0.065), 'axis') + text(cx + 17, Y(0.065) + 4, 'ECU', 'ts', 'start');
    else if (lab === 'CU') o += text(cx - w / 2 + 4, Y(t) + 13, lab, 'ts', 'start');
    else o += text(cx - w / 2 + 4, Y(b) - 6, lab, 'ts', 'start');
  }
  o += text(cx, 22, '同一个人，frame 的下边缘切在哪里决定 scale', 'ts', 'middle');
  // ELS 小图
  const X0 = 432, W = 124, Hh = W * 9 / 16, T0 = 120;
  o += rect(X0, T0, W, Hh, 'ink') + poly([[X0, T0 + 44], [X0 + 30, T0 + 22], [X0 + 52, T0 + 38], [X0 + 84, T0 + 14], [X0 + W, T0 + 40], [X0 + W, T0 + 46], [X0, T0 + 46]], 'wash2');
  o += line(X0, T0 + 46, X0 + W, T0 + 46, 'axis');
  o += rect(X0 + 70, T0 + 48, 2.4, 8, 'ink-f') + circle(X0 + 71.2, T0 + 46.4, 1.6, 'ink-f');
  o += text(X0 + W / 2, T0 - 10, 'ELS', 'tb', 'middle') + text(X0 + W / 2, T0 + Hh + 18, '人只有 frame 高度的约 1/6', 'ts', 'middle') + text(X0 + W / 2, T0 + Hh + 34, '环境成了主体', 'ts', 'middle');
  return svg(560, 268, o, '一个站立的人和六个嵌套的 16 比 9 frame：extreme close-up 只框眼睛，close-up 框头部，medium close-up 到胸口，medium shot 到腰，medium long shot 到膝盖，long shot 框全身；右边小图是 extreme long shot，人只占画面高度的约六分之一');
}

// ---------- 第 3 站：depth of field 随 focal length 与 f-number 变化（动图） ----------
const C = 0.03; // circle of confusion，mm
function dofOf(f, N, s) {
  const Hm = f * f / (N * C), near = s * Hm / (Hm + (s - f)), far = Hm - (s - f) > 0 ? s * Hm / (Hm - (s - f)) : Infinity;
  return [near / 1000, far / 1000];
}
const blurOf = (f, N, s, dd) => f * f / (N * (s - f)) * Math.abs(dd - s) / dd / C;
function dofA() {
  const steps = [[50, 2], [50, 8], [50, 22], [25, 8], [24, 11]], D = [1.5, 3, 10], s = 3000;
  const n = steps.length, T = 2.6 * n, kt = [...steps.map((_, i) => i / n), 1];
  const sx = lin(0, 12, 74, 540), G = 186;
  let o = '';
  const zones = steps.map(([f, N]) => dofOf(f, N, s));
  const band = ([a, b]) => d([[sx(a), 70], [sx(Math.min(b, 12)), 70], [sx(Math.min(b, 12)), G], [sx(a), G]]) + 'Z';
  o += apath([...zones.map(band), band(zones[n - 1])], kt, T, 'wash', true);
  // 距离轴
  o += line(sx(0), G, sx(12), G, 'axis');
  for (let m = 0; m <= 12; m += 2) o += line(sx(m), G, sx(m), G + 4, 'axis') + text(sx(m), G + 17, m + (m === 12 ? ' m' : ''), 'ts', 'middle');
  // camera
  o += rect(24, 112, 36, 26, 'paper', 3) + poly([[60, 116], [74, 110], [74, 140], [60, 134]], 'paper') + text(46, 156, 'camera', 'ts', 'middle');
  o += line(74, 125, sx(3), 125, 'grid');
  // 三个 subject
  const person = (x, cls) => {
    const top = 96;
    return `<ellipse cx="${f1(x)}" cy="${top + 9}" rx="7" ry="9" class="${cls}"/>` + path(d([[x - 11, top + 22], [x + 11, top + 22], [x + 8, top + 56], [x + 6, G], [x - 6, G], [x - 8, top + 56]]) + 'Z', cls);
  };
  const names = ['foreground', 'focus 在这里', 'background'];
  D.forEach((m, j) => {
    const sharp = steps.map(([f, N]) => blurOf(f, N, s, m * 1000) <= 1);
    o += `<g>${person(sx(m), 'paper')}${ashow([...sharp, sharp[n - 1]], kt, T)}</g>`;
    o += `<g>${person(sx(m), 'dash')}${ashow([...sharp.map((v) => !v), !sharp[n - 1]], kt, T)}</g>`;
    o += text(j === 0 ? sx(m) + 12 : j === 1 ? sx(m) - 12 : sx(m), G + 34, names[j] + ' ' + m + ' m', j === 1 ? 'tb' : 'ts', j === 0 ? 'end' : j === 1 ? 'start' : 'middle');
    steps.forEach(([f, N], i) => {
      const b = blurOf(f, N, s, m * 1000);
      if (m === 3) return;
      const on = steps.map((_, k) => k === i); on.push(i === n - 1);
      o += `<text x="${f1(sx(m))}" y="86" class="${b <= 1 ? 'ts' : 'tl'}" text-anchor="middle">${b <= 1 ? 'sharp' : 'blur ' + b.toFixed(1) + '×'}${ashow(on, kt, T)}</text>`;
    });
  });
  steps.forEach(([f, N], i) => {
    const [a, b] = zones[i];
    const on = steps.map((_, k) => k === i); on.push(i === n - 1);
    const rng = a.toFixed(2) + ' m 到 ' + (b === Infinity ? '∞' : b.toFixed(2) + ' m');
    o += `<text x="20" y="22" class="tb" text-anchor="start">${f} mm lens，f/${N}：sharp zone 是 ${rng}${ashow(on, kt, T)}</text>`;
  });
  o += text(20, 44, 'blur 写的是 blur circle 是 0.03 mm 的几倍；不超过 1 倍就算 sharp。', 'ts');
  o += text(20, 254, '同一个 3 m 的 focus：f-number 越大、focal length 越短，sharp zone 越深。', 'ts');
  return svgA(560, 262, o, '动图：camera 对焦在 3 米，前景 1.5 米、背景 10 米各站一个人；50 毫米 f/2 时 sharp zone 只有 2.80 到 3.23 米，前后两人都糊；换成 f/8、f/22 逐渐变深；25 毫米 f/8 时从 1.40 米到无穷远都清楚；24 毫米 f/11 时从 1.11 米到无穷远都清楚');
}

// ---------- 第 4 站：180° rule（动图） ----------
function axisA() {
  const A = [110, 150], B = [210, 150];
  const cams = [
    { p: [160, 262], look: [160, 150], lab: '1', who: 'AB', cap: ['1. Establishing shot：A 在左，B 在右'] },
    { p: [48, 212], look: B, lab: '2', who: 'B', cap: ['2. 拍 B：B 看向画面左边'] },
    { p: [272, 212], look: A, lab: '3', who: 'A', cap: ['3. Reverse shot：A 看向画面右边', '两人的视线在 cut 前后接得上'] },
    { p: [272, 88], look: A, lab: '3′', who: 'A', cap: ['3′. 机位越过 axis：A 也看向画面左边', '和 2 里的 B 同一方向，像是看着同一处'] },
  ];
  const n = cams.length, T = 2.8 * n, kt = [...cams.map((_, i) => i / n), 1];
  const onAt = (i) => { const a = cams.map((_, k) => k === i); a.push(i === n - 1); return a; };
  let o = text(150, 18, 'Top view', 'tb', 'middle');
  o += line(14, 150, 296, 150, 'ln-dash') + text(294, 132, 'axis of action', 'tl', 'end');
  o += path(d([[14, 150], [296, 150], [296, 286], [14, 286]]) + 'Z', 'wash2');
  o += text(22, 280, '机位只放在这半边', 'ts');
  const person = (P, dir) => circle(P[0], P[1], 13, 'paper') + poly([[P[0] + dir * 12, P[1] - 5], [P[0] + dir * 21, P[1]], [P[0] + dir * 12, P[1] + 5]], 'ink-f');
  o += person(A, 1) + text(A[0], A[1] + 5, 'A', 'tb', 'middle') + person(B, -1) + text(B[0], B[1] + 5, 'B', 'tb', 'middle');
  cams.forEach((c, i) => {
    const a = Math.atan2(c.look[1] - c.p[1], c.look[0] - c.p[0]), co = Math.cos(a), si = Math.sin(a);
    const P = (u, v) => [c.p[0] + u * co - v * si, c.p[1] + u * si + v * co];
    const body = d([P(-12, -9), P(6, -9), P(6, 9), P(-12, 9)]) + 'Z', lens = d([P(6, -5), P(14, -9), P(14, 9), P(6, 5)]) + 'Z';
    o += path(body, 'paper') + path(lens, 'paper');
    o += `<g>${path(body, 'solid')}${path(lens, 'solid')}${ashow(onAt(i), kt, T)}</g>`;
    const lp = P(-24, 0);
    o += text(lp[0], lp[1] + 4, c.lab, 'tb', 'middle');
  });
  // 右边：这个机位拍到的画面
  const X0 = 324, W = 232, Hs = W * 9 / 16, Y0 = 40, half = Math.tan(32 * R);
  o += text(X0 + W / 2, 18, '这个机位拍到的画面', 'tb', 'middle');
  o += rect(X0, Y0, W, Hs, 'ink');
  const ppl = { A: [A, [1, 0]], B: [B, [-1, 0]] };
  cams.forEach((c, i) => {
    const a = Math.atan2(c.look[1] - c.p[1], c.look[0] - c.p[0]);
    const fw = [Math.cos(a), Math.sin(a)], rt = [-Math.sin(a), Math.cos(a)];
    let g = '';
    for (const k of c.who) {
      const [P, fc] = ppl[k];
      const v = [P[0] - c.p[0], P[1] - c.p[1]];
      const depth = v[0] * fw[0] + v[1] * fw[1], lat = v[0] * rt[0] + v[1] * rt[1];
      const x = X0 + W / 2 + (lat / depth) / half * (W / 2);
      const side = Math.sign(fc[0] * rt[0] + fc[1] * rt[1]);
      const r = c.who.length > 1 ? 17 : 26, cy = Y0 + Hs * 0.47;
      g += path(d([[x - r * 1.5, Y0 + Hs], [x - r * 1.3, cy + r * 1.1], [x + r * 1.3, cy + r * 1.1], [x + r * 1.5, Y0 + Hs]]) + 'Z', 'paper');
      g += circle(x, cy, r, 'paper') + poly([[x + side * r * 0.92, cy - 4], [x + side * (r + 8), cy + 2], [x + side * r * 0.92, cy + 8]], 'ink-f');
      g += circle(x + side * r * 0.45, cy - r * 0.2, 2.4, 'ink-f');
      g += text(x, cy + r * 1.1 + 18, k, 'tb', 'middle');
      g += arrow(x + side * (r + 12), cy - r - 2, x + side * (r + 34), cy - r - 2, 'ln', 6);
    }
    o += `<g opacity="${i === 0 ? 1 : 0}">${g}${ashow(onAt(i), kt, T)}</g>`;
    c.cap.forEach((s, k) => { o += `<text x="${X0}" y="${Y0 + Hs + 30 + k * 18}" class="${i === n - 1 ? 'tl' : 't'}" text-anchor="start" opacity="${i === 0 ? 1 : 0}">${s}${ashow(onAt(i), kt, T)}</text>`; });
  });
  return svgA(560, 292, o, '动图：俯视图里 A 和 B 面对面，两人之间的连线是 axis of action；机位 1、2、3 都在 axis 同一侧，A 总是朝画面右边看、B 朝左边看；机位 3 撇越过 axis 后，A 在画面里也朝左看，和 B 同一方向');
}

// ---------- 第 4 站：cross-cutting 的节奏（动图，构造的例子） ----------
function crossA() {
  const shots = [8, 7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1.2, 1];
  const fin = 6, tot = shots.reduce((a, b) => a + b, 0) + fin, speed = 2, T = tot / speed;
  const sx = lin(0, tot, 20, 540), Y = 150;
  let o = '';
  const starts = []; let t = 0;
  shots.forEach((s) => { starts.push(t); t += s; });
  const lineOf = (i) => (i === shots.length ? 'AB' : i % 2 === 0 ? 'A' : 'B');
  shots.forEach((s, i) => {
    const x0 = sx(starts[i]), x1 = sx(starts[i] + s);
    o += rect(x0, Y, x1 - x0, 30, i % 2 === 0 ? 'wash-strong' : 'wash2') + line(x0, Y, x0, Y + 30, 'ink');
    if (x1 - x0 > 14) o += text((x0 + x1) / 2, Y + 20, lineOf(i), 'tb', 'middle');
  });
  o += rect(sx(t), Y, sx(tot) - sx(t), 30, 'solid') + line(sx(t), Y, sx(t), Y + 30, 'ink') + text((sx(t) + sx(tot)) / 2, Y + 20, 'A + B', 'tw', 'middle');
  o += rect(sx(0), Y, sx(tot) - sx(0), 30, 'frame');
  for (let m = 0; m <= 50; m += 10) o += line(sx(m), Y + 30, sx(m), Y + 35, 'axis') + text(sx(m), Y + 48, m + ' s', 'ts', 'middle');
  const half = shots.length / 2, e1 = starts[half], a1 = shots.slice(0, half).reduce((a, b) => a + b) / half, a2 = shots.slice(half).reduce((a, b) => a + b) / half;
  const br = (u0, u1, s) => line(sx(u0) + 1, Y - 8, sx(u1) - 1, Y - 8, 'mute') + line(sx(u0) + 1, Y - 12, sx(u0) + 1, Y - 4, 'mute') + line(sx(u1) - 1, Y - 12, sx(u1) - 1, Y - 4, 'mute') + text((sx(u0) + sx(u1)) / 2, Y - 16, s, 'ts', 'middle');
  o += br(0, e1, '前 6 个 shot：ASL ' + a1.toFixed(1) + ' s') + br(e1, t, '后 6 个：ASL ' + a2.toFixed(1) + ' s');
  // 播放头：按真实时间（2 倍速）匀速走
  o += `<line x1="${sx(0)}" y1="${Y - 4}" x2="${sx(0)}" y2="${Y + 36}" class="ln">${anim('x1', [sx(0), sx(tot)].map(f1), [0, 1], T)}${anim('x2', [sx(0), sx(tot)].map(f1), [0, 1], T)}</line>`;
  // 上面的“银幕”：当前 shot 属于哪一条线
  const kts = [0], seqs = [0];
  shots.forEach((s, i) => { if (i) { kts.push(starts[i] / tot); seqs.push(i); } });
  kts.push(t / tot); seqs.push(shots.length); kts.push(1); seqs.push(shots.length);
  o += rect(170, 14, 220, 92, 'paper', 4);
  const lab = { A: ['A', 'station 里被困的 operator'], B: ['B', '赶来救援的 train'], AB: ['A + B', '两条线在同一个 frame 里会合'] };
  for (const k of ['A', 'B', 'AB']) {
    const on = seqs.map((i) => lineOf(i) === k);
    o += `<g opacity="${k === 'A' ? 1 : 0}">${text(280, 56, lab[k][0], 'tbig', 'middle')}${text(280, 82, lab[k][1], 'ts', 'middle')}${anim('opacity', on.map((v) => (v ? 1 : 0)), kts, T, true)}</g>`;
  }
  o += text(20, 222, '构造的例子：shot 长度从 8 s 逐个缩到 1 s。以 2 倍速播放。', 'ts');
  return svgA(560, 230, o, '动图：两条 line of action A 和 B 交替出现，shot 从 8 秒逐渐缩短到 1 秒，前 6 个 shot 的 average shot length 是 5.6 秒，后 6 个是 1.9 秒，最后一个 shot 两条线会合');
}

// ---------- 第 5 站：sound bridge ----------
function bridge() {
  let o = '';
  const sx = lin(0, 10, 110, 540);
  const row = (y, title, s0, s1) => {
    let q = text(20, y - 12, title, 'tb');
    q += text(20, y + 18, 'picture', 'ts') + rect(sx(0), y, sx(5) - sx(0), 28, 'wash2') + rect(sx(5), y, sx(10) - sx(5), 28, 'wash');
    q += text((sx(0) + sx(5)) / 2, y + 18, 'shot 1：scene 1', 't', 'middle') + text((sx(5) + sx(10)) / 2, y + 18, 'shot 2：scene 2', 't', 'middle');
    q += text(20, y + 54, 'sound', 'ts') + rect(sx(0), y + 36, sx(s0) - sx(0), 28, 'wash2') + rect(sx(s1), y + 36, sx(10) - sx(s1), 28, 'wash');
    q += text((sx(0) + sx(s0)) / 2, y + 54, 'scene 1 的 sound', 'ts', 'middle') + text((sx(s1) + sx(10)) / 2, y + 54, 'scene 2 的 sound', 'ts', 'middle');
    q += line(sx(5), y - 4, sx(5), y + 84, 'ink-b');
    return q;
  };
  o += row(30, 'Sound 先到（J-cut）：还看着 scene 1，已经听见 scene 2', 3.6, 3.6);
  o += text(sx(5) + 6, 110, 'cut', 'tb');
  o += row(150, 'Sound 拖后（L-cut）：已经看着 scene 2，还听见 scene 1', 6.6, 6.6);
  o += text(sx(5) - 6, 232, 'cut', 'tb', 'end');
  o += arrow(sx(3.6), 102, sx(5) - 4, 102, 'ln', 6) + text(sx(3.6) - 6, 106, '提前', 'tl', 'end');
  o += arrow(sx(6.6), 222, sx(5) + 4, 222, 'ln', 6) + text(sx(6.6) + 6, 226, '延后', 'tl', 'start');
  return svg(560, 236, o, '两个 sound bridge：上面 scene 2 的 sound 在 cut 之前就开始，下面 scene 1 的 sound 在 cut 之后还延续');
}

// ---------- 第 6 站：Hitchcock 的 bomb：surprise 与 suspense ----------
function bomb() {
  let o = '';
  // 桌子、两个人、桌下的 bomb
  o += rect(40, 96, 190, 10, 'paper') + rect(52, 106, 8, 84, 'paper') + rect(210, 106, 8, 84, 'paper');
  const sit = (x, dir) => circle(x, 62, 13, 'paper') + path(d([[x - 12, 78], [x + 12, 78], [x + 10, 132], [x - 10, 132]]) + 'Z', 'paper') + path(d([[x + dir * 10, 132], [x + dir * 34, 132], [x + dir * 34, 190]]), 'ink-b');
  o += sit(22, 1) + sit(248, -1);
  o += rect(112, 156, 46, 34, 'paper', 3) + circle(135, 173, 11, 'paper') + line(135, 173, 135, 165, 'ink') + line(135, 173, 141, 173, 'ink');
  o += text(135, 210, 'bomb，定在 1 点爆炸', 'tl', 'middle');
  o += line(10, 190, 270, 190, 'axis');
  // 两种讲法
  const sx = lin(0, 15, 300, 540);
  const tl = (y, title, cls, note1, note2) => {
    let q = text(300, y - 9, title, 'tb') + rect(sx(0), y, sx(15) - sx(0), 22, cls) + text(sx(7.5), y + 15, '15 min 的闲聊', 'ts', 'middle');
    q += poly([[sx(15), y - 4], [sx(15) + 8, y + 11], [sx(15), y + 26], [sx(15) - 8, y + 11]], 'solid') + text(sx(15), y - 9, '爆炸', 'tl', 'middle');
    return q + text(300, y + 42, note1, 'ts') + text(300, y + 58, note2, 'ts');
  };
  o += tl(46, 'Surprise：观众不知道有 bomb', 'wash2', '前 15 min 平淡；爆炸时观众', '只得到约 15 s 的 shock');
  o += tl(150, 'Suspense：开场先让观众看见 bomb', 'wash-strong', '观众知道、角色不知道，同样的', '闲聊每一句都变得紧张');
  return svg(560, 222, o, '左边是桌下放着 bomb 的两人对话场景；右边两条时间线：观众不知道 bomb 时只有爆炸那一下的 surprise，观众事先知道时整段 15 分钟的闲聊都变成 suspense');
}

// ---------- 第 6 站：Citizen Kane 的 plot 与 story ----------
function kane() {
  const P = ['开场：Kane 死于 Xanadu', 'Newsreel：一生的公开版本', 'Thatcher 的 memoir', 'Bernstein', 'Leland', 'Susan', 'Raymond（butler）', '结尾：sled 被烧'];
  const S = ['童年：Colorado，sled', '接手 Inquirer', '和 Emily 的婚姻', '遇到 Susan，竞选失败', 'Susan 的 opera（首演讲两次）', '1929 后卖报；Susan 离开', '死亡'];
  const map = [[6], [0, 1, 2, 3, 4, 5, 6], [0, 1, 5], [1, 2], [2, 3, 4], [4, 5], [5], [0]];
  const yP = (i) => 50 + i * 30, yS = (j) => 58 + j * 34;
  let o = text(110, 20, 'Plot：银幕上的顺序', 'tb', 'middle') + text(450, 20, 'Story：事件发生的顺序', 'tb', 'middle');
  map.forEach((js, i) => {
    if (i === 1) return;
    js.forEach((j) => { o += path(`M222 ${f1(yP(i))}C285 ${f1(yP(i))} 277 ${f1(yS(j))} 340 ${f1(yS(j))}`, i === 7 || i === 0 ? 'ln' : 'mute'); });
  });
  // newsreel：一个 bracket 盖住全部
  o += path(d([[222, yP(1)], [252, yP(1)]]), 'dash') + path(d([[330, yS(0) - 8], [324, yS(0) - 8], [324, yS(6) + 8], [330, yS(6) + 8]]), 'dash');
  o += path(d([[252, yP(1)], [324, yP(1) + 30]]), 'dash');
  P.forEach((s, i) => { o += rect(6, yP(i) - 12, 216, 24, i === 1 ? 'wash2' : 'paper', 4) + text(14, yP(i) + 5, (i + 1) + '. ' + s, 't'); });
  S.forEach((s, j) => { o += rect(340, yS(j) - 13, 214, 26, 'wash', 4) + text(348, yS(j) + 5, s, 't'); });
  o += text(6, 300, '曲线是每一段 flashback 讲到的时期；粗线是开头和结尾，两端正好接在 story 的两头。', 'ts');
  return svg(560, 306, o, 'Citizen Kane 的 plot 顺序和 story 顺序：开场是死亡，newsreel 概括一生，之后五个讲述者的 flashback 大致按时间先后覆盖童年到 Xanadu，Thatcher 那一段跳到 1929 年以后，Susan 的 opera 首演被讲了两次，结尾的 sled 回到童年');
}

// ---------- 第 7 站：The Searchers 的首尾两个 doorway ----------
function searchers() {
  let o = '';
  const panel = (x0, title, n1, n2, inside) => {
    const W = 260, H = 146, y0 = 30;
    let q = rect(x0, y0, W, H, 'solid2');
    const dx = x0 + 78, dw = 104, dy = y0 + 14, dh = H - 14;
    q += rect(dx, dy, dw, dh, 'paper-f');
    q += poly([[dx, dy + 86], [dx + 16, dy + 86], [dx + 20, dy + 52], [dx + 34, dy + 52], [dx + 38, dy + 86], [dx + 62, dy + 86], [dx + 66, dy + 66], [dx + 80, dy + 66], [dx + 84, dy + 86], [dx + dw, dy + 86], [dx + dw, dy + dh], [dx, dy + dh]], 'wash');
    q += line(dx, dy + 86, dx + dw, dy + 86, 'axis') + rect(dx, dy, dw, dh, 'ink');
    if (inside) {
      // 门内一个背光的剪影，远处一个骑马的小点
      q += circle(dx + 30, dy + 70, 9, 'ink-f') + path(d([[dx + 20, dy + 80], [dx + 40, dy + 80], [dx + 44, dy + dh], [dx + 16, dy + dh]]) + 'Z', 'ink-f');
      q += rect(dx + 72, dy + 82, 8, 5, 'ink-f') + circle(dx + 76, dy + 79, 1.8, 'ink-f');
    } else {
      q += circle(dx + 52, dy + 74, 8, 'ink-f') + path(d([[dx + 43, dy + 83], [dx + 61, dy + 83], [dx + 60, dy + dh - 4], [dx + 44, dy + dh - 4]]) + 'Z', 'ink-f');
    }
    q += text(x0 + W / 2, 18, title, 'tb', 'middle') + text(x0 + W / 2, y0 + H + 22, n1, 'ts', 'middle') + text(x0 + W / 2, y0 + H + 38, n2, 'ts', 'middle');
    return q;
  };
  o += panel(10, '第一个 shot', '从黑暗的 interior 望出去，门外是 desert', '远处有人骑马过来', true);
  o += panel(290, '最后一个 shot', '镜头在屋里；他站在门外不进来', '转身走开，门关上，画面变黑', false);
  return svg(560, 218, o, '两个示意的 frame：深色的屋内框住一扇门，门外是明亮的 desert 和孤峰；第一个 shot 门内有人往外看，远处有人骑马过来；最后一个 shot 一个人站在门外，随后门关上');
}

export default {
  'gec1017-kuleshov': kuleshov,
  'gec1017-greed': greed,
  'gec1017-light': lighting,
  'gec1017-scale': scale,
  'gec1017-dof': dofA,
  'gec1017-axis': axisA,
  'gec1017-cross': crossA,
  'gec1017-bridge': bridge,
  'gec1017-bomb': bomb,
  'gec1017-kane': kane,
  'gec1017-searchers': searchers,
};
