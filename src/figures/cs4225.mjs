import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

// ---------- 小工具 ----------
const box = (x, y, w, h, label, cls = 'paper', tcls = 't', rx = 4) =>
  rect(x, y, w, h, cls, rx) + (label ? text(x + w / 2, y + h / 2 + 5, label, tcls, 'middle') : '');
const sub = (s) => `<tspan class="sub" dy="3">${s}</tspan><tspan dy="-3">​</tspan>`;
// 一个在若干帧可见的 group
const g = (body, on, kt, T) => `<g>${body}${ashow(on, kt, T)}</g>`;
const disk = (x, y, w, h, cls = 'paper') => {
  const ry = 5;
  return `<path d="M${f1(x)} ${f1(y + ry)} L${f1(x)} ${f1(y + h - ry)} A${w / 2} ${ry} 0 0 0 ${f1(x + w)} ${f1(y + h - ry)} L${f1(x + w)} ${f1(y + ry)}" class="${cls}"/>` +
    `<ellipse cx="${f1(x + w / 2)}" cy="${f1(y + ry)}" rx="${w / 2}" ry="${ry}" class="${cls}"/>`;
};

// ---------- 开头：读 1 TB ----------
function scan() {
  let o = '';
  // 左：一台机器
  o += text(90, 18, '1 台 machine', 'tb', 'middle');
  o += box(55, 32, 70, 34, 'CPU', 'paper', 'ts') + line(90, 66, 90, 80, 'ink') + disk(70, 80, 40, 34);
  o += text(90, 140, '1 TB 全在这块 disk 上', 'ts', 'middle');
  // 中：100 台，各读本地
  o += text(280, 18, '100 台，各读本地的 10 GB', 'tb', 'middle');
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) {
    const x = 200 + i * 33, y = 32 + j * 50;
    o += rect(x, y, 24, 16, 'paper', 2) + line(x + 12, y + 16, x + 12, y + 22, 'ink') + disk(x + 4, y + 22, 16, 18);
  }
  o += text(280, 140, '每台只读 1/100（画出 10 台）', 'ts', 'middle');
  // 右：100 台从同一个 storage 拉
  o += text(470, 18, '100 台，从一处 storage 拉', 'tb', 'middle');
  for (let i = 0; i < 5; i++) o += rect(400 + i * 30, 32, 22, 14, 'paper', 2) + line(411 + i * 30, 46, 470, 70, 'mute');
  o += rect(430, 68, 80, 8, 'solid', 2) + text(520, 76, '10 Gbit/s', 'ts', 'start');
  o += line(470, 76, 470, 86, 'ink') + disk(450, 86, 40, 30);
  o += text(470, 140, '所有数据挤过一条 link', 'ts', 'middle');
  // 下：时间
  const sx = lin(0, 10000, 150, 540);
  const bars = [['1 台', 10000, '10,000 s ≈ 2.8 h'], ['100 台 本地读', 100, '100 s'], ['100 台 走 network', 800, '800 s']];
  bars.forEach(([lab, v, s], k) => {
    const y = 162 + k * 26;
    o += text(140, y + 13, lab, 'ts', 'end') + rect(150, y, sx(v) - 150, 16, k === 1 ? 'solid' : 'wash2');
    o += text(sx(v) + 6 > 470 ? sx(v) - 6 : sx(v) + 6, y + 13, s, 'ts', sx(v) + 6 > 470 ? 'end' : 'start');
  });
  o += text(280, 252, '读完 1 TB 的时间（disk 100 MB/s，network 1.25 GB/s，按比例画）', 'ts', 'middle');
  return svg(560, 258, o, '读 1 TB：一台 machine 要 1 万秒；100 台各读本地 disk 要 100 秒；100 台都从同一个 storage 经一条 10 Gbit/s 的 link 拉数据要 800 秒');
}

// ---------- 第 1 站：投票计数，map → combine → shuffle → reduce ----------
function voteA() {
  const boxes = [['A', 'B', 'A'], ['A', 'B', 'B'], ['A', 'A', 'A']];
  const comb = [[['A', 2], ['B', 1]], [['A', 1], ['B', 2]], [['A', 3]]];
  // 帧：0 全图；1 选票；2 map output；3 combiner；4 shuffle；5 reduce（=全图）
  const ph = [0, 1, 2, 3, 4, 5, 0];
  const durs = [3.2, 1.3, 1.5, 1.5, 1.5, 2.2];
  const T = durs.reduce((a, b) => a + b, 0);
  const kt = [0]; let acc = 0; for (const s of durs) { acc += s; kt.push(acc / T); }
  const vis = (p) => ph.map((f) => f === 0 || f >= p);
  let o = text(52, 18, 'input split', 'tb', 'middle') + text(150, 18, 'map output', 'tb', 'middle') + text(250, 18, 'combiner', 'tb', 'middle');
  o += text(355, 18, 'shuffle', 'tb', 'middle') + text(480, 18, 'reduce', 'tb', 'middle');
  o += line(300, 26, 300, 270, 'grid') + line(412, 26, 412, 270, 'grid');
  boxes.forEach((b, i) => {
    const y = 34 + i * 82;
    o += rect(14, y, 76, 66, 'paper', 4);
    b.forEach((v, k) => { o += text(52, y + 20 + k * 18, 'Party ' + v, 't', 'middle'); });
    let m = arrow(92, y + 33, 116, y + 33, 'ink');
    b.forEach((v, k) => { m += text(150, y + 20 + k * 18, `(${v}, 1)`, 't', 'middle'); });
    o += g(m, vis(2), kt, T);
    let c = arrow(184, y + 33, 210, y + 33, 'ink') + rect(214, y + 8, 72, 50, 'wash', 4);
    comb[i].forEach(([v, n], k) => { c += text(250, y + 28 + k * 18 + (comb[i].length === 1 ? 9 : 0), `(${v}, ${n})`, 'tb', 'middle'); });
    o += g(c, vis(3), kt, T);
  });
  // shuffle：按 key 分到两个 reducer
  let s = '';
  const rA = [332, 80], rB = [332, 210];
  boxes.forEach((b, i) => {
    const y = 34 + i * 82 + 33;
    s += line(288, y, rA[0] - 6, rA[1], 'mute');
    if (comb[i].some(([v]) => v === 'B')) s += line(288, y, rB[0] - 6, rB[1], 'dash');
  });
  s += text(rA[0], rA[1] + 5, 'A: [2, 1, 3]', 't', 'start') + text(rA[0], rA[1] + 24, 'hash(A) 决定', 'ts', 'start') + text(rA[0], rA[1] + 40, '去 reducer 0', 'ts', 'start');
  s += text(rB[0], rB[1] + 5, 'B: [1, 2]', 't', 'start') + text(rB[0], rB[1] + 24, 'hash(B) 决定', 'ts', 'start') + text(rB[0], rB[1] + 40, '去 reducer 1', 'ts', 'start');
  o += g(s, vis(4), kt, T);
  let r = '';
  r += arrow(414, rA[1], 438, rA[1], 'ink') + box(440, rA[1] - 18, 80, 36, '', 'paper') + text(480, rA[1] + 5, '(A, 6)', 'tb', 'middle');
  r += arrow(414, rB[1], 438, rB[1], 'ink') + box(440, rB[1] - 18, 80, 36, '', 'paper') + text(480, rB[1] + 5, '(B, 3)', 'tb', 'middle');
  r += text(480, 145, 'reduce 把同一个 key', 'ts', 'middle') + text(480, 161, '的 value 加起来', 'ts', 'middle');
  o += g(r, vis(5), kt, T);
  o += text(150, 290, 'map 发出 9 个 pair，combiner 之后只有 5 个过 network', 'ts', 'middle');
  return svgA(560, 296, o, '动图：三个投票箱各是一个 input split；map 对每张票发出 (party, 1)，combiner 在本地合并成 5 个 pair，shuffle 按 key 送到两个 reducer，reduce 得出 A 6 票、B 3 票');
}

// ---------- 第 2 站：pairs 与 stripes ----------
function pairs() {
  const w = ['big', 'data', 'big', 'model'];
  let o = text(280, 18, 'Input：big data big model（neighbor = 左右相邻的词）', 'tb', 'middle');
  w.forEach((s, i) => { o += box(160 + i * 62, 30, 54, 26, s, i % 2 ? 'paper' : 'paper', 't'); });
  const P = [['big', 'data'], ['data', 'big'], ['data', 'big'], ['big', 'data'], ['big', 'model'], ['model', 'big']];
  o += text(140, 86, 'Pairs：每对发一个', 'tb', 'middle');
  P.forEach(([a, b], k) => { o += text(140, 108 + k * 19, `((${a}, ${b}), 1)`, 't', 'middle'); });
  o += text(140, 232, '6 个 key-value pair', 'ts', 'middle');
  o += line(280, 76, 280, 240, 'grid');
  const S = [['big', '{data: 1}'], ['data', '{big: 2}'], ['big', '{data: 1, model: 1}'], ['model', '{big: 1}']];
  o += text(420, 86, 'Stripes：每个词发一个 map', 'tb', 'middle');
  S.forEach(([a, b], k) => { o += text(420, 108 + k * 19, `(${a}, ${b})`, 't', 'middle'); });
  o += text(420, 194, 'reducer 对 big 逐个 entry 相加：', 'ts', 'middle') + text(420, 212, '{data: 2, model: 1}', 'tl', 'middle');
  o += text(420, 232, '4 个 key-value pair，key 只有词本身', 'ts', 'middle');
  return svg(560, 240, o, '同一句 big data big model：pairs 为每一对相邻的词发出一个 count 为 1 的 pair，共 6 个；stripes 为每个词发出一个 associative array，共 4 个');
}

// ---------- 第 2 站：order inversion，reducer 看到的 key 顺序 ----------
function orderinv() {
  let o = text(20, 18, 'mapper 额外为每对 (big, ·) 发一个 ((big, *), 1)', 'tb', 'start');
  const rows = [['(big, *)', '[1, 1, 1]', 'marginal = 3，存下来', true], ['(big, data)', '[1, 1]', '2 / 3', false], ['(big, model)', '[1]', '1 / 3', false]];
  o += text(80, 46, 'reducer 0 收到的 key（已排序）', 'ts', 'middle') + text(250, 46, 'values', 'ts', 'middle') + text(430, 46, 'reducer 做的事', 'ts', 'middle');
  rows.forEach(([k, v, s, hot], i) => {
    const y = 56 + i * 34;
    o += rect(20, y, 120, 26, hot ? 'wash' : 'paper', 3) + text(80, y + 18, k, hot ? 'tl' : 't', 'middle');
    o += text(250, y + 18, v, 't', 'middle') + arrow(300, y + 13, 340, y + 13, 'mute') + text(350, y + 18, s, hot ? 'tl' : 't', 'start');
  });
  o += text(20, 182, '要点 1：sort order 让 * 排在所有真词前面，marginal 先到。', 't', 'start');
  o += text(20, 204, '要点 2：partitioner 只看左边的词，(big, *)、(big, data)、(big, model) 进同一个 reducer。', 't', 'start');
  o += text(20, 226, '否则 (big, model) 可能落到 reducer 1，那里没有 marginal。', 'ts', 'start');
  return svg(560, 234, o, 'Order inversion：reducer 先收到特殊 key (big, *) 并求出 marginal 3，然后依次收到 (big, data) 和 (big, model)，各自除以 3 得到 relative frequency');
}

// ---------- 第 2 站：secondary sort ----------
function secsort() {
  let o = text(20, 18, 'Mapper 发出 composite key (yearMonth, temperature)，value 是 day', 'tb', 'start');
  const recs = [['2024-01', 31, 5], ['2024-02', 30, 3], ['2024-01', 28, 9], ['2024-01', 33, 2], ['2024-02', 34, 7]];
  recs.forEach(([m, t, dd], i) => { o += text(20, 44 + i * 18, `((${m}, ${t}), day ${dd})`, 't', 'start'); });
  o += arrow(200, 80, 240, 80, 'ink') + text(220, 70, 'partition', 'ts', 'middle') + text(220, 98, '只按', 'ts', 'middle') + text(220, 114, 'yearMonth', 'ts', 'middle');
  const R = [['reducer 0', [['2024-01', 33, 2], ['2024-01', 31, 5], ['2024-01', 28, 9]]], ['reducer 1', [['2024-02', 34, 7], ['2024-02', 30, 3]]]];
  R.forEach(([nm, arr], j) => {
    const x = 260 + j * 150;
    o += text(x + 65, 36, nm, 'tb', 'middle') + rect(x, 44, 130, 18 + arr.length * 20, 'paper', 4);
    arr.forEach(([m, t, dd], k) => { o += text(x + 10, 62 + k * 20, `(${m}, ${t}) day ${dd}`, 't', 'start'); });
  });
  o += text(280, 150, '框架按整个 composite key 排序：同一个月里 temperature 由高到低（compareTo 取负号）', 'ts', 'middle');
  o += text(280, 170, 'reducer 不必把一个月的全部 value 读进 memory 再排序', 'ts', 'middle');
  return svg(560, 178, o, 'Secondary sort：mapper 把 temperature 搬进 key，partitioner 只按 yearMonth 分配，框架排序后每个 reducer 收到的同月记录已按 temperature 降序排列');
}

// ---------- 第 3 站：两种 join ----------
function joins() {
  let o = text(140, 18, 'Broadcast join（map-side）', 'tb', 'middle') + text(420, 18, 'Reduce-side join（shuffle by sid）', 'tb', 'middle');
  o += line(280, 10, 280, 250, 'grid');
  // 左：小表复制到每个 mapper
  o += box(90, 32, 100, 28, 'Student 100 MB', 'wash', 'ts');
  for (let i = 0; i < 3; i++) {
    const x = 20 + i * 88;
    o += arrow(140, 60, x + 38, 96, 'mute');
    o += rect(x, 98, 76, 70, 'paper', 4) + text(x + 38, 114, 'mapper ' + i, 'ts', 'middle');
    o += rect(x + 8, 122, 60, 16, 'wash', 2) + text(x + 38, 134, 'hash table', 'ts', 'middle');
    o += rect(x + 8, 144, 60, 16, 'wash2', 2) + text(x + 38, 156, 'Enroll 第 ' + i + ' 块', 'ts', 'middle');
  }
  o += text(140, 192, '大表不动，小表复制给每个 mapper', 't', 'middle');
  o += text(140, 212, '没有 shuffle，也没有 reducer', 'ts', 'middle');
  o += text(140, 230, '条件：小表放得进一个 mapper 的 memory', 'ts', 'middle');
  // 右：两表都按 sid 发出，shuffle
  o += box(300, 32, 90, 28, 'Student', 'wash', 'ts') + box(450, 32, 90, 28, 'Enroll 100 GB', 'wash2', 'ts');
  o += arrow(345, 60, 380, 96, 'mute') + arrow(495, 60, 460, 96, 'mute') + arrow(345, 60, 470, 96, 'dash') + arrow(495, 60, 390, 96, 'dash');
  for (let j = 0; j < 2; j++) {
    const x = 310 + j * 115;
    o += rect(x, 98, 105, 70, 'paper', 4) + text(x + 52, 114, 'reducer ' + j, 'ts', 'middle');
    o += rect(x + 8, 122, 89, 16, 'wash', 2) + text(x + 52, 134, 'S 记录先到', 'ts', 'middle');
    o += rect(x + 8, 144, 89, 16, 'wash2', 2) + text(x + 52, 156, 'E 记录逐条拼', 'ts', 'middle');
  }
  o += text(420, 192, '两张表的每一行都过 network', 't', 'middle');
  o += text(420, 212, '用 secondary sort 让 Student 的行先到', 'ts', 'middle');
  o += text(420, 230, '对表的大小没有要求', 'ts', 'middle');
  return svg(560, 238, o, '左：broadcast join 把小表 Student 复制到每个 mapper 建成 hash table，大表 Enroll 原地扫描，不需要 shuffle；右：reduce-side join 把两张表都按 sid shuffle 到 reducer，Student 的行先到并留在 memory');
}

// ---------- 第 4 站：HDFS ----------
function hdfs() {
  let o = '';
  o += box(20, 28, 150, 74, '', 'paper') + text(95, 46, 'NameNode', 'tb', 'middle');
  o += text(30, 66, 'log.txt → b1, b2', 'ts', 'start') + text(30, 82, 'b1 → D1, D2, D4', 'ts', 'start') + text(30, 98, 'b2 → D2, D3, D4', 'ts', 'start');
  o += box(20, 170, 150, 40, 'client', 'wash', 'tb');
  const D = { D1: ['b1'], D2: ['b1', 'b2'], D3: ['b2'], D4: ['b1', 'b2'] };
  const X = { D1: 260, D2: 335, D3: 410, D4: 485 };
  for (const [k, bl] of Object.entries(D)) {
    const x = X[k];
    o += rect(x - 32, 120, 64, 110, 'paper', 4) + text(x, 138, 'DataNode', 'ts', 'middle') + text(x, 154, k, 'tb', 'middle');
    bl.forEach((b, i) => { o += rect(x - 22, 164 + i * 28, 44, 22, b === 'b1' ? 'wash' : 'wash2', 3) + text(x, 180 + i * 28, b, 't', 'middle'); });
  }
  // 读路径
  o += arrow(80, 168, 80, 106, 'ink') + text(74, 140, '① 问 b1 在哪', 'ts', 'end');
  o += arrow(110, 106, 110, 168, 'mute') + text(116, 140, '② D1, D2, D4', 'ts', 'start');
  o += arrow(172, 190, 236, 182, 'ln') + text(176, 252, '③ 直接从 D1 读 b1，数据不经过 NameNode', 'tl', 'start');
  o += text(280, 18, '1 个 file 切成 128 MB 的 block，每个 block 存 3 份，放在不同的 DataNode', 'ts', 'middle');
  return svg(560, 260, o, 'HDFS：NameNode 只存 file 到 block、block 到 DataNode 的 metadata；client 先问 NameNode 某个 block 在哪，再直接从 DataNode 读数据；每个 block 有 3 个 replica');
}

// HDFS 写：pipeline
function hdfsWrite() {
  let o = box(20, 60, 90, 40, 'client', 'wash', 'tb');
  const xs = [190, 320, 450];
  xs.forEach((x, i) => { o += rect(x - 45, 50, 90, 60, 'paper', 4) + text(x, 72, ['D1', 'D2', 'D4'][i], 'tb', 'middle') + rect(x - 22, 80, 44, 20, 'wash', 3) + text(x, 95, 'b1', 't', 'middle'); });
  o += arrow(112, 74, 143, 74, 'ln') + arrow(237, 74, 273, 74, 'ln') + arrow(367, 74, 403, 74, 'ln');
  o += text(127, 44, 'data', 'ts', 'middle') + text(255, 44, '转发', 'ts', 'middle') + text(385, 44, '转发', 'ts', 'middle');
  o += arrow(403, 96, 367, 96, 'mute') + arrow(273, 96, 237, 96, 'mute') + arrow(143, 96, 112, 96, 'mute');
  o += text(280, 130, '下面的灰箭头是 ack 逆着 pipeline 传回来', 'ts', 'middle');
  o += text(280, 18, 'NameNode 选好 D1、D2、D4；client 只把数据发给第一个，之后一个传一个', 'ts', 'middle');
  return svg(560, 138, o, 'HDFS 写一个 block：client 把数据发给第一个 DataNode，它一边写一边转发给第二个，第二个再转发给第三个，ack 沿反方向传回');
}

// ---------- 第 5 站：MinHash signature 逐行计算 ----------
function minhashA() {
  const M = [[1, 0, 0, 1], [0, 0, 1, 0], [0, 1, 0, 1], [1, 0, 1, 1], [0, 0, 1, 0]];
  const h1 = (x) => (x + 1) % 5, h2 = (x) => (3 * x + 1) % 5;
  const states = [];
  let sig = [[Infinity, Infinity, Infinity, Infinity], [Infinity, Infinity, Infinity, Infinity]];
  states.push(sig.map((r) => r.slice()));
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 4; c++) if (M[r][c]) { sig[0][c] = Math.min(sig[0][c], h1(r)); sig[1][c] = Math.min(sig[1][c], h2(r)); }
    states.push(sig.map((x) => x.slice()));
  }
  // 帧：states[0] = 初始，states[r+1] = 处理完 row r；第一帧和最后一帧是最终结果
  const frames = [5, 0, 1, 2, 3, 4, 5, 5];
  const durs = [3, 1.2, 1.4, 1.4, 1.4, 1.4, 1.4];
  const T = durs.reduce((a, b) => a + b, 0); const kt = [0]; let acc = 0;
  for (let i = 0; i < frames.length - 1; i++) { acc += durs[i]; kt.push(acc / T); }
  let o = '';
  const X0 = 40, Y0 = 46, cw = 44, rh = 26;
  const hdr = ['row', 'S1', 'S2', 'S3', 'S4', 'h₁', 'h₂'];
  hdr.forEach((s, j) => { o += text(X0 + j * cw + cw / 2, Y0 - 10, s, 'tb', 'middle'); });
  o += text(X0 + 2.5 * cw, 18, 'characteristic matrix（element a–e 编号为 row 0–4）', 'ts', 'middle');
  for (let r = 0; r < 5; r++) {
    const y = Y0 + r * rh;
    // 当前处理的 row 高亮：state f 是刚处理完 row f-1；只在中间那几帧高亮
    o += `<rect x="${X0}" y="${y}" width="${7 * cw}" height="${rh}" class="wash" opacity="0">${anim('opacity', frames.map((f, i) => (i > 0 && i < frames.length - 1 && f - 1 === r ? 1 : 0)), kt, T, true)}</rect>`;
    o += text(X0 + cw / 2, y + 18, String(r), 'ts', 'middle');
    for (let c = 0; c < 4; c++) o += text(X0 + (c + 1) * cw + cw / 2, y + 18, String(M[r][c]), M[r][c] ? 'tb' : 'ts', 'middle');
    o += text(X0 + 5 * cw + cw / 2, y + 18, String(h1(r)), 't', 'middle') + text(X0 + 6 * cw + cw / 2, y + 18, String(h2(r)), 't', 'middle');
  }
  o += line(X0 + cw, Y0, X0 + cw, Y0 + 5 * rh, 'grid') + line(X0 + 5 * cw, Y0, X0 + 5 * cw, Y0 + 5 * rh, 'grid');
  // signature matrix
  const SX = 380, SY = 70;
  o += text(SX + 80, 40, 'signature matrix', 'tb', 'middle');
  ['S1', 'S2', 'S3', 'S4'].forEach((s, c) => { o += text(SX + 20 + c * 40 + 20, SY - 8, s, 'ts', 'middle'); });
  ['h₁', 'h₂'].forEach((s, rr) => {
    o += text(SX + 6, SY + 20 + rr * 30, s, 'ts', 'middle');
    for (let c = 0; c < 4; c++) {
      const x = SX + 20 + c * 40, y = SY + rr * 30;
      o += rect(x + 2, y, 36, 26, 'paper', 3);
      const vals = frames.map((f) => { const v = states[f][rr][c]; return v === Infinity ? '∞' : String(v); });
      // 每一帧一个 text，只在那一帧显示
      const uniq = [...new Set(vals)];
      for (const u of uniq) o += `<text x="${x + 20}" y="${y + 18}" class="tb" text-anchor="middle">${u}${ashow(vals.map((v) => v === u), kt, T)}</text>`;
    }
  });
  o += text(SX + 80, SY + 82, '每遇到一个 1，就把该 column 的', 'ts', 'middle') + text(SX + 80, SY + 98, 'entry 换成 min(现值, 这一 row 的 h)', 'ts', 'middle');
  o += text(280, 208, 'S1 和 S4 的 signature 完全相同（真实 Jaccard 2/3），S1 和 S3 一半相同（真实 1/4）', 'ts', 'middle');
  return svgA(560, 216, o, '动图：MMDS 的例子，逐行扫 characteristic matrix，用 h1 = x+1 mod 5、h2 = 3x+1 mod 5 更新 signature matrix，最终 S1 到 S4 的 signature 是 (1,0)、(3,2)、(0,0)、(1,0)');
}

// ---------- 第 5 站：LSH 的 S-curve ----------
function lsh() {
  const sx = lin(0, 1, 60, 520), sy = lin(0, 1, 220, 30);
  let o = axes({ sx, sy, x0: 0, x1: 1, y0: 0, y1: 1, xt: [0, 0.2, 0.4, 0.6, 0.8, 1].map((v) => [v, String(v)]), yt: [0, 0.5, 1].map((v) => [v, String(v)]), grid: true, xl: 'Jaccard similarity s' });
  o += text(60, 18, '成为 candidate pair 的 probability', 'ts', 'start');
  o += path(curve((s) => s, 0, 1, sx, sy), 'dash');
  o += path(curve((s) => 1 - (1 - s ** 5) ** 20, 0, 1, sx, sy), 'ln');
  const th = (1 / 20) ** (1 / 5);
  o += line(sx(th), sy(0), sx(th), sy(1), 'mute') + text(sx(th) + 4, sy(0.06), 'threshold ≈ ' + th.toFixed(2), 'ts', 'start');
  o += text(sx(0.62), sy(0.42), '1 个 minhash：probability = s', 'ts', 'start');
  o += text(sx(0.42), sy(0.72), 'b = 20, r = 5', 'tl', 'end');
  for (const s of [0.2, 0.8]) { const p = 1 - (1 - s ** 5) ** 20; o += circle(sx(s), sy(p), 4, 'ln-f') + text(sx(s) + 6, sy(p) - 6, p.toFixed(s < 0.5 ? 3 : 4), 'ts', 'start'); }
  return svg(560, 250, o, 'LSH banding 的 S 形 curve：b 等于 20、r 等于 5 时，similarity 0.2 的 pair 成为 candidate 的 probability 只有 0.006，similarity 0.8 的是 0.9996；单个 minhash 是一条对角线');
}

// ---------- 第 6 站：k-means 逐轮 ----------
const KP = [[1, 1], [1.5, 2], [2, 1.2], [1.2, 0.4], [2.4, 2.2], [6, 1.5], [7, 1], [6.5, 2.5], [7.5, 2.2], [6.8, 0.5], [3.5, 5.5], [4.5, 6], [4, 4.8], [3, 6.4], [5, 5.2]];
function kmeansA() {
  const near = (C) => KP.map((p) => { let b = 0, bd = 1e9; C.forEach((c, k) => { const dd = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (dd < bd) { bd = dd; b = k; } }); return b; });
  const Cs = [[[1, 1], [1.5, 2], [2, 1.2]]];
  const As = [];
  for (let t = 0; t < 4; t++) {
    const a = near(Cs[t]); As.push(a);
    const Cn = [0, 1, 2].map((k) => { const q = KP.filter((_, i) => a[i] === k); return [q.reduce((s, p) => s + p[0], 0) / q.length, q.reduce((s, p) => s + p[1], 0) / q.length]; });
    Cs.push(Cn);
  }
  const sx = lin(0, 8, 30, 330), sy = lin(0, 7, 250, 30);
  // 帧：0..2 = 第 t 轮 assignment（中心是 Cs[t]），第一帧用最后一轮
  const seq = [2, 0, 1, 2, 2];
  const durs = [2.6, 2.2, 2.2, 2.2];
  const T = durs.reduce((a, b) => a + b, 0); const kt = [0]; let acc = 0; for (const s of durs) { acc += s; kt.push(acc / T); }
  let o = rect(30, 30, 300, 220, 'frame');
  const cls = ['ln-f', 'ink-f', 'mute-f'];
  KP.forEach((p, i) => {
    for (let k = 0; k < 3; k++) {
      const on = seq.map((t) => As[t][i] === k);
      o += `<circle cx="${f1(sx(p[0]))}" cy="${f1(sy(p[1]))}" r="5" class="${cls[k]}">${ashow(on, kt, T)}</circle>`;
    }
  });
  for (let k = 0; k < 3; k++) {
    const xs = seq.map((t) => sx(Cs[t][k][0])), ys = seq.map((t) => sy(Cs[t][k][1]));
    const ds = seq.map((t) => { const x = sx(Cs[t][k][0]), y = sy(Cs[t][k][1]); return `M${f1(x - 8)} ${f1(y - 8)}L${f1(x + 8)} ${f1(y + 8)}M${f1(x - 8)} ${f1(y + 8)}L${f1(x + 8)} ${f1(y - 8)}`; });
    o += apath(ds, kt, T, 'ink-b');
    void xs; void ys;
  }
  // 右侧读数
  const lab = (t) => [`第 ${t + 1} 轮 assignment`, ...[0, 1, 2].map((k) => `center ${k}: (${Cs[t][k][0].toFixed(2)}, ${Cs[t][k][1].toFixed(2)})，${As[t].filter((x) => x === k).length} 个点`)];
  for (let t = 0; t < 3; t++) {
    const on = seq.map((s) => s === t);
    let b = '';
    lab(t).forEach((s, j) => { b += text(350, 70 + j * 22, s, j ? 't' : 'tb', 'start'); });
    o += g(b, on, kt, T);
  }
  o += text(350, 180, '× 是这一轮用来分配的 center', 'ts', 'start');
  o += text(350, 198, '第 3 轮的 assignment 和第 2 轮相同，停', 'ts', 'start');
  o += text(350, 216, '一轮 = 一个 MapReduce job', 'ts', 'start');
  return svgA(560, 262, o, '动图：15 个点、3 个 center 都从左下角的三个点出发；第 1 轮之后 center 移到三团点附近，第 2 轮 assignment 稳定，第 3 轮没有变化，算法停止');
}

// ---------- 第 7 站：strong vs eventual consistency 的时间线 ----------
function consistency() {
  let o = '';
  const sx = lin(0, 10, 120, 540);
  const panel = (y0, title, strong) => {
    o += text(20, y0, title, 'tb', 'start');
    const rows = [['replica A', 0], ['replica B', 1], ['replica C', 2]];
    rows.forEach(([nm, i]) => { const y = y0 + 24 + i * 30; o += text(112, y + 4, nm, 'ts', 'end') + line(sx(0), y, sx(10), y, 'axis'); });
    o += text(112, y0 + 24 + 60 + 18, '（另一个 DC）', 'ts', 'end');
    const yA = y0 + 24, yB = yA + 30, yC = yA + 60;
    o += circle(sx(1), yA, 5, 'ln-f') + text(sx(1), yA - 9, 'write x = 50', 'tl', 'middle');
    o += arrow(sx(1), yA, sx(2), yB - 3, 'mute') + arrow(sx(1), yA, sx(6), yC - 3, 'mute');
    o += text(sx(6) + 6, yC + 18, '复制到达', 'ts', 'start');
    if (strong) {
      o += rect(sx(2), yC - 7, sx(6) - sx(2), 14, 'wash2') + text(sx(4), yC + 4, 'read 被挡住', 'ts', 'middle');
      o += circle(sx(6.6), yC, 5, 'ink-f') + text(sx(6.6) + 8, yC - 9, 'read → 50', 't', 'start');
    } else {
      o += circle(sx(3), yC, 5, 'ink-f') + text(sx(3), yC - 9, 'read → 48（旧值）', 't', 'middle');
      o += circle(sx(7.5), yC, 5, 'ink-f') + text(sx(7.5), yC - 9, 'read → 50', 't', 'middle');
    }
    o += circle(sx(4.5), yB, 5, 'ink-f') + text(sx(4.5), yB - 9, 'read → 50', 't', 'middle');
  };
  panel(18, 'Strong consistency：复制完之前，read 要等', true);
  panel(150, 'Eventual consistency：read 立刻返回，可能是旧值', false);
  o += text(sx(10), 274, 'time →', 'ts', 'end');
  return svg(560, 280, o, '同一次 write 复制到三个 replica：strong consistency 下远处 replica 的 read 要等复制完成才返回新值；eventual consistency 下它立刻返回旧值 48，复制到达之后才返回 50');
}

// ---------- 第 8 站：mod N 与 consistent hashing ----------
function ring() {
  const H = [2, 5, 9, 10, 12, 15, 17, 22, 25, 27, 30, 31];
  let o = '';
  // 左：mod 3 → mod 4
  o += text(120, 18, 'hash mod N：N 从 3 变 4', 'tb', 'middle');
  o += text(40, 40, 'hash', 'ts', 'middle') + text(100, 40, 'mod 3', 'ts', 'middle') + text(160, 40, 'mod 4', 'ts', 'middle');
  H.forEach((h, i) => {
    const y = 58 + i * 17, mv = h % 3 !== h % 4;
    if (mv) o += rect(14, y - 12, 186, 16, 'wash', 2);
    o += text(40, y, String(h), 't', 'middle') + text(100, y, String(h % 3), 't', 'middle') + text(160, y, String(h % 4), mv ? 'tl' : 't', 'middle');
  });
  o += text(110, 274, '12 个 key 里 9 个换了 node', 'tl', 'middle');
  // 右：ring
  const cx = 390, cy = 150, R = 95;
  const P = (h, r = R) => { const a = (h / 32) * 2 * Math.PI - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  o += text(390, 18, 'consistent hashing：加入 N4（位置 6）', 'tb', 'middle');
  o += circle(cx, cy, R, 'ink');
  { const p = P(0, R + 14); o += text(p[0], p[1] + 2, '0', 'ts', 'middle'); }
  // 被 N4 接管的弧：(28, 6]
  const arcPts = []; for (let k = 0; k <= 30; k++) { const h = 28 + (10 * k) / 30; arcPts.push(P(h, R)); }
  o += path(d(arcPts), 'ln');
  const nodes = [['N1', 20], ['N2', 28], ['N3', 13], ['N4', 6]];
  for (const [nm, h] of nodes) {
    const p = P(h), q = P(h, R - 26);
    o += rect(p[0] - 8, p[1] - 8, 16, 16, nm === 'N4' ? 'solid' : 'solid2', 2) + text(q[0], q[1] + 4, nm, nm === 'N4' ? 'tl' : 'tb', 'middle');
  }
  for (const h of H) {
    const p = P(h), mv = h >= 29 || h <= 6;
    o += circle(p[0], p[1], 4, mv ? 'ln-f' : 'paper');
    const q = P(h, R + 13);
    o += text(q[0], q[1] + 4, String(h), mv ? 'tl' : 'ts', 'middle');
  }
  o += text(390, 274, '只有 30、31、2、5 从 N3 搬到 N4', 'tl', 'middle');
  return svg(560, 282, o, '左：12 个 key 用 hash mod N 分配，N 从 3 变成 4 时 9 个换了 node；右：consistent hashing 把 node 和 key 放在同一个 ring 上，key 归顺时针方向的下一个 node，加入 N4 只有 4 个 key 搬家');
}

// ---------- 第 8 站：MongoDB 查询路径 ----------
function mongo() {
  let o = box(220, 20, 120, 34, 'application', 'wash', 'tb');
  o += box(220, 90, 120, 38, 'router (mongos)', 'paper', 't');
  o += box(420, 90, 120, 38, 'config server', 'paper', 't');
  o += arrow(280, 56, 280, 88, 'ink') + text(286, 76, '① query：user_id = 1500', 'ts', 'start');
  o += arrow(342, 104, 418, 104, 'mute') + arrow(418, 116, 342, 116, 'mute') + text(380, 98, '② 哪些 shard', 'ts', 'middle');
  const xs = [60, 220, 380];
  xs.forEach((x, i) => {
    o += rect(x, 180, 120, 60, 'paper', 4) + text(x + 60, 200, 'shard ' + (i + 1), 'tb', 'middle');
    o += text(x + 60, 222, ['user_id 0–999', 'user_id 1000–1999', 'user_id ≥ 2000'][i], 'ts', 'middle');
  });
  o += arrow(262, 130, 262, 178, 'ln');
  o += text(120, 166, 'shard 1、3 不涉及，不发', 'ts', 'middle');
  o += text(268, 158, '③', 'tl', 'start');
  o += arrow(318, 178, 318, 130, 'mute') + text(326, 158, '④ 结果', 'ts', 'start');
  o += text(280, 262, 'mongos 合并各 shard 的结果后返回 ⑤', 'ts', 'middle');
  return svg(560, 270, o, 'MongoDB 的查询路径：application 把 query 发给 router mongos，mongos 问 config server 数据在哪些 shard，只把 query 发给相关的 shard，再合并结果');
}

// ---------- 第 9 站：Spark 的 DAG、stage 与 lineage ----------
function sparkdag() {
  let o = '';
  const cols = [['textFile', 40], ['flatMap', 130], ['map', 220], ['reduceByKey', 360], ['filter', 450]];
  cols.forEach(([nm, x]) => { o += text(x + 30, 36, nm, 'tb', 'middle'); });
  const parts = [0, 1, 2];
  const lost = (c, p) => p === 1 && c <= 2;
  cols.forEach(([nm, x], c) => {
    parts.forEach((p) => {
      const y = 50 + p * 46;
      o += rect(x, y, 60, 32, lost(c, p) ? 'wash-strong' : 'paper', 3) + text(x + 30, y + 21, 'p' + p, 'ts', 'middle');
    });
  });
  // narrow：一对一
  for (let c = 0; c < 2; c++) parts.forEach((p) => { const y = 66 + p * 46; o += arrow(cols[c][1] + 60, y, cols[c + 1][1] - 2, y, 'ink'); });
  for (let c = 3; c < 4; c++) parts.forEach((p) => { const y = 66 + p * 46; o += arrow(cols[c][1] + 60, y, cols[c + 1][1] - 2, y, 'ink'); });
  // wide：全连
  parts.forEach((p) => parts.forEach((q) => { o += line(cols[2][1] + 60, 66 + p * 46, cols[3][1], 66 + q * 46, 'mute'); }));
  // stage 框
  o += rect(30, 26 + 16, 260, 140, 'dash', 6) + rect(350, 42, 170, 140, 'dash', 6);
  o += text(160, 200, 'stage 1：narrow，同一台机器上流水线做完', 'ts', 'middle');
  o += text(435, 200, 'stage 2', 'ts', 'middle');
  o += text(320, 220, 'shuffle：wide dependency，stage 的边界', 'ts', 'middle');
  o += text(20, 246, '深色是挂掉的机器上丢失的 partition：', 't', 'start');
  o += text(20, 266, '只要沿 lineage 把 p1 这一行重算，别的 partition 不动。', 't', 'start');
  return svg(560, 274, o, 'Spark 的 DAG：textFile、flatMap、map 之间是一对一的 narrow dependency，合成 stage 1；reduceByKey 需要所有 partition 的数据，是 wide dependency，在这里 shuffle 并开始 stage 2；丢失的 partition p1 只需沿 lineage 重算这一行');
}

// ---------- 第 10 站：ML pipeline ----------
function pipeline() {
  let o = '';
  const st = [['Tokenizer', 'Transformer', 'words'], ['HashingTF', 'Transformer', 'features'], ['LogisticRegression', 'Estimator', 'model']];
  o += text(280, 18, 'Pipeline.fit(training)：DataFrame 一路往右走，每个 Transformer 追加一个 column', 'ts', 'middle');
  const colsAt = [['id', 'text', 'label'], ['id', 'text', 'label', 'words'], ['id', 'text', 'label', 'words', 'features']];
  colsAt.forEach((cs, i) => {
    const x = 6 + i * 176, y = 40;
    cs.forEach((c, k) => { o += rect(x, y + k * 18, 66, 16, k >= 3 ? 'wash' : 'wash2', 2) + text(x + 33, y + k * 18 + 12, c, 'ts', 'middle'); });
  });
  st.forEach(([nm, kind], i) => {
    const x = 82 + i * 176;
    o += rect(x, 60, 90, 46, kind === 'Estimator' ? 'solid' : 'paper', 4);
    o += text(x + 45, 80, nm.length > 12 ? 'LogisticReg.' : nm, kind === 'Estimator' ? 'tw' : 'tb', 'middle') + text(x + 45, 98, kind, kind === 'Estimator' ? 'tw' : 'ts', 'middle');
    o += arrow(x - 10, 83, x - 2, 83, 'ink');
  });
  o += text(127, 140, 'transform()', 'ts', 'middle') + text(303, 140, 'transform()', 'ts', 'middle') + text(479, 140, 'fit() → model', 'ts', 'middle');
  o += line(14, 158, 546, 158, 'grid');
  o += text(280, 180, '得到 PipelineModel（它是 Transformer）：model.transform(test)', 'ts', 'middle');
  ['Tokenizer', 'HashingTF', 'LR model'].forEach((nm, i) => {
    const x = 90 + i * 140;
    o += box(x, 194, 100, 30, nm, 'paper', 't');
    if (i) o += arrow(x - 38, 209, x - 2, 209, 'ink');
  });
  o += arrow(20, 209, 88, 209, 'ink') + text(20, 202, 'test', 'ts', 'start') + arrow(472, 209, 540, 209, 'ink') + text(506, 202, 'prediction', 'ts', 'middle');
  return svg(560, 232, o, 'Spark ML pipeline：训练时 Tokenizer 和 HashingTF 两个 Transformer 依次给 DataFrame 追加 words 和 features 两个 column，Estimator LogisticRegression 调用 fit 得到 model；得到的 PipelineModel 在 test 数据上依次 transform 输出 prediction');
}

// ---------- 第 11 站：y / a / m 的 power iteration ----------
const YAM = { y: [100, 70], a: [60, 190], m: [210, 220] };
function yamGraph(o, rs, kt, T, trap = false, dead = false) {
  const { y, a, m } = YAM;
  const R = (v) => 12 + 46 * Math.sqrt(v);
  // edges
  const e = (p, q, off = 0) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * off, ny = ux * off;
    return arrow(p[0] + ux * 34 + nx, p[1] + uy * 34 + ny, q[0] - ux * 34 + nx, q[1] - uy * 34 + ny, 'mute', 6);
  };
  o += e(y, a, 6) + e(a, y, 6) + e(a, m, 6);
  if (!dead && !trap) o += e(m, a, 6);
  o += `<path d="M${y[0] - 14} ${y[1] - 30} C ${y[0] - 30} ${y[1] - 70}, ${y[0] + 30} ${y[1] - 70}, ${y[0] + 14} ${y[1] - 30}" class="mute"/>` + poly([[y[0] + 14, y[1] - 30], [y[0] + 20, y[1] - 40], [y[0] + 9, y[1] - 38]], 'mute-f');
  if (trap) o += `<path d="M${m[0] + 30} ${m[1] - 14} C ${m[0] + 70} ${m[1] - 30}, ${m[0] + 70} ${m[1] + 30}, ${m[0] + 30} ${m[1] + 14}" class="mute"/>` + poly([[m[0] + 30, m[1] + 14], [m[0] + 41, m[1] + 18], [m[0] + 38, m[1] + 8]], 'mute-f');
  ['y', 'a', 'm'].forEach((k, i) => {
    const p = YAM[k];
    const rr = rs.map((r) => R(r[i]));
    o += `<circle cx="${p[0]}" cy="${p[1]}" r="${f1(rr[0])}" class="wash">${anim('r', rr.map(f1), kt, T)}</circle>`;
    o += circle(p[0], p[1], 14, 'paper') + text(p[0], p[1] + 5, k, 'tb', 'middle');
  });
  return o;
}
function yamA() {
  const M = [[0.5, 0.5, 0], [0.5, 0, 1], [0, 0.5, 0]];
  const rs = [[1 / 3, 1 / 3, 1 / 3]];
  for (let t = 0; t < 30; t++) { const r = rs[t]; rs.push(M.map((row) => row.reduce((s, v, j) => s + v * r[j], 0))); }
  const show = [30, 0, 1, 2, 3, 4, 5, 6, 8, 12, 30];
  const durs = [2.6, 1, 1, 1, 1, 1, 1, 1, 1, 1.4];
  const T = durs.reduce((a, b) => a + b, 0); const kt = [0]; let acc = 0; for (const s of durs) { acc += s; kt.push(acc / T); }
  let o = yamGraph('', show.map((t) => rs[t]), kt, T);
  o += text(130, 280, '圆的面积 ∝ 当前的 r', 'ts', 'middle');
  // 右：数表
  const X = 300;
  o += text(X, 30, it('t'), 'tb', 'middle') + text(X + 70, 30, it('r') + sub('y'), 'tb', 'middle') + text(X + 140, 30, it('r') + sub('a'), 'tb', 'middle') + text(X + 210, 30, it('r') + sub('m'), 'tb', 'middle');
  const rowsT = [0, 1, 2, 3, 4, 8, 12, 30];
  rowsT.forEach((t, i) => {
    const y = 54 + i * 24;
    const on = show.map((s) => s === t);
    o += `<rect x="${X - 20}" y="${y - 16}" width="250" height="22" class="wash" opacity="0">${anim('opacity', on.map((v) => (v ? 1 : 0)), kt, T, true)}</rect>`;
    o += text(X, y, t === 30 ? '∞' : String(t), 't', 'middle');
    rs[t].forEach((v, j) => { o += text(X + 70 + 70 * j, y, v.toFixed(3), 't', 'middle'); });
  });
  o += text(X + 105, 262, '收敛到 (0.4, 0.4, 0.2)，一边振荡一边收敛', 'ts', 'middle');
  return svgA(560, 288, o, '动图：y、a、m 三个 page，y 链向自己和 a，a 链向 y 和 m，m 链向 a；power iteration 从每个 1/3 出发，r 一边振荡一边收敛到 0.4、0.4、0.2');
}

// dead end / spider trap / teleport
function trapsA() {
  const Md = [[0.5, 0.5, 0], [0.5, 0, 0], [0, 0.5, 0]];
  const Mt = [[0.5, 0.5, 0], [0.5, 0, 0], [0, 0.5, 1]];
  const run = (M, beta, n) => { const rs = [[1 / 3, 1 / 3, 1 / 3]]; for (let t = 0; t < n; t++) { const r = rs[t]; rs.push(M.map((row) => beta * row.reduce((s, v, j) => s + v * r[j], 0) + (1 - beta) / 3)); } return rs; };
  const N = 12;
  const D = run(Md, 1, N), S = run(Mt, 1, N), Tp = run(Mt, 0.8, N);
  const seq = [N, ...Array.from({ length: N + 1 }, (_, i) => i), N];
  const durs = [2.6, ...Array(N).fill(0.7), 1.6];
  const T = durs.reduce((a, b) => a + b, 0); const kt = [0]; let acc = 0; for (const s of durs) { acc += s; kt.push(acc / T); }
  let o = '';
  // 每个 panel 上方画出那个 graph：y、a、m 排成一行
  const mini = (x0, kind) => {
    const P = { y: [x0 + 35, 66], a: [x0 + 90, 66], m: [x0 + 145, 66] }, r = 11;
    let s = '';
    s += arrow(P.y[0] + r, 62, P.a[0] - r, 62, 'mute', 5) + arrow(P.a[0] - r, 70, P.y[0] + r, 70, 'mute', 5);
    s += arrow(P.a[0] + r, 66, P.m[0] - r, 66, 'mute', 5);
    const loop = (p) => `<path d="M${p[0] - 7} ${p[1] - 9} C ${p[0] - 18} ${p[1] - 34}, ${p[0] + 18} ${p[1] - 34}, ${p[0] + 7} ${p[1] - 9}" class="mute"/>` + poly([[p[0] + 7, p[1] - 9], [p[0] + 12, p[1] - 17], [p[0] + 4, p[1] - 17]], 'mute-f');
    s += loop(P.y);
    if (kind !== 'dead') s += loop(P.m);
    ['y', 'a', 'm'].forEach((k) => { s += circle(P[k][0], P[k][1], r, k === 'm' ? 'solid' : 'paper') + text(P[k][0], P[k][1] + 4, k, k === 'm' ? 'tw' : 'tb', 'middle'); });
    return s;
  };
  const panel = (x0, title, note, rs, kind) => {
    o += text(x0 + 85, 18, title, 'tb', 'middle');
    o += mini(x0, kind);
    const sy = lin(0, 1, 240, 118);
    o += line(x0 + 10, 240, x0 + 165, 240, 'axis') + line(x0 + 10, sy(1), x0 + 165, sy(1), 'grid') + text(x0 + 8, sy(1) + 4, '1', 'ts', 'end') + text(x0 + 8, 244, '0', 'ts', 'end');
    ['y', 'a', 'm'].forEach((k, j) => {
      const x = x0 + 22 + j * 50;
      const ds = seq.map((t) => { const v = rs[t][j]; return `M${x} 240L${x} ${f1(sy(v))}L${x + 34} ${f1(sy(v))}L${x + 34} 240Z`; });
      o += apath(ds, kt, T, j === 2 ? 'solid' : 'wash-strong');
      o += text(x + 17, 256, k, 'tb', 'middle');
    });
    // 和
    const vals = seq.map((t) => 'sum = ' + rs[t].reduce((s, v) => s + v, 0).toFixed(3));
    for (const u of [...new Set(vals)]) o += `<text x="${x0 + 85}" y="106" class="ts" text-anchor="middle">${u}${ashow(vals.map((v) => v === u), kt, T)}</text>`;
    o += text(x0 + 85, 274, note, 'ts', 'middle');
  };
  panel(10, 'Dead end：m 没有 out-link', '总和一直漏', D, 'dead');
  panel(195, 'Spider trap：m 只链向自己', 'm 吸走全部', S, 'trap');
  panel(380, 'Spider trap + teleport', 'β = 0.8，m 停在 0.636', Tp, 'trap');
  const ts = seq.map((t) => 't = ' + t);
  for (const u of [...new Set(ts)]) o += `<text x="280" y="298" class="tb" text-anchor="middle">${u}${ashow(ts.map((v) => v === u), kt, T)}</text>`;
  return svgA(560, 304, o, '动图：三组柱子是 y、a、m 的 PageRank 随 power iteration 变化；m 是 dead end 时总和一路漏到接近 0；m 是 spider trap 时 m 吸走几乎全部；加上 beta 0.8 的 teleport 后稳定在 0.212、0.152、0.636');
}

// ---------- 第 12 站：Pregel 求最大值 ----------
function pregel() {
  // 图：v0 <-> v1, v2 -> v1, v2 <-> v3, v1 -> v3
  const out = [[1], [0, 3], [1, 3], [2]];
  let val = [3, 6, 2, 1];
  const steps = [];
  let active = [true, true, true, true];
  let msgs = [[], [], [], []];
  for (let s = 0; s < 4; s++) {
    const nv = val.slice(), send = [[], [], [], []], halted = [];
    for (let v = 0; v < 4; v++) {
      if (!active[v] && msgs[v].length === 0) { halted.push(true); continue; }
      let changed = s === 0;
      for (const m of msgs[v]) if (m > nv[v]) { nv[v] = m; changed = true; }
      if (changed) { for (const w of out[v]) send[w].push(nv[v]); halted.push(false); } else halted.push(true);
    }
    steps.push({ val: nv, halted, sent: send.map((a) => a.length) , msgsFrom: out.map((ws, v) => !halted[v] ? ws : [])});
    val = nv; msgs = send; active = halted.map((h) => !h);
  }
  const X = [70, 170, 270, 370], R = 18;
  let o = '';
  steps.forEach((st, s) => {
    const y = 36 + s * 68;
    o += text(500, y + 5, 'superstep ' + s, 'tb', 'middle');
    // 边
    o += arrow(X[0] + R, y - 3, X[1] - R, y - 3, 'grid', 5) + arrow(X[1] - R, y + 3, X[0] + R, y + 3, 'grid', 5);
    o += arrow(X[2] - R, y, X[1] + R, y, 'grid', 5);
    o += arrow(X[2] + R, y - 3, X[3] - R, y - 3, 'grid', 5) + arrow(X[3] - R, y + 3, X[2] + R, y + 3, 'grid', 5);
    o += `<path d="M${X[1] + 8} ${y - R + 2} Q ${(X[1] + X[3]) / 2} ${y - 44} ${X[3] - 8} ${y - R}" class="grid"/>` + (() => { const ex = X[3] - 8, ey = y - R, dx = ex - (X[1] + X[3]) / 2, dy = ey - (y - 44), L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L; return poly([[ex, ey], [ex - 8 * ux - 3.5 * uy, ey - 8 * uy + 3.5 * ux], [ex - 8 * ux + 3.5 * uy, ey - 8 * uy - 3.5 * ux]], 'mute-f'); })();
    st.val.forEach((v, i) => { o += circle(X[i], y, R, st.halted[i] ? 'solid2' : 'paper') + text(X[i], y + 5, String(v), st.halted[i] ? 'tw' : 'tb', 'middle'); });
    if (s < 3) st.msgsFrom.forEach((ws, v) => ws.forEach((w) => { o += line(X[v], y + R + 2, X[w], y + 68 - R - 4, 'dash'); }));
  });
  o += text(20, 300, '深色：这一步没有变化，vote to halt。虚线：发给下一个 superstep 的 message。', 'ts', 'start');
  return svg(560, 306, o, 'Pregel 求最大值：四个 vertex 初值 3、6、2、1；每个 superstep 值变大的 vertex 把新值发给 out-neighbor，没变的 vote to halt；superstep 2 时全部变成 6，superstep 3 时全部 halt');
}

// ---------- 第 13 站：reservoir sampling ----------
function reservoirA() {
  // 固定 seed 的一次运行，B = 3，stream 10 个
  let seed = 7; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
  const B = 3, n = 10;
  const res = [], states = [], events = [];
  for (let t = 1; t <= n; t++) {
    if (t <= B) { res.push(t); events.push(`a${t} 直接放入`); }
    else {
      const u = rnd();
      if (u < B / t) { const k = Math.floor(rnd() * B); events.push(`a${t}：以 ${B}/${t} 被选中，换掉 a${res[k]}`); res[k] = t; }
      else events.push(`a${t}：以 ${t - B}/${t} 落选`);
    }
    states.push(res.slice());
  }
  const seq = [n - 1, ...Array.from({ length: n }, (_, i) => i), n - 1];
  const durs = [2.6, ...Array(n - 1).fill(1.1), 1.4];
  const T = durs.reduce((a, b) => a + b, 0); const kt = [0]; let acc = 0; for (const s of durs) { acc += s; kt.push(acc / T); }
  let o = text(20, 20, 'stream', 'tb', 'start');
  for (let t = 1; t <= n; t++) {
    const x = 20 + (t - 1) * 52;
    o += `<rect x="${x}" y="32" width="44" height="28" rx="3" class="paper"/>`;
    o += `<rect x="${x}" y="32" width="44" height="28" rx="3" class="wash-strong" opacity="0">${anim('opacity', seq.map((s) => (s === t - 1 ? 1 : 0)), kt, T, true)}</rect>`;
    o += text(x + 22, 51, 'a' + t, 't', 'middle');
  }
  o += text(20, 100, 'reservoir（B = 3）', 'tb', 'start');
  for (let k = 0; k < B; k++) {
    const x = 170 + k * 70;
    o += rect(x, 84, 60, 34, 'paper', 4);
    const vals = seq.map((s) => states[s][k] === undefined ? '' : 'a' + states[s][k]);
    for (const u of [...new Set(vals)]) if (u) o += `<text x="${x + 30}" y="106" class="tb" text-anchor="middle">${u}${ashow(vals.map((v) => v === u), kt, T)}</text>`;
  }
  const ev = seq.map((s) => events[s]);
  for (const u of [...new Set(ev)]) o += `<text x="20" y="150" class="tl" text-anchor="start">${u}${ashow(ev.map((v) => v === u), kt, T)}</text>`;
  o += text(20, 180, '第 t 个 item 以 B/t 的 probability 进入，进入时等概率换掉一个旧的。', 'ts', 'start');
  o += text(20, 198, '任何时刻，已到的 t 个 item 各自留在 reservoir 里的 probability 都是 B/t。', 'ts', 'start');
  return svgA(560, 206, o, '动图：B 等于 3 的 reservoir sampling 处理 10 个 item 的一次运行，前 3 个直接放入，之后第 t 个以 3/t 的 probability 换掉一个随机的旧 item');
}

// ---------- 第 13 站：Storm topology ----------
function storm() {
  let o = '';
  o += box(20, 100, 90, 44, 'spout', 'solid', 'tw') + text(65, 160, 'sentence', 'ts', 'middle');
  const split = [50, 120, 190], count = [70, 170];
  split.forEach((y) => { o += box(200, y, 96, 36, 'split task', 'paper', 'ts'); o += arrow(112, 122, 198, y + 18, 'mute'); });
  count.forEach((y, j) => { o += box(420, y, 110, 36, 'count task ' + j, 'paper', 'ts'); });
  o += text(155, 40, 'shuffle grouping', 'tl', 'middle') + text(155, 240, '句子随便分给哪个 task', 'ts', 'middle');
  // fields grouping：同一个词去同一个 task
  split.forEach((y) => { o += arrow(298, y + 18, 418, 88, 'ln-dash'); o += arrow(298, y + 18, 418, 188, 'mute'); });
  o += text(360, 40, 'fields grouping on word', 'tl', 'middle');
  o += text(475, 240, '“data” 永远去 task 0', 'ts', 'middle') + text(475, 256, 'hash(word) mod 2', 'ts', 'middle');
  o += text(250, 18, 'spout 产生 tuple，bolt 处理 tuple；每个 bolt 有多个 task 并行', 'ts', 'middle');
  return svg(560, 262, o, 'Storm 的 word count topology：spout 发出句子，shuffle grouping 把句子随机分给三个 split task；split 发出的词按 fields grouping 以 word 的 hash 分给两个 count task，同一个词总去同一个 task');
}

export default {
  'cs4225-scan': scan,
  'cs4225-vote': voteA,
  'cs4225-pairs': pairs,
  'cs4225-orderinv': orderinv,
  'cs4225-secsort': secsort,
  'cs4225-joins': joins,
  'cs4225-hdfs': hdfs,
  'cs4225-hdfswrite': hdfsWrite,
  'cs4225-minhash': minhashA,
  'cs4225-lsh': lsh,
  'cs4225-kmeans': kmeansA,
  'cs4225-consistency': consistency,
  'cs4225-ring': ring,
  'cs4225-mongo': mongo,
  'cs4225-sparkdag': sparkdag,
  'cs4225-pipeline': pipeline,
  'cs4225-yam': yamA,
  'cs4225-traps': trapsA,
  'cs4225-pregel': pregel,
  'cs4225-reservoir': reservoirA,
  'cs4225-storm': storm,
};
