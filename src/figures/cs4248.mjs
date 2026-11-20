import { svg, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

const sup = (n) => String(n).replace('-', '⁻').split('').map((c) => ('0123456789'.includes(c) ? '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c] : c)).join('');
const sci = (v, k = 2) => { const e = Math.floor(Math.log10(v)); const m = v / 10 ** e; return `${m.toFixed(k - 1)}×10${sup(e)}`; };

// BPE：J&M 的 corpus 在 0、2、4、8 次 merge 之后
function bpe() {
  const words = [['_new', 2], ['_renew', 2], ['_set', 1], ['_reset', 1]];
  const merges = [['n', 'e'], ['ne', 'w'], ['_', 'r'], ['_r', 'e'], ['_', 'new'], ['_re', 'new'], ['s', 'e'], ['se', 't']];
  const apply = (toks, m) => { const o = []; for (let i = 0; i < toks.length; i++) { if (i + 1 < toks.length && toks[i] === m[0] && toks[i + 1] === m[1]) { o.push(m[0] + m[1]); i++; } else o.push(toks[i]); } return o; };
  const seg = (k) => words.map(([w]) => merges.slice(0, k).reduce(apply, w.split('')));
  const cw = 14, X0 = 96, gap = 24;
  const xs = []; let x = X0;
  for (const [w] of words) { xs.push(x); x += w.length * cw + gap; }
  let o = '';
  words.forEach(([w, c], i) => { o += text(xs[i], 20, `${w}  ×${c}`, 'tb'); });
  [0, 2, 4, 8].forEach((k, r) => {
    const y = 36 + r * 40;
    o += text(10, y + 17, `${k} 次 merge`, 't');
    let total = 0;
    seg(k).forEach((toks, i) => {
      let xx = xs[i];
      total += toks.length * words[i][1];
      for (const t of toks) {
        const wd = t.length * cw;
        o += rect(xx + 1, y, wd - 2, 26, t.length > 1 ? 'wash' : 'paper', 3);
        if (t.length > 1) o += rect(xx + 1, y, wd - 2, 26, 'frame', 3);
        o += text(xx + wd / 2, y + 17, t, t.length > 1 ? 'tb' : 't', 'middle');
        xx += wd;
      }
    });
    o += text(548, y + 17, `${total} 个 token`, r === 3 ? 'tl' : 't', 'end');
  });
  o += text(280, 205, '浅色底的格子是 merge 造出来的 token；token 总数按每个 word 的 count 加权', 'ts', 'middle');
  return svg(560, 214, o, 'BPE 在 J&M 的小 corpus 上的 merge 过程：随着 merge 增加，每个 word 被切成的 token 越来越少，token 总数从 30 降到 8');
}

// like 后面的 distribution：MLE 与 Laplace
function laplace() {
  const syms = ['green', 'I', 'Sam', 'am', 'and', 'do', 'eggs', 'ham', 'like', 'not', '</s>'];
  const mle = syms.map((s) => (s === 'green' ? 1 : 0));
  const lap = syms.map((s) => (s === 'green' ? 2 : 1) / 12);
  const top = 44, h = 17;
  const s1 = lin(0, 1, 88, 268), s2 = lin(0, 1, 340, 520);
  let o = text(178, 18, 'MLE：P(· | like)', 'tb', 'middle') + text(430, 18, 'Laplace：P(· | like)', 'tb', 'middle');
  o += line(s1(0), top - 6, s1(0), top + syms.length * h, 'axis') + line(s2(0), top - 6, s2(0), top + syms.length * h, 'axis');
  o += line(s1(1), top - 6, s1(1), top + syms.length * h, 'grid') + line(s2(1), top - 6, s2(1), top + syms.length * h, 'grid');
  o += text(s1(1), top - 10, '1', 'ts', 'middle') + text(s2(1), top - 10, '1', 'ts', 'middle');
  syms.forEach((s, i) => {
    const y = top + i * h;
    o += text(80, y + 12, s.replace('<', '&lt;').replace('>', '&gt;'), 'ts', 'end');
    if (mle[i] > 0) o += rect(s1(0), y + 2, s1(mle[i]) - s1(0), h - 4, 'solid');
    o += text(s1(mle[i]) + 5, y + 12, mle[i] ? '1' : '0', 'ts');
    o += rect(s2(0), y + 2, s2(lap[i]) - s2(0), h - 4, i === 0 ? 'solid' : 'wash-strong');
    o += text(s2(lap[i]) + 5, y + 12, i === 0 ? '2/12' : '1/12', 'ts');
  });
  const yb = top + syms.length * h + 18;
  o += text(178, yb, '训练里 like 只接过 green', 'ts', 'middle') + text(430, yb, '没见过的 10 个合计 10/12', 'ts', 'middle');
  return svg(560, yb + 10, o, '训练数据里 like 后面只出现过 green。MLE 给 green 概率 1，其余为 0；Laplace smoothing 后 green 只剩六分之一，十个没见过的 symbol 各十二分之一');
}

// SGNS 的一步 update
function sgns() {
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const w = [0.5, 0.2], cp = [0.1, 0.4], cn = [0.6, 0.1];
  const sp = sig(dot(cp, w)), sn = sig(dot(cn, w));
  const cp2 = [cp[0] - (sp - 1) * w[0], cp[1] - (sp - 1) * w[1]];
  const cn2 = [cn[0] - sn * w[0], cn[1] - sn * w[1]];
  const w2 = [w[0] - ((sp - 1) * cp[0] + sn * cn[0]), w[1] - ((sp - 1) * cp[1] + sn * cn[1])];
  const S = 380, O = [60, 226];
  const P = (v) => [O[0] + S * v[0], O[1] - S * v[1]];
  let o = line(O[0] - 10, O[1], O[0] + S * 0.72, O[1], 'axis') + line(O[0], O[1] + 14, O[0], O[1] - S * 0.56, 'axis');
  const vec = (v, cls, lab, dx, dy, tcls, anc = 'start') => { const p = P(v); o += arrow(O[0], O[1], p[0], p[1], cls); if (lab) o += text(p[0] + dx, p[1] + dy, lab, tcls, anc); };
  vec(w, 'mute', 'w', 6, 4, 'ts');
  vec(cp, 'mute', 'c_pos', -6, -8, 'ts');
  vec(cn, 'mute', 'c_neg', 8, 0, 'ts');
  vec(w2, 'ink-b', 'w′', -8, 0, 'tb', 'end');
  vec(cp2, 'ln', 'c_pos′', 8, -2, 'tl');
  vec(cn2, 'ink', 'c_neg′', 10, 5, 't');
  for (const [a, b] of [[w, w2], [cp, cp2], [cn, cn2]]) { const p = P(a), q = P(b); o += line(p[0], p[1], q[0], q[1], 'grid'); }
  o += circle(O[0], O[1], 3, 'ink-f');
  const tx = 360;
  o += text(tx, 40, '灰色：update 之前', 'ts') + text(tx, 58, '实线：update 之后（η = 1）', 'ts');
  o += text(tx, 92, `c_pos · w：${dot(cp, w).toFixed(3)} → ${dot(cp2, w2).toFixed(3)}`, 't');
  o += text(tx, 114, `c_neg · w：${dot(cn, w).toFixed(3)} → ${dot(cn2, w2).toFixed(3)}`, 't');
  const loss = (a, b, c) => -(Math.log(sig(dot(a, b))) + Math.log(sig(-dot(c, b))));
  o += text(tx, 136, `loss：${loss(cp, w, cn).toFixed(3)} → ${loss(cp2, w2, cn2).toFixed(3)}`, 't');
  o += text(tx, 170, 'positive pair 的 dot product 变大，', 'ts') + text(tx, 186, 'negative pair 的变小', 'ts');
  return svg(560, 250, o, 'Skip-gram with negative sampling 的一步 SGD：target vector w 转向 positive context vector，negative context vector 被推开');
}

// Viterbi trellis：Janet will back the bill
function viterbi() {
  const tags = ['NNP', 'MD', 'VB', 'JJ', 'NN', 'RB', 'DT'];
  const A = {
    '<s>': [0.2767, 0.0006, 0.0031, 0.0453, 0.0449, 0.0510, 0.2026],
    NNP: [0.3777, 0.0110, 0.0009, 0.0084, 0.0584, 0.0090, 0.0025],
    MD: [0.0008, 0.0002, 0.7968, 0.0005, 0.0008, 0.1698, 0.0041],
    VB: [0.0322, 0.0005, 0.0050, 0.0837, 0.0615, 0.0514, 0.2231],
    JJ: [0.0366, 0.0004, 0.0001, 0.0733, 0.4509, 0.0036, 0.0036],
    NN: [0.0096, 0.0176, 0.0014, 0.0086, 0.1216, 0.0177, 0.0068],
    RB: [0.0068, 0.0102, 0.1011, 0.1012, 0.0120, 0.0728, 0.0479],
    DT: [0.1147, 0.0021, 0.0002, 0.2157, 0.4744, 0.0102, 0.0017],
  };
  const B = { NNP: [0.000032, 0, 0, 0.000048, 0], MD: [0, 0.308431, 0, 0, 0], VB: [0, 0.000028, 0.000672, 0, 0.000028], JJ: [0, 0, 0.00034, 0, 0], NN: [0, 0.0002, 0.000223, 0, 0.002337], RB: [0, 0, 0.010446, 0, 0], DT: [0, 0, 0, 0.506099, 0] };
  const words = ['Janet', 'will', 'back', 'the', 'bill'];
  const v = [Object.fromEntries(tags.map((t, j) => [t, A['<s>'][j] * B[t][0]]))], bp = [{}];
  for (let i = 1; i < 5; i++) {
    v.push({}); bp.push({});
    tags.forEach((t, j) => {
      let best = tags[0];
      for (const s of tags) if (v[i - 1][s] * A[s][j] > v[i - 1][best] * A[best][j]) best = s;
      v[i][t] = v[i - 1][best] * A[best][j] * B[t][i]; bp[i][t] = best;
    });
  }
  let last = tags[0]; for (const t of tags) if (v[4][t] > v[4][last]) last = t;
  const pathT = [last]; for (let i = 4; i > 0; i--) pathT.unshift(bp[i][pathT[0]]);
  const cx = (i) => 112 + i * 104, cy = (j) => 44 + j * 31, bw = 84, bh = 22;
  let o = '';
  words.forEach((w, i) => { o += text(cx(i), 20, w, 'tb', 'middle'); });
  tags.forEach((t, j) => { o += text(14, cy(j) + 5, t, 'ts'); });
  for (let i = 1; i < 5; i++) for (const t of tags) if (v[i][t] > 0) {
    const s = bp[i][t], j0 = tags.indexOf(s), j1 = tags.indexOf(t);
    const onPath = pathT[i] === t && pathT[i - 1] === s;
    o += line(cx(i - 1) + bw / 2, cy(j0), cx(i) - bw / 2, cy(j1), onPath ? 'ln' : 'mute');
  }
  for (let i = 0; i < 5; i++) tags.forEach((t, j) => {
    const val = v[i][t];
    if (val > 0) {
      const onPath = pathT[i] === t;
      o += rect(cx(i) - bw / 2, cy(j) - bh / 2, bw, bh, onPath ? 'wash' : 'paper', 4) + (onPath ? rect(cx(i) - bw / 2, cy(j) - bh / 2, bw, bh, 'frame', 4) : '');
      o += text(cx(i), cy(j) + 5, sci(val), onPath ? 'tb' : 'ts', 'middle');
    } else o += circle(cx(i), cy(j), 2, 'mute-f');
  });
  const jr = tags.indexOf('RB');
  o += rect(cx(2) - bw / 2 - 4, cy(jr) - bh / 2 - 4, bw + 8, bh + 8, 'dash', 6);
  o += text(cx(2), cy(6) + 26, 'back 这一列最大的是 RB', 'ts', 'middle');
  o += text(280, cy(6) + 50, `最优路径 ${pathT.join(' → ')}，probability ${sci(v[4][last])}`, 't', 'middle');
  return svg(560, cy(6) + 60, o, 'Viterbi trellis：Janet will back the bill 每个位置每个 tag 的最优前缀 probability，最优路径是 NNP MD VB DT NN；back 处 RB 的值最大却不在最优路径上');
}

// encoder-decoder 的 bottleneck 与 attention
function bottleneck() {
  const src = ['the', 'green', 'witch'], tgt = ['la', 'bruja', 'verde'];
  const ex = (i) => 50 + i * 74, dx = (i) => 330 + i * 74, bw = 52, bh = 30;
  let o = '';
  const row = (y, attn) => {
    src.forEach((w, i) => {
      o += text(ex(i), y - 8, w, 'ts', 'middle') + rect(ex(i) - bw / 2, y, bw, bh, 'paper', 5) + text(ex(i), y + 20, `h${'₁₂₃'[i]}`, 't', 'middle');
      if (i) o += arrow(ex(i - 1) + bw / 2, y + bh / 2, ex(i) - bw / 2 - 2, y + bh / 2, 'ink');
    });
    tgt.forEach((w, i) => {
      const hi = i === 2 && attn;
      o += text(dx(i), y - 8, w, 'ts', 'middle') + rect(dx(i) - bw / 2, y, bw, bh, hi ? 'wash' : 'paper', 5) + (hi ? rect(dx(i) - bw / 2, y, bw, bh, 'frame', 5) : '');
      o += text(dx(i), y + 20, `s${'₁₂₃'[i]}`, 't', 'middle');
      if (i) o += arrow(dx(i - 1) + bw / 2, y + bh / 2, dx(i) - bw / 2 - 2, y + bh / 2, 'ink');
    });
  };
  const y1 = 56, y2 = 170;
  o += text(10, 18, '没有 attention：decoder 只拿到最后一个 state', 'tb');
  row(y1, false);
  o += arrow(ex(2) + bw / 2, y1 + bh / 2, dx(0) - bw / 2 - 2, y1 + bh / 2, 'ln') + text((ex(2) + dx(0)) / 2, y1 + bh + 16, 'd 个数', 'tl', 'middle');
  o += text(10, 132, '有 attention：每一步对所有 h 做 weighted average（这里是生成 verde 的那一步）', 'tb');
  row(y2, true);
  const al = [0.1, 0.736, 0.164], C = [230, 262];
  src.forEach((w, i) => {
    o += text(ex(i), y2 + bh + 16, `α = ${al[i].toFixed(3)}`, i === 1 ? 'tl' : 'ts', 'middle');
    o += line(ex(i), y2 + bh + 22, C[0] - 30 + i * 30, C[1], i === 1 ? 'ln' : 'mute');
  });
  o += rect(C[0] - 60, C[1], 120, 30, 'paper', 5) + text(C[0], C[1] + 20, 'c = Σ αⱼ hⱼ', 't', 'middle');
  o += line(C[0] + 60, C[1] + 15, dx(2), C[1] + 15, 'ink') + arrow(dx(2), C[1] + 15, dx(2), y2 + bh + 2, 'ink');
  o += text(dx(2) - 8, C[1] + 6, 'context vector', 'ts', 'end');
  return svg(560, C[1] + 40, o, '上图：encoder-decoder 只把 encoder 最后的 hidden state 交给 decoder。下图：attention 让 decoder 在生成 verde 时对三个 encoder state 加权平均，green 的 weight 最大');
}

// 3 个 token 的 causal attention weight
function attn3() {
  const X = [[1, 0], [0, 2], [1, 1]], Q = X.map(([a, b]) => [a, a + b]);
  const W = [];
  for (let i = 0; i < 3; i++) {
    const s = X.slice(0, i + 1).map((k) => (Q[i][0] * k[0] + Q[i][1] * k[1]) / Math.SQRT2);
    const m = Math.max(...s), e = s.map((x) => Math.exp(x - m)), z = e.reduce((a, b) => a + b);
    W.push(e.map((x) => x / z));
  }
  const x0 = 120, y0 = 46, c = 70;
  let o = text(x0 + 1.5 * c, 22, 'key（被看的 token）', 'ts', 'middle');
  for (let j = 0; j < 3; j++) o += text(x0 + j * c + c / 2, 40, `token ${j + 1}`, 'ts', 'middle');
  for (let i = 0; i < 3; i++) {
    o += text(x0 - 10, y0 + i * c + c / 2 + 4, `query ${i + 1}`, 'ts', 'end');
    for (let j = 0; j < 3; j++) {
      const x = x0 + j * c, y = y0 + i * c;
      if (j > i) { o += rect(x + 2, y + 2, c - 4, c - 4, 'wash2', 3) + text(x + c / 2, y + c / 2 + 4, 'masked', 'ts', 'middle'); continue; }
      const wv = W[i][j];
      o += rect(x + 2, y + 2, c - 4, c - 4, 'paper', 3) + `<rect x="${x + 2}" y="${y + 2}" width="${c - 4}" height="${c - 4}" rx="3" class="solid" fill-opacity="${(0.08 + 0.92 * wv).toFixed(3)}"/>`;
      o += text(x + c / 2, y + c / 2 + 5, wv.toFixed(3), wv > 0.5 ? 'tw' : 'tb', 'middle');
    }
  }
  const outs = W.map((w) => [0, 1].map((k) => w.reduce((s, a, j) => s + a * X[j][k], 0)));
  const ox = 360;
  o += text(ox, 40, 'output = weight × V', 'ts');
  outs.forEach((v, i) => { o += text(ox, y0 + i * c + c / 2 + 4, `a${'₁₂₃'[i]} = (${v[0].toFixed(3)}, ${v[1].toFixed(3)})`, 't'); });
  o += text(280, y0 + 3 * c + 24, '每个 row 合计为 1；颜色越深 weight 越大', 'ts', 'middle');
  return svg(560, y0 + 3 * c + 34, o, '三个 token 的 causal self-attention weight matrix：对角线右上方被 mask 为零，第二个 query 几乎全看 token 2，第三个 query 主要看 token 2 和 token 3');
}

// 不 scaling 时 softmax 随 d 饱和：随机 q、k 的模拟
function softmax() {
  let seed = 12345;
  const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
  const ds = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024], T = 8, trials = 3000;
  const res = ds.map((dd) => {
    const acc = { u: [0, 0], s: [0, 0] };
    for (let n = 0; n < trials; n++) {
      let q2 = 0; for (let m = 0; m < dd; m++) { const g = gauss(); q2 += g * g; }
      const z = Array.from({ length: T }, gauss);
      for (const key of ['u', 's']) {
        const sc = z.map((x) => x * Math.sqrt(q2) / (key === 's' ? Math.sqrt(dd) : 1));
        const mx = Math.max(...sc), e = sc.map((x) => Math.exp(x - mx)), Z = e.reduce((a, b) => a + b), p = e.map((x) => x / Z);
        let f = 0; for (let i = 0; i < T; i++) for (let j = 0; j < T; j++) { const J = (i === j ? p[i] : 0) - p[i] * p[j]; f += J * J; }
        acc[key][0] += Math.max(...p); acc[key][1] += Math.sqrt(f);
      }
    }
    return { dd, u: acc.u.map((x) => x / trials), s: acc.s.map((x) => x / trials) };
  });
  let o = '';
  const panel = (x0, k, y1, title, yt) => {
    const sx = lin(0, 10, x0, x0 + 200), sy = lin(0, y1, 220, 40);
    o += axes({ sx, sy, x0: 0, x1: 10, y0: 0, y1, xt: [[2, '4'], [4, '16'], [6, '64'], [8, '256'], [10, '1024']], yt });
    o += text(x0 + 100, 22, title, 'tb', 'middle') + text(x0 + 200, 256, 'd_k（log scale）', 'ts', 'end');
    for (const key of ['u', 's']) {
      const pts = res.map((r) => [sx(Math.log2(r.dd)), sy(r[key][k])]);
      o += path(d(pts), key === 'u' ? 'ln' : 'ink');
      for (const p of pts) o += circle(p[0], p[1], 2.5, key === 'u' ? 'ln-f' : 'ink-f');
    }
    return { sx, sy };
  };
  const a = panel(60, 0, 1, '平均最大 weight', [[0.25, '0.25'], [0.5, '0.5'], [0.75, '0.75'], [1, '1']]);
  const b = panel(330, 1, 0.45, 'softmax Jacobian 的 norm', [[0.1, '0.1'], [0.2, '0.2'], [0.3, '0.3'], [0.4, '0.4']]);
  const last = res[res.length - 1];
  o += text(a.sx(4.6), a.sy(0.6), '不 scaling', 'tl') + text(a.sx(10), a.sy(last.s[0]) - 8, '除以 √d_k', 'tb', 'end');
  o += text(b.sx(0.4), b.sy(0.18), '不 scaling', 'tl') + text(b.sx(10), b.sy(last.s[1]) - 8, '除以 √d_k', 'tb', 'end');
  o += text(280, 282, `一个 query 对 8 个 key；q、k 的 component 都是 standard normal，每个 d_k 平均 ${trials} 次`, 'ts', 'middle');
  return svg(560, 292, o, '模拟：不除以根号 d_k 时，随着 d_k 增大，softmax 的最大 weight 趋近 1，Jacobian 的 norm 趋近 0；除以根号 d_k 后两者都不随 d_k 变化');
}

// pre-norm Transformer block
function block() {
  const X = 150;
  let o = '';
  o += arrow(X, 330, X, 30, 'ink-b');
  o += text(X, 348, 'x（来自上一层）', 't', 'middle') + text(X, 20, 'output（送往下一层）', 't', 'middle');
  const sub = (y, name) => {
    const bx = 250;
    o += line(X, y + 60, bx, y + 60, 'mute');
    o += rect(bx, y + 44, 70, 32, 'paper', 5) + text(bx + 35, y + 65, 'LN', 't', 'middle');
    o += arrow(bx + 70, y + 60, bx + 100, y + 60, 'ink');
    o += rect(bx + 102, y + 38, 170, 44, 'wash', 6) + rect(bx + 102, y + 38, 170, 44, 'frame', 6) + text(bx + 187, y + 65, name, 'tb', 'middle');
    o += path(`M${bx + 187} ${y + 38}L${bx + 187} ${y + 10}L${X + 14} ${y + 10}`, 'ink');
    o += poly([[X + 12, y + 10], [X + 20, y + 6], [X + 20, y + 14]], 'ink-f');
    o += circle(X, y + 10, 11, 'paper') + text(X, y + 15, '+', 'tb', 'middle');
  };
  sub(200, 'Multi-head attention');
  sub(70, 'FFN（d → 4d → d）');
  o += text(X - 16, 250, 'residual', 'ts', 'end') + text(X - 16, 266, 'stream', 'ts', 'end');
  o += text(330, 196, '每个位置都看所有（之前的）位置', 'ts', 'middle') + text(330, 66, '每个位置单独过，不看别的位置', 'ts', 'middle');
  return svg(560, 360, o, 'Pre-norm Transformer block：residual stream 从下往上，先分出一份经过 LayerNorm 和 multi-head attention 后加回来，再分出一份经过 LayerNorm 和 feedforward network 后加回来');
}

// Chinchilla 的 parametric fit 画出的 iso-FLOP curve
function isoflop() {
  const E = 1.69, A = 406.4, B = 410.7, al = 0.34, be = 0.28;
  const L = (N, C) => E + A / N ** al + B / (C / (6 * N)) ** be;
  const sx = lin(8, 12, 70, 530), sy = lin(1.8, 2.8, 250, 30);
  let o = axes({ sx, sy, x0: 8, x1: 12, y0: 1.8, y1: 2.8, xt: [[8, '10⁸'], [9, '10⁹'], [10, '10¹⁰'], [11, '10¹¹'], [12, '10¹²']], yt: [[2, '2.0'], [2.2, '2.2'], [2.4, '2.4'], [2.6, '2.6']] });
  o += text(530, 284, 'parameter 数 N（log scale）', 'ts', 'end') + text(70, 18, '预测的 loss', 'ts');
  const G = ((al * A) / (be * B)) ** (1 / (al + be));
  const Cs = [[1e21, '10²¹ FLOP'], [1e22, '10²² FLOP'], [1e23, '10²³ FLOP'], [5.76e23, '5.76×10²³ FLOP']];
  Cs.forEach(([C, lab], i) => {
    const pts = [];
    for (let k = 0; k <= 300; k++) { const lx = 8 + (4 * k) / 300, v = L(10 ** lx, C); if (v <= 2.8) pts.push([sx(lx), sy(v)]); }
    const big = i === 3;
    o += path(d(pts), big ? 'ln' : 'ink');
    const No = G * (C / 6) ** (be / (al + be));
    o += circle(sx(Math.log10(No)), sy(L(No, C)), 3.5, big ? 'ln-f' : 'ink-f');
    if (big) o += text(sx(12), sy(L(1e12, C)) - 10, lab, 'tl', 'end');
    else o += text(sx(Math.log10(No)), sy(L(No, C)) - 9, lab, 'ts', 'middle');
  });
  const C = 5.76e23;
  for (const [N, lab] of [[280e9, 'Gopher 280B'], [70e9, 'Chinchilla 70B']]) {
    const p = [sx(Math.log10(N)), sy(L(N, C))];
    o += circle(p[0], p[1], 5, 'paper') + text(lab[0] === 'G' ? 530 : p[0] - 10, sy(1.84), `${lab}：${L(N, C).toFixed(3)}`, 't', 'end');
  }
  return svg(560, 292, o, '按 Chinchilla 的 parametric fit 画的 iso-FLOP curve：固定 compute 时 loss 随 model 大小先降后升，每条 curve 有一个最低点；在 Gopher 的 compute 下，280B 的 model 比 70B 的 loss 高');
}

// KL-regularized objective 的最优 policy
function dpo() {
  const pr = [0.5, 0.3, 0.2], r = [0, 1, 2];
  const groups = [[Infinity, 'π_ref（β → ∞）'], [2, 'β = 2'], [1, 'β = 1'], [0.5, 'β = 0.5']];
  const sy = lin(0, 0.9, 220, 40), gw = 120, bw = 30, x0 = 60;
  let o = axes({ sx: lin(0, 1, x0, x0 + 4 * gw), sy, x0: 0, x1: 1, y0: 0, y1: 0.9, yt: [[0.2, '0.2'], [0.4, '0.4'], [0.6, '0.6'], [0.8, '0.8']] });
  const cls = ['wash2', 'wash-strong', 'solid'];
  groups.forEach(([b, lab], g) => {
    const w = pr.map((p, i) => p * (Number.isFinite(b) ? Math.exp(r[i] / b) : 1)), Z = w.reduce((a, c) => a + c);
    const ps = w.map((x) => x / Z);
    ps.forEach((p, i) => {
      const x = x0 + g * gw + 14 + i * (bw + 4);
      o += rect(x, sy(p), bw, sy(0) - sy(p), cls[i]) + text(x + bw / 2, sy(p) - 5, p.toFixed(2), 'ts', 'middle');
    });
    o += text(x0 + g * gw + gw / 2 - 4, 240, lab, g === 0 ? 't' : 'tb', 'middle');
  });
  const lx = 140;
  ['response 1（r = 0）', 'response 2（r = 1）', 'response 3（r = 2）'].forEach((s, i) => { o += rect(lx + i * 140, 262, 12, 12, cls[i]) + text(lx + i * 140 + 18, 273, s, 'ts'); });
  return svg(560, 284, o, '同一个 reference policy 和 reward 下，KL-regularized objective 的最优 policy 随 beta 变化：beta 越小，probability 越集中到 reward 最高的 response');
}

// LoRA 的形状
function lora() {
  const S = 150, x0 = 40, y0 = 40;
  let o = rect(x0, y0, S, S, 'wash2') + rect(x0, y0, S, S, 'frame') + text(x0 + S / 2, y0 + S / 2 - 4, 'W', 'tbig', 'middle') + text(x0 + S / 2, y0 + S / 2 + 18, '冻结', 'ts', 'middle');
  o += text(x0 + S / 2, y0 - 10, 'k', 'ts', 'middle') + text(x0 - 8, y0 + S / 2 + 4, 'd', 'ts', 'end');
  o += text(x0 + S + 24, y0 + S / 2 + 8, '+', 'tbig', 'middle');
  const bx = 250, r = 16;
  o += rect(bx, y0, r, S, 'solid') + text(bx + r / 2, y0 - 10, 'r', 'ts', 'middle') + text(bx - 8, y0 + S / 2 + 4, 'B', 'tb', 'end');
  o += text(bx + r + 14, y0 + 10, '×', 't', 'middle');
  const ax = bx + r + 28;
  o += rect(ax, y0, S, r, 'solid') + text(ax + S / 2, y0 - 10, 'A', 'tb', 'middle') + text(ax + S + 8, y0 + 12, 'r', 'ts');
  o += text(ax, y0 + 56, 'd = k = 4096，r = 8：', 't');
  o += text(ax, y0 + 78, 'W 有 16,777,216 个 parameter', 'ts');
  o += text(ax, y0 + 98, 'B 和 A 合计 2 × 4096 × 8 = 65,536 个', 'ts');
  o += text(ax, y0 + 118, '只训练 0.39%', 'tl');
  o += text(280, y0 + S + 34, 'W′ = W + BA：BA 和 W 一样大，但 rank 不超过 r；B 初始化为 0，training 从 pretrained model 出发', 'ts', 'middle');
  return svg(560, y0 + S + 44, o, 'LoRA：冻结的 d 乘 k 的 weight matrix W 加上一个 d 乘 r 的 B 与 r 乘 k 的 A 的乘积，只训练 B 和 A');
}

export default {
  'cs4248-bpe': bpe,
  'cs4248-laplace': laplace,
  'cs4248-sgns': sgns,
  'cs4248-viterbi': viterbi,
  'cs4248-bottleneck': bottleneck,
  'cs4248-attn3': attn3,
  'cs4248-softmax': softmax,
  'cs4248-block': block,
  'cs4248-isoflop': isoflop,
  'cs4248-dpo': dpo,
  'cs4248-lora': lora,
};
