import { svg, svgA, d, path, line, rect, circle, poly, text, arrow, anim, ashow, f1 } from '../lib/svg.mjs';

const KiB = 1024;
const fmtK = (b) => (Math.round((b / KiB) * 100) / 100).toString();
// 框里写一行或两行字
function box(x, y, w, h, cls, l1, l2 = '', c1 = 'tb', c2 = 'ts') {
  let o = rect(x, y, w, h, cls, 5);
  if (l2) o += text(x + w / 2, y + h / 2 - 3, l1, c1, 'middle') + text(x + w / 2, y + h / 2 + 12, l2, c2, 'middle');
  else o += text(x + w / 2, y + h / 2 + 5, l1, c1, 'middle');
  return o;
}
// 分阶段的动图：dur 是每个阶段的秒数，返回 keyTimes、总时长和一个“按阶段显示”的包装函数
function phases(dur) {
  const T = dur.reduce((a, b) => a + b, 0);
  const kt = [0];
  for (let k = 0; k < dur.length - 1; k++) kt.push(kt[k] + dur[k] / T);
  const g = (body, on) => `<g>${body}${ashow(dur.map((_, p) => on(p)), kt, T)}</g>`;
  return { T, kt, g };
}

// ---------- 第 1 站：y = x1*x2 + x1 的 forward graph 与 backward graph ----------
function graph() {
  const x1 = 2, x2 = 3, m = x1 * x2, y = m + x1;
  const gm = 1, g1 = 1 + gm * x2, g2 = gm * x1; // add 给 mul 和 x1 各 1；mul 再给 x1、x2
  let o = text(130, 14, 'forward graph（Evaluator.run）', 'tb', 'middle');
  const nb = (x, y0, w, l1, l2, cls = 'paper') => box(x - w / 2, y0 - 18, w, 36, cls, l1, l2, 't', 'ts');
  const P = { x1: [44, 56], x2: [44, 166], mul: [140, 120], add: [236, 70] };
  o += arrow(P.x1[0] + 36, P.x1[1] + 12, P.mul[0] - 40, P.mul[1] - 10, 'ink');
  o += arrow(P.x2[0] + 36, P.x2[1] - 12, P.mul[0] - 40, P.mul[1] + 10, 'ink');
  o += arrow(P.mul[0] + 40, P.mul[1] - 12, P.add[0] - 34, P.add[1] + 10, 'ink');
  o += arrow(P.x1[0] + 36, P.x1[1] + 2, P.add[0] - 40, P.add[1] - 4, 'ink');
  o += nb(...P.x1, 72, 'x₁', '= ' + x1) + nb(...P.x2, 72, 'x₂', '= ' + x2);
  o += nb(...P.mul, 80, 'mul', '= ' + m) + nb(...P.add, 80, 'add（y）', '= ' + y, 'wash');
  o += line(290, 30, 290, 210, 'grid');
  o += text(430, 14, 'backward graph（gradients 造出来的 node）', 'tb', 'middle');
  const Q = { yb: [340, 64], mb: [370, 176], g1: [506, 64], g2: [506, 176] };
  o += arrow(Q.yb[0] + 42, Q.yb[1], Q.g1[0] - 52, Q.g1[1], 'ln') + text(418, 56, '1', 'tl', 'middle');
  o += arrow(Q.yb[0] + 6, Q.yb[1] + 19, Q.mb[0] - 6, Q.mb[1] - 19, 'ln') + text(346, 126, '1', 'tl', 'end');
  o += arrow(Q.mb[0] + 30, Q.mb[1] - 19, Q.g1[0] - 36, Q.g1[1] + 19, 'ln') + text(446, 128, `1 × x₂ = ${gm * x2}`, 'tl', 'start');
  o += arrow(Q.mb[0] + 42, Q.mb[1], Q.g2[0] - 52, Q.g2[1], 'ln') + text(433, 212, `1 × x₁ = ${g2}`, 'tl', 'middle');
  o += nb(...Q.yb, 84, '∂y/∂y', '= 1', 'wash');
  o += nb(...Q.mb, 84, '∂y/∂mul', '= ' + gm);
  o += nb(...Q.g1, 100, '∂y/∂x₁', `1 + ${gm * x2} = ${g1}`, 'wash') + nb(...Q.g2, 100, '∂y/∂x₂', '= ' + g2, 'wash');
  o += text(280, 240, 'Backward 按 reverse topological order：add → mul → x₁、x₂。x₁ 被用了两次，两份 adjoint 相加。', 'ts', 'middle');
  return svg(560, 248, o, `y 等于 x1 乘 x2 加 x1 的 computational graph。Forward：x1 为 2、x2 为 3 时 mul 得 6，add 得 8。Backward：y 的 adjoint 为 1，add 把 1 传给 mul 和 x1，mul 把 1 乘 x2 等于 3 传给 x1、1 乘 x1 等于 2 传给 x2，x1 的 adjoint 是 1 加 3 等于 ${g1}`);
}

// ---------- 第 1 站：decode_q4 与 matmul 融合前后的 GMEM 流量 ----------
function fuse() {
  const n = 1;
  const wdata = 128 * 32 * 4, wscale = 128 * 8 * 2, W = 128 * 256 * 2, xb = n * 128 * 2, yb = n * 256 * 2;
  const unf = wdata + wscale + W + W + xb + yb, fus = wdata + wscale + xb + yb;
  let o = '';
  const row = (y0, fused) => {
    let q = box(0, y0 + 10, 118, 34, 'paper', 'Wdata u32 128×32', fmtK(wdata) + ' KiB', 't', 'ts');
    q += box(0, y0 + 52, 118, 34, 'paper', 'Wscale f16 128×8', fmtK(wscale) + ' KiB', 't', 'ts');
    q += arrow(120, y0 + 27, 148, y0 + 40, 'ink') + arrow(120, y0 + 69, 148, y0 + 56, 'ink');
    if (!fused) {
      q += box(150, y0 + 24, 92, 48, 'paper', 'decode_q4', 'kernel 1');
      q += arrow(244, y0 + 48, 270, y0 + 48, 'ln') + text(257, y0 + 42, '写', 'ts', 'middle');
      q += box(272, y0 + 24, 106, 48, 'wash-strong', 'W f16 128×256', fmtK(W) + ' KiB，在 GMEM', 't', 'ts');
      q += arrow(380, y0 + 48, 406, y0 + 48, 'ln') + text(393, y0 + 42, '读', 'ts', 'middle');
      q += box(408, y0 + 24, 66, 48, 'paper', 'mm', 'kernel 2');
    } else {
      q += box(150, y0 + 24, 324, 48, 'wash', 'fused_decode_q4_mm', '一个 kernel：decode 出的 W tile 留在 on-chip，直接进 matmul');
    }
    q += box(410, y0 + 96, 64, 26, 'paper', 'x f16 1×128', '', 'ts');
    q += arrow(442, y0 + 95, 442, y0 + 74, 'ink');
    q += arrow(476, y0 + 48, 498, y0 + 48, 'ink') + box(500, y0 + 32, 58, 32, 'paper', 'Y 1×256', '', 't');
    return q;
  };
  o += text(0, 12, '融合前：两个 kernel，中间的 W 写回 GMEM 再读出来', 'tb');
  o += row(16, false);
  o += text(0, 160, `n = 1 时 GMEM 读写合计 ${fmtK(unf)} KiB，其中 ${2 * W / KiB} KiB 是 W 的一写一读`, 'ts');
  o += text(0, 196, 'FuseOps + FuseTIR 之后', 'tb');
  o += row(200, true);
  o += text(0, 344, `合计 ${fmtK(fus)} KiB，是原来的 1/${(unf / fus).toFixed(1)}`, 'ts');
  return svg(560, 350, o, `decode_q4 和 matmul 融合前后的数据流：融合前 decode 把 64 KiB 的 fp16 W 写回 GMEM，matmul 再读出来，n 等于 1 时一共 ${fmtK(unf)} KiB；融合后只读压缩的 weight 和 x、写 Y，${fmtK(fus)} KiB`);
}

// ---------- 第 2 站：Lab 2 的 rank 编号与两种 communicator ----------
function ranks() {
  const mp = 2, dp = 4, X0 = 74, CW = 112, G = 10;
  let o = '';
  o += text(0, 84, 'mp_idx 0', 'ts') + text(0, 134, 'mp_idx 1', 'ts');
  // dp_comm：同一个 mp_idx 的 4 个 rank
  for (let m = 0; m < mp; m++) {
    const y = 58 + m * 50;
    o += rect(X0 - 6, y - 4, dp * (CW + G) - G + 12, 44, 'dash', 8);
  }
  for (let k = 0; k < dp; k++) {
    const x = X0 + k * (CW + G);
    o += rect(x, 30, CW, 148, 'frame', 8) + text(x + CW / 2, 47, 'dp_idx ' + k, 'tb', 'middle');
    for (let m = 0; m < mp; m++) {
      const r = k * mp + m;
      o += box(x + 8, 58 + m * 50, CW - 16, 36, m ? 'wash2' : 'wash', 'rank ' + r, 'W 的第 ' + m + ' 份 shard', 'tb', 'ts');
    }
    o += box(x + 8, 192, CW - 16, 28, 'paper', 'data split ' + k, '', 't');
    o += arrow(x + CW / 2, 190, x + CW / 2, 180, 'mute');
  }
  o += text(X0 + 4, 244, '实线框：mp_comm（同一个 dp_idx 的 2 个 rank，分到同一份 data，各存 W 的一半）', 'ts');
  o += text(X0 + 4, 262, '虚线框：dp_comm（同一个 mp_idx 的 4 个 rank，存同一份 shard，看不同的 data）', 'ts');
  return svg(560, 270, o, 'mp_size 2、dp_size 4 时 8 个 rank 的编号：按 model parallel 优先编号，rank 2k 和 2k+1 组成一个 mp_comm，分到 data split k；mp_idx 相同的 4 个 rank 组成一个 dp_comm');
}

// ---------- 第 2 站：naive 与 Megatron 的 fc2 通信 ----------
function megatron() {
  let o = text(0, 14, 'fc1 两种做法一样：W₁（784×256）按 output 切两份，rank 0 算出 h₀（B×128）。下面只看 rank 0 的 fc2。', 'ts');
  const rowY = [62, 192];
  const lab = ['naive', 'Megatron'];
  const fwdA = ['all-gather', '不通信'], fwdA2 = ['拼成 B×256', '直接用 h₀'];
  const fc2 = ['W₂ 的 5 列', 'W₂ 的 128 行'], fc2b = ['256×5', '128×10'];
  const out = ['y₀：B×5', 'B×10 的部分和'];
  const fwdB = ['all-gather', 'all-reduce（sum）'], fwdB2 = ['拼成 B×10', '加成 B×10'];
  const bwdB = ['backward：取自己的 5 列', 'backward：不通信'], bwdA = ['backward：reduce-scatter', 'backward：不通信'];
  const bwdA2 = ['B×256 的部分和', ''];
  for (let s = 0; s < 2; s++) {
    const y = rowY[s];
    o += text(0, y - 12, lab[s], 'tb');
    o += box(0, y, 56, 40, 'wash', 'h₀', 'B×128');
    o += arrow(58, y + 20, 74, y + 20, 'ink');
    o += box(76, y, 100, 40, s ? 'paper' : 'solid', fwdA[s], fwdA2[s], s ? 'tb' : 'tw', s ? 'ts' : 'tw');
    o += arrow(178, y + 20, 194, y + 20, 'ink');
    o += box(196, y, 92, 40, 'wash', fc2[s], fc2b[s]);
    o += arrow(290, y + 20, 304, y + 20, 'ink');
    o += box(306, y + 4, 92, 32, 'paper', out[s], '', 'ts');
    o += arrow(400, y + 20, 414, y + 20, 'ink');
    o += box(416, y, 142, 40, 'solid', fwdB[s], fwdB2[s], 'tw', 'tw');
    o += text(126, y + 60, bwdA[s], 'ts', 'middle') + (bwdA2[s] ? text(126, y + 76, bwdA2[s], 'ts', 'middle') : '');
    o += text(487, y + 60, bwdB[s], 'ts', 'middle');
  }
  o += text(0, 296, '深色是这一层 forward 里的通信。Megatron 的中间层不必拼回来，fc2 的 backward 也不用通信。', 'ts');
  return svg(560, 302, o, 'naive model parallel 的 fc2 在 forward 里要两次 all-gather、backward 里要一次 reduce-scatter；Megatron 式把 fc2 按 input 切，forward 只有一次 all-reduce，backward 不通信');
}

// ---------- 第 2 站：ZeRO-3 的 flat partition 与 zero padding ----------
function zeropad() {
  const n = 26, S = 4, sh = Math.ceil(n / S), tot = sh * S, cw = 18, X0 = 28, Y = 56;
  let o = text(X0, 14, `W 是 2×13，flatten 成 ${n} 个数；${n} 不是 ${S} 的倍数，末尾补 ${tot - n} 个 0 到 ${tot} = ${S} × ${sh}`, 'ts');
  o += line(X0, 44, X0 + 13 * cw - 2, 44, 'mute') + text(X0 + 6.5 * cw, 38, 'row 0', 'ts', 'middle');
  o += line(X0 + 13 * cw, 44, X0 + n * cw - 2, 44, 'mute') + text(X0 + 19.5 * cw, 38, 'row 1', 'ts', 'middle');
  for (let i = 0; i < tot; i++) {
    const x = X0 + i * cw, k = Math.floor(i / sh);
    o += rect(x, Y, cw - 2, 24, i < n ? (k % 2 ? 'wash2' : 'wash') : 'frame', 2);
    o += text(x + cw / 2 - 1, Y + 16, i < n ? String(i) : '0', i < n ? 'ts' : 'tl', 'middle');
  }
  for (let k = 0; k < S; k++) {
    const x0 = X0 + k * sh * cw, x1 = x0 + sh * cw - 2;
    o += line(x0, Y + 32, x0, Y + 38, 'ink') + line(x1, Y + 32, x1, Y + 38, 'ink') + line(x0, Y + 38, x1, Y + 38, 'ink');
    o += text((x0 + x1) / 2, Y + 54, `rank ${k}：${sh} 个`, 'tb', 'middle');
  }
  o += text(X0 + (tot - 1) * cw, Y - 6, 'padding', 'tl', 'middle');
  const y2 = 146;
  o += text(X0, y2, 'forward', 'tb') + text(X0 + 64, y2, `Allgather 4 份 shard → ${tot} 个 → 去掉末尾 ${tot - n} 个 → reshape 成 2×13 → 算完就扔`, 't');
  o += text(X0, y2 + 24, 'backward', 'tb') + text(X0 + 64, y2 + 24, `算出完整的 gradient（${n} 个）→ 补 0 到 ${tot} → Reduce_scatter`, 't');
  o += text(X0 + 64, y2 + 42, `每个 rank 只拿到自己那 ${sh} 个位置上、所有 rank 的 gradient 之和`, 't');
  o += text(X0, y2 + 68, `Adam 的 m、v 也只为这 ${sh} 个数存，rank 3 的最后 ${tot - n} 个永远是 0`, 'ts');
  return svg(560, 222, o, `ZeRO stage 3 的 partition：2 乘 13 的 weight flatten 成 26 个数，补 2 个 0 到 28，切成 4 份每份 7 个；forward 用 Allgather 拼回、去掉 padding，backward 用 Reduce_scatter 把 gradient 的和分回各 rank`);
}

// ---------- 第 2 站：GPipe 与 1F1B 的 schedule（p = 4，m = 8，t_b = 2 t_f） ----------
function sched(p, m, kind) {
  const ops = [];
  for (let s = 0; s < p; s++) {
    const L = [];
    if (kind === 'gpipe') { for (let j = 0; j < m; j++) L.push(['F', j]); for (let j = 0; j < m; j++) L.push(['B', j]); }
    else {
      const w = Math.min(p - 1 - s, m);
      for (let j = 0; j < w; j++) L.push(['F', j]);
      let f = w, b = 0;
      while (b < m) { if (f < m) L.push(['F', f++]); L.push(['B', b++]); }
    }
    ops.push(L);
  }
  const tf = 1, tb = 2, done = {}, res = [];
  const free = Array(p).fill(0), idx = Array(p).fill(0);
  let left = p * 2 * m;
  while (left > 0) {
    let moved = false;
    for (let s = 0; s < p; s++) {
      if (idx[s] >= ops[s].length) continue;
      const [t, j] = ops[s][idx[s]];
      const dep = t === 'F' ? (s ? done[`F${s - 1}_${j}`] : 0) : (s < p - 1 ? done[`B${s + 1}_${j}`] : done[`F${s}_${j}`]);
      if (dep === undefined) continue;
      const st = Math.max(free[s], dep), en = st + (t === 'F' ? tf : tb);
      done[`${t}${s}_${j}`] = en; free[s] = en; idx[s]++; left--; moved = true;
      res.push({ s, t, j, st, en });
    }
    if (!moved) throw new Error('schedule deadlock');
  }
  // 每个 stage 同时存着多少个 microbatch 的 activation（forward 完、backward 还没完）
  const peak = Array(p).fill(0);
  for (let s = 0; s < p; s++) {
    const ev = res.filter((r) => r.s === s);
    for (const r of ev) {
      const tt = r.en - 1e-9;
      const live = ev.filter((q) => q.t === 'F' && q.en <= tt + 1e-6).length - ev.filter((q) => q.t === 'B' && q.en <= tt).length;
      peak[s] = Math.max(peak[s], live);
    }
  }
  return { res, T: Math.max(...free), peak };
}
function onef1b() {
  const p = 4, m = 8, u = 14, X0 = 62, rh = 18;
  let o = '';
  const draw = (Y, kind, title) => {
    const { res, T, peak } = sched(p, m, kind);
    o += text(0, Y - 10, title, 'tb');
    for (let s = 0; s < p; s++) {
      o += text(X0 - 8, Y + s * (rh + 3) + 13, 'GPU ' + s, 'ts', 'end');
      o += rect(X0, Y + s * (rh + 3), T * u, rh, 'wash2', 1);
    }
    for (const r of res) {
      const x = X0 + r.st * u, y = Y + r.s * (rh + 3), w = (r.en - r.st) * u;
      o += rect(x + 0.5, y, w - 1, rh, r.t === 'F' ? 'wash' : 'solid', 1);
      o += text(x + w / 2, y + 13, String(r.j + 1), r.t === 'F' ? 'ts' : 'tw', 'middle');
    }
    o += text(X0 + T * u + 6, Y + 13, '共 ' + T, 'ts');
    o += text(X0, Y + p * (rh + 3) + 16, `GPU 0 最多同时存 ${peak[0]} 个 microbatch 的 activation`, 'ts');
    return T;
  };
  const T1 = draw(28, 'gpipe', 'GPipe：先做完 8 个 forward，再做 8 个 backward');
  draw(170, '1f1b', '1F1B：warm-up 之后一个 forward 一个 backward 交替');
  o += text(X0, 290, `浅色 forward 1 格，深色 backward 2 格，数字是 microbatch。`, 'ts') + text(X0, 308, `两种 schedule 都是 ${T1} 格，bubble 一样大。`, 'ts');
  return svg(560, 314, o, 'p 等于 4、m 等于 8 的 pipeline：GPipe 和 1F1B 总时长相同，但 GPipe 的 GPU 0 同时存着 8 个 microbatch 的 activation，1F1B 最多 4 个');
}

// ---------- 第 3 站：activation checkpointing 的动图（N = 16，每 4 层一个 checkpoint） ----------
function ckptA() {
  const N = 16, K = 4, cw = 28, X0 = 64, Y = 64;
  // 每个 frame：每个 cell 的状态 0 空 1 checkpoint 2 活着 3 backward 已走过；以及说明
  const fr = [];
  const st0 = Array(N + 1).fill(0);
  const push = (st, msg, du) => fr.push({ st: st.slice(), mem: st.filter((v) => v === 1 || v === 2).length, msg, du });
  // frame 0：静态图，第 3 段已重算
  { const s = st0.slice(); s[4] = s[8] = s[12] = 1; s[9] = s[10] = s[11] = 2; for (let i = 13; i <= 16; i++) s[i] = 3; push(s, '', 3.6); }
  let s = st0.slice();
  for (let i = 1; i <= N; i++) {
    if (i > 1 && (i - 1) % K) s[i - 1] = 0;
    s[i] = i % K ? 2 : 1;
    push(s, `forward 第 ${i} 层：只留每 ${K} 层的输出`, 0.22);
  }
  for (let g = N / K; g >= 1; g--) {
    const a = K * (g - 1);
    for (let r = 1; r < K; r++) { s[a + r] = 2; push(s, `backward 第 ${g} 段：从 a${a ? a : '₀'} 重算`, 0.4); }
    for (let L = K * g; L > a; L--) { s[L] = 3; push(s, `backward 第 ${g} 段：逐层往回走，用完就释放`, 0.32); }
  }
  fr.push({ ...fr[fr.length - 1], du: 1.2 });
  const { T, kt, g } = phases(fr.map((f) => f.du));
  let o = '';
  for (let i = 1; i <= N; i++) {
    const x = X0 + (i - 1) * cw;
    o += rect(x, Y, cw - 3, 30, 'frame', 3);
    o += g(rect(x, Y, cw - 3, 30, 'solid', 3), (p) => fr[p].st[i] === 1);
    o += g(rect(x, Y, cw - 3, 30, 'wash-strong', 3), (p) => fr[p].st[i] === 2);
    o += g(rect(x, Y, cw - 3, 30, 'wash2', 3), (p) => fr[p].st[i] === 3);
    o += text(x + (cw - 3) / 2, Y + 48, String(i), 'ts', 'middle');
  }
  o += text(X0 - 8, Y + 20, 'a', 'tb', 'end') + text(X0 - 8, Y + 48, '层', 'ts', 'end');
  // frame 0 的标注
  const bx = (i0, i1, yy, s1) => {
    const x0 = X0 + (i0 - 1) * cw, x1 = X0 + i1 * cw - 3;
    return line(x0, yy, x1, yy, 'ink') + line(x0, yy, x0, yy + 5, 'ink') + line(x1, yy, x1, yy + 5, 'ink') + text((x0 + x1) / 2, yy - 6, s1, 'ts', 'middle');
  };
  o += g(bx(9, 11, 54, '从 a₈ 重算出来') + bx(13, 16, 54, 'backward 已走过，已释放'), (p) => p === 0);
  o += g(text(X0, 18, '静止时：backward 走到第 3 段（第 9–12 层）', 'tb'), (p) => p === 0);
  fr.forEach((f, p) => { if (p > 0 && (p === 1 || f.msg !== fr[p - 1].msg)) o += g(text(X0, 18, f.msg, 'tb'), (q) => q > 0 && fr[q].msg === f.msg); });
  // memory 条
  const MY = 150, uw = 24;
  o += text(X0, MY - 10, '此刻 memory 里存着的 activation 个数', 'ts');
  for (let k = 0; k < N; k++) o += rect(X0 + k * uw, MY, uw - 2, 16, 'frame', 2);
  o += `<rect x="${X0}" y="${MY}" width="${fr[0].mem * uw - 2}" height="16" rx="2" class="wash-strong">${anim('width', fr.map((f) => Math.max(0, f.mem * uw - 2)), kt, T, true)}</rect>`;
  const peak = Math.max(...fr.map((f) => f.mem));
  o += line(X0 + peak * uw - 1, MY - 4, X0 + peak * uw - 1, MY + 22, 'ln') + text(X0 + peak * uw - 1, MY + 36, `峰值 ${peak}`, 'tl', 'middle');
  o += text(X0 + N * uw - 2, MY + 36, `不做 checkpointing：${N}`, 'ts', 'end');
  fr.forEach((f, p) => { if (p === 0 || f.mem !== fr[p - 1].mem) o += g(text(X0 + N * uw + 6, MY + 13, String(f.mem), 'tb'), (q) => fr[q].mem === f.mem); });
  o += text(X0, 214, '深色：checkpoint　中间色：正在用的　灰：backward 已走过', 'ts');
  return svgA(560, 220, o, `动图：16 层的网络每 4 层留一个 checkpoint。forward 时只留下 a4、a8、a12、a16；backward 每到一段先从上一个 checkpoint 重算这段的 3 个 activation，再逐层往回走。memory 峰值是 ${peak} 个，不做 checkpointing 要 16 个`);
}

// ---------- 第 3 站：bank conflict 与 XOR swizzle ----------
function swizzle() {
  const c = 24;
  let o = '';
  const grid = (X, sw, title, note1) => {
    let q = text(X + 4 * c, 16, title, 'tb', 'middle');
    for (let b = 0; b < 8; b++) q += text(X + b * c + c / 2, 40, 'b' + b, 'ts', 'middle');
    for (let r = 0; r < 8; r++) {
      q += text(X - 6, 62 + r * c, 'r' + r, 'ts', 'end');
      for (let b = 0; b < 8; b++) {
        const logical = sw ? b ^ r : b, hit = logical === 0;
        q += rect(X + b * c, 46 + r * c, c - 2, c - 2, hit ? 'solid' : 'wash2', 2);
        q += text(X + b * c + c / 2 - 1, 62 + r * c, String(logical), hit ? 'tw' : 'ts', 'middle');
      }
    }
    q += text(X + 4 * c, 46 + 8 * c + 22, note1, 't', 'middle');
    return q;
  };
  o += grid(48, false, '不 swizzle：bank = col', '读 column 0：8 次都在 b0，8 个 cycle');
  o += grid(330, true, 'swizzle：bank = col XOR row', '同一列落在 8 个 bank：1 个 cycle');
  o += text(280, 292, '格子里的数是 logical column，格子所在的列是 bank。读一整行时两边都是 8 个不同的 bank。', 'ts', 'middle');
  return svg(560, 298, o, '8 乘 8 的 tile 放进 8 个 bank：不 swizzle 时 column 0 的 8 个数都在 bank 0，读一列要 8 个 cycle；把 column 换成 col XOR row 之后，column 0 的 8 个数分在 8 个不同的 bank，1 个 cycle 读完');
}

// ---------- 第 4 站：load 与 MMA 串行 vs 双缓冲 ----------
function pipe() {
  const K = 4, Lt = 3, Ct = 2, u = 20, X0 = 112;
  // 串行
  const ser = [];
  let t = 0;
  for (let k = 0; k < K; k++) { ser.push(['L', k, t, t + Lt]); t += Lt; ser.push(['C', k, t, t + Ct]); t += Ct; }
  const Tser = t;
  // 双缓冲：load k 要等 TMA 空闲、并且 stage (k mod 2) 上一次的 MMA（k − 2）算完
  const pip = [], lEnd = [], cEnd = [];
  let tma = 0, mma = 0;
  const doMma = (k) => { const st = Math.max(mma, lEnd[k]); cEnd[k] = st + Ct; mma = cEnd[k]; pip.push(['C', k, st, cEnd[k]]); };
  for (let k = 0; k < K; k++) {
    if (k >= 1) doMma(k - 1);
    const st = Math.max(tma, k >= 2 ? cEnd[k - 2] : 0); lEnd[k] = st + Lt; tma = lEnd[k]; pip.push(['L', k, st, lEnd[k]]);
  }
  doMma(K - 1);
  const Tpip = Math.max(...cEnd);
  let o = '';
  const draw = (Y, ev, T, title) => {
    o += text(0, Y - 12, title, 'tb');
    o += text(X0 - 8, Y + 14, 'TMA load', 'ts', 'end') + text(X0 - 8, Y + 40, 'MMA', 'ts', 'end');
    o += rect(X0, Y, T * u, 20, 'wash2', 1) + rect(X0, Y + 26, T * u, 20, 'wash2', 1);
    for (const [kind, k, a, b] of ev) {
      const y = kind === 'L' ? Y : Y + 26;
      o += rect(X0 + a * u + 0.5, y, (b - a) * u - 1, 20, kind === 'L' ? 'wash' : 'solid', 2);
      o += text(X0 + (a + b) / 2 * u, y + 14, (kind === 'L' ? 'A,B tile ' : 'k = ') + k, kind === 'L' ? 'ts' : 'tw', 'middle');
    }
    o += line(X0 + T * u, Y - 4, X0 + T * u, Y + 50, 'ln') + text(X0 + T * u + 6, Y + 30, String(T), 'tl');
  };
  draw(30, ser, Tser, 'Step 2–4 的写法：load 完一块再算一块');
  draw(126, pip, Tpip, 'Step 5：两个 SMEM stage，算第 k 块时 load 第 k + 1 块');
  for (let v = 0; v <= Tser; v += 5) o += line(X0 + v * u, 182, X0 + v * u, 186, 'axis') + text(X0 + v * u, 200, String(v), 'ts', 'middle');
  o += line(X0, 182, X0 + Tser * u, 182, 'axis');
  o += text(0, 222, `每块 load ${Lt}、MMA ${Ct} 个时间单位：${Tser} → ${Tpip}。load 比 MMA 慢，下限是 4 × ${Lt} + ${Ct} = ${4 * Lt + Ct}。`, 'ts');
  return svg(560, 228, o, `4 个 K tile 的 GEMM 主循环：串行时 load 和 MMA 交替，用 ${Tser} 个单位；双缓冲时 MMA 第 k 块和 load 第 k 加 1 块重叠，用 ${Tpip} 个单位`);
}

// ---------- 第 5 站：static batching vs continuous batching 的动图 ----------
function batchA() {
  const reqs = { R1: [0, 5], R2: [0, 2], R3: [0, 3], R4: [1, 3], R5: [2, 2] };
  const B = 3, NI = 8;
  // static：一批做完才放下一批
  const stat = Array.from({ length: B }, () => Array(NI).fill(null));
  [['R1', 'R2', 'R3', 0], ['R4', 'R5', null, 5]].forEach(([a, b, c, t0]) => [a, b, c].forEach((r, sIdx) => { if (r) for (let k = 0; k < reqs[r][1]; k++) stat[sIdx][t0 + k] = r; }));
  // continuous：每个 iteration 结束后，空出来的 slot 立刻给已经到达的 request
  const cont = Array.from({ length: B }, () => Array(NI).fill(null));
  const queue = ['R1', 'R2', 'R3', 'R4', 'R5'], left = {}, slot = Array(B).fill(null);
  for (let t = 0; t < NI; t++) {
    for (let sIdx = 0; sIdx < B; sIdx++) if (!slot[sIdx]) { const i = queue.findIndex((r) => reqs[r][0] <= t); if (i >= 0) { slot[sIdx] = queue.splice(i, 1)[0]; left[slot[sIdx]] = reqs[slot[sIdx]][1]; } }
    for (let sIdx = 0; sIdx < B; sIdx++) if (slot[sIdx]) { cont[sIdx][t] = slot[sIdx]; if (--left[slot[sIdx]] === 0) slot[sIdx] = null; }
  }
  const span = (G) => Math.max(...G.map((rw) => rw.reduce((m, v, i) => (v ? i + 1 : m), 0)));
  const busy = (G) => G.flat().filter(Boolean).length;
  const start = (G, r) => Math.min(...G.map((rw) => rw.indexOf(r)).filter((v) => v >= 0));
  const dur = [3.4, ...Array(NI).fill(0.75), 1.4];
  const { T, kt, g } = phases(dur);
  const cw = 38, ch = 24, X0 = 66;
  let o = '';
  const draw = (Y, G, title) => {
    const S = span(G);
    o += text(0, Y - 42, title, 'tb');
    for (let t = 0; t < NI; t++) o += text(X0 + t * cw + cw / 2, Y - 6, String(t), 'ts', 'middle');
    for (const r of ['R4', 'R5']) o += text(X0 + reqs[r][0] * cw + cw / 2, Y - 18, r + ' 到', 'tl', 'middle');
    for (let sIdx = 0; sIdx < B; sIdx++) {
      o += text(X0 - 8, Y + sIdx * (ch + 3) + 16, 'slot ' + sIdx, 'ts', 'end');
      for (let t = 0; t < NI; t++) {
        const x = X0 + t * cw, y = Y + sIdx * (ch + 3), r = G[sIdx][t];
        if (t >= S) continue;
        o += rect(x + 1, y, cw - 3, ch, 'frame', 2);
        if (r) o += g(rect(x + 1, y, cw - 3, ch, r === 'R4' ? 'wash-strong' : 'wash', 2) + text(x + cw / 2, y + 16, r, 't', 'middle'), (p) => p === 0 || p > NI || t <= p - 1);
      }
    }
    for (let t = 0; t < NI; t++) o += g(rect(X0 + t * cw, Y - 2, cw - 1, B * (ch + 3) + 1, 'ln', 3), (p) => p === t + 1);
    const R = X0 + NI * cw + 12;
    o += text(R, Y + 12, `${S} 个 iteration`, 't');
    o += text(R, Y + 32, `slot 利用率 ${busy(G)}/${S * B}`, 't');
    o += text(R, Y + 52, `R4 在第 ${start(G, 'R4')} 步开始`, 't');
  };
  draw(70, stat, 'Static batching：一批全部结束才放下一批');
  draw(214, cont, 'Continuous batching：每个 iteration 之后都可以换人');
  o += text(0, 318, '每一格是一个 request 的一次 iteration（第一格含它的 prefill）。空框是这一步 slot 闲着。', 'ts');
  return svgA(560, 324, o, `动图：最大 batch 为 3，R1 到 R5 的输出长度为 5、2、3、3、2，R4 在第 1 步、R5 在第 2 步到达。Static batching 用 ${span(stat)} 个 iteration，slot 利用率 ${busy(stat)}/${span(stat) * B}；continuous batching 用 ${span(cont)} 个 iteration，利用率 ${busy(cont)}/${span(cont) * B}`);
}

// ---------- 第 6 站：contiguous 预留 vs paged ----------
function frag() {
  const NS = 32, cw = 16, X0 = 30;
  let o = '';
  // contiguous：A 预留 8 用 4，B 预留 12 用 5
  const A = { s: 0, res: 8, used: 4 }, Bq = { s: 11, res: 12, used: 5 };
  const Y1 = 46;
  o += text(0, 14, 'Contiguous：每个 request 按 max length 预留一段连续的 slot', 'tb');
  for (let i = 0; i < NS; i++) {
    const x = X0 + i * cw;
    let cls = 'frame', lab = '';
    for (const [q, n] of [[A, 'A'], [Bq, 'B']]) if (i >= q.s && i < q.s + q.res) { cls = i < q.s + q.used ? 'wash-strong' : 'wash'; lab = i < q.s + q.used ? n : ''; }
    o += rect(x, Y1, cw - 2, 24, cls, 2) + (lab ? text(x + cw / 2 - 1, Y1 + 16, lab, 'ts', 'middle') : '');
  }
  const br = (i0, i1, y, s1, cls = 'ts') => {
    const x0 = X0 + i0 * cw, x1 = X0 + i1 * cw - 2;
    return line(x0, y, x1, y, 'ink') + line(x0, y, x0, y + 4, 'ink') + line(x1, y, x1, y + 4, 'ink') + text((x0 + x1) / 2, y - 5, s1, cls, 'middle');
  };
  o += br(A.s, A.s + A.res, Y1 - 6, 'A：预留 8，用了 4') + br(Bq.s, Bq.s + Bq.res, Y1 - 6, 'B：预留 12，用了 5');
  const gaps = [[8, 11], [23, 32]];
  for (const [a, b] of gaps) o += line(X0 + a * cw, Y1 + 32, X0 + b * cw - 2, Y1 + 32, 'ln') + text(X0 + (a + b) / 2 * cw, Y1 + 46, `空 ${b - a}`, 'tl', 'middle');
  o += text(0, Y1 + 70, `空着 ${gaps.reduce((s, [a, b]) => s + b - a, 0)} 个 slot，最长连续 ${Math.max(...gaps.map(([a, b]) => b - a))} 个；C（max length 10）放不进来。已预留的 20 个里只有 9 个存着 token。`, 'ts');
  // paged：block size 4
  const Y2 = 176, own = { 2: ['A', 4], 5: ['B', 4], 0: ['B', 1], 7: ['C', 4], 3: ['C', 2] };
  o += text(0, Y2 - 26, 'Paged：block size 4，用满一块才分配下一块，block 不必相邻', 'tb');
  for (let b = 0; b < 8; b++) {
    const x0 = X0 + b * 4 * cw;
    for (let k = 0; k < 4; k++) {
      const x = x0 + k * cw, ow = own[b];
      const used = ow && k < ow[1];
      o += rect(x, Y2, cw - 2, 24, ow ? (used ? 'wash-strong' : 'wash') : 'frame', 2) + (used ? text(x + cw / 2 - 1, Y2 + 16, ow[0], 'ts', 'middle') : '');
    }
    o += line(x0 - 1, Y2 - 4, x0 - 1, Y2 + 28, 'ink') + text(x0 + 2 * cw - 1, Y2 + 42, 'block ' + b, 'ts', 'middle');
  }
  o += line(X0 + 32 * cw - 1, Y2 - 4, X0 + 32 * cw - 1, Y2 + 28, 'ink');
  o += text(0, Y2 + 66, 'A 用 block 2；B 用 5、0；C（目前 6 个 token）用 7、3。浪费的只有 B、C 最后一块的空位，共 5 个。', 'ts');
  return svg(560, 248, o, 'Contiguous 分配下，A 和 B 按 max length 预留了 20 个 slot 只用了 9 个，剩下的空位分成 3 和 9 两段，放不下需要 10 个连续 slot 的 C；paged 分配下 A、B、C 都放得下，只浪费各自最后一块的空位');
}

// ---------- 第 6 站：block table 的动图 ----------
function pagedA() {
  const toks = ['Alan', 'Turing', 'is', 'a', 'computer', 'scientist', 'and', 'mathematician', 'renowned'];
  const arrive = [1, 1, 1, 1, 1, 1, 2, 3, 4]; // 第几个阶段写进来（阶段 0 是最终状态）
  const phys = [7, 1, 5], other = [0, 3, 6];
  const dur = [3.6, 1.8, 1.3, 1.3, 2.2];
  const { g } = phases(dur);
  const vis = (i) => (p) => p === 0 || p >= arrive[i];
  const blockOn = (lb) => (p) => p === 0 || p >= arrive[lb * 4];
  let o = text(0, 14, 'Request A 的 logical KV blocks', 'tb');
  const LW = 110, LX = 0, LY = 26, rh = 22;
  for (let lb = 0; lb < 3; lb++) {
    const x = LX + lb * (LW + 6);
    for (let k = 0; k < 4; k++) {
      const i = lb * 4 + k, y = LY + k * rh;
      o += rect(x, y, LW, rh - 2, 'frame', 2);
      if (i < toks.length) o += g(rect(x, y, LW, rh - 2, 'wash', 2) + text(x + 6, y + 15, `${i + 1}`, 'ts') + text(x + 22, y + 15, toks[i], 't'), vis(i));
    }
    o += text(x + LW / 2, LY + 4 * rh + 14, 'logical ' + lb, 'ts', 'middle');
  }
  // block table
  const TX = 362, TY = 26;
  o += text(TX, 14, 'Block table', 'tb');
  const cols = [['logical', 0], ['physical', 64], ['# filled', 136]];
  for (const [s1, dx] of cols) o += text(TX + dx, TY + 14, s1, 'ts');
  o += line(TX, TY + 20, TX + 194, TY + 20, 'axis');
  const filled = (lb, p) => { const q = p === 0 ? 4 : p; return toks.filter((_, i) => Math.floor(i / 4) === lb && arrive[i] <= q).length; };
  for (let lb = 0; lb < 3; lb++) {
    const y = TY + 40 + lb * 24;
    o += text(TX + 20, y, String(lb), 't', 'middle');
    o += g(text(TX + 84, y, String(phys[lb]), 'tb', 'middle'), blockOn(lb));
    o += g(text(TX + 84, y, '–', 'ts', 'middle'), (p) => !blockOn(lb)(p));
    const seen = new Set();
    for (let p = 0; p < dur.length; p++) {
      const v = filled(lb, p);
      if (seen.has(v)) continue; seen.add(v);
      o += g(text(TX + 160, y, v ? String(v) : '–', v ? 't' : 'ts', 'middle'), (q) => filled(lb, q) === v);
    }
  }
  // physical blocks
  const PY = 182, bw = 64, cw = 15;
  o += text(0, PY - 14, 'GPU 上的 physical KV blocks（格子里是 token 的序号）', 'tb');
  for (let b = 0; b < 8; b++) {
    const x0 = b * (bw + 6);
    const lb = phys.indexOf(b);
    for (let k = 0; k < 4; k++) {
      const x = x0 + k * cw;
      o += rect(x, PY, cw - 2, 24, other.includes(b) ? 'wash2' : 'frame', 2);
      if (lb >= 0 && lb * 4 + k < toks.length) { const i = lb * 4 + k; o += g(rect(x, PY, cw - 2, 24, 'wash-strong', 2) + text(x + (cw - 2) / 2, PY + 16, String(i + 1), 'ts', 'middle'), vis(i)); }
    }
    o += text(x0 + 30, PY + 40, 'block ' + b, 'ts', 'middle');
    if (other.includes(b)) o += text(x0 + 30, PY + 56, '别的', 'ts', 'middle') + text(x0 + 30, PY + 72, 'request', 'ts', 'middle');
  }
  for (let lb = 0; lb < 3; lb++) o += g(text(phys[lb] * (bw + 6) + 30, PY + 56, 'A 的', 'tl', 'middle') + text(phys[lb] * (bw + 6) + 30, PY + 72, 'logical ' + lb, 'tl', 'middle'), blockOn(lb));
  const msg = [
    'block 5 只用了 1 格：每个 request 最多浪费不满的最后一块',
    'prefill：6 个 token 写进 block 7、block 1',
    '生成 and：block 1 还有空位，直接写',
    '生成 mathematician：block 1 写满',
    '生成 renowned：block 1 满了，从 free list 取 block 5',
  ];
  msg.forEach((m, p) => { o += g(text(0, 284, m, p ? 'tl' : 'ts'), (q) => q === p); });
  return svgA(560, 290, o, '动图：block size 4 的 PagedAttention。Prompt Alan Turing is a computer scientist 的 6 个 token 写进 physical block 7 和 1；生成 and、mathematician 填满 block 1；生成 renowned 时再分配 block 5。Block table 记录 logical 到 physical 的映射和每块填了几个');
}

// ---------- 第 6 站：RadixAttention 的 radix tree ----------
function radix() {
  const N = [
    { id: 'S1', l1: 'system prompt S₁', n: 512, x: 66, y: 74, w: 156, p: null },
    { id: 'A1', l1: 'A 第 1 轮问答', n: 120, x: 258, y: 20, w: 150, p: 'S1' },
    { id: 'A2', l1: 'A 第 2 轮', n: 40, x: 440, y: 20, w: 118, p: 'A1', run: 1 },
    { id: 'B', l1: 'B 的问题', n: 60, x: 258, y: 80, w: 150, p: 'S1', run: 1 },
    { id: 'D', l1: 'D 的问题（已结束）', n: 80, x: 258, y: 140, w: 150, p: 'S1', idle: 1 },
    { id: 'S2', l1: 'system prompt S₂', n: 300, x: 66, y: 212, w: 156, p: null },
    { id: 'C', l1: 'C 的问题', n: 30, x: 258, y: 212, w: 150, p: 'S2', run: 1 },
  ];
  const by = Object.fromEntries(N.map((q) => [q.id, q]));
  const R = [26, 140];
  let o = circle(R[0], R[1], 7, 'ink-f') + text(R[0], R[1] + 24, 'root', 'ts', 'middle');
  for (const q of N) {
    const [px, py] = q.p ? [by[q.p].x + by[q.p].w, by[q.p].y + 16] : [R[0] + 7, R[1]];
    o += path(d([[px, py], [px + 14, py], [q.x - 14, q.y + 16], [q.x, q.y + 16]]), 'mute');
  }
  for (const q of N) o += box(q.x, q.y, q.w, 32, q.run ? 'wash-strong' : q.idle ? 'wash2' : 'wash', q.l1, q.n + ' tokens', 't', 'ts');
  o += text(by.D.x + by.D.w + 8, by.D.y + 12, 'ref count 0：', 'ts') + text(by.D.x + by.D.w + 8, by.D.y + 28, 'LRU 先淘汰它', 'ts');
  const path_ = (id) => { let s = 0; for (let q = by[id]; q; q = q.p ? by[q.p] : null) s += q.n; return s; };
  const runs = ['A2', 'B', 'C'];
  const sep = runs.map(path_), tot = sep.reduce((a, b) => a + b, 0);
  const tree = N.filter((q) => !q.idle).reduce((a, q) => a + q.n, 0);
  o += text(0, 274, `正在跑 A、B、C（深色叶子）。各存各的：${sep.join(' + ')} = ${tot} 个 token 的 KV；`, 'ts');
  o += text(0, 292, `按 tree 存：${N.filter((q) => !q.idle).map((q) => q.n).join(' + ')} = ${tree}（另加 D 的 ${by.D.n} 个缓存着备用）。`, 'ts');
  o += text(0, 310, `A 的第 2 轮命中 ${path_('A1')} 个 token 的 prefix，只需 prefill ${by.A2.n} 个。`, 'ts');
  return svg(560, 316, o, `RadixAttention 的 radix tree：两个 system prompt 下挂着 A、B、C、D 四个对话的后续部分。A、B、C 正在运行，分开存要 ${tot} 个 token 的 KV，按 tree 共享只要 ${tree} 个；已结束的 D 的叶子 ref count 为 0，LRU 先淘汰`);
}

// ---------- 第 7 站：token tree 与 tree attention 的 mask ----------
function tree() {
  const nodes = [
    { w: 'machine', p: -1 }, { w: 'learning', p: 0 }, { w: 'algorithm', p: 1 }, { w: 'system', p: 1 },
    { w: 'design', p: 3 }, { w: 'translation', p: 0 }, { w: 'model', p: 5 },
  ]; // 已按 DFS 顺序排好
  const pos = [[138, 30], [86, 92], [44, 154], [134, 154], [134, 216], [216, 92], [226, 154]];
  const acc = new Set([0, 1, 3]);
  let o = '';
  nodes.forEach((q, i) => { if (q.p >= 0) o += line(pos[q.p][0], pos[q.p][1] + 12, pos[i][0], pos[i][1] - 12, acc.has(i) && acc.has(q.p) ? 'ln' : 'mute'); });
  nodes.forEach((q, i) => {
    const [x, y] = pos[i], w = 84;
    o += rect(x - w / 2, y - 12, w, 24, acc.has(i) ? 'solid' : 'paper', 5);
    o += text(x - w / 2 + 9, y + 5, String(i + 1), acc.has(i) ? 'tw' : 'ts', 'middle') + text(x + 6, y + 5, q.w, acc.has(i) ? 'tw' : 't', 'middle');
  });
  // LLM 在 system 之后自己给出的 token
  o += line(pos[3][0] + 30, pos[3][1] + 12, 232, 204, 'ln-dash');
  o += rect(188, 204, 96, 24, 'frame', 5) + text(236, 221, 'optimization', 'tl', 'middle');
  o += text(150, 252, '深色：被 LLM 接受；optimization 是', 'ts', 'middle') + text(150, 268, 'LLM 在 system 之后自己给出的', 'ts', 'middle');
  // mask
  const anc = (i, j) => { for (let k = i; k >= 0; k = nodes[k].p) if (k === j) return true; return false; };
  const c = 25, MX = 372, MY = 40;
  o += text(MX + 3.5 * c, 16, 'Topology-aware causal mask', 'tb', 'middle');
  for (let j = 0; j < 7; j++) o += text(MX + j * c + c / 2, MY - 6, String(j + 1), 'ts', 'middle');
  for (let i = 0; i < 7; i++) {
    o += text(MX - 6, MY + i * c + 17, `${i + 1} ${nodes[i].w}`, 'ts', 'end');
    for (let j = 0; j < 7; j++) {
      const on = anc(i, j);
      o += rect(MX + j * c, MY + i * c, c - 2, c - 2, on ? 'wash-strong' : 'wash2', 2);
      if (on) o += text(MX + j * c + c / 2 - 1, MY + i * c + 17, '✓', 't', 'middle');
    }
  }
  o += text(MX + 3.5 * c, MY + 7 * c + 20, '第 i 行：token i 能看见哪些 token', 'ts', 'middle');
  o += text(MX + 3.5 * c, MY + 7 * c + 38, '（prompt 的 KV cache 对每一行都可见）', 'ts', 'middle');
  return svg(560, 276, o, 'SpecInfer 的 token tree：machine 下面分出 learning 和 translation 两支，共 7 个 token，按 DFS 编号。右边的 mask 里每个 token 只看见自己和祖先。LLM 接受了 learning 和 system，在 system 之后给出 optimization');
}

export default {
  'cmu15442-graph': graph,
  'cmu15442-fuse': fuse,
  'cmu15442-ranks': ranks,
  'cmu15442-megatron': megatron,
  'cmu15442-zeropad': zeropad,
  'cmu15442-1f1b': onef1b,
  'cmu15442-ckpt': ckptA,
  'cmu15442-swizzle': swizzle,
  'cmu15442-pipe': pipe,
  'cmu15442-batch': batchA,
  'cmu15442-frag': frag,
  'cmu15442-paged': pagedA,
  'cmu15442-radix': radix,
  'cmu15442-tree': tree,
};
