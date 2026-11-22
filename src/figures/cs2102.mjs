import { svg, svgA, d, path, line, rect, circle, poly, text, arrow, ashow, f1 } from '../lib/svg.mjs';

// 全页共用的小数据库
const STU = [[1, 'Ana', 'CS'], [2, 'Ben', 'DSA'], [3, 'Cai', 'CS'], [4, 'Dee', 'Math']];
const ENR = [[1, 'CS2102', 'A'], [1, 'CS2040', 'B'], [2, 'CS2102', 'B'], [2, 'MA2101', 'C'], [3, 'CS2040', 'A']];

const grp = (body, on, kt, T) => `<g opacity="${on[0] ? 1 : 0}">${body}${ashow(on, kt, T)}</g>`;

// 一张 table：header + rows；fill(i) 给第 i 行的底色 class（或 null）
function tbl(x, y, head, ws, rows, { rh = 24, fill = () => null, tcls = () => 't', title = null } = {}) {
  let o = '';
  if (title) o += text(x, y - 8, title, 'tb');
  let cx = x;
  const W = ws.reduce((a, b) => a + b, 0);
  o += rect(x, y, W, rh, 'wash2');
  head.forEach((h, j) => { o += text(cx + ws[j] / 2, y + rh / 2 + 4.5, h, 'ts', 'middle'); cx += ws[j]; });
  rows.forEach((r, i) => {
    const yy = y + rh * (i + 1), f = fill(i);
    if (f) o += rect(x, yy, W, rh, f);
    cx = x;
    r.forEach((v, j) => { o += text(cx + ws[j] / 2, yy + rh / 2 + 4.5, v === null ? 'NULL' : String(v), v === null ? 'ts' : tcls(i, j), 'middle'); cx += ws[j]; });
  });
  o += rect(x, y, W, rh * (rows.length + 1), 'frame');
  for (let i = 1; i <= rows.length; i++) o += line(x, y + rh * i, x + W, y + rh * i, 'grid');
  return o;
}

// 开头：把所有东西放进一张 table
function flat() {
  const rows = ENR.map(([s, c, g]) => { const st = STU.find((t) => t[0] === s); return [s, st[1], st[2], c, g]; });
  const ws = [40, 54, 54, 76, 50], X = 20, Y = 30, rh = 26;
  let o = tbl(X, Y, ['sid', 'name', 'dept', 'cid', 'grade'], ws, rows, { rh, fill: (i) => (i < 2 ? 'wash' : i === 4 ? 'wash2' : null) });
  const yr = (i) => Y + rh * (i + 1);
  // Dee：存不进来的一行
  const yD = yr(5) + 22;
  o += `<rect x="${X}" y="${yD}" width="274" height="${rh}" class="dash" rx="0"/>`;
  [4, 'Dee', 'Math', '?', '?'].forEach((v, j) => { o += text(X + ws.slice(0, j).reduce((a, b) => a + b, 0) + ws[j] / 2, yD + rh / 2 + 4.5, String(v), j >= 3 ? 'tl' : 'ts', 'middle'); });
  const ax = 306, tx = 322;
  const br = (y0, y1) => line(ax, y0 + 3, ax + 6, y0 + 3, 'ink') + line(ax + 6, y0 + 3, ax + 6, y1 - 3, 'ink') + line(ax, y1 - 3, ax + 6, y1 - 3, 'ink');
  o += br(yr(0), yr(2)) + text(tx, yr(0) + 21, 'update anomaly：Ana 的 dept 存了两遍，', 'ts') + text(tx, yr(0) + 38, '改专业要改两行，漏改一行就自相矛盾', 'ts');
  o += br(yr(4), yr(5)) + text(tx, yr(4) + 10, 'deletion anomaly：删掉 Cai 唯一的选课，', 'ts') + text(tx, yr(4) + 25, '“Cai 是 CS 的学生”也跟着没了', 'ts');
  o += br(yD, yD + rh) + text(tx, yD + 9, 'insertion anomaly：Dee 还没选课，cid 是', 'ts') + text(tx, yD + 25, 'key 的一部分，不能空着，Dee 存不进来', 'ts');
  return svg(560, yD + rh + 8, o, '一张把学生和选课放在一起的 table：Ana 的 dept 重复两次，删除 Cai 唯一的一行会丢掉 Cai，没选课的 Dee 无法插入');
}

// 第 1 站：nested-loop join，逐对比较
function nljA() {
  const rh = 24, Y = 36;
  const SX = 10, EX = 152, OX = 318;
  const sw = [32, 44, 44], ew = [32, 70, 44], ow = [30, 42, 42, 64, 40];
  const pairs = [];
  STU.forEach((s, i) => ENR.forEach((e, j) => pairs.push({ i, j, m: s[0] === e[0] })));
  const step = 0.62, hold = 3.2, n = pairs.length, T = n * step + hold;
  const kt = [...pairs.map((_, k) => (k * step) / T), (n * step) / T];
  const F = kt.length; // 最后一帧 = 完成
  let o = tbl(SX, Y, ['sid', 'name', 'dept'], sw, STU, { title: 'Student（outer）' });
  o += tbl(EX, Y, ['sid', 'cid', 'grade'], ew, ENR, { title: 'Enrolled（inner）' });
  o += text(OX, Y - 8, 'Student ⋈ Enrolled', 'tb');
  o += rect(OX, Y, 218, rh, 'wash2');
  ['sid', 'name', 'dept', 'cid', 'grade'].forEach((h, j) => { o += text(OX + ow.slice(0, j).reduce((a, b) => a + b, 0) + ow[j] / 2, Y + 16.5, h, 'ts', 'middle'); });
  // 高亮：每帧一个 (i, j)
  const on = (k) => Array.from({ length: F }, (_, f) => f === k);
  pairs.forEach((p, k) => {
    let g = rect(SX, Y + rh * (p.i + 1), 120, rh, 'wash') + rect(EX, Y + rh * (p.j + 1), 146, rh, p.m ? 'wash-strong' : 'wash2');
    const y1 = Y + rh * (p.i + 1.5), y2 = Y + rh * (p.j + 1.5);
    g += line(SX + 120, y1, EX, y2, p.m ? 'ln' : 'dash');
    const s = STU[p.i], e = ENR[p.j];
    g += text(SX, 214, `第 ${k + 1} / 20 对：Student.sid = ${s[0]}，Enrolled.sid = ${e[0]}`, 't');
    g += text(SX, 234, p.m ? '相等：拼成一行，写进 output' : '不相等：丢掉，看 inner 的下一行', p.m ? 'tl' : 'ts');
    o += grp(g, on(k), kt, T);
  });
  // output 行：从产生的那一帧起一直显示
  let m = 0;
  pairs.forEach((p, k) => {
    if (!p.m) return;
    const s = STU[p.i], e = ENR[p.j], yy = Y + rh * (m + 1);
    let g = rect(OX, yy, 218, rh, 'paper-f');
    [s[0], s[1], s[2], e[1], e[2]].forEach((v, j) => { g += text(OX + ow.slice(0, j).reduce((a, b) => a + b, 0) + ow[j] / 2, yy + 16.5, String(v), 't', 'middle'); });
    g += line(OX, yy + rh, OX + 218, yy + rh, 'grid');
    o += grp(g, Array.from({ length: F }, (_, f) => f >= k), kt, T);
    m++;
  });
  o += rect(OX, Y, 218, rh * 6, 'frame');
  o += grp(text(SX, 214, '完成：比较了 4 × 5 = 20 对，输出 5 行', 'tl') + text(SX, 234, 'Dee（sid 4）一对也没配上，所以不在结果里', 'ts'), on(F - 1), kt, T);
  return svgA(560, 244, o, '动图：nested-loop join。对 Student 的每一行，从头到尾扫一遍 Enrolled，sid 相等的一对拼成一行写进结果；20 对里有 5 对相等');
}

// 第 1 站：同一个 query 的两棵 operator tree
function plan() {
  let o = '';
  const node = (cx, cy, s, w = 120) => rect(cx - w / 2, cy - 15, w, 30, 'paper', 6) + text(cx, cy + 5, s, 't', 'middle');
  const leaf = (cx, cy, s) => rect(cx - 44, cy - 15, 88, 30, 'wash', 4) + text(cx, cy + 5, s, 'tb', 'middle');
  const edge = (x1, y1, x2, y2, lab, side = 1) => line(x1, y1, x2, y2, 'ink') + text((x1 + x2) / 2 + side * 8, (y1 + y2) / 2 + 4, lab, 'ts', side > 0 ? 'start' : 'end');
  const sig = 'σ<tspan class="sub" dy="3">cid = ’CS2102’</tspan><tspan dy="-3">​</tspan>';
  const pi = 'π<tspan class="sub" dy="3">name</tspan><tspan dy="-3">​</tspan>';
  const jn = '⋈<tspan class="sub" dy="3">sid</tspan><tspan dy="-3">​</tspan>';
  // 左：先 join 再 select
  const L = 140;
  o += text(L, 22, '先 join，再 select', 'tb', 'middle');
  o += node(L, 50, pi, 90) + edge(L, 65, L, 95, '2 行');
  o += node(L, 110, sig, 130) + edge(L, 125, L, 155, '5 行');
  o += node(L, 170, jn, 70) + edge(L - 18, 185, L - 60, 225, '4 行', -1) + edge(L + 18, 185, L + 60, 225, '5 行');
  o += leaf(L - 60, 240, 'Student') + leaf(L + 60, 240, 'Enrolled');
  o += text(L + 42, 174, '比较 4 × 5 = 20 对', 'tl');
  // 右：先 select 再 join
  const R = 420;
  o += text(R, 22, '先 select，再 join', 'tb', 'middle');
  o += node(R, 50, pi, 90) + edge(R, 65, R, 95, '2 行');
  o += node(R, 110, jn, 70) + edge(R - 18, 125, R - 60, 225, '4 行', -1) + edge(R + 18, 125, R + 60, 155, '2 行');
  o += node(R + 60, 170, sig, 130) + edge(R + 60, 185, R + 60, 225, '5 行');
  o += leaf(R - 60, 240, 'Student') + leaf(R + 60, 240, 'Enrolled');
  o += text(R + 40, 114, '比较 4 × 2 = 8 对', 'tl');
  o += line(280, 14, 280, 258, 'grid');
  o += text(280, 284, '放大到 40,000 个学生、200,000 条选课、其中 400 条是 CS2102：', 'ts', 'middle');
  o += text(280, 302, '左边比较 8 × 10⁹ 对，右边 1.6 × 10⁷ 对，相差 500 倍；两边结果都是 {Ana, Ben}', 'ts', 'middle');
  return svg(560, 310, o, '同一个 query 的两棵 relational algebra tree：左边先 join 再 select，比较 20 对；右边先对 Enrolled 做 select 再 join，只比较 8 对；结果相同');
}

// 第 2 站：一条 query 按 FROM → WHERE → GROUP BY → HAVING → SELECT 逐步求值
function evalA() {
  const sql = [
    ['6', 'SELECT s.dept, COUNT(*) AS n'],
    ['1', 'FROM Student s, Enrolled e'],
    ['2', 'WHERE s.sid = e.sid'],
    ['3', '  AND e.grade <> ’C’'],
    ['4', 'GROUP BY s.dept'],
    ['5', 'HAVING COUNT(*) >= 2'],
  ];
  const order = [1, 2, 3, 4, 5, 0]; // 第 k 帧高亮第几行
  const notes = [
    ['FROM：两个 table 的 cross product', '4 × 5 = 20 行，每一格是一行'],
    ['WHERE s.sid = e.sid：逐行判断，只留 TRUE', '剩 5 行'],
    ['AND e.grade <> ’C’：(Ben, MA2101, C) 被去掉', '剩 4 行'],
    ['GROUP BY s.dept：dept 相同的行归成一个 group', '2 个 group：CS 3 行，DSA 1 行'],
    ['HAVING：对每个 group 判断，DSA 只有 1 行', '剩 1 个 group'],
    ['SELECT：每个 group 输出一行', '结果：(CS, 3)'],
  ];
  const n = 6, st = 2.4, T = n * st + 1.2;
  const kt = [...Array.from({ length: n }, (_, k) => (k * st) / T)];
  kt.push(1 - 1e-4); // 末帧占位
  const on = (k) => [...Array.from({ length: n }, (_, f) => f === k), k === n - 1];
  const onR = (a, b) => [...Array.from({ length: n }, (_, f) => f >= a && f <= b), b >= n - 1];
  const X = 12, Y0 = 44, LH = 26;
  let o = text(X, 22, '写的顺序（左边数字 = 执行顺序）', 'tb');
  sql.forEach(([k, s], i) => { o += text(X + 4, Y0 + i * LH, k, 'ts') + text(X + 22, Y0 + i * LH, s, 't'); });
  for (let f = 0; f < n; f++) { const i = order[f]; o += grp(rect(X, Y0 + i * LH - 17, 238, 23, 'wash'), on(f), kt, T); }
  // 右边：grid（帧 0–2）
  const GX = 326, GY = 70, cw = 46, ch = 30;
  let g0 = text(GX - 62, 22, '每格 = Student 的一行 × Enrolled 的一行', 'tb');
  ENR.forEach((e, j) => { g0 += text(GX + j * cw + cw / 2, GY - 22, 'sid ' + e[0], 'ts', 'middle') + text(GX + j * cw + cw / 2, GY - 8, e[1], 'ts', 'middle'); });
  STU.forEach((s, i) => { g0 += text(GX - 6, GY + i * ch + ch / 2 + 4, `${s[0]} ${s[1]} ${s[2]}`, 'ts', 'end'); });
  o += grp(g0, onR(0, 2), kt, T);
  for (let f = 0; f <= 2; f++) {
    let g = '';
    STU.forEach((s, i) => ENR.forEach((e, j) => {
      const x = GX + j * cw, y = GY + i * ch;
      const m = s[0] === e[0], keep = f === 0 || (m && (f === 1 || e[2] !== 'C'));
      const cut = f === 2 && m && e[2] === 'C';
      g += rect(x + 1, y + 1, cw - 2, ch - 2, keep ? (f === 0 ? 'wash2' : 'wash-strong') : 'paper-f');
      g += rect(x + 1, y + 1, cw - 2, ch - 2, 'frame');
      if (keep && f > 0) g += text(x + cw / 2, y + ch / 2 + 4.5, e[2], 'tb', 'middle');
      if (cut) g += line(x + 6, y + 6, x + cw - 6, y + ch - 6, 'ink') + line(x + cw - 6, y + 6, x + 6, y + ch - 6, 'ink');
    }));
    o += grp(g, on(f), kt, T);
  }
  // 右边：分组后的 table（帧 3–5）
  const rows = [['CS', 'Ana', 'CS2102', 'A'], ['CS', 'Ana', 'CS2040', 'B'], ['CS', 'Cai', 'CS2040', 'A'], ['DSA', 'Ben', 'CS2102', 'B']];
  const TX = 262, TY = 56, ws = [48, 50, 74, 52];
  for (let f = 3; f <= 5; f++) {
    let g = text(TX, 22, f < 5 ? '通过 WHERE 的 4 行，按 dept 分组' : 'Output', 'tb');
    if (f < 5) {
      g += tbl(TX, TY, ['dept', 'name', 'cid', 'grade'], ws, rows, { fill: (i) => (i < 3 ? 'wash' : f === 4 ? null : 'wash2'), tcls: () => 't' });
      g += line(TX + 236, TY + 27, TX + 242, TY + 27, 'ink') + line(TX + 242, TY + 27, TX + 242, TY + 93, 'ink') + line(TX + 236, TY + 93, TX + 242, TY + 93, 'ink');
      g += text(TX + 247, TY + 64, 'CS：3', f === 4 ? 'tl' : 't');
      g += text(TX + 247, TY + 116, 'DSA：1', f === 4 ? 'ts' : 't');
      if (f === 4) g += line(TX + 4, TY + 108, TX + 220, TY + 108, 'ink');
    } else {
      g += tbl(TX, TY, ['dept', 'n'], [60, 50], [['CS', 3]]);
    }
    o += grp(g, on(f), kt, T);
  }
  notes.forEach(([a, b], f) => { o += grp(text(X, 222, `第 ${f + 1} 步　` + a, 'tl') + text(X, 242, b, 'ts'), on(f), kt, T); });
  return svgA(560, 252, o, '动图：SELECT s.dept, COUNT(*) 那条 query 按执行顺序走：FROM 得到 20 行的 cross product，WHERE 留下 5 行再去掉 grade 为 C 的一行，GROUP BY 分成 CS 和 DSA 两组，HAVING 去掉 DSA，SELECT 输出 (CS, 3)');
}

// 第 2 站：LEFT JOIN 用 NULL 补齐
function outer() {
  const rh = 24, Y = 34, SX = 20, EX = 376;
  let o = tbl(SX, Y, ['sid', 'name', 'dept'], [34, 44, 46], STU, { title: 'Student', fill: (i) => (i === 3 ? 'wash-strong' : null) });
  o += tbl(EX, Y, ['sid', 'cid', 'grade'], [34, 70, 46], ENR, { title: 'Enrolled' });
  ENR.forEach((e, j) => { const i = STU.findIndex((s) => s[0] === e[0]); o += line(SX + 124, Y + rh * (i + 1.5), EX, Y + rh * (j + 1.5), 'mute'); });
  o += text(SX + 134, Y + rh * 4.5 + 4, '← 没有任何一行和 Dee 配对', 'tl');
  const rows = [];
  STU.forEach((s) => { const es = ENR.filter((e) => e[0] === s[0]); if (es.length) es.forEach((e) => rows.push([s[0], s[1], s[2], e[1], e[2]])); else rows.push([s[0], s[1], s[2], null, null]); });
  const OY = 186;
  o += tbl(SX, OY, ['s.sid', 'name', 'dept', 'e.cid', 'grade'], [44, 54, 54, 76, 56], rows, { title: 'Student s LEFT JOIN Enrolled e ON s.sid = e.sid', fill: (i) => (i === 5 ? 'wash-strong' : null) });
  o += text(310, OY + rh * 6 + 4, 'Dee 保留下来，Enrolled 那边的', 'ts') + text(310, OY + rh * 6 + 20, 'column 全部用 NULL 补上', 'ts');
  o += text(310, OY + rh * 2 + 4, 'inner join 的 5 行原样都在', 'ts');
  return svg(560, OY + rh * 7 + 6, o, 'Student 和 Enrolled 做 left outer join：五条 sid 配对的连线照常拼成五行，没有配对的 Dee 也保留，右边的 column 填 NULL');
}

// 第 3 站：删掉被 reference 的一行，CASCADE 与 NO ACTION
function fkA() {
  const rh = 22;
  const panel = (x0, mode) => {
    const st = [3.0, 2.4, 3.6], T = st.reduce((a, b) => a + b, 0), kt = [0, st[0] / T, (st[0] + st[1]) / T, 1 - 1e-4];
    const on = (k) => [0, 1, 2, 2].map((f) => f === k);
    const Y1 = 58, Y2 = 58 + rh * 5 + 34;
    let o = text(x0 + 130, 20, mode === 'c' ? 'ON DELETE CASCADE' : 'ON DELETE NO ACTION（默认）', 'tb', 'middle');
    const draw = (f) => {
      const gone = (s) => (mode === 'c' && f === 2 && s === 1);
      const mark = (s) => (f === 1 && s === 1);
      let g = tbl(x0 + 40, Y1, ['sid', 'name', 'dept'], [34, 44, 46], STU.filter((s) => !gone(s[0])), { rh, title: 'Student', fill: (i) => (mark(STU.filter((s) => !gone(s[0]))[i][0]) ? 'wash-strong' : null) });
      const es = ENR.filter((e) => !gone(e[0]));
      g += tbl(x0 + 40, Y2, ['sid', 'cid', 'grade'], [34, 70, 46], es, { rh, title: 'Enrolled', fill: (i) => (f === 1 && es[i][0] === 1 ? 'wash' : null) });
      // foreign key 的连线：Enrolled.sid → Student.sid
      const sl = STU.filter((s) => !gone(s[0]));
      es.forEach((e, j) => { const i = sl.findIndex((s) => s[0] === e[0]); if (i >= 0) g += path(`M${x0 + 40} ${f1(Y2 + rh * (j + 1.5))}C${x0 + 6} ${f1(Y2 + rh * (j + 1.5))} ${x0 + 6} ${f1(Y1 + rh * (i + 1.5))} ${x0 + 38} ${f1(Y1 + rh * (i + 1.5))}`, 'mute'); });
      return g;
    };
    const msg = [
      ['DELETE FROM Student WHERE sid = 1;', ''],
      ['要删 Ana；Enrolled 里有 2 行 reference 她', ''],
      mode === 'c' ? ['这 2 行跟着一起删掉', '剩下的每个 sid 仍然指向存在的学生'] : ['ERROR：违反 foreign key constraint', '整条 DELETE 不执行，两个 table 都不变'],
    ];
    for (let f = 0; f < 3; f++) o += grp(draw(mode === 'n' && f === 2 ? 0 : f) + text(x0 + 6, Y2 + rh * 6 + 22, msg[f][0], f === 2 ? 'tl' : 't') + text(x0 + 6, Y2 + rh * 6 + 40, msg[f][1], 'ts'), on(f), kt, T);
    return o;
  };
  return svgA(560, 58 + rh * 11 + 34 + 46, panel(0, 'c') + line(280, 10, 280, 340, 'grid') + panel(290, 'n'), '动图：执行 DELETE FROM Student WHERE sid = 1。左边 foreign key 设了 ON DELETE CASCADE，Ana 和她的两行选课一起删掉；右边是默认的 NO ACTION，DELETE 报错，两个 table 保持不变');
}

// 第 4 站：relationship set 的 instance 与 ER 记号
function erinst() {
  let o = '';
  const dots = (x, ys, labs, side) => ys.map((y, i) => circle(x, y, 4, 'ink-f') + text(x + side * 10, y + 4, labs[i], 't', side > 0 ? 'start' : 'end')).join('');
  // 左：Enrolls，many-to-many
  const sy = [60, 90, 120, 150], cy = [70, 105, 140];
  o += text(140, 22, 'Enrolls：没有限制', 'tb', 'middle');
  o += rect(34, 38, 72, 130, 'wash', 8) + rect(178, 38, 72, 130, 'wash', 8);
  o += text(70, 186, 'Student', 'ts', 'middle') + text(214, 186, 'Course', 'ts', 'middle');
  const cIdx = { CS2102: 0, CS2040: 1, MA2101: 2 };
  ENR.forEach(([s, c]) => { o += line(84, sy[s - 1], 194, cy[cIdx[c]], 'ink'); });
  o += dots(84, sy, ['Ana', 'Ben', 'Cai', 'Dee'], -1) + dots(194, cy, ['CS2102', 'CS2040', 'MA2101'], 1);
  o += text(140, 208, 'Ana 连 2 条，Dee 连 0 条，都允许', 'ts', 'middle');
  // 右：MajorIn，每个 Student 恰好一个 Department
  const dy = [70, 105, 140];
  o += text(420, 22, 'MajorIn：每个 Student 恰好一条', 'tb', 'middle');
  o += rect(314, 38, 72, 130, 'wash', 8) + rect(458, 38, 72, 130, 'wash', 8);
  o += text(350, 186, 'Student', 'ts', 'middle') + text(494, 186, 'Department', 'ts', 'middle');
  const dIdx = { CS: 0, DSA: 1, Math: 2 };
  STU.forEach(([s, , dp]) => { o += line(364, sy[s - 1], 474, dy[dIdx[dp]], 'ink'); });
  o += dots(364, sy, ['Ana', 'Ben', 'Cai', 'Dee'], -1) + dots(474, dy, ['CS', 'DSA', 'Math'], 1);
  o += text(420, 208, 'Department 那边可以连多条（CS 连了 2 条）', 'ts', 'middle');
  // 下面：对应的 ER 记号
  const Y = 262;
  const ent = (cx, s, w = 78) => rect(cx - w / 2, Y - 16, w, 32, 'paper') + text(cx, Y + 5, s, 't', 'middle');
  const dia = (cx, s, hw = 38) => poly([[cx - hw, Y], [cx, Y - 20], [cx + hw, Y], [cx, Y + 20]], 'paper') + text(cx, Y + 5, s, 'ts', 'middle');
  o += ent(50, 'Student') + line(89, Y, 102, Y, 'ink') + dia(140, 'Enrolls') + line(178, Y, 191, Y, 'ink') + ent(230, 'Course');
  o += ent(330, 'Student') + arrow(369, Y, 382, Y, 'ink-b', 8) + dia(420, 'MajorIn') + line(458, Y, 470, Y, 'ink') + ent(510, 'Department', 80);
  o += text(140, Y + 40, '两边都是细线', 'ts', 'middle');
  o += text(420, Y + 40, 'Student 一侧：箭头 = 最多一个（key constraint）', 'ts', 'middle') + text(420, Y + 57, '粗线 = 至少一个（total participation）', 'ts', 'middle');
  o += line(280, 14, 280, Y + 60, 'grid');
  return svg(560, Y + 64, o, '上方画出两个 relationship set 的实际 instance：Enrolls 中学生可以连任意多门课，MajorIn 中每个学生恰好连一个 department；下方是对应的 ER 记号，MajorIn 在 Student 一侧画粗线加箭头');
}

// 第 4 站：完整的 ER diagram
function er() {
  let o = '';
  const ent = (x, y, w, s, weak = false) => rect(x, y, w, 40, 'paper') + (weak ? rect(x + 4, y + 4, w - 8, 32, 'frame') : '') + text(x + w / 2, y + 25, s, 'tb', 'middle');
  const dia = (cx, cy, hw, s, dbl = false) => poly([[cx - hw, cy], [cx, cy - 24], [cx + hw, cy], [cx, cy + 24]], 'paper') + (dbl ? poly([[cx - hw + 8, cy], [cx, cy - 18], [cx + hw - 8, cy], [cx, cy + 18]], 'frame') : '') + text(cx, cy + 4.5, s, 'ts', 'middle');
  const att = (cx, cy, s, key = 0, w = 64) => {
    let q = `<ellipse cx="${cx}" cy="${cy}" rx="${w / 2}" ry="14" class="paper"/>` + text(cx, cy + 4.5, s, 't', 'middle');
    const tw = s.length * 6.6;
    if (key === 1) q += line(cx - tw / 2, cy + 7, cx + tw / 2, cy + 7, 'ink');
    if (key === 2) q += line(cx - tw / 2, cy + 7, cx + tw / 2, cy + 7, 'dash');
    return q;
  };
  // Student
  o += line(52, 98, 70, 150, 'ink') + line(126, 98, 108, 150, 'ink');
  o += att(48, 84, 'sid', 1, 52) + att(128, 84, 'name', 0, 62);
  o += ent(30, 150, 110, 'Student');
  // Enrolls
  o += line(140, 170, 182, 170, 'ink') + line(258, 170, 300, 170, 'ink') + line(220, 98, 220, 146, 'ink');
  o += dia(220, 170, 38, 'Enrolls') + att(220, 84, 'grade', 0, 64);
  // Course
  o += line(312, 98, 322, 150, 'ink') + line(370, 98, 358, 150, 'ink');
  o += att(304, 84, 'cid', 1, 52) + att(374, 84, 'title', 0, 56);
  o += ent(300, 150, 80, 'Course');
  // weak entity：Tutorial
  o += line(380, 170, 402, 170, 'ink') + arrow(484, 170, 462, 170, 'ink-b', 8);
  o += dia(432, 170, 30, 'Has', true);
  o += line(518, 98, 518, 150, 'ink') + att(512, 84, 'group', 2, 64);
  o += ent(484, 150, 72, 'Tutorial', true);
  // MajorIn
  o += arrow(85, 190, 85, 270, 'ink-b', 8) + line(127, 294, 210, 294, 'ink');
  o += dia(85, 294, 42, 'MajorIn');
  // Offers
  o += arrow(340, 190, 340, 238, 'ink', 7) + line(318, 274, 300, 274, 'ink');
  o += dia(340, 262, 38, 'Offers');
  // Department
  o += ent(210, 274, 90, 'Dept');
  o += line(230, 314, 214, 340, 'ink') + line(282, 314, 300, 340, 'ink');
  o += att(206, 352, 'dname', 1, 70) + att(310, 352, 'office', 0, 62);
  // 标注
  o += text(98, 236, '每个 Student', 'ts') + text(98, 251, '恰好一个 Dept', 'ts');
  o += text(384, 258, '每个 Course 最多一个 Dept', 'ts');
  o += text(384, 274, '（GEA1000 没有）', 'ts');
  o += text(396, 318, 'Tutorial 双线框：weak entity，', 'ts') + text(396, 334, '要带上 Course 的 cid 才能区分', 'ts');
  o += text(396, 350, 'group 虚下划线：partial key', 'ts');
  return svg(560, 370, o, 'ER diagram：Student 和 Course 通过 Enrolls 相连，Enrolls 带 grade；Student 用粗线加箭头连到 MajorIn，每个学生恰好一个 Dept；Course 用细箭头连到 Offers；Tutorial 是 weak entity，通过双线 diamond Has 依附于 Course');
}

// 第 5 站：attribute closure 逐步计算
function closureA() {
  const F = [['AB', 'C'], ['C', 'D'], ['D', 'B'], ['D', 'E']];
  const frames = [
    { S: 'AC', hl: -1, a: '开始：closure = {A, C}', b: '按顺序扫一遍 F，左边全在 closure 里的 FD 就把右边加进来', fire: false },
    { S: 'AC', hl: 0, a: 'AB → C：B 不在 closure 里，这次用不上', b: '', fire: false },
    { S: 'ACD', hl: 1, a: 'C → D：C 在里面，加入 D', b: 'closure = {A, C, D}', fire: true },
    { S: 'ABCD', hl: 2, a: 'D → B：D 刚加进来，加入 B', b: 'closure = {A, B, C, D}', fire: true },
    { S: 'ABCDE', hl: 3, a: 'D → E：加入 E', b: 'closure = {A, B, C, D, E}', fire: true },
    { S: 'ABCDE', hl: 0, a: '再扫一遍：AB → C 现在左边满足了，但 C 已在', b: '整整一遍没有新东西，停。AC⁺ = ABCDE，AC 是 superkey', fire: false },
  ];
  const n = frames.length, st = 2.3, T = n * st + 1.4;
  const kt = [...frames.map((_, k) => (k * st) / T), 1 - 1e-4];
  const on = (k) => [...frames.map((_, f) => f === k), k === n - 1];
  const FX = 24, FY = 52;
  let o = text(FX, 26, 'F', 'tb') + text(FX + 16, 26, '（R = ABCDE）', 'ts');
  F.forEach(([l, r], i) => { o += text(FX + 18, FY + 8 + i * 32, `${l} → ${r}`, 't'); });
  const BX = 230, BY = 60, bw = 56;
  o += text(BX, 26, 'closure 里有哪些 attribute', 'tb');
  frames.forEach((fr, k) => {
    let g = '';
    if (fr.hl >= 0) g += rect(FX, FY - 12 + fr.hl * 32, 110, 28, fr.fire ? 'wash-strong' : 'wash2', 4);
    'ABCDE'.split('').forEach((c, j) => {
      const inS = fr.S.includes(c), isNew = fr.fire && inS && !frames[k - 1].S.includes(c);
      g += rect(BX + j * (bw + 8), BY, bw, 50, inS ? (isNew ? 'solid' : 'wash-strong') : 'paper-f', 6) + rect(BX + j * (bw + 8), BY, bw, 50, 'frame', 6);
      g += text(BX + j * (bw + 8) + bw / 2, BY + 31, c, isNew ? 'tw' : inS ? 'tb' : 'ts', 'middle');
    });
    g += text(FX, 190, fr.a, 'tl') + text(FX, 212, fr.b, 't');
    o += grp(g, on(k), kt, T);
  });
  o += text(BX, BY + 74, '深色 = 这一步新加的；浅色 = 已在 closure 里', 'ts');
  return svgA(560, 222, o, '动图：用 F = {AB→C, C→D, D→B, D→E} 计算 AC 的 closure：从 {A, C} 开始，依次加入 D、B、E，第二遍扫描没有新 attribute，得到 ABCDE');
}

// 第 6 站：拆错了，join 回来多出 tuple
function lossy() {
  const rh = 24, Y = 36;
  let o = tbl(20, Y, ['sid', 'dept'], [40, 52], STU.map((s) => [s[0], s[2]]), { title: 'R₁(sid, dept)' });
  o += tbl(140, Y, ['name', 'dept'], [52, 52], STU.map((s) => [s[1], s[2]]), { title: 'R₂(name, dept)' });
  const J = [];
  STU.forEach((a) => STU.forEach((b) => { if (a[2] === b[2]) J.push([a[0], b[1], a[2], a[1] !== b[1]]); }));
  o += text(270, Y - 8, 'R₁ ⋈ R₂（按 dept 配对）', 'tb');
  o += tbl(270, Y, ['sid', 'name', 'dept'], [40, 52, 52], J.map((r) => r.slice(0, 3)), { fill: (i) => (J[i][3] ? 'wash-strong' : null) });
  J.forEach((r, i) => { if (r[3]) o += text(424, Y + rh * (i + 1.5) + 4, '← 原来没有', 'tl'); });
  o += text(20, Y + rh * 5 + 30, 'dept = CS 的两行在两边交叉配对，', 'ts');
  o += text(20, Y + rh * 5 + 48, '多出 2 行：行数变多，信息却丢了', 'ts');
  return svg(560, Y + rh * 7 + 8, o, '把 Student 拆成 (sid, dept) 和 (name, dept)，再按 dept join 回去，得到 6 行，其中 (1, Cai, CS) 和 (3, Ana, CS) 是原来没有的');
}

// 第 6 站：BCNF decomposition 逐层展开
function bcnfA() {
  const st = [3.0, 3.0, 3.0, 4.2], T = st.reduce((a, b) => a + b, 0);
  const kt = [0, 3 / T, 6 / T, 9 / T, 1 - 1e-4];
  const from = (k) => [0, 1, 2, 3, 3].map((f) => f >= k);
  const only = (k) => [0, 1, 2, 3, 3].map((f) => f === k);
  const box = (cx, cy, s, cls = 'paper', w = 128) => rect(cx - w / 2, cy - 17, w, 34, cls, 6) + text(cx, cy + 5, s, 'tb', 'middle');
  let o = '';
  // 第 0 层
  o += box(280, 36, 'R(A, B, C, D, E)', 'paper', 150);
  o += grp(text(280, 70, 'keys：AB、AC、AD；C → D 的 C⁺ = BCDE，C 不是 superkey', 'ts', 'middle'), only(0), kt, T);
  // 第 1 层
  let g1 = line(250, 53, 170, 112, 'ink') + line(310, 53, 410, 112, 'ink');
  g1 += box(170, 128, 'R₁(B, C, D, E)') + box(410, 128, 'R₂(A, C)', 'paper', 100);
  g1 += text(196, 84, 'C⁺ ∩ R', 'ts', 'end') + text(378, 72, 'C 加上剩下的 A', 'ts', 'start');
  o += grp(g1, from(1), kt, T);
  o += grp(text(170, 162, 'R₁ 里 key 是 C；D → B 的 D 不是 superkey', 'ts', 'middle') + text(410, 162, '两个 attribute，一定是 BCNF', 'ts', 'middle'), only(1), kt, T);
  // 第 2 层
  let g2 = line(140, 145, 90, 204, 'ink') + line(200, 145, 260, 204, 'ink');
  g2 += box(90, 220, 'R₁₁(B, D, E)', 'paper', 116) + box(260, 220, 'R₁₂(C, D)', 'paper', 100);
  g2 += text(104, 178, 'D⁺ ∩ R₁ = BDE', 'ts', 'end') + text(248, 166, 'D 加上剩下的 C', 'ts', 'start');
  o += grp(g2, from(2), kt, T);
  o += grp(text(90, 254, 'D → BE，key 是 D', 'ts', 'middle') + text(260, 254, 'C → D，key 是 C', 'ts', 'middle'), only(2), kt, T);
  // 完成
  let g3 = box(90, 220, 'R₁₁(B, D, E)', 'wash-strong', 116) + box(260, 220, 'R₁₂(C, D)', 'wash-strong', 100) + box(410, 128, 'R₂(A, C)', 'wash-strong', 100);
  g3 += text(280, 272, '三个 leaf 都是 BCNF。但 AB → C 的 A、B、C 不在同一个 table 里：', 'tl', 'middle');
  g3 += text(280, 292, '这条 FD 没法在任何一个 table 内检查，dependency 丢了', 'tl', 'middle');
  o += grp(g3, only(3), kt, T);
  return svgA(560, 300, o, '动图：BCNF decomposition。R(ABCDE) 先按 C→D 拆成 R1(BCDE) 和 R2(AC)，R1 再按 D→B 拆成 R11(BDE) 和 R12(CD)；最后三个 table 都是 BCNF，但 AB→C 丢失');
}

// 全页用的三个 table
function db() {
  const Y = 30;
  let o = tbl(14, Y, ['sid', 'name', 'dept'], [36, 50, 50], STU, { title: 'Student' });
  o += tbl(176, Y, ['sid', 'cid', 'grade'], [36, 74, 50], ENR, { title: 'Enrolled' });
  o += tbl(362, Y, ['cid', 'dept'], [80, 60], [['CS2102', 'CS'], ['CS2040', 'CS'], ['MA2101', 'Math'], ['GEA1000', null]], { title: 'Course' });
  return svg(560, Y + 24 * 6 + 4, o, '全页使用的三个 table：Student 有 4 行，Enrolled 有 5 行，Course 有 4 行，其中 GEA1000 的 dept 是 NULL');
}

export default {
  'cs2102-db': db,
  'cs2102-flat': flat,
  'cs2102-nlj': nljA,
  'cs2102-plan': plan,
  'cs2102-eval': evalA,
  'cs2102-outer': outer,
  'cs2102-fk': fkA,
  'cs2102-erinst': erinst,
  'cs2102-er': er,
  'cs2102-closure': closureA,
  'cs2102-lossy': lossy,
  'cs2102-bcnf': bcnfA,
};
