import { svg, svgA, anim, ashow, apath, f1, lin, d, path, line, rect, circle, poly, text, it, arrow, curve, area, axes } from '../lib/svg.mjs';

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

// 用学到的 8 条 merge 按顺序切 `_resent`
function bpeencode() {
  const merges = [['n', 'e'], ['ne', 'w'], ['_', 'r'], ['_r', 'e'], ['_', 'new'], ['_re', 'new'], ['s', 'e'], ['se', 't']];
  const apply = (toks, m) => { const o = []; let hit = false; for (let i = 0; i < toks.length; i++) { if (i + 1 < toks.length && toks[i] === m[0] && toks[i + 1] === m[1]) { o.push(m[0] + m[1]); i++; hit = true; } else o.push(toks[i]); } return [o, hit]; };
  let toks = '_resent'.split('');
  const cw = 16, X0 = 250, rh = 30;
  let o = text(20, 20, 'merge（按学到的顺序）', 'tb') + text(X0, 20, '_resent 当前的切分', 'tb');
  const row = (y, ts, fresh) => {
    let x = X0;
    for (const t of ts) {
      const wd = Math.max(t.length * cw, 22);
      o += rect(x + 1, y, wd - 2, 24, t.length > 1 ? (t === fresh ? 'wash-strong' : 'wash') : 'paper', 3);
      o += text(x + wd / 2, y + 16, t, t.length > 1 ? 'tb' : 't', 'middle');
      x += wd;
    }
  };
  o += text(20, 50, '开始：拆成 character', 'ts');
  row(34, toks, null);
  merges.forEach((m, k) => {
    const y = 34 + (k + 1) * rh;
    const [nt, hit] = apply(toks, m);
    o += text(20, y + 16, `${k + 1}.  ${m[0]} ${m[1]}  →  ${m[0] + m[1]}`, hit ? 'tl' : 'ts');
    o += text(548, y + 16, hit ? '合并' : '没有这个 pair', hit ? 'tl' : 'ts', 'end');
    row(y, nt, hit ? m[0] + m[1] : null);
    toks = nt;
  });
  const yb = 34 + 9 * rh + 22;
  o += text(280, yb, '第 1 条找 n e，这里只有 e n，顺序不对；第 8 条找 se t，但 se 后面是 n。结果 _re se n t。', 'ts', 'middle');
  return svg(560, yb + 10, o, '用 8 条 merge 按学到的顺序切分新 word _resent：第 3、4、7 条起作用，结果是 _re se n t');
}

// 三句话的 bigram model 画成图：每条边是 P(下一个 | 当前)
function bigram() {
  const sents = ['<s> I am Sam </s>', '<s> Sam I am </s>', '<s> I do not like green eggs and ham </s>'].map((x) => x.split(' '));
  const C = {}, C2 = {};
  for (const w of sents) for (let i = 0; i + 1 < w.length; i++) { C[w[i]] = (C[w[i]] || 0) + 1; const k = w[i] + '|' + w[i + 1]; C2[k] = (C2[k] || 0) + 1; }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const P = (a, b) => { const n = C2[a + '|' + b] || 0, m = C[a]; const g = gcd(n, m); return n === m ? '1' : `${n / g}/${m / g}`; };
  const esc = (t) => t.replace('<', '&lt;').replace('>', '&gt;');
  const pos = { '<s>': [40, 90], I: [150, 90], am: [270, 90], Sam: [390, 90], '</s>': [515, 90],
    do: [40, 210], not: [112, 210], like: [184, 210], green: [262, 210], eggs: [342, 210], and: [412, 210], ham: [482, 210] };
  const hw = (t) => Math.max(18, t.length * 4.6 + 8), hh = 13;
  const path_ = ['<s>', 'I', 'am', 'Sam', '</s>'];
  const onPath = (a, b) => path_.indexOf(b) === path_.indexOf(a) + 1 && path_.indexOf(a) >= 0;
  let o = '';
  // 直线边：端点停在框边上
  const edge = (a, b, lab, ldx = 0, ldy = -6) => {
    const [x1, y1] = pos[a], [x2, y2] = pos[b];
    const dx = x2 - x1, dy = y2 - y1;
    const cut = (w) => Math.min(Math.abs(dx) > 1e-9 ? w / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-9 ? hh / Math.abs(dy) : 1e9);
    const t1 = cut(hw(a)), t2 = cut(hw(b)) + 0.01;
    const cls = onPath(a, b) ? 'ln' : 'ink';
    o += arrow(x1 + dx * t1, y1 + dy * t1, x2 - dx * t2, y2 - dy * t2, cls);
    o += text((x1 + x2) / 2 + ldx, (y1 + y2) / 2 + ldy, lab, onPath(a, b) ? 'tl' : 'ts', 'middle');
  };
  // 曲线边：从 (x1,y1) 经控制点到 (x2,y2)，在末端画箭头
  const arc = (x1, y1, cx, cy, x2, y2, lab, lx, ly, cls = 'ink') => {
    o += path(`M${x1} ${y1} Q ${cx} ${cy}, ${x2} ${y2}`, cls);
    const t = 0.9, ex = (1 - t) ** 2 * x1 + 2 * t * (1 - t) * cx + t * t * x2, ey = (1 - t) ** 2 * y1 + 2 * t * (1 - t) * cy + t * t * y2;
    o += arrow(ex, ey, x2, y2, cls);
    o += text(lx, ly, lab, cls === 'dash' ? 'ts' : 'ts', 'middle');
  };
  edge('<s>', 'I', P('<s>', 'I')); edge('I', 'am', P('I', 'am')); edge('am', 'Sam', P('am', 'Sam')); edge('Sam', '</s>', P('Sam', '</s>'));
  arc(pos['<s>'][0], 77, 215, -4, pos.Sam[0] - 6, 77, P('<s>', 'Sam'), 215, 30);
  arc(pos.am[0] + 4, 77, 395, 16, pos['</s>'][0] - 6, 77, P('am', '</s>'), 395, 42);
  arc(pos.Sam[0] - 4, 103, 270, 160, pos.I[0] + 6, 103, P('Sam', 'I'), 270, 146);
  edge('I', 'do', P('I', 'do'), -8, 0);
  const chain = ['do', 'not', 'like', 'green', 'eggs', 'and', 'ham'];
  for (let i = 0; i + 1 < chain.length; i++) edge(chain[i], chain[i + 1], P(chain[i], chain[i + 1]), 0, -6);
  edge('ham', '</s>', P('ham', '</s>'), 12, 0);
  // 测试句需要、训练里没出现过的边
  arc(pos.like[0], 223, 333, 300, pos.ham[0], 223, '', 0, 0, 'dash');
  o += text(333, 274, 'ham | like：训练里 0 次 → P = 0', 'ts', 'middle');
  for (const [w, [x, y]] of Object.entries(pos)) {
    const hot = path_.includes(w);
    o += rect(x - hw(w), y - hh, 2 * hw(w), 2 * hh, hot ? 'wash' : 'paper', 5) + text(x, y + 5, esc(w), 'tb', 'middle');
  }
  o += text(280, 306, '彩色是 &lt;s&gt; I am Sam &lt;/s&gt;：2/3 · 2/3 · 1/2 · 1/2 = 1/9。', 'ts', 'middle');
  o += text(280, 324, '虚线是 “I do not like ham” 要走、却不存在的那条边。', 'ts', 'middle');
  return svg(560, 334, o, '三句训练语料估出的 bigram model 画成有向图，每条边标 P(下一个|当前)；like 到 ham 的边不存在');
}

// the green witch：decoder state 对三个 encoder state 的 attention
function witch() {
  const H = { the: [1, 0], green: [0.5, 2], witch: [1.5, 0.5] }, s = [0, 1];
  const sc = Object.fromEntries(Object.entries(H).map(([k, h]) => [k, s[0] * h[0] + s[1] * h[1]]));
  const Z = Object.values(sc).reduce((a, e) => a + Math.exp(e), 0);
  const al = Object.fromEntries(Object.keys(H).map((k) => [k, Math.exp(sc[k]) / Z]));
  const c = [0, 1].map((i) => Object.keys(H).reduce((a, k) => a + al[k] * H[k][i], 0));
  const sx = lin(-0.2, 2, 50, 50 + 2.2 * 115), sy = lin(-0.2, 2.2, 284, 284 - 2.4 * 115);
  let o = axes({ sx, sy, x0: -0.2, x1: 2, y0: -0.2, y1: 2.2, xt: [0, 1, 2], yt: [0, 1, 2], xAt: 0, yAt: 0 });
  o += path(`M${sx(1)} ${sy(0)} L${sx(0.5)} ${sy(2)} L${sx(1.5)} ${sy(0.5)} Z`, 'dash');
  const lab = { the: [8, 17, 'start'], green: [10, 0, 'start'], witch: [10, 4, 'start'] };
  for (const k of Object.keys(H)) {
    o += arrow(sx(0), sy(0), sx(H[k][0]), sy(H[k][1]), 'ink');
    const [dx, dy, an] = lab[k];
    o += text(sx(H[k][0]) + dx, sy(H[k][1]) + dy, 'h_' + k, 'tb', an);
  }
  o += arrow(sx(0), sy(0), sx(s[0]), sy(s[1]), 'ln') + text(sx(s[0]) + 8, sy(s[1]) - 4, 's（decoder）', 'tl', 'start');
  o += circle(sx(c[0]), sy(c[1]), 5, 'solid') + line(sx(c[0]) + 5, sy(c[1]) - 2, sx(1.0), sy(1.68), 'mute') + text(sx(1.0) + 4, sy(1.68) + 4, 'c', 'tl', 'start');
  // 右边：分数、weight
  const X = 360;
  o += text(X, 40, 'score = s · h', 'tb') + text(X + 140, 40, 'α', 'tb', 'end');
  Object.keys(H).forEach((k, i) => {
    const y = 68 + i * 30;
    o += text(X, y, k + '：' + sc[k], 't') + text(X + 140, y, al[k].toFixed(3), 'tb', 'end');
    o += rect(X + 150, y - 11, 46 * al[k] / 0.75, 12, 'wash-strong');
  });
  o += text(X, 176, 'c = Σ α h', 'tb') + text(X, 200, `= (${c[0].toFixed(3)}, ${c[1].toFixed(3)})`, 't');
  o += text(X, 236, '虚线三角形是三个 h 的', 'ts') + text(X, 254, 'convex hull；c 是 weighted', 'ts') + text(X, 272, 'average，一定落在里面，', 'ts') + text(X, 290, '而且靠近 weight 大的 green。', 'ts');
  return svg(560, 306, o, 'the green witch 的 attention：三个 encoder state、decoder state s、score、softmax weight 和 context vector c');
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

// 开头第一次：测试句沿 bigram 一步步乘下去，碰到训练里没出现过的 like → ham 就变成 0
function zero() {
  const sents = ['<s> I am Sam </s>', '<s> Sam I am </s>', '<s> I do not like green eggs and ham </s>'].map((x) => x.split(' '));
  const C = {}, C2 = {};
  for (const w of sents) for (let i = 0; i + 1 < w.length; i++) { C[w[i]] = (C[w[i]] || 0) + 1; const k = w[i] + ' ' + w[i + 1]; C2[k] = (C2[k] || 0) + 1; }
  const test = '<s> I do not like ham </s>'.split(' ');
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const frac = (n, m) => (n === 0 ? '0' : n === m ? '1' : `${n / gcd(n, m)}/${m / gcd(n, m)}`);
  const esc = (t) => t.replace('<', '&lt;').replace('>', '&gt;');
  const X = (k) => 40 + k * 80, Y = 92;
  const E = test.length - 1;
  // 帧 s：0 = 全部乘完（静态图）；k = 1..6 = 乘到第 k 条边
  const dur = [3.4, 1.5, 1.5, 1.5, 1.5, 1.9, 1.5, 0.6], T = dur.reduce((a, b) => a + b, 0);
  const kt = [0]; for (let k = 0; k < dur.length - 1; k++) kt.push(kt[k] + dur[k] / T);
  const S = [0, 1, 2, 3, 4, 5, 6, 0];
  const g = (body, on) => `<g>${body}${ashow(S.map(on), kt, T)}</g>`;
  let o = text(280, 20, '测试句的 probability = 每一步 P(下一个 | 当前) 乘起来', 'tb', 'middle');
  o += text(280, 40, '五个 word 在训练的三句话里都出现过', 'ts', 'middle');
  let num = 1, den = 1;
  for (let k = 1; k <= E; k++) {
    const a = test[k - 1], b = test[k], n = C2[a + ' ' + b] || 0, m = C[a];
    num *= n; den *= m;
    const x1 = X(k - 1) + 30, x2 = X(k) - 30, zeroE = n === 0;
    o += arrow(x1, Y, x2, Y, zeroE ? 'dash' : 'mute');
    o += g(arrow(x1, Y, x2, Y, 'ln'), (s) => s === k || (s === 0 && zeroE));
    o += g(text((x1 + x2) / 2, Y - 10, frac(n, m), zeroE ? 'tl' : 't', 'middle'), (s) => s === 0 || s >= k);
    const pr = num === 0 ? '0' : frac(num, den);
    o += g(text(X(k), Y + 50, pr, num === 0 ? 'tl' : 't', 'middle'), (s) => s === 0 || s >= k);
    // 状态说明
    o += g(text(280, 180, `P(${esc(b)} | ${esc(a)}) = C(${esc(a)} ${esc(b)}) / C(${esc(a)}) = ${n}/${m}${zeroE ? '：训练里 like 后面只接过 green' : ''}`, zeroE ? 'tl' : 't', 'middle'), (s) => s === k);
  }
  test.forEach((w, k) => { o += rect(X(k) - 28, Y - 14, 56, 28, k === 4 || k === 5 ? 'wash' : 'paper', 5) + text(X(k), Y + 5, esc(w), 'tb', 'middle'); });
  o += text(X(0), Y + 50, '乘到这里', 'ts', 'middle');
  o += g(text(280, 180, '只要有一条边在训练里是 0 次，整句的 probability 就是 0', 'tl', 'middle'), (s) => s === 0);
  return svgA(560, 194, o, '动图：测试句 s I do not like ham /s 沿 bigram 一步步乘 probability：2/3、1/3、1、1，到 like 后面接 ham 时训练里是 0 次，乘积变成 0 并一直是 0');
}

// SGNS：同一组 (w, c_pos, c_neg) 反复做 SGD update（η = 1）
function sgns() {
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  const loss = ({ w, cp, cn }) => -(Math.log(sig(dot(cp, w))) + Math.log(sig(-dot(cn, w))));
  const st = [{ w: [0.5, 0.2], cp: [0.1, 0.4], cn: [0.6, 0.1] }];
  for (let k = 0; k < 3; k++) {
    const { w, cp, cn } = st[k], sp = sig(dot(cp, w)), sn = sig(dot(cn, w));
    st.push({ cp: [cp[0] - (sp - 1) * w[0], cp[1] - (sp - 1) * w[1]], cn: [cn[0] - sn * w[0], cn[1] - sn * w[1]], w: [w[0] - ((sp - 1) * cp[0] + sn * cn[0]), w[1] - ((sp - 1) * cp[1] + sn * cn[1])] });
  }
  // 帧：静态 = 第 1 步之后（正文算的那一步）；然后从 0 开始一步一步走到 4
  const ks = [1, 1, 0, 0], ts = [0, 3.2, 3.2, 4.4];
  for (let k = 1; k <= 3; k++) { const t0 = ts[ts.length - 1]; ks.push(k, k); ts.push(t0 + 0.6, t0 + 1.8); }
  ks.push(1); ts.push(ts[ts.length - 1] + 0.01);
  const T = ts[ts.length - 1], kt = ts.map((t) => t / T);
  const U = 190, O = [60, 196];
  const P = (v) => [O[0] + U * v[0], O[1] - U * v[1]];
  const arr = (v) => { const [x, y] = P(v), a = Math.atan2(y - O[1], x - O[0]), h = (t) => [x - 8 * Math.cos(a + t), y - 8 * Math.sin(a + t)]; return d([O, [x, y]]) + d([h(0.42), [x, y], h(-0.42)]); };
  let o = line(O[0] - 14, O[1], O[0] + U * 0.75, O[1], 'axis') + line(O[0], O[1] + U * 0.5, O[0], O[1] - U * 0.98, 'axis');
  // 起点（灰）
  for (const [v, lab, dx, dy] of [[st[0].w, 'w', 8, 12], [st[0].cp, 'c_pos', -8, -6], [st[0].cn, 'c_neg', 8, 4]]) { const p = P(v); o += path(arr(v), 'mute') + text(p[0] + dx, p[1] + dy, lab, 'ts', dx < 0 ? 'end' : 'start'); }
  for (const [key, cls, lab, tcls, dx, dy, anc] of [['cn', 'ink', 'c_neg', 't', 10, 6, 'start'], ['cp', 'ln', 'c_pos', 'tl', 10, -4, 'start'], ['w', 'ink-b', 'w', 'tb', -10, 0, 'end']]) {
    const vs = ks.map((k) => st[k][key]);
    o += apath(vs.map(arr), kt, T, cls);
    const px = vs.map((v) => f1(P(v)[0] + dx)), py = vs.map((v) => f1(P(v)[1] + dy));
    o += `<text x="${px[0]}" y="${py[0]}" class="${tcls}" text-anchor="${anc}">${lab}${anim('x', px, kt, T)}${anim('y', py, kt, T)}</text>`;
  }
  o += circle(O[0], O[1], 3, 'ink-f');
  // 读数
  const tx = 330;
  o += text(tx, 28, '灰色：update 之前', 'ts') + text(tx, 46, '彩色和黑色：update 之后（η = 1）', 'ts');
  const show = (k) => ashow(ks.map((j) => j === k), kt, T);
  for (let k = 0; k <= 3; k++) {
    const q = st[k];
    o += `<g>${text(tx, 84, k === 0 ? '还没 update' : `第 ${k} 步之后`, 'tb')}${text(tx, 108, `c_pos · w = ${dot(q.cp, q.w).toFixed(3)}`, 'tl')}${text(tx, 130, `c_neg · w = ${dot(q.cn, q.w).toFixed(3).replace("-", "−")}`, 't')}${text(tx, 152, `loss = ${loss(q).toFixed(3)}`, 't')}${show(k)}</g>`;
  }
  o += text(tx, 186, '开始时：0.130、0.320、1.496', 'ts');
  o += text(tx, 218, 'positive pair 的 dot product 越来越大，', 'ts') + text(tx, 236, 'negative pair 的越来越小（变成负的）；', 'ts') + text(tx, 254, '同一组 pair 反复练，vector 也越拉越长。', 'ts');
  return svgA(560, 296, o, '动图：Skip-gram with negative sampling 对同一组 w、c_pos、c_neg 反复做 3 步 SGD update。w 和 c_pos 互相靠拢，c_neg 被推到另一侧；c_pos·w 从 0.130 涨到 0.894，c_neg·w 从 0.320 降到负 0.378，loss 从 1.496 降到 0.865');
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
  // 帧 s：0 = 全部算完、路径已标出（静态图）；1–5 = 逐列填 v；6–10 = 从最后一列沿 backpointer 往回走
  const dur = [3.2, 1.6, 1.6, 1.6, 1.6, 1.6, 0.9, 0.9, 0.9, 0.9, 2.6], T = dur.reduce((a, b) => a + b, 0);
  const kt = [0]; for (let k = 0; k < dur.length - 1; k++) kt.push(kt[k] + dur[k] / T);
  const S = dur.map((_, k) => k);
  const filled = (i, s) => s === 0 || s >= i + 1;
  const lit = (i, s) => s === 0 || (s >= 6 && i >= 10 - s);
  const g = (body, on) => `<g>${body}${ashow(S.map(on), kt, T)}</g>`;
  let o = '';
  words.forEach((w, i) => { o += text(cx(i), 20, w, 'tb', 'middle'); });
  tags.forEach((t, j) => { o += text(14, cy(j) + 5, t, 'ts'); });
  for (let i = 1; i < 5; i++) for (const t of tags) if (v[i][t] > 0) {
    const s0 = bp[i][t], j0 = tags.indexOf(s0), j1 = tags.indexOf(t);
    const onPath = pathT[i] === t && pathT[i - 1] === s0;
    const ln = line(cx(i - 1) + bw / 2, cy(j0), cx(i) - bw / 2, cy(j1), 'mute');
    o += onPath ? g(ln, (s) => filled(i, s) && !lit(i, s)) + g(line(cx(i - 1) + bw / 2, cy(j0), cx(i) - bw / 2, cy(j1), 'ln'), (s) => lit(i, s)) : g(ln, (s) => filled(i, s));
  }
  for (let i = 0; i < 5; i++) tags.forEach((t, j) => {
    const val = v[i][t];
    if (val > 0) {
      const plain = rect(cx(i) - bw / 2, cy(j) - bh / 2, bw, bh, 'paper', 4) + text(cx(i), cy(j) + 5, sci(val), 'ts', 'middle');
      if (pathT[i] === t) {
        const hot = rect(cx(i) - bw / 2, cy(j) - bh / 2, bw, bh, 'wash', 4) + rect(cx(i) - bw / 2, cy(j) - bh / 2, bw, bh, 'frame', 4) + text(cx(i), cy(j) + 5, sci(val), 'tb', 'middle');
        o += g(plain, (s) => filled(i, s) && !lit(i, s)) + g(hot, (s) => lit(i, s));
      } else o += g(plain, (s) => filled(i, s));
    } else o += circle(cx(i), cy(j), 2, 'mute-f');
  });
  // 正在填的那一列 / 正在回溯的那一格
  const colX = S.map((s) => f1(s >= 1 && s <= 5 ? cx(s - 1) - bw / 2 - 6 : -200));
  o += `<rect x="${colX[0]}" y="${cy(0) - bh / 2 - 6}" width="${bw + 12}" height="${cy(6) - cy(0) + bh + 12}" rx="6" class="ln-dash">${anim('x', colX, kt, T, true)}</rect>`;
  const jr = tags.indexOf('RB');
  o += g(rect(cx(2) - bw / 2 - 4, cy(jr) - bh / 2 - 4, bw + 8, bh + 8, 'dash', 6) + text(cx(2), cy(6) + 26, 'back 这一列最大的是 RB', 'ts', 'middle'), (s) => s === 0 || s >= 8);
  const Y = cy(6) + 50;
  o += g(text(280, Y, `最优路径 ${pathT.join(' → ')}，probability ${sci(v[4][last])}`, 't', 'middle'), (s) => s === 0 || s === 10);
  o += g(text(280, Y, '第 1 列：v = a(&lt;s&gt;, tag) × b(tag, Janet)', 'tl', 'middle'), (s) => s === 1);
  for (let i = 1; i < 5; i++) o += g(text(280, Y, `第 ${i + 1} 列（${words[i]}）：每格从前一列挑 v × a 最大的那格（灰线），再乘 b`, 'tl', 'middle'), (s) => s === i + 1);
  o += g(text(280, Y, '从最后一列最大的格子出发，沿灰线往回走', 'tl', 'middle'), (s) => s >= 6 && s <= 9);
  return svgA(560, cy(6) + 60, o, '动图：Viterbi trellis，Janet will back the bill。先一列一列填出每个 tag 的最优前缀 probability，每格连回前一列的 backpointer；再从最后一列最大的 NN 沿 backpointer 往回走，得到 NNP MD VB DT NN；back 处 RB 的值最大却不在最优路径上');
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
  'cs4248-bpeencode': bpeencode,
  'cs4248-bigram': bigram,
  'cs4248-zero': zero,
  'cs4248-witch': witch,
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
