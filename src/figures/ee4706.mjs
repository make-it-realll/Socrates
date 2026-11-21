import { svg, svgA, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, axes, apath, acircle, ashow, anim, f1 } from '../lib/svg.mjs';

const kts = (n) => Array.from({ length: n + 1 }, (_, i) => i / n);
const atrans = (xs, ys, kt, dur) =>
  `<animateTransform attributeName="transform" type="translate" values="${xs.map((x, i) => f1(x) + ' ' + f1(ys[i])).join(';')}" keyTimes="${kt.map((t) => (Math.round(t * 1e5) / 1e5).toString()).join(';')}" dur="${dur}s" repeatCount="indefinite"/>`;
const minus = (s) => String(s).replace('-', '−');

// 开头：synchronous 执行时每个 chunk 之间停一下；asynchronous 时 inference 和执行重叠
function pause() {
  const sx = lin(0, 1.6, 120, 540);
  let o = '';
  const bar = (t0, t1, y, h, cls) => rect(sx(t0), y, sx(t1) - sx(t0), h, cls);
  o += text(112, 46, 'synchronous', 'tb', 'end') + text(112, 62, '执行完才开始想', 'ts', 'end');
  o += text(112, 128, 'asynchronous', 'tb', 'end') + text(112, 144, '边执行边想', 'ts', 'end');
  // synchronous：robot 的运动条 + inference 条
  const syncMove = [[0.1, 0.6], [0.7, 1.2], [1.3, 1.6]], syncInf = [[0, 0.1], [0.6, 0.7], [1.2, 1.3]];
  for (const [a, b] of syncMove) o += bar(a, b, 36, 18, 'solid');
  for (const [a, b] of syncInf) o += bar(a, b, 58, 12, 'wash2 ink-s');
  for (const [a, b] of syncInf.slice(1)) o += bar(a, b, 36, 18, 'paper') + text(sx((a + b) / 2), 30, '停', 'tl', 'middle');
  o += text(sx(0.35), 49, 'chunk 1：执行 25 步', 'tw', 'middle') + text(sx(0.95), 49, 'chunk 2', 'tw', 'middle');
  o += text(sx(0.65), 84, 'inference 100 ms', 'ts', 'middle');
  // asynchronous
  o += bar(0.1, 1.6, 118, 18, 'solid');
  for (const [a, b] of [[0, 0.1], [0.5, 0.6], [1.0, 1.1], [1.5, 1.6]]) o += bar(a, b, 140, 12, 'wash2 ink-s');
  for (const t of [0.6, 1.1]) o += line(sx(t), 114, sx(t), 156, 'dash');
  o += text(sx(0.35), 131, 'chunk 1', 'tw', 'middle') + text(sx(0.85), 131, 'chunk 2', 'tw', 'middle') + text(sx(1.35), 131, 'chunk 3', 'tw', 'middle');
  o += text(sx(0.55), 168, '提前 d = 5 步开始想', 'ts', 'middle');
  // 时间轴
  o += line(sx(0), 186, sx(1.6), 186, 'axis');
  for (let t = 0; t <= 1.6001; t += 0.2) o += line(sx(t), 186, sx(t), 190, 'axis') + text(sx(t), 204, t.toFixed(1), 'ts', 'middle');
  o += text(sx(1.6), 220, '时间（s）', 'ts', 'end');
  o += text(10, 240, 'Δt = 20 ms（50 Hz），每个 chunk 执行 s = 25 步 = 0.5 s。深色是 robot 在动，灰色是 model 在算。', 'ts');
  return svg(560, 248, o, 'Synchronous 执行时每执行完一个 chunk 就停下等 100 ms 的 inference；asynchronous 执行时提前开始 inference，robot 不停，但新旧 chunk 在切换处要接得上');
}

// 第 1 站：两种 latency 下的刹车距离
function reactA() {
  // 帧按真实时间每 50 ms 一帧；从 t = 1.3 s（两台都已停下）开始播，第一帧就能看出结果
  const N = 60, ts0 = kts(N).map((k) => k * 3);
  const ord = [...Array.from({ length: N - 25 }, (_, j) => 26 + j), ...Array.from({ length: 27 }, (_, j) => j)];
  const ts = ord.map((i) => ts0[i]), kt = kts(ord.length - 1), T = (ord.length - 1) * 0.05;
  const v = 0.5, a = 2, gap = 0.4;
  const pos = (lat, t) => {
    if (t <= lat) return v * t;
    const tb = Math.min(t - lat, v / a);
    return v * lat + v * tb - 0.5 * a * tb * tb;
  };
  const sx = lin(0, 0.7, 210, 530);
  const lane = (y, lat, name, sub) => {
    let q = line(sx(-0.12), y + 30, sx(0.72), y + 30, 'grid') + line(sx(-0.12), y - 30, sx(0.72), y - 30, 'grid');
    q += text(10, y - 4, name, 'tb') + text(10, y + 13, sub, 'ts');
    // person：top-down 的头和肩
    const px = sx(gap) + 5;
    q += `<ellipse cx="${f1(px + 4)}" cy="${y}" rx="9" ry="22" class="wash-strong ink-s"/>` + circle(px + 4, y, 8, 'paper');
    q += text(px + 4, y - 36, 'person', 'ts', 'middle');
    // robot：前缘在 x = sx(pos)
    const xs = ts.map((t) => Math.min(pos(lat, t), gap)).map((p) => sx(p) - sx(0));
    const body = rect(sx(0) - 58, y - 18, 58, 36, 'paper', 5) + rect(sx(0) - 50, y - 24, 16, 6, 'ink-f') + rect(sx(0) - 50, y + 18, 16, 6, 'ink-f') + rect(sx(0) - 22, y - 24, 16, 6, 'ink-f') + rect(sx(0) - 22, y + 18, 16, 6, 'ink-f') + text(sx(0) - 29, y + 5, 'robot', 'ts', 'middle');
    q += `<g>${body}${atrans(xs, xs.map(() => 0), kt, T)}</g>`;
    return q;
  };
  let o = lane(60, 1.0, 'Deliberative loop', 'latency 1 s') + lane(170, 0.03, 'Reflex layer', 'latency 30 ms');
  // A：碰撞标注
  const hitK = ts.map((t) => t >= 0.8);
  o += `<g>${text(sx(0), 108, 't = 0.8 s 撞上：还在 latency 里，没开始刹车', 'tl', 'start').replace('</text>', ashow(hitK, kt, T) + '</text>')}</g>`;
  // B：停下的位置
  const stopB = ts.map((t) => t >= 0.28);
  o += text(sx(0.0775), 214, '停在 0.078 m，离 person 还有 0.32 m', 'tl', 'start').replace('</text>', ashow(stopB, kt, T) + '</text>');
  // 距离标尺
  o += line(sx(0), 236, sx(0.7), 236, 'axis');
  for (const m of [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) o += line(sx(m), 236, sx(m), 240, 'axis') + text(sx(m), 254, m.toFixed(1), 'ts', 'middle');
  o += text(sx(0.7), 270, 'robot 前缘走过的距离（m）', 'ts', 'end');
  // 时钟
  for (let i = 0; i <= N; i++) {
    const on = ord.map((q) => q === i);
    o += text(10, 254, `t = ${ts0[i].toFixed(2)} s`, 'tb').replace('</text>', ashow(on, kt, T) + '</text>');
  }
  o += text(10, 292, 'v = 0.5 m/s，刹车 deceleration 2 m/s²，person 在 0.4 m 外出现（t = 0）。', 'ts');
  return svgA(560, 300, o, '两台同样速度的 robot，person 在 0.4 m 外出现。Latency 1 s 的那台在开始刹车前就撞上；latency 30 ms 的那台在 0.078 m 处停下');
}

// 第 1 站：三层 architecture 与 π0.5 的对应
function layers() {
  let o = '';
  const box = (y, h, title, rate, desc, cls) => rect(20, y, 250, h, cls, 6) + text(32, y + 20, title, 'tb') + text(258, y + 20, rate, 'tl', 'end') + text(32, y + 38, desc, 'ts');
  o += text(145, 16, '经典的三层 architecture', 'tb', 'middle') + text(420, 16, 'π0.5 里的对应', 'tb', 'middle');
  o += box(28, 52, 'Deliberator', '秒级', '想下一步做什么：plan、推理', 'paper');
  o += box(108, 52, 'Sequencer', '每个 subtask', '挑出并切换 skill，监视成败', 'paper');
  o += box(188, 52, 'Controller', '50 Hz 以上', '把 skill 变成 motor command', 'wash');
  o += arrow(145, 80, 145, 106, 'ink') + arrow(145, 160, 145, 186, 'ink');
  o += arrow(110, 186, 110, 162, 'mute') + arrow(110, 106, 110, 82, 'mute');
  o += text(152, 98, '往下传：目标', 'ts') + text(152, 178, '往下传：skill', 'ts');
  o += text(104, 98, '往上报', 'ts', 'end') + text(104, 178, '往上报', 'ts', 'end');
  // 右边
  const rb = (y, h, t1, t2, cls) => rect(310, y, 230, h, cls, 6) + text(322, y + 20, t1, 'tb') + text(322, y + 38, t2, 'ts');
  o += rb(28, 52, '同一个 VLM 先 output 文字', '“pick up the plate”：一个 subtask', 'paper');
  o += rb(128, 52, 'Action expert（flow matching）', '读 subtask，output 一个 action chunk', 'paper');
  o += rb(208, 40, 'PD controller，50 Hz', '跟踪 chunk 里的 target pose', 'wash');
  o += arrow(425, 80, 425, 126, 'ink') + arrow(425, 180, 425, 206, 'ink');
  o += text(432, 108, '接口是一句话', 'ts');
  for (const [y1, y2] of [[54, 54], [140, 154], [214, 228]]) o += line(272, y1, 308, y2, 'dash');
  o += text(280, 272, '虚线连起功能相同的层。Sequencer 和 deliberator 在 π0.5 里合进了同一个 model 的两次 output。', 'ts', 'middle');
  return svg(560, 280, o, '左边是经典的 deliberator、sequencer、controller 三层，越往下越快；右边是 π0.5 的对应：同一个 VLM 先 output 文字 subtask，action expert 再 output action chunk，最底层是 50 Hz 的 PD controller');
}

// 第 2 站：CLIP 的 similarity matrix
function clip() {
  const S = [[0.31, 0.24, 0.22], [0.20, 0.29, 0.25], [0.23, 0.21, 0.30]];
  const scale = 100;
  const sm = (r) => { const m = Math.max(...r), e = r.map((v) => Math.exp(v - m)), z = e.reduce((p, q) => p + q, 0); return e.map((v) => v / z); };
  const rows = S.map((r) => sm(r.map((v) => v * scale)));
  let o = '';
  const X0 = 200, Y0 = 92, W = 112, Hc = 62;
  const caps = ['a yellow sponge', 'a white mug', 'a red apple'];
  for (let j = 0; j < 3; j++) {
    o += rect(X0 + j * W + 6, 34, W - 12, 40, 'paper', 4) + text(X0 + j * W + W / 2, 50, `T${j + 1}`, 'tb', 'middle') + text(X0 + j * W + W / 2, 66, caps[j], 'ts', 'middle');
  }
  o += text(X0 + 1.5 * W, 20, 'text encoder 的 output', 'ts', 'middle');
  // 三张“image”：画出物体本身
  const img = (i) => {
    const y = Y0 + i * Hc, x = 96;
    let q = rect(x, y + 4, 72, Hc - 8, 'frame', 3) + text(x - 10, y + Hc / 2 + 5, `I${i + 1}`, 'tb', 'end');
    const cx = x + 36, cy = y + Hc / 2;
    if (i === 0) q += rect(cx - 22, cy - 10, 44, 20, 'wash-strong ink-s', 4) + rect(cx - 22, cy - 10, 44, 6, 'solid2', 2);
    if (i === 1) q += rect(cx - 13, cy - 14, 24, 28, 'paper', 3) + `<path d="M${cx + 11} ${cy - 8} q 10 0 10 8 q 0 8 -10 8" class="ink"/>`;
    if (i === 2) q += circle(cx, cy + 2, 14, 'wash-strong ink-s') + line(cx, cy - 12, cx + 3, cy - 19, 'ink');
    return q;
  };
  for (let i = 0; i < 3; i++) o += img(i);
  o += text(20, 84, 'image', 'ts') + text(20, 98, 'encoder 的', 'ts') + text(20, 112, 'output', 'ts');
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
    const x = X0 + j * W, y = Y0 + i * Hc;
    o += rect(x + 6, y + 4, W - 12, Hc - 8, i === j ? 'wash-strong' : 'paper', 4);
    o += text(x + W / 2, y + 26, `cos = ${S[i][j].toFixed(2)}`, i === j ? 'tb' : 't', 'middle');
    const p = rows[i][j];
    o += text(x + W / 2, y + 44, `softmax ${p < 0.0005 ? '0.000' : p.toFixed(3)}`, 'ts', 'middle');
  }
  o += text(280, 300, '每一 row 乘以 logit scale 100 再做 softmax，正确 caption 在 diagonal 上。', 'ts', 'middle');
  o += text(280, 318, '第一 row 的 cosine 只差 0.07，乘 100 之后差 7，softmax 已经几乎是 one-hot。', 'ts', 'middle');
  return svg(560, 326, o, '三张 image 和三条 caption 的 cosine similarity matrix，diagonal 是配对的那一组；每一 row 乘以 100 后做 softmax，几乎全部 probability 落在 diagonal 上');
}

// 第 3 站：一条 beam 上的 occupancy 更新（动图）
function gridA() {
  const lo = (p) => Math.log(p / (1 - p));
  const lh = lo(0.7), lf = lo(0.4);
  const nHit = 10, nFree = 21, N = nHit + nFree;
  const P = (l) => 1 / (1 + Math.exp(-l));
  // 每个 scan 之后各 cell 的 log-odds
  const run = (clamp) => {
    const L = new Array(7).fill(0), hist = [L.slice()];
    for (let k = 1; k <= N; k++) {
      const hitCell = k <= nHit ? 5 : 6;
      for (let c = 0; c < hitCell; c++) L[c] += lf;
      L[hitCell] += lh;
      if (clamp) for (let c = 0; c < 7; c++) L[c] = Math.max(-2, Math.min(3.5, L[c]));
      hist.push(L.slice());
    }
    return hist;
  };
  const A = run(false), B = run(true);
  // 从 scan 19 开始播（第一帧就是两行差别最大的时刻），播到 31 停一下，再从 0 播回 19
  const per = 0.12, hold = 1.2;
  const seq = [], tms = [];
  let tt = 0;
  for (let k = 19; k <= N; k++) { seq.push(k); tms.push(tt); tt += per; }
  tt += hold - per;
  for (let k = 0; k <= 19; k++) { seq.push(k); tms.push(tt); tt += per; }
  const T = tms[tms.length - 1];
  const kt = tms.map((t) => t / T);
  const ext = (arr) => seq.map((k) => arr[k]);
  let o = '';
  const cw = 50, x0 = 200;
  const row = (y, hist, name, sub) => {
    let q = text(10, y + 20, name, 'tb') + text(10, y + 37, sub, 'ts');
    for (let c = 0; c < 7; c++) {
      const x = x0 + c * cw;
      q += rect(x, y, cw, 46, 'frame');
      const ops = ext(hist.map((L) => P(L[c]).toFixed(3)));
      q += `<rect x="${x + 1}" y="${y + 1}" width="${cw - 2}" height="44" class="solid" opacity="${ops[0]}">${anim('opacity', ops, kt, T, true)}</rect>`;
    }
    // cell 5 的读数
    for (let k = 0; k <= N; k++) {
      const on = seq.map((q) => q === k);
      const p = P(hist[k][5]);
      q += text(x0 + 5 * cw + cw / 2, y + 64, `p = ${p.toFixed(3)}`, 'tl', 'middle').replace('</text>', ashow(on, kt, T) + '</text>');
    }
    return q;
  };
  // robot 与 beam
  const yA = 70, yB = 186;
  o += rect(x0 - 48, yA + 8, 42, 30, 'paper', 4) + text(x0 - 27, yA + 28, 'LiDAR', 'ts', 'middle');
  o += rect(x0 - 48, yB + 8, 42, 30, 'paper', 4) + text(x0 - 27, yB + 28, 'LiDAR', 'ts', 'middle');
  o += row(yA, A, '不 clamp', 'log-odds 一直累加') + row(yB, B, 'Clamp', 'log-odds 限在 [−2, 3.5]');
  // person（前 10 个 scan 在 cell 5）
  const onP = seq.map((q) => q < nHit);
  const px = x0 + 5 * cw + cw / 2;
  o += `<g>${circle(px, 40, 9, 'wash-strong ink-s')}${text(px, 22, 'person', 'ts', 'middle')}${ashow(onP, kt, T)}</g>`;
  o += `<g>${text(px, 30, 'person 走开了', 'ts', 'middle')}${ashow(onP.map((v) => !v), kt, T)}</g>`;
  o += text(x0 + 6 * cw + cw / 2, 60, 'wall', 'ts', 'middle');
  for (let c = 0; c < 7; c++) o += text(x0 + c * cw + cw / 2, yB + 84, `cell ${c}`, 'ts', 'middle');
  // scan 计数
  for (let k = 0; k <= N; k++) {
    const on = seq.map((q) => q === k);
    o += text(10, yB + 84, `scan ${k}`, 'tb').replace('</text>', ashow(on, kt, T) + '</text>');
  }
  o += text(10, 300, '深浅 = p(occupied)。前 10 个 scan 打在 cell 5 的 person 上；之后 beam 穿过 cell 5 打到 wall。', 'ts');
  o += text(10, 318, '不 clamp 时 cell 5 要 21 次 miss 才回到 0.5 以下，clamp 之后只要 9 次。', 'ts');
  return svgA(560, 326, o, '一条 LiDAR beam 上 7 个 cell 的 occupancy probability 随 scan 变化：person 站在 cell 5 时它变深，person 走开后，不 clamp 的那一行要 21 个 scan 才变浅，clamp 的那一行只要 9 个');
}

// 第 3 站：VLMap 上的 “in between the sofa and the TV”
function vlmap() {
  const cs = 22, x0 = 40, y0 = 30, nx = 15, ny = 10;
  // 每个 cell 的 argmax label（由各物体的 footprint 给出）
  const lab = (i, j) => {
    if (j >= 1 && j <= 2 && i >= 2 && i <= 7) return 'sofa';
    if (j === 8 && i >= 9 && i <= 12) return 'tv';
    if (j >= 4 && j <= 5 && i >= 11 && i <= 13) return 'table';
    if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) return 'wall';
    return 'floor';
  };
  const cls = { sofa: 'wash-strong', tv: 'solid2', table: 'wash', wall: 'wash2', floor: 'paper' };
  let o = '';
  const cells = { sofa: [], tv: [] };
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const L = lab(i, j);
    o += rect(x0 + i * cs, y0 + j * cs, cs, cs, cls[L]);
    if (cells[L]) cells[L].push([i + 0.5, j + 0.5]);
  }
  o += rect(x0, y0, nx * cs, ny * cs, 'frame');
  const mean = (a) => [a.reduce((s, p) => s + p[0], 0) / a.length, a.reduce((s, p) => s + p[1], 0) / a.length];
  const cS = mean(cells.sofa), cT = mean(cells.tv), mid = [(cS[0] + cT[0]) / 2, (cS[1] + cT[1]) / 2];
  const P = (p) => [x0 + p[0] * cs, y0 + p[1] * cs];
  const [sX, sY] = P(cS), [tX, tY] = P(cT), [mX, mY] = P(mid);
  o += text(x0 + 2.4 * cs, y0 + 2 * cs + 5, 'sofa', 'tb', 'start') + text(x0 + 9.3 * cs, tY + 5, 'TV', 'tw', 'start') + text(x0 + 12 * cs, y0 + 5 * cs + 5, 'table', 'tb', 'middle');
  o += circle(sX, sY, 4, 'ink-f') + circle(tX, tY, 4, 'ink-f') + line(sX, sY, tX, tY, 'dash');
  o += circle(mX, mY, 7, 'ln') + circle(mX, mY, 2.5, 'ln-f');
  // robot 起点与路径（绕开 table）
  const R = P([2.5, 7.5]);
  o += rect(R[0] - 9, R[1] - 9, 18, 18, 'ink-f', 3);
  o += text(R[0], y0 + 9 * cs + 16, 'robot', 'ts', 'middle');
  o += arrow(R[0] + 10, R[1] - 4, mX - 8, mY + 4, 'ln');
  // 右侧说明
  const tx = 380;
  o += text(tx, 44, '每个 cell 存一个 feature vector', 'ts');
  o += text(tx, 62, '（落进它的所有 pixel 的平均）', 'ts');
  o += text(tx, 92, '和 “sofa”“TV”“table”“other”', 'ts');
  o += text(tx, 110, '的 text embedding 做 dot product，', 'ts');
  o += text(tx, 128, '取 argmax 得到 label', 'ts');
  o += text(tx, 164, 'LLM 写出的 code：', 'tb');
  o += text(tx, 184, 'move_in_between(', 'ts') + text(tx + 16, 202, '"sofa", "TV")', 'ts');
  o += text(tx, 230, '取两个 mask 的中心，', 'ts') + text(tx, 248, '目标是连线的 midpoint', 'ts');
  o += text(x0, y0 + ny * cs + 24, `一格 = 0.2 m。Sofa 中心 (${(cS[0] * 0.2).toFixed(1)}, ${(cS[1] * 0.2).toFixed(1)}) m，TV 中心 (${(cT[0] * 0.2).toFixed(1)}, ${(cT[1] * 0.2).toFixed(1)}) m，midpoint (${(mid[0] * 0.2).toFixed(2)}, ${(mid[1] * 0.2).toFixed(2)}) m。`, 'ts');
  return svg(560, 286, o, '一张俯视的 semantic grid map，每个 cell 按 argmax label 着色；sofa 和 TV 的 mask 中心连线的 midpoint 就是 “in between the sofa and the TV” 的目标，robot 朝它走');
}

// 第 4 站：SayCan 的打分
function saycan() {
  const skills = ['find a sponge', 'pick up the sponge', 'pick up the coke can', 'go to the trash can'];
  const llm = [0.30, 0.40, 0.20, 0.10], aff = [0.92, 0.05, 0.85, 0.95];
  const comb = llm.map((v, i) => v * aff[i]);
  let o = '';
  const y0 = 50, rh = 40, bw = 88;
  const cols = [[180, 'LLM score', 'p(skill | instruction)', llm, 1], [300, '× affordance', 'p(success | s)', aff, 1], [420, '= 乘积', '', comb, 0.3]];
  for (const [x, title, sub2, vals, vmax] of cols) {
    o += text(x + bw / 2, 20, title, 'tb', 'middle') + text(x + bw / 2, 38, sub2, 'ts', 'middle');
    vals.forEach((v, i) => {
      const y = y0 + i * rh;
      const best = x === 420 && i === 0;
      o += rect(x, y + 8, bw, 20, 'frame') + rect(x, y + 8, (bw * v) / vmax, 20, best ? 'solid' : 'wash-strong');
      o += text(x + bw + 4, y + 23, v.toFixed(v < 0.1 && x === 420 ? 3 : 2), best ? 'tl' : 't', 'start');
    });
  }
  skills.forEach((s, i) => { o += text(170, y0 + i * rh + 23, s, i === 0 ? 'tl' : 't', 'end'); });
  o += text(556, y0 + 4 * rh + 12, '（这一 column 的满格是 0.3）', 'ts', 'end');
  // 场景：俯视
  const Y = 236;
  o += rect(20, Y, 300, 90, 'frame', 4);
  o += rect(40, Y + 20, 90, 50, 'wash2 ink-s', 3) + text(85, Y + 86, 'table', 'ts', 'middle');
  o += rect(64, Y + 36, 14, 18, 'solid2', 3) + text(71, Y + 15, 'coke can', 'ts', 'middle');
  o += rect(150, Y + 32, 26, 26, 'ink-f', 4) + text(163, Y + 76, 'robot', 'ts', 'middle');
  o += line(176, Y + 45, 226, Y + 25, 'mute') + line(176, Y + 45, 226, Y + 65, 'mute') + text(232, Y + 49, '视野', 'ts');
  o += rect(262, Y + 8, 50, 74, 'wash2 ink-s', 3) + text(287, Y + 50, 'counter', 'ts', 'middle');
  o += rect(276, Y + 14, 20, 10, 'wash-strong ink-s', 2);
  o += text(340, Y + 26, 'sponge 在 counter 上，不在视野里：', 'ts');
  o += text(340, Y + 44, '“pick up the sponge” 此刻做不成，', 'ts');
  o += text(340, Y + 62, 'affordance 只有 0.05。', 'ts');
  o += text(10, Y + 112, 'Instruction：“I spilled my coke, can you bring me something to clean it up?”（数字为示意）', 'ts');
  return svg(560, 356, o, 'SayCan 对四个 skill 打分：LLM 最看好 pick up the sponge，但 sponge 不在视野里，affordance 只有 0.05；两者相乘后 find a sponge 得分最高');
}

// 第 5 站：RSSM 展开，前 3 步看 observation，后 3 步在想象里
function rssm() {
  let o = '';
  const xs = [60, 140, 220, 330, 410, 490];
  const yh = 120, yz = 180, yx = 252, yr = 60;
  o += rect(18, 22, 238, 280, 'wash2', 8) + text(137, 40, '在 replay data 上 train world model', 'tb', 'middle');
  o += rect(286, 22, 260, 280, 'wash', 8) + text(416, 40, '在想象里 train actor 和 critic', 'tb', 'middle');
  xs.forEach((x, k) => {
    const real = k < 3;
    o += rect(x - 26, yh - 16, 52, 32, 'paper', 6) + text(x, yh + 5, `h${k + 1}`, 't', 'middle');
    o += circle(x, yz, 18, real ? 'paper' : 'wash-strong ink-s') + text(x, yz + 5, real ? `z${k + 1}` : `ẑ${k + 1}`, 't', 'middle');
    o += arrow(x, yh + 16, x, yz - 18, 'ink', 6);
    o += rect(x - 18, yr - 12, 36, 24, 'paper', 4) + text(x, yr + 5, `r̂${k + 1}`, 'ts', 'middle');
    o += arrow(x, yh - 16, x, yr + 12, 'mute', 5);
    if (real) {
      o += rect(x - 22, yx - 16, 44, 32, 'frame', 3) + text(x, yx + 5, `x${k + 1}`, 't', 'middle');
      o += arrow(x, yx - 16, x, yz + 18, 'ln', 6);
    } else {
      o += text(x, yx - 2, 'actor', 'ts', 'middle') + text(x, yx + 14, `a${k + 1}`, 'tl', 'middle');
      o += arrow(x, yz + 18, x, yx - 14, 'mute', 5);
    }
    if (k < 5) {
      const nx = xs[k + 1];
      o += arrow(x + 26, yh, nx - 26, yh, 'ink', 6);
    }
  });
  o += text(137, yx + 36, 'encoder q(z | h, x) 看真 image', 'ts', 'middle');
  o += text(416, yx + 36, '没有 x：只用 prior p(ẑ | h)', 'ts', 'middle');
  return svg(560, 306, o, 'RSSM 展开六步：前三步每一步都读真实的 image x，用 encoder 得到 z；后三步没有 image，只用 dynamics predictor 预测 z，actor 在这些想象出来的 state 上选 action，reward head 给出 reward');
}

// 第 6 站：predictable 与 legible 的 trajectory（动图）
function legibleA() {
  const G1 = [-0.25, 1], G2 = [0.25, 1], S = [0, 0], k = 10;
  const n = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const N = 40, us = kts(N);
  const st = us.map((u) => [S[0] + (G2[0] - S[0]) * u, S[1] + (G2[1] - S[1]) * u]);
  const C = [0.6, 0.35];
  const bz = us.map((u) => [(1 - u) ** 2 * S[0] + 2 * (1 - u) * u * C[0] + u * u * G2[0], (1 - u) ** 2 * S[1] + 2 * (1 - u) * u * C[1] + u * u * G2[1]]);
  const post = (pts) => {
    let c = 0;
    return pts.map((q, i) => {
      if (i) c += n(q, pts[i - 1]);
      const sc = [G1, G2].map((G) => Math.exp(-k * (c + n(G, q)) + k * n(G, S)));
      return sc[1] / (sc[0] + sc[1]);
    });
  };
  const pS = post(st), pL = post(bz);
  const hold = 8, T = 4.5;
  const kt = [...us.map((u) => u * (N / (N + hold))), 1];
  const ext = (a) => [...a, a[a.length - 1]];
  let o = '';
  const panel = (X, title, pts, ps) => {
    const sx = lin(-0.5, 0.75, X, X + 220), sy = lin(0, 1.1, 250, 60);
    let q = text(X + 110, 22, title, 'tb', 'middle');
    q += path(d(pts.map(([x, y]) => [sx(x), sy(y)])), 'ln-dash');
    // 两个 goal：杯子
    for (const [G, nm, own] of [[G1, 'G1', false], [G2, 'G2（真正的目标）', true]]) {
      q += rect(sx(G[0]) - 9, sy(G[1]) - 12, 18, 22, own ? 'wash-strong ink-s' : 'paper', 3);
      q += text(sx(G[0]), sy(G[1]) - 18, nm, own ? 'tl' : 'ts', 'middle');
    }
    q += rect(sx(0) - 16, sy(0) + 2, 32, 10, 'wash2 ink-s', 2) + text(sx(0) - 22, sy(0) + 12, 'S', 'ts', 'end');
    q += acircle(ext(pts.map((p) => sx(p[0]))), ext(pts.map((p) => sy(p[1]))), kt, T, 7, 'solid');
    // P(G2) 条
    const by = 300, bx = X + 20, bw = 180;
    q += rect(bx, by, bw, 14, 'frame');
    const ws = ext(ps.map((p) => f1(bw * p)));
    q += `<rect x="${bx}" y="${by}" width="${ws[0]}" height="14" class="solid">${anim('width', ws, kt, T)}</rect>`;
    q += line(bx + bw / 2, by - 3, bx + bw / 2, by + 17, 'dash');
    q += text(bx, by - 8, '观察者心中的 P(G2)', 'ts');
    for (const [idx, lab] of [[10, 't = ¼'], [20, 't = ½']]) q += text(bx + bw, by + 34 + (idx === 20 ? 16 : 0), `${lab}：${ps[idx].toFixed(2)}`, 'ts', 'end');
    return q;
  };
  o += panel(20, 'Predictable：直线，长 1.03 m', st, pS) + panel(300, 'Legible：先往右弯，长 1.17 m', bz, pL);
  return svgA(560, 350, o, '同一个起点、两个相邻的杯子，robot 要拿右边的 G2。左边走直线，观察者长时间分不清是哪个；右边先往右弯，观察者在一半时就有 0.93 的把握');
}

// 第 6 站：shared autonomy，belief 各一半时三种 action
function assist() {
  const s = 210, O = [170, 270];
  const P = ([x, y]) => [O[0] + s * x, O[1] - s * y];
  const G1 = [-0.25, 1], G2 = [0.25, 1];
  let o = '';
  for (const [G, nm] of [[G1, 'G1'], [G2, 'G2']]) {
    const [x, y] = P(G);
    o += rect(x - 9, y - 12, 18, 22, 'paper', 3) + text(x, y - 18, nm + '：belief 0.5', 'ts', 'middle');
  }
  const [ox, oy] = P([0, 0]);
  o += rect(ox - 16, oy + 2, 32, 10, 'wash2 ink-s', 2) + circle(ox, oy, 5, 'ink-f');
  const go = (u, cls, lab, dx) => {
    const L = 0.1 * 4, e = P([u[0] * L, u[1] * L]);
    o += arrow(ox, oy, e[0], e[1], cls);
    o += text(e[0] + dx, e[1] - 6, lab, cls === 'ln' ? 'tl' : 'ts', dx < 0 ? 'end' : 'start');
  };
  const u2 = [0.25 / Math.hypot(0.25, 1), 1 / Math.hypot(0.25, 1)];
  go([0, 1], 'ln', '直走', -6);
  go(u2, 'mute', '朝 G2', 6);
  for (const [G] of [[G1], [G2]]) { const g = P(G); o += line(ox, oy, g[0], g[1], 'grid'); }
  const tx = 330;
  o += text(tx, 40, '走 0.1 m 之后，到两个 goal 的', 'ts') + text(tx, 58, '剩余距离的 expectation：', 'ts');
  o += text(tx, 88, '直走：0.5 × 0.934 + 0.5 × 0.934', 'ts') + text(tx + 40, 106, '= 0.934 m', 'tl');
  o += text(tx, 132, '朝 G2：0.5 × 0.944 + 0.5 × 0.931', 'ts') + text(tx + 40, 150, '= 0.937 m', 't');
  o += text(tx, 186, 'Predict-then-blend：', 'tb');
  o += text(tx, 204, 'confidence = 0.5 − 0.5 = 0，', 'ts') + text(tx, 222, '完全不帮忙。', 'ts');
  o += text(tx, 250, 'Hindsight optimization：', 'tb') + text(tx, 268, '选 expectation 最小的直走。', 'ts');
  o += text(10, 304, '起点到两个 goal 都是 1.031 m。图中箭头放大了 4 倍。', 'ts');
  return svg(560, 312, o, '两个 goal 的 belief 各一半时，直走让两边的剩余距离都缩短，expectation 最小；朝 G2 走对 G2 好、对 G1 差；predict-then-blend 因为 confidence 为 0 而不提供帮助');
}

// 第 7 站：naive async 与 RTC 在 chunk 切换处的 action（动图）
function rtcA() {
  // 一维 action：旧 chunk 走“上面”的 mode，新 chunk 的一个 sample 走“下面”的 mode
  const H = 50, s = 25, dl = 5;
  const W = (i) => { if (i < dl) return 1; if (i >= H - s) return 0; const c = (H - s - i) / (H - s - dl + 1); return (c * (Math.exp(c) - 1)) / (Math.E - 1); };
  // 旧 chunk 在 t=0 产生；执行完 s = 25 步时取新的 observation，d = 5 步后（t = 30）新 chunk 可用
  const oldA = (t) => 0.6 * Math.sin((Math.PI * t) / 60) + 0.2;
  const newDown = (t) => -0.5 * Math.sin((Math.PI * (t - 25)) / 50) + oldA(25) * Math.cos((Math.PI * (t - 25)) / 100);
  const newUp = (t) => oldA(t) + 0.15 * Math.sin((Math.PI * (t - 25)) / 40) * (t > 25 ? 1 : 0);
  // RTC：前 d 个与旧 chunk 相同；之后按 W 从旧 chunk 过渡到同一 mode 的新预测
  const rtc = (t) => { const i = t - 25; const w = W(i); return w * oldA(t) + (1 - w) * newUp(t); };
  const sx = lin(0, 50, 70, 540), sy = lin(-0.8, 1.0, 150, 44);
  let o = axes({ sx, sy, x0: 0, x1: 50, y0: -0.8, y1: 1.0, xt: [0, 10, 20, 25, 30, 40, 50], yt: [], xAt: -0.8 });
  o += text(62, 100, 'action', 'ts', 'end');
  const seg = (fn, a, b) => { const p = []; for (let t = a; t <= b + 1e-9; t += 0.25) p.push([sx(t), sy(fn(t))]); return d(p); };
  o += path(seg(oldA, 0, 49), 'ink');
  o += text(sx(49), sy(oldA(49)) - 8, '旧 chunk', 'ts', 'end');
  o += line(sx(25), 44, sx(25), 150, 'grid') + line(sx(30), 44, sx(30), 150, 'grid');
  o += text(sx(25) - 4, 168 + 18, '取 obs', 'ts', 'end') + text(sx(30) + 4, 168 + 18, '新 chunk 可用', 'ts');
  // 两种做法分开画在上下两个面板
  const sy2 = lin(-0.8, 1.0, 330, 224);
  o += line(sx(0), 330, sx(50), 330, 'axis');
  const seg2 = (fn, a, b) => { const p = []; for (let t = a; t <= b + 1e-9; t += 0.25) p.push([sx(t), sy2(fn(t))]); return d(p); };
  o += path(seg2(oldA, 0, 49), 'ink');
  o += line(sx(25), 224, sx(25), 330, 'grid') + line(sx(30), 224, sx(30), 330, 'grid');
  // 上面板：naive async 在 t=25 跳到新 chunk
  o += path(seg(newDown, 30, 50), 'ln');
  o += line(sx(30), sy(oldA(30)), sx(30), sy(newDown(30)), 'ln-dash');
  o += text(sx(31), sy(newDown(30)) + 16, '跳变', 'tl');
  o += text(sx(0), 24, 'Naive async：新 chunk 换了 mode', 'tb', 'start');
  // 下面板：RTC
  o += path(seg2(rtc, 30, 50), 'ln');
  o += text(sx(0), 210, 'RTC：前 d = 5 步冻结，之后平滑接上', 'tb', 'start') + text(62, 284, 'action', 'ts', 'end');
  // 下面板：W 的条
  for (let i = 0; i < 25; i++) {
    const t = 25 + i, w = W(i);
    if (w > 0.002) o += rect(sx(t) - 3.5, 330 - 22 * w, 7, 22 * w, 'wash-strong');
  }
  o += text(sx(25) - 4, 322, 'W', 'tl', 'end');
  // 动画：当前时刻的竖线
  const T = 5, N = 50, kt = kts(N);
  const xs = kt.map((k) => sx(k * 50));
  o += `<line x1="${f1(xs[0])}" y1="44" x2="${f1(xs[0])}" y2="330" class="mute">${anim('x1', xs.map(f1), kt, T)}${anim('x2', xs.map(f1), kt, T)}</line>`;
  o += acircle(kt.map((k) => sx(k * 50)), kt.map((k) => { const t = k * 50; return sy(t < 30 ? oldA(t) : newDown(t)); }), kt, T, 5, 'solid');
  o += acircle(kt.map((k) => sx(k * 50)), kt.map((k) => { const t = k * 50; return sy2(t < 30 ? oldA(t) : rtc(t)); }), kt, T, 5, 'solid');
  for (const t of [0, 10, 20, 25, 30, 40, 50]) o += text(sx(t), 348, String(t), 'ts', 'middle');
  o += text(sx(50), 364, 'controller step（每步 20 ms）', 'ts', 'end');
  o += text(10, 386, '浅色条是 soft mask 的 weight W：冻结的 5 步为 1，之后按 exponential 降到 0。', 'ts') + text(10, 404, '曲线是示意，不是 model 的真实 output。', 'ts');
  return svgA(560, 412, o, '上图：naive asynchronous 在新 chunk 可用的那一步直接切换，action 跳到另一个 mode；下图：real-time chunking 让新 chunk 的前 5 步等于旧 chunk，后面按 soft mask 逐渐过渡，action 连续');
}

export default {
  'ee4706-pause': pause,
  'ee4706-react': reactA,
  'ee4706-layers': layers,
  'ee4706-clip': clip,
  'ee4706-grid': gridA,
  'ee4706-vlmap': vlmap,
  'ee4706-saycan': saycan,
  'ee4706-rssm': rssm,
  'ee4706-legible': legibleA,
  'ee4706-assist': assist,
  'ee4706-rtc': rtcA,
};
