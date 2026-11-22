import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, anim, f1 } from '../lib/svg.mjs';

// ---------- kinship 记号 ----------
const S = 20; // symbol 大小
const male = (x, y, cls) => poly([[x, y - 11], [x + 11, y + 9], [x - 11, y + 9]], cls);
const female = (x, y, cls) => circle(x, y, 10, cls);
const person = (p, cls) => (p.sex === 'm' ? male(p.x, p.y, cls) : female(p.x, p.y, cls));
const marry = (a, b) => line(a.x + 12, a.y - 2, b.x - 12, b.y - 2, 'ink') + line(a.x + 12, a.y + 2, b.x - 12, b.y + 2, 'ink');
// 从一对夫妻的中点往下连到 children（一个或多个）
function descent(a, b, kids, barY) {
  const mx = (a.x + b.x) / 2;
  let o = line(mx, a.y + 2, mx, barY, 'ink');
  const xs = kids.map((k) => k.x);
  const lo = Math.min(mx, ...xs), hi = Math.max(mx, ...xs);
  if (hi > lo) o += line(lo, barY, hi, barY, 'ink');
  for (const k of kids) o += line(k.x, barY, k.x, k.y - 12, 'ink');
  return o;
}
// siblings 的横线（不画 parents 时用）
function sibBar(ps, barY) {
  const xs = ps.map((p) => p.x);
  let o = line(Math.min(...xs), barY, Math.max(...xs), barY, 'ink');
  for (const p of ps) o += line(p.x, barY, p.x, p.y - 12, 'ink');
  return o;
}

// 第 1 站：Kima'i 和他的 mother's sister's daughter 在同一个 matrilineal clan
function kimai() {
  const P = {
    MF: { sex: 'm', x: 265, y: 34 }, MM: { sex: 'f', x: 325, y: 34 },
    FZH: { sex: 'm', x: 30, y: 104 }, FZ: { sex: 'f', x: 80, y: 104 }, F: { sex: 'm', x: 150, y: 104 },
    M: { sex: 'f', x: 210, y: 104 }, MZ: { sex: 'f', x: 380, y: 104 }, MZH: { sex: 'm', x: 440, y: 104 },
    FZD: { sex: 'f', x: 55, y: 178 }, K: { sex: 'm', x: 180, y: 178 }, G: { sex: 'f', x: 410, y: 178 },
  };
  const mother = { M: 'MM', MZ: 'MM', K: 'M', G: 'MZ', FZD: 'FZ' };
  // clan 按 mother 往下传：从 MM 开始算
  const dalaA = new Set(['MM']);
  for (const k of ['M', 'MZ', 'K', 'G', 'FZD']) if (dalaA.has(mother[k])) dalaA.add(k);
  const dalaB = new Set(['FZ', 'F']);
  for (const k of ['FZD']) if (dalaB.has(mother[k])) dalaB.add(k);
  let o = '';
  o += marry(P.MF, P.MM) + marry(P.FZH, P.FZ) + marry(P.F, P.M) + marry(P.MZ, P.MZH);
  o += descent(P.MF, P.MM, [P.M, P.MZ], 66);
  o += sibBar([P.FZ, P.F], 76);
  o += descent(P.FZH, P.FZ, [P.FZD], 146) + descent(P.F, P.M, [P.K], 146) + descent(P.MZ, P.MZH, [P.G], 146);
  for (const [k, p] of Object.entries(P)) o += person(p, dalaA.has(k) ? 'solid ink-s' : dalaB.has(k) ? 'wash2 ink-s' : 'paper');
  o += text(P.K.x, 206, "Kima'i", 'tb', 'middle') + text(P.G.x, 206, '那个女孩', 'tb', 'middle');
  o += text(P.FZD.x, 206, 'father 的 sister', 'ts', 'middle') + text(P.FZD.x, 221, '的 daughter', 'ts', 'middle');
  o += text(P.M.x, 132, 'mother', 'ts', 'middle') + text(P.MZ.x + 8, 132, 'mother 的 sister', 'ts', 'end');
  o += text(P.F.x, 132, 'father', 'ts', 'middle');
  o += text(10, 22, '实心：mother 这一边的 clan', 'tl', 'start');
  o += text(10, 40, '灰色：father 的 clan', 'ts', 'start');
  // 两个结论
  o += text(300, 246, "Kima'i 和那个女孩的 mother 是 sisters，clan 按 mother 传，所以两人同属一个 matrilineal clan，", 'ts', 'middle');
  o += text(300, 263, '两人的关系破了 clan exogamy。Father 那一边的 cousin 属于另一个 clan，不在禁止之列。', 'ts', 'middle');
  return svg(560, 272, o, "Kinship diagram：Kima'i 的 mother 和那个女孩的 mother 是姐妹，clan 按 mother 传，两人同在一个 clan；father 的 sister 的女儿在 father 的 clan");
}

// 第 2 站：moral relativism 的 argument 结构
function argmap() {
  let o = '';
  const box = (x, y, w, h, lines, cls = 'paper', head = '') => {
    let q = rect(x, y, w, h, cls, 6);
    let yy = y + 20;
    if (head) { q += text(x + 10, yy, head, 'tb'); yy += 18; }
    for (const s of lines) { q += text(x + 10, yy, s, 'ts'); yy += 16; }
    return q;
  };
  o += box(6, 8, 172, 92, ['不同 society 对同一种', 'practice 的 moral', 'judgment 不一样'], 'paper', 'P1（description）');
  o += box(194, 8, 172, 92, ['一个人的 moral', 'judgment 来自他的', 'enculturation'], 'paper', 'P2（description）');
  o += rect(382, 8, 172, 92, 'wash', 6) + rect(382, 8, 172, 92, 'dash', 6);
  o += text(392, 28, 'P3（没写出来）', 'tl') + text(392, 46, '来自 enculturation 的', 'ts') + text(392, 62, 'judgment 在那个 culture', 'ts') + text(392, 78, '之外没有 validity', 'ts');
  o += arrow(92, 102, 230, 146, 'ink') + arrow(280, 102, 280, 144, 'ink') + arrow(468, 102, 330, 146, 'ink');
  o += box(170, 148, 220, 60, ['不存在跨 culture 的标准来评判', '任何 practice'], 'paper', 'C1 moral relativism');
  o += box(6, 238, 172, 76, ['每个 culture 都是边界', '清楚、互不相干的单位'], 'wash', 'P4（没写出来）');
  o += rect(6, 238, 172, 76, 'dash', 6);
  o += arrow(250, 210, 280, 252, 'ink') + arrow(180, 276, 228, 276, 'ink');
  o += box(230, 254, 170, 60, ['外人不该评判，也不该', '插手'], 'paper', 'C2');
  // 各家否认哪一条
  o += text(478, 160, '否认 P3：一个 judgment', 'ts', 'middle') + text(478, 176, '从哪里来，不决定它', 'ts', 'middle') + text(478, 192, '对不对（genetic fallacy）', 'ts', 'middle');
  o += text(482, 262, 'Abu-Lughod 否认 P4：', 'tl', 'middle') + text(482, 280, '这些 culture 早已被', 'ts', 'middle') + text(482, 296, '同一段历史卷在一起', 'ts', 'middle');
  return svg(560, 318, o, 'Argument map：P1、P2 两条 description 加上没写出来的 P3 才推出 moral relativism；再加上没写出来的 P4 才推出外人不该插手。批评者分别否认 P3 和 P4');
}

// 第 3 站：同一张 genealogy，patrilineal 与 matrilineal 各圈出谁
function descentFig() {
  let o = '';
  const panel = (x0, rule, title, note1, note2) => {
    const at = (dx, y) => x0 + dx;
    const P = {
      FF: { sex: 'm', x: at(58), y: 46 }, FM: { sex: 'f', x: at(104), y: 46 },
      MF: { sex: 'm', x: at(166), y: 46 }, MM: { sex: 'f', x: at(212), y: 46 },
      FZH: { sex: 'm', x: at(14), y: 116 }, FZ: { sex: 'f', x: at(56), y: 116 }, F: { sex: 'm', x: at(106), y: 116 },
      M: { sex: 'f', x: at(164), y: 116 }, MB: { sex: 'm', x: at(214), y: 116 }, MBW: { sex: 'f', x: at(256), y: 116 },
      FZS: { sex: 'm', x: at(35), y: 190 }, E: { sex: 'm', x: at(120), y: 190 }, Z: { sex: 'f', x: at(152), y: 190 }, MBS: { sex: 'm', x: at(235), y: 190 },
    };
    const par = { F: ['FF', 'FM'], FZ: ['FF', 'FM'], M: ['MF', 'MM'], MB: ['MF', 'MM'], FZS: ['FZH', 'FZ'], E: ['F', 'M'], Z: ['F', 'M'], MBS: ['MB', 'MBW'] };
    // membership：founder 是 FF（patrilineal）或 MM（matrilineal），之后只看 father（或 mother）是不是 member
    const mem = new Set([rule === 'p' ? 'FF' : 'MM']);
    for (const k of ['F', 'FZ', 'M', 'MB', 'FZS', 'E', 'Z', 'MBS']) if (mem.has(par[k][rule === 'p' ? 0 : 1])) mem.add(k);
    o += marry(P.FF, P.FM) + marry(P.MF, P.MM) + marry(P.FZH, P.FZ) + marry(P.F, P.M) + marry(P.MB, P.MBW);
    o += descent(P.FF, P.FM, [P.FZ, P.F], 80) + descent(P.MF, P.MM, [P.M, P.MB], 80);
    o += descent(P.FZH, P.FZ, [P.FZS], 156) + descent(P.F, P.M, [P.E, P.Z], 156) + descent(P.MB, P.MBW, [P.MBS], 156);
    for (const [k, p] of Object.entries(P)) o += person(p, mem.has(k) ? 'solid ink-s' : 'paper');
    o += text(P.E.x, 218, 'Ego', 'tb', 'middle');
    for (const k of ['FZ', 'F', 'M', 'MB']) o += text(P[k].x, 144, k, 'ts', 'middle');
    o += text(P.FZS.x, 218, 'FZS', 'ts', 'middle') + text(P.Z.x, 218, 'Z', 'ts', 'middle') + text(P.MBS.x, 218, 'MBS', 'ts', 'middle');
    o += text(x0 + 135, 14, title, 'tb', 'middle');
    o += text(x0 + 135, 244, note1.replace('N', String(mem.size)), 'ts', 'middle') + text(x0 + 135, 260, note2, 'ts', 'middle');
  };
  panel(4, 'p', 'Patrilineal：只沿 father 往下传', '实心的 N 人是 Ego 的 patrilineage', 'FZS 跟他的 father FZH 走，不在里面');
  panel(290, 'm', 'Matrilineal：只沿 mother 往下传', '实心的 N 人是 Ego 的 matrilineage', 'MBS 跟他的 mother MBW 走，不在里面');
  // legend
  const ly = 292;
  o += male(30, ly, 'paper') + text(46, ly + 5, 'male', 'ts') + female(100, ly, 'paper') + text(116, ly + 5, 'female', 'ts');
  o += line(170, ly - 2, 196, ly - 2, 'ink') + line(170, ly + 2, 196, ly + 2, 'ink') + text(202, ly + 5, 'marriage', 'ts');
  o += text(268, ly + 5, '往下的竖线连到 children，横线把 siblings 连在一起', 'ts');
  return svg(560, 304, o, '同一张 kinship diagram 画两遍：patrilineal 时 Ego 的 lineage 是 FF、F、FZ、Ego、Z；matrilineal 时是 MM、M、MB、Ego、Z');
}

// 第 3 站：两个 exogamous moiety（matrilineal）→ parallel cousin 和 cross cousin
function moiety() {
  const y2 = 74, y3 = 160;
  const P = {
    FBW: { sex: 'f', x: 45, y: y2 }, FB: { sex: 'm', x: 95, y: y2 }, FZH: { sex: 'm', x: 145, y: y2 }, FZ: { sex: 'f', x: 195, y: y2 },
    F: { sex: 'm', x: 245, y: y2 }, M: { sex: 'f', x: 295, y: y2 }, MZ: { sex: 'f', x: 345, y: y2 }, MZH: { sex: 'm', x: 395, y: y2 },
    MB: { sex: 'm', x: 445, y: y2 }, MBW: { sex: 'f', x: 495, y: y2 },
    FBS: { sex: 'm', x: 70, y: y3 }, FZD: { sex: 'f', x: 170, y: y3 }, E: { sex: 'm', x: 270, y: y3 }, MZS: { sex: 'm', x: 370, y: y3 }, MBD: { sex: 'f', x: 470, y: y3 },
  };
  // 规则：moiety 按 mother 传；spouse 必须来自另一个 moiety
  const other = (m) => (m === 'A' ? 'B' : 'A');
  const mo = { M: 'A' };
  mo.F = other(mo.M); mo.FB = mo.F; mo.FZ = mo.F; mo.MZ = mo.M; mo.MB = mo.M;
  mo.FBW = other(mo.FB); mo.FZH = other(mo.FZ); mo.MZH = other(mo.MZ); mo.MBW = other(mo.MB);
  mo.FBS = mo.FBW; mo.FZD = mo.FZ; mo.E = mo.M; mo.MZS = mo.MZ; mo.MBD = mo.MBW;
  let o = '';
  o += sibBar([P.FB, P.FZ, P.F], 40) + sibBar([P.M, P.MZ, P.MB], 48);
  o += marry(P.FBW, P.FB) + marry(P.FZH, P.FZ) + marry(P.F, P.M) + marry(P.MZ, P.MZH) + marry(P.MB, P.MBW);
  o += descent(P.FBW, P.FB, [P.FBS], 122) + descent(P.FZH, P.FZ, [P.FZD], 122) + descent(P.F, P.M, [P.E], 122) + descent(P.MZ, P.MZH, [P.MZS], 122) + descent(P.MB, P.MBW, [P.MBD], 122);
  for (const [k, p] of Object.entries(P)) o += person(p, mo[k] === mo.E ? 'solid ink-s' : 'paper');
  for (const k of ['FB', 'FZ', 'F', 'M', 'MZ', 'MB']) o += text(P[k].x, y2 + 26, k, 'ts', 'middle');
  const lab = { FBS: ['FBS', 'brother'], FZD: ['FZD', 'cross cousin'], E: ['Ego', ''], MZS: ['MZS', 'brother'], MBD: ['MBD', 'cross cousin'] };
  for (const [k, [a, b]] of Object.entries(lab)) {
    o += text(P[k].x, y3 + 28, a, k === 'E' ? 'tb' : 'ts', 'middle');
    if (b) o += text(P[k].x, y3 + 44, b, mo[k] === mo.E ? 'tb' : 'tl', 'middle');
  }
  o += text(280, 236, '实心 = Ego 所在的 moiety（按 mother 传），空心 = 另一个 moiety。Spouse 必须来自另一个 moiety。', 'ts', 'middle');
  o += text(280, 253, 'Parallel cousin（FBS、MZS）总在 Ego 这一边，Iroquois terminology 叫他们 brother；', 'ts', 'middle');
  o += text(280, 270, 'cross cousin（FZD、MBD）总在另一边，有另一个 term，正好是 Ego 可以娶的人。', 'ts', 'middle');
  return svg(560, 280, o, '两个 exogamous moiety，按 mother 传：Ego 的 father 的 brother 的儿子和 mother 的 sister 的儿子都和 Ego 同一个 moiety，father 的 sister 的女儿和 mother 的 brother 的女儿在另一个 moiety');
}

// 第 4 站：Kula ring，两种 valuable 朝相反方向转（动图）
function kulaA() {
  const C = [202, 166], R1 = 114, R2 = 80, RN = 97;
  const nodes = [['Trobriands', -135], ['Kitava', -75], ['Woodlark', -15], ['Tubetube', 45], ['Dobu', 115], ['Amphletts', 175]];
  const R = Math.PI / 180;
  const pt = (r, a) => [C[0] + r * Math.cos(a * R), C[1] + r * Math.sin(a * R)];
  let o = '';
  // 每处一块浅灰的底，代表这个岛：两种 valuable 都在这里停
  for (const [, a] of nodes) { const p = pt(RN, a); o += circle(p[0], p[1], 25, 'wash2'); }
  // 两条 track
  o += circle(C[0], C[1], R1, 'ln-dash') + circle(C[0], C[1], R2, 'dash');
  // 方向箭头：outer clockwise（角度增大），inner counterclockwise（角度减小）
  for (const a of [-105, -45, 15, 80, 145, 200]) {
    const p0 = pt(R1, a - 5), p1 = pt(R1, a + 5);
    o += arrow(p0[0], p0[1], p1[0], p1[1], 'ln', 8);
    const q0 = pt(R2, a + 5), q1 = pt(R2, a - 5);
    o += arrow(q0[0], q0[1], q1[0], q1[1], 'ink', 7);
  }
  for (const [name, a] of nodes) {
    const q = pt(R1 + 18, a), cs = Math.cos(a * R);
    o += text(q[0], q[1] + 4, name, 'tb', Math.abs(cs) < 0.3 ? 'middle' : cs > 0 ? 'start' : 'end');
  }
  o += text(C[0], C[1] - 8, '示意：只画了 6 处，', 'ts', 'middle') + text(C[0], C[1] + 10, '不按比例', 'ts', 'middle');
  // 动画：每到一处停 1.4 s（代表在一个人手里留一两年），每 60° 走 0.6 s
  const hold = 1.4, vel = 0.01;
  const order = nodes.map((n) => n[1]);
  const T = hold * nodes.length + 360 * vel;
  const track = (r, start, dir) => {
    const kt = [], xs = [], ys = [];
    let t = 0;
    for (let h = 0; h < nodes.length; h++) {
      const i = (start + dir * h + 6 * 6) % 6, j = (i + dir + 6) % 6;
      let a0 = order[i], a1 = order[j];
      if (dir > 0 && a1 <= a0) a1 += 360;
      if (dir < 0 && a1 >= a0) a1 -= 360;
      const p = pt(r, a0);
      kt.push(t / T); xs.push(p[0]); ys.push(p[1]);
      t += hold;
      kt.push(t / T); xs.push(p[0]); ys.push(p[1]);
      const dur = Math.abs(a1 - a0) * vel, n = 8;
      for (let k = 1; k <= n; k++) {
        const q = pt(r, a0 + ((a1 - a0) * k) / n);
        kt.push((t + (dur * k) / n) / T); xs.push(q[0]); ys.push(q[1]);
      }
      t += dur;
    }
    kt[kt.length - 1] = 1;
    return { kt, xs, ys };
  };
  const token = (r, start, dir, rad, cls) => {
    const { kt, xs, ys } = track(r, start, dir);
    return `<circle cx="${f1(xs[0])}" cy="${f1(ys[0])}" r="${rad}" class="${cls}">${anim('cx', xs.map(f1), kt, T)}${anim('cy', ys.map(f1), kt, T)}</circle>`;
  };
  // soulava 从 Dobu 和 Kitava 出发（clockwise），mwali 从 Woodlark 和 Trobriands 出发（counterclockwise）
  o += token(R1, 4, 1, 8, 'ln') + token(R1, 1, 1, 8, 'ln');
  o += token(R2, 2, -1, 6.5, 'ink-f') + token(R2, 0, -1, 6.5, 'ink-f');
  // 说明栏
  const X = 404;
  o += circle(X + 8, 30, 8, 'ln') + text(X + 24, 35, 'soulava（necklace）', 'tl');
  o += text(X + 24, 52, '沿外圈 clockwise', 'ts');
  o += circle(X + 8, 78, 6.5, 'ink-f') + text(X + 24, 83, 'mwali（armshell）', 'tb');
  o += text(X + 24, 100, '沿内圈 counterclockwise', 'ts');
  const notes = ['Trobriands 南部的 Sinaketa：', '从 south、west 的 partner', '收 soulava，从 north、east', '的 partner 收 mwali。', '', '每件东西在一个人手里', '留一两年就要传下去；', '绕完一圈要 2 到 10 年。'];
  notes.forEach((s, k) => { if (s) o += text(X, 140 + k * 17, s, 'ts'); });
  return svgA(560, 312, o, '动图：Kula ring 示意。红色的 soulava 沿外圈顺时针从一处传到下一处，黑色的 mwali 沿内圈逆时针传，每到一处停一会儿');
}

// 第 4 站：一次 Kula exchange 的先后（Sinaketa 与 Dobu）
function vaga() {
  const A = 120, B = 440;
  let o = text(A, 22, 'Sinaketa 的 A', 'tb', 'middle') + text(B, 22, 'Dobu 的 partner B', 'tb', 'middle');
  o += line(A, 32, A, 196, 'ink') + line(B, 32, B, 196, 'ink');
  o += line(A, 196, A, 246, 'dash') + line(B, 196, B, 246, 'dash');
  o += line(A, 246, A, 300, 'ink') + line(B, 246, B, 300, 'ink');
  const msg = (y, from, to, head, sub, cls) => {
    let q = arrow(from + (to > from ? 4 : -4), y, to + (to > from ? -4 : 4), y, cls, 8);
    q += text(280, y - 8, head, cls === 'ln' ? 'tl' : 'tb', 'middle') + text(280, y + 16, sub, 'ts', 'middle');
    return q;
  };
  o += msg(62, A, B, '① vaga：一只大 mwali', 'opening gift，从这一刻起 B 欠着', 'ink');
  o += msg(114, B, A, '② basi：一串小一些的 soulava', 'B 手上没有等值的 necklace，先给一个 pledge', 'ln');
  o += msg(166, A, B, '③ 几只小 mwali', '把 basi 这一笔还清', 'ink');
  o += text(280, 225, '可能隔几个月，也可能一年以上', 'ts', 'middle');
  o += msg(272, B, A, '④ kudu：和 vaga 等值的 soulava', '这一笔 exchange 结清；partnership 照旧，下一轮再开始', 'ln');
  o += text(28, 40, 'time', 'ts', 'middle') + arrow(28, 48, 28, 296, 'mute', 6);
  o += text(280, 322, 'Mwali 只从 A 流向 B，soulava 只从 B 流向 A。回什么由回礼的人决定，不讨价还价，也没有办法追讨。', 'ts', 'middle');
  return svg(560, 330, o, 'Sequence diagram：Sinaketa 的 A 先给 Dobu 的 B 一只大 armshell 作 vaga，B 先回一串小 necklace 作 basi，A 用小 armshell 还清 basi，过一段时间 B 再给等值的 necklace 作 kudu');
}

// 第 4 站：Mauss 的 hau：三个人的 obligation chain
function hau() {
  const N = [[90, 'A'], [280, 'B'], [470, 'C']], Y = 124;
  let o = '';
  for (const [x, s] of N) o += circle(x, Y, 24, 'paper') + text(x, Y + 6, s, 'tbig', 'middle');
  const arcTop = (x0, x1, h, cls) => {
    const pts = [];
    for (let k = 0; k <= 30; k++) { const t = k / 30; pts.push([x0 + (x1 - x0) * t, Y - 26 - h * Math.sin(Math.PI * t)]); }
    const a = pts[pts.length - 3], b = pts[pts.length - 1];
    return path(d(pts.slice(0, -2)), cls) + arrow(a[0], a[1], b[0], b[1], cls, 8);
  };
  const arcBot = (x0, x1, h, cls) => {
    const pts = [];
    for (let k = 0; k <= 30; k++) { const t = k / 30; pts.push([x0 + (x1 - x0) * t, Y + 26 + h * Math.sin(Math.PI * t)]); }
    const a = pts[pts.length - 3], b = pts[pts.length - 1];
    return path(d(pts.slice(0, -2)), cls) + arrow(a[0], a[1], b[0], b[1], cls, 8);
  };
  o += arcTop(100, 270, 40, 'ink') + text(185, 22, '① A 把一件 taonga 送给 B', 't', 'middle') + text(185, 39, '不讲价钱，也没约定回礼', 'ts', 'middle');
  o += arcTop(290, 460, 40, 'ink') + text(375, 22, '② B 把它转送给 C', 't', 'middle');
  o += arcBot(460, 290, 40, 'ln') + text(375, 204, '③ C 回赠 B 一件东西', 't', 'middle');
  o += arcBot(270, 100, 40, 'ln') + text(185, 204, '④ B 必须把它交给 A', 'tl', 'middle') + text(185, 220, '这件东西是 A 那件 taonga 的 hau', 'ts', 'middle');
  o += line(20, 244, 540, 244, 'grid');
  o += text(280, 266, 'Obligation to give（①②）→ obligation to receive（B、C 都不能拒收）→ obligation to reciprocate（③④）', 'ts', 'middle');
  o += text(280, 284, 'B 把 ③ 留给自己，就扣下了 A 的 hau：按这段 Maori 的解释，B 会因此遭殃。', 'ts', 'middle');
  return svg(560, 292, o, 'Mauss 引用的 Maori 解释：A 送 B 一件 taonga，B 转送 C，C 回赠 B，B 必须把回赠交给 A，因为那是 A 的 taonga 的 hau');
}

// 第 5 站：Azande 的 granary：两条 causal chain 相交
function granary() {
  let o = '';
  const G = 222; // ground
  o += line(10, G, 550, G, 'axis');
  // shade
  o += poly([[200, G], [330, G], [352, G - 6], [222, G - 6]], 'wash2');
  // posts（termite 蛀过的点）
  for (const x of [214, 316]) {
    o += rect(x - 5, 118, 10, G - 118, 'paper');
    for (let k = 0; k < 6; k++) o += circle(x + (k % 2 ? 2 : -2), 140 + k * 13, 1.6, 'ink-f');
  }
  // 平台和仓
  o += rect(196, 108, 138, 12, 'paper') + rect(214, 62, 102, 46, 'paper');
  o += poly([[204, 64], [265, 26], [326, 64]], 'wash ink-s');
  // 人：坐着乘凉
  const sit = (x) => circle(x, G - 33, 5.5, 'ink-f') + path(d([[x, G - 27], [x, G - 4], [x + 17, G - 4]]), 'ink-b') + path(d([[x, G - 20], [x + 9, G - 11]]), 'ink');
  o += sit(232) + sit(258) + sit(284);
  // 太阳
  o += circle(470, 44, 16, 'wash ink-s');
  for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; o += line(470 + 22 * Math.cos(a), 44 + 22 * Math.sin(a), 470 + 30 * Math.cos(a), 44 + 30 * Math.sin(a), 'ink'); }
  // 两条 chain
  o += text(18, 98, 'Chain 1（几年）', 'tb') + text(18, 116, 'termites 一点点蛀空', 'ts') + text(18, 132, '支撑的 posts', 'ts');
  o += arrow(120, 150, 205, 168, 'ink');
  o += text(400, 108, 'Chain 2（今天中午）', 'tb') + text(400, 126, '太阳太毒，几个人', 'ts') + text(400, 142, '坐到 granary 下面乘凉、', 'ts') + text(400, 158, '聊天、做手工', 'ts');
  o += arrow(398, 174, 306, 196, 'ink');
  o += text(280, 248, 'Azande 知道 chain 1，也知道 chain 2。他们问的是：两条 chain 为什么偏偏在这一刻、', 'ts', 'middle');
  o += text(280, 265, '在这几个人身上相交。Witchcraft 回答的是这一问。', 'tl', 'middle');
  return svg(560, 274, o, 'Azande 的 granary 立在木桩上，termites 把桩蛀空；中午有人坐在下面乘凉。两条原因各自清楚，witchcraft 解释的是它们为什么在这一刻相交');
}

// 第 5 站：rite of passage 三个 phase，以 Ndembu 的 Kanongesha 就任为例
function passage() {
  const sx = lin(0, 10, 40, 540);
  const lvl = { low: 196, mid: 132, high: 58 };
  let o = '';
  const band = (a, b, name, cls) => rect(sx(a), 28, sx(b) - sx(a), 194, cls) + text((sx(a) + sx(b)) / 2, 20, name, 'tb', 'middle');
  o += band(0, 3, 'Separation', 'paper-f') + band(3, 7, 'Liminality', 'wash') + band(7, 10, 'Incorporation', 'paper-f');
  o += line(sx(3), 28, sx(3), 222, 'grid') + line(sx(7), 28, sx(7), 222, 'grid');
  o += line(sx(0), lvl.mid, sx(10), lvl.mid, 'dash') + text(sx(10), lvl.mid - 6, '普通 commoner', 'ts', 'end');
  o += path(d([[sx(0), lvl.mid], [sx(2.4), lvl.mid], [sx(3.2), lvl.low], [sx(6.8), lvl.low], [sx(7.4), lvl.high], [sx(10), lvl.high]]), 'ln');
  o += text(sx(0.15), lvl.mid - 30, 'Chief-elect：', 'ts') + text(sx(0.15), lvl.mid - 14, '还是一个 commoner', 'ts');
  o += text(sx(0.15), lvl.mid + 26, '日落后被带到离 capital', 'ts') + text(sx(0.15), lvl.mid + 42, '约一 mile 的叶棚', 'ts');
  o += text(sx(5), 72, '只穿破旧的 waist-cloth，蹲坐，', 'ts', 'middle') + text(sx(5), 88, '被 Kafwana 和受过他气的人', 'ts', 'middle') + text(sx(5), 104, '当面数落，不许回嘴，不许睡', 'ts', 'middle');
  o += text(sx(5), lvl.low - 10, '比所有 commoner 都低', 'tl', 'middle');
  o += text(sx(8.5), lvl.high + 26, '公开的 installation：', 'ts', 'middle') + text(sx(8.5), lvl.high + 42, 'senior chief', 'tl', 'middle');
  o += text(sx(0), 240, 'time →', 'ts') + text(28, 40, 'status', 'ts', 'end');
  return svg(560, 248, o, 'Rite of passage 的三个 phase：Ndembu 的 chief-elect 先离开村子，在 liminality 里地位降到所有 commoner 之下，最后公开就任 senior chief');
}

// 第 6 站：cephalic index 是怎么量的，1.4 个点有多大
function cephalic() {
  let o = '';
  const head = (cx, L, B, title, ci) => {
    const cy = 128;
    let q = `<ellipse cx="${f1(cx)}" cy="${cy}" rx="${f1(B / 2)}" ry="${f1(L / 2)}" class="wash ink-s"/>`;
    q += poly([[cx - 9, cy - L / 2 + 3], [cx, cy - L / 2 - 12], [cx + 9, cy - L / 2 + 3]], 'paper');
    q += arrow(cx, cy, cx, cy - L / 2 + 2, 'ink', 6) + arrow(cx, cy, cx, cy + L / 2 - 2, 'ink', 6);
    q += arrow(cx, cy + 26, cx - B / 2 + 2, cy + 26, 'ln', 6) + arrow(cx, cy + 26, cx + B / 2 - 2, cy + 26, 'ln', 6);
    q += text(cx + 6, cy - 30, 'L = ' + L + ' mm', 'ts', 'start') + text(cx + B / 2 + 6, cy + 31, 'B = ' + B.toFixed(1).replace('.0', '') + ' mm', 'tl', 'start');
    q += text(cx, 252, title, 'tb', 'middle') + text(cx, 270, 'cephalic index = 100 × B / L = ' + ci.toFixed(1), 'ts', 'middle');
    return q;
  };
  const L = 190, B1 = 152, dCI = 1.4, B2 = B1 + (dCI * L) / 100;
  o += head(150, L, B1, '一个 child', (100 * B1) / L);
  o += head(380, L, B2, 'B 多 ' + ((dCI * L) / 100).toFixed(1) + ' mm', (100 * B2) / L);
  o += text(270, 22, '从头顶往下看，鼻子朝上', 'ts', 'middle');
  o += text(265, 128, '→', 'tbig', 'middle');
  return svg(560, 278, o, '从头顶看两个头的轮廓，L 都是 190 mm，B 分别是 152 mm 和 154.7 mm，cephalic index 从 80.0 变成 81.4，两个轮廓几乎看不出差别');
}

// 第 6 站：一个 locus 和很多 locus：Lewontin 与 Edwards 怎样同时成立
function edwards() {
  const p1 = 0.65, p2 = 0.35;
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
  const pmf = (n, p) => Array.from({ length: n + 1 }, (_, k) => C(n, k) * p ** k * (1 - p) ** (n - k));
  const err = (L) => { const a = pmf(2 * L, p1); let e = 0; for (let k = 0; k <= 2 * L; k++) e += k < L ? a[k] : k === L ? a[k] / 2 : 0; return e; };
  let o = '';
  const hist = (x0, L, title) => {
    const n = 2 * L, a = pmf(n, p1), b = pmf(n, p2), ymax = Math.max(...a, ...b) * 1.08;
    const sx = lin(-0.5, n + 0.5, x0, x0 + 240), sy = lin(0, ymax, 150, 40);
    const w = (sx(1) - sx(0)) * 0.42;
    o += line(x0, 150, x0 + 240, 150, 'axis');
    for (let k = 0; k <= n; k++) {
      o += rect(sx(k) - w, sy(b[k]), w, 150 - sy(b[k]), 'solid2');
      o += rect(sx(k), sy(a[k]), w, 150 - sy(a[k]), 'solid');
    }
    o += line(sx(L), 36, sx(L), 154, 'dash');
    const ticks = L === 1 ? [0, 1, 2] : [0, L, n];
    for (const t of ticks) o += text(sx(t), 166, String(t), 'ts', 'middle');
    o += text(x0 + 120, 22, title, 'tb', 'middle');
    o += text(x0 + 120, 184, '按虚线分：错分 ' + (100 * err(L)).toFixed(L === 1 ? 0 : 1) + '%', 'tl', 'middle');
  };
  hist(20, 1, '只看 1 个 locus');
  hist(300, 30, '把 30 个 locus 加起来');
  o += text(140, 200, '横轴：一个人带几个 allele a', 'ts', 'middle') + text(420, 200, '横轴：60 个 allele 里有几个 a', 'ts', 'middle');
  // 错分率曲线
  const sx = lin(1, 60, 70, 530), sy = lin(0, 0.4, 330, 230);
  o += line(70, 330, 530, 330, 'axis') + line(70, 330, 70, 228, 'axis');
  for (const v of [0, 0.1, 0.2, 0.3]) o += line(66, sy(v), 70, sy(v), 'axis') + text(62, sy(v) + 4, (v * 100).toFixed(0) + '%', 'ts', 'end');
  for (const L of [1, 10, 20, 30, 40, 50, 60]) o += line(sx(L), 330, sx(L), 334, 'axis') + text(sx(L), 347, String(L), 'ts', 'middle');
  const pts = []; for (let L = 1; L <= 60; L++) pts.push([sx(L), sy(err(L))]);
  o += path(d(pts), 'ln');
  for (const L of [1, 10, 30]) o += circle(sx(L), sy(err(L)), 3.5, 'ln-f');
  o += text(sx(10) + 8, sy(err(10)) - 6, '10 个：' + (100 * err(10)).toFixed(1) + '%', 'ts', 'start');
  o += text(530, 362, 'locus 的个数', 'ts', 'end') + text(78, 224, '错分率', 'ts', 'start');
  o += text(530, 244, '每个 locus 上都有 91% 的 variation 在 group 内部', 'ts', 'end');
  o += rect(330, 30, 10, 10, 'solid') + text(344, 39, 'group 1', 'ts') + rect(410, 30, 10, 10, 'solid2') + text(424, 39, 'group 2', 'ts');
  return svg(560, 368, o, 'Toy model：两个 group 在每个 locus 上 allele a 的 frequency 是 0.65 和 0.35。只看一个 locus，两个 distribution 大量重叠，错分 35%；30 个 locus 加起来，distribution 几乎分开，错分 0.9%');
}

// 第 7 站：Hong Kong 的 McDonald's：设计的 visit 和实际的用法（时钟时间）
function mcd() {
  const h0 = 8, h1 = 20;
  const sx = lin(h0, h1, 150, 540);
  let o = '';
  o += line(sx(h0), 40, sx(h1), 40, 'axis');
  for (let h = h0; h <= h1; h += 2) o += line(sx(h), 36, sx(h), 44, 'axis') + text(sx(h), 30, h + ':00', 'ts', 'middle');
  // left = true 时注释写在条的左边（条靠右、右边放不下时）
  const row = (y, label, sub, a, b, cls, note, note2, left = false) => {
    o += text(12, y + 4, label, 'tb') + text(12, y + 20, sub, 'ts');
    o += rect(sx(a), y - 10, sx(b) - sx(a), 22, cls, 4);
    const x = left ? sx(a) - 6 : sx(b) + 6, an = left ? 'end' : 'start';
    if (note) o += text(x, y + 6, note, 'ts', an);
    if (note2) o += text(x, y + 22, note2, 'ts', an);
  };
  // Oak Brook 设计的一次 visit：示意，约 15 分钟
  row(72, 'Oak Brook 的设计', 'fast food', 12.5, 12.75, 'solid2', '买、吃、走：fast 指上菜快', '（示意）');
  // 退休的人：Watson 访谈，9:30 到 11:00
  const r0 = 9.5, r1 = 11;
  row(124, '退休的人', '多半独居的年长 women', r0, r1, 'wash-strong', 'pancake 早餐、免费续杯、', '读店里的报纸（' + (r1 - r0) * 60 + ' 分钟）');
  // 学生：约两个小时，开始时刻原文未给，放学后示意
  const s0 = 16, s1 = s0 + 2;
  row(176, '放学的学生', '1990 年代中期', s0, s1, 'solid', '一盘 fries 大家分，', '坐约 ' + (s1 - s0) + ' 小时（开始时刻是示意）', true);
  o += text(280, 222, '顾客照单全收的：自己排队、自己找座位。被改掉的：一次 visit 待多久。', 'ts', 'middle');
  return svg(560, 232, o, 'Hong Kong 的 McDonald’s：总部设计的一次 visit 很短；退休的人上午 9:30 到 11:00 坐着吃早餐读报，学生放学后坐约两个小时');
}

export default {
  'an1101e-kimai': kimai,
  'an1101e-argmap': argmap,
  'an1101e-descent': descentFig,
  'an1101e-moiety': moiety,
  'an1101e-kula': kulaA,
  'an1101e-vaga': vaga,
  'an1101e-hau': hau,
  'an1101e-granary': granary,
  'an1101e-passage': passage,
  'an1101e-cephalic': cephalic,
  'an1101e-edwards': edwards,
  'an1101e-mcd': mcd,
};
