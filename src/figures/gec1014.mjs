import { svg, svgA, anim, animRot, apath, ashow, f1, lin, logx, d, path, line, rect, circle, text, arrow } from '../lib/svg.mjs';

const R = Math.PI / 180;
const cents = (r) => 1200 * Math.log2(r);
// 一段时间内亮起：values 0 → 1 → 0（discrete）。on 为 0 时推迟一点，保证第一帧是暗的
const flash = (on, len, T) => ashow([0, 1, 0], [0, Math.max(on, 0.02) / T, Math.min(on + len, T - 0.001) / T], T);
// 绕回起点的那一下（第一帧就亮）：开头亮 len 秒，结尾最后一刻再亮
const flashWrap = (len, T) => ashow([1, 0, 1], [0, len / T, (T - 0.06) / T], T);

// ---------- 第 1 站：string 的 standing wave 与 harmonic series ----------
function string() {
  let o = text(20, 12, '两端固定的 string 只能这样振动：每一段都是半个 wave', 'ts');
  const x0 = 52, x1 = 292, L = x1 - x0;
  for (let n = 1; n <= 4; n++) {
    const yc = 48 + (n - 1) * 44, A = 13;
    o += line(x0, yc, x1, yc, 'grid');
    const up = [], dn = [];
    for (let i = 0; i <= 160; i++) {
      const x = x0 + (L * i) / 160, s = Math.sin((n * Math.PI * i) / 160);
      up.push([x, yc - A * s]); dn.push([x, yc + A * s]);
    }
    o += path(d(up), 'ln') + path(d(dn), 'ln-dash');
    o += rect(x0 - 7, yc - 17, 7, 34, 'solid2') + rect(x1, yc - 17, 7, 34, 'solid2');
    for (let k = 1; k < n; k++) o += circle(x0 + (L * k) / n, yc, 3, 'ink-f');
    o += text(316, yc - 1, `n = ${n}：${110 * n} Hz`, 'tb');
    o += text(316, yc + 15, n === 1 ? '整根是半个 wave（fundamental）' : `${n} 段，每段 L/${n}，frequency × ${n}`, 'ts');
  }
  o += text(x0, 228, '实线和虚线是同一根 string 振动的两个极端；黑点是 node（始终不动的点）', 'ts');
  // 下方：前 8 个 harmonic 排在 log 的 pitch 轴上
  const sx = logx(100, 920, 40, 540), Y = 300;
  o += text(20, 252, '前 8 个 harmonic 排在 pitch 轴上（等距 = 等 ratio）：相邻两个的 interval 越来越小', 'ts');
  o += line(40, Y, 540, Y, 'axis');
  const names = ['A2', 'A3', 'E4', 'A4', 'C♯5', 'E5', '≈G5', 'A5'];
  for (let n = 1; n <= 8; n++) {
    const x = sx(110 * n);
    o += circle(x, Y, 3.5, 'ink-f') + text(x, Y + 17, String(110 * n), 'ts', 'middle') + text(x, Y + 32, names[n - 1], 'ts', 'middle');
    if (n < 8) {
      const xa = sx(110 * n) + 3, xb = sx(110 * (n + 1)) - 3, xm = (xa + xb) / 2;
      o += line(xa, Y - 10, xb, Y - 10, 'mute') + line(xa, Y - 14, xa, Y - 6, 'mute') + line(xb, Y - 14, xb, Y - 6, 'mute');
      o += text(xm, Y - 18, `${n + 1}:${n}`, n < 3 ? 'tb' : 't', 'middle');
      o += text(xm, Y - 34, Math.round(cents((n + 1) / n)) + '¢', 'ts', 'middle');
    }
  }
  o += text(540, Y + 47, 'Hz', 'ts', 'end');
  return svg(560, 352, o, '一根两端固定的 string 的前四种 standing wave，以及 110 Hz 的前 8 个 harmonic 在 pitch 轴上的位置和相邻 interval');
}

// ---------- 第 1 站：三种 spectrum，同一个 fundamental ----------
function timbre() {
  const rows = [
    ['A', 'amplitude ∝ 1/n（sawtooth）', (n) => 1 / n],
    ['B', '只有 odd harmonics，∝ 1/n', (n) => (n % 2 ? 1 / n : 0)],
    ['C', '几乎只有 fundamental', (n) => (n === 1 ? 1 : n === 2 ? 0.12 : n === 3 ? 0.04 : 0)],
  ];
  let o = text(36, 12, 'spectrum：每个 harmonic 的 amplitude', 'tb') + text(290, 12, 'waveform：两个 period（共 18.2 ms）', 'tb');
  rows.forEach(([lab, desc, amp], i) => {
    const y0 = 34 + i * 92, base = y0 + 56;
    o += text(10, y0 + 34, lab, 'tbig', 'middle');
    o += line(34, base, 222, base, 'axis');
    for (let n = 1; n <= 10; n++) {
      const a = amp(n), x = 38 + (n - 1) * 18.5;
      if (a > 0) o += rect(x, base - 52 * a, 11, 52 * a, 'solid');
      o += text(x + 5.5, base + 13, String(n), 'ts', 'middle');
    }
    o += text(34, y0 - 4, desc, 'ts');
    // waveform
    const xa = 290, xb = 540, yc = y0 + 30, pts = [];
    const wave = (t) => { let s = 0; for (let n = 1; n <= 10; n++) s += amp(n) * Math.sin(2 * Math.PI * n * t); return s; };
    let mx = 0; for (let k = 0; k <= 400; k++) mx = Math.max(mx, Math.abs(wave((2 * k) / 400)));
    for (let k = 0; k <= 400; k++) { const t = (2 * k) / 400; pts.push([xa + ((xb - xa) * k) / 400, yc - (27 * wave(t)) / mx]); }
    o += line(xa, yc, xb, yc, 'grid') + line((xa + xb) / 2, yc - 30, (xa + xb) / 2, yc + 30, 'grid');
    o += path(d(pts), 'ink-b');
  });
  o += text(0, 314, '三行的 fundamental 都是 110 Hz（每个 period 9.09 ms），pitch 相同；不同的只有 recipe。', 'ts');
  return svg(560, 322, o, '三种 spectrum 和对应的 waveform：1/n 的 sawtooth、只有 odd harmonics、几乎只有 fundamental；三者 fundamental 相同');
}

// ---------- 第 2 站：beat、meter 与 syncopation（动图） ----------
function meter() {
  const bpm = 72, b = 60 / bpm, N = 12, Tp = N * b, T = Tp + 1.2;
  const x0 = 140, W = 390, xb = (beat) => x0 + 10 + (W * beat) / N; // beat 可以是小数；整数 k 是第 k+1 拍
  let o = text(10, 14, `tempo = ${bpm} beat per minute：每拍 ${b.toFixed(2)} s，12 拍共 ${Tp.toFixed(0)} s`, 'tb');
  const rowY = { sub: 50, duple: 100, triple: 154, rhy: 212 };
  o += text(10, rowY.sub + 4, 'subdivision', 't') + text(10, rowY.sub + 19, '每拍分成两半', 'ts');
  for (let k = 0; k < 2 * N; k++) o += line(xb(k / 2), rowY.sub - 5, xb(k / 2), rowY.sub + 5, k % 2 ? 'grid' : 'mute');
  const meterRow = (y, g, name, desc) => {
    o += text(10, y + 2, name, 'tb') + text(10, y + 17, desc, 'ts');
    for (let k = 0; k <= N; k += g) o += line(xb(k) - 10, y - 18, xb(k) - 10, y + 18, 'axis');
    for (let k = 0; k < N; k++) {
      const strong = k % g === 0;
      o += circle(xb(k), y, strong ? 8.5 : 4.5, strong ? 'ink-f' : 'paper');
      o += `<g>${circle(xb(k), y, 13, 'ln')}${flash(k * b, 0.28, T)}</g>`;
    }
  };
  meterRow(rowY.duple, 2, 'duple', 'strong–weak');
  meterRow(rowY.triple, 3, 'triple', 'strong–weak–weak');
  o += text(xb(N) - 10, rowY.duple - 24, '竖线 = bar line；大黑点 = downbeat', 'ts', 'end');
  o += text(10, rowY.rhy + 2, 'rhythm', 'tb') + text(10, rowY.rhy + 17, '叠在 beat 上的长短', 'ts');
  const pat = [[0, 1], [1, 1.5], [1.5, 3], [3, 4]];
  for (let g = 0; g < 3; g++) pat.forEach(([s0, e0], j) => {
    const a = 4 * g + s0, z = 4 * g + e0;
    o += rect(xb(a), rowY.rhy - 7, xb(z) - xb(a) - 3, 14, j === 2 ? 'solid' : 'solid2', 3);
    o += `<g>${rect(xb(a) - 3, rowY.rhy - 11, 8, 22, 'ln', 2)}${flash(a * b, 0.28, T)}</g>`;
  });
  o += line(xb(2), rowY.rhy - 16, xb(2), rowY.rhy + 16, 'dash');
  o += text((xb(1.5) + xb(3)) / 2, rowY.rhy + 34, '从半拍起、跨过第 3 拍：syncopation', 'tl', 'middle');
  const ph = (x) => d([[x, 30], [x, 226]]);
  o += apath([ph(xb(0)), ph(xb(N)), ph(xb(N))], [0, Tp / T, 1], T, 'ln');
  return svgA(560, 252, o, '动图：72 bpm 的 12 拍。同一串 beat 两拍一组是 duple，三拍一组是 triple；下面的 rhythm 里有一个从半拍开始、跨过下一拍的 note，是 syncopation');
}

// ---------- 第 3 站：sanfen sunyi 生成五声 ----------
function sanfen() {
  const seq = [['gong', 81], ['zhi', 108], ['shang', 72], ['yu', 96], ['jue', 64]];
  const base = 196, k = 1.3;
  let o = text(14, 12, '按生成的顺序：每一步把 pipe 加长或截短三分之一', 'tb');
  seq.forEach(([nm, len], i) => {
    const x = 40 + i * 68, h = len * k;
    o += rect(x, base - h, 26, h, 'paper', 3) + rect(x + 5, base - h, 16, 5, 'wash-strong', 1);
    o += text(x + 13, base + 18, nm, 'tb', 'middle') + text(x + 13, base + 34, String(len), 'ts', 'middle');
    if (i < 4) {
      const nx = 40 + (i + 1) * 68, up = i % 2 === 0;
      o += arrow(x + 28, 40, nx - 2, 40, 'ink', 6) + text((x + 26 + nx) / 2, 32, up ? '×4/3' : '×2/3', 'ts', 'middle');
    }
  });
  o += text(14, base + 58, '×4/3：pipe 长三分之一，低一个 fourth；×2/3：短三分之一，高一个 fifth', 'ts');
  // 右：按 pitch 排
  const lad = [['zhi', 108], ['yu', 96], ['gong', 81], ['shang', 72], ['jue', 64], ['zhi′', 54]];
  const cs = lad.map(([, l]) => cents(108 / l));
  const yy = (c) => base - 4 - c * 0.13, X = 420;
  o += text(470, 12, '按 pitch 排（从 zhi 起）', 'tb', 'middle');
  o += line(X, yy(0) + 6, X, yy(1200) - 6, 'axis');
  lad.forEach(([nm], i) => {
    o += circle(X, yy(cs[i]), 4, 'ink-f') + text(X - 10, yy(cs[i]) + 4, nm, i === 2 ? 'tl' : 't', 'end');
    if (i < lad.length - 1) {
      const r = lad[i][1] / lad[i + 1][1], c = cs[i + 1] - cs[i], small = Math.abs(r - 9 / 8) < 1e-9;
      o += text(X + 12, (yy(cs[i]) + yy(cs[i + 1])) / 2 + 4, (small ? '9:8' : '32:27') + '，' + Math.round(c) + '¢', small ? 'ts' : 'tl');
    }
  });
  return svg(560, 262, o, '三分损益：从长 81 的 pipe 出发，交替乘 4/3 和 2/3，得到 108、72、96、64；按 pitch 排列后相邻 interval 是 9:8 或 32:27');
}

// ---------- 第 3 站：几种 scale 怎样分 octave ----------
function scales() {
  const sx = lin(0, 1200, 176, 536);
  const rows = [
    ['major', 'C D E F G A B', [0, 200, 400, 500, 700, 900, 1100, 1200]],
    ['natural minor', 'C D E♭ F G A♭ B♭', [0, 200, 300, 500, 700, 800, 1000, 1200]],
    ['gong mode', '三分损益的五声，从 gong 起', [0, 204, 408, 702, 906, 1200]],
    ['in scale', 'E F A B C（koto、shamisen）', [0, 100, 500, 700, 800, 1200]],
    ['slendro（理想化）', '五个音等分 octave', [0, 240, 480, 720, 960, 1200]],
  ];
  let o = text(sx(0), 14, '0', 'ts', 'middle') + text(sx(600), 14, '600¢', 'ts', 'middle') + text(sx(1200), 14, '1200¢（octave）', 'ts', 'end');
  for (let c = 0; c <= 1200; c += 100) o += line(sx(c), 22, sx(c), 236, 'grid');
  rows.forEach(([nm, sub, cs], i) => {
    const y = 46 + i * 44;
    o += text(0, y + 2, nm, 'tb') + text(0, y + 17, sub, 'ts');
    o += line(sx(0), y, sx(1200), y, 'axis');
    for (let j = 0; j < cs.length - 1; j++) {
      const step = cs[j + 1] - cs[j], semi = step <= 112;
      if (semi) o += line(sx(cs[j]) + 4, y, sx(cs[j + 1]) - 4, y, 'ln');
      o += text((sx(cs[j]) + sx(cs[j + 1])) / 2, y - 7, String(step), semi ? 'tl' : 'ts', 'middle');
    }
    cs.forEach((c) => (o += circle(sx(c), y, 4, 'ink-f')));
  });
  o += text(176, 262, '数字是相邻两音的距离（cents）；粗线标出 semitone 一级的小步。', 'ts');
  return svg(560, 270, o, '五种 scale 在 0 到 1200 cents 的 octave 里的位置：major、natural minor、gong mode 五声、Japanese in scale、理想化的 slendro');
}

// ---------- 第 4 站：四种 texture ----------
function texture() {
  const mel = [0, 2, 4, 2, 5, 4, 2, 0];
  const panel = (x0, y0, title, desc, draw) => rect(x0, y0, 266, 128, 'frame', 4) + text(x0 + 10, y0 + 18, title, 'tb') + text(x0 + 10, y0 + 34, desc, 'ts') + draw(x0 + 14, y0 + 118, 238 / 8);
  const bars = (X, Y, u, notes, off, lift, cls, dy = 6) => notes.map((p, i) => rect(X + (i + off) * u + 1, Y - (p + lift) * dy - 5, u - 2, 5, cls, 1)).join('');
  let o = '';
  o += panel(0, 0, 'monophony', '只有一条 line（unison 齐唱也算）', (X, Y, u) => bars(X, Y, u, mel, 0, 4, 'solid'));
  o += panel(282, 0, 'homophony', '一条 melody，加成块的 chord', (X, Y, u) => {
    let q = bars(X, Y, u, mel, 0, 7, 'solid', 5);
    const roots = [0, 0, 3, 3, 1, 1, 0, 0];
    for (let i = 0; i < 8; i += 2) for (const s of [0, 2, 4]) q += rect(X + i * u + 1, Y - (roots[i] + s) * 4 - 4, 2 * u - 2, 4, 'solid2', 1);
    return q;
  });
  o += panel(0, 140, 'polyphony', '两条独立的 line；第二条晚两拍模仿第一条', (X, Y, u) =>
    bars(X, Y, u, mel.slice(0, 7), 0, 6, 'solid') + bars(X, Y, u, mel.slice(0, 6), 2, 0, 'solid2'));
  o += panel(282, 140, 'heterophony', '同一条 melody 的两种走法同时进行', (X, Y, u) => {
    let q = bars(X, Y, u, mel, 0, 4, 'solid2');
    const seg = (t0, t1, p) => rect(X + t0 * u + 1, Y - (p + 4) * 6 - 13, (t1 - t0) * u - 2, 4, 'solid', 1);
    mel.forEach((p, i) => {
      const prev = i ? mel[i - 1] : p, lag = i ? 0.4 : 0;
      if (lag) q += seg(i, i + lag, prev);
      if (i % 2) q += seg(i + lag, i + 0.65, p) + seg(i + 0.65, i + 0.82, p + 1) + seg(i + 0.82, i + 1, p);
      else q += seg(i + lag, i + 1, p);
    });
    return q;
  });
  o += text(0, 286, '横轴是时间，纵轴是 pitch；同一种颜色是同一条 line。', 'ts');
  o += text(0, 302, 'Heterophony 里上面那条细的和下面的 melody 是同一个曲调：每个新音都晚到一点，有几处加了装饰音。', 'ts');
  return svg(560, 308, o, '四个小图：monophony 一条线；homophony 一条 melody 加成块的 chord；polyphony 两条独立并互相模仿的线；heterophony 同一条 melody 的朴素版和装饰版同时进行');
}

// ---------- 第 4 站：form 的几种排法 ----------
function form() {
  const cls = { A: 'wash-strong', B: 'wash', C: 'wash2' };
  const block = (x, y, w, lab, sub) => {
    const k = lab[0];
    return rect(x, y, w - 4, 30, (cls[k] || 'wash2') + '', 3) + rect(x, y, w - 4, 30, 'frame', 3) + text(x + (w - 4) / 2, y + 20, lab, 'tb', 'middle') + (sub ? text(x + (w - 4) / 2, y + 44, sub, 'ts', 'middle') : '');
  };
  let o = '';
  const X = 150;
  const row = (i, name, desc, items) => {
    const y = 14 + i * 60;
    o += text(0, y + 14, name, 'tb') + text(0, y + 30, desc, 'ts');
    let x = X;
    for (const [lab, w, sub] of items) { o += block(x, y, w, lab, sub); x += w; }
  };
  row(0, 'strophic', '同一段音乐配不同的 text', [['A', 128, 'verse 1'], ['A', 128, 'verse 2'], ['A', 128, 'verse 3']]);
  row(1, 'ternary', '离开，再回来', [['A', 128], ['B', 128], ['A', 128]]);
  row(2, 'rondo', 'Mouret 那一段（第 11 讲）', [['A', 72, '8 bars'], ['B', 72, '8 bars'], ['A', 56, '缩短'], ['C', 108, '约 20 bars'], ['A', 72]]);
  row(3, 'theme and variations', 'Brahms：每段都是 a b c b', [['a b c b', 96, 'theme'], ['a′ b′ c′ b′', 96, 'var. 1'], ['a″ b″ c″ b″', 96, 'var. 2'], ['…', 96]]);
  // ostinato：上面一直变，下面同一个 cycle
  const y = 14 + 4 * 60;
  o += text(0, y + 12, 'ostinato', 'tb') + text(0, y + 28, '下层同一个 cycle 一再重复，', 'ts') + text(0, y + 43, '上层不断变化', 'ts');
  const tops = ['A', 'B', 'C', 'D', 'E'];
  for (let j = 0; j < 5; j++) {
    o += rect(X + j * 77, y, 73, 20, j % 2 ? 'wash' : 'wash2', 3) + text(X + j * 77 + 36, y + 14, 'upper ' + tops[j], 'ts', 'middle');
    o += rect(X + j * 77, y + 24, 73, 20, 'solid2', 3) + text(X + j * 77 + 36, y + 38, 'bass cycle', 'tw', 'middle');
  }
  return svg(560, 306, o, '五种 form 的排法：strophic 的 A A A，ternary 的 A B A，rondo 的 A B A C A，theme and variations 的每段 a b c b，ostinato 的下层重复、上层变化');
}

// ---------- 第 5 站：ladrang 的 colotomic cycle（动图） ----------
const LADRANG = (() => {
  const kethuk = [], kempul = [], kenong = [];
  for (let k = 1; k <= 32; k++) {
    const m = ((k - 1) % 8) + 1; // 在 kenongan 里的第几拍
    if (m === 2 || m === 6) kethuk.push(k);
    if (m === 8) kenong.push(k);
    if (m === 4 && k > 8) kempul.push(k);
  }
  return { kethuk, kempul, kenong, wela: [4], gong: [32] };
})();
function ladrang() {
  const cx = 158, cy = 158, beat = 0.6, T = 32 * beat;
  const P = (k, r) => [cx + r * Math.cos((-90 + (360 * k) / 32) * R), cy + r * Math.sin((-90 + (360 * k) / 32) * R)];
  const rings = { kethuk: 112, kempul: 88, kenong: 64, gong: 36 };
  let o = '';
  for (const r of Object.values(rings)) o += circle(cx, cy, r, 'grid');
  for (let k = 1; k <= 32; k++) {
    const [x, y] = P(k, 134);
    o += circle(x, y, 2.2, 'mute-f');
    if (k % 4 === 0) { const [tx, ty] = P(k, 150); o += text(tx, ty + 4, String(k), k === 32 ? 'tl' : 'ts', 'middle'); }
  }
  // gatra 的分界：每 4 拍一条短线
  for (let g = 0; g < 8; g++) { const [a, b] = P(g * 4 + 0.5, 124), [c, e] = P(g * 4 + 0.5, 142); o += line(a, b, c, e, 'axis'); }
  const mark = (k, r, size, cls, on) => {
    const [x, y] = P(k, r);
    let q = circle(x, y, size, cls);
    q += `<g>${circle(x, y, size + 5, 'ln')}${k === 32 ? flashWrap(0.5, T) : flash(k * beat, 0.45, T)}</g>`;
    return on ? q : '';
  };
  for (const k of LADRANG.kethuk) o += mark(k, rings.kethuk, 4, 'ink-f', true);
  for (const k of LADRANG.kempul) o += mark(k, rings.kempul, 6.5, 'paper', true);
  { const [x, y] = P(4, rings.kempul); o += circle(x, y, 6.5, 'dash'); }
  for (const k of LADRANG.kenong) o += mark(k, rings.kenong, 7.5, 'solid2', true);
  o += mark(32, rings.gong, 11, 'solid', true);
  // pointer
  const [px, py] = P(0, 128);
  o += `<g>${line(cx, cy, px, py, 'ln')}${animRot([0, 360], cx, cy, [0, 1], T)}</g>` + circle(cx, cy, 3, 'ink-f');
  // 右边：图例和拍位
  const X = 330, Lx = 344;
  const leg = [
    ['gong ageng', LADRANG.gong.join(', ') + '（cycle 的最后一拍）', (x, y) => circle(x, y, 8, 'solid')],
    ['kenong', LADRANG.kenong.join(', '), (x, y) => circle(x, y, 7, 'solid2')],
    ['kempul', LADRANG.kempul.join(', ') + '（4 是 wela，空着）', (x, y) => circle(x, y, 6, 'paper')],
    ['kethuk', LADRANG.kethuk.slice(0, 3).join(', ') + ', …, ' + LADRANG.kethuk[7], (x, y) => circle(x, y, 4, 'ink-f')],
    ['balungan', '每一拍（外圈小点）', (x, y) => circle(x, y, 2.5, 'mute-f')],
  ];
  o += text(X, 26, 'ladrang：一个 gongan 32 拍', 'tb');
  leg.forEach(([nm, s, sym], i) => {
    const y = 58 + i * 40;
    o += sym(Lx, y - 4) + text(Lx + 16, y, nm, 'tb') + text(Lx + 16, y + 16, s, 'ts');
  });
  o += text(X, 270, '8 个 gatra（每个 4 拍，外圈短线分开）；', 'ts') + text(X, 286, '越大、越低的 gong 打得越稀，全部汇向 32。', 'ts');
  return svgA(560, 316, o, '动图：ladrang 的 32 拍排成一圈，32 在最上面。指针顺时针走，kethuk 在 2、6、10……30，kempul 在 12、20、28，kenong 在 8、16、24、32，gong ageng 在 32');
}

// ---------- 第 5 站：irama I 与 irama II 的层次（动图） ----------
function irama() {
  const Tw = 8, T = Tw + 1.2, x0 = 118, W = 418, tx = (t) => x0 + (W * t) / Tw;
  const insts = [['peking', 3, 'ln-f'], ['balungan', 4, 'ink-f'], ['kethuk', 4.5, 'ink-f'], ['kempul', 6, 'paper'], ['kenong', 6.5, 'solid2'], ['gong', 8, 'solid']];
  let o = '';
  const panel = (y0, title, beatLen, pekPer) => {
    const st = { peking: [], balungan: [], kethuk: [], kempul: [], kenong: [], gong: [] };
    let last = 24;
    for (let j = 1; j * beatLen <= Tw + 1e-9; j++) {
      const t = j * beatLen, k = 24 + j; // 第 25 到 32 拍：最后一个 kenongan
      last = k;
      st.balungan.push(t);
      if (LADRANG.kethuk.includes(k)) st.kethuk.push(t);
      if (LADRANG.kempul.includes(k)) st.kempul.push(t);
      if (LADRANG.kenong.includes(k)) st.kenong.push(t);
      if (k === 32) st.gong.push(t);
      for (let q = 1; q <= pekPer; q++) st.peking.push(t - beatLen + (q * beatLen) / pekPer);
    }
    o += text(0, y0, title, 'tb') + text(x0, y0, `balungan ${st.balungan.length} 拍（第 25 到 ${last} 拍），peking ${st.peking.length} 下，每拍 ${pekPer} 下`, 'ts');
    insts.forEach(([nm, r, cls], i) => {
      const y = y0 + 22 + i * 21;
      o += text(0, y + 4, nm, 'ts') + line(x0, y, x0 + W, y, 'grid');
      for (const t of st[nm]) {
        const x = tx(t) - (t >= Tw ? r : 0);
        o += circle(x, y, r, cls) + `<g>${circle(x, y, r + 4, 'ln')}${flash(t, 0.22, T)}</g>`;
      }
    });
  };
  panel(14, 'irama I', 1, 2);
  panel(192, 'irama II', 2, 4);
  const Y = 336;
  o += line(x0, Y, x0 + W, Y, 'axis');
  for (let t = 0; t <= Tw; t += 2) o += line(tx(t), Y, tx(t), Y + 4, 'axis') + text(tx(t), Y + 17, t + ' s', 'ts', 'middle');
  o += text(0, Y + 4, '同样的 8 s', 'ts');
  const ph = (x) => d([[x, 20], [x, Y]]);
  o += apath([ph(x0), ph(x0 + W), ph(x0 + W)], [0, Tw / T, 1], T, 'ln');
  o += text(x0 + W, 166, '一个 kenongan 走完：kenong 与 gong 在第 32 拍一起落下', 'ts', 'end');
  return svgA(560, 360, o, '动图：同样 8 秒里两种 irama 的各层乐器。irama I 时 balungan 每秒一拍，peking 每拍两下；irama II 时 balungan 两秒一拍，peking 每拍四下，peking 实际的快慢不变，框架被拉长一倍');
}

// ---------- 第 6 站：Yaman 与 Bhupali ----------
function raga() {
  const yy = (c) => 236 - (c + 100) * 0.15;
  const NOTE = { 'Ṇi': -100, Sa: 0, Re: 200, Ga: 400, Ma: 500, 'Ma♯': 600, Pa: 700, Dha: 900, Ni: 1100, 'Sȧ': 1200 };
  let o = '';
  for (const c of [0, 700, 1200]) o += rect(0, yy(c) - 5, 556, 10, 'wash', 2);
  const panel = (x0, title, sub, used, aroha, avaroha, vadi, samvadi) => {
    o += text(x0, 14, title, 'tb') + text(x0, 30, sub, 'ts');
    const ladder = ['Ṇi', 'Sa', 'Re', 'Ga', used.includes('Ma♯') ? 'Ma♯' : 'Ma', 'Pa', 'Dha', 'Ni', 'Sȧ'];
    for (const n of ladder) {
      const y = yy(NOTE[n]), on = used.includes(n);
      o += line(x0 + 52, y, x0 + 210, y, on ? 'ink' : 'grid') + text(x0 + 44, y + 4, n, on ? 't' : 'ts', 'end');
    }
    const pa = aroha.map((n, i) => [x0 + 62 + i * 10, yy(NOTE[n])]);
    const pd = avaroha.map((n, i) => [x0 + 134 + i * 10, yy(NOTE[n])]);
    o += path(d(pa), 'ln') + path(d(pd), 'ln-dash');
    for (const p of [...pa, ...pd]) o += circle(p[0], p[1], 2.6, 'ln-f');
    o += text(x0 + 56, yy(-100) + 22, 'aroha（上行）', 'ts') + text(x0 + 136, yy(-100) + 22, 'avaroha（下行）', 'ts');
    o += circle(x0 + 218, yy(NOTE[vadi]), 6, 'solid') + text(x0 + 228, yy(NOTE[vadi]) + 4, 'vadi', 'tl');
    o += circle(x0 + 218, yy(NOTE[samvadi]), 6, 'paper') + text(x0 + 228, yy(NOTE[samvadi]) + 4, 'samvadi', 'tb');
  };
  panel(0, 'Raga Yaman', 'Ma 用 tivra；aroha 从低音 Ni 起、跳过 Pa', ['Ṇi', 'Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni', 'Sȧ'],
    ['Ṇi', 'Re', 'Ga', 'Ma♯', 'Dha', 'Ni', 'Sȧ'], ['Sȧ', 'Ni', 'Dha', 'Pa', 'Ma♯', 'Ga', 'Re', 'Sa'], 'Ga', 'Ni');
  panel(290, 'Raga Bhupali', '只有五个音（audav）', ['Sa', 'Re', 'Ga', 'Pa', 'Dha', 'Sȧ'],
    ['Sa', 'Re', 'Ga', 'Pa', 'Dha', 'Sȧ'], ['Sȧ', 'Dha', 'Pa', 'Ga', 'Re', 'Sa'], 'Ga', 'Dha');
  o += text(0, 280, '浅色横带是一直在响的 drone（Sa 与 Pa）；灰色的音名和细线是这个 raga 不用的音。', 'ts');
  o += text(0, 296, '纵轴按 equal temperament 的 cents 画，只为看清位置；实际的 intonation 由歌者对着 drone 校准。', 'ts');
  return svg(560, 302, o, 'Raga Yaman 与 Raga Bhupali 的音、上行与下行的走法、vadi 与 samvadi，以及一直在响的 Sa 和 Pa 的 drone');
}

// ---------- 第 6 站：tīntāl 的 cycle（动图） ----------
function tintal() {
  const cx = 150, cy = 150, Rr = 96, m = 0.5, T = 16 * m;
  const ang = (k) => (-90 + (360 * (k - 1)) / 16) * R; // 第 k 个 matra
  const P = (k, r) => [cx + r * Math.cos(ang(k)), cy + r * Math.sin(ang(k))];
  const bols = ['dhā', 'dhin', 'dhin', 'dhā', 'dhā', 'dhin', 'dhin', 'dhā', 'dhā', 'tin', 'tin', 'tā', 'tā', 'dhin', 'dhin', 'dhā'];
  let o = '';
  // vibhag 扇形
  for (let v = 0; v < 4; v++) {
    const a0 = ang(v * 4 + 1) - 11.25 * R, a1 = a0 + 90 * R, r0 = Rr - 30, r1 = Rr + 12;
    const pts = [];
    for (let s = 0; s <= 24; s++) { const a = a0 + ((a1 - a0) * s) / 24; pts.push([cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)]); }
    for (let s = 24; s >= 0; s--) { const a = a0 + ((a1 - a0) * s) / 24; pts.push([cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]); }
    o += path(d(pts) + 'Z', v === 2 ? 'wash2' : 'wash');
    o += line(cx + r0 * Math.cos(a0), cy + r0 * Math.sin(a0), cx + r1 * Math.cos(a0), cy + r1 * Math.sin(a0), 'ink');
  }
  for (let k = 1; k <= 16; k++) {
    const [x, y] = P(k, Rr - 10), [bx, by] = P(k, Rr + 26), [nx, ny] = P(k, Rr - 44);
    o += circle(x, y, k % 4 === 1 ? 6 : 3.5, k === 1 ? 'solid' : 'ink-f');
    o += `<g>${circle(x, y, 11, 'ln')}${k === 1 ? flashWrap(0.3, T) : flash((k - 1) * m, 0.3, T)}</g>`;
    o += text(bx, by + 4, bols[k - 1], k >= 10 && k <= 13 ? 'ts' : 't', 'middle');
    o += text(nx, ny + 4, String(k), 'ts', 'middle');
  }
  const marks = [[1, 'X'], [5, '2'], [9, '0'], [13, '3']];
  for (const [k, s] of marks) { const [x, y] = P(k - 0.55, Rr + 46); o += text(x, y + 6, s, 'tl', 'middle'); }
  const [px, py] = P(1, Rr + 4);
  o += `<g>${line(cx, cy, px, py, 'ln')}${animRot([0, 360], cx, cy, [0, 1], T)}</g>` + circle(cx, cy, 3, 'ink-f');
  const X = 338;
  o += text(X, 28, 'tīntāl：16 mātrā = 4 + 4 + 4 + 4', 'tb');
  const rows = [['X', 'sam：clap，mātrā 1'], ['2', 'tālī：clap，mātrā 5'], ['0', 'khālī：wave，mātrā 9'], ['3', 'tālī：clap，mātrā 13']];
  rows.forEach(([s, t], i) => { o += text(X + 6, 60 + i * 24, s, 'tl', 'middle') + text(X + 20, 60 + i * 24, t, 't'); });
  o += text(X, 172, '圈外是 theka 的 bol；灰底那一段', 'ts') + text(X, 188, '（mātrā 9 到 12）是 khālī，', 'ts') + text(X, 204, 'bol 换成 tin、tā。', 'ts');
  o += text(X, 236, '动图按每 mātrā 0.5 s：', 'ts') + text(X, 252, '一个 āvartan 8 s，回到 sam 重新开始。', 'ts');
  return svgA(560, 300, o, '动图：tintal 的 16 个 matra 排成一圈，分成四个 vibhag；sam 在最上面，clap 在 1、5、13，wave 在 9；圈外写着 theka 的 bol，指针每 0.5 秒走一个 matra');
}

// ---------- 第 6 站：tihai 落在 sam 上 ----------
function tihai() {
  const x0 = 70, u = 27.5, cx = (k) => x0 + (k - 1) * u;
  let o = '';
  for (let k = 1; k <= 17; k++) {
    o += rect(cx(k), 30, u - 3, 22, k === 17 ? 'wash-strong' : k >= 9 && k <= 12 ? 'wash2' : 'frame', 2);
    o += text(cx(k) + (u - 3) / 2, 46, k === 17 ? '1' : String(k), k === 17 || k === 1 ? 'tl' : 'ts', 'middle');
  }
  for (const [k, s] of [[1, 'X'], [5, '2'], [9, '0'], [13, '3'], [17, 'X']]) o += text(cx(k) + (u - 3) / 2, 22, s, 'tl', 'middle');
  o += text(0, 46, 'mātrā', 'ts') + text(cx(17) + u / 2, 68, '下一个 sam', 'ts', 'middle');
  const ex = (y, p, g) => {
    const total = 3 * p + 2 * g, start = 18 - total;
    o += text(0, y - 8, `phrase ${p} 拍` + (g ? `，中间空 ${g} 拍` : '，不留空'), 'tb');
    o += text(0, y + 26, `3 × ${p}` + (g ? ` + 2 × ${g}` : '') + ` = ${total}；起点 = 17 − ${total} = ${start}`, 'ts');
    let k = start;
    for (let r = 0; r < 3; r++) {
      o += rect(cx(k) + 1, y, p * u - 5, 14, r === 2 ? 'solid' : 'solid2', 3);
      k += p;
      if (r < 2 && g) { o += text(cx(k) + (g * u - 3) / 2, y + 11, '·', 'ts', 'middle'); k += g; }
    }
  };
  ex(104, 3, 1);
  ex(170, 5, 0);
  return svg(560, 206, o, '两种 tihai：3 拍的 phrase 中间各空 1 拍、从 matra 7 起；5 拍的 phrase 不留空、从 matra 3 起；两者的最后一个音都落在下一个 cycle 的 sam 上');
}

export default {
  'gec1014-string': string,
  'gec1014-timbre': timbre,
  'gec1014-meter': meter,
  'gec1014-sanfen': sanfen,
  'gec1014-scales': scales,
  'gec1014-texture': texture,
  'gec1014-form': form,
  'gec1014-ladrang': ladrang,
  'gec1014-irama': irama,
  'gec1014-raga': raga,
  'gec1014-tintal': tintal,
  'gec1014-tihai': tihai,
};
