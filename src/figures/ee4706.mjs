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
  o += box(28, 52, 'Deliberator', '秒级', 'plan、search；存对未来的 prediction', 'paper');
  o += box(108, 52, 'Sequencer', '每个 subtask', '挑出、切换 skill；存过去的 memory', 'paper');
  o += box(188, 52, 'Controller', '50 Hz 以上', 'skill → motor command；不存 state', 'wash');
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
  o += text(10, Y + 112, 'Instruction：“I spilled my coke, can you bring me something to clean it up?”（本页设定的场景，数字为示意）', 'ts');
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


// 第 1 站：Brooks 1986 的前三层与 suppression 节点
function subsume() {
  let o = '';
  const bw = 78, bh = 30;
  const box = (x, y, name, cls = 'paper') => rect(x, y, bw, bh, cls, 5) + text(x + bw / 2, y + 20, name, 't', 'middle');
  const S = (x, y) => circle(x, y, 10, 'paper') + text(x, y + 4.5, 'S', 'tb', 'middle');
  o += rect(10, 14, 540, 58, 'wash2', 6) + rect(10, 82, 540, 70, 'wash2', 6) + rect(10, 162, 540, 128, 'wash', 6);
  o += text(20, 34, 'level 2', 'tb') + text(20, 52, 'explore', 'ts');
  o += text(20, 108, 'level 1', 'tb') + text(20, 126, 'wander', 'ts');
  o += text(20, 188, 'level 0', 'tb') + text(20, 206, 'avoid', 'ts') + text(20, 222, 'collision', 'ts');
  const xs = 84, xf = 190, xr = 296, xm = 466;
  const yA = 186, yB = 244;
  o += box(xs, yA, 'sonar') + box(xf, yA, 'feelforce') + box(xr, yA, 'runaway') + box(xm, yA + 28, 'motor', 'wash-strong ink-s');
  o += box(xf, yB, 'collide');
  o += arrow(xs + bw, yA + 15, xf, yA + 15) + arrow(xf + bw, yA + 15, xr, yA + 15);
  const sx0 = 434, sy0 = yA + 15;
  o += line(xr + bw, sy0, sx0 - 10, sy0) + S(sx0, sy0);
  o += line(sx0 + 10, sy0, 454, sy0) + arrow(454, sy0, xm, yA + 34);
  o += line(xs + bw / 2, yA + bh, xs + bw / 2, yB + 15) + arrow(xs + bw / 2, yB + 15, xf, yB + 15);
  o += line(xf + bw, yB + 15, 454, yB + 15) + arrow(454, yB + 15, xm, yA + 50);
  o += text(360, yB + 10, 'halt', 'ts', 'middle') + text(401, yA + 8, 'command', 'ts', 'middle');
  o += text((xs + bw + xf) / 2, yA + 8, 'map', 'ts', 'middle') + text((xf + bw + xr) / 2, yA + 8, 'force', 'ts', 'middle');
  const y1 = 100;
  o += box(xs, y1, 'wander') + box(328, y1, 'avoid');
  const sx1 = 290, sy1 = y1 + 15;
  o += line(xs + bw, sy1, sx1 - 10, sy1) + S(sx1, sy1) + arrow(sx1 + 10, sy1, 328, sy1);
  o += text(222, sy1 - 8, 'heading', 'ts', 'middle');
  o += line(xf + bw / 2, yA, xf + bw / 2, 140) + arrow(xf + bw / 2, 140, 328, y1 + 25);
  o += line(328 + bw, sy1, sx0, sy1) + arrow(sx0, sy1, sx0, sy0 - 11, 'ln');
  o += text(sx0 + 6, 160, 'suppress', 'tl');
  const y2 = 28;
  o += box(xf, y2, 'pathplan');
  o += line(xf + bw, y2 + 15, sx1, y2 + 15) + arrow(sx1, y2 + 15, sx1, sy1 - 11, 'ln');
  o += text(sx1 + 6, 64, 'suppress', 'tl');
  o += text(330, 46, '目标 heading 替换随机 heading', 'ts');
  o += text(10, 312, 'S = suppression：高层的消息在一段时间里替换掉送进这个点的 input。', 'ts');
  o += text(10, 330, '另一种接法 inhibition 接在 output 上，在一段时间里把消息丢掉（图里没有画）。', 'ts');
  return svg(560, 338, o, 'Brooks 1986 年的前三层：level 0 从 sonar 经 feelforce、runaway 到 motor，collide 直接发 halt；level 1 的 wander 和 avoid 通过 suppression 节点接管 runaway 的 command；level 2 的 pathplan 再 suppress wander 的 heading');
}

// 第 5 站：symexp twohot 编码
function twohot() {
  const se = (k) => Math.sign(k) * (Math.exp(Math.abs(k)) - 1);
  const sx = lin(0, 8, 70, 530);
  let o = '';
  const enc = (y) => {
    // 返回两个 bin 的下标与 weight
    let k = 0; while (se(k + 1) <= y) k++;
    const w1 = (y - se(k)) / (se(k + 1) - se(k));
    return [k, 1 - w1, w1];
  };
  const row = (y0, target, title) => {
    const [k, wa, wb] = enc(target);
    let q = text(10, y0 - 66, title, 'tb');
    q += line(sx(0), y0, sx(8), y0, 'axis');
    for (let j = 0; j <= 8; j++) q += line(sx(j), y0, sx(j), y0 + 4, 'axis');
    const hmax = 52;
    for (const [j, w] of [[k, wa], [k + 1, wb]]) {
      q += rect(sx(j) - 12, y0 - hmax * w, 24, hmax * w, 'solid');
      q += text(sx(j), y0 + 18, w.toFixed(3), 'tl', 'middle');
    }
    // target 的位置（按 symlog 刻度）
    const xt = sx(Math.log(target + 1));
    q += line(xt, y0 - 60, xt, y0, 'dash');
    q += text(xt + 4, y0 - 50, `y = ${target}`, 'ts', 'start');
    return q;
  };
  o += row(110, 1, 'y = 1：落在 symexp(0) 和 symexp(1) 之间');
  o += row(226, 1000, 'y = 1000：落在 symexp(6) 和 symexp(7) 之间');
  for (let j = 0; j <= 8; j++) {
    const v = se(j);
    o += text(sx(j), 266, v < 10 ? v.toFixed(2) : v.toFixed(0), 'ts', 'middle');
  }
  o += text(sx(8), 284, 'bin 的位置 symexp(k)，k = 0 … 8；横轴按 symlog 等距', 'ts', 'end');
  o += text(10, 292 + 14, '两个 target 差 1000 倍，各自只占两个相邻的 bin，weight 都在 0 到 1 之间，', 'ts');
  o += text(10, 324, 'cross-entropy 对 logit 的 gradient = softmax − twohot，每个分量也都在 −1 到 1 之间。', 'ts');
  return svg(560, 332, o, '两个 target 的 twohot 编码：y = 1 在 symexp(0) 和 symexp(1) 两个 bin 上分别是 0.418 和 0.582，y = 1000 在 symexp(6) 和 symexp(7) 上分别是 0.138 和 0.862');
}

// 第 7 站：一次 decision 的分项 latency，画在 20 ms 一格的 controller 时间轴上
function latency() {
  const rows = [
    ['π0，on-board', [['image enc.', 14], ['prefill', 32], ['10 × action', 27]]],
    ['π0，off-board', [['image enc.', 14], ['prefill', 32], ['10 × action', 27], ['network', 13]]],
    ['π0.5 + RTC，mobile', [['resize', 11.22], ['model（含 RTC）', 96.89], ['network', 21.2], ['其他', 9.67]]],
  ];
  const sx = lin(0, 140, 150, 545);
  let o = '';
  for (let t = 0; t <= 140; t += 20) {
    o += line(sx(t), 30, sx(t), 214, 'grid');
    o += text(sx(t), 232, String(t), 'ts', 'middle');
  }
  o += text(sx(140), 250, '时间（ms）；竖线是 50 Hz controller 每 20 ms 要一个 action 的时刻', 'ts', 'end');
  const cls = ['wash', 'solid', 'wash-strong', 'wash2 ink-s'];
  rows.forEach(([name, segs], r) => {
    const y = 44 + r * 60;
    o += text(140, y + 17, name, 'tb', 'end');
    let t0 = 0;
    segs.forEach(([lab, ms], k) => {
      const c = cls[k];
      o += rect(sx(t0), y, sx(t0 + ms) - sx(t0), 26, c);
      const w = sx(t0 + ms) - sx(t0);
      if (w > lab.length * 6.5 + 8) o += text(sx(t0 + ms / 2), y + 17, lab, k === 1 ? 'tw' : 'ts', 'middle');
      else o += text(sx(t0 + ms / 2), y + 42, lab, 'ts', 'middle');
      t0 += ms;
    });
    const dd = Math.floor(t0 / 20);
    o += text(sx(t0) + 4, y - 4, `${t0.toFixed(0)} ms，d = ${dd}`, 'tl', t0 > 125 ? 'end' : 'start');
  });
  o += text(10, 276, '前两条：π0 论文 Table I（RTX 4090，3 个 camera）。第三条：RTC 论文 Table 2，顺序为示意。', 'ts');
  return svg(560, 284, o, '三次实测的 decision latency：π0 在 RTX 4090 上 73 ms，走网络 86 ms，π0.5 加 RTC 在 mobile robot 上 139 ms，都跨过多个 20 ms 的 controller 周期');
}


// ---------- 第 8、9 站：listen 与 speak ----------
const esc2 = (s) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
const dshow = (vals, kt, T) => anim('opacity', vals, kt, T, true);
const dtrans = (xs, ys, kt, T) => `<animateTransform attributeName="transform" type="translate" calcMode="discrete" values="${xs.map((x, i) => f1(x) + ' ' + f1(ys[i])).join(';')}" keyTimes="${kt.map((t) => (Math.round(t * 1e5) / 1e5).toString()).join(';')}" dur="${T}s" repeatCount="indefinite"/>`;
// librosa 默认（Slaney）的 mel scale，与 Whisper 的 mel_filters.npz 逐项一致
const hz2melS = (f) => { const fsp = 200 / 3, ml = 1000 / fsp, ls = Math.log(6.4) / 27; return f < 1000 ? f / fsp : ml + Math.log(f / 1000) / ls; };
const mel2hzS = (m) => { const fsp = 200 / 3, ml = 1000 / fsp, ls = Math.log(6.4) / 27; return m < ml ? fsp * m : 1000 * Math.exp(ls * (m - ml)); };
function melbankS(sr = 16000, nfft = 400, nm = 80) {
  const nb = nfft / 2 + 1, ff = Array.from({ length: nb }, (_, k) => (k * sr) / nfft);
  const m1 = hz2melS(sr / 2);
  const hz = Array.from({ length: nm + 2 }, (_, i) => mel2hzS((m1 * i) / (nm + 1)));
  const W = [];
  for (let i = 0; i < nm; i++) {
    const en = 2 / (hz[i + 2] - hz[i]);
    W.push(ff.map((f) => Math.max(0, Math.min((f - hz[i]) / (hz[i + 1] - hz[i]), (hz[i + 2] - f) / (hz[i + 2] - hz[i + 1]))) * en));
  }
  return { W, hz, ff };
}
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// 第 8 站：waveform → 25 ms window、10 ms hop → log-mel（动图）
function framesA() {
  const sr = 16000, N = 4800, r = rng(7);
  const x = new Float64Array(N);
  const fade = (n, a, b) => Math.min(1, (n - a) / 160, (b - n) / 160);
  const ph = Array.from({ length: 40 }, () => r() * 2 * Math.PI);
  const amp = (f) => (Math.exp(-(((f - 700) / 150) ** 2)) + 0.8 * Math.exp(-(((f - 1200) / 200) ** 2)) + 0.3 * Math.exp(-(((f - 2600) / 250) ** 2)) + 0.004) * (f < 5000 ? 1 : 0);
  const nf = Array.from({ length: 60 }, () => [4000 + 3800 * r(), r() * 2 * Math.PI]);
  for (let n = 0; n < N; n++) {
    const t = n / sr;
    if (n < 2400) { let v = 0; for (let h = 1; h <= 40; h++) v += amp(150 * h) * Math.sin(2 * Math.PI * 150 * h * t + ph[h - 1]); x[n] = 0.22 * v * Math.max(0, fade(n, 0, 2400)); }
    else { let v = 0; for (const [f, p] of nf) v += Math.sin(2 * Math.PI * f * t + p); x[n] = 0.035 * v * Math.max(0, fade(n, 2400, 4800)); }
  }
  // STFT：reflect padding 200，periodic Hann，n_fft 400，hop 160，丢掉最后一帧
  const pad = (i) => (i < 0 ? x[-i] : i >= N ? x[2 * N - 2 - i] : x[i]);
  const win = Array.from({ length: 400 }, (_, n) => 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / 400));
  const { W } = melbankS();
  const F = N / 160; // 31 帧，丢最后一帧后 30
  const S = [];
  for (let k = 0; k < F; k++) {
    const seg = Array.from({ length: 400 }, (_, n) => pad(k * 160 - 200 + n) * win[n]);
    const P = [];
    for (let b = 0; b <= 200; b++) { let re = 0, im = 0; for (let n = 0; n < 400; n++) { const a = (2 * Math.PI * b * n) / 400; re += seg[n] * Math.cos(a); im -= seg[n] * Math.sin(a); } P.push(re * re + im * im); }
    S.push(W.map((w) => Math.log10(Math.max(1e-10, w.reduce((s, wi, b) => s + wi * P[b], 0)))));
  }
  const mx = Math.max(...S.flat());
  const L = S.map((c) => c.map((v) => (Math.max(v, mx - 8) + 4) / 4));
  const lo = Math.min(...L.flat()), hi = Math.max(...L.flat());
  const X0 = 150, px = 1300, cw = 13; // 每秒 1300 px，一个 hop 13 px
  let o = '';
  // waveform
  o += text(10, 58, 'waveform', 'tb') + text(10, 74, '16 kHz', 'ts');
  const yc = 62, A = 34;
  const mm = [];
  for (let c = 0; c < 390; c++) { let a = 1e9, b = -1e9; for (let n = Math.floor(c * 4800 / 390); n < Math.floor((c + 1) * 4800 / 390); n++) { a = Math.min(a, x[n]); b = Math.max(b, x[n]); } mm.push([a, b]); }
  o += path(mm.map(([a, b], c) => `M${f1(X0 + c)} ${f1(yc - A * b)}L${f1(X0 + c)} ${f1(yc - A * a)}`).join(''), 'mute');
  o += line(X0, yc, X0 + 390, yc, 'grid');
  o += text(X0 + 97, 18, 'vowel：150 Hz 的 harmonic', 'ts', 'middle') + text(X0 + 292, 18, '“s”：4 kHz 以上的 noise', 'ts', 'middle');
  // log-mel
  const Y1 = 324, rh = 2;
  o += text(10, 150, 'log-mel：80 channel × 30 frame', 'tb');
  const steps = [29, ...Array.from({ length: 30 }, (_, i) => i)];
  const hold = 1.5, per = 0.15, T = hold + 29 * per + 0.6;
  const tms = steps.map((_, j) => (j === 0 ? 0 : hold + (j - 1) * per));
  const kt = tms.map((t) => t / T);
  for (let k = 0; k < 30; k++) {
    let g = '';
    for (let m = 0; m < 80; m++) {
      const op = ((L[k][m] - lo) / (hi - lo)) ** 2.2;
      if (op > 0.07) g += `<rect x="${f1(X0 + cw * k - cw / 2)}" y="${f1(Y1 - rh * (m + 1))}" width="${cw}" height="${rh}" class="solid" opacity="${op.toFixed(2)}"/>`;
    }
    o += `<g>${g}${dshow(steps.map((q) => (q >= k ? 1 : 0)), kt, T)}</g>`;
  }
  o += rect(X0 - cw / 2, Y1 - 160, 30 * cw, 160, 'frame');
  // channel 刻度：标出 filter 的峰值 frequency
  for (const m of [0, 20, 40, 60, 79]) {
    const pk = W[m].indexOf(Math.max(...W[m])) * 40;
    o += line(X0 - cw / 2, Y1 - rh * (m + 0.5), X0 - cw / 2 - 4, Y1 - rh * (m + 0.5), 'axis') + text(X0 - cw / 2 - 8, Y1 - rh * (m + 0.5) + 4, `ch ${m} · ${pk} Hz`, 'ts', 'end');
  }
  for (const t of [0, 0.1, 0.2, 0.3]) o += line(X0 + t * px, Y1, X0 + t * px, Y1 + 4, 'axis') + text(X0 + t * px, Y1 + 17, `${t.toFixed(1)} s`, 'ts', 'middle');
  // 移动的 window 与当前列
  const xs = steps.map((k) => cw * k), zs = steps.map(() => 0);
  o += `<g>${rect(X0 - 16.25, yc - A - 4, 32.5, 2 * A + 8, 'wash', 3)}${rect(X0 - 16.25, yc - A - 4, 32.5, 2 * A + 8, 'ln', 3)}${line(X0, yc + A + 4, X0, Y1 - 160, 'ln-dash')}${rect(X0 - cw / 2, Y1 - 160, cw, 160, 'ln')}${dtrans(xs, zs, kt, T)}</g>`;
  o += text(10, 122, '25 ms window = 400 个 sample，每次往右挪 10 ms = 160 个 sample', 'ts', 'start');
  o += text(10, 352, '每个 frame：Hann window → 400 点 DFT（201 个 bin，间隔 40 Hz）→ 80 个 mel filter → log10。', 'ts');
  return svgA(560, 360, o, '一段 0.3 s 的合成 audio：25 ms 的 window 每次挪 10 ms，每个位置算出 log-mel spectrogram 的一列；vowel 部分在低 channel 上有横纹，s 部分的 energy 在高 channel 上');
}

// 第 8 站：Whisper 的 80 个 mel filter
function melbank() {
  const { hz } = melbankS();
  let o = '';
  const sx = lin(0, 8000, 50, 540), base = 140, H = 90;
  const tri = (i, sxf, b, h, cls) => path(d([[sxf(hz[i]), b], [sxf(hz[i + 1]), b - h], [sxf(hz[i + 2]), b]]), cls);
  for (let i = 0; i < 80; i++) if (i !== 10 && i !== 79) o += tri(i, sx, base, H, 'mute');
  o += tri(79, sx, base, H, 'ln') + tri(10, sx, base, H, 'ln');
  for (let k = 0; k <= 200; k++) o += line(sx(40 * k), base, sx(40 * k), base + 3, 'grid');
  o += line(sx(0), base, sx(8000), base, 'axis');
  for (let f = 0; f <= 8000; f += 1000) o += line(sx(f), base, sx(f), base + 6, 'axis') + text(sx(f), base + 19, f === 0 ? '0' : `${f / 1000} kHz`, 'ts', 'middle');
  o += text(sx(7700), 44, 'filter 79：7440–7960 Hz，14 个 bin', 'tl', 'end');
  o += line(sx(0), 40, sx(1000), 40, 'ink') + line(sx(0), 36, sx(0), 44, 'ink') + line(sx(1000), 36, sx(1000), 44, 'ink');
  o += text(sx(1000) + 6, 44, '1 kHz 以下挤着 26 个 filter', 'ts', 'start');
  o += text(10, 16, 'Whisper 的 80 个 mel filter（每个画成同样高，看宽度）', 'tb');
  // 放大 0–600 Hz
  const Y2 = 186, b2 = 300, H2 = 80, sz = lin(0, 600, 50, 540);
  o += text(10, Y2, '放大 0–600 Hz：bin 间隔 40 Hz，低端的 filter 比一个 bin 还窄', 'tb');
  for (let i = 0; i < 80; i++) { if (hz[i + 2] > 640) break; o += tri(i, sz, b2, H2, i === 10 ? 'ln' : 'mute'); }
  o += line(sz(0), b2, sz(600), b2, 'axis');
  for (let k = 0; k <= 15; k++) o += circle(sz(40 * k), b2, 2.5, 'ink-f') + (k % 2 === 0 ? text(sz(40 * k), b2 + 18, String(40 * k), 'ts', 'middle') : '');
  o += text(sz(600), b2 + 34, 'Hz；黑点是 400 点 DFT 的 bin', 'ts', 'end');
  o += text(sz(420), b2 - H2 - 8, 'filter 10：只在 400、440 Hz 两个 bin 上非零', 'tl', 'middle');
  return svg(560, 340, o, 'Whisper 的 80 个 mel filter：1 kHz 以下有 26 个，每个只盖一两个 bin；8 kHz 附近的 filter 79 盖 14 个 bin。下方放大 0 到 600 Hz，bin 间隔 40 Hz');
}

// 第 8 站：CTC trellis（动图）
function ctcA() {
  const Y = [[0.6, 0.1, 0.3], [0.4, 0.3, 0.3], [0.1, 0.4, 0.5]]; // H, I, blank
  const lp = ['−', 'H', '−', 'I', '−'], col = { H: 0, I: 1, '−': 2 };
  const a = [[0.3, 0.6, 0, 0, 0]];
  for (let t = 1; t < 3; t++) {
    const row = [];
    for (let s = 0; s < 5; s++) {
      let v = a[t - 1][s] + (s >= 1 ? a[t - 1][s - 1] : 0);
      if (!(lp[s] === '−' || (s >= 2 && lp[s - 2] === lp[s]))) v += s >= 2 ? a[t - 1][s - 2] : 0;
      row.push(v * Y[t][col[lp[s]]]);
    }
    a.push(row);
  }
  let o = '';
  // 左：output 表
  o += text(20, 24, 'network 的 output y', 'tb');
  const hx = [70, 112, 154];
  ['H', 'I', '−'].forEach((c, j) => { o += text(hx[j], 48, c, 'tb', 'middle'); });
  Y.forEach((r, t) => { o += text(24, 72 + t * 24, `t = ${t + 1}`, 'ts'); r.forEach((v, j) => { o += text(hx[j], 72 + t * 24, v.toFixed(1), 't', 'middle'); }); });
  o += text(20, 160, "ℓ′ = (−, H, −, I, −)", 'ts') + text(20, 178, '5 个 state', 'ts');
  // 右：trellis
  const cx = [270, 380, 490], ry = (s) => 40 + s * 52;
  for (let s = 0; s < 5; s++) o += text(222, ry(s) + 5, `${s + 1}：${lp[s]}`, 'tb', 'end');
  cx.forEach((x, t) => { o += text(x, 316, `t = ${t + 1}`, 'ts', 'middle'); });
  const groups = [[], [], []];
  for (let t = 0; t < 3; t++) for (let s = 0; s < 5; s++) {
    let g = '';
    if (t > 0) {
      const srcs = [s, s - 1];
      if (!(lp[s] === '−' || (s >= 2 && lp[s - 2] === lp[s]))) srcs.push(s - 2);
      for (const q of srcs) if (q >= 0 && a[t - 1][q] > 0) {
        const x1 = cx[t - 1] + 19, y1 = ry(q), x2 = cx[t] - 19, y2 = ry(s);
        g += arrow(x1, y1 + (y2 - y1) * 0.12, x2, y2 - (y2 - y1) * 0.12, q === s - 2 ? 'ln' : 'mute', 6);
      }
    }
    const v = a[t][s];
    const fin = t === 2 && s >= 3;
    g += circle(cx[t], ry(s), 19, v > 0 ? (fin ? 'wash-strong ink-s' : 'paper') : 'grid') + text(cx[t], ry(s) + 5, v > 0 ? (Math.round(v * 1000) / 1000).toString() : '0', v > 0 ? 't' : 'ts', 'middle');
    groups[t].push(g);
  }
  const frames = [3, 0, 1, 2, 3];
  const dur = [2.6, 1.2, 1.2, 1.2];
  const T = dur.reduce((p, q) => p + q, 0) + 0.8;
  const tms = [0]; for (const d0 of dur) tms.push(tms[tms.length - 1] + d0);
  const kt = tms.map((t) => t / T);
  for (let t = 0; t < 3; t++) o += `<g>${groups[t].join('')}${dshow(frames.map((f) => (f >= t ? 1 : 0)), kt, T)}</g>`;
  o += `<g>${text(380, 296, 'p(HI | x) = 0.288 + 0.09 = 0.378', 'tl', 'middle')}${dshow(frames.map((f) => (f >= 3 ? 1 : 0)), kt, T)}</g>`;
  o += text(20, 224, '灰线：停在原 state', 'ts') + text(20, 242, '或走到下一个 state', 'ts');
  o += text(20, 266, '主题色线：从 H 跳过', 'ts') + text(20, 284, '中间的 blank 到 I', 'ts');
  return svgA(560, 324, o, 'CTC 对 HI 的 forward trellis：5 个 state、3 个 frame，每格是 alpha；最后一列的 I 和末尾 blank 两格相加得 0.378');
}

// 第 8 站：一句 1.5 s 的 command 在 Whisper 里
function whisperwin() {
  let o = '';
  const sx = lin(0, 30, 70, 540);
  o += text(10, 20, '30 s 的 window：480000 个 sample', 'tb');
  o += rect(sx(0), 30, sx(1.5) - sx(0), 26, 'solid') + rect(sx(1.5), 30, sx(30) - sx(1.5), 26, 'wash2');
  o += text(sx(1.5) + 8, 48, 'pad_or_trim 补上的 0（28.5 s）', 'ts');
  o += text(sx(0), 72, '1.5 s 的 command', 'tl');
  for (const t of [0, 1.5, 10, 20, 30]) o += line(sx(t), 56, sx(t), 60, 'axis') + (t < 2 ? '' : text(sx(t), 72, `${t} s`, 'ts', 'middle'));
  o += text(10, 104, '80 × 3000 的 log-mel → 两层 convolution（第二层 stride 2）→ 1500 个 audio token', 'tb');
  o += rect(sx(0), 114, sx(1.5) - sx(0), 26, 'solid') + rect(sx(1.5), 114, sx(30) - sx(1.5), 26, 'wash2');
  for (let k = 1; k < 30; k++) o += line(sx(k), 114, sx(k), 140, 'grid');
  o += text(sx(0), 156, '75 个 token（5%）', 'tl') + text(sx(1.5) + 8, 132, '1425 个 token，encoder 照样每层都算', 'ts');
  o += text(10, 188, 'Decoder 要 output 的 token sequence', 'tb');
  const chips = [['<|startoftranscript|>', 'paper'], ['<|en|>', 'paper'], ['<|transcribe|>', 'paper'], ['<|0.00|>', 'wash'], ['Pick up the red cup.', 'wash-strong'], ['<|1.50|>', 'wash'], ['<|endoftext|>', 'paper']];
  let x = 10, y = 202;
  for (const [c, cls] of chips) {
    const w = c.length * 6.9 + 14;
    if (x + w > 552) { x = 10; y += 36; }
    o += rect(x, y, w, 26, cls, 4) + text(x + w / 2, y + 17, esc2(c), 'ts', 'middle');
    x += w + 6;
  }
  o += text(10, y + 52, '前三个指定语言和任务；timestamp 以 20 ms 为一格，0.00 到 30.00 共 1501 个。', 'ts');
  return svg(560, y + 60, o, 'Whisper 把 1.5 s 的 command 补到 30 s，3000 个 frame 变成 1500 个 audio token，只有 75 个对应声音；decoder 输出 startoftranscript、en、transcribe、两个 timestamp 之间的文字和结束 token');
}

// 第 8 站：plane wave 扫过 4 个 microphone（动图）
function micA() {
  const O = [280, 190], u = [0.5, -Math.sqrt(3) / 2], v = [Math.sqrt(3) / 2, 0.5];
  const mx = [160, 240, 320, 400];
  const proj = mx.map((x) => (x - O[0]) * u[0]);
  let o = '';
  o += line(110, O[1], 450, O[1], 'grid');
  // 角度
  o += path(`M${O[0] + 150} ${O[1]} A150 150 0 0 0 ${f1(O[0] + 150 * u[0])} ${f1(O[1] + 150 * u[1])}`, 'mute');
  o += line(O[0], O[1], O[0] + 175 * u[0], O[1] + 175 * u[1], 'dash');
  o += text(O[0] + 158, O[1] - 30, 'θ = 60°', 'ts');
  o += text(O[0] + 182 * u[0] + 8, O[1] + 182 * u[1], 'user 的方向', 'ts');
  // wavefront：沿 −u 移动
  const N = 60, s0 = 150, s1 = -150, hold = 0.8, run = 3.6, T = hold + run;
  const ss = Array.from({ length: N + 1 }, (_, j) => s0 + ((s1 - s0) * j) / N);
  const kt = [0, (hold - 0.01) / T, ...ss.map((_, j) => (hold + (run * j) / N) / T)];
  const sAll = [ss[N / 2], ss[N / 2], ...ss];
  const tx = sAll.map((s) => s * u[0]), ty = sAll.map((s) => s * u[1]);
  const L = 170;
  o += `<clipPath id="ee4706-mic-clip"><rect x="110" y="70" width="430" height="140"/></clipPath><g clip-path="url(#ee4706-mic-clip)"><g>${line(O[0] - L * v[0], O[1] - L * v[1], O[0] + L * v[0], O[1] + L * v[1], 'ln')}${atrans(tx, ty, kt, T)}</g></g>`;
  // microphone 与到达标记
  mx.forEach((x, k) => {
    o += rect(x - 7, O[1] - 9, 14, 18, 'paper', 3);
    const on = sAll.map((s) => (s <= proj[k] ? 1 : 0));
    o += `<g>${circle(x, O[1], 14, 'ln')}${dshow(on, kt, T)}</g>`;
    const dtu = ((proj[3] - proj[k]) / 40) * ((0.02 * 0.5) / 343) * 1e6;
    o += text(x, O[1] + 34, `mic ${k + 1}`, 'ts', 'middle') + text(x, O[1] + 50, k === 3 ? '0' : `+${dtu.toFixed(1)} μs`, k === 3 ? 'ts' : 'tl', 'middle');
  });
  o += text(200, O[1] - 18, 'd = 2 cm', 'ts', 'middle');
  // 下方：到达时刻与 sample 时刻
  const Yt = 300, st = lin(0, 100, 120, 500);
  o += line(st(0), Yt, st(100), Yt, 'axis');
  for (const t of [0, 25, 50, 75, 100]) o += line(st(t), Yt, st(t), Yt + 4, 'axis') + text(st(t), Yt + 17, String(t), 'ts', 'middle');
  o += text(st(100), Yt + 33, 'μs', 'ts', 'end');
  for (const t of [0, 62.5]) o += line(st(t), Yt - 30, st(t), Yt, 'dash');
  o += text(st(62.5) + 4, Yt - 22, '16 kHz 的下一个 sample', 'ts');
  [0, 1, 2, 3].map((k) => (k * 0.01 / 343) * 1e6).forEach((t) => { o += circle(st(t), Yt - 8, 4, 'ln-f'); });
  o += text(10, Yt - 4, '到达时刻', 'tb');
  o += text(10, 26, 'τ = d cos θ / c = 0.02 × 0.5 / 343 = 29.2 μs', 'tb');
  o += text(10, 44, '只有 0.47 个 sample：对齐要做 fractional delay', 'ts');
  return svgA(560, 340, o, '一个 plane wave 从 60 度方向依次扫过 4 个间距 2 cm 的 microphone，相邻的到达时间差 29.2 微秒，不到 16 kHz 下一个 sample 的一半');
}

// 第 9 站：Furhat baseline 的一次回合
function turn() {
  const sx = lin(-1.2, 3.0, 110, 545);
  let o = '';
  const bar = (a, b, y, cls, lab, tcls = 'ts') => rect(sx(a), y, sx(b) - sx(a), 26, cls) + (lab ? text((sx(a) + sx(b)) / 2, y + 17, lab, tcls, 'middle') : '');
  o += text(100, 42, 'user', 'tb', 'end') + bar(-1.0, 0, 26, 'wash-strong', '“Pick up the red cup.”', 't');
  o += text(100, 94, 'robot', 'tb', 'end') + text(100, 110, 'baseline', 'ts', 'end');
  o += bar(0, 1, 80, 'wash2', '等 1 s silence') + bar(1, 1.5, 80, 'wash', 'LLM') + bar(1.5, 2.5, 80, 'wash-strong', 'TTS 1 s');
  o += rect(sx(2.5), 80, sx(3.0) - sx(2.5), 26, 'solid') + text(sx(2.75), 97, '开口', 'tw', 'middle');
  o += line(sx(2.6), 70, sx(2.6), 116, 'dash') + text(sx(2.6), 64, '实测峰值 2.6 s', 'ts', 'middle');
  o += text(100, 158, '人', 'tb', 'end');
  o += rect(sx(0.2), 142, sx(3.0) - sx(0.2), 26, 'solid') + text(sx(0.2) + 8, 159, '0.2 s 后已经在回答', 'tw', 'start');
  o += line(sx(0), 20, sx(0), 186, 'ink');
  o += text(sx(0), 200, '用户说完', 'tl', 'middle');
  for (const t of [-1, 0, 1, 2, 3]) o += line(sx(t), 186, sx(t), 190, 'axis') + text(sx(t), 222, `${t} s`, 'ts', 'middle');
  o += line(sx(-1.2), 186, sx(3.0), 186, 'axis');
  o += text(10, 248, '1 + 0.5 + 1 = 2.5 s，和实测的峰值 2.6 s 接近（Skantze and Irfan 2025）。', 'ts');
  return svg(560, 256, o, 'Furhat baseline 从用户说完起，先等 1 s silence，再 LLM 0.5 s、TTS 1 s，2.5 s 后才开口；人在 0.2 s 后已经接话');
}

// 第 9 站：silero-vad 的规则在一串 probability 上（动图）
function vadA() {
  const dt = 0.032, N = 110;
  const pAt = (i) => { const t = (i + 0.5) * dt; if (t < 0.10) return 0.04; if (t < 1.06) return t > 0.46 && t < 0.62 ? 0.42 : 0.92; if (t < 1.5) return 0.06; if (t < 2.14) return 0.93; return 0.05; };
  const P = Array.from({ length: N }, (_, i) => pAt(i));
  const run = (minMs) => {
    const ms = (16000 * minMs) / 1000; let trig = false, temp = 0, cur = 0; const ev = [];
    P.forEach((p) => { cur += 512; if (p >= 0.5 && temp) temp = 0; if (p >= 0.5 && !trig) { trig = true; ev.push(cur / 16000); return; } if (p < 0.35 && trig) { if (!temp) temp = cur; if (cur - temp < ms) return; ev.push(cur / 16000); temp = 0; trig = false; } });
    const seg = []; for (let k = 0; k < ev.length; k += 2) seg.push([ev[k], ev[k + 1]]); return seg;
  };
  const A = run(100), B = run(1000);
  const sx = lin(0, 3.5, 92, 545);
  let o = '';
  o += text(84, 30, 'user', 'tb', 'end');
  o += rect(sx(0.10), 16, sx(1.06) - sx(0.10), 22, 'wash-strong') + text(sx(0.58), 32, 'Pick up the', 't', 'middle');
  o += rect(sx(1.5), 16, sx(2.14) - sx(1.5), 22, 'wash-strong') + text(sx(1.82), 32, 'red cup', 't', 'middle');
  o += text(sx(1.28), 32, '停 0.44 s', 'ts', 'middle');
  // probability
  const yb = 150, hp = 90;
  o += text(84, 100, 'speech', 'tb', 'end') + text(84, 116, 'probability', 'ts', 'end');
  P.forEach((p, i) => { o += rect(sx(i * dt) + 0.4, yb - hp * p, sx(dt) - sx(0) - 0.8, hp * p, 'wash'); });
  o += line(sx(0), yb, sx(3.5), yb, 'axis');
  o += line(sx(0), yb - hp * 0.5, sx(3.5), yb - hp * 0.5, 'dash') + text(sx(3.5), yb - hp * 0.5 - 4, '0.5', 'ts', 'end');
  o += line(sx(0), yb - hp * 0.35, sx(3.5), yb - hp * 0.35, 'dash') + text(sx(3.5), yb - hp * 0.35 + 13, '0.35', 'ts', 'end');
  o += text(sx(0.54), 56, '0.42：在两条线之间', 'ts', 'middle') + line(sx(0.54), 60, sx(0.54), yb - hp * 0.42 - 3, 'mute');
  // 状态条：随 cursor 增长
  const hold = 1.6, runT = 3.5, T = hold + runT + 0.6, M = 70;
  const cur = [3.5, 3.5, ...Array.from({ length: M + 1 }, (_, j) => (3.5 * j) / M), 3.5];
  const kt = [0, (hold - 0.01) / T, ...Array.from({ length: M + 1 }, (_, j) => (hold + (runT * j) / M) / T), 1];
  const stateRow = (segs, y, name, sub) => {
    let q = text(84, y + 14, name, 'tb', 'end') + text(84, y + 30, sub, 'ts', 'end');
    q += rect(sx(0), y, sx(3.5) - sx(0), 22, 'frame');
    for (const [a, b] of segs) {
      const ws = cur.map((c) => f1(Math.max(0, Math.min(c, b) - a) * (sx(1) - sx(0))));
      q += `<rect x="${f1(sx(a))}" y="${y}" width="${ws[0]}" height="22" class="solid">${anim('width', ws, kt, T)}</rect>`;
      const on = cur.map((c) => (c >= b ? 1 : 0));
      q += `<g>${line(sx(b), y - 4, sx(b), y + 26, 'ink')}${b > 3 ? text(sx(b) - 4, y + 38, `${b.toFixed(3)} s 判定说完`, 'tl', 'end') : text(sx(b) + 4, y + 38, `${b.toFixed(3)} s 判定说完`, 'tl', 'start')}${dshow(on, kt, T)}</g>`;
    }
    return q;
  };
  o += stateRow(A, 176, 'min_silence', '100 ms');
  o += stateRow(B, 236, 'min_silence', '1000 ms');
  o += `<line x1="${f1(sx(3.5))}" y1="12" x2="${f1(sx(3.5))}" y2="262" class="mute">${anim('x1', cur.map((c) => f1(sx(c))), kt, T)}${anim('x2', cur.map((c) => f1(sx(c))), kt, T)}</line>`;
  for (const t of [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]) o += line(sx(t), 286, sx(t), 290, 'axis') + text(sx(t), 304, `${t}`, 'ts', 'middle');
  o += line(sx(0), 286, sx(3.5), 286, 'axis') + text(sx(3.5), 320, '时间（s）；每根细条是一个 32 ms 的 window', 'ts', 'end');
  return svgA(560, 328, o, '同一串 VAD probability 在两种 min_silence 下：100 ms 在 1.216 秒就判定说完，把 Pick up the 切成一句；1000 ms 要到 3.2 秒才判定，比用户说完晚 1.06 秒');
}

// 第 9 站：LocalAgreement-2 的三次 update
function agree() {
  const rows = [
    ['update 1', '0–1.0 s', [['pick', 0], ['up', 0], ['the', 0], ['bread', 0]], '还没有 confirmed'],
    ['update 2', '0–1.5 s', [['pick', 1], ['up', 1], ['the', 1], ['red', 0], ['cup', 0]], 'confirmed：pick up the'],
    ['update 3', '0–2.0 s', [['pick', 1], ['up', 1], ['the', 1], ['red', 1], ['cup', 1], ['and', 0]], 'confirmed：pick up the red cup'],
  ];
  let o = '';
  rows.forEach(([u, buf, ws, note], r) => {
    const y = 20 + r * 74;
    o += text(10, y + 18, u, 'tb') + text(10, y + 34, `buffer ${buf}`, 'ts');
    let x = 130;
    ws.forEach(([w, c]) => {
      const wd = w.length * 8 + 18;
      o += rect(x, y, wd, 28, c ? 'solid' : 'paper', 4) + text(x + wd / 2, y + 19, w, c ? 'tw' : 't', 'middle');
      if (w === 'bread') o += text(x + wd + 8, y + 19, '← 听到一半的“red”', 'ts', 'start');
      x += wd + 6;
    });
    o += text(130, y + 48, note, r ? 'tl' : 'ts', 'start');
  });
  o += text(10, 250, '实心：连续两次 output 的公共 prefix，以后不再改。空心：unconfirmed，下一次还可能变。', 'ts');
  return svg(560, 258, o, 'LocalAgreement-2：第一次 output 是 pick up the bread，第二次是 pick up the red cup，公共 prefix pick up the 被 confirmed；第三次之后 pick up the red cup 被 confirmed');
}

// 第 9 站：streaming TTS 的 chunk 时间线
function tts() {
  const ch = (20 * 256) / 22050 * 1000;
  const sx = lin(0, 1150, 130, 545);
  let o = '';
  const sched = (speed, n) => {
    const c = ch / speed, comp = [], play = [];
    let end = 0;
    for (let k = 0; k < n; k++) { comp.push([k * c, (k + 1) * c]); const st = Math.max((k + 1) * c, end); play.push([st, st + ch]); end = st + ch; }
    return { comp, play };
  };
  const block = (segs, y, cls, lab, tcls) => segs.map(([a, b], k) => { const b2 = Math.min(b, 1150); return b2 > a ? rect(sx(a), y, sx(b2) - sx(a), 24, cls) + (sx(b2) - sx(a) > 30 ? text((sx(a) + sx(b2)) / 2, y + 16, `${lab}${k + 1}`, tcls, 'middle') : '') : ''; }).join('');
  const A = sched(1.43, 7), B = sched(0.8, 4);
  o += text(10, 20, 'HiFi-GAN V1，CPU 上 1.43 倍 real time', 'tb');
  o += text(122, 50, 'vocoder 在算', 'ts', 'end') + block(A.comp, 34, 'wash', 'c', 'ts');
  o += text(122, 84, 'loudspeaker 在播', 'ts', 'end') + block(A.play, 68, 'solid', 'c', 'tw');
  o += line(sx(A.comp[0][1]), 58, sx(A.comp[0][1]), 68, 'ink') + text(sx(A.comp[0][1]) + 3, 108, `first audio：${A.comp[0][1].toFixed(0)} ms`, 'tl', 'start');
  o += text(10, 140, '假设一个 0.8 倍 real time 的 vocoder', 'tb');
  o += text(122, 170, 'vocoder 在算', 'ts', 'end') + block(B.comp, 154, 'wash', 'c', 'ts');
  o += text(122, 204, 'loudspeaker 在播', 'ts', 'end') + block(B.play, 188, 'solid', 'c', 'tw');
  for (let k = 1; k < B.play.length; k++) { const g0 = B.play[k - 1][1], g1 = B.play[k][0]; if (g1 < 1150 && g1 - g0 > 1) o += text((sx(g0) + sx(g1)) / 2, 228, `空白 ${(g1 - g0).toFixed(0)} ms`, 'tl', 'middle'); }
  for (let t = 0; t <= 1100; t += 100) o += line(sx(t), 244, sx(t), 248, 'axis') + (t % 200 === 0 ? text(sx(t), 262, String(t), 'ts', 'middle') : '');
  o += line(sx(0), 244, sx(1150), 244, 'axis') + text(sx(1150), 278, 'ms', 'ts', 'end');
  o += text(10, 300, `一个 chunk = 20 个 mel frame = ${ch.toFixed(1)} ms 的 audio。上面每个 chunk 算 ${(ch / 1.43).toFixed(1)} ms，播放之前已经就绪。`, 'ts');
  return svg(560, 308, o, 'Streaming TTS：HiFi-GAN V1 在 CPU 上每个 232 毫秒的 chunk 算 162 毫秒，第二个 chunk 起计算总领先于播放，声音连续；一个 0.8 倍 real time 的 vocoder 每两个 chunk 之间留下 58 毫秒的空白');
}

// 第 9 站：barge-in
function barge() {
  let o = '';
  // 上：几何
  o += rect(80, 30, 92, 80, 'paper', 18) + text(126, 22, 'robot', 'ts', 'middle');
  o += rect(96, 82, 22, 14, 'wash-strong ink-s', 2) + text(76, 94, 'loudspeaker', 'ts', 'end');
  o += circle(152, 89, 6, 'ink-f') + text(152, 64, 'mic', 'ts', 'middle');
  o += line(107, 122, 152, 122, 'ink') + line(107, 118, 107, 126, 'ink') + line(152, 118, 152, 126, 'ink') + text(130, 140, '0.1 m', 'ts', 'middle');
  o += circle(470, 52, 13, 'wash-strong ink-s') + rect(452, 68, 36, 46, 'wash-strong ink-s', 8) + text(470, 132, 'user', 'ts', 'middle');
  o += line(158, 89, 446, 89, 'dash') + text(302, 82, '1.5 m', 'ts', 'middle');
  o += text(282, 164, 'free field 里 pressure ∝ 1/距离：robot 自己的声音比 user 高 20 log10(15) = 23.5 dB', 'tl', 'middle');
  // 下：时间线
  const words = ['I', 'will', 'put', 'the', 'cup', 'in', 'the', 'sink', 'and', 'then', 'wipe', 'the', 'table'];
  let x = 20; const y = 196, stopAt = 8;
  o += text(10, 186, 'robot 在说', 'tb');
  words.forEach((w, k) => {
    const wd = w.length * 7.6 + 12;
    o += rect(x, y, wd, 26, k < stopAt ? 'solid' : 'paper', 3) + text(x + wd / 2, y + 17, w, k < stopAt ? 'tw' : 'ts', 'middle');
    if (k === stopAt) { o += line(x - 3, y - 10, x - 3, y + 66, 'ln') + text(x, y + 82, '在下一个 word 边界停下', 'tl', 'middle'); }
    if (k === 6) o += rect(x, y + 36, 280, 24, 'wash-strong') + text(x + 92, y + 53, 'user：“No, not the sink”', 't', 'start');
    x += wd + 4;
  });
  o += text(10, y + 112, 'LLM 的 history 只放说出口的部分：', 'ts');
  o += rect(10, y + 120, 300, 26, 'wash', 4) + text(20, y + 137, 'robot：“I will put the cup in the sink”', 't', 'start');
  o += text(330, y + 137, '空心的半句从没播出，不进 history', 'ts', 'start');
  return svg(560, y + 154, o, '上：robot 的 loudspeaker 离自己的 microphone 0.1 米，user 在 1.5 米外，robot 自己的声音在 microphone 上高 23.5 分贝。下：robot 说到 sink 时 user 插话，robot 在下一个 word 边界停下，LLM 的 history 只保留说出口的部分');
}

// 第 9 站：四种做法的 latency 账
function budget() {
  const sx = lin(0, 2.7, 170, 545);
  let o = '';
  const row = (y, name, sub, segs, endLab) => {
    let q = text(160, y + 12, name, 'tb', 'end') + text(160, y + 28, sub, 'ts', 'end');
    let t = 0;
    segs.forEach(([lab, d0, cls]) => { q += rect(sx(t), y, sx(t + d0) - sx(t), 26, cls); const a0 = t === 0 ? sx(0.23) : sx(t); if (sx(t + d0) - a0 > lab.length * 6.5 + 6) q += text((a0 + sx(t + d0)) / 2, y + 17, lab, cls === 'solid' ? 'tw' : 'ts', 'middle'); t += d0; });
    q += text(Math.max(sx(t), sx(0.23)) + 6, y + 17, endLab, 'tl', 'start');
    return q;
  };
  o += row(20, '串行', 'Furhat baseline', [['等 silence 1 s', 1, 'wash2'], ['LLM 0.5', 0.5, 'wash'], ['TTS 1 s', 1, 'wash-strong']], '2.5 s');
  o += row(80, 'Streaming', '每段只算第一块', [['gap', 0.5, 'wash2'], ['', 0.156, 'wash'], ['', 0.162, 'wash-strong']], '≥ 0.82 s');
  o += text(sx(0.5), 126, 'LLM 第一句 0.156 + vocoder 第一个 chunk 0.162', 'ts', 'start') + text(sx(0.5), 142, '（ASR、prefill、mel 没有计入）', 'ts', 'start');
  o += row(162, '提前准备', 'VAP + TurnGPT', [['gap', 0.5, 'wash2']], '回复已就绪；实测 mode 0.6 s');
  o += row(218, 'Moshi', '一个 model', [['', 0.2, 'solid']], '实际 200 ms（理论 160 ms）');
  o += line(sx(0.23), 12, sx(0.23), 256, 'ln-dash') + text(sx(0.23) + 4, 270, '人：230 ms', 'tl', 'start');
  for (const t of [0, 0.5, 1, 1.5, 2, 2.5]) o += line(sx(t), 256, sx(t), 260, 'axis') + text(sx(t), 290, `${t} s`, 'ts', 'middle');
  o += line(sx(0), 256, sx(2.7), 256, 'axis');
  o += text(10, 314, '时间从用户说完算起。串行时整段相加；streaming 时只有每段的第一块相加。', 'ts');
  return svg(560, 322, o, '四种做法的 latency：串行 2.5 秒；每段 streaming 至少 0.82 秒；提前准备时只剩 0.5 秒的 gap，实测 mode 0.6 秒；Moshi 实际 200 毫秒，人 230 毫秒');
}

export default {
  'ee4706-pause': pause,
  'ee4706-react': reactA,
  'ee4706-layers': layers,
  'ee4706-subsume': subsume,
  'ee4706-clip': clip,
  'ee4706-grid': gridA,
  'ee4706-vlmap': vlmap,
  'ee4706-saycan': saycan,
  'ee4706-rssm': rssm,
  'ee4706-twohot': twohot,
  'ee4706-legible': legibleA,
  'ee4706-assist': assist,
  'ee4706-latency': latency,
  'ee4706-rtc': rtcA,
  'ee4706-frames': framesA,
  'ee4706-melbank': melbank,
  'ee4706-ctc': ctcA,
  'ee4706-whisperwin': whisperwin,
  'ee4706-mic': micA,
  'ee4706-turn': turn,
  'ee4706-vad': vadA,
  'ee4706-agree': agree,
  'ee4706-tts': tts,
  'ee4706-barge': barge,
  'ee4706-budget': budget,
};
