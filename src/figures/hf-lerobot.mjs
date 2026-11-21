import { svg, svgA, lin, d, path, line, rect, circle, poly, text, arrow, apath, anim, ashow, f1 } from '../lib/svg.mjs';

// 一个 rect 的 path 形式（宽度为 0 时退化成一条竖线，方便做 d 的动画）
const rp = (x, y, w, h) => `M${f1(x)} ${f1(y)}H${f1(x + Math.max(w, 0))}V${f1(y + h)}H${f1(x)}Z`;

// ---------- 开头第一次事故：loop 只跑到 25 Hz，timestamp 仍按 30 Hz 写 ----------
function cadence() {
  const sx = lin(0, 400, 60, 440);
  let o = text(280, 16, 'observe 一步要 38 ms，超过 33.3 ms 的 budget：每帧实际隔 40 ms', 'tb', 'middle');
  const Y1 = 64, Y2 = 164;
  o += text(60, Y1 - 18, '真实时刻（ms）', 'ts') + text(60, Y2 - 14, 'dataset 里写的 timestamp（ms）= frame index / 30', 'ts');
  o += line(sx(0), Y1, sx(400), Y1, 'axis') + line(sx(0), Y2, sx(400), Y2, 'axis');
  for (const v of [0, 100, 200, 300, 400]) {
    o += line(sx(v), Y1, sx(v), Y1 + 4, 'axis') + text(sx(v), Y1 + 16, String(v), 'ts', 'middle');
    o += line(sx(v), Y2, sx(v), Y2 - 4, 'axis') + text(sx(v), Y2 + 18, String(v), 'ts', 'middle');
  }
  for (let i = 0; i <= 10; i++) {
    const a = sx(40 * i), b = sx((1000 / 30) * i);
    o += line(a, Y1 + 22, b, Y2 - 42, 'grid');
    o += circle(a, Y1, 4, i === 10 ? 'ln-f' : 'ink-f') + circle(b, Y2, 4, i === 10 ? 'ln-f' : 'ink-f');
  }
  o += text(sx(400) + 10, Y1 + 5, 'frame 10：400 ms', 'tl', 'start');
  o += text(sx(1000 / 3), Y2 + 36, 'frame 10 记成 333 ms', 'tl', 'middle');
  o += text(280, 232, '20 s 的示教只录到 500 帧，dataset 说它长 500 / 30 = 16.7 s。', 'ts', 'middle');
  o += text(280, 249, 'Policy 学到的是一段快了 1.2 倍的动作，部署时照 30 Hz 执行，也就快 1.2 倍。', 'ts', 'middle');
  return svg(560, 256, o, '上面一条时间轴是真实时刻，帧间隔 40 毫秒；下面是 dataset 里写的 timestamp，帧间隔 33.3 毫秒。第 10 帧真实在 400 毫秒，被记成 333 毫秒。');
}

// ---------- 开头第二次事故：100 个 action 的 chunk 盲走 ----------
function blind() {
  const u = 12, O = [100, 200];
  const P = ([x, y]) => [O[0] + x * u, O[1] - y * u];
  const tgt = [22, 8], moved = [22, 5];
  const s = (t) => 10 * t ** 3 - 15 * t ** 4 + 6 * t ** 5;
  let o = '';
  for (let x = 0; x <= 24; x += 4) o += line(...P([x, -0.5]), ...P([x, 10.5]), 'grid');
  for (let y = 0; y <= 10; y += 2) o += line(...P([-0.5, y]), ...P([24, y]), 'grid');
  o += text(40, 62, '桌面 top view，格子 4 cm × 2 cm', 'ts', 'start');
  for (let k = 0; k <= 100; k += 10) {
    const p = P(tgt.map((v) => v * s(k / 100)));
    o += circle(p[0], p[1], 2.4, 'ink-f');
  }
  const p15 = P(tgt.map((v) => v * s(0.15)));
  o += circle(p15[0], p15[1], 5, 'ln-f');
  o += text(p15[0] - 9, p15[1] + 4, '起点', 'ts', 'end');
  o += text(p15[0] - 4, p15[1] + 26, '红点：action 15（0.5 s），几乎还没动', 'ts', 'start');
  const sq = (c, cls) => { const [x, y] = P(c); const h = 1.0 * u; return rect(x - h, y - h, 2 * h, 2 * h, cls); };
  o += sq(tgt, 'dash') + sq(moved, 'wash-strong');
  const th = Math.atan2(tgt[1], tgt[0]), n = [-Math.sin(th), Math.cos(th)], e = [Math.cos(th), Math.sin(th)];
  const fing = (side) => {
    const c = [tgt[0] + side * 1.55 * n[0], tgt[1] + side * 1.55 * n[1]];
    const pts = [[-1.4, -0.3], [1.0, -0.3], [1.0, 0.3], [-1.4, 0.3]].map(([a, b]) => P([c[0] + a * e[0] + b * n[0], c[1] + a * e[1] + b * n[1]]));
    return poly(pts, 'paper');
  };
  o += fing(1) + fing(-1);
  const lo = P(tgt), lm = P(moved), LX = 404;
  o += text(LX, lo[1] - 22, '虚线框：chunk 开始时', 'ts', 'start') + text(LX, lo[1] - 6, 'camera 看到的 cube；', 'ts', 'start') + text(LX, lo[1] + 10, 'finger 最后在这里合上', 'ts', 'start');
  o += text(LX, lm[1] + 4, '实心块：0.5 s 时', 'tl', 'start') + text(LX, lm[1] + 21, '被推开 3 cm', 'tl', 'start');
  o += text(40, 22, '一个 chunk = 100 个 action = 3.33 s，执行期间不看 camera', 'tb', 'start');
  o += text(40, 40, '剩下的 85 个 action 照旧开到虚线框', 'ts', 'start');
  return svg(560, 236, o, '俯视图：gripper 沿一串点走向 cube 原来的位置；cube 在 0.5 秒时被推开 3 厘米，gripper 仍然在原位置合上');
}

// ---------- 开头第三次事故：synchronous 执行，每个 chunk 停一次 ----------
function stall() {
  const sx = lin(0, 6, 40, 530), Y = 62, H = 26;
  let o = text(40, 20, 'SmolVLA 默认：执行完 50 个 action（30 Hz 下 1.67 s）才算下一个 chunk', 'tb', 'start');
  let t = 0, k = 0;
  while (t < 6 - 1e-9) {
    const m = Math.min(50 / 30, 6 - t);
    o += rect(sx(t), Y, sx(t + m) - sx(t), H, 'wash');
    if (m > 1.5) o += text((sx(t) + sx(t + m)) / 2, Y + 17, '执行 50 个 action', 'ts', 'middle');
    t += m;
    if (t >= 6 - 1e-9) break;
    const st = Math.min(0.3, 6 - t);
    o += rect(sx(t), Y, sx(t + st) - sx(t), H, 'solid');
    if (k === 0) o += line(sx(t + 0.15), Y - 2, sx(t + 0.15), Y - 14, 'mute') + text(sx(t + 0.15), Y - 18, '停 0.3 s 等 inference', 'ts', 'middle');
    t += st; k++;
  }
  o += line(sx(0), Y + H + 6, sx(6), Y + H + 6, 'axis');
  for (let v = 0; v <= 6; v++) o += line(sx(v), Y + H + 6, sx(v), Y + H + 10, 'axis') + text(sx(v), Y + H + 23, v + ' s', 'ts', 'middle');
  o += text(285, 136, 'Robot 在动的时间 1.667 / (1.667 + 0.3) = 84.7%，每 2 s 左右停一下', 'ts', 'middle');
  return svg(560, 144, o, '时间轴：浅色块是执行 50 个 action 的 1.67 秒，深色块是 0.3 秒的停顿，交替出现');
}

// ---------- 第 2 站：v3 的文件布局与一次查询 ----------
function layout() {
  let o = text(40, 16, 'meta/episodes/chunk-000/file-000.parquet（每个 episode 一行）', 'tb', 'start');
  const cols = [40, 110, 250, 390], heads = ['episode', 'dataset_from_index', 'dataset_to_index', 'videos/…wrist/from_timestamp'];
  const rows = [[0, 0, 600, '0.0'], [1, 600, 1050, '20.0'], [2, 1050, 1650, '35.0']];
  heads.forEach((h, i) => { o += text(cols[i], 40, h, 'ts', 'start'); });
  rows.forEach((r, j) => {
    const y = 60 + j * 20;
    if (j === 1) o += rect(34, y - 14, 492, 19, 'wash');
    r.forEach((v, i) => { o += text(cols[i], y, String(v), j === 1 ? 'tb' : 't', 'start'); });
  });
  const sx = lin(0, 1650, 40, 520);
  const strip = (y, label, segs) => {
    let q = text(40, y - 8, label, 'ts', 'start');
    segs.forEach(([a, b, s, c], i) => { q += rect(sx(a), y, sx(b) - sx(a), 22, i === 1 ? 'wash-strong' : 'wash2') + text(sx(c ?? (a + b) / 2), y + 15, s, 'ts', 'middle'); });
    return q;
  };
  o += strip(150, 'data/chunk-000/file-000.parquet：所有 episode 的行接在一起', [[0, 600, 'ep 0：行 0–599'], [600, 1050, 'ep 1：行 600–1049', 915], [1050, 1650, 'ep 2：行 1050–1649']]);
  o += strip(226, 'videos/observation.images.wrist/chunk-000/file-000.mp4：所有 episode 的画面接在一起', [[0, 600, '0–20 s'], [600, 1050, '20–35 s'], [1050, 1650, '35–55 s']]);
  // 一次查询：dataset[700]
  o += line(sx(700), 147, sx(700), 176, 'ln') + circle(sx(700), 161, 4, 'ln-f');
  o += text(sx(700) + 6, 196, 'dataset[700]：ep 1 的第 100 行', 'tl', 'start');
  o += arrow(sx(700), 176, sx(700), 222, 'ln');
  o += text(280, 274, 'wrist 的画面在 mp4 里的 20.0 + 100 / 30 = 23.33 s 处：先查 episode 那一行，再定位 shared file', 'ts', 'middle');
  return svg(560, 282, o, 'episodes 表的每一行记录一个 episode 在共享 parquet 文件里的行号范围和在共享 mp4 里的起始时间；dataset 第 700 项落在 episode 1，对应视频 23.33 秒处');
}

// ---------- 第 2 站：delta window 在 episode 末尾被 clamp（动图） ----------
function windowA() {
  const N = 600, K = 100, sx = lin(0, 700, 40, 460);
  const a0 = 380, a1 = 599, Tmove = 5, Thold = 1.6, T = Tmove + Thold;
  const H0 = 2.0, TT = H0 + T, n = 44, kt = [0, H0 / TT], as = [550, 550];
  for (let i = 0; i <= n; i++) { kt.push((H0 + 0.001 + Tmove * i / n) / TT); as.push(Math.round(a0 + (a1 - a0) * i / n)); }
  kt.push(1); as.push(a1);
  let o = text(40, 16, 'ACT：dataset[a] 要取 action 的 a, a+1, …, a+99 行', 'tb', 'start');
  // episode 条
  const Y = 64;
  o += rect(sx(0), Y, sx(N) - sx(0), 20, 'wash2') + text(sx(0), Y - 8, 'episode：frame 0–599（20 s）', 'ts', 'start');
  o += line(sx(N), Y - 10, sx(N), Y + 24, 'ink-b') + text(sx(N) + 4, Y - 8, 'episode 结束', 'ts', 'start');
  for (const v of [0, 200, 400, 600]) o += text(sx(v), Y + 34, String(v), 'ts', 'middle');
  // window：有效部分 + 越界部分
  o += apath(as.map((a) => rp(sx(a), Y - 3, sx(Math.min(a + K, N)) - sx(a), 26)), kt, TT, 'ln');
  o += apath(as.map((a) => rp(sx(N), Y - 3, sx(Math.max(a + K, N)) - sx(N), 26)), kt, TT, 'ln-dash');
  o += `<path d="M${f1(sx(as[0]))} ${Y - 6}l-5 -9h10z" class="ln-f">${anim('d', as.map((a) => `M${f1(sx(a))} ${Y - 6}l-5 -9h10z`), kt, TT)}</path>`;
  // 下面：100 个位置的 action_is_pad
  const bx = lin(0, 100, 40, 440), BY = 140;
  o += text(40, BY - 10, '取回的 100 个 action（越界的位置重复 frame 599 的 action）', 'ts', 'start');
  const pad = (a) => Math.max(0, a + K - N);
  o += apath(as.map((a) => rp(bx(0), BY, bx(K - pad(a)) - bx(0), 20)), kt, TT, 'wash-strong');
  o += apath(as.map((a) => rp(bx(K - pad(a)), BY, bx(K) - bx(K - pad(a)), 20)), kt, TT, 'solid');
  o += rect(bx(0), BY, bx(K) - bx(0), 20, 'frame');
  for (const v of [0, 50, 100]) o += text(bx(v), BY + 34, String(v), 'ts', 'middle');
  // 读数：按 a 的区间显示
  const marks = [380, 420, 460, 500, 520, 540, 550, 560, 580, 599];
  marks.forEach((m, i) => {
    const hi = i + 1 < marks.length ? marks[i + 1] : 1e9;
    const on = as.map((a) => a >= m && a < hi);
    const p = pad(m);
    o += `<text x="460" y="${BY + 15}" class="${p ? 'tl' : 't'}" text-anchor="start">pad ${p} 个${ashow(on, kt, TT)}</text>`;
    o += `<text x="40" y="${BY + 62}" class="ts" text-anchor="start">a = ${m}：action_is_pad 有 ${p} 个 True，L1 loss 只在 ${K - p} 个位置上平均${ashow(on, kt, TT)}</text>`;
  });
  o += text(40, BY + 82, '600 个 anchor 里 99 个碰到边界；把所有位置合起来，8.25% 是 pad。', 'ts', 'start');
  return svgA(560, 232, o, '动图：长度 100 的 window 沿一个 600 帧的 episode 往右移；越过 episode 结束的部分用 frame 599 填充，下方条显示有效部分缩短、pad 部分增长，a 等于 599 时 pad 99 个');
}

// ---------- 第 4 站：SmolVLA 里 token 怎样流动 ----------
function smolvla() {
  let o = '';
  const toks = [['camera1', '64', 40], ['camera2', '64', 118], ['camera3', '64', 196], ['language', '≤ 48', 274], ['state', '1', 352]];
  o += text(40, 16, 'Prefix（每次 inference 只算一遍）', 'tb', 'start');
  for (const [nm, c, x] of toks) {
    o += rect(x, 28, 70, 34, 'wash', 4) + text(x + 35, 43, nm, 'ts', 'middle') + text(x + 35, 57, c + ' token', 't', 'middle');
  }
  o += text(430, 41, '每个 camera 512×512', 'ts', 'start') + text(430, 57, '经 pixel shuffle 成 64 个', 'ts', 'start');
  for (const x of [75, 153, 231, 309, 387]) o += arrow(x, 64, x, 90, 'mute', 5);
  o += rect(40, 92, 382, 40, 'paper', 6) + text(231, 110, 'SmolVLM2：只用前 16 层（共 32 层）', 'tb', 'middle') + text(231, 126, '默认 freeze：train_expert_only = True', 'ts', 'middle');
  o += arrow(360, 134, 360, 158, 'ink');
  o += rect(250, 160, 220, 28, 'wash2', 4) + text(360, 179, '每层的 key / value 存成 KV cache', 't', 'middle');
  // action expert
  const EX = 40, EY = 250;
  o += text(EX, EY - 12, 'Suffix（每个 Euler step 算一遍，共 10 遍）', 'tb', 'start');
  o += rect(EX, EY, 120, 40, 'wash', 4) + text(EX + 60, EY + 17, '50 个 action token', 'ts', 'middle') + text(EX + 60, EY + 33, 'x_t，t 从 1 走到 0', 'ts', 'middle');
  o += arrow(EX + 122, EY + 20, 200, EY + 20, 'ink');
  o += rect(202, EY, 200, 40, 'paper', 6) + text(302, EY + 17, 'Action expert（约 100M）', 'tb', 'middle') + text(302, EY + 33, 'cross-attn 与 self-attn 交替', 'ts', 'middle');
  o += line(380, 190, 380, EY - 8, 'dash') + arrow(380, EY - 10, 380, EY - 1, 'mute', 5) + text(388, 222, '读 cache', 'ts', 'start');
  o += arrow(404, EY + 20, 440, EY + 20, 'ink') + text(446, EY + 16, 'velocity v', 't', 'start') + text(446, EY + 32, 'x ← x − 0.1 v', 'ts', 'start');
  o += path(`M480 ${EY + 40}V${EY + 62}H100V${EY + 44}`, 'mute') + poly([[100, EY + 42], [96, EY + 50], [104, EY + 50]], 'mute-f');
  o += text(290, EY + 76, '重复 10 次，得到 50 × 32 的 chunk；SO-101 只用前 6 维，其余是 padding', 'ts', 'middle');
  return svg(560, 334, o, 'SmolVLA 的 token 流：三个 camera 各 64 个 token、最多 48 个 language token、1 个 state token 过 SmolVLM2 的前 16 层，存成 KV cache；action expert 读 cache，对 50 个 action token 做 10 步 Euler integration');
}

// ---------- 第 4 站 :::wrong：flow 的方向写反 ----------
function flowdir() {
  const sx = lin(0, 10, 70, 360), sy = lin(-3.2, 1, 236, 30);
  let o = '';
  for (const v of [-3, -2, -1, 0, 1]) o += line(sx(0), sy(v), sx(10), sy(v), 'grid') + text(sx(0) - 8, sy(v) + 4, (v < 0 ? '−' : '') + Math.abs(v), 'ts', 'end');
  o += line(sx(0), sy(-3.2), sx(10), sy(-3.2), 'axis');
  for (let k = 0; k <= 10; k += 2) o += text(sx(k), sy(-3.2) + 16, String(k), 'ts', 'middle');
  o += text(sx(10), sy(-3.2) + 32, 'Euler step 数 k', 'ts', 'end');
  o += line(sx(0), sy(0.6), sx(10), sy(0.6), 'dash') + text(sx(10) + 6, sy(0.6) + 4, 'action a = 0.6', 't', 'start');
  const good = [], bad = [];
  for (let k = 0; k <= 10; k++) { good.push([sx(k), sy(-1.2 + 0.18 * k)]); bad.push([sx(k), sy(-1.2 - 0.18 * k)]); }
  o += path(d(good), 'ln') + path(d(bad), 'ink');
  good.forEach(([x, y]) => { o += circle(x, y, 3, 'ln-f'); });
  bad.forEach(([x, y]) => { o += circle(x, y, 3, 'ink-f'); });
  o += text(sx(0.2), sy(-2.75), '两条线都从 noise ε = −1.2 出发', 'ts', 'start');
  o += text(sx(10) + 6, sy(0.6) + 22, 't: 1 → 0，dt = −0.1', 'tl', 'start') + text(sx(10) + 6, sy(0.6) + 38, '到达 0.6', 'ts', 'start');
  o += text(sx(10) + 6, sy(-3.0) + 4, 't: 0 → 1，dt = +0.1', 't', 'start') + text(sx(10) + 6, sy(-3.0) + 20, '跑到 −3.0', 'ts', 'start');
  o += text(70, 16, 'v = ε − a = −1.8 是一条常数 velocity；同一个 v，dt 的符号决定走向哪里', 'tb', 'start');
  return svg(560, 278, o, '两条折线都从 x 等于负 1.2 出发；按 LeRobot 的 convention 每步 dt 为负 0.1，十步后到达 action 0.6；把 dt 写成正 0.1，十步后跑到负 3.0');
}

// ---------- 第 5 站：synchronous 执行，两种 n_action_steps（动图） ----------
function syncA() {
  const FPS = 30, H = 50, D = 9, NT = 118, T = NT / FPS, hold = 0;
  const sim = (S) => {
    // 每个 tick 的状态：queue 长度、是否在等 inference
    const st = []; let q = 0, wait = D;
    for (let k = 0; k <= NT; k++) {
      if (q === 0 && wait > 0) { st.push({ q: 0, wait: true }); wait--; if (wait === 0) q = S; continue; }
      st.push({ q, wait: false }); q--; if (q === 0) wait = D;
    }
    return st;
  };
  const kt = []; for (let k = 0; k <= NT; k++) kt.push(k / NT);
  const cx = lin(0, H, 60, 520), tx = lin(0, NT, 60, 520);
  let o = '';
  const row = (S, y, title) => {
    const st = sim(S);
    let q = text(60, y - 8, title, 'tb', 'start');
    q += rect(cx(0), y, cx(H) - cx(0), 16, 'frame');
    for (let i = 10; i < H; i += 10) q += line(cx(i), y, cx(i), y + 16, 'grid');
    q += apath(st.map((s) => rp(cx(0), y, cx(s.q) - cx(0), 16)), kt, T, 'wash-strong', true);
    if (S < H) q += apath(st.map((s) => rp(cx(S), y, s.wait ? 0 : cx(H) - cx(S), 16)), kt, T, 'wash2', true);
    q += `<text x="520" y="${y - 8}" class="tl" text-anchor="end">等 inference，robot 停${ashow(st.map((s) => s.wait), kt, T)}</text>`;
    q += `<text x="520" y="${y - 8}" class="ts" text-anchor="end">执行 queue 里的 action${ashow(st.map((s) => !s.wait), kt, T)}</text>`;
    // timeline
    const ty = y + 28;
    let k0 = 0;
    for (let k = 1; k <= NT; k++) if (k === NT || st[k].wait !== st[k0].wait) { q += rect(tx(k0), ty, tx(k) - tx(k0), 10, st[k0].wait ? 'solid' : 'wash'); k0 = k; }
    q += apath([d([[tx(0), ty - 4], [tx(0), ty + 14]]), d([[tx(NT), ty - 4], [tx(NT), ty + 14]])], [0, 1], T, 'ink-b');
    const moving = st.slice(0, NT).filter((s) => !s.wait).length;
    q += text(520, ty + 26, '前 3.93 s 里在动 ' + (100 * moving / NT).toFixed(1) + '%', 'ts', 'end');
    return q;
  };
  o += row(50, 40, 'n_action_steps = 50：50 个全用完再算');
  o += row(10, 140, 'n_action_steps = 10：只用前 10 个，灰色 40 个丢掉');
  o += text(60, 240, '每格 10 个 action；inference 设为 0.3 s = 9 个 tick（假设的数）。下方色带：浅色在动，深色停。', 'ts', 'start');
  return svgA(560, 250, o, '动图：上下两个 action queue，每个 tick 消耗一个 action；queue 空了 robot 停 9 个 tick 等 inference。上面每次补 50 个，下面每次只用 10 个，停得更频繁');
}

// ---------- 第 6 站：remote inference 的 aligned merge（动图） ----------
function asyncA() {
  const FPS = 30, NT = 100, H0 = 2.4, Tm = NT / FPS, Tend = 0.6, T = H0 + Tm + Tend;
  const tx = lin(0, NT, 60, 540);
  const tk = (k) => (H0 + 0.01 + k / FPS) / T; // tick → keyTime（播放段）
  const h0 = H0 / T;
  const ch = [
    { nm: 'A', cap: 0, arr: 0, nextArr: 44, y: 78 },
    { nm: 'B', cap: 35, arr: 44, nextArr: 79, y: 120 },
    { nm: 'C', cap: 70, arr: 79, nextArr: 1e9, y: 162 },
  ];
  let o = text(60, 16, '30 Hz，chunk 50 个，inference 9 个 tick（0.3 s）', 'tb', 'start');
  o += text(60, 34, 'queue 剩 15 个（0.5 s）时拍 observation、发请求；新 chunk 到达时先 trim', 'ts', 'start');
  o += line(tx(0), 204, tx(NT), 204, 'axis');
  for (let k = 0; k <= NT; k += 10) o += line(tx(k), 204, tx(k), 208, 'axis') + text(tx(k), 221, String(k), 'ts', 'middle');
  o += text(tx(NT), 236, 'control tick', 'ts', 'end');
  // 开头先停在最终状态（静态截图看到的就是它），然后从 tick 0 播放
  const showAt = (k) => (k <= 0 ? '' : anim('opacity', [1, 1, 0, 1, 1], [0, h0, Math.min(h0 + 0.0005, tk(0)), tk(k), 1], T, true));
  for (const c of ch) {
    const end = c.cap + 50, H = 22, y = c.y, vis = Math.min(end, NT);
    let g = text(tx(c.cap) - 6, y + 15, c.nm, 'tb', 'end');
    g += rect(tx(c.cap), y, tx(vis) - tx(c.cap), H, 'frame');
    if (c.arr > c.cap) g += rect(tx(c.cap), y, tx(c.arr) - tx(c.cap), H, 'wash2') + text((tx(c.cap) + tx(c.arr)) / 2, y + 15, 'trim', 'ts', 'middle');
    const k0 = c.arr, k1 = Math.min(c.nextArr, end, NT), full = rp(tx(k0), y, tx(k1) - tx(k0), H), zero = rp(tx(k0), y, 0, H);
    g += apath([full, full, zero, zero, full, full], [0, h0, h0 + 0.0005, tk(k0), tk(k1), 1], T, 'wash-strong');
    if (c.nextArr < end) {
      g += `<g>${rect(tx(c.nextArr), y, tx(Math.min(end, NT)) - tx(c.nextArr), H, 'solid2')}${showAt(c.nextArr)}</g>`;
      g += `<g>${text((tx(c.nextArr) + tx(Math.min(end, NT))) / 2, y - 4, '丢掉 ' + (end - c.nextArr), 'ts', 'middle')}${showAt(c.nextArr)}</g>`;
    }
    if (c.cap > 0) g += line(tx(c.cap), y - 12, tx(c.cap), y + H, 'ln') + text(tx(c.cap) + 3, y - 4, 'obs @ ' + c.cap, 'tl', 'start');
    o += c.arr > 0 ? `<g>${g}${showAt(c.arr)}</g>` : g;
  }
  o += apath([d([[tx(NT), 66], [tx(NT), 204]]), d([[tx(NT), 66], [tx(NT), 204]]), d([[tx(0), 66], [tx(0), 204]]), d([[tx(NT), 66], [tx(NT), 204]]), d([[tx(NT), 66], [tx(NT), 204]])], [0, h0, h0 + 0.0005, tk(NT), 1], T, 'ink-b');
  o += text(60, 258, 'B 在 tick 44 到达：它是按 tick 35 的 observation 算的，前 9 个已经过去，trim 掉；', 'ts', 'start');
  o += text(60, 274, '剩下 41 个替换 A 还没执行的 6 个。Robot 一直在动，每个 action 的 observation 旧 0.3–1.43 s。', 'ts', 'start');
  return svgA(560, 282, o, '动图：时间轴上依次出现三个 chunk A、B、C。B 在 tick 35 拍下 observation、tick 44 到达，前 9 格标为 trim，A 剩下的 6 格被丢掉；竖线是当前时刻，执行过的部分逐渐填满');
}

export default {
  'hfl-cadence': cadence,
  'hfl-blind': blind,
  'hfl-stall': stall,
  'hfl-layout': layout,
  'hfl-window': windowA,
  'hfl-smolvla': smolvla,
  'hfl-flowdir': flowdir,
  'hfl-sync': syncA,
  'hfl-async': asyncA,
};
